import { lib, game, ui, get, ai, _status } from "noname";

/** @type {Record<string, Skill>} */
export default {
	gz_xiongsuan: {
		audio: "xiongsuan",
		enable: "phaseUse",
		filter(_event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		filterTarget(_card, player, target) {
			return target.isFriendOf(player);
		},
		check(card) {
			return 7 - get.value(card);
		},
		limited: true,
		async content(event, trigger, player) {
			const { target } = event;

			player.awakenSkill("gz_xiongsuan", undefined);
			await target.damage("nocard");
			await player.draw(3);

			const skills = target.getOriginalSkills();
			const list = skills.filter(skill => lib.skill[skill].limited && target.awakenedSkills.includes(skill));

			/** @type {Partial<Result>} */
			let result;
			if (list.length == 1) {
				result = {
					control: list[0],
				};
			} else if (list.length > 1) {
				result = await player.chooseControl(list).set("prompt", "选择一个限定技在回合结束后重置之").forResult();
			} else {
				return;
			}

			target.storage.gz_xiongsuan_restore = result.control;
			target.addTempSkill("gz_xiongsuan_restore");
		},
		subSkill: {
			restore: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				popup: false,
				charlotte: true,
				onremove: true,
				async content(_event, _trigger, player) {
					player.restoreSkill(player.storage.gz_xiongsuan_restore, undefined);
				},
			},
		},
		ai: {
			order: 4,
			damage: true,
			result: {
				target(player, target) {
					if (target.hp > 1) {
						var skills = target.getOriginalSkills();
						for (var i = 0; i < skills.length; i++) {
							if (lib.skill[skills[i]].limited && target.awakenedSkills.includes(skills[i])) {
								return 8;
							}
						}
					}
					if (target != player) {
						return 0;
					}
					if (get.damageEffect(target, player, player) >= 0) {
						return 10;
					}
					if (target.hp >= 4) {
						return 5;
					}
					if (target.hp == 3) {
						if (
							player.countCards("h") <= 2 &&
							game.hasPlayer(function (current) {
								return current.hp <= 1 && get.attitude(player, current) < 0;
							})
						) {
							return 3;
						}
					}
					return 0;
				},
			},
		},
	},

	fake_yigui: {
		audio: "yigui",
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type == "wuxie" || event.type == "respondShan") {
				return false;
			}
			const storage = player.getStorage("fake_yigui"),
				storage2 = player.getStorage("fake_yigui2");
			if (!storage.length || storage2.length > 1) {
				return false;
			}
			if (event.type == "dying") {
				if (storage2.includes("basic")) {
					return false;
				}
				if (!event.filterCard({ name: "tao" }, player, event) && !event.filterCard({ name: "jiu" }, player, event)) {
					return false;
				}
				// @ts-expect-error 类型系统未来可期
				const target = event.dying;
				return (
					target.identity == "unknown" ||
					target.identity == "ye" ||
					storage.some(i => {
						var group = get.character(i, 1);
						if (group == "ye" || target.identity == group) {
							return true;
						}
						// @ts-expect-error 类型系统未来可期
						var double = get.is.double(i, true);
						// @ts-expect-error 类型系统未来可期
						if (double && double.includes(target.identity)) {
							return true;
						}
					})
				);
			}
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (storage2.includes(get.type(name))) {
						return false;
					}
					return get.type(name) == "basic" || get.type(name) == "trick";
				})
				.some(cardx => {
					const card = { name: cardx[2], nature: cardx[3] },
						info = get.info(card);
					return storage.some(character => {
						if (!lib.filter.filterCard(card, player, event)) {
							return false;
						}
						if (event.filterCard && !event.filterCard(card, player, event)) {
							return false;
						}
						const group = get.character(character, 1),
							// @ts-expect-error 类型系统未来可期
							double = get.is.double(character, true);
						if (info.changeTarget) {
							// @ts-expect-error 类型系统未来可期
							const list = game.filterPlayer(current => player.canUse(card, current));
							for (let i = 0; i < list.length; i++) {
								let giveup = false,
									targets = [list[i]];
								info.changeTarget(player, targets);
								for (let j = 0; j < targets.length; j++) {
									// @ts-expect-error 类型系统未来可期
									if (group != "ye" && targets[j].identity != "unknown" && targets[j].identity != "ye" && targets[j].identity != group && (!double || !double.includes(targets[j].identity))) {
										giveup = true;
										break;
									}
								}
								if (giveup) {
									continue;
								}
								if (!giveup) {
									return true;
								}
							}
							return false;
						}
						return game.hasPlayer(current => {
							// @ts-expect-error 类型系统未来可期
							return event.filterTarget(card, player, current) && (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity)));
						});
					});
				});
		},
		hiddenCard(player, name) {
			if (["shan", "wuxie"].includes(name) || !["basic", "trick"].includes(get.type(name))) {
				return false;
			}
			return lib.inpile.includes(name) && player.getStorage("fake_yigui").length && !player.getStorage("fake_yigui2").includes(get.type2(name));
		},
		chooseButton: {
			select: 2,
			dialog(event, player) {
				var dialog = ui.create.dialog("役鬼", "hidden");
				dialog.add([player.getStorage("fake_yigui"), "character"]);
				const list = get.inpileVCardList(info => {
					const name = info[2];
					if (player.getStorage("fake_yigui2").includes(get.type(name))) {
						return false;
					}
					return get.type(name) == "basic" || get.type(name) == "trick";
				});
				// @ts-expect-error 类型系统未来可期
				dialog.add([list, "vcard"]);
				return dialog;
			},
			filter(button, player) {
				// @ts-expect-error 类型系统未来可期
				var evt = _status.event.getParent("chooseToUse");
				if (!ui.selected.buttons.length) {
					// @ts-expect-error 类型系统未来可期
					if (typeof button.link != "string") {
						return false;
					}
					// @ts-expect-error 类型系统未来可期
					if (evt.type == "dying") {
						// @ts-expect-error 类型系统未来可期
						if (evt.dying.identity == "unknown" || evt.dying.identity == "ye") {
							return true;
						}
						// @ts-expect-error 类型系统未来可期
						var double = get.is.double(button.link, true);
						// @ts-expect-error 类型系统未来可期
						return evt.dying.identity == lib.character[button.link][1] || lib.character[button.link][1] == "ye" || (double && double.includes(evt.dying.identity));
					}
					return true;
				} else {
					// @ts-expect-error 类型系统未来可期
					if (typeof ui.selected.buttons[0].link != "string") {
						return false;
					}
					// @ts-expect-error 类型系统未来可期
					if (typeof button.link != "object") {
						return false;
					}
					// @ts-expect-error 类型系统未来可期
					var name = button.link[2];
					if (player.getStorage("fake_yigui2").includes(get.type(name))) {
						return false;
					}
					var card = { name: name };
					// @ts-expect-error 类型系统未来可期
					if (button.link[3]) {
						card.nature = button.link[3];
					}
					var info = get.info(card);
					// @ts-expect-error 类型系统未来可期
					var group = lib.character[ui.selected.buttons[0].link][1];
					// @ts-expect-error 类型系统未来可期
					var double = get.is.double(ui.selected.buttons[0].link, true);
					// @ts-expect-error 类型系统未来可期
					if (evt.type == "dying") {
						return evt.filterCard(card, player, evt);
					}
					if (!lib.filter.filterCard(card, player, evt)) {
						return false;
					}
					// @ts-expect-error 类型系统未来可期
					else if (evt.filterCard && !evt.filterCard(card, player, evt)) {
						return false;
					}
					if (info.changeTarget) {
						// @ts-expect-error 类型系统未来可期
						var list = game.filterPlayer(function (current) {
							return player.canUse(card, current);
						});
						for (var i = 0; i < list.length; i++) {
							var giveup = false;
							var targets = [list[i]];
							info.changeTarget(player, targets);
							for (var j = 0; j < targets.length; j++) {
								// @ts-expect-error 类型系统未来可期
								if (group != "ye" && targets[j].identity != "unknown" && targets[j].identity != "ye" && targets[j].identity != group && (!double || !double.includes(targets[j].identity))) {
									giveup = true;
									break;
								}
							}
							if (giveup) {
								continue;
							}
							if (giveup == false) {
								return true;
							}
						}
						return false;
					} else {
						return game.hasPlayer(function (current) {
							// @ts-expect-error 类型系统未来可期
							return evt.filterTarget(card, player, current) && (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity)));
						});
					}
				}
			},
			check(button) {
				if (ui.selected.buttons.length) {
					// @ts-expect-error 类型系统未来可期
					var evt = _status.event.getParent("chooseToUse");
					// @ts-expect-error 类型系统未来可期
					var name = button.link[2];
					// @ts-expect-error 类型系统未来可期
					var group = lib.character[ui.selected.buttons[0].link][1];
					// @ts-expect-error 类型系统未来可期
					var double = get.is.double(ui.selected.buttons[0].link, true);
					// @ts-expect-error 类型系统未来可期
					var player = _status.event.player;
					// @ts-expect-error 类型系统未来可期
					if (evt.type == "dying") {
						// @ts-expect-error 类型系统未来可期
						if (evt.dying != player && get.effect(evt.dying, { name: name }, player, player) <= 0) {
							return 0;
						}
						if (name == "jiu") {
							return 2.1;
						}
						return 2;
					}
					if (!["tao", "juedou", "guohe", "shunshou", "wuzhong", "xietianzi", "yuanjiao", "taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) {
						return 0;
					}
					if (["taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) {
						var list = game.filterPlayer(function (current) {
							// @ts-expect-error 类型系统未来可期
							return (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity))) && player.canUse({ name: name }, current);
						});
						var num = 0;
						for (var i = 0; i < list.length; i++) {
							num += get.effect(list[i], { name: name }, player, player);
						}
						if (num <= 0) {
							return 0;
						}
						if (list.length > 1) {
							return (1.7 + Math.random()) * Math.max(num, 1);
						}
					}
				}
				return 1 + Math.random();
			},
			backup(links, player) {
				var name = links[1][2],
					nature = links[1][3] || null;
				var character = links[0],
					group = lib.character[character][1];
				var next = {
					character: character,
					group: group,
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					audio: "yigui",
					viewAs: {
						name: name,
						nature: nature,
						isCard: true,
					},
					filterTarget(card, player, target) {
						var xx = lib.skill.fake_yigui_backup;
						var evt = _status.event;
						var group = xx.group;
						// @ts-expect-error 类型系统未来可期
						var double = get.is.double(xx.character, true);
						var info = get.info(card);
						// @ts-expect-error 类型系统未来可期
						if (!(info.singleCard && ui.selected.targets.length) && group != "ye" && target.identity != "unknown" && target.identity != "ye" && target.identity != group && (!double || !double.includes(target.identity))) {
							return false;
						}
						if (info.changeTarget) {
							var targets = [target];
							info.changeTarget(player, targets);
							for (var i = 0; i < targets.length; i++) {
								// @ts-expect-error 类型系统未来可期
								if (group != "ye" && targets[i].identity != "unknown" && targets[i].identity != "ye" && targets[i].identity != group && (!double || !double.includes(targets[i].identity))) {
									return false;
								}
							}
						}
						// @ts-expect-error 类型系统未来可期
						if (evt._backup && evt._backup.filterTarget) {
							return evt._backup.filterTarget(card, player, target);
						}
						return lib.filter.filterTarget(card, player, target);
					},
					onuse(result, player) {
						var character = lib.skill.fake_yigui_backup.character;
						player.flashAvatar("fake_yigui", character);
						player.unmarkAuto("fake_yigui", [character]);
						// @ts-expect-error 类型系统未来可期
						_status.characterlist.add(character);
						game.log(player, "移去了一张", "#g“魂（" + get.translation(character) + "）”");
						if (!player.storage.fake_yigui2) {
							player.when({ global: "phaseBefore" }).step(async () => delete player.storage.fake_yigui2);
						}
						player.markAuto("fake_yigui2", [get.type(result.card.name)]);
					},
				};
				return next;
			},
			prompt(links, player) {
				var name = links[1][2],
					character = links[0],
					nature = links[1][3];
				return "移除「" + get.translation(character) + "」并视为使用" + (get.translation(nature) || "") + get.translation(name);
			},
		},
		ai: {
			order: () => 1 + 10 * Math.random(),
			result: { player: 1 },
		},
		group: "fake_yigui_init",
		marktext: "魂",
		intro: {
			onunmark(storage) {
				// @ts-expect-error 类型系统未来可期
				_status.characterlist.addArray(storage);
				storage = [];
			},
			mark(dialog, storage, player) {
				if (storage && storage.length) {
					// @ts-expect-error 类型系统未来可期
					if (player.isUnderControl(true)) {
						dialog.addSmall([storage, "character"]);
					} else {
						return "共有" + get.cnNumber(storage.length) + "张“魂”";
					}
				} else {
					return "没有“魂”";
				}
			},
			content(storage) {
				return "共有" + get.cnNumber(storage.length) + "张“魂”";
			},
		},
		gainHun(player, num) {
			// @ts-expect-error 类型系统未来可期
			const list = _status.characterlist.randomGets(num);
			if (list.length) {
				// @ts-expect-error 类型系统未来可期
				_status.characterlist.removeArray(list);
				player.markAuto("fake_yigui", list);
				get.info("rehuashen").drawCharacter(player, list);
				game.log(player, "获得了" + get.cnNumber(list.length) + "张", "#g“魂”");
			}
		},
		subSkill: {
			backup: {},
			init: {
				audio: "fake_yigui",
				trigger: { player: "showCharacterAfter" },
				filter(event, player) {
					// @ts-expect-error 类型系统未来可期
					if (!event.toShow.some(i => get.character(i, 3).includes("fake_yigui"))) {
						return false;
					}
					return (
						game
							.getAllGlobalHistory(
								"everything",
								evt => {
									// @ts-expect-error 类型系统未来可期
									return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fake_yigui"));
								},
								event
							)
							.indexOf(event) == 0
					);
				},
				forced: true,
				locked: false,
				async content(_event, _trigger, player) {
					get.info("fake_yigui").gainHun(player, 2);
				},
			},
		},
	},
	fake_jihun: {
		audio: "jihun",
		inherit: "jihun",
		async content(_event, _trigger, player) {
			get.info("fake_yigui").gainHun(player, 1);
		},
		ai: {
			combo: "fake_yigui",
		},
		group: "fake_jihun_zhiheng",
		subSkill: {
			zhiheng: {
				audio: "jihun",
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter(_event, player) {
					return player.getStorage("fake_yigui").length;
				},
				async cost(event, trigger, player) {
					const { bool, links } = await player.chooseButton([get.prompt("fake_jihun"), '<div class="text center">弃置至多两张“魂”，然后获得等量的“魂”</div>', [player.getStorage("fake_yigui"), "character"]], [1, 2]).set("ai", button => {
						const getNum = character => {
							return (
								// @ts-expect-error 类型系统未来可期
								game.countPlayer(target => {
									const group = get.character(character, 1);
									if (group == "ye" || target.identity == group) {
										return true;
									}
									// @ts-expect-error 类型系统未来可期
									const double = get.is.double(character, true);
									// @ts-expect-error 类型系统未来可期
									if (double && double.includes(target.identity)) {
										return true;
									}
								}) + 1
							);
						};
						// @ts-expect-error 类型系统未来可期
						return game.countPlayer() - getNum(button.link);
					}).forResult();
					event.result = { bool: bool, cost_data: links };
				},
				async content(event, trigger, player) {
					player.unmarkAuto("fake_yigui", event.cost_data);
					// @ts-expect-error 类型系统未来可期
					_status.characterlist.addArray(event.cost_data);
					game.log(player, "移除了" + get.cnNumber(event.cost_data.length) + "张", "#g“魂”");
					get.info("fake_yigui").gainHun(player, event.cost_data.length);
				},
			},
		},
	},

	gz_yuejian: {
		audio: "yuejian",
		trigger: {
			global: "phaseDiscardBegin",
		},
		forced: true,
		preHidden: true,
		filter(event, player) {
			if (player.isFriendOf(event.player)) {
				return (
					event.player.getHistory("useCard", function (evt) {
						if (evt.targets) {
							var targets = evt.targets.slice(0);
							while (targets.includes(event.player)) {
								targets.remove(event.player);
							}
							return targets.length != 0;
						}
						return false;
					}).length == 0
				);
			}
			return false;
		},
		logTarget: "player",
		async content(_event, trigger, _player) {
			trigger.player.addTempSkill("gz_yuejian_num");
		},
		subSkill: {
			num: {
				mod: {
					maxHandcardBase(player, _num) {
						return player.maxHp;
					},
				},
			},
		},
	},

	gz_qice: {
		audio: "qice",
		usable: 1,
		enable: "phaseUse",
		filter(_event, player) {
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var i = 0; i < hs.length; i++) {
				// @ts-expect-error 类型系统未来可期
				var mod2 = game.checkMod(hs[i], player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) {
					return false;
				}
			}
			return true;
		},
		chooseButton: {
			dialog() {
				var list = lib.inpile;
				var list2 = [];
				for (var i = 0; i < list.length; i++) {
					if (list[i] != "wuxie" && get.type(list[i]) == "trick") {
						list2.push(["锦囊", "", list[i]]);
					}
				}
				return ui.create.dialog(get.translation("gz_qice"), [list2, "vcard"]);
			},
			filter(button, player) {
				// @ts-expect-error 类型系统未来可期
				var card = { name: button.link[2] };
				var info = get.info(card);
				var num = player.countCards("h");
				//if(get.tag(card,'multitarget')&&get.select(info.selectTarget)[1]==-1){
				if (get.select(info.selectTarget)[1] == -1) {
					if (
						// @ts-expect-error 类型系统未来可期
						game.countPlayer(function (current) {
							return player.canUse(card, current);
						}) > num
					) {
						return false;
					}
				} else if (info.changeTarget) {
					var giveup = true;
					// @ts-expect-error 类型系统未来可期
					var list = game.filterPlayer(function (current) {
						return player.canUse(card, current);
					});
					for (var i = 0; i < list.length; i++) {
						var targets = [list[i]];
						info.changeTarget(player, targets);
						if (targets.length <= num) {
							giveup = false;
							break;
						}
					}
					if (giveup) {
						return false;
					}
				}
				// @ts-expect-error 类型系统未来可期
				return lib.filter.filterCard(card, player, _status.event.getParent());
			},
			check(button) {
				// @ts-expect-error 类型系统未来可期
				if (["chiling", "xietianzi", "tiesuo", "lulitongxin", "diaohulishan", "jiedao"].includes(button.link[2])) {
					return 0;
				}
				// @ts-expect-error 类型系统未来可期
				return _status.event.player.getUseValue(button.link[2]);
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "qice",
					selectCard: -1,
					position: "h",
					selectTarget() {
						// @ts-expect-error 类型系统未来可期
						var select = get.select(get.info(get.card()).selectTarget);
						// @ts-expect-error 类型系统未来可期
						var nh = _status.event.player.countCards("h");
						if (select[1] > nh) {
							select[1] = nh;
						}
						return select;
					},
					filterTarget(card, player, target) {
						var info = get.info(card);
						if (info.changeTarget) {
							var targets = [target];
							info.changeTarget(player, targets);
							if (targets.length > player.countCards("h")) {
								return false;
							}
						}
						return lib.filter.filterTarget(card, player, target);
					},
					popname: true,
					viewAs: { name: links[0][2] },
					ai1() {
						return 1;
					},
				};
			},
			prompt(links, player) {
				return "将全部手牌当作" + get.translation(links[0][2]) + "使用";
			},
		},
		group: "gz_qice_change",
		subSkill: {
			change: {
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					return event.skill == "gz_qice_backup";
				},
				silent: true,
				async content(event, _trigger, player) {
					await player.mayChangeVice(undefined, undefined);
					event.skill = "gz_qice";
					event.trigger("skillAfter");
				},
			},
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					var num = 0;
					var cards = player.getCards("h");
					if (cards.length >= 3 && player.hp >= 3) {
						return 0;
					}
					for (var i = 0; i < cards.length; i++) {
						num += Math.max(0, get.value(cards[i], player, "raw"));
					}
					return 16 - num;
				},
			},
			threaten: 1.6,
		},
	},

	gz_diaodu_best: {
		audio: "diaodu",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => {
				if (!current.isFriendOf(player)) {
					return false;
				}
				return current.countGainableCards(player, "e") > 0;
			});
		},
		frequent: true,
		preHidden: true,
		async cost(event, trigger, player) {
			const next = player.chooseTarget(get.prompt2("gz_diaodu_best"), (_card, player, current) => current.isFriendOf(player) && current.countGainableCards(player, "e") > 0);

			next.set("ai", target => {
				let num = 0;

				if (target.hasSkill("gz_xiaoji")) {
					num += 2.5;
				}
				if (target.isDamaged() && target.getEquip("baiyin")) {
					num += 2.5;
				}
				if (target.hasSkill("xuanlve")) {
					num += 2;
				}

				return num;
			});

			next.setHiddenSkill("gz_diaodu_best");

			event.result = await next.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player.gainPlayerCard(target, "e", true).forResult();

			if (!result.bool) {
				return;
			}

			const card = result.cards?.[0];
			if (!card || !player.getCards("h").includes(card)) {
				return;
			}

			const next = player.chooseTarget(`是否将${get.translation(card)}交给一名其他角色？`);
			next.set("filterTarget", (_card, player, current) => {
				const event = get.event();
				return current !== player && current !== event.target && player.isFriendOf(current);
			});
			next.set("target", target);

			const result2 = await next.forResult();

			if (result2.bool && result2.targets?.length) {
				const target2 = result2.targets[0];
				player.line(target2, "green");
				await player.give(card, target2);
			}
		},
		group: "gz_diaodu_best_use",
		subSkill: {
			use: {
				audio: "diaodu",
				trigger: {
					global: "useCard",
				},
				filter(event, player) {
					if (get.type(event.card) !== "equip") {
						return false;
					}
					if (!event.player.isIn()) {
						return false;
					}
					if (!event.player.isFriendOf(player)) {
						return false;
					}
					return player === event.player || player.hasSkill("gz_diaodu_best");
				},
				logTarget: "player",
				async cost(event, trigger, player) {
					const next = trigger.player.chooseBool(get.prompt("gz_diaodu_best"), "摸一张牌");

					if (player.hasSkill("gz_diaodu_best")) {
						next.set("frequentSkill", "gz_diaodu_best");
					}
					if (player === trigger.player) {
						next.setHiddenSkill("gz_diaodu_best");
					}

					event.result = await next.forResult();
				},
				async content(event, trigger, player) {
					trigger.player.draw("nodelay");
				},
			},
		},
	},
	gz_diancai: {
		audio: "diancai",
		trigger: {
			global: "phaseUseEnd",
		},
		preHidden: true,
		filter(event, player) {
			// @ts-expect-error 类型系统未来可期
			if (_status.currentPhase === player) {
				return false;
			}

			let num = 0;

			player.getHistory("lose", evt => {
				// @ts-expect-error 类型系统未来可期
				if (evt.cards2 && evt.getParent("phaseUse") === event) {
					// @ts-expect-error 类型系统未来可期
					num += evt.cards2.length;
				}
				return false;
			});

			return num >= player.hp;
		},
		async content(event, trigger, player) {
			const num = player.maxHp - player.countCards("h");
			if (num > 0) {
				await player.draw(num);
			}

			await player.mayChangeVice(undefined, undefined);
		},
	},

	gz_sanyao: {
		audio: "sanyao",
		inherit: "sanyao",
		filterTarget(card, player, target) {
			return target.hp > player.hp || target.countCards("h") > player.countCards("h");
		},
	},
	gz_zhiman: {
		audio: "zhiman",
		inherit: "zhiman",
		preHidden: true,
		async content(_event, trigger, player) {
			if (trigger.player.countGainableCards(player, "ej")) {
				await player.gainPlayerCard(trigger.player, "ej", true);
			}
			trigger.cancel(undefined, undefined, undefined);

			if (player.isFriendOf(trigger.player)) {
				await trigger.player.mayChangeVice();
			}
		},
	},
};
