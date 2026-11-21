import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCardConfig['skill'] } */
const skill = {
	ziyangdan: {
		trigger: { player: "phaseBegin" },
		silent: true,
		init(player) {
			player.storage.ziyangdan = 3;
		},
		onremove: true,
		content() {
			if (player.hujia > 0) {
				player.changeHujia(-1);
			}
			player.storage.ziyangdan--;
			if (player.hujia === 0 || player.storage.ziyangdan === 0) {
				player.removeSkill("ziyangdan");
			}
		},
		ai: {
			threaten: 0.8,
		},
	},
	luyugeng: {
		mark: "card",
		enable: "phaseUse",
		usable: 1,
		nopop: true,
		filterCard: { type: "basic" },
		filter(event, player) {
			return player.countCards("h", { type: "basic" });
		},
		intro: {
			content(storage, player) {
				return "出牌阶段限一次，你可以弃置一张基本牌并发现一张牌，持续三回合（剩余" + player.storage.luyugeng_markcount + "回合）";
			},
		},
		content() {
			player.discoverCard();
		},
		group: "luyugeng_count",
		subSkill: {
			count: {
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				content() {
					player.storage.luyugeng_markcount--;
					if (player.storage.luyugeng_markcount === 0) {
						delete player.storage.luyugeng;
						delete player.storage.luyugeng_markcount;
						player.removeSkill("luyugeng");
					} else {
						player.updateMarks();
					}
				},
			},
		},
	},
	xiajiao: {
		mark: "card",
		trigger: { player: ["phaseUseBefore", "phaseEnd"] },
		forced: true,
		popup: false,
		nopop: true,
		filter(event, player) {
			return !player.hasSkill("xiajiao3");
		},
		intro: {
			content(storage, player) {
				return "你在摸牌阶段额外摸一张牌，然后弃置一张牌（剩余" + player.storage.xiajiao_markcount + "回合）";
			},
		},
		content() {
			player.storage.xiajiao_markcount--;
			if (player.storage.xiajiao_markcount === 0) {
				delete player.storage.xiajiao;
				delete player.storage.xiajiao_markcount;
				player.removeSkill("xiajiao");
			} else {
				player.updateMarks();
			}
			player.addTempSkill("xiajiao3");
		},
		group: "xiajiao_draw",
		subSkill: {
			draw: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				content() {
					trigger.num++;
					player.addTempSkill("xiajiao2");
				},
			},
		},
	},
	xiajiao2: {
		trigger: { player: "phaseDrawAfter" },
		silent: true,
		content() {
			player.chooseToDiscard("he", true);
		},
	},
	xiajiao3: {},
	mizhilianou: {
		mark: "card",
		trigger: { player: "phaseAfter" },
		forced: true,
		popup: false,
		nopop: true,
		intro: {
			content(storage, player) {
				return "你可以将一张红桃牌当作桃使用（剩余" + player.storage.mizhilianou_markcount + "回合）";
			},
		},
		content() {
			player.storage.mizhilianou_markcount--;
			if (player.storage.mizhilianou_markcount === 0) {
				delete player.storage.mizhilianou;
				delete player.storage.mizhilianou_markcount;
				player.removeSkill("mizhilianou");
			} else {
				player.updateMarks();
			}
		},
		group: "mizhilianou_use",
		subSkill: {
			use: {
				enable: "chooseToUse",
				filterCard: { suit: "heart" },
				position: "he",
				viewAs: { name: "tao" },
				viewAsFilter(player) {
					return player.countCards("he", { suit: "heart" }) > 0;
				},
				prompt: "将一张红桃牌当桃使用",
				check(card) {
					return 10 - get.value(card);
				},
				ai: {
					skillTagFilter(player) {
						return player.countCards("he", { suit: "heart" }) > 0;
					},
					save: true,
					respondTao: true,
				},
			},
		},
	},
	chunbing: {
		mark: "card",
		trigger: { player: "phaseAfter" },
		forced: true,
		popup: false,
		nopop: true,
		intro: {
			content(storage, player) {
				return "你的手牌上限+1（剩余" + player.storage.chunbing_markcount + "回合）";
			},
		},
		mod: {
			maxHandcard(player, num) {
				return num + 1;
			},
		},
		content() {
			player.storage.chunbing_markcount--;
			if (player.storage.chunbing_markcount === 0) {
				delete player.storage.chunbing;
				delete player.storage.chunbing_markcount;
				player.removeSkill("chunbing");
			} else {
				player.updateMarks();
			}
		},
	},
	gudonggeng: {
		mark: "card",
		trigger: { player: "phaseBegin" },
		forced: true,
		popup: false,
		nopop: true,
		intro: {
			content(storage, player) {
				return "当你下一次受到杀造成的伤害时，令伤害-1（剩余" + player.storage.gudonggeng_markcount + "回合）";
			},
		},
		content() {
			player.storage.gudonggeng_markcount--;
			if (player.storage.gudonggeng_markcount === 0) {
				delete player.storage.gudonggeng;
				delete player.storage.gudonggeng_markcount;
				player.removeSkill("gudonggeng");
			} else {
				player.updateMarks();
			}
		},
		group: "gudonggeng_damage",
		subSkill: {
			damage: {
				trigger: { player: "damageBegin" },
				filter(event, player) {
					return event.card && event.card.name === "sha" && event.num > 0;
				},
				forced: true,
				content() {
					trigger.num--;
					delete player.storage.gudonggeng;
					delete player.storage.gudonggeng_markcount;
					player.removeSkill("gudonggeng");
				},
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name === "sha" && get.attitude(player, target) < 0) {
						return 0.5;
					}
				},
			},
		},
	},
	qingtuan: {
		mark: "card",
		trigger: { player: "phaseAfter" },
		forced: true,
		popup: false,
		nopop: true,
		intro: {
			content(storage, player) {
				return "你在回合内使用首张杀时摸一张牌（剩余" + player.storage.qingtuan_markcount + "回合）";
			},
		},
		content() {
			player.storage.qingtuan_markcount--;
			if (player.storage.qingtuan_markcount === 0) {
				delete player.storage.qingtuan;
				delete player.storage.qingtuan_markcount;
				player.removeSkill("qingtuan");
			} else {
				player.updateMarks();
			}
		},
		group: "qingtuan_draw",
		subSkill: {
			draw: {
				trigger: { player: "useCard" },
				filter(event, player) {
					return event.card.name === "sha" && _status.currentPhase === player;
				},
				usable: 1,
				forced: true,
				content() {
					player.draw();
				},
			},
		},
	},
	liyutang: {
		mark: "card",
		trigger: { player: "phaseEnd" },
		forced: true,
		popup: false,
		nopop: true,
		intro: {
			content(storage, player) {
				return "结束阶段，若你的体力值为全场最少或之一，你获得1点护甲（剩余" + player.storage.liyutang_markcount + "回合）";
			},
		},
		content() {
			if (player.isMinHp()) {
				player.logSkill("liyutang");
				player.changeHujia();
			}
			player.storage.liyutang_markcount--;
			if (player.storage.liyutang_markcount === 0) {
				delete player.storage.liyutang;
				delete player.storage.liyutang_markcount;
				player.removeSkill("liyutang");
			} else {
				player.updateMarks();
			}
		},
	},
	yougeng: {
		mark: "card",
		trigger: { player: "phaseBegin" },
		forced: true,
		popup: false,
		nopop: true,
		intro: {
			content(storage, player) {
				return "准备阶段，若你的体力值为全场最少或之一，你回复1点体力（剩余" + player.storage.yougeng_markcount + "回合）";
			},
		},
		content() {
			if (player.isDamaged() && player.isMinHp()) {
				player.logSkill("yougeng");
				player.recover();
			}
			player.storage.yougeng_markcount--;
			if (player.storage.yougeng_markcount === 0) {
				delete player.storage.yougeng;
				delete player.storage.yougeng_markcount;
				player.removeSkill("yougeng");
			} else {
				player.updateMarks();
			}
		},
	},
	molicha: {
		mark: "card",
		trigger: { player: "phaseAfter" },
		forced: true,
		popup: false,
		nopop: true,
		intro: {
			content(storage, player) {
				return "你不能成为其他角色的黑色牌的目标（剩余" + player.storage.molicha_markcount + "回合）";
			},
		},
		mod: {
			targetEnabled(card, player, target) {
				if (player !== target && get.color(card) === "black") {
					return false;
				}
			},
		},
		content() {
			player.storage.molicha_markcount--;
			if (player.storage.molicha_markcount === 0) {
				delete player.storage.molicha;
				delete player.storage.molicha_markcount;
				player.removeSkill("molicha");
				player.logSkill("molicha");
			} else {
				player.updateMarks();
			}
		},
	},
	yuanbaorou: {
		mark: "card",
		trigger: { player: "phaseAfter" },
		forced: true,
		popup: false,
		nopop: true,
		intro: {
			content(storage, player) {
				return "你在出牌阶段可以额外使用一张杀（剩余" + player.storage.yuanbaorou_markcount + "回合）";
			},
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name === "sha") {
					return num + 1;
				}
			},
		},
		content() {
			player.storage.yuanbaorou_markcount--;
			if (player.storage.yuanbaorou_markcount === 0) {
				delete player.storage.yuanbaorou;
				delete player.storage.yuanbaorou_markcount;
				player.removeSkill("yuanbaorou");
			} else {
				player.updateMarks();
			}
		},
	},
	tanhuadong: {
		mark: "card",
		trigger: { player: "phaseEnd" },
		forced: true,
		popup: false,
		nopop: true,
		intro: {
			content(storage, player) {
				return "出牌阶段结束时，你摸一张牌（剩余" + player.storage.tanhuadong_markcount + "回合）";
			},
		},
		content() {
			player.storage.tanhuadong_markcount--;
			if (player.storage.tanhuadong_markcount === 0) {
				delete player.storage.tanhuadong;
				delete player.storage.tanhuadong_markcount;
				player.removeSkill("tanhuadong");
			} else {
				player.updateMarks();
			}
		},
		group: "tanhuadong_draw",
		subSkill: {
			draw: {
				trigger: { player: "phaseUseEnd" },
				forced: true,
				content() {
					player.draw();
				},
			},
		},
	},
	mapodoufu: {
		mark: "card",
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		popup: false,
		nopop: true,
		forceLoad: true,
		intro: {
			content(storage, player) {
				return "结束阶段，你随机弃置一名随机敌人的一张随机牌（剩余" + player.storage.mapodoufu_markcount + "回合）";
			},
		},
		content() {
			var list = player.getEnemies();
			for (var i = 0; i < list.length; i++) {
				if (!list[i].countCards("he")) {
					list.splice(i--, 1);
				}
			}
			var target = list.randomGet();
			if (target) {
				player.logSkill("mapodoufu", target);
				target.discard(target.getCards("he").randomGet());
				target.addExpose(0.2);
			}
			player.storage.mapodoufu_markcount--;
			if (player.storage.mapodoufu_markcount === 0) {
				delete player.storage.mapodoufu;
				delete player.storage.mapodoufu_markcount;
				player.removeSkill("mapodoufu");
			} else {
				player.updateMarks();
			}
		},
	},
	yunvyuanshen_skill: {
		mark: "card",
		intro: {
			content: "下一进入濒死状态时回复1点体力",
		},
		trigger: { player: "dying" },
		forced: true,
		priority: 6.1,
		onremove: true,
		filter(event, player) {
			return player.hp <= 0;
		},
		content() {
			player.recover();
			player.removeSkill("yunvyuanshen_skill");
		},
	},
	heilonglinpian: {
		mark: true,
		marktext: "鳞",
		intro: {
			content: "防御距离+1",
		},
		mod: {
			globalTo(from, to, distance) {
				return distance + 1;
			},
		},
	},
	mutoumianju_skill: {
		equipSkill: true,
		enable: "chooseToUse",
		filterCard: true,
		usable: 1,
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (!player.countCards("h")) {
				return false;
			}
		},
		prompt: "将一张手牌当杀使用",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			respondSha: true,
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
			skillTagFilter(player, tag, arg) {
				if (arg !== "use") {
					return false;
				}
				if (!player.countCards("h")) {
					return false;
				}
			},
		},
	},
	gjyuheng_skill: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		filterCard: { suit: "spade" },
		check(card) {
			return 8 - get.value(card);
		},
		filter(event, player) {
			if (!player.countCards("h", { suit: "spade" })) {
				return false;
			}
			var enemies = player.getEnemies();
			for (var i = 0; i < enemies.length; i++) {
				if (enemies[i].countCards("h", { suit: "spade" })) {
					return true;
				}
			}
			return false;
		},
		content() {
			var enemies = player.getEnemies();
			var list = [];
			for (var i = 0; i < enemies.length; i++) {
				var hs = enemies[i].getCards("h", { suit: "spade" });
				if (hs.length) {
					list.push([enemies[i], hs]);
				}
			}
			if (list.length) {
				var current = list.randomGet();
				player.line(current[0]);
				current[0].give(current[1].randomGet(), player, true);
			}
			"step 1";
			var card = player.getEquip("gjyuheng");
			if (card) {
				if (typeof card.storage.gjyuheng !== "number") {
					card.storage.gjyuheng = 1;
				} else {
					card.storage.gjyuheng++;
				}
				if (card.storage.gjyuheng >= 3) {
					card.init([card.suit, card.number, "gjyuheng_plus", card.nature]);
					player.addTempSkill("gjyuheng_plus_temp");
				}
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	gjyuheng_plus_temp: {},
	gjyuheng_plus_skill: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		filterCard: { color: "black" },
		check(card) {
			return 8 - get.value(card);
		},
		filter(event, player) {
			// if(player.hasSkill('gjyuheng_plus_temp')) return false;
			if (!player.countCards("h", { color: "black" })) {
				return false;
			}
			var enemies = player.getEnemies();
			for (var i = 0; i < enemies.length; i++) {
				if (enemies[i].countCards("h", { suit: "spade" })) {
					return true;
				}
			}
			return false;
		},
		content() {
			var enemies = player.getEnemies();
			var list = [];
			for (var i = 0; i < enemies.length; i++) {
				var hs = enemies[i].getCards("h", { suit: "spade" });
				if (hs.length) {
					list.push([enemies[i], hs]);
				}
			}
			if (list.length) {
				var current = list.randomGet();
				player.line(current[0]);
				current[0].give(current[1].randomGet(), player, true);
			}
			"step 1";
			var card = player.getEquip("gjyuheng_plus");
			if (card) {
				if (typeof card.storage.gjyuheng !== "number") {
					card.storage.gjyuheng = 1;
				} else {
					card.storage.gjyuheng++;
				}
				if (card.storage.gjyuheng >= 7) {
					card.init([card.suit, card.number, "gjyuheng_pro", card.nature]);
				}
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	gjyuheng_pro_skill: {
		equipSkill: true,
		enable: "phaseUse",
		filterCard: { color: "black" },
		check(card) {
			return 8 - get.value(card);
		},
		filter(event, player) {
			if (!player.countCards("h", { color: "black" })) {
				return false;
			}
			var enemies = player.getEnemies();
			for (var i = 0; i < enemies.length; i++) {
				if (enemies[i].countCards("h", { suit: "spade" })) {
					return true;
				}
			}
			return false;
		},
		content() {
			var enemies = player.getEnemies();
			var list = [];
			for (var i = 0; i < enemies.length; i++) {
				var hs = enemies[i].getCards("h", { suit: "spade" });
				if (hs.length) {
					list.push([enemies[i], hs]);
				}
			}
			if (list.length) {
				var current = list.randomGet();
				player.line(current[0]);
				current[0].give(current[1].randomGet(), player, true);
			}
			"step 1";
			var card = player.getEquip("gjyuheng");
			if (card) {
				if (typeof card.storage.gjyuheng !== "number") {
					card.storage.gjyuheng = 1;
				} else {
					card.storage.gjyuheng++;
				}
				if (card.storage.gjyuheng >= 3) {
					card.init([card.suit, card.number, "gjyuheng_plus", card.nature]);
					player.addTempSkill("gjyuheng_plus_temp");
				}
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	shihuifen: {
		mark: true,
		intro: {
			content: "使用卡牌无法指定其他角色为目标",
		},
		mod: {
			playerEnabled(card, player, target) {
				if (player !== target) {
					return false;
				}
			},
		},
	},
	g_shihuifen: {
		trigger: { global: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			if (event.player.hasSkill("shihuifen")) {
				return false;
			}
			if (event.player === player) {
				return false;
			}
			if (!lib.filter.targetEnabled({ name: "shihuifen" }, player, event.player)) {
				return false;
			}
			return player.hasCard("shihuifen") || player.hasSkillTag("shihuifen");
		},
		content() {
			player.chooseToUse(
				get.prompt("shihuifen", trigger.player).replace(/发动/, "使用"),
				function (card, player) {
					if (card.name !== "shihuifen") {
						return false;
					}
					return lib.filter.cardEnabled(card, player, "forceEnable");
				},
				trigger.player,
				-1
			).targetRequired = true;
		},
	},
	g_jinlianzhu: {
		trigger: { global: "damageBefore" },
		direct: true,
		filter(event, player) {
			if (!lib.filter.targetEnabled({ name: "jinlianzhu" }, player, event.player)) {
				return false;
			}
			return player.hasCard("jinlianzhu");
		},
		content() {
			player.chooseToUse(
				get.prompt("jinlianzhu", trigger.player).replace(/发动/, "使用"),
				function (card, player) {
					if (card.name !== "jinlianzhu") {
						return false;
					}
					return lib.filter.cardEnabled(card, player, "forceEnable");
				},
				trigger.player,
				-1
			).targetRequired = true;
		},
	},
};

export default skill;
