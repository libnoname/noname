import ts from "typescript";
import { digest, safePath } from "./archive.js";

export interface Analysis {
	name: string;
	source: string;
	characters: string[];
	skills: Record<string, string>;
	warnings: string[];
	metadata: Record<string, string>;
}
interface Shape {
	file: ts.SourceFile;
	extension: ts.ObjectLiteralExpression;
	characterSection: ts.ObjectLiteralExpression;
	characters: ts.ObjectLiteralExpression;
	skillSection?: ts.ObjectLiteralExpression;
	skills?: ts.ObjectLiteralExpression;
	esm: boolean;
}
const printer = ts.createPrinter({ removeComments: true });
const key = (node: ts.PropertyName | undefined): string | undefined => (node && (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) ? node.text : undefined);
function property(object: ts.ObjectLiteralExpression, name: string) {
	return object.properties.find(p => key(p.name) === name);
}
function value(object: ts.ObjectLiteralExpression, name: string) {
	const p = property(object, name);
	return p && ts.isPropertyAssignment(p) ? p.initializer : undefined;
}
function object(node: ts.Node | undefined, label: string): ts.ObjectLiteralExpression {
	if (!node || !ts.isObjectLiteralExpression(node)) throw new Error(`${label}不是直接声明的对象（暂不自动改写模块/变量/动态表达式）`);
	const keys = new Set<string>();
	for (const p of node.properties) {
		const k = key(p.name);
		if (k === undefined || keys.has(k) || ts.isGetAccessor(p) || ts.isSetAccessor(p)) throw new Error(`${label}含展开、计算属性、访问器或重复键`);
		keys.add(k);
	}
	return node;
}
function singleReturn(node: ts.Expression | ts.Node) {
	if (ts.isObjectLiteralExpression(node)) return node;
	if (ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isFunctionDeclaration(node)) {
		if (!node.body) throw new Error("扩展工厂缺少函数体");
		if (!ts.isBlock(node.body)) return node.body;
		const statements = node.body.statements.filter(s => !ts.isEmptyStatement(s));
		if (statements.length === 1 && ts.isReturnStatement(statements[0]) && statements[0].expression) return statements[0].expression;
	}
	throw new Error("扩展工厂包含动态初始化或多个执行语句，需要专用适配器");
}
export function parseSource(source: string) {
	const file = ts.createSourceFile("extension.js", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
	const errors = (file as ts.SourceFile & { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics;
	if (errors.length) throw new Error(`入口语法错误：${ts.flattenDiagnosticMessageText(errors[0].messageText, " ")}`);
	return file;
}
function shape(source: string): Shape {
	const file = parseSource(source);
	let extension: ts.ObjectLiteralExpression | undefined,
		esm = false,
		hasType = false,
		hasDefault = false;
	for (const statement of file.statements) {
		if (ts.isEmptyStatement(statement)) continue;
		if (ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression) && statement.expression.text === "use strict") continue;
		if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier) && ["noname", "../../noname.js"].includes(statement.moduleSpecifier.text)) {
			const bindings = statement.importClause?.namedBindings;
			if (!bindings || !ts.isNamedImports(bindings) || bindings.elements.some(e => e.propertyName && e.name.text !== e.propertyName.text)) throw new Error("不支持主程序导入别名");
			esm = true;
			continue;
		}
		if (ts.isVariableStatement(statement) && statement.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) && statement.declarationList.declarations.length === 1) {
			const d = statement.declarationList.declarations[0];
			if (ts.isIdentifier(d.name) && d.name.text === "type" && d.initializer && ts.isStringLiteral(d.initializer) && d.initializer.text === "extension") {
				esm = true;
				hasType = true;
				continue;
			}
		}
		if (ts.isExportAssignment(statement) && !statement.isExportEquals && !extension) {
			extension = object(singleReturn(statement.expression), "扩展定义");
			esm = true;
			hasDefault = true;
			continue;
		}
		if (ts.isExpressionStatement(statement) && ts.isCallExpression(statement.expression) && statement.expression.expression.getText(file) === "game.import" && !extension) {
			const args = statement.expression.arguments;
			if (args.length !== 2 || !ts.isStringLiteral(args[0]) || args[0].text !== "extension") throw new Error("入口包含其他类型注册");
			if (!ts.isFunctionExpression(args[1]) && !ts.isArrowFunction(args[1]) && !ts.isObjectLiteralExpression(args[1])) throw new Error("扩展工厂不是直接声明的函数或对象");
			const params = ts.isObjectLiteralExpression(args[1]) ? [] : args[1].parameters;
			if (params.some((p, i) => p.name.getText(file) !== ["lib", "game", "ui", "get", "ai", "_status"][i] || p.initializer || p.dotDotDotToken)) throw new Error("扩展工厂使用非标准参数");
			extension = object(singleReturn(args[1]), "扩展定义");
			continue;
		}
		throw new Error("入口包含外部模块或动态顶层代码，需要专用适配器");
	}
	if (!extension) throw new Error("未识别到扩展注册入口");
	if (esm && (!hasType || !hasDefault)) throw new Error("ESM 入口必须导出 type=extension 和 default");
	const pack = object(value(extension, "package"), "package");
	const characterSection = object(value(pack, "character"), "package.character");
	const characters = object(value(characterSection, "character"), "武将字典");
	const skillNode = value(pack, "skill");
	const skillSection = skillNode ? object(skillNode, "技能区") : undefined;
	const skills = skillSection && value(skillSection, "skill") ? object(value(skillSection, "skill"), "技能字典") : undefined;
	return { file, extension, characterSection, characters, skillSection, skills, esm };
}
function walk(node: ts.Node, visit: (node: ts.Node) => void) {
	visit(node);
	ts.forEachChild(node, child => {
		walk(child, visit);
	});
}
function pureData(node: ts.Node): boolean {
	if (ts.isStringLiteralLike(node) || ts.isNumericLiteral(node) || [ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NullKeyword].includes(node.kind)) return true;
	if (ts.isPrefixUnaryExpression(node) && [ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken].includes(node.operator)) return pureData(node.operand);
	if (ts.isArrayLiteralExpression(node)) return node.elements.every(pureData);
	if (ts.isObjectLiteralExpression(node)) return node.properties.every(p => ts.isPropertyAssignment(p) && key(p.name) !== undefined && pureData(p.initializer));
	return false;
}
function inside(node: ts.Node, container: ts.Node) {
	return node.pos >= container.pos && node.end <= container.end;
}
function member(node: ts.Node): string | undefined {
	if (ts.isIdentifier(node)) return node.text;
	if (ts.isPropertyAccessExpression(node)) {
		const base = member(node.expression);
		return base && `${base}.${node.name.text}`;
	}
	if (ts.isElementAccessExpression(node)) {
		const base = member(node.expression);
		return base && `${base}.${ts.isStringLiteralLike(node.argumentExpression) ? node.argumentExpression.text : "*"}`;
	}
}
function inspectCode(s: Shape) {
	let nestedImports = 0;
	walk(s.file, node => {
		const name = member(node);
		if (name && /^(lib\.(character|characterPack|skill|imported)|game\.import)(\.|$)/.test(name)) {
			const parent = node.parent;
			const increment = (ts.isPostfixUnaryExpression(parent) || ts.isPrefixUnaryExpression(parent)) && [ts.SyntaxKind.PlusPlusToken, ts.SyntaxKind.MinusMinusToken].includes(parent.operator);
			if ((ts.isBinaryExpression(parent) && parent.left === node && parent.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && parent.operatorToken.kind <= ts.SyntaxKind.LastAssignment) || ts.isDeleteExpression(parent) || increment) throw new Error(`动态注册/修改全局定义：${name}`);
			if ((ts.isVariableDeclaration(parent) && parent.initializer === node) || (ts.isBinaryExpression(parent) && parent.right === node && parent.operatorToken.kind === ts.SyntaxKind.EqualsToken)) throw new Error(`注册表别名无法可靠追踪：${name}`);
		}
		if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
			const called = member(node.expression) ?? node.expression.getText(s.file);
			if (called === "game.import" && ++nestedImports > (s.esm ? 0 : 1)) throw new Error("包含额外的运行时扩展/武将注册");
			if (/^(eval|Function|require|import)$/.test(called) || /^(lib\.init\.(js|jsForExtension)|game\.(addCharacter|addCharacterPack|addSkill|addSkillPack|loadExtension))$/.test(called)) throw new Error(`动态加载/注册调用：${called}`);
			if (node.arguments?.some(a => /^(lib\.(character|characterPack|skill|imported)|game\.import)(\.|$)/.test(member(a) ?? ""))) throw new Error("全局注册表传入函数，无法确认是否修改");
		}
		if (ts.isVariableDeclaration(node) && node.initializer && ["lib", "game"].includes(member(node.initializer) ?? "")) throw new Error("主程序对象别名无法可靠追踪");
	});
}

export function analyze(source: string, fileNames: string[], info?: unknown, auxiliary: Record<string, string> = {}): Analysis {
	const s = shape(source);
	const nameNode = value(s.extension, "name");
	if (!nameNode || !ts.isStringLiteralLike(nameNode) || !nameNode.text) throw new Error("扩展名不是固定字符串");
	const name = nameNode.text;
	safePath(name);
	if (name.includes("/") || name.includes("\\")) throw new Error("扩展名不能含目录分隔符");
	if (info && (typeof info !== "object" || (info as { name?: string }).name !== name)) throw new Error("info.json 名称与入口不一致");
	if (fileNames.includes("package.js")) {
		const catalog = parseSource(auxiliary["package.js"] ?? "");
		const statement = catalog.statements.filter(s => !ts.isEmptyStatement(s));
		const expression = statement.length === 1 && ts.isExpressionStatement(statement[0]) ? statement[0].expression : undefined;
		if (!expression || !ts.isBinaryExpression(expression) || expression.operatorToken.kind !== ts.SyntaxKind.EqualsToken || member(expression.left) !== `extension.${name}` || !pureData(expression.right)) throw new Error("package.js 不是纯静态扩展目录元数据");
	}
	if (fileNames.some(n => /\.(?:[cm]?js|ts|html?)$/i.test(n) && !["extension.js", "package.js"].includes(n) && !/\.d\.ts$/i.test(n))) throw new Error("扩展包含其他脚本/页面，当前仅自动处理单脚本扩展");
	inspectCode(s);
	const names = new Set(fileNames);
	walk(s.file, node => {
		if (!ts.isStringLiteralLike(node)) return;
		const asset = /^ext:([^/:]+)(?:\/([^?#]+)|:(\d+))$/.exec(node.text);
		if (asset && asset[1] !== name) throw new Error(`依赖其他扩展资源：${asset[1]}`);
		if (asset?.[2] && /\.[a-z0-9]{2,5}$/i.test(asset[2]) && !names.has(asset[2])) throw new Error(`显式资源路径缺失：${asset[2]}`);
	});
	const characters: string[] = [];
	for (const p of s.characters.properties) {
		if (!ts.isPropertyAssignment(p) || !pureData(p.initializer)) throw new Error("武将定义包含动态表达式");
		const data = p.initializer;
		const skillList = ts.isArrayLiteralExpression(data) ? data.elements[3] : ts.isObjectLiteralExpression(data) ? value(data, "skills") : undefined;
		if (!skillList || !ts.isArrayLiteralExpression(skillList) || !skillList.elements.every(ts.isStringLiteralLike)) throw new Error("武将技能列表无法静态识别");
		characters.push(key(p.name)!);
	}
	const skills: Record<string, string> = Object.create(null);
	function registerSkills(dictionary: ts.ObjectLiteralExpression, prefix = "") {
		for (const p of dictionary.properties) {
			if (!ts.isPropertyAssignment(p)) throw new Error("技能不是直接属性定义");
			const id = prefix + key(p.name)!;
			const definition = object(p.initializer, `技能 ${id}`);
			const fingerprint = digest(printer.printNode(ts.EmitHint.Unspecified, definition, s.file));
			if (Object.hasOwn(skills, id) && skills[id] !== fingerprint) throw new Error(`包内子技能 ID 冲突：${id}`);
			skills[id] = fingerprint;
			const sub = value(definition, "subSkill");
			if (sub) registerSkills(object(sub, `子技能 ${id}`), id + "_");
		}
	}
	if (s.skills) registerSkills(s.skills);
	const metadata: Record<string, string> = { name };
	for (const field of ["author", "version", "intro", "diskURL", "forumURL"]) {
		const pack = object(value(s.extension, "package"), "package");
		const node = value(pack, field);
		if (node && ts.isStringLiteralLike(node)) metadata[field] = node.text;
	}
	return { name, source, characters, skills, metadata, warnings: ["通过静态结构检查；第三方扩展的实际对局兼容性仍需游戏内验证", "保留技能和资源，以免破坏动态引用"] };
}

export function removeCharacters(analysis: Analysis, removed: string[]) {
	if (!removed.length) return analysis.source;
	const remove = new Set(removed);
	const s = shape(analysis.source);
	const knownMetadata = ["characterSort", "characterReplace", "characterIntro", "characterTitle", "characterFilter", "characterPerfectPair", "perfectPair", "translate"];
	const metadata = s.characterSection.properties.filter(p => knownMetadata.includes(key(p.name) ?? ""));
	// References outside the removed definitions and known registration metadata
	// may be transforms, summons or fixed lineups; don't silently break them.
	walk(s.file, node => {
		if (inside(node, s.characters) || metadata.some(p => inside(node, p))) return;
		if (ts.isStringLiteralLike(node) && remove.has(node.text)) throw new Error(`剔除武将仍被其他代码引用：${node.text}`);
		if (ts.isIdentifier(node) && remove.has(node.text)) throw new Error(`剔除武将仍被标识符引用：${node.text}`);
		const name = member(node);
		if (name && /^lib\.(character|characterPack|characterReplace)(\.|$)/.test(name)) throw new Error("剔除后存在动态武将表访问，不能确认独立运行");
	});
	const edits: { start: number; end: number; text: string }[] = [];
	edits.push({
		start: s.characters.getStart(s.file),
		end: s.characters.end,
		text: `{${s.characters.properties
			.filter(p => !remove.has(key(p.name)!))
			.map(p => p.getText(s.file))
			.join(",\n")}}`,
	});
	function clean(node: ts.Expression, kind: string): string {
		if (ts.isObjectLiteralExpression(node)) {
			object(node, kind);
			return `{${node.properties
				.filter(p => !remove.has(key(p.name)!))
				.map(p => {
					if (!ts.isPropertyAssignment(p)) throw new Error(`${kind}包含动态成员`);
					return `${p.name.getText(s.file)}: ${clean(p.initializer, kind)}`;
				})
				.join(",\n")}}`;
		}
		if (ts.isArrayLiteralExpression(node))
			return `[${node.elements
				.filter(e => !(ts.isStringLiteralLike(e) && remove.has(e.text)))
				.map(e => clean(e, kind))
				.join(",")} ]`;
		if (!pureData(node)) throw new Error(`${kind}包含动态元数据`);
		return node.getText(s.file);
	}
	for (const p of metadata) {
		if (!ts.isPropertyAssignment(p)) throw new Error("武将元数据不是静态属性");
		edits.push({ start: p.initializer.getStart(s.file), end: p.initializer.end, text: clean(p.initializer, key(p.name)!) });
	}
	// files is only an asset inventory: retain files and list together. Do not
	// delete resources by filename, since another skill can build a dynamic path.
	let output = analysis.source;
	for (const e of edits.sort((a, b) => b.start - a.start)) output = output.slice(0, e.start) + e.text + output.slice(e.end);
	parseSource(output);
	const remaining = shape(output).characters.properties.map(p => key(p.name)!);
	if (remaining.some(id => remove.has(id)) || remaining.length !== analysis.characters.length - removed.length) throw new Error("去重后武将校验失败");
	return output;
}
