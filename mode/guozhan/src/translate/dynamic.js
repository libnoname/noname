import { lib, game, ui, get as _get, ai, _status } from "../../../../noname.js";

export default {
	gz_longnu(player) {
		let storage = player.getStorage("gz_longnu", false),
			start = "转换技，锁定技，出牌阶段开始时，",
			yang = "你摸一张牌并失去1点体力，本回合红色手牌视为无距离限制的火【杀】",
			yin = "你减少1点体力上限并摸一张牌，本回合锦囊手牌视为无次数限制的雷【杀】";
		if (storage) {
			if (player.hasSkill("gz_longnu_fire")) {
				yang = `<span class="legendtext">${yang}</span>`;
			} else {
				yin = `<span class="bluetext">${yin}</span>`;
			}
		} else {
			if (player.hasSkill("gz_longnu_thunder")) {
				yin = `<span class="legendtext">${yin}</span>`;
			} else {
				yang = `<span class="firetext">${yang}</span>`;
			}
		}
		return `${start}阳：${yang}；阴：${yin}。`
	},
	gzzhaosong(player) {
		var storage = player.getStorage("gzzhaosong");
		var list1 = ["效果①", "效果②", "效果③"];
		var str = "每局游戏每项限一次。";
		var list2 = ["①一名角色进入濒死状态时，你可以令其回复至2点体力并摸一张牌。", "②出牌阶段，你可观看一名其他角色的所有暗置武将牌和手牌，然后可以获得其区域内的一张牌。", "③一名角色使用【杀】选择唯一目标后，你可以为此【杀】增加两个目标。"];
		for (var i = 0; i < 3; i++) {
			var bool = storage.includes(list1[i]);
			if (bool) {
				str += '<span style="text-decoration:line-through">';
			}
			str += list2[i];
			if (bool) {
				str += "</span>";
			}
		}
		return str;
	},
	gzshiyong(player) {
		return player.awakenedSkills.includes("gzyaowu") ? lib.translate.gzshiyongx_info : lib.translate.gzshiyong_info;
	},
	fakejuzhan(player) {
		let storage = player.getStorage("fakejuzhan", false),
			yang = "当你成为【杀】的目标后，你可以与使用者各摸X张牌，然后若使用者的武将牌均明置，则你可以暗置其一张武将牌，且其本回合不能明置此武将牌",
			yin = "当你使用【杀】指定目标后，你可以获得目标角色的X张牌，然后若你的武将牌均明置，则其可以暗置此武将牌，且你本回合不能明置此武将牌";
		if (storage) {
			yin = `<span class="bluetext">${yin}</span>`;
		} else {
			yang = `<span class="firetext">${yang}</span>`;
		}
		return `转换技。阳：${yang}；阴：${yin}。（X为使用者已损失的体力值且X至少为1）`;
	},
	fakeweirong(player) {
		let storage = player.getStorage("fakeweirong", false),
			yang = "你可以弃置X张牌，然后当你于本轮不因此法得到牌后，你摸一张牌",
			yin = "阳：你可以摸X张牌，然后当你于本轮不因此法失去牌后，你弃置一张牌";
		if (storage) {
			yin = `<span class="bluetext">${yin}</span>`;
		} else {
			yang = `<span class="firetext">${yang}</span>`;
		}
		return `转换技，每轮限一次，出牌阶段，阳：${yang}；阴：${yin}。（X为你上一轮以此法摸和弃置的牌数之和，且X至少为1，至多为你的体力上限）`;
	},
};
