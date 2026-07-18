import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//张星彩------ by 清风
	ymhengren: {
		audio: 2,
		zhuanhuanji: true,
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				return "其他角色的出牌阶段" + (storage ? "结束时" : "开始时") + "，若其本阶段有【杀】的剩余使用次数，你可以使用一张【杀】（将计入其使用次数且伤害+1）。";
			},
		},
		trigger: { global: ["phaseUseBegin", "phaseUseEnd"] },
		filter(event, player, name) {
			const storage = player.storage.ymhengren,
				num = event.player.getCardUsable("sha", false);
			if (name != "phaseUse" + (storage ? "End" : "Begin")) {
				return false;
			}
			if (player === event.player) {
				return false;
			}
			return num > 0;
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			const target = trigger.player;
			const result = await player
				.chooseToUse({
					filterCard(card) {
						if (get.name(card) !== "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					prompt: "横刃：你可以使用一张【杀】",
					ai1(card) {
						return 10 - get.value(card);
					},
				})
				.set("logSkill", event.name)
				.set("oncard", () => {
					const evt = _status.event;
					if (typeof evt.baseDamage !== "number") {
						evt.baseDamage = 1;
					}
					evt.baseDamage++;
				})
				.forResult();
			if (result?.bool) {
				player.changeZhuanhuanji(event.name);
				const stat = target.getStat("card"),
					name = "sha";
				if (typeof stat[name] !== "number") {
					stat[name] = 0;
				}
				stat[name]++;
			}
		},
	},
	ymdanjue: {
		audio: 2,
		trigger: { global: "useCardToTargeted" },
		filter(event, player) {
			return event.card.name === "sha" && get.distance(event.target, player) <= 1 && event.getParent().addCount !== false;
		},
		check(event, player) {
			if (get.attitude(player, event.player) > 0 && event.player.countCards("h") > 3) {
				return true;
			}
			if (get.attitude(player, event.target) > 0 && event.player.countCards("h") <= 3) {
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			trigger.getParent().addCount = false;
			const stat = trigger.player.getStat("card"),
				name = trigger.card.name;
			if (typeof stat[name] == "number" && stat[name] > 0) {
				stat[name]--;
			}
			if (trigger.target?.isIn()) {
				await trigger.target.draw({ num: 1 });
				if (player === trigger.target) {
					return;
				}
				await trigger.target
					.chooseToGive({
						target: player,
						position: "he",
						prompt: `你可以交给${get.translation(player)}一张牌`,
						ai(card) {
							const { player, target } = get.event();
							if (get.attitude(player, target) > 0) {
								return 10 - get.value(card);
							}
							return 0;
						},
					})
					.set("target", player);
			}
		},
	},
	//关银屏
	ymsaxue: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.countPlayer(current => !current.isLinked()) > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "横置两名角色",
					filterTarget(card, player, target) {
						return !target.isLinked();
					},
					selectTarget: 2,
					ai(target) {
						const player = get.player();
						if (target === player) {
							return 1;
						}
						return -get.attitude(player, target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			await game.doAsyncInOrder(targets, async target => {
				await target.link(true);
			});
			let result;
			if (game.hasPlayer(current => current !== player)) {
				result = await player
					.chooseTarget({
						prompt: "洒血：选择一名其他角色对你和其造成共计2点火焰伤害",
						filterTarget: lib.filter.notMe,
						forced: true,
						ai(target) {
							return -get.attitude(get.player(), target) * (target.isLinked() ? 2 : 0);
						},
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					const target = result.targets[0];
					player.line(target);
					const func = () => {
						const event = get.event();
						const controls = [
							link => {
								const targets = game.filterPlayer();
								if (targets.length) {
									for (let i = 0; i < targets.length; i++) {
										const target = targets[i];
										target.classList.remove("selectable");
										target.classList.remove("selected");
										const counterNode = target.querySelector(".caption");
										if (counterNode) {
											counterNode.childNodes[0].innerHTML = ``;
										}
									}
									ui.selected.targets.length = 0;
									game.check();
								}
								return;
							},
						];
						event.controls = [ui.create.control(controls.concat(["清除选择", "stayleft"]))];
					};
					if (event.isMine()) {
						func();
					} else if (event.isOnline()) {
						event.player.send(func);
					}
					const num = 2;
					result = await target
						.chooseTarget({
							prompt: `${get.translation(player)}对你发动了洒血：请分配两点火焰伤害`,
							filterTarget(card, player, target) {
								return target === player || target === get.event().targetx;
							},
							selectTarget: 2,
							ai(target) {
								const player = get.player();
								return get.damageEffect(target, player, player, "fire");
							},
							forced: true,
							custom: {
								add: {
									confirm(bool) {
										if (bool != true) {
											return;
										}
										const event = get.event().parent;
										if (event.controls) {
											event.controls.forEach(i => {
												if (i.innerText == "清除选择") {
													i.custom();
												}
												i.close();
											});
										}
										if (ui.confirm) {
											ui.confirm.close();
										}
										game.uncheck();
									},
									target() {
										if (ui.selected.targets.length) {
											return;
										}
										const targets = game.filterPlayer();
										if (targets.length) {
											for (let i = 0; i < targets.length; i++) {
												const target = targets[i];
												const counterNode = target.querySelector(".caption");
												if (counterNode) {
													counterNode.childNodes[0].innerHTML = ``;
												}
											}
										}
										if (!ui.selected.targets.length) {
											const evt = event.parent;
											if (evt.controls) {
												evt.controls[0].classList.add("disabled");
											}
										}
									},
								},
								replace: {
									target(target) {
										const event = get.event(),
											sum = get.event().sum;
										if (!event.isMine()) {
											return;
										}
										if (target.classList.contains("selectable") == false) {
											return;
										}
										if (ui.selected.targets.length >= sum) {
											return false;
										}
										target.classList.add("selected");
										ui.selected.targets.push(target);
										let counterNode = target.querySelector(".caption");
										const count = ui.selected.targets.filter(i => i == target).length;
										if (counterNode) {
											counterNode = counterNode.childNodes[0];
											counterNode.innerHTML = `×${count}`;
										} else {
											counterNode = ui.create.caption(`<span style="font-size:24px; font-family:xinwei; text-shadow:#FFF 0 0 4px, #FFF 0 0 4px, rgba(74,29,1,1) 0 0 3px;">×${count}</span>`, target);
											counterNode.style.right = "30px";
											counterNode.style.bottom = "15px";
										}
										const evt = event.parent;
										if (evt.controls) {
											evt.controls[0].classList.remove("disabled");
										}
										game.check();
									},
								},
							},
						})
						.set("targetx", player)
						.set("sum", num)
						.forResult();
					if (result?.bool && result.targets?.length) {
						if (!event.isMine()) {
							await game.delay();
						}
						const targets = result.targets.sortBySeat();
						for (const i of [player, target]) {
							if (targets.includes(i)) {
								i.classList.remove("selectable");
								i.classList.remove("selected");
								const counterNode = i.querySelector(".caption");
								if (counterNode) {
									counterNode.childNodes[0].innerHTML = ``;
								}
								await i.damage({ source: target, nature: "fire", num: targets.filter(y => y == i).length });
							}
						}
					}
				}
			}
		},
	},
	ymxianfeng: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source?.isIn() && event.source.hasDiscardableCards(player, "he");
		},
		getIndex: event => event.num,
		async cost(event, trigger, player) {
			const target = trigger.source;
			const list = [event.skill, target];
			event.result = await player
				.discardPlayerCard({
					target,
					prompt: get.prompt(...list),
					prompt2: "弃置其一张牌，若此牌花色为本回合首次进入弃牌堆，你获得之",
					position: "he",
					ai(button) {
						if (!get.event().att) {
							return 0;
						}
						const card = button.link;
						if (get.position(card) !== "e") {
							return 1;
						}
						return get.value(card) * (get.subtypes(card).includes("equip2") ? 5 : 1);
					},
				})
				.set("att", get.attitude(player, target) < 0)
				.set("logSkill", list)
				.forResult();
		},
		popup: false,
		logTarget: "source",
		async content(event, trigger, player) {
			const {
				cards: [card],
			} = event;
			const suit = get.suit(card);
			let num = 0;
			game.getGlobalHistory("cardMove", evt => {
				if (evt.name != "lose" && evt.name != "cardsDiscard") {
					return false;
				}
				if (evt.name == "lose" && evt.position != ui.discardPile) {
					return false;
				}
				if (evt == trigger || evt.getParent() == trigger) {
					return false;
				}
				if (evt.cards?.some(card => get.suit(card) == suit)) {
					num++;
				}
			});
			if (num === 1) {
				await player.gain({ cards: [card], animate: "gain2" });
			}
		},
	},
	//赵襄
	ymqianling: {
		audio: 2,
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return player.hasCards("h") && game.hasPlayer(current => get.info("ymqianling").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return player !== target && target.hasCards("h");
		},
		selectTarget: [1, 3],
		multiline: true,
		multitarget: true,
		async content(event, trigger, player) {
			const targets = event.targets.concat(player).filter(i => i.hasCards("h"));
			targets.sortBySeat();
			const cards = targets.map(target => target.getCards("h")).flat();
			await player
				.showCards(cards, get.translation(player) + "发动了【潜聆】")
				.set("customButton", button => {
					const target = get.owner(button.link);
					if (target) {
						game.createButtonCardsetion(`${target.getName(true)}`, button);
					}
				})
				.set("delay_time", 4)
				.set("multipleShow", true);
			if (targets.some(target => target !== player && target.countCards("h", card => get.color(card) == "black") == player.countCards("h", card => get.color(card) == "black"))) {
				const result = await player
					.chooseTarget({
						prompt: "潜聆：你可以与一名黑色手牌数与你相同的其他角色交换手牌",
						filterTarget(card, player, target) {
							return target !== player && get.event().targets.includes(target) && target.countCards("h", card => get.color(card) == "black") == player.countCards("h", card => get.color(card) == "black");
						},
						ai(target) {
							const player = get.player();
							if (get.attitude(player, target) < 0) {
								return target.getCards("h").reduce((a, b) => a + get.value(b), 0) > player.getCards("h").reduce((a, b) => a + get.value(b), 0);
							}
							return 0;
						},
					})
					.set("targets", targets)
					.forResult();
				if (result?.bool && result.targets?.length) {
					await player.swapHandcards(result.targets[0]);
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player: 1,
				target(player, target) {
					return target.countCards("h");
				},
			},
		},
	},
	ymqueying: {
		audio: 2,
		enable: ["chooseToUse"],
		filter(event, player) {
			if (player.countCards("h") >= player.maxHp) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (!["sha", "shan"].includes(info[2])) {
					return false;
				}
				return event.filterCard(
					get.autoViewAs(
						{
							name: info[2],
							nature: info[3],
						},
						"unsure"
					),
					player,
					event
				);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (!["sha", "shan"].includes(info[2])) {
						return false;
					}
					return event.filterCard(
						get.autoViewAs(
							{
								name: info[2],
								nature: info[3],
							},
							"unsure"
						),
						player,
						event
					);
				});
				return ui.create.dialog("雀影", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard(
					{
						name: button.link[2],
					},
					player,
					_status.event.getParent()
				);
			},
			check(button) {
				if (get.event().getParent()?.type !== "phase") {
					return 1;
				}
				return get.player().getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard: () => false,
					selectCard: -1,
					audio: "ymqueying",
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("ymqueying");
						await player.gain({ cards: lib.card.ying.getYing(1), animate: "gain2" });
					},
				};
			},
			prompt(links, player) {
				return "获得一张【影】然后视为使用一张" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			return ["sha", "shan"].includes(name) && player.countCards("h") < player.maxHp;
		},
		ai: {
			order: 7,
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (player.countCards("h") >= player.maxHp) {
					return false;
				}
			},
			result: {
				player: 1,
			},
		},
	},
	//梦貂蝉------by 清风
	ymdiyu: {
		audio: 2,
		trigger: { global: "roundStart" },
		derivation: ["benghuai", "tongji", "olbihun", "dcyiju"],
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "令一名角色本轮伤害+1",
					ai(target) {
						const player = get.player();
						if (player.getStorage("ymdiyu_gived").length > 3) {
							return get.attitude(player, target) * Math.min(1, target.countCards("h"));
						}
						if (player.hasCards("hs", card => get.name(card) == "shan")) {
							return -get.attitude(player, target);
						}
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.addTempSkill(event.name + "_dam", "roundStart");
			target.addMark(event.name + "_dam", 1, false);
			const skills = get
				.info(event.name)
				.derivation.slice()
				.removeArray(player.getStorage(event.name + "_gived"));
			if (skills.length) {
				const list = [];
				for (const skill of skills) {
					list.push([skill, `<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【` + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
				}
				const result =
					skills.length > 1
						? await player
								.chooseButton({
									createDialog: [`令${get.translation(target)}获得一个技能`, [list, "textbutton"]],
									forced: true,
									ai(button) {
										const { player, skills, target } = get.event();
										if (get.attitude(player, target) > 0) {
											skills.removeArray(["olbihun", "dcyiju"]);
										} else {
											skills.removeArray(["benghuai", "tongji"]);
										}
										return button.link === skills.randomGet();
									},
								})
								.set("skills", skills)
								.set("target", target)
								.forResult()
						: { bool: true, links: skills };
				if (result?.bool && result.links?.length) {
					const skill = result.links[0];
					await target.addSkills(skill);
					player.addSkill(event.name + "_gived");
					player.markAuto(event.name + "_gived", [skill]);
				}
			}
		},
		subSkill: {
			gived: {
				charlotte: true,
				onremove: true,
				intro: {
					content(storage, player) {
						return `已选择过：${storage.map(skill => get.poptip(skill)).join("、")}`;
					},
				},
			},
			dam: {
				charlotte: true,
				forced: true,
				mark: true,
				onremove: true,
				intro: { content: "本轮造成伤害+#" },
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return player.hasMark("ymdiyu_dam");
				},
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
			},
		},
	},
	ymfuyi: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return event.card.name == "sha" && game.hasPlayer(current => lib.filter.targetEnabled2(event.card, event.player, current) && !event.targets.includes(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: `选择一名角色也成为${get.translation(trigger.card)}的目标`,
					filterTarget(crd, player, target) {
						return lib.filter.targetEnabled2(get.event().card, get.event().targetx, target) && !get.event().targets.includes(target);
					},
					ai(target) {
						const { player, targetx, card } = get.event();
						return get.effect(target, card, targetx, player);
					},
				})
				.set("card", trigger.card)
				.set("targetx", trigger.player)
				.set("targets", trigger.targets)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			trigger.targets.add(target);
			await game.asyncDraw(trigger.targets);
			player
				.when({ global: "shaMiss" })
				.filter(evt => evt.player === trigger.player && evt.card === trigger.card)
				.step(async (event, trigger2, player) => {
					const targets = trigger.targets;
					const index = targets.indexOf(trigger2.target);
					if (index !== -1) {
						const targetx = targets.slice(index + 1, targets.length);
						trigger.getParent().excluded.addArray(targetx);
						game.log(trigger.card, "对", targetx, "无效");
					}
				});
		},
	},
	ymjiuji: {
		audio: 2,
		trigger: { global: "roundEnd" },
		filter(event, player) {
			return game.players.length > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "选择两名角色依次执行一个仅能对对方使用牌且双方技能互换的额外回合",
					selectTarget: 2,
					ai(target) {
						return get.attitude(get.player(), target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			const target1 = targets[0],
				target2 = targets[1];
			const skills1 = target1.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				return info && !info.charlotte;
			});
			const skills2 = target2.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				return info && !info.charlotte;
			});
			player.addTempSkill(event.name + "_effect2", "roundStart");
			player.setStorage(event.name + "_effect2", [target1, target2, skills1, skills2], true);
			target1.insertPhase();
			target2.insertPhase();
		},
		subSkill: {
			effect2: {
				charlotte: true,
				silent: true,
				lastDo: true,
				popup: false,
				onremove(player, skill) {
					const storage = player.storage[skill];
					if (storage?.length && player.storage[skill + "2"]) {
						const [target1, target2, skills1, skills2] = storage;
						target1.changeSkills(skills1, skills2);
						target1.removeSkill("ymjiuji_effect");
						target2.changeSkills(skills2, skills1);
						target2.removeSkill("ymjiuji_effect");
					}
					delete player.storage[skill];
					delete player.storage[skill + "2"];
				},
				trigger: {
					global: ["phaseBefore", "phaseAfter", "phaseCancelled"],
				},
				filter(event, player, name) {
					const storage = player.storage["ymjiuji_effect2"];
					if (storage?.length) {
						const [target1, target2, skills1, skills2] = storage;
						if (name == "phaseBefore") {
							return event.player == target1 && event.skill == "ymjiuji";
						} else if (name == "phaseCancelled") {
							return event.player == target2 && event.skill == "ymjiuji";
						}
						return (event.player == target2 && event.skill == "ymjiuji") || !target2?.isIn();
					}
					return false;
				},
				async content(event, trigger, player) {
					const storage = player.storage["ymjiuji_effect2"];
					if (storage?.length) {
						const [target1, target2, skills1, skills2] = storage;
						const name = event.triggername;
						if (name == "phaseBefore") {
							player.setStorage(event.name + "2", true, true);
							target1.changeSkills(skills2, skills1);
							target1.addSkill("ymjiuji_effect");
							target1.markAuto("ymjiuji_effect", [target2]);
							if (target2?.isIn()) {
								target2.changeSkills(skills1, skills2);
								target2.addSkill("ymjiuji_effect");
								target2.markAuto("ymjiuji_effect", [target1]);
							}
						} else {
							player.removeSkill(event.name);
						}
					}
				},
			},
			effect: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					content: "使用牌仅能指定$为目标",
				},
				mod: {
					playerEnabled(card, player, target) {
						if (!player.getStorage("ymjiuji_effect").includes(target)) {
							return false;
						}
					},
				},
			},
		},
	},
	//线下奶龙------by 清风
	ymfriendyance: {
		audio: ["friendyance1.mp3", "friendyance2.mp3", "friendyance3.mp3"],
		logAudio: () => ["friendyance1.mp3"],
		trigger: { global: "roundStart" },
		async content(event, trigger, player) {
			await player.draw({ num: 5 });
			if (!player.hasCards("h")) {
				return;
			}
			const num = Math.min(5, player.countCards("h"));
			const result = await player
				.chooseCard({
					prompt: `演策：将${get.cnNumber(num)}张手牌置于武将牌上（先选择的在上）`,
					selectCard: num,
					position: "h",
					ai(card) {
						return -player.getUseValue(card);
					},
					forced: true,
					filterOk() {
						return ui.selected.cards?.length === get.event().num;
					},
				})
				.set("num", num)
				.forResult();
			if (result?.bool && result.cards?.length) {
				const cards = result.cards.reverse();
				player.addTempSkill(event.name + "_yance", "roundStart");
				await player.addToExpansion({ cards, source: player, animate: "give", gaintag: [event.name + "_yance"] });
				await event.trigger("ymfriendyance_minigame");
			}
		},
		subSkill: {
			yance: {
				forced: true,
				charlotte: true,
				audio: "ymfriendyance",
				logAudio: () => ["friendyance2.mp3", "friendyance3.mp3"],
				onremove(player, skill) {
					delete player.storage[skill];
					const cards = player.getExpansions(skill);
					if (cards.length) {
						player.loseToDiscardpile({ cards });
					}
				},
				marktext: "策",
				intro: {
					name: "演策",
					markcount(storage, player) {
						return player.getExpansions("ymfriendyance_yance").length;
					},
					mark(dialog, content, player) {
						if (!player.storage.ymfriendyance_yance && !player.isUnderControl(true)) {
							return "天机可知却不可说...";
						}
						const cards = player.getExpansions("ymfriendyance_yance");
						if (cards.length) {
							dialog.addAuto(cards);
						} else {
							return "无演策牌";
						}
					},
				},
				trigger: { global: "useCard" },
				filter(event, player) {
					return player.hasExpansions("ymfriendyance_yance");
				},
				async content(event, trigger, player) {
					const cardx = player.getExpansions(event.name)[0],
						card = trigger.card;
					await player.loseToDiscardpile({ cards: [cardx] });
					let num = 0;
					if (get.suit(card) == get.suit(cardx)) {
						num++;
					}
					if (get.type2(card) == get.type2(cardx)) {
						num++;
					}
					if (player.storage[event.name]) {
						num *= 2;
					}
					if (num > 0) {
						player.popup("洗具");
						await player.draw({ num });
					} else {
						player.popup("杯具");
					}
					if (!player.hasExpansions("ymfriendyance_yance")) {
						player.removeSkill(event.name);
					}
				},
				mod: {
					aiOrder(player, card, num) {
						const cards = player.getExpansions("ymfriendyance_yance");
						if (!cards.length) {
							return;
						}
						const cardx = cards[0];
						if (get.suit(card) == get.suit(cardx) || get.type2(card) == get.type2(cardx)) {
							return (num += 100);
						}
					},
				},
			},
		},
	},
	ymfriendfangqiu: {
		audio: ["friendfangqiu1.mp3", "friendfangqiu2.mp3"],
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		trigger: { player: "ymfriendyance_minigame" },
		filter(event, player) {
			return player.hasExpansions("ymfriendyance_yance");
		},
		check(event, player) {
			const target = game.findPlayer(target => target.getSeatNum() == 1);
			if (target?.isIn()) {
				return get.attitude(player, target) > 0;
			}
			return 1;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.storage.ymfriendyance_yance = true;
			const cards = player.getExpansions("ymfriendyance_yance");
			if (cards.length) {
				await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
			}
		},
		ai: { combo: "ymfriendyance" },
	},
};

export default skills;
