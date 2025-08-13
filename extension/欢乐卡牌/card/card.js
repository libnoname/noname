import { lib, game, ui, get, ai, _status } from "../../../noname.js";

const card = {
	monkey: {
		audio: "ext:欢乐卡牌/audio/card",
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["monkey"],
		ai: {
			basic: {
				equipValue: 8,
			},
		},
	},
	mianju: {
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		skills: ["mianju"],
		ai: {
			order: 9.5,
			basic: {
				equipValue(card, player) {
					if (!player.isTurnedOver()) {
						return 6;
					}
					if (player.isTurnedOver()) {
						return -10;
					}
					return 0;
				},
			},
		},
	},
	shoulijian: {
		audio: "ext:欢乐卡牌/audio/card",
		type: "basic",
		enable: true,
		fullskin: true,
		outrange: {
			global: 2,
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			let bool;
			if (target.countCards("he")) {
				bool = await target
					.chooseToDiscard("he", { type: "equip" }, "弃置一张装备牌或受到1点伤害")
					.set("ai", card => {
						var player = _status.event.player;
						var source = _status.event.getParent().player;
						if (get.damageEffect(player, source, player) > 0) {
							return -1;
						}
						return 7 - get.value(card);
					})
					.forResultBool();
			}
			if (!bool) {
				await target.damage();
			}
		},
		ai: {
			basic: {
				order: 9,
				value: 6,
				useful: 2,
			},
			result: {
				target: -2,
			},
			tag: {
				discard: 1,
				damage: 1,
			},
		},
		selectTarget: 1,
	},
	kuwu: {
		audio: "ext:欢乐卡牌/audio/card",
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		skills: ["kuwu"],
		nomod: true,
		nopower: true,
		unique: true,
		distance: {
			attackFrom: -1,
		},
		ai: {
			equipValue: 6,
		},
	},
	xuelunyang: {
		audio: "ext:欢乐卡牌/audio/card",
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["xuelunyang"],
		ai: {
			basic: {
				equipValue: 8,
			},
		},
	},
	jiuwei: {
		audio: "ext:欢乐卡牌/audio/card",
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["jiuwei"],
		ai: {
			basic: {
				equipValue: 8,
			},
		},
	},
};

for (let i in card) {
	card[i].image = "ext:欢乐卡牌/image/card/" + i + ".png";
}

export default card;
