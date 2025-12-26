import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	twfeifu(player) {
		const bool = player.storage.twfeifu;
		let yang = "当你成为【杀】的唯一目标后",
			yin = "当你使用【杀】指定唯一目标后";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "锁定技，转换技。",
			end = "，目标角色须交给使用者一张牌。若此牌为装备牌，则使用者可使用此牌。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	twfengpo(player) {
		if (player.storage.twfengpo) {
			return "当你使用【杀】或【决斗】指定唯一目标后，你可观看目标角色的手牌并选择一项：⒈摸X张牌。⒉令此牌的伤害值基数+X（X为其手牌中的红色牌数）。";
		}
		return "①当你使用【杀】或【决斗】指定唯一目标后，你可观看目标角色的手牌并选择一项：⒈摸X张牌。⒉令此牌的伤害值基数+X（X为其手牌中的♦数）。②当你杀死一名角色后，你将〖凤魄①〗中的“♦数”改为“红色牌数”。";
	},
	twjiexun(player) {
		return lib.translate[player.hasSkill("funan_jiexun") ? "twjiexunx_info" : "twjiexun_info"];
	},
	twzhenliang(player) {
		const bool = player.storage.twzhenliang;
		let yang = "出牌阶段限一次。你可以弃置一张牌并对攻击范围内的一名角色造成1点伤害",
			yin = "当你或你攻击范围内的一名角色于你的回合外受到伤害时，你可以弃置一张牌令此伤害-1。然后若你以此法弃置的牌颜色与“任”的颜色相同，你摸一张牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	twdengjian(player) {
		let str = "①其他角色的弃牌阶段结束时，你可以随机获得本回合所有造成伤害的牌对应的实体牌的其中一张与你本轮以此法获得的牌的颜色均不同的【杀】，称为“剑法”。";
		if (player.isTempBanned("twdengjian")) {
			str = '<span style="opacity:0.5">' + str + "</span>";
		}
		str += "②你使用“剑法”牌不计入次数限制。";
		return str;
	},
	twduwang(player) {
		let str = "使命技。";
		if (!player.storage.twduwang_fail) {
			str += "①";
		}
		str += "出牌阶段开始时，你可以选择至多三名有牌的其他角色，摸X张牌（X为选择角色数+1），然后这些角色依次将一张牌当【决斗】对你使用。";
		if (!player.storage.twduwang_fail) {
			str += `\
			②当你处于濒死状态时，其他角色不能对你使用【桃】。\
			③使命：使用【决斗】或成为【决斗】目标的次数之和不小于4（若游戏总人数小于4则改为3）。\
			④成功：准备阶段，若你于你的上回合完成了〖独往③〗的使命，则你重置〖独往〗并将〖独往〗修改至只保留〖独往①〗的效果，选择一项：⒈获得〖狭勇〗；⒉重置〖延势〗并令其获得历战效果。\
			⑤失败：当你死亡时，使命失败。`;
		}
		return str;
	},
	twylyanshi(player) {
		return lib.translate[(player.storage.twduwang_ylyanshi ? "twylyanshix" : "twylyanshi") + "_info"];
	},
	twjielv(player) {
		if (player.storage.isInHuan) {
			return lib.translate.twjielvx_info;
		}
		return lib.translate.twjielv_info;
	},
	twbeiding(player) {
		if (player.storage.isInHuan) {
			return lib.translate.twbeidingx_info;
		}
		return lib.translate.twbeiding_info;
	},
};
export default dynamicTranslates;
