import { lib, game, _status } from "noname";
import security from "@/util/security.js";
/**
 * @param {string} name - 卡牌包名
 * @returns {Promise<void>}
 */
export async function importCardPack(name) {
	await importFunction("card", `/card/${name}`);
}

/**
 * @param {string} name - 武将包名
 * @returns {Promise<void>}
 */
export async function importCharacterPack(name) {
	const alreadyModernCharacterPack = lib.config.moderned_chracters || [];
	const path = alreadyModernCharacterPack.includes(name) ? `/character/${name}/index` : `/character/${name}`;
	await importFunction("character", path).catch(e => {
		console.warn("如果您在扩展中使用了game.import创建武将包，可将以下代码删除: lib.config.all.characters.push('武将包名');");
	});
}

/**
 * @param {string} name - 扩展名
 * @returns {Promise<void>}
 */
export async function importExtension(name) {
	if (!game.hasExtension(name) && !lib.config.all.stockextension.includes(name)) {
		// @ts-expect-error ignore
		await game.import("extension", await createEmptyExtension(name));
		return;
	}
	let extcontent = localStorage.getItem(lib.configprefix + "extension_" + name);
	if (extcontent) {
		//var backup_onload=lib.init.onload;
		_status.evaluatingExtension = true;
		try {
			security.eval(extcontent);
		} catch (e) {
			console.log(e);
		}
		//lib.init.onload=backup_onload;
		_status.evaluatingExtension = false;
		return;
	}
	await importFunction("extension", `/extension/${name}/extension`).catch(e => {
		console.error(`扩展《${name}》加载失败`, e);
		let remove = confirm(`扩展《${name}》加载失败，是否移除此扩展？此操作不会移除目录下的文件。`);
		if (remove) {
			lib.config.extensions.remove(name);
			if (lib.config[`@Experimental.extension.${name}.character`]) {
				game.saveConfig(`@Experimental.extension.${name}.character`);
			}
			if (lib.config[`@Experimental.extension.${name}.card`]) {
				game.saveConfig(`@Experimental.extension.${name}.card`);
			}
			game.saveConfig("extensions", lib.config.extensions);
		}
	});
}

/**
 * @param {string} name - 模式名
 * @returns {Promise<void>}
 */
export async function importMode(name) {
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

/**
 * 生成导入
 *
 * @param { 'card' | 'character' | 'extension' | 'mode' } type
 * @param {string} path
 * @returns {Promise<void>}
 */
async function importFunction(type, path) {
	const modeContent = await import(/* @vite-ignore */ path + ".js").catch(e => {
		if (/Failed to fetch/.test(e.message) && window.isSecureContext) {
			return import(/* @vite-ignore */ path + ".ts");
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

async function createEmptyExtension(name) {
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
