import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCharacterConfig['skill'] } */
const skill = {
	mduohun: {
		trigger: { player: "dyingAfter" },
		forced: true,
		filter(event, player) {
			return event.source && event.source.isIn() && event.source.hp > 0;
		},
		logTarget: "source",
		content() {
			trigger.source.loseHp();
		},
		ai: {
			threaten(player, target) {
				if (target.hp === 1) {
					return 0.6;
				}
				return 1;
			},
			effect: {
				target(card, player, target, current) {
					if (!target.hasFriend()) {
						return;
					}
					if (target.hp <= 1 && get.tag(card, "damage")) {
						return [1, 0, 0, -1];
					}
				},
			},
		},
	},
	lingyong: {
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasSkill("subplayer") && player.getSubPlayers("lingyong_get").length > 0;
		},
		nosub: true,
		group: "lingyong_get",
		direct: true,
		delay: 0,
		skillAnimation: true,
		animationColor: "thunder",
		content() {
			player.callSubPlayer().set("tag", "lingyong_get");
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
		subSkill: {
			get: {
				trigger: { global: "dieAfter" },
				forced: true,
				filter(event, player) {
					return !event.player.isMin() && ![player.name, player.name1, player.name2].includes(event.player.name);
				},
				content() {
					var skills = lib.character[trigger.player.name][3].slice(0);
					for (var i = 0; i < skills.length; i++) {
						if (lib.skill[skills[i]].nosub) {
							skills.splice(i--, 1);
						}
					}
					player.addSubPlayer({
						name: trigger.player.name,
						skills: skills,
						hs: get.cards(2),
						intro: "出牌阶段，你可以调遣此随从（直到随从死亡不可再次切换）",
					});
				},
			},
		},
	},
	mhuanyi: {
		round: 2,
		trigger: { player: "phaseEnd" },
		direct: true,
		addintro(storage, player) {
			if (player.hasSkill("mhuanyi_target")) {
				return "直到下一回合开始，当成为某类型的卡牌的惟一目标时，将目标转移给某名其他角色；";
			}
			return "";
		},
		content() {
			"step 0";
			var rand = Math.random();
			player
				.chooseTarget(get.prompt2("mhuanyi"), function (card, player, target) {
					return target !== player;
				})
				.set("ai", function (target) {
					if (get.attitude(player, target) < 0) {
						return rand;
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				if (player.isUnderControl(true)) {
					player.line(event.target, "green");
				}
				player
					.chooseControl("基本牌", "非基本牌", "cancel2", function () {
						return Math.floor(Math.random() * 2);
					})
					.set("prompt", "选择一种卡牌类型");
			} else {
				event.finish();
			}
			"step 2";
			if (result.control && result.control !== "cancel2") {
				player.logSkill("mhuanyi");
				player.storage.mhuanyi_target = [event.target, result.index];
				player.addTempSkill("mhuanyi_target", { player: "phaseBegin" });
			}
		},
		subSkill: {
			target: {
				trigger: { target: "useCardToBefore" },
				priority: 6,
				forced: true,
				onremove: true,
				group: "mhuanyi_die",
				filter(event, player) {
					if (!player.storage.mhuanyi_target) {
						return false;
					}
					if (event.player === player.storage.mhuanyi_target[0]) {
						return false;
					}
					if (get.type(event.card) === "basic") {
						if (player.storage.mhuanyi_target[1] !== 0) {
							return false;
						}
					} else {
						if (player.storage.mhuanyi_target[1] !== 1) {
							return false;
						}
					}
					if (!lib.filter.targetEnabled2(event.card, event.player, player.storage.mhuanyi_target[0])) {
						return false;
					}
					return true;
				},
				logTarget(event, player) {
					return player.storage.mhuanyi_target[0];
				},
				content() {
					trigger.target = player.storage.mhuanyi_target[0];
					player.removeSkill("mhuanyi_target");
				},
			},
			die: {
				trigger: { global: "dieAfter" },
				silent: true,
				filter(event, player) {
					if (!player.storage.mhuanyi_target) {
						return false;
					}
					return event.player === player.storage.mhuanyi_target[0];
				},
				content() {
					player.removeSkill("mhuanyi_target");
				},
			},
		},
	},
	msuoling: {
		trigger: { global: "useCard" },
		direct: true,
		priority: 5.5,
		round: 1,
		filter(event, player) {
			if (get.type(event.card) === "trick" && event.card.isCard) {
				if (event.player === player) {
					return false;
				}
				if (!player.countCards("he", { suit: get.suit(event.card) })) {
					return false;
				}
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			var att = get.attitude(player, trigger.player);
			var suit = get.suit(trigger.card);
			player
				.chooseToDiscard("he", get.prompt2("msuoling", trigger.player), function (card) {
					return get.suit(card) === suit;
				})
				.set("autodelay", true)
				.set("logSkill", ["msuoling", trigger.player]).ai = function (card) {
				if (att < 0) {
					return 8 - get.value(card);
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				trigger.cancel();
				player.chooseUseTarget(true, trigger.card);
			}
		},
	},
	mtongnian: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		filter(event, player) {
			var enemies = player.getEnemies();
			for (var i = 0; i < enemies.length; i++) {
				if (enemies[i].countCards("h")) {
					return true;
				}
			}
			return false;
		},
		getList(player) {
			var list = [];
			var enemies = player.getEnemies();
			for (var i = 0; i < enemies.length; i++) {
				list.addArray(enemies[i].getCards("h"));
			}
			return list;
		},
		content() {
			var list = lib.skill.mtongnian.getList(player);
			if (list.length) {
				var card = list.randomGet();
				var fake = game.createCard(card);
				fake.mtongnian_link = card;
				player.gain(fake, "draw")._triggered = null;
				fake.classList.add("glow");
				fake._destroy = "mtongnian";
			}
		},
		group: ["mtongnian_change", "mtongnian_use", "mtongnian_lose"],
		subSkill: {
			change: {
				trigger: { player: "useCard" },
				silent: true,
				filter(event, player) {
					return player.hasCard(function (card) {
						return card.mtongnian_link ? true : false;
					}, "h");
				},
				content() {
					var list = lib.skill.mtongnian.getList(player);
					var hs = player.getCards("h", function (card) {
						return card.mtongnian_link ? true : false;
					});
					for (var i = 0; i < hs.length; i++) {
						var current = hs[i].mtongnian_link;
						hs[i].mtongnian_link = list.randomGet(current);
						if (!hs[i].mtongnian_link) {
							hs[i].mtongnian_link = current;
						}
						hs[i].init(hs[i].mtongnian_link);
					}
				},
			},
			use: {
				trigger: { player: "useCardBefore" },
				silent: true,
				filter(event, player) {
					return event.card.mtongnian_link ? true : false;
				},
				content() {
					var link = trigger.card.mtongnian_link;
					var target = get.owner(link);
					if (target && target !== player) {
						trigger.cards.add(trigger.card);
						player.lose(trigger.cards, ui.discardPile);
						trigger.card = link;
						trigger.cards.length = 0;
						trigger.cards.push(link);
						target.lose(link, ui.discardPile);
						player.logSkill("mtongnian", target);
						game.log(target, "失去了", link);
						game.delayx();
					} else {
						player.lose(trigger.card);
						trigger.cancel();
					}
				},
			},
			lose: {
				trigger: { player: "phaseUseEnd", global: "loseEnd" },
				silent: true,
				filter(event, player) {
					if (event.name === "lose") {
						return lib.skill.mtongnian.getList(player).length === 0;
					}
					return true;
				},
				content() {
					var hs = player.getCards("h", function (card) {
						return card.mtongnian_link ? true : false;
					});
					if (hs.length) {
						player.lose(hs)._triggered = null;
					}
				},
			},
		},
		ai: {
			threaten: 1.3,
		},
	},
	mbaizhan: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event) {
			return event.num > 0;
		},
		content() {
			player.changeHujia(trigger.num);
		},
		ai: {
			damageBonus: true,
		},
	},
	msilian: {
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return player.hujia > 0;
		},
		check(event, player) {
			return player.hujia > 1 && player.hp > 1;
		},
		content() {
			player.storage.msilian = player.hujia;
			player.changeHujia(-player.hujia);
			player.insertPhase();
		},
		group: ["msilian_hp", "msilian_draw"],
		subSkill: {
			hp: {
				trigger: { player: "phaseAfter" },
				silent: true,
				filter(event, player) {
					return event.skill === "msilian" && !player.getStat("damage");
				},
				content() {
					player.loseHp();
				},
			},
			draw: {
				trigger: { player: "phaseDrawBegin" },
				filter(event) {
					return event.getParent("phase").skill === "msilian";
				},
				silent: true,
				content() {
					trigger.num += player.storage.msilian - 2;
				},
			},
		},
	},
};

export default skill;
