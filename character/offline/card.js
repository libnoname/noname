import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	shengbei_left_yin: {
		fullskin: true,
		noname: true,
	},
	shengbei_left_yang: {
		fullskin: true,
		noname: true,
	},
	shengbei_right_yin: {
		fullskin: true,
		noname: true,
	},
	shengbei_right_yang: {
		fullskin: true,
		noname: true,
	},
	yiguzuoqi: {
		derivation: "xy_lvbu",
		audio: true,
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: -1,
		cardcolor: "red",
		toself: true,
		filterTarget(card, player, target) {
			return target === player;
		},
		modTarget: true,
		async content(event, trigger, player) {
			const name = event.name;
			player.addTip(name, "一鼓作气", true);
			player.addTempSkill("yiguzuoqi_effect");
		},
		ai: {
			wuxie(target, card, player, viewer) {
				if (target.countCards("h") < 4) {
					return 0;
				}
			},
			basic: {
				order: 11.2,
				useful: 4.5,
				value(card, player) {
					const cards = player.getCards("hs", card => {
						if (get.name(card) != "sha") {
							return false;
						}
						return player.hasValueTarget(card, false);
					});
					if (cards.length < player.getCardUsable("sha", true)) {
						return 0;
					}
					return 1.4 * Math.max(5, player.countCards("hs"));
				},
			},
			result: {
				target: 2,
			},
		},
	},
	zongma_attack: {
		derivation: "eu_makang",
		fullskin: true,
		image: "image/card/makang_zongma.png",
		type: "equip",
		subtype: "equip4",
		skills: ["eu_zongma_attack"],
	},
	zongma_defend: {
		derivation: "eu_makang",
		fullskin: true,
		image: "image/card/makang_zongma.png",
		type: "equip",
		subtype: "equip3",
		skills: ["eu_zongma_defend"],
	},
	hschenzhi_poker: {
		type: "poker",
		fullskin: true,
		noname: true,
		image: (card) => {
			return `image/card/lukai_${card.suit}.png`;
		}
	},
	chunqiubi: {
		derivation: "chenshou",
		cardcolor: "heart",
		type: "equip",
		subtype: "equip5",
		skills: ["chunqiubi_skill"],
		fullskin: true,
		destroy: true,
		ai: {
			basic: {
				equipValue: 5,
				order: (card, player) => {
					const equipValue = get.equipValue(card, player) / 20;
					return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
				},
				useful: 2,
				value: (card, player, index, method) => {
					if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) {
						return 0.01;
					}
					const info = get.info(card),
						current = player.getEquip(info.subtype),
						value = current && card != current && get.value(current, player);
					let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
					if (typeof equipValue == "function") {
						if (method == "raw") {
							return equipValue(card, player);
						}
						if (method == "raw2") {
							return equipValue(card, player) - value;
						}
						return Math.max(0.1, equipValue(card, player) - value);
					}
					if (typeof equipValue != "number") {
						equipValue = 0;
					}
					if (method == "raw") {
						return equipValue;
					}
					if (method == "raw2") {
						return equipValue - value;
					}
					return Math.max(0.1, equipValue - value);
				},
			},
			result: {
				target: (player, target, card) => get.equipResult(player, target, card),
			},
		},
		onLose() {
			if (player.getStat().skill.chunqiubi_skill) {
				delete player.getStat().skill.chunqiubi_skill;
			}
		},
	},
	sclc_wolong: {
		type: "takaramono",
		fullskin: true,
		cardimage: "wolong_card",
		//derivation:"scl_pangdegong",
	},
	sclc_fengchu: {
		type: "takaramono",
		fullskin: true,
		cardimage: "fengchu_card",
		//derivation:"scl_pangdegong",
	},
	sclc_shuijing: {
		fullskin: true,
		type: "takaramono",
		cardimage: "shuijing_card",
		//derivation:"scl_pangdegong",
	},
	sclc_xuanjian: {
		fullskin: true,
		type: "takaramono",
		cardimage: "xuanjian_card",
		//derivation:"scl_pangdegong",
	},
	yanxiao_card: {
		type: "special_delay",
		fullimage: true,
		noEffect: true,
		ai: {
			basic: {
				order: 1,
				useful: 1,
				value: 8,
			},
			result: {
				target: 1,
			},
		},
	},
	jingxiangshengshi: {
		audio: true,
		fullskin: true,
		derivation: "jx_shen_liubiao",
		type: "trick",
		enable: true,
		filterTarget: lib.filter.notMe,
		selectTarget() {
			return game.countGroup();
		},
		complexTarget: true,
		contentBefore() {
			if (!targets.length) {
				event.finish();
				return;
			}
			var num = game.countPlayer(),
				cards = get.cards(num);
			game.cardsGotoOrdering(cards).relatedEvent = event.getParent();
			var dialog = ui.create.dialog("荆襄盛世", cards, true);
			_status.dieClose.push(dialog);
			dialog.videoId = lib.status.videoId++;
			game.addVideo("cardDialog", null, ["荆襄盛世", get.cardsInfo(cards), dialog.videoId]);
			event.getParent().preResult = dialog.videoId;
			game.broadcast(
				function (cards, id) {
					var dialog = ui.create.dialog("荆襄盛世", cards, true);
					_status.dieClose.push(dialog);
					dialog.videoId = id;
				},
				cards,
				dialog.videoId
			);
			game.log(event.card, "亮出了", cards);
		},
		content() {
			"step 0";
			for (var i = 0; i < ui.dialogs.length; i++) {
				if (ui.dialogs[i].videoId == event.preResult) {
					event.dialog = ui.dialogs[i];
					break;
				}
			}
			if (!event.dialog || event.dialog.buttons.length == 0) {
				event.finish();
				return;
			}
			if (event.dialog.buttons.length > 1) {
				var next = target.chooseButton(true);
				next.set("ai", button => {
					let player = _status.event.player,
						card = button.link,
						val = get.value(card, player);
					if (get.tag(card, "recover")) {
						val += game.countPlayer(target => {
							return target.hp < 2 && get.attitude(player, target) > 0 && lib.filter.cardSavable(card, player, target);
						});
						if (player.hp <= 2 && game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
							val *= 2;
						}
					}
					return val;
				});
				next.set("dialog", event.preResult);
				next.set("closeDialog", false);
				next.set("dialogdisplay", true);
			} else {
				event.directButton = event.dialog.buttons[0];
			}
			"step 1";
			var dialog = event.dialog;
			var card;
			if (event.directButton) {
				card = event.directButton.link;
			} else {
				for (var i of dialog.buttons) {
					if (i.link == result.links[0]) {
						card = i.link;
						break;
					}
				}
				if (!card) {
					card = event.dialog.buttons[0].link;
				}
			}
			var button;
			for (var i = 0; i < dialog.buttons.length; i++) {
				if (dialog.buttons[i].link == card) {
					button = dialog.buttons[i];
					const innerHTML = target.getName(true);
					game.createButtonCardsetion(innerHTML, button);
					dialog.buttons.remove(button);
					break;
				}
			}
			var capt = get.translation(target) + "选择了" + get.translation(button.link);
			if (card) {
				target.gain(card, "visible");
				target.$gain2(card);
				game.broadcast(
					function (card, id, name, capt) {
						var dialog = get.idDialog(id);
						if (dialog) {
							dialog.content.firstChild.innerHTML = capt;
							for (var i = 0; i < dialog.buttons.length; i++) {
								if (dialog.buttons[i].link == card) {
									game.createButtonCardsetion(name, dialog.buttons[i]);
									dialog.buttons.splice(i--, 1);
									break;
								}
							}
						}
					},
					card,
					dialog.videoId,
					target.getName(true),
					capt
				);
			}
			dialog.content.firstChild.innerHTML = capt;
			game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
			game.log(target, "选择了", button.link);
			game.delay();
		},
		contentAfter() {
			"step 0";
			event.remained = [];
			for (var i = 0; i < ui.dialogs.length; i++) {
				if (ui.dialogs[i].videoId == event.preResult) {
					var dialog = ui.dialogs[i];
					dialog.close();
					_status.dieClose.remove(dialog);
					if (dialog.buttons.length) {
						for (var i = 0; i < dialog.buttons.length; i++) {
							event.remained.push(dialog.buttons[i].link);
						}
					}
					break;
				}
			}
			game.broadcast(function (id) {
				var dialog = get.idDialog(id);
				if (dialog) {
					dialog.close();
					_status.dieClose.remove(dialog);
				}
			}, event.preResult);
			game.addVideo("cardDialog", null, event.preResult);
			"step 1";
			if (event.remained.length) {
				player.gain(event.remained, "gain2");
			}
		},
		//ai简略，待补充
		ai: {
			wuxie() {
				if (Math.random() < 0.5) {
					return 0;
				}
			},
			basic: {
				order: 3,
				useful: 0.5,
			},
			result: {
				player(player, target) {
					return game.countPlayer() / game.countGroup() - 1;
				},
				target(player, target) {
					return 1.8 / Math.sqrt(1 + get.distance(player, target, "absolute"));
				},
			},
			tag: {
				draw: 1,
				multitarget: 1,
			},
		},
	},
	xingbian: {
		audio: true,
		fullskin: true,
		derivation: "yj_tianchuan",
		type: "equip",
		skills: ["xingbian_skill"],
		selectTarget: -1,
		filterTarget(card, player, target) {
			if (player !== target) {
				return false
			}
			const ranges = Array.from(Array(5)).map((value, index) => `equip${index + 1}`);
			if (get.is.mountCombined()) {
				ranges.removeArray(["equip3", "equip4"]);
				ranges.add("equip3_4");
			}
			if (get.itemtype(card) == "card") {
				const owner = get.owner(card, "judge");
				if (owner && !lib.filter.canBeGained(card, player, owner)) {
					return false;
				}
			}
			return ranges.some(range => player.countEquipableSlot(range));
		},
		async prepareEquip(event, trigger, player) {
			if (!event.card.subtypes?.length) {
				const choices = [];
				for (let i = 0; i <= 5; i++) {
					if (player.hasEquipableSlot(i)) {
						choices.push(`equip${i}`);
					}
				}
				if (!choices.length) {
					return;
				}
				const result = await player
					.chooseControl(choices)
					.set("prompt", "请选择置入【刑鞭】的装备栏")
					.set("ai", () => _status.event.controls.randomGet())
					.forResult();
				event.card.subtypes = [result.control];
			}
		},
		ai: {
			equipValue(card, player) {
				if (get.nameList(player).includes("yj_tianchuan")) {
					return 5;
				}
				return 0;
			},
			basic: {
				equipValue: 5,
			},
		},
	},
	yy_baimaxiaoqi: {
		audio: true,
		fullskin: true,
		type: "equip",
		subtype: "equip6",
		subtypes: ["equip3", "equip4"],
		nomod: true,
		nopower: true,
		distance: {
			globalFrom: -1,
			globalTo: +1,
		},
		skills: ["yy_baimaxiaoqi_skill"],
		ai: {
			equipValue(card, player) {
				return 5 + player.countCards("e");
			},
			basic: {
				equipValue: 6,
			},
		},
	},
	hm_zhong_heart: {
		audio: true,
		fullskin: true,
		derivation: "hm_shen_zhangjiao",
		type: "equip",
		skills: ["hm_zhong_heart_skill"],
		destroy: "discardPile",
		selectTarget: -1,
		filterTarget(card, player, target) {
			if (player !== target) {
				return false
			}
			const ranges = Array.from(Array(5)).map((value, index) => `equip${index + 1}`);
			if (get.is.mountCombined()) {
				ranges.removeArray(["equip3", "equip4"]);
				ranges.add("equip3_4");
			}
			if (get.itemtype(card) == "card") {
				const owner = get.owner(card, "judge");
				if (owner && !lib.filter.canBeGained(card, player, owner)) {
					return false;
				}
			}
			return ranges.some(range => player.countEquipableSlot(range));
		},
		async prepareEquip(event, trigger, player) {
			if (!event.card.subtypes?.length) {
				const choices = [];
				for (let i = 0; i <= 5; i++) {
					if (player.hasEquipableSlot(i)) {
						choices.push(`equip${i}`);
					}
				}
				if (!choices.length) {
					return;
				}
				const result = await player
					.chooseControl(choices)
					.set("prompt", "请选择置入【众】的装备栏")
					.set("ai", () => _status.event.controls.randomGet())
					.forResult();
				event.card.subtypes = [result.control];
			}
		},
		ai: {
			equipValue(card, player) {
				return 5;
			},
			basic: {
				equipValue: 5,
				order: (card, player) => {
					const equipValue = get.equipValue(card, player) / 20;
					return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
				},
				useful: 2,
				value: (card, player, index, method) => {
					if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) {
						return 0.01;
					}
					const info = get.info(card),
						current = player.getEquip(info.subtype),
						value = current && card != current && get.value(current, player);
					let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
					if (typeof equipValue == "function") {
						if (method == "raw") {
							return equipValue(card, player);
						}
						if (method == "raw2") {
							return equipValue(card, player) - value;
						}
						return Math.max(0.1, equipValue(card, player) - value);
					}
					if (typeof equipValue != "number") {
						equipValue = 0;
					}
					if (method == "raw") {
						return equipValue;
					}
					if (method == "raw2") {
						return equipValue - value;
					}
					return Math.max(0.1, equipValue - value);
				},
			},
			result: {
				target: (player, target, card) => get.equipResult(player, target, card),
			},
		},
		enable: true,
		modTarget: true,
		allowMultiple: false,
		toself: true,
	},
	hm_zhong_diamond: {
		audio: true,
		fullskin: true,
		derivation: "hm_shen_zhangjiao",
		type: "equip",
		skills: ["hm_zhong_diamond_skill"],
		destroy: "discardPile",
		selectTarget: -1,
		filterTarget(card, player, target) {
			if (player !== target) {
				return false
			}
			const ranges = Array.from(Array(5)).map((value, index) => `equip${index + 1}`);
			if (get.is.mountCombined()) {
				ranges.removeArray(["equip3", "equip4"]);
				ranges.add("equip3_4");
			}
			if (get.itemtype(card) == "card") {
				const owner = get.owner(card, "judge");
				if (owner && !lib.filter.canBeGained(card, player, owner)) {
					return false;
				}
			}
			return ranges.some(range => player.countEquipableSlot(range));
		},
		async prepareEquip(event, trigger, player) {
			if (!event.card.subtypes?.length) {
				const choices = [];
				for (let i = 0; i <= 5; i++) {
					if (player.hasEquipableSlot(i)) {
						choices.push(`equip${i}`);
					}
				}
				if (!choices.length) {
					return;
				}
				const result = await player
					.chooseControl(choices)
					.set("prompt", "请选择置入【众】的装备栏")
					.set("ai", () => _status.event.controls.randomGet())
					.forResult();
				event.card.subtypes = [result.control];
			}
		},
		ai: {
			equipValue(card, player) {
				return 5;
			},
			basic: {
				equipValue: 5,
				order: (card, player) => {
					const equipValue = get.equipValue(card, player) / 20;
					return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
				},
				useful: 2,
				value: (card, player, index, method) => {
					if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) {
						return 0.01;
					}
					const info = get.info(card),
						current = player.getEquip(info.subtype),
						value = current && card != current && get.value(current, player);
					let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
					if (typeof equipValue == "function") {
						if (method == "raw") {
							return equipValue(card, player);
						}
						if (method == "raw2") {
							return equipValue(card, player) - value;
						}
						return Math.max(0.1, equipValue(card, player) - value);
					}
					if (typeof equipValue != "number") {
						equipValue = 0;
					}
					if (method == "raw") {
						return equipValue;
					}
					if (method == "raw2") {
						return equipValue - value;
					}
					return Math.max(0.1, equipValue - value);
				},
			},
			result: {
				target: (player, target, card) => get.equipResult(player, target, card),
			},
		},
		enable: true,
		modTarget: true,
		allowMultiple: false,
		toself: true,
	},
	hm_zhong_club: {
		audio: true,
		fullskin: true,
		derivation: "hm_shen_zhangjiao",
		type: "equip",
		skills: ["hm_zhong_club_skill"],
		destroy: "discardPile",
		selectTarget: -1,
		filterTarget(card, player, target) {
			if (player !== target) {
				return false
			}
			const ranges = Array.from(Array(5)).map((value, index) => `equip${index + 1}`);
			if (get.is.mountCombined()) {
				ranges.removeArray(["equip3", "equip4"]);
				ranges.add("equip3_4");
			}
			if (get.itemtype(card) == "card") {
				const owner = get.owner(card, "judge");
				if (owner && !lib.filter.canBeGained(card, player, owner)) {
					return false;
				}
			}
			return ranges.some(range => player.countEquipableSlot(range));
		},
		async prepareEquip(event, trigger, player) {
			if (!event.card.subtypes?.length) {
				const choices = [];
				for (let i = 0; i <= 5; i++) {
					if (player.hasEquipableSlot(i)) {
						choices.push(`equip${i}`);
					}
				}
				if (!choices.length) {
					return;
				}
				const result = await player
					.chooseControl(choices)
					.set("prompt", "请选择置入【众】的装备栏")
					.set("ai", () => _status.event.controls.randomGet())
					.forResult();
				event.card.subtypes = [result.control];
			}
		},
		ai: {
			equipValue(card, player) {
				return 5;
			},
			basic: {
				equipValue: 5,
				order: (card, player) => {
					const equipValue = get.equipValue(card, player) / 20;
					return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
				},
				useful: 2,
				value: (card, player, index, method) => {
					if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) {
						return 0.01;
					}
					const info = get.info(card),
						current = player.getEquip(info.subtype),
						value = current && card != current && get.value(current, player);
					let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
					if (typeof equipValue == "function") {
						if (method == "raw") {
							return equipValue(card, player);
						}
						if (method == "raw2") {
							return equipValue(card, player) - value;
						}
						return Math.max(0.1, equipValue(card, player) - value);
					}
					if (typeof equipValue != "number") {
						equipValue = 0;
					}
					if (method == "raw") {
						return equipValue;
					}
					if (method == "raw2") {
						return equipValue - value;
					}
					return Math.max(0.1, equipValue - value);
				},
			},
			result: {
				target: (player, target, card) => get.equipResult(player, target, card),
			},
		},
		enable: true,
		modTarget: true,
		allowMultiple: false,
		toself: true,
	},
	hm_zhong_spade: {
		audio: true,
		fullskin: true,
		derivation: "hm_shen_zhangjiao",
		type: "equip",
		skills: ["hm_zhong_spade_skill"],
		destroy: "discardPile",
		selectTarget: -1,
		filterTarget(card, player, target) {
			if (player !== target) {
				return false
			}
			const ranges = Array.from(Array(5)).map((value, index) => `equip${index + 1}`);
			if (get.is.mountCombined()) {
				ranges.removeArray(["equip3", "equip4"]);
				ranges.add("equip3_4");
			}
			if (get.itemtype(card) == "card") {
				const owner = get.owner(card, "judge");
				if (owner && !lib.filter.canBeGained(card, player, owner)) {
					return false;
				}
			}
			return ranges.some(range => player.countEquipableSlot(range));
		},
		async prepareEquip(event, trigger, player) {
			if (!event.card.subtypes?.length) {
				const choices = [];
				for (let i = 0; i <= 5; i++) {
					if (player.hasEquipableSlot(i)) {
						choices.push(`equip${i}`);
					}
				}
				if (!choices.length) {
					return;
				}
				const result = await player
					.chooseControl(choices)
					.set("prompt", "请选择置入【众】的装备栏")
					.set("ai", () => _status.event.controls.randomGet())
					.forResult();
				event.card.subtypes = [result.control];
			}
		},
		ai: {
			equipValue(card, player) {
				return 5;
			},
			basic: {
				equipValue: 5,
				order: (card, player) => {
					const equipValue = get.equipValue(card, player) / 20;
					return player && player.hasSkillTag("reverseEquip") ? 8.5 - equipValue : 8 + equipValue;
				},
				useful: 2,
				value: (card, player, index, method) => {
					if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) {
						return 0.01;
					}
					const info = get.info(card),
						current = player.getEquip(info.subtype),
						value = current && card != current && get.value(current, player);
					let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
					if (typeof equipValue == "function") {
						if (method == "raw") {
							return equipValue(card, player);
						}
						if (method == "raw2") {
							return equipValue(card, player) - value;
						}
						return Math.max(0.1, equipValue(card, player) - value);
					}
					if (typeof equipValue != "number") {
						equipValue = 0;
					}
					if (method == "raw") {
						return equipValue;
					}
					if (method == "raw2") {
						return equipValue - value;
					}
					return Math.max(0.1, equipValue - value);
				},
			},
			result: {
				target: (player, target, card) => get.equipResult(player, target, card),
			},
		},
		enable: true,
		modTarget: true,
		allowMultiple: false,
		toself: true,
	},
};
export default cards;
