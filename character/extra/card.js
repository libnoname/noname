import { lib, game, ui, get, ai, _status } from "../../noname.js";

const cards = {
	//神肘不疑的五灵卡牌
	wuqinxi_hu: {
		fullskin: true,
		noname: true,
	},
	wuqinxi_lu: {
		fullskin: true,
		noname: true,
	},
	wuqinxi_xiong: {
		fullskin: true,
		noname: true,
	},
	wuqinxi_yuan: {
		fullskin: true,
		noname: true,
	},
	wuqinxi_he: {
		fullskin: true,
		noname: true,
	},
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
	qizhengxiangsheng: {
		enable: true,
		type: "trick",
		fullskin: true,
		derivation: "shen_xunyu",
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			if (!event.qizheng_name) {
				if (player.isIn()) {
					player
						.chooseControl("奇兵", "正兵")
						.set("prompt", "请选择" + get.translation(target) + "的标记")
						.set(
							"choice",
							(function () {
								var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
								var e2 = 0;
								if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
									e2 = -1;
								}
								var es = target.getGainableCards(player, "e");
								if (es.length) {
									e2 = Math.min(
										e2,
										(function () {
											var max = 0;
											for (var i of es) {
												max = Math.max(max, get.value(i, target));
											}
											return -max / 4;
										})()
									);
								}
								if (Math.abs(e1 - e2) <= 0.3) {
									return Math.random() < 0.5 ? "奇兵" : "正兵";
								}
								if (e1 < e2) {
									return "奇兵";
								}
								return "正兵";
							})()
						)
						.set("ai", function () {
							return _status.event.choice;
						});
				} else {
					event.finish();
				}
			}
			"step 1";
			if (!event.qizheng_name && result && result.control) {
				event.qizheng_name = result.control;
			}
			if (event.directHit) {
				event._result = { bool: false };
			} else {
				target
					.chooseToRespond("请打出一张杀或闪响应奇正相生", function (card, player) {
						var name = get.name(card);
						return name == "sha" || name == "shan";
					})
					.set("ai", function (card) {
						if (_status.event.choice == "all") {
							var rand = get.rand("qizhengxiangsheng");
							if (rand > 0.5) {
								return 0;
							}
							return 1 + Math.random();
						}
						if (get.name(card) == _status.event.choice) {
							return get.order(card);
						}
						return 0;
					})
					.set("respondTo", [player, card])
					.set(
						"choice",
						(function () {
							if (target.hasSkillTag("useShan")) {
								return "shan";
							}
							if (typeof event.qizheng_aibuff == "boolean") {
								var shas = target.getCards("h", "sha"),
									shans = target.getCards("h", "shan");
								if (event.qizheng_aibuff) {
									if (shas.length >= Math.max(1, shans.length)) {
										return "shan";
									}
									if (shans.length > shas.length) {
										return "sha";
									}
									return false;
								}
								if (!shas.length || !shans.length) {
									return false;
								}
							}
							var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
							var e2 = 0;
							if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
								e2 = -1;
							}
							var es = target.getGainableCards(player, "e");
							if (es.length) {
								e2 = Math.min(
									e2,
									(function () {
										var max = 0;
										for (var i of es) {
											max = Math.max(max, get.value(i, target));
										}
										return -max / 4;
									})()
								);
							}
							if (e1 - e2 >= 0.3) {
								return "shan";
							}
							if (e2 - e1 >= 0.3) {
								return "sha";
							}
							return "all";
						})()
					);
			}
			"step 2";
			var name = result.bool ? result.card.name : null,
				require = event.qizheng_name;
			if (require == "奇兵" && name != "sha") {
				target.damage();
			} else if (require == "正兵" && name != "shan" && target.countGainableCards(player, "he") > 0) {
				player.gainPlayerCard(target, true, "he");
			}
		},
		ai: {
			order: 5,
			tag: {
				damage: 0.5,
				gain: 0.5,
				loseCard: 1,
				respondShan: 1,
				respondSha: 1,
			},
			result: {
				target(player, target) {
					var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
					var e2 = 0;
					if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
						e2 = -1;
					}
					var es = target.getGainableCards(player, "e");
					if (es.length) {
						e2 = Math.min(
							e2,
							(function () {
								var max = 0;
								for (var i of es) {
									max = Math.max(max, get.value(i, target));
								}
								return -max / 4;
							})()
						);
					}
					if (
						game.hasPlayer(function (current) {
							return current.hasSkill("tianzuo") && get.attitude(current, player) <= 0;
						})
					) {
						return Math.max(e1, e2);
					}
					return Math.min(e1, e2);
				},
			},
		},
	},
};

export default cards;
