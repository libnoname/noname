import { countColumn, EditorSelection, Prec, EditorState } from "../../../../../@codemirror_state@6.5.4/node_modules/@codemirror/state/dist/index.js";
import { keymap, EditorView } from "../../../../../@codemirror_view@6.39.14/node_modules/@codemirror/view/dist/index.js";
import { defineLanguageFacet, foldNodeProp, indentNodeProp, languageDataProp, foldService, syntaxTree, Language, LanguageDescription, ParseContext, indentUnit, LanguageSupport } from "../../../../../@codemirror_language@6.12.1/node_modules/@codemirror/language/dist/index.js";
import { CompletionContext } from "../../../../../@codemirror_autocomplete@6.20.0/node_modules/@codemirror/autocomplete/dist/index.js";
import { parser, GFM, Subscript, Superscript, Emoji, MarkdownParser, parseCode } from "../../../../../@lezer_markdown@1.6.3/node_modules/@lezer/markdown/dist/index.js";
import { html, htmlCompletionSource } from "../../../../../@codemirror_lang-html@6.4.11/node_modules/@codemirror/lang-html/dist/index.js";
import { NodeProp } from "../../../../../@lezer_common@1.5.1/node_modules/@lezer/common/dist/index.js";
const data = /* @__PURE__ */ defineLanguageFacet({ commentTokens: { block: { open: "<!--", close: "-->" } } });
const headingProp = /* @__PURE__ */ new NodeProp();
const commonmark = /* @__PURE__ */ parser.configure({
  props: [
    /* @__PURE__ */ foldNodeProp.add((type) => {
      return !type.is("Block") || type.is("Document") || isHeading(type) != null || isList(type) ? void 0 : (tree, state) => ({ from: state.doc.lineAt(tree.from).to, to: tree.to });
    }),
    /* @__PURE__ */ headingProp.add(isHeading),
    /* @__PURE__ */ indentNodeProp.add({
      Document: () => null
    }),
    /* @__PURE__ */ languageDataProp.add({
      Document: data
    })
  ]
});
function isHeading(type) {
  let match = /^(?:ATX|Setext)Heading(\d)$/.exec(type.name);
  return match ? +match[1] : void 0;
}
function isList(type) {
  return type.name == "OrderedList" || type.name == "BulletList";
}
function findSectionEnd(headerNode, level) {
  let last = headerNode;
  for (; ; ) {
    let next = last.nextSibling, heading;
    if (!next || (heading = isHeading(next.type)) != null && heading <= level)
      break;
    last = next;
  }
  return last.to;
}
const headerIndent = /* @__PURE__ */ foldService.of((state, start, end) => {
  for (let node = syntaxTree(state).resolveInner(end, -1); node; node = node.parent) {
    if (node.from < start)
      break;
    let heading = node.type.prop(headingProp);
    if (heading == null)
      continue;
    let upto = findSectionEnd(node, heading);
    if (upto > end)
      return { from: end, to: upto };
  }
  return null;
});
function mkLang(parser2) {
  return new Language(data, parser2, [], "markdown");
}
const commonmarkLanguage = /* @__PURE__ */ mkLang(commonmark);
const extended = /* @__PURE__ */ commonmark.configure([GFM, Subscript, Superscript, Emoji, {
  props: [
    /* @__PURE__ */ foldNodeProp.add({
      Table: (tree, state) => ({ from: state.doc.lineAt(tree.from).to, to: tree.to })
    })
  ]
}]);
const markdownLanguage = /* @__PURE__ */ mkLang(extended);
function getCodeParser(languages, defaultLanguage) {
  return (info) => {
    if (info && languages) {
      let found = null;
      info = /\S*/.exec(info)[0];
      if (typeof languages == "function")
        found = languages(info);
      else
        found = LanguageDescription.matchLanguageName(languages, info, true);
      if (found instanceof LanguageDescription)
        return found.support ? found.support.language.parser : ParseContext.getSkippingParser(found.load());
      else if (found)
        return found.parser;
    }
    return defaultLanguage ? defaultLanguage.parser : null;
  };
}
class Context {
  constructor(node, from, to, spaceBefore, spaceAfter, type, item) {
    this.node = node;
    this.from = from;
    this.to = to;
    this.spaceBefore = spaceBefore;
    this.spaceAfter = spaceAfter;
    this.type = type;
    this.item = item;
  }
  blank(maxWidth, trailing = true) {
    let result = this.spaceBefore + (this.node.name == "Blockquote" ? ">" : "");
    if (maxWidth != null) {
      while (result.length < maxWidth)
        result += " ";
      return result;
    } else {
      for (let i = this.to - this.from - result.length - this.spaceAfter.length; i > 0; i--)
        result += " ";
      return result + (trailing ? this.spaceAfter : "");
    }
  }
  marker(doc, add) {
    let number = this.node.name == "OrderedList" ? String(+itemNumber(this.item, doc)[2] + add) : "";
    return this.spaceBefore + number + this.type + this.spaceAfter;
  }
}
function getContext(node, doc) {
  let nodes = [], context = [];
  for (let cur = node; cur; cur = cur.parent) {
    if (cur.name == "FencedCode")
      return context;
    if (cur.name == "ListItem" || cur.name == "Blockquote")
      nodes.push(cur);
  }
  for (let i = nodes.length - 1; i >= 0; i--) {
    let node2 = nodes[i], match;
    let line = doc.lineAt(node2.from), startPos = node2.from - line.from;
    if (node2.name == "Blockquote" && (match = /^ *>( ?)/.exec(line.text.slice(startPos)))) {
      context.push(new Context(node2, startPos, startPos + match[0].length, "", match[1], ">", null));
    } else if (node2.name == "ListItem" && node2.parent.name == "OrderedList" && (match = /^( *)\d+([.)])( *)/.exec(line.text.slice(startPos)))) {
      let after = match[3], len = match[0].length;
      if (after.length >= 4) {
        after = after.slice(0, after.length - 4);
        len -= 4;
      }
      context.push(new Context(node2.parent, startPos, startPos + len, match[1], after, match[2], node2));
    } else if (node2.name == "ListItem" && node2.parent.name == "BulletList" && (match = /^( *)([-+*])( {1,4}\[[ xX]\])?( +)/.exec(line.text.slice(startPos)))) {
      let after = match[4], len = match[0].length;
      if (after.length > 4) {
        after = after.slice(0, after.length - 4);
        len -= 4;
      }
      let type = match[2];
      if (match[3])
        type += match[3].replace(/[xX]/, " ");
      context.push(new Context(node2.parent, startPos, startPos + len, match[1], after, type, node2));
    }
  }
  return context;
}
function itemNumber(item, doc) {
  return /^(\s*)(\d+)(?=[.)])/.exec(doc.sliceString(item.from, item.from + 10));
}
function renumberList(after, doc, changes, offset = 0) {
  for (let prev = -1, node = after; ; ) {
    if (node.name == "ListItem") {
      let m = itemNumber(node, doc);
      let number = +m[2];
      if (prev >= 0) {
        if (number != prev + 1)
          return;
        changes.push({ from: node.from + m[1].length, to: node.from + m[0].length, insert: String(prev + 2 + offset) });
      }
      prev = number;
    }
    let next = node.nextSibling;
    if (!next)
      break;
    node = next;
  }
}
function normalizeIndent(content, state) {
  let blank = /^[ \t]*/.exec(content)[0].length;
  if (!blank || state.facet(indentUnit) != "	")
    return content;
  let col = countColumn(content, 4, blank);
  let space = "";
  for (let i = col; i > 0; ) {
    if (i >= 4) {
      space += "	";
      i -= 4;
    } else {
      space += " ";
      i--;
    }
  }
  return space + content.slice(blank);
}
const insertNewlineContinueMarkupCommand = (config = {}) => ({ state, dispatch }) => {
  let tree = syntaxTree(state), { doc } = state;
  let dont = null, changes = state.changeByRange((range) => {
    if (!range.empty || !markdownLanguage.isActiveAt(state, range.from, -1) && !markdownLanguage.isActiveAt(state, range.from, 1))
      return dont = { range };
    let pos = range.from, line = doc.lineAt(pos);
    let context = getContext(tree.resolveInner(pos, -1), doc);
    while (context.length && context[context.length - 1].from > pos - line.from)
      context.pop();
    if (!context.length)
      return dont = { range };
    let inner = context[context.length - 1];
    if (inner.to - inner.spaceAfter.length > pos - line.from)
      return dont = { range };
    let emptyLine = pos >= inner.to - inner.spaceAfter.length && !/\S/.test(line.text.slice(inner.to));
    if (inner.item && emptyLine) {
      let first = inner.node.firstChild, second = inner.node.getChild("ListItem", "ListItem");
      if (first.to >= pos || second && second.to < pos || line.from > 0 && !/[^\s>]/.test(doc.lineAt(line.from - 1).text) || config.nonTightLists === false) {
        let next = context.length > 1 ? context[context.length - 2] : null;
        let delTo, insert2 = "";
        if (next && next.item) {
          delTo = line.from + next.from;
          insert2 = next.marker(doc, 1);
        } else {
          delTo = line.from + (next ? next.to : 0);
        }
        let changes3 = [{ from: delTo, to: pos, insert: insert2 }];
        if (inner.node.name == "OrderedList")
          renumberList(inner.item, doc, changes3, -2);
        if (next && next.node.name == "OrderedList")
          renumberList(next.item, doc, changes3);
        return { range: EditorSelection.cursor(delTo + insert2.length), changes: changes3 };
      } else {
        let insert2 = blankLine(context, state, line);
        return {
          range: EditorSelection.cursor(pos + insert2.length + 1),
          changes: { from: line.from, insert: insert2 + state.lineBreak }
        };
      }
    }
    if (inner.node.name == "Blockquote" && emptyLine && line.from) {
      let prevLine = doc.lineAt(line.from - 1), quoted = />\s*$/.exec(prevLine.text);
      if (quoted && quoted.index == inner.from) {
        let changes3 = state.changes([
          { from: prevLine.from + quoted.index, to: prevLine.to },
          { from: line.from + inner.from, to: line.to }
        ]);
        return { range: range.map(changes3), changes: changes3 };
      }
    }
    let changes2 = [];
    if (inner.node.name == "OrderedList")
      renumberList(inner.item, doc, changes2);
    let continued = inner.item && inner.item.from < line.from;
    let insert = "";
    if (!continued || /^[\s\d.)\-+*>]*/.exec(line.text)[0].length >= inner.to) {
      for (let i = 0, e = context.length - 1; i <= e; i++) {
        insert += i == e && !continued ? context[i].marker(doc, 1) : context[i].blank(i < e ? countColumn(line.text, 4, context[i + 1].from) - insert.length : null);
      }
    }
    let from = pos;
    while (from > line.from && /\s/.test(line.text.charAt(from - line.from - 1)))
      from--;
    insert = normalizeIndent(insert, state);
    if (nonTightList(inner.node, state.doc))
      insert = blankLine(context, state, line) + state.lineBreak + insert;
    changes2.push({ from, to: pos, insert: state.lineBreak + insert });
    return { range: EditorSelection.cursor(from + insert.length + 1), changes: changes2 };
  });
  if (dont)
    return false;
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: "input" }));
  return true;
};
const insertNewlineContinueMarkup = /* @__PURE__ */ insertNewlineContinueMarkupCommand();
function isMark(node) {
  return node.name == "QuoteMark" || node.name == "ListMark";
}
function nonTightList(node, doc) {
  if (node.name != "OrderedList" && node.name != "BulletList")
    return false;
  let first = node.firstChild, second = node.getChild("ListItem", "ListItem");
  if (!second)
    return false;
  let line1 = doc.lineAt(first.to), line2 = doc.lineAt(second.from);
  let empty = /^[\s>]*$/.test(line1.text);
  return line1.number + (empty ? 0 : 1) < line2.number;
}
function blankLine(context, state, line) {
  let insert = "";
  for (let i = 0, e = context.length - 2; i <= e; i++) {
    insert += context[i].blank(i < e ? countColumn(line.text, 4, context[i + 1].from) - insert.length : null, i < e);
  }
  return normalizeIndent(insert, state);
}
function contextNodeForDelete(tree, pos) {
  let node = tree.resolveInner(pos, -1), scan = pos;
  if (isMark(node)) {
    scan = node.from;
    node = node.parent;
  }
  for (let prev; prev = node.childBefore(scan); ) {
    if (isMark(prev)) {
      scan = prev.from;
    } else if (prev.name == "OrderedList" || prev.name == "BulletList") {
      node = prev.lastChild;
      scan = node.to;
    } else {
      break;
    }
  }
  return node;
}
const deleteMarkupBackward = ({ state, dispatch }) => {
  let tree = syntaxTree(state);
  let dont = null, changes = state.changeByRange((range) => {
    let pos = range.from, { doc } = state;
    if (range.empty && markdownLanguage.isActiveAt(state, range.from)) {
      let line = doc.lineAt(pos);
      let context = getContext(contextNodeForDelete(tree, pos), doc);
      if (context.length) {
        let inner = context[context.length - 1];
        let spaceEnd = inner.to - inner.spaceAfter.length + (inner.spaceAfter ? 1 : 0);
        if (pos - line.from > spaceEnd && !/\S/.test(line.text.slice(spaceEnd, pos - line.from)))
          return {
            range: EditorSelection.cursor(line.from + spaceEnd),
            changes: { from: line.from + spaceEnd, to: pos }
          };
        if (pos - line.from == spaceEnd && // Only apply this if we're on the line that has the
        // construct's syntax, or there's only indentation in the
        // target range
        (!inner.item || line.from <= inner.item.from || !/\S/.test(line.text.slice(0, inner.to)))) {
          let start = line.from + inner.from;
          if (inner.item && inner.node.from < inner.item.from && /\S/.test(line.text.slice(inner.from, inner.to))) {
            let insert = inner.blank(countColumn(line.text, 4, inner.to) - countColumn(line.text, 4, inner.from));
            if (start == line.from)
              insert = normalizeIndent(insert, state);
            return {
              range: EditorSelection.cursor(start + insert.length),
              changes: { from: start, to: line.from + inner.to, insert }
            };
          }
          if (start < pos)
            return { range: EditorSelection.cursor(start), changes: { from: start, to: pos } };
        }
      }
    }
    return dont = { range };
  });
  if (dont)
    return false;
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: "delete" }));
  return true;
};
const markdownKeymap = [
  { key: "Enter", run: insertNewlineContinueMarkup },
  { key: "Backspace", run: deleteMarkupBackward }
];
const htmlNoMatch = /* @__PURE__ */ html({ matchClosingTags: false });
function markdown(config = {}) {
  let { codeLanguages, defaultCodeLanguage, addKeymap = true, base: { parser: parser2 } = commonmarkLanguage, completeHTMLTags = true, pasteURLAsLink: pasteURL = true, htmlTagLanguage = htmlNoMatch } = config;
  if (!(parser2 instanceof MarkdownParser))
    throw new RangeError("Base parser provided to `markdown` should be a Markdown parser");
  let extensions = config.extensions ? [config.extensions] : [];
  let support = [htmlTagLanguage.support, headerIndent], defaultCode;
  if (pasteURL)
    support.push(pasteURLAsLink);
  if (defaultCodeLanguage instanceof LanguageSupport) {
    support.push(defaultCodeLanguage.support);
    defaultCode = defaultCodeLanguage.language;
  } else if (defaultCodeLanguage) {
    defaultCode = defaultCodeLanguage;
  }
  let codeParser = codeLanguages || defaultCode ? getCodeParser(codeLanguages, defaultCode) : void 0;
  extensions.push(parseCode({ codeParser, htmlParser: htmlTagLanguage.language.parser }));
  if (addKeymap)
    support.push(Prec.high(keymap.of(markdownKeymap)));
  let lang = mkLang(parser2.configure(extensions));
  if (completeHTMLTags)
    support.push(lang.data.of({ autocomplete: htmlTagCompletion }));
  return new LanguageSupport(lang, support);
}
function htmlTagCompletion(context) {
  let { state, pos } = context, m = /<[:\-\.\w\u00b7-\uffff]*$/.exec(state.sliceDoc(pos - 25, pos));
  if (!m)
    return null;
  let tree = syntaxTree(state).resolveInner(pos, -1);
  while (tree && !tree.type.isTop) {
    if (tree.name == "CodeBlock" || tree.name == "FencedCode" || tree.name == "ProcessingInstructionBlock" || tree.name == "CommentBlock" || tree.name == "Link" || tree.name == "Image")
      return null;
    tree = tree.parent;
  }
  return {
    from: pos - m[0].length,
    to: pos,
    options: htmlTagCompletions(),
    validFor: /^<[:\-\.\w\u00b7-\uffff]*$/
  };
}
let _tagCompletions = null;
function htmlTagCompletions() {
  if (_tagCompletions)
    return _tagCompletions;
  let result = htmlCompletionSource(new CompletionContext(EditorState.create({ extensions: htmlNoMatch }), 0, true));
  return _tagCompletions = result ? result.options : [];
}
const nonPlainText = /code|horizontalrule|html|link|comment|processing|escape|entity|image|mark|url/i;
const pasteURLAsLink = /* @__PURE__ */ EditorView.domEventHandlers({
  paste: (event, view) => {
    var _a;
    let { main } = view.state.selection;
    if (main.empty)
      return false;
    let link = (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
    if (!link || !/^(https?:\/\/|mailto:|xmpp:|www\.)/.test(link))
      return false;
    if (/^www\./.test(link))
      link = "https://" + link;
    if (!markdownLanguage.isActiveAt(view.state, main.from, 1))
      return false;
    let tree = syntaxTree(view.state), crossesNode = false;
    tree.iterate({
      from: main.from,
      to: main.to,
      enter: (node) => {
        if (node.from > main.from || nonPlainText.test(node.name))
          crossesNode = true;
      },
      leave: (node) => {
        if (node.to < main.to)
          crossesNode = true;
      }
    });
    if (crossesNode)
      return false;
    view.dispatch({
      changes: [{ from: main.from, insert: "[" }, { from: main.to, insert: `](${link})` }],
      userEvent: "input.paste",
      scrollIntoView: true
    });
    return true;
  }
});
export {
  commonmarkLanguage,
  deleteMarkupBackward,
  insertNewlineContinueMarkup,
  insertNewlineContinueMarkupCommand,
  markdown,
  markdownKeymap,
  markdownLanguage,
  pasteURLAsLink
};
