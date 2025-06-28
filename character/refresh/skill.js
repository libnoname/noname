import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	ollianhuan: {
		audio: "xinlianhuan",
		audioname: ["ol_pangtong"],
		hiddenCard: (player, name) => {
			return name == "tiesuo" && player.hasCard(card => get.suit(card) == "club", "she");
		},
		filter(event, player) {
			if (!player.hasCard(card => get.suit(card) == "club", "she")) {
				return false;
			}
			return event.type == "phase" || event.filterCard({ name: "tiesuo" }, player, event);
		},
		position: "hes",
		inherit: "lianhuan",
		group: "ollianhuan_add",
		subSkill: {
			add: {
				audio: "xinlianhuan",
				audioname: ["ol_pangtong"],
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (event.card.name != "tiesuo") {
						return false;
					}
					var info = get.info(event.card);
					if (info.allowMultiple == false) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(current => {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				charlotte: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget(get.prompt("ollianhuan"), "为" + get.translation(trigger.card) + "额外指定一个目标", (card, player, target) => {
							return !_status.event.sourcex.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
						})
						.set("sourcex", trigger.targets)
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, _status.event.card, player, player);
						})
						.set("card", trigger.card)
						.forResult();
					if (result?.bool) {
						if (!event.isMine() && !event.isOnline()) {
							await game.delayex();
						}
						const targets = result.targets;
						player.logSkill("ollianhuan_add", targets);
						trigger.targets.addArray(targets);
						game.log(targets, "也成为了", trigger.card, "的目标");
					}
				},
			},
		},
	},
	rehuomo: {
		audio: "huomo",
		audioname: ["huzhao", "re_zhongyao"],
		enable: "chooseToUse",
		hiddenCard(player, name) {
			if (get.type(name) != "basic") {
				return false;
			}
			const list = player.getStorage("rehuomo");
			if (list.includes(name)) {
				return false;
			}
			return player.hasCard(function (card) {
				return get.color(card) == "black" && get.type(card) != "basic";
			}, "eh");
		},
		filter(event, player) {
			if (
				event.type == "wuxie" ||
				!player.hasCard(function (card) {
					return get.color(card) == "black" && get.type(card) != "basic";
				}, "eh")
			) {
				return false;
			}
			const list = player.getStorage("rehuomo");
			for (let name of lib.inpile) {
				if (get.type(name) != "basic" || list.includes(name)) {
					continue;
				}
				let card = { name: name, isCard: true };
				if (event.filterCard(card, player, event)) {
					return true;
				}
				if (name == "sha") {
					for (let nature of lib.inpile_nature) {
						card.nature = nature;
						if (event.filterCard(card, player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = [];
				const list = player.getStorage("rehuomo");
				for (let name of lib.inpile) {
					if (get.type(name) != "basic" || list.includes(name)) {
						continue;
					}
					let card = { name: name, isCard: true };
					if (event.filterCard(card, player, event)) {
						vcards.push(["基本", "", name]);
					}
					if (name == "sha") {
						for (let nature of lib.inpile_nature) {
							card.nature = nature;
							if (event.filterCard(card, player, event)) {
								vcards.push(["基本", "", name, nature]);
							}
						}
					}
				}
				return ui.create.dialog("活墨", [vcards, "vcard"], "hidden");
			},
			check(button) {
				const player = _status.event.player;
				const card = { name: button.link[2], nature: button.link[3] };
				if (
					game.hasPlayer(function (current) {
						return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})
				) {
					switch (button.link[2]) {
						case "tao":
							return 5;
						case "jiu":
							return 3.01;
						case "sha":
							if (button.link[3] == "fire") {
								return 2.95;
							} else if (button.link[3] == "thunder") {
								return 2.92;
							} else {
								return 2.9;
							}
						case "shan":
							return 1;
					}
				}
				return 0;
			},
			backup(links, player) {
				return {
					check(card) {
						return 1 / Math.max(0.1, get.value(card));
					},
					filterCard(card) {
						return get.type(card) != "basic" && get.color(card) == "black";
					},
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						suit: "none",
						number: null,
						isCard: true,
					},
					position: "he",
					popname: true,
					ignoreMod: true,
					precontent() {
						player.logSkill("rehuomo");
						var card = event.result.cards[0];
						game.log(player, "将", card, "置于牌堆顶");
						player.loseToDiscardpile(card, ui.cardPile, "visible", "insert").log = false;
						var viewAs = {
							name: event.result.card.name,
							nature: event.result.card.nature,
						};
						event.result.card = viewAs;
						event.result.cards = [];
						if (!player.storage.rehuomo) {
							player.when({ global: "phaseAfter" }).then(() => {
								player.unmarkSkill("rehuomo");
							});
						}
						player.markAuto("rehuomo", viewAs.name);
					},
				};
			},
			prompt(links, player) {
				return "将一张黑色非基本牌置于牌堆顶并视为使用一张" + get.translation(links[0][3] || "") + get.translation(links[0][2]);
			},
		},
		marktext: "墨",
		intro: {
			content: "本回合已因〖活墨〗使用过$",
			onunmark: true,
		},
		ai: {
			order() {
				var player = _status.event.player;
				var event = _status.event;
				var list = player.getStorage("rehuomo");
				if (!list.includes("jiu") && event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0) {
					return 3.1;
				}
				return 2.9;
			},
			respondSha: true,
			fireAttack: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (tag == "fireAttack") {
					return true;
				}
				if (
					player.hasCard(function (card) {
						return get.color(card) == "black" && get.type(card) != "basic";
					}, "he")
				) {
					if (arg === "respond") {
						return false;
					}
					var list = player.getStorage("rehuomo");
					if (tag == "respondSha") {
						if (list.includes("sha")) {
							return false;
						}
					} else if (tag == "respondShan") {
						if (list.includes("shan")) {
							return false;
						}
					}
				} else {
					return false;
				}
			},
			result: {
				player: 1,
			},
		},
	},
	//界张梁
	rejijun: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return event.targets && event.targets.includes(player);
		},
		frequent: true,
		content() {
			player.judge(card => 1).callback = lib.skill.rejijun.callback;
		},
		callback() {
			if (typeof card.number == "number") {
				player.addToExpansion(card, "gain2").gaintag.add("rejijun");
			}
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		marktext: "方",
		ai: { combo: "refangtong" },
	},
	refangtong: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2("refangtong"), (card, player) => typeof card.number == "number")
				.set("ai", card => {
					var player = _status.event.player;
					if (!game.hasPlayer(target => target != player && get.damageEffect(target, player, player, "thunder") > 0)) {
						return 0;
					}
					if (
						player.getExpansions("rejijun").reduce(function (num, card) {
							return num + get.number(card, false);
						}, 0) > 36
					) {
						return 1 / (get.value(card) || 0.5);
					} else {
						if (lib.skill.refangtong.thunderEffect(card, player)) {
							return 10 - get.value(card);
						}
						return 5 - get.value(card);
					}
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.addToExpansion(cards, player, "give").set("gaintag", ["rejijun"]);
			const result = await player
				.chooseButton(["###是否移去任意张“方”，对一名其他角色造成1点雷属性伤害？###若你移去的“方”的点数和大于36，则改为造成3点雷属性伤害", player.getExpansions("rejijun")], [1, player.getExpansions("rejijun").length])
				.set("ai", button => {
					var player = _status.event.player;
					var cards = player.getExpansions("rejijun");
					if (
						cards.reduce(function (num, card) {
							return num + get.number(card, false);
						}, 0) <= 36
					) {
						if (!ui.selected.buttons.length) {
							return 1 / get.number(button.link, false);
						}
						return 0;
					} else {
						var num = 0,
							list = [];
						cards.sort((a, b) => get.number(b, false) - get.number(a, false));
						for (var i = 0; i < cards.length; i++) {
							list.push(cards[i]);
							num += get.number(cards[i], false);
							if (num > 36) {
								break;
							}
						}
						return list.includes(button.link) ? 1 : 0;
					}
				})
				.forResult();
			if (result?.bool) {
				const bool =
					result.links.reduce(function (num, card) {
						return num + get.number(card, false);
					}, 0) > 36;
				await player.loseToDiscardpile(result.links);
				const result2 = await player
					.chooseTarget("请选择一名其他角色", "对其造成" + (bool ? 3 : 1) + "点雷属性伤害", lib.filter.notMe)
					.set("ai", target => get.damageEffect(target, _status.event.player, _status.event.player, "thunder"))
					.forResult();
				if (result2?.bool) {
					const target = result2.targets[0];
					player.line(target, "thunder");
					target.damage(bool ? 3 : 1, "thunder");
				}
			}
		},
		thunderEffect(card, player) {
			let cards = player.getExpansions("rejijun"),
				num = 0;
			cards.push(card);
			if (
				cards.reduce(function (num, card) {
					return num + get.number(card, false);
				}, 0) <= 36
			) {
				return false;
			}
			cards.sort((a, b) => get.number(b, false) - get.number(a, false));
			let bool = false;
			for (let i = 0; i < cards.length; i++) {
				if (cards[i] == card) {
					bool = true;
				}
				num += get.number(cards[i], false);
				if (num > 36) {
					break;
				}
			}
			return bool;
		},
	},
	//界司马朗
	requji: {
		inherit: "quji",
		async content(event, trigger, player) {
			const { target, targets, cards } = event;
			await target.recover();
			if (target.isDamaged()) {
				await target.draw();
			}
			if (target == targets[targets.length - 1] && cards.some(card => get.color(card, player) == "black")) {
				await player.loseHp();
			}
		},
	},
	rejunbing: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return event.player.countCards("h") < event.player.getHp();
		},
		async cost(event, trigger, player) {
			event.result = await trigger.player
				.chooseBool(player == trigger.player ? get.prompt(event.skill) : "是否响应" + get.translation(player) + "的【郡兵】？", "摸一张牌" + (player == trigger.player ? "" : "，将所有手牌交给" + get.translation(player) + "，然后其可以交给你等量张牌"))
				.set("ai", () => get.event("choice"))
				.set("choice", get.attitude(trigger.player, player) > 0)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			if (target != player) {
				game.log(target, "响应了", player, "的", "#g【郡兵】");
			}
			await target.draw();
			let cards = target.getCards("h");
			if (target == player || !cards.length) {
				return;
			}
			await target.give(cards, player);
			const num = cards.length;
			if (player.countCards("he") >= num) {
				const result = await player
					.chooseCard("郡兵：是否还给" + get.translation(target) + get.translation(num) + "张牌？", "he", num)
					.set("ai", card => {
						let player = _status.event.player,
							target = get.event("target");
						if (get.attitude(player, target) <= 0) {
							if (card.name == "du") {
								return 1145141919810;
							}
							return -get.value(card);
						}
						return 8 - Math.sqrt(target.hp) - get.value(card);
					})
					.set("target", target)
					.forResult();
				if (result.bool) {
					await player.give(result.cards, target);
				}
			}
		},
	},
	//界诸葛诞
	regongao: {
		audio: 2,
		trigger: { global: "dying" },
		filter(event, player) {
			if (player == event.player) {
				return false;
			}
			return !player.getAllHistory("useSkill", evt => evt.skill == "regongao" && evt.targets[0] == event.player).length;
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			await player.gainMaxHp();
			await player.recover();
		},
	},
	rejuyi: {
		audio: 2,
		derivation: ["benghuai", "reweizhong"],
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.maxHp > game.countPlayer() && player.isDamaged();
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.drawTo(player.maxHp);
			await player.addSkills(["benghuai", "reweizhong"]);
		},
	},
	reweizhong: {
		audio: 1,
		inherit: "weizhong",
		content() {
			player.draw(2);
		},
	},
	benghuai_re_zhugedan: { audio: 1 },
	//堪比界曹冲的界曹叡
	remingjian: {
		inherit: "mingjian",
		content() {
			player.give(cards, target);
			target.addTempSkill("remingjian_buff", { player: "phaseAfter" });
			if (!target.storage.remingjian_buff) {
				target.storage.remingjian_buff = [];
			}
			target.storage.remingjian_buff.push(player);
			target.markSkill("remingjian_buff");
		},
		derivation: "huituo",
		subSkill: {
			buff: {
				charlotte: true,
				mark: true,
				marktext: "鉴",
				intro: {
					content: (storage, player) => {
						const num = storage.length;
						return `<li>被${get.translation(storage.toUniqued())}鉴识<li>手牌上限+${num}，出杀次数+${num}`;
					},
				},
				onremove: true,
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					if (_status.currentPhase != player) {
						return false;
					}
					return player.getHistory("sourceDamage").indexOf(event) == 0 && player.getStorage("remingjian_buff").some(i => i.isIn());
				},
				direct: true,
				*content(event, map) {
					const player = map.player;
					const masters = player
						.getStorage("remingjian_buff")
						.filter(i => i.isIn())
						.toUniqued()
						.sortBySeat(_status.currentPhase);
					while (masters.length) {
						const master = masters.shift();
						if (!master.isIn()) {
							continue;
						}
						const next = game.createEvent("huituo");
						next.setContent(lib.skill.huituo.content);
						next.player = master;
						next.forced = true;
						next._trigger = map.trigger;
						yield next;
					}
				},
				mod: {
					maxHandcard(player, num) {
						return num + player.getStorage("remingjian_buff").length;
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.getStorage("remingjian_buff").length;
						}
					},
				},
			},
		},
	},
	rexingshuai: {
		audio: 2,
		skillAnimation: true,
		animationColor: "thunder",
		trigger: { player: "dying" },
		zhuSkill: true,
		filter(event, player) {
			if (player.hp > 0) {
				return false;
			}
			if (!player.hasZhuSkill("rexingshuai")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.group == "wei";
			});
		},
		limited: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const targets = game.filterPlayer();
			targets.sortBySeat(_status.currentPhase);
			targets.remove(player);
			const damages = [];
			player.addSkill("rexingshuai_restore");
			while (targets.length) {
				const current = targets.shift();
				if (current.group == "wei") {
					const result = await current
						.chooseBool("是否令" + get.translation(player) + "回复1点体力？")
						.set("ai", function () {
							return get.attitude(_status.event.player, _status.event.target) > 2;
						})
						.set("target", player)
						.forResult();
					if (result?.bool) {
						damages.push(event.current);
						current.line(player, "green");
						game.log(current, "令", player, "回复1点体力");
						await player.recover(current);
					}
				}
			}
			if (damages.length) {
				const next = game.createEvent("rexingshuai_next");
				event.next.remove(next);
				trigger.after.push(next);
				next.targets = damages;
				next.setContent(function () {
					targets.shift().damage();
					if (targets.length) {
						event.redo();
					}
				});
			}
		},
		subSkill: {
			restore: {
				audio: "rexingshuai",
				trigger: {
					global: "dieAfter",
				},
				charlotte: true,
				forced: true,
				filter(event, player) {
					return event.source && event.source.isIn() && event.source.hasSkill("remingjian_buff");
				},
				content() {
					player.restoreSkill("rexingshuai");
					game.log(player, "重置了", "#g【兴衰】");
				},
			},
		},
	},
	//不想突破可以不突破的界曹冲
	rechengxiang: {
		audio: 2,
		group: "rechengxiang_gain",
		trigger: {
			player: "rechengxiang_gainEnd",
		},
		direct: true,
		subfrequent: ["gain"],
		filter(event, player) {
			return (
				event.cards2 &&
				event.cards2
					.map(card => {
						return get.number(card);
					})
					.reduce((sum, num) => {
						return (sum += num);
					}, 0) == 13
			);
		},
		async content(event, trigger, player) {
			await player.link(false);
			await player.turnOver(false);
		},
		subSkill: {
			gain: {
				inherit: "chengxiang",
				audio: "rechengxiang",
			},
		},
	},
	//OL界二张
	olzhijian: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { type: "equip" }) > 0;
		},
		filterCard(card) {
			return get.type(card) == "equip";
		},
		position: "he",
		check(card) {
			var player = _status.currentPhase;
			if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
				return 11 - get.equipValue(card);
			}
			return 6 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (target.isMin()) {
				return false;
			}
			return player != target && target.canEquip(card, true);
		},
		async content(event, trigger, player) {
			await event.target.equip(event.cards[0]);
			await player.draw();
		},
		discard: false,
		lose: false,
		prepare(cards, player, targets) {
			player.$give(cards, targets[0], false);
		},
		ai: {
			basic: {
				order: 10,
			},
			result: {
				target(player, target) {
					var card = ui.selected.cards[0];
					if (card) {
						return get.effect(target, card, target, target);
					}
					return 0;
				},
			},
			threaten: 1.35,
		},
	},
	olguzheng: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.type != "discard") {
				return false;
			}
			if (player.hasSkill("olguzheng_used")) {
				return false;
			}
			var phaseName;
			for (var name of lib.phaseName) {
				var evt = event.getParent(name);
				if (!evt || evt.name != name) {
					continue;
				}
				phaseName = name;
				break;
			}
			if (!phaseName) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				var evt = event.getl(current);
				if (!evt || !evt.cards2 || evt.cards2.filterInD("d").length < 2) {
					return false;
				}
				return true;
			});
		},
		checkx(event, player, cards) {
			if (cards.length > 2 || get.attitude(player, event.player) > 0) {
				return true;
			}
			for (var i = 0; i < cards.length; i++) {
				if (get.value(cards[i], event.player, "raw") < 0) {
					return true;
				}
			}
			return false;
		},
		direct: true,
		preHidden: true,
		async content(event, trigger, player) {
			const targets = [],
				cardsList = [],
				players = game.filterPlayer().sortBySeat(_status.currentPhase);
			for (const current of players) {
				if (current == player) {
					continue;
				}
				const cards = [];
				const evt = trigger.getl(current);
				if (!evt || !evt.cards2) {
					continue;
				}
				const cardsx = evt.cards2.filterInD("d");
				cards.addArray(cardsx);
				if (cards.length) {
					targets.push(current);
					cardsList.push(cards);
				}
			}
			while (targets.length) {
				const target = targets.shift();
				let cards = cardsList.shift();
				const result = await player
					.chooseButton(2, [get.prompt("olguzheng", target), '<span class="text center">被选择的牌将成为对方收回的牌</span>', cards, [["获得剩余的牌", "放弃剩余的牌"], "tdnodes"]])
					.set("filterButton", function (button) {
						const type = typeof button.link;
						if (ui.selected.buttons.length && type == typeof ui.selected.buttons[0].link) {
							return false;
						}
						return true;
					})
					.set("check", lib.skill.olguzheng.checkx(trigger, player, cards))
					.set("ai", function (button) {
						if (typeof button.link == "string") {
							return button.link == "获得剩余的牌" ? 1 : 0;
						}
						if (_status.event.check) {
							return 20 - get.value(button.link, _status.event.getTrigger().player);
						}
						return 0;
					})
					.setHiddenSkill("olguzheng")
					.forResult();
				if (result?.links) {
					player.logSkill("olguzheng", target);
					const links = result.links;
					player.addTempSkill("olguzheng_used", ["phaseZhunbeiAfter", "phaseDrawAfter", "phaseJudgeAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]);
					if (typeof links[0] != "string") {
						links.reverse();
					}
					const card = links[1];
					await target.gain(card, "gain2");
					cards.remove(card);
					cards = cards.filterInD("d");
					if (cards.length > 0 && links[0] == "获得剩余的牌") {
						await player.gain(cards, "gain2");
					}
					break;
				}
			}
		},
		ai: {
			threaten: 1.3,
			expose: 0.2,
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	//SP黄月英
	rejiqiao: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2("rejiqiao"), [1, player.countCards("he")], "he", "chooseonly")
				.set("ai", function (card) {
					if (card.name == "bagua") {
						return 10;
					}
					return 7 - get.value(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			await player.modedDiscard(cards);
			const num = cards.length + cards.filter(card => get.type(card) == "equip").length;
			const showCards = get.cards(num);
			await game.cardsGotoOrdering(showCards);
			await player.showCards(showCards);
			await player.gain(
				showCards.filter(card => get.type(card) != "equip"),
				"gain2"
			);
		},
		ai: {
			threaten: 1.6,
		},
	},
	relinglong: {
		audio: 2,
		trigger: {
			player: ["loseAfter", "disableEquipAfter", "enableEquipAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "phaseBefore"],
		},
		forced: true,
		onremove: true,
		derivation: "reqicai",
		filter(event, player) {
			if (event.name == "disableEquip" || event.name == "enableEquip") {
				if (!event.slots.includes("equip5")) {
					return false;
				}
			} else if (event.name != "phase" && (event.name != "equip" || event.player != player)) {
				var evt = event.getl(player);
				if (!evt || !evt.es || !evt.es.some(i => get.subtypes(i).includes("equip5"))) {
					return false;
				}
			}
			var skills = player.additionalSkills["relinglong"];
			return (skills && skills.length > 0) != player.hasEmptySlot(5);
		},
		direct: true,
		content() {
			player.removeAdditionalSkill("relinglong");
			if (player.hasEmptySlot(5)) {
				player.addAdditionalSkill("relinglong", ["reqicai"]);
			}
		},
		group: ["linglong_bagua", "relinglong_directhit"],
		mod: {
			maxHandcard(player, num) {
				if (!player.hasEmptySlot(3) || !player.hasEmptySlot(4)) {
					return;
				}
				return num + 2;
			},
		},
		subSkill: {
			directhit: {
				audio: "relinglong",
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					if (event.card.name != "sha" && get.type(event.card, null, false) != "trick") {
						return false;
					}
					for (var i = 2; i < 6; i++) {
						if (!player.hasEmptySlot(i)) {
							return false;
						}
					}
					return true;
				},
				content() {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!arg || !arg.card || !arg.target || (arg.card.name != "sha" && get.type(arg.card, null, false) != "trick")) {
							return false;
						}
						for (var i = 2; i < 6; i++) {
							if (!player.hasEmptySlot(i)) {
								return false;
							}
						}
						return true;
					},
				},
			},
		},
	},
	//张松
	rexiantu: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player != player;
		},
		logTarget: "player",
		check(event, player) {
			if (get.attitude(_status.event.player, event.player) < 1) {
				return false;
			}
			return player.hp > 1 || player.hasCard(card => (get.name(card) === "tao" || get.name(card) === "jiu") && lib.filter.cardEnabled(card, player), "hs");
		},
		async content(event, trigger, player) {
			if (get.mode() !== "identity" || player.identity !== "nei") {
				player.addExpose(0.2);
			}
			await player.draw(2);
			if (!player.countCards("he")) {
				return;
			}
			const result = await player
				.chooseCard(2, "he", true, "交给" + get.translation(trigger.player) + "两张牌")
				.set("ai", function (card) {
					if (ui.selected.cards.length && card.name == ui.selected.cards[0].name) {
						return -1;
					}
					if (get.tag(card, "damage")) {
						return 1;
					}
					if (get.type(card) == "equip") {
						return 1;
					}
					return 0;
				})
				.forResult();
			if (result?.cards?.length) {
				const target = trigger.player;
				await player.give(result.cards, target);
				target.addTempSkill("rexiantu_check", "phaseUseAfter");
				target.markAuto("rexiantu_check", [player]);
			}
		},
		ai: {
			threaten(player, target) {
				return (
					1 +
					game.countPlayer(current => {
						if (current != target && get.attitude(target, current) > 0) {
							return 0.5;
						}
						return 0;
					})
				);
			},
			expose: 0.3,
		},
		subSkill: {
			check: {
				charlotte: true,
				trigger: { player: "phaseUseEnd" },
				forced: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					return !player.getHistory("sourceDamage", evt => {
						return evt.getParent("phaseUse") == event;
					}).length;
				},
				content() {
					var targets = player.getStorage("rexiantu_check");
					targets.sortBySeat();
					for (var i of targets) {
						if (i.isIn()) {
							i.loseHp();
						}
					}
					player.removeSkill("rexiantu_check");
				},
			},
		},
	},
	//新服公孙瓒
	dcyicong: {
		trigger: {
			player: ["changeHp"],
		},
		audio: 2,
		forced: true,
		filter(event, player) {
			return get.sgn(player.getDamagedHp() - 1.5) != get.sgn(player.getDamagedHp() - 1.5 + event.num);
		},
		content() {},
		mod: {
			globalFrom(from, to, current) {
				return current - 1;
			},
			globalTo(from, to, current) {
				if (to.getDamagedHp() >= 2) {
					return current + 1;
				}
			},
		},
		ai: {
			threaten: 0.8,
		},
	},
	//朱治
	reanguo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			let draw, recover, equip;
			if (target.isMinHandcard()) {
				await target.draw();
				draw = true;
			}
			if (target.isMinHp() && target.isDamaged()) {
				await target.recover();
				recover = true;
			}
			if (target.isMinEquip()) {
				const cardx = get.cardPile(
					function (card) {
						return get.type(card) == "equip" && target.hasUseTarget(card);
					},
					false,
					"random"
				);
				if (cardx) {
					await target.chooseUseTarget(cardx, "nothrow", "nopopup", true);
					equip = true;
				}
			}
			game.updateRoundNumber();

			if (!draw && player.isMinHandcard()) {
				await player.draw();
				draw = true;
			}
			if (!recover && player.isMinHp() && player.isDamaged()) {
				await player.recover();
				recover = true;
			}
			if (!equip && player.isMinEquip()) {
				const cardx = get.cardPile(function (card) {
					return get.type(card) == "equip" && player.hasUseTarget(card);
				});
				if (cardx) {
					await player.chooseUseTarget(cardx, "nothrow", "nopopup", true);
					equip = true;
				}
			}

			if (draw && recover && equip) {
				const result = await player
					.chooseCard("安国：是否重铸任意张牌？", [1, Infinity], lib.filter.cardRecastable, "he")
					.set("ai", card => {
						return 6 - get.value(card);
					})
					.forResult();
				if (result?.bool) {
					await player.recast(result.cards);
				}
			}
		},
		ai: {
			threaten: 1.65,
			order: 9,
			result: {
				player(player, target) {
					if (get.attitude(player, target) <= 0) {
						if (target.isMinHandcard() || target.isMinEquip() || target.isMinHp()) {
							return -1;
						}
					}
					let num = 0;
					if (player.isMinHandcard() || target.isMinHandcard()) {
						num++;
					}
					if (player.isMinEquip() || target.isMinEquip()) {
						num++;
					}
					if ((player.isMinHp() && player.isDamaged()) || (target.isMinHp() && target.isDamaged())) {
						num += 2.1;
					}
					return num;
				},
			},
		},
	},
	//颜良文丑
	olshuangxiong: {
		audio: 2,
		trigger: { player: "phaseDrawEnd" },
		filter: (event, player) => player.countCards("he") > 0,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("he", get.prompt("olshuangxiong"), "弃置一张牌，然后你本回合内可以将一张与此牌颜色不同的牌当做【决斗】使用", "chooseonly")
				.set("ai", function (card) {
					let player = _status.event.player;
					if (!_status.event.goon || player.skipList.includes("phaseUse")) {
						return -get.value(card);
					}
					let color = get.color(card),
						effect = 0,
						cards = player.getCards("hes"),
						sha = false;
					for (const cardx of cards) {
						if (cardx == card || get.color(cardx) == color) {
							continue;
						}
						const cardy = get.autoViewAs({ name: "juedou" }, [cardx]),
							eff1 = player.getUseValue(cardy);
						if (get.position(cardx) == "e") {
							let eff2 = get.value(cardx);
							if (eff1 > eff2) {
								effect += eff1 - eff2;
							}
							continue;
						} else if (get.name(cardx) == "sha") {
							if (sha) {
								effect += eff1;
								continue;
							} else {
								sha = true;
							}
						}
						let eff2 = player.getUseValue(cardx, null, true);
						if (eff1 > eff2) {
							effect += eff1 - eff2;
						}
					}
					return effect - get.value(card);
				})
				.set("goon", player.hasValueTarget({ name: "juedou" }) && !player.hasSkill("olshuangxiong_effect"))
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event,
				color = get.color(cards[0], player);
			await player.modedDiscard(cards);
			player.markAuto("olshuangxiong_effect", [color]);
			player.addTempSkill("olshuangxiong_effect");
		},
		group: "olshuangxiong_jianxiong",
		subSkill: {
			effect: {
				audio: "olshuangxiong",
				enable: "chooseToUse",
				viewAs: { name: "juedou" },
				position: "hes",
				viewAsFilter(player) {
					return player.hasCard(card => lib.skill.olshuangxiong_effect.filterCard(card, player), "hes");
				},
				filterCard(card, player) {
					const color = get.color(card),
						colors = player.getStorage("olshuangxiong_effect");
					for (const i of colors) {
						if (color != i) {
							return true;
						}
					}
					return false;
				},
				prompt() {
					const colors = _status.event.player.getStorage("olshuangxiong_effect");
					let str = "将一张颜色";
					for (let i = 0; i < colors.length; i++) {
						if (i > 0) {
							str += "或";
						}
						str += "不为";
						str += get.translation(colors[i]);
					}
					str += "的牌当做【决斗】使用";
					return str;
				},
				check(card) {
					const player = _status.event.player;
					if (get.position(card) == "e") {
						const raw = get.value(card);
						const eff = player.getUseValue(get.autoViewAs({ name: "juedou" }, [card]));
						return eff - raw;
					}
					const raw = player.getUseValue(card, null, true);
					const eff = player.getUseValue(get.autoViewAs({ name: "juedou" }, [card]));
					return eff - raw;
				},
				onremove: true,
				charlotte: true,
				ai: { order: 7 },
			},
			jianxiong: {
				audio: "olshuangxiong",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				locked: false,
				filter(event, player) {
					return player.hasHistory("damage", function (evt) {
						//Disable Umi Kato's chaofan
						return evt.card && evt.cards && evt.cards.some(card => get.position(card, true));
					});
				},
				content() {
					const cards = [];
					player.getHistory("damage", function (evt) {
						if (evt.card && evt.cards) {
							cards.addArray(evt.cards.filterInD("d"));
						}
					});
					if (cards.length) {
						player.gain(cards, "gain2");
					}
				},
			},
		},
	},
	//新李典
	xinwangxi: {
		audio: "wangxi",
		inherit: "wangxi",
		async content(event, trigger, player) {
			const target = get.info(event.name).logTarget(trigger, player);
			await player.draw(2);
			if (player.countCards("he") && target.isIn()) {
				await player.chooseToGive(target, "he", true);
			}
		},
	},
	//OL界火诸葛
	olhuoji: {
		audio: "rehuoji",
		audioname: ["ol_sp_zhugeliang", "ol_pangtong"],
		trigger: { player: "huogongBegin" },
		forced: true,
		locked: false,
		popup: false,
		group: "olhuoji_viewAs",
		content() {
			trigger.setContent(lib.skill.olhuoji.huogongContent);
		},
		async huogongContent(event, trigger, player) {
			const { target } = event;
			if (target.countCards("h") == 0) {
				return;
			}
			const cards = target.getCards("h").randomGets(1),
				card = cards[0];
			await target.showCards(cards).setContent(function () {});
			event.dialog = ui.create.dialog(get.translation(target) + "展示的手牌", cards);
			event.videoId = lib.status.videoId++;

			game.broadcast("createDialog", event.videoId, get.translation(target) + "展示的手牌", cards);
			game.addVideo("cardDialog", null, [get.translation(target) + "展示的手牌", get.cardsInfo(cards), event.videoId]);
			game.log(target, "展示了", card);
			const result = await player
				.chooseToDiscard({ color: get.color(card) }, "h", function (card) {
					var evt = _status.event.getParent();
					if (get.damageEffect(evt.target, evt.player, evt.player, "fire") > 0) {
						return 7 - get.value(card, evt.player);
					}
					return -1;
				})
				.set("prompt", false)
				.forResult();
			//game.delay(2);
			if (result?.bool) {
				await target.damage("fire");
			} else {
				target.addTempSkill("huogong2");
			}
			event.dialog.close();
			game.addVideo("cardDialog", null, event.videoId);
			game.broadcast("closeDialog", event.videoId);
		},
		subSkill: { viewAs: { inherit: "rehuoji", audio: "rehuoji" } },
	},
	olkanpo: {
		audio: "rekanpo",
		audioname: ["ol_sp_zhugeliang", "ol_pangtong"],
		trigger: { player: "useCard" },
		forced: true,
		locked: false,
		popup: false,
		group: "olkanpo_viewAs",
		filter(event, player) {
			return event.card.name == "wuxie";
		},
		content() {
			trigger.directHit.addArray(game.players);
		},
		subSkill: { viewAs: { inherit: "rekanpo", audio: "rekanpo" } },
	},
	//新杀界曹植
	dcjiushi: {
		audio: 2,
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return event.card.name == "jiu";
		},
		forced: true,
		locked: false,
		content() {
			player.addTempSkill("dcjiushi_sha", { player: "phaseEnd" });
			player.addMark("dcjiushi_sha", 1, false);
		},
		group: ["dcjiushi_use", "dcjiushi_damage"],
		subSkill: {
			use: {
				audio: "dcjiushi",
				enable: "chooseToUse",
				hiddenCard(player, name) {
					if (name == "jiu") {
						return !player.isTurnedOver();
					}
					return false;
				},
				filter(event, player) {
					if (player.isTurnedOver()) {
						return false;
					}
					return event.filterCard({ name: "jiu", isCard: true }, player, event);
				},
				async content(event, trigger, player) {
					if (_status.event.getParent(2).type == "dying") {
						event.dying = player;
						event.type = "dying";
					}
					await player.turnOver();
					await player.useCard({ name: "jiu", isCard: true }, player);
				},
				ai: {
					save: true,
					skillTagFilter(player, tag, arg) {
						return !player.isTurnedOver() && _status.event?.dying == player;
					},
					order: 5,
					result: {
						player(player) {
							if (_status.event.parent.name == "phaseUse") {
								if (player.countCards("h", "jiu") > 0) {
									return 0;
								}
								if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) {
									return 0;
								}
								if (!player.countCards("h", "sha")) {
									return 0;
								}
								var targets = [];
								var target;
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (get.attitude(player, players[i]) < 0) {
										if (player.canUse("sha", players[i], true, true)) {
											targets.push(players[i]);
										}
									}
								}
								if (targets.length) {
									target = targets[0];
								} else {
									return 0;
								}
								var num = get.effect(target, { name: "sha" }, player, player);
								for (var i = 1; i < targets.length; i++) {
									var num2 = get.effect(targets[i], { name: "sha" }, player, player);
									if (num2 > num) {
										target = targets[i];
										num = num2;
									}
								}
								if (num <= 0) {
									return 0;
								}
								var e2 = target.getEquip(2);
								if (e2) {
									if (e2.name == "tengjia") {
										if (
											!player.countCards("h", {
												name: "sha",
												nature: "fire",
											}) &&
											!player.getEquip("zhuque")
										) {
											return 0;
										}
									}
									if (e2.name == "renwang") {
										if (!player.countCards("h", { name: "sha", color: "red" })) {
											return 0;
										}
									}
									if (e2.name == "baiyin") {
										return 0;
									}
								}
								if (player.getEquip("guanshi") && player.countCards("he") > 2) {
									return 1;
								}
								return target.countCards("h") > 3 ? 0 : 1;
							}
							if (player == _status.event.dying || player.isTurnedOver()) {
								return 3;
							}
						},
					},
					effect: {
						target(card, player, target) {
							if (target.isTurnedOver()) {
								if (get.tag(card, "damage")) {
									if (player.hasSkillTag("jueqing", false, target)) {
										return [1, -2];
									}
									if (target.hp == 1) {
										return;
									}
									return [1, target.countCards("h") / 2];
								}
							}
						},
					},
				},
			},
			damage: {
				audio: "dcjiushi",
				trigger: { player: "damageEnd" },
				check(event, player) {
					return player.isTurnedOver();
				},
				prompt: "是否发动【酒诗】，将武将牌翻面？",
				filter(event, player) {
					if (event.checkJiushi) {
						return true;
					}
					return false;
				},
				content() {
					player.turnOver();
				},
			},
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("dcjiushi_sha");
						}
					},
				},
			},
		},
	},
	//OL界黄忠
	remoshi: {
		trigger: { source: "damageSource" },
		forced: true,
		filter(event, player) {
			return event.player.isIn() && event.card && event.card.name == "sha" && event.cards.filterInD("od").length && event.notLink() && [2, 3, 4].some(i => event.player.getEquips(i).length > 0);
		},
		group: "remoshi_retrieve",
		content() {
			trigger.player.addSkill("remoshi_stuck");
			trigger.player.addToExpansion(trigger.cards.filterInD("od"), "gain2").gaintag.add("remoshi_stuck");
		},
		subSkill: {
			retrieve: {
				audio: "remoshi",
				trigger: {
					global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player, name, target) {
					return target.isIn() && target.countExpansions("remoshi_stuck");
				},
				getIndex(event, player) {
					const keys = ["equip2", "equip3", "equip4"];
					return game
						.filterPlayer(current => {
							if (event.name == "gain" && current == player) {
								return false;
							}
							const cards = current.getExpansions("remoshi_stuck");
							if (!cards.length) {
								return false;
							}
							const evt = event.getl(current);
							if (evt && evt.cards2 && evt.cards2.some(i => get.subtypes(i).some(slot => keys.includes(slot)))) {
								return true;
							}
						})
						.sortBySeat();
				},
				forced: true,
				logTarget: (event, player, name, target) => target,
				async content(event, trigger, player) {
					const target = event.indexedData;
					const cards = target.getExpansions("remoshi_stuck");
					await player.gain(cards, target, "give", "bySelf");
				},
			},
			stuck: {
				marktext: "矢",
				charlotte: true,
				intro: {
					name: "没矢",
					name2: "矢",
					content: "expansion",
					markcount: "expansion",
				},
				onremove(player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) {
						player.loseToDiscardpile(cards);
					}
				},
			},
		},
	},
	//界文聘
	rezhenwei: {
		audio: "zhenwei",
		inherit: "zhenwei",
		filter(event, player) {
			if (player == event.target) {
				return false;
			}
			if (!player.countCards("he")) {
				return false;
			}
			if (event.targets.length > 1) {
				return false;
			}
			if (!event.target) {
				return false;
			}
			if (event.target.hp > player.hp) {
				return false;
			}
			var card = event.card;
			if (card.name == "sha") {
				return true;
			}
			if (get.color(card) == "black" && get.type(card, "trick") == "trick") {
				return true;
			}
			return false;
		},
	},
	//界关张……
	retongxin: {
		mod: {
			attackRange: (player, num) => num + 2,
		},
	},
	//马忠
	refuman: {
		audio: 2,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			var stat = player.getStat("skill").refuman_targets;
			return !stat || !stat.includes(target);
		},
		filter(event, player) {
			return player.countCards("he") > 0 && game.hasPlayer(current => lib.skill.refuman.filterTarget(null, player, current));
		},
		filterCard: lib.filter.cardDiscardable,
		position: "he",
		content() {
			var card = get.discardPile(card => card.name == "sha");
			if (card) {
				target.gain(card, "gain2").gaintag.add("refuman");
				target.addTempSkill("refuman2", { player: "phaseAfter" });
				player.addSkill("refuman_draw");
			}
			var stat = player.getStat("skill");
			if (!stat.refuman_targets) {
				stat.refuman_targets = [];
			}
			stat.refuman_targets.push(target);
		},
		check(card) {
			return get.discardPile(card => card.name == "sha") ? 6 - get.value(card) : 0;
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					if (!target.hasSha()) {
						return 1.2;
					}
					return 1;
				},
			},
		},
		subSkill: {
			draw: {
				charlotte: true,
				audio: "refuman",
				trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
				getIndex(event, player) {
					return game
						.filterPlayer2(target => {
							const evt = event.getParent();
							if (!["useCard", "respond"].includes(evt?.name) && !target.isIn()) {
								return false;
							}
							if (event.name == "lose") {
								if (target !== event.player || event.refuman_active) {
									return false;
								}
								return Object.values(event.gaintag_map).flat().includes("refuman");
							}
							return target.hasHistory("lose", evt => {
								if (event !== evt.getParent() || evt.refuman_active) {
									return false;
								}
								return Object.values(evt.gaintag_map).flat().includes("refuman");
							});
						})
						.sortBySeat();
				},
				forced: true,
				filter: (event, player, name, target) => target,
				logTarget: (event, player, name, target) => target,
				content() {
					const [target] = event.targets,
						evt = trigger.getParent();
					if (["useCard", "respond"].includes(evt?.name)) {
						game.asyncDraw([target, player]);
					} else {
						target.draw();
					}
					trigger.refuman_active = true;
				},
			},
		},
	},
	refuman2: {
		charlotte: true,
		onremove(player) {
			player.removeGaintag("refuman");
		},
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("refuman")) {
					return num + 1;
				}
			},
		},
	},
	//十周年陈群
	repindi: {
		audio: 2,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return !player.getStorage("repindi_target").includes(target);
		},
		filterCard(card, player) {
			return !player.getStorage("repindi_type").includes(get.type2(card));
		},
		check(card) {
			var num = _status.event.player.getStat("skill").repindi || 0;
			return 6 + num - get.value(card);
		},
		position: "he",
		async content(event, trigger, player) {
			const { target, cards } = event,
				num = player.getStat("skill").repindi;
			player.addTempSkill("repindi_clear", ["phaseUseAfter", "phaseAfter"]);
			player.markAuto("repindi_target", [target]);
			player.markAuto("repindi_type", [get.type2(cards[0], cards[0].original == "h" ? player : false)]);
			player.syncStorage();
			let result;
			if (target.countCards("he") == 0) {
				result = { index: 0 };
			} else {
				result = await player
					.chooseControlList(true, ["令" + get.translation(target) + "摸" + get.cnNumber(num) + "张牌", "令" + get.translation(target) + "弃置" + get.cnNumber(num) + "张牌"], function () {
						return _status.event.choice;
					})
					.set("choice", get.attitude(player, target) > 0 ? 0 : 1)
					.forResult();
			}
			if (result?.index == 0) {
				await target.draw(num);
			} else {
				await target.chooseToDiscard(num, "he", true);
			}
			if (target.isDamaged()) {
				await player.link();
			}
		},
		subSkill: {
			clear: {
				trigger: { player: "phaseAfter" },
				charlotte: true,
				silent: true,
				onremove(player) {
					delete player.storage.repindi_target;
					delete player.storage.repindi_type;
				},
			},
		},
		ai: {
			order: 8,
			threaten: 1.9,
			result: {
				target(player, target) {
					var att = get.attitude(player, target);
					var num = (player.getStat("skill").repindi || 0) + 1;
					if (att <= 0 && target.countCards("he") < num) {
						return 0;
					}
					return get.sgn(att);
				},
			},
		},
	},
	//十周年孙登
	rekuangbi: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("rekuangbi"), (card, player, target) => {
					return target.countCards("he") > 0 && target != player;
				})
				.set("ai", target => {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (_status.event.goon) {
						if (att > 0) {
							return att * Math.sqrt(target.countCards("he"));
						}
						return (1 - att) / (target.countCards("he") + 1);
					}
					return (-10 * att) / (target.countCards("he") + 1);
				})
				.set("goon", player.countCards("hs", card => player.hasValueTarget(card)) >= 2)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const result = await target
				.chooseCard("匡弼：将至多三张牌置于" + get.translation(player) + "的武将牌上", "he", [1, 3], true)
				.set("ai", card => {
					if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
						return 7 - get.value(card);
					}
					return -get.value(card);
				})
				.forResult();
			if (result?.bool) {
				await player.addToExpansion(result.cards, target, "give").set("gaintag", ["rekuangbi_effect"]);
				player.addTempSkill("rekuangbi_effect", "phaseUseEnd");
				player.markAuto("rekuangbi_effect", [target]);
			}
		},
		subSkill: {
			effect: {
				audio: "rekuangbi",
				mod: {
					aiOrder(player, card, num) {
						if (num <= 0 || !player.getExpansions("rekuangbi_effect").length) {
							return;
						}
						let suit = get.suit(card);
						if (player.getExpansions("rekuangbi_effect").some(i => get.suit(i) == suit)) {
							return num + 10;
						}
						return num / 4;
					},
				},
				trigger: { player: "useCard" },
				charlotte: true,
				forced: true,
				filter(event, player) {
					return player.getExpansions("rekuangbi_effect").length > 0;
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("rekuangbi_effect");
					const suit = get.suit(trigger.card),
						cardsx = cards.filter(card => get.suit(card) == suit);
					const len = cardsx.length;
					let result;
					if (len > 1) {
						result = await player
							.chooseButton(["匡弼：移去一张同花色的“匡弼”牌", cards], true)
							.set("filterButton", button => {
								return get.suit(button.link) == _status.event.suit;
							})
							.set("suit", suit)
							.forResult();
					} else if (len == 1) {
						result = { bool: true, links: cardsx };
					} else {
						result = { bool: false, links: [cards.randomGet()] };
					}
					if (result?.links?.length) {
						await player.loseToDiscardpile(result.links);
						await game.delayx();
					}
					if (result?.bool) {
						await player.draw("nodelay");
						const target = player.getStorage("rekuangbi_effect")[0];
						if (target?.isIn()) {
							await target.draw();
						}
					} else {
						await player.draw();
					}
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
					delete player.storage[skill];
				},
			},
		},
	},
	//十周年蔡邕
	rebizhuan: {
		audio: 2,
		trigger: {
			player: "useCard",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.name != "useCard" && event.player == event.target) {
				return false;
			}
			var num = 4 + Math.min(player.countMark("retongbo"), game.countPlayer());
			if (player.getExpansions("rebizhuan").length >= num) {
				return false;
			}
			return get.suit(event.card) == "spade";
		},
		marktext: "书",
		intro: {
			name: "辟撰(书)",
			name2: "书",
			content: "expansion",
			markcount: "expansion",
		},
		frequent: true,
		locked: false,
		content() {
			player.addToExpansion(get.cards(), "gain2").gaintag.add("rebizhuan");
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("rebizhuan").length;
			},
		},
		ai: {
			notemp: true,
		},
	},
	retongbo: {
		audio: 2,
		trigger: { player: "phaseDrawAfter" },
		direct: true,
		filter(event, player) {
			return player.getExpansions("rebizhuan").length > 0 && player.countCards("he") > 0;
		},
		async content(event, trigger, player) {
			const next = player.chooseToMove("通博：是否交换“书”和手牌？");
			next.set("list", [
				[get.translation(player) + "（你）的“书”", player.getExpansions("rebizhuan")],
				["你的牌", player.getCards("he")],
			]);
			next.set("filterMove", function (from, to) {
				return typeof to != "number";
			});
			next.set("processAI", function (list) {
				const player = _status.event.player;
				let cards = list[0][1].concat(list[1][1]),
					cards2 = [];
				cards.sort((a, b) => {
					return get.useful(a) - get.useful(b);
				});
				cards2 = cards.splice(0, player.getExpansions("rebizhuan").length);
				return [cards2, cards];
			});
			const result = await next.forResult();
			if (result?.bool) {
				const pushs = result.moved[0],
					gains = result.moved[1];
				pushs.removeArray(player.getExpansions("rebizhuan"));
				gains.removeArray(player.getCards("he"));
				if (!pushs.length || pushs.length != gains.length) {
					return;
				}
				player.logSkill("retongbo");
				await player.addToExpansion(pushs, "give", player).set("gaintag", ["rebizhuan"]);
				await player.gain(gains, "gain2");
				const cards = player.getExpansions("rebizhuan").slice(0);
				if (cards.length < 4) {
					return;
				}
				event.given = [];
				const list = cards.map(card => get.suit(card)).unique();
				if (list.length >= 4 && player.hp <= 2) {
					event.four = true;
				}
				while (event.given.length < 4) {
					const resultx = await player
						.chooseCardButton("是否将" + get.cnNumber(4 - event.given.length) + "张“书”交给任意名其他角色？", cards, [1, 4 - event.given.length], event.given.length > 0)
						.set("ai", function (button) {
							if (!_status.event.goon) {
								return 0;
							}
							var four = _status.event.getParent().four,
								given = _status.event.getParent().given;
							if (four) {
								return get.value(button.link) + (given.map(i => get.suit(i)).includes(get.suit(button.link)) ? 0 : 10);
							}
							if (ui.selected.buttons.length == 0) {
								return get.value(button.link);
							}
							return 0;
						})
						.set(
							"goon",
							game.hasPlayer(current => current != player && get.attitude(player, current) > 0)
						)
						.forResult();
					if (resultx?.bool) {
						for (var i = 0; i < resultx.links.length; i++) {
							cards.remove(resultx.links[i]);
						}
						const togive = resultx.links.slice(0);
						event.given.addArray(togive);
						const resulty = await player
							.chooseTarget("将" + get.translation(resultx.links) + "交给一名其他角色", true, function (card, player, target) {
								return target != player;
							})
							.set("ai", function (target) {
								var att = get.attitude(_status.event.player, target);
								if (_status.event.enemy) {
									return -att;
								} else if (att > 0) {
									return att / (1 + target.countCards("h"));
								} else {
									return att / 100;
								}
							})
							.set("enemy", get.value(togive[0], player, "raw") < 0)
							.forResult();
						if (resulty?.targets?.length) {
							const target = resulty.targets[0];
							player.line(target, "green");
							game.log(target, "获得了" + get.cnNumber(togive.length) + "张", "#g“书”");
							await target.gain(togive, "draw").set("giver", player);
						}
					} else {
						return;
					}
				}
				if (event.given.length == 4) {
					const suits = lib.suit.slice(0);
					event.given.forEach(i => suits.remove(get.suit(i, player)));
					if (suits.length == 0) {
						await player.recover();
						player.addMark("retongbo", 1, false);
					}
				}
			}
		},
		marktext: "博",
		intro: {
			content(storage, player) {
				var num = 4 + Math.min(storage, game.countPlayer());
				return "“书”的上限+" + num;
			},
		},
		ai: {
			combo: "rebizhuan",
		},
	},
	//十周年陈宫
	remingce: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		position: "he",
		filterCard(card) {
			return get.name(card) == "sha" || get.type(card) == "equip";
		},
		filter(event, player) {
			return player.countCards("h", "sha") > 0 || player.countCards("he", { type: "equip" }) > 0;
		},
		check(card) {
			return 8 - get.value(card);
		},
		selectTarget: 2,
		multitarget: true,
		discard: false,
		lose: false,
		targetprompt: ["得到牌", "出杀目标"],
		filterTarget(card, player, target) {
			if (ui.selected.targets.length == 0) {
				return player != target;
			}
			return true;
		},
		delay: false,
		async content(event, trigger, player) {
			const { cards, targets } = event;
			await player.give(cards, targets[0], "visible");
			let result;
			if (!targets[0].canUse({ name: "sha", isCard: true }, targets[1], false, false)) {
				result = { control: "选项二" };
			} else {
				result = await targets[0]
					.chooseControl()
					.set("ai", function () {
						var player = _status.event.player,
							target = _status.event.target;
						return get.effect(target, { name: "sha", isCard: true }, player, player) > 0 ? 0 : 1;
					})
					.set("choiceList", ["视为对" + get.translation(targets[1]) + "使用一张【杀】，若此杀造成伤害则执行选项二", "你与" + get.translation(player) + "各摸一张牌"])
					.set("target", targets[1])
					.set("prompt", "对" + get.translation(targets[1]) + "使用一张杀，或摸一张牌")
					.forResult();
			}
			if (result?.control == "选项二") {
				await game.asyncDraw([player, targets[0]]);
				return;
			} else {
				await targets[0].useCard({ name: "sha", isCard: true }, targets[1]);
				if (
					targets[0].hasHistory("useCard", evt => {
						return evt.getParent() == event && targets[0].hasHistory("sourceDamage", evtx => evt.card == evtx.card);
					})
				) {
					await game.asyncDraw([player, targets[0]]);
				}
			}
		},
		ai: {
			result: {
				player(player) {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != player && get.attitude(player, players[i]) > 1 && get.attitude(players[i], player) > 1) {
							return 1;
						}
					}
					return 0;
				},
				target(player, target) {
					if (ui.selected.targets.length) {
						return -0.1;
					}
					return 1;
				},
			},
			order: 8.5,
			expose: 0.2,
		},
	},
	// 界荀攸
	reqice: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return player.countMark("reqice_mark") + 1;
		},
		filter(event, player) {
			const hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			if (
				hs.some(card => {
					const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					return mod2 === false;
				})
			) {
				return false;
			}
			return lib.inpile.some(name => {
				if (get.type(name) != "trick") {
					return false;
				}
				const card = get.autoViewAs({ name }, hs);
				return event.filterCard(card, player, event);
			});
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					if (get.type(lib.inpile[i]) == "trick") {
						list.push(["锦囊", "", lib.inpile[i]]);
					}
				}
				return ui.create.dialog(get.translation("reqice"), [list, "vcard"]);
			},
			filter(button, player) {
				const event = _status.event.getParent(),
					card = get.autoViewAs(
						{
							name: button.link[2],
						},
						player.getCards("h")
					);
				return event.filterCard(card, player, event);
			},
			check(button) {
				var player = _status.event.player;
				var effect = player.getUseValue(button.link[2]);
				if (player.countCards("hs", button.link[2]) > 0) {
					return 0;
				}
				if ((player.getStat("skill").reqice || 0) < player.countMark("reqice_mark") + 1) {
					if (["draw", "gain"].some(i => get.tag(button.link[2], i) >= 1)) {
						return effect * 5;
					}
				}
				if (effect > 0) {
					return effect;
				}
				return 0;
			},
			backup(links, player) {
				return {
					filterCard: true,
					selectCard: -1,
					position: "h",
					audio: "reqice",
					popname: true,
					viewAs: { name: links[0][2] },
				};
			},
			prompt(links, player) {
				return "将所有手牌当【" + get.translation(links[0][2]) + "】使用";
			},
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					var num = 0;
					var cards = player.getCards("h");
					if (cards.length >= 3 && player.hp >= 3 && player.countMark("reqice_mark") < 2) {
						return 0;
					}
					for (var i = 0; i < cards.length; i++) {
						num += Math.max(0, get.value(cards[i], player, "raw"));
					}
					num /= cards.length;
					num /= (player.countMark("reqice_mark") + 1) * 1.3;
					num *= Math.min(cards.length, player.hp);
					return 13 - num;
				},
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat("skill").reqice && player.hasCard(card => get.name(card) != "tao", "h");
				}
			},
			threaten: 1.7,
		},
		subSkill: {
			backup: {},
			mark: {
				charlotte: true,
				onremove: true,
				intro: {
					name2: "奇策",
					content: "mark",
				},
			},
		},
	},
	rezhiyu: {
		audio: 2,
		trigger: { player: "damageEnd" },
		async content(event, trigger, player) {
			await player.draw();
			if (!player.countCards("h")) {
				return;
			} else {
				await player.showHandcards();
			}
			let result;
			if (!trigger.source?.isIn()) {
				result = { bool: false, cards: [] };
			} else {
				result = await trigger.source.chooseToDiscard("智愚：请弃置一张手牌", true).forResult();
			}
			let cards = player.getCards("h");
			const bool = cards.map(card => get.color(card, player)).unique().length == 1;
			if (bool) {
				cards = result.cards.filterInD("d");
				if (cards.length) {
					await player.gain(cards, "gain2");
				}
				player.addMark("reqice_mark", 1);
				player.addTempSkill("reqice_mark", { player: "phaseAfter" });
			}
		},
		ai: {
			maixie_defend: true,
			threaten: 0.85,
		},
	},
	oljiang: {
		audio: "jiang",
		inherit: "jiang",
		group: "oljiang_gain",
		subSkill: {
			gain: {
				audio: "jiang",
				audioname: ["sp_lvmeng", "re_sunben", "re_sunce"],
				trigger: { global: ["loseAfter", "loseAsyncAfter"] },
				usable: 1,
				filter(event, player) {
					if (player.hp < 1 || event.type != "discard" || event.position != ui.discardPile) {
						return false;
					}
					var filter = card => card.name == "juedou" || (card.name == "sha" && get.color(card, false) == "red");
					var cards = event.getd().filter(filter);
					if (!cards.filter(card => get.position(card, true) == "d").length) {
						return false;
					}
					var searched = false;
					if (
						game.getGlobalHistory("cardMove", function (evt) {
							if (searched || evt.type != "discard" || evt.position != ui.discardPile) {
								return false;
							}
							var evtx = evt;
							if (evtx.getlx === false) {
								evtx = evt.getParent();
							}
							var cards = evtx.getd().filter(filter);
							if (!cards.length) {
								return false;
							}
							searched = true;
							return evtx != event;
						}).length > 0
					) {
						return false;
					}
					return true;
				},
				prompt2(event, player) {
					var cards = event.getd().filter(function (card) {
						return (card.name == "juedou" || (card.name == "sha" && get.color(card, false) == "red")) && get.position(card, true) == "d";
					});
					return "失去1点体力并获得" + get.translation(cards);
				},
				check(event, player) {
					return player.hp > 1 && !player.storage.olhunzi;
				},
				content() {
					player.loseHp();
					var cards = trigger.getd().filter(function (card) {
						return (card.name == "juedou" || (card.name == "sha" && get.color(card, false) == "red")) && get.position(card, true) == "d";
					});
					if (cards.length > 0) {
						player.gain(cards, "gain2");
					}
				},
			},
		},
	},
	//李儒
	dcmieji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCard(lib.skill.dcmieji.filterCard, "eh");
		},
		position: "he",
		filterCard(card) {
			if (get.subtype(card) == "equip1") {
				return true;
			}
			return get.color(card) == "black" && get.type(card, "trick") == "trick";
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		discard: false,
		delay: false,
		check(card) {
			return 8 - get.value(card);
		},
		loseTo: "cardPile",
		insert: true,
		visible: true,
		async content(event, trigger, player) {
			const { cards, target } = event;
			await player.showCards(cards);
			const result = await target.chooseToDiscard("he", true).set("prompt", "请弃置一张锦囊牌，或依次弃置两张非锦囊牌。").forResult();
			if (
				(!result.cards || get.type(result.cards[0], "trick", result.cards[0].original == "h" ? target : false) != "trick") &&
				target.countCards("he", function (card) {
					return get.type(card, "trick") != "trick";
				})
			) {
				await target
					.chooseToDiscard("he", true, function (card) {
						return get.type(card, "trick") != "trick";
					})
					.set("prompt", "请弃置第二张非锦囊牌");
			}
		},
		ai: {
			order: 9,
			result: {
				target: -1,
			},
		},
	},
	dcfencheng: {
		audio: 2,
		audioname: ["ol_liru"],
		audioname2: {
			ol_sb_dongzhuo: "dcfencheng_ol_sb_dongzhuo",
			ol_sb_dongzhuo_shadow1: "dcfencheng_ol_sb_dongzhuo",
			ol_sb_dongzhuo_shadow2: "dcfencheng_ol_sb_dongzhuo",
		},
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		limited: true,
		line: "fire",
		skillAnimation: "epic",
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			let targets = game.filterPlayer(current => current != player);
			targets.sortBySeat(event.target);
			let num = 1;
			if (targets.length) {
				for (const target of targets) {
					if (target.isIn()) {
						player.line(target, "fire");
						const { result } = await target
							.chooseToDiscard("he", "焚城：弃置至少" + get.cnNumber(num) + "张牌，或受到2点火焰伤害", [num, Infinity])
							.set("ai", card => {
								if (ui.selected.cards.length >= get.event("num")) {
									return -1;
								}
								if (get.player().hasSkillTag("nofire")) {
									return -1;
								}
								if (get.event().res >= 0) {
									return 6 - get.value(card);
								}
								if (get.type(card) != "basic") {
									return 10 - get.value(card);
								}
								return 8 - get.value(card);
							})
							.set("num", num)
							.set("res", get.damageEffect(target, player, target, "fire"));

						if (!result.bool) {
							await target.damage(2, "fire");
							num = 1;
						} else {
							num = result.cards.length + 1;
						}
					}
				}
			}
		},
		subSkill: { ol_sb_dongzhuo: { audio: 1 } },
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.hasUnknown(2)) {
						return 0;
					}
					let num = 0,
						eff = 0,
						players = game
							.filterPlayer(current => {
								return current != player;
							})
							.sortBySeat(target);
					for (const target of players) {
						if (get.damageEffect(target, player, target, "fire") >= 0) {
							num = 0;
							continue;
						}
						let shao = false;
						num++;
						if (
							target.countCards("he", card => {
								if (get.type(card) != "basic") {
									return get.value(card) < 10;
								}
								return get.value(card) < 8;
							}) < num
						) {
							shao = true;
						}
						if (shao) {
							eff -= 4 * (get.realAttitude || get.attitude)(player, target);
							num = 0;
						} else {
							eff -= (num * (get.realAttitude || get.attitude)(player, target)) / 4;
						}
					}
					if (eff < 4) {
						return 0;
					}
					return eff;
				},
			},
		},
	},
	//朱桓
	refenli: {
		audio: 2,
		group: ["refenli_draw", "refenli_use", "refenli_discard"],
		subfrequent: ["discard"],
		subSkill: {
			draw: {
				audio: "refenli",
				trigger: { player: "phaseJudgeBefore" },
				prompt: "是否发动【奋励】跳过判定和摸牌阶段？",
				filter(event, player) {
					return player.isMaxHandcard();
				},
				check(event, player) {
					if (player.hasJudge("lebu") || player.hasJudge("bingliang")) {
						return true;
					}
					if (!player.hasSkill("repingkou") || player.getHistory("skipped").length > 0) {
						return false;
					}
					return game.hasPlayer(function (current) {
						return get.attitude(player, current) < 0 && current.hp == 1 && get.damageEffect(current, player, player) > 0;
					});
				},
				content() {
					trigger.cancel();
					player.skip("phaseDraw");
				},
			},
			use: {
				audio: "refenli",
				trigger: { player: "phaseUseBefore" },
				prompt: "是否发动【奋励】跳过出牌阶段？",
				filter(event, player) {
					return player.isMaxHp();
				},
				check(event, player) {
					if (!player.hasSkill("repingkou")) {
						return false;
					}
					if (!player.needsToDiscard() || (player.countCards("e") && player.isMaxEquip())) {
						return true;
					}
					if (player.getHistory("skipped").length > 0) {
						return false;
					}
					return game.hasPlayer(function (current) {
						return get.attitude(player, current) < 0 && current.hp == 1 && get.damageEffect(current, player, player) > 0;
					});
				},
				content() {
					trigger.cancel();
				},
			},
			discard: {
				audio: "refenli",
				trigger: { player: "phaseDiscardBefore" },
				prompt: "是否发动【奋励】跳过弃牌阶段？",
				frequent: true,
				filter(event, player) {
					return player.isMaxEquip() && player.countCards("e");
				},
				content() {
					trigger.cancel();
				},
			},
		},
		ai: {
			combo: "repingkou",
		},
	},
	repingkou: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return player.getHistory("skipped").length > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget([1, player.getHistory("skipped").length], get.prompt2("repingkou"), "对至多" + get.cnNumber(player.getHistory("skipped").length) + "名其他角色各造成1点伤害。若你选择的角色数小于最大角色数，则你可以弃置其中一名目标角色装备区内的一张牌", function (card, player, target) {
					return target != player;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.slice(0).sortBySeat();
			for (const target of targets) {
				if (target.isIn()) {
					await target.damage();
				}
			}
			if (targets.length >= player.getHistory("skipped").length) {
				return;
			}
			const targets2 = targets.filter(function (target) {
				return target.countDiscardableCards(player, "e") > 0;
			});
			if (targets2.length > 0) {
				const result = await player
					.chooseTarget("是否弃置一名目标角色的一张装备牌？", function (card, player, target) {
						return _status.event.targets.includes(target);
					})
					.set("targets", targets2)
					.set("ai", function (target) {
						var att = get.attitude(player, target),
							eff = 0;
						target.getCards("e", function (card) {
							var val = get.value(card, target);
							eff = Math.max(eff, -val * att);
						});
						return eff;
					})
					.forResult();
				if (result.bool) {
					const target = result.targets[0];
					player.line(target, "green");
					const card = target.getDiscardableCards(player, "e").randomGet();
					if (card) {
						await target.discard(card);
					}
				}
			}
		},
		ai: {
			effect: {
				target(card) {
					if (card.name == "lebu" || card.name == "bingliang") {
						return 0.5;
					}
				},
			},
			combo: "refenli",
		},
	},
	//典韦
	olqiangxi: {
		audio: "qiangxi",
		audioname: ["ol_dianwei", "boss_lvbu3"],
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			if (player.hp < 1 && !player.hasCard(card => lib.skill.olqiangxi.filterCard(card), "he")) {
				return false;
			}
			return game.hasPlayer(current => lib.skill.olqiangxi.filterTarget(null, player, current));
		},
		filterCard(card) {
			return get.subtype(card) == "equip1";
		},
		position: "he",
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			var stat = player.getStat()._olqiangxi;
			return !stat || !stat.includes(target);
		},
		selectCard() {
			if (_status.event.player.hp < 1) {
				return 1;
			}
			return [0, 1];
		},
		content() {
			var stat = player.getStat();
			if (!stat._olqiangxi) {
				stat._olqiangxi = [];
			}
			stat._olqiangxi.push(target);
			if (!cards.length) {
				player.damage("nosource", "nocard");
			}
			target.damage("nocard");
		},
		ai: {
			damage: true,
			order: 8,
			result: {
				player(player, target) {
					if (ui.selected.cards.length) {
						return 0;
					}
					if (player.hp >= target.hp) {
						return -0.9;
					}
					if (player.hp <= 2) {
						return -10;
					}
					return get.damageEffect(player, player, player);
				},
				target(player, target) {
					if (!ui.selected.cards.length) {
						if (player.hp < 2) {
							return 0;
						}
						if (player.hp == 2 && target.hp >= 2) {
							return 0;
						}
						if (target.hp > player.hp) {
							return 0;
						}
					}
					return get.damageEffect(target, player, target);
				},
			},
			threaten: 1.5,
		},
	},
	olninge: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			if (player != event.player && player != event.source) {
				return false;
			}
			return event.player.getHistory("damage").indexOf(event) == 1;
		},
		logTarget: "player",
		forced: true,
		content() {
			player.draw();
			player.discardPlayerCard(trigger.player, true, "ej");
		},
	},
	//群太史慈
	rejixu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hp > 0 && player.countCards("h") > 0;
		},
		filterTarget: lib.filter.notMe,
		selectTarget() {
			return [1, _status.event.player.hp];
		},
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const { targets } = event;
			if (!event.caicuolist) {
				event.caicuolist = [];
			}
			for (const target of targets) {
				const result = await target
					.chooseBool("是否押杀？")
					.set("ai", function () {
						const evt = _status.event.getParent(),
							player = get.player();
						if (get.attitude(player, evt.player) > 0) {
							return evt.player.countCards("h", "sha") ? false : true;
						}
						if (
							evt.player.hasKnownCards(target, c => {
								return c.name == "sha";
							})
						) {
							return true;
						}
						return Math.random() < evt.player.countCards("h") / 4;
					})
					.forResult();
				if (!result) {
					continue;
				}
				if (result.bool) {
					target.chat("有杀");
					game.log(target, "认为", player, "#g有杀");
					if (!player.countCards("h", "sha")) {
						event.caicuolist.add(target);
					}
				} else {
					target.chat("没杀");
					game.log(target, "认为", player, "#y没有杀");
					if (player.countCards("h", "sha")) {
						event.caicuolist.add(target);
					}
				}
			}
			player.popup(player.countCards("h", "sha") ? "有杀" : "没杀");
			game.log(player, player.countCards("h", "sha") ? "有杀" : "没杀");
			if (event.caicuolist.length > 0) {
				if (player.countCards("h", "sha")) {
					player.markAuto("rejixu_sha", event.caicuolist);
					player.addTempSkill("rejixu_sha", "phaseUseAfter");
				} else {
					for (const target of event.caicuolist) {
						if (target.countDiscardableCards(player, "he") > 0) {
							player.line(target);
							await player.discardPlayerCard(true, "he", target);
						}
					}
				}
				await player.draw(event.caicuolist.length);
			}
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.6;
			},
			result: {
				target(player, target) {
					if (player.countCards("h", "sha")) {
						return get.effect(target, { name: "sha" }, player, target);
					} else {
						return get.effect(target, { name: "guohe_copy2" }, player, target);
					}
				},
			},
			expose: 0.4,
		},
		subSkill: {
			sha: {
				audio: "rejixu",
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.getStorage("rejixu_sha").length;
						}
					},
				},
				charlotte: true,
				onremove: true,
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (event.card.name != "sha") {
						return false;
					}
					for (var target of player.getStorage("rejixu_sha")) {
						if (event.targets.includes(target) || !target.isIn()) {
							return false;
						}
						if (lib.filter.targetEnabled2(event.card, player, target)) {
							return true;
						}
					}
					return false;
				},
				prompt: "是否发动【击虚】？",
				prompt2(event, player) {
					var list = player.getStorage("rejixu_sha").filter(function (target) {
						if (event.targets.includes(target) || !target.isIn()) {
							return false;
						}
						return lib.filter.targetEnabled2(event.card, player, target);
					});
					return "令" + get.translation(list) + "也成为" + get.translation(event.card) + "的目标";
				},
				logTarget(event, player) {
					return player.getStorage("rejixu_sha").filter(function (target) {
						if (event.targets.includes(target) || !target.isIn()) {
							return false;
						}
						return lib.filter.targetEnabled2(event.card, player, target);
					});
				},
				check(event, player) {
					var eff = 0;
					var list = player.getStorage("rejixu_sha").filter(function (target) {
						if (event.targets.includes(target) || !target.isIn()) {
							return false;
						}
						return lib.filter.targetEnabled2(event.card, player, target);
					});
					for (var i of list) {
						eff += get.effect(i, event.card, player, player);
					}
					return eff > 0;
				},
				content() {
					var list = player.getStorage("rejixu_sha").filter(function (target) {
						if (trigger.targets.includes(target) || !target.isIn()) {
							return false;
						}
						return lib.filter.targetEnabled2(trigger.card, player, target);
					});
					if (list.length > 0) {
						trigger.targets.addArray(list);
						game.log(list, "也成为了", trigger.card, "的目标");
					}
				},
			},
		},
	},
	//界刘封
	rexiansi: {
		inherit: "xiansi",
		audio: "xiansi",
		audioname: ["re_liufeng"],
		group: ["rexiansi2", "xiansix"],
	},
	rexiansi2: {
		enable: "chooseToUse",
		sourceSkill: "rexiansi",
		filter(event, player) {
			return player.getExpansions("xiansi").length > Math.max(0, player.hp) && event.filterCard({ name: "sha", isCard: true }, player, event);
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("陷嗣", player.getExpansions("xiansi"), "hidden");
			},
			backup(links, player) {
				return {
					viewAs: { name: "sha", isCard: true },
					filterCard: () => false,
					selectCard: -1,
					card: links[0],
					log: false,
					precontent() {
						player.logSkill("rexiansi");
						player.loseToDiscardpile(lib.skill.rexiansi2_backup.card);
					},
				};
			},
			prompt: () => "请选择【杀】的目标",
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.6;
			},
			result: { player: 1 },
		},
	},
	//界荀彧
	oljieming: {
		audio: 2,
		trigger: { player: ["damageEnd", "die"] },
		forceDie: true,
		filter(event, player) {
			if (event.name == "die") {
				return true;
			}
			return player.isIn() && event.num > 0;
		},
		getIndex(event) {
			return event.num || 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.maxHp > 0;
				})
				.set("ai", target => {
					const player = get.player();
					let att = get.attitude(player, target);
					let draw = Math.min(5, target.maxHp) - target.countCards("h");
					if (draw >= 0) {
						if (target.hasSkillTag("nogain")) {
							att /= 6;
						}
						if (att > 2) {
							return Math.sqrt(draw + 1) * att;
						}
						return att / 3;
					}
					if (draw < -1) {
						if (target.hasSkillTag("nogain")) {
							att *= 6;
						}
						if (att < -2) {
							return -Math.sqrt(1 - draw) * att;
						}
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			await target.draw(Math.min(5, target.maxHp));
			let num = target.countCards("h") - Math.min(5, target.maxHp);
			if (num > 0) {
				await target.chooseToDiscard("h", true, num);
			}
		},
		ai: {
			expose: 0.2,
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && target.hp > 1) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						var max = 0;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) > 0) {
								max = Math.max(Math.min(5, players[i].hp) - players[i].countCards("h"), max);
							}
						}
						switch (max) {
							case 0:
								return 2;
							case 1:
								return 1.5;
							case 2:
								return [1, 2];
							default:
								return [0, max];
						}
					}
					if ((card.name == "tao" || card.name == "caoyao") && target.hp > 1 && target.countCards("h") <= target.hp) {
						return [0, 0];
					}
				},
			},
		},
	},
	//OL华雄
	shizhan: {
		audio: 2,
		enable: "phaseUse",
		usable: 2,
		filterTarget(card, player, target) {
			return target != player && target.canUse("juedou", player);
		},
		content() {
			target.useCard({ name: "juedou", isCard: true }, player, "noai");
		},
		ai: {
			order: 2,
			result: {
				player(player, target) {
					return get.effect(player, { name: "juedou", isCard: true }, target, player);
				},
			},
		},
	},
	//刘谌
	rezhanjue: {
		audio: 2,
		enable: "phaseUse",
		filterCard(card) {
			return !card.hasGaintag("reqinwang");
		},
		selectCard: -1,
		position: "h",
		filter(event, player) {
			var stat = player.getStat().skill;
			if (stat.rezhanjue_draw && stat.rezhanjue_draw >= 3) {
				return false;
			}
			var hs = player.getCards("h", function (card) {
				return !card.hasGaintag("reqinwang");
			});
			if (!hs.length) {
				return false;
			}
			for (var i = 0; i < hs.length; i++) {
				var mod2 = game.checkMod(hs[i], player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) {
					return false;
				}
			}
			return event.filterCard(get.autoViewAs({ name: "juedou" }, hs));
		},
		viewAs: { name: "juedou" },
		onuse(links, player) {
			player.addTempSkill("rezhanjue_effect", "phaseUseEnd");
		},
		ai: {
			order(item, player) {
				if (player.countCards("h") > 1) {
					return 0.8;
				}
				return 8;
			},
			tag: {
				respond: 2,
				respondSha: 2,
				damage: 1,
			},
			result: {
				player(player, target) {
					let td = get.damageEffect(target, player, target);
					if (!td) {
						return 0;
					}
					let hs = player.getCards("h"),
						val = hs.reduce((acc, i) => acc - get.value(i, player), 0) / 6 + 1;
					if (td > 0) {
						return val;
					}
					if (
						player.hasSkillTag("directHit_ai", true, {
							target: target,
							card: get.autoViewAs({ name: "juedou" }, hs),
						})
					) {
						return val;
					}
					let pd = get.damageEffect(player, target, player),
						att = get.attitude(player, target);
					if (att > 0 && get.damageEffect(target, player, player) > pd) {
						return val;
					}
					let ts = target.mayHaveSha(player, "respond", null, "count");
					if (ts < 1 && ts * 8 < Math.pow(player.hp, 2)) {
						return val;
					}
					let damage = pd / get.attitude(player, player),
						ps = player.mayHaveSha(player, "respond", hs, "count");
					if (att > 0) {
						if (ts < 1) {
							return val;
						}
						return val + damage + 1;
					}
					if (pd >= 0) {
						return val + damage + 1;
					}
					if (ts - ps + Math.exp(0.8 - player.hp) < 1) {
						return val - ts;
					}
					return val + damage + 1 - ts;
				},
				target(player, target) {
					let td = get.damageEffect(target, player, target) / get.attitude(target, target);
					if (!td) {
						return 0;
					}
					let hs = player.getCards("h");
					if (
						td > 0 ||
						player.hasSkillTag("directHit_ai", true, {
							target: target,
							card: get.autoViewAs({ name: "juedou" }, hs),
						})
					) {
						return td + 1;
					}
					let pd = get.damageEffect(player, target, player),
						att = get.attitude(player, target);
					if (att > 0) {
						return td + 1;
					}
					let ts = target.mayHaveSha(player, "respond", null, "count"),
						ps = player.mayHaveSha(player, "respond", hs, "count");
					if (ts < 1) {
						return td + 1;
					}
					if (pd >= 0) {
						return 0;
					}
					if (ts - ps < 1) {
						return td + 1 - ts;
					}
					return -ts;
				},
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (
						(!arg || (arg.card && get.name(arg.card) === "tao")) &&
						player.isPhaseUsing() &&
						get.skillCount("rezhanjue_draw", player) < 3 &&
						player.hasCard(card => {
							return get.name(card) !== "tao" && !card.hasGaintag("reqinwang");
						}, "h")
					);
				}
			},
		},
	},
	rezhanjue_effect: {
		audio: false,
		trigger: { player: "useCardAfter" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "rezhanjue",
		onremove(player) {
			delete player.getStat().skill.rezhanjue_draw;
		},
		filter(event, player) {
			return event.skill == "rezhanjue";
		},
		async content(event, trigger, player) {
			let stat = player.getStat().skill;
			if (!stat.rezhanjue_draw) {
				stat.rezhanjue_draw = 0;
			}
			stat.rezhanjue_draw++;
			await player.draw("nodelay");
			const list = game.filterPlayer(function (current) {
				if (
					current.getHistory("damage", function (evt) {
						return evt.card == trigger.card;
					}).length > 0
				) {
					if (current == player) {
						stat.rezhanjue_draw++;
					}
					return true;
				}
				return false;
			});
			if (list.length) {
				list.sortBySeat();
				await game.asyncDraw(list);
			}
			game.delay();
		},
	},
	reqinwang: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		zhuSkill: true,
		filter(event, player) {
			if (!player.hasZhuSkill("reqinwang")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.group == "shu" && player.hasZhuSkill("reqinwang", current);
			});
		},
		selectTarget: -1,
		filterTarget(card, player, current) {
			return current != player && current.group == "shu" && player.hasZhuSkill("reqinwang", current);
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (
				target.hasCard(function (card) {
					return _status.connectMode || get.name(card, target) == "sha";
				}, "h")
			) {
				const result = await target
					.chooseCard(
						"是否交给" + get.translation(player) + "一张【杀】？",
						function (card, player) {
							return get.name(card, player) == "sha";
						},
						"h"
					)
					.set("goon", get.attitude(target, player) > 0)
					.set("ai", function (card) {
						return _status.event.goon ? 1 : 0;
					})
					.forResult();
				if (result?.bool) {
					const card = result.cards[0];
					await target.give(card, player).set("gaintag", ["reqinwang"]);
					player.addTempSkill("reqinwang_clear");
					const result2 = await player.chooseBool("是否令" + get.translation(target) + "摸一张牌？").forResult();
					if (result2?.bool) {
						await target.draw();
					}
				}
			}
		},
		ai: {
			order: 5,
			result: { player: 1 },
		},
		subSkill: {
			clear: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("reqinwang");
				},
			},
		},
	},
	//公孙瓒
	dcqiaomeng: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || get.color(event.card) != "black") {
				return false;
			}
			for (var i of event.targets) {
				if (
					i != player &&
					i.hasCard(function (card) {
						return lib.filter.canBeDiscarded(card, player, i);
					}, "he")
				) {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("dcqiaomeng"), "选择一名不为自己的目标角色，然后弃置其一张牌。若以此法弃置的牌为：装备牌，你获得此牌；锦囊牌，你令" + get.translation(trigger.card) + "不可被响应。", function (card, player, target) {
					return (
						target != player &&
						_status.event.getTrigger().targets.includes(target) &&
						target.hasCard(function (card) {
							return lib.filter.canBeDiscarded(card, player, target);
						}, "he")
					);
				})
				.set("ai", function (target) {
					const player = _status.event.player;
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const result = await player.discardPlayerCard(target, true, "he").forResult();
			if (result?.bool && result.cards?.length) {
				//为了体现白马义从野性纯真的美 直接获取卡牌原类型 不考虑维系区域
				const card = result.cards[0],
					type = get.type2(card, false);
				if (type == "trick") {
					trigger.directHit.addArray(game.filterPlayer(current => current != player));
				}
				if (type == "equip" && get.position(card, true) == "d") {
					await player.gain(card, "gain2");
				}
			}
		},
	},
	//杜畿
	reandong: {
		audio: 2,
		trigger: { player: "damageBegin2" },
		filter(event, player) {
			return event.source && event.source.isIn();
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const target = trigger.source,
				bool = player.storage.reandong;
			let str = get.translation(player),
				result;
			if (bool) {
				str = "自己";
			}
			let choiceList = ["防止" + str + "即将受到的伤害，且本回合内红桃牌不计入" + (bool ? get.translation(target) : "自己") + "的手牌上限。"];
			if (!target.countCards("h")) {
				choiceList.push("令" + str + "下次发动〖安东〗时改为自行选择");
			} else {
				choiceList.push("令" + str + "观看你的手牌并获得所有红桃牌");
			}
			if (bool) {
				delete player.storage.reandong;
				result = await player.chooseControl().set("choiceList", choiceList).set("prompt", "安东：请选择一项").forResult();
			} else {
				result = await target
					.chooseControl()
					.set("choiceList", choiceList)
					.set("prompt", "安东：请选择一项")
					.set("ai", function (event, player) {
						var target = _status.event.getParent().player;
						var player = _status.event.player;
						if (get.attitude(player, target) > 0) {
							return 0;
						}
						return 1;
					})
					.forResult();
			}
			if (result?.index == 0) {
				target.addTempSkill("reandong_ignore");
				trigger.cancel();
				await game.delayx();
			} else {
				if (!target.countCards("h")) {
					player.storage.reandong = true;
					await game.delayx();
				} else {
					await player.viewHandcards(target);
					const cards = target.getCards("h", function (card) {
						return get.suit(card, target) == "heart";
					});
					if (cards.length > 0) {
						await player.gain(cards, target, "give", "bySelf");
					}
				}
			}
		},
		ai: {
			maixie: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage") && player != target && get.attitude(player, target) < 0) {
						var cards = player.getCards("h", function (cardx) {
							return card != cardx && (!card.cards || !card.cards.includes(cardx)) && get.suit(cardx) == "heart";
						});
						if (!cards.length) {
							return;
						}
						for (var i of cards) {
							if (get.name(i, target) == "tao") {
								return "zeroplayertarget";
							}
						}
						if (get.value(cards, target) >= 6 + target.getDamagedHp()) {
							return "zeroplayertarget";
						}
						return [1, 0.6];
					}
				},
			},
		},
		subSkill: {
			ignore: {
				mod: {
					ignoredHandcard(card, player) {
						if (get.suit(card) == "heart") {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && get.suit(card) == "heart") {
							return false;
						}
					},
				},
				charlotte: true,
				marktext: "♥",
				intro: "红桃牌于本回合内不计入手牌上限",
			},
		},
	},
	reyingshi: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h") > 0 && game.countPlayer() > 1;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseCardTarget({
					prompt: get.prompt("reyingshi"),
					prompt2: "操作提示：选择一张作为赏金的手牌，然后选择作为赏金猎人的角色A和作为出杀目标的其他角色B",
					filterCard: true,
					selectTarget: 2,
					position: "h",
					filterTarget(card, player, target) {
						if (!ui.selected.targets.length) {
							return true;
						}
						return target != player;
					},
					complexTarget: true,
					targetprompt: ["出杀", "被杀"],
					complexSelect: true,
					ai1(card) {
						return 1 / Math.max(1, get.value(card));
					},
					ai2(target) {
						var player = _status.event.player;
						if (!ui.selected.targets.length) {
							var att = get.attitude(player, target);
							if (att < 0) {
								return 0;
							}
							if (target.hasSha()) {
								return Math.pow(target.countCards("h") + 1, 1.1) * (player == target ? 3 : 1);
							}
							return Math.sqrt(1 + target.countCards("h"));
						}
						return get.effect(target, { name: "sha" }, ui.selected.targets[0], player);
					},
				})
				.forResult();
			if (result?.bool) {
				const targets = result.targets;
				player.logSkill("reyingshi", targets[1]);
				const card = result.cards[0];
				player.showCards(card, get.translation(player) + "对" + get.translation(targets[1]) + "发动了【应势】");
				player.line(targets[0], "fire");

				const next = targets[0].chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.cardEnabled.apply(this, arguments) && lib.filter.targetEnabled(card, player, (event || _status.event).sourcex);
				}, "###是否对" + get.translation(targets[1]) + "使用一张【杀】？###若选择使用，则获得赏金（" + get.translation(card) + "）。若造成伤害，则再从牌堆中获得与此牌花色点数相同的牌作为额外赏金。");
				next.set("addCount", false);
				next.set("complexSelect", true);
				next.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				});
				next.set("sourcex", targets[1]);
				const result2 = await next.forResult();

				const target = targets[0];
				if (result2?.bool && target.isIn()) {
					let cards = [],
						slice = 0;
					if (player != target && player.getCards("h").includes(card)) {
						cards.push(card);
						slice++;
					}
					if (
						target.hasHistory("useCard", function (evt) {
							if (evt.getParent(2) != event) {
								return false;
							}
							return target.hasHistory("sourceDamage", function (evtx) {
								return evtx.card == evt.card;
							});
						})
					) {
						const suit = get.suit(card),
							number = get.number(card);
						cards.addArray(
							Array.from(ui.cardPile.childNodes).filter(cardx => {
								if (cardx.suit == suit && cardx.number == number) {
									return true;
								}
							})
						);
						if (cards.length > 0) {
							if (!slice) {
								await target.gain(cards, "gain2");
							} else {
								setTimeout(function () {
									target.$gain2(cards.slice(slice), true);
								}, get.delayx(200, 200));
								await target.gain(cards, player, "give");
							}
						}
					} else {
						if (cards.length > 0) {
							await target.gain(cards, player, "give");
						}
					}
				}
			}
		},
	},
	//十周年沮授
	dcshibei: {
		trigger: { player: "damageEnd" },
		forced: true,
		audio: 2,
		check(event, player) {
			return player.getHistory("damage").indexOf(event) == 0;
		},
		filter(event, player) {
			var index = player.getHistory("damage").indexOf(event);
			return index == 0 || index == 1;
		},
		content() {
			if (player.getHistory("damage").indexOf(trigger) > 0) {
				player.loseHp();
			} else {
				player.recover();
			}
		},
		subSkill: {
			damaged: {},
			ai: {},
		},
		ai: {
			maixie_defend: true,
			threaten: 0.9,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (target.hujia) {
						return;
					}
					if (player._shibei_tmp) {
						return;
					}
					if (target.hasSkill("shibei_ai")) {
						return;
					}
					if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) {
						return;
					}
					if (get.tag(card, "damage")) {
						if (target.getHistory("damage").length > 0) {
							return [1, -2];
						} else {
							if (get.attitude(player, target) > 0 && target.hp > 1) {
								return 0;
							}
							if (
								get.attitude(player, target) < 0 &&
								!player.hasSkillTag("damageBonus", "e", {
									target: target,
									card: card,
								})
							) {
								if (card.name == "sha") {
									return;
								}
								var sha = false;
								player._shibei_tmp = true;
								var num = player.countCards("h", function (card) {
									if (card.name == "sha") {
										if (sha) {
											return false;
										} else {
											sha = true;
										}
									}
									return get.tag(card, "damage") && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
								});
								delete player._shibei_tmp;
								if (player.hasSkillTag("damage")) {
									num++;
								}
								if (num < 2) {
									var enemies = player.getEnemies();
									if (enemies.length == 1 && enemies[0] == target && player.needsToDiscard()) {
										return;
									}
									return 0;
								}
							}
						}
					}
				},
			},
		},
	},
	dcjianying: {
		audio: 2,
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && player.isPhaseUsing()) {
					var evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt && evt.card && ((get.suit(evt.card) && get.suit(evt.card) == get.suit(card)) || (evt.card.number && evt.card.number == get.number(card)))) {
						return num + 10;
					}
				}
			},
		},
		trigger: { player: "useCard" },
		frequent: true,
		getLastUsed(player, event) {
			var history = player.getAllHistory("useCard");
			var index;
			if (event) {
				index = history.indexOf(event) - 1;
			} else {
				index = history.length - 1;
			}
			if (index >= 0) {
				return history[index];
			}
			return false;
		},
		filter(event, player) {
			var evt = lib.skill.dcjianying.getLastUsed(player, event);
			if (!evt || !evt.card) {
				return false;
			}
			return (lib.suit.includes(get.suit(evt.card)) && get.suit(evt.card) == get.suit(event.card)) || (typeof get.number(evt.card, false) == "number" && get.number(evt.card, false) == get.number(event.card));
		},
		content() {
			player.draw();
		},
		group: "dcjianying_mark",
		init(player) {
			var history = player.getAllHistory("useCard");
			if (history.length) {
				var trigger = history[history.length - 1];
				if (get.suit(trigger.card, player) == "none" || typeof get.number(trigger.card, player) != "number") {
					return;
				}
				player.storage.dcjianying_mark = trigger.card;
				player.markSkill("dcjianying_mark");
				game.broadcastAll(
					function (player, suit) {
						if (player.marks.dcjianying_mark) {
							player.marks.dcjianying_mark.firstChild.innerHTML = get.translation(suit);
						}
					},
					player,
					get.suit(trigger.card, player)
				);
			}
		},
		onremove(player) {
			player.unmarkSkill("dcjianying_mark");
			delete player.storage.dcjianying_mark;
		},
		subSkill: {
			mark: {
				charlotte: true,
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					if (get.suit(trigger.card, player) == "none" || typeof get.number(trigger.card, player) != "number") {
						player.unmarkSkill("dcjianying_mark");
					} else {
						player.storage.dcjianying_mark = trigger.card;
						player.markSkill("dcjianying_mark");
						game.broadcastAll(
							function (player, suit) {
								if (player.marks.dcjianying_mark) {
									player.marks.dcjianying_mark.firstChild.innerHTML = get.translation(suit);
								}
							},
							player,
							get.suit(trigger.card, player)
						);
					}
				},
				intro: {
					markcount(card, player) {
						return get.strNumber(get.number(card, player));
					},
					content(card, player) {
						var suit = get.suit(card, player);
						var num = get.number(card, player);
						var str = "<li>上一张牌的花色：" + get.translation(suit);
						str += "<br><li>上一张牌的点数：" + get.strNumber(num);
						return str;
					},
				},
			},
		},
	},
	//十周年步练师
	dcanxu: {
		enable: "phaseUse",
		usable: 1,
		multitarget: true,
		audio: 2,
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var num = target.countCards("h");
			if (ui.selected.targets.length) {
				return num < ui.selected.targets[0].countCards("h");
			}
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (num > players[i].countCards("h")) {
					return true;
				}
			}
			return false;
		},
		selectTarget: 2,
		async content(event, trigger, player) {
			let gainner, giver;
			const { targets } = event;
			if (targets[0].countCards("h") < targets[1].countCards("h")) {
				gainner = targets[0];
				giver = targets[1];
			} else {
				gainner = targets[1];
				giver = targets[0];
			}
			const result = await gainner.gainPlayerCard(giver, true, "h", "visibleMove").forResult();
			if (result?.cards?.length) {
				const card = result.cards[0];
				if (gainner.getCards("h").includes(card) && get.suit(card, gainner) != "spade") {
					await player.draw();
				}
			}
			if (gainner.countCards("h") == giver.countCards("h")) {
				await player.recover();
			}
		},
		ai: {
			order: 10.5,
			threaten: 2.3,
			result: {
				target(player, target) {
					var num = target.countCards("h");
					var att = get.attitude(player, target);
					if (ui.selected.targets.length == 0) {
						if (att > 0) {
							return -1;
						}
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							var num2 = players[i].countCards("h");
							var att2 = get.attitude(player, players[i]);
							if (num2 < num) {
								if (att2 > 0) {
									return -3;
								}
								return -1;
							}
						}
						return 0;
					} else {
						return 1;
					}
				},
				player: 1,
			},
		},
	},
	dczhuiyi: {
		audio: 2,
		trigger: { player: "die" },
		skillAnimation: true,
		animationColor: "wood",
		forceDie: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("dczhuiyi"), function (card, player, target) {
					return player != target && _status.event.sourcex != target;
				})
				.set("forceDie", true)
				.set("ai", function (target) {
					var num = get.attitude(_status.event.player, target);
					if (num > 0) {
						if (target.hp == 1) {
							num += 2;
						}
						if (target.hp < target.maxHp) {
							num += 2;
						}
					}
					return num;
				})
				.set("sourcex", trigger.source)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.recover();
			await target.draw(game.countPlayer());
		},
		ai: {
			expose: 0.5,
		},
	},
	//OL界蔡文姬
	olbeige: {
		audio: "beige",
		audioname: ["ol_caiwenji"],
		trigger: { global: "damageEnd" },
		logTarget: "player",
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.player.isIn() && player.countCards("he") > 0;
		},
		check(event, player) {
			let att = get.attitude(player, event.player);
			if (event.player.hasSkill("xinleiji")) {
				return att > 0;
			}
			if (att > 0 || event.player.isHealthy()) {
				return true;
			}
			if (!event.source) {
				return true;
			}
			att = get.attitude(player, event.source);
			return att <= 0 || event.source.isTurnedOver();
		},
		prompt2: "令其进行判定，然后你可根据判定结果，弃置一张牌并令其执行对应效果。",
		content() {
			"step 0";
			event.target = trigger.player;
			event.source = trigger.source;
			trigger.player.judge();
			"step 1";
			event.judgeResult = get.copy(result);
			var str = "是否弃置一张牌",
				strt = get.translation(target),
				strs = get.translation(source),
				goon = 0;
			switch (result.suit) {
				case "heart":
					if (target.isIn() && target.isDamaged()) {
						str += "，令" + strt + "回复1点体力";
						goon = get.recoverEffect(target, player, player);
					}
					break;
				case "diamond":
					if (target.isIn()) {
						str += "，令" + strt + "摸两张牌";
						goon = 2 * get.effect(target, { name: "draw" }, player, player);
					}
					break;
				case "spade":
					if (source && source.isIn()) {
						str += "，令" + strs + "翻" + (source.isTurnedOver() ? "回正" : "") + "面";
						goon = get.attitude(player, source) * (source.isTurnedOver() ? 2 : -2);
					}
					break;
				case "club":
					if (source && source.isIn()) {
						str += "，令" + strs + "弃置两张牌";
						var cards = source
							.getCards("he")
							.sort(function (a, b) {
								return get.value(a, source) - get.value(b, source);
							})
							.slice(0, 2);
						for (var i of cards) {
							goon += get.value(i, source);
						}
						goon *= -get.sgn(get.attitude(player, source));
					}
					break;
			}
			str += "？";
			var str2 = "若弃置点数为" + get.strNumber(result.number) + "的牌则收回自己弃置的牌";
			if (get.position(result.card, true) == "d") {
				str2 += "；若弃置花色为" + get.translation(result.suit) + "的牌则获得" + get.translation(result.card);
			}
			player
				.chooseToDiscard("he", str, str2)
				.set("goon", goon)
				.set("ai", function (card) {
					var goon = _status.event.goon;
					var player = _status.event.player;
					var result = _status.event.getParent().judgeResult;
					var eff = Math.min(7, goon);
					if (eff <= 0) {
						return 0;
					}
					if (get.suit(card, player) == result.suit) {
						eff += get.value(result.card, player);
					}
					if (get.number(card, player) == result.number) {
						return eff;
					}
					return eff - get.value(card);
				});
			"step 2";
			if (result.bool) {
				event.card = result.cards[0];
				switch (event.judgeResult.suit) {
					case "heart":
						if (target.isIn() && target.isDamaged()) {
							target.recover();
						}
						break;
					case "diamond":
						if (target.isIn()) {
							target.draw(2);
						}
						break;
					case "spade":
						if (source && source.isIn()) {
							source.turnOver();
						}
						player.addExpose(0.1);
						break;
					case "club":
						if (source && source.isIn() && source.countCards("he") > 0) {
							source.chooseToDiscard(2, "he", true);
						}
						player.addExpose(0.1);
						break;
				}
			} else {
				event.finish();
			}
			"step 3";
			var gains = [];
			if (get.position(event.judgeResult.card, true) == "d" && get.suit(card, player) == event.judgeResult.suit) {
				gains.push(event.judgeResult.card);
			}
			if (get.position(card, true) == "d" && get.number(card, player) == event.judgeResult.number) {
				gains.push(card);
			}
			if (gains.length) {
				player.gain(gains, "gain2");
			}
		},
	},
	//OL界张郃
	reqiaobian: {
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
		content() {
			player.addMark("reqiaobian", 2);
			game.delayx();
		},
		marktext: "变",
		intro: {
			name2: "变",
			content(storage, player) {
				var str = "共有" + (storage || 0) + "个标记";
				if (player.storage.reqiaobian_jieshu) {
					str = "<li>" + str + "<br><li>已记录手牌数：" + get.translation(player.storage.reqiaobian_jieshu);
				}
				return str;
			},
		},
		group: ["reqiaobian_judge", "reqiaobian_draw", "reqiaobian_use", "reqiaobian_discard", "reqiaobian_jieshu"],
		subSkill: {
			judge: {
				audio: "reqiaobian",
				trigger: { player: "phaseJudgeBefore" },
				direct: true,
				filter(event, player) {
					return player.hasMark("reqiaobian") || player.hasCard(card => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he");
				},
				check(event, player) {
					return player.hasCard(function (card) {
						return (
							get.effect(
								player,
								{
									name: card.viewAs || card.name,
									cards: [card],
								},
								player,
								player
							) < 0
						);
					}, "j");
				},
				content() {
					"step 0";
					var choices = [];
					if (player.hasMark("reqiaobian")) {
						choices.push("弃置标记");
					}
					if (player.hasCard(card => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he")) {
						choices.push("弃置牌");
					}
					choices.push("cancel2");
					player
						.chooseControl(choices)
						.set("prompt", "巧变：是否跳过判定阶段？")
						.set("ai", function () {
							var evt = _status.event;
							if (lib.skill[evt.getParent().name].check(evt.getTrigger(), evt.player)) {
								return 0;
							}
							return "cancel2";
						});
					"step 1";
					if (result.control != "cancel2") {
						if (result.control == "弃置牌") {
							player.chooseToDiscard("he", true).logSkill = event.name;
						} else {
							player.logSkill(event.name);
							player.removeMark("reqiaobian", 1);
						}
					} else {
						event.finish();
					}
					"step 2";
					trigger.cancel();
				},
			},
			draw: {
				audio: "reqiaobian",
				trigger: { player: "phaseDrawBefore" },
				direct: true,
				filter(event, player) {
					return player.hasMark("reqiaobian") || player.hasCard(card => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he");
				},
				check(event, player) {
					return (
						game.countPlayer(function (current) {
							if (current == player || current.countGainableCards(player, "h") == 0) {
								return false;
							}
							var att = get.attitude(player, current);
							if (current.hasSkill("tuntian")) {
								return att > 0;
							}
							return att < 1;
						}) > 1
					);
				},
				content() {
					"step 0";
					var choices = [];
					if (player.hasMark("reqiaobian")) {
						choices.push("弃置标记");
					}
					if (player.hasCard(card => lib.filter.cardDiscardable(card, player, "reqiaobian_draw"), "he")) {
						choices.push("弃置牌");
					}
					choices.push("cancel2");
					player
						.chooseControl(choices)
						.set("prompt", "巧变：是否跳过摸牌阶段？")
						.set("ai", function () {
							var evt = _status.event;
							if (lib.skill[evt.getParent().name].check(evt.getTrigger(), evt.player)) {
								return 0;
							}
							return "cancel2";
						});
					"step 1";
					if (result.control != "cancel2") {
						if (result.control == "弃置牌") {
							player.chooseToDiscard("he", true).logSkill = event.name;
						} else {
							player.logSkill(event.name);
							player.removeMark("reqiaobian", 1);
						}
					} else {
						event.finish();
					}
					"step 2";
					trigger.cancel();
					if (game.hasPlayer(current => current.countGainableCards(player, "h") > 0)) {
						player
							.chooseTarget("是否获得至多两名其他角色的各一张手牌？", [1, 2], function (card, player, target) {
								return target != player && target.countGainableCards(player, "h") > 0;
							})
							.set("ai", function (target) {
								var att = get.attitude(_status.event.player, target);
								if (target.hasSkill("tuntian")) {
									return att / 10;
								}
								return 1 - att;
							});
					} else {
						event.finish();
					}
					"step 3";
					if (result.bool) {
						var targets = result.targets.sortBySeat();
						player.line(targets, "green");
						player.gainMultiple(targets);
					}
				},
			},
			use: {
				audio: "reqiaobian",
				trigger: { player: "phaseUseBefore" },
				direct: true,
				filter(event, player) {
					return player.hasMark("reqiaobian") || player.hasCard(card => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he");
				},
				check(event, player) {
					if (
						player.countCards("h", function (card) {
							return player.hasValueTarget(card, null, true);
						}) > 1
					) {
						return false;
					}
					return game.hasPlayer(function (current) {
						var att = get.sgn(get.attitude(player, current));
						if (att != 0) {
							var es = current.getCards("e");
							for (var i = 0; i < es.length; i++) {
								if (
									game.hasPlayer(function (current2) {
										if (get.sgn(get.value(es[i], current)) != -att || get.value(es[i], current) < 5) {
											return false;
										}
										var att2 = get.sgn(get.attitude(player, current2));
										if (att == att2 || att2 != get.sgn(get.effect(current2, es[i], player, current2))) {
											return false;
										}
										return current != current2 && !current2.isMin() && current2.canEquip(es[i]);
									})
								) {
									return true;
								}
							}
						}
						if (att > 0) {
							var js = current.getCards("j", function (card) {
								return (
									get.effect(
										current,
										{
											name: card.viewAs || card.name,
											cards: [card],
										},
										current,
										current
									) < -2
								);
							});
							for (var i = 0; i < js.length; i++) {
								if (
									game.hasPlayer(function (current2) {
										var att2 = get.attitude(player, current2);
										if (att2 >= 0) {
											return false;
										}
										return current != current2 && current2.canAddJudge(js[i]);
									})
								) {
									return true;
								}
							}
						}
					});
				},
				content() {
					"step 0";
					var choices = [];
					if (player.hasMark("reqiaobian")) {
						choices.push("弃置标记");
					}
					if (player.hasCard(card => lib.filter.cardDiscardable(card, player, "reqiaobian_use"), "he")) {
						choices.push("弃置牌");
					}
					choices.push("cancel2");
					player
						.chooseControl(choices)
						.set("prompt", "巧变：是否跳过出牌阶段？")
						.set("ai", function () {
							var evt = _status.event;
							if (lib.skill[evt.getParent().name].check(evt.getTrigger(), evt.player)) {
								return 0;
							}
							return "cancel2";
						});
					"step 1";
					if (result.control != "cancel2") {
						if (result.control == "弃置牌") {
							player.chooseToDiscard("he", true).logSkill = event.name;
						} else {
							player.logSkill(event.name);
							player.removeMark("reqiaobian", 1);
						}
					} else {
						event.finish();
					}
					"step 2";
					trigger.cancel();
					player.moveCard();
				},
			},
			discard: {
				audio: "reqiaobian",
				trigger: { player: "phaseDiscardBefore" },
				direct: true,
				filter(event, player) {
					return player.hasMark("reqiaobian") || player.hasCard(card => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he");
				},
				check(event, player) {
					return player.needsToDiscard();
				},
				content() {
					"step 0";
					var choices = [];
					if (player.hasMark("reqiaobian")) {
						choices.push("弃置标记");
					}
					if (player.hasCard(card => lib.filter.cardDiscardable(card, player, "reqiaobian_discard"), "he")) {
						choices.push("弃置牌");
					}
					choices.push("cancel2");
					player
						.chooseControl(choices)
						.set("prompt", "巧变：是否跳过弃牌阶段？")
						.set("ai", function () {
							var evt = _status.event;
							if (lib.skill[evt.getParent().name].check(evt.getTrigger(), evt.player)) {
								return 0;
							}
							return "cancel2";
						});
					"step 1";
					if (result.control != "cancel2") {
						if (result.control == "弃置牌") {
							player.chooseToDiscard("he", true).logSkill = event.name;
						} else {
							player.logSkill(event.name);
							player.removeMark("reqiaobian", 1);
						}
					} else {
						event.finish();
					}
					"step 2";
					trigger.cancel();
				},
			},
			jieshu: {
				audio: "reqiaobian",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				filter(event, player) {
					return !player.getStorage("reqiaobian_jieshu").includes(player.countCards("h"));
				},
				content() {
					player.addMark("reqiaobian", 1);
					player.markAuto("reqiaobian_jieshu", [player.countCards("h")]);
					player.storage.reqiaobian_jieshu.sort();
				},
			},
		},
	},
	//十周年徐庶
	rezhuhai: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player != event.player && event.player.getHistory("sourceDamage").length > 0 && event.player.isIn() && (player.countCards("h") > 0 || player.canUse("guohe", event.player));
		},
		content() {
			"step 0";
			var target = trigger.player;
			var choiceList = ["将一张手牌当做【杀】对其使用", "视为对其使用一张【过河拆桥】"];
			var bool = false,
				hs = player.getCards("h");
			for (var i of hs) {
				if (game.checkMod(i, player, "unchanged", "cardEnabled2", player) !== false && player.canUse(get.autoViewAs({ name: "sha" }, [i]), target, false)) {
					bool = true;
					break;
				}
			}
			var choices = [];
			if (bool) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			if (player.canUse("guohe", target)) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			choices.push("cancel2");
			player
				.chooseControl(choices)
				.set("choiceList", choiceList)
				.set("prompt", get.prompt("rezhuhai", target))
				.set("ai", function () {
					var choices = _status.event.controls;
					var eff1 = 0,
						eff2 = 0;
					var player = _status.event.player,
						target = _status.event.getTrigger().player;
					if (choices.includes("选项一")) {
						eff1 = get.effect(target, { name: "sha" }, player, player);
					}
					if (choices.includes("选项二")) {
						eff2 = get.effect(target, { name: "guohe" }, player, player);
					}
					if (eff1 > 0 && ((player.hasSkill("xsqianxin") && player.isDamaged()) || eff1 > eff2)) {
						return "选项一";
					}
					if (eff2 > 0) {
						return "选项二";
					}
					return "cancel2";
				});
			"step 1";
			if (result.control != "cancel2") {
				if (result.control == "选项一") {
					player
						.chooseCard(
							"h",
							true,
							function (card, player) {
								if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
									return false;
								}
								return player.canUse(get.autoViewAs({ name: "sha" }, [card]), _status.event.getTrigger().player, false);
							},
							"选择一张手牌当做【杀】对" + get.translation(trigger.player) + "使用"
						)
						.set("ai", function (card) {
							var player = _status.event.player;
							return get.effect(_status.event.getTrigger().player, get.autoViewAs({ name: "sha" }, [card]), player, player) / Math.max(1, get.value(card));
						});
				} else {
					player.useCard({ name: "guohe", isCard: true }, trigger.player, "rezhuhai");
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.useCard({ name: "sha" }, result.cards, "rezhuhai", trigger.player, false);
			}
		},
	},
	xsqianxin: {
		audio: 2,
		trigger: { source: "damageSource" },
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "orange",
		filter(event, player) {
			return player.isDamaged();
		},
		content() {
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.addSkills("rejianyan");
		},
		derivation: "rejianyan",
	},
	rejianyan: {
		audio: 2,
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return game.hasPlayer(current => current.group == "key" || current.hasSex("male"));
		},
		chooseButton: {
			dialog() {
				return ui.create.dialog("###荐言###" + get.translation("rejianyan_info"));
			},
			chooseControl(event, player) {
				const list = [],
					storage = player.getStorage("rejianyan_used");
				if (!storage.includes("color")) {
					list.addArray(["red", "black"]);
				}
				if (!storage.includes("type")) {
					list.addArray(["basic", "trick", "equip"]);
				}
				list.push("cancel2");
				return list;
			},
			check() {
				if (!_status.event.player.getStorage("rejianyan_used").includes("color")) {
					return "red";
				}
				return "trick";
			},
			backup(result, player) {
				return {
					audio: "rejianyan",
					filterCard: () => false,
					selectCard: -1,
					info: result.control,
					content() {
						"step 0";
						let card = false,
							info = lib.skill.rejianyan_backup.info;
						player.addTempSkill("rejianyan_used", "phaseUseEnd");
						if (info == "red" || info == "black") {
							player.markAuto("rejianyan_used", "color");
							card = get.cardPile2(function (card) {
								return get.color(card) == info;
							}, "top");
						} else {
							player.markAuto("rejianyan_used", "type");
							card = get.cardPile2(function (card) {
								return get.type(card) == info;
							}, "top");
						}
						if (card) {
							event.card = card;
							player.showCards(card, get.translation(player) + "发动了【荐言】");
						} else {
							event.finish();
						}
						"step 1";
						player
							.chooseTarget(true, "选择一名角色获得" + get.translation(card), function (card, player, target) {
								return target.group == "key" || target.hasSex("male");
							})
							.set("ai", function (target) {
								var player = _status.event.player,
									att = get.attitude(player, target);
								if (target.hasSkill("nogain")) {
									att /= 10;
								}
								return att / Math.sqrt(get.distance(player, target, "absolute"));
							});
						"step 2";
						if (result.bool) {
							var target = result.targets[0];
							player.line(target, "green");
							target.gain(card, "gain2");
						}
					},
					ai: { result: { player: 1 } },
				};
			},
		},
		ai: {
			order: 8,
			result: {
				player(player, target) {
					if (game.hasPlayer(current => (current.group == "key" || current.hasSex("male")) && get.attitude(player, current) > 0)) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: { used: { charlotte: true, onremove: true }, backup: {} },
	},
	//野兽高顺
	decadexianzhen: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0 && !player.hasSkill("decadexianzhen2") && !player.hasSkill("decadexianzhen3");
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				player.storage.decadexianzhen2 = target;
				player.addTempSkill("decadexianzhen2");
			} else {
				player.addTempSkill("decadexianzhen3");
			}
		},
		ai: {
			order(name, player) {
				var cards = player.getCards("h");
				if (player.countCards("h", "sha") == 0) {
					return 1;
				}
				for (var i = 0; i < cards.length; i++) {
					if (cards[i].name != "sha" && get.number(cards[i]) > 11 && get.value(cards[i]) < 7) {
						return 9;
					}
				}
				return get.order({ name: "sha" }) - 1;
			},
			result: {
				player(player) {
					if (player.countCards("h", "sha") > 0) {
						return 0;
					}
					var num = player.countCards("h");
					if (num > player.hp) {
						return 0;
					}
					if (num == 1) {
						return -2;
					}
					if (num == 2) {
						return -1;
					}
					return -0.7;
				},
				target(player, target) {
					var num = target.countCards("h");
					if (num == 1) {
						return -1;
					}
					if (num == 2) {
						return -0.7;
					}
					return -0.5;
				},
			},
			threaten: 1.3,
		},
	},
	decadexianzhen2: {
		audio: "decadexianzhen",
		charlotte: true,
		onremove: true,
		sourceSkill: "decadexianzhen",
		mod: {
			targetInRange(card, player, target) {
				if (target == player.storage.decadexianzhen2) {
					return true;
				}
			},
			cardUsableTarget(card, player, target) {
				if (target == player.storage.decadexianzhen2) {
					return true;
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (arg.target != player.storage.decadexianzhen2) {
					return false;
				}
			},
		},
		group: "decadexianzhen2_damage",
		subSkill: {
			damage: {
				audio: "decadexianzhen",
				trigger: { source: "damageBegin1" },
				forced: true,
				filter(event, player) {
					return (
						event.card &&
						event.player == player.storage.decadexianzhen2 &&
						!player.hasHistory("custom", function (evt) {
							return evt.name == "decadexianzhen" && evt.cardname == event.card.name;
						})
					);
				},
				logTarget: "player",
				content() {
					trigger.num++;
					player.getHistory("custom").push({
						name: "decadexianzhen",
						cardname: trigger.card.name,
					});
				},
			},
		},
	},
	decadexianzhen3: {
		charlotte: true,
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") {
					return false;
				}
			},
			ignoredHandcard(card, player) {
				if (get.name(card) == "sha") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.name(card) == "sha") {
					return false;
				}
			},
		},
	},
	decadejinjiu: {
		global: "decadejinjiu_global",
		mod: {
			cardname(card) {
				if (card.name == "jiu") {
					return "sha";
				}
			},
			cardnumber(card) {
				if (card.name == "jiu") {
					return 13;
				}
			},
		},
		audio: 2,
		audioname2: {
			ol_gaoshun: "rejinjiu",
		},
		trigger: { player: ["useCard1", "respond"] },
		filter(event, player) {
			return event.card.name == "sha" && !event.skill && event.cards && event.cards.length == 1 && event.cards[0].name == "jiu";
		},
		forced: true,
		firstDo: true,
		content() {},
		subSkill: {
			global: {
				mod: {
					cardEnabled(card, player) {
						if (card.name == "jiu") {
							var source = _status.currentPhase;
							if (source && source != player && source.hasSkill("decadejinjiu")) {
								return false;
							}
						}
					},
					cardSavable(card, player) {
						if (card.name == "jiu") {
							var source = _status.currentPhase;
							if (source && source != player && source.hasSkill("decadejinjiu")) {
								return false;
							}
						}
					},
				},
			},
		},
	},
	rebotu: {
		audio: "botu",
		trigger: { player: "phaseEnd" },
		frequent: true,
		filter(event, player) {
			if (player.countMark("rebotu_used") >= Math.min(3, game.countPlayer())) {
				return false;
			}
			var suits = [];
			game.getGlobalHistory("cardMove", function (evt) {
				if (suits.length >= 4) {
					return;
				}
				if (evt.name == "lose") {
					if (evt.position == ui.discardPile) {
						for (var i of evt.cards) {
							suits.add(get.suit(i, false));
						}
					}
				} else {
					if (evt.name == "cardsDiscard") {
						for (var i of evt.cards) {
							suits.add(get.suit(i, false));
						}
					}
				}
			});
			return suits.length >= 4;
		},
		content() {
			player.addTempSkill("rebotu_used", "roundStart");
			player.addMark("rebotu_used", 1, false);
			player.insertPhase();
		},
		group: "rebotu_mark",
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
			},
			mark: {
				trigger: {
					global: ["loseAfter", "cardsDiscardAfter"],
					player: "phaseAfter",
				},
				forced: true,
				firstDo: true,
				silent: true,
				filter(event, player) {
					if (event.name == "phase") {
						return true;
					}
					if (player != _status.currentPhase) {
						return false;
					}
					if (event.name == "lose") {
						return event.position == ui.discardPile;
					}
					return true;
				},
				content() {
					if (trigger.name == "phase") {
						player.unmarkSkill("rebotu_mark");
						return;
					}
					var suits = [];
					game.getGlobalHistory("cardMove", function (evt) {
						if (suits.length >= 4) {
							return;
						}
						if (evt.name == "lose") {
							if (evt.position == ui.discardPile) {
								for (var i of evt.cards) {
									suits.add(get.suit(i, false));
								}
							}
						} else {
							if (evt.name == "cardsDiscard") {
								for (var i of evt.cards) {
									suits.add(get.suit(i, false));
								}
							}
						}
					});
					player.storage.rebotu_mark = suits;
					player.markSkill("rebotu_mark");
				},
				intro: {
					onunmark: true,
					content: "本回合已有$花色的牌进入过弃牌堆",
				},
			},
		},
	},
	xinganlu: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		selectTarget: 2,
		delay: 0,
		filterTarget(card, player, target) {
			if (target.isMin()) {
				return false;
			}
			if (ui.selected.targets.length == 0) {
				return true;
			}
			if (ui.selected.targets[0].countCards("e") == 0 && target.countCards("e") == 0) {
				return false;
			}
			return true;
		},
		multitarget: true,
		multiline: true,
		content() {
			"step 0";
			targets[0].swapEquip(targets[1]);
			"step 1";
			game.delayx();
			var num = Math.abs(targets[0].countCards("e") - targets[1].countCards("e"));
			if (num > player.getDamagedHp()) {
				player.chooseToDiscard("h", 2, true);
			}
		},
		ai: {
			order: 10,
			expose: 0.2,
			threaten(player, target) {
				return 0.8 * Math.max(1 + target.maxHp - target.hp);
			},
			result: {
				target(player, target) {
					if (!ui.selected.targets.length) {
						return -get.value(target.getCards("e"), target);
					}
					var target2 = ui.selected.targets[0];
					var eff_target = get.value(target2.getCards("e"), target) - get.value(target.getCards("e"), target);
					if (get.sgn(eff_target) == get.sgn(-get.value(target2.getCards("e"), target2))) {
						return 0;
					}
					return eff_target;
				},
			},
		},
	},
	xinbuyi: {
		audio: 2,
		trigger: { global: "dying" },
		filter(event, player) {
			return event.player.countCards("h") > 0;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			"step 0";
			if (player == trigger.player) {
				player.chooseCard("h", true).set("ai", function (card) {
					if (get.type(card) != "basic") {
						return 100 - get.value(card);
					}
					return 0;
				});
			} else {
				player.choosePlayerCard("h", trigger.player, true);
			}
			"step 1";
			var card = result.cards[0],
				target = trigger.player;
			player.showCards(card, get.translation(player) + "对" + (player == target ? "自己" : get.translation(target)) + "发动了【补益】");
			if (get.type(card, null, target) != "basic") {
				target.discard(card);
				target.recover();
				if (target.countCards("h") == 1) {
					target.draw();
				}
			}
		},
		logTarget: "player",
	},
	rejiaozhao: {
		audio: 2,
		enable: "phaseUse",
		group: "rejiaozhao_base",
		locked: false,
		mod: {
			targetEnabled(card, player, target) {
				if (player == target && card.storage && card.storage.rejiaozhao) {
					return false;
				}
			},
		},
		filter(event, player) {
			return player.hasMark("redanxin") && player.countCards("h") && player.getStorage("rejiaozhao_clear").length < player.countMark("redanxin");
		},
		chooseButton: {
			dialog(event, player) {
				var list = [],
					storage = player.getStorage("rejiaozhao_clear");
				for (var name of lib.inpile) {
					var type = get.type(name);
					if ((type == "basic" || type == "trick") && !storage.includes(type)) {
						list.push([type, "", name]);
						if (name == "sha") {
							for (var nature of lib.inpile_nature) {
								list.push([type, "", name, nature]);
							}
						}
					}
				}
				return ui.create.dialog("矫诏", [list, "vcard"]);
			},
			filter(button, player) {
				var card = { name: button.link[2], nature: button.link[3] };
				if (player.countMark("redanxin") < 2) {
					card.storage = { rejiaozhao: true };
				}
				var evt = _status.event.getParent();
				return evt.filterCard(card, player, evt);
			},
			check(button) {
				var card = { name: button.link[2], nature: button.link[3] },
					player = _status.event.player;
				if (player.countMark("redanxin") < 2) {
					card.storage = { rejiaozhao: true };
				}
				return player.getUseValue(card, null, true);
			},
			backup(links, player) {
				var next = {
					audio: "redanxin",
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard: true,
					position: "h",
					popname: true,
					ai1: card => 8 - get.value(card),
					onuse(result, player) {
						player.addTempSkill("rejiaozhao_clear", "phaseUseAfter");
						player.markAuto("rejiaozhao_clear", [get.type(result.card)]);
					},
				};
				if (player.countMark("redanxin") < 2) {
					next.viewAs.storage = { rejiaozhao: true };
				}
				return next;
			},
			prompt(links) {
				return "将一张手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 6,
			result: {
				player: 1,
			},
		},
		derivation: ["rejiaozhao_lv2", "rejiaozhao_lv3"],
		subSkill: {
			clear: { onremove: true },
			base: {
				audio: "rejiaozhao",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (player.hasMark("redanxin")) {
						return false;
					}
					return player.countCards("h") > 0 && game.hasPlayer(current => current != player);
				},
				filterCard: true,
				position: "h",
				discard: false,
				lose: false,
				check(card) {
					return 1 / Math.max(1, _status.event.player.getUseValue(card));
				},
				prompt: "出牌阶段限一次。你可以展示一张手牌，并令一名距离你最近的角色选择一种基本牌或普通锦囊牌的牌名。你可将此牌当做其声明的牌使用直到此阶段结束（你不是此牌的合法目标）。",
				content() {
					"step 0";
					player.showCards(cards);
					"step 1";
					var targets = game.filterPlayer();
					targets.remove(player);
					targets.sort(function (a, b) {
						return Math.max(1, get.distance(player, a)) - Math.max(1, get.distance(player, b));
					});
					var distance = Math.max(1, get.distance(player, targets[0]));
					for (var i = 1; i < targets.length; i++) {
						if (Math.max(1, get.distance(player, targets[i])) > distance) {
							targets.splice(i);
							break;
						}
					}
					player
						.chooseTarget("请选择【矫诏】的目标", true, function (card, player, target) {
							return _status.event.targets.includes(target);
						})
						.set("ai", function (target) {
							return get.attitude(_status.event.player, target);
						})
						.set("targets", targets);
					"step 2";
					if (!result.bool) {
						event.finish();
						return;
					}
					var target = result.targets[0];
					event.target = target;
					var list = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						var name = lib.inpile[i];
						if (name == "sha") {
							list.push(["基本", "", "sha"]);
							for (var j of lib.inpile_nature) {
								list.push(["基本", "", "sha", j]);
							}
						} else if (get.type(name) == "basic") {
							list.push(["基本", "", name]);
						} else if (get.type(name) == "trick") {
							list.push(["锦囊", "", name]);
						}
					}
					target
						.chooseButton(["矫诏", [list, "vcard"]], true)
						.set("ai", function (button) {
							var player = _status.event.getParent().player,
								card = {
									name: button.link[2],
									nature: button.link[3],
									storage: {
										rejiaozhao: true,
									},
								};
							return player.getUseValue(card, null, true) * _status.event.att;
						})
						.set("att", get.attitude(event.target, player) > 0 ? 1 : -1);
					"step 3";
					var chosen = result.links[0][2];
					var nature = result.links[0][3];
					var fakecard = {
						name: chosen,
						storage: { rejiaozhao: true },
					};
					if (nature) {
						fakecard.nature = nature;
					}
					event.target.showCards(
						game.createCard({
							name: chosen,
							nature: nature,
							suit: cards[0].suit,
							number: cards[0].number,
						}),
						get.translation(event.target) + "声明了" + get.translation(chosen)
					);
					game.broadcastAll(
						(player, fakecard) => {
							player.storage.rejiaozhao_viewas = fakecard;
						},
						player,
						fakecard
					);
					cards[0].addGaintag("rejiaozhao");
					player.addTempSkill("rejiaozhao_viewas", "phaseUseEnd");
				},
				ai: {
					order: 9,
					result: {
						player: 1,
					},
				},
			},
			backup: { audio: "rejiaozhao" },
			viewas: {
				enable: "phaseUse",
				mod: {
					targetEnabled(card, player, target) {
						if (player == target && card.storage && card.storage.rejiaozhao) {
							return false;
						}
					},
				},
				filter(event, player) {
					if (!player.storage.rejiaozhao_viewas) {
						return false;
					}
					var cards = player.getCards("h", function (card) {
						return card.hasGaintag("rejiaozhao");
					});
					if (!cards.length) {
						return false;
					}
					if (!game.checkMod(cards[0], player, "unchanged", "cardEnabled2", player)) {
						return false;
					}
					var card = get.autoViewAs(player.storage.rejiaozhao_viewas, cards);
					return event.filterCard(card, player, event);
				},
				viewAs(cards, player) {
					return player.storage.rejiaozhao_viewas;
				},
				filterCard(card) {
					return card.hasGaintag("rejiaozhao");
				},
				selectCard: -1,
				position: "h",
				popname: true,
				prompt() {
					return "将“矫诏”牌当做" + get.translation(_status.event.player.storage.rejiaozhao_viewas) + "使用";
				},
				onremove(player) {
					player.removeGaintag("rejiaozhao");
					delete player.storage.rejiaozhao_viewas;
				},
				ai: { order: 8 },
			},
		},
	},
	redanxin: {
		audio: 2,
		trigger: { player: "damageEnd" },
		frequent: true,
		content() {
			player.draw();
			if (player.countMark("redanxin") < 2) {
				player.addMark("redanxin", 1, false);
			}
		},
		intro: { content: "当前升级等级。：Lv#" },
		ai: {
			maixie: true,
			effect: {
				target: (card, player, target) => {
					if (!get.tag(card, "damage")) {
						return;
					}
					if (target.hp + target.hujia < 2 || player.hasSkillTag("jueqing", false, target)) {
						return 2;
					}
					if (!target.hasSkill("rejiaozhao") || target.countMark("redanxin") > 1) {
						return [1, 1];
					}
					return [1, 0.8 * target.hp - 0.4];
				},
			},
		},
	},
	//马岱
	reqianxi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		content() {
			"step 0";
			player.draw();
			"step 1";
			if (
				player.hasCard(card => {
					return lib.filter.cardDiscardable(card, player, "reqianxi");
				}, "he")
			) {
				player.chooseToDiscard("he", true).set("ai", card => {
					let player = get.event("player");
					if (get.color(card, player)) {
						return 7 - get.value(card, player);
					}
					return 4 - get.value(card, player);
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool && game.hasPlayer(current => current != player && get.distance(player, current) <= 1)) {
				var color = get.color(result.cards[0], player);
				event.color = color;
				color = get.translation(color);
				player
					.chooseTarget(true, "选择【潜袭】的目标", "令其本回合不能使用或打出" + color + "牌，且" + color + "防具失效，且回复体力时，你摸两张牌", function (card, player, target) {
						return target != player && get.distance(player, target) <= 1;
					})
					.set("ai", function (target) {
						return -get.attitude(_status.event.player, target) * Math.sqrt(1 + target.countCards("he"));
					});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.storage.reqianxi_effect = [event.color, player];
				target.addTempSkill("reqianxi_effect");
				target.markSkill("reqianxi_effect");
			}
		},
		subSkill: {
			effect: {
				mark: true,
				intro: {
					markcount: () => 0,
					content(storage, player) {
						var color = get.translation(storage[0]),
							source = get.translation(storage[1]);
						return "本回合不能使用或打出" + color + "牌，且" + color + "防具失效，且回复体力时，" + source + "摸两张牌";
					},
				},
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled2(card, player) {
						if (get.itemtype(card) == "card" && get.color(card) == player.getStorage("reqianxi_effect")[0]) {
							return false;
						}
					},
				},
				trigger: { player: "recoverEnd" },
				forced: true,
				popup: false,
				filter(event, player) {
					return player.storage.reqianxi_effect && player.storage.reqianxi_effect[1].isIn();
				},
				content() {
					var target = player.storage.reqianxi_effect[1];
					target.logSkill("reqianxi", player);
					target.draw(2);
				},
				ai: {
					unequip2: true,
					skillTagFilter(player) {
						var evt = _status.event,
							color = player.getStorage("reqianxi_effect")[0];
						if (evt.name == "lose" && evt.loseEquip) {
							var card = evt.cards[evt.num];
							if (card && get.subtype(card, false) == "equip2" && get.color(card) == color) {
								return true;
							}
							return false;
						} else {
							var equip = player.getEquip(2);
							if (equip && get.color(equip) == color) {
								return true;
							}
							return false;
						}
					},
				},
			},
		},
	},
	//徐晃
	olduanliang: {
		audio: 2,
		locked: false,
		enable: "chooseToUse",
		filterCard(card) {
			return get.type2(card) != "trick" && get.color(card) == "black";
		},
		filter(event, player) {
			return player.hasCard(card => get.type2(card) != "trick" && get.color(card) == "black", "hes");
		},
		position: "hes",
		viewAs: { name: "bingliang" },
		prompt: "将一张黑色非锦囊牌当做兵粮寸断使用",
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			order: 9,
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "bingliang" && !player.getStat("damage")) {
					return true;
				}
			},
		},
	},
	oljiezi: {
		audio: 2,
		trigger: { global: ["phaseDrawSkipped", "phaseDrawCancelled"] },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("oljiezi"), "你可选择一名角色。若该角色：手牌数为全场最少且没有“辎”，则其获得一枚“辎”。否则其摸一张牌。").set("ai", function (target) {
				var att = get.attitude(_status.event.player, target);
				if (!target.hasMark("oljiezi") && target.isMinHandcard()) {
					att *= 2;
				}
				return att;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("oljiezi", target);
				if (!target.hasMark("oljiezi") && target.isMinHandcard()) {
					target.addMark("oljiezi", 1);
				} else {
					target.draw();
				}
			}
		},
		marktext: "辎",
		intro: {
			name2: "辎",
			content: "mark",
			onunmark: true,
		},
		group: "oljiezi_extra",
		subSkill: {
			extra: {
				audio: "oljiezi",
				trigger: { global: "phaseDrawAfter" },
				forced: true,
				filter(event, player) {
					return event.player.hasMark("oljiezi");
				},
				logTarget: "player",
				content() {
					const evt = trigger.getParent("phase", true, true);
					if (evt?.phaseList) {
						evt.phaseList.splice(evt.num + 1, 0, "phaseDraw|oljiezi");
					}
					trigger.player.removeMark("oljiezi", trigger.player.countMark("oljiezi"));
				},
			},
		},
	},
	//界护驾
	rehujia: {
		audio: "hujia",
		inherit: "hujia",
		filter(event, player) {
			if (event.responded) {
				return false;
			}
			if (player.storage.hujiaing) {
				return false;
			}
			if (!player.hasZhuSkill("rehujia")) {
				return false;
			}
			if (!event.filterCard({ name: "shan" }, player, event)) {
				return false;
			}
			return game.hasPlayer(current => current != player && current.group == "wei");
		},
		ai: {
			respondShan: true,
			skillTagFilter(player) {
				if (player.storage.hujiaing) {
					return false;
				}
				if (!player.hasZhuSkill("rehujia")) {
					return false;
				}
				return game.hasPlayer(current => current != player && current.group == "wei");
			},
		},
		group: "rehujia_draw",
		subSkill: {
			draw: {
				trigger: { global: ["useCard", "respond"] },
				usable: 1,
				filter(event, player) {
					return event.card.name == "shan" && event.player != player && event.player.group == "wei" && event.player.isIn() && event.player != _status.currentPhase && player.hasZhuSkill("rehujia");
				},
				async cost(event, trigger, player) {
					event.result = await trigger.player
						.chooseBool(`护驾：是否令${get.translation(player)}摸一张牌？`)
						.set("ai", () => {
							const evt = _status.event;
							return get.attitude(evt.player, evt.getParent().player) > 0;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					trigger.player.line(player, "fire");
					await player.draw();
				},
			},
		},
	},
	//夏侯氏
	reqiaoshi: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return event.player != player && event.player.countCards("h") == player.countCards("h") && event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) >= 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			while (player.isIn() && target.isIn()) {
				const { result: list1 } = await player.draw("nodelay");
				const { result: list2 } = await target.draw();
				await game.delayx();
				if (
					[list1, list2].every(cards => get.itemtype(cards) == "cards") &&
					list1.length == list2.length &&
					list1
						.map(card => get.suit(card, player))
						.toUniqued()
						.every(suit => list2.some(card => get.suit(card, target) == suit))
				) {
					const { result } = await player.chooseBool("是否继续发动【樵拾】？", `和${get.translation(target)}各摸一张牌`);
					if (!result?.bool) {
						break;
					}
				} else {
					break;
				}
			}
		},
		ai: { expose: 0.1 },
	},
	reyanyu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => lib.skill.reyanyu.filterCard(card, player), "h");
		},
		filterCard: (card, player) => get.name(card) == "sha" && player.canRecast(card),
		discard: false,
		lose: false,
		delay: false,
		content() {
			player.recast(cards);
		},
		ai: {
			basic: {
				order: 1,
			},
			result: {
				player: 1,
			},
		},
		group: "reyanyu2",
	},
	reyanyu2: {
		trigger: { player: "phaseUseEnd" },
		direct: true,
		sourceSkill: "reyanyu",
		filter: (event, player) => player.hasHistory("useSkill", evt => evt.skill == "reyanyu" && evt.event.getParent(2) == event) && game.hasPlayer(target => target.hasSex("male") && target != player),
		content() {
			"step 0";
			event.num = Math.min(3, player.getHistory("useSkill", evt => evt.skill == "reyanyu" && evt.event.getParent(2) == trigger).length);
			player
				.chooseTarget(get.prompt("reyanyu"), "令一名男性角色摸" + get.cnNumber(event.num) + "张牌", function (card, player, target) {
					return target.hasSex("male") && target != player;
				})
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				player.logSkill("reyanyu", result.targets);
				result.targets[0].draw(event.num);
			}
		},
	},
	//虞翻
	xinzongxuan: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard") {
				return false;
			}
			var evt = event.getl(player);
			if (!evt || !evt.cards2) {
				return false;
			}
			for (var i = 0; i < evt.cards2.length; i++) {
				if (get.position(evt.cards2[i]) == "d") {
					return true;
				}
			}
			return false;
		},
		check(trigger, player) {
			if (trigger.getParent(3).name == "phaseDiscard") {
				return true;
			}
			if (
				!game.hasPlayer(function (current) {
					return current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
				})
			) {
				return false;
			}
			var cards = trigger.getl(player).cards2;
			for (var i = 0; i < cards.length; i++) {
				if (get.position(cards[i], true) == "d" && get.type2(cards[i], false) == "trick") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var cards = [],
				cards2 = trigger.getl(player).cards2;
			for (var i = 0; i < cards2.length; i++) {
				if (get.position(cards2[i], true) == "d") {
					cards.push(cards2[i]);
				}
			}
			var next = player.chooseToMove("纵玄：将任意张牌置于牌堆顶", true);
			next.set("list", [["本次弃置的牌（请将要给出的锦囊牌留在这里）", cards], ["牌堆顶"]]);
			next.set("filterOk", function (moved) {
				if (moved[0].length == 1 && get.type2(moved[0][0], false) == "trick") {
					return true;
				}
				return moved[1].length > 0;
			});
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0),
					player = _status.event.player;
				var result = [[], []];
				if (
					game.hasPlayer(function (current) {
						return current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
					})
				) {
					var max_val = 0;
					var max_card = false;
					for (var i of cards) {
						if (get.type2(i, false) == "trick") {
							var val = get.value(i, "raw");
							if (val > max_val) {
								max_card = i;
								max_val = val;
							}
						}
					}
					if (max_card) {
						result[0].push(max_card);
						cards.remove(max_card);
					}
				}
				if (cards.length) {
					var max_val = 0;
					var max_card = false;
					var equip = game.hasPlayer(function (current) {
						return current.isDamaged() && get.recoverEffect(current, player, player) > 0;
					});
					for (var i of cards) {
						var val = get.value(i);
						var type = get.type2(i, false);
						if (type == "basic") {
							val += 3;
						}
						if (type == "equip" && equip) {
							val += 9;
						}
						if (max_val == 0 || val > max_val) {
							max_card = i;
							max_val = val;
						}
					}
					if (max_card) {
						result[1].push(max_card);
						cards.remove(max_card);
					}
					result[0].addArray(cards);
				}
				return result;
			});
			"step 1";
			if (result.bool) {
				var cards = result.moved[1].slice(0);
				if (cards.length) {
					game.log(player, "将", cards, "置于了牌堆顶");
					while (cards.length) {
						ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild);
					}
				}
				var list = result.moved[0].filter(function (i) {
					return get.type2(i, false) == "trick";
				});
				if (list.length && game.hasPlayer(current => current != player)) {
					var next = player
						.chooseButton(["是否将一张锦囊牌交给一名其他角色？", list])
						.set("ai", function (button) {
							if (_status.event.goon) {
								return Math.max(0.1, get.value(button.link, "raw"));
							}
							return 0;
						})
						.set(
							"goon",
							game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
							})
						);
					if (!result.moved[1].length) {
						next.set("forced", true);
					}
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = result.links[0];
				event.card = card;
				player
					.chooseTarget(lib.filter.notMe, true, "令一名其他角色获得" + get.translation(card))
					.set("card", card)
					.set("ai", function (target) {
						var card = _status.event.card,
							player = _status.event.player;
						var eff = Math.max(0.1, get.value(card, target)) * get.attitude(player, target);
						if (target.hasSkill("nogain")) {
							eff /= 10;
						}
						return eff;
					});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.gain(card, "gain2");
			}
		},
	},
	xinzhiyan: {
		audio: "zhiyan",
		audioname: ["re_yufan", "xin_yufan"],
		audioname2: { gexuan: "zhiyan_gexuan" },
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("zhiyan"), "令一名角色摸一张牌并展示之。若为基本牌则你摸一张牌；若为装备牌，则其回复1点体力").set("ai", function (target) {
				return get.attitude(_status.event.player, target) * (target.isDamaged() ? 2 : 1);
			});
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("xinzhiyan", result.targets);
				event.bool = false;
				event.target.draw("visible");
			} else {
				event.finish();
			}
			"step 2";
			var card = result[0];
			event.card = card;
			if (get.type(card) == "basic") {
				player.draw();
			}
			"step 3";
			if (get.type(card) == "equip") {
				if (target.getCards("h").includes(card) && target.hasUseTarget(card)) {
					event.target.chooseUseTarget(card, true, "nopopup");
					game.delay();
				}
				event.bool = true;
			}
			"step 4";
			if (event.bool) {
				target.recover();
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.2,
		},
	},
	//新主公技
	xinhuangtian: {
		audio: "xinhuangtian2",
		audioname: ["zhangjiao", "re_zhangjiao"],
		global: "xinhuangtian2",
		zhuSkill: true,
	},
	xinhuangtian2: {
		audio: 2,
		enable: "phaseUse",
		discard: false,
		lose: false,
		delay: false,
		line: true,
		prepare(cards, player, targets) {
			targets[0].logSkill("xinhuangtian");
		},
		prompt() {
			var player = _status.event.player;
			var list = game.filterPlayer(function (target) {
				return target != player && target.hasZhuSkill("xinhuangtian", player);
			});
			var str = "将一张【闪】或黑桃手牌交给" + get.translation(list);
			if (list.length > 1) {
				str += "中的一人";
			}
			return str;
		},
		filter(event, player) {
			if (player.group != "qun") {
				return false;
			}
			if (
				!game.hasPlayer(function (target) {
					return target != player && target.hasZhuSkill("xinhuangtian", player) && !target.hasSkill("xinhuangtian3");
				})
			) {
				return false;
			}
			return player.hasCard(function (card) {
				return lib.skill.xinhuangtian2.filterCard(card, player);
			}, "h");
		},
		filterCard(card, player) {
			return get.name(card, player) == "shan" || get.suit(card, player) == "spade";
		},
		log: false,
		visible: true,
		filterTarget(card, player, target) {
			return target != player && target.hasZhuSkill("xinhuangtian", player) && !target.hasSkill("xinhuangtian3");
		},
		//usable:1,
		//forceaudio:true,
		content() {
			player.give(cards, target);
			target.addTempSkill("xinhuangtian3", "phaseUseEnd");
		},
		ai: {
			expose: 0.3,
			order: 10,
			result: {
				target: 5,
			},
		},
	},
	xinhuangtian3: {},
	rejijiang: {
		audio: "jijiang1",
		audioname: ["liushan", "re_liubei", "re_liushan", "ol_liushan"],
		audioname2: {
			pe_jun_liushan: "jijiang1_liushan",
		},
		group: ["rejijiang1", "rejijiang3"],
		zhuSkill: true,
		filter(event, player) {
			if (
				!player.hasZhuSkill("rejijiang") ||
				!game.hasPlayer(function (current) {
					return current != player && current.group == "shu";
				})
			) {
				return false;
			}
			return !event.jijiang && (event.type != "phase" || !player.hasSkill("jijiang3"));
		},
		enable: ["chooseToUse", "chooseToRespond"],
		viewAs: { name: "sha" },
		filterCard: () => false,
		selectCard: -1,
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.3;
			},
			respondSha: true,
			skillTagFilter(player) {
				if (
					!player.hasZhuSkill("rejijiang") ||
					!game.hasPlayer(function (current) {
						return current != player && current.group == "shu";
					})
				) {
					return false;
				}
			},
		},
	},
	rejijiang1: {
		audio: "jijiang1",
		audioname: ["liushan", "re_liubei", "re_liushan", "ol_liushan"],
		trigger: { player: ["useCardBegin", "respondBegin"] },
		logTarget: "targets",
		sourceSkill: "rejijiang",
		filter(event, player) {
			return event.skill == "rejijiang";
		},
		forced: true,
		content() {
			"step 0";
			delete trigger.skill;
			trigger.getParent().set("jijiang", true);
			"step 1";
			if (event.current == undefined) {
				event.current = player.next;
			}
			if (event.current == player) {
				player.addTempSkill("jijiang3");
				event.finish();
				trigger.cancel();
				trigger.getParent().goto(0);
			} else if (event.current.group == "shu") {
				var next = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张杀？", { name: "sha" });
				next.set("ai", function () {
					var event = _status.event;
					return get.attitude(event.player, event.source) - 2;
				});
				next.set("source", player);
				next.set("jijiang", true);
				next.set("skillwarn", "替" + get.translation(player) + "打出一张杀");
				next.noOrdering = true;
				next.autochoose = lib.filter.autoRespondSha;
			} else {
				event.current = event.current.next;
				event.redo();
			}
			"step 2";
			if (result.bool) {
				event.finish();
				trigger.card = result.card;
				trigger.cards = result.cards;
				trigger.throw = false;
				if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
					event.current.ai.shown += 0.3;
					if (event.current.ai.shown > 0.95) {
						event.current.ai.shown = 0.95;
					}
				}
			} else {
				event.current = event.current.next;
				event.goto(1);
			}
		},
	},
	rejijiang3: {
		trigger: { global: ["useCard", "respond"] },
		usable: 1,
		sourceSkill: "rejijiang",
		filter(event, player) {
			return event.card.name == "sha" && event.player != player && event.player.group == "shu" && event.player.isIn() && event.player != _status.currentPhase && player.hasZhuSkill("rejijiang");
		},
		async cost(event, trigger, player) {
			event.result = await trigger.player
				.chooseBool(`激将：是否令${get.translation(player)}摸一张牌？`)
				.set("ai", () => {
					const evt = _status.event;
					return get.attitude(evt.player, evt.getParent().player) > 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.player.line(player, "fire");
			await player.draw();
		},
	},
	//鲁肃
	olhaoshi: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed;
		},
		check(event, player) {
			return (
				player.countCards("h") + 2 + event.num <= 5 ||
				game.hasPlayer(function (target) {
					return (
						player !== target &&
						!game.hasPlayer(function (current) {
							return current !== player && current !== target && current.countCards("h") < target.countCards("h");
						}) &&
						get.attitude(player, target) > 0
					);
				})
			);
		},
		content() {
			trigger.num += 2;
			player.addTempSkill("olhaoshi_give", "phaseDrawAfter");
		},
		subSkill: {
			give: {
				trigger: { player: "phaseDrawEnd" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return player.countCards("h") > 5;
				},
				content() {
					"step 0";
					var targets = game.filterPlayer(function (target) {
							return (
								target != player &&
								!game.hasPlayer(function (current) {
									return current != player && current != target && current.countCards("h") < target.countCards("h");
								})
							);
						}),
						num = Math.floor(player.countCards("h") / 2);
					player.chooseCardTarget({
						position: "h",
						filterCard: true,
						filterTarget(card, player, target) {
							return _status.event.targets.includes(target);
						},
						targets: targets,
						selectTarget: targets.length == 1 ? -1 : 1,
						selectCard: num,
						prompt: "将" + get.cnNumber(num) + "张手牌交给一名手牌数最少的其他角色",
						forced: true,
						ai1(card) {
							var goon = false,
								player = _status.event.player;
							for (var i of _status.event.targets) {
								if (get.attitude(i, player) > 0 && get.attitude(player, i) > 0) {
									goon = true;
								}
								break;
							}
							if (goon) {
								if (
									!player.hasValueTarget(card) ||
									(card.name == "sha" &&
										player.countCards("h", function (cardx) {
											return cardx.name == "sha" && !ui.selected.cards.includes(cardx);
										}) > player.getCardUsable("sha"))
								) {
									return 2;
								}
								return Math.max(2, get.value(card) / 4);
							}
							return 1 / Math.max(1, get.value(card));
						},
						ai2(target) {
							return get.attitude(_status.event.player, target);
						},
					});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						player.give(result.cards, target);
						player.markAuto("olhaoshi_help", [target]);
						player.addTempSkill("olhaoshi_help", { player: "phaseBeginStart" });
					}
				},
			},
			help: {
				trigger: { target: "useCardToTargeted" },
				direct: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					if (!player.storage.olhaoshi_help || !player.storage.olhaoshi_help.length) {
						return false;
					}
					if (event.card.name != "sha" && get.type(event.card) != "trick") {
						return false;
					}
					for (var i of player.storage.olhaoshi_help) {
						if (i.countCards("h") > 0) {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					if (!event.targets) {
						event.targets = player.storage.olhaoshi_help.slice(0).sortBySeat();
					}
					event.target = event.targets.shift();
					event.target
						.chooseCard("h", "好施：是否将一张手牌交给" + get.translation(player) + "？")
						.set("ai", function (card) {
							var player = _status.event.player,
								target = _status.event.getTrigger().player;
							if (!_status.event.goon) {
								if (get.value(card, player) < 0 || get.value(card, target) < 0) {
									return 1;
								}
								return 0;
							}
							var cardx = _status.event.getTrigger().card;
							if (card.name == "shan" && get.tag(cardx, "respondShan") && target.countCards("h", "shan") < player.countCards("h", "shan")) {
								return 2;
							}
							if (card.name == "sha" && (cardx.name == "juedou" || (get.tag(card, "respondSha") && target.countCards("h", "sha") < player.countCards("h", "sha")))) {
								return 2;
							}
							if (get.value(card, target) > get.value(card, player) || target.getUseValue(card) > player.getUseValue(card)) {
								return 1;
							}
							if (player.hasSkillTag("noh")) {
								return 0.5 / Math.max(1, get.value(card, player));
							}
							return 0;
						})
						.set("goon", get.attitude(event.target, player) > 0);
					"step 1";
					if (result.bool) {
						target.logSkill("olhaoshi_help", player);
						target.give(result.cards, player);
					}
					if (targets.length) {
						event.goto(0);
					}
				},
			},
		},
	},
	oldimeng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.oldimeng.filterTarget(null, player, current));
		},
		selectTarget: 2,
		complexTarget: true,
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			var ps = player.countCards("he");
			if (!ui.selected.targets.length) {
				var hs = target.countCards("h");
				return game.hasPlayer(function (current) {
					if (current == player || current == target) {
						return false;
					}
					var cs = current.countCards("h");
					return (hs > 0 || cs > 0) && Math.abs(hs - cs) <= ps;
				});
			}
			var current = ui.selected.targets[0],
				hs = target.countCards("h"),
				cs = current.countCards("h");
			return (hs > 0 || cs > 0) && Math.abs(hs - cs) <= ps;
		},
		multitarget: true,
		multiline: true,
		content() {
			targets[0].swapHandcards(targets[1]);
			player.addTempSkill("oldimeng_discard", "phaseUseAfter");
			player.markAuto("oldimeng_discard", [targets]);
		},
		ai: {
			threaten: 4.5,
			pretao: true,
			nokeep: true,
			order: 1,
			expose: 0.2,
			result: {
				target(player, target) {
					if (!ui.selected.targets.length) {
						return -Math.sqrt(target.countCards("h"));
					}
					var h1 = ui.selected.targets[0].getCards("h"),
						h2 = target.getCards("h");
					if (h2.length > h1.length) {
						return 0;
					}
					var delval = get.value(h2, target) - get.value(h1, ui.selected.targets[0]);
					if (delval >= 0) {
						return 0;
					}
					return -delval * (h1.length - h2.length);
				},
			},
		},
		subSkill: {
			discard: {
				audio: "oldimeng",
				trigger: { player: "phaseUseEnd" },
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return player.countCards("he") > 0;
				},
				async content(event, trigger, player) {
					for (let targets of player.getStorage("oldimeng_discard")) {
						if (targets.length < 2) {
							continue;
						}
						const num = Math.abs(targets[0].countCards("h") - targets[1].countCards("h"));
						if (num > 0 && player.countCards("he") > 0) {
							await player.chooseToDiscard("he", true, num);
						}
					}
				},
			},
		},
	},
	//贾诩
	rewansha: {
		audio: "wansha",
		audioname: ["re_jiaxu", "boss_lvbu3", "new_simayi"],
		audioname2: { shen_simayi: "jilue_wansha" },
		global: "rewansha_global",
		trigger: { global: "dyingBegin" },
		forced: true,
		logTarget: "player",
		filter(event, player) {
			return player == _status.currentPhase;
		},
		content() {
			game.countPlayer(function (current) {
				if (current != player && current != trigger.player) {
					current.addSkillBlocker("rewansha_fengyin");
				}
			});
			player.addTempSkill("rewansha_clear");
		},
		subSkill: {
			global: {
				mod: {
					cardEnabled(card, player) {
						var source = _status.currentPhase;
						if (card.name == "tao" && source && source != player && source.hasSkill("rewansha") && !player.isDying()) {
							return false;
						}
					},
					cardSavable(card, player) {
						var source = _status.currentPhase;
						if (card.name == "tao" && source && source != player && source.hasSkill("rewansha") && !player.isDying()) {
							return false;
						}
					},
				},
			},
			fengyin: {
				inherit: "fengyin",
			},
			clear: {
				trigger: { global: "dyingAfter" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return !_status.dying.length;
				},
				content() {
					player.removeSkill("rewansha_clear");
				},
				onremove() {
					game.countPlayer2(function (current) {
						current.removeSkillBlocker("rewansha_fengyin");
					});
				},
			},
		},
	},
	reluanwu: {
		audio: "luanwu",
		inherit: "luanwu",
		async contentAfter(event, trigger, player) {
			await player.chooseUseTarget("sha", "是否使用一张【杀】？", false, "nodistance");
		},
	},
	reweimu: {
		audio: 2,
		mod: {
			targetEnabled(card) {
				if (get.type2(card) == "trick" && get.color(card) == "black") {
					return false;
				}
			},
		},
		trigger: { player: "damageBegin4" },
		forced: true,
		filter(event, player) {
			return player == _status.currentPhase;
		},
		content() {
			trigger.cancel();
			var num = trigger.num;
			player.draw(2 * num);
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (target == _status.currentPhase && get.tag(card, "damage")) {
						return [0, 2, 0, 0];
					}
				},
			},
		},
		group: "reweimu_log",
		subSkill: {
			log: {
				audio: "reweimu",
				trigger: { global: "useCard1" },
				forced: true,
				firstDo: true,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					if (get.color(event.card) != "black" || get.type(event.card) != "trick") {
						return false;
					}
					var info = lib.card[event.card.name];
					return info && info.selectTarget && info.selectTarget == -1 && !info.toself;
				},
				content() {},
			},
		},
	},
	//顾雍
	reshenxing: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") >= Math.min(2, player.countMark("reshenxing_used"));
		},
		selectCard() {
			return Math.min(2, _status.event.player.countMark("reshenxing_used"));
		},
		prompt() {
			return "弃置" + get.cnNumber(Math.min(2, _status.event.player.countMark("reshenxing_used"))) + "张牌并摸一张牌";
		},
		check(card) {
			var num = _status.event.player.countCards("h", { color: get.color(card) });
			if (get.position(card) == "e") {
				num++;
			}
			return (Math.max(4, 7.1 - num) - get.value(card)) / num;
		},
		filterCard: true,
		position: "he",
		content() {
			player.draw();
			player.addTempSkill(event.name + "_used", "phaseUseAfter");
			player.addMark(event.name + "_used", 1, false);
		},
		ai: {
			order(item, player) {
				if (!player.hasMark("reshenxing_used")) {
					return 10;
				}
				return 1;
			},
			result: { player: 1 },
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "已发动过#次",
				},
			},
		},
	},
	rebingyi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterx(player) {
			var cards = player.getCards("h");
			if (cards.length == 1) {
				return true;
			}
			var color = get.color(cards[0], player);
			for (var i = 1; i < cards.length; i++) {
				if (get.color(cards[i], player) != color) {
					return false;
				}
			}
			return true;
		},
		filtery(player) {
			var cards = player.getCards("h");
			if (cards.length == 1) {
				return true;
			}
			var color = get.number(cards[0], player);
			for (var i = 1; i < cards.length; i++) {
				if (get.number(cards[i], player) != color) {
					return false;
				}
			}
			return true;
		},
		async cost(event, trigger, player) {
			const selfDraw = get.info(event.skill).filterx(player) && get.info(event.skill).filtery(player),
				asyncDraw = get.info(event.skill).filterx(player);
			if (asyncDraw) {
				const num = player.countCards("h");
				const result = await player
					.chooseTarget(get.prompt(event.skill), `展示所有手牌，并选择至多${get.cnNumber(num)}名角色各摸一张牌${selfDraw ? "，然后你摸一张牌" : ""}`, [0, num])
					.set("ai", function (target) {
						return get.attitude(get.player(), target);
					})
					.forResult();
				if (result.bool) {
					event.result = {
						bool: result.bool,
						cost_data: {
							asyncDraw,
							selfDraw,
							targets: result.targets,
						},
					};
				}
			} else {
				event.result = await player
					.chooseBool(get.prompt(event.skill), `展示所有手牌${selfDraw ? "，然后你摸一张牌" : ""}`)
					.set("choice", selfDraw)
					.set("ai", () => get.event().choice)
					.forResult();
				event.result.cost_data = { selfDraw };
			}
		},
		async content(event, trigger, player) {
			await player.showHandcards(get.translation(player) + "发动了【秉壹】");
			const data = event.cost_data;
			if (data.asyncDraw && data.targets && data.targets.length) {
				const targets = data.targets.sortBySeat();
				await game.asyncDraw(targets);
			}
			if (data.selfDraw) {
				player.draw();
			}
		},
	},
	//钟会
	xinquanji: {
		audio: 2,
		trigger: {
			player: ["damageEnd"],
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player, triggername) {
			return event.name == "damage" ? event.num : 1;
		},
		filter(event, player) {
			if (event.name == "damage") {
				return event.num > 0;
			}
			if (event.name == "loseAsync") {
				if (event.type != "gain" || event.giver) {
					return false;
				}
				return game.hasPlayer(current => {
					if (current == player) {
						return false;
					}
					return event.getg?.(current).some(card => event.getl?.(player)?.cards2?.includes(card));
				});
			}
			if (player == event.player) {
				return false;
			}
			if (event.giver || event.getParent().name == "gift") {
				return false;
			}
			return event.getl?.(player)?.cards2?.length;
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
			const hs = player.getCards("h");
			if (!hs.length) {
				return;
			}
			const result = hs.length == 1 ? { bool: true, cards: hs } : await player.chooseCard("h", true, "选择一张手牌作为“权”").forResult();
			if (result?.bool && result?.cards?.length) {
				const next = player.addToExpansion(result.cards, player, "give");
				next.gaintag.add(event.name);
				await next;
			}
		},
		locked: false,
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("xinquanji").length;
			},
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			notemp: true,
			threaten: 0.8,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && !target.storage.xinzili) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [0.5, get.tag(card, "damage") * 2];
						}
						if (!target.hasSkill("xinpaiyi") && target.hp > 1) {
							return [0.5, get.tag(card, "damage") * 1.5];
						}
						if (target.hp == 3) {
							return [0.5, get.tag(card, "damage") * 1.5];
						}
						if (target.hp == 2) {
							return [1, get.tag(card, "damage") * 0.5];
						}
					}
				},
			},
		},
	},
	xinzili: {
		derivation: "xinpaiyi",
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.getExpansions("xinquanji").length > 2;
		},
		content() {
			player.awakenSkill(event.name);
			player.recover();
			player.draw(2);
			player.loseMaxHp();
			player.addSkills("xinpaiyi");
		},
		ai: {
			combo: "xinquanji",
		},
	},
	xinpaiyi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (player.getStorage("xinpaiyi_used").length > 1) {
				return false;
			}
			return player.getExpansions("xinquanji").length > 0;
		},
		chooseButton: {
			check(button) {
				if (typeof button.link == "object") {
					return 1;
				}
				var player = _status.event.player,
					num = player.getExpansions("xinquanji").length - 1;
				if (button.link == 1) {
					if (
						game.countPlayer(function (current) {
							return get.damageEffect(current, player, player) > 0;
						}) < num
					) {
						return 0.5;
					}
					return 2;
				}
				if (num < 2) {
					return 0;
				}
				return 1;
			},
			dialog(event, player) {
				var dialog = ui.create.dialog("权计", "hidden");
				var table = document.createElement("div");
				table.classList.add("add-setting");
				table.style.margin = "0";
				table.style.width = "100%";
				table.style.position = "relative";
				var list = ["摸牌", "造成伤害"];
				dialog.add([
					list.map((item, i) => {
						return [i, item];
					}),
					"tdnodes",
				]);
				dialog.add(player.getExpansions("xinquanji"));
				return dialog;
			},
			select: 2,
			filter(button, player) {
				if (typeof button.link == "number" && player.getStorage("xinpaiyi_used").includes(button.link)) {
					return false;
				}
				if (ui.selected.buttons.length) {
					return typeof ui.selected.buttons[0].link != typeof button.link;
				}
				return true;
			},
			backup(links) {
				if (typeof links[0] == "object") {
					links.reverse();
				}
				var next = get.copy(lib.skill["xinpaiyi_backup" + links[0]]);
				next.card = links[1];
				return next;
			},
			prompt(links, player) {
				if (typeof links[0] == "object") {
					links.reverse();
				}
				var num = get.cnNumber(Math.max(1, player.getExpansions("xinquanji").length - 1)),
					card = get.translation(links[1]);
				if (links[0] == 0) {
					return "移去" + card + "并令一名角色摸" + num + "张牌";
				}
				return "移去" + card + "并对至多" + num + "名角色造成1点伤害";
			},
		},
		ai: {
			order: 1,
			result: { player: 1 },
			combo: "xinquanji",
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			backup0: {
				audio: "xinpaiyi",
				filterCard: () => false,
				selectCard: -1,
				filterTarget: true,
				delay: false,
				content() {
					"step 0";
					player.addTempSkill("xinpaiyi_used", "phaseUseEnd");
					player.markAuto("xinpaiyi_used", [0]);
					var card = lib.skill.xinpaiyi_backup.card;
					player.loseToDiscardpile(card);
					"step 1";
					target.draw(Math.max(1, player.getExpansions("xinquanji").length));
				},
				ai: {
					result: {
						target(player, target) {
							if (target.hasSkill("nogain")) {
								return 0;
							}
							if (player == target && !player.needsToDiscard()) {
								return 3;
							}
							return 1;
						},
					},
				},
			},
			backup1: {
				audio: "xinpaiyi",
				filterCard: () => false,
				selectCard: -1,
				filterTarget: true,
				delay: false,
				multitarget: true,
				multiline: true,
				selectTarget() {
					return [1, Math.max(1, _status.event.player.getExpansions("xinquanji").length - 1)];
				},
				content() {
					"step 0";
					targets.sortBySeat();
					player.addTempSkill("xinpaiyi_used", "phaseUseEnd");
					player.markAuto("xinpaiyi_used", [1]);
					var card = lib.skill.xinpaiyi_backup.card;
					player.loseToDiscardpile(card);
					"step 1";
					for (var i of targets) {
						i.damage();
					}
				},
				ai: {
					tag: {
						damage: 1,
					},
					result: {
						target: -1.5,
					},
				},
			},
		},
	},
	//界蔡夫人
	reqieting: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		direct: true,
		filter(event, player) {
			var target = event.player;
			if (player == target) {
				return false;
			}
			if (!target.getHistory("sourceDamage").length) {
				var cards = target.getCards("e");
				for (var i of cards) {
					if (player.canEquip(i)) {
						return true;
					}
				}
			}
			return (
				target.getHistory("useCard", function (evt) {
					return (
						evt.targets &&
						evt.targets.filter(function (i) {
							return i != target;
						}).length > 0
					);
				}).length == 0
			);
		},
		frequent: true,
		content() {
			"step 0";
			var target = trigger.player;
			event.target = target;
			event.logged = false;
			var list = [];
			if (!target.getHistory("sourceDamage").length) {
				var cards = target.getCards("e");
				for (var i of cards) {
					if (player.canEquip(i)) {
						list.push(i);
					}
				}
			}
			if (list.length) {
				player
					.choosePlayerCard(target, "e", get.prompt("reqieting", target))
					.set("list", list)
					.set("filterButton", function (button) {
						return _status.event.list.includes(button.link);
					})
					.set("ai", function (button) {
						var evt = _status.event,
							val = get.value(button.link);
						if (evt.target.hasSkillTag("noe")) {
							val -= 4;
						}
						if (evt.att > 0 == val > 0) {
							return 0;
						}
						return get.effect(evt.player, button.link, evt.player, evt.player);
					})
					.set("att", get.attitude(player, target));
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("reqieting", target);
				event.logged = true;
				var card = result.links[0];
				target.$give(card, player, false);
				game.delay(0.5);
				player.equip(card);
			}
			if (
				target.getHistory("useCard", function (evt) {
					return (
						evt.targets &&
						evt.targets.filter(function (i) {
							return i != target;
						}).length > 0
					);
				}).length != 0
			) {
				event.finish();
			}
			"step 2";
			player.chooseBool("是否发动【窃听】摸一张牌？").set("frequentSkill", "reqieting");
			"step 3";
			if (result.bool) {
				if (!event.logged) {
					player.logSkill("reqieting", target);
				}
				player.draw();
			}
		},
	},
	rexianzhou: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.countCards("e") > 0;
		},
		filterCard: true,
		position: "e",
		selectCard: -1,
		filterTarget: lib.filter.notMe,
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.give(cards, target);
			player.recover(cards.length);
			"step 1";
			var list = game.filterPlayer(function (current) {
				return target.inRange(current);
			});
			if (list.length) {
				var max = Math.min(list.length, cards.length);
				target
					.chooseTarget(true, [1, max], "对至多" + get.cnNumber(max) + "名范围内的角色各造成1点伤害", function (card, player, target) {
						return _status.event.list.includes(target);
					})
					.set("list", list)
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.damageEffect(target, player, player);
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.line(targets, "green");
				for (var i of targets) {
					i.damage("nocard");
				}
			}
		},
		ai: {
			order: 1,
			result: {
				target: 1,
				player(player) {
					var bool = true,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != player && get.attitude(player, players[i]) > 2 && get.attitude(players[i], player) > 2) {
							bool = false;
							break;
						}
					}
					if (bool) {
						return -10;
					}
					if (player.hp == 1) {
						return 1;
					}
					if (game.phaseNumber < game.players.length) {
						return -10;
					}
					if (player.countCards("e") + player.hp <= player.maxHp) {
						return 1;
					}
					return -10;
				},
			},
		},
	},
	//界关平
	relongyin: {
		audio: 2,
		init: player => {
			game.addGlobalSkill("relongyin_order");
		},
		onremove: player => {
			if (!game.hasPlayer(current => current.hasSkill("relongyin", null, null, false), true)) {
				game.removeGlobalSkill("relongyin_order");
			}
		},
		trigger: { global: "useCard" },
		direct: true,
		filter(event, player) {
			return event.card.name == "sha" && player.countCards("he") > 0 && event.player.isPhaseUsing();
		},
		content() {
			"step 0";
			var go = false;
			if (get.attitude(player, trigger.player) > 0) {
				if (get.color(trigger.card) == "red") {
					go = true;
				} else if (trigger.addCount === false || !trigger.player.isPhaseUsing()) {
					go = false;
				} else if (!trigger.player.hasSkill("paoxiao") && !trigger.player.hasSkill("tanlin3") && !trigger.player.hasSkill("zhaxiang2") && !trigger.player.hasSkill("fengnu") && !trigger.player.getEquip("zhuge")) {
					var nh = trigger.player.countCards("h");
					if (player == trigger.player) {
						go = player.countCards("h", "sha") > 0;
					} else if (nh >= 4) {
						go = true;
					} else if (player.countCards("h", "sha")) {
						if (nh == 3) {
							go = Math.random() < 0.8;
						} else if (nh == 2) {
							go = Math.random() < 0.5;
						}
					} else if (nh >= 3) {
						if (nh == 3) {
							go = Math.random() < 0.5;
						} else if (nh == 2) {
							go = Math.random() < 0.2;
						}
					}
				}
			}
			//AI停顿
			if (
				go &&
				!event.isMine() &&
				!event.isOnline() &&
				player.hasCard(function (card) {
					return get.value(card) < 6 && lib.filter.cardDiscardable(card, player, event.name);
				}, "he")
			) {
				game.delayx();
			}
			var next = player.chooseToDiscard(get.prompt("longyin"), "弃置一张牌" + (get.color(trigger.card) == "red" ? "并摸一张牌" : "") + "，令" + get.translation(trigger.player) + "本次使用的【杀】不计入使用次数", "he");
			next.logSkill = ["relongyin", trigger.player];
			next.set("ai", function (card) {
				if (_status.event.go) {
					return 6 - get.value(card);
				}
				return 0;
			});
			next.set("go", go);
			"step 1";
			if (result.bool) {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					trigger.player.getStat().card.sha--;
				}
				if (get.color(trigger.card) == "red") {
					player.draw();
				}
				if (get.number(result.cards[0], player) == get.number(trigger.card)) {
					player.restoreSkill("jiezhong");
				}
			}
		},
		ai: {
			expose: 0.2,
		},
		subSkill: {
			order: {
				mod: {
					aiOrder: (player, card, num) => {
						if (num && card.name === "sha" && get.color(card) === "red") {
							let gp = game.findPlayer(current => {
								return current.hasSkill("relongyin") && current.hasCard(i => true, "he");
							});
							if (gp) {
								return num + 0.15 * Math.sign(get.attitude(player, gp));
							}
						}
					},
				},
				trigger: { player: "dieAfter" },
				filter: (event, player) => {
					return !game.hasPlayer(current => current.hasSkill("relongyin", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				charlotte: true,
				content: () => {
					game.removeGlobalSkill("relongyin_order");
				},
			},
		},
	},
	jiezhong: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		content() {
			player.awakenSkill(event.name);
			player.draw(Math.min(5, player.maxHp - player.countCards("h")));
		},
	},
	//新郭淮
	decadejingce: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			return player.getHistory("useCard").length >= player.hp;
		},
		content() {
			"step 0";
			var list = [],
				history = player.getHistory("useCard");
			for (var i of history) {
				let suit = get.suit(i.card);
				if (lib.suit.includes(suit)) {
					list.add(suit);
				}
				if (list.length >= player.hp) {
					break;
				}
			}
			if (list.length >= player.hp) {
				event.goon = true;
			} else {
				player.chooseControl("摸牌阶段", "出牌阶段").set("prompt", "精策：选择要执行的额外阶段");
			}
			"step 1";
			//插入阶段，后来的先插
			const evt = trigger.getParent("phase", true, true);
			if (event.goon || result.index == 1) {
				if (evt?.phaseList) {
					evt.phaseList.splice(evt.num + 1, 0, `phaseUse|${event.name}`);
				}
			}
			if (event.goon || result.index == 0) {
				if (evt?.phaseList) {
					evt.phaseList.splice(evt.num + 1, 0, `phaseDraw|${event.name}`);
				}
			}
		},
	},
	//新于禁
	decadezhenjun: {
		audio: 2,
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countDiscardableCards(player, "he") > 0;
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("decadezhenjun"), function (card, player, target) {
					return target.countDiscardableCards(player, "he") > 0;
				})
				.set("ai", function (target) {
					const player = get.player();
					return -get.attitude(player, target) * (target.countDiscardableCards(player, "e") + 1);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				var num = Math.min(Math.max(target.countCards("h") - target.hp, 1), target.countDiscardableCards(player, "he"));
				player.logSkill("decadezhenjun", target);
				player.discardPlayerCard(num, target, true);
			}
			"step 2";
			if (result.cards && result.cards.length) {
				for (var i = 0; i < result.cards.length; i++) {
					if (get.type(result.cards[i]) == "equip") {
						event.finish();
						return;
					}
				}
				event.num = result.cards.length;
				if (event.num > 0) {
					var prompt = "弃置一张牌，或令" + get.translation(event.target) + "摸" + get.cnNumber(event.num) + "张牌";
					player.chooseToDiscard(prompt, "he").ai = function (card) {
						return 7 - get.value(card);
					};
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 3";
			if (!result.bool) {
				event.target.draw(event.num);
			}
		},
	},
	//界姜维
	oltiaoxin: {
		audio: "tiaoxin",
		audioname: ["sp_jiangwei", "xiahouba", "re_jiangwei", "gz_jiangwei", "ol_jiangwei"],
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
		},
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.oltiaoxin.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target != player && target.inRange(player) && target.countCards("he") > 0;
		},
		async content(event, trigger, player) {
			const { target } = event;
			const { result } = await target
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, "挑衅：对" + get.translation(player) + "使用一张杀，或令其弃置你的一张牌")
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("sourcex", player);
			if (
				!result.bool ||
				!player.hasHistory("damage", evt => {
					return evt.getParent().type == "card" && evt.getParent(4) == event;
				})
			) {
				if (target.countDiscardableCards(player, "he") > 0) {
					await player.discardPlayerCard(target, "he", true).set("boolline", true);
				}
				player.addTempSkill(event.name + "_rewrite", "phaseUseEnd");
			}
		},
		ai: {
			order: 4,
			expose: 0.2,
			result: {
				target: -1,
				player(player, target) {
					if (target.countCards("h") == 0) {
						return 0;
					}
					if (target.countCards("h") == 1) {
						return -0.1;
					}
					if (player.hp <= 2) {
						return -2;
					}
					if (player.countCards("h", "shan") == 0) {
						return -1;
					}
					return -0.5;
				},
			},
			threaten: 1.1,
		},
		subSkill: { rewrite: { charlotte: true } },
	},
	olzhiji: {
		skillAnimation: true,
		animationColor: "fire",
		audio: 2,
		juexingji: true,
		//priority:-10,
		derivation: "reguanxing",
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		forced: true,
		filter(event, player) {
			return player.countCards("h") == 0;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.chooseDrawRecover(2, true);
			"step 1";
			player.loseMaxHp();
			player.addSkills("reguanxing");
		},
	},
	//界郭图张嶷
	rejigong: {
		audio: 2,
		direct: true,
		trigger: { player: "phaseUseBegin" },
		content() {
			"step 0";
			player
				.chooseControl("一张", "两张", "三张", "cancel2")
				.set("prompt", get.prompt2("rejigong"))
				.set("ai", () => "三张");
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("rejigong");
				player.addTempSkill("rejigong2");
				player.draw(1 + result.index);
			}
		},
	},
	rejigong2: {
		audio: "rejigong",
		mod: {
			maxHandcardBase(player) {
				if (game.online) {
					return player.getStat("damage") || 0;
				}
				var num = 0;
				player.getHistory("sourceDamage", function (evt) {
					num += evt.num;
				});
				return num;
			},
		},
		trigger: { player: "phaseDiscardEnd" },
		forced: true,
		charlotte: true,
		sourceSkill: "rejigong",
		filter(event, player) {
			if (player.isHealthy()) {
				return false;
			}
			var num = 0;
			player.getHistory("sourceDamage", function (evt) {
				num += evt.num;
			});
			if (!num) {
				return false;
			}
			var num2 = 0;
			player.getHistory("gain", function (evt) {
				var evtx = evt.getParent(2);
				if (evtx.name == "rejigong" && evtx.player == player) {
					num2 += evt.cards.length;
				}
			});
			return num >= num2;
		},
		content() {
			player.recover();
		},
	},
	reshizhi: {
		audio: 2,
		mod: {
			cardname(card, player) {
				if (card.name == "shan" && player.hp == 1) {
					return "sha";
				}
			},
		},
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.card && event.card.name == "sha" && player.hp == 1 && event.cards && event.cards.length == 1 && event.cards[0].name == "shan";
		},
		content() {
			player.recover();
		},
		ai: {
			halfneg: true,
		},
	},
	//界陈群
	redingpin: {
		audio: 2,
		enable: "phaseUse",
		onChooseToUse(event) {
			if (event.type != "phase" || game.online) {
				return;
			}
			var list = [],
				player = event.player;
			player.getHistory("useCard", function (evt) {
				list.add(get.type2(evt.card));
			});
			player.getHistory("lose", function (evt) {
				if (evt.type != "discard" || evt.getParent(2).redingpin_ignore) {
					return;
				}
				for (var i of evt.cards2) {
					list.add(get.type2(i, evt.hs.includes(i) ? player : false));
				}
			});
			event.set("redingpin_types", list);
		},
		filter(event, player) {
			var list = event.redingpin_types || [];
			return (
				player.countCards("he", function (card) {
					return !list.includes(get.type2(card));
				}) > 0
			);
		},
		filterCard(card) {
			var list = _status.event.redingpin_types || [];
			return !list.includes(get.type2(card));
		},
		position: "he",
		filterTarget(card, player, target) {
			return !target.hasSkill("redingpin2");
		},
		content() {
			"step 0";
			target.judge(function (card) {
				var evt = _status.event.getParent("redingpin"),
					suit = get.suit(card);
				switch (suit) {
					case "club":
					case "spade":
						return evt.target.hp;
					case "diamond":
						return get.sgn(get.attitude(evt.target, evt.player)) * -3;
				}
				return 0;
			}).judge2 = function (result) {
				if (result.color == "black") {
					return true;
				}
				return false;
			};
			"step 1";
			switch (result.suit) {
				case "spade":
				case "club":
					if (target.hp > 0) {
						target.draw(Math.min(3, target.hp));
					}
					target.addTempSkill("redingpin2");
					break;
				case "heart":
					event.getParent().redingpin_ignore = true;
					break;
				case "diamond":
					player.turnOver();
					break;
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (player.isTurnedOver()) {
						return target.hp;
					}
					var card = ui.cardPile.firstChild;
					if (!card) {
						return;
					}
					if (get.color(card) == "black") {
						return target.hp;
					}
					return 0;
				},
			},
		},
	},
	redingpin2: { charlotte: true },
	refaen: {
		audio: 2,
		audioname: ["dc_chenqun"],
		trigger: { global: ["turnOverAfter", "linkAfter"] },
		logTarget: "player",
		filter(event, player) {
			if (event.name == "link") {
				return event.player.isLinked();
			}
			return true;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			trigger.player.draw();
		},
		global: "faen_global",
	},
	dcfaen: {
		audio: "refaen",
		audioname: ["dc_chenqun"],
		trigger: { global: ["turnOverAfter", "linkAfter"] },
		logTarget: "player",
		filter(event, player) {
			if (event.name == "link") {
				return event.player.isLinked();
			}
			return !event.player.isTurnedOver();
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			trigger.player.draw();
		},
		global: "faen_global",
	},
	//界曹彰
	xinjiangchi: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		content() {
			"step 0";
			var list = ["摸一张牌", "摸两张牌，本回合内不能使用或打出【杀】"];
			if (
				player.countCards("he", function (card) {
					return lib.filter.cardDiscardable(card, player, "xinjiangchi") > 0;
				}) > 0
			) {
				list.push("弃置一张牌，本回合可以多使用一张【杀】且无距离限制");
			}
			player
				.chooseControl("cancel2")
				.set("prompt", get.prompt("xinjiangchi"))
				.set("choiceList", list)
				.set("ai", function () {
					var player = _status.event.player;
					if (
						!player.countCards("hs", function (card) {
							return get.name(card) == "sha" && player.hasValueTarget(card, false);
						})
					) {
						return 1;
					}
					return 0;
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("xinjiangchi");
				switch (result.index) {
					case 0: {
						player.draw();
						break;
					}
					case 1: {
						player.draw(2);
						player.addTempSkill("xinjiangchi_less");
						break;
					}
					case 2: {
						player.chooseToDiscard("he", true);
						player.addTempSkill("xinjiangchi_more");
						break;
					}
				}
			}
		},
		subSkill: {
			less: {
				mod: {
					cardEnabled(card) {
						if (card.name == "sha") {
							return false;
						}
					},
					cardRespondable(card) {
						if (card.name == "sha") {
							return false;
						}
					},
				},
				charlotte: true,
			},
			more: {
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + 1;
						}
					},
					targetInRange(card) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
				charlotte: true,
			},
		},
	},
	//界周仓和程普
	ollihuo: {
		mod: {
			aiOrder(player, card, num) {
				if (card.name == "sha" && !player.getHistory("useCard").length) {
					return num + 7;
				}
			},
		},
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name == "sha" && !game.hasNature(event.card)) {
				return true;
			}
			return false;
		},
		audio: "lihuo",
		locked: false,
		prompt2(event) {
			return "将" + get.translation(event.card) + "改为火属性";
		},
		audioname: ["re_chengpu"],
		check(event, player) {
			return (
				(event.baseDamage > 1 || player.getHistory("useCard").indexOf(event) == 0) &&
				(player.hp > 1 || player.getExpansions("rechunlao").length) &&
				game.hasPlayer(function (current) {
					return !event.targets.includes(current) && player.canUse(event.card, current) && get.attitude(player, current) < 0 && !current.hasShan() && get.effect(current, { name: "sha", nature: "fire" }, player, player) > 0;
				})
			);
		},
		content() {
			game.setNature(trigger.card, "fire");
			trigger.lihuo_changed = true;
		},
		group: ["ollihuo2", "ollihuo3", "ollihuo4"],
		ai: {
			fireAttack: true,
		},
	},
	ollihuo2: {
		trigger: { player: "useCard2" },
		sourceSkill: "ollihuo",
		filter(event, player) {
			if (event.card.name != "sha" || !game.hasNature(event.card, "fire")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return !event.targets.includes(current) && lib.filter.targetEnabled(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("ollihuo"), "为" + get.translation(trigger.card) + "增加一个目标", function (card, player, target) {
					return !_status.event.sourcex.includes(target) && lib.filter.targetInRange(_status.event.card, player, target) && lib.filter.targetEnabled(_status.event.card, player, target);
				})
				.set("sourcex", trigger.targets)
				.set("card", trigger.card)
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, _status.event.card, player, player);
				});
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !_status.connectMode) {
					game.delayx();
				}
				event.target = result.targets[0];
			} else {
				event.finish();
			}
			"step 2";
			player.logSkill("ollihuo", event.target);
			trigger.targets.push(event.target);
		},
	},
	ollihuo3: {
		trigger: { player: "useCardEnd" },
		sourceSkill: "ollihuo",
		filter(event, player) {
			return (
				event.lihuo_changed == true &&
				player.getHistory("sourceDamage", function (evt) {
					return evt.card == event.card;
				}).length > 0
			);
		},
		forced: true,
		audio: "lihuo",
		audioname: ["re_chengpu"],
		content() {
			player.loseHp();
		},
	},
	ollihuo4: {
		trigger: { player: "useCardAfter" },
		frequent: true,
		audio: "lihuo",
		audioname: ["re_chengpu"],
		sourceSkill: "ollihuo",
		filter(event, player) {
			return event.card.name == "sha" && player.getHistory("useCard").indexOf(event) == 0 && event.cards.filterInD().length > 0;
		},
		content() {
			var cards = trigger.cards.filterInD();
			player.addToExpansion("gain2", cards).gaintag.add("rechunlao");
		},
	},
	rezhongyong: {
		trigger: { player: "useCardAfter" },
		audio: 2,
		direct: true,
		filter(event, player) {
			return event.card.name == "sha";
		},
		content() {
			"step 0";
			event.cards = trigger.cards.filterInD();
			game.countPlayer2(function (current) {
				current.getHistory("useCard", function (evt) {
					if (evt.card.name == "shan" && evt.getParent(3) == trigger) {
						event.cards.addArray(evt.cards.filterInD("od"));
					}
				});
			});
			if (!event.cards.length) {
				event.finish();
			}
			player
				.chooseTarget(get.prompt2("rezhongyong"), "令一名其他角色获得" + get.translation(event.cards), function (card, player, target) {
					return !_status.event.source.includes(target) && target != player;
				})
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				})
				.set("source", trigger.targets);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("rezhongyong", target);
				target.gain(cards, "gain2");
				var red = false,
					black = false;
				for (var i of cards) {
					var color = get.color(i, false);
					if (color == "red") {
						red = true;
					}
					if (color == "black") {
						black = true;
					}
					if (red && black) {
						break;
					}
				}
				if (red) {
					target
						.chooseToUse("是否使用一张杀？", { name: "sha" })
						.set("filterTarget", function (card, player, target) {
							return target != _status.event.sourcex && _status.event.sourcex.inRange(target) && lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("sourcex", player)
						.set("addCount", false);
				}
				if (black) {
					target.draw();
				}
			}
		},
	},
	//长标
	changbiao: {
		audio: 2,
		mod: {
			targetInRange(card, player, target) {
				if (card.changbiao) {
					return true;
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "sha",
			changbiao: true,
		},
		locked: false,
		filter(event, player) {
			return player.countCards("hs") > 0;
		},
		filterCard: true,
		selectCard: [1, Infinity],
		position: "hs",
		check(card) {
			let player = _status.event.player;
			if (ui.selected.cards.length) {
				let list = game
					.filterPlayer(function (current) {
						return current !== player && player.canUse("sha", current, false) && get.effect(current, { name: "sha" }, player, player) > 0;
					})
					.sort(function (a, b) {
						return get.effect(b, { name: "sha" }, player, player) - get.effect(a, { name: "sha" }, player, player);
					});
				if (!list.length) {
					return 0;
				}
				let target = list[0],
					cards = ui.selected.cards.concat([card]),
					color = [];
				for (let i of cards) {
					if (!color.includes(get.color(i, player))) {
						color.add(get.color(i, player));
					}
				}
				if (color.length !== 1) {
					color[0] = "none";
				}
				if (
					player.hasSkillTag(
						"directHit_ai",
						true,
						{
							target: target,
							card: {
								name: "sha",
								suit: "none",
								color: color[0],
								cards: cards,
								isCard: true,
							},
						},
						true
					)
				) {
					return 6.5 - get.value(card, player);
				}
				if (
					Math.random() * target.countCards("hs") < 1 ||
					player.needsToDiscard(0, (i, player) => {
						return !ui.selected.cards.includes(i) && !player.canIgnoreHandcard(i);
					})
				) {
					return 6 - get.value(card, player);
				}
				return 0;
			}
			return 6.3 - get.value(card);
		},
		onuse(result, player) {
			player.addTempSkill("changbiao_draw");
		},
		subSkill: {
			draw: {
				audio: "changbiao",
				trigger: { player: "phaseUseEnd" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return player.hasHistory("sourceDamage", function (evxt) {
						var evt = evxt.getParent();
						return evt && evt.name == "sha" && evt.skill == "changbiao" && evt.getParent("phaseUse") == event;
					});
				},
				content() {
					let cards = [];
					player.getHistory("sourceDamage", function (evxt) {
						var evt = evxt.getParent();
						if (evt && evt.name == "sha" && evt.skill == "changbiao" && evt.getParent("phaseUse") == trigger) {
							cards.addArray(evt.cards);
						}
					});
					if (cards.length) {
						player.draw(cards.length);
					}
				},
			},
		},
		ai: {
			order(item, player) {
				return (
					get.order({ name: "sha" }, player) +
					0.3 *
						(Math.min(
							player.getCardUsable("sha"),
							player.countCards("hs", "sha") +
								player.hasCard(function (card) {
									return card.name != "sha" && get.value(card, player) < 6.3;
								}, "hs")
								? 1
								: 0
						) > 1
							? -1
							: 1)
				);
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					let num = 0;
					if (arg && (!arg.card || get.name(arg.card) !== "tao")) {
						return false;
					}
					player.getHistory("sourceDamage", function (evxt) {
						let evt = evxt.getParent();
						if (evt && evt.name == "sha" && evt.skill == "changbiao") {
							num += evt.cards.length;
						}
					});
					return player.needsToDiscard(num) > 0;
				}
			},
		},
	},
	//国钟会
	gzquanji: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		frequent: true,
		preHidden: true,
		filter(event, player, name) {
			if (player.getStorage("gzquanji_used").includes(name)) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			player.addTempSkill("gzquanji_used");
			player.markAuto("gzquanji_used", event.triggername);
			player.draw();
			"step 1";
			var hs = player.getCards("he");
			if (hs.length > 0) {
				if (hs.length == 1) {
					event._result = { bool: true, cards: hs };
				} else {
					player.chooseCard("he", true, "选择一张牌作为“权”");
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var cs = result.cards;
				player.addToExpansion(cs, player, "give").gaintag.add("gzquanji");
			}
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
		locked: false,
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("gzquanji").length;
			},
		},
		ai: {
			notemp: true,
		},
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	gzpaiyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getExpansions("gzquanji").length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("排异", player.getExpansions("gzquanji"), "hidden");
			},
			backup(links, player) {
				return {
					audio: "gzpaiyi",
					filterTarget: true,
					filterCard() {
						return false;
					},
					selectCard: -1,
					card: links[0],
					delay: false,
					content: lib.skill.gzpaiyi.contentx,
					ai: {
						order: 10,
						result: {
							target(player, target) {
								if (target != player) {
									return 0;
								}
								if (player.getExpansions("gzquanji").length <= 1 || (player.needsToDiscard() && !player.getEquip("zhuge") && !player.hasSkill("new_paoxiao"))) {
									return 0;
								}
								return 1;
							},
						},
					},
				};
			},
			prompt() {
				return "请选择【排异】的目标";
			},
		},
		contentx() {
			"step 0";
			var card = lib.skill.gzpaiyi_backup.card;
			player.loseToDiscardpile(card);
			"step 1";
			var num = player.getExpansions("gzquanji").length;
			if (num > 0) {
				target.draw(Math.min(7, num));
			}
			"step 2";
			if (target.countCards("h") > player.countCards("h")) {
				target.damage();
			}
		},
		ai: {
			order(item, player) {
				var num = player.getExpansions("gzquanji").length;
				if (num == 1) {
					return 8;
				}
				return 1;
			},
			result: {
				player: 1,
			},
			combo: "gzquanji",
		},
	},
	gzquanji2: { charlotte: true },
	xingongji: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		position: "he",
		filterCard: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		check(card) {
			var base = 0,
				player = _status.event.player,
				suit = get.suit(card, player),
				added = false,
				added2 = false,
				added3;
			if (
				get.type(card) == "equip" &&
				game.hasPlayer(function (target) {
					var att = get.attitude(player, target);
					if (att >= 0) {
						return 0;
					}
					if (
						target.countCards("he", function (card) {
							return get.value(card) > 5;
						})
					) {
						return -att;
					}
				})
			) {
				base += 6;
			}
			var hs = player.getCards("h");
			var muniu = player.getEquip("muniu");
			if (muniu && card != muniu && muniu.cards) {
				hs = hs.concat(muniu.cards);
			}
			for (var i of hs) {
				if (i != card && get.name(i) == "sha") {
					if (get.suit(i, player) == suit) {
						if (player.hasValueTarget(i, false)) {
							added3 = true;
							base += 5.5;
						}
					} else {
						if (player.hasValueTarget(i, false)) {
							added2 = true;
						}
						if (!added && !player.hasValueTarget(i, null, true) && player.hasValueTarget(i, false, true)) {
							base += 4;
							added = true;
						}
					}
				}
			}
			if (added3 && !added2) {
				base -= 4.5;
			}
			return base - get.value(card);
		},
		content() {
			"step 0";
			if (!player.storage.xingongji2) {
				player.storage.xingongji2 = [];
			}
			player.storage.xingongji2.add(get.suit(cards[0], player));
			player.addTempSkill("xingongji2");
			"step 1";
			if (get.type(cards[0], null, cards[0].original == "h" ? player : false) == "equip") {
				player
					.chooseTarget("是否弃置一名角色的一张牌？", function (card, player, target) {
						return player != target && target.countCards("he") > 0;
					})
					.set("ai", function (target) {
						var att = get.attitude(player, target);
						if (att >= 0) {
							return 0;
						}
						if (
							target.countCards("he", function (card) {
								return get.value(card) > 5;
							})
						) {
							return -att;
						}
						return -att * 0.8;
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.line(result.targets, "green");
				player.discardPlayerCard(result.targets[0], "he", true);
			}
		},
		ai: {
			order: 4.5,
			result: {
				player: 1,
			},
		},
	},
	xingongji2: {
		charlotte: true,
		onremove: true,
		mod: {
			attackRangeBase() {
				return Infinity;
			},
			cardUsable(card, player) {
				if (card.name == "sha") {
					const suit = get.suit(card);
					if (suit === "unsure" || player.storage.xingongji2.includes(suit)) {
						return Infinity;
					}
				}
			},
			aiOrder(player, card, num) {
				if (get.name(card) == "sha" && !player.storage.xingongji2.includes(get.suit(card))) {
					return num + 1;
				}
			},
		},
		mark: true,
		intro: {
			content: "使用$花色的杀无次数限制",
		},
	},
	xinjiefan: {
		skillAnimation: true,
		animationColor: "wood",
		audio: 2,
		limited: true,
		enable: "phaseUse",
		filterTarget: true,
		content() {
			"step 0";
			player.awakenSkill(event.name);
			event.players = game.filterPlayer(function (current) {
				return current != target && current.inRange(target);
			});
			event.players.sortBySeat();
			"step 1";
			if (event.players.length) {
				event.current = event.players.shift();
				event.current.addTempClass("target");
				player.line(event.current, "green");
				if (event.current.countCards("he") && target.isIn()) {
					event.current
						.chooseToDiscard({ subtype: "equip1" }, "he", "弃置一张武器牌或让" + get.translation(target) + "摸一张牌")
						.set("ai", function (card) {
							if (get.attitude(_status.event.player, _status.event.target) < 0) {
								return 7 - get.value(card);
							}
							return -1;
						})
						.set("target", target);
					event.tempbool = false;
				} else {
					event.tempbool = true;
				}
			} else {
				if (game.roundNumber <= 1) {
					player.addTempSkill("xinjiefan2");
				}
				event.finish();
			}
			"step 2";
			if (event.tempbool || result.bool == false) {
				target.draw();
			}
			event.goto(1);
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (player.hp > 2 && game.roundNumber > 1) {
						if (game.phaseNumber < game.players.length * 2) {
							return 0;
						}
					}
					var num = 0,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != target && players[i].inRange(target)) {
							num++;
						}
					}
					return num;
				},
			},
		},
	},
	xinjiefan2: {
		trigger: { player: "phaseEnd" },
		forced: true,
		popup: false,
		sourceSkill: "xinjiefan",
		content() {
			player.restoreSkill("xinjiefan");
		},
	},
	residi: {
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		audio: 2,
		filter(event, player) {
			return (
				player.countCards("he", function (card) {
					if (_status.connectMode) {
						return true;
					}
					return get.type(card) != "basic";
				}) > 0
			);
		},
		content() {
			"step 0";
			player
				.chooseCard("he", get.prompt("residi"), "将一张非基本牌置于武将牌上作为“司”", function (card, player) {
					return get.type(card) != "basic";
				})
				.set("ai", function (card) {
					if (get.position(card) == "e") {
						return 5 + player.hp - get.value(card);
					}
					return 7 - get.value(card);
				});
			"step 1";
			if (result.bool) {
				player.logSkill("residi");
				player.addToExpansion(result.cards, "give", player).gaintag.add("residi");
			}
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
		group: "residi_push",
		ai: {
			notemp: true,
		},
	},
	residi_push: {
		trigger: { global: "phaseUseBegin" },
		direct: true,
		sourceSkill: "residi",
		filter(event, player) {
			return event.player != player && player.getExpansions("residi").length > 0;
		},
		content() {
			"step 0";
			player.chooseButton([get.prompt("residi", trigger.player), player.getExpansions("residi")]).set("ai", function (button) {
				var player = _status.event.player;
				var target = _status.event.getTrigger().player;
				if (get.attitude(player, target) > -1) {
					return 0;
				}
				var card = button.link;
				var color = get.color(button.link, false);
				var eff = target.countCards("h", function (card) {
					return get.color(card, target) == color && target.hasValueTarget(card);
				});
				if (
					!target.countCards("h", function (card) {
						return get.color(card, target) == color && get.name(card, target) == "sha" && target.hasValueTarget(card);
					})
				) {
					eff += 1.5;
				}
				if (
					!target.countCards("h", function (card) {
						return get.color(card, target) == color && get.type2(card, target) == "trick" && target.hasValueTarget(card);
					})
				) {
					eff += 1.5;
				}
				return eff - 1;
			});
			"step 1";
			if (result.bool) {
				if (!trigger.residi) {
					trigger.residi = [];
				}
				trigger.residi.push(player);
				var card = result.links[0];
				var target = trigger.player;
				player.logSkill("residi", target);
				player.loseToDiscardpile(card);
				var color = get.color(card, false);
				if (!target.storage.residi2) {
					target.storage.residi2 = [];
				}
				target.storage.residi2.add(color);
				target.addTempSkill("residi2", "phaseUseAfter");
				target.markSkill("residi2");
				player.addTempSkill("residi3", "phaseUseAfter");
			}
		},
	},
	residi2: {
		onremove: true,
		mod: {
			cardEnabled(card, player) {
				if (player.getStorage("residi2").includes(get.color(card, player))) {
					return false;
				}
			},
			cardRespondable(card, player) {
				if (player.getStorage("residi2").includes(get.color(card, player))) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (player.getStorage("residi2").includes(get.color(card, player))) {
					return false;
				}
			},
		},
		intro: {
			content: "不能使用或打出$牌",
		},
		marktext: "敌",
	},
	residi3: {
		audio: "residi",
		trigger: { global: "phaseUseEnd" },
		forced: true,
		sourceSkill: "residi",
		filter(event, player) {
			if (!event.residi || !event.residi.includes(player)) {
				return false;
			}
			var sha = player.canUse("sha", event.player, false),
				trick = true;
			event.player.getHistory("useCard", function (evt) {
				if (evt.getParent("phaseUse") != event) {
					return false;
				}
				if (sha && evt.card.name == "sha") {
					sha = false;
				}
				if (trick && get.type2(evt.card, false) == "trick") {
					trick = false;
				}
			});
			return sha || trick;
		},
		content() {
			var sha = player.canUse("sha", trigger.player, false),
				trick = true;
			trigger.player.getHistory("useCard", function (evt) {
				if (evt.getParent("phaseUse") != trigger) {
					return false;
				}
				if (sha && evt.card.name == "sha") {
					sha = false;
				}
				if (trick && get.type2(evt.card, false) == "trick") {
					trick = false;
				}
			});
			if (sha) {
				player.useCard({ name: "sha", isCard: true }, trigger.player);
			}
			if (trick) {
				player.draw(2);
			}
		},
	},
	rehuaiyi: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
		},
		delay: false,
		filter(event, player) {
			return player.countCards("h");
		},
		async content(event, trigger, player) {
			await player.showHandcards();
			const hs = player.getCards("h"),
				color = get.color(hs[0], player);
			if (
				hs.length === 1 ||
				!hs.some((card, index) => {
					return index > 0 && get.color(card) !== color;
				})
			) {
				await player.draw();
				player.addTempSkill(event.name + "_rewrite", "phaseUseEnd");
			} else {
				const list = [],
					bannedList = [],
					indexs = Object.keys(lib.color);
				player.getCards("h").forEach(card => {
					const color = get.color(card, player);
					list.add(color);
					if (!lib.filter.cardDiscardable(card, player, "rehuaiyi")) {
						bannedList.add(color);
					}
				});
				list.removeArray(bannedList);
				list.sort((a, b) => indexs.indexOf(a) - indexs.indexOf(b));
				let result;
				if (!list.length) {
					return;
				} else if (list.length === 1) {
					result = { control: list[0] };
				} else {
					result = await player
						.chooseControl(list.map(i => `${i}2`))
						.set("ai", () => {
							const player = get.player();
							if (player.countCards("h", { color: "red" }) == 1 && player.countCards("h", { color: "black" }) > 1) {
								return 1;
							}
							return 0;
						})
						.set("prompt", "请选择弃置一种颜色的所有手牌")
						.forResult();
				}
				const control = result.control.slice(0, -1);
				const cards = player.getCards("h", { color: control }),
					num = cards.length;
				await player.discard(cards);
				const targets = await player
					.chooseTarget(`请选择至多${get.cnNumber(num)}名有牌的其他角色，获得这些角色的各一张牌。`, [1, num], (card, player, target) => {
						return target != player && target.countGainableCards(player, "he");
					})
					.set("ai", target => {
						return -get.attitude(get.player(), target) + 0.5;
					})
					.forResultTargets();
				if (!targets || !targets.length) {
					return;
				}
				player.line(targets, "green");
				for (const target of targets.sortBySeat()) {
					if (target.isIn() && target.countGainableCards(player, "he")) {
						await player.gainPlayerCard(target, "he", true);
					}
				}
				if (player.getHistory("gain", evt => evt.getParent(2) == event).reduce((sum, evt) => sum + evt.cards.length, 0) > 1) {
					await player.loseHp();
				}
			}
		},
		ai: {
			order(item, player) {
				if (player.countCards("h", { color: "red" }) == 0) {
					return 10;
				}
				if (player.countCards("h", { color: "black" }) == 0) {
					return 10;
				}
				return 1;
			},
			result: {
				player: 1,
			},
		},
		subSkill: { rewrite: { charlotte: true } },
	},
	rezhuikong: {
		audio: 2,
		audioname: ["ol_fuhuanghou"],
		audioname2: { tw_fuhuanghou: "xinzhuikong" },
		trigger: { global: "phaseZhunbeiBegin" },
		check(event, player) {
			if (get.attitude(player, event.player) < -2) {
				var cards = player.getCards("h");
				if (cards.length > player.hp) {
					return true;
				}
				for (var i = 0; i < cards.length; i++) {
					var useful = get.useful(cards[i]);
					if (useful < 5) {
						return true;
					}
					if (get.number(cards[i]) > 7 && useful < 7) {
						return true;
					}
				}
			}
			return false;
		},
		logTarget: "player",
		filter(event, player) {
			return player.hp < player.maxHp && player.canCompare(event.player);
		},
		async content(event, trigger, player) {
			const { player: target } = trigger;
			const { result } = await player.chooseToCompare(target).set("small", player.hp > 1 && get.effect(player, { name: "sha" }, target, player) > 0 && Math.random() < 0.9);
			if (result.bool) {
				target.addTempSkill("zishou2");
			} else {
				if (result.target && get.position(result.target) == "d") {
					await player.gain(result.target, "gain2", "log");
				}
				const card = { name: "sha", isCard: true };
				if (target.canUse(card, player, false)) {
					await target.useCard(card, player, false);
				}
			}
		},
	},
	reqiuyuan: {
		inherit: "qiuyuan",
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const { card } = trigger;
			const { result } = await target
				.chooseToGive(
					(card, player) => {
						const name = get.name(card, player);
						return name != "sha" && get.type(name) == "basic";
					},
					`交给${get.translation(player)}一张不为【杀】的基本牌，或成为${get.translation(card)}的额外目标且不可响应此牌`,
					player
				)
				.set("ai", card => {
					const { player, target } = get.event();
					return get.attitude(player, target) >= 0 ? 1 : -1;
				});
			if (!result?.bool) {
				trigger.getParent().targets.push(target);
				trigger.getParent().triggeredTargets2.push(target);
				trigger.directHit.push(target);
				game.log(target, "成为了", card, "的额外目标");
			}
		},
	},
	reenyuan: {
		audio: 2,
		group: ["reenyuan1", "reenyuan2"],
	},
	reenyuan1: {
		audio: "reenyuan",
		inherit: "xinenyuan1",
		sourceSkill: "reenyuan",
	},
	reenyuan2: {
		audio: "reenyuan",
		inherit: "xinenyuan2",
		sourceSkill: "reenyuan",
		prompt2: event => `令${get.translation(event.source)}选择一项：1.失去1点体力；2.交给你一张手牌，若此牌的花色不为♥，你摸一张牌。`,
		async content(event, trigger, player) {
			const result = await trigger.source
				.chooseToGive(`恩怨：交给${get.translation(player)}一张手牌，或失去1点体力`, "h", player)
				.set("ai", card => {
					const { player, target } = get.event();
					if (get.attitude(player, target) > 0) {
						if (get.suit(card) != "heart") {
							return 15 - get.value(card);
						}
						return 11 - get.value(card);
					} else {
						let num = 12 - player.hp * 2;
						if (get.suit(card) != "heart") {
							num -= 2;
						}
						return num - get.value(card);
					}
				})
				.forResult();
			if (!result?.bool || !result?.cards?.length) {
				await trigger.source.loseHp();
			} else if (result?.cards?.length && get.suit(result.cards[0]) !== "heart") {
				await player.draw();
			}
		},
	},
	rexuanhuo: {
		audio: 2,
		trigger: { player: "phaseDrawEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("h") > 1 && game.countPlayer() > 2;
		},
		content() {
			"step 0";
			var ai2 = function (target) {
				var player = _status.event.player;
				if (get.attitude(player, target) <= 0) {
					return 0;
				}
				var list = [null, "juedou"].concat(lib.inpile_nature);
				if (target.hasSkill("ayato_zenshen")) {
					list.push("kami");
				}
				var num = Math.max.apply(
					Math,
					list.map(function (i) {
						if (i == "juedou") {
							return target.getUseValue({ name: "juedou", isCard: true }, false);
						}
						var card = { name: "sha", nature: i, isCard: true };
						return target.getUseValue(card, false);
					})
				);
				if (target.hasSkillTag("nogain")) {
					num /= 4;
				}
				return num;
			};
			player.chooseCardTarget({
				prompt: get.prompt2("rexuanhuo"),
				filterCard: true,
				selectCard: 2,
				position: "h",
				filterTarget: lib.filter.notMe,
				goon: game.hasPlayer(function (current) {
					return current != player && ai2(player, current) > 0;
				}),
				ai1(card) {
					if (!_status.event.goon) {
						return 0;
					}
					return 7 - get.value(card);
				},
				ai2: ai2,
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("rexuanhuo", target);
				player.give(result.cards, target);
			} else {
				event.finish();
			}
			"step 2";
			if (
				game.hasPlayer(function (current) {
					return current != player && current != target;
				})
			) {
				player
					.chooseTarget(
						function (card, player, target) {
							return target != player && target != _status.event.target;
						},
						"选择" + get.translation(target) + "使用【杀】或【决斗】的目标",
						true
					)
					.set("target", target)
					.set("ai", function (target) {
						var evt = _status.event;
						var list = [null, "juedou"].concat(lib.inpile_nature);
						if (evt.target.hasSkill("ayato_zenshen")) {
							list.push("kami");
						}
						return Math.max.apply(
							Math,
							list.map(function (i) {
								var card = { name: "sha", isCard: true };
								if (i == "juedou") {
									card.name = "juedou";
								} else if (i) {
									card.nature = i;
								}
								if (!evt.target.canUse(card, target, false)) {
									return 0;
								}
								return get.effect(target, card, evt.target, evt.player);
							})
						);
					});
			} else {
				event.finish();
			}
			"step 3";
			var target2 = result.targets[0];
			event.target2 = target2;
			player.line(target2);
			game.log(player, "选择了", target2);
			var list = lib.inpile_nature.slice(0);
			list.unshift(null);
			var vcards = [];
			if (target.hasSkill("ayato_zenshen")) {
				list.add("kami");
			}
			for (var i of list) {
				if (target.canUse({ name: "sha", isCard: true, nature: i }, target2, false)) {
					vcards.push(["基本", "", "sha", i]);
				}
			}
			if (target.canUse({ name: "juedou", isCard: true }, target2, false)) {
				vcards.push(["基本", "", "juedou"]);
			}
			if (!vcards.length) {
				if (!target.countCards("h")) {
					event.finish();
				} else {
					event._result = { index: 1 };
				}
			} else if (!target.countCards("h")) {
				event.vcards = vcards;
				event._result = { index: 0 };
			} else {
				event.vcards = vcards;
				target.chooseControl().set("choiceList", ["视为对" + get.translation(target2) + "使用任意一种【杀】或【决斗】", "将所有手牌交给" + get.translation(player)]);
			}
			"step 4";
			if (result.index == 0) {
				if (event.vcards.length == 1) {
					event._result = { links: event.vcards, bool: true };
				} else {
					target.chooseButton(["请选择要对" + get.translation(event.target2) + "使用的牌", [event.vcards, "vcard"]], true).set("ai", function (button) {
						var player = _status.event.player;
						return get.effect(_status.event.getParent().target2, { name: button.link[2], isCard: true, nature: button.link[3] }, player, player);
					});
				}
			} else {
				target.give(target.getCards("h"), player, "giveAuto");
				event.finish();
			}
			"step 5";
			if (result.bool) {
				target.useCard({ name: result.links[0][2], isCard: true, nature: result.links[0][3] }, false, event.target2);
			}
		},
		ai: {
			expose: 0.17,
			fireAttack: true,
			skillTagFilter(player) {
				return player.hasFriend();
			},
		},
	},
	decadezongshi: {
		audio: 2,
		mod: {
			maxHandcard(player, num) {
				return num + game.countGroup();
			},
		},
		trigger: { target: "useCardToTargeted" },
		forced: true,
		filter(event, player) {
			return player != _status.currentPhase && player.countCards("h") >= player.getHandcardLimit() && (get.type(event.card) == "delay" || get.color(event.card) == "none");
		},
		content() {
			trigger.excluded.add(player);
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (target != _status.currentPhase && target.countCards("h") >= target.getHandcardLimit() && (get.type(card) == "delay" || get.color(card) == "none")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	decadezishou: {
		audio: 2,
		inherit: "rezishou",
		group: "decadezishou_zhiheng",
		ai: {
			threaten: 1.8,
		},
	},
	decadezishou_zhiheng: {
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		sourceSkill: "decadezishou",
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				!player.getHistory("useCard", function (evt) {
					return (
						evt.targets.filter(function (target) {
							return target != player;
						}).length > 0
					);
				}).length
			);
		},
		content() {
			"step 0";
			var list = [];
			var hs = player.getCards("h");
			for (var i of hs) {
				list.add(get.suit(i, player));
			}
			player
				.chooseToDiscard("h", get.prompt("decadezishou"), "弃置任意张花色不同的手牌并摸等量的牌", [1, list.length], function (card, player) {
					if (ui.selected.cards.length) {
						var suit = get.suit(card, player);
						for (var i of ui.selected.cards) {
							if (get.suit(i, player) == suit) {
								return false;
							}
						}
					}
					return true;
				})
				.set("ai", lib.skill.zhiheng.check)
				.set("complexCard", true).logSkill = "decadezishou";
			"step 1";
			if (result.bool) {
				player.draw(result.cards.length);
			}
		},
	},
	yongjin: {
		audio: 2,
		audioname: ["xin_lingtong"],
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		enable: "phaseUse",
		filter(event, player, cards) {
			return game.hasPlayer(function (current) {
				var es = current.getCards("e", function (card) {
					return !cards || !cards.includes(card);
				});
				for (var i = 0; i < es.length; i++) {
					if (
						game.hasPlayer(function (current2) {
							return current != current2 && !current2.isMin() && current2.canEquip(es[i]);
						})
					) {
						return true;
					}
				}
			});
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			event.count = 3;
			event.cards = [];
			"step 1";
			event.count--;
			if (!lib.skill.yongjin.filter(null, player, cards)) {
				event.finish();
				return;
			}
			var next = player.chooseTarget(2, function (card, player, target) {
				if (ui.selected.targets.length) {
					var from = ui.selected.targets[0];
					if (target.isMin()) {
						return false;
					}
					var es = from.getCards("e", function (card) {
						return !_status.event.cards.includes(card);
					});
					for (var i = 0; i < es.length; i++) {
						if (target.canEquip(es[i])) {
							return true;
						}
					}
					return false;
				} else {
					return (
						target.countCards("e", function (card) {
							return !_status.event.cards.includes(card);
						}) > 0
					);
				}
			});
			next.set("ai", function (target) {
				var player = _status.event.player;
				var att = get.attitude(player, target);
				var sgnatt = get.sgn(att);
				if (ui.selected.targets.length == 0) {
					if (target == player && player.hasSkill("decadexuanfeng")) {
						if (
							player.countCards("e", function (card) {
								return (
									!_status.event.cards.includes(card) &&
									game.hasPlayer(function (current) {
										return current != target && current.canEquip(card) && get.effect(current, card, player, player) < 0;
									})
								);
							}) > 0
						) {
							return 18;
						}
						return 7;
					} else if (att > 0) {
						if (
							target.countCards("e", function (card) {
								return (
									get.value(card, target) < 0 &&
									!_status.event.cards.includes(card) &&
									game.hasPlayer(function (current) {
										return current != target && current.canEquip(card) && get.effect(current, card, player, player) < 0;
									})
								);
							}) > 0
						) {
							return 9;
						}
					} else if (att < 0) {
						if (
							game.hasPlayer(function (current) {
								if (current != target && get.attitude(player, current) > 0) {
									var es = target.getCards("e", function (card) {
										return !_status.event.cards.includes(card);
									});
									for (var i = 0; i < es.length; i++) {
										if (get.value(es[i], target) > 0 && current.canEquip(card) && get.effect(current, es[i], player, current) > 0) {
											return true;
										}
									}
								}
							})
						) {
							return -att;
						}
					}
					return 0;
				}
				var es = ui.selected.targets[0].getCards("e", function (card) {
					return !_status.event.cards.includes(card);
				});
				var i;
				var att2 = get.sgn(get.attitude(player, ui.selected.targets[0]));
				for (i = 0; i < es.length; i++) {
					if (ui.selected.targets[0] == player && player.hasSkill("decadexuanfeng")) {
						var bool = game.hasPlayer(function (current) {
							return get.attitude(player, current) < 0 && current.countDiscardableCards(player, "he") > 0 && get.damageEffect(current, player, player) > 0;
						});
						if (
							bool &&
							player.countCards("e", function (card) {
								return !_status.event.cards.includes(card) && target.canEquip(card) && get.effect(target, card, player, player) > 0;
							})
						) {
							return 2.5 * Math.abs(att);
						} else if (bool) {
							return 1 / Math.max(1, Math.abs(att));
						} else {
							return get.damageEffect(target, player, player);
						}
					}
					if (sgnatt != 0 && att2 != 0 && sgnatt != att2 && get.sgn(get.value(es[i], ui.selected.targets[0])) == -att2 && get.sgn(get.effect(target, es[i], player, target)) == sgnatt && target.canEquip(es[i])) {
						return Math.abs(att);
					}
				}
				if (i == es.length) {
					return 0;
				}
				return -att * get.attitude(player, ui.selected.targets[0]);
			});
			next.set("multitarget", true);
			next.set("cards", cards);
			next.set("targetprompt", ["被移走", "移动目标"]);
			next.set("prompt", "移动场上的一张装备牌");
			"step 2";
			if (result.bool) {
				player.line2(result.targets, "green");
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 3";
			game.delay();
			"step 4";
			if (targets.length == 2) {
				player
					.choosePlayerCard(
						"e",
						true,
						function (button) {
							var player = _status.event.player;
							var targets0 = _status.event.targets0;
							var targets1 = _status.event.targets1;
							if (get.attitude(player, targets0) > 0 && get.attitude(player, targets1) < 0) {
								if (get.value(button.link, targets0) < 0 && get.effect(targets1, button.link, player, targets1) > 0) {
									return 10;
								}
								return 0;
							} else {
								return get.value(button.link) * get.effect(targets1, button.link, player, player);
							}
						},
						targets[0]
					)
					.set("nojudge", event.nojudge || false)
					.set("targets0", targets[0])
					.set("targets1", targets[1])
					.set("filterButton", function (button) {
						if (_status.event.cards.includes(button.link)) {
							return false;
						}
						var targets1 = _status.event.targets1;
						return targets1.canEquip(button.link);
					})
					.set("cards", cards);
			} else {
				event.finish();
			}
			"step 5";
			if (result.bool && result.links.length) {
				var link = result.links[0];
				cards.add(link);
				event.targets[1].equip(link);
				event.targets[0].$give(link, event.targets[1]);
				game.delay();
			} else {
				event.finish();
			}
			"step 6";
			if (event.count > 0) {
				event.goto(1);
			}
		},
		ai: {
			order: 7,
			result: {
				player(player) {
					var num = 0;
					var friends = game.filterPlayer(function (current) {
						return get.attitude(player, current) >= 4;
					});
					var vacancies = {
						equip1: 0,
						equip2: 0,
						equip3: 0,
						equip4: 0,
						equip5: 0,
					};
					for (var i = 0; i < friends.length; i++) {
						for (var j = 1; j <= 5; j++) {
							if (friends[i].hasEmptySlot(j)) {
								vacancies["equip" + j]++;
							}
						}
					}
					var sources = game.filterPlayer(function (current) {
						return ((current == player && current.hasSkill("decadexuanfeng")) || get.attitude(player, current) < 0) && current.countCards("e");
					});
					for (var i = 0; i < sources.length; i++) {
						var es = sources[i].getCards("e");
						for (var j = 0; j < es.length; j++) {
							var type = get.subtype(es[j]);
							if (sources[i] == player || (vacancies[type] > 0 && get.value(es[j]) > 0)) {
								num++;
								if (
									sources[i] == player &&
									vacancies[type] &&
									game.hasPlayer(function (current) {
										return get.attitude(player, current) < 0 && current.countDiscardableCards(player, "he") > 0 && get.damageEffect(current, player, player) > 0;
									})
								) {
									num += 0.5;
								}
								if (num >= 3) {
									return 1;
								}
								vacancies[type]--;
							}
						}
					}
					if (num && player.hp == 1) {
						return 0.5;
					}
					return 0;
				},
			},
		},
	},
	decadexuanfeng: {
		audio: "xuanfeng",
		audioname: ["boss_lvbu3", "re_heqi", "xin_lingtong"],
		mod: {
			aiOrder(player, card, num) {
				if (
					num <= 0 ||
					!player.isPhaseUsing() ||
					player.needsToDiscard() !== 2 ||
					!card.cards ||
					!card.cards.some(i => {
						return get.position(i) === "h";
					}) ||
					get.tag(card, "draw") ||
					get.tag(card, "gain")
				) {
					return;
				}
				if (get.type(card) == "equip" && player.hasCard(cardx => card != cardx && (!card.cards || !card.cards.includes(cardx)) && (player.hasSkill("yongjin") || get.subtype(card) == get.subtype(cardx)) && (get.position(cardx) == "e" || player.canUse(cardx, player)), "hes")) {
					return;
				}
				if (!game.hasPlayer(current => get.attitude(player, current) < 0 && current.countDiscardableCards(player, "he") > 0 && get.damageEffect(current, player, player) > 0)) {
					return;
				}
				return 0;
			},
		},
		trigger: {
			player: ["loseAfter", "phaseDiscardEnd"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (_status.dying.length) {
				return false;
			}
			if (event.name == "phaseDiscard") {
				var cards = [];
				player.getHistory("lose", function (evt) {
					if (evt && evt.type == "discard" && evt.getParent("phaseDiscard") == event && evt.hs) {
						cards.addArray(evt.hs);
					}
				});
				return cards.length > 1;
			} else {
				var evt = event.getl(player);
				return evt && evt.es && evt.es.length > 0;
			}
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2(event.skill),
					(card, player, target) => {
						if (player == target) {
							return false;
						}
						return target.countDiscardableCards(player, "he");
					},
					[1, 2]
				)
				.set("ai", target => {
					let player = get.event("player"),
						att = get.attitude(player, target),
						hs = target.countCards("h"),
						es = target.countCards("e");
					if ((hs && target.hasSkillTag("noh")) || (es && target.hasSkillTag("noe"))) {
						att *= 0.8;
					} else {
						att = -att;
					}
					if (ui.selected.targets.length) {
						let pre = ui.selected.targets[0],
							damage = get.event("damage");
						if (get.attitude(player, pre) < 0 && (damage ? get.damageEffect(pre, player, player) > 0 : true) && pre.countCards("he") >= 2) {
							return 0;
						}
						if (damage) {
							return att + get.damageEffect(target, player, player);
						}
					}
					return att;
				})
				.set("damage", player == _status.currentPhase)
				.set("complexTarget", true)
				.forResult();
		},
		locked: false,
		async content(event, trigger, player) {
			const targets = event.targets;
			for (const target of targets) {
				let num = targets.length > 1 ? 1 : 2;
				if (get.mode() !== "identity" || player.identity !== "nei") {
					player.addExpose(0.2);
				}
				for (let i = 0; i < num; i++) {
					if (!target.countDiscardableCards(player, "he")) {
						break;
					}
					if (i) {
						const bool = await player
							.chooseBool("是否继续发动〖旋风〗弃置" + get.translation(target) + "一张牌？")
							.set("ai", () => get.event("bool"))
							.set(
								"bool",
								(function () {
									let att = get.attitude(player, target) > 0,
										hs = target.getCards("h"),
										es = target.getCards("e");
									if (
										att &&
										es.some(i => {
											return get.value(i, target) < 0;
										})
									) {
										return true;
									}
									return (hs.length && att == target.hasSkillTag("noh")) || (es.length && att == target.hasSkillTag("noe"));
								})()
							)
							.forResultBool();
						if (!bool) {
							break;
						}
					}
					await player.discardPlayerCard(target, "he", true);
				}
			}
			if (player !== _status.currentPhase) {
				return;
			}
			const result = await player
				.chooseTarget("是否对一名目标角色造成1点伤害？", (card, player, target) => {
					return _status.event.targets.includes(target);
				})
				.set("targets", targets)
				.set("ai", target => {
					const player = get.event("player");
					return get.damageEffect(target, player, player);
				})
				.forResult();
			if (result.bool) {
				player.line(result.targets[0], "thunder");
				await result.targets[0].damage();
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
						return [1, 3];
					}
					if (get.tag(card, "damage") && target.hp > 2) {
						var num1 = target.countCards("h"),
							num2 = target.getHandcardLimit();
						if (num1 > num2) {
							return [1, 1];
						}
						if (num1 == num2) {
							return [1.1, _status.event.player == target ? 3 : 0.5];
						}
						if (num1 == num2 - 1) {
							return [0.1, _status.event.player == target ? 4.5 : 0.1];
						}
					}
					if (typeof card !== "object") {
						return;
					}
					if ((get.tag(card, "discard") || get.tag(card, "loseCard")) && target.countCards("h") > 0 && get.attitude(player, target) < 0) {
						return [1, -1];
					}
				},
			},
			reverseEquip: true,
			noe: true,
			threaten(player, target) {
				return target.countCards("e") + target.countCards("h") / 3;
			},
		},
	},
	oltuntian: {
		inherit: "tuntian",
		filter(event, player) {
			if (player == _status.currentPhase) {
				if (event.type != "discard") {
					return false;
				}
				var evt = event.getl(player);
				return (
					evt &&
					evt.cards2 &&
					evt.cards2.filter(function (i) {
						return get.name(i, evt.hs.includes(i) ? player : false) == "sha";
					}).length > 0
				);
			}
			if (event.name == "gain" && event.player == player) {
				return false;
			}
			var evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.length > 0;
		},
	},
	olzaoxian: {
		inherit: "zaoxian",
		content() {
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.addSkills("jixi");
			player.insertPhase();
		},
		ai: {
			combo: "oltuntian",
		},
	},
	rejunxing: {
		enable: "phaseUse",
		audio: 2,
		usable: 1,
		filterCard: true,
		selectCard: [1, Infinity],
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		check(card) {
			if (ui.selected.cards.length) {
				return -1;
			}
			return 6 - get.value(card);
		},
		filterTarget(card, player, target) {
			return player != target;
		},
		content() {
			"step 0";
			target.chooseToDiscard(cards.length, "弃置" + get.cnNumber(cards.length) + "张牌并失去1点体力，或点取消将武将牌翻面并摸" + get.cnNumber(cards.length) + "张牌", "he").set("ai", function (card) {
				if (cards.length > 3 || target.hasSkillTag("noturn") || target.isTurnedOver() || ((get.name(card) == "tao" || get.name(card) == "jiu") && lib.filter.cardSavable(card, target, target))) {
					return -1;
				}
				if (target.hp <= 1) {
					if (
						cards.length < target.getEnemies().length &&
						target.hasCard(cardx => {
							return (get.name(cardx) == "tao" || get.name(cardx) == "jiu") && lib.filter.cardSavable(cardx, target, target);
						}, "hs")
					) {
						return 7 - get.value(card);
					}
					return -1;
				}
				return 24 - 5 * cards.length - 2 * Math.min(4, target.hp) - get.value(card);
			});
			"step 1";
			if (!result.bool) {
				target.turnOver();
				target.draw(cards.length);
			} else {
				target.loseHp();
			}
		},
		ai: {
			order: 2,
			threaten: 1.8,
			result: {
				target(player, target) {
					if (target.hasSkillTag("noturn")) {
						return 0;
					}
					if (target.isTurnedOver()) {
						return 2;
					}
					return -1 / (target.countCards("h") + 1);
				},
			},
		},
	},
	rejuece: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return (
					current != player &&
					current.getHistory("lose", function (evt) {
						return evt.cards2 && evt.cards2.length > 0;
					}).length > 0
				);
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("rejuece"), "对一名本回合失去过牌的其他角色造成1点伤害", function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set(
					"targets",
					game.filterPlayer(function (current) {
						return (
							current != player &&
							current.getHistory("lose", function (evt) {
								return evt.cards2 && evt.cards2.length > 0;
							}).length > 0
						);
					})
				)
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("rejuece", target);
				target.damage();
			}
		},
	},
	remieji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"], color: "black" });
		},
		filterCard(card) {
			return get.color(card) == "black" && get.type(card, "trick") == "trick";
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		discard: false,
		delay: false,
		loseTo: "cardPile",
		insert: true,
		visible: true,
		check(card) {
			return 8 - get.value(card);
		},
		content() {
			"step 0";
			player.showCards(cards);
			"step 1";
			if (
				!target.countCards("he", function (card) {
					if (get.type2(card) == "trick") {
						return true;
					}
					return lib.filter.cardDiscardable(card, target, "remieji");
				})
			) {
				event.finish();
			} else {
				target
					.chooseCard("he", true, function (card, player) {
						if (get.type2(card) == "trick") {
							return true;
						}
						return lib.filter.cardDiscardable(card, player, "remieji");
					})
					.set("prompt", "选择交给" + get.translation(player) + "一张锦囊牌，或依次弃置两张非锦囊牌。");
			}
			"step 2";
			if (result.cards && result.cards.length) {
				if (get.type2(result.cards[0]) == "trick") {
					target.give(result.cards, player);
					event.finish();
				} else {
					target.discard(result.cards);
				}
			} else {
				event.finish();
			}
			"step 3";
			if (
				target.countCards("he", function (card) {
					return get.type2(card) != "trick";
				})
			) {
				target.chooseToDiscard("he", true, function (card) {
					return get.type2(card) != "trick";
				});
			}
		},
		ai: {
			order: 9,
			result: {
				target: -1,
			},
		},
	},
	decadelihuo: {
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name == "sha" && !game.hasNature(event.card)) {
				return true;
			}
			return false;
		},
		audio: "lihuo",
		prompt2(event) {
			return "将" + get.translation(event.card) + "改为火属性";
		},
		audioname: ["re_chengpu"],
		check(event, player) {
			return (
				event.baseDamage > 1 &&
				game.hasPlayer(function (current) {
					return !event.targets.includes(current) && player.canUse(event.card, current) && get.attitude(player, current) < 0 && !current.hasShan() && get.effect(current, { name: "sha", nature: "fire" }, player, player) > 0;
				})
			);
		},
		content() {
			game.setNature(trigger.card, "fire");
		},
		group: ["decadelihuo2", "decadelihuo3"],
		ai: {
			fireAttack: true,
		},
	},
	decadelihuo2: {
		trigger: { player: "useCard2" },
		sourceSkill: "decadelihuo",
		filter(event, player) {
			if (event.card.name != "sha" || !game.hasNature(event.card, "fire")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return !event.targets.includes(current) && player.canUse(event.card, current);
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("decadelihuo"), "为" + get.translation(trigger.card) + "增加一个目标", function (card, player, target) {
					return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
				})
				.set("sourcex", trigger.targets)
				.set("card", trigger.card)
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, _status.event.card, player, player);
				});
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !_status.connectMode) {
					game.delayx();
				}
				event.target = result.targets[0];
			} else {
				event.finish();
			}
			"step 2";
			player.logSkill("decadelihuo", event.target);
			trigger.targets.push(event.target);
		},
	},
	decadelihuo3: {
		trigger: { player: "useCardAfter" },
		sourceSkill: "decadelihuo",
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				game.hasNature(event.card, "fire") &&
				event.targets.length > 1 &&
				player.getHistory("sourceDamage", function (evt) {
					return evt.card == event.card;
				}).length > 0
			);
		},
		forced: true,
		audio: "lihuo",
		audioname: ["re_chengpu"],
		content() {
			player.loseHp();
		},
	},
	decadechunlao: {
		audio: "chunlao",
		audioname: ["re_chengpu"],
		enable: "chooseToUse",
		viewAs: { name: "jiu", isCard: true },
		viewAsFilter(player) {
			return !player.isLinked();
		},
		filter(event, player) {
			return !player.isLinked();
		},
		filterCard: () => false,
		selectCard: -1,
		log: false,
		precontent() {
			player.logSkill("decadechunlao");
			player.link();
		},
		group: ["decadechunlao2", "decadechunlaox"],
		ai: { jiuOther: true },
	},
	decadechunlaox: {
		trigger: { player: "damageBegin2" },
		silent: true,
		lastDo: true,
		sourceSkill: "decadechunlao",
		filter(event, player) {
			return !player.isLinked();
		},
		content() {
			trigger.decadechunlaox = true;
		},
	},
	decadechunlao2: {
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		prompt: "是否发动【醇醪】将武将牌重置？",
		sourceSkill: "decadechunlao",
		filter(event, player) {
			return player.isLinked() && event.num > 1 && !event.decadechunlaox;
		},
		content() {
			player.link();
		},
	},
	oltianxiang: {
		audio: "tianxiang",
		audioname: ["daxiaoqiao", "re_xiaoqiao", "ol_xiaoqiao"],
		trigger: { player: "damageBegin4" },
		direct: true,
		filter(event, player) {
			return (
				player.countCards("he", function (card) {
					if (_status.connectMode && get.position(card) == "h") {
						return true;
					}
					return get.suit(card, player) == "heart";
				}) > 0 && event.num > 0
			);
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				filterCard(card, player) {
					return get.suit(card) == "heart" && lib.filter.cardDiscardable(card, player);
				},
				filterTarget(card, player, target) {
					return player != target;
				},
				position: "he",
				ai1(card) {
					return 10 - get.value(card);
				},
				ai2(target) {
					var att = get.attitude(_status.event.player, target);
					var trigger = _status.event.getTrigger();
					var da = 0;
					if (_status.event.player.hp == 1) {
						da = 10;
					}
					var eff = get.damageEffect(target, trigger.source, target);
					if (att == 0) {
						return 0.1 + da;
					}
					if (eff >= 0 && att > 0) {
						return att + da;
					}
					if (att > 0 && target.hp > 1) {
						if (target.maxHp - target.hp >= 3) {
							return att * 1.1 + da;
						}
						if (target.maxHp - target.hp >= 2) {
							return att * 0.9 + da;
						}
					}
					return -att + da;
				},
				prompt: get.prompt("oltianxiang"),
				prompt2: lib.translate.oltianxiang_info,
			});
			"step 1";
			if (result.bool) {
				player.discard(result.cards);
				var target = result.targets[0];
				player
					.chooseControlList(
						true,
						function (event, player) {
							var target = _status.event.target;
							var att = get.attitude(player, target);
							if (target.hasSkillTag("maihp")) {
								att = -att;
							}
							if (att > 0) {
								return 0;
							} else {
								return 1;
							}
						},
						["令" + get.translation(target) + "受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）", "令" + get.translation(target) + "失去1点体力，然后获得" + get.translation(result.cards)]
					)
					.set("target", target);
				player.logSkill(event.name, target);
				trigger.cancel();
				event.target = target;
				event.card = result.cards[0];
			} else {
				event.finish();
			}
			"step 2";
			if (typeof result.index == "number") {
				event.index = result.index;
				if (result.index) {
					event.related = event.target.loseHp();
				} else {
					event.related = event.target.damage(trigger.source || "nosource", "nocard");
				}
			} else {
				event.finish();
			}
			"step 3";
			if (event.related.cancelled || target.isDead()) {
				return;
			}
			if (event.index && card.isInPile()) {
				target.gain(card, "gain2");
			} else if (target.getDamagedHp()) {
				target.draw(Math.min(5, target.getDamagedHp()));
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (get.tag(card, "damage") && target.countCards("he") > 1) {
						return 0.7;
					}
				},
			},
		},
	},
	olhongyan: {
		audio: "rehongyan",
		mod: {
			suit(card, suit) {
				if (suit == "spade") {
					return "heart";
				}
			},
			maxHandcardBase(player, num) {
				if (
					player.countCards("e", function (card) {
						return get.suit(card, player) == "heart";
					})
				) {
					return player.maxHp;
				}
			},
		},
	},
	piaoling: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		content() {
			"step 0";
			player.judge(function (card) {
				return get.suit(card) == "heart" ? 2 : 0;
			}).judge2 = function (result) {
				return result.bool ? true : false;
			};
			"step 1";
			event.card = result.card;
			if (result.bool && get.position(event.card, true) == "d") {
				player.chooseTarget("令一名角色获得" + get.translation(event.card) + "，或点【取消】将其置于牌堆顶").set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (player == target) {
						att /= 2;
					}
					return att;
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.targets && result.targets.length) {
				var target = result.targets[0];
				player.line(target, "green");
				target.gain(card, "gain2", "log");
				if (player == target) {
					player.chooseToDiscard("he", true);
				}
			} else {
				card.fix();
				ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
				game.updateRoundNumber();
			}
		},
	},
	xinyicong: {
		audio: "yicong",
		mod: {
			globalFrom(from, to, current) {
				return current - Math.max(0, from.hp - 1);
			},
			globalTo(from, to, current) {
				return current + Math.max(0, to.getDamagedHp() - 1);
			},
		},
		ai: {
			threaten: 0.8,
		},
	},
	rezongshi: {
		audio: 2,
		mod: {
			maxHandcard(player, num) {
				return num + game.countGroup();
			},
		},
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.countCards("h") > player.hp;
		},
		content() {
			player.addTempSkill("rezongshi_paoxiao");
		},
	},
	rezongshi_paoxiao: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return Infinity;
				}
			},
		},
	},
	olbaonue: {
		audio: 2,
		zhuSkill: true,
		trigger: { global: "damageSource" },
		filter(event, player) {
			if (player == event.source || !event.source || event.source.group != "qun") {
				return false;
			}
			return player.hasZhuSkill("olbaonue", event.source);
		},
		getIndex: event => event.num,
		logTarget: "source",
		async content(event, trigger, player) {
			const next = player.judge(card => {
				if (get.suit(card) == "spade") {
					return 4;
				}
				return 0;
			});
			next.set("callback", async event => {
				if (event.judgeResult.suit == "spade") {
					await player.recover();
					if (get.position(event.judgeResult.card, true) == "o") {
						await player.gain(event.judgeResult.card, "gain2", "log");
					}
				}
			});
			next.judge2 = result => result.bool;
			await next;
		},
	},
	rezishou: {
		audio: "zishou",
		audioname: ["re_liubiao"],
		trigger: { player: "phaseDrawBegin2" },
		check(event, player) {
			return (
				player.countCards("h") <= (player.hasSkill("zongshi") ? player.maxHp : player.hp - 2) ||
				player.skipList.includes("phaseUse") ||
				!player.countCards("h", function (card) {
					return get.tag(card, "damage") && player.hasUseTarget(card);
				})
			);
		},
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			trigger.num += game.countGroup();
			player.addTempSkill("rezishou2");
		},
		ai: {
			threaten: 1.5,
		},
	},
	rezishou2: {
		audio: "rezishou",
		trigger: {
			source: "damageBegin2",
			//player:'phaseJieshuBegin',
		},
		forced: true,
		sourceSkill: "rezishou",
		filter(event, player) {
			if (event.name == "damage") {
				return event.player != player;
			}
			if (player.getHistory("skipped").includes("phaseUse")) {
				return false;
			}
			return (
				player.getHistory("useCard", function (evt) {
					if (evt.targets && evt.targets.length && evt.isPhaseUsing()) {
						var targets = evt.targets.slice(0);
						while (targets.includes(player)) {
							targets.remove(player);
						}
						return targets.length > 0;
					}
					return false;
				}).length == 0
			);
		},
		popup: false,
		content() {
			"step 0";
			if (trigger.name == "damage") {
				player.logSkill("rezishou", trigger.player);
				trigger.cancel();
				event.finish();
				return;
			} else {
				var filterTarget = function (card, player, target) {
					return (
						target != player &&
						target.countCards("e", function (card) {
							return player.canEquip(card);
						})
					);
				};
				if (
					game.hasPlayer(function (current) {
						return filterTarget(null, player, current);
					})
				) {
					player.chooseTarget(filterTarget, "是否将一名其他角色装备区内的一张牌移动到自己的装备区？").set("ai", function (target) {
						var player = _status.event.player;
						var att = get.attitude(player, target);
						if (att > 0 && !target.hasSkillTag("noe")) {
							return 0;
						}
						var num = 0;
						target.countCards("e", function (card) {
							if (player.canEquip(card)) {
								var eff = get.effect(player, card, player, player);
								if (eff > num) {
									num = eff;
								}
							}
						});
						if (num <= 0) {
							return 0;
						}
						if (att < 0) {
							return num * -att;
						}
						return 1 / num;
					});
				} else {
					event.finish();
				}
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("rezishou", target);
				player.choosePlayerCard(target, "e", "将一张装备牌移至你的装备区").set("filterButton", function (button) {
					return _status.event.player.canEquip(button.link);
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result && result.links && result.links.length) {
				game.delay(2);
				target.$give(result.links[0], player, false);
				player.equip(result.links[0]);
				player.addExpose(0.2);
			}
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (get.tag(card, "damage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	decadepojun: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		direct: true,
		filter(event, player) {
			return event.card.name == "sha" && event.target.hp > 0 && event.target.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.choosePlayerCard(trigger.target, "he", [1, Math.min(trigger.target.hp, trigger.target.countCards("he"))], get.prompt("decadepojun", trigger.target));
			next.set("ai", function (button) {
				if (!_status.event.goon) {
					return 0;
				}
				var val = get.value(button.link);
				if (button.link == _status.event.target.getEquip(2)) {
					return 2 * (val + 3);
				}
				return val;
			});
			next.set("goon", get.attitude(player, trigger.target) <= 0);
			next.set("forceAuto", true);
			"step 1";
			if (result.bool) {
				event.cards = result.cards;
				var target = trigger.target;
				player.logSkill("decadepojun", trigger.target);
				target.addSkill("decadepojun2");
				target.addToExpansion(result.cards, "giveAuto", target).gaintag.add("decadepojun2");
			} else {
				event.finish();
			}
			"step 2";
			var discard = false,
				draw = false;
			for (var i of cards) {
				var type = get.type2(i);
				if (type == "equip") {
					discard = true;
				}
				if (type == "trick") {
					draw = true;
				}
			}
			if (discard) {
				event.equip = true;
				player
					.chooseButton(
						[
							"选择一张牌置入弃牌堆",
							cards.filter(function (card) {
								return get.type(card) == "equip";
							}),
						],
						true
					)
					.set("ai", function (button) {
						return get.value(button.link, _status.event.getTrigger().target);
					});
			}
			if (draw) {
				event.draw = true;
			}
			"step 3";
			if (event.equip && result.links && result.links.length) {
				trigger.target.loseToDiscardpile(result.links);
			}
			if (event.draw) {
				player.draw();
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (get.attitude(player, arg.target) > 0) {
					return false;
				}
				if (tag == "directHit_ai") {
					return arg.target.hp >= Math.max(1, arg.target.countCards("h") - 1);
				}
				if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
					return true;
				}
				return false;
			},
		},
	},
	decadepojun2: {
		trigger: { global: "phaseEnd" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "decadepojun",
		filter(event, player) {
			return player.getExpansions("decadepojun2").length > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("decadepojun2");
			player.gain(cards, "draw");
			game.log(player, "收回了" + get.cnNumber(cards.length) + "张“破军”牌");
			"step 1";
			player.removeSkill("decadepojun2");
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("decadepojun2");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
	},
	hanzhan: {
		audio: 2,
		trigger: {
			global: "chooseToCompareBegin",
		},
		filter(event, player) {
			if (player == event.player) {
				return true;
			}
			if (event.targets) {
				return event.targets.includes(player);
			}
			return player == event.target;
		},
		logTarget(event, player) {
			if (player != event.player) {
				return event.player;
			}
			return event.targets || event.target;
		},
		prompt2(event, player) {
			return "令其改为使用随机的手牌进行拼点";
		},
		check(trigger, player) {
			var num = 0;
			var targets = player == trigger.player ? (trigger.targets ? trigger.targets.slice(0) : [trigger.target]) : [trigger.player];
			while (targets.length) {
				var target = targets.shift();
				if (target.getCards("h").length > 1) {
					num -= get.attitude(player, target);
				}
			}
			return num > 0;
		},
		content() {
			var targets = player == trigger.player ? (trigger.targets ? trigger.targets.slice(0) : [trigger.target]) : [trigger.player];
			if (!trigger.fixedResult) {
				trigger.fixedResult = {};
			}
			while (targets.length) {
				var target = targets.shift();
				var hs = target.getCards("h");
				if (hs.length) {
					trigger.fixedResult[target.playerid] = hs.randomGet();
				}
			}
		},
		group: "hanzhan_gain",
		subfrequent: ["gain"],
	},
	hanzhan_gain: {
		trigger: {
			global: "chooseToCompareAfter",
		},
		audio: "hanzhan",
		sourceSkill: "hanzhan",
		filter(event, player) {
			if (event.preserve) {
				return false;
			}
			if (player != event.player && player != event.target && (!event.targets || !event.targets.includes(player))) {
				return false;
			}
			for (var i of event.lose_list) {
				if (Array.isArray(i[1])) {
					for (var j of i[1]) {
						if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
							return true;
						}
					}
				} else {
					var j = i[1];
					if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
						return true;
					}
				}
			}
			return false;
		},
		frequent: true,
		prompt2(event, player) {
			var cards = [],
				max = 0;
			for (var i of event.lose_list) {
				if (Array.isArray(i[1])) {
					for (var j of i[1]) {
						if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
							var num = get.number(j, i[0]);
							if (num > max) {
								cards = [];
								max = num;
							}
							if (num == max) {
								cards.push(j);
							}
						}
					}
				} else {
					var j = i[1];
					if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
						var num = get.number(j, i[0]);
						if (num > max) {
							cards = [];
							max = num;
						}
						if (num == max) {
							cards.push(j);
						}
					}
				}
			}
			return "获得" + get.translation(cards);
		},
		content() {
			var cards = [],
				max = 0;
			for (var i of trigger.lose_list) {
				if (Array.isArray(i[1])) {
					for (var j of i[1]) {
						if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
							var num = get.number(j, i[0]);
							if (num > max) {
								cards = [];
								max = num;
							}
							if (num == max) {
								cards.push(j);
							}
						}
					}
				} else {
					var j = i[1];
					if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
						var num = get.number(j, i[0]);
						if (num > max) {
							cards = [];
							max = num;
						}
						if (num == max) {
							cards.push(j);
						}
					}
				}
			}
			player.gain(cards, "gain2");
		},
	},
	rejianchu: {
		audio: 2,
		audioname: ["re_pangde"],
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.target.countDiscardableCards(player, "he") > 0;
		},
		direct: true,
		content() {
			"step 0";
			player
				.discardPlayerCard(trigger.target, get.prompt("rejianchu", trigger.target))
				.set("ai", function (button) {
					if (!_status.event.att) {
						return 0;
					}
					if (get.position(button.link) == "e") {
						if (get.subtype(button.link) == "equip2") {
							return 5 * get.value(button.link);
						}
						return get.value(button.link);
					}
					return 1;
				})
				.set("logSkill", ["rejianchu", trigger.target])
				.set("att", get.attitude(player, trigger.target) <= 0);
			"step 1";
			if (result.bool && result.links && result.links.length) {
				if (get.type(result.links[0], null, result.links[0].original == "h" ? player : false) != "basic") {
					trigger.getParent().directHit.add(trigger.target);
					player.addTempSkill("rejianchu2");
					player.addMark("rejianchu2", 1, false);
				} else if (trigger.cards) {
					var list = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i], true) == "o") {
							list.push(trigger.cards[i]);
						}
					}
					if (list.length) {
						trigger.target.gain(list, "gain2", "log");
					}
				}
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag == "directHit_ai") {
					return (
						arg.card.name == "sha" &&
						arg.target.countCards("e", function (card) {
							return get.value(card) > 1;
						}) > 0
					);
				}
				if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
					return true;
				}
				return false;
			},
		},
	},
	rejianchu2: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + player.countMark("rejianchu2");
				}
			},
		},
		onremove: true,
	},
	wulie: {
		trigger: { player: "phaseJieshuBegin" },
		audio: 2,
		direct: true,
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		filter(event, player) {
			return player.hp > 0;
		},
		content() {
			"step 0";
			player.chooseTarget([1, player.hp], get.prompt2("wulie"), lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player;
				if (player.hasUnknown()) {
					return 0;
				}
				if (player.hp - ui.selected.targets.length > 1 + player.countCards("hs", card => player.canSaveCard(card, player))) {
					return get.attitude(player, target);
				}
				return 0;
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.logSkill("wulie", targets);
				player.awakenSkill(event.name);
				player.loseHp(targets.length);
				while (targets.length) {
					targets[0].addSkill("wulie2");
					targets.shift().addMark("wulie2");
				}
			}
		},
	},
	wulie2: {
		marktext: "烈",
		intro: { name2: "烈", content: "mark" },
		trigger: { player: "damageBegin3" },
		forced: true,
		sourceSkill: "wulie",
		content() {
			trigger.cancel();
			player.removeMark("wulie2", 1);
			if (!player.storage.wulie2) {
				player.removeSkill("wulie2");
			}
		},
	},
	regongji: {
		mod: {
			attackRangeBase(player) {
				if (player.getEquips(3).length > 0 || player.getEquips(4).length > 0) {
					return Infinity;
				}
			},
		},
		locked: false,
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filter(event, player) {
			return player.hasCard(function (card) {
				return lib.skill.regongji.filterCard(card);
			}, "eh");
		},
		filterCard(card, player) {
			return get.type(card) != "basic";
		},
		filterTarget(card, player, target) {
			return target != player && target.countDiscardableCards(player, "he") > 0;
		},
		check(card) {
			return 4.5 - get.value(card);
		},
		content() {
			if (target.countDiscardableCards(player, "he") > 0) {
				player.discardPlayerCard(target, "he", true);
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					var att = get.attitude(player, target);
					var nh = target.countCards("h");
					if (att > 0) {
						if (target.getEquip("baiyin") && target.isDamaged() && get.recoverEffect(target, player, player) > 0) {
							if (target.hp == 1 && !target.hujia) {
								return 1.6;
							}
							if (target.hp == 2) {
								return 0.01;
							}
							return 0;
						}
					}
					var es = target.getCards("e");
					var noe = es.length == 0 || target.hasSkillTag("noe");
					var noe2 = es.length == 1 && es[0].name != "tengjia" && get.value(es[0]) <= 0;
					var noh = nh == 0 || target.hasSkillTag("noh");
					if (noh && (noe || noe2)) {
						return 0;
					}
					if (att <= 0 && !target.countCards("he")) {
						return 1.5;
					}
					return -1.5;
				},
			},
			tag: {
				loseCard: 1,
				discard: 1,
			},
		},
	},
	ollongdan: {
		mod: {
			aiValue(player, card, num) {
				if (card.name != "sha" && card.name != "shan") {
					return;
				}
				var geti = function () {
					var cards = player.getCards("hs", function (card) {
						return card.name == "sha" || card.name == "shan";
					});
					if (cards.includes(card)) {
						return cards.indexOf(card);
					}
					return cards.length;
				};
				return Math.max(num, [7, 5, 5, 3][Math.min(geti(), 3)]);
			},
			aiUseful() {
				return lib.skill.ollongdan.mod.aiValue.apply(this, arguments);
			},
		},
		locked: false,
		audio: "longdan_sha",
		audioname: ["re_zhaoyun", "huan_zhaoyun", "sp_zhaoyun"],
		audioname2: { tongyuan: "longdan_tongyuan" },
		hiddenCard(player, name) {
			if (name == "tao") {
				return player.countCards("hs", "jiu") > 0;
			}
			if (name == "jiu") {
				return player.countCards("hs", "tao") > 0;
			}
			return false;
		},
		enable: ["chooseToUse", "chooseToRespond"],
		position: "hs",
		prompt: "将杀当做闪，或将闪当做杀，或将桃当做酒，或将酒当做桃使用或打出",
		viewAs(cards, player) {
			if (cards.length) {
				var name = false;
				switch (get.name(cards[0], player)) {
					case "sha":
						name = "shan";
						break;
					case "shan":
						name = "sha";
						break;
					case "tao":
						name = "jiu";
						break;
					case "jiu":
						name = "tao";
						break;
				}
				if (name) {
					return { name: name };
				}
			}
			return null;
		},
		check(card) {
			var player = _status.event.player;
			if (_status.event.type == "phase") {
				var max = 0;
				var name2;
				var list = ["sha", "tao", "jiu"];
				var map = { sha: "shan", tao: "jiu", jiu: "tao" };
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (player.countCards("hs", map[name]) > (name == "jiu" ? 1 : 0) && player.getUseValue({ name: name }) > 0) {
						var temp = get.order({ name: name });
						if (temp > max) {
							max = temp;
							name2 = map[name];
						}
					}
				}
				if (name2 == get.name(card, player)) {
					return 1;
				}
				return 0;
			}
			return 1;
		},
		filterCard(card, player, event) {
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.name(card, player);
			if (name == "sha" && filter({ name: "shan", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "shan" && filter({ name: "sha", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "tao" && filter({ name: "jiu", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "jiu" && filter({ name: "tao", cards: [card] }, player, event)) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			var filter = event.filterCard;
			if (filter(get.autoViewAs({ name: "sha" }, "unsure"), player, event) && player.countCards("hs", "shan")) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hs", "sha")) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hs", "jiu")) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "jiu" }, "unsure"), player, event) && player.countCards("hs", "tao")) {
				return true;
			}
			return false;
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var name;
				switch (tag) {
					case "respondSha":
						name = "shan";
						break;
					case "respondShan":
						name = "sha";
						break;
				}
				if (!player.countCards("hs", name)) {
					return false;
				}
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao", "jiu"];
					var map = { sha: "shan", tao: "jiu", jiu: "tao" };
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (player.countCards("hs", map[name]) > (name == "jiu" ? 1 : 0) && player.getUseValue({ name: name }) > 0) {
							var temp = get.order({ name: name });
							if (temp > max) {
								max = temp;
							}
						}
					}
					if (max > 0) {
						max += 0.3;
					}
					return max;
				}
				return 4;
			},
		},
	},
	olyajiao: {
		audio: "reyajiao",
		trigger: { player: "loseAfter" },
		frequent: true,
		filter(event, player) {
			return player != _status.currentPhase && event.hs && event.hs.length > 0 && ["useCard", "respond"].includes(event.getParent().name);
		},
		content() {
			"step 0";
			event.card = get.cards()[0];
			game.cardsGotoOrdering(event.card);
			event.videoId = lib.status.videoId++;
			var judgestr = get.translation(player) + "发动了【涯角】";
			game.addVideo("judge1", player, [get.cardInfo(event.card), judgestr, event.videoId]);
			game.broadcastAll(
				function (player, card, str, id, cardid) {
					var event;
					if (game.online) {
						event = {};
					} else {
						event = _status.event;
					}
					if (game.chess) {
						event.node = card.copy("thrown", "center", ui.arena).addTempClass("start");
					} else {
						event.node = player.$throwordered(card.copy(), true);
					}
					if (lib.cardOL) {
						lib.cardOL[cardid] = event.node;
					}
					event.node.cardid = cardid;
					event.node.classList.add("thrownhighlight");
					ui.arena.classList.add("thrownhighlight");
					event.dialog = ui.create.dialog(str);
					event.dialog.classList.add("center");
					event.dialog.videoId = id;
				},
				player,
				event.card,
				judgestr,
				event.videoId,
				get.id()
			);

			game.log(player, "展示了", event.card);
			game.delay(2);
			if (get.type(event.card, "trick") == get.type(trigger.getParent().card, "trick")) {
				player
					.chooseTarget("选择获得此牌的角色")
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (_status.event.du) {
							if (target.hasSkillTag("nodu")) {
								return 0;
							}
							return -att;
						}
						if (att > 0) {
							return att + Math.max(0, 5 - target.countCards("h"));
						}
						return att;
					})
					.set("du", event.card.name == "du");
			} else {
				event.disbool = true;
				player
					.chooseTarget("是否弃置攻击范围内包含你的一名角色区域内的一张牌？", function (card, player, target) {
						return target.inRange(player) && target.countDiscardableCards(player, "hej") > 0;
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, { name: "guohe" }, player, player);
					});
			}
			"step 1";
			if (event.disbool) {
				if (result.bool) {
					player.line(result.targets[0], "green");
					player.discardPlayerCard(result.targets[0], "hej", true);
				}
				event.dialog.close();
				game.addVideo("judge2", null, event.videoId);
				game.addVideo("deletenode", player, [get.cardInfo(event.node)]);
				event.node.delete();
				game.broadcast(
					function (id, card) {
						var dialog = get.idDialog(id);
						if (dialog) {
							dialog.close();
						}
						if (card.clone) {
							card.clone.delete();
						}
						ui.arena.classList.remove("thrownhighlight");
					},
					event.videoId,
					event.card
				);
				ui.arena.classList.remove("thrownhighlight");
			} else if (result.targets) {
				event.dialog.close();
				game.addVideo("judge2", null, event.videoId);
				player.line(result.targets, "green");
				result.targets[0].gain(event.card, "log");
				event.node.moveDelete(result.targets[0]);
				game.addVideo("gain2", result.targets[0], [get.cardInfo(event.node)]);
				ui.arena.classList.remove("thrownhighlight");
				game.broadcast(
					function (card, target, id) {
						var dialog = get.idDialog(id);
						if (dialog) {
							dialog.close();
						}
						ui.arena.classList.remove("thrownhighlight");
						if (card.clone) {
							card.clone.moveDelete(target);
						}
					},
					event.card,
					result.targets[0],
					event.videoId
				);
			} else {
				game.addVideo("deletenode", player, [get.cardInfo(event.node)]);
				event.node.delete();
				game.broadcast(
					function (id) {
						var dialog = get.idDialog(id);
						if (dialog) {
							dialog.close();
						}
						if (card.clone) {
							card.clone.delete();
						}
						ui.arena.classList.remove("thrownhighlight");
					},
					event.videoId,
					event.card
				);
				event.dialog.close();
				game.addVideo("judge2", null, event.videoId);
				ui.arena.classList.remove("thrownhighlight");
			}
			"step 2";
			let cards = [event.card].filterInD();
			if (cards.length) {
				game.cardsGotoPile(cards, "insert");
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "respond") && target.countCards("h") > 1) {
						return [1, 0.2];
					}
				},
			},
		},
	},
	olpaoxiao: {
		audio: "paoxiao",
		audioname: ["re_zhangfei", "xiahouba", "re_guanzhang"],
		audioname2: { guanzhang: "paoxiao_guanzhang" },
		trigger: { player: "shaMiss" },
		forced: true,
		content() {
			player.addTempSkill("olpaoxiao2");
			player.addMark("olpaoxiao2", 1, false);
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return Infinity;
				}
			},
		},
	},
	olpaoxiao2: {
		trigger: { source: "damageBegin1" },
		forced: true,
		audio: "paoxiao",
		audioname: ["re_zhangfei", "xiahouba", "re_guanzhang"],
		audioname2: { guanzhang: "paoxiao_guanzhang" },
		sourceSkill: "olpaoxiao",
		filter(event, player) {
			return event.card && event.card.name == "sha" && player.countMark("olpaoxiao2") > 0;
		},
		onremove: true,
		content() {
			trigger.num += player.countMark("olpaoxiao2");
			player.removeSkill("olpaoxiao2");
		},
		intro: { content: "本回合内下一次使用【杀】造成伤害时令伤害值+#" },
	},
	oltishen: {
		audio: "retishen",
		skillAnimation: true,
		animationColor: "soil",
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.isDamaged();
		},
		check(event, player) {
			if (player.hp <= 2 || player.getDamagedHp() > 2) {
				return true;
			}
			if (player.getDamagedHp() <= 1) {
				return false;
			}
			return player.getDamagedHp() < game.roundNumber;
		},
		content() {
			player.awakenSkill(event.name);
			player.recover(player.maxHp - player.hp);
			player.draw(player.maxHp - player.hp);
		},
	},
	rexuanfeng: {
		audio: "xuanfeng",
		audioname: ["boss_lvbu3", "re_lingtong"],
		audioname2: { re_heqi: "fenwei_heqi" },
		trigger: {
			player: ["loseAfter", "phaseDiscardEnd"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		direct: true,
		filter(event, player) {
			if (
				!game.hasPlayer(function (current) {
					return current != player && current.countCards("he") > 0;
				})
			) {
				return false;
			}
			if (event.name == "phaseDiscard") {
				var cards = [];
				player.getHistory("lose", function (evt) {
					if (evt && evt.type == "discard" && evt.getParent("phaseDiscard") == event && evt.hs) {
						cards.addArray(evt.hs);
					}
				});
				return cards.length > 1;
			}
			var evt = event.getl(player);
			return evt && evt.es && evt.es.length > 0;
		},
		content() {
			"step 0";
			var list = ["弃置至多两名其他角色的合计两张牌"];
			if (lib.skill.rexuanfeng.canMoveCard(player)) {
				list.push("将一名其他角色装备区内的一张牌移动到另一名角色的装备区内");
			}
			player
				.chooseControl("cancel2")
				.set("choiceList", list)
				.set("prompt", get.prompt("rexuanfeng"))
				.set("ai", function () {
					if (lib.skill.rexuanfeng.canMoveCard(player, true)) {
						return 1;
					}
					return 0;
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("rexuanfeng");
				if (result.index == 1) {
					event.goto(5);
				} else {
					event.count = 2;
				}
			} else {
				event.finish();
			}
			"step 2";
			player
				.chooseTarget("弃置一名其他角色的一张牌", function (card, player, target) {
					if (player == target) {
						return false;
					}
					return target.countDiscardableCards(player, "he");
				})
				.set("ai", function (target) {
					return -get.attitude(_status.event.player, target);
				});
			"step 3";
			if (result.bool) {
				player.line(result.targets[0], "green");
				player.discardPlayerCard(result.targets[0], "he", true);
				event.count--;
			} else {
				event.finish();
			}
			"step 4";
			if (event.count) {
				event.goto(2);
			} else {
				event.finish();
			}
			"step 5";
			var next = player.chooseTarget(2, function (card, player, target) {
				if (player == target) {
					return false;
				}
				if (ui.selected.targets.length) {
					var from = ui.selected.targets[0];
					if (target.isMin()) {
						return false;
					}
					var es = from.getCards("e");
					for (var i = 0; i < es.length; i++) {
						if (target.canEquip(es[i])) {
							return true;
						}
					}
					return false;
				} else {
					return target.countCards("e") > 0;
				}
			});
			next.set("ai", function (target) {
				var player = _status.event.player;
				var att = get.attitude(player, target);
				var sgnatt = get.sgn(att);
				if (ui.selected.targets.length == 0) {
					if (att > 0) {
						if (
							target.countCards("e", function (card) {
								return (
									get.value(card, target) < 0 &&
									game.hasPlayer(function (current) {
										return current != player && current != target && get.attitude(player, current) < 0 && current.canEquip(card) && get.effect(current, card, player, player) > 0;
									})
								);
							}) > 0
						) {
							return 9;
						}
					} else if (att < 0) {
						if (
							game.hasPlayer(function (current) {
								if (current != target && current != player && get.attitude(player, current) > 0) {
									var es = target.getCards("e");
									for (var i = 0; i < es.length; i++) {
										if (get.value(es[i], target) > 0 && current.canEquip(es[i]) && get.effect(current, es[i], player, player) > 0) {
											return true;
										}
									}
								}
							})
						) {
							return -att;
						}
					}
					return 0;
				}
				var es = ui.selected.targets[0].getCards("e");
				var i;
				var att2 = get.sgn(get.attitude(player, ui.selected.targets[0]));
				for (i = 0; i < es.length; i++) {
					if (sgnatt != 0 && att2 != 0 && sgnatt != att2 && get.sgn(get.value(es[i], ui.selected.targets[0])) == -att2 && get.sgn(get.value(es[i], target)) == sgnatt && target.canEquip(es[i])) {
						return Math.abs(att);
					}
				}
				if (i == es.length) {
					return 0;
				}
				return -att * get.attitude(player, ui.selected.targets[0]);
			});
			next.set("multitarget", true);
			next.set("targetprompt", ["被移走", "移动目标"]);
			next.set("prompt", event.prompt || "移动场上的一张装备牌");
			next.set("forced", true);
			"step 6";
			if (result.bool) {
				player.line2(result.targets, "green");
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 7";
			game.delay();
			"step 8";
			if (targets.length == 2) {
				player
					.choosePlayerCard(
						"e",
						true,
						function (button) {
							var player = _status.event.player;
							var targets0 = _status.event.targets0;
							var targets1 = _status.event.targets1;
							if (get.attitude(player, targets0) > get.attitude(player, targets1)) {
								if (get.value(button.link, targets0) < 0) {
									return get.effect(targets1, button.link, player, player);
								}
								return 0;
							} else {
								return get.value(button.link, targets0) * get.effect(targets1, button.link, player, player);
							}
						},
						targets[0]
					)
					.set("targets0", targets[0])
					.set("targets1", targets[1])
					.set("filterButton", function (button) {
						var targets1 = _status.event.targets1;
						return targets1.canEquip(button.link);
					});
			} else {
				event.finish();
			}
			"step 9";
			if (result.bool && result.links.length) {
				var link = result.links[0];
				event.targets[1].equip(link);
				event.targets[0].$give(link, event.targets[1]);
				game.delay();
				event.result = { bool: true };
			}
		},
		canMoveCard(player, withatt) {
			return game.hasPlayer(function (current) {
				if (player == current) {
					return false;
				}
				var att = get.sgn(get.attitude(player, current));
				if (!withatt || att != 0) {
					var es = current.getCards("e");
					for (var i = 0; i < es.length; i++) {
						if (
							game.hasPlayer(function (current2) {
								if (player == current2) {
									return false;
								}
								if (withatt) {
									if (get.sgn(get.value(es[i], current)) != -att) {
										return false;
									}
									var att2 = get.sgn(get.attitude(player, current2));
									if (att == att2 || att2 != get.sgn(get.value(es[i], current2))) {
										return false;
									}
								}
								return current != current2 && !current2.isMin() && current2.canEquip(es[i]);
							})
						) {
							return true;
						}
					}
				}
			});
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
						return [1, 3];
					}
				},
			},
			reverseEquip: true,
			noe: true,
		},
	},
	rechunlao: {
		trigger: { player: "phaseUseEnd" },
		direct: true,
		audio: 2,
		filter(event, player) {
			return player.countCards("h") > 0 && (_status.connectMode || player.countCards("h", "sha") > 0) && !player.getExpansions("rechunlao").length;
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
		content() {
			"step 0";
			player.chooseCard([1, Math.max(1, player.countCards("h", "sha"))], get.prompt("rechunlao"), "将任意张【杀】置于武将牌上作为“醇”", { name: "sha" }).set("ai", function () {
				return 1;
			});
			"step 1";
			if (result.bool) {
				player.logSkill("rechunlao");
				player.addToExpansion("gain2", result.cards).gaintag.add("rechunlao");
			}
		},
		ai: {
			threaten: 1.4,
		},
		group: "rechunlao2",
	},
	rechunlao2: {
		enable: "chooseToUse",
		sourceSkill: "rechunlao",
		filter(event, player) {
			return event.type == "dying" && event.dying && event.dying.hp <= 0 && player.getExpansions("rechunlao").length > 0;
		},
		filterTarget(card, player, target) {
			return target == _status.event.dying;
		},
		direct: true,
		delay: false,
		selectTarget: -1,
		content() {
			"step 0";
			player.chooseCardButton(get.translation("rechunlao"), player.getExpansions("rechunlao"), true);
			"step 1";
			if (result.bool) {
				player.logSkill("rechunlao");
				event.type = "dying";
				player.loseToDiscardpile(result.links);
				target.useCard({ name: "jiu", isCard: true }, target);
				var natures = get.natureList(result.links[0]);
				if (natures.includes("fire")) {
					player.recover();
				}
				if (natures.includes("thunder")) {
					player.draw(2);
				}
			}
		},
		ai: {
			order: 6,
			skillTagFilter(player) {
				return player.getExpansions("rechunlao").length > 0;
			},
			save: true,
			result: {
				target: 3,
			},
			threaten: 1.6,
		},
	},
	reluoying: {
		audio: 2,
		audioname: ["dc_caozhi", "ol_caozhi"],
		group: ["reluoying_discard", "reluoying_judge"],
		subfrequent: ["judge"],
		subSkill: {
			discard: {
				audio: "reluoying",
				audioname: ["dc_caozhi", "ol_caozhi"],
				trigger: { global: ["loseAfter", "loseAsyncAfter"] },
				filter(event, player) {
					if (event.type != "discard" || event.getlx === false) {
						return false;
					}
					var cards = event.cards.slice(0);
					var evt = event.getl(player);
					if (evt && evt.cards) {
						cards.removeArray(evt.cards);
					}
					for (var i = 0; i < cards.length; i++) {
						if (cards[i].original != "j" && get.suit(cards[i], event.player) == "club" && get.position(cards[i], true) == "d") {
							return true;
						}
					}
					return false;
				},
				direct: true,
				content() {
					"step 0";
					if (trigger.delay == false) {
						game.delay();
					}
					"step 1";
					var cards = [],
						cards2 = trigger.cards.slice(0),
						evt = trigger.getl(player);
					if (evt && evt.cards) {
						cards2.removeArray(evt.cards);
					}
					for (var i = 0; i < cards2.length; i++) {
						if (cards2[i].original != "j" && get.suit(cards2[i], trigger.player) == "club" && get.position(cards2[i], true) == "d") {
							cards.push(cards2[i]);
						}
					}
					if (cards.length) {
						player.chooseButton(["落英：选择要获得的牌", cards], [1, cards.length]).set("ai", function (button) {
							return get.value(button.link, _status.event.player, "raw");
						});
					}
					"step 2";
					if (result.bool) {
						player.logSkill(event.name);
						player.gain(result.links, "gain2", "log");
					}
				},
			},
			judge: {
				audio: "reluoying",
				audioname: ["dc_caozhi", "ol_caozhi"],
				trigger: { global: "cardsDiscardAfter" },
				direct: true,
				filter(event, player) {
					var evt = event.getParent().relatedEvent;
					if (!evt || evt.name != "judge") {
						return;
					}
					if (evt.player == player) {
						return false;
					}
					if (get.position(event.cards[0], true) != "d") {
						return false;
					}
					return get.suit(event.cards[0]) == "club";
				},
				content() {
					"step 0";
					player.chooseButton(["落英：选择要获得的牌", trigger.cards], [1, trigger.cards.length]).set("ai", function (button) {
						return get.value(button.link, _status.event.player, "raw");
					});
					"step 1";
					if (result.bool) {
						player.logSkill(event.name);
						player.gain(result.links, "gain2", "log");
					}
				},
			},
		},
	},
	chengzhang: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		derivation: "rejiushi_mark",
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			var num = 0;
			player.getAllHistory("sourceDamage", function (evt) {
				num += evt.num;
			});
			if (num >= 7) {
				return true;
			}
			player.getAllHistory("damage", function (evt) {
				num += evt.num;
			});
			return num >= 7;
		},
		content() {
			player.markSkill("rejiushi_mark");
			player.awakenSkill(event.name);
			player.storage.chengzhang = true;
			player.recover();
			player.draw();
		},
		ai: {
			combo: "rejiushi",
		},
	},
	rejiushi: {
		audio: 2,
		group: ["rejiushi1", "rejiushi3", "rejiushi_gain"],
		subfrequent: ["gain"],
		subSkill: {
			gain: {
				audio: "rejiushi",
				trigger: { player: "turnOverAfter" },
				frequent: true,
				filter(event, player) {
					return player.storage.chengzhang == true;
				},
				prompt: "是否发动【酒诗】，从牌堆中随机获得一张锦囊牌？",
				content() {
					var card = get.cardPile2(function (card) {
						return get.type2(card) == "trick";
					}, "random");
					if (card) {
						player.gain(card, "gain2", "log");
					}
				},
			},
		},
	},
	rejiushi1: {
		hiddenCard(player, name) {
			if (name == "jiu") {
				return !player.isTurnedOver();
			}
			return false;
		},
		audio: "rejiushi",
		enable: "chooseToUse",
		sourceSkill: "rejiushi",
		filter(event, player) {
			if (player.classList.contains("turnedover")) {
				return false;
			}
			return event.filterCard({ name: "jiu", isCard: true }, player, event);
		},
		async content(event, trigger, player) {
			if (_status.event.getParent(2).type == "dying") {
				event.dying = player;
				event.type = "dying";
			}
			await player.turnOver();
			await player.useCard({ name: "jiu", isCard: true }, player);
		},
		ai: {
			save: true,
			skillTagFilter(player, tag, arg) {
				return !player.isTurnedOver() && _status.event?.dying == player;
			},
			order: 5,
			result: {
				player(player) {
					if (_status.event.parent.name == "phaseUse") {
						if (player.countCards("h", "jiu") > 0) {
							return 0;
						}
						if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) {
							return 0;
						}
						if (!player.countCards("h", "sha")) {
							return 0;
						}
						var targets = [];
						var target;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(player, players[i]) < 0) {
								if (player.canUse("sha", players[i], true, true)) {
									targets.push(players[i]);
								}
							}
						}
						if (targets.length) {
							target = targets[0];
						} else {
							return 0;
						}
						var num = get.effect(target, { name: "sha" }, player, player);
						for (var i = 1; i < targets.length; i++) {
							var num2 = get.effect(targets[i], { name: "sha" }, player, player);
							if (num2 > num) {
								target = targets[i];
								num = num2;
							}
						}
						if (num <= 0) {
							return 0;
						}
						var e2 = target.getEquip(2);
						if (e2) {
							if (e2.name == "tengjia") {
								if (!player.countCards("h", { name: "sha", nature: "fire" }) && !player.getEquip("zhuque")) {
									return 0;
								}
							}
							if (e2.name == "renwang") {
								if (!player.countCards("h", { name: "sha", color: "red" })) {
									return 0;
								}
							}
							if (e2.name == "baiyin") {
								return 0;
							}
						}
						if (player.getEquip("guanshi") && player.countCards("he") > 2) {
							return 1;
						}
						return target.countCards("h") > 3 ? 0 : 1;
					}
					if (player == _status.event.dying || player.isTurnedOver()) {
						return 3;
					}
				},
			},
			effect: {
				target(card, player, target) {
					if (target.isTurnedOver()) {
						if (get.tag(card, "damage")) {
							if (player.hasSkillTag("jueqing", false, target)) {
								return [1, -2];
							}
							if (target.hp == 1) {
								return;
							}
							return [1, target.countCards("h") / 2];
						}
					}
				},
			},
		},
	},
	rejiushi3: {
		audio: "rejiushi",
		trigger: { player: "damageEnd" },
		sourceSkill: "rejiushi",
		check(event, player) {
			return player.isTurnedOver();
		},
		filter(event, player) {
			if (
				player.hasHistory("useCard", evt => {
					if (evt.card.name != "jiu" || evt.getParent().name != "rejiushi1") {
						return false;
					}
					return evt.getParent("damage", true) == event;
				})
			) {
				return false;
			}
			return player.isTurnedOver();
		},
		prompt(event, player) {
			var str = "是否发动【酒诗】，将武将牌翻面";
			if (!player.storage.chengzhang) {
				str += "，并获得牌堆中的一张锦囊牌";
			}
			str += "？";
			return str;
		},
		content() {
			player.turnOver();
			if (!player.storage.chengzhang) {
				var card = get.cardPile2(function (card) {
					return get.type2(card) == "trick";
				});
				if (card) {
					player.gain(card, "gain2", "log");
				}
			}
		},
	},
	rejiushi_mark: {
		mark: true,
		marktext: "改",
		intro: {
			content: "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌于受到伤害时背面向上，你可以翻面。当你翻面时，你获得牌堆中的一张随机锦囊牌。",
		},
	},
	rehongyan: {
		audio: 2,
		mod: {
			suit(card, suit) {
				if (suit == "spade") {
					return "heart";
				}
			},
		},
		trigger: { player: "loseEnd" },
		filter(event, player) {
			if (player == _status.currentPhase || !event.visible || player.hp <= player.countCards("h")) {
				return false;
			}
			for (var i = 0; i < event.cards2.length; i++) {
				if (get.suit(event.cards2[i], player) == "heart") {
					return true;
				}
			}
			return false;
		},
		frequent: true,
		content() {
			player.draw();
		},
	},
	reqimou: {
		limited: true,
		audio: 2,
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "orange",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { result } = await player.chooseNumbers(get.prompt(event.name), [{ prompt: "请选择你要失去的体力值", min: 1, max: player.getHp() }], true).set("processAI", () => {
				const player = get.player();
				let num = player.getHp() - 1;
				if (player.countCards("hs", { name: ["tao", "jiu"] })) {
					num = player.getHp();
				}
				return [num];
			});
			const number = result.numbers[0];
			player.storage.reqimou2 = number;
			await player.loseHp(number);
			await player.draw(number);
			player.addTempSkill("reqimou2");
		},
		ai: {
			order: 14,
			result: {
				player(player) {
					if (player.hp < 3) {
						return false;
					}
					var mindist = player.hp;
					if (player.countCards("hs", card => player.canSaveCard(card, player))) {
						mindist++;
					}
					if (
						game.hasPlayer(function (current) {
							return get.distance(player, current) <= mindist && player.canUse("sha", current, false) && get.effect(current, { name: "sha" }, player, player) > 0;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	reqimou2: {
		onremove: true,
		mod: {
			cardUsable(card, player, num) {
				if (typeof player.storage.reqimou2 == "number" && card.name == "sha") {
					return num + player.storage.reqimou2;
				}
			},
			globalFrom(from, to, distance) {
				if (typeof from.storage.reqimou2 == "number") {
					return distance - from.storage.reqimou2;
				}
			},
		},
	},
	olniepan: {
		audio: 2,
		enable: "chooseToUse",
		skillAnimation: true,
		limited: true,
		animationColor: "orange",
		filter(event, player) {
			if (event.type == "dying") {
				if (player != event.dying) {
					return false;
				}
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.storage.olniepan = true;
			player.discard(player.getCards("hej"));
			"step 1";
			player.link(false);
			"step 2";
			player.turnOver(false);
			"step 3";
			player.draw(3);
			"step 4";
			if (player.hp < 3) {
				player.recover(3 - player.hp);
			}
			"step 5";
			player.chooseControl("bazhen", "olhuoji", "olkanpo").set("prompt", "选择获得一个技能").ai = function () {
				let player = get.event("player"),
					threaten = get.threaten(player);
				if (!player.hasEmptySlot(2)) {
					return "olhuoji";
				}
				if (threaten < 0.8) {
					return "olkanpo";
				}
				if (threaten < 1.6) {
					return "bazhen";
				}
				return ["olhuoji", "bazhen"].randomGet();
			};
			"step 6";
			player.addSkills(result.control);
		},
		derivation: ["bazhen", "olhuoji", "olkanpo"],
		ai: {
			order: 1,
			skillTagFilter(player, tag, target) {
				if (player != target || player.storage.olniepan) {
					return false;
				}
			},
			save: true,
			result: {
				player(player) {
					if (player.hp <= 0) {
						return 10;
					}
					if (player.hp <= 2 && player.countCards("he") <= 1) {
						return 10;
					}
					return 0;
				},
			},
			threaten(player, target) {
				if (!target.storage.olniepan) {
					return 0.6;
				}
			},
		},
	},
	rewurong: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			if (target.countCards("h") == 0 || player.countCards("h") == 0) {
				event.finish();
				return;
			}
			"step 1";
			var sendback = function () {
				if (_status.event != event) {
					return function () {
						event.resultOL = _status.event.resultOL;
					};
				}
			};
			if (player.isOnline()) {
				player.wait(sendback);
				event.ol = true;
				player.send(function () {
					game.me.chooseCard(true).set("glow_result", true).ai = function () {
						return Math.random();
					};
					game.resume();
				});
			} else {
				event.localPlayer = true;
				var hasShan = !target.countCards("h", "shan");
				player.chooseCard(true).set("glow_result", true).ai = function (card) {
					if (hasShan && get.name(card) == "sha") {
						return 1;
					}
					return Math.random();
				};
			}
			if (target.isOnline()) {
				target.wait(sendback);
				event.ol = true;
				target.send(function () {
					var rand = Math.random() < 0.4;
					game.me.chooseCard(true).set("glow_result", true).ai = function (card) {
						if (rand) {
							return card.name == "shan" ? 1 : 0;
						}
						return card.name == "shan" ? 0 : 1;
					};
					game.resume();
				});
			} else {
				event.localTarget = true;
			}
			"step 2";
			if (event.localPlayer) {
				event.card1 = result.cards[0];
			}
			if (event.localTarget) {
				var rand = Math.random() < 0.4;
				target.chooseCard(true).set("glow_result", true).ai = function (card) {
					if (rand) {
						return card.name == "shan" ? 1 : 0;
					}
					return card.name == "shan" ? 0 : 1;
				};
			}
			"step 3";
			if (event.localTarget) {
				event.card2 = result.cards[0];
			}
			if (!event.resultOL && event.ol) {
				game.pause();
			}
			"step 4";
			try {
				if (!event.card1) {
					event.card1 = event.resultOL[player.playerid].cards[0];
				}
				if (!event.card2) {
					event.card2 = event.resultOL[target.playerid].cards[0];
				}
				if (!event.card1 || !event.card2) {
					throw "err";
				}
			} catch (e) {
				console.log(e);
				event.finish();
				return;
			}
			game.broadcastAll(
				function (card1, card2) {
					card1.classList.remove("glow");
					card2.classList.remove("glow");
				},
				event.card1,
				event.card2
			);
			"step 5";
			game.broadcastAll(function () {
				ui.arena.classList.add("thrownhighlight");
			});
			game.addVideo("thrownhighlight1");
			player.$compare(event.card1, target, event.card2);
			game.delay(4);
			"step 6";
			var next = game.createEvent("showCards");
			next.player = player;
			next.cards = [event.card1];
			next.setContent("emptyEvent");
			game.log(player, "展示了", event.card1);
			"step 7";
			var next = game.createEvent("showCards");
			next.player = target;
			next.cards = [event.card2];
			next.setContent("emptyEvent");
			game.log(target, "展示了", event.card2);
			"step 8";
			var name1 = get.name(event.card1);
			var name2 = get.name(event.card2);
			if (name1 == "sha" && name2 != "shan") {
				//player.discard(event.card1).set('animate',false);
				target.$gain2(event.card2);
				var clone = event.card1.clone;
				if (clone) {
					clone.style.transition = "all 0.5s";
					clone.style.transform = "scale(1.2)";
					clone.delete();
					game.addVideo("deletenode", player, get.cardsInfo([clone]));
				}
				game.broadcast(function (card) {
					var clone = card.clone;
					if (clone) {
						clone.style.transition = "all 0.5s";
						clone.style.transform = "scale(1.2)";
						clone.delete();
					}
				}, event.card1);
				target.damage("nocard");
			} else if (name1 != "sha" && name2 == "shan") {
				//player.discard(event.card1).set('animate',false);
				target.$gain2(event.card2);
				var clone = event.card1.clone;
				if (clone) {
					clone.style.transition = "all 0.5s";
					clone.style.transform = "scale(1.2)";
					clone.delete();
					game.addVideo("deletenode", player, get.cardsInfo([clone]));
				}
				game.broadcast(function (card) {
					var clone = card.clone;
					if (clone) {
						clone.style.transition = "all 0.5s";
						clone.style.transform = "scale(1.2)";
						clone.delete();
					}
				}, event.card1);
				player.gainPlayerCard(target, true, "he");
			} else {
				player.$gain2(event.card1);
				target.$gain2(event.card2);
			}
			game.broadcastAll(function () {
				ui.arena.classList.remove("thrownhighlight");
			});
			game.addVideo("thrownhighlight2");
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
	},
	cangzhuo: {
		trigger: { player: "phaseDiscardBegin" },
		frequent: true,
		audio: 2,
		filter(event, player) {
			return (
				player.getHistory("useCard", function (card) {
					return get.type(card.card, "trick") == "trick";
				}).length == 0
			);
		},
		content() {
			player.addTempSkill("cangzhuo2");
		},
	},
	cangzhuo2: {
		mod: {
			ignoredHandcard(card, player) {
				if (get.type(card, "trick") == "trick") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.type(card, "trick") == "trick") {
					return false;
				}
			},
		},
	},
	shebian: {
		audio: 2,
		trigger: { player: "turnOverEnd" },
		check(event, player) {
			return player.canMoveCard(true, true);
		},
		filter(event, player) {
			return player.canMoveCard(null, true);
		},
		content() {
			player.moveCard().nojudge = true;
		},
	},
	rexianzhen: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.player && get.name(result.player, player) == "sha") {
				player.addTempSkill("rexianzhen4");
			}
			if (result.bool) {
				player.storage[event.name] = target;
				player.addTempSkill(event.name + 2);
			} else {
				player.addTempSkill(event.name + 3);
			}
		},
		ai: {
			order(name, player) {
				var cards = player.getCards("h");
				if (player.countCards("h", "sha") == 0) {
					return 1;
				}
				for (var i = 0; i < cards.length; i++) {
					if (cards[i].name != "sha" && get.number(cards[i]) > 11 && get.value(cards[i]) < 7) {
						return 9;
					}
				}
				return get.order({ name: "sha" }) - 1;
			},
			result: {
				player(player) {
					if (player.countCards("h", "sha") > 0) {
						return 0;
					}
					var num = player.countCards("h");
					if (num > player.hp) {
						return 0;
					}
					if (num == 1) {
						return -2;
					}
					if (num == 2) {
						return -1;
					}
					return -0.7;
				},
				target(player, target) {
					var num = target.countCards("h");
					if (num == 1) {
						return -1;
					}
					if (num == 2) {
						return -0.7;
					}
					return -0.5;
				},
			},
			threaten: 1.3,
		},
	},
	rexianzhen2: {
		charlotte: true,
		mod: {
			targetInRange(card, player, target) {
				if (target == player.storage.rexianzhen) {
					return true;
				}
			},
			cardUsableTarget(card, player, target) {
				if (target == player.storage.rexianzhen) {
					return true;
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (arg.target != player.storage.rexianzhen) {
					return false;
				}
			},
		},
	},
	rexianzhen3: {
		charlotte: true,
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") {
					return false;
				}
			},
		},
	},
	rexianzhen4: {
		mod: {
			ignoredHandcard(card, player) {
				if (get.name(card) == "sha") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.name(card) == "sha") {
					return false;
				}
			},
		},
	},
	rejinjiu: {
		mod: {
			cardname(card, player) {
				if (card.name == "jiu") {
					return "sha";
				}
			},
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("h", "jiu")) {
					return false;
				}
			},
			respondSha: true,
		},
		audio: 2,
		trigger: { player: ["useCard1", "respond"] },
		firstDo: true,
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && !event.skill && event.cards.length == 1 && event.cards[0].name == "jiu";
		},
		content() {},
		group: "rejinjiu2",
		global: "rejinjiu3",
	},
	rejinjiu3: {
		mod: {
			cardEnabled(card, player) {
				if (card.name == "jiu" && _status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill("rejinjiu")) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (card.name == "jiu" && _status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill("rejinjiu")) {
					return false;
				}
			},
		},
	},
	rejinjiu2: {
		audio: "rejinjiu",
		forced: true,
		trigger: { player: "damageBegin3" },
		sourceSkill: "rejinjiu",
		filter(event, player) {
			return event.getParent(2).jiu == true;
		},
		content() {
			trigger.num -= trigger.getParent(2).jiu_add;
		},
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				return arg && arg.jiu == true;
			},
		},
	},
	repojun: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		direct: true,
		filter(event, player) {
			return event.card.name == "sha" && event.target.hp > 0 && event.target.countCards("he") > 0;
		},
		preHidden: true,
		content() {
			"step 0";
			var next = player.choosePlayerCard(trigger.target, "he", [1, Math.min(trigger.target.hp, trigger.target.countCards("he"))], get.prompt("repojun", trigger.target));
			next.set("ai", function (button) {
				if (!_status.event.goon) {
					return 0;
				}
				var val = get.value(button.link);
				if (button.link == _status.event.target.getEquip(2)) {
					return 2 * (val + 3);
				}
				return val;
			});
			next.set("goon", get.attitude(player, trigger.target) <= 0);
			next.set("forceAuto", true);
			next.setHiddenSkill(event.name);
			"step 1";
			if (result.bool) {
				var target = trigger.target;
				player.logSkill("repojun", target);
				target.addSkill("repojun2");
				target.addToExpansion("giveAuto", result.cards, target).gaintag.add("repojun2");
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (get.attitude(player, arg.target) > 0) {
					return false;
				}
				if (tag == "directHit_ai") {
					return arg.target.hp >= Math.max(1, arg.target.countCards("h") - 1);
				}
				if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
					return true;
				}
				return false;
			},
		},
		group: "repojun3",
	},
	repojun3: {
		audio: "repojun",
		trigger: { source: "damageBegin1" },
		sourceSkill: "repojun",
		filter(event, player) {
			var target = event.player;
			return event.card && event.card.name == "sha" && player.countCards("h") >= target.countCards("h") && player.countCards("e") >= target.countCards("e");
		},
		forced: true,
		locked: false,
		logTarget: "player",
		preHidden: true,
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		content() {
			trigger.num++;
		},
	},
	repojun2: {
		trigger: { global: "phaseEnd" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "repojun",
		filter(event, player) {
			return player.getExpansions("repojun2").length > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("repojun2");
			player.gain(cards, "draw");
			game.log(player, "收回了" + get.cnNumber(cards.length) + "张“破军”牌");
			"step 1";
			player.removeSkill("repojun2");
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("repojun2");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
	},
	sishu: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("sishu")).ai = function (target) {
				var att = get.attitude(_status.event.player, target);
				if (target.countMark("sishu2") % 2 == 1) {
					return -att;
				}
				return att;
			};
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("sishu", target);
				target.addSkill("sishu2");
				target.addMark("sishu2", 1, false);
			}
		},
	},
	sishu2: {
		charlotte: true,
		marktext: "思",
		intro: {
			name: "思蜀",
			content: "本局游戏内计算【乐不思蜀】的效果时反转#次",
		},
		mod: {
			judge(player, result) {
				if (_status.event.cardname == "lebu" && player.countMark("sishu2") % 2 == 1) {
					if (result.bool == false) {
						result.bool = true;
					} else {
						result.bool = false;
					}
				}
			},
		},
	},
	olruoyu: {
		skillAnimation: true,
		animationColor: "fire",
		audio: 2,
		juexingji: true,
		zhuSkill: true,
		keepSkill: true,
		derivation: ["rejijiang", "sishu"],
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			if (!player.hasZhuSkill("olruoyu")) {
				return false;
			}
			return player.isMinHp();
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.gainMaxHp();
			"step 1";
			if (player.hp < 3) {
				player.recover(3 - player.hp);
			}
			player.addSkills(["sishu", "rejijiang"]);
		},
	},
	olfangquan: {
		audio: 2,
		audioname2: { shen_caopi: "olfangquan_shen_caopi" },
		trigger: { player: "phaseUseBefore" },
		filter(event, player) {
			return player.countCards("h") > 0 && !player.hasSkill("olfangquan3");
		},
		direct: true,
		content() {
			"step 0";
			var fang = player.countMark("olfangquan2") == 0 && player.hp >= 2 && player.countCards("h") <= player.hp + 2;
			player
				.chooseBool(get.prompt2("olfangquan"))
				.set("ai", function () {
					if (!_status.event.fang) {
						return false;
					}
					return game.hasPlayer(function (target) {
						if (target.hasJudge("lebu") || target == player) {
							return false;
						}
						if (get.attitude(player, target) > 4) {
							return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
						}
						return false;
					});
				})
				.set("fang", fang);
			"step 1";
			if (result.bool) {
				player.logSkill("olfangquan");
				trigger.cancel();
				player.addTempSkill("olfangquan2");
				player.addMark("olfangquan2", 1, false);
			}
		},
	},
	olfangquan2: {
		trigger: { player: "phaseDiscardBegin" },
		forced: true,
		popup: false,
		audio: false,
		onremove: true,
		sourceSkill: "olfangquan",
		content() {
			"step 0";
			event.count = player.countMark(event.name);
			player.removeMark(event.name, event.count, false);
			"step 1";
			event.count--;
			player.chooseToDiscard("是否弃置一张手牌并令一名其他角色进行一个额外回合？").set("logSkill", "olfangquan").ai = function (card) {
				return 20 - get.value(card);
			};
			"step 2";
			if (result.bool) {
				player.chooseTarget(true, "请选择进行额外回合的目标角色", lib.filter.notMe).ai = function (target) {
					if (target.hasJudge("lebu")) {
						return -1;
					}
					if (get.attitude(player, target) > 4) {
						return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1);
					}
					return -1;
				};
			} else {
				event.finish();
			}
			"step 3";
			var target = result.targets[0];
			player.line(target, "fire");
			target.markSkillCharacter("olfangquan", player, "放权", "进行一个额外回合");
			target.insertPhase();
			target.addSkill("olfangquan3");
			if (event.count > 0) {
				event.goto(1);
			}
		},
	},
	olfangquan3: {
		trigger: { player: ["phaseAfter", "phaseCancelled"] },
		forced: true,
		popup: false,
		audio: false,
		sourceSkill: "olfangquan",
		content() {
			player.unmarkSkill("olfangquan");
			player.removeSkill("olfangquan3");
		},
	},
	olluanji: {
		inherit: "luanji",
		audioname2: { shen_caopi: "olluanji_shen_caopi" },
		audio: 2,
		line: false,
		group: "olluanji_remove",
		check(card) {
			return 7 - get.value(card);
		},
	},
	olluanji_remove: {
		trigger: { player: "useCard2" },
		direct: true,
		sourceSkill: "olluanji",
		filter(event, player) {
			return event.card.name == "wanjian" && event.targets.length > 0;
		},
		line: false,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("olluanji"), "为" + get.translation(trigger.card) + "减少一个目标", function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set("targets", trigger.targets)
				.set("ai", function (target) {
					var player = _status.event.player;
					return -get.effect(target, _status.event.getTrigger().card, player, player);
				});
			"step 1";
			if (result.bool) {
				player.logSkill("olluanji", result.targets);
				trigger.targets.remove(result.targets[0]);
			}
		},
	},
	olxueyi: {
		audio: 2,
		trigger: { global: "phaseBefore", player: "enterGame" },
		forced: true,
		zhuSkill: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && player.hasZhuSkill("olxueyi");
		},
		content() {
			// player.storage.olxueyi_inited=true;
			var num = game.countPlayer(function (current) {
				return current.group == "qun";
			});
			if (num) {
				player.addMark("olxueyi", num * 2);
			}
		},
		marktext: "裔",
		intro: {
			name2: "裔",
			content: "mark",
		},
		mod: {
			maxHandcard(player, num) {
				if (player.hasZhuSkill("olxueyi")) {
					return num + player.countMark("olxueyi");
				}
			},
		},
		group: "olxueyi_draw",
		subSkill: {
			draw: {
				audio: "olxueyi",
				trigger: { player: "phaseUseBegin" },
				prompt2: "弃置一枚「裔」标记，然后摸一张牌",
				check(event, player) {
					return player.getUseValue("wanjian") > 0 || !player.needsToDiscard();
				},
				filter(event, player) {
					return player.hasZhuSkill("olxueyi") && player.hasMark("olxueyi");
				},
				content() {
					player.removeMark("olxueyi", 1);
					player.draw();
				},
			},
		},
	},
	olhunzi: {
		audio: 2,
		audioname: ["re_sunyi"],
		inherit: "hunzi",
		content() {
			player.awakenSkill(event.name);
			player.loseMaxHp();
			//player.recover();
			player.addSkills(["reyingzi", "gzyinghun"]);
			player.addTempSkill("olhunzi_effect");
		},
		subSkill: {
			effect: {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				popup: false,
				charlotte: true,
				content() {
					player.chooseDrawRecover(2, true);
				},
			},
		},
	},
	olzhiba: {
		audio: 2,
		zhuSkill: true,
		global: "olzhiba2",
	},
	olzhiba2: {
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (player.hasZhuSkill("olzhiba") && !player.hasSkill("olzhiba3") && target.group == "wu") {
						if (
							player.countCards("h", function (card) {
								var val = get.value(card);
								if (val < 0) {
									return true;
								}
								if (val <= 5) {
									return get.number(card) >= 12;
								}
								if (val <= 6) {
									return get.number(card) >= 13;
								}
								return false;
							}) > 0
						) {
							return -1;
						}
						return 0;
					} else {
						if (player.countCards("h", "du") && get.attitude(player, target) < 0) {
							return -1;
						}
						if (player.countCards("h") <= player.hp) {
							return 0;
						}
						var maxnum = 0;
						var cards2 = target.getCards("h");
						for (var i = 0; i < cards2.length; i++) {
							if (get.number(cards2[i]) > maxnum) {
								maxnum = get.number(cards2[i]);
							}
						}
						if (maxnum > 10) {
							maxnum = 10;
						}
						if (maxnum < 5 && cards2.length > 1) {
							maxnum = 5;
						}
						var cards = player.getCards("h");
						for (var i = 0; i < cards.length; i++) {
							if (get.number(cards[i]) < maxnum) {
								return 1;
							}
						}
						return 0;
					}
				},
			},
		},
		enable: "phaseUse",
		//usable:1,
		prompt: "请选择〖制霸〗的目标",
		filter(event, player) {
			if (
				player.hasZhuSkill("olzhiba") &&
				!player.hasSkill("olzhiba3") &&
				game.hasPlayer(function (current) {
					return current != player && current.group == "wu" && player.canCompare(current);
				})
			) {
				return true;
			}
			return (
				player.group == "wu" &&
				game.hasPlayer(function (current) {
					return current != player && current.hasZhuSkill("olzhiba", player) && !current.hasSkill("olzhiba3") && player.canCompare(current);
				})
			);
		},
		filterTarget(card, player, target) {
			if (player.hasZhuSkill("olzhiba") && !player.hasSkill("olzhiba3") && target.group == "wu" && player.canCompare(target)) {
				return true;
			}
			return player.group == "wu" && target.hasZhuSkill("olzhiba", player) && !target.hasSkill("olzhiba3") && player.canCompare(target);
		},
		prepare(cards, player, targets) {
			if (player.hasZhuSkill("olzhiba")) {
				player.logSkill("olzhiba");
			}
			if (targets[0].hasZhuSkill("olzhiba", player)) {
				targets[0].logSkill("olzhiba");
			}
		},
		direct: true,
		clearTime: true,
		contentBefore() {
			"step 0";
			var list = [];
			if (player.hasZhuSkill("olzhiba") && targets[0].group == "wu" && !player.hasSkill("olzhiba3")) {
				list.push(player);
			}
			if (player.group == "wu" && targets[0].hasZhuSkill("olzhiba") && !targets[0].hasSkill("olzhiba3")) {
				list.push(targets[0]);
			}
			if (list.length == 1) {
				event.target = list[0];
				event.goto(2);
			} else {
				player
					.chooseTarget(true, "请选择获得所有拼点牌的角色", function (card, player, target) {
						return _status.event.list.includes(target);
					})
					.set("list", list);
			}
			"step 1";
			event.target = result.targets[0];
			"step 2";
			target.addTempSkill("olzhiba3", "phaseUseEnd");
			if (target == targets[0]) {
				target
					.chooseBool("是否接受来自" + get.translation(player) + "的拼点请求？")
					.set(
						"choice",
						get.attitude(target, player) > 0 ||
							target.countCards("h", function (card) {
								var val = get.value(card);
								if (val < 0) {
									return true;
								}
								if (val <= 5) {
									return get.number(card) >= 12;
								}
								if (val <= 6) {
									return get.number(card) >= 13;
								}
								return false;
							}) > 0
					)
					.set("ai", function () {
						return _status.event.choice;
					});
			} else {
				event._result = { bool: true };
			}
			"step 3";
			if (result.bool) {
				event.getParent().zhiba_target = target;
			} else {
				game.log(target, "拒绝了", player, "的拼点请求");
				target.chat("拒绝");
			}
		},
		content() {
			"step 0";
			event.source = event.getParent().zhiba_target;
			if (!event.source) {
				event.finish();
			}
			"step 1";
			player.chooseToCompare(target).set("small", target == source && get.attitude(player, target) > 0).clear = false;
			"step 2";
			if ((player == source && result.bool) || (target == source && !result.bool)) {
				event.cards = [result.player, result.target].filterInD("d");
				if (!event.cards.length) {
					event.finish();
				} else {
					source
						.chooseControl("ok", "cancel2")
						.set("dialog", ["是否获得拼点牌？", event.cards])
						.set("ai", function () {
							if (get.value(event.cards, source, "raw") <= 0) {
								return false;
							}
							return true;
						});
				}
			} else {
				event.finish();
			}
			"step 3";
			if (result.control != "cancel2") {
				source.gain(event.cards, "gain2", "log");
			} else {
				ui.clear();
			}
		},
	},
	olzhiba3: {},
	rehuashen: {
		unique: true,
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseBegin", "phaseEnd"],
		},
		filter(event, player, name) {
			if (event.name != "phase") {
				return true;
			}
			if (name == "phaseBefore") {
				return game.phaseNumber == 0;
			}
			return player.storage.rehuashen?.character?.length > 0;
		},
		async cost(event, trigger, player) {
			if (trigger.name !== "phase" || event.triggername === "phaseBefore") {
				event.result = { bool: true, cost_data: ["替换当前化身"] };
				return;
			}
			const prompt = "###" + get.prompt(event.skill) + '###<div class="text center">替换当前化身牌或制衡至多两张其他化身牌</div>';
			const result = await player
				.chooseControl("替换当前化身", "制衡其他化身", "cancel2")
				.set("ai", () => {
					const { player, cond } = get.event();
					let skills = player.storage.rehuashen.character.map(i => get.character(i).skills).flat();
					skills.randomSort();
					skills.sort((a, b) => get.skillRank(b, cond) - get.skillRank(a, cond));
					if (skills[0] === player.storage.rehuashen.current2 || get.skillRank(skills[0], cond) < 1) {
						return "制衡其他化身";
					}
					return "替换当前化身";
				})
				.set("cond", event.triggername)
				.set("prompt", prompt)
				.forResult();
			const control = result.control;
			event.result = { bool: typeof control === "string" && control !== "cancel2", cost_data: control };
		},
		async content(event, trigger, player) {
			let choice = event.cost_data;
			if (Array.isArray(choice)) {
				lib.skill.rehuashen.addHuashens(player, 3);
				[choice] = choice;
			}
			_status.noclearcountdown = true;
			const id = lib.status.videoId++,
				prompt = choice === "替换当前化身" ? "化身：请选择你要更换的武将牌" : "化身：选择制衡至多两张武将牌";
			const cards = player.storage.rehuashen.character;
			if (player.isOnline2()) {
				player.send(
					(cards, prompt, id) => {
						const dialog = ui.create.dialog(prompt, [cards, lib.skill.rehuashen.$createButton]);
						dialog.videoId = id;
					},
					cards,
					prompt,
					id
				);
			}
			const dialog = ui.create.dialog(prompt, [cards, lib.skill.rehuashen.$createButton]);
			dialog.videoId = id;
			if (!event.isMine()) {
				dialog.style.display = "none";
			}
			if (choice === "替换当前化身") {
				const buttons = dialog.content.querySelector(".buttons");
				const array = dialog.buttons.filter(item => !item.classList.contains("nodisplay") && item.style.display !== "none");
				const choosed = player.storage.rehuashen.choosed;
				const groups = array
					.map(i => get.character(i.link).group)
					.unique()
					.sort((a, b) => {
						const getNum = g => (lib.group.includes(g) ? lib.group.indexOf(g) : lib.group.length);
						return getNum(a) - getNum(b);
					});
				if (choosed.length > 0 || groups.length > 1) {
					dialog.style.bottom = (parseInt(dialog.style.top || "0", 10) + get.is.phoneLayout() ? 230 : 220) + "px";
					dialog.addPagination({
						data: array,
						totalPageCount: groups.length + Math.sign(choosed.length),
						container: dialog.content,
						insertAfter: buttons,
						onPageChange(state) {
							const { pageNumber, data, pageElement } = state;
							const { groups, choosed } = pageElement;
							data.forEach(item => {
								item.classList[
									(() => {
										const name = item.link,
											goon = choosed.length > 0;
										if (goon && pageNumber === 1) {
											return choosed.includes(name);
										}
										const group = get.character(name).group;
										return groups.indexOf(group) + (1 + goon) === pageNumber;
									})()
										? "remove"
										: "add"
								]("nodisplay");
							});
							ui.update();
						},
						pageLimitForCN: ["←", "→"],
						pageNumberForCN: (choosed.length > 0 ? ["常用"] : []).concat(
							groups.map(i => {
								const isChineseChar = char => {
									const regex = /[\u4e00-\u9fff\u3400-\u4dbf\ud840-\ud86f\udc00-\udfff\ud870-\ud87f\udc00-\udfff\ud880-\ud88f\udc00-\udfff\ud890-\ud8af\udc00-\udfff\ud8b0-\ud8bf\udc00-\udfff\ud8c0-\ud8df\udc00-\udfff\ud8e0-\ud8ff\udc00-\udfff\ud900-\ud91f\udc00-\udfff\ud920-\ud93f\udc00-\udfff\ud940-\ud97f\udc00-\udfff\ud980-\ud9bf\udc00-\udfff\ud9c0-\ud9ff\udc00-\udfff]/u;
									return regex.test(char);
								}; //友情提醒：regex为基本汉字区间到扩展G区的Unicode范围的正则表达式，非加密/混淆
								const str = get.plainText(lib.translate[i + "2"] || lib.translate[i] || "无");
								return isChineseChar(str.slice(0, 1)) ? str.slice(0, 1) : str;
							})
						),
						changePageEvent: "click",
						pageElement: {
							groups: groups,
							choosed: choosed,
						},
					});
				}
			}
			const finish = () => {
				if (player.isOnline2()) {
					player.send("closeDialog", id);
				}
				dialog.close();
				delete _status.noclearcountdown;
				if (!_status.noclearcountdown) {
					game.stopCountChoose();
				}
			};
			while (true) {
				const next = player.chooseButton(true).set("dialog", id);
				if (choice === "制衡其他化身") {
					next.set("selectButton", [1, 2]);
					next.set("filterButton", button => button.link !== get.event().current);
					next.set("current", player.storage.rehuashen.current);
				} else {
					next.set("ai", button => {
						const { player, cond } = get.event();
						let skills = player.storage.rehuashen.character.map(i => get.character(i).skills).flat();
						skills.randomSort();
						skills.sort((a, b) => get.skillRank(b, cond) - get.skillRank(a, cond));
						return player.storage.rehuashen.map[button.link].includes(skills[0]) ? 2.5 : 1 + Math.random();
					});
					next.set("cond", event.triggername);
				}
				const result = await next.forResult();
				if (choice === "制衡其他化身") {
					finish();
					lib.skill.rehuashen.removeHuashen(player, result.links);
					lib.skill.rehuashen.addHuashens(player, result.links.length);
					return;
				} else {
					const card = result.links[0];
					const func = function (card, id) {
						const dialog = get.idDialog(id);
						if (dialog) {
							//禁止翻页
							const paginationInstance = dialog.paginationMap?.get(dialog.content.querySelector(".buttons"));
							if (paginationInstance?.state) {
								paginationInstance.state.pageRefuseChanged = true;
							}
							for (let i = 0; i < dialog.buttons.length; i++) {
								if (dialog.buttons[i].link == card) {
									dialog.buttons[i].classList.add("selectedx");
								} else {
									dialog.buttons[i].classList.add("unselectable");
								}
							}
						}
					};
					if (player.isOnline2()) {
						player.send(func, card, id);
					} else if (event.isMine()) {
						func(card, id);
					}
					const result2 = await player
						.chooseControl(player.storage.rehuashen.map[card], "返回")
						.set("ai", () => {
							const { player, cond, controls } = get.event();
							let skills = controls.slice();
							skills.randomSort();
							skills.sort((a, b) => get.skillRank(b, cond) - get.skillRank(a, cond));
							return skills[0];
						})
						.set("cond", event.triggername)
						.forResult();
					const control = result2.control;
					if (control === "返回") {
						const func2 = function (card, id) {
							const dialog = get.idDialog(id);
							if (dialog) {
								//允许翻页
								const paginationInstance = dialog.paginationMap?.get(dialog.content.querySelector(".buttons"));
								if (paginationInstance?.state) {
									paginationInstance.state.pageRefuseChanged = false;
								}
								for (let i = 0; i < dialog.buttons.length; i++) {
									dialog.buttons[i].classList.remove("selectedx");
									dialog.buttons[i].classList.remove("unselectable");
								}
							}
						};
						if (player.isOnline2()) {
							player.send(func2, card, id);
						} else if (event.isMine()) {
							func2(card, id);
						}
					} else {
						finish();
						player.storage.rehuashen.choosed.add(card);
						if (player.storage.rehuashen.current != card) {
							const old = player.storage.rehuashen.current;
							player.storage.rehuashen.current = card;
							game.broadcastAll(
								(player, character, old) => {
									player.tempname.remove(old);
									player.tempname.add(character);
									player.sex = lib.character[character][0];
								},
								player,
								card,
								old
							);
							game.log(player, "将性别变为了", "#y" + get.translation(get.character(card).sex) + "性");
							player.changeGroup(get.character(card).group);
						}
						player.storage.rehuashen.current2 = control;
						if (!player.additionalSkills.rehuashen?.includes(control)) {
							player.flashAvatar("rehuashen", card);
							player.syncStorage("rehuashen");
							player.updateMarks("rehuashen");
							await player.addAdditionalSkills("rehuashen", control);
							// lib.skill.rehuashen.createAudio(card,link,'re_zuoci');
						}
						return;
					}
				}
			}
		},
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = {
					character: [],
					choosed: [],
					map: {},
				};
			}
		},
		banned: ["lisu", "sp_xiahoudun", "xushao", "jsrg_xushao", "zhoutai", "old_zhoutai", "shixie", "xin_zhoutai", "dc_shixie", "old_shixie"],
		bannedType: ["Charlotte", "主公技", "觉醒技", "限定技", "隐匿技", "使命技"],
		addHuashen(player) {
			if (!player.storage.rehuashen) {
				return;
			}
			if (!_status.characterlist) {
				game.initCharactertList();
			}
			_status.characterlist.randomSort();
			for (let i = 0; i < _status.characterlist.length; i++) {
				let name = _status.characterlist[i];
				if (name.indexOf("zuoci") != -1 || name.indexOf("key_") == 0 || name.indexOf("sp_key_") == 0 || get.is.double(name) || lib.skill.rehuashen.banned.includes(name) || player.storage.rehuashen.character.includes(name)) {
					continue;
				}
				let skills = lib.character[name][3].filter(skill => {
					const categories = get.skillCategoriesOf(skill, player);
					return !categories.some(type => lib.skill.rehuashen.bannedType.includes(type));
				});
				if (skills.length) {
					player.storage.rehuashen.character.push(name);
					player.storage.rehuashen.map[name] = skills;
					_status.characterlist.remove(name);
					return name;
				}
			}
		},
		addHuashens(player, num) {
			var list = [];
			for (var i = 0; i < num; i++) {
				var name = lib.skill.rehuashen.addHuashen(player);
				if (name) {
					list.push(name);
				}
			}
			if (list.length) {
				player.syncStorage("rehuashen");
				player.updateMarks("rehuashen");
				game.log(player, "获得了", get.cnNumber(list.length) + "张", "#g化身");
				lib.skill.rehuashen.drawCharacter(player, list);
			}
		},
		removeHuashen(player, links) {
			player.storage.rehuashen.character.removeArray(links);
			_status.characterlist.addArray(links);
			game.log(player, "移去了", get.cnNumber(links.length) + "张", "#g化身");
		},
		drawCharacter(player, list) {
			game.broadcastAll(
				function (player, list) {
					if (player.isUnderControl(true)) {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = "huashen_card_" + list[i];
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + list[i],
							};
							lib.translate[cardname] = get.rawName2(list[i]);
							cards.push(game.createCard(cardname, "", ""));
						}
						player.$draw(cards, "nobroadcast");
					}
				},
				player,
				list
			);
		},
		$createButton(item, type, position, noclick, node) {
			node = ui.create.buttonPresets.character(item, "character", position, noclick);
			const info = lib.character[item];
			const skills = info[3].filter(function (skill) {
				const categories = get.skillCategoriesOf(skill, get.player());
				return !categories.some(type => lib.skill.rehuashen.bannedType.includes(type));
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
					capt += `&nbsp;&nbsp;${get.translation(characterInfo.sex)}`;
					let charactergroup;
					const charactergroups = get.is.double(character, true);
					if (charactergroups) {
						charactergroup = charactergroups.map(i => get.translation(i)).join("/");
					} else {
						charactergroup = get.translation(characterInfo.group);
					}
					capt += `&nbsp;&nbsp;${charactergroup}`;
				}
				uiintro.add(capt);

				if (lib.characterTitle[node.link]) {
					uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
				}
				for (let i = 0; i < skills.length; i++) {
					if (lib.translate[skills[i] + "_info"]) {
						let translation = lib.translate[skills[i] + "_ab"] || get.translation(skills[i]).slice(0, 2);
						if (lib.skill[skills[i]] && lib.skill[skills[i]].nobracket) {
							uiintro.add('<div><div class="skilln">' + get.translation(skills[i]) + "</div><div>" + get.skillInfoTranslation(skills[i]) + "</div></div>");
						} else {
							uiintro.add('<div><div class="skill">【' + translation + "】</div><div>" + get.skillInfoTranslation(skills[i]) + "</div></div>");
						}
						if (lib.translate[skills[i] + "_append"]) {
							uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills[i] + "_append"] + "</div>");
						}
					}
				}
			};
			return node;
		},
		// createAudio:(character,skillx,name)=>{
		// 	var skills=game.expandSkills([skillx]);
		// 	skills=skills.filter(skill=>get.info(skill));
		// 	if(!skills.length) return;
		// 	var skillss=skills.filter(skill=>get.info(skill).derivation);
		// 	if(skillss.length){
		// 		skillss.forEach(skill=>{
		// 			var derivationSkill=get.info(skill).derivation;
		// 			skills[Array.isArray(derivationSkill)?'addArray':'add'](derivationSkill);
		// 		});
		// 	}
		// 	skills.forEach(skill=>{
		// 		var info=lib.skill[skill];
		// 		if(info){
		// 			if(!info.audioname2) info.audioname2={};
		// 			if(info.audioname&&info.audioname.includes(character)){
		// 				if(info.audio){
		// 					if(typeof info.audio=='string') skill=info.audio;
		// 					if(Array.isArray(info.audio)) skill=info.audio[0];
		// 				}
		// 				if(!lib.skill[skill+'_'+character]) lib.skill[skill+'_'+character]={audio:2};
		// 				info.audioname2[name]=(skill+'_'+character);
		// 			}
		// 			else if(info.audioname2[character]){
		// 				info.audioname2[name]=info.audioname2[character];
		// 			}
		// 			else{
		// 				if(info.audio){
		// 					if(typeof info.audio=='string') skill=info.audio;
		// 					if(Array.isArray(info.audio)) skill=info.audio[0];
		// 				}
		// 				info.audioname2[name]=skill;
		// 			}
		// 		}
		// 	});
		// },
		mark: true,
		intro: {
			onunmark(storage, player) {
				_status.characterlist.addArray(storage.character);
				storage.character = [];
				const name = player.name ? player.name : player.name1;
				if (name) {
					const sex = get.character(name).sex;
					const group = get.character(name).group;
					if (player.sex !== sex) {
						game.broadcastAll(
							(player, sex) => {
								player.sex = sex;
							},
							player,
							sex
						);
						game.log(player, "将性别变为了", "#y" + get.translation(sex) + "性");
					}
					if (player.group !== group) {
						game.broadcastAll(
							(player, group) => {
								player.group = group;
								player.node.name.dataset.nature = get.groupnature(group);
							},
							player,
							group
						);
						game.log(player, "将势力变为了", "#y" + get.translation(group + 2));
					}
				}
			},
			mark(dialog, storage, player) {
				if (storage && storage.current) {
					dialog.addSmall([[storage.current], (item, type, position, noclick, node) => lib.skill.rehuashen.$createButton(item, type, position, noclick, node)]);
				}
				if (storage && storage.current2) {
					dialog.add('<div><div class="skill">【' + get.translation(lib.translate[storage.current2 + "_ab"] || get.translation(storage.current2).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(storage.current2, player) + "</div></div>");
				}
				if (storage && storage.character.length) {
					if (player.isUnderControl(true)) {
						dialog.addSmall([storage.character, (item, type, position, noclick, node) => lib.skill.rehuashen.$createButton(item, type, position, noclick, node)]);
					} else {
						dialog.addText("共有" + get.cnNumber(storage.character.length) + "张“化身”");
					}
				} else {
					return "没有化身";
				}
			},
			content(storage, player) {
				return "共有" + get.cnNumber(storage.character.length) + "张“化身”";
			},
			markcount(storage, player) {
				if (storage && storage.character) {
					return storage.character.length;
				}
				return 0;
			},
		},
	},
	rexinsheng: {
		inherit: "xinsheng",
		async content(event, trigger, player) {
			lib.skill.rehuashen.addHuashens(player, 1);
		},
		ai: { combo: "rehuashen" },
	},
	reguhuo: {
		audio: 2,
		derivation: "rechanyuan",
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			return lib.inpile.includes(name) && player.countCards("h") > 0 && !player.hasSkill("reguhuo_phase");
		},
		filter(event, player) {
			if (!player.countCards("hs") || player.hasSkill("reguhuo_phase")) {
				return false;
			}
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
				if (i == "sha") {
					for (var j of lib.inpile_nature) {
						if (event.filterCard(get.autoViewAs({ name: i, nature: j }, "unsure"), player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog() {
				var list = [];
				for (var i of lib.inpile) {
					var type = get.type(i);
					if (type == "basic" || type == "trick") {
						list.push([type, "", i]);
					}
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							list.push(["基本", "", "sha", j]);
						}
					}
				}
				return ui.create.dialog("蛊惑", [list, "vcard"]);
			},
			filter(button, player) {
				var evt = _status.event.getParent();
				return evt.filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"), player, evt);
			},
			check(button) {
				var player = _status.event.player;
				var rand = _status.event.getParent().getRand("reguhuo");
				var hasEnemy = game.hasPlayer(function (current) {
					return current != player && !current.hasSkill("rechanyuan") && (get.realAttitude || get.attitude)(current, player) < 0;
				});
				var card = { name: button.link[2], nature: button.link[3] };
				var val = _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
				if (val <= 0) {
					return 0;
				}
				if (hasEnemy && rand > 0.3) {
					if (
						!player.countCards("h", function (cardx) {
							if (card.name == cardx.name) {
								if (card.name != "sha") {
									return true;
								}
								return get.is.sameNature(card, cardx);
							}
							return false;
						})
					) {
						return 0;
					}
					return 3 * val;
				}
				return val;
			},
			backup(links, player) {
				return {
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						suit: "none",
						number: null,
					},
					filterCard(card, player, target) {
						var result = true;
						var suit = card.suit,
							number = card.number;
						card.suit = "none";
						card.number = null;
						var mod = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
						if (mod != "unchanged") {
							result = mod;
						}
						card.suit = suit;
						card.number = number;
						return result;
					},
					position: "hs",
					ignoreMod: true,
					ai1(card) {
						var player = _status.event.player;
						var hasEnemy = game.hasPlayer(function (current) {
							return current != player && !current.hasSkill("rechanyuan") && (get.realAttitude || get.attitude)(current, player) < 0;
						});
						var rand = _status.event.getRand("reguhuo");
						var cardx = lib.skill.reguhuo_backup.viewAs;
						if (hasEnemy && rand > 0.3) {
							if (card.name == cardx.name && (card.name != "sha" || get.is.sameNature(card, cardx))) {
								return 10;
							}
							return 0;
						}
						return 6 - get.value(card);
					},
					precontent() {
						player.logSkill("reguhuo");
						player.addTempSkill("reguhuo_guess");
						var card = event.result.cards[0];
						event.result.card.suit = get.suit(card);
						event.result.card.number = get.number(card);
					},
				};
			},
			prompt(links) {
				return "将一张手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			fireAttack: true,
			respondShan: true,
			respondSha: true,
			skillTagFilter(player) {
				if (!player.countCards("hs") || player.hasSkill("reguhuo_phase")) {
					return false;
				}
			},
			order: 10,
			result: {
				player: 1,
			},
			threaten: 1.3,
		},
	},
	reguhuo_guess: {
		trigger: {
			player: ["useCardBefore", "respondBefore"],
		},
		forced: true,
		silent: true,
		popup: false,
		charlotte: true,
		firstDo: true,
		sourceSkill: "reguhuo",
		filter(event, player) {
			return event.skill && event.skill.indexOf("reguhuo_") == 0;
		},
		content() {
			"step 0";
			player.addTempSkill("reguhuo_phase");
			event.fake = false;
			var card = trigger.cards[0];
			if (card.name != trigger.card.name || (card.name == "sha" && !get.is.sameNature(trigger.card, card))) {
				event.fake = true;
			}
			//player.logSkill('reguhuo');
			player.line(trigger.targets, get.nature(trigger.card));
			event.cardTranslate = get.translation(trigger.card.name);
			trigger.card.number = get.number(card);
			trigger.card.suit = get.suit(card);
			//trigger.line=false;
			trigger.skill = "reguhuo_backup";
			if (trigger.card.name == "sha" && get.natureList(trigger.card).length) {
				event.cardTranslate = get.translation(trigger.card.nature) + event.cardTranslate;
			}
			player.popup(event.cardTranslate, trigger.name == "useCard" ? "metal" : "wood");
			event.prompt = "是否质疑" + get.translation(player) + "声明的" + event.cardTranslate + "？";
			game.log(player, "声明了", "#y" + event.cardTranslate);
			event.targets = game
				.filterPlayer(function (current) {
					return current != player && !current.hasSkill("rechanyuan");
				})
				.sortBySeat();
			event.targets2 = event.targets.slice(0);
			player.lose(card, ui.ordering).relatedEvent = trigger;
			if (!event.targets.length) {
				event.goto(3);
			}
			event.betrays = [];
			"step 1";
			var list = event.targets.map(function (target) {
				return [target, [event.prompt, [["reguhuo_ally", "reguhuo_betray"], "vcard"]], true];
			});
			player
				.chooseButtonOL(list)
				.set("switchToAuto", function () {
					_status.event.result = "ai";
				})
				.set("processAI", function () {
					var choice = Math.random() > 0.5 ? "reguhuo_ally" : "reguhuo_betray";
					var player = _status.event.player;
					var evt = _status.event.getParent("reguhuo_guess");
					if (player.hp <= 1 || (evt && (get.realAttitude || get.attitude)(player, evt.player) >= 0)) {
						choice = "reguhuo_ally";
					}
					return {
						bool: true,
						links: [["", "", choice]],
					};
				});
			"step 2";
			for (var i in result) {
				if (result[i].links[0][2] == "reguhuo_betray") {
					var current = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
					event.betrays.push(current);
					current.addExpose(0.2);
				}
			}
			"step 3";
			for (var i of event.targets2) {
				var b = event.betrays.includes(i);
				i.popup(b ? "质疑" : "不质疑", b ? "fire" : "wood");
				game.log(i, b ? "#y质疑" : "#g不质疑");
			}
			game.delay();
			"step 4";
			player.showCards(trigger.cards);
			if (event.betrays.length) {
				event.betrays.sortBySeat();
				if (event.fake) {
					game.asyncDraw(event.betrays);
					trigger.cancel();
					trigger.getParent().goto(0);
					game.log(player, "声明的", "#y" + event.cardTranslate, "作废了");
				} else {
					var next = game.createEvent("reguhuo_final", false);
					event.next.remove(next);
					trigger.after.push(next);
					next.targets = event.betrays;
					next.setContent(lib.skill.reguhuo_guess.contentx);
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 5";
			game.delayx();
		},
		contentx() {
			"step 0";
			event.target = targets.shift();
			event.target.chooseToDiscard("弃置一张牌或失去1点体力").set("ai", function (card) {
				return 9 - get.value(card);
			});
			"step 1";
			if (!result.bool) {
				target.loseHp();
			}
			"step 2";
			target.addSkills("rechanyuan");
			if (targets.length) {
				event.goto(0);
			}
		},
	},
	reguhuo_backup: {},
	reguhuo_phase: {},
	rechanyuan: {
		init(player, skill) {
			if (player.hp <= 1) {
				player.logSkill(skill);
			}
			player.addSkillBlocker(skill);
		},
		onremove(player, skill) {
			player.removeSkillBlocker(skill);
		},
		skillBlocker(skill, player) {
			return skill != "chanyuan" && skill != "rechanyuan" && !lib.skill[skill].charlotte && !lib.skill[skill].persevereSkill && player.hp <= 1;
		},
		mark: true,
		intro: {
			content(storage, player, skill) {
				var str = "<li>锁定技，你不能于〖蛊惑〗的结算流程中进行质疑。当你的体力值不大于1时，你的其他技能失效。";
				var list = player.getSkills(null, false, false).filter(function (i) {
					return lib.skill.rechanyuan.skillBlocker(i, player);
				});
				if (list.length) {
					str += "<br><li>失效技能：" + get.translation(list);
				}
				return str;
			},
		},
		audio: 2,
		trigger: { player: "changeHp" },
		filter(event, player) {
			return get.sgn(player.hp - 1.5) != get.sgn(player.hp - 1.5 - event.num);
		},
		forced: true,
		content() {},
	},
	botu: {
		audio: 2,
		trigger: { player: "phaseAfter" },
		frequent: true,
		filter(event, player) {
			var history = player.getHistory("useCard", function (evt) {
				return evt.isPhaseUsing();
			});
			var suits = [];
			for (var i = 0; i < history.length; i++) {
				var suit = get.suit(history[i].card);
				if (suit) {
					suits.add(suit);
				}
			}
			return suits.length == 4;
		},
		content() {
			player.insertPhase();
		},
	},
	xinleiji: {
		group: "xinleiji_misa",
		audio: 2,
		derivation: "xinleiji_faq",
		audioname: ["boss_qinglong"],
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			return event.card.name == "shan" || (event.name == "useCard" && event.card.name == "shandian");
		},
		judgeCheck(card, bool) {
			var suit = get.suit(card);
			if (suit == "spade") {
				if (bool && get.number(card) > 1 && get.number(card) < 10) {
					return 5;
				}
				return 4;
			}
			if (suit == "club") {
				return 2;
			}
			return 0;
		},
		content() {
			player.judge(lib.skill.xinleiji.judgeCheck).judge2 = function (result) {
				return result.bool ? true : false;
			};
		},
		ai: {
			useShan: true,
			effect: {
				target_use(card, player, target, current) {
					let name;
					if (typeof card == "object") {
						if (card.viewAs) {
							name = card.viewAs;
						} else {
							name = get.name(card);
						}
					}
					if (
						name == "shandian" ||
						(get.tag(card, "respondShan") &&
							!player.hasSkillTag(
								"directHit_ai",
								true,
								{
									target: target,
									card: card,
								},
								true
							))
					) {
						let club = 0,
							spade = 0;
						if (
							game.hasPlayer(function (current) {
								return get.attitude(target, current) < 0 && get.damageEffect(current, target, target, "thunder") > 0;
							})
						) {
							club = 2;
							spade = 4;
						}
						if (!target.isHealthy()) {
							club += 2;
						}
						if (!club && !spade) {
							return 1;
						}
						if (name === "sha") {
							if (!target.mayHaveShan(player, "use")) {
								return;
							}
						} else if (!target.mayHaveShan(player)) {
							return 1 - 0.1 * Math.min(5, target.countCards("hs"));
						}
						if (!target.hasSkillTag("rejudge")) {
							return [1, (club + spade) / 4];
						}
						let pos = player == target || player.hasSkillTag("viewHandcard", null, target, true) ? "hes" : "e",
							better = club > spade ? "club" : "spade",
							max = 0;
						target.hasCard(function (cardx) {
							if (get.suit(cardx) == better) {
								max = 2;
								return true;
							}
							if (spade && get.color(cardx) == "black") {
								max = 1;
							}
						}, pos);
						if (max == 2) {
							return [1, Math.max(club, spade)];
						}
						if (max == 1) {
							return [1, Math.min(club, spade)];
						}
						if (pos == "e") {
							return [1, Math.min((Math.max(1, target.countCards("hs")) * (club + spade)) / 4, Math.max(club, spade))];
						}
						return [1, (club + spade) / 4];
					}
				},
				target(card, player, target) {
					if (name == "lebu" || name == "bingliang") {
						return [target.hasSkillTag("rejudge") ? 0.4 : 1, 2, target.hasSkillTag("rejudge") ? 0.4 : 1, 0];
					}
				},
			},
		},
	},
	xinleiji_misa: {
		audio: "xinleiji",
		trigger: { player: "judgeEnd" },
		direct: true,
		disableReason: ["暴虐", "助祭", "弘仪", "孤影"],
		sourceSkill: "xinleiji",
		filter(event, player) {
			return !lib.skill.xinleiji_misa.disableReason.includes(event.judgestr) && ["spade", "club"].includes(event.result.suit);
		},
		content() {
			"step 0";
			event.num = 1 + ["club", "spade"].indexOf(trigger.result.suit);
			event.logged = false;
			if (event.num == 1 && player.isDamaged()) {
				event.logged = true;
				player.logSkill("xinleiji");
				player.recover();
			}
			player
				.chooseTarget("雷击：是否对一名角色造成" + event.num + "点雷电伤害？")
				.set("ai", target => {
					const player = _status.event.player;
					let eff = get.damageEffect(target, player, target, "thunder");
					if (
						get.event("num") > 1 &&
						!target.hasSkillTag("filterDamage", null, {
							player: player,
							card: null,
							nature: "thunder",
						})
					) {
						if (eff > 0) {
							eff -= 25;
						} else if (eff < 0) {
							eff *= 2;
						}
					}
					return eff * get.attitude(player, target);
				})
				.set("num", event.num);
			"step 1";
			if (result.bool && result.targets && result.targets.length) {
				if (!event.logged) {
					player.logSkill("xinleiji", result.targets);
				} else {
					player.line(result.targets, "thunder");
				}
				result.targets[0].damage(event.num, "thunder");
			}
		},
	},
	xinguidao: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black" && get.type(card) == "equip") {
					num * 1.35;
				}
			},
			aiValue(player, card, num) {
				if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black") {
					return num * 1.15;
				}
			},
			aiUseful(player, card, num) {
				if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black") {
					return num * 1.35;
				}
			},
		},
		locked: false,
		trigger: { global: "judge" },
		filter(event, player) {
			return player.countCards("hes", { color: "black" }) > 0;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("xinguidao"), "hes", function (card) {
					if (get.color(card) != "black") {
						return false;
					}
					var player = _status.event.player;
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				})
				.set("ai", function (card) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					var judging = _status.event.judging;
					var result = trigger.judge(card) - trigger.judge(judging);
					var attitude = get.attitude(player, trigger.player);
					if (attitude == 0 || result == 0) {
						if (trigger.player != player) {
							return 0;
						}
						if (
							game.hasPlayer(function (current) {
								return get.attitude(player, current) < 0;
							})
						) {
							var checkx = lib.skill.xinleiji.judgeCheck(card, true) - lib.skill.xinleiji.judgeCheck(judging);
							if (checkx > 0) {
								return checkx;
							}
						}
						return 0;
					}
					let val = get.value(card);
					if (get.subtype(card) == "equip2") {
						val /= 2;
					} else {
						val /= 7;
					}
					if (attitude == 0 || result == 0) {
						return 0;
					}
					if (attitude > 0) {
						return result - val;
					}
					return -result - val;
				})
				.set("judging", trigger.player.judging[0]);
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "highlight", "xinguidao", "noOrdering");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.$gain2(trigger.player.judging[0]);
				player.gain(trigger.player.judging[0]);
				var card = result.cards[0];
				if (get.suit(card) == "spade" && get.number(card) > 1 && get.number(card) < 10) {
					player.draw("nodelay");
				}
				trigger.player.judging[0] = result.cards[0];
				trigger.orderingCards.addArray(result.cards);
				game.log(trigger.player, "的判定牌改为", result.cards[0]);
			}
			"step 3";
			game.delay(2);
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	reqingguo: {
		mod: {
			aiValue(player, card, num) {
				if (get.name(card) != "shan" && get.color(card) != "black") {
					return;
				}
				var cards = player.getCards("hs", function (card) {
					return get.name(card) == "shan" || get.color(card) == "black";
				});
				cards.sort(function (a, b) {
					return (get.name(b) == "shan" ? 1 : 2) - (get.name(a) == "shan" ? 1 : 2);
				});
				var geti = function () {
					if (cards.includes(card)) {
						return cards.indexOf(card);
					}
					return cards.length;
				};
				if (get.name(card) == "shan") {
					return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
				}
				return Math.max(num, [6.5, 4, 3][Math.min(geti(), 2)]);
			},
			aiUseful() {
				return lib.skill.reqingguo.mod.aiValue.apply(this, arguments);
			},
		},
		locked: false,
		audio: 2,
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card) {
			return get.color(card) == "black";
		},
		position: "hes",
		viewAs: { name: "shan" },
		viewAsFilter(player) {
			if (!player.countCards("hes", { color: "black" })) {
				return false;
			}
		},
		prompt: "将一张黑色牌当闪打出",
		check() {
			return 1;
		},
		ai: {
			order: 2,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "black" })) {
					return false;
				}
			},
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0) {
						return 0.6;
					}
				},
			},
		},
	},
	reqiangxi: {
		subSkill: {
			off: {
				sub: true,
			},
		},
		audio: 2,
		enable: "phaseUse",
		filterCard(card) {
			return get.subtype(card) == "equip1";
		},
		selectCard() {
			return [0, 1];
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			if (target.hasSkill("reqiangxi_off")) {
				return false;
			}
			return player.inRange(target);
		},
		content() {
			"step 0";
			if (cards.length == 0) {
				player.loseHp();
			}
			"step 1";
			target.addTempSkill("reqiangxi_off", "phaseUseAfter");
			target.damage("nocard");
		},
		check(card) {
			return 10 - get.value(card);
		},
		position: "he",
		ai: {
			order: 8.5,
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) {
						if (player.hp < 2) {
							return 0;
						}
						if (target.hp >= player.hp) {
							return 0;
						}
					}
					return get.damageEffect(target, player);
				},
			},
		},
		threaten: 1.5,
	},
	rehuoji: {
		position: "hes",
		audio: 2,
		audioname: ["ol_sp_zhugeliang", "ol_pangtong"],
		enable: "chooseToUse",
		filterCard(card) {
			return get.color(card) == "red";
		},
		viewAs: {
			name: "huogong",
		},
		viewAsFilter(player) {
			if (!player.countCards("hes", { color: "red" })) {
				return false;
			}
		},
		prompt: "将一张红色牌当火攻使用",
		check(card) {
			var player = get.player();
			if (player.countCards("h") > player.hp) {
				return 6 - get.value(card);
			}
			return 4 - get.value(card);
		},
		ai: {
			fireAttack: true,
		},
	},
	rekanpo: {
		mod: {
			aiValue(player, card, num) {
				if (get.name(card) != "wuxie" && get.color(card) != "black") {
					return;
				}
				var cards = player.getCards("hs", function (card) {
					return get.name(card) == "wuxie" || get.color(card) == "black";
				});
				cards.sort(function (a, b) {
					return (get.name(b) == "wuxie" ? 1 : 2) - (get.name(a) == "wuxie" ? 1 : 2);
				});
				var geti = function () {
					if (cards.includes(card)) {
						return cards.indexOf(card);
					}
					return cards.length;
				};
				if (get.name(card) == "wuxie") {
					return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
				}
				return Math.max(num, [6, 4, 3][Math.min(geti(), 2)]);
			},
			aiUseful() {
				return lib.skill.rekanpo.mod.aiValue.apply(this, arguments);
			},
		},
		locked: false,
		audio: 2,
		audioname: ["ol_sp_zhugeliang", "ol_pangtong"],
		position: "hes",
		enable: "chooseToUse",
		filterCard(card) {
			return get.color(card) == "black";
		},
		viewAsFilter(player) {
			return player.countCards("hes", { color: "black" }) > 0;
		},
		viewAs: {
			name: "wuxie",
		},
		prompt: "将一张黑色牌当无懈可击使用",
		check(card) {
			return 8 - get.value(card);
		},
	},
	reshuangxiong: {
		audio: "shuangxiong",
		audioname: ["re_yanwen"],
		group: ["reshuangxiong_judge", "reshuangxiong_gain"],
		subSkill: {
			judge: {
				audio: "reshuangxiong",
				logAudio: () => 1,
				trigger: { player: "phaseDrawBegin1" },
				check(event, player) {
					if (player.countCards("h") > player.hp) {
						return true;
					}
					if (player.countCards("h") > 3) {
						return true;
					}
					return false;
				},
				filter(event, player) {
					return !event.numFixed;
				},
				prompt2() {
					return "放弃摸牌，然后亮出牌堆顶的两张牌并选择获得其中的一张。本回合内可以将与此牌颜色不同的一张手牌当做【决斗】使用";
				},
				content() {
					"step 0";
					trigger.changeToZero();
					event.cards = get.cards(2);
					event.videoId = lib.status.videoId++;
					game.broadcastAll(
						function (player, id, cards) {
							var str;
							if (player == game.me && !_status.auto) {
								str = "【双雄】选择获得其中一张牌";
							} else {
								str = "双雄";
							}
							var dialog = ui.create.dialog(str, cards);
							dialog.videoId = id;
						},
						player,
						event.videoId,
						event.cards
					);
					event.time = get.utc();
					game.addVideo("showCards", player, ["双雄", get.cardsInfo(event.cards)]);
					game.addVideo("delay", null, 2);
					"step 1";
					var next = player.chooseButton([1, 1], true);
					next.set("dialog", event.videoId);
					next.set("ai", function (button) {
						var player = _status.event.player;
						var color = get.color(button.link);
						var value = get.value(button.link, player);
						if (player.countCards("h", { color: color }) > player.countCards("h", ["red", "black"].remove(color)[0])) {
							value += 5;
						}
						return value;
					});
					"step 2";
					if (result.bool && result.links) {
						var cards2 = [];
						for (var i = 0; i < result.links.length; i++) {
							cards2.push(result.links[i]);
							cards.remove(result.links[i]);
						}
						game.cardsDiscard(cards);
						event.card2 = cards2[0];
					}
					var time = 1000 - (get.utc() - event.time);
					if (time > 0) {
						game.delay(0, time);
					}
					"step 3";
					game.broadcastAll("closeDialog", event.videoId);
					var card2 = event.card2;
					player.gain(card2, "gain2");
					player.addTempSkill("reshuangxiong_viewas");
					player.markAuto("reshuangxiong_viewas", [get.color(card2, false)]);
				},
			},
			gain: {
				trigger: {
					player: "damageEnd",
				},
				audio: "reshuangxiong",
				filter(event, player) {
					const evt = event.getParent();
					return evt?.name == "juedou" && evt[player == evt.player ? "targetCards" : "playerCards"]?.someInD("od");
				},
				async cost(event, trigger, player) {
					let evt = trigger.getParent();
					let cards = evt[player == evt.player ? "targetCards" : "playerCards"].slice(0).filterInD("od");
					event.result = await player.chooseBool("是否发动【双雄】，获得" + get.translation(cards) + "?").forResult();
					event.result.cards = cards;
				},
				async content(event, trigger, player) {
					await player.gain(event.cards, "gain2");
				},
			},
			viewas: {
				charlotte: true,
				onremove: true,
				audio: "reshuangxiong",
				logAudio: () => "shuangxiong_re_yanwen2.mp3",
				enable: "chooseToUse",
				viewAs: { name: "juedou" },
				position: "hs",
				viewAsFilter(player) {
					return player.hasCard(card => lib.skill.reshuangxiong_viewas.filterCard(card, player), "hs");
				},
				filterCard(card, player) {
					const color = get.color(card),
						colors = player.getStorage("reshuangxiong_viewas");
					for (const i of colors) {
						if (color != i) {
							return true;
						}
					}
					return false;
				},
				prompt() {
					const colors = _status.event.player.getStorage("reshuangxiong_viewas");
					let str = "将一张颜色";
					for (let i = 0; i < colors.length; i++) {
						if (i > 0) {
							str += "或";
						}
						str += "不为";
						str += get.translation(colors[i]);
					}
					str += "的手牌当做【决斗】使用";
					return str;
				},
				check(card) {
					const player = _status.event.player;
					const raw = player.getUseValue(card, null, true);
					const eff = player.getUseValue(get.autoViewAs({ name: "juedou" }, [card]));
					return eff - raw;
				},
				ai: { order: 7 },
			},
		},
	},
	reshuangxiong1: {
		audio: "shuangxiong1",
		audioname2: {
			re_yanwen: "shuangxiong_re_yanwen1",
		},
		trigger: { player: "phaseDrawBegin1" },
		sourceSkill: "reshuangxiong",
		check(event, player) {
			if (player.countCards("h") > player.hp) {
				return true;
			}
			if (player.countCards("h") > 3) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			return !event.numFixed;
		},
		prompt2() {
			return "放弃摸牌，然后亮出牌堆顶的两张牌并选择获得其中的一张。本回合内可以将与此牌颜色不同的一张手牌当做【决斗】使用";
		},
		content() {
			"step 0";
			trigger.changeToZero();
			event.cards = get.cards(2);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str;
					if (player == game.me && !_status.auto) {
						str = "【双雄】选择获得其中一张牌";
					} else {
						str = "双雄";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			event.time = get.utc();
			game.addVideo("showCards", player, ["双雄", get.cardsInfo(event.cards)]);
			game.addVideo("delay", null, 2);
			"step 1";
			var next = player.chooseButton([1, 1], true);
			next.set("dialog", event.videoId);
			next.set("ai", function (button) {
				var player = _status.event.player;
				var color = get.color(button.link);
				var value = get.value(button.link, player);
				if (player.countCards("h", { color: color }) > player.countCards("h", ["red", "black"].remove(color)[0])) {
					value += 5;
				}
				return value;
			});
			"step 2";
			if (result.bool && result.links) {
				var cards2 = [];
				for (var i = 0; i < result.links.length; i++) {
					cards2.push(result.links[i]);
					cards.remove(result.links[i]);
				}
				game.cardsDiscard(cards);
				event.card2 = cards2[0];
			}
			var time = 1000 - (get.utc() - event.time);
			if (time > 0) {
				game.delay(0, time);
			}
			"step 3";
			game.broadcastAll("closeDialog", event.videoId);
			var card2 = event.card2;
			player.gain(card2, "gain2");
			player.addTempSkill("shuangxiong2");
			player.markAuto("shuangxiong2", [get.color(card2, false)]);
		},
	},
	reshuangxiong2: {
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		sourceSkill: "reshuangxiong",
		filter(event, player) {
			var evt = event.getParent();
			return (evt && evt.name == "juedou" && evt[player == evt.player ? "targetCards" : "playerCards"].length) > 0;
		},
		content() {
			"step 0";
			var evt = trigger.getParent();
			var cards = evt[player == evt.player ? "targetCards" : "playerCards"].slice(0);
			for (var i = 0; i < cards.length; i++) {
				if (get.position(cards[i]) != "d") {
					cards.remove(cards[i--]);
				}
			}
			if (!cards.length) {
				event.finish();
			} else {
				event.cards = cards;
				player.chooseBool("是否发动【双雄】，获得" + get.translation(event.cards) + "?").ai = function () {
					return true;
				};
			}
			"step 1";
			if (result.bool) {
				player.logSkill("reshuangxiong");
				player.gain(cards, "gain2");
			}
		},
	},
	new_yajiao: {
		audio: "reyajiao",
		trigger: {
			player: "loseEnd",
		},
		frequent: true,
		filter(event, player) {
			return player != _status.currentPhase && event.hs && event.hs.length > 0 && ["useCard", "respond"].includes(event.getParent().name);
		},
		content() {
			"step 0";
			event.card = get.cards();
			player.showCards(event.card);
			event.same = false;
			if (get.type(event.card[0], "trick") == get.type(trigger.getParent().card, "trick")) {
				event.same = true;
			}
			player
				.chooseTarget("选择获得此牌的角色", true)
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (_status.event.du) {
						if (target.hasSkillTag("nodu")) {
							return 0;
						}
						return -att;
					}
					if (!_status.event.same) {
						att += target == _status.event.player ? 1 : 0;
					}
					if (att > 0) {
						return att + Math.max(0, 5 - target.countCards("h"));
					}
					return att;
				})
				.set("du", event.card.name == "du")
				.set("same", event.same);
			"step 1";
			if (result.targets) {
				player.line(result.targets, "green");
				result.targets[0].gain(event.card, "gain2");
				if (!event.same) {
					player.chooseToDiscard(true, "he");
				}
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "respond") && target.countCards("h") > 1) {
						return [1, 0.2];
					}
				},
			},
		},
	},
	new_liyu: {
		audio: "liyu",
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name == "sha" && event.player != player && event.player.isIn() && event.player.countGainableCards(player, "hej") > 0;
		},
		direct: true,
		content() {
			"step 0";
			player
				.gainPlayerCard(get.prompt("new_liyu", trigger.player), trigger.player, "hej", "visibleMove")
				.set("ai", function (button) {
					var player = _status.event.player,
						target = _status.event.target;
					if (get.attitude(player, target) > 0 && get.position(button.link) === "j") {
						return 4 + get.value(button.link);
					}
					if (get.type(button.link) === "equip") {
						return _status.event.juedou;
					}
					return 3;
				})
				.set(
					"juedou",
					(() => {
						if (
							get.attitude(player, trigger.player) > 0 &&
							game.hasPlayer(function (current) {
								return player.canUse({ name: "juedou" }, current) && current != trigger.player && current != player && get.effect(current, { name: "juedou" }, player, _status.event.player) > 2;
							})
						) {
							return 5;
						}
						if (
							game.hasPlayer(function (current) {
								return player.canUse({ name: "juedou" }, current) && current != trigger.player && current != player && get.effect(current, { name: "juedou" }, player, _status.event.player) < 0;
							})
						) {
							return 1;
						}
						return 4;
					})()
				)
				.set("logSkill", ["new_liyu", trigger.player]);
			"step 1";
			if (result.bool) {
				if (get.type(result.cards[0]) != "equip") {
					trigger.player.draw();
					event.finish();
				} else {
					if (
						!game.hasPlayer(function (current) {
							return current != player && current != trigger.player && player.canUse("juedou", current);
						})
					) {
						event.finish();
						return;
					}
					trigger.player
						.chooseTarget(
							true,
							function (card, player, target) {
								var evt = _status.event.getParent();
								return evt.player.canUse({ name: "juedou" }, target) && target != _status.event.player;
							},
							"请选择一名角色，视为" + get.translation(player) + "对其使用【决斗】"
						)
						.set("ai", function (target) {
							var evt = _status.event.getParent();
							return get.effect(target, { name: "juedou" }, evt.player, _status.event.player) - 2;
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.targets) {
				player.useCard({ name: "juedou", isCard: true }, result.targets[0], "noai");
			}
		},
		ai: {
			halfneg: true,
		},
	},
	new_retuxi: {
		audio: "retuxi",
		audioname2: { gz_jun_caocao: "jianan_tuxi" },
		trigger: {
			player: "phaseDrawBegin2",
		},
		direct: true,
		preHidden: true,
		filter(event, player) {
			return (
				event.num > 0 &&
				!event.numFixed &&
				game.hasPlayer(function (target) {
					return target.countCards("h") > 0 && player != target;
				})
			);
		},
		content() {
			"step 0";
			var num = get.copy(trigger.num);
			if (get.mode() == "guozhan" && num > 2) {
				num = 2;
			}
			player
				.chooseTarget(
					get.prompt("new_retuxi"),
					"获得至多" + get.translation(num) + "名角色的各一张手牌，然后少摸等量的牌",
					[1, num],
					function (card, player, target) {
						return target.countCards("h") > 0 && player != target;
					},
					function (target) {
						var att = get.attitude(_status.event.player, target);
						if (target.hasSkill("tuntian")) {
							return att / 10;
						}
						return 1 - att;
					}
				)
				.setHiddenSkill("new_retuxi");
			"step 1";
			if (result.bool) {
				result.targets.sortBySeat();
				player.logSkill("new_retuxi", result.targets);
				player.gainMultiple(result.targets);
				trigger.num -= result.targets.length;
			} else {
				event.finish();
			}
			"step 2";
			if (trigger.num <= 0) {
				game.delay();
			}
		},
		ai: {
			threaten: 1.6,
			expose: 0.2,
		},
	},
	new_reyiji: {
		audio: "reyiji",
		audioname: ["yj_sb_guojia", "yj_sb_guojia_shadow"],
		trigger: {
			player: "damageEnd",
		},
		frequent: true,
		filter(event) {
			return event.num > 0;
		},
		getIndex(event, player, triggername) {
			return event.num;
		},
		content() {
			"step 0";
			player.draw(2);
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			event.given_map = {};
			event.num = 2;
			"step 1";
			player.chooseCardTarget({
				filterCard(card) {
					return get.itemtype(card) == "card" && !card.hasGaintag("reyiji_tag");
				},
				filterTarget: lib.filter.notMe,
				selectCard: [1, event.num],
				prompt: "请选择要分配的卡牌和目标",
				ai1(card) {
					if (!ui.selected.cards.length) {
						return 1;
					}
					return 0;
				},
				ai2(target) {
					var player = _status.event.player,
						card = ui.selected.cards[0];
					var val = target.getUseValue(card);
					if (val > 0) {
						return val * get.attitude(player, target) * 2;
					}
					return get.value(card, target) * get.attitude(player, target);
				},
			});
			"step 2";
			if (result.bool) {
				var res = result.cards,
					target = result.targets[0].playerid;
				player.addGaintag(res, "reyiji_tag");
				event.num -= res.length;
				if (!event.given_map[target]) {
					event.given_map[target] = [];
				}
				event.given_map[target].addArray(res);
				if (event.num > 0) {
					event.goto(1);
				}
			} else if (event.num == 2) {
				if (_status.connectMode) {
					game.broadcastAll(function () {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				event.finish();
			}
			"step 3";
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			var map = [],
				cards = [];
			for (var i in event.given_map) {
				var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) {
					player.addExpose(0.18);
				}
				map.push([source, event.given_map[i]]);
				cards.addArray(event.given_map[i]);
			}
			game.loseAsync({
				gain_list: map,
				player: player,
				cards: cards,
				giver: player,
				animate: "giveAuto",
			}).setContent("gaincardMultiple");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						let num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) {
								num = 0.7;
							} else {
								num = 0.5;
							}
						}
						if (target.hp >= 4) {
							return [1, num * 2];
						}
						if (target.hp == 3) {
							return [1, num * 1.5];
						}
						if (target.hp == 2) {
							return [1, num * 0.5];
						}
					}
				},
			},
			threaten: 0.6,
		},
	},
	new_rejianxiong: {
		audio: "rejianxiong",
		audioname: ["shen_caopi"],
		audioname2: { caoying: "lingren_jianxiong" },
		trigger: { player: "damageEnd" },
		content() {
			"step 0";
			if (get.itemtype(trigger.cards) == "cards" && get.position(trigger.cards[0], true) == "o") {
				player.gain(trigger.cards, "gain2");
			}
			player.draw("nodelay");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage") && player != target) {
						var cards = card.cards,
							evt = _status.event;
						if (evt.player == target && card.name == "damage" && evt.getParent().type == "card") {
							cards = evt.getParent().cards.filterInD();
						}
						if (target.hp <= 1) {
							return;
						}
						if (get.itemtype(cards) != "cards") {
							return;
						}
						for (var i of cards) {
							if (get.name(i, target) == "tao") {
								return [1, 4.5];
							}
						}
						if (get.value(cards, target) >= 7 + target.getDamagedHp()) {
							return [1, 2.5];
						}
						return [1, 0.6];
					}
				},
			},
		},
	},
	new_reluoyi: {
		audio: "reluoyi",
		trigger: {
			player: "phaseDrawBegin1",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			"step 0";
			var cards = get.cards(3);
			game.cardsGotoOrdering(cards);
			player.showCards(cards, "裸衣");
			var cardsx = [];
			for (var i = 0; i < cards.length; i++) {
				if (get.type(cards[i]) == "basic" || cards[i].name == "juedou" || (get.type(cards[i]) == "equip" && get.subtype(cards[i]) == "equip1")) {
					cardsx.push(cards[i]);
				}
			}
			event.cards = cardsx;
			player.chooseBool("是否放弃摸牌" + (cardsx.length ? "，改为获得" + get.translation(cardsx) : "") + "？").ai = function () {
				var num = 3;
				return cardsx.length >= trigger.num;
			};
			"step 1";
			if (result.bool) {
				if (cards.length) {
					player.gain(cards, "gain2");
				}
				//game.cardsDiscard(cards2);
				player.addTempSkill("new_reluoyi_buff", { player: "phaseBefore" });
				trigger.changeToZero();
			}
			//else game.cardsDiscard(cards);
		},
		subSkill: { buff: { inherit: "reluoyi2", sourceSkill: "new_reluoyi" } },
	},
	new_rewusheng: {
		mod: {
			targetInRange(card) {
				if (get.suit(card) == "diamond" && card.name == "sha") {
					return true;
				}
			},
		},
		locked: false,
		audio: "wusheng",
		audioname: ["re_guanyu", "jsp_guanyu", "re_guanzhang", "dc_jsp_guanyu"],
		audioname2: {
			dc_guansuo: "wusheng_guansuo",
			guanzhang: "wusheng_guanzhang",
			guansuo: "wusheng_guansuo",
			gz_jun_liubei: "shouyue_wusheng",
			std_guanxing: "wusheng_guanzhang",
			ty_guanxing: "wusheng_guanzhang",
		},
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			if (get.zhu(player, "shouyue")) {
				return true;
			}
			return get.color(card) == "red";
		},
		position: "hes",
		viewAs: {
			name: "sha",
		},
		viewAsFilter(player) {
			if (get.zhu(player, "shouyue")) {
				if (!player.countCards("hes")) {
					return false;
				}
			} else {
				if (!player.countCards("hes", { color: "red" })) {
					return false;
				}
			}
		},
		prompt: "将一张红色牌当杀使用或打出",
		check(card) {
			var val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (get.zhu(player, "shouyue")) {
					if (!player.countCards("hes")) {
						return false;
					}
				} else {
					if (!player.countCards("hes", { color: "red" })) {
						return false;
					}
				}
			},
		},
	},
	new_yijue: {
		initSkill(skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					charlotte: true,
					onremove: true,
					mark: true,
					marktext: "绝",
					intro: {
						markcount: () => 0,
						content: storage => `本回合不能使用或打出手牌、非锁定技失效且受到${get.translation(storage[1])}红桃【杀】的伤害+1`,
					},
					group: "new_yijue_ban",
				};
				lib.translate[skill] = "义绝";
				lib.translate[skill + "_bg"] = "绝";
			}
		},
		audio: "yijue",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target && target.countCards("h");
		},
		filterCard: lib.filter.cardDiscardable,
		position: "he",
		check(card) {
			return 8 - get.value(card);
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (!target.countCards("h")) {
				return;
			}
			const { result } = await target
				.chooseCard(true, "h")
				.set("ai", card => {
					const player = get.player();
					if (get.color(card) == "black") {
						return 18 - get.event("black") - get.value(card);
					}
					return 18 - get.value(card);
				})
				.set(
					"black",
					(() => {
						if (get.attitude(target, player) > 0) {
							return 18;
						}
						if (
							target.hasCard(card => {
								const name = get.name(card, target);
								return name === "shan" || name === "tao" || (name === "jiu" && target.hp < 3);
							})
						) {
							return 18 / target.hp;
						}
						if (target.hp < 3) {
							return 12 / target.hp;
						}
						return 0;
					})()
				);
			if (result?.bool && result?.cards?.length) {
				const { cards } = result;
				await target.showCards(cards);
				const [card] = cards;
				if (get.color(card) == "black") {
					if (!target.hasSkill("fengyin")) {
						target.addTempSkill("fengyin");
					}
					const skill = "new_yijue_" + player.playerid;
					game.broadcastAll(lib.skill.new_yijue.initSkill, skill);
					target.addTempSkill(skill);
					target.storage[skill] ??= [0, player];
					target.storage[skill][0]++;
					target.markSkill(skill);
					player.addTempSkill("new_yijue_effect");
				} else if (get.color(card) == "red") {
					await player.gain(card, target, "give", "bySelf");
					if (target.isDamaged()) {
						const { result } = await player.chooseBool(`是否让${get.translation(target)}回复1点体力？`).set("choice", get.recoverEffect(target, player, player) > 0);
						if (result?.bool) {
							await target.recover();
						}
					}
				}
			}
		},
		ai: {
			result: {
				target(player, target) {
					var hs = player.getCards("h");
					if (hs.length < 3) {
						return 0;
					}
					if (target.countCards("h") > target.hp + 1 && get.recoverEffect(target) > 0) {
						return 1;
					}
					if (player.canUse("sha", target) && (player.countCards("h", "sha") || player.countCards("he", { color: "red" }))) {
						return -2;
					}
					return -0.5;
				},
			},
			order: 9,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (!arg?.target?.hasSkill("new_yijue_" + player.playerid)) {
					return false;
				}
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.card?.name == "sha" && get.suit(event.card) == "heart" && event.notLink() && event.player.storage["new_yijue_" + player.playerid]?.[1] == player;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num += trigger.player.storage["new_yijue_" + player.playerid][0];
				},
			},
			ban: {
				charlotte: true,
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
			},
		},
	},
	paoxiao_re_zhangfei: { audio: 2 },
	new_repaoxiao: {
		audio: "paoxiao",
		firstDo: true,
		audioname2: {
			old_guanzhang: "old_fuhun",
			xin_zhangfei: "paoxiao_re_zhangfei",
			old_zhangfei: "paoxiao_re_zhangfei",
		},
		audioname: ["re_zhangfei", "guanzhang", "xiahouba", "re_guanzhang"],
		trigger: { player: "useCard1" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && (!event.audioed || !player.hasSkill("new_repaoxiao2"));
		},
		content() {
			trigger.audioed = true;
			player.addTempSkill("new_repaoxiao2");
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return Infinity;
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (!get.zhu(player, "shouyue")) {
					return false;
				}
				if (arg && arg.name == "sha") {
					return true;
				}
				return false;
			},
		},
	},
	new_repaoxiao2: {
		charlotte: true,
		mod: {
			targetInRange(card, player) {
				if (card.name == "sha") {
					return true;
				}
			},
		},
	},
	new_tishen: {
		trigger: {
			player: "phaseUseEnd",
		},
		check(event, player) {
			var num = 0;
			var he = player.getCards("he");
			for (var i = 0; i < he.length; i++) {
				if (get.type(he[i], "trick") == "trick") {
					num++;
				}
				if (get.type(he[i]) == "equip") {
					var subtype = get.subtype(he[i]);
					if (subtype == "equip3" || subtype == "equip4" || subtype == "equip6") {
						num++;
					}
				}
			}
			return num == 0 || num <= player.countCards("h") - player.getHandcardLimit();
		},
		content() {
			var list = [];
			var he = player.getCards("he");
			for (var i = 0; i < he.length; i++) {
				if (get.type(he[i], "trick") == "trick") {
					list.push(he[i]);
				}
				if (get.type(he[i]) == "equip") {
					var subtype = get.subtype(he[i]);
					if (subtype == "equip3" || subtype == "equip4" || subtype == "equip6") {
						list.push(he[i]);
					}
				}
			}
			if (list.length) {
				player.discard(list);
			}
			player.addTempSkill("new_tishen2", { player: "phaseBefore" });
		},
		audio: "retishen",
	},
	new_tishen2: {
		audio: "retishen",
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			return event.card.name == "sha" && event.targets && event.targets.includes(player) && !player.hasHistory("damage", evt => evt.card == event.card) && event.cards.filterInD("od").length;
		},
		forced: true,
		charlotte: true,
		sourceSkill: "new_tishen",
		content() {
			player.gain(trigger.cards.filterInD("od"), "gain2");
		},
	},
	new_qingjian: {
		audio: "qingjian",
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		usable: 1,
		filter(event, player) {
			const evt = event.getParent("phaseDraw");
			if (evt?.player == player) {
				return false;
			}
			return event.getg(player).length > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					position: "he",
					filterCard: true,
					selectCard: [1, Infinity],
					filterTarget: lib.filter.notMe,
					ai1(card) {
						const player = get.player();
						if (card.name != "du" && get.attitude(player, _status.currentPhase) < 0 && _status.currentPhase?.needsToDiscard()) {
							return -1;
						}
						for (var i = 0; i < ui.selected.cards.length; i++) {
							if (get.type(ui.selected.cards[i]) == get.type(card) || (ui.selected.cards[i].name == "du" && card.name != "du")) {
								return -1;
							}
						}
						if (card.name == "du") {
							return 20;
						}
						return player.countCards("h") - player.hp;
					},
					ai2(target) {
						const player = get.player();
						if (get.attitude(player, _status.currentPhase) < 0) {
							return -1;
						}
						const att = get.attitude(player, target);
						if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
							if (target.hasSkillTag("nodu")) {
								return 0;
							}
							return 1 - att;
						}
						if (target.countCards("h") > player.countCards("h")) {
							return 0;
						}
						return att - 4;
					},
					prompt: get.prompt2(event.name.slice(0, -5)),
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			await player.showCards(cards);
			await player.give(cards, target);
			const current = _status.currentPhase;
			if (current?.isIn()) {
				current.addTempSkill("qingjian_add");
				current.addMark("qingjian_add", cards.map(card => get.type2(card)).toUniqued().length, false);
			}
		},
		ai: { expose: 0.3 },
	},
	qingjian_add: {
		mark: true,
		intro: { content: "手牌上限+#" },
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("qingjian_add");
			},
		},
		charlotte: true,
		onremove: true,
	},
	new_reqingnang: {
		subSkill: {
			off: {
				sub: true,
			},
		},
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		check(card) {
			var player = _status.event.player;
			if (
				game.countPlayer(function (current) {
					return get.recoverEffect(current, player, player) > 0 && get.attitude(player, current) > 2;
				}) > 1 &&
				get.color(card) == "black" &&
				player.countCards("h", { color: "red" }) > 0
			) {
				return 3 - get.value(card);
			}
			return 9 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (target.hp >= target.maxHp || target.hasSkill("new_reqingnang_off")) {
				return false;
			}
			return true;
		},
		content() {
			target.addTempSkill("new_reqingnang_off");
			if (get.color(cards[0]) == "black") {
				player.tempBanSkill("new_reqingnang");
			}
			target.recover();
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (target.hp == 1) {
						return 5;
					}
					if (player == target && player.countCards("h") > player.hp) {
						return 5;
					}
					return 2;
				},
			},
			threaten: 2,
		},
	},
	reyaowu: {
		trigger: { player: "damageBegin3" },
		audio: "new_reyaowu",
		forced: true,
		filter(event) {
			return event.card && (get.color(event.card) != "red" || (event.source && event.source.isIn()));
		},
		content() {
			trigger[get.color(trigger.card) != "red" ? "player" : "source"].draw();
		},
		ai: {
			effect: {
				target: (card, player, target) => {
					if (typeof card !== "object" || !get.tag(card, "damage")) {
						return;
					}
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (get.color(card) === "red") {
						return [1, 0, 1, 0.6];
					}
					return [1, 0.6];
				},
			},
		},
	},
	new_reyaowu: {
		trigger: {
			player: "damageBegin3",
		},
		//priority:1,
		audio: 2,
		audioname: ["sb_huaxiong", "ol_huaxiong"],
		filter(event) {
			return event.card && event.card.name == "sha" && (get.color(event.card) != "red" || (event.source && event.source.isIn()));
		},
		forced: true,
		content() {
			if (get.color(trigger.card) != "red") {
				player.draw();
			} else {
				trigger.source.chooseDrawRecover(true);
			}
		},
		ai: {
			effect: {
				target: (card, player, target, current) => {
					if (card.name == "sha") {
						if (get.color(card) == "red") {
							let num = player.isDamaged() ? 1.6 : 0.7;
							if (get.attitude(player, target) > 0 && player.hp < 3) {
								return [1, 0, 1, num];
							}
							return [1, 0, 1, num / 2];
						}
						return [1, 0.6];
					}
				},
			},
		},
	},
	reguanxing: {
		audio: "guanxing",
		audioname: ["jiangwei", "re_jiangwei", "re_zhugeliang", "ol_jiangwei"],
		audioname2: { gexuan: "guanxing_gexuan" },
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		frequent: true,
		filter(event, player, name) {
			if (name == "phaseJieshuBegin") {
				return player.hasSkill("reguanxing_on");
			}
			return true;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseToGuanxing(game.countPlayer() < 4 ? 3 : 5)
				.set("prompt", "观星：点击或拖动将牌移动到牌堆顶或牌堆底")
				.forResult();
			if ((!result.bool || !result.moved[0].length) && event.triggername == "phaseZhunbeiBegin") {
				player.addTempSkill(["reguanxing_on", "guanxing_fail"]);
			}
		},
		subSkill: {
			on: { charlotte: true },
		},
		ai: {
			guanxing: true,
		},
	},
	reluoshen: {
		audio: 2,
		locked: false,
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		content() {
			"step 0";
			player.addTempSkill("reluoshen_add");
			event.cards = [];
			"step 1";
			var next = player.judge(function (card) {
				if (get.color(card) == "black") {
					return 1.5;
				}
				return -1.5;
			});
			next.judge2 = function (result) {
				return result.bool;
			};
			if (get.mode() != "guozhan" && !player.hasSkillTag("rejudge")) {
				next.set("callback", function () {
					if (event.judgeResult.color == "black" && get.position(card, true) == "o") {
						player.gain(card, "gain2").gaintag.add("reluoshen");
					}
				});
			} else {
				next.set("callback", function () {
					if (event.judgeResult.color == "black") {
						event.getParent().orderingCards.remove(card);
					}
				});
			}
			"step 2";
			if (result.bool) {
				event.cards.push(result.card);
				player.chooseBool("是否再次发动【洛神】？").set("frequentSkill", "reluoshen");
			} else {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.position(event.cards[i], true) != "o") {
						event.cards.splice(i, 1);
						i--;
					}
				}
				if (event.cards.length) {
					player.gain(event.cards, "gain2").gaintag.add("reluoshen");
				}
				event.finish();
			}
			"step 3";
			if (result.bool) {
				event.goto(1);
			} else {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.position(event.cards[i], true) != "o") {
						event.cards.splice(i, 1);
						i--;
					}
				}
				if (event.cards.length) {
					player.gain(event.cards, "gain2").gaintag.add("reluoshen");
				}
			}
		},
		subSkill: {
			add: {
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("reluoshen")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("reluoshen")) {
							return false;
						}
					},
				},
				onremove(player) {
					player.removeGaintag("reluoshen");
				},
			},
		},
	},
	rejieyin: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		usable: 1,
		position: "he",
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		check(card) {
			var player = _status.event.player;
			if (get.position(card) == "e") {
				var subtype = get.subtype(card);
				if (
					!game.hasPlayer(function (current) {
						return current != player && get.attitude(player, current) > 0 && !current.countCards("e", { subtype: subtype });
					})
				) {
					return 0;
				}
				if (player.countCards("h", { subtype: subtype })) {
					return 20 - get.value(card);
				}
				return 10 - get.value(card);
			} else {
				if (player.countCards("e")) {
					return 0;
				}
				if (player.countCards("h", { type: "equip" })) {
					return 0;
				}
				return 8 - get.value(card);
			}
		},
		filterTarget(card, player, target) {
			if (!target.hasSex("male")) {
				return false;
			}
			var card = ui.selected.cards[0];
			if (!card) {
				return false;
			}
			if (get.position(card) == "e" && !target.canEquip(card)) {
				return false;
			}
			return true;
		},
		discard: false,
		delay: false,
		lose: false,
		content() {
			"step 0";
			if (get.position(cards[0]) == "e") {
				event._result = { index: 0 };
			} else if (get.type(cards[0]) != "equip" || !target.canEquip(cards[0])) {
				event._result = { index: 1 };
			} else {
				player.chooseControl().set("choiceList", ["将" + get.translation(cards[0]) + "置入" + get.translation(target) + "的装备区", "弃置" + get.translation(cards[0])]).ai = function () {
					return 1;
				};
			}
			"step 1";
			if (result.index == 0) {
				player.$give(cards, target, false);
				target.equip(cards[0]);
			} else {
				player.discard(cards);
			}
			"step 2";
			if (player.hp > target.hp) {
				player.draw();
				if (target.isDamaged()) {
					target.recover();
				}
			} else if (player.hp < target.hp) {
				target.draw();
				if (player.isDamaged()) {
					player.recover();
				}
			}
		},
		ai: {
			order() {
				var player = _status.event.player;
				var es = player.getCards("e");
				for (var i = 0; i < es.length; i++) {
					if (player.countCards("h", { subtype: get.subtype(es[i]) })) {
						return 10;
					}
				}
				return 2;
			},
			result: {
				player(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					let card = ui.selected.cards[0],
						val = -get.value(card, player) / 6;
					if (get.position(card) == "e") {
						val += 2;
					}
					if (player.hp > target.hp) {
						val++;
					} else if (player.hp < target.hp && player.isDamaged()) {
						val += get.recoverEffect(player, player, player) / get.attitude(player, player);
					}
					return val;
				},
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					let card = ui.selected.cards[0],
						val = get.position(card) == "e" ? get.value(card, target) / 6 : 0;
					if (target.hp > player.hp) {
						val++;
					} else if (target.hp < player.hp && target.isDamaged()) {
						val += get.recoverEffect(target, target, target) / get.attitude(target, target);
					}
					return val;
				},
			},
		},
	},
	rejiuyuan: {
		audio: 2,
		zhuSkill: true,
		trigger: { global: "recoverBefore" },
		direct: true,
		filter(event, player) {
			return player != event.player && event.player.group == "wu" && player.hp <= event.player.hp && event.getParent().name != "rejiuyuan" && player.hasZhuSkill("rejiuyuan", event.player);
		},
		content() {
			"step 0";
			trigger.player.chooseBool("是否对" + get.translation(player) + "发动【救援】？", "改为令其回复1点体力，然后你摸一张牌").set("ai", function () {
				var evt = _status.event;
				return get.attitude(evt.player, evt.getParent().player) > 0;
			});
			"step 1";
			if (result.bool) {
				player.logSkill("rejiuyuan");
				trigger.player.line(player, "green");
				trigger.cancel();
				player.recover(trigger.player);
				trigger.player.draw();
			}
		},
	},
	rezhiheng: {
		audio: 2,
		audioname2: { shen_caopi: "rezhiheng_shen_caopi", new_simayi: "rezhiheng_new_simayi" },
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || get.itemtype(card) !== "card" || get.type(card) !== "equip") {
					return num;
				}
				let eq = player.getEquip(get.subtype(card));
				if (eq && get.equipValue(card) - get.equipValue(eq) < Math.max(1.2, 6 - player.hp)) {
					return 0;
				}
			},
		},
		locked: false,
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard: lib.filter.cardDiscardable,
		discard: false,
		lose: false,
		delay: false,
		selectCard: [1, Infinity],
		check(card) {
			let player = _status.event.player;
			if (
				get.position(card) == "h" &&
				!player.countCards("h", "du") &&
				(player.hp > 2 ||
					!player.countCards("h", i => {
						return get.value(i) >= 8;
					}))
			) {
				return 1;
			}
			if (get.position(card) == "e") {
				let subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) {
					return player.getHp() - get.value(card);
				}
			}
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			player.discard(cards);
			event.num = 1;
			var hs = player.getCards("h");
			if (!hs.length) {
				event.num = 0;
			}
			for (var i = 0; i < hs.length; i++) {
				if (!cards.includes(hs[i])) {
					event.num = 0;
					break;
				}
			}
			"step 1";
			player.draw(event.num + cards.length);
		},
		//group:'rezhiheng_draw',
		subSkill: {
			draw: {
				trigger: { player: "loseEnd" },
				silent: true,
				filter(event, player) {
					if (event.getParent(2).skill != "rezhiheng" && event.getParent(2).skill != "jilue_zhiheng") {
						return false;
					}
					if (player.countCards("h")) {
						return false;
					}
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") {
							return true;
						}
					}
					return false;
				},
				content() {
					player.addTempSkill("rezhiheng_delay", trigger.getParent(2).skill + "After");
				},
			},
			delay: {},
		},
		ai: {
			order(item, player) {
				if (player.hasCard(i => get.value(i) > Math.max(6, 9 - player.hp), "he")) {
					return 1;
				}
				return 10;
			},
			result: {
				player: 1,
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg && arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat().skill.rezhiheng && player.hasCard(card => get.name(card) !== "tao", "h");
				}
			},
			threaten: 1.55,
		},
	},
	rezhiheng_new_simayi: { audio: 1 },
	reqicai: {
		audio: 2,
		mod: {
			targetInRange(card, player, target, now) {
				var type = get.type(card);
				if (type == "trick" || type == "delay") {
					return true;
				}
			},
			canBeDiscarded(card) {
				if (get.position(card) == "e" && get.subtypes(card).some(slot => slot == "equip2" || slot == "equip5")) {
					return false;
				}
			},
		},
	},
	rejizhi: {
		audio: 2,
		audioname2: { lukang: "rejizhi_lukang", new_simayi: "rejizhi_new_simayi" },
		locked: false,
		trigger: { player: "useCard" },
		frequent: true,
		filter(event) {
			return get.type(event.card, "trick") == "trick" && event.card.isCard;
		},
		init(player) {
			player.storage.rejizhi = 0;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			event.card = result[0];
			if (get.type(event.card) == "basic") {
				player
					.chooseBool("是否弃置" + get.translation(event.card) + "并令本回合手牌上限+1？")
					.set("ai", function (evt, player) {
						return _status.currentPhase == player && player.needsToDiscard(-3) && _status.event.value < 6;
					})
					.set("value", get.value(event.card, player));
			}
			"step 2";
			if (result.bool) {
				player.discard(event.card);
				player.storage.rejizhi++;
				if (_status.currentPhase == player) {
					player.markSkill("rejizhi");
				}
			}
		},
		ai: {
			threaten: 1.4,
			noautowuxie: true,
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.storage.rejizhi;
			},
		},
		intro: {
			content: "本回合手牌上限+#",
		},
		group: "rejizhi_clear",
		subSkill: {
			clear: {
				trigger: { global: "phaseAfter" },
				silent: true,
				content() {
					player.storage.rejizhi = 0;
					player.unmarkSkill("rejizhi");
				},
			},
		},
	},
	rejizhi_new_simayi: { audio: 1 },
	rebiyue: {
		audio: 2,
		audioname2: { sp_diaochan: "biyue" },
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		content() {
			player.draw(player.countCards("h") ? 1 : 2);
		},
	},
	rerende: {
		audio: 2,
		audioname: ["gz_jun_liubei"],
		audioname2: { shen_caopi: "rerende_shen_caopi" },
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") && game.hasPlayer(current => get.info("rerende").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			return !player.getStorage("rerende_targeted").includes(target);
		},
		filterCard: true,
		selectCard: [1, Infinity],
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name == "du") {
				return 20;
			}
			var player = get.owner(card);
			if (ui.selected.cards.length >= Math.max(2, player.countCards("h") - player.hp)) {
				return 0;
			}
			if (player.hp == player.maxHp || player.countMark("rerende") < 0 || player.countCards("h") <= 1) {
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
						return 11 - get.value(card);
					}
				}
				if (player.countCards("h") > player.hp) {
					return 10 - get.value(card);
				}
				if (player.countCards("h") > 2) {
					return 6 - get.value(card);
				}
				return -1;
			}
			return 10 - get.value(card);
		},
		async content(event, trigger, player) {
			const { target, cards, name } = event;
			player.addTempSkill(name + "_targeted", "phaseUseAfter");
			player.markAuto(name + "_targeted", [target]);
			let num = 0;
			player.getHistory("lose", evt => {
				if (evt.getParent(2).name == name && evt.getParent("phaseUse") == event.getParent(3)) {
					num += evt.cards.length;
				}
			});
			if (!player.storage[event.name]) {
				player.when({ player: "phaseUseEnd" }).step(async () => {
					player.clearMark(event.name, false);
				});
			}
			player.addMark(event.name, num + cards.length, false);
			await player.give(cards, target);
			const list = get.inpileVCardList(info => {
				return info[0] == "basic" && player.hasUseTarget(new lib.element.VCard({ name: info[2], nature: info[3] }), null, true);
			});
			if (num < 2 && num + cards.length > 1 && list.length) {
				const { result } = await player.chooseButton(["是否视为使用一张基本牌？", [list, "vcard"]]).set("ai", button => {
					return get.player().getUseValue({ name: button.link[2], nature: button.link[3], isCard: true });
				});
				if (!result?.links?.length) {
					return;
				}
				await player.chooseUseTarget(get.autoViewAs({ name: result.links[0][2], nature: result.links[0][3], isCard: true }), true);
			}
		},
		ai: {
			fireAttack: true,
			order(skill, player) {
				if (player.hp < player.maxHp && player.countMark("rerende") < 2 && player.countCards("h") > 1) {
					return 10;
				}
				return 4;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						if (target.hasSkillTag("nodu")) {
							return 0;
						}
						return -10;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					var nh = target.countCards("h");
					var np = player.countCards("h");
					if (player.hp == player.maxHp || player.countMark("rerende") < 0 || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
							return 0;
						}
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
				target_use(card, player, target) {
					if (player == target && get.type(card) == "equip") {
						if (player.countCards("e", { subtype: get.subtype(card) })) {
							if (game.hasPlayer(current => current != player && get.attitude(player, current) > 0)) {
								return 0;
							}
						}
					}
				},
			},
			threaten: 0.8,
		},
		marktext: "仁",
		onremove: true,
		intro: {
			content: "本阶段已仁德牌数：#",
			onunmark: true,
		},
		subSkill: {
			targeted: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	liyu: {
		audio: 2,
		trigger: { source: "damageSource" },
		forced: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name == "sha" && event.player.isIn() && event.player.countGainableCards(player, "he") > 0;
		},
		check() {
			return false;
		},
		content() {
			"step 0";
			trigger.player
				.chooseTarget(function (card, player, target) {
					var evt = _status.event.getParent();
					return evt.player.canUse({ name: "juedou" }, target) && target != _status.event.player;
				}, get.prompt("liyu"))
				.set("ai", function (target) {
					var evt = _status.event.getParent();
					return get.effect(target, { name: "juedou" }, evt.player, _status.event.player) - 2;
				});
			"step 1";
			if (result.bool) {
				player.gainPlayerCard(trigger.player, "he", true);
				event.target = result.targets[0];
				trigger.player.line(player, "green");
			} else {
				event.finish();
			}
			"step 2";
			if (event.target) {
				player.useCard({ name: "juedou", isCard: true }, event.target, "noai");
			}
		},
		ai: {
			halfneg: true,
		},
	},
	/*reqicai:{
		trigger:{player:'equipEnd'},
		frequent:true,
		content:function(){
			player.draw();
		},
		mod:{
			targetInRange:function(card,player,target,now){
				var type=get.type(card);
				if(type=='trick'||type=='delay') return true;
			}
		},
	},*/
	retuxi: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		direct: true,
		filter(event) {
			return event.num > 0;
		},
		content() {
			"step 0";
			player.chooseTarget(
				get.prompt("retuxi"),
				[1, trigger.num],
				function (card, player, target) {
					return target.countCards("h") > 0 && player != target && target.countCards("h") >= player.countCards("h");
				},
				function (target) {
					var att = get.attitude(_status.event.player, target);
					if (target.hasSkill("tuntian")) {
						return att / 10;
					}
					return 1 - att;
				}
			);
			"step 1";
			if (result.bool) {
				player.logSkill("retuxi", result.targets);
				player.gainMultiple(result.targets);
				trigger.num -= result.targets.length;
			} else {
				event.finish();
			}
			"step 2";
			if (trigger.num <= 0) {
				game.delay();
			}
		},
		ai: {
			threaten: 1.6,
			expose: 0.2,
		},
	},
	reguicai: {
		audio: 2,
		audioname: ["new_simayi"],
		trigger: { global: "judge" },
		direct: true,
		filter(event, player) {
			return player.countCards("hes") > 0;
		},
		content() {
			"step 0";
			player
				.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("reguicai"), "hes", function (card) {
					var player = _status.event.player;
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				})
				.set("ai", function (card) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					var judging = _status.event.judging;
					var result = trigger.judge(card) - trigger.judge(judging);
					var attitude = get.attitude(player, trigger.player);
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
				})
				.set("judging", trigger.player.judging[0]);
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "reguicai", "highlight", "noOrdering");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				if (trigger.player.judging[0].clone) {
					trigger.player.judging[0].clone.classList.remove("thrownhighlight");
					game.broadcast(function (card) {
						if (card.clone) {
							card.clone.classList.remove("thrownhighlight");
						}
					}, trigger.player.judging[0]);
					game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
				}
				game.cardsDiscard(trigger.player.judging[0]);
				trigger.player.judging[0] = result.cards[0];
				trigger.orderingCards.addArray(result.cards);
				game.log(trigger.player, "的判定牌改为", result.cards[0]);
				game.delay(2);
			}
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	refankui: {
		audio: 2,
		audioname2: { boss_chujiangwang: "boss_chujiangwang_fankui" },
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.countGainableCards(player, event.source != player ? "he" : "e") && event.num > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.choosePlayerCard(get.prompt(event.skill, trigger.source), trigger.source, trigger.source != player ? "he" : "e")
				.set("ai", button => {
					let val = get.buttonValue(button);
					if (get.event("att") > 0) {
						return 1 - val;
					}
					return val;
				})
				.set("att", get.attitude(player, trigger.source))
				.forResult();
		},
		logTarget: "source",
		getIndex(event, player) {
			return event.num;
		},
		async content(event, trigger, player) {
			await player.gain(event.cards, trigger.source, "giveAuto", "bySelf");
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.countCards("he") > 1 && get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1.5];
						}
						if (get.attitude(target, player) < 0) {
							return [1, 1];
						}
					}
				},
			},
		},
	},
	reluoyi: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		check(event, player) {
			if (player.countCards("h", "sha")) {
				return true;
			}
			return Math.random() < 0.5;
		},
		content() {
			"step 0";
			player.addTempSkill("reluoyi2", { player: "phaseBefore" });
			trigger.changeToZero();
			"step 1";
			event.cards = get.cards(3);
			player.showCards(event.cards, "裸衣");
			"step 2";
			for (var i = 0; i < cards.length; i++) {
				if (get.type(cards[i]) != "basic" && cards[i].name != "juedou" && (get.type(cards[i]) != "equip" || get.subtype(cards[i]) != "equip1")) {
					cards[i].discard();
					cards.splice(i--, 1);
				}
			}
			player.gain(cards, "gain2");
		},
	},
	reluoyi2: {
		trigger: { source: "damageBegin1" },
		sourceSkill: "reluoyi",
		filter(event) {
			return event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.notLink();
		},
		forced: true,
		charlotte: true,
		content() {
			trigger.num++;
		},
		ai: {
			damageBonus: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "damageBonus") {
					return arg && arg.card && (arg.card.name === "sha" || arg.card.name === "juedou");
				}
			},
		},
	},
	reganglie: {
		audio: 2,
		trigger: { player: "damageEnd" },
		getIndex(event, player, triggername) {
			if (get.mode() == "guozhan") {
				return 1;
			}
			return event.num;
		},
		filter(event) {
			return event.source?.isIn() && event.num > 0;
		},
		check(event, player) {
			return get.attitude(player, event.source) <= 0;
		},
		logTarget: "source",
		preHidden: true,
		async content(event, trigger, player) {
			const { source } = trigger;
			const { result } = await player.judge(card => {
				if (get.color(card) == "red") {
					return 1;
				}
				return 0;
			});
			switch (result?.color) {
				case "black":
					if (source.countDiscardableCards(player, "he")) {
						await player.discardPlayerCard(source, "he", true);
					}
					break;

				case "red":
					if (source.isIn()) {
						await source.damage();
					}
					break;
				default:
					break;
			}
		},
		ai: {
			maixie_defend: true,
			expose: 0.4,
		},
	},
	qinxue: {
		skillAnimation: true,
		animationColor: "wood",
		audio: 2,
		juexingji: true,
		derivation: "gongxin",
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		forced: true,
		filter(event, player) {
			if (player.countCards("h") >= player.hp + 2) {
				return true;
			}
			return false;
		},
		content() {
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.chooseDrawRecover(2, true);
			player.addSkills("gongxin");
		},
	},
	qingjian: {
		audio: 2,
		trigger: { player: "gainAfter" },
		direct: true,
		usable: 4,
		filter(event, player) {
			var evt = event.getParent("phaseDraw");
			if (evt && evt.player == player) {
				return false;
			}
			return event.getg(player).length > 0;
		},
		content() {
			"step 0";
			event.cards = trigger.getg(player);
			"step 1";
			player.chooseCardTarget({
				filterCard(card) {
					return _status.event.getParent().cards.includes(card);
				},
				selectCard: [1, event.cards.length],
				filterTarget(card, player, target) {
					return player != target;
				},
				ai1(card) {
					if (ui.selected.cards.length > 0) {
						return -1;
					}
					if (card.name == "du") {
						return 20;
					}
					return _status.event.player.countCards("h") - _status.event.player.hp;
				},
				ai2(target) {
					var att = get.attitude(_status.event.player, target);
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						if (target.hasSkillTag("nodu")) {
							return 0;
						}
						return 1 - att;
					}
					if (target.countCards("h") > _status.event.player.countCards("h")) {
						return 0;
					}
					return att - 4;
				},
				prompt: "请选择要送人的卡牌",
			});
			"step 2";
			if (result.bool) {
				player.storage.qingjian++;
				player.logSkill("qingjian", result.targets);
				result.targets[0].gain(result.cards, player, "give");
				for (var i = 0; i < result.cards.length; i++) {
					event.cards.remove(result.cards[i]);
				}
				if (event.cards.length) {
					event.goto(1);
				}
			} else {
				player.storage.counttrigger.qingjian--;
			}
		},
		ai: {
			expose: 0.3,
		},
	},
	reyingzi: {
		audio: 2,
		audioname: ["sunce", "re_sunben", "re_sunce"],
		audioname2: {
			gexuan: "reyingzi_gexuan",
			re_sunyi: "reyingzi_re_sunyi",
			heqi: "reyingzi_heqi",
			re_heqi: "reyingzi_heqi",
			boss_sunce: "reyingzi_sunce",
		},
		trigger: { player: "phaseDrawBegin2" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			trigger.num++;
		},
		ai: {
			threaten: 1.5,
		},
		mod: {
			maxHandcardBase(player, num) {
				return player.maxHp;
			},
		},
	},
	refanjian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return player != target;
		},
		filterCard: true,
		check(card) {
			return 8 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			target.storage.refanjian = cards[0];
			player.give(cards[0], target);
			"step 1";
			var suit = get.suit(target.storage.refanjian);
			if (!target.countCards("h")) {
				event._result = { control: "refanjian_hp" };
			} else {
				target.chooseControl("refanjian_card", "refanjian_hp").ai = function (event, player) {
					var cards = player.getCards("he", { suit: get.suit(player.storage.refanjian) });
					if (cards.length == 1) {
						return 0;
					}
					if (cards.length >= 2) {
						for (var i = 0; i < cards.length; i++) {
							if (get.tag(cards[i], "save")) {
								return 1;
							}
						}
					}
					if (player.hp == 1) {
						return 0;
					}
					for (var i = 0; i < cards.length; i++) {
						if (get.value(cards[i]) >= 8) {
							return 1;
						}
					}
					if (cards.length > 2 && player.hp > 2) {
						return 1;
					}
					if (cards.length > 3) {
						return 1;
					}
					return 0;
				};
			}
			"step 2";
			if (result.control == "refanjian_card") {
				target.showHandcards();
			} else {
				target.loseHp();
				event.finish();
			}
			"step 3";
			var suit = get.suit(target.storage.refanjian);
			target.discard(
				target.getCards("he", function (i) {
					return get.suit(i) == suit && lib.filter.cardDiscardable(i, target, "refanjian");
				})
			);
			delete target.storage.refanjian;
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return -target.countCards("he") - (player.countCards("h", "du") ? 1 : 0);
				},
			},
			threaten: 2,
		},
	},
	reqianxun: {
		audio: 2,
		trigger: {
			target: "useCardToBegin",
			player: "judgeBefore",
		},
		filter(event, player) {
			if (player.countCards("h") == 0) {
				return false;
			}
			if (event.getParent().name == "phaseJudge") {
				return true;
			}
			if (event.name == "judge") {
				return false;
			}
			if (event.targets && event.targets.length > 1) {
				return false;
			}
			if (event.card && get.type(event.card) == "trick" && event.player != player) {
				return true;
			}
		},
		content() {
			var cards = player.getCards("h");
			player.addToExpansion(cards, "giveAuto", player).gaintag.add("reqianxun2");
			player.addSkill("reqianxun2");
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player == target || !target.hasFriend()) {
						return;
					}
					var type = get.type(card);
					var nh = Math.min(
						target.countCards(),
						game.countPlayer(i => get.attitude(target, i) > 0)
					);
					if (type == "trick") {
						if (!get.tag(card, "multitarget") || get.info(card).singleCard) {
							if (get.tag(card, "damage")) {
								return [1.5, nh - 1];
							}
							return [1, nh];
						}
					} else if (type == "delay") {
						return [0.5, 0.5];
					}
				},
			},
		},
	},
	reqianxun2: {
		trigger: { global: "phaseEnd" },
		forced: true,
		audio: false,
		sourceSkill: "reqianxun",
		content() {
			var cards = player.getExpansions("reqianxun2");
			if (cards.length) {
				player.gain(cards, "draw");
			}
			player.removeSkill("reqianxun2");
		},
		intro: {
			mark(dialog, storage, player) {
				var cards = player.getExpansions("reqianxun2");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
			markcount: "expansion",
		},
	},
	relianying: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		direct: true,
		filter(event, player) {
			if (player.countCards("h")) {
				return false;
			}
			var evt = event.getl(player);
			return evt && evt.hs && evt.hs.length;
		},
		content() {
			"step 0";
			var num = trigger.getl(player).hs.length;
			player.chooseTarget(get.prompt("relianying"), "令至多" + get.cnNumber(num) + "名角色各摸一张牌", [1, num]).ai = function (target) {
				var player = _status.event.player;
				if (player == target) {
					return get.attitude(player, target) + 10;
				}
				return get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("relianying", result.targets);
				game.asyncDraw(result.targets);
			} else {
				event.finish();
			}
			"step 2";
			game.delay();
		},
		ai: {
			threaten: 0.8,
			effect: {
				player_use(card, player, target) {
					if (player.countCards("h") === 1) {
						return [1, 0.8];
					}
				},
				target(card, player, target) {
					if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
						return 0.5;
					}
				},
			},
			noh: true,
		},
	},
	retishen: {
		audio: 2,
		skillAnimation: true,
		animationColor: "soil",
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			if (typeof player.storage.retishen2 == "number") {
				return player.hp < player.storage.retishen2;
			}
			return false;
		},
		check(event, player) {
			if (player.hp <= 1) {
				return true;
			}
			return player.hp < player.storage.retishen2 - 1;
		},
		content() {
			player.awakenSkill(event.name);
			player.recover(player.storage.retishen2 - player.hp);
			player.draw(player.storage.retishen2 - player.hp);
		},
		intro: {
			mark(dialog, content, player) {
				if (player.storage.retishen) {
					return;
				}
				if (typeof player.storage.retishen2 != "number") {
					return "上回合体力：无";
				}
				return "上回合体力：" + player.storage.retishen2;
			},
			content: "limited",
		},
		group: ["retishen2"],
	},
	retishen2: {
		trigger: { player: "phaseJieshuBegin" },
		priority: -10,
		silent: true,
		sourceSkill: "retishen",
		content() {
			player.storage.retishen2 = player.hp;
			game.broadcast(function (player) {
				player.storage.retishen2 = player.hp;
			}, player);
			game.addVideo("storage", player, ["retishen2", player.storage.retishen2]);
		},
		intro: {
			content(storage, player) {
				if (player.storage.retishen) {
					return;
				}
				return "上回合体力：" + storage;
			},
		},
	},
	reyajiao: {
		audio: 2,
		trigger: { player: ["respond", "useCard"] },
		frequent: true,
		filter(event, player) {
			return player != _status.currentPhase && get.itemtype(event.cards) == "cards";
		},
		content() {
			"step 0";
			event.card = get.cards()[0];
			game.broadcast(function (card) {
				ui.arena.classList.add("thrownhighlight");
				card.copy("thrown", "center", "thrownhighlight", ui.arena).addTempClass("start");
			}, event.card);
			event.node = event.card.copy("thrown", "center", "thrownhighlight", ui.arena).addTempClass("start");
			ui.arena.classList.add("thrownhighlight");
			game.addVideo("thrownhighlight1");
			game.addVideo("centernode", null, get.cardInfo(event.card));
			if (get.type(event.card, "trick") == get.type(trigger.card, "trick")) {
				player
					.chooseTarget("选择获得此牌的角色")
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (_status.event.du) {
							if (target.hasSkillTag("nodu")) {
								return 0;
							}
							return -att;
						}
						if (att > 0) {
							return att + Math.max(0, 5 - target.countCards("h"));
						}
						return att;
					})
					.set("du", event.card.name == "du");
			} else {
				player.chooseBool("是否弃置" + get.translation(event.card) + "？");
				event.disbool = true;
			}
			game.delay(2);
			"step 1";
			if (event.disbool) {
				if (!result.bool) {
					game.log(player, "展示了", event.card);
					ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
				} else {
					game.log(player, "展示并弃掉了", event.card);
					event.card.discard();
				}
				game.addVideo("deletenode", player, [get.cardInfo(event.node)]);
				event.node.delete();
				game.broadcast(function (card) {
					ui.arena.classList.remove("thrownhighlight");
					if (card.clone) {
						card.clone.delete();
					}
				}, event.card);
			} else if (result.targets) {
				player.line(result.targets, "green");
				result.targets[0].gain(event.card, "log");
				event.node.moveDelete(result.targets[0]);
				game.addVideo("gain2", result.targets[0], [get.cardInfo(event.node)]);
				game.broadcast(
					function (card, target) {
						ui.arena.classList.remove("thrownhighlight");
						if (card.clone) {
							card.clone.moveDelete(target);
						}
					},
					event.card,
					result.targets[0]
				);
			} else {
				game.log(player, "展示并弃掉了", event.card);
				event.card.discard();
				game.addVideo("deletenode", player, [get.cardInfo(event.node)]);
				event.node.delete();
				game.broadcast(function (card) {
					ui.arena.classList.remove("thrownhighlight");
					if (card.clone) {
						card.clone.delete();
					}
				}, event.card);
			}
			game.addVideo("thrownhighlight2");
			ui.arena.classList.remove("thrownhighlight");
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "respond") && target.countCards("h") > 1) {
						return [1, 0.2];
					}
				},
			},
		},
	},
	rejianxiong: {
		audio: 2,
		audioname: ["shen_caopi"],
		audioname2: { caoteng: "rejianxiong_caoteng" },
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
		},
		content() {
			player.gain(trigger.cards);
			player.$gain2(trigger.cards);
			player.draw();
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage")) {
						return [1, 0.55];
					}
				},
			},
		},
	},
	rejianxiong_old: {
		audio: "rejianxiong",
		audioname2: {
			gz_caocao: "jianxiong",
		},
		trigger: { player: "damageEnd" },
		async cost(event, trigger, player) {
			let list = ["摸牌"];
			if (get.itemtype(trigger.cards) == "cards" && trigger.cards.filterInD().length) {
				list.push("拿牌");
			}
			list.push("cancel2");
			const {
				result: { control },
			} = await player
				.chooseControl(list)
				.set("prompt", get.prompt2(event.skill))
				.set("ai", () => {
					const player = get.event("player"),
						trigger = get.event().getTrigger();
					const cards = trigger.cards ? trigger.cards.filterInD() : [];
					if (get.event().controls.includes("拿牌")) {
						if (
							cards.reduce((sum, card) => {
								return sum + (card.name == "du" ? -1 : 1);
							}, 0) > 1 ||
							player.getUseValue(cards[0]) > 6
						) {
							return "拿牌";
						}
					}
					return "摸牌";
				});
			event.result = { bool: control != "cancel2", cost_data: control };
		},
		async content(event, trigger, player) {
			if (event.cost_data == "摸牌") {
				await player.draw();
			} else {
				await player.gain(trigger.cards.filterInD(), "gain2");
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage") && player != target) {
						return [1, 0.6];
					}
				},
			},
		},
	},
	reyiji: {
		audio: 2,
		audioname: ["yj_sb_guojia", "yj_sb_guojia_shadow"],
		trigger: { player: "damageEnd" },
		frequent: true,
		filter(event) {
			return event.num > 0;
		},
		content() {
			"step 0";
			event.num = 1;
			event.count = 1;
			"step 1";
			player.gain(get.cards(2));
			player.$draw(2);
			"step 2";
			player.chooseCardTarget({
				filterCard: true,
				selectCard: [1, 2],
				filterTarget(card, player, target) {
					return player != target && target != event.temp;
				},
				ai1(card) {
					if (ui.selected.cards.length > 0) {
						return -1;
					}
					if (card.name == "du") {
						return 20;
					}
					return _status.event.player.countCards("h") - _status.event.player.hp;
				},
				ai2(target) {
					var att = get.attitude(_status.event.player, target);
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						if (target.hasSkillTag("nodu")) {
							return 0;
						}
						return 1 - att;
					}
					return att - 4;
				},
				prompt: "请选择要送人的卡牌",
			});
			"step 3";
			if (result.bool) {
				player.lose(result.cards, ui.special, "toStorage");
				if (result.targets[0].hasSkill("reyiji2")) {
					result.targets[0].storage.reyiji2 = result.targets[0].storage.reyiji2.concat(result.cards);
				} else {
					result.targets[0].addSkill("reyiji2");
					result.targets[0].storage.reyiji2 = result.cards;
				}
				player.$give(result.cards.length, result.targets[0], false);
				player.line(result.targets, "green");
				game.addVideo("storage", result.targets[0], ["reyiji2", get.cardsInfo(result.targets[0].storage.reyiji2), "cards"]);
				if (num == 1) {
					event.temp = result.targets[0];
					event.num++;
					event.goto(2);
				} else if (event.count < trigger.num) {
					delete event.temp;
					event.num = 1;
					event.count++;
					event.goto(1);
				}
			} else if (event.count < trigger.num) {
				delete event.temp;
				event.num = 1;
				event.count++;
				event.goto(1);
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						var num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) {
								num = 0.7;
							} else {
								num = 0.5;
							}
						}
						if (player.hp >= 4) {
							return [1, num * 2];
						}
						if (target.hp == 3) {
							return [1, num * 1.5];
						}
						if (target.hp == 2) {
							return [1, num * 0.5];
						}
					}
				},
			},
			threaten: 0.6,
		},
	},
	reyiji2: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		mark: true,
		popup: "遗计拿牌",
		audio: false,
		sourceSkill: "reyiji",
		content() {
			player.$draw(player.storage.reyiji2.length);
			player.gain(player.storage.reyiji2, "fromStorage");
			delete player.storage.reyiji2;
			player.removeSkill("reyiji2");
			game.delay();
		},
		intro: {
			content: "cardCount",
		},
	},
	yijue: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target && target.countCards("h");
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseToCompare(target).set("small", true);
			"step 1";
			if (result.bool) {
				if (!target.hasSkill("fengyin")) {
					target.addTempSkill("fengyin");
				}
				target.addTempSkill("yijue2");
				event.finish();
			} else if (target.hp < target.maxHp) {
				player.chooseBool("是否让目标回复1点体力？").ai = function (event, player) {
					return get.recoverEffect(target, player, player) > 0;
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				target.recover();
			}
		},
		ai: {
			result: {
				target(player, target) {
					var hs = player.getCards("h");
					if (hs.length < 3) {
						return 0;
					}
					var bool = false;
					for (var i = 0; i < hs.length; i++) {
						if (get.number(hs[i]) >= 9 && get.value(hs[i]) < 7) {
							bool = true;
							break;
						}
					}
					if (!bool) {
						return 0;
					}
					if (target.countCards("h") > target.hp + 1 && get.recoverEffect(target) > 0) {
						return 1;
					}
					if (player.canUse("sha", target) && (player.countCards("h", "sha") || player.countCards("he", { color: "red" }))) {
						return -2;
					}
					return -0.5;
				},
			},
			order: 9,
		},
	},
	yijue2: {
		charlotte: true,
		mark: true,
		mod: {
			cardEnabled2(card) {
				if (get.position(card) == "h") {
					return false;
				}
			},
		},
		intro: { content: "不能使用或打出手牌" },
	},
	retieji: {
		audio: 2,
		audioname: ["boss_lvbu3"],
		trigger: { player: "useCardToPlayered" },
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		logTarget: "target",
		content() {
			"step 0";
			player.judge(function () {
				return 0;
			});
			if (!trigger.target.hasSkill("fengyin")) {
				trigger.target.addTempSkill("fengyin");
			}
			"step 1";
			var suit = result.suit;
			var target = trigger.target;
			var num = target.countCards("h", "shan");
			target
				.chooseToDiscard("请弃置一张" + get.translation(suit) + "牌，否则不能使用闪抵消此杀", "he", function (card) {
					return get.suit(card) == _status.event.suit;
				})
				.set("ai", function (card) {
					var num = _status.event.num;
					if (num == 0) {
						return 0;
					}
					if (card.name == "shan") {
						return num > 1 ? 2 : 0;
					}
					return 8 - get.value(card);
				})
				.set("num", num)
				.set("suit", suit);
			"step 2";
			if (!result.bool) {
				trigger.getParent().directHit.add(trigger.target);
			}
		},
		ai: {
			ignoreSkill: true,
			skillTagFilter(player, tag, arg) {
				if (tag == "directHit_ai") {
					return arg?.target && get.attitude(player, arg.target) <= 0;
				}
				if (!arg || arg.isLink || !arg.card || arg.card.name != "sha") {
					return false;
				}
				if (!arg.target || get.attitude(player, arg.target) >= 0) {
					return false;
				}
				if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || lib.skill[arg.skill].persevereSkill || get.is.locked(arg.skill) || !arg.target.getSkills(true, false).includes(arg.skill)) {
					return false;
				}
			},
			directHit_ai: true,
		},
	},
	reyicong: {
		trigger: {
			player: ["changeHp"],
		},
		audio: 2,
		audioname2: { gongsunzan: "yicong" },
		forced: true,
		filter(event, player) {
			return get.sgn(player.hp - 2.5) != get.sgn(player.hp - 2.5 - event.num);
		},
		content() {},
		mod: {
			globalFrom(from, to, current) {
				return current - 1;
			},
			globalTo(from, to, current) {
				if (to.hp <= 2) {
					return current + 1;
				}
			},
		},
		ai: {
			threaten: 0.8,
		},
	},
	reqiaomeng: {
		audio: "qiaomeng",
		trigger: { source: "damageSource" },
		direct: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name == "sha" && event.player.countDiscardableCards(player, "hej");
		},
		content() {
			"step 0";
			player.discardPlayerCard(get.prompt("reqiaomeng", trigger.player), "hej", trigger.player).set("logSkill", ["reqiaomeng", trigger.player]);
			"step 1";
			if (result.bool) {
				var card = result.cards[0];
				if (get.position(card) == "d") {
					if (get.subtype(card) == "equip3" || get.subtype(card) == "equip4" || get.subtype(card) == "equip6") {
						player.gain(card, player, "gain2");
					}
				}
			}
		},
	},
	qiaomeng: {
		audio: 2,
		audioname: ["xin_gongsunzan"],
		trigger: { source: "damageSource" },
		direct: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name == "sha" && event.cards && get.color(event.cards) == "black" && event.player.countDiscardableCards(player, "e");
		},
		content() {
			"step 0";
			player.discardPlayerCard(get.prompt("qiaomeng", trigger.player), "e", trigger.player).set("logSkill", ["qiaomeng", trigger.player]);
			"step 1";
			if (result.bool) {
				var card = result.cards[0];
				if (get.position(card) == "d") {
					if (get.subtype(card) == "equip3" || get.subtype(card) == "equip4" || get.subtype(card) == "equip6") {
						player.gain(card, player, "gain2");
					}
				}
			}
		},
	},
	rekurou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: lib.filter.cardDiscardable,
		check(card) {
			return 8 - get.value(card);
		},
		position: "he",
		content() {
			player.loseHp();
		},
		ai: {
			order: 8,
			result: {
				player(player) {
					return get.effect(player, { name: "losehp" }, player, player);
				},
			},
			neg: true,
		},
	},
	zhaxiang: {
		audio: 2,
		audioname2: { ol_sb_jiangwei: "zhaxiang_ol_sb_jiangwei" },
		trigger: { player: "loseHpEnd" },
		filter(event, player) {
			return player.isIn() && event.num > 0;
		},
		getIndex: event => event.num,
		forced: true,
		async content(event, trigger, player) {
			await player.draw(3);
			if (player.isPhaseUsing()) {
				player.addTempSkill(event.name + "_effect");
				player.addMark(event.name + "_effect", 1, false);
			}
		},
		subSkill: {
			effect: {
				mod: {
					targetInRange(card, player, target, now) {
						if (card.name == "sha" && get.color(card) == "red") {
							return true;
						}
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("zhaxiang_effect");
						}
					},
				},
				charlotte: true,
				onremove: true,
				audio: "zhaxiang",
				audioname2: { ol_sb_jiangwei: "zhaxiang_ol_sb_jiangwei" },
				trigger: { player: "useCard" },
				sourceSkill: "zhaxiang",
				filter(event, player) {
					return event.card?.name == "sha" && get.color(event.card) == "red";
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
				},
				intro: { content: "<li>使用【杀】的次数上限+#<br><li>使用红色【杀】无距离限制且不能被【闪】响应" },
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return arg?.card?.name == "sha" && get.color(arg.card) == "red";
					},
				},
			},
		},
		ai: {
			maihp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, 1];
						}
						return 1.2;
					}
					if (get.tag(card, "loseHp")) {
						if (target.hp <= 1) {
							return;
						}
						var using = target.isPhaseUsing();
						if (target.hp <= 2) {
							return [1, player.countCards("h") <= 1 && using ? 3 : 0];
						}
						if (using && target.countCards("h", { name: "sha", color: "red" })) {
							return [1, 3];
						}
						return [1, target.countCards("h") <= target.hp || (using && game.hasPlayer(current => current != player && get.attitude(player, current) < 0 && player.inRange(current))) ? 3 : 2];
					}
				},
			},
		},
	},
	zhuhai: {
		audio: 2,
		audioname: ["gz_re_xushu"],
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return event.player.isIn() && event.player.getStat("damage") && lib.filter.targetEnabled({ name: "sha" }, player, event.player) && (player.hasSha() || (_status.connectMode && player.countCards("h") > 0));
		},
		clearTime: true,
		content() {
			player
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, "诛害：是否对" + get.translation(trigger.player) + "使用一张杀？")
				.set("logSkill", "zhuhai")
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", trigger.player);
		},
	},
	qianxin: {
		skillAnimation: true,
		animationColor: "orange",
		audio: 2,
		juexingji: true,
		trigger: { source: "damageSource" },
		forced: true,
		derivation: "jianyan",
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		content() {
			player.awakenSkill(event.name);
			player.addSkills("jianyan");
			player.loseMaxHp();
		},
	},
	jianyan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		delay: false,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.hasSex("male");
			});
		},
		content() {
			"step 0";
			player.chooseControl(["red", "black", "basic", "trick", "equip"]).set("ai", function () {
				var player = _status.event.player;
				if (!player.hasShan()) {
					return "basic";
				}
				if (player.countCards("e") <= 1) {
					return "equip";
				}
				if (player.countCards("h") > 2) {
					return "trick";
				}
				return "red";
			});
			"step 1";
			event.card = get.cardPile(
				function (card) {
					if (get.color(card) == result.control) {
						return true;
					}
					if (get.type(card, "trick") == result.control) {
						return true;
					}
					return false;
				},
				"cardPile",
				"top"
			);
			if (!event.card) {
				event.finish();
				return;
			}
			player.showCards([event.card]);
			"step 2";
			player
				.chooseTarget(true, "选择一名男性角色送出" + get.translation(event.card), function (card, player, target) {
					return target.hasSex("male");
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (_status.event.neg) {
						return -att;
					}
					return att;
				})
				.set("neg", get.value(event.card, player, "raw") < 0);
			"step 3";
			player.line(result.targets, "green");
			result.targets[0].gain(event.card, "gain2");
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (
						game.hasPlayer(function (current) {
							return current.hasSex("male") && get.attitude(player, current) > 0;
						})
					) {
						return 2;
					}
					return 0;
				},
			},
			threaten: 1.2,
		},
	},
	reguose: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		discard: false,
		lose: false,
		delay: false,
		filter(event, player) {
			return player.countCards("hes", { suit: "diamond" }) > 0;
		},
		position: "hes",
		filterCard: { suit: "diamond" },
		filterTarget(card, player, target) {
			if (get.position(ui.selected.cards[0]) != "s" && lib.filter.cardDiscardable(ui.selected.cards[0], player, "reguose") && target.hasJudge("lebu")) {
				return true;
			}
			if (player == target) {
				return false;
			}
			if (!game.checkMod(ui.selected.cards[0], player, "unchanged", "cardEnabled2", player)) {
				return false;
			}
			return player.canUse({ name: "lebu", cards: ui.selected.cards }, target);
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			if (target.hasJudge("lebu")) {
				player.discard(cards);
				target.discard(target.getJudge("lebu"));
			} else {
				player.useCard({ name: "lebu" }, target, cards).audio = false;
			}
			player.draw();
		},
		ai: {
			result: {
				target(player, target) {
					if (target.hasJudge("lebu")) {
						return -get.effect(target, { name: "lebu" }, player, target);
					}
					return get.effect(target, { name: "lebu" }, player, target);
				},
			},
			order: 9,
		},
	},
	fenwei: {
		skillAnimation: true,
		animationColor: "wood",
		audio: 2,
		audioname2: { heqi: "fenwei_heqi" },
		limited: true,
		trigger: { global: "useCardToPlayered" },
		//priority:5,
		filter(event, player) {
			if (event.getParent().triggeredTargets3.length > 1) {
				return false;
			}
			if (get.type(event.card) != "trick") {
				return false;
			}
			if (get.info(event.card).multitarget) {
				return false;
			}
			if (event.targets.length < 2) {
				return false;
			}
			if (player.storage.fenwei) {
				return false;
			}
			return true;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("fenwei"), [1, trigger.targets.length], function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					if (game.phaseNumber > game.players.length * 2 && trigger.targets.length >= game.players.length - 1 && !trigger.excluded.includes(target)) {
						return -get.effect(target, trigger.card, trigger.player, _status.event.player);
					}
					return -1;
				})
				.set("targets", trigger.targets);
			"step 1";
			if (result.bool) {
				player.awakenSkill(event.name);
				player.logSkill("fenwei", result.targets);
				player.storage.fenwei = true;
				trigger.getParent().excluded.addArray(result.targets);
				game.delay();
			}
		},
	},
	chulao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			if (target.group == "unknown") {
				return false;
			}
			for (var i = 0; i < ui.selected.targets.length; i++) {
				if (ui.selected.targets[i].group == target.group) {
					return false;
				}
			}
			return target.countCards("he") > 0;
		},
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard: true,
		position: "he",
		selectTarget: [1, Infinity],
		check(card) {
			if (get.suit(card) == "spade") {
				return 8 - get.value(card);
			}
			return 5 - get.value(card);
		},
		content() {
			"step 0";
			if (num == 0 && get.suit(cards[0]) == "spade") {
				player.draw();
			}
			player.choosePlayerCard(targets[num], "he", true);
			"step 1";
			if (result.bool) {
				if (result.links.length) {
					targets[num].discard(result.links[0]);
				}
				if (get.suit(result.links[0]) == "spade") {
					targets[num].draw();
				}
			}
		},
		ai: {
			result: {
				target: -1,
			},
			threaten: 1.2,
			order: 3,
		},
	},
	xunxun: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		preHidden: true,
		content() {
			"step 0";
			var cards = get.cards(4);
			game.cardsGotoOrdering(cards);
			var next = player.chooseToMove("恂恂：将两张牌置于牌堆顶", true);
			next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
			next.set("filterMove", function (from, to, moved) {
				if (to == 1 && moved[1].length >= 2) {
					return false;
				}
				return true;
			});
			next.set("filterOk", function (moved) {
				return moved[1].length == 2;
			});
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0).sort(function (a, b) {
					return get.value(b) - get.value(a);
				});
				return [cards, cards.splice(2)];
			});
			"step 1";
			var top = result.moved[0];
			var bottom = result.moved[1];
			top.reverse();
			for (var i = 0; i < top.length; i++) {
				ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
			}
			for (i = 0; i < bottom.length; i++) {
				ui.cardPile.appendChild(bottom[i]);
			}
			game.updateRoundNumber();
			game.delayx();
		},
	},
	wangxi: {
		audio: 2,
		trigger: { player: "damageEnd", source: "damageSource" },
		getIndex: event => event.num,
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.num && event.source?.isIn() && event.player?.isIn() && event.source != event.player;
		},
		check(event, player) {
			if (player.isPhaseUsing()) {
				return true;
			}
			if (event.player == player) {
				return get.attitude(player, event.source) > -3;
			}
			return get.attitude(player, event.player) > -3;
		},
		logTarget(event, player) {
			if (event.player == player) {
				return event.source;
			}
			return event.player;
		},
		preHidden: true,
		async content(event, trigger, player) {
			await game.asyncDraw([trigger.player, trigger.source].sortBySeat());
		},
		ai: {
			maixie: true,
			maixie_hp: true,
		},
	},
	refangquan: {
		audio: 2,
		trigger: { player: "phaseUseBefore" },
		filter(event, player) {
			return player.countCards("h") > 0 && !player.hasSkill("fangquan3");
		},
		direct: true,
		content() {
			"step 0";
			var fang = player.countMark("fangquan2") == 0 && player.hp >= 2 && player.countCards("h") <= player.maxHp + 1;
			player
				.chooseBool(get.prompt2("refangquan"))
				.set("ai", function () {
					if (!_status.event.fang) {
						return false;
					}
					return game.hasPlayer(function (target) {
						if (target.hasJudge("lebu") || target == player) {
							return false;
						}
						if (get.attitude(player, target) > 4) {
							return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
						}
						return false;
					});
				})
				.set("fang", fang);
			"step 1";
			if (result.bool) {
				player.logSkill("refangquan");
				trigger.cancel();
				player.addTempSkill("fangquan2", "phaseAfter");
				player.addMark("fangquan2", 1, false);
				player.addTempSkill("refangquan2");
				//player.storage.fangquan=result.targets[0];
			}
		},
	},
	refangquan2: {
		mod: {
			maxHandcardBase(player, num) {
				return player.maxHp;
			},
		},
	},
	rehunzi: {
		inherit: "hunzi",
		filter(event, player) {
			return player.hp <= 2 && !player.storage.rehunzi;
		},
		ai: {
			threaten(player, target) {
				if (target.hp <= 2) {
					return 2;
				}
				return 0.5;
			},
			maixie: true,
			effect: {
				target(card, player, target) {
					if (!target.hasFriend()) {
						return;
					}
					if (target.hp === 3 && get.tag(card, "damage") == 1 && !target.isTurnedOver() && _status.currentPhase != target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
						return [0.5, 1];
					}
					if (target.hp === 1 && get.tag(card, "recover") && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
						return [1, -3];
					}
				},
			},
		},
	},
	rezhijian: {
		inherit: "zhijian",
		group: ["rezhijian_use"],
		subfrequent: ["use"],
		subSkill: {
			use: {
				audio: "rezhijian",
				trigger: { player: "useCard" },
				frequent: true,
				filter(event, player) {
					return get.type(event.card) == "equip";
				},
				prompt: "是否发动【直谏】摸一张牌？",
				content() {
					player.draw("nodelay");
				},
			},
		},
	},
	retuntian: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player) {
			if (player == _status.currentPhase) {
				return false;
			}
			if (event.name == "gain" && event.player == player) {
				return false;
			}
			var evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.length > 0;
		},
		content() {
			player.judge(function (card) {
				return 1;
			}).callback = lib.skill.retuntian.callback;
		},
		callback() {
			"step 0";
			if (event.judgeResult.suit == "heart") {
				player.gain(card, "gain2");
				event.finish();
			} else if (get.mode() == "guozhan") {
				player.chooseBool("是否将" + get.translation(card) + "作为“田”置于武将牌上？").set("frequentSkill", "retuntian").ai = function () {
					return true;
				};
			} else {
				event.directbool = true;
			}
			"step 1";
			if (!result.bool && !event.directbool) {
				//game.cardsDiscard(card);
				return;
			}
			player.addToExpansion(card, "gain2").gaintag.add("tuntian");
		},
		group: "tuntian_dist",
		locked: false,
		ai: {
			effect: {
				target() {
					return lib.skill.tuntian.ai.effect.target.apply(this, arguments);
				},
			},
			threaten(player, target) {
				if (target.countCards("h") == 0) {
					return 2;
				}
				return 0.5;
			},
			nodiscard: true,
			nolose: true,
			notemp: true,
		},
	},
	rebeige: {
		audio: "beige",
		audioname: ["re_caiwenji"],
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.source && event.player.classList.contains("dead") == false && player.countCards("he");
		},
		direct: true,
		checkx(event, player) {
			var att1 = get.attitude(player, event.player);
			var att2 = get.attitude(player, event.source);
			return att1 > 0 && att2 <= 0;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", get.prompt2("rebeige", trigger.player));
			var check = lib.skill.beige.checkx(trigger, player);
			next.set("ai", function (card) {
				if (_status.event.goon) {
					return 8 - get.value(card);
				}
				return 0;
			});
			next.set("logSkill", "rebeige");
			next.set("goon", check);
			"step 1";
			if (result.bool) {
				trigger.player.judge();
			} else {
				event.finish();
			}
			"step 2";
			switch (result.suit) {
				case "heart":
					trigger.player.recover(trigger.num);
					break;
				case "diamond":
					trigger.player.draw(3);
					break;
				case "club":
					trigger.source.chooseToDiscard("he", 2, true);
					break;
				case "spade":
					trigger.source.turnOver();
					break;
			}
		},
		ai: {
			expose: 0.3,
		},
	},
	rexingshang: {
		audio: 2,
		audioname2: { caoying: "lingren_xingshang" },
		trigger: { global: "die" },
		filter(event, player) {
			return player.isDamaged() || event.player.countCards("he") > 0;
		},
		direct: true,
		content() {
			"step 0";
			var choice = [];
			if (player.isDamaged()) {
				choice.push("回复体力");
			}
			if (trigger.player.countCards("he")) {
				choice.push("获得牌");
			}
			choice.push("cancel2");
			player
				.chooseControl(choice)
				.set("prompt", get.prompt2("rexingshang"))
				.set("ai", function () {
					if (choice.length == 2) {
						return 0;
					}
					if (get.value(trigger.player.getCards("he")) > 8) {
						return 1;
					}
					return 0;
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill(event.name, trigger.player);
				if (result.control == "获得牌") {
					event.togain = trigger.player.getCards("he");
					player.gain(event.togain, trigger.player, "giveAuto", "bySelf");
				} else {
					player.recover();
				}
			}
		},
	},
	refangzhu: {
		audio: 2,
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("refangzhu"), function (card, player, target) {
				return player != target;
			}).ai = function (target) {
				if (target.hasSkillTag("noturn")) {
					return 0;
				}
				var player = _status.event.player;
				if (get.attitude(_status.event.player, target) == 0) {
					return 0;
				}
				if (get.attitude(_status.event.player, target) > 0) {
					if (target.classList.contains("turnedover")) {
						return 1000 - target.countCards("h");
					}
					if (player.getDamagedHp() < 3) {
						return -1;
					}
					return 100 - target.countCards("h");
				} else {
					if (target.classList.contains("turnedover")) {
						return -1;
					}
					if (player.getDamagedHp() >= 3) {
						return -1;
					}
					return 1 + target.countCards("h");
				}
			};
			"step 1";
			if (result.bool) {
				player.logSkill("refangzhu", result.targets);
				event.target = result.targets[0];
				if (player.isHealthy()) {
					event._result = { bool: false };
				} else {
					event.target
						.chooseToDiscard("he", player.getDamagedHp())
						.set("ai", function (card) {
							var player = _status.event.player;
							if (player.isTurnedOver() || _status.event.getTrigger().player.getDamagedHp() > 2) {
								return -1;
							}
							return player.hp * player.hp - get.value(card);
						})
						.set("prompt", "弃置" + get.cnNumber(player.getDamagedHp()) + "张牌并失去1点体力；或选择不弃置，将武将牌翻面并摸" + get.cnNumber(player.getDamagedHp()) + "张牌。");
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.target.loseHp();
			} else {
				if (player.isDamaged()) {
					event.target.draw(player.getDamagedHp());
				}
				event.target.turnOver();
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1.5];
						}
						if (target.hp <= 1) {
							return;
						}
						if (!target.hasFriend()) {
							return;
						}
						var hastarget = false;
						var turnfriend = false;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) < 0 && !players[i].isTurnedOver()) {
								hastarget = true;
							}
							if (get.attitude(target, players[i]) > 0 && players[i].isTurnedOver()) {
								hastarget = true;
								turnfriend = true;
							}
						}
						if (get.attitude(player, target) > 0 && !hastarget) {
							return;
						}
						if (turnfriend || target.hp == target.maxHp) {
							return [0.5, 1];
						}
						if (target.hp > 1) {
							return [1, 0.5];
						}
					}
				},
			},
		},
	},
	repolu: {
		audio: 1,
		trigger: {
			source: "dieAfter",
			player: "die",
		},
		forceDie: true,
		filter(event, player, name) {
			return name == "die" || player.isIn();
		},
		direct: true,
		content() {
			"step 0";
			if (!player.storage.repolu) {
				player.storage.repolu = 0;
			}
			event.num = player.storage.repolu + 1;
			player.chooseTarget([1, Infinity], get.prompt("repolu"), "令任意名角色摸" + get.cnNumber(event.num) + "张牌").set("forceDie", true).ai = function (target) {
				return get.attitude(_status.event.player, target);
			};
			"step 1";
			if (result.bool) {
				player.storage.repolu++;
				result.targets.sortBySeat();
				player.logSkill("repolu", result.targets);
				game.asyncDraw(result.targets, num);
			} else {
				event.finish();
			}
			"step 2";
			game.delay();
		},
	},
	oljiuchi: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "jiu") {
					return Infinity;
				}
			},
		},
		audio: 2,
		enable: "chooseToUse",
		filterCard(card) {
			return get.suit(card) == "spade";
		},
		viewAs: { name: "jiu" },
		position: "hs",
		viewAsFilter(player) {
			return player.hasCard(card => get.suit(card) == "spade", "hs");
		},
		prompt: "将一张黑桃手牌当酒使用",
		check(cardx, player) {
			if (player && player == cardx.player) {
				return true;
			}
			if (_status.event.type == "dying") {
				return 1;
			}
			var player = _status.event.player;
			var shas = player.getCards("hs", function (card) {
				return card != cardx && get.name(card, player) == "sha";
			});
			if (!shas.length) {
				return -1;
			}
			if (shas.length > 1 && (player.getCardUsable("sha") > 1 || player.countCards("hs", "zhuge"))) {
				return 0;
			}
			shas.sort(function (a, b) {
				return get.order(b) - get.order(a);
			});
			var card = false;
			if (shas.length) {
				for (var i = 0; i < shas.length; i++) {
					if (shas[i] != cardx && lib.filter.filterCard(shas[i], player)) {
						card = shas[i];
						break;
					}
				}
			}
			if (card) {
				if (
					game.hasPlayer(function (current) {
						return (
							get.attitude(player, current) < 0 &&
							!current.hasShan() &&
							current.hp + current.countCards("h", { name: ["tao", "jiu"] }) > 1 + (player.storage.jiu || 0) &&
							player.canUse(card, current, true, true) &&
							!current.hasSkillTag("filterDamage", null, {
								player: player,
								card: card,
								jiu: true,
							}) &&
							get.effect(current, card, player) > 0
						);
					})
				) {
					return 4 - get.value(cardx);
				}
			}
			return -1;
		},
		ai: {
			threaten: 1.5,
		},
		trigger: { source: "damageEnd" },
		locked: false,
		forced: true,
		filter(event, player) {
			if (event.name == "chooseToUse") {
				return player.hasCard(card => get.suit(card) == "spade", "hs");
			}
			return event.card && event.card.name == "sha" && event.getParent(2).jiu == true && !player.isTempBanned("benghuai");
		},
		content() {
			player.logSkill("oljiuchi");
			player.tempBanSkill("benghuai");
		},
	},
	rezaiqi: {
		audio: 2,
		direct: true,
		filter(event, player) {
			return lib.skill.rezaiqi.count() > 0;
		},
		trigger: {
			player: "phaseJieshuBegin",
		},
		content() {
			"step 0";
			player.chooseTarget([1, lib.skill.rezaiqi.count()], get.prompt2("rezaiqi")).ai = function (target) {
				return get.attitude(_status.event.player, target);
			};
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				targets.sortBySeat();
				player.line(targets, "fire");
				player.logSkill("rezaiqi", targets);
				event.targets = targets;
			} else {
				event.finish();
			}
			"step 2";
			event.current = targets.shift();
			if (player.isHealthy()) {
				event._result = { index: 0 };
			} else {
				event.current
					.chooseControl()
					.set("choiceList", ["摸一张牌", "令" + get.translation(player) + "回复1点体力"])
					.set("ai", function () {
						if (get.attitude(event.current, player) > 0) {
							return 1;
						}
						return 0;
					});
			}
			"step 3";
			if (result.index == 1) {
				event.current.line(player);
				player.recover(event.current);
			} else {
				event.current.draw();
			}
			game.delay();
			if (targets.length) {
				event.goto(2);
			}
		},
		count: () => get.discarded().filter(card => get.color(card) === "red").length,
	},
};

export default skills;
