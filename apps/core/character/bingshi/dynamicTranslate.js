import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	potchiyun(player, skill) {
		let s1 = player.storage[skill + "1"],
			s2 = player.storage[skill + "2"],
			t1 = "1.展示所有与这些牌颜色相同的手牌，你对其造成1点火焰伤害；",
			t2 = "2.你摸两张牌，其进入连环状态";
		if (s1) {
			t1 = `<span style="text-decoration: line-through;">${t1}</span>`;
		}
		if (s2) {
			t2 = `<span style="text-decoration: line-through;">${t2}</span>`;
		}
		return `你每阶段首次获得牌后，可交给一名其他角色任意张手牌，其选择一项：${t1}${t2}。`;
	},
	potyanhui(player, skill) {
		let s1 = player.storage[skill + "1"],
			s2 = player.storage[skill + "2"],
			t1 = "1.对一名因此弃置过牌的角色造成1点火焰伤害；",
			t2 = "2.摸X张牌（X为本回合展示过牌的角色数）";
		if (s1) {
			t1 = `<span style="text-decoration: line-through;">${t1}</span>`;
		}
		if (s2) {
			t2 = `<span style="text-decoration: line-through;">${t2}</span>`;
		}
		return `你使用牌指定目标后，可展示一名目标角色的一张手牌，若此牌本回合已被展示过，你弃置之。此阶段结束时，你选择一项：${t1}${t2}。`;
	},
	potfentao(player, skill) {
		let s1 = player.storage[skill + "1"],
			s2 = player.storage[skill + "2"],
			t1 = "1.此次传导中的伤害+1；",
			t2 = "2.弃置一半牌（向上取整），此伤害结算后其进入连环状态";
		if (s1) {
			t1 = `<span style="text-decoration: line-through;">${t1}</span>`;
		}
		if (s2) {
			t2 = `<span style="text-decoration: line-through;">${t2}</span>`;
		}
		return `锁定技，有连环状态的其他角色受到火焰伤害时，其选择一项：${t1}${t2}。`;
	},
	mbkechang(player, skill) {
		if (player.getStorage(skill, false)) {
			return lib.translate[`${skill}_rewrite_info`];
		}
		return lib.translate[`${skill}_info`];
	},
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
