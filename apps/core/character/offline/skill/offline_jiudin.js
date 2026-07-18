import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//九鼎-徐晃
	jdsbduanliang: {
		audio: "sbduanliang",
		inherit: "sbduanliang",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseToDuiben(target)
				.set("title", "谋弈")
				.set("namelist", ["固守城池", "突出重围", "围城断粮", "擂鼓进军"])
				.set("translationList", [`以防止${get.translation(player)}通过此技能对你使用【决斗】`, `以防止${get.translation(player)}通过此技能对你使用【兵粮寸断】`, `若成功，你摸一张牌，然后可以将一张黑色非锦囊牌当做【兵粮寸断】对${get.translation(target)}使用`, `若成功，视为对${get.translation(target)}使用【决斗】`])
				.set("ai", button => {
					var source = _status.event.getParent().player,
						target = _status.event.getParent().target;
					if (get.effect(target, { name: "juedou" }, source, source) >= 10 && button.link[2] == "db_def2" && Math.random() < 0.5) {
						return 10;
					}
					return 1 + Math.random();
				})
				.forResult();
			if (result.bool) {
				if (result.player == "db_def1") {
					await player.draw();
					if (target.hasJudge("bingliang") && target.countGainableCards(player, "he")) {
						await player.gainPlayerCard(target, "he", true);
					} else {
						const next = player.chooseToUse();
						next.set("openskilldialog", "断粮：是否将一张黑色非锦囊牌当作【兵粮寸断】对" + get.translation(target) + "使用？");
						next.set("norestore", true);
						next.set("_backupevent", "jdsbduanliang_backup");
						next.set("custom", {
							add: {},
							replace: { window() {} },
						});
						next.backup("jdsbduanliang_backup");
						next.set("targetRequired", true);
						next.set("complexSelect", true);
						next.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						});
						next.set("sourcex", target);
						await next;
					}
				} else {
					const card = { name: "juedou", isCard: true };
					if (player.canUse(card, target)) {
						await player.useCard(card, target);
					}
				}
			}
		},
		subSkill: {
			backup: {
				viewAs: {
					name: "bingliang",
				},
				filterCard(card, player) {
					return get.itemtype(card) == "card" && get.color(card, player) == "black" && get.type2(card) != "trick";
				},
				position: "hes",
				selectCard: 1,
				check(card) {
					return 6 - get.value(card);
				},
			},
		},
	},
	//九鼎--王元姬
	jdshiren: {
		audio: "shiren",
		trigger: { player: "showCharacterAfter" },
		filter(event, player) {
			if (!event.toShow?.some(i => get.character(i).skills?.includes("jdshiren"))) {
				return false;
			}
			const target = _status.currentPhase;
			return target && target != player && target.isAlive() && target.countCards("h") > 0;
		},
		logTarget: () => _status.currentPhase,
		hiddenSkill: true,
		content() {
			const next = game.createEvent("jdyanxi", false);
			next.player = player;
			next.target = _status.currentPhase;
			next.setContent(lib.skill["jdyanxi"].content);
		},
	},
	jdyanxi: {
		audio: "yanxi",
		inherit: "yanxi",
		async content(event, trigger, player) {
			const target = event.target;
			const {
				cards: [card],
			} = await player.choosePlayerCard(target, "h", true).forResult();
			if (card) {
				const videoId = lib.status.videoId++;
				game.addVideo("showCards", player, [`${get.translation(player)}对${get.translation(target)}发动了【宴戏】`, get.cardsInfo([card])]);
				game.broadcastAll(
					(card, id, player, target) => {
						let dialog;
						if (player === game.me) {
							dialog = ui.create.dialog(`${get.translation(target)}手牌展示中...`);
						} else {
							dialog = ui.create.dialog(`${get.translation(player)}对${get.translation(target)}发动了【宴戏】`, [card]);
						}
						dialog.forcebutton = true;
						dialog.videoId = id;
					},
					card,
					videoId,
					player,
					target
				);
				await game.delay(2);
				game.broadcastAll("closeDialog", videoId);
				let cards = [card].concat(get.cards(2)).randomSort();
				game.log(player, "展示了", cards);
				const videoIdx = lib.status.videoId++;
				const str = get.translation(player) + "对" + get.translation(target) + "发动了【宴戏】";
				game.broadcastAll(
					(str, id, cards) => {
						const dialog = ui.create.dialog(str, cards);
						dialog.videoId = id;
					},
					str,
					videoIdx,
					cards
				);
				game.addVideo("showCards", player, [str, get.cardsInfo(cards)]);
				const func = function (id, target) {
					const dialog = get.idDialog(id);
					if (dialog) {
						dialog.content.firstChild.innerHTML = "猜猜哪张是" + get.translation(target) + "的手牌？";
					}
				};
				if (player == game.me) {
					func(videoIdx, target);
				} else if (player.isOnline()) {
					player.send(func, videoIdx, target);
				}
				const next = player.chooseButton(true);
				next.set("dialog", videoIdx);
				next.set("ai", button => {
					const evt = get.event();
					if (evt.answer) {
						return button.link == evt.answer ? 1 : 0;
					}
					return get.value(button.link, evt.player);
				});
				if (player.hasSkillTag("viewHandcard", null, target, true)) {
					next.set("answer", card);
				}
				const result = await next.forResult();
				game.broadcastAll("closeDialog", videoIdx);
				if (result.bool) {
					const card2 = result.links[0];
					cards.remove(card2);
					if (card2 == card) {
						player.popup("洗具");
						player.$gain2(cards);
						await player.gain(cards, "log");
						await player.gain(card, target, "bySelf", "give");
					} else {
						player.popup("杯具");
						await player.gain(card2, "gain2");
						const result = await player
							.chooseToMove("宴戏：将剩余的牌以任意顺序置于牌堆顶", true)
							.set("list", [["牌堆顶", cards]])
							.set("reverse", _status.currentPhase?.next && get.attitude(player, _status.currentPhase.next) > 0)
							.set("processAI", list => {
								const cards = list[0][1].slice(0);
								cards.sort((a, b) => {
									return (_status.event.reverse ? 1 : -1) * (get.value(b) - get.value(a));
								});
								return [cards];
							})
							.forResult();
						if (!result.bool) {
							return;
						}
						cards = result.moved[0];
						cards.reverse();
						if (cards.includes(card)) {
							target.$throw(1, 1000);
							await target.lose([card], ui.special);
						}
						await game.cardsGotoPile(cards, "insert");
						game.log(player, "将", cards, "置于了牌堆顶");
					}
				}
			}
		},
	},
	//九鼎-华歆
	jdcaozhao: {
		audio: "caozhao",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			if (
				lib.inpile.every(i => {
					return player.getStorage("jdcaozhao").includes(i);
				})
			) {
				return false;
			}
			return event.player.countCards("h") && event.player.getHp() <= player.getHp();
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			event.result = await player
				.choosePlayerCard(target, "h", get.prompt2(event.skill, target))
				.set("ai", () => {
					const player = get.player(),
						target = get.event().getTrigger().player;
					if (lib.inpile.some(i => !player.getStorage("jdcaozhao").includes(i) && target.getUseValue(i) * get.attitude(player, target) > 0)) {
						return 1 + Math.random();
					}
					return 0;
				})
				.forResult();
		},
		logTarget: "player",
		round: 1,
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.showCards(event.cards, get.translation(player) + "对" + get.translation(target) + "发动了【草诏】");
			const result = await player
				.chooseButton(
					[
						"草诏：请选择一个基本牌或锦囊牌",
						[
							lib.inpile.filter(i => {
								if (!["basic", "trick"].includes(get.type(i))) {
									return false;
								}
								return !player.getStorage("jdcaozhao").includes(i);
							}),
							"vcard",
						],
					],
					true
				)
				.set("ai", button => {
					const player = get.player(),
						target = get.event().getTrigger().player,
						sgn = get.sgn(get.attitude(player, target));
					const cards = get.event().getParent().cards,
						card = get.autoViewAs({ name: button.link[2] }, cards);
					if (!target.hasUseTarget(card) || target.getUseValue(card) * sgn <= 0) {
						Math.random();
					}
					return 5 + target.getUseValue(card) * sgn;
				})
				.forResult();
			if (result.bool) {
				const name = result.links[0][2];
				player.markAuto("jdcaozhao", [name]);
				player.popup(name, "thunder");
				game.log(player, "声明了", "#y" + get.translation(name));
				const card = get.autoViewAs({ name: name }, event.cards);
				let resultx;
				if (!target.hasUseTarget(card)) {
					resultx = { bool: false };
				} else {
					resultx = await target
						.chooseUseTarget('###草诏###<div class="text center">使用' + get.translation(card) + "（" + get.translation(event.cards) + "），或失去1点体力</div>", card, false)
						.set("cards", event.cards)
						.forResult();
				}
				if (!resultx.bool) {
					await target.loseHp();
				}
			}
		},
	},
	//九鼎-杨婉
	jdmingxuan: {
		audio: "spmingxuan",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			const num = Math.min(
				player
					.getCards("h")
					.slice()
					.map(i => get.suit(i, player))
					.unique().length,
				game.countPlayer(current => {
					return current != player && !player.getStorage("jdmingxuan").includes(current);
				})
			);
			return num > 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = Math.min(
				player
					.getCards("h")
					.slice()
					.map(i => get.suit(i, player))
					.unique().length,
				game.countPlayer(current => {
					return current != player && !player.getStorage("jdmingxuan").includes(current);
				})
			);
			const result = await player
				.chooseCard("h", true, [1, num], "瞑昡：请选择至多" + get.cnNumber(num) + "张花色各不相同的手牌", (card, player) => {
					if (!ui.selected.cards.length) {
						return true;
					}
					return !ui.selected.cards.some(i => get.suit(i, player) == get.suit(card));
				})
				.set("complexCard", true)
				.set("ai", card => 6 - get.value(card))
				.forResult();
			if (result?.bool && result.cards?.length > 0) {
				let cards = result.cards.slice().randomSort();
				let targets = game.filterPlayer(current => current != player && !player.getStorage("jdmingxuan").includes(current)).sortBySeat(player);
				const dialog = ui.create.dialog("瞑昡", cards, true);
				_status.dieClose.push(dialog);
				dialog.videoId = lib.status.videoId++;
				event.dialogID = dialog.videoId;
				game.addVideo("cardDialog", null, ["瞑昡", get.cardsInfo(cards), dialog.videoId]);
				game.broadcast(
					function (cards, id) {
						var dialog = ui.create.dialog("瞑昡", cards, true);
						_status.dieClose.push(dialog);
						dialog.videoId = id;
					},
					cards,
					dialog.videoId
				);
				while (cards.length && targets.length) {
					await game.delayx();
					const target = targets.shift();
					const resultx = await target
						.chooseButton(true, button => {
							return get.value(button.link, _status.event.player);
						})
						.set("dialog", event.dialogID)
						.set("closeDialog", false)
						.set("dialogdisplay", true)
						.set("cardFilter", cards.slice())
						.set("filterButton", button => {
							return _status.event.cardFilter.includes(button.link);
						})
						.forResult();
					if (resultx?.bool && resultx.links?.length) {
						const card = resultx.links[0];
						if (card) {
							cards.remove(card);
							const capt = get.translation(target) + "选择了" + get.translation(card);
							game.broadcastAll(
								(card, id, name, capt) => {
									const dialog = get.idDialog(id);
									if (dialog) {
										dialog.content.firstChild.innerHTML = capt;
										for (let i = 0; i < dialog.buttons.length; i++) {
											if (dialog.buttons[i].link == card) {
												game.createButtonCardsetion(name, dialog.buttons[i]);
												break;
											}
										}
										game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
									}
								},
								card,
								event.dialogID,
								target.getName(true),
								capt
							);
							await target.gain(card, player, "give");
						}
						const resulty = await target
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) != "sha") {
										return false;
									}
									return lib.filter.filterCard.apply(this, arguments);
								},
								"对" + get.translation(player) + "使用一张杀，否则交给其一张牌且其摸一张牌"
							)
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("complexTarget", true)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
									return false;
								}
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("sourcex", player)
							.set("addCount", false)
							.forResult();
						if (resulty?.bool) {
							player.markAuto("jdmingxuan", [target]);
						} else {
							await target.chooseToGive("he", true, player, "交给" + get.translation(player) + "一张牌");
							await player.draw();
						}
					}
				}
				for (let i = 0; i < ui.dialogs.length; i++) {
					if (ui.dialogs[i].videoId == event.dialogID) {
						const dialogx = ui.dialogs[i];
						dialogx.close();
						_status.dieClose.remove(dialogx);
						break;
					}
				}
				game.broadcast(id => {
					const dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
						_status.dieClose.remove(dialog);
					}
				}, event.dialogID);
				game.addVideo("cardDialog", null, event.dialogID);
			}
		},
		intro: { content: "已被$使用过杀" },
	},
	//九鼎-黄月英
	jdjizhi: {
		audio: "sbjizhi",
		trigger: { player: "useCard" },
		filter(event, player) {
			return get.type(event.card) == "trick";
		},
		forced: true,
		content() {
			"step 0";
			player.draw("nodelay");
			"step 1";
			player.addTempSkill("jdjizhi_mark");
			player.addMark("jdjizhi_mark", 1, false);
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合手牌上限+#" },
				// charlotte: true,
				// onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("jdjizhi_mark");
					},
				},
			},
		},
	},
	jdqicai: {
		audio: "sbqicai",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { type: "equip" });
		},
		filterCard(card) {
			return !ui.selected.cards.length && get.type(card) == "equip";
		},
		selectCard: [1, 2],
		filterTarget: lib.filter.notMe,
		position: "he",
		check(card) {
			return 8 - get.value(card);
		},
		complexCard: true,
		complexSelect: true,
		lose: false,
		discard: false,
		delay: false,
		usable: 1,
		get prompt() {
			return lib.translate.jdqicai_info.slice("①你使用锦囊牌无距离限制。②".length);
		},
		async content(event, trigger, player) {
			const target = event.target;
			const str = get.translation(player);
			await player.showCards(event.cards, get.translation(player) + "发动了【奇才】");
			await player.give(event.cards, target);
			const result = await target
				.chooseCard(
					2,
					"he",
					card => {
						return get.type(card) !== "equip";
					},
					"奇才：交给" + str + "两张非装备牌，或令" + str + "获得两张普通锦囊牌"
				)
				.set("ai", card => {
					if (get.event().att >= 0) {
						return -1;
					}
					return 7 - get.value(card);
				})
				.set("att", get.attitude(target, player))
				.forResult();
			if (!result.bool) {
				let gains = [];
				while (gains.length < 2) {
					const card = get.cardPile(i => get.type(i) == "trick" && !gains.includes(i), false, "random");
					if (card) {
						gains.push(card);
					} else {
						break;
					}
				}
				if (gains.length) {
					await player.gain(gains, "gain2");
				} else {
					player.chat("无牌可得？！");
					game.log("但是牌堆和弃牌堆都没有普通锦囊牌了！");
				}
			} else {
				await target.showCards(result.cards);
				await target.give(result.cards, player);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					return get.sgn(att) * (2 + get.sgn(att));
				},
			},
		},
		mod: {
			targetInRange(card) {
				if (get.type2(card) == "trick") {
					return true;
				}
			},
		},
		locked: false,
	},
	//九鼎-赵云
	jdlongdan: {
		audio: "sblongdan",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			var marked = player.hasSkill("sblongdan_mark", null, null, false);
			for (var name of lib.inpile) {
				if (!marked && name != "sha" && name != "shan") {
					continue;
				}
				if (get.type(name) != "basic") {
					continue;
				}
				if (player.hasCard(lib.skill.jdlongdan.getFilter(name, player), "hs")) {
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						return true;
					}
					if (marked && name == "sha") {
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								return true;
							}
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				var marked = player.hasSkill("sblongdan_mark", null, null, false);
				for (var name of lib.inpile) {
					if (!marked && name != "sha" && name != "shan") {
						continue;
					}
					if (get.type(name) != "basic") {
						continue;
					}
					if (player.hasCard(lib.skill.jdlongdan.getFilter(name, player), "hs")) {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							list.push(["基本", "", name]);
						}
						if (marked && name == "sha") {
							for (var nature of lib.inpile_nature) {
								if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
									list.push(["基本", "", name, nature]);
								}
							}
						}
					}
				}
				return ui.create.dialog("龙胆", [list, "vcard"], "hidden");
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				var player = _status.event.player,
					card = { name: button.link[2], nature: button.link[3] };
				if (card.name == "jiu" && player.countCards("h", { type: "basic" }) < 2) {
					return 0;
				}
				return player.getUseValue(card, null, true);
			},
			backup(links, player) {
				return {
					audio: "jdlongdan",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					filterCard: lib.skill.jdlongdan.getFilter(links[0][2], player),
					position: "he",
					popname: true,
					check(card) {
						return 6 / Math.max(1, get.value(card));
					},
					precontent() {
						player.addTempSkill("jdlongdan_draw");
					},
				};
			},
			prompt(links, player) {
				var marked = player.hasSkill("sblongdan_mark", null, null, false);
				var card = {
					name: links[0][2],
					nature: links[0][3],
					isCard: true,
				};
				if (marked) {
					return "将一张基本牌当作【" + get.translation(card) + "】使用";
				}
				return "将一张【" + (card.name == "sha" ? "闪" : "杀") + "】当作【" + get.translation(card) + "】使用";
			},
		},
		hiddenCard(player, name) {
			if (get.type(name) != "basic") {
				return false;
			}
			var marked = player.hasSkill("sblongdan_mark", null, null, false);
			if (!marked && name != "sha" && name != "shan") {
				return false;
			}
			return player.hasCard(lib.skill.jdlongdan.getFilter(name, player), "hs");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				return lib.skill.jdlongdan.hiddenCard(player, tag == "respondSha" ? "sha" : "shan");
			},
			order: 9,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		getFilter(name, player) {
			if (!player.hasSkill("sblongdan_mark", null, null, false)) {
				if (name == "sha") {
					return { name: "shan" };
				}
				if (name == "shan") {
					return { name: "sha" };
				}
				return () => false;
			}
			return { type: "basic" };
		},
		derivation: "jdlongdanx",
		onremove(player) {
			player.removeSkill("sblongdan_mark");
		},
		subSkill: {
			backup: { audio: "sblongdan" },
			mark: { charlotte: true },
			draw: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "respondAfter"] },
				filter(event, player) {
					if (player.hasSkill("jdlongdan_mark")) {
						return false;
					}
					return event.skill == "jdlongdan_backup";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const result = (await player.draw(2).forResult()).cards;
					if (get.itemtype(result) == "cards") {
						player.addTempSkill("jdlongdan_mark", ["phaseChange", "phaseAfter"]);
					}
				},
			},
		},
	},
	jdjizhu: {
		inherit: "sbjizhu",
		audio: ["sbjizhu", 3],
		ai: {
			combo: "jdlongdan",
		},
	},
	//九鼎-甘宁
	jdqixi: {
		audio: "sbqixi",
		inherit: "sbqixi",
		filterCard(card) {
			return lib.suit.includes(get.suit(card));
		},
		check(card) {
			return 7 - get.value(card);
		},
		position: "h",
		lose: false,
		discard: false,
		async content(event, trigger, player) {
			const target = event.target;
			let suits = lib.suit.slice().reverse(),
				num = 0;
			while (suits.length > 0) {
				const { control } = await target
					.chooseControl(suits)
					.set("prompt", "奇袭：猜测" + get.translation(player) + "选择的牌的花色")
					.set("ai", () => {
						var player = _status.event.getParent().player,
							controls = _status.event.controls;
						if (player.countCards("h") <= 3 && controls.includes("diamond") && Math.random() < 0.3) {
							return "diamond";
						}
						return controls.randomGet();
					})
					.forResult();
				if (control) {
					target.chat("我猜是" + get.translation(control) + "！");
					game.log(target, "猜测为", "#y" + control);
					if (!event.isMine() && !event.isOnline()) {
						await game.delayx();
					}
					if (get.suit(event.cards[0]) !== control) {
						player.chat("猜错了！");
						game.log(target, "猜测", "#y错误");
						suits.remove(control);
						num++;
						continue;
					} else {
						player.chat(num == 0 ? "这么准？" : "猜对了！");
						game.log(target, "猜测", "#g正确");
						const card = event.cards[0];
						if (get.owner(card) == player && get.position(card) == "h") {
							await player.showCards([card], get.translation(player) + "选择的手牌");
							if (lib.filter.cardDiscardable(card, player)) {
								await player.discard([card]);
							}
						}
						if (num > 0 && target.countDiscardableCards(player, "hej")) {
							player.line(target);
							player.discardPlayerCard(target, num, true, "hej");
						}
						break;
					}
				} else {
					break;
				}
			}
		},
	},
	jdfenwei: {
		limited: true,
		audio: "sbfenwei",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || get.type(event.card) != "trick") {
				return false;
			}
			return event.targets.length >= 2;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), `令${get.translation(trigger.card)}对任意名角色无效`, [1, trigger.targets.length], (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					const trigger = get.event().getTrigger();
					return -get.effect(target, trigger.card, trigger.player, player);
				})
				.set("targets", trigger.targets)
				.forResult();
		},
		skillAnimation: true,
		animationColor: "wood",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			trigger.getParent().excluded.addArray(event.targets);
			if (event.targets.includes(player)) {
				player.addTempSkill("jdfenwei_qixi");
			}
		},
		ai: { expose: 0.2 },
		subSkill: {
			qixi: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				async cost(event, trigger, player) {
					const result = await player
						.chooseCardTarget({
							prompt: get.prompt("jdqixi"),
							prompt2: lib.translate.jdqixi_info.slice("出牌阶段限一次，你可以".length),
							filterCard: lib.skill.jdqixi.filterCard,
							filterTarget: lib.skill.jdqixi.filterTarget,
							position: lib.skill.jdqixi.position,
							ai1: lib.skill.jdqixi.check,
							ai2: target => {
								const player = get.player();
								return get.effect(target, "twyuanhu", player, player);
							},
						})
						.forResult();
					event.result = result;
					if (result.bool) {
						event.result.cost_data = result;
					}
				},
				popup: false,
				async content(event, trigger, player) {
					const result = event.cost_data;
					result.skill = "jdqixi";
					player.useResult(result, event);
				},
			},
		},
	},
	//九鼎-庞统
	jdlianhuan: {
		audio: "sblianhuan",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "tiesuo" && !event.target.isLinked() && event.target.countCards("he");
		},
		direct: true,
		content() {
			const target = trigger.target;
			player.discardPlayerCard(target, "he", get.prompt("jdlianhuan", target)).logSkill = ["jdlianhuan", target];
		},
		group: "jdlianhuan_lianhuan",
		subSkill: {
			lianhuan: {
				audio: "sblianhuan",
				inherit: "lianhuan",
				prompt: "将♣手牌当作【铁索连环】使用或重铸",
			},
		},
	},
	//九鼎-韩龙
	jdcibei: {
		audio: "cibei",
		inherit: "cibei",
		group: ["jdcibei_gain", "jdcibei_fullyReady"],
		subSkill: {
			fullyReady: {
				audio: "cibei",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					var storage = player.getExpansions("duwang");
					return storage.length > 0 && storage.every(i => i.name == "sha");
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.gain(player.getExpansions("duwang"), "gain2");
					player.addSkill("jdcibei_effect");
				},
			},
			effect: {
				mod: {
					cardUsable(card) {
						if (card.name == "sha") {
							return Infinity;
						}
					},
					targetInRange(card) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
				charlotte: true,
				mark: true,
				marktext: "杀",
				intro: { content: "准备完毕！本局游戏使用【杀】无距离和次数限制" },
			},
			gain: {
				audio: "cibei",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player.hasHistory("lose", evt => evt.type == "discard" && evt.cards.filterInD("d").some(i => i.name == "sha"));
				},
				forced: true,
				locked: false,
				content() {
					player.gain(
						player
							.getHistory("lose", evt => {
								return evt.type == "discard" && evt.cards.filterInD("d").filter(i => i.name == "sha");
							})
							.slice()
							.map(evt => {
								return evt.cards.filterInD("d").filter(i => i.name == "sha");
							})
							.flat(),
						"gain2"
					);
				},
			},
		},
	},
	//九鼎-夏侯徽
	jdbaoqie: {
		audio: "baoqie",
		trigger: { player: "showCharacterAfter" },
		forced: true,
		hiddenSkill: true,
		filter(event, player) {
			return event.toShow?.some(i => get.character(i).skills?.includes("jdbaoqie"));
		},
		content() {
			"step 0";
			var card = get.cardPile(function (card) {
				return get.subtype(card, false) == "equip2" && !get.cardtag(card, "gifts");
			});
			if (!card) {
				event.finish();
				return;
			}
			event.card = card;
			player.gain(card, "gain2");
			"step 1";
			if (player.getCards("h").includes(card) && get.subtype(card) == "equip2") {
				player.chooseUseTarget(card).nopopup = true;
			}
		},
	},
	//九鼎-曹操
	jdjianxiong: {
		audio: "sbjianxiong",
		inherit: "sbjianxiong",
		filter(event, player) {
			return (get.itemtype(event.cards) == "cards" && event.cards.some(i => get.position(i, true) == "o")) || 2 - player.countMark("sbjianxiong") > 0;
		},
		prompt2(event, player) {
			var gain = get.itemtype(event.cards) == "cards" && event.cards.some(i => get.position(i, true) == "o"),
				draw = 2 - player.countMark("sbjianxiong");
			var str = "";
			if (gain) {
				str += "获得" + get.translation(event.cards);
			}
			if (gain && draw > 0) {
				str += "并";
			}
			if (draw > 0) {
				str += "摸" + get.cnNumber(draw) + "张牌";
			}
			if (player.countMark("sbjianxiong")) {
				str += "，然后可以弃1枚“治世”";
			}
			return str;
		},
		content() {
			"step 0";
			if (get.itemtype(trigger.cards) == "cards" && trigger.cards.some(i => get.position(i, true) == "o")) {
				player.gain(trigger.cards, "gain2");
			}
			var num = player.countMark("sbjianxiong");
			if (2 - num > 0) {
				player.draw(2 - num, "nodelay");
			}
			if (!num) {
				event.finish();
			}
			"step 1";
			player.chooseBool("是否弃1枚“治世”？").set("ai", () => {
				var player = _status.event.player,
					current = _status.currentPhase;
				if (get.distance(current, player, "absolute") > 3 && player.hp <= 2) {
					return true;
				}
				return false;
			});
			"step 2";
			if (result.bool) {
				player.removeMark("sbjianxiong", 1);
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage") && player != target) {
						var cards = card.cards,
							evt = _status.event;
						if (evt.player == target && card.name == "damage" && evt.getParent().type == "card") {
							cards = evt.getParent().cards.filterInD();
						}
						if (target.hp <= 1) {
							return;
						}
						if (get.itemtype(cards) != "cards") {
							return;
						}
						for (var i of cards) {
							if (get.name(i, target) == "tao") {
								return [1, 4.5];
							}
						}
						if (get.value(cards, target) >= 7 + target.getDamagedHp()) {
							return [1, 2];
						}
						return [1, 0.55 + 0.05 * Math.max(0, 2 - target.countMark("sbjianxiong"))];
					}
				},
			},
		},
		group: "jdjianxiong_mark",
	},
	//九鼎-诸葛亮
	jdhuoji: {
		audio: "sbhuoji",
		dutySkill: true,
		derivation: ["jdguanxing", "sbkongcheng"],
		group: ["jdhuoji_fire", "jdhuoji_achieve", "jdhuoji_fail", "jdhuoji_mark"],
		subSkill: {
			fire: {
				audio: "sbhuoji1.mp3",
				enable: "phaseUse",
				filterTarget: lib.filter.notMe,
				prompt: "选择一名其他角色，对其与其势力相同的所有其他角色各造成1点火属性伤害",
				usable: 1,
				line: "fire",
				content() {
					"step 0";
					target.damage("fire");
					"step 1";
					var targets = game.filterPlayer(current => {
						if (current == player || current == target) {
							return false;
						}
						return current.group == target.group;
					});
					if (targets.length) {
						game.delayx();
						player.line(targets, "fire");
						targets.forEach(i => i.damage("fire"));
					}
				},
				ai: {
					order: 7,
					fireAttack: true,
					result: {
						target(player, target) {
							var att = get.attitude(player, target);
							return (
								get.sgn(att) *
								game
									.filterPlayer(current => {
										if (current == player) {
											return false;
										}
										return current.group == target.group;
									})
									.reduce((num, current) => num + get.damageEffect(current, player, player, "fire"), 0)
							);
						},
					},
				},
			},
			achieve: {
				audio: "jdhuoji2.mp3",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getAllHistory("sourceDamage", evt => evt.hasNature("fire") && evt.player != player).reduce((num, evt) => num + evt.num, 0) >= game.players.length + game.dead.length;
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					player.awakenSkill("jdhuoji");
					game.log(player, "成功完成使命");
					player.changeSkin("jdhuoji", "sb_zhugeliang");
					player.changeSkills(["jdguanxing", "sbkongcheng"], ["jdhuoji", "jdkanpo"]);
				},
			},
			fail: {
				audio: "jdhuoji3.mp3",
				trigger: { player: "dying" },
				forced: true,
				locked: false,
				content() {
					player.awakenSkill("jdhuoji");
					game.log(player, "使命失败");
				},
			},
			mark: {
				charlotte: true,
				trigger: { source: "damage" },
				filter(event, player) {
					return event.hasNature("fire");
				},
				firstDo: true,
				forced: true,
				popup: false,
				content() {
					player.addTempSkill("jdhuoji_count", {
						player: ["jdhuoji_achieveBegin", "jdhuoji_failBegin"],
					});
					player.storage.jdhuoji_count = player.getAllHistory("sourceDamage", evt => evt.hasNature("fire") && evt.player != player).reduce((num, evt) => num + evt.num, 0);
					player.markSkill("jdhuoji_count");
				},
			},
			count: {
				charlotte: true,
				intro: { content: "本局游戏已造成过#点火属性伤害" },
			},
		},
	},
	jdkanpo: {
		audio: "sbkanpo",
		trigger: {
			global: ["phaseBefore", "useCard"],
			player: "enterGame",
		},
		filter(event, player) {
			if (event.name == "useCard") {
				return player
					.getExpansions("jdkanpo")
					.slice()
					.map(i => i.name)
					.includes(event.card.name);
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = await player
					.chooseButton(["###" + get.prompt(event.skill) + "###弃置一张同名牌，令" + get.translation(trigger.card) + "无效", player.getExpansions(event.skill)])
					.set("filterButton", button => {
						const name = get.event().getTrigger().card.name;
						return button.link.name == name;
					})
					.set("ai", () => {
						const player = get.player(),
							trigger = get.event().getTrigger();
						return lib.skill.sbkanpo.subSkill.kanpo.check(trigger, player) ? 1 : 0;
					})
					.forResult();
				if (event.result.bool) {
					event.result.cards = event.result.links;
					event.result.targets = [trigger.player];
				}
			} else {
				event.result = { bool: true };
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				await player.loseToDiscardpile(event.cards);
				trigger.targets.length = 0;
				trigger.all_excluded = true;
				game.log(trigger.card, "被无效了");
				await player.draw();
			} else {
				await player.draw(3);
				if (player.countCards("h")) {
					const result = await player
						.chooseCard("看破：是否将至多三张牌置于武将牌上？", [1, 3])
						.set("ai", card => {
							switch (card.name) {
								case "wuxie":
									return 5 + Math.random();
								case "sha":
									return 5 + Math.random();
								case "tao":
									return 4 + Math.random();
								case "jiu":
									return 3 + Math.random();
								case "lebu":
									return 3 + Math.random();
								case "shan":
									return 4.5 + Math.random();
								case "wuzhong":
									return 4 + Math.random();
								case "shunshou":
									return 2.7 + Math.random();
								case "nanman":
									return 2 + Math.random();
								case "wanjian":
									return 1.6 + Math.random();
								default:
									return 0;
							}
						})
						.forResult();
					if (result.bool) {
						await player.addToExpansion(result.cards, player, "giveAuto").set("gaintag", ["jdkanpo"]);
					}
				}
			}
		},
		marktext: "谋",
		intro: {
			mark(dialog, storage, player) {
				var cards = player.getExpansions("jdkanpo");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
	},
	jdguanxing: {
		audio: "sbguanxing",
		inherit: "sbguanxing",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			const bool = player.hasCard(card => card.hasGaintag("sbguanxing"), "s");
			return bool || 7 - 2 * player.countMark("sbguanxingx") > 0;
		},
		async content(event, trigger, player) {
			player.addMark("sbguanxingx", 1, false);
			const cards = player.getCards("s", card => card.hasGaintag("sbguanxing"));
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
			const num = Math.max(0, 7 - 2 * (player.countMark("sbguanxingx") - 1));
			if (num) {
				const cards2 = get.cards(num);
				player.$gain2(cards2, false);
				game.log(player, "将", cards2, "置于了武将牌上");
				await player.loseToSpecial(cards2, "sbguanxing").set("visible", true);
				player.markSkill("sbguanxing");
			}
		},
		group: ["sbguanxing_unmark", "jdguanxing_put"],
		subSkill: {
			put: {
				audio: "sbguanxing",
				enable: "phaseUse",
				filter(event, player) {
					return player.hasCard(card => card.hasGaintag("sbguanxing"), "s");
				},
				filterCard(card) {
					return card.hasGaintag("sbguanxing");
				},
				selectCard: [1, Infinity],
				position: "s",
				lose: false,
				discard: false,
				delay: 0,
				prompt: "将任意张“星”置于牌堆顶",
				allowChooseAll: true,
				content() {
					player.loseToDiscardpile(cards, ui.cardPile, "insert").log = false;
					game.log(player, "将", cards, "置于了牌堆顶");
				},
			},
		},
	},
	//九鼎-司马师
	jdtairan: {
		audio: "tairan",
		inherit: "tairan",
		trigger: {
			player: "phaseJieshuBegin",
		},
		async content(event, trigger, player) {
			const maxHp = player.maxHp;
			const hp = maxHp - player.getHp();
			if (hp > 0) {
				await player.recoverTo(maxHp);
			}
			const num = maxHp - player.countCards("h");
			if (num > 0) {
				await player.drawTo(maxHp);
			}
			player.when("phaseUseBegin").step(async () => {
				if (hp > 0) {
					await player.loseHp(hp);
				}
				if (player.countCards("h") && num > 0) {
					await player.chooseToDiscard("h", num, true);
				}
			});
		},
	},
	//九鼎-张飞
	jdsbpaoxiao: {
		audio: "sbpaoxiao",
		inherit: "sbpaoxiao",
		content() {
			if (!trigger.card.storage) {
				trigger.card.storage = {};
			}
			trigger.card.storage.jdsbpaoxiao = true;
			trigger.baseDamage++;
			trigger.directHit.addArray(game.players);
			player.addTempSkill(event.name + "_effect", "phaseUseAfter");
		},
		subSkill: {
			effect: {
				inherit: "sbpaoxiao_effect",
				filter(event, player) {
					return event.card.storage && event.card.storage.jdsbpaoxiao && event.target.isIn();
				},
				group: "jdsbpaoxiao_recoil",
			},
			recoil: {
				inherit: "sbpaoxiao_recoil",
				filter(event, player) {
					return event.card && event.card.storage && event.card.storage.jdsbpaoxiao && event.player.isIn();
				},
				async content(event, trigger, player) {
					await player.loseHp();
					if (player.countDiscardableCards(trigger.player, "h")) {
						await trigger.player.discardPlayerCard(player, "h", true);
					}
				},
			},
		},
	},
	//九鼎-法正
	jdsbxuanhuo: {
		audio: "sbxuanhuo",
		inherit: "sbxuanhuo",
		group: "jdsbxuanhuo_rob",
		filterTarget(card, player, target) {
			return !target.hasMark("jdsbxuanhuo_mark") && player != target;
		},
		onremove(player) {
			delete player.storage.jdsbxuanhuo;
			player.unmarkSkill("jdsbxuanhuo");
		},
		subSkill: {
			mark: {
				marktext: "眩",
				intro: {
					name: "眩惑",
					name2: "眩",
					markcount: () => 0,
					content: "已获得“眩”标记",
				},
			},
			rob: {
				audio: "jdsbxuanhuo",
				inherit: "sbxuanhuo_rob",
				filter(event, player, name, target) {
					return target?.isIn();
				},
				getIndex(event, player) {
					const evt = event.getParent("phaseDraw");
					if (evt?.name == "phaseDraw") {
						return false;
					}
					return game
						.filterPlayer(current => {
							if (!event.getg(current).length || !current.hasMark("jdsbxuanhuo_mark")) {
								return false;
							}
							if (evt?.player == current) {
								return false;
							}
							if (lib.skill.sbxuanhuo.getNum(current, "jdsbxuanhuo_rob", "jdsbxuanhuo_mark") >= 5) {
								return false;
							}
							return current.hasCard(card => lib.filter.canBeGained(card, current, player), "he");
						})
						.sortBySeat();
				},
				async content(event, trigger, player) {
					const target = event.targets[0],
						hs = target.getCards("h", card => lib.filter.canBeGained(card, target, player));
					if (hs.length) {
						await player.gainPlayerCard(target, "h", true);
						if (!player.storage.jdsbxuanhuo) {
							player.storage.jdsbxuanhuo = {};
						}
						player.storage.jdsbxuanhuo[target.playerid] = lib.skill.sbxuanhuo.getNum(target, "jdsbxuanhuo_rob", "jdsbxuanhuo_mark");
						player.markSkill("jdsbxuanhuo");
					}
				},
			},
		},
	},
	jdsbenyuan: {
		audio: "sbenyuan",
		inherit: "sbenyuan",
		filter(event, player, name, target) {
			return target?.isIn();
		},
		getIndex(event, player) {
			return game.filterPlayer(target => target.hasMark("jdsbxuanhuo_mark")).sortBySeat();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.clearMark("jdsbxuanhuo_mark");
			for (const current of game.players) {
				const storage = current.storage.jdsbxuanhuo;
				if (storage && storage[target.playerid]) {
					delete storage[target.playerid];
				}
				if (storage && get.is.empty(storage)) {
					delete current.storage.jdsbxuanhuo;
					current.unmarkSkill("jdsbxuanhuo");
				}
			}
			const bool = target.countCards("h") < player.countCards("h");
			player.logSkill("jdsbenyuan", target, null, null, [bool ? 1 : 2]);
			if (bool) {
				const num = Math.min(player.countCards("he"), 2);
				if (num) {
					await player.chooseToGive(target, `恩怨：交给${get.translation(target)}${get.cnNumber(num)}张牌`, true, num, "he");
				}
			} else {
				await target.loseHp();
				await player.recover();
			}
		},
		ai: {
			combo: "jdsbxuanhuo",
		},
	},
	//九鼎-刘备
	jdsbzhangwu: {
		audio: "sbzhangwu",
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("sbrende");
		},
		limited: true,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###章武###" + get.translation("jdsbzhangwu_info"));
			},
			chooseControl(event, player) {
				return Array.from({
					length: player.countMark("sbrende"),
				})
					.map((_, i) => get.cnNumber(i + 1, true))
					.concat(["cancel2"]);
			},
			check(event, player) {
				const choices = Array.from({
					length: player.countMark("sbrende"),
				}).map((_, i) => get.cnNumber(i + 1, true));
				return choices.length - 1;
			},
			backup(result, player) {
				return {
					num: result.index + 1,
					audio: "sbzhangwu",
					filterCard: () => false,
					selectCard: -1,
					skillAnimation: "epic",
					animationColor: "orange",
					async content(event, trigger, player) {
						player.awakenSkill("jdsbzhangwu");
						const num = lib.skill.jdsbzhangwu_backup.num;
						player.removeMark("sbrende", num);
						await player.draw(num);
						player.tempBanSkill("sbrende", { player: "dying" });
						player.addTempSkill("new_repaoxiao2");
					},
				};
			},
			prompt(result, player) {
				return `移去${result.index + 1}枚“仁望”并摸等量张牌`;
			},
		},
		ai: {
			order: 9,
			combo: "sbrende",
			result: {
				player(player, target) {
					return player.countMark("sbrende") > 3 ? 1 : 0;
				},
			},
		},
		subSkill: {
			backup: {},
		},
	},
	//九鼎-孙尚香
	jdsbjieyin: {
		audio: "sbjieyin",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("h") <= player.countCards("h"));
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2(event.name.slice(0, -5)),
					(card, player, target) => {
						return target.countCards("h") <= player.countCards("h");
					},
					true
				)
				.set("ai", target => {
					return get.attitude(get.player(), target) * (target.countCards("h") + 1);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = Math.min(2, Math.max(1, target.countCards("h")));
			let bool;
			if (player == target) {
				bool = !(target.countCards("h") ? false : await player.chooseBool(get.prompt(event.name), "是否获得1点护甲？").forResult()).bool;
			} else {
				bool = (
					await target
						.chooseToGive(player, `交给${get.translation(player)}${get.cnNumber(num)}张手牌，然后获得1点护甲；或令其回复1点体力并获得所有“妆”，然后其减少1点体力上限，变更势力为吴`, num, "h")
						.set("ai", card => {
							if (_status.event.goon) {
								return 100 - get.value(card);
							}
							return 0;
						})
						.set("goon", get.attitude(target, player) > 1)
						.forResult()
				).bool;
			}
			if (bool) {
				await target.changeHujia(1, null, true);
			} else {
				await player.recover();
				if (player.getExpansions("jdsbliangzhu").length) {
					await player.gain(player.getExpansions("jdsbliangzhu"), "gain2");
				}
				await player.loseMaxHp();
				if (player.group != "wu") {
					await player.changeGroup("wu");
				}
			}
		},
	},
	jdsbliangzhu: {
		audio: "sbliangzhu",
		inherit: "sbliangzhu",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { cards } = await player.choosePlayerCard(target, "e", true).forResult();
			if (!cards || !cards.length) {
				return;
			}
			const next = player.addToExpansion(cards, target, "give");
			next.gaintag.add(event.name);
			await next;
			const targets = game.filterPlayer(current => current != player && current.isDamaged());
			if (!targets) {
				return;
			}
			const list =
				targets.length == 1
					? targets
					: (
							await player
								.chooseTarget(`选择一名其他角色，令其回复1点体力`, (card, player, target) => {
									return target != player && target.isDamaged();
								})
								.set("ai", target => {
									const player = get.player();
									return get.recoverEffect(target, player, player);
								})
								.forResult()
						).targets;
			if (list && list.length) {
				await list[0].recover();
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
				target: -1,
			},
		},
	},
	//九鼎-种地的
	jdsbjieyue: {
		audio: "sbjieyue",
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt2(event.name.slice(0, -5)))
				.set("ai", target => {
					return get.attitude(get.player(), target) / Math.sqrt(Math.min(1, target.hp + target.hujia));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(2);
			await target.changeHujia(1, null, true);
			if (target.countCards("he")) {
				await target.chooseToGive(player, "he", Math.min(2, target.countCards("he")), true);
			}
		},
	},
	//九鼎-高贵名门
	jdsbluanji: {
		audio: "sbluanji",
		inherit: "sbluanji",
		filter(event, player) {
			if (event.name == "chooseToUse") {
				return player.countCards("hs") > 1 && !player.hasSkill("jdsbluanji_used");
			}
			const evt = event.getParent(2);
			return evt.name == "wanjian" && evt.getParent().player == player && event.player != player && event.player.countCards("h") > player.countCards("h") && player.countCards("h") < player.getHp();
		},
		precontent() {
			player.addTempSkill("jdsbluanji_used", "phaseUseAfter");
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	jdsbxueyi: {
		audio: "sbxueyi",
		trigger: {
			global: ["useCardAfter", "respondAfter"],
		},
		filter(event, player) {
			if (!event.respondTo) {
				return false;
			}
			if (player != event.respondTo[0]) {
				return false;
			}
			return player.hasZhuSkill("jdsbxueyi") && event.player != player && event.player.group == "qun";
		},
		zhuSkill: true,
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			for (const name of lib.phaseName) {
				const evt = _status.event.getParent(name);
				if (!evt || evt.name != name) {
					continue;
				}
				trigger.player.addTempSkill(event.name + "_ban", name + "After");
				break;
			}
		},
		mod: {
			maxHandcard(player, num) {
				if (player.hasZhuSkill("jdsbxueyi")) {
					return num + 2 * game.countPlayer(current => player != current && current.group == "qun");
				}
			},
		},
		subSkill: {
			ban: {
				charlotte: true,
				mark: true,
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
				intro: {
					content: "不能使用或打出手牌",
				},
			},
		},
	},
	//九鼎-孟获
	jdsbhuoshou: {
		audio: "sbhuoshou",
		trigger: {
			player: "phaseUseEnd",
		},
		filter(event, player) {
			return player.countCards("h");
		},
		async content(event, trigger, player) {
			await player.discard(player.getCards("h"));
			const nanman = get.autoViewAs({ name: "nanman", isCard: true });
			if (player.hasUseTarget(nanman)) {
				await player.chooseUseTarget(nanman, true, false);
			}
		},
		forced: true,
		group: ["sbhuoshou_cancel", "sbhuoshou_source"],
	},
	jdsbzaiqi: {
		audio: "sbzaiqi",
		trigger: {
			player: "phaseDiscardEnd",
		},
		filter(event, player) {
			return player.getHistory("lose", evt => evt.type == "discard").length;
		},
		async cost(event, trigger, player) {
			const num = player.getHistory("lose", evt => evt.type == "discard").reduce((num, evt) => num + evt.cards2.length, 0);
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), [1, num])
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					return 3 - get.sgn(att) + Math.abs(att / 1000);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			while (targets.length) {
				const target = targets.shift();
				const bool = !target.countCards("he")
					? false
					: (
							await target
								.chooseToDiscard(get.translation(player) + "对你发动了【再起】", "是否弃置一张牌令其回复1点体力？或者点击“取消”，令该角色摸一张牌。", "he")
								.set("ai", card => {
									const eff = _status.event.eff,
										att = _status.event.att;
									if ((eff > 0 && att > 0) || (eff <= 0 && att < 0)) {
										return 5.5 - get.value(card);
									}
									return 0;
								})
								.set("eff", get.recoverEffect(player, player, target))
								.set("att", get.attitude(target, player))
								.forResult()
						).bool;
				target.line(player);
				if (bool) {
					await player.recover(target);
				} else {
					await player.draw();
				}
			}
		},
	},
	//九鼎-大乔
	jdsbguose: {
		audio: "sbguose",
		inherit: "sbguose",
		usable: 1,
		filterTarget(card, player, target) {
			if (!ui.selected.cards.length) {
				if (!target.hasJudge("lebu")) {
					return false;
				}
				return game.hasPlayer(current => current != target && current.canAddJudge("lebu"));
			}
			if (player == target) {
				return false;
			}
			return player.canUse(get.autoViewAs({ name: "lebu" }, ui.selected.cards), target);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.hasJudge("lebu")) {
				await player
					.moveCard(true, card => (card.viewAs || card.name) == "lebu")
					.set("sourceTargets", [target])
					.set(
						"aimTargets",
						game.filterPlayer(current => current != target && current.canAddJudge("lebu"))
					)
					.set("prompt", `移动${get.translation(target)}的一张【乐不思蜀】`);
			} else {
				const next = player.useCard({ name: "lebu" }, target, event.cards);
				next.audio = false;
				await next;
			}
		},
	},
	jdsbliuli: {
		audio: "sbliuli",
		inherit: "liuli",
		group: "jdsbliuli_add",
		subSkill: {
			add: {
				trigger: { player: "logSkill" },
				filter(event, player) {
					if (event.skill != "jdsbliuli") {
						return false;
					}
					return event.targets[0].isIn();
				},
				forced: true,
				popup: false,
				content() {
					game.countPlayer(current => current.removeSkill("jdsbliuli_dangxian"));
					trigger.targets[0].addSkill("jdsbliuli_dangxian");
				},
			},
			dangxian: {
				trigger: { player: "phaseBegin" },
				forced: true,
				charlotte: true,
				mark: true,
				marktext: "流",
				intro: { content: "回合开始时，执行一个额外的出牌阶段" },
				content() {
					player.removeSkill(event.name);
					trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
				},
			},
		},
	},
	//九鼎-姜维
	jdsbtiaoxin: {
		audio: "sbtiaoxin",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterTarget: lib.filter.notMe,
		selectTarget() {
			return [1, get.player().getHp()];
		},
		multiline: true,
		async content(event, trigger, player) {
			const target = event.target;
			const { bool } = await target
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"挑衅：对" + get.translation(player) + "使用一张杀，或令其获得你一张牌"
				)
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", player)
				.forResult();
			if (!target.countGainableCards(player, "he")) {
				return;
			}
			if (!bool || (bool && !target.hasHistory("sourceDamage", evt => evt.getParent(4) == event))) {
				await player.gainPlayerCard(target, "he", true);
			}
		},
		ai: {
			threaten: 1.2,
			order: 4,
			expose: 0.2,
			result: {
				target(player, target) {
					if (target.countGainableCards(player, "he") == 0) {
						return 0;
					}
					return -1;
				},
				player(player, target) {
					if (!target.canUse("sha", player)) {
						return 0;
					}
					if (target.countCards("h") == 0) {
						return 0;
					}
					if (target.countCards("h") == 1) {
						return -0.1;
					}
					if (player.hp <= 2) {
						return -2;
					}
					if (player.countCards("h", "shan") == 0) {
						return -1;
					}
					return -0.5;
				},
			},
		},
	},
	jdsbzhiji: {
		audio: "sbzhiji",
		trigger: {
			player: "dying",
		},
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(2);
			await player.loseMaxHp();
			await player.addSkills("jdsbbeifa");
			if (player.isMinHandcard()) {
				await player.draw(2);
			}
		},
		derivation: "jdsbbeifa",
	},
	jdsbbeifa: {
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterCard: lib.filter.cardDiscardable,
		selectCard: [1, Infinity],
		check(card) {
			if (ui.selected.cards.length > 2) {
				return 0;
			}
			const player = get.player();
			if (game.hasPlayer(current => current != player && get.attitude(player, current) > 0 && current.getCards("h").some(cardx => get.name(cardx) == get.name(card)))) {
				return 1;
			}
			return 7.5 - get.value(card);
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			const cards = event.cards,
				num = cards.length,
				names = cards.map(card => get.name(card)).toUniqued();
			if (!game.hasPlayer(current => current != player && current.countCards("h"))) {
				return;
			}
			const { targets } = await player
				.chooseTarget(`北伐：令一名其他角色展示${num}张手牌`, true, (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target) * (1 + target.countCards("h"));
				})
				.forResult();
			if (!targets || !targets.length) {
				return;
			}
			const target = targets[0];
			let { cards: showCards } = await target
				.chooseCard("h", Math.min(num, target.countCards("h")), true, `选择${get.translation(num)}张手牌展示`)
				.set("ai", card => {
					const player = get.player(),
						goon = get.event().goon,
						names = get.event().names;
					if (goon) {
						if (names.includes(get.name(card))) {
							return 10;
						}
						return 7.5 - get.value(card);
					} else {
						if (names.includes(get.name(card))) {
							return 0;
						}
						return 6 - get.value(card);
					}
				})
				.set("goon", get.attitude(target, player) > 0)
				.set("names", names)
				.forResult();
			if (!showCards || !showCards.length) {
				return;
			}
			await target.showCards(showCards);
			while (showCards.some(card => names.includes(get.name(card)) && player.hasUseTarget(get.autoViewAs({ name: "sha" }, [card]), false, false))) {
				const { links } = await player
					.chooseButton(["北伐：将其中一张牌当【杀】使用", showCards])
					.set("filterButton", button => {
						const player = get.player(),
							card = button.link;
						if (!get.event().names.includes(get.name(card))) {
							return false;
						}
						return player.hasUseTarget(get.autoViewAs({ name: "sha" }, [card]), false, false);
					})
					.set("ai", button => {
						return get.value(button.link);
					})
					.set("names", names)
					.forResult();
				if (!links || !links.length) {
					break;
				}
				showCards.removeArray(links);
				const card = links[0],
					cardx = {
						name: "sha",
						cards: [card],
					};
				await player.chooseUseTarget(cardx, [card], true, false);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (!game.hasPlayer(current => get.effect(current, { name: "sha" }, player, player) > 0)) {
						return 0;
					}
					const names = player
						.getCards("he")
						.map(card => get.name(card))
						.toUniqued();
					if (game.hasPlayer(current => current != player && get.attitude(player, current) > 0 && current.getCards("h").some(card => names.includes(get.name(card))))) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	//九鼎-关羽
	jdsbwusheng: {
		audio: "sbwusheng",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(target => target != player && target.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), "令一名其他角色展示所有手牌，本阶段对其使用的前X张【杀】无距离和次数限制且结算后你摸一张牌（X为其以此法展示的红色手牌数）", (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "sha" }, player, player) * (1 + target.countCards("h", { color: "red" }));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.showHandcards();
			if (get.mode() !== "identity" || player.identity !== "nei") {
				player.addExpose(0.25);
			}
			const num = target.countCards("h", { color: "red" });
			if (num > 0) {
				player.addTempSkill("jdsbwusheng_effect", { player: "phaseUseAfter" });
				player.storage.jdsbwusheng_effect[target.playerid] = num;
			}
		},
		group: "sbwusheng_wusheng",
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = {};
					}
				},
				mod: {
					targetInRange(card, player, target) {
						if (card.name !== "sha" || typeof player.storage.jdsbwusheng_effect[target.playerid] !== "number") {
							return;
						}
						if (player.storage.jdsbwusheng_effect[target.playerid] > 0) {
							return true;
						}
					},
					cardUsableTarget(card, player, target) {
						if (card.name !== "sha" || typeof player.storage.jdsbwusheng_effect[target.playerid] !== "number") {
							return;
						}
						if (player.storage.jdsbwusheng_effect[target.playerid] > 0) {
							return true;
						}
					},
				},
				audio: "sbwusheng",
				trigger: {
					player: ["useCardAfter", "useCard1"],
				},
				filter(event, player, name) {
					if (event.card.name != "sha" || (name == "useCard1" && event.addCount == false)) {
						return false;
					}
					return event.targets.some(target => typeof player.storage.jdsbwusheng_effect[target.playerid] == "number" && player.storage.jdsbwusheng_effect[target.playerid] > 0);
				},
				forced: true,
				async content(event, trigger, player) {
					if (event.triggername == "useCard1") {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] === "number") {
							stat[name]--;
						}
					} else {
						const targets = trigger.targets.filter(target => typeof player.storage.jdsbwusheng_effect[target.playerid] == "number" && player.storage.jdsbwusheng_effect[target.playerid] > 0);
						player.line(targets);
						await player.draw(targets.length);
						for (const target of targets) {
							player.storage.jdsbwusheng_effect[target.playerid]--;
						}
					}
				},
			},
		},
	},
	jdsbyijue: {
		audio: "sbyijue",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		forced: true,
		logTarget(event, player) {
			return game.filterPlayer(current => current != player).sortBySeat();
		},
		async content(event, trigger, player) {
			const givers = [];
			for (const target of event.targets) {
				const bool = !target.countCards("he")
					? false
					: (
							await target
								.chooseToGive(player, "he", `交给${get.translation(player)}一张牌，本回合当你首次受到其的【杀】的造成的伤害时，防止之`)
								.set("ai", card => {
									const player = get.event().player,
										target = get.event().getParent().player;
									const att = get.attitude(player, target);
									if (att >= 0) {
										return 0;
									}
									if (player.getHp() > 1 || !target.canUse({ name: "sha" }, player, true, true)) {
										return 0;
									}
									return 7.5 - get.value(card);
								})
								.forResult()
						).bool;
				if (bool) {
					givers.add(target);
				}
			}
			if (givers.length) {
				player.addTempSkill(event.name + "_effect");
				player.markAuto(event.name + "_effect", givers);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "本回合$首次受到你的【杀】的造成的伤害时，你防止之",
				},
				trigger: {
					global: "damageBegin4",
				},
				filter(event, player) {
					if (!player.getStorage("jdsbyijue_effect").includes(event.player)) {
						return false;
					}
					return event.card && event.card.name == "sha" && event.getParent().type == "card";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.cancel();
					player.unmarkAuto(event.name, [trigger.player]);
				},
			},
		},
	},
	//九鼎-小乔
	jdsbtianxiang: {
		audio: "sbtianxiang",
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			return player.countCards("h") > 1 && event.num > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard: true,
					selectCard: 2,
					filterTarget: lib.filter.notMe,
					position: "h",
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						var trigger = _status.event.getTrigger();
						var da = 0;
						if (_status.event.player.hp == 1) {
							da = 10;
						}
						var eff = get.damageEffect(target, trigger.source, target);
						if (att == 0) {
							return 0.1 + da;
						}
						if (eff >= 0 && att > 0) {
							return att + da;
						}
						if (att > 0 && target.hp > 1) {
							if (target.maxHp - target.hp >= 3) {
								return att * 1.1 + da;
							}
							if (target.maxHp - target.hp >= 2) {
								return att * 0.9 + da;
							}
						}
						return -att + da;
					},
					prompt: get.prompt(event.skill),
					prompt2: lib.translate[`${event.skill}_info`],
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				target = event.targets[0];
			await player.showCards(cards);
			const { links } = await target
				.chooseButton(["天香：获得其中一张牌", cards], true)
				.set("ai", button => {
					const player = get.player(),
						card = button.link;
					return get.value(card);
				})
				.forResult();
			if (!links || !links.length) {
				return;
			}
			const suit = get.suit(links[0], player);
			await target.gain(links, "gain2");
			if (suit == "heart") {
				trigger.cancel();
				await target
					.damage(trigger.source || "nosource", trigger.nature, trigger.num)
					.set("card", trigger.card)
					.set("cards", trigger.cards);
			} else {
				target.addTempSkill(event.name + "_effect");
				target.markAuto(event.name + "_effect", [get.type2(links[0])]);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					content: storage => `本回合不能使用${get.translation(storage)}牌`,
				},
				mod: {
					cardEnabled(card, player) {
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (cards.containsSome(...hs) && player.getStorage("jdsbtianxiang_effect").includes(get.type2(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (cards.containsSome(...hs) && player.getStorage("jdsbtianxiang_effect").includes(get.type2(card))) {
							return false;
						}
					},
				},
			},
		},
	},
	jdsbhongyan: {
		audio: "xinhongyan",
		mod: {
			suit(card, suit) {
				if (suit == "spade") {
					return "heart";
				}
			},
		},
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			if (player.hasHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "jdsbhongyan")) {
				return false;
			}
			const evt = event.getl(player);
			return evt.cards2.some(i => get.suit(i, player) == "heart");
		},
		async content(event, trigger, player) {
			if (!trigger.visible) {
				const cards = trigger.getl(player).hs.filter(i => get.suit(i, player) == "heart");
				if (cards.length > 0) {
					await player.showCards(cards, get.translation(player) + "发动了【红颜】");
				}
			}
			await player.draw();
		},
	},
	//九鼎-孙权
	jdsbzhiheng: {
		audio: "sbzhiheng",
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || get.itemtype(card) !== "card" || get.type(card) !== "equip") {
					return num;
				}
				let eq = player.getEquip(get.subtype(card));
				if (eq && get.equipValue(card) - get.equipValue(eq) < Math.max(1.2, 6 - player.hp)) {
					return 0;
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard: lib.filter.cardDiscardable,
		discard: false,
		lose: false,
		delay: false,
		selectCard: [1, Infinity],
		check(card) {
			let player = _status.event.player;
			if (get.position(card) == "e") {
				if (
					ui.selected.cards.some(i => {
						return get.position(i) == "e";
					})
				) {
					return 0;
				}
				let subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) {
					return 2 * player.getHp() - get.value(card);
				}
				return 12 - get.value(card);
			}
			return 6 - get.value(card);
		},
		prompt() {
			return "出牌阶段限一次。你可以弃置任意张牌并摸等量的牌，若你以此法弃置的牌包括你装备区的牌，则你多摸一张牌";
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			const cards = event.cards;
			const num = cards.some(card => player.getCards("e").includes(card)) ? 1 : 0;
			await player.discard(cards);
			await player.draw(cards.length + num);
		},
		ai: {
			order(item, player) {
				if (player.hasCard(i => get.value(i) > Math.max(6, 9 - player.hp), "he")) {
					return 1;
				}
				return 10;
			},
			result: {
				player: 1,
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg && arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat().skill.sbzhiheng && player.hasCard(card => get.name(card) !== "tao", "h");
				}
			},
			threaten: 1.56,
		},
	},
	jdsbtongye: {
		init(player) {
			if (game.shuffleNumber == 0) {
				player.addAdditionalSkill("jdsbtongye", get.info("jdsbtongye").derivation);
				lib.onwash.push(function () {
					player.removeAdditionalSkill("jdsbtongye");
				});
			}
		},
		onremove(player) {
			player.removeAdditionalSkill("jdsbtongye");
		},
		derivation: ["sbyingzi", "olguzheng"],
		locked: true,
	},
	jdsbjiuyuan: {
		audio: "sbjiuyuan",
		enable: "phaseUse",
		usable: 1,
		zhuSkill: true,
		filter(event, player) {
			return game.hasPlayer(current => get.info("jdsbjiuyuan").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && target.group == "wu" && target.countGainableCards(player, "e") && player.hasZhuSkill("jdsbjiuyuan", target);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.gain(target.getCards("e"), target, "giveAuto", "bySelf");
			await player.recover();
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return get.effect(target, { name: "shunshou_copy2" }, player, target) * target.countGainableCards(player, "e");
				},
			},
		},
	},
	//九鼎-司马炎
	jdfengtu: {
		mode: ["identity", "guozhan", "doudizhu", "versus"],
		available(mode) {
			if (mode == "versus" && _status.mode == "three") {
				return false;
			}
		},
		trigger: { global: "dieAfter" },
		filter(event, player) {
			//if (game.players.includes(event.player)) return false;
			return game.hasPlayer(target => {
				return !game.getAllGlobalHistory("everything", evt => {
					return evt.name == "loseMaxHp" && evt.getParent().name == "jdfengtu" && evt.player == target;
				}).length;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set("ai", target => {
					const player = get.event().player,
						att = get.attitude(player, target);
					if (target.maxHp <= 1) {
						return 114514119810 * get.sgn(-att);
					}
					if (player.identity == "nei" && target != player) {
						return 0;
					}
					return (target.maxHp - 1) * att;
				})
				.set(
					"targets",
					game.filterPlayer(target => {
						return !game.getAllGlobalHistory("everything", evt => {
							return evt.name == "loseMaxHp" && evt.getParent().name == "jdfengtu" && evt.player == target;
						}).length;
					})
				)
				.forResult();
		},
		async content(event, trigger, player) {
			if (!lib.onround.includes(lib.skill.jdfengtu.onRound)) {
				lib.onround.push(lib.skill.jdfengtu.onRound);
			}
			const target = event.targets[0];
			await target.loseMaxHp();
			target.addSkill("jdfengtu_phase");
			target.markAuto("jdfengtu_phase", [trigger.player]);
		},
		onRound(event) {
			return event.getParent().skill != "jdfengtu_phase" && (event.relatedEvent || event.getParent(2)).name != "jdfengtu_phase";
		},
		check(source, player) {
			const players = game.players
				.slice()
				.concat(game.dead)
				.sort((a, b) => parseInt(a.dataset.position) - parseInt(b.dataset.position));
			const num = players.indexOf(source),
				num2 = players.indexOf(player);
			return num2 - num == 1 || (num == players.length - 1 && num2 == 0);
		},
		subSkill: {
			phase: {
				charlotte: true,
				trigger: { global: "phaseOver" },
				filter(event, player) {
					return player.getStorage("jdfengtu_phase").some(target => {
						return !game.players.includes(target) && lib.skill.jdfengtu.check(event.player, target);
					});
				},
				forced: true,
				popup: false,
				content() {
					const next = player.insertPhase();
					delete next.skill;
				},
				intro: { content: "获得$的额定回合" },
			},
		},
	},
	jdjuqi: {
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			const storage = player.storage.jdjuqi;
			return event.player == player || event.player.countCards("h", card => _status.connectMode || (get.color(card, event.player) == storage ? "red" : "black"));
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			if (target == player) {
				event.result = { bool: true };
			} else {
				const color = player.storage.jdjuqi ? "red" : "black";
				event.result = await target
					.chooseCard((card, player) => get.color(card, player) == _status.event.color, `举棋：你可以交给${get.translation(player)}一张${get.translation(color)}手牌`)
					.set("ai", card => {
						const player = get.player(),
							target = get.event().target;
						if (get.attitude(player, target) <= 0) {
							return 0;
						}
						return 6 - get.value(card);
					})
					.set("color", color)
					.set("target", player)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			player.changeZhuanhuanji(event.name);
			if (target == player) {
				if (player.storage[event.name]) {
					await player.draw(3);
				} else {
					player.addTempSkill(event.name + "_effect");
				}
			} else {
				await target.showCards(event.cards);
				await target.give(event.cards, player, true);
			}
		},
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "<li>准备阶段，你令你本回合使用牌无次数限制且造成的伤害+1<br><li>其他角色的准备阶段，其可以展示并交给你一张红色手牌";
				}
				return "<li>准备阶段，你摸三张牌<br><li>其他角色的准备阶段，其可以展示并交给你一张黑色手牌";
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: { cardUsable: () => Infinity },
				forced: true,
				popup: false,
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.card && event.getParent().type == "card";
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
				mark: true,
				intro: { content: "本回合使用牌无次数限制且造成的伤害+1" },
			},
		},
	},
	jdtaishi: {
		zhuSkill: true,
		trigger: { global: "phaseBeginStart" },
		filter(event, player) {
			return game.hasPlayer(current => current.isUnseen(2));
		},
		logTarget() {
			return game.filterPlayer(current => current.isUnseen(2)).sortBySeat();
		},
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			for (const target of game.filterPlayer(current => current.isUnseen(2)).sortBySeat()) {
				await target.showCharacter(2);
			}
		},
	},
};

export default skills;
