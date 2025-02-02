import { lib, game, ui, get, ai, _status } from "../../noname.js";

const cards = {
	dz_mantianguohai: {
		fullskin: true,
		type: "trick",
		enable: true,
		derivation: "tw_dongzhao",
		global: ["dz_mantianguohai"],
		selectTarget: [1, 2],
		filterTarget(card, player, target) {
			return target != player && target.countCards("hej") > 0;
		},
		content() {
			player.gainPlayerCard(target, "hej", true);
		},
		contentAfter() {
			"step 0";
			var evtx = event.getParent();
			event.targets = targets.filter(function (target) {
				return target.hasHistory("lose", function (evt) {
					return evt.getParent(3).name == "dz_mantianguohai" && evt.getParent(4) == evtx;
				});
			});
			if (!event.targets.length || !player.countCards("he")) event.finish();
			"step 1";
			var target = targets.shift();
			event.target = target;
			var next = player.chooseCard("he", true, "交给" + get.translation(target) + "一张牌");
			if (player.hasSkill("twyingjia") && player.countUsed("dz_mantianguohai") == 1)
				next.set("ai", function (card) {
					if (card.name == "dz_mantianguohai") return -10;
					return -get.value(card, _status.event.getParent().target);
				});
			"step 2";
			if (result.bool) {
				player.give(result.cards, target);
			}
			"step 3";
			if (targets.length && player.countCards("h") > 0) event.goto(1);
		},
		ai: {
			order: 6,
			tag: {
				lose: 1,
				loseCard: 1,
			},
			result: {
				target: -0.1,
			},
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
