import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "yingbian",
		connect: true,
		card: {
			suijiyingbian: {
				global: "suijiyingbian_skill",
				fullskin: true,
				type: "trick",
			},
			zhujinqiyuan: {
				type: "trick",
				enable: true,
				audio: true,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("hej") > 0;
				},
				defaultYingbianEffect: "add",
				content: function () {
					var dist = get.distance(player, target);
					if (dist > 1 || card.yingbian_all)
						player
							.discardPlayerCard(target, "hej", true)
							.set("target", target)
							.set("ai", lib.card.guohe.ai.button);
					if (dist <= 1 || card.yingbian_all)
						player
							.gainPlayerCard(target, "hej", true)
							.set("target", target)
							.set("ai", lib.card.shunshou.ai.button);
				},
				fullskin: true,
				postAi: function (targets) {
					return targets.length == 1 && targets[0].countCards("j");
				},
				ai: {
					wuxie: function (target, card, player, viewer, status) {
						if (get.attitude(viewer, player._trueMe || player) > 0) return 0;
						if (
							!card.yingbian_all &&
							get.distance(player, target) > 1 &&
							!target.hasCard((i) => {
								let val = get.value(i, target),
									subtypes = get.subtypes(i);
								if (
									val < 8 &&
									target.hp < 2 &&
									!subtypes.includes("equip2") &&
									!subtypes.includes("equip5")
								)
									return false;
								return val > 3 + Math.min(5, target.hp);
							}, "e") &&
							target.countCards("h") * _status.event.getRand("guohe_wuxie") > 1.57
						)
							return 0;
					},
					yingbian: function (card, player, targets, viewer) {
						if (get.attitude(viewer, player) <= 0) return 0;
						var base = 0;
						if (get.cardtag(card, "yingbian_all")) {
							if (
								targets.some(function (current) {
									var att = get.attitude(player, current);
									if (att <= 0)
										return (
											current.countCards("he", function (card) {
												return get.value(card, current) > 0;
											}) > 1
										);
									return (
										current.countCards("ej", function (card) {
											return get.position(card) == "j" || get.value(card, current) <= 0;
										}) > 1
									);
								})
							)
								base += 6;
						}
						if (get.cardtag(card, "yingbian_add")) {
							if (
								game.hasPlayer(function (current) {
									return (
										!targets.includes(current) &&
										lib.filter.targetEnabled2(card, player, current) &&
										get.effect(current, card, player, player) > 0
									);
								})
							)
								base += 5;
						}
						if (get.cardtag(card, "yingbian_hit")) {
							if (
								game.hasPlayer(function (current) {
									return get.attitude(current, player) < 0 && current.hasWuxie();
								})
							)
								base += 3 * targets.length;
						}
						return base;
					},
					basic: {
						order: 7.5,
						useful: (card, i) => 9.6 / (2 + i),
						value: (card, player) => {
							let max = 0;
							game.countPlayer((cur) => {
								let dist = get.distance(player, cur);
								if (dist > 1 || card.yingbian_all)
									max = Math.max(
										max,
										lib.card.shunshou.ai.result.target(player, cur) *
											get.attitude(player, cur)
									);
								else
									max = Math.max(
										max,
										lib.card.guohe.ai.result.target(player, cur) *
											get.attitude(player, cur)
									);
							});
							if (max <= 0) return 7;
							if (card.yingbian_all) return 0.75 * max;
							return 0.6 * max;
						},
					},
					result: {
						target: function (player, target) {
							var discard = get.distance(player, target) > 1;
							if (get.attitude(player, target) <= 0)
								return target.countCards("he", function (card) {
									return (
										get.value(card, target) > 0 &&
										(discard || card != target.getEquip("jinhe"))
									);
								}) > 0
									? -1.5
									: 1.5;
							var js = target.getCards("j");
							if (js.length && js.some(i => {
								let cardj = i.viewAs ? { name: i.viewAs } : i;
								if (cardj.name == "xumou_jsrg") return false;
								return get.effect(target, cardj, target, player) < 0;
							})) return 3;
							return -1.5;
						},
						player: function (player, target) {
							if (get.distance(player, target) > 1) return 0;
							if (
								get.attitude(player, target) < 0 &&
								!target.countCards("he", function (card) {
									return get.value(card, target) > 0 && card != target.getEquip("jinhe");
								})
							) {
								return 0;
							}
							if (get.attitude(player, target) > 1) {
								var js = target.getCards("j");
								if (js.length && js.some(i => {
									let cardj = i.viewAs ? { name: i.viewAs } : i;
									if (cardj.name == "xumou_jsrg") return false;
									return get.effect(target, cardj, target, player) < 0;
								})) return 1;
								return 0;
							}
							return 1;
						},
					},
					tag: {
						loseCard: 1,
						gain: 1,
					},
				},
			},
			dongzhuxianji: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				toself: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				async content(event, trigger, player) {
					const target = event.target;
					await target.chooseToGuanxing(2);
					await target.draw(2);
				},
				ai: {
					basic: {
						order: 7.2,
						useful: 4.5,
						value: 9.2,
					},
					result: {
						target: 2.5,
					},
					tag: {
						draw: 2,
					},
				},
			},
			chuqibuyi: {
				audio: true,
				enable: true,
				type: "trick",
				fullskin: true,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h") > 0;
				},
				defaultYingbianEffect: "add",
				content: function () {
					"step 0";
					if (player.isDead() || !target.countCards("h")) {
						event.finish();
						return;
					}
					player.choosePlayerCard(target, "h", true);
					"step 1";
					if (result.bool) {
						target.showCards(result.cards);
						if (get.suit(card) != get.suit(result.cards[0])) target.damage();
					}
				},
				ai: {
					basic: {
						order: 5,
						useful: 2,
						value: 6,
					},
					yingbian: function (card, player, targets, viewer) {
						if (get.attitude(viewer, player) <= 0) return 0;
						if (
							game.hasPlayer(function (current) {
								return (
									!targets.includes(current) &&
									lib.filter.targetEnabled2(card, player, current) &&
									get.effect(current, card, player, player) > 0
								);
							})
						)
							return 6;
						return 0;
					},
					result: {
						target: (player, target, card) => {
							//if(typeof card!=='object') return -2;
							let suit = get.suit(card),
								view = player.hasSkillTag("viewHandcard", null, target, true),
								fz = 0,
								fm = 0;
							target.getCards("h", (i) => {
								if (i.isKnownBy(player)) {
									if (suit !== get.suit(i)) {
										if (view || get.is.shownCard(i)) return -2;
										fz++;
										fm++;
									} else if (!view && !get.is.shownCard(i)) fm++;
								} else {
									fz += 0.75;
									fm++;
								}
							});
							if (!fm) return 0;
							return (-2 * fz) / fm;
						},
					},
					tag: {
						damage: 1,
					},
				},
			},
			wuxinghelingshan: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				cardcolor: "diamond",
				distance: { attackFrom: -3 },
				ai: {
					basic: {
						equipValue: 2,
					},
				},
				skills: ["wuxinghelingshan_skill"],
			},
			wutiesuolian: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -2 },
				ai: {
					basic: {
						equipValue: 2,
					},
				},
				skills: ["wutiesuolian_skill"],
			},
			heiguangkai: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				cardcolor: "club",
				ai: {
					basic: {
						equipValue: 2,
					},
				},
				skills: ["heiguangkai_skill"],
			},
			tongque: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				ai: {
					basic: {
						equipValue: 6.5,
					},
				},
				skills: ["tongque_skill"],
			},
			tianjitu: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				cardcolor: "club",
				skills: ["tianjitu_skill"],
				onLose: function () {
					player.addTempSkill("tianjitu_skill_lose");
				},
				loseDelay: false,
				ai: {
					value: function (card, player) {
						if (player.countCards("h") > 3 || get.position(card) != "e") return 0.5;
						return (player.countCards("h") - 4) * 5;
					},
					equipValue: function (card, player) {
						if (player.countCards("h") > 3 || get.position(card) != "e") return 0.5;
						return (player.countCards("h") - 4) * 5;
					},
					basic: {
						equipValue: 0.5,
					},
				},
			},
			taigongyinfu: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				cardcolor: "spade",
				ai: {
					basic: {
						equipValue: 3,
					},
				},
				skills: ["taigongyinfu_skill", "taigongyinfu_link"],
			},
		},
		skill: {
			suijiyingbian_skill: {
				mod: {
					cardname: function (card, player) {
						if (card.name == "suijiyingbian" && player.storage.suijiyingbian)
							return player.storage.suijiyingbian;
					},
					cardnature: function (card, player) {
						if (card.name == "suijiyingbian" && player.storage.suijiyingbian_nature)
							return player.storage.suijiyingbian_nature;
					},
				},
				trigger: {
					player: ["useCard1", "respond"],
					global: "phaseBeginStart",
				},
				silent: true,
				firstDo: true,
				filter: function (event, player, name) {
					if (name == "phaseBeginStart") return true;
					var type = get.type(event.card);
					return type == "basic" || type == "trick";
				},
				content: function () {
					if (event.triggername == "phaseBeginStart") {
						delete player.storage.suijiyingbian;
						delete player.storage.suijiyingbian_nature;
					} else {
						player.storage.suijiyingbian = trigger.card.name;
						player.storage.suijiyingbian_nature = trigger.card.nature;
					}
				},
			},
			wuxinghelingshan_skill: {
				equipSkill: true,
				trigger: { player: "useCard1" },
				filter: function (event, player) {
					return (
						event.card.name == "sha" &&
						lib.linked.some((n) => n != "kami" && game.hasNature(event.card, n))
					);
				},
				audio: true,
				direct: true,
				content: function () {
					"step 0";
					var list = lib.linked.slice(0);
					list.remove("kami");
					list.removeArray(get.natureList(trigger.card));
					list.push("cancel2");
					player
						.chooseControl(list)
						.set("prompt", get.prompt("wuxinghelingshan_skill"))
						.set("prompt2", "将" + get.translation(trigger.card) + "转换为以下属性之一");
					"step 1";
					if (result.control != "cancel2") {
						player.logSkill("wuxinghelingshan_skill");
						player.popup(get.translation(result.control) + "杀", result.control);
						game.log(trigger.card, "被转为了", "#y" + get.translation(result.control), "属性");
						game.setNature(trigger.card, result.control);
					}
				},
			},
			wutiesuolian_skill: {
				trigger: { player: "useCardToPlayered" },
				forced: true,
				equipSkill: true,
				audio: true,
				filter: function (event, player) {
					return event.card.name == "sha" && !event.target.isLinked(); //||event.target.countCards('h'));
				},
				logTarget: "target",
				content: function () {
					var target = trigger.target;
					if (!target.isLinked()) target.link();
					//else player.viewHandcards(target);
				},
			},
			heiguangkai_skill: {
				equipSkill: true,
				trigger: { target: "useCardToTargeted" },
				forced: true,
				audio: true,
				filter: function (event, player) {
					if (event.targets.length < 2) return false;
					if (event.card.name != "sha") {
						var type = get.type(event.card);
						if (type != "trick") return false;
						if (get.color(event.card) != "black" && !get.tag(event.card, "damage")) return false;
					}
					if (player.hasSkillTag("unequip2")) return false;
					if (
						event.player.hasSkillTag("unequip", false, {
							name: event.card ? event.card.name : null,
							target: player,
							card: event.card,
						})
					)
						return false;
					return true;
				},
				content: function () {
					trigger.excluded.add(player);
				},
				global: "heiguangkai_ai",
			},
			tongque_skill: {
				trigger: { player: "yingbian" },
				equipSkill: true,
				forced: true,
				filter: (event, player) =>
					get.is.yingbianConditional(event.card) &&
					player.getHistory("useCard", (evt) => get.is.yingbianConditional(evt.card)).length < 2,
				content: () => {
					trigger.forceYingbian = true;
				},
			},
			tianjitu_skill: {
				audio: true,
				trigger: { player: "equipAfter" },
				forced: true,
				equipSkill: true,
				getIndex(event, player){
					return event.vcards.filter(card => card.name === "tianjitu").length;
				},
				filter: (event, player) => {
					return player.hasCard(card => {
						return !event.cards.includes(card) && lib.filter.cardDiscardable(card, player, "tianjitu_skill");
					}, "he")
				},
				content: () => {
					player.chooseToDiscard(true, (card) => !get.event().getTrigger().cards?.includes(card), "he");
				},
				subSkill: {
					lose: {
						audio: "tianjitu_skill",
						forced: true,
						charlotte: true,
						equipSkill: true,
						trigger: {
							player: "loseAfter",
							global: [
								"equipAfter",
								"addJudgeAfter",
								"gainAfter",
								"loseAsyncAfter",
								"addToExpansionAfter",
							],
						},
						filter: (event, player) => {
							return (player.countCards("h") < 5);
						},
						getIndex(event, player){
							const evt = event.getl(player);
							const lostCards = [];
							evt.es.forEach((card) => {
								const VEquip = evt.vcard_map.get(card);
								if(VEquip.name === "tianjitu") lostCards.add(VEquip);
							});
							return lostCards.length;
						},
						content: function () {
							player.drawTo(5);
						},
					},
				},
			},
			taigongyinfu_skill: {
				equipSkill: true,
				audio: true,
				trigger: { player: "phaseUseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				content: function () {
					"step 0";
					player
						.chooseCard("h", "是否发动【太公阴符】重铸一张手牌？", lib.filter.cardRecastable)
						.set("ai", function (card) {
							return 5 - get.value(card);
						});
					"step 1";
					if (result.bool) {
						player.logSkill("taigongyinfu_skill");
						player.recast(result.cards);
					}
				},
			},
			taigongyinfu_link: {
				audio: "taigongyinfu_skill",
				trigger: { player: "phaseUseBegin" },
				equipSkill: true,
				//filter:function(event,player){
				//	return game.hasPlayer(function(current){
				//		return !current.isLinked();
				//	});
				//},
				direct: true,
				content: function () {
					"step 0";
					player
						.chooseTarget(
							//function(card,player,target){
							//	return !target.isLinked();
							//},
							"是否发动【太公阴符】横置或重置一名角色？"
						)
						.set("ai", function (target) {
							return get.effect(
								target,
								{ name: "tiesuo" },
								_status.event.player,
								_status.event.player
							);
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("taigongyinfu_link", target);
						target.link();
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			_yingbian: {
				trigger: { player: "yingbian" },
				forced: true,
				popup: false,
				ruleSkill: true,
				forceLoad: true,
				filter: (event, player) => {
					if (event.card.yingbian) return false;
					const temporaryYingbian = event.temporaryYingbian || [],
						card = event.card;
					if (temporaryYingbian.includes("force") || get.cardtag(card, "yingbian_force"))
						return true;
					const forceYingbian = event.forceYingbian || player.hasSkillTag("forceYingbian");
					for (const entry of lib.yingbian.condition.simple) {
						const key = entry[0];
						if (
							(temporaryYingbian.includes(key) || get.cardtag(card, `yingbian_${key}`)) &&
							(forceYingbian || entry[1](event))
						)
							return true;
					}
					const complexYingbianConditions = get.complexYingbianConditions();
					return (
						temporaryYingbian.some((value) => complexYingbianConditions.includes(value)) ||
						get.is.complexlyYingbianConditional(card)
					);
				},
				content: () => {
					"step 0";
					event.card = trigger.card;
					event.temporaryYingbian = trigger.temporaryYingbian || [];
					var yingbianConditionSatisfied = false;
					lib.yingbian.condition.simple.forEach((value, key) => {
						if (
							(!event.temporaryYingbian.includes(key) &&
								!get.cardtag(event.card, `yingbian_${key}`)) ||
							!value(trigger)
						)
							return;
						player.popup(`yingbian_${key}_tag`, lib.yingbian.condition.color.get(key));
						if (!yingbianConditionSatisfied) yingbianConditionSatisfied = true;
					});
					if (
						event.temporaryYingbian.includes("force") ||
						get.cardtag(event.card, "yingbian_force") ||
						trigger.forceYingbian ||
						player.hasSkillTag("forceYingbian")
					) {
						player.popup("yingbian_force_tag", lib.yingbian.condition.color.get("force"));
						if (!yingbianConditionSatisfied) yingbianConditionSatisfied = true;
					}
					if (yingbianConditionSatisfied) {
						game.log(player, "触发了", event.card, "的应变条件");
						event.goto(4);
					} else if (
						(event.num = 0) >= (event.yingbianConditions = get.complexYingbianConditions()).length
					)
						event.finish();
					"step 1";
					var yingbianCondition = event.yingbianConditions[num];
					if (
						event.temporaryYingbian.includes(yingbianCondition) ||
						get.cardtag(card, `yingbian_${yingbianCondition}`)
					)
						lib.yingbian.condition.complex.get(yingbianCondition)(trigger);
					else event.goto(3);
					"step 2";
					if (result.bool) event.goto(4);
					"step 3";
					event.num++;
					if (event.num < event.yingbianConditions.length) event.goto(1);
					else event.finish();
					"step 4";
					trigger.card.yingbian = true;
					var yingbianEffectExecuted = false;
					lib.yingbian.effect.forEach((value, key) => {
						if (!event.temporaryYingbian.includes(key) && !get.cardtag(card, `yingbian_${key}`))
							return;
						game.yingbianEffect(trigger, value);
						if (!yingbianEffectExecuted) yingbianEffectExecuted = true;
					});
					if (!yingbianEffectExecuted) {
						var defaultYingbianEffect = get.defaultYingbianEffect(card);
						if (lib.yingbian.effect.has(defaultYingbianEffect)) {
							game.yingbianEffect(trigger, lib.yingbian.effect.get(defaultYingbianEffect));
							if (!yingbianEffectExecuted) yingbianEffectExecuted = true;
						}
					}
					if (yingbianEffectExecuted) player.addTempSkill("yingbian_changeTarget");
				},
			},
			yingbian_changeTarget: {
				trigger: { player: "useCard2" },
				forced: true,
				popup: false,
				charlotte: true,
				filter: function (event, player) {
					if (event.yingbian_removeTarget && event.targets && event.targets.length > 1) return true;
					if (!event.yingbian_addTarget) return false;
					var info = get.info(event.card);
					if (info.allowMultiple == false) return false;
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return (
									!event.targets.includes(current) &&
									lib.filter.targetEnabled2(event.card, player, current) &&
									lib.filter.targetInRange(event.card, player, current)
								);
							})
						) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					if (trigger.yingbian_addTarget)
						player
							.chooseTarget(
								"应变：是否为" + get.translation(trigger.card) + "增加一个目标？",
								function (card, player, target) {
									var trigger = _status.event.getTrigger();
									var card = trigger.card;
									return (
										!trigger.targets.includes(target) &&
										lib.filter.targetEnabled2(card, player, target) &&
										lib.filter.targetInRange(card, player, target)
									);
								}
							)
							.set("ai", function (target) {
								var player = _status.event.player;
								var card = _status.event.getTrigger().card;
								return get.effect(target, card, player, player);
							});
					else event.goto(2);
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						game.log(player, "发动应变效果，令", target, "也成为了", trigger.card, "的目标");
						trigger.targets.add(target);
					}
					"step 2";
					if (trigger.yingbian_removeTarget && trigger.targets.length > 1)
						player
							.chooseTarget(
								"应变：是否为" + get.translation(trigger.card) + "减少一个目标？",
								function (card, player, target) {
									var trigger = _status.event.getTrigger();
									return trigger.targets.includes(target);
								}
							)
							.set("ai", function (target) {
								var player = _status.event.player;
								var card = _status.event.getTrigger().card;
								return -get.effect(target, card, player, player);
							});
					else event.finish();
					"step 3";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						game.log(player, "发动应变效果，将", target, "从", trigger.card, "的目标中移除了");
						trigger.targets.remove(target);
					}
				},
			},
			heiguangkai_ai: {
				ai: {
					effect: {
						player(card, player, target) {
							if (
								typeof card !== "object" ||
								!target ||
								(get.name(card) !== "sha" &&
									(get.type(card) !== "trick" ||
										(get.color(card) !== "black" && !get.tag(card, "damage"))))
							)
								return;
							if (
								!target.hasSkill("heiguangkai_skill") ||
								target.hasSkillTag("unequip2") ||
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
							)
								return;
							let targets = [],
								evt = _status.event.getParent("useCard");
							targets.addArray(ui.selected.targets);
							if (evt && evt.card == card) targets.addArray(evt.targets);
							if (targets.length) {
								if (targets.length > 1 || !targets.includes(target))
									return "zeroplayertarget";
								return;
							}
							let info = get.info(card);
							if (!info || info.notarget || !info.filterTarget) return;
							let range,
								select = get.copy(info.selectTarget),
								filter;
							if (select === undefined) range = [1, 1];
							else if (typeof select === "number") range = [select, select];
							else if (get.itemtype(select) === "select") range = select;
							else if (typeof select === "function") range = select(card, player);
							if (info.singleCard) range = [1, 1];
							game.checkMod(card, player, range, "selectTarget", player);
							if (range[1] < -1) range = [1, 1];
							else if (range[0] < 0) {
								if (info.filterTarget === true) filter = game.players.length;
								else
									filter = game.countPlayer((current) => {
										return info.filterTarget(card, player, current);
									});
								range = [filter, filter];
							}
							if (!range) return;
							if (range[0] > 1 && range[1] > 1) return "zeroplayertarget";
							return [1, 0, 0.7, 0];
						},
					},
				},
			},
		},
		translate: {
			suijiyingbian: "随机应变",
			suijiyingbian_info: "此牌的牌名视为你本回合内使用或打出的上一张基本牌或普通锦囊牌的牌名。",
			zhujinqiyuan: "逐近弃远",
			zhujinqiyuan_info:
				"出牌阶段，对一名有牌的其他角色使用。若你至其距离的大于1，你弃置其区域内的一张牌。若你至其的距离等于1，你获得其区域内的一张牌。",
			dongzhuxianji: "洞烛先机",
			dongzhuxianji_info: "出牌阶段，对包含你在内的一名角色使用。目标角色卜算2，然后摸两张牌。",
			chuqibuyi: "出其不意",
			chuqibuyi_info:
				"出牌阶段，对一名有手牌的其他角色使用。你展示其一张手牌，若此牌与【出其不意】的花色不同，则你对其造成1点伤害。",
			wuxinghelingshan: "五行鹤翎扇",
			wuxinghelingshan_skill: "五行鹤翎扇",
			wuxinghelingshan_info:
				"当你声明使用不为神属性的属性【杀】后，你可将此【杀】的属性改为不为神属性的其他属性。",
			wutiesuolian: "乌铁锁链",
			wutiesuolian_skill: "乌铁锁链",
			wutiesuolian_info: "锁定技，当你使用【杀】指定目标后，若其未横置，则其横置。",
			heiguangkai: "黑光铠",
			heiguangkai_skill: "黑光铠",
			heiguangkai_info:
				"锁定技，当你成为【杀】或伤害类锦囊牌或黑色普通锦囊牌的目标后，若此牌的目标数大于1，则你令此牌对你无效。",
			tongque: "铜雀",
			tongque_skill: "铜雀",
			tongque_info: "锁定技，你于一回合内使用的第一张带有“应变”效果的牌无视条件直接生效。",
			tianjitu: "天机图",
			tianjitu_skill: "天机图",
			tianjitu_info:
				"锁定技，当此牌进入你的装备区时，你弃置一张不为此【天机图】的牌。当此牌离开你的装备区时，你将手牌摸至五张。",
			taigongyinfu: "太公阴符",
			taigongyinfu_info:
				"出牌阶段开始时，你可以横置或重置一名角色。出牌阶段结束时，你可以重铸一张手牌。",
			taigongyinfu_skill: "太公阴符",
			taigongyinfu_link: "太公阴符",
			yingbian_zhuzhan_tag: "助战",
			yingbian_kongchao_tag: "空巢",
			yingbian_fujia_tag: "富甲",
			yingbian_canqu_tag: "残躯",
			yingbian_force_tag: "应变",
			_yingbian: "应变",
			yingbian_changeTarget: "应变",
			yingbian_add_tag: "(目标+)",
			yingbian_remove_tag: "(目标-)",
			yingbian_damage_tag: "(伤害+)",
			yingbian_draw_tag: "(摸牌)",
			yingbian_gain_tag: "(反甲)",
			yingbian_hit_tag: "(强命)",
			yingbian_all_tag: "(双项)",
		},
		list: [
			["spade", 1, "juedou"],
			["spade", 1, "taigongyinfu"],
			["spade", 1, "guding"],
			["spade", 2, "cixiong"],
			["spade", 2, "bagua"],
			["spade", 2, "tengjia"],
			["spade", 2, "suijiyingbian"],
			["spade", 3, "jiu"],
			["spade", 3, "zhujinqiyuan"],
			["spade", 3, "shuiyanqijunx", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["spade", 4, "sha", "thunder"],
			["spade", 4, "guohe"],
			["spade", 4, "shuiyanqijunx", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["spade", 5, "sha", "thunder"],
			["spade", 5, "qinglong"],
			["spade", 5, "jueying"],
			["spade", 6, "sha", "thunder"],
			["spade", 6, "lebu"],
			["spade", 6, "qinggang"],
			["spade", 7, "sha", "ice"],
			["spade", 7, "sha", "ice"],
			["spade", 7, "nanman", null, ["yingbian_fujia", "yingbian_remove"]],
			["spade", 8, "sha", "ice"],
			["spade", 8, "sha", "ice"],
			["spade", 8, "sha", "ice"],
			["spade", 9, "sha", null, ["yingbian_canqu", "yingbian_add"]],
			["spade", 9, "sha", null, ["yingbian_canqu", "yingbian_add"]],
			["spade", 9, "jiu"],
			["spade", 10, "sha"],
			["spade", 10, "sha", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["spade", 10, "bingliang"],
			["spade", 11, "wuxie"],
			["spade", 11, "shunshou"],
			["spade", 11, "tiesuo"],
			["spade", 12, "zhujinqiyuan", null, ["yingbian_fujia", "yingbian_hit"]],
			["spade", 12, "tiesuo"],
			["spade", 12, "zhangba"],
			["spade", 13, "wuxie", null, ["yingbian_kongchao", "yingbian_draw"]],
			["spade", 13, "nanman", null, ["yingbian_fujia", "yingbian_remove"]],
			["spade", 13, "dawan"],

			["heart", 1, "taoyuan", null, ["yingbian_fujia", "yingbian_remove"]],
			["heart", 1, "wanjian", null, ["yingbian_fujia", "yingbian_remove"]],
			["heart", 1, "wuxie"],
			["heart", 2, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["heart", 2, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["heart", 2, "guohe", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["heart", 3, "wugu"],
			["heart", 3, "tao"],
			["heart", 3, "chuqibuyi"],
			["heart", 4, "sha", "fire"],
			["heart", 4, "tao"],
			["heart", 4, "wugu"],
			["heart", 5, "chitu"],
			["heart", 5, "tao"],
			["heart", 5, "qilin"],
			["heart", 6, "tao"],
			["heart", 6, "tao"],
			["heart", 6, "lebu"],
			["heart", 7, "sha", "fire"],
			["heart", 7, "tao"],
			["heart", 7, "dongzhuxianji"],
			["heart", 8, "tao"],
			["heart", 8, "shan"],
			["heart", 8, "dongzhuxianji"],
			["heart", 9, "tao"],
			["heart", 9, "shan"],
			["heart", 9, "dongzhuxianji"],
			["heart", 10, "sha", "fire", ["yingbian_kongchao", "yingbian_damage"]],
			["heart", 10, "sha"],
			["heart", 10, "sha"],
			["heart", 11, "sha"],
			["heart", 11, "shan"],
			["heart", 11, "dongzhuxianji"],
			["heart", 12, "tao"],
			["heart", 12, "shan"],
			["heart", 12, "guohe"],
			["heart", 12, "shandian"],
			["heart", 13, "wuxie", null, ["yingbian_kongchao", "yingbian_gain"]],
			["heart", 13, "shan"],
			["heart", 13, "zhuahuang"],

			["club", 1, "juedou"],
			["club", 1, "zhuge"],
			["club", 1, "huxinjing"],
			["club", 2, "sha", null, ["yingbian_kongchao", "yingbian_add"]],
			["club", 2, "heiguangkai"],
			["club", 2, "tengjia"],
			["club", 2, "renwang"],
			["club", 3, "sha", null, ["yingbian_kongchao", "yingbian_add"]],
			["club", 3, "jiu"],
			["club", 3, "zhujinqiyuan", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["club", 4, "sha", null, ["yingbian_kongchao", "yingbian_add"]],
			["club", 4, "bingliang"],
			["club", 4, "zhujinqiyuan", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["club", 5, "sha"],
			["club", 5, "sha", "thunder"],
			["club", 5, "dilu"],
			["club", 6, "sha"],
			["club", 6, "sha", "thunder"],
			["club", 6, "lebu"],
			["club", 7, "sha"],
			["club", 7, "sha", "thunder"],
			["club", 7, "nanman", null, ["yingbian_fujia", "yingbian_remove"]],
			["club", 8, "sha"],
			["club", 8, "sha", "thunder"],
			["club", 8, "sha"],
			["club", 9, "sha", "thunder"],
			["club", 9, "sha", "thunder"],
			["club", 9, "jiu"],
			["club", 10, "sha", "thunder"],
			["club", 10, "sha", "thunder"],
			["club", 10, "tiesuo"],
			["club", 11, "sha"],
			["club", 11, "sha", null, ["yingbian_canqu", "yingbian_add"]],
			["club", 11, "tiesuo"],
			["club", 12, "wuxie"],
			["club", 12, "tianjitu"],
			["club", 12, "tiesuo"],
			["club", 13, "wuxie", null, ["yingbian_canqu", "yingbian_draw"]],
			["club", 13, "tongque"],
			["club", 13, "tiesuo"],

			["diamond", 1, "juedou"],
			["diamond", 1, "zhuge"],
			["diamond", 1, "wuxinghelingshan"],
			["diamond", 2, "tao"],
			["diamond", 2, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["diamond", 2, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["diamond", 3, "tao"],
			["diamond", 3, "shan"],
			["diamond", 3, "shunshou"],
			["diamond", 4, "sha", "fire", ["yingbian_kongchao", "yingbian_damage"]],
			["diamond", 4, "shan", null, ["yingbian_canqu", "yingbian_gain"]],
			["diamond", 4, "shunshou"],
			["diamond", 5, "sha", "fire"],
			["diamond", 5, "shan"],
			["diamond", 5, "guanshi"],
			["diamond", 6, "sha"],
			["diamond", 6, "shan"],
			["diamond", 6, "shan"],
			["diamond", 7, "sha"],
			["diamond", 7, "shan"],
			["diamond", 7, "shan"],
			["diamond", 8, "sha", null, ["yingbian_canqu", "yingbian_hit"]],
			["diamond", 8, "shan"],
			["diamond", 8, "shan"],
			["diamond", 9, "sha"],
			["diamond", 9, "shan"],
			["diamond", 9, "jiu"],
			["diamond", 10, "sha", "fire"],
			["diamond", 10, "shan"],
			["diamond", 10, "shan"],
			["diamond", 11, "shan"],
			["diamond", 11, "shan"],
			["diamond", 11, "shan"],
			["diamond", 12, "tao"],
			["diamond", 12, "chuqibuyi"],
			["diamond", 12, "wutiesuolian"],
			["diamond", 12, "wuxie"],
			["diamond", 13, "sha"],
			["diamond", 13, "zixin"],
			["diamond", 13, "hualiu"],

			["diamond", 5, "muniu"],
		],
		help: {
			应变篇:
				'<div style="margin:10px">应变机制</div><ul style="margin-top:0">' +
				"<li>当一名角色声明使用右下角标注了应变条件的卡牌后，若其满足应变条件，则其触发此牌的“应变”效果。<br><li>长按或鼠标右键点击卡牌，即可查看此牌所拥有的应变效果。" +
				'<br><li>应变条件<br><ul style="padding-left:20px;padding-top:5px"><li>空巢：该角色声明使用此牌后，其手牌数为0。<br><li>富甲：该角色声明使用此牌后，其手牌数为全场最多或之一。<br><li>残躯：该角色声明使用此牌后，其体力值为1。<br><li>助战：该角色声明使用此牌后，其发起“助战”。其他角色可弃置一张与此牌类型相同的卡牌，响应此“助战”。若有角色响应，则视为其应变成功。</ul></ul>',
		},
	};
});
