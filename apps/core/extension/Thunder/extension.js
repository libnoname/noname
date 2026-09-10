// Preserve the mixed APK pack without running legacy UI patches on an incompatible engine.
export const type = "extension";
export default async function (...args) {
    if (!globalThis.decadeUI || !globalThis.dcdAnim) {
        return {
            name: "Thunder", editable: false,
            config: { compatibility: { name: "武将资源已保留；旧版 UI 依赖缺失，暂不加载", clear: true, nopointer: true } },
            package: { intro: "APK 混合包包含武将。已保留完整代码和素材；缺少旧版 UI 时不执行其全局修改。", character: { character: {}, translate: {} }, card: { card: {}, translate: {}, list: [] }, skill: {} },
        };
    }
    const original = await import("./apk-original.js");
    return original.default(...args);
}
