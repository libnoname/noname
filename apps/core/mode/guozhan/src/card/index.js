import { lib, get, game, ui, _status } from "noname";

const jiubianQizhenNames = ["zhanshejian", "yangsuiqiang", "huohuanyi", "baiqilin", "tianlu", "yingwubei", "dunjiatianshu", "jiuzhouding"];
const isJiubianQizhen = card => get.cardtag(card, "qizhen") || get.cardtag(card, "gz_qizhen");

export default {
	junling1: {
		type: "junling",
		vanish: true,
		derivation: "guozhan",
	},
	junling2: {
		type: "junling",
		vanish: true,
		derivation: "guozhan",
	},
	junling3: {
		type: "junling",
		vanish: true,
		derivation: "guozhan",
	},
	junling4: {
		type: "junling",
		vanish: true,
		derivation: "guozhan",
	},
	junling5: {
		type: "junling",
		vanish: true,
		derivation: "guozhan",
	},
	junling6: {
		type: "junling",
		vanish: true,
		derivation: "guozhan",
	},
	zhulian_card: {
		cardimage: "wuzhong",
	},
	duoduo: {
		audio: true,
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: 1,
		filterTarget(card, player, target) {
			return target.identity !== "unknown";
		},
		async content(event, trigger, player) {
			const target = event.target;
			await target.mayChangeVice(true);
			await target.damage();
		},
		ai: {
			basic: {
				order: 6,
				useful: 4,
				value: 6,
			},
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target);
				},
			},
			tag: {
				damage: 1,
			},
		},
	},
	qiaoqu: {
		audio: true,
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: [1, 2],
		filterTarget(card, player, target) {
			return target !== player;
		},
		async content(event, trigger, player) {
			const target = event.target;
			const cards = target.getCards("h");
			if (!cards.length) {
				return;
			}
			await target.showCards(cards, `${get.translation(target)}展示了所有手牌`);
			const equips = cards.filter(card => get.type(card) === "equip" && get.owner(card) === target && get.position(card) === "h");
			if (equips.length) {
				await player.gain({ cards: equips, source: target, animate: "giveAuto" });
			}
		},
		ai: {
			basic: {
				order: 7,
				useful: 4,
				value: 6,
			},
			result: {
				target(player, target) {
					return -target.countCards("h", card => get.type(card) === "equip");
				},
			},
			tag: {
				gain: 1,
				loseCard: 1,
			},
		},
	},
	fendao: {
		audio: true,
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: 1,
		filterTarget(card, player, target) {
			if (lib.skill.gz_gouni?.subSkill?.effect?.blocksCard?.(card, player, target)) {
				return false;
			}
			return target !== player && player.identity !== "unknown" && player.identity !== "ye" && target.identity === player.identity;
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.draw(6);
			const result = await player
				.chooseCard({ position: "h", selectCard: 3, forced: true, prompt: `交给${get.translation(target)}三张手牌` })
				.set("ai", card => 6 - get.value(card))
				.forResult();
			if (result.cards?.length) {
				await player.give(result.cards, target);
			}
			player.identity = "ye";
			player._ye = true;
			player.identityShown = true;
			player.setIdentity("ye");
			player.node.identity.classList.remove("guessing");
			game.log(player, "成为了", "#g野心家");
		},
		recastable: true,
		ai: {
			basic: {
				order: 5,
				useful: 5,
				value: 5,
			},
			result: {
				target(player, target) {
					return get.attitude(player, target) > 0 ? 2 : -1;
				},
			},
			tag: {
				draw: 6,
				gain: 1,
			},
		},
	},
	tuqiong: {
		audio: true,
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: 1,
		filterTarget(card, player, target) {
			return target !== player;
		},
		async content(event, trigger, player) {
			const target = event.target;
			const cards = Array.from(ui.discardPile.childNodes).filter(card => isJiubianQizhen(card));
			if (cards.length) {
				const result = await player
					.chooseButton({ createDialog: ["选择弃牌堆中的一张奇珍牌", cards], forced: true })
					.set("ai", button => get.value(button.link, target))
					.forResult();
				if (result.links?.length) {
					await target.chooseUseTarget({ card: result.links[0], forced: true, nopopup: true });
				}
			}
			player.addTempSkill("tuqiong_range", "phaseAfter");
			player.markAuto("tuqiong_range", [target]);
		},
		ai: {
			basic: {
				order: 4,
				useful: 4,
				value: 5,
			},
			result: {
				target(player, target) {
					return get.attitude(player, target) > 0 ? 1 : -0.5;
				},
			},
		},
	},
	gouwei: {
		audio: true,
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: -1,
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.target;
			const cards = Array.from(ui.discardPile.childNodes).filter(card => isJiubianQizhen(card));
			if (!cards.length) {
				await target.draw();
				return;
			}
			const result = await target
				.chooseButton({ createDialog: ["选择并使用弃牌堆中的一张奇珍牌", cards], forced: true })
				.set("ai", button => get.value(button.link, target))
				.forResult();
			if (result.links?.length) {
				await target.chooseUseTarget({ card: result.links[0], forced: true, nopopup: true });
			}
		},
		ai: {
			basic: {
				order: 3,
				useful: 5,
				value: 5,
			},
			result: {
				target(player, target) {
					return 1;
				},
			},
			tag: {
				draw: 1,
			},
		},
	},
	lveshan: {
		audio: "shan",
		fullskin: true,
		type: "basic",
		cardcolor: "red",
		notarget: true,
		nodelay: true,
		async content(event, trigger, player) {
			event.result = "shaned";
			event.getParent().delayx = false;
			await game.delay(0.5);
		},
		ai: {
			order: 3,
			basic: {
				useful: [7.5, 5.6, 2.4],
				value: [7.5, 5.6, 2.4],
			},
			result: { player: 1 },
			tag: {
				respondShan: 1,
			},
		},
	},
	yangsuiqiang: {
		audio: true,
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -2 },
		ai: {
			basic: {
				equipValue: 4,
			},
		},
		skills: ["yangsuiqiang_skill"],
	},
	yangsuiqiang_skill: {
		equipSkill: true,
		forced: true,
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.card?.name == "sha" && event.player?.isIn();
		},
		async content(event, trigger, player) {
			await trigger.player.damage({ nature: "fire", nosource: true });
		},
	},
	dunjiatianshu: {
		audio: true,
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		ai: {
			basic: {
				equipValue: 5,
			},
		},
		skills: ["dunjiatianshu_skill"],
	},
	dunjiatianshu_skill: {
		equipSkill: true,
		audio: true,
		enable: "phaseUse",
		usable: 2,
		async content(event, trigger, player) {
			await player.changeVice().set("repeat", true);
		},
		ai: {
			order: 8,
			result: {
				player(player) {
					return get.guozhanRank(player.name2, player) <= 3 ? 1 : 0.2;
				},
			},
		},
	},
	huohuanyi: {
		audio: true,
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		ai: {
			basic: {
				equipValue: 6,
			},
		},
		skills: ["huohuanyi_prevent", "huohuanyi_damage"],
	},
	huohuanyi_prevent: {
		equipSkill: true,
		forced: true,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return event.hasNature();
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
	},
	huohuanyi_damage: {
		equipSkill: true,
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name != "sha" || !target.countCards("h") || get.attitude(target, player) >= 0) {
						return;
					}
					const hasTengjia = player.getEquips("tengjia").length > 0 && !player.hasSkillTag("unequip2");
					const cannotSave = player.hp <= 1 && !player.countCards("hs", card => get.tag(card, "save")) && !player.hasSkillTag("save", true);
					if (hasTengjia || cannotSave) {
						return [0, 0, 0, -1];
					}
				},
			},
		},
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.card?.name == "sha" && event.player?.isIn() && player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseToDiscard({ position: "h", prompt: `是否弃置一张手牌，对${get.translation(trigger.player)}造成1点火焰伤害？` })
				.set("ai", card => {
					if (get.damageEffect(trigger.player, player, player, "fire") <= 0) {
						return 0;
					}
					return 6 - get.value(card);
				})
				.forResult();
			if (result.bool) {
				await trigger.player.damage({ nature: "fire" });
			}
		},
	},
	zhanshejian: {
		audio: true,
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -1 },
		ai: {
			basic: {
				equipValue: 5,
			},
		},
		skills: ["zhanshejian_skill"],
	},
	zhanshejian_skill: {
		equipSkill: true,
		forced: true,
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.card?.name == "sha";
		},
		async content(event, trigger, player) {
			if (player.isDamaged()) {
				await player.recover();
			}
			if (trigger.player?.isIn() && (get.is.jun(trigger.player.name1) || trigger.player.identity == "ye")) {
				await trigger.player.die(player);
			}
		},
	},
	baiqilin: {
		audio: true,
		fullskin: true,
		type: "equip",
		subtype: "equip3",
		distance: { globalTo: 2 },
		ai: {
			basic: {
				equipValue: 5,
			},
			tag: {
				damage: 1,
				thunderDamage: 1,
			},
		},
		skills: ["baiqilin_skill"],
	},
	baiqilin_skill: {
		equipSkill: true,
		forced: true,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return event.card?.name == "baiqilin";
		},
		async content(event, trigger, player) {
			const hp = player.hp;
			const targets = game.filterPlayer(current => current.isIn() && current != player && current.hp > hp).sortBySeat();
			for (const target of targets) {
				if (target.isIn()) {
					await target.damage({ nature: "thunder", nosource: true });
				}
			}
		},
	},
	yingwubei: {
		audio: true,
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		ai: {
			basic: {
				equipValue: 6,
			},
		},
		skills: ["yingwubei_skill"],
	},
	yingwubei_skill: {
		equipSkill: true,
		audio: true,
		enable: "chooseToUse",
		usable: 9,
		hiddenCard(player, name) {
			return name == "jiu" && player.hasCard(card => card.name == "yingwubei", "e");
		},
		filter(event, player) {
			if (!player.hasCard(card => card.name == "yingwubei", "e")) return false;
			return event.filterCard(get.autoViewAs({ name: "jiu", isCard: true }, "unsure"), player, event);
		},
		viewAs(cards, player) {
			return { name: "jiu", isCard: true };
		},
		filterCard: () => false,
		selectCard: -1,
		prompt: "将牌堆顶的牌当【酒】使用",
		log: false,
		async precontent(event, trigger, player) {
			player.logSkill("yingwubei_skill");
			const cards = get.cards();
			event.result.card = get.autoViewAs({ name: "jiu", isCard: true }, cards);
			event.result.cards = cards;
			game.cardsGotoOrdering(cards);
		},
		ai: {
			order: 4,
			result: {
				player(player) {
					return player.hp <= 1 ? 1 : 0.4;
				},
			},
		},
	},
	jiuzhouding: {
		audio: true,
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		async onEquip(event, trigger, player) {
			if (_status.mode == "jiubian" && !_status.overing && player.hasCard(card => card.name == "jiuzhouding", "e") && player.countCards("e", card => isJiubianQizhen(card)) >= 4) {
				game.broadcastAll(id => {
					game.winner_id = id;
				}, player.playerid);
				game.log(player, "因", "#y九州鼎", "达成胜利条件");
				game.checkResult();
			}
		},
		ai: {
			basic: {
				equipValue: 8,
			},
		},
		skills: ["jiuzhouding_skill"],
	},
	jiuzhouding_skill: {
		equipSkill: true,
		forced: true,
		trigger: { player: "equipAfter" },
		filter(event, player) {
			return _status.mode == "jiubian" && !_status.overing && player.hasCard(card => card.name == "jiuzhouding", "e") && player.countCards("e", card => isJiubianQizhen(card)) >= 4;
		},
		async content(event, trigger, player) {
			game.broadcastAll(id => {
				game.winner_id = id;
			}, player.playerid);
			game.log(player, "因", "#y九州鼎", "达成胜利条件");
			game.checkResult();
		},
	},
	tianlu: {
		audio: true,
		fullskin: true,
		type: "equip",
		subtype: "equip4",
		distance: { globalFrom: -3 },
		ai: {
			basic: {
				equipValue: 7,
			},
		},
		skills: ["tianlu_skill"],
	},
	tianlu_skill: {
		equipSkill: true,
		charlotte: true,
		forced: true,
		silent: true,
		trigger: {
			player: ["equipAfter", "showCharacterEnd", "changeGroupAfter"],
			global: ["gameStart", "showCharacterEnd", "changeGroupAfter", "dieAfter", "phaseBefore"],
		},
		lordSkillMap: {
			wei: "jianan",
			shu: "shouyue",
			wu: "jiahe",
			qun: "hongfa",
			jin: "gz_jiaping",
		},
		lordMarkMap: {
			jianan: "wuziliangjiangdao",
			shouyue: "wuhujiangdaqi",
			jiahe: "yuanjiangfenghuotu",
			hongfa: "huangjintianbingfu",
			gz_jiaping: "bahuangsishiling",
		},
		getLordSkill(player) {
			if (_status.mode != "jiubian" || !player?.isIn?.() || !player.hasCard(card => card.name == "tianlu", "e")) {
				return null;
			}
			const group = player.identity;
			if (!group || group == "unknown" || group == "ye") {
				return null;
			}
			const skill = lib.skill.tianlu_skill.lordSkillMap[group];
			if (!skill || !lib.skill[skill]) {
				return null;
			}
			if (game.hasPlayer(current => current != player && get.is.jun(current) && !current.isUnseen() && current.isFriendOf(player))) {
				return null;
			}
			return skill;
		},
		isTianluZhu(player, skill, group) {
			if (!skill || (group && player.identity != group)) {
				return false;
			}
			return lib.skill.tianlu_skill.getLordSkill(player) == skill;
		},
		clear(player) {
			const skill = player.storage.tianlu_skill;
			if (skill) {
				player.removeAdditionalSkill("tianlu_skill");
				const mark = lib.skill.tianlu_skill.lordMarkMap[skill];
				if (mark) {
					player.unmarkSkill(mark);
				}
				delete player.storage.tianlu_skill;
			}
		},
		onremove(player) {
			lib.skill.tianlu_skill.clear(player);
		},
		filter(event, player) {
			return _status.mode == "jiubian";
		},
		async content(event, trigger, player) {
			const skill = lib.skill.tianlu_skill.getLordSkill(player);
			const oldSkill = player.storage.tianlu_skill;
			if (oldSkill == skill) {
				return;
			}
			if (oldSkill) {
				await player.removeAdditionalSkills("tianlu_skill");
				const mark = lib.skill.tianlu_skill.lordMarkMap[oldSkill];
				if (mark) {
					player.unmarkSkill(mark);
				}
				delete player.storage.tianlu_skill;
			}
			if (skill) {
				player.storage.tianlu_skill = skill;
				await player.addAdditionalSkills("tianlu_skill", skill);
			}
		},
	},
};
