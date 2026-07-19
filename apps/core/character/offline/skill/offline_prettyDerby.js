import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//赛马娘
	sm_dayuan: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			if (!player.countCards("h")) {
				return false;
			}
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard: lib.filter.cardDiscardable,
					position: "h",
					filterTarget: lib.filter.notMe,
					prompt: get.prompt2(event.skill),
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						const getE = current => get.recoverEffect(current, player, player) + get.sgnAttitude(player, current);
						return getE(player) + getE(target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			await player.modedDiscard(cards);
			const func = async target => {
				await target.draw();
				if (target.isDamaged()) {
					await target.recover();
				}
			};
			await game.doAsyncInOrder([player, target], func);
			const skill = `${event.name}_effect`;
			player.addTempSkill(skill, "roundStart");
			const map = player.getStorage(skill, new Map());
			if (map.has(target)) {
				map.set(target, map.get(target) + 1);
			} else {
				map.set(target, 1);
			}
			player.setStorage(skill, map, true);
		},
		subSkill: {
			effect: {
				mod: {
					globalFrom(from, to, distance) {
						const map = from.getStorage("sm_dayuan_effect", new Map());
						if (!map.has(to)) {
							return;
						}
						return distance - map.get(to);
					},
					globalTo(from, to, distance) {
						const map = to.getStorage("sm_dayuan_effect", new Map());
						if (!map.has(from)) {
							return;
						}
						return distance - map.get(from);
					},
				},
				charlotte: true,
				onremove: true,
				intro: {
					content(map) {
						if (!map?.size) {
							return "无效果";
						}
						return Array.from(map.keys())
							.map(current => `计算与${get.translation(current)}的距离互相-${map.get(current)}`)
							.join("<br>");
					},
				},
			},
		},
	},
	sm_tianwu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasMark("chixia_jipao");
		},
		manualConfirm: true,
		async content(event, trigger, player) {
			player.removeMark("chixia_jipao", 1, false);
			game.log(player, "消耗了1点", "<span style='color: #42f0f6'>速度</span>");
			const skill = `${event.name}_effect`;
			player.addTempSkill(skill, { global: "phaseAnyAfter" });
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) + 0.1;
			},
			result: {
				player(player) {
					if (player.hasSkill("sm_tianwu_effect")) {
						return 0;
					}
					return player.countCards("hs", card => {
						if (get.type(card) != "basic") {
							return false;
						}
						const targets = game.filterPlayer(current => player.canUse(card, current, true, true));
						if (!targets?.length) {
							return false;
						}
						const getE = current => get.effect(current, card, player, player);
						const getAE = current => {
							let eff = 0;
							const list = [current, current.getNext(), current.getPrevious].toUniqued();
							for (const target of list) {
								if (player.canUse(card, current, current == target, current == target)) {
									eff += getE(current);
								}
							}
							return eff;
						};
						return getAE(targets.maxBy(getAE));
					});
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard1",
				},
				mark: true,
				intro: {
					content: "本阶段使用的下一张基本牌额外指定目标角色的相邻角色为目标",
				},
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return get.type(event.card) == "basic";
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					if (trigger.targets?.length) {
						const targets = game.filterPlayer(current => {
							if (!trigger.targets.containsSome(current.getNext(), current.getPrevious())) {
								return false;
							}
							return lib.filter.targetEnabled2(trigger.card, trigger.player, current);
						});
						if (targets?.length) {
							game.log(targets, "成为了", trigger.card, "的额外目标");
							trigger.targets.addArray(targets);
						}
					}
					player.removeSkill(event.name);
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (get.type(card) != "basic" || _status._inTianwu) {
								return;
							}
							_status._inTianwu = true;
							let eff = 0,
								targets = [target.getNext(), target.getPrevious()].toUniqued();
							if (targets?.length) {
								for (const current of targets) {
									if (player.canUse(card, current, false)) {
										eff += get.effect(current, card, player, player);
									}
								}
							}
							delete _status._inTianwu;
							return [1, eff];
						},
					},
				},
			},
		},
	},
	chixia_jipao: {
		audio: 2,
		transformSkill: true,
		trigger: {
			player: ["damageEnd", "die"],
			source: "damageSource",
		},
		forceDie: true,
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const { name } = event;
			if (trigger.name != "die") {
				player.addMark(name, 1, false);
				game.log(player, "获得了1点", "<span style='color: #42f0f6'>速度</span>");
				return;
			}
			const card = game.createCard2("sm_mabian", "heart", 13);
			const targets = game.filterPlayer(current => {
				return current.canEquip(card, true);
			});
			if (!targets?.length) {
				return;
			}
			const result =
				targets.length > 1
					? await player
							.chooseTarget(
								`${get.translation(name)}：将${get.translation(card)}置入一名角色装备栏`,
								(card, player, target) => {
									return get.event().targetx.includes(target);
								},
								true
							)
							.set("targetx", targets)
							.set("ai", target => {
								const player = get.player();
								if (target == player) {
									return 0;
								}
								return get.attitude(player, target);
							})
							.forResult()
					: {
							bool: true,
							targets: targets,
						};
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.line(target);
				if (target.canEquip(card, true)) {
					await target.equip(card);
				}
			}
		},
		marktext: "⚡",
		intro: {
			name: "速度·赤霞",
			content(storage, player) {
				return `当前速度：${storage}/5`;
			},
		},
		filter(event, player) {
			const num = player.countMark("chixia_jipao");
			if (event.name == "die") {
				return num >= 3;
			}
			return player?.isIn() && num < 5;
		},
	},
	sm_hualiu: {
		audio: 2,
		trigger: {
			player: "phaseDrawBegin2",
		},
		filter(event, player) {
			return !event.numFixed;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num += Math.max(1, player.countMark("qiulin_jipao"));
		},
		mod: {
			globalTo(from, to, distance) {
				return distance + Math.max(1, to.countMark("qiulin_jipao"));
			},
			maxHandcard(player, num) {
				return num + Math.max(1, player.countMark("qiulin_jipao"));
			},
		},
	},
	sm_dianteng: {
		audio: 2,
		trigger: {
			global: "damageSource",
		},
		usable: 1,
		filter(event, player) {
			if (!player.countMark("qiulin_jipao")) {
				return false;
			}
			return event.source?.isIn() && event.source != player;
		},
		check(event, player) {
			return get.attitude(player, event.source) > 0;
		},
		logTarget: "source",
		async content(event, trigger, player) {
			player.removeMark("qiulin_jipao", 1, false);
			game.log(player, "消耗了1点", "<span style='color: #42f0f6'>速度</span>");
			const selected = [],
				target = trigger.source,
				list = [
					["draw", "摸两张牌"],
					["recover", "回复1点体力"],
					["useCard", "使用一张牌"],
					["recast", "重铸两张牌"],
				];
			let other = false;
			while (selected.length < list.length) {
				let type;
				if (other) {
					type = list.find(info => !selected.includes(info[0]))?.[0];
				} else {
					const canSelect = list
						.map(info => info[0])
						.filter(name => {
							if (selected.includes(name)) {
								return false;
							}
							if (name == "recover") {
								return target.isDamaged();
							}
							if (name == "useCard") {
								return target.countCards("hs", card => target.hasUseTarget(card));
							}
							if (name == "recast") {
								return target.countCards("he") > 1;
							}
							return true;
						});
					const result = await target
						.chooseButton([`典滕：选择至多两项（${selected.length + 1}/2）`, [list, "textbutton"]])
						.set("canSelect", canSelect)
						.set("filterButton", button => {
							return get.event().canSelect.includes(button.link);
						})
						.set("ai", button => {
							const player = get.player();
							switch (button.link) {
								case "draw": {
									return 2;
								}
								case "recover": {
									return get.recoverEffect(player);
								}
								case "useCard": {
									const getE = card => player.getUseValue(card);
									return getE(player.getCards("hs").maxBy(getE));
								}
							}
							return 0.6;
						})
						.forResult();
					if (result?.bool && result.links?.length) {
						type = result.links[0];
					} else {
						other = true;
						continue;
					}
				}
				if (!type) {
					break;
				}
				selected.add(type);
				const user = other ? player : target;
				switch (type) {
					case "draw": {
						await user.draw(2);
						break;
					}
					case "recover": {
						await user.recover();
						break;
					}
					case "recast": {
						if (user.countCards("he", lib.filter.cardRecastable) > 1) {
							const result = await user
								.chooseCard("he", 2, lib.filter.cardRecastable, true, "典滕：重铸两张牌")
								.set("ai", card => 7 - get.value(card))
								.forResult();
							if (result?.bool && result.cards?.length) {
								await user.recast(result.cards);
							}
						}
						break;
					}
					default: {
						await user.chooseToUse({
							filterCard(card, player, event) {
								if (get.itemtype(card) != "card") {
									return false;
								}
								return lib.filter.filterCard.call(this, card, player, event);
							},
							prompt: "典滕：使用一张牌",
							addCount: false,
						});
						break;
					}
				}
				if (selected.length > 1) {
					other = true;
				}
			}
		},
		ai: {
			expose: 0.3,
		},
	},
	qiulin_jipao: {
		inherit: "chixia_jipao",
		intro: {
			name: "速度·璆琳",
			content(storage, player) {
				return `当前速度：${storage}/5`;
			},
		},
		filter(event, player) {
			const num = player.countMark("qiulin_jipao");
			if (event.name == "die") {
				return num >= 3;
			}
			return player?.isIn() && num < 5;
		},
	},
	sm_feidian: {
		audio: 2,
		forced: true,
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return get.suit(event.card) == "heart";
		},
		async content(event, trigger, player) {
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				const stat = player.getStat("card"),
					name = trigger.card.name;
				if (typeof stat[name] == "number" && stat[name] > 0) {
					stat[name]--;
				}
			}
		},
		mod: {
			cardUsable(card, player) {
				if (["unsure", "heart"].includes(get.suit(card))) {
					return Infinity;
				}
			},
			targetInRange(card, player) {
				if (["unsure", "heart"].includes(get.suit(card))) {
					return true;
				}
			},
			cardnumber(card) {
				if (get.suit(card) == "heart") {
					return 13;
				}
			},
		},
		global: "sm_feidian_global",
		subSkill: {
			global: {
				mod: {
					cardEnabled(card, player) {
						let evt = get.event();
						if (evt.name != "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						if (!evt || !evt.respondTo) {
							return;
						}
						if (!evt.respondTo[0].hasSkill("sm_feidian") || get.suit(evt.respondTo[1], evt.respondTo[0]) != "heart") {
							return;
						}
						const num = get.number(card);
						if (num != "unsure" && typeof num == "number" && num < 13) {
							return false;
						}
					},
					cardRespondable(card, player) {
						let evt = get.event();
						if (evt.name != "chooseToRespond") {
							evt = evt.getParent("chooseToRespond");
						}
						if (!evt || !evt.respondTo) {
							return;
						}
						if (!evt.respondTo[0].hasSkill("sm_feidian") || get.suit(evt.respondTo[1], evt.respondTo[0]) != "heart") {
							return;
						}
						const num = get.number(card);
						if (num != "unsure" && typeof num == "number" && num < 13) {
							return false;
						}
					},
				},
			},
		},
	},
	sm_xianxing: {
		audio: 2,
		forced: true,
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		logTarget(event, player) {
			return game.filterPlayer(current => player.canCompare(current));
		},
		onRound(event) {
			return !event.xianxing_phase;
		},
		async content(event, trigger, player) {
			const result = await player.chooseToCompare(event.targets).setContent("chooseToCompareMeanwhile").forResult();
			if (result?.winner && result.winner == player) {
				const next = player.insertPhase();
				if (!trigger._finished) {
					trigger.finish();
					trigger._finished = true;
					trigger._triggered = 5;
					if (!lib.onround.includes(get.info("sm_xianxing").onRound)) {
						lib.onround.push(get.info("sm_xianxing").onRound);
					}
					const evt = trigger.player.insertPhase();
					evt.set("xianxing_phase", true);
					evt.relatedEvent = trigger.relatedEvent || trigger.getParent(2);
					evt.skill = trigger.skill;
					evt._noTurnOver = true;
					evt.set("phaseList", trigger.phaseList);
					evt.pushHandler("xianxing_phase", (event, option) => {
						if (event.step === 0 && option.state === "begin") {
							event.step = 2;
							_status.globalHistory.push({
								cardMove: [],
								custom: [],
								useCard: [],
								changeHp: [],
								everything: [],
							});
							let players = game.players.slice(0).concat(game.dead);
							for (let i = 0; i < players.length; i++) {
								let current = players[i];
								current.actionHistory.push({
									useCard: [],
									respond: [],
									skipped: [],
									lose: [],
									gain: [],
									sourceDamage: [],
									damage: [],
									custom: [],
									useSkill: [],
								});
								current.stat.push({ card: {}, skill: {} });
							}
						}
					});
				}
				const nexts = trigger.getParent()?.next;
				if (nexts?.length) {
					for (let evt of nexts.slice(0)) {
						if (evt.finished) {
							continue;
						}
						if (evt == next) {
							break;
						}
						nexts.remove(evt);
						nexts.push(evt);
					}
				}
			} else {
				await player.damage();
				const { player: card, targets: cards } = result;
				const list = cards.filter(cardx => get.position(cardx) == "d" && get.number(cardx) < get.number(card));
				if (list?.length) {
					await player.gain(list, "gain2");
				}
			}
		},
	},
	zhuahuang_jipao: {
		inherit: "chixia_jipao",
		intro: {
			name: "速度·爪黄",
			content(storage, player) {
				return `当前速度：${storage}/5`;
			},
		},
		filter(event, player) {
			const num = player.countMark("zhuahuang_jipao");
			if (event.name == "die") {
				return num >= 3;
			}
			return player?.isIn() && num < 5;
		},
	},
	sm_zixin: {
		audio: 2,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (player == _status.currentPhase) {
				return false;
			}
			const cards = event.getg(player),
				hs = player.getCards("h");
			return cards?.length && cards.some(card => hs.includes(card) && player.hasUseTarget(card));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), card => {
					return get.event().cardx.includes(card);
				})
				.set(
					"cardx",
					trigger.getg(player).filter(card => player.hasUseTarget(card))
				)
				.set("ai", card => {
					return get.player().getUseValue(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [card] = event.cards;
			await player.showCards(event.cards);
			if (player.hasUseTarget(card) && player.getCards("h").includes(card)) {
				await player.chooseUseTarget(card, true, false);
			}
		},
	},
	sm_zhiyin: {
		audio: 2,
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.hasMark("zijian_jipao");
		},
		async cost(event, trigger, player) {
			const list = lib.suit.map(suit => ["", "", `lukai_${suit}`]);
			const result = await player
				.chooseButton([get.prompt(event.skill, trigger.player), [list, "vcard"]], [1, 4])
				.set("ai", button => {
					const { player, att } = get.event();
					if (att <= 0) {
						return 0;
					}
					return Math.random() > 0.3;
				})
				.set("att", get.attitude(player, trigger.player))
				.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					targets: [trigger.player],
					cost_data: result.links.map(info => info[2].slice(6)),
				};
			}
		},
		async content(event, trigger, player) {
			const {
				name,
				targets: [target],
				cost_data: suits,
			} = event;
			player.removeMark("zijian_jipao", 1, false);
			game.log(player, "消耗了1点", "<span style='color: #42f0f6'>速度</span>");
			game.log(player, "声明的花色：", suits);
			player.addTip(name, `知音${suits.map(suit => get.translation(suit)).join("")}`);
			player
				.when({
					global: "phaseEnd",
				})
				.filter(evt => evt == trigger.getParent())
				.step(async (event, trigger, player) => {
					player.removeTip(name);
					const used = game
						.getGlobalHistory("useCard")
						.map(card => get.suit(card))
						.toUniqued();
					const num1 = suits.filter(suit => used.includes(suit)).length,
						num2 = suits.length - num1;
					if (num1 > 0) {
						await game.asyncDraw([player, target], num1);
					}
					if (num2 > 0) {
						await player.loseHp(num2);
					}
				});
		},
	},
	zijian_jipao: {
		inherit: "chixia_jipao",
		intro: {
			name: "速度·子建",
			content(storage, player) {
				return `当前速度：${storage}/5`;
			},
		},
		filter(event, player) {
			const num = player.countMark("zijian_jipao");
			if (event.name == "die") {
				return num >= 3;
			}
			return player?.isIn() && num < 5;
		},
	},
	sm_jueying: {
		audio: 2,
		forced: true,
		init(player, skill) {
			player.addExtraEquip(skill, "jueying", true, player => !player.isTempBanned("sm_jueying"));
		},
		onremove(player, skill) {
			player.removeExtraEquip(skill);
		},
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			await player.draw();
			const list = get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true });
				return player.hasUseTarget(card);
			});
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseButton(["珏颖：是否令此技能本回合失效并视为使用一张基本牌？", [list, "vcard"]])
				.set("ai", button => {
					const card = get.autoViewAs({ name: button.link[2], nature: button.link[3], isCard: true });
					return get.player().getUseValue(card);
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				player.tempBanSkill(event.name);
				game.broadcastAll(player => {
					player.$handleEquipChange();
				}, player);
				player
					.when({
						global: "phaseBeginStart",
					})
					.step(async (event, trigger, player) => {
						game.broadcastAll(player => {
							player.$handleEquipChange();
						}, player);
					});
				const card = get.autoViewAs({ name: result.links[0][2], nature: result.links[0][3], isCard: true });
				if (player.hasUseTarget(card)) {
					await player.chooseUseTarget(card, true, false);
				}
			}
		},
		mod: {
			globalTo(from, to, distance) {
				if (to.isTempBanned("sm_jueying")) {
					return;
				}
				return distance + 1;
			},
		},
	},
	sm_xuneng: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasMark("jieying_jipao");
		},
		manualConfirm: true,
		async content(event, trigger, player) {
			player.removeMark("jieying_jipao", 1, false);
			game.log(player, "消耗了1点", "<span style='color: #42f0f6'>速度</span>");
			const skill = `${event.name}_effect`;
			player.addTempSkill(skill);
			player.addMark(skill, 1, false);
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.hasSkill("sm_xuneng_effect") || !player.getDamagedHp()) {
						return 0;
					}
					return player.countCards("hs", card => player.hasValueTarget(card) && ["basic", "trick"].includes(get.type(card)));
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard",
				},
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.targets?.length === 1;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const num = player.countMark(event.name) * player.getDamagedHp();
					trigger.baseDamage ??= 1;
					trigger.baseDamage += num;
					player.removeSkill(event.name);
				},
				mod: {
					aiOrder(player, card, num) {
						if (num > 0 && ["trick", "basic"].includes(get.type(card))) {
							return num + 12;
						}
					},
				},
			},
		},
	},
	jieying_jipao: {
		inherit: "chixia_jipao",
		intro: {
			name: "速度·婕媖",
			content(storage, player) {
				return `当前速度：${storage}/5`;
			},
		},
		filter(event, player) {
			const num = player.countMark("jieying_jipao");
			if (event.name == "die") {
				return num >= 3;
			}
			return player?.isIn() && num < 5;
		},
	},
	sm_chitu: {
		audio: 2,
		forced: true,
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			return event.card;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			for (const key of ["useCard", "respond"]) {
				if (
					target.hasHistory(key, evt => {
						if (!evt.respondTo) {
							return false;
						}
						return evt.respondTo[1] == trigger.card;
					})
				) {
					trigger.num++;
					return;
				}
			}
			if (target.countGainableCards(player, "h")) {
				await player.gainPlayerCard(target, "h", true);
			}
		},
	},
	sm_aozhan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!player.hasMark("liaoyuan_jipao")) {
				return false;
			}
			return get.info("sm_aozhan").derivation.some(skill => !player.hasSkill(skill, null, null, false));
		},
		chooseButton: {
			dialog(event, player) {
				const skills = get.info("sm_aozhan").derivation.filter(skill => !player.hasSkill(skill, null, null, false));
				return ui.create.dialog("傲战", [skills, "skill"], "hidden");
			},
			check(button) {
				if (button.link == "jsrgguanjue") {
					return 1;
				}
				return Math.random();
			},
			prompt(links, player) {
				return `消耗1点速度，获得${get.poptip(links[0])}并摸一张牌`;
			},
			backup(links, player) {
				return {
					choiceSkill: links[0],
					manualConfirm: true,
					async content(event, trigger, player) {
						player.removeMark("liaoyuan_jipao", 1, false);
						game.log(player, "消耗了1点", "<span style='color: #42f0f6'>速度</span>");
						const { choiceSkill: skill } = get.info(event.name);
						await player.addSkills(skill);
						await player.draw();
					},
				};
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		derivation: ["xinshensu", "wushuang", "dclima", "jsrgguanjue"],
		subSkill: {
			backup: {},
		},
	},
	liaoyuan_jipao: {
		inherit: "chixia_jipao",
		intro: {
			name: "速度·燎原",
			content(storage, player) {
				return `当前速度：${storage}/5`;
			},
		},
		filter(event, player) {
			const num = player.countMark("liaoyuan_jipao");
			if (event.name == "die") {
				return num >= 3;
			}
			return player?.isIn() && num < 5;
		},
	},
	sm_dilu: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["loseAsyncAfter", "gainAfter", "equipAfter", "addToExpansionAfter", "addJudgeAfter"],
		},
		filter(event, player) {
			if ((event.relatedEvent || event.getParent())?.name == "useCard") {
				return false;
			}
			const evt = event.getl(player);
			if (!evt?.cards2?.length) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true });
				return player.hasUseTarget(card);
			}).length;
		},
		async cost(event, trigger, player) {
			const list = get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true });
				return player.hasUseTarget(card);
			});
			const result = await player
				.chooseButton([get.prompt(event.skill), [list, "vcard"]])
				.set("ai", button => {
					const card = get.autoViewAs({ name: button.link[2], nature: button.link[3], isCard: true });
					return get.player().getUseValue(card);
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
			const { cost_data: link } = event;
			const card = get.autoViewAs({ name: link[2], nature: link[3], isCard: true });
			if (player.hasUseTarget(card)) {
				await player.chooseUseTarget(card, true, false);
			}
		},
		locked: true,
		mod: {
			globalFrom(from, to, num) {
				return num + 1;
			},
			globalTo(from, to, num) {
				return num + 1;
			},
		},
	},
	sm_boxing: {
		audio: 2,
		forced: true,
		trigger: {
			target: "useCardToTarget",
		},
		filter(event, player) {
			return event.player != player;
		},
		async content(event, trigger, player) {
			await player
				.judge(card => {
					if (get.suit(card) == "heart") {
						return -1;
					}
					return 1;
				})
				.set("callback", async (event, trigger, player) => {
					if (event.judgeResult.suit !== "heart") {
						const num = player.countDiscardableCards(player, "he");
						if (num > 0) {
							await player.chooseToDiscard("he", true);
						}
						const targets = game.filterPlayer(current => current != player),
							gains = [];
						if (!targets.length) {
							return;
						}
						const map = await game
							.chooseAnyOL(
								game.filterPlayer(current => current != player),
								get.info("sm_boxing").chooseCard,
								[player]
							)
							.forResult();
						for (const i of targets) {
							const result = map.get(i);
							if (result?.bool) {
								i.popup("交给", "wood");
								gains.addArray(result.cards);
							}
						}
						await game.delay();
						if (gains.length) {
							await player.gain(gains, "giveAuto");
						}
					}
				});
			if (player.getAllHistory("useSkill", evt => evt.skill == event.name).length > 1) {
				await player.changeSkills(["sm_chongji"], ["sm_boxing"]);
			}
		},
		chooseCard(current, boss) {
			const next = current.chooseCard("he");
			next.set("prompt", "是否交给" + get.translation(boss) + "一张牌？");
			next.set("_global_waiting", true);
			next.set("ai", card => {
				if (get.event().att > 0) {
					return 6 - get.value(card);
				}
				return 1 - get.value(card);
			});
			next.set("att", get.attitude(current, boss));
			return next;
		},
		derivation: "sm_chongji",
	},
	sm_chongji: {
		audio: 2,
		trigger: { player: ["useCard", "recoverEnd"] },
		filter(event, player) {
			if (!player.countMark("dailu_jipao")) {
				return false;
			}
			if (event.name == "useCard") {
				return event.targets?.length == 1 && get.is.damageCard(event.card);
			}
			const evts = player.getAllHistory("gain");
			return game.hasPlayer(current => {
				const evts2 = current.getAllHistory("lose").map(evt => evt.getParent());
				return evts.containsSome(...evts2);
			});
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = await player
					.chooseBool(get.prompt(event.skill), `消耗1点速度令${get.translation(trigger.card)}额外结算一遍`)
					.set(
						"choice",
						(() => {
							let eff = 0;
							for (const target of trigger.targets) {
								eff += get.effect(target, trigger.card, trigger.player, player);
							}
							return eff > 0;
						})()
					)
					.forResult();
				return;
			}
			const evts = player.getAllHistory("gain");
			const targets = game.filterPlayer(current => {
				const evts2 = current.getAllHistory("lose").map(evt => evt.getParent());
				return evts.containsSome(...evts2);
			});
			event.result = await player
				.chooseTarget(get.prompt(event.skill), `消耗1点速度，令一名交给过你牌的角色回复等量体力并摸一张牌`, (card, player, target) => {
					return get.event().targetx.includes(target);
				})
				.set("targetx", targets)
				.set("ai", target => {
					const player = get.player();
					return get.recoverEffect(target, player, player) + get.sgnAttitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.removeMark("dailu_jipao", 1, false);
			game.log(player, "消耗了1点", "<span style='color: #42f0f6'>速度</span>");
			if (trigger.name == "useCard") {
				trigger.effectCount++;
			} else {
				const {
					targets: [target],
				} = event;
				if (trigger.num > 0) {
					await target.recover(trigger.num);
					await target.draw();
				}
			}
		},
	},
	dailu_jipao: {
		inherit: "chixia_jipao",
		intro: {
			name: "速度·黛露",
			content(storage, player) {
				return `当前速度：${storage}/5`;
			},
		},
		filter(event, player) {
			const num = player.countMark("dailu_jipao");
			if (event.name == "die") {
				return num >= 3;
			}
			return player?.isIn() && num < 5;
		},
	},
};

export default skills;
