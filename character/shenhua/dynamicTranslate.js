import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	drlt_jueyan(player) {
		if (player.hasSkill("drlt_jueyan_effect")) {
			return lib.translate["drlt_jueyan_rewrite_info"];
		}
		return lib.translate["drlt_jueyan_info"];
	},
	nzry_juzhan(player) {
		const bool = player.storage.nzry_juzhan;
		let yang = "当你成为其他角色【杀】的目标后，你可以与其各摸一张牌，然后其本回合内不能再对你使用牌",
			yin = "当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	nzry_zhenliang(player) {
		const bool = player.storage.nzry_zhenliang;
		let yang = "出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害",
			yin = "当你于回合外使用或打出的牌结算完成后，若此牌与“任”颜色相同，则你可以令一名角色摸一张牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	nzry_chenglve(player) {
		const bool = player.storage.nzry_chenglve;
		let yang = "你可以摸一张牌，然后弃置两张手牌",
			yin = "你可以摸两张牌，然后弃置一张手牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。出牌阶段限一次，",
			end = "。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	nzry_shenshi(player) {
		const bool = player.storage.nzry_shenshi;
		let yang = "出牌阶段限一次，你可以将一张牌交给一名手牌数最多的角色，然后对其造成1点伤害，若该角色因此死亡，则你可以令一名角色将手牌摸至四张",
			yin = "其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其一张牌，当前角色回合结束时，若此牌仍在该角色的手牌区或装备区，你将手牌摸至四张";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
};
export default dynamicTranslates;
