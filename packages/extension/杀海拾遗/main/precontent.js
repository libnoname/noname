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
	if (lib.config.extension_杀海拾遗_gwent) {
		let success =
			(await loadPack("gwent", "昆特牌", ["card", "character"])) &&
			// “古剑奇谭”依赖“昆特牌”
			(await loadPack("gujian", "古剑奇谭", ["card", "character"]));
		if (lib.config.extension_杀海拾遗_yunchou) {
			if (
				// “运筹帷幄”是独立扩展，优先加载
				(await loadPack("yunchou", "运筹帷幄", ["card", "character"])) &&
				success &&
				// “轩辕剑”依赖上述所有扩展
				(await loadPack("swd", "轩辕剑", ["card", "character"])) &&
				// “炉石传说”依赖“轩辕剑”
				(await loadPack("hearth", "炉石传说", ["card", "character"]))
			) {
				// 以下这些扩展包均依赖上述扩展包
				const results = await Promise.allSettled([import("../character/ow/index.js"), import("../character/xianjian/index.js")]);
				results.forEach(result => {
					if (result.status === "fulfilled") {
						lib.translate.ow_character_config = "守望先锋";
						lib.translate.xianjian_character_config = "仙剑奇侠传";
					} else {
						console.error("『杀海拾遗』扩展模块加载失败", result.reason);
					}
				});
			}
		}
	} else if (lib.config.extension_杀海拾遗_yunchou) {
		await loadPack("yunchou", "运筹帷幄", ["card", "character"]);
	}
	if (lib.config.extension_杀海拾遗_mtg) {
		// 适用于多模块、无依赖、并发场景，一个加载失败其余仍正常加载
		const results = await Promise.allSettled([import("../card/mtg/index.js"), import("../character/mtg/index.js")]);
		results.forEach(result => {
			if (result.status === "fulfilled") {
				lib.translate.mtg_card_config = "万智牌";
				lib.translate.mtg_character_config = "万智牌";
			} else {
				console.error("『杀海拾遗』扩展模块加载失败", result.reason);
			}
		});
	}
	if (lib.config.extension_杀海拾遗_wuxing) {
		await loadPack("wuxing", "五行生克", ["play"]);
	}
	if (lib.config.extension_杀海拾遗_zhenfa) {
		await loadPack("zhenfa", "阵法牌", ["card"]);
	}
}
