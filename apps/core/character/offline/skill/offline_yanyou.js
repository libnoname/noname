import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//燕幽烽火
	//全琮
	yyyaoming: {
		audio: "sbyaoming",
		enable: "phaseUse",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return game.hasPlayer(target => {
				if (target.countCards("he") && target.countCards("h") >= player.countCards("h")) {
					if (target !== player && (event.name === "damage" || !player.getStorage("yyyaoming_used").includes("弃牌"))) {
						return true;
					}
				}
				if (target.countCards("h") <= player.countCards("h")) {
					if (event.name === "damage" || !player.getStorage("yyyaoming_used").includes("摸牌")) {
						return true;
					}
				}
				return false;
			});
		},
		filterTarget(card, player, target) {
			if (target !== player && target.countCards("he") && target.countCards("h") >= player.countCards("h") && !player.getStorage("yyyaoming_used").includes("弃牌")) {
				return true;
			}
			if (target.countCards("h") <= player.countCards("h") && !player.getStorage("yyyaoming_used").includes("摸牌")) {
				return true;
			}
			return false;
		},
		prompt() {
			const player = get.player(),
				storage = player.getStorage("yyyaoming_used");
			return ["弃牌", "摸牌"]
				.filter(i => !storage.includes(i))
				.map(i => {
					return {
						弃牌: "弃置一名手牌数不小于你的其他角色的一张牌",
						摸牌: "令一名手牌数不大于你的角色摸一张牌",
					}[i];
				})
				.join("，或");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt(event.skill),
					(card, player, target) => {
						if (target !== player && target.countCards("he") && target.countCards("h") >= player.countCards("h")) {
							return true;
						}
						if (target.countCards("h") <= player.countCards("h")) {
							return true;
						}
						return false;
					},
					"弃置一名手牌数不小于你的其他角色的一张牌，或令一名手牌数不大于你的角色摸一张牌"
				)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, "yyyaoming", player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.target || event.targets[0];
			let choice = ["弃牌", "摸牌"].filter(choice => {
					if (!(trigger?.name === "damage" || !player.getStorage("yyyaoming_used").includes(choice))) {
						return false;
					}
					if (choice === "弃牌") {
						return target !== player && target.countCards("he") && target.countCards("h") >= player.countCards("h");
					}
					return target.countCards("h") <= player.countCards("h");
				}),
				result;
			if (choice.length === 1) {
				result = { control: choice[0] };
			} else {
				result = await player
					.chooseControl(choice)
					.set("choiceList", ["弃置" + get.translation(target) + "一张牌", "令" + get.translation(target) + "摸一张牌"])
					.set("prompt", "邀名：请选择一项")
					.set("ai", () => {
						const player = get.player(),
							event = get.event().getParent(),
							target = event.target || event.targets[0];
						return get.effect(target, { name: "guohe_copy2" }, player, player) > get.effect(target, { name: "draw" }, player, player) ? 0 : 1;
					})
					.forResult();
			}
			if (result.control === "弃牌") {
				await player.discardPlayerCard(target, "he", true);
			} else {
				await target.draw();
			}
			if (!(trigger?.name === "damage")) {
				player.addTempSkill("yyyaoming_used", "phaseUseAfter");
				player.markAuto("yyyaoming_used", [result.control]);
			}
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					let eff = [0, 0],
						hs = player.countCards("h"),
						ht = target.countCards("h");
					if (hs >= ht) {
						eff[0] = get.effect(target, { name: "draw" }, player, player);
					}
					if (hs <= ht) {
						eff[1] = get.effect(target, { name: "guohe_copy2" }, player, player);
					}
					return Math.max.apply(Math, eff);
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//白虎骁骑
	yy_baimaxiaoqi_skill: {
		equipSkill: true,
		mod: {
			attackRange(player, num) {
				if (player.countVCards("e") > 0) {
					return num + player.countVCards("e");
				}
			},
			cardUsable(card, player, num) {
				if (card.name != "sha") {
					return;
				}
				if (player.countVCards("e") > 1) {
					return num + player.countVCards("e");
				}
			},
			globalFrom(player, target, num) {
				if (player.countVCards("e") > 2) {
					return num - player.countVCards("e");
				}
			},
		},
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return player.countVCards("e") > 3 && !event.numFixed;
		},
		forced: true,
		content() {
			trigger.num += player.countVCards("e");
		},
	},
	//麴义
	yyfuqi: {
		audio: "fuqi",
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			return get.distance(player, event.target) > 1;
		},
		forced: true,
		logTarget: "target",
		content() {
			player.draw();
		},
		group: "yyfuqi_fuqi",
		subSkill: { fuqi: { audio: "fuqi", inherit: "fuqi" } },
	},
	//公孙瓒
	yyqizhen: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha";
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0 || event.targets.some(i => get.attitude(player, i) < 0);
		},
		logTarget: "target",
		content() {
			const skill = "yyqizhen_effect";
			player.addTempSkill(skill);
			if (!player.storage[skill]) {
				player.storage[skill] = {};
			}
			const id = trigger.target.playerid;
			if (!player.storage[skill][id]) {
				player.storage[skill][id] = [trigger.target, trigger.getParent()];
			} else {
				player.storage[skill][id].add(trigger.getParent());
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return Object.keys(player.storage["yyqizhen_effect"]).some(id => player.storage["yyqizhen_effect"][id].includes(event));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const storage = player.storage["yyqizhen_effect"];
					const targets = Object.keys(storage)
						.filter(id => {
							return storage[id].includes(trigger);
						})
						.slice()
						.map(id => storage[id][0]);
					const goon = game.getGlobalHistory("changeHp", evt => evt.getParent().name === "damage" && evt.getParent().card === trigger.card).reduce((sum, evt) => sum - evt.num, 0);
					for (const target of targets) {
						if (goon) {
							player.line(target);
							await player.draw(goon);
						} else {
							if (!target.isIn() || !target.countDiscardableCards(player, "e")) {
								continue;
							}
							player.line(target);
							await player.discardPlayerCard(target, "e", true);
						}
					}
				},
			},
		},
	},
	yymujun: {
		zhuSkill: true,
		limited: true,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target.group == "qun" && player.hasZhuSkill("yymujun", target) && !target.hasSkill("yicong", null, false, false);
		},
		skillAnimation: true,
		animationColor: "metal",
		content() {
			player.awakenSkill(event.name);
			target.addSkills("yicong");
		},
		ai: {
			order: 1,
			result: { target: 1 },
		},
		derivation: "yicong",
	},
	//文丑
	yyxuezhan: {
		trigger: { player: "useCard" },
		filter(event) {
			return event.card.name == "juedou";
		},
		forced: true,
		content() {
			trigger.nowuxie = true;
		},
		mod: {
			cardname(card, player) {
				if (get.type(card, "trick", false) == "trick") {
					return "juedou";
				}
			},
		},
	},
	yyyazhen: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			return player.countCards("e");
		},
		filterCard: true,
		position: "e",
		viewAs: { name: "sha" },
		check(card) {
			const val = get.value(card);
			if (get.event().name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (!player.countCards("e")) {
					return false;
				}
			},
		},
	},
	//公孙渊
	yyxuanshi: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") && player.countCards("h", { color: "red" }) === player.countCards("h", { color: "black" });
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("hej");
		},
		usable: 2,
		delay: false,
		content() {
			player.showHandcards(get.translation(player) + "对" + get.translation(target) + "发动了【旋势】");
			player.gainPlayerCard(target, "hej", true);
		},
		ai: {
			order: 20,
			result: {
				player(player, target) {
					return get.effect(target, { name: "shunshou" }, player, player);
				},
			},
		},
	},
	yyxiongye: {
		zhuSkill: true,
		enable: "phaseUse",
		selectCard() {
			if (ui.selected.targets.length) {
				return [ui.selected.targets.length, Infinity];
			}
			return [1, Infinity];
		},
		selectTarget: () => ui.selected.cards.length,
		filterTarget(card, player, target) {
			return target !== player && target.group === "qun" && player.hasZhuSkill("yyxiongye", target);
		},
		filterCard: true,
		check(card) {
			if (get.tag(card, "recover")) {
				return 0;
			}
			return 7 - get.value(card);
		},
		position: "h",
		complexCard: true,
		discard: false,
		lose: false,
		delay: false,
		multitarget: true,
		multiline: true,
		usable: 1,
		async content(event, trigger, player) {
			await game
				.loseAsync({
					gain_list: Array.from({ length: event.targets.length }).map((_, i) => [event.targets[i], event.cards[i]]),
					giver: player,
					player: player,
					cards: event.cards,
					animate: "giveAuto",
				})
				.setContent("gaincardMultiple");
			for (const i of event.targets.sortBySeat()) {
				await i.damage();
			}
		},
		ai: {
			order: 5,
			result: {
				player(player, target) {
					return get.damageEffect(target, player, player);
				},
			},
		},
	},
	//袁绍
	yysudi: {
		trigger: { global: ["useCardAfter", "respondAfter"] },
		filter(event, player) {
			if (!Array.isArray(event.respondTo) || event.respondTo[0] !== player) {
				return false;
			}
			return event.player.inRange(player);
		},
		forced: true,
		logTarget: "player",
		content() {
			player.draw();
		},
	},
	yyqishe: {
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseJieshuBegin"],
		},
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		frequent: true,
		async cost(event, trigger, player) {
			if (trigger.name !== "phaseJieshu") {
				event.result = { bool: true };
			} else {
				event.result = await player.chooseBool("是否发动【齐射】，从弃牌堆中获得一张【万箭齐发】？").set("frequentSkill", event.skill).forResult();
			}
		},
		content() {
			const card = trigger.name === "phaseJieshu" ? get.discardPile("wanjian") : game.createCard2("wanjian", "heart", 1);
			if (card) {
				player.gain(card, "gain2");
			}
		},
	},
	yylinzhen: {
		locked: true,
		zhuSkill: true,
		global: "yylinzhen_global",
		subSkill: {
			global: {
				zhuSkill: true,
				mod: {
					inRange(from, to) {
						if (from === to || from.group !== "qun") {
							return;
						}
						if (to.hasZhuSkill("yylinzhen", from)) {
							return true;
						}
					},
				},
			},
		},
	},
	//司马懿
	yyyanggu: {
		enable: "chooseToUse",
		filter(event, player) {
			return player.storage.yyyanggu && player.countCards("h");
		},
		filterCard: true,
		position: "h",
		viewAs: { name: "shengdong" },
		prompt: "将一张手牌当作【声东击西】使用",
		check(card) {
			return 7 - get.value(card);
		},
		onuse(result, player) {
			player.changeZhuanhuanji("yyyanggu");
		},
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "你可以将一张手牌当作【声东击西】使用";
				}
				return "当你受到伤害后，你可以回复1点体力";
			},
		},
		group: "yyyanggu_effect",
		subSkill: {
			effect: {
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return !player.storage.yyyanggu && player.isDamaged();
				},
				check(event, player) {
					return get.recoverEffect(player, player, player) > 0;
				},
				prompt: "回复1点体力",
				content() {
					player.changeZhuanhuanji("yyyanggu");
					player.recover();
				},
			},
		},
	},
	yyzuifu: {
		trigger: { global: ["gainAfter", "loseAsyncAfter"] },
		filter(event, player, name, target) {
			if (!event.getg || _status.dying.length) {
				return false;
			}
			return target?.isIn();
		},
		getIndex(event, player) {
			if (!event.getg) {
				return false;
			}
			return game
				.filterPlayer(current => {
					const evt = event.getParent("phaseDraw");
					if (evt?.player == current) {
						return false;
					}
					return event.getg(current).length;
				})
				.sortBySeat();
		},
		usable: 1,
		logTarget: (event, player, name, target) => target,
		prompt2: (event, player, name, target) => "对" + get.translation(target) + "造成1点伤害",
		check: (event, player, name, target) => get.damageEffect(target, player, player) > 0,
		content() {
			event.targets[0].damage();
		},
	},
	//曹叡
	yyhuituo: {
		audio: "huituo",
		trigger: { player: "damageEnd" },
		getIndex: event => event.num,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					if (get.attitude(player, target) > 0) {
						return get.recoverEffect(target, player, player) + 1;
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.judge(card => {
					if (get.color(card) == "red") {
						return target.isDamaged() ? 1 : -1;
					}
					return 0;
				})
				.forResult();
			if (result.color === "red") {
				await target.recover();
			}
			if (result.color === "black") {
				await target.draw();
			}
		},
	},
	yymingjian: {
		audio: "mingjian",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player !== player && player.countCards("h");
		},
		async cost(event, trigger, player) {
			const suits = player
				.getCards("h")
				.slice()
				.map(i => get.suit(i, player))
				.unique();
			event.result = await player
				.chooseControl(suits, "cancel2")
				.set("ai", () => {
					const player = get.player(),
						target = get.event().getTrigger().player;
					if (get.attitude(player, target) < 2) {
						return "cancel2";
					}
					return get.event().controls.randomGet();
				})
				.set("prompt", get.prompt2(event.skill, trigger.player))
				.forResult();
			if (event.result.control !== "cancel2") {
				event.result.bool = true;
				event.result.cards = player.getCards("h", { suit: event.result.control });
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.showHandcards(get.translation(player) + "对" + get.translation(target) + "发动了【明鉴】");
			await player.give(event.cards, target, "visible");
			target.addTempSkill("yymingjian_effect");
			target.addMark("yymingjian_effect", 1, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合使用的下一张牌额外结算#次" },
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				content() {
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					if (lib.skill.dcshixian.filterx(trigger)) {
						trigger.effectCount += num;
						game.log(trigger.card, "额外结算" + num + "次");
					}
				},
				mod: {
					aiOrder(player, card, num) {
						if (typeof card == "object" && !get.tag(card, "norepeat")) {
							const type = get.type(card);
							if (type === "basic" || type === "trick") {
								return num + 20;
							}
						}
					},
				},
			},
		},
	},
};

export default skills;
