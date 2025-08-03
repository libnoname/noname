import { lib, game, ui, get, ai, _status } from "../../noname.js";

const cards = {
	//武关羽的兵临城下水淹七军
	shuiyanqijuny: {
		audio: "shuiyanqijunx",
		fullskin: true,
		cardimage: "shuiyanqijunx",
		enable: true,
		filterTarget: true,
		type: "trick",
		selectTarget: [1, 2],
		targetprompt: ["受伤弃牌", "受伤摸牌"],
		contentBefore() {
			var evt = event.getParent(),
				target = evt.stocktargets[0];
			evt.shuiyanqijun_target = target;
		},
		content() {
			target.damage("thunder");
			if (target != event.getParent().shuiyanqijun_target) {
				target.draw();
			} else {
				target.chooseToDiscard("he", true);
			}
		},
		ai: {
			order: 6,
			value: 4,
			useful: 2,
			tag: {
				damage: 1,
				thunderDamage: 1,
				natureDamage: 1,
				loseCard: 1,
			},
			result: {
				target(player, target) {
					if (!ui.selected.targets.length) {
						return -1.5;
					}
					return -0.5;
				},
			},
		},
	},
	pyzhuren_heart: {
		fullskin: true,
		derivation: "puyuan",
		cardcolor: "heart",
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -2 },
		skills: ["pyzhuren_heart"],
		onDestroy(card) {
			if (_status.pyzhuren && _status.pyzhuren[card.name]) {
				delete _status.pyzhuren[card.name];
			}
		},
		ai: { basic: { equipValue: 4 } },
		onLose() {
			if (player.storage.counttrigger?.pyzhuren_heart > 0) {
				delete player.storage.counttrigger.pyzhuren_heart;
			}
		},
	},
	pyzhuren_diamond: {
		fullskin: true,
		derivation: "puyuan",
		cardcolor: "diamond",
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -1 },
		skills: ["pyzhuren_diamond"],
		onDestroy(card) {
			if (_status.pyzhuren && _status.pyzhuren[card.name]) {
				delete _status.pyzhuren[card.name];
			}
		},
		onLose() {
			if (player.storage.counttrigger?.pyzhuren_diamond > 0) {
				delete player.storage.counttrigger.pyzhuren_diamond;
			}
		},
		ai: { basic: { equipValue: 3 } },
	},
	pyzhuren_club: {
		fullskin: true,
		derivation: "puyuan",
		cardcolor: "club",
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -1 },
		skills: ["pyzhuren_club"],
		onDestroy(card) {
			if (_status.pyzhuren && _status.pyzhuren[card.name]) {
				delete _status.pyzhuren[card.name];
			}
		},
		ai: { basic: { equipValue: 5 } },
		loseDelay: false,
		onLose() {
			if (player.storage.counttrigger?.pyzhuren_club > 0) {
				delete player.storage.counttrigger.pyzhuren_club;
			}
			player.addTempSkill("pyzhuren_club_lose");
		},
	},
	pyzhuren_spade: {
		fullskin: true,
		derivation: "puyuan",
		cardcolor: "spade",
		type: "equip",
		subtype: "equip1",
		skills: ["pyzhuren_spade"],
		onDestroy(card) {
			if (_status.pyzhuren && _status.pyzhuren[card.name]) {
				delete _status.pyzhuren[card.name];
			}
		},
		ai: {
			basic: {
				equipValue: 3,
			},
		},
	},
	pyzhuren_shandian: {
		fullskin: true,
		derivation: "puyuan",
		cardcolor: "spade",
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -3 },
		skills: ["pyzhuren_shandian"],
		onDestroy(card) {
			if (_status.pyzhuren && _status.pyzhuren[card.name]) {
				delete _status.pyzhuren[card.name];
			}
		},
		ai: {
			basic: {
				equipValue: 3,
			},
		},
	},
	dagongche: {
		fullskin: true,
		derivation: "zhangfen",
		cardcolor: "spade",
		type: "equip",
		subtype: "equip5",
		skills: ["dagongche_skill"],
		cardPrompt(card) {
			if (!card.storage) {
				return "出牌阶段开始时，你可以视为使用一张【杀】，且当此【杀】因执行效果而对目标角色造成伤害后，你弃置其一张牌。若此【大攻车】未被强化，则其他角色无法弃置你装备区内的【大攻车】。当此牌离开你的装备区后，销毁之。";
			}
			var str = "出牌阶段开始时，你可以视为使用一张";
			if (card.storage.大攻车选项一) {
				str += "无距离限制且无视防具的";
			}
			str += "【杀】";
			if (card.storage.大攻车选项二) {
				str += "（此【杀】的目标上限+" + card.storage.大攻车选项二 + "）";
			}
			str += "，且当此【杀】因执行效果而对目标角色造成伤害后，你弃置其";
			var num = 1;
			if (card.storage.大攻车选项三) {
				num += card.storage.大攻车选项三;
			}
			str += get.cnNumber(num);
			str += "张牌。当此牌离开你的装备区后，销毁之。";
			return str;
		},
		destroy: true,
		ai: {
			basic: {
				equipValue: 3,
			},
		},
	},
	pilitoushiche: {
		fullskin: true,
		derivation: "dc_liuye",
		cardimage: "ly_piliche",
		cardcolor: "diamond",
		type: "equip",
		subtype: "equip5",
		skills: ["pilitoushiche"],
		destroy: true,
		ai: {
			basic: {
				equipValue: 3,
			},
		},
	},
};

export default cards;
