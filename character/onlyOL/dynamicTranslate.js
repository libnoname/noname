import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	olsblixian(player) {
		let names =
			player
				.getStorage("olsblixian_names")
				.map((name, i, arr) => `${i == arr.length - 1 ? "或" : "、"}【${get.translation(name)}】`)
				.join("") || "";
		let triggers =
			player
				.getStorage("olsblixian_triggers")
				.map(i => get.translation(i))
				.join("、") + "或";
		if (triggers.length < 2) {
			triggers = "";
		}
		console.log(triggers);
		return `${triggers}当你受到伤害后，你可将一张牌当【无中生有】${names}使用。当你以此法使用过三种不同牌名的锦囊牌后，此技能于你的结束阶段也可发动。`;
	},
	olsbqianfu(player) {
		const bool = player.storage.olsbqianfu;
		let yang = "你可以将一张黑色牌当【过河拆桥】使用",
			yin = "你可以将一张红色牌当【火攻】使用";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = `转换技，出牌阶段${player.hasSkill("olsbqianfu_remove") ? "各限一次" : ""}，`,
			end = "。结算后，你可将因此弃置的牌置于牌堆顶。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	olsbzhijue(player) {
		const bool = player.storage.olsbzhijue;
		let yang = "出牌阶段，你可将牌堆顶的一张牌当【火攻】使用",
			yin = "将一种颜色的手牌置入弃牌堆（每种颜色每回合限一次），然后可视为使用其中一张基本牌或普通锦囊牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，",
			end = "。若你以此法未造成伤害，你令〖知天〗可见牌与观看牌数-1（至少减至1），然后你摸两张牌。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	olsbjinming(player) {
		let str = "回合开始时，你可以选择一项：";
		for (let i of ["1.回复过1点体力；", "2.弃置过两张牌；", "3.使用过三种类型的牌；", "4.造成过4点伤害。"]) {
			if (!player.getStorage("olsbjinming").includes(parseInt(i.slice(0, 1)))) {
				i = `<span style="text-decoration: line-through;">${i}</span>`;
			}
			str += i;
		}
		str += "然后本回合结束时你摸X张牌，若未满足选择的条件，则删除此选项（X为你最后一次发动〖矜名〗选择的选项序号）。";
		return str;
	},
	oljiaozhao(player) {
		if (player.countMark("oldanxin")) {
			return lib.translate[`oljiaozhao_lv${player.countMark("oldanxin")}_info`];
		}
		return lib.translate["oljiaozhao_info"];
	},
};
export default dynamicTranslates;
