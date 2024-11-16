// noinspection ES6PreferShortImport

import { game } from "../game/index.js";
import { lib, Library } from "../library/index.js";

/**
 * @param {string} name - 卡牌包名
 * @returns {Promise<void>}
 */
export const importCardPack = generateImportFunction("card", name => `../../card/${name}.js`);

/**
 * @param {string} name - 武将包名
 * @returns {Promise<void>}
 */
export const importCharacterPack = generateImportFunction("character", name => {
	const alreadyModernCharacterPack = lib.config.moderned_chracters || [];

	return alreadyModernCharacterPack.includes(name) ? `../../character/${name}/index.js` : `../../character/${name}.js`;
});

/**
 * @param {string} name - 扩展名
 * @returns {Promise<void>}
 */
export const importExtension = generateImportFunction("extension", name => `../../extension/${name}/extension.js`);

/**
 * @param {string} name - 模式名
 * @returns {Promise<void>}
 */
export const importMode = generateImportFunction("mode", name => `../../mode/${name}.js`);

/**
 * 生成导入
 *
 * @param { 'card' | 'character' | 'extension' | 'mode' } type
 * @param {(name: string) => string} pathParser
 * @returns {(name: string) => Promise<void>}
 */
function generateImportFunction(type, pathParser) {
	return async name => {
		if (type == "extension" && !game.hasExtension(name) && !lib.config.all.stockextension.includes(name)) {
			// @ts-ignore
			await game.import(type, await createEmptyExtension(name));
			return;
		}
		if (type == "mode" && lib.mode[name] && lib.mode[name].fromextension) {
			let loadModeMethod = lib.init["setMode_" + name];
			if (typeof loadModeMethod === "function") {
				await Promise.resolve(loadModeMethod());
				return;
			}
		}
		let path = pathParser(name);
		// 通过浏览器自带的script标签导入可直接获取报错信息，且不会影响JS运行
		// 此时代码内容也将缓存在浏览器中，故再次import后将不会重新执行代码内容（测试下来如此）
		const [status, script] = await new Promise(resolve => {
			const createScript = () => {
				const script = document.createElement("script");
				script.type = "module";
				script.src = `${lib.assetURL}noname/init/${path}`;
				script.onload = () => resolve(["ok", script]);
				return script;
			};
			let script = createScript();
			script.onerror = e => {
				if (path.endsWith(".js") && window.isSecureContext) {
					path = path.slice(0, -3) + ".ts";
					script.remove();
					let ts = createScript();
					ts.onerror = e2 => {
						if (lib.path.basename(path) === "extension.js" && lib.path.dirname(path).endsWith("/extension")) {
							console.error(`扩展《${name}》加载失败`, e, e2);
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
						}
						resolve(["error", ts]);
					};
					document.head.appendChild(ts);
				} else {
					resolve(["error", script]);
				}
			};
			document.head.appendChild(script);
		});
		script.remove();
		if (status === "error") {
			if (type === "character") {
				console.warn("如果您在扩展中使用了game.import创建武将包，可将以下代码删除: lib.config.all.characters.push('武将包名');");
			}
			return;
		}
		const modeContent = await import(path);
		if (!modeContent.type) return;
		if (modeContent.type !== type) throw new Error(`Loaded Content doesn't conform to "${type}" but "${modeContent.type}".`);
		// @ts-ignore
		await game.import(type, modeContent.default);
	};
}

async function createEmptyExtension(name) {
	const extensionInfo = await lib.init.promises
		.json(`${lib.assetURL}extension/${name}/info.json`) //await import(`../../extension/${name}/info.json`,{assert:{type:'json'}})
		.then(
			info => info,
			() => {
				return {
					name: name,
					intro: `扩展<b>《${name}》</b>尚未开启，请开启后查看信息。（建议扩展添加info.json以在关闭时查看信息）`,
					author: "未知",
					diskURL: "",
					forumURL: "",
					version: "1.0",
				};
			}
		);
	return {
		name: extensionInfo.name,
		editable: false,
		content: function (config, pack) {},
		precontent: function () {},
		config: {},
		help: {},
		package: {
			character: {
				character: {},
				translate: {},
			},
			card: {
				card: {},
				translate: {},
				list: [],
			},
			skill: {
				skill: {},
				translate: {},
			},
			intro: extensionInfo.intro ? extensionInfo.intro.replace("${assetURL}", lib.assetURL) : "",
			author: extensionInfo.author ? extensionInfo.author : "未知",
			diskURL: extensionInfo.diskURL ? extensionInfo.diskURL : "",
			forumURL: extensionInfo.forumURL ? extensionInfo.forumURL : "",
			version: extensionInfo.version ? extensionInfo.version : "1.0.0",
		},
		files: {
			character: [],
			card: [],
			skill: [],
			audio: [],
		},
	};
}
