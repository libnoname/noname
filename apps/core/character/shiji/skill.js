import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	yingba: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if (num > 0 && _status.event && _status.event.type === "phase" && get.tag(card, "recover")) {
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
		filter(event, player) {
			return game.hasPlayer(current => get.info("yingba").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target !== player && target.maxHp > 1;
		},
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
					if (player.maxHp === 1) {
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
						const num = player.countMark("yingba_mark");
						if (num) {
							return numx + num * game.countPlayer(current => current.hasSkill("yingba"));
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
			return event.target.hasMark("yingba_mark");
		},
		logTarget: "target",
		async content(event, trigger, player) {
			trigger.getParent().directHit.add(trigger.target);
			if (player.getHistory("gain", evt => evt.getParent(2).name === "scfuhai").length < 2) {
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
					return event.targets.filter(target => target.hasMark("yingba_mark")).sortBySeat();
				},
				async content(event, trigger, player) {
					let num = 0;
					for (const target of trigger.targets) {
						const numx = target.countMark("yingba_mark");
						if (numx) {
							num += numx;
							target.clearMark("yingba_mark");
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
					return event.player.hasMark("yingba_mark");
				},
				async content(event, trigger, player) {
					const num = trigger.player.countMark("yingba_mark");
					await player.gainMaxHp(num);
					await player.draw(num);
				},
			},
		},
	},
	pinghe: {
		derivation: "yingba",
		audio: 2,
		mod: {
			maxHandcardBase(player) {
				return player.getDamagedHp();
			},
		},
		trigger: { player: "damageBegin4" },
		forced: true,
		filter(event, player) {
			return event.source && event.source !== player && player.maxHp > 1 && player.hasCards("h");
		},
		async content(event, trigger, player) {
			trigger.cancel();
			await player.loseMaxHp();
			if (game.hasPlayer(current => current !== player) && player.hasCards("h")) {
				const result = await player
					.chooseCardTarget({
						prompt: "请选择【冯河】的牌和目标",
						prompt2: `将一张手牌交给一名其他角色并防止伤害${player.hasSkill("yingba") ? `，然后令${get.translation(trigger.source)}获得1枚“平定”标记` : ""}`,
						filterCard: true,
						forced: true,
						filterTarget: lib.filter.notMe,
						ai1(card) {
							const player = get.player();
							if (get.tag(card, "recover") && !game.hasPlayer(current => get.attitude(current, player) > 0 && !current.hasSkillTag("nogain"))) {
								return 0;
							}
							return 1 / Math.max(0.1, get.value(card));
						},
						ai2(target) {
							const player = get.player();
							let att = get.attitude(player, target);
							if (target.hasSkillTag("nogain")) {
								att /= 9;
							}
							return 4 + att;
						},
					})
					.forResult();
				if (result?.bool) {
					const target = result.targets[0];
					player.line(target, "green");
					await player.give(result.cards, target);
					if (player.hasSkill("yingba")) {
						trigger.source.addMark("yingba_mark", 1);
					}
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
							if (game.hasPlayer(cur => cur !== target && get.attitude(target, cur) > 0)) {
								damage -= 0.9;
							}
							return [0, -damage, 0, -0.4];
						}
						if (card.name === "tiesuo") {
							return 0.4;
						}
					}
					if (get.tag(card, "recover") && _status.event.type === "phase" && !player.needsToDiscard()) {
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
			return (event.name !== "phase" || game.phaseNumber === 0) && !lib.inpile.includes("qizhengxiangsheng");
		},
		async content(event, trigger, player) {
			game.addGlobalSkill("tianzuo_global");
			const cards = [];
			for (let i = 2; i < 10; i++) {
				cards.push(game.createCard2("qizhengxiangsheng", i % 2 ? "club" : "spade", i));
			}
			game.broadcastAll(() => void lib.inpile.add("qizhengxiangsheng"));
			game.cardsGotoPile(cards, () => ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)]);
		},
		group: "tianzuo_remove",
		subSkill: {
			remove: {
				audio: "tianzuo",
				trigger: { target: "useCardToBefore" },
				forced: true,
				priority: 15,
				filter(event, player) {
					return event.card && event.card.name === "qizhengxiangsheng";
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (card && card.name === "qizhengxiangsheng") {
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
					return event.card.name === "qizhengxiangsheng";
				},
				async content(event, trigger, player) {
					const target = trigger.target;
					event.target = target;
					let result = await player
						.chooseControl("奇兵", "正兵")
						.set("prompt", `请选择${get.translation(target)}的标记`)
						.set(
							"choice",
							(() => {
								let e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
								let e2 = 0;
								if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
									e2 = -1;
								}
								let es = target.getGainableCards(player, "e");
								if (es.length) {
									e2 = Math.min(
										e2,
										(() => {
											let max = 0;
											for (const i of es) {
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
						.set("ai", () => _status.event.choice)
						.forResult();

					let map = trigger.getParent().customArgs;
					let id = target.playerid;
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
					return event.card.name === "qizhengxiangsheng";
				},
				logTarget: "target",
				prompt2: "观看其手牌并修改“奇正相生”标记",
				async content(event, trigger, player) {
					let target = trigger.target;
					event.target = target;
					if (player !== target && target.countCards("h") > 0) {
						await player.viewHandcards(target);
					}
					let result = await player
						.chooseControl("奇兵", "正兵")
						.set("prompt", `请选择${get.translation(target)}的标记`)
						.set(
							"choice",
							(() => {
								let shas = target.getCards("h", "sha");
								let shans = target.getCards("h", "shan");
								let e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
								let e2 = 0;
								if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
									e2 = -1;
								}
								let es = target.getGainableCards(player, "e");
								if (es.length) {
									e2 = Math.min(
										e2,
										(() => {
											let max = 0;
											for (const i of es) {
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
								let rand = Math.random();
								if (e1 < e2) {
									return rand < 0.1 ? "奇兵" : "正兵";
								}
								return rand < 0.1 ? "正兵" : "奇兵";
							})()
						)
						.set("ai", () => _status.event.choice)
						.forResult();

					let map = trigger.getParent().customArgs;
					let id = target.playerid;
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
			return event.card.name === "qizhengxiangsheng" || get.zhinangs().includes(event.card.name) || player.getStorage("dinghan").includes(event.card.name);
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
							let num = 0;
							let nohave = true;
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
			if (event.name === "useCardToTarget" && get.type(event.card, null, false) !== "trick") {
				return false;
			}
			return !player.getStorage("dinghan").includes(event.card.name);
		},
		async content(event, trigger, player) {
			player.markAuto("dinghan", [trigger.card.name]);
			if (trigger.name === "addJudge") {
				trigger.cancel();
				if (trigger.card?.cards?.length) {
					const map = new Map();
					const targets = [];
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
					let list2 = lib.inpile.filter(i => get.type2(i, false) === "trick" && !list1.includes(i));
					if (list1.length) {
						dialog.push('<div class="text center">已记录</div>');
						dialog.push([list1, "vcard"]);
					}
					if (list2.length) {
						dialog.push('<div class="text center">未记录</div>');
						dialog.push([list2, "vcard"]);
					}
					let result = await player
						.chooseButton(dialog)
						.set("ai", button => {
							let player = _status.event.player;
							let name = button.link[2];
							if (player.getStorage("dinghan").includes(name)) {
								return -get.effect(player, { name: name }, player, player);
							}
							return get.effect(player, { name: name }, player, player) * (1 + player.countCards("hs", name));
						})
						.forResult();
					if (result.bool) {
						player.logSkill("dinghan");
						let name = result.links[0][2];
						if (player.getStorage("dinghan").includes(name)) {
							player.unmarkAuto("dinghan", [name]);
							game.log(player, "从定汉记录中移除了", `#y${get.translation(name)}`);
						} else {
							player.markAuto("dinghan", [name]);
							game.log(player, "向定汉记录中添加了", `#y${get.translation(name)}`);
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
			return event.card.name === "sha" && event.player.hp > player.hp;
		},
		async content(event, trigger, player) {
			const next = player.judge(result => (get.suit(result) === "heart" ? 2 : -1));
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
					if (card.name === "sha" && !isLink && player.hp > target.hp) {
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
					return event.player !== player && event.player.hasMark("dulie") && (player.countCards("h") > 0 || (player.hp >= event.player.hp && event.player.countCards("h") > 0));
				},
				async content(event, trigger, player) {
					let list = [];
					let target = trigger.player;
					let choiceList = ["弃置一张牌并对其造成1点伤害", "获得其一张手牌"];
					event.target = target;
					if (player.hasCard(card => lib.filter.cardDiscardable(card, player, "tspowei_use"), "h")) {
						list.push("选项一");
					} else {
						choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
					}
					if (player.hp >= target.hp && target.countCards("h") > 0) {
						list.push("选项二");
					} else {
						choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
					}
					let result = await player
						.chooseControl(list, "cancel2")
						.set("prompt", get.prompt("tspowei", target))
						.set("choiceList", choiceList)
						.set("ai", () => {
							let evt = _status.event.getParent();
							if (evt.player.hasCard(card => lib.filter.cardDiscardable(card, evt.player, "tspowei_use") && get.value(card, evt.player) < 7, "h") && get.damageEffect(evt.target, evt.player, evt.player) > 0) {
								return "选项一";
							}
							if (evt.player.hp >= evt.target.hp && evt.target.countCards("h") > 0 && get.attitude(evt.player, evt.target) <= 0 && !evt.target.hasSkillTag("noh")) {
								return "选项二";
							}
							return "cancel2";
						})
						.forResult();
					if (result.control !== "cancel2") {
						if (result.control === "选项二") {
							player.logSkill("tspowei_use", target);
							await player.gainPlayerCard(target, "h", true);
						} else if (result.control === "选项一") {
							await player.chooseToDiscard("h", true).set("logSkill", ["tspowei_use", target]);
							if (get.mode() !== "identity" || player.identity !== "nei") {
								player.addExpose(0.2);
							}
							await target.damage();
						}
						player.addTempSkill("tspowei_inRange");
					} else {
						return;
					}
				},
				ai: { expose: 0.2 },
			},
			inRange: {
				charlotte: true,
				mod: {
					inRangeOf(from, to) {
						if (from === _status.currentPhase) {
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
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				logTarget(event, player) {
					return game.filterPlayer(current => current !== player && !current.hasMark("dulie"));
				},
				async content(event, trigger, player) {
					const list = game.filterPlayer(current => current !== player && !current.hasMark("dulie")).sortBySeat();
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
					return game.hasPlayer(current => current !== player && current.hasMark("dulie"));
				},
				async content(event, trigger, player) {
					const list = game.filterPlayer(current => current !== player && current.hasMark("dulie")).sortBySeat();
					const map = {};
					for (const current of list) {
						const num = current.countMark("dulie");
						current.removeMark("dulie", num);
						map[current.playerid] = num;
					}
					for (const current of list) {
						let next = current.next;
						if (next === player) {
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
					return !game.hasPlayer(current => current.hasMark("dulie"));
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
			return event.card.name === "sha" && event.card.isCard && event.cards.length === 1;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseControl()
				.set("choiceList", ["摸一张牌，且本回合使用【杀】的次数上限+1", "摸三张牌，且本回合不能再使用【杀】"])
				.set("ai", () => (_status.event.player.hasSha() ? 0 : 1))
				.forResult();
			if (result.index === 0) {
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
						if (card.name === "sha") {
							return num + player.countMark("shenzhu_more");
						}
					},
				},
			},
			less: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (card.name === "sha") {
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
			if (event.card.name !== "sha" || player.hp <= 1) {
				return false;
			}
			let evt = event.getParent("phaseUse");
			return evt && evt.player === player && player.getHistory("useCard", evtx => evtx.card.name === "sha" && evtx.getParent("phaseUse") === evt)[0] === event && game.hasPlayer(current => !event.targets.includes(current) && lib.filter.filterTarget(event.card, player, current));
		},
		async content(event, trigger, player) {
			let num = Math.min(
				player.hp - 1,
				game.countPlayer(current => !trigger.targets.includes(current) && lib.filter.filterTarget(trigger.card, player, current))
			);
			let result = await player
				.chooseTarget(get.prompt("dangmo"), `为${get.translation(trigger.card)}增加至多${get.translation(num)}个目标`, [1, num], (card, player, target) => {
					let evt = _status.event.getTrigger();
					return !evt.targets.includes(target) && lib.filter.filterTarget(evt.card, player, target);
				})
				.set("ai", target => {
					let evt = _status.event.getTrigger();
					let eff = get.effect(target, evt.card, evt.player, evt.player);
					if (player.hasSkill("tspowei") && target.hasMark("dulie")) {
						return 4 * eff;
					}
					return eff;
				})
				.forResult();
			if (result.bool) {
				if (player !== game.me && !player.isOnline()) {
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
					.judge(result => {
						let evt = _status.event.getParent("reshuishi");
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
				.chooseTarget(`将${get.translation(cards)}交给一名角色`, true)
				.set("ai", target => {
					let player = _status.event.player;
					let att = get.attitude(player, target);
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
					game.filterPlayer().reduce((num, i) => Math.max(num, i.countCards("h")), 0)
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
					let list = [];
					let hs = target.getCards("h");
					for (const i of hs) {
						list.add(get.suit(i, target));
					}
					if (list.length === 0) {
						return 0;
					}
					if (list.length === 1) {
						return player.maxHp > 2 ? 0 : -2;
					}
					if (list.length === 2) {
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
			return !game.hasPlayer(current => current.getAllHistory("damage").length === 0);
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
			let target = player.storage.zuoxing;
			if (!target || !target.isIn() || target.maxHp < 2) {
				return false;
			}
			for (const i of lib.inpile) {
				if (get.type(i) === "trick" && event.filterCard({ name: i, isCard: true }, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				let list = [];
				for (const i of lib.inpile) {
					if (get.type(i) === "trick" && event.filterCard({ name: i, isCard: true }, player, event)) {
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
				return `请选择${get.translation(links[0][2])}的目标`;
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
				}
				return "摸牌";
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
					list.length === 1
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
						info.filter = (event, player, ...args) => {
							if (player.storage.resghuishi_mark) {
								return true;
							}
							return info.resghuishi_filter(event, player, ...args);
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
					if ((target !== player && player.hasUnknown()) || player.maxHp < (player.getDamagedHp() > 1 ? 5 : 6)) {
						return 0;
					}
					if (target === player && player.hasSkill("resghuishi") && game.hasPlayer(current => current.getAllHistory("damage").length === 0)) {
						return 4;
					}
					let list = target.getSkills(null, false, false).filter(skill => {
						let info = lib.skill[skill];
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
				}
				return "摸牌";
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
						info.filter = (event, player, ...args) => {
							if (player.hasMark("sghuishi")) {
								return true;
							}
							return info.sghuishi_filter(event, player, ...args);
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
					let list = target.getSkills(null, false, false).filter(skill => {
						let info = lib.skill[skill];
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
	//神鲁肃
	dingzhou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const num = player.countCards("he");
			return game.hasPlayer(current => {
				if (current === player) {
					return false;
				}
				const total = current.countCards("ej");
				return total > 0 && num >= total;
			});
		},
		filterCard: true,
		selectCard() {
			return [1, Math.max(...game.filterPlayer(i => i !== get.player()).map(i => i.countCards("ej")))];
		},
		check(card) {
			return 7 - get.value(card);
		},
		filterTarget(card, player, target) {
			const num = target.countCards("ej");
			if (!num) {
				return false;
			}
			return ui.selected.cards.length === num && player !== target;
		},
		filterOk() {
			return ui.selected.cards.length === ui.selected.targets[0].countCards("ej");
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
					if (player.hasSkill("zhimeng") && (get.mode() === "identity" || player.countCards("h") - target.countCards("h") > 2 * ui.selected.cards.length)) {
						eff *= 1 + get.sgnAttitude(player, target) * 0.15;
					}
					const es = target.getCards("e");
					const js = target.getCards("j");
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
			return game.filterPlayer(current => !current.isZhu2() && (get.mode() !== "doudizhu" || current.getSeatNum() !== 3));
		},
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return (event.name !== "phase" || game.phaseNumber === 0) && get.info("tamo").getTargets().length > 1;
		},
		seatRelated: "changeSeat",
		derivation: "tamo_faq",
		frequent: true,
		async content(event, trigger, player) {
			const toSortPlayers = get.info(event.name).getTargets();
			toSortPlayers.sortBySeat(game.findPlayer2(current => current.getSeatNum() === 1, true));
			const next = player.chooseToMove(lib.translate[`${event.name}_info`]);
			next.set("list", [["（以下排列的顺序即为发动技能后角色的座次顺序）", [toSortPlayers.map(i => `${i.getSeatNum()}|${i.name}`), lib.skill.tamo.$createButton]]]);
			next.set("toSortPlayers", toSortPlayers.slice(0));
			next.set("processAI", () => {
				const players = get.event().toSortPlayers;
				const player = get.player();
				players.randomSort().sort((a, b) => get.attitude(player, b) - get.attitude(player, a));
				return [players.map(i => `${i.getSeatNum()}|${i.name}`)];
			});
			const result = await next.forResult();
			const moved = result?.moved;
			const resultList = moved[0].map(info => parseInt(info.split("|")[0]));
			const toSwapList = [];
			const cmp = (a, b) => resultList.indexOf(a) - resultList.indexOf(b);
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
				if (evt2.name === "phaseLoop" && evt2._isStandardLoop) {
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
			const info = item.split("|");
			const _item = item;
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

			const func = (node, item) => {
				const currentPlayer = game.findPlayer(current => current.getSeatNum() === seat);
				if (currentPlayer.classList.contains("unseen_show")) {
					node.setBackground("hidden_image", "character");
				} else if (item !== "unknown") {
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
				if (lib.config.buttoncharacter_style === "default" || lib.config.buttoncharacter_style === "simple") {
					if (lib.config.buttoncharacter_style === "simple") {
						node.node.group.style.display = "none";
					}
					node.classList.add("newstyle");
					node.node.name.dataset.nature = get.groupnature(get.bordergroup(infoitem));
					node.node.group.dataset.nature = get.groupnature(get.bordergroup(infoitem), "raw");
				}
				node.node.name.style.top = "8px";
				if (node.node.name.querySelectorAll("br").length >= 4) {
					node.node.name.classList.add("long");
					if (lib.config.buttoncharacter_style === "old") {
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
				if (target === player || target.countCards("h") + player.countCards("h") === 0) {
					return false;
				}
				return true;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "与一名其他角色平分手牌", (card, player, target) => {
					if (target === player || target.countCards("h") + player.countCards("h") === 0) {
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
			game.log(target, "习得的五禽戏顺序为", `#g${sortedWuqinxi.join("、")}`);
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
				} while (nextPlayer !== target);

				if (!spirits.length) {
					spirits.add("猿");
				}

				const effectOk = get.recoverEffect(target, player, player) > 0;
				const hasBadCards = target.hasCard(card => {
					const vcard = {
						name: card.viewAs || card.name,
						cards: [card],
					};
					return get.effect(target, vcard, target, target) < -1;
				}, "j");

				if (effectOk || hasBadCards) {
					spirits.add("鹿");
				}

				const others = lib.skill.wuling.wuqinxi.slice().removeArray(spirits);
				do {
					others.randomSort();
				} while (others.length > 1 && others[0] === "鹿");
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
			let wuqinxi = player.storage.wuling_wuqinxi;
			if (!wuqinxi) {
				return;
			}
			let prevMark = wuqinxi.shift();
			// wuqinxi.push(prevMark);
			let curMark = wuqinxi[0];
			if (!curMark) {
				for (const skill in player.additionalSkills) {
					if (!skill.startsWith("wuling_")) {
						continue;
					}
					player.removeAdditionalSkill(skill);
				}
				game.log(player, "完成了五禽戏的操练");
				return;
			}
			game.log(player, "获得了", `#g【${curMark}】`, "标记");
			player.markSkill("wuling_wuqinxi");
			game.broadcastAll(
				(player, curMark) => {
					if (player.marks.wuling_wuqinxi) {
						player.marks.wuling_wuqinxi.firstChild.innerHTML = curMark;
					}
				},
				player,
				curMark
			);
			let next = game.createEvent("wuling_change");
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
						const str = `<li>当前效果：${storage[0]}<br><li>${wuqinxiMap.find(str => storage[0] === str[0]).slice(2)}<br>`;
						dialog.addText(str, false);
						const str2 = `<div class="text center">“五禽戏”顺序：<br>${storage.join(" ")}</div>`;
						dialog.addText(str2);
						if (storage.length > 1) {
							const str3 = `<div class="text" style="font-size:10px; ">[下一效果] ${wuqinxiMap.find(str => storage[1] === str[0])}<br></div>`;
							dialog.add(str3);
						}
					},
				},
				mod: {
					targetEnabled(card, player, target) {
						if (get.type(card) === "delay" && target.storage.wuling_wuqinxi && target.storage.wuling_wuqinxi[0] === "鹿") {
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
					if (event.name === "phaseZhunbei") {
						return true;
					}
					switch (name) {
						case "damageBegin1": {
							if (wuqinxi !== "虎" || !event.card) {
								return false;
							}
							const evt = event.getParent("useCard");
							return evt?.targets.length === 1 && evt.targets.includes(event.player);
						}
						case "damageBegin4":
							return wuqinxi === "熊" && !player.hasSkill("wuling_xiong");
						default:
							switch (wuqinxi) {
								case "鹿":
									return player.isDamaged() || player.countCards("j") > 0;
								case "鹤":
									return true;
								case "猿":
									return game.hasPlayer(target => target !== player && target.countGainableCards(player, "e") > 0);
								default:
									return false;
							}
					}
				},
				forced: true,
				onremove: true,
				async content(event, trigger, player) {
					let wuqinxi = player.storage.wuling_wuqinxi[0];
					if (trigger.name === "phaseZhunbei") {
						lib.skill.wuling.updateMark(player);
						return;
					}
					let name = event.triggername;
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
										.chooseTarget("五禽戏：获得一名其他角色装备区里的一张装备牌", (card, player, target) => target !== player && target.countGainableCards(player, "e"))
										.set("ai", target => {
											let player = _status.event.player;
											let att = get.attitude(player, target);
											let eff = 0;
											target.getCards("e", card => {
												let val = get.value(card, target);
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
							if (nextWuqinxi === "鹿" && get.type(card) === "delay") {
								return "zerotarget";
							}
							if (curWuqinxi !== "熊" || player.hasSkill("wuling_xiong")) {
								return;
							}
							if (player.hasSkillTag("jueqing", false, target)) {
								return;
							}
							let num = get.tag(card, "damage");
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
					const targets = game.filterPlayer(current => Reflect.has(current.additionalSkills, `wuling_${player.playerid}`));
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
					return `将${get.translation(lib.skill.twlijian.getCards(event))}置入仁区`;
				},
				async content(event, trigger, player) {
					const cards = lib.skill.twlijian.getCards(trigger);
					game.log(player, "将", cards, "置于了仁库");
					game.cardsGotoSpecial(cards, "toRenku");
				},
			},
		},
	},
	// 手杀神马超
	yuli: {
		audio: 6,
		trigger: {
			source: "damageBegin1",
			player: "damageBegin4",
		},
		filter(event, player, name) {
			return name === "damageBegin1" || event.hasNature("thunder");
		},
		forced: true,
		direct: true,
		logAudio(event) {
			if (typeof event === "number") {
				return `yuli${event}.mp3`;
			}
			return 2;
		},
		async content(event, trigger, player) {
			switch (event.triggername) {
				case "damageBegin1":
					if (!trigger.hasNature("thunder")) {
						player.logSkill("yuli");
						game.setNature(trigger, "thunder");
					} else {
						player.logSkill("yuli", null, null, null, [get.rand(3, 4)]);
						trigger.num++;
					}
					updateState(player, "atk");
					break;
				case "damageBegin4":
					player.logSkill("yuli", null, null, null, [get.rand(5, 6)]);
					trigger.cancel();
					await player.draw(trigger.num);
					updateState(player, "def");
					break;
			}

			return;

			/**
			 * 重置【寂灭】
			 *
			 * @param {Player} player
			 * @param {"atk" | "def"} type
			 */
			function updateState(player, type) {
				if (!player.awakenedSkills.includes("jimie")) {
					return;
				}
				switch (type) {
					case "atk":
						player.markAuto("yuli", ["atk"]) /* StateType.atk */;
						game.log(player, "触发了", "#g【驭雳】", "的第一项");
						break;
					case "def":
						player.markAuto("yuli", ["def"]) /* StateType.def */;
						game.log(player, "触发了", "#g【驭雳】", "的第二项");
						break;
				}
				if (["atk", "def"].every(item => player.getStorage("yuli").includes(item)) && player.hasSkill("jimie", null, false, false)) {
					player.logSkill("jimie", null, null, null, [get.rand(3, 4)]);
					player.refreshSkill("jimie");
					player.setStorage("yuli", [], true);
				}
			}
		},
		onremove: true,
		intro: {
			content(storage = [], player) {
				if (!storage?.length) {
					return "尚未触发【驭雳】的任一项";
				}
				let str = "已触发【驭雳】的";
				if (storage.includes("atk")) {
					str += "第一项";
					if (storage.includes("def")) {
						str += "和";
					}
				}
				if (storage.includes("def")) {
					str += "第二项";
				}
				return str;
			},
		},
		ai: {
			nothunder: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "thunderDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	tingwei: {
		audio: 4,
		trigger: { player: "useCardToPlayered" },
		filter(event) {
			return event.isFirstTarget && event.card?.name === "sha";
		},
		logAudio(event) {
			if (typeof event === "number") {
				return `tingwei${event}.mp3`;
			}
			return 2;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					filterTarget(_card, _player, target) {
						const event = get.event();
						return event.targets.includes(target);
					},
					ai(target) {
						const player = get.player();
						const trigger = get.event().getTrigger();

						// 判断态度，友方则不选，虽然给牌或加伤或许有奇效，但让AI实现还是太难了
						const att = get.attitude(player, target);
						if (att >= 0) {
							return -1;
						}

						let score = 0;

						// 此【杀】本身对目标的收益，尤其用于判断伤害+1是否有价值
						const nature = get.nature(trigger.card);
						const damage = get.damageEffect(target, player, player, nature);
						if (damage > 0) {
							score += damage * 1.8;
							if (target.hp <= 2) {
								score += 2;
							}
						}

						// 非锁定技失效：技能越多越值得
						const skills = target.getSkills(null, false, false).filter(skill => {
							const info = get.info(skill);
							return info && !info.locked && !info.charlotte;
						});
						score += skills.length * 1.2;

						// 交装备：有装备牌时才有压力
						const equips1 = target.getGainableCards(player, "e");
						const equips2 = target.getGainableCards(player, "h", card => card.isKnownBy(player) && get.type(card) === "equip");
						const equips = equips1.concat(equips2);
						if (equips.length) {
							const values = equips.reduce((sum, card) => sum + get.value(card, target), 0) / equips.length;
							score += Math.min(3, values);
						}

						// 随机弃牌：牌越少越疼，牌越关键越疼
						const cards = target.countDiscardableCards(target, "he");
						if (cards) {
							score += Math.min(3, 1 + 4 / cards);
						}

						// 不选则连环：未横置、且可能吃属性伤害时更值钱
						if (!target.isLinked()) {
							score += 0.8;
							if (game.hasPlayer(current => current !== target && current.isLinked())) {
								score += 0.8;
							}
							if (nature) {
								score += 0.6;
							}
						}

						// 敌意修正：越是敌人越优先
						score *= Math.max(1, -att / 3);

						return score;
					},
				})
				.set("targets", trigger.targets)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			player.addMark("tingwei", 4);

			const target = event.targets[0];

			const result = await target
				.chooseButton({
					createDialog: [
						"霆威：请选择任意项，若点击“取消”，则你横置",
						[
							[
								["fengyin", "非锁定技失效至下个回合结束"],
								["equip", `交给${get.translation(player)}一张装备牌`],
								["damage", `${get.translation(trigger.card)}对你造成伤害+1`],
								["discard", "随机弃一张牌"],
							],
							"textbutton",
						],
					],
					filterButton(button, player) {
						const source = get.event().source;
						const link = button.link;
						const selected = ui.selected.buttons.map(button => button.link);

						switch (link) {
							case "fengyin":
								return !player.hasSkill("tingwei_fengyin");
							case "equip": {
								const hasEquip = player.hasGainableCards(source, "he", { type: "equip" });
								if (!hasEquip) {
									return false;
								}
								if (!selected.includes("discard")) {
									return true;
								}
								return player.hasGainableCards(source, "he", card => get.type(card) === "equip" && player.hasDiscardableCards(player, "he", cardx => cardx !== card));
							}
							case "discard": {
								const hasCard = player.hasDiscardableCards(player, "he");
								if (!hasCard) {
									return false;
								}
								if (!selected.includes("equip")) {
									return true;
								}
								return player.hasGainableCards(source, "he", card => get.type(card) === "equip" && player.hasDiscardableCards(player, "he", cardx => cardx !== card));
							}
							default:
								return true;
						}
					},
					selectButton: [1, 4],
					processAI() {
						const event = get.event();
						const target = event.player;
						const player = event.source;

						const parent = event.getParent();
						if (parent == null) {
							return {
								bool: false,
							};
						}
						const trigger = parent.getTrigger();

						const resultLinks = [];
						const removeMarkValue = getTingValue(player, target);

						// 计算四个选项的代价
						const costs = Array(4).fill(0);

						// 选项1：非锁定技失效
						if (target.hasSkill("tingwei_fengyin")) {
							// 已失效则无法选择此项，代价设为正无穷表示无法选择
							costs[0] = Infinity;
						} else {
							const skills = target.getSkills(null, false, false).filter(skill => {
								const info = get.info(skill);
								return info && !info.locked && !info.charlotte;
							});
							costs[0] = skills.length * 1.2;
							if (skills.length >= 2) {
								costs[0] += 1;
							}
						}

						// 选项2：交给你一张装备牌
						const equips = target.getGainableCards(player, "he", { type: "equip" });
						if (equips.length) {
							costs[1] = Math.min(4, equips.reduce((sum, card) => sum + get.value(card, target), 0) / equips.length);
						} else {
							// 没有装备无法选择，同样代价最大化
							costs[1] = Infinity;
						}

						// 选项3：此杀伤害+1
						const card = trigger.card;
						const damageEff = get.damageEffect(target, player, target, get.nature(card));
						if (damageEff < 0) {
							costs[2] = -damageEff * 1.8;
							if (target.hp <= 2) {
								costs[2] += 3;
							}
							if (target.hp <= 1) {
								costs[2] += 5;
							}
						} else {
							// 如果目标不怕伤害，甚至受益，这项成本很低，应该不需要代价最大化
							costs[2] = -damageEff;
						}

						// 选项4：随机弃一张牌
						const cards = target.getDiscardableCards(target, "he");
						if (cards.length) {
							const values = cards.reduce((sum, card) => sum + get.value(card, target), 0) / cards.length;
							costs[3] = Math.min(4, 1 + 4 / values);
							if (cards.length <= 2) {
								costs[3] += 1;
							}
						} else {
							costs[3] = Infinity;
						}

						// 将代价小于收益的项添加到结果中
						const links = ["fengyin", "equip", "damage", "discard"];
						for (const [i, cost] of costs.entries()) {
							if (removeMarkValue > cost) {
								resultLinks.push(links[i]);
							}
						}

						// 检查第二项和第四项的冲突可能
						if (resultLinks.includes("equip") && resultLinks.includes("discard")) {
							if (!equips.some(card => cards.some(cardx => cardx !== card))) {
								// 只关注是否为友方，是则给装备，否则弃置牌
								// 特殊情况太杂不好思考，等后来人补充
								const att = get.attitude(target, player);
								if (att > 0) {
									resultLinks.remove("discard");
								} else {
									resultLinks.remove("equip");
								}
							}
						}

						// 如果不选任何项，会进入连环状态；如果连环很亏，可以选择代价最低的一项来避免
						if (!resultLinks.length && !target.isLinked()) {
							let linkCost = 1;

							if (game.hasPlayer(current => current !== target && get.attitude(target, current) > 0 && current.isLinked())) {
								linkCost += 1;
							}
							if (get.nature(trigger.card)) {
								linkCost += 1;
							}
							if (get.damageEffect(target, player, target, "fire") < 0) {
								linkCost += 0.8;
							}
							if (get.damageEffect(target, player, target, "thunder") < 0) {
								linkCost += 0.8;
							}

							const minCost = Math.min(...costs);
							const index = costs.indexOf(minCost);

							if (linkCost > minCost) {
								resultLinks.push(links[index]);
							}
						}

						if (resultLinks.length) {
							return {
								bool: true,
								links: resultLinks,
							};
						}
						return {
							bool: false,
						};

						/**
						 * 计算移除【霆】的收益
						 *
						 * @param {Player} player - 发动【霆威】的角色
						 * @param {Player} target - 目前正在选择的角色
						 * @returns {number}
						 */
						function getTingValue(player, target) {
							// 如果实际上没有技能【寂灭】，【霆】就毫无用处，移除收益为0
							if (!player.hasSkill("jimie")) {
								return 0;
							}

							// 如果【寂灭】已经发动过且没有【驭雳】，【霆】也毫无用处，移除收益为0
							if (player.awakenedSkills.includes("jimie") && !player.hasSkill("yuli")) {
								return 0;
							}

							// 移除敌人的“霆”才有价值；如果是友方，几乎不想移除
							if (get.attitude(target, player) > 0) {
								return -1;
							}

							const mark = player.countMark("tingwei");

							let value = 1;
							// 能立刻开限定技，1枚霆价值极高
							if (mark >= 8) {
								value += 7;
							}
							// 下一次触发就够，1枚霆价值也很高，但由于可以留到下一轮选择，价值依次递减
							else if (mark === 7) {
								value += 4;
							} else if (mark === 6) {
								value += 2.5;
							} else if (mark === 5) {
								value += 1.5;
							}

							// 当前回合时，很容易触发，威胁提升
							if (_status.currentPhase === player) {
								value += 2;
							}

							value += Math.min(5, getTingThreat(player, target));

							return value;
						}

						/**
						 * 计算【霆】伤害造成的威胁
						 *
						 * @param {Player} player - 发动【霆威】的角色
						 * @param {Player} target - 目前正在选择的角色
						 * @returns {number}
						 */
						function getTingThreat(player, target) {
							let threat = 0;
							for (const current of game.filterPlayer(current => current === target || get.attitude(target, current) > 0)) {
								const damage = get.damageEffect(current, player, target);
								if (damage < 0) {
									threat = Math.max(threat, -damage * Math.max(1, current.maxHp / 2));
								}
							}
							return threat;
						}
					},
				})
				.set("source", player)
				.forResult();

			if (!result?.bool || !result.links?.length) {
				player.logSkill("tingwei", null, null, null, [get.rand(3, 4)]);
				await target.link(true);
				return;
			}

			const links = ["fengyin", "equip", "damage", "discard"];
			player.removeMark("tingwei", result.links.length);
			for (const link of links) {
				if (!result.links.includes(link)) {
					continue;
				}

				switch (link) {
					case "fengyin":
						target.addTempSkill("tingwei_fengyin", { player: "phaseEnd" });
						break;
					case "equip": {
						await target
							.chooseToGive({
								prompt: `请选择要交给${get.translation(player)}的装备牌`,
								target: player,
								filterCard(card) {
									const event = get.event();
									const target = get.player();
									if (get.type(card) !== "equip") {
										return false;
									}
									if (!event.discarding) {
										return true;
									}
									return target.hasDiscardableCards(target, "he", cardx => cardx !== card);
								},
								position: "he",
								forced: true,
							})
							.set("discarding", result.links.includes("discard"));
						break;
					}
					case "damage": {
						const id = target.playerid;
						if (id == null) {
							break;
						}

						const map = trigger.getParent()?.customArgs;
						if (map == null) {
							break;
						}
						if (!map[id]) {
							map[id] = {};
						}
						if (typeof map[id].extraDamage !== "number") {
							map[id].extraDamage = 0;
						}
						map[id].extraDamage++;
						break;
					}
					case "discard": {
						await target.randomDiscard("he");
						break;
					}
				}
			}

			return;
		},
		mark: true,
		marktext: "霆",
		intro: {
			name: "霆",
			content: "当前拥有#个“霆”标记",
		},
		subSkill: {
			fengyin: {
				inherit: "fengyin",
			},
		},
	},
	jimie: {
		audio: 4,
		trigger: { player: "phaseUseEnd" },
		limited: true,
		skillAnimation: true,
		filter(_event, player) {
			return player.countMark("tingwei") >= 8;
		},
		logAudio(event) {
			if (typeof event === "number") {
				return `jimie${event}.mp3`;
			}
			return 2;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "弃8枚“霆”标记，对一名角色造成等于其体力上限的伤害",
					ai(target) {
						const player = get.player();
						return get.damageEffect(target, player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill("jimie");
			player.removeMark("tingwei", 8);
			const target = event.targets[0];
			await target.damage({
				num: target.maxHp,
			});
			player.setStorage("yuli", [], true);
		},
	},
	//手杀神姜维
	mbtiantao: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			//return ["h", "e", "j"].some(pos => player.countDiscardableCards(player, pos));
			return true;
		},
		forced: true,
		async content(event, trigger, player) {
			const position = ["h", "e", "j"]; //.filter(pos => player.countDiscardableCards(player, pos)),
			const map = { h: "手牌区", e: "装备区", j: "判定区" };
			let list = position.map(i => map[i]);
			const result = await player
				.chooseControl({ controls: list })
				.set("prompt", `###${get.translation(event.name)}：选择一个区域并弃置其中所有牌###然后选择弃置任意名其他角色对应区域内的各一张牌。`)
				.set("ai", (event, player) => {
					const targets = game.filterPlayer(current => current !== player);
					const { position, controls } = get.event();
					const list = {};
					for (const pos of position) {
						let info = targets
							.filter(target => target.countDiscardableCards(player, pos))
							.reduce((sum, target) => {
								const eff = get.effect(target, { name: "guohe_copy", position: pos }, player, player);
								return eff > 0 ? sum + eff : sum;
							}, 0);
						list[pos] = info - (pos === "j" ? -1 : 1) * get.value(player.getDiscardableCards(player, pos));
					}
					let choice = Object.entries(list).sort((a, b) => b[1] - a[1])[0];
					return { h: "手牌区", e: "装备区", j: "判定区" }[choice[0]];
				})
				.set("position", position)
				.forResult();
			if (!result?.control || result.control === "cancel2") {
				return;
			}
			const pos = { 手牌区: "h", 装备区: "e", 判定区: "j" }[result.control];
			let doneList = new Map();
			const result2 = await player.modedDiscard(player.getCards(pos)).forResult();
			if (result2?.cards?.length) {
				doneList.set(player, result2.cards);
			}
			while (true) {
				if (!game.hasPlayer(current => current !== player && !doneList.has(current) && current.countDiscardableCards(player, pos))) {
					break;
				}
				let result = await player
					.chooseTarget(`天涛：选择一名其他角色，弃置其${{ h: "手牌区", e: "装备区", j: "判定区" }[pos]}内的一张牌`)
					.set("filterTarget", (_, player, target) => target !== player && !get.event().doneList.has(target) && target.countDiscardableCards(player, get.event().pos))
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
				const targets = [...doneList.entries()].filter(([_, cards]) => !cards.some(card => get.name(card) === "sha")).map(([target]) => target);
				await game.doAsyncInOrder(targets, async target => target.loseHp());
			}
		},
	},
	mbxinghun: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		manualConfirm: true,
		async content(event, trigger, player) {
			const num = 5;
			const cards = get.cards(num, true);
			let result = await player
				.chooseToMove_new("星魂：选择任意张手牌进行交换", true)
				.set("list", [
					["牌堆顶的牌", cards],
					["你的手牌", player.getCards("h")],
				])
				.set("filterMove", (from, to, moved) => typeof to !== "number")
				.set("processAI", list => {
					const player = get.player();
					let cards = list
						.map(i => i[1])
						.flat()
						.sort((a, b) => get.value(b, player) - get.value(a, player));
					let sha = cards.filter(card => get.name(card, player) === "sha");
					cards.removeArray(sha);
					const hs = [];
					let num = Math.ceil(sha.length / 2);
					if (num <= player.countCards("h")) {
						hs.addArray(sha.slice(0, num));
						sha.removeArray(hs);
					}
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
					.setContent(async (event, trigger, player) => {
						const { cards, moved } = event;
						const hs = player.getCards("h");
						const gain = moved[1].filter(card => !hs.includes(card));
						const puts = moved[0].filter(card => hs.includes(card));
						const originPile = cards.slice().removeArray(hs);
						//将手牌中有变动的和牌堆顶的牌送入处理区
						if (puts.length) {
							player.$throw(puts.length, 1000);
							await player.lose(puts, ui.ordering).set("getlx", false);
						}
						await game.cardsGotoOrdering(originPile);
						//手牌部分
						if (gain.length) {
							await player.gain(gain, "draw").set("getlx", false);
							//调整手牌顺序
							/*player.getCards("h").forEach(i => i.goto(ui.special));
							player.directgain(moved[1].slice().reverse(), false);*/
						}
						//牌堆部分
						await game.cardsGotoPile(moved[0].slice().reverse(), ["insert_card", true]);
						//知情牌
						game.addCardKnower(moved[0], player);
					});
			}
			if (!game.hasPlayer(current => current !== player)) {
				return;
			}
			result = await player
				.chooseTarget(`星魂：选择一名其他角色，令其展示牌堆顶和你的手牌共计${get.cnNumber(num)}张牌`, true)
				.set("filterTarget", (_, player, target) => target !== player)
				.set("ai", target => {
					const { player } = get.event();
					return get.effect(target, { name: "sha" }, player, player);
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const [target] = result.targets;
				player.line(target, "thunder");
				let showCards = [];
				const top = get.cards(5, true);
				if (player.countCards("h")) {
					const dialog = [];
					dialog.push("星魂：请选择五张牌");
					dialog.add(`<div class="text center">${get.translation(player)}的手牌</div>`);
					if (target.hasSkillTag("viewHandcard", null, player, true)) {
						dialog.push(player.getCards("h"));
					} else {
						dialog.push([player.getCards("h"), "blank"]);
					}
					dialog.addArray([`<div class="text center">牌堆顶</div>`, [top, "blank"]]);
					const result = await target
						.chooseButton(5, true)
						.set("createDialog", dialog)
						.set("top", top)
						.set("target", player)
						.set("ai", () => Math.random())
						.forResult();
					showCards = result?.links || [];
				} else {
					showCards = top;
				}
				await target
					.showCards(showCards, `${get.translation(target)}因“${get.translation(event.name)}”展示`)
					.set("customButton", button => {
						if (get.event().top.includes(button.link)) {
							button.node.gaintag.innerHTML = "牌堆顶";
						}
					})
					.set("top", top)
					.set("delay_time", 5);
				if (showCards.some(card => get.name(card) === "sha")) {
					let sha = showCards.filter(card => get.name(card) === "sha");
					while (sha.length) {
						let card = sha.shift();
						if (player.canUse(card, target, false, false)) {
							if (top.includes(card)) {
								top.remove(card);
							}
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
					if (!game.hasPlayer(current => current !== player && get.effect(current, { name: "sha" }, player, player) > 0)) {
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
				if (evt.name !== "dying" || evt.player !== player) {
					return false;
				}
				return true;
			}).length;
			if (num > 0) {
				await player.recover(num);
				const result = await player
					.chooseTarget(`神霈：选择一名角色对其造成${num}点雷电伤害`, true)
					.set("ai", target => {
						const { player } = get.event();
						return get.damageEffect(target, player, player, "thunder");
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					player.line(result.targets, "thunder");
					await result.targets[0].damage(num, "thunder");
				}
			}
			await player.addSkills("mbhuitian");
		},
	},
	mbhuitian: {
		audio: 4,
		trigger: {
			global: ["roundStart", "phaseEnd"],
		},
		filter(event, player, name) {
			if (name === "roundStart") {
				return player.hasAllHistory("useSkill", evt => evt.skill === "mbhuitian");
			}
			return event.player.getHp() > player.getHp();
		},
		async cost(event, trigger, player) {
			if (event.triggername === "roundStart") {
				event.result = {
					bool: true,
					die: true,
				};
			} else {
				event.result = await player
					.chooseBool(get.prompt2(event.skill))
					.set(
						"choice",
						(() => {
							if (player.hasAllHistory("useSkill", evt => evt.skill === "mbhuitian")) {
								return true;
							}
							let targets = game.filterPlayer(current => current !== player, undefined, true);
							if (!targets.length) {
								return false;
							}
							if (!trigger.player.getHistory().isRound) {
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
		logAudio: (a, b, c, d, costResult) => (costResult.die ? ["mbhuitian3.mp3", "mbhuitian4.mp3"] : 2),
		async content(event, tigger, player) {
			if (event.triggername === "roundStart") {
				await player.die();
			} else {
				await player.draw();
				player.insertPhase(event.name);
			}
		},
	},
	//刘巴
	duanbi: {
		limited: true,
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			let num1 = 0;
			let num2 = 0;
			const count = game.countPlayer(current => {
				num1 += current.countCards("h");
				num2++;
				return current !== player;
			});
			return count > 0 && num1 > num2 * 2;
		},
		filterTarget: true,
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		skillAnimation: true,
		animationColor: "orange",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = [];
			const targets = event.targets.sortBySeat();
			targets.remove(player);
			for (const target of targets) {
				const num = Math.min(3, Math.floor(target.countCards("h") / 2));
				if (num <= 0) {
					continue;
				}
				const result = await target
					.chooseToDiscard({
						selectCard: num,
						position: "h",
						forced: true,
					})
					.forResult();
				if (result.bool && Array.isArray(result.cards)) {
					cards.addArray(result.cards);
				}
			}
			const cards2 = cards.filter(card => get.position(card, true) === "d");
			if (!cards2.length) {
				return;
			}
			const gainText = cards2.length > 3 ? "随机获得三" : `获得${get.cnNumber(cards2.length)}`;
			const result = await player
				.chooseTarget({
					prompt: `是否令一名角色${gainText}张被弃置的牌？`,
					ai(target) {
						const player = get.player();
						let att = get.attitude(player, target);
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						if (target.hasJudge("lebu")) {
							att /= 4;
						}
						return att * Math.sqrt(Math.max(1, 5 - target.countCards("h")));
					},
				})
				.forResult();
			if (!result?.bool || !result.targets?.length) {
				return;
			}
			const target = result.targets[0];
			player.line(target, "fire");
			await target.gain({
				cards: cards2.randomGets(3),
				animate: "gain2",
			});
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player === target) {
						return 3;
					}
					return -Math.min(3, Math.floor(target.countCards("h") / 2));
				},
			},
		},
	},
	tongduo: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		usable: 1,
		filter(event, player) {
			return player !== event.player && event.targets.length === 1 && game.hasPlayer(current => current.countCards("he") > 0);
		},
		async cost(event, trigger, player) {
			event.result = await await player
				.chooseTarget({
					prompt: get.prompt("tongduo"),
					prompt2: "令一名角色重铸一张牌",
					filterTarget(card, player, target) {
						return target.hasCards("he", lib.filter.cardRecastable);
					},
					ai(target) {
						return get.attitude(_status.event.player, target) * Math.min(3, Math.floor(target.countCards("h", lib.filter.cardRecastable) / 2));
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (!target.hasCards("he", lib.filter.cardRecastable)) {
				return;
			}
			const result = await target
				.chooseCard({
					prompt: "请重铸一张牌",
					filterCard(card, player) {
						return lib.filter.cardRecastable(card, player);
					},
					position: "he",
					forced: true,
				})
				.forResult();
			if (!result?.bool || !result.cards?.length) {
				return;
			}
			await target.recast(result.cards);
		},
	},
	//朱儁
	yangjie: {
		audio: 2,
		group: ["yangjie_add"],
		enable: "phaseUse",
		prompt: "摸一张牌并与一名其他角色进行拼点",
		usable: 1,
		filter(event, player) {
			return !player.hasSkillTag("noCompareSource");
		},
		filterTarget(card, player, target) {
			return target !== player && target.hasCards("h") && !target.hasSkillTag("noCompareTarget");
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.draw();
			if (!player.canCompare(target)) {
				return;
			}
			const result = await player.chooseToCompare(target).set("small", true).forResult();
			if (result.bool) {
				return;
			}
			const cards = [result.player, result.target].filterInD("d");
			if (!cards.length || !game.hasPlayer(current => current !== player && current !== target)) {
				return;
			}
			event.cards = cards;
			const result2 = await player
				.chooseTarget({
					prompt: "请选择一名角色",
					prompt2: `令其获得${get.translation(cards)}，且视为对${get.translation(target)}使用一张火【杀】`,
					filterTarget(card, player, target) {
						return target !== player && target !== get.event().getParent()?.target;
					},
					ai(target) {
						const player = get.player();
						const evt = get.event().getParent();
						if (evt == null) {
							return 0;
						}
						const cards = evt.cards;
						const target2 = evt.target;
						const val = get.value(cards, target) * get.attitude(player, target);
						if (val <= 0) {
							return 0;
						}
						return val + (target.canUse({ name: "sha", nature: "fire", isCard: true }, target2, false) ? get.effect(target2, { name: "sha", nature: "fire", isCard: true }, target, player) : 0);
					},
				})
				.forResult();
			if (!result2?.bool || !result2.targets?.length) {
				return;
			}
			const source = result2.targets[0];
			event.source = source;
			player.line(source);
			await source.gain({
				cards,
				animate: "gain2",
			});
			const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true });
			if (target.isIn() && source.isIn() && source.canUse(card, target, false)) {
				await source.useCard({
					card,
					targets: [target],
					addCount: false,
				});
			}
		},
		subSkill: {
			add: {
				trigger: { player: "compare" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.getParent()?.name === "yangjie" && event.num1 > 1 && player.isDamaged();
				},
				async content(event, trigger, player) {
					const num = player.getDamagedHp();
					game.log(player, "的拼点牌点数-", num);
					trigger.num1 = Math.max(1, trigger.num1 - num);
				},
			},
		},
		ai: {
			order: 3,
			result: { target: -1.5 },
		},
	},
	zjjuxiang: {
		audio: 2,
		trigger: { global: "dyingAfter" },
		logTarget: "player",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return event.player !== player && event.player.isIn();
		},
		check(event, player) {
			return get.damageEffect(event.player, player, player) > 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await trigger.player.damage();
			if (trigger.player.maxHp > 0) {
				await player.draw(trigger.player.maxHp);
			}
		},
		ai: { expose: 10 },
	},
	xinyangjie: {
		audio: "yangjie",
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => player.canCompare(target));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		usable: 1,
		async content(event, trigger, player) {
			const target = event.target;
			const result = await player.chooseToCompare(target).set("small", true).forResult();
			if (result.bool) {
				return;
			}
			if (!game.hasPlayer(current => current !== player && current !== target && current.canUse({ name: "sha", nature: "fire", isCard: true }, target, false))) {
				return;
			}
			const result2 = await player
				.chooseTarget({
					prompt: "佯解：是否选择另一名其他角色？",
					prompt2: `令其视为对${get.translation(target)}使用一张火【杀】`,
					filterTarget(card, player, target) {
						const evt = get.event().getParent();
						if (evt == null) {
							return false;
						}
						return target !== player && target !== evt.target;
					},
					ai(target) {
						const player = get.player();

						const evt = get.event().getParent();
						if (evt == null) {
							return 0;
						}
						const target2 = evt.target;
						return get.effect(target2, { name: "sha", nature: "fire", isCard: true }, target, player);
					},
				})
				.set("ai", target => {
					const player = _status.event.player;
					const target2 = _status.event.getParent().target;
					return get.effect(target2, { name: "sha", nature: "fire", isCard: true }, target, player);
				})
				.forResult();
			if (!result2.bool || !result2.targets?.length) {
				return;
			}
			const source = result2.targets[0];
			player.line(source);
			game.log(player, "选择了", source);
			const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true });
			if (!target.isIn() || !source.isIn() || !source.canUse(card, target, false)) {
				return;
			}
			await source.useCard({
				card,
				targets: [target],
				addCount: false,
				noai: true,
			});
		},
		ai: {
			order: 3,
			result: {
				target(player, target) {
					const hs = player.getCards("h").sort((a, b) => a.number - b.number);
					const ts = target.getCards("h").sort((a, b) => a.number - b.number);
					if (!hs.length || !ts.length) {
						return 0;
					}
					if (hs[0].number <= ts[0].number) {
						return -3;
					}
					if (player.countCards("h") >= target.countCards("h")) {
						return -10;
					}
					return -1;
				},
			},
		},
	},
	xinjuxiang: {
		audio: "zjjuxiang",
		inherit: "zjjuxiang",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await trigger.player.damage();
		},
	},
	houfeng: {
		audio: 3,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			if (!["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].some(i => !event.player.hasSkill(i))) {
				return false;
			}
			return player.inRange(event.player);
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		round: 1,
		logAudio: () => 1,
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			const result = await player
				.chooseButton({
					createDialog: [`选择${get.translation(target)}要进行的整肃类型`, [["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].filter(i => !target.hasSkill(i)), "vcard"]],
					forced: true,
					ai() {
						return Math.random();
					},
				})
				.forResult();
			if (!result.bool || !result.links?.length) {
				return;
			}
			const name = result.links[0][2];
			target.addTempSkill("houfeng_share", {
				player: ["phaseDiscardAfter", "phaseAfter"],
			});
			target.markAuto("houfeng_share", [[player, name]]);
			target.addTempSkill(name, { player: ["phaseDiscardAfter", "phaseAfter"] });
			target.markAuto("houfeng", name);
			target.popup(name, "thunder");
			await game.delayx();
		},
		subSkill: {
			share: {
				audio: "houfeng",
				charlotte: true,
				onremove: ["houfeng", "houfeng_share"],
				trigger: { player: "phaseDiscardEnd" },
				forced: true,
				getIndex(event, player) {
					return player.getStorage("houfeng");
				},
				logAudio(event, player, _3, data) {
					if (!player.storage[data]) {
						return "houfeng3.mp3";
					}
					return "houfeng2.mp3";
				},
				async content(event, trigger, player) {
					player.unmarkAuto("houfeng", event.indexedData);
					if (!player.storage[event.indexedData]) {
						player.popup("整肃失败", "fire");
						game.log(player, "整肃失败");
						return;
					}
					player.popup("整肃成功", "wood");
					game.log(player, "整肃成功");
					const list = player
						.getStorage("houfeng_share")
						.filter(entry => entry[1] === event.indexedData && entry[0].isIn())
						.map(entry => entry[0]);
					list.unshift(player);
					let control;
					if (list.some(i => i.isDamaged())) {
						let drawEffect = 0;
						let recoverEffect = 0;
						for (const target of list) {
							drawEffect += 2 * get.effect(target, { name: "draw" }, player, player);
							recoverEffect += get.recoverEffect(target, player, player);
						}
						control = (
							await trigger.player
								.chooseControl({
									prompt: `整肃奖励：请选择${get.translation(list)}的整肃奖励`,
									controls: ["摸两张牌", "回复体力"],
									ai() {
										const evt = get.event();
										return ["摸两张牌", "回复体力"][evt.goon.indexOf(Math.max(...evt.goon))];
									},
								})
								.set("goon", [drawEffect, recoverEffect])
								.forResult()
						).control;
					} else {
						control = "摸两张牌";
					}
					if (control === "摸两张牌") {
						await game.asyncDraw(list, 2);
					} else {
						for (const target of list) {
							await target.recover();
						}
					}
					await game.delayx();
				},
			},
		},
	},
	houfeng1: { audio: true },
	//手杀皇甫嵩
	spzhengjun: {
		audio: 3,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return ["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].some(i => !player.hasSkill(i));
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton([get.prompt(event.skill), [["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].filter(i => !player.hasSkill(i)), "vcard"]])
				.set("ai", () => Math.random())
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links?.[0][2],
			};
		},
		onremove: true,
		logAudio: () => 1,
		async content(event, trigger, player) {
			const name = event.cost_data;
			player.addTempSkill("spzhengjun_share", {
				player: ["phaseDiscardAfter", "phaseAfter"],
			});
			player.addTempSkill(name, { player: ["phaseDiscardAfter", "phaseAfter"] });
			player.markAuto("spzhengjun", name);
			player.popup(name, "thunder");
			await game.delayx();
		},
		subSkill: {
			share: {
				audio: "spzhengjun",
				charlotte: true,
				trigger: { player: "phaseDiscardEnd" },
				forced: true,
				getIndex(event, player) {
					return player.getStorage("spzhengjun");
				},
				logAudio(event, player, _3, data) {
					if (!player.storage[data]) {
						return "spzhengjun3.mp3";
					}
					return "spzhengjun2.mp3";
				},
				async content(event, trigger, player) {
					player.unmarkAuto("spzhengjun", event.indexedData);
					if (!player.storage[event.indexedData]) {
						player.popup("整肃失败", "fire");
						game.log(player, "整肃失败");
						return;
					}
					player.popup("整肃成功", "wood");
					game.log(player, "整肃成功");
					await player.chooseDrawRecover(2, "整肃奖励：摸两张牌或回复1点体力", true);
					let result = await player
						.chooseTarget("整军：是否令一名其他角色也获得整肃奖励？", lib.filter.notMe)
						.set("ai", target => {
							const player = _status.event.player;
							return Math.max(2 * get.effect(target, { name: "draw" }, target, player), get.recoverEffect(target, target, player));
						})
						.forResult();
					if (!result.bool) {
						return;
					}
					const target = result.targets[0];
					player.line(target);
					if (target.isHealthy()) {
						result.index = 0;
					} else {
						result = await player
							.chooseControl("摸牌", "回血")
							.set("prompt", `整肃奖励：令${get.translation(target)}摸两张牌或回复1点体力`)
							.set("ai", () => (_status.event.goon ? 1 : 0))
							.set("goon", 2 * get.effect(target, { name: "draw" }, target, player) < get.recoverEffect(target, target, player))
							.forResult();
					}
					if (result.index) {
						await target.recover();
					} else {
						await target.draw(2);
					}
				},
			},
		},
	},
	spshiji: {
		audio: 2,
		trigger: { source: "damageBegin2" },
		logTarget: "player",
		filter(event, player) {
			return player !== event.player && event.hasNature("linked") && event.player.countCards("h") > 0 && !player.isMaxHandcard(true);
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.viewHandcards(target);
			const hs = target.getCards("h", { color: "red" });
			if (hs.length) {
				await target.discard(hs);
				await player.draw(hs.length);
			}
		},
	},
	sptaoluan: {
		audio: 2,
		trigger: { global: "judgeFixing" },
		usable: 1,
		filter(event, player) {
			return event.result && event.result.suit === "spade";
		},
		check(event, player) {
			return event.result.judge * get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			const evt = trigger.getParent();
			if (evt != null) {
				if (evt.name === "phaseJudge") {
					evt.excluded = true;
				} else {
					evt.finish();
					evt._triggered = null;
					if (evt.name.startsWith("pre_")) {
						const parent = evt.getParent();
						if (parent != null) {
							parent.finish();
							parent._triggered = null;
						}
					}
					const nexts = trigger.next.slice();
					for (const next of nexts) {
						if (next.name === "judgeCallback") {
							trigger.next.remove(next);
						}
					}
					const events = game.getGlobalHistory("cardMove", current => current.getParent(2) === trigger.getParent());
					const cards = [];
					for (const current of events.slice().reverse()) {
						for (const card of current.cards) {
							if (get.position(card, true) === "o") {
								cards.push(card);
							}
						}
					}
					trigger.orderingCards.addArray(cards);
				}
			}

			const list = [];
			if (get.position(trigger.result.card) === "d") {
				list.push(0);
			}
			if (trigger.player.isIn() && player.canUse({ name: "sha", nature: "fire", isCard: true }, trigger.player, false)) {
				list.push(1);
			}
			if (!list.length) {
				return;
			}
			let index = list[0];
			if (list.length === 2) {
				const result = await player
					.chooseControl({
						choiceList: [`获得${get.translation(trigger.result.card)}`, `视为对${get.translation(trigger.player)}使用一张火【杀】`],
						choice: get.effect(trigger.player, { name: "sha" }, player, player) > 0 ? 1 : 0,
					})
					.forResult();
				if (result.index != null) {
					index = result.index;
				}
			}
			if (index === 0) {
				await player.gain({
					cards: [trigger.result.card],
					animate: "gain2",
				});
			} else {
				await player.useCard({
					card: get.autoViewAs({ name: "sha", nature: "fire", isCard: true }),
					targets: [trigger.player],
					addCount: false,
				});
			}
		},
	},
	//吕范
	spdiaodu: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("spdiaodu"),
					prompt2: "令一名角色摸一张牌，然后移动其装备区内的一张牌",
					ai(target) {
						const player = _status.event.player;
						const att = get.attitude(player, target);
						if (att > 0) {
							if (target.hasCards("e", card => get.value(card, target) <= 0 && game.hasPlayer(current => current !== target && current.canEquip(card, false) && get.effect(current, card, player, player) > 0))) {
								return 2 * att;
							}
							if (!target.hasCards("e", card => game.hasPlayer(current => current !== target && current.canEquip(card)))) {
								return 1;
							}
							return 0;
						}
						if (att >= 0) {
							return 0;
						}
						if (target.hasCards("e", card => get.value(card, target) >= 4.5 && game.hasPlayer(current => current !== target && current.canEquip(card) && get.effect(current, card, player, player) > 0))) {
							return -att;
						}
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			event.target = target;
			await target.draw();
			const es = target.getCards("e", card => game.hasPlayer(current => current !== target && current.canEquip(card)));
			if (!es.length) {
				return;
			}
			let card;
			if (es.length === 1) {
				card = es[0];
			} else {
				const result = await player
					.chooseButton({
						createDialog: [`移动${get.translation(target)}的一张装备牌`, es],
						forced: true,
						ai(button) {
							const player = get.player();
							const evt = get.event().getParent();
							if (evt == null) {
								return 0;
							}
							const target = evt.target;
							const card = button.link;
							if (!game.hasPlayer(current => current !== target && current.canEquip(card) && get.effect(current, card, player, player) > 0)) {
								return 0;
							}
							return -get.value(card, target) * get.attitude(player, target);
						},
					})
					.forResult();
				if (!result?.bool || !result.links?.length) {
					return;
				}
				card = result.links[0];
			}
			const result = await player
				.chooseTarget({
					prompt: `选择${get.translation(card)}的移动目标`,
					filterTarget(card, player, target) {
						return target.canEquip(get.event().card);
					},
					forced: true,
					ai(target) {
						const evt = get.event();
						return get.effect(target, evt.card, evt.player, evt.player);
					},
				})
				.set("card", card)
				.forResult();
			if (!result?.bool || !result.targets?.length) {
				return;
			}
			const target2 = result.targets[0];
			target.line(target2);
			target.$give(card, target2);
			await game.delay(0.5);
			await target2.equip(card);
		},
	},
	spdiancai: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player !== event.player && player.hasHistory("lose", evt => evt.hs && evt.hs.length > 0);
		},
		async cost(event, trigger, player) {
			let num = player
				.getHistory("lose", evt => evt.hs)
				.map(evt => evt.hs.length)
				.reduce((a, b) => a + b);
			num = Math.min(num, game.countPlayer());
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("spdiancai"),
					prompt2: `令至多${get.cnNumber(num)}名角色各摸一张牌`,
					selectTarget: [1, num],
					ai(target) {
						const player = get.player();
						return get.attitude(player, target);
					},
				})
				.forResult();
			if (event.result.targets?.length) {
				event.result.targets.sortBySeat(trigger.player);
			}
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			if (targets.length === 1) {
				await targets[0].draw();
				return;
			}
			await game.asyncDraw(targets);
			await game.delayx();
		},
	},
	mbdiaodu: {
		audio: "spdiaodu",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target.hasCards("e", card => game.hasPlayer(current => current !== player && current !== target && current.canEquip(card))));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("mbdiaodu"),
					filterTarget(card, player, target) {
						return target.hasCards("e", card => game.hasPlayer(current => current !== player && current !== target && current.canEquip(card)));
					},
					ai(target) {
						const player = get.player();
						const att = get.attitude(player, target);
						if (att > 0 && target.hasCard(card => get.value(card, target) <= 0 && game.hasPlayer(current => current !== player && current !== target && current.canEquip(card, false) && get.effect(current, card, player, player) > 0), "e")) {
							return 2 * att;
						}
						if (att < 0 && target.hasCard(card => get.value(card, target) >= 4.5 && game.hasPlayer(current => current !== player && current !== target && current.canEquip(card) && get.effect(current, card, player, player) > 0), "e")) {
							return -att;
						}
						return 0;
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];

			const es = target.getCards("e", card => game.hasPlayer(current => current !== target && current.canEquip(card)));
			const result =
				es.length === 1
					? { bool: true, links: es }
					: await player
							.chooseButton({
								createDialog: [`移动${get.translation(target)}的一张装备牌`, es],
								forced: true,
								ai(button) {
									const { player, target } = get.event();
									const card = button.link;
									if (game.hasPlayer(current => current !== player && current !== target && current.canEquip(card) && get.effect(current, card, player, player) > 0)) {
										return -get.value(card, target) * get.attitude(player, target);
									}
									return 0;
								},
							})
							.set("target", target)
							.forResult();
			if (!result?.bool || !result.links?.length) {
				return;
			}
			const card = result.links[0];

			const result2 = await player
				.chooseTarget({
					prompt: `请选择${get.translation(card)}的移动目标`,
					filterTarget(card, player, target) {
						const { card2 } = get.event();
						return target !== player && target.canEquip(card2);
					},
					forced: true,
					ai(target) {
						const { player, card } = get.event();
						return get.effect(target, card, player, player);
					},
				})
				.set("card", card)
				.forResult();
			if (!result2?.bool || !result2.targets?.length) {
				return;
			}
			const target2 = result2.targets[0];
			target.line(target2);
			target.$give(card, target2);
			await game.delay(0.5);
			await target2.equip(card);
			await target.draw();
		},
	},
	mbdiancai: {
		audio: "spdiancai",
		trigger: { global: "phaseUseEnd" },
		filter(event, player) {
			if (_status.currentPhase === player) {
				return false;
			}
			let num = 0;
			player.getHistory("lose", evt => {
				if (evt.cards2 && evt.getParent("phaseUse") === event) {
					num += evt.cards2.length;
				}
			});
			return num >= player.hp && player.countCards("h") < player.maxHp;
		},
		frequent: true,
		async content(event, trigger, player) {
			const num = player.maxHp - player.countCards("h");
			if (num > 0) {
				await player.draw(num);
			}
		},
	},
	spyanji: {
		audio: 3,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return ["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].some(i => !player.hasSkill(i));
		},
		onremove: true,
		logAudio: () => 1,
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton([get.prompt(event.skill), [["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].filter(i => !player.hasSkill(i)), "vcard"]])
				.set("ai", () => Math.random())
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links?.[0][2],
			};
		},
		async content(event, trigger, player) {
			const name = event.cost_data;
			player.addTempSkill("spyanji_share", {
				player: ["phaseDiscardAfter", "phaseAfter"],
			});
			player.addTempSkill(name, { player: ["phaseDiscardAfter", "phaseAfter"] });
			player.markAuto("spyanji", name);
			player.popup(name, "thunder");
			await game.delayx();
		},
		subSkill: {
			share: {
				audio: "spyanji",
				charlotte: true,
				trigger: { player: "phaseDiscardEnd" },
				forced: true,
				getIndex(event, player) {
					return player.getStorage("spyanji");
				},
				logAudio(event, player, _3, data) {
					if (!player.storage[data]) {
						return "spyanji3.mp3";
					}
					return "spyanji2.mp3";
				},
				async content(event, trigger, player) {
					player.unmarkAuto("spyanji", event.indexedData);
					if (!player.storage[event.indexedData]) {
						player.popup("整肃失败", "fire");
						game.log(player, "整肃失败");
						return;
					}
					player.popup("整肃成功", "wood");
					game.log(player, "整肃成功");
					await player.chooseDrawRecover(2, "整肃奖励：摸两张牌或回复1点体力", true);
				},
			},
		},
	},
	//蒋钦
	spjianyi: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player !== event.player && game.getGlobalHistory("cardMove", evt => evt.name === "lose" && evt.type === "discard" && evt.cards.some(card => get.subtype(card, false) === "equip2" && get.position(card, true) === "d")).length > 0;
		},
		async content(event, trigger, player) {
			const cards = [];
			for (const evt of game.getGlobalHistory("cardMove")) {
				if (evt.name !== "lose" || evt.type !== "discard") {
					continue;
				}
				for (const card of evt.cards) {
					if (get.subtype(card, false) === "equip2" && get.position(card, true) === "d") {
						cards.push(card);
					}
				}
			}
			const result = await player
				.chooseButton({
					createDialog: ["俭衣：获得一张防具牌", cards],
					forced: true,
					ai(button) {
						const player = get.player();
						return get.value(button.link, player);
					},
				})
				.forResult();
			if (!result.bool || !result.links?.length) {
				return;
			}
			await player.gain({
				cards: result.links,
				animate: "gain2",
			});
		},
	},
	spshangyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0 && game.hasPlayer(current => lib.skill.spshangyi.filterTarget(null, player, current));
		},
		filterCard: true,
		position: "he",
		check(card) {
			return 6 - get.value(card);
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const target = event.target;
			await target.viewHandcards(player);
			await player.gainPlayerCard(target, "h", true, "visible");
		},
		ai: {
			order: 6,
			result: {
				player: 0.5,
				target(player, target) {
					if (target.hasSkillTag("noh")) {
						return 0;
					}
					return -1;
				},
			},
		},
	},
	//蒋琬
	spzhenting: {
		audio: 4,
		logAudio(_1, _2, _3, _4, costResult) {
			if (costResult?.cost_data === "all") {
				return ["spzhenting3.mp3", "spzhenting4.mp3"];
			}
			return 2;
		},
		trigger: { global: "useCardToTarget" },
		usable: 1,
		filter(event, player) {
			if (event.card.name !== "sha" && get.type(event.card, null, false) !== "delay") {
				return false;
			}
			return event.player !== player && (event.target === player || player.inRange(event.target));
		},
		async cost(event, trigger, player) {
			let list = [
				["discard", `弃置${get.translation(trigger.player)}一张手牌`],
				["draw", "摸一张牌"],
				["all", "背水！代替其成为此牌目标"],
			];
			if (player.hasSkill("spjincui_delete")) {
				list = list.slice(0, 2);
			}
			const result = await player
				.chooseButton([get.prompt(event.skill, trigger.target), [list, "textbutton"]])
				.set("filterButton", button => {
					const user = get.event().getTrigger().player;
					const player = get.player();
					return button.link !== "discard" || user.countDiscardableCards(player, "h");
				})
				.set("ai", button => {
					const trigger = get.event().getTrigger();
					const player = get.player();
					const { target, player: user, card } = trigger;
					let eff1 = get.effect(user, { name: "guohe_copy2" }, player, player);
					let eff2 = get.effect(player, { name: "draw" }, player, player);
					if (button.link === "discard") {
						return eff1;
					}
					if (button.link === "draw") {
						return eff2;
					}
					const getV = current => get.effect(current, card, user, player);
					let eff = getV(player) - getV(target) + eff2;
					if (user.countDiscardableCards(player, "h")) {
						eff += eff1;
					}
					return eff;
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links[0],
				};
			}
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const { cost_data: link } = event;
			const { target, player: user } = trigger;
			if (link !== "draw" && user.countDiscardableCards(player, "h")) {
				player.line(user, "fire");
				await player.discardPlayerCard(user, "h", true);
			}
			if (link !== "discard") {
				await player.draw();
			}
			if (link !== "all") {
				return;
			}
			const evt = trigger.getParent();
			if (evt.targets?.includes(player)) {
				return;
			}
			evt.triggeredTargets2.remove(target);
			evt.targets.remove(target);
			evt.triggeredTargets2.add(player);
			evt.targets.add(player);
			game.log(trigger.card, "的目标被改为了", player);
			trigger.untrigger();
		},
		ai: {
			threaten: 1.4,
		},
	},
	spjincui: {
		audio: 4,
		enable: "phaseUse",
		usable: 1,
		seatRelated: "changeSeat",
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		filterTarget: lib.filter.notMe,
		prompt() {
			const player = get.player();
			const num = player.hp - player.getAllHistory("useSkill", evt => evt.skill === "spzhenting").length;
			let str = "与一名其他角色交换座次";
			if (num > 0) {
				str = `${str}并失去${num}点体力`;
			}
			return str;
		},
		async content(event, trigger, player) {
			const { name, target } = event;
			player.awakenSkill(name);
			game.broadcastAll(
				(target1, target2) => {
					game.swapSeat(target1, target2);
				},
				player,
				target
			);
			const num = player.hp - player.getAllHistory("useSkill", evt => evt.skill === "spzhenting").length;
			if (num > 0) {
				await player.loseHp(num);
			}
			if (
				game.hasGlobalHistory("changeHp", evt => {
					if (evt.player !== player || !evt.num) {
						return false;
					}
					return evt.getParent().name === "loseHp" && evt.getParent(2) === event;
				})
			) {
				return;
			}
			await player.gainMaxHp();
			player.addSkill("spjincui_delete");
		},
		ai: {
			order: 5,
			result: {
				player(player, target) {
					if (player.hasUnknown()) {
						return 0;
					}
					let num = 0;
					let current = player.next;
					while (true) {
						num -= get.sgnAttitude(player, current);
						if (current === target) {
							break;
						}
						current = current.next;
					}
					while (true) {
						if (current === player) {
							break;
						}
						num += get.sgnAttitude(player, current) * 1.1;
						current = current.next;
					}
					const count = Math.max(0, player.hp - player.getAllHistory("useSkill", evt => evt.skill === "spzhenting").length);
					return num + 1 - count;
				},
			},
		},
		subSkill: {
			delete: {
				charlotte: true,
			},
		},
	},
	//张昌蒲
	spdifei: {
		audio: 2,
		trigger: { player: "damageEnd" },
		forced: true,
		usable: 1,
		async content(event, trigger, player) {
			const next = player.chooseToDiscard({
				prompt: "抵诽：弃置一张手牌或摸一张牌",
				position: "h",
				ai(card) {
					return -get.value(card);
				},
			});
			if (trigger.card) {
				const suit = get.suit(trigger.card, false);
				if (suit != null && lib.suit.includes(suit)) {
					next.set("suit", suit);
					next.set("prompt2", `然后若没有${get.translation(suit)}手牌则回复1点体力`);
					next.set("ai", card => {
						const player = get.player();
						const suit = get.event().suit;
						if (player.hasCard(cardx => cardx !== card && get.suit(cardx) === suit, "h")) {
							return 0;
						}
						if (get.name(card) !== "tao" && ((get.position(card) === "h" && get.suit(card) === suit) || player.hp === 1)) {
							return 8 - get.value(card);
						}
						return 5 - get.value(card);
					});
				}
			}
			const result = await next.forResult();
			if (!result.bool) {
				await player.draw();
			}
			await player.showHandcards();
			if (trigger.card) {
				const suit = get.suit(trigger.card, false);
				if ((suit != null && !lib.suit.includes(suit)) || !player.hasCards("h", { suit })) {
					await player.recover();
				}
			}
		},
	},
	spyanjiao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = get.addNewRowList(player.getCards("h"), "suit", player);
				const dialog = ui.create.dialog();
				dialog.add([
					[[`###严教###<div class="text center">${get.translation("spyanjiao", "info")}</div>`], "addNewRow"],
					[
						dialog => {
							dialog.classList.add("fullheight");
							dialog.forcebutton = false;
							dialog._scrollset = false;
						},
						"handle",
					],
					list.map(item => [Array.isArray(item) ? item : [item], "addNewRow"]),
				]);
				return dialog;
			},
			filter(button, player) {
				return button.links.length;
			},
			check(button) {
				const player = get.player();
				let map = {};
				let hs = player.getCards("h");
				let min = Infinity;
				let min_suit = null;
				for (const card of hs) {
					const suit = get.suit(card, player);
					if (!map[suit]) {
						map[suit] = 0;
					}
					map[suit] += get.value(card);
				}
				for (const suit in map) {
					if (map[suit] < min) {
						min = map[suit];
						min_suit = suit;
					}
				}
				if (get.suit(button.links[0], player) === min_suit) {
					return 1;
				}
				return 0;
			},
			backup(links, player) {
				return {
					audio: "spyanjiao",
					filterCard: { suit: links[0] },
					selectCard: -1,
					position: "h",
					filterTarget: lib.filter.notMe,
					discard: false,
					lose: false,
					delay: false,
					async content(event, trigger, player) {
						const { cards, target } = event;
						player.addSkill("spyanjiao_draw");
						player.addMark("spyanjiao_draw", cards.length, false);
						await player.give(cards, target);
						await target.damage("nocard");
					},
					ai: {
						result: {
							target(player, target) {
								if (!ui.selected.cards.length) {
									return 0;
								}
								const val = get.value(ui.selected.cards, target);
								if (val < 0) {
									return val + get.damageEffect(target, player, target);
								}
								if (val > 5 || get.value(ui.selected.cards, player) > 5) {
									return 0;
								}
								return get.damageEffect(target, player, target);
							},
						},
					},
				};
			},
			prompt: () => "请选择【严教】的目标",
		},
		subSkill: {
			draw: {
				audio: "spyanjiao",
				charlotte: true,
				onremove: true,
				trigger: { player: "phaseBegin" },
				forced: true,
				async content(event, trigger, player) {
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					await player.draw(num);
				},
				mark: true,
				intro: { content: "下回合开始时摸#张牌" },
			},
			backup: { audio: "spyanjiao" },
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	//崔琰
	spyajun: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			let hs = player.getCards("h");
			return (
				hs.length > 0 &&
				!player.hasSkillTag("noCompareSource") &&
				player.hasHistory("gain", evt => {
					for (const i of evt.cards) {
						if (hs.includes(i)) {
							return true;
						}
					}
					return false;
				}) &&
				game.hasPlayer(current => current !== player && player.canCompare(current))
			);
		},
		async cost(event, trigger, player) {
			let cards = [];
			const hs = player.getCards("h");
			player.getHistory("gain", evt => {
				cards.addArray(evt.cards);
			});
			cards = cards.filter(i => hs.includes(i));
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt("spyajun"),
					prompt2: "操作提示：选择一张本回合新得到的牌作为拼点牌，然后选择一名拼点目标",
					cards: cards,
					filterCard(card) {
						return _status.event.cards.includes(card);
					},
					filterTarget(card, player, target) {
						return player.canCompare(target);
					},
					ai1(card) {
						return get.number(card) - get.value(card);
					},
					ai2(target) {
						return -get.attitude(_status.event.player, target) * Math.sqrt(5 - Math.min(4, target.countCards("h"))) * (target.hasSkillTag("noh") ? 0.5 : 1);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards: [card],
				targets: [target],
			} = event;
			const next = player.chooseToCompare(target);
			next.fixedResult ??= {};
			next.fixedResult[player.playerid] = card;
			const result = await next.forResult();
			if (result.bool) {
				const cards = [result.player, result.target].filterInD("d");
				if (cards.length) {
					const result2 = await player
						.chooseButton(["雅俊：是否将一张牌置于牌堆顶？", cards])
						.set("ai", button => {
							if (get.color(button.link) === "black") {
								return 1;
							}
							return 0;
						})
						.forResult();
					if (result2.bool && result2.links?.length) {
						const { links } = result2;
						game.log(player, "将", links, "置于牌堆顶");
						await game.cardsGotoPile(links, "insert");
					}
				}
			} else {
				player.addMark("spyajun_less", 1, false);
				player.addTempSkill("spyajun_less");
			}
		},
		group: "spyajun_draw",
		subSkill: {
			draw: {
				audio: "spyajun",
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				locked: false,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
			less: {
				onremove: true,
				charlotte: true,
				intro: { content: "手牌上限-#" },
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("spyajun_less");
					},
				},
			},
		},
	},
	spzundi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		filterTarget: true,
		check(card) {
			return 7 - get.value(card);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player.judge().forResult();
			if (result.color) {
				switch (result.color) {
					case "black":
						await target.draw(3);
						break;

					case "red":
						await target.moveCard();
						break;

					default:
						break;
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (target.canMoveCard(true)) {
						return 3;
					}
					return 1;
				},
			},
		},
	},
	//花蔓
	spxiangzhen: {
		trigger: { target: "useCardToBefore" },
		forced: true,
		audio: 2,
		filter(event, player) {
			return event.card.name === "nanman";
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
		group: "spxiangzhen_draw",
		subSkill: {
			draw: {
				audio: "spxiangzhen",
				trigger: { global: "useCardAfter" },
				forced: true,
				filter(event, player) {
					return event.card.name === "nanman" && game.hasPlayer2(current => current.hasHistory("damage", evt => evt.card === event.card));
				},
				async content(event, trigger, player) {
					let sources = game.filterPlayer(cur => cur.hasHistory("sourceDamage", evt => evt.card === trigger.card));
					sources.push(player);
					await game.asyncDraw(sources.sortBySeat());
					game.delayx();
				},
			},
		},
	},
	spfangzong: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			return player.countCards("h") < Math.min(8, game.countPlayer());
		},
		async content(event, trigger, player) {
			await player.drawTo(Math.min(8, game.countPlayer()));
		},
		mod: {
			playerEnabled(card, player, target) {
				if (player === _status.currentPhase && get.tag(card, "damage") > 0 && !player.isTempBanned("spfangzong") && player.inRange(target)) {
					return false;
				}
			},
			targetEnabled(card, player, target) {
				if (get.tag(card, "damage") > 0 && !target.isTempBanned("spfangzong") && player.inRange(target)) {
					return false;
				}
			},
		},
		ai: {
			combo: "spxizhan",
			halfneg: true,
		},
	},
	spxizhan: {
		audio: 5,
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return player !== event.player;
		},
		logAudio(event, player, name, indexedData, costResult) {
			if (!costResult.cards.length) {
				return "spxizhan2.mp3";
			}
			let suit = get.suit(costResult.cards[0]);
			return `spxizhan${[null, "spade", null, "heart", "club", "diamond"].indexOf(suit)}.mp3`;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseToDiscard("he", "嬉战：弃置一张牌或失去1点体力", `根据弃置的牌对${get.translation(trigger.player)}视为使用如下牌：<br>♠，其使用【酒】；♥，你使用【无中生有】<br>♣，对其使用【铁索连环】；♦：对其使用火【杀】`)
				.set("ai", card => {
					let player = _status.event.player;
					let target = _status.event.getTrigger().player;
					let suit = get.suit(card, player);
					let list;
					switch (suit) {
						case "spade":
							list = [{ name: "jiu" }, target, target];
							break;
						case "heart":
							list = [{ name: "wuzhong" }, player, player];
							break;
						case "club":
							list = [{ name: "tiesuo" }, player, target];
							break;
						case "diamond":
							list = [{ name: "sha", nature: "fire" }, player, target];
							break;
						default:
							return 0;
					}
					list[0].isCard = true;
					let eff = 0;
					if (list[1].canUse(list[0], list[2], false)) {
						eff = get.effect(list[2], list[0], list[1], player);
					}
					if (eff >= 0 || suit === "club") {
						eff = Math.max(eff, 5);
					}
					return eff * 1.5 - get.value(card);
				})
				.set("chooseonly", true)
				.forResult();
			event.result = {
				bool: true,
				cards: result.cards || [],
				targets: [trigger.player],
			};
		},
		async content(event, trigger, player) {
			if (event.cards && event.cards.length) {
				await player.discard(event.cards);
				player.tempBanSkill("spfangzong");
				let target = trigger.player;
				let card = event.cards[0];
				let suit = get.suit(card, player);
				if (!lib.suit.includes(suit) || ((!target || !target.isIn()) && suit !== "heart")) {
					return;
				}
				switch (suit) {
					case "spade":
						await target.chooseUseTarget("jiu", true);
						break;
					case "heart":
						await player.chooseUseTarget("wuzhong", true);
						break;
					case "club":
						if (player.canUse("tiesuo", target)) {
							await player.useCard({ name: "tiesuo", isCard: true }, target);
						}
						break;
					case "diamond":
						if (player.canUse({ name: "sha", isCard: true, nature: "fire" }, target, false)) {
							await player.useCard({ name: "sha", isCard: true, nature: "fire" }, target, false);
						}
						break;
				}
			} else {
				await player.loseHp();
			}
		},
		ai: {
			halfneg: true,
		},
	},
	//高览
	spjungong: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			const num = player.countMark("spjungong_used");
			return num < player.hp || num <= player.countCards("he");
		},
		filterTarget(card, player, target) {
			return target !== player && player.canUse("sha", target, false);
		},
		filterCard: true,
		position: "he",
		selectCard() {
			const player = get.player();
			const num = player.countMark("spjungong_used") + 1;
			if (ui.selected.cards.length || num > player.hp) {
				return num;
			}
			return [0, num];
		},
		check(card) {
			return 6 - get.value(card);
		},
		prompt() {
			const player = get.player();
			const num = get.cnNumber(player.countMark("spjungong_used") + 1);
			return `弃置${num}张牌或失去${num}点体力，视为使用杀`;
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			player.addTempSkill("spjungong_used");
			player.addMark("spjungong_used", 1, false);
			if (!cards.length) {
				await player.loseHp(player.countMark("spjungong_used"));
			}
			await player.useCard({
				card: get.autoViewAs({ name: "sha", isCard: true }),
				targets: [target],
				addCount: false,
			});
			if (
				player.hasHistory("sourceDamage", evt => {
					const card = evt.card;
					if (!card || card.name !== "sha") {
						return false;
					}
					const useEvent = evt.getParent("useCard");
					return useEvent != null && useEvent.card === card && useEvent.getParent() === event;
				})
			) {
				player.tempBanSkill("spjungong");
			}
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) + 1;
			},
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					return get.effect(target, { name: "sha" }, player, target);
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: { content: "已发动过#次" },
			},
		},
	},
	spdengli: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		frequent: true,
		filter(event, player) {
			return event.card.name === "sha" && event.player.hp === event.target.hp;
		},
		async content(event, trigger, player) {
			await player.draw();
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					let hp = player.hp;
					let evt = _status.event;
					if (evt.name === "chooseToUse" && evt.player === player && evt.skill === "spjungong" && !ui.selected.cards.length) {
						hp -= (player.getStat("skill").spjungong || 0) + 1;
					}
					if (card && card.name === "sha" && hp === target.hp) {
						return [1, 0.3];
					}
				},
				target_use(card, player, target) {
					if (card && card.name === "sha" && player.hp === target.hp) {
						return [1, 0.3];
					}
				},
			},
		},
	},
	//孙翊
	zaoli: {
		trigger: { player: "phaseBegin" },
		audio: 2,
		forced: true,
		filter(event, player) {
			return player.hasMark("zaoli");
		},
		async content(event, trigger, player) {
			const num = player.storage.zaoli;
			player.removeMark("zaoli", num);
			const result = player.hasCards("he")
				? await player
						.chooseToDiscard({
							prompt: "躁厉：弃置至少一张牌",
							selectCard: [1, Infinity],
							position: "he",
							forced: true,
							allowChooseAll: true,
							ai(card) {
								return card.hasGaintag("zaoli") ? 1 : 5 - get.value(card);
							},
						})
						.forResult()
				: { bool: false, cards: [] };
			await player.draw(num + (result.bool ? result.cards?.length : 0));
			if (num > 2) {
				await player.loseHp();
			}
		},
		mod: {
			cardEnabled2(card, player) {
				if (player === _status.currentPhase && get.itemtype(card) === "card" && card.hasGaintag("zaoli")) {
					return false;
				}
			},
		},
		group: ["zaoli_add", "zaoli_count"],
		init(player) {
			if (player === _status.currentPhase) {
				const gains = player.getHistory("gain").flatMap(evt => evt.cards);
				const hs = player.getCards("h", card => !gains.includes(card));
				if (hs.length) {
					player.addGaintag(hs, "zaoli");
				}
			}
		},
		onremove(player) {
			player.removeGaintag("zaoli");
			delete player.storage.zaoli;
		},
		intro: { content: "mark" },
		subSkill: {
			add: {
				audio: "zaoli",
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				filter(event, player) {
					return (
						player.countMark("zaoli") < 4 &&
						player.hasHistory("lose", evt => {
							const evtx = evt.relatedEvent || evt.getParent();
							return evt.hs && evt.hs.length > 0 && evtx === event;
						})
					);
				},
				async content(event, trigger, player) {
					player.addMark("zaoli", 1);
				},
			},
			count: {
				trigger: { global: "phaseBeginStart" },
				forced: true,
				firstDo: true,
				silent: true,
				filter(event, player) {
					if (player === event.player) {
						return player.hasCards("h");
					}
					return player.hasCard(card => card.hasGaintag("zaoli"));
				},
				async content(event, trigger, player) {
					if (player === trigger.player) {
						player.addGaintag(player.getCards("h"), "zaoli");
					} else {
						player.removeGaintag("zaoli");
					}
				},
			},
		},
	},
	//王双
	yiyong: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.card && event.card.name === "sha" && event.source && event.source.isIn() && player !== event.source && event.cards.filterInD().length > 0 && player.getEquips(1).length > 0;
		},
		check(event, player) {
			const card = {
				name: "sha",
				cards: event.cards.filterInD(),
			};
			const target = event.source;
			return !player.canUse(card, target, false) || get.effect(target, card, player, player) > 0;
		},
		async content(event, trigger, player) {
			const cards = trigger.cards.filterInD();
			await player.gain({
				cards,
				animate: "gain2",
			});
			const target = trigger.source;
			const handcards = player.getCards("h");
			if (!target || !target.isIn() || handcards.length < cards.length || !cards.every(card => handcards.includes(card)) || !player.canUse({ name: "sha", cards }, target, false)) {
				return;
			}
			const useCardEvent = player.useCard({
				card: get.autoViewAs({ name: "sha" }),
				cards,
				targets: [target],
				addCount: false,
			});
			if (!target.getEquips(1).length) {
				useCardEvent.baseDamage = 2;
			}
			await useCardEvent;
		},
	},
	shanxie: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			const card = get.cardPile2(card => get.subtype(card) === "equip1");
			if (card) {
				await player.gain({
					cards: [card],
					animate: "gain2",
				});
				return;
			}
			const targets = game.filterPlayer(current => current.getEquips(1).length > 0);
			if (!targets.length) {
				return;
			}
			const target = targets.randomGet();
			await player.gain({
				cards: target.getEquips(1),
				source: target,
				animate: "give",
				bySelf: true,
			});
		},
		ai: {
			order: 9,
			result: { player: 1 },
		},
		group: ["shanxie_exclude", "shanxie_shan"],
		subSkill: {
			exclude: {
				trigger: { global: "useCard" },
				forced: true,
				locked: false,
				filter(event, player) {
					if (event.card.name !== "shan" || event.getParent(2)?.player !== player) {
						return false;
					}
					const num = get.number(event.card);
					return typeof num !== "number" || num <= player.getAttackRange() * 2;
				},
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.all_excluded = true;
				},
				sub: true,
			},
			shan: {
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.target.isAlive() && event.card.name === "sha";
				},
				silent: true,
				async content(event, trigger, player) {
					trigger.target.addTempSkill("shanxie_banned");
					trigger.target.storage.shanxie_banned = {
						card: trigger.card,
						num: player.getAttackRange() * 2,
					};
				},
				sub: true,
			},
			banned: {
				init(player) {
					player.storage.shanxie_banned = {};
				},
				onremove(player) {
					delete player.storage.shanxie_banned;
				},
				trigger: { global: "useCardEnd" },
				filter(event, player) {
					return event.card === player.storage.shanxie_banned.card;
				},
				silent: true,
				async content(event, trigger, player) {
					player.removeSkill("shanxie_banned");
				},
				ai: {
					effect: {
						player(card, player, target) {
							if (get.name(card) === "shan") {
								const num = get.number(card);
								if (!num || num <= player.storage.shanxie_banned.num) {
									return "zeroplayertarget";
								}
							}
						},
					},
				},
			},
		},
	},
	//吴景流兵
	liubing: {
		audio: 2,
		trigger: { player: "useCard1" },
		forced: true,
		filter(event, player) {
			if (event.card.name !== "sha" || !event.cards || !event.cards.length) {
				return false;
			}
			let evt = event.getParent("phaseUse");
			return evt && evt.player === player && player.getHistory("useCard", evt2 => evt2.card.name === "sha" && evt2.cards && evt2.cards.length && evt2.getParent("phaseUse") === evt).indexOf(event) === 0;
		},
		async content(event, trigger, player) {
			game.log(player, "将", trigger.card, "的花色改为", "#y♦");
			trigger.card.suit = "diamond";
			trigger.card.color = "red";
		},
		group: "liubing_gain",
		subSkill: {
			gain: {
				trigger: { global: "useCardAfter" },
				forced: true,
				audio: "liubing",
				filter(event, player) {
					return event.player !== player && event.card.isCard && event.card.name === "sha" && get.color(event.card) === "black" && event.cards.filterInD().length > 0 && event.player.isPhaseUsing() && !event.player.hasHistory("sourceDamage", evt => evt.card === event.card);
				},
				logTarget: "player",
				async content(event, trigger, player) {
					await player.gain(trigger.cards.filterInD(), "gain2");
				},
			},
		},
	},
	//新刘璋
	jutu: {
		audio: "xiusheng",
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.storage.yaohu && game.hasPlayer(current => current.group === player.storage.yaohu);
		},
		async content(event, trigger, player) {
			const cards = player.getExpansions("jutu");
			if (cards.length > 0) {
				await player.gain({
					cards,
					animate: "gain2",
				});
			}
			const num = game.countPlayer(current => current.group === player.storage.yaohu);
			await player.draw(num + 1);
			if (!num) {
				return;
			}
			const he = player.getCards("he");
			if (!he.length) {
				return;
			}
			let cards2 = he;
			if (he.length >= num) {
				const result = await player
					.chooseCard({
						prompt: `选择${get.cnNumber(num)}张牌作为生`,
						selectCard: num,
						position: "he",
						forced: true,
					})
					.forResult();
				if (result.bool && result.cards?.length) {
					cards2 = result.cards;
				}
			}
			if (cards2) {
				await player.addToExpansion({
					cards: cards2,
					source: player,
					animate: "give",
					gaintag: ["jutu"],
				});
			}
			await game.delayx();
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile({ cards });
			}
		},
		ai: {
			combo: "yaohu",
		},
	},
	yaohu: {
		audio: "yinlang",
		trigger: { player: "phaseBegin" },
		locked: false,
		filter(event, player) {
			return !player.hasSkill("yaohu_round") && game.hasPlayer(current => current.group && current.group !== "unknown");
		},
		async cost(event, trigger, player) {
			const list = game
				.filterPlayer(current => current.group != null && current.group !== "unknown")
				.map(current => current.group)
				.unique();
			list.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
			if (!player.hasSkill("yaohu")) {
				list.push("cancel2");
			}

			const getn = group =>
				game.countPlayer(current => {
					if (current.group !== group) {
						return false;
					}
					if (player === current) {
						return 2;
					}
					if (get.attitude(current, player) > 0) {
						return 1;
					}
					return 1.3;
				});
			const list2 = list.toSorted((a, b) => getn(b) - getn(a));
			const choice = list2[0];

			const result = await player
				.chooseControl({
					prompt: "邀虎：请选择一个势力",
					controls: list,
					ai() {
						return get.event().choice;
					},
				})
				.set("choice", choice)
				.forResult();

			event.result = {
				bool: result.control !== "cancel2",
				targets: game.filterPlayer(current => current.group === result.control),
				cost_data: {
					group: result.control,
				},
			};
		},
		async content(event, trigger, player) {
			const group = event.cost_data.group;
			game.log(player, "选择了", `#y${get.translation(`${group}2`)}`);
			player.storage.yaohu = group;
			player.markSkill("yaohu");
		},
		ai: {
			combo: "jutu",
		},
		intro: { content: "已选择了$势力" },
		group: "yaohu_gain",
		subSkill: {
			round: {},
			gain: {
				audio: "yinlang",
				trigger: { global: "phaseUseBegin" },
				locked: false,
				filter(event, player) {
					return event.player !== player && event.player.group === player.storage.yaohu && event.player.isIn() && player.hasExpansions("jutu");
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = trigger.player;
					const result = await target
						.chooseButton({
							createDialog: ["选择获得一张“生”", player.getExpansions("jutu")],
							forced: true,
							ai(button) {
								const player = get.player();
								return get.value(button.link, player);
							},
						})
						.forResult();
					if (result?.bool && result.links?.length) {
						await target.gain({
							cards: result.links,
							source: player,
							animate: "give",
							bySelf: true,
						});
					}

					if (!game.hasPlayer(current => current !== player && current !== target)) {
						return;
					}
					const result2 = await player
						.chooseTarget({
							prompt: `选择${get.translation(target)}使用【杀】的目标`,
							filterTarget(card, player, target) {
								return target !== player && target !== _status.event.source;
							},
							forced: true,
							ai(target) {
								const evt = get.event();
								return get.effect(target, { name: "sha" }, evt.source, evt.player);
							},
						})
						.set("source", target)
						.forResult();
					if (!result2?.bool || !result2.targets?.length) {
						return;
					}
					const result3 = await target
						.chooseToUse({
							prompt: `对${get.translation(result2.targets[0])}使用一张杀，否则交给其两张牌`,
							filterCard(card, player, event) {
								if (get.name(card) !== "sha") {
									return false;
								}
								return lib.filter.filterCard(card, player, event);
							},
							filterTarget(card, player, target) {
								if (target !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
									return false;
								}
								return lib.filter.targetEnabled(card, player, target);
							},
							complexTarget: true,
						})
						.set("targetRequired", true)
						.set("complexSelect", true)
						.set("sourcex", result2.targets[0])
						.set("addCount", false)
						.forResult();
					if (result3.bool) {
						return;
					}
					const hs = target.getCards("he");
					if (!hs.length) {
						return;
					}
					const result4 =
						hs.length <= 2
							? { bool: true, cards: hs }
							: await target
									.chooseCard({
										prompt: `交给${get.translation(player)}两张牌`,
										selectCard: 2,
										position: "he",
										forced: true,
									})
									.forResult();
					if (result4.bool) {
						await target.give(result4.cards, player);
					}
				},
			},
		},
	},
	rehuaibi: {
		audio: "huaibi",
		zhuSkill: true,
		mod: {
			maxHandcard(player, num) {
				if (player.storage.yaohu && player.hasZhuSkill("rehuaibi")) {
					return num + game.countPlayer(current => current.group === player.storage.yaohu);
				}
			},
		},
		ai: { combo: "yaohu" },
	},
	//宗预
	zhibian: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current !== player && player.canCompare(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("zhibian"),
					prompt2: "与一名其他角色进行拼点",
					filterTarget(card, player, target) {
						return target !== player && player.canCompare(target);
					},
					ai(target) {
						const { player, goon } = get.event();
						if (!goon) {
							return false;
						}
						const att = get.attitude(player, target);
						if (att < 0 && target.hasCards("e", card => player.canEquip(card) && get.effect(player, card, target, player) > 0)) {
							return -att / Math.sqrt(target.countCards("h"));
						}
						if (!player.isDamaged()) {
							return false;
						}
						if (att <= 0) {
							return (1 - att) / Math.sqrt(target.countCards("h"));
						}
						return Math.sqrt((2 / att) * Math.sqrt(target.countCards("h")));
					},
				})
				.set(
					"goon",
					player.hasCard(card => card.number >= 14 - player.hp && get.value(card) <= 5)
				)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];

			const result = await player.chooseToCompare(target).forResult();
			if (!result?.bool) {
				await player.loseHp();
				return;
			}

			const list = [];
			const list2 = [`将${get.translation(target)}装备区/判定区中的一张牌移动到你的区域内`, "回复1点体力", "背水！跳过摸牌阶段，并依次执行上述所有选项"];
			if (target.hasCard(card => player.canEquip(card), "e") || target.hasCard(card => player.canAddJudge(card), "j")) {
				list.push("选项一");
			}
			if (player.isDamaged()) {
				list.push("选项二");
			}
			if (list.includes("选项一")) {
				list.push("背水！");
			}
			list.push("cancel2");

			const resultx = !player.isDamaged() ? 0 : player.hp <= 2 || target.hasCards("e", card => player.canEquip(card) && get.value(card, target) >= 4 + player.getDamagedHp()) ? 1 : 0;
			const result2 = await player
				.chooseControl({
					controls: list,
					choiceList: list2,
					ai() {
						return get.event().resultx;
					},
				})
				.set("resultx", resultx)
				.forResult();
			if (result2.control === "cancel2") {
				return;
			}
			const control = result2.control;

			if (control === "选项一" || control === "背水！") {
				const result3 = await player
					.choosePlayerCard({
						target,
						position: "ej",
						forced: true,
						ai(button) {
							return get.buttonValue(button);
						},
					})
					.forResult();
				if (result3.bool) {
					const card = result3.cards[0];
					target.$give(card, player, false);
					await game.delayx();
					if (get.position(card) === "e") {
						await player.equip(card);
					} else {
						await player.addJudge(card);
					}
				}
			}
			if (control === "选项二" || control === "背水！") {
				await player.recover();
			}
			if (control === "背水！") {
				player.skip("phaseDraw");
			}
		},
	},
	yuyan: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		forced: true,
		logTarget: "player",
		filter(event, player) {
			return event.card.name === "sha" && event.card.isCard && typeof get.number(event.card) === "number" && player.hp < event.player.hp;
		},
		async content(event, trigger, player) {
			const num = get.number(trigger.card);
			/** @type {Partial<Result>} */
			let result = { bool: false };
			if (
				typeof num === "number" &&
				num < 13 &&
				trigger.player.hasCards("he", card => {
					if (_status.connectMode && get.position(card) === "h") {
						return true;
					}
					const numx = get.number(card);
					return typeof numx === "number" && numx > num;
				})
			) {
				result = await trigger.player
					.chooseCard({
						prompt: `交给${get.translation(player)}一张点数大于${get.cnNumber(num)}的牌，或令${get.translation(trigger.card)}对其无效`,
						filterCard(card) {
							const { number } = get.event();
							const numx = get.number(card);
							return typeof numx === "number" && numx > number;
						},
						position: "he",
						ai(card) {
							if (["shan", "tao", "jiu"].includes(card.name)) {
								return 0;
							}
							return 6 - get.value(card);
						},
					})
					.set("number", num)
					.forResult();
			}
			if (result.bool && result.cards?.length) {
				await trigger.player.give(result.cards, player);
				return;
			}
			trigger.targets.remove(player);
			trigger.getParent()?.triggeredTargets2.remove(player);
			trigger.untrigger();
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (card.name === "sha" && player.hp > target.hp && get.attitude(player, target) < 0) {
						const num = get.number(card);
						if (typeof num !== "number") {
							return false;
						}
						const bs = player.getCards("h", cardx => get.number(cardx) > num && !["", "", ""].includes(cardx.name));
						if (bs.length < 2) {
							return 0;
						}
						if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) {
							return;
						}
						if (bs.length <= 2) {
							for (const cardx of bs) {
								if (get.value(cardx) < 6) {
									return [1, 0, 1, -0.5];
								}
							}
							return 0;
						}
						return [1, 0, 1, -0.5];
					}
				},
			},
		},
	},
	//袁涣
	qingjue: {
		audio: 2,
		trigger: { global: "useCardToPlayer" },
		logTarget: "player",
		round: 1,
		filter(event, player) {
			return event.player !== player && event.target !== player && event.player !== event.target && event.player.hp > event.target.hp && event.targets.length === 1 && event.player.hasCards("h") && !event.target.isDying() && !event.player.hasSkillTag("noCompareTarget") && !player.hasSkillTag("noCompareSource");
		},
		check(event, player) {
			const target = event.target;
			const source = event.player;
			const eff1 = get.effect(target, event.card, source, player);
			if (eff1 >= 0) {
				return false;
			}
			const eff2 = get.effect(player, event.card, source, player);
			if (eff2 >= 0) {
				return true;
			}
			if (eff2 > eff1 / 3) {
				return player.hasCard(card => (card.number >= 9 && get.value(card) <= 5) || get.value(card) <= 3);
			}
			if (eff2 > eff1 / 2) {
				return player.hasCard(card => card.number > 10 && get.value(card) <= 5);
			}
			return player.hasCard(card => card.number > 11 && get.value(card) <= 5);
		},
		async content(event, trigger, player) {
			await player.draw();
			if (!player.canCompare(trigger.player)) {
				return;
			}
			const result = await player.chooseToCompare(trigger.player).forResult();
			trigger.targets.remove(trigger.target);
			trigger.getParent()?.triggeredTargets1.remove(trigger.target);
			trigger.untrigger();
			if (!result.bool) {
				trigger.targets.push(player);
			}
		},
	},
	fengjie: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return game.hasPlayer(current => current !== player);
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget({
					prompt: "请选择【奉节】的目标",
					prompt2: "选择一名其他角色并获得如下效果直到你下回合开始：一名角色的结束阶段开始时，你将手牌摸至（至多摸至四张）或弃置至与其体力值相等。",
					filterTarget: lib.filter.notMe,
					forced: true,
					ai(target) {
						return (target.hp - player.countCards("h")) / get.threaten(target);
					},
				})
				.forResult();
			if (!result.bool || !result.targets?.length) {
				return;
			}
			const target = result.targets[0];
			player.line(target, "green");
			game.log(player, "选择了", target);
			player.storage.fengjie2 = target;
			player.addTempSkill("fengjie2", { player: "phaseBegin" });
			await game.delayx();
		},
	},
	fengjie2: {
		audio: "fengjie",
		trigger: { global: "phaseJieshuBegin" },
		forced: true,
		charlotte: true,
		onremove: true,
		sourceSkill: "fengjie",
		filter(event, player) {
			if (!player.storage.fengjie2 || !player.storage.fengjie2.isIn()) {
				return false;
			}
			const num1 = player.countCards("h");
			const num2 = player.storage.fengjie2.hp;
			return num1 !== num2;
		},
		logTarget(event, player) {
			return player?.storage.fengjie2;
		},
		async content(event, trigger, player) {
			const num1 = player.countCards("h");
			const num2 = player.storage.fengjie2.hp;
			if (num1 > num2) {
				await player.chooseToDiscard({
					selectCard: num1 - num2,
					position: "h",
					forced: true,
					allowChooseAll: true,
				});
				return;
			}
			await player.drawTo(Math.min(4, num2));
		},
	},
	//陈武董袭
	spyilie: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl({
					controls: ["选项一", "选项二", "背水！", "cancel2"],
					choiceList: ["本阶段内使用【杀】的次数上限+1", "本回合内使用【杀】被【闪】抵消时摸一张牌", "背水！失去1点体力并依次执行上述所有选项"],
					ai() {
						if (player.countCards("hs", card => get.name(card) === "sha" && player.hasValueTarget(card)) > player.getCardUsable({ name: "sha" })) {
							return 0;
						}
						return 1;
					},
				})
				.forResult();
			event.result = {
				bool: result.control !== "cancel2",
				cost_data: {
					index: result.index,
					control: result.control,
				},
			};
		},
		async content(event, trigger, player) {
			const { index, control } = event.cost_data;
			game.log(player, "选择了", "#g【毅烈】", "的", `#y${control}`);
			if (index % 2 === 0) {
				player.addTempSkill("spyilie_add", "phaseUseEnd");
			}
			if (index > 0) {
				player.addTempSkill("spyilie_miss");
			}
			if (index === 2) {
				await player.loseHp();
			}
		},
		subSkill: {
			add: {
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name === "sha") {
							return num + 1;
						}
					},
				},
			},
			miss: {
				charlotte: true,
				audio: "spyilie",
				trigger: { player: "shaMiss" },
				forced: true,
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	spfenming: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter: (event, player) => game.hasPlayer(current => lib.skill.spfenming.filterTarget(null, player, current)),
		filterTarget(card, player, target) {
			if (target.hp > player.hp) {
				return false;
			}
			return !target.isLinked() || target.hasCard(card => lib.filter.canBeGained(card, player, target), target === player ? "e" : "he");
		},
		async content(event, trigger, player) {
			const target = event.target;
			if (!target.isLinked()) {
				await target.link();
				return;
			}
			await player.gainPlayerCard(target, target === player ? "e" : "he", true);
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					if (!target.isLinked()) {
						return get.effect(target, { name: "tiesuo" }, player, player);
					}
					return get.effect(target, { name: "shunshou_copy2" }, player, player);
				},
			},
		},
	},
	//周处
	rechuhai: {
		audio: "chuhai",
		dutySkill: true,
		locked: false,
		group: ["rechuhai_add", "rechuhai_achieve", "rechuhai_fail", "rechuhai_chuhai"],
		derivation: "zhangming",
		subSkill: {
			chuhai: {
				audio: "chuhai1.mp3",
				inherit: "chuhai",
				prompt: "与一名其他角色进行拼点",
			},
			add: {
				trigger: { player: "compare" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.getParent().name === "rechuhai_chuhai" && event.num1 < 13 && player.countCards("e") < 4;
				},
				async content(event, trigger, player) {
					const num = 4 - player.countCards("e");
					game.log(player, "的拼点牌点数+", num);
					trigger.num1 = Math.min(13, trigger.num1 + num);
				},
			},
			achieve: {
				audio: "chuhai2.mp3",
				trigger: { player: "equipAfter" },
				forced: true,
				skillAnimation: true,
				animationColor: "wood",
				filter(event, player) {
					return player.countCards("e") > 2;
				},
				async content(event, trigger, player) {
					player.awakenSkill("rechuhai");
					game.log(player, "成功完成使命");
					if (player.isDamaged()) {
						await player.recover(player.maxHp - player.hp);
					}
					player.changeSkills(["zhangming"], ["xianghai"]);
				},
			},
			fail: {
				audio: "chuhai3.mp3",
				trigger: { player: "chooseToCompareAfter" },
				forced: true,
				filter(event, player) {
					return event.getParent().name === "rechuhai_chuhai" && event.num1 < 7 && !event.result.bool;
				},
				async content(event, trigger, player) {
					player.awakenSkill("rechuhai");
					game.log(player, "使命失败");
				},
			},
		},
	},
	zhangming: {
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return get.suit(event.card) === "club";
		},
		async content(event, trigger, player) {
			trigger.directHit.addArray(game.filterPlayer(current => current !== player));
		},
		group: "zhangming_damage",
		subSkill: {
			damage: {
				audio: "zhangming",
				trigger: { source: "damageEnd" },
				forced: true,
				usable: 1,
				filter(event, player) {
					return player !== event.player;
				},
				logTarget: "player",
				async content(event, trigger, player) {
					let list = [];
					let cards = [];
					let target = trigger.player;
					let hs = target.getCards("h");
					let card;
					if (hs.length > 0) {
						card = hs.randomGet();
						list.push(get.type2(card, target));
						player.showCards(card, `${get.translation(player)}对${get.translation(target)}发动了【彰名】`);
					}
					target.discard(card);
					for (const pileCard of ui.cardPile.childNodes) {
						let type = get.type2(pileCard, false);
						if (!list.includes(type)) {
							list.push(type);
							cards.push(pileCard);
						}
					}
					player.gain(cards, "gain2").gaintag.add("zhangming");
					player.addTempSkill("zhangming_keep");
				},
			},
			keep: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("zhangming");
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("zhangming")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name === "phaseDiscard" && card.hasGaintag("zhangming")) {
							return false;
						}
					},
				},
			},
		},
	},
	xianghai: {
		audio: 2,
		global: "xianghai_g",
		mod: {
			cardname(card) {
				if (get.type(card, null, false) === "equip") {
					return "jiu";
				}
			},
		},
		ai: {
			threaten: 2,
		},
	},
	xianghai_g: {
		mod: {
			maxHandcard(player, num) {
				return num - game.countPlayer(current => current !== player && current.hasSkill("xianghai"));
			},
		},
	},
	chuhai: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => player.canCompare(target, true));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target, true);
		},
		async content(event, trigger, player) {
			const { target } = event;
			await player.draw();
			if (!player.canCompare(target)) {
				return;
			}
			const result = await player.chooseToCompare(target).forResult();
			if (result.bool) {
				player.storage.chuhai2 = target;
				player.addTempSkill("chuhai2", "phaseUseEnd");
				if (target.hasCards("h")) {
					player.viewHandcards(target);
					const types = [];
					const cards = [];
					const hs = target.getCards("h");
					for (const i of hs) {
						types.add(get.type2(i, target));
					}
					for (const i of types) {
						const card = get.cardPile(card => get.type2(card, false) === i);
						if (card) {
							cards.push(card);
						}
					}
					if (cards.length) {
						await player.gain({
							cards,
							animate: "gain2",
							log: true,
						});
					}
				}
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (player.hasCards("hs", card => get.tag(card, "damage") > 0 && player.canUse(card, target, null, true) && get.effect(target, card, player, player) > 0 && player.hasValueTarget(card, null, true))) {
						return -3;
					}
					return -1;
				},
			},
		},
	},
	chuhai2: {
		trigger: { source: "damageSource" },
		forced: true,
		charlotte: true,
		onremove: true,
		sourceSkill: "chuhai",
		filter(event, player) {
			if (event.player !== player.storage.chuhai2) {
				return false;
			}
			for (const i of [1, 2, 3, 4, 5]) {
				if (player.hasEmptySlot(i)) {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			for (const i of [1, 2, 3, 4, 5, 6]) {
				if (player.hasEmptySlot(i)) {
					const sub = `equip${i}`;
					const card = get.cardPile(card => get.subtype(card, false) === sub && !get.cardtag(card, "gifts") && player.canEquip(card));
					if (card) {
						player.$gain2(card);
						await game.delayx();
						await player.equip(card);
						break;
					}
				}
			}
		},
	},
	//文鸯
	dbquedi: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		usable(skill, player) {
			return 1 + player.countMark("dbchoujue_add");
		},
		filter(event, player) {
			const { card, targets, target } = event;
			return ["sha", "juedou"].includes(card.name) && targets.length === 1 && (target.countGainableCards(player, "h") > 0 || player.hasCard(card => _status.connectMode || (get.type(card, null, player) === "basic" && lib.filter.cardDiscardable(card, player, "dbquedi")), "h"));
		},
		async cost(event, trigger, player) {
			const { target } = trigger;
			const list = [];
			if (target.countGainableCards(player, "h") > 0) {
				list.push("选项一");
			}
			if (player.hasCard(card => get.type(card, null, player) === "basic" && lib.filter.cardDiscardable(card, player, "dbquedi"), "h")) {
				list.push("选项二");
			}
			list.push("背水！");
			list.push("cancel2");
			const { control } = await player
				.chooseControl(list)
				.set("choiceList", [`获得${get.translation(target)}的一张手牌`, `弃置一张基本牌并令${get.translation(trigger.card)}伤害+1`, "背水！减1点体力上限并执行所有选项"])
				.set("prompt", get.prompt(event.skill, target))
				.set("ai", () => {
					const evt = _status.event.getTrigger();
					const player = evt.player;
					const target = evt.target;
					const card = evt.card;
					if (get.attitude(player, target) > 0) {
						return "cancel2";
					}
					const bool1 = target.countGainableCards(player, "h") > 0;
					const bool2 =
						player.hasCard(cardx => get.type(cardx, null, player) === "basic" && lib.filter.cardDiscardable(cardx, player, "dbquedi") && get.value(card, player) < 5, "h") &&
						!target.hasSkillTag("filterDamage", null, {
							player: player,
							card: card,
						});
					if (bool1 && bool2 && (target.hp <= 2 || (player.isDamaged() && player.maxHp > 3))) {
						return "背水！";
					}
					if (bool1) {
						return "选项一";
					}
					if (bool2) {
						return "选项二";
					}
					return "cancel2";
				})
				.forResult();
			event.result = {
				bool: control !== "cancel2",
				cost_data: control,
			};
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const { cost_data: control } = event;
			const { target } = trigger;
			if (["选项一", "背水！"].includes(control) && target.countGainableCards(player, "h") > 0) {
				await player.gainPlayerCard(target, true, "h");
			}
			if (["选项二", "背水！"].includes(control) && player.hasCard(card => get.type(card, null, player) === "basic" && lib.filter.cardDiscardable(card, player, "dbquedi"), "h")) {
				const { bool } = await player.chooseToDiscard("h", "弃置一张基本牌", { type: "basic" }).forResult();
				if (bool) {
					trigger.getParent().baseDamage++;
				}
			}
			if (control === "背水！") {
				await player.loseMaxHp();
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag !== "directHit_ai" || !arg || !arg.card || !arg.target || (arg.card.name !== "sha" && arg.card.name !== "juedou")) {
					return false;
				}
				if (player.storage.counttrigger?.dbquedi > 0) {
					return false;
				}
				if (
					arg.target.countCards("h") === 1 &&
					(arg.card.name !== "sha" ||
						!arg.target.hasSkillTag("freeShan", false, {
							player: player,
							card: arg.card,
							type: "use",
						}) ||
						player.hasSkillTag("unequip", false, {
							name: arg.card ? arg.card.name : null,
							target: arg.target,
							card: arg.card,
						}) ||
						player.hasSkillTag("unequip_ai", false, {
							name: arg.card ? arg.card.name : null,
							target: arg.target,
							card: arg.card,
						}))
				) {
					return true;
				}
				return false;
			},
		},
	},
	dbzhuifeng: {
		audio: 2,
		groupSkill: "wei",
		enable: "chooseToUse",
		usable: 2,
		viewAsFilter(player) {
			return player.group === "wei" && player.hp > 0;
		},
		viewAs: { name: "juedou", isCard: true },
		filterCard: () => false,
		selectCard: -1,
		log: false,
		async precontent(event, trigger, player) {
			player.logSkill("dbzhuifeng");
			const loseHpEvent = player.loseHp();
			event.forceDie = true;
			await loseHpEvent;
			//特殊处理
			if (player.isDead()) {
				const result = player.useResult(event.result, event.getParent());
				if (result != null) {
					result.forceDie = true;
				}
			}
		},
		ai: {
			order() {
				return get.order({ name: "juedou" }) - 0.5;
			},
		},
		group: "dbzhuifeng_self",
		subSkill: {
			self: {
				audio: "dbzhuifeng",
				trigger: { player: "damageBegin2" },
				forced: true,
				filter(event, player) {
					const evt = event.getParent();
					return evt?.skill === "dbzhuifeng" && evt.player === player;
				},
				async content(event, trigger, player) {
					trigger.cancel();
					player.tempBanSkill("dbzhuifeng", { player: "phaseUseEnd" });
				},
			},
		},
	},
	dbchongjian: {
		audio: 2,
		groupSkill: "wu",
		hiddenCard(player, name) {
			if (player.group === "wu" && (name === "sha" || name === "jiu") && player.hasCard(card => get.type(card) === "equip", "hes")) {
				return true;
			}
			return false;
		},
		enable: "chooseToUse",
		filter(event, player) {
			return player.group === "wu" && player.hasCard(card => get.type(card) === "equip", "hes") && (event.filterCard({ name: "sha" }, player, event) || event.filterCard({ name: "jiu" }, player, event));
		},
		locked: false,
		mod: {
			targetInRange(card) {
				if (card.storage && card.storage.dbchongjian) {
					return true;
				}
			},
		},
		chooseButton: {
			dialog() {
				let list = [];
				list.push(["基本", "", "sha"]);
				for (const i of lib.inpile_nature) {
					list.push(["基本", "", "sha", i]);
				}
				list.push(["基本", "", "jiu"]);
				return ui.create.dialog("冲坚", [list, "vcard"]);
			},
			filter(button, player) {
				let evt = _status.event.getParent();
				return evt.filterCard({ name: button.link[2], nature: button.link[3], isCard: true }, player, evt);
			},
			check(button) {
				if (_status.event.getParent().type !== "phase") {
					return 1;
				}
				let player = _status.event.player;
				if (
					button.link[2] === "jiu" &&
					(player.hasCard(card => get.name(card) === "sha", "hs") ||
						player.countCards("hes", card => {
							if (get.type(card) !== "equip") {
								return false;
							}
							if (get.position(card) === "e") {
								if (player.hasSkillTag("noe")) {
									return 10 - get.value(card) > 0;
								}
								let sub = get.subtype(card);
								if (player.hasCard(card => get.subtype(card) === sub && player.canUse(card, player) && get.effect(player, card, player, player) > 0, "hs")) {
									return 10 - get.value(card) > 0;
								}
							}
							return 5 - get.value(card) > 0;
						}) > 1)
				) {
					return player.getUseValue({ name: "jiu" }) * 4;
				}
				return player.getUseValue({ name: button.link[2], nature: button.link[3] }, false);
			},
			backup(links, player) {
				return {
					audio: "dbchongjian",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						//isCard:true,
						storage: { dbchongjian: true },
					},
					filterCard: { type: "equip" },
					position: "hes",
					popname: true,
					async precontent(event, trigger, player) {
						player.addTempSkill("dbchongjian_effect");
					},
					check(card) {
						let player = _status.event.player;
						if (get.position(card) === "e") {
							if (player.hasSkillTag("noe")) {
								return 10 - get.value(card);
							}
							let sub = get.subtype(card);
							if (player.hasCard(card => get.subtype(card) === sub && player.canUse(card, player) && get.effect(player, card, player, player) > 0, "hs")) {
								return 10 - get.value(card);
							}
						}
						return 5 - get.value(card);
					},
				};
			},
			prompt(links) {
				return `将一张装备牌当做${links[0][3] ? get.translation(links[0][3]) : ""}【${get.translation(links[0][2])}】使用`;
			},
		},
		ai: {
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				return player.group === "wu" && player.hasCard({ type: "equip" }, "hes");
			},
			order(item, player) {
				if (_status.event.type !== "phase") {
					return 1;
				}
				player = _status.event.player;
				if (
					player.hasCard(card => {
						if (get.value(card, player) < 0) {
							return true;
						}
						let sub = get.subtype(card);
						return player.hasCard(card => get.subtype(card) === sub && player.canUse(card, player) && get.effect(player, card, player, player) > 0, "hs") > 0;
					}, "e")
				) {
					return 10;
				}
				if (player.countCards("hs", "sha") || player.countCards("he", card => get.type(card) === "equip" && get.value(card, player) < 5) > 1) {
					return get.order({ name: "jiu" }) - 0.1;
				}
				return get.order({ name: "sha" }) - 0.1;
			},
			result: { player: 1 },
		},
		subSkill: {
			effect: {
				audio: "dbchongjian",
				charlotte: true,
				mod: {
					targetInRange(card) {
						if (card.storage && card.storage.dbchongjian) {
							return true;
						}
					},
				},
				trigger: { source: "damageSource" },
				forced: true,
				logTarget: "player",
				filter(event, player) {
					return event.parent.skill === "dbchongjian_backup" && event.card.name === "sha" && event.getParent().name === "sha" && event.player.countGainableCards(player, "e") > 0;
				},
				async content(event, trigger, player) {
					await player.gainPlayerCard(trigger.player, "e", true, trigger.num);
				},
				ai: {
					unequip: true,
					skillTagFilter(player, tag, arg) {
						if (tag === "unequip") {
							if (player.group !== "wu" || !arg || !arg.card || !arg.card.storage || !arg.card.storage.dbchongjian) {
								return false;
							}
							return true;
						}
					},
				},
			},
		},
	},
	dbchoujue: {
		audio: 2,
		trigger: { source: "dieAfter" },
		forced: true,
		async content(event, trigger, player) {
			await player.gainMaxHp();
			await player.draw(2);
			player.addTempSkill(`${event.name}_add`);
			player.addMark(`${event.name}_add`, 1, false);
		},
		subSkill: {
			add: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					markcount: (storage, player) => storage || 0,
					content: (storage, player) => `本回合〖却敌〗可发动次数+${storage || 0}`,
				},
			},
		},
	},
	//王凌
	xingqi: {
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		locked: false,
		filter(event, player) {
			return get.type(event.card, null, false) !== "delay" && !player.getStorage("xingqi").includes(event.card.name);
		},
		async content(event, trigger, player) {
			player.markAuto("xingqi", [trigger.card.name]);
			game.log(player, "获得了一个", `#g【备(${get.translation(trigger.card.name)})】`);
		},
		marktext: "备",
		intro: {
			content: "$",
			onunmark(storage, player) {
				delete player.storage.xingqi;
			},
		},
		group: "xingqi_gain",
		subSkill: {
			gain: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				filter(event, player) {
					return player.getStorage("xingqi").length > 0;
				},
				async content(event, trigger, player) {
					player.removeSkill("mibei_mark");
					const result = await player
						.chooseButton({
							createDialog: ["星启：是否获得一张牌？", [player.getStorage("xingqi"), "vcard"]],
							ai(button) {
								const card = { name: button.link[2] };
								const player = get.player();
								if (!get.cardPile2(cardx => cardx.name === card.name)) {
									return 0;
								}
								return get.value(card, player) * player.getUseValue(card);
							},
						})
						.forResult();
					if (!result.bool || !result.links?.length) {
						return;
					}
					player.logSkill("xingqi");
					const name = result.links[0][2];
					game.log(player, "移去了一个", `#g【备(${get.translation(name)})】`);
					player.unmarkAuto("xingqi", [name]);
					const card = get.cardPile2(cardx => cardx.name === name);
					if (card) {
						await player.gain({
							cards: [card],
							animate: "gain2",
						});
					}
				},
			},
		},
	},
	xinzifu: {
		audio: "zifu",
		trigger: { player: "phaseUseEnd" },
		forced: true,
		filter(event, player) {
			return player.getStorage("xingqi").length > 0 && !player.hasHistory("useCard", evt => evt.getParent("phaseUse") === event);
		},
		async content(event, trigger, player) {
			game.log(player, "移去了所有", "#g【备】");
			player.unmarkSkill("xingqi");
			player.addTempSkill("xinzifu_limit");
			player.addMark("xinzifu_limit", 1, false);
		},
		ai: {
			neg: true,
			combo: "xingqi",
		},
		subSkill: {
			limit: {
				charlotte: true,
				markimage: "image/card/handcard.png",
				intro: {
					content(storage, player) {
						let num = -player.countMark("xinzifu_limit");
						return `手牌上限${num}`;
					},
				},
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("xinzifu_limit");
					},
				},
			},
		},
	},
	mibei: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		dutySkill: true,
		forced: true,
		locked: false,
		filter(event, player) {
			if (!player.storage.xingqi || !player.storage.xingqi.length) {
				return false;
			}
			const map = { basic: 0, trick: 0, equip: 0 };
			for (const name of player.storage.xingqi) {
				const type = get.type(name);
				if (typeof map[type] === "number") {
					map[type]++;
				}
			}
			return Object.values(map).every(num => num >= 2);
		},
		logAudio: () => 1,
		skillAnimation: true,
		animationColor: "water",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			game.log(player, "成功完成使命");
			const types = ["basic", "equip", "trick"];
			const cards = [];
			for (const type of types) {
				const card = get.cardPile2(card => get.type(card) === type);
				if (card) {
					cards.push(card);
				}
			}
			if (cards.length) {
				await player.gain({
					cards,
					animate: "gain2",
				});
			}
			player.addSkills("xinmouli");
		},
		ai: {
			combo: "xingqi",
		},
		group: ["mibei_fail", "mibei_silent"],
		derivation: "xinmouli",
		subSkill: {
			silent: {
				charlotte: true,
				trigger: { player: "phaseZhunbeiBegin" },
				silent: true,
				lastDo: true,
				filter(event, player) {
					return !player.getStorage("xingqi").length;
				},
				async content(event, trigger, player) {
					player.addTempSkill("mibei_mark");
				},
			},
			mark: { charlotte: true },
			fail: {
				audio: "mibei2.mp3",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return !player.getStorage("xingqi").length && player.hasSkill("mibei_mark");
				},
				forced: true,
				async content(event, trigger, player) {
					game.log(player, "使命失败");
					player.awakenSkill("mibei");
					await player.loseMaxHp();
				},
			},
		},
	},
	xinmouli: {
		audio: "mouli",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getStorage("xingqi").length > 0;
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			const result = await target
				.chooseButton({
					createDialog: ["谋立：是否获得一张牌？", [player.getStorage("xingqi"), "vcard"]],
					forced: true,
					ai(button) {
						const card = { name: button.link[2] };
						const currentPlayer = _status.event.player;
						return get.value(card, currentPlayer);
					},
				})
				.forResult();
			if (!result.bool || !result.links?.length) {
				return;
			}
			const name = result.links[0][2];
			game.log(player, "移去了一个", `#g【备(${get.translation(name)})】`);
			player.unmarkAuto("xingqi", [name]);
			const card = get.cardPile2(cardx => cardx.name === name);
			if (card) {
				await target.gain({
					cards: [card],
					animate: "gain2",
				});
			}
		},
		ai: {
			combo: "xingqi",
			order: 1,
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	mouli: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		position: "h",
		filterTarget: lib.filter.notMe,
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			return 8 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			player.give(cards, target);
			if (!target.storage.mouli2) {
				target.storage.mouli2 = [];
			}
			if (!target.storage.mouli3) {
				target.storage.mouli3 = [];
			}
			target.storage.mouli2.add(player);
			target.storage.mouli3.push(player);
			target.addSkill("mouli_effect");
		},
		ai: {
			threaten: 1.2,
			order: 4,
			result: {
				target: 1,
			},
		},
		subSkill: {
			effect: {
				trigger: { player: "useCard" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					if (event.card.name !== "sha" && event.card.name !== "shan") {
						return false;
					}
					for (const target of player.storage.mouli3) {
						if (target.isIn()) {
							return true;
						}
					}
					return false;
				},
				logTarget(event, player) {
					return player?.storage.mouli3;
				},
				async content(event, trigger, player) {
					const delay = game.delayx();
					const targets = player.storage.mouli3;
					targets.sortBySeat();
					if (targets.length === 1) {
						const target = targets[0];
						const draw = target.draw(3);
						targets.length = 0;
						await delay;
						await draw;
						return;
					}
					const draw = game.asyncDraw(targets, 3);
					await delay;
					await draw;
					targets.length = 0;
					await game.delayx();
				},
				group: ["mouli_sha", "mouli_shan", "mouli_clear"],
				mark: true,
				intro: {
					content: "已因$获得“谋立”效果",
				},
			},
			sha: {
				enable: "chooseToUse",
				viewAs: { name: "sha" },
				filterCard: { color: "black" },
				position: "he",
				prompt: "将一张黑色牌当做杀使用",
				check(card) {
					return 6 - get.value(card);
				},
				viewAsFilter(player) {
					return player.countCards("he", { color: "black" }) > 0;
				},
				ai: {
					respondSha: true,
					skillTagFilter(player) {
						return player.countCards("he", { color: "black" }) > 0;
					},
				},
			},
			shan: {
				enable: "chooseToUse",
				viewAs: { name: "shan" },
				filterCard: { color: "red" },
				position: "he",
				prompt: "将一张红色牌当做闪使用",
				check(card) {
					return 7 - get.value(card);
				},
				viewAsFilter(player) {
					return player.countCards("he", { color: "red" }) > 0;
				},
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						return player.countCards("he", { color: "red" }) > 0;
					},
				},
			},
			clear: {
				trigger: { global: ["phaseBegin", "dieAfter"] },
				forced: true,
				silent: true,
				popup: false,
				lastDo: true,
				forceDie: true,
				filter(event, player) {
					if (event.name === "die" && player === event.player) {
						return true;
					}
					return player.storage.mouli2.includes(event.player);
				},
				async content(event, trigger, player) {
					if (trigger.name === "die" && player === trigger.player) {
						player.removeSkill("mouli_effect");
						delete player.storage.mouli2;
						delete player.storage.mouli3;
						return;
					}
					player.storage.mouli2.remove(trigger.player);
					while (player.storage.mouli3.includes(trigger.player)) {
						player.storage.mouli3.remove(trigger.player);
					}
					if (!player.storage.mouli2.length) {
						player.removeSkill("mouli_effect");
					}
				},
			},
		},
	},
	zifu: {
		audio: 2,
		trigger: { global: "dieAfter" },
		forced: true,
		filter(event, player) {
			return event.player.storage.mouli2 && event.player.storage.mouli2.includes(player);
		},
		async content(event, trigger, player) {
			await player.loseMaxHp(2);
		},
		ai: {
			combo: "mouli",
			neg: true,
		},
	},
	//孔融
	xinlirang: {
		audio: "splirang",
		trigger: { global: "phaseDrawBegin2" },
		logTarget: "player",
		filter(event, player) {
			return !event.numFixed && event.player !== player && player.countMark("xinlirang") === 0;
		},
		prompt2: "获得一枚“谦”并令其多摸两张牌",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			trigger.num += 2;
			player.addMark("xinlirang", 1);
			player.addTempSkill("xinlirang_gain");
		},
		marktext: "谦",
		intro: {
			name: "谦",
			content: "mark",
		},
		group: "xinlirang_skip",
		subSkill: {
			gain: {
				audio: "splirang",
				trigger: { global: "phaseDiscardEnd" },
				direct: true,
				filter(event, player) {
					return event.player.hasHistory("lose", evt => evt.type === "discard" && evt.cards2.filterInD("d").length > 0 && evt.getParent("phaseDiscard") === event);
				},
				async cost(event, trigger, player) {
					const cards = trigger.player
						.getHistory("lose", evt => evt.type === "discard" && evt.getParent("phaseDiscard") === trigger)
						.flatMap(evt => evt.cards2.filterInD("d"))
						.toUniqued();
					const result = await player
						.chooseButton({
							createDialog: ["礼让：是否获得其中至多两张牌？", cards],
							selectButton: [1, 2],
						})
						.forResult();
					event.result = {
						bool: result.bool,
						cards: result.cards,
					};
				},
				logTarget: "player",
				async content(event, trigger, player) {
					await player.gain({
						cards: event.cards,
						animate: "gain2",
					});
				},
			},
			skip: {
				audio: "splirang",
				trigger: { player: "phaseBegin" },
				forced: true,
				filter(event, player) {
					return player.hasMark("xinlirang");
				},
				async content(event, trigger, player) {
					player.skip("phaseDraw");
					player.removeMark("xinlirang", player.countMark("xinlirang"));
				},
			},
		},
	},
	xinmingshi: {
		audio: "spmingshi",
		trigger: { player: "damageEnd" },
		forced: true,
		logTarget: "source",
		filter(event, player) {
			return event.source && event.source.isIn() && player.hasMark("xinlirang") && event.source.hasCards("hej");
		},
		async content(event, trigger, player) {
			const result = await trigger.source
				.discardPlayerCard({
					target: trigger.source,
					position: "hej",
					forced: true,
					ai(card) {
						return (get.color(card.link) === get.event().color ? 4 : 0) - get.value(card.link);
					},
				})
				.set("color", get.attitude(trigger.source, player) > 0 ? "red" : "black")
				.forResult();
			if (!result.bool || !result.cards?.length) {
				return;
			}
			const card = result.cards[0];
			if (get.color(card, trigger.source) === "red") {
				await player.recover();
				return;
			}
			if (get.position(card, true) === "d") {
				await player.gain({
					cards: [card],
					animate: "gain2",
				});
			}
		},
		ai: {
			combo: "xinlirang",
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && target.hasMark("xinlirang")) {
						const cards = [card];
						if (card.cards && card.cards.length) {
							cards.addArray(card.cards);
						}
						if (ui.selected.cards.length) {
							cards.addArray(ui.selected.cards);
						}
						if (!player.countCards("he", current => !cards.includes(current))) {
							return;
						}
						if (!player.countCards("h", current => !cards.includes(current) && get.color(current) === "black" && get.value(current, player) < 6)) {
							return "zerotarget";
						}
						return 0.5;
					}
				},
			},
		},
	},
	spmingshi: {
		audio: 2,
		trigger: { player: "damageEnd" },
		forced: true,
		logTarget: "source",
		filter(event, player) {
			return event.source && player !== event.source && event.source.hasDiscardableCards(event.source, "he");
		},
		getIndex: event => event.num,
		async content(event, trigger, player) {
			const { source } = trigger;
			if (source.countDiscardableCards(source, "he")) {
				await source.chooseToDiscard("he", true);
			}
		},
		ai: {
			threaten: 0.8,
			maixie: true,
			maixie_defend: true,
		},
	},
	splirang: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (const card of hs) {
				if (!lib.filter.cardDiscardable(card, player, "splirang")) {
					return false;
				}
			}
			return true;
		},
		filterCard: true,
		selectCard: -1,
		async content(event, trigger, player) {
			const cards = event.cards.filterInD("d");
			if (cards.length && player.hp > 0) {
				const result = await player
					.chooseButton({
						createDialog: ["将任意张牌交给一名其他角色", cards],
						selectButton: [1, Math.min(cards.length, player.hp)],
						ai(button) {
							return get.value(button.link);
						},
					})
					.forResult();
				if (result.bool && result.links?.length) {
					const cards2 = result.links;
					const result2 = await player
						.chooseTarget({
							prompt: `令一名角色获得${get.translation(event.cards)}`,
							filterTarget: lib.filter.notMe,
							forced: true,
							ai(target) {
								const player = get.player();
								let att = get.attitude(player, target);
								if (target.hasSkillTag("nogain")) {
									att /= 10;
								}
								if (target.hasJudge("lebu")) {
									att /= 5;
								}
								return att;
							},
						})
						.forResult();
					if (result2.targets?.length) {
						const target = result2.targets[0];
						player.line(target, "green");
						await target.gain({
							cards2,
							animate: "gain2",
						});
					}
				}
			}
			await player.draw();
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					const hs = player.getCards("h");
					if (hs.length <= player.hp && game.hasPlayer(current => current !== player && get.attitude(player, current) > 0 && !current.hasJudge("lebu") && !current.hasSkillTag("nogain"))) {
						return 1;
					}
					if (get.value(hs, player) < 6) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	//糜夫人
	xinguixiu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			return player.hp % 2 === 1 || player.isDamaged();
		},
		async content(event, trigger, player) {
			if (player.hp % 2 === 1) {
				await player.draw();
				return;
			}
			await player.recover();
		},
	},
	qingyu: {
		audio: 3,
		dutySkill: true,
		locked: false,
		group: ["qingyu_achieve", "qingyu_fail", "qingyu_defend"],
		subSkill: {
			defend: {
				audio: "qingyu1.mp3",
				trigger: { player: "damageBegin2" },
				filter(event, player) {
					return player.countCards("he", card => lib.filter.cardDiscardable(card, player, "qingyu_defend")) > 1;
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.cancel();
					await player.chooseToDiscard(2, "he", true);
				},
			},
			achieve: {
				audio: "qingyu3.mp3",
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				skillAnimation: true,
				animationColor: "fire",
				filter(event, player) {
					return player.isHealthy() && player.countCards("h") < game.roundNumber;
				},
				async content(event, trigger, player) {
					game.log(player, "成功完成使命");
					player.awakenSkill("qingyu");
					player.addSkills("xuancun");
				},
			},
			fail: {
				audio: "qingyu2.mp3",
				trigger: { player: "dying" },
				forced: true,
				async content(event, trigger, player) {
					game.log(player, "使命失败");
					player.awakenSkill("qingyu");
					await player.loseMaxHp();
					const targets = game.filterPlayer(current => current !== player);
					if (!targets.length) {
						return;
					}
					const result =
						targets.length > 1
							? await player
									.chooseTarget(`令一名其他角色获得${get.poptip("mbyongjue")}`, true, lib.filter.notMe)
									.set("ai", target => get.attitude(get.player(), target))
									.forResult()
							: {
									bool: true,
									targets: targets,
								};
					if (result?.bool && result.targets?.length) {
						const target = result.targets[0];
						player.line(target);
						await target.addSkills("mbyongjue");
					}
				},
			},
		},
		derivation: ["xuancun", "mbyongjue"],
	},
	xuancun: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return player !== event.player && player.countCards("h") < player.hp;
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		prompt2(event, player) {
			return `令其摸${get.cnNumber(Math.min(2, player.hp - player.countCards("h")))}张牌`;
		},
		async content(event, trigger, player) {
			await trigger.player.draw(Math.min(2, player.hp - player.countCards("h")));
		},
	},
	mbyongjue: {
		audio: "yongjue",
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			if (event.player !== _status.currentPhase || event.card.name !== "sha") {
				return false;
			}
			return event.player.getHistory("useCard").indexOf(event) === 0;
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			player
				.when({
					global: "useCardAfter",
				})
				.filter(evt => evt === trigger)
				.step(async (event, trigger, player) => {
					const cards = trigger.cards.filterInD("od");
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
				});
		},
	},
	//羊祜
	mingfa: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.storage.mingfa && player.hasCards("h") && player.getCards("he").includes(player.storage.mingfa) && !player.hasSkillTag("noCompareSource") && game.hasPlayer(current => current !== player && player.canCompare(current));
		},
		async content(event, trigger, player) {
			event.card = player.storage.mingfa;
			delete player.storage.mingfa;
			const result = await player
				.chooseTarget({
					prompt: get.prompt("mingfa"),
					prompt2: `用${get.translation(event.card)}和一名其他角色拼点`,
					filterTarget(card, player, target) {
						return player.canCompare(target);
					},
					ai(target) {
						const player = get.player();
						const evt = get.event().getParent();
						if (evt == null) {
							return 0;
						}
						const card = evt.card;
						if (card.number > 9 || !target.hasCards("h", cardx => cardx.number >= card.number + 2)) {
							return -get.attitude(player, target) / Math.sqrt(target.countCards("h"));
						}
						return 0;
					},
				})
				.forResult();
			if (!result?.bool | !result.targets?.length) {
				player.removeGaintag("mingfa");
				return;
			}
			const target = result.targets[0];
			player.logSkill("mingfa", target);
			const next = player.chooseToCompare(target);
			if (!next.fixedResult) {
				next.fixedResult = {};
			}
			next.fixedResult[player.playerid] = event.card;
			const result2 = await next.forResult();
			if (!result2.bool) {
				player.addTempSkill("mingfa_block");
				return;
			}
			await player.gainPlayerCard({
				target,
				position: "he",
				forced: true,
			});
			if (event.card.number === 1) {
				return;
			}
			const card = get.cardPile2(card => card.number === event.card.number - 1);
			if (card) {
				await player.gain({
					cards: [card],
					animate: "gain2",
				});
			}
		},
		group: ["mingfa_choose", "mingfa_add", "mingfa_mark"],
		subSkill: {
			block: {
				mod: {
					playerEnabled(card, player, target) {
						if (player !== target) {
							return false;
						}
					},
				},
			},
			choose: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				filter(event, player) {
					return player.countCards("he") > 0;
				},
				async content(event, trigger, player) {
					const result = await player
						.chooseCard({
							prompt: get.prompt("mingfa"),
							prompt2: "选择展示自己的一张牌",
							position: "he",
							ai(card) {
								return Math.min(13, get.number(card) + 2) / Math.pow(Math.min(2, get.value(card)), 0.25);
							},
						})
						.forResult();
					if (!result.bool || !result.cards?.length) {
						return;
					}
					const card = result.cards[0];
					player.logSkill("mingfa");
					player.removeGaintag("mingfa");
					player.addGaintag(card, "mingfa");
					player.storage.mingfa = card;
					await player.showCards(card, `${get.translation(player)}发动了【明伐】`);
				},
			},
			add: {
				audio: "mingfa",
				trigger: { player: "compare", target: "compare" },
				filter(event, player) {
					if (event.player === player) {
						return !event.iwhile;
					}
					return true;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					if (player === trigger.player) {
						trigger.num1 = Math.min(13, trigger.num1 + 2);
					} else {
						trigger.num2 = Math.min(13, trigger.num2 + 2);
					}
					game.log(player, "的拼点牌点数+2");
				},
			},
			mark: {
				trigger: { player: "gainEnd" },
				silent: true,
				firstDo: true,
				filter(event, player) {
					return player.storage.mingfa && event.cards.includes(player.storage.mingfa) && player.getCards("h").includes(player.storage.mingfa);
				},
				async content(event, trigger, player) {
					player.addGaintag(player.storage.mingfa, "mingfa");
				},
			},
		},
	},
	rongbei: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.rongbei.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			for (const i of [1, 2, 3, 4, 5]) {
				if (target.hasEmptySlot(i)) {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const { target } = event;
			player.awakenSkill(event.name);
			for (const num of [1, 2, 3, 4, 5]) {
				if (!target.hasEmptySlot(num)) {
					continue;
				}
				const card = get.cardPile2(card => get.subtype(card) === `equip${num}` && target.canUse(card, target));
				if (card) {
					await target.chooseUseTarget({
						card,
						forced: true,
						nopopup: true,
					});
				}
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					return (target.hasSkillTag("noe") ? 2 : 1) * (5 - target.countCards("e") - target.countDisabled());
				},
			},
		},
	},
	//桥公
	yizhu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			await player.draw(2);
			const hs = player.getCards("he");
			if (!hs.length) {
				return;
			}
			let cards;
			if (hs.length <= 2) {
				cards = hs;
			} else {
				const result = await player
					.chooseCard({
						prompt: "选择两张牌洗入牌堆",
						selectCard: 2,
						position: "he",
						forced: true,
					})
					.forResult();
				if (!result.bool || !result.cards?.length) {
					return;
				}
				cards = result.cards;
			}
			player.$throw(cards.length, 1000);
			const loseEvent = player.lose({
				cards,
				position: ui.cardPile,
			});
			loseEvent.insert_index = () => ui.cardPile.childNodes[get.rand(0, game.players.length * 2 - 2)];
			player.markAuto("yizhu", cards);
			await loseEvent;
			game.updateRoundNumber();
			await game.delayx();
		},
		intro: {
			mark(dialog, content, player) {
				if (player === game.me || player.isUnderControl()) {
					dialog.addAuto(content);
				} else {
					const names = [];
					for (const card of content) {
						names.add(card.name);
					}
					return get.translation(names);
				}
			},
		},
		group: "yizhu_use",
		subSkill: {
			use: {
				audio: "yizhu",
				trigger: { global: "useCardToPlayer" },
				filter(event, player) {
					return player.storage.yizhu && player.storage.yizhu.length && event.player !== player && event.targets.length === 1 && event.cards.filter(card => player.storage.yizhu.includes(card)).length > 0;
				},
				logTarget: "player",
				check(event, player) {
					return get.effect(event.targets[0], event.card, event.player, player) < 0;
				},
				prompt2(event, player) {
					return `令${get.translation(event.card)}无效`;
				},
				async content(event, trigger, player) {
					trigger.cancel();
					trigger.targets.length = 0;
					trigger.getParent().triggeredTargets1.length = 0;
					const list = trigger.cards.filter(card => player.storage.yizhu.includes(card));
					player.unmarkAuto("yizhu", list);
					await game.delayx();
				},
			},
		},
	},
	luanchou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		selectTarget: 2,
		filterTarget: true,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const targets = event.targets;
			game.countPlayer(current => {
				const num = current.countMark("luanchou");
				if (num) {
					current.removeMark("luanchou", num);
				}
			});
			targets.sortBySeat();
			for (const i of targets) {
				i.addMark("luanchou", 1);
			}
		},
		global: ["gonghuan", "gonghuan_clear"],
		derivation: "gonghuan",
		marktext: "姻",
		intro: {
			name: "共患",
			content: () => lib.translate.gonghuan_info,
			onunmark: true,
		},
		ai: {
			order: 10,
			expose: 0.2,
			result: {
				target(player, target) {
					if (!ui.selected.targets.length) {
						return -Math.pow(target.hp, 3);
					}
					if (target.hp >= ui.selected.targets[0].hp) {
						return 0;
					}
					return Math.pow(ui.selected.targets[0].hp - target.hp, 3);
				},
			},
		},
	},
	gonghuan: {
		audio: 2,
		forceaudio: true,
		trigger: { global: "damageBegin4" },
		usable: 1,
		forced: true,
		logTarget: "player",
		filter(event, player) {
			return event.player.hp < player.hp && player.hasMark("luanchou") && event.player.hasMark("luanchou") && game.hasPlayer(current => current.hasSkill("luanchou"));
		},
		async content(event, trigger, player) {
			trigger._gonghuan_player = trigger.player;
			trigger.player = player;
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (_status.luanchou_judging) {
						return;
					}
					if (get.tag(card, "damage") && target.hasMark("luanchou")) {
						let other = game.findPlayer(current => current !== target && current.hasMark("luanchou") && current.hp > target.hp && (!current.storage.counttrigger || !current.storage.counttrigger.gonghuan));
						if (!other) {
							return;
						}
						_status.luanchou_judging = true;
						let eff = [0, 0, 0, get.damageEffect(other, player, player, get.nature(card)) / get.attitude(player, player)];
						delete _status.luanchou_judging;
						return eff;
					}
				},
			},
		},
		subSkill: {
			clear: {
				trigger: { player: "damageEnd" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event._gonghuan_player;
				},
				async content(event, trigger, player) {
					player.removeMark("luanchou", player.countMark("luanchou"));
					trigger._gonghuan_player.removeMark("luanchou", trigger._gonghuan_player.countMark("luanchou"));
				},
			},
		},
	},
	//刘璋
	xiusheng: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.storage.yinlang && game.hasPlayer(current => current.group === player.storage.yinlang);
		},
		async content(event, trigger, player) {
			if (player.storage.xiusheng && player.storage.xiusheng.length > 0) {
				player.unmarkSkill("xiusheng");
			}
			const num = game.countPlayer(current => current.group === player.storage.yinlang);
			if (num <= 0) {
				return;
			}
			await player.draw(num);
			const he = player.getCards("he");
			if (!he.length) {
				return;
			}
			let cards = he;
			if (he.length >= num) {
				const result = await player
					.chooseCard({
						prompt: `选择${get.cnNumber(num)}张牌作为生`,
						selectCard: num,
						position: "he",
						forced: true,
					})
					.forResult();
				if (!result?.bool || !result.cards?.length) {
					await game.delayx();
					return;
				}
				cards = result.cards;
			}
			player.markAuto("xiusheng", cards);
			game.log(player, "将", cards, "放在了武将牌上");
			await player.lose({
				cards,
				position: ui.special,
				toStorage: true,
			});
			await game.delayx();
		},
		intro: {
			content: "cards",
			onunmark: "throw",
		},
		ai: { combo: "yinlang" },
	},
	yinlang: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return !player.hasSkill("yinlang_round") && game.hasPlayer(current => current.group && current.group !== "unknown");
		},
		async cost(event, trigger, player) {
			const list = game
				.filterPlayer(current => current.group && current.group !== "unknown")
				.map(current => current.group)
				.toUniqued();
			list.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
			if (!player.hasSkill("yinlang")) {
				list.push("cancel2");
			}

			const getn = group =>
				game.countPlayer(current => {
					if (current.group !== group) {
						return false;
					}
					if (get.attitude(current, player) > 0) {
						return 1.5;
					}
					if (!current.inRange(player)) {
						return 1;
					}
					return 0.6;
				});
			const choice = list.toSorted((a, b) => getn(b) - getn(a))[0];

			const result = await player
				.chooseControl({
					prompt: "引狼：请选择一个势力",
					controls: list,
					ai() {
						return get.event().choice;
					},
				})
				.set("choice", choice)
				.forResult();

			event.result = {
				bool: result.control !== "cancel2",
				targets: game.filterPlayer(current => current.group === result.control),
				cost_data: {
					group: result.control,
				},
			};
		},
		async content(event, trigger, player) {
			const group = event.cost_data.group;

			game.log(player, "选择了", `#y${get.translation(`${group}2`)}`);
			player.storage.yinlang = group;
			player.markSkill("yinlang");
		},
		ai: { combo: "xiusheng" },
		intro: { content: "已选择了$势力" },
		group: "yinlang_gain",
		subSkill: {
			round: {},
			gain: {
				audio: "yinlang",
				trigger: { global: "phaseUseBegin" },
				forced: true,
				locked: false,
				filter(event, player) {
					return event.player.group === player.storage.yinlang && event.player.isIn() && player.getStorage("xiusheng").length > 0;
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const str = get.translation(player);
					const target = trigger.player;
					const result = await target
						.chooseControl({
							choiceList: [`获得${str}的一张“生”，然后本阶段使用牌时只能指定其为目标`, `令${str}获得一张“生”`],
							ai() {
								const evt = _status.event.getParent();
								if (evt == null) {
									return 0;
								}
								const { player, target } = evt;
								if (get.attitude(player, target) > 0) {
									return 1;
								}
								if (!player.hasCards("hs", card => player.hasValueTarget(card, null, true) && (!player.canUse(card, target, null, true) || get.effect(target, card, player, player) < 0))) {
									return 0;
								}
								return 1;
							},
						})
						.forResult();
					const gainner = result.index === 0 ? target : player;
					const result2 = await gainner
						.chooseButton({
							createDialog: ["选择获得一张“生”", player.storage.xiusheng],
							forced: true,
						})
						.forResult();
					player.unmarkAuto("xiusheng", result2.links);
					await gainner.gain(result2.links, "gain2");
					if (result.index === 0) {
						target.markAuto("yinlang_block", [player]);
						target.addTempSkill("yinlang_block", "phaseUseAfter");
					}
				},
			},
			block: {
				mod: {
					playerEnabled(card, player, target) {
						const info = get.info(card);
						if (info && info.singleCard && ui.selected.cards.length) {
							return;
						}
						if (!player.getStorage("yinlang_block").includes(target)) {
							return false;
						}
					},
				},
				onremove: true,
			},
		},
	},
	huaibi: {
		audio: 2,
		zhuSkill: true,
		mod: {
			maxHandcard(player, num) {
				if (player.storage.yinlang && player.hasZhuSkill("huaibi")) {
					return num + game.countPlayer(current => current.group === player.storage.yinlang);
				}
			},
		},
		ai: { combo: "yinlang" },
	},
	//张温
	gebo: {
		audio: 2,
		trigger: { global: "recoverAfter" },
		forced: true,
		async content(event, trigger, player) {
			await game.cardsGotoSpecial(get.cards(), "toRenku");
		},
		ai: {
			combo: "spsongshu",
		},
	},
	spsongshu: {
		audio: 2,
		trigger: { global: "phaseDrawBegin1" },
		logTarget: "player",
		filter(event, player) {
			return event.player.hp > player.hp && player.hp > 0 && !event.numFixed && _status.renku.length > 0;
		},
		check(event, player) {
			const num = Math.min(5, player.hp, _status.renku.length);
			if (num <= event.num) {
				return get.attitude(player, event.player) < 0;
			}
			return false;
		},
		async content(event, trigger, player) {
			trigger.changeToZero();
			const num = Math.min(5, player.hp, _status.renku.length);
			const target = trigger.player;
			const result = await target
				.chooseButton({
					createDialog: [`选择获得${get.cnNumber(num)}张牌`, _status.renku],
					selectButton: num,
					forced: true,
				})
				.forResult();
			if (!result.bool || !result.links?.length) {
				return;
			}
			const cards = result.links;
			const gainEvent = target.gain({
				cards,
				animate: "gain2",
				areaNames: ["renku"],
			});
			target.addTempSkill("spsongshu_block");
			await gainEvent;
		},
		init(player) {
			player.storage.renku = true;
		},
		subSkill: {
			block: {
				mod: {
					playerEnabled(card, player, target) {
						if (player !== target) {
							return false;
						}
					},
				},
				mark: true,
				intro: { content: "不能对其他角色使用牌" },
			},
		},
		ai: {
			combo: "gebo",
		},
	},
	//张机
	jishi: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		forced: true,
		filter(event, player) {
			return event.cards.filterInD().length > 0 && !player.getHistory("sourceDamage", evt => evt.card === event.card).length;
		},
		async content(event, trigger, player) {
			const cards = trigger.cards.filterInD();
			game.log(player, "将", cards, "置于了仁库");
			await game.cardsGotoSpecial(cards, "toRenku");
		},
		init(player) {
			player.storage.renku = true;
		},
		group: "jishi_draw",
		subSkill: {
			draw: {
				audio: "jishi",
				trigger: {
					global: ["gainAfter", "cardsDiscardAfter"],
				},
				forced: true,
				filter(event, player) {
					return event.fromRenku === true && !event.outRange;
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
		ai: {
			combo: "binglun",
		},
	},
	xinliaoyi: {
		audio: "liaoyi",
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			if (player === event.player) {
				return false;
			}
			if (_status.renku.length) {
				return true;
			}
			return event.player.countCards("h") > event.player.getHp();
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			const num = Math.max(0, target.countCards("h") - target.getHp());
			const choiceList = ["令其从仁库中获得一张牌", `令其将${get.cnNumber(num)}张手牌置入仁库`];
			const choices = [];
			if (_status.renku.length) {
				choices.push("选项一");
			} else {
				choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
			}
			if (target.countCards("h") > target.getHp()) {
				choices.push("选项二");
			} else {
				choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
			}
			if (!choices.length) {
				return;
			}
			const result = await player
				.chooseControl(choices, "cancel2")
				.set("prompt", get.prompt("xinliaoyi", target))
				.set("choiceList", choiceList)
				.set("ai", () => {
					const { player, target, controls } = get.event();
					const att = get.attitude(player, target);
					if (att > 0) {
						if (controls.includes("选项一")) {
							return "选项一";
						}
						return "cancel2";
					}
					if (controls.includes("选项二")) {
						return "选项二";
					}
					return "cancel2";
				})
				.set("target", target)
				.forResult();
			event.result = {
				bool: result.control !== "cancel2",
				cost_data: result.control,
			};
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const control = event.cost_data;
			if (control === "选项一") {
				if (!_status.renku.length) {
					return;
				}
				const result = await target
					.chooseButton(true, ["选择获得一张牌", _status.renku])
					.set("ai", button => get.value(button.link, get.player()))
					.set("direct", true)
					.forResult();
				if (result?.bool) {
					await target.gain(result.links, "gain2", "fromRenku");
				}
			} else {
				const hs = target.getCards("h");
				const num = Math.max(0, target.countCards("h") - target.getHp());
				if (!hs.length) {
					return;
				}
				const result = hs.length <= num ? { bool: true, cards: hs } : await target.chooseCard("h", true, `将${get.cnNumber(num)}张手牌置于仁库中`, num).forResult();
				if (result?.bool) {
					target.$throw(result.cards, 1000);
					game.log(target, "将", result.cards, "置入了仁库");
					await target.lose(result.cards, ui.special, "toRenku");
					await game.delayx();
				}
			}
		},
		init(player) {
			player.storage.renku = true;
		},
		ai: { threaten: 3.4 },
	},
	liaoyi: {
		audio: 2,
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			if (player === event.player) {
				return false;
			}
			const num = event.player.getHp() - event.player.countCards("h");
			if (num < 0) {
				return true;
			}
			return num > 0 && _status.renku.length >= Math.min(4, num);
		},
		logTarget: "player",
		prompt2(event, player) {
			const target = event.player;
			const num = target.getHp() - target.countCards("h");
			if (num < 0) {
				return `令${get.translation(target)}将${get.cnNumber(Math.min(4, -num))}张牌置入仁库`;
			}
			return `令${get.translation(target)}从仁库中获得${get.cnNumber(Math.min(4, num))}张牌`;
		},
		check(event, player) {
			const target = event.player;
			const num = target.getHp() - target.countCards("h");
			const att = get.attitude(player, target);
			if (num < 0) {
				if (target.countCards("e", card => get.value(card, target) <= 0) >= -num / 2) {
					return att > 0;
				}
				return att <= 0;
			}
			return att > 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let num = target.getHp() - target.countCards("h");
			if (num < 0) {
				num = Math.min(4, -num);
				const hs = target.getCards("he");
				if (!hs.length) {
					return;
				}
				const result = hs.length <= num ? { bool: true, cards: hs } : await target.chooseCard("he", true, `将${get.cnNumber(num)}张牌置于仁库中`, num).forResult();
				if (result?.bool) {
					target.$throw(result.cards, 1000);
					game.log(target, "将", result.cards, "置入了仁库");
					await target.lose(result.cards, ui.special, "toRenku");
					await game.delayx();
				}
			} else {
				num = Math.min(4, num);
				if (!_status.renku.length) {
					return;
				}
				const result = await target
					.chooseButton([`选择获得${get.cnNumber(num)}张牌`, _status.renku], num, true)
					.set("ai", button => get.value(button.link, get.player()))
					.set("direct", true)
					.forResult();
				if (result?.bool) {
					await target.gain(result.links, "gain2", "fromRenku");
				}
			}
		},
	},
	binglun: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return _status.renku.length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("病论", _status.renku);
			},
			backup(links, player) {
				const obj = lib.skill.binglun_backup;
				obj.card = links[0];
				return obj;
			},
			prompt: () => "请选择【病论】的目标",
		},
		subSkill: {
			backup: {
				audio: "binglun",
				filterCard: () => false,
				selectCard: -1,
				filterTarget: true,
				delay: false,
				async content(event, trigger, player) {
					const card = lib.skill.binglun_backup.card;
					const { target } = event;
					game.log(card, "从仁库进入了弃牌堆");
					player.$throw(card, 1000);
					await game.delayx();
					const discard = game.cardsDiscard(card);
					discard.fromRenku = true;
					await discard;
					const control = await target
						.chooseControl()
						.set("choiceList", ["摸一张牌", "于自己的下回合结束后回复1点体力"])
						.set("ai", () => (_status.event.player.isHealthy() ? 0 : 1))
						.forResult();
					if (control.index === 0) {
						await target.draw();
					} else {
						target.addSkill("binglun_recover");
						target.addMark("binglun_recover", 1, false);
					}
				},
				ai: {
					result: {
						target(player, target) {
							if (target.isDamaged()) {
								return 1.5;
							}
							return 1;
						},
					},
				},
			},
			recover: {
				trigger: { player: "phaseEnd" },
				forced: true,
				popup: false,
				onremove: true,
				charlotte: true,
				async content(event, trigger, player) {
					if (player.isDamaged()) {
						player.logSkill("binglun_recover");
						player.recover({ num: player.countMark("binglun_recover") });
					}
					player.removeSkill("binglun_recover");
				},
				intro: {
					content: "下回合结束时回复#点体力",
				},
				ai: { threaten: 1.7 },
			},
		},
		ai: {
			combo: "jishi",
			order: 2,
			result: {
				player: 1,
			},
		},
	},
	mjweipo: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasSkill("mjweipo_used")) {
				return false;
			}
			return game.hasPlayer(current => !current.hasSkill("mjweipo_effect"));
		},
		filterTarget(card, player, target) {
			return !target.hasSkill("mjweipo_effect");
		},
		async content(event, trigger, player) {
			player.addTempSkill("mjweipo_used");
			const list = ["binglinchengxiax"];
			list.addArray(get.zhinangs());
			const result = await player
				.chooseButton({
					createDialog: ["危迫：选择一个智囊", [list, "vcard"]],
					forced: true,
					ai(button) {
						return get.event().getParent()?.target.getUseValue({ name: button.link[2] }) ?? 0;
					},
				})
				.forResult();
			if (!result.bool || !result.links?.length) {
				return;
			}
			const name = result.links[0][2];
			const { target } = event;
			game.log(player, "选择了", `#y${get.translation(name)}`);
			target.storage.mjweipo_effect = name;
			target.storage.mjweipo_source = player;
			target.addSkill("mjweipo_effect");
			await game.delayx();
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
		ai: {
			order: 7.1,
			result: {
				target(player, target) {
					if (target === player) {
						return player.hasCards("hs", "sha") ? 10 : 0.01;
					}
					return (target.countCards("hs", "sha") + 0.5) * Math.sqrt(Math.max(1, target.hp));
				},
			},
		},
	},
	mjweipo_effect: {
		audio: "mjweipo",
		enable: "phaseUse",
		sourceSkill: "mjweipo",
		filter(event, player) {
			return player.hasCards("h", "sha");
		},
		prompt() {
			return `弃置一张【杀】并获得一张${get.translation(_status.event.player.storage.mjweipo_effect)}`;
		},
		filterCard: { name: "sha" },
		check(card) {
			return 6 - get.value(card);
		},
		position: "h",
		popname: true,
		async content(event, trigger, player) {
			const name = player.storage.mjweipo_effect;
			let card = null;
			if (name === "binglinchengxiax") {
				if (!_status.binglinchengxiax) {
					_status.binglinchengxiax = [
						["spade", 7],
						["club", 7],
						["club", 13],
					];
					game.broadcastAll(() => {
						lib.inpile.add("binglinchengxiax");
					});
				}
				if (_status.binglinchengxiax.length) {
					let info = _status.binglinchengxiax.randomRemove();
					card = game.createCard2("binglinchengxiax", info[0], info[1]);
				}
			}
			if (!card) {
				card = get.cardPile2(name);
			}
			if (card) {
				await player.gain({
					cards: [card],
					animate: "gain2",
				});
			}
			player.removeSkill("mjweipo_effect");
		},
		ai: {
			order: 7,
			result: { player: 1 },
		},
		mark: true,
		marktext: "迫",
		intro: { content: "可弃置一张【杀】并获得【$】" },
		group: "mjweipo_remove",
	},
	mjweipo_remove: {
		trigger: { global: ["phaseBegin", "die"] },
		forced: true,
		firstDo: true,
		popup: false,
		sourceSkill: "mjweipo",
		filter(event, player) {
			return event.player === player.storage.mjweipo_source;
		},
		async content(event, trigger, player) {
			player.removeSkill("mjweipo_effect");
		},
	},
	mjchenshi: {
		audio: 2,
		global: ["mjchenshi_player", "mjchenshi_target"],
		ai: { combo: "mjweipo" },
	},
	mjchenshi_player: {
		trigger: { player: "useCardToPlayered" },
		sourceSkill: "mjchenshi",
		filter(event, player) {
			if (!event.card || event.card.name !== "binglinchengxiax" || !event.isFirstTarget) {
				return false;
			}
			return player.countCards("he") > 0 && game.hasPlayer(current => current !== player && current.hasSkill("mjchenshi"));
		},
		async cost(event, trigger, player) {
			const list = game.filterPlayer(current => current !== player && current.hasSkill("mjchenshi"));
			event.result = await player
				.chooseCardTarget({
					prompt: `是否交给${get.translation(list)}一张牌，将牌堆顶三张牌中不为【杀】的牌置于弃牌堆？`,
					filterCard: true,
					position: "he",
					filterTarget(card, player, target) {
						return _status.event.list.includes(target);
					},
					list: list,
					selectTarget: list.length > 1 ? 1 : -1,
					goon: (() => {
						for (const i of list) {
							if (get.attitude(player, i) > 0) {
								return 1;
							}
							return -1;
						}
					})(),
					ai1(card) {
						if (_status.event.goon > 0) {
							return 7 - get.value(card);
						}
						return 0.01 - get.value(card);
					},
					ai2(target) {
						let card = ui.selected.cards[0];
						return get.value(card, target) * get.attitude(_status.event.player, target);
					},
				})
				.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			target.logSkill("mjchenshi");
			player.line(target, "green");
			trigger.getParent().mjchenshi_ai = true;
			await player.give(cards, target);
			const top = get.cards(3, true).filter(card => get.name(card) !== "sha");
			if (top.length) {
				game.log(top, "进入了弃牌堆");
				player.$throw(top, 1000);
				await game.cardsDiscard(top);
				await game.delayx();
			}
		},
	},
	mjchenshi_target: {
		trigger: { target: "useCardToTargeted" },
		sourceSkill: "mjchenshi",
		filter(event, player) {
			if (!event.card || event.card.name !== "binglinchengxiax") {
				return false;
			}
			return player.countCards("he") > 0 && game.hasPlayer(current => current !== player && current.hasSkill("mjchenshi"));
		},
		async cost(event, trigger, player) {
			const list = game.filterPlayer(current => current !== player && current.hasSkill("mjchenshi"));
			event.result = await player
				.chooseCardTarget({
					prompt: `是否交给${get.translation(list)}一张牌，将牌堆顶三张牌中的【杀】置于弃牌堆？`,
					filterCard: true,
					position: "he",
					filterTarget(card, player, target) {
						return _status.event.list.includes(target);
					},
					list: list,
					selectTarget: list.length > 1 ? 1 : -1,
					goon: (() => {
						if (trigger.getParent().chenshi_ai) {
							return 1;
						}
						for (const i of list) {
							if (get.attitude(player, i) > 0) {
								return 1;
							}
							return -1;
						}
					})(),
					ai1(card) {
						if (_status.event.goon > 0) {
							return 7 - get.value(card);
						}
						return 3 - get.value(card);
					},
					ai2(target) {
						let card = ui.selected.cards[0];
						return Math.max(0.1, get.value(card, target) * get.attitude(_status.event.player, target));
					},
				})
				.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			target.logSkill("mjchenshi");
			player.line(target, "green");
			await player.give(cards, target);
			const top = get.cards(3, true).filter(card => get.name(card) === "sha");
			if (top.length) {
				game.log(top, "进入了弃牌堆");
				player.$throw(top, 1000);
				await game.cardsDiscard(top);
				await game.delayx();
			}
		},
	},
	mjmouzhi: {
		audio: 2,
		trigger: { player: "damageBegin2" },
		forced: true,
		filter(event, player) {
			if (!event.card || get.suit(event.card) === "none") {
				return false;
			}
			let all = player.getAllHistory("damage");
			if (!all.length) {
				return false;
			}
			return all[all.length - 1].card && get.suit(all[all.length - 1].card) === get.suit(event.card);
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
		group: "mjmouzhi_mark",
		intro: { content: "上次受到伤害的花色：$" },
		ai: {
			effect: {
				target: (card, player, target) => {
					if (typeof card === "object" && get.tag(card, "damage")) {
						let suit = get.suit(card);
						if (suit === "none") {
							return;
						}
						let all = target.getAllHistory("damage");
						if (!all.length || !all[all.length - 1].card) {
							return;
						}
						if (get.suit(all[all.length - 1].card) === suit) {
							return "zeroplayertarget";
						}
					}
				},
			},
		},
		subSkill: {
			mark: {
				trigger: { player: "damage" },
				silent: true,
				firstDo: true,
				async content(event, trigger, player) {
					if (!trigger.card || get.suit(trigger.card) === "none") {
						player.unmarkSkill("mjmouzhi");
					} else {
						player.markSkill("mjmouzhi");
						game.broadcastAll(
							(player, suit) => {
								if (player.marks.mjmouzhi) {
									player.marks.mjmouzhi.firstChild.innerHTML = get.translation(suit);
								}
								player.storage.mjmouzhi = suit;
							},
							player,
							get.suit(trigger.card)
						);
					}
				},
			},
		},
	},
	mjshengxi: {
		audio: "shengxi",
		audioname: ["feiyi"],
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.hasHistory("useCard") && !player.hasHistory("sourceDamage");
		},
		async content(event, trigger, player) {
			const list = get.zhinangs();
			const { bool, links } = await player
				.chooseButton({
					createDialog: [`###${get.prompt("mjshengxi")}###获得一张智囊或摸一张牌`, [list, "vcard"], [["摸一张牌", "取消"], "tdnodes"]],
					forced: true,
					ai(card) {
						if (card.link[2]) {
							if (!get.cardPile2(cardx => cardx.name === card.link[2])) {
								return 0;
							}
							return (Math.random() + 1.5) * get.value({ name: card.link[2] }, _status.event.player);
						}
						if (card.link === "摸一张牌") {
							return 1;
						}
						return 0;
					},
				})
				.forResult();
			if (!bool || !links?.length || links[0] === "取消") {
				return;
			}
			player.logSkill("mjshengxi");
			if (links[0] === "摸一张牌") {
				await player.draw();
				return;
			}
			const card = get.cardPile2(card => card.name === links[0][2]);
			if (card) {
				await player.gain({
					cards: [card],
					animate: "gain2",
				});
			}
		},
		group: "mjshengxi_zhunbei",
		subfrequent: ["zhunbei"],
		subSkill: {
			zhunbei: {
				audio: "shengxi",
				audioname: ["feiyi"],
				trigger: { player: "phaseZhunbeiBegin" },
				frequent: true,
				prompt2: "从游戏外或牌堆中获得一张【调剂盐梅】",
				async content(event, trigger, player) {
					if (!_status.tiaojiyanmei_suits || _status.tiaojiyanmei_suits.length > 0) {
						if (!lib.inpile.includes("tiaojiyanmei")) {
							lib.inpile.add("tiaojiyanmei");
						}
						if (!_status.tiaojiyanmei_suits) {
							_status.tiaojiyanmei_suits = lib.suit.slice(0);
						}
						await player.gain(game.createCard2("tiaojiyanmei", _status.tiaojiyanmei_suits.randomRemove(), 6), "gain2");
						return;
					}
					const card = get.cardPile2(card => card.name === "tiaojiyanmei");
					if (card) {
						await player.gain({
							cards: [card],
							animate: "gain2",
						});
					}
				},
			},
		},
	},
	mjkuanji: {
		audio: "fyjianyu",
		usable: 1,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type !== "discard") {
				return false;
			}
			const evt = event.getl(player);
			return evt?.cards2?.filterInD("d").length > 0 && game.hasPlayer(current => player !== current);
		},
		async cost(event, trigger, player) {
			const cards = trigger.getl(player).cards2;
			const { links } = await player
				.chooseButton(["宽济：是否将一张牌交给一名其他角色？", cards.filterInD("d")])
				.set("ai", button => {
					const player = get.player();
					if (game.hasPlayer(current => current !== player && get.attitude(player, current) > 0)) {
						return Math.abs(get.value(button.link, "raw")) + 1;
					}
					return -get.value(button.link, "raw");
				})
				.forResult();
			if (!links?.length) {
				return;
			}
			const card = links[0];
			event.card = card;
			const { bool, targets } = await player
				.chooseTarget(`将${get.translation(card)}交给一名其他角色并摸一张牌`, lib.filter.notMe, true)
				.set("ai", target => {
					const evt = _status.event.getParent();
					return get.attitude(evt.player, target) * get.value(evt.card, target) * (target.hasSkillTag("nogain") ? 0.1 : 1);
				})
				.forResult();
			event.result = {
				bool: bool,
				targets: targets,
				cost_data: card,
			};
		},
		async content(event, trigger, player) {
			await event.targets[0].gain(event.cost_data, "gain2");
			await player.draw();
		},
	},
	mjdingyi: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		logTarget() {
			return game.players;
		},
		async content(event, trigger, player) {
			const list = [];
			for (const i of [0, 1, 2, 3]) {
				list.push(lib.skill[`mjdingyi_${i}`].title);
			}
			const { index } = await player
				.chooseControl({
					prompt: "定仪：请选择一个全局效果",
					choiceList: list,
					ai() {
						const list1 = player.getEnemies().length;
						const list2 = game.players.length - list1;
						if (list2 - list1 > 1) {
							return 0;
						}
						if (game.players.length < 6) {
							return 2;
						}
						return 3;
					},
				})
				.forResult();
			if (typeof index !== "number") {
				return;
			}
			const skill = `mjdingyi_${index}`;
			game.log(player, "选择了", `#g${lib.skill[skill].title}`);
			for (const target of game.players) {
				target.addSkill(skill);
			}
			await game.delayx();
		},
		subSkill: {
			0: {
				title: "摸牌阶段的额定摸牌数+1",
				charlotte: true,
				mark: true,
				marktext: "仪",
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += (player.storage.mjdingyi_plus || 0) + 1;
				},
				intro: {
					content(storage, player) {
						return `摸牌阶段的额定摸牌数+${1 * ((player.storage.mjdingyi_plus || 0) + 1)}`;
					},
				},
			},
			1: {
				title: "手牌上限+2",
				charlotte: true,
				mark: true,
				marktext: "仪",
				mod: {
					maxHandcard(player, num) {
						return num + 2 * ((player.storage.mjdingyi_plus || 0) + 1);
					},
				},
				intro: {
					content(storage, player) {
						return `手牌上限+${2 * ((player.storage.mjdingyi_plus || 0) + 1)}`;
					},
				},
			},
			2: {
				title: "攻击范围+1",
				charlotte: true,
				mark: true,
				marktext: "仪",
				mod: {
					attackRange(player, num) {
						return num + ((player.storage.mjdingyi_plus || 0) + 1);
					},
				},
				intro: {
					content(storage, player) {
						return `攻击范围+${(player.storage.mjdingyi_plus || 0) + 1}`;
					},
				},
			},
			3: {
				title: "脱离濒死状态后回复1点体力",
				charlotte: true,
				mark: true,
				marktext: "仪",
				trigger: { player: "dyingAfter" },
				forced: true,
				filter(event, player) {
					return player.isDamaged();
				},
				async content(event, trigger, player) {
					await player.recover((player.storage.mjdingyi_plus || 0) + 1);
				},
				intro: {
					content(storage, player) {
						return `脱离濒死状态后回复${(player.storage.mjdingyi_plus || 0) + 1}点体力`;
					},
				},
			},
		},
	},
	mjzuici: {
		audio: "zuici",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!event.source || !event.source.isIn()) {
				return false;
			}
			for (const i of [0, 1, 2, 3]) {
				if (event.source.hasSkill(`mjdingyi_${i}`)) {
					return true;
				}
			}
			return false;
		},
		logTarget: "source",
		check: () => false,
		async content(event, trigger, player) {
			const target = trigger.source;
			for (const i of [0, 1, 2, 3]) {
				if (target.hasSkill(`mjdingyi_${i}`)) {
					target.removeSkill(`mjdingyi_${i}`);
				}
			}
			const list = get.zhinangs();
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseButton({
					createDialog: [`选择要令${get.translation(target)}获得的智囊`, [list, "vcard"]],
					forced: true,
				})
				.forResult();
			if (result.bool) {
				const card = get.cardPile2(card => card.name === result.links[0][2]);
				if (card) {
					await target.gain({
						cards: [card],
						animate: "gain2",
					});
				}
			}
		},
		ai: {
			combo: "mjdingyi",
		},
	},
	mjfubi: {
		audio: "fubi",
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasSkill("mjfubi_round")) {
				return false;
			}
			return game.hasPlayer(current => {
				for (const i of [0, 1, 2, 3]) {
					if (current.hasSkill(`mjdingyi_${i}`)) {
						return true;
					}
				}
				return false;
			});
		},
		filterCard: true,
		selectCard: [0, 1],
		filterTarget(card, player, target) {
			if (ui.selected.cards.length) {
				for (const i of [0, 1, 2, 3]) {
					if (target.hasSkill(`mjdingyi_${i}`)) {
						return true;
					}
				}
			}
			const num = 0;
			for (const i of [0, 1, 2, 3]) {
				if (target.hasSkill(`mjdingyi_${i}`)) {
					return true;
				}
			}
			return num > 1 && num < 4;
		},
		check: () => false,
		position: "he",
		async content(event, trigger, player) {
			const cards = event.cards;
			const target = event.target;
			player.addTempSkill("mjfubi_round", "roundStart");
			if (cards.length) {
				player.addSkill("mjfubi_clear");
				player.markAuto("mjfubi_clear", [target]);
				target.addMark("mjdingyi_plus", 1, false);
				game.log(target, "的", "#g【定仪】", "效果增加一倍");
				return;
			}
			const list = [];
			const nums = [];
			for (const i of [0, 1, 2, 3]) {
				if (!target.hasSkill(`mjdingyi_${i}`)) {
					list.push(lib.skill[`mjdingyi_${i}`].title);
					nums.push(i);
				}
			}
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseControl({
					prompt: `辅弼：请选择为${get.translation(target)}更换的〖定仪〗效果`,
					choiceList: list,
					ai() {
						const currentPlayer = _status.event.player;
						const currentTarget = _status.event.getParent()?.target;
						if (get.attitude(currentPlayer, currentTarget) > 0 && !currentTarget?.hasSkill("mjdingyi_0")) {
							return 0;
						}
						return nums.length - 1;
					},
				})
				.forResult();
			for (const i of [0, 1, 2, 3]) {
				if (target.hasSkill(`mjdingyi_${i}`)) {
					target.removeSkill(`mjdingyi_${i}`);
				}
			}
			const skill = `mjdingyi_${nums[result.index]}`;
			target.addSkill(skill);
			game.log(target, "的效果被改为", `#g${lib.skill[skill].title}`);
		},
		ai: {
			order: 10,
			expose: 0,
			result: {
				target(player, target) {
					if (target.hasSkill("mjdingyi_0")) {
						return -1;
					}
					return 2;
				},
			},
			combo: "mjdingyi",
		},
		subSkill: {
			round: {},
			clear: {
				trigger: { player: ["phaseBegin", "dieBegin"] },
				forced: true,
				popup: false,
				charlotte: true,
				async content(event, trigger, player) {
					for (const target of player.storage.mjfubi_clear || []) {
						if (target.hasMark("mjdingyi_plus")) {
							target.removeMark("mjdingyi_plus", 1, false);
						}
					}
					delete player.storage.mjfubi_clear;
					player.removeSkill("mjfubi_clear");
				},
			},
		},
	},
	boming: {
		audio: 2,
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard: true,
		position: "he",
		filterTarget: lib.filter.notMe,
		discard: false,
		lose: false,
		delay: false,
		async content(event, trigger, player) {
			const cards = event.cards;
			const target = event.target;
			await player.give(cards, target);
		},
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					let card = ui.selected.cards[0];
					if (player.hasSkill("ejian") && !player.getStorage("ejian").includes(target)) {
						let dam = get.damageEffect(target, player, target);
						if (dam > 0) {
							return dam;
						}
						let type = get.type(card, null, target);
						let ts = target.getCards("he", card => get.type(card) === type);
						if (ts.length) {
							let val = get.value(ts, target);
							if (val > get.value(card)) {
								return -Math.max(1, val);
							}
							return 0;
						}
					}
					return get.value(card, target) / 1.5;
				},
			},
		},
		group: "boming_draw",
		subSkill: {
			draw: {
				audio: "boming",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				locked: false,
				filter(event, player) {
					return player.getHistory("lose", evt => evt.getParent(2).name === "boming").length > 1;
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	ejian: {
		audio: 2,
		trigger: { global: "gainAfter" },
		forced: true,
		filter(event, player) {
			const evt = event.getParent();
			const target = event.player;
			if (evt.name !== "boming" || evt.player !== player || player.getStorage("ejian").includes(target) || !target.isIn()) {
				return false;
			}
			const he = target.getCards("he");
			const card = event.cards[0];
			if (!he.includes(card)) {
				return false;
			}
			const type = get.type2(card);
			for (const current of he) {
				if (current !== card && get.type2(current) === type) {
					return true;
				}
			}
			return false;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const cardType = get.type2(trigger.cards[0]);
			const target = trigger.player;
			player.markAuto("ejian", [target]);
			const result = await target
				.chooseControl({
					choiceList: ["受到1点伤害", `展示手牌并弃置所有${get.translation(cardType)}牌`],
					ai(evt, current) {
						if (get.damageEffect(current, evt.getParent().player, current) >= 0) {
							return 0;
						}
						const type = evt.cardType;
						const cards = current.getCards("he", card => get.type2(card) === type);
						if (cards.length === 1) {
							return 1;
						}
						if (cards.length >= 2) {
							for (const card of cards) {
								if (get.tag(card, "save")) {
									return 0;
								}
							}
						}
						if (current.hp === 1) {
							return 1;
						}
						for (const card of cards) {
							if (get.value(card) >= 8) {
								return 0;
							}
						}
						if (cards.length > 2 && current.hp > 2) {
							return 0;
						}
						if (cards.length > 3) {
							return 0;
						}
						return 1;
					},
				})
				.set("cardType", cardType)
				.forResult();
			if (result.index !== 1) {
				await target.damage();
				return;
			}
			if (target.hasCards("h")) {
				await target.showHandcards();
			}
			await target.discard({
				cards: target.getCards("he", card => get.type2(card) === cardType),
			});
		},
		ai: { combo: "boming", halfneg: true },
		onremove: true,
		intro: { content: "已对$发动过此技能" },
	},
	yuanqing: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		forced: true,
		filter(event, player) {
			return player.hasHistory("useCard", evt => evt.getParent("phaseUse") === event);
		},
		async content(event, trigger, player) {
			const map = {};
			const cards = [];
			player.getHistory("useCard", evt => {
				let type = get.type2(evt.card, false);
				if (!map[type]) {
					map[type] = [];
				}
			});
			for (const card of ui.discardPile.childNodes) {
				let type = get.type2(card, false);
				if (map[type]) {
					map[type].push(card);
				}
			}
			for (const i in map) {
				if (map[i].length) {
					cards.push(map[i].randomGet());
				}
			}
			if (cards.length) {
				player.$gain2(cards, false);
				game.cardsGotoSpecial(cards, "toRenku");
				game.log(player, "将", cards, "置入了仁库");
				game.delayx();
			}
		},
		init(player) {
			player.storage.renku = true;
		},
		ai: {
			combo: "shuchen",
		},
	},
	shuchen: {
		audio: 2,
		init(player) {
			player.storage.renku = true;
		},
		trigger: { global: "dying" },
		forced: true,
		filter(event, player) {
			return _status.renku.length > 3;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.gain(_status.renku, "gain2", "fromRenku");
			await trigger.player.recover();
		},
		ai: {
			combo: "yuanqing",
		},
	},
	hxrenshi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0 && (!player.storage.hxrenshi2 || game.hasPlayer(current => !player.storage.hxrenshi2.includes(current)));
		},
		filterCard: true,
		filterTarget(card, player, target) {
			return !player.storage.hxrenshi2 || !player.storage.hxrenshi2.includes(target);
		},
		position: "h",
		discard: false,
		lose: false,
		delay: false,
		check(cardx) {
			let player = _status.event.player;
			if (player.getStorage("debao").length === 1 && (!game.hasPlayer(current => get.attitude(player, current) > 0 && current.hp * 1.5 + current.countCards("h") < 4) || game.hasPlayer(current => get.attitude(player, current) <= 0 && current.hp * 1.5 + current.countCards("h") < 4))) {
				return 0;
			}
			return 5 - get.value(cardx);
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			const target = event.target;
			const targets = event.targets;
			player.addTempSkill("hxrenshi2", "phaseUseEnd");
			player.markAuto("hxrenshi2", targets);
			await player.give(cards, target);
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (ui.selected.cards.length) {
						return get.value(ui.selected.cards[0], target) + 0.1;
					}
					return 0;
				},
			},
		},
	},
	hxrenshi2: {
		onremove: true,
	},
	debao: {
		audio: 2,
		trigger: { global: "gainAfter" },
		forced: true,
		filter(event, player) {
			if (player === event.player || player.getStorage("debao").length >= player.maxHp) {
				return false;
			}
			let evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.length > 0;
		},
		async content(event, trigger, player) {
			const cards = get.cards();
			player.markAuto("debao", cards);
			player.$gain2(cards[0], false);
			await game.cardsGotoSpecial(cards);
			game.log(player, "将", cards[0], "放在了武将牌上");
			await game.delayx();
		},
		marktext: "仁",
		intro: { content: "cards", onunmark: "throw" },
		group: "debao_gain",
		subSkill: {
			gain: {
				audio: "debao",
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				filter(event, player) {
					return player.getStorage("debao").length > 0;
				},
				async content(event, trigger, player) {
					const cards = player.storage.debao;
					await player.gain(cards, "gain2", "fromStorage");
					cards.length = 0;
					player.unmarkSkill("debao");
				},
			},
		},
	},
	buqi: {
		audio: 2,
		trigger: { global: "dying" },
		forced: true,
		filter(event, player) {
			return player.getStorage("debao").length > 1;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const storageCards = player.getStorage("debao");
			const result =
				storageCards.length === 2
					? { bool: true, links: storageCards.slice() }
					: await player
							.chooseButton({
								createDialog: ["不弃：请选择移去两张“仁”", storageCards],
								selectButton: 2,
								forced: true,
							})
							.forResult();
			if (!result.bool) {
				return;
			}
			const cards = result.links;
			player.unmarkAuto("debao", cards);
			player.$throw(cards, 1000);
			game.log(player, "将", cards, "置入了弃牌堆");
			await game.delayx();
			await game.cardsDiscard(cards);
			if (trigger.player.isIn() && trigger.player.isDamaged()) {
				await trigger.player.recover();
			}
		},
		group: "buqi_die",
		subSkill: {
			die: {
				audio: "buqi",
				trigger: { global: "dieAfter" },
				forced: true,
				filter(event, player) {
					return player.getStorage("debao").length > 0;
				},
				async content(event, trigger, player) {
					player.unmarkSkill("debao");
				},
			},
		},
		ai: {
			neg: true,
			combo: "debao",
		},
	},
	guying: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		usable: 1,
		filter(event, player) {
			/* if (event.type !== "discard") {
				const evt = event.getParent();
				if (evt.name !== "useCard" && evt.name !== "respond") {
					return false;
				}
			} */
			const target = _status.currentPhase;
			const evt = event.getl(player);
			if (!evt?.cards2 || evt.cards2?.length !== 1 || !target || target === player || !target.isIn()) {
				return false;
			}
			return get.position(evt.cards2[0]) === "d" || target.countCards("he") < 0;
		},
		logTarget() {
			return _status.currentPhase;
		},
		async content(event, trigger, player) {
			if (trigger.delay === false) {
				await game.delayx();
			}
			const target = _status.currentPhase;
			const card = trigger.getl(player).cards2[0];
			player.addMark(event.name, 1, false);
			const choiceList = [];
			const str = get.translation(player);
			let addIndex = 0;
			if (target.countGainableCards(player, "he") > 0) {
				choiceList.push(`随机交给${str}一张牌`);
			} else {
				addIndex++;
			}
			if (get.position(card) === "d") {
				choiceList.push(`令${str}收回${get.translation(card)}`);
			}
			let result;
			if (choiceList.length === 1) {
				result = { index: 0 };
			} else {
				result = await target
					.chooseControl()
					.set("choiceList", choiceList)
					.set("sourcex", player)
					.set("card", card)
					.set("ai", () => {
						const player = get.player();
						const { sourcex, card } = get.event();
						if (get.value(card, sourcex) * get.attitude(player, sourcex) > 0) {
							return 0;
						}
						return Math.random() > get.value(card, sourcex) / 6 ? 1 : 0;
					})
					.forResult();
			}
			if (typeof result?.index !== "number") {
				return;
			}
			if (result.index + addIndex === 0) {
				await target.give(target.getGainableCards(player, "he").randomGet(), player);
			} else {
				await player.gain(card, "gain2");
				if (player.isIn() && player.getCards("h").includes(card) && get.type(card, null, player) === "equip") {
					await player.chooseUseTarget(card, true, "nopopup");
				}
			}
		},
		onremove: true,
		intro: { content: "已发动过#次" },
		group: "guying_discard",
		subSkill: {
			discard: {
				audio: "guying",
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				filter(event, player) {
					return player.countMark("guying") > 0;
				},
				async content(event, trigger, player) {
					const num = player.countMark("guying");
					player.clearMark("guying", false);
					if (num > 0) {
						await player.chooseToDiscard("he", num, true, "allowChooseAll");
					}
				},
			},
		},
	},
	muzhen: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			const list = player.getStorage("muzhen_used");
			if (!list.includes("gain") && player.hasCard(i => get.type(i) === "equip", "he") && game.hasPlayer(current => current !== player && current.countCards("h") > 0)) {
				return true;
			}
			if (!list.includes("give") && player.countCards("he") > 0 && game.hasPlayer(current => current !== player && current.countCards("e") > 0)) {
				return true;
			}
			return !list.includes("draw") && game.hasPlayer(current => current !== player);
		},
		chooseButton: {
			dialog(event, player) {
				const list = [
					["gain", "将一张装备牌置于其他角色的装备区内并获得其一张手牌"],
					["give", "将至多两张牌交给一名其他角色并获得其装备区内的一张牌"],
					["draw", "你可以选择任意名其他角色，这些角色手牌数和装备区牌数每有一项与你相同，其摸一张牌，若这些角色均摸了两张牌，你摸选择角色数张牌"],
				];
				return ui.create.dialog("睦阵：请选择一项", [list, "textbutton"], "hidden");
			},
			filter(button, player) {
				const list = player.getStorage("muzhen_used");
				if (list.includes(button.link)) {
					return false;
				}
				if (button.link === "gain") {
					return player.hasCard(i => get.type(i) === "equip", "he") && game.hasPlayer(current => current !== player && current.countCards("h") > 0);
				}
				if (button.link === "give") {
					return player.countCards("he") > 0 && game.hasPlayer(current => current !== player && current.countCards("e") > 0);
				}
				return game.hasPlayer(current => current !== player);
			},
			backup(links) {
				const index = ["gain", "give", "draw"].indexOf(links[0]);
				return {
					audio: "muzhen",
					filterTarget: [
						(card, player, target) => {
							if (target === player) {
								return false;
							}
							return target.countCards("h") > 0 && target.canEquip(ui.selected.cards[0]);
						},
						(card, player, target) => {
							if (target === player) {
								return false;
							}
							return target.countCards("e") > 0;
						},
						lib.filter.notMe,
					][index],
					selectTarget: [1, 1, [1, Infinity]][index],
					filterCard: [
						(card, player) => {
							if (get.type(card) !== "equip") {
								return false;
							}
							if (ui.selected.targets.length) {
								return ui.selected.targets[0].canEquip(card);
							}
							return game.hasPlayer(current => current.countCards("h") > 0 && current.canEquip(card));
						},
						true,
						() => false,
					][index],
					selectCard: [1, [1, 2], -1][index],
					ai1(card) {
						return 8 - get.value(card);
					},
					ai2: [
						target => {
							const player = get.player();
							return get.attitude(player, target);
						},
						target => {
							const player = get.player();
							return get.attitude(player, target);
						},
						target => {
							const player = get.player();
							let cache = _status.event.getTempCache("muzhen", "targets");
							if (!Array.isArray(cache)) {
								let extras = [];
								let draws = game.filterPlayer(current => {
									if (current === player || get.attitude(player, current) <= 0) {
										return false;
									}
									let num = 0;
									for (const pos of ["h", "e"]) {
										if (current.countCards(pos) === player.countCards(pos)) {
											num++;
										}
									}
									if (num === 2) {
										extras.add(current);
									}
									return num === 1;
								});
								if (draws.length > extras.length) {
									extras.addArray(draws);
								}
								_status.event.putTempCache("muzhen", "targets", extras);
								cache = extras;
							}
							if (cache.length) {
								return cache.includes(target) ? 2 : 0;
							}
							return get.attitude(player, target) > 0;
						},
					][index],
					position: "he",
					discard: false,
					lose: false,
					delay: false,
					link: links[0],
					multiline: true,
					multitarget: true,
					async content(event, trigger, player) {
						const { cards, targets } = event;
						const target = targets[0];
						const { link } = get.info(event.name);
						player.addTempSkill("muzhen_used", "phaseUseEnd");
						player.markAuto("muzhen_used", link);
						switch (link) {
							case "gain": {
								player.$giveAuto(cards[0], target);
								await game.delayx();
								await target.equip(cards[0]);
								if (target.countGainableCards(player, "h")) {
									await player.gainPlayerCard(target, "h", true);
								}
								break;
							}
							case "give": {
								await player.give(cards, target);
								if (target.countGainableCards(player, "e")) {
									await player.gainPlayerCard(target, "e", true);
								}
								break;
							}
							default: {
								targets.sortBySeat();
								let draw = true;
								await Promise.all(
									targets.map(target => {
										let num = 0;
										for (const pos of ["h", "e"]) {
											if (target.countCards(pos) === player.countCards(pos)) {
												num++;
											}
										}
										if (num !== 2) {
											draw = false;
										}
										if (num > 0) {
											target.draw(num, "nodelay");
										}
										return target;
									})
								);
								if (draw) {
									await player.draw(targets.length);
								}
								break;
							}
						}
					},
				};
			},
			prompt() {
				return "请选择【睦阵】的牌和目标";
			},
		},
		ai: {
			order: 6,
			result: {
				player: 1,
			},
		},
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	sheyi: {
		audio: 2,
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			return player !== event.player && event.player.hp < player.hp && player.countCards("he") >= Math.max(1, player.hp);
		},
		round: 1,
		async cost(event, trigger, player) {
			const num = Math.max(1, player.hp);
			const { player: target } = trigger;
			event.result = await player
				.chooseCard("he", get.prompt(event.skill, target), `交给其至少${get.cnNumber(num)}张牌，防止即将受到的伤害（${trigger.num}点）`, [num, player.countCards("he")], "allowChooseAll")
				.set(
					"goon",
					(() => {
						if (get.attitude(player, target) < 0) {
							return false;
						}
						if (trigger.num < target.hp && get.damageEffect(target, trigger.source, player, trigger.nature) >= 0) {
							return false;
						}
						if (trigger.num < 2 && target.hp > trigger.num) {
							return 6 / Math.sqrt(num);
						}
						if (target === get.zhu(player)) {
							return 9;
						}
						return 8 / Math.sqrt(num);
					})()
				)
				.set("ai", card => {
					const { player, goon } = get.event();
					if (ui.selected.cards.length >= Math.max(1, player.hp)) {
						return 0;
					}
					if (typeof goon === "number") {
						return goon - get.value(card);
					}
					return 0;
				})
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { player: target } = trigger;
			await player.give(event.cards, target);
			trigger.cancel();
		},
	},
	tianyin: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			let list = [];
			player.getHistory("useCard", evt => {
				list.add(get.type2(evt.card, false));
			});
			for (const card of ui.cardPile.childNodes) {
				if (!list.includes(get.type2(card, false))) {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const list = [];
			const cards = [];
			player.getHistory("useCard", evt => {
				list.add(get.type2(evt.card, false));
			});
			for (const card of ui.cardPile.childNodes) {
				let type = get.type2(card, false);
				if (!list.includes(type)) {
					list.push(type);
					cards.push(card);
				}
			}
			player.gain(cards, "gain2");
		},
	},
	//王甫赵累
	xunyi: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "dieAfter"],
			player: "enterGame",
		},
		intro: { content: "效果目标：$" },
		filter(event, player) {
			if (event.name === "die") {
				return player.getStorage("xunyi").includes(event.player);
			}
			return !player.getStorage("xunyi").length && (event.name !== "phase" || game.phaseNumber === 0);
		},
		async cost(event, trigger, player) {
			player.removeSkill("xunyi_effect");
			let prompt = trigger.name === "die" ? "是否令一名其他角色获得“义”？" : "令一名其他角色获得“义”";
			event.result = await player
				.chooseTarget(lib.filter.notMe, "殉义", prompt, trigger.name !== "die")
				.set("ai", target => {
					let player = _status.event.player;
					return Math.max(1 + get.attitude(player, target) * get.threaten(target), Math.random());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.markAuto("xunyi", event.targets);
			player.addSkill("xunyi_effect");
		},
		subSkill: {
			effect: {
				audio: "xunyi",
				trigger: {
					global: ["damageSource", "damageEnd"],
				},
				forced: true,
				charlotte: true,
				onremove(player) {
					player.unmarkAuto("xunyi", player.getStorage("xunyi"));
				},
				getIndex(event) {
					return event.num;
				},
				filter(event, player, name) {
					if (!player.getStorage("xunyi").length) {
						return false;
					}
					let viewer = event[name === "damageEnd" ? "player" : "source"];
					let list = player.getStorage("xunyi").concat([player]);
					if (!list.includes(viewer)) {
						return false;
					}
					let target = list.find(current => current !== viewer);
					if (!target || (name === "damageEnd" && !target.countCards("he"))) {
						return false;
					}
					return target.isIn() && target !== event[name !== "damageEnd" ? "player" : "source"];
				},
				logTarget(event, player, name) {
					return player.getStorage("xunyi")[0];
				},
				async content(event, trigger, player) {
					const bool = event.triggername === "damageEnd";
					let viewer = trigger[bool ? "player" : "source"];
					let target = viewer === player ? event.targets[0] : player;
					if (bool) {
						await target.chooseToDiscard("he", true);
					} else {
						await target.draw();
					}
				},
			},
		},
	},
	//狗剩
	reduoji: {
		audio: "duoji",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCards("he");
		},
		filterCard: true,
		position: "he",
		filterTarget: lib.filter.notMe,
		discard: false,
		toStorage: true,
		delay: false,
		check(card) {
			return 3 - get.value(card);
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			const target = event.target;
			player.$give(cards[0], target, false);
			target.markAuto("reduoji", cards);
			game.log(player, "将", cards[0], "放在了", target, "的武将牌上");
			await game.delay();
		},
		group: ["reduoji_equip", "reduoji_gain"],
		intro: {
			content: "cards",
			onunmark: "throw",
		},
		ai: {
			order: 1,
			result: { target: -1 },
		},
		subSkill: {
			equip: {
				audio: "duoji",
				trigger: { global: "equipAfter" },
				forced: true,
				filter(event, player) {
					if (player === event.player || !event.player.getStorage("reduoji").length || !event.player.getCards("e").includes(event.card)) {
						return false;
					}
					const evt = event.getParent(2);
					return evt?.name === "useCard" && evt.player === event.player;
				},
				logTarget: "player",
				async content(event, trigger, player) {
					await player.gain(trigger.card, trigger.player, "give", "bySelf");
					const target = trigger.player;
					const storage = target.getStorage("reduoji");
					if (storage.length) {
						const card = storage[0];
						target.$throw(card, 1000);
						target.unmarkAuto("reduoji", [card]);
						game.log(target, "移去了", card);
						await game.cardsDiscard(card);
						await target.draw();
					}
				},
			},
			gain: {
				audio: "duoji",
				trigger: { global: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return event.player.getStorage("reduoji").length > 0;
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = trigger.player;
					const cards = target.storage.reduoji;
					target.$give(cards, player);
					await player.gain(cards, "fromStorage");
					cards.length = 0;
					target.unmarkSkill("reduoji");
					await game.delay();
				},
			},
		},
	},
	//SP辛毗
	spyinju: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			const result = await target
				.chooseToUse({
					prompt: `引裾：对${get.translation(player)}使用一张杀，或跳过下回合的出牌阶段和弃牌阶段`,
					filterCard(card, player, event) {
						if (get.name(card) !== "sha") {
							return false;
						}
						return lib.filter.filterCard(card, player, event);
					},
					filterTarget(card, player, target) {
						if (target !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled(card, player, target);
					},
				})
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("sourcex", player)
				.forResult();
			if (result.bool) {
				return;
			}
			target.addSkill("spyinju2");
		},
		ai: {
			order: 1,
			expose: 0.2,
			result: {
				target: -1.5,
				player(player, target) {
					if (!target.canUse("sha", player)) {
						return 0;
					}
					if (target.countCards("h") === 0) {
						return 0;
					}
					if (target.countCards("h") === 1) {
						return -0.1;
					}
					if (player.countCards("h", "shan") === 0) {
						return -1;
					}
					if (player.hp < 2) {
						return -2;
					}
					return -0.5;
				},
			},
			threaten: 1.1,
		},
	},
	spyinju2: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		charlotte: true,
		sourceSkill: "spyinju",
		async content(event, trigger, player) {
			player.skip("phaseUse");
			player.skip("phaseDiscard");
			player.removeSkill("spyinju2");
			game.log(player, "跳过了出牌阶段");
			game.log(player, "跳过了弃牌阶段");
		},
		mark: true,
		intro: { content: "衣襟被拽住了，下个准备阶段开始时跳过出牌阶段和弃牌阶段" },
	},
	spchijie: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		usable: 1,
		filter(event, player) {
			return event.player !== player && event.targets.length === 1;
		},
		check(event, player) {
			return get.effect(player, event.card, event.player, player) < 0;
		},
		async content(event, trigger, player) {
			const result = await player
				.judge({
					judge(card) {
						return get.number(card) > 6 ? 2 : 0;
					},
					judge2(result) {
						return result.bool;
					},
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			trigger.targets.length = 0;
			trigger.getParent().triggeredTargets2.length = 0;
			trigger.cancel();
		},
	},
	//糜夫人
	spcunsi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.isTurnedOver();
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			await player.turnOver();
			const card = get.cardPile(card => card.name === "sha");
			if (card) {
				await target.gain({
					cards: [card],
					animate: "gain2",
				});
			}
			target.addSkill("spcunsi2");
			target.addMark("spcunsi2", 1, false);
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					const card = { name: "sha", isCard: true };
					if (
						!target.hasSkillTag("nogain") &&
						game.hasPlayer(
							current =>
								get.attitude(target, current) < 0 &&
								!current.hasShan() &&
								target.canUse(card, current) &&
								!current.hasSkillTag("filterDamage", null, {
									player: target,
									card: card,
									jiu: true,
								}) &&
								get.effect(current, card, target) > 0
						)
					) {
						return 4;
					}
					return 0;
				},
			},
		},
	},
	spcunsi2: {
		charlotte: true,
		trigger: { player: "useCard1" },
		firstDo: true,
		forced: true,
		popup: false,
		onremove: true,
		sourceSkill: "spcunsi",
		filter(event, player) {
			return event.card.name === "sha";
		},
		async content(event, trigger, player) {
			trigger.baseDamage += player.countMark("spcunsi2");
			player.removeSkill("spcunsi2");
		},
		marktext: "嗣",
		intro: {
			content: "下一张【杀】的伤害+#",
		},
	},
	spguixiu: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			if (typeof event.spguixiu === "boolean" && !event.spguixiu) {
				return false;
			}
			return player.isTurnedOver();
		},
		async content(event, trigger, player) {
			await player.turnOver();
		},
		group: ["spguixiu_draw", "spguixiu_count"],
		subSkill: {
			count: {
				trigger: { player: "damageBegin2" },
				lastDo: true,
				silent: true,
				async content(event, trigger, player) {
					event.spguixiu = player.isTurnedOver();
				},
			},
			draw: {
				trigger: { player: "turnOverAfter" },
				forced: true,
				filter(event, player) {
					return !player.isTurnedOver();
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	//那个男人的舅舅
	heji: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		direct: true,
		locked: false,
		filter(event, player) {
			if (event.targets.length !== 1 || event.targets[0] === player || event.targets[0].isDead()) {
				return false;
			}
			if (event.card.name !== "juedou" && (event.card.name !== "sha" || get.color(event.card) !== "red")) {
				return false;
			}
			if (_status.connectMode && player.countCards("h") > 0) {
				return true;
			}
			return player.hasSha() || player.hasUsableCard("juedou");
		},
		clearTime: true,
		async content(event, trigger, player) {
			await player
				.chooseToUse(
					(card, player, event, ...args) => {
						let name = get.name(card);
						if (name !== "sha" && name !== "juedou") {
							return false;
						}
						return lib.filter.cardEnabled(card, player, event, ...args);
					},
					`合击：是否对${get.translation(trigger.targets[0])}使用一张【杀】或【决斗】？`
				)
				.set("logSkill", "heji")
				.set("complexSelect", true)
				.set("filterTarget", (card, player, target, ...args) => {
					if (target !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled(card, player, target, ...args);
				})
				.set("sourcex", trigger.targets[0])
				.set("addCount", false);
		},
		group: "heji_gain",
		subSkill: {
			gain: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card.isCard && event.getParent(2).name === "heji";
				},
				async content(event, trigger, player) {
					const card = get.cardPile2(card => get.color(card, false) === "red", "random");
					if (card) {
						await player.gain(card, "gain2");
					}
				},
			},
		},
		mod: {
			aiOrder(player, card, num) {
				if (get.name(card, player) === "sha" && get.color(card, player) === "red") {
					return num + 0.6 * (_status.event.name === "chooseToUse" && player.hasHistory("useCard", evt => evt.card.name === "sha" && evt.cards.length === 1) ? 1 : -1);
				}
			},
		},
	},
	//始计篇·智
	refubi: {
		audio: "fubi",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("refubi"),
					filterTarget: lib.filter.notMe,
					ai(target) {
						return 1 + get.attitude(_status.event.player, target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.addMark("refubi", 1);
		},
		intro: {
			content(info, player) {
				let str = "已获得“辅弼”标记";
				if (player.storage.refubi_effect0) {
					str = `${str}；本回合使用【杀】的次数上限+${player.storage.refubi_effect0}`;
				}
				if (player.storage.refubi_effect1) {
					str = `${str}；本回合的0手牌上限+${player.storage.refubi_effect1 * 3}`;
				}
				return str;
			},
		},
		marktext: "弼",
		group: "refubi_buff",
		subSkill: {
			buff: {
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					return event.player !== player && event.player.hasMark("refubi");
				},
				async cost(event, trigger, player) {
					const target = trigger.player;
					const name = get.translation(target);
					const result = await player
						.chooseControl({
							controls: ["cancel2"],
							choiceList: [`令${name}本回合使用【杀】的次数上限+1`, `令${name}本回合的手牌上限+3`],
							ai() {
								const player = _status.event.player;
								const target = _status.event.getTrigger().player;
								if (get.attitude(player, target) <= 0) {
									return "cancel2";
								}
								if (!target.hasJudge("lebu") && target.countCards("h", card => get.name(card, target) === "sha" && target.hasValueTarget(card)) > target.getCardUsable("sha")) {
									return 0;
								}
								return 1;
							},
						})
						.forResult();
					event.result = {
						bool: result.control !== "cancel2",
						targets: [target],
						cost_data: {
							skill: `refubi_effect${result.index}`,
						},
					};
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					const { skill } = event.cost_data;
					target.addTempSkill(skill);
					target.addMark(skill, 1, false);
					game.log(target, ["本回合使用【杀】的次数上限+1", "本回合的手牌上限+3"][result.index]);
				},
			},
			effect0: {
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name === "sha") {
							return num + player.countMark("refubi_effect0");
						}
					},
				},
			},
			effect1: {
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + 3 * player.countMark("refubi_effect1");
					},
				},
			},
		},
	},
	rezuici: {
		audio: "zuici",
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type === "phase" || (event.type === "dying" && player === event.dying)) {
				return player.isDamaged() && player.hasCards("e");
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###罪辞###选择废除一个有牌的装备栏，然后回复2点体力，并可移动“辅弼”标记。");
			},
			chooseControl(event, player) {
				const list = [];
				for (let i = 1; i < 6; i++) {
					if (player.getEquips(i).length > 0) {
						list.push(`equip${i}`);
					}
				}
				list.push("cancel2");
				return list;
			},
			check(event, player) {
				if (player.hp > 1 && player.getDamagedHp() < 2) {
					return "cancel2";
				}
				const cards = player.getCards("e").sort((a, b) => get.value(a) - get.value(b));
				const sub = get.subtype(cards[0], false);
				if (player.hp < 1) {
					return sub;
				}
				const val = get.value(cards[0]);
				if (val < 0) {
					return sub;
				}
				return val < 4 ? sub : "cancel2";
			},
			backup(result) {
				const next = get.copy(lib.skill.rezuicix);
				next.position = result.control;
				return next;
			},
		},
		ai: {
			order: 2.7,
			result: {
				player: 1,
			},
			save: true,
			skillTagFilter(player, tag, arg) {
				return player === arg;
			},
		},
	},
	rezuicix: {
		audio: "zuici",
		sourceSkill: "rezuici",
		async content(event, trigger, player) {
			await player.disableEquip(lib.skill.rezuici_backup.position);
			await player.recover(2);
			let hasRefubi = false;
			let hasTarget = false;
			for (const current of game.players) {
				if (current.hasMark("refubi")) {
					hasRefubi = true;
				} else if (current !== player) {
					hasTarget = true;
				}
				if (hasRefubi && hasTarget) {
					break;
				}
			}
			if (!hasRefubi || !hasTarget) {
				return;
			}
			const result = await player
				.chooseTarget({
					prompt: "是否转移“辅弼”标记？",
					filterTarget(card, player, target) {
						return target !== player && !target.hasMark("refubi");
					},
					ai(target) {
						const player = get.player();
						const attitude = get.attitude(player, target);
						return Math.min(attitude, attitude - get.event().preatt);
					},
				})
				.set(
					"preatt",
					get.attitude(
						player,
						game.findPlayer(current => current.hasMark("refubi"))
					)
				)
				.forResult();
			if (!result.bool) {
				return;
			}
			const target = result.targets[0];
			player.line(target, "group");
			for (const current of game.filterPlayer()) {
				const num = current.countMark("refubi");
				if (num) {
					current.removeMark("refubi", 1, false);
				}
			}
			target.addMark("refubi", 1);
		},
		ai: {
			result: {
				player: 1,
			},
		},
	},
	reshengxi: {
		audio: "shengxi",
		audioname: ["feiyi"],
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		preHidden: true,
		filter(event, player) {
			return !player.getHistory("sourceDamage").length;
		},
		async content(event, trigger, player) {
			await player.draw(2);
		},
	},
	fyjianyu: {
		initSkill(skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					marktext: "喻",
					intro: {
						markcount: () => 1,
						content: "指定另一名有“喻”的角色为目标时，其摸一张牌",
					},
				};
				lib.translate[skill] = "谏喻";
				lib.translate[`${skill}_bg`] = "喻";
			}
		},
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.countPlayer(current => !current.hasMark(`fyjianyu_${player.playerid}`)) > 1;
		},
		round: 1,
		filterTarget(card, player, target) {
			return !target.hasMark(`fyjianyu_${player.playerid}`);
		},
		selectTarget: 2,
		async content(event, trigger, player) {
			const target = event.target;
			const skill = `fyjianyu_${player.playerid}`;
			game.broadcastAll(lib.skill.fyjianyu.initSkill, skill);
			player.addTempSkill("fyjianyu_draw", { player: "phaseBegin" });
			target.addMark(skill, 1);
		},
		ai: {
			order: 0.1,
			result: {
				target(player, target) {
					if (!ui.selected.targets.length) {
						return target === player ? 1 : 0;
					}
					if (get.attitude(player, target) < 0) {
						return -1.6 * (1 + target.countCards("h", card => target.hasValueTarget(card) && get.effect(player, card, target, target) > 0) * Math.sqrt(target.countCards("h")));
					}
					return 0.3 * (1 + target.countCards("h", card => target.hasValueTarget(card) && get.effect(player, card, target, target) > 0) * Math.sqrt(target.countCards("h")));
				},
			},
		},
		subSkill: {
			draw: {
				audio: "fyjianyu",
				charlotte: true,
				trigger: { global: "useCardToPlayer" },
				filter(event, player) {
					if (!event.player.isPhaseUsing()) {
						return false;
					}
					return event.player !== event.target && event.player.hasMark(`fyjianyu_${player.playerid}`) && event.target.hasMark(`fyjianyu_${player.playerid}`) && event.target.isIn();
				},
				forced: true,
				logTarget: "target",
				async content(event, trigger, player) {
					await trigger.target.draw();
				},
				onremove(player) {
					game.countPlayer(current => {
						let num = current.countMark(`fyjianyu_${player.playerid}`);
						if (num) {
							current.removeMark(`fyjianyu_${player.playerid}`);
						}
					});
				},
			},
		},
	},
	spwanwei: {
		audio: 2,
		enable: "chooseToUse",
		round: 1,
		filter(event, player) {
			if (player.hp < 1) {
				return false;
			}
			if (event.type === "dying") {
				return event.dying !== player;
			}
			if (event.type !== "phase") {
				return false;
			}
			return game.hasPlayer(current => current !== player && current.isDamaged());
		},
		filterTarget(card, player, target) {
			if (_status.event.type === "dying") {
				return target === _status.event.dying;
			}
			return player !== target && target.isDamaged();
		},
		selectTarget() {
			if (_status.event.type === "dying") {
				return -1;
			}
			return 1;
		},
		prompt(event, player) {
			const num = player.getHp();
			if (event.type === "dying") {
				const target = event.dying;
				return `令${get.translation(target)}回复${Math.max(num + 1, 1 - target.hp)}点体力，然后你失去${num}点体力`;
			}
			return `令一名其他角色回复${num + 1}点体力（至少回复至1），然后你失去${num}点体力`;
		},
		manualConfirm: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = player.getHp();
			await target.recover(Math.max(num + 1, 1 - target.hp));
			await player.loseHp(num);
		},
		ai: {
			save: true,
			skillTagFilter(player, tag, target) {
				return player !== target;
			},
			expose: 0.5,
			order: 6,
			result: {
				target(player, target) {
					if (get.attitude(player, target) < 4) {
						return 0;
					}
					if ((!player.hasSkill("spyuejian") || player.countCards("he") < 2) && !player.hasCards("hs", card => player.canSaveCard(card, player))) {
						return 0;
					}
					if (_status.event.type !== "dying") {
						const num = player.getHp();
						if (target.getDamagedHp() < 2) {
							return 0;
						}
						return Math.max(num + 1, 1 - target.hp);
					}
					return 1;
				},
			},
		},
	},
	spyuejian: {
		mod: {
			maxHandcardBase(player) {
				return player.maxHp;
			},
		},
		locked: false,
		audio: 2,
		trigger: { player: "dying" },
		filter(event, player) {
			return player.countCards("he") > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("he", 2, get.prompt(event.skill), "弃置两张牌，然后回复1点体力", "chooseonly")
				.set("ai", card => 1 / Math.max(0.1, get.value(card)))
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			await player.recover();
		},
	},
	spwuku: {
		audio: 2,
		trigger: { global: "useCard" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			if (get.type(event.card) !== "equip") {
				return false;
			}
			let gz = get.mode() === "guozhan";
			if (gz && event.player.isFriendOf(player)) {
				return false;
			}
			return player.countMark("spwuku") < (gz ? 2 : 3);
		},
		async content(event, trigger, player) {
			player.addMark("spwuku", 1);
		},
		marktext: "库",
		intro: {
			content: "mark",
		},
		ai: {
			combo: "spmiewu",
			threaten: 3.6,
		},
	},
	spsanchen: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.countMark("spwuku") > 2;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recover();
			player.addSkills("spmiewu");
		},
		ai: {
			combo: "spwuku",
		},
		derivation: "spmiewu",
	},
	spmiewu: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countMark("spwuku") || !player.countCards("hse") || player.hasSkill("spmiewu_used")) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (!["basic", "trick", "delay"].includes(info[0])) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (!["basic", "trick", "delay"].includes(info[0])) {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("灭吴", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type !== "phase") {
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
					filterCard: true,
					audio: "spmiewu",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					log: false,
					async precontent(event, trigger, player) {
						player
							.when({ player: ["useCardAfter", "respondAfter"] })
							.filter(evt => evt.getParent() === event.getParent())
							.step(async (event, trigger, player) => {
								await player.draw();
							});
						player.addTempSkill("spmiewu_used");
						player.logSkill("spmiewu");
						player.removeMark("spwuku", 1);
					},
				};
			},
			prompt(links, player) {
				return `将一张牌当做${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}使用`;
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			const type = get.type2(name);
			return ["basic", "trick"].includes(type) && player.countMark("spwuku") > 0 && !player.hasSkill("spmiewu_used");
		},
		ai: {
			combo: "spwuku",
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countMark("spwuku") || !player.countCards("hse") || player.hasSkill("spmiewu_used")) {
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
		subSkill: {
			backup: {},
			used: { charlotte: true },
		},
	},
	qinzheng: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		forced: true,
		filter(event, player) {
			let num = player.getAllHistory("useCard").length + player.getAllHistory("respond").length;
			return num % 3 === 0 || num % 5 === 0 || num % 8 === 0;
		},
		async content(event, trigger, player) {
			let num = player.getAllHistory("useCard").length + player.getAllHistory("respond").length;
			let cards = [];
			if (num % 3 === 0) {
				const card = get.cardPile2(card => card.name === "sha" || card.name === "shan");
				if (card) {
					cards.push(card);
				}
			}
			if (num % 5 === 0) {
				const card = get.cardPile2(card => ["tao", "jiu", "zong", "xionghuangjiu"].includes(card.name));
				if (card) {
					cards.push(card);
				}
			}
			if (num % 8 === 0) {
				const card = get.cardPile2(card => ["juedou", "wuzhong", "zengbin", "sadouchengbing", "dongzhuxianji", "tongzhougongji"].includes(card.name));
				if (card) {
					cards.push(card);
				}
			}
			if (cards.length) {
				player.gain(cards, "gain2");
			}
		},
		group: "qinzheng_count",
		intro: {
			content(num) {
				let str = "<li>总次数：";
				str += num;
				str += "<br><li>杀/闪：";
				str += num % 3;
				str += "/3<br><li>桃/酒：";
				str += num % 5;
				str += "/5<br><li>决斗/无中生有：";
				str += num % 8;
				str += "/8";
				return str;
			},
		},
	},
	qinzheng_count: {
		trigger: { player: ["useCard1", "respond"] },
		silent: true,
		firstDo: true,
		noHidden: true,
		sourceSkill: "qinzheng",
		async content(event, trigger, player) {
			player.storage.qinzheng = player.getAllHistory("useCard").length + player.getAllHistory("respond").length;
			player.markSkill("qinzheng");
		},
	},
	spqiai: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCards("he", card => get.type(card) !== "basic");
		},
		filterCard(card) {
			return get.type(card) !== "basic";
		},
		position: "he",
		filterTarget: lib.filter.notMe,
		delay: false,
		discard: false,
		lose: false,
		check(card) {
			const player = _status.event.player;
			if (get.position(card) === "e" && card.name === "jinhe") {
				return 10;
			}
			if (player.isHealthy()) {
				return 7 - get.value(card);
			}
			return 9 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			await player.give(cards, target, true);
			if (!target.isIn()) {
				return;
			}
			if (player.isHealthy()) {
				await player.draw(2);
				return;
			}
			const result = await target
				.chooseControl({
					choiceList: [`令${get.translation(player)}回复1点体力`, `令${get.translation(player)}摸两张牌`],
				})
				.forResult();
			if (result.index === 0) {
				await player.recover();
				return;
			}
			await player.draw(2);
		},
		ai: {
			order: 8,
			result: {
				player: 1,
				target(player, target) {
					if (ui.selected.cards.length) {
						const card = ui.selected.cards[0];
						const val = get.value(card, target);
						if (val < 0) {
							return -1;
						}
						if (target.hasSkillTag("nogain")) {
							return 0;
						}
						const useval = target.getUseValue(card);
						if (val < 1 || useval <= 0) {
							return 0.1;
						}
						return Math.sqrt(useval);
					}
					return 0;
				},
			},
		},
	},
	spshanxi: {
		audio: 2,
		init(player) {
			game.addGlobalSkill("spshanxi_bj");
		},
		onremove(player) {
			if (!game.hasPlayer(current => current.hasSkill("spshanxi", null, null, false), true)) {
				game.removeGlobalSkill("spshanxi_bj");
			}
		},
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current !== player && !current.hasMark("spshanxi"));
		},
		async cost(event, trigger, player) {
			let eff = 0;
			const target = game.findPlayer(current => current !== player && current.hasMark("spshanxi"));
			if (target) {
				eff = -get.attitude(player, target) / Math.sqrt(Math.max(1, target.hp));
			}
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("spshanxi"),
					prompt2: "令一名其他角色获得“檄”",
					filterTarget(card, player, target) {
						return target !== player && !target.hasMark("spshanxi");
					},
					ai(target) {
						return -get.attitude(_status.event.player, target) / Math.sqrt(Math.max(1, target.hp)) - eff;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			for (const current of game.filterPlayer()) {
				if (current === target) {
					current.addMark("spshanxi", 1);
					continue;
				}
				const num = current.countMark("spshanxi");
				if (num > 0) {
					current.removeMark("spshanxi", num);
				}
			}
		},
		marktext: "檄",
		intro: {
			name2: "檄",
			content: "已被设下索命檄文",
		},
		group: "spshanxi_suoming",
		ai: { threaten: 3.3 },
	},
	spshanxi_suoming: {
		audio: "spshanxi",
		trigger: { global: "recoverAfter" },
		forced: true,
		sourceSkill: "spshanxi",
		filter(event, player) {
			return event.player.hasMark("spshanxi") && event.player.hp > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			if (target.countCards("he") < 2) {
				await target.loseHp();
				return;
			}
			const result = await target
				.chooseCard({
					prompt: `交给${get.translation(player)}两张牌，或失去1点体力`,
					selectCard: 2,
					position: "he",
					ai(card) {
						return 9 - get.value(card);
					},
				})
				.forResult();
			if (!result.bool || !result.cards?.length) {
				await target.loseHp();
				return;
			}
			await target.give(result.cards, player);
		},
	},
	spshanxi_bj: {
		trigger: { player: "dieAfter" },
		sourceSkill: "spshanxi",
		filter(event, player) {
			for (const i of game.players) {
				if (i.hasSkill("spshanxi_suoming", null, null, false)) {
					return false;
				}
			}
			return true;
		},
		silent: true,
		forceDie: true,
		charlotte: true,
		async content(event, trigger, player) {
			game.removeGlobalSkill("spshanxi_bj");
		},
		ai: {
			effect: {
				target(card, player, target) {
					const suoming = game.findPlayer(current => current.hasSkill("spshanxi_suoming"));
					if (suoming && _status.event && target === _status.event.dying && target.hasMark("spshanxi")) {
						if (target.countCards("he") < 2) {
							return "zerotarget";
						}
						return [1, get.attitude(target, suoming) > 0 ? 0 : -1.2];
					}
				},
			},
		},
	},
	shameng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			let hs = player.getCards("h");
			if (hs.length < 2) {
				return false;
			}
			let red = 0;
			let black = 0;
			for (const i of hs) {
				if (get.color(i, player) === "red") {
					red++;
				} else {
					black++;
				}
				if (red > 1 || black > 1) {
					return true;
				}
			}
			return false;
		},
		complexCard: true,
		selectCard: 2,
		filterCard(card, player) {
			if (ui.selected.cards.length) {
				return get.color(card, player) === get.color(ui.selected.cards[0], player);
			}
			let color = get.color(card, player);
			return player.countCards("h", cardx => cardx !== card && color === get.color(cardx, player)) > 0;
		},
		filterTarget: lib.filter.notMe,
		check(card) {
			return 7 - get.value(card);
		},
		position: "h",
		async content(event, trigger, player) {
			const target = event.target;
			await target.draw(2);
			await player.draw(3);
		},
		ai: {
			order: 6,
			result: { target: 2 },
		},
	},
	fubi: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		skillAnimation: true,
		animationColor: "wood",
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("fubi"),
					filterTarget: lib.filter.notMe,
					ai(target) {
						return get.attitude(_status.event.player, target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.addSkill("fubi2");
			target.storage.fubi2.push(player);
		},
	},
	fubi2: {
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		mod: {
			maxHandcard(player, num) {
				const list = player.getStorage("fubi2");
				for (const i of list) {
					if (i.isIn()) {
						num += 3;
					}
				}
				return num;
			},
		},
		mark: true,
		intro: { content: "若$存活，则手牌上限+3" },
	},
	zuici: {
		audio: 2,
		trigger: { player: "dying" },
		filter(event, player) {
			return player.hasCards("e");
		},
		async cost(event, trigger, player) {
			const types = player
				.getCards("e")
				.map(card => get.subtype(card))
				.toUniqued();
			types.push("cancel2");
			const result = await player
				.chooseControl({
					prompt: get.prompt2("zuici"),
					controls: types,
				})
				.forResult();
			event.result = {
				bool: result.control !== "cancel2",
				cost_data: {
					type: result.control,
				},
			};
		},
		async content(event, trigger, player) {
			const { type } = event.cost_data;
			await player.disableEquip(type);
			if (player.hp < 1) {
				await player.recover(1 - player.hp);
			}
		},
	},
	jianzhan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.jianzhan.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			if (target === player) {
				return false;
			}
			if (ui.selected.targets.length) {
				const targetx = ui.selected.targets[0];
				return targetx !== target && targetx.countCards("h") > target.countCards("h") && targetx.inRange(target);
			}
			const num = target.countCards("h");
			return game.hasPlayer(current => current !== target && current !== player && current.countCards("h") < num && target.inRange(current));
		},
		selectTarget: 2,
		complexTarget: true,
		targetprompt: ["出杀", "被出杀"],
		multitarget: true,
		async content(event, trigger, player) {
			const targets = event.targets;
			if (!targets[0].canUse("sha", targets[1])) {
				await player.draw();
				return;
			}
			const result = await targets[0]
				.chooseControl({
					choiceList: [`视为对${get.translation(targets[1])}使用一张【杀】`, `令${get.translation(player)}摸一张牌`],
					ai() {
						const effect = get.effect(targets[1], { name: "sha", isCard: true }, targets[0], targets[0]);
						if (effect > 0) {
							return 0;
						}
						if (effect < 0 || get.attitude(targets[0], player) > 1) {
							return 1;
						}
						return 0;
					},
				})
				.forResult();
			if (result.index === 0) {
				await targets[0].useCard({
					card: get.autoViewAs({ name: "sha", isCard: true }),
					targets: [targets[1]],
					addCount: false,
				});
				return;
			}
			await player.draw();
		},
		ai: {
			result: {
				target(player, target) {
					if (ui.selected.targets.length) {
						const from = ui.selected.targets[0];
						return get.effect(target, { name: "sha" }, from, target);
					}
					const effs = [0, 0];
					for (const current of game.filterPlayer()) {
						if (current !== target && target.canUse("sha", current)) {
							const effect = get.effect(current, { name: "sha" }, target, target);
							if (effect > effs[0]) {
								effs[0] = effect;
							}
							if (effect < effs[1]) {
								effs[1] = effect;
							}
						}
					}
					return effs[get.attitude(player, target) > 0 ? 0 : 1];
				},
			},
			order: 8.5,
			expose: 0.2,
		},
	},
	duoji: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		filter(event, player) {
			return player.countCards("h") > 1 && game.hasPlayer(current => current !== player && current.countGainableCards(player, "e") > 0);
		},
		filterCard: true,
		selectCard: 2,
		filterTarget(card, player, target) {
			return target !== player && target.countGainableCards(player, "e") > 0;
		},
		check(card) {
			return 8 - get.value(card);
		},
		position: "h",
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.target;
			const cards = target.getGainableCards(player, "e");
			await player.gain(cards, target, "give", "bySelf");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					let num = 0;
					let es = target.getCards("e");
					let val = 0;
					for (const i of es) {
						num += get.value(i, target);
					}
					for (const i of ui.selected.cards) {
						val += get.value(i, player);
					}
					if (Math.abs(num) > val) {
						return -num;
					}
					return 0;
				},
			},
		},
	},
};

export default skills;
