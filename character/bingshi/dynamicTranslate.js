import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	potkuanggu(player) {
		if (player.getStorage("potkuanggu", 0)) {
			return lib.translate["potkuanggu_pot_weiyan_achieve_info"];
		}
		return lib.translate["potkuanggu_info"];
	},
	pothanzhan(player) {
		let str = lib.translate.pothanzhan_info;
		if (!player.storage.pothanzhan) {
			return str;
		}
		return str.replace(
			"X为各自体力上限",
			"X为" +
				{
					hp: "各自体力值",
					damagedHp: "各自损失体力值",
					countplayer: "场上存活角色数",
				}[player.storage.pothanzhan]
		);
	},
	potzhanlie(player) {
		let str = lib.translate.potzhanlie_info;
		if (!player.storage.potzhanlie) {
			return str;
		}
		return str.replace(
			"X为你的攻击范围",
			"X为" +
				{
					hp: "你的体力值",
					damagedHp: "你的损失体力值",
					countplayer: "场上存活角色数",
				}[player.storage.potzhanlie]
		);
	},
};
export default dynamicTranslates;
