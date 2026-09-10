/** Print a reduced extension entry containing one selected character and its local skill closure. */
import fs from "node:fs/promises";
import ts from "typescript";
const [fileName, selectedId, newName, fallbackImage] = process.argv.slice(2);
if (!fileName || !selectedId || !newName) throw new Error("usage: file characterId newName [fallbackCharacter]");
let source = await fs.readFile(fileName, "utf8");
const ast = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const key = (name: ts.PropertyName | undefined) => name && (ts.isIdentifier(name) || ts.isStringLiteralLike(name) || ts.isNumericLiteral(name)) ? name.text : undefined;
const prop = (object: ts.ObjectLiteralExpression, name: string) => object.properties.find(item => key(item.name) === name) as ts.PropertyAssignment | undefined;
const obj = (node: ts.Expression | undefined, label: string) => { if (!node || !ts.isObjectLiteralExpression(node)) throw new Error(`${label} is not an object`); return node; };
let extension: ts.ObjectLiteralExpression | undefined;
function find(node: ts.Node) {
  if (ts.isObjectLiteralExpression(node) && prop(node, "name")?.initializer && ts.isStringLiteralLike(prop(node, "name")!.initializer) && prop(node, "package")) extension ||= node;
  ts.forEachChild(node, find);
}
find(ast);
if (!extension) throw new Error("extension object not found");
const packageData = obj(prop(extension, "package")?.initializer, "package");
const characterSection = obj(prop(packageData, "character")?.initializer, "character section");
const characters = obj(prop(characterSection, "character")?.initializer, "character dictionary");
const selected = characters.properties.find(item => key(item.name) === selectedId);
if (!selected || !ts.isPropertyAssignment(selected) || !ts.isArrayLiteralExpression(selected.initializer)) throw new Error("selected character not found");
const skillSection = obj(prop(packageData, "skill")?.initializer, "skill section");
const skills = obj(prop(skillSection, "skill")?.initializer, "skill dictionary");
const skillMap = new Map(skills.properties.map(item => [key(item.name)!, item]));
const keepSkills = new Set<string>();
const queue: string[] = [];
const start = selected.initializer.elements[3];
if (!start || !ts.isArrayLiteralExpression(start)) throw new Error("skill list not static");
for (const item of start.elements) if (ts.isStringLiteralLike(item)) queue.push(item.text);
while (queue.length) {
  const requested = queue.shift()!;
  const own = skillMap.has(requested) ? requested : [...skillMap.keys()].find(id => requested.startsWith(id + "_"));
  if (!own || keepSkills.has(own)) continue;
  keepSkills.add(own);
  function refs(node: ts.Node) {
    if (ts.isStringLiteralLike(node)) {
      if (skillMap.has(node.text)) queue.push(node.text);
      else for (const id of skillMap.keys()) if (node.text.startsWith(id + "_")) queue.push(id);
    }
    ts.forEachChild(node, refs);
  }
  refs(skillMap.get(own)!);
}
const edits: { start: number; end: number; text: string }[] = [];
const replace = (node: ts.Node, text: string) => edits.push({ start: node.getStart(ast), end: node.end, text });
const objectText = (properties: readonly ts.ObjectLiteralElementLike[]) => `{\n${properties.map(item => item.getText(ast)).join(",\n")}\n}`;
let selectedText = selected.getText(ast);
if (fallbackImage) {
  const data = selected.initializer.elements.map(item => item.getText(ast));
  data[4] = `["character:${fallbackImage}"]`;
  selectedText = `${selected.name.getText(ast)}: [${data.join(",")}]`;
}
replace(characters, `{\n${selectedText}\n}`);
replace(skills, objectText(skills.properties.filter(item => keepSkills.has(key(item.name)!))));
for (const section of [characterSection, skillSection]) {
  const translate = prop(section, "translate");
  if (!translate || !ts.isObjectLiteralExpression(translate.initializer)) continue;
  const kept = translate.initializer.properties.filter(item => {
    const id = key(item.name);
    return !!id && (id === selectedId || id === `${selectedId}_info` || [...keepSkills].some(skill => id === skill || id === `${skill}_info` || id.startsWith(`#${skill}`)));
  });
  replace(translate.initializer, objectText(kept));
}
for (const name of ["content", "precontent"]) {
  const item = prop(extension, name);
  if (item) replace(item.initializer, "function () {} ");
}
const config = prop(extension, "config");
if (config) replace(config.initializer, "{}");
const nameProperty = prop(extension, "name")!;
replace(nameProperty.initializer, JSON.stringify(newName));
source = edits.sort((a, b) => b.start - a.start).reduce((text, edit) => text.slice(0, edit.start) + edit.text + text.slice(edit.end), source);
source = source.split(`extension/${(nameProperty.initializer as ts.StringLiteralLike).text}/`).join(`extension/${newName}/`);
source = source.split(`ext:${(nameProperty.initializer as ts.StringLiteralLike).text}`).join(`ext:${newName}`);
new Function(source.replace(/^import[^\n]*\n/gm, "").replace(/export const type[^\n]*\n/, "").replace("export default function", "return function"));
console.error(JSON.stringify({ selectedId, newName, retainedSkills: [...keepSkills], removedCharacters: characters.properties.length - 1 }));
process.stdout.write(source);
