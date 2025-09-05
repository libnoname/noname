import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "huodong",
		connect: true,
		card: {
			//见好就收
			jianhao: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget(card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				toself: true,
				modTarget: true,
				async content(event, trigger, player) {
					const { target } = event;
					const gain = [];
					let num,
						choice,
						putback = false;
					do {
						const {
							cards: [card],
						} = await game.cardsGotoOrdering(get.cards());
						const numx = get.number(card, false);
						gain.push(card);
						await target.showCards(card, get.translation(target) + "使用了【见好就收】");
						if (gain.length > 1) {
							if ((choice == "大于" && numx > num) || (choice == "小于" && numx < num)) {
								num = numx;
							} else {
								putback = true;
								target.popup("杯具");
								break;
							}
						} else {
							num = numx;
						}
						const str = get.strNumber(numx);
						const choices = ["大于" + str, "小于" + str];
						if (gain.length > 1) {
							choices.push("cancel2");
						}
						const { result } = await target
							.chooseControl(choices)
							.set("prompt", "见好就收：猜测下一张牌的点数大于或小于，或者取消获得所有展示过的牌")
							.set("ai", () => {
								if (get.event().gain.length > 2) {
									return "cancel2";
								}
								return get.event().num < 7 ? 0 : 1;
							})
							.set("gain", gain)
							.set("num", numx);
						if (result.control == "cancel2") {
							await target.gain(gain, "gain2");
							break;
						} else {
							choice = result.index == 0 ? "大于" : "小于";
							target.popup(choice, "water");
							game.log(target, "猜测", "#y" + choice);
						}
					} while (true);
					if (putback) {
						while (gain.length) {
							ui.cardPile.insertBefore(gain.pop().fix(), ui.cardPile.firstChild);
						}
					}
				},
				ai: {
					wuxie(target, card, player, viewer) {
						if (target.countCards("h") * Math.max(target.hp, 5) > 6) {
							return 0;
						}
					},
					basic: {
						order: 7,
						useful: 4.5,
						value(card, player) {
							if (player.hp > 2) {
								return 9.2;
							}
							return 9.2 - 0.7 * Math.min(3, player.countCards("hs"));
						},
					},
					result: {
						target: 1,
					},
				},
			},
			//望梅止渴
			wangmei: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: true,
				async content(event, trigger, player) {
					const { target } = event;
					target.addTempSkill(`${event.name}_skill`, { player: "phaseAfter" });
				},
				ai: {
					wuxie(target, card, player, viewer) {
						if (target.countCards("h", { suit: "club" }) > 0 && target.isDamaged()) {
							return 0;
						}
					},
					basic: {
						order: 7,
						useful: 2.5,
						value(card, player) {
							if (player.isDamaged()) {
								return 8.5;
							}
							return 7.2;
						},
					},
					result: {
						target: 1,
					},
				},
			},
			//至死方休
			zhisi: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				manualConfirm: true,
				filterTarget(card, player, target) {
					return target == player && player.maxHp > 1;
				},
				selectTarget: -1,
				toself: true,
				modTarget(card, player, target) {
					return target.maxHp > 1;
				},
				async content(event, trigger, player) {
					const { target } = event;
					const num = target.maxHp - 1;
					if (!num) {
						return;
					}
					await target.loseMaxHp(num);
					const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true });
					for (let i = 0; i < Math.min(9, num); i++) {
						if (!target.hasUseTarget(card, true, false) || !target?.isIn()) {
							break;
						}
						const result = await target.chooseUseTarget(`###是否使用${get.translation(card)}###当前次数：${i + 1 + "/" + Math.min(9, num)}`, card, false).forResult();
						if (!result?.bool) {
							break;
						}
					}
				},
				ai: {
					wuxie(target, card, player, viewer) {
						const cardx = get.autoViewAs({ name: "sha", nature: "fire", isCard: true });
						if (target.maxHp - 1 > 2 && target.hasValueTarget(cardx, true, false)) {
							return 0;
						}
					},
					basic: {
						order: 7,
						useful: 2,
						value(card, player) {
							if (player.getDamagedHp() >= 2) {
								return 8 - player.hp;
							}
							return 1;
						},
					},
					result: {
						target(player, target) {
							const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true });
							if (target.getDamagedHp() > 2 && target.hasValueTarget(card, true, false)) {
								return target.getDamagedHp();
							}
							return 0;
						},
					},
				},
			},
			//青蒜
			qingsuan: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				global: ["qingsuan_record"],
				filterTarget(card, player, target) {
					return player.getStorage("qingsuan_record").includes(target);
				},
				async content(event, trigger, player) {
					const { target } = event;
					const num = get.rand(0, 2);
					player.popup(num, "fire");
					await target.damage(num);
				},
				ai: {
					wuxie(target, card, player, viewer) {
						if (Math.random() > 0.5) {
							return 0;
						}
					},
					basic: {
						order: 6,
						useful: 2,
						value: 7,
					},
					result: {
						target(player, target) {
							return get.damageEffect(target, player, target);
						},
					},
					tag: {
						damage: 0.75,
					},
				},
			},
			//火上浇油
			jiaoyou: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				reverseOrder: true,
				global: ["jiaoyou_skill"],
				async content(event, trigger, player) {
					if (!_status.postReconnect.jiaoyou) {
						_status.postReconnect.jiaoyou = [
							function (list) {
								for (const tag of list) {
									if (!lib.skill[tag]) {
										lib.skill[tag] = {};
										lib.translate[tag] = "浇油+" + tag.slice(7);
									}
								}
							},
							[],
						];
					}
					const { target } = event;
					const cards = target.getCards("h", card => get.tag(card, "damage") > 0.5),
						name = event.name;
					if (cards.length) {
						await target.showCards(cards);
						for (const card of cards) {
							let tag = card.gaintag?.find(tag => tag.startsWith(name));
							if (tag) {
								target.removeGaintag(tag, [card]);
							}
							tag = tag ? name + parseFloat(parseInt(tag.slice(name.length)) + 1) : "jiaoyou1";
							_status.postReconnect.jiaoyou[1].add(tag);
							if (!lib.skill[tag]) {
								game.broadcastAll(
									(tag, str) => {
										lib.skill[tag] = {};
										lib.translate[tag] = "浇油+" + str;
									},
									tag,
									tag.slice(name.length)
								);
							}
							target.addGaintag([card], tag);
						}
					}
				},
				ai: {
					wuxie() {
						return 0;
					},
					order: 9,
					useful: 2.5,
					value: 7.5,
					result: {
						target: 1,
					},
				},
			},
			//好运
			haoyun: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget(card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				toself: true,
				modTarget: true,
				async content(event, trigger, player) {
					const cards = [];
					const { target } = event;
					while (true) {
						const result = await target
							.chooseControl("black", "red")
							.set("prompt", `好运：选择一种颜色，然后开始判定。如果颜色为你选择的颜色，你获得此牌且重复此流程。`)
							.set("ai", () => (Math.random() > 0.4 ? "black" : "red"))
							.forResult();
						if (result?.control) {
							const color = result.control;
							game.log(player, "选择了", "#y" + color);
							player.popup(color);
							const judgeEvent = target.judge(card => {
								if (get.color(card) == get.event().haoyun_color) {
									return 1.5;
								}
								return -1.5;
							});
							judgeEvent.set("haoyun_color", color);
							judgeEvent.judge2 = result => result.bool;
							judgeEvent.set("callback", async event => {
								if (event.judgeResult.color == event.getParent().haoyun_color) {
									event.getParent().orderingCards.remove(event.card);
								}
							});
							judgeEvent.set("clearArena", false);
							const resultx = await judgeEvent.forResult();
							if (resultx?.bool && resultx?.card) {
								cards.push(resultx.card);
							} else {
								game.broadcastAll(ui.clear);
								break;
							}
						}
					}
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
				},
				ai: {
					wuxie(target, card, player, viewer) {
						if (target.countCards("h") * Math.max(target.hp, 5) > 6) {
							return 0;
						}
					},
					basic: {
						order: 7,
						useful: 3,
						value(card, player) {
							if (player.hp > 2) {
								return 7;
							}
							return 7 - 0.5 * Math.min(3, player.countCards("hs"));
						},
					},
					result: {
						target: 1,
					},
				},
			},
			//义父
			//时光时光曼些巴，不要再让你变牢了
			yifu: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				allowMultiple: false,
				filterTarget(card, player, target) {
					if ((get.mode() == "versus" && _status.mode == "two") || get.mode() == "doudizhu") {
						return player.isFriendOf(target) && player != target;
					}
					return player != target;
				},
				modTarget(card, player, target) {
					return player != target;
				},
				//爆改自 谋陈琳【邀作】
				chooseBool(sons, current) {
					const next = current.chooseBool();
					next.set("prompt", "孩子，你是否想成为" + get.translation(sons.find(son => son != current)) + "的义父");
					next.set("choice", true);
					next.set("_global_waiting", true);
					return next;
				},
				async content(event, trigger, player) {
					const targets = [player, event.target];
					let humans = targets.filter(current => current === game.me || current.isOnline());
					let locals = targets.slice(0).randomSort();
					locals.removeArray(humans);
					const eventId = get.id();
					const send = (sons, current, eventId) => {
						lib.card.yifu.chooseBool(sons, current, eventId);
						game.resume();
					};
					event._global_waiting = true;
					let time = 10000;
					let fathers = [];
					if (lib.configOL && lib.configOL.choose_timeout) {
						time = parseInt(lib.configOL.choose_timeout) * 1000;
					}
					targets.forEach(current => current.showTimer(time));
					if (humans.length > 0) {
						const solve = (result, chooser) => {
							if (result && result.bool) {
								fathers.add(chooser);
							}
						};
						await Promise.all(
							humans.map(current => {
								return new Promise((resolve, reject) => {
									if (current.isOnline()) {
										current.send(send, targets, current);
										current.wait((result, player) => {
											solve(result, player);
											resolve(void 0);
										});
									} else if (current == game.me) {
										const next = lib.card.yifu.chooseBool(targets, current);
										const solver = (result, player) => {
											solve(result, player);
											resolve(void 0);
										};
										if (_status.connectMode) {
											game.me.wait(solver);
										}
										return next.forResult().then(result => {
											if (_status.connectMode) {
												game.me.unwait(result, current);
											} else {
												solver(result, current);
											}
										});
									}
								});
							})
						);
					}
					if (locals.length > 0) {
						for (const current of locals) {
							const result = await lib.card.yifu.chooseBool(targets, current).forResult();
							if (result && result.bool) {
								fathers.add(current);
							}
						}
					}
					delete event._global_waiting;
					for (const i of targets) {
						i.hideTimer();
						if (fathers.some(key => i == key)) {
							i.popup("抢义父", "fire");
						} else {
							i.popup("不抢", "wood");
						}
					}
					await game.delayx();
					if (!fathers.length) {
						return;
					}
					const first = fathers[0];
					if (first && first.isIn()) {
						game.log(first, "第一个抢到了“义父”标记");
						const son = targets.find(targetx => targetx != first);
						await game.delayx();
						game.log(first, "成为了", son, "的义父");
						game.log(son, "成为了", first, "的义子");
						first.addTempSkill("yifu_skill", "neverEnd");
						first.markAuto("yifu_skill", son);
						son.markAuto("yifu_skill_son", first);
					}
				},
				//ai照搬富贵
				ai: {
					wuxie() {
						return Math.random() > 0.5;
					},
					order: 7,
					useful: 3.5,
					value: 6.5,
					result: {
						player: 1,
					},
				},
			},
			//两肋插刀
			//营养师神器了
			chadaox: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				notarget: true,
				async content(event, trigger, player) {
					player.$fullscreenpop("兄弟抱一下！", "fire");
					game.addGlobalSkill("chadaox_skill");
				},
				ai: {
					order: 1,
					useful: 2.5,
					value: 6,
					result: {
						player: 1,
					},
					tag: {
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//天雷
			//妙脆角快乐牌
			tianlei: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				multitarget: true,
				multiline: true,
				async content(event, trigger, player) {
					let { targets } = event;
					targets = targets.filter(target => target.canAddJudge({ name: "shandian" })).sortBySeat();
					if (targets.length) {
						for (const target of targets) {
							const card = game.createCard("shandian", "heart", 7);
							const cards = [card];
							target.$draw(card);
							await game.asyncDelayx();
							await target.addJudge(get.autoViewAs(card, cards), cards);
						}
					}
				},
				//ai缝合浮雷和烈火
				ai: {
					wuxie() {
						return Math.random() > 0.75;
					},
					basic: {
						order: 1,
						useful: 0,
						value: 0,
					},
					result: {
						target(player, target) {
							return lib.card.shandian.ai.result.target(player, target);
						},
					},
					tag: {
						damage: 0.25,
						natureDamage: 0.25,
						thunderDamage: 0.25,
					},
				},
			},
			//烈火
			liehuo: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				/*selectTarget: -1,
				filterTarget: lib.filter.notMe,
				reverseOrder: true,
				multitarget: true,
				multiline: true,*/
				notarget: true,
				async content(event, trigger, player) {
					const targets = game.filterPlayer(target => target.countCards("h")).sortBySeat();
					player.line(targets);
					const chooseEvent = player
						.chooseCardOL(targets, "烈火：请选择一张手牌", true)
						.set("ai", function (card) {
							return Math.random();
						})
						.set("source", player);
					chooseEvent.aiCard = function (target) {
						const hs = target.getCards("h");
						return { bool: true, cards: [hs.randomGet()] };
					};
					chooseEvent._args.remove("glow_result");
					const result = await chooseEvent.forResult();
					if (!targets.includes(player)) {
						return;
					}
					let card = result[targets.indexOf(player)]?.cards[0],
						damage = [];
					if (!card) {
						return;
					}
					for (let i = 0; i < targets.length; i++) {
						const color = get.color(result[i].cards[0], targets[i]);
						if (targets[i] != player) {
							if (color == get.color(card, player)) {
								damage.push(targets[i]);
							}
						}
						targets[i].popup(color);
					}
					if (damage.length) {
						await player.modedDiscard(card);
						player.line(damage, "fire");
						for (const target of damage.sortBySeat()) {
							await target.damage("fire");
						}
					}
				},
				ai: {
					wuxie() {
						return Math.random() > 0.75;
					},
					order: 7,
					useful: 2,
					value: 6.5,
					result: {
						target: -1,
					},
					tag: {
						damage: 1,
						fireDamage: 1,
						natureDamage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//神兵
			shenbing: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				reverseOrder: true,
				async contentBefore(event, trigger, player) {
					const evt = event.getParent();
					if (!evt.shenbing) {
						const result = await player
							.chooseControl("弃置牌", "使用牌")
							.set("prompt", `神兵：令目标弃置装备区所有牌或依次使用牌堆不用副类型的装备牌各一张。`)
							.set("ai", () => (Math.random() > 0.5 ? "弃置牌" : "使用牌"))
							.forResult();
						if (result?.control) {
							evt.shenbing = result.control == "弃置牌" ? "discard" : "useCard";
						}
					}
				},
				async content(event, trigger, player) {
					const evt = event.getParent(),
						{ target } = event;
					if (evt.shenbing == "discard") {
						const cards = target.getCards("e");
						if (cards.length) {
							await target.modedDiscard(cards);
						}
					}
					if (evt.shenbing == "useCard") {
						for (let i = 1; i < 6; i++) {
							if (!target.hasEnabledSlot(i)) {
								return;
							}
							const card = get.cardPile2(function (card) {
								return get.subtype(card) == "equip" + i && target.canUse(card, target);
							});
							if (card) {
								await target.chooseUseTarget(card, true, "nothrow", "nopopup");
							}
						}
					}
				},
				ai: {
					wuxie() {
						return 0;
					},
					order: 7,
					useful: 1.5,
					value: 6.5,
					result: {
						player: 1,
					},
					tag: {
						multitarget: 1,
					},
				},
			},
			//金铙
			jinnao: {
				global: ["jinnao_skill"],
				enable: true,
				fullskin: true,
				type: "trick",
				toself: true,
				filterTarget(card, player, target) {
					if (get.mode() == "versus" && _status.mode == "two") {
						return player.isFriendOf(target) && player != target;
					}
					return player != target;
				},
				/*changeTarget(player, targets) {
					targets.push(player);
				},*/
				modTarget(card, player, target) {
					return player != target;
				},
				async content(event, trigger, player) {
					player.addMark("jinnao_skill");
					event.target.addMark("jinnao_skill");
				},
				ai: {
					wuxie() {
						return Math.random() > 0.5;
					},
					order: 5,
					useful: 1.5,
					value: 6.2,
					result: {
						target: 1,
					},
				},
			},
			//鹰狼
			yinglang: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				reverseOrder: true,
				async content(event, trigger, player) {
					event.target.addTempSkill("yinglang_skill", "roundStart");
				},
				ai: {
					wuxie() {
						return 0;
					},
					order: 9,
					useful: 2.5,
					value: 8.5,
					result: {
						target: 1,
					},
				},
			},
			//有福同享
			youfu: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget(card, player, target) {
					if (get.mode() == "versus" && _status.mode == "two") {
						return player.isFriendOf(target) && player != target;
					}
					return player != target;
				},
				modTarget(card, player, target) {
					return player != target;
				},
				async content(event, trigger, player) {
					player.addTempSkill("youfu_skill", ["phaseBefore", "phaseChange", "phaseAfter"]);
					player.markAuto("youfu_skill", event.target);
				},
				ai: {
					wuxie() {
						return Math.random() > 0.5;
					},
					order: 8,
					useful: 0.5,
					value: 5,
					result: {
						target: 1,
					},
				},
			},
			//富贵
			fugui: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget(card, player, target) {
					if (get.mode() == "versus" && _status.mode == "two") {
						return player.isFriendOf(target) && player != target;
					}
					return player != target;
				},
				modTarget(card, player, target) {
					return player != target;
				},
				async content(event, trigger, player) {
					const { target } = event;
					target
						.when({
							player: "gainAfter",
							global: "loseAsyncAfter",
						})
						.assign({
							firstDo: true,
						})
						.filter(evt => evt.getg(target)?.length)
						.then(() => {
							sourcex.draw(trigger.getg(player)?.length);
						})
						.vars({
							sourcex: player,
						});
				},
				ai: {
					wuxie() {
						return Math.random() > 0.5;
					},
					order: 7,
					useful: 1.5,
					value: 6.5,
					result: {
						player: 1,
					},
				},
			},
			//躺赢狗！
			tangying: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget(card, player, target) {
					if (get.mode() == "versus" && _status.mode == "two") {
						return player.isFriendOf(target) && player != target;
					}
					return player != target;
				},
				modTarget(card, player, target) {
					return player != target;
				},
				async content(event, trigger, player) {
					const { target } = event;
					for (const phase of lib.phaseName) {
						const evt = event.getParent(phase);
						if (evt?.name === phase && !evt.finished) {
							//不触发cancelled时机
							evt.cancel(true, null, true);
							break;
						}
					}
					const evt = event.getParent("phase", true);
					if (evt) {
						game.log(evt.player, "结束了回合");
						evt.num = evt.phaseList.length;
						evt.goto(11);
					}
					await player.turnOver();
					if (player == game.me && !_status.auto) {
						ui.click.auto();
					} else if (player.isOnline2() && !player.isAuto) {
						player.send(ui.click.auto);
					}
					target.when({ player: "phaseBegin" }).step(async (event, trigger, player) => {
						const result = await player
							.chooseControl("摸牌阶段", "出牌阶段")
							.set("prompt", "躺赢：选择要执行的额外阶段")
							.set("ai", () => {
								const player = get.player();
								return player.countCards("hs", card => player.hasValueTarget(card)) < 2 ? "摸牌阶段" : "出牌阶段";
							})
							.forResult();
						if (result?.control) {
							const name = result.control == "摸牌阶段" ? "phaseDraw" : "phaseUse";
							trigger.phaseList.splice(trigger.num, 0, `${name}|${event.name}`);
						}
					});
				},
				ai: {
					wuxie() {
						return Math.random() > 0.5;
					},
					order: 1,
					useful: 0.5,
					value: 5,
					result: {
						target: 1,
					},
				},
			},
			//大师
			dashi: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				//singleCard: true,
				filterTarget(card, player, target) {
					if (!ui.selected.targets.length) {
						return player != target;
					}
					return ui.selected.targets.concat([target]).some(target => target.countCards("h")) && player != target;
				},
				selectTarget: 2,
				/*filterAddedTarget(card, player, target, preTarget) {
					return target != preTarget && target != player && [target, preTarget].some(current => current.countCards("h"));
				},*/
				multicheck(card, player) {
					return game.hasPlayer(current => {
						return (
							current != player &&
							game.hasPlayer(currentx => {
								return currentx != player && currentx != current && [currentx, current].some(target => target.countCards("h"));
							})
						);
					});
				},
				complexSelect: true,
				complexTarget: true,
				multitarget: true,
				async content(event, trigger, player) {
					const { targets } = event;
					if (targets.length < 2) {
						return;
					}
					targets[0].swapHandcards(targets[1]);
				},
				ai: {
					order: 6,
					useful: 1.2,
					value: 7,
					result: {
						target(player, target) {
							const list = [];
							let targets = ui.selected.targets.slice();
							//const num = player.countCards("he");
							const players = game.filterPlayer();
							if (targets.length == 0) {
								for (let i = 0; i < players.length; i++) {
									if (players[i] != player && get.attitude(player, players[i]) > 3) {
										list.push(players[i]);
									}
								}
								list.sort(function (a, b) {
									return a.countCards("h") - b.countCards("h");
								});
								if (target == list[0]) {
									return get.attitude(player, target);
								}
								return -get.attitude(player, target);
							} else {
								const from = ui.selected.targets[0];
								for (let i = 0; i < players.length; i++) {
									if (players[i] != player && get.attitude(player, players[i]) < 1) {
										list.push(players[i]);
									}
								}
								list.sort(function (a, b) {
									return b.countCards("h") - a.countCards("h");
								});
								if (from.countCards("h") >= list[0]?.countCards("h")) {
									return -get.attitude(player, target);
								}
								for (let i = 0; i < list.length && from.countCards("h") < list[i].countCards("h"); i++) {
									const count = list[i].countCards("h") - from.countCards("h");
									if (count < 2 && from.countCards("h") >= 2) {
										return -get.attitude(player, target);
									}
									if (target == list[i]) {
										return get.attitude(player, target);
									}
									return -get.attitude(player, target);
								}
							}
						},
					},
					tag: {
						multitarget: 1,
						norepeat: 1,
					},
				},
			},
			//武圣归来
			guilai: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				deadTarget: true,
				filterTarget(card, player, target) {
					if (get.mode() == "versus" && _status.mode == "two") {
						return player.isFriendOf(target) && player != target && target.isDead();
					}
					return player != target && target.isDead();
				},
				modTarget(card, player, target) {
					return player != target && target.isDead();
				},
				async content(event, trigger, player) {
					const { target } = event;
					if (!target.isDead()) {
						return;
					}
					await target.reviveEvent();
					await target.draw(3);
				},
				ai: {
					order: 10,
					useful: 3.5,
					value: 7.5,
					result: {
						target: 1,
					},
				},
			},
			//新杀的劝酒
			khquanjiux: {
				global: ["khquanjiux_skill"],
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				notarget: true,
				wuxieable: false,
				async content(event, trigger, player) {
					const targets = game.filterPlayer().sortBySeat();
					player.line(targets);
					for (const target of targets) {
						const num = get.rand(1, target.countCards("h"));
						const cards = target.getCards("h").randomGets(num);
						if (!cards.length) {
							continue;
						}
						target.addGaintag(cards, "khquanjiux_tag");
						cards.forEach(card => {
							game.broadcastAll(card => {
								if (!card.storage?.khquanjiux) {
									card.storage.khquanjiux = [card.suit, card.number, card.name, card.nature];
								}
								card.init([card.suit, card.number, "jiu"]);
								//改回原来的牌名
								/*card.destroyed = (card, position, player, event) => {
									if (card.storage?.khquanjiux) {
										card.init(card.storage.khquanjiux);
										delete card.storage.khquanjiux;
									}
									return false;
								};*/
							}, card);
						});
					}
					let target;
					while (true) {
						target = target?.getNext() || player;
						if (!target?.isIn()) {
							continue;
						}
						const { result } = await target
							.chooseToRespond("劝酒：打出一张【酒】否则受到每名其他角色造成的一点伤害", function (card) {
								return get.name(card) == "jiu";
							})
							.set("ai", () => 114514);
						/*.set("ai1", () => 114514)
							.set("ai2", function () {
								return get.effect_use.apply(this, arguments) - get.event("effect") + 114514;
							})
							.set(
								"effect",
								game.filterPlayer(current => current != target).reduce((eff, current) => eff + get.damageEffect(target, current, target), 0)
							)
							.set("addCount", false);*/
						if (!result?.bool) {
							const damage = game.filterPlayer2(current => current != target).sortBySeat();
							if (damage.length) {
								while (damage.length && target.isIn()) {
									const current = damage.shift();
									if (current.isIn()) {
										current.line(target, "yellow");
										await target.damage(current);
									}
								}
							}
							break;
						}
					}
				},
				ai: {
					order: 1,
					useful: 3,
					value: 7.5,
					result: {
						player: 1,
					},
					tag: {
						damage: 0.2,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//你死我活 —— by 点点
			nisiwohuo: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				notarget: true,
				wuxieable: false,
				global: "nisiwohuo_end",
				async content(event, trigger, player) {
					player.$skill(get.translation(event.name), null, "thunder", null, "shen_jiaxu");
					await game.delayx();
					const targets = game.filterPlayer2(target => target != player).sortBySeat();
					player.line(targets.filter(target => target.isIn()));
					game.broadcastAll(event => {
						if (!_status.nisiwohuo) {
							_status.nisiwohuo = [];
						}
						_status.nisiwohuo.push(event);
					}, event);
					let count = 0;
					const goon = function () {
						if (!_status.nisiwohuo?.includes(event)) {
							return false;
						}
						return true;
					};
					let target = player;
					while (goon() && count < 100) {
						count++;
						target = target.getNext();
						if (!target?.isIn() || target == player) {
							continue;
						}
						const { result } = await target
							.chooseToUse(
								"你死我活：对距离为1的角色使用一张【杀】或失去1点体力",
								function (card) {
									if (get.name(card) != "sha") {
										return false;
									}
									return lib.filter.filterCard.apply(this, arguments);
								},
								function (card, player, target) {
									if (player == target) {
										return false;
									}
									const dist = get.distance(player, target);
									if (dist > 1) {
										if (
											game.hasPlayer(function (current) {
												return current != player && get.distance(player, current) < dist;
											})
										) {
											return false;
										}
									}
									return lib.filter.filterTarget.apply(this, arguments);
								}
							)
							.set("ai2", function () {
								return get.effect_use.apply(this, arguments) - get.event("effect");
							})
							.set("effect", get.effect(target, { name: "losehp" }, target, target))
							.set("addCount", false);
						if (!goon()) {
							break;
						}
						if (!result?.bool) {
							await target.loseHp();
							await game.delayx();
							if (!goon()) {
								break;
							}
						}
					}
				},
				ai: {
					order: 1,
					useful: 5.5,
					value: 10,
					result: {
						player: 1,
					},
					tag: {
						//damage: 0.5,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//无天无界照搬无中ai
			wutian: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				toself: true,
				filterTarget(card, player, target) {
					return target == player;
				},
				modTarget: true,
				async content(event, trigger, player) {
					const next = get.info("olzhouxi").content(event, trigger, event.target);
					if (next) {
						await next;
					}
				},
				//用的无中的ai改的
				ai: {
					wuxie(target, card, player, viewer) {
						if (get.attitude(viewer, player._trueMe || player) > 0) {
							return 0;
						}
					},
					basic: {
						order: 7,
						useful: 3.5,
						value: 9.5,
					},
					result: {
						target: 2,
					},
				},
			},
			//兄弟齐心ai修改自推心置腹
			qixin: {
				audio: true,
				fullskin: true,
				enable: true,
				type: "trick",
				filterTarget: lib.filter.notMe,
				modTarget: lib.filter.notMe,
				async content(event, trigger, player) {
					const target = event.target,
						cards1 = player.getCards("h"),
						cards2 = target.getCards("h");
					if (!cards1.length && !cards2.length) {
						return;
					}
					await game
						.loseAsync({
							lose_list: [
								[player, cards1],
								[target, cards2],
							],
						})
						.setContent("chooseToCompareLose");
					const result = await target
						.chooseToMove("兄弟同心：请分配" + get.translation(player) + "和你的手牌", true, "allowChooseAll")
						.set("list", [
							[get.translation(player) + "获得的牌", cards1],
							["你获得的牌", cards2],
						])
						.set("processAI", function (list) {
							const player = get.player(),
								target = get.event().getParent().player,
								att = get.attitude(player, target),
								cards1 = get.event().cards1,
								cardx1 = cards1.filter(card => card.name == "du"),
								cardy1 = cards1.removeArray(cardx1),
								cards2 = get.event().cards2,
								cardx2 = cards2.filter(card => card.name == "du"),
								cardy2 = cards2.removeArray(cardx2);
							switch (get.sgn(att)) {
								case 1: {
									//这里的ai写得很糙
									const cards = cards1.concat(cards2);
									const cardsx = cards.filter(card => 8 - get.value(card, target));
									return [cardsx, cards.removeArray(cardsx)];
								}
								case 0:
								case -1:
									return [cardx1.concat(cardx2), cardy1.concat(cardy2)];
							}
						})
						.set("cards1", cards1)
						.set("cards2", cards2)
						.forResult();
					if (result?.bool && result?.moved?.length) {
						if (result.moved[0]?.length) {
							await player.gain(result.moved[0], "draw");
						}
						if (result.moved[1]?.length) {
							await target.gain(result.moved[1], "draw");
						}
						const num = player.countCards("h") - target.countCards("h");
						if (num > 0) {
							await target.draw();
						} else if (num < 0) {
							await player.draw();
						}
					}
				},
				ai: {
					order: 5,
					tag: {
						loseCard: 1,
						gain: 1,
					},
					wuxie(target, card, player, viewer) {
						if (get.attitude(player, target) > 0 && get.attitude(viewer, player) > 0) {
							return 0;
						}
					},
					result: {
						target(player, target) {
							if (get.attitude(player, target) <= 0) {
								return 0;
							}
							return 1 + target.countCards("h");
						},
					},
				},
			},
			//两肋插刀照搬增兵减灶ai
			chadao: {
				audio: true,
				fullskin: true,
				enable: true,
				type: "trick",
				filterTarget: lib.filter.notMe,
				modTarget: true,
				async content(event, trigger, player) {
					const cards = [];
					while (cards.length < 2) {
						const card = get.cardPile(card => get.tag(card, "damage") > 0.5 && !cards.includes(card));
						if (card) {
							cards.add(card);
						} else {
							break;
						}
					}
					if (cards.length) {
						await event.target.gain(cards, "gain2");
					}
				},
				//增兵减灶的ai
				ai: {
					order: 7,
					useful: 3.5,
					value: 8,
					tag: {
						draw: 2,
					},
					result: {
						target(player, target) {
							if (target.hasJudge("lebu")) {
								return 0;
							}
							return Math.max(1, 2 - target.countCards("h") / 10);
						},
					},
				},
			},
			//劝酒ai不完善
			khquanjiu: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				reverseOrder: true,
				async content(event, trigger, player) {
					const { target } = event;
					const result = await target
						.chooseToUse("劝酒：使用一张【酒】或点数为9的牌，否则失去1点体力", function (card) {
							if (get.name(card) != "jiu" && get.number(card) != "unsure" && get.number(card) != 9) {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						})
						.set("ai2", function () {
							return get.effect_use.apply(this, arguments) - _status.event.effect;
						})
						.set("targetRequired", true)
						.set("effect", get.effect(target, { name: "losehp" }, target, target))
						.set("addCount", false)
						.forResult();
					if (!result.bool) {
						await target.loseHp();
					}
				},
				ai: {
					wuxie(target, card, player, viewer, status) {
						let att = get.attitude(viewer, target),
							eff = get.effect(target, card, player, target);
						if (Math.abs(att) < 1 || status * eff * att >= 0) {
							return 0;
						}
						return 1;
					},
					basic: {
						order: 7.2,
						useful: [5, 1],
						value: 5,
					},
					result: {
						player(player, target) {
							let res = 0,
								att = get.sgnAttitude(player, target);
							res -= att * (0.8 * target.countCards("hs") + 0.6 * target.countCards("e") + 3.6);
							return res;
						},
						target(player, target) {
							return -1;
						},
					},
					tag: {
						respond: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//落井下石改自趁火打劫的ai
			luojing: {
				global: "luojing_skill",
				audio: true,
				fullskin: true,
				type: "trick",
				ai: {
					order: 1,
					useful: 7,
					value: 9,
					result: {
						target: -1,
					},
				},
				filterTarget(card, player, target) {
					return player != target && target.isDying();
				},
				async content(event, trigger, player) {
					const { target } = event;
					player.$skill(get.translation("luojing"), null, get.groupnature(player.group, "raw"));
					const evt = event.getParent("dying");
					if (evt.player == target) {
						evt.set("skipTao", true);
						evt.untrigger();
						game.log(target, "跳过了濒死结算");
					}
					player
						.when({ global: "dieAfter" })
						.filter(evtx => evtx.player == target)
						.then(() => {
							player.draw();
						});
				},
			},
			//红运当头用的树上开花的ai
			hongyun: {
				enable: true,
				fullskin: true,
				type: "trick",
				toself: true,
				filterTarget(card, player, target) {
					return target != player && target.countCards("h");
				},
				changeTarget(player, targets) {
					targets.push(player);
				},
				modTarget: true,
				async content(event, trigger, player) {
					const target = event.target;
					const result = await target
						.chooseToDiscard(`红运当头：是否弃置至多两张牌然后获得等量红桃牌`, [1, 2], "he")
						.set("ai", card => 6 - get.value(card))
						.forResult();
					if (result?.bool && result.cards) {
						const cards = [];
						while (cards.length < result.cards.length) {
							const card = get.cardPile(card => get.suit(card) == "heart" && !cards.includes(card));
							if (card) {
								cards.add(card);
							} else {
								break;
							}
						}
						if (cards.length) {
							await target.gain(cards, "gain2", "log");
						} else {
							target.chat("无事发生");
						}
					}
				},
				//修改树上开花的ai
				ai: {
					wuxie() {
						return 0;
					},
					basic: {
						useful: 3,
						value: 3,
						order: 5,
					},
					result: {
						target(player, target, card) {
							var cards = ui.selected.cards.concat(card.cards || []);
							var num = player.countCards("he", function (card) {
								if (cards.includes(card)) {
									return false;
								}
								return 6 > get.value(card);
							});
							if (!num) {
								return 0;
							}
							if (num < 2) {
								return 0.5;
							}
							return 1.2;
						},
					},
					tag: {
						loseCard: 1,
						discard: 1,
						//norepeat: 1,
					},
				},
			},
			//生死与共改自趁火打劫的ai
			shengsi: {
				global: "shengsi_skill",
				fullskin: true,
				type: "trick",
				filterTarget(card, player, target) {
					return player != target && target.isDying();
				},
				async content(event, trigger, player) {
					const { target } = event;
					player.addSkill("shengsi_debuff");
					player.markAuto("shengsi_debuff", target);
					target.recover(2);
				},
				ai: {
					order: 1,
					useful: 4,
					value: 6,
					result: { target: 1 },
					tag: { recover: 2 },
				},
			},
			//雷公ai不完善
			leigong: {
				global: ["leigong_skill"],
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				reverseOrder: true,
				async content(event, trigger, player) {
					//摩斯码全责
					const target = event.target;
					target
						.when("damageBefore")
						.filter(evt => evt.getParent(event.name) == event && evt.card?.name == "shandian")
						.step(async (evt, trigger, player) => {
							trigger.card = event.card;
						});
					await target.executeDelayCardEffect("shandian");
					/*	cardname = "shandian";
					const VCard = ui.create.card();
					VCard._destroy = true;
					VCard.expired = true;
					const info = lib.card[cardname];
					VCard.init(["", "", cardname, info && info.cardnature]);
					target.$phaseJudge(VCard);
					target.popup(cardname, "thunder");
					const result = await target.judge(VCard).forResult();
					ui.clear();
					VCard.delete();
					if (result.bool == false) {
						await target.damage(3, "thunder", "nosource");
					}*/
				},
				ai: {
					wuxie(target, card, player, viewer, status) {
						let att = get.attitude(viewer, target),
							eff = get.effect(target, card, player, target);
						if (Math.abs(att) < 1 || status * eff * att >= 0) {
							return 0;
						}
						return 1;
					},
					basic: {
						order: 4,
						useful: [5, 1],
						value: 4,
					},
					result: {
						target(player, target) {
							return -1;
						},
					},
					tag: {
						damage: 0.16,
						thunderDamage: 0.16,
						natureDamage: 0.16,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//有难同当照搬铁索ai
			younan: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget(card, player, target) {
					return !target.isLinked();
				},
				reverseOrder: true,
				async content(event, trigger, player) {
					await event.target.link(true);
				},
				//照搬铁索的ai
				ai: {
					wuxie: (target, card, player, viewer, status) => {
						if (status * get.attitude(viewer, player._trueMe || player) > 0 || target.hasSkillTag("noLink") || target.hasSkillTag("nodamage") || target.hasSkillTag("nofire") || target.hasSkillTag("nothunder")) {
							return 0;
						}
						if (get.damageEffect(target, player, viewer, "thunder") >= 0 || get.damageEffect(target, player, viewer, "fire") >= 0) {
							return 0;
						}
						if (target.hp + target.hujia > 2 && target.mayHaveShan(viewer, "use")) {
							return 0;
						}
					},
					basic: {
						order: 7.3,
						useful: 1.2,
						value: 4,
					},
					result: {
						target: (player, target) => {
							if (target.hasSkillTag("link") || target.hasSkillTag("noLink")) {
								return 0;
							}
							let curs = game.filterPlayer(current => {
								if (current.hasSkillTag("noLink") || current.hasSkillTag("nodamage")) {
									return false;
								}
								return !current.hasSkillTag("nofire") || !current.hasSkillTag("nothunder");
							});
							if (curs.length < 2) {
								return 0;
							}
							let f = target.hasSkillTag("nofire"),
								t = target.hasSkillTag("nothunder"),
								res = 0.9;
							if ((f && t) || target.hasSkillTag("nodamage")) {
								return 0;
							}
							if (f || t) {
								res = 0.45;
							}
							if (!f && target.getEquip("tengjia")) {
								res *= 2;
							}
							if (!target.isLinked()) {
								res = -res;
							}
							if (ui.selected.targets.length) {
								return res;
							}
							let fs = 0,
								es = 0,
								att = get.attitude(player, target),
								linkf = false,
								alink = true;
							curs.forEach(i => {
								let atti = get.attitude(player, i);
								if (atti > 0) {
									fs++;
									if (i.isLinked()) {
										linkf = true;
									}
								} else if (atti < 0) {
									es++;
									if (!i.isLinked()) {
										alink = false;
									}
								}
							});
							if (es < 2 && !alink) {
								if (att <= 0 || (att > 0 && linkf && fs < 2)) {
									return 0;
								}
							}
							return res;
						},
					},
					tag: {
						multitarget: 1,
						multineg: 1,
						norepeat: 1,
					},
				},
			},
		},
		skill: {
			qingsuan_record: {
				silent: true,
				charlotte: true,
				trigger: { player: "damageEnd" },
				firstDo: true,
				filter(event, player) {
					return event.source && !player.getStorage("qingsuan_record").includes(event.source);
				},
				async content(event, trigger, player) {
					player.markAuto(event.name, trigger.source);
				},
			},
			jiaoyou_skill: {
				charlotte: true,
				silent: true,
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					if (!event.card) {
						return false;
					}
					const evt = event.getParent("useCard");
					if (evt?.card !== event.card || evt.cards?.length !== 1) {
						return false;
					}
					return player.hasHistory(
						"lose",
						evtx =>
							evtx.getParent() === evt &&
							Object.keys(evtx.gaintag_map).some(i => {
								return evtx.gaintag_map[i].some(tag => tag.startsWith("jiaoyou"));
							})
					);
				},
				async content(event, trigger, player) {
					const skill = "jiaoyou",
						evt = trigger.getParent("useCard");
					const evtx = player.getHistory(
						"lose",
						evtx =>
							evtx.getParent() === evt &&
							Object.keys(evtx.gaintag_map).some(i => {
								return evtx.gaintag_map[i].some(tag => tag.startsWith(skill));
							})
					)[0];
					trigger.num += Object.keys(evtx.gaintag_map).reduce((sum, i) => {
						const tag = evtx.gaintag_map[i].find(tag => tag.startsWith(skill));
						if (tag) {
							sum += parseInt(tag.slice(skill.length));
						}
						return sum;
					}, 0);
				},
			},
			wangmei_skill: {
				charlotte: true,
				mod: {
					cardname(card, player, name) {
						if (get.suit(card, player) == "club") {
							return "tao";
						}
					},
				},
			},
			khquanjiux_skill: {
				charlotte: true,
				silent: true,
				firstDo: true,
				trigger: { player: "loseBefore" },
				filter(event, player) {
					return event.cards?.some(card => card.storage?.khquanjiux?.length);
				},
				async content(event, trigger, player) {
					const cards = trigger.cards.filter(card => card.storage?.khquanjiux?.length);
					game.broadcastAll(cards => {
						cards.forEach(card => {
							if (card.storage?.khquanjiux?.length) {
								card.init(card.storage.khquanjiux);
								delete card.storage.khquanjiux;
							}
						});
					}, cards);
				},
			},
			jinnao_skill: {
				charlotte: true,
				silent: true,
				firstDo: true,
				trigger: { player: "damageBegin3" },
				filter(event, player) {
					return player.hasMark("jinnao_skill");
				},
				async content(event, trigger, player) {
					player.removeMark(event.name, 1);
					trigger.cancel();
				},
				intro: {
					name: "金铙（金）",
					name2: "金",
					content: "mark",
					markcount: "mark",
				},
			},
			yinglang_skill: {
				charlotte: true,
				silent: true,
				firstDo: true,
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.target.countGainableCards(player, "he") && event.target != player;
				},
				async content(event, trigger, player) {
					await player.gainPlayerCard(trigger.target, "he", true);
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (!target || target.countCards("h") || !target.countCards("e")) {
								return;
							}
							const filter = card => get.type(card) == "equip" && get.info(card)?.toself === false;
							if (filter(card) && target.getCards("e").every(cardx => filter(cardx))) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			youfu_skill: {
				popup: false,
				charlotte: true,
				onremove: true,
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (!["basic", "trick"].includes(get.type(event.card))) {
						return false;
					}
					if (!Array.isArray(event.targets) || !event.targets.includes(player)) {
						return false;
					}
					return game.hasPlayer(target => {
						if (!player.getStorage("youfu_skill").includes(target)) {
							return false;
						}
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target);
					});
				},
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(target => {
						if (!player.getStorage("youfu_skill").includes(target)) {
							return false;
						}
						return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
					});
					if (targets.length == 1) {
						const target = targets[0];
						const bool = await player.chooseBool(get.prompt(event.skill, target), "令" + get.translation(target) + "也成为" + get.translation(trigger.card) + "的目标").forResult("bool");
						event.result = { bool: bool, targets: targets };
					} else {
						event.result = await player
							.chooseTarget(
								get.prompt(event.skill),
								"令任意名【有福同享】的目标角色也成为" + get.translation(trigger.card) + "的目标",
								(card, player, target) => {
									const trigger = get.event().getTrigger();
									if (!player.getStorage("youfu_skill").includes(target)) {
										return false;
									}
									return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
								},
								[1, targets.length]
							)
							.set("ai", target => {
								const player = get.player(),
									trigger = get.event().getTrigger();
								return get.effect(target, trigger.card, player, player);
							})
							.forResult();
					}
				},
				async content(event, trigger, player) {
					player.line(event.targets);
					trigger.targets.addArray(event.targets);
					game.log(event.targets, "成为了", trigger.card, "的额外目标");
				},
				mark: true,
				intro: {
					content: "对自己使用基本牌和普通锦囊牌时，可以额外指定 $ 为目标",
				},
			},
			nisiwohuo_end: {
				trigger: { global: "die" },
				firstDo: true,
				silent: true,
				async content(event, trigger, player) {
					game.broadcastAll(() => {
						if (_status.nisiwohuo?.length) {
							delete _status.nisiwohuo;
						}
					});
				},
			},
			luojing_skill: {
				trigger: { global: "dying" },
				firstDo: true,
				silent: true,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					if (!lib.filter.targetEnabled({ name: "luojing" }, player, event.player)) {
						return false;
					}
					if (event.player.hp > 0) {
						return false;
					}
					return player.hasUsableCard("luojing");
				},
				async content(event, trigger, player) {
					player
						.chooseToUse(
							get.prompt("luojing", trigger.player).replace(/发动/, "使用"),
							function (card, player) {
								if (get.name(card) != "luojing") {
									return false;
								}
								return lib.filter.cardEnabled(card, player, "forceEnable");
							},
							-1
						)
						.set("sourcex", trigger.player)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("targetRequired", true);
				},
			},
			shengsi_skill: {
				trigger: { global: "dying" },
				silent: true,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					if (!lib.filter.targetEnabled({ name: "shengsi" }, player, event.player)) {
						return false;
					}
					if (event.player.hp > 0) {
						return false;
					}
					return player.hasUsableCard("shengsi");
				},
				async content(event, trigger, player) {
					player
						.chooseToUse(
							get.prompt("shengsi", trigger.player).replace(/发动/, "使用"),
							function (card, player) {
								if (get.name(card) != "shengsi") {
									return false;
								}
								return lib.filter.cardEnabled(card, player, "forceEnable");
							},
							-1
						)
						.set("sourcex", trigger.player)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("dying", trigger.player)
						.set("targetRequired", true);
				},
			},
			shengsi_debuff: {
				charlotte: true,
				forced: true,
				popup: false,
				intro: {
					content: "你与$生死与共",
				},
				marktext: "生",
				mark: true,
				trigger: { global: "dieAfter" },
				filter(event, player) {
					return player.getStorage("shengsi_debuff").includes(event.player);
				},
				async content(event, trigger, player) {
					player.$skill(get.translation("shengsi"), null, get.groupnature(player.group, "raw"));
					player.unmarkAuto(event.name, trigger.player);
					player.die();
				},
			},
			leigong_skill: {
				silent: true,
				firstDo: true,
				trigger: { player: "useCardEnd" },
				filter(event, player) {
					return event.card.name == "leigong";
				},
				async content(event, trigger, player) {
					const num = game.countPlayer2(target => target.hasHistory("damage", evt => evt.getParent(4) == trigger && evt.notLink()));
					if (num > 0) {
						await player.draw(num);
					}
				},
			},
			chadaox_skill: {
				charlotte: true,
				popup: false,
				trigger: { player: ["damageBegin4", "loseHpBegin"] },
				filter(event, player) {
					return game.hasPlayer(target => {
						if (target == player || !target.isFriendOf(player)) {
							return false;
						}
						return !(event._chadaox_skill_players || []).includes(target);
					});
				},
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(target => {
						if (target == player || !target.isFriendOf(player)) {
							return false;
						}
						return !(trigger._chadaox_skill_players || []).includes(target);
					});
					event.result =
						targets.length > 1
							? await player
									.chooseTarget(
										`两肋插刀：你须选择一名队友替你承受此${trigger.name == "damage" ? "受到伤害" : "失去体力"}的效果`,
										(card, player, target) => {
											const trigger = get.event().getTrigger();
											if (target == player) {
												return false;
											}
											if (!target.isFriendOf(player)) {
												target.prompt("不是队友", "fire");
												return false;
											}
											if ((trigger._chadaox_skill_players || []).includes(target)) {
												target.prompt("已转移过", "orange");
												return false;
											}
											return true;
										},
										true,
										1
									)
									.set("ai", target => get.damageEffect(target, get.event().getTrigger().source, target, get.event().getTrigger().nature))
									.forResult()
							: {
									bool: true,
									targets: targets,
							  };
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill(event.name, target);
					game.log(target, "替", player, `承受了${trigger.name == "damage" ? "受到" : "失去"}的${get.cnNumber(trigger.num)}点${trigger.nature ? get.translation(trigger.nature) + "属性" : ""}${trigger.name == "damage" ? "伤害" : "体力"}`);
					if (!trigger._chadaox_skill_players) {
						trigger._chadaox_skill_players = [];
					}
					trigger._chadaox_skill_players.add(player);
					trigger.player = target;
					/*const dbi = [
						["皇帝的新文案", "皇帝的新文案"],
						["兄啊，有个事情你能不能帮我一下", "死叛恶艹"],
						["替我挡着！", "你咋这么自私呢，呸！"],
						["不好意思了兄弟，没注意，抱歉了", "你都叫兄弟了，那还说啥了，我自己受着得了！"],
						["这扯不扯，你这太性情了哥们", "没事啊，咱们都是弗雷尔卓德队友，没毛病啊"],
						["两角尖尖犹如利剑！", "孩子我啊米诺斯，一德格拉米"],
					];
					const str = dbi.randomGet();
					if (str[1] != "皇帝的新文案") {
						if (str[0] == "替我挡着！") {
							game.playAudio("skill/tianxiang2.mp3");
						}
						player.throwEmotion(target, ["flower", "wine"].randomGet(), false);
						player.chat(str[0]);
						await game.asyncDelayx();
						target.throwEmotion(player, ["egg", "shoe"].randomGet(), false);
						target.chat(str[1]);
					}*/
				},
			},
			yifu_skill: {
				charlotte: true,
				forced: true,
				intro: {
					content: "你是$的义父",
				},
				marktext: "父",
				mark: true,
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getStorage("yifu_skill").includes(event.player) && event.player.countCards("he");
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = trigger.player;
					await target
						.chooseToGive(true, "he", player)
						.set("prompt", "义父：选择一张牌孝敬给" + get.translation(player))
						.forResult();
				},
				subSkill: {
					son: {
						intro: {
							content: "你是$的义子",
						},
						marktext: "子",
						mark: true,
					},
				},
			},
		},
		translate: {
			jianhao: "见好就收",
			jianhao_bg: "收",
			jianhao_info: "出牌阶段，对你使用。你展示牌堆顶一张牌，猜测牌堆顶的下张牌点数大于或小于此牌并展示。若猜对，你可选择一项：1.获得所有展示牌;2.再次猜测",
			wangmei: "望梅止渴",
			wangmei_bg: "梅",
			wangmei_skill: "望梅止渴",
			wangmei_info: "出牌阶段，对一名角色使用。直到该角色的回合结束，他所有梅花手牌均视为【桃】。",
			zhisi: "至死方休",
			zhisi_bg: "休",
			zhisi_info: "出牌阶段，对你使用。目标将体力上限减少至1。每减少一点，可以视为使用一张火【杀】。（最多9张）",
			get qingsuan() {
				return Math.random() > 0.05 ? "清算" : "青蒜";
			},
			qingsuan_bg: "算",
			qingsuan_info: "出牌阶段，对一名对你造成过伤害的角色使用。对其随机造成0~2点伤害。",
			jiaoyou: "火上浇油",
			jiaoyou_skill: "火上浇油",
			jiaoyou_bg: "油",
			jiaoyou_info: "出牌阶段，对所有角色使用。目标依次展示手牌中的伤害牌，这些牌造成的伤害+1直到离开手牌区。",
			haoyun: "好运",
			haoyun_bg: "运",
			haoyun_info: "出牌阶段，对你使用。你选择一种颜色，然后开始判定。如果颜色为你选择的颜色，你获得此牌且重复此流程。",
			liehuo: "烈火",
			liehuo_bg: "烈",
			liehuo_info: "出牌阶段，对所有其他角色使用，令你和目标暗中选择一张手牌，若有角色与你选择的牌颜色相同，你弃置你选择的牌对这些角色各造成一点火焰伤害。",
			shenbing: "神兵",
			shenbing_bg: "兵",
			shenbing_info: "出牌阶段，对所有角色使用，令目标弃置装备区所有牌或依次使用牌堆不用副类型的装备牌各一张。",
			jinnao: "金铙",
			jinnao_skill: "金铙",
			jinnao_bg: "金",
			get jinnao_info() {
				const str = get.mode() == "versus" && _status.mode == "two" ? "一名队友" : "一名其他角色";
				return `出牌阶段，对${str}使用，令你和目标获得一个「金」标记。（当目标受到伤害时，其移去一个「金」防止此伤害）`;
			},
			yinglang: "鹰狼",
			yinglang_skill: "鹰狼",
			yinglang_bg: "鹰",
			yinglang_info: "出牌阶段，对所有角色使用，令目标本轮使用牌指定其他角色为目标后，获得该目标一张牌。",
			youfu: "有福同享",
			youfu_skill: "有福同享",
			youfu_bg: "福",
			get youfu_info() {
				const str = get.mode() == "versus" && _status.mode == "two" ? "一名队友" : "一名其他角色";
				return `出牌阶段，对${str}使用，令你此阶段对自己使用基本牌和普通锦囊牌时，可以额外指定其为目标`;
			},
			fugui: "富贵",
			fugui_bg: "富",
			get fugui_info() {
				const str = get.mode() == "versus" && _status.mode == "two" ? "一名队友" : "一名其他角色";
				return `出牌阶段，对${str}使用，其下次获得牌后你摸等量张牌。`;
			},
			tangying: "躺赢",
			tangying_bg: "躺",
			get tangying_info() {
				const str = get.mode() == "versus" && _status.mode == "two" ? "一名队友" : "一名其他角色";
				return `出牌阶段，你结束当前回合，然后翻面并进入托管状态。令${str}下个回合开始时选择额外执行一个摸牌或出牌阶段。`;
			},
			dashi: "大师",
			dashi_bg: "师",
			dashi_info: "出牌阶段，令两名其他角色交换手牌。",
			guilai: "武圣归来",
			guilai_bg: "归",
			get guilai_info() {
				const str = get.mode() == "versus" && _status.mode == "two" ? "一名队友" : "一名其他角色";
				return `出牌阶段，令${str}复活`;
			},
			khquanjiux: "劝酒",
			khquanjiux_tag: "劝酒",
			khquanjiux_bg: "劝",
			khquanjiux_info: "出牌阶段，对所有角色使用，所有角色手牌随机变成【酒】，然后依次打出一张【酒】，重复此效果直到有角色不使用，该角色受到每名其他角色造成的一点伤害。此牌不能被【无懈可击】响应。",
			nisiwohuo: "你死我活",
			nisiwohuo_end: "你死我活",
			nisiwohuo_bg: "死",
			nisiwohuo_info: "出牌阶段，对其他所有角色使用，令目标依次对距离最近的角色使用一张【杀】，否则失去1点体力，重复效果直至有人死亡。此牌不能被【无懈可击】响应。",
			wutian: "无天无界",
			wutian_bg: "界",
			wutian_info: "出牌阶段，对自己使用，从三个可造成伤害的技能中选择一个获得至你的下回合开始。",
			qixin: "兄弟齐心",
			qixin_bg: "齐",
			qixin_info: "出牌阶段，对一名其他角色使用，令其重新分配你们的手牌，然后你们中手牌较少的角色摸一张牌。",
			chadao: "两肋插刀",
			chadao_bg: "插",
			chadao_info: "出牌阶段，对一名其他角色使用，令其获得两张伤害牌。",
			khquanjiu: "劝酒",
			khquanjiu_bg: "劝",
			khquanjiu_info: "出牌阶段，对所有角色使用，令目标使用一张【酒】或点数为9的牌，不使用牌的角色失去1点体力。",
			luojing: "落井下石",
			luojing_bg: "落",
			luojing_skill: "落井下石",
			luojing_info: "一名其他角色进入濒死状态时，对其使用，结束其濒死结算，其死亡后你摸一张牌。",
			hongyun: "红运当头",
			hongyun_bg: "红",
			hongyun_info: "出牌阶段，对你和一名有手牌的其他角色使用，令你与其各弃置至多两张牌，从牌堆或弃牌堆中获得等量红桃牌。",
			shengsi: "生死与共",
			shengsi_bg: "生",
			shengsi_skill: "生死与共",
			shengsi_debuff: "生死与共",
			shengsi_info: "其他角色濒死时，对其使用，令其回复2点体力，其死亡后你立即死亡。",
			younan: "有难同当",
			younan_bg: "难",
			younan_info: "出牌阶段，对所有未处于连环状态的角色使用，令目标进入连环状态。",
			leigong: "雷公助我",
			leigong_skill: "雷公助我",
			leigong_bg: "雷",
			leigong_info: "出牌阶段，对所有角色使用，令目标依次进行一次【闪电】判定，然后每有一名角色因此受到非传导伤害，你摸一张牌。",
			tianlei: "天雷",
			tianlei_bg: "雷",
			tianlei_info: "出牌阶段，对所有角色使用，目标角色将一张来自游戏外的【闪电】放置于其判定区。",
			chadaox: "两肋插刀",
			chadaox_bg: "插",
			//致敬传奇啥比光环描述
			chadaox_info: "出牌阶段，令场上获得“两肋插刀”光环效果。",
			chadaox_append: "<span style='font-family:yuanli'>当你受到伤害或失去体力时，将此效果转移给一名本次事件中未被选择过的队友（没有则不转移）。</span>",
			chadaox_skill: "两肋插刀",
			chadaox_skill_info: "当你受到伤害或失去体力时，将此效果转移给一名本次事件中未被选择过的队友（没有则不转移）。",
			yifu: "义父",
			yifu_bg: "父",
			get yifu_info() {
				const str = (get.mode() == "versus" && _status.mode == "two") || get.mode() == "doudizhu" ? "一名队友" : "一名其他角色";
				return `出牌阶段，对${str}使用，你和目标同时选择是否成为对方“义父”并获得如下效果：义子的准备阶段开始时，你令其交给你一张牌。（若均选择是则先确定的角色成为“义父”，若均选择否则无事发生）。`;
			},
			yifu_skill: "义父",
			yifu_skill_info: "你的“义子”于准备阶段须交给你一张牌。",
		},
		list: [
			[lib.suit.randomGet(), get.rand(1, 13), "haoyun"],
			[lib.suit.randomGet(), get.rand(1, 13), "haoyun"],

			[lib.suit.randomGet(), get.rand(1, 13), "jiaoyou"],
			[lib.suit.randomGet(), get.rand(1, 13), "jiaoyou"],

			[lib.suit.randomGet(), get.rand(1, 13), "qingsuan"],
			[lib.suit.randomGet(), get.rand(1, 13), "qingsuan"],

			[lib.suit.randomGet(), get.rand(1, 13), "zhisi"],
			[lib.suit.randomGet(), get.rand(1, 13), "zhisi"],

			[lib.suit.randomGet(), get.rand(1, 13), "wangmei"],
			[lib.suit.randomGet(), get.rand(1, 13), "wangmei"],

			[lib.suit.randomGet(), get.rand(1, 13), "jianhao"],
			[lib.suit.randomGet(), get.rand(1, 13), "jianhao"],

			[lib.suit.randomGet(), get.rand(1, 13), "tianlei"],
			[lib.suit.randomGet(), get.rand(1, 13), "tianlei"],

			[lib.suit.randomGet(), get.rand(1, 13), "chadaox"],
			[lib.suit.randomGet(), get.rand(1, 13), "chadaox"],

			[lib.suit.randomGet(), get.rand(1, 13), "yifu"],
			[lib.suit.randomGet(), get.rand(1, 13), "yifu"],

			[lib.suit.randomGet(), get.rand(1, 13), "liehuo"],
			[lib.suit.randomGet(), get.rand(1, 13), "liehuo"],

			[lib.suit.randomGet(), get.rand(1, 13), "shenbing"],
			[lib.suit.randomGet(), get.rand(1, 13), "shenbing"],

			[lib.suit.randomGet(), get.rand(1, 13), "jinnao"],
			[lib.suit.randomGet(), get.rand(1, 13), "jinnao"],

			[lib.suit.randomGet(), get.rand(1, 13), "yinglang"],
			[lib.suit.randomGet(), get.rand(1, 13), "yinglang"],

			[lib.suit.randomGet(), get.rand(1, 13), "youfu"],
			[lib.suit.randomGet(), get.rand(1, 13), "youfu"],

			[lib.suit.randomGet(), get.rand(1, 13), "fugui"],
			[lib.suit.randomGet(), get.rand(1, 13), "fugui"],

			[lib.suit.randomGet(), get.rand(1, 13), "tangying"],
			[lib.suit.randomGet(), get.rand(1, 13), "tangying"],

			[lib.suit.randomGet(), get.rand(1, 13), "guilai"],

			[lib.suit.randomGet(), get.rand(1, 13), "dashi"],
			[lib.suit.randomGet(), get.rand(1, 13), "dashi"],

			["spade", 13, "khquanjiux"],
			["diamond", 13, "khquanjiux"],
			["heart", 13, "khquanjiux"],
			["club", 13, "khquanjiux"],

			["spade", 13, "nisiwohuo"],
			["diamond", 13, "nisiwohuo"],
			["heart", 13, "nisiwohuo"],
			["club", 13, "nisiwohuo"],

			["heart", 13, "wutian"],
			["club", 13, "wutian"],

			["diamond", 11, "qixin"],
			["heart", 11, "qixin"],

			["spade", 10, "chadao"],
			["diamond", 10, "chadao"],
			["heart", 10, "chadao"],
			["club", 10, "chadao"],

			["diamond", 12, "khquanjiu"],
			["heart", 12, "khquanjiu"],

			["heart", 5, "hongyun"],
			["spade", 5, "hongyun"],
			["club", 5, "hongyun"],

			["heart", 7, "luojing"],
			["club", 7, "luojing"],

			["diamond", 4, "shengsi"],
			["heart", 4, "shengsi"],

			["diamond", 8, "leigong"],
			["heart", 8, "leigong"],
			["spade", 8, "leigong"],

			["spade", 6, "younan"],
			["diamond", 6, "younan"],
			["heart", 6, "younan"],
			["club", 6, "younan"],
		],
	};
});
