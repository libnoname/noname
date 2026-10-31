import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	dz_mantianguohai: {
		fullskin: true,
		type: "trick",
		enable: true,
		derivation: "tw_dongzhao",
		global: ["dz_mantianguohai"],
		selectTarget: [1, 2],
		filterTarget(card, player, target) {
			return target != player && target.countGainableCards(player, "hej") > 0;
		},
		async content(event, trigger, player) {
			await player.gainPlayerCard(event.target, "hej", true);
		},
		async contentAfter(event, trigger, player) {
			const evtx = event.getParent();
			const targets = event.targets
				.filter(target => {
					return target.hasHistory("lose", evt => evt.getParent(3).name == "dz_mantianguohai" && evt.getParent(4) == evtx);
				})
				.sortBySeat();
			while (targets.length && player.countCards("he")) {
				const target = targets.shift();
				if (target.isIn()) {
					await player.chooseToGive(target, "he", true, `交给${get.translation(target)}一张牌`).set("ai", card => {
						const { player, target } = get.event();
						if (player.hasSkill("twyingjia") && player.countUsed("dz_mantianguohai") == 1 && card.name == "dz_mantianguohai") {
							return -10;
						}
						return -get.value(card, target);
					});
				}
			}
		},
		ai: {
			order: 6,
			tag: {
				lose: 1,
				loseCard: 1,
			},
			result: { target: -0.1 },
		},
	},
	gx_lingbaoxianhu: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		derivation: "tw_gexuan",
		cardcolor: "heart",
		distance: { attackFrom: -2 },
		ai: {
			basic: {
				equipValue: 4.5,
			},
		},
		skills: ["gx_lingbaoxianhu"],
	},
	gx_taijifuchen: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		derivation: "tw_gexuan",
		cardcolor: "heart",
		distance: { attackFrom: -4 },
		ai: {
			basic: {
				equipValue: 4.5,
			},
		},
		skills: ["gx_taijifuchen"],
	},
	gx_chongyingshenfu: {
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		derivation: "tw_gexuan",
		cardcolor: "heart",
		ai: {
			basic: {
				equipValue: 7,
			},
		},
		skills: ["gx_chongyingshenfu"],
		loseDelay: false,
	},
	meiyingqiang: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		cardimage: "yinyueqiang",
		cardcolor: "diamond",
		derivation: "tw_zhaoxiang",
		distance: { attackFrom: -2 },
		ai: {
			basic: {
				equipValue: 4.5,
			},
		},
		skills: ["meiyingqiang"],
	},
};
export default cards;
