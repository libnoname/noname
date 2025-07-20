import { KeyBinding } from '@codemirror/view';
import { Language, LanguageSupport, LanguageDescription } from '@codemirror/language';
import { MarkdownExtension } from '@lezer/markdown';
import { StateCommand } from '@codemirror/state';

/**
Language support for strict CommonMark.
*/
declare const commonmarkLanguage: Language;
/**
Language support for [GFM](https://github.github.com/gfm/) plus
subscript, superscript, and emoji syntax.
*/
declare const markdownLanguage: Language;

/**
This command, when invoked in Markdown context with cursor
selection(s), will create a new line with the markup for
blockquotes and lists that were active on the old line. If the
cursor was directly after the end of the markup for the old line,
trailing whitespace and list markers are removed from that line.

The command does nothing in non-Markdown context, so it should
not be used as the only binding for Enter (even in a Markdown
document, HTML and code regions might use a different language).
*/
declare const insertNewlineContinueMarkup: StateCommand;
/**
This command will, when invoked in a Markdown context with the
cursor directly after list or blockquote markup, delete one level
of markup. When the markup is for a list, it will be replaced by
spaces on the first invocation (a further invocation will delete
the spaces), to make it easy to continue a list.

When not after Markdown block markup, this command will return
false, so it is intended to be bound alongside other deletion
commands, with a higher precedence than the more generic commands.
*/
declare const deleteMarkupBackward: StateCommand;

/**
A small keymap with Markdown-specific bindings. Binds Enter to
[`insertNewlineContinueMarkup`](https://codemirror.net/6/docs/ref/#lang-markdown.insertNewlineContinueMarkup)
and Backspace to
[`deleteMarkupBackward`](https://codemirror.net/6/docs/ref/#lang-markdown.deleteMarkupBackward).
*/
declare const markdownKeymap: readonly KeyBinding[];
/**
Markdown language support.
*/
declare function markdown(config?: {
    /**
    When given, this language will be used by default to parse code
    blocks.
    */
    defaultCodeLanguage?: Language | LanguageSupport;
    /**
    A source of language support for highlighting fenced code
    blocks. When it is an array, the parser will use
    [`LanguageDescription.matchLanguageName`](https://codemirror.net/6/docs/ref/#language.LanguageDescription^matchLanguageName)
    with the fenced code info to find a matching language. When it
    is a function, will be called with the info string and may
    return a language or `LanguageDescription` object.
    */
    codeLanguages?: readonly LanguageDescription[] | ((info: string) => Language | LanguageDescription | null);
    /**
    Set this to false to disable installation of the Markdown
    [keymap](https://codemirror.net/6/docs/ref/#lang-markdown.markdownKeymap).
    */
    addKeymap?: boolean;
    /**
    Markdown parser
    [extensions](https://github.com/lezer-parser/markdown#user-content-markdownextension)
    to add to the parser.
    */
    extensions?: MarkdownExtension;
    /**
    The base language to use. Defaults to
    [`commonmarkLanguage`](https://codemirror.net/6/docs/ref/#lang-markdown.commonmarkLanguage).
    */
    base?: Language;
    /**
    By default, the extension installs an autocompletion source that
    completes HTML tags when a `<` is typed. Set this to false to
    disable this.
    */
    completeHTMLTags?: boolean;
    /**
    By default, HTML tags in the document are handled by the [HTML
    language](https://github.com/codemirror/lang-html) package with
    tag matching turned off. You can pass in an alternative language
    configuration here if you want.
    */
    htmlTagLanguage?: LanguageSupport;
}): LanguageSupport;

export { commonmarkLanguage, deleteMarkupBackward, insertNewlineContinueMarkup, markdown, markdownKeymap, markdownLanguage };
