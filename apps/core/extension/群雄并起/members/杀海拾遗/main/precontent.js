import { lib, game, ui, get, ai, _status } from "./utils.js";

export async function precontent(config, pack) {
	/**
	 * 同时加载多个扩展包
	 * @param { string } pack
	 * @param { string } name
	 * @param { string[] } types
	 * @returns { Promise<boolean> }
	 */
	async function loadPack(pack, name, types) {
		try {
			let extensions = [];
			for (let type of types) {
				extensions.push(import(`../${type}/${pack}/index.js`));
			}
			await Promise.all(extensions);
			for (let type of types) {
				lib.translate[`${pack}_${type}_config`] = name;
			}
			return true;
		} catch (err) {
			console.error("Failed to import extension 『杀海拾遗』: ", err);
			alert(`『杀海拾遗』扩展加载“${name}”扩展包时失败`);
			return false;
		}
	}
	// 保留独立的三国内容；已移除的七个跨界子包不再由旧开关加载。
	if (lib.config.extension_杀海拾遗_yunchou) {
		await loadPack("yunchou", "运筹帷幄", ["card", "character"]);
	}
	if (lib.config.extension_杀海拾遗_wuxing) {
		await loadPack("wuxing", "五行生克", ["play"]);
	}
	if (lib.config.extension_杀海拾遗_zhenfa) {
		await loadPack("zhenfa", "阵法牌", ["card"]);
	}
}
