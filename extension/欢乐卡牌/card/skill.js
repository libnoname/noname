import { lib, game, ui, get, ai, _status } from "../../../noname.js";

/** @type { importCardConfig['skill'] } */
const skill = {
	monkey: {
		equipSkill: true,
		trigger: {
			global: "useCardToBegin",
		},
		audio: "ext:欢乐卡牌/audio/skill:true",
		filter(event, player) {
			var card = player.getEquip(5);
			if (card) {
				var name = card.name;
				if (name && name.indexOf("monkey") !== -1 && event.name === "tao" && event.player !== player && event.cards.filterInD().length > 0) {
					return true;
				}
			}
			return false;
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			player.$fullscreenpop("猴子偷桃", "fire");
			trigger.untrigger();
			trigger.finish();
			await player.discard(player.getEquip(5));
			await player.gain(trigger.cards.filterInD(), "gain2", "log");
		},
	},
	mianju: {
		// audio: "ext:欢乐卡牌/audio/skill:true",
		trigger: {
			player: "turnOverBefore",
		},
		forced: true,
		equipSkill: true,
		async content(event, trigger, player) {
			trigger.cancel();
		},
		ai: {
			noturnOver: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "turnOver")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	kuwu: {
		audio: "ext:欢乐卡牌/audio/skill:true",
		trigger: {
			source: "damageSource",
		},
		forced: true,
		equipSkill: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name === "sha" && event.notLink() && event.player.countCards("he") > 0;
		},
		async content(event, trigger, player) {
			await trigger.player.chooseToDiscard(true, "he");
		},
	},
	xuelunyang: {
		audio: "ext:欢乐卡牌/audio/skill:true",
		trigger: { player: "phaseBegin" },
		equipSkill: true,
		filter(event, player) {
			return game.hasPlayer(
				current =>
					player !== current &&
					current.getSkills(null, false, false).filter(skill => {
						const info = get.info(skill);
						return info && !info.charlotte;
					}).length
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return (
						player !== target &&
						target.getSkills(null, false, false).filter(skill => {
							const info = get.info(skill);
							return info && !info.charlotte;
						}).length
					);
				})
				.set("ai", target => {
					return Math.random();
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const skills = target.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				return info && !info.charlotte;
			});
			if (!skills.length) {
				return;
			}
			const links = await player
				.chooseButton(["选择获得一个技能", [skills, "skill"]])
				.set("displayIndex", false)
				.set("ai", button => {
					const player = get.player();
					let info = get.info(button.link);
					if (info?.ai?.neg || info?.ai?.halfneg) {
						return 0;
					}
					return get.skillRank(button.link, "in");
				})
				.forResultLinks();
			if (!links?.length) {
				return;
			}
			await player.addTempSkills(links[0]);
		},
	},
	jiuwei: {
		trigger: {
			player: "phaseEnd",
		},
		audio: "ext:欢乐卡牌/audio/skill:true",
		frequent: true,
		equipSkill: true,
		async content(event, trigger, player) {
			if (player.isDamaged()) {
				await player.recover();
			} else {
				await player.draw();
			}
		},
	},
};

export default skill;
