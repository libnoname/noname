import { _status, game, get, lib } from "noname";

/**
 * 战法！！！！！有几种类型的战法是有模板可以套的，详情请看library的index.js，搜索zf_开头的技能
 * @type {Record<string, {skill: Skill | string, rarity: string | null, [p: string]: any}>}
 */
const _zhanfa = {
	/*zf_: {
		rarity:"",
		translate: "",
		info: "",
		card: {
			value: ,
		},
		skill: {

		}
	},*/
	//喜从天降
	zf_xicongtianjiang: {
		rarity: "common",
		translate: "喜从天降",
		info: "立即获得1个虎符",
		card: {
			value: 5,
		},
		skill: {
			init(player, skill) {
				player.addMark("danqi_hufu");
			},
		},
	},
	//喜从天降Ⅱ
	zf_xicongtianjiang2: {
		rarity: "common",
		translate: "喜从天降Ⅱ",
		info: "立即获得2个虎符",
		card: {
			value: 6,
		},
		skill: {
			init(player, skill) {
				player.addMark("danqi_hufu", 2);
			},
		},
	},
	//拔刀术
	zf_badaoshu: {
		rarity: "epic",
		translate: "拔刀术",
		info: "若上一轮你未造成任何伤害，则你本轮造成的所有伤害+1",
		card: {
			value: 5.8,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				if (game.roundNumber < 2) {
					return false;
				}
				return !player.getRoundHistory("sourceDamage", evt => evt.num > 0, 1).length;
			},
		},
	},
	//拔刀术Ⅱ
	zf_badaoshu2: {
		rarity: "legend",
		translate: "拔刀术Ⅱ",
		info: "若上一轮造成的伤害小于3，则你本轮造成的所有伤害+1",
		card: {
			cardimage: "zf_badaoshu",
			value: 8.2,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				if (game.roundNumber < 2) {
					return false;
				}
				return player.getRoundHistory("sourceDamage", evt => evt.num > 0, 1).reduce((sum, evt) => sum + evt.num, 0) < 3;
			},
		},
	},
	//搬运
	zf_banyun: {
		rarity: "rare",
		translate: "搬运",
		info: "你的回合开始时，从随机敌方手牌区获得1张牌",
		card: {
			value: 6,
		},
		skill: {
			forced: true,
			trigger: { player: "phaseBegin" },
			filter(event, player) {
				return player.getEnemies(target => target.countGainableCards(player, "h"), false).length;
			},
			async content(event, trigger, player) {
				const target = player.getEnemies(target => target.countGainableCards(player, "h"), false).randomGet();
				const card = target.getGainableCards(player, "h").randomGet();
				await player.gain(card, target, "giveAuto", "bySelf");
			},
		},
	},
	//博闻Ⅰ
	zf_bowen: {
		rarity: "epic",
		translate: "博闻Ⅰ",
		info: "你的回合开始时，从牌堆中获得一张随机锦囊牌",
		card: {
			value: 7,
		},
		skill: {
			inherit: "zf_anyGain",
			cardFilter: { type2: "trick" },
			num: 1,
		},
	},
	//博闻Ⅱ
	zf_bowen2: {
		rarity: "legend",
		translate: "博闻Ⅱ",
		info: "你的回合开始时，从牌堆中获得两张随机锦囊牌",
		card: {
			cardimage: "zf_bowen",
			value: 8,
		},
		skill: {
			inherit: "zf_bowen",
			num: 2,
		},
	},
	//博闻Ⅲ
	zf_bowen3: {
		rarity: "legend",
		translate: "博闻Ⅲ",
		info: "你的回合开始时，从牌堆中获得三张随机锦囊牌",
		card: {
			cardimage: "zf_bowen",
			value: 10,
		},
		skill: {
			inherit: "zf_bowen",
			num: 3,
		},
	},
	//搏命
	zf_boming: {
		rarity: "common",
		translate: "搏命",
		info: "手牌上限-2，出杀次数+1",
		card: {
			value: 4,
		},
		skill: {
			mod: {
				cardUsable(card, player, num) {
					if (card.name == "sha") {
						return num + 1;
					}
				},
				maxHandcard(player, num) {
					return num - 2;
				},
			},
		},
	},
	//布阵Ⅱ
	zf_buzhen2: {
		rarity: "common",
		translate: "布阵Ⅱ",
		info: "从第5轮开始，你的摸牌数+1",
		card: {
			cardimage: "zf_buzhen",
			value: 4.8,
		},
		skill: {
			inherit: "zf_phaseDraw",
			filter(event, player) {
				return !event.numFixed && game.roundNumber >= 5;
			},
		},
	},
	//布阵Ⅲ
	zf_buzhen3: {
		rarity: "common",
		translate: "布阵Ⅲ",
		info: "从第7轮开始，你的摸牌数+1",
		card: {
			cardimage: "zf_buzhen",
			value: 4,
		},
		skill: {
			inherit: "zf_phaseDraw",
			filter(event, player) {
				return !event.numFixed && game.roundNumber >= 7;
			},
		},
	},
	//布阵
	zf_buzhen: {
		rarity: "rare",
		translate: "布阵",
		info: "从第3轮开始，你的摸牌数+1",
		card: {
			value: 5.4,
		},
		skill: {
			inherit: "zf_phaseDraw",
			filter(event, player) {
				return !event.numFixed && game.roundNumber >= 3;
			},
		},
	},
	//藏桃户
	zf_cangtaohu: {
		rarity: "common",
		translate: "藏桃户",
		info: "【桃】不计入手牌上限",
		card: {
			value: 5.3,
		},
		skill: {
			mod: {
				ignoredHandcard(card, player) {
					if (card.name == "tao") {
						return true;
					}
				},
				cardDiscardable(card, player, name) {
					if (name === "phaseDiscard" && card.name == "tao") {
						return false;
					}
				},
			},
		},
	},
	//草船借箭
	zf_caochuanjiejian: {
		rarity: "common",
		translate: "草船借箭",
		info: "【无懈可击】获得抵消的锦囊牌",
		card: {
			value: 4.9,
		},
		skill: {
			forced: true,
			trigger: { global: ["eventNeutralized"] },
			filter(event, player) {
				const evt = event._neutralize_event;
				if (evt.name != "wuxie" || evt.player != player) {
					return false;
				}
				return event.cards?.someInD();
			},
			async content(event, trigger, player) {
				await player.gain(trigger.cards.filterInD(), "gain2");
			},
		},
	},
	//策定天下
	zf_cedingtianxia: {
		rarity: "common",
		translate: "策定天下",
		info: "出牌阶段限一次，当你使用锦囊牌造成伤害后，摸一张牌",
		card: {
			value: 5.6,
		},
		skill: {
			inherit: "zf_anyDraw",
			filter(event, player) {
				return event.card && get.type2(event.card) == "trick" && player.isPhaseUsing();
			},
			usable: 1,
		},
	},
	//策定天下Ⅱ
	zf_cedingtianxia2: {
		rarity: "rare",
		translate: "策定天下Ⅱ",
		info: "出牌阶段限一次，当你使用锦囊牌造成伤害后，摸两张牌",
		card: {
			cardimage: "zf_cedingtianxia",
			value: 7.2,
		},
		skill: {
			inherit: "zf_cedingtianxia",
			num: 2,
		},
	},
	//趁其不备
	zf_chenqibubei: {
		rarity: "epic",
		translate: "趁其不备",
		info: "	你使用【过河拆桥】时，至多弃置目标两张牌",
		card: {
			value: 5.5,
		},
		skill: {
			forced: true,
			trigger: { player: "discardPlayerCardBegin" },
			filter(event, player) {
				return event.getParent()?.name == "guohe";
			},
			num: 2,
			async content(event, trigger, player) {
				const num = get.info(event.name).num;
				const range = get.select(trigger.selectButton);
				if (range[1] < num && range[1] > 0) {
					range[1] = num;
					trigger.selectButton = range;
				}
			},
		},
	},
	//趁其不备Ⅱ
	zf_chenqibubei2: {
		rarity: "legend",
		translate: "趁其不备Ⅱ",
		info: "	你使用【过河拆桥】时，至多弃置目标三张牌",
		card: {
			cardimage: "zf_chenqibubei",
			value: 7.5,
		},
		skill: {
			inherit: "zf_chenqibubei",
			num: 3,
		},
	},
	//持久战Ⅰ
	zf_chijiuzhan: {
		rarity: "common",
		translate: "持久战Ⅰ",
		info: "虎符数量达到3后，手牌上限+1",
		card: {
			value: 5.7,
		},
		skill: {
			inherit: "zf_maxHandcard",
			modNum: (player, num) => {
				if (player.countMark("danqi_hufu") >= 3) {
					return num + 1;
				}
			},
		},
	},
	//持久战Ⅳ
	zf_chijiuzhan4: {
		rarity: "rare",
		translate: "持久战Ⅳ",
		info: "虎符数量达到3后，出杀次数+1",
		card: {
			value: 6.3,
		},
		skill: {
			inherit: "zf_cardUsable",
			modNum(card, player, num) {
				if (card.name == "sha" && player.countMark("danqi_hufu") >= 3) {
					return num + 1;
				}
			},
		},
	},
	//持久战Ⅲ
	zf_chijiuzhan3: {
		rarity: "rare",
		translate: "持久战Ⅲ",
		info: "虎符数量达到7后，摸牌数+1",
		card: {
			value: 5.3,
		},
		skill: {
			inherit: "zf_phaseDraw",
			filter(event, player) {
				return player.countMark("danqi_hufu") >= 7;
			},
		},
	},
	//淬血
	zf_cuixue: {
		rarity: "rare",
		translate: "淬血",
		info: "你每轮【杀】首次造成伤害后摸一张牌",
		card: {
			value: 6.1,
		},
		skill: {
			inherit: "zf_anyDraw",
			filter(event, player) {
				return player.getRoundHistory("sourceDamage", evt => evt.card?.name == "sha").indexOf(event) == 0;
			},
		},
	},
	//淬血Ⅱ
	zf_cuixue2: {
		rarity: "epic",
		translate: "淬血Ⅱ",
		info: "你每轮【杀】首次造成伤害后摸两张牌",
		card: {
			cardimage: "zf_cuixue",
			value: 7.6,
		},
		skill: {
			inherit: "zf_cuixue",
			num: 2,
		},
	},
	//胆量剥夺
	zf_danliangboduo: {
		rarity: "epic",
		translate: "胆量剥夺",
		info: "敌方的出杀次数-1，最低为1",
		card: {
			value: 6.7,
		},
		skill: {
			global: "zf_danliangboduo_global",
			subSkill: {
				global: {
					charlotte: true,
					mod: {
						cardUsable(card, player, num) {
							if (card.name == "sha") {
								const count = player.getEnemies(target => target.hasSkill("zf_danliangboduo", null, null, false), false).length;
								if (count) {
									return Math.max(1, num - count);
								}
							}
						},
					},
				},
			},
		},
	},
	//当头一棒
	zf_dangtouyibang: {
		rarity: "epic",
		translate: "当头一棒",
		info: "每轮，你的首张【杀】伤害+1",
		card: {
			value: 7.5,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				return player.getRoundHistory("useCard", evt => evt.card.name == "sha").indexOf(event) == 0;
			},
		},
	},
	//当头一棒Ⅱ
	zf_dangtouyibang2: {
		rarity: "legend",
		translate: "当头一棒Ⅱ",
		info: "每轮，你的首张【杀】伤害+2",
		card: {
			cardimage: "zf_dangtouyibang",
			value: 8.5,
		},
		skill: {
			inherit: "zf_dangtouyibang",
			num: 2,
		},
	},
	//赌术
	zf_dushu: {
		rarity: "common",
		translate: "赌术",
		info: "	你的拼点牌点数+3（最大为K）",
		card: {
			value: 4.5,
		},
		skill: {
			forced: true,
			trigger: {
				player: "compare",
				target: "compare",
			},
			filter(event, player) {
				if (event.player == player) {
					return !event.iwhile;
				}
				return true;
			},
			async content(event, trigger, player) {
				if (player == trigger.player) {
					trigger.num1 += 3;
					if (trigger.num1 > 13) {
						trigger.num1 = 13;
					}
				} else {
					trigger.num2 += 3;
					if (trigger.num2 > 13) {
						trigger.num2 = 13;
					}
				}
				game.log(player, "的拼点牌点数+3");
			},
		},
	},
	//赌术Ⅱ
	zf_dushu2: {
		rarity: "rare",
		translate: "赌术Ⅱ",
		info: "	你的拼点牌点数+6（最大为K）",
		card: {
			value: 4.8,
		},
		skill: {
			inherit: "zf_dushu",
			async content(event, trigger, player) {
				if (player == trigger.player) {
					trigger.num1 += 6;
					if (trigger.num1 > 13) {
						trigger.num1 = 13;
					}
				} else {
					trigger.num2 += 6;
					if (trigger.num2 > 13) {
						trigger.num2 = 13;
					}
				}
				game.log(player, "的拼点牌点数+6");
			},
		},
	},
	//断粮草Ⅱ
	zf_duanliangcao2: {
		rarity: "epic",
		translate: "断粮草Ⅱ",
		info: "敌方摸牌数-1，最低为2",
		card: {
			value: 6.2,
		},
		skill: {
			global: "zf_duanliangcao2_global",
			subSkill: {
				global: {
					silent: true,
					trigger: { player: "phaseDrawBegin2" },
					filter(event, player) {
						return !event.numFixed;
					},
					async content(event, trigger, player) {
						const num = player.getEnemies(target => target.hasSkill("zf_duanliangcao2", null, null, false), false).length;
						trigger.num = Math.max(2, trigger.num - num);
					},
				},
			},
		},
	},
	//多多益善
	zf_duoduoyishan: {
		rarity: "common",
		translate: "多多益善",
		info: "每回合你第5次摸牌后,你摸一张牌",
		card: {
			value: 5.8,
		},
		skill: {
			inherit: "zf_anyDraw",
			trigger: { player: "drawEnd" },
			filter(event, player) {
				return (
					player
						.getHistory("gain", evt => evt.getParent()?.name == "draw")
						.map(evt => evt.getParent())
						.indexOf(event) == 4
				);
			},
		},
	},
	//多多益善Ⅱ
	zf_duoduoyishan2: {
		rarity: "rare",
		translate: "多多益善Ⅱ",
		info: "每回合你第3次摸牌后,你摸一张牌",
		card: {
			cardimage: "zf_duoduoyishan",
			value: 6.7,
		},
		skill: {
			inherit: "zf_duoduoyishan",
			filter(event, player) {
				return (
					player
						.getHistory("gain", evt => evt.getParent()?.name == "draw")
						.map(evt => evt.getParent())
						.indexOf(event) == 2
				);
			},
		},
	},
	//多多益善Ⅲ
	zf_duoduoyishan3: {
		rarity: "legend",
		translate: "多多益善Ⅲ",
		info: "每回合你第3次摸牌后,你摸两张牌",
		card: {
			cardimage: "zf_duoduoyishan",
			value: 7.4,
		},
		skill: {
			inherit: "zf_duoduoyishan2",
			num: 2,
		},
	},
	//二连击
	zf_erlianji: {
		rarity: "rare",
		translate: "二连击",
		info: "你的出牌阶段，你的出杀次数+1",
		card: {
			value: 7,
		},
		skill: {
			inherit: "zf_cardUsable",
			cardFilter: "sha",
		},
	},
	//三连击
	zf_sanlianji: {
		rarity: "legend",
		translate: "三连击",
		info: "你的出牌阶段，你的出杀次数+2",
		card: {
			cardimage: "zf_erlianji",
			value: 8.6,
		},
		skill: {
			inherit: "zf_erlianji",
			modNum: 2,
		},
	},
	//二生三
	zf_ershengsan: {
		rarity: "common",
		translate: "二生三",
		info: "【无中生有】额外摸1张牌",
		card: {
			value: 5.2,
		},
		skill: {
			forced: true,
			trigger: { player: "drawBegin" },
			filter(event, player) {
				return event.getParent()?.name == "wuzhong";
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
		},
	},
	//反刺
	zf_fanci: {
		rarity: "legend",
		translate: "反刺",
		info: "每回合首次受到伤害后对所有敌方造成1点伤害",
		card: {
			value: 8.7,
		},
		skill: {
			inherit: "zf_directDamage",
			filter(event, player) {
				return player.getHistory("damage", evt => evt.num > 0).indexOf(event) == 0 && player.getEnemies(() => true, false).length;
			},
			select: "all",
		},
	},
	//奋进
	zf_fenjin: {
		rarity: "common",
		translate: "奋进",
		info: "当体力大于2点，回合开始时失去1点体力并摸两张牌",
		card: {
			value: 4.2,
		},
		skill: {
			forced: true,
			trigger: { player: "phaseBegin" },
			filter(event, player) {
				return player.getHp() > 2;
			},
			async content(event, trigger, player) {
				await player.loseHp();
				await player.draw(2);
			},
		},
	},
	//丰收年
	zf_fengshounian: {
		rarity: "rare",
		translate: "丰收年",
		info: "你使用的【五谷丰登】仅友方角色可以获得牌",
		card: {
			value: 5.1,
		},
		skill: {
			forced: true,
			trigger: { player: "useCard" },
			filter(event, player) {
				return event.card.name == "wugu";
			},
			async content(event, trigger, player) {
				const targets = player.getEnemies(target => trigger.targets.includes(target), false);
				trigger.excluded.addArray(targets);
			},
		},
	},
	//拂衣去杀
	zf_fuyiqusha: {
		rarity: "rare",
		translate: "拂衣去·杀",
		info: "你的回合开始时，你获得一张【杀】",
		card: {
			value: 5.9,
		},
		skill: {
			inherit: "zf_anyGain",
			cardFilter: "sha",
		},
	},
	//拂衣去火
	zf_fuyiquhuo: {
		rarity: "rare",
		translate: "拂衣去·火",
		info: "你的回合开始时，你获得一张【火攻】",
		card: {
			cardimage: "zf_fuyiqusha",
			value: 5,
		},
		skill: {
			inherit: "zf_anyGain",
			cardFilter: "huogong",
		},
	},
	//拂衣去闪
	zf_fuyiqushan: {
		rarity: "rare",
		translate: "拂衣去·闪",
		info: "你的回合开始时，你获得一张【闪】",
		card: {
			cardimage: "zf_fuyiqusha",
			value: 6.2,
		},
		skill: {
			inherit: "zf_anyGain",
			cardFilter: "shan",
		},
	},
	//拂衣去桃
	zf_fuyiqutao: {
		rarity: "epic",
		translate: "拂衣去·桃",
		info: "你的回合开始时，你获得一张【桃】",
		card: {
			cardimage: "zf_fuyiqusha",
			value: 9,
		},
		skill: {
			inherit: "zf_anyGain",
			cardFilter: "tao",
		},
	},
	//拂衣去拆
	zf_fuyiquchai: {
		rarity: "epic",
		translate: "拂衣去·拆",
		info: "你的回合开始时，你获得一张【过河拆桥】",
		card: {
			cardimage: "zf_fuyiqusha",
			value: 8.1,
		},
		skill: {
			inherit: "zf_anyGain",
			cardFilter: "guohe",
		},
	},
	//拂衣去决
	zf_fuyiqujue: {
		rarity: "epic",
		translate: "拂衣去·决",
		info: "你的回合开始时，你获得一张【决斗】",
		card: {
			cardimage: "zf_fuyiqusha",
			value: 8,
		},
		skill: {
			inherit: "zf_anyGain",
			cardFilter: "juedou",
		},
	},
	//拂衣去锁
	zf_fuyiqusuo: {
		rarity: "epic",
		translate: "拂衣去·锁",
		info: "你的回合开始时，你获得一张【铁索连环】",
		card: {
			cardimage: "zf_fuyiqusha",
			value: 7.8,
		},
		skill: {
			inherit: "zf_anyGain",
			cardFilter: "tiesuo",
		},
	},
	//拂衣去顺
	zf_fuyiqushun: {
		rarity: "legend",
		translate: "拂衣去·顺",
		info: "你的回合开始时，你获得一张【顺手牵羊】",
		card: {
			cardimage: "zf_fuyiqusha",
			value: 9.2,
		},
		skill: {
			inherit: "zf_anyGain",
			cardFilter: "shunshou",
		},
	},
	//隔山打牛
	zf_geshandaniu: {
		rarity: "common",
		translate: "隔山打牛",
		info: "你对其他人造成伤害时，无视其护甲",
		card: {
			value: 6.3,
		},
		skill: {
			forced: true,
			trigger: { source: "damageBegin" },
			filter(event, player) {
				return event.player != player;
			},
			async content(event, trigger, player) {
				trigger.set("nohujia", true);
			},
		},
	},
	//关刀之脊
	zf_guandaozhiji: {
		rarity: "common",
		translate: "关刀之脊",
		info: "方片【杀】无距离限制",
		card: {
			value: 4.5,
		},
		skill: {
			mod: {
				targetInRange(card) {
					if (get.suit(card) == "diamond" && card.name == "sha") {
						return true;
					}
				},
			},
		},
	},
	//关公刃
	zf_guangongren: {
		rarity: "rare",
		translate: "关公刃",
		info: "	红桃【杀】伤害+1",
		card: {
			value: 7.5,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				return event.card.name == "sha" && get.suit(event.card) == "heart";
			},
		},
	},
	//酣战
	zf_hanzhan: {
		rarity: "common",
		translate: "酣战",
		info: "你使用/受到的【决斗】对方需要两张杀",
		card: {
			value: 5.7,
		},
		skill: {
			trigger: {
				player: "useCardToPlayered",
				target: "useCardToTargeted",
			},
			forced: true,
			filter(event, player) {
				return event.card.name == "juedou";
			},
			async content(event, trigger, player) {
				const id = (player == trigger.player ? trigger.target : trigger.player)["playerid"];
				const idt = trigger.target.playerid;
				const map = trigger.getParent()?.customArgs;
				if (!map[idt]) {
					map[idt] = {};
				}
				if (!map[idt].shaReq) {
					map[idt].shaReq = {};
				}
				if (!map[idt].shaReq[id]) {
					map[idt].shaReq[id] = 1;
				}
				map[idt].shaReq[id]++;
			},
			ai: {
				directHit_ai: true,
				skillTagFilter(player, tag, arg) {
					if (arg.card.name != "juedou" || Math.floor(arg.target.countCards("h", "sha") / 2) > player.countCards("h", "sha")) {
						return false;
					}
				},
			},
		},
	},
	//好身法
	zf_haoshenfa: {
		rarity: "epic",
		translate: "好身法",
		info: "【闪】不计入手牌上限",
		card: {
			value: 6.8,
		},
		skill: {
			mod: {
				ignoredHandcard(card, player) {
					if (card.name == "shan") {
						return true;
					}
				},
				cardDiscardable(card, player, name) {
					if (name === "phaseDiscard" && card.name == "shan") {
						return false;
					}
				},
			},
		},
	},
	//横江锁
	zf_hengjiangsuo: {
		rarity: "epic",
		translate: "横江锁",
		info: "【铁索连环】能指定任意个目标",
		card: {
			value: 6.1,
		},
		skill: {
			mod: {
				selectTarget(card, player, range) {
					if (card.name == "tiesuo" && range[1] > 0) {
						range[1] = Infinity;
					}
				},
			},
		},
	},
	//衡锋Ⅰ
	zf_hengfeng: {
		rarity: "rare",
		translate: "衡锋Ⅰ",
		info: "回合内首次造成的伤害+1，回合外首次受到的伤害+1",
		card: {
			value: 7.2,
		},
		skill: {
			num: 1,
			forced: true,
			trigger: {
				player: "damageBegin3",
				source: "damageBegin1",
			},
			filter(event, player, name) {
				if (name == "damageBegin1") {
					return game.getRoundHistory("everything", evt => evt.name == "damage" && evt.source == player && evt.getParent("phase")?.player == player).indexOf(event) == 0;
				} else {
					return game.getRoundHistory("everything", evt => evt.name == "damage" && evt.player == player && evt.getParent("phase")?.player != player).indexOf(event) == 0;
				}
			},
			async content(event, trigger, player) {
				trigger.num += get.info(event.name).num;
			},
		},
	},
	//衡锋Ⅱ
	zf_hengfeng2: {
		rarity: "epic",
		translate: "衡锋Ⅱ",
		info: "回合内首次造成的伤害+2，回合外首次受到的伤害+2",
		card: {
			cardimage: "zf_hengfeng",
			value: 8.3,
		},
		skill: {
			inherit: "zf_hengfeng",
			num: 2,
		},
	},
	//后发先至
	zf_houfaxianzhi: {
		rarity: "rare",
		translate: "后发先至",
		info: "摸牌阶段，你的摸牌数-1；你的回合结束时，你摸3张牌",
		card: {
			value: 7.35,
		},
		skill: {
			forced: true,
			trigger: {
				player: ["phaseDrawBegin2", "phaseEnd"],
			},
			filter(event, player) {
				if (event.name == "phase") {
					return true;
				}
				return !event.numFixed;
			},
			async content(event, trigger, player) {
				if (trigger.name == "phase") {
					await player.draw(3);
				} else {
					trigger.num--;
				}
			},
		},
	},
	//厚实Ⅰ
	zf_houshi: {
		rarity: "epic",
		translate: "厚实Ⅰ",
		info: "每轮你受到的首次伤害-1",
		card: {
			value: 7.5,
		},
		skill: {
			forced: true,
			trigger: { player: "damageBegin3" },
			filter(event, player, name) {
				const index = game.getRoundHistory("everything", evt => evt.name == "damage" && evt.player == player).indexOf(event);
				return index == 0;
			},
			async content(event, trigger, player) {
				trigger.num--;
			},
		},
	},
	//厚实Ⅱ
	zf_houshi2: {
		rarity: "legend",
		translate: "厚实Ⅱ",
		info: "每轮你前两次受到的伤害-1",
		card: {
			cardimage: "zf_houshi",
			value: 9.5,
		},
		skill: {
			inherit: "zf_houshi",
			filter(event, player, name) {
				const index = game.getRoundHistory("everything", evt => evt.name == "damage" && evt.player == player).indexOf(event);
				return index >= 0 && index < 2;
			},
		},
	},
	//虎骨酒
	zf_hugujiu: {
		rarity: "common",
		translate: "虎骨酒",
		info: "每回合，你可以额外使用1次【酒】",
		card: {
			value: 6,
		},
		skill: {
			inherit: "zf_cardUsable",
			cardFilter: "jiu",
		},
	},
	//虎骨酒Ⅱ
	zf_hugujiu2: {
		rarity: "legend",
		translate: "虎骨酒Ⅱ",
		info: "每回合，你可以额外使用2次【酒】",
		card: {
			cardimage: "zf_hugujiu",
			value: 7.5,
		},
		skill: {
			inherit: "zf_hugujiu",
			modNum: 2,
		},
	},
	//护甲Ⅰ
	zf_hujia: {
		rarity: "epic",
		translate: "护甲Ⅰ",
		info: "每轮开始时，你获得1点护甲",
		card: {
			value: 6.9,
		},
		skill: {
			forced: true,
			trigger: { global: "roundStart" },
			num: 1,
			async content(event, trigger, player) {
				await player.changeHujia(get.info(event.name).num);
			},
		},
	},
	//护甲Ⅱ
	zf_hujia2: {
		rarity: "legend",
		translate: "护甲Ⅱ",
		info: "每轮开始时，你获得2点护甲",
		card: {
			cardimage: "zf_hujia",
			value: 8.9,
		},
		skill: {
			inherit: "zf_hujia",
			num: 2,
		},
	},
	//及时雨
	zf_jishiyu: {
		rarity: "common",
		translate: "及时雨",
		info: "回合外失去最后一张手牌后，摸两张牌",
		card: {
			value: 4.9,
		},
		skill: {
			forced: true,
			trigger: {
				player: "loseAfter",
				global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
			},
			filter(event, player) {
				if (player.countCards("h")) {
					return false;
				}
				const evt = event.getl(player);
				return evt && evt.player == player && evt.hs && evt.hs.length > 0 && _status.currentPhase != player;
			},
			async content(event, trigger, player) {
				await player.draw(2);
			},
		},
	},
	//技艺Ⅰ
	zf_jiyi: {
		rarity: "rare",
		translate: "技艺Ⅰ",
		info: "当你的技能直接造成伤害时，此伤害+1",
		card: {
			value: 5.6,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				return !event.card && !!game.findSkill(event);
			},
		},
	},
	//技艺Ⅱ
	zf_jiyi2: {
		rarity: "legend",
		translate: "技艺Ⅱ",
		info: "当你的技能直接造成伤害时，此伤害+2",
		card: {
			cardimage: "zf_jiyi",
			value: 6.6,
		},
		skill: {
			inherit: "zf_jiyi",
			num: 2,
		},
	},
	//结盟
	zf_jiemeng: {
		rarity: "rare",
		translate: "结盟",
		info: "你使用的【桃园结义】友方角色回复双倍体力",
		card: {
			value: 4,
		},
		skill: {
			forced: true,
			trigger: { global: "recoverBegin" },
			filter(event, player) {
				return event.player.isFriendsOf(player, false) && event.getParent()?.name == "taoyuan";
			},
			async content(event, trigger, player) {
				trigger.num *= 2;
			},
		},
	},
	//锦囊计
	zf_jinnangji: {
		rarity: "rare",
		translate: "锦囊计",
		info: "手牌上限+X（X为本回合摸牌阶段摸牌数的一半）",
		card: {
			value: 5.9,
		},
		skill: {
			silent: true,
			trigger: { player: "phaseDrawAfter" },
			async content(event, trigger, player) {
				const num = player.getHistory("gain", evt => evt.getParent()?.name == "draw" && evt.getParent("phaseDraw") == trigger).reduce((sum, evt) => sum + evt.cards.length, 0);
				if (num) {
					player.addMark(event.name, Math.ceil(num / 2), false);
					player.when({ global: "phaseAfter" }).step(async (event, trigger, player) => {
						player.clearMark("zf_jinnangji", false);
					});
				}
			},
			mod: {
				maxHandcard(player, num) {
					return num + player.countMark("zf_jinnangji");
				},
			},
		},
	},
	//荆棘甲
	zf_jingjijia: {
		rarity: "legend",
		translate: "荆棘甲",
		info: "每次受到伤害后对伤害来源造成1点伤害",
		card: {
			value: 9.1,
		},
		skill: {
			inherit: "zf_directDamage",
			select: "source",
			filter(event, player) {
				return event.source?.isIn() && event.num > 0;
			},
		},
	},
	//精于谋略
	zf_jingyumoulve: {
		rarity: "rare",
		translate: "精于谋略",
		info: "你手牌数量少于4，你的【杀】伤害+1",
		card: {
			value: 5.8,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				return event.card.name == "sha" && player.countCards("h") < 4;
			},
		},
	},
	//精于谋略Ⅱ
	zf_jingyumoulve2: {
		rarity: "epic",
		translate: "精于谋略Ⅱ",
		info: "你手牌数量少于6，你的【杀】伤害+1",
		card: {
			cardimage: "zf_jingyumoulve",
			value: 6.8,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				return event.card.name == "sha" && player.countCards("h") < 6;
			},
		},
	},
	//绝对无懈
	zf_jueduiwuxie: {
		rarity: "common",
		translate: "绝对无懈",
		info: "其他角色无法响应你的【无懈可击】",
		card: {
			value: 5.2,
		},
		skill: {
			forced: true,
			trigger: { player: "useCard" },
			filter(event, player) {
				return event.card.name == "wuxie";
			},
			async content(event, trigger, player) {
				trigger.directHit.addArray(game.filterPlayer(target => target != player));
			},
		},
	},
	//狂暴
	zf_kuangbao: {
		rarity: "common",
		translate: "狂暴",
		info: "当你的体力值不大于2时，你造成的伤害+1",
		card: {
			value: 6.5,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				return player.getHp() <= 2;
			},
		},
	},
	//狂暴Ⅲ
	zf_kuangbao3: {
		rarity: "common",
		translate: "狂暴Ⅲ",
		info: "当你的体力值不大于3时，你摸牌数+1",
		card: {
			cardimage: "zf_kuangbao",
			value: 6.6,
		},
		skill: {
			inherit: "zf_phaseDraw",
			filter(event, player) {
				return !event.numFixed && player.getHp() <= 3;
			},
		},
	},
	//狂暴Ⅳ
	zf_kuangbao4: {
		rarity: "rare",
		translate: "狂暴Ⅳ",
		info: "当你的体力值不大于5时，你摸牌数+1",
		card: {
			cardimage: "zf_kuangbao",
			value: 7.3,
		},
		skill: {
			inherit: "zf_phaseDraw",
			filter(event, player) {
				return !event.numFixed && player.getHp() <= 5;
			},
		},
	},
	//狂暴Ⅱ
	zf_kuangbao2: {
		rarity: "epic",
		translate: "狂暴Ⅱ",
		info: "当你的体力值不大于3时，你造成的伤害+1",
		card: {
			cardimage: "zf_kuangbao",
			value: 7.2,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				return player.getHp() <= 3;
			},
		},
	},
	//牢固装备
	zf_laoguzhuangbei: {
		rarity: "common",
		translate: "牢固装备",
		info: "你的装备不能被弃置",
		card: {
			value: 5.5,
		},
		skill: {
			mod: {
				canBeDiscarded(card) {
					if (get.position(card) == "e" && get.type(card) == "equip") {
						return false;
					}
				},
				cardDiscardable(card) {
					if (get.position(card) == "e" && get.type(card) == "equip") {
						return false;
					}
				},
			},
		},
	},
	//雷火势Ⅰ（雷火剑！）
	zf_leihuoshi: {
		rarity: "rare",
		translate: "雷火势Ⅰ",
		info: "每回合限一次，你使用的第一张属性【杀】伤害+1",
		card: {
			value: 5.9,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				return player.getHistory("useCard", evt => evt.card.name == "sha" && !!evt.card.nature).indexOf(event) == 0;
			},
			usable: 1,
		},
	},
	//雷火势Ⅱ（雷火剑！）
	zf_leihuoshi2: {
		rarity: "legend",
		translate: "雷火势Ⅱ",
		info: "每回合限一次，你使用的第一张属性【杀】伤害+2",
		card: {
			cardimage: "zf_leihuoshi",
			value: 7,
		},
		skill: {
			inherit: "zf_leihuoshi",
			num: 2,
		},
	},
	//雷鸣
	zf_leiming: {
		rarity: "common",
		translate: "雷鸣",
		info: "所有角色在判定阶段都要进行一次【闪电】判定",
		card: {
			value: 5.6,
		},
		skill: {
			global: "zf_leiming_global",
			subSkill: {
				global: {
					silent: true,
					trigger: { player: "phaseJudgeBegin" },
					async content(event, trigger, player) {
						await player.executeDelayCardEffect("shandian");
					},
				},
			},
		},
	},
	//烈变
	zf_liebian: {
		rarity: "rare",
		translate: "烈变",
		info: "从第6轮开始，你的锦囊和技能造成的伤害+1",
		card: {
			value: 5.8,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				if (game.roundNumber < 6) {
					return false;
				}
				return event.card ? get.type2(event.card) === "trick" : !!game.findSkill(event);
			},
		},
	},
	//烈变Ⅱ
	zf_liebian2: {
		rarity: "epic",
		translate: "烈变Ⅱ",
		info: "从第4轮开始，你的锦囊和技能造成的伤害+1",
		card: {
			cardimage: "zf_liebian",
			value: 6.8,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				if (game.roundNumber < 4) {
					return false;
				}
				return event.card ? get.type2(event.card) === "trick" : !!game.findSkill(event);
			},
		},
	},
	//烈变Ⅲ
	zf_liebian3: {
		rarity: "legend",
		translate: "烈变Ⅲ",
		info: "从第2轮开始，你的锦囊和技能造成的伤害+1",
		card: {
			cardimage: "zf_liebian",
			value: 7.8,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				if (game.roundNumber < 2) {
					return false;
				}
				return event.card ? get.type2(event.card) === "trick" : !!game.findSkill(event);
			},
		},
	},
	//妙技Ⅰ
	zf_miaoji: {
		rarity: "epic",
		translate: "妙技Ⅰ",
		info: "每回合首张锦囊造成的伤害+1",
		card: {
			value: 6.3,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				return player.getHistory("useCard", evt => get.type2(evt.card) == "trick").indexOf(event) == 0 && get.tag(event.card, "damage");
			},
		},
	},
	//妙技Ⅱ
	zf_miaoji2: {
		rarity: "legend",
		translate: "妙技Ⅱ",
		info: "每回合前两张锦囊造成的伤害+1",
		card: {
			value: 7.6,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				const index = player.getHistory("useCard", evt => get.type2(evt.card) == "trick").indexOf(event);
				return index >= 0 && index < 2 && get.tag(event.card, "damage");
			},
		},
	},
	//妙手空空
	zf_miaoshoukongkong: {
		rarity: "rare",
		translate: "妙手空空",
		info: "你使用的【顺手牵羊】无距离限制",
		card: {
			value: 5,
		},
		skill: {
			mod: {
				targetInRange(card, player) {
					if (card.name == "shunshou") {
						return true;
					}
				},
			},
		},
	},
	//摸牌Ⅰ
	zf_mopai: {
		rarity: "rare",
		translate: "摸牌Ⅰ",
		info: "摸牌阶段，你的摸牌数+1",
		card: {
			value: 6.2,
		},
		skill: {
			inherit: "zf_phaseDraw",
		},
	},
	//摸牌Ⅱ
	zf_mopai2: {
		rarity: "legend",
		translate: "摸牌Ⅱ",
		info: "摸牌阶段，你的摸牌数+2",
		card: {
			cardimage: "zf_mopai",
			value: 8.2,
		},
		skill: {
			inherit: "zf_phaseDraw",
			num: 2,
		},
	},
	//木牛流马
	zf_muniuliuma: {
		rarity: "epic",
		translate: "木牛流马",
		info: "你的摸牌阶段，你额外摸两张牌,手牌上限-1",
		card: {
			value: 7.2,
		},
		skill: {
			inherit: "zf_phaseDraw",
			num: 2,
			mod: {
				maxHandcard(player, num) {
					return num - 1;
				},
			},
		},
	},
	//皮囊
	zf_pinang: {
		rarity: "common",
		translate: "皮囊",
		info: "手牌上限+1",
		card: {
			value: 5.7,
		},
		skill: {
			inherit: "zf_maxHandcard",
		},
	},
	//皮囊Ⅱ
	zf_pinang2: {
		rarity: "rare",
		translate: "皮囊Ⅱ",
		info: "手牌上限+2",
		card: {
			cardimage: "zf_pinang",
			value: 6.5,
		},
		skill: {
			inherit: "zf_maxHandcard",
			modNum: 2,
		},
	},
	//皮囊Ⅲ
	zf_pinang3: {
		rarity: "epic",
		translate: "皮囊Ⅲ",
		info: "手牌上限+5",
		card: {
			cardimage: "zf_pinang",
			value: 7.7,
		},
		skill: {
			inherit: "zf_maxHandcard",
			modNum: 5,
		},
	},
	//偏转甲
	zf_pianzhuanjia: {
		rarity: "legend",
		translate: "偏转甲",
		info: "每次受到伤害后对随机敌方造成1点伤害",
		card: {
			value: 8,
		},
		skill: {
			inherit: "zf_directDamage",
		},
	},
	//破釜沉舟
	zf_pofuchenzhou: {
		rarity: "common",
		translate: "破釜沉舟",
		info: "回合外受到伤害一次大于等于3点时，对伤害来源造成等量同属性伤害",
		card: {
			value: 4.5,
		},
		skill: {
			inherit: "zf_directDamage",
			filter(event, player) {
				return _status.currentPhase != player && event.num >= 3 && event.source?.isIn();
			},
			num: "event",
			nature: "event",
			select: "source",
		},
	},
	//强取豪夺
	zf_qiangquhaoduo: {
		rarity: "common",
		translate: "强取豪夺",
		info: "【顺手牵羊】时目标手牌可见",
		card: {
			value: 5.4,
		},
		skill: {
			forced: true,
			trigger: { player: "gainPlayerCardBegin" },
			filter(event, player) {
				return event.getParent()?.name == "shunshou";
			},
			async content(event, trigger, player) {
				trigger.set("visible", true);
			},
		},
	},
	//巧取豪夺
	zf_qiaoquhaoduo: {
		rarity: "rare",
		translate: "巧取豪夺",
		info: "你的【借刀杀人】成功时，伤害+1",
		card: {
			value: 4.3,
		},
		skill: {
			inherit: "zf_cardDamage",
			trigger: { global: "useCard" },
			filter(event, player) {
				return event.card.name == "sha" && event.respondTo?.[0] == player && event.respondTo?.[1].name == "jiedao";
			},
		},
	},
	//弱反馈
	zf_ruofankui: {
		rarity: "epic",
		translate: "弱反馈",
		info: "受到1点伤害后，摸一张牌",
		card: {
			value: 6.3,
		},
		skill: {
			inherit: "zf_anyDraw",
			trigger: { player: "damageEnd" },
			getIndex(event, player) {
				return event.num;
			},
		},
	},
	//弱袭
	zf_ruoxi: {
		rarity: "legend",
		translate: "弱袭",
		info: "你的手牌小于当前体力时，你造成的伤害+1",
		card: {
			value: 7.8,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				return player.countCards("h") < player.getHp();
			},
		},
	},
	//三板斧
	zf_sanbanfu: {
		rarity: "rare",
		translate: "三板斧",
		info: "你的每第三张【杀】伤害+1",
		card: {
			value: 6.7,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				if (event.card.name != "sha") {
					return false;
				}
				const index = player.getAllHistory("useCard", evt => evt.card.name == "sha").indexOf(event) + 1;
				return index > 0 && index % 3 == 0;
			},
		},
	},
	//三板斧Ⅱ
	zf_sanbanfu2: {
		rarity: "legend",
		translate: "三板斧Ⅱ",
		info: "你的每第三张【杀】伤害+2",
		card: {
			cardimage: "zf_sanbanfu",
			value: 8.7,
		},
		skill: {
			inherit: "zf_sanbanfu",
			num: 2,
		},
	},
	//神龙摆尾
	zf_shenlongbaiwei: {
		rarity: "rare",
		translate: "神龙摆尾",
		info: "你每摸九张卡牌，你对随机敌方造成1点伤害",
		card: {
			value: 6.1,
		},
		skill: {
			inherit: "zf_directDamage",
			trigger: { player: "gainAfter" },
			getIndex(event, player) {
				if (event.getParent()?.name != "draw") {
					return 0;
				}
				const prev = player.getAllHistory("gain", evt => evt.getParent()?.name == "draw", event).reduce((sum, evt) => sum + evt.cards.length, 0);
				const cur = prev + event.cards.length;
				return Math.floor(cur / 9) - Math.floor(prev / 9);
			},
		},
	},
	//神龙摆尾Ⅱ
	zf_shenlongbaiwei2: {
		rarity: "legend",
		translate: "神龙摆尾Ⅱ",
		info: "你每摸六张卡牌，你对随机敌方造成1点伤害",
		card: {
			cardimage: "zf_shenlongbaiwei",
			value: 8.1,
		},
		skill: {
			inherit: "zf_shenlongbaiwei",
			getIndex(event, player) {
				if (event.getParent()?.name != "draw") {
					return 0;
				}
				const prev = player.getAllHistory("gain", evt => evt.getParent()?.name == "draw", event).reduce((sum, evt) => sum + evt.cards.length, 0);
				const cur = prev + event.cards.length;
				return Math.floor(cur / 6) - Math.floor(prev / 6);
			},
		},
	},
	//士气剥夺
	zf_shiqiboduo: {
		rarity: "epic",
		translate: "士气剥夺",
		info: "所有敌方的体力上限-1，最低为1",
		card: {
			value: 7.3,
		},
		skill: {
			init(player, skill) {
				const enemies = player.getEnemies(() => true, false);
				player.storage[skill] = game.filterPlayer(target => enemies.includes(target) && target.maxHp > 1);
				const next = game.createEvent(skill + "_init", false, get.event());
				next.set("player", player);
				next.set("targets", player.storage[skill]);
				next.setContent(async (event, trigger, player) => {
					const { targets } = event;
					await game.doAsyncInOrder(targets, (target, i) => target.loseMaxHp(), lib.sort.seat);
				});
			},
			onremove(player, skill) {
				const next = game.createEvent(skill + "_onremove", false, get.event());
				next.set("player", player);
				next.set("targets", player.storage[skill].slice());
				next.setContent(async (event, trigger, player) => {
					const { targets } = event;
					await game.doAsyncInOrder(targets, (target, i) => target.gainMaxHp(), lib.sort.seat);
				});
				delete player.storage[skill];
			},
		},
	},
	//噬血I
	zf_shixue: {
		rarity: "legend",
		translate: "噬血I",
		info: "回复1点体力后，摸一张牌",
		card: {
			value: 7.2,
		},
		skill: {
			inherit: "zf_anyDraw",
			trigger: { player: "recoverEnd" },
			getIndex(event, player) {
				return event.num;
			},
		},
	},
	//手到擒来
	zf_shoudaoqinlai: {
		rarity: "common",
		translate: "手到擒来",
		info: "每回合你使用第七张牌后,你摸一张牌",
		card: {
			value: 5.6,
		},
		skill: {
			inherit: "zf_anyDraw",
			trigger: { player: "useCardAfter" },
			filter(event, player) {
				return player.getHistory("useCard").indexOf(event) == 6;
			},
		},
	},
	//手到擒来Ⅱ
	zf_shoudaoqinlai2: {
		rarity: "common",
		translate: "手到擒来Ⅱ",
		info: "每回合你使用第五张牌后,你摸一张牌",
		card: {
			cardimage: "zf_shoudaoqinlai",
			value: 6.5,
		},
		skill: {
			inherit: "zf_shoudaoqinlai",
			filter(event, player) {
				return player.getHistory("useCard").indexOf(event) == 4;
			},
		},
	},
	//手到擒来Ⅲ
	zf_shoudaoqinlai3: {
		rarity: "common",
		translate: "手到擒来Ⅲ",
		info: "每回合你使用第六张牌后,你摸两张牌",
		card: {
			cardimage: "zf_shoudaoqinlai",
			value: 7.1,
		},
		skill: {
			inherit: "zf_shoudaoqinlai",
			filter(event, player) {
				return player.getHistory("useCard").indexOf(event) == 5;
			},
			num: 2,
		},
	},
	//双掠
	zf_shuanglve: {
		rarity: "rare",
		translate: "双掠",
		info: "你使用的【顺手牵羊】可额外结算一次",
		card: {
			value: 6,
		},
		skill: {
			trigger: { player: "useCard" },
			filter(event, player) {
				return event.card.name == "shunshou";
			},
			async content(event, trigger, player) {
				trigger.effectCount++;
			},
		},
	},
	//双刃
	zf_shuangren: {
		rarity: "rare",
		translate: "双刃",
		info: "每轮，你的首张【杀】至多能额外选择1个目标",
		card: {
			value: 6.7,
		},
		skill: {
			trigger: { player: "useCard2" },
			select: 1,
			filter(event, player) {
				if (event.card.name != "sha") {
					return false;
				}
				return player.getRoundHistory("useCard", evt => evt.card.name == "sha").indexOf(event) == 0 && game.hasPlayer(target => !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target));
			},
			async cost(event, trigger, player) {
				const select = get.info(event.skill).select;
				event.result = await player
					.chooseTarget(get.prompt2(event.skill), select, (card, player, target) => {
						const cardx = get.event().getTrigger().card;
						return !get.event().getTrigger().targets.includes(target) && lib.filter.targetEnabled2(cardx, player, target) && lib.filter.targetInRange(cardx, player, target);
					})
					.set("ai", target => get.effect(target, get.event().getTrigger().card, get.player(), get.player()))
					.forResult();
			},
			async content(event, trigger, player) {
				const { targets } = event;
				game.log(targets, "也成为", trigger.card, "的目标");
				trigger.targets.addArray(targets);
			},
		},
	},
	//双刃Ⅱ
	zf_shuangren2: {
		rarity: "epic",
		translate: "双刃Ⅱ",
		info: "每轮，你的首张【杀】至多能额外选择2个目标",
		card: {
			cardimage: "zf_shuangren",
			value: 7.7,
		},
		skill: {
			inherit: "zf_shuangren",
			select: [1, 2],
		},
	},
	//剔甲术
	zf_tijiashu: {
		rarity: "epic",
		translate: "剔甲术",
		info: "对护甲造成双倍伤害",
		card: {
			value: 6.9,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				return event.player.hujia > 0;
			},
			num: (event, trigger, player) => Math.min(Math.floor(trigger.player.hujia / 2), trigger.num),
		},
	},
	//体魄
	zf_tipo: {
		rarity: "epic",
		translate: "体魄",
		info: "增加1点体力上限并回复等量体力",
		card: {
			value: 6,
		},
		skill: {
			num: 1,
			init(player, skill) {
				const num = get.info(skill).num;
				const next = game.createEvent(skill + "_init", false, get.event());
				next.set("player", player);
				next.set("num", num);
				next.setContent(async (event, trigger, player) => {
					const { num } = event;
					await player.gainMaxHp(num);
					await player.recover(num);
				});
			},
		},
	},
	//体魄Ⅱ
	zf_tipo2: {
		rarity: "legend",
		translate: "体魄Ⅱ",
		info: "增加2点体力上限并回复等量体力",
		card: {
			cardimage: "zf_tipo",
			value: 7.5,
		},
		skill: {
			inherit: "zf_tipo",
			num: 2,
		},
	},
	//体魄Ⅲ
	zf_tipo3: {
		rarity: "legend",
		translate: "体魄Ⅲ",
		info: "增加3点体力上限并回复等量体力",
		card: {
			cardimage: "zf_tipo",
			value: 9,
		},
		skill: {
			inherit: "zf_tipo",
			num: 3,
		},
	},
	//天降锦囊
	zf_tianjiangjinnang: {
		rarity: "rare",
		translate: "天降锦囊",
		info: "获得三张锦囊牌",
		card: {
			value: 7.2,
		},
		skill: {
			inherit: "zf_directGain",
			cardFilter: { type2: "trick" },
			num: 3,
		},
	},
	//天降横财
	zf_tianjianghengcai: {
		rarity: "rare",
		translate: "天降横财",
		info: "获得四张基本牌",
		card: {
			value: 7.2,
		},
		skill: {
			inherit: "zf_directGain",
			cardFilter: { type2: "basic" },
			num: 4,
		},
	},
	//天降装备
	zf_tianjiangzhuangbei: {
		rarity: "rare",
		translate: "天降装备",
		info: "获得四张装备牌",
		card: {
			value: 7.2,
		},
		skill: {
			inherit: "zf_directGain",
			cardFilter: { type2: "equip" },
			num: 4,
		},
	},
	//天降卡牌
	zf_tianjiangkapai: {
		rarity: "rare",
		translate: "天降卡牌",
		info: "获得三张牌",
		card: {
			value: 7.5,
		},
		skill: {
			inherit: "zf_directGain",
			num: 3,
		},
	},
	//铁布衫
	zf_tiebushan: {
		rarity: "common",
		translate: "铁布衫",
		info: "获得1点护甲",
		card: {
			value: 6,
		},
		skill: {
			num: 1,
			init(player, skill) {
				const num = get.info(skill).num;
				player.changeHujia(num);
			},
		},
	},
	//铁布衫Ⅱ
	zf_tiebushan2: {
		rarity: "rare",
		translate: "铁布衫Ⅱ",
		info: "获得2点护甲",
		card: {
			cardimage: "zf_tiebushan",
			value: 7,
		},
		skill: {
			num: 2,
			inherit: "zf_tiebushan",
		},
	},
	//铁布衫Ⅲ
	zf_tiebushan3: {
		rarity: "legend",
		translate: "铁布衫Ⅲ",
		info: "获得4点护甲",
		card: {
			cardimage: "zf_tiebushan",
			value: 9,
		},
		skill: {
			num: 4,
			inherit: "zf_tiebushan",
		},
	},
	//偷袭
	zf_touxi: {
		rarity: "rare",
		translate: "偷袭",
		info: "黑桃【杀】无次数限制",
		card: {
			value: 7,
		},
		skill: {
			inherit: "zf_cardUsable",
			modNum: Infinity,
			cardFilter: { name: "sha", suit: "spade" },
		},
	},
	//稳定体质
	zf_wendingtizhi: {
		rarity: "common",
		translate: "稳定体质",
		info: "你的体力上限固定为7，无法通过任何途径改变体力值上限",
		card: {
			value: 7.3,
		},
		skill: {
			forced: true,
			init(player, skill) {
				const next = game.createEvent(skill + "_init", false, get.event());
				next.set("player", player);
				next.setContent(async (event, trigger, player) => {
					const num = 7 - player.maxHp;
					await player[num > 0 ? "gainMaxHp" : "loseMaxHp"](Math.abs(num));
					await player.recover(Math.abs(num));
				});
			},
			trigger: { player: ["gainMaxHpBefore", "loseMaxHpBefore"] },
			filter(event, player) {
				return event.parent?.name !== "zf_wendingtizhi_init";
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
		},
	},
	//稳定后勤
	zf_wendinghouqin: {
		rarity: "legend",
		translate: "稳定后勤",
		info: "摸牌阶段摸牌数固定为5",
		card: {
			value: 7.3,
		},
		skill: {
			inherit: "zf_phaseDraw",
			async content(event, trigger, player) {
				trigger.num = 5;
				trigger.set("numFixed", true);
			},
		},
	},
	//稳定进攻
	zf_wendingjingong: {
		rarity: "legend",
		translate: "稳定进攻",
		info: "回合内出杀次数固定为5",
		card: {
			value: 7.5,
		},
		skill: {
			inherit: "zf_cardUsable",
			cardFilter: "sha",
			modNum: () => 5,
		},
	},
	//稳定承载
	zf_wendingchengzai: {
		rarity: "legend",
		translate: "稳定承载",
		info: "手牌上限固定为8",
		card: {
			value: 7.9,
		},
		skill: {
			mod: {
				maxHandcardFinal(player, num) {
					return 8;
				},
			},
		},
	},
	//稳定士气
	zf_wendingshiqi: {
		rarity: "legend",
		translate: "稳定士气",
		info: "您的所有伤害值固定为2",
		card: {
			value: 8,
		},
		skill: {
			forced: true,
			trigger: { source: "damageBegin4" },
			lastDo: true,
			async content(event, trigger, player) {
				trigger.num = 2;
			},
		},
	},
	//卧薪尝胆
	zf_woxinchangdan: {
		rarity: "epic",
		translate: "卧薪尝胆",
		info: "回合外每受到1次伤害，下回合出杀次数+1",
		card: {
			value: 7.4,
		},
		skill: {
			forced: true,
			trigger: { player: "damageEnd" },
			filter(event, player) {
				return _status.currentPhase !== player;
			},
			async content(event, trigger, player) {
				player.addMark(event.name + "_effect", 1, false);
				player.addTempSkill(event.name + "_effect", { player: "phaseAfter" });
			},
			subSkill: {
				effect: {
					charlotte: true,
					onremove: true,
					mod: {
						cardUsable(card, player, num) {
							if (card.name == "sha" && player === _status.currentPhase) {
								return num + player.countMark("zf_woxinchangdan_effect");
							}
						},
					},
				},
			},
		},
	},
	//狭路相逢
	zf_xialuxiangfeng: {
		rarity: "common",
		translate: "狭路相逢",
		info: "受到【决斗】伤害后回复1点体力",
		card: {
			value: 5,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				return event.card && event.card.name == "juedou";
			},
			async content(event, trigger, player) {
				await player.recover();
			},
		},
	},
	//信手拈来
	zf_xinshounianlai: {
		rarity: "rare",
		translate: "信手拈来",
		info: "你的手牌上限不因体力值改变而改变",
		card: {
			value: 6.5,
		},
		skill: {
			mod: {
				maxHandcardBase(player, num) {
					return player.maxHp;
				},
			},
		},
	},
	//虚焰
	zf_xuyan: {
		rarity: "common",
		translate: "虚焰",
		info: "【火攻】弃置改为展示",
		card: {
			value: 5.8,
		},
		skill: {
			trigger: { player: "huogongBegin" },
			forced: true,
			async content(event, trigger, player) {
				trigger.set("chooseToDiscard", async (event, player, target) => {
					const { discardPostion = "h", cards2, filterDiscard = { suit: get.suit(cards2[0]) } } = event;
					const result = await player
						.chooseCard(`请选择火攻要展示的牌`, discardPostion, filterDiscard)
						.set("ai", () => Math.random())
						.forResult();
					if (result?.bool && result.cards?.length) {
						await player.showCards(result.cards, `${get.translation(player)}因<span class = bluetext>虚焰</span>修改过的【火攻】展示的牌`);
					}
					return result;
				})
			}
			/*trigger: { player: "chooseToDiscardBegin" },
			forced: true,
			filter(event, player) {
				return event.getParent()?.name == "huogong";
			},
			async content(event, trigger, player) {
				trigger.chooseonly = true;
				player
					.when("chooseToDiscardAfter")
					.filter(evt => evt == trigger)
					.step(async (event, trigger, player) => {
						if (trigger.result?.cards?.length) {
							const { cards } = trigger.result;
							await player.showCards(cards, `${get.translation(player)}【火攻】展示的牌`);
						}
					});
			},*/
		},
	},
	//蓄力箭
	zf_xulijian: {
		rarity: "common",
		translate: "蓄力箭",
		info: "你使用的【万箭齐发】其他角色需要使用2张【闪】来响应",
		card: {
			value: 4.2,
		},
		skill: {
			forced: true,
			trigger: { player: "useCard" },
			filter(event, player) {
				return event.card.name == "wanjian";
			},
			async content(event, trigger, player) {
				game.filterPlayer(target => target != player).forEach(target => {
					const id = target.playerid;
					const map = trigger.customArgs;
					map[id] ??= {};
					if (typeof map[id].shanRequired == "number") {
						map[id].shanRequired++;
					} else {
						map[id].shanRequired = 2;
					}
				});
			},
			ai: {
				directHit_ai: true,
				skillTagFilter(player, tag, arg) {
					if (arg.card.name != "wanjian" || arg.target.countCards("h", "shan") > 1) {
						return false;
					}
				},
			},
		},
	},
	//蓄势
	zf_xushi: {
		rarity: "rare",
		translate: "蓄势",
		info: "本回合没出杀，则下回合杀伤害+1（最多+1）",
		card: {
			value: 6,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				if (event.card.name != "sha" || _status.currentPhase != player || player.actionHistory.length < 2) {
					return false;
				}
				let history = false;
				for (let i = player.actionHistory.length - 2; i >= 0; i--) {
					if (player.actionHistory[i]?.isMe) {
						history = player.actionHistory[i];
						break;
					}
				}
				return history && !history["useCard"]?.some(evt => evt.card.name == "sha");
			},
		},
	},
	//血战Ⅰ
	zf_xuezhan: {
		rarity: "common",
		translate: "血战Ⅰ",
		info: "体力上限-1（最低为1），每轮开始时回复1点体力",
		card: {
			value: 6.3,
		},
		skill: {
			num: 1,
			init(player, skill) {
				if (player.maxHp < 2) {
					return;
				}
				let num = get.info(skill).num;
				num = Math.min(num, player.maxHp - 1);
				player.storage[skill] = num;
				const next = game.createEvent(skill + "_init", false, get.event());
				next.set("player", player);
				next.set("num", num);
				next.setContent(async (event, trigger, player) => {
					const { num } = event;
					await player.loseMaxHp(num);
				});
			},
			onremove(player, skill) {
				if (!player.storage[skill]) {
					return;
				}
				const next = game.createEvent(skill + "_onremove", false, get.event());
				next.set("player", player);
				next.set("num", player.storage[skill]);
				next.setContent(async (event, trigger, player) => {
					const { num } = event;
					await player.gainMaxHp(num);
				});
				delete player.storage[skill];
			},
			forced: true,
			trigger: { global: "roundStart" },
			async content(event, trigger, player) {
				await player.recover(get.info(event.name).num);
			},
		},
	},
	//血战Ⅱ
	zf_xuezhan2: {
		rarity: "rare",
		translate: "血战Ⅱ",
		info: "体力上限-2（最低为1），每轮开始时回复2点体力",
		card: {
			cardimage: "zf_xuezhan",
			value: 5.6,
		},
		skill: {
			inherit: "zf_xuezhan",
			num: 2,
		},
	},
	//血战Ⅲ
	zf_xuezhan3: {
		rarity: "legend",
		translate: "血战Ⅲ",
		info: "体力上限-3（最低为1），每轮开始时回复3点体力",
		card: {
			cardimage: "zf_xuezhan",
			value: 4.3,
		},
		skill: {
			inherit: "zf_xuezhan",
			num: 3,
		},
	},
	//眼线
	zf_yanxian: {
		rarity: "common",
		translate: "眼线",
		info: "【过河拆桥】时目标手牌可见",
		card: {
			value: 6.2,
		},
		skill: {
			trigger: { player: "discardPlayerCardBegin" },
			filter(event, player) {
				return event.getParent()?.name == "guohe";
			},
			forced: true,
			async content(event, trigger, player) {
				trigger.set("visible", true);
			},
		},
	},
	//药理
	zf_yaoli: {
		rarity: "epic",
		translate: "药理",
		info: "每回合首次回复体力时，额外回复1点",
		card: {
			value: 6.5,
		},
		skill: {
			forced: true,
			trigger: { player: "recoverBegin" },
			filter(event, player) {
				return game.getGlobalHistory("everything", evt => evt.name == "recover" && evt.player == player).indexOf(event) == 0;
			},
			num: 1,
			async content(event, trigger, player) {
				trigger.num += get.info(event.name).num;
			},
		},
	},
	//药理
	zf_yaoli3: {
		rarity: "epic",
		translate: "药理",
		info: "回复体力时，额外回复1点",
		card: {
			cardimage: "zf_yaoli",
			value: 7.5,
		},
		skill: {
			inherit: "zf_yaoli",
			filter(event, player) {
				return true;
			},
		},
	},
	//药理
	zf_yaoli4: {
		rarity: "legend",
		translate: "药理",
		info: "每回合前3次回复体力时，额外回复1点",
		card: {
			cardimage: "zf_yaoli",
			value: 7.2,
		},
		skill: {
			inherit: "zf_yaoli",
			filter(event, player) {
				const index = game.getGlobalHistory("everything", evt => evt.name == "recover" && evt.player == player).indexOf(event);
				return index >= 0 && index < 3;
			},
		},
	},
	//药理Ⅱ
	zf_yaoli2: {
		rarity: "legend",
		translate: "药理Ⅱ",
		info: "回复体力时，额外回复2点",
		card: {
			cardimage: "zf_yaoli",
			value: 8.5,
		},
		skill: {
			inherit: "zf_yaoli",
			filter(event, player) {
				return true;
			},
			num: 2,
		},
	},
	//阴阳术法
	zf_yinyangshufa: {
		rarity: "legend",
		translate: "阴阳术法",
		info: "敌方无法响应你的伤害型锦囊牌",
		card: {
			value: 9.5,
		},
		skill: {
			forced: true,
			trigger: { player: "useCard" },
			filter(event, player) {
				return get.type(event.card) == "trick" && get.tag(event.card, "damage");
			},
			async content(event, trigger, player) {
				trigger.directHit.addArray(player.getEnemies(() => true, false));
			},
		},
	},
	//应急方案
	zf_yingjifangan: {
		rarity: "epic",
		translate: "应急方案",
		info: "回合外成为敌方角色基本牌唯一目标，随机弃置来源一张牌",
		card: {
			value: 7.5,
		},
		skill: {
			forced: true,
			trigger: { target: "useCardToTarget" },
			filter(event, player) {
				if (_status.currentPhase == player || event.targets.length != 1) {
					return false;
				}
				return get.type2(event.card) == "basic" && event.player.isEnemiesOf(player, false);
			},
			logTarget: "player",
			async content(event, trigger, player) {
				const target = trigger.player;
				const cards = target.getDiscardableCards(player, "he", () => true);
				if (cards.length) {
					await target.randomDiscard(player, "random");
				}
			},
		},
	},
	//应急战术
	zf_yingjizhanshu: {
		rarity: "epic",
		translate: "应急战术",
		info: "回合外成为敌方角色锦囊牌唯一目标，随机弃置来源一张牌",
		card: {
			value: 7.5,
		},
		skill: {
			inherit: "zf_yingjifangan",
			filter(event, player) {
				if (_status.currentPhase == player || event.targets.length != 1) {
					return false;
				}
				return get.type2(event.card) == "trick" && event.player.isEnemiesOf(player, false);
			},
		},
	},
	//应急战略
	zf_yingjizhanlve: {
		rarity: "legend",
		translate: "应急战略",
		info: "回合外成为敌方角色使用牌唯一目标，随机弃置来源一张牌",
		card: {
			value: 9.5,
		},
		skill: {
			inherit: "zf_yingjifangan",
			filter(event, player) {
				if (_status.currentPhase == player || event.targets.length != 1) {
					return false;
				}
				return event.player.isEnemiesOf(player, false);
			},
		},
	},
	//勇战Ⅰ
	zf_yongzhan: {
		rarity: "epic",
		translate: "勇战Ⅰ",
		info: "	你离开濒死时，对所有敌方造成1点伤害",
		card: {
			value: 7,
		},
		skill: {
			inherit: "zf_directDamage",
			trigger: { player: "dyingAfter" },
			select: "all",
		},
	},
	//勇战Ⅱ
	zf_yongzhan2: {
		rarity: "legend",
		translate: "勇战Ⅱ",
		info: "	你离开濒死时，对所有敌方造成2点伤害",
		card: {
			cardimage: "zf_yongzhan",
			value: 9,
		},
		skill: {
			inherit: "zf_yongzhan",
			num: 2,
		},
	},
	//愈战愈勇Ⅲ
	zf_yuzhanyuyong3: {
		rarity: "common",
		translate: "愈战愈勇Ⅲ",
		info: "从第7轮开始，你的【杀】造成的伤害+1",
		card: {
			cardimage: "zf_yuzhanyuyong",
			value: 5.5,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				return event.card.name == "sha" && game.roundNumber >= 7;
			},
		},
	},
	//愈战愈勇Ⅱ
	zf_yuzhanyuyong2: {
		rarity: "rare",
		translate: "愈战愈勇Ⅱ",
		info: "从第5轮开始，你的【杀】造成的伤害+1",
		card: {
			cardimage: "zf_yuzhanyuyong",
			value: 6.5,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				return event.card.name == "sha" && game.roundNumber >= 5;
			},
		},
	},
	//愈战愈勇
	zf_yuzhanyuyong: {
		rarity: "epic",
		translate: "愈战愈勇",
		info: "从第3轮开始，你的【杀】造成的伤害+1",
		card: {
			value: 7.5,
		},
		skill: {
			inherit: "zf_cardDamage",
			filter(event, player) {
				return event.card.name == "sha" && game.roundNumber >= 3;
			},
		},
	},
	//援助
	zf_yuanzhu: {
		rarity: "rare",
		translate: "援助",
		info: "回合结束时，你摸一张牌",
		card: {
			value: 6,
		},
		skill: {
			inherit: "zf_anyDraw",
			trigger: { player: "phaseEnd" },
		},
	},
	//援助Ⅱ
	zf_yuanzhu2: {
		rarity: "legend",
		translate: "援助Ⅱ",
		info: "回合结束时，你摸两张牌",
		card: {
			cardimage: "zf_yuanzhu",
			value: 7,
		},
		skill: {
			inherit: "zf_yuanzhu",
			num: 2,
		},
	},
	//援助Ⅲ
	zf_yuanzhu3: {
		rarity: "legend",
		translate: "援助Ⅲ",
		info: "回合结束时，你摸三张牌",
		card: {
			cardimage: "zf_yuanzhu",
			value: 8,
		},
		skill: {
			inherit: "zf_yuanzhu",
			num: 3,
		},
	},
	//远击技
	zf_yuanjiji: {
		rarity: "common",
		translate: "远击技",
		info: "造成伤害时，若你与其距离大于1，此伤害+1",
		card: {
			value: 6.7,
		},
		skill: {
			inherit: "zf_anyDamage",
			filter(event, player) {
				return get.distance(player, event.player) > 1;
			},
		},
	},
	//远谋Ⅰ
	zf_yuanmou: {
		rarity: "common",
		translate: "远谋Ⅰ",
		info: "第3轮你的回合开始时，你回复2点体力",
		card: {
			value: 6,
		},
		skill: {
			forced: true,
			num: 2,
			trigger: { player: "phaseBegin" },
			filter(event, player) {
				return game.roundNumber == 3;
			},
			async content(event, trigger, player) {
				await player.recover(get.info(event.name).num);
			},
		},
	},
	//远谋Ⅲ
	zf_yuanmou3: {
		rarity: "common",
		translate: "远谋Ⅲ",
		info: "第2轮你的回合开始时，你回复2点体力",
		card: {
			cardimage: "zf_yuanmou",
			value: 6.5,
		},
		skill: {
			inherit: "zf_yuanmou",
			num: 2,
			filter(event, player) {
				return game.roundNumber == 2;
			},
		},
	},
	//远谋Ⅱ
	zf_yuanmou2: {
		rarity: "rare",
		translate: "远谋Ⅱ",
		info: "第3轮你的回合开始时，你回复3点体力",
		card: {
			cardimage: "zf_yuanmou",
			value: 7,
		},
		skill: {
			inherit: "zf_yuanmou",
			num: 3,
			filter(event, player) {
				return game.roundNumber == 3;
			},
		},
	},
	//增寿Ⅰ
	zf_zengshou: {
		rarity: "rare",
		translate: "增寿Ⅰ",
		info: "体力上限+1（不改变当前体力) ",
		card: {
			value: 6,
		},
		skill: {
			num: 1,
			init(player, skill) {
				const num = get.info(skill).num;
				const next = game.createEvent(skill + "_init", false, get.event());
				next.set("player", player);
				next.set("num", num);
				next.setContent(async (event, trigger, player) => {
					const { num } = event;
					await player.gainMaxHp(num);
				});
			},
		},
	},
	//增寿Ⅱ
	zf_zengshou2: {
		rarity: "legend",
		translate: "增寿Ⅱ",
		info: "体力上限+2（不改变当前体力) ",
		card: {
			value: 7,
		},
		skill: {
			inherit: "zf_zengshou",
			num: 2,
		},
	},
	//战斗学习Ⅱ
	zf_zhandouxuexi2: {
		rarity: "common",
		translate: "战斗学习Ⅱ",
		info: "从第4轮开始，你的出杀+1",
		card: {
			cardimage: "zf_zhandouxuexi",
			value: 6.2,
		},
		skill: {
			inherit: "zf_cardUsable",
			modNum(card, player, num) {
				if (card.name == "sha" && game.roundNumber >= 4) {
					return num + 1;
				}
			},
		},
	},
	//战斗学习Ⅲ
	zf_zhandouxuexi3: {
		rarity: "common",
		translate: "战斗学习Ⅲ",
		info: "从第7轮开始，你的出杀+1",
		card: {
			cardimage: "zf_zhandouxuexi",
			value: 5.3,
		},
		skill: {
			inherit: "zf_cardUsable",
			modNum(card, player, num) {
				if (card.name == "sha" && game.roundNumber >= 7) {
					return num + 1;
				}
			},
		},
	},
	//战斗学习
	zf_zhandouxuexi: {
		rarity: "rare",
		translate: "战斗学习",
		info: "从第3轮开始，你的出杀+1",
		card: {
			value: 6.7,
		},
		skill: {
			inherit: "zf_cardUsable",
			modNum(card, player, num) {
				if (card.name == "sha" && game.roundNumber >= 3) {
					return num + 1;
				}
			},
		},
	},
	//重击技
	zf_zhongjiji: {
		rarity: "common",
		translate: "重击技",
		info: "对敌方造成伤害一次大于等于3点时，摸一张牌",
		card: {
			value: 6.3,
		},
		skill: {
			inherit: "zf_anyDraw",
			filter(event, player) {
				return event.player.isEnemiesOf(player, false) && event.num >= 3;
			},
		},
	},
	//铸刀
	zf_zhudao: {
		rarity: "rare",
		translate: "铸刀",
		info: "	你使用【杀】后可以至多重铸一张牌",
		card: {
			value: 7.2,
		},
		skill: {
			select: 1,
			trigger: { player: "useCardAfter" },
			filter(event, player) {
				return event.card.name == "sha" && player.hasCard(card => player.canRecast(card), "he");
			},
			async cost(event, trigger, player) {
				const { select } = get.info(event.skill);
				event.result = await player
					.chooseCard(get.prompt2(event.skill), select, (card, player) => player.canRecast(card), "he")
					.set("ai", card => 6 - get.value(card))
					.forResult();
			},
			async content(event, trigger, player) {
				const { cards } = event;
				await player.recast(cards);
			},
		},
	},
	//铸刀Ⅱ
	zf_zhudao2: {
		rarity: "epic",
		translate: "铸刀Ⅱ",
		info: "	你使用【杀】后可以至多重铸两张牌",
		card: {
			cardimage: "zf_zhudao",
			value: 7.7,
		},
		skill: {
			inherit: "zf_zhudao",
			select: [1, 2],
		},
	},
	//醉拳
	zf_zuiquan: {
		rarity: "epic",
		translate: "醉拳",
		info: "【酒】【杀】不能被抵消",
		card: {
			value: 6.8,
		},
		skill: {
			forced: true,
			trigger: { player: "useCard" },
			filter(event, player) {
				return event.card.name == "sha" && event.jiu;
			},
			async content(event, trigger, player) {
				trigger.customArgs.default.directHit2 = true;
			},
		},
	},
};

export class ZhanfaManager {
	//#inited = false;

	/**
	 * 特别注意，#zhanfa和#customZhanfa共用一个命名空间
	 * @type {Record<string, {
	 *  skill: Skill | string,
	 *  rarity: string | null,
	 *  [p: string]: any
	 * }>}
	 */
	#zhanfa = {};

	/**
	 * @type {Record<string, {
	 * 	skill: Skill | string,
	 *  rarity: string | null,
	 *  [p: string]: any
	 * }>}
	 */
	//#customZhanfa = {};

	/**
	 * @param {Library} lib
	 */
	constructor(lib) {
		lib.cardPack["zhanfa"] = [];
		lib.translate["zhanfa_card_config"] = "战法";
		lib.translate["zhanfa_cardsInfo"] = "这里是用来浏览战法的，这些不是卡牌！";
		for (const id in _zhanfa) {
			let { skill, rarity, translate, info, card, ...args } = _zhanfa[id];
			if (typeof skill != "string") {
				skill ??= {};
				skill.nopop = true;
				skill.charlotte = true;
				skill.priority = Infinity;
				lib.skill[id] = skill;
				skill = id;
			}
			lib.translate[id] = translate;
			lib.translate[id + "_info"] = info;
			if (!card || typeof card !== "object") {
				card = {};
			}
			if (!card.fullskin && !card.fullimage) {
				card.fullskin = true;
			}
			if (!card.cardimage && !card.image) {
				card.image = `image/zhanfa/${id}.png`;
			}
			card.type = "zhanfa";
			card.subtype = `zf_${rarity}`;
			if (card.value) {
				card.ai ??= {};
				card.ai.basic ??= {};
				card.ai.basic.value = card.value;
			}
			lib.card[id] = card;
			lib.cardPack["zhanfa"].push(id);
			_zhanfa[id] = { skill: skill, rarity: rarity, ...args };
		}
		this.#zhanfa = _zhanfa;
	}

	/**
	 * 添加新战法
	 * @param {object} zhanfa 要添加的战法
	 * @param {string} [zhanfa.id]
	 * @param {Skill | string} [zhanfa.skill] 战法的对应效果
	 * @param {string | null} [zhanfa.rarity] 战法的稀有度
	 * @param {string} [zhanfa.translate] 战法的翻译
	 * @param {string} [zhanfa.info] 战法的说明
	 * @param {object | undefined} [zhanfa.card] 战法的对应类似卡牌的信息（包括战法的ai），扩展可以在这里添加路径（image属性）或者直接引用已有的卡牌图片（cardimage）
	 */
	add(zhanfa) {
		let { id, skill, rarity, translate, info, card, ...args } = zhanfa;
		if (!id) {
			return;
		}
		if (typeof skill != "string") {
			skill ??= {};
			skill.nopop = true;
			skill.charlotte = true;
			skill.priority = Infinity;
			lib.skill["" + id] = skill;
			skill = id;
		} else {
			translate ??= lib.translate[skill];
			info ??= lib.translate[skill + "_info"];
		}
		lib.translate["" + id] = translate;
		lib.translate[id + "_info"] = info;
		if (!card || typeof card !== "object") {
			card = {};
		}
		if (!card.fullskin && !card.fullimage) {
			card.fullskin = true;
		}
		if (!card.cardimage && !card.image) {
			card.image = `image/zhanfa/${id}.png`;
		}
		card.type = "zhanfa";
		card.subtype = `zf_${rarity}`;
		if (card.value) {
			card.ai ??= {};
			card.ai.basic ??= {};
			card.ai.basic.value = card.value;
		}
		lib.card[id] = card;
		lib.cardPack["zhanfa"].push(id);
		this.#zhanfa[id] = { skill: skill, rarity: rarity, ...args };
	}

	/**
	 * 获取所有战法的id
	 * @param {boolean | undefined} includeBan 获取所有战法，包括被ban的战法
	 * @returns {string[]}
	 */
	getList(includeBan) {
		let list = [...Object.keys(this.#zhanfa)]; //, ...Object.keys(this.#customZhanfa)
		if (!includeBan) {
			list = list.filter(i => !this.get(i)?.modeBan?.(get.mode(), _status.mode));
		}
		return list;
	}

	/**
	 * 获取对应战法的Object
	 * @param {string} id 战法的id
	 * @returns {object}
	 */
	get(id) {
		return this.#zhanfa[id] || {}; //|| this.#customZhanfa[id]
	}

	/**
	 * 获取对应战法的skill
	 * @param {string} id 战法的id
	 * @returns {string}
	 */
	getSkill(id) {
		return this.get(id).skill;
	}

	/**
	 * 获取对应战法的稀有度
	 * @param {string} id 战法的id
	 * @param {boolean} raw 是否返回不带zf_前缀的格式
	 * @returns {string}
	 */
	getRarity(id, raw) {
		const str = this.get(id).rarity
		return raw ? str : `zf_${str}`;
	}

	/**
	 * 设置对应战法的稀有度
	 * @param {string} id 战法的id
	 * @param {string} rarity 要设置的稀有度
	 */
	setRarity(id, rarity) {
		if (!this.#zhanfa[id]) {
			console.warn(`不存在战法: ${id}`);
			return;
		}
		this.#zhanfa[id].rarity = rarity;
	}
}
