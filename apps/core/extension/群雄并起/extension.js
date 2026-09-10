import { createMergedExtension } from "../_merge.js";
export const type = "extension";
export default function (...args) {
    return createMergedExtension("群雄并起", ["群雄并起","强标包","三国名医","杀海拾遗","玩点论杀","新·将","阳光包"], args, import.meta.url);
}
