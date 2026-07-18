import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//神魏延------by 清风
	psjimou: {
		audio: 2,
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.maxHp > 1 && game.players.length > 1;
		},
		async cost(event, trigger, player) {
			let result;
			result = await player
				.chooseNumbers(get.prompt(event.skill), [
					{
						prompt: "失去任意点体力上限，令除你与你选择的角色外的其他角色进入“修整”状态",
						min: 1,
						max: player.maxHp - 1,
					},
				])
				.set("processAI", () => {
					const player = get.player();
					if (game.players.length <= 2 || !game.hasPlayer(current => get.attitude(player, current) < 0)) {
						return false;
					}
					return [player.getDamagedHp()];
				})
				.forResult();
			if (result?.bool && result.numbers?.length) {
				const num = result.numbers[0];
				result = await player
					.chooseTarget({
						prompt: "选择一名其他角色令除你与其外的角色进入“修整”状态",
						filterTarget: lib.filter.notMe,
						forced: true,
						ai(target) {
							return -get.attitude(get.player(), target);
						},
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					event.result = {
						bool: true,
						targets: result.targets,
						cost_data: num,
					};
				}
			}
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: num,
			} = event;
			player.awakenSkill(event.name);
			await player.loseMaxHp(num);
			const targetx = game.filterPlayer(current => ![player, target].includes(current) && !current.isRest());
			if (targetx.length) {
				await game.doAsyncInOrder(targetx, async target2 => {
					target2.popup("开始坐牢");
					await target2.rest({ type: "phase", count: -1 });
				});
				player.addSkill(event.name + "_restend");
				player.markAuto(event.name + "_restend", [target, player]);
				player.markAuto(event.name + "_restend3", targetx);
				player.addMark(event.name + "_restend2", num, false);
			}
		},
		subSkill: {
			restend: {
				charlotte: true,
				forced: true,
				silent: true,
				popup: false,
				onremove(player, skill) {
					delete player.storage[skill];
					delete player.storage[skill + "3"];
					player.clearMark(skill + "2", false);
				},
				forceDie: true,
				trigger: {
					global: ["phaseAfter", "dieEnd"],
				},
				filter(event, player) {
					return event.name == "die" || player.getStorage("psjimou_restend").includes(event.player);
				},
				async content(event, trigger, player) {
					if (trigger.name == "phase") {
						player.removeMark(event.name + "2", 1, false);
					}
					if (trigger.name == "die" || !player.hasMark(event.name + "2")) {
						await game.doAsyncInOrder(player.getStorage(event.name + "3").sortBySeat(), async target => {
							target.popup("坐牢结束啦！");
							await target.restEnd({ hp: target.getHp() });
						});
					}
				},
			},
		},
	},
	psyuxue: {
		audio: 2,
		enable: "chooseToUse",
		usable: 1,
		locked: false,
		mod: {
			targetInRange(card) {
				if (card?.storage?.psyuxue) {
					return true;
				}
			},
		},
		filter(event, player) {
			if (!player.hasCards("he", card => !get.is.damageCard(card))) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[2] != "sha") {
					return false;
				}
				return event.filterCard(
					get.autoViewAs(
						{
							name: info[2],
							nature: info[3],
							storage: { psyuxue: true },
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
					if (info[2] != "sha") {
						return false;
					}
					return event.filterCard(
						get.autoViewAs(
							{
								name: info[2],
								nature: info[3],
								storage: { psyuxue: true },
							},
							"unsure"
						),
						player,
						event
					);
				});
				return ui.create.dialog("浴血", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				const player = get.player();
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard(card) {
						return !get.is.damageCard(card);
					},
					selectCard: [1, Infinity],
					position: "he",
					audio: "psyuxue",
					popname: true,
					link: links[0],
					complexCard: true,
					filterTarget(card, player, target) {
						const link = get.info("psyuxue_backup").link,
							cardx = get.autoViewAs(
								{
									name: link[2],
									nature: link[3],
									storage: { psyuxue: true },
								},
								"unsure"
							);
						return player.canUse(cardx, target);
					},
					selectTarget() {
						return ui.selected.cards?.length;
					},
					ai1(card) {
						const link = get.info("psyuxue_backup").link,
							cardx = get.autoViewAs(
								{
									name: link[2],
									nature: link[3],
									storage: { psyuxue: true },
								},
								"unsure"
							);
						const player = get.player();
						const num = game.countPlayer(current => get.effect(current, cardx, player, player) > 0);
						if (!ui.selected.cards?.length || ui.selected.cards.length < num) {
							return 10 - get.value(card);
						}
						return 0;
					},
					ai2(target) {
						const link = get.info("psyuxue_backup").link,
							cardx = get.autoViewAs(
								{
									name: link[2],
									nature: link[3],
									storage: { psyuxue: true },
								},
								"unsure"
							);
						const player = get.player();
						return get.effect(target, cardx, player, player);
					},
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: { psyuxue: true },
					},
					log: false,
					multiline: true,
					multitarget: true,
					async precontent(event, trigger, player) {
						const { targets } = event.result;
						player.logSkill("psyuxue", targets);
					},
				};
			},
			prompt(links, player) {
				return "将任意张非伤害牌当做可指定等量目标的" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
			hiddenCard(player, name) {
				return name == "sha" && player.hasCards("he", card => !get.is.damageCard(card));
			},
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player) {
				if (!player.hasCards("he", card => !get.is.damageCard(card))) {
					return false;
				}
			},
			order(item, player) {
				player ??= get.player();
				return get.order({ name: "sha" }, player) + 0.1;
			},
			result: {
				player: 1,
			},
		},
		group: "psyuxue_jiqu",
		subSkill: {
			backup: {},
			jiqu: {
				audio: "psyuxue",
				trigger: { source: "damageSource" },
				filter(event, player) {
					return event.card?.storage?.psyuxue && event.player?.isIn();
				},
				logTarget: "player",
				check(event, player) {
					return -get.attitude(player, event.player);
				},
				prompt2: "汲取其一点体力上限",
				async content(event, trigger, player) {
					const target = event.targets[0];
					await player.gainMaxHp();
					await target.loseMaxHp();
				},
			},
		},
	},
	pskuifa: {
		audio: 2,
		trigger: { player: "useCard" },
		onremove: true,
		kuifa(card) {
			const info = lib.card[card.name];
			if (!info || info.notarget) {
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
		filter(event, player) {
			const targets = event.targets;
			if (!targets?.length) {
				return false;
			}
			const num = game.countPlayer(current => !targets.includes(current));
			const bool1 = targets.length < game.players.length,
				bool2 = targets.length >= player.getHp() && num > 0;
			if (!bool1 && !bool2) {
				return false;
			}
			return get.is.damageCard(event.card) && get.info("pskuifa").kuifa(event.card);
		},
		async cost(event, trigger, player) {
			const targets = trigger.targets;
			const num = game.countPlayer(current => !targets.includes(current));
			const beishui = player.countMark(event.skill);
			const list = [],
				choiceList = ["令本回合使用【杀】的次数+1", `摸${num}张牌`, `背水：失去${beishui}点体力`];
			if (targets.length < game.players.length) {
				list.push("选项一");
			} else {
				choiceList[0] = `<span style="opacity:0.5">` + choiceList[0] + "</span>";
			}
			if (targets.length >= player.getHp() && num > 0) {
				list.push("选项二");
			} else {
				choiceList[1] = `<span style="opacity:0.5">` + choiceList[1] + "</span>";
			}
			if (!list.length) {
				return;
			}
			list.push("背水！");
			list.push("cancel2");
			const result = await player
				.chooseControl({
					controls: list,
					prompt: "馈伐：你可执行一项",
					choiceList,
					ai() {
						const { player, controls, num } = get.event();
						if (num >= player.getHp() && controls.length > 3) {
							controls.remove("背水！");
						}
						if (!player.hasCards("sha")) {
							controls.remove("选项一");
						}
						return controls.slice().remove("cancel2").randomGet();
					},
				})
				.set("num", beishui)
				.forResult();
			if (typeof result?.control == "string" && result.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		async content(event, trigger, player) {
			const { cost_data: link } = event;
			const targets = trigger.targets;
			const num = game.countPlayer(current => !targets.includes(current));
			const beishui = player.countMark(event.name);
			if (link == "背水！") {
				player.popup("背水！");
				if (beishui > 0) {
					await player.loseHp(beishui);
				}
				player.addMark(event.name, 1, false);
			}
			if (["背水！", "选项一"].includes(link)) {
				player.addTempSkill(event.name + "_sha");
				player.addMark(event.name + "_sha", 1, false);
			}
			if (["背水！", "选项二"].includes(link) && num > 0) {
				await player.draw({ num });
			}
			if (targets.length < game.players.length && targets.length >= player.getHp()) {
				player.popup("乘势！");
				trigger.directHit.addArray(game.players);
				game.log(trigger.card, "不可被响应");
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("pskuifa_sha");
						}
					},
				},
				mark: true,
				intro: { content: "本回合使用【杀】的次数+#" },
			},
		},
	},
	//魔魏延------by 清风
	psnimou: {
		audio: 2,
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.maxHp > 1 && game.players.length > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "失去任意体力上限并选择等量名其他角色令其进入“修整”状态",
					filterTarget: lib.filter.notMe,
					selectTarget: [1, get.player().maxHp - 1],
					complexTarget: true,
					ai(target) {
						const { player } = get.event();
						if (ui.selected.targets?.length < player.getDamagedHp()) {
							return get.attitude(player, target);
						}
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { targets } = event;
			await player.loseMaxHp(targets.length);
			await game.doAsyncInOrder(targets, async target => {
				target.popup("开始坐牢");
				await target.rest({ type: "phase", count: -1 });
			});
			const targetx = game.filterPlayer(current => !targets.includes(current));
			player.addSkill(event.name + "_restend");
			player.markAuto(event.name + "_restend", targets);
			player.markAuto(event.name + "_restend2", targetx);
		},
		subSkill: {
			restend: {
				forced: true,
				silent: true,
				popup: false,
				charlotte: true,
				onremove(player, skill) {
					delete player.getStorage(skill);
					delete player.getStorage(skill + "2");
				},
				forceDie: true,
				trigger: {
					global: ["dieEnd", "phaseAfter"],
				},
				async content(event, trigger, player) {
					if (trigger.name == "phase") {
						player.unmarkAuto(event.name + "2", trigger.player);
					}
					if (trigger.name == "die" || !player.getStorage(event.name + "2").length) {
						await game.doAsyncInOrder(player.getStorage(event.name).sortBySeat(), async target => {
							target.popup("坐牢结束啦！");
							await target.restEnd({ hp: target.getHp() });
						});
					}
				},
			},
		},
	},
	pskexue: {
		audio: 2,
		enable: "chooseToUse",
		usable: 1,
		filter(event, player) {
			if (!player.hasCards("he", card => !get.is.damageCard(card))) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[2] != "sha") {
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
					if (info[2] != "sha") {
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
				return ui.create.dialog("渴血", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				const player = get.player();
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard(card) {
						return !get.is.damageCard(card);
					},
					selectCard: [1, Infinity],
					position: "he",
					audio: "pskexue",
					popname: true,
					link: links[0],
					check(card) {
						return 8 - get.value(card);
					},
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					log: false,
					async precontent(event, trigger, player) {
						const num = event.result.cards.length;
						player.logSkill("pskexue");
						event.result._apply_args = {
							shanReq: num,
							oncard: () => {
								const evt2 = get.event();
								for (const target of game.filterPlayer(null, null, true)) {
									const id = target.playerid;
									const map = evt2.customArgs;
									if (!map[id]) {
										map[id] = {};
									}
									map[id].shanRequired = evt2.shanReq;
								}
							},
						};
					},
				};
			},
			prompt(links, player) {
				return "将任意张非伤害牌当做须等量【闪】抵消的" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
			hiddenCard(player, name) {
				return name == "sha" && player.hasCards("he", card => !get.is.damageCard(card));
			},
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player) {
				if (!player.hasCards("he", card => !get.is.damageCard(card))) {
					return false;
				}
			},
			order(item, player) {
				player ??= get.player();
				return get.order({ name: "sha" }, player) + 0.1;
			},
			result: {
				player: 1,
			},
		},
		group: "pskexue_jiqu",
		subSkill: {
			backup: {},
			jiqu: {
				audio: "pskexue",
				trigger: { source: "damageSource" },
				filter(event, player) {
					const target = event.player;
					if (!target?.isIn() || event.getParent(2).skill !== "pskexue_backup") {
						return false;
					}
					const evtx = event.getParent(2);
					const card = event.card;
					const name = card?.name;
					if (!card || card.name !== "sha") {
						return false;
					}
					return !target.hasHistory("useCard", evt2 => {
						return evt2.card.name == "shan" && evt2.respondTo && evt2.getParent(3) == evtx;
					});
				},
				logTarget: "player",
				check(event, player) {
					return -get.attitude(player, event.player);
				},
				prompt2: "汲取其一点体力上限",
				async content(event, trigger, player) {
					const target = event.targets[0];
					await player.gainMaxHp();
					await target.loseMaxHp();
				},
			},
		},
	},
	psjiefa: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		onremove: true,
		filter(event, player) {
			const targets = event.targets;
			if (!targets?.length || targets.length !== 1) {
				return false;
			}
			const target = event.target;
			const bool1 = target.getHp() > game.players.length && game.hasPlayer(current => current !== target && lib.filter.targetEnabled2(event.card, player, current)),
				bool2 = player.maxHp < target.maxHp;
			if (!bool1 && !bool2) {
				return false;
			}
			return get.is.damageCard(event.card);
		},
		async cost(event, trigger, player) {
			const target = trigger.target;
			const beishui = player.countMark(event.skill);
			const list = [],
				choiceList = [`令${get.translation(trigger.card)}可额外指定一个目标`, `令此牌额外结算一次`, `背水：失去${beishui}点体力`];
			if (target.getHp() > game.players.length && game.hasPlayer(current => current !== target && lib.filter.targetEnabled2(trigger.card, player, current))) {
				list.push("选项一");
			} else {
				choiceList[0] = `<span style="opacity:0.5">` + choiceList[0] + "</span>";
			}
			if (player.maxHp < target.maxHp) {
				list.push("选项二");
			} else {
				choiceList[1] = `<span style="opacity:0.5">` + choiceList[1] + "</span>";
			}
			if (!list.length) {
				return;
			}
			list.push("背水！");
			list.push("cancel2");
			const result = await player
				.chooseControl({
					controls: list,
					prompt: "竭伐：你可执行一项",
					choiceList,
					ai() {
						const { player, controls, num } = get.event();
						if (num < 2 && controls.length > 3 && player.getHp() > num) {
							return "背水！";
						}
						return controls.slice().removeArray(["cancel2", "背水！"]).randomGet();
					},
				})
				.set("num", beishui)
				.forResult();
			if (typeof result?.control == "string" && result.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		async content(event, trigger, player) {
			const { cost_data: link } = event;
			const target = trigger.target;
			const beishui = player.countMark(event.name);
			if (link == "背水！") {
				player.popup("背水！");
				if (beishui > 0) {
					await player.loseHp(beishui);
				}
				player.addMark(event.name, 1, false);
			}
			if (["背水！", "选项一"].includes(link)) {
				const result = await player
					.chooseTarget({
						prompt: `竭伐：为${get.translation(trigger.card)}额外指定一个目标`,
						filterTarget(card, player, target) {
							return target != get.event().targetx && lib.filter.targetEnabled2(get.event().cardx, player, target);
						},
						ai(target) {
							return get.effect(target, get.event().card, get.player(), get.player());
						},
					})
					.set("targetx", target)
					.set("cardx", trigger.card)
					.forResult();
				if (result?.bool) {
					const targetx = result.targets[0];
					player.line(targetx);
					trigger.targets.push(targetx);
				}
			}
			if (["背水！", "选项二"].includes(link)) {
				trigger.getParent().effectCount++;
			}
			if (player.maxHp < target.maxHp && target.getHp() > game.players.length) {
				player.popup("乘势！");
				const list = [];
				if (player.isDamaged()) {
					list.push("recover_hp");
				}
				if (player.countCards("h") < player.maxHp) {
					list.push("draw_card");
				}
				if (!list.length) {
					return;
				}
				const result =
					list.length > 1
						? await player
								.chooseControl({
									controls: list,
									prompt: "竭伐：回复体力至上限或将手牌摸至体力上限",
									ai() {
										if (get.player().getHp() < 2) {
											return "recover_hp";
										}
										return get.event().controls.slice().randomGet();
									},
								})
								.forResult()
						: { control: list[0] };
				if (typeof result?.control == "string") {
					if (result.control == "recover_hp") {
						await player.recoverTo(player.maxHp);
					} else {
						await player.drawTo(player.maxHp);
					}
				}
			}
		},
	},
};

export default skills;
