import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	chixueren: {
		derivation: "ol_shen_huangzhong",
		cardcolor: "heart",
		type: "equip",
		subtype: "equip1",
		distance: {
			attackFrom: -2,
			attackRange(card, player) {
				if (!player.hasSkill("shenyu", null, false, false)) {
					return 0;
				}
				return 3;
			},
		},
		loseDelay: false,
		cardPrompt(card, player) {
			let str = lib.translate[card.name + "_info"];
			const vcard = card[card.cardSymbol];
			const storage = vcard.storage?.chixueren;
			if (storage?.length) {
				str += `<br><span class="yellowtext"><li>已吞噬技能：${storage.map(i => get.poptip(i)).join("、")}</span>`;
			}
			return str;
		},
		async onEquip(event, trigger, player) {
			const { card } = event;
			const cards = card.cards;
			if (get.is.ordinaryCard(card) && cards[0].storage?.chixueren?.length) {
				return;
			}
			const lose = player.getHistory("lose", evt => {
				return evt.getlx == false && evt.type == "equip" && evt.getParent() == event.getParent() && evt.es?.length > 0;
			})[0];
			const allLose = game.getAllGlobalHistory("cardMove", evt => {
				return evt.name == "lose" && evt.getlx == false && evt.type == "equip" && evt.getParent().card.name == "chixueren" && evt.es?.length > 0;
			});
			if (lose && allLose.indexOf(lose) == 0) {
				const skills = get.skillsFromEquips(lose.es.filter(card => get.subtype(card) == "equip1"))
				if (!skills?.length) {
					return;
				}
				const addSkill = card => {
					game.broadcastAll(
						(card, skills) => {
							card.storage ??= {};
							card.storage.chixueren = skills;
							if (!Array.isArray(card.skills)) {
								card.skills = [...get.info(card).skills, ...skills];
							} else {
								card.skills.addArray(skills);
							}
							
						},
						card,
						skills
					);
				};
				addSkill(card);
				if (get.is.ordinaryCard(card)) {
					addSkill(cards[0]);
				}
				player.addEquipTrigger(card);
			}
		},
		async onLose(event, trigger, player) {
			const { cards } = event;
			if ((!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
				game.log(cards, "被销毁");
				await game.cardsGotoSpecial(cards, false);
				if (event.getParent().type == "gain") {
					event.getParent(2).cards.removeArray(cards);
				}
			}
		},
		ai: {
			equipValue(card, player) {
				if (!player.hasSkill("shenyu", null, false, false)) {
					return 0;
				}
				return 5;
			},
			basic: { equipValue: 5 },
		},
		skills: ["chixueren_skill"],
	},
	lusu_phaseZhunbei: {
		fullskin: true,
		noname: true,
	},
	lusu_phaseJudge: {
		fullskin: true,
		noname: true,
	},
	lusu_phaseDraw: {
		fullskin: true,
		noname: true,
	},
	lusu_phaseUse: {
		fullskin: true,
		noname: true,
	},
	lusu_phaseDiscard: {
		fullskin: true,
		noname: true,
	},
	lusu_phaseJieshu: {
		fullskin: true,
		noname: true,
	},
	sizhaojian: {
		derivation: "ol_sb_yuanshao",
		cardcolor: "diamond",
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		async onLose(event, trigger, player) {
			const { cards } = event;
			if (!lib.card.sizhaojian.inShanShanFestival() && (!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
				cards.forEach(card => {
					card.fix();
					card.remove();
					card.destroyed = true;
					game.log(card, "被销毁了");
				});
			}
		},
		inShanShanFestival() {
			//闪闪节外离开装备区会销毁
			const date = new Date();
			return date.getMonth() + 1 == 3 && date.getDate() >= 2 && date.getDate() <= 15;
		},
		distance: { attackFrom: -1 },
		ai: { basic: { equipValue: 7 } },
		skills: ["sizhaojian_skill"],
	},
};
export default cards;
