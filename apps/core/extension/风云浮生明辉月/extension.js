import { createMergedExtension } from "../_merge.js";
export const type = "extension";
export default function (...args) {
    return createMergedExtension("风云浮生明辉月", ["风云变幻","浮生晓明月","辉烬卧床包","山海异志将包"], args, import.meta.url);
}
