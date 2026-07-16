import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//PE刘徽------by 清风
	pejieshu: {
		audio: "dcjieshu",
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("pejieshu_tag")) {
					return num + 0.1;
				}
			},
			aiValue(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("pejieshu_tag")) {
					return num * 1.1;
				}
			},
			aiUseful() {
				return lib.skill.pejieshu.mod.aiValue.apply(this, arguments);
			},
		},
		trigger: { player: "useCardToPlayered" },
		onremove(player, skill) {
			player.removeGaintag(skill + "_tag");
		},
		check(event, player) {
			return get.type(event.card) != "equip";
		},
		filter(event, player) {
			const cards = player
				.getHistory("lose", evt => {
					return evt.getParent() == event.getParent() && evt.cards2?.length && Object.values(evt.gaintag_map).flat().includes("pejieshu_tag");
				})
				.flatMap(evt => evt.cards2 || []);
			return event.cards?.filterInD("od")?.some(card => !cards.includes(card));
		},
		prompt2(event, player) {
			const cards = player
				.getHistory("lose", evt => {
					return evt.getParent() == event.getParent() && evt.cards2?.length && Object.values(evt.gaintag_map).flat().includes("pejieshu_tag");
				})
				.map(evt => evt.cards2)
				.reduce((a, b) => b.addArray(a), []);
			return `获得${get.translation(event.cards?.filterInD("od")?.filter(card => !cards.includes(card)))}`;
		},
		async content(event, trigger, player) {
			const cardx = player
				.getHistory("lose", evt => {
					return evt.getParent() == trigger.getParent() && evt.cards2?.length && Object.values(evt.gaintag_map).flat().includes("pejieshu_tag");
				})
				.map(evt => evt.cards2)
				.reduce((a, b) => b.addArray(a), []);
			const cards = trigger.cards?.filterInD("od")?.filter(card => !cardx.includes(card));
			const targets = trigger.targets;
			await player.gain({ cards, animate: "gain2", gaintag: ["pejieshu_tag"] });
			player.addTempSkill(event.name + "_effect2", "roundStart");
			cards.forEach(card => {
				player.markAuto(event.name + "_effect2", [[card, targets]]);
			});
			player.addTempSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", cards);
		},
		subSkill: {
			tag: {},
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					targetInRange(card, player) {
						if ([card].concat(card.cards || []).some(cardx => get.itemtype(cardx) === "card" && player.getStorage("pejieshu_effect").includes(cardx))) {
							return true;
						}
					},
				},
			},
			effect2: {
				charlotte: true,
				onremove: true,
				//感谢戏佬qwq
				mod: {
					playerEnabled(card, player, target) {
						if ([card].concat(card.cards || []).some(cardx => get.itemtype(cardx) === "card" && player.getStorage("pejieshu_effect2").some(([cardxx, targets]) => targets.includes(target) && cardx == cardxx))) {
							return false;
						}
					},
				},
			},
		},
	},
	pegeyuan: {
		audio: "dcgeyuan",
		forced: true,
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_mark");
		},
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			return (
				player.storage.pegeyuan_mark &&
				player.hasHistory("lose", evt => {
					return evt.getParent() == event.getParent() && evt.cards2?.length && Object.values(evt.gaintag_map).flat().includes("pejieshu_tag");
				})
			);
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			if (get.distance(player, target) != get.distance(player, player.storage.pegeyuan_mark) && player.hasDiscardableCards(player, "he")) {
				await player.chooseToDiscard({ forced: true, position: "he", selectCard: 2 });
			} else {
				await player.draw({ num: 2 });
			}
			if (!player.getStorage(event.name).some(i => (i[0] === target && i[1] === player.storage.pegeyuan_mark) || (i[1] === target && i[0] === player.storage.pegeyuan_mark))) {
				player.markAuto(event.name, [[target, player.storage.pegeyuan_mark]]);
			}
		},
		subSkill: {
			mark: {
				charlotte: true,
				silent: true,
				lastDo: true,
				trigger: { player: "useCardToPlayer" },
				intro: {
					content(storage, player) {
						let str = "当前没有“割圆”目标";
						if (player.storage.pegeyuan_mark) {
							str = `上个割圆目标为${get.translation(player.storage.pegeyuan_mark)}`;
						}
						if (player.getStorage("pegeyuan").length) {
							str += "<br>割圆组：";
							for (const i of player.getStorage("pegeyuan")) {
								str += `<li>${get.translation(i)}`;
							}
						}
						return str;
					},
				},
				onremove(player, skill) {
					player.setStorage(skill, false, true);
					player.removeTip(skill);
				},
				filter(event, player) {
					return player.hasHistory("lose", evt => {
						return evt.getParent() == event.getParent() && evt.cards2?.length && Object.values(evt.gaintag_map).flat().includes("pejieshu_tag");
					});
				},
				async content(event, trigger, player) {
					const target = trigger.target;
					if (!player.storage[event.name]) {
						player.setStorage(event.name, target, true);
						player.addTip(event.name, `${get.translation(event.name)}：${get.translation(target)}`);
					} else {
						player.storage[event.name] = false;
						player.removeTip(event.name);
					}
				},
			},
		},
		ai: { combo: "pejieshu" },
	},
	pegusuan: {
		audio: "dcgusuan",
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "purple",
		trigger: { player: "pegeyuanAfter" },
		filter(event, player) {
			const cards = player
				.getAllHistory("lose", evt => {
					return evt.type == "discard" && evt.getParent(3)?.name == "pegeyuan" && evt.cards2?.length;
				})
				.map(evt => evt.cards2)
				.reduce((a, b) => b.addArray(a), []);
			return player.getStorage("pegeyuan").length >= 3 && cards.length < 4;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.draw(5);
			const targets = game.filterPlayer(current => current != player);
			if (!targets.length) {
				return;
			}
			const result =
				targets.length > 2
					? await player
							.chooseTarget({
								forced: true,
								prompt: "选择两名其他角色与你的距离互为1",
								filterTarget: lib.filter.notMe,
								selectTarget: 2,
								ai(target) {
									return -get.attitude(get.player(), target);
								},
							})
							.forResult()
					: { bool: true, targets };
			if (result?.bool && result.targets?.length) {
				const targets = result.targets;
				player.line(targets);
				player.addSkill(event.name + "_effect");
				player.markAuto(event.name + "_effect", targets);
				targets.forEach(target => {
					target.addSkill(event.name + "_effect");
					target.markAuto(event.name + "_effect", [player]);
				});
				player.addSkill(event.name + "_effect2");
			}
		},
		ai: { combo: ["pejieshu", "pegeyuan"] },
		subSkill: {
			effect: {
				intro: { content: "与$距离互为1" },
				mod: {
					globalFrom(from, to) {
						if (from.getStorage("pegusuan_effect").includes(to)) {
							return -Infinity;
						}
					},
				},
			},
			effect2: {
				mod: {
					cardUsableTarget(card, player, target) {
						if (get.distance(player, target) <= 1) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	//白起------by 清风
	pewuan: {
		audio: 2,
		forced: true,
		trigger: { source: "damageSource" },
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.addSkill(event.name + "_dam");
			player.addMark(event.name + "_dam", 1, false);
			player.markAuto(event.name + "_dam2", [target]);
			target.addTempSkill(event.name + "_fengyin");
		},
		subSkill: {
			dam: {
				audio: "pewuan",
				charlotte: true,
				forced: true,
				onremove: true,
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("pewuan_dam2").includes(target)) {
							return true;
						}
					},
					cardUsableTarget(card, player, target) {
						if (player.getStorage("pewuan_dam2").includes(target)) {
							return Infinity;
						}
					},
				},
				intro: {
					content(storage, player) {
						let str = `<li>造成伤害+${storage}`;
						if (player.getStorage("pewuan_dam2").length) {
							str += `<li>对${get.translation(player.getStorage("pewuan_dam2"))}使用牌无距离与次数限制`;
						}
						return str;
					},
				},
				trigger: {
					source: "damageBegin2",
					player: "useCard1",
				},
				filter(event, player) {
					return event.name == "damage" || (event.addCount != false && event.targets?.some(target => player.getStorage("pewuan_dam2").includes(target)));
				},
				async content(event, trigger, player) {
					if (trigger.name == "damage") {
						trigger.num += player.countMark(event.name);
					} else {
						trigger.addCount = false;
						const stat = player.getStat("card"),
							name = trigger.card.name;
						if (typeof stat[name] == "number" && stat[name] > 0) {
							stat[name]--;
						}
					}
				},
			},
			fengyin: {
				charlotte: true,
				inherit: "fengyin",
			},
		},
	},
	peshashen: {
		audio: 2,
		forced: true,
		trigger: { source: "dying" },
		logTarget: "player",
		filter(event, player) {
			return player != event.player;
		},
		async content(event, trigger, player) {
			trigger.cancel();
			await event.targets[0].die(trigger);
			player.when({ global: ["phaseAfter", "phaseBefore"] }).step(async (event, trigger, player) => {
				player.removeSkill(event.name);
				if (event.triggername == "phaseAfter") {
					player.insertPhase();
				}
			});
		},
	},
	//花木兰------by 清风
	perongbian: {
		audio: 2,
		forced: true,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return get.type(event.card) === "equip";
		},
		async content(event, trigger, player) {
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			_status.characterlist.randomSort();
			const list = _status.characterlist.filter(character => get.character(character, 0) === "female");
			if (!list.length) {
				player.popup("没喽");
				return;
			}
			const name = list.randomGet();
			get.info(event.name).addVisitors([name], player);
			const skills = get.character(name).skills.filter(skill => !player.hasSkill(skill, null, null, false));
			if (skills.length) {
				const list2 = skills.map(skill => [
					skill,
					html`
						<div class="popup text" style="width:calc(100% - 10px);display:inline-block">
							<div class="skill">【${get.translation(skill)}】</div>
							<div>${lib.translate[skill + "_info"]}</div>
						</div>
					`,
				]);
				const result = await player
					.chooseButton({
						forced: true,
						createDialog: ["戎弁：选择获得一个技能", [list2, "textbutton"]],
						ai(button) {
							return 1 + Math.random();
						},
					})
					.forResult();
				if (result?.bool && result.links?.length) {
					const skill = result.links[0];
					await player.addSkills(skill);
					lib.card["huashen_card_" + name].skills.push(skill);
				}
			}
		},
		onremove(player, skill) {
			if (player.getStorage(skill).length) {
				get.info(skill).removeVisitors(player.getStorage(skill), player);
			}
		},
		addVisitors(characters, player) {
			_status.characterlist.removeArray(characters);
			game.log(player, "将", "#y" + get.translation(characters), "加入了", "#g“戎弁”");
			game.broadcastAll(
				(player, characters) => {
					player.tempname.addArray(characters);
					player.$draw(
						characters.map(name => {
							const cardname = "huashen_card_" + name;
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + name,
								skills: [],
							};
							lib.translate[cardname] = get.rawName2(name);
							return game.createCard(cardname, " ", " ");
						}),
						"nobroadcast"
					);
				},
				player,
				characters
			);
			player.markAuto("perongbian", characters);
		},
		removeVisitors(characters, player) {
			if (Array.isArray(player.tempname)) {
				game.broadcastAll((player, characters) => player.tempname.removeArray(characters), player, characters);
			}
			player.unmarkAuto("perongbian", characters);
			_status.characterlist.addArray(characters);
			game.log(player, "移去了", "#y" + get.translation(characters));
			for (const character of characters) {
				const skills = lib.card["huashen_card_" + character]?.skills;
				if (skills?.length) {
					player.removeSkills(skills);
				}
			}
		},
		intro: {
			name: "戎弁",
			mark(dialog, storage, player) {
				if (!storage || !storage.length) {
					return "当前没有女将牌";
				}
				dialog.addSmall([storage, "character"]);
			},
		},
	},
	peliezhan: {
		audio: 2,
		enable: ["chooseToUse"],
		filter(event, player) {
			if (!player.getStorage("perongbian").length) {
				return false;
			}
			return (
				get.inpileVCardList(info => {
					if (!["basic", "trick"].includes(info[0])) {
						return false;
					}
					return event.filterCard(
						get.autoViewAs(
							{
								name: info[2],
								nature: info[3],
								storage: { peliezhan: true },
							},
							"unsure"
						),
						player,
						event
					);
				}).length > 0
			);
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (!["basic", "trick"].includes(info[0])) {
						return false;
					}
					return event.filterCard(
						get.autoViewAs(
							{
								name: info[2],
								nature: info[3],
								storage: { peliezhan: true },
							},
							"unsure"
						),
						player,
						event
					);
				});
				return ui.create.dialog("烈瞻", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard(
					{
						name: button.link[2],
						storage: { peliezhan: true },
					},
					player,
					_status.event.getParent()
				);
			},
			prompt(links, player) {
				return `将一张女将牌当做${get.translation(links[0][3] || "")}${get.translation(links[0][2])}使用`;
			},
			backup(links, player) {
				return {
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: { peliezhan: true },
					},
					selectCard: -1,
					filterCard: () => false,
					popname: true,
					log: false,
					manualConfirm: true,
					async precontent(event, trigger, player) {
						event.getParent().addCount = false;
						const characters = player.getStorage("perongbian").slice(0);
						const result =
							characters.length > 1
								? await player
										.chooseButton({
											createDialog: ["烈瞻：选择一张女将牌", [characters, "character"]],
											forced: true,
											ai(button) {
												return 1 + Math.random();
											},
										})
										.forResult()
								: { bool: true, links: characters };
						if (result?.bool && result.links?.length) {
							player.logSkill("peliezhan");
							get.info("perongbian").removeVisitors(result.links, player);
							player
								.when("useCardAfter")
								.filter(evt => evt.getParent() === event.getParent())
								.step(async (event, trigger, player) => {
									await player.draw({ num: 2 });
								});
						}
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (!["trick", "basic"].includes(get.type(name))) {
				return false;
			}
			return player.getStorage("perongbian").length;
		},
		locked: false,
		mod: {
			cardUsable(card) {
				if (card?.storage?.peliezhan) {
					return Infinity;
				}
			},
			targetInRange(card) {
				if (card?.storage?.peliezhan) {
					return true;
				}
			},
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.getStorage("perongbian").length) {
					return false;
				}
			},
			order: 7,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: { backup: {} },
	},
	petijun: {
		audio: 2,
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => get.info("petijun").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target.hasSex("male") && target.hasGainableCards(player, "e");
		},
		async content(event, trigger, player) {
			const { target } = event;
			player.awakenSkill(event.name);
			const cards = target.getGainableCards(player, "e");
			await player.gain({
				cards,
				source: target,
				animate: "giveAuto",
				bySelf: true,
			});
			await player.recoverTo(player.maxHp);
			await target.recoverTo(target.maxHp);
			player.addSkill(event.name + "_die");
			player.markAuto(event.name + "_die", [target]);
		},
		ai: {
			order: 13,
			result: {
				player: 1,
				target(player, target) {
					if (game.hasPlayer(current => get.attitude(current, player) < 0 && current.hasGainableCards(player, "e") && current.getDamagedHp() < 2)) {
						return -target.countGainableCards(player, "e") / Math.min(1, target.getDamagedHp());
					}
					return target.countGainableCards(player, "e");
				},
			},
		},
		subSkill: {
			die: {
				forced: true,
				charlotte: true,
				onremove: true,
				audio: "petijun",
				mark: true,
				intro: { content: "杀死$外的角色后重置此技能" },
				trigger: { source: "dieEnd" },
				filter(event, player) {
					return !player.getStorage("petijun_die").includes(event.player) && player.awakenedSkills.includes("petijun");
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					player.restoreSkill("petijun");
					game.log(player, "重置了", "#g【替君】");
				},
			},
		},
	},
	//杨玉环------by 清风
	peyichuan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current !== player);
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog(get.prompt2("peyichuan"), "hidden");
			},
			chooseControl(event, player) {
				return ["basic", "trick", "equip", "cancel2"];
			},
			check(event, player) {
				return "basic";
			},
			backup(result, player) {
				return {
					audio: "peyichuan",
					control: result.control,
					async content(event, trigger, player) {
						const { control: type } = get.info(event.name);
						const targets = game.filterPlayer(current => current !== player).sortBySeat();
						player.line(targets);
						const map = await game.chooseAnyOL(targets, get.info("peyichuan").chooseToGive, [player, type]).forResult();
						if (!map.size) {
							return;
						}
						const cards = [];
						let num = 0;
						const gainMax = [];
						for (const target of Array.from(map.keys())) {
							const result = map.get(target);
							if (result?.bool && result.cards?.length) {
								cards.addArray(result.cards);
								if (result.cards.length >= num) {
									if (result.cards.length > num) {
										num = result.cards.length;
										gainMax.length = 0;
									}
									gainMax.push(target);
								}
							} else {
								target.addSkill("peyichuan_direct");
							}
						}
						if (cards.length) {
							await player.gain({
								cards: cards,
								animate: "giveAuto",
							});
						}
						const next = game.createEvent("PeyichuanAfter", false);
						next.player = player;
						next.targets = gainMax;
						next.setContent("emptyEvent");
					},
				};
			},
		},
		chooseToGive(target, player, type) {
			const next = target.chooseCard({
				prompt: `驿传：是否交给${get.translation(player)}任意张${get.translation(type)}牌`,
				position: "he",
				filterCard(card) {
					return get.type2(card) === get.event().type;
				},
				selectCard: [1, Infinity],
				allowChooseAll: true,
			});
			next.set("type", type);
			next.set("att", get.attitude(target, player));
			next.set("ai", card => {
				const { att, player } = get.event();
				if (att > 0) {
					return 15 - get.value(card);
				}
				if (!player.hasSkill("peyichuan_direct")) {
					return 5 - get.value(card);
				}
				return 0;
			});
			return next;
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {},
			direct: {
				silent: true,
				charlotte: true,
				mark: true,
				intro: {
					content: "不能响应1号位使用的牌",
				},
				trigger: { global: "useCard" },
				filter(event, player) {
					return event.player.getSeatNum() === 1;
				},
				async content(event, trigger, player) {
					trigger.directHit.add(player);
				},
			},
		},
	},
	pexiuhua: {
		audio: 2,
		forced: true,
		trigger: {
			player: ["gainAfter", "PeyichuanAfter"],
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.name === "PeyichuanAfter") {
				return event.targets?.length > 0;
			}
			return game.hasPlayer(current => {
				if (current === player) {
					return false;
				}
				return event.getl?.(current)?.cards2?.some(card => event.getg?.(player)?.includes(card));
			});
		},
		getIndex(event, player) {
			if (event.name === "PeyichuanAfter") {
				return 1;
			}
			if (event.name === "loseAsync" && event.type !== "gain") {
				return [];
			}
			return game.filterPlayer(current => {
				if (current === player) {
					return false;
				}
				return event.getl?.(current)?.cards2?.some(card => event.getg?.(player)?.includes(card));
			});
		},
		logTarget(event, player, name, target) {
			if (event.name === "PeyichuanAfter") {
				return event.targets.sortBySeat();
			}
			return target;
		},
		async content(event, trigger, player) {
			if (trigger.name === "PeyichuanAfter") {
				await game.doAsyncInOrder(trigger.targets.concat([player]), async target => {
					await target.recover();
					await target.draw({ num: 3 });
				});
			} else {
				const target = event.targets[0];
				const num = trigger.getl(target).cards2.filter(card => trigger.getg(player)).length;
				if (num > 0) {
					await target.draw({ num: num });
				}
			}
		},
	},
	//夏侯岚------by 清风
	pexunji: {
		audio: 2,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (player !== _status.currentPhase || !event.getg?.(player)?.length) {
				return false;
			}
			return lib.phaseName.some(phase => {
				return (
					player
						.getHistory("gain", evt => evt.getParent(phase) === event.getParent(phase))
						.map(evt => (event.name == "gain" ? evt : evt.getParent()))
						.indexOf(event) === 0
				);
			});
		},
		async cost(event, trigger, player) {
			const list = get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				return player.hasUseTarget(
					get.autoViewAs(
						{
							name: info[2],
							nature: info[3],
						},
						"unsure"
					),
					false,
					false
				);
			});
			const result = await player
				.chooseButton({
					createDialog: ["迅击：你可以视为使用一张基本牌", [list, "vcard"]],
					ai(button) {
						return get.player().getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					},
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const { cost_data: links } = event;
			await player
				.chooseUseTarget(
					get.autoViewAs(
						{
							name: links[0][2],
							nature: links[0][3],
						},
						"unsure"
					),
					true,
					false,
					"nodistance"
				)
				.set("oncard", () => {
					const event = _status.event;
					event.directHit.addArray(game.players);
				});
		},
	},
	peshuangfeng: {
		audio: 2,
		derivation: ["peguiren", "peyichi"],
		trigger: { player: "phaseBegin" },
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl({
					controls: ["phaseDraw", "phaseUse", "cancel2"],
					prompt: "双锋：将本回合所有阶段改为一个阶段",
					ai() {
						const { controls, player } = get.event();
						if (!player.hasCard(card => get.is.damageCard(card) && player.hasUseTarget(card, false, false), "hs")) {
							controls.remove("phaseUse");
						}
						return controls.slice(0).remove("cancel2").randomGet();
					},
				})
				.forResult();
			if (typeof result?.control === "string" && result.control !== "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		async content(event, trigger, player) {
			const { cost_data: phase } = event;
			let num = 0;
			while (true) {
				if (trigger.phaseList[num]) {
					trigger.phaseList[num] = `${phase}|${event.name}`;
				} else {
					break;
				}
				num++;
			}
			player.addTempSkills(phase === "phaseDraw" ? "peyichi" : "peguiren");
		},
	},
	peguiren: {
		audio: 2,
		forced: true,
		locked: false,
		trigger: { source: "damageSource" },
		async content(event, trigger, player) {
			player.addTempSkill(event.name + "_effect", "phaseAnyAfter");
			const result = await player
				.chooseTarget({
					prompt: "归刃：选择一名角色与其各摸一张牌",
					forced: true,
					ai(target) {
						const player = get.player();
						return get.effect(target, { name: "draw" }, player, player);
					},
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.line(target);
				await game.asyncDraw([player, target]);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: { content: "本阶段使用牌无次数限制" },
				mod: {
					cardUsable: () => Infinity,
				},
			},
		},
	},
	peyichi: {
		audio: 2,
		trigger: { player: "phaseDrawEnd" },
		filter(event, player) {
			return game.hasPlayer(current => current !== player && current.isDamaged());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "选择一名其他角色令其回复一点体力",
					filterTarget(card, player, target) {
						return target !== player && target.isDamaged();
					},
					ai(target) {
						const player = get.player();
						return get.recoverEffect(target, player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await event.targets[0].recover();
		},
	},
	//天策上将-李世民------by 清风
	pepozhen: {
		audio: 2,
		persevereSkill: true,
		forced: true,
		locked: false,
		trigger: { source: "damageSource" },
		filter(event, player) {
			const target = event.player;
			if (player == target) {
				return false;
			}
			if (!target.getStorage("pepozhen_used").includes("选项一") && !player.getStorage("pepozhen_use").includes(target)) {
				return true;
			}
			if (!target.getStorage("pepozhen_used").includes("选项二") && target.countGainableCards(player, "hej")) {
				return true;
			}
			if (!target.getStorage("pepozhen_used").includes("选项三")) {
				return true;
			}
			return false;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			const list = [],
				choiceList = ["令" + get.translation(player) + "对你使用牌无距离次数限制", "交给" + get.translation(player) + "一个区域内的所有牌", "体力上限调整为1且失去所有技能"];
			if (!target.getStorage("pepozhen_used").includes("选项一") && !player.getStorage("pepozhen_use").includes(target)) {
				list.push("选项一");
			} else {
				choiceList[0] = `<span style="opacity:0.5">` + choiceList[0] + "</span>";
			}
			if (!target.getStorage("pepozhen_used").includes("选项二") && target.countGainableCards(player, "hej")) {
				list.push("选项二");
			} else {
				choiceList[1] = `<span style="opacity:0.5">` + choiceList[1] + "</span>";
			}
			if (!target.getStorage("pepozhen_used").includes("选项三")) {
				list.push("选项三");
			} else {
				choiceList[2] = `<span style="opacity:0.5">` + choiceList[2] + "</span>";
			}
			if (list.length) {
				let result;
				result =
					list.length > 1
						? await target
								.chooseControl({
									prompt: get.translation(player) + "对你发动了【破阵】，请选择一项",
									choiceList: choiceList,
									controls: list,
									ai() {
										const { controls, player, source } = get.event();
										if (get.attitude(player, source) > 0) {
											if (controls.includes("选项二")) {
												return "选项二";
											} else if (controls.includes("选项一")) {
												return "选项一";
											}
										}
										if (controls.includes("选项一")) {
											return "选项一";
										} else if (controls.includes("选项二")) {
											return "选项二";
										}
										return controls.slice(0).randomGet();
									},
								})
								.set("source", player)
								.forResult()
						: { control: list[0] };
				if (typeof result?.control == "string") {
					const control = result.control;
					target.addTempSkill(event.name + "_used");
					target.markAuto(event.name + "_used", [control]);
					if (control == "选项一") {
						player.addSkill(event.name + "_use");
						player.markAuto(event.name + "_use", [target]);
					} else if (control == "选项二") {
						const map = { h: "手牌区", e: "装备区", j: "判定区" };
						const pos = ["h", "e", "j"].filter(i => target.countGainableCards(player, i));
						if (pos.length) {
							result =
								pos.length > 1
									? await target
											.chooseControl({
												controls: pos.map(i => map[i]),
												prompt: "选择一个区域内的所有牌交给" + get.translation(player),
												ai() {
													const { player, source, controls } = get.event();
													if (get.attitude(player, source) > 0) {
														if (controls.includes("h") && player.countGainableCards(source, "h") > 3) {
															return "h";
														}
													}
													if (controls.includes("j")) {
														return "j";
													}
													if (controls.includes("e") && player.countGainableCards(source, "e") < 3) {
														return "e";
													}
													return controls.slice(0).randomGet();
												},
											})
											.set("source", player)
											.forResult()
									: { control: pos[0] };
							const reverseMap = Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
							const cards = target.getGainableCards(player, reverseMap[result.control]);
							if (cards?.length) {
								await target.give(cards, player);
							}
						}
					} else {
						if (target.maxHp > 1) {
							await target.loseMaxHp(target.maxHp - 1);
						} else if (target.maxHp < 1) {
							await target.gainMaxHp(1 - target.maxHp);
						}
						await target.removeSkills(
							target.getSkills(null, false, false).filter(skill => {
								const info = get.info(skill);
								return info && !info.charlotte;
							})
						);
					}
				}
			}
		},
		subSkill: {
			used: { charlotte: true, onremove: true },
			use: {
				charlotte: true,
				onremove: true,
				intro: { content: "对$使用牌无距离次数限制" },
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("pepozhen_use").includes(target)) {
							return true;
						}
					},
					cardUsableTarget(card, player, target) {
						if (player.getStorage("pepozhen_use").includes(target)) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	petaoge: {
		audio: 2,
		enable: ["chooseToUse"],
		filter(event, player) {
			if (!["basic", "trick"].some(type => player.hasCard(card => get.type2(card) == type, "he") && !player.getStorage("petaoge_used").includes(type))) {
				return false;
			}
			return get.inpileVCardList(info => {
				const types = ["basic", "trick"].removeArray(player.getStorage("petaoge_used"));
				if (!types.includes(get.type2(info[2]))) {
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
					const types = ["basic", "trick"].removeArray(player.getStorage("petaoge_used")).filter(i => player.hasCard(card => get.type2(card) == i, "he"));
					if (!types.includes(get.type2(info[2]))) {
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
				return ui.create.dialog("韬戈", [list, "vcard"]);
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
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				const player = get.player();
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
					return 0;
				}
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					link: links[0][2],
					filterCard(card) {
						return get.type2(card) == get.type2(lib.skill.petaoge_backup.link);
					},
					audio: "petaoge",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					position: "he",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("petaoge");
						player.addTempSkill("petaoge_used");
						player.markAuto("petaoge_used", [get.type2(event.result.card)]);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name) || !player.countCards("he")) {
				return false;
			}
			const type = get.type2(name);
			return ["basic", "trick"].removeArray(player.getStorage("petaoge_used")).includes(type);
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("he") || player.getStorage("petaoge_used").includes("basic")) {
					return false;
				}
			},
			order: 7,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: { backup: {} },
	},
	pezhenguan: {
		audio: 2,
		zhuSkill: true,
		forced: true,
		locked: false,
		trigger: {
			global: ["roundStart", "roundEnd"],
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async content(event, trigger, player) {
			const groups = game
				.filterPlayer(current => current != player)
				.sortBySeat()
				.map(current => current.group)
				.unique();
			while (groups.length) {
				const group = groups.shift();
				if (game.hasPlayer(current => current != player && current.group == group)) {
					const result =
						game.countPlayer(current => current != player && current.group == group) > 1
							? await player
									.chooseTarget({
										prompt2: "贞观：令一名" + get.translation(group) + "势力的其他角色摸一张牌",
										filterTarget(card, player, target) {
											return target != player && target.group == group;
										},
										forced: true,
										ai(target) {
											return get.attitude(get.player(), target);
										},
									})
									.forResult()
							: { bool: true, targets: game.filterPlayer(current => current != player && current.group == group) };
					if (result?.bool && result.targets?.length) {
						const target = result.targets[0];
						player.line(target);
						await target.draw({ num: 1 });
					}
				}
			}
			const num = game.countGroup();
			await player.draw({ num: num });
		},
	},
	//e郭照
	pepianchong: {
		trigger: { player: "phaseDrawBegin1" },
		check(event, player) {
			return true;
		},
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			const card = get.bottomCards();
			const next = player.gain(card, "gain2");
			next.gaintag.add(event.name + "_effect");
			await next;
			await player.draw();
			trigger.changeToZero();
			player.addTempSkill("pepianchong_effect", { player: "phaseBegin" });
		},
		subSkill: {
			effect: {
				trigger: {
					player: ["loseAfter"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				charlotte: true,
				getIndex(event, player) {
					return event.getl?.(player).hs.map(card => card.cardid) || [];
				},
				async content(event, trigger, player) {
					let next,
						evt = trigger.getl(player);
					if (evt.gaintag_map?.[event.indexedData]?.includes(event.name)) {
						next = player.draw("nodelay");
					} else {
						next = player.gain(get.bottomCards(), "gain2", false);
						next.gaintag.add(event.name);
					}
					await next;
				},
				ai: {
					noh: true,
				},
			},
		},
	},
	pezunwei: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const filter = index => {
				const target = game.findPlayer(current => {
					return current[`isMax${["Handcard", "Equip", "Hp"][index]}`]();
				});
				if (!target || target == player || player.getStorage("pezunwei_used").includes(index)) {
					return false;
				}
				const count = current => {
					return [current.countCards("h"), current.countCards("e"), current.getHp()][index];
				};
				return count(target) > count(player);
			};
			return [0, 1, 2].some(filter);
		},
		chooseButton: {
			dialog(event, player) {
				var list = ["将手牌摸至全场最多", "随机使用牌堆中的装备牌，直至你的装备区牌数为全场最多", "将体力回复至全场最多"];
				var choiceList = ui.create.dialog("尊位：请选择一项", "forcebutton", "hidden");
				choiceList.add([
					list.map((item, i) => {
						if (player.getStorage("pezunwei_used").includes(i)) {
							item = `<span style="text-decoration: line-through;">${item}</span>`;
						}
						return [i, item];
					}),
					"textbutton",
				]);
				return choiceList;
			},
			check(button) {
				const player = get.player(),
					target = game.findPlayer(current => {
						return current[`isMax${["Handcard", "Equip", "Hp"][button.link]}`]();
					});
				if (!target || target == player) {
					return 0;
				}
				const count = current => {
					return [current.countCards("h"), current.countCards("e"), current.getHp()][button.link];
				};
				return (count(target) - count(player)) * button.link;
			},
			filter(button) {
				const player = get.player();
				const filter = index => {
					const target = game.findPlayer(current => {
						return current[`isMax${["Handcard", "Equip", "Hp"][index]}`]();
					});
					if (!target || target == player || player.getStorage("pezunwei_used").includes(index)) {
						return false;
					}
					const count = current => {
						return [current.countCards("h"), current.countCards("e"), current.getHp()][index];
					};
					return count(target) > count(player);
				};
				return filter(button.link);
			},
			backup(links) {
				return {
					index: links[0],
					async content(event, trigger, player) {
						const { index } = get.info(event.name);
						player.addSkill("pezunwei_used");
						player.markAuto("pezunwei_used", index);
						switch (index) {
							case 0: {
								const target = game.findPlayer(current => current.isMaxHandcard());
								if (target) {
									await player.drawTo(target.countCards("h"));
								}
								break;
							}
							case 1: {
								do {
									const card = get.cardPile2(card => get.type(card) == "equip" && player.canUse(card, player) && player.canEquip(card));
									if (card) {
										const next = player.chooseUseTarget(card, true);
										next.nopopup = true;
										await next;
									} else {
										break;
									}
								} while (!player.isMaxEquip() && [1, 2, 3, 4, 5].some(i => player.hasEmptySlot(i)));
								break;
							}
							case 2: {
								const target = game.findPlayer(current => current.isMaxHp());
								if (target) {
									await player.recoverTo(target.getHp());
								}
								break;
							}
						}
					},
				};
			},
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					const value = index => {
						const target = game.findPlayer(current => {
							return current[`isMax${["Handcard", "Equip", "Hp"][index]}`]();
						});
						if (!target || target == player || player.getStorage("pezunwei_used").includes(index)) {
							return 0;
						}
						const count = current => {
							return [current.countCards("h"), current.countCards("e"), current.getHp()][index];
						};
						return (count(target) - count(player)) * index;
					};
					const index = [0, 1, 2].maxBy(value);
					if (value(index) > 3) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			backup: {},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//线下官盗E系列10-侠曹丕
	//史阿你看看你教了个什么东西
	peqinyi: {
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		filter(event, player, name) {
			const evt = name === "damageSource" ? "sourceDamage" : "damage";
			return player.getHistory(evt).indexOf(event) == 0 && get.info("peqinyi").getList(player).length > 0;
		},
		getList(player) {
			const list = get.inpileVCardList(info => {
				if (!["basic", "trick"].includes(info[0]) || player.getStorage("peqinyi").includes(info[2])) {
					return false;
				}
				const card = new lib.element.VCard({ name: info[2], nature: info[3], isCard: true });
				return player.hasUseTarget(card) || (get.info(card).notarget && lib.filter.cardEnabled(card, player));
			});
			return list;
		},
		async cost(event, trigger, player) {
			const list = get.info(event.skill).getList(player);
			if (!list.length) {
				event.result = { bool: false };
				return;
			}
			const { links } = await player
				.chooseButton(["勤艺：是否视为使用一张未以此法使用过的基本牌或普通锦囊牌？", [list, "vcard"]])
				.set("ai", button => {
					const { link } = button;
					return get.player().getUseValue(new lib.element.VCard({ name: link[2], nature: link[3] })) + 1;
				})
				.forResult();
			event.result = {
				bool: links?.length ? true : false,
				cost_data: links,
			};
		},
		async content(event, trigger, player) {
			const [[taofen, lulu, name, nature]] = event.cost_data;
			const card = new lib.element.VCard({ name: name, nature: nature, isCard: true });
			if (player.hasUseTarget(card) || (get.info(card).notarget && lib.filter.cardEnabled(card, player))) {
				player.markAuto("peqinyi", name);
				await player.chooseUseTarget(`${get.translation(event.name)}：请选择${get.translation(card)}的目标`, card, true, false);
			}
		},
		marktext: "艺",
		intro: { content: "已以此法使用过$" },
	},
	//武鹿可以直接撕了
	pejixin: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			const name = event.card.name;
			return name && player.getAllHistory("useCard", evt => evt.card.name === event.card.name).indexOf(event) === 0;
		},
		//妈妈再也不用担心我一不小心就摸空牌堆辣！
		frequent(event, player) {
			const num = ui.cardPile.childElementCount + ui.discardPile.childElementCount,
				num2 = player.getRoundHistory("useSkill", evt => evt.skill == "pejixin").length + 1;
			return num > num2;
		},
		async content(event, trigger, player) {
			const skill = "pejixin_count";
			player.addTempSkill(skill, "roundStart");
			player.addMark(skill, 1, false);
			const num = player.countMark(skill);
			const result = player.draw(num);
			result.gaintag.add("pejixin_effect");
			const cards = await result.forResult().cards;
			await player.showCards(get.translation(player) + "发动了【技新】", cards);
			player.addSkill("pejixin_effect");
		},
		init(player, skill) {
			player.addSkill("pejixin_mark");
			const num1 = player
					.getAllHistory("useCard")
					.map(evt => evt.card.name)
					.unique(),
				num2 = player.getRoundHistory("useSkill", evt => evt.skill == skill).length;
			if (num1 > 0) {
				player.setStorage(`${skill}_mark`, num1, true);
			}
			if (num2 > 0) {
				player.setStorage(`${skill}_count`, num2, true);
			}
		},
		onremove(player, skill) {
			delete player.storage[skill];
			player.removeSkill(`${skill}_mark`);
			player.removeSkill(`${skill}_count`);
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCard1" },
				forced: true,
				silent: true,
				async content(event, trigger, player) {
					player.markAuto(event.name, [trigger.card.name]);
				},
				marktext: "新",
				intro: { content: "本局游戏已使用牌名：$" },
			},
			count: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "技",
				intro: { content: "本轮已发动过$次〖技新〗" },
			},
			effect: {
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				trigger: { player: "useCard0" },
				filter(event, player) {
					if (event.addCount === false) {
						return false;
					}
					return player.hasHistory("lose", evt => {
						if (evt.getParent() !== event) {
							return false;
						}
						return Object.values(evt.gaintag_map).flat().includes("pejixin_effect");
					});
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
				},
				mod: {
					targetInRange(card, player, target) {
						if (get.number(card) === "unsure" || card.cards?.every(card => card.hasGaintag("pejixin_effect"))) {
							return true;
						}
					},
					cardUsable(card, player, num) {
						if (get.number(card) === "unsure" || card.cards?.every(card => card.hasGaintag("pejixin_effect"))) {
							return Infinity;
						}
					},
					ignoredHandcard(card, player) {
						if (card.hasGaintag("pejixin_effect")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("pejixin_effect")) {
							return false;
						}
					},
				},
			},
		},
	},
	pejiwei: {
		init() {
			if (!_status.pejiweiList) {
				_status.pejiweiList = [];
				if (!_status.characterlist) {
					game.initCharacterList();
				}
				for (const name of _status.characterlist) {
					let { group, skills, doubleGroup } = get.character(name);
					if (group === "wei" || doubleGroup.includes("wei")) {
						skills = skills.filter(skill => {
							const info = get.info(skill);
							return info?.zhuSkill && !info.ai?.combo;
						});
						if (skills.length) {
							skills.forEach(skill => _status.pejiweiList.add(skill));
						}
					}
				}
			}
		},
		trigger: {
			global: "phaseEnd",
		},
		isFirst(target) {
			if (game.hasPlayer2(current => current.getSeatNum() > 0, true)) {
				return target.getSeatNum() == 1;
			}
			return target == _status.roundStart;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			const taofen = game.findPlayer2(current => get.info("pejiwei").isFirst(current), true);
			return taofen && player.countMark("pejixin_count") >= taofen.getHp();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recoverTo(player.maxHp);
			if (!_status.pejiweiList) {
				get.info(event.name).init();
			}
			await game.delayx();
			const list = _status.pejiweiList.slice().filter(skill => !player.hasSkill(skill, null, false, false));
			if (!list.length) {
				return;
			}
			const num = Math.min(5, list.length);
			const { links } = await player
				.chooseButton([`继魏：是否选择并获得${num}个魏势力主公技？`, [list, "skill"]], num)
				.set("ai", button => get.skillRank(button.link[0], "inout"))
				.forResult();
			if (links) {
				await game.delayx();
				player.chat(`${get.cnNumber(num, true)}灵威力，变身！`);
				player.addSkills(links);
			}
		},
		ai: { combo: "pejixin" },
	},
	//夏侯玄
	pehuanfu: {
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), "he", [1, player.maxHp], "chooseonly", "allowChooseAll")
				.set("ai", card => {
					return 6 - get.value(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = (await player.modedDiscard(event.cards).forResult()).cards;
			await player.draw(cards.length * 2);
			game.log(trigger.card, "的伤害改为", "#y" + cards.length);
			player.addTempSkill(event.name + "_damage");
			trigger.card.storage[event.name + "_damage"] = cards.length;
		},
		subSkill: {
			damage: {
				trigger: {
					global: "damageBegin1",
				},
				filter(event, player) {
					return event.card?.storage?.pehuanfu_damage > 0 && event.getParent(2)?.targets?.includes(event.player);
				},
				charlotte: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num = trigger.card.storage.pehuanfu_damage;
				},
			},
		},
	},
	//曲阿小将
	peyingzhen: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (!game.countPlayer(current => current != player)) {
				return false;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(current => current != player);
			event.result =
				targets.length > 1
					? await player
							.chooseTarget(
								get.prompt2(event.skill),
								(card, player, target) => {
									if (target == player) {
										return false;
									}
									if (ui.selected.targets.length) {
										const targetx = ui.selected.targets[0];
										return target == targetx.getPrevious() || target == targetx.getNext();
									}
									return true;
								},
								true,
								2
							)
							.set("targetprompt", ["执行回合", "交换位置"])
							.set("complexTarget", true)
							.set("ai", target => {
								const att = get.attitude(get.player(), target);
								if (ui.selected.targets.length) {
									return -att;
								}
								return att;
							})
							.forResult()
					: {
							bool: true,
							targets: targets,
						};
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			if (targets.length > 1) {
				game.broadcastAll(
					function (target1, target2) {
						game.swapSeat(target1, target2);
					},
					player,
					targets[1]
				);
			}
			await game.delay(3);
			const evt = player.insertPhase();
			evt.pushHandler("onPhase", (event, option) => {
				if (event.step === 0 && option.state === "begin") {
					event.step = 1;
				}
			});
			targets[0].insertPhase();
			if (trigger.name == "phase" && !trigger._finished) {
				let first = game.findPlayer(current => current.getSeatNum() == 1) || trigger.player;
				trigger.finish();
				trigger._finished = true;
				trigger._triggered = 5;
				const evtx = first.insertPhase();
				delete evtx.skill;
				const evt2 = trigger.getParent();
				if (evt2.name == "phaseLoop" && evt2._isStandardLoop) {
					evt2.player = first;
				}
			}
		},
	},
	peyuanjue: {
		trigger: {
			player: "phaseDrawBefore",
		},
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (storage) {
					return "所有角色的基本牌视为无次数限制的【杀】";
				} else if (storage === false) {
					return "所有角色与你互相计算距离为1，你视为拥有〖同忾〗";
				}
				return get.skillInfoTranslation(skill, player, false);
			},
		},
		async content(event, trigger, player) {
			trigger.cancel();
			player.changeZhuanhuanji(event.name);
			if (player.getStorage(event.name, false)) {
				player.removeAdditionalSkill(event.name);
			} else {
				player.addAdditionalSkill(event.name, ["petongkai"]);
			}
		},
		locked: false,
		mod: {
			globalFrom(from, to) {
				if (from.storage.peyuanjue === false) {
					return -Infinity;
				}
			},
			globalTo(from, to) {
				if (to.storage.peyuanjue === false) {
					return -Infinity;
				}
			},
		},
		global: "peyuanjue_viewas",
		derivation: "petongkai",
		subSkill: {
			viewas: {
				mod: {
					cardname(card, player) {
						if (
							game.hasPlayer(current => {
								return current.hasSkill("peyuanjue") && current.getStorage("peyuanjue") === true;
							}) &&
							lib.card[card.name]?.type == "basic"
						) {
							return "sha";
						}
					},
					cardUsable(card, player) {
						if (
							!game.hasPlayer(current => {
								return current.hasSkill("peyuanjue") && current.getStorage("peyuanjue") === true;
							}) ||
							card.name != "sha"
						) {
							return;
						}
						if (!card.cards || card.cards.length != 1) {
							return;
						}
						if (get.suit(card) == "unsure" || lib.card[card.cards[0].name]?.type == "basic") {
							return Infinity;
						}
					},
				},
			},
		},
	},
	peaoyong: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		persevereSkill: true,
		filter(event, player) {
			return event.getParent(2, true)?.name != "peaoyong" && event.getg(player)?.length;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl(["选项一", "选项二", "选项三", "背水！", "cancel2"])
				.set("choiceList", ["选项一：摸一张牌", "选项二：回复1点体力", "选项三：使用一张牌", "背水，减少1点体力上限"])
				.set("displayIndex", false)
				.set("ai", () => {
					return get.player().hp <= 2 ? "选项二" : "选项一";
				})
				.set("prompt", get.prompt(event.skill))
				.forResult();
			event.result = {
				bool: result.index != 4,
				cost_data: result.index,
			};
		},
		async content(event, trigger, player) {
			const num = event.cost_data;
			if (num == 3) {
				player.popup("背水", "thunder");
			}
			if (num == 0 || num == 3) {
				await player.draw();
			}
			if (num == 1 || num == 3) {
				await player.recover();
			}
			if (num == 2 || num == 3) {
				await player.chooseToUse({
					filterCard(card, player, event) {
						if (get.itemtype(card) != "card") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					prompt: "鏊勇：是否使用一张牌？",
					addCount: false,
				});
			}
			if (num == 3) {
				await player.loseMaxHp();
			}
		},
	},
	petongkai: {
		trigger: { global: "useCardToTargeted" },
		filter(event, player) {
			return get.is.damageCard(event.card) && get.distance(player, event.target) <= 1 && event.target.isIn();
		},
		logTarget: "target",
		async content(event, trigger, player) {
			await player.draw();
			if (trigger.target == player || !trigger.target?.isIn() || !player.countCards("he")) {
				return;
			}
			const result = await player.chooseToGive(true, "he", trigger.target).set("visibleMove", true).forResult();
			if (!result?.bool) {
				return;
			}
			await game.delay();
			const card = result.cards[0];
			if (trigger.target.getCards("h").includes(card) && get.type(card) == "equip") {
				trigger.target.chooseUseTarget(card);
			}
		},
		ai: { threaten: 1.1 },
	},
	// 曹操＆袁绍 by 刘巴
	yjguibei: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
		},
		async content(event, trigger, player) {
			await player.draw(4);
			let zhu = game.findPlayer(i => i.getSeatNum() == 1);
			if (zhu && zhu.getPrevious() != player) {
				game.broadcastAll(
					function (target1, target2) {
						game.swapSeat(target1, target2);
					},
					player,
					zhu.getPrevious()
				);
			}
			let newzhu = game.findPlayer(i => i.getSeatNum() == 1);
			if (trigger.name === "phase" && newzhu != zhu && !trigger._finished) {
				trigger.finish();
				trigger._finished = true;
				trigger._triggered = 5;
				const evt = newzhu.insertPhase();
				delete evt.skill;
				const evt2 = trigger.getParent();
				if (evt2.name == "phaseLoop" && evt2._isStandardLoop) {
					evt2.player = newzhu;
				}
				//跳过新回合的phaseBefore
				evt.pushHandler("onPhase", (event, option) => {
					if (event.step === 0 && option.state === "begin") {
						event.step = 1;
					}
				});
			}
			await game.delay();
		},
	},
	yjjiechu: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (storage) {
					return "当你成为【杀】的目标时，你可以弃置一张手牌改变【杀】的花色和属性。";
				} else {
					return "出牌阶段，你可以视为使用一张【顺手牵羊】，结算结束后成为目标的角色可以对你使你一张【杀】。";
				}
			},
		},
		group: ["yjjiechu_use", "yjjiechu_sha"],
		subSkill: {
			sha: {
				trigger: {
					target: "useCardToTarget",
				},
				filter(event, player) {
					return player.storage?.yjjiechu && event?.card.name === "sha";
				},
				async cost(event, trigger, player) {
					let suits = [],
						bool = false;
					game.getAllGlobalHistory("everything", evt => {
						if (evt.name == "damage" && evt.player == player && evt.card) {
							suits.add(get.suit(evt.card));
						}
					});
					if (suits.includes(get.suit(trigger.card)) && player.hasSkill("yjdaojue")) {
						bool = true;
					}
					let list = lib.linked.slice(0).remove("kami");
					if (
						list.some(nature => {
							if (nature == trigger.card?.nature) {
								return false;
							}
							let card = new lib.element.VCard(trigger.card, trigger.cards, null, nature);
							return get.effect(player, card, trigger.player, player) > get.effect(player, trigger.card, trigger.player, player);
						})
					) {
						bool = true;
					}
					event.result = await player
						.chooseToDiscard(get.prompt("yjjiechu"), "chooseonly", "h")
						.set("prompt2", `你可以弃置一张手牌，改变${get.translation(trigger.card)}的花色和属性。`)
						.set("resultx", bool)
						.set("ai", card => {
							if (!get.event().resultx) {
								return 0;
							}
							return 7 - get.value(card);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					player.changeZhuanhuanji("yjjiechu");
					await player.discard(event.cards);
					const suits = lib.suit.slice(0).remove(get.suit(trigger.card)),
						natures = lib.linked.slice(0).remove("kami").remove(trigger.card.nature);
					let records = suits.slice(0);
					game.getAllGlobalHistory("everything", evt => {
						if (evt.name == "damage" && evt.player == player && evt.card) {
							records.remove(get.suit(evt.card));
						}
					});
					let nature = trigger.card.nature;
					for (let i of natures) {
						let card1 = new lib.element.VCard(trigger.card, trigger.cards, null, i),
							card2 = new lib.element.VCard(trigger.card, trigger.cards, null, nature);
						let eff1 = get.effect(player, card1, trigger.player, player),
							eff2 = get.effect(player, card2, trigger.player, player);
						if (eff1 > eff2) {
							nature = i;
						}
					}
					const result = await player
						.chooseButton(["劫出：改变此牌的花色和属性", [suits.map(i => ["", "", `lukai_${i}`]), "vcard"], [natures.map(i => [i, get.translation(i)]), "tdnodes"]], 2, true)
						.set("filterButton", button => {
							if (!ui.selected.buttons.length) {
								return true;
							}
							let bool = link => Array.isArray(link);
							return bool(button.link) != bool(ui.selected.buttons[0].link);
						})
						.set("records", records)
						.set("nature", nature)
						.set("ai", button => {
							const { records, nature } = get.event();
							if (Array.isArray(button.link)) {
								if (records.includes(button.link[2].slice(6))) {
									return 1 + Math.random();
								}
								return Math.random();
							}
							if (nature == button.link) {
								return 1 + Math.random();
							}
							return Math.random();
						})
						.forResult();
					if (!result.bool) {
						return;
					}
					if (Array.isArray(result.links[0])) {
						result.links.reverse();
					}
					const naturex = result.links[0],
						suit = result.links[1][2].slice(6);
					player.popup(get.translation(suit));
					game.log(trigger.card, "被转为了", "#y" + get.translation(suit), "花色");
					game.broadcastAll(
						(card, suit) => {
							card.suit = suit;
						},
						trigger.card,
						suit
					);
					player.popup(`${get.translation(naturex)}杀`, naturex);
					game.log(trigger.card, "被转为了", "#y" + get.translation(naturex), "属性");
					game.setNature(trigger.card, naturex);
				},
			},
			effect: {
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					return event.targets.length && event?.card?.storage?.yjjiechu;
				},
				charlotte: true,
				silent: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					for (const c of trigger.targets.filter(c => c.isIn()).sortBySeat()) {
						await c
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) !== "sha") {
										return false;
									}
									return lib.filter.filterCard.apply(this, arguments);
								},
								"你可对" + get.translation(player) + "使用一张杀"
							)
							.set("targetRequired", true)
							.set("complexTarget", true)
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								const sourcex = get.event().sourcex;
								if (target !== sourcex && !ui.selected.targets.includes(sourcex)) {
									return false;
								}
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("sourcex", player);
					}
				},
			},
			use: {
				enable: "phaseUse",
				prompt: "你可以视为使用一张【顺手牵羊】，结算结束后成为目标的角色可以对你使用一张【杀】。",
				viewAs: {
					name: "shunshou",
					storage: {
						yjjiechu: true,
					},
					isCard: true,
				},
				filterCard: () => false,
				selectCard: -1,
				viewAsFilter(player) {
					return !player.storage?.yjjiechu;
				},
				precontent() {
					player.addTempSkill("yjjiechu_effect");
					player.changeZhuanhuanji("yjjiechu");
				},
			},
		},
	},
	yjdaojue: {
		dutySkill: true,
		onremove(player, skill) {
			player.removeTip(skill);
		},
		derivation: ["yjqingzheng", "yjzhian", "feiying", "rehujia", "olsbshenli", "yjzhuni", "olsbshishou"],
		group: ["yjdaojue_effect", "yjdaojue_achieve", "yjdaojue_fail"],
		subSkill: {
			fail: {
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					return player.getAllHistory("useCard", evt => evt.getParent(3).skill === "yjdaojue_effect").length === 3;
				},
				skillAnimation: true,
				animationColor: "metal",
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.awakenSkill("yjdaojue");
					player.removeTip("yjdaojue");
					player.popup("袁绍");
					game.log(player, "使命失败");
					await player.removeSkills("yjjiechu");
					await player.changeGroup("qun");
					await player.addSkills(["olsbshenli", "yjzhuni", "olsbshishou"]);
				},
			},
			achieve: {
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				skillAnimation: true,
				animationColor: "metal",
				forced: true,
				locked: false,
				filter(event, player) {
					return (
						player
							.getAllHistory("gain", evt => evt.getParent(2).skill === "yjdaojue_effect")
							.map(c => c.cards.length)
							.reduce((sum, cur) => sum + cur, 0) >= 3
					);
				},
				async content(event, trigger, player) {
					player.awakenSkill("yjdaojue");
					player.removeTip("yjdaojue");
					player.popup("曹操");
					game.log(player, "成功完成使命");
					await player.removeSkills("yjjiechu");
					await player.changeGroup("wei");
					await player.addSkills(["yjzhian", "yjqingzheng", "rehujia"]);
				},
			},
			effect: {
				audio: "yjdaojue",
				trigger: {
					player: "damageBegin4",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return (
						lib.suit.includes(get.suit(event.card)) &&
						game.getAllGlobalHistory(
							"everything",
							evt => {
								return evt.name == "damage" && evt.player == player && get.suit(evt?.card, player) === get.suit(event?.card, player);
							},
							event
						).length === 1
					);
				},
				async content(event, trigger, player) {
					trigger.cancel();
					player.addTip(
						"yjdaojue",
						"道抉 " +
							game
								.getAllGlobalHistory(
									"everything",
									evt => {
										return evt.name == "damage" && evt.player == player && lib.suit.includes(get.suit(evt?.card, player));
									},
									trigger
								)
								.map(c => get.suit(c?.card, player))
								.unique()
								.reduce((str, i) => str + get.translation(i), "")
					);
					const card = trigger.cards.filter(c => get.position(c, true) === "o");
					if (!card.length) {
						await player
							.chooseToUse(function (card, player, event) {
								if (get.name(card) !== "sha") {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							}, "是否对所有角色使用一张杀？")
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("selectTarget", -1)
							.set("filterTarget", function (card, player, target) {
								return lib.filter.targetEnabled.apply(this, arguments);
							});
						return;
					}
					const result = await player
						.chooseControlList(get.prompt(event.name), ["获得" + get.translation(card), "使用一张指定所有其他角色的【杀】。"], true)
						.set("ai", () => {
							if (
								get
									.event()
									.card.map(c => get.value(c))
									.reduce((sum, cur) => sum + cur, 0) > 4
							) {
								return 0;
							} else {
								return 1;
							}
						})
						.set("card", card)
						.forResult();
					if (result.index === 0) {
						await player.gain(card, "gain2", "log");
					} else if (player.hasUsableCard("sha", "use")) {
						await player
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) !== "sha") {
										return false;
									}
									return lib.filter.filterCard.apply(this, arguments);
								},
								"对所有角色使用一张杀",
								true
							)
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("selectTarget", -1)
							.set("filterTarget", function (card, player, target) {
								return lib.filter.targetEnabled.apply(this, arguments);
							});
					}
				},
			},
		},
	},
	yjzhian: {
		audio: "twzhian",
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (get.type(event.card) == "basic") {
				return false;
			}
			return player.isDamaged() || player.countCards("h") || !player.hasSkill("yjzhian_delete");
		},
		usable(skill, player) {
			return Math.max(1, player.getDamagedHp());
		},
		async cost(event, trigger, player) {
			const cards = trigger.cards?.filterInD("ejod") || [];
			let list = ["选项一", "选项二", "选项三", "cancel2"],
				choiceList = [`弃置一张手牌${cards.length ? `并获得${get.translation(cards)}` : ""}`, "回复1点体力，此技能本轮失效", `对${get.translation(trigger.player)}造成${get.cnNumber(Math.max(1, player.getDamagedHp()))}点伤害，获得〖飞影〗并删去此项`];
			let choice = "cancel2";
			if (player.isDamaged()) {
				if (player.hp <= 1) {
					choice = "选项二";
				}
			} else {
				list.remove("选项二");
				choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
			}
			if (!player.countCards("h")) {
				list.remove("选项一");
				choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
			} else {
				if (cards.length && player.hp > 1) {
					let result = 0,
						card = trigger.card,
						owner = get.owner(card);
					if (owner) {
						if (get.position(card) == "j") {
							const vcard = { name: card.viewAs || card.name, cards: [card] };
							result += get.effect(player, vcard, player, player) * get.sgn(get.attitude(player, owner));
						} else {
							result += (get.value(card, owner) - 0.01) * get.sgn(get.attitude(player, owner));
						}
					} else {
						result += cards.reduce((sum, i) => sum + get.value(i, player), 0);
					}
					result -= get.recoverEffect(player);
					if (
						result >
						player
							.getCards("h")
							.map(i => get.value(i))
							.minBy(i => i)
					) {
						choice = "选项一";
					}
				}
			}
			if (player.hasSkill("yjzhian_delete")) {
				list.remove("选项三");
				choiceList[2] = `<span style="opacity:0.5">${choiceList[2]}</span>`;
			} else if (get.damageEffect(trigger.player, player) > 0 && choice == "cancel2") {
				choice = "选项三";
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", get.prompt(event.skill, trigger.player))
				.set("choiceList", choiceList)
				.set("ai", () => get.event().choice)
				.set("choice", choice)
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.control,
				targets: [trigger.player],
			};
		},
		async content(event, trigger, player) {
			switch (event.cost_data) {
				case "选项一": {
					await player.chooseToDiscard("h", true);
					await player.gain(trigger.cards.filterInD("odej"), "gain2");
					break;
				}
				case "选项二": {
					await player.recover();
					player.tempBanSkill(event.name, "roundEnd");
					break;
				}
				case "选项三": {
					player.addSkill("yjzhian_delete");
					await trigger.player.damage(Math.max(1, player.getDamagedHp()));
					await player.addSkills("feiying");
				}
			}
		},
		subSkill: {
			delete: {
				charlotte: true,
			},
		},
		derivation: "feiying",
	},
	yjqingzheng: {
		audio: "sbqingzheng",
		inherit: "mbcmqingzheng",
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards: cards1,
			} = event;
			await player.showHandcards();
			await player.discard(cards1);
			if (
				!target.countCards("h") ||
				lib.suits
					.slice()
					.filter(suit => target.hasCard((card, playerx) => get.suit(card, playerx) === suit, "h"))
					.every(suit => target.hasCard((card, playerx) => get.suit(card, playerx) === suit && !lib.filter.cardDiscardable(card, player), "h"))
			) {
				if (target.countCards("h")) {
					await target.showHandcards();
				}
				return;
			}
			const list = get.addNewRowList(target.getCards("h"), "suit", target);
			let result = await player
				.chooseButton(
					[
						[
							[[`清正：弃置${get.translation(target)}一种花色的所有牌`], "addNewRow"],
							[
								dialog => {
									dialog.classList.add("fullheight");
									dialog.forcebutton = false;
									dialog._scrollset = false;
								},
								"handle",
							],
							list.map(item => [Array.isArray(item) ? item : [item], "addNewRow"]),
						],
					],
					true
				)
				.set("filterButton", button => {
					const player = get.player();
					if (!button.links.length || button.links.some(card => !lib.filter.cardDiscardable(card, player, get.event().getParent().name))) {
						return false;
					}
					return true;
				})
				.set("ai", button => {
					const player = get.player();
					return button.links.length;
				})
				.forResult();
			if (!result?.links?.length) {
				return;
			}
			await target.showHandcards();
			const cards2 = target.getCards("h", card => result.links.includes(get.suit(card, target)));
			if (cards2.length) {
				await target.modedDiscard(cards2, player);
			}
			if (cards1.length > cards2.length) {
				await target.damage(player);
			}
		},
		persevereSkill: false,
	},
	yjzhuni: {
		inherit: "jsrgzhuni",
		async contentAfter(event, trigger, player) {
			let num = event.getParent().maxTicket;
			if (num && typeof num == "number") {
				await player.draw(num);
			}
		},
	},
	yjtuonan: {
		trigger: {
			player: "dying",
		},
		mark: true,
		skillAnimation: true,
		limited: true,
		animationColor: "orange",
		unique: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recover();
			const skills = player.getSkills(null, false, false).filter(skill => {
				let info = get.info(skill);
				if (!info || info.charlotte || get.skillInfoTranslation(skill, player).length == 0) {
					return false;
				}
				let list = get.skillCategoriesOf(skill, player);
				list.removeArray(["Charlotte"]);
				return list.length;
			});
			if (!skills.length) {
				return;
			}
			const result =
				skills.length > 1
					? await player
							.chooseButton(["脱难：失去一个有标签的技能", [skills, "skill"]], true)
							.set("displayIndex", false)
							.set("ai", button => {
								const { link } = button;
								if (link == "petuonan") {
									return 2;
								}
								return 1;
							})
							.forResult()
					: { bool: true, links: skills };
			if (result?.bool && result?.links?.length) {
				await player.removeSkills(result.links);
			}
		},
	},
	// 车胄
	// 沟槽的秘密指定还在追我
	psanmou: {
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(target => target != player);
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget(`暗谋：请暗中指定一名其他角色，然后你与其互相对对方使用牌无次数限制`, true, lib.filter.notMe)
				.set("ai", target => -get.attitude(get.player(), target))
				.set("animate", false)
				.forResult();
			if (result?.targets) {
				const target = result.targets[0],
					skill = event.name + "_effect";
				player.addSkill(skill);
				player.updateStorage(skill, storage => storage.concat([target]).sortBySeat(), false);
				if (!player.storage[skill]) {
					player.storage[skill] = [];
				}
				player.storage[skill].add(target);
				player.storage[skill].sortBySeat();
				//我自己选的我自己会不知道？(doge)
				const func = (player, target, skill) => {
					player.markSkill(skill, null, null, true);
				};
				if (player == game.me) {
					func(player, target, skill);
				} else if (event.isOnline()) {
					player.send(func, player, target, skill);
				}
				target.addSkill(skill);
				target.updateStorage(skill, storage => storage.concat([player]).sortBySeat(), false);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "players",
				},
				mod: {
					cardUsableTarget(card, player, target) {
						if (player.getStorage("psanmou_effect").includes(target)) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	pstousuan: {
		trigger: { global: "damageBegin1" },
		filter(event, player) {
			const skill = "psanmou_effect";
			if (!event.source) {
				return false;
			}
			if (event.source != player && event.player != player) {
				return false;
			}
			return event.source.getStorage(skill).includes(event.player) && !event.source.getRoundHistory("sourceDamage", evt => evt.player == player).length;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
			await player.draw(3);
			await player.removeSkills(event.name);
		},
		ai: {
			combo: "psanmou",
		},
	},
	// 雍闿
	// 你也有xiaofan？
	psxiaofan: {
		trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "damageEnd"] },
		filter(event, player, name, target) {
			if (!target?.isIn()) {
				return false;
			}
			if (event.name == "damage") {
				return target.group == "shu" && event.getParent().name != "psxiaofan";
			}
			return true;
		},
		getIndex(event, player, name) {
			if (event.name == "damage") {
				return [event.player];
			}
			return game
				.filterPlayer(current => {
					if (current.group != "wu") {
						return false;
					}
					return event.getl?.(current)?.cards2?.some(card => get.type(card) == "equip");
				})
				.sortBySeat();
		},
		logTarget: (event, player, triggername, target) => target,
		check(event, player, triggername, target) {
			if (event.name == "damage") {
				return get.damageEffect(target, player, player) > 0;
			}
			return [player, target].reduce((sum, i) => sum + get.effect(i, { name: "draw" }, player, player), 0) > 0;
		},
		prompt2(event, player, triggername, target) {
			if (event.name == "damage") {
				return `对${get.translation(target)}造成1点伤害${player.group != "wu" ? "，然后你变更势力至吴" : ""}`;
			}
			return `与${get.translation(target)}各摸一张牌${player.group != "qun" ? "，然后你变更势力至群" : ""}`;
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (trigger.name == "damage") {
				await target.damage();
				if (player.group != "wu") {
					await player.changeGroup("wu");
				}
			} else {
				await game.asyncDraw([player, target].sortBySeat());
				if (player.group != "qun") {
					await player.changeGroup("qun");
				}
			}
		},
		group: "psxiaofan_source",
		subSkill: {
			source: {
				trigger: { global: "damageSource" },
				filter(event, player) {
					return event.source?.group === "qun" && event.cards?.someInD();
				},
				prompt2(event, player) {
					return `获得${get.translation(event.cards.filterInD())}${player.group != "shu" ? "，然后你变更势力至蜀" : ""}`;
				},
				async content(event, trigger, player) {
					if (trigger.cards?.someInD()) {
						await player.gain(trigger.cards.filterInD(), "gain2");
					}
					if (player.group != "shu") {
						await player.changeGroup("shu");
					}
				},
			},
		},
	},
	psjiaohu: {
		groupSkill: "shu",
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed && player.group == "shu";
		},
		forced: true,
		async content(event, trigger, player) {
			const target = game.findPlayer(current => get.info("jsrgzhenglve").isFirst(current));
			let num = 1;
			if (target?.getDamagedHp()) {
				num += target.getDamagedHp();
			}
			trigger.num += num;
		},
	},
	psquanpan: {
		groupSkill: "wu",
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current != player) || player.group != "wu") {
				return false;
			}
			return event.getg?.(player).some(card => get.owner(card) == player && get.position(card) == "h" && get.type(card) == "equip");
		},
		async cost(event, trigger, player) {
			const cards = trigger.getg(player).filter(card => get.owner(card) == player && get.position(card) == "h" && get.type(card) == "equip");
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.skill),
					prompt2: "展示并交给一名其他角色其中一张牌",
					filterCard(card) {
						return get.event().cards.includes(card);
					},
					filterTarget: lib.filter.notMe,
					ai1(card) {
						return 3 / (Math.abs(get.value(card)) + 0.1);
					},
					ai2(target) {
						const player = get.player();
						return get.value(ui.selected.cards, target) * get.attitude(player, target);
					},
				})
				.set("cards", cards)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
			await player.give(cards, target);
		},
	},
	pshuoluan: {
		groupSkill: "qun",
		trigger: { global: "damageBegin1" },
		filter(event, player) {
			const { player: target, source } = event;
			if (!source) {
				return false;
			}
			const list = [target, source];
			if (!list.includes(player) || player.group != "qun") {
				return false;
			}
			if (player == source) {
				list.reverse();
			}
			return list[1].group == "shu";
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	//e系列纪灵
	yjshuangren: {
		audio: "shuangren",
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const { bool } = await player.chooseToCompare(event.target).forResult();
			if (bool) {
				player.addTempSkill("yjshuangren_count");
				player.addMark("yjshuangren_count", 1, false);
				let num = 0;
				while (num < player.countMark("yjshuangren_count")) {
					num++;
					const card = { name: "sha", isCard: true };
					if (player.hasUseTarget(card)) {
						const result = await player.chooseUseTarget(card, false).forResult();
						if (!result.bool) {
							break;
						}
					} else {
						break;
					}
				}
			} else {
				player.addTempSkill("yjshuangren_viewas");
			}
		},
		ai: {
			order(name, player) {
				const cards = player.getCards("h");
				for (let i = 0; i < cards.length; i++) {
					if (get.number(cards[i]) > 11 && get.value(cards[i]) < 7) {
						return 9;
					}
				}
				return get.order({ name: "sha" }) - 0.1;
			},
			result: {
				player(player) {
					const num = player.countCards("h");
					if (num > player.hp) {
						return 0;
					}
					if (num == 1) {
						return -1;
					}
					if (num == 2) {
						return -0.7;
					}
					return -0.5;
				},
				target(player, target) {
					const num = target.countCards("h");
					if (num == 1) {
						return -2;
					}
					if (num == 2) {
						return -1;
					}
					return -0.7;
				},
			},
			threaten: 1.3,
		},
		subSkill: {
			count: {
				charlotte: true,
				onremove: true,
			},
			viewas: {
				charlotte: true,
				mod: {
					cardname(card, player) {
						if (card.name == "sha") {
							return "shan";
						}
					},
					cardnumber(card) {
						if (card.name == "sha") {
							return 13;
						}
					},
				},
			},
		},
	},
	//线下幻系列
	yjqingjiao: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.hasHistory("sourceDamage", evt => evt.player.group === "qun" && evt.player !== player);
		},
		forced: true,
		zhuSkill: true,
		content() {
			player.draw();
		},
	},
	//线下E系列
	//钟会
	psmouchuan: {
		trigger: {
			global: "roundStart",
		},
		async content(event, trigger, player) {
			await player.draw(2);
			if (!player.countCards("he") || !game.hasPlayer(current => current != player)) {
				return;
			}
			const { cards, targets } = await player
				.chooseCardTarget({
					forced: true,
					prompt: get.prompt("psmouchuan"),
					prompt2: "将一张牌交给一名其他角色",
					filterTarget: lib.filter.notMe,
					filterCard: true,
					position: "he",
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						return get.attitude(player, target);
					},
				})
				.forResult();
			if (!cards || !cards.length || !targets || !targets.length) {
				return;
			}
			const [target] = targets;
			await player.give(cards, target);
			if ([player, target].some(i => !i.countCards("h"))) {
				return;
			}
			let card1, card2;
			if (player.countCards("h")) {
				const { cards: cardp } = await player.chooseCard("请展示一张手牌", true, "h").forResult();
				await player.showCards(cardp);
				card1 = cardp[0];
			}
			if (target.countCards("h")) {
				const { cards: cardt } = await target.chooseCard("请展示一张手牌", true, "h").forResult();
				await target.showCards(cardt);
				card2 = cardt[0];
			}
			if (card1 && card2) {
				const skill = get.color(card1, player) == get.color(card2, target) ? "psdaohe" : "pszhiyi";
				await player.addTempSkills(skill, "roundStart");
			}
		},
		derivation: ["psdaohe", "pszhiyi"],
	},
	pszizhong: {
		mod: {
			maxHandcard(player, num) {
				return num + get.info("jsrgjuxia").countSkill(player);
			},
		},
		trigger: {
			player: ["useCard", "respond"],
		},
		filter(event, player) {
			const num = get.info("jsrgjuxia").countSkill(player) - 2;
			if (num <= 0 || get.type(event.card) == "equip") {
				return false;
			}
			let name = get.name(event.card),
				stat =
					player.getRoundHistory("useCard", evt => {
						return evt != event && get.name(evt.card) == name;
					}).length +
					player.getRoundHistory("respond", evt => {
						return evt != event && get.name(evt.card) == name;
					}).length;
			return stat == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = get.info("jsrgjuxia").countSkill(player) - 2;
			await player.draw(num);
		},
	},
	psjizun: {
		trigger: { player: "dyingAfter" },
		filter(event, player) {
			return player.isDamaged() || !player.hasSkill("psqingsuan");
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "orange",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			if (!player.hasSkill("psqingsuan")) {
				await player.addSkills("psqingsuan");
			} else {
				await player.recoverTo(player.maxHp);
			}
		},
		derivation: "psqingsuan",
	},
	psqingsuan: {
		locked: true,
		zhuSkill: true,
		getEnemies(player) {
			const enemies = [];
			player.checkAllHistory("damage", evt => {
				if (evt.source && player.group != evt.source.group) {
					enemies.add(evt.source);
				}
			});
			return enemies;
		},
		mod: {
			targetInRange(card, player, target) {
				if (get.info("psqingsuan").getEnemies(player).includes(target)) {
					return true;
				}
			},
			cardUsableTarget(card, player, target) {
				if (get.info("psqingsuan").getEnemies(player).includes(target)) {
					return true;
				}
			},
		},
	},
	psdaohe: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.countCards("h"));
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.chooseToGive(player, "h", [1, Infinity], true, "allowChooseAll").set("ai", card => {
				const player = get.player(),
					target = get.event().target,
					att = get.attitude(player, target);
				if (att <= 0) {
					if (ui.selected.cards.length) {
						return 0;
					}
					return 6 - get.value(card);
				}
				return target.getUseValue(card);
			});
			await target.recover();
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if (target.isHealthy()) {
						return get.effect(target, { name: "shunshou_copy2" }, player, player);
					}
					return get.recoverEffect(target, player, player);
				},
			},
		},
	},
	pszhiyi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw();
			await target.damage();
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					return get.effect(target, { name: "draw" }, player, player) + get.damageEffect(target, player, player);
				},
			},
		},
	},
	//鄂焕
	psdiwan: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.isFirstTarget;
		},
		frequent: true,
		usable: 1,
		content() {
			player.draw(trigger.targets.length);
		},
	},
	pssuiluan: {
		trigger: { player: "useCard2" },
		filter(event, player) {
			if (player.group != "qun" || event.card.name != "sha") {
				return false;
			}
			return (
				game.countPlayer(target => {
					return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
				}) > 1
			);
		},
		groupSkill: "qun",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2(event.skill),
					(card, player, target) => {
						const event = get.event().getTrigger();
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					},
					2
				)
				.set("ai", target => {
					const player = get.event().player,
						event = get.event().getTrigger();
					return get.effect(target, event.card, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.targets.addArray(event.targets);
			player.addTempSkill("pssuiluan_effect");
			trigger.card.pssuiluan = true;
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "damageEnd"] },
				filter(event, player) {
					if (event.name == "damage") {
						return player.group != "shu" && event.getParent(4).name == "pssuiluan_effect";
					}
					return event.card.pssuiluan && (event.targets || []).some(i => i.isIn());
				},
				forced: true,
				popup: false,
				forceDie: true,
				async content(event, trigger, player) {
					if (trigger.name == "damage") {
						await player.changeGroup("shu");
						return;
					}
					const targets = trigger.targets.filter(i => i.isIn()).sortBySeat();
					for (const target of targets) {
						await target
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) != "sha") {
										return false;
									}
									return lib.filter.filterCard.apply(this, arguments);
								},
								"随乱：是否对" + get.translation(player) + "使用一张【杀】？"
							)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
									return false;
								}
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("complexTarget", true)
							.set("sourcex", player);
					}
				},
			},
		},
	},
	psconghan: {
		trigger: { global: "damageSource" },
		filter(event, player) {
			if (player.group != "shu" || !event.source || !event.player.isIn()) {
				return false;
			}
			return event.source.getSeatNum() == 1 && (player.hasSha() || (_status.connectMode && player.countCards("hs")));
		},
		direct: true,
		groupSkill: "shu",
		seatRelated: true,
		clearTime: true,
		content() {
			player
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					get.prompt2("psconghan", trigger.player)
				)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("logSkill", ["psconghan", trigger.player])
				.set("sourcex", trigger.player);
		},
	},
	//肘击
	psyanmou: {
		getCards(event, player) {
			let cards = [];
			if (event.name == "cardsDiscard") {
				const evt = event.getParent().relatedEvent;
				if (evt && evt.name == "judge" && evt.player != player) {
					cards.addArray(event.cards.filter(i => get.position(i, true) == "d"));
				}
			} else {
				if (event.type == "discard" && event.getlx !== false) {
					for (const target of game.filterPlayer2()) {
						if (target == player) {
							continue;
						}
						const evt = event.getl(target);
						if (evt && (evt.cards2 || []).length) {
							cards.addArray((evt.cards2 || []).filter(i => i.original != "j" && get.position(i, true) == "d"));
						}
					}
				}
			}
			return cards.filter(card => {
				return card.name == "huogong" || (card.name == "sha" && game.hasNature(card, "fire"));
			});
		},
		trigger: { global: ["cardsDiscardAfter", "loseAfter", "loseAsyncAfter"] },
		filter(event, player) {
			return lib.skill.psyanmou.getCards(event, player).length;
		},
		prompt2(event, player) {
			return "获得" + get.translation(lib.skill.psyanmou.getCards(event, player));
		},
		frequent: true,
		content() {
			player.gain(lib.skill.psyanmou.getCards(trigger, player), "gain2");
		},
		group: "psyanmou_chooseToUse",
		subSkill: {
			chooseToUse: {
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					return event.getg && event.getg(player).length;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					let cards = trigger.getg(player);
					await player.showCards(cards, get.translation(player) + "发动了【炎谋】");
					cards = cards.filter(card => {
						if (!player.hasUseTarget(card) || get.owner(card) !== player) {
							return false;
						}
						return get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire"));
					});
					if (cards.length) {
						await player
							.chooseToUse(function (card, player, event) {
								if (get.itemtype(card) != "card" || !get.event().cards.includes(card)) {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							}, "炎谋：选择使用其中的一张【火攻】或火【杀】")
							.set("cards", cards)
							.set("filterTarget", function (card, player, target) {
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("forced", true)
							.set("addCount", false);
					}
				},
			},
		},
	},
	pszhanyan: {
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => player.inRange(target));
		},
		usable: 1,
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		delay: 0,
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			let damages = 0,
				puts = 0;
			player.line(targets);
			await game.delay();
			for (const target of targets) {
				let dialog = ["绽焰：将手牌中或弃牌堆中的一张【火攻】或火【杀】置于牌堆顶，或受到1点火焰伤害"];
				const Tcards = target.getCards("h", card => {
					return get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire"));
				});
				const Pcards = Array.from(ui.discardPile.childNodes).filter(card => {
					return card.name == "huogong" || (card.name == "sha" && game.hasNature(card, "fire"));
				});
				if (Tcards.length) {
					dialog.push('<div class="text center">手牌区</div>');
					dialog.push(Tcards);
				}
				if (Pcards.length) {
					dialog.push('<div class="text center">弃牌堆</div>');
					dialog.push(Pcards);
				}
				let result;
				if (Tcards.length + Pcards.length == 0) {
					result = { bool: false };
				} else {
					result = await target
						.chooseButton(dialog)
						.set("ai", button => {
							const player = get.event().player,
								source = get.event().getParent().player;
							if (get.damageEffect(source, player, player) <= 0 && get.attitude(player, source) <= 0) {
								return 0;
							}
							if (!get.owner(button.link)) {
								return 114514;
							}
							return 20 - get.value(button.link);
						})
						.forResult();
				}
				if (result.bool) {
					puts++;
					const card = result.links[0];
					target.$throw([card], 1000);
					if (get.owner(card)) {
						await get.owner(card).lose([card], ui.cardPile);
					} else {
						ui.discardPile.removeChild(card);
					}
					await game.cardsGotoPile(card, "insert");
					//ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
					game.updateRoundNumber();
					game.log(target, "将" + get.translation(card) + "置于牌堆顶");
				} else {
					damages++;
					await target.damage(1, "fire");
				}
				await game.delay(0.5);
			}
			const num = Math.min(damages, puts);
			if (num) {
				await player.draw(num);
			}
		},
		ai: {
			order: 9,
			result: { player: 1 },
		},
	},
	psyuhuo: {
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
					if (get.tag(card, "fireDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
		mod: {
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && (get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire")))) {
					return false;
				}
			},
			ignoredHandcard(card, player) {
				if (get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire"))) {
					return true;
				}
			},
		},
	},
	//田钏
	pshuying: {
		trigger: {
			global: ["phaseBefore", "dieAfter"],
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "die") {
				return event.player != player;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			let cards = [],
				num = trigger.name == "die" ? 1 : 2;
			while (cards.length < num) {
				const card = game.createCard2("xingbian", "spade", 9);
				cards.push(card);
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.name == "xingbian") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.name == "xingbian") {
					return false;
				}
			},
			globalTo(from, to, num) {
				let count = 0;
				game.filterPlayer(current => {
					count += current.countCards("ej", card => card.name == "xingbian");
				});
				return num + count;
			},
		},
	},
	psqianjing: {
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			if (!player.countCards("h", card => card.name == "xingbian")) {
				return false;
			}
			return game.hasPlayer(current => current.hasEnabledSlot());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard(card) {
						return card.name == "xingbian";
					},
					position: "h",
					prompt: get.prompt(event.skill),
					prompt2: "将手牌中的一张【刑鞭】置入一名角色装备区",
					filterTarget(card, player, target) {
						return target.hasEnabledSlot();
					},
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						if (target == player) {
							return 1;
						}
						if (get.attitude(player, target) < 0) {
							return 3;
						}
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cardx = event.cards[0];
			const choices = [];
			for (let i = 0; i <= 5; i++) {
				if (target.hasEquipableSlot(i)) {
					choices.push(`equip${i}`);
				}
			}
			if (!choices.length) {
				return;
			}
			const result = await player
				.chooseControl(choices)
				.set("prompt", `请选择为${get.translation(target)}置入【刑鞭】的装备栏`)
				.set("ai", () => _status.event.controls.randomGet())
				.forResult();
			const card = get.autoViewAs(cardx);
			card.subtypes = [result.control];
			player.$give(card, target, false);
			await target.equip(card);
			if (target == player) {
				await player.draw();
			}
		},
		group: "psqianjing_use",
		subSkill: {
			use: {
				enable: "chooseToUse",
				filter(event, player) {
					if (!event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event)) {
						return false;
					}
					if (player.countCards("h", card => card.name == "xingbian")) {
						return true;
					}
					return game.hasPlayer(current => {
						return current.countCards("ej", card => card.name == "xingbian");
					});
				},
				delay: false,
				locked: false,
				prompt: "将场上或你手牌中的一张【刑鞭】当作【杀】使用",
				filterTarget(card, player, target) {
					let event = _status.event,
						evt = event;
					if (event._backup) {
						evt = event._backup;
					}
					const pos = target == player ? "hej" : "ej";
					return target.countCards(pos, card => {
						if (card.name != "xingbian") {
							return false;
						}
						let sha = get.autoViewAs({ name: "sha", storage: { qianjing: true } }, [card]);
						if (evt.filterCard(sha, player, event)) {
							return game.hasPlayer(function (current) {
								return evt.filterTarget(sha, player, current);
							});
						}
					});
				},
				async content(event, trigger, player) {
					var evt = event.getParent(2),
						target = event.targets[0];
					evt.set("xingbian", true);
					const result = await player
						.choosePlayerCard(true, target, target == player ? "hej" : "ej")
						.set("filterButton", function (button) {
							var card = button.link;
							return card.name == "xingbian";
						})
						.forResult();
					game.broadcastAll(
						function (result, name) {
							lib.skill.psqianjing_backup.viewAs = {
								name: name,
								cards: [result],
								storage: { qianjing: true },
							};
							lib.skill.psqianjing_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
						},
						result.links[0],
						"sha"
					);
					evt.set("_backupevent", "psqianjing_backup");
					evt.backup("psqianjing_backup");
					evt.set("openskilldialog", "选择杀（" + get.translation(result.links[0]) + "）的目标");
					evt.set("norestore", true);
					evt.set("custom", {
						add: {},
						replace: { window() {} },
					});
					evt.goto(0);
				},
				ai: {
					respondSha: true,
					skillTagFilter(player, tag) {
						var func = card => card.name == "xingbian";
						return game.hasPlayer(function (current) {
							return current.countCards(current == player ? "hej" : "ej", func);
						});
					},
					order: 1,
					result: {
						player(player, target) {
							if (_status.event.type != "phase") {
								return 1;
							}
							if (!player.hasValueTarget({ name: "sha" })) {
								return 0;
							}
							return 0.1;
						},
					},
				},
			},
			backup: {
				precontent() {
					var cards = event.result.card.cards;
					event.result.cards = cards;
					var owner = get.owner(cards[0]);
					event.target = owner;
					owner.$give(cards[0], player, false);
					player.popup(event.result.card.name, "metal");
					game.delayx();
					event.getParent().addCount = false;
				},
				filterCard: () => false,
				prompt: "请选择【杀】的目标",
				selectCard: -1,
				log: false,
			},
		},
	},
	psbianchi: {
		trigger: {
			player: "phaseJieshuEnd",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		logTarget(event, player) {
			return game.filterPlayer(current => {
				return current.countCards("ej", card => card.name == "xingbian");
			});
		},
		filter(event, player) {
			const targets = lib.skill.psbianchi.logTarget(event, player);
			return targets && targets.length;
		},
		check(event, player) {
			const targets = lib.skill.psbianchi.logTarget(event, player);
			let eff = 0;
			for (const target of targets) {
				eff += get.sgnAttitude(player, target);
			}
			return eff < 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const lose_list = [];
			for (const target of event.targets) {
				lose_list.push([target, target.getCards("ej", card => card.name == "xingbian")]);
			}
			await game
				.loseAsync({
					lose_list: lose_list,
					discarder: player,
				})
				.setContent("discardMultiple");
			for (const target of event.targets) {
				const result = await target
					.chooseControl()
					.set("choiceList", ["令" + get.translation(player) + "操控你执行一个仅能使用两张牌的出牌阶段", "失去2点体力"])
					.set(
						"choice",
						(function () {
							if (get.attitude(target, player) > 0) {
								return "选项一";
							}
							if (get.effect(target, { name: "losehp" }, target, target) > 0 && target.hp > 2) {
								return "选项二";
							}
							return "选项一";
						})()
					)
					.set("ai", () => {
						return _status.event.choice;
					})
					.forResult();
				if (result.control == "选项一") {
					target.addTempSkill("psbianchi_control", { player: "phaseUseEnd" });
					const next = target.phaseUse();
					next.owner = ["psbianchi", player];
					await next;
				} else {
					await target.loseHp(2);
				}
			}
		},
		subSkill: {
			control: {
				forced: true,
				charlotte: true,
				direct: true,
				trigger: {
					player: "phaseUseBefore",
				},
				filter(event, player) {
					return !player._trueMe && event?.owner?.[1].isIn() && player != event.owner[1];
				},
				content() {
					const owner = trigger.owner[1];
					player._trueMe = owner;
					game.addGlobalSkill("autoswap");
					if (player == game.me) {
						game.notMe = true;
						if (!_status.auto) {
							ui.click.auto();
						}
					}
				},
				mod: {
					cardEnabled(card, player) {
						let history = player.getHistory("useCard", evt => {
							let phaseUse = evt.getParent("phaseUse", true);
							return phaseUse?.player == player && phaseUse.owner?.[0] == "psbianchi";
						});
						if (history?.length >= 2) {
							return false;
						}
					},
					cardUsable(card, player) {
						return lib.skill.psbianchi_control.mod.cardEnabled.apply(this, arguments);
					},
					cardSavable(card, player) {
						return lib.skill.psbianchi_control.mod.cardEnabled.apply(this, arguments);
					},
				},
				onremove(player) {
					if (player._trueMe) {
						if (player == game.me) {
							if (!game.notMe) {
								game.swapPlayerAuto(player._trueMe);
							} else {
								delete game.notMe;
							}
							if (_status.auto) {
								ui.click.auto();
							}
						}
						delete player._trueMe;
					}
				},
			},
		},
	},
	xingbian_skill: {
		equipSkill: true,
		mod: {
			attackRange(player, distance) {
				return distance + player.countCards("e", card => card.name == "xingbian");
			},
		},
		trigger: {
			player: "phaseUseBegin",
		},
		forced: true,
		intro: {
			content(storage, player) {
				let str = "";
				for (const arg of storage) {
					str += `${get.translation(arg[0])}命你攻击${get.translation(arg[1])}<br>`;
				}
				return str.slice(0, -4);
			},
		},
		logTarget(event, player) {
			return game.filterPlayer(current => get.nameList(current).includes("yj_tianchuan"));
		},
		filter(event, player) {
			const targets = lib.skill.xingbian_skill.logTarget(event, player);
			return targets && targets.length;
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				const result = await target
					.chooseTarget(`刑鞭：为${get.translation(player)}指定塔塔开目标`, true, function (card, player, targetx) {
						return targetx != _status.event.owner;
					})
					.set("owner", player)
					.set("ai", target => {
						return get.distance(_status.event.owner, target) + 1;
					})
					.forResult();
				if (result.bool) {
					if (!player.getStorage("xingbian_skill").length) {
						player.when("phaseJieshuBegin").step(async () => {
							while (player.storage.xingbian_skill.length) {
								const args = player.storage.xingbian_skill.shift();
								let damage = true;
								if (player.getHistory("useCard", evt => evt.card.name == "sha" && evt.targets?.includes(args[1])).length) {
									damage = false;
								}
								if (player.getHistory("sourceDamage", evt => evt.player == args[1]).length) {
									damage = false;
								}
								if (damage === true) {
									args[0].chat("该罚！");
									args[0].line(player, "green");
									await player.damage(player);
								}
							}
							player.unmarkSkill("xingbian_skill");
							delete player.storage.xingbian_skill;
						});
						player.storage.xingbian_skill = [];
					}
					target.line(result.targets[0], "green");
					player.storage.xingbian_skill.push([target, result.targets[0]]);
					player.markSkill("xingbian_skill");
				}
			}
		},
	},
};

export default skills;
