import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	changandajian_equip1: {
		fullskin: true,
		derivation: "shen_sunquan",
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -5 },
		onLose() {
			cards.forEach(card => {
				card.fix();
				card.remove();
				card.destroyed = true;
				game.log(card, "被销毁了");
			});
			player.addTempSkill("changandajian_destroy");
		},
		ai: {
			value(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			equipValue(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			basic: {
				equipValue: 2,
			},
		},
	},
	changandajian_equip2: {
		fullskin: true,
		cardimage: "changandajian_equip1",
		derivation: "shen_sunquan",
		type: "equip",
		subtype: "equip2",
		onLose() {
			cards.forEach(card => {
				card.fix();
				card.remove();
				card.destroyed = true;
				game.log(card, "被销毁了");
			});
			player.addTempSkill("changandajian_destroy");
		},
		ai: {
			value(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			equipValue(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			basic: {
				equipValue: 2,
			},
		},
	},
	changandajian_equip3: {
		fullskin: true,
		cardimage: "changandajian_equip1",
		derivation: "shen_sunquan",
		type: "equip",
		subtype: "equip3",
		distance: { globalTo: 2 },
		onLose() {
			cards.forEach(card => {
				card.fix();
				card.remove();
				card.destroyed = true;
				game.log(card, "被销毁了");
			});
			player.addTempSkill("changandajian_destroy");
		},
		ai: {
			value(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			equipValue(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			basic: {
				equipValue: 2,
			},
		},
	},
	changandajian_equip4: {
		fullskin: true,
		cardimage: "changandajian_equip1",
		derivation: "shen_sunquan",
		type: "equip",
		subtype: "equip4",
		distance: { globalFrom: -2 },
		onLose() {
			cards.forEach(card => {
				card.fix();
				card.remove();
				card.destroyed = true;
				game.log(card, "被销毁了");
			});
			player.addTempSkill("changandajian_destroy");
		},
		ai: {
			value(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			equipValue(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			basic: {
				equipValue: 2,
			},
		},
	},
	changandajian_equip5: {
		fullskin: true,
		cardimage: "changandajian_equip1",
		derivation: "shen_sunquan",
		type: "equip",
		subtype: "equip5",
		skills: ["changandajian_equip5"],
		onLose() {
			cards.forEach(card => {
				card.fix();
				card.remove();
				card.destroyed = true;
				game.log(card, "被销毁了");
			});
			player.addTempSkill("changandajian_destroy");
		},
		ai: {
			value(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			equipValue(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			basic: {
				equipValue: 2,
			},
		},
	},
	changandajian_equip6: {
		fullskin: true,
		cardimage: "changandajian_equip1",
		derivation: "shen_sunquan",
		type: "equip",
		subtype: "equip6",
		distance: { globalTo: 2, globalFrom: -2 },
		onLose() {
			cards.forEach(card => {
				card.fix();
				card.remove();
				card.destroyed = true;
				game.log(card, "被销毁了");
			});
			player.addTempSkill("changandajian_destroy");
		},
		ai: {
			value(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			equipValue(card, player) {
				if (
					game.hasPlayer(function (current) {
						return lib.skill.changandajian_destroy.getEffect(player, current) > 0;
					})
				) {
					return 0;
				}
				return 8;
			},
			basic: {
				equipValue: 2,
			},
		},
	},
};

export default cards;
