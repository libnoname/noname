import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCharacterConfig['skill'] } */
const skill = {
	hshuanyu: {
		trigger: { player: "damageEnd" },
		frequent: true,
		content() {
			if (!lib.characterPack.hearth) {
				player.draw();
				return;
			}
			var list = [];
			for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
				var name = lib.cardPack.mode_derivation[i];
				var info = lib.card[name];
				if (info.gainable === false || info.destroy) {
					continue;
				}
				if (lib.characterPack.hearth[info.derivation]) {
					list.push(name);
				}
			}
			if (!list.length) {
				player.draw();
			} else {
				player.discoverCard(list);
			}
		},
		ai: {
			threaten: 0.8,
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [1, get.tag(card, "damage") * 2];
						}
						if (target.hp === 3) {
							return [1, get.tag(card, "damage") * 1.5];
						}
						if (target.hp === 2) {
							return [1, get.tag(card, "damage") * 0.5];
						}
					}
				},
			},
		},
	},
	wxuying: {
		trigger: { player: "phaseBegin" },
		forced: true,
		content() {
			"step 0";
			var cards = player.getCards("h", function (card) {
				return card.name === "hsfashu_anyingjingxiang" || card._wxuying;
			});
			if (cards.length) {
				player.lose(cards)._triggered = null;
			}
			"step 1";
			var card = game.createCard("hsfashu_anyingjingxiang");
			card._modUseful = function () {
				return 7;
			};
			card._modValue = function () {
				return 7;
			};
			player.gain(card, "gain2");
		},
		subSkill: {
			lose: {
				trigger: { player: "loseAfter" },
				silent: true,
				content() {
					for (var i = 0; i < trigger.cards.length; i++) {
						if (trigger.cards[i]._wxuying) {
							player.storage.wxuying = trigger.cards[i];
							delete trigger.cards[i]._wxuying;
						}
					}
				},
			},
			change: {
				trigger: { player: ["useCard", "respond"] },
				silent: true,
				content() {
					var cards = player.getCards("h", function (card) {
						return card.name === "hsfashu_anyingjingxiang" || card._wxuying;
					});
					for (var i = 0; i < cards.length; i++) {
						cards[i].init(trigger.card);
						cards[i].classList.add("glow");
						cards[i]._wxuying = true;
					}
				},
			},
			hide: {
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				priority: -1,
				filter(event, player) {
					return event.cards.includes(player.storage.wxuying);
				},
				content() {
					if (_status.currentPhase === player) {
						player.draw();
					} else {
						player.tempHide();
					}
					delete player.storage.wxuying;
				},
			},
			clear: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content() {
					delete player.storage.wxuying;
				},
			},
		},
		group: ["wxuying_change", "wxuying_hide", "wxuying_lose", "wxuying_clear"],
	},
	buwendingyibian_ai1: {},
	buwendingyibian_ai2: {},
	buwendingyibian_lose: {
		trigger: { global: "phaseAfter" },
		silent: true,
		content() {
			var cards = player.getCards("h", function (card) {
				return card.name === "hsfashu_buwendingyibian" && card._destroy;
			});
			if (cards.length) {
				player.lose(cards)._triggered = null;
			}
		},
	},
	yibian: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		filter(event, player) {
			return !player.countCards("h", "hsfashu_buwendingyibian");
		},
		content() {
			player.gain(game.createCard("hsfashu_buwendingyibian"), "gain2");
		},
	},
	hualing: {
		enable: "phaseUse",
		round: 3,
		skillAnimation: true,
		filterTarget(card, player, target) {
			return target !== player;
		},
		content() {
			"step 0";
			player.chooseSkill(target, function (info, skill) {
				return !player.hasSkill(skill);
			});
			"step 1";
			if (result.bool) {
				var skill = result.skill;
				player.addAdditionalSkill("hualing", skill);
				player.popup(skill);
				player.markSkillCharacter("hualing", target.name, get.skillTranslation(skill, player), get.skillInfoTranslation(skill));
			}
			"step 2";
			var rank = get.rank(target, true);
			var list = get.gainableCharacters(true);
			var choice = [];
			for (var i = 0; i < list.length; i++) {
				if (get.rank(list[i], true) === rank + 1) {
					choice.push(list[i]);
				}
			}
			if (!choice.length) {
				for (var i = 0; i < list.length; i++) {
					if (get.rank(list[i], true) === rank) {
						choice.push(list[i]);
					}
				}
			}
			if (choice.length) {
				var hp = target.hp;
				var name = choice.randomGet();
				target.reinit(target.name, name);
				target.hp = Math.min(hp, target.maxHp);
				target.update();
				game.triggerEnter(target);
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return 1 / (get.rank(target, true) + 1);
				},
			},
		},
	},
	muyin: {
		trigger: { player: "loseEnd" },
		forced: true,
		filter(event, player) {
			if (player.countCards("h")) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "h") {
					return true;
				}
			}
			return false;
		},
		content() {
			player.tempHide();
		},
		ai: {
			noh: true,
			skillTagFilter(player, tag) {
				if (tag === "noh") {
					if (player.countCards("h") !== 1) {
						return false;
					}
				}
			},
		},
	},
	tqchuanyue: {
		trigger: { player: "phaseBeginStart" },
		forced: true,
		ai: {
			threaten: 1.5,
		},
		content() {
			var list = ["oldhanshuang", "oldyanshu", "oldfbeifa", "oldmalymowang", "oldfenlie", "oldshifa", "oldfushi", "oldhuanjue", "oldzhanhou", "oldduxin", "oldenze", "oldyulu"];
			var map = {
				oldhanshuang: "hs_bchillmaw",
				oldyanshu: "hs_antonidas",
				oldfbeifa: "hs_fuding",
				oldmalymowang: "hs_malygos",
				oldfenlie: "hs_kchromaggus",
				oldshifa: "hs_shifazhe",
				oldfushi: "hs_alextrasza",
				oldhuanjue: "hs_zhihuanhua",
				oldzhanhou: "hs_jgarrosh",
				oldduxin: "hs_xialikeer",
				oldenze: "hs_malorne",
				oldyulu: "hs_sainaliusi",
			};
			for (var i = 0; i < list.length; i++) {
				var skill = list[i];
				if (!lib.skill[skill] || player.hasSkill(skill) || get.is.empty(lib.skill[skill])) {
					list.splice(i--, 1);
				}
			}
			if (list.length) {
				var skill = list.randomGet();
				player.addAdditionalSkill("tqchuanyue", skill);
				player.popup(skill);
				player.flashAvatar("tqchuanyue", map[skill]);
				player.markSkillCharacter("tqchuanyue", map[skill], get.skillTranslation(skill), get.skillInfoTranslation(skill));
			}
		},
	},
	oldhuanjue: {
		trigger: { global: "useCard1" },
		usable: 1,
		filter(event, player) {
			if (event.targets.length !== 1) {
				return false;
			}
			if (event.player === player) {
				return false;
			}
			if (player !== event.targets[0]) {
				return false;
			}
			for (var i = 0; i < lib.inpile.length; i++) {
				var info = lib.card[lib.inpile[i]];
				if (info.multitarget) {
					continue;
				}
				if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, event.player, player)) {
					return true;
				}
			}
			return false;
		},
		check(event, player) {
			return get.effect(player, event.card, event.player, player) < 0;
		},
		prompt2(event, player) {
			return "发现一张牌代替" + get.translation(event.player) + "对你使用的" + get.translation(event.card);
		},
		autodelay: true,
		content() {
			"step 0";
			var list = [],
				list1 = [],
				list2 = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				var info = lib.card[lib.inpile[i]];
				if (info.multitarget) {
					continue;
				}
				if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, trigger.player, trigger.targets[0])) {
					var cardinfo = [trigger.card.suit || "", trigger.card.number || "", lib.inpile[i]];
					list1.push(cardinfo);
					if (info.type !== "equip") {
						list2.push(cardinfo);
					}
				}
			}
			var equipped = false;
			for (var i = 0; i < 3; i++) {
				if (equipped && list2.length) {
					list.push(list2.randomRemove());
				} else {
					equipped = true;
					list.push(list1.randomRemove());
				}
			}
			player.chooseButton(true, ["幻觉", [list, "vcard"]]).ai = function (button) {
				var card = {
					suit: trigger.card.suit,
					number: trigger.card.number,
					name: button.link[2],
				};
				return get.effect(trigger.targets[0], card, trigger.player, player);
			};
			"step 1";
			if (result.bool) {
				var card = game.createCard({
					suit: trigger.card.suit || lib.suit.randomGet(),
					number: trigger.card.number || Math.ceil(Math.random() * 13),
					name: result.links[0][2],
				});
				event.card = card;
				game.log(player, "将", trigger.card, "变为", card);
				trigger.card = get.autoViewAs(card);
				trigger.cards = [card];
				game.cardsGotoOrdering(card).relatedEvent = trigger;
			} else {
				event.finish();
			}
			"step 2";
			player.$throw(event.card, null, null, true);
			if (player === trigger.player) {
				player.line(trigger.targets[0], "green");
			} else {
				player.line(trigger.player, "green");
			}
			game.delayx(0.5);
		},
		ai: {
			threaten: 0.1,
		},
	},
	hshuanling: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.storage.hshuanling.length && player.countCards("he");
		},
		init(player) {
			player.storage.hshuanling = [];
		},
		intro: {
			content: "cards",
		},
		content() {
			"step 0";
			var num = Math.min(Math.max(1, player.countCards("e")), player.storage.hshuanling.length);
			var next = player.chooseToDiscard("he", get.prompt2("hshuanling"), [1, num]);
			next.ai = function (card) {
				if (get.position(card) === "e") {
					return 7 - get.value(card);
				}
				return 8 - get.value(card);
			};
			next.logSkill = "hshuanling";
			next.delay = false;
			"step 1";
			if (result.bool) {
				event.num = result.cards.length;
				player.draw(event.num);
			} else {
				event.finish();
			}
			"step 2";
			if (event.num) {
				var targets = game.filterPlayer();
				var list = player.storage.hshuanling.slice(0);
				while (list.length) {
					var choice = list.randomRemove();
					var card = game.createCard(choice);
					var target;
					while (targets.length) {
						target = targets.randomRemove();
						if (lib.filter.targetEnabled2(card, player, target) && get.effect(target, card, player, player) > 0) {
							break;
						}
						target = null;
					}
					if (target) {
						player.storage.hshuanling.remove(choice);
						if (!player.storage.hshuanling.length) {
							player.unmarkSkill("hshuanling");
						} else {
							player.syncStorage("hshuanling");
							player.updateMarks();
						}
						player.useCard(card, target);
						break;
					}
				}
				event.num--;
				event.redo();
			}
		},
		group: ["hshuanling_count"],
		subSkill: {
			count: {
				trigger: { global: "useCard" },
				silent: true,
				filter(event, player) {
					if (get.is.converted(event)) {
						return false;
					}
					if (!event.player.isEnemiesOf(player)) {
						return false;
					}
					if (get.type(event.card) !== "trick") {
						return false;
					}
					if (event.targets.length !== 1) {
						return false;
					}
					if (get.info(event.card).multitarget) {
						return false;
					}
					if (get.info(event.card).singleCard) {
						return false;
					}
					if (!get.info(event.card).enable) {
						return false;
					}
					return true;
				},
				content() {
					player.storage.hshuanling.add(trigger.card);
					player.markSkill("hshuanling");
				},
			},
		},
	},
	hsxingyi: {
		trigger: { global: "useSkillAfter" },
		forced: true,
		filter(event, player) {
			if (lib.filter.skillDisabled(event.skill)) {
				return false;
			}
			if (!game.expandSkills(event.player.getStockSkills()).includes(event.skill)) {
				return false;
			}
			return _status.currentPhase === event.player && event.player.isEnemiesOf(player);
		},
		content() {
			player.addTempSkill(trigger.skill, { player: "phaseAfter" });
		},
	},
	asyouzhang: {
		trigger: { player: "phaseEnd" },
		frequent: true,
		filter(event, player) {
			if (player.countCards("h", { type: "basic" }) === 0) {
				return true;
			}
			if (player.countCards("h", { type: ["trick", "delay"] }) === 0) {
				return true;
			}
			if (player.countCards("h", { type: "equip" }) === 0) {
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			if (player.countCards("h", { type: "basic" }) === 0) {
				var card = get.cardPile(function (card) {
					return get.type(card) === "basic";
				});
				if (card) {
					player.gain(card, "draw");
				}
				event.basiccard = card;
			}
			"step 1";
			if (event.basiccard) {
				if (player.hasUseTarget(event.basiccard)) {
					var next = player.chooseToUse();
					next.filterCard = function (card) {
						return card === event.basiccard;
					};
					next.prompt = "是否使用" + get.translation(event.basiccard) + "？";
				}
			}
			"step 2";
			if (player.countCards("h", { type: ["trick", "delay"] }) === 0) {
				var card = get.cardPile(function (card) {
					return get.type(card) === "trick" || get.type(card) === "delay";
				});
				if (card) {
					player.gain(card, "draw");
				}
				event.trickcard = card;
			}
			"step 3";
			if (event.trickcard) {
				if (player.hasUseTarget(event.trickcard)) {
					var next = player.chooseToUse();
					next.filterCard = function (card) {
						return card === event.trickcard;
					};
					next.prompt = "是否使用" + get.translation(event.trickcard) + "？";
				}
			}
			"step 4";
			if (player.countCards("h", { type: "equip" }) === 0) {
				var card = get.cardPile(function (card) {
					return get.type(card) === "equip";
				});
				if (card) {
					player.gain(card, "draw");
				}
				event.equipcard = card;
			}
			"step 5";
			if (event.equipcard) {
				if (player.hasUseTarget(event.equipcard)) {
					var next = player.chooseToUse();
					next.filterCard = function (card) {
						return card === event.equipcard;
					};
					next.prompt = "是否使用" + get.translation(event.equipcard) + "？";
				}
			}
		},
		ai: {
			threaten: 1.7,
		},
	},
	ylyuchu: {
		trigger: { player: "recoverAfter" },
		forced: true,
		filter(event, player) {
			if (player.hasSkill("subplayer")) {
				return false;
			}
			return player.storage.ylyuchu.length < 3;
		},
		init(player) {
			if (!player.storage.ylyuchu) {
				player.storage.ylyuchu = [];
			}
		},
		ai: {
			threaten: 0.7,
		},
		group: ["ylyuchu_swap", "ylyuchu_phase"],
		subSkill: {
			chosen: {},
			swap: {
				trigger: { player: "phaseEnd" },
				silent: true,
				filter(event, player) {
					return player.storage.ylyuchu.length;
				},
				content() {
					var list = game.filterPlayer();
					list.remove(player);
					player.storage.ylyuchu2 = list.randomGets(player.storage.ylyuchu.length);
					player.storage.ylyuchu3 = player.storage.ylyuchu.slice(0).randomSort();
				},
			},
			phase: {
				trigger: { global: "phaseBefore" },
				forced: true,
				popup: false,
				filter(event, player) {
					if (player.hasSkill("subplayer")) {
						return false;
					}
					if (player.storage.ylyuchu2 && player.storage.ylyuchu3) {
						var idx = player.storage.ylyuchu2.indexOf(event.player);
						var target = player.storage.ylyuchu3[idx];
						if (target && player.storage.ylyuchu.includes(target)) {
							return true;
						}
					}
					return false;
				},
				content() {
					if (player.storage.ylyuchu2 && player.storage.ylyuchu3) {
						var idx = player.storage.ylyuchu2.indexOf(trigger.player);
						var target = player.storage.ylyuchu3[idx];
						if (target && player.storage.ylyuchu.includes(target)) {
							player.callSubPlayer(target);
							player.storage.ylyuchu2[idx] = null;
						}
					}
				},
			},
			exit: {
				trigger: { player: ["phaseAfter"] },
				forced: true,
				popup: false,
				priority: -60,
				content() {
					player.exitSubPlayer();
				},
			},
			draw: {
				trigger: { player: "phaseDrawBegin" },
				silent: true,
				filter(event) {
					return event.num > 0;
				},
				content() {
					trigger.num--;
				},
			},
			enter: {
				trigger: { global: "phaseAfter" },
				forced: true,
				popup: false,
				priority: -60,
				filter(event, player) {
					return event.player !== player;
				},
				content() {
					player.insertPhase();
				},
			},
		},
		content() {
			"step 0";
			event.num = trigger.num;
			"step 1";
			if (event.num && player.storage.ylyuchu.length < 3) {
				var skill = player.addSubPlayer({
					name: "hs_yelinchulong",
					skills: ["ylyuchu_draw", "ylyuchu_exit", "ylyuchu_enter"],
					hp: 2,
					maxHp: 2,
					hs: get.cards(2),
					skill: skill,
					intro2: "当前回合结束后进行一个额外回合并切换回本体",
					onremove(player) {
						player.storage.ylyuchu.remove(skill);
						delete lib.skill[skill];
					},
				});
				player.storage.ylyuchu.push(skill);
				event.num--;
				event.redo();
			}
		},
	},
	nsaiqi: {
		trigger: { player: "useCard" },
		forced: true,
		init(player) {
			player.storage.nsaiqi = [];
		},
		intro: {
			content: "cards",
		},
		filter(event, player) {
			if (ui.cardPile.firstChild && ui.cardPile.firstChild.vanishtag.includes("nsaiqi")) {
				return false;
			}
			return true;
		},
		onremove: "lose",
		content() {
			var cards = get.cards(3);
			for (var i = 0; i < cards.length; i++) {
				cards[i].vanishtag.add("nsaiqi");
			}
			player.storage.nsaiqi.addArray(cards);
			player.syncStorage("nsaiqi");
			player.markSkill("nsaiqi");
		},
		mod: {
			maxHandcard(player, num) {
				return num + 1;
			},
		},
	},
	nsbeiming: {
		trigger: { player: "nsaiqiAfter" },
		forced: true,
		filter(event, player) {
			return player.storage.nsaiqi.length >= 9;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			player.chooseCardButton(player.storage.nsaiqi, true, "将顺序将牌置于牌堆顶（先选择的在上）", player.storage.nsaiqi.length);
			"step 2";
			var list = result.links.slice(0);
			while (list.length) {
				ui.cardPile.insertBefore(list.pop(), ui.cardPile.firstChild);
			}
			player.storage.nsaiqi.length = 0;
			player.unmarkSkill("nsaiqi");
		},
	},
	hsnitai: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		video(player, data) {
			var skills = data[0];
			var name = data[1];
			lib.skill.hsnitai.process(skills, name);
		},
		onremove(player) {
			player.removeSkill("hsnitai_card");
		},
		process(skills, name) {
			var cardname = "hsnitai_" + name;
			lib.translate[cardname] = lib.translate[name];
			lib.translate[cardname + "_info"] = "出牌阶段对自己使用，获得" + get.translation(name) + "的一个技能（替换前一个以此法获得的技能，效果持续2回合）";
			lib.translate[cardname + "_append"] = "";
			for (var i = 0; i < skills.length; i++) {
				lib.translate[cardname + "_append"] += '<div class="skill">【' + lib.translate[skills[i]] + "】</div><div>" + get.skillInfoTranslation(skills[i]) + "</div>";
				if (i < skills.length) {
					lib.translate[cardname + "_append"] += "<br>";
				}
			}
			lib.card[cardname] = lib.card[cardname] || {
				enable: true,
				type: "character",
				image: "character:" + name,
				fullimage: true,
				vanish: true,
				skills: skills,
				derivation: "hs_barnes",
				filterTarget(card, player, target) {
					return player === target;
				},
				selectTarget: -1,
				content() {
					"step 0";
					var list = lib.card[card.name].skills;
					for (var i = 0; i < list.length; i++) {
						if (target.hasSkill(list[i])) {
							list.splice(i--, 1);
						}
					}
					if (!list.length) {
						event.finish();
						return;
					}
					event.skillai = function () {
						return get.max(list, get.skillRank, "item");
					};
					if (list.length === 1) {
						event._result = list[0];
					} else if (event.isMine()) {
						var dialog = ui.create.dialog("forcebutton");
						dialog.add("选择获得一项技能");
						var clickItem = function () {
							_status.event._result = this.link;
							dialog.close();
							game.resume();
						};
						for (var i = 0; i < list.length; i++) {
							if (lib.translate[list[i] + "_info"]) {
								var translation = get.translation(list[i]);
								if (translation[0] === "新" && translation.length === 3) {
									translation = translation.slice(1, 3);
								} else {
									translation = translation.slice(0, 2);
								}
								var item = dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + translation + "】</div><div>" + lib.translate[list[i] + "_info"] + "</div></div>");
								item.firstChild.addEventListener("click", clickItem);
								item.firstChild.link = list[i];
							}
						}
						dialog.add(ui.create.div(".placeholder"));
						event.switchToAuto = function () {
							event._result = event.skillai();
							dialog.close();
							game.resume();
						};
						_status.imchoosing = true;
						game.pause();
					} else {
						event._result = event.skillai();
					}
					"step 1";
					var skill = result;
					if (!target.hasSkill(skill)) {
						player.popup(skill);
						target.$gain2(card);
						target.removeSkill("hsnitai_card");
						target.storage.hsnitai_card = card;
						target.storage.hsnitai_card_count = 1;
						target.storage.hsnitai_card_skill = skill;
						player.syncStorage("hsnitai_card");
						player.syncStorage("hsnitai_card_skill");
						target.addAdditionalSkill("hsnitai_card", skill);
						target.addSkill("hsnitai_card");
						game.log(target, "获得技能", "【" + get.translation(skill) + "】");
					}
				},
				ai: {
					order() {
						if (_status.event.player.hasSkill("hsnitai_card")) {
							return 1;
						}
						return 9;
					},
					result: {
						target(player, target) {
							if (!player.hasSkill("hsnitai_card") || player.needsToDiscard()) {
								return 1;
							}
							return 0;
						},
					},
				},
			};
		},
		content() {
			var current = game.expandSkills(player.getSkills());
			var list = get.gainableSkills(function (info, skill, name) {
				if (current.includes(skill)) {
					return false;
				}
				return lib.characterPack.hearth && lib.characterPack.hearth[name];
			});
			if (!list.length) {
				return;
			}
			var skill = list.randomGet();
			var source = [];
			for (var i in lib.characterPack.hearth) {
				if (lib.characterPack.hearth[i][3].includes(skill)) {
					source.push(i);
				}
			}
			if (!source.length) {
				return;
			}
			var name = source.randomGet();
			var skills = [skill];
			var nameskills = lib.characterPack.hearth[name][3];
			for (var i = 0; i < nameskills.length; i++) {
				if (list.includes(nameskills[i])) {
					skills.add(nameskills[i]);
				}
			}
			game.addVideo("skill", player, ["hsnitai", [skills, name]]);
			lib.skill.hsnitai.process(skills, name);
			player.gain(game.createCard("hsnitai_" + name), "gain2");
		},
		subSkill: {
			card: {
				mark: "card",
				onremove: ["hsnitai_card", "hsnitai_card_count", "hsnitai_card_skill"],
				intro: {
					content(storage, player) {
						var skill = player.storage.hsnitai_card_skill;
						return '<div class="skill">【' + lib.translate[skill] + "】</div><div>" + get.skillInfoTranslation(skill) + "</div>";
					},
				},
				trigger: { player: "phaseUseBegin" },
				priority: -10,
				silent: true,
				content() {
					if (player.storage.hsnitai_card_count > 0) {
						player.storage.hsnitai_card_count--;
					} else {
						player.removeSkill("hsnitai_card");
					}
				},
			},
		},
	},
	hspuzhao: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { suit: "heart" },
		position: "he",
		filter(event, player) {
			return player.countCards("he", { suit: "heart" }) > 0;
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			var targets = player.getFriends();
			if (targets.length) {
				targets.push(player);
				if (targets.length > 3) {
					targets = targets.randomGets(3);
				}
				targets.sortBySeat();
				player.line(targets, "green");
				for (var i = 0; i < targets.length; i++) {
					targets[i].addExpose(0.2);
				}
				game.asyncDraw(targets);
			} else {
				player.draw(2);
			}
		},
		ai: {
			order: 10,
			expose: 0.3,
			result: {
				player: 1,
			},
		},
	},
	hsyanxin: {
		trigger: { player: "drawBegin" },
		priority: -5,
		filter(event, player) {
			if (game.fixedPile) {
				return false;
			}
			if (event.num <= 0) {
				return false;
			}
			if (ui.cardPile.childNodes.length === 0) {
				return false;
			}
			if (get.color(ui.cardPile.firstChild) === "red") {
				return false;
			}
			return true;
		},
		forced: true,
		popup: false,
		content() {
			var card = ui.cardPile.firstChild;
			if (lib.inpile.includes(card.name)) {
				for (var i = 1; i < ui.cardPile.childElementCount; i++) {
					var card2 = ui.cardPile.childNodes[i];
					if (get.color(card2) === "red") {
						ui.cardPile.insertBefore(card2, card);
						break;
					}
				}
			} else {
				card.init([["heart", "diamond"].randomGet(), card.number, card.name, card.nature]);
			}
		},
	},
	hstianqi: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		position: "he",
		init(player) {
			player.storage.hstianqi = [];
		},
		onremove: true,
		filterCard(card, player) {
			if (get.position(card) === "h") {
				if (player.getEquip(1) && player.getEquip(2) && player.getEquip(3) && player.getEquip(4)) {
					return false;
				}
				return true;
			} else {
				return true;
			}
		},
		check(card) {
			var player = _status.event.player;
			if (get.position(card) === "e") {
				if (card.name.indexOf("hstianqi_") === 0) {
					for (var i = 0; i < player.storage.hstianqi.length; i++) {
						if (player.storage.hstianqi[i].name === card.name) {
							return 0;
						}
					}
					return 20 - get.value(card);
				} else {
					return (9 - get.value(card)) / 5;
				}
			} else {
				if (get.type(card) === "equip") {
					return 9 - get.value(card);
				}
				return 7 - get.value(card);
			}
		},
		discard: false,
		lose: false,
		delay: 0,
		intro: {
			content: "cards",
		},
		content() {
			"step 0";
			event.position = get.position(cards[0]);
			player.discard(cards);
			if (event.position === "e") {
				var name = cards[0].name;
				if (name.indexOf("hstianqi_") !== 0) {
					return;
				}
				for (var i = 0; i < player.storage.hstianqi.length; i++) {
					if (player.storage.hstianqi[i].name === name) {
						return;
					}
				}
				player.storage.hstianqi.add(cards[0]);
				player.markSkill("hstianqi");
			}
			"step 1";
			if (event.position === "h") {
				var list = [];
				if (!player.getEquip(1)) {
					list.push({ name: "hstianqi_dalian", suit: "spade", number: 1 });
				}
				if (!player.getEquip(2)) {
					list.push({ name: "hstianqi_shali", suit: "heart", number: 1 });
				}
				if (!player.getEquip(3)) {
					list.push({ name: "hstianqi_suolasi", suit: "diamond", number: 1 });
				}
				if (!player.getEquip(4)) {
					list.push({ name: "hstianqi_nazigelin", suit: "club", number: 1 });
				}
				if (list.length) {
					player.equip(game.createCard(list.randomGet()), true);
				}
			} else {
				player.draw(2);
				event.finish();
			}
			"step 2";
			if (!event.isMine()) {
				game.delay(0.5);
			}
		},
		group: ["hstianqi_win"],
		subSkill: {
			win: {
				trigger: { player: "phaseBegin" },
				priority: 30,
				forced: true,
				skillAnimation: true,
				animationColor: "legend",
				filter(event, player) {
					return player.storage.hstianqi.length === 4;
				},
				content() {
					"step 0";
					game.delay();
					"step 1";
					if (game.showIdentity) {
						game.showIdentity();
					}
					if (player.isUnderControl(true) || player.getFriends().includes(game.me)) {
						game.over(true);
					} else {
						game.over(false);
					}
				},
			},
		},
		ai: {
			threaten(player, target) {
				if (target.storage.hstianqi.length === 4) {
					return 20;
				}
				if (target.storage.hstianqi.length === 3) {
					return 2;
				}
				return 1;
			},
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	hstianqi_dalian: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			return player.isDamaged();
		},
		content() {
			player.recover(trigger.num);
		},
	},
	hstianqi_shali: {
		trigger: { player: "recoverEnd" },
		forced: true,
		filter(event, player) {
			return event.num > 0;
		},
		content() {
			player.changeHujia(trigger.num);
		},
	},
	ysjqisha: {
		trigger: { source: "damageEnd", player: "damageEnd" },
		forced: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return (event.source !== player && event.source.isIn()) || (event.player !== player && event.player.isIn());
		},
		content() {
			var target = trigger.source;
			if (target === player) {
				target = trigger.player;
			}
			var list = ["ju", "kuang", "nu", "yi", "wang", "hen", "ao"];
			for (var i = 0; i < list.length; i++) {
				list[i] = "ysjqisha_" + list[i];
				if (target.hasSkillTag(list[i])) {
					list.splice(i--, 1);
				}
			}
			if (list.length) {
				target.addTempSkill(list.randomGet(), { player: "phaseAfter" });
			}
		},
		ai: {
			threaten: 0.8,
			maixie_defend: true,
		},
		subSkill: {
			ju: {
				mark: true,
				intro: {
					content: "锁定技，每当你使用一张牌，需弃置一张牌",
				},
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					return player.countCards("he") > 0;
				},
				content() {
					game.delay(0.5);
					player.chooseToDiscard(true, "he");
				},
			},
			kuang: {
				mark: true,
				intro: {
					content: "锁定技，每当你使用一张牌指定惟一目标，有50%的机率指定错误的目标",
				},
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					return (
						event.getRand() < 0.5 &&
						event.targets &&
						event.targets.length === 1 &&
						game.hasPlayer(function (current) {
							return current !== event.targets[0] && lib.filter.targetEnabled2(event.card, player, current);
						})
					);
				},
				content() {
					"step 0";
					game.delay();
					"step 1";
					var list = game.filterPlayer(function (current) {
						return current !== trigger.targets[0] && lib.filter.targetEnabled2(trigger.card, player, current);
					});
					if (list.length) {
						var target = list.randomGet();
						trigger.targets[0] = target;
						player.line(target, "green");
					}
				},
			},
			nu: {
				mark: true,
				intro: {
					content: "锁定技，你使用的卡牌造成的伤害+1；每当你使用一张牌，有65%的机率失效",
				},
				forced: true,
				trigger: { source: "damageBegin", player: "useCardToBefore" },
				filter(event, player) {
					if (event.name === "damage") {
						return event.notLink() && (event.card ? true : false);
					}
					var info = get.info(event.card);
					if (info.multitarget && event.targets && event.targets.includes(player)) {
						return false;
					}
					return event.getRand() < 0.65;
				},
				content() {
					if (trigger.name === "damage") {
						trigger.num++;
					} else {
						trigger.cancel();
					}
				},
			},
			yi: {
				mark: true,
				intro: {
					content: "锁定技，你不能成为非敌方角色的卡牌目标",
				},
				mod: {
					targetEnabled(card, player, target) {
						if (!player.getEnemies().includes(target)) {
							return false;
						}
					},
				},
			},
			wang: {
				mark: true,
				intro: {
					content: "锁定技，你的摸牌数始终-1",
				},
				priority: 5,
				trigger: { player: "drawBegin" },
				forced: true,
				content() {
					trigger.num--;
				},
			},
			hen: {
				mark: true,
				intro: {
					content: "锁定技，每当一名敌方角色回复1点体力，你失去1点体力",
				},
				trigger: { global: "recoverAfter" },
				forced: true,
				filter(event, player) {
					return player.getEnemies().includes(event.player);
				},
				content() {
					player.loseHp();
				},
			},
			ao: {
				mark: true,
				intro: {
					content: "锁定技，你的手牌上限-2",
				},
				mod: {
					maxHandcard(player, num) {
						return num - 2;
					},
				},
			},
		},
	},
	yindan: {
		enable: "phaseUse",
		filterCard: { suit: "spade" },
		check(card) {
			return 8 - get.value(card);
		},
		usable: 1,
		filter(event, player) {
			return player.countCards("he", { suit: "spade" }) > 0;
		},
		position: "he",
		content() {
			"step 0";
			player.loseHp();
			"step 1";
			var cards = [];
			for (var i = 0; i < 2; i++) {
				cards.push(game.createCard("hsjixie_zhadan"));
			}
			player.gain(cards, "gain2");
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					if (player.hp >= 3) {
						return 1;
					}
					if (
						player.hp === 2 &&
						game.hasPlayer(function (current) {
							return get.damageEffect(current, player, player, "fire") > 0 && current.hp === 1;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	hllingxi: {
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(function (target) {
				return lib.skill.hllingxi.filterTarget(null, player, target);
			});
		},
		filterTarget(card, player, target) {
			if (target.hasSkill("hllingxi_used")) {
				return false;
			}
			return target !== player && target.isDamaged() && target.countCards("he") >= 2;
		},
		content() {
			"step 0";
			target.chooseToDiscard("he", 2, true);
			"step 1";
			target.recover();
			target.addTempSkill("hllingxi_used");
		},
		group: "hllingxi_end",
		subSkill: {
			used: {},
			end: {
				trigger: { player: "phaseEnd" },
				frequent: true,
				filter(event, player) {
					return player.isDamaged();
				},
				content() {
					player.recover();
				},
			},
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					var nc = target.countCards("he");
					if (target.hasSkillTag("maixie_hp")) {
						if (nc >= 3) {
							return 1;
						}
						if (target.hp === 1) {
							return 1;
						}
						return 0;
					}
					if (nc >= 4) {
						if (target.hp <= 2) {
							return 1;
						}
						return 0;
					} else if (nc === 3) {
						if (target.hp === 1) {
							return 1;
						}
						if (target.hp >= 4) {
							return -1;
						}
						return 0;
					} else {
						if (target.hp === 1) {
							return 0;
						}
						return -1;
					}
				},
			},
		},
	},
	zhaochao: {
		trigger: { player: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player.getEnemies().length > 0;
		},
		content() {
			"step 0";
			event.targets = player.getEnemies();
			player.addSkill("zhaochao2");
			player.useCard({ name: "sha" }, event.targets.randomRemove());
			"step 1";
			player.removeSkill("zhaochao2");
			if (player.storage.zhaochao2 && event.targets.length) {
				player.useCard({ name: "sha" }, event.targets.randomRemove());
				delete player.storage.zhaochao2;
			}
		},
		ai: {
			threaten: 1.7,
		},
	},
	zhaochao2: {
		trigger: { player: "shaMiss" },
		silent: true,
		filter(event) {
			return event.getParent(2).name === "zhaochao";
		},
		content() {
			player.storage.zhaochao2 = true;
		},
	},
	xiyong: {
		trigger: { player: "phaseEnd" },
		frequent: true,
		content() {
			"step 0";
			player.draw();
			"step 1";
			if (Array.isArray(result) && result.length) {
				var gained = result[0];
				if (lib.filter.cardEnabled(gained, target)) {
					var next = player.chooseToUse();
					next.filterCard = function (card) {
						return card === gained;
					};
					next.prompt = "是否使用" + get.translation(gained) + "？";
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.draw();
			}
		},
		ai: {
			threaten: 1.6,
		},
	},
	srjici: {
		trigger: { source: "damageEnd" },
		forced: true,
		content() {
			player.draw();
			if (trigger.player && trigger.player.isIn() && !trigger._notrigger.includes(trigger.player)) {
				trigger.player.randomDiscard();
			}
		},
		ai: {
			threaten: 1.4,
		},
	},
	yinzong: {
		trigger: { player: "loseEnd" },
		forced: true,
		filter(event, player) {
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "e") {
					return true;
				}
			}
			return false;
		},
		content() {
			player.gain(game.createCard("shan"), "gain2");
		},
	},
	tansuo: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		check(card) {
			return 8 - get.value(card);
		},
		content() {
			if (!lib.characterPack.hearth) {
				player.draw();
				return;
			}
			var list = [];
			for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
				var name = lib.cardPack.mode_derivation[i];
				var info = lib.card[name];
				if (info.gainable === false || info.destroy) {
					continue;
				}
				if (lib.characterPack.hearth[info.derivation]) {
					list.push(name);
				}
			}
			if (!list.length) {
				player.draw();
			} else {
				player.discoverCard(list);
			}
		},
		ai: {
			threaten: 1.6,
			order: 8,
			result: {
				player: 1,
			},
		},
	},
	lieqi: {
		trigger: { player: ["phaseBegin", "phaseEnd"] },
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return !current.isUnderControl(true, player) && current !== player.storage.lieqi && current.countCards("h");
			});
		},
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("lieqi"), function (card, player, target) {
				return !target.isUnderControl(true, player) && target !== player.storage.lieqi && target.countCards("h");
			}).ai = function () {
				return 1;
			};
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("lieqi", target);
				if (event.triggername === "phaseBegin") {
					player.storage.lieqi = target;
				}
				var hs = target.getCards("h").randomSort();
				if (hs.length) {
					var list2 = [];
					for (var i = 0; i < hs.length; i++) {
						if (list2.includes(hs[i].name)) {
							hs.splice(i--, 1);
						} else {
							list2.push(hs[i].name);
						}
					}
					var card = hs.randomGet();
					var list = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						if (!list2.includes(lib.inpile[i]) && (get.type(lib.inpile[i]) !== "equip" || Math.random() < 0.5)) {
							list.push(lib.inpile[i]);
						}
					}
					event.card = card;
					player.chooseCardButton(true, "猜测哪张牌为" + get.translation(target) + "的手牌", [card, game.createCard(list.randomRemove()), game.createCard(list.randomRemove())].randomSort()).ai = function (button) {
						if (get.value(button.link) < 0) {
							return -10;
						}
						if (_status.event.getRand() < 0.7) {
							return button.link === card ? 1 : -1;
						} else {
							return button.link === card ? -1 : 1;
						}
					};
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			if (event.triggername === "phaseEnd") {
				delete player.storage.lieqi;
			}
			"step 2";
			if (result.bool && result.links) {
				if (result.links[0] === event.card) {
					player.gain(game.createCard(event.card), "draw");
				} else {
					player.viewCards("正确答案", [event.card]);
				}
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	azaowu: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (event.filterCard({ name: "sha" }, player, event) || event.filterCard({ name: "jiu" }, player, event) || event.filterCard({ name: "tao" }, player, event)) {
				return player.hasCard(function (card) {
					return get.type(card) === "basic";
				});
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				if (event.filterCard({ name: "sha" }, player, event)) {
					list.push(["基本", "", "sha"]);
					list.push(["基本", "", "sha", "fire"]);
					list.push(["基本", "", "sha", "thunder"]);
				}
				for (var i = 0; i < lib.inpile.length; i++) {
					if (lib.inpile[i] !== "sha" && lib.card[lib.inpile[i]].type === "basic" && event.filterCard({ name: lib.inpile[i] }, player, event)) {
						list.push(["基本", "", lib.inpile[i]]);
					}
				}
				return ui.create.dialog("造物", [list, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				var card = { name: button.link[2], nature: button.link[3] };
				if (
					game.hasPlayer(function (current) {
						return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})
				) {
					switch (button.link[2]) {
						case "tao":
							return 5;
						case "xuejibingbao":
							return 4;
						case "jiu":
							return 3.01;
						case "sha":
							if (button.link[3] === "fire") {
								return 2.95;
							} else if (button.link[3] === "thunder") {
								return 2.92;
							} else {
								return 2.9;
							}
						default:
							return 2 + _status.event.getRand() * 2;
					}
				}
				return 0;
			},
			backup(links, player) {
				return {
					filterCard(card) {
						return get.type(card) === "basic";
					},
					viewAs: { name: links[0][2], nature: links[0][3] },
					popname: true,
					ai1(card) {
						return 6 - get.value(card);
					},
				};
			},
			prompt(links, player) {
				return "将一张基本牌当作" + get.translation(links[0][3] || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order() {
				var player = _status.event.player;
				var event = _status.event;
				if (event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0) {
					return 3.1;
				}
				return 2.9;
			},
			result: {
				player: 1,
			},
		},
	},
	shouwang: {
		enable: "chooseToUse",
		filter(event, player) {
			return event.type === "dying" && event.dying && !event.dying.hasSkill("shouwang2");
		},
		filterTarget(card, player, target) {
			return target === _status.event.dying;
		},
		selectTarget: -1,
		content() {
			target.recover();
			target.changeHujia();
			target.addSkill("shouwang2");
		},
		ai: {
			order: 6,
			skillTagFilter(player) {
				if (!_status.event.dying || _status.event.dying.hasSkill("shouwang2")) {
					return false;
				}
			},
			save: true,
			result: {
				target: 3,
			},
			threaten: 1.6,
		},
	},
	shouwang2: {
		charlotte: true,
		mark: true,
		intro: {
			content: "已发动",
		},
	},
	qingtian: {
		trigger: { player: "damageBegin" },
		forced: true,
		filter(event, player) {
			return player.isMaxHp(true);
		},
		check() {
			return false;
		},
		content() {
			trigger.num++;
		},
		ai: {
			neg: true,
		},
	},
	qianfu: {
		trigger: { player: "dieBefore" },
		forced: true,
		filter(event, player) {
			return !player.hasSkill("qianfu2") && player.maxHp > 0;
		},
		unique: true,
		content() {
			trigger.cancel();
			player.addSkill("qianfu2");
			player.hp = 1;
			player.update();
			player.discard(player.getCards("he"));
			player.setAvatar("hs_selajin", "hs_selajin2");
		},
		ai: {
			threaten: 0.8,
		},
	},
	qianfu2: {
		mark: true,
		intro: {
			content: "你防止非火焰伤害，不能使用或打出卡牌，并始终跳过你的回合",
		},
		mod: {
			cardEnabled(card, player) {
				return false;
			},
			cardUsable(card, player) {
				return false;
			},
			cardRespondable(card, player) {
				return false;
			},
			cardSavable(card, player) {
				return false;
			},
		},
		group: ["qianfu2_damage", "qianfu2_phase", "qianfu2_revive"],
		subSkill: {
			damage: {
				trigger: { player: "damageBefore" },
				filter(event) {
					if (event.nature !== "fire") {
						return true;
					}
					return false;
				},
				mark: true,
				forced: true,
				content() {
					trigger.cancel();
				},
				ai: {
					nothunder: true,
					nodamage: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage") && !get.tag(card, "fireDamage")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			phase: {
				trigger: { player: "phaseBefore" },
				forced: true,
				popup: false,
				content() {
					trigger.cancel();
				},
			},
			revive: {
				trigger: { player: ["changeHp", "loseMaxHpAfter"] },
				forced: true,
				filter(event, player) {
					return player.hp >= 3 || player.isHealthy();
				},
				content() {
					player.removeSkill("qianfu2");
					player.draw(3);
					player.setAvatar("hs_selajin", "hs_selajin");
				},
			},
		},
	},
	shimo: {
		trigger: { global: "damageAfter" },
		forced: true,
		filter(event, player) {
			return event.player !== player && get.distance(player, event.player) <= 1;
		},
		content() {
			if (player.isDamaged()) {
				player.recover();
			} else {
				player.draw();
			}
		},
	},
	lieyang: {
		trigger: { player: "useCard" },
		forced: true,
		usable: 3,
		filter(event, player) {
			return _status.currentPhase === player && get.type(event.card, "trick") === "trick";
		},
		content() {
			var list = get.inpile("trick", "trick");
			player.gain(game.createCard(list.randomGet()), "draw");
			if (player.storage.counttrigger && player.storage.counttrigger.lieyang >= 3) {
				player.addTempSkill("lieyang2");
			}
		},
		ai: {
			threaten: 1.8,
		},
	},
	lieyang2: {
		mod: {
			cardEnabled(card) {
				if (get.type(card, "trick") === "trick") {
					return false;
				}
			},
		},
	},
	zhuilie: {
		trigger: { player: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.chooseToDiscard("he", get.prompt("zhuilie")).set("ai", function (card) {
				if (player.hp >= 4 || (player.hasSha("all") && player.hasShan("all"))) {
					return 6 - get.value(card);
				}
				if (player.hasSha("all") || player.hasShan("all")) {
					return 3 - get.value(card);
				}
				return 0;
			}).logSkill = "zhuilie";
			"step 1";
			if (result.bool) {
				var list = [];
				var list2 = [];
				for (var i = 0; i < 6 && i < ui.cardPile.childElementCount; i++) {
					list.push(ui.cardPile.childNodes[i]);
				}
				for (var i = 0; i < list.length; i++) {
					if (get.type(list[i]) === "basic") {
						list[i].discard();
						list2.push(list[i]);
					}
				}
				player.showCards(get.translation(player) + "将" + get.cnNumber(list2.length) + "张牌移入弃牌堆", list2);
				if (list2.length > 3) {
					player.draw();
				}
			}
		},
	},
	szbianshen: {
		trigger: { player: "phaseBefore" },
		unique: true,
		limited: true,
		skillAnimation: true,
		filter() {
			return game.roundNumber >= 3;
		},
		check(event, player) {
			return player.hp <= 2;
		},
		content() {
			"step 0";
			var list = get.gainableCharacters(function (info) {
				return info[2] >= 5;
			});
			var players = game.players.concat(game.dead);
			for (var i = 0; i < players.length; i++) {
				list.remove(players[i].name);
				list.remove(players[i].name1);
				list.remove(players[i].name2);
			}
			var dialog = ui.create.dialog("将武将牌替换为一名角色", "hidden");
			dialog.add([list.randomGets(5), "character"]);
			player.chooseButton(dialog, true).ai = function (button) {
				return get.rank(button.link, true);
			};
			player.awakenSkill(event.name);
			"step 1";
			player.reinit(get.character(player.name2, 3).includes("szbianshen") ? player.name2 : player.name1, result.links[0]);
			player.hp = player.maxHp;
			player.update();
		},
	},
	kekao: {
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			var list = [];
			for (var i in lib.card) {
				if (game.bannedcards && game.bannedcards.includes(i)) {
					continue;
				}
				if (lib.card[i].type === "delay") {
					list.push(["锦囊", "", i]);
				}
			}
			if (list.length === 0) {
				event.finish();
				return;
			}
			var dialog = ui.create.dialog(get.prompt("kekao"), [list.randomGets(3), "vcard"], "hidden");
			player.chooseButton(dialog).ai = function (button) {
				var name = button.link[2];
				var num = Math.random() * get.value({ name: name });
				if (lib.card[name].selectTarget === -1) {
					return num / 10;
				}
				return num;
			};
			"step 1";
			if (result.buttons) {
				player.logSkill("kekao");
				player.gain(game.createCard(result.buttons[0].link[2]), "draw");
			}
		},
		ai: {
			threaten: 1.6,
		},
	},
	jinhua: {
		trigger: { target: "useCardToBegin" },
		forced: true,
		filter(event, player) {
			return player === event.player && get.type(event.card, "trick") === "trick" && event.card.isCard;
		},
		content() {
			"step 0";
			var list = get.gainableSkills();
			list.remove(player.getSkills());
			list = list.randomGets(3);
			event.skillai = function () {
				return get.max(list, get.skillRank, "item");
			};
			if (event.isMine()) {
				var dialog = ui.create.dialog("forcebutton");
				dialog.add("选择获得一项技能");
				var clickItem = function () {
					_status.event._result = this.link;
					dialog.close();
					game.resume();
				};
				for (var i = 0; i < list.length; i++) {
					if (lib.translate[list[i] + "_info"]) {
						var translation = get.translation(list[i]);
						if (translation[0] === "新" && translation.length === 3) {
							translation = translation.slice(1, 3);
						} else {
							translation = translation.slice(0, 2);
						}
						var item = dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + translation + "】</div><div>" + lib.translate[list[i] + "_info"] + "</div></div>");
						item.firstChild.addEventListener("click", clickItem);
						item.firstChild.link = list[i];
					}
				}
				dialog.add(ui.create.div(".placeholder"));
				event.switchToAuto = function () {
					event._result = event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing = true;
				game.pause();
			} else {
				event._result = event.skillai();
			}
			"step 1";
			_status.imchoosing = false;
			var link = result;
			player.addSkill(link, true);
			player.popup(link);
			game.log(player, "获得了技能", "【" + get.translation(link) + "】");
			game.delay();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.type(card, "trick") === "trick" && player === target) {
						return [1, 1];
					}
				},
			},
		},
	},
	kqizhou: {
		trigger: { player: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.storage.kqizhou;
		},
		content() {
			"step 0";
			delete player.storage.kqizhou;
			var list = [
				["", "", "hsqizhou_feng"],
				["", "", "hsqizhou_shui"],
				["", "", "hsqizhou_huo"],
				["", "", "hsqizhou_tu"],
			];
			var dialog = ui.create.dialog(get.prompt("kqizhou"), [list, "vcard"], "hidden");
			var shui = player.hp <= 1 && player.maxHp >= 3;
			var tu = game.hasPlayer(function (current) {
				return current.hp === 1 && get.attitude(player, current) > 0;
			});
			player.chooseButton(dialog).ai = function (button) {
				if (!player.hasFriend() && button.link[2] === "hsqizhou_tu") {
					return 0;
				}
				if (player.isHealthy() && button.link[2] === "hsqizhou_shui") {
					return 0;
				}
				if (shui && button.link[2] === "hsqizhou_shui") {
					return 3;
				}
				if (tu && button.link[2] === "hsqizhou_tu") {
					return 2;
				}
				return Math.random();
			};
			"step 1";
			if (result.buttons) {
				player.logSkill("kqizhou");
				player.gain(game.createCard(result.buttons[0].link[2]), "draw");
			}
		},
		group: "kqizhou_add",
		subSkill: {
			add: {
				trigger: { player: "useCard" },
				silent: true,
				filter(event, player) {
					return _status.currentPhase === player && get.type(event.card, "trick") === "trick";
				},
				content() {
					player.storage.kqizhou = true;
				},
			},
		},
	},
	jingcu: {
		enable: "phaseUse",
		filter(event, player) {
			return player.maxHp > 1;
		},
		content() {
			"step 0";
			player.loseMaxHp(true);
			"step 1";
			player.draw(2);
		},
		ai: {
			order: 1.5,
			threaten: 1.4,
			result: {
				player(player) {
					if (player.isDamaged()) {
						return 1;
					}
					if (player.hp >= 3 && !player.needsToDiscard(2)) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	shengzhang: {
		trigger: { player: "phaseDiscardEnd" },
		forced: true,
		filter(event, player) {
			return event.cards && event.cards.length > 0;
		},
		content() {
			player.gainMaxHp(true);
		},
	},
	pyuhuo: {
		unique: true,
		skillAnimation: true,
		animationColor: "fire",
		trigger: { player: "dying" },
		priority: 10,
		filter(event, player) {
			return player.storage.pyuhuo !== "over";
		},
		forced: true,
		content() {
			"step 0";
			player.discard(player.getCards("hej"));
			"step 1";
			player.link(false);
			"step 2";
			player.turnOver(false);
			"step 3";
			if (player.storage.pyuhuo === "mid") {
				player.storage.pyuhuo = "over";
				player.awakenSkill(event.name);
				player.hp = 6;
				player.maxHp = 6;
				player.draw(6);
				player.setAvatar("hs_pyros", "hs_pyros2");
			} else {
				player.storage.pyuhuo = "mid";
				player.hp = 4;
				player.maxHp = 4;
				player.draw(4);
				player.setAvatar("hs_pyros", "hs_pyros1");
			}
		},
		ai: {
			threaten(player, target) {
				if (target.storage.pyuhuo === "mid") {
					return 0.6;
				}
				if (target.storage.pyuhuo === "over") {
					return 1;
				}
				return 0.4;
			},
		},
	},
	mengye: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current !== player && current.countCards("h");
			});
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("mengye"), function (card, player, target) {
				return target.countCards("h") > 0;
			}).ai = function (target) {
				if (target.hasSkillTag("nodu")) {
					return get.attitude(player, target) * 1.5;
				}
				if (
					target.hasCard(function (card) {
						return card.name !== "du";
					})
				) {
					return -get.attitude(player, target);
				}
				return -get.attitude(player, target) / 5;
			};
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("mengye", target);
				var card = target
					.getCards("h", function (card) {
						return card.name !== "du";
					})
					.randomGet();
				if (card) {
					card.init([card.suit, card.number, "du"]);
				}
				target.changeHujia();
				game.log(target, "将一张手牌转化为", { name: "du" });
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	mengye2: {
		temp: true,
		mark: "character",
		vanish: true,
		intro: {
			content: "由$控制本回合行动",
		},
		init(player) {
			player.ai.modAttitudeFrom = function (from, to) {
				return get.attitude(player.storage.mengye2, to);
			};
			player.ai.modAttitudeTo = function (from, to, att) {
				if (from !== to) {
					return 0;
				}
				return att;
			};
		},
		onremove(player) {
			delete player.ai.modAttitudeFrom;
			delete player.ai.modAttitudeTo;
			delete player.storage.mengye2;
			delete player.storage.mengye3;
			delete player.storage.mengye4;
		},
		trigger: { player: ["phaseAfter", "dieBegin"] },
		forced: true,
		popup: false,
		content() {
			player.storage.mengye2.in("mengye");
			if (player === game.me && player.storage.mengye3) {
				game.swapPlayerAuto(player.storage.mengye2);
			}
			if (typeof player.ai.shown === "number") {
				player.ai.shown = player.storage.mengye4;
			}
			player.removeSkill("mad");
			player.removeSkill("mengye2");
		},
	},
	mengye3: {},
	lianzhan: {
		trigger: { source: "damageEnd" },
		forced: true,
		content() {
			if (player.getStat().damage > trigger.num) {
				player.gainMaxHp();
				player.recover();
			} else {
				player.draw(2);
			}
		},
		ai: {
			damageBonus: true,
		},
	},
	lianzhan2: {},
	kuixin: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				if (current === player) {
					return false;
				}
				var nh = current.countCards("h");
				return nh && nh >= player.countCards("h");
			});
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("kuixin"), function (card, player, target) {
				if (target === player) {
					return false;
				}
				var nh = target.countCards("h");
				return nh && nh >= player.countCards("h");
			}).ai = function (target) {
				var att = get.attitude(player, target);
				if (target.hasSkillTag("noe")) {
					att /= 3;
				}
				return -att;
			};
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				var card = target.getCards("h").randomGet();
				if (card) {
					player.logSkill("kuixin", target);
					player.gain(card, target);
					target.$giveAuto(card, player);
				}
			}
		},
	},
	fuhua: {
		enable: "phaseUse",
		filterCard: { name: "du" },
		check() {
			return 1;
		},
		filterTarget(card, player, target) {
			return !target.hasSkill("moxie") && !target.hasSkill("fuhua2");
		},
		filter(event, player) {
			return player.countCards("h", "du") > 0;
		},
		discard: false,
		prepare: "give",
		content() {
			"step 0";
			target.gain(cards, player);
			var choice = 1;
			if (get.attitude(target, player) > 0 || (target.hp <= 1 && !target.hasSha("respond"))) {
				choice = 0;
			}
			target
				.chooseControl(function () {
					return choice;
				})
				.set("choiceList", ["获得技能魔血，每个出牌阶段开始时需交给" + get.translation(player) + "一张牌", "视为" + get.translation(player) + "对你使用一张决斗，若你赢，本局不能再成为腐化目标"]);
			"step 1";
			if (result.index === 0) {
				target.storage.fuhua2 = player;
				target.addSkill("fuhua2");
				target.addSkill("moxie");
			} else {
				player.useCard({ name: "juedou" }, target);
			}
		},
		ai: {
			threaten: 1.5,
			order: 8,
			expos: 0.2,
			result: {
				player(player, target) {
					if (player.countCards("h") <= 2) {
						return 0;
					}
					if (get.attitude(target, player) > 0) {
						return 1;
					}
					if (get.effect(target, { name: "juedou" }, player, player) > 0) {
						return 1.5;
					}
					return 0;
				},
			},
		},
	},
	fuhua2: {
		trigger: { player: "phaseEnd" },
		forced: true,
		priority: 1,
		filter(event, player) {
			return player.storage.fuhua2.isIn() && player.countCards("h") > 0;
		},
		mark: "character",
		intro: {
			content(storage) {
				return "每个结束阶段需交给" + get.translation(storage) + "一张手牌";
			},
		},
		content() {
			"step 0";
			player.chooseCard("h", true, "交给" + get.translation(player.storage.fuhua2) + "一张手牌");
			"step 1";
			if (result.bool) {
				player.storage.fuhua2.gain(result.cards, player);
				player.$give(result.cards, player.storage.fuhua2);
				player.line(player.storage.fuhua2, "green");
			}
		},
		group: "fuhua2_remove",
		onremove: true,
		subSkill: {
			remove: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.player === player.storage.fuhua2;
				},
				content() {
					player.removeSkill("fuhua2");
				},
			},
		},
	},
	fuhua3: {
		trigger: { player: "damageBefore" },
		forced: true,
		popup: false,
		filter(event, player) {
			var evt = event.getParent(3);
			return evt.name === "fuhua" && evt.target === event.source;
		},
		content() {
			trigger.getParent(3).target.storage.fuhua_failed = true;
		},
	},
	moxie: {
		trigger: { player: "loseHpBegin" },
		forced: true,
		filter: event => event.type === "du",
		content() {
			trigger.cancel();
			player.draw(2);
		},
		ai: {
			threaten: 1.2,
			nodu: true,
			usedu: true,
		},
		group: "moxie_use",
		subSkill: {
			use: {
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				content() {
					var hs = player.getCards("h");
					for (var i = 0; i < hs.length; i++) {
						if (hs[i].name === "du") {
							hs.splice(i--, 1);
						}
					}
					if (hs.length) {
						var card = hs.randomGet();
						card.init([card.suit, card.number, "du"]);
						game.log(player, "将一张手牌转化为", { name: "du" });
					}
				},
			},
		},
	},
	qianhou: {
		trigger: { player: "phaseBegin" },
		forced: true,
		content() {
			"step 0";
			var list = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				if (lib.filter.filterCard({ name: lib.inpile[i] }, player)) {
					var info = lib.card[lib.inpile[i]];
					if (info.type === "trick" && !info.multitarget && !info.notarget) {
						if (Array.isArray(info.selectTarget)) {
							if (info.selectTarget[0] > 0 && info.selectTarget[1] >= info.selectTarget[0]) {
								list.push(lib.inpile[i]);
							}
						} else if (typeof info.selectTarget === "number") {
							list.push(lib.inpile[i]);
						}
					}
				}
			}
			while (list.length) {
				var card = { name: list.randomRemove() };
				var info = get.info(card);
				var targets = game.filterPlayer(function (current) {
					return lib.filter.filterTarget(card, player, current);
				});
				if (targets.length) {
					targets.sort(lib.sort.seat);
					if (info.selectTarget !== -1) {
						var num = info.selectTarget;
						if (Array.isArray(num)) {
							if (targets.length < num[0]) {
								continue;
							}
							num = num[0] + Math.floor(Math.random() * (num[1] - num[0] + 1));
						} else {
							if (targets.length < num) {
								continue;
							}
						}
						targets = targets.randomGets(num);
					}
					player.useCard(card, targets, "noai");
					if (targets.length === 1 && targets[0] !== player) {
						event.cardname = card.name;
					}
					break;
				}
			}
			"step 1";
			if (player.countCards("h") && event.cardname) {
				player.chooseToDiscard("是否弃置一张手牌并获得" + get.translation(event.cardname) + "？", "h").ai = function (card) {
					return get.value({ name: event.cardname }) - get.value(card);
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				var fakecard = game.createCard(event.cardname, card.suit, card.number);
				player.gain(fakecard, "gain2", "log");
			}
		},
	},
	hlongyi: {
		mod: {
			ignoredHandcard(card, player) {
				if (get.color(card) === "black") {
					return true;
				}
			},
		},
	},
	zhongji: {
		trigger: { source: "damageBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h", { color: "black" }) > 0;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("zhongji", trigger.player), {
				color: "black",
			});
			next.logSkill = ["zhongji", trigger.player];
			next.ai = function (card) {
				if (get.attitude(player, trigger.player) < 0) {
					return 7 - get.value(card);
				}
				return -1;
			};
			"step 1";
			if (result.bool) {
				trigger.num++;
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	fuwen: {
		trigger: { player: "phaseDiscardEnd" },
		frequent: true,
		filter(event, player) {
			if (event.cards) {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.type(event.cards[i], "trick") === "trick") {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			player.changeHujia();
		},
	},
	jinzhou: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("h", { suit: "spade" }) > 0;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("jinzhou"), function (card, player, target) {
				return target !== player && !target.hasSkill("fengyin");
			}).ai = function (target) {
				var att = get.attitude(player, target);
				if (att >= 0) {
					return 0;
				}
				var skills = target.getSkills();
				for (var i = 0; i < skills.length; i++) {
					if (!get.is.locked(skills[i])) {
						if (target.hasSkillTag("maixie")) {
							return 2;
						}
						return get.threaten(target);
					}
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("jinzhou", result.targets);
				result.targets[0].addTempSkill("fengyin", { player: "phaseAfter" });
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.4,
		},
	},
	midian: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"] }) > 0;
		},
		filterCard: { type: ["trick", "delay"] },
		check(card) {
			return 10 - get.value(card);
		},
		content() {
			var list = get.inpile("trick", "trick");
			var list2 = [];
			for (var i = 0; i < 3; i++) {
				list2.push(game.createCard(list.randomGet()));
			}
			player.gain(list2, "draw");
		},
		ai: {
			order: 9.8,
			threaten: 1.8,
			result: {
				player: 1,
			},
		},
	},
	xingluo: {
		trigger: { player: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return !player.isMaxHandcard();
		},
		content() {
			"step 0";
			var nh = player.countCards("h");
			var num = game.countPlayer(function (current) {
				return current.countCards("h") > nh;
			});
			player.chooseTarget(get.prompt("xingluo"), [1, num], function (card, player, target) {
				return target.countCards("h") > nh;
			}).ai = function (target) {
				return 0.5 - get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				event.cards = [];
				event.list = result.targets.slice(0);
				event.list.sort(lib.sort.seat);
				player.logSkill("xingluo", result.targets);
			} else {
				event.finish();
			}
			"step 2";
			if (event.list.length) {
				event.list.shift().chooseToDiscard("h", true);
			} else {
				event.goto(4);
			}
			"step 3";
			if (result.bool && result.cards.length) {
				event.cards.push(result.cards[0]);
			}
			event.goto(2);
			"step 4";
			if (event.cards.length) {
				player.chooseCardButton("选择一张加入手牌", event.cards).ai = function (button) {
					return get.value(button.link);
				};
			} else {
				event.finish();
			}
			"step 5";
			if (result.bool) {
				player.gain(result.links, "gain2");
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	yuelu: {
		enable: "chooseToUse",
		filter(event, player) {
			return event.type === "dying" && player.countCards("he", { color: "black" }) > 0;
		},
		filterCard: { color: "black" },
		position: "he",
		check(card) {
			return 11 - get.value(card);
		},
		filterTarget(card, player, target) {
			return target === _status.event.dying;
		},
		selectTarget: -1,
		content() {
			target.recover();
			target.changeHujia();
		},
		ai: {
			order: 10,
			skillTagFilter(player) {
				if (player.countCards("he", { color: "black" }) === 0) {
					return false;
				}
			},
			save: true,
			result: {
				target: 3,
			},
			threaten: 2.5,
		},
	},
	yushou: {
		enable: "phaseUse",
		filterCard: true,
		position: "he",
		derivation: ["yushou_misha", "yushou_huofu", "yushou_leiouke"],
		check(card) {
			var player = _status.event.player;
			var num = 0;
			if (player.hasSkill("yushou_misha")) {
				num += 1.5;
			}
			if (player.hasSkill("yushou_huofu")) {
				num += 1.5;
			}
			if (player.hasSkill("yushou_leiouke")) {
				num += 1.5;
			}
			return 5 - num - get.value(card);
		},
		filter(event, player) {
			if (player.hasSkill("yushou_misha") && player.hasSkill("yushou_huofu") && player.hasSkill("yushou_leiouke")) {
				return false;
			}
			return true;
		},
		content() {
			if (!lib.character.stone_misha) {
				lib.character.stone_misha = {
					sex: "male",
					group: "shu",
					hp: 3,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					img: "image/mode/stone/character/stone_misha.jpg",
					extraModeData: [3, 3, "hunter"],
				};
			}
			if (!lib.character.stone_huofu) {
				lib.character.stone_huofu = {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["stone_chongfeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					img: "image/mode/stone/character/stone_huofu.jpg",
					extraModeData: [3, 4, "hunter"],
				};
			}
			if (!lib.character.stone_leiouke) {
				lib.character.stone_leiouke = {
					sex: "male",
					group: "shu",
					hp: 2,
					skills: ["hunter_zhanhuo"],
					isMinskin: true,
					isFellowInStoneMode: true,
					img: "image/mode/stone/character/stone_leiouke.jpg",
					extraModeData: [3, 1, "hunter"],
				};
			}
			var list = ["misha", "leiouke", "huofu"];
			for (var i = 0; i < list.length; i++) {
				if (player.hasSkill("yushou_" + list[i])) {
					list.splice(i--, 1);
				}
			}
			var skill = list.randomGet();
			var name = "yushou_" + skill;
			player.addSkill(name);
			player.markSkillCharacter(name, "stone_" + skill, lib.translate[name], lib.translate[name + "_info"]);
		},
		ai: {
			order: 9.5,
			result: {
				player: 1,
			},
		},
		group: "yushou_lose",
	},
	yushou_lose: {
		trigger: { player: "phaseBegin" },
		silent: true,
		content() {
			var list = ["yushou_misha", "yushou_huofu", "yushou_leiouke"];
			var skills = player.getSkills();
			for (var i = 0; i < list.length; i++) {
				if (!skills.includes(list[i])) {
					list.splice(i--, 1);
				}
			}
			if (list.length) {
				player.removeSkill(list.randomGet());
			}
		},
	},
	yushou_misha: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.num >= 1;
		},
		content() {
			player.changeHujia();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return;
						}
						return 0.6;
					}
				},
			},
		},
	},
	yushou_huofu: {
		enable: "phaseUse",
		viewAs: { name: "juedou" },
		filterCard: { color: "black" },
		position: "he",
		viewAsFilter(player) {
			if (!player.countCards("he", { color: "black" })) {
				return false;
			}
		},
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			basic: {
				order: 10,
			},
		},
	},
	yushou_leiouke: {
		trigger: { source: "damageBegin" },
		forced: true,
		usable: 1,
		content() {
			trigger.num++;
		},
	},
	qingzun: {
		subSkill: {
			count: {
				trigger: { player: "useCard" },
				silent: true,
				filter(event, player) {
					return event.card.name.indexOf("hsqingyu_") === 0;
				},
				content() {
					player.storage.qingzun++;
					player.updateMarks();
				},
			},
			draw1: {
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					return player.storage.qingzun >= 2;
				},
				frequent: true,
				content() {
					player.draw();
				},
			},
			draw2: {
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					return player.storage.qingzun >= 6;
				},
				frequent: true,
				content() {
					player.draw();
				},
			},
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.storage.qingzun;
			},
		},
		init(player) {
			player.storage.qingzun = 0;
		},
		mark: true,
		marktext: "玉",
		intro: {
			content(storage, player) {
				if (!storage) {
					return "未使用过青玉牌";
				}
				var str = "手牌上限+" + storage;
				var num1 = 2,
					num2 = 6;
				if (storage >= num2) {
					str += "；准备阶段和结束阶段，你可以摸一张牌";
				} else if (storage >= num1) {
					str += "；准备阶段，你可以摸一张牌";
				}
				return str;
			},
		},
		group: ["qingzun_count", "qingzun_draw1", "qingzun_draw2"],
	},
	ayuling: {
		trigger: { player: "damageEnd" },
		frequent: true,
		content() {
			var list = ["feibiao", "hufu", "zhao", "zhanfang", "shandian"];
			player.gain(game.createCard("hsqingyu_" + list.randomGet()), "draw");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [1, get.tag(card, "damage") * 2];
						}
						if (target.hp === 3) {
							return [1, get.tag(card, "damage") * 1.5];
						}
						if (target.hp === 2) {
							return [1, get.tag(card, "damage") * 0.5];
						}
					}
				},
			},
		},
	},
	aoshu: {
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard(card) {
			return get.suit(card) === "spade";
		},
		viewAs: { name: "wuzhong" },
		viewAsFilter(player) {
			if (!player.countCards("he", { suit: "spade" })) {
				return false;
			}
		},
		prompt: "将一张黑桃牌当作无中生有使用",
		check(card) {
			return 7 - get.value(card);
		},
		ai: {
			threaten: 1.4,
			order: 9,
		},
	},
	bzhuiji: {
		trigger: { global: "dieAfter" },
		check(event, player) {
			return get.attitude(player, event.source) <= 0;
		},
		filter(event, player) {
			return event.source && event.source.isAlive() && event.source !== player;
		},
		content() {
			player.draw(2);
			player.useCard({ name: "juedou" }, trigger.source);
		},
		ai: {
			threaten: 1.5,
			expose: 0.1,
		},
	},
	lianjin: {
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			return get.type(card) !== "hsyaoshui";
		},
		check(card) {
			return 8 - get.value(card);
		},
		position: "he",
		content() {
			"step 0";
			var names = [];
			var inpile = lib.inpile.slice(0);
			inpile.randomSort();
			var single = false;
			var equip = Math.random() < 0.5;
			var equips = [];
			for (var i = 0; i < inpile.length; i++) {
				if (lib.inpile[i] === "chuansongmen") {
					continue;
				}
				var info = lib.card[inpile[i]];
				if (!info.enable) {
					continue;
				}
				if (!info.filterTarget) {
					continue;
				}
				if (typeof info.selectTarget === "function") {
					continue;
				}
				if (inpile[i].indexOf("_") !== -1) {
					continue;
				}
				if (info.type === "equip") {
					equips.push(inpile[i]);
					continue;
				}
				if (equip && names.length >= 2) {
					continue;
				}
				if (names.length >= 3) {
					continue;
				}
				var select = get.select(info.selectTarget);
				if (select[0] === -1 && select[1] === -1) {
					names.push(inpile[i]);
					if (info.modTarget) {
						single = true;
					}
				} else if (select[0] === 1 && select[1] === 1) {
					names.push(inpile[i]);
					single = true;
				}
			}
			if (equip) {
				names.push(equips.randomGet());
			}
			names.sort(lib.sort.name);
			var name = "hsyaoshui_" + names[0] + "_" + names[1] + "_" + names[2];
			if (!lib.card[name]) {
				lib.card[name] = get.copy(lib.skill.lianjin.template);
				lib.card[name].names = names;
				lib.card[name].selectTarget = single ? 1 : -1;
				lib.translate[name] = "药水";
				lib.translate[name + "_info"] = get.translation(names[0]) + "、" + get.translation(names[1]) + "、" + get.translation(names[2]);
			}
			var fakecard = game.createCard(name, cards[0].suit, cards[0].number);
			player.gain(fakecard, "gain2");
		},
		template: {
			type: "hsyaoshui",
			enable: true,
			fullimage: true,
			image: "card/hsyaoshui",
			vanish: true,
			derivation: "hs_kazhakusi",
			multitarget: true,
			multiline: true,
			filterTarget(card, player, target) {
				var info = get.info(card);
				var names = info.names;
				for (var i = 0; i < names.length; i++) {
					var info2 = lib.card[names[i]];
					if (get.select(info2.selectTarget)[0] === -1 && !info2.modTarget) {
						continue;
					}
					if (!lib.filter.targetEnabled2({ name: names[i] }, player, target)) {
						return false;
					}
				}
				return true;
			},
			content() {
				"step 0";
				event.names = get.info(card).names.slice(0);
				"step 1";
				if (event.names.length) {
					var name = event.names.shift();
					var info = lib.card[name];
					var targets = [];
					if (get.select(info.selectTarget)[0] === -1 && !info.modTarget) {
						var targets = game.filterPlayer(function (current) {
							return player.canUse(name, current);
						});
						targets.sort(lib.sort.seat);
					} else {
						if (target.isDead()) {
							return;
						}
						targets.push(target);
					}
					player.useCard(game.createCard({ name: name, suit: get.suit(card), number: card.number }), targets, "noai");
					player.addExpose(0.2);
					event.redo();
				}
			},
			ai: {
				order: 9.1,
				threaten: 1.5,
				result: {
					target(player, target, card) {
						var info = get.info(card);
						if (!info) {
							return 0;
						}
						if (!Array.isArray(info.names)) {
							return 0;
						}
						var names = info.names;
						if (names.includes("xingjiegoutong") && target.countCards("h") >= 3) {
							return -1;
						}
						var num = 0;
						for (var i = 0; i < names.length; i++) {
							var info2 = lib.card[names[i]];
							if (get.select(info2.selectTarget)[0] === -1 && !info2.modTarget) {
								continue;
							}
							var eff = get.effect(target, { name: names[i] }, player, target);
							if (eff > 0) {
								num++;
							} else if (eff < 0) {
								num -= 0.9;
							}
						}
						return num;
					},
				},
			},
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
			threaten: 1.4,
		},
		group: "lianjin_discard",
		subSkill: {
			discard: {
				trigger: { player: "discardAfter" },
				forced: true,
				filter(event) {
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) === "hsyaoshui") {
							return true;
						}
					}
					return false;
				},
				content() {
					var list = [],
						cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.type(trigger.cards[i]) === "hsyaoshui") {
							list.push(trigger.cards[i]);
						}
					}
					for (var i = 0; i < list.length; i++) {
						var names = get.info(list[i]).names;
						if (names) {
							cards.push(game.createCard(names.randomGet()));
						}
					}
					player.gain(cards, "draw2", "log");
				},
			},
		},
	},
	shouji: {
		group: ["shouji_begin", "shouji_miss"],
		subSkill: {
			begin: {
				trigger: { player: "shaBegin" },
				frequent: true,
				usable: 1,
				filter(event) {
					return event.target.countCards("h") > 0;
				},
				content() {
					player.gain(game.createCard(trigger.target.getCards("h").randomGet()), "draw");
				},
			},
			miss: {
				trigger: { player: "shaMiss" },
				frequent: true,
				usable: 1,
				filter(event) {
					return event.target.hasCard(function (card) {
						return !get.info(card).unique;
					}, "e");
				},
				content() {
					player.gain(
						game.createCard(
							trigger.target
								.getCards("e", function (card) {
									return !get.info(card).unique;
								})
								.randomGet()
						),
						"draw"
					);
				},
			},
		},
	},
	yingxi: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return !player.getStat("damage") && player.countCards("he", { color: "black" }) > 0;
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt("yingxi"),
				filterCard: { color: "black" },
				filterTarget(card, player, target) {
					return lib.filter.targetEnabled({ name: "sha" }, player, target);
				},
				position: "he",
				ai1(card) {
					return 8 - get.value(card);
				},
				ai2(target) {
					return get.effect(target, { name: "sha" }, player, player);
				},
			});
			"step 1";
			if (result.bool) {
				player.useCard({ name: "sha" }, result.cards, result.targets, "yingxi");
			}
		},
		group: "yingxi2",
	},
	yingxi2: {
		trigger: { player: "shaBegin" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.skill === "yingxi" && event.target.isHealthy();
		},
		content() {
			trigger.directHit = true;
		},
	},
	hsguimou: {
		trigger: { player: "damageEnd" },
		check(event, player) {
			return get.attitude(player, event.source) <= 0;
		},
		filter(event, player) {
			return event.source && event.source.isAlive() && event.source !== player && event.source.countCards("h") > 0;
		},
		logTarget: "source",
		content() {
			var card = trigger.source.getCards("h").randomGet();
			if (card) {
				player.gain(card, trigger.source);
				if (get.color(card) === "black") {
					trigger.source.$give(card, player);
					event.redo();
				} else {
					trigger.source.$giveAuto(card, player);
				}
				game.delay(0.5);
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -2];
					}
					if (!target.hasFriend()) {
						return false;
					}
					if (get.tag(card, "damage") && player.countCards("h") > 1) {
						return [1, 0, 0, -1];
					}
				},
			},
		},
	},
	peiyu: {
		trigger: { player: ["phaseBegin"] },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("peiyu"), function (card, player, target) {
				for (var i = 1; i <= 8; i++) {
					if (target.hasSkill("tuteng" + i)) {
						return false;
					}
				}
				return true;
			}).ai = function (target) {
				if (player === target && get.attitude(player, target) > 0 && event.parent.triggername === "phaseBegin") {
					return get.attitude(player, target) + 10;
				}
				return get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("peiyu", result.targets);
				var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4", "tuteng5", "tuteng6", "tuteng7", "tuteng8"];
				result.targets[0].addAdditionalSkill("peiyu", ["peiyu2", rand.randomGet()]);
			}
		},
	},
	peiyu2: {
		trigger: { player: "damageAfter" },
		silent: true,
		content() {
			player.removeAdditionalSkill("peiyu");
		},
	},
	wzhanyi: {
		trigger: { player: "phaseUseBefore" },
		check(event, player) {
			return player.countCards("h") + 2 <= player.hp;
		},
		content() {
			"step 0";
			event.cards = get.cards(3);
			trigger.cancel();
			player.$draw(event.cards.slice(0));
			for (var i = 0; i < event.cards.length; i++) {
				if (get.type(event.cards[i]) === "equip") {
					player.equip(event.cards[i]);
					event.cards.splice(i--, 1);
				}
			}
			player.gain(event.cards);
			"step 1";
			if (player.countCards("h", "sha")) {
				player.chooseToUse("战意：使用一张杀").filterCard = function (card) {
					return card.name === "sha" && get.itemtype(card) === "card";
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.goto(1);
			}
		},
	},
	shengteng: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event) {
			return event.card && get.type(event.card) === "trick";
		},
		content() {
			player.gainMaxHp(true);
			player.recover();
		},
	},
	yuansu: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.maxHp - player.hp >= 3;
		},
		filterTarget(card, player, target) {
			return player.canUse("yuansuhuimie", target);
		},
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		line: "thunder",
		content() {
			player.maxHp = player.hp;
			player.update();
			targets.sort(lib.sort.seat);
			player.useCard({ name: "yuansuhuimie" }, targets).animate = false;
		},
	},
	chouhuo: {
		unique: true,
		trigger: { player: "phaseBegin" },
		forced: true,
		juexingji: true,
		derivation: "nuyan2",
		skillAnimation: true,
		animationColor: "fire",
		filter(event, player) {
			if (player.storage.nuyan && player.storage.nuyan.length) {
				var num = 0;
				for (var i = 0; i < lib.inpile.length; i++) {
					if (get.tag({ name: lib.inpile[i] }, "damage")) {
						num++;
					}
				}
				return num <= player.storage.nuyan.length;
			}
			return false;
		},
		content() {
			player.loseMaxHp();
			player.changeHujia(2);
			player.removeSkill("nuyan");
			player.addSkill("nuyan2");
			player.awakenSkill(event.name);
		},
	},
	nuyan2: {
		enable: "phaseUse",
		usable: 3,
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					if (get.tag({ name: lib.inpile[i] }, "damage")) {
						list.push([get.type(lib.inpile[i]), "", lib.inpile[i]]);
					}
				}
				return ui.create.dialog([list, "vcard"]);
			},
			filter(button, player) {
				return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				var recover = 0,
					lose = 1;
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hp < players[i].maxHp) {
						if (get.attitude(player, players[i]) > 0) {
							if (players[i].hp < 2) {
								lose--;
								recover += 0.5;
							}
							lose--;
							recover++;
						} else if (get.attitude(player, players[i]) < 0) {
							if (players[i].hp < 2) {
								lose++;
								recover -= 0.5;
							}
							lose++;
							recover--;
						}
					} else {
						if (get.attitude(player, players[i]) > 0) {
							lose--;
						} else if (get.attitude(player, players[i]) < 0) {
							lose++;
						}
					}
				}
				if (button.link[2] === "nanman" || button.link[2] === "nanman" || button.link[2] === "yuansuhuimie" || button.link[2] === "chiyuxi" || button.link[2] === "jingleishan") {
					if (lose > recover && lose > 0) {
						return 2;
					} else {
						return 0;
					}
				}
				return 1;
			},
			backup(links, player) {
				return {
					filterCard() {
						return false;
					},
					selectCard: -1,
					popname: true,
					viewAs: { name: links[0][2] },
					onuse(result, player) {
						player.loseHp();
					},
				};
			},
			prompt(links, player) {
				return "失去1点体力，视为使用一张" + get.translation(links[0][2]);
			},
		},
		ai: {
			order: 6,
			result: {
				player(player) {
					if (player.hp > 1) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	nuyan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 0;
		},
		init(player) {
			player.storage.nuyan = [];
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					if (get.tag({ name: lib.inpile[i] }, "damage")) {
						list.push([get.type(lib.inpile[i]), "", lib.inpile[i]]);
					}
				}
				return ui.create.dialog([list, "vcard"]);
			},
			filter(button, player) {
				if (player.storage.nuyan.includes(button.link[2])) {
					return false;
				}
				return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				var recover = 0,
					lose = 1;
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hp < players[i].maxHp) {
						if (get.attitude(player, players[i]) > 0) {
							if (players[i].hp < 2) {
								lose--;
								recover += 0.5;
							}
							lose--;
							recover++;
						} else if (get.attitude(player, players[i]) < 0) {
							if (players[i].hp < 2) {
								lose++;
								recover -= 0.5;
							}
							lose++;
							recover--;
						}
					} else {
						if (get.attitude(player, players[i]) > 0) {
							lose--;
						} else if (get.attitude(player, players[i]) < 0) {
							lose++;
						}
					}
				}
				if (button.link[2] === "nanman" || button.link[2] === "nanman" || button.link[2] === "yuansuhuimie" || button.link[2] === "chiyuxi" || button.link[2] === "jingleishan") {
					if (lose > recover && lose > 0) {
						return 2;
					} else {
						return 0;
					}
				}
				return 1;
			},
			backup(links, player) {
				return {
					filterCard: { color: "red" },
					selectCard: 1,
					position: "he",
					popname: true,
					viewAs: { name: links[0][2] },
					ai1(card) {
						return 6 - get.value(card);
					},
					onuse(result, player) {
						player.storage.nuyan.add(result.card.name);
					},
				};
			},
			prompt(links, player) {
				return "将一张红色牌当作" + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 6,
			result: {
				player: 1,
			},
		},
	},
	duxin: {
		trigger: { player: ["phaseBegin", "phaseEnd"] },
		frequent: true,
		filter(event, player) {
			return !player.countCards("h", { type: "hsdusu" });
		},
		derivation: ["hsdusu_xueji", "hsdusu_huangxuecao", "hsdusu_kuyecao", "hsdusu_shinancao", "hsdusu_huoyanhua"],
		content() {
			var list = ["hsdusu_xueji", "hsdusu_huangxuecao", "hsdusu_kuyecao", "hsdusu_shinancao", "hsdusu_huoyanhua"];
			if (typeof lib.cardType.hslingjian !== "number") {
				list.remove("hsdusu_kuyecao");
			}
			var name = list.randomGet();
			if (name === "hsdusu_huoyanhua") {
				player.gain(game.createCard({ name: name, nature: "fire" }), "draw");
			} else {
				player.gain(game.createCard(name), "draw");
			}
		},
		ai: {
			threaten: 1.6,
		},
	},
	oldduxin: {
		trigger: { player: ["phaseBegin", "phaseEnd"] },
		frequent: true,
		derivation: ["hsdusu_xueji", "hsdusu_huangxuecao", "hsdusu_kuyecao", "hsdusu_shinancao", "hsdusu_huoyanhua"],
		content() {
			var list = ["hsdusu_xueji", "hsdusu_huangxuecao", "hsdusu_kuyecao", "hsdusu_shinancao", "hsdusu_huoyanhua"];
			if (typeof lib.cardType.hslingjian !== "number") {
				list.remove("hsdusu_kuyecao");
			}
			var name = list.randomGet();
			if (name === "hsdusu_huoyanhua") {
				player.gain(game.createCard({ name: name, nature: "fire" }), "draw");
			} else {
				player.gain(game.createCard(name), "draw");
			}
		},
		ai: {
			threaten: 1.6,
		},
	},
	hsdusu_shinancao: {
		mark: true,
		marktext: "楠",
		nopop: true,
		intro: {
			content: "下一次造成的伤害+1",
		},
		logv: false,
		trigger: { source: "damageBegin" },
		forced: true,
		content() {
			trigger.num++;
			player.removeSkill("hsdusu_shinancao");
		},
	},
	xiubu: {
		trigger: { player: "equipEnd" },
		frequent: true,
		filter(event) {
			return lib.inpile.includes(event.card.name) && get.subtype(event.card) === "equip1" && typeof lib.cardType.hslingjian === "number";
		},
		content() {
			var num = 1;
			var info = get.info(trigger.card);
			if (info && info.distance && typeof info.distance.attackFrom === "number") {
				num = 1 - info.distance.attackFrom;
			}
			if (num < 1) {
				num = 1;
			}
			var list = get.typeCard("hslingjian");
			if (!list.length) {
				return;
			}
			var cards = [];
			while (num--) {
				cards.push(game.createCard(list.randomGet()));
			}
			player.gain(cards, "gain2");
		},
		threaten: 1.3,
	},
	zengli: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target !== player && !target.isMin();
		},
		delay: false,
		content() {
			"step 0";
			var list = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				if (lib.card[lib.inpile[i]].subtype === "equip1") {
					list.push(lib.inpile[i]);
				}
			}
			if (!list.length) {
				event.finish();
				return;
			}
			event.card1 = game.createCard(list.randomGet());
			event.card2 = game.createCard(list.randomGet());
			player.$draw(event.card1);
			target.$draw(event.card2);
			game.delay();
			"step 1";
			player.equip(event.card1);
			"step 2";
			target.equip(event.card2);
		},
		ai: {
			order: 11,
			result: {
				player: 1,
				target(player, target) {
					if (target.getEquip(1)) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	mobao: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!player.storage.mobao) {
				return false;
			}
			if (!player.countCards("h", { color: "black" })) {
				return false;
			}
			for (var i = 0; i < player.storage.mobao.length; i++) {
				if (player.storage.mobao[i].isAlive()) {
					return true;
				}
			}
			return false;
		},
		filterTarget(card, player, target) {
			return player.storage.mobao.includes(target);
		},
		position: "he",
		selectTarget: -1,
		selectCard: [1, 3],
		check(card) {
			return 8 - get.value(card);
		},
		filterCard: { color: "black" },
		line: "thunder",
		content() {
			target.damage("thunder", cards.length);
		},
		ai: {
			order: 9,
			threaten: 0.7,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "thunder");
				},
			},
		},
		group: ["mobao2", "mobao3"],
	},
	mobao2: {
		trigger: { player: "damageEnd" },
		silent: true,
		filter(event, player) {
			return event.source && event.source !== player;
		},
		content() {
			if (!player.storage.mobao) {
				player.storage.mobao = [];
			}
			player.storage.mobao.add(trigger.source);
		},
		ai: {
			maixie_defend: true,
		},
	},
	mobao3: {
		trigger: { player: "phaseEnd" },
		silent: true,
		content() {
			delete player.storage.mobao;
		},
	},
	xianji: {
		unique: true,
		forceunique: true,
		global: "xianji2",
	},
	xianji2: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			if (player.hasSkill("xianji")) {
				return false;
			}
			if (!player.countCards("he")) {
				return false;
			}
			if (player.hasSkill("xianji3")) {
				return true;
			}
			return game.hasPlayer(function (current) {
				return current.hasSkill("xianji");
			});
		},
		content() {
			"step 0";
			player.removeSkill("xianji3");
			event.target = game.findPlayer(function (current) {
				return current.hasSkill("xianji");
			});
			if (event.target) {
				player
					.chooseToDiscard([1, 2], "献祭：是否弃置1~2张手牌并令" + get.translation(event.target) + "摸等量的牌？")
					.set("ai", function (card) {
						if (get.attitude(_status.event.player, _status.event.getParent().target) > 1) {
							return 6 - get.value(card);
						}
						return 0;
					})
					.set("logSkill", ["xianji", event.target]);
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				event.target.draw(result.cards.length);
				player.storage.xianji3 = event.target;
				player.addSkill("xianji3");
				player.addExpose(0.2);
			}
		},
	},
	xianji3: {
		mark: "character",
		intro: {
			content: "每当$对你使用一张牌，你摸一张牌",
		},
		trigger: { target: "useCardToBegin" },
		filter(event, player) {
			return event.player === player.storage.xianji3;
		},
		forced: true,
		content() {
			player.draw();
		},
	},
	tanmi: {
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return player.countCards("h") === 0 && event.player !== player;
		},
		frequent: true,
		content() {
			"step 0";
			player.draw(2);
			"step 1";
			player.chooseToUse();
			"step 2";
			if (result.bool) {
				player.chooseToUse();
			}
		},
		ai: {
			noh: true,
			skillTagFilter(player, tag) {
				if (tag === "noh") {
					if (player.countCards("h") !== 1) {
						return false;
					}
				}
			},
		},
	},
	xueren: {
		trigger: { source: "damageEnd" },
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name === "sha" && event.player.isAlive();
		},
		check(event, player) {
			if (get.attitude(player, event.player) >= 0) {
				return false;
			}
			if (player.hp > 2) {
				return true;
			}
			if (player.hp < 2) {
				return false;
			}
			return player.hp >= event.player.hp;
		},
		content() {
			"step 0";
			trigger.player.loseHp();
			"step 1";
			player.loseHp();
			"step 2";
			player.draw(2);
		},
	},
	maoxian: {
		enable: "phaseUse",
		usable: 2,
		direct: true,
		delay: false,
		unique: true,
		content() {
			"step 0";
			var list = get.gainableSkills();
			list.remove("maoxian");
			list = list.randomGets(3);
			event.skillai = function () {
				return get.max(list, get.skillRank, "item");
			};
			if (event.isMine()) {
				var dialog = ui.create.dialog("forcebutton");
				dialog.add("选择获得一项技能");
				var clickItem = function () {
					_status.event._result = this.link;
					dialog.close();
					game.resume();
				};
				for (var i = 0; i < list.length; i++) {
					if (lib.translate[list[i] + "_info"]) {
						var translation = get.translation(list[i]);
						if (translation[0] === "新" && translation.length === 3) {
							translation = translation.slice(1, 3);
						} else {
							translation = translation.slice(0, 2);
						}
						var item = dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + translation + "】</div><div>" + lib.translate[list[i] + "_info"] + "</div></div>");
						item.firstChild.addEventListener("click", clickItem);
						item.firstChild.link = list[i];
					}
				}
				dialog.add(ui.create.div(".placeholder"));
				event.switchToAuto = function () {
					event._result = event.skillai();
					dialog.close();
					game.resume();
				};
				_status.imchoosing = true;
				game.pause();
			} else {
				event._result = event.skillai();
			}
			"step 1";
			_status.imchoosing = false;
			var link = result;
			player.addAdditionalSkill("maoxian", link);
			player.popup(link);
			game.log(player, "获得了技能", "【" + get.translation(link) + "】");
			player.checkMarks();
			player.markSkill("maoxian");
			game.delay();
		},
		intro: {
			content(storage, player) {
				return "当前技能：" + get.translation(player.additionalSkills.maoxian);
			},
		},
		ai: {
			order: 11,
			result: {
				player(player) {
					if (player.getStat().skill.maoxian) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	yiwen: {
		trigger: { target: "useCardToBegin" },
		filter(event, player) {
			return event.targets && event.targets.length === 1 && event.target !== event.player && _status.currentPhase === event.player && !event.player.hasSkill("yiwen2") && !get.info(event.card).unique;
		},
		forced: true,
		content() {
			player.gain(game.createCard(trigger.card), "gain2");
			trigger.player.addTempSkill("yiwen2");
		},
		ai: {
			threaten: 0.7,
		},
	},
	yiwen2: {},
	qianghuax: {
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			var type = get.type(card, "trick");
			for (var i = 0; i < ui.selected.cards.length; i++) {
				if (type === get.type(ui.selected.cards[i], "trick")) {
					return false;
				}
			}
			return true;
		},
		complexCard: true,
		position: "he",
		check(card) {
			return 8 - get.value(card);
		},
		selectCard: [1, Infinity],
		content() {
			var cards2 = [];
			for (var i = 0; i < cards.length; i++) {
				var type = get.type(cards[i], "trick");
				var list = game.findCards(function (name) {
					if (cards[i].name === name) {
						return;
					}
					if (get.type({ name: name }, "trick") === type) {
						return get.value({ name: name }) > get.value(cards[i]);
					}
				});
				if (!list.length) {
					list = game.findCards(function (name) {
						if (cards[i].name === name) {
							return;
						}
						if (get.type({ name: name }, "trick") === type) {
							return get.value({ name: name }) === get.value(cards[i]);
						}
					});
				}
				if (!list.length) {
					list = [cards[i].name];
				}
				cards2.push(game.createCard(list.randomGet()));
			}
			player.gain(cards2, "log");
			player.$draw(cards2);
		},
		ai: {
			order: 8,
			result: {
				player: 1,
			},
		},
	},
	zhuizong: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		selectCard: [1, Infinity],
		check(card) {
			if (ui.selected.cards.length) {
				return 0;
			}
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			event.cards = get.cards(4 * cards.length);
			player.chooseCardButton("获得其中的一张牌", true, event.cards, true);
			"step 1";
			player.gain(result.links, "draw");
			event.cards.remove(result.links[0]);
			for (var i = 0; i < event.cards.length; i++) {
				event.cards[i].discard();
			}
		},
		ai: {
			order: 8,
			result: {
				player: 1,
			},
		},
	},
	xunbao: {
		trigger: { player: "phaseBegin" },
		frequent: true,
		filter(event, player) {
			return !player.hasSkill("xunbao2");
		},
		derivation: ["hsbaowu_cangbaotu", "hsbaowu_huangjinyuanhou"],
		priority: 1,
		content() {
			"step 0";
			event.card = game.createCard("hsbaowu_cangbaotu");
			player.storage.xunbao2 = event.card;
			player.storage.xunbao2_markcount = player.storage.xunbao2.number;
			player.addSkill("xunbao2");
			game.delay(2);
			event.node = event.card.copy("thrown", "center", "thrownhighlight", ui.arena).addTempClass("start");
			ui.arena.classList.add("thrownhighlight");
			game.addVideo("thrownhighlight1");
			game.addVideo("centernode", null, get.cardInfo(event.card));
			"step 1";
			game.addVideo("deletenode", player, [get.cardInfo(event.node)]);
			event.node.delete();
			event.node.style.transform = "scale(0)";
			game.addVideo("thrownhighlight2");
			ui.arena.classList.remove("thrownhighlight");
		},
		ai: {
			order: 3,
			result: {
				player: 1,
			},
		},
	},
	xunbao2: {
		mark: true,
		marktext: "宝",
		intro: {
			content: "card",
		},
		direct: true,
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			var hs = player.getCards("he");
			for (var i = 0; i < hs.length; i++) {
				if (hs[i].number === player.storage.xunbao2.number) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			player.chooseToDiscard("是否弃置一张点数为" + player.storage.xunbao2.number + "的牌获得藏宝图？", "he", function (card) {
				return card.number === player.storage.xunbao2.number;
			}).ai = function (card) {
				return 7 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.gain(player.storage.xunbao2, "gain2", "log");
				delete player.storage.xunbao2;
				player.removeSkill("xunbao2");
			}
		},
	},
	hsbaowu_cangbaotu: {
		trigger: { player: "phaseEnd" },
		forced: true,
		popup: false,
		content() {
			player.gain(game.createCard("hsbaowu_huangjinyuanhou"), "gain2");
			player.removeSkill("hsbaowu_cangbaotu");
		},
	},
	hsbaowu_huangjinyuanhou: {
		mark: "card",
		nopup: true,
		intro: {
			content: "锁定技，你不能成为其他角色的卡牌的目标",
		},
		mod: {
			targetEnabled(card, player, target) {
				if (player !== target) {
					return false;
				}
			},
		},
		group: "hsbaowu_huangjinyuanhou2",
	},
	hsbaowu_huangjinyuanhou2: {
		trigger: { player: "phaseBegin" },
		silent: true,
		content() {
			player.removeSkill("hsbaowu_huangjinyuanhou");
			delete player.storage.hsbaowu_huangjinyuanhou;
		},
	},
	xieneng: {
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			var list = [
				["", "", "hsshenqi_morijingxiang"],
				["", "", "hsshenqi_kongbusangzhong"],
				["", "", "hsshenqi_nengliangzhiguang"],
			];
			var dialog = ui.create.dialog(get.prompt("xieneng"), [list, "vcard"], "hidden");
			player.chooseButton(dialog).ai = function () {
				return Math.random();
			};
			"step 1";
			if (result.buttons) {
				player.logSkill("xieneng");
				player.gain(game.createCard(result.buttons[0].link[2]), "draw");
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	fbeifa: {
		trigger: { player: "loseEnd" },
		filter(event, player) {
			if (player.countCards("h")) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "h") {
					return true;
				}
			}
			return false;
		},
		direct: true,
		usable: 3,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("fbeifa"), function (card, player, target) {
				return lib.filter.targetEnabled({ name: "sha" }, player, target);
			}).ai = function (target) {
				return get.effect(target, { name: "sha" }, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("fbeifa");
				player.useCard({ name: "sha" }, result.targets, false);
			}
		},
		ai: {
			noh: true,
			skillTagFilter(player, tag) {
				if (tag === "noh") {
					if (player.countCards("h") !== 1) {
						return false;
					}
				}
			},
			expose: 0.2,
		},
		group: ["fbeifa_draw"],
		subSkill: {
			draw: {
				trigger: { source: "damageAfter" },
				forced: true,
				popup: false,
				filter(event) {
					return event.parent.parent.parent.name === "fbeifa";
				},
				content() {
					player.draw();
				},
			},
		},
	},
	oldfbeifa: {
		trigger: { player: "loseEnd" },
		filter(event, player) {
			if (player.countCards("h")) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "h") {
					return true;
				}
			}
			return false;
		},
		direct: true,
		usable: 3,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("fbeifa"), function (card, player, target) {
				return lib.filter.targetEnabled({ name: "sha" }, player, target);
			}).ai = function (target) {
				return get.effect(target, { name: "sha" }, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("fbeifa");
				player.useCard({ name: "sha" }, result.targets, false);
			}
		},
		ai: {
			expose: 0.2,
		},
		group: ["oldfbeifa_draw"],
		subSkill: {
			draw: {
				trigger: { source: "damageAfter" },
				forced: true,
				popup: false,
				filter(event) {
					return event.parent.parent.parent.name === "oldfbeifa";
				},
				content() {
					player.draw();
				},
			},
		},
	},
	yufa: {
		trigger: { global: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.storage.yufa === event.player;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("yufa"), function (card, player, target) {
				return target !== trigger.player;
			}).ai = function (target) {
				return get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("yufa", result.targets);
				result.targets[0].gain(game.createCard("chuansongmen"), "gain2");
			}
		},
		group: ["yufa2", "yufa3"],
		ai: {
			maixie: true,
			maixie_hp: true,
			expose: 0.1,
		},
	},
	yufa2: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source === _status.currentPhase && event.source !== player;
		},
		silent: true,
		content() {
			player.storage.yufa = trigger.source;
		},
	},
	yufa3: {
		trigger: { global: "phaseBegin" },
		silent: true,
		content() {
			player.storage.yufa = null;
		},
	},
	bingyan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterTarget(card, player, target) {
			if (get.color(card) === "red") {
				return player.canUse("chiyuxi", target);
			} else {
				return player.canUse("jingleishan", target);
			}
		},
		selectTarget: -1,
		discard: false,
		delay: false,
		line: false,
		filterCard: true,
		position: "he",
		log: "notarget",
		check(card) {
			return 6 - get.value(card);
		},
		multitarget: true,
		content() {
			if (get.color(cards[0]) === "black") {
				player.useCard({ name: "jingleishan" }, cards, targets);
			} else {
				player.useCard({ name: "chiyuxi" }, cards, targets);
			}
		},
		ai: {
			order: 9.1,
			result: {
				target(player, target) {
					var card = ui.selected.cards[0];
					if (card && get.color(card) === "black") {
						return get.effect(target, { name: "jingleishan" }, player, target);
					}
					return get.effect(target, { name: "chiyuxi" }, player, target);
				},
			},
		},
	},
	shifa: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		content() {
			"step 0";
			var list = [];
			var target = player.getEnemies().randomGet();
			for (var i = 0; i < lib.inpile.length; i++) {
				if (lib.card[lib.inpile[i]].type === "trick") {
					list.push(lib.inpile[i]);
				}
			}
			player.gain(game.createCard(list.randomGet()));
			player.$draw();
			if (target) {
				target.gain(game.createCard(list.randomGet()));
				target.$draw();
				target.addExpose(0.2);
				player.line(target, "green");
				game.log(player, "和", target, "获得了一张锦囊牌");
			}
			"step 1";
			game.delay();
		},
		group: "shifa_draw",
		subSkill: {
			draw: {
				trigger: { player: "useCard" },
				frequent: true,
				usable: 3,
				filter(event, player) {
					if (_status.currentPhase !== player) {
						return false;
					}
					return get.type(event.card) === "trick" && event.card.isCard;
				},
				content() {
					player.draw();
				},
			},
		},
		ai: {
			threaten: 1.5,
			noautowuxie: true,
		},
	},
	oldshifa: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		content() {
			"step 0";
			var list = [];
			var target = player.getEnemies().randomGet();
			for (var i = 0; i < lib.inpile.length; i++) {
				if (lib.card[lib.inpile[i]].type === "trick") {
					list.push(lib.inpile[i]);
				}
			}
			player.gain(game.createCard(list.randomGet()));
			player.$draw();
			if (target) {
				target.gain(game.createCard(list.randomGet()));
				target.$draw();
				target.addExpose(0.2);
				player.line(target, "green");
				game.log(player, "和", target, "获得了一张锦囊牌");
			}
			"step 1";
			game.delay();
		},
		group: "oldshifa_draw",
		subSkill: {
			draw: {
				trigger: { player: "useCard" },
				frequent: true,
				filter(event, player) {
					if (_status.currentPhase !== player) {
						return false;
					}
					return get.type(event.card) === "trick" && event.card.isCard;
				},
				content() {
					player.draw();
				},
			},
		},
		ai: {
			threaten: 1.5,
			noautowuxie: true,
		},
	},
	yuanzheng: {
		trigger: { player: "useCardToBegin" },
		direct: true,
		filter(event, player) {
			return event.target && event.target !== player && get.distance(player, event.target) > 1 && event.target.countCards("he") > 0;
		},
		content() {
			player.discardPlayerCard(trigger.target, get.prompt("yuanzheng", trigger.target), "hej").logSkill = ["yuanzheng", trigger.target];
		},
	},
	yulu: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget: [1, Infinity],
		content() {
			"step 0";
			if (target === targets[0]) {
				game.asyncDraw(targets);
			}
			"step 1";
			if (target === targets[0]) {
				game.delay();
			}
			"step 2";
			target.chooseToDiscard("hej", true);
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (target.countCards("j")) {
						return 2;
					}
					switch (target.countCards("he")) {
						case 0:
							return 0;
						case 1:
							return 0.5;
						case 2:
							return 0.8;
						default:
							return 1;
					}
				},
			},
			threaten: 1.2,
		},
	},
	oldyulu: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget: [1, Infinity],
		content() {
			"step 0";
			if (target === targets[0]) {
				game.asyncDraw(targets, 2);
			}
			"step 1";
			if (target === targets[0]) {
				game.delay();
			}
			"step 2";
			target.chooseToDiscard("hej", 2, true);
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (target.countCards("j")) {
						return 2;
					}
					switch (target.countCards("he")) {
						case 0:
							return 0;
						case 1:
							return 0.5;
						case 2:
							return 0.8;
						default:
							return 1;
					}
				},
			},
			threaten: 1.2,
		},
	},
	duzhang: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			var stat = player.getStat("card");
			for (var i in stat) {
				if (typeof stat[i] === "number" && get.type(i, "trick") === "trick") {
					return false;
				}
			}
			return true;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("duzhang"), function (card, player, target) {
				return target !== player;
			}).ai = function (target) {
				return -get.attitude(player, target) * Math.sqrt(target.countCards("h"));
			};
			"step 1";
			if (result.bool) {
				player.logSkill("duzhang", result.targets);
				result.targets[0].addTempSkill("duzhang2", { player: "phaseAfter" });
			}
		},
	},
	duzhang2: {
		mod: {
			cardEnabled(card) {
				if (get.type(card, "trick") === "trick") {
					return false;
				}
			},
		},
		mark: true,
		marktext: "瘴",
		intro: {
			content: "下个回合无法使用锦囊牌",
		},
	},
	hannu: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			var nh = player.countCards("h");
			if (nh) {
				player.draw(nh);
			} else {
				event.finish();
			}
			"step 1";
			var hs = player.getCards("h");
			if (hs.length > 10 && hs.length > player.hp) {
				player.discard(hs.randomGets(hs.length - player.hp));
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						var nh = target.countCards("h");
						if (nh > 5) {
							return [1, -1];
						}
						if (nh <= 1) {
							return [1, -0.1];
						}
						if (nh === 2) {
							if (target.hp >= 2) {
								return [1, 0.1];
							}
						} else {
							if (target.hp >= 4) {
								return [1, 2];
							}
							if (target.hp === 3) {
								return [1, 1.5];
							}
							if (target.hp === 2) {
								return [1, 0.5];
							}
						}
					}
				},
			},
		},
	},
	chuidiao: {
		trigger: { player: "phaseEnd" },
		forced: true,
		content() {
			var num = Math.floor(Math.random() * 3);
			if (num) {
				player.draw(num);
			}
		},
	},
	hhudun: {
		trigger: { global: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return !player.hujia;
		},
		content() {
			player.changeHujia();
		},
		group: "hhudun_hujia",
		subSkill: {
			hujia: {
				trigger: { player: "damageEnd" },
				filter(event) {
					return event.hujia === event.num;
				},
				forced: true,
				content() {
					player.draw();
				},
			},
		},
		ai: {
			threaten(player, target) {
				if (target.hujia) {
					return 0.5;
				} else {
					return 2;
				}
			},
		},
	},
	fenlie: {
		forced: true,
		trigger: { player: "gainAfter" },
		filter(event, player) {
			if (event.parent.parent.name === "phaseDraw") {
				return false;
			}
			if (event.parent.name === "fenlie") {
				return false;
			}
			if (!event.cards) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (!get.info(event.cards[i]).unique) {
					return true;
				}
			}
			return false;
		},
		usable: 2,
		content() {
			var cards = [];
			for (var i = 0; i < trigger.cards.length; i++) {
				if (get.info(trigger.cards[i]).unique) {
					continue;
				}
				cards.push(game.createCard(trigger.cards[i]));
			}
			player.gain(cards, "draw");
		},
		ai: {
			effect: {
				target(card) {
					if (card.name === "toulianghuanzhu") {
						return [1, 2];
					}
				},
			},
		},
	},
	oldfenlie: {
		forced: true,
		trigger: { player: "gainAfter" },
		filter(event, player) {
			if (event.parent.parent.name === "phaseDraw") {
				return false;
			}
			if (event.parent.name === "oldfenlie") {
				return false;
			}
			if (!event.cards) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (!get.info(event.cards[i]).unique) {
					return true;
				}
			}
			return false;
		},
		content() {
			var cards = [];
			for (var i = 0; i < trigger.cards.length; i++) {
				if (get.info(trigger.cards[i]).unique) {
					continue;
				}
				cards.push(game.createCard(trigger.cards[i]));
			}
			player.gain(cards, "draw");
		},
		ai: {
			effect: {
				target(card) {
					if (card.name === "toulianghuanzhu") {
						return [1, 2];
					}
				},
			},
		},
	},
	nianfu: {
		trigger: { source: "damageEnd", player: "damageEnd" },
		forced: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			if (player === event.source) {
				return event.player !== player && event.player.countCards("e") > 0;
			} else {
				return event.source && event.source !== player && event.source.countCards("e") > 0;
			}
		},
		logTarget(event, player) {
			if (player === event.player) {
				return event.source;
			} else {
				return event.player;
			}
		},
		content() {
			var target = player === trigger.player ? trigger.source : trigger.player;
			if (target) {
				var cards = target.getCards("e");
				if (cards.length) {
					var card = cards.randomGet();
					player.gain(card, target);
					target.$give(card, player);
				}
			}
		},
	},
	xiaorong: {
		mod: {
			ignoredHandcard(card, player) {
				if (get.type(card) === "equip") {
					return true;
				}
			},
		},
		trigger: { player: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player.countCards("h", { type: "equip" }) > 0;
		},
		content() {
			var cards = player.getCards("h", { type: "equip" });
			if (cards.length) {
				player.lose(cards)._triggered = null;
				var list = [];
				var names = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					if (lib.card[lib.inpile[i]].type === "basic") {
						names.push(lib.inpile[i]);
					}
				}
				names.remove("du");
				for (var i = 0; i < cards.length * 2; i++) {
					list.push(game.createCard(names.randomGet()));
				}
				player.directgain(list);
				player.recover(cards.length);
			}
		},
		ai: {
			effect: {
				player_use(card, player) {
					if (_status.currentPhase !== player) {
						return;
					}
					if (get.type(card) === "equip" && get.equipValueNumber(card) < 7) {
						if (player.needsToDiscard(2)) {
							return;
						}
						return [0, 0, 0, 0];
					}
				},
			},
		},
	},
	shixu: {
		locked: true,
		group: ["shixu_begin", "shixu_end", "shixu_discard"],
		subSkill: {
			begin: {
				trigger: { global: "phaseUseBegin" },
				silent: true,
				content() {
					trigger.player.storage.shixu_begin = get.time();
				},
			},
			end: {
				trigger: { global: "phaseUseEnd" },
				silent: true,
				filter(event, player) {
					return typeof event.player.storage.shixu_begin === "number";
				},
				content() {
					trigger.player.storage.shixu = get.time() - trigger.player.storage.shixu_begin;
					delete trigger.player.storage.shixu_begin;
				},
			},
			discard: {
				trigger: { global: "phaseEnd" },
				forced: true,
				check(event, player) {
					return get.attitude(player, event.player) < 0;
				},
				filter(event, player) {
					return typeof event.player.storage.shixu === "number" && event.player.storage.shixu > 3000 && event.player.countCards("he") > 0 && event.player.isAlive();
				},
				content() {
					player.line(trigger.player, "green");
					trigger.player.chooseToDiscard("he", true, Math.floor(trigger.player.storage.shixu / 3000));
					delete trigger.player.storage.shixu;
				},
			},
		},
	},
	jixuan: {
		trigger: { player: "phaseAfter" },
		forced: true,
		priority: -50,
		filter(event, player) {
			return event.skill !== "jixuan";
		},
		content() {
			player.draw();
			player.insertPhase();
		},
		ai: {
			threaten: 1.8,
		},
	},
	qianghua: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (event.parent.name === "qianghua") {
				return false;
			}
			if (player.storage.qianghua >= 1) {
				return false;
			}
			if (_status.currentPhase !== player) {
				return false;
			}
			if (event.parent.parent.name !== "phaseUse") {
				return false;
			}
			if (!event.targets || !event.card) {
				return false;
			}
			if (get.info(event.card).complexTarget) {
				return false;
			}
			if (!lib.filter.cardEnabled(event.card, player, event.parent)) {
				return false;
			}
			var type = get.type(event.card);
			if (type !== "basic" && type !== "trick") {
				return false;
			}
			var card = game.createCard(event.card.name, event.card.suit, event.card.number, event.card.nature);
			var targets = event._targets || event.targets;
			for (var i = 0; i < targets.length; i++) {
				if (!targets[i].isIn()) {
					return false;
				}
				if (!player.canUse({ name: event.card.name }, targets[i], false, false)) {
					return false;
				}
			}
			return true;
		},
		check(event, player) {
			if (get.tag({ name: event.card.name }, "norepeat")) {
				return false;
			}
			return true;
		},
		content() {
			player.storage.qianghua++;
			var card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
			player.useCard(card, (trigger._targets || trigger.targets).slice(0));
		},
		ai: {
			threaten: 1.3,
		},
		group: "qianghua_clear",
		subSkill: {
			clear: {
				trigger: { player: "phaseBefore" },
				silent: true,
				content() {
					player.storage.qianghua = 0;
				},
			},
		},
	},
	qianghua2: {},
	biri: {
		trigger: { global: "useCard" },
		priority: 15,
		filter(event, player) {
			return event.card.name === "sha" && event.player !== player && get.distance(player, event.targets[0]) <= 1 && player.countCards("h", "shan") > 0 && event.targets.includes(player) === false && event.targets.length === 1;
		},
		direct: true,
		content() {
			"step 0";
			var effect = 0;
			for (var i = 0; i < trigger.targets.length; i++) {
				effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
			}
			var str = "蔽日：是否弃置一张闪令" + get.translation(trigger.player);
			if (trigger.targets && trigger.targets.length) {
				str += "对" + get.translation(trigger.targets);
			}
			str += "的" + get.translation(trigger.card) + "失效？";
			var next = player.chooseToDiscard(
				"h",
				function (card) {
					return card.name === "shan";
				},
				str
			);
			next.ai = function (card) {
				if (effect < 0) {
					return 9 - get.value(card);
				}
				return -1;
			};
			next.autodelay = true;
			next.logSkill = ["biri", trigger.targets];
			"step 1";
			if (result.bool) {
				trigger.cancel();
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	stuxi: {
		trigger: { player: "phaseEnd" },
		forced: true,
		filter(event, player) {
			var enemies = player.getEnemies();
			for (var i = 0; i < enemies.length; i++) {
				if (!enemies[i].hasSkill("stuxi2")) {
					return true;
				}
			}
			return false;
		},
		content() {
			var enemies = player.getEnemies();
			for (var i = 0; i < enemies.length; i++) {
				if (enemies[i].hasSkill("stuxi2")) {
					enemies.splice(i--, 1);
				}
			}
			var target = enemies.randomGet();
			if (target) {
				player.line(target, "green");
				target.addExpose(0.2);
				target.addSkill("stuxi2");
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	stuxi2: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		mark: true,
		intro: {
			content: "下个摸牌阶段摸牌数-1",
		},
		filter(event) {
			return event.num > 0;
		},
		content() {
			trigger.num--;
			player.removeSkill("stuxi2");
		},
	},
	bingdong: {
		trigger: { source: "damageEnd" },
		forced: true,
		usable: 1,
		content() {
			player.gain(game.createCard("hslingjian_jinjilengdong"), "gain2");
		},
	},
	luoshi: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return player.countCards("he") > 0 || (event.source && event.source.countCards("he") > 0);
		},
		content() {
			"step 0";
			var hs = player.getCards("he");
			if (hs.length) {
				player.discard(hs.randomGet());
			}
			"step 1";
			if (trigger.source) {
				var hs = trigger.source.getCards("he");
				if (hs.length) {
					trigger.source.discard(hs.randomGet());
				}
			}
		},
		ai: {
			maixie_defend: true,
		},
	},
	ronghuo: {
		trigger: { player: "useCardToBefore" },
		priority: 7,
		filter(event, player) {
			if (event.card.name === "sha" && !event.card.nature) {
				return true;
			}
		},
		check(event, player) {
			var att = get.attitude(player, event.target);
			if (event.target.hasSkillTag("nofire")) {
				return att > 0;
			}
			return att <= 0;
		},
		forced: true,
		content() {
			trigger.card.nature = "fire";
			player.addSkill("ronghuo2");
			player.storage.ronghuo = trigger.card;
		},
	},
	ronghuo2: {
		trigger: { player: "useCardAfter" },
		forced: true,
		popup: false,
		content() {
			delete player.storage.ronghuo.nature;
		},
	},
	fushi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.hp < target.maxHp;
		},
		content() {
			"step 0";
			target.loseMaxHp(true);
			"step 1";
			if (target.hp < target.maxHp) {
				target.recover();
			}
		},
		ai: {
			threaten: 1.4,
			expose: 0.2,
			order: 9,
			result: {
				target(player, target) {
					if (target.hp === target.maxHp) {
						return 0;
					}
					if (target.hp === target.maxHp - 1) {
						return -1;
					}
					if (target.hp === 1) {
						return 1;
					}
					if (target.hp < target.maxHp - 2) {
						return 0.5;
					}
					return 0;
				},
			},
		},
	},
	oldfushi: {
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target.hp < target.maxHp;
		},
		content() {
			"step 0";
			target.loseMaxHp(true);
			"step 1";
			if (target.hp < target.maxHp) {
				target.recover();
			}
		},
		ai: {
			threaten: 1.4,
			expose: 0.2,
			order: 9,
			result: {
				target(player, target) {
					if (target.hp === target.maxHp) {
						return 0;
					}
					if (target.hp === target.maxHp - 1) {
						return -1;
					}
					if (target.hp === 1) {
						return 1;
					}
					if (target.hp < target.maxHp - 2) {
						return 0.5;
					}
					return 0;
				},
			},
		},
	},
	moyao: {
		mod: {
			targetEnabled(card, player, target, now) {
				if (player !== target) {
					if (get.type(card, "trick") === "trick") {
						return false;
					}
				}
			},
		},
	},
	jiaohui: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return !player.getStat("damage");
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("jiaohui")).ai = function (target) {
				var att = get.attitude(player, target);
				if (att > 1) {
					if (target.hp <= 1) {
						att += 2;
					}
					if (target.hp <= 2) {
						att++;
					}
				}
				return att;
			};
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("jiaohui", event.target);
				event.target.chooseDrawRecover(true);
			}
		},
	},
	bimeng: {
		trigger: { player: "phaseEnd" },
		frequent: true,
		derivation: ["hsmengjing_feicuiyoulong", "hsmengjing_huanxiaojiemei", "hsmengjing_suxing", "hsmengjing_mengye", "hsmengjing_mengjing"],
		content() {
			var list = ["hsmengjing_feicuiyoulong", "hsmengjing_huanxiaojiemei", "hsmengjing_suxing", "hsmengjing_mengye", "hsmengjing_mengjing"];
			player.gain(game.createCard(list.randomGet()));
			player.$draw();
		},
		ai: {
			threaten: 2,
		},
	},
	zhoujiang: {
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return get.type(event.card) === "trick";
		},
		content() {
			var list = ["hszuzhou_nvwudeganguo", "hszuzhou_nvwudepingguo", "hszuzhou_nvwudexuetu", "hszuzhou_wushushike", "hszuzhou_guhuo"];
			player.gain(game.createCard(list.randomGet()), "draw");
		},
		ai: {
			threaten: 1.5,
		},
	},
	liehun: {
		trigger: { player: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player.hasCard(function (card) {
				return get.type(card) !== "basic" && !get.info(card).unique;
			});
		},
		content() {
			var hs = player.getCards("h");
			for (var i = 0; i < hs.length; i++) {
				if (get.type(hs[i]) === "basic" || get.info(hs[i]).unique) {
					hs.splice(i--, 1);
				}
			}
			if (hs.length) {
				var hs2 = [];
				for (var i = 0; i < hs.length; i++) {
					hs2.push(game.createCard(hs[i].name, hs[i].suit, hs[i].number));
				}
				player.gain(hs2, "draw");
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	xjumo: {
		mod: {
			maxHandcard(player, num) {
				if (player.hp < player.maxHp) {
					return num + 5;
				}
				return num + 3;
			},
		},
	},
	malymowang: {
		trigger: { source: "damageBegin" },
		forced: true,
		usable: 1,
		filter(event) {
			return event.card && get.type(event.card) === "trick" && event.parent.name !== "_lianhuan" && event.parent.name !== "_lianhuan2";
		},
		content() {
			trigger.num++;
		},
		group: "malymowang_discover",
		ai: {
			threaten: 1.8,
		},
		subSkill: {
			discover: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				content() {
					player.discoverCard(get.inpile("trick"));
				},
			},
		},
	},
	oldmalymowang: {
		trigger: { source: "damageBegin" },
		forced: true,
		filter(event) {
			return event.card && get.type(event.card) === "trick" && event.parent.name !== "_lianhuan" && event.parent.name !== "_lianhuan2";
		},
		content() {
			trigger.num++;
		},
		group: "oldmalymowang_discover",
		ai: {
			threaten: 1.8,
		},
		subSkill: {
			discover: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				content() {
					player.discoverCard(get.inpile("trick"));
				},
			},
		},
	},
	lingzhou: {
		trigger: { player: "useCard" },
		direct: true,
		filter(event) {
			return get.type(event.card, "trick") === "trick" && event.card.isCard;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("lingzhou")).ai = function (target) {
				var num = get.attitude(player, target);
				if (num > 0) {
					if (target === player) {
						num++;
					}
					if (target.hp === 1) {
						num += 3;
					} else if (target.hp === 2) {
						num += 1;
					}
				}
				return num;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("lingzhou", result.targets);
				result.targets[0].chooseDrawRecover(true);
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.5,
			noautowuxie: true,
		},
	},
	mieshi: {
		trigger: { player: "phaseEnd" },
		forced: true,
		content() {
			"step 0";
			player.loseHp();
			"step 1";
			event.target = game.filterPlayer().randomGet(player);
			if (!event.target) {
				event.finish();
				return;
			}
			player.line(event.target, "fire");
			game.delayx();
			"step 2";
			event.target.damage("fire");
		},
	},
	xmojian: {
		trigger: { player: "turnOverAfter" },
		direct: true,
		filter(event, player) {
			return !player.isTurnedOver();
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("xmojian"), function (card, player, target) {
				return lib.filter.targetEnabled({ name: "sha" }, player, target);
			}).ai = function (target) {
				return get.effect(target, { name: "sha" }, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("xmojian");
				player.useCard({ name: "sha" }, result.targets, false);
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	xshixin: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.player.isAlive() && event.player !== player;
		},
		content() {
			"step 0";
			trigger.player.loseHp();
			"step 1";
			player.loseHp();
		},
	},
	enze: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.countCards("h") !== target.countCards("h");
		},
		content() {
			var num = player.countCards("h") - target.countCards("h");
			if (num > 0) {
				if (num > 3) {
					num = 3;
				}
				target.draw(num);
			} else if (num < 0) {
				if (num < -3) {
					num = -3;
				}
				target.chooseToDiscard(-num, true);
			}
		},
		ai: {
			threaten: 1.8,
			order(name, player) {
				var max = true,
					num = 0;
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i] === player) {
						continue;
					}
					var att = get.attitude(player, players[i]);
					var dh = player.countCards("h") - players[i].countCards("h");
					if (att * dh > num) {
						if (att > 0) {
							max = true;
						} else if (att < 0) {
							max = false;
						}
						num = att * dh;
					}
				}
				if (max) {
					return 10;
				}
				return 0.5;
			},
			result: {
				player(player, target) {
					return (player.countCards("h") - target.countCards("h")) * get.attitude(player, target);
				},
			},
			expose: 0.2,
		},
	},
	oldenze: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.countCards("h") !== target.countCards("h");
		},
		content() {
			var num = player.countCards("h") - target.countCards("h");
			if (num > 0) {
				target.draw(num);
			} else if (num < 0) {
				target.chooseToDiscard(-num, true);
			}
		},
		ai: {
			threaten: 1.8,
			order(name, player) {
				var max = true,
					num = 0;
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i] === player) {
						continue;
					}
					var att = get.attitude(player, players[i]);
					var dh = player.countCards("h") - players[i].countCards("h");
					if (att * dh > num) {
						if (att > 0) {
							max = true;
						} else if (att < 0) {
							max = false;
						}
						num = att * dh;
					}
				}
				if (max) {
					return 10;
				}
				return 0.5;
			},
			result: {
				player(player, target) {
					return (player.countCards("h") - target.countCards("h")) * get.attitude(player, target);
				},
			},
			expose: 0.2,
		},
	},
	chongsheng: {
		unique: true,
		enable: "chooseToUse",
		mark: true,
		init(player) {
			player.storage.chongsheng = 2;
			player.syncStorage("chongsheng");
		},
		filter(event, player) {
			if (event.type !== "dying") {
				return false;
			}
			if (player !== event.dying) {
				return false;
			}
			if (player.storage.chongsheng <= 0) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			player.hp = Math.min(player.storage.chongsheng, player.maxHp);
			player.discard(player.getCards("hej"));
			player.draw(player.storage.chongsheng);
			player.storage.chongsheng--;
			if (player.storage.chongsheng <= 0) {
				player.unmarkSkill("chongsheng");
			}
			"step 1";
			if (player.isLinked()) {
				player.link();
			}
			"step 2";
			if (player.isTurnedOver()) {
				player.turnOver();
			}
			player.syncStorage("chongsheng");
		},
		ai: {
			skillTagFilter(player) {
				if (player.storage.chongsheng <= 0) {
					return false;
				}
				if (player.hp > 0) {
					return false;
				}
			},
			save: true,
			result: {
				player: 10,
			},
			threaten(player, target) {
				if (target.storage.chongsheng > 0) {
					return 0.6;
				}
			},
		},
		intro: {
			content: "time",
		},
	},
	guozai: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") < 4;
		},
		init(player) {
			player.storage.guozai2 = 0;
		},
		content() {
			var num = 4 - player.countCards("h");
			player.draw(num);
			player.addSkill("guozai2");
			player.storage.guozai2 += num;
			game.addVideo("storage", player, ["guozai2", player.storage.guozai2]);
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	guozai2: {
		mark: true,
		intro: {
			content: "当前阶段结束时需弃置&张牌",
		},
		trigger: { player: "phaseUseEnd" },
		forced: true,
		content() {
			player.chooseToDiscard("he", true, player.storage.guozai2);
			player.storage.guozai2 = 0;
			player.removeSkill("guozai2");
		},
	},
	guozaix: {
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return player.countCards("h") < 4;
		},
		init(player) {
			player.storage.guozaix2 = 0;
		},
		content() {
			var num = 4 - player.countCards("h");
			player.draw(num);
			player.addSkill("guozaix2");
			player.storage.guozaix2 += num;
			game.addVideo("storage", player, ["guozaix2", player.storage.guozaix2]);
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	guozaix2: {
		mark: true,
		intro: {
			content: "当前阶段结束时需弃置&张牌",
		},
		trigger: { player: "phaseUseEnd" },
		forced: true,
		content() {
			player.chooseToDiscard("he", true, player.storage.guozaix2);
			player.storage.guozaix2 = 0;
			player.removeSkill("guozaix2");
		},
	},
	hanshuang: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && get.color(event.card) === "black" && !event.player.isTurnedOver() && event.player.isAlive();
		},
		content() {
			trigger.player.turnOver();
			player.loseHp();
		},
		ai: {
			threaten: 1.5,
			effect: {
				player(card, player, target, current) {
					if (get.color(card) === "black" && get.tag(card, "damage")) {
						return [1, 0, 1, -2];
					}
				},
			},
		},
	},
	oldhanshuang: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && get.color(event.card) === "black" && !event.player.isTurnedOver() && event.player.isAlive();
		},
		content() {
			trigger.player.turnOver();
		},
		ai: {
			threaten: 1.5,
			effect: {
				player(card, player, target, current) {
					if (get.color(card) === "black" && get.tag(card, "damage")) {
						return [1, 0, 1, -2];
					}
				},
			},
		},
	},
	bingshi: {
		locked: true,
		global: "bingshi2",
	},
	bingshi2: {
		trigger: { global: "dieAfter" },
		forced: true,
		globalFixed: true,
		filter(event, player) {
			return event.player.hasSkill("bingshi") && event.player.isDead();
		},
		content() {
			trigger.player.line(player, "thunder");
			player.damage("nosource", "thunder").animate = false;
			player.$damage(trigger.player);
			player.$damagepop(-1, "thunder");
			if (lib.config.animation && !lib.config.low_performance) {
				player.$thunder();
			}
			if (!event.parent.parent.bingshi_logv) {
				event.parent.parent.bingshi_logv = true;
				game.logv(trigger.player, "bingshi", game.filterPlayer(), event.parent.parent);
			}
		},
	},
	huanwu: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return !target.storage.huanwu;
		},
		content() {
			target.gainMaxHp();
			target.recover();
			target.draw(2);
			target.storage.huanwu = true;
			target.mark("huanwu", {
				name: "唤雾",
				content: "已发动",
			});
			game.addVideo("mark", target, {
				name: "唤雾",
				content: "已发动",
				id: "huanwu",
			});
		},
		ai: {
			threaten: 1.2,
			result: {
				target(player, target) {
					return 1 / target.hp;
				},
			},
			order: 10,
			expose: 0.3,
		},
	},
	fengnu: {
		mod: {
			cardUsable(card) {
				if (get.info(card) && get.info(card).forceUsable) {
					return;
				}
				return Infinity;
			},
			targetInRange() {
				return true;
			},
		},
		trigger: { player: "useCard" },
		filter(event, player) {
			if (_status.currentPhase !== player) {
				return false;
			}
			return player.countUsed(event.card) > 1;
		},
		forced: true,
		usable: 3,
		content() {
			player.draw();
		},
	},
	shengdun: {
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return !player.hujia;
		},
		content() {
			player.changeHujia();
			player.update();
		},
	},
	jingmeng: {
		trigger: { player: "useCard" },
		frequent: true,
		filter(event, player) {
			return _status.currentPhase === player && player.countUsed() === 1;
		},
		content() {
			var type = get.type(trigger.card);
			var card = get.cardPile2(function (card) {
				return get.type(card) === type;
			});
			if (card) {
				player.gain(card, "gain2", "log");
			}
		},
		ai: {
			threaten: 1.1,
		},
	},
	hswuji: {
		trigger: { player: "phaseUseEnd" },
		frequent: true,
		filter(event, player) {
			return player.countUsed() > 0;
		},
		content() {
			player.draw(player.countUsed());
		},
		ai: {
			threaten: 1.3,
		},
	},
	bingshuang: {
		trigger: { source: "damageEnd" },
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && get.type(event.card) === "trick" && event.player.isAlive() && !event.player.isTurnedOver();
		},
		check(event, player) {
			if (event.player.hasSkillTag("noturn")) {
				return;
			}
			if (event.player.isTurnedOver()) {
				return get.attitude(player, event.player) > 0;
			}
			return get.attitude(player, event.player) <= 0;
		},
		logTarget: "player",
		content() {
			trigger.player.draw(2);
			trigger.player.turnOver();
		},
	},
	yanshu: {
		trigger: { player: "discardAfter" },
		frequent: true,
		usable: 1,
		filter(event, player) {
			if (!event.cards) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (get.type(event.cards[i]) !== "basic") {
					return true;
				}
			}
			return false;
		},
		content() {
			player.gain(game.createCard("liuxinghuoyu", "red"), "gain2");
		},
	},
	oldyanshu: {
		trigger: { player: "discardAfter" },
		frequent: true,
		filter(event, player) {
			if (!event.cards) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (get.type(event.cards[i]) !== "basic") {
					return true;
				}
			}
			return false;
		},
		content() {
			player.gain(game.createCard("liuxinghuoyu", "red"), "gain2");
		},
	},
	shengyan: {
		trigger: { global: "recoverEnd" },
		filter(event, player) {
			return !player.hasSkill("shengyan2") && event.player.hp < event.player.maxHp;
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			trigger.player.recover();
			player.addTempSkill("shengyan2");
		},
		ai: {
			expose: 0.2,
		},
	},
	shengyan2: {},
	liechao: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.isTurnedOver() && player.countCards("h") <= player.hp;
		},
		content() {
			player.draw(4);
			player.turnOver();
			player.skip("phaseDiscard");
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	qingliu: {
		trigger: { player: "damageBefore" },
		filter(event) {
			return event.nature === "fire";
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			nofire: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "fireDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	zhongjia: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event) {
			return event.num > 0;
		},
		content() {
			player.changeHujia();
		},
		ai: {
			nohujia: true,
			maixie: true,
			maixie_hp: true,
			skillTagFilter(player) {
				return player.hp > player.countCards("h") && player.hp > 1;
			},
			threaten(player, target) {
				if (!target.hujia) {
					return 0.8;
				}
			},
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1];
						}
						return 0.8;
					}
				},
			},
		},
	},
	dunji: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hujia ? true : false;
		},
		filterTarget(card, player, target) {
			return player !== target && get.distance(player, target, "attack") <= 1;
		},
		selectTarget() {
			return [1, _status.event.player.hujia];
		},
		contentBefore() {
			player.changeHujia(-targets.length);
		},
		content() {
			target.damage();
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					var eff = get.damageEffect(target, player, target) + 0.5;
					if (eff > 0 && eff <= 0.5) {
						return 0;
					}
					return eff;
				},
			},
		},
	},
	fengxing: {
		trigger: { player: "loseEnd" },
		direct: true,
		filter(event, player) {
			return _status.currentPhase !== player && !player.hasSkill("fengxing2") && player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.addTempSkill("fengxing2");
			player
				.chooseToDiscard("he", get.prompt("fengxing"))
				.set("ai", function (card) {
					return 7 - get.value(card);
				})
				.set("autodelay", 0.5).logSkill = "fengxing";
			"step 1";
			if (result.bool) {
				player.draw(2);
			}
		},
		ai: {
			threaten: 0.6,
		},
	},
	fengxing2: {},
	fengxian: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("h") > 0;
		},
		selectTarget: -1,
		content() {
			target.chooseToDiscard(true);
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					var nh = target.countCards("h");
					switch (nh) {
						case 0:
							return 0;
						case 1:
							return -1.5;
						case 2:
							return -1.3;
						case 3:
							return -1;
						default:
							return -0.8;
					}
				},
			},
		},
	},
	hsmengjing_mengye: {
		trigger: { player: "phaseEnd" },
		forced: true,
		priority: -1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			player.discard(player.getCards("he"));
			player.removeSkill("hsmengjing_mengye");
		},
		mark: "image",
		intro: {
			content: "结束阶段，弃置所有牌",
		},
	},
	zhanhou: {
		enable: "phaseUse",
		filterCard: { subtype: "equip2" },
		position: "he",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", { subtype: "equip2" }) > 0;
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			player.changeHujia();
		},
		ai: {
			order: 9.5,
			result: {
				player: 1,
			},
		},
	},
	oldzhanhou: {
		enable: "phaseUse",
		filterCard: { subtype: "equip2" },
		position: "he",
		filter(event, player) {
			return player.countCards("he", { subtype: "equip2" }) > 0;
		},
		check(card) {
			if (get.position(card) === "e") {
				return 0;
			}
			return 7 - get.value(card);
		},
		content() {
			player.changeHujia();
		},
		ai: {
			order: 6,
			result: {
				player: 1,
			},
		},
	},
	shijie: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current !== player && current.countCards("h");
			});
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("shijie"), function (card, player, target) {
				return player !== target && target.countCards("h") > 0;
			}).ai = function (target) {
				return 11 - get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("shijie", result.targets);
				var target = result.targets[0];
				var card = target.getCards("h").randomGet();
				player.gain(card, target);
				event.target = target;
				target.$giveAuto(card, player);
				event.target.draw();
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	shengguang: {
		enable: "phaseUse",
		filterCard: { color: "red" },
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 0;
		},
		position: "he",
		usable: 1,
		check(card) {
			return 9 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (player.storage.anying) {
				return true;
			}
			if (target.hp >= target.maxHp) {
				return false;
			}
			return true;
		},
		content() {
			if (player.storage.anying) {
				target.loseHp();
			} else {
				target.recover();
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (player.storage.anying) {
						return -1;
					}
					if (target.hp === 1) {
						return 5;
					}
					if (player === target && player.countCards("h") > player.hp) {
						return 5;
					}
					return 2;
				},
			},
			threaten: 2,
			expose: 0.2,
		},
	},
	xinci: {
		enable: "phaseUse",
		filterCard: { color: "black" },
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 0;
		},
		position: "he",
		usable: 1,
		mark: true,
		intro: {
			content: "已进入暗影形态",
		},
		check(card) {
			return 9 - get.value(card);
		},
		filterTarget: true,
		content() {
			target.loseHp();
		},
		ai: {
			order: 9,
			result: {
				target: -1,
			},
			threaten: 2,
			expose: 0.2,
		},
	},
	anying: {
		unique: true,
		limited: true,
		enable: "phaseUse",
		skillAnimation: "epic",
		animationColor: "thunder",
		derivation: "xinci",
		filter(event, player) {
			return !player.storage.anying && player.countCards("he", { color: "black" }) > 0;
		},
		filterCard: { color: "black" },
		position: "he",
		check(card) {
			return 5 - get.value(card);
		},
		content() {
			player.storage.anying = true;
			player.awakenSkill(event.name);
			player.removeSkill("shengguang");
			player.addAdditionalSkill("anying", "xinci");
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (player.hasUnknown()) {
						return 0;
					}
					return !game.hasPlayer(function (current) {
						return get.attitude(player, current) > 0 && current.isDamaged() && current.hp <= 2;
					});
				},
			},
		},
	},
	huanjue: {
		trigger: { player: "useCard1" },
		frequent: true,
		filter(event, player) {
			if (event._huanjue) {
				return false;
			}
			if (event.targets.length !== 1) {
				return false;
			}
			var target = event.targets[0];
			for (var i = 0; i < lib.inpile.length; i++) {
				var info = lib.card[lib.inpile[i]];
				if (info.multitarget) {
					continue;
				}
				if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, event.player, target)) {
					return true;
				}
			}
			return false;
		},
		autodelay: true,
		content() {
			"step 0";
			var list = [],
				list1 = [],
				list2 = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				var info = lib.card[lib.inpile[i]];
				if (info.multitarget) {
					continue;
				}
				if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, trigger.player, trigger.targets[0])) {
					var cardinfo = [trigger.card.suit || "", trigger.card.number || "", lib.inpile[i]];
					list1.push(cardinfo);
					if (info.type !== "equip") {
						list2.push(cardinfo);
					}
				}
			}
			var equipped = false;
			for (var i = 0; i < 3; i++) {
				if (equipped && list2.length) {
					list.push(list2.randomRemove());
				} else {
					equipped = true;
					list.push(list1.randomRemove());
				}
			}
			var eff1 = get.effect(trigger.targets[0], trigger.card, trigger.player, player);
			var val1 = get.value(trigger.card, player, "raw");
			player.chooseButton(["幻觉", [list, "vcard"]]).ai = function (button) {
				var card = {
					suit: trigger.card.suit,
					number: trigger.card.number,
					name: button.link[2],
				};
				var eff2 = get.effect(trigger.targets[0], card, trigger.player, player);
				var val2 = get.value(card, player, "raw");
				if (eff1 > 0) {
					if (eff2 <= 0) {
						return 0;
					}
					return val2 - val1;
				} else if (eff1 < 0) {
					if (eff2 >= 0) {
						return val2;
					}
					return 0;
				} else if (eff1 === 0) {
					if (eff2 > 0) {
						return val2;
					}
					return 0;
				}
			};
			"step 1";
			if (result.bool) {
				var stat = player.stat[player.stat.length - 1].card;
				if (stat[trigger.card.name]) {
					stat[trigger.card.name]--;
				}
				var card = game.createCard({
					suit: trigger.card.suit || lib.suit.randomGet(),
					number: trigger.card.number || Math.ceil(Math.random() * 13),
					name: result.links[0][2],
				});
				event.card = card;
				game.log(player, "将", trigger.card, "变为", card);
				trigger.card = get.autoViewAs(card);
				trigger.cards = [card];
				game.cardsGotoOrdering(card).relatedEvent = trigger;
				trigger._huanjue = true;
			} else {
				event.finish();
			}
			"step 2";
			player.$throw(event.card, null, null, true);
			if (player === trigger.player) {
				player.line(trigger.targets[0], "green");
			} else {
				player.line(trigger.player, "green");
			}
			game.delayx(0.5);
			"step 3";
			var stat = player.stat[player.stat.length - 1].card;
			if (!stat[trigger.card.name]) {
				stat[trigger.card.name] = 1;
			} else {
				stat[trigger.card.name]++;
			}
		},
		draw() {
			player.draw();
		},
		ai: {
			usedu: true,
		},
	},
	bingjia: {
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasSkill("bingjia2");
		},
		filterCard: true,
		check(card) {
			return 6 - get.value(card);
		},
		discard: false,
		prepare(cards, player) {
			player.$give(1, player, false);
		},
		content() {
			player.storage.bingjia = cards[0];
			player.addSkill("bingjia2");
			game.addVideo("storage", player, ["bingjia", get.cardInfo(cards[0]), "card"]);
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	bingjia2: {
		mark: true,
		trigger: { target: "useCardToBegin" },
		forced: true,
		filter(event, player) {
			return event.player !== player && get.suit(event.card) === get.suit(player.storage.bingjia);
		},
		content() {
			"step 0";
			player.showCards([player.storage.bingjia], get.translation(player) + "发动了【冰甲】");
			player.removeSkill("bingjia2");
			game.addVideo("storage", player, ["bingjia", null]);
			"step 1";
			player.storage.bingjia.discard();
			delete player.storage.bingjia;
			player.changeHujia();
			player.addTempSkill("mianyi");
		},
		intro: {
			mark(dialog, content, player) {
				if (player === game.me || player.isUnderControl()) {
					dialog.add([player.storage.bingjia]);
				} else {
					return "已发动冰甲";
				}
			},
			content(content, player) {
				if (player === game.me || player.isUnderControl()) {
					return get.translation(player.storage.bingjia);
				}
				return "已发动冰甲";
			},
		},
	},
	bianxing2: {},
	zuzhou: {
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			if (!player.countCards("h", { suit: "spade" })) {
				return false;
			}
			return !game.hasPlayer(function (current) {
				return current.hasJudge("fulei");
			});
		},
		forced: true,
		check() {
			return false;
		},
		content() {
			var card = game.createCard("fulei");
			player.addJudge(card);
			player.$draw(card);
			game.delay(2);
		},
		ai: {
			threaten: 1.5,
		},
		group: "zuzhou_remove",
		subSkill: {
			remove: {
				trigger: { global: "damageEnd" },
				filter(event, player) {
					return event.card && event.card.name === "fulei";
				},
				forced: true,
				content() {
					trigger.card.expired = true;
					game.log(trigger.card, "被移去");
				},
			},
		},
	},
	mdzhoufu: {
		enable: "phaseUse",
		filterCard: { color: "black" },
		filter(event, player) {
			return player.countCards("h", { color: "black" }) > 0;
		},
		filterTarget(card, player, target) {
			return player !== target && !target.hasSkill("mdzhoufu2");
		},
		prepare: "throw",
		discard: false,
		content() {
			target.$gain2(cards);
			target.storage.mdzhoufu2 = cards[0];
			target.addSkill("mdzhoufu2");
			target.storage.mdzhoufu3 = player;
			game.addVideo("storage", target, ["mdzhoufu2", get.cardInfo(cards[0]), "card"]);
			ui.special.appendChild(cards[0]);
		},
		check(card) {
			if (get.suit(card) === "spade") {
				return 6 - get.value(card);
			}
			return -1;
		},
		ai: {
			tag: {
				rejudge: 0.1,
			},
			threaten: 1.5,
			expose: 0.1,
			order: 10,
			result: {
				target: -1,
			},
		},
	},
	mdzhoufu2: {
		trigger: { player: "judge" },
		forced: true,
		priority: 10,
		mark: "card",
		content() {
			"step 0";
			player.storage.mdzhoufu2.discard();
			player.$throw(player.storage.mdzhoufu2);
			if (player.storage.mdzhoufu2.clone) {
				player.storage.mdzhoufu2.clone.classList.add("thrownhighlight");
				game.addVideo("highlightnode", player, get.cardInfo(player.storage.mdzhoufu2));
			}
			if (player.storage.mdzhoufu3.isIn()) {
				player.storage.mdzhoufu3.line(player, "green");
				player.storage.mdzhoufu3.gain(player.judging[0]);
				player.storage.mdzhoufu3.$gain2(player.judging[0]);
			} else {
				player.judging[0].discard();
				game.delay(1.5);
			}
			player.removeSkill("mdzhoufu2");
			"step 1";
			player.judging[0] = player.storage.mdzhoufu2;
			trigger.position.appendChild(player.storage.mdzhoufu2);
			game.log(player, "的判定牌改为", player.storage.mdzhoufu2);
			delete player.storage.mdzhoufu2;
			delete player.storage.mdzhoufu3;
		},
		intro: {
			content: "card",
		},
	},
	xianzhi: {
		trigger: { global: "judgeBegin" },
		frequent: true,
		filter() {
			return ui.cardPile.childNodes.length > 1;
		},
		check() {
			return false;
		},
		content() {
			"step 0";
			var str = "";
			if (trigger.card) {
				str = get.translation(trigger.card.viewAs || trigger.card.name);
			} else if (trigger.skill) {
				str = get.translation(trigger.skill);
			} else {
				str = get.translation(trigger.parent.name);
			}

			var cards = [ui.cardPile.childNodes[0], ui.cardPile.childNodes[1]];
			var att = get.attitude(player, trigger.player);
			var delta = trigger.judge(ui.cardPile.childNodes[1]) - trigger.judge(ui.cardPile.childNodes[0]);
			player.chooseControl("调换顺序", "cancel2", ui.create.dialog("先知：" + get.translation(trigger.player) + "的" + str + "判定", cards, "hidden")).ai = function () {
				if (att * delta > 0) {
					return "调换顺序";
				} else {
					return "cancel2";
				}
			};
			"step 1";
			if (result.control === "调换顺序") {
				var card = ui.cardPile.firstChild;
				ui.cardPile.removeChild(card);
				ui.cardPile.insertBefore(card, ui.cardPile.firstChild.nextSibling);
				game.log(player, "调换了牌堆顶两张牌的顺序");
			}
		},
		ai: {
			expose: 0.1,
			tag: {
				rejudge: 0.5,
			},
		},
	},
	jingxiang: {
		trigger: { player: "chooseToRespondBegin" },
		direct: true,
		usable: 1,
		filter(event, player) {
			if (event.responded) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current !== player && current.countCards("h");
			});
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("jingxiang"), function (card, player, target) {
				if (target === player) {
					return false;
				}
				var nh = target.countCards("h");
				if (nh === 0) {
					return false;
				}
				return true;
			}).ai = function (target) {
				return 1 - get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("jingxiang", target);
				event.target = target;
				var cards = target.getCards("h");
				player.chooseCardButton("选择" + get.translation(target) + "的一张卡手牌打出", cards).filterButton = function (button) {
					return trigger.filterCard(button.link);
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				game.log(player, "使用了", event.target, "的手牌");
				event.target.$throw(result.links);
				event.target.lose(result.links);
				trigger.untrigger();
				trigger.animate = false;
				trigger.responded = true;
				result.buttons[0].link.remove();
				trigger.result = { bool: true, card: result.buttons[0].link };
			} else {
				player.storage.counttrigger.jingxiang--;
			}
		},
		ai: {
			respondShan: true,
			effect: {
				target(card) {
					if (get.tag(card, "respondShan")) {
						return 0.4;
					}
					if (get.tag(card, "respondSha")) {
						return 0.4;
					}
				},
			},
		},
	},
	wlianji: {
		trigger: { player: "phaseEnd" },
		frequent: true,
		filter(event, player) {
			return player.countUsed() > player.hp;
		},
		content() {
			player.draw(2);
		},
		init(player) {
			player.storage.jingce = true;
		},
		intro: {
			content(storage, player) {
				if (_status.currentPhase === player) {
					return "已使用" + player.countUsed() + "张牌";
				}
			},
		},
	},
	mengun: {
		trigger: { global: "useCardToBefore" },
		priority: 12,
		filter(event, player) {
			if (event.player === player) {
				return false;
			}
			if (_status.currentPhase !== event.player) {
				return false;
			}
			if (event.player.hasSkill("mengun2")) {
				return false;
			}
			if (get.itemtype(event.card) !== "card") {
				return false;
			}
			if (!player.countCards("h", { suit: get.suit(event.card) })) {
				return false;
			}
			return get.type(event.card) === "basic";
		},
		direct: true,
		content() {
			"step 0";
			var val = get.value(trigger.card);
			var suit = get.suit(trigger.card);
			var eff = get.effect(trigger.target, trigger.card, trigger.player, player);
			var next = player.chooseToDiscard("是否对" + get.translation(trigger.player) + "使用的" + get.translation(trigger.card) + "发动【闷棍】？", function (card) {
				return get.suit(card) === suit;
			});
			next.logSkill = ["mengun", trigger.player];
			next.ai = function (card) {
				if (eff >= 0) {
					return 0;
				}
				return Math.min(8, 1 + val) - get.value(card);
			};
			"step 1";
			if (result.bool) {
				game.log(trigger.player, "收回了", trigger.cards);
				trigger.cancel();
				game.delay();
			} else {
				event.finish();
			}
			"step 2";
			trigger.player.$gain2(trigger.cards);
			trigger.player.gain(trigger.cards);
			trigger.player.storage.mengun2 = trigger.cards[0];
			game.addVideo("storage", player, ["mengun2", get.cardInfo(trigger.cards[0]), "card"]);
			trigger.player.addTempSkill("mengun2", "phaseEnd");
		},
		ai: {
			expose: 0.2,
		},
	},
	mengun2: {
		mark: "card",
		mod: {
			cardEnabled(card, player) {
				if (card === player.storage.mengun2) {
					return false;
				}
			},
		},
		intro: {
			content: "card",
			onunmark(storage, player) {
				delete player.storage.mengun2;
			},
		},
	},
	jianren: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getEquip(1) ? true : false;
		},
		filterCard(card, player) {
			return card === player.getEquip(1);
		},
		position: "e",
		filterTarget(card, player, target) {
			return target !== player;
		},
		selectCard: -1,
		selectTarget: -1,
		content() {
			target.damage();
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target);
				},
			},
		},
	},
	jihuo: {
		trigger: { player: "phaseAfter" },
		filter(event, player) {
			return player.countCards("h") > 0 && event.skill !== "jihuo";
		},
		direct: true,
		priority: -50,
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("jihuo"));
			next.ai = get.unuseful2;
			next.logSkill = "jihuo";
			"step 1";
			if (result.bool) {
				player.insertPhase();
			}
		},
		ai: {
			threaten: 1.2,
		},
	},
	tuteng_s: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		filter(event, player) {
			var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
			for (var i = 0; i < player.skills.length; i++) {
				rand.remove(player.skills[i]);
				if (rand.length === 0) {
					return false;
				}
			}
			return true;
		},
		content() {
			var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
			for (var i = 0; i < player.skills.length; i++) {
				rand.remove(player.skills[i]);
			}
			if (rand.length) {
				player.addSkill(rand.randomGet());
			}
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, 1];
						}
						return 1.2;
					}
				},
			},
			threaten: 1.3,
		},
		group: "tuteng_lose",
	},
	s_tuteng: {
		trigger: { player: "phaseBegin" },
		forced: true,
		unique: true,
		content() {
			var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4", "tuteng5", "tuteng6", "tuteng7", "tuteng8"];
			var rand2 = [];
			for (var i = 0; i < rand.length; i++) {
				if (player.skills.includes(rand[i])) {
					rand2.push(rand[i]);
					rand.splice(i--, 1);
				}
			}
			if (rand2.length >= 3) {
				player.removeSkill(rand2.randomGet());
			}
			player.addSkill(rand.randomGet("tuteng1", "tuteng3"));
		},
		ai: {
			threaten: 2,
		},
	},
	tuteng: {
		enable: "phaseUse",
		usable: 1,
		unique: true,
		direct: true,
		delay: 0,
		init() {
			for (var i = 1; i <= 8; i++) {
				lib.translate["tuteng" + i + "_info"] = lib.skill["tuteng" + i].intro.content;
			}
		},
		position: "he",
		filter(event, player) {
			if (player.storage.tuteng_awake) {
				return true;
			}
			var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
			for (var i = 0; i < rand.length; i++) {
				if (!player.hasSkill(rand[i])) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
			var rand2 = [];
			var randx = [];
			var rand2x = [];
			if (player.storage.tuteng_awake) {
				rand = rand.concat(["tuteng5", "tuteng6", "tuteng7", "tuteng8"]);
			}
			for (var i = 0; i < player.skills.length; i++) {
				if (rand.includes(player.skills[i])) {
					rand.remove(player.skills[i]);
					rand2.push(player.skills[i]);
				}
			}
			if (!player.storage.tuteng_awake) {
				player.addSkill(rand.randomGet());
				game.delay();
				event.finish();
				return;
			}
			if (rand.length) {
				if (event.isMine() && (rand.length > 1 || rand2.length >= 4)) {
					var dialog = ui.create.dialog();
					for (var i = 0; i < rand.length; i++) {
						randx[i] = ["", "", rand[i]];
					}
					for (var i = 0; i < rand2.length; i++) {
						rand2x[i] = ["", "", rand2[i]];
					}
					dialog.add("选择一个图腾");
					dialog.add([randx, "vcard"]);
					if (rand2.length >= 4) {
						dialog.add("替换一个已有图腾");
						dialog.add([rand2x, "vcard"]);
						player.chooseButton(dialog, 2, true).filterButton = function (button) {
							if (ui.selected.buttons.length) {
								var current = ui.selected.buttons[0].name;
								if (rand.includes(current)) {
									return rand2.includes(button.name);
								} else {
									return rand.includes(button.name);
								}
							}
							return true;
						};
					} else {
						player.chooseButton(dialog, true);
					}
					for (var i = 0; i < dialog.buttons.length; i++) {
						var item = dialog.buttons[i];
						if (i === 4) {
							item.parentNode.insertBefore(document.createElement("br"), item);
						}
						item.style.zoom = 0.7;
					}
				} else {
					if (player.hp < player.maxHp && rand.includes("tuteng1")) {
						player.addSkill("tuteng1");
					} else {
						if (rand.length > 1) {
							rand.remove("tuteng1");
						}
						player.addSkill(rand.randomGet());
					}
					game.delay();
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 1";
			if (result.buttons.length === 1) {
				player.addSkill(result.buttons[0].name);
			} else if (result.buttons.length === 2) {
				var skill1 = result.buttons[0].name;
				var skill2 = result.buttons[1].name;
				if (player.hasSkill(skill1)) {
					player.removeSkill(skill1);
					player.addSkill(skill2);
				} else {
					player.removeSkill(skill2);
					player.addSkill(skill1);
				}
			}
		},
		ai: {
			order: 11,
			result: {
				player: 1,
			},
			effect: {
				player(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return;
						}
						return 1.2;
					}
				},
			},
			threaten: 2,
		},
		group: "tuteng_lose",
	},
	zuling: {
		skillAnimation: "epic",
		animationColor: "thunder",
		trigger: { player: "phaseBegin" },
		forced: true,
		juexingji: true,
		unique: true,
		filter(event, player) {
			if (!player.storage.tuteng_awake) {
				var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4", "tuteng5", "tuteng6", "tuteng7", "tuteng8"];
				var num = 0;
				for (var i = 0; i < player.skills.length; i++) {
					if (rand.includes(player.skills[i])) {
						num++;
					}
					if (num >= 3) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			player.storage.tuteng_awake = true;
			player.loseMaxHp();
			player.awakenSkill(event.name);
		},
	},
	huanfeng: {
		skillAnimation: "epic",
		animationColor: "thunder",
		trigger: { player: "phaseBeginStart" },
		forced: true,
		unique: true,
		filter(event, player) {
			var skills = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
			for (var i = 0; i < skills.length; i++) {
				if (!player.hasSkill(skills[i])) {
					return false;
				}
			}
			return true;
		},
		content() {
			player.removeSkill("tuteng1");
			player.removeSkill("tuteng2");
			player.removeSkill("tuteng3");
			player.removeSkill("tuteng4");
			player.storage.huanfeng_end = player.addSubPlayer({
				name: "hs_alakir",
				hp: 3,
				maxHp: 3,
				skills: lib.character.hs_alakir[3],
				hs: get.cards(4),
			});
			player.callSubPlayer(player.storage.huanfeng_end);
		},
		subSkill: {
			end: {
				temp: true,
				vanish: true,
				trigger: { player: "phaseEnd" },
				silent: true,
				filter(event, player) {
					return player.storage.huanfeng_end;
				},
				content() {
					player.insertPhase();
					delete player.storage.huanfeng_end;
				},
			},
		},
	},
	tuteng_h: {
		mod: {
			maxHandcard(player, num) {
				return num - 1;
			},
		},
	},
	tuteng_lose: {
		trigger: { player: "damageEnd" },
		forced: true,
		popup: false,
		filter(event, player) {
			var tuteng = ["tuteng1", "tuteng2", "tuteng3", "tuteng4", "tuteng5", "tuteng6", "tuteng7", "tuteng8"];
			for (var i = 0; i < player.skills.length; i++) {
				if (tuteng.includes(player.skills[i])) {
					return true;
				}
			}
			return false;
		},
		content() {
			var tuteng = ["tuteng1", "tuteng2", "tuteng3", "tuteng4", "tuteng5", "tuteng6", "tuteng7", "tuteng8"];
			var rand = [];
			for (var i = 0; i < player.skills.length; i++) {
				if (tuteng.includes(player.skills[i])) {
					rand.push(player.skills[i]);
				}
			}
			if (rand.length) {
				player.removeSkill(rand.randomGet());
			}
		},
	},
	tuteng1: {
		mark: "image",
		nopop: true,
		intro: {
			content: "结束阶段，你回复1点体力",
		},
		trigger: { player: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		content() {
			player.recover();
		},
	},
	tuteng2: {
		mark: "image",
		nopop: true,
		intro: {
			content: "每当你造成一次伤害，你摸一张牌",
		},
		trigger: { source: "damageAfter" },
		forced: true,
		content() {
			player.draw();
		},
	},
	tuteng3: {
		mark: "image",
		nopop: true,
		intro: {
			content: "你受到下一次伤害时，令伤害-1，然后失去此图腾",
		},
		trigger: { player: "damageBegin" },
		forced: true,
		filter(event) {
			return event.num > 0;
		},
		content() {
			trigger.num--;
			player.removeSkill("tuteng3");
		},
	},
	tuteng4: {
		mark: "image",
		nopop: true,
		intro: {
			content: "在你的回合内，你的锦囊牌造成的首次伤害+1",
		},
		trigger: { source: "damageBegin" },
		forced: true,
		usable: 1,
		filter(event, player) {
			return _status.currentPhase === player && event.card && get.type(event.card) === "trick" && event.notLink();
		},
		content() {
			trigger.num++;
		},
	},
	tuteng5: {
		mark: "image",
		nopop: true,
		intro: {
			content: "结束阶段，你摸一张牌",
		},
		trigger: { player: "phaseEnd" },
		forced: true,
		content() {
			player.draw();
		},
	},
	tuteng6: {
		mark: "image",
		nopop: true,
		intro: {
			content: "在你的回合内，你的杀造成的首次伤害+1",
		},
		trigger: { source: "damageBegin" },
		forced: true,
		filter(event, player) {
			return _status.currentPhase === player && event.card && event.card.name === "sha" && event.notLink();
		},
		usable: 1,
		content() {
			trigger.num++;
		},
	},
	tuteng7: {
		mark: "image",
		nopop: true,
		intro: {
			content: "结束阶段，你令一名其他角色回复1点体力",
		},
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current !== player && current.isDamaged();
			});
		},
		content() {
			"step 0";
			player.chooseTarget("活力图腾：令一名其他角色回复1点体力", function (card, player, target) {
				return target !== player && target.hp < target.maxHp;
			}).ai = function (target) {
				return get.recoverEffect(target, player, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("tuteng7", result.targets[0]);
				result.targets[0].recover();
			}
		},
	},
	tuteng8: {
		mark: "image",
		nopop: true,
		intro: {
			content: "进攻距离+1",
		},
		mod: {
			globalFrom(from, to, distance) {
				return distance - 1;
			},
		},
	},
	hongxi: {
		trigger: { global: "dieAfter" },
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		forced: true,
		content() {
			player.recover(player.maxHp - player.hp);
		},
		ai: {
			threaten: 1.2,
		},
	},
};

export default skill;
