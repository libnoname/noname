import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	dcjianxiong(player) {
		return "当你受到伤害后，你可以摸" + get.cnNumber(player.countMark("dcjianxiong") + 1) + "张牌并获得对你造成伤害的牌，然后你令此技能摸牌数+1（至多为5）。";
	},
	dcbenxi(player) {
		if (player.storage.dcbenxi) return "转换技，锁定技。当你失去手牌后，阴：系统随机检索出一句转换为拼音后包含“wu,yi”的技能台词，然后你念出此台词。<span class='bluetext'>阳：你获得上次所念出的台词对应的技能直到你的下个回合开始；若你已拥有该技能，则改为对其他角色各造成1点伤害。</span>";
		return "转换技，锁定技。当你失去手牌后，<span class='bluetext'>阴：系统随机检索出一句转换为拼音后包含“wu,yi”的技能台词，然后你念出此台词。</span>阳：你获得上次所念出的台词对应的技能直到你的下个回合开始；若你已拥有该技能，则改为对其他角色各造成1点伤害。";
	},
	dcqixin(player) {
		const storage = player.storage["dcqixin"];
		const banned = player.storage.dcqixin_die;
		if (banned) return '<span style="opacity:0.5">' + lib.translate.dcqixin_info + "</span>";
		let str = "转换技。①出牌阶段，你可以将性别变更为：";
		if (!storage) str += '<span class="bluetext">';
		str += "阴，曹节--女；";
		if (!storage) str += "</span>";
		if (storage) str += '<span class="bluetext">';
		str += "阳，刘协--男。";
		if (storage) str += "</span>";
		return str + "②当你即将死亡时，你取消之并将性别变更为〖齐心①〗的转换状态，将体力调整至此状态的体力，然后你本局游戏不能发动〖齐心〗。";
	},
};
export default dynamicTranslates;
