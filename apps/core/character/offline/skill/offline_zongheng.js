import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//神张角
	zhyuanlin: {
		forced: true,
		trigger: {
			global: ["roundStart", "phaseJudgeBegin", "damageEnd"],
		},
		filter(event, player) {
			if (event.name === "phaseJudge") {
				return player !== event.player;
			} else if (event.name === "damage") {
				return event.hasNature("thunder");
			}
			return game.players.length > 1;
		},
		logTarget(event, player) {
			if (event.name === "phaseJudge") {
				return event.player;
			} else if (event.name === "damage") {
				return player;
			}
			return game.filterPlayer(current => current !== player).sortBySeat();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			if (trigger.name === "damage") {
				await player.chooseDrawRecover({ forced: true });
			} else {
				await game.doAsyncInOrder(targets, async target => {
					await target.executeDelayCardEffect("shandian");
				});
			}
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
	zhkuanglei: {
		forced: true,
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return player !== event.player && get.is.damageCard(event.card);
		},
		logTarget: "player",
		derivation: "zhkuanglei_leiji",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.chooseToGive({
					prompt: `狂雷：请交给${get.translation(player)}一张牌，否则你进行一次〖雷击〗判定`,
					target: player,
					position: "he",
					ai(card) {
						const { player, target } = get.event();
						if (get.attitude(player, target) > 0 || player.hp <= 2) {
							return 114514 - get.value(card);
						}
						return 6 - get.value(card);
					},
				})
				.set("target", player)
				.forResult();
			if (!result?.bool || !result.cards?.length) {
				await player.useSkill({ skill: `${event.name}_leiji`, targets: [target] });
			}
		},
		subSkill: {
			leiji: {
				inherit: "releiji",
			},
		},
	},
	zhqiongshan: {
		round: 1,
		trigger: { global: "judge" },
		filter(event, player) {
			return player !== event.player;
		},
		check(event, player) {
			const target = event.player;
			const card = target.judging[0];
			const suits = ["spade", "club", "diamond", "heart"];
			const numbers = Array.from({ length: 13 }).map((val, idx) => idx + 1);
			for (const suit of suits) {
				for (const number of numbers) {
					const cardx = get.autoViewAs({ name: card.name, nature: card.nature, suit, number }, [card]);
					const num = get.sgnAttitude(player, target) * (event.judge(cardx) - event.judge(card));
					if (num > 0) return true;
				}
			}
			return false;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const card = target.judging[0];
			if ([card].filterInD("od").length) {
				await player.gain({ cards: [card], animate: "gain2" });
			}
			const str = `穹闪：${get.translation(target)}的${trigger.judgestr || ""}判定为${get.translation(target.judging[0])}，请修改判定结果`;
			const suits = ["spade", "club", "diamond", "heart"];
			const suitx = suits.map(suit => get.translation(suit));
			const numbers = Array.from({ length: 13 }).map((val, idx) => idx + 1);
			const numberx = ["A"];
			numberx.addArray(Array.from({ length: 9 }).map((val, idx) => idx + 2));
			numberx.addArray("J", "Q", "K");
			const result = await player
				.chooseButton({
					createDialog: [str, [suitx, "tdnodes"], [numberx, "tdnodes"]],
					filterButton(button) {
						const { numberx, suitx } = get.event();
						if (ui.selected.buttons?.some(buttonx => numberx.includes(buttonx.link))) {
							return !numberx.includes(button.link);
						}
						if (ui.selected.buttons?.some(buttonx => suitx.includes(buttonx.link))) {
							return !suitx.includes(button.link);
						}
						return true;
					},
					forced: true,
					selectButton: 2,
					ai(button) {
						const { card, suitx, numberx, suits, numbers, player } = get.event();
						const list = [];
						const trigger = get.event().getTrigger();
						for (const suit of suits) {
							for (const number of numbers) {
								const cardx = get.autoViewAs({ name: card.name, nature: card.nature, suit, number }, [card]);
								const num = get.sgnAttitude(player, trigger.player) * (trigger.judge(cardx) - trigger.judge(card));
								list.push([suit, number, num]);
							}
						}
						if (list.length) {
							list.sort((a, b) => b[2] - a[2]);
							return [suitx[suits.indexOf(list[0][0])], numberx[numbers.indexOf(list[0][1])]].includes(button.link);
						}
						return 1 + Math.random();
					},
				})
				.set("card", card)
				.set("numberx", numberx)
				.set("suitx", suitx)
				.set("numbers", numbers)
				.set("suits", suits)
				.forResult();
			if (!result?.bool || !result.links?.length) {
				return;
			}
			const suit = suits[result.links.map(link => suitx.indexOf(link)).filter(i => i !== -1)[0]];
			const number = numbers[result.links.map(link => numberx.indexOf(link)).filter(i => i !== -1)[0]];
			game.log(player, "将判定结果修改为了", `#g${get.translation(suit + 2)}${get.strNumber(number)}`);
			trigger.fixedResult = {
				suit: suit,
				color: get.color({ suit: suit }),
				number: number,
			};
			player.popup(`${get.translation(suit + 2)}${get.strNumber(number)}`, "thunder");
		},
	},
};

export default skills;
