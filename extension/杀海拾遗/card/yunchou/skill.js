import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCardConfig['skill'] } */
const skill = {
	toulianghuanzhu_ai1: {},
	toulianghuanzhu_ai2: {},
	suolianjia: {
		equipSkill: true,
		trigger: { player: "damageBefore" },
		filter(event, player) {
			if (
				event.source &&
				event.source.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return;
			}
			if (event.hasNature()) {
				return true;
			}
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
		},
		ai: {
			nofire: true,
			nothunder: true,
			effect: {
				target(card, player, target, current) {
					if (target.hasSkillTag("unequip2")) {
						return;
					}
					if (
						player.hasSkillTag("unequip", false, {
							name: card ? card.name : null,
							target: player,
							card: card,
						}) ||
						player.hasSkillTag("unequip_ai", false, {
							name: card ? card.name : null,
							target: target,
							card: card,
						})
					) {
						return;
					}
					if (card.name === "tiesuo" || get.tag(card, "natureDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	toulianghuanzhu2: {},
	g_chenhuodajie: {
		trigger: { global: "damageEnd" },
		filter(event, player) {
			if (event.player === player) {
				return false;
			}
			if (!event.player.countCards("he")) {
				return false;
			}
			if (!lib.filter.targetEnabled({ name: "chenhuodajie" }, player, event.player)) {
				return false;
			}
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return player.hasUsableCard("chenhuodajie");
		},
		direct: true,
		async content(event, trigger, player) {
			await player
				.chooseToUse(
					get.prompt("chenhuodajie", trigger.player).replace(/发动/, "使用"),
					function (card, player) {
						if (get.name(card) !== "chenhuodajie") {
							return false;
						}
						return lib.filter.cardEnabled(card, player, "forceEnable");
					},
					-1
				)
				.set("sourcex", trigger.player)
				.set("filterTarget", function (card, player, target) {
					if (target !== _status.event.sourcex) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("targetRequired", true);
		},
	},
};

export default skill;
