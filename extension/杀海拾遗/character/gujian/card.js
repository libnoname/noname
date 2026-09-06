import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
	yanjiadan_heart: {
		type: "jiguan",
		cardcolor: "heart",
		fullskin: true,
		derivation: "gjqt_xieyi",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			var choice = null;
			var targets = game.filterPlayer(function (current) {
				return get.attitude(player, current) > 0;
			});
			for (var i = 0; i < targets.length; i++) {
				if (targets[i].hp === 1) {
					if (targets[i].hasSkill("yunvyuanshen_skill")) {
						choice = "ziyangdan";
					} else {
						choice = "yunvyuanshen";
						break;
					}
				}
			}
			if (
				!choice &&
				game.hasPlayer(function (current) {
					return current.hp === 1 && get.attitude(player, current) < 0 && get.damageEffect(current, player, player, "fire") > 0;
				})
			) {
				choice = "shatang";
			}
			if (!choice) {
				for (var i = 0; i < targets.length; i++) {
					if (!targets[i].hasSkill("yunvyuanshen_skill")) {
						choice = "yunvyuanshen";
						break;
					}
				}
			}
			if (!choice) {
				choice = "ziyangdan";
			}
			player
				.chooseVCardButton("选择一张牌视为使用之", ["yunvyuanshen", "ziyangdan", "shatang"])
				.set("ai", function (button) {
					if (button.link[2] === _status.event.choice) {
						return 2;
					}
					return Math.random();
				})
				.set("choice", choice)
				.set("filterButton", function (button) {
					return _status.event.player.hasUseTarget(button.link[2]);
				});
			"step 1";
			player.chooseUseTarget(true, result.links[0][2]);
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	yanjiadan_diamond: {
		type: "jiguan",
		cardcolor: "diamond",
		fullskin: true,
		derivation: "gjqt_xieyi",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			var choice = "liufengsan";
			if (
				game.hasPlayer(function (current) {
					var eff = get.effect(current, { name: "shenhuofeiya" }, player, player);
					if (eff >= 0) {
						return false;
					}
					if (current.hp === 1 && eff < 0) {
						return true;
					}
					if (get.attitude(player, current) < 0 && get.attitude(player, current.getNext() < 0) && get.attitude(player, current.getPrevious()) < 0) {
						return true;
					}
					return false;
				})
			) {
				choice = "shenhuofeiya";
			}
			player
				.chooseVCardButton("选择一张牌视为使用之", ["liufengsan", "shujinsan", "shenhuofeiya"])
				.set("ai", function (button) {
					if (button.link[2] === _status.event.choice) {
						return 2;
					}
					return Math.random();
				})
				.set("choice", choice)
				.set("filterButton", function (button) {
					return _status.event.player.hasUseTarget(button.link[2]);
				});
			"step 1";
			player.chooseUseTarget(true, result.links[0][2]);
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	yanjiadan_club: {
		type: "jiguan",
		cardcolor: "club",
		fullskin: true,
		derivation: "gjqt_xieyi",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			var choice = "liutouge";
			player
				.chooseVCardButton("选择一张牌视为使用之", ["bingpotong", "liutouge", "mianlijinzhen"])
				.set("ai", function (button) {
					if (button.link[2] === _status.event.choice) {
						return 2;
					}
					return Math.random();
				})
				.set("choice", choice)
				.set("filterButton", function (button) {
					return _status.event.player.hasUseTarget(button.link[2]);
				});
			"step 1";
			player.chooseUseTarget(true, result.links[0][2]);
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	yanjiadan_spade: {
		type: "jiguan",
		cardcolor: "spade",
		fullskin: true,
		derivation: "gjqt_xieyi",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			var choice = null;
			if (player.getUseValue("longxugou") > 0) {
				choice = "longxugou";
			} else if (player.getUseValue("qiankunbiao") > 0) {
				choice = "qiankunbiao";
			} else if (player.getUseValue("feibiao") > 0) {
				choice = "qiankunbiao";
			}
			player
				.chooseVCardButton("选择一张牌视为使用之", ["feibiao", "qiankunbiao", "longxugou"])
				.set("ai", function (button) {
					if (button.link[2] === _status.event.choice) {
						return 2;
					}
					return Math.random();
				})
				.set("choice", choice)
				.set("filterButton", function (button) {
					return _status.event.player.hasUseTarget(button.link[2]);
				});
			"step 1";
			player.chooseUseTarget(true, result.links[0][2]);
		},
		ai: {
			order: 5,
			result: {
				player(player) {
					if (player.getUseValue("feibiao") > 0) {
						return 1;
					}
					if (player.getUseValue("qiankunbiao") > 0) {
						return 1;
					}
					if (player.getUseValue("longxugou") > 0) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
};

for (let i in card) {
	card[i].image = "ext:杀海拾遗/image/card/" + i + ".png";
}

export default card;
