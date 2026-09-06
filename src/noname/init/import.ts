/// <reference types="vite/client" />
import { lib, game, _status } from "noname";

export async function importCardPack(name: string) {
	await importFunction("card", `/card/${name}`);
}

export async function importCharacterPack(name: string) {
	const alreadyModernCharacterPack = lib.config.moderned_characters || [];
	const path = import.meta.env.DEV || !alreadyModernCharacterPack.includes(name) ? `/character/${name}/index` : `/character/${name}`;
	await importFunction("character", path).catch(e => {
		console.error(`武将包《${name}》加载失败`, e);
		// 		alert(`武将包《${name}》加载失败
		// 错误信息:
		// ${e instanceof Error ? e.stack : String(e)}
		// 如果您在扩展中使用了game.import创建武将包，可将以下代码删除: lib.config.all.characters.push('武将包名');`);
	});
}

export async function importExtension(name: string) {
	if (!game.hasExtension(name) && !lib.config.all.stockextension.includes(name)) {
		// @ts-expect-error ignore
		await game.import("extension", await createEmptyExtension(name));
		return;
	}
	if (lib.config.fuck_sojson && !_status.connectMode) {
		await checkExtensionSojson(name);
	}
	try {
		await importFunction("extension", `/extension/${name}/extension`);
	} catch (e) {
		console.error(`扩展《${name}》加载失败`, e);
		let close = confirm(`扩展《${name}》加载失败，是否关闭此扩展？错误信息: \n${e instanceof Error ? e.stack : String(e)}`);
		if (close) {
			game.saveConfig(`extension_${name}_enable`, false);
			// @ts-expect-error ignore
			await game.import("extension", await createEmptyExtension(name));
		}
	}
}

export async function importMode(name: string) {
	if (lib.mode[name] && lib.mode[name].fromextension) {
		let loadModeMethod = lib.init["setMode_" + name];
		if (typeof loadModeMethod === "function") {
			await Promise.resolve(loadModeMethod());
			return;
		}
	}
	const alreadyModernMode = lib.config.moderned_modes || [];
	const path = alreadyModernMode.includes(name) ? `/mode/${name}/index` : `/mode/${name}`;
	await importFunction("mode", path);
}

async function importFunction(type: "card" | "character" | "extension" | "mode", path: string): Promise<void> {
	const modeContent = await import(/* @vite-ignore */ path + ".js").catch(async e => {
		if (window.isSecureContext) {
			try {
				return await import(/* @vite-ignore */ path + ".ts");
			} catch {
				throw e;
			}
		}
		throw e;
	});
	if (!modeContent.type) return;
	if (modeContent.type !== type) {
		throw new Error(`Loaded Content doesn't match "${type}" (received "${modeContent.type}").`);
	}
	// @ts-expect-error ignore
	await game.import(type, modeContent.default);
}

async function checkExtensionSojson(name: string) {
	const suffixes = window.isSecureContext ? [".js", ".ts"] : [".js"];
	for (const suffix of suffixes) {
		const file = `extension/${name}/extension${suffix}`;
		try {
			const code = await game.promises.readFileAsText(file);
			if (code.includes("sojson") || code.includes("jsjiami") || code.includes("var _0x")) {
				alert(`检测到您安装了使用免费版sojson进行加密的扩展。请谨慎使用这些扩展，避免游戏数据遭到破坏。\n扩展名称：${name}`);
				return;
			}
		} catch {}
	}
}

export async function createEmptyExtension(name: string) {
	const extensionInfo = await lib.init.promises.json(`${lib.assetURL}extension/${name}/info.json`).then(
		info => info,
		() => {
			return {
				name,
				intro: `扩展<b>《${name}》</b>尚未开启，请开启后查看信息。（建议扩展添加info.json以在关闭时查看信息）`,
				author: "未知",
				diskURL: "",
				forumURL: "",
				version: "1.0.0",
			};
		}
	);
	return {
		name: extensionInfo.name,
		editable: false,
		arenaReady() {},
		content(config, pack) {},
		prepare() {},
		precontent() {},
		config: {},
		help: {},
		package: {
			translation : extensionInfo.translation,
			nopack: true,
			intro: extensionInfo.intro ? extensionInfo.intro.replace("${assetURL}", lib.assetURL) : "",
			author: extensionInfo.author ?? "未知",
			diskURL: extensionInfo.diskURL ?? "",
			forumURL: extensionInfo.forumURL ?? "",
			version: extensionInfo.version ?? "1.0.0",
		},
		files: {
			character: [],
			card: [],
			skill: [],
			audio: [],
		},
	};
}
