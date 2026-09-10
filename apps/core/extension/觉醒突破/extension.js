import { createMergedExtension } from "../_merge.js";
export const type = "extension";
export default function (...args) {
    return createMergedExtension("觉醒突破", ["极限觉醒","纪元突破【谋】"], args, import.meta.url);
}
