import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//疑包
	//刘备
	sxrmchengbian: {
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "juedou" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = await player.chooseToCompare(target).set("isDelay", true);
			player
				.when({
					player: "useCardAfter",
				})
				.filter(evt => evt.getParent() == event)
				.step(async (event, trigger, player) => {
					player.removeSkill("sxrmchengbian_sha");
					target.removeSkill("sxrmchengbian_sha");
					const result = await game.createEvent("chooseToCompare", false).set("player", player).set("parentEvent", next).setContent("chooseToCompareEffect").forResult();
					if (result.winner) {
						await result.winner.drawTo(result.winner.maxHp);
					}
				})
				.vars({
					target,
					next,
				});
			player.addTempSkill("sxrmchengbian_sha");
			target.addTempSkill("sxrmchengbian_sha");
			const card = new lib.element.VCard({ name: "juedou" });
			if (player.canUse(card, target)) {
				await player.useCard(card, target);
			}
			player.removeSkill("sxrmchengbian_sha");
			target.removeSkill("sxrmchengbian_sha");
		},
		subSkill: {
			sha: {
				audio: "sxrmchengbian",
				enable: "chooseToRespond",
				filterCard: true,
				selectCard() {
					const player = get.player(),
						num = Math.ceil(player.countCards("h") / 2);
					return [num, Infinity];
				},
				position: "h",
				viewAs: { name: "sha" },
				viewAsFilter(player) {
					if (!player.countCards("h")) {
						return false;
					}
				},
				prompt: "将至少半数手牌当杀打出",
				complexCard: true,
				check(card) {
					const player = get.player(),
						num = Math.ceil(player.countCards("h") / 2),
						val = get.value(card);
					if (ui.selected.cards.length >= num) {
						return 0;
					}
					return 1 / Math.max(0.1, val);
				},
				ai: {
					skillTagFilter(player) {
						if (!player.countCards("h")) {
							return false;
						}
					},
					respondSha: true,
				},
			},
		},
	},
	//蒋干
	sxrmzongheng: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.countPlayer(current => current.countCards("h") && current != player) > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), 2, (card, player, target) => {
					return target.countCards("h") && target != player;
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			const result = await player
				.chooseButton(["纵横：展示并获得其中一张", `###${get.translation(targets[0])}的手牌###`, targets[0].getCards("h"), `###${get.translation(targets[1])}的手牌###`, targets[1].getCards("h")], true)
				.set("targets", targets)
				.set("ai", button => {
					const { player, targets } = get.event(),
						owner = get.owner(button.link),
						other = targets.find(i => i != owner);
					let eff1 = get.value(button.link),
						eff2 = other ? get.effect(other, { name: "guohe_copy2" }, player, player) : 0;
					if (other) {
						eff2 *= Math.min(
							3,
							other.countCards("h", card => {
								return ["suit", "type2", "number"].some(key => {
									return get[key](card, other) == get[key](button.link, owner);
								});
							})
						);
					}
					return eff1 + eff2;
				})
				.forResult();
			const card = result.links[0],
				owner = get.owner(card),
				other = targets.find(i => i != owner),
				suit = get.suit(card, owner),
				num = get.number(card, owner),
				type = get.type2(card, owner);
			await owner.give(card, player);
			if (other) {
				if (
					!other.countCards("h", cardx => {
						return get.suit(cardx) == suit || get.number(cardx) == num || get.type2(cardx) == type;
					})
				) {
					return;
				}
				const result = await player
					.chooseToMove_new("纵横：弃置符合要求的牌各一张", true)
					.set("list", [
						[get.translation(other) + "的手牌", other.getCards("h")],
						[[`花色为${get.translation(suit)}`], [`点数为${get.translation(num)}`], [`类型为${get.translation(type)}`]],
					])
					.set("filterOk", moved => {
						let list = [null, "suit", "number", "type2"];
						for (let i = 1; i < 4; i++) {
							let key = list[i];
							if (moved[i].some(card => get[key](card) != get.event(key)) || moved[i].length > 1) {
								return false;
							}
						}
						return moved[1].length + moved[2].length + moved[3].length;
					})
					.set("filterMove", (from, to, moved) => {
						let list = [null, "suit", "number", "type2"];
						if (typeof to == "number") {
							if (to != 0) {
								return moved[to].length < 1 && get[list[to]](from.link) == get.event(list[to]);
							}
							return true;
						}
						if (moved[0].includes(from.link)) {
							let num = [1, 2, 3].find(i => moved[i].includes(to.link));
							return get[list[num]](from.link) == get.event(list[num]);
						}
						let numx = [1, 2, 3].find(i => moved[i].includes(from.link));
						return get[list[numx]](to.link) == get.event(list[numx]);
					})
					.set("processAI", list => {
						let cards = [],
							cardx = list[0][1].slice().sort((a, b) => get.value(b) - get.value(a)),
							discards = [[], [], []],
							keys = ["suit", "number", "type2"];
						for (let i = 0; i < keys.length; i++) {
							let key = keys[i];
							let card = cardx.find(j => !cards.includes(j) && get[key](j) == get.event(key));
							if (card) {
								cards.add(card);
								discards[i].add(card);
							}
						}
						return [cardx.removeArray(cards), ...discards];
					})
					.set("suit", suit)
					.set("number", num)
					.set("type2", type)
					.forResult();
				if (result.bool) {
					const cards = result.moved.slice(1).flat();
					await other.discard(cards).set("discarder", player);
				}
			}
		},
	},
	sxrmduibian: {
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			if (!event.source || event.source == player) {
				return false;
			}
			if (!player.canCompare(event.source)) {
				return false;
			}
			return (
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "damage" && evt.player == player;
						},
						event
					)
					.indexOf(event) == 0
			);
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = await player.chooseToCompare(target).set("isDelay", true);
			trigger.cancel();
			let bool = get.damageEffect(player, target, target) + get.effect(target, { name: "guohe_copy2" }, player, target) > 0;
			bool = Math.random() > 0.4 ? bool : false;
			const result = await target
				.chooseBool(`对辩：是否令${get.translation(player)}弃置你一张牌，然后揭示拼点结果？`)
				.set("choice", bool)
				.forResult();
			if (result.bool) {
				await player.discardPlayerCard(target, "he", true);
				const result2 = await game.createEvent("chooseToCompare", false).set("player", player).set("parentEvent", next).setContent("chooseToCompareEffect").forResult();
				if (result2.winner == target) {
					await player.loseHp();
				}
			} else {
				await game.delayx();
			}
		},
	},
};

export default skills;
