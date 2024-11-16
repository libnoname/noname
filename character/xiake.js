import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("character", function () {
	return {
		name: "xiake",
		character: {
			xk_guyuexuan: ["male", "qun", 4, ["rouquan", "gzhenji"]],
			xk_jinji: ["male", "shu", 4, ["zhongzhan", "lianpo"]],
			// xk_shenxiangyun:['female','wei',3,['zhenjiu']],
			// xk_fujianhan: ["male", "qun", 4, ["zitong"]],
		},
		skill: {
			zhongzhan: {
				trigger: { source: "damageBegin" },
				logTarget: "player",
				check: function (event, player) {
					if (
						get.damageEffect(event.player, player, player) > 0 &&
						get.attitude(player, event.player) < 0
					) {
						return player.hp > event.player.hp && player.hp >= 2;
					}
					return false;
				},
				content: function () {
					player.loseHp();
					trigger.num++;
				},
			},
			rouquan: {
				mod: {
					selectTarget: function (card, player, range) {
						if (card.name == "sha" && !player.getEquip(1) && range[1] != -1) range[1] = Infinity;
					},
				},
				enable: "phaseUse",
				position: "e",
				filter: function (event, player) {
					return player.hasCard(
						(card) => lib.skill.rouquan.filterCard(card, player),
						lib.skill.rouquan.position
					);
				},
				filterCard: lib.filter.cardRecastable,
				prompt: "将要重铸的牌置入弃牌堆并摸一张牌",
				discard: false,
				lose: false,
				delay: false,
				check: function (card, player) {
					var val = get.equipValue(card);
					var player = _status.event.player;
					var cards = player.getCards("h", { subtype: get.subtype(card) });
					for (var i = 0; i < cards.length; i++) {
						if (get.equipValue(cards[i]) >= val) {
							return 1;
						}
					}
					return 0;
				},
				content: function () {
					player.recast(cards);
				},
				ai: {
					order: 9.5,
					result: {
						player: 1,
					},
				},
			},
			gzhenji: {
				trigger: { source: "damageEnd" },
				frequent: true,
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return _status.currentPhase == player && event.card && event.card.name == "sha";
				},
				content: function () {
					player.draw();
					player.addTempSkill("gzhenji3");
				},
			},
			gzhenji3: {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return num + 1;
					},
				},
			},
			zitong: {
				trigger: { player: "useCard" },
				frequent: true,
				filter: function (event, player) {
					return _status.currentPhase == player && player.countUsed() == 3;
				},
				content: function () {
					var card = get.cardPile("chuansongmen");
					if (!card) {
						card = game.createCard("chuansongmen");
					}
					player.gain(card, "gain2");
				},
				ai: {
					threaten: 1.2,
				},
			},
		},
		translate: {
			xk_guyuexuan: "谷月轩",
			xk_jinji: "荆棘",
			xk_shenxiangyun: "沈湘芸",
			xk_fujianhan: "傅剑寒",
			zhongzhan: "重斩",
			zhongzhan_info: "每当你即将造成伤害，你可失去1点体力令伤害+1。",
			gzhenji: "震击",
			gzhenji_info: "你使用【杀】造成伤害后，可以摸一张牌，并且本回合内可以额外使用一张【杀】。",
			rouquan: "柔拳",
			rouquan_info: "你可以重铸装备区内的牌；当你没有武器牌时，你的【杀】可以指定任意个目标。",
			zitong: "通悟",
			zitong_info: "当你于自己的回合内使用第三张牌时，你可以将一张传送门置于你的手牌。",
		},
	};
});
