import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//牢又寄 —— 庞统
	friendmanjuan: {
		audio: 2,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			const cards = event.getg?.(player) || [];
			if (cards.length < 2 || !cards.some(i => get.owner(i) === player && ["h", "e"].includes(get.position(i)))) return false;
			return event.getParent().name != "friendmanjuan";
		},
		async cost(event, trigger, player) {
			const cards = trigger.getg(player).filter(i => get.owner(i) === player && ["h", "e"].includes(get.position(i)));
			const {
				result: { moved },
			} = await player
				.chooseToMove(get.prompt2("friendmanjuan"))
				.set("list", [
					["牌堆顶", []],
					[["获得的牌"], cards],
				])
				.set("processAI", list => {
					let listx = list.map(i => i[1]);
					let cards = listx[1].filter(card => {
						if (!get.discardPile(c => get.type2(c) !== get.type2(card))) return false;
						return get.info("zhiheng").check(card) > 0;
					});
					cards = cards.sort((a, b) => get.info("zhiheng").check(b) - get.info("zhiheng").check(a)).slice(0, 5);
					return [cards, listx[0].removeArray(cards)];
				});
			event.result = {
				bool: Boolean(moved?.[0]?.length),
				cost_data: moved,
			};
		},
		async content(event, trigger, player) {
			const cards = event.cost_data[0];
			await player.lose(cards, ui.cardPile, "insert");
			const list = [];
			for (const i of cards) {
				const card = get.cardPile(c => {
					if (list.includes(c)) return false;
					return get.type2(c) != get.type2(i);
				}, "discardPile");
				if (card) list.add(card);
				if (list.length >= 5) break;
			}
			if (list.length) await player.gain(list, "gain2");
		},
	},
	friendyangming: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return player.getStorage("friendyangming_mark").includes(event);
		},
		frequent: true,
		async content(event, trigger, player) {
			let num = player.hasSkill("friendpangtonggongli") && get.info("friendgongli").isFriendOf(player, "friend_zhugeliang") ? 1 : 0;
			num += _status.discarded.map(c => get.suit(c)).unique().length;
			const next = game.cardsGotoOrdering(get.cards(num));
			await next;
			let cards = next.cards;
			await player.showCards(cards, get.translation(player) + "发动了" + get.translation(event.name));
			while (cards.some(card => player.hasUseTarget(card))) {
				const { result: result2 } = await player
					.chooseCardButton(cards, "养名：请选择要使用的牌")
					.set("filterButton", button => {
						const card = button.link;
						return get.player().hasUseTarget(card);
					})
					.set("ai", button => {
						return get.player().getUseValue(button.link);
					});
				if (result2.bool) {
					const card = result2.links[0];
					player.$gain2(card, false);
					await game.delayx();
					const { result: result3 } = await player.chooseUseTarget(card, true, false);
					if (result3.bool) {
						cards.removeArray(cards.filter(cardx => get.suit(cardx) === get.suit(card)));
						continue;
					} else break;
				} else break;
			}
			if (player.hasSkill("friendpangtonggongli") && get.info("friendgongli").isFriendOf(player, "friend_xushu") && cards.length) {
				const { result } = player.chooseCardButton(cards, "养名：是否获得其中一张牌？").set("ai", button => get.value(button.link));
				if (result.bool) await player.gain(result.links, "gain2");
			}
		},
		group: "friendyangming_check",
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
			},
			check: {
				charlotte: true,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (!player.isPhaseUsing() || player.countCards("h")) return false;
					const storage = player.getStorage("friendyangming_mark");
					return !storage.includes(event.getParent("phaseUse")) && event.getl(player)?.cards2?.length > 0;
				},
				silent: true,
				async content(event, trigger, player) {
					player.addTempSkill("friendyangming_mark");
					player.markAuto("friendyangming_mark", [trigger.getParent("phaseUse")]);
				},
			},
		},
	},
	friendpangtonggongli: {
		audio: 2,
		locked: true,
	},
	//牢又寄 —— 徐庶
	friendxiaxing: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (event.name === "phase") return game.phaseNumber === 0;
			return true;
		},
		forced: true,
		locked: true,
		async content(event, trigger, player) {
			const card = game.createCard2("xuanjian");
			await player.gain([card], "gain2");
			await player.chooseUseTarget(card, true, false);
		},
		group: "friendxiaxing_gain",
		subSkill: {
			gain: {
				audio: "friendxiaxing",
				trigger: {
					global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				filter(event, player) {
					if (!player.getStorage("friendqihui").length) return false;
					return event.getd()?.some(i => i.name == "xuanjian");
				},
				async cost(event, trigger, player) {
					const storage = player.getStorage("friendqihui");
					const gains = trigger.getd().filter(i => i.name == "xuanjian");
					const {
						result: { links, bool },
					} = await player.chooseButton(["###" + get.prompt("friendxiaxing") + '###<div class="text center">移去1枚“启诲”标记，获得' + get.translation(gains) + "</div>", [storage.map(c => [c, get.translation(c)]), "tdnodes"]]).set("ai", button => {
						const player = get.player();
						if (player.getVEquip("xuanjian")) return 0;
						return (
							1 +
							Math.random() +
							player.countCards("he", card => {
								return get.type2(card) === button.link && player.hasValueTarget(card);
							})
						);
					});
					event.result = {
						bool: bool,
						cost_data: links,
					};
				},
				async content(event, trigger, player) {
					player.unmarkAuto("friendqihui", event.cost_data);
					await player.gain(
						trigger.getd().filter(i => i.name == "xuanjian"),
						"gain2"
					);
				},
			},
		},
	},
	friendqihui: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			const storage = player.getStorage("friendqihui");
			return !storage.includes(get.type2(event.card)) || storage.length >= 3;
		},
		forced: true,
		async content(event, trigger, player) {
			player.markAuto("friendqihui", [get.type2(trigger.card)]);
			if (player.getStorage("friendqihui").length >= 3) {
				const {
					result: { links },
				} = await player.chooseButton(["选择你要移去的“启诲”标记", [player.getStorage("friendqihui").map(c => [c, get.translation(c)]), "tdnodes"]], [2, 2], true).set("ai", button => {
					const player = get.player();
					return (
						1 +
						Math.random() +
						player.countCards("he", card => {
							return get.type2(card) === button.link && player.hasValueTarget(card);
						})
					);
				});
				player.unmarkAuto("friendqihui", links);
				const { result } = await player
					.chooseButton(
						[
							"启诲：请执行一项",
							[
								[
									["recover", "回复1点体力并重铸一张牌"],
									["draw", "摸两张牌且使用的下一张牌不计入次数且无次数限制"],
								],
								"textbutton",
							],
						],
						true
					)
					.set("ai", button => {
						const player = get.player();
						if (button.link === "recover")
							return (
								get.recoverEffect(player, player, player) +
								Math.max(
									...[0].concat(
										player
											.getCards("he", card => {
												return player.canRecast(card);
											})
											.map(card => get.info("zhiheng").check(card))
									)
								)
							);
						return (
							get.effect(player, { name: "draw" }, player, player) * 2 +
							Math.max(
								...[0].concat(
									player
										.getCards("he", card => {
											return player.hasValueTarget(card, false);
										})
										.map(card => player.getUseValue(card, false))
								)
							)
						);
					});
				if (result.bool) {
					switch (result.links[0]) {
						case "recover":
							await player.recover();
							if (player.hasCard(card => player.canRecast(card), "he")) {
								const {
									result: { cards },
								} = await player.chooseCard("he", "请重铸一张牌", true);
								if (cards?.length) await player.recast(cards);
							}
							break;
						case "draw":
							await player.draw(2);
							player.addSkill("friendqihui_unlimit");
					}
				}
			}
		},
		intro: { content: "已记录：$" },
		subSkill: {
			unlimit: {
				charlotte: true,
				mod: { cardUsable: () => true },
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.removeSkill("friendqihui_unlimit");
					var card = trigger.card;
					if (!card.storage) card.storage = {};
					card.storage.oltuishi = true;
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						player.getStat("card")[card.name]--;
					}
				},
				mark: true,
				intro: { content: "使用的下一张牌无任何次数限制" },
			},
		},
	},
	friendxushugongli: {
		audio: 2,
		locked: true,
	},
	xuanjian_skill: {
		equipSkill: true,
		enable: "chooseToUse",
		mod: {
			targetInRange(card, player) {
				const evt = get.event();
				if (player.hasSkill("friendxushugongli") && get.info("friendgongli").isFriendOf(player, "friend_pangtong") && evt.skill === "xuanjian_skill") {
					return true;
				}
			},
		},
		viewAs: {
			name: "sha",
		},
		filterCard(card) {
			if (ui.selected.cards.length) {
				return get.suit(card) === get.suit(ui.selected.cards[0]);
			}
			return true;
		},
		prompt() {
			return get.info({ name: "xuanjian" }).cardPrompt(null, get.player());
		},
		selectCard() {
			const player = get.player();
			if (ui.selected.cards.length) {
				if (!player.hasSkill("friendxushugongli") || !get.info("friendgongli").isFriendOf(player, "friend_zhugeliang")) return -1;
			}
			return 1;
		},
		ai: {
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				return arg !== "respond" && player.countCards("hs");
			},
		},
	},
	//牢又寄 —— 诸葛亮
	friendyance: {
		audio: 2,
		trigger: {
			global: "roundStart",
			player: "phaseZhunbeiBegin",
		},
		filter(event, player, name) {
			if (name == "roundStart") return game.roundNumber === 1;
			return true;
		},
		round: 1,
		async cost(event, trigger, player) {
			const { result } = await player
				.chooseButton([
					get.prompt2("friendyance"),
					[
						[
							["trick", `从牌堆中随机获得一张锦囊牌`],
							["minigame", `执行“卧龙演策”`],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					if (button.link !== "minigame") return true;
					const player = get.player();
					return typeof player.storage.friendyance !== "number" || player.hasMark("friendyance");
				});
			event.result = {
				bool: result.bool,
				cost_data: result,
			};
		},
		async content(event, trigger, player) {
			const {
				cost_data: {
					links: [choice],
				},
			} = event;
			if (choice === "trick") {
				const card = get.cardPile2(c => get.type2(c) === "trick");
				if (card) {
					await player.gain(card, "draw");
				} else {
					player.chat("一无所获");
				}
			} else {
				await lib.skill.friendyance.minigame(event, trigger, player);
			}
		},
		derivation: "friendyance_minigame",
		marktext: "策",
		intro: { content: "初始可预测#次" },
		async minigame(event, trigger, player) {
			await event.trigger("friendyance_minigameBegin");
			if (typeof player.storage.friendyance !== "number") {
				let bool = player.hasSkill("friendzhugelianggongli") && get.info("friendgongli").isFriendOf(player, "friend_pangtong");
				player.addMark("friendyance", 3 + bool, false);
			}
			const num = player.countMark("friendyance");
			if (!num) return;
			player.addSkill("friendyance_record");
			const storage = player.storage["friendyance_record"];
			const {
				result: { control },
			} = await player
				.chooseControl("颜色预测", "类型预测")
				.set("prompt", "卧龙演策：请选择预测方式")
				.set("ai", () => get.rand(0, 1));
			const type = lib.inpile.map(c => get.type2(c)).unique();
			const color = Object.keys(lib.color);
			const list = [];
			if (control === "颜色预测") {
				list.addArray(color);
				storage[2] = "color";
			} else {
				list.addArray(type);
				storage[2] = "type2";
			}
			const dialog = ["卧龙演策：请进行你的预测"];
			for (const i of Array.from({ length: num }, (_, k) => k)) {
				const button = list.map(c => [`${c}_${i}`, get.translation(c)]);
				dialog.push(`<div class="text center">第${get.cnNumber(i + 1, true)}张牌的预测</div>`);
				dialog.push([button, "tdnodes"]);
			}
			const {
				result: { links },
			} = await player
				.chooseButton(dialog, get.select(num))
				.set("forced", true)
				.set("filterButton", button => {
					return parseInt(button.link.at(-1)) === ui.selected.buttons.length;
				})
				.set("ai", () => 1 + Math.random());
			for (const i of links) {
				storage[1].push(i.replace(`_${i.at(-1)}`, ""));
			}
			storage[3] = links.length;
			await event.trigger("friendyance_minigame");
		},
		subSkill: {
			record: {
				charlotte: true,
				init(player, skill) {
					player.storage[skill] = [[], [], null, null, null]; //猜对与否、猜测、猜测类别、猜测次数、是否展示
				},
				onremove: true,
				mark: true,
				marktext: "阵",
				intro: {
					name: "卧龙演策",
					markcount: () => 0,
					content([trrList, gussList, type, num, show], player) {
						if (!show && !player.isUnderControl(true)) return "天机可知却不可说...";
						return [
							"剩余猜测：" + get.translation(gussList),
							"猜测进度：" +
								trrList
									.map(i => (i ? "正确" : "错误"))
									.concat(Array.from({ length: num - trrList.length }, () => "未知"))
									.join("、"),
						]
							.map(str => "<li>" + str)
							.join("<br>");
					},
				},
				mod: {
					aiOrder(player, card, num) {
						if (num > 0) {
							const storage = player.getStorage("friendyance_record");
							if (!storage[1]?.length) return;
							if (player.hasSkill("friendzhugelianggongli") && get.info("friendgongli").isFriendOf(player, "friend_xushu") && storage[3] - 1 === storage[1].length) return;
							return get[storage[2]](trigger.card) === storage[1][0] ? num + 1145141919810 : num * 0.00001;
						}
					},
				},
				group: "friendyance_check",
			},
			check: {
				charlotte: true,
				trigger: {
					global: "useCard",
					player: "friendyance_minigameBegin",
				},
				filter(event, player) {
					return event.name !== "useCard" || player.getStorage("friendyance_record")[1].length;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const storage = player.getStorage("friendyance_record");
					const num = trigger.name === "useCard" && storage[4] ? 1 : 0;
					if (trigger.name === "useCard") {
						const i = storage[1].shift();
						if (get[storage[2]](trigger.card) === i || (player.hasSkill("friendzhugelianggongli") && get.info("friendgongli").isFriendOf(player, "friend_xushu") && storage[3] - 1 === storage[1].length)) {
							player.popup("预测正确", "wood");
							game.log(player, "预测", "#y正确");
							storage[0].push(true);
							if (storage.filter(b => b === true).length <= 5) {
								await player.draw();
							}
						} else {
							player.popup("预测错误", "fire");
							game.log(player, "预测", "#r错误");
							storage[0].push(false);
						}
					}
					if (trigger.name !== "useCard" || !storage[1].length) {
						const trueArr = storage[0].filter(b => b === true);
						if (trueArr.length === 0) {
							await player.loseHp(1 + num);
							player.removeMark("friendyance", 1 + num, false);
						}
						if (trueArr.length * 2 < storage[3]) {
							await player.chooseToDiscard(1 + num, "he", true);
						} else {
							const choice = storage[1].unique();
							const control =
								choice.length > 1
									? await player
											.chooseControl(choice)
											.set("ai", () => {
												return get.event().controls.randomGet();
											})
											.set("prompt", `请选择获得牌的条件`)
											.forResult("control")
									: choice[0];
							let gains = [];
							while (gains.length < num) {
								const card = get.cardPile2(c => {
									if (gains.includes(card)) return false;
									return get[storage[2]](c) === control;
								});
							}
							if (gains.length) await player.gain(gains, "draw");
							else player.chat("一无所获");
							if (trueArr.length === storage[3]) {
								await player.draw(2 + num);
								if (player.countMark("friendyance") < 7) {
									player.addMark("friendyance", Math.min(7 - player.countMark("friendyance"), 1 + num), false);
								}
								if (storage[4]) player.restoreSkill("friendfangqiu");
							}
						}
						player.removeSkill("friendyance_record");
					}
				},
			},
		},
	},
	friendfangqiu: {
		audio: 2,
		limited: true,
		trigger: { player: "friendyance_minigame" },
		check(event, player) {
			return event.player === player;
		},
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			player.awakenSkill("friendfangqiu");
			const storage = player.getStorage("friendyance_record");
			storage[4] = true;
			player.popup(storage[1]);
			game.log(player, "的预测为", "#g" + get.translation(storage[1]));
		},
	},
	friendzhugelianggongli: {
		audio: 2,
		locked: true,
	},
	//共励
	friendgongli: {
		audio: 2,
		locked: true,
		isFriendOf(player, name) {
			return player.getFriends(true).some(target => {
				if (!target.identityShown) return false;
				return get.is.playerNames(target, name);
			});
		},
	},
	//势董昭
	spmiaolve: {
		audio: "twmiaolve",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			if (!lib.inpile.includes("dz_mantianguohai")) lib.inpile.add("dz_mantianguohai");
			if (!_status.dz_mantianguohai_suits) _status.dz_mantianguohai_suits = lib.suit.slice(0);
			var list = _status.dz_mantianguohai_suits.randomRemove(2).map(function (i) {
				return game.createCard2("dz_mantianguohai", i, 5);
			});
			if (list.length) await player.gain(list, "gain2", "log");
		},
		group: "spmiaolve_damage",
		subSkill: {
			damage: {
				trigger: { player: "damageEnd" },
				async cost(event, trigger, player) {
					const { result } = await player
						.chooseButton([
							"请选择一项",
							[
								[
									["draw", "摸两张牌"],
									["gain", "从牌堆或弃牌堆中获得一张智囊"],
								],
								"textbutton",
							],
						])
						.set("ai", button => Math.random());
					event.result = {
						bool: result.bool,
						cost_data: result.links[0],
					};
				},
				async content(event, trigger, player) {
					const { cost_data } = event;
					if (cost_data == "gain") {
						const card = get.cardPile(function (c) {
							return get.zhinangs().includes(c.name);
						});
						if (card) {
							await player.gain(card);
						} else {
							player.chat("这智囊怎么一张都没有？");
						}
					} else {
						await player.draw(2);
					}
				},
			},
		},
	},
	spyingjia: {
		audio: "twyingjia",
		trigger: {
			global: "phaseEnd",
		},
		limited: true,
		filter(event, player) {
			if (!player.countCards("he")) return false;
			var history = player.getHistory("useCard"),
				map = {};
			for (var i of history) {
				if (get.type2(i.card) == "trick") {
					if (!map[i.card.name]) map[i.card.name] = true;
					else return true;
				}
			}
			return false;
		},
		skillAnimation: true,
		animationColor: "thunder",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt("twyingjia"),
					prompt2: "弃置一张牌并令一名角色进行一个额外回合",
					filterCard: lib.filter.cardDiscardable,
					filterTarget: true,
					ai1(card) {
						return 8 - get.value(card);
					},
					ai2(target) {
						if (target.hasJudge("lebu")) return -1;
						var player = _status.event.player;
						if (get.attitude(player, target) > 4) {
							return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1);
						}
						return -1;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			player.awakenSkill(event.name);
			await player.discard(cards);
			target.insertPhase("spyingjia");
			target.addTempSkill("spyingjia_draw");
		},
		subSkill: {
			draw: {
				trigger: {
					player: "phaseBegin",
				},
				filter(event, player) {
					return event.skill == "spyingjia";
				},
				async content(event, trigger, player) {
					await player.draw(2);
				},
			},
		},
	},
	//手杀薛综
	mbfunan: {
		audio: "funan",
		trigger: {
			global: ["respond", "useCard"],
		},
		filter(event, player) {
			if (!event.respondTo) return false;
			if (event.player == player) return false;
			if (player != event.respondTo[0]) return false;
			return event.cards.filterInD("od").length > 0;
		},
		check(event, player) {
			return event.cards.filterInD("od").reduce((acc, card) => {
				return acc + get.value(card);
			}, 0);
		},
		frequent: true,
		logTarget: "player",
		async content(event, trigger, player) {
			if (player.storage.mbfunan_rewrite) {
				const cards = trigger.cards.filterInD("od");
				const next = player.gain(cards, "log", "gain2");
				next.gaintag.add("mbfunan");
			} else {
				const cards = trigger.cards.filterInD("od");
				await player.gain(cards, "log", "gain2");
			}
		},
		group: "mbfunan_check",
		subSkill: {
			rewrite: {
				charlotte: true,
				init: (player, skill) => (player.storage[skill] = true),
			},
			check: {
				silent: true,
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					if (
						!player.hasHistory("lose", function (evt) {
							if (evt.getParent() != event) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("mbfunan")) return true;
							}
							return false;
						})
					) {
						return false;
					}
					return !game.hasPlayer2(function (current) {
						return (
							current != player &&
							(current.hasHistory("useCard", function (evt) {
								if (!evt.respondTo) {
									return true;
								}
								return evt.respondTo && evt.respondTo[1] == event.card;
							}) ||
								current.hasHistory("respond", function (evt) {
									if (!evt.respondTo) {
										return true;
									}
									return evt.respondTo && evt.respondTo[1] == event.card;
								}))
						);
					});
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	mbjiexun: {
		audio: "jiexun",
		trigger: {
			player: "phaseJieshuBegin",
		},
		async cost(event, trigger, player) {
			const { result } = await player.chooseControl(lib.suit.slice(), "cancel2");
			if (result.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		async content(event, trigger, player) {
			const { cost_data } = event;
			let num = 0;
			player.addSkill("mbjiexun_used");
			player.addMark("mbjiexun_used", 1, false);
			game.filterPlayer().forEach(p => {
				num += p.countCards("ej", function (card) {
					return get.suit(card) == cost_data;
				});
			});
			const {
				result: {
					targets: [target],
				},
			} = await player.chooseTarget(lib.filter.notMe, true).set("ai", function (target) {
				return get.attitude(get.player(), target) > 0;
			});
			await target.draw(num);
			await target.chooseToDiscard(true, player.countMark("mbjiexun_used"));
			if (target.countCards("h") === 0) {
				player.addSkill("mbfunan_rewrite");
			}
		},
		subSkill: {
			used: {
				init(player, skill) {
					player.storage[skill] = 0;
				},
			},
		},
	},
	//势太史慈 --- by 刘巴
	potzhanlie: {
		audio: 3,
		trigger: { global: "phaseBegin" },
		forced: true,
		locked: false,
		logAudio: () => 2,
		content() {
			const effectMap = new Map([
				["hp", player.getHp()],
				["damagedHp", player.getDamagedHp()],
				["countplayer", game.countPlayer()],
			]);
			const num = effectMap.get(player.storage.potzhanlie) || player.getAttackRange();
			player.addTempSkill("potzhanlie_addMark");
			if (num > 0) player.addMark("potzhanlie_addMark", num, false);
		},
		get limit() {
			return 6;
		},
		group: "potzhanlie_lie",
		subSkill: {
			addMark: {
				charlotte: true,
				onremove: true,
				audio: "potzhanlie3.mp3",
				trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] },
				getIndex(event, player) {
					return Math.min(
						event.getd().filter(i => i.name === "sha").length,
						get.info("potzhanlie").limit - player.countMark("potzhanlie_lie"),
						Math.max(
							player.countMark("potzhanlie_addMark") -
								game
									.getGlobalHistory(
										"everything",
										evt => {
											if (evt === event) return false;
											return ["lose", "loseAsync", "cardsDiscard"].includes(evt.name) && evt.getd().some(i => i.name === "sha");
										},
										event
									)
									.reduce((sum, evt) => sum + evt.getd().filter(i => i.name === "sha").length, 0),
							0
						)
					);
				},
				forced: true,
				content() {
					player.addMark("potzhanlie_lie", 1);
				},
				intro: { content: "本回合前#张【杀】进入弃牌堆后，获得等量“烈”标记" },
			},
			lie: {
				trigger: { player: "phaseUseEnd" },
				filter: (event, player) => player.hasUseTarget(new lib.element.VCard({ name: "sha" }), false),
				direct: true,
				content() {
					const str = player.hasMark("potzhanlie_lie") ? "移去所有“烈”，" : "";
					player.chooseUseTarget("###" + get.prompt("potzhanlie") + '###<div class="text center">' + str + "视为使用一张无次数限制的【杀】</div>", new lib.element.VCard({ name: "sha" }), false).set("oncard", () => {
						const event = get.event(),
							{ player } = event,
							num = player.countMark("potzhanlie_lie");
						player.addTempSkill("potzhanlie_buff");
						player.clearMark("potzhanlie_lie");
						event.set("potzhanlie", Math.floor(num / 3));
					}).logSkill = "potzhanlie";
				},
				marktext: "烈",
				intro: {
					name: "烈",
					content: "mark",
				},
			},
			buff: {
				charlotte: true,
				trigger: { player: "useCard1" },
				filter: event => event?.potzhanlie,
				forced: true,
				locked: false,
				popup: false,
				async content(event, trigger, player) {
					const num = trigger.potzhanlie,
						str = get.translation(trigger.card);
					const result = await player
						.chooseButton([
							"战烈：是否选择至多" + get.cnNumber(num) + "项执行？",
							[
								[
									["目标+1", "令" + str + "可以额外指定一个目标"],
									["伤害+1", "令" + str + "基础伤害值+1"],
									["弃牌响应", "令" + str + "需额外弃置一张牌方可响应"],
									["摸牌", str + "结算完毕后，你摸两张牌"],
								],
								"textbutton",
							],
						])
						.set("selectButton", [1, num])
						.set("ai", button => {
							const player = get.player(),
								trigger = get.event().getTrigger(),
								choice = button.link;
							switch (choice) {
								case "目标+1":
									return Math.max(
										...game
											.filterPlayer(target => {
												return !trigger.targets?.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
											})
											.map(target => get.effect(target, trigger.card, player, player))
									);
								case "伤害+1":
									return (trigger.targets || []).reduce((sum, target) => {
										const effect = get.damageEffect(target, player, player);
										return (
											sum +
											effect *
												(target.hasSkillTag("filterDamage", null, {
													player: player,
													card: trigger.card,
												})
													? 1
													: 1 + (trigger.baseDamage || 1) + (trigger.extraDamage || 0))
										);
									}, 0);
								case "弃牌响应":
									return (trigger.targets || []).reduce((sum, target) => {
										const card = get.copy(trigger.card);
										game.setNature(card, "stab");
										return sum + get.effect(target, card, player, player);
									}, 0);
								case "摸牌":
									return get.effect(player, { name: "draw" }, player, player) * 2;
							}
						})
						.forResult();
					if (result.bool) {
						const choices = result.links;
						game.log(player, "选择了", "#g【战烈】", "的", "#y" + choices);
						for (const choice of choices) {
							player.popup(choice);
							switch (choice) {
								case "目标+1":
									player
										.when("useCard2")
										.filter(evt => evt === trigger)
										.then(() => {
											player
												.chooseTarget("是否为" + get.translation(trigger.card) + "增加一个目标？", (card, player, target) => {
													const evt = get.event().getTrigger();
													return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
												})
												.set("ai", target => {
													const player = get.player(),
														evt = get.event().getTrigger();
													return get.effect(target, evt.card, player);
												});
										})
										.then(() => {
											if (result?.bool && result.targets?.length) {
												const [target] = result.targets;
												player.line(target, trigger.card.nature);
												trigger.targets.add(target);
												game.log(target, "成为了", trigger.card, "的额外目标");
											}
										});
									break;
								case "伤害+1":
									trigger.baseDamage++;
									game.log(trigger.card, "造成的伤害", "#y+1");
									break;
								case "弃牌响应":
									player.addTempSkill("potzhanlie_guanshi");
									player.markAuto("potzhanlie_guanshi", [trigger.card]);
									break;
								case "摸牌":
									player
										.when("useCardAfter")
										.filter(evt => evt === trigger)
										.then(() => player.draw(2));
									break;
							}
						}
					}
				},
			},
			guanshi: {
				charlotte: true,
				onremove: true,
				audio: "potzhanlie",
				trigger: { player: "useCardToBegin" },
				filter(event, player) {
					if (!event.target?.isIn()) return false;
					return !event.getParent().directHit.includes(event.target) && player.getStorage("potzhanlie_guanshi").includes(event.card);
				},
				forced: true,
				logTarget: "target",
				async content(event, trigger, player) {
					const { target } = trigger;
					const { result } = await target.chooseToDiscard("战烈：弃置一张牌，否则不可响应" + get.translation(trigger.card)).set("ai", card => {
						const player = get.player(),
							trigger = get.event().getTrigger();
						if (get.effect(player, trigger.card, trigger.player, player) >= 0) return 0;
						const num = player.countCards("hs", { name: "shan" });
						if (num === 0) return 0;
						if (card.name === "shan" && num <= 1) return 0;
						return 8 - get.value(card);
					});
					if (!result?.bool) {
						trigger.set("directHit", true);
						game.log(target, "不可响应", trigger.card);
					}
				},
			},
		},
	},
	pothanzhan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			for (const drawer of [player, target]) {
				const num = (() => {
					return (
						({
							hp: drawer.getHp(),
							damagedHp: drawer.getDamagedHp(),
							countplayer: game.countPlayer(),
						}[player.storage.pothanzhan] || drawer.maxHp) - drawer.countCards("h")
					);
				})();
				if (num > 0) await drawer.draw(Math.min(num, 3));
			}
			const juedou = new lib.element.VCard({ name: "juedou" });
			if (player.canUse(juedou, target)) await player.useCard(juedou, target, false);
		},
		ai: {
			order(item, player) {
				if ((player.countCards("h", { name: "sha" }) || player.maxHp - player.countCards("h")) > 1) return 10;
				return 1;
			},
			result: {
				target(player, target) {
					return (
						get.effect(target, new lib.element.VCard({ name: "juedou" }), player, player) -
						Math.max(
							0,
							Math.min(
								3,
								(() => {
									return (
										({
											hp: target.getHp(),
											damagedHp: target.getDamagedHp(),
											countplayer: game.countPlayer(),
										}[player.storage.pothanzhan] || target.maxHp) - target.countCards("h")
									);
								})()
							)
						) *
							get.effect(target, { name: "draw" }, player, player)
					);
				},
			},
		},
	},
	potzhenfeng: {
		limited: true,
		audio: 4,
		enable: "phaseUse",
		filter(event, player) {
			return player.isDamaged() || ["pothanzhan", "potzhanlie"].some(skill => player.hasSkill(skill, null, null, false));
		},
		skillAnimation: true,
		animationColor: "metal",
		logAudio: index => (typeof index === "number" ? "potzhenfeng" + index + ".mp3" : 2),
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog("振锋：你可以选择一项", "hidden");
				dialog.add([
					[
						["recover", "回复2点体力"],
						["cover", "修改〖酣战〗和〖战烈〗描述中的“X”值"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				switch (button.link) {
					case "recover":
						return player.isDamaged();
					case "cover":
						return ["pothanzhan", "potzhanlie"].some(skill => player.hasSkill(skill, null, null, false));
				}
			},
			check(button) {
				const player = get.player();
				if (button.link == "recover") return player.getHp() + player.countCards("h", { name: "tao" }) < 2;
				if (button.link == "cover") {
					let numbers = [player.getHp(), player.getDamagedHp(), game.countPlayer()];
					if (numbers.some(c => c > player.getAttackRange())) return Math.max(...numbers) * 2;
				}
				return 0.1;
			},
			backup(links) {
				return {
					item: links[0],
					skillAnimation: true,
					animationColor: "metal",
					log: false,
					async content(event, trigger, player) {
						player.awakenSkill("potzhenfeng");
						if (get.info(event.name).item === "recover") {
							player.logSkill("potzhenfeng");
							player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow1");
							await player.recover(2);
						} else {
							let dialog = [],
								skills = ["pothanzhan", "potzhanlie"].filter(skill => player.hasSkill(skill, null, null, false)),
								list = [
									["hp", "当前体力值"],
									["damagedHp", "当前已损失体力值"],
									["countplayer", "场上存活角色数"],
								];
							dialog.push("振锋：修改" + skills.map(skill => "〖" + get.translation(skill) + "〗").join("和") + "描述中的“X”为...");
							for (const skill of skills) {
								dialog.push('<div class="text center">' + get.translation(skill) + "</div>");
								dialog.push([list.map(item => [item[0] + "|" + skill, item[1]]), "tdnodes"]);
							}
							const result = await player
								.chooseButton(dialog, [1, Math.min(2, skills.length)], true)
								.set("filterButton", button => {
									return !ui.selected.buttons.some(but => but.link.split("|")[1] === button.link.split("|")[1]);
								})
								.set("ai", button => {
									const player = get.player();
									switch (button.link.split("|")[0]) {
										case "hp":
											return player.getHp();
										case "damagedHp":
											return player.getDamagedHp();
										case "countplayer":
											return game.countPlayer();
									}
								})
								.forResult();
							if (result?.bool && result.links?.length) {
								player.logSkill("potzhenfeng", null, null, null, [get.rand(3, 4)]);
								let changeList = [];
								for (const link of result.links) {
									const [change, skill] = link.split("|");
									changeList.push(change);
									player.storage[skill] = change;
									player.popup(skill);
									game.log(player, "修改", "#g【" + get.translation(skill) + "】", "的", "#yX", "为", "#g" + list.find(item => item[0] === change)[1]);
								}
								if (changeList.length > 1 && changeList[0] === changeList[1]) {
									switch (changeList[0]) {
										case "hp":
											player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow2");
											break;
										case "damagedHp":
											player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow3");
											break;
										case "countplayer":
											player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow4");
									}
								}
							}
						}
					},
				};
			},
			prompt(links) {
				return `点击“确定”，${links[0] === "recover" ? "回复2点体力" : "修改〖酣战〗和〖战烈〗描述中的“X”值"}`;
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 15,
			threaten: 2,
			result: {
				player(player) {
					if ([player.getHp(), player.getDamagedHp(), game.countPlayer()].some(c => c > player.getAttackRange())) return 10;
					return get.recoverEffect(player, player, player);
				},
			},
		},
	},
	// SP甘夫人
	mbzhijie: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.choosePlayerCard(trigger.player, "h", get.prompt2(event.name.slice(0, -5)))
				.set("ai", button => {
					//小透不算透---by @xizifu
					const { player, target } = get.event(),
						att = get.attitude(player, target),
						type = get.type2(button.link);
					if (att === 0) return 0;
					const cards = target.getCards("hs", card => get.type2(card) === type && target.hasValueTarget(card));
					return (cards.length > 0) ^ (att < 0)
						? (() => {
								if (att < 0) return 1 + Math.random();
								return Math.max(...cards.map(card => target.getUseValue(card)));
						  })()
						: -1;
				})
				.forResult();
		},
		round: 1,
		logTarget: "player",
		async content(event, trigger, player) {
			const { cards, name } = event,
				{ player: target } = trigger;
			await player.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了【智诫】");
			target.addTempSkill(name + "_effect", "phaseUseAfter");
			target.markAuto(name + "_effect", [[player, get.type2(cards[0])]]);
		},
		subSkill: {
			effect: {
				mod: {
					aiOrder(player, card, num) {
						if (num > 0) return num + 15 * (player.getStorage("mbzhijie_effect").includes(get.type2(card)) ? 1 : -1);
					},
				},
				charlotte: true,
				onremove: true,
				intro: {
					content(storage, player) {
						const infos = [];
						for (let i = 0; i < storage.length; i++) {
							const list = storage[i];
							infos.add(`本阶段使用${get.translation(list[1])}牌后摸一张牌并弃置本回合使用此牌类型牌的次数-1张牌；本阶段结束时，若因此获得的牌数大于因此弃置的牌数，则与${get.translation(list[0])}各摸一张牌`);
						}
						return infos.join("<br>");
					},
				},
				audio: "mbzhijie",
				trigger: { player: ["useCardAfter", "phaseUseEnd"] },
				filter(event, player) {
					const skillName = "mbzhijie_effect",
						storage = player.getStorage(skillName);
					if (event.name == "useCard") return storage.some(list => list[1] == get.type2(event.card));
					const num1 = player.getHistory("gain", evt => evt.getParent(2).name == skillName && evt.getParent(event.name) == event).reduce((sum, evt) => sum + evt.cards.length, 0),
						num2 = player.getHistory("lose", evt => evt.getParent(3).name == skillName && evt.getParent(event.name) == event).reduce((sum, evt) => sum + evt.cards2.length, 0);
					return num1 > num2 && storage.some(list => list[0].isIn());
				},
				forced: true,
				async content(event, trigger, player) {
					const { name, card } = trigger;
					if (name == "useCard") {
						await player.draw();
						const num = player.getHistory(name, evt => get.type2(evt.card) == get.type2(card)).length - 1;
						if (player.countCards("he") && num) await player.chooseToDiscard("he", true, num);
					} else {
						const targets = player
							.getStorage(event.name)
							.map(list => list[0])
							.filter(i => i.isIn())
							.sortBySeat();
						await game.asyncDraw([player].concat(targets));
					}
				},
			},
		},
	},
	mbshushen: {
		audio: 2,
		trigger: {
			player: ["gainAfter", "recoverBegin"],
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			const name = event.name != "recover" ? "gain" : "recover";
			if (player.getStorage("mbshushen_used").includes(name)) return false;
			if (event.name == "recover") return game.hasPlayer(current => player != current);
			return event.getg(player).length >= 2 && game.hasPlayer(current => player != current && current.isDamaged());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), `令一名其他角色${trigger.name == "recover" ? `摸两张牌` : `回复1点体力`}`, (card, player, target) => {
					if (player == target) return false;
					return get.event().getTrigger().name == "recover" || target.isDamaged();
				})
				.set("ai", target => {
					const player = get.player();
					if (get.event().getTrigger().name == "recover") return get.effect(target, { name: "draw" }, player, player) * 2;
					return get.recoverEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const name = trigger.name != "recover" ? "gain" : "recover";
			player.addTempSkill(event.name + "_used");
			player.markAuto(event.name + "_used", [name]);
			const target = event.targets[0];
			if (trigger.name != "recover") await target.recover();
			else await target.draw(2);
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//SP甄宓
	mbbojian: {
		audio: 2,
		init(player) {
			player.addSkill("mbbojian_record");
		},
		trigger: {
			player: "phaseUseEnd",
		},
		filter(event, player) {
			const record = _status.mbbojian;
			if (!record || !record[player.playerid]) return false;
			const history = player.getHistory("useCard", evt => evt.getParent("phaseUse", true));
			const num1 = history.length,
				num2 = history.map(evt => get.suit(evt.card)).toUniqued().length,
				cards = history.reduce((list, evt) => list.addArray(evt.cards.filterInD("d")), []);
			return (num1 != record[player.playerid][0] && num2 != record[player.playerid][1]) || cards.length;
		},
		forced: true,
		async content(event, trigger, player) {
			const record = _status.mbbojian;
			const history = player.getHistory("useCard", evt => evt.getParent("phaseUse", true));
			const num1 = history.length,
				num2 = history.map(evt => get.suit(evt.card)).toUniqued().length,
				cards = history.reduce((list, evt) => list.addArray(evt.cards.filterInD("d")), []);
			if (num1 != record[player.playerid][0] && num2 != record[player.playerid][1]) await player.draw();
			else {
				const links =
					cards.length == 1
						? cards
						: await player
								.chooseButton(["博鉴：请选择要分配的牌", cards], true)
								.set("ai", button => {
									return get.value(button.link);
								})
								.forResultLinks();
				const togive = links[0];
				const { result } = await player.chooseTarget("选择获得" + get.translation(togive) + "的角色", true).set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				});
				if (result.bool) {
					await result.targets[0].gain(togive, "gain2");
				}
			}
		},
		subSkill: {
			record: {
				trigger: {
					player: "phaseUseAfter",
				},
				firstDo: true,
				charlotte: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const history = player.getHistory("useCard", evt => evt.getParent("phaseUse", true));
					const num1 = history.length,
						num2 = history.map(evt => get.suit(evt.card)).toUniqued().length;
					if (!_status.mbbojian) _status.mbbojian = {};
					_status.mbbojian[player.playerid] = [num1, num2];
					player.markSkill(event.name);
				},
				intro: {
					markcount: () => 0,
					content(storage, player) {
						const record = _status.mbbojian;
						if (!record || !record[player.playerid]) return "无信息";
						return "上个出牌阶段使用牌情况：①牌数：" + record[player.playerid][0] + "；②花色数：" + record[player.playerid][1];
					},
				},
			},
		},
	},
	mbjiwei: {
		audio: 4,
		getNum(event, player) {
			let num = 0;
			if (game.countPlayer2(current => current.hasHistory("lose")) >= 1) num++;
			if (game.countPlayer2(current => current.hasHistory("damage")) >= 1) {
				switch (get.mode()) {
					case "doudizhu": {
						num += 2;
						break;
					}
					case "identity":
						break;
					default: {
						num++;
						break;
					}
				}
			}
			if (event.name == "phase") return num;
			if (get.mode() == "identity") return Math.max(game.countPlayer(), player.getHp());
			if (game.hasPlayer2(current => !current.isAlive())) return 114514;
			return 5;
		},
		trigger: {
			player: "phaseZhunbeiBegin",
			global: "phaseEnd",
		},
		filter(event, player) {
			const num = get.info("mbjiwei").getNum(event, player);
			if (event.name == "phaseZhunbei") return player.countCards("h") >= num && game.hasPlayer(current => current != player);
			return event.player != player && num > 0;
		},
		logAudio(event, player) {
			if (event.name == "phaseZhunbei") return ["mbjiwei3.mp3", "mbjiwei4.mp3"];
			return ["mbjiwei1.mp3", "mbjiwei2.mp3"];
		},
		forced: true,
		async content(event, trigger, player) {
			const num = get.info("mbjiwei").getNum(trigger, player);
			if (trigger.name == "phase") await player.draw(num);
			else {
				const cards = player.getCards("h"),
					map = {};
				for (let color of ["red", "black", "none"]) {
					if (typeof map[color] != "number") map[color] = 0;
					map[color] += cards.filter(card => get.color(card) == color).length;
				}
				const list = [];
				for (var i in map) {
					if (map[i] > 0) list.push([`${i}2`, map[i]]);
				}
				list.sort((a, b) => b[1] - a[1]);
				let colors = list.filter(i => i[1] == list[0][1]).map(i => i[0]);
				const control = colors.length == 1 ? colors[0] : await player.chooseControl(colors).set("prompt", "济危：请选择一个颜色").forResultControl();
				let togive = player.getCards("h").filter(card => get.color(card) == control.slice(0, -1));
				if (_status.connectMode) game.broadcastAll(() => (_status.noclearcountdown = true));
				let given_map = [];
				while (togive.length) {
					const {
						result: { bool, cards, targets },
					} = await player.chooseCardTarget({
						forced: true,
						filterCard(card, player) {
							return get.event("togive").includes(card) && !card.hasGaintag("olsujian_given");
						},
						selectCard: [1, Infinity],
						position: "h",
						filterTarget: lib.filter.notMe,
						prompt: "济危：请选择要分配的卡牌和目标",
						ai1(card) {
							return !ui.selected.cards.length && card.name == "du" ? 1 : 0;
						},
						ai2(target) {
							const player = get.event("player");
							const card = ui.selected.cards[0];
							if (card) return get.value(card, target) * get.attitude(player, target);
							return 0;
						},
						togive: togive,
					});
					if (bool) {
						togive.removeArray(cards);
						const target = targets[0];
						if (given_map.some(i => i[0] == target)) {
							given_map[given_map.indexOf(given_map.find(i => i[0] == target))][1].addArray(cards);
						} else given_map.push([target, cards]);
						player.addGaintag(cards, "olsujian_given");
					} else break;
				}
				if (_status.connectMode) {
					game.broadcastAll(() => {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				if (given_map.length) {
					await game
						.loseAsync({
							gain_list: given_map,
							player: player,
							cards: given_map.slice().map(list => list[1]),
							giver: player,
							animate: "giveAuto",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
	},
	//张奋
	mbquchong: {
		audio: 4,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			if (
				!game.hasPlayer(target => {
					return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
				})
			) {
				const num = player.getAllHistory("custom", evt => evt.name == "mbquchong").length;
				const list = get.mode() == "identity" ? [0, 5, 10, 10] : [0, 2, 5, 5];
				return num < 4 && player.countMark("mbquchong") >= list[num];
			}
			return player.canMoveCard(
				null,
				true,
				game.filterPlayer(target => {
					return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
				}),
				(card, player) => {
					return card.name.startsWith("dagongche_");
				},
				"canReplace"
			);
		},
		mod: {
			aiValue(player, card, num) {
				if (!player.countCards(cardx => cardx.name.startsWith("dagongche_"), "e")) return num;
				if (card.name.startsWith("dagongche_")) return num;
				if (get.type(card) == "equip" && num > 0) return 0.3;
			},
		},
		locked: false,
		direct: true,
		logAudio: index => (typeof index === "number" ? "mbquchong" + index + ".mp3" : 4),
		async content(event, trigger, player) {
			if (
				game.hasPlayer(target => {
					return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
				})
			) {
				await player
					.moveCard(
						get.prompt("mbquchong"),
						"移动场上的一张【大攻车】",
						(card, player) => {
							return card.name.startsWith("dagongche_");
						},
						game.filterPlayer(target => {
							return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
						}),
						"canReplace"
					)
					.set("nojudge", true)
					.set("logSkill", ["mbquchong", null, null, null, [4]]);
			} else {
				const numbers = Array.from({ length: 13 }).map((_, i) => get.strNumber(i + 1));
				const list = get.mode() == "identity" ? [0, 5, 10, 10] : [0, 2, 5, 5];
				const costMark = list[player.getAllHistory("custom", evt => evt.name == "mbquchong").length];
				const result = await player
					.chooseButton(
						[
							"###" + get.prompt("mbquchong") + '###<div class="text center">消耗' + parseFloat(costMark) + "点铸造值，制造任意花色和点数的【大攻车·攻】或【大攻车·守】</div>",
							[["dagongche_attack", "dagongche_defend"].map(i => [i, get.translation(i)]), "tdnodes"],
							[
								lib.suit
									.slice()
									.reverse()
									.map(i => [i, get.translation(i)]),
								"tdnodes",
							],
							[numbers, "tdnodes"],
						],
						3
					)
					.set("filterButton", button => {
						return !ui.selected.buttons.some(but => {
							return [["dagongche_attack", "dagongche_defend"], lib.suit, get.event("numbers")].some(list => list.includes(but.link) && list.includes(button.link));
						});
					})
					.set("numbers", numbers)
					.set("ai", () => 1 + Math.random())
					.forResult(); //插眼，PZ157
				if (result.bool) {
					const equips = result.links.sort((a, b) => {
						return lib.suit.includes(a) + (numbers.includes(a) ? 2 : 0) - (lib.suit.includes(b) + (numbers.includes(b) ? 2 : 0));
					});
					const card = game.createCard(equips[0], equips[1], get.numString(equips[2]));
					if (!card.storage) card.storage = {};
					if (typeof card.storage.mbquchong != "number") {
						card.storage.mbquchong = card.name == "dagongche_attack" ? 2 : 3;
					}
					lib.skill.mbquchong.broadcast(card);
					const resultx = await player
						.chooseTarget("令一名角色获得" + get.translation(card) + "并使用之", true)
						.set("ai", target => {
							const player = get.event().player,
								att = get.attitude(player, target);
							if (!target.canEquip(get.event().card)) return att;
							return att * (2.5 - target.countCards("e"));
						})
						.set("card", card)
						.forResult();
					if (resultx.bool) {
						const target = resultx.targets[0];
						player.logSkill("mbquchong", target, null, null, [card.name == "dagongche_attack" ? 3 : 2]);
						if (costMark > 0) player.removeMark("mbquchong", costMark);
						player.getHistory("custom").push({ name: "mbquchong" });
						await target.gain(card, "gain2");
						if (get.position(card) == "h" && get.owner(card) == target && target.hasUseTarget(card)) {
							await target.chooseUseTarget(card, "nopopup", false, true);
						}
					}
				}
			}
		},
		broadcast(card) {
			game.broadcast(
				(card, storage) => {
					card.storage = storage;
				},
				card,
				card.storage
			);
		},
		marktext: "铸",
		intro: {
			name: "铸造点",
			content: "当前拥有#铸造点",
		},
		group: ["mbquchong_recast", "mbquchong_remove"],
		derivation: ["dagongche_attack", "dagongche_defend"],
		subSkill: {
			recast: {
				audio: "mbquchong1.mp3",
				inherit: "drlt_huairou",
			},
			remove: {
				audio: "mbquchong1.mp3",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return get.discardPile(i => get.type(i, false) == "equip");
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const cards = Array.from(ui.discardPile.childNodes).filter(i => get.type(i, false) == "equip");
					await game.cardsGotoSpecial(cards);
					await player.showCards(cards, get.translation(player) + "发动了【渠冲】");
					game.log(cards, "被移出了游戏");
					player.addMark("mbquchong", cards.length);
				},
			},
			effect: {
				equipSkill: true,
				trigger: {
					player: ["loseBefore", "mbquchongOnRemove", "equipBefore", "equipAfter"],
				},
				filter(event, player, name) {
					if (name == "mbquchongOnRemove") {
						return player.hasCard(card => card.name.startsWith("dagongche_") && card.storage?.mbquchong <= 0, "e");
					}
					if (event.name == "equip") {
						if (name == "equipBefore") return true;
						if (!event.card.name.startsWith("dagongche_")) return false;
						return player.hasCard(card => {
							return !event.cards.includes(card) && lib.filter.cardDiscardable(card, player);
						}, "e");
					}
					if (event.getParent(2).name == "disableEquip") return false;
					if (event.getParent(3).name == "mbquchong" || event.getParent(3).name == "mbquchong_recast") return false;
					return player.hasCard(card => {
						if (!event.cards.includes(card)) return false;
						return card.name.startsWith("dagongche_") && card.storage?.mbquchong > 0;
					}, "e");
				},
				forced: true,
				async content(event, trigger, player) {
					if (event.triggername == "mbquchongOnRemove") {
						const cards = player.getCards("e", card => card.name.startsWith("dagongche_") && card.storage?.mbquchong <= 0);
						await player.lose(cards, ui.special);
						for (const card of cards) {
							card.fix();
							card.remove();
							card.destroyed = true;
						}
						game.log(cards, "被移出了游戏");
					} else if (trigger.name == "equip") {
						if (event.triggername == "equipBefore") trigger.cancel();
						else
							await player.discard(
								player.getCards("e", card => {
									return !trigger.cards.includes(card) && lib.filter.cardDiscardable(card, player);
								})
							);
					} else {
						const cards = player.getCards("e", card => {
							if (!trigger.cards.includes(card)) return false;
							return card.name.startsWith("dagongche_") && card.storage?.mbquchong > 0;
						});
						trigger.cards.removeArray(cards);
						for (const card of cards) {
							card.storage.mbquchong--;
							game.log(card, "减少了", "#y1点", "#g耐久值");
							lib.skill.mbquchong.broadcast(card);
						}
						await event.trigger("mbquchongOnRemove");
					}
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (!target.hasCard(card => card.name.startsWith("dagongche_"), "e")) return;
							if (player == target && get.type(card) == "equip") return 0;
						},
					},
				},
			},
		},
	},
	dagongche_attack_skill: {
		equipSkill: true,
		trigger: { source: "damageBegin3" },
		filter(event, player) {
			if (
				!player.hasCard(card => {
					return card.name == "dagongche_attack" && card.storage?.mbquchong > 0;
				}, "e")
			)
				return false;
			return game.roundNumber > 0;
		},
		logTarget: "player",
		prompt2(event, player) {
			return "令对" + get.translation(event.player) + "造成的伤害+" + parseFloat(Math.min(3, game.roundNumber));
		},
		check(event, player) {
			return get.damageEffect(event.player, player, player) > 0;
		},
		async content(event, trigger, player) {
			trigger.num += Math.min(3, game.roundNumber);
			const cards = player.getCards("e", card => {
				return card.name == "dagongche_attack" && card.storage?.mbquchong > 0;
			});
			for (const card of cards) {
				card.storage.mbquchong--;
				game.log(card, "减少了", "#y1点", "#g耐久值");
				lib.skill.mbquchong.broadcast(card);
			}
			await event.trigger("mbquchongOnRemove");
		},
	},
	dagongche_defend_skill: {
		equipSkill: true,
		trigger: { player: "damageBegin3" },
		filter(event, player) {
			if (
				!player.hasCard(card => {
					return card.name == "dagongche_defend" && card.storage?.mbquchong > 0;
				}, "e")
			)
				return false;
			return game.roundNumber > 0;
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const cards = player.getCards("e", card => {
				return card.name == "dagongche_defend" && card.storage?.mbquchong > 0;
			});
			for (const card of cards) {
				const num = Math.min(trigger.num, card.storage.mbquchong);
				trigger.num -= num;
				card.storage.mbquchong -= num;
				game.log(card, "减少了", "#y" + num + "点", "#g耐久值");
				lib.skill.mbquchong.broadcast(card);
				if (trigger.num <= 0) break;
			}
			await event.trigger("mbquchongOnRemove");
		},
	},
	mbxunjie: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			if (!event.source || event.source.getHp() <= player.getHp()) return false;
			return !game.hasPlayer(target => {
				return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
			});
		},
		forced: true,
		logTarget: "source",
		async content(event, trigger, player) {
			const result = await player
				.judge(card => {
					return get.color(card) == "red" ? 2 : -2;
				})
				.set("judge2", result => Boolean(result.bool))
				.forResult();
			if (result.color == "red") trigger.num--;
		},
		ai: {
			combo: "mbquchong",
			effect: {
				target(card, player, target) {
					if (
						player.getHp() <= target.getHp() ||
						game.hasPlayer(current => {
							return current.hasCard(card => card.name.startsWith("dagongche_"), "e");
						})
					)
						return;
					if (player.hasSkillTag("jueqing", false, target)) return;
					const num = get.tag(card, "damage");
					if (num) {
						if (num > 1) return 0.55;
						return 0.05;
					}
				},
			},
		},
	},
	//贾充
	mbbeini: {
		audio: "beini",
		inherit: "beini",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const str = get.translation(target);
			const {
				result: { index },
			} = await player
				.chooseControl()
				.set("choiceList", [`摸两张牌，然后令${str}视为对自己使用【杀】或弃置自己场上一张牌`, `令${str}摸两张牌，然后视为对其使用【杀】或弃置其场上一张牌`])
				.set("ai", () => {
					const evt = _status.event.getParent(),
						player = evt.player,
						target = evt.target;
					const card = { name: "sha", isCard: true },
						att = get.attitude(player, target) > 0;
					if (!target.canUse(card, player, false) || get.effect(player, card, target, player) >= 0) return 0;
					if (att && (!player.canUse(card, target, false) || get.effect(target, card, player, player) >= 0)) return 1;
					if (target.hasSkill("nogain") && player.canUse(card, target, false) && get.effect(target, card, player, player) > 0) return 1;
					if (player.hasShan()) return 0;
					if (att && target.hasShan()) return 1;
					return 0;
				});
			const list = [player, target];
			if (index == 1) list.reverse();
			await list[0].draw(2);
			const sha = get.autoViewAs({ name: "sha", isCard: true });
			const choices = [];
			const choiceList = [`视为对${get.translation(list[0])}使用一张【杀】`, `弃置${get.translation(list[0])}场上一张牌`];
			if (list[1].canUse("sha", list[0], false)) choices.push("选项一");
			else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			if (list[0].countGainableCards(list[1], "ej")) choices.push("选项二");
			else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			if (!choices.length) return;
			const control =
				choices.length == 1
					? choices[0]
					: await list[1]
							.chooseControl(choices)
							.set("choiceList", choiceList)
							.set("prompt", "悖逆：请选择一项")
							.set("ai", () => {
								const player = get.player(),
									target = get.event("target");
								const eff2 = get.effect(target, { name: "sha" }, player, player),
									eff1 = get.effect(target, { name: "guohe_copy2" }, player, player);
								return eff1 > eff2 ? "选项一" : "选项二";
							})
							.set("target", list[0])
							.forResultControl();
			if (control == "选项一") await list[1].useCard(sha, list[0], false, "noai");
			else await list[1].gainPlayerCard(list[0], "ej", true);
		},
	},
	mbdingfa: {
		audio: "dingfa",
		trigger: {
			player: "phaseDiscardAfter",
		},
		filter(event, player) {
			let num = 0;
			player.getHistory("lose", evt => {
				num += evt.cards2.length;
			});
			return num >= 3 && (player.isDamaged() || game.hasPlayer(current => current.countDiscardableCards(player, "he")));
		},
		async cost(event, trigger, player) {
			const choices = [];
			const choiceList = ["回复1点体力", "弃置一名角色至多两张牌"];
			if (player.isDamaged()) choices.push("选项一");
			else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			if (game.hasPlayer(current => current.countDiscardableCards(player, "he"))) choices.push("选项二");
			else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			const control = await player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt(event.name.slice(0, -5)))
				.set("ai", () => {
					const player = get.player();
					const choices = get.event().controls.slice().remove("cancel2");
					const eff = get.recoverEffect(player, player, player);
					if (!game.hasPlayer(current => get.effect(current, { name: "guohe_copy2" }, player, player) > eff)) choices.remove("选项二");
					else if (choices.includes("选项二")) return "选项二";
					if (eff <= 0) choices.remove("选项一");
					if (!choices.length) return "cancel2";
					return choices.randomGet();
				})
				.forResultControl();
			event.result = {
				bool: control != "cancel2",
				cost_data: control,
			};
		},
		async content(event, trigger, player) {
			if (event.cost_data == "选项一") await player.recover();
			else {
				const targets = await player
					.chooseTarget(
						"选择一名角色弃置其至多两张牌",
						(card, player, target) => {
							return target.countDiscardableCards(player, "he");
						},
						true
					)
					.set("ai", target => {
						const player = get.player();
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.forResultTargets();
				if (!targets || !targets.length) return;
				const target = targets[0];
				await player.discardPlayerCard(target, "he", true, [1, 2]);
			}
		},
	},
	//司马伷
	mbbifeng: {
		audio: 3,
		trigger: {
			target: "useCardToTarget",
			global: "useCardAfter",
		},
		filter(event, player, name) {
			if (name == "useCardAfter") return player.getStorage("mbbifeng").includes(event.card);
			if (event.targets && event.targets.length > 4) return false;
			return ["trick", "basic"].includes(get.type(event.card));
		},
		logAudio: index => (typeof index === "number" ? "mbbifeng" + index + ".mp3" : 3),
		async cost(event, trigger, player) {
			if (event.triggername == "useCardAfter") event.result = { bool: true };
			else
				event.result = await player
					.chooseBool(get.prompt2("mbbifeng"))
					.set("ai", () => get.event("bool"))
					.set(
						"bool",
						(function () {
							let cancel = get.effect(player, trigger.card, trigger.player, player),
								name = trigger.card.name;
							if (get.effect(player, { name: "losehp" }, player, player) - cancel > 0) return true;
							if (2 * get.effect(player, { name: "draw" }, player, player) - cancel <= 0) return false;
							let targets = trigger.targets.filter(current => {
								return player !== current && get.effect(current, trigger.card, trigger.player, current) < 0;
							});
							if (name === "sha")
								return targets.some(target => {
									return target.mayHaveShan(player, "use");
								});
							if (name === "juedou" || name === "nanman")
								return targets.some(target => {
									return target.mayHaveSha(player, "respond");
								});
							/*if (name === "jiedao") return targets.some(target => {
						return target.mayHaveSha(player, "use");
					});*/
							if (name === "wanjian")
								return targets.some(target => {
									return target.mayHaveShan(player, "respond");
								});
							if (name === "qizhengxiangsheng")
								return targets.some(target => {
									return target.mayHaveSha(player, "respond") || target.mayHaveShan(player, "respond");
								});
							return false;
						})()
					)
					.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			if (event.triggername == "useCardAfter") {
				player.unmarkAuto("mbbifeng", trigger.card);
				if (
					game.hasPlayer(current => {
						if (current == player) return false;
						let respondEvts = [];
						respondEvts.addArray(current.getHistory("useCard")).addArray(current.getHistory("respond"));
						respondEvts = respondEvts.filter(i => i.respondTo).map(evt => evt.respondTo);
						return respondEvts.some(list => {
							return list[1] == trigger.card;
						});
					})
				) {
					player.logSkill("mbbifeng", null, null, null, [3]);
					await player.draw(2);
				} else {
					player.logSkill("mbbifeng", null, null, null, [2]);
					await player.loseHp();
				}
			} else {
				player.logSkill("mbbifeng", null, null, null, [1]);
				trigger.getParent().excluded.add(player);
				player.markAuto("mbbifeng", trigger.card);
			}
		},
	},
	mbsuwang: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (player.getHistory("damage").length > 1 - ["identity", "doudizhu"].includes(get.mode())) return false;
			return event.player.hasHistory("useCard", evt => evt.targets && evt.targets.includes(player));
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.addToExpansion(get.cards(1), "draw").gaintag.add("mbsuwang");
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		group: "mbsuwang_draw",
		subSkill: {
			draw: {
				audio: "mbsuwang",
				trigger: {
					player: "phaseDrawBegin1",
				},
				filter(event, player) {
					return !event.numFixed && player.getExpansions("mbsuwang").length;
				},
				async cost(event, trigger, player) {
					const cards = player.getExpansions("mbsuwang");
					event.result = await player
						.chooseBool(get.prompt("mbsuwang"), "放弃摸牌并获得" + get.translation(cards))
						.set("choice", trigger.num <= cards.length)
						.forResult();
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("mbsuwang");
					trigger.changeToZero();
					await player.gain(cards, "gain2");
					if (cards.length >= 0) {
						const result = await player
							.chooseTarget("是否令一名其他角色摸两张牌?", lib.filter.notMe)
							.set("ai", function (target) {
								return get.effect(target, { name: "draw" }, _status.event.player, _status.event.player);
							})
							.forResult();
						if (result.bool) {
							player.line(result.targets[0], "green");
							await result.targets[0].draw(2);
						}
					}
				},
			},
		},
	},
	//文钦
	mbbeiming: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), "令至多两名角色获得武器牌", [1, 2])
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			for (const target of targets) {
				const suits = [];
				for (const card of target.getCards("h")) suits.add(get.suit(card));
				const equip = get.cardPile2(card => {
					if (get.subtype(card) != "equip1") return false;
					const info = get.info(card, false);
					if (!info) return false;
					if (!info.distance || typeof info.distance.attackFrom != "number") return suits.length == 1;
					return 1 - info.distance.attackFrom == suits.length;
				});
				if (equip) await target.gain(equip, "gain2");
			}
		},
	},
	mbchoumang: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		usable: 1,
		filter(event, player) {
			return event.card.name == "sha" && event.targets.length == 1;
		},
		async cost(event, trigger, player) {
			const list = ["选项一", "选项二"],
				target = event.triggername == "useCardToPlayered" ? trigger.target : trigger.player;
			if (player.getEquip(1) || target.getEquip(1)) list.push("背水！");
			list.push("cancel2");
			const result = await player
				.chooseControl(list)
				.set("choiceList", ["令此【杀】伤害+1", "若此【杀】被【闪】抵消，你可以获得与你距离为1以内的一名其他角色区域里的一张牌", "背水！弃置你与其装备区的武器牌并执行所有选项"])
				.set("prompt", get.prompt("mbchoumang"))
				.set(
					"result",
					(function () {
						let eff = 0;
						for (const targetx of trigger.targets) eff += get.effect(targetx, trigger.card, trigger.player, player);
						const bool = game.hasPlayer(current => player != current && get.distance(player, current) <= 1 && get.effect(current, { name: "shunshou_copy2" }, player, player) > 0);
						if (list.includes("背水！") && eff > 0 && bool) return "背水！";
						if (bool) return "选项二";
						if (eff > 0) return "选项一";
						return "cancel2";
					})()
				)
				.set("ai", function () {
					return _status.event.result;
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				targets: [target],
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const result = event.cost_data,
				target = event.targets[0];
			if (result == "背水！") {
				const list = [];
				if (player.getEquips(1).length) list.push([player, player.getEquips(1)]);
				if (target.getEquips(1).length) list.push([target, target.getEquips(1)]);
				await game
					.loseAsync({
						lose_list: list,
						discarder: player,
					})
					.setContent("discardMultiple");
			}
			if (result != "选项二") {
				trigger.getParent().baseDamage++;
				await game.delay();
			}
			if (result != "选项一") {
				player.addTempSkill("mbchoumang_effect");
				player.markAuto("mbchoumang_effect", trigger.card);
			}
		},
		subSkill: {
			effect: {
				trigger: {
					global: "shaMiss",
				},
				filter(event, player) {
					if (!player.getStorage("mbchoumang_effect").includes(event.card)) return false;
					return game.hasPlayer(current => player != current && get.distance(player, current) <= 1 && current.countCards("hej"));
				},
				charlotte: true,
				onremove: true,
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget("仇铓：是否获得与你距离为1以内的一名其他角色区域里的一张牌？", function (card, player, target) {
							return player != target && get.distance(player, target) <= 1 && target.countCards("hej");
						})
						.set("ai", function (target) {
							const player = _status.event.player;
							return get.effect(target, { name: "shunshou_copy2" }, player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					await player.gainPlayerCard(target, "hej", true);
					player.unmarkAuto("mbchoumang_effect", [trigger.card]);
					if (!player.getStorage("mbchoumang_effect").length) player.removeSkill("mbchoumang_effect");
				},
			},
		},
	},
	//张布
	mbchengxiong: {
		audio: 2,
		trigger: {
			player: "useCardToTargeted",
		},
		locked: false,
		filter(event, player) {
			if (get.type2(event.card) != "trick") return false;
			if (player === event.target) return false;
			const num = lib.skill.mbchengxiong.phaseUsed(event, player);
			return game.hasPlayer(current => current.countCards("he") >= num);
		},
		phaseUsed(event, player) {
			let phase = null;
			for (let i of lib.phaseName) {
				if (event.getParent(i, true)) {
					phase = i;
					break;
				}
			}
			if (!phase) return 0;
			return player.getHistory("useCard", evt => evt.getParent(phase) == event.getParent(phase)).length;
		},
		async cost(event, trigger, player) {
			const num = lib.skill.mbchengxiong.phaseUsed(trigger, player);
			event.result = await player
				.chooseTarget(get.prompt2("mbchengxiong"), function (card, player, target) {
					const num = get.event("num");
					return target.countCards("he") >= num;
				})
				.set("num", num)
				.set("color", get.color(trigger.card))
				.set("ai", function (target) {
					let player = get.player(),
						eff = get.effect(target, { name: "guohe_copy2" }, player, player);
					const color = get.event("color");
					if (target.getCards("e").some(card => get.color(card) == color)) eff += get.damageEffect(target, player, player) / 2;
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.discardPlayerCard("he", target, true)
				.set("ai", function (button) {
					let val = get.buttonValue(button);
					if (get.attitude(_status.event.player, get.owner(button.link)) > 0) val *= -1;
					if (get.position(button.link) == "e" && get.color(button.link) == get.event("color")) return (val *= 2);
					return val;
				})
				.set("color", get.color(trigger.card))
				.forResult();
			if (result.bool && get.color(result.links[0]) == get.color(trigger.card)) await target.damage();
		},
		mod: {
			aiOrder(player, card, num) {
				if (get.type2(card) == "trick") return num + 10;
			},
		},
	},
	mbwangzhuang: {
		audio: 2,
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			if (event.card) return false;
			return [event.source, event.player].includes(player);
		},
		logTarget(event, player) {
			return _status.currentPhase || player;
		},
		async content(event, trigger, player) {
			await player.draw(2);
			if (_status.currentPhase) _status.currentPhase.addTempSkill("fengyin");
		},
	},
	//王经
	mbzujin: {
		audio: 3,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hse", card => get.type(card) == "basic")) return false;
			if (player.isDamaged()) {
				if (event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && !player.getStorage("mbzujin").includes("shan")) return true;
				if (event.filterCard(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && !player.getStorage("mbzujin").includes("wuxie")) return true;
			}
			if (!player.isDamaged() || !player.isMinHp()) {
				if (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) && !player.getStorage("mbzujin").includes("sha")) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				if (player.isDamaged()) {
					if (event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && !player.getStorage("mbzujin").includes("shan")) list.push(["基本", "", "shan"]);
					if (event.filterCard(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && !player.getStorage("mbzujin").includes("wuxie")) list.push(["锦囊", "", "wuxie"]);
				}
				if (!player.isDamaged() || (!player.isMinHp() && !player.getStorage("mbzujin").includes("sha"))) {
					if (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
				}
				return ui.create.dialog("阻进", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "mbzujin",
					filterCard: card => get.type(card) == "basic",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					logAudio(event, player) {
						return "mbzujin" + (["sha", "shan", "wuxie"].indexOf(event.card.name) + 1) + ".mp3";
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						if (!player.storage.mbzujin) {
							player.storage.mbzujin = [];
							player.when({ global: "phaseEnd" }).then(() => {
								delete player.storage.mbzujin;
							});
						}
						player.markAuto("mbzujin", [event.result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return "将一张基本牌当做" + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (!player.countCards("she", card => get.type(card) == "basic")) return false;
			if (player.getStorage("mbzujin").includes(name)) return false;
			if (["shan", "wuxie"].includes(name)) return player.isDamaged();
			if (name == "sha") return !player.isDamaged() || !player.isMinHp();
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				if (!player.countCards("hse", card => get.type(card) == "basic")) return false;
				if (tag == "respondSha") return (!player.isDamaged() || !player.isMinHp()) && !player.getStorage("mbzujin").includes("sha");
				return player.isDamaged() && !player.getStorage("mbzujin").includes("shan");
			},
			order: 1,
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		subSkill: { backup: {} },
	},
	mbjiejian: {
		audio: 3,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			if (_status.connectMode)
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			const give_map = {};
			let used = [];
			do {
				const result = await player
					.chooseCardTarget({
						filterCard(card) {
							return get.itemtype(card) == "card" && !card.hasGaintag("mbjiejian_tag");
						},
						filterTarget: lib.filter.notMe,
						selectCard: [1, Infinity],
						prompt: used.length ? "是否继续分配手牌？" : get.prompt("mbjiejian"),
						prompt2: "请选择要分配的卡牌和目标",
						ai1(card) {
							if (!ui.selected.cards.length) return 8 - get.value(card);
							return 0;
						},
						ai2(target) {
							let player = _status.event.player,
								card = ui.selected.cards[0];
							let val = get.value(card),
								att = get.attitude(player, target);
							if (val <= 4) {
								if (get.event("used").includes(target)) return 0;
								return 1 / target.getUseValue(card);
							}
							return att * (target.getUseValue(card) + 4);
						},
					})
					.set("used", used)
					.forResult();
				if (result.bool && result.targets.length) {
					const id = result.targets[0].playerid,
						map = give_map;
					if (!map[id]) map[id] = [];
					map[id].addArray(result.cards);
					player.addGaintag(result.cards, "mbjiejian_tag");
					used.addArray(result.targets);
				} else break;
			} while (player.countCards("h"));
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			const list = [],
				targets = [];
			for (const i in give_map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) player.addExpose(0.2);
				targets.push(source);
				list.push([source, give_map[i]]);
			}
			event.result = {
				bool: list.length > 0,
				targets: targets,
				cost_data: list,
			};
		},
		logAudio: () => 1,
		async content(event, trigger, player) {
			const list = event.cost_data;
			await game
				.loseAsync({
					gain_list: list,
					player: player,
					cards: list.map(i => i[1]).flat(),
					giver: player,
					animate: "giveAuto",
				})
				.setContent("gaincardMultiple");
			for (let target of event.targets) {
				let num = target.hp - target.countMark("mbjiejian_mark");
				target.addMark("mbjiejian_mark", num, false);
			}
		},
		group: ["mbjiejian_liuli", "mbjiejian_remove"],
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			liuli: {
				audio: "mbjiejian2.mp3",
				trigger: {
					global: "useCardToTarget",
				},
				filter(event, player) {
					if (get.type(event.card) == "equip") return false;
					if (!event.targets || event.targets.length != 1) return false;
					if (!event.targets[0].hasMark("mbjiejian_mark")) return false;
					return !player.getStorage("mbjiejian_used").includes(event.target);
				},
				prompt2: "将此牌转移给自己",
				check(event, player) {
					return get.effect(player, event.card, event.player, player) >= get.effect(event.targets[0], event.card, event.player, player);
				},
				logTarget: "target",
				async content(event, trigger, player) {
					player.addTempSkill("mbjiejian_used");
					player.markAuto("mbjiejian_used", event.targets);
					const evt = trigger.getParent();
					evt.triggeredTargets2.removeArray(event.targets);
					evt.targets.removeArray(event.targets);
					if (lib.filter.targetEnabled2(trigger.card, trigger.player, player)) evt.targets.push(player);
					await player.draw();
				},
			},
			remove: {
				audio: "mbjiejian3.mp3",
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				filter(event, player) {
					return event.player.hasMark("mbjiejian_mark");
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = event.targets[0],
						num = target.countMark("mbjiejian_mark");
					target.removeMark("mbjiejian_mark", num, false);
					if (target.hp >= num) await player.draw(2);
				},
			},
			mark: {
				intro: {
					content: "获得“节谏”时的体力值：$",
				},
			},
		},
	},
	//新司马孚
	mbpanxiang: {
		audio: 4,
		trigger: {
			global: "damageBegin3",
		},
		async cost(event, trigger, player) {
			const { player: target, source, card } = trigger;
			const [SUB, ADD] = ["减伤", "加伤"];
			const list = ["减伤", "加伤"].filter(text => text !== (player.storage.mbpanxiang || {})[target.playerid]);
			list.push("cancel2");
			let prompt = `${get.translation(target)}即将受到${source ? "来自" + get.translation(source) : "无来源"}的${trigger.num}点伤害，你可以选择一项：`;
			const choiceTexts = [`⒈令此伤害-1${source && source.isIn() ? "，" + get.translation(source) + "摸两张牌" : ""}；`, `⒉令此伤害+1，${get.translation(target)}摸三张牌。`];
			if (!list.includes(SUB)) choiceTexts[0] = `<span style="text-decoration: line-through;">${choiceTexts[0]}（上次选过）</span>`;
			if (!list.includes(ADD)) choiceTexts[1] = `<span style="text-decoration: line-through;">${choiceTexts[1]}（上次选过）</span>`;
			choiceTexts.forEach(text => (prompt += text));
			const result = await player
				.chooseControl(list)
				.set("prompt", get.prompt("mbpanxiang", target))
				.set("prompt2", prompt)
				.set("ai", () => {
					return get.event("choice");
				})
				.set(
					"choice",
					(() => {
						const damageEff = get.damageEffect(target, source, player);
						const att = get.attitude(player, target),
							attSource = get.attitude(player, source);
						const canFilterDamage = target.hasSkillTag("filterDamage", null, {
							player: source,
							card,
						});
						if (list.includes(ADD)) {
							if (damageEff > 0) {
								if (!canFilterDamage && target.getHp() <= trigger.num + 1) return ADD;
							} else {
								if (att > 0 && (damageEff === 0 || canFilterDamage)) return ADD;
								if (
									target.getHp() +
										target.countCards("hs", card => {
											return target.canSaveCard(card, target);
										}) >
										trigger.num + 1 &&
									!list.includes(SUB)
								)
									return ADD;
							}
						}
						if (list.includes(SUB)) {
							if (att > 0 && attSource >= 0) return SUB;
							if (canFilterDamage && att > 0) return "cancel2";
							if (damageEff > 0) {
								if (target.getHp() > trigger.num && attSource > 0 && source.countCards("h") + source.getHp() <= 4) return SUB;
							} else {
								if (att > 0) {
									if (trigger.num >= target.getHp()) return SUB;
									if (
										source &&
										!source.countCards("hs", card => {
											return source.canUse(card, target, true) && get.effect(target, card, source, player) > 0;
										})
									)
										return Math.random() < 0.7 ? ADD : "cancel2";
								} else {
									if (attSource >= 0) return SUB;
									if (target.hasSkillTag("maixie") && trigger.num === 1 && damageEff < -20) return SUB;
								}
							}
						}
						return "cancel2";
					})()
				)
				.forResult();
			if (result.control !== "cancel2") {
				event.result = {
					bool: true,
					cost_data: {
						control: result.control,
					},
				};
			}
		},
		logTarget: "player",
		onremove: true,
		logAudio(event, player, name, indexedData, evt) {
			const { control } = evt.cost_data;
			return control == "减伤" ? ["mbpanxiang1.mp3", "mbpanxiang2.mp3"] : ["mbpanxiang3.mp3", "mbpanxiang4.mp3"];
		},
		async content(event, trigger, player) {
			const { control } = event.cost_data;
			const { player: target, source } = trigger;
			if (!player.storage.mbpanxiang) player.storage.mbpanxiang = {};
			player.storage.mbpanxiang[target.playerid] = control;
			player.markAuto("mbpanxiang_mark", [trigger.player]);
			if (control === "减伤") {
				trigger.num--;
				game.log(player, "令此伤害", "#y-1");
				if (source && source.isIn()) await source.draw(2);
			} else {
				trigger.num++;
				game.log(player, "令此伤害", "#y+1");
				await target.draw(3);
			}
		},
		subSkill: {
			mark: {
				mark: true,
				marktext: "襄",
				charlotte: true,
				intro: {
					content: "已对$发动过〖蹒襄〗",
				},
			},
		},
	},
	mbchenjie: {
		audio: 2,
		trigger: { global: "dieAfter" },
		filter(event, player) {
			return (
				player.hasSkill("mbpanxiang", null, false, false) &&
				player.hasAllHistory("useSkill", evt => {
					return evt.skill === "mbpanxiang" && evt.targets.includes(event.player);
				})
			);
		},
		forced: true,
		async content(event, trigger, player) {
			const cards = player.getCards("hej", card => lib.filter.cardDiscardable(card, player, "mbchenjie"));
			if (cards.length) await player.discard(cards);
			await player.draw(4);
		},
		ai: {
			combo: "mbpanxiang",
		},
	},
	//李昭焦伯
	mbzuoyou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		zhuanhuanji: true,
		filterTarget(card, player, target) {
			if (player.storage.mbzuoyou) return get.mode() == "versus" && _status.mode == "two" ? true : target.countCards("h");
			return true;
		},
		async content(event, trigger, player) {
			const storage = player.storage.mbzuoyou,
				target = event.target;
			if (event.name === "mbzuoyou") player.changeZhuanhuanji("mbzuoyou");
			if (!storage) {
				await target.draw(3);
				await target.chooseToDiscard(2, true, "h");
			} else {
				if ((get.mode() != "versus" || _status.mode != "two") && target.countCards("h")) await target.chooseToDiscard(target === player ? "佐佑" : `${get.translation(player)}对你发动了【佐佑】`, "请弃置一张手牌，然后获得1点护甲", 1, true);
				await target.changeHujia(1, null, true);
			}
		},
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player) {
				if (!storage) return "转换技。出牌阶段限一次，你可以令一名角色摸三张牌，然后其弃置两张手牌。";
				return "转换技。出牌阶段限一次，你可以令一名有手牌的角色弃置一张手牌，然后其获得1点护甲。";
			},
		},
		ai: {
			order(item, player) {
				if (
					player.storage.mbzuoyou &&
					game.hasPlayer(current => {
						return current !== player && get.effect(current, "mbzuoyou", player, player) > 0;
					})
				)
					return get.order({ name: "zengbin" }) + 0.1;
				return 2;
			},
			result: {
				target(player, target) {
					let eff = 0;
					if (player.storage.mbzuoyou) eff = target.hujia < 5 ? 1 : 0;
					else eff = 1;
					if (target === player && player.hasSkill("mbshishou")) eff /= 10;
					return eff;
				},
			},
		},
	},
	mbshishou: {
		audio: 2,
		trigger: { player: "useSkillAfter" },
		filter(event, player) {
			return event.skill === "mbzuoyou" && !event.targets.includes(player);
		},
		forced: true,
		async content(event, trigger, player) {
			await lib.skill.mbzuoyou.content(
				{
					target: player,
				},
				{},
				player
			);
		},
		ai: {
			combo: "mbzuoyou",
		},
	},
	//成济
	mbkuangli: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current !== player);
		},
		forced: true,
		group: ["mbkuangli_target", "mbkuangli_remove"],
		async content(event, trigger, player) {
			let targets = game.filterPlayer(current => current !== player).randomSort();
			targets = targets.slice(0, Math.ceil(Math.random() * targets.length));
			targets.sortBySeat();
			player.line(targets, "thunder");
			targets.forEach(current => {
				current.addSkill("mbkuangli_mark");
			});
			await game.delayx();
		},
		subSkill: {
			target: {
				audio: "mbkuangli",
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.target.hasSkill("mbkuangli_mark") && [player, event.target].some(current => current.countCards("he"));
				},
				forced: true,
				logTarget: "target",
				get usable() {
					return get.mode() == "doudizhu" ? 1 : 2;
				},
				async content(event, trigger, player) {
					const target = trigger.target,
						list = [];
					const playerCards = player.getCards("he", card => {
						return lib.filter.cardDiscardable(card, player, "mbkuangli");
					});
					if (playerCards.length > 0) list.push([player, playerCards.randomGets(1)]);
					const targetCards = target.getCards("he", card => {
						return lib.filter.cardDiscardable(card, target, "mbkuangli");
					});
					if (targetCards.length > 0) list.push([target, targetCards.randomGets(1)]);
					await game
						.loseAsync({
							lose_list: list,
							discarder: player,
						})
						.setContent("discardMultiple");
					await game.delayx();
					await player.draw(2);
					await game.delayx();
				},
				ai: {
					effect: {
						player_use(card, player, target, current) {
							if (!target) return;
							const counttrigger = player.storage.counttrigger;
							if (counttrigger && counttrigger.mbkuangli_target && counttrigger.mbkuangli_target >= lib.skill.mbkuangli_target.usable) return;
							if (target.hasSkill("mbkuangli_mark")) {
								if (get.attitude(player, target) > 0) return 0.75;
								return 1.25;
							}
						},
					},
				},
			},
			remove: {
				audio: "mbkuangli",
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					return game.hasPlayer(current => current.hasSkill("mbkuangli_mark"));
				},
				forced: true,
				async content(event, trigger, player) {
					game.countPlayer(current => {
						if (current.hasSkill("mbkuangli_mark")) {
							player.line(current);
							current.removeSkill("mbkuangli_mark");
						}
					});
				},
			},
			mark: {
				mark: true,
				marktext: "戾",
				charlotte: true,
				intro: {
					name: "狂戾",
					name2: "狂戾",
					content: "已拥有“狂戾”标记",
				},
			},
		},
	},
	mbxiongsi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") >= 3;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		filterCard: true,
		selectCard: [-1, -2],
		async content(event, trigger, player) {
			player.awakenSkill("mbxiongsi");
			const targets = game.filterPlayer(current => current !== player);
			for (const target of targets) {
				player.line(target, "thunder");
				await target.loseHp();
			}
		},
		ai: {
			order(item, player) {
				if (get.effect(player, "mbxiongsi", player) <= 0) return 1;
				if (
					player.countCards("h") > 3 &&
					player.countCards("h", card => {
						return player.hasValueTarget(card);
					}) > 0
				)
					return 0.1;
				return 8;
			},
			result: {
				player(player) {
					let eff = 0;
					game.countPlayer(current => {
						let effx = get.effect(current, { name: "losehp" }, player, player);
						if (get.attitude(player, current) < -6 && current.getHp() <= 1) effx *= 1.3;
						eff += effx;
					});
					eff *= player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 2 ? 1.5 : 0.35;
					eff -= player
						.getCards("h")
						.map(card => {
							if (lib.filter.cardDiscardable(card, player, "mbxiongsi")) return get.value(card);
							return 0;
						})
						.reduce((p, c) => p + c, 0);
					if (eff > 0) return 2;
					return -1;
				},
			},
		},
	},
	//SP母兵脸
	mbcuizhen: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return (
				(event.name != "phase" || game.phaseNumber == 0) &&
				game.hasPlayer(current => {
					return current !== player && current.hasEnabledSlot(1);
				})
			);
		},
		async cost(event, trigger, player) {
			const num = 3;
			event.result = await player
				.chooseTarget(get.prompt("mbcuizhen"), "废除至多" + get.cnNumber(num) + "名其他角色的武器栏", [1, num], (card, player, target) => {
					return target !== player && target.hasEnabledSlot(1);
				})
				.set("ai", target => {
					const player = get.event("player");
					return (1 - get.attitude(player, target)) * Math.sqrt(get.distance(player, target));
				})
				.forResult();
		},
		group: ["mbcuizhen_inphase", "mbcuizhen_draw"],
		async content(event, trigger, player) {
			const targets = event.targets.slice().sortBySeat();
			for (const target of targets) {
				if (target.identityShown) {
					if (get.mode() != "identity" || player.identity != "nei") player.addExpose(0.3);
				}
				await target.disableEquip(1);
			}
			await game.delay();
		},
		subSkill: {
			inphase: {
				audio: "mbcuizhen",
				trigger: {
					player: "useCardToPlayered",
				},
				filter(event, player) {
					if (!player.isPhaseUsing()) return false;
					if (!get.tag(event.card, "damage")) return false;
					const target = event.target;
					return target !== player && target.countCards("h") >= target.getHp() && target.hasEnabledSlot(1);
				},
				prompt2: "废除其的武器栏",
				logTarget: "target",
				check(event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				async content(event, trigger, player) {
					await trigger.target.disableEquip(1);
					await game.delayx();
				},
			},
			draw: {
				audio: "mbcuizhen",
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				locked: false,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += Math.min(
						3,
						game.countPlayer(current => {
							return current.countDisabledSlot(1);
						}) + 1
					);
				},
			},
		},
	},
	mbkuili: {
		audio: 2,
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			return event.source && event.source.isIn() && event.source.hasDisabledSlot(1);
		},
		forced: true,
		async content(event, trigger, player) {
			const source = trigger.source;
			player.line(source, "green");
			await source.enableEquip(1, player);
		},
		ai: {
			neg: true,
			effect: {
				target(card, player, target) {
					if (player && player.isIn() && get.tag(card, "damage") && player.hasDisabledSlot(1)) return [1, 0, 1, 1.5];
				},
			},
		},
	},
	//曹髦  史?! 我求你别改了
	mbqianlong: {
		audio: 6,
		persevereSkill: true,
		trigger: {
			player: ["mbqianlong_beginAfter", "mbqianlong_addAfter", "mbweitongAfter"],
		},
		filter(event, player) {
			let skills = [];
			let current = player.additionalSkills?.mbqianlong?.length ?? 0;
			let target = player.countMark("mbqianlong") == lib.skill.mbqianlong.maxMarkCount ? lib.skill.mbqianlong.derivation.length : Math.floor(player.countMark("mbqianlong") / 25);
			return target > current;
		},
		forced: true,
		popup: false,
		locked: false,
		beginMarkCount: 20,
		maxMarkCount: 99,
		derivation: ["mbcmqingzheng", "mbcmjiushi", "mbcmfangzhu", "mbjuejin"],
		addMark(player, num) {
			num = Math.min(num, lib.skill.mbqianlong.maxMarkCount - player.countMark("mbqianlong"));
			player.addMark("mbqianlong", num);
		},
		group: ["mbqianlong_begin", "mbqianlong_add", "mbqianlong_die"],
		async content(event, trigger, player) {
			const derivation = lib.skill.mbqianlong.derivation,
				skills = player.countMark("mbqianlong") == lib.skill.mbqianlong.maxMarkCount ? derivation : derivation.slice(0, Math.floor(player.countMark("mbqianlong") / 25));
			player.addAdditionalSkill("mbqianlong", skills);
		},
		marktext: "道",
		intro: {
			name: "道心(潜龙)",
			name2: "道心",
			content: "当前道心数为#",
		},
		subSkill: {
			begin: {
				audio: "mbqianlong",
				persevereSkill: true,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const num = game.hasPlayer(current => {
						return current !== player && current.group === "wei" && player.hasZhuSkill("mbweitong", current);
					})
						? 60
						: lib.skill.mbqianlong.beginMarkCount;
					lib.skill.mbqianlong.addMark(player, num);
				},
			},
			add: {
				audio: "mbqianlong",
				persevereSkill: true,
				trigger: {
					player: ["gainAfter", "damageEnd"],
					source: "damageSource",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (player.countMark("mbqianlong") >= lib.skill.mbqianlong.maxMarkCount) return false;
					if (event.name === "damage") return event.num > 0;
					return event.getg(player).length > 0;
				},
				getIndex(event, player, triggername) {
					if (event.name === "damage") return event.num;
					return 1;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					let toAdd = 5 * (1 + (trigger.name === "damage") + (event.triggername === "damageSource"));
					lib.skill.mbqianlong.addMark(player, toAdd);
				},
			},
			die: {
				trigger: {
					player: "dieBefore",
				},
				charlotte: true,
				firstDo: true,
				forced: true,
				popup: false,
				forceDie: true,
				async content(event, trigger, player) {
					player.changeSkin({ characterName: "mb_caomao" }, "mb_caomao_dead");
				},
			},
		},
	},
	mbweitong: {
		audio: 1,
		persevereSkill: true,
		zhuSkill: true,
		trigger: {
			player: "mbqianlong_beginBegin",
		},
		forced: true,
		content() {},
		ai: {
			combo: "mbqianlong",
		},
	},
	old_mbcmqingzheng: {
		audio: "mbcmqingzheng",
		persevereSkill: true,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		direct: true,
		content() {
			"step 0";
			var num = 1;
			var prompt = "###" + get.prompt("sbqingzheng") + "###弃置" + get.cnNumber(num) + "种花色的所有牌";
			var next = player.chooseButton([prompt, [lib.suit.map(i => ["", "", "lukai_" + i]), "vcard"]], [num, num + 1]);
			next.set("filterButton", button => {
				var player = _status.event.player;
				if (ui.selected.buttons.length >= get.event().num) return false;
				var cards = player.getCards("h", { suit: button.link[2].slice(6) });
				return cards.length > 0 && cards.filter(card => lib.filter.cardDiscardable(card, player, "sbqingzheng")).length == cards.length;
			});
			next.set("num", num);
			next.set("ai", button => {
				var player = _status.event.player;
				return (
					15 -
					player
						.getCards("h", { suit: button.link[2].slice(6) })
						.map(i => get.value(i))
						.reduce((p, c) => p + c, 0)
				);
			});
			next.set("custom", {
				replace: {
					button(button) {
						if (!_status.event.isMine()) return;
						if (button.classList.contains("selectable") == false) return;
						var cards = _status.event.player.getCards("h", {
							suit: button.link[2].slice(6),
						});
						if (cards.length) {
							var chosen = cards.filter(i => ui.selected.cards.includes(i)).length == cards.length;
							if (chosen) {
								ui.selected.cards.removeArray(cards);
								cards.forEach(card => {
									card.classList.remove("selected");
									card.updateTransform(false);
								});
							} else {
								ui.selected.cards.addArray(cards);
								cards.forEach(card => {
									card.classList.add("selected");
									card.updateTransform(true);
								});
							}
						}
						if (button.classList.contains("selected")) {
							ui.selected.buttons.remove(button);
							button.classList.remove("selected");
							if (_status.multitarget || _status.event.complexSelect) {
								game.uncheck();
								game.check();
							}
						} else {
							button.classList.add("selected");
							ui.selected.buttons.add(button);
						}
						var custom = _status.event.custom;
						if (custom && custom.add && custom.add.button) {
							custom.add.button();
						}
						game.check();
					},
				},
				add: next.custom.add,
			});
			"step 1";
			if (result.bool) {
				var cards = result.cards;
				if (!cards.length) {
					var suits = result.links.map(i => i[2].slice(6));
					cards = player.getCards("h", card => suits.includes(get.suit(card, player)));
				}
				event.cards = cards;
				if (!cards.length) event.finish();
				else
					player
						.chooseTarget("清正：观看一名其他角色的手牌并弃置其中一种花色的所有牌", (card, player, target) => {
							return target != player && target.countCards("h");
						})
						.set("ai", target => {
							var player = _status.event.player,
								att = get.attitude(player, target);
							if (att >= 0) return 0;
							return 1 - att / 2 + Math.sqrt(target.countCards("h"));
						});
			} else event.finish();
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("mbcmqingzheng", target);
				player.discard(cards);
				var list = lib.suit
					.slice()
					.reverse()
					.concat("none")
					.filter(i => target.hasCard({ suit: i }, "h"));
				event.videoId = lib.status.videoId++;
				function createDialog(target, id) {
					var dialog = ui.create.dialog("清正：弃置" + get.translation(target) + "一种花色的所有牌");
					dialog.addNewRow({ item: get.translation("heart"), retio: 1 }, { item: target.getCards("h", { suit: "heart" }), ratio: 3 }, { item: get.translation("diamond"), retio: 1 }, { item: target.getCards("h", { suit: "diamond" }), ratio: 3 });
					dialog.addNewRow({ item: get.translation("spade"), retio: 1 }, { item: target.getCards("h", { suit: "spade" }), ratio: 3 }, { item: get.translation("club"), retio: 1 }, { item: target.getCards("h", { suit: "club" }), ratio: 3 });
					if (target.hasCard({ suit: "none" }, "h")) {
						dialog.classList.add("fullheight");
						dialog.addNewRow({ item: get.translation("none"), retio: 1 }, { item: target.getCards("h", { suit: "none" }), ratio: 8 });
					}
					dialog.css({ height: "60%" });
					dialog.videoId = id;
				}
				if (event.isMine()) createDialog(target, event.videoId);
				else if (player.isOnline2()) player.send(createDialog, target, event.videoId);
				if (list.length) {
					player
						.chooseControl(list)
						.set("dialog", get.idDialog(event.videoId))
						.set("ai", () => {
							return _status.event.control;
						})
						.set(
							"control",
							(() => {
								var getv = cards => cards.map(i => get.value(i)).reduce((p, c) => p + c, 0);
								return list.sort((a, b) => {
									return getv(target.getCards("h", { suit: b })) - getv(target.getCards("h", { suit: a }));
								})[0];
							})()
						);
				}
			} else event.finish();
			"step 3";
			game.broadcastAll("closeDialog", event.videoId);
			var cards2 = target.getCards("h", { suit: result.control });
			event.cards2 = cards2;
			target.discard(cards2, "notBySelf").set("discarder", player);
			"step 4";
			if (event.cards2.length < cards.length) target.damage();
		},
	},
	mbcmqingzheng: {
		audio: 2,
		persevereSkill: true,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		direct: true,
		async content(event, trigger, player) {
			await Promise.all(event.next);
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) game.swapPlayerAuto(player);
			/**
			 * player选择target的一种花色的牌
			 * @param {Player} player
			 * @param {Player} target
			 */
			function chooseOneSuitCard(player, target, force = false, limit, str = "请选择一个花色的牌", ai = { bool: false }) {
				const { promise, resolve } = Promise.withResolvers();
				const event = _status.event;
				event.selectedCards = [];
				event.selectedButtons = [];
				//对手牌按花色分类
				let suitCards = Object.groupBy(target.getCards("h"), c => get.suit(c, target));
				suitCards.heart ??= [];
				suitCards.diamond ??= [];
				suitCards.spade ??= [];
				suitCards.club ??= [];
				let dialog = (event.dialog = ui.create.dialog());
				dialog.classList.add("fullheight");
				event.control_ok = ui.create.control("ok", link => {
					_status.imchoosing = false;
					event.dialog.close();
					event.control_ok?.close();
					event.control_cancel?.close();
					event._result = {
						bool: true,
						cards: event.selectedCards,
					};
					resolve(event._result);
					game.resume();
				});
				event.control_ok.classList.add("disabled");
				//如果是非强制的，才创建取消按钮
				if (!force) {
					event.control_cancel = ui.create.control("cancel", link => {
						_status.imchoosing = false;
						event.dialog.close();
						event.control_ok?.close();
						event.control_cancel?.close();
						event._result = {
							bool: false,
						};
						resolve(event._result);
						game.resume();
					});
				}
				event.switchToAuto = function () {
					_status.imchoosing = false;
					event.dialog?.close();
					event.control_ok?.close();
					event.control_cancel?.close();
					event._result = ai;
					resolve(event._result);
					game.resume();
				};
				dialog.addNewRow(str);
				let keys = Object.keys(suitCards).sort((a, b) => {
					let arr = ["spade", "heart", "club", "diamond", "none"];
					return arr.indexOf(a) - arr.indexOf(b);
				});
				//添加框
				while (keys.length) {
					let key1 = keys.shift();
					let cards1 = suitCards[key1];
					let key2 = keys.shift();
					let cards2 = suitCards[key2];
					//点击容器的回调
					/**@type {Row_Item_Option['clickItemContainer']} */
					const clickItemContainer = function (container, item, allContainer) {
						if (!item?.length || item.some(card => !lib.filter.cardDiscardable(card, player, event.name))) return;
						if (event.selectedButtons.includes(container)) {
							container.classList.remove("selected");
							event.selectedButtons.remove(container);
							event.selectedCards.removeArray(item);
						} else {
							if (event.selectedButtons.length >= limit) {
								let precontainer = event.selectedButtons[0];
								precontainer.classList.remove("selected");
								event.selectedButtons.remove(precontainer);
								let suit = get.suit(event.selectedCards[0], target),
									cards = target.getCards("h", { suit: suit });
								event.selectedCards.removeArray(cards);
							}
							container.classList.add("selected");
							event.selectedButtons.add(container);
							event.selectedCards.addArray(item);
						}
						event.control_ok.classList[event.selectedButtons.length === limit ? "remove" : "add"]("disabled");
					};
					//给框加封条，显示xxx牌多少张
					function createCustom(suit, count) {
						return function (itemContainer) {
							function formatStr(str) {
								return str.replace(/[♥︎♦︎]/g, '<span style="color: red; ">$&</span>');
							}
							let div = ui.create.div(itemContainer);
							if (count) {
								div.innerHTML = formatStr(`${get.translation(suit)}牌${count}张`);
							} else {
								div.innerHTML = formatStr(`没有${get.translation(suit)}牌`);
							}
							div.css({
								position: "absolute",
								width: "100%",
								bottom: "1%",
								height: "35%",
								background: "#352929bf",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								fontSize: "1.2em",
								zIndex: "2",
							});
						};
					}
					//框的样式，不要太宽，高度最小也要100px，防止空框没有高度
					/**@type {Row_Item_Option['itemContainerCss']} */
					let itemContainerCss = {
						border: "solid #c6b3b3 2px",
						minHeight: "100px",
					};
					if (key2) {
						dialog.addNewRow(
							{
								item: cards1,
								ItemNoclick: true, //卡牌不需要被点击
								clickItemContainer,
								custom: createCustom(key1, cards1.length), //添加封条
								itemContainerCss,
							},
							{
								item: cards2,
								ItemNoclick: true, //卡牌不需要被点击
								clickItemContainer,
								custom: createCustom(key2, cards2.length),
								itemContainerCss,
							}
						);
					} else {
						dialog.addNewRow({
							item: cards1,
							ItemNoclick: true, //卡牌不需要被点击
							clickItemContainer,
							custom: createCustom(key1, cards1.length),
							itemContainerCss,
						});
					}
				}
				game.pause();
				dialog.open();
				_status.imchoosing = true;
				return promise;
			}
			let limit = event.name === "sbqingzheng" ? 3 - player.countMark("sbjianxiong") : 1;
			let next,
				str = get.prompt(event.name) + "(弃置" + get.cnNumber(limit) + "种花色的所有牌)" + '<div class="text center">' + lib.translate[event.name + "_info"] + "</div>";
			let ai = function () {
				let suits = lib.suits.slice().filter(suit => {
					let cards = player.getCards("h", { suit: suit });
					if (!cards.length || cards.filter(card => lib.filter.cardDiscardable(card, player, event.name)).length !== cards.length) return false;
					return 15 - cards.map(i => get.value(i)).reduce((p, c) => p + c, 0) > 0;
				});
				if (suits.length < limit) return { bool: false };
				suits.sort((a, b) => {
					return (
						player
							.getCards("h", { suit: a })
							.map(i => get.value(i))
							.reduce((p, c) => p + c, 0) -
						player
							.getCards("h", { suit: b })
							.map(i => get.value(i))
							.reduce((p, c) => p + c, 0)
					);
				});
				return { bool: true, cards: suits.slice(0, limit).reduce((list, suit) => list.addArray(player.getCards("h", { suit: suit })), []) };
			};
			if (event.isMine()) {
				next = chooseOneSuitCard(player, player, null, limit, str, ai);
			} else if (player.isOnline()) {
				let { promise, resolve } = Promise.withResolvers();
				player.send(chooseOneSuitCard, player, player, null, limit, str, ai);
				player.wait(result => {
					if (result == "ai") result = ai();
					resolve(result);
				});
				next = promise;
			} else next = Promise.resolve(ai());
			let result1 = await next;
			if (!result1.bool) return;
			let cards1 = result1.cards;
			let result2 = await player
				.chooseTarget("清正：观看一名其他角色的手牌并弃置其中一种花色的所有牌", (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (att >= 0) return 0;
					return 1 - att / 2 + Math.sqrt(target.countCards("h"));
				})
				.forResult();
			if (!result2.bool) return;
			let target = result2.targets[0];
			player.logSkill(event.name, target);
			await player.discard(cards1);
			let next2,
				str2 = `清正：弃置${get.translation(target)}一种花色的所有牌`;
			let ai2 = function () {
				let list = lib.suits.slice().filter(i => target.hasCard({ suit: i }, "h"));
				let getv = cards => cards.map(i => get.value(i)).reduce((p, c) => p + c, 0);
				return {
					bool: true,
					cards: target.getCards("h", {
						suit: list.sort((a, b) => {
							return getv(target.getCards("h", { suit: b })) - getv(target.getCards("h", { suit: a }));
						})[0],
					}),
				};
			};
			if (event.isMine()) {
				next2 = chooseOneSuitCard(player, target, true, 1, str2, ai2);
			} else if (player.isOnline()) {
				let { promise, resolve } = Promise.withResolvers();
				player.send(chooseOneSuitCard, player, target, true, 1, str2, ai2);
				player.wait(result => {
					if (result == "ai") result = ai2();
					resolve(result);
				});
				next2 = promise;
			} else next2 = Promise.resolve(ai2());
			let result3 = await next2;
			let cards2 = result3.cards.slice().filter(card => lib.filter.canBeDiscarded(card, player, target));
			if (cards2.length) await target.discard(cards2, "notBySelf");
			if (cards1.length > cards2.length) await target.damage(player);
			if (event.name !== "sbqingzheng" || player.countMark("sbjianxiong") >= 2) return;
			if (["sbjianxiong", "jdjianxiong"].some(skill => player.hasSkill(skill, null, null, false))) {
				const result4 = await player
					.chooseBool("是否获得1枚“治世”？")
					.set("choice", Math.random() >= 0.5)
					.forResult();
				if (result4.bool) player.addMark("sbjianxiong", 1);
			}
		},
	},
	mbcmjiushi: {
		audio: 2,
		inherit: "rejiushi",
		persevereSkill: true,
		group: ["mbcmjiushi_use", "mbcmjiushi_turnback", "mbcmjiushi_gain"],
		subSkill: {
			use: {
				hiddenCard(player, name) {
					if (name == "jiu") return !player.isTurnedOver();
					return false;
				},
				audio: "mbcmjiushi",
				enable: "chooseToUse",
				filter(event, player) {
					if (player.classList.contains("turnedover")) return false;
					return event.filterCard({ name: "jiu", isCard: true }, player, event);
				},
				content() {
					if (_status.event.getParent(2).type == "dying") {
						event.dying = player;
						event.type = "dying";
					}
					player.turnOver();
					player.useCard({ name: "jiu", isCard: true }, player);
				},
				ai: {
					order: 5,
					result: {
						player(player) {
							if (_status.event.parent.name == "phaseUse") {
								if (player.countCards("h", "jiu") > 0) return 0;
								if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) return 0;
								if (!player.countCards("h", "sha")) return 0;
								var targets = [];
								var target;
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (get.attitude(player, players[i]) < 0) {
										if (player.canUse("sha", players[i], true, true)) {
											targets.push(players[i]);
										}
									}
								}
								if (targets.length) {
									target = targets[0];
								} else {
									return 0;
								}
								var num = get.effect(target, { name: "sha" }, player, player);
								for (var i = 1; i < targets.length; i++) {
									var num2 = get.effect(targets[i], { name: "sha" }, player, player);
									if (num2 > num) {
										target = targets[i];
										num = num2;
									}
								}
								if (num <= 0) return 0;
								var e2 = target.getEquip(2);
								if (e2) {
									if (e2.name == "tengjia") {
										if (!player.countCards("h", { name: "sha", nature: "fire" }) && !player.getEquip("zhuque")) return 0;
									}
									if (e2.name == "renwang") {
										if (!player.countCards("h", { name: "sha", color: "red" })) return 0;
									}
									if (e2.name == "baiyin") return 0;
								}
								if (player.getEquip("guanshi") && player.countCards("he") > 2) return 1;
								return target.countCards("h") > 3 ? 0 : 1;
							}
							if (player == _status.event.dying || player.isTurnedOver()) return 3;
						},
					},
					effect: {
						target(card, player, target) {
							if (target.isTurnedOver()) {
								if (get.tag(card, "damage")) {
									if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
									if (target.hp == 1) return;
									return [1, target.countCards("h") / 2];
								}
							}
						},
					},
				},
			},
			turnback: {
				audio: "mbcmjiushi",
				persevereSkill: true,
				trigger: { player: "damageEnd" },
				check(event, player) {
					return player.isTurnedOver();
				},
				filter(event, player) {
					if (
						player.hasHistory("useCard", evt => {
							if (evt.card.name != "jiu" || evt.getParent().name != "mbcmjiushi_use") return false;
							return evt.getParent("damage", true) == event;
						})
					)
						return false;
					return player.isTurnedOver();
				},
				prompt(event, player) {
					return "是否发动【酒诗】，将武将牌翻面？";
				},
				content() {
					player.turnOver();
				},
			},
			gain: {
				audio: "mbcmjiushi",
				persevereSkill: true,
				trigger: { player: "turnOverAfter" },
				frequent: true,
				prompt: "是否发动【酒诗】，获得牌堆中的一张锦囊牌？",
				content() {
					var card = get.cardPile2(function (card) {
						return get.type2(card) == "trick";
					});
					if (card) player.gain(card, "draw");
				},
			},
		},
	},
	mbcmfangzhu: {
		audio: 2,
		persevereSkill: true,
		inherit: "sbfangzhu",
		filter(event, player) {
			const target = player.storage.mbcmfangzhu;
			return game.hasPlayer(current => current !== player && (target ? target != current : true));
		},
		usable: 1,
		chooseButton: {
			dialog() {
				const dialog = ui.create.dialog("放逐：令一名其他角色...", "hidden");
				dialog.add([
					[
						[1, "不能使用手牌中的非锦囊牌直到其回合结束"],
						[2, "非Charlotte技能失效直到其回合结束"],
					],
					"textbutton",
				]);
				return dialog;
			},
			check(button) {
				const player = get.player();
				if (button.link === 2) {
					if (
						game.hasPlayer(target => {
							if (target.hasSkill("mbcmfangzhu_ban") || target.hasSkill("fengyin") || target.hasSkill("baiban")) return false;
							return (
								get.attitude(player, target) < 0 &&
								["name", "name1", "name2"]
									.map((sum, name) => {
										if (target[name] && (name != "name1" || target.name != target.name1)) {
											if (get.character(target[name])) return get.rank(target[name], true);
										}
										return 0;
									})
									.reduce((p, c) => {
										return p + c;
									}, 0) > 5
							);
						})
					)
						return 6;
				}
				return button.link === 1 ? 1 : 0;
			},
			backup(links, player) {
				return {
					num: links[0],
					audio: "mbcmfangzhu",
					filterCard: () => false,
					selectCard: -1,
					filterTarget(card, player, target) {
						if (target == player) return false;
						const num = lib.skill.mbcmfangzhu_backup.num,
							storage = target.getStorage("mbcmfangzhu_ban"),
							targetx = player.storage.mbcmfangzhu;
						if (target == targetx) return false;
						return num != 1 || !storage.length;
					},
					async content(event, trigger, player) {
						const target = event.target;
						const num = lib.skill.mbcmfangzhu_backup.num;
						player.storage.mbcmfangzhu = target;
						let evt = event.getParent("phaseUse", true);
						if (evt) evt.fangzhuUsed = true;
						player
							.when("phaseUseEnd")
							.filter(evtx => !evtx.fangzhuUsed)
							.then(() => {
								player.storage.mbcmfangzhu = player;
							});
						switch (num) {
							case 1:
								target.addTempSkill("mbcmfangzhu_ban", { player: "phaseEnd" });
								target.markAuto("mbcmfangzhu_ban", ["trick"]);
								lib.skill.mbcmfangzhu_ban.init(target, "mbcmfangzhu_ban");
								break;
							case 2:
								target.addTempSkill("mbcmfangzhu_baiban", { player: "phaseEnd" });
								break;
						}
					},
					ai: {
						result: {
							target(player, target) {
								switch (lib.skill.mbcmfangzhu_backup.num) {
									case 1:
										return -target.countCards("h", card => get.type(card) != "trick") - 1;
									case 2:
										return -target.getSkills(null, null, false).reduce((sum, skill) => {
											return sum + Math.max(get.skillRank(skill, "out"), get.skillRank(skill, "in"));
										}, 0);
								}
							},
						},
					},
				};
			},
			prompt(links, player) {
				const str = "###放逐###";
				switch (links[0]) {
					case 1:
						return str + "令一名其他角色不能使用手牌中的非锦囊牌直到其回合结束";
					case 2:
						return str + "令一名其他角色的非Charlotte技能失效直到其回合结束";
				}
			},
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return game.hasPlayer(current => get.attitude(player, current) < 0) ? 1 : 0;
				},
			},
		},
		subSkill: {
			backup: {},
			baiban: {
				init(player, skill) {
					player.addSkillBlocker(skill);
					player.addTip(skill, "放逐 技能失效");
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
					player.removeTip(skill);
				},
				inherit: "baiban",
				marktext: "逐",
			},
			ban: {
				init(player, skill) {
					let storage = player.getStorage(skill);
					if (storage.length) {
						player.addTip(skill, "放逐 限" + (storage.length === 1 ? get.translation(storage[0])[0] : "手牌"));
					}
				},
				onremove(player, skill) {
					player.removeTip(skill);
					delete player.storage[skill];
				},
				charlotte: true,
				mark: true,
				marktext: "禁",
				intro: {
					markcount: () => 0,
					content(storage) {
						if (storage.length > 1) return "不能使用手牌";
						return "不能使用手牌中的非" + get.translation(storage[0]) + "牌";
					},
				},
				mod: {
					cardEnabled(card, player) {
						const storage = player.getStorage("mbcmfangzhu_ban");
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) cards.addArray(card.cards);
						if (cards.containsSome(...hs) && !storage.includes(get.type2(card))) return false;
					},
					cardSavable(card, player) {
						const storage = player.getStorage("mbcmfangzhu_ban");
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) cards.addArray(card.cards);
						if (cards.containsSome(...hs) && !storage.includes(get.type2(card))) return false;
					},
				},
			},
		},
	},
	mbjuejin: {
		audio: 2,
		persevereSkill: true,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filterCard: () => false,
		selectCard: [-1, -2],
		filterTarget: true,
		selectTarget: -1,
		multiline: true,
		async contentBefore(event, trigger, player) {
			player.changeSkin({ characterName: "mb_caomao" }, "mb_caomao_shadow");
			player.awakenSkill("mbjuejin");
		},
		async content(event, trigger, player) {
			const target = event.target;
			const delt = target.getHp(true) - 1,
				num = Math.abs(delt);
			if (delt != 0) {
				if (delt > 0) {
					const next = target.changeHp(-delt);
					next._triggered = null;
					await next;
				} else await target.recover(num);
			}
			if (num > 0) await target.changeHujia(num + (player == target ? 2 : 0), null, true);
			else if (player == target) await target.changeHujia(2, null, true);
		},
		async contentAfter(event, trigger, player) {
			game.addGlobalSkill("mbjuejin_xiangsicunwei");
			player.$fullscreenpop("向死存魏！", "thunder");
			const cards = ["cardPile", "discardPile"].map(pos => Array.from(ui[pos].childNodes)).flat();
			const filter = card => ["shan", "tao", "jiu"].includes(card.name);
			const cardx = cards.filter(filter);
			if (cardx.length) {
				await game.cardsGotoSpecial(cardx);
				game.log(cardx, "被移出了游戏");
			}
			for (const target of game.filterPlayer()) {
				const sishis = target.getCards("hej", filter);
				if (sishis.length) {
					target.$throw(sishis);
					game.log(sishis, "被移出了游戏");
					await target.lose(sishis, ui.special);
				}
			}
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					let eff = 1;
					game.countPlayer(current => {
						const att = get.attitude(player, current),
							num = Math.abs(current.getHp(true) - 1);
						const delt = Math.max(0, num + current.hujia - 5);
						eff -= att * delt;
					});
					return eff > 0 ? 1 : 0;
				},
			},
		},
		subSkill: {
			xiangsicunwei: {
				trigger: {
					global: ["loseAfter", "equipAfter", "loseAsyncAfter", "cardsDiscardAfter"],
				},
				forced: true,
				silent: true,
				firstDo: true,
				filter(event, player) {
					const nameList = ["shan", "tao", "jiu"];
					return event.getd().some(card => {
						return nameList.includes(get.name(card, false)) && get.position(card, true) === "d";
					});
				},
				async content(event, trigger, player) {
					const nameList = ["shan", "tao", "jiu"];
					const cards = trigger.getd().filter(card => {
						return nameList.includes(get.name(card, false)) && get.position(card, true) === "d";
					});
					await game.cardsGotoSpecial(cards);
					game.log(cards, "被移出了游戏");
				},
			},
		},
	},
	//杨奉
	mbxuetu: {
		audio: 4,
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			if (player.countMark("mbxuetu_status") == 2 && !game.hasPlayer(current => current != player)) return false;
			if (!game.hasPlayer(current => current.isDamaged())) {
				if (player.countMark("mbxuetu_status") == 1 && player.getStorage("mbxuetu_used").includes(1)) return false;
				if (player.countMark("mbxuetu_status") == 0 && !player.storage.mbxuetu) return false;
			}
			if (player.countMark("mbxuetu_status") !== 1 && player.getStat("skill").mbxuetu) return false;
			return true;
		},
		zhuanhuanji2(skill, player) {
			return player && player.countMark("mbxuetu_status") !== 1;
		},
		position: "he",
		onremove: ["mbxuetu", "mbxuetu_status"],
		derivation: ["mbxuetu_achieve", "mbxuetu_fail"],
		chooseButton: {
			dialog() {
				const dialog = ui.create.dialog("###血途###请选择要执行的项");
				dialog.direct = true;
				return dialog;
			},
			chooseControl(event, player) {
				let list = ["令一名角色回复1点体力", "令一名角色摸两张牌"];
				if (player.countMark("mbxuetu_status") !== 1) {
					list[player.storage.mbxuetu ? "shift" : "pop"]();
				} else {
					list = list.filter((choice, index) => {
						if (index == 0 && !game.hasPlayer(current => current.isDamaged())) return false;
						if (player.countMark("mbxuetu_status") == 2 && current == player) return false;
						return !player.getStorage("mbxuetu_used").includes(index);
					});
				}
				list.push("cancel2");
				return list;
			},
			check() {
				return get.event("controls")[0];
			},
			backup(result, player) {
				return {
					audio: "mbxuetu",
					logAudio(event, player) {
						return player.countMark("mbxuetu_status") == 2 ? ["mbxuetu3.mp3", "mbxuetu4.mp3"] : ["mbxuetu1.mp3", "mbxuetu2.mp3"];
					},
					choice: result.control.includes("回复") ? 0 : 1,
					filterCard: () => false,
					selectCard: -1,
					filterTarget(card, player, target) {
						const { choice } = get.info("mbxuetu_backup");
						if (player.countMark("mbxuetu_status") !== 2 && choice == 0) return target.isDamaged();
						if (player.countMark("mbxuetu_status") == 2) return target != player;
						return true;
					},
					async content(event, trigger, player) {
						const { choice } = get.info("mbxuetu_backup");
						const target = event.targets[0];
						const status = player.countMark("mbxuetu_status");
						player.changeZhuanhuanji("mbxuetu");
						if (status < 2) {
							player.addTempSkill("mbxuetu_used", "phaseUseAfter");
							player.markAuto("mbxuetu_used", [choice]);
							if (!choice) {
								await target.recover();
							} else {
								await target.draw(2);
							}
						} else {
							if (!choice) {
								await player.recover();
								await target.chooseToDiscard(2, true, "he");
							} else {
								await player.draw();
								await target.damage();
							}
						}
					},
					ai: {
						result: {
							target(player, target) {
								const { choice } = get.info("mbxuetu_backup");
								const status = player.countMark("mbxuetu_status");
								if (status > 1) {
									if (player.storage.mbxuetu) return get.damageEffect(target, player, target) / 10;
									return -2;
								}
								if (choice === 1) return 2;
								const eff = get.recoverEffect(target, player, player);
								return eff > 0 ? 2 : eff < 0 ? -get.sgnAttitude(player, target) : 0;
							},
							player(player, target) {
								const status = player.countMark("mbxuetu_status");
								if (status > 1) {
									if (player.storage.mbxuetu) return 1;
									return get.recoverEffect(player, player) / 6;
								}
								return 0;
							},
						},
					},
				};
			},
			prompt(result, player) {
				const { choice } = get.info("mbxuetu_backup");
				const status = player.countMark("mbxuetu_status");
				let str = "";
				if (status < 2) {
					str += "令一名角色" + (choice ? "摸两张牌" : "回复1点体力");
				} else {
					str += choice ? "摸一张牌，然后对一名其他角色造成1点伤害" : "回复1点体力，然后令一名其他角色弃置两张牌";
				}
				return `###血途###<div class="text center">${str}</div>`;
			},
		},
		mark: true,
		marktext: "☯",
		intro: {
			content: (storage, player) => {
				if (!player.countMark("mbxuetu_status")) {
					if (storage) return "转换技。出牌阶段限一次，你可以令一名角色摸两张牌。";
					return "转换技。出牌阶段限一次，你可以令一名角色回复1点体力。";
				} else {
					if (storage) return "转换技。出牌阶段限一次，你可以摸一张牌，然后对一名其他角色造成1点伤害。";
					return "转换技。出牌阶段限一次，你可以回复1点体力，然后令一名其他角色弃置两张牌。";
				}
			},
		},
		ai: {
			order(item, player) {
				const status = player.countMark("mbxuetu_status");
				if (status > 1) return Math.max(get.order({ name: "guohe" }), get.order({ name: "chuqibuyi" }));
				if (status === 1 || player.storage.mbxuetu) return 9;
				return 2;
			},
			result: { player: 1 },
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: {},
		},
	},
	mbweiming: {
		audio: 3,
		dutySkill: true,
		locked: true,
		group: ["mbweiming_achieve", "mbweiming_fail", "mbweiming_effect"],
		intro: { content: "已记录$" },
		subSkill: {
			effect: {
				audio: "mbweiming1.mp3",
				trigger: {
					player: "phaseUseBegin",
				},
				filter(event, player) {
					return game.hasPlayer(current => {
						return !player.getStorage("mbweiming").includes(current) && current != player;
					});
				},
				locked: true,
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(current => !player.getStorage("mbweiming").includes(current) && current != player);
					if (targets.length == 1) {
						event.result = { bool: true, targets: targets };
					} else {
						event.result = await player
							.chooseTarget("威命：记录一名未记录过的其他角色", "当你杀死没有被记录过的角色后，则〖威命〗使命成功；如果在你杀死这些角色中的一名之前，有被记录过的角色死亡，则你〖威命〗使命失败。", true)
							.set("filterTarget", (card, player, target) => {
								return !player.getStorage("mbweiming").includes(target) && target != player;
							})
							.set("ai", target => {
								if (target === player) return 1;
								return 1 + (Math.sqrt(Math.abs(get.attitude(player, target))) * Math.abs(get.threaten(target))) / Math.sqrt(target.getHp() + 1) / Math.sqrt(target.countCards("hes") + 1);
							})
							.forResult();
					}
				},
				async content(event, trigger, player) {
					const targets = event.targets;
					if (targets?.length) player.markAuto("mbweiming", targets[0]);
				},
			},
			achieve: {
				audio: "mbweiming2.mp3",
				trigger: {
					source: "dieAfter",
				},
				filter(event, player) {
					return !player.getStorage("mbweiming").includes(event.player);
				},
				dutySkill: true,
				forced: true,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					game.log(player, "成功完成使命");
					player.awakenSkill("mbweiming");
					player.storage.mbxuetu_status = 1;
					player.unmarkSkill("mbxuetu");
					await game.delayx();
				},
			},
			fail: {
				audio: "mbweiming3.mp3",
				trigger: {
					global: "dieAfter",
				},
				filter(event, player) {
					return player.getStorage("mbweiming").includes(event.player);
				},
				dutySkill: true,
				forced: true,
				async content(event, trigger, player) {
					game.log(player, "使命失败");
					player.awakenSkill("mbweiming");
					player.storage.mbxuetu_status = 2;
					await game.delayx();
				},
			},
		},
		ai: {
			combo: "mbxuetu",
		},
	},
	//霍骏
	sidai: {
		audio: ["twsidai1.mp3", "sidai.mp3"],
		enable: "phaseUse",
		usable: 1,
		locked: false,
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		filter(event, player) {
			var cards = player.getCards("h", { type: "basic" });
			if (!cards.length) return false;
			for (var i of cards) {
				if (!game.checkMod(i, player, "unchanged", "cardEnabled2", player)) return false;
			}
			return event.filterCard(get.autoViewAs({ name: "sha", storage: { sidai: true } }, cards), player, event);
		},
		viewAs: { name: "sha", storage: { sidai: true } },
		filterCard: { type: "basic" },
		selectCard: -1,
		check: () => 1,
		onuse(result, player) {
			player.awakenSkill("sidai");
			player.addTempSkill("sidai_tao");
			player.addTempSkill("sidai_shan");
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) + 0.1;
			},
			result: {
				target(player, target) {
					var cards = ui.selected.cards.slice(0);
					var names = [];
					for (var i of cards) names.add(i.name);
					if (names.length < player.hp) return 0;
					if (player.hasUnknown() && (player.identity != "fan" || !target.isZhu)) return 0;
					if (get.attitude(player, target) >= 0) return -20;
					return lib.card.sha.ai.result.target.apply(this, arguments);
				},
			},
		},
		subSkill: {
			tao: {
				trigger: { source: "damageSource" },
				filter(event, player) {
					if (!event.card || !event.card.storage || !event.card.storage.sidai || !event.player.isIn()) return false;
					for (var i of event.cards) {
						if (i.name == "tao") return true;
					}
					return false;
				},
				forced: true,
				popup: false,
				content() {
					trigger.player.loseMaxHp();
				},
			},
			shan: {
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					if (!event.card || !event.card.storage || !event.card.storage.sidai || !event.target.isIn()) return false;
					for (var i of event.cards) {
						if (i.name == "shan") return true;
					}
					return false;
				},
				forced: true,
				popup: false,
				content() {
					"step 0";
					trigger.target.chooseToDiscard("h", { type: "basic" }, "弃置一张基本牌，否则不能响应" + get.translation(trigger.card)).set("ai", function (card) {
						var player = _status.event.player;
						if (
							player.hasCard("hs", function (cardx) {
								return cardx != card && get.name(cardx, player) == "shan";
							})
						)
							return 12 - get.value(card);
						return 0;
					});
					"step 1";
					if (!result.bool) trigger.directHit.add(trigger.target);
				},
			},
		},
	},
	jieyu: {
		audio: ["twjieyu1.mp3", "jieyu.mp3"],
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			for (let i = 0; i < ui.discardPile.childElementCount; i++) {
				if (get.type(ui.discardPile.childNodes[i], false) == "basic") return true;
			}
			return false;
		},
		prompt2(event, player) {
			const num = lib.skill.jieyu.getNum(player);
			return "获得弃牌堆中" + get.cnNumber(num) + "张" + (num > 1 ? "牌名各不相同的" : "") + "基本牌";
		},
		async content(event, trigger, player) {
			const num = lib.skill.jieyu.getNum(player, event);
			let gains = [],
				names = [];
			for (let i = 0; i < ui.discardPile.childElementCount; i++) {
				let card = ui.discardPile.childNodes[i];
				if (get.type(card, null, false) == "basic" && !names.includes(card.name)) {
					gains.push(card);
					names.push(card.name);
				}
			}
			if (gains.length) player.gain(gains.randomGets(Math.min(gains.length, num)), "gain2");
		},
		getNum(player, event) {
			//let num = get.mode() == "identity" ? 3 : 4;
			let num = 3;
			const history = game.getAllGlobalHistory("everything");
			for (let i = history.length - 1; i >= 0; i--) {
				const evt = history[i];
				if (evt.name == "jieyu" && evt.player == player) {
					if (!event || evt != event) break;
				}
				if (evt.name == "useCard" && evt.player != player && evt.targets && evt.targets.includes(player) && get.tag(evt.card, "damage")) {
					num--;
					if (num == 1) break;
				}
			}
			return num;
		},
	},
	//木鹿大王
	shoufa: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player, name) {
			if (name == "damageSource" && player.getHistory("sourceDamage").indexOf(event) != 0) return false;
			return game.hasPlayer(target => {
				const num = get.mode() == "doudizhu" ? 1 : 2;
				if (name == "damageEnd" && get.distance(target, player) < num) return false;
				if (name == "damageSource" && get.distance(player, target) > num) return false;
				const zhoufa = player.storage.zhoulin_zhoufa;
				if (!zhoufa) return true;
				if (zhoufa == "豹" || zhoufa == "兔") return true;
				if (zhoufa == "鹰") return target.countCards("he");
				return target.countDiscardableCards(player, "e");
			});
		},
		direct: true,
		async content(event, trigger, player) {
			const zhoufa = player.storage.zhoulin_zhoufa;
			const str = zhoufa ? ["令其受到1点无来源伤害", "你随机获得其一张牌", "你随机弃置其装备区的一张牌", "令其摸一张牌"][["豹", "鹰", "熊", "兔"].indexOf(zhoufa)] : "令其随机执行一个效果";
			const nodoudizhu = (event.triggername === "damageEnd" ? "与你距离不小于" : "距离不大于") + (1 + (get.mode() !== "doudizhu")) + "的";
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(get.prompt("shoufa"), "选择一名" + nodoudizhu + "角色，" + str, (card, player, target) => {
					const name = _status.event.triggername;
					const num = get.mode() == "doudizhu" ? 1 : 2;
					if (name == "damageEnd" && get.distance(target, player) < num) return false;
					if (name == "damageSource" && get.distance(player, target) > num) return false;
					const zhoufa = player.storage.zhoulin_zhoufa;
					if (!zhoufa) return true;
					if (zhoufa == "豹" || zhoufa == "兔") return true;
					if (zhoufa == "鹰") return target.countCards("he");
					return target.countDiscardableCards(player, "e");
				})
				.set("ai", target => {
					const player = _status.event.player;
					const zhoufa = player.storage.zhoulin_zhoufa;
					if (!zhoufa) return -get.attitude(player, target);
					switch (zhoufa) {
						case "豹": {
							return get.damageEffect(target, player, player);
						}
						case "鹰": {
							return get.effect(target, { name: "guohe_copy2" }, player, player);
						}
						case "熊": {
							let att = get.attitude(player, target),
								eff = 0;
							target.getCards("e", card => {
								var val = get.value(card, target);
								eff = Math.max(eff, -val * att);
							});
							return eff;
						}
						case "兔": {
							return get.effect(target, { name: "draw" }, player, player);
						}
					}
				})
				.set("triggername", event.triggername);
			if (!bool) return;
			const target = targets[0];
			player.logSkill("shoufa", target);
			const shoufa = zhoufa ? zhoufa : ["豹", "鹰", "熊", "兔"].randomGet();
			game.log(target, "执行", "#g" + shoufa, "效果");
			switch (shoufa) {
				case "豹":
					target.damage("nosource");
					break;
				case "鹰":
					player.gain(target.getGainableCards(player, "he").randomGet(), target, "giveAuto");
					break;
				case "熊":
					target.discard(target.getGainableCards(player, "e").randomGet()).discarder = player;
					break;
				case "兔":
					target.draw();
					break;
			}
		},
	},
	yuxiang: {
		mod: {
			globalFrom(from, to, distance) {
				if (from.hujia > 0) return distance - 1;
			},
			globalTo(from, to, distance) {
				if (to.hujia > 0) return distance + 1;
			},
		},
		audio: true,
		trigger: { player: "damageBegin2" },
		filter(event, player) {
			return player.hujia > 0 && event.hasNature("fire");
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
		ai: {
			combo: "zhoulin",
		},
	},
	zhoulin: {
		audio: 2,
		limited: true,
		unique: true,
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill("zhoulin");
			player.changeHujia(2, null, true);
			const {
				result: { control },
			} = await player
				.chooseControl("豹", "鹰", "熊", "兔")
				.set("ai", () => "豹")
				.set("prompt", "选择一个固定效果");
			if (control) {
				player.popup(control);
				game.log(player, "选择了", "#g" + control, "效果");
				player.addTempSkill("zhoulin_zhoufa", { player: "phaseBegin" });
				player.storage.zhoulin_zhoufa = control;
				player.markSkill("zhoulin_zhoufa");
				game.broadcastAll(
					function (player, zhoufa) {
						if (player.marks.zhoulin_zhoufa) player.marks.zhoulin_zhoufa.firstChild.innerHTML = zhoufa;
					},
					player,
					control
				);
			}
		},
		ai: {
			order: 12,
			result: { player: 1 },
		},
		subSkill: {
			zhoufa: {
				charlotte: true,
				onremove: true,
				intro: { content: "已选择$效果" },
			},
		},
	},
	//陈珪
	guimou: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseEnd", "phaseZhunbeiBegin"],
		},
		filter(event, player, name) {
			if (event.name == "phaseZhunbei" || name == "phaseEnd") return true;
			return event.name != "phase" || game.phaseNumber == 0;
		},
		direct: true,
		locked: true,
		*content(event, map) {
			var player = map.player,
				trigger = map.trigger;
			if (trigger.name != "phaseZhunbei") {
				player.logSkill("guimou");
				var result,
					choiceList = ["惩罚期间使用牌最少的角色", "惩罚期间弃置牌最少的角色", "惩罚期间得到牌最少的角色"];
				if (trigger.name != "phase" || game.phaseNumber == 0) result = { index: get.rand(0, 2) };
				else
					result = yield player
						.chooseControl()
						.set("choiceList", choiceList)
						.set("ai", () => get.rand(0, 2));
				var str = choiceList[result.index];
				game.log(player, "选择", "#g" + str);
				player.addSkill("guimou_" + result.index);
				return;
			}
			var targets = [];
			for (var i = 0; i <= 2; i++) {
				var skill = "guimou_" + i;
				if (player.hasSkill(skill)) {
					var storage = player.storage[skill],
						nums = storage[0].slice();
					var targetx = nums.sort((a, b) => storage[1][storage[0].indexOf(a)] - storage[1][storage[0].indexOf(b)]);
					targetx = targetx.filter(target => storage[1][storage[0].indexOf(target)] == storage[1][storage[0].indexOf(targetx[0])]);
					targets.addArray(targetx);
					player.removeSkill(skill);
				}
			}
			targets = targets.filter(target => target != player && target.countCards("h"));
			if (targets.length) {
				var result = yield player
					.chooseTarget(
						"请选择【诡谋】的目标",
						"观看一名可选择的角色的手牌并选择其中一张牌，然后你可以此牌交给另一名其他角色或弃置此牌",
						(card, player, target) => {
							return _status.event.targets.includes(target) && target.countCards("h");
						},
						true
					)
					.set("ai", target => {
						return Math.sqrt(Math.min(3, target.countCards("h"))) * get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.set("targets", targets);
				if (result.bool) {
					var target = result.targets[0];
					player.logSkill("guimou", target);
					player.addExpose(0.3);
					var result2 = yield player
						.choosePlayerCard(target, "h", "visible", true)
						.set("ai", button => {
							return get.value(button.link);
						})
						.set("prompt", "诡谋：请选择" + get.translation(target) + "的一张手牌")
						.set("prompt2", '<div class="text center">将选择的牌交给另一名其他角色或弃置此牌</div>');
					if (result2.bool) {
						var cards = result2.links.slice(),
							result3;
						if (!game.hasPlayer(targetx => targetx != player && targetx != target)) result3 = { bool: false };
						else
							result3 = yield player
								.chooseTarget("是否令另一名其他角色获得" + get.translation(cards) + "？", (card, player, target) => {
									return target != player && target != _status.event.target;
								})
								.set("ai", target => get.attitude(_status.event.player, target))
								.set("target", target);
						if (result3.bool) {
							var targetx = result3.targets[0];
							player.line(targetx);
							targetx.gain(cards, target, "give");
						} else target.discard(cards).discarder = player;
					}
				}
			}
		},
		subSkill: {
			0: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = [[], []];
						var targets = game.filterPlayer(i => i !== player).sortBySeat(player);
						targets.forEach(target => {
							player.storage[skill][0].push(target);
							player.storage[skill][1].push(0);
						});
					}
				},
				mark: true,
				intro: {
					markcount: storage => 0,
					content(storage, player) {
						var str = "当前使用牌数排行榜";
						var lose = storage[1].slice().sort((a, b) => a - b)[0];
						storage[0].forEach(target => {
							str += "<br><li>";
							var score = storage[1][storage[0].indexOf(target)];
							if (score == lose) str += "<span class='texiaotext' style='color:#FF0000'>";
							str += " " + get.translation(target) + " ";
							str += score + "张";
							if (score == lose) str += "</span>";
						});
						return str;
					},
				},
				trigger: { global: "useCard1" },
				forced: true,
				popup: false,
				content() {
					var storage = player.storage["guimou_0"];
					if (!storage[0].includes(trigger.player)) {
						storage[0].push(trigger.player);
						storage[1].push(0);
					}
					storage[1][storage[0].indexOf(trigger.player)]++;
				},
			},
			1: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = [[], []];
						var targets = game.filterPlayer(i => i !== player).sortBySeat(player);
						targets.forEach(target => {
							player.storage[skill][0].push(target);
							player.storage[skill][1].push(0);
						});
					}
				},
				mark: true,
				intro: {
					markcount: storage => 0,
					content(storage, player) {
						var str = "当前弃置牌数排行榜";
						var lose = storage[1].slice().sort((a, b) => a - b)[0];
						storage[0].forEach(target => {
							str += "<br><li>";
							var score = storage[1][storage[0].indexOf(target)];
							if (score == lose) str += "<span class='texiaotext' style='color:#FF0000'>";
							str += " " + get.translation(target) + " ";
							str += score + "张";
							if (score == lose) str += "</span>";
						});
						return str;
					},
				},
				trigger: { global: ["loseAfter", "loseAsyncAfter"] },
				filter(event, player) {
					return event.type == "discard" && game.hasPlayer(target => event.getl(target).cards2.length);
				},
				forced: true,
				popup: false,
				content() {
					var storage = player.storage["guimou_1"];
					var targets = game.filterPlayer(target => trigger.getl(target).cards2.length);
					targets.forEach(target => {
						if (!storage[0].includes(target)) {
							storage[0].push(target);
							storage[1].push(0);
						}
						storage[1][storage[0].indexOf(target)] += trigger.getl(target).cards2.length;
					});
				},
			},
			2: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = [[], []];
						var targets = game.filterPlayer(i => i !== player).sortBySeat(player);
						targets.forEach(target => {
							player.storage[skill][0].push(target);
							player.storage[skill][1].push(0);
						});
					}
				},
				mark: true,
				intro: {
					markcount: storage => 0,
					content(storage, player) {
						var str = "当前得到牌数排行榜";
						var lose = storage[1].slice().sort((a, b) => a - b)[0];
						storage[0].forEach(target => {
							str += "<br><li>";
							var score = storage[1][storage[0].indexOf(target)];
							if (score == lose) str += "<span class='texiaotext' style='color:#FF0000'>";
							str += " " + get.translation(target) + " ";
							str += score + "张";
							if (score == lose) str += "</span>";
						});
						return str;
					},
				},
				trigger: { global: ["gainAfter", "loseAsyncAfter"] },
				forced: true,
				popup: false,
				content() {
					var storage = player.storage["guimou_2"];
					var targets = game.filterPlayer(target => trigger.getg(target).length);
					targets.forEach(target => {
						if (!storage[0].includes(target)) {
							storage[0].push(target);
							storage[1].push(0);
						}
						storage[1][storage[0].indexOf(target)] += trigger.getg(target).length;
					});
				},
			},
		},
	},
	zhouxian: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player != player && get.tag(event.card, "damage");
		},
		forced: true,
		logTarget: "player",
		*content(event, map) {
			var player = map.player,
				trigger = map.trigger,
				target = trigger.player;
			var cards = get.cards(3);
			yield game.cardsDiscard(cards);
			player.showCards(cards, get.translation(player) + "发动了【州贤】");
			var result = yield target
				.chooseToDiscard("he", "州贤：弃置一张其中有的类别的牌，或令此牌对" + get.translation(player) + "无效", (card, player) => {
					return _status.event.cards.some(cardx => get.type2(cardx) == get.type2(card));
				})
				.set("cards", cards)
				.set("ai", card => {
					if (!_status.event.goon) return 0;
					return 7.5 - get.value(card);
				})
				.set("goon", get.effect(player, trigger.card, target, target) > 0);
			if (!result || !result.bool) trigger.getParent().excluded.add(player);
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && get.attitude(player, target) < 0 && target != player) {
						if (_status.event.name == "zhouxian") return;
						if (get.attitude(player, target) > 0 && current < 0) return "zeroplayertarget";
						var bs = player.getDiscardableCards(player, "he");
						bs.remove(card);
						if (card.cards) bs.removeArray(card.cards);
						else bs.removeArray(ui.selected.cards);
						var cardx = Array.from(ui.cardPile.childNodes).slice(0, 3);
						bs = bs.filter(i => cardx.some(j => get.type2(j) == get.type2(i)));
						if (!bs.length) return "zerotarget";
						if (bs.length <= 2) {
							if (bs.some(bsi => get.value(bsi) < 7)) return [1, 0, 1, -0.5];
							return [1, 0, 0.3, 0];
						}
						return [1, 0, 1, -0.5];
					}
				},
			},
		},
	},
	//胡班
	mbyilie: {
		audio: 3,
		trigger: { global: "phaseBefore", player: "enterGame" },
		filter(event, player) {
			return !player.storage.mbyilie2 && (event.name != "phase" || game.phaseNumber == 0);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("mbyilie"), lib.filter.notMe, true)
				.set("ai", function (target) {
					let player = _status.event.player;
					return Math.max(1 + get.attitude(player, target) * get.threaten(target), Math.random());
				})
				.set("animate", false);
			"step 1";
			if (result.bool) {
				let target = result.targets[0];
				player.logSkill("mbyilie");
				player.storage.mbyilie2 = target;
				player.addSkill("mbyilie2");

				const func = (player, target) => {
					target.markSkillCharacter("mbyilie2", player, "义烈", `${get.translation(player)}决定追随于你`, true);
				};
				if (event.isMine()) func(player, target);
				else if (player.isOnline2()) player.send(func, player, target);
			}
		},
		marktext: "烈",
		intro: {
			name2: "烈",
			content: "mark",
		},
		group: "mbyilie3",
	},
	mbyilie2: {
		charlotte: true,
		audio: "mbyilie",
		trigger: { global: ["damageBegin4", "damageSource"] },
		sourceSkill: "mbyilie",
		filter(event, player, name) {
			var target = player.storage.mbyilie2;
			if (name == "damageSource") return event.source == target && event.player != player && player.isDamaged();
			return event.player == target && !player.countMark("mbyilie");
		},
		forced: true,
		logTarget(event, player) {
			return player.storage.mbyilie2;
		},
		content() {
			if (event.triggername == "damageSource") player.recover();
			else {
				event.targets[0].markSkillCharacter("mbyilie2", player, "义烈", `${get.translation(player)}决定追随于你`);
				player.addMark("mbyilie", trigger.num);
				trigger.cancel();
			}
		},
	},
	mbyilie3: {
		audio: "mbyilie",
		trigger: { player: "phaseEnd" },
		sourceSkill: "mbyilie",
		filter(event, player) {
			return player.hasMark("mbyilie");
		},
		forced: true,
		content() {
			"step 0";
			player.draw();
			"step 1";
			var num = player.countMark("mbyilie");
			if (num) {
				player.loseHp(num);
				player.removeMark("mbyilie", num);
			}
		},
	},
	//向朗
	naxue: {
		audio: 2,
		trigger: { player: "phaseUseBefore" },
		check(event, player) {
			var cards = player.getCards("h", card => player.hasValueTarget(card));
			if (!cards.length) return true;
			if (!(player.hp >= 2 && player.countCards("h") <= player.hp + 1)) return false;
			return game.hasPlayer(function (target) {
				if (target.hasJudge("lebu") || target == player) return false;
				if (get.attitude(player, target) > 4) {
					return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
				}
				return false;
			});
		},
		*content(event, map) {
			var player = map.player;
			map.trigger.cancel();
			var num = player.countDiscardableCards(player, "he");
			if (num) {
				var result = yield player.chooseToDiscard("纳学：是否弃置任意张牌并摸等量的牌？", "he", [1, num]).set("ai", lib.skill.zhiheng.check);
				if (result.bool) yield player.draw(result.cards.length);
			}
			if (player.countCards("h")) {
				var result2 = yield player.chooseCardTarget({
					prompt: "是否交给至多两名其他角色各一张手牌？",
					prompt2: "先按顺序选中所有要给出的牌，然后再按顺序选择等量的目标角色。",
					selectCard: [1, 2],
					filterCard: true,
					filterTarget: lib.filter.notMe,
					selectTarget() {
						return ui.selected.cards.length;
					},
					filterOk: () => {
						return ui.selected.cards.length == ui.selected.targets.length;
					},
					position: "h",
					ai1(card) {
						if (card.name == "du") return 10;
						else if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
						var player = _status.event.player;
						if (
							ui.selected.cards.length > 4 ||
							!game.hasPlayer(function (current) {
								return get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
							})
						)
							return 0;
						return 1 / Math.max(0.1, get.value(card));
					},
					ai2(target) {
						var player = _status.event.player,
							att = get.attitude(player, target);
						if (ui.selected.cards[0].name == "du") return -att;
						if (target.hasSkillTag("nogain")) att /= 6;
						return att;
					},
				});
				if (result2.bool) {
					const list = [];
					for (let i = 0; i < result2.targets.length; i++) {
						list.push([result2.targets[i], result2.cards[i]]);
						player.line(result2.targets[i]);
					}
					game.loseAsync({
						gain_list: list,
						player: player,
						cards: result2.cards,
						giver: player,
						animate: "giveAuto",
					}).setContent("gaincardMultiple");
				}
			}
		},
	},
	yijie: {
		audio: 2,
		trigger: { player: "die" },
		filter(event, player) {
			return game.hasPlayer(target => target != player);
		},
		forced: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "orange",
		logTarget(event, player) {
			return game.filterPlayer(target => target != player);
		},
		content() {
			"step 0";
			var targets = game.filterPlayer(target => target != player);
			var sum = targets.reduce((num, target) => (num += target.hp), 0);
			sum = Math.max(1, Math.floor(sum / targets.length));
			event.num = sum;
			event.targets = targets;
			"step 1";
			var target = targets.shift();
			var delta = target.hp - num;
			if (delta != 0) {
				target[delta > 0 ? "loseHp" : "recover"](Math.abs(delta));
			}
			if (targets.length) event.redo();
		},
	},
	//阎象
	kujian: {
		audio: "twkujian",
		inherit: "twkujian",
		selectCard: [1, 2],
		logAudio: () => "twkujian1.mp3",
		content() {
			player.give(cards, target).gaintag.add("twkujianx");
			player.addSkill("kujian_discard");
		},
		subSkill: {
			discard: {
				trigger: {
					global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				getIndex(event, player) {
					let list = [],
						players = game.filterPlayer().sortBySeat();
					for (const current of players) {
						let bool = ["useCard", "respond"].includes(event.getParent().name);
						if (current == player) continue;
						var evt = event.getl(current);
						if (!evt || !evt.hs || !evt.hs.length) continue;
						if (event.name == "lose") {
							for (var i in event.gaintag_map) {
								if (event.gaintag_map[i].includes("twkujianx")) list.push([current, bool]);
							}
							continue;
						}
						current.getHistory("lose", evt => {
							if (event != evt.getParent()) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("twkujianx")) list.push([current, bool]);
							}
						});
					}
					return list;
				},
				charlotte: true,
				logTarget(event, player, name, data) {
					return data[0];
				},
				logAudio(event, player, name, data) {
					let type = data[1];
					if (type) return "twkujian2.mp3";
					return "twkujian3.mp3";
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const type = event.indexedData[1];
					if (type) await game.asyncDraw([player, target], 2);
					else {
						if (player.countCards("h")) await player.chooseToDiscard(1, true, "h");
						if (target.countCards("h")) await target.chooseToDiscard(1, true, "h");
					}
				},
			},
		},
	},
	ruilian: {
		audio: "twruilian",
		trigger: { global: "roundStart" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("ruilian"))
				.set("ai", target => {
					let player = _status.event.player,
						att = get.attitude(player, target),
						eff = att / (player == target ? 2 : 1) + 1;
					if (att >= 0) {
						if (target.hasSkill("yongsi")) return eff * 5;
						if (target.hasSkill("zhiheng") || target.hasSkill("rezhiheng")) return eff * 4;
						if (target.hasSkill("rekurou")) return eff * 3;
						if (target.hasSkill("xinlianji") || target.hasSkill("dclianji")) return eff * 2;
						if (target.needsToDiscard()) return eff * 1.5;
						return eff;
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.addSkill("ruilian_target");
			player.markAuto("ruilian_target", [target]);
		},
		subSkill: {
			target: {
				onremove: true,
				intro: { content: "已选择$" },
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player.getStorage("ruilian_target").includes(event.player);
				},
				direct: true,
				charlotte: true,
				async content(event, trigger, player) {
					const target = trigger.player;
					let cards = [];
					player.removeSkill("ruilian_target");
					target.getHistory("lose", evt => {
						if (evt.type == "discard") cards.addArray(evt.cards2);
					});
					if (!cards.length) return;
					let list = [];
					for (let type of ["basic", "trick", "equip"]) {
						for (let card of cards) {
							if (get.type2(card) == type) {
								list.push(type);
								break;
							}
						}
					}
					list.push("cancel2");
					const result = await player
						.chooseControl(list)
						.set("prompt", "睿敛：是否与" + get.translation(target) + "各获得一种类型的牌？")
						.set("ai", function () {
							let player = _status.event.player,
								list = _status.event.controls;
							if (player.hp <= 3 && !player.countCards("h", { name: ["shan", "tao"] }) && list.includes("basic")) return "basic";
							if (player.countCards("he", { type: "equip" }) < 2 && list.includes("equip")) return "equip";
							if (list.includes("trick")) return "trick";
							return list.remove("cancel2").randomGet();
						})
						.forResult();
					if (result.control != "cancel2") {
						player.logSkill("ruilian_target", target);
						let type = result.control;
						list = [target, player].sortBySeat(_status.currentPhase);
						cards = [];
						for (let current of list) {
							let card = get.discardPile(function (card) {
								return get.type2(card) == type && !cards.includes(card);
							});
							if (card) {
								cards.push(card);
								await current.gain(card, "gain2");
							}
						}
					}
				},
			},
		},
	},
	//手杀差异化孙鲁育
	mbmumu: {
		audio: "mumu",
		inherit: "new_mumu",
		filter(event, player) {
			return game.hasPlayer(current => {
				return current.countCards("e") > 0;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("mbmumu"), "弃置场上的一张装备牌，或者获得场上的一张防具牌。", function (card, player, target) {
					return target.countCards("e") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (target.getEquip(2) && player.hasEmptySlot(2)) {
						return -2 * att;
					}
					return -att;
				});
			"step 1";
			if (result.bool && result.targets && result.targets.length) {
				event.target = result.targets[0];
				player.logSkill("mbmumu", event.target);
				player.line(event.target, "green");
				var e = event.target.getEquips(2);
				event.e = e;
				if (e.length > 0) {
					player.chooseControl("弃置一张装备牌", "获得一张防具牌").set("ai", function () {
						if (_status.event.player.getEquips(2).length > 0) {
							return "弃置一张装备牌";
						}
						return "获得一张防具牌";
					});
				} else {
					event.choice = "弃置一张装备牌";
				}
			} else event.finish();
			"step 2";
			var choice = event.choice || result.control;
			if (choice == "弃置一张装备牌") {
				player.discardPlayerCard(event.target, "e", true);
			} else {
				if (event.e) {
					player.gain(event.e, event.target, "give", "bySelf");
					player.addTempSkill("new_mumu_notsha");
				}
			}
		},
	},
	mbmeibu: {
		inherit: "new_meibu",
		derivation: ["mbzhixi"],
		content() {
			"step 0";
			var check = lib.skill.new_meibu.checkx(trigger, player);
			player
				.chooseToDiscard(get.prompt2("mbmeibu", trigger.player), "he")
				.set("ai", function (card) {
					if (_status.event.check) return 6 - get.value(card);
					return 0;
				})
				.set("check", check)
				.set("logSkill", ["mbmeibu", trigger.player]);
			"step 1";
			if (result.bool) {
				var target = trigger.player;
				var card = result.cards[0];
				player.line(target, "green");
				target.addTempSkills("mbzhixi", "phaseUseAfter");
				if (card.name != "sha" && !(get.type(card, "trick") == "trick" && get.color(card) == "black")) {
					target.addTempSkill("new_meibu_range", "phaseUseAfter");
					target.markAuto("new_meibu_range", player);
				}
				target.markSkillCharacter("mbmeibu", player, "魅步", "锁定技。出牌阶段，若你于此阶段使用过的牌数不小于X，你不能使用牌（X为你的体力值）；当你使用锦囊牌时，你结束此阶段。");
			}
		},
	},
	mbzhixi: {
		mod: {
			cardEnabled(card, player) {
				if (player.countMark("mbzhixi") >= player.hp) return false;
			},
			cardUsable(card, player) {
				if (player.countMark("mbzhixi") >= player.hp) return false;
			},
			cardSavable(card, player) {
				if (player.countMark("mbzhixi") >= player.hp) return false;
			},
		},
		trigger: {
			player: "useCard1",
		},
		forced: true,
		popup: false,
		firstDo: true,
		init(player, skill) {
			player.storage[skill] = 0;
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.player == player) {
				player.getHistory("useCard", function (evtx) {
					if (evtx.getParent("phaseUse") == evt) {
						player.storage[skill]++;
					}
				});
			}
		},
		onremove(player) {
			player.unmarkSkill("mbmeibu");
			delete player.storage.mbzhixi;
		},
		content() {
			player.addMark("mbzhixi", 1, false);
			if (get.type2(trigger.card) == "trick") {
				var evt = trigger.getParent("phaseUse");
				if (evt && evt.player == player) {
					evt.skipped = true;
					game.log(player, "结束了出牌阶段");
				}
			}
		},
		ai: {
			presha: true,
			pretao: true,
			neg: true,
			nokeep: true,
		},
	},
	//庞统
	xinlianhuan: {
		audio: 2,
		audioname: ["ol_pangtong"],
		inherit: "lianhuan",
		group: "xinlianhuan_add",
		subSkill: {
			add: {
				audio: "xinlianhuan",
				audioname: ["ol_pangtong"],
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (event.card.name != "tiesuo") return false;
					var info = get.info(event.card);
					if (info.allowMultiple == false) return false;
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(current => {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
							})
						)
							return true;
					}
					return false;
				},
				charlotte: true,
				forced: true,
				popup: false,
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("xinlianhuan"), "为" + get.translation(trigger.card) + "额外指定一个目标", (card, player, target) => {
							return !_status.event.sourcex.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
						})
						.set("sourcex", trigger.targets)
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, _status.event.card, player, player);
						})
						.set("card", trigger.card);
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) game.delayex();
					} else event.finish();
					"step 2";
					if (result.bool) {
						var targets = result.targets;
						player.logSkill("xinlianhuan_add", targets);
						trigger.targets.addArray(targets);
						game.log(targets, "也成为了", trigger.card, "的目标");
					}
				},
			},
		},
	},
	//吴班
	xinjintao: {
		audio: "jintao",
		inherit: "jintao",
		content() {
			var evt = trigger.getParent("phaseUse");
			var index = player
				.getHistory("useCard", function (evtx) {
					return evtx.card.name == "sha" && evtx.getParent("phaseUse") == evt;
				})
				.indexOf(trigger);
			if (index == 0) {
				game.log(trigger.card, "不可被响应");
				trigger.directHit.addArray(game.players);
			} else {
				game.log(trigger.card, "伤害+1");
				if (typeof trigger.baseDamage != "number") trigger.baseDamage = 1;
				trigger.baseDamage++;
			}
		},
	},
	//鲍信
	mutao: {
		audio: "twmutao",
		inherit: "twmutao",
		content() {
			"step 0";
			event.togive = target.getNext();
			var cards = target.getCards("h", { name: "sha" });
			if (!cards.length) {
				game.log("但", target, "没有", "#y杀", "！");
				event.finish();
			} else target.addToExpansion(cards, target, "give").gaintag.add("mutao");
			"step 1";
			var card = target.getExpansions("mutao").randomGet();
			target.give(card, event.togive);
			"step 2";
			if (target.getExpansions("mutao").length) {
				event.togive = event.togive.getNext();
				event.goto(1);
			} else {
				target.line(event.togive);
				event.togive.damage(Math.min(2, event.togive.countCards("h", { name: "sha" })), target);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
	yimou: {
		audio: ["twyimou1.mp3", "yimou.mp3"],
		inherit: "twyimou",
		content() {
			"step 0";
			if (trigger.player != player) player.addExpose(0.3);
			var target = get.translation(trigger.player);
			var choiceList = ["令" + target + "获得牌堆里的一张【杀】", "令" + target + "将一张牌交给另一名角色，然后" + target + "摸一张牌"];
			var list = ["选项一"];
			if (trigger.player.countCards("h")) list.push("选项二");
			else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			player
				.chooseControl(list)
				.set("prompt", "毅谋：请选择一项")
				.set("choiceList", choiceList)
				.set("ai", function () {
					var evt = _status.event.getTrigger(),
						list = _status.event.list;
					var player = _status.event.player;
					var target = evt.player;
					if (target.countCards("h") && list.includes("选项二")) return "选项二";
					return "选项一";
				})
				.set("list", list);
			"step 1";
			event.choice = result.control;
			"step 2";
			if (event.choice != "选项二") {
				var card = get.cardPile2(function (card) {
					return card.name == "sha";
				});
				if (card) trigger.player.gain(card, "gain2");
				else game.log("但牌堆里已经没有", "#y杀", "了！");
				if (event.choice == "选项一") event.finish();
			}
			"step 3";
			if (event.choice != "选项一") {
				if (trigger.player.countCards("h"))
					trigger.player.chooseCardTarget({
						prompt: "毅谋：将一张手牌交给另一名其他角色",
						filterCard: true,
						forced: true,
						filterTarget: lib.filter.notMe,
						ai1(card) {
							return 1 / Math.max(0.1, get.value(card));
						},
						ai2(target) {
							var player = _status.event.player,
								att = get.attitude(player, target);
							if (target.hasSkillTag("nogain")) att /= 9;
							return 4 + att;
						},
					});
				else event.finish();
			}
			"step 4";
			var target = result.targets[0];
			trigger.player.line(target);
			trigger.player.give(result.cards, target);
			trigger.player.draw();
		},
	},
	//蒋济
	jilun: {
		audio: 2,
		inherit: "twjilun",
		filter(event, player) {
			return player.hasSkill("twjichou", null, false, false);
		},
		content() {
			"step 0";
			var choices = ["选项一"];
			var choiceList = ["摸两张牌", "获得一个“机论”标记"];
			if (
				!player.getStorage("twjichou").length ||
				!player.getStorage("twjichou").filter(function (name) {
					return !player.getStorage("jilun").includes(name) && player.hasUseTarget({ name: name });
				}).length
			)
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			else choices.push("选项二");
			player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt("jilun"))
				.set("ai", () => {
					if (_status.event.choiceList.length == 1 || !player.getStorage("twjichou").length) return 0;
					var val = player.getUseValue({ name: "wuzhong" });
					for (var name of player.getStorage("twjichou")) {
						if (player.getStorage("jilun").includes(name)) continue;
						if (player.getUseValue({ name: name }) > val) return 1;
					}
					return 0;
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("jilun");
				if (result.control == "选项一") player.draw(2);
				else player.addMark("jilun_mark", 1);
			}
		},
		group: "jilun_effect",
		subSkill: {
			mark: {
				intro: { content: "mark" },
			},
			effect: {
				audio: "jilun",
				trigger: { global: "phaseJieshuBegin" },
				filter(event, player) {
					return player.hasMark("jilun_mark");
				},
				forced: true,
				content() {
					"step 0";
					if (
						!player.getStorage("twjichou").length ||
						!player.getStorage("twjichou").filter(function (name) {
							return !player.getStorage("jilun").includes(name) && player.hasUseTarget({ name: name });
						}).length
					) {
						if (player.hasMark("jilun_mark")) player.removeMark("jilun_mark", player.countMark("jilun_mark"));
						event.finish();
						return;
					}
					var list = [];
					for (var name of player.getStorage("twjichou")) {
						if (!player.getStorage("jilun").includes(name)) {
							list.push(["锦囊", "", name]);
						}
					}
					player
						.chooseButton(['###机论：请选择你要执行的选项###<div class="text center"><li>失去1枚“机论”标记，视为使用一张〖急筹〗已记录但〖机论〗未记录的普通锦囊牌<br><li>失去所有“机论”标记</div>', [list, "vcard"]])
						.set("filterButton", function (button) {
							return _status.event.player.hasUseTarget({ name: button.link[2] });
						})
						.set("ai", function (button) {
							return _status.event.getParent().player.getUseValue({ name: button.link[2] }, null, true);
						});
					"step 1";
					if (result.bool) {
						player.removeMark("jilun_mark", 1);
						var card = { name: result.links[0][2], isCard: true };
						player.chooseUseTarget(card, true);
						player.markAuto("jilun", [card.name]);
						player.syncStorage("jilun");
					} else {
						player.removeMark("jilun_mark", player.countMark("jilun_mark"));
						event.finish();
					}
					"step 2";
					if (player.hasMark("jilun_mark")) event.goto(0);
				},
			},
		},
		ai: {
			combo: "twjichou",
		},
	},
	//李遗
	jiaohua: {
		onremove: true,
		audio: "twjiaohua",
		enable: "phaseUse",
		usable: 2,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###教化###选择一种牌的类型，令一名角色从牌堆获得此类型的一张牌");
			},
			chooseControl(event, player) {
				var list = ["basic", "trick", "equip"].filter(type => !player.getStorage("jiaohua").includes(type));
				list.push("cancel2");
				return list;
			},
			check(event, player) {
				var list = ["trick", "equip", "basic"].filter(type => !player.getStorage("jiaohua").includes(type));
				return list[0];
			},
			backup(result, player) {
				return {
					type: result.control,
					audio: "twjiaohua",
					filterCard: () => false,
					selectCard: -1,
					filterTarget: true,
					content() {
						"step 0";
						var type = lib.skill.jiaohua_backup.type;
						var card = get.cardPile2(card => get.type2(card) == type);
						if (card) target.gain(card, "gain2");
						else game.log("但牌堆里已经没有", "#y" + get.translation(type) + "牌", "了！");
						"step 1";
						player.markAuto("jiaohua", [lib.skill.jiaohua_backup.type]);
						"step 2";
						if (!["basic", "trick", "equip"].some(type => !player.getStorage("jiaohua").includes(type))) {
							player.popup("教化");
							player.unmarkAuto("jiaohua", player.getStorage("jiaohua"));
							game.log(player, "清空了", "#g【教化】", "记录");
						}
					},
					ai: {
						result: { target: 1 },
					},
				};
			},
			prompt(result, player) {
				return "令一名角色从牌堆中获得一张" + get.translation(result.control) + "牌";
			},
		},
		ai: {
			order: 7,
			result: { player: 1 },
		},
		intro: { content: "已记录$牌" },
	},
	//来敏
	laishou: {
		audio: 3,
		trigger: { player: ["damageBegin4", "phaseZhunbeiBegin"] },
		filter(event, player) {
			var num = 9;
			if (event.name == "damage") return event.num >= player.getHp() && player.maxHp < num;
			return player.maxHp >= num;
		},
		forced: true,
		logAudio(event, player) {
			if (event.name == "damage") return 2;
			return "laishou3.mp3";
		},
		content() {
			if (trigger.name == "damage") {
				player.gainMaxHp(trigger.num);
				trigger.cancel();
			} else player.die();
		},
	},
	luanqun: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h");
		},
		usable: 1,
		contentBefore() {
			player.line(game.filterPlayer(current => current.countCards("h")));
		},
		content() {
			"step 0";
			var targets = game.filterPlayer(current => current.countCards("h")).sortBySeat();
			event.targets = targets;
			var next = player
				.chooseCardOL(targets, "乱群：请选择要展示的牌", true)
				.set("ai", function (card) {
					return -get.value(card);
				})
				.set("source", player);
			next.aiCard = function (target) {
				var hs = target.getCards("h");
				return { bool: true, cards: [hs.randomGet()] };
			};
			next._args.remove("glow_result");
			"step 1";
			var cards = [];
			event.videoId = lib.status.videoId++;
			for (var i = 0; i < targets.length; i++) cards.push(result[i].cards[0]);
			event.cards = cards;
			game.log(player, "展示了", targets, "的", cards);
			game.broadcastAll(
				function (targets, cards, id, player) {
					var dialog = ui.create.dialog(get.translation(player) + "发动了【乱群】", cards);
					dialog.videoId = id;
					var getName = function (target) {
						if (target._tempTranslate) return target._tempTranslate;
						var name = target.name;
						if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
						return get.translation(name);
					};
					for (var i = 0; i < targets.length; i++) {
						dialog.buttons[i].querySelector(".info").innerHTML = getName(targets[i]) + get.translation(cards[i].suit);
					}
				},
				targets,
				cards,
				event.videoId,
				player
			);
			game.delay(4);
			"step 2";
			game.broadcastAll("closeDialog", event.videoId);
			var card = cards[targets.indexOf(player)];
			var cardx = cards.filter(cardy => cardy != card && get.color(cardy, targets[cards.indexOf(cardy)]) == get.color(card, player));
			if (cardx.length) {
				const num = get.mode() == "identity" ? 4 : 2;
				player
					.chooseButton(["乱群：是否获得其中至多" + get.cnNumber(num) + "张牌", cardx])
					.set("forceAuto", true)
					.set("ai", function (button) {
						var cards = _status.event.list[0];
						var targets = _status.event.list[1];
						var player = _status.event.player;
						if (get.attitude(player, targets[cards.indexOf(button.link)]) > 0) return 0;
						return get.value(button.link, player);
					})
					.set("selectButton", [1, num])
					.set("list", [cards, targets]);
			} else event.goto(4);
			"step 3";
			if (result.bool) player.gain(result.links, "give");
			"step 4";
			var card = cards[targets.indexOf(player)];
			targets = targets.filter(target => get.color(cards[targets.indexOf(target)], target) != get.color(card, player));
			if (targets.length) {
				player.line(targets);
				targets.forEach(target => {
					target.addTempSkill("luanqun_effect", { player: "phaseUseAfter" });
					target.markAuto("luanqun_effect", [player]);
					target.addTempSkill("luanqun_directHit", { player: "phaseEnd" });
					target.markAuto("luanqun_directHit", [player]);
				});
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					if (player.hasSkill("laishou")) return 1;
					return player.hp >= 2 ? 1 : 0;
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					playerEnabled(card, player, target) {
						if (!player.isPhaseUsing()) return;
						if (card.name == "sha" && !player.getStorage("luanqun_effect").includes(target)) return false;
					},
				},
				trigger: { player: "useCard1" },
				filter(event, player) {
					return player.isPhaseUsing() && event.card.name == "sha";
				},
				firstDo: true,
				forced: true,
				content() {
					player.removeSkill("luanqun_effect");
				},
			},
			directHit: {
				charlotte: true,
				onremove: true,
				intro: { content: "出牌阶段第一张【杀】只能指定$为目标，且其不可响应你回合内使用的【杀】" },
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return (
						player === _status.currentPhase &&
						event.card.name == "sha" &&
						player.getStorage("luanqun_directHit").some(tar => {
							return event.targets.includes(tar);
						})
					);
				},
				forced: true,
				logTarget(event, player) {
					return player.getStorage("luanqun_directHit");
				},
				content() {
					trigger.directHit.addArray(player.getStorage("luanqun_directHit"));
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (tag === "directHit_ai") return player.getStorage("luanqun_directHit").includes(arg.target);
					},
				},
			},
		},
	},
	//郭照
	yichong: {
		initSkill(skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					charlotte: true,
					onremove: true,
					mark: true,
					marktext: "雀",
					intro: {
						markcount(storage) {
							return (storage || 0).toString();
						},
						content(storage) {
							return "已被掠夺" + (storage || 0) + "张牌";
						},
					},
				};
				lib.translate[skill] = "易宠";
				lib.translate[skill + "_bg"] = "雀";
			}
		},
		getLimit: 1,
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("yichong"), "选择一名其他角色并选择一个花色，获得其此花色的所有牌并令其获得“雀”标记", lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player;
				var att = get.attitude(player, target);
				if (att > 0) return 0;
				var getNum = function (player) {
					var list = [];
					for (var i of lib.suit) list.push(player.countCards("he", { suit: i }) + 3);
					return list.sort((a, b) => b - a)[0];
				};
				return getNum(target) + target.countCards("h") / 10;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("yichong", target);
				event.target = target;
				player
					.chooseControl(lib.suit.slice(0).reverse())
					.set("prompt", "请声明一个花色")
					.set("ai", function () {
						var target = _status.event.target,
							cards = target.getCards("he");
						var suits = lib.suit.slice(0);
						suits.sort(function (a, b) {
							var num = function (suit) {
								return cards.filter(function (card) {
									return get.suit(card) == suit;
								}).length;
							};
							return num(b) - num(a);
						});
						return suits[0];
					})
					.set("target", target);
			} else event.finish();
			"step 2";
			var suit = result.control;
			event.suit = suit;
			player.chat(get.translation(suit + 2));
			game.log(player, "选择了", "#y" + get.translation(suit + 2));
			if (target.countCards("e", { suit: suit })) player.gain(target.getCards("e", { suit: suit }), target, "giveAuto");
			"step 3";
			var suit = event.suit;
			if (target.countCards("h", { suit: suit })) {
				player.chooseButton(["选择获得其中一张牌", target.getCards("h", { suit: suit })], true).set("ai", button => get.value(button.link));
			} else event.goto(5);
			"step 4";
			if (result.bool) {
				var card = result.links[0];
				if (lib.filter.canBeGained(card, player, target)) player.gain(card, target, "giveAuto", "bySelf");
				else game.log("但", card, "不能被", player, "获得！");
			}
			"step 5";
			var suit = event.suit;
			player.storage.yichong = suit;
			player.markSkill("yichong");
			var skill = "yichong_" + player.playerid;
			game.broadcastAll(lib.skill.yichong.initSkill, skill);
			game.broadcastAll(
				function (player, suit) {
					if (player.marks.yichong) player.marks.yichong.firstChild.innerHTML = get.translation(suit);
				},
				player,
				suit
			);
			game.countPlayer(function (current) {
				current.removeSkill("yichong_" + player.playerid);
				if (current == target) target.addSkill("yichong_" + player.playerid);
			});
			player.addTempSkill("yichong_clear", { player: "phaseBegin" });
		},
		onremove: true,
		intro: { content: "拥有“雀”标记的角色得到$牌后，你获得之" },
		group: "yichong_gain",
		subSkill: {
			gain: {
				audio: "yichong",
				trigger: { global: ["gainAfter", "loseAsyncAfter"] },
				filter(event, player) {
					if (!player.storage.yichong) return false;
					return game.hasPlayer(function (current) {
						if (!event.getg(current).length || !current.hasSkill("yichong_" + player.playerid)) return false;
						if (current.countMark("yichong_" + player.playerid) >= lib.skill.yichong.getLimit) return false;
						return event.getg(current).some(card => get.suit(card, current) == player.storage.yichong && lib.filter.canBeGained(card, current, player));
					});
				},
				forced: true,
				content() {
					var target = game.findPlayer(function (current) {
						if (!trigger.getg(current).length || !current.hasSkill("yichong_" + player.playerid)) return false;
						if (current.countMark("yichong_" + player.playerid) >= lib.skill.yichong.getLimit) return false;
						return trigger.getg(current).some(card => get.suit(card, current) == player.storage.yichong && lib.filter.canBeGained(card, current, player));
					});
					var cards = trigger.getg(target).filter(card => get.suit(card, target) == player.storage.yichong && lib.filter.canBeGained(card, target, player));
					var num = lib.skill.yichong.getLimit - target.countMark("yichong_" + player.playerid);
					cards = cards.randomGets(num);
					player.gain(cards, target, "giveAuto");
					target.addMark("yichong_" + player.playerid, cards.length, false);
				},
			},
			clear: {
				charlotte: true,
				onremove(player) {
					game.countPlayer(function (current) {
						current.removeSkill("yichong_" + player.playerid);
					});
				},
			},
		},
	},
	wufei: {
		audio: 2,
		trigger: { player: ["useCardToPlayered", "damageEnd"] },
		filter(event, player) {
			var target = game.findPlayer(current => current.hasSkill("yichong_" + player.playerid));
			if (!target) return false;
			if (event.name == "damage") return target.hp > 3;
			return event.isFirstTarget && (event.card.name == "sha" || (get.type(event.card) == "trick" && get.tag(event.card, "damage")));
		},
		direct: true,
		content() {
			"step 0";
			var target = game.findPlayer(current => current.hasSkill("yichong_" + player.playerid));
			event.target = target;
			if (trigger.name == "damage") {
				player.chooseBool(get.prompt("wufei", target), "令" + get.translation(target) + "受到1点无来源伤害").set("choice", get.damageEffect(target, player, player) > 0);
			} else {
				player.logSkill("wufei", target);
				player.addTempSkill("wufei_effect");
				player.markAuto("wufei_effect", [trigger.card]);
				game.log(target, "成为了", trigger.card, "的伤害来源");
				event.finish();
			}
			"step 1";
			if (result.bool) {
				player.logSkill("wufei", target);
				target.damage("nosource");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { source: "damageBefore" },
				filter(event, player) {
					if (!event.card) return false;
					return player.getStorage("wufei_effect").includes(event.card);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					var target = game.findPlayer(current => current.hasSkill("yichong_" + player.playerid));
					if (!target) delete trigger.source;
					else trigger.source = target;
				},
			},
		},
		ai: {
			combo: "yichong",
		},
	},
	//张嶷
	xinwurong: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		logAudio: index => (typeof index === "number" ? "xinwurong" + index + ".mp3" : 1),
		content() {
			"step 0";
			player
				.chooseToDuiben(target)
				.set("title", "谋弈")
				.set("namelist", ["反抗", "归顺", "镇压", "安抚"])
				.set("translationList", [`对方选择镇压：${get.translation(player)}对你造成1点伤害，然后其摸一张牌<br>对方选择安抚：${get.translation(player)}受到1点伤害，然后其摸两张牌`, `对方选择镇压：${get.translation(player)}获得你一张牌，然后其交给你两张牌<br>对方选择安抚：你须交给${get.translation(player)}两张牌（若你牌数不足两张，则改为其令你跳过你下个摸牌阶段）`, `对方选择反抗：你对${get.translation(target)}造成1点伤害，然后你摸一张牌<br>对方选择归顺：你获得${get.translation(target)}一张牌，然后你交给其两张牌`, `对方选择反抗：你受到1点伤害，然后你摸两张牌<br>对方选择归顺：${get.translation(target)}须交给你两张牌（若其牌数不足两张，则改为令其跳过其下个摸牌阶段）`])
				.set("ai", button => 1 + Math.random());
			"step 1";
			if (result.bool) {
				player.logSkill("xinwurong", target, null, null, [result.player == "db_def1" ? 3 : 2]);
				if (result.player == "db_def1") {
					target.damage();
					player.draw();
					event.finish();
				} else {
					var cards = target.getCards("he");
					if (cards.length < 2) {
						target.skip("phaseDraw");
						target.addTempSkill("xinwurong_skip", { player: "phaseDrawSkipped" });
						event.finish();
					} else if (cards.length == 2) event._result = { bool: true, cards: cards };
					else target.chooseCard("怃戎：交给" + get.translation(player) + "两张牌", 2, true, "he");
				}
			} else {
				if (result.player == "db_def1") {
					player.gainPlayerCard(target, "he", true);
					event.goto(3);
				} else {
					player.damage();
					player.draw(2);
					event.finish();
				}
			}
			"step 2";
			if (result.bool) player.gain(result.cards, target, "giveAuto");
			event.finish();
			"step 3";
			var cards = player.getCards("he");
			if (!cards.length) event.finish();
			else if (cards.length <= 2) event._result = { bool: true, cards: cards };
			else player.chooseCard("怃戎：交给" + get.translation(target) + "两张牌", 2, true, "he");
			"step 4";
			if (result.bool) target.gain(result.cards, player, "giveAuto");
		},
		ai: {
			order: 7,
			result: {
				player: 1,
				target: -1,
			},
		},
		subSkill: {
			skip: {
				charlotte: true,
				mark: true,
				intro: { content: "跳过下个摸牌阶段" },
			},
		},
	},
	//孙亮
	xinkuizhu: {
		audio: "nzry_kuizhu",
		trigger: { player: "phaseDiscardAfter" },
		filter(event, player) {
			return player.getHistory("lose", function (evt) {
				return evt.type == "discard" && evt.getParent("phaseDiscard") == event;
			}).length;
		},
		direct: true,
		content() {
			"step 0";
			var cards = [];
			player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) cards.addArray(evt.cards2);
			});
			event.num = cards.length;
			event.str1 = "令至多" + event.num + "名角色摸一张牌";
			event.str2 = "对任意名体力值之和为" + event.num + "的角色造成1点伤害";
			player
				.chooseControl("cancel2")
				.set("ai", function () {
					if (
						game.countPlayer(function (current) {
							return get.attitude(player, current) < 0 && current.hp == event.num;
						}) > 0 &&
						event.num <= 3
					)
						return 1;
					return 0;
				})
				.set("choiceList", [event.str1, event.str2])
				.set("prompt", "是否发动【溃诛】？");
			"step 1";
			if (result.control == "cancel2") event.finish();
			event.control = [event.str1, event.str2][result.index];
			"step 2";
			var str = "请选择〖溃诛〗的目标";
			if (event.bool == false) str = "<br>所选目标体力之和不足" + event.num + "，请重选";
			if (event.control == event.str2) {
				player
					.chooseTarget(str, function (card, player, target) {
						var targets = ui.selected.targets;
						var num = 0;
						for (var i = 0; i < targets.length; i++) num += targets[i].hp;
						return num + target.hp <= _status.event.num;
					})
					.set("ai", function (target) {
						if (ui.selected.targets[0] != undefined) return -1;
						return get.attitude(player, target) < 0;
					})
					.set("promptbar", "none")
					.set("num", event.num)
					.set("selectTarget", function () {
						var targets = ui.selected.targets;
						var num = 0;
						for (var i = 0; i < targets.length; i++) num += targets[i].hp;
						if (num == _status.event.num) return ui.selected.targets.length;
						return ui.selected.targets.length + 1;
					});
			} else {
				player.chooseTarget("请选择〖溃诛〗的目标", "令至多" + get.cnNumber(event.num) + "名角色各摸一张牌", [1, event.num]).set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				});
			}
			"step 3";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				if (event.control == event.str1) {
					player.logSkill("xinkuizhu", targets);
					game.asyncDraw(targets);
				} else {
					var num = 0;
					for (var i = 0; i < targets.length; i++) num += targets[i].hp;
					if (num < event.num) {
						event.bool = false;
						event.goto(2);
					} else {
						player.logSkill("xinkuizhu", targets);
						for (var i of targets) i.damage();
						if (targets.length >= 2) player.loseHp();
					}
				}
			}
		},
	},
	xinzhizheng: {
		audio: "nzry_zhizheng",
		mod: {
			playerEnabled(card, player, target) {
				var info = get.info(card);
				if (target != player && (!info || !info.singleCard || !ui.selected.targets.length) && player.isPhaseUsing() && !target.inRange(player)) return false;
			},
		},
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return (
				player.getHistory("useCard", function (evt) {
					return evt.getParent("phaseUse") == event;
				}).length <
					game.countPlayer(function (current) {
						return current != player && !current.inRange(player);
					}) &&
				game.hasPlayer(function (target) {
					return target != player && !target.inRange(player) && target.countDiscardableCards(player, "he");
				})
			);
		},
		forced: true,
		content() {
			"step 0";
			player
				.chooseTarget("请选择〖掣政〗的目标", "弃置一名攻击范围内不包含你的角色的一张牌", true, function (card, player, target) {
					return target != player && !target.inRange(player) && target.countDiscardableCards(player, "he");
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				});
			"step 1";
			if (result.bool) {
				player.line(result.targets);
				player.discardPlayerCard(result.targets[0], "he", true);
			}
		},
	},
	xinlijun: {
		unique: true,
		audio: "nzry_lijun1",
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (event.card.name != "sha") return false;
			if (_status.currentPhase != event.player || event.player.group != "wu") return false;
			if (!player.hasZhuSkill("xinlijun", event.player) || player == event.player) return false;
			return event.cards.filterInD().length;
		},
		zhuSkill: true,
		direct: true,
		content() {
			"step 0";
			trigger.player.chooseBool(get.prompt("xinlijun"), "将" + get.translation(trigger.cards) + "交给" + get.translation(player)).set("choice", get.attitude(trigger.player, player) > 0);
			"step 1";
			if (result.bool) {
				player.logSkill("xinlijun", trigger.player);
				player.gain(trigger.cards.filterInD(), "gain2");
				player
					.chooseBool()
					.set("prompt", "是否令" + get.translation(trigger.player) + "摸一张牌？")
					.set("choice", get.attitude(player, trigger.player) > 0);
			} else event.finish();
			"step 2";
			if (result.bool) trigger.player.draw();
		},
	},
	//十常侍
	mbdanggu: {
		audio: 2,
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		derivation: ["mbdanggu_faq", "mbdanggu_faq2", "scstaoluan", "scschiyan", "scszimou", "scspicai", "scsyaozhuo", "scsxiaolu", "scskuiji", "scschihe", "scsniqu", "scsmiaoyu"],
		forced: true,
		unique: true,
		onremove(player) {
			delete player.storage.mbdanggu;
			delete player.storage.mbdanggu_current;
			if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
				game.broadcastAll(function (player) {
					player.name1 = player.name;
					player.skin.name = player.name;
					player.smoothAvatar(false);
					player.node.avatar.setBackground(player.name, "character");
					player.node.name.innerHTML = get.slimName(player.name);
					delete player.name2;
					delete player.skin.name2;
					player.classList.remove("fullskin2");
					player.node.avatar2.classList.add("hidden");
					player.node.name2.innerHTML = "";
					if (player == game.me && ui.fakeme) {
						ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
					}
				}, player);
			}
		},
		changshi: [
			["scs_zhangrang", "scstaoluan"],
			["scs_zhaozhong", "scschiyan"],
			["scs_sunzhang", "scszimou"],
			["scs_bilan", "scspicai"],
			["scs_xiayun", "scsyaozhuo"],
			["scs_hankui", "scsxiaolu"],
			["scs_lisong", "scskuiji"],
			["scs_duangui", "scschihe"],
			["scs_guosheng", "scsniqu"],
			["scs_gaowang", "scsmiaoyu"],
		],
		conflictMap(player) {
			if (!_status.changshiMap) {
				_status.changshiMap = {
					scs_zhangrang: [],
					scs_zhaozhong: [],
					scs_sunzhang: [],
					scs_bilan: ["scs_hankui"],
					scs_xiayun: [],
					scs_hankui: ["scs_bilan"],
					scs_lisong: [],
					scs_duangui: ["scs_guosheng"],
					scs_guosheng: ["scs_duangui"],
					scs_gaowang: [],
				};
				if (!get.isLuckyStar(player)) {
					var list = lib.skill.mbdanggu.changshi.map(i => i[0]);
					for (var i of list) {
						var select = list.filter(scs => scs != i && !_status.changshiMap[i].includes(i));
						_status.changshiMap[i].addArray(select.randomGets(get.rand(0, select.length)));
					}
				}
			}
			return _status.changshiMap;
		},
		content() {
			"step 0";
			var list = lib.skill.mbdanggu.changshi.map(i => i[0]);
			player.markAuto("mbdanggu", list);
			game.broadcastAll(
				function (player, list) {
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						var cardname = "huashen_card_" + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: "character/" + list[i],
						};
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, "", ""));
					}
					player.$draw(cards, "nobroadcast");
				},
				player,
				list
			);
			"step 1";
			var next = game.createEvent("mbdanggu_clique");
			next.player = player;
			next.setContent(lib.skill.mbdanggu.contentx);
		},
		contentx() {
			"step 0";
			var list = player.getStorage("mbdanggu").slice();
			var first = list.randomRemove();
			event.first = first;
			var others = list.randomGets(4);
			if (others.length == 1) event._result = { bool: true, links: others };
			else {
				var map = {
						scs_bilan: "scs_hankui",
						scs_hankui: "scs_bilan",
						scs_duangui: "scs_guosheng",
						scs_guosheng: "scs_duangui",
					},
					map2 = lib.skill.mbdanggu.conflictMap(player);
				var conflictList = others.filter(changshi => {
						if (map[first] && others.some(changshi2 => map[first] == changshi2)) return map[first] == changshi;
						else return map2[first].includes(changshi);
					}),
					list = others.slice();
				if (conflictList.length) {
					var conflict = conflictList.randomGet();
					list.remove(conflict);
					game.broadcastAll(
						function (changshi, player) {
							if (lib.config.background_speak) {
								if (player.isUnderControl(true)) game.playAudio("skill", changshi + "_enter");
							}
						},
						conflict,
						player
					);
				}
				player
					.chooseButton(["党锢：请选择结党对象", [[first], "character"], '<div class="text center">可选常侍</div>', [others, "character"]], true)
					.set("filterButton", button => {
						return _status.event.canChoose.includes(button.link);
					})
					.set("canChoose", list)
					.set("ai", button => Math.random() * 10);
			}
			"step 1";
			if (result.bool) {
				var first = event.first;
				var chosen = result.links[0];
				var skills = [];
				var list = lib.skill.mbdanggu.changshi;
				var changshis = [first, chosen];
				player.unmarkAuto("mbdanggu", changshis);
				player.storage.mbdanggu_current = changshis;
				for (var changshi of changshis) {
					for (var cs of list) {
						if (changshi == cs[0]) skills.push(cs[1]);
					}
				}
				if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
					game.broadcastAll(
						function (player, first, chosen) {
							player.name1 = first;
							player.node.avatar.setBackground(first, "character");
							player.node.name.innerHTML = get.slimName(first);
							player.name2 = chosen;
							player.skin.name = first;
							player.skin.name2 = chosen;
							player.classList.add("fullskin2");
							player.node.avatar2.classList.remove("hidden");
							player.node.avatar2.setBackground(chosen, "character");
							player.node.name2.innerHTML = get.slimName(chosen);
							if (player == game.me && ui.fakeme) {
								ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
							}
						},
						player,
						first,
						chosen
					);
				}
				game.log(player, "选择了常侍", "#y" + get.translation(changshis));
				if (skills.length) {
					player.addAdditionalSkill("mbdanggu", skills);
					var str = "";
					for (var i of skills) {
						str += "【" + get.translation(i) + "】、";
						player.popup(i);
					}
					str = str.slice(0, -1);
					game.log(player, "获得了技能", "#g" + str);
				}
			}
		},
		isSingleShichangshi(player) {
			var map = lib.skill.mbdanggu.conflictMap(player);
			return player.name == "shichangshi" && ((map[player.name1] && map[player.name2]) || (map[player.name1] && !player.name2) || (!player.name1 && !player.name2) || (player.name == player.name1 && !player.name2));
		},
		mod: {
			aiValue(player, card, num) {
				if (["shan", "tao", "wuxie", "caochuan"].includes(card.name)) return num / 10;
			},
			aiUseful() {
				return lib.skill.mbdanggu.mod.aiValue.apply(this, arguments);
			},
		},
		ai: {
			combo: "mbmowang",
			nokeep: true,
		},
		intro: {
			mark(dialog, storage, player) {
				dialog.addText("剩余常侍");
				dialog.addSmall([storage, "character"]);
				if (player.storage.mbdanggu_current && player.isIn()) {
					dialog.addText("当前常侍");
					dialog.addSmall([player.storage.mbdanggu_current, "character"]);
				}
			},
		},
	},
	mbmowang: {
		audio: 2,
		trigger: { player: "dieBefore" },
		filter(event, player) {
			return event.getParent().name != "giveup" && player.maxHp > 0;
		},
		derivation: "mbmowang_faq",
		forced: true,
		direct: true,
		priority: 15,
		group: ["mbmowang_die", "mbmowang_return"],
		content() {
			if (_status.mbmowang_return && _status.mbmowang_return[player.playerid]) {
				trigger.cancel();
			} else {
				if (player.getStorage("mbdanggu").length) {
					player.logSkill("mbmowang");
					game.broadcastAll(function () {
						if (lib.config.background_speak) game.playAudio("die", "shichangshiRest");
					});
					trigger.setContent(lib.skill.mbmowang.dieContent);
					trigger.includeOut = true;
				} else player.changeSkin("mbmowang", "shichangshi_dead");
			}
		},
		ai: {
			combo: "mbdanggu",
			neg: true,
		},
		dieContent() {
			"step 0";
			event.forceDie = true;
			if (source) {
				game.log(player, "被", source, "杀害");
				if (source.stat[source.stat.length - 1].kill == undefined) {
					source.stat[source.stat.length - 1].kill = 1;
				} else {
					source.stat[source.stat.length - 1].kill++;
				}
			} else {
				game.log(player, "阵亡");
			}
			if (player.isIn() && (!_status.mbmowang_return || !_status.mbmowang_return[player.playerid])) {
				event.reserveOut = true;
				game.log(player, "进入了修整状态");
				game.log(player, "移出了游戏");
				//game.addGlobalSkill('mbmowang_return');
				if (!_status.mbmowang_return) _status.mbmowang_return = {};
				_status.mbmowang_return[player.playerid] = 1;
			} else event.finish();
			if (!game.countPlayer()) game.over();
			else if (player.hp != 0) {
				player.changeHp(0 - player.hp, false).forceDie = true;
			}
			game.broadcastAll(function (player) {
				if (player.isLinked()) {
					if (get.is.linked2(player)) {
						player.classList.toggle("linked2");
					} else {
						player.classList.toggle("linked");
					}
				}
				if (player.isTurnedOver()) {
					player.classList.toggle("turnedover");
				}
			}, player);
			game.addVideo("link", player, player.isLinked());
			game.addVideo("turnOver", player, player.classList.contains("turnedover"));
			"step 1";
			event.trigger("die");
			"step 2";
			if (event.reserveOut) {
				if (!game.reserveDead) {
					for (var mark in player.marks) {
						if (mark == "mbdanggu") continue;
						player.unmarkSkill(mark);
					}
					var count = 1;
					var list = Array.from(player.node.marks.childNodes);
					if (list.some(i => i.name == "mbdanggu")) count++;
					while (player.node.marks.childNodes.length > count) {
						var node = player.node.marks.lastChild;
						if (node.name == "mbdanggu") {
							node = node.previousSibling;
						}
						node.remove();
					}
					game.broadcast(
						function (player, count) {
							while (player.node.marks.childNodes.length > count) {
								var node = player.node.marks.lastChild;
								if (node.name == "mbdanggu") {
									node = node.previousSibling;
								}
								node.remove();
							}
						},
						player,
						count
					);
				}
				for (var i in player.tempSkills) {
					player.removeSkill(i);
				}
				var skills = player.getSkills();
				for (var i = 0; i < skills.length; i++) {
					if (lib.skill[skills[i]].temp) {
						player.removeSkill(skills[i]);
					}
				}
				event.cards = player.getCards("hejsx");
				if (event.cards.length) {
					player.discard(event.cards).forceDie = true;
				}
			}
			"step 3";
			if (event.reserveOut) {
				game.broadcastAll(
					function (player, list) {
						player.classList.add("out");
						if (list.includes(player.name1) || player.name1 == "shichangshi") {
							player.smoothAvatar(false);
							player.skin.name = player.name1 + "_dead";
							player.node.avatar.setBackground(player.name1 + "_dead", "character");
						}
						if (list.includes(player.name2) || player.name2 == "shichangshi") {
							player.smoothAvatar(true);
							player.skin.name2 = player.name2 + "_dead";
							player.node.avatar2.setBackground(player.name2 + "_dead", "character");
						}
					},
					player,
					lib.skill.mbdanggu.changshi.map(i => i[0])
				);
			}
			if (source && lib.config.border_style == "auto" && (lib.config.autoborder_count == "kill" || lib.config.autoborder_count == "mix")) {
				switch (source.node.framebg.dataset.auto) {
					case "gold":
					case "silver":
						source.node.framebg.dataset.auto = "gold";
						break;
					case "bronze":
						source.node.framebg.dataset.auto = "silver";
						break;
					default:
						source.node.framebg.dataset.auto = lib.config.autoborder_start || "bronze";
				}
				if (lib.config.autoborder_count == "kill") {
					source.node.framebg.dataset.decoration = source.node.framebg.dataset.auto;
				} else {
					var dnum = 0;
					for (var j = 0; j < source.stat.length; j++) {
						if (source.stat[j].damage != undefined) dnum += source.stat[j].damage;
					}
					source.node.framebg.dataset.decoration = "";
					switch (source.node.framebg.dataset.auto) {
						case "bronze":
							if (dnum >= 4) source.node.framebg.dataset.decoration = "bronze";
							break;
						case "silver":
							if (dnum >= 8) source.node.framebg.dataset.decoration = "silver";
							break;
						case "gold":
							if (dnum >= 12) source.node.framebg.dataset.decoration = "gold";
							break;
					}
				}
				source.classList.add("topcount");
			}
		},
		subSkill: {
			die: {
				audio: "mbmowang",
				trigger: { player: "phaseAfter" },
				forced: true,
				forceDie: true,
				content() {
					"step 0";
					if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
						if (!player.getStorage("mbdanggu").length) {
							game.broadcastAll(function (player) {
								player.name1 = player.name;
								player.skin.name = player.name + "_dead";
								player.smoothAvatar(false);
								player.node.avatar.setBackground(player.name + "_dead", "character");
								player.node.name.innerHTML = get.slimName(player.name);
								delete player.name2;
								delete player.skin.name2;
								player.classList.remove("fullskin2");
								player.node.avatar2.classList.add("hidden");
								player.node.name2.innerHTML = "";
								if (player == game.me && ui.fakeme) {
									ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
								}
							}, player);
						}
					}
					if (!player.getStorage("mbdanggu").length) {
						game.delay();
					}
					"step 1";
					player.die();
				},
			},
			return: {
				trigger: { player: "phaseBefore" },
				forced: true,
				charlotte: true,
				silent: true,
				forceDie: true,
				forceOut: true,
				filter(event, player) {
					return !event._mbmowang_return && event.player.isOut() && _status.mbmowang_return[event.player.playerid];
				},
				content() {
					"step 0";
					trigger._mbmowang_return = true;
					game.broadcastAll(function (player) {
						player.classList.remove("out");
					}, trigger.player);
					game.log(trigger.player, "移回了游戏");
					delete _status.mbmowang_return[trigger.player.playerid];
					trigger.player.recover(trigger.player.maxHp - trigger.player.hp);
					game.broadcastAll(function (player) {
						if (player.name1 == "shichangshi") {
							player.smoothAvatar(false);
							player.node.avatar.setBackground(player.name1, "character");
							if (!lib.skill.mbdanggu.isSingleShichangshi(player)) {
								player.skin.name = player.name1;
							}
						}
						if (player.name2 == "shichangshi") {
							player.smoothAvatar(true);
							player.node.avatar2.setBackground(player.name2, "character");
							if (!lib.skill.mbdanggu.isSingleShichangshi(player)) {
								player.skin.name2 = player.name2;
							}
						}
					}, trigger.player);
					"step 1";
					event.trigger("restEnd");
					if (!player.hasSkill("mbdanggu", null, null, false)) event.finish();
					"step 2";
					delete player.storage.mbdanggu_current;
					if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
						game.broadcastAll(function (player) {
							player.name1 = player.name;
							player.skin.name = player.name;
							player.smoothAvatar(false);
							player.node.avatar.setBackground(player.name, "character");
							player.node.name.innerHTML = get.slimName(player.name);
							delete player.name2;
							delete player.skin.name2;
							player.classList.remove("fullskin2");
							player.node.avatar2.classList.add("hidden");
							player.node.name2.innerHTML = "";
							if (player == game.me && ui.fakeme) {
								ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
							}
						}, player);
					}
					"step 3";
					var next = game.createEvent("mbdanggu_clique");
					next.player = player;
					next.setContent(lib.skill.mbdanggu.contentx);
					"step 4";
					player.draw();
				},
			},
		},
	},
	//张让
	scstaoluan: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("hes") > 0;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
					} else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic") list.push(["基本", "", name]);
				}
				return ui.create.dialog("滔乱", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				if (player.countCards("hs", button.link[2]) > 0) return 0;
				if (button.link[2] == "wugu") return;
				var effect = player.getUseValue(button.link[2]);
				if (effect > 0) return effect;
				return 0;
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "scstaoluan",
					selectCard: 1,
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 4,
			result: {
				player: 1,
			},
			threaten: 1.9,
		},
	},
	//赵忠
	scschiyan: {
		audio: 1,
		trigger: { player: "useCardToPlayered" },
		direct: true,
		filter(event, player) {
			return event.card.name == "sha" && event.target.hp > 0 && event.target.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.choosePlayerCard(trigger.target, "he", get.prompt("scschiyan", trigger.target));
			next.set("ai", function (button) {
				if (!_status.event.goon) return 0;
				var val = get.value(button.link);
				if (button.link == _status.event.target.getEquip(2)) return 2 * (val + 3);
				return val;
			});
			next.set("goon", get.attitude(player, trigger.target) <= 0);
			next.set("forceAuto", true);
			"step 1";
			if (result.bool) {
				var target = trigger.target;
				player.logSkill("scschiyan", target);
				target.addSkill("scschiyan_get");
				target.addToExpansion("giveAuto", result.cards, target).gaintag.add("scschiyan_get");
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (get.attitude(player, arg.target) > 0) return false;
				if (tag == "directHit_ai") return arg.target.hp >= Math.max(1, arg.target.countCards("h") - 1);
				if (arg && arg.name == "sha" && arg.target.getEquip(2)) return true;
				return false;
			},
		},
		group: "scschiyan_damage",
		subSkill: {
			get: {
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.getExpansions("scschiyan_get").length > 0;
				},
				content() {
					"step 0";
					var cards = player.getExpansions("scschiyan_get");
					player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“鸱咽”牌");
					"step 1";
					player.removeSkill("scschiyan_get");
				},
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						var cards = player.getExpansions("scschiyan_get");
						if (player.isUnderControl(true)) dialog.addAuto(cards);
						else return "共有" + get.cnNumber(cards.length) + "张牌";
					},
				},
			},
			damage: {
				audio: "scschiyan",
				trigger: { source: "damageBegin1" },
				forced: true,
				locked: false,
				logTarget: "player",
				filter(event, player) {
					var target = event.player;
					return event.getParent().name == "sha" && player.countCards("h") >= target.countCards("h") && player.countCards("e") >= target.countCards("e");
				},
				content() {
					trigger.num++;
				},
			},
		},
	},
	//孙璋
	scszimou: {
		audio: 1,
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player != player) return false;
			var num = player.getHistory("useCard", evtx => evtx.getParent("phaseUse") == evt).length;
			return num == 2 || num == 4 || num == 6;
		},
		content() {
			var evt = trigger.getParent("phaseUse");
			var num = player.getHistory("useCard", evtx => evtx.getParent("phaseUse") == evt).length;
			var cards = [];
			if (num == 2) {
				var card = get.cardPile2(card => {
					return ["jiu", "xionghuangjiu"].includes(card.name);
				});
				if (card) cards.push(card);
			} else if (num == 4) {
				var card = get.cardPile2(card => {
					return card.name == "sha";
				});
				if (card) cards.push(card);
			} else if (num == 6) {
				var card = get.cardPile2(card => {
					return card.name == "juedou";
				});
				if (card) cards.push(card);
			}
			if (cards.length) player.gain(cards, "gain2");
		},
	},
	//毕岚
	scspicai: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		frequent: true,
		content() {
			"step 0";
			event.cards = [];
			event.suits = [];
			"step 1";
			player
				.judge(function (result) {
					var evt = _status.event.getParent("scspicai");
					if (evt && evt.suits && evt.suits.includes(get.suit(result))) return 0;
					return 1;
				})
				.set("callback", lib.skill.scspicai.callback).judge2 = function (result) {
				return result.bool ? true : false;
			};
			"step 2";
			var cards = cards.filterInD();
			if (cards.length)
				player.chooseTarget("将" + get.translation(cards) + "交给一名角色", true).set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards("h"));
					if (target.hasSkillTag("nogain")) att /= 10;
					return att;
				});
			else event.finish();
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "green");
				target.gain(cards, "gain2").giver = player;
			} else event.finish();
		},
		callback() {
			"step 0";
			var evt = event.getParent(2);
			event.getParent().orderingCards.remove(event.judgeResult.card);
			evt.cards.push(event.judgeResult.card);
			if (event.getParent().result.bool) {
				evt.suits.push(event.getParent().result.suit);
				player.chooseBool("是否继续发动【庀材】？").set("frequentSkill", "scspicai");
			} else event._result = { bool: false };
			"step 1";
			if (result.bool) event.getParent(2).redo();
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	//夏恽
	scsyaozhuo: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return player.canCompare(current);
			});
		},
		filterTarget(card, player, current) {
			return player.canCompare(current);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.skip("phaseDraw");
				target.addTempSkill("scsyaozhuo_skip", { player: "phaseDrawSkipped" });
			} else player.chooseToDiscard(2, true, "he");
		},
		subSkill: {
			skip: {
				mark: true,
				intro: { content: "跳过下一个摸牌阶段" },
			},
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.skipList.includes("phaseDraw") || target.hasSkill("pingkou")) return 0;
					var hs = player.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					if (!hs.length || !ts.length) return 0;
					if (hs[0].number > ts[0].number - 2 && hs[0].number > 5) return -1;
					return 0;
				},
			},
		},
	},
	//韩悝
	scsxiaolu: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			player.draw(2);
			"step 1";
			var num = player.countCards("h");
			if (!num) event.finish();
			else if (num < 2) event._result = { index: 1 };
			else
				player
					.chooseControl()
					.set("choiceList", ["将两张牌交给一名其他角色", "弃置两张牌"])
					.set("ai", function () {
						if (
							game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) > 0;
							})
						)
							return 0;
						return 1;
					});
			"step 2";
			if (result.index == 0) {
				player.chooseCardTarget({
					position: "h",
					filterCard: true,
					selectCard: 2,
					filterTarget(card, player, target) {
						return player != target;
					},
					ai1(card) {
						return get.unuseful(card);
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						if (target.hasSkillTag("nogain")) att /= 10;
						if (target.hasJudge("lebu")) att /= 5;
						return att;
					},
					prompt: "选择两张手牌，交给一名其他角色",
					forced: true,
				});
			} else {
				player.chooseToDiscard(2, true, "h");
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.give(result.cards, target);
			}
		},
		ai: {
			order: 9,
			result: { player: 2 },
		},
	},
	//栗嵩
	scskuiji: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			event.list1 = [];
			event.list2 = [];
			if (player.countCards("h") > 0) {
				var chooseButton = player.chooseButton(4, ["你的手牌", player.getCards("h"), get.translation(target.name) + "的手牌", target.getCards("h")]);
			} else {
				var chooseButton = player.chooseButton(4, [get.translation(target.name) + "的手牌", target.getCards("h")]);
			}
			chooseButton.set("target", target);
			chooseButton.set("ai", function (button) {
				var player = _status.event.player;
				var target = _status.event.target;
				var ps = [];
				var ts = [];
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					var card = ui.selected.buttons[i].link;
					if (target.getCards("h").includes(card)) ts.push(card);
					else ps.push(card);
				}
				var card = button.link;
				var owner = get.owner(card);
				var val = get.value(card) || 1;
				if (owner == target) {
					return 2 * val;
				}
				return 7 - val;
			});
			chooseButton.set("filterButton", function (button) {
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					if (get.suit(button.link) == get.suit(ui.selected.buttons[i].link)) return false;
				}
				return true;
			});
			"step 1";
			if (result.bool) {
				var list = result.links;
				for (var i = 0; i < list.length; i++) {
					if (get.owner(list[i]) == player) {
						event.list1.push(list[i]);
					} else {
						event.list2.push(list[i]);
					}
				}
				if (event.list1.length && event.list2.length) {
					game.loseAsync({
						lose_list: [
							[player, event.list1],
							[target, event.list2],
						],
						discarder: player,
					}).setContent("discardMultiple");
				} else if (event.list2.length) {
					target.discard(event.list2);
				} else player.discard(event.list1);
			}
		},
		ai: {
			order: 13,
			result: {
				target: -1,
			},
		},
	},
	//段珪
	scschihe: {
		audio: 1,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.targets.length == 1 && event.card.name == "sha";
		},
		prompt2(event, player) {
			var str = "亮出牌堆顶的两张牌并增加伤害；且";
			str += "令" + get.translation(event.target) + "不能使用";
			str += "这两张牌所包含的花色";
			str += "的牌响应" + get.translation(event.card);
			return str;
		},
		logTarget: "target",
		locked: false,
		check(event, player) {
			var target = event.target;
			if (get.attitude(player, target) > 0) return false;
			return true;
		},
		content() {
			var num = 2;
			var evt = trigger.getParent();
			var suit = get.suit(trigger.card);
			var suits = [];
			if (num > 0) {
				if (typeof evt.baseDamage != "number") evt.baseDamage = 1;
				var cards = get.cards(num);
				player.showCards(cards.slice(0), get.translation(player) + "发动了【叱吓】");
				while (cards.length > 0) {
					var card = cards.pop();
					var suitx = get.suit(card, false);
					suits.add(suitx);
					if (suit == suitx) evt.baseDamage++;
				}
				game.updateRoundNumber();
			}
			evt._scschihe_player = player;
			var target = trigger.target;
			target.addTempSkill("scschihe_block");
			if (!target.storage.scschihe_block) target.storage.scschihe_block = [];
			target.storage.scschihe_block.push([evt.card, suits]);
			lib.skill.scschihe.updateBlocker(target);
		},
		updateBlocker(player) {
			var list = [],
				storage = player.storage.scschihe_block;
			if (storage && storage.length) {
				for (var i of storage) list.addArray(i[1]);
			}
			player.storage.scschihe_blocker = list;
		},
		ai: {
			threaten: 2.5,
		},
		subSkill: {
			block: {
				mod: {
					cardEnabled(card, player) {
						if (!player.storage.scschihe_blocker) return;
						var suit = get.suit(card);
						if (suit == "none" || suit == "unsure") return;
						var evt = _status.event;
						if (evt.name != "chooseToUse") evt = evt.getParent("chooseToUse");
						if (!evt || !evt.respondTo || evt.respondTo[1].name != "sha") return;
						if (player.storage.scschihe_blocker.includes(suit)) return false;
					},
				},
				trigger: {
					player: ["damageBefore", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
					global: ["useCardEnd"],
				},
				forced: true,
				firstDo: true,
				charlotte: true,
				popup: false,
				onremove(player) {
					delete player.storage.scschihe_block;
					delete player.storage.scschihe_blocker;
				},
				filter(event, player) {
					const evt = event.getParent("useCard", true, true);
					if (evt && evt.effectedCount < evt.effectCount) return false;
					if (!event.card || !player.storage.scschihe_block) return false;
					for (var i of player.storage.scschihe_block) {
						if (i[0] == event.card) return true;
					}
					return false;
				},
				content() {
					var storage = player.storage.scschihe_block;
					for (var i = 0; i < storage.length; i++) {
						if (storage[i][0] == trigger.card) {
							storage.splice(i--, 1);
						}
					}
					if (!storage.length) player.removeSkill("scschihe_block");
					else lib.skill.scschihe.updateBlocker(target);
				},
			},
		},
	},
	//郭胜
	scsniqu: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget: 1,
		content() {
			target.damage("fire");
		},
		ai: {
			expose: 0.2,
			order: 5,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "fire") / 10;
				},
			},
		},
	},
	//高望
	scsanruo: {
		audio: 1,
		enable: ["chooseToUse", "chooseToRespond"],
		prompt: "将一张♥牌当做桃，♦牌当做火杀，♣牌当做闪，♠牌当做无懈可击使用或打出",
		viewAs(cards, player) {
			var name = false;
			var nature = null;
			switch (get.suit(cards[0], player)) {
				case "club":
					name = "shan";
					break;
				case "diamond":
					name = "sha";
					nature = "fire";
					break;
				case "spade":
					name = "wuxie";
					break;
				case "heart":
					name = "tao";
					break;
			}
			if (name) return { name: name, nature: nature };
			return null;
		},
		check(card) {
			var player = _status.event.player;
			if (_status.event.type == "phase") {
				var max = 0;
				var name2;
				var list = ["sha", "tao"];
				var map = { sha: "diamond", tao: "heart" };
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (
						player.countCards("hes", function (card) {
							return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
						}) > 0 &&
						player.getUseValue({ name: name, nature: name == "sha" ? "fire" : null }) > 0
					) {
						var temp = get.order({ name: name, nature: name == "sha" ? "fire" : null });
						if (temp > max) {
							max = temp;
							name2 = map[name];
						}
					}
				}
				if (name2 == get.suit(card, player)) return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
				return 0;
			}
			return 1;
		},
		position: "hes",
		filterCard(card, player, event) {
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.suit(card, player);
			if (name == "club" && filter({ name: "shan", cards: [card] }, player, event)) return true;
			if (name == "diamond" && filter({ name: "sha", cards: [card], nature: "fire" }, player, event)) return true;
			if (name == "spade" && filter({ name: "wuxie", cards: [card] }, player, event)) return true;
			if (name == "heart" && filter({ name: "tao", cards: [card] }, player, event)) return true;
			return false;
		},
		filter(event, player) {
			var filter = event.filterCard;
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) return true;
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) return true;
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) return true;
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) return true;
			return false;
		},
		precontent() {
			"step 0";
			player.addTempSkill("scsanruo_effect");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var name;
				switch (tag) {
					case "respondSha":
						name = "diamond";
						break;
					case "respondShan":
						name = "club";
						break;
					case "save":
						name = "heart";
						break;
				}
				if (!player.countCards("hes", { suit: name })) return false;
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao"];
					var map = { sha: "diamond", tao: "heart" };
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (
							player.countCards("hes", function (card) {
								return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
							}) > 0 &&
							player.getUseValue({
								name: name,
								nature: name == "sha" ? "fire" : null,
							}) > 0
						) {
							var temp = get.order({
								name: name,
								nature: name == "sha" ? "fire" : null,
							});
							if (temp > max) max = temp;
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard(player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hes") > 0) return true;
			if (name == "wuxie") return player.countCards("hes", { suit: "spade" }) > 0;
			if (name == "tao") return player.countCards("hes", { suit: "heart" }) > 0;
		},
		subSkill: {
			effect: {
				audio: "scsanruo",
				trigger: {
					player: ["useCard", "respond"],
				},
				filter(event, player) {
					return event.skill == "scsanruo";
				},
				direct: true,
				forced: true,
				charlotte: true,
				content() {
					"step 0";
					var name = trigger.card.name;
					var next = game.createEvent("scsanruo_" + name);
					next.player = player;
					next.setContent(lib.skill.scsanruo_effect[name == "shan" ? "sha" : name] || function () {});
				},
				sha() {
					"step 0";
					var trigger = event.getParent().getTrigger();
					if (trigger.name == "useCard") {
						var target = lib.skill.chongzhen.logTarget(trigger, player);
					} else {
						var target = trigger.source;
					}
					event.target = target;
					if (!target || !target.countGainableCards(player, "he")) event._result = { bool: false };
					else
						player
							.chooseBool(get.prompt("scsanruo_effect", target), "获得该角色的一张牌")
							.set("ai", () => {
								return _status.event.goon;
							})
							.set("goon", get.attitude(player, target) < 1);
					"step 1";
					if (result.bool) {
						player.logSkill("scsanruo_effect", target);
						player.gainPlayerCard(target, "he", true);
					}
				},
				tao() {
					"step 0";
					player
						.chooseTarget(get.prompt("scsanruo"), "获得一名其他角色的一张牌", (card, player, target) => {
							return target.countGainableCards(player, "he") && target != player;
						})
						.set("ai", target => {
							return 1 - get.attitude(_status.event.player, target);
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("scsanruo_effect", target);
						player.gainPlayerCard(target, "he", true);
					}
				},
				wuxie() {
					"step 0";
					var trigger = event.getParent().getTrigger();
					if (!trigger.respondTo) {
						event.finish();
						return;
					}
					var target = trigger.respondTo[0];
					event.target = target;
					if (!target || !target.countGainableCards(player, player == target ? "e" : "he")) event._result = { bool: false };
					else
						player
							.chooseBool(get.prompt("scsanruo_effect", target), "获得该角色的一张牌")
							.set("ai", () => {
								return _status.event.goon;
							})
							.set("goon", get.attitude(player, target) < 1);
					"step 1";
					if (result.bool) {
						player.logSkill("scsanruo_effect", target);
						player.gainPlayerCard(target, player == target ? "e" : "he", true);
					}
				},
			},
		},
	},
	scsmiaoyu: {
		audio: "scsanruo",
		enable: ["chooseToUse", "chooseToRespond"],
		prompt: "将至多两张♦牌当作火【杀】，♥牌当作【桃】，♣牌当作【闪】，♠牌当作【无懈可击】使用或打出",
		viewAs(cards, player) {
			var name = false;
			var nature = null;
			switch (get.suit(cards[0], player)) {
				case "club":
					name = "shan";
					break;
				case "diamond":
					name = "sha";
					nature = "fire";
					break;
				case "spade":
					name = "wuxie";
					break;
				case "heart":
					name = "tao";
					break;
			}
			//返回判断结果
			if (name) return { name: name, nature: nature };
			return null;
		},
		check(card) {
			if (ui.selected.cards.length) return 0;
			var player = _status.event.player;
			if (_status.event.type == "phase") {
				var max = 0;
				var name2;
				var list = ["sha", "tao"];
				var map = { sha: "diamond", tao: "heart" };
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (
						player.countCards("hes", function (card) {
							return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
						}) > 0 &&
						player.getUseValue({ name: name, nature: name == "sha" ? "fire" : null }) > 0
					) {
						var temp = get.order({ name: name, nature: name == "sha" ? "fire" : null });
						if (temp > max) {
							max = temp;
							name2 = map[name];
						}
					}
				}
				if (name2 == get.suit(card, player)) return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
				return 0;
			}
			return 1;
		},
		selectCard: [1, 2],
		complexCard: true,
		position: "hes",
		filterCard(card, player, event) {
			if (ui.selected.cards.length) return get.suit(card, player) == get.suit(ui.selected.cards[0], player);
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.suit(card, player);
			if (name == "club" && filter({ name: "shan", cards: [card] }, player, event)) return true;
			if (name == "diamond" && filter({ name: "sha", cards: [card], nature: "fire" }, player, event)) return true;
			if (name == "spade" && filter({ name: "wuxie", cards: [card] }, player, event)) return true;
			if (name == "heart" && filter({ name: "tao", cards: [card] }, player, event)) return true;
			return false;
		},
		filter(event, player) {
			var filter = event.filterCard;
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) return true;
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) return true;
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) return true;
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) return true;
			return false;
		},
		precontent() {
			player.addTempSkill("scsmiaoyu_num");
			player.addTempSkill("scsmiaoyu_discard");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var name;
				switch (tag) {
					case "respondSha":
						name = "diamond";
						break;
					case "respondShan":
						name = "club";
						break;
					case "save":
						name = "heart";
						break;
				}
				if (!player.countCards("hes", { suit: name })) return false;
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao"];
					var map = { sha: "diamond", tao: "heart" };
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (
							player.countCards("hes", function (card) {
								return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
							}) > 0 &&
							player.getUseValue({
								name: name,
								nature: name == "sha" ? "fire" : null,
							}) > 0
						) {
							var temp = get.order({
								name: name,
								nature: name == "sha" ? "fire" : null,
							});
							if (temp > max) max = temp;
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard(player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hs") > 0) return true;
			if (name == "wuxie") return player.countCards("hes", { suit: "spade" }) > 0;
			if (name == "tao") return player.countCards("hes", { suit: "heart" }) > 0;
		},
		subSkill: {
			num: {
				charlotte: true,
				trigger: { player: "useCard" },
				filter(event) {
					return ["sha", "tao"].includes(event.card.name) && event.skill == "scsmiaoyu" && event.cards && event.cards.length == 2;
				},
				forced: true,
				popup: false,
				content() {
					trigger.baseDamage++;
				},
			},
			discard: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "respondAfter"] },
				autodelay(event) {
					return event.name == "respond" ? 0.5 : false;
				},
				filter(event, player) {
					return ["shan", "wuxie"].includes(event.card.name) && event.skill == "scsmiaoyu" && event.cards && event.cards.length == 2 && _status.currentPhase && _status.currentPhase != player && _status.currentPhase.countDiscardableCards(player, "he");
				},
				forced: true,
				popup: false,
				content() {
					player.line(_status.currentPhase, "green");
					player.discardPlayerCard(_status.currentPhase, "he", true);
				},
			},
		},
	},
	//牵招
	mbshihe: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.addTempSkill("mbshihe_prevent", { player: "phaseAfter" });
				target.markAuto("mbshihe_prevent", [player]);
			} else {
				var cards = player.getCards("he", card => {
					return lib.filter.cardDiscardable(card, player, "mbshihe");
				});
				if (cards.length > 0) player.discard(cards.randomGet());
			}
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if ((get.realAttitude || get.attitude)(target, player) >= 0 || get.damageEffect(player, target, player) >= 0) return 0;
					var card = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					})[0];
					return get.number(card) >= 10 || (get.number(card) >= 7 && target.countCards("h") <= 2) ? 1 : -1;
				},
			},
		},
		subSkill: {
			prevent: {
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					if (get.mode() == "identity") return player.getStorage("mbshihe_prevent").includes(event.player);
					return player.getStorage("mbshihe_prevent").some(target => event.player.isFriendOf(target));
				},
				onremove: true,
				forced: true,
				charlotte: true,
				content() {
					trigger.cancel();
				},
				mark: true,
				marktext: "吓",
				intro: {
					content(storage, player) {
						var targets = storage.filter(i => i.isIn());
						return "被" + get.translation(targets) + "吓到了，对他" + (targets.length > 1 ? "们" : "") + (get.mode() != "identity" ? "和他的友方角色" : "") + "打不出伤害";
					},
				},
				ai: {
					effect: {
						player(card, player, target, current) {
							if (get.tag(card, "damage")) {
								var bool = false;
								if (get.mode() == "identity" && player.getStorage("mbshihe_prevent").includes(target)) bool = true;
								if (get.mode() != "identity" && player.getStorage("mbshihe_prevent").some(targetx => target.isFriendOf(targetx))) bool = true;
								if (bool) return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	mbzhenfu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.hasHistory("lose", evt => {
				return evt.type == "discard";
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("mbzhenfu"), "令一名其他角色获得1点护甲", (card, player, target) => {
					return target != player && target.hujia < 5;
				})
				.set("ai", target => {
					return Math.max(0, get.threaten(target)) * get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("mbzhenfu", target);
				target.changeHujia(1, null, true);
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	// 界曹休
	xinqingxi: {
		audio: 2,
		usable: 1,
		trigger: { source: "damageBegin1" },
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		filter(event, player) {
			return event.player != player;
		},
		content() {
			"step 0";
			var num = Math.max(1, 4 - get.distance(player, trigger.player));
			if (trigger.player.countCards("h") < num) {
				event._result = { bool: false };
			} else {
				trigger.player.chooseToDiscard(num, "弃置" + get.cnNumber(num) + "张手牌，或令" + get.translation(player) + "对你造成的此伤害+1").set("ai", function (card) {
					var player = _status.event.player;
					if (player.hp == 1) {
						if (get.type(card) == "basic") {
							return 8 - get.value(card);
						} else {
							return 10 - get.value(card);
						}
					} else {
						if (num > 2) {
							return 0;
						}
						return 8 - get.value(card);
					}
				});
			}
			"step 1";
			if (!result.bool) {
				trigger.num++;
			}
		},
	},
	// 界朱桓
	xinpingkou: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.getHistory("skipped").length > 0;
		},
		content() {
			"step 0";
			player
				.chooseTarget([1, player.getHistory("skipped").length], get.prompt2("xinpingkou"), function (card, player, target) {
					return target != player;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				});
			"step 1";
			if (result.bool) {
				player.logSkill("xinpingkou", result.targets);
				event.targets = result.targets.slice(0).sortBySeat();
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets && event.targets.length) {
				event.targets.shift().damage();
				event.redo();
			}
			"step 3";
			var card = get.cardPile2(card => get.type(card, null, false) == "equip");
			if (card) player.gain(card, "gain2");
		},
		ai: {
			effect: {
				target(card) {
					if (card.name == "lebu" || card.name == "bingliang") return 0.5;
				},
			},
			combo: "fenli",
		},
	},
	// 彭羕
	spdaming: {
		audio: 3,
		trigger: { global: "phaseBefore", player: "enterGame" },
		global: "spdaming_give",
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		change(player, num) {
			if (!player.storage.spdaming) player.storage.spdaming = 0;
			if (!num) return;
			player.storage.spdaming += num;
			player.markSkill("spdaming");
			game.log(player, (num > 0 ? "获得了" : "减少了") + get.cnNumber(Math.abs(num)) + "点“达命”值");
		},
		forced: true,
		locked: false,
		logAudio: () => 2,
		content() {
			lib.skill.spdaming.change(player, 1);
		},
		intro: {
			name: "达命值",
			markcount(storage, player) {
				return (storage || 0).toString();
			},
			content: "当前有#点“达命”值",
		},
		subSkill: {
			used: { charlotte: true },
			give: {
				audio: ["spdaming", 2],
				enable: "phaseUse",
				forceaudio: true,
				nopop: true,
				filter(event, player) {
					if (!player.countCards("he")) return false;
					return game.hasPlayer(current => {
						return current != player && current.hasSkill("spdaming") && !current.hasSkill("spdaming_used");
					});
				},
				selectCard: 1,
				filterCard: true,
				filterTarget(card, player, target) {
					return target.hasSkill("spdaming") && !target.hasSkill("spdaming_used");
				},
				selectTarget() {
					var player = _status.event.player;
					var targets = game.filterPlayer(current => {
						return current != player && current.hasSkill("spdaming") && !current.hasSkill("spdaming_used");
					});
					return targets.length > 1 ? 1 : -1;
				},
				complexSelect: true,
				prompt() {
					var player = _status.event.player;
					var targets = game.filterPlayer(function (current) {
						return current != player && current.hasSkill("spdaming") && !current.hasSkill("spdaming_used");
					});
					return "将一张牌交给" + get.translation(targets) + (targets.length > 1 ? "中的一人" : "");
				},
				position: "he",
				discard: false,
				lose: false,
				delay: false,
				check(card) {
					var player = _status.event.player;
					if (
						game.hasPlayer(current => {
							return lib.skill.spdaming_give.filterTarget(null, player, current) && get.attitude(player, current) > 0;
						})
					) {
						return 6 + Math.random() - get.value(card) / 15;
					}
					return 0;
				},
				content() {
					"step 0";
					player.give(cards, target);
					if (!game.hasPlayer(current => current != player && current != target)) event.finish();
					target.addTempSkill("spdaming_used", "phaseUseAfter");
					"step 1";
					var type = get.type(cards[0], "trick", target);
					event.cardtype = type;
					var str = get.translation(type),
						user = get.translation(player);
					target
						.chooseTarget(
							"达命：选择另一名其他角色",
							"若该角色有" + str + "牌，其将一张该类型的牌交给" + user + "，你获得1点“达命”值；否则你将" + get.translation(cards) + "交给" + user,
							(card, player, target) => {
								return target != player && target != _status.event.getParent().player;
							},
							true
						)
						.set("ai", target => 1 - get.attitude(_status.event.player, target));
					"step 2";
					if (result.bool) {
						var targetx = result.targets[0],
							type = event.cardtype;
						target.line(targetx);
						event.targetx = targetx;
						if (targetx.countCards("he", { type: type }) > 0) {
							targetx
								.chooseCard("交给" + get.translation(player) + "一张" + get.translation(type) + "牌", "he", true, card => {
									return get.type(card) == _status.event.getParent().cardtype;
								})
								.set("ai", card => 10 - get.value(card));
						} else {
							var cards = cards.filter(i => get.owner(i) == target);
							if (cards.length) target.give(cards, player);
							game.broadcastAll(function () {
								if (lib.config.background_speak) game.playAudio("skill", "spdaming3");
							});
							event.finish();
						}
					} else event.finish();
					"step 3";
					if (result.bool) {
						event.targetx.give(result.cards, player);
						event.targetx.line(player);
						lib.skill.spdaming.change(target, 1);
						game.delayx();
					}
				},
				ai: {
					expose: 0.2,
					order: 10,
					result: { target: 1 },
				},
			},
		},
	},
	spxiaoni: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		locked: false,
		filter(event, player) {
			return (player.storage.spdaming || 0) > 0;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var i of lib.inpile_nature) list.push(["基本", "", "sha", i]);
					}
					if (!get.tag({ name: name }, "damage")) continue;
					if (get.type2(name) == "trick") list.push(["锦囊", "", name]);
				}
				return ui.create.dialog("嚣逆", [list, "vcard"]);
			},
			filter(button, player) {
				return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				if (player.countCards("hs", button.link[2]) > 0) return 0;
				var effect = player.getUseValue(button.link[2]);
				if (effect > 0) return effect;
				return 0;
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "spxiaoni",
					selectCard: 1,
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					onuse(result, player) {
						lib.skill.spdaming.change(player, -result.targets.length);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
		},
		mod: {
			maxHandcardBase(player, num) {
				return Math.min(Math.max(0, player.storage.spdaming || 0), player.hp);
			},
		},
		ai: {
			order: 4,
			result: {
				player: 1,
			},
			threaten: 1.4,
			combo: "spdaming",
		},
		subSkill: {
			backup: {},
		},
	},
	// 灭霸
	zhujian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("e") > 0;
		},
		selectTarget: [2, Infinity],
		multiline: true,
		multitarget: true,
		filter(event, player) {
			return game.countPlayer(current => current.countCards("e") > 0) >= 2;
		},
		content() {
			game.asyncDraw(targets);
		},
		ai: {
			order: 8,
			result: { target: 1 },
		},
	},
	duansuo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.isLinked();
		},
		selectTarget: [1, Infinity],
		multiline: true,
		multitarget: true,
		filter(event, player) {
			return game.countPlayer(current => current.isLinked());
		},
		content() {
			"step 0";
			event.targets = targets.sortBySeat();
			for (var i of event.targets) {
				i.link(false);
			}
			"step 1";
			for (var i of targets) {
				i.damage("fire");
			}
		},
		ai: {
			order: 2,
			result: { target: -1 },
		},
	},
	// 界朱治
	sbanguo: {
		audio: 3,
		trigger: { global: "phaseBefore", player: "enterGame" },
		group: ["sbanguo_move", "sbanguo_damage", "sbanguo_dying"],
		logAudio: () => 2,
		filter(event, player) {
			return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseTarget("安国：令一名其他角色获得“安国”标记", lib.filter.notMe, true).forResult();
		},
		content() {
			const target = event.targets[0];
			target.addMark("sbanguo_mark", 1, false);
			target.addAdditionalSkill("sbanguo_" + player.playerid, "sbanguo_mark");
			target.addMark("sbanguo_marked", 1, false);
		},
		subSkill: {
			mark: {
				onremove: true,
				marktext: "安",
				charlotte: true,
				intro: {
					name: "安国",
					name2: "安国",
					content: "已拥有“安国”标记",
				},
				mod: {
					maxHandcardBase(player, num) {
						return player.maxHp;
					},
				},
			},
			move: {
				audio: "sbanguo",
				logAudio: () => ["sbanguo1.mp3", "sbanguo2.mp3"],
				direct: true,
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					return game.hasPlayer(current => current.hasSkill("sbanguo_mark")) && game.hasPlayer(current => !current.hasMark("sbanguo_marked") && current != player);
				},
				content() {
					"step 0";
					var targets = game.filterPlayer(current => current.hasSkill("sbanguo_mark"));
					var prompt2 = targets.length == 1 ? "将" + get.translation(targets[0]) + "的“安国”交给一名未获得过“安国”的其他角色" : "选择一名有“安国”的角色，将该标记交给一名未获得过“安国”的其他角色";
					player
						.chooseTarget(get.prompt("sbanguo"), prompt2, targets.length == 1 ? 1 : 2, (card, player, target) => {
							if (ui.selected.targets.length == 0 && _status.event.targets.length > 1) return target.hasSkill("sbanguo_mark");
							return !target.hasMark("sbanguo_marked") && target != player;
						})
						.set("ai", target => {
							var player = _status.event.player;
							if (ui.selected.targets.length == 0 && _status.event.targets.length > 1) return -get.attitude(player, target);
							return get.attitude(player, _status.event.targets[0]) < get.attitude(player, target);
						})
						.set("targets", targets);
					"step 1";
					if (result.bool) {
						var targets = result.targets;
						if (targets.length == 1) {
							var target1 = game.filterPlayer(current => current.hasSkill("sbanguo_mark"))[0];
							var target2 = targets[0];
						} else {
							var target1 = targets[0];
							var target2 = targets[1];
						}
						player.logSkill("sbanguo_move", target2, false);
						player.line2([target1, target2], "green");
						var map = target1.additionalSkills;
						for (var key in map) {
							if (key.indexOf("sbanguo_") != 0) continue;
							var id = parseInt(key.slice(8));
							target1.removeAdditionalSkill("sbanguo_" + id);
							target2.addMark("sbanguo_mark", 1, false);
							target2.addAdditionalSkill("sbanguo_" + id, "sbanguo_mark");
							target2.addMark("sbanguo_marked", 1, false);
						}
					}
				},
			},
			damage: {
				audio: "sbanguo",
				logAudio: () => ["sbanguo1.mp3", "sbanguo2.mp3"],
				forced: true,
				locked: false,
				trigger: { player: "damageBegin4" },
				filter(event, player) {
					if (!game.hasPlayer(current => current.hasSkill("sbanguo_mark"))) return false;
					if (event.source && event.source.isIn() && event.source.hasSkill("sbanguo_mark")) return false;
					return event.num >= player.hp;
				},
				content() {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					nothunder: true,
					nodamage: true,
					effect: {
						target(card, player, target, current) {
							if (!game.hasPlayer(current => current.hasSkill("sbanguo_mark"))) return;
							if (player.hasSkill("sbanguo_mark")) return;
							if (get.tag(card, "damage")) {
								if (target.hp <= 1) return [0, 0];
								return 0.5;
							}
						},
					},
				},
			},
			dying: {
				audio: "sbanguo3.mp3",
				forced: true,
				locked: false,
				trigger: { global: "dying" },
				filter(event, player) {
					var skills = event.player.additionalSkills["sbanguo_" + player.playerid];
					return skills && skills.length;
				},
				logTarget: "player",
				content() {
					"step 0";
					trigger.player.removeAdditionalSkill("sbanguo_" + player.playerid);
					var num = 1 - trigger.player.hp;
					if (num > 0) trigger.player.recover(num);
					"step 1";
					var hp = player.hp - 1,
						maxhp = player.maxHp - 1;
					if (hp > 0 && maxhp > 0) {
						player
							.chooseControl()
							.set("prompt", "安国：请选择一项")
							.set("choiceList", ["失去" + hp + "点体力，令" + get.translation(trigger.player) + "获得1点护甲", "减" + maxhp + "点体力上限，令" + get.translation(trigger.player) + "获得1点护甲"])
							.set("ai", () => "选项一");
					} else if (hp > 0) event._result = { control: "选项一" };
					else if (maxhp > 0) event._result = { control: "选项二" };
					else event.finish();
					"step 2";
					if (result.control == "选项一") {
						var num = player.hp - 1;
						if (num > 0) player.loseHp(num);
					} else {
						var num = player.maxHp - 1;
						if (num > 0) player.loseMaxHp(num);
					}
					trigger.player.changeHujia(1, null, true);
				},
			},
		},
	},
	// 界吴懿
	sbbenxi: {
		audio: 3,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countDiscardableCards(player, "he") > 0;
		},
		logAudio: () => 1,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2("sbbenxi"), [1, Infinity], "he")
				.set("ai", card => {
					var player = _status.event.player;
					if (ui.selected.cards.length < _status.event.num) return 100 - (get.useful(card, player) + player.getUseValue(card) / 3);
					return 0;
				})
				.set(
					"num",
					(function () {
						var count = 0;
						var list = [],
							list2 = [];
						var targets = game.filterPlayer(current => get.distance(player, current) >= 1);
						var cards = player.getCards("hs", card => {
							return player.hasUseTarget(card, false) && ["basic", "trick"].includes(get.type(card, false, player)) && get.info(card).allowMultiple != false;
						});
						var cards2 = player
							.getCards("he")
							.filter(i => lib.filter.cardDiscardable(i, player, "sbbenxi"))
							.sort((a, b) => {
								return get.useful(a, player) + player.getUseValue(a) / 3 - (get.useful(b, player) + player.getUseValue(b) / 3);
							});
						for (var i = 0; i < cards2.length; i++) {
							count = 0;
							list = [];
							for (var card of cards) {
								var num = i + 1;
								if (cards2.slice(0, num).includes(card)) continue;
								if (get.tag(card, "damage") && i > 0) count += get.effect(player, { name: "draw" }, player);
								var targets2 = targets.filter(current => {
									return player.canUse(card, current, false) && get.distance(player, current) <= num && get.effect(current, card, player, player) > 0;
								});
								targets2 = targets2.map(target => get.effect(target, card, player, player)).sort((a, b) => b - a);
								targets2.slice(0, num).forEach(eff => (count += eff));
								list.push(count - 1.2 * get.value(cards2[i]));
							}
							var val = list.sort((a, b) => b - a)[0];
							if (!isNaN(val)) list2.push([val, i]);
						}
						list2 = list2.filter(i => i[0] > 0);
						if (!list2.length) return 0;
						return list2.sort((a, b) => b[0] - a[0])[0][1];
					})()
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const num = event.cards.length;
			player.addTempSkill("sbbenxi_effect", "phaseUseAfter");
			player.addTempSkill("sbbenxi_effect2", "phaseUseAfter");
			player.addMark("sbbenxi_effect2", num, false);
		},
		subSkill: {
			effect: {
				audio: "sbbenxi2.mp3",
				trigger: { player: "useCard2" },
				forced: true,
				charlotte: true,
				direct: true,
				onremove: true,
				filter(event, player) {
					var type = get.type(event.card, null, false);
					return type == "basic" || type == "trick";
				},
				content() {
					"step 0";
					var num = player.countMark("sbbenxi_effect2");
					player.removeSkill("sbbenxi_effect");
					player.addTempSkill("sbbenxi_effect3", "phaseUseAfter");
					player.markAuto("sbbenxi_effect3", [trigger.card]);
					var filter = function (event, player) {
						var card = event.card,
							info = get.info(card);
						if (info.allowMultiple == false) return false;
						if (event.targets && !info.multitarget) {
							if (
								game.hasPlayer(function (current) {
									return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.distance(player, current) == 1;
								})
							) {
								return true;
							}
						}
						return false;
					};
					if (!filter(trigger, player)) event.finish();
					else {
						var prompt = "为" + get.translation(trigger.card) + "增加至多" + get.cnNumber(num) + "个距离为1的目标？";
						trigger.player
							.chooseTarget(get.prompt("sbbenxi_effect"), prompt, [1, num], function (card, player, target) {
								var player = _status.event.player;
								return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target) && get.distance(player, target) == 1;
							})
							.set("ai", function (target) {
								var trigger = _status.event.getTrigger();
								var player = _status.event.player;
								return get.effect(target, trigger.card, player, player);
							})
							.set("card", trigger.card)
							.set("targets", trigger.targets);
					}
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) game.delayx();
					} else event.finish();
					"step 2";
					player.logSkill("sbbenxi_effect", result.targets);
					game.log(result.targets, "也成为了", trigger.card, "的目标");
					trigger.targets.addArray(result.targets);
				},
				ai: {
					effect: {
						target_use(card, player, target) {
							if (player.canUse(card, target) && get.distance(player, target) != 1) return 1.2;
						},
					},
				},
			},
			effect2: {
				audio: "sbbenxi3.mp3",
				trigger: {
					global: "useCardAfter",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return (
						player.getStorage("sbbenxi_effect3").includes(event.card) &&
						game.hasPlayer2(current => {
							return current.hasHistory("damage", evt => {
								return event.card == evt.card;
							});
						})
					);
				},
				content() {
					player.draw(5);
				},
				mod: {
					aiOrder(player, card, num) {
						var evt = _status.event.getParent("phaseUse");
						if (!evt || evt.player != player) return;
						if (
							player.hasHistory("useCard", evtx => {
								return evtx.getParent("phaseUse") == evt && ["basic", "trick"].includes(get.type(evtx.card));
							})
						)
							return;
						if (get.tag(card, "damage") || get.type(card) == "equip") return num + 10;
					},
					globalFrom(from, to, distance) {
						return distance - from.countMark("sbbenxi_effect2");
					},
				},
				marktext: "奔",
				intro: {
					content(storage, player) {
						var str = "于此阶段至其他角色的距离-" + storage;
						if (player.hasSkill("sbbenxi_effect")) str += "；使用下一张基本牌或普通锦囊牌选择目标后，可以增加" + get.cnNumber(storage) + "个目标";
						return str;
					},
				},
			},
			effect3: {
				forced: true,
				charlotte: true,
				popup: false,
				onremove: true,
			},
		},
	},
	// 杨阜
	jiebing: {
		audio: 2,
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		forced: true,
		filter(event, player) {
			return game.hasPlayer(current => {
				return current != event.source && current != player && current.countGainableCards(player, "he");
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget("借兵：选择一名其他角色", get.skillInfoTranslation("jiebing"), true, (card, player, target) => {
					return player != target && target != _status.event.getTrigger().source && target.countGainableCards(player, "he");
				})
				.set("ai", target => get.effect(target, { name: "shunshou_copy2" }, player, player) /** (target.countCards('he')>1?1.5:1)*/);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("jiebing", target);
				if (target.ai.shown > 0) player.addExpose(0.15);
				var cards = target.getGainableCards(player, "he").randomGets(1);
				event.cards = cards;
				player.gain(target, cards, "give", "bySelf");
				player.showCards(cards, "借兵");
			} else event.finish();
			"step 2";
			for (var card of cards) {
				if (get.type(card) == "equip" && player.hasUseTarget(card) && get.owner(card) == player) {
					player.chooseUseTarget(card, true);
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						if (player != target && !player.getFriends().length) return;
						if (
							game.hasPlayer(current => {
								return current != player && get.attitude(player, current) > 0 && current.countGainableCards(target, "he") > 0;
							})
						)
							return [1, 1];
					}
				},
			},
		},
	},
	hannan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.hasSkillTag("noCompareSource");
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (!result.tie) {
				var players = [player, target];
				if (result.bool) players.reverse();
				players[1].line(players[0], "thunder");
				players[0].damage(players[1], 1);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					var hs = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					if (!hs.length || !ts.length) return 0;
					if (get.number(hs[0]) > get.number(ts[0]) || get.number(hs[0]) - ts.length >= 9 + Math.min(2, player.hp / 2)) return get.sgnAttitude(player, target) * get.damageEffect(target, player, player);
					return 0;
				},
			},
		},
	},
	// 曹嵩
	yijin: {
		audio: 3,
		trigger: { player: "phaseUseBegin" },
		locked: true,
		logAudio(_1, _2, _3, _4, result) {
			return "yijin" + (["yijin_jinmi", "yijin_guxiong", "yijin_yongbi"].includes(result.cost_data) ? 2 : 1) + ".mp3";
		},
		group: ["yijin_upstart", "yijin_die"],
		filter(event, player) {
			if (!game.hasPlayer(current => current != player && !lib.skill.yijin.getKane(current).length)) return false;
			return lib.skill.yijin.getKane(player).length;
		},
		getKane(player) {
			var list = lib.skill.yijin.derivation;
			return list.filter(mark => player.hasMark(mark));
		},
		derivation: ["yijin_wushi", "yijin_jinmi", "yijin_guxiong", "yijin_tongshen", "yijin_yongbi", "yijin_houren"],
		getValue(player, mark, target) {
			let dis = Math.sqrt(get.distance(player, target, "absolute"));
			if (target.isTurnedOver()) dis++;
			let draw = get.effect(target, { name: "draw" }, target, target);
			switch (mark.slice(6)) {
				case "wushi":
					if (target.hasJudge("bingliang")) return 12 / (1 + target.getCardUsable("sha", true));
					return (5 * draw) / dis + 12 / (1 + target.getCardUsable("sha", true));
				case "jinmi":
					if (target.hasJudge("lebu") && !target.hasCard({ name: "wuxie" }, "hs")) return (draw * target.needsToDiscard(2.2)) / dis;
					return get.effect(target, { name: "lebu" }, player, target) + (draw * target.needsToDiscard(2.2)) / dis;
				case "guxiong":
					if (target.hasJudge("lebu")) return (-draw * target.needsToDiscard(3)) / dis;
					return (get.effect(target, { name: "losehp" }, target, target) * 2) / dis - (draw * target.needsToDiscard(3)) / dis;
				case "tongshen":
					if (target.isMin()) return 0;
					var eff = -get.damageEffect(target, player, target);
					if (eff <= 0) return 0;
					if (target.hp < 2) return eff * dis * 2;
					if (target.hp < 3 && target.countCards("he") < 3) return eff * dis * 1.5;
					if (target.hp > 3) return (eff * dis) / target.hp;
					return eff * dis;
				case "yongbi":
					if (target.hasJudge("bingliang") && !target.hasCard({ name: "wuxie" }, "hs")) return 0;
					return (get.effect(target, { name: "bingliang" }, player, target) * 2) / dis;
				case "houren":
					return (Math.min(5, 2 + target.getDamagedHp()) * get.recoverEffect(target, player, target)) / dis;
			}
		},
		async cost(event, trigger, player) {
			const { targets } = await player
				.chooseTarget("亿金：令一名其他角色获得1枚“金”", true, (card, player, target) => {
					return player != target && !lib.skill.yijin.getKane(target).length;
				})
				.set("ai", target => {
					let player = _status.event.player,
						att = get.attitude(player, target),
						kane = lib.skill.yijin.getKane(player);
					if (Math.abs(att) > 1) att = Math.sign(att) * Math.sqrt(Math.abs(att));
					return Math.max.apply(
						Math.max,
						kane.map(i => {
							return att * lib.skill.yijin.getValue(player, i, target);
						})
					);
				})
				.forResult();
			if (!targets.length) {
				event.result = { bool: false };
				return;
			}
			const target = targets[0];
			event.target = target;
			const kane = lib.skill.yijin.getKane(player);
			const { control } = await player
				.chooseControl(kane)
				.set(
					"choiceList",
					kane.map(i => {
						return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div>" + "<div>" + get.skillInfoTranslation(i, player) + "</div>";
					})
				)
				.set("displayIndex", false)
				.set("prompt", "选择令" + get.translation(target) + "获得的“金”")
				.set("ai", () => {
					let controls = _status.event.controls,
						player = _status.event.player,
						target = _status.event.getParent().target,
						att = get.attitude(player, target);
					if (Math.abs(att) > 1) att = Math.sign(att) * Math.sqrt(Math.abs(att));
					let list = controls.map(i => {
						return [i, att * lib.skill.yijin.getValue(player, i, target)];
					});
					list.sort((a, b) => b[1] - a[1]);
					if (list.length) return list[0][0];
					return controls.randomGet();
				})
				.forResult();
			event.result = {
				bool: true,
				targets,
				cost_data: control,
			};
		},
		async content(event, trigger, player) {
			const kane = event.cost_data;
			const target = event.targets[0];
			player.removeMark(kane, 1);
			player.popup(kane, "metal");
			player.addSkill("yijin_clear");
			target.addMark(kane, 1);
			target.addAdditionalSkill("yijin_" + player.playerid, kane);
			game.delayx();
		},
		subSkill: {
			mark: {
				mark: true,
				marktext: "金",
				intro: {
					name: "亿金",
					name2: "亿金",
					markcount(storage, player) {
						return lib.skill.yijin.getKane(player).length;
					},
					content(storage, player) {
						return "剩余金：" + get.translation(lib.skill.yijin.getKane(player));
					},
				},
			},
			upstart: {
				audio: "yijin1.mp3",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				content() {
					var kane = lib.skill.yijin.derivation;
					for (var mark of kane) {
						player.addMark(mark, 1, false);
						player.unmarkSkill(mark);
					}
					player.addSkill("yijin_mark");
				},
			},
			die: {
				audio: "yijin3.mp3",
				trigger: { player: "phaseBegin" },
				forced: true,
				check: () => false,
				filter(event, player) {
					return !lib.skill.yijin.getKane(player).length;
				},
				content() {
					player.die();
				},
			},
			clear: {
				trigger: {
					global: "phaseAfter",
					player: "die",
				},
				charlotte: true,
				forced: true,
				popup: false,
				forceDie: true,
				filter(event, player) {
					if (event.name == "die") return true;
					return lib.skill.yijin.getKane(event.player).length && event.player.additionalSkills["yijin_" + player.playerid];
				},
				content() {
					"step 0";
					if (trigger.name == "die") {
						game.countPlayer(current => {
							var skills = current.additionalSkills["yijin_" + player.playerid];
							if (skills && skills.length) {
								current.removeAdditionalSkill("yijin_" + player.playerid);
								for (var i of skills) {
									trigger.player.removeSkill(i);
								}
							}
						});
						event.finish();
						return;
					} else {
						const skills = trigger.player.additionalSkills["yijin_" + player.playerid];
						for (const mark of skills) trigger.player.removeMark(mark, 1);
					}
					"step 1";
					trigger.player.removeAdditionalSkill("yijin_" + player.playerid);
				},
			},
			wushi: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseDrawBegin2" },
				content() {
					trigger.num += 4;
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + 1;
					},
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(膴仕)",
					name2: "金(膴仕)",
					content: "摸牌阶段多摸四张牌；使用【杀】的次数上限+1",
				},
			},
			jinmi: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseBegin" },
				content() {
					player.skip("phaseUse");
					player.skip("phaseDiscard");
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(金迷)",
					name2: "金(金迷)",
					content: "回合开始时，跳过下一个出牌阶段和弃牌阶段",
				},
			},
			guxiong: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseUseBegin" },
				content() {
					player.loseHp();
				},
				ai: {
					neg: true,
					nokeep: true,
				},
				mod: {
					maxHandcard(player, num) {
						return num - 3;
					},
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(贾凶)",
					name2: "金(贾凶)",
					content: "出牌阶段开始时，失去1点体力；手牌上限-3",
				},
			},
			tongshen: {
				charlotte: true,
				forced: true,
				trigger: { player: "damageBegin4" },
				filter(event) {
					return !event.hasNature("thunder");
				},
				content() {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					nodamage: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage") && !get.tag(card, "thunderDamage")) return [0, 0];
						},
					},
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(通神)",
					name2: "金(通神)",
					content: "当你受到非雷电伤害时，防止之",
				},
			},
			yongbi: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseZhunbeiBegin" },
				content() {
					player.skip("phaseDraw");
				},
				ai: {
					neg: true,
					nokeep: true,
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(拥蔽)",
					name2: "金(拥蔽)",
					content: "准备阶段，跳过下一个摸牌阶段",
				},
			},
			houren: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseEnd" },
				content() {
					player.recover(3);
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(厚任)",
					name2: "金(厚任)",
					content: "回合结束时，回复3点体力",
				},
			},
		},
	},
	guanzong: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(current => current != player) >= 2;
		},
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		multitarget: true,
		targetprompt: ["伤害来源", "受伤角色"],
		content() {
			targets[1].damage(targets[0], "unreal");
		},
		ai: {
			result: {
				target(player, target) {
					if (game.countPlayer(i => i != player) < 2) return 0;
					var list = game
						.filterPlayer(current => current != player)
						.map(current => {
							var _hp = current.hp,
								_maxhp = current.maxHp;
							current.hp = 10;
							current.maxHp = 10;
							var att = -get.sgnAttitude(player, current);
							var val = get.damageEffect(current, player, current) * att;
							current.getSkills(null, false, false).forEach(skill => {
								var info = get.info(skill);
								if (info && info.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend)) val = Math[val > 0 ? "max" : "min"](val > 0 ? 0.1 : -0.1, val + 2 * att);
							});
							var eff = 100 / val + 15;
							current.hp = _hp;
							current.maxHp = _maxhp;
							return [current, eff];
						})
						.sort((a, b) => b[1] - a[1])[0];
					if (list[1] < 0) return 0;
					var targetx = list[0],
						sign = get.sgnAttitude(player, target);
					if (ui.selected.targets.length) return target == targetx ? sign : 0;
					return (
						sign *
						(game
							.filterPlayer(current => {
								return current != player && current != targetx;
							})
							.map(current => {
								var _hp = targetx.hp,
									_maxhp = targetx.maxHp;
								targetx.hp = 10;
								targetx.maxHp = 10;
								var eff = -get.damageEffect(targetx, current, current);
								targetx.hp = _hp;
								targetx.maxHp = _maxhp;
								return [current, eff];
							})
							.sort((a, b) => b[1] - a[1])[0][0] == target
							? 10
							: 1)
					);
				},
			},
			order: 9.5,
			expose: 0.2,
		},
	},
	//马日磾
	chengye: {
		audio: 3,
		liujing_filter: [
			function (card) {
				return get.type(card, null, false) == "trick" && get.tag(card, "damage", null, false) > 0;
			},
			card => get.type(card, null, false) == "basic",
			card => get.name(card, false) == "wuxie",
			card => get.name(card, false) == "wuzhong",
			card => get.name(card, false) == "lebu",
			card => get.type(card, null, false) == "equip",
		],
		getLiujing(player, index) {
			var filter = lib.skill.chengye.liujing_filter[index],
				expansion = player.getExpansions("chengye");
			for (var i of expansion) {
				if (filter(i)) return i;
			}
			return false;
		},
		trigger: {
			global: ["useCardAfter", "loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		forced: true,
		filter(event, player) {
			if (player == event.player) return false;
			if (event.name == "useCard") {
				if (!event.card.isCard) return false;
				var cards = event.cards.filterInD();
				if (!cards.length) return false;
			} else if (event.name != "cardsDiscard") {
				var cards = event.getd(null, "cards2").filter(function (card) {
					if (get.position(card, true) != "d") return false;
					var type = get.type(card, null, false);
					return type == "delay" || type == "equip";
				});
				cards.removeArray(event.getd(player, "cards2"));
				if (!cards.length) return false;
			} else {
				var evtx = event.getParent();
				if (evtx.name != "orderingDiscard") return false;
				var evt2 = evtx.relatedEvent || evtx.getParent();
				if (evt2.name != "phaseJudge" || evt2.player == player) return;
				var cards = event.cards.filter(function (card) {
					if (get.position(card, true) != "d") return false;
					var type = get.type(card, null, false);
					return type == "delay";
				});
				if (!cards.length) return false;
			}
			for (var i = 0; i < 6; i++) {
				if (lib.skill.chengye.getLiujing(player, i)) continue;
				for (var j of cards) {
					if (lib.skill.chengye.liujing_filter[i](j)) return true;
				}
			}
			return false;
		},
		content() {
			var cards,
				cards2 = [];
			if (trigger.name == "useCard") {
				cards = trigger.cards.filterInD();
			} else if (trigger.name != "cardsDiscard") {
				cards = trigger.getd().filter(function (card) {
					if (card.original == "j" || get.position(card, true) != "d") return false;
					var type = get.type(card, null, false);
					return type == "delay" || type == "equip";
				});
				cards.removeArray(trigger.getd(player));
			} else {
				cards = trigger.cards.filter(function (card) {
					if (get.position(card, true) != "d") return false;
					var type = get.type(card, null, false);
					return type == "delay";
				});
			}
			for (var i = 0; i < 6; i++) {
				if (lib.skill.chengye.getLiujing(player, i)) continue;
				for (var j of cards) {
					if (lib.skill.chengye.liujing_filter[i](j)) {
						cards.remove(j);
						cards2.push(j);
						break;
					}
				}
				if (!cards.length) break;
			}
			player.addToExpansion(cards2, "gain2").gaintag.add("chengye");
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		mark: true,
		marktext: "经",
		intro: {
			name: "六经",
			markcount: "expansion",
			content: "expansion",
			mark(dialog, storage, player) {
				let list1 = [],
					list2 = [];
				var list = ["《诗经》", "《尚书》", "《仪礼》", "《易经》", "《乐经》", "《春秋》"];
				var desc = ["伤害类锦囊牌", "基本牌", "无懈可击", "无中生有", "乐不思蜀", "装备牌"];
				const addNewRow = lib.element.dialog.addNewRow.bind(dialog);
				dialog.css({ width: "60%" });
				for (var i = 0; i < 6; i++) {
					var card = lib.skill.chengye.getLiujing(player, i);
					(i <= 2 ? list1 : list2).addArray([
						{ item: list[i] + '<div class="text center">' + desc[i] + "</div>", ratio: 6 },
						{ item: card ? [card] : [], ratio: 6 },
					]);
				}
				addNewRow(...list1);
				addNewRow(...list2);
			},
		},
		group: "chengye_gain",
		subSkill: {
			gain: {
				audio: "chengye",
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					return player.getExpansions("chengye").length >= 6;
				},
				forced: true,
				content() {
					player.gain(player.getExpansions("chengye"), "gain2");
				},
			},
		},
	},
	buxu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			var num = (player.getStat("skill").buxu || 0) + 1;
			return player.countCards("he") >= num && player.getExpansions("chengye").length < 6;
		},
		chooseButton: {
			chooseControl(event, player) {
				var list = ["诗经", "尚书", "仪礼", "易经", "乐经", "春秋"];
				var choices = [];
				for (var i = 0; i < 6; i++) {
					if (!lib.skill.chengye.getLiujing(player, i)) choices.push(list[i]);
				}
				choices.push("cancel2");
				return choices;
			},
			check(event, player) {
				var list = [4, 3, 5, 0, 2, 1];
				for (var i of list) {
					if (!lib.skill.chengye.getLiujing(player, i)) {
						return ["诗经", "尚书", "仪礼", "易经", "乐经", "春秋"][i];
					}
				}
				return "cancel2";
			},
			dialog(event, player) {
				var num = (player.getStat("skill").buxu || 0) + 1;
				return ui.create.dialog("###补续###弃置" + get.cnNumber(num) + "张牌并补充一张“六经”");
			},
			prompt(links, player) {
				var num = (player.getStat("skill").buxu || 0) + 1;
				return "弃置" + get.cnNumber(num) + "张牌并补充一张《" + links.control + "》";
			},
			backup(links, player) {
				return {
					audio: "buxu",
					index: ["诗经", "尚书", "仪礼", "易经", "乐经", "春秋"].indexOf(links.control),
					filterCard: true,
					position: "he",
					selectCard: (player.getStat("skill").buxu || 0) + 1,
					ai1(card) {
						var player = _status.event.player;
						if (
							player.needsToDiscard(0, (i, player) => {
								return !ui.selected.cards.includes(i) && !player.canIgnoreHandcard(i);
							})
						)
							return 10 / Math.max(0.1, get.value(card));
						return 5 - (player.getStat("skill").buxu || 0) - get.value(card);
					},
					ai2: () => 1,
					content() {
						var filter = lib.skill.chengye.liujing_filter[lib.skill.buxu_backup.index];
						var card = get.cardPile2(filter);
						if (card) player.addToExpansion(card, "gain2").gaintag.add("chengye");
					},
					ai: { result: { player: 1 } },
				};
			},
		},
		ai: {
			combo: "chengye",
			order: 0.2,
			result: { player: 1 },
		},
	},
	//阮慧
	mingcha: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		forced: true,
		locked: false,
		filter: event => !event.numFixed,
		content() {
			"step 0";
			var cards = game.cardsGotoOrdering(get.cards(3)).cards,
				cards2 = cards.slice(0);
			event.cards = cards.filter(function (i) {
				return get.number(i) < 9;
			});
			// while(cards2.length>0){
			// 	var card=cards2.pop();
			// 	card.fix();
			// 	ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
			// }
			// game.updateRoundNumber();
			player.showCards(cards, get.translation(player) + "发动了【明察】");
			if (!event.cards.length) event.finish();
			"step 1";
			player.chooseBool("是否放弃摸牌并获得" + get.translation(cards)).set("goon", trigger.num - cards.length <= 1);
			"step 2";
			if (result.bool) {
				trigger.changeToZero();
				player.gain(cards, "gain2");
			} else event.finish();
			"step 3";
			player
				.chooseTarget("是否随机获得其他角色的一张牌？", function (card, player, target) {
					return target != player && target.countCards("he") > 0;
				})
				.set("ai", function (target) {
					return 3 - get.attitude(player, target);
				});
			"step 4";
			if (result.bool) {
				var target = result.targets[0],
					cards = target.getGainableCards(player, "he");
				player.line(target, "green");
				if (cards.length) player.gain(cards.randomGet(), target, "giveAuto", "bySelf");
			}
		},
	},
	jingzhong: {
		audio: 2,
		trigger: { player: "phaseDiscardAfter" },
		filter(event, player) {
			var num = 0;
			player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
					for (var i of evt.cards2) {
						if (get.color(i, player) == "black") num++;
					}
				}
			});
			return num > 1;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("jingzhong"), "获得一名其他角色下回合出牌阶段内使用的牌", lib.filter.notMe).set("ai", function (target) {
				return Math.sqrt(target.countCards("h")) * get.threaten(target);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("jingzhong", target);
				player.addSkill("jingzhong_effect");
				player.markAuto("jingzhong_effect", [target]);
				game.delayx();
			}
		},
		subSkill: {
			effect: {
				trigger: { global: "useCardAfter" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					if (!player.getStorage("jingzhong_effect").includes(event.player) || !event.cards.filterInD().length) return false;
					var evt = event.getParent("phaseUse");
					if (!evt || evt.player != event.player) return false;
					return (
						player.getHistory("useSkill", function (evtx) {
							return evtx.skill == "jingzhong_effect" && evtx.event.getParent("phaseUse") == evt;
						}).length < 3
					);
				},
				logTarget: "player",
				content() {
					player.gain(trigger.cards.filterInD(), "gain2");
				},
				mark: true,
				intro: { content: "已指定$为目标" },
				group: "jingzhong_remove",
			},
			remove: {
				trigger: { global: "phaseAfter" },
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return player.getStorage("jingzhong_effect").includes(event.player);
				},
				content() {
					var storage = player.getStorage("jingzhong_effect");
					storage.remove(trigger.player);
					if (!storage.length) player.removeSkill("jingzhong_effect");
				},
			},
		},
	},
	//全琮
	sbyaoming: {
		audio: 2,
		chargeSkill: 4,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCharge() > 0;
		},
		filterTarget: true,
		prompt() {
			var num = _status.event.player.storage.sbyaoming_status;
			var list = ["弃置一名手牌数不小于你的角色的一张牌", "；或令一名手牌数不大于你的角色摸一张牌"];
			if (typeof num == "number") list[num] += "（上次选择）";
			return list[0] + list[1];
		},
		content() {
			"step 0";
			player.removeCharge();
			var num = target.countCards("h"),
				num2 = player.countCards("h");
			if (num == num2 && target.countCards("he") > 0) {
				var choice = get.attitude(player, target) > 0 ? 1 : 0;
				var str = get.translation(target),
					choiceList = ["弃置" + str + "的一张牌", "令" + str + "摸一张牌"];
				if (typeof player.storage.sbyaoming_status == "number") choiceList[player.storage.sbyaoming_status] += "（上次选择）";
				var next = player.chooseControl().set("choiceList", choiceList);
				next.set("ai_choice", choice);
				next.set("ai", () => _status.event.ai_choice);
			} else event._result = { index: num > num2 ? 0 : 1 };
			"step 1";
			if (result.index == 0) {
				player.discardPlayerCard(target, true, "he");
			} else target.draw();
			if (typeof player.storage.sbyaoming_status == "number" && result.index != player.storage.sbyaoming_status) {
				player.addCharge();
				delete player.storage.sbyaoming_status;
			} else {
				player.storage.sbyaoming_status = result.index;
			}
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					var att = get.attitude(player, target),
						eff = [0, 0];
					var hs = player.countCards("h"),
						ht = target.countCards("h");
					if (hs >= ht) {
						eff[0] = get.effect(target, { name: "draw" }, player, player);
						if (player.storage.sbyaoming_status == 0) eff[0] *= 1.2;
					}
					if (hs <= ht) {
						eff[1] = get.effect(target, { name: "guohe_copy2" }, player, player);
						if (player.storage.sbyaoming_status == 1) eff[1] *= 1.2;
					}
					return Math.max.apply(Math, eff);
				},
			},
		},
		group: ["sbyaoming_damage", "sbyaoming_init"],
		subSkill: {
			damage: {
				trigger: { player: "damageEnd" },
				direct: true,
				content() {
					"step 0";
					if (player.countCharge(true)) {
						player.logSkill("sbyaoming_damage");
						player.addCharge(trigger.num);
						game.delayx();
					}
					"step 1";
					player.chooseTarget(get.prompt("sbyaoming"), lib.skill.sbyaoming.prompt()).set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, "sbyaoming", player, player);
					});
					"step 2";
					if (result.bool) {
						player.useSkill("sbyaoming", result.targets);
					}
				},
			},
			init: {
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return (event.name != "phase" || game.phaseNumber == 0) && player.countCharge(true);
				},
				content() {
					player.addCharge(2);
				},
			},
		},
	},
	//手杀界荀彧
	rejieming: {
		audio: 2,
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		content() {
			"step 0";
			event.count = trigger.num;
			"step 1";
			player.chooseTarget(get.prompt("rejieming"), "令一名角色摸两张牌。然后若其手牌数少于体力上限，你摸一张牌").set("ai", function (target) {
				var att = get.attitude(_status.event.player, target);
				if (att > 2) {
					if (target.maxHp - target.countCards("h") > 2) return 2 * att;
					return att;
				}
				return att / 3;
			});
			"step 2";
			if (result.bool) {
				event.current = result.targets[0];
				player.logSkill("rejieming", event.current);
				player.line(event.current, "thunder");
				event.current.draw(2);
				event.count--;
			} else event.finish();
			"step 3";
			if (event.current.countCards("h") < event.current.maxHp) {
				player.draw();
			}
			"step 4";
			if (event.count > 0 && player.hasSkill("rejieming")) event.goto(1);
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && target.hp > 1) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						var max = 0;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) > 0) {
								max = Math.max(Math.min(5, players[i].hp) - players[i].countCards("h"), max);
							}
						}
						switch (max) {
							case 0:
								return 2;
							case 1:
								return 1.5;
							case 2:
								return [1, 2];
							default:
								return [0, max];
						}
					}
					if ((card.name == "tao" || card.name == "caoyao") && target.hp > 1 && target.countCards("h") <= target.hp) return [0, 0];
				},
			},
		},
	},
	//沮授
	xinjianying: {
		audio: 2,
		subfrequent: ["draw"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!player.countCards("he")) return false;
			for (var i of lib.inpile) {
				if (i != "du" && get.type(i, null, false) == "basic") {
					if (event.filterCard({ name: i }, player, event)) return true;
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: i, nature: j }, player, event)) return true;
						}
					}
				}
			}
			return false;
		},
		onChooseToUse(event) {
			if (event.type == "phase" && !game.online) {
				var last = event.player.getLastUsed();
				if (last && last.getParent("phaseUse") == event.getParent()) {
					var suit = get.suit(last.card, false);
					if (suit != "none") event.set("xinjianying_suit", suit);
				}
			}
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				var suit = event.xinjianying_suit || "",
					str = get.translation(suit);
				for (var i of lib.inpile) {
					if (i != "du" && get.type(i, null, false) == "basic") {
						if (event.filterCard({ name: i }, player, event)) list.push(["基本", str, i]);
						if (i == "sha") {
							for (var j of lib.inpile_nature) {
								if (event.filterCard({ name: i, nature: j }, player, event)) list.push(["基本", str, i, j]);
							}
						}
					}
				}
				return ui.create.dialog("渐营", [list, "vcard"]);
			},
			check(button) {
				if (button.link[2] == "jiu") return 0;
				return _status.event.player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				var next = {
					audio: "xinjianying",
					filterCard: true,
					popname: true,
					position: "he",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					ai1(card) {
						return 7 - _status.event.player.getUseValue(card, null, true);
					},
				};
				if (_status.event.xinjianying_suit) next.viewAs.suit = _status.event.xinjianying_suit;
				return next;
			},
			prompt(links) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + (_status.event.xinjianying_suit ? "(" + get.translation(_status.event.xinjianying_suit) + ")" : "") + "使用";
			},
		},
		ai: {
			order(item, player) {
				if (_status.event.xinjianying_suit) return 16;
				return 3;
			},
			result: { player: 7 },
		},
		group: ["xinjianying_draw", "jianying_mark"],
		init(player) {
			if (player.isPhaseUsing()) {
				var evt = _status.event.getParent("phaseUse");
				var history = player.getHistory("useCard", function (evt2) {
					return evt2.getParent("phaseUse") == evt;
				});
				if (history.length) {
					var trigger = history[history.length - 1];
					player.storage.jianying_mark = trigger.card;
					player.markSkill("jianying_mark");
					game.broadcastAll(
						function (player, suit) {
							if (player.marks.jianying_mark) player.marks.jianying_mark.firstChild.innerHTML = get.translation(suit);
						},
						player,
						get.suit(trigger.card, player)
					);
					player.when("phaseUseAfter").then(() => {
						player.unmarkSkill("jianying_mark");
						delete player.storage.jianying_mark;
					});
				}
			}
		},
		onremove(player) {
			player.unmarkSkill("jianying_mark");
			delete player.storage.jianying_mark;
		},
		subSkill: {
			draw: { inherit: "jianying", audio: "xinjianying" },
		},
	},
	//步练师
	reanxu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				game.countPlayer() > 2 &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("he");
				})
			);
		},
		selectTarget: 2,
		filterTarget(card, player, target) {
			if (target == player) return false;
			if (!ui.selected.targets.length) return target.countCards("he") > 0;
			return target != ui.selected.targets[0] && ui.selected.targets[0].countGainableCards(target, "he") > 0;
		},
		multitarget: true,
		targetprompt: ["被拿牌", "得到牌"],
		content() {
			"step 0";
			targets[1].gainPlayerCard(targets[0], "he", true);
			"step 1";
			if (
				targets[0].getHistory("lose", function (evt) {
					return evt.getParent(3) == event && !evt.es.length;
				}).length
			)
				player.draw();
			"step 2";
			if (targets[0].isIn() && targets[1].isIn() && targets[0].countCards("h") != targets[1].countCards("h")) {
				event.target = targets[targets[0].countCards("h") > targets[1].countCards("h") ? 1 : 0];
				player.chooseBool("是否令" + get.translation(event.target) + "摸一张牌？").set("ai", function () {
					var evt = _status.event.getParent();
					return get.attitude(evt.player, evt.target) > 0;
				});
			} else event.finish();
			"step 3";
			if (result.bool) target.draw();
		},
		ai: {
			expose: 0.2,
			threaten: 2,
			order: 9,
			result: {
				player(player, target) {
					if (ui.selected.targets.length) return 0.01;
					return target.countCards("e") ? 0 : 0.5;
				},
				target(player, target) {
					if (ui.selected.targets.length) {
						player = target;
						target = ui.selected.targets[0];
						if (get.attitude(player, target) > 1) {
							return 0;
						}
						return target.countCards("h") - player.countCards("h") > (target.countCards("e") ? 2 : 1) ? 2 : 1;
					} else {
						if (get.attitude(player, target) <= 0)
							return target.countCards("he", function (card) {
								return card.name == "tengjia" || get.value(card) > 0;
							}) > 0
								? -1.5
								: 1.5;
						return target.countCards("he", function (card) {
							return card.name != "tengjia" && get.value(card) <= 0;
						}) > 0
							? 1.5
							: -1.5;
					}
				},
			},
		},
	},
	//蒋干
	spdaoshu: {
		audio: 3,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			var goon = event.player != player && (get.mode() == "identity" || get.mode() == "guozhan" || event.player.isEnemyOf(player));
			return goon && event.player.countCards("h") > 0 && event.player.hasUseTarget({ name: "jiu", isCard: true }, null, true);
		},
		round: 1,
		logTarget: "player",
		check(event, player) {
			var target = event.player;
			var att = get.attitude(player, target);
			if (att > 0) return false;
			if (att == 0) return !player.inRangeOf(target);
			return true;
		},
		logAudio: () => 1,
		content() {
			"step 0";
			event.target = trigger.player;
			event.target.chooseUseTarget("jiu", true);
			"step 1";
			if (!target.countCards("h")) {
				event.finish();
				return;
			}
			var list = [];
			for (var i of lib.inpile) {
				if (get.type(i) == "basic") list.push(i);
			}
			if (!list.length) {
				event.finish();
				return;
			}
			target
				.chooseControl(list)
				.set("prompt", "请声明一种基本牌")
				.set("ai", () => _status.event.rand)
				.set("rand", get.rand(0, list.length - 1));
			"step 2";
			event.cardname = result.control;
			target.chat("我声明" + get.translation(event.cardname));
			game.log(target, "声明的牌名为", "#y" + get.translation(event.cardname));
			game.delayx();
			player
				.chooseControl("有！", "没有！")
				.set("prompt", "你觉得" + get.translation(target) + "的手牌区里有" + get.translation(event.cardname) + "吗？")
				.set("ai", function () {
					return _status.event.choice;
				})
				.set(
					"choice",
					(function () {
						var rand =
							{
								sha: 0.273,
								shan: 0.149,
								tao: 0.074,
								jiu: 0.031,
							}[event.cardname] || 0.1;
						return 1 - Math.pow(1 - rand, target.countCards("h")) > 0.5 ? "有！" : "没有！";
					})()
				);
			"step 3";
			player.chat(result.control);
			game.log(player, "认为", "#y" + result.control);
			game.delayx();
			"step 4";
			var bool1 = result.index == 0;
			var bool2 = target.hasCard(function (card) {
				return get.name(card, target) == event.cardname;
			}, "h");
			if (bool1 == bool2) {
				player.popup("判断正确", "wood");
				game.broadcastAll(function () {
					if (lib.config.background_speak) game.playAudio("skill", "spdaoshu2");
				});
				player.gainPlayerCard(target, "h", 2, true);
				//var cards=target.getCards('h',function(card){
				//	return lib.filter.canBeGained(card,player,target);
				//}).randomGets(5);
				//if(cards.length>0) player.gain(cards,target,'giveAuto','bySelf');
			} else {
				player.popup("判断错误", "fire");
				game.broadcastAll(function () {
					if (lib.config.background_speak) game.playAudio("skill", "spdaoshu3");
				});
				//player.addTempSkill('spdaoshu_respond');
			}
		},
		ai: { expose: 0.3 },
		subSkill: {
			respond: {
				trigger: { global: "useCard1" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.player == _status.currentPhase;
				},
				content() {
					trigger.directHit.add(player);
				},
			},
		},
	},
	mbdaoshu: {
		audio: 3,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.mbdaoshu.filterTarget(event, player, target));
		},
		filterTarget(card, player, target) {
			if (!["guozhan", "identity"].includes(get.mode()) && target.isFriendOf(player)) return false;
			return target != player && target.countCards("h") >= 2;
		},
		usable: 1,
		logAudio: () => 1,
		*content(event, map) {
			var player = map.player,
				target = event.target;
			var targets = [player],
				names = lib.inpile.randomGets(3);
			if (!names.length) return;
			var map = {};
			names.forEach(name => (map[get.translation(name)] = name));
			if (get.mode() != "identity" && get.mode() != "guozhan") targets.addArray(player.getFriends());
			targets.remove(target);
			targets.sortBySeat();
			var result = yield target
				.chooseButton(["盗书：请选择伪装的牌和牌名", target.getCards("h"), [Object.keys(map), "tdnodes"]], 2, true)
				.set("filterButton", button => {
					var map = _status.event.map;
					if (!ui.selected.buttons.length) return true;
					if (typeof button.link == typeof ui.selected.buttons[0].link) return false;
					if (typeof button.link == "string") return get.name(ui.selected.buttons[0].link, false) != map[button.link];
					return map[ui.selected.buttons[0].link] != get.name(button.link, false);
				})
				.set("ai", button => {
					var map = _status.event.map;
					if (!ui.selected.buttons.length) {
						if (typeof button.link == "object") {
							if (Object.values(map).some(name => lib.card.list.some(card => card[0] == get.suit(button.link, false) && card[1] == get.number(button.link, false) && card[2] == name))) return 5;
							return 3.5 + Math.random();
						}
						return 0;
					}
					if (typeof button.link == "string") {
						var cardx = ui.selected.buttons[0].link;
						if (lib.card.list.some(card => card[0] == get.suit(cardx, false) && card[1] == get.number(cardx, false) && card[2] == map[button.link])) return 2 + Math.random();
						return 1;
					}
					return 0;
				})
				.set("map", map);
			if (result.bool) {
				var guessWinner = [];
				if (typeof result.links[0] == "string") result.links.reverse();
				var OriginCard = result.links[0],
					ChangeName = map[result.links[1]],
					cards = target.getCards("h").slice();
				var card = game.createCard(ChangeName, get.suit(OriginCard, false), get.number(OriginCard, false));
				cards[cards.indexOf(OriginCard)] = card;
				if (_status.connectMode) {
					var list = targets.map(target2 => [target2, ["请猜测" + get.translation(target) + "伪装的手牌", cards], true]);
					var result2 = yield player
						.chooseButtonOL(list)
						.set("switchToAuto", () => (_status.event.result = "ai"))
						.set("processAI", () => {
							var cards = _status.event?.getParent()?.cards?.slice() ?? _status.event.dialog.buttons.map(button => button.link);
							var card = cards.find(card => lib.card.list.some(cardx => cardx[2] == card.name) && !lib.card.list.some(cardx => cardx[2] == card.name && cardx[0] == get.suit(card, false) && cardx[0] == get.number(card, false)));
							return {
								bool: true,
								links: card ? card : cards.randomGet(),
							};
						})
						.set("cards", cards);
					for (var i in result2) {
						if (result2[i].links[0] == card) guessWinner.push(lib.playerOL[i]);
					}
				} else {
					var guessTargets = targets.slice();
					while (guessTargets.length) {
						var target2 = guessTargets.shift();
						var result2 = yield target2
							.chooseButton(["请猜测" + get.translation(target) + "伪装的手牌", cards], true)
							.set("ai", button => {
								var cards = _status.event.cards.slice();
								var card = cards.find(card => lib.card.list.some(cardx => cardx[2] == get.name(card, false)) && !lib.card.list.some(cardx => cardx[2] == get.name(card, false) && cardx[0] == get.suit(card, false) && cardx[0] == get.number(card, false)));
								return button.link == card ? 3 : 1 + Math.random();
							})
							.set("cards", cards);
						if (result2.bool) {
							if (result2.links[0] == card) guessWinner.push(target2);
						}
					}
				}
				targets.forEach(target2 => {
					if (guessWinner.includes(target2)) {
						target2.popup("判断正确", "wood");
						game.log(target2, "猜测", "#g正确");
						game.broadcastAll(() => {
							if (lib.config.background_speak) game.playAudio("skill", "mbdaoshu2");
						});
						target2.line(target);
						target.damage(1, target2);
					} else {
						target2.popup("判断错误", "fire");
						game.log(target2, "猜测", "#y错误");
						game.broadcastAll(() => {
							if (lib.config.background_speak) game.playAudio("skill", "mbdaoshu3");
						});
						if (target2.countCards("h") >= 2) target2.discard(target2.getCards("h").randomGets(2));
						else target2.loseHp();
					}
				});
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return -1 / target.countCards("h");
				},
			},
		},
	},
	mbdaoshu1: { audio: true },
	spdaizui: {
		audio: 2,
		trigger: { player: "damageBegin2" },
		limited: true,
		logTarget: "source",
		filter(event, player) {
			return event.num >= player.hp && event.source && event.source.isIn() && event.cards && event.cards.filterInD().length > 0;
		},
		prompt2(event) {
			return "防止即将受到的" + get.cnNumber(event.num) + "点伤害，并令" + get.translation(event.source) + "将" + get.translation(event.cards.filterInD()) + "置于武将牌上且回合结束时收回";
		},
		skillAnimation: true,
		animationColor: "thunder",
		content() {
			player.awakenSkill("spdaizui");
			trigger.source.addSkill("spdaizui2");
			trigger.source.addToExpansion(trigger.cards.filterInD(), "gain2").gaintag.add("spdaizui2");
			trigger.cancel();
		},
	},
	spdaizui2: {
		trigger: { global: "phaseEnd" },
		forced: true,
		charlotte: true,
		sourceSkill: "spdaizui",
		filter(event, player) {
			return player.getExpansions("spdaizui2").length > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("spdaizui2");
			player.gain(cards, "gain2");
			"step 1";
			player.removeSkill("spdaizui2");
		},
		marktext: "释",
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
	},
	//裴秀
	xingtu: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			player.addTip("xingtu", `行图 ${get.translation(get.number(event.card, player))}`);
			var evt = lib.skill.dcjianying.getLastUsed(player, event);
			if (!evt || !evt.card) return false;
			var num1 = get.number(event.card),
				num2 = get.number(evt.card);
			return typeof num1 == "number" && typeof num2 == "number" && num2 % num1 == 0;
		},
		forced: true,
		content() {
			player.draw();
		},
		mod: {
			cardUsable(card, player) {
				if (typeof card == "object") {
					let num1 = get.number(card);
					if (num1 != "unsure" && typeof num1 != "number") return;
					if (!card.cards) return;
					for (var i of card.cards) {
						if (i.hasGaintag("xingtu1")) return Infinity;
					}
					let evt = lib.skill.dcjianying.getLastUsed(player);
					if (!evt || !evt.card) return;
					let num2 = get.number(evt.card);
					if (typeof num2 == "number" && num1 % num2 == 0) return Infinity;
				}
			},
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					let num1 = get.number(card);
					if (num1 != "unsure" && typeof num1 != "number") return;
					if (!card.cards) return;
					for (var i of card.cards) {
						if (i.hasGaintag("xingtu1")) return num + 5;
					}
					let evt = lib.skill.dcjianying.getLastUsed(player);
					if (!evt || !evt.card) return;
					let num2 = get.number(evt.card);
					if (typeof num2 == "number" && num1 % num2 == 0) return num + 5;
				}
			},
		},
		init(player) {
			player.addSkill("xingtu_mark");
			var history = player.getAllHistory("useCard");
			if (history.length) {
				var trigger = history[history.length - 1],
					num = get.number(trigger.card);
				player.storage.xingtu_mark = num;
				player[typeof num != "number" ? "unmarkSkill" : "markSkill"]("xingtu_mark");
			}
		},
		onremove(player) {
			player.removeSkill("xingtu_mark");
			player.removeGaintag("xingtu1");
			player.removeGaintag("xingtu2");
			player.removeTip("xingtu");
			delete player.storage.xingtu_mark;
		},
		subSkill: {
			mark: {
				charlotte: true,
				trigger: {
					player: ["useCard1", "gainAfter"],
					global: "loseAsyncAfter",
				},
				filter(event, player, name) {
					return name == "useCard1" || (event.getg(player).length && player.countCards("h"));
				},
				direct: true,
				firstDo: true,
				content() {
					"step 0";
					player.removeGaintag("xingtu1");
					player.removeGaintag("xingtu2");
					if (event.triggername == "useCard1") {
						var num = get.number(trigger.card, player);
						player.storage.xingtu_mark = num;
						player[typeof num != "number" ? "unmarkSkill" : "markSkill"]("xingtu_mark");
						if (typeof num != "number") event.finish();
					}
					"step 1";
					var cards1 = [],
						cards2 = [],
						num = player.storage.xingtu_mark;
					player.getCards("h").forEach(card => {
						var numx = get.number(card, player);
						if (typeof numx == "number") {
							if (numx % num == 0) cards1.push(card);
							if (num % numx == 0) cards2.push(card);
						}
					});
					player.addGaintag(cards1, "xingtu1");
					player.addGaintag(cards2, "xingtu2");
				},
				intro: { content: "上一张牌的点数：#" },
			},
		},
	},
	juezhi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") > 1;
		},
		filterCard: true,
		position: "he",
		selectCard: [2, Infinity],
		check(card) {
			if (ui.selected.cards.length > 1) return 0;
			var player = _status.event.player;
			if (player.hasSkill("xingtu") && player.storage.xingtu) {
				var cards = player.getCards("he");
				var num = player.storage.xingtu,
					stop = false;
				for (var i = 0; i <= cards.length; i++) {
					if (i != cards.length) {
						var num1 = get.number(cards[i], player);
						if (typeof num1 != "number") continue;
						for (var j = 0; j < cards.length; j++) {
							if (i == j) continue;
							var num2 = get.number(cards[j], player);
							if (typeof num2 != "number") continue;
							var sum = num1 + num2;
							if (sum % num == 0 || num % sum == 0) {
								stop = true;
								break;
							}
						}
						if (stop) break;
					}
				}
				if (i != cards.length) {
					var cardx = [cards[i], cards[j]];
					if (cardx.includes(card)) return 10 - get.value(card);
				}
			}
			return 5 - get.value(card);
		},
		content() {
			var num = 0;
			for (var i of cards) num += get.number(i, player);
			num = num % 13;
			if (num == 0) num = 13;
			var card = get.cardPile2(function (card) {
				return get.number(card, false) == num;
			});
			if (card) player.gain(card, "gain2");
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	reganlu: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		selectTarget: 2,
		delay: 0,
		filterTarget(card, player, target) {
			if (target.isMin()) return false;
			if (ui.selected.targets.length == 0) return true;
			if (ui.selected.targets[0].countCards("e") == 0 && target.countCards("e") == 0) return false;
			return target == player || ui.selected.targets[0] == player || Math.abs(ui.selected.targets[0].countCards("e") - target.countCards("e")) <= player.maxHp - player.hp;
		},
		multitarget: true,
		multiline: true,
		content() {
			targets[0].swapEquip(targets[1]);
		},
		ai: {
			order: 10,
			threaten(player, target) {
				return 0.8 * Math.max(1 + target.maxHp - target.hp);
			},
			result: {
				target(player, target) {
					var list1 = [];
					var list2 = [];
					var num = player.maxHp - player.hp;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (get.attitude(player, players[i]) > 0) list1.push(players[i]);
						else if (get.attitude(player, players[i]) < 0) list2.push(players[i]);
					}
					list1.sort(function (a, b) {
						return a.countCards("e") - b.countCards("e");
					});
					list2.sort(function (a, b) {
						return b.countCards("e") - a.countCards("e");
					});
					var delta;
					for (var i = 0; i < list1.length; i++) {
						for (var j = 0; j < list2.length; j++) {
							delta = list2[j].countCards("e") - list1[i].countCards("e");
							if (delta <= 0) continue;
							if (delta <= num || list1[i] == player || list2[j] == player) {
								if (target == list1[i] || target == list2[j]) {
									return get.attitude(player, target);
								}
								return 0;
							}
						}
					}
					return 0;
				},
			},
		},
	},
	//孙休
	mobilexingxue: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return (player.storage.mobileyanzhu ? player.maxHp : player.hp) > 0;
		},
		direct: true,
		content() {
			"step 0";
			var num = player.storage.mobileyanzhu ? player.maxHp : player.hp;
			player.chooseTarget([1, num], get.prompt2("mobilexingxue")).set("ai", function (target) {
				var att = get.attitude(_status.event.player, target);
				if (target.countCards("he")) return att;
				return att / 10;
			});
			"step 1";
			if (result.bool) {
				player.logSkill("mobilexingxue", result.targets);
				event.targets = result.targets;
				event.targets2 = event.targets.slice(0);
				event.targets.sort(lib.sort.seat);
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets.length) {
				var target = event.targets.shift();
				target.draw();
				event.current = target;
			} else {
				event.finish();
			}
			"step 3";
			if (event.current && event.current.countCards("he")) {
				if (!player.storage.mobileyanzhu || event.targets2.length == 1) event.current.chooseCard("选择一张牌置于牌堆顶", "he", true);
				else
					event.current.chooseCardTarget({
						prompt: "将一张牌置于牌堆顶，或交给其他目标角色",
						filterCard: true,
						position: "he",
						filterTarget(card, player, target) {
							return target != player && _status.event.getParent().targets2.includes(target);
						},
						forced: true,
						selectTarget: [0, 1],
						ai1: card => 6 - get.value(card),
						ai2: target => get.attitude(_status.event.player, target),
					});
			} else {
				event.goto(2);
			}
			"step 4";
			if (result && result.cards) {
				event.card = result.cards[0];
				if (!result.targets || !result.targets.length) {
					event.current.lose(result.cards, ui.cardPile, "insert");
					game.broadcastAll(function (player) {
						var cardx = ui.create.card();
						cardx.classList.add("infohidden");
						cardx.classList.add("infoflip");
						player.$throw(cardx, 1000, "nobroadcast");
					}, event.current);
				} else {
					event.current.give(result.cards, result.targets[0]);
				}
			} else {
				event.card = null;
			}
			"step 5";
			event.goto(2);
		},
		derivation: "mobilexingxuex",
	},
	mobileyanzhu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("hej") > 0 && target != player;
		},
		content() {
			"step 0";
			if (target.countCards("e")) {
				target
					.chooseBool("是否将装备区内的所有牌交给" + get.translation(player) + "？", "若选择“取消”，则其将获得你区域里的一张牌")
					.set("ai", function () {
						if (_status.event.effect > 0) return false;
						if (_status.event.player.countCards("e") >= 3) return false;
						return true;
					})
					.set("effect", get.effect(target, { name: "shunshou" }, player, target));
			} else {
				player.gainPlayerCard(target, true, "he");
				event.finish();
			}
			"step 1";
			if (result.bool) {
				var es = target.getCards("e");
				target.give(es, player, "give");
				player.removeSkills("mobileyanzhu");
				player.storage.mobileyanzhu = true;
				player.popup("兴学");
				game.log(player, "修改了技能", "#g【兴学】");
			} else {
				player.gainPlayerCard(target, true, "hej");
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					var ne = target.countCards("e"),
						nj = target.countCards("j");
					if (nj) return 2.5;
					if (!ne) return -2;
					if (ne >= 2) return -ne;
					return 0;
				},
			},
		},
	},
	//毛玠
	bingqing: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			const evt = event.getParent("phaseUse");
			if (!evt || !evt.player || evt.player != player) return false;
			const suit = get.suit(event.card);
			if (!lib.suit.includes(suit)) return false;
			if (
				player
					.getHistory("useCard", evtx => {
						return evtx.getParent("phaseUse") == evt && get.suit(evtx.card) == suit;
					})
					.indexOf(event) != 0
			)
				return false;
			return Array.from({ length: 3 })
				.map((_, i) => i + 2)
				.includes(
					player
						.getHistory(
							"useCard",
							evtx => {
								return evtx.getParent("phaseUse") == evt && lib.suit.includes(get.suit(evtx.card));
							},
							event
						)
						.reduce((list, evtx) => list.add(get.suit(evtx.card)), []).length
				);
		},
		async cost(event, trigger, player) {
			const evt = trigger.getParent("phaseUse");
			const num = player
				.getHistory(
					"useCard",
					evtx => {
						return evtx.getParent("phaseUse") == evt && lib.suit.includes(get.suit(evtx.card));
					},
					trigger
				)
				.reduce((list, evtx) => list.add(get.suit(evtx.card)), []).length;
			let prompt, filterTarget, ai;
			switch (num) {
				case 2:
					prompt = "令一名角色摸两张牌";
					filterTarget = function (card, player, target) {
						return true;
					};
					ai = function (target) {
						var player = _status.event.player;
						var att = get.attitude(player, target);
						if (target.hasSkill("nogain")) att /= 10;
						return att / Math.sqrt(Math.min(5, 1 + target.countCards("h")));
					};
					break;
				case 3:
					prompt = "弃置一名角色区域内的一张牌";
					filterTarget = function (card, player, target) {
						return target.hasCard(function (card) {
							return lib.filter.canBeDiscarded(card, player, target);
						}, "hej");
					};
					ai = function (target) {
						var player = _status.event.player;
						return get.effect(target, { name: "guohe" }, player, player);
					};
					break;
				case 4:
					prompt = "对一名其他角色造成1点伤害";
					filterTarget = function (card, player, target) {
						return target != player;
					};
					ai = function (target) {
						var player = _status.event.player;
						return get.damageEffect(target, player, player);
					};
					break;
				default:
					event.result = { bool: false };
					return;
			}
			let result = await player.chooseTarget(get.prompt("bingqing"), prompt, filterTarget).set("ai", ai).forResult();
			result.cost_data = num;
			event.result = result;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			switch (event.cost_data) {
				case 2:
					await target.draw(2);
					break;
				case 3:
					await player.discardPlayerCard(target, true, "hej");
					break;
				case 4:
					await target.damage();
					break;
			}
		},
	},
	yingfeng: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("yingfeng"), "令一名角色获得“奉”标记", function (card, player, target) {
					return !target.hasSkill("yingfeng_mark");
				})
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (att <= 0) return 0;
					var eff = 0.1;
					var preTarget = game.findPlayer(function (current) {
						return current != target && current.hasSkill("yingfeng_mark");
					});
					if (preTarget) {
						if (get.attitude(player, preTarget) < 0) eff += 4;
						else if (preTarget.hasValueTarget({ name: "sha" }, false) && !preTarget.hasValueTarget({ name: "sha" })) eff -= 3;
					}
					if (target.hasValueTarget({ name: "sha" }, false) && !target.hasValueTarget({ name: "sha" })) eff += 3;
					if (player == target) att *= 1.2;
					return 0.01 + att * eff;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("yingfeng", target);
				target.addAdditionalSkill("yingfeng_" + player.playerid, "yingfeng_mark");
				game.countPlayer(function (current) {
					if (current != target && current.hasSkill("yingfeng_mark")) {
						current.removeSkill("yingfeng_mark");
						current.removeAdditionalSkill("yingfeng_" + player.playerid);
					}
				});
			}
		},
		subSkill: {
			mark: {
				charlotte: true,
				mark: true,
				marktext: "奉",
				mod: {
					targetInRange: () => true,
				},
				intro: { content: "使用牌无距离限制" },
			},
		},
	},
	//虞翻
	rezongxuan: {
		inherit: "zongxuan",
		group: "rezongxuan_place",
	},
	rezongxuan_place: {
		audio: "rezongxuan",
		enable: "phaseUse",
		usable: 1,
		sourceSkill: "rezongxuan",
		content() {
			"step 0";
			player.draw();
			"step 1";
			player.chooseCard("he", true, "将一张牌置于牌堆顶");
			"step 2";
			if (result && result.cards) {
				event.card = result.cards[0];
				player.lose(result.cards, ui.cardPile, "insert");
				game.log(player, "将", get.position(event.card) == "h" ? "一张牌" : event.card, "置于牌堆顶");
				game.broadcastAll(function (player) {
					var cardx = ui.create.card();
					cardx.classList.add("infohidden");
					cardx.classList.add("infoflip");
					player.$throw(cardx, 1000, "nobroadcast");
				}, player);
			} else event.finish();
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	//孙寒华
	chongxu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			player.chooseToPlayBeatmap(lib.skill.chongxu.beatmaps.randomGet());
			"step 1";
			var score = Math.floor(Math.min(5, result.accuracy / 17));
			event.score = score;
			game.log(player, "的演奏评级为", "#y" + result.rank[0], "，获得积分点数", "#y" + score, "分");
			if (score < 3) {
				if (score >= 2) player.draw();
				event.finish();
				return;
			}
			var list = [];
			if (player.countMark("miaojian") < 2 && player.hasSkill("miaojian")) list.push("修改【妙剑】");
			if (player.countMark("shhlianhua") < 2 && player.hasSkill("shhlianhua")) list.push("修改【莲华】");
			if (list.length) {
				list.push("全部摸牌");
				player.chooseControl(list).set("prompt", "冲虚：修改技能" + (score == 5 ? "并摸一张牌" : "") + "；或摸" + Math.floor(score / 2) + "张牌");
			} else event._result = { control: "全部摸牌" };
			"step 2";
			var score = event.score;
			if (result.control != "全部摸牌") {
				score -= 3;
				var skill = result.control == "修改【妙剑】" ? "miaojian" : "shhlianhua";
				player.addMark(skill, 1, false);
				game.log(player, "修改了技能", "#g【" + get.translation(skill) + "】");
			}
			if (score > 1) player.draw(Math.floor(score / 2));
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		beatmaps: [
			{
				//歌曲名称
				name: "鳥の詩",
				//歌曲文件名（默认在audio/effect文件夹下 若要重定向到扩展 请写为'ext:扩展名称/文件名'的格式）
				filename: "tori_no_uta",
				//每个音符的开始时间点（毫秒，相对未偏移的开始播放时间）
				timeleap: [1047, 3012, 4978, 5469, 5961, 6452, 6698, 7435, 8909, 10875, 12840],
				//开始播放时间的偏移量（毫秒）
				current: -110,
				//判定栏高度（相对整个对话框高度比例）
				judgebar_height: 0.16,
				//Good/Great/Prefect的位置判定范围（百分比，相对于整个对话框。以滑条的底部作为判定基准）
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				//滑条每相对于整个对话框下落1%所需的时间（毫秒）
				speed: 25,
			},
			{
				name: "竹取飛翔　～ Lunatic Princess",
				filename: "taketori_hishou",
				timeleap: [1021, 1490, 1959, 2896, 3834, 4537, 4771, 5709, 6646, 7585, 8039, 8494, 9403, 10291, 11180, 11832, 12049, 12920, 13345, 13771, 14196],
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(rgba(250, 170, 190, 1), rgba(240, 160, 180, 1))",
				judgebar_color: "linear-gradient(rgba(240, 120, 243, 1), rgba(245, 106, 230, 1))",
			},
			{
				name: "ignotus",
				filename: "ignotus",
				//Number of tracks
				//轨道数量
				number_of_tracks: 4,
				//Customize the track to generate for every note (0 is the first track)
				//自定义每个音符生成的轨道（0是第一个轨道）
				mapping: [0, 2, 3, 1, 1, 0, 3, 0, 0, 3, 0, 0, 2, 1, 2],
				//Convert from beats (0 is the first beat) to timeleap
				//将节拍（0是第一拍）转换为开始时间点
				timeleap: game.generateBeatmapTimeleap(170, [0, 4, 8, 12, 14, 16, 16.5, 23.5, 24, 31, 32, 40, 45, 46, 47]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(rgba(240, 250, 240, 1), rgba(230, 240, 230, 1))",
				judgebar_color: "linear-gradient(rgba(161, 59, 150, 1), rgba(58, 43, 74, 1))",
			},
			{
				name: "Super Mario 3D World Theme",
				filename: "sm3dw_overworld",
				//Random (Randomly choose tracks to generate notes each play)
				//随机（每次演奏时音符会随机选择轨道生成）
				mapping: "random",
				timeleap: [0, 1071, 1518, 2054, 4018, 4286, 5357, 6429, 7500, 8571, 9643, 10714, 11786, 12321, 12589, 12857, 13929, 15000, 16071, 17143, 18214, 18482, 18750, 19018, 19286, 20357],
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(rgba(120, 130, 240, 1), rgba(100, 100, 230, 1))",
				judgebar_color: "linear-gradient(rgba(230, 40, 30, 1), rgba(220, 30, 10, 1))",
			},
			{
				name: "只因你太美",
				filename: "chicken_you_are_so_beautiful",
				number_of_tracks: 7,
				mapping: [3, 6, 4, 5, 6, 2, 3, 2, 1, 2, 0, 4, 3, 6, 5, 4, 3, 6, 3, 2, 3, 1, 0, 1, 2, 3, 4, 5, 6],
				timeleap: game.generateBeatmapTimeleap(107, [2, 3.5, 4.5, 5.5, 6.5, 8.5, 10, 11.5, 12.5, 13.5, 14.5, 15.5, 18, 19.5, 20.5, 21.5, 22.5, 24.5, 26, 27.5, 28.5, 29.5, 30.5, 31, 31.5, 32, 32.5, 33, 33.5]),
				//Hitsound file name (By default in the audio/effect folder. To redirect to the extension, please write in the format of 'ext:extension_name')
				//打击音文件名（默认在audio/effect文件夹下 若要重定向到扩展 请写为'ext:扩展名称'的格式）
				hitsound: "chickun.wav",
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#99f, #66c)",
				judgebar_color: "linear-gradient(#ccf, #99c)",
			},
			{
				name: "Croatian Rhapsody",
				filename: "croatian_rhapsody",
				mapping: [4, 1, 2, 1, 0, 0, 4, 5, 1, 3, 2, 1, 0, 0],
				timeleap: game.generateBeatmapTimeleap(96, [4, 6, 8, 9, 10, 11, 12, 13.5, 14, 15.5, 16, 17, 18, 19]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#fff, #ccc)",
				judgebar_color: "linear-gradient(#fff, #ccc)",
			},
			{
				name: "罗刹海市",
				filename: "rakshasa_sea_city",
				number_of_tracks: 7,
				mapping: "random",
				timeleap: game.generateBeatmapTimeleap(150, [0, 2, 4, 6, 7, 9, 11, 13, 14, 16, 18, 20, 21, 23, 25, 27]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#333, #000)",
				judgebar_color: "linear-gradient(#c66, #933)",
			},
			{
				name: "Pigstep (Stereo Mix)",
				filename: "pigstep",
				number_of_tracks: 16,
				timeleap: game.generateBeatmapTimeleap(170, [3, 4, 6, 6.5, 7.5, 11, 12, 14, 14.5, 15.5, 19, 20, 22, 22.5, 23.5, 27, 28, 30, 30.5, 31.5, 35, 36, 38, 38.5, 39.5, 43, 44, 46, 46.5, 47.5, 51, 52, 54, 54.5, 55.5, 59, 60, 62, 62.5]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#066, #033)",
				judgebar_color: "linear-gradient(#633, #300)",
			},
		],
		derivation: "chongxu_faq",
	},
	miaojian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var level = player.countMark("miaojian");
			if (event.filterCard({ name: "sha", nature: "stab" }, player, event)) {
				if (level == 2) return true;
				if (
					level == 1 &&
					player.hasCard(function (card) {
						return get.type2(card) == "basic";
					}, "hs")
				)
					return true;
				if (
					level == 0 &&
					player.hasCard(function (card) {
						return get.name(card) == "sha";
					}, "hs")
				)
					return true;
			}
			if (event.filterCard({ name: "wuzhong" }, player, event)) {
				if (level == 2) return true;
				if (
					level == 1 &&
					player.hasCard(function (card) {
						return get.type2(card) != "basic";
					}, "hes")
				)
					return true;
				if (
					level == 0 &&
					player.hasCard(function (card) {
						return get.type2(card) == "trick";
					}, "hs")
				)
					return true;
			}
			return false;
		},
		chooseButton: {
			dialog() {
				return ui.create.dialog("妙剑", [
					[
						["基本", "", "sha", "stab"],
						["锦囊", "", "wuzhong"],
					],
					"vcard",
				]);
			},
			filter(button, player) {
				var event = _status.event.getParent(),
					level = player.countMark("miaojian");
				if (button.link[2] == "sha") {
					if (!event.filterCard({ name: "sha", nature: "stab" }, player, event)) return false;
					if (level == 2) return true;
					if (level == 1)
						return player.hasCard(function (card) {
							return get.type2(card) == "basic";
						}, "hs");
					return (
						level == 0 &&
						player.hasCard(function (card) {
							return get.name(card) == "sha";
						}, "hs")
					);
				}
				if (button.link[2] == "wuzhong") {
					if (!event.filterCard({ name: "wuzhong" }, player, event)) return false;
					if (level == 2) return true;
					if (level == 1)
						return player.hasCard(function (card) {
							return get.type2(card) != "basic";
						}, "hes");
					return (
						level == 0 &&
						player.hasCard(function (card) {
							return get.type2(card) == "trick";
						}, "hs")
					);
				}
			},
			check(button) {
				var card = { name: button.link[2], nature: button.link[3] },
					player = _status.event.player;
				return get.value(card, player) * get.sgn(player.getUseValue(card));
			},
			backup(links, player) {
				var index = links[0][2] == "sha" ? 0 : 1,
					level = player.countMark("miaojian");
				var next = {
					audio: "miaojian",
					filterCard: [
						[
							function (card) {
								return get.name(card) == "sha";
							},
							function (card) {
								return get.type(card) == "basic";
							},
							() => false,
						],
						[
							function (card) {
								return get.type2(card) == "trick";
							},
							function (card) {
								return get.type(card) != "basic";
							},
							() => false,
						],
					][index][level],
					position: "hes",
					check(card) {
						if (card) return 6.5 - get.value(card);
						return 1;
					},
					viewAs: [
						{
							name: "sha",
							nature: "stab",
						},
						{
							name: "wuzhong",
						},
					][index],
				};
				if (level == 2) {
					next.selectCard = -1;
					next.viewAs.isCard = true;
				}
				return next;
			},
			prompt(links, player) {
				var index = links[0][2] == "sha" ? 0 : 1,
					level = player.countMark("miaojian");
				return [
					["将一张【杀】当做刺【杀】使用", "将一张基本牌当做刺【杀】使用", "请选择刺【杀】的目标"],
					["将一张锦囊牌当做【无中生有】使用", "将一张非基本牌当做【无中生有】使用", "请选择【无中生有】的目标"],
				][index][level];
			},
		},
		onremove: true,
		derivation: ["miaojian1", "miaojian2"],
		subSkill: { backup: { audio: "miaojian" } },
		ai: {
			order: 7,
			result: { player: 1 },
		},
	},
	shhlianhua: {
		audio: 2,
		derivation: ["shhlianhua1", "shhlianhua2"],
		trigger: { target: "useCardToTargeted" },
		forced: true,
		locked: false,
		filter: event => event.card.name == "sha",
		content() {
			"step 0";
			player.draw();
			var level = player.countMark("shhlianhua");
			if (!level) event.finish();
			else if (level == 2) event.goto(2);
			else
				player
					.judge(function (result) {
						return get.suit(result) == "spade" ? 1 : -1;
					})
					.set("judge2", result => result.bool);
			"step 1";
			if (result.bool) trigger.excluded.add(player);
			event.finish();
			"step 2";
			var eff = get.effect(player, trigger.card, trigger.player, trigger.player);
			trigger.player
				.chooseToDiscard("he", "弃置一张牌，或令" + get.translation(trigger.card) + "对" + get.translation(player) + "无效")
				.set("ai", function (card) {
					if (_status.event.eff > 0) {
						return 10 - get.value(card);
					}
					return 0;
				})
				.set("eff", eff);
			"step 3";
			if (result.bool == false) {
				trigger.getParent().excluded.add(player);
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (card.name == "sha" && current < 0) return 0.7;
				},
			},
		},
	},
	//阎圃
	huantu: {
		audio: 2,
		trigger: { global: "phaseDrawBefore" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0 && !player.hasSkill("huantu_round") && player.inRange(event.player);
		},
		checkx(event, player) {
			var target = event.player;
			return get.attitude(player, target) > 0 && (target.hasSkill("pingkou") || target.skipList.includes("phaseUse") || (target.isDamaged() && target.hp <= 2) || target.needsToDiscard());
		},
		content() {
			"step 0";
			player
				.chooseCard(get.prompt("huantu", trigger.player), "交给其一张牌并令其暂时跳过摸牌阶段", "he")
				.set("ai", function (card) {
					if (!_status.event.checkx) return 0;
					return 1 + Math.random();
				})
				.set("checkx", lib.skill.huantu.checkx(trigger, player));
			"step 1";
			if (result.bool) {
				player.addTempSkill("huantu_round", "roundStart");
				player.logSkill("huantu", trigger.player);
				player.give(result.cards, trigger.player);
				trigger.cancel();
				player.addTempSkill("huantu_effect");
			}
		},
		subSkill: {
			round: {
				charlotte: true,
				mark: true,
				intro: { content: "本轮已发动" },
			},
			effect: {
				audio: "huantu",
				trigger: { global: "phaseJieshuBegin" },
				forced: true,
				charlotte: true,
				logTarget: "player",
				filter(event, player) {
					return event.player.isIn();
				},
				content() {
					"step 0";
					var str = get.translation(trigger.player);
					player
						.chooseControl()
						.set("choiceList", ["令" + str + "回复1点体力并摸两张牌", "摸三张牌，然后交给" + str + "两张手牌"])
						.set("choice", trigger.player.isDamaged() ? 0 : 1);
					"step 1";
					if (result.index == 0) {
						trigger.player.recover();
						trigger.player.draw(2);
						event.finish();
					} else {
						event.target = trigger.player;
						player.draw(3);
					}
					"step 2";
					var hs = player.getCards("h");
					if (hs.length && target.isIn() && player.isIn()) {
						if (hs.length <= 2) event._result = { bool: true, cards: hs };
						else player.chooseCard("h", 2, true, "交给" + get.translation(target) + "两张手牌");
					} else event.finish();
					"step 3";
					if (result.bool) player.give(result.cards, trigger.player);
				},
			},
		},
	},
	bihuo: {
		audio: 2,
		trigger: { global: "dyingAfter" },
		logTarget: "player",
		limited: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			player.awakenSkill("bihuo");
			trigger.player.draw(3);
			trigger.player.addTempSkill("bihuo_effect", "roundStart");
			trigger.player.addMark("bihuo_effect", game.countPlayer(), false);
		},
		subSkill: {
			effect: {
				onremove: true,
				charlotte: true,
				mod: {
					globalTo(from, to, distance) {
						return distance + to.countMark("bihuo_effect");
					},
				},
				intro: { content: "其他角色至你的距离+#" },
			},
		},
	},
	//马元义
	jibing: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			return player.getExpansions("jibing").length > 0 && (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) || event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event));
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("集兵", "hidden");
				if (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) && event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event)) {
					dialog._chooseButton = 2;
					var list = ["sha", "shan"];
					dialog.add([
						list.map(i => {
							return [i, get.translation(i)];
						}),
						"tdnodes",
					]);
				} else dialog._cardName = event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) ? "sha" : "shan";
				dialog.add(player.getExpansions("jibing"));
				return dialog;
			},
			filter(button) {
				var evt = _status.event,
					player = _status.event.player;
				if (evt.dialog) {
					if (!evt.dialog._chooseButton) {
						var evt2 = _status.event.getParent();
						return evt2.filterCard(get.autoViewAs({ name: evt.dialog._cardName }, [button.link]), player, evt2);
					}
					if (ui.selected.buttons.length) {
						var str = ui.selected.buttons[0].link;
						if (typeof str != "string" || typeof button.link == "string") return false;
						var evt2 = _status.event.getParent();
						return evt2.filterCard(get.autoViewAs({ name: str }, [button.link]), player, evt2);
					}
					return typeof button.link == "string";
				}
				return false;
			},
			select() {
				return _status.event.dialog ? _status.event.dialog._chooseButton || 1 : 1;
			},
			backup(links, player) {
				var card, name;
				if (links.length == 2) {
					name = links[0];
					card = links[1];
				} else {
					card = links[0];
					var event = _status.event;
					name = event.filterCard(get.autoViewAs({ name: "sha" }, [card]), player, event) ? "sha" : "shan";
				}
				return {
					audio: "jibing",
					filterCard(card) {
						return card == lib.skill.jibing_backup.card;
					},
					selectCard: -1,
					position: "x",
					viewAs: { name: name },
					card: card,
				};
			},
			prompt(links, player) {
				return "请选择【杀】的目标";
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				return player.getExpansions("jibing").length > 0;
			},
			order(item, player) {
				if (player.hasSkill("binghuo")) return 6;
				return 1;
			},
			result: {
				player: 1,
			},
		},
		group: "jibing_place",
		subSkill: {
			place: {
				audio: "jibing",
				trigger: { player: "phaseDrawBegin1" },
				prompt2: "摸牌阶段开始时，若你的“兵”数小于势力数，则你可以改为将牌堆顶的两张牌置于你的武将牌上，称为“兵”。",
				filter(event, player) {
					return !event.numFixed && player.getExpansions("jibing").length < game.countGroup();
				},
				content() {
					trigger.changeToZero();
					var cards = get.cards(2);
					player.addToExpansion(cards, "gain2").gaintag.add("jibing");
				},
			},
			backup: { audio: "jibing" },
		},
		intro: { content: "expansion", markcount: "expansion" },
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
	},
	wangjing: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			if (event.skill != "jibing_backup") return false;
			var target = lib.skill.wangjing.logTarget(event, player);
			return target && target.isMaxHp();
		},
		logTarget(event, player) {
			if (event.name == "respond") return event.source;
			if (event.card.name == "sha") return event.targets[0];
			return event.respondTo[0];
		},
		forced: true,
		content() {
			player.draw();
		},
		ai: {
			combo: "jibing",
			mingzhi: false,
			effect: {
				target(card, player, target, current) {
					if ((get.tag(card, "respondShan") || get.tag(card, "respondSha")) && target.getExpansions("jibing").length > 0 && player.isMaxHp()) {
						if (get.attitude(target, player) <= 0) {
							return [0, 0, 1, 0.3];
						}
					}
				},
			},
		},
	},
	moucuan: {
		audio: 2,
		derivation: "binghuo",
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "metal",
		filter(event, player) {
			return player.getExpansions("jibing").length >= game.countGroup();
		},
		content() {
			player.awakenSkill("moucuan");
			player.loseMaxHp();
			player.addSkills("binghuo");
		},
		ai: { combo: "jibing" },
	},
	binghuo: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return (
				player.hasHistory("useCard", function (evt) {
					return evt.skill == "jibing_backup";
				}) ||
				player.hasHistory("respond", function (evt) {
					return evt.skill == "jibing_backup";
				})
			);
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("binghuo")).set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("binghuo", target);
				target.judge(function (card) {
					if (get.color(card) == "black") return -2;
					return 0.1;
				}).judge2 = function (result) {
					return result.bool === false ? true : false;
				};
			} else event.finish();
			"step 2";
			if (result.bool == false) target.damage("thunder");
		},
		ai: { combo: "jibing", expose: 0.2 },
	},
	//傅佥
	jueyong: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		forced: true,
		filter(event, player) {
			return event.card.name != "jiu" && event.card.name != "tao" && event.targets.length == 1 && event.card.isCard && event.cards.length == 1 && event.getParent(2).name != "jueyong_timeout" && get.position(event.cards[0], true) == "o" && event.card.name == event.cards[0].name && (!player.storage.jueyong || player.storage.jueyong[0].length < player.getHp());
		},
		content() {
			trigger.targets.remove(player);
			trigger.getParent().triggeredTargets2.remove(player);
			trigger.untrigger();
			var card = trigger.cards[0];
			player.addToExpansion(card, "gain2").gaintag.add("jueyong");
			if (!player.storage.jueyong) player.storage.jueyong = [[], []];
			player.storage.jueyong[0].push(card);
			player.storage.jueyong[1].push(trigger.player);
			game.delayx();
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
			delete player.storage[skill];
		},
		intro: {
			markcount(storage) {
				if (!storage) return 0;
				return storage[0].length;
			},
			mark(dialog, storage, player) {
				if (!storage) return;
				dialog.addAuto(storage[0]);
				dialog.addText(get.translation(storage[1]));
			},
			onunmark(storage, player) {
				player.storage.jueyong = [[], []];
			},
		},
		ai: {
			reverseEquip: true,
			effect: {
				target_use(card, player, target, current) {
					if (get.type(card) == "equip" && !get.tag(card, "gifts") && target.storage.jueyong && target.storage.jueyong[1].length) {
						var result1 = get.equipResult(player, target, card),
							subtype = get.subtype(card);
						for (var i of target.storage.jueyong[0]) {
							if (get.subtype(i, false) == subtype && get.equipResult(target, target, i) >= result1) return "zerotarget";
						}
					}
				},
			},
		},
		group: "jueyong_timeout",
		subSkill: {
			timeout: {
				audio: "jueyong",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				filter(event, player) {
					return player.storage.jueyong && player.storage.jueyong[0].length > 0; //=Math.max(1,player.getDamagedHp());
				},
				content() {
					var list = player.storage.jueyong,
						card = list[0].shift(),
						source = list[1].shift();
					if (player.getExpansions("jueyong").includes(card)) {
						if (source && source.isIn() && source.canUse(card, player, false)) source.useCard(card, player, false);
						else player.loseToDiscardpile(card);
					}
					if (list[0].length) event.redo();
				},
			},
		},
	},
	poxiang: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter: (event, player) => player.countCards("he") > 0,
		filterCard: true,
		filterTarget: lib.filter.notMe,
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			var player = _status.event.player;
			if (
				!player.storage.jueyong ||
				!player.storage.jueyong[0].length ||
				(player.hp <= 1 &&
					!player.storage.jueyong[0].some(function (card) {
						return get.tag(card, "damage") > 0;
					})) ||
				!player.storage.jueyong[0].some(function (card) {
					return get.effect(player, card, player.storage.jueyong[1][player.storage.jueyong[0].indexOf(card)], player) < 0;
				})
			)
				return -1;
			return 20 - get.value(card);
		},
		content() {
			"step 0";
			player.give(cards, target);
			player.draw(3).gaintag = ["poxiang"];
			player.addTempSkill("poxiang_mark");
			"step 1";
			var cards = player.getExpansions("jueyong");
			if (cards.length) player.loseToDiscardpile(cards);
			player.unmarkSkill("jueyong");
			player.loseHp();
			"step 2";
			//player.skip('phaseDiscard');
			game.delayx();
		},
		ai: {
			order: 12,
			result: {
				player: 4,
				target: 1,
			},
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("poxiang");
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("poxiang")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("poxiang")) {
							return false;
						}
					},
				},
			},
		},
	},
	//曹真
	disordersidi: { audio: 2 },
	discretesidi: {
		audio: "disordersidi",
		trigger: { player: "useCardAfter" },
		direct: true,
		filter(event, player) {
			return (
				get.type(event.card, null, false) != "delay" &&
				game.hasPlayer(function (current) {
					return player != current && (!player.storage.discretesidi || !player.storage.discretesidi.includes(current));
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("discretesidi"), "选择两名角色a,b建立二元序偶<a,b>，或仅选择一名角色，建立二元序偶<a,a>", [1, 2], function (card, player, target) {
					if (ui.selected.targets.length) return true;
					return target != player && (!player.storage.discretesidi || !player.storage.discretesidi.includes(target));
				})
				.set("complexTarget", true)
				.set("complexSelect", true)
				.set("targetprompt", ["第一元素", "第二元素"])
				.set("ai", function (target) {
					var player = _status.event.player;
					if (!ui.selected.targets.length) {
						if (target.getEnemies().length == 1) return 2 + Math.random();
						return 1 + Math.random();
					}
					var targetx = ui.selected.targets[0];
					if (targetx.getEnemies().includes(target) && targetx.inRange(target)) return Math.random() - 0.5;
					return 0;
				}).animate = false;
			"step 1";
			if (result.bool && result.targets.length) {
				var targets = result.targets;
				player.logSkill("discretesidi", targets[0]);
				if (targets.length == 1) targets.push(targets[0]);
				if (!player.storage.discretesidi) player.storage.discretesidi = [];
				if (!player.storage.discretesidi2) player.storage.discretesidi2 = [];
				player.storage.discretesidi.push(targets[0]);
				player.storage.discretesidi2.push(targets[1]);
				player.markSkill("discretesidi");
				game.delayx();
			}
		},
		intro: {
			content(storage, player) {
				if ((player == game.me || player.isUnderControl()) && !game.observe) {
					var str = "R={ ";
					for (var i = 0; i < storage.length; i++) {
						str += "&lt;" + get.translation(storage[i]) + ", " + get.translation(player.storage.discretesidi2[i]) + "&gt;";
						if (i < storage.length - 1) str += ", ";
					}
					str += " }";
					return str;
				}
				return "已指定" + get.translation(storage) + "为目标";
			},
		},
		onremove(player) {
			delete player.storage.discretesidi;
			delete player.storage.discretesidi2;
		},
		group: ["discretesidi_clear", "discretesidi_exec"],
		subSkill: {
			clear: {
				trigger: { global: ["useCardToPlayered", "die"] },
				forced: true,
				popup: false,
				locked: false,
				filter(event, player) {
					if (!player.storage.discretesidi || !player.storage.discretesidi.includes(event.player)) return false;
					if (event.name == "die") return true;
					if (get.type(event.card, null, false) != "delay") {
						var index = player.storage.discretesidi.indexOf(event.player);
						return index != -1 && (player.storage.discretesidi2[index] != event.target || event.targets.length != 1);
					}
					return false;
				},
				content() {
					player.storage.discretesidi2.splice(player.storage.discretesidi.indexOf(trigger.player), 1);
					player.unmarkAuto("discretesidi", [trigger.player]);
				},
			},
			exec: {
				audio: "disordersidi",
				trigger: { global: "useCardToPlayered" },
				forced: true,
				locked: false,
				filter(event, player) {
					if (get.type(event.card, null, false) == "delay" || !player.storage.discretesidi || event.targets.length != 1) return false;
					var index = player.storage.discretesidi.indexOf(event.player);
					return index != -1 && player.storage.discretesidi2[index] == event.target;
				},
				logTarget: "player",
				content() {
					"step 0";
					player.storage.discretesidi2.splice(player.storage.discretesidi.indexOf(trigger.player), 1);
					player.unmarkAuto("discretesidi", [trigger.player]);
					if (trigger.target == player) {
						player.draw();
						event.finish();
						return;
					}
					var target = trigger.player;
					event.target = target;
					player
						.chooseControl("cancel2")
						.set("choiceList", ["取消" + get.translation(trigger.card) + "的所有目标并对" + get.translation(target) + "造成1点伤害", "摸两张牌"])
						.set("ai", function () {
							var player = _status.event.player,
								evt = _status.event.getTrigger();
							if (get.damageEffect(evt.player, player, player) > 0 && get.effect(evt.target, evt.card, evt.player, player) < 0) return 0;
							return 1;
						});
					"step 1";
					if (result.index == 0) {
						trigger.cancel();
						trigger.targets.length = 0;
						trigger.getParent().triggeredTargets1.length = 0;
						if (!_status.dying.length) target.damage();
					} else if (result.index == 1) player.draw(2);
				},
			},
		},
	},
	//数学家
	mbsidi: {
		audio: "disordersidi",
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return (
				get.type(event.card, false) != "delay" &&
				game.hasPlayer(function (current) {
					return player != current && (!player.storage.mbsidi || !player.storage.mbsidi.includes(current));
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("mbsidi"), "选择一名角色，为其选择一名“司敌”目标角色", function (card, player, target) {
					return target != player && (!player.storage.mbsidi || !player.storage.mbsidi.includes(target));
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					if (target.getEnemies().length == 1) return 2 + Math.random();
					return 1 + Math.random();
				}).animate = false;
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player
					.chooseTarget("为" + get.translation(target) + "选择一名“司敌”目标角色")
					.set("ai", function (target) {
						var player = _status.event.player;
						var targetx = _status.event.target;
						if (targetx.getEnemies().includes(target) && targetx.inRange(target)) return Math.random() + 1.5;
						return targetx == target ? 1 : -1;
					})
					.set("target", target).animate = false;
			} else event.finish();
			"step 2";
			if (result.bool) {
				result.targets.unshift();
				player.logSkill("mbsidi", target);
				if (!player.storage.mbsidi) player.storage.mbsidi = [];
				if (!player.storage.mbsidi2) player.storage.mbsidi2 = [];
				player.storage.mbsidi.push(target);
				player.storage.mbsidi2.push(result.targets[0]);
				player.markSkill("mbsidi");
				game.delayx();
			}
		},
		intro: {
			content(storage, player) {
				if ((player == game.me || player.isUnderControl()) && !game.observe) {
					var storage2 = player.storage.mbsidi2,
						str = "";
					for (var i = 0; i < storage.length; i++) {
						str += get.translation(storage[i]) + "=>" + get.translation(storage2[i]);
						if (i < storage.length - 1) str += "<br>";
					}
					return str;
				}
				return "已指定" + get.translation(storage) + "为目标";
			},
		},
		onremove(player) {
			delete player.storage.mbsidi;
			delete player.storage.mbsidi2;
		},
		group: ["mbsidi_clear", "mbsidi_exec"],
		subSkill: {
			clear: {
				trigger: { global: ["useCardToPlayered", "die"] },
				filter(event, player) {
					if (!player.storage.mbsidi || !player.storage.mbsidi.includes(event.player)) return false;
					if (event.name == "die") return true;
					if (get.type(event.card, false) != "delay") {
						var index = player.storage.mbsidi.indexOf(event.player);
						return index != -1 && (player.storage.mbsidi2[index] != event.target || event.targets.length != 1);
					}
					return false;
				},
				forced: true,
				locked: false,
				popup: false,
				content() {
					player.storage.mbsidi2.splice(player.storage.mbsidi.indexOf(trigger.player), 1);
					player.unmarkAuto("mbsidi", [trigger.player]);
				},
			},
			exec: {
				audio: "disordersidi",
				trigger: { global: "useCardToPlayered" },
				filter(event, player) {
					if (get.type(event.card, false) == "delay" || !player.storage.mbsidi || event.targets.length != 1) return false;
					var index = player.storage.mbsidi.indexOf(event.player);
					return index != -1 && player.storage.mbsidi2[index] == event.target;
				},
				logTarget: "player",
				forced: true,
				locked: false,
				content() {
					"step 0";
					player.storage.mbsidi2.splice(player.storage.mbsidi.indexOf(trigger.player), 1);
					player.unmarkAuto("mbsidi", [trigger.player]);
					if (trigger.target == player) {
						player.draw();
						event.finish();
						return;
					}
					var target = trigger.player;
					event.target = target;
					player
						.chooseControl("cancel2")
						.set("choiceList", ["取消" + get.translation(trigger.card) + "的所有目标" + (_status.dying.length ? "" : "，然后对" + get.translation(target) + "造成1点伤害"), "摸两张牌"])
						.set("ai", function () {
							var player = _status.event.player,
								evt = _status.event.getTrigger();
							if (get.damageEffect(evt.player, player, player) > 0 && get.effect(evt.target, evt.card, evt.player, player) < 0) return 0;
							return 1;
						});
					"step 1";
					if (result.index == 0) {
						trigger.cancel();
						trigger.targets.length = 0;
						trigger.getParent().triggeredTargets1.length = 0;
						if (!_status.dying.length) target.damage();
					} else if (result.index == 1) player.draw(2);
				},
			},
		},
	},
	//孙鲁班
	xinzenhui: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			if (event.targets.length != 1) return false;
			var card = event.card;
			if (card.name != "sha" && (get.type(card, null, false) != "trick" || get.color(card, false) != "black")) return false;
			if (!player.isPhaseUsing() || player.hasSkill("xinzenhui2")) return false;
			return game.hasPlayer(function (current) {
				return current != player && current != event.target && lib.filter.targetEnabled2(card, player, current) && lib.filter.targetInRange(card, player, current);
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("xinzenhui"), function (card, player, target) {
					if (player == target) return false;
					var evt = _status.event.getTrigger();
					return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
				})
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return Math.max(target.countGainableCards(player, "he") ? get.effect(target, { name: "shunshou_copy2" }, player, player) : 0, get.effect(target, trigger.card, player, player));
				});
			"step 1";
			if (result.bool) {
				player.addTempSkill("xinzenhui2", "phaseUseAfter");
				var target = result.targets[0],
					str = get.translation(target);
				event.target = target;
				player.logSkill("xinzenhui", target);
				if (!target.countGainableCards(player, "he")) event._result = { index: 0 };
				else
					player
						.chooseControl()
						.set("choiceList", ["令" + str + "也成为" + get.translation(trigger.card) + "的目标", "获得" + str + "的一张牌，然后其成为" + get.translation(trigger.card) + "的使用者"])
						.set("ai", function () {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player,
								target = _status.event.getParent().target;
							return (target.countGainableCards(player, "he") ? get.effect(target, { name: "shunshou_copy2" }, player, player) : 0) > get.effect(target, trigger.card, player, player) ? 1 : 0;
						});
			} else event.finish();
			"step 2";
			if (result.index == 1) {
				trigger.untrigger();
				trigger.getParent().player = event.target;
				game.log(event.target, "成为了", trigger.card, "的使用者");
				player.gainPlayerCard(target, true, "he");
			} else {
				game.log(event.target, "成为了", trigger.card, "的额外目标");
				trigger.getParent().targets.push(event.target);
			}
		},
	},
	xinzenhui2: {},
	xinjiaojin: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return player.countCards("he", { type: "equip" }) && event.source && event.source.hasSex("male");
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", "骄矜：是否弃置一张装备牌防止伤害？", function (card, player) {
				return get.type(card) == "equip";
			});
			next.set("ai", function (card) {
				var player = _status.event.player;
				if (player.hp == 1 || _status.event.getTrigger().num > 1) {
					return 9 - get.value(card);
				}
				if (player.hp == 2) {
					return 8 - get.value(card);
				}
				return 7 - get.value(card);
			});
			next.logSkill = "xinjiaojin";
			"step 1";
			if (result.bool) {
				game.delay(0.5);
				trigger.cancel();
			}
		},
	},
	//谯周
	zhiming: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "phaseDiscardEnd"] },
		frequent: true,
		content() {
			"step 0";
			player.draw();
			"step 1";
			if (player.countCards("he") > 0) {
				var next = player.chooseCard("he", "是否将一张牌置于牌堆顶？");
				if (trigger.name == "phaseZhunbei") {
					next.set("ai", function (card) {
						var player = _status.event.player,
							js = player.getCards("j");
						if (js.length) {
							var judge = get.judge(js[0]);
							if (judge && judge(card) >= 0) return 20 - get.value(card);
						}
						return 0;
					});
				} else
					next.set("ai", function (card) {
						var player = _status.event.player,
							js = player.next.getCards("j");
						if (js.length) {
							var judge = get.judge(js[0]);
							if (judge && (judge(card) + 0.01) * get.attitude(player, player.next) > 0) return 20 - get.value(card);
						}
						return 0;
					});
			} else event.finish();
			"step 2";
			if (result.bool) {
				player.$throw(get.position(result.cards[0]) == "e" ? result.cards[0] : 1, 1000);
				game.log(player, "将", get.position(result.cards[0]) == "e" ? result.cards[0] : "#y一张手牌", "置于了牌堆顶");
				player.lose(result.cards, ui.cardPile, "insert");
			} else event.finish();
			"step 3";
			game.updateRoundNumber();
			game.delayx();
		},
		ai: { guanxing: true },
	},
	xingbu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		prompt2: "亮出牌堆顶的三张牌，并可以根据其中红色牌的数量，令一名其他角色获得一种效果",
		content() {
			"step 0";
			var cards = game.cardsGotoOrdering(get.cards(3)).cards;
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【星卜】");
			"step 1";
			var num = 0;
			for (var i of cards) {
				if (get.color(i, false) == "red") num++;
			}
			player.chooseTarget("是否选择一名其他角色获得星卜效果（" + get.cnNumber(num) + "张）？", lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player,
					num = _status.event.getParent().num;
				var att = get.attitude(player, target);
				if (num < 3) att *= -1;
				if (num == 2 && target.hasJudge("lebu")) att *= -1.4;
				return att;
			});
			if (num == 0) num = 1;
			event.num = num;
			"step 2";
			if (result.bool) {
				var skill = "xingbu_effect" + num,
					target = result.targets[0];
				player.line(target, "green");
				game.log(player, "选择了", target);
				target.addTempSkill(skill, { player: "phaseEnd" });
				target.addMark(skill, 1, false);
				game.delayx();
			}
		},
		subSkill: {
			effect1: {
				charlotte: true,
				onremove: true,
				intro: { content: "准备阶段开始时弃置#张手牌" },
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				content() {
					player.chooseToDiscard("h", true, player.countMark("xingbu_effect1"));
				},
			},
			effect2: {
				charlotte: true,
				onremove: true,
				intro: { content: "使用【杀】的次数上限-#，跳过弃牌阶段" },
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num - player.countMark("xingbu_effect2");
					},
				},
				trigger: { player: "phaseDiscardBegin" },
				forced: true,
				content() {
					trigger.cancel();
				},
			},
			effect3: {
				charlotte: true,
				onremove: true,
				intro: { content: "摸牌阶段多摸2*#张牌，使用【杀】的次数上限+#。" },
				trigger: { player: ["phaseDrawBegin2"] },
				forced: true,
				filter(event, player) {
					return !event.numFixed;
				},
				content() {
					if (trigger.name == "phaseDraw") trigger.num += player.countMark("xingbu_effect3") * 2;
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("xingbu_effect3");
					},
				},
			},
		},
	},
	//顾雍
	xinshenxing: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return player.hp;
		},
		filter(event, player) {
			return player.countCards("he") > 1;
		},
		selectCard: 2,
		position: "he",
		check(card) {
			if (!ui.selected.cards.length || get.color(card) != get.color(ui.selected.cards[0])) return 6.5 - get.value(card);
			return 6.5 - get.value(card) - get.value(ui.selected.cards[0]);
		},
		filterCard: true,
		content() {
			player.draw(get.color(cards) == "none" ? 2 : 1);
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	xinbingyi: {
		audio: "bingyi",
		audioname: ["xin_guyong"],
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterx(event, player) {
			var cards = player.getCards("h");
			if (cards.length == 1) return true;
			var color = get.color(cards[0], player),
				type = get.type2(cards[0], player);
			for (var i = 1; i < cards.length; i++) {
				if (color && get.color(cards[i], player) != color) color = false;
				if (type && get.type2(cards[i], player) != type) type = false;
				if (!color && !type) return false;
			}
			return true;
		},
		direct: true,
		content() {
			"step 0";
			if (lib.skill.xinbingyi.filterx(trigger, player)) {
				player
					.chooseTarget(get.prompt("xinbingyi"), "展示所有手牌，并选择至多" + get.cnNumber(player.countCards("h")) + "名角色各摸一张牌", [0, player.countCards("h")], function (card, player, target) {
						return true;
					})
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target);
					});
			} else
				player.chooseBool(get.prompt("bingyi"), "展示所有手牌").ai = function () {
					return false;
				};
			"step 1";
			if (result.bool) {
				player.logSkill("xinbingyi");
				player.showHandcards(get.translation(player) + "发动了【秉壹】");
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			if (targets && targets.length) {
				player.line(targets, "green");
				targets.sortBySeat();
				game.asyncDraw(targets);
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	//钟会
	requanji: {
		audio: 2,
		trigger: { player: ["damageEnd", "phaseUseEnd"] },
		frequent: true,
		locked: false,
		filter(event, player) {
			if (event.name == "phaseUse") return player.countCards("h") > player.hp;
			return event.num > 0;
		},
		getIndex(event, player) {
			return event.num || 1;
		},
		async content(event, trigger, player) {
			await player.draw();
			if (player.countCards("h")) {
				const result = await player.chooseCard("将一张手牌置于武将牌上作为“权”", true).forResult();
				if (result.bool && result.cards.length) {
					await player.addToExpansion(result.cards, player, "give").gaintag.add("quanji");
				}
			}
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("quanji").length;
			},
			aiOrder(player, card, num) {
				if (num <= 0 || typeof card !== "object" || !player.isPhaseUsing()) return num;
				if (player.countCards("h") > player.hp + 1) return num;
				if (!player.hasSkill("zili") || player.hasSkill("paiyi")) return num;
				if (player.getExpansions("quanji").length < 3) {
					if (get.type(card) == "equip" && !["equip2", "equip3"].includes(get.subtype(card))) return 0;
					let eff = 6 + player.hp;
					if (!get.tag(card, "gain") && !get.tag(card, "draw")) eff += 3;
					if (player.getUseValue(card) < eff) return 0;
				}
			},
		},
		onremove(player, skill) {
			var cards = player.getExpansions("quanji");
			if (cards.length) player.loseToDiscardpile(cards);
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			notemp: true,
			threaten: 0.8,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						if (!target.hasFriend()) return;
						if (target.hp >= 4) return [0.5, get.tag(card, "damage") * 2];
						if (!target.hasSkill("paiyi") && target.hp > 1) return [0.5, get.tag(card, "damage") * 1.5];
						if (target.hp == 3) return [0.5, get.tag(card, "damage") * 1.5];
						if (target.hp == 2) return [1, get.tag(card, "damage") * 0.5];
					}
				},
			},
		},
	},
	//蔡夫人
	xinqieting: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return (
				player != event.player &&
				event.player.getHistory("sourceDamage", function (evt) {
					return evt.player != event.player;
				}).length == 0
			);
		},
		content() {
			"step 0";
			var list = ["摸一张牌"],
				target = trigger.player,
				str = get.translation(target);
			event.target = target;
			event.addIndex = 0;
			if (target.countCards("h") > 0) list.push("观看" + str + "的两张手牌并获得其中一张");
			else event.addIndex++;
			if (
				target.countCards("e", function (card) {
					return player.canEquip(card);
				}) > 0
			)
				list.push("将" + str + "装备区内的一张牌移动至自己的装备区");
			player
				.chooseControl("cancel2")
				.set("choiceList", list)
				.set("prompt", get.prompt("xinqieting", target))
				.set("ai", function () {
					var evt = _status.event.getParent();
					if (get.attitude(evt.player, evt.target) > 0) return 0;
					var val = evt.target.hasSkillTag("noe") ? 6 : 0;
					if (
						evt.target.countCards("e", function (card) {
							return evt.player.canEquip(card) && get.value(card, evt.target) > val && get.effect(evt.player, card, evt.player, evt.player) > 0;
						}) > 0
					)
						return 2 - evt.addIndex;
					if (evt.target.countCards("h") > 0) return 1;
					return 0;
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("xinqieting", target);
				if (result.index == 0) {
					player.draw();
					event.finish();
				} else if (result.index + event.addIndex == 1) {
					player.choosePlayerCard(target, "h", 2, true);
					player.addExpose(0.2);
					event.goto(3);
				} else {
					player.addExpose(0.1);
					player
						.choosePlayerCard(target, "e", true)
						.set("filterButton", function (button) {
							return _status.event.player.canEquip(button.link);
						})
						.set("ai", function (button) {
							var player = _status.event.player;
							return get.effect(player, button.link, player, player);
						});
				}
			} else event.finish();
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				target.$give(card, player, false);
				game.delay(0.5);
				player.equip(card);
			}
			event.finish();
			"step 3";
			if (result.bool) player.chooseButton(["选择获得一张牌", result.cards], true);
			else event.finish();
			"step 4";
			if (result.bool) {
				var card = result.links[0];
				if (lib.filter.canBeGained(card, player, target)) player.gain(card, target, "giveAuto", "bySelf");
				else game.log("但", card, "不能被", player, "获得！");
			}
		},
	},
	mobilezhongyong: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		direct: true,
		filter(event, player) {
			if (event.card.name != "sha" || !event.isPhaseUsing(player)) return false;
			if (event.cards.filterInD().length > 0) return true;
			var list = lib.skill.mobilezhongyong.getResponds(event);
			if (list.length) {
				for (var evt of list) {
					if (evt.cards.filterInD("od").length > 0) return true;
				}
			}
			return false;
		},
		getResponds(event) {
			var list = [];
			for (var i of event.targets) {
				list.addArray(
					i.getHistory("useCard", function (evt) {
						return evt.card.name == "shan" && evt.respondTo && evt.respondTo[1] == event.card;
					})
				);
			}
			return list;
		},
		content() {
			"step 0";
			event.shas = trigger.cards.filterInD();
			var list = lib.skill.mobilezhongyong.getResponds(trigger);
			if (list.length) {
				event.shans = [];
				for (var evt of list) {
					event.shans.addArray(evt.cards.filterInD("od"));
				}
				event.goto(2);
			} else
				player.chooseBool(get.prompt("mobilezhongyong"), "获得" + get.translation(event.shas)).set("ai", function () {
					var evt = _status.event.getParent();
					return get.value(evt.shas, evt.player) > 0;
				});
			"step 1";
			if (result.bool) {
				player.logSkill("mobilezhongyong");
				player.addTempSkill("mobilezhongyong_buff");
				player.gain(event.shas, "gain2").gaintag.add("mobilezhongyong");
			}
			event.finish();
			"step 2";
			var shans = get.translation(event.shans),
				choiceList = ["获得" + shans];
			if (
				game.hasPlayer(function (current) {
					return current != player && !trigger.targets.includes(current);
				})
			) {
				if (event.shas.length) choiceList[0] += "，然后可以令另一名其他角色获得" + get.translation(event.shas);
				choiceList.push("令另一名其他角色获得" + shans + "，然后你于本回合内使用【杀】的次数上限+1且下一张【杀】的伤害值基数+1");
			}
			player
				.chooseControl("cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt("mobilezhongyong"))
				.set("ai", function () {
					var evt = _status.event.getParent(),
						player = evt.player,
						tri = _status.event.getTrigger();
					if (
						game.hasPlayer(function (current) {
							return current != player && !tri.targets.includes(current) && get.attitude(player, current) > 0;
						}) &&
						player.countCards("hs", function (card) {
							return get.name(card) == "sha" && player.hasValueTarget(card);
						}) > player.getCardUsable({ name: "sha" })
					)
						return 1;
					return 0;
				});
			"step 3";
			if (result.index == 0) {
				player.logSkill("mobilezhongyong");
				player.addTempSkill("mobilezhongyong_buff");
				player.gain(event.shans, "gain2").gaintag.add("mobilezhongyong");
			} else event.goto(6);
			"step 4";
			event.shas = event.shas.filterInD("od");
			if (
				event.shas.length &&
				game.hasPlayer(function (current) {
					return current != player && !trigger.targets.includes(current);
				})
			) {
				player
					.chooseTarget("是否令一名其他角色获得" + get.translation(event.shas) + "？", function (card, player, target) {
						return target != player && !_status.event.getTrigger().targets.includes(target);
					})
					.set("ai", function (target) {
						var player = _status.event.player,
							att = get.attitude(player, target);
						if (att <= 0) return att;
						if (target.hasSkillTag("nogain")) return att / 10;
						if (!target.hasSha()) return 2 * att;
						return att;
					});
			} else event.finish();
			"step 5";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.gain(event.shas, "gain2");
			}
			event.finish();
			"step 6";
			player
				.chooseTarget("令一名其他角色获得" + get.translation(event.shans), true, function (card, player, target) {
					return target != player && !_status.event.getTrigger().targets.includes(target);
				})
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (att <= 0) return att;
					if (target.hasSkillTag("nogain")) return att / 10;
					if (!target.hasShan()) return 2 * att;
					return att;
				});
			"step 7";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("mobilezhongyong", target);
				target.gain(event.shans, "gain2");
				player.addTempSkill("mobilezhongyong_buff");
				player.addMark("mobilezhongyong_buff", 1, false);
				player.addMark("mobilezhongyong_damage", 1, false);
			}
		},
		subSkill: {
			buff: {
				mod: {
					cardEnabled2(card, player) {
						if (get.itemtype(card) == "card" && card.hasGaintag("mobilezhongyong")) return false;
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mobilezhongyong_buff");
					},
				},
				trigger: { player: "useCard1" },
				firstDo: true,
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event.card.name == "sha" && player.countMark("mobilezhongyong_damage") > 0;
				},
				content() {
					trigger.baseDamage += player.storage.mobilezhongyong_damage;
					delete player.storage.mobilezhongyong_damage;
				},
				onremove(player) {
					delete player.storage.mobilezhongyong_buff;
					delete player.storage.mobilezhongyong_damage;
					player.removeGaintag("mobilezhongyong");
				},
			},
		},
	},
	rejieyue: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt2("rejieyue"),
				filterCard: true,
				position: "he",
				filterTarget: lib.filter.notMe,
				ai1(card) {
					var player = _status.event.player;
					if (get.name(card) == "du") return 20;
					if (get.position(card) == "e" && get.value(card) <= 0) return 14;
					if (
						get.position(card) == "h" &&
						game.hasPlayer(function (current) {
							return current != player && get.attitude(player, current) > 0 && current.getUseValue(card) > player.getUseValue(card) && current.getUseValue(card) > player.getUseValue(card);
						})
					)
						return 12;
					if (
						game.hasPlayer(function (current) {
							return current != player && get.attitude(player, current) > 0;
						})
					) {
						if (card.name == "wuxie") return 11;
						if (card.name == "shan" && player.countCards("h", "shan") > 1) return 9;
					}
					return 6 / Math.max(1, get.value(card));
				},
				ai2(target) {
					var player = _status.event.player;
					var card = ui.selected.cards[0];
					var att = get.attitude(player, target);
					if (card.name == "du") return -6 * att;
					if (att > 0) {
						if (get.position(card) == "h" && target.getUseValue(card) > player.getUseValue(card)) return 4 * att;
						if (get.value(card, target) > get.value(card, player)) return 2 * att;
						return 1.2 * att;
					}
					return (-att * Math.min(4, target.countCards("he"))) / 4;
				},
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("rejieyue", target);
				player.give(result.cards, target);
			} else event.finish();
			"step 2";
			var num = 0;
			if (target.countCards("h")) num++;
			if (target.countCards("e")) num++;
			if (num > 0) {
				var next = target.chooseCard("he", num, "选择保留每个区域的各一张牌，然后弃置其余的牌。或点取消，令" + get.translation(player) + "摸三张牌", function (card) {
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (get.position(ui.selected.cards[i]) == get.position(card)) return false;
					}
					return true;
				});
				next.set("complexCard", true);
				next.set("goon", get.attitude(target, player) >= 0);
				next.set("maxNum", num);
				next.set("ai", function (card) {
					if (_status.event.goon) return -1;
					var num = _status.event.maxNum;
					if (ui.selected.cards.length >= num - 1) {
						var cards = player.getCards("he", function (cardx) {
							return cardx != card && !ui.selected.cards.includes(cardx);
						});
						var val = 0;
						for (var cardx of cards) val += get.value(cardx);
						if (val >= 14) return 0;
					}
					return get.value(card);
				});
			} else event._result = { bool: false };
			"step 3";
			if (!result.bool) player.draw(3);
			else {
				var cards = target.getCards("he");
				cards.removeArray(result.cards);
				if (cards.length) target.discard(cards);
			}
		},
		ai: {
			threaten: 1.3,
			expose: 0.2,
		},
	},
	tiansuan: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return !player.storage.tiansuan2;
		},
		content() {
			"step 0";
			player
				.chooseControl("上上签", "上签", "中签", "下签", "下下签", "cancel2")
				.set("prompt", "天算：是否增加其中一个命运签的权重？")
				.set("ai", function () {
					return Math.random() < 0.5 ? 0 : 4;
				});
			"step 1";
			let list = [0, 1, 1, 2, 2, 2, 3, 3, 4];
			if (result.control != "cancel2") list.push(result.index);
			let num = list.randomGet();
			event.num = num;
			let str = get.translation(player) + "抽取的命运签为：" + lib.skill["tiansuan2_" + num].name;
			game.log(player, "抽取出了", "#g" + lib.skill["tiansuan2_" + num].name);
			event.dialog = ui.create.dialog(str);
			event.videoId = lib.status.videoId++;
			game.broadcast("createDialog", event.videoId, str);
			game.pause();
			setTimeout(function () {
				game.resume();
			}, 1500);
			"step 2";
			event.dialog.close();
			game.broadcast("closeDialog", event.videoId);
			player.chooseTarget(true, "令一名角色获得“" + lib.skill["tiansuan2_" + num].name + "”").set("ai", lib.skill["tiansuan2_" + num].aiCheck);
			"step 3";
			if (result.bool) {
				let target = result.targets[0];
				player.line(target, "green");
				game.log(player, "令", target, "获得了命运签");
				player.storage.tiansuan2 = target;
				player.storage.tiansuan3 = "tiansuan2_" + num;
				player.addTempSkill("tiansuan2", { player: "phaseBegin" });
				target.addSkill("tiansuan2_" + num);
				let pos = "e";
				if (target != player) pos += "h";
				if (num == 0) pos += "j";
				if (num < 2 && target.countGainableCards(player, pos) > 0) {
					let next = player.gainPlayerCard(target, pos, true);
					if (num == 0) next.visible = true;
				} else game.delayx();
			}
		},
		derivation: "tiansuan_faq",
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	tiansuan2: {
		charlotte: true,
		onremove(player, skill) {
			if (player.storage.tiansuan2) player.storage.tiansuan2.removeSkill(player.storage.tiansuan3);
			delete player.storage.tiansuan2;
			delete player.storage.tiansuan3;
		},
	},
	tiansuan2_0: {
		name: "上上签",
		trigger: { player: "damageBegin4" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		content() {
			trigger.cancel();
		},
		mark: true,
		intro: {
			content: "当你受到伤害时，防止此伤害。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_0")) return 0;
			var player = _status.event.player;
			var att = get.attitude(player, target);
			if (
				target.countCards("e", function (card) {
					return get.value(card, target) <= 0;
				})
			)
				att *= 2;
			return att / Math.sqrt(Math.max(1, target.hp));
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target)) return "zeroplayertarget";
				},
			},
		},
	},
	tiansuan2_1: {
		name: "上签",
		trigger: { player: "damageBegin4" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		filter(event, player) {
			return event.num > 1;
		},
		content() {
			trigger.num = 1;
		},
		group: "tiansuan2_damage",
		mark: true,
		intro: {
			content: "当你受到伤害时，你令伤害值改为1；当你受到1点伤害后，你摸一张牌。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_1")) return 0;
			var player = _status.event.player;
			var att = get.attitude(player, target);
			if (
				target.countCards("e", function (card) {
					return get.value(card, target) <= 0;
				})
			)
				att *= 2;
			if (target.hp == 1) return att / 2;
			return att / Math.sqrt(Math.max(1, target.hp));
		},
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.player) {
					if (arg.player.hasSkillTag("jueqing", false, player)) return false;
				}
			},
			effect: {
				target(card, player, target, current) {
					if (target && target.hp > 1 && get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target)) return 0.8;
				},
			},
		},
	},
	tiansuan2_damage: {
		trigger: { player: "damageEnd" },
		charlotte: true,
		sourceSkill: "tiansuan",
		content() {
			player.draw(trigger.num);
		},
	},
	tiansuan2_2: {
		name: "中签",
		trigger: { player: "damageBegin4" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		filter(event, player) {
			return event.num > 1;
		},
		content() {
			trigger.num = 1;
		},
		mark: true,
		intro: {
			content: "当你受到伤害时，你令伤害属性改为火属性并将伤害值改为1。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_2")) return 0;
			let player = _status.event.player,
				original = get.damageEffect(target, player, player);
			target.addSkill("tiansuan2_ai");
			let fire = get.damageEffect(target, player, player, "fire");
			target.removeSkill("tiansuan2_ai");
			return (fire - original) * get.attitude(player, target);
		},
		group: ["tiansuan2_fire", "tiansuan2_ai"],
	},
	tiansuan2_ai: {
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.player) {
					if (arg.player.hasSkillTag("jueqing", false, player)) return false;
				}
			},
		},
	},
	tiansuan2_fire: {
		trigger: { player: "damageBefore" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		filter(event, player) {
			return !event.hasNature("fire");
		},
		content() {
			game.setNature(trigger, "fire");
		},
	},
	tiansuan2_3: {
		name: "下签",
		trigger: { player: "damageBegin3" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		content() {
			trigger.num++;
		},
		mark: true,
		intro: {
			content: "当你受到伤害时，你令此伤害+1。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_3")) return 0;
			var player = _status.event.player;
			var att = get.attitude(player, target);
			return -att / Math.sqrt(Math.max(1, target.hp));
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target) && current < 0) return 1.3;
				},
			},
		},
	},
	tiansuan2_4: {
		name: "下下签",
		trigger: { player: "damageBegin3" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		content() {
			trigger.num++;
		},
		mod: {
			cardEnabled(card, player) {
				if (card.name == "tao" || card.name == "jiu") return false;
			},
			cardSavable(card, player) {
				if (card.name == "tao" || card.name == "jiu") return false;
			},
		},
		mark: true,
		intro: {
			content: "当你受到伤害时，你令此伤害+1。你不能使用【酒】或【桃】。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_4")) return 0;
			var player = _status.event.player;
			var att = get.attitude(player, target);
			return -att / Math.sqrt(Math.max(1, target.hp));
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target) && current < 0) return 1.3;
				},
			},
		},
	},
	relieren: {
		audio: 2,
		audioname: ["boss_lvbu3"],
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && player.canCompare(event.target);
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		//priority:5,
		content() {
			"step 0";
			player.chooseToCompare(trigger.target).clear = false;
			"step 1";
			if (result.bool) {
				if (trigger.target.countGainableCards(player, "he")) player.gainPlayerCard(trigger.target, true, "he");
				ui.clear();
			} else {
				var card1 = result.player;
				var card2 = result.target;
				if (get.position(card1) == "d") trigger.target.gain(card1, "gain2");
				if (get.position(card2) == "d") player.gain(card2, "gain2");
			}
		},
	},
	retiaoxin: {
		audio: "tiaoxin",
		audioname: ["sp_jiangwei", "xiahouba", "re_jiangwei"],
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("he");
		},
		content() {
			"step 0";
			target
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") return false;
					return lib.filter.filterCard.apply(this, arguments);
				}, "挑衅：对" + get.translation(player) + "使用一张杀，或令其弃置你的一张牌")
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("sourcex", player);
			"step 1";
			if (result.bool == false && target.countCards("he") > 0) {
				player.discardPlayerCard(target, "he", true);
			} else {
				event.finish();
			}
		},
		ai: {
			order: 4,
			expose: 0.2,
			result: {
				target: -1,
				player(player, target) {
					if (!target.canUse("sha", player)) return 0;
					if (target.countCards("h") == 0) return 0;
					if (target.countCards("h") == 1) return -0.1;
					if (player.hp <= 2) return -2;
					if (player.countCards("h", "shan") == 0) return -1;
					return -0.5;
				},
			},
			threaten: 1.1,
		},
	},
	//南华老仙
	yufeng: {
		inherit: "yufeng_old",
		content() {
			"step 0";
			if (_status.connectMode) event.time = lib.configOL.choose_timeout;
			event.videoId = lib.status.videoId++;
			var maxScore = Math.max(2, 1 + player.countMark("yufeng"));
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				game.pause();
				game.countChoose();
				setTimeout(function () {
					_status.imchoosing = false;
					var max = Math.max(2, 1 + player.countMark("yufeng"));
					var score = Math.random() < 0.5 ? max : get.rand(1, max);
					event._result = {
						bool: true,
						score: score,
						win: score >= max,
					};
					if (event.dialog) event.dialog.close();
					if (event.control) event.control.close();
					game.resume();
				}, 5000);
			};
			var createDialog = function (player, id) {
				if (_status.connectMode) lib.configOL.choose_timeout = "30";
				if (player == game.me) return;
				var str = get.translation(player) + "正在表演《御风飞行》...<br>";
				ui.create.dialog(str).videoId = id;
			};
			var chooseButton = function (maxScore) {
				lib.skill.yufeng.$playFlappyBird(maxScore);
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId);
			if (event.isMine()) {
				chooseButton(maxScore);
			} else if (event.isOnline()) {
				event.player.send(chooseButton, maxScore);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			game.broadcastAll(
				function (id, time) {
					if (_status.connectMode) lib.configOL.choose_timeout = time;
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
				},
				event.videoId,
				event.time
			);
			var result = event.result || result;
			player.popup(get.cnNumber(result.score) + "分", result.win ? "wood" : "fire");
			game.log(player, "御风飞行", result.win ? "#g成功" : "#y失败");
			game.log(player, "获得了", "#g" + result.score + "分");
			var max = player.countMark("yufeng");
			if (!result.win) {
				if (result.score) player.draw(result.score);
				if (max) player.removeMark("yufeng", max, false);
				event.finish();
			} else {
				if (max < 2) player.addMark("yufeng", 1, false);
				event.score = result.score;
				player
					.chooseTarget("请选择【御风】的目标", [1, result.score], function (card, player, target) {
						return target != player && !target.hasSkill("yufeng2");
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						var att = -get.attitude(player, target),
							attx = att * 2;
						if (att <= 0 || target.hasSkill("xinfu_pdgyingshi")) return 0;
						if (target.hasJudge("lebu")) attx -= att;
						if (target.hasJudge("bingliang")) attx -= att;
						return attx / Math.max(2.25, Math.sqrt(target.countCards("h") + 1));
					});
			}
			"step 2";
			if (result.bool) {
				result.targets.sortBySeat();
				player.line(result.targets, "green");
				game.log(result.targets, "获得了", "#y“御风”", "效果");
				for (var i of result.targets) i.addSkill("yufeng2");
				if (event.score > result.targets.length) player.draw(event.score - result.targets.length);
			} else player.draw(event.score);
		},
		$playFlappyBird(maxScore, title) {
			//Forked from: https://github.com/aaarafat/JS-Flappy-Bird

			const event = _status.event;
			const dialog = ui.create.dialog("forcebutton", "hidden");
			dialog.textPrompt = dialog.add('<div class="text center">准备好了吗？</div>');
			dialog.classList.add("fixed");
			dialog.classList.add("scroll1");
			dialog.classList.add("scroll2");
			dialog.classList.add("fullwidth");
			dialog.classList.add("fullheight");
			dialog.classList.add("noupdate");
			const updateText = function (str) {
				dialog.textPrompt.innerHTML = '<div class="text center">' + str + "</div>";
			};

			const canvas = document.createElement("canvas");
			dialog.appendChild(canvas);
			canvas.style.position = "absolute";
			canvas.style.width = "276px";
			canvas.style.height = "414px";
			canvas.style.left = "calc(50% - 141px)";
			canvas.style.top = "calc(50% - 200px)";
			canvas.width = 276;
			canvas.height = 414;
			canvas.style.border = "3px solid";

			const RAD = Math.PI / 180;
			const ctx = canvas.getContext("2d");
			let frames = 0;
			let dx = 0.1;
			let previousDOMHighResTimeStamp = performance.now();
			let deltaTime = 0;
			const state = {
				curr: 0,
				getReady: 0,
				Play: 1,
				gameOver: 2,
				gameSuccess: 3,
			};
			const SFX = {
				start: new Audio(),
				flap: new Audio(),
				score: new Audio(),
				hit: new Audio(),
				die: new Audio(),
				played: false,
			};
			const gnd = {
				sprite: new Image(),
				x: 0,
				y: 0,
				draw() {
					this.y = parseFloat(canvas.height - this.sprite.height);
					ctx.drawImage(this.sprite, this.x, this.y);
				},
				update() {
					if (state.curr == state.gameOver || state.curr == state.gameSuccess) return;
					this.x -= dx * deltaTime;
					const halfWidth = this.sprite.width / 4;
					if (this.x <= -halfWidth) this.x += halfWidth;
				},
			};
			const bg = {
				sprite: new Image(),
				x: 0,
				y: 0,
				draw() {
					let y = parseFloat(canvas.height - this.sprite.height);
					ctx.drawImage(this.sprite, this.x, y);
				},
			};
			const pipe = {
				top: { sprite: new Image() },
				bot: { sprite: new Image() },
				gap: 127,
				moved: true,
				pipes: [],
				numberOfPipes: 1,
				timeElapsed: 0,
				draw() {
					for (let i = 0; i < this.pipes.length; i++) {
						let p = this.pipes[i];
						ctx.drawImage(this.top.sprite, p.x, p.y);
						ctx.drawImage(this.bot.sprite, p.x, p.y + parseFloat(this.top.sprite.height) + this.gap);
					}
				},
				update() {
					if (state.curr != state.Play) return;
					this.timeElapsed += deltaTime;
					if (this.timeElapsed >= 1600) {
						this.timeElapsed -= 1600;
						this.pipes.push({
							x: parseFloat(canvas.width),
							y: -210 * Math.min(Math.random() * 0.8 + 1.2, 1.8),
						});
					}
					this.pipes.forEach(pipe => {
						pipe.x -= dx * deltaTime;
					});
					if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
						this.pipes.shift();
						this.moved = true;
					}
				},
			};
			const bird = {
				animations: [{ sprite: new Image() }, { sprite: new Image() }, { sprite: new Image() }, { sprite: new Image() }],
				rotatation: 0,
				x: 50,
				y: 100,
				speed: 0,
				gravity: 0.0004,
				thrust: 0.18,
				frame: 0,
				timeElapsed: 0,
				totalTimeElapsed: 0,
				draw() {
					let h = this.animations[this.frame].sprite.height;
					let w = this.animations[this.frame].sprite.width;
					ctx.save();
					ctx.translate(this.x, this.y);
					ctx.rotate(this.rotatation * RAD);
					ctx.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);
					ctx.restore();
				},
				update() {
					this.totalTimeElapsed += deltaTime;
					let r = parseFloat(this.animations[0].sprite.width) / 2;
					switch (state.curr) {
						case state.getReady:
						case state.gameSuccess:
							this.rotatation = 0;
							this.timeElapsed += deltaTime;
							if (this.timeElapsed >= 200) {
								this.timeElapsed -= 200;
								this.y += Math.sin((this.totalTimeElapsed / 10) * RAD);
								this.frame++;
							}
							break;
						case state.Play:
							this.timeElapsed += deltaTime;
							if (this.timeElapsed >= 100) {
								this.timeElapsed -= 100;
								this.frame++;
							}
							this.y += this.speed * deltaTime;
							this.setRotation();
							this.speed += this.gravity * deltaTime;
							if (UI.score.curr >= maxScore) {
								state.curr = state.gameSuccess;
								this.timeElapsed = 0;
								updateText(`${title || "御风飞行"}表演成功！`);
								setTimeout(switchToAuto, 2000);
							} else if (this.y + r >= gnd.y || this.collisioned()) {
								state.curr = state.gameOver;
								this.timeElapsed = 0;
								updateText(`${title || "御风飞行"}表演失败……`);
								setTimeout(switchToAuto, 2000);
							}
							break;
						case state.gameOver:
							this.frame = 1;
							if (this.y + r < gnd.y) {
								this.y += this.speed * deltaTime;
								this.setRotation();
								this.speed += this.gravity * deltaTime;
							} else {
								this.speed = 0;
								this.y = gnd.y - r;
								this.rotatation = 90;
								if (!SFX.played) {
									Promise.resolve(SFX.die.play()).catch(() => void 0);
									SFX.played = true;
								}
							}
							break;
					}
					const animationsLength = this.animations.length;
					if (this.frame >= animationsLength) this.frame -= animationsLength;
				},
				flap() {
					if (this.y <= 0) return;
					const flap = SFX.flap;
					flap.currentTime = 0;
					if (flap.paused) Promise.resolve(flap.play()).catch(() => void 0);
					this.speed = -this.thrust;
				},
				setRotation() {
					if (this.speed <= 0) {
						this.rotatation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));
					} else if (this.speed > 0) {
						this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
					}
				},
				collisioned() {
					if (!pipe.pipes.length) return;
					let bird = this.animations[0].sprite;
					let x = pipe.pipes[0].x;
					let y = pipe.pipes[0].y;
					let r = bird.height / 4 + bird.width / 4;
					let roof = y + parseFloat(pipe.top.sprite.height);
					let floor = roof + pipe.gap;
					let w = parseFloat(pipe.top.sprite.width);
					if (this.x + r >= x) {
						if (this.x + r < x + w) {
							if (this.y - r <= roof || this.y + r >= floor) {
								Promise.resolve(SFX.hit.play()).catch(() => void 0);
								return true;
							}
						} else if (pipe.moved) {
							updateText(`当前分数：${++UI.score.curr}`);
							const score = SFX.score;
							score.currentTime = 0;
							if (score.paused) Promise.resolve(score.play()).catch(() => void 0);
							pipe.moved = false;
						}
					}
				},
			};
			const UI = {
				getReady: { sprite: new Image() },
				gameOver: { sprite: new Image() },
				gameClear: { sprite: new Image() },
				tap: [{ sprite: new Image() }, { sprite: new Image() }],
				score: {
					curr: 0,
					best: 0,
				},
				x: 0,
				y: 0,
				tx: 0,
				ty: 0,
				frame: 0,
				timeElapsed: 0,
				draw() {
					switch (state.curr) {
						case state.getReady:
							this.y = parseFloat(canvas.height - this.getReady.sprite.height) / 2;
							this.x = parseFloat(canvas.width - this.getReady.sprite.width) / 2;
							this.tx = parseFloat(canvas.width - this.tap[0].sprite.width) / 2;
							this.ty = this.y + this.getReady.sprite.height - this.tap[0].sprite.height;
							ctx.drawImage(this.getReady.sprite, this.x, this.y);
							ctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
							break;
						case state.gameOver:
						case state.gameSuccess:
							this.y = parseFloat(canvas.height - this.gameOver.sprite.height) / 2;
							this.x = parseFloat(canvas.width - this.gameOver.sprite.width) / 2;
							this.tx = parseFloat(canvas.width - this.tap[0].sprite.width) / 2;
							this.ty = this.y + this.gameOver.sprite.height - this.tap[0].sprite.height;
							ctx.drawImage((state.curr == state.gameOver ? this.gameOver : this.gameClear).sprite, this.x, this.y);
					}
				},
				update() {
					if (state.curr == state.Play) return;
					this.timeElapsed += deltaTime;
					if (this.timeElapsed >= 200) {
						this.timeElapsed -= 200;
						this.frame++;
					}
					const tapLength = this.tap.length;
					if (this.frame >= tapLength) this.frame -= tapLength;
				},
			};
			gnd.sprite.src = lib.assetURL + "image/flappybird/ground.png";
			bg.sprite.src = lib.assetURL + "image/flappybird/BG.png";
			pipe.top.sprite.src = lib.assetURL + "image/flappybird/toppipe.png";
			pipe.bot.sprite.src = lib.assetURL + "image/flappybird/botpipe.png";
			UI.gameOver.sprite.src = lib.assetURL + "image/flappybird/gameover.png";
			UI.gameClear.sprite.src = lib.assetURL + "image/flappybird/gameclear.png";
			UI.getReady.sprite.src = lib.assetURL + "image/flappybird/getready.png";
			UI.tap[0].sprite.src = lib.assetURL + "image/flappybird/tap/t0.png";
			UI.tap[1].sprite.src = lib.assetURL + "image/flappybird/tap/t1.png";
			bird.animations[0].sprite.src = lib.assetURL + "image/flappybird/bird/b0.png";
			bird.animations[1].sprite.src = lib.assetURL + "image/flappybird/bird/b1.png";
			bird.animations[2].sprite.src = lib.assetURL + "image/flappybird/bird/b2.png";
			bird.animations[3].sprite.src = lib.assetURL + "image/flappybird/bird/b0.png";

			SFX.start.src = lib.assetURL + "audio/effect/flappybird_start.wav";
			SFX.flap.src = lib.assetURL + "audio/effect/flappybird_flap.wav";
			SFX.score.src = lib.assetURL + "audio/effect/flappybird_score.wav";
			SFX.hit.src = lib.assetURL + "audio/effect/flappybird_hit.wav";
			SFX.die.src = lib.assetURL + "audio/effect/flappybird_die.wav";

			const gameLoop = domHighResTimeStamp => {
				if (frames < 0) return;
				deltaTime = domHighResTimeStamp - previousDOMHighResTimeStamp;
				previousDOMHighResTimeStamp = domHighResTimeStamp;
				update();
				draw();
				frames++;
				window.requestAnimationFrame(gameLoop);
			};

			const update = function () {
				bird.update();
				gnd.update();
				pipe.update();
				UI.update();
			};

			const draw = function () {
				ctx.fillStyle = "#30c0df";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				bg.draw();
				pipe.draw();

				bird.draw();
				gnd.draw();
				UI.draw();
			};

			const click = function () {
				switch (state.curr) {
					case state.getReady:
						state.curr = state.Play;
						bird.timeElapsed = 0;
						Promise.resolve(SFX.start.play()).catch(() => void 0);
						updateText(`当前分数：${UI.score.curr}`);
						break;
					case state.Play:
						bird.flap();
				}
			};
			const switchToAuto = function () {
				event._result = {
					bool: true,
					score: UI.score.curr,
					win: UI.score.curr >= maxScore,
				};
				dialog.close();
				game.resume();
				_status.imchoosing = false;
				frames = -1;
				document.removeEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", click);
			};

			dialog.open();
			game.pause();
			game.countChoose();

			document.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", click);
			window.requestAnimationFrame(gameLoop);
		},
	},
	yufeng_old: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			if (_status.connectMode) event.time = lib.configOL.choose_timeout;
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				game.pause();
				game.countChoose();
				setTimeout(function () {
					_status.imchoosing = false;
					var max = Math.max(2, 1 + game.me.countMark("yufeng"));
					var score = Math.random() < 0.5 ? max : get.rand(1, max);
					event._result = {
						bool: true,
						score: score,
						win: score >= max,
					};
					if (event.dialog) event.dialog.close();
					if (event.control) event.control.close();
					game.resume();
				}, 5000);
			};
			var createDialog = function (player, id) {
				if (_status.connectMode) lib.configOL.choose_timeout = "30";
				if (player == game.me) return;
				var str = get.translation(player) + "正在表演《御风飞行》...<br>";
				ui.create.dialog(str).videoId = id;
			};
			var chooseButton = function () {
				var roundmenu = false;
				if (ui.roundmenu && ui.roundmenu.display != "none") {
					roundmenu = true;
					ui.roundmenu.style.display = "none";
				}
				var event = _status.event;
				event.settleed = false;
				event.score = 0;
				event.dialog = ui.create.dialog("forcebutton", "hidden");
				event.dialog.textPrompt = event.dialog.add('<div class="text center">准备好了吗？准备好了的话就点击屏幕开始吧！</div>');
				var max = Math.max(2, 1 + game.me.countMark("yufeng"));
				event.dialog.textPrompt.style["z-index"] = 10;
				event.switchToAuto = function () {
					event._result = {
						bool: true,
						score: event.score,
						win: event.score >= max,
					};
					event.dialog.close();
					game.resume();
					_status.imchoosing = false;
					if (roundmenu) ui.roundmenu.style.display = "";
				};
				event.dialog.classList.add("fixed");
				event.dialog.classList.add("scroll1");
				event.dialog.classList.add("scroll2");
				event.dialog.classList.add("fullwidth");
				event.dialog.classList.add("fullheight");
				event.dialog.classList.add("noupdate");
				event.dialog.style.overflow = "hidden";
				event.dialog.open();

				var height = event.dialog.offsetHeight;
				var width = event.dialog.offsetWidth;
				var top = 50;
				var speed = 0;
				var start = false;

				var bird = ui.create.div("");
				bird.style["background-image"] = "linear-gradient(rgba(240, 235, 3, 1), rgba(230, 225, 5, 1))";
				bird.style["border-radius"] = "3px";
				var pipes = [];
				bird.style.position = "absolute";
				bird.style.height = "40px";
				bird.style.width = "40px";
				bird.style.left = Math.ceil(width / 3) + "px";
				bird.style.top = (top / 100) * height + "px";
				bird.updatePosition = function () {
					bird.style.transform = "translateY(" + ((top / 100) * height - bird.offsetTop) + "px)";
				};
				event.dialog.appendChild(bird);
				var isDead = function () {
					if (top > 100 || top < 0) return true;
					var btop = top;
					var bleft = 100 / 3;
					var bdown = btop + 5;
					var bright = bleft + 5;
					for (var i of pipes) {
						var left2 = i.left;
						var right2 = left2 + 10;
						var bottom2 = i.height1;
						var top2 = i.height2;

						if (left2 > bright || right2 < bleft) continue;
						if (btop < bottom2) return true;
						if (bdown > top2) return true;
						return false;
					}
					return false;
				};

				var fly = function () {
					if (!start) {
						start = true;
						event.dialog.textPrompt.innerHTML = '<div class="text center">当前分数：' + event.score + "</div>";
						speed = -4;
						event.fly = setInterval(function () {
							top += speed;
							if (top < 0) top = 0;
							bird.updatePosition();
							for (var i of pipes) {
								i.left -= 0.5;
								i.updateLeft();
							}
							speed += 0.5;
							if (speed > 2.5) speed = 2.5;

							if (isDead() == true) {
								event.settle();
							}
						}, 35);
						var addPipe = function () {
							var num = get.rand(5, 55);

							var pipe1 = ui.create.div("");
							pipe1.style["background-image"] = "linear-gradient(rgba(57, 133, 4, 1), rgba(60, 135, 6, 1))";
							pipe1.style["border-radius"] = "3px";
							pipe1.style.position = "absolute";
							pipe1.height1 = num;
							pipe1.height2 = num + 50;
							pipe1.left = 110;
							pipe1.num = 1;
							pipe1.style.height = Math.ceil((height * num) / 100) + "px";
							pipe1.style.width = width / 10 + "px";
							pipe1.style.left = (pipe1.left * width) / 100 + "px";
							pipe1.style.top = "0px";

							var pipe2 = ui.create.div("");
							pipe2.style["background-image"] = "linear-gradient(rgba(57, 133, 4, 1), rgba(60, 135, 6, 1))";
							pipe2.style["border-radius"] = "3px";
							pipe1.pipe2 = pipe2;
							pipe2.style.position = "absolute";
							pipe2.style.height = Math.ceil(((100 - pipe1.height2) * height) / 100) + "px";
							pipe2.style.width = width / 10 + "px";
							pipe2.style.left = (pipe1.left * width) / 100 + "px";
							pipe2.style.top = Math.ceil((pipe1.height2 * height) / 100) + "px";
							pipes.add(pipe1);
							event.dialog.appendChild(pipe1);
							event.dialog.appendChild(pipe2);
							pipe1.updateLeft = function () {
								this.style.transform = "translateX(" + ((this.left / 100) * width - this.offsetLeft) + "px)";
								this.pipe2.style.transform = "translateX(" + ((this.left / 100) * width - this.pipe2.offsetLeft) + "px)";
								if (this.left < 25 && !this.score) {
									this.score = true;
									event.score++;
									event.dialog.textPrompt.innerHTML = '<div class="text center">当前分数：' + event.score + "</div>";
									if (event.score >= max) {
										event.settle();
									}
								}
								if (this.left < -15) {
									this.remove();
									this.pipe2.remove();
									pipes.remove(this);
								}
							};
						};
						event.addPipe = setInterval(addPipe, 2500);
					} else if (speed > 0) {
						speed = -4;
					}
				};
				document.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", fly);

				event.settle = function () {
					clearInterval(event.fly);
					clearInterval(event.addPipe);
					document.removeEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", fly);
					setTimeout(function () {
						event.switchToAuto();
					}, 1000);
				};

				game.pause();
				game.countChoose();
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId);
			if (event.isMine()) {
				chooseButton();
			} else if (event.isOnline()) {
				event.player.send(chooseButton);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			game.broadcastAll(
				function (id, time) {
					if (_status.connectMode) lib.configOL.choose_timeout = time;
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
				},
				event.videoId,
				event.time
			);
			var result = event.result || result;
			player.popup(get.cnNumber(result.score) + "分", result.win ? "wood" : "fire");
			game.log(player, "御风飞行", result.win ? "#g成功" : "#y失败");
			game.log(player, "获得了", "#g" + result.score + "分");
			var max = player.countMark("yufeng");
			if (!result.win) {
				if (result.score) player.draw(result.score);
				if (max) player.removeMark("yufeng", max, false);
				event.finish();
			} else {
				if (max < 2) player.addMark("yufeng", 1, false);
				event.score = result.score;
				player
					.chooseTarget("请选择【御风】的目标", [1, result.score], function (card, player, target) {
						return target != player && !target.hasSkill("yufeng2");
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						var att = -get.attitude(player, target),
							attx = att * 2;
						if (att <= 0 || target.hasSkill("xinfu_pdgyingshi")) return 0;
						if (target.hasJudge("lebu")) attx -= att;
						if (target.hasJudge("bingliang")) attx -= att;
						return attx / Math.max(2.25, Math.sqrt(target.countCards("h") + 1));
					});
			}
			"step 2";
			if (result.bool) {
				result.targets.sortBySeat();
				player.line(result.targets, "green");
				game.log(result.targets, "获得了", "#y“御风”", "效果");
				for (var i of result.targets) i.addSkill("yufeng2");
				if (event.score > result.targets.length) player.draw(event.score - result.targets.length);
			} else player.draw(event.score);
		},
		ai: {
			order: 10,
			result: { player: 1 },
			threaten: 3.2,
		},
	},
	yufeng2: {
		trigger: { player: "phaseZhunbeiBegin" },
		audio: false,
		forced: true,
		charlotte: true,
		sourceSkill: "yufeng",
		content() {
			"step 0";
			player.removeSkill("yufeng2");
			player.judge();
			"step 1";
			switch (result.color) {
				case "red":
					player.skip("phaseDraw");
					break;

				case "black":
					player.skip("phaseUse");
					player.skip("phaseDiscard");
					break;

				default:
					break;
			}
		},
		mark: true,
		intro: {
			content: "准备阶段时进行判定，结果为红则跳过摸牌阶段，为黑则跳过出牌阶段和弃牌阶段",
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	tianshu: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return (
				player.countCards("he") &&
				!game.hasPlayer(function (current) {
					return current.countCards("ej", "taipingyaoshu");
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt2("tianshu"),
				filterCard: true,
				position: "he",
				ai1(card) {
					return 5 - get.value(card);
				},
				ai2(target) {
					var player = _status.event.player;
					if (get.attitude(player, target) > 0 && !target.hasEmptySlot(2)) return 0;
					return get.attitude(player, target);
				},
			});
			"step 1";
			if (!result.bool) {
				event.finish();
				return;
			}
			var target = result.targets[0];
			event.target = target;
			player.logSkill("tianshu", target);
			player.discard(result.cards);
			if (!lib.inpile.includes("taipingyaoshu")) {
				lib.inpile.push("taipingyaoshu");
				event.card = game.createCard2("taipingyaoshu", "heart", 3);
			} else {
				event.card = get.cardPile(function (card) {
					return card.name == "taipingyaoshu";
				});
			}
			if (!event.card) event.finish();
			else target.gain(event.card, "gain2");
			"step 2";
			if (target.getCards("h").includes(card) && get.name(card, target) == "taipingyaoshu") target.chooseUseTarget(card, "nopopup", true);
		},
	},
	//界伏寿
	xinzhuikong: {
		audio: 2,
		trigger: { global: "phaseZhunbeiBegin" },
		check(event, player) {
			if (get.attitude(player, event.player) < -2) {
				var cards = player.getCards("h");
				if (cards.length > player.hp) return true;
				for (var i = 0; i < cards.length; i++) {
					var useful = get.useful(cards[i]);
					if (useful < 5) return true;
					if (cards[i].number > 7 && useful < 7) return true;
				}
			}
			return false;
		},
		logTarget: "player",
		filter(event, player) {
			return !player.hasSkill("xinzhuikong2") && player.hp <= event.player.hp && player.canCompare(event.player);
		},
		content() {
			"step 0";
			player.addTempSkill("xinzhuikong2", "roundStart");
			player.chooseToCompare(trigger.player).set("small", player.hp > 1 && get.effect(player, { name: "sha" }, trigger.player, player) > 0 && Math.random() < 0.9);
			"step 1";
			if (result.bool) {
				trigger.player.addTempSkill("zishou2");
				event.finish();
			} else if (result.target && get.position(result.target) == "d") player.gain(result.target, "gain2", "log");
			"step 2";
			var card = { name: "sha", isCard: true };
			if (trigger.player.canUse(card, player, false)) trigger.player.useCard(card, player, false);
		},
	},
	xinzhuikong2: { charlotte: true },
	xinqiuyuan: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		direct: true,
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				game.hasPlayer(function (current) {
					return current != player && !event.targets.includes(current) && lib.filter.targetEnabled(event.card, event.player, current);
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("xinqiuyuan"), function (card, player, target) {
					var evt = _status.event.getTrigger();
					return target != player && !evt.targets.includes(target) && lib.filter.targetEnabled(evt.card, evt.player, target);
				})
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, trigger.player, player) + 0.1;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("xinqiuyuan", target);
				event.target = target;
				target
					.chooseCard(
						function (card, player) {
							var name = get.name(card, player);
							return name != "sha" && get.type(name) == "basic";
						},
						"h",
						"交给" + get.translation(player) + "一张不为【杀】的基本牌，或成为此杀的额外目标"
					)
					.set("ai", function (card) {
						return get.attitude(target, _status.event.sourcex) >= 0 ? 1 : -1;
					})
					.set("sourcex", player);
				game.delay();
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				target.give(result.cards, player);
				game.delay();
			} else {
				trigger.getParent().targets.push(event.target);
				trigger.getParent().triggeredTargets2.push(event.target);
				game.log(event.target, "成为了", trigger.card, "的额外目标");
			}
		},
		ai: {
			expose: 0.2,
			effect: {
				target_use(card, player, target) {
					if (card.name != "sha") return;
					var players = game.filterPlayer();
					if (get.attitude(player, target) <= 0) {
						for (var i = 0; i < players.length; i++) {
							var target2 = players[i];
							if (player != target2 && target != target2 && player.canUse(card, target2, false) && get.effect(target2, { name: "shacopy", nature: card.nature, suit: card.suit }, player, target) > 0 && get.effect(target2, { name: "shacopy", nature: card.nature, suit: card.suit }, player, player) < 0) {
								if (target.hp == target.maxHp) return 0.3;
								return 0.6;
							}
						}
					} else {
						for (var i = 0; i < players.length; i++) {
							var target2 = players[i];
							if (player != target2 && target != target2 && player.canUse(card, target2, false) && get.effect(target2, { name: "shacopy", nature: card.nature, suit: card.suit }, player, player) > 0) {
								if (player.canUse(card, target2)) return;
								if (target.hp == target.maxHp) return [0, 1];
								return [0, 0];
							}
						}
					}
				},
			},
		},
	},
	//界潘璋马忠
	xinduodao: {
		audio: 2,
		trigger: { player: "damageEnd" },
		logTarget: "source",
		filter(event, player) {
			var source = event.source;
			if (!source) return false;
			var cards = source.getEquips(1);
			return cards.some(card => lib.filter.canBeGained(card, player, source));
		},
		prompt2(event, player) {
			var source = event.source;
			var cards = source.getEquips(1).filter(card => lib.filter.canBeGained(card, player, source));
			return "获得其装备区中的" + get.translation(cards);
		},
		check(event, player) {
			let es = event.source.getEquips(1).filter(card => {
				return lib.filter.canBeGained(card, player, event.source);
			});
			if (get.attitude(player, event.source) > 0)
				return (
					es.reduce((acc, card) => {
						return acc + get.value(card, event.source);
					}, 0) < 0 || event.source.hasSkillTag("noe")
				);
			return es.reduce((acc, card) => {
				return acc + get.value(card, player);
			}, 0);
		},
		content() {
			var source = trigger.source;
			var cards = source.getEquips(1).filter(card => lib.filter.canBeGained(card, player, source));
			player.gain(cards, source, "give", "bySelf");
		},
	},
	xinanjian: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		forced: true,
		logTarget: "target",
		filter(event, player) {
			return event.card.name == "sha" && !player.inRangeOf(event.target);
		},
		content() {
			"step 0";
			var card = get.translation(trigger.card);
			var target = get.translation(trigger.target);
			player
				.chooseControl()
				.set("prompt", "暗箭：请选择一项")
				.set("choiceList", ["令" + target + "不能响应" + card, "令" + card + "对" + target + "的伤害值基数+1"])
				.set("ai", function () {
					var target = _status.event.getTrigger().target;
					var player = _status.event.player;
					var num = target.mayHaveShan(
						player,
						"use",
						target.getCards("h", i => {
							return i.hasGaintag("sha_notshan");
						})
					)
						? 0
						: 1;
					if (get.attitude(player, target) > 0) num = 1 - num;
					return num;
				});
			"step 1";
			if (result.index == 0) {
				game.log(player, "令", trigger.card, "不能被", trigger.target, "响应");
				trigger.directHit.push(trigger.target);
			} else {
				game.log(player, "令", trigger.card, "对", trigger.target, "的伤害+1");
				var id = trigger.target.playerid;
				var map = trigger.customArgs;
				if (!map[id]) map[id] = {};
				if (!map[id].extraDamage) map[id].extraDamage = 0;
				map[id].extraDamage++;
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (!arg || !arg.card || !arg.target || arg.card.name != "sha" || arg.target.inRange(player) || get.attitude(player, arg.target) > 0) return false;
			},
		},
	},
	//界郭笨
	mobilejingce: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			var num = 0;
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name != "cardsDiscard") return;
				var evtx = evt.getParent();
				if (evtx.name != "orderingDiscard") return false;
				var evt2 = evtx.relatedEvent || evtx.getParent();
				if (evt2 && (evt2.name == "useCard" || evt2.name == "respond")) num += evt.cards.length;
			});
			return num >= player.hp;
		},
		content() {
			player.draw(2);
		},
		group: "mobilejingce_count",
		intro: {
			content(num, player) {
				if (num == 0) return "一张都没有？就这？";
				if (num < player.hp) return "才" + get.cnNumber(num) + "张？就这？";
				return "卧槽，牛逼啊，居然" + get.cnNumber(num) + "张了！";
			},
		},
	},
	mobilejingce_count: {
		trigger: {
			global: ["cardsDiscardEnd", "phaseBefore"],
			player: "phaseAfter",
		},
		silent: true,
		firstDo: true,
		sourceSkill: "mobilejingce",
		filter(evt, player) {
			if (evt.name == "phase") return true;
			if (player != _status.currentPhase) return false;
			var evtx = evt.getParent();
			if (evtx.name != "orderingDiscard") return false;
			var evt2 = evtx.relatedEvent || evtx.getParent();
			return evt2 && (evt2.name == "useCard" || evt2.name == "respond");
		},
		content() {
			if (trigger.name == "phase") player.unmarkSkill("mobilejingce");
			else {
				var num = 0;
				game.getGlobalHistory("cardMove", function (evt) {
					if (evt.name != "cardsDiscard") return;
					var evtx = evt.getParent();
					if (evtx.name != "orderingDiscard") return false;
					var evt2 = evtx.relatedEvent || evtx.getParent();
					if (evt2 && (evt2.name == "useCard" || evt2.name == "respond")) num += evt.cards.length;
				});
				player.storage.mobilejingce = num;
				player.markSkill("mobilejingce");
			}
		},
	},
	//公孙康
	juliao: {
		mod: {
			globalTo(from, to, distance) {
				return distance + game.countGroup() - 1;
			},
		},
	},
	taomie: {
		audio: 3,
		group: ["taomie1", "taomie2", "taomie3"],
		trigger: { source: "damageBegin1" },
		forced: true,
		locked: false,
		direct: true,
		filter(event, player) {
			return event.player.hasMark("taomie");
		},
		content() {
			"step 0";
			player.logSkill(Math.random() < 0.5 ? "taomie2" : "taomie3", trigger.player);
			var target = get.translation(trigger.player);
			player
				.chooseControl()
				.set("prompt", "讨灭：请选择一项")
				.set("choiceList", ["令即将对" + target + "造成的伤害+1", "获得" + target + "的一张牌，并可将其交给另一名其他角色", "依次执行以上所有选项，并移去" + target + "的“讨灭”标记"])
				.set("ai", function () {
					var evt = _status.event.getTrigger();
					var player = _status.event.player;
					var target = evt.player;
					var bool1 = !target.hasSkillTag("filterDamage", null, {
						player: player,
						card: evt.card,
					});
					var bool2 = get.effect(target, { name: "shunshou" }, player, player) > 0;
					if (bool1 && bool2 && target.hp <= evt.num + 1) return 2;
					if (bool1) return 0;
					return 1;
				});
			"step 1";
			if (result.index == 2) {
				trigger.taomie_player = trigger.player;
				trigger.player.addTempSkill("taomie4");
			}
			if (result.index != 1) {
				trigger.num++;
			}
			if (result.index != 0 && trigger.player.countGainableCards(player, "hej") > 0) {
				player.gainPlayerCard(trigger.player, "hej", true);
			} else event.finish();
			"step 2";
			var card = result.cards[0];
			if (
				card &&
				player.getCards("h").includes(card) &&
				game.hasPlayer(function (current) {
					return current != player && current != trigger.player;
				})
			) {
				event.card = card;
				player
					.chooseTarget("是否将" + get.translation(card) + "交给一名其他角色？", function (card, player, target) {
						return target != player && target != _status.event.getTrigger().player;
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						var card = _status.event.getParent().card;
						if (target.hasSkillTag("nogain") || !player.needsToDiscard() || (get.tag(card, "damage") && player.hasValueTarget(card, null, false) && get.effect(_status.event.getTrigger().player, card, null, false) > 0)) return 0;
						return get.attitude(player, target) / (1 + target.countCards("h"));
					});
			} else event.finish();
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				player.give(card, target);
			}
		},
		mod: {
			inRangeOf(from, to) {
				if (from.hasMark("taomie")) return true;
			},
			inRange(from, to) {
				if (to.hasMark("taomie")) return true;
			},
		},
		intro: {
			content: "mark",
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (target && get.tag(card, "damage") && target.hasMark("taomie")) {
						if (player.hasSkillTag("jueqing", false, target)) return;
						if (get.attitude(player, target) > 0) {
							return 0.7;
						}
						return 1.2;
					}
				},
			},
		},
	},
	taomie1: {
		audio: true,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		sourceSkill: "taomie",
		logTarget(trigger, player) {
			if (player == trigger.player) return trigger.source;
			return trigger.player;
		},
		filter(event, player) {
			var target = lib.skill.taomie1.logTarget(event, player);
			return target && target.isIn() && !target.hasMark("taomie");
		},
		check(event, player) {
			var target = lib.skill.taomie1.logTarget(event, player);
			if (get.attitude(player, target) > 0) return false;
			var target0 = game.findPlayer(function (current) {
				return current.hasMark("taomie");
			});
			if (!target0) return true;
			var eff1 = 0,
				eff2 = 0;
			player.countCards("h", function (card) {
				if (!get.tag(card, "damage")) return false;
				if (player.hasValueTarget(card, null, true) > 0) {
					if (player.canUse(card, target, null, true)) {
						var eff = get.effect(target, card, player, player);
						if (eff > 0) eff1 += eff;
					}
					if (player.canUse(card, target0, null, true)) {
						var eff = get.effect(target0, card, player, player);
						if (eff > 0) eff2 += eff;
					}
				}
			});
			return eff1 > eff2;
		},
		prompt2(event, player) {
			var target = lib.skill.taomie1.logTarget(event, player);
			var str = "令" + get.translation(target) + "获得“讨灭”标记";
			if (
				game.hasPlayer(function (current) {
					return current.hasMark("taomie");
				})
			)
				str += "，并移去场上已有的“讨灭”标记";
			return str;
		},
		content() {
			game.countPlayer(function (current) {
				var num = current.countMark("taomie");
				if (num) current.removeMark("taomie");
			});
			lib.skill.taomie1.logTarget(trigger, player).addMark("taomie", 1);
		},
	},
	taomie2: { audio: true },
	taomie3: { audio: true },
	taomie4: {
		trigger: {
			global: ["damageAfter", "damageCancelled", "damageZero"],
			player: "dieBegin",
		},
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "taomie",
		filter(event, player) {
			return player.hasMark("taomie") && (event.name == "die" || event.taomie_player == player);
		},
		content() {
			player.removeMark("taomie", player.countMark("taomie"));
			player.removeSkill("taomie2");
		},
	},
	//铁骑飞
	liyong: {
		audio: "retishen",
		trigger: { player: "shaMiss" },
		forced: true,
		filter(event, player) {
			return player.isPhaseUsing();
		},
		content() {
			trigger.getParent().liyong = true;
			player.addTempSkill("liyong2", "phaseUseEnd");
		},
	},
	liyong2: {
		audio: "retishen",
		mark: true,
		intro: {
			content: "铁骑！强命！加伤！然后掉血嘞…",
		},
		trigger: { player: "useCardToPlayered" },
		forced: true,
		sourceSkill: "liyong",
		filter(event, player) {
			if (!event.card || event.card.name != "sha") return false;
			var evt = event.getParent();
			if (evt.liyong) return false;
			var history = player.getHistory("useCard", function (evt) {
				return evt.card.name == "sha";
			});
			var evt2 = history[history.indexOf(evt) - 1];
			return evt2 && evt2.liyong;
		},
		logTarget: "target",
		content() {
			var target = trigger.target;
			target.addTempSkill("fengyin");
			trigger.directHit.add(target);
			var id = target.playerid;
			var map = trigger.customArgs;
			if (!map[id]) map[id] = {};
			if (!map[id].extraDamage) map[id].extraDamage = 0;
			map[id].extraDamage++;
			trigger.getParent().liyong2 = true;
		},
		group: ["liyong3", "liyong4"],
	},
	liyong3: {
		trigger: { source: "damageSource" },
		forced: true,
		popup: false,
		sourceSkill: "liyong",
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.player.isIn() && event.getParent(2).liyong2 == true;
		},
		content() {
			player.loseHp();
		},
	},
	liyong4: {
		trigger: { player: "useCardAfter" },
		forced: true,
		silent: true,
		sourceSkill: "liyong",
		filter(evt, player) {
			if (!evt.card || evt.card.name != "sha") return false;
			if (evt.liyong) return false;
			var history = player.getHistory("useCard", function (evt) {
				return evt.card.name == "sha";
			});
			var evt2 = history[history.indexOf(evt) - 1];
			return evt2 && evt2.liyong;
		},
		content() {
			player.removeSkill("liyong2");
		},
	},
	//韩遂
	xinniluan: {
		audio: "niluan",
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return (
				player != event.player &&
				event.player.isIn() &&
				event.player.getHistory("useCard", function (evt) {
					if (evt.targets && evt.targets.length) {
						var targets = evt.targets.slice(0);
						while (targets.includes(event.player)) targets.remove(event.player);
						return targets.length > 0;
					}
					return false;
				}).length > 0 &&
				(_status.connectMode || player.hasSha())
			);
		},
		content() {
			"step 0";
			player.chooseToUse({
				logSkill: "xinniluan",
				preTarget: trigger.player,
				prompt: "是否发动【逆乱】，对" + get.translation(trigger.player) + "使用一张【杀】？",
				filterCard(card, player) {
					return get.name(card) == "sha" && lib.filter.filterCard.apply(this, arguments);
				},
				filterTarget(card, player, target) {
					return target == _status.event.preTarget && lib.filter.targetEnabled.apply(this, arguments);
				},
				addCount: false,
			});
			"step 1";
			if (
				result.bool &&
				player.getHistory("sourceDamage", function (evt) {
					return evt.getParent(4) == event;
				}).length &&
				trigger.player.countDiscardableCards(player, "he") > 0
			)
				player.discardPlayerCard(trigger.player, true, "he").boolline = true;
		},
	},
	xiaoxi_hansui: {
		audio: 2,
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			return get.color(card) == "black";
		},
		position: "hse",
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (!player.countCards("hse", { color: "black" })) return false;
		},
		prompt: "将一张黑色牌当杀使用或打出",
		check(card) {
			return 4.5 - get.value(card);
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "black" })) return false;
			},
			respondSha: true,
		},
	},
	//胡车儿
	daoji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("he", function (card) {
					return get.type(card) != "basic";
				}) &&
				game.hasPlayer(function (target) {
					return target != player && target.countCards("e") > 0;
				})
			);
		},
		filterCard(card) {
			return get.type(card) != "basic";
		},
		position: "he",
		filterTarget(card, player, target) {
			return target != player && target.countCards("e") > 0;
		},
		check(card) {
			var player = _status.event.player;
			if (
				game.hasPlayer(function (current) {
					return current != player && get.attitude(player, current) < 0 && get.damageEffect(current, player, player) > 0 && current.getEquip(1);
				})
			)
				return 8 - get.value(card);
			return 5 - get.value(card);
		},
		content() {
			"step 0";
			player.gainPlayerCard(target, "e", true).set("ai", function (button) {
				var card = button.link;
				var player = _status.event.player;
				if (get.subtype(card) == "equip1" && get.damageEffect(_status.event.target, player, player) > 0) return 6 + get.value(card);
				return get.value(card);
			});
			"step 1";
			if (!result || !result.bool || !result.cards || !result.cards.length) {
				event.finish();
				return;
			}
			var card = result.cards[0];
			event.card = card;
			if (player.getCards("h").includes(card) && get.type(card) == "equip") player.chooseUseTarget(card, true).nopopup = true;
			"step 2";
			if (get.subtype(card, false) == "equip1") target.damage();
		},
		ai: {
			order: 6,
			result: {
				target(player, current) {
					if (get.damageEffect(current, player, player) > 0 && current.getEquip(1)) return -1.5;
					return -1;
				},
			},
		},
	},
	//司马师夫妇
	//垃圾
	baiyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		limited: true,
		skillAnimation: false,
		//animationColor:'thunder',
		filter(event, player) {
			return player.isDamaged() && game.players.length > 2;
		},
		multitarget: true,
		multiline: true,
		changeSeat: true,
		seatRelated: true,
		contentBefore() {
			player.$fullscreenpop("败移", "thunder");
		},
		content() {
			player.awakenSkill("baiyi");
			game.broadcastAll(
				function (target1, target2) {
					game.swapSeat(target1, target2);
				},
				targets[0],
				targets[1]
			);
		},
		ai: {
			order() {
				return get.order({ name: "tao" }) + 1;
			},
			result: {
				target(player, target) {
					if (player.hasUnknown() && target != player.next && target != player.previous) return 0;
					var distance = Math.pow(get.distance(player, target, "absolute"), 2);
					if (!ui.selected.targets.length) return distance;
					var distance2 = Math.pow(get.distance(player, ui.selected.targets[0], "absolute"), 2);
					return Math.min(0, distance - distance2);
				},
			},
		},
	},
	jinglve: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (player.hasSkill("jinglve2")) return false;
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h") > 0;
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.markAuto("jinglve4", [target]);
			player.chooseButton(["选择一张牌作为「死士」", target.getCards("h")], true).set("ai", function (button) {
				var target = _status.event.getParent().target;
				var card = button.link;
				var val = target.getUseValue(card);
				if (val > 0) return val;
				return get.value(card);
			});
			"step 1";
			if (result.bool) {
				player.storage.jinglve2 = target;
				player.storage.jinglve3 = result.links[0];
				player.addSkill("jinglve2");
			}
		},
		ai: {
			order: 12,
			result: {
				target: -1,
			},
		},
	},
	jinglve2: {
		mark: true,
		intro: {
			name: "死士",
			mark(dialog, content, player) {
				dialog.addText("记录目标");
				dialog.add([content]);
				if (player == game.me || player.isUnderControl()) {
					dialog.addText("死士牌");
					dialog.add([player.storage.jinglve3]);
				}
			},
		},
		sourceSkill: "jinglve",
		onremove(player) {
			delete player.storage.jinglve2;
			delete player.storage.jinglve3;
		},
		trigger: { global: ["dieEnd", "loseEnd", "gainEnd"] },
		silent: true,
		lastDo: true,
		charlotte: true,
		filter(event, player) {
			if (event.name != "gain" && event.player != player.storage.jinglve2) return false;
			return event.name == "die" || (event.cards.includes(player.storage.jinglve3) && (event.name == "gain" || (event.position != ui.ordering && event.position != ui.discardPile)));
		},
		content() {
			player.removeSkill("jinglve2");
		},
		group: "jinglve3",
	},
	jinglve3: {
		audio: "jinglve",
		trigger: {
			global: ["loseAfter", "useCard", "phaseAfter", "cardsDiscardAfter", "loseAsyncAfter"],
		},
		sourceSkill: "jinglve",
		filter(event, player) {
			if (event.player && event.player != player.storage.jinglve2) return false;
			var card = player.storage.jinglve3;
			if (event.name == "phase") return event.player.getCards("hej").includes(card);
			if (event.name == "useCard") return event.cards.includes(card);
			return get.position(card, true) == "d" && event.getd().includes(card);
		},
		forced: true,
		charlotte: true,
		logTarget: "player",
		content() {
			if (trigger.name == "useCard") {
				trigger.all_excluded = true;
				trigger.targets.length = 0;
			} else {
				if (trigger.name == "phase") {
					player.gain(player.storage.jinglve3, trigger.player, "giveAuto", "bySelf");
				} else if (get.position(player.storage.jinglve3, true) == "d") player.gain(player.storage.jinglve3, "gain2");
			}
			player.removeSkill("jinglve2");
		},
	},
	shanli: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.storage.baiyi && player.getStorage("jinglve4").length > 1;
		},
		content() {
			"step 0";
			player.awakenSkill("shanli");
			player.loseMaxHp();
			player.chooseTarget(true, "选择【擅立】的目标").set("ai", function (target) {
				var att = get.attitude(_status.event.player, target);
				if (target == game.me || (target.isUnderControl() && target.isOnline())) return 2 * att;
				return att;
			});
			"step 1";
			var target = result.targets[0];
			event.target = target;
			player.line(target, "green");
			game.log(player, "拥立", target);
			var list = [];
			if (!_status.characterlist) {
				if (_status.connectMode) var list = get.charactersOL();
				else {
					var list = [];
					for (var i in lib.character) {
						if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
						list.push(i);
					}
				}
				game.countPlayer2(function (current) {
					list.remove(current.name);
					list.remove(current.name1);
					list.remove(current.name2);
					if (current.storage.rehuashen && current.storage.rehuashen.character) list.removeArray(current.storage.rehuashen.character);
				});
				_status.characterlist = list;
			}
			_status.characterlist.randomSort();
			var chara = [];
			var skills = [];
			for (var i of _status.characterlist) {
				if (i == "key_yuri") continue;
				var character = lib.character[i];
				if (character && character[3]) {
					for (var j of character[3]) {
						if (skills.includes(j) || j == "yuri_wangxi" || target.hasSkill(j)) continue;
						var info = get.info(j);
						if (info && info.zhuSkill) {
							skills.add(j);
							chara.add(i);
							continue;
						}
					}
				}
				if (skills.length >= 3) break;
			}
			if (!skills.length) {
				event.finish();
				return;
			}
			event.chara = chara;
			event.skills = skills;
			player.chooseControl(skills).set("dialog", ["选择令" + get.translation(target) + "获得一个技能", [chara, "character"]]);
			"step 2";
			target.addSkills(result.control);
			target.setAvatarQueue(target.name1 || target.name, [event.chara[event.skills.indexOf(result.control)]]);
		},
		ai: {
			combo: "baiyi",
		},
	},
	hongyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		//filter:function(event,player){
		//	return player.countCards('he')>=Math.min(2,game.dead.length);
		//},
		//selectCard:function(){
		//	return Math.min(2,game.dead.length);
		//},
		//filterCard:true,
		filterTarget: lib.filter.notMe,
		check(card) {
			var num = Math.min(2, game.dead.length);
			if (!num) return 1;
			if (num == 1) return 7 - get.value(card);
			return 5 - get.value(card);
		},
		position: "he",
		content() {
			player.addTempSkill("hongyi2", { player: "phaseBeginStart" });
			player.storage.hongyi2.add(target);
			player.markSkill("hongyi2");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.hasJudge("lebu")) return -0.5;
					return -1 - target.countCards("h");
				},
			},
		},
	},
	hongyi2: {
		audio: "hongyi",
		trigger: { global: "damageBegin1" },
		charlotte: true,
		forced: true,
		logTarget: "source",
		sourceSkill: "hongyi",
		filter(event, player) {
			return player.storage.hongyi2.includes(event.source);
		},
		content() {
			"step 0";
			trigger.source.judge();
			"step 1";
			if (result.color == "black") trigger.num--;
			else trigger.player.draw();
		},
		onremove: true,
		intro: {
			content: "已选中$为技能目标",
		},
		init(player, skill) {
			if (!player.storage[skill]) player.storage[skill] = [];
		},
	},
	requanfeng: {
		audio: "quanfeng",
		enable: "chooseToUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return event.type == "dying" && player == event.dying;
		},
		content() {
			player.awakenSkill("requanfeng");
			player.gainMaxHp(2);
			player.recover(4);
		},
		ai: {
			save: true,
			skillTagFilter(player, tag, arg) {
				return player == arg;
			},
			order: 10,
			result: {
				player: 1,
			},
		},
		group: "requanfeng_gain",
	},
	requanfeng_gain: {
		audio: "quanfeng",
		trigger: { global: "die" },
		sourceSkill: "requanfeng",
		filter(event, player) {
			return (
				player.hasSkill("hongyi") &&
				event.player.getStockSkills("仲村由理", "天下第一").filter(function (skill) {
					var info = get.info(skill);
					return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte;
				}).length > 0
			);
		},
		logTarget: "player",
		skillAnimation: true,
		animationColor: "thunder",
		prompt2: "（限定技）失去技能【劝封】，并获得该角色武将牌上的所有技能，然后加1点体力上限并回复1点体力",
		check: (event, player) => {
			if (
				event.player
					.getStockSkills("仲村由理", "天下第一")
					.filter(skill => {
						let info = get.info(skill);
						return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte;
					})
					.some(i => {
						let info = get.info(i);
						if (info && info.ai) return info.ai.neg || info.ai.halfneg;
					})
			)
				return false;
			return true;
		},
		content() {
			player.awakenSkill("requanfeng");
			player.removeSkills("hongyi");
			var skills = trigger.player.getStockSkills("仲村由理", "天下第一").filter(function (skill) {
				var info = get.info(skill);
				return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte;
			});
			if (skills.length) {
				player.addSkills(skills);
				game.broadcastAll(function (list) {
					game.expandSkills(list);
					for (var i of list) {
						var info = lib.skill[i];
						if (!info) continue;
						if (!info.audioname2) info.audioname2 = {};
						info.audioname2.yanghuiyu = "quanfeng";
					}
				}, skills);
			}
			player.gainMaxHp();
			player.recover();
		},
	},
	quanfeng: {
		audio: 2,
		trigger: { global: "die" },
		filter(event, player) {
			return (
				event.player.getStockSkills("仲村由理", "天下第一").filter(function (skill) {
					var info = get.info(skill);
					return info && !info.juexingji && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.dutySkill;
				}).length > 0
			);
		},
		logTarget: "player",
		skillAnimation: true,
		limited: true,
		forced: true,
		animationColor: "thunder",
		content() {
			"step 0";
			player.awakenSkill("quanfeng");
			var list = trigger.player.getStockSkills("仲村由理", "天下第一").filter(function (skill) {
				var info = get.info(skill);
				return info && !info.juexingji && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.dutySkill;
			});
			if (list.length == 1) event._result = { control: list[0] };
			else
				player
					.chooseControl(list)
					.set("prompt", "选择获得" + get.translation(trigger.player) + "的一个技能")
					.set("forceDie", true)
					.set("ai", function () {
						return list.randomGet();
					});
			"step 1";
			player.addSkills(result.control);
			game.broadcastAll(function (skill) {
				var list = [skill];
				game.expandSkills(list);
				for (var i of list) {
					var info = lib.skill[i];
					if (!info) continue;
					if (!info.audioname2) info.audioname2 = {};
					info.audioname2.yanghuiyu = "quanfeng";
				}
			}, result.control);
			player.gainMaxHp();
			player.recover();
		},
	},
	//手杀界朱然
	//设计师你改技能有瘾🐴
	mobiledanshou: {
		trigger: { global: "phaseJieshuBegin" },
		audio: 2,
		direct: true,
		filter(event, player) {
			if (player == event.player) return false;
			var num = event.player.getHistory("useCard", function (evt) {
				return evt.targets.includes(player);
			}).length;
			return num == 0 || (event.player.isIn() && num <= player.countCards("he"));
		},
		content() {
			"step 0";
			var num = trigger.player.getHistory("useCard", function (evt) {
				return evt.targets.includes(player);
			}).length;
			event.num = num;
			if (num == 0) {
				if (player.hasSkill("mobiledanshou")) event._result = { bool: true };
				else player.chooseBool("是否发动【胆守】摸一张牌？", lib.translate.mobiledanshou_info);
			} else event.goto(2);
			"step 1";
			if (result.bool) {
				player.logSkill("mobiledanshou");
				player.draw();
			}
			event.finish();
			"step 2";
			player
				.chooseToDiscard(num, get.prompt("mobiledanshou", trigger.player), "弃置" + get.translation(num) + "张牌并对其造成1点伤害", "he")
				.set("ai", function (card) {
					if (!_status.event.goon) return 0;
					var num = _status.event.getParent().num;
					if (num == 1) return 8 - get.value(card);
					if (num == 2) return 6.5 - get.value(card);
					return 5 - get.value(card);
				})
				.set("goon", get.damageEffect(trigger.player, player, player) > 0).logSkill = ["mobiledanshou", trigger.player];
			"step 3";
			if (result.bool) {
				player.addExpose(0.2);
				trigger.player.damage();
			}
		},
	},
	//丁原
	//程序员和设计师至少有一个脑子有坑
	beizhu: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (target) {
				return lib.skill.beizhu.filterTarget(null, player, target);
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		logAudio: () => 2,
		content() {
			"step 0";
			player.addTempSkill("beizhu_draw");
			player.viewHandcards(target);
			"step 1";
			var cards = target.getCards("h", "sha");
			if (cards.length) {
				event.cards = cards;
				event.goto(5);
			} else player.discardPlayerCard("he", target, "visible", true);
			"step 2";
			player.chooseBool("是否令" + get.translation(target) + "获得一张【杀】？").set("choice", get.attitude(player, target) > 0);
			"step 3";
			if (result.bool) {
				var card = get.cardPile2(function (card) {
					return card.name == "sha";
				});
				if (card) target.gain(card, "gain2");
			} else event.finish();
			"step 4";
			game.updateRoundNumber();
			event.finish();
			"step 5";
			var hs = target.getCards("h");
			cards = cards.filter(function (card) {
				return (
					hs.includes(card) &&
					get.name(card, target) == "sha" &&
					target.canUse(
						{
							name: "sha",
							isCard: true,
							cards: [card],
						},
						player,
						false
					)
				);
			});
			if (cards.length) {
				var card = cards.randomRemove(1)[0];
				target.useCard(player, false, card).card.beizhu = true;
				event.redo();
			}
		},
		ai: {
			order: 7,
			threaten: 1.14 + 5.14,
			result: {
				player(player, target) {
					var eff = get.effect(target, { name: "guohe_copy2" }, player, player);
					var cards = target.getCards("h", { name: "sha" });
					if (!cards.length) return eff;
					return eff / (cards.length + 3);
				},
			},
		},
	},
	beizhu_draw: {
		charlotte: true,
		audio: "beizhu3.mp3",
		trigger: { player: "damageEnd" },
		sourceSkill: "beizhu",
		filter(event, player) {
			return event.card?.beizhu;
		},
		forced: true,
		content() {
			player.draw(trigger.num);
		},
	},
	//新简雍
	xinqiaoshui: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) player.addTempSkill("xinqiaoshui_target", "phaseUseEnd");
			else {
				player.addTempSkill("qiaoshui2", "phaseUseEnd");
			}
		},
		subSkill: {
			target: {
				audio: "xinqiaoshui",
				inherit: "qiaoshui3",
				sourceSkill: "xinqiaoshui",
			},
		},
		ai: {
			order(item, player) {
				if (
					player.countCards("h", function (card) {
						return player.hasValueTarget(card);
					})
				)
					return 10;
				return 1;
			},
			result: {
				target(player, target) {
					if (
						player.countCards("h", function (card) {
							return player.hasValueTarget(card);
						})
					) {
						if (player.hasSkill("xinqiaoshui_target")) return 0;
						var nd = !player.needsToDiscard();
						if (
							player.hasCard(function (card) {
								if (get.position(card) != "h") return false;
								var val = get.value(card);
								if (nd && val < 0) return true;
								if (val <= 5) {
									return card.number >= 12;
								}
								if (val <= 6) {
									return card.number >= 13;
								}
								return false;
							})
						)
							return -1;
						return 0;
					}
					return -1;
				},
			},
		},
	},
	xinjyzongshi: {
		audio: 2,
		trigger: {
			player: ["chooseToCompareAfter", "compareMultipleAfter"],
			target: ["chooseToCompareAfter", "compareMultipleAfter"],
		},
		filter(event, player) {
			if (event.preserve) return false;
			if (event.name == "compareMultiple") return true;
			return !event.compareMultiple;
		},
		frequent: true,
		content() {
			"step 0";
			var str = '<div class="text center">牌堆顶';
			var cards = get.cards();
			if (trigger.name == "chooseToCompare" && trigger.compareMeanwhile) {
				var result = trigger.result;
				var list = [[result.num1[0], result.player]];
				list.addArray(
					result.num2.map(function (card, i) {
						return [card, result.targets[i]];
					})
				);
				list.sort(function (a, b) {
					return a[0] - b[0];
				});
				if (list[0][0] < list[1][0] && get.position(list[0][1], true) == "o") {
					str += "/拼点牌";
					cards.push(list[0][1]);
				}
			} else {
				if (player == trigger.player) {
					if (trigger.num1 > trigger.num2 && get.position(trigger.card2, true) == "o") {
						str += "/拼点牌";
						cards.push(trigger.card2);
					} else if (trigger.num1 < trigger.num2 && get.position(trigger.card1, true) == "o") {
						str += "/拼点牌";
						cards.push(trigger.card1);
					}
				} else {
					if (trigger.num1 < trigger.num2 && get.position(trigger.card1, true) == "o") {
						str += "/拼点牌";
						cards.push(trigger.card1);
					} else if (trigger.num1 > trigger.num2 && get.position(trigger.card2, true) == "o") {
						str += "/拼点牌";
						cards.push(trigger.card2);
					}
				}
			}
			str += "</div>";
			event.cards = cards;
			player.chooseButton(["纵适：选择要获得的牌", str, cards]).set("ai", get.buttonValue);
			"step 1";
			if (result.bool) {
				var draw = result.links[0] == cards[0];
				player.gain(result.links, draw ? "draw" : "gain2").log = false;
				game.log(player, "获得了", draw ? "牌堆顶的一张牌" : result.links);
				if (!draw) {
					cards[0].fix();
					ui.cardPile.insertBefore(cards[0], ui.cardPile.firstChild);
					game.updateRoundNumber();
				}
			}
		},
	},
	//通渠张恭
	rezhenxing: {
		audio: "xinfu_zhenxing",
		trigger: {
			player: ["damageEnd", "phaseJieshuBegin"],
		},
		frequent: true,
		content() {
			"step 0";
			event.cards = get.cards(3);
			player
				.chooseButton(["【镇行】：请选择要获得的牌", event.cards])
				.set("filterButton", function (button) {
					var cards = _status.event.cards;
					for (var i = 0; i < cards.length; i++) {
						if (button.link != cards[i] && get.suit(cards[i]) == get.suit(button.link)) return false;
					}
					return true;
				})
				.set("ai", function (button) {
					return get.value(button.link);
				})
				.set("cards", event.cards);
			"step 1";
			for (var i = event.cards.length - 1; i >= 0; i--) {
				if (result.bool && result.links.includes(event.cards[i])) {
					player.gain(event.cards[i], "gain2");
				} else {
					event.cards[i].fix();
					ui.cardPile.insertBefore(event.cards[i], ui.cardPile.childNodes[0]);
				}
			}
			game.updateRoundNumber();
		},
	},
	//芙蓉，手杀界廖化，手杀界曹彰
	rejiangchi: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		direct: true,
		logAudio: index => (typeof index === "number" ? "rejiangchi" + index + ".mp3" : 2),
		content() {
			"step 0";
			var list = ["弃牌", "摸牌", "取消"];
			if (!player.countCards("he")) list.remove("弃牌");
			player
				.chooseControl(list, function () {
					var player = _status.event.player;
					if (list.includes("弃牌")) {
						if (player.countCards("h") > 3 && player.countCards("h", "sha") > 1) {
							return "弃牌";
						}
						if (player.countCards("h", "sha") > 2) {
							return "弃牌";
						}
					}
					if (!player.countCards("h", "sha")) {
						return "摸牌";
					}
					return "cancel2";
				})
				.set("prompt", get.prompt2("rejiangchi"));
			"step 1";
			player.logSkill("rejiangchi", null, null, null, [result.control == "弃牌" ? 2 : 1]);
			if (result.control == "弃牌") {
				player.chooseToDiscard(true, "he");
				player.addTempSkill("jiangchi2", "phaseUseEnd");
			} else if (result.control == "摸牌") {
				player.draw();
				player.addTempSkill("rejiangchi3", "phaseUseEnd");
			}
		},
	},
	rejiangchi3: {
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") return false;
			},
		},
	},
	refuli: {
		skillAnimation: true,
		animationColor: "soil",
		audio: 2,
		unique: true,
		limited: true,
		enable: "chooseToUse",
		mark: true,
		filter(event, player) {
			if (event.type != "dying") return false;
			if (player != event.dying) return false;
			return true;
		},
		content() {
			"step 0";
			player.awakenSkill("refuli");
			event.num = game.countGroup();
			if (event.num > player.hp) player.recover(event.num - player.hp);
			"step 1";
			if (player.isMaxHp(true)) player.turnOver();
		},
		ai: {
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target;
			},
			result: {
				player: 10,
			},
			threaten(player, target) {
				if (!target.storage.refuli) return 0.9;
			},
		},
	},
	redangxian: {
		trigger: { player: "phaseBegin" },
		forced: true,
		audio: "dangxian",
		audioname: ["xin_liaohua"],
		audioname2: {
			guansuo: "dangxian_guansuo",
		},
		content() {
			"step 0";
			var card = get.discardPile(function (card) {
				return card.name == "sha";
			});
			if (card) player.gain(card, "gain2");
			"step 1";
			game.updateRoundNumber();
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
	},
	xuewei: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("xuewei"), lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player;
				if (player == get.zhu(player) && player.hp <= 2) return 0;
				return get.attitude(player, target) - 4;
			}).animate = false;
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("xuewei");
				player.addTempSkill("xuewei2", { player: "phaseBegin" });
				player.storage.xuewei2 = target;
			}
		},
		ai: {
			threaten: 1.05,
		},
	},
	xuewei2: {
		audio: "xuewei",
		forced: true,
		onremove: true,
		trigger: { global: "damageBegin4" },
		charlotte: true,
		sourceSkill: "xuewei",
		filter(event, player) {
			return event.player == player.storage.xuewei2;
		},
		logTarget: "player",
		content() {
			player.removeSkill("xuewei2");
			trigger.cancel();
			player.damage(trigger.num, trigger.source || "nosource");
			if (trigger.source && trigger.source.isIn()) trigger.source.damage(trigger.num, trigger.nature, player);
		},
	},
	liechi: {
		trigger: { player: "dying" },
		forced: true,
		filter(event, player) {
			return event.getParent().name == "damage" && event.source && event.source.countCards("he");
		},
		audio: 2,
		content() {
			trigger.source.chooseToDiscard("he", true);
		},
	},
	rejiuchi: {
		group: ["jiuchi"],
		audioname: ["re_dongzhuo"],
		trigger: { source: "damage" },
		forced: true,
		popup: false,
		locked: false,
		audio: "jiuchi",
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.getParent(2).jiu == true && !player.isTempBanned("benghuai");
		},
		content() {
			player.logSkill("rejiuchi");
			player.tempBanSkill("benghuai");
		},
	},
	//苏飞，新贾逵
	tongqu: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "dying", "phaseDrawBegin2"],
			player: ["enterGame", "phaseZhunbeiBegin"],
		},
		direct: true,
		filter(event, player) {
			if (event.name == "phaseDraw") return event.player.hasMark("tongqu");
			if (event.name == "dying") return event.player.hasMark("tongqu");
			if (event.name == "phaseZhunbei")
				return game.hasPlayer(function (current) {
					return !current.hasMark("tongqu");
				});
			return !player.hasMark("tongqu") && (event.name != "phase" || game.phaseNumber == 0);
		},
		content() {
			"step 0";
			if (trigger.name == "phaseDraw") {
				player.logSkill("tongqu", trigger.player);
				trigger.player.draw("nodelay");
				trigger.player.addTempSkill("tongqu2", "phaseDrawAfter");
				event.finish();
			} else if (trigger.name == "dying") {
				player.logSkill("tongqu", trigger.player);
				trigger.player.removeMark("tongqu", 1);
				event.finish();
			} else if (trigger.name == "phaseZhunbei") {
				player
					.chooseTarget(get.prompt2("tongqu"), function (card, player, target) {
						return !target.hasMark("tongqu");
					})
					.set("ai", function (target) {
						if (_status.event.player.hp < 3) return 0;
						return get.attitude(_status.event.player, target);
					});
			} else {
				player.logSkill("tongqu");
				player.addMark("tongqu", 1);
				event.finish();
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.loseHp();
				player.logSkill("tongqu", target);
				target.addMark("tongqu", 1);
			}
		},
		marktext: "渠",
		intro: { content: "mark", name2: "渠" },
	},
	tongqu2: {
		trigger: { player: "phaseDrawEnd" },
		forced: true,
		silent: true,
		sourceSkill: "tongqu",
		filter(event, player) {
			var bool = game.hasPlayer(function (current) {
				return current != player && current.hasMark("tongqu");
			});
			return (
				player.countCards("he", function (card) {
					if (bool) return true;
					return lib.filter.cardDiscardable(card, player);
				}) > 0
			);
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				forced: true,
				position: "he",
				filterCard: true,
				filterTarget(card, player, target) {
					return player != target && target.hasMark("tongqu");
				},
				selectTarget() {
					if (ui.selected.cards.length && !lib.filter.cardDiscardable(ui.selected.cards[0], _status.event.player)) return [1, 1];
					return [0, 1];
				},
				prompt: "弃置一张牌，或将一张牌交给一名有“渠”的其他角色",
				ai1(card) {
					var player = _status.event.player;
					if (get.name(card) == "du") return 20;
					if (get.position(card) == "e" && get.value(card) <= 0) return 14;
					if (
						get.position(card) == "h" &&
						game.hasPlayer(function (current) {
							return current != player && current.hasMark("tongqu") && get.attitude(player, current) > 0 && current.getUseValue(card) > player.getUseValue(card) && current.getUseValue(card) > player.getUseValue(card);
						})
					)
						return 12;
					if (
						game.hasPlayer(function (current) {
							return current != player && current.hasMark("tongqu") && get.attitude(player, current) > 0;
						})
					) {
						if (card.name == "wuxie") return 11;
						if (card.name == "shan" && player.countCards("h", "shan") > 1) return 9;
					}
					return 6 / Math.max(1, get.value(card));
				},
				ai2(target) {
					var player = _status.event.player;
					var card = ui.selected.cards[0];
					var att = get.attitude(player, target);
					if (card.name == "du") return -6 * att;
					if (att > 0) {
						if (get.position(card) == "h" && target.getUseValue(card) > player.getUseValue(card)) return 4 * att;
						if (target.hasUseTarget(card)) return 2 * att;
						return 1.2 * att;
					}
					return 0;
				},
			});
			"step 1";
			if (result.bool) {
				if (result.targets.length) {
					event.target = result.targets[0];
					player.give(result.cards, event.target);
					event.card = result.cards[0];
				} else {
					player.discard(result.cards);
					event.finish();
				}
			}
			"step 2";
			if (target.getCards("h").includes(card) && get.type(card) == "equip") {
				target.chooseUseTarget(card, true);
			}
		},
	},
	xinwanlan: {
		audio: "wanlan",
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			return event.player.hp <= event.num && player.countCards("e") >= 1;
		},
		logTarget: "player",
		check(event, player) {
			if (get.attitude(player, event.player) < 4) return false;
			if (player.countCards("hs", card => player.canSaveCard(card, event.player)) >= 1 + event.num - event.player.hp) return false;
			if (event.player == player || event.player == get.zhu(player)) return true;
			return !player.hasUnknown();
		},
		content() {
			player.discard(player.getCards("e"));
			trigger.cancel();
		},
	},
	zhengjian: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		locked: true,
		direct: true,
		content() {
			"step 0";
			player.chooseTarget("请选择【诤荐】的目标", lib.translate.zhengjian_info).set("ai", function (target) {
				if (target.hasSkill("zhengjian_mark")) return 0;
				if (player == target) return 0.5;
				return get.attitude(_status.event.player, target) * (1 + target.countCards("h"));
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("zhengjian", target);
				target.addSkill("zhengjian_mark");
			}
		},
		group: "zhengjian_draw",
		ai: {
			notemp: true,
		},
	},
	zhengjian_draw: {
		audio: "zhengjian",
		trigger: { player: "phaseBegin" },
		forced: true,
		sourceSkill: "zhengjian",
		filter(event) {
			return game.hasPlayer(function (current) {
				return current.hasSkill("zhengjian_mark");
			});
		},
		logTarget(event) {
			return game.filterPlayer(function (current) {
				return current.hasSkill("zhengjian_mark");
			});
		},
		content() {
			"step 0";
			var list = game.filterPlayer(function (current) {
				return current.countMark("zhengjian_mark") > 0;
			});
			if (list.length > 1) {
				event.delay = true;
				game.asyncDraw(list, function (target) {
					return Math.min(5, target.maxHp, target.countMark("zhengjian_mark"));
				});
			} else if (list.length == 1) list[0].draw(Math.min(5, list[0].maxHp, list[0].countMark("zhengjian_mark")));
			"step 1";
			game.countPlayer(function (current) {
				current.removeSkill("zhengjian_mark");
			});
			if (event.delay) game.delayx();
		},
	},
	zhengjian_mark: {
		trigger: { player: ["useCard1", "respond"] },
		silent: true,
		firstDo: true,
		onremove: true,
		charlotte: true,
		sourceSkill: "zhengjian",
		content() {
			player.addMark("zhengjian_mark", 1, false);
		},
		init(player, skill) {
			if (!player.storage[skill]) player.storage[skill] = 0;
		},
		mark: true,
		intro: {
			content: "已使用/打出过#张牌",
		},
	},
	gaoyuan: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		direct: true,
		filter(event, player) {
			if (event.card.name != "sha") return false;
			if (player.countCards("he") == 0) return false;
			return game.hasPlayer(function (current) {
				return current != event.player && current != player && current.hasSkill("zhengjian_mark") && lib.filter.targetEnabled(event.card, event.player, current);
			});
		},
		content() {
			"step 0";
			var next = player.chooseCardTarget({
				position: "he",
				filterCard: lib.filter.cardDiscardable,
				filterTarget(card, player, target) {
					var trigger = _status.event;
					if (target != player && target != trigger.source) {
						if (target.hasSkill("zhengjian_mark") && lib.filter.targetEnabled(trigger.card, trigger.source, target)) return true;
					}
					return false;
				},
				ai1(card) {
					return get.unuseful(card) + 9;
				},
				ai2(target) {
					if (_status.event.player.countCards("h", "shan")) {
						return -get.attitude(_status.event.player, target);
					}
					if (get.attitude(_status.event.player, target) < 5) {
						return 6 - get.attitude(_status.event.player, target);
					}
					if (_status.event.player.hp == 1 && player.countCards("h", "shan") == 0) {
						return 10 - get.attitude(_status.event.player, target);
					}
					if (_status.event.player.hp == 2 && player.countCards("h", "shan") == 0) {
						return 8 - get.attitude(_status.event.player, target);
					}
					return -1;
				},
				prompt: get.prompt("gaoyuan"),
				prompt2: "弃置一张牌，将此【杀】转移给一名有“诤”的角色",
				source: trigger.player,
				card: trigger.card,
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill(event.name, target);
				player.discard(result.cards);
				var evt = trigger.getParent();
				evt.triggeredTargets2.remove(player);
				evt.targets.remove(player);
				evt.targets.push(target);
			}
		},
		ai: {
			combo: "zhengjian",
		},
	},
	//一 将 成 名
	zhilve: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		content() {
			"step 0";
			if (!player.canMoveCard()) event._result = { index: 1 };
			else
				player
					.chooseControl()
					.set("choiceList", ["移动场上的一张牌", "本回合的摸牌阶段多摸一张牌且第一张杀无距离次数限制"])
					.set("ai", function () {
						return 1;
					});
			"step 1";
			if (result.index == 1) {
				player.addTempSkill("zhilve_yingzi");
				if (
					!player.getHistory("useCard", function (card) {
						return card.card.name == "sha";
					}).length
				)
					player.addTempSkill("zhilve_xiandeng");
				event.finish();
			} else player.moveCard(true);
			"step 2";
			if (result.position == "e") player.loseHp();
			else player.addTempSkill("zhilve_dis");
		},
		subSkill: {
			dis: {
				mod: {
					maxHandcard(player, num) {
						return num - 1;
					},
				},
			},
			yingzi: {
				trigger: { player: "phaseDrawBegin2" },
				popup: false,
				forced: true,
				filter(event, player) {
					return !event.numFixed;
				},
				content() {
					trigger.num++;
				},
			},
			xiandeng: {
				mod: {
					targetInRange(card, player) {
						if (card.name == "sha") return true;
					},
				},
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return event.card.name == "sha";
				},
				content() {
					player.removeSkill(event.name);
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						var stat = player.getStat("card");
						if (stat && stat.sha) stat.sha--;
					}
				},
			},
		},
	},
	xhzhiyan: {
		enable: "phaseUse",
		audio: 2,
		filter(event, player) {
			return player.countCards("h") != player.maxHp;
		},
		filterCard: true,
		selectCard() {
			var player = _status.event.player;
			var num = Math.max(0, player.countCards("h") - player.maxHp);
			return [num, num];
		},
		check(card) {
			var player = _status.event.player;
			if (
				player.getUseValue(card) <= 0 &&
				game.hasPlayer(function (current) {
					return current != player && get.value(card, current) * get.attitude(player, current) > 0;
				})
			)
				return 1;
			return 0;
		},
		content() {
			"step 0";
			if (!cards.length) {
				player.draw(player.maxHp - player.countCards("h"));
				player.addTempSkill("zishou2");
				event.finish();
			} else {
				cards = cards.filterInD("d");
				if (cards.length)
					player.chooseButton(["是否将其中的一张牌交给一名其他角色？", cards]).set("", function (button) {
						var player = _status.event.player;
						if (
							game.hasPlayer(function (current) {
								return current != player && get.value(button.link, current) * get.attitude(player, current) > 0;
							})
						)
							return Math.abs(get.value(button.link));
						return 0;
					});
				else event.finish();
			}
			"step 1";
			if (result.bool && game.hasPlayer(current => current != player)) {
				event.card = result.links[0];
				player.chooseTarget(true, lib.filter.notMe, "选择一名其他角色获得" + get.translation(event.card)).set("ai", function (target) {
					return get.value(_status.event.getParent().card, target) * get.attitude(_status.event.player, target);
				});
			} else event.finish();
			"step 2";
			var target = result.targets[0];
			player.line(target, "green");
			target.gain(card, "gain2", "log");
		},
		ai: {
			order(obj, player) {
				if (player.countCards("h") > player.maxHp) return 10;
				return 0.5;
			},
			result: {
				player: 1,
			},
		},
	},
	//水 果 忍 者
	zhengjing_guanju: { audio: true },
	zhengjing: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.hasSkill("zhengjing3");
		},
		content() {
			"step 0";
			//game.trySkillAudio('zhengjing_guanju',player);
			if (_status.connectMode) event.time = lib.configOL.choose_timeout;
			var cards = [];
			var names = [];
			while (true) {
				var card = get.cardPile(function (carde) {
					return carde.name != "du" && !names.includes(carde.name);
				});
				if (card) {
					cards.push(card);
					names.push(card.name);
					if (get.mode() == "doudizhu") {
						if (cards.length == 1 && !get.isLuckyStar(player) && Math.random() < 0.33) break;
						if (cards.length == 2 && !get.isLuckyStar(player) && Math.random() < 0.5) break;
						if (cards.length >= 3) break;
					} else {
						if (cards.length == 3 && !get.isLuckyStar(player) && Math.random() < 0.33) break;
						if (cards.length == 4 && !get.isLuckyStar(player) && Math.random() < 0.5) break;
						if (cards.length >= 5) break;
					}
				} else break;
			}
			event.cards = cards;
			if (!cards.length) {
				event.finish();
				return;
			}
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				names.remove("du");
				game.pause();
				game.countChoose();
				setTimeout(function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						links: names.slice(0),
					};
					if (event.dialog) event.dialog.close();
					if (event.control) event.control.close();
					game.resume();
				}, 5000);
			};
			var createDialog = function (player, id) {
				if (_status.connectMode) lib.configOL.choose_timeout = "30";
				if (player == game.me) return;
				var str = get.translation(player) + "正在整理经书...<br>";
				ui.create.dialog(str).videoId = id;
			};
			var chooseButton = function (list) {
				var roundmenu = false;
				if (ui.roundmenu && ui.roundmenu.display != "none") {
					roundmenu = true;
					ui.roundmenu.style.display = "none";
				}
				var event = _status.event;
				event.settleed = false;
				event.finishedx = [];
				event.map = {};
				var names = list.slice(0);
				event.zhengjing_nodes = [];
				names.push("du");
				names.randomSort();
				var names2 = names.slice(0);
				for (var i = 0; i < 2; i++) {
					names2.randomSort();
					names = names.concat(names2);
				}

				event.zhengjing = names;
				for (var i of list) {
					event.map[i] = 0;
				}
				event.dialog = ui.create.dialog("forcebutton", "hidden");
				event.dialog.textPrompt = event.dialog.add('<div class="text center">及时点击卡牌，但不要点到毒了！</div>');
				var str = '<div class="text center">';
				for (var i of list) {
					str += get.translation(i) + ":" + Math.min(2, event.map[i]) + "/2 ";
				}
				str += "</div>";
				event.dialog.textPrompt2 = event.dialog.add(str);
				event.switchToAuto = function () {
					event._result = {
						bool: true,
						links: event.finishedx.slice(0),
					};
					event.dialog.close();
					game.resume();
					_status.imchoosing = false;
					if (roundmenu) ui.roundmenu.style.display = "";
				};
				event.dialog.classList.add("fixed");
				event.dialog.classList.add("scroll1");
				event.dialog.classList.add("scroll2");
				event.dialog.classList.add("fullwidth");
				event.dialog.classList.add("fullheight");
				event.dialog.classList.add("noupdate");
				event.dialog.open();
				event.settle = function (du) {
					if (event.settleed) return;
					event.settleed = true;
					event.dialog.textPrompt2.innerHTML = "";
					if (du) {
						if (lib.config.background_speak) game.playAudio("skill", "zhengjing_boom");
						event.dialog.textPrompt.innerHTML = '<div class="text center">叫你别点毒你非得点 这下翻车了吧</div>';
					} else {
						if (lib.config.background_speak) game.playAudio("skill", "zhengjing_finish");
						event.dialog.textPrompt.innerHTML = '<div class="text center">整理经典结束！共整理出' + get.cnNumber(event.finishedx.length) + "份经典</div>";
					}
					while (event.zhengjing_nodes.length) {
						event.zhengjing_nodes.shift().delete();
					}
					setTimeout(function () {
						event.switchToAuto();
					}, 1000);
				};

				var click = function () {
					var name = this.name;
					if (name == "du") {
						event.zhengjing.length = 0;
						event.settle(true);
					} else {
						if (lib.config.background_speak) game.playAudio("skill", "zhengjing_click");
						event.map[name]++;
						if (event.map[name] > 1) event.finishedx.add(name);
						if (event.finishedx.length < list.length) {
							var str = '<div class="text center">';
							for (var i of list) {
								str += get.translation(i) + ":" + Math.min(2, event.map[i]) + "/2 ";
							}
							str += "</div>";
							event.dialog.textPrompt2.innerHTML = str;
						} else {
							event.zhengjing.length = 0;
							event.settle();
						}
					}
					event.zhengjing_nodes.remove(this);
					this.style.transition = "all 0.5s";
					this.style.transform = "scale(1.2)";
					this.delete();
				};
				var addNode = function () {
					if (event.zhengjing.length) {
						var card = ui.create.card(ui.special, "noclick", true);
						card.init(["", "", event.zhengjing.shift()]);
						card.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", click);
						event.zhengjing_nodes.push(card);
						card.style.position = "absolute";
						var rand1 = Math.round(Math.random() * 100);
						var rand2 = Math.round(Math.random() * 100);
						var rand3 = Math.round(Math.random() * 40) - 20;
						card.style.left = "calc(" + rand1 + "% - " + rand1 + "px)";
						card.style.top = "calc(" + rand2 + "% - " + rand2 + "px)";
						card.style.transform = "scale(0.8) rotate(" + rand3 + "deg)";
						card.style.opacity = 0;
						event.dialog.appendChild(card);
						ui.refresh(card);
						card.style.opacity = 1;
						card.style.transform = "scale(1) rotate(" + rand3 + "deg)";
					}
					if (event.zhengjing_nodes.length > (event.zhengjing.length > 0 ? 2 : 0)) event.zhengjing_nodes.shift().delete();
					if (event.zhengjing.length || event.zhengjing_nodes.length)
						setTimeout(function () {
							addNode();
						}, 800);
					else event.settle();
				};

				game.pause();
				game.countChoose();
				addNode();
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId);
			if (event.isMine()) {
				chooseButton(names);
			} else if (event.isOnline()) {
				event.player.send(chooseButton, names);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			game.broadcastAll(
				function (id, time) {
					if (_status.connectMode) lib.configOL.choose_timeout = time;
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
				},
				event.videoId,
				event.time
			);
			var result = event.result || result;
			for (var i = 0; i < cards.length; i++) {
				//if(cards.length==1) break;
				if (!result.links.includes(cards[i].name)) cards.splice(i--, 1);
			}
			if (cards.length) {
				player.showCards(cards, get.translation(player) + "整理出了以下经典");
				game.cardsGotoOrdering(cards);
			} else {
				game.log(player, "并没有整理出经典");
				player.popup("杯具");
				event.finish();
			}
			"step 2";
			game.updateRoundNumber();
			player.chooseTarget(true, "将整理出的经典置于一名角色的武将牌上").set("ai", function (target) {
				if (target.hasSkill("xinfu_pdgyingshi")) return 0;
				let player = _status.event.player,
					cards = _status.event.getParent().cards,
					att = get.attitude(player, target),
					js = target.getCards("j", i => {
						let name = i.viewAs || i.name,
							info = lib.card[name];
						if (!info || !info.judge) return false;
						return true;
					}),
					eff = -1.5 * get.effect(target, { name: "draw" }, player, player);
				if (js.length)
					eff += js.reduce((acc, i) => {
						let name = i.viewAs || i.name;
						return acc - 0.7 * get.effect(target, get.autoViewAs({ name }, [i]), target, player);
					}, 0);
				return eff;
			});
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "thunder");
			}
			"step 4";
			if (cards.length == 1) {
				event._result = { bool: true, moved: [cards, []] };
				return;
			}
			var next = player.chooseToMove("整经：请分配整理出的经典", true);
			next.set("list", [["置于" + get.translation(target) + "的武将牌上", cards], ["自己获得"]]);
			next.set("filterMove", function (from, to, moved) {
				if (moved[0].length == 1 && to == 1 && from.link == moved[0][0]) return false;
				return true;
			});
			next.set("filterOk", function (moved) {
				return moved[0].length > 0;
			});
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0).sort(function (a, b) {
					return get.value(a) - get.value(b);
				});
				return [cards.splice(0, 1), cards];
			});
			"step 5";
			if (result.bool) {
				var cards = result.moved[0],
					gains = result.moved[1];
				target.addSkill("zhengjing2");
				target.addToExpansion(cards, "gain2").gaintag.add("zhengjing2");
				if (gains.length) player.gain(gains, "gain2");
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
			threaten: 3.2,
		},
	},
	//恁就是仲村由理？
	zhengjing2: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		charlotte: true,
		intro: { content: "expansion", markcount: "expansion" },
		sourceSkill: "zhengjing",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		content() {
			"step 0";
			player.gain(player.getExpansions("zhengjing2"), "gain2");
			player.skip("phaseJudge");
			player.skip("phaseDraw");
			"step 1";
			player.removeSkill("zhengjing2");
		},
	},
	zhengjing3: {},
	//邓芝
	jimeng: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countGainableCards(player, "he") > 0;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("jimeng"), function (card, player, target) {
					return target != player && target.countGainableCards(player, "he") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					if (player.hp > 1 && get.attitude(player, target) < 2) return 0;
					return get.effect(target, { name: "shunshou" }, player, player);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("jimeng", target);
				player.gainPlayerCard(target, "he", true);
			} else event.finish();
			"step 2";
			var hs = player.getCards("he");
			if (player.hp > 0 && hs.length) {
				if (hs.length <= player.hp) event._result = { bool: true, cards: hs };
				else player.chooseCard(player.hp, true, "交给" + get.translation(target) + get.cnNumber(player.hp) + "张牌", "he", true);
			} else event.finish();
			"step 3";
			player.give(result.cards, target);
		},
	},
	shuaiyan: {
		audio: 2,
		trigger: { player: "phaseDiscardBegin" },
		filter(event, player) {
			return player.countCards("h") > 1;
		},
		check(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("he") && lib.skill.shuaiyan.check2(current, player);
			});
		},
		check2(target, player) {
			if (get.itemtype(player) != "player") player = _status.event.player;
			return -get.attitude(player, target) / target.countCards("he");
		},
		content() {
			"step 0";
			player.showHandcards(get.translation(player) + "发动了【率言】");
			"step 1";
			var filter = function (card, player, target) {
				return player != target && target.countCards("he") > 0;
			};
			if (
				game.hasPlayer(function (current) {
					return filter("我约等于白板", player, current);
				})
			) {
				player.chooseTarget(true, filter, "选择一名其他角色，令其交给你一张牌").set("ai", lib.skill.shuaiyan.check2);
			} else event.finish();
			"step 2";
			var target = result.targets[0];
			event.target = target;
			player.line(target, "green");
			target.chooseCard("he", true, "交给" + get.translation(player) + "一张牌");
			"step 3";
			target.give(result.cards, player);
		},
	},
	relihuo: {
		audio: 2,
		group: ["relihuo_baigei", "relihuo_damage"],
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name == "sha" && !game.hasNature(event.card)) return true;
		},
		check(event, player) {
			return false;
		},
		content() {
			game.setNature(trigger.card, "fire");
			trigger.relihuo = true;
		},
	},
	relihuo_damage: {
		trigger: { source: "damageBegin1" },
		forced: true,
		audio: "relihuo",
		sourceSkill: "relihuo",
		filter(event, player) {
			return event.getParent(2).relihuo == true && event.player.isLinked();
		},
		content() {
			trigger.num++;
		},
	},
	relihuo_baigei: {
		trigger: { player: "useCardAfter" },
		forced: true,
		audio: "relihuo",
		sourceSkill: "relihuo",
		filter(event, player) {
			if (event.card.name != "sha" || !game.hasNature(event.card, "fire")) return false;
			var num = 0;
			player.getHistory("sourceDamage", function (evt) {
				if (evt.card == event.card) num += evt.num;
			});
			return num > 1;
		},
		content() {
			var num = 0;
			player.getHistory("sourceDamage", function (evt) {
				if (evt.card == trigger.card) num += evt.num;
			});
			player.loseHp(Math.floor(num / 2));
		},
	},
	gongsun: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 1;
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt2("gongsun"),
				selectCard: 2,
				filterCard: lib.filter.cardDiscardable,
				filterTarget: lib.filter.notMe,
				position: "he",
				ai1(card) {
					var friend = 0,
						enemy = 0,
						player = _status.event.player;
					var num = game.countPlayer(function (target) {
						var att = get.attitude(player, target);
						if (att < 0) enemy++;
						if (target != player && att > 0) friend++;
						return true;
					});
					if (num > friend + enemy + 2) return 0;
					if (friend < enemy) return 0;
					if (card.name == "sha") return 10 - enemy;
					return 10 - enemy - get.value(card);
				},
				ai2(target) {
					return -get.attitude(_status.event.player, target) * (1 + target.countCards("h"));
				},
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("gongsun", target);
				player.discard(result.cards);
				player.addTempSkill("gongsun_shadow", { player: ["phaseBegin", "die"] });
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (get.type(name) == "trick") list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic") list.push(["基本", "", name]);
				}
				player.chooseButton(["请选择一个牌名", [list, "vcard"], true]).set("ai", function (button) {
					return button.link[2] == "sha" ? 1 : 0;
				});
			} else event.finish();
			"step 2";
			player.storage.gongsun_shadow.push([target, result.links[0][2]]);
			player.popup(result.links[0][2], "soil");
			game.log(player, "选择了", "" + get.translation(result.links[0][2]));
			player.markSkill("gongsun_shadow");
		},
	},
	gongsun_shadow: {
		global: "gongsun_shadow2",
		sourceSkill: "gongsun_shadow",
		init(player, skill) {
			if (!player.storage[skill]) player.storage[skill] = [];
		},
		marktext: "损",
		onremove: true,
		intro: {
			content(shadow) {
				var str = "";
				for (var i = 0; i < shadow.length; i++) {
					if (i > 0) str += "<br>";
					str += get.translation(shadow[i][0]);
					str += "：";
					str += get.translation(shadow[i][1]);
				}
				return str;
			},
		},
		mod: {
			cardEnabled(card, player) {
				var list = player.storage.gongsun_shadow;
				for (var i = 0; i < list.length; i++) {
					if (list[i][1] == card.name) return false;
				}
			},
			cardRespondable(card, player) {
				var list = player.storage.gongsun_shadow;
				for (var i = 0; i < list.length; i++) {
					if (list[i][1] == card.name) return false;
				}
			},
			cardSavable(card, player) {
				var list = player.storage.gongsun_shadow;
				for (var i = 0; i < list.length; i++) {
					if (list[i][1] == card.name) return false;
				}
			},
			cardDiscardable(card, player) {
				var list = player.storage.gongsun_shadow;
				for (var i = 0; i < list.length; i++) {
					if (list[i][1] == card.name) return false;
				}
			},
		},
	},
	gongsun_shadow2: {
		mod: {
			cardEnabled(card, player) {
				if (
					game.hasPlayer(function (current) {
						var list = current.storage.gongsun_shadow;
						if (!list) return false;
						for (var i = 0; i < list.length; i++) {
							if (list[i][0] == player && list[i][1] == card.name) return true;
						}
						return false;
					})
				)
					return false;
			},
			cardSavable(card, player) {
				if (
					game.hasPlayer(function (current) {
						var list = current.storage.gongsun_shadow;
						if (!list) return false;
						for (var i = 0; i < list.length; i++) {
							if (list[i][0] == player && list[i][1] == card.name) return true;
						}
						return false;
					})
				)
					return false;
			},
			cardRespondable(card, player) {
				if (
					game.hasPlayer(function (current) {
						var list = current.storage.gongsun_shadow;
						if (!list) return false;
						for (var i = 0; i < list.length; i++) {
							if (list[i][0] == player && list[i][1] == card.name) return true;
						}
						return false;
					})
				)
					return false;
			},
			cardDiscardable(card, player) {
				if (
					game.hasPlayer(function (current) {
						var list = current.storage.gongsun_shadow;
						if (!list) return false;
						for (var i = 0; i < list.length; i++) {
							if (list[i][0] == player && list[i][1] == card.name) return true;
						}
						return false;
					})
				)
					return false;
			},
		},
	},
	duoduan: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		direct: true,
		filter(event, player) {
			return event.card.name == "sha" && player.countCards("he") > 0 && !player.hasSkill("duoduan_im");
		},
		content() {
			"step 0";
			player
				.chooseCard("he", get.prompt2("duoduan"), lib.filter.cardRecastable)
				.set("ai", function (card) {
					if (_status.event.goon) return 8 - get.value(card);
					return 0;
				})
				.set(
					"goon",
					(function () {
						if (get.attitude(trigger.player, player) > 0) return true;
						if (!trigger.player.countCards("he")) return true;
						if (!player.hasShan()) return true;
						return event.getRand() < 0.5;
					})()
				);
			"step 1";
			if (result.bool) {
				player.addTempSkill("duoduan_im");
				player.logSkill("duoduan", trigger.player);
				player.recast(result.cards);
			} else event.finish();
			"step 2";
			var sha = get.translation(trigger.card);
			if (
				!trigger.player.countCards("he", function (card) {
					return lib.filter.cardDiscardable(card, trigger.player, "duoduan");
				})
			)
				event.finish();
			else
				player
					.chooseControl()
					.set("choiceList", ["令其摸两张牌，然后令" + sha + "对你无效", "令其弃置一张牌，然后你不可响应" + sha])
					.set("prompt", "度断：令" + get.translation(trigger.player) + "执行一项")
					.set("ai", function () {
						var player = _status.event.player;
						var source = _status.event.getTrigger().player;
						if (get.attitude(player, source) > 0) return 0;
						if (!player.hasShan() && player.hp >= 2) return 1;
						return 0;
					});
			"step 3";
			if (result.index == 0) event.goto(5);
			else trigger.player.chooseToDiscard("弃置一张牌令" + get.translation(player) + "不能闪避此【杀】", "he", true);
			"step 4";
			if (result.bool) {
				trigger.directHit.add(player);
			}
			event.finish();
			"step 5";
			trigger.player.draw(2);
			trigger.excluded.add(player);
		},
	},
	duoduan_im: {
		//'im' refers to 'Iwasawa Masami' in 'Angel Beats!'
		//Although she disappeared in the Episode 3 of the anime, but her route in the game is really worth to play.
	},
	chengzhao: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			var num = 0;
			player.getHistory("gain", function (evt) {
				num += evt.cards.length;
			});
			if (num < 2) return false;
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return player != current && player.canCompare(current);
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("chengzhao"), function (card, player, target) {
					return player.canCompare(target);
				})
				.set("ai", function (target) {
					return -get.attitude(_status.event.player, target) / target.countCards("h");
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("chengzhao", target);
				player.chooseToCompare(target);
			} else event.finish();
			"step 2";
			if (result.bool) {
				var card = { name: "sha", isCard: true };
				if (player.canUse(card, target, false)) player.useCard(card, target, false).card.chengzhao = true;
			}
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (!arg || !arg.card || arg.card.chengzhao != true) return false;
			},
		},
	},
	rezhengrong: {
		trigger: { player: "useCardAfter" },
		locked: true,
		direct: true,
		audio: "drlt_zhenrong",
		filter(event, player) {
			if (!event.targets) return false;
			if (!event.isPhaseUsing(player)) return false;
			var bool = false;
			for (var i = 0; i < event.targets.length; i++) {
				if (event.targets[i] != player) {
					bool = true;
					break;
				}
			}
			if (!bool) return false;
			return (
				player
					.getAllHistory("useCard", function (evt) {
						if (!evt.isPhaseUsing(player)) return false;
						for (var i = 0; i < evt.targets.length; i++) {
							if (evt.targets[i] != player) return true;
						}
						return false;
					})
					.indexOf(event) %
					2 ==
				1
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("rezhengrong"), true, "将一名其他角色的随机一张牌置于你的武将牌上，成为「荣」", function (card, player, target) {
					return target != player && target.countCards("he") > 0;
				})
				.set("ai", function (target) {
					return (1 - get.attitude(_status.event.player, target)) / target.countCards("he");
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = result.targets[0];
				player.logSkill("rezhengrong", target);
				var card = target.getCards("he").randomGet();
				player.addToExpansion(card, target, "give").gaintag.add("rezhengrong");
			}
		},
		marktext: "荣",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
	rehongju: {
		trigger: { player: "phaseZhunbeiBegin" },
		audio: "drlt_hongju",
		forced: true,
		unique: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		derivation: "reqingce",
		filter(event, player) {
			return player.getExpansions("rezhengrong").length >= 3 && game.dead.length > 0;
		},
		content() {
			"step 0";
			player.awakenSkill("rehongju");
			player.draw(player.getExpansions("rezhengrong").length);
			"step 1";
			if (player.countCards("h") == 0) event.goto(3);
			else {
				var dialog = ["请选择要交换的手牌和「荣」，或点「取消」", '<div class="text center">「征荣」牌</div>', player.getExpansions("rezhengrong"), '<div class="text center">手牌区</div>', player.getCards("h")];
				var next = player.chooseButton(dialog);
				next.set("filterButton", function (button) {
					var ss = _status.event.player.getExpansions("rezhengrong");
					var hs = _status.event.player.getCards("h");
					var sn = 0;
					var hn = 0;
					var ub = ui.selected.buttons;
					for (var i = 0; i < ub.length; i++) {
						if (ss.includes(ub[i].link)) sn++;
						else hn++;
					}
					return !((sn >= hs.length && ss.includes(button.link)) || (hn >= ss.length && hs.includes(button.link)));
				});
				next.set("selectButton", function () {
					if (ui.selected.buttons.length == 0) return 2;
					var ss = _status.event.player.getExpansions("rezhengrong");
					var hs = _status.event.player.getCards("h");
					var sn = 0;
					var hn = 0;
					var ub = ui.selected.buttons;
					for (var i = 0; i < ub.length; i++) {
						if (ss.includes(ub[i].link)) sn++;
						else hn++;
					}
					if (sn != hn) return 2 * Math.max(sn, hn);
					else {
						if (sn == ss.length || hn == hs.length || sn == hs.length || hn == ss.length) return ub.length;
						return [ub.length, ub.length + 1];
					}
				});
				next.set("ai", function () {
					return -1;
				});
			}
			"step 2";
			if (result.bool) {
				var gains = [];
				var pushs = [];
				var expansions = player.getExpansions("rezhengrong");
				for (var i = 0; i < result.links.length; i++) {
					var card = result.links[i];
					if (expansions.includes(card)) gains.push(card);
					else pushs.push(card);
				}
				player.addToExpansion(pushs, player, "give").gaintag.add("rezhengrong");
				player.gain(gains, "gain2");
			}
			"step 3";
			player.addSkills("reqingce");
			player.loseMaxHp();
		},
		ai: {
			combo: "rezhengrong",
		},
	},
	reqingce: {
		enable: "phaseUse",
		audio: "drlt_qingce",
		filter(event, player) {
			return player.getExpansions("rezhengrong").length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("请选择要移去的「荣」", player.getExpansions("rezhengrong"), "hidden");
			},
			backup(links, player) {
				return {
					card: links[0],
					filterCard() {
						return false;
					},
					selectCard: -1,
					filterTarget(card, player, target) {
						return target.countDiscardableCards(player, "ej") > 0;
					},
					delay: false,
					audio: "drlt_qingce",
					content: lib.skill.reqingce.contentx,
					ai: {
						result: {
							target(player, target) {
								var att = get.attitude(player, target);
								if (
									att > 0 &&
									(target.countCards("j") > 0 ||
										target.countCards("e", function (card) {
											return get.value(card, target) < 0;
										}))
								)
									return 2;
								if (att < 0 && target.countCards("e") > 0 && !target.hasSkillTag("noe")) return -1;
								return 0;
							},
						},
					},
				};
			},
			prompt(links, player) {
				return "弃置一名角色装备区或判定区内的一张牌";
			},
		},
		contentx() {
			"step 0";
			var card = lib.skill.reqingce_backup.card;
			player.loseToDiscardpile(card);
			"step 1";
			if (target.countDiscardableCards(player, "ej") > 0) {
				player.discardPlayerCard("ej", true, target);
			}
		},
		ai: {
			combo: "rezhengrong",
			order: 8,
			result: {
				player(player) {
					if (
						game.hasPlayer(function (current) {
							var att = get.attitude(player, current);
							if ((att > 0 && current.countCards("j") > 0) || (att < 0 && current.countCards("e") > 0)) return true;
							return false;
						})
					)
						return 1;
					return 0;
				},
			},
		},
	},
	fengji: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return typeof player.storage.fengji == "number" && player.countCards("h") >= player.storage.fengji;
		},
		content() {
			player.draw(2);
			player.addTempSkill("fengji3");
		},
		group: "fengji2",
		intro: {
			content: "上回合结束时的手牌数：#",
		},
	},
	fengji2: {
		trigger: { player: "phaseEnd" },
		silent: true,
		sourceSkill: "fengji",
		content() {
			player.storage.fengji = player.countCards("h");
			if (player.hasSkill("fengji")) player.markSkill("fengji");
		},
	},
	fengji3: {
		mod: {
			maxHandcardBase(player, num) {
				return player.maxHp;
			},
		},
	},
	zhouxuan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard: true,
		position: "he",
		filterTarget(card, player, target) {
			if (!["identity", "doudizhu"].includes(get.mode()) && target.isFriendOf(player)) return false;
			return target != player;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			player.addSkill("zhouxuan2");
			target.addTempSkill("zhouxuan_ai", { player: "phaseUseAfter" });
			player.storage.zhouxuan2 = {};
			player.storage.zhouxuan2.player = target;
			var list = [];
			var basic = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				var name = lib.inpile[i];
				var type = get.type(name, "trick");
				if (type == "basic") {
					list.push(name);
					basic.push(name);
				} else list.add(type);
			}
			event.basic = basic;
			player
				.chooseControl(list)
				.set("prompt", "请选择一种基本牌的名称或非基本牌的类别")
				.set("ai", function () {
					var player = _status.event.player;
					var target = player.storage.zhouxuan2.player;
					var cards = target.getCards("h", function (card) {
						return target.hasUseTarget(card);
					});
					var map = {};
					for (var i = 0; i < cards.length; i++) {
						var type = get.type(cards[i], "trick");
						map[type == "basic" ? get.name(cards[i]) : type] = true;
					}
					if (map.equip) return "equip";
					if (map.trick) return "trick";
					if (map.sha) return "sha";
					if (map.tao) return "tao";
					return 0;
				});
			"step 1";
			player.storage.zhouxuan2.card = result.control;
			if (event.basic.includes(result.control)) player.storage.zhouxuan2.isbasic = true;
			player.markSkill("zhouxuan2");
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (get.attitude(player, target) > 0)
						return (
							Math.max(1, target.hp) *
							target.countCards("h", function (card) {
								return target.getUseValue(card) > 0;
							})
						);
					return 0;
				},
			},
		},
	},
	zhouxuan_ai: {
		mod: {
			aiOrder(player, card, num) {
				if (
					game.hasPlayer(function (current) {
						return current.storage.zhouxuan2 && current.storage.zhouxuan2.player == player && get.attitude(player, current) > 0 && (current.storage.zhouxuan2.isbasic ? card.name : get.type(card, "trick")) == current.storage.zhouxuan2.card;
					})
				)
					return num + 10;
			},
		},
	},
	zhouxuan2: {
		intro: {
			mark(player, storage) {
				return get.translation(storage.player) + "使用或打出下一张牌时，若此牌为" + get.translation(storage.card) + (storage.isbasic ? "" : "牌") + "，你观看牌堆顶的三张牌并分配给任意角色";
			},
		},
		audio: "zhouxuan",
		forced: true,
		charlotte: true,
		trigger: { global: ["useCard", "respond"] },
		sourceSkill: "zhouxuan",
		filter(event, player) {
			if (event.zhouxuanable) return true;
			if (player.storage.zhouxuan2) {
				var map = player.storage.zhouxuan2;
				if (map.player != event.player) return false;
				delete player.storage.zhouxuan2;
				player.unmarkSkill("zhouxuan2");
				if (map.card != (map.isbasic ? event.card.name : get.type(event.card, "trick"))) return false;
				event.zhouxuanable = true;
				return true;
			}
			return false;
		},
		logTarget: "player",
		content() {
			"step 0";
			event.cards = game.cardsGotoOrdering(get.cards(3)).cards;
			if (_status.connectMode)
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			event.given_map = {};
			"step 1";
			if (event.cards.length > 1) {
				player.chooseCardButton("周旋：请选择要分配的牌", true, event.cards, [1, event.cards.length]).set("ai", function (button) {
					if (ui.selected.buttons.length == 0) return 1;
					return 0;
				});
			} else if (event.cards.length == 1) {
				event._result = { links: event.cards.slice(0), bool: true };
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.cards.removeArray(result.links);
				event.togive = result.links.slice(0);
				player
					.chooseTarget("选择一名角色获得" + get.translation(result.links), true)
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (_status.event.enemy) {
							return -att;
						} else if (att > 0) {
							return att / (1 + target.countCards("h"));
						} else {
							return att / 100;
						}
					})
					.set("enemy", get.value(event.togive[0], player, "raw") < 0);
			}
			"step 3";
			if (result.targets.length) {
				var id = result.targets[0].playerid,
					map = event.given_map;
				if (!map[id]) map[id] = [];
				map[id].addArray(event.togive);
			}
			if (cards.length > 0) event.goto(1);
			"step 4";
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			var list = [];
			for (var i in event.given_map) {
				var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				list.push([source, event.given_map[i]]);
			}
			game.loseAsync({
				gain_list: list,
				giver: player,
				animate: "draw",
			}).setContent("gaincardMultiple");
		},
	},
	reshanxi: {
		audio: "shanxi",
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return (
				player.hp > 0 &&
				player.countCards("h", function (card) {
					if (_status.connectMode) return true;
					return get.color(card) == "red" && get.type(card) == "basic";
				}) > 0
			);
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				filterCard(card) {
					return get.color(card) == "red" && get.type(card) == "basic" && lib.filter.cardDiscardable.apply(this, arguments);
				},
				filterTarget(card, player, target) {
					return player != target && target.countCards("he") > 0;
				},
				prompt: get.prompt("reshanxi"),
				prompt2: "弃置一张红色基本牌并选择一名其他角色，将其的至多X张牌置于其武将牌上直到回合结束。（X为你的体力值）",
				ai1() {
					return -1;
				},
			});
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("reshanxi", event.target);
				player.discard(result.cards);
			} else event.finish();
			"step 2";
			var max = Math.min(player.hp, target.countCards("he"));
			if (max > 0 && target.isIn()) {
				player
					.choosePlayerCard("he", target, true, [1, max])
					.set("forceAuto", true)
					.set("prompt", "将" + get.translation(target) + "的至多" + get.cnNumber(max) + "张牌置于其武将牌上");
			} else event.finish();
			"step 3";
			target.addSkill("reshanxi2");
			target.addToExpansion(result.cards, "giveAuto", target).gaintag.add("reshanxi2");
		},
	},
	reshanxi2: {
		trigger: { global: "phaseEnd" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "reshanxi",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		content() {
			"step 0";
			var cards = player.getExpansions("reshanxi2");
			if (cards.length) player.gain(cards, "draw");
			"step 1";
			player.removeSkill("reshanxi2");
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("reshanxi2");
				if (player.isUnderControl(true)) dialog.addAuto(cards);
				else return "共有" + get.cnNumber(cards.length) + "张牌";
			},
		},
	},
	reqizhou: {
		trigger: { player: ["equipEnd", "loseEnd"] },
		forced: true,
		popup: false,
		derivation: ["reyingzi", "qixi", "rexuanfeng"],
		filter(event, player) {
			if (player.equiping) return false;
			var suits = [];
			var es = player.getCards("e");
			for (var i = 0; i < es.length; i++) {
				suits.add(get.suit(es[i]));
			}
			if (suits.length > 3) suits.length = 3;
			if (player.additionalSkills.reqizhou) {
				return player.additionalSkills.reqizhou.length != suits.length;
			} else {
				return suits.length > 0;
			}
		},
		content() {
			lib.skill.reqizhou.init(player, "reqizhou");
		},
		init(player, skill) {
			var suits = [];
			var es = player.getCards("e");
			for (var i = 0; i < es.length; i++) {
				suits.add(get.suit(es[i]));
			}
			if (suits.length > 3) suits.length = 3;
			player.removeAdditionalSkill(skill);
			switch (suits.length) {
				case 1:
					player.addAdditionalSkill(skill, ["reyingzi"]);
					break;
				case 2:
					player.addAdditionalSkill(skill, ["reyingzi", "qixi"]);
					break;
				case 3:
					player.addAdditionalSkill(skill, ["reyingzi", "qixi", "rexuanfeng"]);
					break;
			}
		},
		ai: {
			threaten: 1.2,
		},
	},
	zhaohan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.phaseNumber < 8;
		},
		check(event, player) {
			return player.phaseNumber < 3;
		},
		content() {
			if (player.phaseNumber < 5) {
				player.gainMaxHp();
				player.recover();
			} else player.loseMaxHp();
		},
	},
	rangjie: {
		audio: 2,
		trigger: { player: "damageEnd" },
		getIndex(event) {
			return event.num;
		},
		async cost(event, trigger, player) {
			let choiceList = ["获得一张指定类型的牌"];
			if (player.canMoveCard()) choiceList.push("移动场上的一张牌");
			const result = await player
				.chooseControl("cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt("rangjie"))
				.set("ai", function () {
					var player = _status.event.player;
					if (player.canMoveCard(true)) return 1;
					return 0;
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.index,
			};
		},
		async content(event, trigger, player) {
			if (event.cost_data) {
				player.moveCard(true);
			} else {
				const result = await player
					.chooseControl("basic", "trick", "equip")
					.set("prompt", "选择获得一种类型的牌")
					.set("ai", function () {
						var player = _status.event.player;
						if (player.hp <= 3 && !player.countCards("h", { name: ["shan", "tao"] })) return "basic";
						if (player.countCards("he", { type: "equip" }) < 2) return "equip";
						return "trick";
					})
					.forResult();
				const card = get.cardPile(function (card) {
					return get.type(card, "trick") == result.control;
				});
				if (card) await player.gain(card, "gain2", "log");
			}
			await player.draw();
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						if (!target.hasFriend()) return;
						var num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) num = 0.7;
							else num = 0.5;
						}
						if (target.hp >= 4) return [1, num * 2];
						if (target.hp == 3) return [1, num * 1.5];
						if (target.hp == 2) return [1, num * 0.5];
					}
				},
			},
		},
	},
	yizheng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.hp <= player.hp && player.canCompare(current);
			});
		},
		filterTarget(card, player, current) {
			return current.hp <= player.hp && player.canCompare(current);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.skip("phaseDraw");
				target.addTempSkill("yizheng2", { player: "phaseDrawSkipped" });
			} else player.loseMaxHp();
		},
		ai: {
			order: 1,
			result: {
				player: (player, target) => {
					let hs = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					if (!hs.length) return 0;
					let a = get.number(hs[0]),
						b = 4;
					if (player.getDamagedHp()) b = 2;
					return -b * (1 - Math.pow((a - 1) / 13, target.countCards("h")));
				},
				target: (player, target) => {
					if (target.skipList.includes("phaseDraw") || target.hasSkill("pingkou") || target.hasSkill("xinpingkou")) return 0;
					let hs = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					if (!hs.length) return 0;
					return -Math.pow((get.number(hs[0]) - 1) / 13, target.countCards("h")) * 2;
				},
			},
		},
	},
	yizheng2: {
		mark: true,
		intro: { content: "跳过下回合的摸牌阶段" },
	},
	rw_zhuge_skill: {
		equipSkill: true,
		audio: true,
		firstDo: true,
		trigger: { player: "useCard1" },
		forced: true,
		filter(event, player) {
			return !event.audioed && event.card.name == "sha" && player.countUsed("sha", true) > 1 && event.getParent().type == "phase";
		},
		content() {
			trigger.audioed = true;
		},
		mod: {
			cardUsable(card, player, num) {
				var cards = player.getEquips("rewrite_zhuge");
				if (card.name == "sha") {
					if (!cards.length || player.hasSkill("rw_zhuge_skill", null, false) || cards.some(card => card != _status.rw_zhuge_temp && !ui.selected.cards.includes(card))) {
						if (get.is.versus() || get.is.changban()) {
							return num + 3;
						}
						return Infinity;
					}
				}
			},
			cardEnabled2(card, player) {
				if (!_status.event.addCount_extra || player.hasSkill("rw_zhuge_skill", null, false)) return;
				var cards = player.getEquips("rewrite_zhuge");
				if (card && cards.includes(card)) {
					try {
						var cardz = get.card();
					} catch (e) {
						return;
					}
					if (!cardz || cardz.name != "sha") return;
					_status.rw_zhuge_temp = card;
					var bool = lib.filter.cardUsable(get.autoViewAs({ name: "sha" }, ui.selected.cards.concat([card])), player);
					delete _status.rw_zhuge_temp;
					if (!bool) return false;
				}
			},
		},
	},
	xinqingjian: {
		audio: "qingjian",
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		usable: 1,
		filter(event, player) {
			return event.getg(player).length && event.getParent("phaseDraw").player != player && player.countCards("h") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.name.slice(0, -5)), "h", [1, player.countCards("h")])
				.set("ai", card => {
					if (!game.hasPlayer(target => player != target && get.attitude(player, target) > 0)) return 0;
					return 4 - get.value(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.addSkill("xinqingjian2");
			const next = player.addToExpansion(event.cards, "giveAuto", player);
			next.gaintag.add("xinqingjian2");
			await next;
		},
	},
	xinqingjian2: {
		audio: "xinqingjian",
		charlotte: true,
		trigger: { global: "phaseEnd" },
		forced: true,
		sourceSkill: "xinqingjian",
		filter(event, player) {
			return player.getExpansions("xinqingjian2").length > 0;
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		async content(event, trigger, player) {
			if (_status.connectMode)
				game.broadcastAll(() => {
					_status.noclearcountdown = true;
				});
			const given_map = {};
			event.given_map = given_map;
			const expansions = player.getExpansions("xinqingjian2");
			const goon = expansions.length > 1;
			let result;
			while (true) {
				if (expansions.length > 1) {
					result = await player
						.chooseCardButton("清俭：请选择要分配的牌", true, expansions, [1, expansions.length])
						.set("ai", button => {
							if (ui.selected.buttons.length) return 0;
							return get.value(button.link, get.player());
						})
						.forResult();
				} else if (expansions.length === 1) result = { bool: true, links: expansions.slice(0) };
				else return;
				if (!result.bool) return;
				const toGive = result.links;
				result = await player
					.chooseTarget(`选择一名其他角色获得${get.translation(toGive)}`, expansions.length === 1, lib.filter.notMe)
					.set("ai", target => {
						const att = get.attitude(get.player(), target);
						if (get.event("toEnemy")) return Math.max(0.01, 100 - att);
						else if (att > 0) return Math.max(0.1, att / Math.sqrt(1 + target.countCards("h") + (get.event().getParent().given_map[target.playerid] || 0)));
						else return Math.max(0.01, (100 + att) / 200);
					})
					.set("toEnemy", get.value(toGive[0], player, "raw") < 0)
					.forResult();
				if (result.bool) {
					expansions.removeArray(toGive);
					if (result.targets.length) {
						const id = result.targets[0].playerid;
						if (!given_map[id]) given_map[id] = [];
						given_map[id].addArray(toGive);
					}
					if (!expansions.length) break;
				}
			}
			if (_status.connectMode)
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			const gain_list = [];
			for (const i in given_map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				gain_list.push([source, given_map[i]]);
				game.log(source, "获得了", given_map[i]);
			}
			await game
				.loseAsync({
					gain_list,
					giver: player,
					animate: "gain2",
				})
				.setContent("gaincardMultiple");
			if (goon) await player.draw();
			player.removeSkill("xinqingjian2");
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("xinqingjian2");
				if (player.isUnderControl(true)) dialog.addAuto(cards);
				else return "共有" + get.cnNumber(cards.length) + "张牌";
			},
		},
	},
	zhongzuo: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.getHistory("damage").length > 0 || player.getHistory("sourceDamage").length > 0;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("zhongzuo"), "令一名角色摸两张牌。若其已受伤，则你摸一张牌。").set("ai", function (target) {
				if (target.hasSkillTag("nogain")) return target.isDamaged() ? 0 : 1;
				let att = get.attitude(_status.event.player, target);
				if (att <= 0) return 0;
				if (target.isDamaged()) return 1 + att / 5;
				return att / 5;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("zhongzuo", target);
				target.draw(2);
				if (target.isDamaged()) player.draw();
			}
		},
	},
	wanlan: {
		audio: 2,
		trigger: { global: "dying" },
		check(event, player) {
			if (get.attitude(player, event.player) < 4) return false;
			if (player.countCards("hs", card => player.canSaveCard(card, event.player)) >= 1 - event.player.hp) return false;
			if (event.player == player || event.player == get.zhu(player)) return true;
			if (_status.currentPhase && get.damageEffect(_status.currentPhase, player, player) < 0) return false;
			return !player.hasUnknown();
		},
		limited: true,
		unique: true,
		filter(event, player) {
			return event.player.hp <= 0;
		},
		skillAnimation: true,
		animationColor: "thunder",
		logTarget: "player",
		content() {
			"step 0";
			player.awakenSkill("wanlan");
			var hs = player.getCards("h");
			if (hs.length) player.discard(hs);
			"step 1";
			var num = 1 - trigger.player.hp;
			if (num) trigger.player.recover(num);
			"step 2";
			if (_status.currentPhase && _status.currentPhase.isIn()) {
				var next = _status.currentPhase.damage();
				event.next.remove(next);
				trigger.after.push(next);
			}
		},
	},
	rezhiyi: {
		audio: "zhiyi",
		trigger: { global: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			return (
				player.getHistory("useCard", function (card) {
					return get.type(card.card) == "basic";
				}).length > 0 ||
				player.getHistory("respond", function (card) {
					return get.type(card.card) == "basic";
				}).length > 0
			);
		},
		content() {
			"step 0";
			var list = [];
			player.getHistory("useCard", function (evt) {
				if (get.type(evt.card) != "basic") return;
				var name = evt.card.name;
				if (name == "sha") {
					var nature = evt.card.nature;
					switch (nature) {
						case "fire":
							name = "huosha";
							break;
						case "thunder":
							name = "leisha";
							break;
						case "kami":
							name = "kamisha";
							break;
						case "ice":
							name = "icesha";
							break;
						case "stab":
							name = "cisha";
							break;
					}
				}
				list.add(name);
			});
			player.getHistory("respond", function (evt) {
				if (get.type(evt.card) != "basic") return;
				var name = evt.card.name;
				if (name == "sha") {
					var nature = evt.card.nature;
					switch (nature) {
						case "fire":
							name = "huosha";
							break;
						case "thunder":
							name = "leisha";
							break;
						case "kami":
							name = "kamisha";
							break;
						case "ice":
							name = "icesha";
							break;
						case "stab":
							name = "cisha";
							break;
					}
				}
				list.add(name);
			});
			player.chooseButton(
				[
					"执义：选择要使用的牌，或点取消摸一张牌",
					[
						list.map(function (name) {
							return ["基本", "", name];
						}),
						"vcard",
					],
				],
				function (button) {
					return _status.event.player.getUseValue({
						name: button.link[2],
						nature: button.link[3],
					});
				},
				function (button) {
					return _status.event.player.hasUseTarget({
						name: button.link[2],
						nature: button.link[3],
					});
				}
			);
			"step 1";
			if (!result.bool) player.draw();
			else player.chooseUseTarget({ name: result.links[0][2], isCard: true, nature: result.links[0][3] }, true);
		},
	},
	zhiyi: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		forced: true,
		filter(event, player) {
			if (get.type(event.card) != "basic") return false;
			var history = player
				.getHistory("useCard", function (evt) {
					return get.type(evt.card) == "basic";
				})
				.concat(
					player.getHistory("respond", function (evt) {
						return get.type(evt.card) == "basic";
					})
				);
			return history.length == 1 && history[0] == event;
		},
		content() {
			"step 0";
			var info = get.info(trigger.card);
			if (!info || !info.enable) event._result = { index: 0 };
			else {
				var evt = trigger;
				if (evt.respondTo && evt.getParent("useCard").name == "useCard") evt = evt.getParent("useCard");
				event.evt = evt;
				player
					.chooseControl()
					.set("prompt", "执义：请选择一项")
					.set("choiceList", [
						"摸一张牌",
						"于" +
							get.translation(evt.card) +
							"的使用结算结束之后视为使用一张" +
							get.translation({
								name: trigger.card.name,
								nature: trigger.card.nature,
								isCard: true,
							}),
					])
					.set("ai", function () {
						return _status.event.choice;
					})
					.set(
						"choice",
						(function () {
							var card = {
								name: trigger.card.name,
								nature: trigger.card.nature,
								isCard: true,
							};
							if (card.name == "sha") {
								if (player.getUseValue(card) > 0) return 1;
							} else if (card.name == "tao") {
								var hp = player.maxHp - player.hp;
								if (trigger.targets.includes(player)) hp--;
								return hp > 0 ? 1 : 0;
							}
							return 0;
						})()
					);
			}
			"step 1";
			if (result.index == 0) {
				player.draw();
			} else {
				var next = player.chooseUseTarget({ name: trigger.card.name, nature: trigger.card.nature, isCard: true }, false, true);
				_status.event.next.remove(next);
				event.evt.after.push(next);
				next.logSkill = "zhiyi";
			}
		},
	},
	//表演测试
	qiaosi_map: { charlotte: true },
	qiaosi: {
		audio: "xinfu_qiaosi",
		derivation: "qiaosi_map",
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				game.pause();
				game.countChoose();
				setTimeout(function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						links: ["qiaosi_c1", "qiaosi_c6"].concat(["qiaosi_c2", "qiaosi_c3", "qiaosi_c4", "qiaosi_c5"].randomGets(1)),
					};
					if (event.dialog) event.dialog.close();
					if (event.controls) {
						for (var i of event.controls) i.close();
					}
					game.resume();
				}, 5000);
			};
			var createDialog = function (player, id) {
				if (player == game.me) return;
				var str = get.translation(player) + "正在表演...<br>";
				for (var i = 1; i < 7; i++) {
					str += get.translation("qiaosi_c" + i);
					if (i % 3 != 0) str += "　　";
					if (i == 3) str += "<br>";
				}
				ui.create.dialog(str, "forcebutton").videoId = id;
			};
			var chooseButton = function (player) {
				var event = _status.event;
				player = player || event.player;
				event.status = {
					qiaosi_c1: 0,
					qiaosi_c2: 0,
					qiaosi_c3: 0,
					qiaosi_c4: 0,
					qiaosi_c5: 0,
					qiaosi_c6: 0,
				};
				event.map = {
					qiaosi_c1: [40, 60],
					qiaosi_c2: [80, 120],
					qiaosi_c3: [90, 110],
					qiaosi_c4: [90, 110],
					qiaosi_c5: [80, 120],
					qiaosi_c6: [40, 60],
				};
				event.finishedx = [];
				event.str = '请开始你的表演<br><img src="' + lib.assetURL + 'image/card/qiaosi_card1.png" width="60" height="60">qiaosi_c1% <img src="' + lib.assetURL + 'image/card/qiaosi_card2.png" width="60" height="60">qiaosi_c2% <img src="' + lib.assetURL + 'image/card/qiaosi_card3.png" width="60" height="60">qiaosi_c3%<br><img src="' + lib.assetURL + 'image/card/qiaosi_card4.png" width="60" height="60">qiaosi_c4%<img src="' + lib.assetURL + 'image/card/qiaosi_card5.png" width="60" height="60">qiaosi_c5% <img src="' + lib.assetURL + 'image/card/qiaosi_card6.png" width="60" height="60">qiaosi_c6%';
				event.dialog = ui.create.dialog(event.str, "forcebutton", "hidden");
				event.dialog.addText("<li>点击下方的按钮，可以增加按钮对应的角色的「表演完成度」。对于不同的角色，点击时增加的完成度不同，最终获得的牌也不同。一次表演最多只能完成3名角色的进度。", false);
				event.dialog.open();
				for (var i in event.status) {
					event.dialog.content.childNodes[0].innerHTML = event.dialog.content.childNodes[0].innerHTML.replace(i, event.status[i]);
				}
				for (var i = 0; i < event.dialog.buttons.length; i++) {
					event.dialog.buttons[i].classList.add("pointerdiv");
				}
				(event.switchToAuto = function () {
					event._result = {
						bool: true,
						links: event.finishedx.slice(0),
					};
					event.dialog.close();
					for (var i of event.controls) i.close();
					game.resume();
					_status.imchoosing = false;
				}),
					(event.controls = []);
				for (var i = 1; i <= 6; i++)
					event.controls.push(
						ui.create.control("qiaosi_c" + i, function (link) {
							var event = _status.event;
							if (event.finishedx.includes(link)) return;
							event.status[link] += get.rand.apply(get, event.map[link]);
							if (event.status[link] >= 100) {
								event.status[link] = 100;
								var str = event.str.slice(0);
								for (var i in event.status) {
									str = str.replace(i, event.status[i]);
								}
								event.dialog.content.childNodes[0].innerHTML = str;
								event.finishedx.push(link);
								if (event.finishedx.length >= 3) {
									event._result = {
										bool: true,
										links: event.finishedx.slice(0),
									};
									event.dialog.close();
									for (var i of event.controls) i.close();
									game.resume();
									_status.imchoosing = false;
								}
							} else {
								var str = event.str.slice(0);
								for (var i in event.status) {
									str = str.replace(i, event.status[i]);
								}
								event.dialog.content.childNodes[0].innerHTML = str;
							}
						})
					);
				for (var i = 0; i < event.dialog.buttons.length; i++) {
					event.dialog.buttons[i].classList.add("selectable");
				}
				game.pause();
				game.countChoose();
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId);
			if (event.isMine()) {
				chooseButton();
			} else if (event.isOnline()) {
				event.player.send(chooseButton, event.player);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			game.broadcastAll("closeDialog", event.videoId);
			var map = event.result || result;
			//game.print(map);
			if (!map || !map.bool || !map.links) {
				game.log(player, "表演失败");
				event.finish();
				return;
			}
			var list = map.links;
			if (!list.length) {
				game.log(player, "表演失败");
				event.finish();
				return;
			}
			var cards = [];
			var list2 = [];
			if (list.includes("qiaosi_c1")) {
				list2.push("trick");
				list2.push("trick");
			}
			if (list.includes("qiaosi_c2")) {
				if (list.includes("qiaosi_c1")) list2.push(["sha", "jiu"]);
				else list2.push(Math.random() < 0.66 ? "equip" : ["sha", "jiu"]);
			}
			if (list.includes("qiaosi_c3")) {
				list2.push([Math.random() < 0.66 ? "sha" : "jiu"]);
			}
			if (list.includes("qiaosi_c4")) {
				list2.push([Math.random() < 0.66 ? "shan" : "tao"]);
			}
			if (list.includes("qiaosi_c5")) {
				if (list.includes("qiaosi_c6")) list2.push(["shan", "tao"]);
				else list2.push(Math.random() < 0.66 ? "trick" : ["shan", "tao"]);
			}
			if (list.includes("qiaosi_c6")) {
				list2.push("equip");
				list2.push("equip");
			}
			while (list2.length) {
				var filter = list2.shift();
				var card = get.cardPile(function (x) {
					if (cards.includes(x)) return false;
					if (typeof filter == "string" && get.type(x, "trick") == filter) return true;
					if (typeof filter == "object" && filter.includes(x.name)) return true;
				});
				if (card) cards.push(card);
				else {
					var card = get.cardPile(function (x) {
						return !cards.includes(x);
					});
					if (card) cards.push(card);
				}
			}
			if (cards.length) {
				event.cards = cards;
				event.num = cards.length;
				player.showCards(cards);
			} else event.finish();
			"step 2";
			player.gain(event.cards, "gain2");
			"step 3";
			if (!player.countCards("he")) event.finish();
			else
				player
					.chooseControl()
					.set("choiceList", ["将" + get.cnNumber(event.num) + "张牌交给一名其他角色", "弃置" + get.cnNumber(event.num) + "张牌"])
					.set("ai", function () {
						if (
							game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) > 2;
							})
						)
							return 0;
						return 1;
					});
			"step 4";
			if (result.index == 0) {
				player.chooseCardTarget({
					position: "he",
					filterCard: true,
					selectCard: Math.min(event.num, player.countCards("he")),
					filterTarget(card, player, target) {
						return player != target;
					},
					ai1(card) {
						return 1;
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						if (target.hasSkillTag("nogain")) att /= 10;
						if (target.hasJudge("lebu")) att /= 5;
						return att;
					},
					prompt: "选择" + get.cnNumber(event.num) + "张牌，交给一名其他角色。",
					forced: true,
				});
			} else {
				player.chooseToDiscard(event.num, true, "he");
				event.finish();
			}
			"step 5";
			if (result.bool) {
				var target = result.targets[0];
				player.give(result.cards, target);
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
			threaten: 3.2,
		},
	},
	refuhai: {
		audio: "xinfu_fuhai",
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			event.current = player.next;
			event.upper = [];
			event.lower = [];
			event.acted = [];
			event.num = 0;
			event.stopped = false;
			"step 1";
			event.acted.push(event.current);
			event.current.chooseControl("潮起", "潮落").set("prompt", "潮鸣起乎？潮鸣落乎？").ai = function () {
				return Math.random() < 0.5 ? 0 : 1;
			};
			"step 2";
			if (!event.chosen) event.chosen = result.control;
			if (event.chosen != result.control) event.stopped = true;
			if (!event.stopped) event.num++;
			if (result.control == "潮起") {
				event.upper.push(event.current);
			} else event.lower.push(event.current);
			event.current = event.current.next;
			if (event.current != player && !event.acted.includes(event.current)) event.goto(1);
			"step 3";
			for (var i = 0; i < event.acted.length; i++) {
				var bool = event.upper.includes(event.acted[i]);
				game.log(event.acted[i], "选择了", bool ? "#g潮起" : "#y潮落");
				event.acted[i].popup(bool ? "潮起" : "潮落", bool ? "wood" : "orange");
			}
			game.delay(1);
			"step 4";
			if (num > 1) player.draw(num);
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	rebiaozhao: {
		audio: "biaozhao",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		trigger: {
			player: "phaseJieshuBegin",
		},
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0 && !player.getExpansions("rebiaozhao").length;
		},
		content() {
			"step 0";
			player.chooseCard("he", get.prompt("rebiaozhao"), "将一张牌置于武将牌上作为“表”").ai = function (card) {
				return 6 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("rebiaozhao");
				player.addToExpansion(player, result.cards).gaintag.add("rebiaozhao");
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("rebiaozhao");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张表";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("rebiaozhao");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张表";
				}
			},
		},
		ai: {
			notemp: true,
		},
		group: ["rebiaozhao2", "rebiaozhao3"],
	},
	rebiaozhao2: {
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		forced: true,
		audio: "biaozhao",
		sourceSkill: "rebiaozhao",
		filter(event, player) {
			var cards = player.getExpansions("rebiaozhao"),
				cards2 = event.getd();
			if (!cards.length || !cards2.length) return false;
			var num = get.number(cards[0]);
			var cards = event.getd();
			for (var card of cards) {
				if (get.number(card) == num) return true;
			}
			return false;
		},
		content() {
			player.loseToDiscardpile(player.getExpansions("rebiaozhao"));
			player.loseHp();
		},
	},
	rebiaozhao3: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		forced: true,
		charlotte: true,
		audio: "biaozhao",
		sourceSkill: "rebiaozhao",
		filter(event, player) {
			return player.getExpansions("rebiaozhao").length > 0;
		},
		content() {
			"step 0";
			player.loseToDiscardpile(player.getExpansions("rebiaozhao"));
			"step 1";
			player.chooseTarget("令一名角色摸三张牌并回复1点体力", true).ai = function (target) {
				var num = 2;
				if (target.isDamaged()) num++;
				return num * get.attitude(_status.event.player, target);
			};
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.draw(3);
				target.recover();
			}
		},
	},
	reqianxin: {
		audio: "xinfu_qianxin",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard() {
			return [1, Math.min(2, game.players.length - 1)];
		},
		check(card) {
			return 6 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		content() {
			var targets = game
				.filterPlayer(function (current) {
					return current != player;
				})
				.randomGets(cards.length);
			var map = [];
			for (var i = 0; i < targets.length; i++) {
				var target = targets[i];
				target.addSkill("reqianxin2");
				target.storage.reqianxin2.push([cards[i], player]);
				map.push([target, cards[i]]);
			}
			game.loseAsync({
				gain_list: map,
				player: player,
				cards: cards,
				giver: player,
				animate: "giveAuto",
			}).setContent("gaincardMultiple");
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	reqianxin2: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "reqianxin",
		init(player, skill) {
			if (!player.storage[skill]) player.storage[skill] = [];
		},
		onremove: true,
		filter(event, player) {
			var list = player.storage.reqianxin2;
			if (Array.isArray(list)) {
				var hs = player.getCards("h");
				for (var i = 0; i < list.length; i++) {
					if (hs.includes(list[i][0]) && list[i][1].isIn()) return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var current = player.storage.reqianxin2.shift();
			event.source = current[1];
			if (!event.source.isIn() || !player.getCards("h").includes(current[0])) event.goto(3);
			"step 1";
			source.logSkill("reqianxin", player);
			player
				.chooseControl()
				.set("choiceList", ["令" + get.translation(source) + "摸两张牌", "令自己本回合的手牌上限-2"])
				.set("prompt", get.translation(source) + "发动了【遣信】，请选择一项")
				.set("source", source)
				.set("ai", function () {
					var player = _status.event.player;
					if (get.attitude(player, _status.event.source) > 0) return 0;
					if (player.maxHp - player.countCards("h") > 1) return 1;
					return Math.random() > 0.5 ? 0 : 1;
				});
			"step 2";
			if (result.index == 0) source.draw(2);
			else {
				player.addTempSkill("reqianxin3");
				player.addMark("reqianxin3", 2, false);
			}
			"step 3";
			if (player.storage.reqianxin2.length) event.goto(0);
			else player.removeSkill("reqianxin2");
		},
	},
	reqianxin3: {
		onremove: true,
		mod: {
			maxHandcard(player, num) {
				return num - player.countMark("reqianxin3");
			},
		},
	},
	renshi: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		forced: true,
		filter(event, player) {
			return player.isDamaged() && event.card && event.card.name == "sha";
		},
		content() {
			"step 0";
			trigger.cancel();
			if (trigger.cards) {
				var cards = trigger.cards.filterInD();
				if (cards.length) player.gain(cards, "gain2", "log");
			}
			"step 1";
			player.loseMaxHp();
		},
		ai: {
			halfneg: true,
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.card && arg.card.name == "sha") return true;
				return false;
			},
		},
	},
	wuyuan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", "sha") > 0;
		},
		filterCard: { name: "sha" },
		filterTarget: lib.filter.notMe,
		check(card) {
			var player = _status.event.player;
			if (
				get.color(card) == "red" &&
				game.hasPlayer(function (current) {
					return current != player && current.isDamaged() && get.attitude(player, current) > 2;
				})
			)
				return 2;
			if (get.natureList(card).length) return 1.5;
			return 1;
		},
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			player.give(cards, target, "give");
			player.recover();
			"step 1";
			var num = 1;
			if (get.natureList(cards[0]).length) num++;
			target.draw(num);
			if (get.color(cards[0]) == "red") target.recover();
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.isDamaged()) return 1;
					return 0;
				},
				target(player, target) {
					if (ui.selected.cards.length) {
						var num = 1;
						if (get.natureList(ui.selected.cards[0]).length) num++;
						if (target.hasSkillTag("nogain")) num = 0;
						if (get.color(ui.selected.cards[0]) == "red") return num + 2;
						else return num + 1;
					}
					return 1;
				},
			},
		},
	},
	huaizi: {
		mod: {
			maxHandcardBase(player, num) {
				return player.maxHp;
			},
		},
		//audio:2,
		//trigger:{player:'phaseDiscardBegin'},
		forced: true,
		firstDo: true,
		filter(event, player) {
			return player.isDamaged() && player.countCards("h") > player.hp;
		},
		content() {},
	},
	rexushen: {
		derivation: ["new_rewusheng", "redangxian"],
		audio: "xinfu_xushen",
		limited: true,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.hasSex("male");
			});
		},
		skillAnimation: true,
		animationColor: "fire",
		content() {
			player.addSkill("rexushen2");
			player.awakenSkill("rexushen");
			player.loseHp(
				game.countPlayer(function (current) {
					return current.hasSex("male");
				})
			);
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					if (
						player.hp !=
						game.countPlayer(function (current) {
							return current.hasSex("male");
						})
					)
						return 0;
					return game.hasPlayer(function (current) {
						return get.attitude(player, current) > 4 && current.countCards("h", "tao");
					})
						? 1
						: 0;
				},
			},
		},
	},
	rexushen2: {
		charlotte: true,
		subSkill: {
			count: {
				trigger: {
					player: "recoverBegin",
				},
				forced: true,
				silent: true,
				popup: false,
				filter(event, player) {
					if (!event.source) return false;
					if (!player.isDying()) return false;
					var evt = event.getParent("dying").getParent(2);
					return evt.name == "rexushen" && evt.player == player;
				},
				content() {
					trigger.rexushen = true;
				},
				sub: true,
			},
		},
		group: ["rexushen2_count"],
		trigger: {
			player: "recoverAfter",
		},
		sourceSkill: "rexushen",
		filter(event, player) {
			if (player.isDying()) return false;
			return event.rexushen == true;
		},
		direct: true,
		silent: true,
		popup: false,
		content() {
			"step 0";
			player.removeSkill("rexushen2");
			player.chooseBool("是否令" + get.translation(trigger.source) + "获得技能〖武圣〗和〖当先〗").ai = function () {
				return get.attitude(player, trigger.source) > 0;
			};
			"step 1";
			if (result.bool) {
				player.line(trigger.source, "fire");
				trigger.source.addSkills(["new_rewusheng", "redangxian"]);
			}
		},
	},
	rezhennan: {
		audio: "xinfu_zhennan",
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player != player && event.targets && event.targets.length && event.targets.length > event.player.hp;
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("rezhennan", trigger.player), "弃置一张牌并对其造成1点伤害", "he");
			next.set("logSkill", ["rezhennan", trigger.player]);
			next.set("ai", function (card) {
				var player = _status.event.player;
				var target = _status.event.getTrigger().player;
				if (get.damageEffect(target, player, player) > 0) return 7 - get.value(card);
				return -1;
			});
			"step 1";
			if (result.bool) trigger.player.damage();
		},
	},
	meiyong: {
		inherit: "xinfu_wuniang",
		audio: "xinfu_wuniang",
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("meiyong"), "获得一名其他角色区域内的一张牌，然后其摸一张牌。", function (card, player, target) {
					if (player == target) return false;
					return target.countGainableCards(player, "hej") > 0;
				})
				.set("ai", function (target) {
					return 10 - get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("meiyong", target);
				player.gainPlayerCard(target, "hej", true);
			} else event.finish();
			"step 2";
			target.draw();
		},
	},
	relianji: {
		audio: "wylianji",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.players.length > 1;
		},
		filterTarget: lib.filter.notMe,
		targetprompt: ["打人", "被打"],
		selectTarget: 2,
		multitarget: true,
		content() {
			"step 0";
			game.delay(0.5);
			if (!targets[0].hasEquipableSlot(1)) event.goto(2);
			"step 1";
			let target = targets[0];
			let equip1 = get.cardPile2(card => card.name == "qinggang");
			if (!equip1 || Math.random() > 0.5) {
				equip1 = get.cardPile2(function (card) {
					return get.subtype(card) == "equip1" && target.canUse(card, target);
				}, "random");
			}
			if (equip1) {
				if (equip1.name == "qinggang" && !lib.inpile.includes("qibaodao")) {
					game.broadcastAll(function (card) {
						card.init([card.suit, card.number, "qibaodao"]);
					}, equip1);
				}
				target.$draw(equip1);
				target.chooseUseTarget(equip1, "noanimate", "nopopup", true);
			}
			"step 2";
			game.updateRoundNumber();
			var list = ["nanman", "wanjian", "huogong", "juedou", "sha"];
			var list2 = game.players.slice(0);
			for (var i = 0; i < list.length; i++) {
				if (!targets[0].canUse(list[i], targets[1], false)) list.splice(i--, 1);
			}
			if (!list.length) return;
			var name = list.randomGet();
			if (name == "nanman" || name == "wanjian") {
				for (var i = 0; i < list2.length; i++) {
					if (!targets[0].canUse(name, list2[i], false)) list2.splice(i--, 1);
				}
			} else list2 = targets[1];
			targets[0].useCard({ name: name, isCard: true }, list2, "noai");
			game.delay(0.5);
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (ui.selected.targets.length == 0) {
						return 1;
					} else {
						return -1;
					}
				},
			},
			expose: 0.4,
			threaten: 3,
		},
		group: "relianji_count",
		subSkill: {
			count: {
				sub: true,
				forced: true,
				popup: false,
				silent: true,
				trigger: { global: "damageEnd" },
				filter(event, player) {
					var evt = event.getParent(3);
					return evt && evt.name == "relianji" && evt.player == player;
				},
				content() {
					if (!player.storage.relianji) player.storage.relianji = 0;
					player.storage.relianji++;
					event.trigger("remoucheng_awaken");
				},
			},
		},
	},
	remoucheng: {
		derivation: "jingong",
		trigger: {
			player: "remoucheng_awaken",
		},
		forced: true,
		filter(event, player) {
			return player.storage.relianji && player.storage.relianji > 2;
		},
		audio: "moucheng",
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		content() {
			player.awakenSkill("remoucheng");
			player.changeSkills(["jingong"], ["relianji"]);
			player.gainMaxHp();
			player.recover();
		},
		ai: {
			combo: "relianji",
		},
	},
	shouye: {
		audio: 2,
		group: "shouye_after",
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return event.player != player && event.targets.length == 1;
		},
		check(event, player) {
			if (event.player == game.me || event.player.isOnline()) return get.attitude(player, event.player) < 0;
			return get.effect(player, event.card, event.player, player) < 0;
		},
		usable: 1,
		logTarget: "player",
		content() {
			"step 0";
			player.line(trigger.player, "green");
			player.chooseToDuiben(trigger.player);
			"step 1";
			if (result.bool) {
				trigger.targets.remove(player);
				trigger.getParent().triggeredTargets2.remove(player);
				trigger.getParent().shouyeer = player;
			}
		},
		subSkill: {
			after: {
				sub: true,
				trigger: { global: "useCardAfter" },
				forced: true,
				silent: true,
				popup: false,
				filter(event, player) {
					if (event.shouyeer != player) return false;
					if (event.cards) {
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].isInPile()) return true;
						}
					}
					return false;
				},
				content() {
					var list = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (trigger.cards[i].isInPile()) {
							list.push(trigger.cards[i]);
						}
					}
					player.gain(list, "gain2", "log");
				},
			},
		},
	},
	liezhi: {
		audio: 2,
		group: "liezhi_damage",
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("liezhi"), "弃置至多两名其他角色区域内的各一张牌", [1, 2], function (card, player, target) {
				return target != player && target.countDiscardableCards(player, "hej") > 0;
			}).ai = function (target) {
				var player = _status.event.player;
				return get.effect(target, { name: "guohe" }, player, player);
			};
			"step 1";
			if (result.bool) {
				result.targets.sortBySeat();
				event.targets = result.targets;
				player.line(result.targets, "green");
				player.logSkill("liezhi", result.targets);
			} else event.finish();
			"step 2";
			event.current = targets.shift();
			player.discardPlayerCard(event.current, "hej", true);
			if (targets.length) event.redo();
		},
		subSkill: {
			damage: {
				trigger: { player: "damage" },
				forced: true,
				silent: true,
				popup: false,
				content() {
					player.tempBanSkill("liezhi", { player: "phaseAfter" });
				},
			},
		},
	},
	xinzhanyi: {
		audio: "zhanyi",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		check(card) {
			var player = _status.event.player;
			if (player.hp < 3) return 0;
			var type = get.type(card, "trick");
			if (type == "trick") {
				return 6 - get.value(card);
			} else if (type == "equip") {
				if (
					player.hasSha() &&
					game.hasPlayer(function (current) {
						return player.canUse("sha", current) && get.attitude(player, current) < 0 && get.effect(current, { name: "sha" }, player, player) > 0;
					})
				) {
					return 6 - get.value(card);
				}
			}
			return 0;
		},
		content() {
			player.loseHp();
			switch (get.type(cards[0], "trick", cards[0].original == "h" ? player : false)) {
				case "basic":
					player.addTempSkill("xinzhanyi_basic");
					player.addMark("xinzhanyi_basic1", 1, false);
					break;
				case "equip":
					player.addTempSkill("xinzhanyi_equip");
					break;
				case "trick":
					player.addTempSkill("xinzhanyi_trick");
					player.draw(3);
					break;
			}
		},
		ai: {
			order: 9.1,
			result: {
				player: 1,
			},
		},
	},
	xinzhanyi_basic1: {
		trigger: { player: "useCard" },
		sourceSkill: "xinzhanyi",
		filter(event, player) {
			return get.type(event.card, null, false) == "basic" && player.hasMark("xinzhanyi_basic1");
		},
		forced: true,
		silent: true,
		popup: false,
		content() {
			if (!trigger.baseDamage) trigger.baseDamage = 1;
			var num = player.countMark("xinzhanyi_basic1");
			trigger.baseDamage += num;
			player.removeMark("xinzhanyi_basic1", num, false);
			game.log(trigger.card, "的伤害值/回复值", "#y+" + num);
		},
	},
	xinzhanyi_basic: {
		group: ["xinzhanyi_basic1"],
		sourceSkill: "xinzhanyi",
		onremove(p, s) {
			delete p.storage[s + 1];
		},
		hiddenCard(player, name) {
			return get.type(name) == "basic" && player.countCards("h", { type: "basic" }) > 0;
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (
				!player.hasCard(function (card) {
					return get.type(card) == "basic";
				}, "hs")
			)
				return false;
			for (var name of lib.inpile) {
				if (get.type(name) != "basic") continue;
				if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) != "basic") continue;
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
					if (name != "sha") continue;
					for (var j of lib.inpile_nature) {
						if (event.filterCard({ name: name, nature: j }, player, event)) list.push(["基本", "", "sha", j]);
					}
				}
				return ui.create.dialog("战意", [list, "vcard"], "hidden");
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
						case "jiu": {
							if (player.countCards("hs", { type: "basic" }) >= 2) return 3;
							return 0;
						}
						case "sha":
							if (button.link[3] == "fire") return 2.95;
							else if (button.link[3] == "thunder" || button.link[3] == "ice") return 2.92;
							else return 2.9;
					}
				}
				return 0;
			},
			backup(links, player) {
				return {
					audio: "zhanyi",
					filterCard(card, player, target) {
						return get.type(card) == "basic";
					},
					check(card, player, target) {
						return 9 - get.value(card);
					},
					viewAs: { name: links[0][2], nature: links[0][3] },
					position: "hs",
					popname: true,
				};
			},
			prompt(links, player) {
				return "将一张基本牌当做" + get.translation(links[0][3] || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order() {
				var player = _status.event.player;
				var event = _status.event;
				if (event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0 && player.countCards("hs", { type: "basic" }) >= 2) {
					return 3.3;
				}
				return 3.1;
			},
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (
					player.hasCard(function (card) {
						return get.type(card) == "basic";
					}, "hs")
				) {
					if (tag == "respondSha") {
						if (arg != "use") return false;
					}
				} else {
					return false;
				}
			},
			result: {
				player: 1,
			},
		},
	},
	xinzhanyi_equip: {
		audio: "zhanyi",
		trigger: { player: "useCardToPlayered" },
		forced: true,
		sourceSkill: "xinzhanyi",
		filter(event, player) {
			return event.card.name == "sha" && event.target.countCards("he") > 0 && event.targets.length == 1;
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		content() {
			"step 0";
			trigger.target.chooseToDiscard("he", true, 2);
			"step 1";
			if (result.bool && result.cards && result.cards.length) {
				const cards = result.cards.filterInD("d");
				if (cards.length == 1) {
					event._result = { bool: true, links: result.cards.slice(0) };
				} else if (cards.length > 1) {
					player.chooseButton(["选择获得其中的一张牌", result.cards.slice(0)], true).set("ai", function (button) {
						return get.value(button.link);
					});
				} else event.finish();
			} else event.finish();
			"step 2";
			if (result.links) player.gain(result.links, "gain2");
		},
	},
	xinzhanyi_trick: {
		mod: {
			wuxieRespondable() {
				return false;
			},
		},
	},
	xinfu_daigong: {
		usable: 1,
		audio: 2,
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			return event.source != undefined && player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			var cards = player.getCards("h");
			var suits = [];
			for (var i = 0; i < cards.length; i++) {
				suits.add(get.suit(cards[i]));
			}
			trigger.source
				.chooseCard("he", "交给" + get.translation(player) + "一张满足条件的牌，否则防止此伤害。", function (card) {
					return !_status.event.suits.includes(get.suit(card));
				})
				.set("suits", suits).ai = function (card) {
				var player = _status.event.player;
				var target = _status.event.getParent("xinfu_daigong").player;
				if (get.damageEffect(target, player, player) > 0) return 6.5 - get.value(card);
				return 0;
			};
			"step 2";
			if (result.bool) {
				trigger.source.give(result.cards, player, true);
			} else trigger.cancel();
		},
	},
	xinfu_zhaoxin: {
		group: ["zhaoxin_give"],
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		filter(event, player) {
			return player.countCards("he") > 0 && player.getExpansions("xinfu_zhaoxin").length < 3;
		},
		filterCard: true,
		selectCard() {
			var player = _status.event.player;
			return [1, 3 - player.getExpansions("xinfu_zhaoxin").length];
		},
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		content() {
			player.addToExpansion(player, "give", cards).gaintag.add("xinfu_zhaoxin");
			player.draw(cards.length);
		},
		check(card) {
			return 6 - get.value(card);
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	zhaoxin_give: {
		trigger: {
			global: "phaseDrawAfter",
		},
		filter(event, player) {
			if (!player.getExpansions("xinfu_zhaoxin").length) return false;
			return player == event.player || player.inRange(event.player);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCardButton(get.prompt("xinfu_zhaoxin", trigger.player), player.getExpansions("xinfu_zhaoxin"), function (button) {
					return true;
				})
				.set("ai", function (button) {
					return 1 + Math.random();
				});
			"step 1";
			if (result.bool) {
				event.card = result.links[0];
				player.logSkill("xinfu_zhaoxin", target);
				player.line(trigger.player, "thunder");
				player.showCards(event.card);
			} else event.finish();
			"step 2";
			trigger.player.chooseBool("是否获得" + get.translation(event.card) + "?").ai = function () {
				return get.attitude(trigger.player, player) > 0;
			};
			"step 3";
			if (result.bool) {
				trigger.player.gain(event.card, "give", player, "bySelf");
				player.chooseBool("是否对" + get.translation(trigger.player) + "造成1点伤害？").ai = function () {
					return get.damageEffect(trigger.player, player, player) > 0;
				};
			} else {
				trigger.player.chat("拒绝");
				event.finish();
			}
			"step 4";
			if (result.bool) {
				trigger.player.damage("nocard");
			}
		},
	},
	xinfu_qianchong: {
		audio: 1,
		group: ["qc_weimu", "qc_mingzhe"],
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player) {
						var type = get.type2(card);
						if (player.getStorage("xinfu_qianchong_effect").includes(type)) return Infinity;
					},
					targetInRange(card, player) {
						var type = get.type2(card);
						if (player.getStorage("xinfu_qianchong_effect").includes(type)) return true;
					},
				},
			},
		},
		trigger: {
			player: "phaseUseBegin",
		},
		direct: true,
		derivation: ["weimu", "mingzhe"],
		filter(event, player) {
			var es = player.getCards("e");
			if (!es.length) return true;
			var col = get.color(es[0]);
			for (var i = 0; i < es.length; i++) {
				if (get.color(es[i]) != col) return true;
			}
			return false;
		},
		content() {
			"step 0";
			var list = ["basic", "trick", "equip", "cancel2"];
			list.removeArray(player.getStorage("xinfu_qianchong_effect"));
			if (list.length > 1) {
				player
					.chooseControl(list)
					.set("ai", function () {
						return list[0];
					})
					.set("prompt", get.prompt("xinfu_qianchong"))
					.set("prompt2", "你可以选择一种类别的牌，然后你本回合内使用该类别的牌时没有次数和距离限制。");
			} else event.finish();
			"step 1";
			if (result.control && result.control != "cancel2") {
				player.logSkill("xinfu_qianchong");
				var type = result.control;
				player.addTempSkill("xinfu_qianchong_effect");
				player.markAuto("xinfu_qianchong_effect", [type]);
				var str = get.translation(type) + "牌";
				game.log(player, "声明了", "#y" + str);
				player.popup(str, "thunder");
			}
		},
	},
	qc_weimu: {
		audio: true,
		trigger: { global: "useCard1" },
		forced: true,
		firstDo: true,
		filter(event, player) {
			if (player.hasSkill("weimu")) return false;
			if (event.player == player) return false;
			if (get.color(event.card) != "black" || get.type(event.card) != "trick") return false;
			var es = player.getCards("e");
			if (!es.length) return false;
			for (var i = 0; i < es.length; i++) {
				if (get.color(es[i]) != "black") return false;
			}
			var info = lib.card[event.card.name];
			return info && info.selectTarget && info.selectTarget == -1 && !info.toself;
		},
		async content() {},
		mod: {
			targetEnabled(card, player, target) {
				var bool = true;
				var es = target.getCards("e");
				if (!es.length) bool = false;
				for (var i = 0; i < es.length; i++) {
					if (get.color(es[i]) != "black") bool = false;
				}
				if (bool && (get.type(card) == "trick" || get.type(card) == "delay") && get.color(card) == "black") return false;
			},
		},
	},
	qc_mingzhe: {
		audio: true,
		trigger: {
			player: ["useCard", "respond", "loseAfter"],
			global: "loseAsyncAfter",
		},
		frequent: true,
		filter(event, player) {
			if (player.hasSkill("mingzhe")) return false;
			if (player == _status.currentPhase) return false;
			var es = player.getCards("e");
			if (!es.length) return false;
			for (var i = 0; i < es.length; i++) {
				if (get.color(es[i]) != "red") return false;
			}
			if (event.name.indexOf("lose") != 0) return get.color(event.card) == "red";
			if (event.type != "discard") return false;
			var evt = event.getl(player);
			if (evt.cards2) {
				for (var i = 0; i < evt.cards2.length; i++) {
					if (get.color(evt.cards2[i]) == "red") return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			event.count = 1;
			if (trigger.name.indexOf("lose") == 0) {
				event.count = 0;
				var evt = trigger.getl(player);
				for (var i = 0; i < evt.cards2.length; i++) {
					if (get.color(evt.cards2[i]) == "red") event.count++;
				}
			}
			"step 1";
			player.draw();
			event.count--;
			"step 2";
			if (event.count && player.hasSkill(event.name) && !get.is.blocked(event.name, player)) {
				player.chooseBool(get.prompt2("mingzhe")).set("frequentSkill", event.name);
			} else event.finish();
			"step 3";
			if (result.bool) {
				player.logSkill("qc_mingzhe");
				event.goto(1);
			}
		},
		ai: {
			threaten: 0.7,
		},
	},
	xinfu_shangjian: {
		trigger: {
			global: "phaseJieshuBegin",
		},
		audio: 2,
		filter(event, player) {
			var num = 0;
			player.getHistory("lose", function (evt) {
				var evt2 = evt.getParent();
				if (evt2.name == "useCard" && evt2.player == player && get.type(evt2.card, null, false) == "equip") return;
				if (evt.cards2) num += evt.cards2.length;
			});
			return num > 0 && num <= player.hp;
		},
		forced: true,
		content() {
			"step 0";
			var num = 0;
			player.getHistory("lose", function (evt) {
				var evt2 = evt.getParent();
				if (evt2.name == "useCard" && evt2.player == player && get.type(evt2.card, null, false) == "equip") return;
				if (evt.cards2) num += evt.cards2.length;
			});
			if (num > 0) {
				player.draw(num);
			}
		},
	},
	rw_bagua_skill: {
		inherit: "bagua_skill",
		audio: true,
		content() {
			"step 0";
			player.judge("rewrite_bagua", function (card) {
				return get.suit(card) != "spade" ? 1.5 : -0.5;
			}).judge2 = function (result) {
				return result.bool;
			};
			"step 1";
			if (result.judge > 0) {
				trigger.untrigger();
				trigger.set("responded", true);
				trigger.result = { bool: true, card: { name: "shan" } };
			}
		},
	},
	rw_baiyin_skill: {
		inherit: "baiyin_skill",
		audio: true,
		subSkill: {
			lose: {
				audio: "rw_baiyin_skill",
				forced: true,
				charlotte: true,
				equipSkill: true,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter: (event, player) => {
					return !player.hasSkillTag("unequip2");
				},
				getIndex(event, player) {
					const evt = event.getl(player);
					const lostCards = [];
					evt.es.forEach(card => {
						const VEquip = evt.vcard_map.get(card);
						if (VEquip.name === "rewrite_baiyin") lostCards.add(VEquip);
					});
					return lostCards.length;
				},
				async content(event, trigger, player) {
					await player.recover();
					await player.draw(2);
				},
			},
		},
	},
	rw_lanyinjia: {
		inherit: "lanyinjia",
		audio: "lanyinjia",
	},
	rw_minguangkai_cancel: {
		inherit: "minguangkai_cancel",
	},
	rw_minguangkai_link: {
		inherit: "minguangkai_link",
		trigger: {
			player: "linkBefore",
		},
		forced: true,
		filter(event, player) {
			return !player.isLinked();
		},
	},
	rw_renwang_skill: {
		inherit: "renwang_skill",
		audio: true,
		filter(event, player) {
			if (player.hasSkillTag("unequip2")) return false;
			if (
				event.player.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			)
				return false;
			return event.card.name == "sha" && (get.suit(event.card) == "heart" || get.color(event.card) == "black");
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (typeof card !== "object" || target.hasSkillTag("unequip2")) return;
					if (
						player.hasSkillTag("unequip", false, {
							name: card ? card.name : null,
							target: player,
							card: card,
						}) ||
						player.hasSkillTag("unequip_ai", false, {
							name: card ? card.name : null,
							target: player,
							card: card,
						})
					)
						return;
					if (card.name == "sha" && ["spade", "club", "heart"].includes(get.suit(card))) return "zeroplayertarget";
				},
			},
		},
	},
	rw_tengjia1: {
		inherit: "tengjia1",
		audio: true,
	},
	rw_tengjia2: {
		inherit: "tengjia2",
		audio: true,
	},
	rw_tengjia3: {
		audio: "rw_tengjia1",
		inherit: "rw_minguangkai_link",
	},
	rw_tengjia4: {
		inherit: "tengjia3",
		audio: "rw_tengjia1",
	},
	xinfu_pingcai: {
		subSkill: { backup: {} },
		wolong_card() {
			"step 0";
			var ingame = game.hasPlayer(function (current) {
				return ["sp_zhugeliang", "re_sp_zhugeliang", "ol_sp_zhugeliang", "prp_zhugeliang"].includes(current.name) || ["sp_zhugeliang", "re_sp_zhugeliang", "ol_sp_zhugeliang", "prp_zhugeliang"].includes(current.name2);
			})
				? true
				: false;
			var prompt = "请选择";
			prompt += ingame ? "至多两名" : "一名";
			prompt += "角色，对其造成1点火焰伤害";
			var range = ingame ? [1, 2] : [1, 1];
			player.chooseTarget(prompt, range).set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player, "fire");
			});
			"step 1";
			if (result.bool && result.targets.length) {
				player.line(result.targets, "fire");
				result.targets.sortBySeat();
				for (var i = 0; i < result.targets.length; i++) {
					result.targets[i].damage("fire");
				}
			}
		},
		fengchu_card() {
			"step 0";
			var ingame = game.hasPlayer(function (current) {
				return ["re_pangtong", "pangtong", "ol_pangtong"].includes(current.name) || ["re_pangtong", "pangtong", "ol_pangtong"].includes(current.name2);
			})
				? true
				: false;
			var prompt = "请选择";
			prompt += ingame ? "至多四名" : "至多三名";
			prompt += "要横置的角色";
			var range = ingame ? [1, 4] : [1, 3];
			player
				.chooseTarget(prompt, range, (card, player, target) => {
					return !target.isLinked();
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, { name: "tiesuo" }, player, player);
				});
			"step 1";
			if (result.bool && result.targets.length) {
				player.line(result.targets, "green");
				result.targets.sortBySeat();
				for (var i = 0; i < result.targets.length; i++) {
					result.targets[i].link();
				}
			}
		},
		xuanjian_card() {
			"step 0";
			event.ingame = game.hasPlayer(function (current) {
				return ["re_xushu", "xin_xushu", "xushu", "dc_xushu"].includes(current.name) || ["re_xushu", "xin_xushu", "xushu", "dc_xushu"].includes(current.name2);
			})
				? true
				: false;
			var prompt = "请选择一名角色，令其回复1点体力并摸一张牌";
			prompt += event.ingame ? "，然后你摸一张牌。" : "。";
			player.chooseTarget(prompt).set("ai", function (target) {
				var player = _status.event.player;
				return get.attitude(player, target) * (target.isDamaged() ? 2 : 1);
			});
			"step 1";
			if (result.bool && result.targets.length) {
				var target = result.targets[0];
				player.line(target, "thunder");
				target.draw();
				target.recover();
				if (event.ingame) player.draw();
			}
		},
		shuijing_card() {
			"step 0";
			event.ingame = game.hasPlayer(function (current) {
				return current.name == "simahui" || current.name2 == "simahui";
			})
				? true
				: false;
			var prompt = "将一名角色装备区中的";
			prompt += event.ingame ? "一张牌" : "防具牌";
			prompt += "移动到另一名角色的装备区中";
			var next = player.chooseTarget(2, function (card, player, target) {
				if (ui.selected.targets.length) {
					if (!_status.event.ingame) {
						var cards = ui.selected.targets[0].getEquips(2);
						return cards.some(card => target.canEquip(card));
					}
					var from = ui.selected.targets[0];
					if (target.isMin()) return false;
					var es = from.getCards("e");
					for (var i = 0; i < es.length; i++) {
						if (target.canEquip(es[i])) return true;
					}
					return false;
				} else {
					if (!event.ingame) {
						if (target.getEquips(2).length) return true;
						return false;
					}
					return target.countCards("e") > 0;
				}
			});
			next.set("ingame", event.ingame);
			next.set("ai", function (target) {
				var player = _status.event.player;
				var att = get.attitude(player, target);
				if (ui.selected.targets.length == 0) {
					if (att < 0) {
						if (
							game.hasPlayer(function (current) {
								if (get.attitude(player, current) > 0) {
									var es = target.getCards("e");
									for (var i = 0; i < es.length; i++) {
										if (current.canEquip(es[i])) return true;
									}
									return false;
								}
							})
						)
							return -att;
					}
					return 0;
				}
				if (att > 0) {
					var es = ui.selected.targets[0].getCards("e");
					var i;
					for (i = 0; i < es.length; i++) {
						if (target.canEquip(es[i])) break;
					}
					if (i == es.length) return 0;
				}
				return -att * get.attitude(player, ui.selected.targets[0]);
			});
			next.set("multitarget", true);
			next.set("targetprompt", ["被移走", "移动目标"]);
			next.set("prompt", prompt);
			"step 1";
			if (result.bool) {
				player.line2(result.targets, "green");
				event.targets = result.targets;
			} else event.finish();
			"step 2";
			game.delay();
			"step 3";
			if (targets.length == 2) {
				if (!event.ingame) {
					var cards = targets[0].getEquips(2);
					if (cards.length == 1)
						event._result = {
							bool: true,
							links: cards,
						};
					else {
						player
							.choosePlayerCard(
								"e",
								true,
								function (button) {
									return get.equipValue(button.link);
								},
								targets[0]
							)
							.set("targets0", targets[0])
							.set("targets1", targets[1])
							.set("filterButton", function (button) {
								if (!get.subtypes(button.link, false).includes("equip2")) return false;
								var targets1 = _status.event.targets1;
								return targets1.canEquip(button.link);
							});
					}
				} else {
					player
						.choosePlayerCard(
							"e",
							true,
							function (button) {
								return get.equipValue(button.link);
							},
							targets[0]
						)
						.set("targets0", targets[0])
						.set("targets1", targets[1])
						.set("filterButton", function (button) {
							var targets1 = _status.event.targets1;
							return targets1.canEquip(button.link);
						});
				}
			} else event.finish();
			"step 4";
			if (result.bool && result.links.length) {
				var link = result.links[0];
				if (get.position(link) == "e") event.targets[1].equip(link);
				else if (link.viewAs) event.targets[1].addJudge({ name: link.viewAs }, [link]);
				else event.targets[1].addJudge(link);
				event.targets[0].$give(link, event.targets[1], false);
				game.delay();
			}
		},
		audio: 5,
		enable: "phaseUse",
		usable: 1,
		prompt: "点击确定来选择要擦拭的宝物",
		chooseButton: {
			dialog() {
				var list = ["wolong", "fengchu", "xuanjian", "shuijing"];
				for (var i = 0; i < list.length; i++) {
					list[i] = ["", "", list[i] + "_card"];
				}
				return ui.create.dialog("评才", [list, "vcard"]);
			},
			check(button) {
				var name = button.link[2];
				var player = _status.event.player;
				if (name == "xuanjian_card") {
					if (
						game.hasPlayer(function (current) {
							return current.isDamaged() && current.hp < 3 && get.attitude(player, current) > 1;
						})
					)
						return 1 + Math.random();
					else return 1;
				} else if (name == "wolong_card") {
					if (
						game.hasPlayer(function (current) {
							return get.damageEffect(current, player, player, "fire") > 0;
						})
					)
						return 1.2 + Math.random();
					else return 0.5;
				} else return 0.6;
			},
			backup(links, player) {
				return {
					audio: "xinfu_pingcai1.mp3",
					filterCard: () => false,
					selectCard: -1,
					takara: links[0][2],
					content: lib.skill.xinfu_pingcai.contentx,
				};
			},
		},
		contentx() {
			"step 0";
			event.pingcai_delayed = true;
			var name = lib.skill.xinfu_pingcai_backup.takara;
			event.cardname = name;
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				game.pause();
				game.countChoose();
				event.timeout = setTimeout(function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
					};
					game.resume();
				}, 9000);
			};
			var createDialog = function (player, id, name) {
				if (player == game.me) return;
				var dialog = ui.create.dialog("forcebutton", "hidden");
				var str = get.translation(player) + "正在擦拭宝物上的灰尘…";
				var canSkip = !_status.connectMode;
				if (canSkip) str += "<br>（点击宝物可以跳过等待AI操作）";
				dialog.textPrompt = dialog.add('<div class="text center">' + str + "</div>");
				dialog.classList.add("fixed");
				dialog.classList.add("scroll1");
				dialog.classList.add("scroll2");
				dialog.classList.add("fullwidth");
				dialog.classList.add("fullheight");
				dialog.classList.add("noupdate");
				dialog.videoId = id;

				var canvas2 = document.createElement("canvas");
				dialog.canvas_viewer = canvas2;
				dialog.appendChild(canvas2);
				canvas2.classList.add("grayscale");
				canvas2.style.position = "absolute";
				canvas2.style.width = "249px";
				canvas2.style.height = "249px";
				canvas2.style["border-radius"] = "6px";
				canvas2.style.left = "calc(50% - 125px)";
				canvas2.style.top = "calc(50% - 125px)";
				canvas2.width = 249;
				canvas2.height = 249;
				canvas2.style.border = "3px solid";

				var ctx2 = canvas2.getContext("2d");
				var img = new Image();
				img.src = lib.assetURL + "image/card/" + name + ".png";
				img.onload = function () {
					ctx2.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas2.width, canvas2.height);
				};
				if (canSkip) {
					var skip = function () {
						if (event.pingcai_delayed) {
							delete event.pingcai_delayed;
							clearTimeout(event.timeout);
							event._result = {
								bool: true,
							};
							game.resume();
							canvas2.removeEventListener(lib.config.touchscreen ? "touchend" : "click", skip);
						}
					};
					canvas2.addEventListener(lib.config.touchscreen ? "touchend" : "click", skip);
				}
				dialog.open();
			};
			var chooseButton = function (id, name) {
				var event = _status.event;
				_status.xinfu_pingcai_finished = false;

				var dialog = ui.create.dialog("forcebutton", "hidden");
				dialog.textPrompt = dialog.add('<div class="text center">擦拭掉宝物上的灰尘吧！</div>');
				event.switchToAuto = function () {
					event._result = {
						bool: _status.xinfu_pingcai_finished,
					};
					game.resume();
					_status.imchoosing = false;
					_status.xinfu_pingcai_finished = true;
				};
				dialog.classList.add("fixed");
				dialog.classList.add("scroll1");
				dialog.classList.add("scroll2");
				dialog.classList.add("fullwidth");
				dialog.classList.add("fullheight");
				dialog.classList.add("noupdate");
				dialog.videoId = id;

				var canvas = document.createElement("canvas");
				var canvas2 = document.createElement("canvas");

				dialog.appendChild(canvas2);
				dialog.appendChild(canvas);

				canvas.style.position = "absolute";
				canvas.style.width = "249px";
				canvas.style.height = "249px";
				canvas.style["border-radius"] = "6px";
				canvas.style.left = "calc(50% - 125px)";
				canvas.style.top = "calc(50% - 125px)";
				canvas.width = 249;
				canvas.height = 249;
				canvas.style.border = "3px solid";

				canvas2.style.position = "absolute";
				canvas2.style.width = "249px";
				canvas2.style.height = "249px";
				canvas2.style["border-radius"] = "6px";
				canvas2.style.left = "calc(50% - 125px)";
				canvas2.style.top = "calc(50% - 125px)";
				canvas2.width = 249;
				canvas2.height = 249;
				canvas2.style.border = "3px solid";

				var ctx = canvas.getContext("2d");
				var ctx2 = canvas2.getContext("2d");

				var img = new Image();
				img.src = lib.assetURL + "image/card/" + name + ".png";
				img.onload = function () {
					ctx2.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas2.width, canvas2.height);
				};

				ctx.fillStyle = "lightgray";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				canvas.onmousedown = function (ev) {
					//if(_status.xinfu_pingcai_finished) return;
					canvas.onmousemove = function (e) {
						if (_status.xinfu_pingcai_finished) return;
						ctx.beginPath();
						ctx.clearRect(e.offsetX - 16, e.offsetY - 16, 32, 32);
						var data = ctx.getImageData(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8).data;
						var sum = 0;
						for (var i = 3; i < data.length; i += 4) {
							if (data[i] == 0) {
								sum++;
							}
						}
						if (sum >= canvas.width * canvas.height * 0.6) {
							//ctx.clearRect(0,0,canvas.width,canvas.height);
							if (!_status.xinfu_pingcai_finished) {
								_status.xinfu_pingcai_finished = true;
								event.switchToAuto();
							}
						}
					};
				};
				canvas.ontouchstart = function (ev) {
					//if(_status.xinfu_pingcai_finished) return;
					canvas.ontouchmove = function (e) {
						if (_status.xinfu_pingcai_finished) return;
						ctx.beginPath();
						var rect = canvas.getBoundingClientRect();
						var X = ((e.touches[0].clientX - rect.left) / rect.width) * canvas.width;
						var Y = ((e.touches[0].clientY - rect.top) / rect.height) * canvas.height;
						ctx.clearRect(X - 16, Y - 16, 32, 32);
						var data = ctx.getImageData(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8).data;
						var sum = 0;
						for (var i = 3; i < data.length; i += 4) {
							if (data[i] == 0) {
								sum++;
							}
						}
						if (sum >= canvas.width * canvas.height * 0.6) {
							if (!_status.xinfu_pingcai_finished) {
								_status.xinfu_pingcai_finished = true;
								event.switchToAuto();
							}
						}
					};
				};
				canvas.onmouseup = function (ev) {
					canvas.onmousemove = null;
				};
				canvas.ontouchend = function (ev) {
					canvas.ontouchmove = null;
				};

				dialog.open();

				game.pause();
				game.countChoose();
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId, name);
			if (event.isMine()) {
				chooseButton(event.videoId, name);
			} else if (event.isOnline()) {
				event.player.send(chooseButton, event.videoId, name);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			var result = event.result || result;
			if (!result) result = { bool: false };
			event._result = result;
			game.broadcastAll(
				function (id, result, player) {
					_status.xinfu_pingcai_finished = true;
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.textPrompt.innerHTML = '<div class="text center">' + (get.translation(player) + "擦拭宝物" + (result.bool ? "成功！" : "失败…")) + "</div>";
						if (result.bool && dialog.canvas_viewer) dialog.canvas_viewer.classList.remove("grayscale");
					}
					if (!_status.connectMode) delete event.pingcai_delayed;
				},
				event.videoId,
				result,
				player
			);
			game.delay(2.5);
			"step 2";
			game.broadcastAll("closeDialog", event.videoId);
			if (result.bool) {
				player.logSkill("pcaudio_" + event.cardname);
				event.insert(lib.skill.xinfu_pingcai[event.cardname], {
					player: player,
				});
			}
		},
		ai: {
			order: 7,
			fireAttack: true,
			threaten: 1.7,
			result: {
				player: 1,
			},
		},
	},
	xinfu_pdgyingshi: {
		mod: {
			targetEnabled(card, player, target) {
				if (get.type(card) == "delay") {
					return false;
				}
			},
		},
		trigger: {
			player: ["phaseZhunbeiBefore", "phaseJieshuBefore"],
		},
		forced: true,
		audio: 2,
		group: "xinfu_pdgyingshi2",
		content() {
			trigger.cancel();
			game.log(player, "跳过了", event.triggername == "phaseZhunbeiBefore" ? "准备阶段" : "结束阶段");
		},
	},
	xinfu_pdgyingshi2: {
		popup: false,
		trigger: {
			player: "phaseJudgeBefore",
		},
		forced: true,
		sourceSkill: "xinfu_pdgyingshi",
		content() {
			trigger.cancel();
			game.log(player, "跳过了判定阶段");
		},
	},
	pcaudio_wolong_card: {
		audio: "xinfu_pingcai2.mp3",
	},
	pcaudio_fengchu_card: {
		audio: "xinfu_pingcai3.mp3",
	},
	pcaudio_shuijing_card: {
		audio: "xinfu_pingcai4.mp3",
	},
	pcaudio_xuanjian_card: {
		audio: "xinfu_pingcai5.mp3",
	},
	yizan_use: {
		audio: "yizan_respond_shan",
		intro: {
			content: "已发动过#次",
		},
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (get.type(name) != "basic") return false;
			if (!player.storage.yizan && player.countCards("hes") < 2) return false;
			return player.hasCard(function (card) {
				return get.type(card) == "basic";
			}, "hs");
		},
		filter(event, player) {
			if (!player.storage.yizan && player.countCards("hes") < 2) return false;
			if (
				!player.hasCard(function (card) {
					return get.type(card) == "basic";
				}, "hs")
			)
				return false;
			for (var name of lib.inpile) {
				if (get.type(name) != "basic") continue;
				if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) return true;
				if (name == "sha") {
					for (var nature of lib.inpile_nature) {
						if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) return true;
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) != "basic") continue;
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
					if (name == "sha") {
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) list.push(["基本", "", "sha", nature]);
						}
					}
				}
				return ui.create.dialog("翊赞", [list, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				var card = { name: button.link[2], nature: button.link[3] };
				if (
					_status.event.getParent().type != "phase" ||
					game.hasPlayer(function (current) {
						return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})
				) {
					switch (button.link[2]) {
						case "tao":
						case "shan":
							return 5;
						case "jiu": {
							if (player.storage.yizan && player.countCards("hs", { type: "basic" }) > 2) return 3;
							return 0;
						}
						case "sha":
							if (button.link[3] == "fire") return 2.95;
							else if (button.link[3] == "thunder" || button.link[3] == "ice") return 2.92;
							else return 2.9;
					}
				}
				return 0;
			},
			backup(links, player) {
				return {
					audio: "yizan_respond_shan",
					filterCard(card, player, target) {
						if (player.storage.yizan) return get.type(card) == "basic";
						else if (ui.selected.cards.length) {
							if (get.type(ui.selected.cards[0]) == "basic") return true;
							return get.type(card) == "basic";
						}
						return true;
					},
					complexCard: true,
					selectCard() {
						var player = _status.event.player;
						if (player.storage.yizan) return 1;
						return 2;
					},
					check(card, player, target) {
						if (!ui.selected.cards.length && get.type(card) == "basic") return 6;
						else return 6 - get.value(card);
					},
					viewAs: { name: links[0][2], nature: links[0][3] },
					position: "hes",
					popname: true,
					precontent() {
						player.addMark("yizan_use", 1, false);
					},
				};
			},
			prompt(links, player) {
				var str = player.storage.yizan ? "一张基本牌" : "两张牌(其中至少应有一张基本牌)";
				return "将" + str + "当做" + get.translation(links[0][3] || "") + get.translation(links[0][2]) + "使用或打出";
			},
		},
		ai: {
			order() {
				var player = _status.event.player;
				var event = _status.event;
				if (event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0 && player.storage.yizan && player.countCards("hs", { type: "basic" }) > 2) {
					return 3.3;
				}
				return 3.1;
			},
			skillTagFilter(player, tag, arg) {
				if (tag == "fireAttack") return true;
				if (!player.storage.yizan && player.countCards("hes") < 2) return false;
				if (
					!player.hasCard(function (card) {
						return get.type(card) == "basic";
					}, "hes")
				) {
					return false;
				}
			},
			result: {
				player: 1,
			},
			respondSha: true,
			respondShan: true,
			fireAttack: true,
		},
	},
	yizan_respond_shan: {
		audio: 2,
	},
	xinfu_longyuan: {
		audio: 2,
		forced: true,
		unique: true,
		juexingji: true,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		skillAnimation: true,
		animationColor: "orange",
		filter(event, player) {
			return player.countMark("yizan_use") >= 3;
		},
		content() {
			player.awakenSkill("xinfu_longyuan");
			player.storage.yizan = true;
		},
		derivation: "yizan_rewrite",
		ai: {
			combo: "yizan_use",
		},
	},
	xinfu_jingxie: {
		audio: 2,
		video(player, info) {
			var l2 = player.getCards(info[0] ? "e" : "h"),
				l1 = info[1];
			for (var j = 0; j < l2.length; j++) {
				if (l2[j].suit == l1[0] && l2[j].number == l1[1] && l2[j].name == l1[2]) {
					l2[j].init([l2[j].suit, l2[j].number, "rewrite_" + l2[j].name]);
					break;
				}
			}
		},
		position: "he",
		enable: "phaseUse",
		filter(event, player) {
			var he = player.getCards("he");
			for (var i = 0; i < he.length; i++) {
				if (["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(he[i].name)) return true;
			}
			return false;
		},
		filterCard(card) {
			return ["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(card.name);
		},
		discard: false,
		lose: false,
		delay: false,
		check() {
			return 1;
		},
		content() {
			"step 0";
			player.showCards(cards);
			"step 1";
			var card = cards[0];
			var bool = get.position(card) == "e";
			if (bool) player.removeEquipTrigger(card.card || card);
			game.addVideo("skill", player, ["xinfu_jingxie", [bool, get.cardInfo(card)]]);
			game.broadcastAll(
				function (card, bool) {
					card.init([card.suit, card.number, "rewrite_" + card.name]);
					if (bool && card.card && player.vcardsMap?.equips) {
						const cardx = game.createCard("rewrite_" + card.card.name, card.card.suit, card.card.number);
						player.vcardsMap.equips[player.vcardsMap.equips.indexOf(card.card)] = cardx;
						card.card = cardx;
					}
				},
				card,
				bool
			);
			if (bool) player.addEquipTrigger(card.card || card);
		},
		ai: {
			basic: {
				order: 10,
			},
			result: {
				player: 1,
			},
		},
		group: ["xinfu_jingxie_recast"],
		subSkill: {
			recast: {
				audio: "xinfu_jingxie",
				enable: "chooseToUse",
				filterCard: (card, player) => get.subtype(card) == "equip2" && player.canRecast(card),
				filter: (event, player) => {
					if (event.type != "dying") return false;
					if (player != event.dying) return false;
					return player.hasCard(card => lib.skill.xinfu_jingxie.subSkill.recast.filterCard(card, player), "he");
				},
				position: "he",
				discard: false,
				lose: false,
				delay: false,
				prompt: "重铸一张防具牌，然后将体力回复至1点。",
				content() {
					"step 0";
					player.recast(cards);
					"step 1";
					var num = 1 - player.hp;
					if (num) player.recover(num);
				},
				ai: {
					order: 0.5,
					skillTagFilter(player, arg, target) {
						if (player != target) return false;
						return player.hasCard(card => (_status.connectMode && get.position(card) == "h") || (get.subtype(card) == "equip2" && player.canRecast(card)), "he");
					},
					save: true,
					result: {
						player(player) {
							return 10;
						},
					},
				},
			},
		},
	},
	xinfu_qiaosi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			if (get.isLuckyStar(player)) {
				event.num = 6;
				player.throwDice(6);
			} else player.throwDice();
			"step 1";
			event.cards = get.cards(event.num);
			player.showCards(event.cards);
			"step 2";
			player.gain(event.cards, "gain2");
			player
				.chooseControl()
				.set("choiceList", ["将" + get.cnNumber(event.num) + "张牌交给一名其他角色", "弃置" + get.cnNumber(event.num) + "张牌"])
				.set("ai", function () {
					if (
						game.hasPlayer(function (current) {
							return current != player && get.attitude(player, current) > 2;
						})
					)
						return 0;
					return 1;
				});
			"step 3";
			if (result.index == 0) {
				player.chooseCardTarget({
					position: "he",
					filterCard: true,
					selectCard: event.num,
					filterTarget(card, player, target) {
						return player != target;
					},
					ai1(card) {
						return 1;
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						return att;
					},
					prompt: "请选择要送人的卡牌",
					forced: true,
				});
			} else {
				player.chooseToDiscard(event.num, true, "he");
				event.finish();
			}
			"step 4";
			if (result.bool) {
				var target = result.targets[0];
				player.give(result.cards, target);
			}
		},
		ai: {
			order: 7.5,
			result: {
				player: 1,
			},
		},
	},
	zhaohuo: {
		audio: 2,
		audioname: ["re_taoqian"],
		trigger: { global: "dying" },
		forced: true,
		//priority:12,
		filter(event, player) {
			return event.player != player && player.maxHp > 1;
		},
		content() {
			"step 0";
			event.num = player.maxHp - 1;
			player.loseMaxHp(event.num, true);
			"step 1";
			player.draw(event.num);
		},
		ai: {
			neg: true,
		},
	},
	yixiang: {
		audio: 2,
		audioname: ["re_taoqian"],
		trigger: { target: "useCardToTargeted" },
		frequent: true,
		filter(event, player) {
			if (event.player.hp <= player.hp) return false;
			//if(event.targets.length>1) return false;
			var hs = player.getCards("h");
			var names = ["sha", "shan", "tao", "jiu", "du"];
			for (var i = 0; i < hs.length; i++) {
				names.remove(hs[i].name);
			}
			if (!names.length) return false;
			for (var i = 0; i < ui.cardPile.childElementCount; i++) {
				if (names.includes(ui.cardPile.childNodes[i].name)) {
					return true;
				}
			}
			return false;
		},
		usable: 1,
		content() {
			var hs = player.getCards("h");
			var list = [];
			var names = ["sha", "shan", "tao", "jiu", "du"];
			for (var i = 0; i < hs.length; i++) {
				names.remove(hs[i].name);
			}
			for (var i = 0; i < ui.cardPile.childElementCount; i++) {
				if (names.includes(ui.cardPile.childNodes[i].name)) {
					list.push(ui.cardPile.childNodes[i]);
				}
			}
			if (list.length) {
				player.gain(list.randomGet(), "draw");
			}
		},
	},
	yirang: {
		audio: 2,
		audioname: ["re_taoqian"],
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			if (
				!player.countCards("he", function (card) {
					return get.type(card) != "basic";
				})
			) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current.maxHp > player.maxHp;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("yirang"), function (card, player, target) {
					return target.maxHp > player.maxHp;
				})
				.set("ai", function (target) {
					return (get.attitude(_status.event.player, target) - 2) * target.maxHp;
				});
			"step 1";
			if (result.bool) {
				var cards = player.getCards("he", function (card) {
					return get.type(card) != "basic";
				});
				var target = result.targets[0];
				var types = [];
				for (var i = 0; i < cards.length; i++) {
					types.add(get.type(cards[i], "trick"));
				}
				player.logSkill("yirang", target);
				player.give(cards, target);
				player.gainMaxHp(target.maxHp - player.maxHp, true);
				player.recover(types.length);
				game.delay();
			}
		},
	},
	kuangcai: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return !event.player.isMad();
		},
		content() {
			game.broadcastAll(function (player) {
				player.forceCountChoose = { phaseUse: 5 };
			}, player);
			player.addSkill("kuangcai_use");
			player.addSkill("kuangcai_cancel");
			//ui.auto.hide();
		},
		subSkill: {
			use: {
				mod: {
					cardUsable(card) {
						if (get.info(card) && get.info(card).forceUsable) return;
						return Infinity;
					},
					targetInRange() {
						return true;
					},
					aiOrder(player, card, num) {
						var name = get.name(card);
						if (name == "tao") return num + 7 + Math.pow(player.getDamagedHp(), 2);
						if (name == "sha") return num + 6;
						if (get.subtype(card) == "equip2") return num + get.value(card) / 3;
					},
				},
				trigger: { player: "useCard" },
				forced: true,
				charlotte: true,
				silent: true,
				popup: false,
				filter(event, player) {
					if (!player.forceCountChoose || !player.forceCountChoose.phaseUse) {
						return false;
					}
					return true;
				},
				content() {
					player.draw();
					if (player.forceCountChoose.phaseUse == 1) {
						var evt = event.getParent("phaseUse");
						if (evt) evt.skipped = true;
					} else
						game.broadcastAll(function (player) {
							player.forceCountChoose.phaseUse--;
						}, player);
				},
			},
			cancel: {
				trigger: { player: "phaseUseEnd" },
				firstDo: true,
				silent: true,
				charlotte: true,
				content() {
					game.broadcastAll(function (player) {
						delete player.forceCountChoose;
					}, player);
					//ui.auto.show();
					player.removeSkill("kuangcai_use");
					player.removeSkill("kuangcai_cancel");
				},
			},
		},
		ai: {
			threaten: 4.5,
		},
	},
	shejian: {
		audio: 2,
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		filter(event, player) {
			var cards = [];
			player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) cards.addArray(evt.cards2);
			});
			if (cards) {
				if (cards.length < 2) return false;
				var suits = [];
				for (var i = 0; i < cards.length; i++) {
					var suit = get.suit(cards[i]);
					if (suits.includes(suit)) {
						return false;
					} else {
						suits.push(suit);
					}
				}
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("shejian"), "弃置一名其他角色的一张牌", function (card, player, target) {
				if (player == target) return false;
				return target.countDiscardableCards(player, "he") > 0;
			}).ai = function (target) {
				return -get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("shejian", result.targets);
				player.discardPlayerCard(result.targets[0], "he", true);
			} else {
				event.finish();
			}
		},
	},
	shixin: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event) {
			return event.hasNature("fire");
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			nofire: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "fireDamage")) return "zeroplayertarget";
				},
			},
		},
	},
	fenyin: {
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && player == _status.currentPhase) {
					var evt = player.getLastUsed();
					if (evt && evt.card && get.color(evt.card) != "none" && get.color(card) != "none" && get.color(evt.card) != get.color(card)) {
						return num + 10;
					}
				}
			},
		},
		audio: 2,
		trigger: { player: "useCard" },
		frequent: true,
		//usable:3,
		filter(event, player) {
			if (_status.currentPhase != player) return false;
			var color2 = get.color(event.card);
			player.addTip("fenyin", "奋音 " + get.translation(color2), true);
			var evt = player.getLastUsed(1);
			if (!evt) return false;
			var color1 = get.color(evt.card);
			return color1 && color2 && color1 != "none" && color2 != "none" && color1 != color2;
		},
		content() {
			player.draw();
		},
		ai: {
			threaten: 3,
		},
	},
	dujin: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		frequent: true,
		preHidden: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			trigger.num += 1 + Math.ceil(player.countCards("e") / 2);
		},
	},
	yingjian: {
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		audio: "qingyi",
		content() {
			player.chooseUseTarget("###是否发动【影箭】？###视为使用一张没有距离限制的【杀】", { name: "sha" }, false, "nodistance").logSkill = "yingjian";
		},
		ai: {
			threaten(player, target) {
				return 1.6;
			},
		},
	},
	tunchu: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		frequent: true,
		preHidden: true,
		locked: false,
		filter(event, player) {
			if (event.numFixed || player.getExpansions("tunchu").length) return false;
			return true;
		},
		content() {
			trigger.num += 2;
			player.addTempSkill("tunchu_choose", "phaseDrawAfter");
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		mod: {
			cardEnabled(card, player) {
				if (player.getExpansions("tunchu").length && card.name == "sha") {
					return false;
				}
			},
		},
		subSkill: {
			choose: {
				trigger: { player: "phaseDrawEnd" },
				forced: true,
				popup: false,
				charlotte: true,
				content() {
					"step 0";
					player.removeSkill("tunchu_choose");
					var nh = player.countCards("h");
					if (nh) {
						player.chooseCard("h", [1, nh], "将任意张手牌置于你的武将牌上").set("ai", function (card) {
							var player = _status.event.player;
							var count = game.countPlayer(function (current) {
								return get.attitude(player, current) > 2 && current.hp - current.countCards("h") > 1;
							});
							if (ui.selected.cards.length >= count) return -get.value(card);
							return 5 - get.value(card);
						});
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("tunchu");
					}
				},
			},
		},
	},
	shuliang: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.getExpansions("tunchu").length > 0 && event.player.countCards("h") < event.player.hp && event.player.isIn();
		},
		content() {
			"step 0";
			var goon = get.attitude(player, trigger.player) > 0;
			player
				.chooseCardButton(get.prompt("shuliang", trigger.player), player.getExpansions("tunchu"))
				.set("ai", function () {
					if (_status.event.goon) return 1;
					return 0;
				})
				.set("goon", goon);
			"step 1";
			if (result.bool) {
				player.logSkill("shuliang", trigger.player);
				player.loseToDiscardpile(result.links);
				trigger.player.draw(2);
			}
		},
		ai: { combo: "tunchu" },
	},
	choulve: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("he");
			});
		},
		async cost(event, trigger, player) {
			let str = "令一名其他角色交给你一张牌";
			const history = player.getAllHistory("damage", function (evt) {
				return evt.card && evt.card.name && lib.card[evt.card.name];
			});
			if (history.length) event.cardname = history[history.length - 1].card.name;
			if (event.cardname) {
				str += "。若其如此做，视为你使用【" + get.translation(event.cardname) + "】";
			}
			let goon = true;
			if (event.cardname) {
				goon = game.hasPlayer(function (current) {
					return player.canUse(event.cardname, current) && get.effect(current, { name: event.cardname }, player, player) > 0;
				});
			}
			const result = await player
				.chooseTarget(get.prompt("choulve"), str, function (card, player, target) {
					return target != player && target.countCards("he");
				})
				.set("ai", function (target) {
					const event = get.event();
					if (!event.goon) return 0;
					var player = event.player;
					if (get.attitude(player, target) >= 0 && get.attitude(target, player) >= 0) {
						return Math.sqrt(target.countCards("he"));
					}
					return 0;
				})
				.set("goon", goon)
				.forResult();
			if (result.bool) {
				result.cost_data = { cardname: event.cardname };
				event.result = result;
			}
		},
		content() {
			"step 0";
			event.cardname = event.cost_data.cardname;
			var target = targets[0];
			target
				.chooseCard("he", "是否交给" + get.translation(player) + "一张牌？", event.cardname ? "若如此做，视为" + get.translation(player) + "使用【" + get.translation(event.cardname) + "】" : null)
				.set("ai", function (card) {
					if (_status.event.goon) return 7 - get.value(card);
					return 0;
				})
				.set("goon", get.attitude(target, player) > 1);
			event.target = target;
			"step 1";
			if (result.bool) {
				event.target.give(result.cards, player);
				if (event.cardname) {
					player.chooseUseTarget(event.cardname, true, false);
				}
			}
		},
	},
	polu: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			if (!lib.inpile.includes("ly_piliche")) return true;
			return !!get.cardPile(function (card) {
				return card.name == "ly_piliche";
			});
		},
		content() {
			var card;
			if (!lib.inpile.includes("ly_piliche")) {
				card = game.createCard2("ly_piliche", "diamond", 1);
				lib.inpile.push("ly_piliche");
			} else
				card = get.cardPile(function (card) {
					return card.name == "ly_piliche";
				});
			player.chooseUseTarget(card, true, "nopopup");
		},
		group: "polu_damage",
		subSkill: {
			damage: {
				audio: "polu",
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return !player.getEquips("ly_piliche").length;
				},
				content() {
					"step 0";
					event.count = trigger.num;
					"step 1";
					event.count--;
					player.draw();
					"step 2";
					var card = get.cardPile2(function (card) {
						return get.subtype(card, false) == "equip1" && player.canUse(card, player);
					});
					if (card) player.chooseUseTarget(card, true, "nopopup");
					"step 3";
					if (event.count > 0 && !player.getEquips("ly_piliche").length) event.goto(1);
				},
			},
		},
	},
	ly_piliche: {
		equipSkill: true,
		trigger: { source: "damageSource" },
		check(event, player) {
			return get.attitude(player, event.player) * get.value(event.player.getDiscardableCards(player, "e"), event.player) <= 0;
		},
		filter(event, player) {
			return player != event.player && event.player.countDiscardableCards(player, "e") > 0;
		},
		logTarget: "player",
		content() {
			player.discardPlayerCard(trigger.player, "e", true, trigger.player.countCards("e"));
		},
	},
};

export default skills;
