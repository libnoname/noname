import installed from "../../game/organized-extensions.json";
import validation from "../../game/organized-extension-status.json";

/** Register this repository's installed packages once, preserving later user choices. */
export async function registerOrganizedExtensions(config: { get: (key: string) => any; has: (key: string) => boolean }, save: (key: string, value: any) => Promise<unknown>) {
	const extensions = [...(config.get("extensions") || [])];
	const registered = new Set<string>(config.get("organized_extensions_registered") || []);
	let changed = false;
	const disabled = new Set(validation.disabled.map(p => p.name));
	for (const { name } of installed) {
		if (registered.has(name)) continue;
		if (!extensions.includes(name)) extensions.push(name);
		if (!config.has(`extension_${name}_enable`)) await save(`extension_${name}_enable`, !disabled.has(name));
		registered.add(name);
		changed = true;
	}
	if (changed) {
		await save("extensions", extensions);
		await save("organized_extensions_registered", [...registered]);
	}
	// Apply the user's safety choice once to existing browser saves too. Later
	// explicit menu choices are preserved, including after installing dependencies.
	if (config.get("organized_extensions_validation") !== validation.version) {
		for (const { name } of validation.disabled) {
			if (extensions.includes(name)) await save(`extension_${name}_enable`, false);
		}
		await save("organized_extensions_validation", validation.version);
	}
}
