import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//手杀神姜维
	mbguxuan: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return ["h", "e", "j"].some(pos => player.countDiscardableCards(player, pos));
		},
		forced: true,
		async content(event, trigger, player) {
			const position = ["h", "e", "j"].filter(pos => player.countDiscardableCards(player, pos)),
				map = { h: "手牌区", e: "装备区", j: "判定区" };
			let list = position.map(i => map[i]);
			const result = await player
				.chooseControl(list)
				.set("prompt", `###${get.translation(event.name)}：选择弃置自己一个区域内的所有牌###然后选择弃置至多等量名其他角色对应区域内的各一张牌。`)
				.set("ai", (event, player) => {
					const targets = game.filterPlayer(current => current != player),
						{ position, controls } = get.event(),
						list = {};
					for (const pos of position) {
						let info = targets
							.filter(target => target.countDiscardableCards(player, pos))
							.map(target => get.effect(target, { name: "guohe_copy", position: pos }, player, player))
							.filter(num => num >= 0)
							.sort((a, b) => b - a)
							.slice(0, player.countDiscardableCards(player, pos))
							.reduce((sum, num) => sum + num, 0);
						list[pos] = info - (pos == "j" ? -1 : 1) * get.value(player.getDiscardableCards(player, pos));
					}
					let choice = Object.entries(list).sort((a, b) => b[1] - a[1])[0];
					return { h: "手牌区", e: "装备区", j: "判定区" }[choice[0]];
				})
				.set("position", position)
				.forResult();
			if (!result?.control || result.control == "cancel2") {
				return;
			}
			const pos = { 手牌区: "h", 装备区: "e", 判定区: "j" }[result.control];
			const cards = await player.discard(player.getDiscardableCards(player, pos)).cards;
			let num = cards.length,
				doneList = new Map([[player, cards]]);
			while (num-- > 0) {
				if (!game.hasPlayer(current => current != player && !doneList.has(current) && current.countDiscardableCards(player, pos))) {
					break;
				}
				let result = await player
					.chooseTarget(`孤悬：选择一名其他角色，弃置其${{ h: "手牌区", e: "装备区", j: "判定区" }[pos]}内的一张牌`, true)
					.set("filterTarget", (_, player, target) => target != player && !get.event().doneList.get(target) && target.countDiscardableCards(player, get.event().pos))
					.set("ai", target => {
						const { pos, player } = get.event();
						return get.effect(target, { name: "guohe_copy", position: pos }, player, player);
					})
					.set("doneList", doneList)
					.set("pos", pos)
					.forResult();
				if (!result?.bool || !result.targets?.length) {
					break;
				}
				const target = result.targets[0];
				player.line(target);
				result = await player.discardPlayerCard(target, pos, true).forResult();
				if (result?.bool && result.links?.length) {
					doneList.set(target, result.links);
				}
			}
			if ([...doneList.keys()].length) {
				const targets = [...doneList.entries()].filter(([_, cards]) => !cards.some(card => get.name(card) == "sha")).map(([target]) => target);
				await game.doAsyncInOrder(targets, async target => {
					return target.loseHp();
				});
			}
		},
	},
	mbxinghun: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			const num = player.maxHp;
			const cards = get.cards(num, true);
			let result = await player
				.chooseToMove_new("星魂：选择任意张手牌牌进行交换", true)
				.set("list", [
					["牌堆顶的牌", cards],
					["你的手牌", player.getCards("h")],
				])
				.set("filterMove", (from, to, moved) => typeof to != "number")
				.set("processAI", list => {
					const player = get.player();
					let cards = list
						.map(i => i[1])
						.flat()
						.sort((a, b) => get.value(b, player) - get.value(a, player));
					let sha = cards.filter(card => get.name(card, player) == "sha");
					cards.removeArray(sha);
					const hs = [];
					let num = Math.ceil(sha.length / 2);
					hs.addArray(sha.slice(0, num));
					sha.removeArray(hs);
					if (hs.length < player.countCards("h")) {
						hs.addArray(cards.slice(0, player.countCards("h") - hs.length));
						cards.removeArray(hs);
					}
					const top = sha.concat(cards);
					return [top, hs];
				})
				.forResult();
			if (result?.bool) {
				await game
					.loseAsync({
						player,
						cards: result.moved.flat(),
						moved: result.moved,
					})
					.setContent(async function (event, trigger, player) {
						const { cards, moved } = event,
							hs = player.getCards("h");
						const gain = moved[1].filter(card => !hs.includes(card)),
							puts = moved[0].filter(card => hs.includes(card)),
							originPile = cards.slice().removeArray(hs);
						//将手牌中有变动的和牌堆顶的牌送入处理区
						if (puts.length) {
							await player.lose(puts, ui.ordering).set("getlx", false);
						}
						await game.cardsGotoOrdering(originPile);
						//手牌部分
						if (gain.length) {
							await player.gain(gain, "draw");
							//调整手牌顺序
							player.getCards("h").forEach(i => i.goto(ui.special));
							player.directgain(moved[1].slice().reverse(), false);
						}
						//牌堆部分
						await game.cardsGotoPile(moved[0].slice().reverse(), ["insert_card", true]);
						//知情牌
						game.addCardKnower(moved[0], player);
					});
			}
			if (!game.hasPlayer(current => current != player)) {
				return;
			}
			result = await player
				.chooseTarget(`星魂：选择一名其他角色，令其展示牌堆顶和你的手牌共计${get.cnNumber(num)}张牌`, true)
				.set("filterTarget", (_, player, target) => target != player)
				.set("ai", target => {
					const { player } = get.event();
					return get.effect(target, { name: "sha" }, player, player);
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const [target] = result.targets;
				let numx = 0;
				if (player.countCards("h")) {
					let min = Math.min(player.countCards("h"), num);
					result = await target
						.chooseNumbers(`###${get.translation(player)}对你发动了“${get.translation(event.name)}”，请选择一个数字X###然后展示其X张手牌和牌堆顶${num}-X张牌，其对你依次使用其中的【杀】`, min, [Array.from({ length: min + 1 }, (_, i) => i)], true)
						.set("processAI", ({ list: [numbers] }) => [numbers.at(-1)])
						.forResult();
					if (result?.bool && result.numbers?.length) {
						numx = result.numbers[0];
					}
				}
				const showCards = player
					.getCards("h")
					.randomGets(numx)
					.concat(get.cards(num - numx, true));
				await target.showCards(showCards, `${get.translation(target)}因“${get.translation(event.name)}”展示`);
				if (showCards.some(card => get.name(card) == "sha")) {
					let sha = showCards.filter(card => get.name(card) == "sha");
					while (sha.length) {
						let card = sha.shift();
						if (player.canUse(card, target, false, false)) {
							await player.useCard(card, target, false);
						}
					}
				}
			}
		},
		ai: {
			order(item, player) {
				if (player.countCards("hs", card => get.tag(card, "draw"))) {
					return 1;
				}
				return 20;
			},
			result: {
				player(player) {
					if (!game.hasPlayer(current => current != player && get.effect(current, { name: "sha" }, player, player) > 0)) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	mbshenpei: {
		audio: 2,
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		derivation: ["mbhuitian"],
		trigger: {
			player: "dying",
		},
		check(event, player) {
			return !player.canSave(player) || player.countCards("hs", card => get.tag(card, "save")) <= -player.hp;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = game.getAllGlobalHistory("everything", evt => {
				if (evt.name != "dying" || evt.player != player) {
					return false;
				}
				return true;
			}).length;
			if (num > 0) {
				await player.recover(num);
				const result = await player
					.chooseTarget(`绝烬：选择一名角色对其造成${num}点火焰伤害`, true)
					.set("ai", target => {
						const { player } = get.event();
						return get.damageEffect(target, player, player, "fire");
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					player.line(result.targets, "fire");
					await result.targets[0].damage(num, "fire");
				}
			}
			await player.addSkills("mbhuitian");
		},
	},
	mbhuitian: {
		audio: 2,
		trigger: {
			global: ["roundStart", "phaseEnd"],
		},
		filter(event, player, name) {
			if (name == "roundStart") {
				return player.hasAllHistory("useSkill", evt => evt.skill == "mbhuitian");
			}
			return event.player.getHp() > player.getHp();
		},
		async cost(event, trigger, player) {
			if (event.triggername == "roundStart") {
				event.result = { bool: true };
			} else {
				event.result = await player
					.chooseBool(get.prompt2(event.skill))
					.set(
						"choice",
						(() => {
							if (player.hasAllHistory("useSkill", evt => evt.skill == "mbhuitian")) {
								return true;
							}
							let targets = game.filterPlayer(current => current != player, undefined, true);
							if (!targets.length) {
								return false;
							} else if (!trigger.player.getHistory().isRound) {
								return false;
							}
							return targets.every(current => {
								let att = get.attitude(player, current);
								return att < -1 || att > 1;
							});
						})()
					)
					.forResult();
			}
		},
		async content(event, tigger, player) {
			if (event.triggername == "roundStart") {
				await player.die();
			} else {
				player.insertPhase(event.name);
			}
		},
	},
	//SM神马超
	sm_tuanlian: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "damageEnd"],
			source: "damageSource",
		},
		filter(event, player, name) {
			if (event.name == "damage") {
				const key = name == "damageSource" ? "sourceDamage" : "damage";
				return player.getHistory(key, evt => evt.num > 0).indexOf(event) == 0;
				/*return (
					game
						.getGlobalHistory("everything", evt => {
							if (evt.name != "damage") {
								return false;
							}
							if (name == "damageEnd" && evt.player == evt.source) {
								return false;
							}
							return evt.player == player || evt.source == player;
						})
						.indexOf(event) == 0
				);*/
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const info = get.info(event.name);
			const characters = info.getCharacters(trigger.name == "damage" ? 1 : 5);
			info.addVisitors(characters, player);
			const next = game.createEvent("addPrettyDerby", false);
			next.player = player;
			next.characters = characters;
			next.setContent("emptyEvent");
			await next;
		},
		onremove(player, skill) {
			get.info(skill).removeVisitors(player.getStorage(skill), player);
		},
		getCharacters(num) {
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			const list = _status.characterlist.filter(name => {
				const title = get.characterTitle(name);
				if (title.includes("马")) {
					return true;
				}
				const surnames = get.characterSurname(name).map(list => list.join(""));
				return surnames.length && surnames.some(surname => surname.includes("马"));
			});
			if (!list.length) {
				return [];
			}
			return list.randomGets(Math.min(list.length, num));
		},
		getSkills(characters, player) {
			if (!player.hasSkill("sm_jingji")) {
				return [];
			}
			const list = [];
			for (const name of characters) {
				const { skills } = get.character(name);
				if (Array.isArray(skills) && skills.length) {
					list.add(skills[0]);
				}
			}
			return list;
		},
		addVisitors(characters, player) {
			_status.characterlist.removeArray(characters);
			game.log(player, "将", "#y" + get.translation(characters), "加入了", "#g“赛马”");
			game.broadcastAll(
				function (player, characters) {
					player.tempname.addArray(characters);
					player.$draw(
						characters.map(function (name) {
							var cardname = "huashen_card_" + name;
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + name,
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
			player.markAuto("sm_tuanlian", characters);
		},
		removeVisitors(characters, player) {
			if (Array.isArray(player.tempname)) {
				game.broadcastAll((player, characters) => player.tempname.removeArray(characters), player, characters);
			}
			player.unmarkAuto("sm_tuanlian", characters);
			_status.characterlist.addArray(characters);
		},
		marktext: "马",
		intro: {
			name: "赛马",
			mark(dialog, storage, player) {
				if (!storage || !storage.length) {
					return "当前没有“赛马”";
				}
				dialog.addSmall([storage, "character"]);
				const skills = lib.skill.sm_tuanlian.getSkills(storage, player);
				if (skills.length) {
					dialog.addText("<li>当前可用技能：" + get.translation(skills), false);
				}
			},
		},
		ai: {
			combo: "sm_jingji",
		},
	},
	sm_jingji: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (!player.getStorage("sm_tuanlian").length) {
				return false;
			}
			const equip = get.autoViewAs({ name: "sm_prettyDerby", isCard: true });
			if (event.filterCard(equip, player, event)) {
				return true;
			}
			return get.inpileVCardList(info => {
				if (!["trick", "basic"].includes(info[0])) {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true });
				return event.filterCard(card, player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (!["trick", "basic"].includes(info[0])) {
						return false;
					}
					const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true });
					return event.filterCard(card, player, event);
				});
				const equip = get.autoViewAs({ name: "sm_prettyDerby", isCard: true });
				if (event.filterCard(equip, player, event)) {
					list.add(["equip", "", "sm_prettyDerby"]);
				}
				const dialog = ui.create.dialog("竞激", [list, "vcard"], "hidden");
				return dialog;
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				const card = get.autoViewAs({ name: button.link[2], nature: button.link[3], isCard: true });
				return get.player().getUseValue(card);
			},
			prompt(links, player) {
				return `移去一张“赛马”，然后视为使用${get.translation(links[0][3] || "")}${get.translation(links[0][2])}`;
			},
			backup(links, player) {
				return {
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					selectCard: -1,
					filterCard: () => false,
					popname: true,
					log: false,
					manualConfirm: true,
					async precontent(event, trigger, player) {
						const characters = player.getStorage("sm_tuanlian").slice(0);
						const result =
							characters.length > 1
								? await player.chooseButton(["竟激：移去一张“赛马”", [characters, "character"]], true).forResult()
								: {
										bool: true,
										links: characters,
									};
						if (result?.bool && result.links?.length) {
							player.logSkill("sm_jingji");
							get.info("sm_tuanlian").removeVisitors(result.links, player);
							game.log(player, "移去了", "#y" + get.translation(result.links));
							const next = game.createEvent("removePrettyDerby", false);
							next.player = player;
							next.characters = result.links;
							next.setContent("emptyEvent");
							await next;
						}
						const type = get.type(event.result.card);
						player
							.when({
								player: "useCard",
							})
							.filter(evt => evt.getParent() == event.getParent())
							.step(async (event, trigger, player) => {
								if (type == "basic") {
									trigger.baseDamage ??= 1;
									trigger.baseDamage++;
								}
								if (type == "trick") {
									await player.draw();
								}
							});
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (!["trick", "basic"].includes(get.type(name))) {
				return false;
			}
			return player.getStorage("sm_tuanlian").length;
		},
		init(player, skill) {
			player.addSkill("sm_jingji_load");
		},
		onremove(player, skill) {
			const skills = get.info("sm_tuanlian").getSkills(player.getStorage("sm_tuanlian"), player);
			if (skills?.length) {
				player.removeInvisibleSkill(skills);
			}
			player.removeSkill("sm_jingji_load");
		},
		ai: {
			order: 2,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
				},
			},
			combo: "sm_tuanlian",
		},
		group: ["sm_jingji_remove", "sm_jingji_trigger"],
		subSkill: {
			remove: {
				audio: "sm_jingji",
				trigger: { player: ["useSkill", "logSkillBegin"] },
				forced: true,
				locked: false,
				filter(event, player) {
					const skill = get.sourceSkillFor(event),
						name = "sm_tuanlian";
					if (!player.invisibleSkills.includes(skill)) {
						return false;
					}
					return get.info(name).getSkills(player.getStorage(name), player).includes(skill);
				},
				async content(event, trigger, player) {
					const name = "sm_tuanlian",
						skill = get.sourceSkillFor(trigger),
						info = get.info(name),
						visitors = player.getStorage(name).filter(namex => get.character(namex).skills?.includes(skill));
					if (!visitors?.length) {
						return;
					}
					const result =
						visitors.length > 1
							? await player.chooseButton(["竟激：移去一张“赛马”", [visitors, "character"]], true).forResult()
							: {
									bool: true,
									links: visitors,
								};
					if (result?.bool && result.links?.length) {
						info.removeVisitors(result.links, player);
						game.log(player, "移去了", "#y" + get.translation(result.links[0]));
						const next = game.createEvent("removePrettyDerby", false);
						next.player = player;
						next.characters = result.links;
						next.setContent("emptyEvent");
						await next;
					}
				},
			},
			trigger: {
				trigger: { player: "triggerInvisible" },
				forced: true,
				forceDie: true,
				popup: false,
				charlotte: true,
				priority: 10,
				filter(event, player) {
					if (event.revealed) {
						return false;
					}
					const info = get.info(event.skill);
					if (info.charlotte) {
						return false;
					}
					const skills = lib.skill.sm_tuanlian.getSkills(player.getStorage("sm_tuanlian"), player);
					game.expandSkills(skills);
					return skills.includes(event.skill);
				},
				async content(evt, event, player) {
					const info = get.info(event.skill);
					if (info.slient) {
						return;
					}
					const trigger = evt._trigger,
						check = info.check;
					let str;
					if (info.prompt) {
						str = info.prompt;
					} else {
						if (typeof info.logTarget == "string") {
							str = get.prompt(event.skill, trigger[info.logTarget], player);
						} else if (typeof info.logTarget == "function") {
							let logTarget = info.logTarget(trigger, player, trigger.triggername, trigger.indexedData);
							if (get.itemtype(logTarget)?.indexOf("player") == 0) {
								str = get.prompt(event.skill, logTarget, player);
							}
						} else {
							str = get.prompt(event.skill, null, player);
						}
					}
					if (typeof str == "function") {
						str = str(trigger, player, trigger.triggername, trigger.indexedData);
					}
					const next = player.chooseBool(`竟激：${str}`);
					next.set("yes", !info.check || info.check(trigger, player, trigger.triggername, trigger.indexedData));
					next.set("hsskill", event.skill);
					next.set("forceDie", true);
					next.set("ai", function () {
						return _status.event.yes;
					});
					if (typeof info.prompt2 == "function") {
						next.set("prompt2", info.prompt2(trigger, player, trigger.triggername, trigger.indexedData));
					} else if (typeof info.prompt2 == "string") {
						next.set("prompt2", info.prompt2);
					} else if (info.prompt2 != false) {
						if (lib.dynamicTranslate[event.skill]) {
							next.set("prompt2", lib.dynamicTranslate[event.skill](player, event.skill));
						} else if (lib.translate[event.skill + "_info"]) {
							next.set("prompt2", lib.translate[event.skill + "_info"]);
						}
					}
					if (trigger.skillwarn) {
						if (next.prompt2) {
							next.set("prompt2", '<span class="thundertext">' + trigger.skillwarn + "。</span>" + next.prompt2);
						} else {
							next.set("prompt2", trigger.skillwarn);
						}
					}
					const result = await next.forResult();
					if (result?.bool) {
						if (!info.cost) {
							trigger.revealed = true;
						}
					} else {
						trigger.untrigger();
						trigger.cancelled = true;
					}
				},
			},
			load: {
				trigger: {
					player: ["addPrettyDerby", "removePrettyDerby"],
				},
				filter(event, player) {
					return event.characters?.length;
				},
				direct: true,
				firstDo: true,
				charlotte: true,
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				skillBlocker(skill, player) {
					if (!player.invisibleSkills.includes(skill) || skill == "sm_tuanlian" || skill == "sm_jingji") {
						return false;
					}
					return !player.hasSkill("sm_jingji");
				},
				async content(event, trigger, player) {
					const skills = get.info("sm_tuanlian").getSkills(trigger.characters, player);
					if (!skills?.length) {
						return;
					}
					if (trigger.name == "addPrettyDerby") {
						player.addInvisibleSkill(skills);
					} else {
						player.removeInvisibleSkill(skills);
					}
				},
			},
		},
	},
	sm_kuangchi: {
		audio: 2,
		trigger: {
			source: "dieAfter",
		},
		filter(event, player) {
			const target = event.player;
			if (event.reserveOut || target.maxHp <= 0) {
				return false;
			}
			return player.getStorage("sm_tuanlian").length;
		},
		logTarget: "player",
		async cost(event, trigger, player) {
			const names = player.getStorage("sm_tuanlian"),
				target = trigger.player;
			const result = await player
				.chooseButton([get.prompt(event.skill, target), [names, "character"]])
				.set("ai", () => {
					return Math.random();
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links[0],
				};
			}
		},
		async content(event, trigger, player) {
			const target = trigger.player,
				name = event.cost_data;
			trigger.cancel();
			const names = get.nameList(target);
			const result =
				names.length > 1
					? await player
							.chooseControl(names)
							.set("ai", () => {
								const { controls } = get.event();
								return controls.slice().sort((a, b) => get.rank(b, true) - get.rank(a, true))[0];
							})
							.set("prompt", "请选择替换的武将牌")
							.forResult()
					: { control: names[0] };
			if (result.control) {
				get.info("sm_tuanlian").removeVisitors([name], player);
				game.log(player, "移去了", "#y" + get.translation(name));
				const next = game.createEvent("removePrettyDerby", false);
				next.player = player;
				next.characters = [name];
				next.setContent("emptyEvent");
				await next;
				await target.reviveEvent(2);
				let doubleDraw = false;
				let num = (get.character(name).maxHp || get.character(name).hp) - (get.character(result.control).maxHp || get.character(result.control).hp);
				if (num !== 0) {
					if (typeof target.singleHp === "boolean") {
						if (num % 2 !== 0) {
							if (target.singleHp) {
								target.maxHp += (num + 1) / 2;
								target.singleHp = false;
							} else {
								target.maxHp += (num - 1) / 2;
								target.singleHp = true;
								doubleDraw = true;
							}
						} else {
							target.maxHp += num / 2;
						}
					} else {
						target.maxHp += num;
					}
					target.update();
				}
				await target.reinitCharacter(result.control, name);
				const owner = player["zombieshibian"] || player;
				game.broadcastAll(
					(player, target) => {
						target["zombieshibian"] = player;
						const identity = (target.identity = (identity => {
							switch (identity) {
								case "zhu":
								case "mingzhong":
									return "zhong";
								case "zhu_false":
									return "zhong_false";
								case "bZhu":
									return "bZhong";
								case "rZhu":
									return "rZhong";
								default:
									return identity;
							}
						})(player.identity));
						if (!lib.translate[identity]) {
							lib.translate[identity] = "马";
						}
						const goon = player !== game.me && target !== game.me && player.node.identity.classList.contains("guessing") && !player.identityShown;
						if (goon) {
							if (target.identityShown) {
								delete target.identityShown;
							}
							if (!target.node.identity.classList.contains("guessing")) {
								target.node.identity.classList.add("guessing");
							}
						}
						target.setIdentity(goon ? "cai" : undefined);
						if (target.node.dieidentity) {
							target.node.dieidentity.innerHTML = get.translation(target.identity + 2);
						}
						if (typeof player.ai?.shown === "number" && target.ai) {
							target.ai.shown = player.ai.shown;
						}
						if (typeof player.side == "boolean") {
							target.side = player.side;
							target.node.identity.firstChild.innerHTML = player.node.identity.firstChild.innerHTML;
							target.node.identity.dataset.color = player.node.identity.dataset.color;
						}
						if (_status._zombieshibian) {
							return;
						}
						_status.zombieshibian = true;
						//检测游戏胜负
						if (typeof game.checkResult === "function") {
							const origin_checkResult = game.checkResult;
							game.checkResult = function () {
								const player = game.me._trueMe || game.me;
								if (game.players.filter(i => i !== player).every(i => i["zombieshibian"] === (player["zombieshibian"] || player))) {
									game.over(true);
								}
								return origin_checkResult.apply(this, arguments);
							};
						}
						if (typeof game.checkOnlineResult === "function") {
							const origin_checkOnlineResult = game.checkOnlineResult;
							game.checkOnlineResult = function (player) {
								if (game.players.filter(i => i !== player).every(i => i["zombieshibian"] === (player["zombieshibian"] || player))) {
									return true;
								}
								return origin_checkOnlineResult.apply(this, arguments);
							};
						}
						//敌友判定
						if (typeof lib.element.player.getFriends === "function") {
							const origin_getFriends = lib.element.player.getFriends;
							const getFriends = function (func, includeDie) {
								const player = this;
								return [...origin_getFriends.apply(this, arguments), ...game[includeDie ? "filterPlayer2" : "filterPlayer"](target => (target["zombieshibian"] || target) === (player["zombieshibian"] || player))]
									.filter(i => i !== player || func === true)
									.unique()
									.sortBySeat(player);
							};
							lib.element.player.getFriends = getFriends;
							[...game.players, ...game.dead].forEach(i => (i.getFriends = getFriends));
						}
						if (typeof lib.element.player.isFriendOf === "function") {
							const origin_isFriendOf = lib.element.player.isFriendOf;
							const isFriendOf = function (player) {
								if ((this["zombieshibian"] || this) === (player["zombieshibian"] || player)) {
									return true;
								}
								return origin_isFriendOf.apply(this, arguments);
							};
							lib.element.player.isFriendOf = isFriendOf;
							[...game.players, ...game.dead].forEach(i => (i.isFriendOf = isFriendOf));
						}
						if (typeof lib.element.player.getEnemies === "function") {
							const origin_getEnemies = lib.element.player.getEnemies;
							const getEnemies = function (func, includeDie) {
								if (this["zombieshibian"]) {
									return this["zombieshibian"].getEnemies(func, includeDie);
								} else {
									const player = this;
									return [
										...origin_getEnemies.apply(this, arguments),
										...game[includeDie ? "filterPlayer2" : "filterPlayer"](target => {
											return origin_getEnemies.apply(this, arguments).includes(target["zombieshibian"] || target);
										}),
									]
										.filter(i => player != (i["zombieshibian"] || i))
										.unique()
										.sortBySeat(player);
								}
							};
							lib.element.player.getEnemies = getEnemies;
							[...game.players, ...game.dead].forEach(i => (i.getEnemies = getEnemies));
						}
					},
					owner,
					target
				);
				target.ai.modAttitudeFrom = function (from, to) {
					if (to == from["zombieshibian"]) {
						return 114514;
					}
					return get.attitude(from["zombieshibian"] || from, to["zombieshibian"] || to);
				};
				target.ai.modAttitudeTo = function (from, to, att) {
					if (from == to["zombieshibian"]) {
						return 7;
					}
					return get.attitude(from["zombieshibian"] || from, to["zombieshibian"] || to);
				};
				if (doubleDraw) {
					await target.doubleDraw();
				}
			}
		},
		ai: {
			combo: "sm_tuanlian",
		},
	},
	sm_kulian: {
		audio: 2,
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		logTarget(event, player) {
			return game.filterPlayer(() => true);
		},
		async content(event, trigger, player) {
			const func = async target => {
				const card = get.cardPile2(card => {
					return get.subtypes(card).containsSome("equip3", "equip4", "equip6");
				}, "random");
				if (card) {
					target.$gain2(card);
					await target.equip(card);
				}
				const card2 = game.createCard2("sm_mabian", "heart", 13);
				target.$gain2(card2);
				await target.equip(card2);
				await game.delayx();
			};
			await game.doAsyncInOrder(event.targets, func);
			game.addGlobalSkill("sm_kulian_prettyDerby");
		},
		derivation: "sm_kulian_reward",
		subSkill: {
			prettyDerby: {
				trigger: {
					global: ["roundStart", "roundEnd", "loseAsyncAfter", "gainAfter", "addJudgeAfter", "equipAfter", "addToExpansionAfter"],
					source: "damageSource",
					player: "loseAfter",
				},
				filter(event, player, name) {
					if (name == "roundStart") {
						return !event._PerttyDerbyed;
					}
					if (name == "roundEnd") {
						return _status.prettyDerbyDoing?.length;
					}
					if (event.name == "damage") {
						if (!player.getEquip("sm_mabian") || player.hasSkill("sm_kulian_damaged")) {
							return false;
						}
						return event.player != player && event.player.getEquip("sm_mabian");
					}
					const es = event.getl(player)?.es;
					return es?.length && es.some(card => card.name == "sm_mabian");
				},
				direct: true,
				async content(event, trigger, player) {
					switch (event.triggername) {
						case "roundStart": {
							trigger.set("_PerttyDerbyed", true);
							game.log("#y新一轮赛马比赛开始！");
							const list = get.info(event.name).initList(event.name);
							list.forEach((obj, index) => {
								game.log(`本轮赛马奖励${index + 1}：`, `#g${obj.info}[奖励：${obj.reward}]`);
							});
							game.broadcastAll(list => {
								_status.prettyDerbyDoing = list;
							}, list);
							const target = game.findPlayer(current => current.hasSkill("sm_kulian")),
								func = async target => {
									target.markSkill(event.name);
								};
							if (target) {
								await func(target);
							} else {
								await game.doAsyncInOrder(
									game.filterPlayer(() => true),
									func
								);
							}
							return;
						}
						case "roundEnd": {
							game.log("#y赛马比赛结束");
							await game.doAsyncInOrder(
								game.filterPlayer(() => true),
								async target => {
									target.unmarkSkill(event.name);
								}
							);
							const next = game.createEvent("perttyDerbyEnd", false);
							next.set("rewards", _status.prettyDerbyDoing);
							next.setContent("emptyEvent");
							await next;
							while (_status.prettyDerbyDoing.length) {
								const map = _status.prettyDerbyDoing.shift();
								game.broadcastAll(list => {
									_status.prettyDerbyDoing = list;
								}, _status.prettyDerbyDoing);
								const targets = game
									.filterPlayer(current => {
										return current.getEquip("sm_mabian");
									})
									.sort((a, b) => {
										return map.filter(b) - map.filter(a);
									});
								if (!targets.length) {
									continue;
								}
								if (targets.length > 1 && map.filter(targets[0]) == map.filter(targets[1])) {
									continue;
								}
								const target = targets[0];
								game.log(target, "执行了赛马奖励：", `#g${map.reward}`);
								await map.content(target);
							}
							return;
						}
						case "damageSource": {
							player.addTempSkill("sm_kulian_damaged");
							player.logSkill("sm_kulian", trigger.player);
							await player.draw();
							return;
						}
						default: {
							game.log(player, "#y退赛了！");
							await event.trigger("withdrawPrettyDerby");
							return;
						}
					}
				},
				mod: {
					targetInRange(card, player) {
						if (player.getEquip("sm_mabian") && ["equip3", "equip4", "equip6"].some(slot => player.getEquip(slot))) {
							return true;
						}
					},
				},
				intro: {
					content(_storage) {
						const list = _status.prettyDerbyDoing;
						if (!list?.length) {
							return "未进行比赛";
						}
						return list.map((obj, index) => App({ obj, index })).join("<br />");

						function App(props) {
							const { obj, index } = props;
							const html = String.raw;
							return html`
								目标${index + 1}: ${obj.info}
								<br />
								<ul>
									<li><span style="font-family: yuanli">奖励：${obj.reward}</span></li>
								</ul>
							`
						}
					},
				},
				rewardList: [
					{
						info: "受到伤害唯一最多",
						reward: "回复全部体力",
						filter(player) {
							return player.getRoundHistory("damage").reduce((sum, evt) => sum + evt.num, 0);
						},
						async content(player) {
							if (player.isDamaged()) {
								await player.recoverTo(player.maxHp);
							}
						},
					},
					{
						info: "手牌数唯一最多",
						reward: "手牌上限改为体力上限",
						filter(player) {
							return player.countCards("h");
						},
						async content(player) {
							player.addSkill("sm_kulian_yingzi");
						},
					},
					{
						info: "体力值唯一最高",
						reward: "增加1点体力上限",
						filter(player) {
							return player.getHp();
						},
						async content(player) {
							await player.gainMaxHp();
						},
					},
					{
						info: "装备区牌数唯一最多",
						reward: "获得一张其他角色的装备牌",
						filter(player) {
							return player.countCards("e");
						},
						async content(player) {
							const targets = game.filterPlayer(current => current != player && current.countGainableCards(player, "e"));
							if (!targets?.length) {
								return;
							}
							const result =
								targets.length > 1
									? await player
											.chooseTarget(
												"获得一名其他角色一张装备牌",
												(card, player, target) => {
													return player != target && target.countGainableCards(player, "e");
												},
												true
											)
											.set("ai", target => {
												const player = get.player();
												return get.effect(target, { name: "shunshou_copy2", position: "e" }, player, player);
											})
											.forResult()
									: {
											bool: true,
											targets: targets,
										};
							if (!result?.bool || !result.targets?.length) {
								return;
							}
							const target = result.targets[0];
							await player.gainPlayerCard(target, "e", true);
						},
					},
					{
						info: "击杀数唯一最多",
						reward: "执行一个仅有出牌阶段的额外回合",
						filter(player) {
							return game.getRoundHistory("everything", evt => evt.name == "die" && evt.source == player).length;
						},
						async content(player) {
							const next = player.insertPhase("sm_kulian");
							next.phaseList = ["phaseUse"];
							next._noTurnOver = true;
						},
					},
					{
						info: "使用牌数唯一最多",
						reward: "摸五张牌",
						filter(player) {
							return player.getRoundHistory("useCard").length;
						},
						async content(player) {
							await player.draw(5);
						},
					},
					{
						info: "造成伤害唯一最多",
						reward: "使用【杀】造成伤害+1",
						filter(player) {
							return player.getRoundHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0);
						},
						async content(player) {
							const skill = "sm_kulian_sha";
							player.addSkill(skill);
							player.addMark(skill, 1, false);
						},
					},
				],
				initList(skill) {
					if (!_status.prettyDerbyList || _status.prettyDerbyList.length < 2) {
						_status.prettyDerbyList = get.info(skill).rewardList.slice(0);
					}
					const list = _status.prettyDerbyList.randomRemove(2);
					game.broadcastAll(list => {
						_status.prettyDerbyList = list;
					}, _status.prettyDerbyList);
					return list;
				},
			},
			yingzi: {
				charlotte: true,
				mark: true,
				intro: {
					content: "你的手牌上限改为体力上限",
				},
				mod: {
					maxHandcardBase(player, num) {
						return player.maxHp;
					},
				},
			},
			sha: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "使用杀造成的伤害+#",
				},
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					return event.card?.name == "sha" && player.countMark("sm_kulian_sha");
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
			},
			damaged: {
				charlotte: true,
			},
			reward: {
				nobracket: true,
				nopop: true,
			},
		},
	},
	sm_lema: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type === "wuxie") {
				return false;
			}
			return get
				.inpileVCardList(info => get.type(info[2]) == "basic")
				.some(card => {
					return event.filterCard(get.autoViewAs({ name: card[2], nature: card[3], isCard: true }), player, event);
				});
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => get.type(info[2]) == "basic")
					.filter(card => {
						return event.filterCard(get.autoViewAs({ name: card[2], nature: card[3], isCard: true }), player, event);
					});
				return ui.create.dialog("乐马", [list, "vcard"], "hidden");
			},
			check(button) {
				const event = get.event().getParent();
				if (event.type !== "phase") {
					return 1;
				}
				return get.player().getUseValue(get.autoViewAs({ name: button.link[2], nature: button.link[3], isCard: true }));
			},
			prompt(links) {
				const num = Math.max(
					1,
					game.countPlayer(
						current =>
							current.getCards("e", card => {
								return get.subtypes(card).containsSome("equip3", "equip4", "equip6");
							}).length
					)
				);
				return `视为使用${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}并摸${get.cnNumber(num)}张牌`;
			},
			backup(links, player) {
				return {
					audio: "sm_lema",
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					popname: true,
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("sm_lema");
						const num = Math.max(
							1,
							game.countPlayer(
								current =>
									current.getCards("e", card => {
										return get.subtypes(card).containsSome("equip3", "equip4", "equip6");
									}).length
							)
						);
						await player.draw(num);
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (player.getStat("skill").sm_lema) {
				return false;
			}
			return get.type(name) == "basic";
		},
		ai: {
			order: 10,
			respondShan: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				return get.info("sm_lema").hiddenCard(player, tag.slice("respond".length).toLowerCase());
			},
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: {
			backup: {},
		},
	},
	sm_chaoxuan: {
		audio: 2,
		trigger: {
			global: "perttyDerbyEnd",
		},
		filter(event, player) {
			return event.rewards?.length;
		},
		forced: true,
		async content(event, trigger, player) {
			for (const reward of trigger.rewards) {
				game.log(player, "执行了赛马奖励：", `#g${reward.reward}`);
				await reward.content(player);
			}
		},
	},
	sm_wandou: {
		audio: 2,
		trigger: {
			global: "withdrawPrettyDerby",
		},
		filter(event, player) {
			return event.player.getHp() != 1;
		},
		check(event, player) {
			const bool1 = event.player.getHp() > 1,
				bool2 = get.attitude(player, event.player) > 0;
			return bool1 != bool2;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0],
				num = target.getHp() - 1;
			if (num > 0) {
				await target.loseHp(num);
			} else if (num < 0) {
				await target.recoverTo(1);
			}
		},
	},
	sm_mabian_skill: {
		equipSkill: true,
		onremove: true,
		charlotte: true,
	},
	//新杀神孙权
	dccangming: {
		audio: 2,
		trigger: {
			//global: "gameDrawAfter",
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "phase" && game.phaseNumber != 0) {
				return false;
			}
			return !!game.countPlayer(target => target.countCards("h") > 0);
		},
		logTarget() {
			return game.filterPlayer(target => target.countCards("h") > 0);
		},
		async content(event, trigger, player) {
			const { name, targets } = event;
			const lose_list = targets.sortBySeat().map(target => [target, target.getCards("h")]);
			await game
				.loseAsync({
					lose_list: lose_list,
					player: player,
					log: true,
					animate: "giveAuto",
					gaintag: [name],
				})
				.setContent("addToExpansionMultiple");
			/*const func = async target => {
				if (!target.countCards("h")) {
					return;
				}
				const next = target.addToExpansion(target.getCards("h"), target, "giveAuto", false);
				next.gaintag.add(name);
				await next;
			};
			await game.doAsyncInOrder(event.targets, func);*/
		},
		marktext: "溟",
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				const cards = player.getExpansions("dccangming");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
		global: "dccangming_gain",
		group: "dccangming_draw",
		subSkill: {
			draw: {
				trigger: {
					global: ["addToExpansionAfter", "loseAsyncAfter"],
				},
				filter(event, player) {
					if (event.getlx == false) {
						return false;
					}
					if (event.name == "loseAsync" && event.type != "addToExpansion") {
						return false;
					}
					return event.gaintag?.includes("dccangming");
				},
				forced: true,
				async content(event, trigger, player) {
					const { cards } = trigger;
					//await player.draw();
					const types = cards.map(card => get.color(card)).unique();
					await player.draw(types.length);
				},
			},
			gain: {
				trigger: {
					player: ["phaseBegin", "damageEnd"],
				},
				filter(event, player) {
					return player.countExpansions("dccangming") > 0;
				},
				forced: true,
				async content(event, trigger, player) {
					game.log(player, "获得了", get.cnNumber(player.countExpansions("dccangming")), "张牌");
					await player.gain(player.getExpansions("dccangming"), "draw");
				},
			},
		},
	},
	dcchouxi: {
		audio: 2,
		enable: "phaseUse",
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			const list = [];
			game.countPlayer(current => {
				if (!current.countExpansions("dccangming")) {
					return false;
				}
				for (const card of current.getExpansions("dccangming")) {
					if (["basic", "trick"].includes(get.type(card, false))) {
						list.add(get.name(card, false));
					}
				}
				return true;
			});
			list.removeArray(event.player.getStorage("dcchouxi_used"));
			event.set("dcchouxiList", list);
		},
		filter(event, player) {
			if (!event.dcchouxiList?.length || !player.countCards("hs")) {
				return false;
			}
			return event.dcchouxiList.some(name => {
				const card = get.autoViewAs({ name: name, storage: { dcchouxi: true } }, "unsure");
				return player.hasUseTarget(card);
			});
		},
		chooseButton: {
			dialog(event, player) {
				const list = event.dcchouxiList.filter(name => {
					const card = get.autoViewAs({ name: name, storage: { dcchouxi: true } }, "unsure");
					return player.hasUseTarget(card);
				});
				const dialog = ui.create.dialog("筹汐", [list, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			check(button) {
				const player = get.player(),
					card = get.autoViewAs({ name: button.link[2], storage: { dcchouxi: true } }, "unsure");
				return player.getUseValue(card);
			},
			backup(links, player) {
				return {
					audio: "dcchouxi",
					popname: true,
					viewAs: {
						name: links[0][2],
						storage: {
							dcchouxi: true,
						},
					},
					filterCard: true,
					position: "hes",
					check(card) {
						return 5 - get.value(card);
					},
					async precontent(event, trigger, player) {
						player.addTempSkill("dcchouxi_used");
						player.markAuto("dcchouxi_used", event.result.card.name);
						event.getParent().addCount = false;
					},
				};
			},
			prompt(links, player) {
				return `将一张牌当作${get.translation(links[0][2])}使用`;
			},
		},
		locked: false,
		mod: {
			cardUsable(card, player) {
				if (card?.storage?.dcchouxi) {
					return Infinity;
				}
			},
			targetInRange(card, player) {
				if (card?.storage?.dcchouxi) {
					return true;
				}
			},
		},
		ai: {
			combo: ["dccangming", "dcjichao"],
			order: 8,
			result: {
				player: 1,
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
	dcjichao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.countCards("he") > 0);
		},
		chooseButton: {
			dialog(event, player) {
				const choiceList = [
					["one", "令一名其他角色将随机一半手牌（向上取整）和装备区的牌置于武将牌上"],
					["all", "令所有其他角色将所有牌置于武将牌上"],
				];
				const dialog = ui.create.dialog("激潮", [choiceList, "textbutton"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			filter(button, player) {
				return button.link == "one" || !player.hasSkill("dcjichao_blocker");
			},
			check(button) {
				const player = get.player();
				if (button.link == "all") {
					return 2;
				}
				return 1;
			},
			backup(links, player) {
				return {
					audio: "dcjichao",
					choice: links[0],
					manualConfirm: true,
					filterTarget(card, player, target) {
						return target != player && target.countCards("he") > 0;
					},
					selectTarget() {
						const { choice } = get.info("dcjichao_backup");
						if (choice == "all") {
							return -1;
						}
						return 1;
					},
					multitarget: true,
					multiline: true,
					async content(event, trigger, player) {
						const { targets, name } = event;
						const { choice } = get.info(name);
						if (choice == "all") {
							player.addTempSkill("dcjichao_blocker", { player: "dieAfter" });
						}
						const getCards = function (target) {
							let cards = target.getCards("h");
							if (choice !== "all") {
								let num = Math.ceil(cards.length / 2);
								if (num > 0) {
									cards = cards.randomGets(num);
								}
							}
							cards = [...cards, ...target.getCards("e")];
							return cards;
						};
						if (choice == "all") {
							await game
								.loseAsync({
									lose_list: targets.sortBySeat().map(target => [target, getCards(target)]),
									player: player,
									log: true,
									animate: "giveAuto",
									gaintag: ["dccangming"],
								})
								.setContent("addToExpansionMultiple");
						} else {
							const [target] = targets;
							const next = target.addToExpansion(getCards(target), target, "giveAuto");
							next.gaintag.add("dccangming");
							await next;
						}
					},
					ai1: () => 1,
					ai2(target) {
						const player = get.player();
						return -get.attitude(player, target);
					},
				};
			},
			prompt(links, player) {
				if (links[0] == "all") {
					return "令所有其他角色将所有牌置于武将牌上，称为“溟”";
				}
				return "令一名其他角色将随机一半手牌（向上取整）和装备区的牌置于武将牌上，称为“溟”";
			},
		},
		ai: {
			order(item, player) {
				player ??= get.player();
				if (
					game.hasPlayer(current => {
						if (current == player || !current.countCards("h")) {
							return false;
						}
						if (get.attitude(player, current) > 0) {
							return false;
						}
						return player.countCards("hs", card => player.canUse(card, current) && get.effect(current, card, player, player) > 0) > 0;
					})
				) {
					return 9;
				}
				return 1;
			},
			result: {
				player(player, target) {
					if (
						game.hasPlayer(current => {
							if (current == player || !current.countCards("h")) {
								return false;
							}
							return get.attitude(player, current) < 0;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			blocker: {
				charlotte: true,
				silent: true,
				init(player, skill) {
					player.addMark(skill, 3, false);
				},
				onremove: true,
				intro: {
					content: "还需造成#点伤害",
				},
				trigger: {
					source: "damage",
				},
				filter(event, player) {
					return event.num > 0;
				},
				async content(event, trigger, player) {
					const { num } = trigger;
					player.removeMark(event.name, num, false);
					if (!player.hasMark(event.name)) {
						player.removeSkill(event.name);
					}
				},
			},
			backup: {},
		},
	},
	//26珍藏神黄月英
	zc26_cangqiao: {
		trigger: {
			player: "useCard",
			global: "roundStart",
		},
		filter(event, player) {
			if (event.name == "useCard") {
				if (!["duanjian", "serafuku", "yonglv"].includes(event.card.name)) {
					return false;
				}
				return player.countCards("h") < player.maxHp;
			}
			return true;
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseBool(get.prompt(event.skill), () => true).forResult();
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				await player.drawTo(player.maxHp);
			} else {
				if (!_status.zc26_cangqiao) {
					game.broadcastAll(function () {
						_status.zc26_cangqiao = [
							{ name: "duanjian", number: 13, suit: "club" },
							{ name: "serafuku", number: 9, suit: "heart" },
							{ name: "yonglv", number: 13, suit: "club" },
						];
						for (let info of _status.zc26_cangqiao) {
							if (!lib.inpile.includes(info.name)) {
								lib.inpile.add(info.name);
							}
						}
					});
				}
				let list = ["duanjian", "serafuku", "yonglv"],
					cards = [];
				for (let name of list) {
					let card = get.discardPile(name);
					if (card) {
						cards.add(card);
					} else {
						let info = _status.zc26_cangqiao.find(i => i.name == name);
						if (info) {
							game.broadcastAll(function (info) {
								_status.zc26_cangqiao.remove(info);
							}, info);
							card = game.createCard2(name, info.suit, info.number);
							card.addCardtag("gifts");
							cards.add(card);
						}
					}
				}
				if (cards.length) {
					await player.gain(cards, "draw2");
				}
			}
		},
	},
	zc26_shenxie: {
		usable: 1,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (!event.targets.includes(player) || event.targets.length != 1) {
				return false;
			} else if (get.color(event.card) != "black") {
				return false;
			}
			const storage = player.getStorage(
				"zc26_shenxie",
				lib.inpile.filter(name => get.type(name) == "delay")
			);
			if (!storage.some(name => player.hasUseTarget(name))) {
				return false;
			}
			return game.hasPlayer(current => {
				return current.countCards("ej", { type: "equip" });
			});
		},
		async cost(event, trigger, player) {
			const storage = player
				.getStorage(
					event.skill,
					lib.inpile.filter(name => get.type(name) == "delay")
				)
				.filter(name => player.hasUseTarget(name));
			const choice = storage
				.map(name => [name, player.getUseValue(get.autoViewAs({ name, isCard: false }, "unsure"))])
				.reduce(
					(max, info) => {
						if (max[1] < info[1]) {
							return info;
						}
						return max;
					},
					[null, 0]
				)[0];
			const result = await player
				.chooseTarget(get.prompt2(event.skill), (_, player, target) => target.countCards("ej", { type: "equip" }))
				.set("ai", target => {
					const { player, choice } = get.event(),
						es = target.getCards("ej", { type: "equip" });
					if (!choice) {
						return 0;
					}
					if (get.attitude(player, target) > 0) {
						return 10 - Math.min(...es.map(card => get.equipValue(card)));
					}
					return Math.max(...es.map(card => get.equipValue(card)));
				})
				.set("choice", choice)
				.forResult();
			event.result = {
				bool: result?.bool,
				targets: result?.targets,
				cost_data: choice,
			};
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: choice,
			} = event;
			const result = await player
				.choosePlayerCard(target, `###神械###将${get.translation(target)}场上的一张牌当作延时锦囊牌使用`, "ej", true)
				.set("filterButton", ({ link }) => get.type(link) == "equip")
				.set("ai", ({ link }) => {
					const { player, target } = get.event();
					if (get.attitude(player, target) > 0) {
						return 10 - get.equipValue(link);
					}
					return get.equipValue(link);
				})
				.forResult();
			if (result?.bool && result.cards?.length) {
				const storage = player
					.getStorage(
						event.name,
						lib.inpile.filter(name => get.type(name) == "delay")
					)
					.filter(name => player.hasUseTarget(name));
				const { links } = await player
					.chooseVCardButton(true, "神械：请选择要使用的延时锦囊牌", storage.slice())
					.set("ai", ({ link: [_, __, name] }) => {
						const { player, choice } = get.event();
						if (choice) {
							return name == choice;
						}
						return player.getUseValue(name);
					})
					.set("choice", choice)
					.forResult();
				if (links?.length) {
					const name = links[0][2];
					storage.remove(name);
					if (!storage.length) {
						storage.addArray(lib.inpile.filter(name => get.type(name) == "delay"));
					}
					player.setStorage(event.name, storage, true);
					await player.chooseUseTarget({ name, storage: { equipEnable: true }, isCard: false }, result.cards, true);
				}
			}
		},
	},
	zc26_huaxiu: {
		usable: 1,
		enable: "phaseUse",
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			event.set(
				"zc26_huaxiu",
				["duanjian", "serafuku", "yonglv"].filter(i => i in lib.card)
			);
		},
		filter(event, player) {
			return event.zc26_huaxiu?.length;
		},
		manualConfirm: true,
		async content(event, trigger, player) {
			const list = event.getParent(2).zc26_huaxiu.map(name => [get.type(name), "", name]);
			const result = await player
				.chooseButton(true, ["化朽", "选择要升级的装备", [list, "vcard"]])
				.set("ai", button => {
					const player = get.player(),
						name = button.link[2];
					const num = game.countPlayer(current => {
						const hs = current.countVCards("h", card => name == card.name),
							es = current.countVCards("e", card => name == card.name),
							js = current.countVCards("j", card => get.type(card) == "delay" && card.storage.equipEnable && name == get.name(card, false));
						return get.sgnAttitude(player, current) * (es + js + current == player ? hs : 0);
					});
					return num;
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				const name = result.links[0][2],
					map = {
						duanjian: "zc26_zhuge",
						serafuku: "zc26_bagua",
						yonglv: "zc26_lingling",
					};
				game.log(player, "将", `#y${get.translation({ name })}`, "升级为", `#y${get.translation({ name: map[name] })}`);
				player.addTempSkill("zc26_huaxiu_restore", { player: "phaseBegin" });
				game.broadcastAll(
					function (name, player, map) {
						if (!_status.zc26_huaxiu_origin) {
							_status.zc26_huaxiu_origin = {};
							for (let name of ["duanjian", "serafuku", "yonglv"]) {
								_status.zc26_huaxiu_origin[name] = { info: lib.card[name], translate: lib.translate[name], translate2: lib.translate[`${name}_info`] };
							}
						}
						lib.card[name] = lib.card[map[name]];
						lib.translate[name] = lib.translate[map[name]];
						lib.translate[`${name}_info`] = lib.translate[`${map[name]}_info`];
						_status.zc26_huaxiu ??= {};
						_status.zc26_huaxiu[name] ??= [];
						_status.zc26_huaxiu[name].add(player);
						lib.init.sheet(`
							.card[data-card-name = "${name}"]>.image {
								background-image: url(${lib.assetURL}image/card/${map[name]}.png) !important;
							}
						`);
					},
					name,
					player,
					map
				);
				function check(name, target, method) {
					if (method == "e") {
						return target.hasVCard({ name }, "e");
					} else if (method == "j") {
						return target.hasVCard(card => {
							if (!card.storage?.equipEnable) {
								return false;
							}
							return card.cards.some(cardx => cardx.name == name);
						}, "j");
					}
					return false;
				}
				const removeSkill = get.skillsFromEquips([{ name }]),
					addSkill = get.skillsFromEquips([{ name: map[name] }]);
				for (let current of game.players) {
					let keepSkills = Object.values(current.additionalSkills).flat(),
						removeSkill2 = removeSkill.slice().removeArray(keepSkills);
					if (removeSkill2.length) {
						current.removeSkill(removeSkill2);
					}
					if (check(name, current, "j")) {
						current.addSkill(addSkill);
					}
					if (check(name, current, "e")) {
						current.addEquipTrigger({ name: map[name] });
					}
					let vcards = current.getVCards("e", { name });
					while (vcards.length) {
						let vcard = vcards.shift();
						current.$addVirtualEquip(vcard, vcard.cards);
					}
				}
			}
		},
		subSkill: {
			restore: {
				charlotte: true,
				onremove(player, skill) {
					get.info(skill).contentx.apply(this, [null, null, player]);
				},
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					for (let name of ["duanjian", "serafuku", "yonglv"]) {
						if (_status.zc26_huaxiu?.[name]?.includes(player)) {
							return true;
						}
					}
					return false;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					get.info(event.name).contentx.apply(this, arguments);
				},
				contentx(event, trigger, player) {
					game.broadcastAll(function (player) {
						for (let name of ["duanjian", "serafuku", "yonglv"]) {
							if (_status.zc26_huaxiu?.[name]?.includes(player)) {
								_status.zc26_huaxiu[name].remove(player);
								lib.init.sheet(`
									.card[data-card-name = "${name}"]>.image {
										background-image: url(${lib.assetURL}image/card/${name}.png) !important;
									}
								`);
							}
						}
					}, player);
					function check(name, target, method) {
						if (method == "e") {
							return target.hasVCard({ name }, "e");
						} else if (method == "j") {
							return target.hasVCard(card => {
								if (!card.storage?.equipEnable) {
									return false;
								}
								return card.cards.some(cardx => cardx.name == name);
							}, "j");
						}
						return false;
					}
					const map = {
						duanjian: "zc26_zhuge",
						serafuku: "zc26_bagua",
						yonglv: "zc26_lingling",
					};
					for (let name of ["duanjian", "serafuku", "yonglv"]) {
						if (name in _status.zc26_huaxiu && !_status.zc26_huaxiu[name].length) {
							game.log(`#y${get.translation({ name })}`, "的效果还原了");
							game.broadcastAll(function (name) {
								delete _status.zc26_huaxiu[name];
							}, name);
							lib.card[name] = _status.zc26_huaxiu_origin[name].info;
							lib.translate[name] = _status.zc26_huaxiu_origin[name].translate;
							lib.translate[`${name}_info`] = _status.zc26_huaxiu_origin[name].translate2;
							const addSkill = get.skillsFromEquips([{ name }]),
								removeSkill = get.skillsFromEquips([{ name: map[name] }]);
							for (let current of game.players) {
								let keepSkills = Object.values(current.additionalSkills).flat(),
									removeSkill2 = removeSkill.slice().removeArray(keepSkills);
								if (removeSkill2.length) {
									current.removeSkill(removeSkill2);
								}
								if (check(name, current, "j")) {
									current.addSkill(addSkill);
								} else if (check(name, current, "e")) {
									current.addEquipTrigger({ name });
								}
								let vcards = current.getVCards("e", { name });
								while (vcards.length) {
									let vcard = vcards.shift();
									current.$addVirtualEquip(vcard, vcard.cards);
								}
							}
						}
					}
				},
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	zc26_zhuge_skill: {
		equipSkill: true,
		firstDo: true,
		locked: true,
		audio: "zhuge_skill",
		mod: {
			cardUsable(card, player, num) {
				let cards = player.getCards("e", card => get.name(card) == "zc26_zhuge");
				if (card.name === "sha") {
					if (!cards.length || player.hasSkill("zc26_zhuge_skill", null, false) || cards.some(card => card !== _status.zc26_zhuge_temp && !ui.selected.cards.includes(card))) {
						if (get.is.versus() || get.is.changban()) {
							return num + 3;
						}
						return Infinity;
					}
				}
			},
			cardEnabled2(card, player) {
				if (!_status.event.addCount_extra || player.hasSkill("zc26_zhuge_skill", null, false)) {
					return;
				}
				let cards = player.getCards("e", card => get.name(card) == "zc26_zhuge");
				if (card && cards.includes(card)) {
					let cardz;
					try {
						cardz = get.card();
					} catch (e) {
						return;
					}
					if (!cardz || cardz.name !== "sha") {
						return;
					}
					_status.zc26_zhuge_temp = card;
					let bool = lib.filter.cardUsable(get.autoViewAs(cardz, ui.selected.cards.concat([card])), player);
					delete _status.zc26_zhuge_temp;
					if (!bool) {
						return false;
					}
				}
			},
		},
		trigger: { player: ["useCard1", "useCardToPlayered"] },
		filter(event, player, triggername) {
			if (event.card.name != "sha") {
				return false;
			}
			if (event.name == "useCard") {
				return !event.audioed && player.countUsed("sha", true) > 1 && event.getParent().type === "phase";
			}
			return game.dead.length && event.target.countCards("h");
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = { bool: true };
			} else {
				event.result = await player
					.chooseTarget(`###${get.prompt(event.skill)}###令任意名死亡角色依次观看${get.translation(trigger.target)}手牌并可以重铸其中一张牌`, [1, game.dead.length])
					.set("filterTarget", (_, player, target) => target.isDead())
					.set("ai", target => get.attitude(get.player(), target) > 0)
					.set("deadTarget", true)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				trigger.audioed = true;
			} else {
				event.targets.sortBySeat(_status.currentPhase);
				for (const current of event.targets) {
					if (!current.isDead()) {
						continue;
					}
					await current.viewHandcards(trigger.target);
					const cards = trigger.target.getCards("h", card => lib.filter.cardRecastable(card, trigger.target, trigger.target));
					if (!cards.length) {
						return;
					}
					const result = await current
						.chooseCardButton(`请选择重铸${get.translation(trigger.target)}的一张手牌`, cards)
						.set("ai", ({ link }) => {
							const { player, target } = get.event();
							if (get.attitude(player, target) > 0) {
								return 20 - get.value(link);
							}
							return get.value(link);
						})
						.set("target", trigger.target)
						.set("forceDie", true)
						.forResult();
					if (result?.bool && result.links?.length) {
						await trigger.target.recast(result.links);
					}
				}
			}
		},
	},
	zc26_bagua_skill: {
		equipSkill: true,
		audio: "bagua_skill",
		trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
		filter(event, player) {
			if (event.responded) {
				return false;
			}
			if (event.zc26_bagua_skill) {
				return false;
			}
			if (!event.filterCard || !event.filterCard(get.autoViewAs({ name: "shan" }, []), player, event)) {
				return false;
			}
			if (event.name === "chooseToRespond" && !lib.filter.cardRespondable(get.autoViewAs({ name: "shan" }, []), player, event)) {
				return false;
			}
			if (player.hasSkillTag("unequip2")) {
				return false;
			}
			let evt = event.getParent();
			if (
				evt.player &&
				evt.player.hasSkillTag("unequip", false, {
					name: evt.card ? evt.card.name : null,
					target: player,
					card: evt.card,
				})
			) {
				return false;
			}
			return true;
		},
		check(event, player) {
			if (!event) {
				return true;
			}
			if (event.ai) {
				let ai = event.ai;
				let tmp = _status.event;
				_status.event = event;
				let result = ai({ name: "shan" }, _status.event.player, event);
				_status.event = tmp;
				return result > 0;
			}
			const type = event.name === "chooseToRespond" ? "respond" : "use";
			let evt = event.getParent();
			if (player.hasSkillTag("noShan", null, type)) {
				return false;
			}
			if (!evt || !evt.card || !evt.player || player.hasSkillTag("useShan", null, type)) {
				return true;
			}
			if (evt.card && evt.player && player.isLinked() && game.hasNature(evt.card) && get.attitude(player, evt.player._trueMe || evt.player) > 0) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			trigger.zc26_bagua_skill = true;
			if (game.dead.length) {
				const { targets } = await player
					.chooseTarget(`###${get.prompt(event.name)}###令一名死亡角色卜算3`)
					.set("filterTarget", (_, player, target) => target.isDead())
					.set("ai", target => get.attitude(get.player(), target) > 0)
					.set("deadTarget", true)
					.forResult();
				if (targets?.length) {
					player.line(targets[0]);
					game.log(player, "令", targets[0], "卜算3");
					await targets[0].chooseToGuanxing(3).set("forceDie", true);
				}
			}
			const result = await player
				.judge("zc26_bagua", card => (get.color(card) === "red" ? 1.5 : -0.5))
				.set("judge2", result => result.bool)
				.forResult();
			if (result.bool > 0) {
				trigger.untrigger();
				trigger.set("responded", true);
				trigger.result = { bool: true, card: get.autoViewAs({ name: "shan", isCard: true }, []), cards: [] };
			}
		},
		ai: {
			respondShan: true,
			freeShan: true,
			skillTagFilter(player, tag, arg) {
				if (tag !== "respondShan" && tag !== "freeShan") {
					return;
				}
				if (player.hasSkillTag("unequip2")) {
					return false;
				}
				if (!arg || !arg.player) {
					return true;
				}
				if (
					arg.player.hasSkillTag("unequip", false, {
						target: player,
					})
				) {
					return false;
				}
				return true;
			},
			effect: {
				target(card, player, target, effect) {
					if (target.hasSkillTag("unequip2")) {
						return;
					}
					if (
						player.hasSkillTag("unequip", false, {
							name: card ? card.name : null,
							target: target,
							card: card,
						}) ||
						player.hasSkillTag("unequip_ai", false, {
							name: card ? card.name : null,
							target: target,
							card: card,
						})
					) {
						return;
					}
					if (get.tag(card, "respondShan")) {
						return 0.5;
					}
				},
			},
		},
	},
	zc26_lingling_skill: {
		equipSkill: true,
		trigger: {
			player: "phaseZhunbeiBegin",
			global: "roundEnd",
		},
		getIndex(event, player) {
			if (event.name == "phaseZhunbei") {
				return 1;
			}
			const es = player.getCards("e", card => get.info(card)?.name == "zc26_lingling"),
				js = player.getCards("j", card => {
					if (get.type(card) != "delay") {
						false;
					}
					const vcard = card[card.cardSymbol];
					if (!vcard || !vcard.storage?.equipEnable) {
						return false;
					}
					return vcard.cards.some(cardx => get.info(cardx)?.name == "zc26_lingling");
				});
			return es.concat(js);
		},
		filter(event, player, triggername, card) {
			if (event.name == "phaseZhunbei") {
				return true;
			}
			if (!game.dead.length) {
				return false;
			}
			return !event.next[event.next.length - 1]?.zc26_lingling?.includes(card);
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				const { targets } = await player
					.chooseTarget(`軨軨：选择一名角色对其造成1点雷电伤害`, true)
					.set("ai", target => get.damageEffect(target, get.player(), get.player(), "thunder"))
					.forResult();
				if (targets?.length) {
					await targets[0].damage(player, "thunder");
				}
			} else {
				trigger.next[trigger.next.length - 1].zc26_lingling ??= [];
				trigger.next[trigger.next.length - 1].zc26_lingling.add(event.indexedData);
				const targets = game.dead.slice();
				const map = await game.chooseAnyOL(targets, get.info(event.name).chooseControl, [player, event.indexedData]).forResult();
				for (const target of targets) {
					let source = game.findPlayer(current => current.hasCard(card => card == event.indexedData, "ej")),
						aim;
					const control = map.get(target).control;
					if (control == "上家") {
						aim = source?.previous;
					} else if (control == "下家") {
						aim = source?.next;
					}
					if (!source || !aim) {
						return;
					}
					await target
						.moveCard(true, source, aim, card => {
							const cardx = get.event().card;
							if (get.itemtype(card) == "card") {
								return card == cardx;
							}
							return card == cardx[cardx.cardSymbol];
						})
						.set("card", event.indexedData)
						.set("forceDie", true)
						.setContent(async function (event, trigger, player) {
							if (player.canMoveCard(null, event.nojudge, event.sourceTargets, event.aimTargets, event.filter, event.canReplace ? "canReplace" : "noReplace")) {
								const source = event.sourceTargets[0],
									aim = event.aimTargets[0];
								let position = "j";
								event.result = {
									bool: true,
									links: [event.card],
									card: event.card,
								};
								if (source.getCards("e").includes(event.card)) {
									position = "e";
									if (!event.card.cards?.length) {
										source.removeVirtualEquip(event.card);
									}
									await aim.equip(event.card);
								} else {
									if (!event.card.cards?.length) {
										source.removeVirtualJudge(event.card);
									}
									await aim.addJudge(event.card, event.card?.cards);
								}
								if (event.card.cards?.length) {
									source.$give(event.card.cards, aim, false);
								}
								game.log(source, "的", event.card, "被移动给了", aim);
								event.result.position = position;
								await game.delay();
							}
						});
				}
			}
		},
		chooseControl(player, source, card, eventId) {
			return player
				.chooseControl(["上家", "下家"])
				.set("prompt", "軨軨：秘密选择一个方向")
				.set("prompt2", `令${get.translation(source)}的${get.translation(card)}移动至其上家或下家`)
				.set("ai", () => {
					//哪管死后洪水滔天
					let controls = get.event().controls.slice();
					return get.event().getRand() < 0.5 ? controls[0] : controls[1];
				})
				.set("id", eventId)
				.set("_global_waiting", true);
		},
	},
	//线下标记神马
	mark_shouli: {
		audio: "shouli",
		addMark(player, name) {
			const next = game.createEvent("gainShouli", false);
			next.player = player;
			next.num = 1;
			next.mark = name;
			next.setContent("emptyEvent");
			if (player.countMark(name)) {
				next.hasMark = true;
			}
			player.addMark(name, 1);
			return next;
		},
		changeMark(player, target, name) {
			const num = player.countMark(name);
			const next = game.createEvent("gainShouli", false);
			next.player = target;
			next.num = num;
			next.mark = name;
			next.setContent("emptyEvent");
			if (target.countMark(name)) {
				next.hasMark = true;
			}
			player.removeMark(name, num, false);
			target.addMark(name, num, false);
			game.log(player, "的", `#g“${get.translation(name)}”`, "被移动给了", target);
			return next;
		},
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (name != "sha" && name != "shan") {
				return false;
			}
			return (
				!player.getStorage("mark_shouli_used").includes(name) &&
				game.hasPlayer(current => {
					return current != player && current.hasMark(`mark_shouli_${name == "sha" ? "jun" : "li"}`);
				})
			);
		},
		filter(event, player) {
			if (event.responded || event.mark_shouli || event.type == "wuxie") {
				return false;
			}
			return ["sha", "shan"].some(name => {
				if (
					!game.hasPlayer(current => {
						return current != player && current.hasMark(`mark_shouli_${name == "sha" ? "jun" : "li"}`);
					})
				) {
					return false;
				}
				if (player.getStorage("mark_shouli_used").includes(name)) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: name, storage: { mark_shouli: true }, isCard: true }, "unsure"), player, event);
			});
		},
		filterTarget(card, player, target) {
			if (ui.selected.targets?.length) {
				const owner = ui.selected.targets[0];
				return target == owner.getNext() || target == owner.getPrevious();
			}
			if (target == player) {
				return false;
			}
			let event = _status.event,
				evt = event;
			if (event._backup) {
				evt = event._backup;
			}
			return ["sha", "shan"].some(name => {
				const card = get.autoViewAs({ name: name, storage: { mark_shouli: true }, isCard: true }, "unsure"),
					mark = `mark_shouli_${name == "sha" ? "jun" : "li"}`;
				if (!target.hasMark(mark) || player.getStorage("mark_shouli_used").includes(name)) {
					return false;
				}
				if (!evt.filterCard(card, player, event)) {
					return false;
				}
				if (name == "sha") {
					return !evt.filterTarget || game.hasPlayer(current => evt.filterTarget(card, player, current));
				}
				return true;
			});
		},
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		delay: false,
		locked: false,
		prompt: "将一名其他角色的所有“骏”/“骊”移动至其上家或下家，视为使用或打出一张【杀】/【闪】",
		async content(event, trigger, player) {
			const evt = event.getParent(2);
			evt.set("mark_shouli", true);
			const list = [];
			const backupx = _status.event;
			_status.event = evt;
			["sha", "shan"].forEach(name => {
				const card = get.autoViewAs({ name: name, storage: { mark_shouli: true }, isCard: true }, "unsure"),
					mark = `mark_shouli_${name == "sha" ? "jun" : "li"}`;
				if (!event.targets[0].hasMark(mark) || player.getStorage("mark_shouli_used").includes(name)) {
					return false;
				}
				if (name == "sha") {
					if (!evt.filterCard(card, player, evt)) {
						return false;
					}
					if (evt.filterTarget && !game.hasPlayer(current => evt.filterTarget(card, player, current))) {
						return false;
					}
				} else if (!evt.filterCard(card, player, event)) {
					return false;
				}
				list.push(["", "", name]);
			});
			_status.event = backupx;
			const result =
				list.length > 1
					? await player
							.chooseButton(["狩骊：选择你要视为使用的牌", [list, "vcard"]], true)
							.set("ai", button => {
								return Math.random();
							})
							.forResult()
					: {
							bool: true,
							links: list,
						};
			if (!result?.bool) {
				return;
			}
			const name = result.links[0][2],
				mark = `mark_shouli_${name == "sha" ? "jun" : "li"}`;
			get.info(event.name).changeMark(...event.targets, mark);
			player.addTempSkill("mark_shouli_used");
			player.markAuto("mark_shouli_used", name);
			if (evt.name == "chooseToUse") {
				game.broadcastAll(function (name) {
					lib.skill.mark_shouli_backup.viewAs = {
						name: name,
						storage: { mark_shouli: true },
						isCard: true,
					};
					lib.skill.mark_shouli_backup.prompt = `选择${get.translation(name)}的目标`;
				}, name);
				evt.set("_backupevent", "mark_shouli_backup");
				evt.backup("mark_shouli_backup");
				evt.set("openskilldialog", `选择${get.translation(name)}的目标`);
				evt.set("norestore", true);
				evt.set("custom", {
					add: {},
					replace: { window() {} },
				});
			} else {
				delete evt.result.used;
				delete evt.result.skill;
				evt.result.card = get.autoViewAs({
					name: name,
					storage: { mark_shouli: true },
					isCard: true,
				});
				evt.result.cards = [];
				evt.redo();
				return;
			}
			evt.goto(0);
		},
		mod: {
			targetInRange(card, player) {
				if (card?.storage?.mark_shouli) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (card?.storage?.mark_shouli) {
					return Infinity;
				}
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				return get.info("mark_shouli").hiddenCard(player, tag == "respondSha" ? "sha" : "shan");
			},
			order: 2,
			result: {
				player(player, target) {
					var att = Math.max(8, get.attitude(player, target));
					if (ui.selected.targets?.length) {
						return 10 + att;
					}
					if (_status.event.type != "phase") {
						return 9 - att;
					}
					if (!player.hasValueTarget({ name: "sha" }, false)) {
						return 0;
					}
					return 9 - att;
				},
			},
		},
		derivation: ["mark_shouli_jun", "mark_shouli_li"],
		group: "mark_shouli_init",
		global: "mark_shouli_effect",
		subSkill: {
			effect: {
				trigger: {
					player: ["phaseDrawBegin2", "useCardToPlayer", "damageBegin3", "damageBegin4"],
					source: "damageBegin1",
				},
				filter(event, player, name) {
					const target = name == "damageBegin1" ? event.source : event.player;
					if (!target?.isIn() || !game.hasPlayer(current => current.hasSkill("mark_shouli"))) {
						return false;
					}
					const jun = target.countMark("mark_shouli_jun"),
						li = target.countMark("mark_shouli_li");
					if (name == "damageBegin4") {
						if (jun + li <= 0) {
							return false;
						}
						if (event.hasNature()) {
							return true;
						}
						return event.card?.name && ["wanjian", "nanman"].includes(event.card.name);
					}
					if (name == "useCardToPlayer") {
						return event.card?.name == "sha" && jun > 2;
					}
					if (event.name == "damage") {
						return li > 2;
					}
					return (jun > 1 || li > 1) && !event.numFixed;
				},
				async cost(event, trigger, player) {
					event.result = {
						bool: true,
						skill_popup: false,
					};
				},
				async content(event, trigger, player) {
					const name = event.triggername,
						target = trigger[name == "damageBegin1" ? "source" : "player"],
						jun = target.countMark("mark_shouli_jun"),
						li = target.countMark("mark_shouli_li"),
						num = game.countPlayer(current => current.hasSkill("mark_shouli"));
					switch (name) {
						case "phaseDrawBegin2": {
							if (jun > 1) {
								trigger.num += num;
							}
							if (li > 1) {
								trigger.num += num;
							}
							break;
						}
						case "useCardToPlayer": {
							trigger.target.addTempSkill("fengyin");
							break;
						}
						case "damageBegin1": {
							if (li > 2) {
								game.setNature(trigger, "thunder");
							}
							if (li > 3) {
								trigger.num += num;
							}
							break;
						}
						case "damageBegin3": {
							if (li > 2) {
								game.setNature(trigger, "thunder");
							}
							if (li > 3) {
								trigger.num += num;
							}
							break;
						}
						default: {
							if (jun > 0 && target.getPrevious()?.isIn() && target.getPrevious() != target) {
								get.info("mark_shouli").changeMark(target, target.getPrevious(), "mark_shouli_jun");
							}
							if (li > 0 && target.getNext()?.isIn() && target.getNext() != target) {
								get.info("mark_shouli").changeMark(target, target.getNext(), "mark_shouli_li");
							}
							break;
						}
					}
				},
				locked: false,
				mod: {
					globalFrom(from, to, distance) {
						if (!from.countMark("mark_shouli_jun")) {
							return;
						}
						const num = game.countPlayer(current => current.hasSkill("mark_shouli"));
						return distance - num;
					},
					globalTo(from, to, distance) {
						if (!to.countMark("mark_shouli_li")) {
							return;
						}
						const num = game.countPlayer(current => current.hasSkill("mark_shouli"));
						return distance + num;
					},
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: {
				async precontent(event, trigger, player) {
					event.result._apply_args = { addSkillCount: false };
					player.popup(event.result.card.name, "metal");
					await game.delayx();
					event.getParent().addCount = false;
				},
				filterCard: () => false,
				prompt: "请选择【杀】的目标",
				selectCard: -1,
				log: false,
			},
			init: {
				audio: "mark_shouli",
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					if (!game.hasPlayer(current => current != player)) {
						return false;
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async cost(event, trigger, player) {
					event.result = {
						bool: true,
						targets: game.filterPlayer(current => current != player),
					};
				},
				async content(event, trigger, player) {
					let marks = [];
					for (let i = 0; i < 4; i++) {
						marks.push("mark_shouli_li");
						if (i < 3) {
							marks.push("mark_shouli_jun");
						}
					}
					for (const target of event.targets) {
						if (!marks.length) {
							break;
						}
						const mark = marks.randomRemove();
						await get.info("mark_shouli").addMark(target, mark);
					}
				},
			},
			jun: {
				markimage2: "image/card/chitu.png",
				nopop: true,
				intro: {
					name: "骏",
					content(storage, player) {
						const list = ["⚡你计算与其他角色的距离-1", "⚡摸牌阶段你额外摸一张牌", "⚡你使用【杀】指定目标时，令其本回合非锁定技失效"];
						let str = "⚡当你受到属性伤害或【南蛮入侵】、【万箭齐发】造成的伤害时，你将所有“骏”移动至你上家";
						if (typeof storage != "number" || storage <= 0) {
							return str;
						}
						return `${str}<br>${list.slice(0, storage).join("<br>")}`;
					},
				},
			},
			li: {
				markimage2: "image/card/dilu.png",
				nopop: true,
				intro: {
					name: "骊",
					content(storage, player) {
						const list = ["⚡其他角色计算与你的距离+1", "⚡摸牌阶段你额外摸一张牌", "⚡你造成或受到的伤害视为雷电伤害", "⚡你造成或受到的伤害+1"];
						let str = "⚡当你受到属性伤害或【南蛮入侵】、【万箭齐发】造成的伤害时，你将所有“骊”移动至你下家";
						if (typeof storage != "number" || storage <= 0) {
							return str;
						}
						return `${str}<br>${list.slice(0, storage).join("<br>")}`;
					},
				},
			},
		},
	},
	mark_hengwu: {
		audio: "hengwu",
		trigger: {
			global: "gainShouli",
		},
		filter(event, player) {
			const mark = event.mark;
			return event.hasMark && event.player.countMark(mark);
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			await player.draw(trigger.player.countMark(trigger.mark));
		},
		ai: {
			combo: "mark_shouli",
		},
	},
	//渭南神马超
	wn_qiangshu: {
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			if (!event.card || !["sha", "juedou"].includes(event.card.name)) {
				return false;
			}
			const num = player.getAttackRange() - 1;
			return num > 0 && player.countCards("he") >= num;
		},
		async cost(event, trigger, player) {
			const num = player.getAttackRange() - 1;
			event.result = await player
				.chooseToDiscard("he", get.prompt2(event.skill), num)
				.set("chooseonly", true)
				.set("ai", card => {
					const trigger = get.event().getTrigger(),
						player = get.player();
					if (get.damageEffect(trigger.player, trigger.source, player) <= 0) {
						return 0;
					}
					return 7 - get.value(card);
				})
				.forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			trigger.num += event.cards.length;
		},
	},
	wn_yuma: {
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
		},
		usable: 1,
		filter(event, player) {
			if (!event.getd) {
				return false;
			}
			let cards = event.getd();
			return cards.some(card => {
				if (get.position(card) != "d" || get.type(card) != "equip") {
					return false;
				}
				if (card.willBeDestroyed("discardPile", get.owner(card), event)) {
					return false;
				}
				return game.hasPlayer(current => {
					return current.canEquip(card, true);
				});
			});
		},
		async cost(event, trigger, player) {
			const cards = trigger.getd().filter(card => {
				if (get.position(card) != "d" || get.type(card) != "equip") {
					return false;
				}
				if (card.willBeDestroyed("discardPile", get.owner(card), trigger)) {
					return false;
				}
				return true;
			});
			const { bool, targets, links } = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), cards],
					filterTarget(card, player, target) {
						const buttons = ui.selected.buttons;
						if (!buttons.length) {
							return false;
						}
						return target.canEquip(buttons[0].link, true);
					},
					ai1(button) {
						return 20 - get.value(button.link);
					},
					ai2(target) {
						const player = get.player();
						const card = ui.selected.buttons[0]?.link;
						if (!card) {
							return 0;
						}
						if (!target.countCards("h")) {
							return get.value(card, target) * get.attitude(player, target);
						}
						return (get.value(card, target) - 2 * target.countCards("h")) * get.attitude(player, target);
					},
				})
				.forResult();
			event.result = {
				bool: bool,
				targets: targets,
				cards: links,
			};
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards: [card],
			} = event;
			target.$gain2(card);
			await game.delay();
			await target.equip(card);
			const num = target.countCards("h");
			if (num > 0 && target != player) {
				await player.gainPlayerCard(target, true, "h", num);
			}
		},
	},
	//渭南神许褚
	wn_zhuanzhan: {
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			if (event.player == player || !player.hasEnabledSlot()) {
				return false;
			}
			const card = new lib.element.VCard({ name: "juedou", isCard: true });
			return player.canUse(card, event.player);
		},
		async cost(event, trigger, player) {
			let list = [];
			for (let i = 1; i <= 5; i++) {
				const slot = `equip${i}`;
				if (player.hasEnabledSlot(slot)) {
					list.push("equip" + i);
				}
			}
			list.push("cancel2");
			let bool = "cancel2";
			const card = new lib.element.VCard({ name: "juedou", isCard: true });
			if (get.effect(trigger.player, card, player, player) > 0) {
				bool = list.filter(i => i != "cancel2").randomGet();
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", get.prompt2(event.skill))
				.set("ai", () => get.event().bool)
				.set("bool", bool)
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				targets: [trigger.player],
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const slot = event.cost_data;
			await player.disableEquip([slot]);
			const card = new lib.element.VCard({ name: "juedou", isCard: true });
			if (player.canUse(card, trigger.player)) {
				await player.useCard(card, trigger.player);
			}
		},
	},
	wn_huwei: {
		trigger: {
			player: "phaseDrawBegin2",
		},
		forced: true,
		filter(event, player) {
			let list = Array.from({ length: 13 }).map((_, i) => "equip" + parseFloat(i + 1));
			list = list.filter(i => player.hasDisabledSlot(i));
			return !event.numFixed && list.length;
		},
		async content(event, trigger, player) {
			let list = Array.from({ length: 13 }).map((_, i) => "equip" + parseFloat(i + 1));
			let num = list.reduce((sum, slot) => sum + player.countDisabledSlot(slot), 0);
			trigger.num += num;
		},
	},
	//汉末神王允
	caanchao: {
		trigger: {
			global: "phaseAfter",
		},
		frequent: true,
		filter(event, player) {
			return game.hasPlayer2(current => {
				return current.hasHistory("useCard", evt => {
					return get.is.convertedCard(evt.card) || get.is.virtualCard(evt.card);
				});
			}, true);
		},
		async content(event, trigger, player) {
			await player.draw();
			player.addCharge();
		},
	},
	cayurong: {
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			if (!get.is.damageCard(event.card)) {
				return false;
			}
			if (player.getStorage("cayurong_targeted").includes(event.card.name)) {
				return false;
			}
			return true;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.getParent().excluded.add(player);
			player.addTempSkill("cayurong_targeted", "roundStart");
			player.markAuto("cayurong_targeted", [trigger.card.name]);
		},
		subSkill: {
			targeted: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	cadingxi: {
		chargeSkill: Infinity,
		locked: false,
		enable: "chooseToUse",
		getCanUse(event, player) {
			return lib.inpile.filter(i => event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event));
		},
		hiddenCard(player, name) {
			if (lib.inpile.includes(name)) {
				return player.countCharge();
			}
		},
		filter(event, player) {
			if (event.responded || !player.countCharge()) {
				return false;
			}
			return lib.skill["cadingxi"].getCanUse(event, player).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = lib.skill["cadingxi"]
					.getCanUse(event, player)
					.map(name => get.type2(name))
					.unique();
				const dialog = ui.create.dialog("定西", [list.map(type => ["", "", "caoying_" + type]), "vcard"]);
				dialog.direct = true;
				return dialog;
			},
			check(event, player) {
				return Math.random();
			},
			backup(links, player) {
				const type = links[0][2].slice(8);
				return {
					type: type,
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					async content(event, trigger, player) {
						const type = lib.skill[event.name].type,
							evt = event.getParent(2),
							filterCard = evt.name == "_wuxie" ? (card, player, event) => card.name == "wuxie" : evt.filterCard;
						player.removeCharge();
						const cards = get.cards(1, true),
							card = cards[0];
						await player.showCards(cards, `${get.translation(player)}发动了【定西】`);
						let key;
						switch (evt.name) {
							case "_wuxie":
								key = "wuxieresult2";
								break;
							default:
								key = "result";
						}
						if (get.type2(card) == type) {
							event.getParent().set("cadingxi_result", true);
							const history = player.getAllHistory("useSkill", evt => evt.skill == event.name);
							const list = history.slice(-Math.min(3, history.length)).map(evt => evt.event.cadingxi_result);
							if (list.slice(-2).length >= 2 && !list.slice(-2).some(i => !i)) {
								await player.recoverTo(player.maxHp);
							}
							if (list.length >= 3 && !list.some(i => !i)) {
								const damage = async target => {
									await target.damage();
								};
								const targets = game.filterPlayer(target => target != player);
								player.line(targets);
								await game.doAsyncInOrder(targets, damage);
							}
							if (filterCard(get.autoViewAs(card), player, evt)) {
								if (evt.name == "chooseToUse") {
									game.broadcastAll(
										(result, name) => {
											lib.skill.cadingxi_backup2.viewAs = { name: name, cards: [result], isCard: true };
										},
										card,
										card.name
									);
									evt.set("_backupevent", "cadingxi_backup2");
									evt.set("openskilldialog", "请选择" + get.translation(card) + "的目标");
									evt.backup("cadingxi_backup2");
								} else {
									delete evt[key].used;
									evt[key].card = get.autoViewAs(card);
									evt[key].cards = [card];
									delete evt[key].skill;
									evt.redo();
									return;
								}
							}
						} else {
							event.getParent().set("cadingxi_result", false);
							await player.draw("bottom");
						}
						evt.goto(0);
					},
				};
			},
		},
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && player.isPhaseUsing()) {
					let evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt && evt.card && get.type2(evt.card) && get.type2(evt.card) == get.type2(card)) {
						return num + 10;
					}
				}
			},
		},
		group: "cadingxi_init",
		subSkill: {
			backup2: {
				async precontent(event, trigger, player) {
					const name = event.result?.card?.name;
					const cards = event.result.card?.cards.slice(0);
					event.result.cards = cards;

					const rcard = cards[0];
					let card;
					if (rcard.name == name) {
						card = get.autoViewAs(rcard);
					} else {
						card = get.autoViewAs({ name, isCard: true });
					}

					event.result.card = card;
				},
				filterCard: () => false,
				selectCard: -1,
				log: false,
			},
			backup: {},
			init: {
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					if (!player.countCharge(true)) {
						return false;
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addCharge(4);
				},
			},
		},
	},
	//汉末神曹
	cazhaoshao: {
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		getIndex(event) {
			return event.num;
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
			let targets = [],
				target;
			for (let current of [trigger.source, trigger.player]) {
				if (current?.isIn()) {
					targets.add(current);
				}
			}
			if (!targets.length) {
				return;
			}
			if (targets.length > 1) {
				const result = await player
					.chooseTarget("选择执行【诏绍】的目标", true, (card, player, target) => {
						const trigger = get.event().getTrigger();
						return target == trigger.player || target == trigger.source;
					})
					.set("ai", target => {
						const player = get.player();
						return get.attitude(player, target) * (Math.random() - 0.5);
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				target = result.targets[0];
			} else {
				target = targets[0];
			}
			player.line(target, "green");
			let choices = ["获得弃牌堆或场上一张装备牌并使用", "翻面并摸一张牌", "减少1点体力上限"];
			const { control } = await player
				.chooseControl()
				.set("choiceList", choices)
				.set("prompt", `令${get.translation(target)}执行一项`)
				.set("target", target)
				.set("ai", () => {
					const { player, target } = get.event();
					let eff = 1;
					for (let current of game.players) {
						if (current == target) {
							continue;
						}
						eff += get.effect(current, { name: "losehp" }, current, player);
					}
					if (target.hasSkill("caxiaoxiong") && eff > 0) {
						return "选项二";
					}
					if (get.attitude(player, target) > 0) {
						return target.isTurnedOver() ? "选项二" : "选项一";
					}
					if (!target.isTurnedOver() && Math.random() < 0.2) {
						return "选项二";
					}
					return "选项三";
				})
				.forResult();
			switch (control) {
				case "选项一": {
					let bool = false,
						equip;
					if (
						game.hasPlayer(current => {
							return current.countGainableCards(target, "e");
						})
					) {
						const result2 = await target
							.chooseTarget("获得场上的一张装备牌，或点取消从弃牌堆获得一张装备牌", (card, player, target) => {
								return target.countGainableCards(player, "e");
							})
							.set("ai", target => {
								const player = get.player();
								if (get.attitude(player, target) < 0) {
									if (target.countCards("e", card => get.value(card, player) >= 6)) {
										return 12;
									}
									return 0;
								}
								return 0;
							})
							.forResult();
						if (result2.bool) {
							bool = result2.targets[0];
						}
					}
					if (bool) {
						const result3 = await target.gainPlayerCard(bool, "e", true).forResult();
						equip = result3.links[0];
					} else {
						equip = get.discardPile(card => get.type(card) == "equip" && get.subtypes(card)?.length);
						if (equip) {
							await target.gain(equip, "gain2");
						} else {
							break;
						}
						game.updateRoundNumber();
					}
					target.addSkill("cazhaoshao_equip");
					if (target.getStorage("cazhaoshao_equip").length) {
						let list = target.getStorage("cazhaoshao_equip"),
							equips = target.getCards("e", card => list[1].includes(card));
						if (equips.length) {
							await target.loseToDiscardpile(equips);
							//await lib.skill.cazhaoshao.closeEquip(target, target, list[0]);
							//target.setStorage("cazhaoshao_equip", []);
						}
					}
					const subtypes = get.subtypes(equip);
					await target.expandEquip(subtypes);
					await target.equip(equip);
					target.setStorage("cazhaoshao_equip", [subtypes, [equip]]);
					break;
				}
				case "选项二": {
					await target.turnOver();
					await target.draw();
					break;
				}
				case "选项三": {
					await target.loseMaxHp();
					break;
				}
			}
		},
		closeEquip() {
			const next = game.createEvent("closenEquip");
			next.slots = [];
			for (let i = 0; i < arguments.length; i++) {
				if (get.itemtype(arguments[i]) == "player") {
					if (!next.player) {
						next.player = arguments[i];
					} else {
						next.source = arguments[i];
					}
				} else if (Array.isArray(arguments[i])) {
					for (var arg of arguments[i]) {
						if (typeof arg == "string") {
							if (arg.startsWith("equip") && parseInt(arg.slice(5)) > 0) {
								next.slots.push(arg);
							}
						} else if (typeof arg == "number") {
							next.slots.push("equip" + arg);
						}
					}
				} else if (typeof arguments[i] == "string") {
					if (arguments[i].startsWith("equip") && parseInt(arguments[i].slice(5)) > 0) {
						next.slots.push(arguments[i]);
					}
				} else if (typeof arguments[i] == "number") {
					next.slots.push("equip" + arguments[i]);
				}
			}
			if (!next.player) {
				next.player = get.player();
			}
			if (!next.source) {
				next.source = get.player();
			}
			if (!next.slots.length) {
				_status.event.next.remove(next);
				next.resolve();
			}
			next.setContent(lib.skill.cazhaoshao.closenEquip);
			return next;
		},
		async closenEquip(event, trigger, player) {
			let slotsx = [];
			if (get.is.mountCombined()) {
				event.slots.forEach(type => {
					if (type == "equip3" || type == "equip4") {
						slotsx.add("equip3_4");
					} else {
						slotsx.add(type);
					}
				});
			} else {
				slotsx.addArray(event.slots);
			}
			slotsx.sort();
			for (var slot of slotsx) {
				var expand = get.numOf(event.slots, slot),
					slot_key = slot;
				if (slot == "equip3_4") {
					expand = Math.max(get.numOf(event.slots, "equip3"), get.numOf(event.slots, "equip4"));
					slot_key = "equip3";
				}
				game.log(player, "失去了" + get.cnNumber(expand) + "个额外的", "#g" + get.translation(slot) + "栏");
				if (!player.expandedSlots) {
					player.expandedSlots = {};
				}
				if (!player.expandedSlots[slot_key]) {
					player.expandedSlots[slot_key] = 0;
				}
				player.expandedSlots[slot_key] -= expand;
			}
			player.$syncExpand();
		},
		subSkill: {
			equip: {
				charlotte: true,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (!player.getStorage("cazhaoshao_equip").length) {
						return false;
					}
					const evt = event.getl(player),
						list = player.getStorage("cazhaoshao_equip");
					if (evt?.player === player && evt.es) {
						return evt.es.some(card => list[1].includes(card));
					}
				},
				direct: true,
				forced: true,
				async content(event, trigger, player) {
					await lib.skill.cazhaoshao.closeEquip(player, player.getStorage("cazhaoshao_equip")[0]);
					player.setStorage("cazhaoshao_equip", []);
				},
				mod: {
					canBeReplaced(card, player) {
						const list = player.getStorage("cazhaoshao_equip");
						if (!list.length) {
							return;
						}
						const cards = player.getVCards("e", card => (card?.cards || []).some(cardx => list[1].includes(cardx)));
						if (cards && cards.includes(card)) {
							return false;
						}
					},
				},
				sub: true,
			},
		},
	},
	caxiaoxiong: {
		trigger: {
			player: "turnOverBegin",
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
			const targets = game.players.sortBySeat().slice();
			for (let target of targets) {
				if (target == player) {
					continue;
				}
				await target.loseHp();
			}
		},
	},
	//神李郭
	caweijue: {
		forced: true,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		async content(event, trigger, player) {
			let target = player.getNext();
			while (target != player) {
				if (!target.countCards("h")) {
					target = target.getNext();
					continue;
				}
				const result = await target
					.chooseCard("h", "将任意张手牌当作“威”置于武将牌上", [1, Infinity], true, "allowChooseAll")
					.set("ai", () => {
						return -1;
					})
					.forResult();
				if (result.bool) {
					const cards = result.cards;
					const next = target.addToExpansion(cards, "giveAuto", target);
					next.gaintag.add("caweijue_tag");
					await next;
					target.addSkill("caweijue_tag");
				}
				target = target.getNext();
			}
		},
		mod: {
			inRangeOf(from, to) {
				const num1 = from.countExpansions("caweijue_tag"),
					num2 = from.countCards("h");
				if (num1 <= num2) {
					return true;
				}
			},
			inRange(from, to) {
				const num1 = to.countExpansions("caweijue_tag"),
					num2 = to.countCards("h");
				if (num1 <= num2) {
					return true;
				}
			},
		},
		subSkill: {
			tag: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.getExpansions("caweijue_tag").length > 0;
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("caweijue_tag");
					await player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“威”牌");
					player.removeSkill("caweijue_tag");
				},
				marktext: "威",
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
			},
		},
	},
	cachuxiong: {
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countCards("h");
		},
		check(event, player) {
			const colors = player
				.getCards("h")
				.map(card => get.color(card, player))
				.toUniqued();
			for (let color of colors) {
				if (lib.skill.cachuxiong.getVal(color, player) > 0) {
					return true;
				}
			}
			return false;
		},
		getVal(color, player) {
			let val = 0,
				cards = player.getCards("h", { color: color });
			val -= cards.length;
			if (color == "black") {
				val += Math.min(
					cards.length,
					game.players.reduce((sum, current) => {
						if (get.attitude(player, current) > 0) {
							return sum;
						}
						return sum + current.countExpansions("caweijue_tag");
					}, 0)
				);
				val++;
			} else if (color == "red") {
				val += game.players.reduce((sum, current) => {
					if (!player.inRange(current) || player == current) {
						return sum;
					}
					return sum + get.damageEffect(current, player, player);
				}, 0);
			}
			return val;
		},
		async content(event, trigger, player) {
			await player.showHandcards(`${get.translation(player)}发动了【除凶】`);
			let colors = player
				.getCards("h")
				.map(card => get.color(card, player))
				.toUniqued();
			if (!colors.length) {
				return;
			}
			colors.sort((a, b) => lib.skill.cachuxiong.getVal(b, player) - lib.skill.cachuxiong.getVal(a, player));
			const result = await player
				.chooseControl(colors)
				.set("prompt", "弃置一种颜色的所有手牌")
				.set("resultC", colors[0])
				.set("ai", () => {
					return get.event().resultC;
				})
				.forResult();
			if (result.control) {
				const color = result.control,
					cards = player.getDiscardableCards(player, "h").filter(card => get.color(card, player) == color);
				if (cards.length) {
					await player.discard(cards);
				}
				if (color == "black") {
					let num = cards.length;
					while (num > 0) {
						const result2 = await player
							.chooseTarget("获得一名角色的“威”", true, (card, player, target) => {
								return target.countExpansions("caweijue_tag");
							})
							.set("ai", target => {
								const player = get.player();
								return -get.attitude(player, target);
							})
							.forResult();
						if (!result2.bool) {
							break;
						}
						const target = result2.targets[0];
						const result3 = await player.chooseCardButton(`选择获得至多${get.cnNumber(num)}张“威”`, [1, num], target.getExpansions("caweijue_tag"), true).forResult();
						if (!result3.bool) {
							break;
						}
						const cards = result3.links;
						player.line(target);
						await player.gain(cards, "give", target, "bySelf");
						num -= cards.length;
						if (!game.hasPlayer(current => current.countExpansions("caweijue_tag"))) {
							break;
						}
					}
				} else if (color == "red") {
					const targets = game
						.filterPlayer(current => {
							return current != player && player.inRange(current);
						})
						.sortBySeat();
					if (targets.length) {
						for (let target of targets) {
							await target.damage();
						}
					}
				}
			}
		},
	},
	//神钟会 —— by 刘巴
	dclinjie: {
		group: "dclinjie_effect",
		marktext: "凛",
		intro: {
			name: "凛界（凛）",
			name2: "凛",
			content: "mark",
		},
		audio: 2,
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			return game.hasPlayer(target => !target.hasMark("dclinjie"));
		},
		async cost(event, trigger, player) {
			event.result = await player //
				.chooseTarget(`###${get.prompt(event.skill)}###对一名没有「凛」的角色造成1点伤害然后令其获得一个「凛」标记`, (card, player, target) => !target.hasMark("dclinjie"))
				.set("ai", target => {
					return get.damageEffect(target, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.damage();
			target.addMark(event.name, 1);
		},
		subSkill: {
			effect: {
				audio: "dclinjie",
				trigger: {
					global: "damageEnd",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					const target = event.player;
					return target !== player && target.hasMark("dclinjie") && target.countDiscardableCards(target, "h");
				},
				logTarget: "player",
				async content(event, trigger, player) {
					let target = trigger.player;
					let hs = target.getDiscardableCards(target, "h");
					if (hs.length) {
						const damage = target.countCards("h") == 1;
						await target.discard(hs.randomGet());
						if (damage) {
							await target.damage();
							target.clearMark("dclinjie");
						}
					}
				},
			},
		},
	},
	dcduzhang: {
		audio: 2,
		usable: 1,
		mod: {
			maxHandcard(player, num) {
				return (num += player.countMark("dclinjie"));
			},
		},
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (get.color(event.card) !== "black") {
				return false;
			}
			return (player === event.player || event.targets.includes(player)) && event.targets.length === 1;
		},
		locked: false,
		frequent: true,
		async content(event, trigger, player) {
			player.addMark("dclinjie", 1);
			await player.draw();
		},
	},
	dcjianghuo: {
		derivation: ["dclishi"],
		skillAnimation: true,
		animationColor: "fire",
		audio: 2,
		juexingji: true,
		forced: true,
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return !game.hasPlayer(current => !current.hasAllHistory("damage", evt => evt.num));
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = game
				.filterPlayer(target => target !== player && target.hasMark("dclinjie"))
				.map(target => target.countMark("dclinjie"))
				.reduce((sum, cur) => sum + cur, 0);
			game.filterPlayer(target => target !== player).forEach(target => target.clearMark("dclinjie"));
			if (num > 0) {
				player.addMark("dclinjie", num);
			}
			await player.draw(player.countMark("dclinjie"));
			await player.gainMaxHp();
			await player.removeSkills("dclinjie");
			await player.addSkills("dclishi");
			player.markSkill("dclinjie");
		},
	},
	dclishi: {
		audio: 2,
		locked: true,
		trigger: {
			player: "phaseJieshuBegin",
		},
		async cost(event, trigger, player) {
			if (!player.hasMark("dclinjie")) {
				event.result = {
					bool: true,
					cost_data: "damage",
				};
			} else {
				const num = player.countMark("dclinjie");
				const result = await player
					.chooseButton([
						"立世：你需移除任意「凛」标记然后执行等量个选项",
						[
							[
								["fengyin", "令所有其他角色于下个准备和结束阶段期间非锁定技失效"],
								["judge", "令所有其他角色于下个判定阶段开始时在【闪电】.【乐不思蜀】和【兵粮寸断】中选择两个并依次进行判定。"],
								["discard", "令所有其他角色于下个摸牌阶段期间内摸到的牌若颜色相同，则全部弃置。"],
								["use", "令所有其他角色于下个出牌阶段每种类型的牌仅能使用一张"],
								["gain", "令所有其他角色于下个弃牌阶段期间内弃置牌后你获得之"],
							],
							"textbutton",
						],
					])
					.set("ai", button => {
						const player = get.player();
						if (button.link === "fengyin") {
							return 1.5;
						} else if (button.link === "judge") {
							return 1;
						} else if (button.link === "discard") {
							return 3;
						} else if (button.link === "use") {
							return 4;
						} else if (button.link === "gain") {
							return 8;
						}
					})
					.set("forced", true)
					.set("selectButton", [1, num])
					.forResult();
				event.result = {
					bool: result.bool,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const choices = event.cost_data;
			if (choices === "damage") {
				await player.damage("thunder");
				return;
			}
			player.removeMark("dclinjie", choices.length);
			const targets = game.filterPlayer(target => target != player);
			player.line(targets);
			if (choices.includes("fengyin")) {
				game.log(player, "选择了", "#y准备阶段、结束阶段", "的效果");
				for (const target of targets) {
					target.when({ player: "phaseJieshuBefore" }).step(async () => target.addTempSkill("fengyin", ["phaseBefore", "phaseChange", "phaseAfter"]));
					target.when({ player: "phaseZhunbeiBefore" }).step(async () => target.addTempSkill("fengyin", ["phaseBefore", "phaseChange", "phaseAfter"]));
				}
			}
			if (choices.includes("judge")) {
				game.log(player, "选择了", "#y判定阶段", "的效果");
				for (const target of targets) {
					target.when({ player: "phaseJudgeBegin" }).step(async (event, trigger, player) => {
						const result = await player
							.chooseVCardButton(["lebu", "bingliang", "shandian"], "立世：请选择两个延时锦囊并依次进行判定", 2, true)
							.set("ai", button => {
								const player = get.player();
								return get.info({ name: button.link[2] }).ai.result.target(player, player);
							})
							.forResult();
						if (result?.links.length) {
							const links = result.links;
							for (let i = 0; i < links.length; i++) {
								await target.executeDelayCardEffect(links[i][2]);
							}
						}
					});
				}
			}
			if (choices.includes("discard")) {
				game.log(player, "选择了", "#y摸牌阶段", "的效果");
				for (const target of targets) {
					target.addTempSkill("dclishi_discard", { player: "phaseDrawAfter" });
				}
			}
			if (choices.includes("use")) {
				game.log(player, "选择了", "#y出牌阶段", "的效果");
				for (const target of targets) {
					target.addTempSkill("dclishi_limit", { player: "phaseUseAfter" });
				}
			}
			if (choices.includes("gain")) {
				game.log(player, "选择了", "#y弃牌阶段", "的效果");
				for (const target of targets) {
					target.addTempSkill("dclishi_gain", { player: "phaseDiscardAfter" });
					target.markAuto("dclishi_gain", player);
				}
			}
		},
		subSkill: {
			gain: {
				trigger: {
					player: ["loseAfter"],
					global: ["loseAsyncAfter"],
				},
				charlotte: true,
				forced: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					if (event.type !== "discard") {
						return false;
					}
					const evt = event.getParent("phaseDiscard");
					const evt2 = event.getl(player);
					return evt?.name === "phaseDiscard" && evt?.player === player && evt2?.cards2?.filterInD("d");
				},
				async content(event, trigger, player) {
					const gainer = player
						.getStorage(event.name)
						.sortBySeat()
						.find(target => target.isIn());
					if (gainer) {
						await gainer.gain(trigger.getl(player).cards2.filterInD("d"), "gain2");
					}
				},
			},
			limit: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCard1" },
				silent: true,
				firstDo: true,
				filter(event, player) {
					return player.isPhaseUsing();
				},
				async content(event, trigger, player) {
					player.markAuto(event.name, get.type2(trigger.card));
				},
				mod: {
					cardEnabled(card, player) {
						const type = get.type2(card);
						if (player.getStorage("dclishi_limit").includes(type)) {
							return false;
						}
					},
					cardSavable(card, player) {
						const type = get.type2(card);
						if (player.getStorage("dclishi_limit").includes(type)) {
							return false;
						}
					},
				},
			},
			discard: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: {
					player: ["gainAfter"],
				},
				filter(event, player) {
					const evt = event.getParent("phaseDraw");
					const cards = event.getg?.(player);
					return event.getParent()?.name == "draw" && evt?.name === "phaseDraw" && evt?.player === player && cards.map(card => get.color(card)).unique().length == 1;
				},
				async content(event, trigger, player) {
					const cards = trigger.getg(player);
					await player.modedDiscard(cards);
				},
			},
		},
	},
	//神庞统
	//复活神将
	luansuo: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target.countCards("h"));
		},
		forced: true,
		logTarget(event, player) {
			return game.filterPlayer(target => target.countCards("h"));
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				target.addTempSkill("luansuo_debuff");
				target.addGaintag(target.getCards("h"), "luansuo_debuff");
			}
		},
		global: "luansuo_discard",
		subSkill: {
			discard: {
				mod: {
					cardDiscardable(card) {
						if (_status.currentPhase?.hasSkill("luansuo") && get.position(card) === "h") {
							return false;
						}
					},
					canBeDiscarded(card) {
						if (_status.currentPhase?.hasSkill("luansuo") && get.position(card) === "h") {
							return false;
						}
					},
				},
			},
			debuff: {
				mod: {
					cardname(card) {
						if (get.itemtype(card) !== "card" || get.position(card) !== "h") {
							return;
						}
						if (card.hasGaintag("luansuo_debuff")) {
							return "tiesuo";
						}
					},
					cardnature(card) {
						if (get.itemtype(card) !== "card" || get.position(card) !== "h") {
							return;
						}
						if (card.hasGaintag("luansuo_debuff")) {
							return false;
						}
					},
					aiOrder(player, card, num) {
						if (num > 0 && get.name(card, player) === "huogong") {
							return 0;
						}
					},
					aiValue(player, card, num) {
						if (num > 0 && get.name(card, player) === "huogong") {
							return 0.01;
						}
					},
					aiUseful(player, card, num) {
						if (num > 0 && get.name(card, player) === "huogong") {
							return 0;
						}
					},
				},
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "cardsDiscardAfter"] },
				filter(event, player) {
					return player.hasCard(card => {
						if (!card.hasGaintag("luansuo_debuff")) {
							return false;
						}
						return event.getd().some(cardx => get.suit(card) === get.suit(cardx));
					}, "h");
				},
				silent: true,
				firstDo: true,
				async content(event, trigger, player) {
					const cards = player.getCards("h", card => {
						if (!card.hasGaintag(event.name)) {
							return false;
						}
						return trigger.getd().some(cardx => get.suit(card) === get.suit(cardx));
					});
					player.removeGaintag(event.name, cards);
				},
			},
		},
	},
	fengliao: {
		audio: 2,
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			get.info(skill).init(player, skill);
		},
		init(player, skill) {
			player.addTip(skill, `${get.translation(skill)} ${player.storage[skill] ? "伤害" : "摸牌"}`);
		},
		onremove(player, skill) {
			player.removeTip(skill);
		},
		mark: true,
		marktext: "☯",
		intro: { content: storage => `你使用牌指定唯一目标后，你${storage ? "对其造成1点火焰伤害" : "令其摸一张牌"}` },
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.targets.length == 1;
		},
		forced: true,
		logTarget: "target",
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			const { target } = trigger;
			if (player.storage[event.name]) {
				await target.draw();
			} else {
				await target.damage("fire");
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && num > 0) {
					const select = get.info(card).selectTarget;
					let range;
					if (select == undefined) {
						range = [1, 1];
					} else if (typeof select == "number") {
						range = [select, select];
					} else if (get.itemtype(select) == "select") {
						range = select;
					} else if (typeof select == "function") {
						range = select(card, player);
						if (typeof range == "number") {
							range = [range, range];
						}
					}
					game.checkMod(card, player, range, "selectTarget", player);
					if (
						(() => {
							if (
								!(() => {
									if (range[1] !== -1) {
										return range[1] <= 1;
									}
									return game.countPlayer(i => player.canUse(card, i)) === 1;
								})()
							) {
								return false;
							}
							let targets = game.filterPlayer(i => player.canUse(card, i));
							if (!targets.length) {
								return false;
							}
							_status._fengliao_check = true;
							targets.sort((a, b) => get.effect(b, card, player, player) - get.effect(a, card, player, player));
							delete _status._fengliao_check;
							return (player.storage.fengliao ? get.damageEffect(targets[0], player, player, "fire") : get.effect(targets[0], { name: "draw" }, player, player)) > 0;
						})()
					) {
						return num + 15;
					}
				}
			},
		},
		ai: {
			fireAttack: true,
			effect: {
				player(card, player, target) {
					if (_status._fengliao_check) {
						return;
					}
					if (typeof card !== "object" || !player || !target) {
						return;
					}
					const select = get.info(card).selectTarget;
					let range;
					if (select == undefined) {
						range = [1, 1];
					} else if (typeof select == "number") {
						range = [select, select];
					} else if (get.itemtype(select) == "select") {
						range = select;
					} else if (typeof select == "function") {
						range = select(card, player);
						if (typeof range == "number") {
							range = [range, range];
						}
					}
					game.checkMod(card, player, range, "selectTarget", player);
					if (
						(() => {
							if (range[1] !== -1) {
								return !ui.selected.targets.length;
							}
							return !game.hasPlayer(i => i !== target && player.canUse(card, i));
						})()
					) {
						return [
							1,
							(() => {
								_status._fengliao_check = true;
								const num = player.storage.fengliao ? get.damageEffect(target, player, player, "fire") : get.effect(target, { name: "draw" }, player, player);
								delete _status._fengliao_check;
								return num;
							})(),
						];
					}
				},
			},
		},
	},
	kunyu: {
		audio: 2,
		trigger: { player: "dieBegin" },
		filter(event, player) {
			if (!(event.getParent().name !== "giveup" && player.maxHp > 0)) {
				return false;
			}
			return get.cardPile2(c => get.tag(c, "fireDamage"));
		},
		forced: true,
		async content(event, trigger, player) {
			const card = get.cardPile2(c => get.tag(c, "fireDamage"));
			if (!card) {
				return;
			}
			await game.cardsGotoSpecial(card);
			game.log(player, "将", card, "移出游戏");
			await player.recoverTo(1);
			if (player.getHp() > 0) {
				trigger.cancel();
			}
		},
		group: "kunyu_debuff",
		subSkill: {
			debuff: {
				audio: "kunyu",
				trigger: {
					global: "phaseBefore",
					player: ["gainMaxHpBegin", "loseMaxHpBegin", "enterGame"],
				},
				forced: true,
				filter(event, player) {
					let bool = player.maxHp !== 1;
					if (event.name === "phase") {
						return bool && game.phaseNumber === 0;
					}
					return true;
				},
				async content(event, trigger, player) {
					if (["gainMaxHp", "loseMaxHp"].includes(trigger.name)) {
						trigger.cancel();
					} else {
						player.maxHp = 1;
						player.update();
					}
				},
			},
		},
	},
	//神黄忠
	//丁真神将，赤矢神将，爆头神将，吃人神将
	dclieqiong: {
		audio: 2,
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.player.isIn() && event.source != event.player;
		},
		frequent: true,
		logTarget: "player",
		prompt2: (event, player) => "击伤其一个部位",
		async cost(event, trigger, player) {
			const target = trigger.player;
			let places = lib.skill["dclieqiong"].derivation.slice();
			if (target.hasSex("male")) {
				places.push("dclieqiong_place8");
			}
			places = places.filter(i => {
				let storage = target.getStorage("dclieqiong_injury");
				if (!storage.length && i == "dclieqiong_place1") {
					return false;
				}
				return true;
			});
			if (!places.length) {
				return;
			}
			//射击部位-by 鸽子
			await Promise.all(event.next);
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			const switchToAuto = function () {
				_status.imchoosing = false;
				if (event.dialog) {
					event.dialog.close();
				}
				if (event.control) {
					event.control.close();
				}
				game.resume();
				return Promise.resolve({
					bool: true,
					hurt: places.randomGet(),
				});
			};
			const chooseButton = (places, target) => {
				const { promise, resolve } = Promise.withResolvers();
				const event = _status.event;
				event.switchToAuto = function () {
					_status.imchoosing = false;
					resolve({
						bool: true,
						hurt: places.randomGet(),
					});
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control) {
						event.control.close();
					}
					if (event.control2) {
						event.control2.close();
					}
				};
				event.control = ui.create.control("cancel2", function (link) {
					event.dialog.close();
					event.control.close();
					if (event.control2) {
						event.control2.close();
					}
					game.resume();
					_status.imchoosing = false;
					event._result = { bool: false };
					resolve(event._result);
				});
				event.control2 = ui.create.control("ok", function (link) {
					event.dialog.close();
					event.control.close();
					event.control2.close();
					game.resume();
					_status.imchoosing = false;
					resolve(event._result);
				});
				event.control2.close();
				const dialog = ui.create.dialog("forcebutton", "hidden");
				event.dialog = dialog;
				//白底大图不加textPrompt了
				dialog.textPrompt = dialog.add('<div class="text center">裂穹：是否击伤' + get.translation(target) + "的一个部位？</div>");
				dialog.style.display = "flex";
				dialog.style.justifyContent = "center";
				dialog.style.alignItems = "center";
				dialog.style.position = "relative";
				dialog.style.width = "100%";
				dialog.style.height = "100%";
				dialog.id = "dclieqiong";
				dialog.classList.add("fixed");
				dialog.classList.add("scroll1");
				dialog.classList.add("scroll2");
				dialog.classList.add("center");
				dialog.classList.add("scroll3");
				dialog.classList.add("fullwidth");
				dialog.classList.add("fullheight");
				const target_img = document.createElement("div");
				const position = lib.skill["dclieqiong"].derivation.slice();
				if (target.hasSex("male")) {
					position.push("dclieqiong_place8");
				}
				target_img.style.width = "50%";
				target_img.style.height = "100%";
				target_img.style.position = "relative";
				target_img.style.overflow = "visible";
				target_img.style.boxSizing = "border-box";
				target_img.style.border = "1px solid black";
				target_img.style.backgroundColor = "rgb(255,178,102,0.5)";
				dialog.appendChild(target_img);
				target_img.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_" + (target.hasSex("male") ? "male" : "female") + ".png)";
				target_img.style.backgroundSize = "cover";
				target_img.style.backgroundRepeat = "no-repeat";
				target_img.style.backgroundSize = "contain";
				target_img.style.backgroundRepeat = "no-repeat";
				target_img.style.backgroundPosition = "center center";
				const number = target.hasSex("male")
					? [
							["7", "1"],
							//["5", "3"],
							//["4", "7"],
							["9", "5"],
							["9", "13"],
							["7", "3"],
							["7", "6"],
							["7", "8"],
						]
					: [
							["7", "1"],
							//["8", "3"],
							//["4", "7"],
							["9", "5"],
							["9", "13"],
							["6", "3"],
							["6", "6"],
						];
				let list = [];
				for (let i = 0; i < position.length; i++) {
					const num_px = document.createElement("div");
					num_px.classList.add("nodeintro");
					num_px.nodeTitle = get.translation(position[i]);
					num_px.nodeContent = get.skillInfoTranslation(position[i], null, false);
					num_px.style.width = "15%";
					num_px.style.height = "15%";
					num_px.id = position[i];
					num_px.style.position = "absolute";
					num_px.style.left = `${number[i][0] * 6}%`;
					num_px.style.top = `${number[i][1] * 6}%`;
					num_px.style.boxSizing = "border-box";
					num_px.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_click.png)";
					num_px.style.backgroundSize = "cover";
					num_px.style.backgroundRepeat = "no-repeat";
					num_px.style.backgroundSize = "contain";
					num_px.style.backgroundRepeat = "no-repeat";
					num_px.style.backgroundPosition = "center center";
					num_px.addEventListener(lib.config.touchscreen ? "touchend" : "click", a => {
						let hurt = event._result?.position;
						event._result = {
							bool: true,
							hurt: a.target.id,
							position: a.target,
						};
						let bool = true;
						if (hurt) {
							hurt.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_click.png)";
							if (hurt == a.target) {
								event._result = { bool: false };
								if (event.control2) {
									event.control2.close();
								}
								if (event.control) {
									event.control.open();
								}
								bool = false;
							}
						}
						if (bool) {
							a.target.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_click_chosen.png)";
							if (event.control) {
								event.control.close();
							}
							if (!lib.config.autoskilllist.includes("dclieqiong")) {
								event.dialog.close();
								game.resume();
								_status.imchoosing = false;
								resolve(event._result);
							} else if (event.control2) {
								event.control2.open();
							}
						}
					});
					if (!lib.config.touchscreen) {
						if (lib.config.hover_all) {
							lib.setHover(num_px, ui.click.hoverplayer);
						}
						if (lib.config.right_info) {
							num_px.oncontextmenu = ui.click.rightplayer;
						}
					}
					list.push(num_px);
				}
				const selectedList = list.filter(i => places.includes(i.id));
				for (const i of selectedList) {
					target_img.appendChild(i);
				}
				dialog.open();
				game.pause();
				game.countChoose();
				return promise;
			};
			let next;
			if (event.isMine()) {
				next = chooseButton(places, target);
			} else if (event.isOnline()) {
				const { promise, resolve } = Promise.withResolvers();
				event.player.send(chooseButton, places, target);
				event.player.wait(async result => {
					if (result == "ai") {
						result = await switchToAuto();
					}
					resolve(result);
				});
				game.pause();
				next = promise;
			} else {
				next = switchToAuto();
			}
			const result = await next;
			if (event.control2) {
				event.control2.close();
			}
			game.resume();
			event.result = {
				bool: result.bool,
				targets: [target],
				cost_data: result.hurt,
			};
			event.result.targets = [target];
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const place = event.cost_data;
			player.popup(place, "fire");
			game.log(player, "击伤了", target, "的", "#y" + get.translation(place));
			target.addTempSkill("dclieqiong_injury");
			target.markAuto("dclieqiong_injury", [place]);
			switch (parseInt(place.slice("dclieqiong_place".length))) {
				case 1:
					if (target.getHp() > 0) {
						await target.loseHp(target.getHp());
						if (
							game.getGlobalHistory("everything", evt => {
								if (evt.name != "die" || evt.player != target) {
									return false;
								}
								return evt.reason?.getParent() == event;
							}).length > 0
						) {
							await player.gainMaxHp();
						}
					}
					break;
				case 2: {
					const cards = target.getEquips(1).slice().concat(target.getEquips("equip3_4"));
					if (cards.length) {
						await target.modedDiscard(cards, player);
					}
					break;
				}
				case 3:
					target.addTempSkill("dclieqiong_maxhand", { player: "phaseEnd" });
					break;
				case 4: {
					const cardx = target.getDiscardableCards(target, "h");
					const num = Math.ceil(cardx.length / 2);
					if (cardx.length) {
						await target.discard(cardx.randomGets(num));
					}
					break;
				}
				case 5:
					target.addTempSkill("dclieqiong_damage", { player: "phaseEnd" });
					break;
				case 6:
					target.addTempSkill("dclieqiong_use", { player: "phaseEnd" });
					break;
				case 7:
					target.addTempSkill("dclieqiong_respond", { player: "phaseEnd" });
					break;
				case 8: {
					game.broadcastAll(
						(player, sex) => {
							player.sex = sex;
						},
						target,
						"female"
					);
					game.log(target, "将性别变为了", "#y女性");
					const nvzhuang = get.cardPile("nvzhuang") || game.createCard("nvzhuang", "diamond", 6);
					await game.delayx();
					if (target.canEquip(nvzhuang, true)) {
						await target.equip(nvzhuang);
					}
					await target.gainMaxHp();
					break;
				}
			}
		},
		marktext: "赤",
		intro: { content: "mark" },
		// frequent: true,
		derivation: ["dclieqiong_place1", "dclieqiong_place4", "dclieqiong_place5", "dclieqiong_place6", "dclieqiong_place7"],
		subSkill: {
			injury: {
				charlotte: true,
				onremove: true,
			},
			maxhand: {
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 手部",
					content: "手牌上限变为原来的一半（向下取整）",
				},
				mod: {
					maxHandcard(player, num) {
						if (_status["dclieqiong_maxhand"]) {
							return;
						}
						_status["dclieqiong_maxhand"] = true;
						const numx = player.getHandcardLimit();
						delete _status["dclieqiong_maxhand"];
						return num - Math.ceil(numx);
					},
				},
			},
			damage: {
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 地机",
					content: "下次受到的伤害+1",
				},
				trigger: { player: "damageBegin2" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill(event.name);
				},
			},
			use: {
				charlotte: true,
				forced: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 中枢",
					content: (_, player) => (_status.currentPhase === player ? "" : "下回合") + "使用的下一张牌无效",
				},
				trigger: {
					player: "useCard",
				},
				async content(event, trigger, player) {
					trigger.all_excluded = true;
					trigger.targets.length = 0;
					player.removeSkill("dclieqiong_use");
				},
			},
			respond: {
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 气海",
					content: (_, player) => "不能使用或打出红桃牌",
				},
				mod: {
					cardEnabled(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
					cardSavable(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
					cardRespondable(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
				},
			},
		},
	},
	new_dclieqiong: {
		audio: "dclieqiong",
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.player.isIn() && event.source != event.player;
		},
		derivation: ["dclieqiong_place1", "dclieqiong_place4", "dclieqiong_place5", "dclieqiong_place6", "dclieqiong_place7"],
		positions: {
			head: {
				name: "天冲",
				info: "令其失去所有体力，若其因此死亡，你增加1点体力上限",
				css_male: {
					left: "50%",
					top: "14%",
				},
				css_female: {
					left: "45%",
					top: "10%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y天冲");
					if (target.getHp() > 0) {
						await target.loseHp(target.getHp());
						if (
							game.getGlobalHistory("everything", evt => {
								if (evt.name != "die" || evt.player != target) {
									return false;
								}
								return evt.reason?.getParent() == event;
							}).length > 0
						) {
							await player.gainMaxHp();
						}
					}
				},
			},
			hand: {
				name: "力烽",
				info: "令其随机弃置一半手牌（向上取整）",
				css_male: {
					left: "28%",
					top: "40%",
				},
				css_female: {
					left: "72%",
					top: "40%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y力烽");
					const cardx = target.getDiscardableCards(target, "h");
					const num = Math.ceil(cardx.length / 2);
					if (cardx.length) {
						await target.discard(cardx.randomGets(num));
					}
				},
			},
			leg: {
				name: "地机",
				info: "令其下一次受到的伤害+1直到其下个回合结束",
				css_male: {
					left: "35%",
					top: "80%",
				},
				css_female: {
					left: "67%",
					top: "80%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y地机");
					target.addTip("new_dclieqiong_leg", "裂穹 地机");
					target
						.when({
							player: ["damageBegin3", "phaseEnd"],
						})
						.step(async (event, trigger, player) => {
							player.removeTip("new_dclieqiong_leg");
							if (trigger.name == "damage") {
								trigger.num++;
							}
						});
				},
			},
			chest: {
				name: "中枢",
				info: "令其使用的下一张牌无效直到其回合结束",
				css_male: {
					left: "50%",
					top: "30%",
				},
				css_female: {
					left: "40%",
					top: "25%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y中枢");
					target.addTip("new_dclieqiong_chest", "裂穹 中枢");
					target
						.when({
							player: ["useCard", "phaseEnd"],
						})
						.step(async (event, trigger, player) => {
							player.removeTip("new_dclieqiong_chest");
							if (trigger.name == "useCard") {
								trigger.targets.length = 0;
								trigger.all_excluded = true;
							}
						});
				},
			},
			abdomen: {
				name: "气海",
				info: "令其不能使用或打出♥️牌直到其回合结束",
				css_male: {
					left: "50%",
					top: "42%",
				},
				css_female: {
					left: "40%",
					top: "35%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y气海");
					target.addTempSkill("new_dclieqiong_abdomen", { player: "phaseEnd" });
				},
			},
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			let list = Object.keys(lib.skill[event.skill].positions);
			if (
				!player.hasHistory("useSkill", evt => {
					return evt.skill == event.skill && evt.targets?.includes(target);
				})
			) {
				list.remove("head");
			}
			if (!list.length) {
				event.result = { bool: false };
				return;
			}
			const result = await player
				.chooseButton([
					[
						dialog => {
							dialog.forcebutton = true;
							dialog.classList.add("forcebutton");
							dialog.listen(() => {
								let allpos = dialog.querySelectorAll(".position");
								allpos.forEach(pos => pos.classList.remove("selected_cp"));
							});
							dialog.classList.add("dclieqiong", "fixed", "fullheight");
							const { target, list } = get.event();
							dialog.style.backgroundImage = `url(${lib.assetURL}image/card/yiwu_${target.hasSex("male") ? "male" : "female"}.png)`;
							const title = ui.create.div(".title", dialog);
							title.innerHTML = `裂穹：是否击伤${get.translation(target)}的一个部位？`;
							//添加部位
							for (let pos of list) {
								let position = lib.skill.new_dclieqiong.positions[pos];
								let div = ui.create.div(".position", dialog, e => {
									e.stopPropagation();
									let allPosDiv = Array.from(dialog.querySelectorAll(".position"));
									allPosDiv.forEach(p => p.classList.remove("selected_cp"));
									div.classList.add("selected_cp");
									ui.selected.buttons = [div];
									ui.create.confirm("oc");
								});
								div.link = pos;
								let sex = target.hasSex("male") ? "male" : "female";
								div.css(position[`css_${sex}`] || {});
								div.setNodeIntro(position.name, position.info);
								div.style.setProperty("--info", `"【${position.name}】:${position.info}"`);
							}
						},
						"handle",
					],
				])
				.set("target", target)
				.set("list", list)
				.set("processAI", () => {
					const { player, target, list } = get.event();
					if (get.attitude(player, target) > 0) {
						return { bool: false };
					} else {
						return {
							bool: true,
							links: list.includes("head") ? ["head"] : ["abdomen"],
						};
					}
				})
				.set("switchToAuto", () => {
					_status.event.result = "ai";
					_status.event.dialog?.close();
					ui.confirm?.close();
				})
				.forResult();
			event.result = {
				bool: result.bool,
				targets: [target],
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: [position],
			} = event;
			game.broadcastAll(function (position) {
				if (lib.config.background_speak) {
					game.playAudio("skill", "dclieqiong_" + position);
				}
			}, position);
			const positionObj = lib.skill[event.name].positions[position];
			let next = game.createEvent(event.name + "_effect", false);
			next.setContent(positionObj.content);
			next.set("target", target);
			next.set("player", player);
			next.set("position", positionObj);
			await next;
		},
		subSkill: {
			abdomen: {
				init(player, skill) {
					player.addTip(skill, "裂穹 气海");
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 气海",
					content: (_, player) => "不能使用或打出红桃牌",
				},
				mod: {
					cardEnabled(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
					cardSavable(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
					cardRespondable(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
				},
			},
		},
	},
	dczhanjue: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		async cost(event, trigger, player) {
			const hps = [player.getHp(), player.getDamagedHp()];
			let list = [(hps[0] > 0 ? "摸" + get.cnNumber(hps[0]) + "张牌，" : "") + "此阶段使用的下一张【杀】无距离限制且不能被响应。", (hps[1] > 0 ? "摸" + get.cnNumber(hps[1]) + "张牌，" : "") + "此阶段下一次造成伤害后，回复等量体力。"];
			let result = await player
				.chooseControlList(list)
				.set("ai", function () {
					let player = get.event().player,
						damaged = player.getDamagedHp();
					if (damaged) {
						damaged +=
							0.6 *
							(player.countCards("hs", card => {
								if (card.name == "sha" || !get.tag(card, "damage")) {
									return 0;
								}
								let info = get.info(card);
								if (!info || info.type != "trick") {
									return false;
								}
								if (info.notarget) {
									return false;
								}
								if (info.selectTarget != undefined) {
									if (Array.isArray(info.selectTarget)) {
										if (info.selectTarget[1] == -2) {
											return 1;
										}
										if (info.selectTarget[1] == -1) {
											let func = info.filterTarget;
											if (typeof func != "function") {
												func = () => true;
											}
											return game.countPlayer(cur => {
												return func(card, player, cur);
											});
										}
										return Math.max(1, info.selectTarget[0], info.selectTarget[1]);
									} else {
										if (info.selectTarget == -2) {
											return 1;
										}
										if (info.selectTarget == -1) {
											let func = info.filterTarget;
											if (typeof func != "function") {
												func = () => true;
											}
											return game.countPlayer(cur => {
												return func(card, player, cur);
											});
										}
										return Math.max(1, info.selectTarget);
									}
								}
								return 1;
							}) +
								Math.max(player.getCardUsable("sha"), player.countCards("hs", "sha")));
					}
					if (damaged > player.hp) {
						return "选项二";
					}
					return "选项一";
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			if (event.cost_data == "选项一") {
				player.draw(player.getHp());
				player.addTempSkill("dczhanjue_directHit", { player: "phaseUseEnd" });
			} else {
				player.draw(player.getDamagedHp());
				player.addTempSkill("dczhanjue_recover", { player: "phaseUseEnd" });
			}
		},
		subSkill: {
			directHit: {
				audio: "dczhanjue",
				charlotte: true,
				forced: true,
				mod: {
					targetInRange(card) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
					player.removeSkill(event.name);
				},
			},
			recover: {
				audio: "dczhanjue",
				trigger: {
					source: "damageSource",
				},
				forced: true,
				charlotte: true,
				content: async function (event, trigger, player) {
					if (player.isDamaged()) {
						player.recover(trigger.num);
					}
					player.removeSkill(event.name);
				},
			},
		},
	},
	//应天司马懿！别肘
	jilin: {
		audio: 5,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		locked: false,
		logAudio: () => 1,
		async content(event, trigger, player) {
			const cards = get.cards(2);
			const next = player.addToExpansion(cards, "draw");
			next.gaintag.add(event.name);
			await next;
		},
		marktext: "志",
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				const cards = player.getExpansions("jilin"),
					mingzhi = cards.filter(card => card.storage.jilin),
					hidden = cards.removeArray(mingzhi);
				if (mingzhi.length) {
					dialog.addText("已明之志");
					dialog.addSmall(mingzhi);
				}
				if (hidden.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addText("未明之志");
						dialog.addSmall(hidden);
					} else {
						return "共有" + get.cnNumber(hidden.length) + "张暗“志”";
					}
				}
			},
			/*
			???
			content(content, player) {
				const cards = player.getExpansions("jilin"),
					mingzhi = cards.filter(card => card.storage.jilin),
					hidden = cards.removeArray(mingzhi);
				if (mingzhi.length) {
					dialog.addText("已明之志");
					dialog.addSmall(mingzhi);
				}
				if (hidden.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addText("未明之志");
						dialog.addSmall(hidden);
					} else {
						return "共有" + get.cnNumber(hidden.length) + "张暗“志”";
					}
				}
			},
			*/
		},
		group: ["jilin_kanpo", "jilin_change"],
		subSkill: {
			kanpo: {
				audio: ["jilin2.mp3", "jilin3.mp3"],
				trigger: {
					target: "useCardToTarget",
				},
				filter(event, player) {
					return event.player != player && player.getExpansions("jilin").some(card => !card.storage.jilin);
				},
				async cost(event, trigger, player) {
					const hidden = player.getExpansions("jilin").filter(card => !card.storage.jilin);
					const goon = get.effect(player, trigger.card, trigger.player, player) < 0;
					const suits = player
						.getExpansions("jilin")
						.filter(card => card.storage.jilin)
						.map(card => get.suit(card))
						.toUniqued();
					if (hidden.length == 1) {
						const { bool } = await player
							.chooseBool("戢鳞：明置一张“志”", `令${get.translation(trigger.card)}对你无效`)
							.set("choice", goon)
							.forResult();
						event.result = {
							bool: bool,
							cost_data: hidden,
						};
					} else {
						const { bool, links } = await player
							.chooseButton(["戢鳞：明置一张“志”", hidden])
							.set("ai", button => {
								const player = get.player(),
									card = button.link,
									suits = get.event().suits;
								if (!get.event().goon) {
									return 0;
								}
								if (!suits.includes(get.suit(card))) {
									return 10;
								}
								return 6 - get.value(card);
							})
							.set("suits", suits)
							.set("goon", goon)
							.forResult();
						event.result = {
							bool: bool,
							cost_data: links,
						};
					}
				},
				async content(event, trigger, player) {
					await player.showCards(event.cost_data, get.translation(player) + "发动了【戢鳞】");
					event.cost_data[0].storage.jilin = true;
					trigger.getParent().excluded.add(player);
				},
			},
			change: {
				audio: ["jilin4.mp3", "jilin5.mp3"],
				trigger: {
					player: "phaseBegin",
				},
				filter(event, player) {
					return player.countCards("h") && player.getExpansions("jilin").some(card => !card.storage.jilin);
				},
				async cost(event, trigger, player) {
					const hidden = player.getExpansions("jilin").filter(card => !card.storage.jilin);
					const next = player.chooseToMove("戢鳞：是否交换“志”和手牌？");
					next.set("list", [
						[get.translation(player) + "（你）的未明之“志”", hidden],
						["手牌区", player.getCards("h")],
					]);
					next.set("filterMove", (from, to) => {
						return typeof to != "number";
					});
					next.set("processAI", list => {
						let player = get.player(),
							cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
								return get.useful(a) - get.useful(b);
							}),
							cards2 = cards.splice(0, player.getExpansions("jilin").length);
						return [cards2, cards];
					});
					const { bool, moved } = await next.forResult();
					event.result = {
						bool: bool,
						cost_data: moved,
					};
				},
				async content(event, trigger, player) {
					const moved = event.cost_data;
					const pushs = moved[0],
						gains = moved[1];
					pushs.removeArray(player.getExpansions("jilin"));
					gains.removeArray(player.getCards("h"));
					if (!pushs.length || pushs.length != gains.length) {
						return;
					}
					const next = player.addToExpansion(pushs);
					next.gaintag.add("jilin");
					await next;
					await player.gain(gains, "draw");
				},
			},
		},
	},
	yingyou: {
		audio: 4,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countCards("h") && player.getExpansions("jilin").some(card => !card.storage.jilin);
		},
		async cost(event, trigger, player) {
			const hidden = player.getExpansions("jilin").filter(card => !card.storage.jilin);
			const suits = player
				.getExpansions("jilin")
				.filter(card => card.storage.jilin)
				.map(card => get.suit(card))
				.toUniqued();
			const { bool, links } = await player
				.chooseButton(["英猷：你可以明志", hidden])
				.set("ai", button => {
					const player = get.player(),
						card = button.link,
						suits = get.event().suits;
					const getNum = player => {
						var list = [];
						for (var i of lib.suit) {
							list.push(player.countCards("h", { suit: i }) + 3);
						}
						return list.sort((a, b) => b - a)[0];
					};
					if (!suits.includes(get.suit(card))) {
						return 10;
					}
					if (get.suit(card) == getNum(player)) {
						return 5;
					}
					return 0;
				})
				.set("suits", suits)
				.forResult();
			event.result = {
				bool: bool,
				cost_data: links,
			};
		},
		logAudio: () => 2,
		async content(event, trigger, player) {
			await player.showCards(event.cost_data, get.translation(player) + "发动了【英猷】");
			event.cost_data[0].storage.jilin = true;
			const num = player.getExpansions("jilin").filter(card => card.storage.jilin).length;
			await player.draw(num);
		},
		ai: {
			combo: "jilin",
		},
		group: "yingyou_draw",
		subSkill: {
			draw: {
				audio: ["yingyou3.mp3", "yingyou4.mp3"],
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					const suits = player
						.getExpansions("jilin")
						.filter(card => card.storage.jilin)
						.map(card => get.suit(card))
						.toUniqued();
					const evt = event.getl(player);
					if (!evt || !evt.cards2 || !evt.cards2.length) {
						return false;
					}
					return evt.cards2.some(card => {
						return suits.includes(get.suit(card, player));
					});
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const suits = player
						.getExpansions("jilin")
						.filter(card => card.storage.jilin)
						.map(card => get.suit(card))
						.toUniqued();
					const num = trigger.getl(player).cards2.filter(card => {
						return suits.includes(get.suit(card, player));
					}).length;
					await player.draw(num);
				},
			},
		},
	},
	yingtian: {
		audio: 2,
		trigger: { global: "dieAfter" },
		filter(event, player) {
			return game.countGroup() < 3;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		async content(event, trigger, player) {
			const skill = event.name;
			player.awakenSkill(skill);
			await player.changeSkills(get.info(skill).derivation, ["yingyou"]);
			player.addSkill(skill + "_effect");
		},
		derivation: ["reguicai", "rewansha", "lianpo"],
		subSkill: {
			effect: {
				mod: {
					targetInRange: () => true,
				},
			},
		},
	},
	//手杀神司马？
	//极略神司马！
	xinrenjie: {
		audio: 2,
		trigger: {
			player: ["chooseToUseAfter", "chooseToRespondAfter"],
			global: "_wuxieAfter",
		},
		filter(event, player) {
			if (player.countMark("xinrenjie_used") >= 4) {
				return false;
			}
			if (event.name == "chooseToUse" && event.type == "wuxie") {
				return false;
			}
			if (event.name == "_wuxie") {
				if (event._trigger?.getParent()?.directHit?.includes(player)) {
					return false;
				}
				if (event.wuxieresult && event.wuxieresult == player) {
					return false;
				}
				if (event._info_map.player == player) {
					return false;
				}
				return true;
			}
			return event.respondTo && event.respondTo[0] !== player && !event.result.bool;
		},
		forced: true,
		async content(event, trigger, player) {
			player.addMark("xinrenjie", 1);
			player.addTempSkill("xinrenjie_used", "roundStart");
			player.addMark("xinrenjie_used", 1, false);
		},
		intro: {
			name2: "忍",
			content: "mark",
		},
		marktext: "忍",
		hiddenCard: player => player.countMark("xinrenjie_used") < 4,
		ai: {
			combo: "xinjilve",
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (player.countMark("xinrenjie_used") >= 4) {
					return false;
				}
			},
		},
		group: "xinrenjie_change",
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			change: {
				audio: "xinrenjie",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					if (event.name === "phase" && game.phaseNumber > 0) {
						return false;
					}
					if (!lib.group.some(group => group !== "shen")) {
						return false;
					}
					return player.group === "shen" && player._groupChosen !== "kami";
				},
				async cost(event, trigger, player) {
					const groups = lib.group.filter(group => group !== "shen");
					const result = (event.result = await player
						.chooseControl(groups, "cancel2")
						.set("ai", () => {
							const groups = get.event().controls.filter(group => !["wei", "shu", "wu", "qun"].includes(group));
							return groups.length ? groups.randomGet() : "cancel2";
						})
						.set("prompt", get.translation("xinrenjie") + "：是否变更势力？")
						.forResult());
					event.result.bool = typeof result.control === "string" && result.control !== "cancel2";
					event.result.cost_data = result.control;
				},
				async content(event, trigger, player) {
					await player.changeGroup(event.cost_data);
				},
			},
		},
	},
	xinbaiyin: {
		audio: 2,
		inherit: "sbaiyin",
		filter(event, player) {
			return player.countMark("xinrenjie") >= 4;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.addSkills("xinjilve");
		},
		derivation: ["xinjilve", "reguicai", "fangzhu", "rejizhi", "rezhiheng", "rewansha"],
		ai: { combo: "xinrenjie" },
	},
	xinlianpo: {
		audio: "lianpo",
		audioname: ["new_simayi"],
		trigger: { source: "dieAfter" },
		filter(event, player) {
			return !player.hasSkill("xinlianpo_mark") || get.info("xinbaiyin").derivation.some(skill => !["xinjilve", "reguicai"].includes(skill) && !player.hasSkill(skill, null, null, false));
		},
		async cost(event, trigger, player) {
			const skills = get
				.info("xinbaiyin")
				.derivation.removeArray(["xinjilve", "reguicai"])
				.filter(skill => !player.hasSkill(skill, null, null, false));
			if (skills.length && player.hasSkill("xinjilve", null, null, false)) {
				const next = player.chooseButton(["连破：请选择一项", [skills.map(i => [i, `获得【${get.translation(i)}】`]).concat(["于此回合结束后获得一个额外回合"]), "textbutton"]]);
				next.set("ai", button => {
					const link = button.link,
						skills = get.event().skills,
						player = get.player();
					if ((skills.length <= 2 || game.countPlayer() <= 2) && !player.hasSkill("xinlianpo_mark", null, null, false) && link == "于此回合结束后获得一个额外回合") {
						return 6;
					}
					if (link == "rezhiheng" && player.countCards("h") > 0) {
						return 5;
					}
					if (link == "rejizhi" && (!skills.includes("rezhiheng") || player.countCards("hs", { type: "trick" }))) {
						return 3;
					}
					if (link == "rewansha" && game.hasPlayer(current => get.attitude(player, current) < 0 && current.getHp() < 2 && (player == _status.currentPhase || player.hasSkill("xinlianpo_mark", null, null, false)))) {
						return 2;
					}
					return 1;
				});
				next.set("skills", skills);
				next.set("filterButton", button => {
					return lib.skill[button.link] || !get.player().hasSkill("xinlianpo_mark");
				});
				const { bool, links } = await next.forResult();
				event.result = {
					bool: bool,
					cost_data: links,
				};
			} else {
				const { bool } = await player.chooseBool("连破：于此回合结束后获得一个额外回合？").forResult();
				event.result = {
					bool: bool,
				};
			}
		},
		async content(event, trigger, player) {
			const links = event.cost_data;
			if (links && get.info("xinbaiyin").derivation.includes(links[0])) {
				await player.addSkills(links[0]);
			} else {
				player.addTempSkill("xinlianpo_mark");
				player.insertPhase();
			}
		},
		subSkill: {
			mark: {
				charlotte: true,
				mark: true,
				intro: {
					content: "本回合结束后执行一个额外回合",
				},
			},
		},
	},
	xinjilve: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countMark("xinrenjie");
		},
		async cost(event, trigger, player) {
			const limit = Math.min(3, player.countMark("xinrenjie"));
			const choices = Array.from({
				length: limit,
			}).map((_, i) => [i, get.cnNumber(i + 1, true)]);
			const history = game.getAllGlobalHistory("everything", evt => evt.name == "xinjilve" && evt.player == player && Array.isArray(evt.cost_data) && get.info("xinbaiyin").derivation.includes(evt.cost_data[0]));
			const num = Math.max(2, history.length + 1);
			const skills = get
				.info("xinbaiyin")
				.derivation.removeArray(["xinjilve", "reguicai"])
				.filter(skill => !player.hasSkill(skill, null, null, false));
			if (skills.length && limit >= num) {
				const next = player.chooseButton(2, ["极略：请选择你要移去的“忍”标记数和相应操作", '<div class="text center">移去“忍”标记数</div>', [choices, "tdnodes"], '<div class="text center">执行的操作</div>', [skills.map(i => [i, `获得【${get.translation(i)}】`]).concat(["摸牌"]), "tdnodes"]]);
				next.set("filterButton", button => {
					const link = button.link;
					if (Boolean(ui.selected.buttons.length) !== (typeof link == "number")) {
						return false;
					}
					if (ui.selected.buttons.length) {
						if (ui.selected.buttons[0].link == "摸牌") {
							return link <= 1;
						}
						return link == get.event().num - 1;
					}
					return true;
				});
				next.set("ai", button => {
					const link = button.link,
						num = get.event().num,
						skills = get.event().skills;
					if (!ui.selected.buttons.length) {
						if (num > 2 && link == "摸牌") {
							return 10;
						}
						if (link == "rezhiheng" && player.countCards("h") > 0) {
							return 10;
						}
						if (link == "rejizhi" && (!skills.includes("rezhiheng") || player.countCards("hs", { type: "trick" }))) {
							return 8;
						}
						if (player.countMark("xinrenjie") <= 2) {
							return 0;
						}
					}
					return ui.selected.buttons.length && ui.selected.buttons[0].link == "摸牌" ? num - 1 : 1;
				});
				next.set("num", num);
				next.set("skills", skills);
				const { bool, links } = await next.forResult();
				event.result = {
					bool: bool,
					cost_data: links,
				};
			} else {
				const draw = Array.from({
					length: Math.min(2, limit),
				}).map((_, i) => get.cnNumber(i + 1, true));
				const result = await player
					.chooseControl(draw, "cancel2")
					.set("prompt", get.prompt("xinrenjie"))
					.set("prompt2", `你可以移去至多${get.cnNumber(draw.length)}枚“忍”标记并摸等量张牌`)
					.set("ai", () => {
						return get.event().choice;
					})
					.set(
						"choice",
						(function () {
							if (!player.hasSkill("rejizhi", null, null, false)) {
								return "cancel2";
							}
							return choices.length - 1;
						})()
					)
					.forResult();
				event.result = {
					bool: result.control != "cancel2",
					cost_data: result.index,
				};
			}
		},
		async content(event, trigger, player) {
			const choice = event.cost_data;
			if (typeof choice == "number") {
				player.removeMark("xinrenjie", choice + 1);
				await player.draw(choice + 1);
			} else if (get.info("xinbaiyin").derivation.includes(choice[0])) {
				const history = game.getAllGlobalHistory("everything", evt => evt.name == "xinjilve" && evt.player == player && Array.isArray(evt.cost_data) && get.info("xinbaiyin").derivation.includes(evt.cost_data[0]));
				const num = Math.max(2, history.length);
				player.removeMark("xinrenjie", num);
				await player.addSkills(choice[0]);
			} else {
				player.removeMark("xinrenjie", choice[1] + 1);
				await player.draw(choice[1] + 1);
			}
		},
		group: "xinjilve_gain",
		subSkill: {
			gain: {
				audio: "xinjilve",
				trigger: {
					player: "changeSkillsAfter",
				},
				filter(event, player) {
					return event.addSkill.includes("xinjilve");
				},
				forced: true,
				async content(event, trigger, player) {
					let skills = ["reguicai"];
					const groupList = new Map([
						["wei", "fangzhu"],
						["shu", "rejizhi"],
						["wu", "rezhiheng"],
						["qun", "rewansha"],
						["key", "hiroto_zonglve"],
					]);
					if (Array.from(groupList.keys()).includes(player.group)) {
						skills.push(groupList.get(player.group));
					}
					skills = skills.filter(skill => !player.hasSkill(skill, null, null, false));
					if (skills.length) {
						await player.addSkills(skills);
					}
				},
			},
		},
		ai: {
			notemp: true,
		},
	},
	//十周年神华佗
	jingyu: {
		audio: 2,
		trigger: {
			global: ["useSkill", "logSkillBegin"],
		},
		filter(event, player) {
			if (["global", "equip"].includes(event.type)) {
				return false;
			}
			let skill = get.sourceSkillFor(event);
			if (!skill || skill === "jingyu") {
				return false;
			}
			let info = get.info(skill);
			if (!info || info.charlotte || info.equipSkill) {
				return false;
			}
			return !player.getStorage("jingyu_used").includes(skill);
		},
		direct: true,
		forced: true,
		async content(event, trigger, player) {
			if (!player.storage.jingyu_used) {
				player
					.when({ global: "roundStart" }, false)
					.assign({
						firstDo: true,
					})
					.step(async () => delete player.storage.jingyu_used)
					.finish();
			}
			let skill = get.sourceSkillFor(trigger);
			player.markAuto("jingyu_used", skill);
			player.logSkill(event.name);
			await player.draw();
		},
		ai: { threaten: 6 },
	},
	lvxin: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filterTarget: lib.filter.notMe,
		filter() {
			const round = game.roundNumber;
			return typeof round == "number" && round > 0;
		},
		check(card) {
			const round = game.roundNumber,
				player = get.player();
			let valueFix = 0;
			if (["sha", "shan"].includes(get.name(card, false))) {
				valueFix += 3;
			}
			if (
				(round <= 2 &&
					player.hasCard(card => {
						return ["sha", "shan"].includes(get.name(card)) && get.value(card) <= 3;
					})) ||
				game.hasPlayer(current => {
					return current !== player && get.attitude(player, current) > 0;
				})
			) {
				return 6 - get.value(card) + valueFix;
			}
			return 4.5 - get.value(card) + valueFix;
		},
		delay: false,
		discard: false,
		lose: false,
		async content(event, trigger, player) {
			const { target, cards } = event,
				round = Math.min(5, game.roundNumber);
			const name = get.translation(target);
			await player.give(cards, target);
			const result = await player
				.chooseControl(["摸牌", "弃牌"])
				.set("choiceList", [`令${name}摸${get.cnNumber(round)}张牌`, `令${name}随机弃置${get.cnNumber(round)}张手牌`])
				.set("prompt", "滤心：请选择一项")
				.set("ai", () => {
					return get.event().choice;
				})
				.set("choice", get.attitude(player, target) > 0 ? "摸牌" : "弃牌")
				.forResult();
			let cards2 = [];
			const makeDraw = result.index === 0;
			if (makeDraw) {
				const result = await target.draw(round).forResult();
				cards2 = result.cards;
			} else {
				if (cards.length > 0) {
					const evt = target.randomDiscard(round);
					await evt;
					cards2 = evt.done.cards2;
				}
			}
			const cardName = get.name(cards[0], player);
			if (
				cards2.some(card => {
					return get.name(card, target) === cardName;
				})
			) {
				const skillName = `lvxin_${makeDraw ? "recover" : "lose"}`;
				target.addSkill(skillName);
				target.addMark(skillName, 1, false);
			}
		},
		subSkill: {
			recover: {
				trigger: { player: ["useSkill", "logSkillBegin", "useCard", "respond"] },
				filter(event, player) {
					if (["global", "equip"].includes(event.type)) {
						return false;
					}
					if ((get.info(event.skill) || {}).charlotte) {
						return false;
					}
					const skill = get.sourceSkillFor(event);
					const info = get.info(skill);
					return info && !info.charlotte && !info.equipSkill;
				},
				forced: true,
				onremove: true,
				charlotte: true,
				async content(event, trigger, player) {
					player.recover(player.countMark(event.name));
					player.removeSkill(event.name);
				},
				intro: { content: "下次发动技能时回复#点体力" },
			},
			lose: {
				trigger: { player: ["useSkill", "logSkillBegin", "useCard", "respond"] },
				filter(event, player) {
					if (["global", "equip"].includes(event.type)) {
						return false;
					}
					if ((get.info(event.skill) || {}).charlotte) {
						return false;
					}
					const skill = get.sourceSkillFor(event);
					const info = get.info(skill);
					return info && !info.charlotte && !info.equipSkill;
				},
				forced: true,
				onremove: true,
				charlotte: true,
				async content(event, trigger, player) {
					player.loseHp(player.countMark(event.name));
					player.removeSkill(event.name);
				},
				intro: { content: "下次发动技能时失去#点体力" },
			},
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					const round = game.roundNumber;
					if (
						round <= 2 &&
						target.countCards("h") > round * 2 &&
						player.getCards("h").some(card => {
							return ["sha", "shan"].includes(get.name(card)) && get.value(card) <= 3;
						})
					) {
						return 1;
					}
					if (get.attitude(player, target) > 0) {
						return round + Math.sqrt(1 + target.getDamagedHp());
					}
					return -(round + Math.sqrt(Math.max(0, 2 - target.getHp())));
				},
			},
		},
	},
	huandao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		limited: true,
		filterTarget: lib.filter.notMe,
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { target } = event;
			await target.turnOver(false);
			await target.link(false);
			let names = [target.name1 || target.name];
			if (target.name2) {
				names.add(target.name2);
			}
			names = names.map(name => get.rawName(name));
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			_status.characterlist.randomSort();
			let ownedSkills = target.getSkills(null, false, false),
				ownedSkillsName = ownedSkills.map(skill => get.translation(skill));
			let skillToGain = null;
			outer: for (const name of _status.characterlist) {
				const info = lib.character[name];
				if (!names.includes(get.rawName(name))) {
					continue;
				}
				const skills = info[3].slice().randomSort();
				while (skills.length) {
					const skill = skills.shift(),
						skillName = get.translation(skill);
					if (!ownedSkillsName.includes(skillName)) {
						skillToGain = skill;
						break outer;
					}
				}
			}
			if (!skillToGain) {
				return;
			}
			player.popup(skillToGain);
			player.line(target, "green");
			let prompt2 = "若你选择是，则你于获得此技能后须失去一个其他技能。<br><br>";
			if (lib.skill[skillToGain].nobracket) {
				prompt2 += `<div class="skilln">${get.translation(skillToGain)}</div><div><span style="font-family: yuanli">${get.skillInfoTranslation(skillToGain, null, false)}</span></div><br><br>`;
			} else {
				const translation = lib.translate[skillToGain + "_ab"] || get.translation(skillToGain).slice(0, 2);
				prompt2 += `<div class="skill">【${translation}】</div><div><span style="font-family: yuanli">${get.skillInfoTranslation(skillToGain, null, false)}</span></div><br><br>`;
			}
			const { bool } = await target
				.chooseBool(`寰道：是否获得技能〖${get.translation(skillToGain)}〗？`, prompt2)
				.set(
					"choice",
					(() => {
						const rank = get.skillRank(skillToGain, "inout") + 1;
						return ownedSkills.some(skill => {
							const info = get.info(skill);
							if (info) {
								if (target.awakenedSkills.includes(skill) && (info.limited || info.juexingji || info.dutySkill)) {
									return true;
								}
								if (info.ai && (info.ai.neg || info.ai.halfneg)) {
									return true;
								}
							}
							return get.skillRank(skill, "inout") < rank;
						});
					})()
				)
				.forResult();
			if (!bool) {
				target.chat("拒绝");
				game.log(target, "拒绝获得技能", `#g【${get.translation(skillToGain)}】`);
				await game.delay();
				return;
			}
			await target.addSkills(skillToGain);
			ownedSkills = target.getSkills(null, false, false).filter(skill => {
				if (skill === skillToGain) {
					return false;
				}
				const info = get.info(skill);
				if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
					return false;
				}
				return true;
			});
			if (!ownedSkills) {
				return;
			}
			const { control } = await target
				.chooseControl(ownedSkills)
				.set(
					"choiceList",
					ownedSkills.map(skill => {
						return `<div class="skill">【${get.translation(lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2))}】</div><div>${get.skillInfoTranslation(skill, target, false)}</div>`;
					})
				)
				.set("displayIndex", false)
				.set("prompt", "寰道：选择失去一个技能")
				.set("ai", () => {
					return get.event().choice;
				})
				.set(
					"choice",
					(() => {
						const uselessSkills = ownedSkills.filter(skill => {
							const info = get.info(skill);
							if (!info) {
								return false;
							}
							if (target.awakenedSkills.includes(skill) && (info.limited || info.juexingji || info.dutySkill)) {
								return true;
							}
							if (info.ai && (info.ai.neg || info.ai.halfneg)) {
								return true;
							}
							return false;
						});
						if (uselessSkills.length) {
							return uselessSkills.randomGet();
						}
						return ownedSkills.sort((a, b) => {
							return get.skillRank(a, "inout") - get.skillRank(b, "inout");
						})[0];
					})()
				)
				.forResult();
			await target.removeSkills(control);
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (!_status.characterlist) {
						game.initCharacterList();
					}
					if (game.roundNumber * game.countPlayer() <= (1.5 * game.countPlayer2()) / Math.sqrt(player.getDamagedHp() + 1)) {
						return 0;
					}
					const ownedSkills = target.getSkills(null, false, false).filter(skill => {
						const info = get.info(skill);
						if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
							return false;
						}
						return true;
					});
					const uselessSkills = ownedSkills.filter(skill => {
						const info = get.info(skill);
						if (!info) {
							return false;
						}
						if (target.awakenedSkills.includes(skill) && (info.limited || info.juexingji || info.dutySkill)) {
							return true;
						}
						if (info.ai && (info.ai.neg || info.ai.halfneg)) {
							return true;
						}
						return false;
					});
					if (uselessSkills.length) {
						return 3;
					}
					let names = [target.name1 || target.name];
					if (target.name2) {
						names.add(target.name2);
					}
					names = names.map(name => get.rawName(name));
					if (_status.characterlist.some(name => names.includes(get.rawName(name)))) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	//神许褚
	zhengqing: {
		audio: 2,
		trigger: { global: "roundEnd" },
		forced: true,
		filter() {
			return (
				game.hasPlayer(current => {
					return current.countMark("zhengqing");
				}) || lib.skill.zhengqing.getMostInfoLastRound()[0] > 0
			);
		},
		getMostInfoLastRound() {
			let max = -1,
				players = [];
			const history = game.getAllGlobalHistory();
			if (history.length <= 1) {
				return [max, players];
			}
			for (let i = history.length - 1; i >= 0; i--) {
				const evts = history[i]["everything"].filter(evt => {
					if (evt.name !== "damage") {
						return false;
					}
					const source = evt.source;
					return source && source.isIn();
				});
				if (evts.length) {
					let curMax = -1,
						curPlayers = [];
					const map = {};
					for (const evt of evts) {
						const source = evt.source;
						const id = source.playerid;
						if (typeof map[id] !== "number") {
							map[id] = 0;
						}
						map[id] += evt.num;
						if (map[id] > curMax) {
							curMax = map[id];
							curPlayers = [source];
						} else if (map[id] == curMax) {
							curPlayers.add(source);
						}
					}
					if (curMax > max) {
						max = curMax;
						players = curPlayers.slice();
					} else if (curMax === max) {
						players.addArray(curPlayers);
					}
				}
				if (history[i].isRound) {
					break;
				}
			}
			return [max, players];
		},
		async content(event, trigger, player) {
			game.countPlayer(current => {
				if (current.hasMark("zhengqing")) {
					current.clearMark("zhengqing");
				}
			});
			const [num, players] = lib.skill.zhengqing.getMostInfoLastRound();
			let target;
			if (!players.length) {
				return;
			} else if (players.length === 1) {
				target = players[0];
			} else if (players.includes(player)) {
				target = player;
			} else {
				target = players.randomGet();
			}
			player.line(target, "thunder");
			const isMax =
				(player
					.getAllHistory("custom", evt => evt && evt.zhengqing_count)
					.map(evt => evt.zhengqing_count)
					.sort((a, b) => b - a)[0] || 0) <= num;
			target.addMark("zhengqing", num);
			if (target === player && isMax) {
				player.draw(Math.min(5, num));
				player.getHistory("custom").push({ zhengqing_count: num });
			} else {
				await game.asyncDraw([player, target].sortBySeat(trigger.player));
			}
		},
		marktext: "擎",
		intro: {
			name: "争擎",
			name2: "擎",
			content: "mark",
		},
	},
	zhuangpo: {
		audio: 2,
		enable: "chooseToUse",
		onChooseToUse(event) {
			if (!game.online && !event.zhuangpo_cards) {
				event.set(
					"zhuangpo_cards",
					event.player.getCards("hes", card => {
						if (get.name(card, event.player) == "sha") {
							return true;
						}
						const str = get.cardDescription(card, event.player);
						return str.includes("【杀】");
					})
				);
			}
		},
		viewAs: {
			name: "juedou",
			storage: { zhuangpo: true },
		},
		viewAsFilter() {
			return get.event().zhuangpo_cards?.length;
		},
		prompt: "将一张牌面信息包含“【杀】”的牌当【决斗】使用",
		filterCard(card, player) {
			return get.event().zhuangpo_cards.includes(card);
		},
		position: "hes",
		async precontent(event, trigger, player) {
			player.addTempSkill("zhuangpo_effect");
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCardToPlayered",
				},
				filter(event, player) {
					const card = event.card;
					if (!card || !card.storage || !card.storage.zhuangpo) {
						return false;
					}
					return player.hasMark("zhengqing");
				},
				charlotte: true,
				group: "zhuangpo_damage",
				async cost(event, trigger, player) {
					const target = trigger.target;
					
					const count = player.countMark("zhengqing");
					const prompt = `###壮魄：是否移去任意枚“擎”？###若如此做，${get.translation(target)}须弃置等量的牌`;
					const numbers = [
						{ prompt: "请选择要移去的“擎”", min: 1, max: count }
					];

					const next = player.chooseNumbers(prompt, numbers);
					next.set("processAI", processAI)

					const result = await next.forResult();
					event.result = {
						bool: result.bool,
						targets: [target],
						cost_data: {
							number: result.numbers[0],
						},
					}

					return;

					/**
					 * @returns {false | number[]}
					 */
					function processAI() {
						if (get.attitude(player, target) >= 0) {
							return false;
						}

						const markCount = count;
						const cards = target.getCards("he", card => lib.filter.cardDiscardable(card, target));
						let allIn = false;
						if (player.hp < 2 || target.hp + target.countCards("h", card => target.canSaveCard(card, target)) <= 1 + trigger.targets.some(current => current.hasMark("zhengqing"))) {
							allIn = true;
						}
						if (cards.map(card => get.value(card)).reduce((p, c) => p + c, 0) / cards.length > 5) {
							allIn = true;
						}
						if (
							!player.isPhaseUsing() ||
							!player.hasCard(card => {
								if (!get.cardDescription(card, player).includes("【杀】")) {
									return false;
								}
								return player.hasValueTarget(get.autoViewAs({ name: "juedou" }, [card]));
							})
						) {
							allIn = true;
						}
						const maxCount = Math.min(markCount, cards.length);
						const toRemoveCount = allIn ? maxCount : Math.ceil(Math.random() * maxCount);
						return [toRemoveCount];
					}
				},
				logTarget: "targets",
				async content(event, trigger, player) {
					const { targets, cost_data } = event;
					const [target] = targets;
					const { number: toRemoveCount } = cost_data;
					player.popup(get.cnNumber(toRemoveCount) + "张");
					player.removeMark("zhengqing", toRemoveCount);
					await target.chooseToDiscard("he", toRemoveCount, true);
				},
			},
			damage: {
				audio: "zhuangpo",
				trigger: { global: "damageBegin1" },
				filter(event, player) {
					const card = event.card;
					if (!card || !card.storage || !card.storage.zhuangpo) {
						return false;
					}
					const evt = event.getParent(2);
					return evt.targets && evt.targets.some(current => current.hasMark("zhengqing"));
				},
				charlotte: true,
				forced: true,
				async content(event, trigger) {
					trigger.num++;
				},
			},
		},
	},
	//神鲁肃
	dingzhou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const num = player.countCards("he");
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				const total = current.countCards("ej");
				return total > 0 && num >= total;
			});
		},
		filterCard: true,
		selectCard() {
			return [1, Math.max(...game.filterPlayer(i => i != get.player()).map(i => i.countCards("ej")))];
		},
		check(card) {
			return 7 - get.value(card);
		},
		filterTarget(card, player, target) {
			const num = target.countCards("ej");
			if (!num) {
				return false;
			}
			return ui.selected.cards.length == num && player != target;
		},
		filterOk() {
			return ui.selected.cards.length == ui.selected.targets[0].countCards("ej");
		},
		position: "he",
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(event.cards, target);
			const cards = target.getGainableCards(player, "ej");
			if (cards.length) {
				player.gain(cards, "give", target);
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					let eff = 0;
					if (ui.selected.cards.length) {
						eff = ui.selected.cards.map(card => get.value(card)).reduce((p, c) => p + c, 0);
					}
					if (player.hasSkill("zhimeng") && (get.mode() == "identity" || player.countCards("h") - target.countCards("h") > 2 * ui.selected.cards.length)) {
						eff *= 1 + get.sgnAttitude(player, target) * 0.15;
					}
					const es = target.getCards("e"),
						js = target.getCards("j");
					es.forEach(card => {
						eff -= get.value(card, target);
					});
					js.forEach(card => {
						eff -= get.effect(
							target,
							{
								name: card.viewAs || card.name,
								cards: [card],
							},
							target,
							target
						);
					});
					return eff;
				},
			},
		},
	},
	tamo: {
		available(mode) {
			// 走另外的phaseLoop的模式/子模式/设置
			if (["boss", "stone", "tafang"].includes(mode) || ["jiange", "standard", "three", "leader"].includes(_status.mode) || get.config("seat_order") === "指定") {
				return false;
			}
		},
		getTargets() {
			return game.filterPlayer(current => {
				return !current.isZhu2();
			});
		},
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && get.info("tamo").getTargets().length > 1;
		},
		seatRelated: "changeSeat",
		derivation: "tamo_faq",
		frequent: true,
		async content(event, trigger, player) {
			const toSortPlayers = get.info(event.name).getTargets();
			toSortPlayers.sortBySeat(game.findPlayer2(current => current.getSeatNum() == 1, true));
			const next = player.chooseToMove("榻谟：是否分配" + (get.mode() != "doudizhu" ? (game.hasPlayer(cur => cur.isZhu2()) ? "除主公外" : "") : "") + "所有角色的座次？");
			next.set("list", [["（以下排列的顺序即为发动技能后角色的座次顺序）", [toSortPlayers.map(i => `${i.getSeatNum()}|${i.name}`), lib.skill.tamo.$createButton]]]);
			next.set("toSortPlayers", toSortPlayers.slice(0));
			next.set("processAI", () => {
				const players = get.event().toSortPlayers,
					player = get.player();
				players.randomSort().sort((a, b) => get.attitude(player, b) - get.attitude(player, a));
				return [players.map(i => `${i.getSeatNum()}|${i.name}`)];
			});
			const result = await next.forResult();
			const moved = result?.moved;
			const resultList = moved[0].map(info => {
				return parseInt(info.split("|")[0]);
			});
			const toSwapList = [];
			const cmp = (a, b) => {
				return resultList.indexOf(a) - resultList.indexOf(b);
			};
			for (let i = 0; i < toSortPlayers.length; i++) {
				for (let j = 0; j < toSortPlayers.length; j++) {
					if (cmp(toSortPlayers[i].getSeatNum(), toSortPlayers[j].getSeatNum()) < 0) {
						toSwapList.push([toSortPlayers[i], toSortPlayers[j]]);
						[toSortPlayers[i], toSortPlayers[j]] = [toSortPlayers[j], toSortPlayers[i]];
					}
				}
			}
			game.broadcastAll(toSwapList => {
				for (const list of toSwapList) {
					game.swapSeat(list[0], list[1], false);
				}
			}, toSwapList);
			if (trigger.name === "phase" && !trigger.player.isZhu2() && trigger.player !== toSortPlayers[0] && !trigger._finished) {
				trigger.finish();
				trigger._triggered = 5;
				const evt = toSortPlayers[0].insertPhase();
				delete evt.skill;
				const evt2 = trigger.getParent();
				if (evt2.name == "phaseLoop" && evt2._isStandardLoop) {
					evt2.player = toSortPlayers[0];
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
		$createButton(item, type, position, noclick, node) {
			const info = item.split("|"),
				_item = item;
			const seat = parseInt(info[0]);
			item = info[1];
			if (node) {
				node.classList.add("button");
				node.classList.add("character");
				node.style.display = "";
			} else {
				node = ui.create.div(".button.character", position);
			}
			node._link = item;
			node.link = item;

			const func = function (node, item) {
				const currentPlayer = game.findPlayer(current => current.getSeatNum() == seat);
				if (currentPlayer.classList.contains("unseen_show")) {
					node.setBackground("hidden_image", "character");
				} else if (item != "unknown") {
					node.setBackground(item, "character");
				}
				if (node.node) {
					node.node.name.remove();
					node.node.hp.remove();
					node.node.group.remove();
					node.node.intro.remove();
					if (node.node.replaceButton) {
						node.node.replaceButton.remove();
					}
				}
				node.node = {
					name: ui.create.div(".name", node),
					group: ui.create.div(".identity", node),
					intro: ui.create.div(".intro", node),
				};
				const infoitem = [currentPlayer.sex, currentPlayer.group, `${currentPlayer.hp}/${currentPlayer.maxHp}/${currentPlayer.hujia}`];
				node.node.name.innerHTML = get.slimName(item);
				if (lib.config.buttoncharacter_style == "default" || lib.config.buttoncharacter_style == "simple") {
					if (lib.config.buttoncharacter_style == "simple") {
						node.node.group.style.display = "none";
					}
					node.classList.add("newstyle");
					node.node.name.dataset.nature = get.groupnature(get.bordergroup(infoitem));
					node.node.group.dataset.nature = get.groupnature(get.bordergroup(infoitem), "raw");
				}
				node.node.name.style.top = "8px";
				if (node.node.name.querySelectorAll("br").length >= 4) {
					node.node.name.classList.add("long");
					if (lib.config.buttoncharacter_style == "old") {
						node.addEventListener("mouseenter", ui.click.buttonnameenter);
						node.addEventListener("mouseleave", ui.click.buttonnameleave);
					}
				}
				node.node.intro.innerHTML = lib.config.intro;
				if (!noclick) {
					lib.setIntro(node);
				}
				node.node.group.innerHTML = `<div>${get.cnNumber(seat, true)}号</div>`;
				node.node.group.style.backgroundColor = get.translation(`${get.bordergroup(infoitem)}Color`);
			};
			node.refresh = func;
			node.refresh(node, item);

			node.link = _item;
			node.seatNumber = seat;
			node._customintro = uiintro => {
				uiintro.add(`${get.translation(node._link)}(原${get.cnNumber(node.seatNumber, true)}号位)`);
			};
			return node;
		},
	},
	//什么均贫卡
	zhimeng: {
		audio: 2,
		trigger: { player: "phaseAfter" },
		filter(event, player) {
			return game.hasPlayer(target => {
				if (target == player || target.countCards("h") + player.countCards("h") == 0) {
					return false;
				}
				return true;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "与一名其他角色平分手牌", (card, player, target) => {
					if (target == player || target.countCards("h") + player.countCards("h") == 0) {
						return false;
					}
					return true;
				})
				.set("ai", target => {
					const player = get.player();
					const pvalue = -player
						.getCards("h")
						.map(card => get.value(card, player))
						.reduce((p, c) => p + c, 0);
					const tvalue =
						-target
							.getCards("h")
							.map(card => get.value(card, target))
							.reduce((p, c) => p + c, 0) * get.sgnAttitude(player, target);
					return (pvalue + tvalue) / 2;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const lose_list = [];
			let cards = [];
			[player, target].forEach(current => {
				const hs = current.getCards("h");
				if (hs.length) {
					cards.addArray(hs);
					current.$throw(hs.length, 500);
					game.log(current, "将", get.cnNumber(hs.length), "张牌置入了处理区");
					lose_list.push([current, hs]);
				}
			});
			if (lose_list.length) {
				await game
					.loseAsync({
						lose_list,
					})
					.setContent("chooseToCompareLose");
			}
			await game.delay();
			cards = cards.filterInD();
			const pcards = cards.randomGets(Math.ceil(cards.length / 2));
			const tcards = cards.removeArray(pcards);
			const list = [];
			if (pcards.length) {
				list.push([player, pcards]);
				game.log(player, "获得了", get.cnNumber(pcards.length), "张牌");
			}
			if (tcards.length) {
				list.push([target, tcards]);
				game.log(target, "获得了", get.cnNumber(tcards.length), "张牌");
			}
			await game
				.loseAsync({
					gain_list: list,
					player,
					animate: "draw",
				})
				.setContent("gaincardMultiple");
		},
		ai: { threaten: 4 },
	},
	//神华佗
	wuling: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.wuling.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return !target.hasSkill("wuling_wuqinxi");
		},
		usable: 2,
		prompt: "选择一名角色，向其传授“五禽戏”",
		group: "wuling_die",
		async content(event, trigger, player) {
			const { target } = event;

			target.addAdditionalSkill(`wuling_${player.playerid}`, "wuling_wuqinxi");

			const next = player.chooseToMove(`五灵：调整向${get.translation(target)}传授的“五禽戏”顺序`);

			const cards = [lib.skill.wuling.wuqinxi, createCard];
			next.set("list", [["", cards]]);
			next.set("processAI", processAI);

			const result = await next.forResult();
			const sortedWuqinxi = result.moved[0].map(card => card[2]);
			game.log(target, "习得的五禽戏顺序为", "#g" + sortedWuqinxi.join("、"));
			sortedWuqinxi.unshift(sortedWuqinxi[0]);
			target.storage.wuling_wuqinxi = sortedWuqinxi;
			lib.skill.wuling.updateMark(target);

			return;

			function createCard(item, type, position, noclick, node) {
				node = ui.create.buttonPresets.vcard(lib.skill.wuling.wuqinxiMap2[item][0], type, position, noclick);
				node.node.range.innerHTML = lib.skill.wuling.wuqinxiMap2[item][1];
				node.node.range.style.bottom = "2.5px";
				node.node.range.style.width = "100%";
				node.node.range.style.right = "0%";
				node.node.range.style.textAlign = "center";
				node._link = node.link = [null, null, item];
				node._customintro = [node => `五禽戏：${node.link[2]}`, node => lib.skill.wuling.wuqinxiMap[lib.skill.wuling.wuqinxi.indexOf(node.link[2])].slice(2)];
				return node;
			}

			function processAI() {
				const event = get.event().getParent();
				const { player, target } = event;

				const spirits = [];
				let nextPlayer = player;
				do {
					nextPlayer = nextPlayer.getNext();
					if (get.attitude(player, nextPlayer) < 0) {
						spirits.add("熊");
						break;
					}
				} while (nextPlayer != target);

				if (!spirits.length) {
					spirits.add("猿");
				}

				const effectOk = get.recoverEffect(target, player, player) > 0;
				const hasBadCards = target.hasCard(card => {
					const vcard = {
						name: card.viewAs || card.name,
						cards: [card],
					};
					return get.effect(target, vcard, target, target) < -1
				}, "j");

				if (effectOk || hasBadCards) {
					spirits.add("鹿");
				}

				const others = lib.skill.wuling.wuqinxi.slice().removeArray(spirits);
				do {
					others.randomSort();
				} while (others.length > 1 && others[0] == "鹿");
				return [spirits.concat(others).map(i => ["", "", i])];
			}
		},
		wuqinxi: ["虎", "鹿", "熊", "猿", "鹤"],
		wuqinxiMap: ["虎：当你使用指定唯一目标的牌对目标角色造成伤害时，此伤害+1。", "鹿：①当你获得此效果时，你回复1点体力并弃置判定区的所有牌。②你不能成为延时锦囊牌的目标。", "熊：每回合限一次，当你受到伤害时，此伤害-1。", "猿：当你获得此效果时，你选择一名其他角色，获得其装备区里的一张牌。", "鹤：当你获得此效果时，你摸三张牌。"],
		wuqinxiMap2: {
			虎: ["wuqinxi_hu", "用牌加伤"],
			鹿: ["wuqinxi_lu", "弃判定回血"],
			熊: ["wuqinxi_xiong", "减伤"],
			猿: ["wuqinxi_yuan", "偷装备牌"],
			鹤: ["wuqinxi_he", "摸三张牌"],
		},
		updateMark(player) {
			var wuqinxi = player.storage.wuling_wuqinxi;
			if (!wuqinxi) {
				return;
			}
			var prevMark = wuqinxi.shift();
			// wuqinxi.push(prevMark);
			var curMark = wuqinxi[0];
			if (!curMark) {
				for (var skill in player.additionalSkills) {
					if (!skill.startsWith("wuling_")) {
						continue;
					}
					player.removeAdditionalSkill(skill);
				}
				game.log(player, "完成了五禽戏的操练");
				return;
			}
			game.log(player, "获得了", "#g【" + curMark + "】", "标记");
			player.markSkill("wuling_wuqinxi");
			game.broadcastAll(
				function (player, curMark) {
					if (player.marks.wuling_wuqinxi) {
						player.marks.wuling_wuqinxi.firstChild.innerHTML = curMark;
					}
				},
				player,
				curMark
			);
			var next = game.createEvent("wuling_change");
			next.player = player;
			next.setContent("emptyEvent");
		},
		ai: {
			order: 7,
			threaten: 5,
			result: { target: 1 },
		},
		derivation: "wuling_wuqinxi",
		subSkill: {
			wuqinxi: {
				nopop: true,
				charlotte: true,
				intro: {
					markcount: () => 0,
					mark(dialog, storage) {
						const wuqinxiMap = lib.skill.wuling.wuqinxiMap;
						const str = `<li>当前效果：${storage[0]}<br><li>${wuqinxiMap.find(str => storage[0] == str[0]).slice(2)}<br>`;
						dialog.addText(str, false);
						const str2 = '<div class="text center">“五禽戏”顺序：<br>' + storage.join(" ") + "</div>";
						dialog.addText(str2);
						if (storage.length > 1) {
							const str3 = `<div class="text" style="font-size:10px; ">[下一效果] ${wuqinxiMap.find(str => storage[1] == str[0])}<br></div>`;
							dialog.add(str3);
						}
					},
				},
				mod: {
					targetEnabled(card, player, target) {
						if (get.type(card) == "delay" && target.storage.wuling_wuqinxi && target.storage.wuling_wuqinxi[0] == "鹿") {
							return false;
						}
					},
				},
				trigger: {
					source: "damageBegin1",
					player: ["phaseZhunbeiBegin", "damageBegin4", "wuling_change"],
				},
				filter(event, player, name) {
					const wuqinxi = player.storage.wuling_wuqinxi && player.storage.wuling_wuqinxi[0];
					if (!wuqinxi) {
						return false;
					}
					if (event.name == "phaseZhunbei") {
						return true;
					}
					switch (name) {
						case "damageBegin1":
							if (wuqinxi != "虎" || !event.card) {
								return false;
							}
							var evt = event.getParent("useCard");
							return evt?.targets.length == 1 && evt.targets.includes(event.player);
						case "damageBegin4":
							return wuqinxi == "熊" && !player.hasSkill("wuling_xiong");
						default:
							switch (wuqinxi) {
								case "鹿":
									return player.isDamaged() || player.countCards("j") > 0;
								case "鹤":
									return true;
								case "猿":
									return game.hasPlayer(target => target != player && target.countGainableCards(player, "e") > 0);
								default:
									return false;
							}
					}
				},
				forced: true,
				onremove: true,
				async content(event, trigger, player) {
					var wuqinxi = player.storage.wuling_wuqinxi[0];
					if (trigger.name == "phaseZhunbei") {
						lib.skill.wuling.updateMark(player);
						return;
					}
					var name = event.triggername;
					switch (name) {
						case "damageBegin1":
							player.line(trigger.player);
							trigger.num++;
							break;
						case "damageBegin4":
							player.addTempSkill("wuling_xiong");
							trigger.num--;
							break;
						default:
							switch (wuqinxi) {
								case "鹿":
									await player.recover();
									await player.discard(player.getCards("j"), player);
									break;
								case "鹤":
									await player.draw(3);
									break;
								case "猿": {
									const { targets } = await player
										.chooseTarget("五禽戏：获得一名其他角色装备区里的一张装备牌", function (card, player, target) {
											return target != player && target.countGainableCards(player, "e");
										})
										.set("ai", function (target) {
											var player = _status.event.player;
											var att = get.attitude(player, target),
												eff = 0;
											target.getCards("e", function (card) {
												var val = get.value(card, target);
												eff = Math.max(eff, -val * att);
											});
											return eff;
										})
										.forResult();
									if (targets?.length) {
										player.line(targets, "green");
										await player.gainPlayerCard(targets[0], "e", true);
									}
									break;
								}
							}
							break;
					}
				},
				ai: {
					effect: {
						target(card, player, target) {
							const wuqinxi = target.storage.wuling_wuqinxi;
							if (!wuqinxi || !wuqinxi.length) {
								return;
							}
							const curWuqinxi = wuqinxi[0];
							const nextWuqinxi = wuqinxi[1];
							if (nextWuqinxi == "鹿" && get.type(card) == "delay") {
								return "zerotarget";
							}
							if (curWuqinxi != "熊" || player.hasSkill("wuling_xiong")) {
								return;
							}
							if (player.hasSkillTag("jueqing", false, target)) {
								return;
							}
							var num = get.tag(card, "damage");
							if (num) {
								if (num > 1) {
									return 0.5;
								}
								return 0;
							}
						},
					},
				},
			},
			xiong: { charlotte: true },
			die: {
				trigger: { player: "die" },
				filter(event, player) {
					return game.hasPlayer(current => current.additionalSkills[`wuling_${player.playerid}`]);
				},
				forced: true,
				locked: false,
				forceDie: true,
				async content(event, trigger, player) {
					const targets = game.filterPlayer(current => {
						return Reflect.has(current.additionalSkills, `wuling_${player.playerid}`);
					});
					player.line(targets);
					targets.forEach(current => current.removeAdditionalSkill(`wuling_${player.playerid}`));
				},
			},
		},
	},
	youyi: {
		init(player) {
			player.storage.renku = true;
		},
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return _status.renku.length > 0;
		},
		prompt: "将仁区所有牌置入弃牌堆，令所有角色各回复1点体力",
		async content(event, trigger, player) {
			const cards = _status.renku.slice();
			const next = game.cardsDiscard(cards);
			next.fromRenku = true;
			await next;
			player.$throw(cards, 1000);
			game.log(cards, "从仁库进入了弃牌堆");
			const targets = game.filterPlayer(() => true);
			player.line(targets);
			await Promise.all(targets.map(target => target.recover()));
		},
		ai: {
			order(item, player) {
				return get.order({ name: "taoyuan" }, player);
			},
			result: {
				player(player) {
					return Math.max(
						0,
						game.filterPlayer().reduce((num, target) => num + get.recoverEffect(target, player, player), 0)
					);
				},
			},
		},
		group: "youyi_put",
		subSkill: {
			put: {
				audio: "youyi",
				trigger: { player: "phaseDiscardEnd" },
				filter(event, player) {
					return lib.skill.twlijian.getCards(event).length;
				},
				prompt2(event, player) {
					return "将" + get.translation(lib.skill.twlijian.getCards(event)) + "置入仁区";
				},
				async content(event, trigger, player) {
					const cards = lib.skill.twlijian.getCards(trigger);
					game.log(player, "将", cards, "置于了仁库");
					game.cardsGotoSpecial(cards, "toRenku");
				},
			},
		},
	},
	//神贾诩
	jxlianpo: {
		init: () => {
			game.addGlobalSkill("jxlianpo_global");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("jxlianpo", null, null, false), true)) {
				game.removeGlobalSkill("jxlianpo_global");
			}
		},
		trigger: { global: "dieAfter" },
		filter(event, player) {
			if (lib.skill.jxlianpo.getMax(event.player).length <= 1) {
				return false;
			}
			return event.source && event.source.isIn();
		},
		forced: true,
		logTarget: "source",
		getMax: dead => {
			let curs = game.players.slice(0);
			if (get.itemtype(dead) === "player" && !curs.includes(dead)) {
				curs.push(dead);
			}
			const map = {
				zhu: curs.reduce((count, current) => {
					let num = 0;
					if (["zhu", "zhong", "mingzhong"].includes(current.identity)) {
						num++;
					}
					num += current.countMark("jxlianpo_mark_zhong");
					return num + count;
				}, 0),
				fan: curs.reduce((count, current) => {
					let num = 0;
					if (current.identity == "fan") {
						num++;
					}
					num += current.countMark("jxlianpo_mark_fan");
					return num + count;
				}, 0),
				nei: curs.reduce((count, current) => {
					let num = 0;
					if (current.identity == "nei") {
						num++;
					}
					num += current.countMark("jxlianpo_mark_nei");
					return num + count;
				}, 0),
				commoner: curs.reduce((count, current) => {
					let num = 0;
					if (current.identity == "commoner") {
						num++;
					}
					num += current.countMark("jxlianpo_mark_commoner");
					return num + count;
				}, 0),
			};
			let population = 0,
				identities = [];
			for (let i in map) {
				let curPopulation = map[i];
				if (curPopulation >= population) {
					if (curPopulation > population) {
						identities = [];
					}
					identities.add(i);
					population = curPopulation;
				}
			}
			return identities;
		},
		group: "jxlianpo_show",
		async content(event, trigger, player) {
			var source = trigger.source;
			source.chooseDrawRecover(2, true);
		},
		mark: true,
		intro: {
			content: () =>
				`场上最大阵营为${lib.skill.jxlianpo
					.getMax()
					.map(i => {
						if (i == "zhu") {
							return "主忠";
						}
						return get.translation(i + "2");
					})
					.join("、")}`,
		},
		$createButton(item, type, position, noclick, node) {
			node = ui.create.identityCard(item, position, noclick);
			node.link = item;
			return node;
		},
		subSkill: {
			show: {
				audio: "jxlianpo",
				trigger: { global: "roundStart" },
				filter(event, player) {
					var list = lib.config.mode_config.identity.identity.lastItem.slice();
					list.removeArray(
						game.filterPlayer().map(i => {
							let identity = i.identity;
							if (identity == "mingzhong") {
								identity = "zhong";
							}
							return identity;
						})
					);
					return list.length;
				},
				forced: true,
				async content(event, trigger, player) {
					const list = lib.config.mode_config.identity.identity.lastItem.slice();

					const needRemoved = game.filterPlayer().map(current => {
						var identity = current.identity;
						return identity == "mingzhong" ? "zhong" : identity;
					});
					list.removeArray(needRemoved).unique();

					const cards = [list, createCard];
					const title = '###炼魄：请选择一个身份###<div class="text center">你选择的身份对应的阵营角色数于本轮内视为+1</div>';
					const next = player.chooseButton([title, cards], true);

					const result = await next.forResult();
					const choice = result.links[0];
					const mark = `jxlianpo_mark_${choice}`;

					player
						.when({ global: "roundStart" }, false)
						.assign({
							firstDo: true,
						})
						.filter(evt => evt != trigger)
						.step(async (event, trigger, player) => {
							for (const storage in player.storage) {
								if (storage.startsWith("jxlianpo_mark_")) {
									player.clearMark(storage);
								}
							}
						});
					
					player.addMark(mark, 1, false);
					event.videoId = lib.status.videoId++;
					const createDialog = (player, identity, id) => {
						var dialog = ui.create.dialog(`${get.translation(player)}展示了“${get.translation(identity + "2")}”的身份牌<br>`, "forcebutton");
						dialog.videoId = id;
						ui.create.spinningIdentityCard(identity, dialog);
					};
					game.broadcastAll(createDialog, player, choice, event.videoId);
					let color = "";
					if (choice == "zhong") {
						color = "#y";
					} else if (choice == "fan") {
						color = "#g";
					} else if (choice == "nei") {
						color = "#b";
					}
					game.log(player, "展示了", `${color}${get.translation(choice + "2")}`, "的身份牌");
					await game.delay(3);
					game.broadcastAll("closeDialog", event.videoId);

					return;

					function createCard(item, type, position, noclick, node) {
						return lib.skill.jxlianpo.$createButton(item, type, position, noclick, node);
					}
				},
			},
			global: {
				mod: {
					maxHandcard(player, num) {
						if (!lib.skill.jxlianpo.getMax().includes("fan")) {
							return;
						}
						return (
							num -
							game.countPlayer(current => {
								return current != player && current.hasSkill("jxlianpo");
							})
						);
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							if (!lib.skill.jxlianpo.getMax().includes("fan")) {
								return;
							}
							return (
								num +
								game.countPlayer(current => {
									return current.hasSkill("jxlianpo");
								})
							);
						}
					},
					attackRange(player, num) {
						if (!lib.skill.jxlianpo.getMax().includes("fan")) {
							return;
						}
						return (
							num +
							game.countPlayer(current => {
								return current.hasSkill("jxlianpo");
							})
						);
					},
					cardSavable(card, player, target) {
						if (card.name == "tao" && !player.hasSkill("jxlianpo")) {
							if (!lib.skill.jxlianpo.getMax().includes("zhu")) {
								return;
							}
							if (player == target) {
								return;
							}
							return false;
						}
					},
					playerEnabled(card, player, target) {
						if (card.name == "tao" && !player.hasSkill("jxlianpo")) {
							if (!lib.skill.jxlianpo.getMax().includes("zhu")) {
								return;
							}
							if (player == target) {
								return;
							}
							return false;
						}
					},
				},
				trigger: { player: "dieAfter" },
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("jxlianpo", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content: () => {
					game.removeGlobalSkill("jxlianpo_global");
				},
			},
		},
	},
	jxzhaoluan: {
		trigger: { global: "dieBegin" },
		filter(event, player) {
			return event.getParent().name == "dying" && event.player.isIn();
		},
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		logTarget: "player",
		check(event, player) {
			if (event.source && event.source.isIn() && get.attitude(player, event.source) > 0 && player.identity == "fan") {
				return false;
			}
			return get.attitude(player, event.player) > 3.5;
		},
		async content(event, trigger, player) {
			var target = trigger.player;
			player.awakenSkill(event.name);
			trigger.cancel();
			const skills = target.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (info && !info.charlotte && !get.is.locked(skill)) {
					return true;
				}
			});
			if (skills.length) {
				await target.removeSkills(skills);
			}
			await target.gainMaxHp(3);
			var num = 3 - target.getHp(true);
			if (num > 0) {
				await target.recover(num);
			}
			target.draw(4);
			player.addSkill("jxzhaoluan_effect");
			player.markAuto("jxzhaoluan_effect", target);
		},
		ai: {
			expose: 0.5,
			threaten: 3,
		},
		subSkill: {
			effect: {
				audio: "jxzhaoluan",
				enable: "phaseUse",
				filter(event, player) {
					return player.getStorage("jxzhaoluan_effect").some(i => i.isIn());
				},
				filterTarget(card, player, target) {
					return !player.getStorage("jxzhaoluan_hit").includes(target);
				},
				line: false,
				locked: true,
				charlotte: true,
				promptfunc() {
					var bodies = _status.event.player.getStorage("jxzhaoluan_effect").filter(i => i.isIn());
					return `选择一名角色，你令${get.translation(bodies)}${bodies.length > 1 ? "中的一人" : ""}减1点体力上限，然后你对选择的角色造成1点伤害。`;
				},
				delay: false,
				async content(event, trigger, player) {
					const bodies = player.getStorage("jxzhaoluan_effect").filter(target => target.isIn());
					
					let result;
					if (bodies.length == 1) {
						result = { bool: true, targets: bodies };
					} else {
						result = await player
							.chooseTarget("兆乱：请选择被减上限的傀儡", true, (card, player, target) => {
								return get.event().targets.includes(target);
							})
							.set("targets", bodies)
							.set("ai", target => {
								return 8 - get.attitude(_status.event.player, target);
							})
							.forResult();
					}

					if (!result.bool) {
						return;
					}

					const target = result.targets[0];
					player.line(target);
					await target.loseMaxHp();
					await game.delayex();

					player.line(target);
					await target.damage();
					if (!player.storage.jxzhaoluan_hit) {
						player.when("phaseUseAfter").step(async (event, trigger, player) => {
							delete player.storage.jxzhaoluan_hit;
						});
					}
					player.markAuto("jxzhaoluan_hit", target);
				},
				ai: {
					order: 9,
					result: {
						player(player) {
							var bodies = player.getStorage("jxzhaoluan_effect").filter(i => i.isIn());
							var body;
							if (bodies.length == 1) {
								body = bodies[0];
							} else {
								body = bodies.sort((a, b) => get.attitude(player, a) - get.attitude(player, b))[0];
							}
							if (get.attitude(player, body) > 4 && !body.isDamaged() && body.getHp() <= 2) {
								return -10;
							}
							return 0;
						},
						target(player, target) {
							return Math.sign(get.damageEffect(target, player, target));
						},
					},
				},
			},
		},
	},
	//神典韦
	juanjia: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && player.hasEnabledSlot(2);
		},
		async content(event, trigger, player) {
			await player.disableEquip(2);
			await player.expandEquip(1);
		},
	},
	qiexie: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.countEmptySlot(1) > 0;
		},
		async content(event, trigger, player) {
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			_status.characterlist.randomSort();

			const list = [];
			outer: for (const name of _status.characterlist) {
				const info = lib.character[name];

				for (const skill of info[3]) {
					const info = get.skillInfoTranslation(skill);
					if (!info.includes("【杀】")) {
						continue outer;
					}

					const list = get.skillCategoriesOf(skill, player);
					list.remove("锁定技");
					if (list.length == 0) {
						break;
					}
					continue outer;
				}

				list.push(name);
				if (list.length >= 5) {
					break;
				}
			}
			if (!list.length) {
				return;
			}

			const num = player.countEmptySlot(1);
			const vcards = [list, createCard];
			const title = `挈挟：选择${(num > 1 ? "至多" : "")}${get.cnNumber(num)}张武将置入武器栏`

			const page = [title, vcards];
			const next = player.chooseButton(page, [1, num], true, "allowChooseAll");
			next.set("ai", processAI);

			const result = await next.forResult();
			if (result.bool) {
				const list = result.links;
				game.addVideo("skill", player, ["qiexie", [list]]);
				_status.characterlist.removeArray(list);
				game.broadcastAll(
					(player, list) => {
						player.tempname.addArray(list);
						for (var name of list) {
							lib.skill.qiexie.createCard(name);
						}
					},
					player,
					list
				);
				const cards = list.map(name => {
					const card = game.createCard(`qiexie_${name}`, "none", "none");
					return card;
				});
				player.$gain2(cards);
				await game.delayx();
				// player.equip(cards);
				for (const card of cards) {
					player.equip(card);
				}
			}

			return;

			function createCard(item, type, position, noclick, node) {
				return lib.skill.qiexie.$createButton(item, type, position, noclick, node);
			}

			function processAI(button) {
				const name = button.link;
				const info = lib.character[name];
				const skills = info[3].filter(skill => {
					const info = get.skillInfoTranslation(skill);
					if (!info.includes("【杀】")) {
						return false;
					}
					const list = get.skillCategoriesOf(skill, get.player());
					list.remove("锁定技");
					return list.length == 0;
				});
				let eff = 0.2;
				for (const skill of skills) {
					eff += get.skillRank(skill, "in");
				}
				return eff;
			}
		},
		$createButton(item, type, position, noclick, node) {
			node = ui.create.buttonPresets.character(item, "character", position, noclick);
			const info = lib.character[item];
			const skills = info[3].filter(function (skill) {
				var info = get.skillInfoTranslation(skill);
				if (!info.includes("【杀】")) {
					return false;
				}
				var list = get.skillCategoriesOf(skill, get.player());
				list.remove("锁定技");
				return list.length == 0;
			});
			if (skills.length) {
				const skillstr = skills.map(i => `[${get.translation(i)}]`).join("<br>");
				const skillnode = ui.create.caption(`<div class="text" data-nature=${get.groupnature(info[1], "raw")}m style="font-family: ${lib.config.name_font || "xinwei"},xinwei">${skillstr}</div>`, node);
				skillnode.style.left = "2px";
				skillnode.style.bottom = "2px";
			}
			node._customintro = function (uiintro, evt) {
				const character = node.link,
					characterInfo = get.character(node.link);
				let capt = get.translation(character);
				if (characterInfo) {
					const infoHp = get.infoMaxHp(characterInfo[2]);
					capt += `&nbsp;&nbsp;范围：${infoHp}`;
				}
				uiintro.add(capt);
				if (lib.characterTitle[node.link]) {
					uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
				}
				for (let i = 0; i < skills.length; i++) {
					if (lib.translate[skills[i] + "_info"]) {
						let translation = lib.translate[skills[i] + "_ab"] || get.translation(skills[i]).slice(0, 2);
						if (lib.skill[skills[i]] && lib.skill[skills[i]].nobracket) {
							uiintro.add('<div><div class="skilln">' + get.translation(skills[i]) + "</div><div>" + get.skillInfoTranslation(skills[i], null, false) + "</div></div>");
						} else {
							uiintro.add('<div><div class="skill">【' + translation + "】</div><div>" + get.skillInfoTranslation(skills[i], null, false) + "</div></div>");
						}
						if (lib.translate[skills[i] + "_append"]) {
							uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills[i] + "_append"] + "</div>");
						}
					}
				}
			};
			return node;
		},
		video(player, info) {
			for (var name of info[0]) {
				lib.skill.qiexie.createCard(name);
			}
		},
		createCard(name) {
			if (!_status.postReconnect.qiexie) {
				_status.postReconnect.qiexie = [
					function (list) {
						for (var name of list) {
							lib.skill.qiexie.createCard(name);
						}
					},
					[],
				];
			}
			_status.postReconnect.qiexie[1].add(name);
			if (!lib.card["qiexie_" + name]) {
				if (lib.translate[name + "_ab"]) {
					lib.translate["qiexie_" + name] = lib.translate[name + "_ab"];
				} else {
					lib.translate["qiexie_" + name] = lib.translate[name];
				}
				var info = lib.character[name];
				var card = {
					fullimage: true,
					image: "character:" + name,
					type: "equip",
					subtype: "equip1",
					enable: true,
					selectTarget: -1,
					filterTarget(card, player, target) {
						if (player != target) {
							return false;
						}
						return target.canEquip(card, true);
					},
					modTarget: true,
					allowMultiple: false,
					content: lib.element.content.equipCard,
					toself: true,
					ai: {},
					skills: ["qiexie_destroy"],
				};
				var maxHp = get.infoMaxHp(info[2]);
				if (maxHp != 1) {
					card.distance = { attackFrom: 1 - maxHp };
				}
				var skills = info[3].filter(function (skill) {
					var info = get.skillInfoTranslation(skill);
					if (!info.includes("【杀】")) {
						return false;
					}
					var list = get.skillCategoriesOf(skill, get.player());
					list.remove("锁定技");
					return list.length == 0;
				});
				var str = "锁定技。";
				if (skills.length) {
					card.skills.addArray(skills);
					str += "你视为拥有技能";
					for (var skill of skills) {
						str += "〖" + get.translation(skill) + "〗";
						str += "、";
					}
					str = str.slice(0, str.length - 1);
					str += "；";
					card.ai.equipValue = function (card, player) {
						let val = maxHp;
						if (player.hasSkill("qiexie")) {
							val *= 0.4;
						} else {
							val *= 0.6;
						}
						return (val += skills.length);
					};
				}
				str += "此牌离开你的装备区后，改为置入剩余武将牌牌堆。";
				lib.translate["qiexie_" + name + "_info"] = str;
				var append = "";
				if (skills.length) {
					for (var skill of skills) {
						if (lib.skill[skill].nobracket) {
							append += '<div class="skilln">' + get.translation(skill) + '</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + "</span></div><br><br>";
						} else {
							var translation = lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2);
							append += '<div class="skill">【' + translation + '】</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + "</span></div><br><br>";
						}
					}
					str = str.slice(0, str.length - 8);
				}
				lib.translate["qiexie_" + name + "_append"] = append;
				lib.card["qiexie_" + name] = card;
				game.finishCard("qiexie_" + name);
			}
		},
		subSkill: {
			destroy: {
				trigger: { player: "loseBegin" },
				equipSkill: true,
				forceDie: true,
				charlotte: true,
				forced: true,
				popup: false,
				filter(event, player) {
					return event.cards.some(card => card.name.indexOf("qiexie_") == 0);
				},
				async content(event, trigger, player) {
					for (const card of trigger.cards) {
						if (card.name.indexOf("qiexie_") == 0) {
							card._destroy = true;
							game.log(card, "被放回武将牌堆");
							const name = card.name.slice(7);
							if (player.tempname && player.tempname.includes(name)) {
								game.broadcastAll(
									(player, name) => {
										player.tempname.remove(name);
									},
									player,
									name
								);
							}
							if (lib.character[name]) {
								_status.characterlist.add(name);
							}
						}
					}
				},
			},
		},
	},
	cuijue: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") > 0; //&&game.hasPlayer(target=>lib.skill.cuijue.filterTarget('SB',player,target));
		},
		filterCard: true,
		filterTarget(card, player, target) {
			if (player.getStorage("cuijue_used").includes(target) || !player.inRange(target)) {
				return false;
			}
			var distance = get.distance(player, target);
			return !game.hasPlayer(current => current != target && player.inRange(current) && get.distance(player, current) > distance);
		},
		selectTarget: [0, 1],
		filterOk() {
			var player = _status.event.player;
			if (game.hasPlayer(target => lib.skill.cuijue.filterTarget("SB", player, target))) {
				return ui.selected.targets.length > 0;
			}
			return true;
		},
		position: "he",
		complexTarget: true,
		check: card => {
			var player = _status.event.player,
				goon = 0;
			try {
				ui.selected.cards.add(card);
				if (
					game.hasPlayer(target => {
						return lib.skill.cuijue.filterTarget("SB", player, target);
					})
				) {
					goon = 6;
				}
			} catch (e) {
				console.trace(e);
			}
			ui.selected.cards.remove(card);
			return goon - get.value(card);
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (target) {
				player.addTempSkill("cuijue_used", "phaseUseAfter");
				player.markAuto("cuijue_used", [target]);
				target.damage("nocard");
			}
		},
		ai: {
			order: 2,
			result: {
				target: -1.5,
			},
			tag: {
				damage: 1,
			},
		},
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	//神邓艾
	dctuoyu: {
		audio: 2,
		trigger: { player: ["phaseUseBegin", "phaseUseEnd"] },
		filter(event, player) {
			return player.countCards("h") > 0 && player.getStorage("dctuoyu").length > 0;
		},
		forced: true,
		async content(event, trigger, player) {
			var hs = player.getCards("h"),
				tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
			var storage = player.getStorage("dctuoyu");
			var list = [
				["未分配手牌", []],
				[get.translation(tags[0] + "_tag") + '<div class="text center">伤害/回复值+1</div>', []],
				[get.translation(tags[1] + "_tag") + '<div class="text center">无次数和距离限制</div>', []],
				[get.translation(tags[2] + "_tag") + '<div class="text center">不可被响应</div>', []],
			];
			for (var card of hs) {
				var added = false;
				for (var i = 0; i < tags.length; i++) {
					if (card.hasGaintag(tags[i] + "_tag")) {
						added = true;
						list[i + 1][1].push(card);
						break;
					}
				}
				if (!added) {
					list[0][1].push(card);
				}
			}
			for (var i = 0; i < tags.length; i++) {
				if (!storage.includes(tags[i])) {
					list[i + 1][0] = get.translation(tags[i] + "_tag") + '<div class="text center">尚未激活</div>';
				}
			}
			list = [list[0], list.slice(1)];
			var next = player.chooseToMove_new("拓域：请分配你的手牌", true);
			next.set("list", list);
			next.set("filterMove", function (from, to, moved) {
				var player = _status.event.player;
				var storage = player.getStorage("dctuoyu"),
					tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
				if (typeof to == "number") {
					if (to == 0) {
						return true;
					}
					return storage.includes(tags[to - 1]) && moved[to].length < 5;
				}
				return true;
			});
			next.set("processAI", function () {
				var player = _status.event.player;
				var storage = player.getStorage("dctuoyu"),
					tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
				var moved = [[], [], [], []];
				var isEmpty = function (to) {
					return storage.includes(tags[to - 1]) && moved[to].length < 5;
				};
				var hs = player.getCards("h");
				var hs2 = hs.slice(0);
				var usable = player.getCardUsable("sha");
				var addTo = function (card, to) {
					if (isEmpty(to)) {
						hs2.remove(card);
						moved[to].push(card);
						if (get.name(card) == "sha" && to != 2) {
							usable--;
						}
					}
				};
				var hasRuanshizi = game.hasPlayer(function (target) {
					return target != player && player.canUse("sha", target, null, true) && !target.mayHaveShan(player, "use") && get.attitude(player, target) < 0 && get.effect(target, { name: "sha" }, player, player) > 0;
				});
				for (var card of hs) {
					var name = get.name(card);
					if (name == "tao" || name == "jiu") {
						addTo(card, 1);
					} else if (name == "sha") {
						if (hasRuanshizi && isEmpty(1) && usable > 0) {
							addTo(card, 1);
						} else if (isEmpty(3) && usable > 0) {
							addTo(card, 3);
						} else {
							addTo(card, 2);
						}
					} else if (get.type(name) == "trick") {
						if (isEmpty(1) && get.tag(card, "damage") > 0 && player.hasUseTarget(card)) {
							addTo(card, 1);
						} else {
							addTo(card, 3);
						}
					}
				}
				moved[0].addArray(hs2);
				return moved;
			});
			var result = await next.forResult();
			if (result.bool) {
				game.broadcastAll(
					function (moved, player) {
						if (player == game.me) {
							const cards = moved.flat(1).reverse();
							game.addVideo("lose", game.me, [get.cardsInfo(cards), [], [], []]);
							for (var i = 0; i < cards.length; i++) {
								cards[i].goto(ui.special);
							}
							game.me.directgain(cards, false);
						}
						var tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
						var map = {};
						for (var i = 0; i < moved.length; i++) {
							for (var card of moved[i]) {
								for (var j = 0; j < tags.length; j++) {
									const tag = `${tags[j]}_tag`;
									const glowClass = `dctuoyu-${tags[j].replace("dctuoyu_", "")}-glow`;
									if (!map[tag]) {
										map[tag] = [[], []];
									}
									if (i == j + 1) {
										map[tag][0].add(card);
										if (!card.hasGaintag(tag)) {
											card.addGaintag(tag);
											card.classList.add(glowClass);
										}
									} else {
										if (card.hasGaintag(tag)) {
											map[tag][1].add(card);
											card.removeGaintag(tag);
											card.classList.remove(glowClass);
										}
									}
								}
							}
						}
						for (const tag in map) {
							if (map[tag][0].length) {
								game.addVideo("addGaintag", player, [get.cardsInfo(map[tag][0]), tag]);
								for (const card of map[tag][0]) {
									const glowClass = `dctuoyu-${tag.replace("_tag", "").replace("dctuoyu_", "")}-glow`;
									card.classList.add(glowClass);
								}
								game.addVideo("skill", player, ["dctuoyu", [true, get.cardsInfo(map[tag][0]), tag]]);
							}
							if (map[tag][1].length) {
								game.addVideo("removeGaintag", player, [tag, get.cardsInfo(map[tag][1])]);
								for (const card of map[tag][1]) {
									const glowClass = `dctuoyu-${tag.replace("_tag", "").replace("dctuoyu_", "")}-glow`;
									card.classList.remove(glowClass);
								}
								game.addVideo("skill", player, ["dctuoyu", [false, get.cardsInfo(map[tag][1]), tag]]);
							}
						}
						game.addVideo("delay", null, 1);
					},
					result.moved,
					player
				);
			}
		},
		video(player, info) {
			const glowClass = `dctuoyu-${info[2].replace("_tag", "").replace("dctuoyu_", "")}-glow`;
			for (const cardid of info[1]) {
				for (const card of player.getCards("h")) {
					if (card.cardid === cardid[4]) {
						card.classList[info[0] ? "add" : "remove"](glowClass);
					}
				}
			}
		},
		init(player) {
			game.broadcastAll(player => {
				const observer = new MutationObserver(mutationsList => {
					const tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
					for (const mutation of mutationsList) {
						if (mutation.type === "childList") {
							for (const card of mutation.addedNodes) {
								if (card.nodeType === Node.ELEMENT_NODE && get.itemtype(card) === "card") {
									for (let i = 0; i < tags.length; i++) {
										const glowClass = `dctuoyu-${tags[i].replace("dctuoyu_", "")}-glow`;
										if (card.hasGaintag(tags[i] + "_tag") && !card.classList.contains(glowClass)) {
											//添加样式+录像
											game.broadcastAll(
												(card, glowClass, tag) => {
													card.classList.add(glowClass);
													game.addVideo("skill", player, ["dctuoyu", [true, [get.cardInfo(card)], tag]]);
												},
												card,
												glowClass,
												tags[i]
											);
										}
									}
								}
							}
							for (const card of mutation.removedNodes) {
								if (card.nodeType === Node.ELEMENT_NODE && get.itemtype(card) === "card") {
									for (let i = 0; i < tags.length; i++) {
										const glowClass = `dctuoyu-${tags[i].replace("dctuoyu_", "")}-glow`;
										if (card.classList.contains(glowClass)) {
											//移除样式+录像
											game.broadcastAll(
												(card, glowClass, tag) => {
													card.classList.remove(glowClass);
													game.addVideo("skill", player, ["dctuoyu", [false, [get.cardInfo(card)], tag]]);
												},
												card,
												glowClass,
												tags[i]
											);
										}
									}
								}
							}
						}
					}
				});
				const config = { childList: true };
				observer.observe(player.node.handcards1, config);
				observer.observe(player.node.handcards2, config);
				player._dctuoyu_observer = observer;
			}, player);
		},
		onremove(player) {
			game.broadcastAll(player => {
				if (player._dctuoyu_observer) {
					player._dctuoyu_observer.disconnect();
					delete player._dctuoyu_observer;
				}
				const tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
				for (const card of player.getCards("h")) {
					for (let i = 0; i < tags.length; i++) {
						const tag = tags[i] + "_tag";
						if (card.hasGaintag(tag)) {
							//移除标记+录像
							card.removeGaintag(tag);
							game.addVideo("removeGaintag", player, [tag, [get.cardInfo(card)]]);
							const glowClass = `dctuoyu-${tags[i].replace("dctuoyu_", "")}-glow`;
							//移除样式+录像
							card.classList.add(glowClass);
							game.addVideo("skill", player, ["dctuoyu", [true, [get.cardInfo(card)], tags[i]]]);
						}
					}
				}
			}, player);
		},
		intro: { content: "已激活的副区域：$" },
		group: "dctuoyu_effect",
		subSkill: {
			effect: {
				mod: {
					targetInRange(card, player, target) {
						if (get.suit(card) == "unsure") {
							return true;
						}
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("dctuoyu_qingqu_tag")) {
								return true;
							}
						}
					},
					cardUsable(card, player, num) {
						if (get.suit(card) == "unsure") {
							return Infinity;
						}
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("dctuoyu_qingqu_tag")) {
								return Infinity;
							}
						}
					},
				},
				audio: "dctuoyu",
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					return player.hasHistory("lose", evt => {
						const evtx = evt.relatedEvent || evt.getParent();
						if (evtx !== event) {
							return false;
						}
						return Object.values(evt.gaintag_map).flat().containsSome("dctuoyu_fengtian_tag", "dctuoyu_qingqu_tag", "dctuoyu_junshan_tag");
					});
				},
				async content(event, trigger, player) {
					const tags = ["dctuoyu_fengtian_tag", "dctuoyu_qingqu_tag", "dctuoyu_junshan_tag"];
					player.hasHistory("lose", evt => {
						const evtx = evt.relatedEvent || evt.getParent();
						if (evtx != trigger) {
							return false;
						}
						for (const i in evt.gaintag_map) {
							tags.removeArray(evt.gaintag_map[i]);
						}
						return tags.length == 0;
					});
					const card = trigger.card;
					if (!tags.includes("dctuoyu_fengtian_tag")) {
						if (get.tag(card, "damage") > 0 || get.tag(card, "recover") > 0) {
							trigger.baseDamage++;
							game.log(card, "的伤害值/回复值+1");
						}
					}
					if (!tags.includes("dctuoyu_qingqu_tag")) {
						if (trigger.addCount !== false) {
							trigger.addCount = false;
							let stat = player.getStat("card");
							if (stat[card.name] && stat[card.name] > 0) {
								stat[card.name]--;
							}
							game.log(card, "不计入次数限制");
						}
					}
					if (!tags.includes("dctuoyu_junshan_tag")) {
						game.log(card, "不可被响应");
						trigger.directHit.addArray(game.filterPlayer());
					}
				},
			},
		},
		ai: { combo: "dcxianjin" },
	},
	dcxianjin: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player, name) {
			let history = game.getAllGlobalHistory("everything", evt => {
				if (evt.name !== "damage" || !evt.player.getAllHistory("damage").includes(evt)) {
					//这里是为了筛选掉被防止和取消的伤害事件
					return false;
				}
				return evt.player === player || evt.source === player;
			});
			history = history
				.map(evt => {
					let list = [];
					if (evt.source === player) {
						list.push([evt, "damageSource"]);
					}
					if (evt.player === player) {
						list.push([evt, "damageEnd"]);
					}
					return list;
				})
				.flat();
			let list = history.find(lit => lit[0] === event && lit[1] === name);
			return list && history.indexOf(list) % 2 === 1;
		},
		forced: true,
		async content(event, trigger, player) {
			let tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
			tags.removeArray(player.getStorage("dctuoyu"));
			if (tags.length > 0) {
				const control =
					tags.length === 1
						? tags[0]
						: (
								await player
									.chooseControl(tags)
									.set(
										"choiceList",
										tags.map(tag => {
											return `${get.translation(`${tag}_tag`)}：${
												{
													dctuoyu_fengtian: "伤害/回复值+1",
													dctuoyu_qingqu: "无次数和距离限制",
													dctuoyu_junshan: "不可被响应",
												}[tag]
											}`;
										})
									)
									.set("displayIndex", false)
									.set("prompt", "险峻：选择激活一个副区域标签")
									.forResult()
							).control;
				game.log(player, "激活了副区域", "#y" + get.translation(control));
				player.markAuto("dctuoyu", [control]);
				player.popup(get.translation(control + "_tag"));
			}
			await player.draw(player.isMaxHandcard() ? 1 : player.getStorage("dctuoyu").length);
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (!get.tag(card, "damage") || player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					let history = game.getAllGlobalHistory("everything", evt => {
						if (evt.name !== "damage" || !evt.player.getAllHistory("damage").includes(evt)) {
							//这里是为了筛选掉被防止和取消的伤害事件
							return false;
						}
						return evt.player === player || evt.source === player;
					});
					if (
						history.reduce((sum, evt) => {
							if (evt.source === player) {
								sum++;
							}
							if (evt.player === player) {
								sum++;
							}
							return sum;
						}, 0) %
							2 ===
						0
					) {
						return;
					}
					if (player.isMaxHandcard()) {
						return [1, 1];
					}
					return [1, Math.min(3, 1 + player.getStorage("dctuoyu").length)];
				},
			},
		},
	},
	dcqijing: {
		derivation: "dccuixin",
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return player.getStorage("dctuoyu").length == 3;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "orange",
		seatRelated: "changeSeat",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.addSkills("dccuixin");
			if (game.countPlayer() > 2) {
				if (player == trigger.player && !trigger.skill) {
					var evt = trigger.getParent();
					if (evt.name == "phaseLoop" && evt._isStandardLoop) {
						evt.player = player.previous;
						_status.lastPhasedPlayer = player.next;
					}
				}
				var result = await player
					.chooseTarget(
						"请选择一名要更换座次的角色，将自己移动到该角色的上家位置",
						function (card, player, target) {
							return target != player && target != player.next;
						},
						true
					)
					.set("ai", function (target) {
						var player = _status.event.player;
						var current = _status.currentPhase?.next;
						var max = 20,
							att = 0;
						while (max > 0) {
							max--;
							if (current == target) {
								return att;
							}
							att -= get.attitude(player, current);
							current = current.next;
						}
						return att;
					})
					.forResult();
				if (result.bool) {
					var target = result.targets[0];
					game.broadcastAll(
						function (target1, target2) {
							game.swapSeat(target1, target2, null, true);
						},
						player,
						target
					);
				}
			}
			player.insertPhase();
		},
		ai: {
			combo: "dctuoyu",
		},
	},
	dccuixin: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!event._dccuixin || get.type(event.card, null, false) == "delay" || get.type(event.card, null, false) == "equip") {
				return false;
			}
			var card = {
					name: event.card.name,
					nature: event.card.nature,
					isCard: true,
				},
				list = event._dccuixin;
			for (var target of list) {
				var targetx = player[target]();
				if (lib.filter.targetEnabled2(card, targetx, player)) {
					return true;
				}
			}
			return false;
		},
		direct: true,
		async content(event, trigger, player) {
			const card = {
				name: trigger.card.name,
				nature: trigger.card.nature,
				isCard: true,
			};
			event.card = card;

			const targets = trigger._dccuixin.map(target => player[target]()).filter(target => lib.filter.targetEnabled2(card, target, player));
			let result;
			if (targets.length == 1) {
				event.target = targets[0];
				result = await player
					.chooseBool("摧心：是否视为对" + get.translation(event.target) + "使用" + get.translation(card) + "？")
					.set("goon", get.effect(event.target, card, player, player) > 0)
					.set("ai", () => get.event().goon)
					.forResult();
			} else {
				result = await player
					.chooseTarget("摧心：是否视为对上家或下家使用" + get.translation(card) + "？", "操作提示：从上家或下家中选择一名角色作为使用目标", (card, player, target) => {
						return (target == player.getNext() || target == player.getPrevious()) && lib.filter.targetEnabled2(event.card, target, player);
					})
					.set("ai", target => {
						const player = get.player();
						return get.effect(target, event.card, player, player);
					})
					.forResult();
			}
			if (result.bool) {
				const target = event.target || result.targets;
				player.useCard(card, target, false, "dccuixin");
			}
		},
		group: "dccuixin_silent",
		subSkill: {
			silent: {
				trigger: { player: "useCardToPlayered" },
				silent: true,
				forced: true,
				popup: false,
				firstDo: true,
				charlotte: true,
				filter(event, player) {
					if (!event.isFirstTarget || event.getParent().skill == "dccuixin") {
						return false;
					}
					if (event.targets.length == 0) {
						return false;
					}
					return event.targets.includes(player.getNext()) || event.targets.includes(player.getPrevious());
				},
				async content(event, trigger, player) {
					var list = [];
					if (trigger.targets.includes(player.getNext())) {
						list.push("getPrevious");
					}
					if (trigger.targets.includes(player.getPrevious())) {
						list.push("getNext");
					}
					trigger.getParent()._dccuixin = list;
				},
			},
		},
	},
	//海外神吕蒙
	twshelie: {
		audio: "shelie",
		inherit: "shelie",
		prompt2: () => lib.translate.shelie_info,
		group: "twshelie_jingce",
		//什么精策技能啊喂！
		subSkill: {
			round: { charlotte: true },
			count: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount(storage) {
						return storage.length;
					},
					content: "本回合已使用$花色的牌",
				},
			},
			jingce: {
				audio: "shelie",
				trigger: { player: ["phaseJieshuBegin", "useCard1"] },
				filter(event, player) {
					if (player.hasSkill("twshelie_round") || player != _status.currentPhase) {
						return false;
					}
					var list = [];
					player.getHistory("useCard", function (evt) {
						if (lib.suit.includes(get.suit(evt.card)) && !list.includes(get.suit(evt.card))) {
							list.push(get.suit(evt.card));
						}
					});
					if (list.length) {
						player.addTempSkill("twshelie_count");
						player.storage.twshelie_count = list.sort(function (a, b) {
							return lib.suit.indexOf(b) - lib.suit.indexOf(a);
						});
						player.markSkill("twshelie_count");
						player.syncStorage("twshelie_count");
					}
					return event.name != "useCard" && list.length >= 4;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addTempSkill("twshelie_round", "roundStart");
					let result;
					if (typeof player.storage.twshelie == "number") {
						result = { index: player.storage.twshelie };
					} else {
						result = await player.chooseControl("摸牌阶段", "出牌阶段").set("prompt", "涉猎：请选择要执行的额外阶段").forResult();
					}
					player.setStorage("twshelie", 1 - result.index);
					const evt = trigger.getParent("phase", true, true);
					if (result.index == 0) {
						if (evt?.phaseList) {
							evt.phaseList.splice(evt.num + 1, 0, "phaseDraw|twshelie");
						}
					}
					if (result.index == 1) {
						if (evt?.phaseList) {
							evt.phaseList.splice(evt.num + 1, 0, "phaseUse|twshelie");
						}
					}
				},
			},
		},
	},
	twgongxin: {
		audio: "gongxin",
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h");
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		usable: 1,
		async content(event, trigger, player) {
			const { target } = event;
			const cards = target.getCards("h");
			const num = cards.reduce(function (arr, card) {
				arr.add(get.suit(card, player));
				return arr;
			}, []).length;
			const result = await player
				.chooseToMove_new("攻心")
				.set("list", [
					[get.translation(target) + "的手牌", cards],
					[["弃置"], ["置于牌堆顶"]],
				])
				.set("filterOk", moved => {
					return moved[1].slice().concat(moved[2]).length == 1;
				})
				.set("processAI", list => {
					let card = list[0][1].slice().sort((a, b) => {
						return get.value(b) - get.value(a);
					})[0];
					if (!card) {
						return false;
					}
					return [list[0][1].slice().remove(card), [card], []];
				})
				.forResult();
			if (result.bool) {
				if (result.moved[1].length) {
					await target.modedDiscard(result.moved[1]);
				} else {
					await player.showCards(result.moved[2], get.translation(player) + "对" + get.translation(target) + "发动了【攻心】");
					await target.lose(result.moved[2], ui.cardPile, "visible", "insert");
				}
				if (
					num >
					target.getCards("h").reduce(function (arr, card) {
						arr.add(get.suit(card, target));
						return arr;
					}, []).length
				) {
					player.line(target);
					player.addTempSkill("twgongxin3", { player: ["twgongxin3After", "phaseAfter"] });
					player.markAuto("twgongxin3", [target]);
				}
			}
		},
		ai: {
			order: 10,
			expose: 0.25,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
		},
	},
	twgongxin2: {
		mod: {
			cardEnabled2(card, player) {
				const color = get.color(card);
				if (color != "unsure" && player.getStorage("twgongxin2").includes(color)) {
					return false;
				}
			},
		},
		charlotte: true,
		onremove: true,
		intro: { content: "本回合内不能使用或打出$牌" },
	},
	twgongxin3: {
		charlotte: true,
		onremove: true,
		intro: { content: "$不可响应你本回合使用的下一张牌" },
		trigger: { player: "useCard" },
		forced: true,
		popup: false,
		sourceSkill: "twgongxin",
		async content(event, trigger, player) {
			await game.delayx();
			const targets = player.getStorage("twgongxin3");
			player.line(targets, "fire");
			trigger.directHit.addArray(targets);
		},
	},
	//神张角
	yizhao: {
		audio: 2,
		trigger: {
			player: ["useCard", "respond"],
		},
		forced: true,
		filter(event, player) {
			const number = get.number(event.card);
			return typeof number == "number" && number > 0;
		},
		marktext: "黄",
		intro: {
			name: "黄(异兆/肆军)",
			name2: "黄",
			content: "mark",
			markcount(storage, player) {
				return (storage || 0).toString().slice(-2);
			},
		},
		async content(event, trigger, player) {
			event.num = player.countMark("yizhao");
			player.addMark("yizhao", get.number(trigger.card));
			const num = Math.floor(event.num / 10) % 10;
			const num2 = Math.floor(player.countMark("yizhao") / 10) % 10;
			if (num != num2) {
				const card = get.cardPile2(card => {
					return get.number(card, false) == num2;
				});
				if (card) {
					await player.gain(card, "gain2");
				}
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (Math.floor((get.number(card) + (player.countMark("yizhao") % 10)) / 10) == 1) {
					return num + 10;
				}
			},
		},
		ai: {
			threaten: 1.5,
			effect: {
				target_use(card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
						return [1, 0.1];
					}
				},
			},
		},
	},
	sijun: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countMark("yizhao") > ui.cardPile.childNodes.length;
		},
		check(event, player) {
			return ui.cardPile.childNodes.length;
		},
		async content(event, trigger, player) {
			player.removeMark("yizhao", player.countMark("yizhao"));
			await game.washCard();
			const pile = Array.from(ui.cardPile.childNodes);
			if (pile.length < 3) {
				return;
			}
			const max = Math.pow(2, Math.min(100, pile.length));
			let bool = false;
			let index;
			for (let i = 0; i < max; i++) {
				let num = 0;
				index = i.toString(2);
				while (index.length < pile.length) {
					index = "0" + index;
				}
				for (var k = 0; k < index.length; k++) {
					if (index[k] == "1") {
						num += get.number(pile[k]);
					}
					if (num > 36) {
						break;
					}
				}
				if (num == 36) {
					bool = true;
					break;
				}
			}
			if (bool) {
				const cards = [];
				for (let i = 0; i < index.length; i++) {
					if (index[i] == "1") {
						cards.push(pile[i]);
					}
				}
				await player.gain(cards, "gain2");
			}
		},
		ai: {
			combo: "yizhao",
		},
	},
	sanshou: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		check(event, player) {
			return get.damageEffect(player, event.source, player, event.nature) <= 0;
		},
		async content(event, trigger, player) {
			const cards = game.cardsGotoOrdering(get.cards(3)).cards;
			event.cards = cards;
			await player.showCards(cards, get.translation(player) + "发动了【三首】");

			const types = [];
			types.addArray(game.getGlobalHistory("useCard").map(evt => get.type2(evt.card)));
			if (cards.filter(card => !types.includes(get.type2(card))).length) {
				trigger.cancel();
			}
			await game.delayx();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name == "shandian" || card.name == "fulei") {
						return [0, 0.1];
					}
					if (!get.tag(card, "damage")) {
						return;
					}
					var types = [],
						bool = 0;
					types.addArray(game.getGlobalHistory("useCard").map(evt => get.type2(evt.card)));
					if (!types.includes(get.type2(card))) {
						bool = 1;
					}
					if (types.length < 2) {
						return Math.min(1, 0.4 + (types.length + bool) * 0.2);
					}
				},
			},
		},
	},
	tianjie: {
		audio: 3,
		trigger: { global: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return game.hasGlobalHistory("cardMove", evt => evt.washCard) && game.hasPlayer(current => current != player);
		},
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			const next = player.chooseTarget(get.prompt("tianjie"), "选择至多三名其他角色，依次对这些角色造成X点雷电伤害（X为其手牌中【闪】的数量，至少为1）", [1, 3], lib.filter.notMe);
			next.set("ai", target => {
				const player = get.player();
				return get.damageEffect(target, player, player, "thunder") * Math.sqrt(Math.max(1, target.countCards("h", "shan")));
			});

			const result = await next.forResult();
			if (result.bool && result.targets?.length) {
				const targets = result.targets;
				targets.sortBySeat();
				player.logSkill("tianjie", targets);

				const events = [];
				for (const target of targets) {
					const num = Math.max(1, target.countCards("h", "shan"));
					const next = target.damage(num, "thunder");
					events.push(next);
				}

				await Promise.all(events);
			}
		},
	},
	shencai: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.countMark("shencai");
		},
		filterTarget: lib.filter.notMe,
		onremove: true,
		prompt: "选择一名其他角色进行地狱审判",
		async content(event, trigger, player) {
			const { target } = event;

			const next = target.judge();
			next.callback = lib.skill.shencai.contentx;
			await next;
		},
		ai: {
			order: 8,
			result: { target: -1 },
		},
		async contentx(event) {
			const { card } = event.judgeResult;
			const { player, target } = event.getParent(2);
			if (get.position(card, true) == "o") {
				await player.gain(card, "gain2");
			}

			const list = [];
			const str = get.cardDescription(card, player);
			for (const name in lib.skill.shencai.filterx) {
				if (str.indexOf(lib.skill.shencai.filterx[name]) != -1) {
					list.push("shencai_" + name);
				}
			}
			if (list.length) {
				for (const name in lib.skill.shencai.filterx) {
					var num = target.countMark("shencai_" + name);
					if (num > 0) {
						target.removeMark("shencai_" + name, num);
						target.removeSkill("shencai_" + name);
					}
				}
				if (target.isIn()) {
					for (const name of list) {
						target.addSkill(name);
						target.addMark(name, 1);
					}
				}
			} else if (target.isIn()) {
				await player.gainPlayerCard(target, true, "hej");
				target.addMark("shencai_death", 1);
				target.addSkill("shencai_death");
			}
		},
		filterx: {
			losehp: "体力",
			weapon: "武器",
			respond: "打出",
			distance: "距离",
		},
		getStr(node) {
			var str = "",
				name = node.name;
			if (lib.translate[name + "_info"]) {
				if (lib.card[name].type && lib.translate[lib.card[name].type]) {
					str += "" + get.translation(lib.card[name].type) + "牌|";
				}
				if (get.subtype(name)) {
					str += "" + get.translation(get.subtype(name)) + "|";
				}
				if (lib.card[name] && lib.card[name].addinfomenu) {
					str += "" + lib.card[name].addinfomenu + "|";
				}
				if (get.subtype(name) == "equip1") {
					var added = false;
					if (lib.card[node.name] && lib.card[node.name].distance) {
						var dist = lib.card[node.name].distance;
						if (dist.attackFrom) {
							added = true;
							str += "攻击范围：" + (-dist.attackFrom + 1) + "|";
						}
					}
					if (!added) {
						str += "攻击范围：1|";
					}
				}
			}
			if (lib.card[name].cardPrompt) {
				str += "" + lib.card[name].cardPrompt(node) + "|";
			} else if (lib.translate[name + "_info"]) {
				str += "" + lib.translate[name + "_info"] + "|";
			}
			if (lib.translate[name + "_append"]) {
				str += "" + lib.translate[name + "_append"] + "|";
			}
			if (get.is.yingbianConditional(node)) {
				const yingbianEffects = get.yingbianEffects(node);
				if (!yingbianEffects.length) {
					const defaultYingbianEffect = get.defaultYingbianEffect(node);
					if (lib.yingbian.prompt.has(defaultYingbianEffect)) {
						yingbianEffects.push(defaultYingbianEffect);
					}
				}
				if (yingbianEffects.length) {
					str += `应变：${yingbianEffects.map(value => lib.yingbian.prompt.get(value)).join("；")}|`;
				}
			}
			return str;
		},
		subSkill: {
			losehp: {
				charlotte: true,
				marktext: "笞",
				trigger: { player: "damageEnd" },
				forced: true,
				async content(event, trigger, player) {
					await player.loseHp(trigger.num);
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage") && current < 0 && !target._shencai_losehp_effect) {
								target._shencai_losehp_effect = true;
								let eff = get.effect(target, { name: "losehp" }, target, target) / 10;
								delete target._shencai_losehp_effect;
								return [1, eff];
							}
						},
					},
				},
				intro: {
					name: "神裁 - 体力",
					name2: "笞",
					content: "锁定技。当你受到伤害后，你失去等量的体力。",
					onunmark: true,
				},
			},
			weapon: {
				charlotte: true,
				marktext: "杖",
				trigger: { target: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					trigger.directHit.add(player);
					game.log(player, "不可响应", trigger.card);
				},
				intro: {
					name: "神裁 - 武器",
					name2: "杖",
					content: "锁定技。当你成为【杀】的目标后，你不能使用牌响应此【杀】。",
					onunmark: true,
				},
				global: "shencai_weapon_ai",
			},
			ai: {
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!arg || !arg.card || arg.card.name != "sha") {
							return false;
						}
						if (!arg.target || !arg.target.hasSkill("shencai_weapon")) {
							return false;
						}
						return true;
					},
				},
			},
			respond: {
				charlotte: true,
				marktext: "徒",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				filter(event, player) {
					if (
						!player.hasCard(function (card) {
							return lib.filter.cardDiscardable(card, player, "shencai_respond");
						}, "h")
					) {
						return false;
					}
					var evt = event.getParent("shencai_respond");
					if (evt && evt.player == player) {
						return false;
					}
					evt = event.getl(player);
					return evt && evt.hs && evt.hs.length > 0;
				},
				async content(event, trigger, player) {
					const cards = player.getCards("h", card => {
						return lib.filter.cardDiscardable(card, player, "shencai_respond");
					});
					if (cards.length > 0) {
						await player.discard(cards.randomGet());
					}
				},
				intro: {
					name: "神裁 - 打出",
					name2: "徒",
					content: "锁定技。当你失去手牌后，你随机弃置一张手牌（不嵌套触发）。",
					onunmark: true,
				},
			},
			distance: {
				charlotte: true,
				marktext: "流",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				async content(event, trigger, player) {
					await player.turnOver();
				},
				intro: {
					name: "神裁 - 距离",
					name2: "流",
					content: "锁定技。结束阶段开始时，你翻面。",
					onunmark: true,
				},
			},
			death: {
				charlotte: true,
				marktext: "死",
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("shencai_death");
					},
				},
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.countMark("shencai_death") > game.countPlayer();
				},
				async content(event, trigger, player) {
					await player.die();
				},
				intro: {
					name: "神裁 - 死",
					name2: "死",
					content: "锁定技。你的角色手牌上限-#；回合结束时，若场上存活人数小于#，则你死亡。",
					onunmark: true,
				},
			},
		},
		mark: true,
		intro: {
			markcount: (storage = 0) => storage + 1,
			content: (storage = 0) => "当前最大发动次数：" + (storage + 1),
		},
	},
	xunshi: {
		audio: 2,
		mod: {
			cardname(card) {
				if (lib.skill.xunshi.isXunshi(card)) {
					return "sha";
				}
			},
			cardnature(card) {
				if (lib.skill.xunshi.isXunshi(card)) {
					return false;
				}
			},
			suit(card) {
				if (lib.skill.xunshi.isXunshi(card)) {
					return "none";
				}
			},
			targetInRange(card) {
				const suit = get.color(card);
				if (suit == "none" || suit == "unsure") {
					return true;
				}
			},
			cardUsable(card) {
				const suit = get.color(card);
				if (suit == "none" || suit == "unsure") {
					return Infinity;
				}
			},
		},
		isXunshi(card) {
			var info = lib.card[card.name];
			if (!info || (info.type != "trick" && info.type != "delay")) {
				return false;
			}
			if (info.notarget) {
				return false;
			}
			if (info.selectTarget != undefined) {
				if (Array.isArray(info.selectTarget)) {
					if (info.selectTarget[0] < 0) {
						return !info.toself;
					}
					return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
				} else {
					if (info.selectTarget < 0) {
						return !info.toself;
					}
					return info.selectTarget != 1;
				}
			}
			return false;
		},
		trigger: { player: "useCard2" },
		forced: true,
		filter(event, player) {
			return get.color(event.card, player) == "none";
		},
		async content(event, trigger, player) {
			if (player.countMark("shencai") < 4 && player.hasSkill("shencai", null, null, false)) {
				player.addMark("shencai", 1, false);
			}

			if (trigger.addCount !== false) {
				trigger.addCount = false;
				const stat = player.getStat().card;
				const name = trigger.card.name;
				if (typeof stat[name] == "number") {
					stat[name]--;
				}
			}

			const info = get.info(trigger.card);
			if (info.allowMultiple == false) {
				return;
			}
			
			if (!trigger.targets || info.multitarget) {
				return;
			}
				
			if (!game.hasPlayer(current => !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current))) {
				return;
			}

			const prompt2 = "为" + get.translation(trigger.card) + "增加任意个目标";
			const result = await player
				.chooseTarget(
					get.prompt("xunshi"),
					(card, _player, target) => {
						const player = get.player();
						return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
					},
					[1, Infinity]
				)
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player);
				})
				.set("card", trigger.card)
				.set("targets", trigger.targets)
				.forResult();
			
			if (!result.bool || !result.targets?.length) {
				return;
			}
			if (!event.isMine() && !event.isOnline()) {
				await game.delayx();
			}
			player.line(result.targets, "fire");
			trigger.targets.addArray(result.targets);
		},
	},
	twwushen: {
		mod: {
			cardname(card, player, name) {
				if (get.suit(card) == "heart") {
					return "sha";
				}
			},
			cardnature(card, player) {
				if (get.suit(card) == "heart") {
					return false;
				}
			},
			targetInRange(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return true;
					}
				}
			},
			cardUsable(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return Infinity;
					}
				}
			},
		},
		audio: "wushen",
		trigger: { player: "useCard2" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && (get.suit(event.card) == "heart" || !player.hasSkill("twwushen_phase", null, null, false));
		},
		logTarget(event, player) {
			if (get.suit(event.card) == "heart") {
				var targets = game.filterPlayer(function (current) {
					return !event.targets.includes(current) && current.hasMark("twwuhun") && lib.filter.targetEnabled(event.card, player, current);
				});
				if (targets.length) {
					return targets.sortBySeat();
				}
			}
			return null;
		},
		async content(event, trigger, player) {
			if (!player.hasSkill("twwushen_phase", null, null, false)) {
				trigger.directHit.addArray(game.players);
				player.addTempSkill("twwushen_phase", ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]);
			}
			if (get.suit(trigger.card) == "heart") {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					if (player.stat[player.stat.length - 1].card.sha > 0) {
						player.stat[player.stat.length - 1].card.sha--;
					}
				}
				const targets = game.filterPlayer(current => {
					return !trigger.targets.includes(current) && current.hasMark("twwuhun") && (lib.filter.targetEnabled(trigger.card, player, current) ?? false);
				});
				if (targets.length) {
					trigger.targets.addArray(targets.sortBySeat());
					game.log(targets, "也成为了", trigger.card, "的目标");
				}
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.card.name == "sha" && !player.hasSkill("twwushen_phase", null, null, false);
			},
		},
		subSkill: { phase: { charlotte: true } },
	},
	twwuhun: {
		audio: 2,
		trigger: { player: "die" },
		forceDie: true,
		skillAnimation: true,
		animationColor: "soil",
		locked: true,
		check(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.hasMark("twwuhun") && get.attitude(player, current) < 0;
			});
		},
		async content(event, trigger, player) {
			const judge = player.judge(card => {
				const name = get.name(card, false);
				return (name === " tao" || name === "taoyuan") ? -25 : 15;
			});
			judge.set("forceDie", true);
			judge.set("judge2", result => result.bool);

			const judgeResult = await judge.forResult();
			if (!judgeResult.bool) {
				return;
			}

			const num = game.countPlayer(current => current !== player && current.hasMark("twwuhun"));
			if (num === 0) {
				return;
			}

			const prompt = "请选择【武魂】的目标";
			const prompt2 = "选择至少一名拥有“梦魇”标记的角色。令这些角色各自失去X点体力（X为其“梦魇”标记数）";
			const next = player.chooseTarget(prompt, prompt2, [1, num], true);
			next.set("filterTarget", (card, _player, target) => target !== player && target.hasMark("twwuhun"));
			next.set("forceDie", true);
			next.set("ai", target => -get.attitude(get.player(), target));

			const result = await next.forResult();
			if (!result.targets?.length) {
				return;
			}

			const targets = result.targets.sortBySeat();
			player.line(targets);

			for (const target of targets) {
				const num = target.countMark("twwuhun");
				if (num > 0) {
					await target.loseHp(num);
				}
			}
		},
		marktext: "魇",
		intro: {
			name: "梦魇",
			content: "mark",
			onunmark: true,
		},
		group: "twwuhun_gain",
		subSkill: {
			gain: {
				audio: "twwuhun",
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				forced: true,
				filter(event, player, name) {
					if (event.player == event.source) {
						return false;
					}
					var target = lib.skill.twwuhun_gain.logTarget(event, player);
					if (!target || !target.isIn()) {
						return false;
					}
					return name == "damageEnd" || target.hasMark("twwuhun");
				},
				logTarget(event, player) {
					if (player == event.player) {
						return event.source;
					}
					return event.player;
				},
				async content(event, trigger, player) {
					const target = lib.skill.twwuhun_gain.logTarget(trigger, player);
					target.addMark("twwuhun", player == trigger.source ? 1 : trigger.num);
					await game.delayx();
				},
			},
		},
		ai: {
			notemp: true,
			maixie_defend: true,
			effect: {
				target: (card, player, target) => {
					if (!get.tag(card, "damage") || !target.hasFriend()) {
						return;
					}
					let die = [],
						extra = [null, 0],
						temp;
					game.filterPlayer(i => {
						if (!i.hasMark("twwuhun")) {
							return false;
						}
						temp = get.attitude(target, i);
						if (temp < 0) {
							die.push(i);
						} else {
							temp = Math.sqrt(temp) * i.countMark("twwuhun");
							if (!extra[0] || temp < extra[1]) {
								extra = [i, temp];
							}
						}
					});
					if (extra[0] && !die.length) {
						die.push(extra[0]);
					}
					if (target.hp + target.hujia > 1 && (!die.length || get.attitude(player, target) <= 0)) {
						die.add(player);
					}
					if (die.length) {
						return [
							1,
							0,
							1,
							die.reduce((num, i) => {
								return (num -= 2 * get.sgnAttitude(player, i));
							}, 0),
						];
					}
				},
			},
		},
	},
	shouli: {
		audio: 2,
		mod: {
			cardUsable(card) {
				if (card.storage?.shouli) {
					return Infinity;
				}
			},
		},
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player != _status.currentPhase && (name == "sha" || name == "shan")) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || event.shouli || event.type == "wuxie") {
				return false;
			}
			if (
				game.hasPlayer(function (current) {
					return current.getCards("e", card => get.is.attackingMount(card)).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "sha",
							storage: { shouli: true },
						},
						"unsure"
					),
					player,
					event
				)
			) {
				return true;
			}
			if (
				game.hasPlayer(function (current) {
					return current.getCards("e", card => get.is.defendingMount(card)).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "shan",
							storage: { shouli: true },
						},
						"unsure"
					),
					player,
					event
				)
			) {
				return true;
			}
			return false;
		},
		delay: false,
		locked: false,
		filterTarget(card, player, target) {
			var event = _status.event,
				evt = event;
			if (event._backup) {
				evt = event._backup;
			}
			var equip3 = target.getCards("e", card => get.is.defendingMount(card, false));
			var equip4 = target.getCards("e", card => get.is.attackingMount(card, false));
			if (
				equip3.length &&
				equip3.some(card =>
					evt.filterCard(
						get.autoViewAs(
							{
								name: "shan",
								storage: { shouli: true },
							},
							[card]
						),
						player,
						event
					)
				)
			) {
				return true;
			}
			return equip4.some(card => {
				var sha = get.autoViewAs(
					{
						name: "sha",
						storage: { shouli: true },
					},
					[card]
				);
				if (evt.filterCard(sha, player, event)) {
					if (!evt.filterTarget) {
						return true;
					}
					return game.hasPlayer(function (current) {
						return evt.filterTarget(sha, player, current);
					});
				}
			});
		},
		prompt: "将场上的一张坐骑牌当做【杀】或【闪】使用或打出",
		async content(event, trigger, player) {
			/** @type {GameEvent} */
			// @ts-expect-error 类型必然存在
			const evt = event.getParent(2);
			evt.set("shouli", true);

			const equip3 = event.target.getCards("e", card => get.is.defendingMount(card, false));
			const equip4 = event.target.getCards("e", card => get.is.attackingMount(card, false));

			const cardsCanUse = [];
			const backupx = _status.event;
			_status.event = evt;
			try {
				if (
					equip3.length &&
					equip3.some(card => {
						var shan = get.autoViewAs(
							{
								name: "shan",
								storage: { shouli: true },
							},
							[card]
						);
						if (evt.filterCard(shan, player, event)) {
							return true;
						}
						return false;
					})
				) {
					cardsCanUse.push("shan");
				}
				if (
					equip4.length &&
					equip4.some(card => {
						var sha = get.autoViewAs(
							{
								name: "sha",
								storage: { shouli: true },
							},
							[card]
						);
						if (
							evt.filterCard(sha, player, evt) &&
							(!evt.filterTarget ||
								game.hasPlayer(current => {
									return evt.filterTarget(sha, player, current);
								}))
						) {
							return true;
						}
						return false;
					})
				) {
					cardsCanUse.push("sha");
				}
			} catch (e) {
				game.print(e);
			}
			_status.event = backupx;

			let result;
			if (cardsCanUse.length == 1) {
				event.cardName = cardsCanUse[0];
				const cards = cardsCanUse[0] == "shan" ? equip3 : equip4;
				if (cards.length == 1) {
					result = {
						bool: true,
						links: [cards[0]],
					};
				} else {
					result = await player
						.choosePlayerCard(true, event.target, "e")
						.set("filterButton", button => {
							return _status.event.cards.includes(button.link);
						})
						.set("cards", cards)
						.forResult();
				}
			} else {
				result = await player
					.choosePlayerCard(true, event.target, "e")
					.set("filterButton", button => {
						const card = button.link;
						return get.is.attackingMount(card) || get.is.defendingMount(card);
					})
					.forResult();
			}

			if (result.bool && result.links && result.links.length) {
				const name = event.cardName || (get.is.attackingMount(result.links[0]) ? "sha" : "shan");
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						function (result, name) {
							lib.skill.shouli_backup.viewAs = {
								name: name,
								cards: [result],
								storage: { shouli: true },
							};
							lib.skill.shouli_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
						},
						result.links[0],
						name
					);
					evt.set("_backupevent", "shouli_backup");
					evt.backup("shouli_backup");
					evt.set("openskilldialog", "选择" + get.translation(name) + "（" + get.translation(result.links[0]) + "）的目标");
					evt.set("norestore", true);
					evt.set("custom", {
						add: {},
						replace: { window() {} },
					});
				} else {
					delete evt.result.used;
					delete evt.result.skill;
					evt.result.card = get.autoViewAs(
						{
							name: name,
							cards: [result.links[0]],
							storage: { shouli: true },
						},
						result.links
					);
					evt.result.cards = [result.links[0]];
					event.target.$give(result.links[0], player, false);
					if (player !== event.target) {
						event.target.addTempSkill("fengyin");
					}
					event.target.addTempSkill("shouli_thunder");
					player.addTempSkill("shouli_thunder");
					evt.redo();
					return;
				}
			}
			evt.goto(0);
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var func = get.is[tag == "respondSha" ? "attackingMount" : "defendingMount"];
				return game.hasPlayer(function (current) {
					return current.hasCard(card => func(card, false), "e");
				});
			},
			order: 2,
			result: {
				player(player, target) {
					var att = Math.max(8, get.attitude(player, target));
					if (_status.event.type != "phase") {
						return 9 - att;
					}
					if (!player.hasValueTarget({ name: "sha" })) {
						return 0;
					}
					return 9 - att;
				},
			},
		},
		group: "shouli_init",
		subSkill: {
			thunder: {
				charlotte: true,
				trigger: { player: "damageBegin1" },
				forced: true,
				mark: true,
				async content(event, trigger, player) {
					trigger.num++;
					game.setNature(trigger, "thunder");
				},
				marktext: "⚡",
				intro: { content: "受到的伤害+1且改为雷属性" },
				ai: {
					effect: {
						target: (card, player, target) => {
							if (!get.tag(card, "damage")) {
								return;
							}
							if (
								target.hasSkillTag("nodamage", null, {
									natures: ["thunder"],
								}) ||
								target.hasSkillTag("nothunder")
							) {
								return "zeroplayertarget";
							}
							if (
								target.hasSkillTag("filterDamage", null, {
									player: player,
									card: new lib.element.VCard(
										{
											name: card.name,
											nature: "thunder",
										},
										[card]
									),
								})
							) {
								return;
							}
							return 2;
						},
					},
				},
			},
			init: {
				audio: "shouli",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				logTarget: () => game.filterPlayer(),
				async content(event, trigger, player) {
					// @ts-expect-error player.getNext()
					const targets = game.filterPlayer().sortBySeat(player.getNext());
					event.targets = targets;

					for (const target of targets) {
						if (target.isIn()) {
							const card = get.cardPile2(card => {
								if (get.cardtag(card, "gifts")) {
									return false;
								}
								var type = get.subtype(card);
								if (type != "equip3" && type != "equip4" && type != "equip6") {
									return false;
								}
								return target.canUse(card, target);
							});
							if (card) {
								await target.chooseUseTarget(card, "nopopup", "noanimate", true);
							}
						}
					}
				},
			},
			backup: {
				async precontent(event, trigger, player) {
					const cards = event.result.card?.cards;
					event.result.cards = cards;
					event.result._apply_args = { addSkillCount: false };
					const owner = get.owner(cards[0]);
					event.target = owner;
					owner.$give(cards[0], player, false);
					player.popup(event.result.card.name, "metal");
					await game.delayx();
					event.getParent().addCount = false;
					if (player != event.target) {
						event.target.addTempSkill("fengyin");
					}
					event.target.addTempSkill("shouli_thunder");
					player.addTempSkill("shouli_thunder");
				},
				filterCard: () => false,
				prompt: "请选择【杀】的目标",
				selectCard: -1,
				log: false,
			},
		},
	},
	hengwu: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		frequent: true,
		filter(event, player) {
			var suit = get.suit(event.card);
			if (
				!lib.suit.includes(suit) ||
				player.hasCard(function (card) {
					return get.suit(card, player) == suit;
				}, "h")
			) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current.hasCard(function (card) {
					return get.suit(card, current) == suit;
				}, "e");
			});
		},
		async content(event, trigger, player) {
			const suit = get.suit(trigger.card);

			const num = game.countPlayer(current => {
				return current.countCards("e", card => get.suit(card, current) == suit);
			})
			await player.draw(num);
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (typeof card !== "object") {
						return;
					}
					let suit = get.suit(card);
					if (
						!lib.suit.includes(suit) ||
						player.hasCard(function (i) {
							return get.suit(i, player) == suit;
						}, "h")
					) {
						return;
					}
					return [
						1,
						0.8 *
							game.countPlayer(current => {
								return current.countCards("e", card => {
									return get.suit(card, current) == suit;
								});
							}),
					];
				},
				target: (card, player, target) => {
					if (
						card.name === "sha" &&
						!player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: card,
							},
							true
						) &&
						game.hasPlayer(current => {
							return current.hasCard(cardx => {
								return get.subtype(cardx) === "equip3";
							}, "e");
						})
					) {
						return [0, -0.5];
					}
				},
			},
		},
	},
	changandajian_equip5: {
		equipSkill: true,
		mod: { maxHandcard: (player, num) => num + 2 },
	},
	changandajian_destroy: {
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		charlotte: true,
		equipSkill: true,
		filter(event, player) {
			var evt = event.getl(player);
			if (!evt || !evt.es || !evt.es.length) {
				return false;
			}
			for (var i of evt.es) {
				if (i.name.indexOf("changandajian_equip") == 0) {
					return true;
				}
			}
			return false;
		},
		getEffect(player, target) {
			if (player == target) {
				return 0;
			}
			var getRaw = function () {
				var att = get.attitude(player, target);
				if (att > 0) {
					if (
						target.countCards("j", function (card) {
							var cardj = card.viewAs ? { name: card.viewAs } : card;
							return get.effect(target, cardj, target, player) < 0;
						}) > 0
					) {
						return 3;
					}
					if (target.getEquip("baiyin") && target.isDamaged() && get.recoverEffect(target, player, player) > 0) {
						if (target.hp == 1 && !target.hujia) {
							return 1.6;
						}
					}
					if (
						target.countCards("e", function (card) {
							if (get.position(card) == "e") {
								return get.value(card, target) < 0;
							}
						}) > 0
					) {
						return 1;
					}
				}
				var es = target.getCards("e");
				var noe = es.length == 0 || target.hasSkillTag("noe");
				var noe2 =
					es.filter(function (esx) {
						return get.value(esx, target) > 0;
					}).length == 0;
				if (noe || noe2) {
					return 0;
				}
				if (att <= 0 && !target.countCards("e")) {
					return 1.5;
				}
				return -1.5;
			};
			return getRaw() * get.attitude(player, target);
		},
		async content(event, trigger, player) {
			let time = 0;
			let recover = 0;
			const evt = trigger.getl(player);
			for (const card of evt.es) {
				if (card.name.indexOf("changandajian_equip") === 0) {
					time++;
				}
				if (card.name === "changandajian_equip2") {
					recover++;
				}
			}
			if (recover > 0) {
				await player.recover(recover);
			}

			for (let i = 0; i < time && game.hasPlayer(current => current.countCards("ej") > 0); i++) {
				let result = await player
					.chooseTarget(true, "选择一名装备区或判定区有牌的角色", (card, player, target) => target.countCards("ej") > 0)
					.set("ai", target => lib.skill.changandajian_destroy.getEffect(_status.event.player, target))
					.forResult();
				if (!result.bool) {
					return;
				}

				// @ts-expect-error 必然存在
				const target = result.targets[0];
				player.line(target, "green");
				result = await player.choosePlayerCard(target, true, "ej").forResult();
				if (!result.bool) {
					return;
				}

				// @ts-expect-error 必然存在
				const card = result.cards[0];
				const num = get.number(card);
				// @ts-expect-error 神秘类型
				if (typeof get.strNumber(num, false) === "string") {
					if (lib.filter.canBeGained(card, player, target)) {
						await player.gain(card, target, "give", "bySelf");
					}
				} else if (lib.filter.canBeDiscarded(card, player, target)) {
					await target.discard(card);
				}
			}
		},
	},
	dili: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			if (player.storage.dili) {
				return false;
			}
			if (event.name != "phase") {
				return true;
			}
			if (game.phaseNumber == 0) {
				return true;
			}
			//让神山识能够获得东吴命运线
			return player.name == "key_shiki";
		},
		async content(event, trigger, player) {
			player.storage.dili = true;
			const skill = ["dili_shengzhi", "dili_chigang", "dili_qionglan", "dili_quandao", "dili_jiaohui", "dili_yuanlv"].randomGet();
			player.addSkill(skill);
			game.log(player, '解锁了<span style="font-family: yuanli">东吴命运线</span>：', "#g【" + get.translation(skill) + "】");
		},
		derivation: ["dili_shengzhi", "dili_chigang", "dili_qionglan", "dili_quandao", "dili_jiaohui", "dili_yuanlv", "gzyinghun", "hongde", "rebingyi", "xinfu_guanwei", "bizheng", "xinanguo", "shelie", "wengua", "rebotu", "rezhiheng", "jiexun", "reanxu", "xiashu", "rejieyin", "oldimeng", "xinfu_guanchao", "drlt_jueyan", "lanjiang"],
		subSkill: {
			shengzhi: {
				audio: 2,
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					var num = get.number(event.card);
					if (typeof num != "number") {
						return false;
					}
					if (num <= 1) {
						return false;
					}
					for (var i = 2; i <= Math.sqrt(num); i++) {
						if (num % i == 0) {
							return false;
						}
					}
					if (!player.storage.yuheng) {
						return false;
					}
					var list = ["gzyinghun", "hongde", "rebingyi"];
					for (var i of list) {
						if (!player.storage.yuheng.includes(i)) {
							return false;
						}
					}
					return true;
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.filterPlayer(current => current != player));
				},
				init(player, skill) {
					player.markAuto("yuheng_current", ["gzyinghun", "hongde", "rebingyi"]);
				},
				mark: true,
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (arg && arg.card) {
							var num = get.number(arg.card);
							if (typeof num != "number") {
								return false;
							}
							if (num <= 1) {
								return false;
							}
							for (var i = 2; i <= Math.sqrt(num); i++) {
								if (num % i == 0) {
									return false;
								}
							}
							return true;
						}
						return false;
					},
				},
				intro: {
					name: "命运线：圣质",
					content(storage, player) {
						var finished = [],
							unfinished = ["gzyinghun", "hongde", "rebingyi"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖英魂〗〖弘德〗〖秉壹〗，则当你使用点数为质数的牌时，此牌不可被响应。";
						return str;
					},
				},
			},
			chigang: {
				audio: 2,
				trigger: { player: "phaseChange" },
				forced: true,
				filter(event, player) {
					if (!player.storage.yuheng?.length) {
						return false;
					}
					const list = ["xinfu_guanwei", "bizheng", "xinanguo"];
					if (list.some(skill => !player.storage.yuheng.includes(skill))) {
						return false;
					}
					return event.phaseList[event.num].indexOf("phaseJudge") != -1;
				},
				async content(event, trigger, player) {
					trigger.phaseList[trigger.num] = `phaseDraw|${event.name}`;
					await game.delayx();
				},
				init(player, skill) {
					player.markAuto("yuheng_current", ["xinfu_guanwei", "bizheng", "xinanguo"]);
				},
				ai: {
					effect: {
						target(card) {
							if (get.type(card) == "delay") {
								return "zeroplayertarget";
							}
						},
					},
				},
				mark: true,
				intro: {
					name: "命运线：持纲",
					content(storage, player) {
						var finished = [],
							unfinished = ["xinfu_guanwei", "bizheng", "xinanguo"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖观微〗〖弼政〗〖安国〗，则当你的判定阶段开始前，你跳过此阶段并获得一个额外的摸牌阶段。";
						return str;
					},
				},
			},
			qionglan: {
				audio: 2,
				init(player, skill) {
					player.markAuto("yuheng_current", ["shelie", "wengua", "rebotu"]);
				},
				trigger: { player: "useSkillAfter" },
				forced: true,
				limited: true,
				filter(event, player) {
					if (!player.storage.yuheng || event.skill != "yuheng") {
						return false;
					}
					var list = ["shelie", "wengua", "rebotu"];
					for (var i of list) {
						if (!player.storage.yuheng.includes(i)) {
							return false;
						}
					}
					return true;
				},
				async content(event, trigger, player) {
					player.awakenSkill(event.name);
					const list = ["dili_shengzhi", "dili_chigang", "dili_quandao", "dili_jiaohui", "dili_yuanlv"];
					const list2 = list.randomRemove(2);
					if (list2.includes("dili_quandao") && list2.includes("dili_jiaohui")) {
						list2.randomRemove(1);
						list2.push(list.randomGet());
					}
					for (const skill of list2) {
						player.addSkill(skill);
						game.log(player, '解锁了<span style="font-family: yuanli">东吴命运线</span>：', "#g【" + get.translation(skill) + "】");
					}
				},
				mark: true,
				intro: {
					name: "命运线：穹览",
					content(storage, player) {
						var finished = [],
							unfinished = ["shelie", "wengua", "rebotu"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += '<li>锁定技，限定技。若你因〖驭衡〗获得过〖涉猎〗〖问卦〗〖博图〗，则当你发动的〖驭衡〗结算结束后，你随机获得两条其他<span style="font-family: yuanli">东吴命运线</span>。';
						return str;
					},
				},
			},
			quandao: {
				audio: 2,
				mod: {
					cardname(card, player) {
						if (player.storage.yuheng && typeof get.strNumber(card.number, false) === "string") {
							var list = ["rezhiheng", "jiexun", "reanxu"];
							for (var i of list) {
								if (!player.storage.yuheng.includes(i)) {
									return;
								}
							}
							return "tiaojiyanmei";
						}
					},
				},
				init(player, skill) {
					player.markAuto("yuheng_current", ["rezhiheng", "jiexun", "reanxu"]);
				},
				mark: true,
				intro: {
					name: "命运线：权道",
					content(storage, player) {
						var finished = [],
							unfinished = ["rezhiheng", "jiexun", "reanxu"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖制衡〗〖诫训〗〖安恤〗，则你手牌区内点数为字母的牌的牌名视为【调剂盐梅】。";
						return str;
					},
				},
			},
			jiaohui: {
				audio: 2,
				mod: {
					cardname(card, player) {
						if (player.countCards("h") == 1 && player.storage.yuheng) {
							var list = ["xiashu", "rejieyin", "oldimeng"];
							for (var i of list) {
								if (!player.storage.yuheng.includes(i)) {
									return;
								}
							}
							return "yuanjiao";
						}
					},
				},
				init(player, skill) {
					player.markAuto("yuheng_current", ["xiashu", "rejieyin", "oldimeng"]);
				},
				mark: true,
				intro: {
					name: "命运线：交辉",
					content(storage, player) {
						var finished = [],
							unfinished = ["xiashu", "rejieyin", "oldimeng"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖下书〗〖结姻〗〖缔盟〗，且你的手牌数为1，则此牌的牌名视为【远交近攻】。";
						return str;
					},
				},
			},
			yuanlv: {
				audio: 2,
				init(player, skill) {
					_status.changandajian_cardcolor = 0;
					player.markAuto("yuheng_current", ["xinfu_guanchao", "drlt_jueyan", "lanjiang"]);
				},
				trigger: { player: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					if (get.type(event.card, null, false) != "equip" || player != event.target || event.card.name.indexOf("changandajian_equip") == 0) {
						return false;
					}
					if (!player.storage.yuheng) {
						return false;
					}
					var list = ["xinfu_guanchao", "drlt_jueyan", "lanjiang"];
					for (var i of list) {
						if (!player.storage.yuheng.includes(i)) {
							return false;
						}
					}
					var type = get.subtype(event.card);
					if (lib.card["changandajian_" + type] && player.hasEquipableSlot(type)) {
						return true;
					}
					return false;
				},
				async content(event, trigger, player) {
					const cards = trigger.cards.filterInD();
					if (cards.length > 0) {
						await game.cardsDiscard(cards);
					}
					const type = get.subtype(trigger.card);
					const card = game.createCard("changandajian_" + type, _status.changandajian_cardcolor++ % 2 ? "spade" : "heart", 10);
					await player.useCard(card, player);
				},
				mark: true,
				intro: {
					name: "命运线：渊虑",
					content(storage, player) {
						var finished = [],
							unfinished = ["xinfu_guanchao", "drlt_jueyan", "lanjiang"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖观潮〗〖决堰〗〖澜疆〗，则当你成为自己使用的装备牌的目标后，你将此牌置于弃牌堆，然后使用一张与此装备牌副类别相同的【长安大舰】。";
						return str;
					},
				},
			},
		},
		ai: {
			combo: "yuheng",
		},
	},
	yuheng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			// ?
			let skills = player.getSkills(null, false, false).filter(skill => {
				if (skill == "yuheng") {
					return false;
				}
				const info = get.info(skill);
				return info && !info.charlotte && !get.is.locked(skill);
			});
			if (skills.length) {
				player.removeSkills(skills);
			}
			//初始化技能库
			const list1 = ["dili_shengzhi", "dili_chigang", "dili_qionglan", "dili_quandao", "dili_jiaohui", "dili_yuanlv"];
			const list2 = ["gzyinghun", "hongde", "rebingyi", "xinfu_guanwei", "bizheng", "xinanguo", "shelie", "wengua", "rebotu", "rezhiheng", "jiexun", "reanxu", "xiashu", "rejieyin", "oldimeng", "xinfu_guanchao", "drlt_jueyan", "lanjiang"];
			const list3 = [];
			if (!player.storage.yuheng_full) {
				player.storage.yuheng_full = list2.slice(0);
			}
			if (player.getStorage("yuheng_current").length == 0) {
				for (let i = 0; i < list1.length; i++) {
					if (player.hasSkill(list1[i])) {
						for (var j = 0; j < 3; j++) {
							list3.add(list2[i * 3 + j]);
						}
					}
				}
				if (!player.storage.yuheng_current) {
					player.storage.yuheng_current = list3.slice(0);
				}
			}
			let fullskills, currentskills;
			//决定抽选技能范围
			if (player.storage.yuheng_full && player.storage.yuheng_full.length) {
				fullskills = player.storage.yuheng_full;
			} else {
				fullskills = list2.slice(0);
			}
			if (player.storage.yuheng_current && player.storage.yuheng_current.length) {
				currentskills = player.storage.yuheng_current;
			} else {
				currentskills = list3.slice(0);
			}
			skills = [];
			//在没有发动过其他非锁定技时抽选技能
			const evtx = event.getParent("phaseUse");
			if (
				currentskills.length > 0 &&
				!player.hasHistory("useSkill", evt => {
					if (evt.skill == "yuheng" || evt.type != "player" || !evt.sourceSkill) {
						return false;
					}
					const info1 = get.info(evt.skill);
					if (info1.charlotte) {
						return false;
					}
					const info = get.info(evt.sourceSkill);
					if (info.charlotte || get.is.locked(evt.skill)) {
						return false;
					}
					return evt.event.getParent("phaseUse") == evtx;
				})
			) {
				fullskills.randomSort();
				currentskills.randomSort();
				for (let i = 0; i < fullskills.length; i++) {
					for (let j = 0; j < currentskills.length; j++) {
						if (fullskills[i] != currentskills[j] || (i == fullskills.length - 1 && j == currentskills.length - 1)) {
							skills.add(fullskills.splice(i--, 1)[0]);
							skills.add(currentskills.splice(j--, 1)[0]);
							break;
						}
					}
					if (skills.length > 0) {
						break;
					}
				}
			} else {
				//在已经发动过其他非锁定技时抽选技能
				skills.add(fullskills.randomRemove(1)[0]);
			}
			for (const skill of skills) {
				player.addSkills(skill);
			}
			player.markAuto("yuheng", skills);
		},
		ai: {
			order(item, player) {
				var evtx = _status.event.getParent("phaseUse");
				if (
					!player.hasHistory("useSkill", function (evt) {
						if (evt.skill == "yuheng" || evt.type != "player" || !evt.sourceSkill) {
							return false;
						}
						var info1 = get.info(evt.skill);
						if (info1.charlotte) {
							return false;
						}
						var info = get.info(evt.sourceSkill);
						if (info.charlotte || get.is.locked(evt.skill)) {
							return false;
						}
						return evt.event.getParent("phaseUse") == evtx;
					})
				) {
					return 11;
				}
				return 0.8;
			},
			result: { player: 1 },
		},
		group: "yuheng_losehp",
		subSkill: {
			losehp: {
				audio: "yuheng",
				trigger: { player: "phaseUseEnd" },
				forced: true,
				locked: false,
				filter(event, player) {
					return !player.hasHistory("useSkill", function (evt) {
						if (evt.skill != "yuheng") {
							return false;
						}
						return evt.event.getParent("phaseUse") == event;
					});
				},
				async content(event, trigger, player) {
					await player.loseHp();
				},
			},
		},
	},
	jiufa: {
		audio: 2,
		trigger: { player: ["useCardAfter", "respondAfter"] },
		frequent: true,
		filter(event, player) {
			return event.jiufa_counted && player.getStorage("jiufa").length >= 9;
		},
		async content(event, trigger, player) {
			player.unmarkSkill("jiufa");
			event.cards = get.cards(9);
			event.cards.sort((a, b) => get.number(b) - get.number(a));
			game.cardsGotoOrdering(event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str;
					if (player == game.me && !_status.auto) {
						str = "九伐：选择任意张点数满足条件的牌";
					} else {
						str = "九伐";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			event.time = get.utc();
			game.addVideo("showCards", player, ["九伐", get.cardsInfo(event.cards)]);
			game.addVideo("delay", null, 2);

			const next = player.chooseButton([0, 9], true);
			next.set("dialog", event.videoId);
			next.set("filterButton", function (button) {
				let num = get.number(button.link),
					cards = _status.event.getParent().cards;
				for (let i of ui.selected.buttons) {
					if (get.number(i.link) == num) {
						return false;
					}
				}
				for (let i of cards) {
					if (i != button.link && get.number(i) == num) {
						return true;
					}
				}
				return false;
			});
			next.set("ai", button => get.value(button.link, get.player()));

			const result = await next.forResult();
			if (result.bool && result.links && result.links.length) {
				event.cards2 = result.links;
			}
			const time = 1000 - (get.utc() - event.time);
			if (time > 0) {
				await game.delay(0, time);
			}
			game.broadcastAll("closeDialog", event.videoId);
			const cards2 = event.cards2;
			if (cards2 && cards2.length) {
				await player.gain(cards2, "log", "gain2");
			}
		},
		marktext: "⑨",
		intro: {
			content: "已记录牌名：$",
			onunmark: true,
		},
		group: "jiufa_count",
		subSkill: {
			count: {
				trigger: { player: ["useCard1", "respond"] },
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return !player.getStorage("jiufa").includes(event.card.name);
				},
				async content(event, trigger, player) {
					trigger.jiufa_counted = true;
					player.markAuto("jiufa", [trigger.card.name]);
				},
			},
		},
	},
	tianren: {
		audio: 2,
		trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
		forced: true,
		filter(event, player) {
			if (event.name.indexOf("lose") == 0) {
				if (event.getlx === false || event.position != ui.discardPile) {
					return false;
				}
			} else {
				var evt = event.getParent();
				if (evt.relatedEvent && evt.relatedEvent.name == "useCard") {
					return false;
				}
			}
			for (var i of event.cards) {
				var owner = false;
				if (event.hs && event.hs.includes(i)) {
					owner = event.player;
				}
				var type = get.type(i, null, owner);
				if (type == "basic" || type == "trick") {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			let num = 0;
			for (const card of trigger.cards) {
				let owner = false;
				if (trigger.hs && trigger.hs.includes(card)) {
					owner = trigger.player;
				}
				const type = get.type(card, null, owner);
				if (type == "basic" || type == "trick") {
					num++;
				}
			}
			player.addMark("tianren", num);
		},
		group: "tianren_maxHp",
		intro: { content: "mark" },
		subSkill: {
			maxHp: {
				audio: "tianren",
				trigger: { player: ["tianrenAfter", "gainMaxHpAfter", "loseMaxHpAfter"] },
				forced: true,
				filter(event, player) {
					return player.countMark("tianren") >= player.maxHp;
				},
				async content(event, trigger, player) {
					player.removeMark("tianren", player.maxHp);
					await player.gainMaxHp();
					await player.draw(2);
				},
			},
		},
	},
	pingxiang: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "ice",
		filter(event, player) {
			return player.maxHp > 9;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp(9);

			for (let i = 0; i < 9; i++) {
				const result = await player.chooseUseTarget(
					{
						name: "sha",
						nature: "fire",
						isCard: true,
					},
					"请选择火【杀】的目标（" + (i === 8 ? "⑨" : i + 1) + "/9）",
					false
				).forResult();

				if (!result.bool) {
					break;
				}
			}

			await player.removeSkills("jiufa");
			player.addSkill("pingxiang_effect");
		},
		ai: {
			order() {
				return get.order({
					name: "sha",
					nature: "fire",
					isCard: true,
				});
			},
			result: {
				player(player) {
					if (
						player.hasValueTarget({
							name: "sha",
							nature: "fire",
							isCard: true,
						})
					) {
						return 1;
					}
					return 0;
				},
			},
			combo: "tianren",
		},
		subSkill: {
			effect: {
				marktext: "襄",
				intro: { content: "手牌上限基数改为体力上限" },
				mod: {
					maxHandcardBase(player) {
						return player.maxHp;
					},
				},
			},
		},
	},
	yingba: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if (num > 0 && _status.event && _status.event.type == "phase" && get.tag(card, "recover")) {
					if (player.needsToDiscard()) {
						return num / 3;
					}
					return 0;
				}
			},
			targetInRange(card, player, target) {
				if (target.hasMark("yingba_mark")) {
					return true;
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		filter: (event, player) => game.hasPlayer(current => current != player && current.maxHp > 1),
		filterTarget: (card, player, target) => target != player && target.maxHp > 1,
		async content(event, trigger, player) {
			const { target } = event;

			await target.loseMaxHp();
			if (target.isIn()) {
				target.addMark("yingba_mark", 1);
			}
			await player.loseMaxHp();
		},
		locked: false,
		//global:'yingba_mark',
		ai: {
			threaten(player, target) {
				if (player === target || player.isDamaged() || get.attitude(player, target) > 0) {
					return 1;
				}
				return 8 / player.maxHp;
			},
			order: 11,
			result: {
				player(player, target) {
					if (player.maxHp == 1) {
						return -2.5;
					}
					return -0.25;
				},
				target(player, target) {
					if (target.isHealthy()) {
						return -2;
					}
					if (!target.hasMark("yingba_mark")) {
						return -1;
					}
					return -0.2;
				},
			},
		},
		subSkill: {
			mark: {
				marktext: "定",
				intro: {
					name: "平定",
					content: "mark",
					onunmark: true,
				},
				mod: {
					maxHandcard(player, numx) {
						var num = player.countMark("yingba_mark");
						if (num) {
							return (
								numx +
								num *
									game.countPlayer(function (current) {
										return current.hasSkill("yingba");
									})
							);
						}
					},
				},
			},
		},
	},
	scfuhai: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		forced: true,
		filter(event, player) {
			return event.target && event.target.hasMark("yingba_mark");
		},
		logTarget: "target",
		async content(event, trigger, player) {
			trigger.directHit.add(trigger.target);
			if (player.getHistory("gain", evt => evt.getParent(2).name == "scfuhai").length < 2) {
				await player.draw();
			}
		},
		group: ["scfuhai_die"],
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg && arg.target && arg.target.hasMark("yingba_mark");
			},
			combo: "yingba",
		},
		subSkill: {
			usea: {
				audio: "scfuhai",
				trigger: { player: "useCardAfter" },
				forced: true,
				filter(event, player) {
					return lib.skill.scfuhai_usea.logTarget(event, player).length > 0;
				},
				logTarget(event, player) {
					return event.targets.filter(function (i) {
						return i.hasMark("yingba_mark");
					});
				},
				async content(event, trigger, player) {
					let num = 0;
					for (const target of trigger.targets) {
						const numx = target.countMark("yingba_mark");
						if (numx) {
							num += numx;
							target.removeMark("yingba_mark", numx);
						}
					}
					if (num) {
						await player.gainMaxHp(num);
					}
				},
			},
			die: {
				audio: "scfuhai",
				trigger: { global: "die" },
				forced: true,
				filter(event, player) {
					return event.player.countMark("yingba_mark") > 0;
				},
				async content(event, trigger, player) {
					await player.gainMaxHp(trigger.player.countMark("yingba_mark"));
					await player.draw(trigger.player.countMark("yingba_mark"));
				},
			},
		},
	},
	pinghe: {
		audio: 2,
		mod: {
			maxHandcardBase(player) {
				return player.getDamagedHp();
			},
		},
		trigger: { player: "damageBegin2" },
		forced: true,
		filter(event, player) {
			return event.source && event.source != player && player.maxHp > 1 && player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			trigger.cancel();
			await player.loseMaxHp();
			let result = await player
				.chooseCardTarget({
					prompt: "请选择【冯河】的牌和目标",
					prompt2: "将一张手牌交给一名其他角色并防止伤害" + (player.hasSkill("yingba") ? "，然后令伤害来源获得一个“平定”标记" : ""),
					filterCard: true,
					forced: true,
					filterTarget: lib.filter.notMe,
					ai1(card) {
						if (
							get.tag(card, "recover") &&
							!game.hasPlayer(function (current) {
								return get.attitude(current, player) > 0 && !current.hasSkillTag("nogain");
							})
						) {
							return 0;
						}
						return 1 / Math.max(0.1, get.value(card));
					},
					ai2(target) {
						var player = _status.event.player,
							att = get.attitude(player, target);
						if (target.hasSkillTag("nogain")) {
							att /= 9;
						}
						return 4 + att;
					},
				})
				.forResult();
			if (result.bool) {
				const target = result.targets[0];
				//player.logSkill('pinghe',target);
				player.line(target, "green");
				await player.give(result.cards, target);
				if (player.hasSkill("yingba")) {
					trigger.source.addMark("yingba_mark", 1);
				}
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player !== target && target.maxHp > 1 && target.countCards("h") > 0) {
						if (get.tag(card, "damage") && target.hasSkill("yingba")) {
							let damage = 1.6;
							if (target.isHealthy()) {
								damage += 1.6;
							}
							if (
								game.hasPlayer(cur => {
									return cur !== target && get.attitude(target, cur) > 0;
								})
							) {
								damage -= 0.9;
							}
							return [0, -damage, 0, -0.4];
						}
						if (card.name === "tiesuo") {
							return 0.4;
						}
					}
					if (get.tag(card, "recover") && _status.event.type == "phase" && !player.needsToDiscard()) {
						return 0;
					}
				},
			},
		},
	},
	tianzuo: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && !lib.inpile.includes("qizhengxiangsheng");
		},
		async content(event, trigger, player) {
			game.addGlobalSkill("tianzuo_global");
			const cards = [];
			for (let i = 2; i < 10; i++) {
				cards.push(game.createCard2("qizhengxiangsheng", i % 2 ? "club" : "spade", i));
			}
			game.broadcastAll(() => void lib.inpile.add("qizhengxiangsheng"));
			game.cardsGotoPile(cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});
		},
		group: "tianzuo_remove",
		subSkill: {
			remove: {
				audio: "tianzuo",
				trigger: { target: "useCardToBefore" },
				forced: true,
				priority: 15,
				filter(event, player) {
					return event.card && event.card.name == "qizhengxiangsheng";
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (card && card.name == "qizhengxiangsheng") {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			global: {
				trigger: { player: "useCardToPlayered" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card.name == "qizhengxiangsheng";
				},
				async content(event, trigger, player) {
					const target = trigger.target;
					event.target = target;
					let result = await player
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
						})
						.forResult();

					let map = trigger.getParent().customArgs,
						id = target.playerid;
					if (!map[id]) {
						map[id] = {};
					}
					map[id].qizheng_name = result.control;
				},
			},
			rewrite: {
				audio: "tianzuo",
				trigger: { global: "useCardToTargeted" },
				filter(event, player) {
					return event.card.name == "qizhengxiangsheng";
				},
				logTarget: "target",
				prompt2: "观看其手牌并修改“奇正相生”标记",
				async content(event, trigger, player) {
					let target = trigger.target;
					event.target = target;
					if (player != target && target.countCards("h") > 0) {
						await player.viewHandcards(target);
					}
					let result = await player
						.chooseControl("奇兵", "正兵")
						.set("prompt", "请选择" + get.translation(target) + "的标记")
						.set(
							"choice",
							(function () {
								var shas = target.getCards("h", "sha"),
									shans = target.getCards("h", "shan");
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
								if (get.attitude(player, target) > 0) {
									if (shas.length >= Math.max(1, shans.length)) {
										return "奇兵";
									}
									if (shans.length > shas.length) {
										return "正兵";
									}
									return e1 > e2 ? "奇兵" : "正兵";
								}
								if (shas.length) {
									e1 = -0.5;
								}
								if (shans.length) {
									e2 = -0.7;
								}
								if (Math.abs(e1 - e2) <= 0.3) {
									return Math.random() < 0.5 ? "奇兵" : "正兵";
								}
								var rand = Math.random();
								if (e1 < e2) {
									return rand < 0.1 ? "奇兵" : "正兵";
								}
								return rand < 0.1 ? "正兵" : "奇兵";
							})()
						)
						.set("ai", () => _status.event.choice)
						.forResult();

					let map = trigger.getParent().customArgs,
						id = target.playerid;
					if (!map[id]) {
						map[id] = {};
					}
					map[id].qizheng_name = result.control;
					map[id].qizheng_aibuff = get.attitude(player, target) > 0;
				},
			},
		},
	},
	lingce: {
		audio: 2,
		init: player => {
			game.addGlobalSkill("lingce_global");
		},
		trigger: { global: "useCard" },
		forced: true,
		filter(event, player) {
			if (!event.card.isCard || !event.cards || event.cards.length !== 1) {
				return false;
			}
			return event.card.name == "qizhengxiangsheng" || get.zhinangs().includes(event.card.name) || player.getStorage("dinghan").includes(event.card.name);
		},
		async content(event, trigger, player) {
			await player.draw();
		},
		subSkill: {
			global: {
				ai: {
					effect: {
						player_use(card, player, target) {
							if (typeof card !== "object") {
								return;
							}
							let num = 0,
								nohave = true;
							game.countPlayer(i => {
								if (i.hasSkill("lingce", null, null, false)) {
									nohave = false;
									if (
										i.isIn() &&
										lib.skill.lingce.filter(
											{
												card: card,
												cards: card.cards ? card.cards : [card],
											},
											i
										)
									) {
										num += get.sgnAttitude(player, i);
									}
								}
							}, true);
							if (nohave) {
								game.removeGlobalSkill("lingce_global");
							} else {
								return [1, 0.8 * num];
							}
						},
					},
				},
			},
		},
	},
	dinghan: {
		audio: 2,
		trigger: {
			target: "useCardToTarget",
			player: "addJudgeBefore",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "useCardToTarget" && get.type(event.card, null, false) != "trick") {
				return false;
			}
			return !player.getStorage("dinghan").includes(event.card.name);
		},
		async content(event, trigger, player) {
			player.markAuto("dinghan", [trigger.card.name]);
			if (trigger.name == "addJudge") {
				trigger.cancel();
				if (trigger.card?.cards?.length) {
					const map = new Map(),
						targets = [];
					for (const card of trigger.card.cards) {
						const owner = get.owner(card);
						if (owner) {
							targets.add(owner);
							map.set(owner, (map.get(owner) ?? []).concat([card]));
						}
					}
					if (targets.length) {
						await game
							.loseAsync({
								map: map,
								targets: targets,
								cards: trigger.card.cards,
							})
							.setContent(async (event, trigger, player) => {
								const { map, targets, cards } = event;
								for (const target of targets) {
									const lose = map.get(target);
									const next = target.lose(lose, ui.discardPile);
									next.getlx = false;
									await next;
								}
								game.log(cards, "进入了弃牌堆");
							});
					}
				}
			} else {
				trigger.targets.remove(player);
				trigger.getParent().triggeredTargets2.remove(player);
				trigger.untrigger();
			}
		},
		onremove: true,
		intro: { content: "已记录牌名：$" },
		group: "dinghan_add",
		subSkill: {
			add: {
				trigger: { player: "phaseBegin" },
				direct: true,
				async content(event, trigger, player) {
					let dialog = [get.prompt("dinghan")];
					let list1 = player.getStorage("dinghan");
					let list2 = lib.inpile.filter(function (i) {
						return get.type2(i, false) == "trick" && !list1.includes(i);
					});
					if (list1.length) {
						dialog.push('<div class="text center">已记录</div>');
						dialog.push([list1, "vcard"]);
					}
					if (list2.length) {
						dialog.push('<div class="text center">未记录</div>');
						dialog.push([list2, "vcard"]);
					}
					let result = await player.chooseButton(dialog).set("ai", function (button) {
						var player = _status.event.player,
							name = button.link[2];
						if (player.getStorage("dinghan").includes(name)) {
							return -get.effect(player, { name: name }, player, player);
						} else {
							return get.effect(player, { name: name }, player, player) * (1 + player.countCards("hs", name));
						}
					}).forResult();
					if (result.bool) {
						player.logSkill("dinghan");
						let name = result.links[0][2];
						if (player.getStorage("dinghan").includes(name)) {
							player.unmarkAuto("dinghan", [name]);
							game.log(player, "从定汉记录中移除了", "#y" + get.translation(name));
						} else {
							player.markAuto("dinghan", [name]);
							game.log(player, "向定汉记录中添加了", "#y" + get.translation(name));
						}
						await game.delayx();
					}
				},
			},
		},
	},
	dulie: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		forced: true,
		logTarget: "player",
		filter(event, player) {
			return event.card.name == "sha" && event.player.hp > player.hp;
		},
		async content(event, trigger, player) {
			const next = player.judge(result => get.suit(result) === "heart" ? 2 : -1);
			next.set("judge2", result => result.bool);

			const result = await next.forResult();
			if (result.bool) {
				trigger.targets.remove(player);
				trigger.getParent().triggeredTargets2.remove(player);
				trigger.untrigger();
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current, isLink) {
					if (card.name == "sha" && !isLink && player.hp > target.hp) {
						return 0.5;
					}
				},
			},
		},
		marktext: "围",
		intro: {
			name: "破围(围)",
			name2: "围",
			content: "mark",
		},
	},
	tspowei: {
		audio: 3,
		dutySkill: true,
		derivation: "shenzhu",
		group: ["tspowei_init", "tspowei_move", "tspowei_achieve", "tspowei_fail", "tspowei_use", "tspowei_remove"],
		subSkill: {
			remove: {
				audio: "tspowei3.mp3",
				trigger: { global: "damageEnd" },
				filter(event, player) {
					return event.player && event.player.isIn() && event.player.hasMark("dulie");
				},
				forced: true,
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.player.removeMark("dulie", trigger.player.countMark("dulie"));
				},
			},
			use: {
				audio: "tspowei3.mp3",
				trigger: { global: "phaseBegin" },
				direct: true,
				filter(event, player) {
					return event.player != player && event.player.hasMark("dulie") && (player.countCards("h") > 0 || (player.hp >= event.player.hp && event.player.countCards("h") > 0));
				},
				async content(event, trigger, player) {
					let list = [],
						target = trigger.player,
						choiceList = ["弃置一张牌并对其造成1点伤害", "获得其一张手牌"];
					event.target = target;
					if (
						player.hasCard(function (card) {
							return lib.filter.cardDiscardable(card, player, "tspowei_use");
						}, "h")
					) {
						list.push("选项一");
					} else {
						choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
					}
					if (player.hp >= target.hp && target.countCards("h") > 0) {
						list.push("选项二");
					} else {
						choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
					}
					let result = await player
						.chooseControl(list, "cancel2")
						.set("prompt", get.prompt("tspowei", target))
						.set("choiceList", choiceList)
						.set("ai", function () {
							var evt = _status.event.getParent();
							if (
								evt.player.hasCard(function (card) {
									return lib.filter.cardDiscardable(card, evt.player, "tspowei_use") && get.value(card, evt.player) < 7;
								}, "h") &&
								get.damageEffect(evt.target, evt.player, evt.player) > 0
							) {
								return "选项一";
							}
							if (evt.player.hp >= evt.target.hp && evt.target.countCards("h") > 0 && get.attitude(evt.player, evt.target) <= 0 && !evt.target.hasSkillTag("noh")) {
								return "选项二";
							}
							return "cancel2";
						})
						.forResult();
					if (result.control != "cancel2") {
						if (result.control == "选项二") {
							player.logSkill("tspowei_use", target);
							await player.gainPlayerCard(target, "h", true);
							event.goto(3);
						}
					} else {
						return;
					}
					await player.chooseToDiscard("h", true).set("logSkill", ["tspowei_use", target]);
					if (get.mode() != "identity" || player.identity != "nei") {
						player.addExpose(0.2);
					}
					await target.damage();
					player.addTempSkill("tspowei_inRange");
				},
				ai: { expose: 0.2 },
			},
			inRange: {
				charlotte: true,
				mod: {
					inRangeOf(from, to) {
						if (from == _status.currentPhase) {
							return true;
						}
					},
				},
			},
			init: {
				audio: "tspowei3.mp3",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				logTarget(event, player) {
					return game.filterPlayer(current => current != player && !current.hasMark("dulie"));
				},
				async content(event, trigger, player) {
					const list = game.filterPlayer(current => current != player && !current.hasMark("dulie")).sortBySeat();
					for (const current of list) {
						current.addMark("dulie", 1, false);
					}
				},
			},
			move: {
				audio: "tspowei3.mp3",
				trigger: { player: "phaseBegin" },
				forced: true,
				filter(event, player) {
					return game.hasPlayer(current => current != player && current.hasMark("dulie"));
				},
				async content(event, trigger, player) {
					const list = game.filterPlayer(current => current != player && current.hasMark("dulie")).sortBySeat();
					const map = {};
					for (const current of list) {
						const num = current.countMark("dulie");
						current.removeMark("dulie", num);
						map[current.playerid] = num;
					}
					for (const current of list) {
						let next = current.next;
						if (next == player) {
							next = next.next;
						}
						next.addMark("dulie", map[current.playerid]);
					}
				},
			},
			achieve: {
				audio: "tspowei1.mp3",
				trigger: { player: "phaseBegin" },
				forced: true,
				skillAnimation: true,
				animationColor: "metal",
				filter(event, player) {
					return !game.hasPlayer(function (current) {
						return current.hasMark("dulie");
					});
				},
				async content(event, trigger, player) {
					game.log(player, "成功完成使命");
					player.awakenSkill("tspowei");
					player.addSkills("shenzhu");
				},
			},
			fail: {
				audio: "tspowei2.mp3",
				trigger: { player: "dying" },
				forced: true,
				async content(event, trigger, player) {
					game.log(player, "使命失败");
					player.awakenSkill("tspowei");
					if (player.hp < 1) {
						await player.recover(1 - player.hp);
					}
					const num = player.countCards("e");
					if (num > 0) {
						await player.chooseToDiscard("e", true, num);
					}
				},
			},
		},
	},
	shenzhu: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && event.card.isCard && event.cards.length == 1;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseControl()
				.set("choiceList", ["摸一张牌，且本回合使用【杀】的次数上限+1", "摸三张牌，且本回合不能再使用【杀】"])
				.set("ai", () => (_status.event.player.hasSha() ? 0 : 1))
				.forResult();
			if (result.index == 0) {
				await player.draw();
				player.addTempSkill("shenzhu_more");
				player.addMark("shenzhu_more", 1, false);
			} else {
				await player.draw(3);
				player.addTempSkill("shenzhu_less");
			}
		},
		subSkill: {
			more: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("shenzhu_more");
						}
					},
				},
			},
			less: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (card.name == "sha") {
							return false;
						}
					},
				},
			},
		},
	},
	dangmo: {
		audio: 2,
		trigger: { player: "useCard2" },
		direct: true,
		filter(event, player) {
			if (event.card.name != "sha" || player.hp <= 1) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			return (
				evt &&
				evt.player == player &&
				player.getHistory("useCard", function (evtx) {
					return evtx.card.name == "sha" && evtx.getParent("phaseUse") == evt;
				})[0] == event &&
				game.hasPlayer(function (current) {
					return !event.targets.includes(current) && lib.filter.filterTarget(event.card, player, current);
				})
			);
		},
		async content(event, trigger, player) {
			let num = Math.min(
				player.hp - 1,
				game.countPlayer(function (current) {
					return !trigger.targets.includes(current) && lib.filter.filterTarget(trigger.card, player, current);
				})
			);
			let result = await player
				.chooseTarget(get.prompt("dangmo"), "为" + get.translation(trigger.card) + "增加至多" + get.translation(num) + "个目标", [1, num], function (card, player, target) {
					var evt = _status.event.getTrigger();
					return !evt.targets.includes(target) && lib.filter.filterTarget(evt.card, player, target);
				})
				.set("ai", function (target) {
					var evt = _status.event.getTrigger(),
						eff = get.effect(target, evt.card, evt.player, evt.player);
					if (player.hasSkill("tspowei") && target.hasMark("dulie")) {
						return 4 * eff;
					}
					return eff;
				})
				.forResult();
			if (result.bool) {
				if (player != game.me && !player.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			} else {
				return;
			}
			player.logSkill("dangmo", event.targets);
			trigger.targets.addArray(event.targets);
		},
	},
	reshuishi: {
		audio: "shuishi",
		enable: "phaseUse",
		usable: 1,
		frequent: true,
		filter(event, player) {
			return player.maxHp < 10;
		},
		async content(event, trigger, player) {
			event.cards = [];
			event.suits = [];
			event.again = true;
			while (event.again) {
				event.again = false;
				await player
					.judge(function (result) {
						var evt = _status.event.getParent("reshuishi");
						if (evt && evt.suits && evt.suits.includes(get.suit(result))) {
							return 0;
						}
						return 1;
					})
					.set("callback", lib.skill.reshuishi.callback)
					.set("judge2", result => result.bool);
			}
			const cards = event.cards.filterInD();
			if (!cards.length) {
				return;
			}
			const result = await player
				.chooseTarget("将" + get.translation(cards) + "交给一名角色", true)
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (att <= 0) {
						return att;
					}
					if (target.countCards("h") + _status.event.num >= _status.event.max) {
						att /= 3;
					}
					if (target.hasSkillTag("nogain")) {
						att /= 10;
					}
					return att;
				})
				.set("num", cards.length)
				.set(
					"max",
					game.filterPlayer().reduce((num, i) => {
						return Math.max(num, i.countCards("h"));
					}, 0)
				)
				.forResult();
			if (!result.bool) {
				return;
			}
			const target = result.targets[0];
			event.target = target;
			player.line(target, "green");
			await target.gain(cards, "gain2").set("giver", player);
			if (target.isMaxHandcard()) {
				await player.loseMaxHp();
			}
		},
		async callback(event, trigger, player) {
			const evt = event.getParent(2);
			event.getParent().orderingCards.remove(event.judgeResult.card);
			evt.cards.push(event.judgeResult.card);
			if (!event.getParent().result.bool || player.maxHp >= 10) {
				return;
			}
			evt.suits.push(event.getParent().result.suit);
			await player.gainMaxHp();
			const result = await player.chooseBool("是否继续发动【慧识】？").set("frequentSkill", "reshuishi").forResult();
			if (result.bool) {
				event.getParent(2).again = true;
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	shuishi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.maxHp < 10;
		},
		filterTarget: true,
		async content(event, trigger, player) {
			const { target } = event;
			while (true) {
				let result = await target.draw().forResult();
				if (!result.bool || !Array.isArray(result.cards) || result.cards.length !== 1 || get.itemtype(result.cards[0]) !== "card") {
					return;
				}

				const card = result.cards[0];
				const suit = get.suit(card);
				const hs = target.getCards("h");
				if (hs.some(cardx => cardx !== card && get.suit(cardx, target) === suit)) {
					await player.loseMaxHp();
					await target.showHandcards();
					return;
				}

				await player.gainMaxHp();
				if (player.maxHp >= 10) {
					return;
				}

				result = await player.chooseBool("是否继续发动【慧识】？").forResult();
				if (!result.bool) {
					return;
				}
			}
		},
		ai: {
			order: 0.5,
			result: {
				target: 0.2,
				player(player, target) {
					var list = [],
						hs = target.getCards("h");
					for (var i of hs) {
						list.add(get.suit(i, target));
					}
					if (list.length == 0) {
						return 0;
					}
					if (list.length == 1) {
						return player.maxHp > 2 ? 0 : -2;
					}
					if (list.length == 2) {
						return player.maxHp > 3 ? 0 : -2;
					}
					return -2;
				},
			},
		},
	},
	stianyi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return !game.hasPlayer(function (current) {
				return current.getAllHistory("damage").length == 0;
			});
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp(2);
			await player.recover();

			const next = player.chooseTarget(true, "令一名角色获得技能〖佐幸〗");
			next.set("ai", target => get.attitude(_status.event.player, target));

			const result = await next.forResult();
			if (result.bool) {
				const target = result.targets[0];
				player.line(target, "green");
				target.storage.zuoxing = player;
				await target.addSkills("zuoxing");
			}
		},
		derivation: "zuoxing",
	},
	zuoxing: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var target = player.storage.zuoxing;
			if (!target || !target.isIn() || target.maxHp < 2) {
				return false;
			}
			for (var i of lib.inpile) {
				if (get.type(i) == "trick" && event.filterCard({ name: i, isCard: true }, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i of lib.inpile) {
					if (get.type(i) == "trick" && event.filterCard({ name: i, isCard: true }, player, event)) {
						list.push(["锦囊", "", i]);
					}
				}
				return ui.create.dialog("佐幸", [list, "vcard"]);
			},
			check(button) {
				return _status.event.player.getUseValue({ name: button.link[2], isCard: true });
			},
			backup(links, player) {
				return {
					viewAs: {
						name: links[0][2],
						isCard: true,
					},
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("zuoxing");
						const target = player.storage.zuoxing;
						await target.loseMaxHp();
					},
				};
			},
			prompt(links, player) {
				return "请选择" + get.translation(links[0][2]) + "的目标";
			},
		},
		ai: { order: 1, result: { player: 1 } },
	},
	resghuishi: {
		onChooseToUse(event) {
			event.targetprompt2.add(target => {
				if (event.skill !== "resghuishi" || !target.classList.contains("selectable")) {
					return;
				}
				if (
					event.player.maxHp >= game.players.length &&
					target.getSkills(null, false, false).some(skill => {
						const info = get.info(skill);
						return info?.juexingji && !target.awakenedSkills.includes(skill);
					})
				) {
					return "觉醒";
				} else {
					return "摸牌";
				}
			});
		},
		audio: "sghuishi",
		enable: "phaseUse",
		filterTarget: true,
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		prompt() {
			const player = get.player();
			if (player.maxHp >= game.players.length) {
				return "选择一名角色。若其拥有未发动过的觉醒技，则你解除其中一个觉醒技的发动限制；否则其摸四张牌。然后你减2点体力上限。";
			}
			return "令一名角色摸四张牌，然后你减2点体力上限。";
		},
		async content(event, trigger, player) {
			const { target } = event;
			player.awakenSkill(event.name);
			const list = target.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				return info?.juexingji && !target.awakenedSkills.includes(skill);
			});
			if (player.maxHp >= game.players.length && list.length > 0) {
				const result =
					list.length == 1
						? { bool: true, links: list }
						: await player
								.chooseButton([`辉逝：选择一个觉醒技，令${get.translation(target)}可无视条件发动该技能`, [list, "skill"]], true)
								.set("displayIndex", false)
								.forResult();
				if (result?.bool && result.links?.length) {
					const [skill] = result.links;
					target.storage.resghuishi_mark = skill;
					target.markSkill("resghuishi_mark");
					const info = get.info(skill);
					if (info.filter && !info.charlotte && !info.resghuishi_filter) {
						info.resghuishi_filter = info.filter;
						info.filter = function (event, player) {
							if (player.storage.resghuishi_mark) {
								return true;
							}
							return this.resghuishi_filter.apply(this, arguments);
						};
					}
				}
			} else {
				await target.draw(4);
			}
			await player.loseMaxHp(2);
		},
		ai: {
			order: 0.1,
			expose: 0.2,
			result: {
				target(player, target) {
					if ((target != player && player.hasUnknown()) || player.maxHp < (player.getDamagedHp() > 1 ? 5 : 6)) {
						return 0;
					}
					if (
						target == player &&
						player.hasSkill("resghuishi") &&
						game.hasPlayer(function (current) {
							return current.getAllHistory("damage").length == 0;
						})
					) {
						return 4;
					}
					var list = target.getSkills(null, false, false).filter(function (skill) {
						var info = lib.skill[skill];
						return info && info.juexingji && !target.awakenedSkills.includes(skill);
					});
					if (list.length || target.hasJudge("lebu") || target.hasSkillTag("nogain")) {
						return 0;
					}
					return 4;
				},
			},
		},
		subSkill: { mark: { charlotte: true, intro: { content: "发动【$】时无视条件" } } },
	},
	sghuishi: {
		onChooseToUse(event) {
			event.targetprompt2.add(target => {
				if (event.skill !== "sghuishi" || !target.classList.contains("selectable")) {
					return;
				}
				if (
					target.getSkills(null, false, false).some(skill => {
						const info = get.info(skill);
						return info?.juexingji && !target.awakenedSkills.includes(skill);
					})
				) {
					return "觉醒";
				} else {
					return "摸牌";
				}
			});
		},
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			player.awakenSkill(event.name);
			const list = target.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				return info?.juexingji && !target.awakenedSkills.includes(skill);
			});
			if (list.length) {
				target.addMark(event.name, 1, false);
				for (const skill of list) {
					const info = get.info(skill);
					if (info.filter && !info.charlotte && !info.sghuishi_filter) {
						info.sghuishi_filter = info.filter;
						info.filter = function (event, player) {
							if (player.hasMark("sghuishi")) {
								return true;
							}
							return this.sghuishi_filter.apply(this, arguments);
						};
					}
				}
			} else {
				await target.draw(4);
			}
			await player.loseMaxHp(2);
		},
		intro: { content: "发动非Charlotte觉醒技时无视条件" },
		ai: {
			order: 0.1,
			expose: 0.2,
			result: {
				target(player, target) {
					if (player.hasUnknown() || player.maxHp < 5) {
						return 0;
					}
					var list = target.getSkills(null, false, false).filter(function (skill) {
						var info = lib.skill[skill];
						return info && info.juexingji;
					});
					if (list.length || target.hasJudge("lebu") || target.hasSkillTag("nogain")) {
						return 0;
					}
					return 4;
				},
			},
		},
	},
	zhanjiang: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i] != player && players[i].getEquips("qinggang").length > 0) {
					return true;
				}
			}
		},
		async content(event, trigger, player) {
			const players = game.filterPlayer();
			for (const current of players) {
				if (current === player) {
					continue;
				}

				const equips = current.getEquips("qinggang");
				if (equips.length > 0) {
					player.line(current, "green")
					await player.gain(equips, current, "give", "bySelf")
				}
			}
		},
	},
	boss_juejing: {
		audio: "juejing",
		audioname2: {
			dc_zhaoyun: "dcjuejing",
		},
		trigger: { player: "phaseDrawBefore" },
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
		},
		ai: {
			noh: true,
			nogain: true,
		},
		group: "boss_juejing2",
	},
	boss_juejing2: {
		audio: "juejing",
		sourceSkill: "boss_juejing",
		audioname2: {
			dc_zhaoyun: "dcjuejing",
		},
		mod: {
			aiOrder(player, card, num) {
				if (num > 0) {
					return num;
				}
				if (card.name === "zhuge" && player.getCardUsable("sha", true) < 6) {
					return 1;
				}
			},
			aiValue(player, card, num) {
				if (card.name === "zhuge") {
					return 60 / (1 + player.getCardUsable("sha", true));
				}
			},
			aiUseful(player, card, num) {
				if (card.name === "zhuge") {
					return 60 / (1 + player.getCardUsable("sha", true));
				}
			},
		},
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			if (event.name == "gain" && event.player == player) {
				return player.countCards("h") > 4;
			}
			var evt = event.getl(player);
			if (!evt || !evt.hs || evt.hs.length == 0 || player.countCards("h") >= 4) {
				return false;
			}
			var evt = event;
			for (var i = 0; i < 4; i++) {
				evt = evt.getParent("boss_juejing2");
				if (evt.name != "boss_juejing2") {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const num = 4 - player.countCards("h");
			if (num > 0) {
				await player.draw(num);
			} else {
				await player.chooseToDiscard("h", true, -num, "allowChooseAll");
			}
		},
		ai: {
			freeSha: true,
			freeShan: true,
			skillTagFilter() {
				return true;
			},
		},
	},
	dcjuejing: { audio: 2 },
	meihun: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
			target: "useCardToTargeted",
		},
		direct: true,
		filter(event, player) {
			if (event.name != "phaseJieshu" && event.card.name != "sha") {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h");
			});
		},
		async content(event, trigger, player) {
			let result = await player
				.chooseTarget(get.prompt2("meihun"), function (card, player, target) {
					return target != player && target.countCards("h") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					return 0.1 - att / target.countCards("h");
				})
				.forResult();
			if (!result.bool) {
				return;
			}

			let target = result.targets[0];
			player.logSkill("meihun", target);
			event.target = target;
			result = await player
				.chooseControl(lib.suit)
				.set("prompt", "请选择一种花色")
				.set("ai", function () {
					return lib.suit.randomGet();
				})
				.forResult();

			let suit = result.control;
			player.chat(get.translation(suit + 2));
			game.log(player, "选择了", "#y" + get.translation(suit + 2));
			if (target.countCards("h", { suit })) {
				result = await target
					.chooseCard("h", "交给" + get.translation(player) + "一张" + get.translation(suit) + "花色的手牌", true, function (card, player) {
						return get.suit(card, player) == _status.event.suit;
					})
					.set("suit", suit)
					.forResult();
			} else {
				await player.discardPlayerCard(target, true, "h", "visible");
				return;
			}
			if (result.bool && result.cards && result.cards.length) {
				await target.give(result.cards, player, "give");
			}
		},
	},
	//Connect Mode support after Angel Beats! -2nd beat-
	huoxin: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (game.countPlayer() < 3) {
				return false;
			}
			for (var i of lib.suit) {
				if (player.countCards("h", { suit: i }) > 1) {
					return true;
				}
			}
			return false;
		},
		complexCard: true,
		position: "h",
		filterCard(card, player) {
			if (!ui.selected.cards.length) {
				var suit = get.suit(card);
				return (
					player.countCards("h", function (card2) {
						return card != card2 && get.suit(card2, player) == suit;
					}) > 0
				);
			}
			return get.suit(card, player) == get.suit(ui.selected.cards[0], player);
		},
		selectCard: 2,
		selectTarget: 2,
		filterTarget: lib.filter.notMe,
		multitarget: true,
		multiline: true,
		delay: false,
		discard: false,
		lose: false,
		check(card) {
			return 6 - get.value(card);
		},
		targetprompt: ["拼点发起人", "拼点目标"],
		async content(event, trigger, player) {
			const { targets, cards } = event;
			const list = [];
			for (let i = 0; i < targets.length; i++) {
				list.push([targets[i], cards[i]]);
			}
			await game.loseAsync({
				gain_list: list,
				player: player,
				cards: cards,
				giver: player,
				animate: "giveAuto",
			}).setContent("gaincardMultiple");
			await game.delayx();

			if (!targets[0].canCompare(targets[1])) {
				return;
			}
			
			const result = await targets[0].chooseToCompare(targets[1]).forResult();
			if (result.winner !== targets[0]) {
				targets[0].addMark("huoxin", 1);
			}
			if (result.winner !== targets[1]) {
				targets[1].addMark("huoxin", 1);
			}
		},
		marktext: "魅",
		intro: {
			name: "魅惑",
			name2: "魅惑",
			content: "mark",
		},
		group: "huoxin_control",
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.hasMark("huoxin")) {
						return -2;
					}
					return -1;
				},
			},
		},
	},
	huoxin_control: {
		audio: "huoxin",
		forced: true,
		trigger: { global: "phaseBeginStart" },
		sourceSkill: "huoxin",
		filter(event, player) {
			return player != event.player && !event.player._trueMe && event.player.countMark("huoxin") > 1;
		},
		logTarget: "player",
		skillAnimation: true,
		animationColor: "key",
		async content(event, trigger, player) {
			trigger.player.removeMark("huoxin", trigger.player.countMark("huoxin"));
			trigger.player._trueMe = player;
			game.addGlobalSkill("autoswap");
			if (trigger.player == game.me) {
				game.notMe = true;
				if (!_status.auto) {
					ui.click.auto();
				}
			}
			trigger.player.addSkill("huoxin2");
		},
	},
	huoxin2: {
		trigger: {
			player: ["phaseAfter", "dieAfter"],
			global: "phaseBeforeStart",
		},
		lastDo: true,
		charlotte: true,
		forceDie: true,
		forced: true,
		silent: true,
		sourceSkill: "huoxin",
		async content(event, trigger, player) {
			player.removeSkill("huoxin2");
		},
		onremove(player) {
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
		},
	},
	caopi_xingdong: {
		audio: true,
		subSkill: {
			mark: {
				mark: true,
				marktext: "令",
				intro: {
					content: "跳过下个回合的判定阶段和摸牌阶段",
				},
			},
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", lib.skill.caopi_xingdong.filterCard) > 0;
		},
		filterCard(card) {
			return card.name == "sha" || get.type(card) == "trick";
		},
		check(card) {
			return 1;
		},
		filterTarget: lib.filter.notMe,
		discard: false,
		lose: false,
		delay: 0,
		async content(event, trigger, player) {
			const { cards, target } = event;
			await player.give(cards, target);

			let result;
			if (!target.getCards("h").includes(cards[0])) {
				result = { bool: false };
			} else {
				result = await target
					.chooseUseTarget(
						cards[0],
						game.filterPlayer(current => current !== player),
						"请使用得到的牌，或者跳过下回合的判定阶段和摸牌阶段"
					)
					.forResult();
			}
			if (result.bool) {
				await game.asyncDraw([player, target]);
				await game.delay();
			} else {
				target.addTempSkill("caopi_xingdong_mark", "phaseJudgeSkipped");
				target.skip("phaseJudge");
				target.skip("phaseDraw");
			}
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					var card = ui.selected.cards[0];
					if (target.hasSkill("pingkou")) {
						return 1;
					}
					if (!card) {
						return 0;
					}
					var info = get.info(card);
					if (info.selectTarget == -1) {
						var eff = 0;
						game.countPlayer(function (current) {
							if (current != player && target.canUse(card, current)) {
								eff += get.effect(current, card, target, target) > 0;
							}
						});
						if (eff > 0 || get.value(card) < 3) {
							return eff;
						}
						return 0;
					} else if (
						game.hasPlayer(function (current) {
							return current != player && target.canUse(card, current) && get.effect(current, card, target, target) > 0;
						})
					) {
						return 1.5;
					} else if (get.value(card) < 3) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	shenfu: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		direct: true,
		async content(event, trigger, player) {
			let logged = false;

			const chosen = new Set();
			event.chosen = chosen;
			while (true) {
				const odd = player.countCards("h") % 2 === 1;

				if (odd) {
					const result = await player
						.chooseTarget(get.prompt("shenfu"), "对一名其他角色造成1点雷属性伤害", (card, player, target) => {
							return target !== player && !get.event().getParent().chosen.has(target);
						})
						.set("ai", target => {
							const player = get.player();
							return get.damageEffect(target, player, player, "thunder") * (target.hp == 1 ? 2 : 1);
						})
						.forResult();
					if (!result.bool) {
						return;
					}
					const target = result.targets[0];
					if (!logged) {
						logged = true;
						player.logSkill("shenfu", target, "thunder");
					} else {
						player.line(target, "thunder");
					}
					chosen.add(target);
					await target.damage("thunder");

					if (!target.getHistory("damage", evt => evt.getParent("shenfu") === event && evt._dyinged).length) {
						return;
					}
				} else {
					let result = await player
						.chooseTarget(get.prompt("shenfu"), "令一名角色摸一张牌或弃置其一张手牌", (card, player, target) => {
							return !get.event().getParent().chosen.has(target);
						})
						.set("ai", target => {
							const att = get.attitude(_status.event.player, target);
							const delta = target.hp - target.countCards("h");
							if (Math.abs(delta) == 1 && get.sgn(delta) == get.sgn(att)) {
								return 3 * Math.abs(att);
							}
							if (att > 0 || target.countCards("h") > 0) {
								return Math.abs(att);
							}
							return 0;
						})
						.forResult();
					if (!result) {
						return;
					}

					const target = result.targets[0];
					if (!logged) {
						logged = true;
						player.logSkill("shenfu", target);
					} else {
						player.line(target, "green");
					}
					chosen.add(target);
					if (target.countCards("h") === 0) {
						result = { index: 0 };
					} else {
						result = await player
							.chooseControl("摸一张牌", "弃置一张手牌")
							.set("prompt", "选择一项令" + get.translation(target) + "执行…")
							.set("goon", get.attitude(player, target) > 0 ? 0 : 1)
							.set("ai", () => _status.event.goon)
							.forResult();
					}

					if (result.index == 0) {
						await target.draw();
					} else {
						await target.chooseToDiscard("h", true);
					}
					if (target.hp !== target.countCards("h")) {
						return;
					}
				}
			}
		},
		ai: { expose: 0.25 },
	},
	qixian: {
		mod: {
			maxHandcardBase(player, num) {
				return 7;
			},
		},
	},
	chuyuan: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.player.isIn() && player.getExpansions("chuyuan").length < player.maxHp;
		},
		logTarget: "player",
		locked: false,
		async content(event, trigger, player) {
			await trigger.player.draw();
			if (!trigger.player.countCards("h")) {
				return;
			}

			const result = await trigger.player.chooseCard("h", true, "选择一张牌置于" + get.translation(player) + "的武将牌上作为「储」").forResult();
			player.addToExpansion(result.cards, trigger.player, "give").gaintag.add("chuyuan");
		},
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
		ai: {
			notemp: true,
		},
	},
	dengji: {
		audio: 2,
		derivation: ["tianxing", "new_rejianxiong", "rerende", "rezhiheng", "olluanji", "caopi_xingdong"],
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return player.getExpansions("chuyuan").length >= 3;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.addSkills(["tianxing", "new_rejianxiong"]);
			await player.loseMaxHp();
			await player.gain(player.getExpansions("chuyuan"), "gain2", "fromStorage");
		},
		ai: {
			combo: "chuyuan",
		},
	},
	tianxing: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.getExpansions("chuyuan").length >= 3;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.gain(player.getExpansions("chuyuan"), "gain2", "fromStorage");
			await player.removeSkills("chuyuan");
			const result = await player
				.chooseControl("rerende", "rezhiheng", "olluanji", "caopi_xingdong")
				.set("prompt", "选择获得一个技能")
				.set("ai", processAI)
				.forResult();
			await player.addSkills(result.control);

			return;

			function processAI() {
				const player = get.player();

				if (!player.hasSkill("luanji") && !player.hasSkill("olluanji") && player.getUseValue({ name: "wanjian" }) > 4) {
					return "olluanji";
				}
				if (!player.hasSkill("rezhiheng")) {
					return "rezhiheng";
				}
				if (!player.hasSkill("caopi_xingdong")) {
					return "caopi_xingdong";
				}
				return "rerende";
			}
		},
		ai: {
			combo: "chuyuan",
		},
	},
	rerende_shen_caopi: { audio: 1 },
	rezhiheng_shen_caopi: { audio: 1 },
	olluanji_shen_caopi: { audio: 1 },
	olzhiti: {
		audio: "drlt_zhiti",
		global: "olzhiti2",
		mod: {
			maxHandcard(player, num) {
				if (
					game.hasPlayer(function (current) {
						return current.isDamaged();
					})
				) {
					return num + 1;
				}
			},
		},
		trigger: { player: ["phaseDrawBegin2", "phaseEnd"] },
		forced: true,
		filter(event, player) {
			var num = event.name == "phase" ? 5 : 3;
			if (
				num == 3
					? event.numFixed
					: !game.hasPlayer(function (current) {
							return current.hasEnabledSlot();
						})
			) {
				return false;
			}
			return (
				game.countPlayer(function (current) {
					return current.isDamaged();
				}) >= num
			);
		},
		direct: true,
		async content(event, trigger, player) {
			if (trigger.name == "phaseDraw") {
				player.logSkill("olzhiti");
				trigger.num++;
				return;
			}

			const result = await player
				.chooseTarget(get.prompt("olzhiti"), "废除一名角色的一个随机装备栏", (card, player, target) => {
					return target.hasEnabledSlot();
				})
				.set("ai", target => {
					return -get.attitude(_status.event.player, target) * (target.countCards("e") + 1);
				})
				.forResult();

			if (result.bool) {
				const target = result.targets[0];
				player.logSkill("olzhiti", target);
				const list = [];
				for (let i = 1; i < 6; i++) {
					if (target.hasEnabledSlot(i)) {
						list.add(i == 3 || i == 4 ? 6 : i);
					}
				}
				const num = list.randomGet();
				if (num != 6) {
					await target.disableEquip(num);
				} else {
					await target.disableEquip(3, 4);
				}
			}
		},
	},
	olzhiti2: {
		mod: {
			maxHandcard(player, num) {
				if (player.isDamaged()) {
					return (
						num -
						game.countPlayer(function (current) {
							return current.hasSkill("olzhiti") && current.inRange(player);
						})
					);
				}
			},
		},
	},
	olduorui: {
		audio: "drlt_duorui",
		trigger: { source: "damageSource" },
		filter(event, player) {
			const target = event.player;
			if (!player.isPhaseUsing() || target.isDead()) {
				return false;
			}
			if (Object.keys(target.disabledSkills).some(key => target.disabledSkills[key].includes("olduorui_effect"))) {
				return false;
			}
			const skills = target.getStockSkills(false, true).filter(skill => {
				const info = get.info(skill);
				return !info.charlotte || !info.persevereSkill;
			});
			return skills.length > 0;
		},
		check(event, player) {
			if (get.attitude(player, event.player) >= 0) {
				return false;
			}
			if (event.getParent("phaseUse").skipped) {
				return true;
			}
			const nd = player.needsToDiscard();
			return (
				player.countCards("h", function (card) {
					return player.getUseValue(card, null, true) > 0 && (nd ? true : get.tag(card, "damage") > 0);
				}) == 0
			);
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			const skills = target.getStockSkills(false, true).filter(skill => {
				const info = get.info(skill);
				return !info.charlotte || !info.persevereSkill;
			});
			const list = skills.map(skill => [
				skill,
				`<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">${(() => {
					let str = get.translation(skill);
					if (!lib.skill[skill]?.nobracket) {
						str = `【${str}】`;
					}
					return str;
				})()}</div><div>${get.translation(skill, "info")}</div></div>`,
			]);
			const result = await player
				.chooseButton([`选择${get.translation(target)}武将牌上的一个技能并令其失效`, [list, "textbutton"]])
				.set("ai", button => {
					if (!get.event().check) {
						return 0;
					}
					const { link } = button;
					return get.skillRank(link, "inout");
				})
				.set("displayIndex", false)
				.set("check", get.info(event.skill).check(trigger, player))
				.forResult();
			event.result = {
				bool: result?.bool,
				cost_data: result?.links,
			};
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: [skill],
			} = event;
			target.disableSkill(event.name + "_effect", skill);
			target.addTempSkill(event.name + "_effect", { player: "phaseAfter" });
			game.log(player, "选择了", target, "的技能", `#g【${get.translation(skill)}】`);
			event.getParent("phaseUse").skipped = true;
		},
		subSkill: {
			effect: {
				onremove(player, skill) {
					player.enableSkill(skill);
				},
				locked: true,
				mark: true,
				charlotte: true,
				intro: {
					content(storage, player, skill) {
						const list = Object.keys(player.disabledSkills)
							.filter(key => player.disabledSkills[key].includes(skill))
							.flatMap(key => {
								return lib.translate[key + "_info"] ? [get.translation(key)] : [];
							});
						if (list.length) {
							return `失效技能：${list.join("、")}`;
						}
					},
				},
			},
		},
	},
	wuhun2: { audio: 2 },
	new_wuhun: {
		audio: "wuhun2",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.isIn();
		},
		forced: true,
		logTarget: "source",
		async content(event, trigger, player) {
			trigger.source.addMark("new_wuhun", trigger.num);
		},
		group: "new_wuhun_die",
		ai: {
			notemp: true,
			effect: {
				target: (card, player, target) => {
					if (!target.hasFriend()) {
						return;
					}
					let rec = get.tag(card, "recover"),
						damage = get.tag(card, "damage");
					if (!rec && !damage) {
						return;
					}
					if (damage && player.hasSkillTag("jueqing", false, target)) {
						return 1.7;
					}
					let die = [null, 1],
						temp;
					game.filterPlayer(i => {
						temp = i.countMark("new_wuhun");
						if (i === player && target.hp + target.hujia > 1) {
							temp++;
						}
						if (temp > die[1]) {
							die = [i, temp];
						} else if (temp === die[1]) {
							if (!die[0]) {
								die = [i, temp];
							} else if (get.attitude(target, i) < get.attitude(target, die[0])) {
								die = [i, temp];
							}
						}
					});
					if (die[0]) {
						if (damage) {
							return [1, 0, 1, (-6 * get.sgnAttitude(player, die[0])) / Math.max(1, target.hp)];
						}
						return [1, (6 * get.sgnAttitude(player, die[0])) / Math.max(1, target.hp)];
					}
				},
			},
		},
		marktext: "魇",
		intro: {
			name: "梦魇",
			content: "mark",
			onunmark: true,
		},
		subSkill: {
			die: {
				audio: "wuhun2",
				trigger: { player: "die" },
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.hasMark("new_wuhun");
					});
				},
				forced: true,
				direct: true,
				forceDie: true,
				skillAnimation: true,
				animationColor: "soil",
				async content(event, trigger, player) {
					let maxNum = 0;
					for (const current of game.players) {
						if (current === player) {
							continue;
						}

						const markNum = current.countMark("new_wuhun");
						maxNum = Math.max(maxNum, markNum);
					}
					const num = maxNum;
					let result = await player
						.chooseTarget(true, "请选择【武魂】的目标", "令其进行判定，若判定结果不为【桃】或【桃园结义】，则其死亡", (card, player, target) => {
							return target != player && target.countMark("new_wuhun") == _status.event.num;
						})
						.set("ai", target => -get.attitude(_status.event.player, target))
						.set("forceDie", true)
						.set("num", num)
						.forResult();
					if (!result.bool) {
						return;
					}

					const target = result.targets[0];
					event.target = target;
					player.logSkill("new_wuhun_die", target);
					player.line(target, { color: [255, 255, 0] });
					await game.delay(2);
					result = await target
						.judge(card => ["tao", "taoyuan"].includes(card.name) ? 10 : -10)
						.set("judge2", result => !result.bool)
						.forResult();
					if (!result.bool) {
						await target.die();
					}
				},
			},
		},
	},
	new_guixin: {
		audio: "guixin",
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			return game.hasPlayer(cur => {
				return cur !== player && cur.countCards("hej") > 0;
			});
		},
		check(event, player) {
			if (player.isTurnedOver() || event.num > 1) {
				return true;
			}
			var num = game.countPlayer(function (current) {
				if (current.countCards("he") && current != player && get.attitude(player, current) <= 0) {
					return true;
				}
				if (current.countCards("j") && current != player && get.attitude(player, current) > 0) {
					return true;
				}
			});
			return num >= 2;
		},
		getIndex(event, player) {
			return event.num;
		},
		async content(event, trigger, player) {
			let targets = game.filterPlayer();
			targets.remove(player);
			targets.sort(lib.sort.seat);
			player.line(targets, "green");
			const control = await player
				.chooseControl("手牌区", "装备区", "判定区")
				.set("ai", function () {
					if (
						game.hasPlayer(function (current) {
							return current.countCards("j") && current != player && get.attitude(player, current) > 0;
						})
					) {
						return 2;
					}
					return Math.floor(Math.random() * 3);
				})
				.set("prompt", "请选择优先获得的区域")
				.forResult();
			const range = {
				手牌区: ["h", "e", "j"],
				装备区: ["e", "h", "j"],
				判定区: ["j", "h", "e"],
			}[control.control || "手牌区"];
			while (targets.length > 0) {
				const target = targets.shift();
				for (var i = 0; i < range.length; i++) {
					var cards = target.getCards(range[i]);
					if (cards.length) {
						var card = cards.randomGet();
						await player.gain(card, target, "giveAuto", "bySelf");
						break;
					}
				}
			}
			await player.turnOver();
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			threaten(player, target) {
				if (target.hp == 1) {
					return 2.5;
				}
				return 1;
			},
			effect: {
				target(card, player, target) {
					if (
						!target._new_guixin_eff &&
						get.tag(card, "damage") &&
						target.hp >
							(player.hasSkillTag("damageBonus", true, {
								card: card,
								target: target,
							})
								? 2
								: 1)
					) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						target._new_guixin_eff = true;
						let gain = game.countPlayer(function (current) {
							if (target == current) {
								return 0;
							}
							if (get.attitude(target, current) > 0) {
								if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "new_guixin") && get.effect(current, cardx, current, current) < 0, "j")) {
									return 1.3;
								}
								return 0;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "new_guixin") && get.effect(current, cardx, current, current) > 0, "e")) {
								return 1.1;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "new_guixin"), "h")) {
								return 0.9;
							}
							return 0;
						});
						if (target.isTurnedOver()) {
							gain += 2.3;
						} else {
							gain -= 2.3;
						}
						delete target._new_guixin_eff;
						return [1, Math.max(0, gain)];
					}
				},
			},
		},
	},
	ol_shenfen: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("baonu") >= 6;
		},
		usable: 1,
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			player.removeMark("baonu", 6);
			const targets = game.filterPlayer(target => target !== player);
			player.line(targets, "green");

			await game.doAsyncInOrder(targets, target => target.damage("nocard"));
			await game.doAsyncInOrder(targets, async target => {
				const cards = target.getCards("e");
				await target.discard(cards).set("delay", false);
				if (cards.length) {
					await game.delay(0.5);
				}
			});
			await game.doAsyncInOrder(targets, async target => {
				const num = target.countCards("h");
				await target.chooseToDiscard(4, "h", true).set("delay", false);
				if (num > 0) {
					await game.delay(0.5);
				}
			});
			await player.turnOver();
		},
		ai: {
			combo: "baonu",
			order: 10,
			result: {
				player(player) {
					return game.countPlayer(function (current) {
						if (current != player) {
							return get.sgn(get.damageEffect(current, player, player));
						}
					});
				},
			},
		},
	},
	ol_wuqian: {
		audio: 2,
		enable: "phaseUse",
		derivation: "wushuang",
		filter(event, player) {
			return player.countMark("baonu") >= 2 && game.hasPlayer(target => lib.skill.ol_wuqian.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target != player && !target.hasSkill("ol_wuqian_targeted");
		},
		async content(event, trigger, player) {
			const { target } = event;
			player.removeMark("baonu", 2);
			await player.addTempSkills("wushuang");
			player.popup("无双");
			// game.log(player,'获得了技能','#g【无双】');
			target.addTempSkill("ol_wuqian_targeted");
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (
						player.countCards("hs", card => {
							if (!player.getCardUsable({ name: card.name })) {
								return false;
							}
							if (!player.canUse(card, target)) {
								return false;
							}
							var eff1 = get.effect(target, card, player, player);
							_status.baonuCheck = true;
							var eff2 = get.effect(target, card, player, player);
							delete _status.baonuCheck;
							return eff2 > Math.max(0, eff1);
						})
					) {
						return -1;
					}
					return 0;
				},
			},
			combo: "baonu",
		},
		global: "ol_wuqian_ai",
		subSkill: {
			targeted: {
				charlotte: true,
				ai: { unequip2: true },
			},
			ai: {
				ai: {
					unequip2: true,
					skillTagFilter(player) {
						if (!_status.baonuCheck) {
							return false;
						}
					},
				},
			},
		},
	},
	wumou: {
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		filter(event) {
			return get.type(event.card) == "trick";
		},
		async content(event, trigger, player) {
			if (!player.hasMark("baonu")) {
				await player.loseHp();
				return;
			}
			
			const result = await player
				.chooseControlList(["移去一枚【暴怒】标记", "失去1点体力"], true)
				.set("ai", (event, player) => {
					if (get.effect(player, { name: "losehp" }, player, player) >= 0) {
						return 1;
					}
					if (player.storage.baonu > 6) {
						return 0;
					}
					if (player.hp + player.countCards("h", "tao") > 3) {
						return 1;
					}
					return 0;
				})
				.forResult();

			if (result.index == 0) {
				player.removeMark("baonu", 1);
			} else {
				await player.loseHp();
			}
		},
		ai: {
			effect: {
				player_use(card, player) {
					if (get.type(card) == "trick" && get.value(card) < 6) {
						return [0, -2];
					}
				},
			},
			neg: true,
		},
	},
	qinyin: {
		audio: 2,
		audioname: ["mb_zhouyu"],
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		logAudio: index => (typeof index === "number" ? "qinyin" + index + ".mp3" : 2),
		logAudio2: {
			mb_zhouyu: index => (typeof index === "number" ? `qinyin_mb_zhouyu${index}.mp3` : 2),
		},
		filter(event, player) {
			var cards = [];
			player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
					cards.addArray(evt.cards2);
				}
			});
			return cards.length > 1;
		},
		async content(event, trigger, player) {
			event.forceDie = true;
			if (typeof event.count !== "number") {
				event.count = 1;
			}

			for (let time = event.count; time > 0; time--) {
				let recover = 0;
				let lose = 0;
				const players = game.filterPlayer();
				for (const current of players) {
					if (current.hp < current.maxHp) {
						if (get.attitude(player, current) > 0) {
							if (current.hp < 2) {
								lose--;
								recover += 0.5;
							}
							lose--;
							recover++;
						} else if (get.attitude(player, current) < 0) {
							if (current.hp < 2) {
								lose++;
								recover -= 0.5;
							}
							lose++;
							recover--;
						}
					} else {
						if (get.attitude(player, current) > 0) {
							lose--;
						} else if (get.attitude(player, current) < 0) {
							lose++;
						}
					}
				}

				const prompt = get.prompt("qinyin") + "（剩余" + get.cnNumber(time) + "次）";
				const next = player.chooseControl("失去体力", "回复体力", "cancel2", ui.create.dialog(get.prompt("qinyin"), "hidden"));
				next.set("ai", () => {
					if (lose > recover && lose > 0) {
						return 0;
					}
					if (lose < recover && recover > 0) {
						return 1;
					}
					return 2;
				});

				const result = await next.forResult();
				if (result.control === "cancel2") {
					return;
				}

				player.logSkill("qinyin", null, null, null, [result.control == "回复体力" ? 2 : 1]);
				const bool = result.control === "回复体力";
				await game.doAsyncInOrder(game.filterPlayer(), async target => {
					if (bool) {
						await target.recover();
					} else {
						await target.loseHp();
					}
				});
			}
		},
		ai: {
			expose: 0.1,
			threaten: 2,
		},
	},
	lianpo: {
		audio: 2,
		audioname: ["new_simayi"],
		trigger: { global: "phaseAfter" },
		frequent: true,
		filter(event, player) {
			return player.getStat("kill") > 0;
		},
		async content(event, trigger, player) {
			await player.insertPhase();
		},
	},
	baonu: {
		audio: 2,
		marktext: "暴",
		trigger: {
			source: "damageSource",
			player: ["damageEnd", "enterGame"],
			global: "phaseBefore",
		},
		forced: true,
		filter(event) {
			return (event.name != "damage" && (event.name != "phase" || game.phaseNumber == 0)) || event.num > 0;
		},
		async content(event, trigger, player) {
			player.addMark("baonu", trigger.name == "damage" ? trigger.num : 2);
		},
		intro: {
			name: "暴怒",
			content: "mark",
		},
		ai: {
			combo: "ol_shenfen",
			maixie: true,
			maixie_hp: true,
		},
	},
	shenfen: {
		audio: 2,
		unique: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.storage.baonu >= 6;
		},
		skillAnimation: true,
		animationColor: "metal",
		limited: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.storage.baonu -= 6;
			player.markSkill("baonu");
			player.syncStorage("baonu");
			event.targets = game.filterPlayer();
			event.targets.remove(player);
			// event.targets.sort(lib.sort.seat);
			event.targets2 = event.targets.slice(0);
			player.line(event.targets, "green");

			await game.doAsyncInOrder(event.targets, target => target.damage());
			await game.doAsyncInOrder(event.targets2, async target => {
				if (target && target.countCards("he")) {
					await target.chooseToDiscard("he", true, 4);
				}
			})
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return game.countPlayer(function (current) {
						if (current != player) {
							return get.sgn(get.damageEffect(current, player, player));
						}
					});
				},
			},
			combo: "baonu",
		},
	},
	wuqian: {
		audio: 2,
		enable: "phaseUse",
		derivation: "wushuang",
		filter(event, player) {
			return player.storage.baonu >= 2 && !player.hasSkill("wushuang");
		},
		async content(event, trigger, player) {
			player.storage.baonu -= 2;
			player.addTempSkill("wushuang");
		},
		ai: {
			order: 5,
			result: {
				player(player) {
					if (!player.storage.shenfen) {
						return 0;
					}
					var cards = player.getCards("h", "sha");
					if (cards.length) {
						if (
							game.hasPlayer(function (current) {
								return player.canUse("sha", current) && get.effect(current, cards[0], player, player) > 0 && current.hasShan();
							})
						) {
							return 1;
						}
					}
					return 0;
				},
			},
			combo: "baonu",
		},
	},
	renjie: {
		audio: "renjie2",
		trigger: { player: "damageEnd" },
		forced: true,
		group: "renjie2",
		filter(event) {
			return event.num > 0;
		},
		async content(event, trigger, player) {
			player.addMark("renjie", trigger.num);
		},
		intro: {
			name2: "忍",
			content: "mark",
		},
		marktext: "忍",
		ai: {
			maixie: true,
			maixie_hp: true,
			combo: "jilue",
			effect: {
				target(card, player, target) {
					if ((!target.hasSkill("sbaiyin") && !target.hasSkill("jilue")) || !target.hasFriend()) {
						return;
					}
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -2];
					}
					if (get.tag(card, "damage")) {
						if (target.hp == target.maxHp) {
							if (!target.hasSkill("jilue")) {
								return [0, 1];
							}
							return [0.7, 1];
						}
						return 0.7;
					}
				},
			},
		},
	},
	renjie2: {
		audio: 2,
		mod: {
			aiOrder: (player, card, num) => {
				if (num <= 0 || typeof card !== "object" || !player.isPhaseUsing()) {
					return num;
				}
				if (player.hasSkill("sbaiyin")) {
					if (player.countMark("renjie") < 4 && player.getUseValue(card) < Math.min(4, (player.hp * player.hp) / 4)) {
						return 0;
					}
				} else if (player.hasSkill("jilue")) {
					if (player.countMark("renjie") < 3 && player.getUseValue(card) < Math.min(1.8, 0.18 * player.hp * player.hp)) {
						return 0;
					}
				}
			},
		},
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		sourceSkill: "renjie",
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return false;
			}
			var evt = event.getParent("phaseDiscard"),
				evt2 = event.getl(player);
			return evt && evt2 && evt.name == "phaseDiscard" && evt.player == player && evt2.cards2 && evt2.cards2.length > 0;
		},
		async content(event, trigger, player) {
			player.addMark("renjie", trigger.getl(player).cards2.length);
		},
	},
	sbaiyin: {
		skillAnimation: "epic",
		animationColor: "thunder",
		juexingji: true,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		audio: 2,
		filter(event, player) {
			return player.countMark("renjie") >= 4;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.addSkills("jilue");
		},
		derivation: ["jilue", "jilue_guicai", "jilue_fangzhu", "jilue_jizhi", "jilue_zhiheng", "jilue_wansha"],
		ai: { combo: "renjie" },
	},
	jilue: {
		audio: 2,
		group: ["jilue_guicai", "jilue_fangzhu", "jilue_wansha", "jilue_zhiheng", "jilue_jizhi"],
		ai: { combo: "renjie" },
	},
	jilue_guicai: {
		audio: 1,
		trigger: { global: "judge" },
		filter(event, player) {
			return player.countCards("hes") > 0 && player.hasMark("renjie");
		},
		async cost(event, trigger, player) {
			const next = player.chooseCard("是否弃置一枚“忍”，并发动〖鬼才〗？", "hes", filterCard);
			next.set("ai", processAI);

			event.result = await next.forResult();

			return;

			/**
			 * @param {Card} card
			 * @returns {boolean}
			 */
			function filterCard(card) {
				const player = get.player();
				const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
				if (mod2 != "unchanged") {
					return mod2;
				}
				const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
				if (mod != "unchanged") {
					return mod;
				}
				return true;
			}

			/**
			 * @param {Card} card
			 * @returns {number}
			 */
			function processAI(card) {
				const trigger = get.event().parent._trigger;
				const player = get.event().player;
				const result = trigger.judge(card) - trigger.judge(trigger.player.judging[0]);
				const attitude = get.attitude(player, trigger.player);
				let val = get.value(card);
				if (get.subtype(card) == "equip2") {
					val /= 2;
				} else {
					val /= 4;
				}
				if (attitude == 0 || result == 0) {
					return 0;
				}
				if (attitude > 0) {
					return result - val;
				}
				return -result - val;
			}
		},
		async content(event, trigger, player) {
			const { cards } = event;
			const [card] = cards;
			player.removeMark("renjie", 1);
			await player.respond(cards, "highlight", "noOrdering");
			if (trigger.player.judging[0].clone) {
				trigger.player.judging[0].clone.delete();
				game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
			}
			await game.cardsDiscard(trigger.player.judging[0]);
			trigger.player.judging[0] = card;
			trigger.orderingCards.addArray(cards);
			game.log(trigger.player, "的判定牌改为", card);
			await game.delay(2);
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	jilue_fangzhu: {
		audio: 1,
		trigger: { player: "damageEnd" },
		//priority:-1,
		filter(event, player) {
			return player.hasMark("renjie");
		},
		async cost(event, trigger, player) {
			const next = player.chooseTarget("是否弃置一枚“忍”，并发动【放逐】？", (card, player, target) => player !== target);
			next.set("ai", processAI);

			event.result = await next.forResult();

			return;

			/**
			 * @param {Player} target 
			 * @returns {number}
			 */
			function processAI(target) {
				if (target.hasSkillTag("noturn")) {
					return 0;
				}
				const player = get.player();
				const current = _status.currentPhase;
				const dis = current ? get.distance(current, target, "absolute") : 1;
				const draw = player.getDamagedHp();
				const att = get.attitude(player, target);
				if (att == 0) {
					return target.hasJudge("lebu") ? Math.random() / 3 : Math.sqrt(get.threaten(target)) / 5 + Math.random() / 2;
				}
				if (att > 0) {
					if (target.isTurnedOver()) {
						return att + draw;
					}
					if (draw < 4) {
						return -1;
					}
					if (current && target.getSeatNum() > current.getSeatNum()) {
						return att + draw / 3;
					}
					return (10 * Math.sqrt(Math.max(0.01, get.threaten(target)))) / (3.5 - draw) + dis / (2 * game.countPlayer());
				} else {
					if (target.isTurnedOver()) {
						return att - draw;
					}
					if (draw >= 5) {
						return -1;
					}
					if (current && target.getSeatNum() <= current.getSeatNum()) {
						return -att + draw / 3;
					}
					return (4.25 - draw) * 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) + (2 * game.countPlayer()) / dis;
				}
			}
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const { targets } = event;
			const [target] = targets;
			player.removeMark("renjie", 1);
			await target.draw(player.maxHp - player.hp);
			await target.turnOver();
		},
	},
	jilue_wansha: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasMark("renjie");
		},
		async content(event, trigger, player) {
			player.removeMark("renjie", 1);
			player.addTempSkill("rewansha");
		},
		ai: {
			order: () => {
				let player = _status.event.player;
				if (
					game.hasPlayer(current => {
						if (player === current || current.hp > 1 || get.attitude(player, current) >= 0) {
							return false;
						}
						return (player.inRange(current) && player.countCards("hs", "sha") && player.getCardUsable("sha")) || player.countCards("hs", card => get.name(card) !== "sha" && get.tag(card, "damage")) > 1;
					})
				) {
					return 9.2;
				}
				return 0;
			},
			result: {
				player: 1,
			},
			effect: {
				player(card, player, target) {
					if (target && player.hasSkill("rewansha") && target.hp <= 1 && get.tag(card, "damage")) {
						return [1, 0, 1.5, -1.5];
					}
				},
			},
		},
	},
	jilue_zhiheng: {
		audio: 1,
		audioname2: {},
		inherit: "rezhiheng",
		filter(event, player) {
			return player.hasMark("renjie");
		},
		prompt: "弃置一枚“忍”，然后弃置任意张牌并摸等量的牌。若弃置了所有的手牌，则可以多摸一张牌。",
		async content(event, trigger, player) {
			player.removeMark("renjie", 1);

			const playerCards = player.getCards("h");
			const discardingCards = event.cards;
			await player.discard(discardingCards);

			const extraNum = discardingCards.every(card => playerCards.includes(card)) ? 1 : 0;
			await player.draw(event.num + discardingCards.length);
		},
		ai: {
			order(item, player) {
				if (player.hasCard(i => get.value(i) > Math.max(6, 9 - player.hp), "he")) {
					return 1;
				}
				return 10;
			},
			result: {
				player(player) {
					var num = 0;
					var cards = player.getCards("he");
					for (var i = 0; i < cards.length; i++) {
						if (get.value(cards[i]) < 6) {
							num++;
						}
					}
					if (cards.length > 2) {
						return 1;
					}
					// if (cards.length == 2 && player.storage.jilue > 1) {
					// }
					return 0;
				},
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return player.isPhaseUsing() && !player.getStat().skill.jilue_zhiheng && player.hasCard(card => get.name(card) !== "tao", "h");
				}
			},
		},
	},
	jilue_jizhi: {
		audio: 1,
		trigger: { player: "useCard" },
		filter(event, player) {
			return get.type(event.card, "trick") == "trick" && event.card.isCard && player.hasMark("renjie");
		},
		async content(event, trigger, player) {
			player.removeMark("renjie", 1);
			const result = await player.draw("nodelay").forResult();
			event.card = result.cards[0];

			if (get.type(event.card) !== "basic") {
				return;
			}

			const result2 = await player
				.chooseBool(`是否弃置${get.translation(event.card)}并令本回合手牌上限+1？`)
				.set("ai", (evt, player) => _status.currentPhase === player && player.needsToDiscard(-3) && _status.event.value < 6)
				.set("value", get.value(event.card, player))
				.forResult();

			if (result2.bool) {
				await player.discard(event.card);
				player.addTempSkill("jilue_jizhi_clear");
				player.addMark("jilue_jizhi_clear", 1, false);
			}
		},
		subSkill: {
			clear: {
				charlotte: true,
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("jilue_jizhi_clear");
					},
				},
				intro: { content: "手牌上限+#" },
			},
		},
	},
	wushen: {
		mod: {
			cardname(card, player, name) {
				if (get.suit(card) == "heart") {
					return "sha";
				}
			},
			cardnature(card, player) {
				if (get.suit(card) == "heart") {
					return false;
				}
			},
			targetInRange(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return true;
					}
				}
			},
			cardUsable(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return Infinity;
					}
				}
			},
		},
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && get.suit(event.card) == "heart";
		},
		async content(event, trigger, player) {
			trigger.directHit.addArray(game.players);
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				if (player.stat[player.stat.length - 1].card.sha > 0) {
					player.stat[player.stat.length - 1].card.sha--;
				}
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondSha") && current < 0) {
						return 0.6;
					}
				},
			},
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.card.name == "sha" && get.suit(arg.card) == "heart";
			},
		},
	},
	wuhun: {
		audio: "wuhun2",
		trigger: { player: "die" },
		filter(event) {
			return event.source && event.source.isIn();
		},
		forced: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "soil",
		logTarget: "source",
		async content(event, trigger, player) {
			const num = trigger.source.getHp();
			if (num > 0) {
				await trigger.source.loseHp(num);
			}
		},
		ai: {
			threaten(player, target) {
				if (target.hp == 1) {
					if (player.getHp() <= 0) {
						return 100;
					}
					return 0.2;
				}
				return 0.8;
			},
			effect: {
				target(card, player, target, current) {
					if (player.getHp() <= 0) {
						return;
					}
					if (!target.hasFriend()) {
						return;
					}
					if (target.hp <= 1 && get.tag(card, "damage")) {
						return [1, 0, 0, -2 * player.getHp()];
					}
				},
			},
		},
	},
	guixin: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return game.hasPlayer(cur => {
				return cur !== player && cur.countCards("hej") > 0;
			});
		},
		check(event, player) {
			if (player.isTurnedOver() || event.num > 1) {
				return true;
			}
			var num = game.countPlayer(function (current) {
				if (current.countCards("he") && current != player && get.attitude(player, current) <= 0) {
					return true;
				}
				if (current.countCards("j") && current != player && get.attitude(player, current) > 0) {
					return true;
				}
			});
			return num >= 2;
		},
		getIndex(event, player) {
			return event.num;
		},
		async content(event, trigger, player) {
			let targets = game.filterPlayer(current => current != player).sortBySeat();
			player.line(targets, "green");
			await player.gainMultiple(targets, "hej");
			await player.turnOver();
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			threaten(player, target) {
				if (target.hp == 1) {
					return 2.5;
				}
				return 0.5;
			},
			effect: {
				target(card, player, target) {
					if (
						!target._guixin_eff &&
						get.tag(card, "damage") &&
						target.hp >
							(player.hasSkillTag("damageBonus", true, {
								card: card,
								target: target,
							})
								? 2
								: 1)
					) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						target._guixin_eff = true;
						let gain = game.countPlayer(function (current) {
							if (target == current) {
								return 0;
							}
							if (get.attitude(target, current) > 0) {
								if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "guixin") && get.effect(current, cardx, current, current) < 0, "ej")) {
									return 1.3;
								}
								return 0;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "guixin") && get.effect(current, cardx, current, current) > 0, "ej")) {
								return 1.1;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "guixin"), "h")) {
								return 0.9;
							}
							return 0;
						});
						if (target.isTurnedOver()) {
							gain += 2.3;
						} else {
							gain -= 2.3;
						}
						delete target._guixin_eff;
						return [1, Math.max(0, gain)];
					}
				},
			},
		},
	},
	qixing: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const getStars = player.addToExpansion(get.cards(7), "draw");
			getStars.gaintag.add("qixing");
			await getStars;

			// 下面内容直接复制的qixing2，仅ai做了改变
			const expansions = player.getExpansions("qixing");
			const cards = player.getCards("h");
			if (!expansions.length || !cards.length) {
				return;
			}

			const next = player.chooseToMove("七星：是否交换“星”和手牌？");
			next.set("list", [
				[`${get.translation(player)}（你）的星`, expansions],
				["手牌区", cards],
			]);
			next.set("filterMove", (from, to) => typeof to != "number");
			next.set("processAI", processAI);

			const result = await next.forResult();
			if (result.bool) {
				const pushs = result.moved[0];
				const gains = result.moved[1];
				pushs.removeArray(expansions);
				gains.removeArray(cards);
				if (!pushs.length || pushs.length !== gains.length) {
					return;
				}
				player.logSkill("qixing2");
				const addStars = player.addToExpansion(pushs, player, "giveAuto");
				addStars.gaintag.add("qixing");
				await addStars;
				await player.gain(gains, "draw");
			}

			return;

			/**
			 * @typedef {[string, Card[]]} MoveItem
			 * @typedef {MoveItem[]} MoveList
			 * @param {MoveList} list
			 * @return {[Card[], Card[]]}
			 */
			function processAI(list) {
				const player = get.player();

				const cards = list[0][1].concat(list[1][1]).sort((a, b) => get.useful(a) - get.useful(b));
				const cards2 = cards.splice(0, player.getExpansions("qixing").length);
				return [cards2, cards];
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("qixing");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张星";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("qixing");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张星";
				}
			},
		},
		group: ["qixing2"],
		ai: {
			notemp: true,
		},
	},
	qixing2: {
		trigger: { player: "phaseDrawAfter" },
		direct: true,
		sourceSkill: "qixing",
		filter(event, player) {
			return player.getExpansions("qixing").length > 0 && player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const expansions = player.getExpansions("qixing");
			const cards = player.getCards("h");
			if (!expansions.length || !cards.length) {
				return;
			}

			const next = player.chooseToMove("七星：是否交换“星”和手牌？");
			next.set("list", [
				[`${get.translation(player)}（你）的星`, expansions],
				["手牌区", cards],
			]);
			next.set("filterMove", (from, to) => typeof to != "number");
			next.set("processAI", processAI);

			const result = await next.forResult();
			if (result.bool) {
				const pushs = result.moved[0];
				const gains = result.moved[1];
				pushs.removeArray(expansions);
				gains.removeArray(cards);
				if (!pushs.length || pushs.length !== gains.length) {
					return;
				}
				player.logSkill("qixing2");
				const addStars = player.addToExpansion(pushs, player, "giveAuto");
				addStars.gaintag.add("qixing");
				await addStars;
				await player.gain(gains, "draw");
			}

			return;

			/**
			 * @typedef {[string, Card[]]} MoveItem
			 * @typedef {MoveItem[]} MoveList
			 * @param {MoveList} list
			 * @return {[Card[], Card[]]}
			 */
			function processAI(list) {
				const player = get.player();

				const cards = list[0][1].concat(list[1][1]).sort((a, b) => get.value(a) - get.value(b));
				const cards2 = cards.splice(0, player.getExpansions("qixing").length);
				return [cards2, cards];
			}
		},
	},
	dawu: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.getExpansions("qixing").length;
		},
		audio: 2,
		async cost(event, trigger, player) {
			const {
				bool,
				targets,
				links: cost_data,
			} = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), player.getExpansions("qixing")],
					selectButton: [1, game.countPlayer()],
					filterTarget: true,
					selectTarget() {
						return ui.selected.buttons.length;
					},
					complexSelect: true,
					ai1(button) {
						const { player, allUse } = get.event();
						const targets = game.filterPlayer(target => {
							if (target.isMin() || target.hasSkill("biantian2") || target.hasSkill("dawu2")) {
								return false;
							}
							let att = get.attitude(player, target);
							if (att >= 4) {
								if (target.hp > 2 && (target.isHealthy() || target.hasSkillTag("maixie"))) {
									return false;
								}
								if (allUse || target.hp == 1) {
									return true;
								}
								if (target.hp == 2 && target.countCards("he") <= 2) {
									return true;
								}
							}
							return false;
						});
						if (ui.selected.buttons.length < targets.length) {
							return 1;
						}
						return 0;
					},
					ai2(target) {
						const { player, allUse } = get.event();
						if (target.isMin() || target.hasSkill("biantian2") || target.hasSkill("dawu2")) {
							return 0;
						}
						let att = get.attitude(player, target);
						if (att >= 4) {
							if (target.hp > 2 && (target.isHealthy() || target.hasSkillTag("maixie"))) {
								return 0;
							}
							if (allUse || target.hp == 1) {
								return att;
							}
							if (target.hp == 2 && target.countCards("he") <= 2) {
								return att * 0.7;
							}
							return 0;
						}
						return -1;
					},
				})
				.set("allUse", player.getExpansions("qixing").length >= game.countPlayer(current => get.attitude(player, current) > 4) * 2)
				.forResult();
			event.result = {
				bool: bool,
				targets: targets?.sortBySeat(),
				cost_data: cost_data,
			};
		},
		async content(event, trigger, player) {
			const { targets, cost_data: cards } = event;
			targets.forEach(target => {
				target.addAdditionalSkill(`dawu_${player.playerid}`, "dawu2");
				target.markAuto("dawu2", [player]);
			});
			player.addTempSkill("dawu3", { player: "phaseBeginStart" });
			await player.loseToDiscardpile(cards);
		},
		ai: {
			combo: "qixing",
		},
	},
	dawu2: {
		charlotte: true,
		ai: {
			nofire: true,
			nodamage: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && !get.tag(card, "thunderDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
		intro: {
			content(storage) {
				return `共有${storage.length}枚标记`;
			},
		},
	},
	dawu3: {
		trigger: { global: "damageBegin4" },
		sourceSkill: "dawu",
		filter(event, player) {
			return !event.hasNature("thunder") && event.player.getStorage("dawu2").includes(player);
		},
		forced: true,
		charlotte: true,
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.cancel();
		},
		onremove(player) {
			game.countPlayer2(current => {
				if (current.getStorage("dawu2").includes(player)) {
					current.unmarkAuto("dawu2", [player]);
					current.removeAdditionalSkill(`dawu_${player.playerid}`);
				}
			}, true);
		},
	},
	kuangfeng: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.getExpansions("qixing").length;
		},
		async cost(event, trigger, player) {
			const {
				bool,
				targets,
				links: cost_data,
			} = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), player.getExpansions("qixing")],
					selectButton: 1,
					filterTarget: true,
					ai1(button) {
						if (
							game.hasPlayer(target => {
								return get.attitude(get.player(), target) < 0;
							})
						) {
							return 1;
						}
						return 0;
					},
					ai2(target) {
						return -get.attitude(get.player(), target);
					},
				})
				.forResult();
			event.result = {
				bool: bool,
				targets: targets?.sortBySeat(),
				cost_data: cost_data,
			};
		},
		async content(event, trigger, player) {
			const { targets, cost_data: cards } = event;
			targets.forEach(target => {
				target.addAdditionalSkill(`kuangfeng_${player.playerid}`, "kuangfeng2");
				target.markAuto("kuangfeng2", [player]);
			});
			player.addTempSkill("kuangfeng3", { player: "phaseBeginStart" });
			await player.loseToDiscardpile(cards);
		},
		ai: {
			combo: "qixing",
		},
	},
	kuangfeng2: {
		charlotte: true,
		intro: {
			content(storage) {
				return `共有${storage.length}枚标记`;
			},
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "fireDamage") && current < 0) {
						return 1.5;
					}
				},
			},
		},
	},
	kuangfeng3: {
		trigger: { global: "damageBegin3" },
		sourceSkill: "kuangfeng",
		filter(event, player) {
			return event.hasNature("fire") && event.player.getStorage("kuangfeng2").includes(player);
		},
		charlotte: true,
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.num++;
		},
		onremove(player) {
			game.countPlayer2(current => {
				if (current.getStorage("kuangfeng2").includes(player)) {
					current.unmarkAuto("kuangfeng2", player);
					current.removeAdditionalSkill(`kuangfeng_${player.playerid}`);
				}
			}, true);
		},
	},
	yeyan: {
		limited: true,
		audio: 2,
		enable: "phaseUse",
		filterCard(card, player) {
			return !ui.selected.cards.some(cardx => get.suit(cardx, player) == get.suit(card, player));
		},
		selectCard: [0, 4],
		filterTarget(card, player, target) {
			var length = ui.selected.cards.length;
			return length == 0 || length == 4;
		},
		selectTarget() {
			if (ui.selected.cards.length == 4) {
				return [1, 2];
			}
			if (ui.selected.cards.length == 0) {
				return [1, 3];
			}
			game.uncheck("target");
			return [1, 3];
		},
		complexCard: true,
		complexSelect: true,
		line: "fire",
		forceDie: true,
		animationColor: "metal",
		skillAnimation: "legend",
		check(card) {
			if (!lib.skill.yeyan.getBigFire(get.event().player)) {
				return -1;
			}
			return 1 / (get.value(card) || 0.5);
		},
		multitarget: true,
		multiline: true,
		async contentBefore(event, trigger, player) {
			player.awakenSkill(event.skill);
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;

			if (cards.length !== 4) {
				await game.doAsyncInOrder(targets, target => target.damage(1, "fire", "nocard"));
				return;
			}

			await player.loseHp(3);

			if (targets.length === 1) {
				const result = await player
					.chooseControl("2点", "3点")
					.set("prompt", "请选择伤害点数")
					.set("ai", () => "3点")
					.set("forceDie", true)
					.forResult();

				await targets[0].damage("fire", result.control === "2点" ? 2 : 3, "nocard");
			} else {
				const result = await player
					.chooseTarget("请选择受到2点伤害的角色", true, (card, player, target) => {
						return get.event().targets.includes(target);
					})
					.set("ai", () => 1)
					.set("forceDie", true)
					.set("targets", targets)
					.forResult();

				const target2 = result.targets[0];
				targets.sortBySeat();
				for (const target of targets) {
					let damageNum = 1;
					if (target === target2) {
						damageNum = 2;
					}
					await target.damage("fire", damageNum, "nocard");
				}
			}
		},
		ai: {
			order(item, player) {
				return lib.skill.yeyan.getBigFire(player) ? 10 : 1;
			},
			fireAttack: true,
			result: {
				target(player, target) {
					if (player.hasUnknown()) {
						return 0;
					}
					const att = get.sgn(get.attitude(player, target));
					const targets = game.filterPlayer(target => get.damageEffect(target, player, player, "fire") && (!lib.skill.yeyan.getBigFire(player) || (target.hp <= 3 && !target.hasSkillTag("filterDamage", null, { player: player }))));
					if (!targets.includes(target)) {
						return 0;
					}
					if (lib.skill.yeyan.getBigFire(player)) {
						if (ui.selected.targets.length) {
							return 0;
						}
						if (!(targets.length == 1 || (att < 0 && target.identity && target.identity.indexOf("zhu") != -1))) {
							return 0;
						}
					}
					return att * get.damageEffect(target, player, player, "fire");
				},
			},
		},
		getBigFire(player) {
			if (player.getDiscardableCards(player, "h").reduce((list, card) => list.add(get.suit(card, player)), []).length < 4) {
				return false;
			}
			const targets = game.filterPlayer(target => get.damageEffect(target, player, player, "fire") && target.hp <= 3 && !target.hasSkillTag("filterDamage", null, { player: player }));
			if (!targets.length) {
				return false;
			}
			if (targets.length == 1 || targets.some(target => get.attitude(player, target) < 0 && target.identity && target.identity.indexOf("zhu") != -1)) {
				let suits = player.getDiscardableCards(player, "h").reduce((map, card) => {
						const suit = get.suit(card, player);
						if (!map[suit]) {
							map[suit] = [];
						}
						return map;
					}, {}),
					cards = [];
				Object.keys(suits).forEach(i => {
					suits[i].addArray(player.getDiscardableCards(player, "h").filter(card => get.suit(card) == i));
					cards.add(suits[i].sort((a, b) => get.value(a) - get.value(b))[0]);
				});
				return player.hp + player.countCards("h", card => !cards.includes(card) && player.canSaveCard(card, player)) - 3 > 0;
			}
			return false;
		},
	},
	longhun: {
		audio: 4,
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || player.needsToDiscard() < 2) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num - 3.6;
				}
			},
			aiValue(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3.6;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1.8;
				}
			},
			aiUseful(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1;
				}
			},
		},
		locked: false,
		group: ["longhun1", "longhun2", "longhun3", "longhun4"],
		ai: {
			fireAttack: true,
			skillTagFilter(player, tag) {
				switch (tag) {
					case "respondSha": {
						if (player.countCards("he", { suit: "diamond" }) < Math.max(1, player.hp)) {
							return false;
						}
						break;
					}
					case "respondShan": {
						if (player.countCards("he", { suit: "club" }) < Math.max(1, player.hp)) {
							return false;
						}
						break;
					}
					case "save": {
						if (player.countCards("he", { suit: "heart" }) < Math.max(1, player.hp)) {
							return false;
						}
						break;
					}
					default:
						return true;
				}
			},
			maixie: true,
			respondSha: true,
			respondShan: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "recover") && target.hp >= 1) {
						return [0, 0];
					}
					if (!target.hasFriend()) {
						return;
					}
					if ((get.tag(card, "damage") == 1 || get.tag(card, "loseHp")) && target.hp > 1) {
						return [0, 1];
					}
				},
			},
			threaten(player, target) {
				if (target.hp == 1) {
					return 2;
				}
				return 0.5;
			},
		},
	},
	longhun1: {
		audio: true,
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "longhun",
		prompt() {
			return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张红桃牌当作桃使用";
		},
		position: "hes",
		check(card, event) {
			if (_status.event.player.hp > 1) {
				return 0;
			}
			return 10 - get.value(card);
		},
		selectCard() {
			return Math.max(1, _status.event.player.hp);
		},
		viewAs: { name: "tao" },
		viewAsFilter(player) {
			return player.countCards("hes", { suit: "heart" }) >= player.hp;
		},
		filterCard(card) {
			return get.suit(card) == "heart";
		},
	},
	longhun2: {
		audio: true,
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "longhun",
		prompt() {
			return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张方片当作火杀使用或打出";
		},
		position: "hes",
		check(card, event) {
			if (_status.event.player.hp > 1) {
				return 0;
			}
			return 10 - get.value(card);
		},
		selectCard() {
			return Math.max(1, _status.event.player.hp);
		},
		viewAs: { name: "sha", nature: "fire" },
		viewAsFilter(player) {
			return player.countCards("hes", { suit: "diamond" }) >= player.hp;
		},
		filterCard(card) {
			return get.suit(card) == "diamond";
		},
	},
	longhun3: {
		audio: true,
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "longhun",
		prompt() {
			return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张黑桃牌当作无懈可击使用";
		},
		position: "hes",
		check(card, event) {
			if (_status.event.player.hp > 1) {
				return 0;
			}
			return 7 - get.value(card);
		},
		selectCard() {
			return Math.max(1, _status.event.player.hp);
		},
		viewAs: { name: "wuxie" },
		viewAsFilter(player) {
			return player.countCards("hes", { suit: "spade" }) >= player.hp;
		},
		filterCard(card) {
			return get.suit(card) == "spade";
		},
	},
	longhun4: {
		audio: true,
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "longhun",
		prompt() {
			return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张梅花牌当作闪使用或打出";
		},
		position: "hes",
		check(card, event) {
			if (_status.event.player.hp > 1) {
				return 0;
			}
			return 10 - get.value(card);
		},
		selectCard() {
			return Math.max(1, _status.event.player.hp);
		},
		viewAsFilter(player) {
			return player.countCards("hes", { suit: "club" }) >= player.hp;
		},
		viewAs: { name: "shan" },
		filterCard(card) {
			return get.suit(card) == "club";
		},
	},
	juejing: {
		mod: {
			maxHandcard(player, num) {
				return 2 + num;
			},
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, "recover")) {
					return num;
				}
				if (player.needsToDiscard() > 1) {
					return num;
				}
				return 0;
			},
		},
		audio: true,
		trigger: { player: "phaseDrawBegin2" },
		//priority:-5,
		filter(event, player) {
			return !event.numFixed && player.hp < player.maxHp;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num += player.getDamagedHp();
		},
	},
	relonghun: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || player.needsToDiscard() < 2) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num - 3.6;
				}
			},
			aiValue(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3.6;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1.8;
				}
			},
			aiUseful(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1;
				}
			},
		},
		locked: false,
		//技能发动时机
		enable: ["chooseToUse", "chooseToRespond"],
		//发动时提示的技能描述
		prompt: "将♦牌当做杀，♥牌当做桃，♣牌当做闪，♠牌当做无懈可击使用或打出",
		//动态的viewAs
		viewAs(cards, player) {
			if (cards.length) {
				var name = false,
					nature = null;
				//根据选择的卡牌的花色 判断要转化出的卡牌是闪还是火杀还是无懈还是桃
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
				if (name) {
					return { name: name, nature: nature };
				}
			}
			return null;
		},
		//AI选牌思路
		check(card) {
			if (ui.selected.cards.length) {
				return 0;
			}
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
				if (name2 == get.suit(card, player)) {
					return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
				}
				return 0;
			}
			return 1;
		},
		//选牌数量
		selectCard: [1, 2],
		//确保选择第一张牌后 重新检测第二张牌的合法性 避免选择两张花色不同的牌
		complexCard: true,
		//选牌范围：手牌区和装备区和木马
		position: "hes",
		//选牌合法性判断
		filterCard(card, player, event) {
			//如果已经选了一张牌 那么第二张牌和第一张花色相同即可
			if (ui.selected.cards.length) {
				return get.suit(card, player) == get.suit(ui.selected.cards[0], player);
			}
			event = event || _status.event;
			//获取当前时机的卡牌选择限制
			var filter = event._backup.filterCard;
			//获取卡牌花色
			var name = get.suit(card, player);
			//如果这张牌是梅花并且当前时机能够使用/打出闪 那么这张牌可以选择
			if (name == "club" && filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event)) {
				return true;
			}
			//如果这张牌是方片并且当前时机能够使用/打出火杀 那么这张牌可以选择
			if (name == "diamond" && filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event)) {
				return true;
			}
			//如果这张牌是黑桃并且当前时机能够使用/打出无懈 那么这张牌可以选择
			if (name == "spade" && filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event)) {
				return true;
			}
			//如果这张牌是红桃并且当前时机能够使用/打出桃 那么这张牌可以选择
			if (name == "heart" && filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event)) {
				return true;
			}
			//上述条件都不满足 那么就不能选择这张牌
			return false;
		},
		//判断当前时机能否发动技能
		filter(event, player) {
			//获取当前时机的卡牌选择限制
			var filter = event.filterCard;
			//如果当前时机能够使用/打出火杀并且角色有方片 那么可以发动技能
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) {
				return true;
			}
			//如果当前时机能够使用/打出闪并且角色有梅花 那么可以发动技能
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) {
				return true;
			}
			//如果当前时机能够使用/打出桃并且角色有红桃 那么可以发动技能
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) {
				return true;
			}
			//如果当前时机能够使用/打出无懈可击并且角色有黑桃 那么可以发动技能
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) {
				return true;
			}
			return false;
		},
		ai: {
			respondSha: true,
			respondShan: true,
			//让系统知道角色“有杀”“有闪”
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
				if (!player.countCards("hes", { suit: name })) {
					return false;
				}
			},
			//AI牌序
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
							if (temp > max) {
								max = temp;
							}
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		//让系统知道玩家“有无懈”“有桃”
		hiddenCard(player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hs") > 0) {
				return true;
			}
			if (name == "wuxie") {
				return player.countCards("hes", { suit: "spade" }) > 0;
			}
			if (name == "tao") {
				return player.countCards("hes", { suit: "heart" }) > 0;
			}
		},
		group: ["relonghun_num", "relonghun_discard"],
		subSkill: {
			num: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				filter(event) {
					var evt = event;
					return ["sha", "tao"].includes(evt.card.name) && evt.skill == "relonghun" && evt.cards && evt.cards.length == 2;
				},
				async content(event, trigger, player) {
					trigger.baseDamage++;
				},
			},
			discard: {
				trigger: { player: ["useCardAfter", "respondAfter"] },
				forced: true,
				popup: false,
				logTarget() {
					return _status.currentPhase;
				},
				autodelay(event) {
					return event.name == "respond" ? 0.5 : false;
				},
				filter(evt, player) {
					return ["shan", "wuxie"].includes(evt.card.name) && evt.skill == "relonghun" && evt.cards && evt.cards.length == 2 && _status.currentPhase && _status.currentPhase != player && _status.currentPhase.countDiscardableCards(player, "he");
				},
				async content(event, trigger, player) {
					//game.log(trigger.card)
					//game.log(trigger.cards)
					player.line(_status.currentPhase, "green");
					await player.discardPlayerCard(_status.currentPhase, "he", true);
				},
			},
		},
	},
	xinlonghun: {
		audio: "longhun",
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || player.needsToDiscard() < 2) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num - 3.6;
				}
			},
			aiValue(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3.6;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1.8;
				}
			},
			aiUseful(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1;
				}
			},
		},
		locked: false,
		enable: ["chooseToUse", "chooseToRespond"],
		prompt: "将♦手牌当做火【杀】，♥手牌当做【桃】，♣手牌当做【闪】，♠手牌当做【无懈可击】使用或打出",
		viewAs(cards, player) {
			if (cards.length) {
				var name = false,
					nature = null;
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
				if (name) {
					return { name: name, nature: nature };
				}
			}
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
						player.countCards("hs", function (card) {
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
				if (name2 == get.suit(card, player)) {
					return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
				}
				return 0;
			}
			return 1;
		},
		position: "hs",
		filterCard(card, player, event) {
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.suit(card, player);
			if (name == "club" && filter({ name: "shan", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "diamond" && filter({ name: "sha", cards: [card], nature: "fire" }, player, event)) {
				return true;
			}
			if (name == "spade" && filter({ name: "wuxie", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "heart" && filter({ name: "tao", cards: [card] }, player, event)) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			var filter = event.filterCard;
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hs", { suit: "diamond" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hs", { suit: "club" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hs", { suit: "heart" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hs", { suit: "spade" })) {
				return true;
			}
			return false;
		},
		logAudio(event, player) {
			return "longhun" + (4 - lib.suit.indexOf(get.suit(event.cards[0], player))) + ".mp3";
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
				if (!player.countCards("hs", { suit: name })) {
					return false;
				}
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao"];
					var map = { sha: "diamond", tao: "heart" };
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (
							player.countCards("hs", function (card) {
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
							if (temp > max) {
								max = temp;
							}
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard(player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hs") > 0) {
				return true;
			}
			if (name == "wuxie") {
				return player.countCards("hs", { suit: "spade" }) > 0;
			}
			if (name == "tao") {
				return player.countCards("hs", { suit: "heart" }) > 0;
			}
		},
	},
	xinjuejing: {
		mod: {
			maxHandcard(player, num) {
				return 2 + num;
			},
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, "recover")) {
					return num;
				}
				if (player.needsToDiscard() > 1) {
					return num;
				}
				return 0;
			},
		},
		audio: 2,
		trigger: { player: ["dying", "dyingAfter"] },
		forced: true,
		async content(event, trigger, player) {
			await player.draw();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (target.getHp() > 1) {
						return;
					}
					if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
						return [1, 1];
					}
				},
			},
		},
	},
	shelie: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			trigger.changeToZero();
			const cards = get.cards(5, true);
			await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`, true).set("clearArena", false);
			const list = cards.map(card => get.suit(card)).unique();
			const result = await player
				.chooseCardButton(`涉猎：获取花色各不相同的牌`, cards, list.length, true)
				.set("filterButton", function (button) {
					for (let i = 0; i < ui.selected.buttons.length; i++) {
						if (get.suit(ui.selected.buttons[i].link) == get.suit(button.link)) {
							return false;
						}
					}
					return true;
				})
				.set("ai", function (button) {
					return get.value(button.link, _status.event.player);
				})
				.forResult();
			game.broadcastAll(ui.clear);
			if (result?.links?.length) {
				await player.gain(result.links, "gain2");
			}
		},
		ai: {
			threaten: 1.2,
		},
	},
	gongxin: {
		audio: 2,
		audioname: ["re_lvmeng"],
		audioname2: { gexuan: "gongxin_gexuan" },
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		async content(event, trigger, player) {
			const { target } = event;
			const cards = target.getCards("h");
			const result = await player
				.chooseToMove_new("攻心")
				.set("list", [
					[get.translation(target) + "的手牌", cards],
					[["弃置"], ["置于牌堆顶"]],
				])
				.set("filterOk", moved => {
					return (
						moved[1]
							.slice()
							.concat(moved[2])
							.filter(card => get.suit(card) == "heart").length == 1
					);
				})
				.set("filterMove", (from, to, moved) => {
					if (moved[0].includes(from.link) && moved[1].length + moved[2].length >= 1 && [1, 2].includes(to)) {
						return false;
					}
					return get.suit(from) == "heart";
				})
				.set("processAI", list => {
					let card = list[0][1]
						.slice()
						.filter(card => {
							return get.suit(card) == "heart";
						})
						.sort((a, b) => {
							return get.value(b) - get.value(a);
						})[0];
					if (!card) {
						return false;
					}
					return [list[0][1].slice().remove(card), [card], []];
				})
				.forResult();
			if (result.bool) {
				if (result.moved[1].length) {
					await target.discard(result.moved[1]);
				} else {
					await player.showCards(result.moved[2], get.translation(player) + "对" + get.translation(target) + "发动了【攻心】");
					await target.lose(result.moved[2], ui.cardPile, "visible", "insert");
				}
			}
		},
		ai: {
			threaten: 1.5,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
			order: 10,
			expose: 0.4,
		},
	},
	nzry_longnu: {
		mark: true,
		locked: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (player.storage.nzry_longnu == true) {
					return "锁定技，出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你的锦囊牌均视为雷杀且无使用次数限制";
				}
				return "锁定技，出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你的红色手牌均视为火杀且无距离限制";
			},
		},
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		forced: true,
		async content(event, trigger, player) {
			player.changeZhuanhuanji("nzry_longnu");
			if (player.storage.nzry_longnu != true) {
				await player.loseMaxHp();
			} else {
				await player.loseHp();
			}
			await player.draw();

			if (player.storage.nzry_longnu != true) {
				player.addTempSkill("nzry_longnu_2", "phaseUseAfter");
			} else {
				player.addTempSkill("nzry_longnu_1", "phaseUseAfter");
			}
		},
		subSkill: {
			1: {
				mod: {
					cardname(card, player) {
						if (get.color(card) == "red") {
							return "sha";
						}
					},
					cardnature(card, player) {
						if (get.color(card) == "red") {
							return "fire";
						}
					},
					targetInRange(card) {
						if (get.color(card) == "red") {
							return true;
						}
					},
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondSha") && current < 0) {
								return 0.6;
							}
						},
					},
					respondSha: true,
				},
			},
			2: {
				mod: {
					cardname(card, player) {
						if (["trick", "delay"].includes(lib.card[card.name].type)) {
							return "sha";
						}
					},
					cardnature(card, player) {
						if (["trick", "delay"].includes(lib.card[card.name].type)) {
							return "thunder";
						}
					},
					cardUsable(card, player) {
						if (card.name == "sha" && game.hasNature(card, "thunder")) {
							return Infinity;
						}
					},
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondSha") && current < 0) {
								return 0.6;
							}
						},
					},
					respondSha: true,
				},
			},
		},
		ai: {
			fireAttack: true,
			halfneg: true,
			threaten: 1.05,
		},
	},
	nzry_jieying: {
		audio: 2,
		locked: true,
		global: "g_nzry_jieying",
		ai: {
			effect: {
				target(card) {
					if (card.name == "tiesuo") {
						return "zeroplayertarget";
					}
				},
			},
		},
		group: ["nzry_jieying_1", "nzry_jieying_2"],
		subSkill: {
			1: {
				audio: "nzry_jieying",
				trigger: {
					player: ["linkBefore", "enterGame"],
					global: "phaseBefore",
				},
				forced: true,
				filter(event, player) {
					if (event.name == "link") {
						return player.isLinked();
					}
					return (event.name != "phase" || game.phaseNumber == 0) && !player.isLinked();
				},
				async content(event, trigger, player) {
					if (trigger.name != "link") {
						await player.link(true);
					} else {
						trigger.cancel();
					}
				},
				ai: {
					noLink: true,
				},
			},
			2: {
				audio: "nzry_jieying",
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && !current.isLinked();
					});
				},
				async cost(event, trigger, player) {
					const next = player.chooseTarget("请选择【结营】的目标");
					next.set("forced", true);
					next.set("filterTarget", (card, player, target) => target != player && !target.isLinked());
					next.set("ai", () => 1 + Math.random());

					event.result = await next.forResult();
				},
				async content(event, trigger, player) {
					const { targets } = event;
					await targets[0].link(true);
				},
			},
		},
	},
	g_nzry_jieying: {
		mod: {
			maxHandcard(player, num) {
				if (
					game.countPlayer(function (current) {
						return current.hasSkill("nzry_jieying");
					}) > 0 &&
					player.isLinked()
				) {
					return num + 2;
				}
			},
		},
	},
	nzry_junlve: {
		audio: 2,
		//marktext:"军",
		intro: {
			content: "当前有#个标记",
		},
		trigger: {
			player: "damageAfter",
			source: "damageSource",
		},
		forced: true,
		async content(event, trigger, player) {
			player.addMark("nzry_junlve", trigger.num);
		},
		ai: {
			combo: "nzry_cuike",
		},
	},
	nzry_cuike: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		async cost(event, trigger, player) {
			/** @type {string} */
			let prompt;
			if (player.countMark("nzry_junlve") % 2 == 1) {
				prompt = "是否发动【摧克】，对一名角色造成1点伤害？";
			} else {
				prompt = "是否发动【摧克】，横置一名角色并弃置其区域内的一张牌？";
			}

			const next = player.chooseTarget(prompt);
			next.set("ai", target => -get.attitude(player, target));

			event.result = await next.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			const [target] = targets;

			if (player.countMark("nzry_junlve") % 2 == 1) {
				await target.damage();
			} else {
				await target.link(true);
				await player.discardPlayerCard(target, 1, "hej", true);
			}

			if (player.countMark("nzry_junlve") <= 7) {
				return;
			}

			const next = player.chooseBool();
			next.set("ai", () => true);
			next.set("prompt", "是否弃置所有“军略”标记并对所有其他角色造成1点伤害？")

			const result = await next.forResult();
			if (result.bool) {
				const players = game.filterPlayer(target => target !== player)
				player.line(players);
				player.removeMark("nzry_junlve", player.countMark("nzry_junlve"));
				await game.doAsyncInOrder(players, target => target.damage());
			}
		},
		ai: {
			notemp: true,
		},
	},
	nzry_dinghuo: {
		audio: 2,
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("nzry_junlve") > 0;
		},
		check(event, player) {
			var num = game.countPlayer(function (current) {
				return get.attitude(player, current) < 0 && current.isLinked();
			});
			return (
				player.storage.nzry_junlve >= num &&
				num ==
					game.countPlayer(function (current) {
						return get.attitude(player, current) < 0;
					})
			);
		},
		filterTarget(card, player, target) {
			return target.isLinked();
		},
		selectTarget() {
			return [1, _status.event.player.countMark("nzry_junlve")];
		},
		multiline: true,
		multitarget: true,
		async content(event, trigger, player) {
			const { targets } = event;

			player.awakenSkill(event.name);
			player.storage.nzry_dinghuo = true;
			player.removeMark("nzry_junlve", player.countMark("nzry_junlve"));
			for (const target of targets) {
				await target.discard(target.getCards("e"))
			}
			
			const result = await player
				.chooseTarget(true, "对一名目标角色造成1点火焰伤害", (card, player, target) => {
					return _status.event.targets.includes(target)
				})
				.set("targets", targets)
				.set("ai", () => 1)
				.forResult();
			if (result.bool) {
				await result.targets[0].damage("fire", "nocard");
			}
		},
		ai: {
			order: 1,
			fireAttack: true,
			combo: "nzry_junlve",
			result: {
				target(player, target) {
					if (target.hasSkillTag("nofire")) {
						return 0;
					}
					if (lib.config.mode == "versus") {
						return -1;
					}
					if (player.hasUnknown()) {
						return 0;
					}
					return get.damageEffect(target, player) - target.countCards("e");
				},
			},
		},
	},
	drlt_duorui: {
		audio: 2,
		init(player, skill) {
			if (!player.storage.drlt_duorui) {
				player.storage.drlt_duorui = [];
			}
		},
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			if (player.storage.drlt_duorui.length) {
				return false;
			}
			return event.player.isIn() && _status.currentPhase == player;
		},
		check(event, player) {
			if (get.attitude(_status.event.player, event.player) >= 0) {
				return false;
			}
			if (player.hasEnabledSlot() && !player.hasEnabledSlot(5)) {
				return false;
			}
			return true;
		},
		bannedList: ["bifa", "buqu", "gzbuqu", "songci", "funan", "xinfu_guhuo", "reguhuo", "huashen", "rehuashen", "old_guhuo", "shouxi", "xinpojun", "taoluan", "xintaoluan", "xinfu_yingshi", "zhenwei", "zhengnan", "xinzhengnan"],
		logTarget: "player",
		async content(event, trigger, player) {
			const skills = getFilteredSkills(trigger.player);
			event.skills = skills;

			if (player.hasEnabledSlot()) {
				const next = player.chooseToDisable();
				next.set("ai", (event, player, list) => {
					if (list.includes("equip5")) {
						return "equip5";
					}
					return list.randomGet();
				});
				await next;
			}

			if (!skills.length) {
				return;
			}

			const result = await player
				.chooseButton(["请选择要获得的技能", [skills, "skill"]], true)
				.set("ai", () => Math.random())
				.forResult();
			
			player.addTempSkills(result.links, { player: "dieAfter" });
			player.storage.drlt_duorui = result.links;
			player.storage.drlt_duorui_player = trigger.player;
			trigger.player.storage.drlt_duorui = result.links;
			trigger.player.addTempSkill("drlt_duorui1", { player: "phaseAfter" });

			return;

			/**
			 * 获取能获得的技能列表
			 * 
			 * @param {Player} player - 角色对象
			 * @returns {string[]} 技能列表
			 */
			function getFilteredSkills(player) {
				const result = [];

				if (player.name1 != null) {
					result.push(...lib.character[player.name1][3]);
				} else {
					result.push(...lib.character[player.name][3]);
				}

				if (player.name2 != null) {
					result.push(...lib.character[player.name2][3])
				}

				return result.filter(skill => {
					const info = get.info(skill);
					return (
						info &&
						!info.charlotte &&
						!info.persevereSkill &&
						!info.hiddenSkill &&
						!info.zhuSkill &&
						!info.juexingji &&
						!info.limited &&
						!info.dutySkill &&
						!(info.unique && !info.gainable) &&
						!lib.skill.drlt_duorui.bannedList.includes(skill)
					);
				});
			}
		},
		group: ["duorui_clear"],
	},
	duorui_clear: {
		trigger: { global: ["phaseAfter", "dieAfter"] },
		filter(event, player) {
			if (!player.storage.drlt_duorui_player || !player.storage.drlt_duorui) {
				return false;
			}
			return player.storage.drlt_duorui_player == event.player && player.storage.drlt_duorui.length;
		},
		silent: true,
		forced: true,
		popup: false,
		async content(event, trigger, player) {
			player.removeSkills(player.storage.drlt_duorui[0]);
			delete player.storage.drlt_duorui_player;
			player.storage.drlt_duorui = [];
		},
	},
	drlt_duorui1: {
		init(player, skill) {
			player.disableSkill(skill, player.storage.drlt_duorui);
		},
		onremove(player, skill) {
			player.enableSkill(skill);
		},
		locked: true,
		mark: true,
		charlotte: true,
		intro: {
			content(storage, player, skill) {
				var list = [];
				for (var i in player.disabledSkills) {
					if (player.disabledSkills[i].includes(skill)) {
						list.push(i);
					}
				}
				if (list.length) {
					var str = "失效技能：";
					for (var i = 0; i < list.length; i++) {
						if (lib.translate[list[i] + "_info"]) {
							str += get.translation(list[i]) + "、";
						}
					}
					return str.slice(0, str.length - 1);
				}
			},
		},
	},
	drlt_zhiti: {
		audio: 2,
		trigger: {
			global: ["juedouAfter", "chooseToCompareAfter", "compareMultipleAfter"],
			player: "damageEnd",
		},
		filter(event, player) {
			if (!player.hasDisabledSlot()) {
				return false;
			}
			if (event.name == "juedou") {
				if (![event.player, event.target].includes(player)) {
					return false;
				}
				if (!event.turn || event.turn === player) {
					return false;
				}
				const opposite = event.player === player ? event.target : event.player;
				return opposite?.isIn() && opposite.inRangeOf(player) && opposite.isDamaged();
			} else if (event.name == "damage") {
				const opposite = event.source;
				return opposite?.isIn() && opposite.inRangeOf(player) && opposite.isDamaged();
			} else {
				if (![event.player, event.target].includes(player)) {
					return false;
				}
				if (event.preserve) {
					return false;
				}
				let opposite;
				if (player === event.player) {
					if (event.num1 > event.num2) {
						opposite = event.target;
					} else {
						return false;
					}
				} else {
					if (event.num1 < event.num2) {
						opposite = event.player;
					} else {
						return false;
					}
				}
				return opposite?.isIn() && opposite.inRangeOf(player) && opposite.isDamaged();
			}
		},
		forced: true,
		async content(event, trigger, player) {
			await player.chooseToEnable();
		},
		global: "g_drlt_zhiti",
	},
	g_drlt_zhiti: {
		mod: {
			maxHandcard(player, num) {
				if (player.isDamaged()) {
					return (
						num -
						game.countPlayer(function (current) {
							return current != player && current.hasSkill("drlt_zhiti") && current.inRange(player);
						})
					);
				}
			},
		},
	},
	drlt_poxi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
			//return target!=player;
		},
		async content(event, trigger, player) {
			const { target } = event;
			const playerCards = player.getCards("h");
			const targetCards = target.getCards("h");
			const playerDiscarding = [];
			const targetDiscarding = [];
			event.list1 = playerDiscarding;
			event.list2 = targetDiscarding;

			/** @type {GameEvent} */
			let next;
			if (playerCards.length > 0) {
				next = player.chooseButton(4, ["你的手牌", playerCards, `${get.translation(target.name)}的手牌`, targetCards]);
			} else {
				next = player.chooseButton(4, [`${get.translation(target.name)}的手牌`, target.getCards("h")]);
			}
			next.set("target", target);
			next.set("filterButton", filterButton);
			next.set("ai", processAI);

			const result = await next.forResult();
			if (!result.bool) {
				return;
			}

			// 弃牌
			const cards = result.links;
			for (const card of cards) {
				if (get.owner(card) === player) {
					playerDiscarding.push(card);
				} else {
					targetDiscarding.push(card);
				}
			}
			await discardMultiples([
				[player, playerDiscarding],
				[target, targetDiscarding],
			]);

			switch (playerDiscarding.length) {
				case 0:
					await player.loseMaxHp();
					break;
				case 1: {
					let evt = get.event();
					const records = new Set();
					while (true) {
						if (records.has(evt)) {
							break;
						}
						if (evt && evt.getParent) {
							records.add(evt);
							evt = evt.getParent();
						}
						if (evt.name === "phaseUse") {
							evt.skipped = true;
							break;
						}
					}
					player.addTempSkill("drlt_poxi1", { player: "phaseAfter" });
					break;
				}
				case 3:
					await player.recover();
					break;
				case 4:
					await player.draw(4);
					break;
			}


			return;

			/**
			 * @param {Button} button
			 * @returns {boolean}
			 */
			function filterButton(button) {
				const player = get.player();

				if (get.owner(button.link) && !lib.filter.canBeDiscarded(button.link, get.owner(button.link), player)) {
					return false;
				}

				return ui.selected.buttons.every(other => get.suit(button.link) !== get.suit(other.link));
			}

			/**
			 * @param {Button} button
			 * @returns {number}
			 */
			function processAI(button) {
				const { player, target } = get.event();

				const targetCards = target.getCards("h");
				/** @type {Card[]} */
				const chosenCards = ui.selected.buttons.map(buttonx => buttonx.link);
				const targetChosen = chosenCards.filter(card => targetCards.includes(card));

				const card = button.link;
				const owner = get.owner(card);
				const val = get.value(card) || 1;

				if (owner == target) {
					if (targetChosen.length > 1) {
						return 0;
					}
					if (targetChosen.length == 0 || player.hp > 3) {
						return val;
					}
					return 2 * val;
				}

				return 7 - val;
			}

			/**
			 * @param {[Player, Card[]][]} items
			 * @returns {GameEvent?}
			 */
			async function discardMultiples(items) {
				const losingList = items.filter(([_, cards]) => cards.length);
				if (losingList.length > 1) {
					return game
						.loseAsync({
							lose_list: losingList,
							discarder: losingList[0][0],
						})
						.setContent("discardMultiple")
				} else if (losingList.length === 1) {
					const [loser, cards] = losingList[0];
					return loser.discard(cards);
				} else {
					return null;
				}
			}
		},
		ai: {
			order: 6,
			result: {
				target(target, player) {
					return -1;
				},
			},
		},
	},
	drlt_poxi1: {
		mod: {
			maxHandcard(player, num) {
				return num - 1;
			},
		},
	},
	drlt_jieying: {
		audio: 2,
		trigger: { global: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed && event.player.hasMark("drlt_jieying_mark");
		},
		forced: true,
		locked: false,
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.num++;
		},
		global: "drlt_jieying_mark",
		group: ["drlt_jieying_1", "drlt_jieying_2", "drlt_jieying_3"],
		subSkill: {
			1: {
				audio: "drlt_jieying",
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					return !game.hasPlayer(current => current.hasMark("drlt_jieying_mark"));
				},
				forced: true,
				async content(event, trigger, player) {
					player.addMark("drlt_jieying_mark", 1);
				},
			},
			2: {
				audio: "drlt_jieying",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return (
						player.hasMark("drlt_jieying_mark") &&
						game.hasPlayer(target => {
							return target != player && !target.hasMark("drlt_jieying_mark");
						})
					);
				},
				async cost(event, trigger, player) {
					const prompt = get.prompt("drlt_jieying");
					const prompt2 = "将“营”交给一名角色；其摸牌阶段多摸一张牌，出牌阶段使用【杀】的次数上限+1且手牌上限+1。该角色回合结束后，其移去“营”标记，然后你获得其所有手牌。";
					const filterTarget = (card, player, target) => target !== player && !target.hasMark("drlt_jieying_mark");
					const next = player.chooseTarget(prompt, prompt2, filterTarget);
					next.set("ai", processAI);

					event.result = await next.forResult();

					return;

					/**
					 * @param {Player} target 
					 * @returns {number}
					 */
					function processAI(target) {
						const th = target.countCards("h");
						const att = get.attitude(_status.event.player, target);
						for (const skill in target.skills) {
							const info = get.info(skill);
							if (!info) {
								continue;
							}
							if (get.skillInfoTranslation(skill, target).includes("【杀】")) {
								return Math.abs(att);
							}
						}
						if (att > 0) {
							if (th > 3 && target.hp > 2) {
								return 0.6 * th;
							}
						}
						if (att < 1) {
							if (target.countCards("j", { name: "lebu" })) {
								return 1 + Math.min((1.5 + th) * 0.8, target.getHandcardLimit() * 0.7);
							}
							if (!th || target.getEquip("zhangba") || target.getEquip("guanshi")) {
								return 0;
							}
							if (!target.inRange(player) || player.countCards("hs", { name: "shan" }) > 1) {
								return Math.min((1 + th) * 0.3, target.getHandcardLimit() * 0.2);
							}
						}
						return 0;
					}
				},
				async content(event, trigger, player) {
					const { targets } = event;
					const [target] = targets;
					
					const mark = player.countMark("drlt_jieying_mark");
					player.removeMark("drlt_jieying_mark", mark);
					target.addMark("drlt_jieying_mark", mark);
				},
				ai: {
					effect: {
						player(card, player, target) {
							if (get.name(card) === "lebu" && get.attitude(player, target) < 0) {
								return 1 + Math.min((target.countCards("h") + 1.5) * 0.8, target.getHandcardLimit() * 0.7);
							}
						},
					},
				},
			},
			3: {
				audio: "drlt_jieying",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player != event.player && event.player.hasMark("drlt_jieying_mark") && event.player.isIn();
				},
				forced: true,
				logTarget: "player",
				async content(event, trigger, player) {
					let next = null;
					if (trigger.player.countCards("h") > 0) {
						next = trigger.player.give(trigger.player.getCards("h"), player);
					}
					trigger.player.clearMark("drlt_jieying_mark");
					if (next) {
						await next;
					}
				},
			},
			mark: {
				marktext: "营",
				intro: {
					name2: "营",
					content: "mark",
				},
				mod: {
					cardUsable(card, player, num) {
						if (player.hasMark("drlt_jieying_mark") && card.name == "sha") {
							return (
								num +
								game.countPlayer(function (current) {
									return current.hasSkill("drlt_jieying");
								})
							);
						}
					},
					maxHandcard(player, num) {
						if (player.hasMark("drlt_jieying_mark")) {
							return (
								num +
								game.countPlayer(function (current) {
									return current.hasSkill("drlt_jieying");
								})
							);
						}
					},
					aiOrder(player, card, num) {
						if (
							player.hasMark("drlt_jieying_mark") &&
							game.hasPlayer(current => {
								return current.hasSkill("drlt_jieying") && current != player && get.attitude(player, current) <= 0;
							})
						) {
							return Math.max(num, 0) + 1;
						}
					},
				},
				ai: {
					nokeep: true,
					skillTagFilter(player) {
						return (
							player.hasMark("drlt_jieying_mark") &&
							game.hasPlayer(current => {
								return current.hasSkill("drlt_jieying") && current != player;
							})
						);
					},
				},
			},
		},
	},
};

export default skills;
