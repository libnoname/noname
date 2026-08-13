import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//青史刘璿
	hssifen: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.hasCard(cardx => target.hasUseTarget(get.autoViewAs({ name: "juedou" }, [cardx]), false, false), "hs") && target != player;
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (!target.hasCard(cardx => target.hasUseTarget(get.autoViewAs({ name: "juedou" }, [cardx]), false, false), "hs")) {
				return;
			}
			const next = target.chooseToUse();
			next.set("openskilldialog", `俟奋：将任意张手牌当作【决斗】使用`);
			next.set("norestore", true);
			next.set("_backupevent", "hssifen_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("hssifen_backup");
			next.set("targetRequired", true);
			next.set("complexSelect", true);
			next.set("addCount", false);
			next.set("forced", true);
			const result = await next.forResult();
			await player.draw(2);
			player.addTempSkill("hssifen_viewAs", ["phaseChange", "phaseAfter", "phaseBeforeStart"]);
			player.storage.hssifen_viewAs[target.playerid] = result.cards.length;
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					const juedou = new lib.element.VCard({ name: "juedou", isCard: true });
					return target.getUseValue(juedou) * Math.sqrt(target.countCards("h"));
				},
			},
		},
		subSkill: {
			backup: {
				filterCard(card, player) {
					return get.itemtype(card) == "card";
				},
				position: "hs",
				viewAs: {
					name: "juedou",
				},
				selectCard: [1, Infinity],
				ai1(card) {
					if (ui.selected.cards.length) {
						return 0;
					}
					return 5 - get.value(card);
				},
				log: false,
			},
			viewAs: {
				init(player, skill) {
					player.storage[skill] = {};
				},
				onremove: true,
				charlotte: true,
				enable: "phaseUse",
				viewAsFilter(player) {
					return player.countCards("hes", lib.skill.hssifen_viewAs.filterCard) > 0;
				},
				filterCard: {
					color: "red",
				},
				complexCard: true,
				selectCard() {
					const map = get.player()?.storage.hssifen_viewAs;
					if (map && Object.keys(map)?.length) {
						let maxCard = Object.keys(map).maxBy(i => map[i]),
							minCard = Object.keys(map).minBy(i => map[i]);
						if (maxCard && minCard) {
							return [map[minCard], map[maxCard]];
						}
					}
					return [1, Infinity];
				},
				prompt() {
					let str = "将指定张红色牌当决斗对【俟奋】目标使用";
					const map = get.player()?.storage.hssifen_viewAs;
					if (map) {
						let list = [];
						for (const id in map) {
							const target = game.findPlayer(current => current.playerid == id);
							if (target) {
								list.push(`${get.translation(target)}：${map[id]}`);
							}
						}
						if (list.length) {
							str += `<br><span class="text" style="font-family: yuanli">${list.join(" ")}</span>`;
						}
					}
					return str;
				},
				filterTarget(card, player, target) {
					const ids = Object.keys(player.storage.hssifen_viewAs);
					if (!ids.includes(target.playerid)) {
						return false;
					}
					if (ui.selected.cards.length != player.storage.hssifen_viewAs[target.playerid]) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				},
				viewAs: {
					name: "juedou",
				},
				position: "hes",
				check(card) {
					return 6 - get.value(card);
				},
			},
		},
	},
	hsfunan: {
		zhuSkill: true,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (
				player.hasSkill("hsfunan_used") ||
				!player.hasZhuSkill("hsfunan") ||
				!game.hasPlayer(function (current) {
					return current != player && current.group == "shu";
				})
			) {
				return false;
			}
			return !event.hsfunan;
		},
		viewAs: { name: "sha" },
		filterCard: () => false,
		selectCard: -1,
		group: ["hsfunan_2"],
		derivation: "rejijiang",
		ai: {
			order(item, player) {
				const order = get.order({ name: "sha" });
				_status.debugger = _status.event;
				if (order <= 0) {
					return order;
				}
				const losehp = get.effect(player, { name: "losehp" }, player, player);
				if (losehp > 0) {
					return order + 0.3;
				}
				if (player.hp <= 1) {
					// 避免苦肉死
					return 0;
				}
				const draw = 2 * get.effect(player, { name: "draw" }, player, player);
				if (losehp + draw > 0) {
					// 即使不出杀收益也够了
					return order + 0.1;
				}
				const eff = player.getUseValue({ name: "sha" }, null, true);
				if (eff <= 0) {
					return 0;
				}
				const maySha = Math.max(
					...game
						.filterPlayer(current => {
							return player !== current && current.group === "shu" && get.attitude(player, current) > 0;
						})
						.map(current => {
							return current.mayHaveSha(player, _status.event?.name === "chooseToUse" ? "use" : "respond", null, "count");
						})
				);
				if (maySha < 1 && (1 - maySha) * losehp + draw < 0) {
					// 有概率出杀但不值得崩血
					return 0;
				}
				return order + 0.3;
			},
			respondSha: true,
			skillTagFilter(player) {
				if (
					!player.hasZhuSkill("hsfunan") ||
					!game.hasPlayer(function (current) {
						return current != player && current.group == "shu";
					})
				) {
					return false;
				}
			},
		},
		subSkill: {
			2: {
				trigger: { player: ["useCardBegin", "respondBegin"] },
				filter(event, player) {
					return event.skill == "hsfunan";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.addTempSkill("hsfunan_used");
					const targets = game.filterPlayer(target => target != player && target.group == "shu");
					if (!targets.length) {
						return;
					}
					player.logSkill("rejijiang", targets);
					trigger.getParent().set("hsfunan", true);
					let responded = false;
					for (let target of targets.sortBySeat()) {
						const next = target.chooseToRespond("是否替" + get.translation(player) + "打出一张杀？", { name: "sha" });
						next.set("ai", function () {
							var event = _status.event;
							return get.attitude(event.player, event.source) - 2;
						});
						next.set("source", player);
						next.set("hsfunan", true);
						next.set("skillwarn", "替" + get.translation(player) + "打出一张杀");
						next.noOrdering = true;
						next.autochoose = lib.filter.autoRespondSha;
						const result = await next.forResult();
						if (result.bool) {
							trigger.card = result.card;
							trigger.cards = result.cards;
							trigger.throw = false;
							if (typeof target.ai.shown == "number" && target.ai.shown < 0.95) {
								target.ai.shown += 0.3;
								if (target.ai.shown > 0.95) {
									target.ai.shown = 0.95;
								}
							}
							responded = true;
							break;
						}
					}
					if (!responded) {
						await player.loseHp();
						await player.draw(2);
						trigger.cancel();
						trigger.getParent().goto(0);
					}
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	//青史曹奂
	hsjunwei: {
		enable: "chooseToUse",
		usable: 1,
		filterCard(card) {
			if (!ui.selected.cards.length) {
				return true;
			}
			return get.color(card) == get.color(ui.selected.cards[0]);
		},
		viewAsFilter(player) {
			return player.countCards("hes") > 1;
		},
		viewAs: {
			name: "wuxie",
			storage: {
				hsjunwei: true,
			},
		},
		selectCard: 2,
		position: "hes",
		prompt: "将一张两张颜色相同的牌当无懈可击使用",
		check(card) {
			return 8 - get.value(card);
		},
		group: ["hsjunwei_effect"],
		subSkill: {
			effect: {
				trigger: { player: "useCardToEnd" },
				filter(event, player) {
					if (event.card.name != "wuxie" || !event.card?.storage?.hsjunwei || event.getParent()._neutralized) {
						return false;
					}
					const card = event.getParent().respondTo?.[1],
						evt = event.getParent(6);
					if (!card) {
						return false;
					}
					const info = get.info(card);
					const bool1 = evt.targets && info.allowMultiple != false && !info.multitarget;
					const bool2 = game.hasPlayer(function (target) {
						return !evt.targets?.includes(target) && lib.filter.targetEnabled2(card, evt.player, target);
					});
					event.set("respondToEvent", evt);
					return bool1 && bool2;
				},
				async cost(event, trigger, player) {
					const evt = trigger.respondToEvent,
						targets = evt.targets,
						source = evt.player,
						card = evt.card;
					event.result = await player
						.chooseTarget(`###${get.prompt("hsjunwei")}###令至多两名角色也成为${get.translation(card)}的目标`, [1, 2], (card, player, target) => {
							return !get.event().targets.includes(target) && lib.filter.targetEnabled2(get.event().card, get.event().sourcex, target);
						})
						.set("targets", targets)
						.set("sourcex", source)
						.set("card", card)
						.set("ai", target => {
							return get.effect(target, get.event().card, get.event().sourcex, get.player());
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const evt = trigger.respondToEvent,
						targets = event.targets.sortBySeat(evt.player);
					evt.targets.addArray(targets);
					game.log(targets, "也成为", evt.card, "的目标");
				},
			},
		},
	},
	hsmoran: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.num > 0;
		},
		async content(event, trigger, player) {
			const list = [1, 2, 3];
			const result = await player
				.chooseControl(list)
				.set("prompt", `默然：你选择于一至三个回合结束后（包含此回合）摸两倍所选回合数量的牌，在此期间中你的所有技能失效。`)
				.set("ai", () => get.rand(0, 2))
				.forResult();
			if (result?.control) {
				const skill = event.name + "_draw",
					num = result.control;
				player.addMark(skill, num, false);
				player.storage[skill + "_num"] = num * 2;
				player.addSkill(skill);
				player.addTempSkill("baiban", { player: "dieAfter" });
			}
		},
		subSkill: {
			draw: {
				onremove(player, skill) {
					delete player.storage[skill];
					delete player.storage[skill + "_num"];
					player.removeSkill("baiban");
				},
				trigger: { global: "phaseEnd" },
				charlotte: true,
				direct: true,
				filter(event, player) {
					return player.hasMark("hsmoran_draw");
				},
				content() {
					player.removeMark(event.name, 1, false);
					if (!player.hasMark(event.name)) {
						const num = player.storage[event.name + "_num"];
						player.logSkill("hsmoran");
						player.removeSkill(event.name);
						player.draw(num);
					}
				},
				mark: true,
				intro: {
					content(storage, player, skill) {
						return `${storage}个回合结束后你摸${player.storage[skill + "_num"]}张牌`;
					},
				},
			},
		},
	},
	//青史刘协
	hsjixu: {
		enable: "phaseUse",
		filterTarget(card, player, target) {
			const storage = player.getStorage("hsjixu_used"),
				selected = ui.selected.targets;
			if (!selected.length) {
				return true;
			}
			const targets = selected.concat([target]).sortBySeat();
			return !storage.some(targetsx => targetsx.sortBySeat().every((targetx, index) => targetx == targets[index]));
		},
		selectTarget: 2,
		multiline: true,
		multitarget: true,
		complexTarget: true,
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat(),
				num1 = targets.reduce((sum, target) => (sum += target.countCards("h")), 0),
				others = game.filterPlayer().removeArray(targets);
			let goon = true;
			player.addTempSkill(event.name + "_used", ["phaseChange", "phaseAfter", "phaseBeforeStart"]);
			player.markAuto(event.name + "_used", [[...targets]]);
			if (!others.length) {
				goon = true;
			}
			if (others.length == 1 && others[0].countCards("h") <= num1) {
				goon = false;
			}
			if (others.length > 1) {
				for (let i = 0; i < others.length; i++) {
					for (let j = i + 1; j < others.length; j++) {
						if (others[i].countCards("h") + others[j].countCards("h") <= num1) {
							goon = false;
						}
					}
				}
			}
			if (!goon) {
				player.popup("杯具");
				return;
			} else {
				player.popup("洗具");
				if (_status.connectMode) {
					game.broadcastAll(() => (_status.noclearcountdown = true));
				}
				const cards = get.cards(3, true),
					map = {};
				while (cards.length) {
					const result = await player
						.chooseButtonTarget({
							createDialog: [`济恤：请选择要分配的牌和目标`, cards],
							forced: true,
							selectButton: [1, 2],
							cardsx: cards,
							targets: targets,
							map: map,
							filterTarget(card, player, target) {
								return get.event().targets.includes(target);
							},
							ai1(button) {
								const { player, map } = get.event();
								return Math.max(
									...game.filterPlayer().map(target => {
										return [...ui.selected.cards, button.link, ...(map[target.playerid] || [])].reduce((sum, card) => {
											return get.value(card, target) * get.attitude(player, target);
										}, 0);
									})
								);
							},
							ai2(target) {
								const player = get.player();
								const card = ui.selected.buttons[0].link;
								if (card) {
									return get.value(card, target) * get.attitude(player, target);
								}
								return 0;
							},
						})
						.forResult();
					if (result?.bool && result.targets?.length && result.links?.length) {
						cards.removeArray(result.links);
						const id = result.targets[0].playerid;
						if (!map[id]) {
							map[id] = [];
						}
						map[id].addArray(result.links);
					} else {
						break;
					}
					const nogain = targets.filter(target => !map[target.playerid]?.length);
					if (cards.length == 1 && nogain.length > 0) {
						map[nogain[0].playerid] = [cards.pop()];
					}
				}
				if (_status.connectMode) {
					game.broadcastAll(() => {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				if (Object.keys(map).length) {
					const gain_list = [];
					for (const i in map) {
						const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						player.line(source, "green");
						gain_list.push([source, map[i]]);
						game.log(source, "获得了", map[i]);
					}
					await game
						.loseAsync({
							gain_list: gain_list,
							giver: player,
							animate: "gain2",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target: 1,
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content(storage, player, skill) {
						let str = "已触发过的组合：";
						if (!storage.length) {
							str += "无";
						} else {
							for (const targets of storage) {
								str += `<br><li>${get.translation(targets)}`;
							}
						}
						return str;
					},
				},
			},
		},
	},
	hsyouchong: {
		enable: "chooseToUse",
		usable: 1,
		filter(event, player) {
			if (event.responded || event.hsyouchong || !game.hasPlayer(target => target.countCards("h") > player.countCards("h"))) {
				return false;
			}
			const list = get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			});
			return list.length > 0;
		},
		hiddenCard(player, name) {
			if (get.type(name) == "basic" && lib.inpile.includes(name) && game.hasPlayer(target => target.countCards("h") > player.countCards("h"))) {
				return true;
			}
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("优崇", [list, "vcard"], "hidden");
			},
			filter(button, player) {
				return get.event().getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, get.event().getParent());
			},
			backup(links, player) {
				return {
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					log: false,
					async precontent(event, trigger, player) {
						if (!game.hasPlayer(target => target.countCards("h") > player.countCards("h"))) {
							return;
						}
						const skill = "hsyouchong",
							cards = event.result.cards,
							card = get.autoViewAs(event.result.card, "unsure");
						const result = await player
							.chooseTarget(`优崇：令任意名手牌数多于你的角色选择是否将三张牌当作${get.translation(card)}替你使用`, [1, Infinity], true, (card, player, target) => {
								return target.countCards("h") > player.countCards("h");
							})
							.set("ai", target => true)
							.forResult();
						if (!result?.targets) {
							return;
						}
						const targets = result.targets.sortBySeat();
						player.logSkill(skill, targets);
						let goon = false;
						for (let target of targets) {
							const resultx = await target
								.chooseCard(`优崇：是否将三张牌当作${get.translation(card)}替${get.translation(player)}使用`, 3)
								.set("ai", card => {
									if (get.event().att) {
										return 7 - get.value(card);
									}
									return 0;
								})
								.set("att", get.attitude(target, player) > 0)
								.forResult();
							if (resultx?.cards?.length) {
								target.popup("响应");
								goon = true;
								if (typeof target.ai.shown == "number" && target.ai.shown < 0.95) {
									target.ai.shown += 0.3;
									if (target.ai.shown > 0.95) {
										target.ai.shown = 0.95;
									}
								}
								event.result.cards = resultx.cards;
							}
						}
						if (!goon) {
							var evt = event.getParent();
							evt.set(skill, true);
							evt.goto(0);
							return;
						}
					},
				};
			},
			prompt(links, player) {
				const name = links[0][2];
				const nature = links[0][3];
				return "选择" + (get.translation(nature) || "") + get.translation(name) + "的目标";
			},
		},
	},
	//青史孙皓
	hsshezuo: {
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			const list = lib.skill[event.skill].effectList.slice(),
				controls = [1, 2, 3].map(num => "选项" + get.cnNumber(num, true));
			const result = await player
				.chooseControl(controls, "cancel2")
				.set("choiceList", list)
				.set("prompt", `###${get.prompt(event.skill)}###选择一项令本回合下次拼点结束后没赢的角色执行`)
				.set("ai", () => get.rand(2))
				.forResult();
			if (result?.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.index,
				};
			}
		},
		async content(event, trigger, player) {
			const index = event.cost_data;
			player.addTempSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", index);
		},
		effectList: [`依次弃置两张牌，不足则失去等量体力；`, `横置并受到1点火焰伤害`, `将所有手牌当一张普通锦囊牌使用`],
		group: ["hsshezuo_compare"],
		subSkill: {
			compare: {
				prompt: "摸一张牌与一名其他角色进行拼点",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return game.hasPlayer(target => player.canCompare(target, true));
				},
				filterTarget(card, player, target) {
					return player.canCompare(target, true);
				},
				async content(event, trigger, player) {
					const target = event.target;
					await player.draw();
					if (player.canCompare(target)) {
						await player.chooseToCompare(target);
					}
				},
				ai: {
					order: 9,
					result: {
						target(player, target) {
							return -1;
						},
					},
				},
			},
			effect: {
				onremove: true,
				charlotte: true,
				forced: true,
				intro: {
					content(storage, player) {
						const list = lib.skill.hsshezuo.effectList.slice();
						let str = "下次拼点结束后没赢的角色须执行：";
						if (!storage.length) {
							str += "无";
						} else {
							storage.forEach(index => (str += `<br><li>${list[index]}`));
						}
						return str;
					},
				},
				trigger: {
					global: ["chooseToCompareAfter", "compareMultipleAfter"],
				},
				filter(event, player, name, target) {
					if (event.preserve || event.result?.cancelled) {
						return false;
					}
					if (!lib.skill.hsshezuo_effect.logTarget(event, player).length) {
						return false;
					}
					if (event.name == "compareMultiple") {
						return true;
					}
					return !event.compareMultiple;
				},
				logTarget(event, player) {
					let list = [];
					if (event.targets?.length) {
						list.addArray([event.player].concat(event.targets).filter(target => target != event.result?.winner));
					} else {
						list.addArray([event.player, event.target].filter(target => target != event.result?.winner));
					}
					return list.sortBySeat();
				},
				async content(event, trigger, player) {
					const { targets } = event,
						storage = player.getStorage(event.name);
					player.removeSkill(event.name);
					for (let target of targets) {
						if (storage.includes(0)) {
							let count = 2;
							while (target.countDiscardableCards(target, "he") && count > 0) {
								await target.chooseToDiscard("he", true);
								count--;
							}
							if (count > 0) {
								await target.loseHp(count);
							}
						}
						if (storage.includes(1)) {
							await target.link(true);
							await target.damage("fire");
						}
						if (storage.includes(2)) {
							if (!target.countCards("h")) {
								continue;
							}
							const list = get.inpileVCardList(info => info[0] == "trick"),
								hs = target.getCards("h");
							if (!list.some(info => target.hasUseTarget(get.autoViewAs({ name: info[2] }, hs), true, false))) {
								continue;
							}
							const result = await target
								.chooseButton([`设座：将所有手牌当作一张普通锦囊牌使用`, [list, "vcard"]], true)
								.set("filterButton", button => get.player().hasUseTarget(get.event().viewAs(button), true, false))
								.set("ai", button => get.player().getUseValue(get.event().viewAs(button)))
								.set("viewAs", button => get.autoViewAs({ name: button.link[2] }, get.player().getCards("h")))
								.forResult();
							if (result?.links?.length) {
								const name = result.links[0][2],
									card = get.autoViewAs({ name: name }, hs);
								await target.chooseUseTarget(card, hs, true, false);
							}
						}
					}
				},
			},
		},
	},
	//陈寿
	//用扑克牌打牌神将
	poker_record: {
		mark: true,
		marktext: "🃏",
		intro: {
			name: "扑克牌堆",
			markcount(storage, player) {
				const pile = _status.pokerPile,
					discarded = _status.pokerDiscarded;
				if (!pile || !discarded) {
					return 0;
				}
				return "" + (discarded.length || 0) + "/" + (pile.length || 0);
			},
			mark(dialog, storage, player) {
				const pile = _status.pokerPile,
					discarded = _status.pokerDiscarded;
				if (pile.length) {
					dialog.addText("牌堆");
					dialog.addText(`共${pile.length}张牌`);
				}
				if (discarded.length) {
					dialog.addText("弃牌堆");
					dialog.addSmall(discarded);
				}
				if (!pile.length && !discarded.length) {
					dialog.addText("空空如也");
				}
			},
		},
		charlotte: true,
	},
	hschenzhi: {
		//初始化扑克牌堆
		init(player, skill) {
			if (!lib.commonArea.has("pokerPile")) {
				lib.commonArea.set("pokerPile", {
					translate: "扑克牌堆",
					areaStatusName: "pokerPile",
					isUnseen: true,
					toName: "toPokerPile",
					fromName: "fromPokerPile",
					async addHandeler(event, trigger, player) {
						const { cards } = event;
						_status.pokerPile.addArray(
							cards.filter(function (card) {
								return !card.willBeDestroyed("pokerPile", null, event.relatedEvent);
							})
						);
						lib.skill.hschenzhi.update();
					},
					/** 处理从相应区域中移出的卡牌*/
					async removeHandeler(event, trigger, player) {
						_status.pokerPile.removeArray(event.cards);
						lib.skill.hschenzhi.update();
					},
				});
			}
			if (!lib.commonArea.has("pokerDiscarded")) {
				lib.commonArea.set("pokerDiscarded", {
					translate: "扑克弃牌堆",
					areaStatusName: "pokerDiscarded",
					toName: "toPokerDiscarded",
					fromName: "fromPokerDiscarded",
					async addHandeler(event, trigger, player) {
						const { cards } = event;
						_status.pokerDiscarded.addArray(
							cards.filter(function (card) {
								return !card.willBeDestroyed("pokerDiscarded", null, event.relatedEvent);
							})
						);
						game.log(cards, "被移入扑克弃牌堆");
						lib.skill.hschenzhi.update();
					},
					/** 处理从相应区域中移出的卡牌*/
					async removeHandeler(event, trigger, player) {
						_status.pokerDiscarded.removeArray(event.cards);
						lib.skill.hschenzhi.update();
					},
				});
			}
			player.addSkill("poker_record");
			if (!_status.pokerPile) {
				lib.skill[skill].initPile();
			}
		},
		//初始化单张扑克
		initPoker(suit = "none", number = "none") {
			const card = game.createCard2("hschenzhi_poker", suit, number);
			game.broadcastAll(
				(card, suit) => {
					//card.node.image.setBackgroundImage(`image/card/lukai_${suit}.png`);
					//处理移出游戏的部分
					card.destroyed = (card, position, player, event) => {
						//如果要移入的位置是弃牌堆，直接转移到special
						if (position == "discardPile") {
							lib.skill.hschenzhi.discard(card, true);
						}
						return false;
					};
				},
				card,
				suit
			);
			return card;
		},
		//初始化牌堆
		initPile(nocardpile) {
			const suits = lib.suit.slice(),
				cards = [];
			if (nocardpile) {
				game.broadcastAll(() => {
					_status.pokerPile ??= [];
					_status.pokerDiscarded ??= [];
				});
			} else {
				for (let suit of suits) {
					for (let i = 1; i < 14; i++) {
						const card = lib.skill.hschenzhi.initPoker(suit, i);
						cards.add(card);
					}
				}
				cards.randomSort();
				_status.pokerPile ??= cards;
				_status.pokerDiscarded ??= [];
				game.cardsGotoSpecial(cards);
			}
			lib.skill.hschenzhi.update();
		},
		//扑克牌堆洗牌
		washCard() {
			if (!_status.pokerPile || !_status.pokerDiscarded) {
				lib.skill.hschenzhi.initPile(true);
			}
			if (!_status.pokerPile.length && !_status.pokerDiscarded.length) {
				return;
			}
			const cards = _status.pokerPile.concat(_status.pokerDiscarded);
			_status.pokerDiscarded = [];
			cards.randomSort();
			_status.pokerPile = cards;
			lib.skill.hschenzhi.update();
		},
		//更新扑克牌堆
		update() {
			game.broadcast(
				(pile, discard) => {
					_status.pokerPile = pile;
					_status.pokerDiscarded = discard;
				},
				_status.pokerPile,
				_status.pokerDiscarded
			);
			game.filterPlayer(target => target.hasSkill("poker_record")).forEach(target => target.markSkill("poker_record"));
		},
		//从扑克牌堆获得牌
		getCards(num) {
			if (typeof num != "number") {
				num = 1;
			}
			if (num <= 0) {
				return [];
			}
			const list = [];
			while (num > 0) {
				if (!_status.pokerPile.length) {
					lib.skill.hschenzhi.washCard();
				}
				if (!_status.pokerPile.length) {
					break;
				}
				const cardx = _status.pokerPile.shift();
				if (!cardx) {
					break;
				}
				cardx.original = "s";
				list.push(cardx);
				num--;
			}
			list.slice()
				.reverse()
				.forEach(card => _status.pokerPile.unshift());
			//数量不够，用牌堆补一下
			if (num > 0) {
				list.addArray(get.cards(num, true));
			}
			lib.skill.hschenzhi.update();
			return list;
		},
		//将扑克牌放回牌堆或弃置
		discard(card, noinsert) {
			if (card.name != "hschenzhi_poker") {
				card.discard(false);
				return;
			}
			if (noinsert) {
				game.cardsGotoSpecial(card, "toPokerDiscarded");
			} else {
				ui.special.appendChild(card);
				_status.pokerPile.splice(get.rand(0, _status.pokerPile.length - 1), 0, card);
				lib.skill.hschenzhi.update();
			}
		},
		trigger: {
			player: "drawBegin",
			global: ["gameDrawBegin", "replaceHandcardsBegin"],
		},
		forced: true,
		lastDo: true,
		filter(event, player) {
			if (event.name == "draw") {
				return event.num > 0;
			}
			return true;
		},
		content() {
			if (trigger.name == "draw") {
				trigger.set("otherGetCards", lib.skill.hschenzhi.getCards);
			} else {
				if (!trigger.otherPile) {
					trigger.set("otherPile", {});
				}
				//第一个元素放获得牌相关的，第二个放弃置牌相关的
				trigger.otherPile[player.playerid] = {
					getCards: lib.skill.hschenzhi.getCards,
					discard: lib.skill.hschenzhi.discard,
				};
			}
		},
		ai: {
			sortCardByNum: true,
			combo: "hsdianmo",
		},
	},
	hsdianmo: {
		init(player, skill) {
			lib.skill[skill].initList();
		},
		initList() {
			//先用许劭评鉴那个函数初始化一下角色列表
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			const characters = _status.characterlist.slice();
			//获取各个角色的技能并去重
			const skills = characters
				.map(i => get.character(i, 3))
				.flat()
				.unique();
			const list = [];
			/*for(let skill of skills){
				const info = get.info(skill);
				//去除觉醒技、隐匿技、势力技、主公技
				if (!info || info.silent || info.juexingji || info.hiddenSkill || info.groupSkill || info.zhuSkill) continue;
				//去除有联动的技能和负面技能
				if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
				//筛选跟转化相关的
				const str = get.plainText(get.skillInfoTranslation(skill));
				if (!["当","当做","当作"].some(s=>str.includes(s))) continue;
				list.add(skill);
			}*/

			//展开技能
			game.expandSkills(skills, true);
			//筛选技能
			for (let skill of skills) {
				let info = get.info(skill);
				//判断是否有印牌效果
				if (info.viewAs) {
					info = info.viewAs;
					//有些viewAs是函数形式，就转成字符串了，其他的按键值对处理即可
					if (typeof info == "function") {
						const str = info?.toString();
						if (!str || str.includes("isCard: true")) {
							continue;
						}
					} else if (info.isCard === true) {
						continue;
					}
				} else if (info.chooseButton?.backup) {
					//backup基本都是函数，也要转字符串
					info = info.chooseButton?.backup;
					const str = info?.toString();
					if (!str || !str.includes("viewAs: ") || str.includes("isCard: true")) {
						continue;
					}
				} else {
					continue;
				}
				skill = get.sourceSkillFor(skill);
				info = get.info(skill);
				//去除觉醒技、隐匿技、势力技、主公技
				if (!info || info.silent || info.juexingji || info.hiddenSkill || info.groupSkill || info.zhuSkill) {
					continue;
				}
				//去除有联动的技能和负面技能
				if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) {
					continue;
				}
				const str = get.skillInfoTranslation(skill);
				if (!["当", "当做", "当作"].some(s => str.includes(s))) {
					continue;
				}
				list.add(skill);
			}

			//最后用全局变量存储，就不需要反复执行这个函数了
			_status.viewAsSkills = list;
		},
		keepSkill: true,
		trigger: { player: ["phaseZhunbeiBegin", "damageEnd"] },
		filter(event, player) {
			if (event.name == "damage") {
				return player.getHistory("damage", evt => evt.num > 0).indexOf(event) == 0;
			}
			return true;
		},
		async cost(event, trigger, player) {
			if (!_status.viewAsSkills) {
				lib.skill[event.skill].initList();
			}
			const list = _status.viewAsSkills.filter(skill => !player.hasSkill(skill, null, null, false));
			if (!list.length) {
				return;
			}
			const skills = list.randomGets(2);
			const result = await player
				.chooseButton([
					get.prompt2(event.skill) + `<span class=thundertext style="font-weight:bold;">当前拥有技能：${get.translation(player.additionalSkills["hsdianmo"])}</span>`,
					[
						[
							["gain", "获得技能"],
							["replace", "替换技能"],
							["draw", "直接摸牌"],
						],
						"tdnodes",
					],
					[skills, "skill"],
				])
				.set("selectButton", () => {
					if (ui.selected.buttons.length && ui.selected.buttons[0].link == "draw") {
						return 1;
					}
					return 2;
				})
				.set("filterButton", button => {
					const actions = ["gain", "replace", "draw"],
						len = get.player().additionalSkills["hsdianmo"]?.length || 0;
					if (!ui.selected.buttons.length) {
						if (button.link == "gain") {
							return len < 4;
						}
						if (button.link == "replace") {
							return len > 0;
						}
						if (button.link == "draw") {
							return len < 4;
						}
						return false;
					}
					return ui.selected.buttons[0].link == "draw" ? false : !actions.includes(button.link);
				})
				.set("complexSelect", true)
				.set("ai", button => Math.random())
				.forResult();
			if (result?.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const skill = event.cost_data[1],
				action = event.cost_data[0],
				skills = player.additionalSkills[event.name]?.slice() || [];
			if (action == "replace") {
				if (!skills.length) {
					return;
				}
				const result = await player
					.chooseButton([`###点墨：请选择一个要替换的技能###${get.translation(skill)}：${get.translation(skill + "_info")}`, [skills, "skill"]], true)
					.set("ai", button => Math.random())
					.forResult();
				if (!result?.links?.length) {
					return;
				}
				const replaced = result.links[0];
				skills.remove(replaced);
			}
			if (action != "draw") {
				skills.add(skill);
				await player.addAdditionalSkills(event.name, skills);
			}
			await player.draw(4 - (player.additionalSkills[event.name]?.length || 0));
		},
	},
	hszaibi: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", card => player.canRecast(card)) > 1;
		},
		filterCard(card, player) {
			const selected = ui.selected.cards.slice();
			if (!selected.length) {
				return player.canRecast(card);
			}
			selected.add(card);
			const nums = selected
				.map(card => get.number(card, get.player()))
				.unique()
				.sort((a, b) => a - b);
			if (nums.length == selected.length && nums.length > 1) {
				if (nums[nums.length - 1] - nums[0] == nums.length - 1) {
					return player.canRecast(card);
				}
			}
			return false;
		},
		position: "he",
		selectCard: [2, Infinity],
		complexCard: true,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.recast(cards);
			const card = game.createCard2("chunqiubi", "heart", 5);
			if (player.canEquip(card, true)) {
				await player.equip(card);
			}
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	chunqiubi_skill: {
		enable: "phaseUse",
		usable: 1,
		prompts: ["起：失去1点体力", "承：摸已损失体力值张牌", "转：回复1点体力", "合：弃置已损失体力值张手牌"],
		async content(event, trigger, player) {
			let funcs = [
					async target => {
						await target.loseHp();
					},
					async target => {
						if (!target.getDamagedHp()) {
							return;
						}
						await target.draw(target.getDamagedHp());
					},
					async target => {
						if (!target.isDamaged()) {
							return;
						}
						await target.recover();
					},
					async target => {
						if (!target.countDiscardableCards(target, "he") || !target.isDamaged()) {
							return;
						}
						await target.chooseToDiscard("he", target.getDamagedHp(), true);
					},
				],
				prompts = lib.skill.chunqiubi_skill.prompts.slice();
			const selected = prompts.randomGet(),
				char = selected.slice(0, 1),
				index = prompts.indexOf(selected);
			prompts = prompts.slice(index, 4).concat(prompts.slice(0, index));
			funcs = funcs.slice(index, 4).concat(funcs.slice(0, index));
			game.log(player, "抽中了", "#y" + char);
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						`###春秋笔：令一名角色正序或逆序执行以下项（上面为正序。下面为逆序）###${prompts.join("<br>")}<br><br>${[prompts[0]].concat(prompts.slice(1, 4).reverse()).join("<br>")}`,
						[
							[
								["forward", "正序"],
								["reverse", "逆序"],
							],
							"tdnodes",
						],
					],
					forced: true,
					filterButton: true,
					filterTarget: true,
					ai1(button) {},
					ai2(target) {},
				})
				.forResult();
			if (result?.bool) {
				const target = result.targets[0],
					link = result.links[0];
				player.line(target);
				if (link == "reverse") {
					funcs = [funcs[0]].concat(funcs.slice(1, 4).reverse());
				}
				for (const func of funcs) {
					if (!target.isIn()) {
						break;
					}
					await func(target);
				}
			}
		},
		ai: {
			order: 5,
			ai: {
				player: 1,
			},
		},
	},
};

export default skills;
