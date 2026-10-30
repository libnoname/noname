import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	qizhengxiangsheng: {
		enable: true,
		type: "trick",
		fullskin: true,
		derivation: "shen_xunyu",
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { card, target } = event;
			if (!event.qizheng_name) {
				if (!player.isIn()) {
					return;
				}
				const e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
				let e2 = 0;
				if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
					e2 = -1;
				}
				const es = target.getGainableCards(player, "e");
				if (es.length) {
					let max = 0;
					for (const current of es) {
						max = Math.max(max, get.value(current, target));
					}
					e2 = Math.min(e2, -max / 4);
				}
				let choice = "正兵";
				if (Math.abs(e1 - e2) <= 0.3) {
					choice = Math.random() < 0.5 ? "奇兵" : "正兵";
				} else if (e1 < e2) {
					choice = "奇兵";
				}
				const controlResult = await player
					.chooseControl({
						controls: ["奇兵", "正兵"],
						prompt: `请选择${get.translation(target)}的标记`,
					})
					.set("choice", choice)
					.set("ai", () => _status.event.choice)
					.forResult();
				if (controlResult.control) {
					event.qizheng_name = controlResult.control;
				}
			}
			let responseResult = { bool: false };
			if (!event.directHit) {
				const responseChoice = (() => {
					if (target.hasSkillTag("useShan")) {
						return "shan";
					}
					if (typeof event.qizheng_aibuff === "boolean") {
						const shas = target.getCards("h", "sha");
						const shans = target.getCards("h", "shan");
						if (event.qizheng_aibuff) {
							if (shas.length >= Math.max(1, shans.length)) {
								return "shan";
							}
							if (shans.length > shas.length) {
								return "sha";
							}
							return false;
						}
						if (!shas.length || !shans.length) {
							return false;
						}
					}
					const e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
					let e2 = 0;
					if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
						e2 = -1;
					}
					const es = target.getGainableCards(player, "e");
					if (es.length) {
						let max = 0;
						for (const current of es) {
							max = Math.max(max, get.value(current, target));
						}
						e2 = Math.min(e2, -max / 4);
					}
					if (e1 - e2 >= 0.3) {
						return "shan";
					}
					if (e2 - e1 >= 0.3) {
						return "sha";
					}
					return "all";
				})();
				responseResult = await target
					.chooseToRespond({
						prompt: "请打出一张杀或闪响应奇正相生",
						filterCard: card => {
							const name = get.name(card);
							return name === "sha" || name === "shan";
						},
						ai: card => {
							if (_status.event.choice === "all") {
								const rand = get.rand("qizhengxiangsheng");
								if (rand > 0.5) {
									return 0;
								}
								return 1 + Math.random();
							}
							if (get.name(card) === _status.event.choice) {
								return get.order(card);
							}
							return 0;
						},
					})
					.set("respondTo", [player, card])
					.set("choice", responseChoice)
					.forResult();
			}
			const name = responseResult.bool ? responseResult.card.name : null;
			const require = event.qizheng_name;
			if (require === "奇兵" && name !== "sha") {
				await target.damage();
			} else if (require === "正兵" && name !== "shan" && target.countGainableCards(player, "he") > 0) {
				await player.gainPlayerCard({ target, forced: true, position: "he" });
			}
		},
		ai: {
			order: 5,
			tag: {
				damage: 0.6,
				gain: 0.5,
				loseCard: 1,
				respondShan: 1,
				respondSha: 1,
			},
			result: {
				target(player, target) {
					const e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
					let e2 = 0;
					if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
						e2 = -1;
					}
					const es = target.getGainableCards(player, "e");
					if (es.length) {
						let max = 0;
						for (const current of es) {
							max = Math.max(max, get.value(current, target));
						}
						e2 = Math.min(e2, -max / 4);
					}
					if (game.hasPlayer(current => current.hasSkill("tianzuo") && get.attitude(current, player) <= 0)) {
						return Math.max(e1, e2);
					}
					return Math.min(e1, e2);
				},
			},
		},
	},
	binglinchengxiax: {
		enable: true,
		type: "trick",
		derivation: "sp_xunchen",
		fullskin: true,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			if (!player.isIn() || !target.isIn()) {
				return;
			}
			event.showCards = get.cards(4, true);
			await game.cardsGotoOrdering(event.showCards);
			await player.showCards(event.showCards, `${get.translation(player)}使用了【${get.translation(event.card)}】`, true).set("clearArena", false);
			if (player.isIn() && target.isIn() && event.showCards.length) {
				for (const card of event.showCards.slice()) {
					if (get.name(card) === "sha" && player.canUse(card, target, false)) {
						event.showCards.remove(card);
						await player.useCard({ card, targets: [target], addCount: false });
					}
				}
			}
			game.broadcastAll(ui.clear);
			if (event.showCards.length) {
				await game.cardsGotoPile(event.showCards.reverse(), "insert");
			}
		},
		ai: {
			basic: {
				useful: 4,
				value: 3,
			},
			order: 4,
			result: {
				target(player, target, card, isLink) {
					if (get.effect(target, { name: "sha" }, player, target) === 0) {
						return 0;
					}
					return -2.5;
				},
			},
			tag: {
				respond: 1,
				respondShan: 1,
				damage: 1,
			},
		},
	},
	tiaojiyanmei: {
		enable: true,
		type: "trick",
		derivation: "feiyi",
		fullskin: true,
		filterTarget(card, player, target) {
			const targets = [];
			if (ui.selected.targets.length) {
				targets.addArray(ui.selected.targets);
			}
			const evt = _status.event.getParent("useCard");
			if (evt && evt.card === card) {
				targets.addArray(evt.targets);
			}
			if (targets.length) {
				const hs = target.countCards("h");
				for (const current of targets) {
					if (current.countCards("h") !== hs) {
						return true;
					}
				}
				return false;
			}
			return true;
		},
		recastable: true,
		selectTarget: 2,
		postAi: () => true,
		async contentBefore(event) {
			const { targets } = event;
			if (!targets.length) {
				return;
			}
			const map = {};
			event.getParent().customArgs.default.tiaojiyanmei_map = map;
			let average = 0;
			for (const target of targets) {
				const hs = target.countCards("h");
				map[target.playerid] = hs;
				average += hs;
			}
			map.average = average / targets.length;
		},
		async content(event) {
			const { target } = event;
			const map = event.tiaojiyanmei_map;
			const num1 = map.average;
			let num2 = map[target.playerid];
			if (typeof num2 !== "number") {
				num2 = target.countCards("h");
			}
			if (num2 > num1) {
				target.chooseToDiscard({ position: "he", forced: true });
			} else if (num2 < num1) {
				target.draw();
			}
		},
		async contentAfter(event, trigger, player) {
			const { card, targets } = event;
			if (!player.isIn() || targets.length < 2) {
				return;
			}
			const num = targets[0].countCards("h");
			for (const target of targets.slice(1)) {
				if (target.countCards("h") !== num) {
					return;
				}
			}
			let discardedCards = [];
			game.getGlobalHistory("cardMove", evt => {
				if (evt.name === "lose" && evt.type === "discard" && evt.getParent(3).card === card) {
					discardedCards.addArray(evt.cards);
				}
			});
			discardedCards = discardedCards.filterInD("d");
			if (!discardedCards.length) {
				return;
			}
			event.tiaojiyanmei_cards = discardedCards;
			const result = await player
				.chooseTarget({
					prompt: `是否令一名角色获得${get.translation(discardedCards)}？`,
					ai: target => {
						const evt = _status.event.getParent();
						return get.attitude(evt.player, target) * get.value(evt.tiaojiyanmei_cards, target) * (target.hasSkillTag("nogain") ? 0.1 : 1);
					},
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const target = result.targets[0];
			player.line(target, "thunder");
			await target.gain({ cards: discardedCards, animate: "gain2" });
		},
		ai: {
			order: 6.1,
			basic: {
				useful: 4,
				value: 3,
			},
			result: {
				target(player, target, card, isLink) {
					const targets = [];
					if (ui.selected.targets.length) {
						targets.addArray(ui.selected.targets);
					}
					const evt = _status.event.getParent("useCard");
					if (evt && evt.card === card) {
						targets.addArray(evt.targets);
					}
					if (evt && evt.card === card && evt.customArgs && evt.customArgs.tiaojiyanmei_map) {
						const map = evt.customArgs.tiaojiyanmei_map;
						const num1 = map.average;
						let num2 = map[target.playerid];
						if (typeof num2 !== "number") {
							num2 = target.countCards("h");
						}
						if (num2 > num1) {
							if (target.countCards("e", card => get.value(card) <= 0)) {
								return 1;
							}
							return -1;
						}
						if (num2 < num1) {
							return 1;
						}
						return 0;
					}
					const cards = [card];
					if (card.cards) {
						cards.addArray(card.cards);
					}
					const fh = card => !cards.includes(card);
					if (!targets.length) {
						if (get.attitude(player, target) < 0) {
							if (target.countCards("e", card => get.value(card, target) <= 0)) {
								return 1;
							}
							if (game.hasPlayer(current => current.countCards("h", fh) === target.countCards("h", fh) - 2)) {
								return -2;
							}
							if (game.hasPlayer(current => current.countCards("h", fh) < target.countCards("h", fh))) {
								return -1;
							}
						}
						if (target.countCards("e", card => get.value(card, target) <= 0) && game.hasPlayer(current => current.countCards("h", fh) < target.countCards("h", fh))) {
							return 1;
						}
						return 0;
					}
					let average = 0;
					for (const current of targets) {
						average += current.countCards("h", fh);
					}
					let th;
					if (!targets.includes(target)) {
						th = target.countCards("h", fh);
						average += th;
						average /= targets.length + 1;
						if (th === average) {
							return 0;
						}
						if (th < average) {
							return th === average - 1 ? 2 : 1;
						}
						if (th > average) {
							if (target.countCards("e", card => get.value(card) <= 0)) {
								return 1;
							}
							return -0.5;
						}
						return 0;
					}
					average /= targets.length;
					if (th < average) {
						return 1;
					}
					if (th > average) {
						if (target.countCards("e", card => get.value(card) <= 0)) {
							return 1;
						}
						return -1;
					}
					return 0;
				},
			},
		},
	},
};
export default cards;
