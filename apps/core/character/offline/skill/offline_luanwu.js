import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//文和乱武
	nsyangwu: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { suit: "heart" },
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > player.countCards("h");
		},
		filter(event, player) {
			var info = lib.skill.nsyangwu;
			return (
				player.countCards("h", info.filterCard) &&
				game.hasPlayer(function (target) {
					return info.filterTarget(null, player, target);
				})
			);
		},
		check(card) {
			var num = 0;
			var player = _status.event.player;
			game.countPlayer(function (current) {
				if (current != player && get.attitude(player, current) < 0) {
					num = Math.max(num, current.countCards("h") - player.countCards("h"));
				}
			});
			return Math.ceil((num + 1) / 2) * 2 + 4 - get.value(card);
		},
		content() {
			var num = Math.ceil((target.countCards("h") - player.countCards("h")) / 2);
			if (num) {
				player.gainPlayerCard(target, true, "h", num, "visible");
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					return player.countCards("h") - target.countCards("h");
				},
			},
		},
	},
	nslulve: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("e") > 0 && current.countCards("e") <= player.countCards("he");
			});
		},
		filterCard() {
			if (ui.selected.targets.length) {
				return false;
			}
			return true;
		},
		position: "he",
		selectCard: [1, Infinity],
		complexSelect: true,
		complexCard: true,
		filterTarget(card, player, target) {
			return target != player && target.countCards("e") > 0 && ui.selected.cards.length == target.countCards("e");
		},
		check(card) {
			var player = _status.event.player;
			if (
				game.hasPlayer(function (current) {
					return current != player && current.countCards("e") > 0 && ui.selected.cards.length == current.countCards("e") && get.damageEffect(current, player, player) > 0;
				})
			) {
				return 0;
			}
			switch (ui.selected.cards.length) {
				case 0:
					return 8 - get.value(card);
				case 1:
					return 6 - get.value(card);
				case 2:
					return 3 - get.value(card);
				default:
					return 0;
			}
		},
		content() {
			target.damage("nocard");
		},
		ai: {
			damage: true,
			order: 2,
			result: {
				target(player, target) {
					return get.damageEffect(target, player);
				},
			},
			expose: 0.3,
		},
	},
	nsfeixiong: {
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.hasCards("h") && game.hasPlayer(current => current !== player && player.canCompare(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("nsfeixiong"),
					filterTarget(card, player, target) {
						return player !== target && player.canCompare(target);
					},
					ai(target) {
						const player = get.player();
						const hs = player.getCards("h").sort((a, b) => b.number - a.number);
						const ts = target.getCards("h").sort((a, b) => b.number - a.number);
						if (!hs.length || !ts.length) {
							return 0;
						}
						if (hs[0].number > ts[0].number) {
							return get.damageEffect(target, player, player);
						}
						return 0;
					}
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (get.mode() !== "identity" || player.identity !== "nei") {
				player.addExpose(0.2);
			}
			const compareResult = await player.chooseToCompare(target).forResult();
			if (compareResult.tie) {
				return;
			}
			const damaged = compareResult.bool ? target : player;
			const source = compareResult.bool ? player : target;
			await damaged.damage({ source });
		},
	},
	nscesuan: {
		trigger: { player: "damageBegin3" },
		forced: true,
		content() {
			"step 0";
			trigger.cancel();
			event.lose = player.loseMaxHp();
			"step 1";
			if (event.lose && event.lose.loseHp) {
				player.draw();
			}
		},
		ai: {
			neg: true,
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "filterDamage" && arg && arg.player) {
					if (arg.player.hasSkillTag("jueqing", false, player)) {
						return false;
					}
				}
			},
		},
	},
};

export default skills;
