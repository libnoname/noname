import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	oldianzan(player) {
		const targets = player.getStorage("oldianzan").filter(target => target?.isIn());
		let str = "刘禅";
		if (targets?.length) {
			str = targets.map(target => get.rawName(target.name)).join("、");
			if (targets.length > 1) {
				str += "中的一人";
			}
		}
		return `点击此技能为${str}助力。`;
	},
	renneyan(player) {
		const bool = player.getStorage("renneyan", false);
		let yang = "弃置一张牌并令此牌额外结算一次，否则此牌无效",
			yin = "此牌无次数限制";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，锁定技，你使用非装备牌时",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	dcjianxiong(player) {
		return "当你受到伤害后，你可以摸" + get.cnNumber(player.countMark("dcjianxiong") + 1) + "张牌并获得对你造成伤害的牌，然后你令此技能摸牌数+1（至多为5）。";
	},
	dcbenxi(player) {
		const bool = player.storage.dcbenxi;
		let yang = "系统随机检索出一句转换为拼音后包含“wu,yi”的技能台词，然后你念出此台词",
			yin = "你获得上次所念出的台词对应的技能直到你的下个回合开始；若你已拥有该技能，则改为对其他角色各造成1点伤害";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，锁定技。当你失去手牌后，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	dcqixin(player) {
		const banned = player.storage.dcqixin_die;
		if (banned) {
			return '<span style="opacity:0.5">' + lib.translate.dcqixin_info + "</span>";
		}
		const bool = player.storage.dcqixin;
		let yang = "女（曹节）",
			yin = "男（刘协）";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。①出牌阶段，你可以将性别变更为：",
			end = "。②当你即将死亡时，你取消之并将性别变更为〖齐心①〗的转换状态，将体力调整至此状态的体力，然后你本局游戏不能发动〖齐心〗。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	olshouhun(player) {
		const storage = player.storage.olshouhun;
		const str = lib.translate.olshouhun_info;
		if (!storage) {
			return str;
		}
		const regex = /\[\d+\]/g;
		let match,
			result = str,
			index = 0;
		while ((match = regex.exec(str)) !== null) {
			if (index < storage.length) {
				result = result.replace(match[0], `[${storage[index]}]`);
			}
			index++;
		}
		return result;
	},
};
export default dynamicTranslates;
