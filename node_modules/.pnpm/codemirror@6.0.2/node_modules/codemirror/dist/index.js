import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, keymap } from "../../../../@codemirror_view@6.39.14/node_modules/@codemirror/view/dist/index.js";
import { EditorView } from "../../../../@codemirror_view@6.39.14/node_modules/@codemirror/view/dist/index.js";
import { EditorState } from "../../../../@codemirror_state@6.5.4/node_modules/@codemirror/state/dist/index.js";
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from "../../../../@codemirror_language@6.12.1/node_modules/@codemirror/language/dist/index.js";
import { history, defaultKeymap, historyKeymap } from "../../../../@codemirror_commands@6.10.2/node_modules/@codemirror/commands/dist/index.js";
import { highlightSelectionMatches, searchKeymap } from "../../../../@codemirror_search@6.6.0/node_modules/@codemirror/search/dist/index.js";
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from "../../../../@codemirror_autocomplete@6.20.0/node_modules/@codemirror/autocomplete/dist/index.js";
import { lintKeymap } from "../../../../@codemirror_lint@6.9.4/node_modules/@codemirror/lint/dist/index.js";
const basicSetup = /* @__PURE__ */ (() => [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap
  ])
])();
const minimalSetup = /* @__PURE__ */ (() => [
  highlightSpecialChars(),
  history(),
  drawSelection(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  keymap.of([
    ...defaultKeymap,
    ...historyKeymap
  ])
])();
export {
  EditorView,
  basicSetup,
  minimalSetup
};
