import installed from "../../game/organized-extensions.json";
import bundled from "../../game/bundled-extensions.json";
import validation from "../../game/organized-extension-status.json";

const known = new Set([...bundled, ...installed.map(item => item.name)]);
const blocked = new Set(validation.disabled.map(item => item.name));

/** An exact emergency snapshot wins; without one, use the reviewed default list. */
export function recoveryNames(snapshot: unknown): string[] {
	if (Array.isArray(snapshot)) return snapshot.filter((name): name is string => typeof name === "string" && known.has(name));
	return [...known].filter(name => !blocked.has(name) && (bundled.includes(name) || installed.some(item => item.name === name && item.defaultEnabled !== false)));
}

export async function restoreExtensions(names: string[], config: { get(key: string): any }, save: (key: string, value: any) => Promise<unknown>) {
	const extensions = new Set<string>(config.get("extensions") || []);
	for (const name of names.filter(name => known.has(name))) {
		extensions.add(name);
		await save(`extension_${name}_enable`, true);
	}
	await save("extensions", [...extensions]);
}

/** Non-modal recovery remains available in safe mode. No automatic setting changes. */
export function showExtensionRecovery(lib, config, save) {
	const flag = `${lib.configprefix}disable_extension`;
	const snapshotKey = `${lib.configprefix}extension_emergency_enabled`;
	const registered: string[] = config.get("extensions") || [];
	if (!localStorage.getItem(flag) && (!registered.length || registered.some(name => config.get(`extension_${name}_enable`) === true))) return;
	if (document.getElementById("extension-recovery")) return;
	let snapshot: unknown;
	try { snapshot = JSON.parse(localStorage.getItem(snapshotKey) || "null"); } catch { /* Older versions have no snapshot. */ }
	const names = recoveryNames(snapshot);
	const panel = document.createElement("details");
	panel.id = "extension-recovery";
	panel.open = true;
	panel.style.cssText = "position:fixed;z-index:100001;top:8px;left:8px;max-width:480px;max-height:65vh;overflow:auto;background:#fff;color:#222;padding:12px;font:14px sans-serif;user-select:text";
	const title = document.createElement("summary");
	title.textContent = "扩展当前全部停用（资源仍在）";
	const description = document.createElement("p");
	description.textContent = Array.isArray(snapshot) ? "可恢复紧急禁用前的开关；不会清空存档或修改其他设置。" : "旧版本未记录禁用前的开关，可按下列默认兼容清单恢复。无法还原过去的手动开关；未列出的包仍保持停用，不会清空存档。";
	const list = document.createElement("p");
	list.textContent = names.join("、");
	const button = document.createElement("button");
	button.textContent = "恢复上述扩展并重新打开";
	button.onclick = async () => {
		button.disabled = true;
		try {
			await restoreExtensions(names, config, save);
			localStorage.removeItem(flag);
			localStorage.removeItem(snapshotKey);
			location.reload();
		} catch (error) {
			button.disabled = false;
			description.textContent = `恢复未完成：${error}。存档未清空，可重试。`;
		}
	};
	panel.append(title, description, list, button);
	document.body.append(panel);
}
