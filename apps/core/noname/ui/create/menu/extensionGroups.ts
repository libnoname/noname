import groups from "../../../../game/extension-groups.json";
import restructure from "../../../../game/extension-restructure.json";
import apk from "../../../../game/apk-extension-cleanup.json";
import characterGroups from "../../../../game/character-menu-groups.json";

export interface ExtensionMenuGroup {
	name: string;
	members: string[];
}

/** A presentation-only grouping: never rename, load, remove, or enable a pack. */
export function groupExtensionMenus(modes: readonly string[]): (string | ExtensionMenuGroup)[] {
	modes = modes.filter(mode => !mode.startsWith("extension_") || !restructure.removed.includes(mode.slice(10)));
	const available = new Set(modes);
	const owners = new Map<string, ExtensionMenuGroup>();
	// Core character packs have no extension-settings entry. Include only physical
	// extension members here, so 手杀武将 is managed under 普通 on both menu pages.
	const settingsGroups = [...groups, ...characterGroups.groups.map(group => ({
		name: group.name,
		members: group.members.filter(name => name in restructure.merged),
	}))];
	for (const group of settingsGroups) {
		// An independently installed extension with the same name takes precedence.
		if (available.has(`extension_${group.name}`)) continue;
		const members = group.members.map(name => `extension_${name}`).filter(mode => available.has(mode) && !owners.has(mode));
		if (!members.length) continue;
		const entry = { name: group.name, members };
		for (const mode of members) owners.set(mode, entry);
	}
	const result: (string | ExtensionMenuGroup)[] = [];
	const emitted = new Set<ExtensionMenuGroup>();
	for (const mode of modes) {
		const group = owners.get(mode);
		if (!group) result.push(mode);
		else if (!emitted.has(group)) {
			// Keep both top-level and member order consistent with extensionSort.
			result.push({ name: group.name, members: modes.filter(item => owners.get(item) === group) });
			emitted.add(group);
		}
	}
	return result;
}

export function characterMenuOwner(mode: string): string | undefined {
	const name = mode.replace(/^mode_extension_/, "");
	for (const group of characterGroups.groups) if (group.members.includes(name)) return group.name;
	if (name in restructure.merged) return name;
	for (const group of groups) if (group.members.includes(name)) return group.name;
	if (name === "假装无敌Pack") return "清瑶葭绮";
	if (["wandian", "yunchou"].includes(name)) return "群雄并起";
	for (const [target, members] of Object.entries(restructure.merged)) {
		if (name !== target && members.includes(name)) return characterGroups.groups.find(group => group.members.includes(target))?.name || target;
	}
}

/** Pure metadata: building a menu must never execute an extension factory. */
export function mergedMenuSections(name: string) {
	if (name === "手杀武将") return [
		{ name: "原有手杀武将", prefix: "original_", keys: [] as string[] },
		...apk.merged.map(item => ({ name: item.name, prefix: `${item.key}_`, keys: [item.key] })),
		{ name: "手杀补全", prefix: "merged_completion_", keys: ["merged_completion"] },
	];
	return (restructure.merged[name] || []).map((member, index) => ({ name: member, prefix: `member_${index}_`, keys: [] as string[] }));
}

/** DOM state is separate from game configuration; opening menus cannot enable packs. */
export function createPackSubmenu(parent: HTMLElement, title: string, key: string) {
	const details = document.createElement("details");
	details.dataset.packSubmenu = key;
	details.style.cssText = "position:relative;border-bottom:1px solid #8886;padding:7px 0;width:100%;box-sizing:border-box";
	const summary = document.createElement("summary");
	summary.textContent = title;
	summary.style.cssText = "position:relative;cursor:pointer;font-size:16px;line-height:1.7";
	details.append(summary);
	try { details.open = sessionStorage.getItem(`noname.menu.${key}`) === "open"; } catch { /* Storage can be unavailable. */ }
	details.addEventListener("toggle", () => {
		try { sessionStorage.setItem(`noname.menu.${key}`, details.open ? "open" : "closed"); } catch { /* Menu still works. */ }
	});
	parent.append(details);
	return details;
}
