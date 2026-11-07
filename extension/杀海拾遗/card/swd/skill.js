import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCardConfig['skill'] } */
const skill = {
	qiankundai: {
		equipSkill: true,
		mod: {
			maxHandcard(player, num) {
				return num + 1;
			},
		},
	},
	g_hufu_sha: {
		enable: ["chooseToRespond", "chooseToUse"],
		filter(event, player) {
			return player.countCards("h", "hufu") > 0;
		},
		filterCard: { name: "hufu" },
		viewAs: { name: "sha" },
		prompt: "将一张玉符当杀使用或打出",
		check(card) {
			return 1;
		},
		ai: {
			order: 1,
			useful: 7.5,
			value: 7.5,
		},
	},
	g_hufu_shan: {
		enable: ["chooseToRespond", "chooseToUse"],
		filter(event, player) {
			return player.countCards("h", "hufu") > 0;
		},
		filterCard: { name: "hufu" },
		viewAs: { name: "shan" },
		prompt: "将一张玉符当闪使用或打出",
		check() {
			return 1;
		},
		ai: {
			order: 1,
			useful: 7.5,
			value: 7.5,
		},
	},
	g_hufu_jiu: {
		enable: ["chooseToRespond", "chooseToUse"],
		filter(event, player) {
			return player.countCards("h", "hufu") > 0;
		},
		filterCard: { name: "hufu" },
		viewAs: { name: "jiu" },
		prompt: "将一张玉符当酒使用",
		check() {
			return 1;
		},
	},
	zhiluxiaohu: {
		trigger: { source: "damageAfter" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.card && event.card.name === "sha" && event.getParent(3).name === "zhiluxiaohu";
		},
		content() {
			player.draw();
		},
	},
	zhufangshenshi: {
		mod: {
			targetInRange(card, player, target, now) {
				if (player.storage.zhufangshenshi === target) {
					return true;
				}
			},
		},
		mark: true,
		intro: {
			content: "player",
		},
		onremove: true,
	},
	g_zhufangshenshi: {
		trigger: { player: "useCardAfter" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.card.name === "zhufangshenshi";
		},
		content() {
			player.draw();
		},
	},
	huanpodan_skill: {
		mark: true,
		intro: {
			content: "防止一次死亡，改为弃置所有牌，将体力值变为1并摸一张牌",
		},
		trigger: { player: "dieBefore" },
		forced: true,
		content() {
			"step 0";
			trigger.cancel();
			player.discard(player.getCards("he"));
			player.removeSkill("huanpodan_skill");
			"step 1";
			player.changeHp(1 - player.hp);
			"step 2";
			player.draw();
		},
	},
	dujian2: {},
	g_yuchan_swap: {
		trigger: { player: "useCardAfter" },
		silent: true,
		priority: -1,
		content() {
			var hs = player.getCards("h");
			var list = ["yuchanqian", "yuchankun", "yuchanzhen", "yuchanxun", "yuchangen", "yuchanli", "yuchankan", "yuchandui"];
			for (var i = 0; i < hs.length; i++) {
				if (hs[i].name.indexOf("yuchan") === 0) {
					hs[i].init([hs[i].suit, hs[i].number, list.randomGet(hs[i].name)]);
				}
			}
		},
	},
	g_yuchan_equip: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var skills = player.getSkills();
			for (var i = 0; i < skills.length; i++) {
				if (skills[i].indexOf("yuchan") === 0 && skills[i].indexOf("_equip") !== -1) {
					return player.countCards("h", { type: "basic" }) > 0;
				}
			}
			return false;
		},
		filterCard: { type: "basic" },
		selectCard: [1, Infinity],
		prompt: "弃置任意张基本牌并摸等量的牌",
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			player.draw(cards.length);
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	yuchanqian_equip1: {},
	yuchanqian_equip2: {},
	yuchanqian_equip3: {},
	yuchanqian_equip4: {},
	yuchanqian_equip5: {},
	yuchankun_equip1: {},
	yuchankun_equip2: {},
	yuchankun_equip3: {},
	yuchankun_equip4: {},
	yuchankun_equip5: {},
	yuchanzhen_equip1: {},
	yuchanzhen_equip2: {},
	yuchanzhen_equip3: {},
	yuchanzhen_equip4: {},
	yuchanzhen_equip5: {},
	yuchanxun_equip1: {},
	yuchanxun_equip2: {},
	yuchanxun_equip3: {},
	yuchanxun_equip4: {},
	yuchanxun_equip5: {},
	yuchankan_equip1: {},
	yuchankan_equip2: {},
	yuchankan_equip3: {},
	yuchankan_equip4: {},
	yuchankan_equip5: {},
	yuchanli_equip1: {},
	yuchanli_equip2: {},
	yuchanli_equip3: {},
	yuchanli_equip4: {},
	yuchanli_equip5: {},
	yuchangen_equip1: {},
	yuchangen_equip2: {},
	yuchangen_equip3: {},
	yuchangen_equip4: {},
	yuchangen_equip5: {},
	yuchandui_equip1: {},
	yuchandui_equip2: {},
	yuchandui_equip3: {},
	yuchandui_equip4: {},
	yuchandui_equip5: {},
	lianyaohu_skill: {
		equipSkill: true,
		mark: true,
		intro: {
			content(storage, player) {
				var card = player.getEquip("lianyaohu");
				if (card && card.storage.shouna && card.storage.shouna.length) {
					return "共有" + get.cnNumber(card.storage.shouna.length) + "张牌";
				}
				return "共有零张牌";
			},
			mark(dialog, storage, player) {
				var card = player.getEquip("lianyaohu");
				if (card && card.storage.shouna && card.storage.shouna.length) {
					dialog.addAuto(card.storage.shouna);
				} else {
					return "共有零张牌";
				}
			},
			markcount(storage, player) {
				var card = player.getEquip("lianyaohu");
				if (card && card.storage.shouna) {
					return card.storage.shouna.length;
				}
				return 0;
			},
		},
	},
	g_shencaojie: {
		trigger: { source: "damageBegin", player: "damageBegin" },
		direct: true,
		filter(event, player) {
			if (get.type(event.card) !== "trick") {
				return false;
			}
			if (player.hasCard("shencaojie")) {
				return true;
			}
			return false;
		},
		content() {
			player.chooseToUse(
				get.prompt("shencaojie", trigger.player).replace(/发动/, "使用"),
				function (card, player) {
					if (card.name !== "shencaojie") {
						return false;
					}
					return lib.filter.cardEnabled(card, player, "forceEnable");
				},
				trigger.player,
				-1
			).targetRequired = true;
		},
	},
	g_shenmiguo: {
		trigger: { player: "useCardAfter" },
		direct: true,
		filter(event, player) {
			if (event.parent.name === "g_shenmiguo") {
				return false;
			}
			if (_status.currentPhase !== player) {
				return false;
			}
			if (event.parent.parent.name !== "phaseUse") {
				return false;
			}
			if (!event.targets || !event.card) {
				return false;
			}
			if (event.card.name === "shenmiguo") {
				return false;
			}
			if (event.card.name === "yuchankan") {
				return false;
			}
			if (player.hasSkill("shenmiguo2")) {
				return false;
			}
			if (get.info(event.card).complexTarget) {
				return false;
			}
			if (!lib.filter.cardEnabled(event.card, player, event.parent)) {
				return false;
			}
			var type = get.type(event.card);
			if (type !== "basic" && type !== "trick") {
				return false;
			}
			var card = game.createCard(event.card.name, event.card.suit, event.card.number, event.card.nature);
			var targets = event._targets || event.targets;
			for (var i = 0; i < targets.length; i++) {
				if (!targets[i].isIn()) {
					return false;
				}
				if (!player.canUse({ name: event.card.name }, targets[i], false, false)) {
					return false;
				}
			}
			if (player.hasCard("shenmiguo")) {
				return true;
			}
			if (player.hasCard("yuchankan")) {
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			var card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
			player.storage.shenmiguo = [card, (trigger._targets || trigger.targets).slice(0)];
			player
				.chooseToUse(
					"是否使用神秘果？",
					function (card, player) {
						if (card.name !== "shenmiguo" && card.name !== "yuchankan") {
							return false;
						}
						return lib.filter.cardEnabled(card, player, "forceEnable");
					},
					trigger.player,
					-1
				)
				.set("cardname", trigger.card.name).targetRequired = true;
			"step 1";
			if (result.bool) {
				player.addTempSkill("shenmiguo2");
			}
			delete player.storage.shenmiguo;
		},
	},
	shenmiguo2: {},
	yuruyi: {
		equipSkill: true,
		trigger: { player: "drawBegin" },
		silent: true,
		filter() {
			return ui.cardPile.childElementCount > 1;
		},
		content() {
			var value = get.value(ui.cardPile.firstChild);
			var num = Math.min(20, ui.cardPile.childElementCount);
			var list = [],
				list2 = [],
				list3 = [];
			for (var i = 1; i < num; i++) {
				var val = get.value(ui.cardPile.childNodes[i]);
				if (val > value) {
					list.push(ui.cardPile.childNodes[i]);
					if (val > value + 1 && val >= 7) {
						list2.push(ui.cardPile.childNodes[i]);
					}
					if (val > value + 1 && val >= 8) {
						list3.push(ui.cardPile.childNodes[i]);
					}
				}
			}
			var card;
			if (list3.length) {
				card = list3.randomGet();
			} else if (list2.length) {
				card = list2.randomGet();
			} else if (list.length) {
				card = list.randomGet();
			}
			if (card) {
				ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
			}
		},
	},
	shuchui: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canUse("sha", target);
		},
		filter(event, player) {
			return player.countCards("h", "sha") > 0 && lib.filter.cardUsable({ name: "sha" }, player);
		},
		content() {
			"step 0";
			player.addSkill("shuchui2");
			player.storage.shuchui2 = false;
			event.num = 0;
			"step 1";
			var card = player.getCards("h", "sha")[0];
			if (card) {
				player.useCard(card, target);
			} else {
				if (player.storage.shuchui2) {
					player.draw();
				}
				player.removeSkill("shuchui2");
				event.finish();
			}
			"step 2";
			if (event.num++ < 2 && target.isAlive()) {
				event.goto(1);
			} else {
				if (player.storage.shuchui2) {
					player.draw();
				}
				player.removeSkill("shuchui2");
			}
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.11;
			},
			result: {
				target(player, target) {
					return get.effect(target, { name: "sha" }, player, target);
				},
			},
		},
	},
	shuchui2: {
		charlotte: true,
		trigger: { source: "damageEnd" },
		forced: true,
		popup: false,
		onremove: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && !player.storage.shuchui2;
		},
		content() {
			player.storage.shuchui2 = true;
		},
	},
	xuejibingbao: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		mark: true,
		temp: true,
		intro: {
			content: "摸牌阶段摸牌数+1",
		},
		nopop: true,
		content() {
			trigger.num++;
			player.storage.xuejibingbao--;
			if (player.storage.xuejibingbao <= 0) {
				player.removeSkill("xuejibingbao");
				delete player.storage.xuejibingbao;
			} else {
				player.updateMarks();
			}
		},
	},
	gouhunluo: {
		mark: true,
		intro: {
			content(storage, player) {
				if (storage === 1) {
					"在" + get.translation(player.storage.gouhunluo2) + "的下个准备阶段失去1点体力并弃置所有手牌";
				}
				return "在" + storage + "轮后" + get.translation(player.storage.gouhunluo2) + "的准备阶段失去1点体力并弃置所有手牌";
			},
		},
		nopop: true,
		temp: true,
		trigger: { global: "phaseBegin" },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.gouhunluo2 === event.player;
		},
		content() {
			"step 0";
			player.storage.gouhunluo--;
			if (player.storage.gouhunluo <= 0) {
				player.logSkill("gouhunluo");
				player.loseHp();
				player.removeSkill("gouhunluo");
				delete player.storage.gouhunluo;
				delete player.storage.gouhunluo2;
			} else {
				player.updateMarks();
				event.finish();
			}
			"step 1";
			var es = player.getCards("h");
			if (es.length) {
				player.discard(es);
			}
		},
		group: "gouhunluo2",
	},
	gouhunluo2: {
		trigger: { global: "dieBegin" },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.gouhunluo2 === event.player;
		},
		content() {
			player.removeSkill("gouhunluo");
			delete player.storage.gouhunluo;
			delete player.storage.gouhunluo2;
		},
	},
	jiguanyuan: {
		mark: "card",
		intro: {
			content: "cards",
		},
		trigger: { player: "phaseEnd" },
		forced: true,
		temp: true,
		popup: false,
		content() {
			player.gain(player.storage.jiguanyuan, "gain2");
			player.removeSkill("jiguanyuan");
			delete player.storage.jiguanyuan;
		},
	},
	g_qinglongzhigui: {
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return player.countCards("h", "qinglongzhigui") > 0;
		},
		content() {
			"step 0";
			player.showCards(get.translation(player) + "发动了【青龙之圭】", player.getCards("h", "qinglongzhigui"));
			player.draw(2);
			"step 1";
			player.chooseToDiscard("he", true);
		},
	},
	g_baishouzhihu: {
		trigger: { player: "discardEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("h", "baishouzhihu") > 0;
		},
		content() {
			"step 0";
			player.chooseTarget([1, 1], get.prompt("baishouzhihu"), function (card, player, target) {
				if (player === target) {
					return false;
				}
				return target.countCards("he") > 0;
			}).ai = function (target) {
				return -get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.showCards(get.translation(player) + "发动了【白兽之琥】", player.getCards("h", "baishouzhihu"));
				player.logSkill("_baishouzhihu", result.targets);
				result.targets[0].randomDiscard();
				// player.discardPlayerCard(result.targets[0],'he',true);
			} else {
				event.finish();
			}
		},
	},
	g_zhuquezhizhang: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.source && event.source !== player && event.source.isAlive() && player.countCards("h", "zhuquezhizhang") > 0;
		},
		logTarget: "source",
		check(event, player) {
			return get.damageEffect(event.source, player, player, "fire") > 0;
		},
		content() {
			"step 0";
			player.showCards(get.translation(player) + "发动了【朱雀之璋】", player.getCards("h", "zhuquezhizhang"));
			trigger.source.damage("fire");
			"step 1";
			game.delay();
		},
	},
	g_xuanwuzhihuang: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			return player.countCards("h", "xuanwuzhihuang") > 0 && event.num > 0 && player.hp < player.maxHp;
		},
		content() {
			player.showCards(get.translation(player) + "发动了【玄武之璜】", player.getCards("h", "xuanwuzhihuang"));
			player.recover(trigger.num);
		},
	},
	g_huanglinzhicong: {
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return !player.hujia && player.countCards("h", "huanglinzhicong") > 0;
		},
		content() {
			player.showCards(get.translation(player) + "发动了【黄麟之琮】", player.getCards("h", "huanglinzhicong"));
			player.changeHujia();
			player.update();
		},
	},
	g_cangchizhibi: {
		trigger: { player: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h", "cangchizhibi") > 0;
		},
		content() {
			"step 0";
			player.chooseTarget([1, 3], get.prompt("cangchizhibi")).ai = function (target) {
				var att = get.attitude(player, target);
				if (target.isLinked()) {
					return att;
				}
				return -att;
			};
			"step 1";
			if (result.bool) {
				player.showCards(get.translation(player) + "发动了【苍螭之璧】", player.getCards("h", "cangchizhibi"));
				player.logSkill("_cangchizhibi", result.targets);
				for (var i = 0; i < result.targets.length; i++) {
					result.targets[i].link();
				}
			}
		},
	},
	cangchizhibi_equip1: {
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("cangchizhibi_duanzao")).ai = function (target) {
				var att = get.attitude(player, target);
				if (target.isLinked()) {
					return att;
				}
				return -att;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("cangchizhibi_equip1", result.targets);
				result.targets[0].link();
			}
		},
	},
	cangchizhibi_equip2: {
		inherit: "cangchizhibi_equip1",
	},
	cangchizhibi_equip3: {
		inherit: "cangchizhibi_equip1",
	},
	cangchizhibi_equip4: {
		inherit: "cangchizhibi_equip1",
	},
	cangchizhibi_equip5: {
		inherit: "cangchizhibi_equip1",
	},
	huanglinzhicong_equip1: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 0 && player.hujia === 0;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", { color: "black" }, get.prompt("huanglinzhicong_duanzao"));
			next.ai = function (card) {
				return 8 - get.value(card);
			};
			next.logSkill = "huanglinzhicong_equip1";
			"step 1";
			if (result.bool) {
				player.changeHujia();
			}
		},
	},
	huanglinzhicong_equip2: {
		inherit: "huanglinzhicong_equip1",
	},
	huanglinzhicong_equip3: {
		inherit: "huanglinzhicong_equip1",
	},
	huanglinzhicong_equip4: {
		inherit: "huanglinzhicong_equip1",
	},
	huanglinzhicong_equip5: {
		inherit: "huanglinzhicong_equip1",
	},
	xuanwuzhihuang_equip1: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 0 && player.hp < player.maxHp;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", { color: "red" }, get.prompt("xuanwuzhihuang_duanzao"));
			next.ai = function (card) {
				if (get.recoverEffect(player, player, player) <= 0) {
					return 0;
				}
				return 8 - get.value(card);
			};
			next.logSkill = "xuanwuzhihuang_equip1";
			"step 1";
			if (result.bool) {
				player.recover();
			}
		},
	},
	xuanwuzhihuang_equip2: {
		inherit: "xuanwuzhihuang_equip1",
	},
	xuanwuzhihuang_equip3: {
		inherit: "xuanwuzhihuang_equip1",
	},
	xuanwuzhihuang_equip4: {
		inherit: "xuanwuzhihuang_equip1",
	},
	xuanwuzhihuang_equip5: {
		inherit: "xuanwuzhihuang_equip1",
	},
	zhuquezhizhang_equip1: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 0;
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				position: "he",
				filterTarget(card, player, target) {
					return player !== target && target.hp >= player.hp;
				},
				filterCard(card, player) {
					return get.color(card) === "red" && lib.filter.cardDiscardable(card, player);
				},
				ai1(card) {
					return 9 - get.value(card);
				},
				ai2(target) {
					return get.damageEffect(target, player, player, "fire");
				},
				prompt: get.prompt("zhuquezhizhang_duanzao"),
			});
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("zhuquezhizhang_equip1", event.target, "fire");
				player.discard(result.cards);
			} else {
				event.finish();
			}
			"step 2";
			if (event.target) {
				event.target.damage("fire");
			}
		},
	},
	zhuquezhizhang_equip2: {
		inherit: "zhuquezhizhang_equip1",
	},
	zhuquezhizhang_equip3: {
		inherit: "zhuquezhizhang_equip1",
	},
	zhuquezhizhang_equip4: {
		inherit: "zhuquezhizhang_equip1",
	},
	zhuquezhizhang_equip5: {
		inherit: "zhuquezhizhang_equip1",
	},
	baishouzhihu_equip1: {
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget([1, 1], get.prompt("baishouzhihu_duanzao"), function (card, player, target) {
				if (player === target) {
					return false;
				}
				return target.countCards("he") > 0;
			}).ai = function (target) {
				return -get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("baishouzhihu_equip1", result.targets);
				result.targets[0].randomDiscard();
				// player.discardPlayerCard(result.targets[0],'he',true);
			} else {
				event.finish();
			}
		},
	},
	baishouzhihu_equip2: {
		inherit: "baishouzhihu_equip1",
	},
	baishouzhihu_equip3: {
		inherit: "baishouzhihu_equip1",
	},
	baishouzhihu_equip4: {
		inherit: "baishouzhihu_equip1",
	},
	baishouzhihu_equip5: {
		inherit: "baishouzhihu_equip1",
	},
	qinglongzhigui_equip1: {
		trigger: { player: "phaseEnd" },
		forced: true,
		content() {
			player.draw();
		},
	},
	qinglongzhigui_equip2: {
		inherit: "qinglongzhigui_equip1",
	},
	qinglongzhigui_equip3: {
		inherit: "qinglongzhigui_equip1",
	},
	qinglongzhigui_equip4: {
		inherit: "qinglongzhigui_equip1",
	},
	qinglongzhigui_equip5: {
		inherit: "qinglongzhigui_equip1",
	},
	kunlunjingc: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		delay: false,
		content() {
			"step 0";
			var cards = get.cards(3);
			event.cards = cards;
			player.chooseCardButton("选择一张牌", cards, true);
			"step 1";
			event.card = result.links[0];
			player.chooseCard("h", true, "用一张手牌替换" + get.translation(event.card));
			"step 2";
			if (result.bool) {
				event.cards[event.cards.indexOf(event.card)] = result.cards[0];
				player.lose(result.cards, ui.special);
				var cardx = ui.create.card();
				cardx.classList.add("infohidden");
				cardx.classList.add("infoflip");
				player.$throw(cardx, 1000, "nobroadcast");
			} else {
				event.finish();
			}
			"step 3";
			player.gain(event.card);
			player.$draw();
			for (var i = event.cards.length - 1; i >= 0; i--) {
				event.cards[i].fix();
				ui.cardPile.insertBefore(event.cards[i], ui.cardPile.firstChild);
			}
			game.delay();
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	lianhua: {
		equipSkill: true,
		enable: "phaseUse",
		filter(event, player) {
			var hu = player.getEquip("lianyaohu");
			if (hu && hu.storage.shouna && hu.storage.shouna.length > 1) {
				return true;
			}
			return false;
		},
		usable: 1,
		delay: false,
		content() {
			"step 0";
			event.hu = player.getEquip("lianyaohu");
			player.chooseCardButton("弃置两张壶中的牌，然后从牌堆中获得一张类别不同的牌", 2, event.hu.storage.shouna).ai = function () {
				return 1;
			};
			"step 1";
			if (result.bool) {
				var type = [];
				player.$throw(result.links);
				game.log(player, "弃置了", result.links);
				for (var i = 0; i < result.links.length; i++) {
					event.hu.storage.shouna.remove(result.links[i]);
					result.links[i].discard();
					type.add(get.type(result.links[i], "trick"));
				}
				for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
					if (!type.includes(get.type(ui.cardPile.childNodes[i], "trick"))) {
						player.gain(ui.cardPile.childNodes[i], "gain");
						break;
					}
				}
			} else {
				player.getStat("skill").lianhua--;
			}
		},
		ai: {
			order: 11,
			result: {
				player: 1,
			},
		},
	},
	shouna: {
		equipSkill: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		usable: 1,
		filterCard: true,
		check(card) {
			return 6 - get.value(card);
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			var card = target.getCards("h").randomGet();
			var hu = player.getEquip("lianyaohu");
			if (card && hu) {
				if (!hu.storage.shouna) {
					hu.storage.shouna = [];
				}
				target.$give(card, player);
				target.lose(card, ui.special);
				event.card = card;
				event.hu = hu;
			}
			"step 1";
			if (!event.card._selfDestroyed) {
				event.hu.storage.shouna.push(event.card);
				player.updateMarks();
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					return -1 / Math.sqrt(1 + target.countCards("h"));
				},
			},
		},
	},
	donghuangzhong: {
		equipSkill: true,
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("h", { color: "red" }) > 0;
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				filterTarget: true,
				filterCard(card, player, event) {
					if (get.color(card) !== "red") {
						return false;
					}
					return lib.filter.cardDiscardable(card, player, event);
				},
				ai1(card) {
					return 8 - get.useful(card);
				},
				ai2(target) {
					return -get.attitude(player, target);
				},
				prompt: get.prompt("donghuangzhong"),
			});
			"step 1";
			if (result.bool) {
				player.logSkill("donghuangzhong", result.targets);
				player.discard(result.cards);
				event.target = result.targets[0];
			} else {
				event.finish();
			}
			"step 2";
			var target = event.target;
			var list = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				var info = lib.card[lib.inpile[i]];
				if (info.type === "delay" && !info.cancel && !target.hasJudge(lib.inpile[i])) {
					list.push(lib.inpile[i]);
				}
			}
			if (list.length) {
				var card = game.createCard(list.randomGet());
				target.addJudge(card);
				target.$draw(card);
				game.delay();
			}
		},
	},
	xuanyuanjian: {
		equipSkill: true,
		trigger: { player: "changeHp" },
		forced: true,
		popup: false,
		filter(event, player) {
			return !player.hasSkill("xuanyuan") && player.hp <= 2;
		},
		content() {
			var e1 = player.getEquip("xuanyuanjian");
			if (e1) {
				player.discard(e1);
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	xuanyuanjian2: {
		equipSkill: true,
		trigger: { source: "damageBefore" },
		forced: true,
		filter(event) {
			return event.notLink();
		},
		content() {
			trigger.num++;
			trigger._xuanyuanjian = true;
			if (!trigger.nature) {
				trigger.nature = "thunder";
			}
		},
	},
	xuanyuanjian3: {
		equipSkill: true,
		trigger: { source: "damageAfter" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event._xuanyuanjian && !player.hasSkill("xuanyuan");
		},
		content() {
			player.loseHp();
		},
	},
	pangufu: {
		equipSkill: true,
		trigger: { source: "damageEnd" },
		forced: true,
		priority: 55,
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.player.countCards("he") > 0;
		},
		content() {
			trigger.player.chooseToDiscard(true, "he");
		},
	},
	haotianta: {
		equipSkill: true,
		trigger: { global: "judgeBefore" },
		direct: true,
		locked: true,
		content() {
			"step 0";
			event.cards = get.cards(2);
			player.chooseCardButton(true, event.cards, "昊天塔：选择一张牌作为" + get.translation(trigger.player) + "的" + trigger.judgestr + "判定结果").ai = function (button) {
				if (get.attitude(player, trigger.player) > 0) {
					return 1 + trigger.judge(button.link);
				}
				if (get.attitude(player, trigger.player) < 0) {
					return 1 - trigger.judge(button.link);
				}
				return 0;
			};
			"step 1";
			if (!result.bool) {
				event.finish();
				return;
			}
			player.logSkill("haotianta", trigger.player);
			var card = result.links[0];
			event.cards.remove(card);
			var judgestr = get.translation(trigger.player) + "的" + trigger.judgestr + "判定";
			event.videoId = lib.status.videoId++;
			event.dialog = ui.create.dialog(judgestr);
			event.dialog.classList.add("center");
			event.dialog.videoId = event.videoId;

			game.addVideo("judge1", player, [get.cardInfo(card), judgestr, event.videoId]);
			for (var i = 0; i < event.cards.length; i++) {
				event.cards[i].discard();
			}
			// var node=card.copy('thrown','center',ui.arena).addTempClass('start');
			var node;
			if (game.chess) {
				node = card.copy("thrown", "center", ui.arena).addTempClass("start");
			} else {
				node = player.$throwordered(card.copy(), true);
			}
			node.classList.add("thrownhighlight");
			ui.arena.classList.add("thrownhighlight");
			if (card) {
				trigger.cancel();
				trigger.result = {
					card: card,
					judge: trigger.judge(card),
					node: node,
					number: get.number(card),
					suit: get.suit(card),
					color: get.color(card),
				};
				if (trigger.result.judge > 0) {
					trigger.result.bool = true;
					trigger.player.popup("判定生效");
				}
				if (trigger.result.judge < 0) {
					trigger.result.bool = false;
					trigger.player.popup("判定失效");
				}
				game.log(trigger.player, "的判定结果为", card);
				trigger.direct = true;
				trigger.position.appendChild(card);
				game.delay(2);
			} else {
				event.finish();
			}
			"step 2";
			ui.arena.classList.remove("thrownhighlight");
			event.dialog.close();
			game.addVideo("judge2", null, event.videoId);
			ui.clear();
			var card = trigger.result.card;
			trigger.position.appendChild(card);
			trigger.result.node.delete();
			game.delay();
		},
		ai: {
			tag: {
				rejudge: 1,
			},
		},
	},
	shennongding: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 2,
		check(card) {
			if (get.tag(card, "recover") >= 1) {
				return 0;
			}
			return 7 - get.value(card);
		},
		filter(event, player) {
			return player.hp < player.maxHp && player.countCards("h") >= 2;
		},
		content() {
			player.recover();
		},
		ai: {
			result: {
				player(player) {
					return get.recoverEffect(player);
				},
			},
			order: 2.5,
		},
	},
	kongdongyin: {
		equipSkill: true,
		trigger: { player: "dieBefore" },
		forced: true,
		filter(event, player) {
			return player.maxHp > 0;
		},
		content() {
			trigger.cancel();
			player.hp = 1;
			player.draw();
			player.discard(player.getCards("e", { subtype: "equip5" }));
			game.delay();
		},
	},
	nvwashi: {
		equipSkill: true,
		trigger: { global: "dying" },
		priority: 6,
		filter(event, player) {
			return event.player.hp <= 0 && player.hp > 1;
		},
		check(event, player) {
			return get.attitude(player, event.player) >= 3 && !event.player.hasSkillTag("nosave");
		},
		logTarget: "player",
		content() {
			"step 0";
			trigger.player.recover();
			"step 1";
			player.loseHp();
		},
		ai: {
			threaten: 1.2,
			expose: 0.2,
		},
	},
	kongxin: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return (
				player.countCards("h") &&
				game.hasPlayer(function (current) {
					return player.canCompare(current);
				})
			);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				event.bool = true;
				player.chooseTarget("选择一个目标视为" + get.translation(target) + "对其使用一张杀", function (card, player, target2) {
					return player !== target2 && target.canUse("sha", target2);
				}).ai = function (target2) {
					return get.effect(target2, { name: "sha" }, target, player);
				};
			} else {
				target.discardPlayerCard(player);
			}
			"step 2";
			if (event.bool && result.bool) {
				target.useCard({ name: "sha" }, result.targets);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (player.countCards("h") <= 1) {
						return 0;
					}
					if (get.attitude(player, target) >= 0) {
						return 0;
					}
					if (
						game.hasPlayer(function (current) {
							return player !== current && target.canUse("sha", current) && get.effect(current, { name: "sha" }, target, player) > 0;
						})
					) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	kongxin2: {
		trigger: { player: "dying" },
		priority: 10,
		forced: true,
		popup: false,
		filter(event, player) {
			return player === game.me;
		},
		content() {
			player.removeSkill("kongxin2");
			game.swapPlayer(player);
			player.storage.kongxin.lockOut = false;
			player.storage.kongxin.out();
			if (player === game.me) {
				game.swapPlayer(player.storage.kongxin);
			}
			if (lib.config.mode === "identity") {
				player.storage.kongxin.setIdentity();
			}
			delete player.storage.kongxin;
		},
	},
	qinglianxindeng: {
		equipSkill: true,
		trigger: { player: "damageBefore" },
		forced: true,
		priority: 15,
		filter(event, player) {
			if (
				event.source &&
				event.source.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return false;
			}
			return get.type(event.card, "trick") === "trick";
		},
		content() {
			trigger.cancel();
		},
		ai: {
			notrick: true,
			effect: {
				target(card, player, target, current) {
					if (
						player.hasSkillTag("unequip", false, {
							name: card ? card.name : null,
							target: player,
							card: card,
						})
					) {
						return;
					}
					if (get.type(card) === "trick" && get.tag(card, "damage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	yiluan: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h");
		},
		content() {
			"step 0";
			target.judge();
			"step 1";
			if (result.suit !== "heart") {
				var hs = target.getCards("h");
				while (hs.length) {
					var chosen = hs.randomRemove();
					if (target.hasUseTarget(chosen) && !get.info(chosen).multitarget) {
						var list = game.filterPlayer(function (current) {
							return lib.filter.targetEnabled2(chosen, target, current);
						});
						if (list.length) {
							target.useCard(chosen, list.randomGet());
							event.finish();
							break;
						}
					}
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (!target.countCards("h")) {
						return 0;
					}
					return -1;
				},
			},
		},
	},
	hslingjian_xuanfengzhiren_equip1: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name === "sha" && event.player.countCards("he");
		},
		content() {
			trigger.player.discard(trigger.player.getCards("he").randomGet());
		},
	},
	hslingjian_xuanfengzhiren_equip2: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event) {
			return event.card && event.card.name === "sha" && event.source && event.source.countCards("he");
		},
		content() {
			trigger.source.discard(trigger.source.getCards("he").randomGet());
		},
	},
	hslingjian_xuanfengzhiren_equip3: {
		trigger: { player: "loseAfter" },
		forced: true,
		filter(event, player) {
			return _status.currentPhase !== player && !player.hasSkill("hslingjian_xuanfengzhiren_equip3_dist");
		},
		content() {
			player.addTempSkill("hslingjian_xuanfengzhiren_equip3_dist");
		},
	},
	hslingjian_xuanfengzhiren_equip3_dist: {
		mod: {
			globalTo(from, to, distance) {
				return distance + 1;
			},
		},
	},
	hslingjian_xuanfengzhiren_equip4: {
		trigger: { player: "loseAfter" },
		forced: true,
		filter(event, player) {
			return _status.currentPhase === player && !player.hasSkill("hslingjian_xuanfengzhiren_equip4_dist");
		},
		content() {
			player.addTempSkill("hslingjian_xuanfengzhiren_equip4_dist");
		},
	},
	hslingjian_xuanfengzhiren_equip4_dist: {
		mod: {
			globalFrom(from, to, distance) {
				return distance - 1;
			},
		},
	},
	hslingjian_xuanfengzhiren_equip5: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterTarget(card, player, target) {
			return target.countCards("he") > 0;
		},
		check(card) {
			return 5 - get.value(card);
		},
		content() {
			target.discard(target.getCards("he").randomGet());
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					var dh = player.countCards("he") - target.countCards("he");
					if (dh > 0) {
						return -Math.sqrt(dh);
					}
					return 0;
				},
			},
		},
	},
	hslingjian_zhongxinghujia_equip1: {
		trigger: { source: "damageEnd" },
		check(event, player) {
			return !player.getEquip(2);
		},
		filter(event) {
			return event.card && event.card.name === "sha";
		},
		content() {
			var card = game.createCard(get.inpile("equip2").randomGet());
			player.equip(card);
			player.$draw(card);
			game.delay();
		},
	},
	hslingjian_zhongxinghujia_equip2: {
		trigger: { player: "damageEnd" },
		check(event, player) {
			return get.attitude(player, event.source) < 0;
		},
		filter(event) {
			return event.card && event.card.name === "sha" && event.source && event.source.getEquip(2);
		},
		content() {
			player.line(trigger.source, "green");
			trigger.source.discard(trigger.source.getEquip(2));
		},
	},
	hslingjian_zhongxinghujia_equip3: {
		mod: {
			globalTo(from, to, distance) {
				if (to.getEquip(2)) {
					return distance + 1;
				}
			},
		},
	},
	hslingjian_zhongxinghujia_equip4: {
		mod: {
			globalFrom(from, to, distance) {
				if (from.getEquip(2)) {
					return distance - 1;
				}
			},
		},
	},
	hslingjian_zhongxinghujia_equip5: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		filterTarget: true,
		selectCard: 2,
		filter(event, player) {
			return player.countCards("he") >= 2;
		},
		check(card) {
			return 5 - get.value(card);
		},
		content() {
			var card = game.createCard(get.inpile("equip2").randomGet());
			target.equip(card);
			target.$draw(card);
			game.delay();
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.getEquip(2)) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	hslingjian_jinjilengdong_equip1: {
		trigger: { source: "damageEnd" },
		check(event, player) {
			if (event.player.hasSkillTag("noturn")) {
				return 0;
			}
			if (event.player.isTurnedOver()) {
				return get.attitude(player, event.player) > 0;
			}
			return get.attitude(player, event.player) <= 0;
		},
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name === "sha" && event.player && event.player.isAlive();
		},
		logTarget: "player",
		content() {
			trigger.player.draw(2);
			trigger.player.turnOver();
		},
	},
	hslingjian_jinjilengdong_equip2: {
		trigger: { player: "damageEnd" },
		check(event, player) {
			if (event.player.hasSkillTag("noturn")) {
				return 0;
			}
			if (event.player.isTurnedOver()) {
				return get.attitude(player, event.source) > 0;
			}
			return get.attitude(player, event.source) <= 0;
		},
		filter(event) {
			return event.card && event.card.name === "sha" && event.source && event.source.isAlive();
		},
		logTarget: "source",
		content() {
			player.line(trigger.source, "green");
			trigger.source.draw(2);
			trigger.source.turnOver();
		},
	},
	hslingjian_jinjilengdong_equip3: {
		mod: {
			globalTo(from, to, distance) {
				if (to.isTurnedOver()) {
					return distance + 2;
				}
			},
		},
	},
	hslingjian_jinjilengdong_equip4: {
		mod: {
			globalFrom(from, to, distance) {
				if (from.isTurnedOver()) {
					return distance - 2;
				}
			},
		},
	},
	hslingjian_jinjilengdong_equip5: {
		trigger: { player: "phaseAfter" },
		direct: true,
		filter(event, player) {
			return !player.isTurnedOver();
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("hslingjian_jinjilengdong_duanzao"), function (card, player, target) {
				return player !== target && !target.isTurnedOver();
			}).ai = function (target) {
				if (target.hasSkillTag("noturn")) {
					return 0;
				}
				return Math.max(0, -get.attitude(player, target) - 2);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("hslingjian_jinjilengdong_equip5", result.targets);
				player.turnOver();
				result.targets[0].turnOver();
				game.asyncDraw([player, result.targets[0]], 2);
			}
		},
	},
	hslingjian_yinmilichang_equip1: {
		trigger: { source: "damageEnd" },
		direct: true,
		filter(event) {
			return event.card && event.card.name === "sha";
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("hslingjian_yinmilichang_duanzao"), function (card, player, target) {
				return target !== player && !target.hasSkill("qianxing");
			}).ai = function (target) {
				var att = get.attitude(player, target);
				if (get.distance(player, target, "absolute") <= 1) {
					return 0;
				}
				if (target.hp === 1) {
					return 2 * att;
				}
				if (target.hp === 2 && target.countCards("h") <= 2) {
					return 1.2 * att;
				}
				return att;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("hslingjian_yinmilichang_equip1", result.targets);
				result.targets[0].tempHide();
			}
		},
	},
	hslingjian_yinmilichang_equip2: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return !player.hasSkill("qianxing");
		},
		content() {
			player.addTempSkill("qianxing");
		},
	},
	hslingjian_yinmilichang_equip3: {
		mod: {
			globalTo(from, to, distance) {
				if (to.hp === 1) {
					return distance + 1;
				}
			},
		},
	},
	hslingjian_yinmilichang_equip4: {
		mod: {
			globalFrom(from, to, distance) {
				if (from.hp === 1) {
					return distance - 1;
				}
			},
		},
	},
	hslingjian_yinmilichang_equip5: {
		mod: {
			targetEnabled(card, player, target, now) {
				if (target.countCards("h") === 0) {
					if (card.name === "sha" || card.name === "juedou") {
						return false;
					}
				}
			},
		},
		ai: {
			noh: true,
			skillTagFilter(player, tag) {
				if (tag === "noh") {
					if (player.countCards("h") !== 1) {
						return false;
					}
				}
			},
		},
	},
	hslingjian_xingtigaizao_equip1: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event) {
			return event.card && event.card.name === "sha";
		},
		content() {
			player.draw();
		},
	},
	hslingjian_xingtigaizao_equip2: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event) {
			return event.card && event.card.name === "sha";
		},
		content() {
			player.draw();
		},
	},
	hslingjian_xingtigaizao_equip3: {
		mod: {
			globalTo(from, to, distance) {
				return distance + 1;
			},
			globalFrom(from, to, distance) {
				return distance + 1;
			},
		},
	},
	hslingjian_xingtigaizao_equip4: {
		mod: {
			globalTo(from, to, distance) {
				return distance - 1;
			},
			globalFrom(from, to, distance) {
				return distance - 1;
			},
		},
	},
	hslingjian_xingtigaizao_equip5: {
		mod: {
			maxHandcard(player, num) {
				return num - 1;
			},
		},
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		content() {
			trigger.num++;
		},
	},
	hslingjian_shengxiuhaojiao_equip1: {
		trigger: { player: "shaBegin" },
		forced: true,
		filter(event, player) {
			return event.target.hasSkill("hslingjian_chaofeng");
		},
		content() {
			trigger.directHit = true;
		},
	},
	hslingjian_shengxiuhaojiao_equip2: {
		mod: {
			targetEnabled(card, player, target) {
				if (player.hasSkill("hslingjian_chaofeng")) {
					return false;
				}
			},
		},
	},
	hslingjian_shengxiuhaojiao_equip3: {
		mod: {
			globalTo(from, to, distance) {
				if (to.hp < to.countCards("h")) {
					return distance + 1;
				}
			},
		},
	},
	hslingjian_shengxiuhaojiao_equip4: {
		mod: {
			globalFrom(from, to, distance) {
				if (from.hp < from.countCards("h")) {
					return distance - 1;
				}
			},
		},
	},
	hslingjian_shengxiuhaojiao_equip5: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 5 - get.value(card);
		},
		position: "he",
		filterTarget: true,
		content() {
			if (target.hasSkill("hslingjian_chaofeng")) {
				target.removeSkill("hslingjian_chaofeng");
			} else {
				target.addSkill("hslingjian_chaofeng");
			}
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					if (target.hasSkill("hslingjian_chaofeng")) {
						return -Math.sqrt(target.hp + target.countCards("h"));
					}
					return 0;
				},
			},
		},
	},
	hslingjian_shijianhuisu_equip1: {
		trigger: { player: "equipEnd" },
		forced: true,
		filter(event, player) {
			return get.subtype(event.card) === "equip2";
		},
		content() {
			player.draw();
		},
	},
	hslingjian_shijianhuisu_equip2: {
		trigger: { player: "equipEnd" },
		forced: true,
		filter(event, player) {
			return get.subtype(event.card) === "equip1";
		},
		content() {
			player.draw();
		},
	},
	hslingjian_shijianhuisu_equip3: {
		mod: {
			globalTo(from, to, distance) {
				if (to.countCards("e") === 1) {
					return distance + 1;
				}
			},
		},
	},
	hslingjian_shijianhuisu_equip4: {
		mod: {
			globalFrom(from, to, distance) {
				if (from.countCards("e") === 1) {
					return distance - 1;
				}
			},
		},
	},
	hslingjian_shijianhuisu_equip5: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 1,
		filterTarget(card, player, target) {
			return player !== target && target.countCards("he") > 0;
		},
		position: "he",
		content() {
			var es = target.getCards("e");
			target.gain(es);
			target.$gain2(es);
		},
		check(card) {
			return 4 - get.value(card);
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (target.hasSkillTag("noe")) {
						return target.countCards("e") * 2;
					}
					return -target.countCards("e");
				},
			},
		},
	},
	jiguanyaoshu_skill: {
		trigger: { player: "loseEnd" },
		forced: true,
		filter(event, player) {
			if (_status.currentPhase === player) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "e") {
					return true;
				}
			}
			return false;
		},
		content() {
			var num = 0;
			for (var i = 0; i < trigger.cards.length; i++) {
				if (trigger.cards[i].original === "e") {
					num++;
				}
			}
			var list = get.typeCard("hslingjian");
			if (get.mode() === "stone") {
				list.remove("hslingjian_jinjilengdong");
			}
			if (list.length) {
				list = list.randomGets(num);
				for (var i = 0; i < list.length; i++) {
					list[i] = game.createCard(list[i]);
				}
				player.gain(list, "gain2");
			}
		},
	},
	lingjianduanzao: {
		process(cards) {
			var equip;
			for (var i = 0; i < cards.length; i++) {
				if (get.type(cards[i]) === "equip") {
					equip = cards[i];
					cards.splice(i--, 1);
					break;
				}
			}
			var name = equip.name;
			var type = get.type(cards[0]);
			var equipname = equip.name;
			if (type === "hslingjian") {
				name += cards[0].name.slice(10);
			} else {
				name += "_" + cards[0].name;
			}
			if (lib.card[name]) {
				return name;
			}
			lib.card[name] = get.copy(lib.card[equip.name]);
			lib.card[name].cardimage = lib.card[name].cardimage || equip.name;
			lib.card[name].vanish = true;
			lib.card[name].source = [equip.name, cards[0].name];
			if (type === "jiqi") {
				lib.card[name].legend = true;
			} else {
				lib.card[name].epic = true;
			}
			var dvalue = type === "jiqi" ? 3 : 1;
			var getValue = function (value, dvalue) {
				if (dvalue === 1) {
					return Math.min(10, value + dvalue);
				}
				value += dvalue;
				if (value > 10) {
					return 10 + (value - 10) / 10;
				}
				if (value < 9) {
					return 8 + value / 10;
				}
				return value;
			};
			if (typeof lib.card[name].ai.equipValue === "number") {
				lib.card[name].ai.equipValue = getValue(lib.card[name].ai.equipValue, dvalue);
			} else if (typeof lib.card[name].ai.equipValue === "function") {
				lib.card[name].ai.equipValue = function () {
					return getValue(lib.card[equipname].ai.equipValue.apply(this, arguments), dvalue);
				};
			} else if (lib.card[name].ai.basic && typeof lib.card[name].ai.basic.equipValue === "number") {
				lib.card[name].ai.basic.equipValue = getValue(lib.card[name].ai.basic.equipValue, dvalue);
			} else if (lib.card[name].ai.basic && typeof lib.card[name].ai.basic.equipValue === "function") {
				lib.card[name].ai.basic.equipValue = function () {
					return getValue(lib.card[equipname].ai.basic.equipValue.apply(this, arguments), dvalue);
				};
			} else {
				if (dvalue === 3) {
					lib.card[name].ai.equipValue = 7;
				} else {
					lib.card[name].ai.equipValue = dvalue;
				}
			}
			if (Array.isArray(lib.card[name].skills)) {
				lib.card[name].skills = lib.card[name].skills.slice(0);
			} else {
				lib.card[name].skills = [];
			}
			// lib.card[name].filterTarget=function(card,player,target){
			// 	return !target.isMin();
			// };
			// lib.card[name].selectTarget=1;
			// lib.card[name].range={global:1};
			var str = lib.translate[cards[0].name + "_duanzao"];
			var str2 = get.translation(equip.name, "skill");
			lib.translate[name] = str + str2;
			str2 = lib.translate[equip.name + "_info"] || "";
			if (str2[str2.length - 1] === "." || str2[str2.length - 1] === "。") {
				str2 = str2.slice(0, str2.length - 1);
			}
			for (var i = 0; i < cards.length; i++) {
				for (var j = 1; j <= 5; j++) {
					lib.translate[cards[i].name + "_equip" + j] = lib.translate[cards[i].name + "_duanzao"];
				}
				var name2 = cards[i].name + "_" + get.subtype(equip);
				lib.card[name].skills.add(name2);
				str2 += "；" + lib.translate[name2 + "_info"];
			}
			lib.translate[name + "_info"] = str2;
			try {
				game.addVideo("newcard", null, {
					name: name,
					translate: lib.translate[name],
					info: str2,
					card: equip.name,
					legend: type === "jiqi",
					epic: type === "hslingjian",
				});
			} catch (e) {
				console.log(e);
			}
			return name;
		},
	},
	_lingjianduanzao: {
		enable: "phaseUse",
		position: "he",
		discard: false,
		losetrigger: false,
		longprompt: true,
		prompt(event) {
			var lingjians = [],
				types = [];
			var hs = event.player.getCards("he");
			for (var i = 0; i < hs.length; i++) {
				switch (get.type(hs[i])) {
					case "equip":
						types.add(get.subtype(hs[i]));
						break;
					case "hslingjian":
						lingjians.add(hs[i].name);
						break;
					case "jiqi":
						if (!lingjians.includes(hs[i].name)) {
							lingjians.unshift(hs[i].name);
						}
						break;
				}
			}
			var str = "";
			for (var i = 0; i < lingjians.length; i++) {
				var color;
				var type = get.type(lingjians[i]);
				if (type === "jiqi") {
					color = "rgba(233, 131, 255,0.2);";
				} else {
					color = "rgba(117,186,255,0.2);";
				}
				str += '<div style="text-align:left;line-height:18px;border-radius:4px;margin-top:7px;margin-bottom:10px;position:relative;width:100%">';
				str += '<div class="shadowed" style="position:absolute;left0;top:0;padding:5px;border-radius:4px;background:' + color + '">' + lib.translate[lingjians[i]] + "</div>";
				for (var j = 0; j < types.length; j++) {
					str += '<div class="shadowed" style="position:relative;left:85px;width:calc(100% - 95px);height:100%;padding:5px;border-radius: 4px;margin-bottom:10px">' + (type !== "jiqi" ? lib.translate[types[j]] + "：" : "") + lib.translate[lingjians[i] + "_" + types[j] + "_info"] + "</div>";
					if (type === "jiqi") {
						break;
					}
				}
				str += "</div>";
			}
			return str;
		},
		check(card) {
			if (get.type(card) === "jiqi") {
				if (_status.event.player.needsToDiscard()) {
					return 0.5;
				}
				return 0;
			}
			var num = 1 + get.value(card);
			if (get.position(card) === "e") {
				num += 0.1;
			}
			return num;
		},
		filterCard(card) {
			var type = get.type(card);
			if (type === "equip") {
				if (!lib.inpile.includes(card.name)) {
					return false;
				}
				if (lib.card[card.name].nopower) {
					return false;
				}
				if (lib.card[card.name].unique) {
					return false;
				}
				if (card.nopower) {
					return false;
				}
			}
			if (ui.selected.cards.length) {
				var type2 = get.type(ui.selected.cards[0]);
				if (type2 === "equip") {
					return type === "hslingjian" || type === "jiqi";
				} else {
					return type === "equip";
				}
			} else {
				return type === "equip" || type === "hslingjian" || type === "jiqi";
			}
		},
		selectCard: 2,
		complexCard: true,
		filter(event, player) {
			if (!player.countCards("h", { type: ["hslingjian", "jiqi"] })) {
				return false;
			}
			var es = player.getCards("he", { type: "equip" });
			for (var i = 0; i < es.length; i++) {
				if (lib.inpile.includes(es[i].name) && !lib.card[es[i].name].nopower && !lib.card[es[i].name].unique && !es[i].nopower) {
					return true;
				}
			}
			return false;
		},
		prepare: "throw",
		content() {
			"step 0";
			for (var i = 0; i < cards.length; i++) {
				cards[i].discard();
			}
			var name = lib.skill.lingjianduanzao.process(cards);
			var card = game.createCard(name);
			player.chooseTarget(
				function (card, player, target) {
					return !target.isMin() && get.distance(player, target) <= 1;
				},
				"选择一个目标装备" + get.translation(card.name),
				true
			).ai = function (target) {
				return get.effect(target, card, player, player);
			};
			event.card = card;
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.equip(event.card)._triggered = null;
				target.$gain2(event.card);
				game.delay();
			} else {
				player.gain(event.card, "gain2");
			}
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	hslingjian_chaofeng: {
		global: "hslingjian_chaofeng_disable",
		nopop: true,
		locked: true,
		unique: true,
		gainable: true,
		mark: true,
		intro: {
			content: "锁定技，与你相邻的角色只能选择你为出杀目标",
		},
		subSkill: {
			disable: {
				mod: {
					targetEnabled(card, player, target) {
						if (player.hasSkill("hslingjian_chaofeng")) {
							return;
						}
						if (card.name === "sha") {
							if (target.hasSkill("hslingjian_chaofeng")) {
								return;
							}
							if (
								game.hasPlayer(function (current) {
									return current.hasSkill("hslingjian_chaofeng") && get.distance(player, current, "pure") <= 1;
								})
							) {
								return false;
							}
						}
					},
				},
			},
		},
	},
	hslingjian_xingtigaizao: {
		nopop: true,
		mod: {
			maxHandcard(player, num) {
				if (typeof player.storage.hslingjian_xingtigaizao === "number") {
					return num - player.storage.hslingjian_xingtigaizao;
				}
			},
		},
		mark: true,
		intro: {
			content: "手牌上限-#",
		},
		trigger: { player: "phaseEnd" },
		silent: true,
		temp: true,
		vanish: true,
		content() {
			player.removeSkill("hslingjian_xingtigaizao");
			player.storage.hslingjian_xingtigaizao = 0;
		},
	},
	hslingjian_jinjilengdong: {
		mark: true,
		nopop: true,
		temp: true,
		intro: {
			content: "不能使用卡牌，也不能成为卡牌的目标",
		},
		mod: {
			targetEnabled(card, player, target) {
				return false;
			},
			cardEnabled(card, player) {
				return false;
			},
		},
	},
	qinglonglingzhu: {
		equipSkill: true,
		trigger: { source: "damageEnd" },
		direct: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.hasNature() && event.player && event.player.isAlive();
		},
		content() {
			player.gainPlayerCard(
				get.prompt("qinglonglingzhu", trigger.player),
				trigger.player,
				function (button) {
					if (get.attitude(player, trigger.player) <= 0) {
						return get.buttonValue(button);
					}
					return 0;
				},
				"he"
			).logSkill = ["qinglonglingzhu", trigger.player];
		},
	},
	xingjunyan: {
		equipSkill: true,
		trigger: { source: "damageBegin", player: "damageBegin" },
		forced: true,
		filter(event, player) {
			return event.card && event.card.name === "sha";
		},
		content() {
			trigger.num++;
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name === "sha") {
						return [1, -2];
					}
				},
			},
		},
	},
	baihupifeng: {
		equipSkill: true,
		trigger: { player: "phaseEnd" },
		frequent: true,
		filter(event, player) {
			return player.isMinHp() && player.isDamaged();
		},
		content() {
			player.recover();
		},
	},
	fengxueren: {
		equipSkill: true,
		trigger: { player: "shaHit" },
		check(event, player) {
			var att = get.attitude(player, event.target);
			if (player.hasSkill("jiu")) {
				return att > 0;
			}
			if (event.target.hp === 1) {
				return att > 0;
			}
			if (event.target.hasSkillTag("maixie")) {
				return att <= 0;
			}
			if (player.hasSkill("tianxianjiu")) {
				return false;
			}
			return att <= 0;
		},
		filter(event, player) {
			return !event.target.isTurnedOver();
		},
		logTarget: "target",
		content() {
			trigger.unhurt = true;
			trigger.target.turnOver();
			trigger.target.draw();
		},
	},
	chilongya: {
		equipSkill: true,
		trigger: { source: "damageBegin" },
		forced: true,
		filter(event) {
			return event.hasNature("fire") && event.notLink();
		},
		content() {
			trigger.num++;
		},
	},
	chilongya2: {
		trigger: { source: "damageBegin" },
		filter(event, player) {
			return event.card && event.card.name === "sha";
		},
		popup: false,
		forced: true,
		content() {
			if (Math.random() < 0.5) {
				trigger.num++;
				trigger.player.addSkill("chilongfengxue");
			}
		},
	},
	chilongfengxue: {
		trigger: { global: "shaAfter" },
		forced: true,
		popup: false,
		content() {
			player.draw();
			player.removeSkill("chilongfengxue");
		},
	},
	shentou: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filter(event, player) {
			var nh = player.countCards("h");
			if (nh === 0) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current !== player && current.countCards("h") > nh;
			});
		},
		check(card) {
			return 8 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (target.countCards("h") === 0) {
				return false;
			}
			if (target === player) {
				return false;
			}
			if (target.countCards("h") <= player.countCards("h")) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			player.judge(function (card) {
				if (get.suit(card) === "club") {
					return -1;
				}
				return 1;
			});
			"step 1";
			if (result.bool) {
				var card = target.getCards("h").randomGet();
				if (card) {
					player.gain(card, target);
					target.$giveAuto(card, player);
				}
			}
		},
		ai: {
			basic: {
				order: 5,
			},
			result: {
				player: 0.3,
				target: -1,
			},
		},
	},
	old_longfan: {
		enable: "phaseUse",
		usable: 1,
		prompt: "？",
		filterTarget: true,
		content() {
			"step 0";
			if (event.isMine()) {
				event.longfan = ui.create.control("零", "零", "零", "零", function () {
					event.longfan.status--;
				});
				event.longfan.status = 4;
				for (var i = 0; i < event.longfan.childNodes.length; i++) {
					event.longfan.childNodes[i].num = 0;
				}
				event.timer = setInterval(function () {
					if (event.longfan.status <= 0) {
						clearInterval(event.timer);
						game.resume();
						event.longfan.close();
						return;
					}
					event.count(0);
					if (event.longfan.status > 1) {
						event.count(1);
					}
					if (event.longfan.status > 2) {
						event.count(2);
					}
					if (event.longfan.status > 3) {
						event.count(3);
					}
				}, 200);
				event.count = function (num) {
					event.longfan.childNodes[num].num = (event.longfan.childNodes[num].num + 1) % 10;
					if (event.longfan.childNodes[num].num === 2) {
						event.longfan.childNodes[num].innerHTML = "二";
					} else {
						event.longfan.childNodes[num].innerHTML = get.cnNumber(event.longfan.childNodes[num].num);
					}
				};
				game.pause();
			} else {
				event.finish();
				var x = Math.random();
				if (x < 0.1) {
					target.draw();
				} else if (x < 0.2) {
					target.chooseToDiscard(true);
				} else if (x < 0.3) {
					target.loseHp();
				} else if (x < 0.4) {
					target.recover();
				} else if (x < 0.6) {
					if (get.attitude(player, target) > 0) {
						target.draw();
					} else {
						target.chooseToDiscard(true);
					}
				} else if (x < 0.8) {
					if (get.attitude(player, target) > 0) {
						target.recover();
					} else {
						target.loseHp();
					}
				}
			}
			"step 1";
			var str = "";
			for (var i = 0; i < event.longfan.childNodes.length; i++) {
				str += event.longfan.childNodes[i].num;
			}
			target.popup(str);
			game.delay();
			switch (str) {
				case "0000":
					target.turnOver();
					break;
				case "1111":
					target.chooseToDiscard(2, true);
					break;
				case "2222":
					target.chooseToDiscard("e", true);
					break;
				case "3333":
					target.damage();
					break;
				case "4444":
					target.loseHp();
					break;
				case "5555":
					target.link();
					break;
				case "6666":
					target.draw();
					break;
				case "7777":
					target.recover();
					break;
				case "8888":
					target.discard(target.getCards("j"));
					break;
				case "9999":
					target.draw(2);
					target.chooseToDiscard(2, true);
					break;
				default:
					for (var i = 1; i < 4; i++) {
						if (str[i] === str[0]) {
							return;
						}
					}
					player.chooseToDiscard(true);
					return;
			}
			player.draw();
		},
		ai: {
			basic: {
				order: 10,
			},
			result: {
				target() {
					return Math.random() - 0.5;
				},
			},
		},
	},
	longfan: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			player.judge(function (card) {
				switch (get.suit(card)) {
					case "heart":
						return player.maxHp > player.hp ? 2 : 0;
					case "diamond":
						return 1;
					case "club":
						return 1;
					case "spade":
						return 0;
				}
			});
			"step 1";
			switch (result.suit) {
				case "heart":
					player.recover();
					break;
				case "diamond":
					player.draw();
					break;
				case "club": {
					var targets = player.getEnemies();
					for (var i = 0; i < targets.length; i++) {
						if (!targets[i].countCards("he")) {
							targets.splice(i--, 1);
						}
					}
					if (targets.length) {
						var target = targets.randomGet();
						player.line(target);
						target.randomDiscard();
					}
					break;
				}
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	touzhi: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			return get.subtype(card) === "equip1";
		},
		filter(event, player) {
			return player.countCards("he", { subtype: "equip1" }) > 0;
		},
		discard: false,
		prepare: "give",
		filterTarget(card, player, target) {
			if (player === target) {
				return false;
			}
			return true;
		},
		content() {
			target.damage();
			target.gain(cards, player);
			// game.delay();
		},
		check(card) {
			return 10 - get.value(card);
		},
		position: "he",
		ai: {
			basic: {
				order: 8,
			},
			result: {
				target: -1,
			},
		},
	},
	xixue: {
		equipSkill: true,
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && player.hp < player.maxHp;
		},
		content() {
			player.recover(trigger.num);
		},
	},
	guangshatianyi: {
		equipSkill: true,
		trigger: { player: "damageBegin" },
		forced: true,
		filter(event, player) {
			if (
				event.source &&
				event.source.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return false;
			}
			if (Math.random() > 1 / 3) {
				return false;
			}
			return true;
		},
		content() {
			trigger.num--;
		},
	},
	nigong: {
		equipSkill: true,
		trigger: { player: "damageAfter" },
		group: ["nigong2", "nigong3"],
		forced: true,
		content() {
			player.storage.nigong += trigger.num;
			if (player.storage.nigong > 4) {
				player.storage.nigong = 4;
			}
			player.updateMarks();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && !target.hujia) {
						return [1, 0.5];
					}
				},
			},
		},
		intro: {
			content: "已积攒#点伤害",
		},
	},
	nigong2: {
		equipSkill: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.storage.nigong > 1;
		},
		filterTarget(card, player, target) {
			return player !== target;
		},
		prompt(event) {
			var str = "弃置所有逆攻标记，";
			if (event.player.storage.nigong % 2 !== 0) {
				str += "摸一张牌，";
			}
			str += "并对一名其他角色造成" + get.cnNumber(Math.floor(event.player.storage.nigong / 2)) + "点伤害";
			return str;
		},
		content() {
			if (player.storage.nigong % 2 !== 0) {
				player.draw();
			}
			target.damage(Math.floor(player.storage.nigong / 2));
			player.storage.nigong = 0;
			player.updateMarks();
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					var num = get.damageEffect(target, player, target);
					if (player.storage.nigong >= 4 && num > 0) {
						num = 0;
					}
					return num;
				},
			},
		},
	},
	nigong3: {
		equipSkill: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.storage.nigong === 1;
		},
		content() {
			player.draw();
			player.storage.nigong = 0;
			player.updateMarks();
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	sadengjinhuan: {
		equipSkill: true,
		trigger: { player: "shaMiss" },
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		content() {
			"step 0";
			player.judge(function (card) {
				return get.color(card) === "red" ? 1 : 0;
			});
			"step 1";
			if (result.bool) {
				trigger.target.chooseToRespond({ name: "shan" }, "萨登荆环：请额外打出一张闪响应杀").autochoose = lib.filter.autoRespondShan;
			} else {
				event.finish();
			}
			"step 2";
			if (!result.bool) {
				trigger.untrigger();
				trigger.trigger("shaHit");
				trigger._result.bool = false;
			}
		},
	},
	guiyanfadao: {
		equipSkill: true,
		trigger: { player: "shaHit" },
		check(event, player) {
			var att = get.attitude(player, event.target);
			if (player.hasSkill("jiu")) {
				return att > 0;
			}
			if (event.target.hasSkillTag("maixie_hp") || event.target.hasSkillTag("maixie_defend")) {
				return att <= 0;
			}
			if (player.hasSkill("tianxianjiu")) {
				return false;
			}
			if (event.target.hujia > 0) {
				return att < 0;
			}
			if (event.target.hp === 1) {
				return att > 0;
			}
			return false;
		},
		content() {
			trigger.unhurt = true;
			trigger.target.loseHp();
		},
	},
	guiyanfadao2: {
		trigger: { player: "useCardAfter" },
		forced: true,
		popup: false,
		content() {
			delete player.storage.zhuque_skill.nature;
		},
	},
	tianxianjiu: {
		trigger: { source: "damageEnd" },
		filter(event) {
			return event.card && event.card.name === "sha";
		},
		forced: true,
		temp: true,
		vanish: true,
		onremove(player) {
			if (player.node.jiu) {
				player.node.jiu.delete();
				player.node.jiu2.delete();
				delete player.node.jiu;
				delete player.node.jiu2;
			}
		},
		content() {
			player.draw(2);
			player.removeSkill("tianxianjiu");
		},
		ai: {
			damageBonus: true,
		},
	},
};

export default skill;
