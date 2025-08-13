import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//魏武帝
	junkguixin: {
		forbid: ["guozhan"],
		init() {
			if (!_status.junkguixin) {
				_status.junkguixin = [];
				if (!_status.characterlist) {
					game.initCharacterList();
				}
				for (const name of _status.characterlist) {
					if (!lib.character[name][3]) {
						continue;
					}
					_status.junkguixin.addArray(
						lib.character[name][3].filter(skill => {
							var info = get.info(skill);
							return info && info.zhuSkill && (!info.ai || !info.ai.combo);
						})
					);
				}
			}
		},
		audio: "guixin",
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			var controls = ["获得技能", "修改势力", "cancel2"];
			if (!_status.junkguixin.some(skill => !player.hasSkill(skill, null, false, false))) {
				controls.shift();
			}
			player
				.chooseControl(controls)
				.set("prompt", get.prompt2("junkguixin"))
				.set("ai", () => (_status.event.controls.length == 3 ? "获得技能" : "cancel2"));
			"step 1";
			if (result.control != "cancel2") {
				var next = game.createEvent("junkguixinx");
				next.player = player;
				next.setContent(lib.skill.junkguixin["content_" + result.control]);
			}
		},
		content_获得技能() {
			"step 0";
			var list = _status.junkguixin.slice().filter(skill => !player.hasSkill(skill, null, false, false));
			if (!list.length) {
				event.finish();
				return;
			}
			list = list.map(skill => {
				return [skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"];
			});
			player.chooseButton(["归心：选择获得一个主公技", [list, "textbutton"]], true).set("ai", button => 1 + Math.random());
			"step 1";
			if (result.bool) {
				player.logSkill("junkguixin");
				player.addSkills(result.links[0]);
			}
		},
		content_修改势力() {
			"step 0";
			player.chooseTarget("请选择【归心】的目标", "更改一名其他角色的势力", lib.filter.notMe, true).set("ai", target => 1 + Math.random());
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("junkguixin", target);
				var list = lib.group.slice();
				list.removeArray(["shen", target.group]);
				player
					.chooseControl(list)
					.set("prompt", "请选择" + get.translation(target) + "变更的势力")
					.set("ai", () => _status.event.controls.randomGet());
			} else {
				event.finish();
			}
			"step 2";
			if (result.control) {
				player.popup(get.translation(result.control + "2"));
				target.changeGroup(result.control);
			}
		},
	},
	oldqinqing: {
		audio: "qinqing",
		mode: ["identity", "versus"],
		available(mode) {
			if (mode == "versus" && _status.mode != "four") {
				return false;
			}
			if (mode == "identity" && _status.mode == "purple") {
				return false;
			}
		},
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			var zhu = get.zhu(player);
			if (!zhu || !zhu.isZhu) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != zhu && current != player && current.inRange(zhu);
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("dcqinqing"), function (card, player, target) {
					var zhu = get.zhu(player);
					return target != player && target.inRange(zhu);
				})
				.set("ai", function (target) {
					var zhu = get.zhu(player);
					var he = target.countCards("he");
					if (get.attitude(_status.event.player, target) > 0) {
						if (target.countCards("h") > zhu.countCards("h") + 1) {
							return 0.1;
						}
					} else {
						if (he > zhu.countCards("h") + 1) {
							return 2;
						}
						if (he > 0) {
							return 1;
						}
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("dcqinqing", target);
				if (target.countDiscardableCards(player, "he")) {
					player.discardPlayerCard(target, "he", true);
				}
				target.draw();
			} else {
				event.finish();
			}
			"step 2";
			var zhu = get.zhu(player);
			if (zhu && zhu.isIn()) {
				if (target.countCards("h") > zhu.countCards("h")) {
					player.draw();
				}
			}
		},
	},
	oldhuisheng: {
		audio: "huisheng",
		trigger: { player: "damageBegin4" },
		direct: true,
		filter(event, player) {
			if (!player.countCards("he")) {
				return false;
			}
			if (!event.source || event.source == player || !event.source.isIn()) {
				return false;
			}
			if (player.storage.oldhuisheng && player.storage.oldhuisheng.includes(event.source)) {
				return false;
			}
			return true;
		},
		init(player) {
			if (player.storage.oldhuisheng) {
				player.storage.oldhuisheng = [];
			}
		},
		content() {
			"step 0";
			if (!player.storage.oldhuisheng) {
				player.storage.oldhuisheng = [];
			}
			player.storage.oldhuisheng.push(trigger.source);
			var att = get.attitude(player, trigger.source) > 0;
			var goon = false;
			if (player.hp == 1) {
				goon = true;
			} else {
				var he = player.getCards("he");
				var num = 0;
				for (var i = 0; i < he.length; i++) {
					if (get.value(he[i]) < 8) {
						num++;
						if (num >= 2) {
							goon = true;
							break;
						}
					}
				}
			}
			player
				.chooseCard("he", [1, player.countCards("he")], get.prompt2("oldhuisheng", trigger.source))
				.set("ai", function (card) {
					if (_status.event.att) {
						return 10 - get.value(card);
					}
					if (_status.event.goon) {
						return 8 - get.value(card);
					}
					if (!ui.selected.cards.length) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("goon", goon)
				.set("att", att);
			"step 1";
			if (result.bool) {
				player.logSkill("oldhuisheng", trigger.source);
				game.delay();
				event.num = result.cards.length;
				var goon = false;
				if (event.num > 2 || get.attitude(trigger.source, player) >= 0) {
					goon = true;
				}
				var forced = false;
				var str = "获得其中一张牌并防止伤害";
				if (trigger.source.countCards("he") < event.num) {
					forced = true;
				} else {
					str += "，或取消并弃置" + get.cnNumber(result.cards.length) + "张牌";
				}
				trigger.source
					.chooseButton([str, result.cards], forced)
					.set("ai", function (button) {
						if (_status.event.goon) {
							return get.value(button.link);
						}
						return get.value(button.link) - 8;
					})
					.set("goon", goon);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = result.links[0];
				trigger.source.gain(card, player, "giveAuto", "bySelf");
				trigger.cancel();
			} else {
				trigger.source.chooseToDiscard(event.num, true, "he");
			}
		},
	},
	oldzishou: {
		audio: "zishou",
		audioname: ["re_liubiao"],
		trigger: { player: "phaseDrawBegin2" },
		check(event, player) {
			return (player.countCards("h") <= 2 && player.getDamagedHp() >= 2) || player.skipList.includes("phaseUse");
		},
		filter(event, player) {
			return !event.numFixed && player.isDamaged();
		},
		content() {
			trigger.num += player.getDamagedHp();
			player.skip("phaseUse");
		},
		ai: {
			threaten: 1.5,
		},
	},
	oldgongji: {
		audio: "gongji",
		enable: ["chooseToUse", "chooseToRespond"],
		locked: false,
		filterCard: { type: "equip" },
		position: "hes",
		viewAs: {
			name: "sha",
			storage: { oldgongji: true },
		},
		viewAsFilter(player) {
			if (!player.countCards("hes", { type: "equip" })) {
				return false;
			}
		},
		prompt: "将一张装备牌当无距离限制的【杀】使用或打出",
		check(card) {
			var val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		mod: {
			targetInRange(card) {
				if (card.storage && card.storage.oldgongji) {
					return true;
				}
			},
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (!player.countCards("hes", { type: "equip" })) {
					return false;
				}
			},
		},
	},
	oldjiefan: {
		audio: "jiefan",
		trigger: { player: "chooseToUseBegin" },
		filter(event, player) {
			return event.type == "dying" && _status.currentPhase !== player;
		},
		direct: true,
		clearTime: true,
		content() {
			const list = [event.name, trigger.dying];
			player
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, get.prompt2(...list))
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.currentPhase && !ui.selected.targets.includes(_status.currentPhase)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("logSkill", list)
				.set("oncard", function () {
					_status.event.player.addTempSkill("oldjiefan_recover");
				})
				.set("custom", {
					add: {},
					replace: {
						window: () => {
							ui.click.cancel();
						},
					},
				});
		},
		ai: {
			save: true,
			order: 3,
			result: { player: 1 },
		},
		subSkill: {
			recover: {
				// audio:'jiefan',
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return event.getParent(4).name == "oldjiefan";
				},
				forced: true,
				popup: false,
				charlotte: true,
				content() {
					trigger.cancel();
					var evt = event.getParent("_save");
					var card = { name: "tao", isCard: true };
					if (evt && evt.dying && player.canUse(card, evt.dying)) {
						player.useCard(card, evt.dying, "oldjiefan_recover");
					}
				},
			},
		},
	},
	oldmingjian: {
		audio: "mingjian",
		trigger: { player: "phaseZhunbeiBefore" },
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "跳过出牌阶段并将所有手牌交给一名其他角色，你结束此回合，然后其于此回合后获得一个额外的出牌阶段", lib.filter.notMe)
				.set("ai", target => {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (target.hasSkillTag("nogain")) {
						return 0.01 * att;
					}
					if (player.countCards("h") == player.countCards("h", "du")) {
						return -att;
					}
					if (target.hasJudge("lebu")) {
						att *= 1.25;
					}
					if (get.attitude(player, target) > 3) {
						var basis = get.threaten(target) * att;
						if (
							player == get.zhu(player) &&
							player.hp <= 2 &&
							player.countCards("h", "shan") &&
							!game.hasPlayer(function (current) {
								return get.attitude(current, player) > 3 && current.countCards("h", "tao") > 0;
							})
						) {
							return 0;
						}
						if (target.countCards("h") + player.countCards("h") > target.hp + 2) {
							return basis * 0.8;
						}
						return basis;
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(player.getCards("h"), target);
			trigger.cancel();
			const evt = trigger.getParent("phase", true);
			if (evt) {
				game.log(player, "结束了回合");
				evt.num = evt.phaseList.length;
				evt.goto(11);
			}
			const next = target.insertPhase();
			next._noTurnOver = true;
			next.phaseList = ["phaseUse"];
			//next.setContent(lib.skill.oldmingjian.phase);
		},
		phase() {
			"step 0";
			player.phaseUse();
			"step 1";
			game.broadcastAll(function () {
				if (ui.tempnowuxie) {
					ui.tempnowuxie.close();
					delete ui.tempnowuxie;
				}
			});
		},
	},
	oldshenxian: {
		audio: "shenxian",
		inherit: "shenxian",
	},
	old_guhuo: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			return lib.inpile.includes(name) && player.countCards("hs") > 0;
		},
		filter(event, player) {
			if (!player.countCards("hs")) {
				return false;
			}
			for (const i of lib.inpile) {
				const type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
				if (i == "sha") {
					for (const j of lib.inpile_nature) {
						if (event.filterCard(get.autoViewAs({ name: i, nature: j }, "unsure"), player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const i of lib.inpile) {
					if (event.type != "phase") {
						if (!event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
							continue;
						}
					}
					const type = get.type(i);
					if (type == "basic" || type == "trick") {
						list.push([type, "", i]);
					}
					if (i == "sha") {
						for (const j of lib.inpile_nature) {
							if (event.type != "phase") {
								if (!event.filterCard(get.autoViewAs({ name: i, nature: j }, "unsure"), player, event)) {
									continue;
								}
							}
							list.push(["基本", "", "sha", j]);
						}
					}
				}
				return ui.create.dialog("蛊惑", [list, "vcard"]);
			},
			filter(button, player) {
				const evt = _status.event.getParent();
				return evt.filterCard({ name: button.link[2], nature: button.link[3] }, player, evt);
			},
			check(button) {
				const player = _status.event.player;
				const enemyNum = game.countPlayer(function (current) {
					return current != player && current.hp != 0 && (get.realAttitude || get.attitude)(current, player) < 0;
				});
				const card = { name: button.link[2], nature: button.link[3] };
				const val = _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
				if (val <= 0) {
					return 0;
				}
				if (enemyNum) {
					if (
						!player.hasCard(function (cardx) {
							if (card.name == cardx.name) {
								if (card.name != "sha") {
									return true;
								}
								return get.is.sameNature(card, cardx);
							}
							return false;
						}, "hs")
					) {
						if (get.value(card, player, "raw") < 6) {
							return Math.sqrt(val) * (0.25 + Math.random() / 1.5);
						}
						if (enemyNum <= 2) {
							return Math.sqrt(val) / 1.5;
						}
						return 0;
					}
					return 3 * val;
				}
				return val;
			},
			backup(links, player) {
				return {
					filterCard(card, player, target) {
						let result = true;
						const suit = card.suit,
							number = card.number;
						card.suit = "none";
						card.number = null;
						const mod = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
						if (mod != "unchanged") {
							result = mod;
						}
						card.suit = suit;
						card.number = number;
						return result;
					},
					selectCard: 1,
					position: "hs",
					ignoreMod: true,
					aiUse: Math.random(),
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						suit: "none",
						number: null,
					},
					ai1(card) {
						const player = _status.event.player;
						const enemyNum = game.countPlayer(function (current) {
							return current != player && current.hp != 0 && (get.realAttitude || get.attitude)(current, player) < 0;
						});
						const cardx = lib.skill.old_guhuo_backup.viewAs;
						if (enemyNum) {
							if (card.name == cardx.name && (card.name != "sha" || get.is.sameNature(card, cardx))) {
								return 2 + Math.random() * 3;
							} else if (lib.skill.old_guhuo_backup.aiUse < 0.5 && !player.isDying()) {
								return 0;
							}
						}
						return 6 - get.value(card);
					},
					async precontent(event, trigger, player) {
						player.logSkill("old_guhuo");
						player.addTempSkill("old_guhuo_guess");
						const [card] = event.result.cards;
						event.result.card.suit = get.suit(card);
						event.result.card.number = get.number(card);
					},
				};
			},
			prompt(links, player) {
				return "将一张手牌当做" + get.translation(links[0][2]) + (_status.event.name == "chooseToRespond" ? "打出" : "使用");
			},
		},
		ai: {
			save: true,
			respondSha: true,
			respondShan: true,
			fireAttack: true,
			skillTagFilter(player) {
				if (!player.countCards("hs")) {
					return false;
				}
			},
			threaten: 1.2,
			order: 8.1,
			result: {
				player: 1,
			},
		},
		subSkill: {
			guess: {
				trigger: {
					player: ["useCardBefore", "respondBefore"],
				},
				forced: true,
				silent: true,
				popup: false,
				firstDo: true,
				charlotte: true,
				filter(event, player) {
					return event.skill && event.skill.indexOf("old_guhuo_") == 0;
				},
				async content(event, trigger, player) {
					event.fake = false;
					event.betrayer = [];
					const [card] = trigger.cards;
					if (card.name != trigger.card.name || (card.name == "sha" && !get.is.sameNature(trigger.card, card))) {
						event.fake = true;
					}
					player.popup(trigger.card.name, "metal");
					const next = player.lose(card, ui.ordering);
					next.relatedEvent = trigger;
					await next;
					// player.line(trigger.targets,trigger.card.nature);
					trigger.throw = false;
					trigger.skill = "old_guhuo_backup";
					game.log(player, "声明", trigger.targets && trigger.targets.length ? "对" : "", trigger.targets || "", trigger.name == "useCard" ? "使用" : "打出", trigger.card);
					event.prompt = get.translation(player) + "声明" + (trigger.targets && trigger.targets.length ? "对" + get.translation(trigger.targets) : "") + (trigger.name == "useCard" ? "使用" : "打出") + (get.translation(trigger.card.nature) || "") + get.translation(trigger.card.name) + "，是否质疑？";
					event.targets = game
						.filterPlayer(function (current) {
							return current != player && current.hp != 0;
						})
						.sortBySeat(_status.currentPhase);
					game.broadcastAll(
						function (card, player) {
							_status.old_guhuoNode = card.copy("thrown");
							if (lib.config.cardback_style != "default") {
								_status.old_guhuoNode.style.transitionProperty = "none";
								ui.refresh(_status.old_guhuoNode);
								_status.old_guhuoNode.classList.add("infohidden");
								ui.refresh(_status.old_guhuoNode);
								_status.old_guhuoNode.style.transitionProperty = "";
							} else {
								_status.old_guhuoNode.classList.add("infohidden");
							}
							_status.old_guhuoNode.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
							player.$throwordered2(_status.old_guhuoNode);
						},
						trigger.cards[0],
						player
					);
					event.onEnd01 = function () {
						_status.old_guhuoNode.removeEventListener("webkitTransitionEnd", _status.event.onEnd01);
						setTimeout(function () {
							_status.old_guhuoNode.style.transition = "all ease-in 0.3s";
							_status.old_guhuoNode.style.transform = "perspective(600px) rotateY(270deg)";
							const onEnd = function () {
								_status.old_guhuoNode.classList.remove("infohidden");
								_status.old_guhuoNode.style.transition = "all 0s";
								ui.refresh(_status.old_guhuoNode);
								_status.old_guhuoNode.style.transform = "perspective(600px) rotateY(-90deg)";
								ui.refresh(_status.old_guhuoNode);
								_status.old_guhuoNode.style.transition = "";
								ui.refresh(_status.old_guhuoNode);
								_status.old_guhuoNode.style.transform = "";
								_status.old_guhuoNode.removeEventListener("webkitTransitionEnd", onEnd);
							};
							_status.old_guhuoNode.listenTransition(onEnd);
						}, 300);
					};
					for (const target of event.targets) {
						const links = await target
							.chooseButton([event.prompt, [["reguhuo_ally", "reguhuo_betray"], "vcard"]], true)
							.set("ai", function (button) {
								const player = _status.event.player;
								const evt = _status.event.getParent("old_guhuo_guess"),
									evtx = evt.getTrigger();
								if (!evt) {
									return Math.random();
								}
								const card = { name: evtx.card.name, nature: evtx.card.nature, isCard: true };
								const ally = button.link[2] == "reguhuo_ally";
								if (ally && (player.hp <= 1 || get.attitude(player, evt.player) >= 0)) {
									return 1.1;
								}
								if (!ally && get.attitude(player, evt.player) < 0 && evtx.name == "useCard") {
									let eff = 0;
									const targetsx = evtx.targets || [];
									for (const target of targetsx) {
										const isMe = target == evt.player;
										eff += get.effect(target, card, evt.player, player) / (isMe ? 1.5 : 1);
									}
									eff /= 1.5 * targetsx.length || 1;
									if (eff > 0) {
										return 0;
									}
									if (eff < -7) {
										return Math.random() + Math.pow(-(eff + 7) / 8, 2);
									}
									return Math.pow((get.value(card, evt.player, "raw") - 4) / (eff == 0 ? 5 : 10), 2);
								}
								return Math.random();
							})
							.forResultLinks();
						if (links[0][2] == "reguhuo_betray") {
							target.addExpose(0.2);
							game.log(target, "#y质疑");
							target.popup("质疑！", "fire");
							event.betrayer.add(target);
						} else {
							game.log(target, "#g不质疑");
							target.popup("不质疑", "wood");
						}
					}
					await game.delayx();
					game.broadcastAll(function (onEnd) {
						_status.event.onEnd01 = onEnd;
						if (_status.old_guhuoNode) {
							_status.old_guhuoNode.listenTransition(onEnd, 300);
						}
					}, event.onEnd01);
					await game.delay(2);
					if (!event.betrayer.length) {
						return;
					}
					if (event.fake) {
						event.betrayer.forEach(target => target.popup("质疑正确", "wood"));
						await game.asyncDraw(event.betrayer);
						game.log(player, "声明的", trigger.card, "作废了");
						trigger.cancel();
						trigger.getParent().goto(0);
						trigger.line = false;
						event.clearUI = true;
					} else {
						event.betrayer.forEach(target => target.popup("质疑错误", "fire"));
						for (let target of event.betrayer) {
							await target.loseHp();
						}
						if (get.suit(card) != "heart") {
							game.log(player, "声明的", trigger.card, "作废了");
							trigger.cancel();
							trigger.getParent().goto(0);
							trigger.line = false;
							event.clearUI = true;
						}
					}
					await game.delay(2);
					if (event.clearUI) {
						game.broadcastAll(() => ui.clear());
					} // game.broadcastAll(ui.clear); 原来的代码抽象喵
				},
			},
			cheated: {
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				charlotte: true,
				forced: true,
				silent: true,
				popup: false,
				firstDo: true,
				onremove: true,
				filter(event, player) {
					if (event.getParent().name == "draw") {
						return true;
					}
					var cards = event.getg(player);
					if (!cards.length) {
						return false;
					}
					return game.hasPlayer(current => {
						if (current == player) {
							return false;
						}
						var evt = event.getl(current);
						if (evt && evt.cards && evt.cards.length) {
							return true;
						}
						return false;
					});
				},
				content() {
					player.removeSkill("old_guhuo_cheated");
				},
			},
		},
	},
	old_zuilun: {
		audio: "xinfu_zuilun",
		subSkill: {
			e: {},
			h: {},
		},
		enable: "phaseUse",
		usable: 2,
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var pos = "he";
			if (player.hasSkill("old_zuilun_h")) {
				pos = "e";
			}
			if (player.hasSkill("old_zuilun_e")) {
				pos = "h";
			}
			return target.countGainableCards(player, pos) > 0;
		},
		content() {
			"step 0";
			var pos = "he";
			if (player.hasSkill("old_zuilun_h")) {
				pos = "e";
			}
			if (player.hasSkill("old_zuilun_e")) {
				pos = "h";
			}
			player.gainPlayerCard(target, pos, true);
			"step 1";
			if (result.bool && result.cards && result.cards.length) {
				target.draw();
				var pos = result.cards[0].original;
				if (pos == "h" || pos == "e") {
					player.addTempSkill("old_zuilun_" + pos, "phaseUseAfter");
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target: -1,
			},
		},
	},
	old_fuyin: {
		audio: "xinfu_fuyin",
		mod: {
			targetEnabled(card, player, target) {
				if ((card.name == "juedou" || card.name == "sha" || card.name == "huogong") && player != target && player.countCards("h") >= target.countCards("h") && target.hasEmptySlot(2)) {
					return false;
				}
			},
		},
	},
	old_jijun: {
		marktext: "方",
		audio: "xinfu_jijun",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		enable: "phaseUse",
		filterCard: true,
		selectCard: [1, Infinity],
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		check(card) {
			var player = _status.event.player;
			if (36 - player.getExpansions("old_jijun").length <= player.countCards("h")) {
				return 1;
			}
			return 5 - get.value(card);
		},
		discard: false,
		lose: false,
		content() {
			player.addToExpansion(cards, player, "give").gaintag.add("old_jijun");
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
			combo: "old_fangtong",
		},
	},
	old_fangtong: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		audio: "xinfu_fangtong",
		forced: true,
		skillAnimation: true,
		animationColor: "metal",
		filter(event, player) {
			return player.getExpansions("old_jijun").length > 35;
		},
		content() {
			var winners = player.getFriends();
			game.over(player == game.me || winners.includes(game.me));
		},
		ai: {
			combo: "oldjijun",
		},
	},
	oldanxu: {
		enable: "phaseUse",
		usable: 1,
		multitarget: true,
		audio: 2,
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var num = target.countCards("h");
			if (ui.selected.targets.length) {
				return num < ui.selected.targets[0].countCards("h");
			}
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (num > players[i].countCards("h")) {
					return true;
				}
			}
			return false;
		},
		selectTarget: 2,
		content() {
			"step 0";
			var gainner, giver;
			if (targets[0].countCards("h") < targets[1].countCards("h")) {
				gainner = targets[0];
				giver = targets[1];
			} else {
				gainner = targets[1];
				giver = targets[0];
			}
			gainner.gainPlayerCard(giver, "h", true).set("visible", true);
			"step 1";
			if (result.bool && result.links.length && get.suit(result.links[0]) != "spade") {
				player.draw();
			}
		},
		ai: {
			order: 10.5,
			threaten: 2,
			result: {
				target(player, target) {
					var num = target.countCards("h");
					var att = get.attitude(player, target);
					if (ui.selected.targets.length == 0) {
						if (att > 0) {
							return -1;
						}
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							var num2 = players[i].countCards("h");
							var att2 = get.attitude(player, players[i]);
							if (att2 >= 0 && num2 < num) {
								return -1;
							}
						}
						return 0;
					} else {
						return 1;
					}
				},
				player: 0.1,
			},
		},
	},
	oldfaen: {
		audio: "faen",
		trigger: { global: ["turnOverAfter", "linkAfter"] },
		filter(event, player) {
			if (event.name == "link") {
				return event.player.isLinked();
			}
			return true;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		content() {
			trigger.player.draw();
		},
		ai: {
			expose: 0.2,
		},
		global: "faen_global",
	},
	oldxuanfeng: {
		audio: "xuanfeng",
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		direct: true,
		filter(event, player) {
			var evt = event.getl(player);
			return evt && evt.es && evt.es.length > 0;
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("oldxuanfeng"), function (card, player, target) {
					if (target == player) {
						return false;
					}
					return get.distance(player, target) <= 1 || player.canUse("sha", target, false);
				})
				.set("ai", function (target) {
					if (get.distance(player, target) <= 1) {
						return get.damageEffect(target, player, player) * 2;
					} else {
						return get.effect(target, { name: "sha" }, player, player);
					}
				});
			"step 1";
			if (result.bool) {
				player.logSkill("oldxuanfeng", result.targets);
				var target = result.targets[0];
				var distance = get.distance(player, target);
				if (distance <= 1 && player.canUse("sha", target, false)) {
					player.chooseControl("出杀", "造成伤害").set("ai", function () {
						return "造成伤害";
					});
					event.target = target;
				} else if (distance <= 1) {
					target.damage();
					event.finish();
				} else {
					player.useCard({ name: "sha", isCard: true }, target, false).animate = false;
					game.delay();
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			var target = event.target;
			if (result.control == "出杀") {
				player.useCard({ name: "sha", isCard: true }, target, false).animate = false;
				game.delay();
			} else {
				target.damage();
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "equip") {
						return [1, 3];
					}
				},
			},
			reverseEquip: true,
			noe: true,
		},
	},
};

export default skills;
