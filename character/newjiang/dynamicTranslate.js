import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	lkbushi(player) {
		var list = lib.skill.lkbushi.getBushi(player).map(i => get.translation(i));
		return "①你使用" + list[0] + "牌无次数限制。②当你使用或打出" + list[1] + "牌后，你摸一张牌。③当你成为" + list[2] + "牌的目标后，你可以弃置一张牌，令此牌对你无效。④结束阶段开始时，你从牌堆或弃牌堆获得一张" + list[3] + "牌。⑤准备阶段开始时，你可调整此技能中四种花色的对应顺序。";
	},
	diezhang(player) {
		const bool = player.storage.diezhang;
		let cnNum = get.cnNumber(player.storage.duanwan ? 2 : 1);
		let yang = "当你使用牌被其他角色抵消后，你可以弃置一张牌，视为对其使用" + cnNum + "张【杀】",
			yin = "当其他角色使用牌被你抵消后，你可以摸" + cnNum + "张牌，视为对其使用一张【杀】";
		if (bool) {
			if (player.storage.duanwan) {
				yang = `<span style="text-decoration: line-through; ">${yang}</span>`;
			}
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			if (player.storage.duanwan) {
				yin = `<span style="text-decoration: line-through; ">${yin}</span>`;
			}
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = player.storage.duanwan ? "" : "①出牌阶段，你使用【杀】的次数上限+1。②",
			end = "。";
		start += "转换技。" + (player.storage.duanwan ? "每回合限一次，" : "");
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	spshidi(player) {
		const bool = player.countMark("spshidi") % 2 != 0;
		let yang = "②若你的“☯”数为偶数，则你至其他角色的距离-1，且你使用的黑色【杀】不可被响应",
			yin = "③若你的“☯”数为奇数，则其他角色至你的距离+1，且你不可响应红色【杀】";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，锁定技。①准备阶段/结束阶段开始时，若你发动此分支的累计次数为奇数/偶数，则你获得一个“☯”。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	xianmou(player) {
		const bool = player.storage.xianmou;
		let yang = "观看牌堆顶五张牌并获得至多X张牌，若未获得X张牌则获得〖遗计〗直到再发动此项",
			yin = "观看一名角色手牌并弃置其中至多X张牌，若弃置X张牌则你进行一次【闪电】判定";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，①游戏开始时，你可以转换此技能状态；②你失去过牌的回合结束时，你可以：",
			end = "（X为你本回合失去牌数）。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
};

export default dynamicTranslates;
