import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "huanlekapai",
		connect: true,
		card: {
			monkey: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["monkey"],
				ai: {
					basic: {
						equipValue: 8,
					},
				},
			},
			mianju: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				skills: ["mianju"],
				ai: {
					order: 9.5,
					basic: {
						equipValue(card, player) {
							if (!player.isTurnedOver()) {
								return 6;
							}
							if (player.isTurnedOver()) {
								return -10;
							}
							return 0;
						},
					},
				},
			},
			shoulijian: {
				audio: true,
				type: "basic",
				enable: true,
				fullskin: true,
				outrange: {
					global: 2,
				},
				filterTarget: lib.filter.notMe,
				content() {
					"step 0";
					if (!target.countCards("he", { type: "equip" })) {
						target.damage();
						event.finish();
					} else {
						target.chooseToDiscard("he", { type: "equip" }, "弃置一张装备牌或受到1点伤害").ai = function (card) {
							var player = _status.event.player;
							var source = _status.event.getParent().player;
							if (get.damageEffect(player, source, player) > 0) {
								return -1;
							}
							return 7 - get.value(card);
						};
					}
					"step 1";
					if (!result.bool) {
						target.damage();
					}
				},
				ai: {
					basic: {
						order: 9,
						value: 6,
						useful: 2,
					},
					result: {
						target: -2,
					},
					tag: {
						discard: 1,
						damage: 1,
					},
				},
				selectTarget: 1,
			},
			kuwu: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				skills: ["kuwu"],
				nomod: true,
				nopower: true,
				unique: true,
				distance: {
					attackFrom: -1,
				},
				ai: {
					equipValue: 6,
				},
			},
			xuelunyang: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["xuelunyang"],
				ai: {
					basic: {
						equipValue: 8,
					},
				},
			},
			jiuwei: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["jiuwei"],
				ai: {
					basic: {
						equipValue: 8,
					},
				},
			},
		},
		skill: {
			monkey: {
				equipSkill: true,
				trigger: {
					global: "useCardToBegin",
				},
				audio: true,
				filter(event, player) {
					var card = player.getEquip(5);
					if (card) {
						var name = card.name;
						if (name && name.indexOf("monkey") != -1 && event.name == "tao" && event.player != player && event.cards.filterInD().length > 0) {
							return true;
						}
					}
					return false;
				},
				check(event, player) {
					return get.attitude(player, event.player) <= 0;
				},
				content() {
					"step 0";
					player.$fullscreenpop("猴子偷桃", "fire");
					trigger.untrigger();
					trigger.finish();
					"step 1";
					player.discard(player.getEquip(5));
					"step 2";
					player.gain(trigger.cards.filterInD(), "gain2", "log");
				},
			},
			mianju: {
				audio: true,
				trigger: {
					player: "turnOverBefore",
				},
				forced: true,
				equipSkill: true,
				content() {
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
				audio: true,
				trigger: {
					source: "damageSource",
				},
				forced: true,
				equipSkill: true,
				filter(event, player) {
					if (event._notrigger.includes(event.player)) {
						return false;
					}
					return event.card && event.card.name == "sha" && event.notLink() && event.player.countCards("he") > 0;
				},
				content() {
					trigger.player.chooseToDiscard(true, "he");
				},
			},
			xuelunyang: {
				audio: true,
				trigger: { player: "phaseBegin" },
				equipSkill: true,
				filter(event, player) {
					return game.hasPlayer(
						current =>
							player != current &&
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
								player != target &&
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
							return get.skillRank(button.link, "inout");
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
				audio: true,
				frequent: true,
				equipSkill: true,
				content() {
					if (player.isDamaged()) {
						player.recover();
					} else {
						player.draw();
					}
				},
			},
		},
		translate: {
			monkey: "猴子",
			monkey_info: "猴子偷桃：当场上有其他角色使用【桃】时，你可以弃掉【猴子】，阻止【桃】的结算并将其收为手牌。",
			mianju: "漩涡面具",
			mianju_info: "<font color=#f00>锁定技</font> 你的武将牌不能被翻面。",
			shoulijian: "手里剑",
			shoulijian_info: "出牌阶段，对一名距离1以外的角色使用，令其弃置一张装备牌或受到1点伤害。",
			kuwu: "苦无",
			kuwu_info: "<font color=#f00>锁定技</font> 每当你使用【杀】造成一次伤害，受伤角色须弃置一张牌。",
			xuelunyang: "写轮眼",
			xuelunyang_info: "回合开始时，你可以选择一名其他角色，然后获得其一个技能直到回合结束。",
			jiuwei: "九尾",
			jiuwei_info: "（收集查克拉）回合结束时，若你已受伤，你可回复1点体力，否则摸一张牌。",
		},
		list: [
			["diamond", "5", "monkey"],
			["heart", "9", "jiuwei"],
			["heart", "2", "xuelunyang"],
			["spade", "6", "kuwu"],
			["diamond", "4", "shoulijian"],
			["spade", "4", "shoulijian"],
			["club", "3", "mianju"],
		],
	};
});
