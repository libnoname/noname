import { lib, game, ui, get, ai, _status } from "../../noname.js";

const cards = {
	//曹婴三种类型
	caoying_basic: { 
		fullskin: true,
		noname: true, 
	},
	caoying_trick: { 
		fullskin: true,
		noname: true, 
	},
	caoying_equip: { 
		fullskin: true,
		noname: true, 
	},
	//蒲元衍生
	sanlve: {
		derivation: "ol_puyuan",
		cardcolor: "spade",
		type: "equip",
		subtype: "equip5",
		ai: {
			basic: {
				equipValue: 5,
			},
		},
		skills: ["sanlve_skill"],
		fullskin: true,
	},
	zhaogujing: {
		derivation: "ol_puyuan",
		cardcolor: "diamond",
		type: "equip",
		subtype: "equip5",
		ai: {
			basic: {
				equipValue: 6.5,
			},
		},
		skills: ["zhaogujing_skill"],
		fullskin: true,
	},
	shufazijinguan: {
		derivation: "ol_puyuan",
		cardcolor: "diamond",
		type: "equip",
		subtype: "equip5",
		modeimage: "boss",
		ai: {
			basic: {
				equipValue: 8,
			},
		},
		skills: ["shufazijinguan_skill"],
		fullskin: true,
	},
	xuwangzhimian: {
		derivation: "ol_puyuan",
		cardcolor: "club",
		type: "equip",
		fullskin: true,
		subtype: "equip5",
		modeimage: "boss",
		skills: ["xuwangzhimian"],
		ai: {
			equipValue: 7,
		},
	},
	hongmianbaihuapao: {
		derivation: "ol_puyuan",
		cardcolor: "club",
		type: "equip",
		subtype: "equip2",
		modeimage: "boss",
		ai: {
			basic: {
				equipValue: 4,
			},
		},
		skills: ["hongmianbaihuapao_skill"],
		fullskin: true,
	},
	guofengyupao: {
		derivation: "ol_puyuan",
		cardcolor: "spade",
		type: "equip",
		fullskin: true,
		modeimage: "boss",
		subtype: "equip2",
		skills: ["guofengyupao"],
		ai: {
			equipValue: 7,
		},
	},
	qimenbagua: {
		derivation: "ol_puyuan",
		cardcolor: "spade",
		type: "equip",
		fullskin: true,
		modeimage: "boss",
		subtype: "equip2",
		skills: ["qimenbagua"],
		ai: {
			equipValue: 7.5,
		},
	},
	linglongshimandai: {
		derivation: "ol_puyuan",
		cardcolor: "spade",
		type: "equip",
		subtype: "equip2",
		modeimage: "boss",
		ai: {
			basic: {
				equipValue: 5,
			},
		},
		skills: ["linglongshimandai_skill"],
		fullskin: true,
	},
	chixueqingfeng: {
		derivation: "ol_puyuan",
		cardcolor: "spade",
		type: "equip",
		fullskin: true,
		modeimage: "boss",
		subtype: "equip1",
		distance: { attackFrom: -1 },
		skills: ["chixueqingfeng"],
		ai: {
			equipValue: 6.7,
		},
	},
	guilongzhanyuedao: {
		derivation: "ol_puyuan",
		cardcolor: "spade",
		type: "equip",
		fullskin: true,
		modeimage: "boss",
		subtype: "equip1",
		distance: { attackFrom: -2 },
		skills: ["guilongzhanyuedao"],
		nomod: true,
		nopower: true,
		unique: true,
		ai: {
			equipValue: 4,
		},
	},
	wushuangfangtianji: {
		derivation: "ol_puyuan",
		cardcolor: "diamond",
		type: "equip",
		modeimage: "boss",
		subtype: "equip1",
		distance: {
			attackFrom: -3,
		},
		ai: {
			basic: {
				equipValue: 3,
			},
		},
		skills: ["wushuangfangtianji_skill"],
		fullskin: true,
	},
	bintieshuangji: {
		derivation: "ol_puyuan",
		cardcolor: "diamond",
		type: "equip",
		subtype: "equip1",
		distance: {
			attackFrom: -2,
		},
		ai: {
			basic: {
				equipValue: 4.5,
			},
		},
		skills: ["bintieshuangji_skill"],
		fullskin: true,
	},
	//王允
	wy_meirenji: {
		fullskin: true,
		vanish: true,
		derivation: "wangyun",
		type: "trick",
		enable: true,
		filterTarget(card, player, target) {
			return target.countCards("h") && target != player && target.hasSex("male");
		},
		content() {
			"step 0";
			event.list = game
				.filterPlayer(function (current) {
					return current != player && current != target && current.hasSex("female");
				})
				.sortBySeat();
			"step 1";
			if (target.countCards("h") && event.list.length) {
				event.current = event.list.shift();
				event.current.gainPlayerCard(target, true, "h");
				target.line2([event.current, player]);
			} else {
				event.goto(4);
			}
			"step 2";
			event.current.chooseCard("h", true, "将一张手牌交给" + get.translation(player));
			"step 3";
			if (result.bool) {
				event.current.give(result.cards, player);
			}
			event.goto(1);
			"step 4";
			var n1 = target.countCards("h");
			var n2 = player.countCards("h");
			if (n1 > n2) {
				target.damage(player);
				player.line(target);
			} else if (n1 < n2) {
				player.damage(target);
				target.line(player);
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					var num = game.countPlayer(function (current) {
						return current != player && current != target && current.hasSex("female");
					});
					var nh = target.countCards("h");
					num = Math.min(num, nh);
					var nh1 = nh - num;
					var nh2 = player.countCards("h") - 1 + num;
					if (nh1 == nh2 && num == 0) {
						return 0;
					}
					if (nh2 <= nh1) {
						return -3;
					}
					if (player.hp == 1 || num == 1) {
						return 0;
					}
					return -1;
				},
			},
		},
	},
	wy_xiaolicangdao: {
		fullskin: true,
		vanish: true,
		derivation: "wangyun",
		type: "trick",
		enable: true,
		filterTarget(card, player, target) {
			return target != player;
		},
		content() {
			"step 0";
			var num = Math.min(5, target.maxHp - target.hp);
			if (num) {
				target.draw(num);
			}
			"step 1";
			target.damage();
		},
		ai: {
			order: 6,
			tag: {
				damage: 1,
			},
			result: {
				target(player, target) {
					var num = Math.min(5, target.maxHp - target.hp);
					if (target.hp == 1) {
						if (num >= 3) {
							return 0;
						}
						if (!target.hasSkillTag("maixie_hp")) {
							return -3;
						}
						return -1;
					}
					if (num == 2) {
						return 0;
					}
					return -2 + num + (Math.pow(target.hp, 0.2) - 1);
				},
			},
		},
	},
	zhuangshu_basic: {
		fullskin: true,
		vanish: true,
		derivation: "fengfangnv",
		cardcolor: "spade",
		type: "equip",
		subtype: "equip5",
		skills: ["zhuangshu_basic"],
		forceDie: true,
		onLose() {
			if ((!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
				cards.forEach(card => {
					card.fix();
					card.remove();
					card.destroyed = true;
					game.log(card, "被销毁了");
				});
			}
		},
		equipDelay: false,
		loseDelay: false,
		ai: {
			equipValue: 5,
			basic: {
				equipValue: 5,
			},
		},
	},
	zhuangshu_trick: {
		fullskin: true,
		vanish: true,
		derivation: "fengfangnv",
		cardcolor: "club",
		type: "equip",
		subtype: "equip5",
		forceDie: true,
		skills: ["zhuangshu_trick"],
		onLose() {
			if ((!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
				cards.forEach(card => {
					card.fix();
					card.remove();
					card.destroyed = true;
					game.log(card, "被销毁了");
				});
			}
		},
		equipDelay: false,
		loseDelay: false,
	},
	zhuangshu_equip: {
		fullskin: true,
		vanish: true,
		derivation: "fengfangnv",
		cardcolor: "heart",
		type: "equip",
		subtype: "equip5",
		skills: ["zhuangshu_equip"],
		forceDie: true,
		inherit: "zhuangshu_basic",
		onLose() {
			if ((!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
				cards.forEach(card => {
					card.fix();
					card.remove();
					card.destroyed = true;
					game.log(card, "被销毁了");
				});
			}
		},
		equipDelay: false,
		loseDelay: false,
	},
};
export default cards;
