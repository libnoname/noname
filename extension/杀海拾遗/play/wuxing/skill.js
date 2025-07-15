import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCardConfig['skill'] } */
const skill = {
	_shengke: {
		trigger: { target: "useCardToBegin" },
		forced: true,
		popup: false,
		filter(event, player) {
			return !_status.connectMode && event.card.wunature && player.wunature;
		},
		async content(event, trigger, player) {
			const { wunature: cardNature } = trigger.card;
			const playerNature = player.wunature;

			// 定义五行生克关系映射
			const RELATIONS = {
				metal: {
					ke: "wood", sheng: "water",
					keLog: "金克木", shengLog: "金生水",
				},
				wood: {
					ke: "soil", sheng: "fire",
					keLog: "木克土", shengLog: "木生火",
				},
				water: {
					ke: "fire", sheng: "wood",
					keLog: "水克火", shengLog: "水生木",
				},
				fire: {
					ke: "metal", sheng: "soil",
					keLog: "火克金", shengLog: "火生土",
				},
				soil: {
					ke: "water", sheng: "metal",
					keLog: "土克水", shengLog: "土生金",
				},
			};

			const nature = RELATIONS[cardNature];
			if (playerNature === nature.ke) {
				if (player.countCards("he")) {
					game.log(player, `被${get.translation(cardNature)}属性的卡牌克制`);
					await player.chooseToDiscard(`你被${get.translation(cardNature)}属性卡牌克制，需弃置一张牌`, true, "he").set("ai", get.disvalue);
					player.popup(nature.keLog);
				}
			} else if (playerNature === nature.sheng) {
				game.log(player, `得到${get.translation(cardNature)}属性卡牌的加成`);
				await player.draw();
				player.popup(nature.shengLog);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (typeof card !== "object" || !card.wunature || current === 0) {
						return;
					}

					const RELATIONS = {
						metal: { ke: "wood", sheng: "water" },
						wood: { ke: "soil", sheng: "fire" },
						water: { ke: "fire", sheng: "wood" },
						fire: { ke: "metal", sheng: "soil" },
						soil: { ke: "water", sheng: "metal" },
					};

					const nature = RELATIONS[card.wunature];
					if (target.wunature === nature.ke) {
						return [1, -0.3];
					}
					if (target.wunature === nature.sheng) {
						return [1, 0.3];
					}
				},
			},
		},
	},
	wuxingpan_skill: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		lose: false,
		prompt: "选择一张手牌永久改变其五行属性",
		async content(event, trigger, player) {
			const card = event.cards[0];
			const control = await player.chooseControl("metal", "wood", "water", "fire", "soil").forResultControl();
			if (!card.node.wuxing) {
				card.node.wuxing = ui.create.div(".wunature", card);
			}
			card.wunature = control;
			card.node.wuxing.dataset.nature = control;
			card.node.wuxing.innerHTML = get.translation(control);
		},
	},
};

export default skill;
