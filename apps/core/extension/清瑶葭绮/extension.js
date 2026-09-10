import { createMergedExtension } from "../_merge.js";
export const type = "extension";
export default function (...args) {
    return createMergedExtension("清瑶葭绮", ["假装无敌","渐意新生","玉言·离光","云游四海"], args, import.meta.url);
}
