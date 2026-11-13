import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//KiraKira⭐DokiDoki
	//哥布林
	goblin_yibao: {
		forced: true,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			return event.player?.isIn();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(3);
			if (trigger.source !== player) {
				return;
			}
			let list = [];
			for (let i = 1; i <= 5; i++) {
				const slot = `equip${i}`;
				if (target.hasEnabledSlot(slot)) {
					list.push(slot);
				}
			}
			if (get.is.mountCombined()) {
				if (list.includes("equip3") || list.includes("equip4")) {
					list.push("equip3_4");
				}
				list.remove("equip3", "equip4");
			}
			if (list.length) {
				const slot = list.randomGet();
				if (slot === "equip3_4") {
					await target.disableEquip(["equip3", "equip4"]);
				} else {
					await target.disableEquip([slot]);
				}
			}
			const num = Math.min(2, target.countGainableCards(player, "h"));
			if (num > 0 && target != player) {
				await player.gainPlayerCard(target, "h", num, "visible");
			}
		},
	},
	goblin_rulin: {
		forced: true,
		trigger: {
			source: "damageBegin4",
		},
		filter(event, player) {
			return event.num >= event.player.hp;
		},
		async content(event, trigger, player) {
			const num = trigger.num;
			trigger.cancel();
			await trigger.player.loseMaxHp();
			await player.gainMaxHp();
			await player.recover(num);
		},
	},
	goblin_kuangbao: {
		forced: true,
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		filter(event, player) {
			if ([event.source, event.player].some(current => !current?.isIn())) {
				return false;
			}
			return event.source.countCards("h") > event.player.countCards("h");
		},
		async content(event, trigger, player) {
			trigger.num++;
			if (trigger.card) {
				const evt = trigger.getParent(evtx => evtx.name == "useCard" && evtx.card == trigger.card, true);
				if (evt && evt.addCount !== false) {
					evt.addCount = false;
					const stat = evt.player.getStat("card"),
						name = evt.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
				}
			}
		},
	},
	goblin_feisheng: {
		forced: true,
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			let num = 0;
			player.getHistory("damage", evt => {
				num += evt.num;
			});
			return num > 1;
		},
		async content(event, trigger, player) {
			await player.loseMaxHp(2);
			player.insertPhase();
		},
	},
	goblin_shiqiang: {
		forced: true,
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		filter(event, player, name) {
			const target = event[name == "damageBegin1" ? "player" : "source"];
			if (!target?.isIn()) {
				return false;
			}
			const num = player.countCards("h") - target.countCards("h");
			if (num == 0) {
				return false;
			}
			return num > 0 === (name == "damageBegin1");
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	goblin_lingruo: {
		forced: true,
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			return event.player?.isIn() && event.player.countGainableCards(player, "he");
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.gainPlayerCard(trigger.player, "he", true);
		},
	},
	//董绾
	dongwan_moli: {
		transformSkill: true,
		trigger: {
			player: ["enterGame", "gainAfter"],
			global: ["phaseBefore", "loseAsyncAfter"],
		},
		markimage: "image/card/magic.png",
		intro: {
			name: "魔力·董绾",
			content(storage, player) {
				return `当前魔力：${storage}/5`;
			},
		},
		filter(event, player, name) {
			if (name == "enterGame") {
				return true;
			}
			if (event.name == "phase") {
				return game.phaseNumber == 0;
			}
			const evt = event.getParent("phaseDraw", true);
			if (evt?.player == player) {
				return false;
			}
			return event.getg?.(player)?.length;
		},
		frequent: true,
		async content(event, trigger, player) {
			const num = 1;
			player.addMark(event.name, num, false);
			game.log(player, "获得了", num, "点", "<span style='color: #d69dc8ff'>魔力</span>");
		},
		derivation: ["shinin_shengyan", "shinin_gongming"],
		group: "dongwan_moli_transform",
		subSkill: {
			transform: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					if (get.nameList(player).every(name => !get.character(name, 3).includes("dongwan_moli"))) {
						return false;
					}
					return player.countMark("dongwan_moli") >= 5;
				},
				skillAnimation: true,
				animationColor: "key",
				prompt2: "变身为闪耀战姬",
				async content(event, trigger, player) {
					const skill = "dongwan_moli";
					const cards = player.getDiscardableCards(player, "j");
					if (cards.length) {
						await player.modedDiscard(cards);
					}
					const name = get.nameList(player).find(name => get.character(name, 3).includes(skill));
					if (!name) {
						return;
					}
					const str = lib.translate[`${skill}_append`] || "";
					if (str.length) {
						player.chat(str);
					}
					const infox = player.getStorage(event.name, {}),
						targetName = infox.targetName || "awaken_shinin_dongwan",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					await player.reinitCharacter(name, targetName, false);
					player.markSkill(skill);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.name, info);
					player.addSkill("dongwan_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "变身成了<span style='color: #d69dc8ff'>闪耀战姬</span>！");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
			transformBack: {
				trigger: {
					player: "removeMark",
				},
				filter(event, player) {
					const { markName: name, num } = event;
					return name == "dongwan_moli" && !player.countMark(name) && num > 0;
				},
				charlotte: true,
				async cost(event, trigger, player) {
					const infox = player.getStorage(event.skill.slice(0, -4), {}),
						targetName = infox.targetName || "shinin_dongwan",
						name = infox.name || "awaken_shinin_dongwan",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					if (!get.nameList(player).includes(name)) {
						return;
					}
					await player.reinitCharacter(name, targetName, false);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.skill.slice(0, -4), info);
					player.removeSkill("dongwan_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "解除了<span style='color: #d69dc8ff'>闪耀战姬</span>变身");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
		},
	},
	shinin_shengyan: {
		forced: true,
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			if (!event.targets?.length) {
				return false;
			}
			const type = get.type(event.card);
			if (type != "basic" && type != "trick") {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			trigger.effectCount++;
			game.log(trigger.card, "额外结算一次");
			if (!game.hasPlayer(current => current != player)) {
				return;
			}
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						"圣焰：选择一项并对一名其他角色造成1点火焰伤害",
						[
							[
								["moli", "消耗1点魔力"],
								["hp", "失去1点体力"],
							],
							"tdnodes",
						],
					],
					filterTarget: lib.filter.notMe,
					ai1(button) {
						const player = get.player();
						if (player.hp > 1 && player.hasSkill("shinin_gongming")) {
							return button.link == "hp" ? 2 : 1;
						}
						return button.link == "hp" ? 1 : 2;
					},
					ai2(target) {
						const player = get.player();
						return get.damageEffect(target, player, player, "fire");
					},
					forced: true,
				})
				.forResult();
			if (result?.links?.length && result.targets?.length) {
				if (result.links[0] == "hp") {
					await player.loseHp();
				} else {
					player.removeMark("dongwan_moli", 1, false);
					game.log(player, `消耗了1点`, "<span style='color: #d69dc8ff'>魔力</span>");
				}
				const target = result.targets[0];
				player.line(target, "fire");
				target.damage("fire");
			}
		},
	},
	shinin_gongming: {
		trigger: {
			player: ["removeMark", "loseHpAfter"],
		},
		logTarget(event, player) {
			const getTitles = current => {
				return get
					.nameList(current)
					.map(name => get.characterTitle(name))
					.filter(title => title.length)
					.toUniqued();
			};
			return game.filterPlayer(current => getTitles(current).containsSome(...getTitles(player)));
		},
		filter(event, player) {
			if (event.name == "removeMark") {
				if (event.num <= 0 || event.markName != "dongwan_moli") {
					return false;
				}
			}
			const targets = get.info("shinin_gongming").logTarget(event, player);
			return targets?.length;
		},
		check(event, player) {
			const targets = get.info("shinin_gongming").logTarget(event, player);
			return targets.reduce((sum, current) => sum + get.effect(current, { name: "draw" }, player, player), 0) >= 0;
		},
		frequent(event, player) {
			const targets = get.info("shinin_gongming").logTarget(event, player);
			return player.getFriends(true).containsAll(...targets);
		},
		onremove: true,
		async content(event, trigger, player) {
			player.addMark(event.name, 1, false);
			await game.asyncDraw(event.targets, player.countMark(event.name));
		},
	},
	//吕玲绮
	lvlingqi_moli: {
		transformSkill: true,
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
			source: "damageBegin1",
		},
		markimage: "image/card/magic.png",
		intro: {
			name: "魔力·吕玲绮",
			content(storage, player) {
				return `当前魔力：${storage}/5`;
			},
		},
		getIndex(event, player) {
			if (event.name == "damage") {
				return event.num;
			}
			return 1;
		},
		filter(event, player, name) {
			if (player.countMark("lvlingqi_moli") >= 5) {
				return false;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		frequent: true,
		async content(event, trigger, player) {
			const num = 1;
			if (num > 0) {
				player.addMark(event.name, num, false);
				game.log(player, "获得了", num, "点", "<span style='color: #d69dc8ff'>魔力</span>");
			}
		},
		derivation: ["shinin_henghui", "shinin_moqi"],
		group: "lvlingqi_moli_transform",
		subSkill: {
			transform: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter(event, player) {
					if (get.nameList(player).every(name => !get.character(name, 3).includes("lvlingqi_moli"))) {
						return false;
					}
					if (player.countMark("lvlingqi_moli") < 5) {
						return false;
					}
					return true;
				},
				skillAnimation: true,
				animationColor: "key",
				prompt2: "变身为闪耀战姬",
				async content(event, trigger, player) {
					const skill = "lvlingqi_moli";
					const cards = player.getDiscardableCards(player, "j");
					if (cards.length) {
						await player.modedDiscard(cards);
					}
					const name = get.nameList(player).find(name => get.character(name, 3).includes(skill));
					if (!name) {
						return;
					}
					const str = lib.translate[`${skill}_append`] || "";
					if (str.length) {
						player.chat(str);
					}
					const infox = player.getStorage(event.name, {}),
						targetName = infox.targetName || "awaken_shinin_lvlingqi",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					await player.reinitCharacter(name, targetName, false);
					player.markSkill(skill);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.name, info);
					player.addSkill("lvlingqi_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "变身成了<span style='color: #d69dc8ff'>闪耀战姬</span>！");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
			transformBack: {
				trigger: {
					player: "removeMark",
				},
				filter(event, player) {
					const { markName: name, num } = event;
					if (event.getParent().name == "shinin_moqi_backup") {
						return false;
					}
					return name == "lvlingqi_moli" && !player.countMark(name) && num > 0;
				},
				charlotte: true,
				async cost(event, trigger, player) {
					const infox = player.getStorage(event.skill.slice(0, -4), {}),
						targetName = infox.targetName || "shinin_lvlingqi",
						name = infox.name || "awaken_shinin_lvlingqi",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					if (!get.nameList(player).includes(name)) {
						return;
					}
					await player.reinitCharacter(name, targetName, false);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.skill.slice(0, -4), info);
					player.removeSkill("lvlingqi_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "解除了<span style='color: #d69dc8ff'>闪耀战姬</span>变身");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
		},
	},
	shinin_henghui: {
		trigger: {
			player: "transformCharacter",
		},
		filter(event, player) {
			if (!get.character(event.targetName, 3).includes("shinin_henghui")) {
				return false;
			}
			return player.countMark("lvlingqi_moli");
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton(
					[
						"恒辉：选择任意项并消耗等量魔力",
						[
							[
								["limit", "使用【杀】的次数和造成的伤害+1"],
								["range", "使用【杀】无距离限制且可选目标数+2"],
								["draw", "摸五张牌并弃置装备区里的所有牌"],
							],
							"textbutton",
						],
					],
					[1, Math.min(3, player.countMark("lvlingqi_moli"))]
				)
				.set("ai", () => 1)
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: result.links,
				};
			}
		},
		locked: true,
		async content(event, trigger, player) {
			const { cost_data: list } = event;
			player.removeMark("lvlingqi_moli", list.length, false);
			game.log(player, `消耗了${list.length}点`, "<span style='color: #d69dc8ff'>魔力</span>");
			if (list.includes("limit")) {
				player.addSkill(`${event.name}_limit`);
			}
			if (list.includes("range")) {
				player.addSkill(`${event.name}_range`);
			}
			if (list.includes("draw")) {
				await player.draw(5);
				const cards = player.getDiscardableCards(player, "e");
				if (cards.length) {
					await player.modedDiscard(cards);
				}
			}
		},
		onremove(player, skill) {
			player.removeSkill(`${skill}_limit`);
			player.removeSkill(`${skill}_range`);
		},
		subSkill: {
			limit: {
				charlotte: true,
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					return event.card?.name == "sha";
				},
				forced: true,
				async content(event, trigger, player) {
					let num = player.hasSkill("shinin_moqi_effect") ? 2 : 1;
					trigger.num += num;
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							let count = player.hasSkill("shinin_moqi_effect") ? 2 : 1;
							return num + count;
						}
					},
				},
			},
			range: {
				charlotte: true,
				mod: {
					targetInRange: () => true,
					selectTarget(card, player, range) {
						if (range[1] == -1 || get.name(card) != "sha") {
							return;
						}
						let info = lib.card[card.name];
						if (!info || info.notarget || info.selectTarget != 1) {
							return;
						}
						let num = player.hasSkill("shinin_moqi_effect") ? 4 : 2;
						range[1] += num;
					},
				},
			},
		},
	},
	shinin_moqi: {
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasSkill("shinin_moqi_effect")) {
				return false;
			}
			return player.countMark("lvlingqi_moli") >= 3;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###魔契###" + get.skillInfoTranslation("shinin_moqi", null, false));
			},
			chooseControl(event, player) {
				let list = [],
					num = 3;
				while (num <= player.countMark("lvlingqi_moli")) {
					list.push(`${num}点`);
					num++;
				}
				return [...list, "cancel2"];
			},
			check() {
				return "cancel2";
			},
			backup(result, player) {
				return {
					audio: "shinin_moqi",
					index: result.index,
					skillAnimation: true,
					animationColor: "metal",
					async content(event, trigger, player) {
						const index = get.info(event.name).index + 1;
						player.removeMark("lvlingqi_moli", index, false);
						game.log(player, `消耗了${index}点`, "<span style='color: #d69dc8ff'>魔力</span>");
						const hp = player.getHp();
						if (hp > 0) {
							await player.loseHp(hp);
						}
						player.addSkill("shinin_moqi_effect");
						player.when("phaseJieshuBegin").step(async (event, trigger, player) => {
							const next = game.createEvent("transfromBack", false);
							next.player = player;
							next.skill = "lvlingqi_moli_transformBack";
							next.setContent(get.info("lvlingqi_moli_transformBack").cost);
							await next;
						});
					},
				};
			},
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
			},
		},
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
	},
	//芮姬
	ruiji_moli: {
		transformSkill: true,
		trigger: {
			player: ["enterGame", "damageBegin4"],
			global: "phaseBefore",
			source: "damageBegin1",
		},
		markimage: "image/card/magic.png",
		intro: {
			name: "魔力·芮姬",
			content(storage, player) {
				return `当前魔力：${storage}/5`;
			},
		},
		filter(event, player, name) {
			if (player.countMark("ruiji_moli") >= 5) {
				return false;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		frequent: true,
		async content(event, trigger, player) {
			const num = 1;
			if (num > 0) {
				player.addMark(event.name, num, false);
				game.log(player, "获得了", num, "点", "<span style='color: #d69dc8ff'>魔力</span>");
			}
		},
		derivation: ["shinin_shengcai", "shinin_guanghui"],
		group: "ruiji_moli_transform",
		subSkill: {
			transform: {
				trigger: {
					player: ["dying", "useSkillAfter", "logSkill"],
				},
				filter(event, player) {
					if (get.nameList(player).every(name => !get.character(name, 3).includes("ruiji_moli"))) {
						return false;
					}
					if (player.countMark("ruiji_moli") < 5) {
						return false;
					}
					if (event.name == "dying") {
						return player.hp <= 0;
					}
					if (event.type != "player") {
						return false;
					}
					const skill = get.sourceSkillFor(event);
					return skill == "dclingyin";
				},
				skillAnimation: true,
				animationColor: "key",
				prompt2: "变身为闪耀战姬",
				async content(event, trigger, player) {
					const skill = "ruiji_moli";
					const cards = player.getDiscardableCards(player, "j");
					if (cards.length) {
						await player.modedDiscard(cards);
					}
					const name = get.nameList(player).find(name => get.character(name, 3).includes(skill));
					if (!name) {
						return;
					}
					const str = lib.translate[`${skill}_append`] || "";
					if (str.length) {
						player.chat(str);
					}
					const infox = player.getStorage(event.name, {}),
						targetName = infox.targetName || "awaken_shinin_ruiji",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					await player.reinitCharacter(name, targetName, false);
					player.markSkill(skill);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.name, info);
					player.addSkill("ruiji_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "变身成了<span style='color: #d69dc8ff'>闪耀战姬</span>！");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
			transformBack: {
				trigger: {
					player: "removeMark",
				},
				filter(event, player) {
					const { markName: name, num } = event;
					return name == "ruiji_moli" && !player.countMark(name) && num > 0;
				},
				charlotte: true,
				async cost(event, trigger, player) {
					const infox = player.getStorage(event.skill.slice(0, -4), {}),
						targetName = infox.targetName || "shinin_ruiji",
						name = infox.name || "awaken_shinin_ruiji",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					if (!get.nameList(player).includes(name)) {
						return;
					}
					await player.reinitCharacter(name, targetName, false);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.skill.slice(0, -4), info);
					player.removeSkill("ruiji_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "解除了<span style='color: #d69dc8ff'>闪耀战姬</span>变身");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
		},
	},
	shinin_shengcai: {
		enable: "phaseUse",
		filterCard: true,
		position: "hs",
		selectCard() {
			const player = get.player();
			return [1, player.countMark("ruiji_moli")];
		},
		filter(event, player) {
			return player.countMark("ruiji_moli") && player.countCards("hs");
		},
		viewAs: {
			name: "sha",
			storage: {
				shinin_shengcai: true,
			},
		},
		check(card) {
			if (ui.selected.cards.length) {
				return 0;
			}
			return 15 - get.value(card);
		},
		async precontent(event, trigger, player) {
			const evt = event.getParent(),
				num = event.result.cards.length || 0;
			player
				.when("useCard")
				.filter(event => event.getParent() == evt)
				.step(async (event, trigger, player) => {
					trigger.baseDamage ??= 1;
					trigger.baseDamage += num;
					player.removeMark("ruiji_moli", num, false);
					game.log(player, `消耗了${num}点`, "<span style='color: #d69dc8ff'>魔力</span>");
				});
			evt.addCount = false;
		},
		locked: true,
		mod: {
			cardUsable(card, player) {
				if (card?.storage?.shinin_shengcai) {
					return Infinity;
				}
			},
			targetInRange(card, player) {
				if (card?.storage?.shinin_shengcai) {
					return true;
				}
			},
		},
	},
	shinin_guanghui: {
		forced: true,
		trigger: {
			global: ["useCard", "damageBegin1"],
		},
		filter(event, player) {
			if (event.name == "useCard") {
				return get.nameList(event.player).some(name => {
					return name.startsWith("awaken_shinin_");
				});
			}
			if (!event.source?.isIn() || player.countMark("ruiji_moli") >= 5) {
				return false;
			}
			const getTitles = current => {
				return get
					.nameList(current)
					.map(name => get.characterTitle(name))
					.filter(title => title.length)
					.toUniqued();
			};
			return getTitles(event.source).containsSome(...getTitles(player));
		},
		logTarget(event, player) {
			if (event.name == "useCard") {
				return event?.player;
			}
			return event?.source;
		},
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				player.addMark("ruiji_moli", 1, false);
				game.log(player, "获得了", 1, "点", "<span style='color: #d69dc8ff'>魔力</span>");
				return;
			}
			const targets = game.filterPlayer(current => {
				return get.nameList(current).every(name => {
					return !name.startsWith("awaken_shinin_");
				});
			});
			if (targets.length) {
				trigger.directHit.addArray(targets);
			}
		},
	},
	//吴国太
	wuguotai_moli: {
		transformSkill: true,
		trigger: {
			player: "enterGame",
			global: ["phaseBefore", "loseAfter", "loseAsyncAfter", "gainAfter", "addToExpansionAfter", "addJudgeAfter", "equipAfter"],
		},
		markimage: "image/card/magic.png",
		intro: {
			name: "魔力·吴国太",
			content(storage, player) {
				return `当前魔力：${storage}/5`;
			},
		},
		filter(event, player, name) {
			if (player.countMark("wuguotai_moli") >= 5) {
				return false;
			}
			if (name == "enterGame" || (event.name == "phase" && game.phaseNumber == 0)) {
				return true;
			}
			if (["addJudge", "equip"].includes(event.name) && event.player == player) {
				return true;
			}
			const evt = event.getl?.(player);
			return evt && (evt.es?.length || evt.js?.length);
		},
		frequent: true,
		async content(event, trigger, player) {
			const num = 1;
			if (num > 0) {
				player.addMark(event.name, num, false);
				game.log(player, "获得了", num, "点", "<span style='color: #d69dc8ff'>魔力</span>");
			}
		},
		derivation: ["shinin_fengshou", "shinin_susheng"],
		group: "wuguotai_moli_transform",
		subSkill: {
			transform: {
				trigger: {
					player: "loseAfter",
					global: ["loseAsyncAfter", "gainAfter", "addToExpansionAfter", "addJudgeAfter", "equipAfter"],
				},
				filter(event, player) {
					if (get.nameList(player).every(name => !get.character(name, 3).includes("wuguotai_moli"))) {
						return false;
					}
					if (!event?.getl?.(player)?.cards2?.length) {
						return false;
					}
					return player.countMark("wuguotai_moli") >= 5;
				},
				skillAnimation: true,
				animationColor: "key",
				prompt2: "变身为闪耀战姬",
				async content(event, trigger, player) {
					const skill = "wuguotai_moli";
					const cards = player.getDiscardableCards(player, "j");
					if (cards.length) {
						await player.modedDiscard(cards);
					}
					const name = get.nameList(player).find(name => get.character(name, 3).includes(skill));
					if (!name) {
						return;
					}
					const str = lib.translate[`${skill}_append`] || "";
					if (str.length) {
						player.chat(str);
					}
					const infox = player.getStorage(event.name, {}),
						targetName = infox.targetName || "awaken_shinin_wuguotai",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					await player.reinitCharacter(name, targetName, false);
					player.markSkill(skill);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.name, info);
					player.addSkill("wuguotai_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "变身成了<span style='color: #d69dc8ff'>闪耀战姬</span>！");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
			transformBack: {
				trigger: {
					player: "removeMark",
				},
				filter(event, player) {
					const { markName: name, num } = event;
					return name == "wuguotai_moli" && !player.countMark(name) && num > 0;
				},
				charlotte: true,
				async cost(event, trigger, player) {
					const infox = player.getStorage(event.skill.slice(0, -4), {}),
						targetName = infox.targetName || "shinin_wuguotai",
						name = infox.name || "awaken_shinin_wuguotai",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					if (!get.nameList(player).includes(name)) {
						return;
					}
					await player.reinitCharacter(name, targetName, false);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.skill.slice(0, -4), info);
					player.removeSkill("wuguotai_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "解除了<span style='color: #d69dc8ff'>闪耀战姬</span>变身");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
		},
	},
	shinin_fengshou: {
		trigger: {
			player: "transformCharacter",
		},
		filter(event, player) {
			if (!get.character(event.targetName, 3).includes("shinin_fengshou")) {
				return false;
			}
			return game.countPlayer(current => get.distance(current, player) == 1) >= 2;
		},
		logTarget(event, player) {
			return game.filterPlayer(current => get.distance(current, player) == 1);
		},
		frequent: true,
		async content(event, trigger, player) {
			const toSortPlayers = game.filterPlayer2(current => true, null, true);
			toSortPlayers.sortBySeat(game.findPlayer2(current => current.getSeatNum() >= 1 + toSortPlayers.length / 2, true));
			const next = player.chooseToMove("凤守：是否分配与你距离为1的所有角色的座次？");
			next.set("list", [
				[
					"座次",
					[
						toSortPlayers.map(i => `${i.getSeatNum()}|${i.name}`),
						(item, type, position, noclick, node) => {
							node = get.info("tamo").$createButton(item, type, position, noclick, node);
							const seat = parseInt(item.split("|")),
								target = game.findPlayer(current => current.getSeatNum() == seat);
							if (!target || get.distance(target, get.player()) !== 1) {
								node.classList.add("unselectable");
							}
							return node;
						},
					],
				],
			]);
			next.set("toSortPlayers", toSortPlayers.slice(0));
			next.set("filterMove", (from, to, moved) => {
				if (typeof to == "number") {
					return false;
				}
				const player = get.player(),
					filter = info => {
						const seat = parseInt(info.link.split("|")[0]);
						const target = game.findPlayer2(current => current.getSeatNum() == seat, true);
						return target?.isIn() && get.distance(target, player) == 1;
					};
				return filter(from) && filter(to);
			});
			next.set("processAI", () => {
				const players = get.event().toSortPlayers,
					player = get.player();
				let sortedTargets = players.filter(current => current?.isIn() && get.distance(current, player) == 1),
					sortedIndex = sortedTargets.map(current => players.indexOf(current));
				sortedTargets.sort((a, b) => get.attitude(player, a) - get.attitude(player, b));
				sortedIndex.forEach(index => {
					players[index] = sortedTargets.shift();
				});
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
			if (!player.countMark("wuguotai_moli")) {
				return;
			}
			const result2 = await player
				.chooseTarget("消耗任意点魔力，令等量角色受到的火焰伤害+1", [1, player.countMark("wuguotai_moli")])
				.set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player, "fire") >= 3;
				})
				.forResult();
			if (!result2?.bool || !result2.targets?.length) {
				return;
			}
			const num = result2.targets.length;
			player.removeMark("wuguotai_moli", num, false);
			game.log(player, `消耗了${num}点`, "<span style='color: #d69dc8ff'>魔力</span>");
			player.line(result2.targets, "green");
			const func = async target => {
				target.addSkill("shinin_fengshou_fire");
				target.addMark("shinin_fengshou_fire", 1, false);
			};
			await game.doAsyncInOrder(result2.targets, func);
		},
		subSkill: {
			fire: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "受到的火焰伤害+#",
				},
				trigger: {
					player: "damageBegin3",
				},
				filter(event, player) {
					return game.hasNature(event, "fire") && player.countMark("shinin_fengshou_fire");
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
			},
		},
	},
	shinin_susheng: {
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			if (!player.countMark("wuguotai_moli") || event.player.hp > 0) {
				return false;
			}
			const getTitles = current => {
				return get
					.nameList(current)
					.map(name => get.characterTitle(name))
					.filter(title => title.length)
					.toUniqued();
			};
			return getTitles(event.player).containsSome(...getTitles(player));
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseNumbers(get.prompt(event.skill, trigger.player), [
					{
						prompt: "消耗任意点魔力，令其恢复等量体力和等量魔力，然后你摸等量的牌",
						min: 1,
						max: player.countMark("wuguotai_moli"),
					},
				])
				.set("processAI", () => {
					const player = get.player(),
						target = get.event().getTrigger().player;
					if (get.attitude(player, target) <= 0) {
						return false;
					}
					if (player == target) {
						return [Math.min(player.maxHp - player.hp, player.countMark("wuguotai_moli") - 1)];
					}
					return [Math.min(1 - target.hp, player.countMark("wuguotai_moli"))];
				})
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: result.numbers[0],
					targets: [trigger.player],
				};
			}
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: num,
			} = event;
			player.removeMark("wuguotai_moli", num, false);
			game.log(player, `消耗了${num}点`, "<span style='color: #d69dc8ff'>魔力</span>");
			await target.recover(num);
			const names = get.nameList(target).filter(name => {
				if (name.startsWith("awaken_shinin_")) {
					return get.info(`${name.slice(14)}_moli`)?.transformSkill;
				}
				return name.startsWith("shinin_") && get.character(name, 3)?.includes(`${name.slice(7)}_moli`);
			});
			if (names.length > 0) {
				const result =
					names.length > 1
						? await player
								.chooseButton(["选择回复魔力的武将牌", [names, "character"]], true)
								.set("ai", button => {
									if (button.link.endsWith("wuguotai")) {
										return 2;
									}
									return 1 + Math.random();
								})
								.forResult()
						: {
								bool: true,
								links: names,
							};
				if (result?.bool) {
					const name = result.links?.map(name => {
						if (name.startsWith("awaken_shinin_")) {
							return `${name.slice(14)}_moli`;
						}
						return `${name.slice(7)}_moli`;
					})[0];
					const numx = Math.min(5 - target.countMark(name), num);
					if (numx > 0) {
						player.addMark(name, numx, false);
						game.log(player, "获得了", numx, "点", "<span style='color: #d69dc8ff'>魔力</span>");
					}
				}
			}
			await player.draw(num);
		},
	},
	//甄姬
	shinin_luoshen: {
		audio: "luoshen",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		async content(event, trigger, player) {
			event.bool = true;
			while (event.bool) {
				await player
					.judge(card => {
						return get.color(card) == "black" ? 1.5 : -1.5;
					})
					.set("judge2", result => result.bool)
					.set("callback", async (event, trigger, player) => {
						if (event.judgeResult.color == "black" && get.position(event.card, true) == "o") {
							await player.gain(event.card, "gain2");
						}
						const bool = event.judgeResult.color == "black" && (await player.chooseBool("是否继续发动【洛神】？").set("frequentSkill", "shinin_luoshen").forResult()).bool;
						if (!bool) {
							event.getParent(2).bool = false;
						}
					});
			}
			const num = player.getHistory("gain", evt => evt.getParent(event.name) == event).length;
			if (num > 0) {
				const name = `${event.name}_effect`;
				player.addTempSkill(name);
				player.addMark(name, num, false);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "本回合手牌上限+#",
				},
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("shinin_luoshen_effect");
					},
				},
			},
		},
	},
	zhenji_moli: {
		transformSkill: true,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		markimage: "image/card/magic.png",
		intro: {
			name: "魔力·甄宓",
			content(storage, player) {
				return `当前魔力：${storage}/5`;
			},
		},
		filter(event, player) {
			if (event.getParent("phaseDraw", true)) {
				return false;
			}
			return event.getg?.(player)?.length;
		},
		frequent: true,
		async content(event, trigger, player) {
			const cards = trigger.getg(player);
			await player.showCards(cards, `${get.translation(player)}发动了【魔力】`);
			const num = Math.min(5 - player.countMark(event.name), cards.filter(card => get.color(card) == "black").length);
			if (num > 0) {
				player.addMark(event.name, num, false);
				game.log(player, "获得了", num, "点", "<span style='color: #d69dc8ff'>魔力</span>");
			}
		},
		derivation: ["shinin_jinghong", "shinin_youlong", "shinin_haiyou"],
		group: "zhenji_moli_transform",
		subSkill: {
			transform: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					if (get.nameList(player).every(name => !get.character(name, 3).includes("zhenji_moli"))) {
						return false;
					}
					return player.countMark("zhenji_moli") >= 5;
				},
				skillAnimation: true,
				animationColor: "key",
				prompt2: "变身为闪耀战姬",
				async content(event, trigger, player) {
					const skill = "zhenji_moli";
					const cards = player.getDiscardableCards(player, "j");
					if (cards.length) {
						await player.modedDiscard(cards);
					}
					const name = get.nameList(player).find(name => get.character(name, 3).includes(skill));
					if (!name) {
						return;
					}
					const str = lib.translate[`${skill}_append`] || "";
					if (str.length) {
						player.chat(str);
					}
					const infox = player.getStorage(event.name, {}),
						targetName = infox.targetName || "awaken_shinin_zhenji",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					await player.reinitCharacter(name, targetName, false);
					player.markSkill(skill);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.name, info);
					player.addSkill("zhenji_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "变身成了<span style='color: #d69dc8ff'>闪耀战姬</span>！");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
			transformBack: {
				trigger: {
					player: "removeMark",
				},
				filter(event, player) {
					const { markName: name, num } = event;
					return name == "zhenji_moli" && !player.countMark(name) && num > 0;
				},
				charlotte: true,
				async cost(event, trigger, player) {
					const infox = player.getStorage(event.skill.slice(0, -4), {}),
						targetName = infox.targetName || "shinin_zhenji",
						name = infox.name || "awaken_shinin_zhenji",
						info = {
							name: targetName,
							targetName: name,
							hp: player.hp,
							maxHp: player.maxHp,
						};
					if (!get.nameList(player).includes(name)) {
						return;
					}
					await player.reinitCharacter(name, targetName, false);
					if (!Object.keys(infox).length) {
						let { hp, maxHp } = get.character(targetName);
						if (get.mode() == "doudizhu" || game.players.length + game.dead.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								maxHp++;
								hp++;
							}
						}
						infox.name = name;
						infox.targetName = targetName;
						infox.hp = hp;
						infox.maxHp = maxHp;
					}
					player.setStorage(event.skill.slice(0, -4), info);
					player.removeSkill("zhenji_moli_transformBack");
					player.maxHp = infox.maxHp;
					player.hp = infox.hp;
					player.update();
					game.log(player, "解除了<span style='color: #d69dc8ff'>闪耀战姬</span>变身");
					const next = game.createEvent("transformCharacter", false);
					next.player = player;
					next.targetName = targetName;
					next.setContent("emptyEvent");
					await next;
					if (player.getHp() <= 0) {
						await player.dying({});
					}
				},
			},
		},
	},
	shinin_jinghong: {
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			return game.filterPlayer(current => event.getg?.(current)?.length);
		},
		filter(event, player, name, target) {
			if (event.getParent("shinin_jinghong", true)) {
				return false;
			}
			if (!player.countMark("zhenji_moli")) {
				return false;
			}
			const getTitles = current => {
				return get
					.nameList(current)
					.map(name => get.characterTitle(name))
					.filter(title => title.length)
					.toUniqued();
			};
			return getTitles(target).containsSome(...getTitles(player));
		},
		check(event, player, name, target) {
			return get.attitude(player, target) > 0;
		},
		locked: false,
		logTarget: (_1, _2, _3, target) => target,
		async content(event, trigger, player) {
			player.removeMark("zhenji_moli", 1, false);
			game.log(player, "消耗了1点", "<span style='color: #d69dc8ff'>魔力</span>");
			const target = event.targets[0];
			event.bool = true;
			while (event.bool) {
				await target
					.judge(card => {
						return get.color(card) == "black" ? 1.5 : -1.5;
					})
					.set("judge2", result => result.bool)
					.set("callback", async (event, trigger, player) => {
						if (event.judgeResult.color == "black" && get.position(event.card, true) == "o") {
							await player.gain(event.card, "gain2");
						}
						if (event.judgeResult.color !== "black") {
							event.getParent(2).bool = false;
						}
					});
			}
		},
		group: "shinin_jinghong_limit",
		subSkill: {
			limit: {
				trigger: { player: "useCard1" },
				filter(event, player) {
					return get.color(event.card) == "black" && event.addCount !== false;
				},
				firstDo: true,
				async cost(event, trigger, player) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
				},
			},
		},
		mod: {
			cardUsable(card, player, num) {
				const color = get.color(card);
				if (color == "unsure" || color == "black") {
					return Infinity;
				}
			},
			ignoredHandcard(card, player) {
				if (get.color(card, player) == "black") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.color(card, player) == "black") {
					return false;
				}
			},
		},
	},
	shinin_youlong: {
		trigger: {
			global: "damageEnd",
			source: "damageBegin",
		},
		filter(event, player, name) {
			if (name == "damageEnd") {
				return game.hasNature(event, "ice") && event.player?.isIn();
			}
			return event.nature !== "ice";
		},
		forced: true,
		logTarget(event, player, name) {
			if (name == "damageEnd") {
				return event.player;
			}
			return false;
		},
		async content(event, trigger, player) {
			if (event.triggername == "damageBegin") {
				game.setNature(trigger, "ice");
				return;
			}
			const map = player.getStorage(event.name, new Map()),
				target = event.targets[0];
			const count = (map.has(target) ? map.get(target) : 0) + 1;
			map.set(target, count);
			player.setStorage(event.name, map, true);
			target.markSkill("shinin_youlong_effect");
			player.markSkill("shinin_youlong_effect");
		},
		init(player, skill) {
			game.addGlobalSkill(`${skill}_effect`);
			player.addSkill(`${skill}_directHit`);
		},
		subSkill: {
			directHit: {
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					const targets = get.info("shinin_youlong_directHit").logTarget(event, player);
					return targets?.length;
				},
				logTarget(event, player) {
					const map = player?.getStorage("shinin_youlong", new Map());
					return game.filterPlayer(current => map.has(current));
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(event.targets);
				},
			},
			effect: {
				trigger: {
					player: ["phaseDrawBegin2", "phaseEnd"],
				},
				filter(event, player) {
					if (event.name != "phase" && event.numFixed) {
						return false;
					}
					const playerMap = player.getStorage("shinin_youlong", new Map());
					return game.hasPlayer(current => {
						if (current == player) {
							return false;
						}
						const map = current.getStorage("shinin_youlong", new Map());
						return map.has(player) || (event.name != "phase" && playerMap.has(current));
					});
				},
				intro: {
					markcount(storage, player) {
						const playerMap = player.getStorage("shinin_youlong", new Map());
						let num = 0;
						game.countPlayer(current => {
							if (current == player) {
								return false;
							}
							const map = current.getStorage("shinin_youlong", new Map());
							if (map.has(player)) {
								num -= map.get(player);
							}
							if (playerMap.has(current)) {
								num += playerMap.get(current);
							}
						});
						return num;
					},
					content(storage, player) {
						const playerMap = player.getStorage("shinin_youlong", new Map());
						let num = 0;
						game.countPlayer(current => {
							if (current == player) {
								return false;
							}
							const map = current.getStorage("shinin_youlong", new Map());
							if (map.has(player)) {
								num -= map.get(player);
							}
							if (playerMap.has(current)) {
								num += playerMap.get(current);
							}
						});
						return `摸牌阶段摸牌数${num >= 0 ? "+" : ""}${num}，计算与其他角色距离${num <= 0 ? "+" : ""}${-num}`;
					},
				},
				locked: true,
				async cost(event, trigger, player) {
					const playerMap = player.getStorage("shinin_youlong", new Map());
					let num = 0;
					game.countPlayer(current => {
						if (current == player) {
							return false;
						}
						const map = current.getStorage("shinin_youlong", new Map());
						if (map.has(player)) {
							num -= map.get(player);
							if (trigger.name == "phase") {
								map.delete(player);
								current.markSkill(event.skill);
							}
						}
						if (playerMap.has(current)) {
							num += playerMap.get(current);
						}
					});
					event.result = {
						bool: trigger.name != "phase" && num != 0,
						cost_data: num,
					};
					if (trigger.name == "phase") {
						player.markSkill(event.skill);
						return;
					}
				},
				async content(event, trigger, player) {
					const { cost_data: num } = event;
					trigger.num = Math.max(0, trigger.num + num);
				},
				mod: {
					globalFrom(from, to, range) {
						const playerMap = from.getStorage("shinin_youlong", new Map());
						game.countPlayer(current => {
							if (current == from) {
								return false;
							}
							const map = current.getStorage("shinin_youlong", new Map());
							if (map.has(from)) {
								range += map.get(from);
							}
							if (playerMap.has(current)) {
								range -= playerMap.get(current);
							}
						});
						return range;
					},
				},
			},
		},
	},
	shinin_haiyou: {
		trigger: {
			global: "useCardToTarget",
		},
		filter(event, player) {
			if (!player.countMark("zhenji_moli")) {
				return false;
			}
			const getTitles = current => {
				return get
					.nameList(current)
					.map(name => get.characterTitle(name))
					.filter(title => title.length)
					.toUniqued();
			};
			return getTitles(event.target).containsSome(...getTitles(player));
		},
		logTarget: "target",
		check(event, player) {
			return get.effect(event.target, event.card, event.player, player) < 0;
		},
		async content(event, trigger, player) {
			player.removeMark("zhenji_moli", 1, false);
			game.log(player, "消耗了1点", "<span style='color: #d69dc8ff'>魔力</span>");
			trigger.getParent().excluded.add(trigger.target);
		},
	},
};

export default skills;
