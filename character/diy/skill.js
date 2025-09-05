import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//诗笺
	nspianwu: {
		skillTrigger(triggerName, player, skill) {
			var next = game.createEvent(triggerName, false);
			next.player = player;
			next.skill = skill;
			next.setContent(async (event, trigger, player) => {
				event.trigger(event.name);
			});
		},
		init(player, skill) {
			lib.skill[skill].skillTrigger("shijian_init", player, skill);
		},
		onremove(player, skill) {
			lib.skill[skill].skillTrigger("shijian_removeSkill", player, skill);
		},
		audio: 4,
		trigger: {
			global: "phaseBefore",
			player: ["damageEnd", "phaseJieshuBegin"],
			source: "damageSource",
		},
		forced: true,
		superCharlotte: true,
		charlotte: true,
		fixed: true,
		filter(event, player, name) {
			if (name == "phaseBefore" && game.phaseNumber != 0) {
				return false;
			}
			if (name == "damageSource" && game.roundNumber > 3) {
				return false;
			}
			return get.is.playerNames(player, "ns_shijian") || game.ns_shijian?.players?.includes(player);
		},
		async content(event, trigger, player) {
			lib.skill[event.name].skillTrigger("shijian_addSkill", player, event.name);
			player.chat(["获得技能是随机生成的，请仔细看看。", "是欧皇技能还是非酋技能呢？"].randomGet());
		},
		ai: {
			maixie: true,
			maixie_hp: true,
		},
		global: "nspianwu_global",
		subSkill: {
			global: {
				trigger: {
					player: ["shijian_init", "shijian_removeSkill", "shijian_addSkill"],
				},
				filter(event, player) {
					return (event.skill == "nspianwu" && get.is.playerNames(player, "ns_shijian")) || game.ns_shijian?.players?.includes(player);
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					switch (event.triggername) {
						case "shijian_init":
							game.ns_shijian = game.ns_shijian || {
								skills: 0,
								players: [],
							};
							game.ns_shijian.players.add(player);
							break;
						case "shijian_removeSkill":
							player.addSkills(event.skill);
							break;
						case "shijian_addSkill": {
							/** @type ExSkillData 新技能内容 */
							const newSkill = {
								audio: "nspianwu",
							};
							/** 新技能描述 */
							let newSkillTran = "";
							/** 新技能名(id) */
							const skillName = "ns_shijian_createSkill_" + game.ns_shijian.skills++;
							/**
							 * @type skillInit[] 获得技能时的效果列表
							 */
							const initList = lib.skill.nspianwu_global.initList;
							/**
							 * @type skillInit 随机筛选出的“获得技能时的效果”
							 */
							let randomInit = null;
							if (Math.random() <= 0.45) {
								//随机选择
								randomInit = initList.randomGet();
								newSkillTran += "当你获得此技能时，" + randomInit.translate + "。";
								newSkill.init = randomInit.init;
							}

							/** 技能每回合的可用次数 */
							let usable = Infinity;
							if (Math.random() <= 0.6) {
								usable = [1, 2, 3].randomGet();
								newSkill.usable = usable;
								newSkillTran += `每回合限${usable}次，`;
							}

							//随机决定是否是锁定技
							if (Math.random() <= 0.35) {
								newSkill.forced = true;
								newSkillTran += "锁定技，";
							}

							/**
							 * @type skillTrigger[] 触发技能的时机
							 */
							const triggerList = lib.skill.nspianwu_global.triggerList;
							/** 随机取得时机名 */
							const randomTrigger = triggerList[Math.floor(Math.random() * triggerList.length)];
							if (randomTrigger.noUseable) {
								delete newSkill.usable;
								newSkillTran = newSkillTran.replace(`每回合限${usable}次，`, "");
							}
							/**
							 * @type triggerSource[] 时机触发者数组
							 */
							const triggerSource = lib.skill.nspianwu_global.triggerSource.filter(v => {
								if (randomTrigger.noSource && v.target == "source") {
									return false;
								}
								return true;
							});
							/** 随机取得时机触发者 */
							const randomTriggerSource = triggerSource[Math.floor(Math.random() * triggerSource.length)];
							/** @type triggerOpportunity[] 触发技的前，中，后，取消后，跳过后 */
							const triggerOpportunity = lib.skill.nspianwu_global.triggerOpportunity.filter(v => {
								if (randomTrigger.noCancel && Array.isArray(v.trigger) && v.trigger[0] == "Skipped") {
									return false;
								}
								return true;
							});
							/** 随机取得发动时机的前，后，取消 */
							let randomTriggerOpportunity = triggerOpportunity[Math.floor(Math.random() * triggerOpportunity.length)];
							newSkillTran += `当${randomTriggerSource.translate}${randomTrigger.translate}${randomTriggerOpportunity.translate}，`;
							newSkill.trigger = {};
							if (Object.prototype.toString.call(randomTriggerOpportunity.trigger) === "[object Object]") {
								newSkill.trigger = randomTriggerOpportunity.trigger;
							} else if (Array.isArray(randomTriggerOpportunity.trigger)) {
								const triggerArr = [];
								for (const trigger of randomTriggerOpportunity.trigger) {
									triggerArr.push(randomTrigger.trigger + trigger);
								}
								newSkill.trigger[randomTriggerSource.target] = triggerArr;
							} else {
								newSkill.trigger[randomTriggerSource.target] = randomTrigger.trigger + randomTriggerOpportunity.trigger;
							}

							/** @type skillFilter 获取随机的发动条件 */
							let randomSkillFilter;

							//有50%的几率有filter
							if (Math.random() <= 0.45) {
								/** @type skillFilter[] 获取发动条件数组 */
								let filterList = lib.skill.nspianwu_global.skillFilterList_onlyPlayer;
								if (randomTriggerSource.target != "player") {
									filterList = filterList.concat(lib.skill.nspianwu_global.skillFilterList_onlyTarget);
								}
								if (randomTrigger.num) {
									filterList = filterList.concat(lib.skill.nspianwu_global.skillFilterList_hasNum);
								}
								randomSkillFilter = filterList[Math.floor(Math.random() * filterList.length)];
								if (typeof randomSkillFilter.translate == "string") {
									newSkillTran += randomSkillFilter.translate + "，";
								} else {
									// @ts-expect-error ignore
									newSkillTran += randomSkillFilter.translate(randomTrigger.translate) + "，";
								}
							}

							/** @type skillContent[] 技能发动条件 */
							let contentList = lib.skill.nspianwu_global.skillContentList_onlyPlayer;
							if (randomTriggerSource.target != "player") {
								contentList = contentList.concat(lib.skill.nspianwu_global.skillContentList_onlyTarget);
							}
							/** End时机不能操作num */
							if (randomTrigger.num && "End" != randomTriggerOpportunity.trigger && !Array.isArray(randomTriggerOpportunity.trigger)) {
								contentList = contentList.concat(lib.skill.nspianwu_global.skillContentList_hasNum);
							}
							/** End时机不取消 */
							if (!randomTrigger.noCancel && "End" != randomTriggerOpportunity.trigger && !Array.isArray(randomTriggerOpportunity.trigger)) {
								contentList = contentList.concat(lib.skill.nspianwu_global.skillContentList_onlyCancel);
							}
							// 排除类似摸牌时摸牌的效果
							const exclude = ["摸牌", "伤害", "失去体力", "失去体力上限"];
							const exclude2 = [/摸\S+牌/, /受到\S+伤害/, /失去\S+体力(?!上限)/, /失去\S+体力上限/];
							if (exclude.includes(randomTrigger.translate)) {
								const index = exclude.indexOf(randomTrigger.translate);
								contentList = contentList.filter(list => exclude2[index].test(list.translate) == false);
							}
							/**  @type skillContent 随机的发动效果 */
							const randomSkillContent = contentList[Math.floor(Math.random() * contentList.length)];

							newSkill.filter = function (event, player, name) {
								if (!event.player.isAlive()) {
									return false;
								}
								if (typeof randomTrigger.filter == "function") {
									if (randomTrigger.filter(event, player, name) == false) {
										return false;
									}
								}
								if (typeof randomSkillContent.filter == "function") {
									if (randomSkillContent.filter(event, player, name) == false) {
										return false;
									}
								}
								if (randomSkillFilter) {
									return randomSkillFilter.filter(event, player, name);
								}
								return true;
							};

							newSkillTran += randomSkillContent.translate;
							newSkill.content = randomSkillContent.content;

							if (randomSkillContent.translate == "你额外进行一个回合(每轮限一次)") {
								delete newSkill.usable;
								newSkillTran = newSkillTran.replace(`每回合限${usable}次，`, "");
								newSkill.round = 1;
							}

							// ai是否发动
							newSkill.check = function (event, player) {
								/** 收益 */
								let result = 0;
								/** 技能content的效果 */
								const contentResult = randomSkillContent.result;
								// 对于加减数值的判断
								if (randomTrigger.num && lib.skill.nspianwu_global.skillContentList_hasNum.includes(randomSkillContent)) {
									result += contentResult.evtPlayer(event.player, event.name);
								}
								// 对于是否取消此时机的判断
								else if (lib.skill.nspianwu_global.skillContentList_onlyCancel.includes(randomSkillContent)) {
									result += contentResult.evtPlayer(event.player, event.name);
								}
								// 其他正常技能的判断
								else {
									if (contentResult.player) {
										if (typeof contentResult.player == "function") {
											result += contentResult.player(player, event.name);
										} else {
											result += contentResult.player;
										}
									} else if (contentResult.evtPlayer) {
										if (typeof contentResult.evtPlayer == "function") {
											result += contentResult.evtPlayer(event.player, event.name);
										} else {
											result += contentResult.evtPlayer;
										}
									}
								}
								if (get.attitude(player, event.player) < 0) {
									/** 技能是对trigger.player还是player生效 */
									const toPlayer = lib.skill.nspianwu_global.skillContentList_onlyPlayer.includes(randomSkillContent);
									if (!toPlayer) {
										result = -result;
									}
								}
								return result > 0;
							};

							const skillNameList = [
								"微尘",
								"芷蕊",
								"余念",
								"稚遇",
								"幽殤",
								"代真",
								"淡陌",
								"余念",
								"紫寒",
								"忆伤",
								"酒巷",
								"千兰",
								"之柔",
								"新蕾",
								"稚言",
								"祭心",
								"染尘",
								"未安",
								"奢念",
								"暮兮",
								"曼易",
								"心盲",
								"矜暮",
								"紫蓝",
								"以亦",
								"夏蓉",
								"柒夏",
								"久安",
								"安暖",
								"妙彤",
								"凛然",
								"北觅",
								"晴天",
								"殇忆",
								"卿尘",
								"墨默",
								"拾忆",
								"青琯",
								"黛儿",
								"木槿",
								"初夏",
								"陌然",
								"眸敛",
								"涵双",
								"情寂",
								"陌沫",
								"凉生",
								"暖亦",
								"凉栀",
								"念露",
								"慕青",
								"平蝶",
								"安蕾",
								"如初",
								"挽安",
								"宛海",
								"屿风",
								"幻柏",
								"千寻",
								"妙菡",
								"雨寒",
								"南浔",
								"初雨",
								"梦琪",
								"曼文",
								"栀颜",
								"素笺",
								"哽咽",
								"明眸",
								"陌屿",
								"陌颜",
								"葬情",
								"妄想",
								"断念",
								"惜雪",
								"蝶衣",
								"傲珊",
								"青栀",
								"熙妍",
								"迁心",
								"旧颜",
								"孤音",
								"怜梦",
								"含烟",
								"冷傲",
								"晓灵",
								"浅伤",
								"断城",
								"喜孤",
								"青橙",
								"沦陷",
								"故里",
								"屿暖",
								"紫翠",
								"孤心",
								"淡然",
								"墨兮",
								"南忆",
								"酒笙",
								"归安",
								"暮凉",
								"暖言",
								"亡心",
								"新波",
								"沐兮",
								"非墨",
								"执念",
								"天荷",
								"凡旋",
								"展眉",
								"陌路",
								"顾念",
								"柒安",
								"静枫",
								"泪雨",
								"深碍",
								"如南",
								"拒昧",
								"凡蕾",
								"风吟",
								"冷眸",
								"沛菡",
								"久孤",
								"瘾情",
								"安朵",
								"夏青",
								"凉薄",
								"亦瑶",
								"旧夢",
								"陌若",
								"敬情",
								"雅蕊",
								"厌离",
								"温唇",
								"遇見",
								"妄生",
								"元霜",
								"尔岚",
								"南莲",
								"陌殇",
								"沫忆",
								"若雨",
								"倾忆",
								"芷蕾",
								"呓语",
								"枫溪",
								"凡柔",
								"温瞳",
								"墨轩",
								"花葬",
								"梵心",
								"洛雪",
								"無言",
								"兮颜",
								"清欢",
							];

							if (!newSkill.trigger.player && !lib.skill.nspianwu_global.skillContentList_onlyPlayer.includes(randomSkillContent)) {
								newSkill.logTarget = event => event.player;
							}
							if (!newSkill.usable && !newSkill.round) {
								newSkill.usable = 5;
							}
							if (!newSkillTran.endsWith("。")) {
								newSkillTran += "。";
							}
							game.broadcastAll(
								(skill, info, newSkillTranslate, newSkillTran) => {
									lib.skill[skill] = info;
									lib.translate[skill] = newSkillTranslate;
									lib.translate[skill + "_info"] = newSkillTran;
									game.finishSkill(skill);
								},
								skillName,
								newSkill,
								skillNameList.randomGet(),
								newSkillTran
							);

							const next = player.chooseTarget();
							next.set("filterTarget", lib.filter.notMe);
							next.set("prompt", `是否将【${lib.translate[skillName]}】赠予其他角色？`);
							next.set("prompt2", lib.translate[skillName + "_info"]);
							next.set("ai", target => {
								const player = _status.event.player;
								const att = get.attitude(player, target);
								let initResult = 0;
								let initResultOfMe = 0;
								if (randomInit) {
									if (typeof randomInit.result.player == "function") {
										initResult += randomInit.result.player(target);
										initResult += randomInit.result.player(player);
									} else if (typeof randomInit.result.player == "number") {
										initResult += randomInit.result.player;
										initResultOfMe += randomInit.result.player;
									}
								}
								// 获得技能就死亡
								if (initResult == -Infinity) {
									return -att;
								}
								let contentResult = 0,
									contentResultOfMe = 0,
									rs = randomSkillContent.result,
									rp = randomTriggerSource.target,
									rtr = randomTrigger.result;
								/** 技能是对trigger.player还是target生效 */
								const toTarget = lib.skill.nspianwu_global.skillContentList_onlyPlayer.includes(randomSkillContent);
								if (rtr) {
									if (typeof rtr.evtPlayer == "function") {
										rtr = rtr.evtPlayer(target);
									} else {
										rtr = rtr.evtPlayer;
									}
								} else {
									rtr = 0;
								}
								if (rs.player) {
									if (typeof rs.player == "function") {
										contentResult += rs.player(target);
										contentResultOfMe += rs.player(player);
									} else {
										contentResult += rs.player;
										contentResultOfMe += rs.player;
									}
								} else if (rs.evtPlayer) {
									/** 对trigger.player的收益 */
									let result = 0;
									if (typeof rs.evtPlayer == "function") {
										result += rs.evtPlayer(target);
										if (result > 0 && toTarget) {
											contentResult += result;
										} else if (result > 0) {
											contentResult += result + 1;
										} else if (result <= 0 && toTarget) {
											if (lib.skill[skillName].forced) {
												contentResult += result - 3;
											} else {
												contentResult += result - 2;
											}
										} else if (result <= 0) {
											if (lib.skill[skillName].forced) {
												contentResult += result - 3;
											} else {
												contentResult -= result - 2;
											}
										}
										if (toTarget) {
											contentResultOfMe += rs.evtPlayer(player);
										}
									} else {
										if (toTarget) {
											contentResult += rs.evtPlayer;
											contentResultOfMe += rs.evtPlayer;
										} else {
											if (lib.skill[skillName].forced) {
												if (rs.evtPlayer > 0) {
													contentResult += rs.evtPlayer;
													contentResultOfMe += rs.evtPlayer;
												} else {
													contentResult -= rs.evtPlayer;
													contentResultOfMe -= rs.evtPlayer;
												}
											} else {
												contentResult += rs.evtPlayer;
												contentResultOfMe += rs.evtPlayer;
											}
										}
									}
								}
								const mySkillLength = player.skills.filter(skill => skill.indexOf("ns_shijian_createSkill_") == 0).length;
								if (contentResult > contentResultOfMe && att > 3 && initResult > 0) {
									return 1000;
								}
								if (contentResultOfMe > -2 && initResultOfMe > 2) {
									return 0;
								}
								if (contentResultOfMe > 0 && initResult > -1) {
									if (mySkillLength < 9) {
										return 0;
									}
									if (game.countPlayer(current => get.attitude(player, current) > 3) > 0) {
										return att;
									}
									return 0;
								}
								if (rp != "player") {
									if (rtr <= 0 && contentResult < 0 && !toTarget) {
										if (mySkillLength < 9) {
											return 0;
										}
										if (game.countPlayer(current => get.attitude(player, current) > 3) > 0) {
											return att;
										}
										return 0;
									}
								}
								if (contentResult >= 0) {
									if (mySkillLength < 9) {
										return 0;
									}
									if (game.countPlayer(current => get.attitude(player, current) > 3) > 0) {
										return att;
									}
									return 0;
								} else {
									return 0 - att;
								}
							});
							const result = await next.forResult();
							if (result.bool) {
								player.line(result.targets[0]);
								await result.targets[0].addSkills(skillName);
							} else {
								await player.addSkills(skillName);
							}
						}
					}
				},
				/**
				 * @type skillInit[] 获得技能时的效果列表
				 */
				initList: [
					{
						id: "draw",
						init: player => {
							player.draw();
						},
						translate: "你摸一张牌",
						result: { player: 1 },
					},
					{
						id: "recover",
						init: player => {
							player.recover();
						},
						translate: "你回复1点体力",
						result: { player: 1 },
					},
					{
						id: "loseHp",
						init: player => {
							player.loseHp();
						},
						translate: "你失去1点体力",
						result: {
							player: player => (player.hasSkillTag("maihp") ? 1 : -1),
						},
					},
					{
						id: "damage",
						init: player => {
							player.damage(1, "nosource");
						},
						translate: "你受到1点无伤害来源的伤害",
						result: {
							// TODO maixie和maixie_hp的区别
							player: player => (player.hasSkillTag("maixie") ? 1 : -1),
						},
					},
					{
						id: "recover",
						init: player => {
							player.recover(player.maxHp - player.hp);
						},
						translate: "你将体力值回复至体力上限",
						result: {
							player: player => player.maxHp - player.hp,
						},
					},
					{
						id: "chooseToDiscard",
						init: player => {
							player.countCards("he") && player.chooseToDiscard("he", true);
						},
						translate: "你需弃置一张牌",
						result: {
							player: player => {
								if (player.countCards("he") == 0) {
									return 0;
								}
								if (player.hasSkillTag("nodiscard")) {
									return 1;
								}
								return -1;
							},
						},
					},
					{
						id: "link",
						init: player => {
							player.link(true);
						},
						translate: "你横置",
						result: {
							player: player => {
								if (player.hasSkillTag("noLink")) {
									return 0;
								}
								if (player.hasSkillTag("nofire") && player.hasSkillTag("nothunder")) {
									return 0;
								}
								return player.isLinked() ? 1 : -1;
							},
						},
					},
					{
						id: "gainMaxHp",
						init: player => {
							player.gainMaxHp();
						},
						translate: "你增加1点体力上限",
						result: { player: 1 },
					},
					{
						id: "loseMaxHp",
						init: player => {
							player.loseMaxHp();
						},
						translate: "你失去1点体力上限",
						result: { player: -2 },
					},
					{
						id: "getBuff",
						init: player => {
							player.getBuff();
						},
						translate: "你随机获得一个正面效果",
						result: { player: 1 },
					},
					{
						id: "getDebuff",
						init: player => {
							player.getDebuff();
						},
						translate: "你随机获得一个负面效果",
						result: { player: -1 },
					},
					{
						id: "tempHide",
						init: player => {
							player.tempHide();
						},
						translate: "你获得【潜行】到你的回合开始",
						result: { player: 3 },
					},
					{
						id: "gainEquip",
						init: player => {
							const card = get.cardPile2(card => get.type(card) == "equip");
							if (card) {
								player.equip(card);
							}
						},
						translate: "你随机从牌堆中装备一张装备牌(若有)",
						result: { player: 2 },
					},
					{
						id: "gainBasic",
						init: player => {
							const card = get.cardPile2(card => get.type(card) == "basic");
							if (card) {
								player.gain(card, "gain2", "log");
							}
						},
						translate: "你随机从牌堆中获得一张基本牌(若有)",
						result: { player: 2 },
					},
					{
						id: "gainTrick",
						init: player => {
							const card = get.cardPile2(card => get.type(card) == "trick");
							if (card) {
								player.gain(card, "gain2", "log");
							}
						},
						translate: "你随机从牌堆中获得一张普通锦囊牌(若有)",
						result: { player: 2 },
					},
					{
						id: "gainDelay",
						init: player => {
							const card = get.cardPile2(card => get.type(card) == "delay");
							if (card) {
								player.gain(card, "gain2", "log");
							}
						},
						translate: "你随机从牌堆中获得一张延时锦囊牌(若有)",
						result: { player: 2 },
					},
					{
						id: "die",
						init: player => {
							player.die();
						},
						translate: "你死亡",
						result: { player: -Infinity },
					},
				],
				/**
				 * @type triggerOpportunity[] 触发技的前，中，后，取消后，跳过后
				 */
				triggerOpportunity: [
					{
						trigger: "Before",
						translate: "前",
					},
					{
						trigger: "Begin",
						translate: "时",
					},
					{
						trigger: "End",
						translate: "后",
					},
					{
						trigger: ["Skipped", "Cancelled"],
						translate: "被跳过或取消后",
					},
				],
				/**
				 * @type skillTrigger[] 触发技能的时机
				 */
				triggerList: [
					{
						trigger: "damage",
						translate: "受到伤害",
						num: true,
						result: {
							evtPlayer: -1,
						},
					},
					{
						trigger: "recover",
						translate: "回复体力",
						num: true,
						result: {
							evtPlayer: 1,
						},
					},
					{
						trigger: "loseHp",
						translate: "失去体力",
						num: true,
						noSource: true,
						result: {
							evtPlayer: -1,
						},
					},
					{
						trigger: "gainMaxHp",
						translate: "增加体力上限",
						num: true,
						noSource: true,
						result: {
							evtPlayer: 1,
						},
					},
					{
						trigger: "loseMaxHp",
						translate: "失去体力上限",
						num: true,
						noSource: true,
						result: {
							evtPlayer: -1,
						},
					},
					{
						trigger: {
							player: "loseAfter",
							global: "loseAsyncAfter",
						},
						translate: "失去的牌因弃置而进入弃牌堆后",
						filter(event, player) {
							if (event.type !== "discard" || event.getlx === false) {
								return false;
							}
							return event.getl?.(player)?.cards2?.some(card => get.position(card) === "d");
						},
						noSource: true,
						noCancel: true,
					},
					{
						trigger: "phaseDraw",
						translate: "摸牌阶段",
						num: true,
						noSource: true,
						noUseable: true,
						result: {
							evtPlayer: 1,
						},
					},
					{
						trigger: "phaseJudge",
						translate: "判定阶段",
						noSource: true,
						noUseable: true,
						result: {
							evtPlayer: 0,
						},
					},
					{
						trigger: "phaseDiscard",
						translate: "弃牌阶段",
						noSource: true,
						noUseable: true,
						result: {
							evtPlayer: 0,
						},
					},
					{
						trigger: "draw",
						translate: "摸牌",
						noSource: true,
						result: {
							evtPlayer: 1,
						},
					},
					{
						trigger: "judge",
						translate: "判定",
						noCancel: true,
						noSource: true,
					},
					{
						trigger: "turnOver",
						translate: "翻面",
						noSource: true,
						result: {
							evtPlayer: player => {
								if (player.hasSkillTag("noturn")) {
									return 0;
								}
								return player.isTurnedOver() ? 1 : -1;
							},
						},
					},
					{
						trigger: "link",
						translate: "横置/重置",
						noSource: true,
						result: {
							evtPlayer: player => {
								if (player.hasSkillTag("noLink")) {
									return 0;
								}
								if (player.hasSkillTag("nofire") && player.hasSkillTag("nothunder")) {
									return 0;
								}
								return player.isLinked() ? 1 : -1;
							},
						},
					},
					{
						trigger: "useCard",
						translate: "使用牌",
						noCancel: true,
						noSource: true,
					},
					{
						trigger: "useSkill",
						translate: "使用主动技能",
						noCancel: true,
						noSource: true,
					},
					{
						trigger: "addJudge",
						translate: "的判定区添加延时锦囊",
						noCancel: true,
						noSource: true,
						result: {
							evtPlayer: player => {
								if (player.hasSkill("reqianxun") && player.hasSkillTag("nolose")) {
									return 1;
								}
								if (player.hasSkill("xinleiji")) {
									return 1;
								}
								return -1;
							},
						},
					},
				],
				/**
				 * @type triggerSource[] 时机触发者列表
				 */
				triggerSource: [
					{
						target: "player",
						translate: "你",
					},
					{
						target: "source",
						translate: "以你为来源的角色",
					},
					{
						target: "global",
						translate: "一名角色",
					},
				],
				/**
				 * @type skillFilter[] 技能发动条件(仅player)
				 */
				skillFilterList_onlyPlayer: [
					{
						filter(event, player) {
							return player.hp > 2;
						},
						translate: "若你的体力值大于2",
					},
					{
						filter(event, player) {
							return player.hp < 2;
						},
						translate: "若你的体力值小于2",
					},
					{
						filter(event, player) {
							return player.countCards("j") > 0;
						},
						translate: "若你的判定区内有牌",
					},
					{
						filter(event, player) {
							return !player.countCards("j");
						},
						translate: "若你的判定区内没有牌",
					},
					{
						filter(event, player) {
							return !player.countCards("h");
						},
						translate: "若你没有手牌",
					},
					{
						filter(event, player) {
							return !player.getHistory("useCard");
						},
						translate: "若你本回合没有使用过牌",
					},
					{
						filter(event, player) {
							return player.getHistory("useCard").length > 0;
						},
						translate: "若你本回合使用过牌",
					},
					{
						filter(event, player) {
							return !player.getHistory("respond");
						},
						translate: "若你本回合没有打出过牌",
					},
					{
						filter(event, player) {
							return player.isDamaged();
						},
						translate: "若你已受伤",
					},
					{
						filter(event, player) {
							return player.isHealthy();
						},
						translate: "若你的体力值为满",
					},
					{
						filter(event, player) {
							return player.isMaxHp();
						},
						translate: "若你的体力值为全场最多（或之一）",
					},
					{
						filter(event, player) {
							return player.isMaxHp(true);
						},
						translate: "若你的体力值为全场最多",
					},
					{
						filter(event, player) {
							return player.isMinHp();
						},
						translate: "若你的体力值为全场最少（或之一）",
					},
					{
						filter(event, player) {
							return player.isMinHp(true);
						},
						translate: "若你的体力值为全场最少",
					},
					{
						filter(event, player) {
							return player.isMaxCard();
						},
						translate: "若你的牌为全场最多（或之一）",
					},
					{
						filter(event, player) {
							return player.isMaxCard(true);
						},
						translate: "若你的牌为全场最多",
					},
					{
						filter(event, player) {
							return player.isMinCard();
						},
						translate: "若你的牌为全场最少（或之一）",
					},
					{
						filter(event, player) {
							return player.isMinCard(true);
						},
						translate: "若你的牌为全场最少",
					},
					{
						filter(event, player) {
							return player.isMaxHandcard();
						},
						translate: "若你的手牌为全场最多（或之一）",
					},
					{
						filter(event, player) {
							return player.isMaxHandcard(true);
						},
						translate: "若你的手牌为全场最多",
					},
					{
						filter(event, player) {
							return player.isMinHandcard();
						},
						translate: "若你的手牌为全场最少（或之一）",
					},
					{
						filter(event, player) {
							return player.isMinHandcard(true);
						},
						translate: "若你的手牌为全场最少",
					},
					{
						filter(event, player) {
							return player.isMaxEquip();
						},
						translate: "若你装备区的牌为全场最多（或之一）",
					},
					{
						filter(event, player) {
							return player.isMaxEquip(true);
						},
						translate: "若你装备区的牌为全场最多",
					},
					{
						filter(event, player) {
							return player.isMinEquip();
						},
						translate: "若你装备区的牌为全场最少（或之一）",
					},
					{
						filter(event, player) {
							return player.isMinEquip(true);
						},
						translate: "若你装备区的牌为全场最少",
					},
					{
						filter(event, player) {
							return player.getPrevious() != player && player.getPrevious().hp > 1;
						},
						translate: "若你的上家（不为自己）的体力值大于1",
					},
					{
						filter(event, player) {
							return player.getPrevious() != player && player.getPrevious().hp == 1;
						},
						translate: "若你的上家（不为自己）的体力值等于1",
					},
					{
						filter(event, player) {
							return player.getPrevious() != player && player.getPrevious().countCards("h") > 2;
						},
						translate: "若你的上家（不为自己）的手牌数大于2",
					},
					{
						filter(event, player) {
							return player.getPrevious() != player && !player.getPrevious().countCards("h");
						},
						translate: "若你的上家（不为自己）没有手牌",
					},
					{
						filter(event, player) {
							return player.getPrevious() != player && player.getPrevious().getHistory("useCard").length > 0;
						},
						translate: "若你的上家（不为自己）本回合使用过牌",
					},
					{
						filter(event, player) {
							return player.getPrevious() != player && !player.getPrevious().getHistory("respond");
						},
						translate: "若你的上家（不为自己）本回合没有打出过牌",
					},
					{
						filter(event, player) {
							return player.getPrevious() != player && player.getPrevious().isDamaged();
						},
						translate: "若你的上家（不为自己）已受伤",
					},
					{
						filter(event, player) {
							return player.getPrevious() != player && player.getPrevious().isHealthy();
						},
						translate: "若你的上家（不为自己）的体力值为满",
					},
					{
						filter(event, player) {
							return player.getNext() != player && player.getNext().hp > 1;
						},
						translate: "若你的下家（不为自己）的体力值大于1",
					},
					{
						filter(event, player) {
							return player.getNext() != player && player.getNext().hp == 1;
						},
						translate: "若你的下家（不为自己）的体力值等于1",
					},
					{
						filter(event, player) {
							return player.getNext() != player && player.getNext().countCards("h") > 2;
						},
						translate: "若你的下家（不为自己）的手牌数大于2",
					},
					{
						filter(event, player) {
							return player.getNext() != player && !player.getNext().countCards("h");
						},
						translate: "若你的下家（不为自己）没有手牌",
					},
					{
						filter(event, player) {
							return player.getNext() != player && player.getNext().getHistory("useCard").length > 0;
						},
						translate: "若你的下家（不为自己）本回合使用过牌",
					},
					{
						filter(event, player) {
							return player.getNext() != player && !player.getNext().getHistory("respond");
						},
						translate: "若你的下家（不为自己）本回合没有打出过牌",
					},
					{
						filter(event, player) {
							return player.getNext() != player && player.getNext().isDamaged();
						},
						translate: "若你的下家（不为自己）已受伤",
					},
					{
						filter(event, player) {
							return player.getNext() != player && player.getNext().isHealthy();
						},
						translate: "若你的下家（不为自己）的体力值为满",
					},
				],
				/**
				 * @type skillFilter[] 技能发动条件(仅trigger.player)
				 */
				skillFilterList_onlyTarget: [
					{
						filter(event, player) {
							return event.player.hp > 1;
						},
						translate: "若其的体力值大于1",
					},
					{
						filter(event, player) {
							return event.player.countCards("h", "sha") > 0;
						},
						translate: "若其手牌中有【杀】",
					},
					{
						filter(event, player) {
							return event.player.isDamaged();
						},
						translate: "若其已受伤",
					},
					{
						filter(event, player) {
							return event.player.isHealthy();
						},
						translate: "若其的体力值为满",
					},
					{
						filter(event, player) {
							return event.player.isMaxHp();
						},
						translate: "若其的体力值为全场最多（或之一）",
					},
					{
						filter(event, player) {
							return event.player.isMaxHp(true);
						},
						translate: "若其的体力值为全场最多",
					},
					{
						filter(event, player) {
							return event.player.isMinHp();
						},
						translate: "若其的体力值为全场最少（或之一）",
					},
					{
						filter(event, player) {
							return event.player.isMinHp(true);
						},
						translate: "若其的体力值为全场最少",
					},
					{
						filter(event, player) {
							return event.player.isMaxCard();
						},
						translate: "若其的牌为全场最多（或之一）",
					},
					{
						filter(event, player) {
							return event.player.isMaxCard(true);
						},
						translate: "若其的牌为全场最多",
					},
					{
						filter(event, player) {
							return event.player.isMinCard();
						},
						translate: "若其的牌为全场最少（或之一）",
					},
					{
						filter(event, player) {
							return event.player.isMinCard(true);
						},
						translate: "若其的牌为全场最少",
					},
					{
						filter(event, player) {
							return event.player.isMaxHandcard();
						},
						translate: "若其的手牌为全场最多（或之一）",
					},
					{
						filter(event, player) {
							return event.player.isMaxHandcard(true);
						},
						translate: "若其的手牌为全场最多",
					},
					{
						filter(event, player) {
							return event.player.isMinHandcard();
						},
						translate: "若其的手牌为全场最少（或之一）",
					},
					{
						filter(event, player) {
							return event.player.isMinHandcard(true);
						},
						translate: "若其的手牌为全场最少",
					},
					{
						filter(event, player) {
							return event.player.isMaxEquip();
						},
						translate: "若其装备区的牌为全场最多（或之一）",
					},
					{
						filter(event, player) {
							return event.player.isMaxEquip(true);
						},
						translate: "若其装备区的牌为全场最多",
					},
					{
						filter(event, player) {
							return event.player.isMinEquip();
						},
						translate: "若其装备区的牌为全场最少（或之一）",
					},
					{
						filter(event, player) {
							return event.player.isMinEquip(true);
						},
						translate: "若其装备区的牌为全场最少",
					},
				],
				/**
				 * @type skillFilter[] 技能发动条件(仅trigger.num存在)
				 */
				skillFilterList_hasNum: [
					{
						filter(event, player) {
							return event.num && event.num > 1;
						},
						translate: translate => `若${translate}的点数大于1`,
					},
					{
						filter(event, player) {
							return event.num && event.num > 2;
						},
						translate: translate => `若${translate}的点数大于2`,
					},
				],
				/**
				 * @type skillContent[] 技能发动效果(仅player)
				 */
				skillContentList_onlyPlayer: [
					{
						async content(event, trigger, player) {
							player.insertPhase();
						},
						translate: "你在此回合结束后执行一个额外回合(每轮限一次)",
						result: {
							player: 2,
						},
					},
					{
						async content(event, trigger, player) {
							player.chat("草，怎么是空技能");
						},
						translate: "undefined",
						result: {
							player: 1,
						},
					},
					{
						async content(event, trigger, player) {
							player.draw();
						},
						translate: "你摸一张牌",
						result: {
							player: 1,
						},
					},
					{
						async content(event, trigger, player) {
							player.draw(2);
						},
						translate: "你摸两张牌",
						result: {
							player: 2,
						},
					},
					{
						async content(event, trigger, player) {
							player.draw(3);
						},
						translate: "你摸三张牌",
						result: {
							player: 3,
						},
					},
					{
						async content(event, trigger, player) {
							player.recover();
						},
						translate: "你回复1点体力",
						filter: (event, player) => !player.isHealthy(),
						result: {
							player: player => (player.isHealthy() ? 0 : 1),
						},
					},
					{
						async content(event, trigger, player) {
							player.recover(player.maxHp - player.hp);
						},
						translate: "你回复体力至体力上限",
						filter: (event, player) => !player.isHealthy(),
						result: {
							player: player => (player.isHealthy() ? 0 : player.maxHp - player.hp),
						},
					},
					{
						async content(event, trigger, player) {
							player.damage("nocard", "nosource");
						},
						translate: "你受到1点无来源的伤害",
						result: {
							player: player => (player.hasSkillTag("maixie") ? 1 : -1),
						},
					},
					{
						async content(event, trigger, player) {
							player.loseHp();
						},
						translate: "你失去1点体力",
						result: {
							player: player => (player.hasSkillTag("maihp") ? 1 : -1),
						},
					},
					{
						async content(event, trigger, player) {
							player.chooseToDiscard("he", true);
						},
						filter: (event, player) => player.countCards("he") > 0,
						translate: "你需弃置一张牌",
						result: {
							player: player => {
								if (player.countCards("he") == 0) {
									return 0;
								}
								if (player.hasSkillTag("nodiscard")) {
									return 1;
								}
								return -1;
							},
						},
					},
					{
						async content(event, trigger, player) {
							player.gainMaxHp();
						},
						translate: "你增加1点体力上限",
						result: {
							player: 1,
						},
					},
					{
						async content(event, trigger, player) {
							player.loseMaxHp();
						},
						translate: "你减少1点体力上限",
						result: {
							player: player => (player.maxHp == 1 ? -Infinity : -3),
						},
					},
					{
						async content(event, trigger, player) {
							player.die();
						},
						translate: "你立即阵亡",
						result: {
							player: -Infinity,
						},
					},
					{
						async content(event, trigger, player) {
							player.turnOver();
						},
						translate: "你翻面",
						result: {
							player: player => {
								if (player.hasSkillTag("noturn")) {
									return 0;
								}
								return player.isTurnedOver() ? 1 : -1;
							},
						},
					},
					{
						async content(event, trigger, player) {
							player.link();
						},
						translate: "你横置/重置",
						result: {
							player: player => {
								if (player.hasSkillTag("noLink")) {
									return 0;
								}
								if (player.hasSkillTag("nofire") && player.hasSkillTag("nothunder")) {
									return 0;
								}
								return player.isLinked() ? 1 : -1;
							},
						},
					},
					{
						async content(event, trigger, player) {
							const next = player.judge(card => {
								if (get.color(card) == "red") {
									return 2;
								}
								return -0.5;
							});
							next.judge2 = result => {
								return result.bool;
							};
							const result = await next.forResult();
							if (result.bool) {
								const nextx = player.chooseTarget(lib.filter.notMe);
								next.ai = function (target) {
									const player = _status.event.player;
									return get.damageEffect(target, player, player);
								};
								const resultx = await nextx.forResult();
								if (resultx.bool) {
									player.line(resultx.targets);
									resultx.targets[0].damage(1);
								}
							}
						},
						translate: "你进行一次判定, 若结果为红色，你可以对一名其他角色造成1点伤害",
						result: {
							player: player => (player.hasSkill("tiandu") || player.hasSkill("xinleiji") ? 3 : 1),
						},
					},
					{
						async content(event, trigger, player) {
							player.getBuff();
						},
						translate: "你随机获得一个正面效果",
						result: {
							player: 1,
						},
					},
					{
						async content(event, trigger, player) {
							player.tempHide();
						},
						translate: "你获得【潜行】到你的回合开始",
						result: {
							player: 3,
						},
						filter: (event, player) => !player.hasSkill("qianxing"),
					},
					{
						async content(event, trigger, player) {
							var card = get.cardPile2(card => get.type(card) == "equip");
							if (card) {
								await player.equip(card);
							}
						},
						translate: "你随机从牌堆中装备一张装备牌",
						result: {
							player: 2,
						},
					},
					{
						async content(event, trigger, player) {
							var card = get.cardPile2(card => get.type(card) == "basic");
							if (card) {
								await player.gain(card, "gain2", "log");
							}
						},
						translate: "你随机从牌堆中获得一张基本牌",
						result: {
							player: 2,
						},
					},
					{
						async content(event, trigger, player) {
							var card = get.cardPile2(card => get.type(card) == "trick");
							if (card) {
								await player.gain(card, "gain2", "log");
							}
						},
						translate: "你随机从牌堆中获得一张普通锦囊牌",
						result: {
							player: 2,
						},
					},
					{
						async content(event, trigger, player) {
							var card = get.cardPile2(card => get.type(card) == "delay");
							if (card) {
								await player.gain(card, "gain2", "log");
							}
						},
						translate: "你随机从牌堆中获得一张延时锦囊牌",
						result: {
							player: 2,
						},
					},
					{
						async content(event, trigger, player) {
							let cards = get.cards(3);
							await game.cardsGotoOrdering(cards);
							await player.showCards(cards);
							var num = 0;
							for (var i = 0; i < cards.length; i++) {
								if (get.suit(cards[i]) == "heart") {
									num++;
									cards.splice(i--, 1);
								}
							}
							if (num) {
								await player.recover(num);
							}
							if (cards.length) {
								await player.gain(event.cards, "gain2");
								game.delay();
							}
						},
						translate: "你展示牌堆顶的三张牌，然后回复X点体力（X为其中红桃牌数目），然后你将其中的红桃牌置于弃牌堆，并获得其他牌",
						result: {
							player: 3,
						},
					},
					{
						async content(event, trigger, player) {
							await player.chooseToUse();
						},
						translate: "你可以立即使用一张牌",
						filter(event, player) {
							return player.countCards("h") > 0;
						},
						result: {
							player: player => (player.countCards("h") > 0 ? 1 : 0),
						},
					},
					{
						async content(event, trigger, player) {
							player.addTempSkill("fengyin");
						},
						translate: "本回合你的非锁定技失效",
						filter: (event, player) => !player.hasSkill("fengyin"),
						result: {
							player: -2,
						},
					},
				],
				/**
				 * @type skillContent[] 技能发动效果(仅trigger.player)
				 */
				skillContentList_onlyTarget: [
					{
						async content(event, trigger, player) {
							trigger.player.draw();
						},
						translate: "其摸一张牌",
						result: {
							evtPlayer: 1,
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.draw(2);
						},
						translate: "其摸两张牌",
						result: {
							evtPlayer: 2,
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.recover();
						},
						translate: "其回复1点体力",
						filter: (event, player) => !event.player.isHealthy(),
						result: {
							evtPlayer: player => (player.isHealthy() ? 0 : 1),
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.damage("nocard", player);
						},
						translate: "其受到1点来自于你的伤害",
						result: {
							evtPlayer: player => (player.hasSkillTag("maixie") ? 1 : -1),
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.damage(2, "nocard", player);
						},
						translate: "其受到两点来自于你的伤害",
						result: {
							evtPlayer: player => (player.hasSkillTag("maixie") && player.hp > 2 ? 2 : -2),
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.loseHp();
						},
						translate: "其失去1点体力",
						result: {
							evtPlayer: player => (player.hasSkillTag("maihp") ? 1 : -1),
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.chooseToDiscard("he", true);
						},
						filter: (event, player) => event.player.countCards("he") > 0,
						translate: "其需弃置一张牌",
						result: {
							evtPlayer: player => {
								if (player.countCards("he") == 0) {
									return 0;
								}
								if (player.hasSkillTag("nodiscard")) {
									return 1;
								}
								return -1;
							},
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.gainMaxHp();
						},
						translate: "其增加1点体力上限",
						result: {
							evtPlayer: 1,
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.loseMaxHp();
						},
						translate: "其失去1点体力上限",
						result: {
							evtPlayer: player => (player.maxHp == 1 ? -Infinity : -2),
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.turnOver();
						},
						translate: "其翻面",
						result: {
							evtPlayer: player => {
								if (player.hasSkillTag("noturn")) {
									return 0;
								}
								return player.isTurnedOver() ? 1 : -1;
							},
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.link();
						},
						translate: "其横置/重置",
						result: {
							evtPlayer: player => {
								if (player.hasSkillTag("noLink")) {
									return 0;
								}
								if (player.hasSkillTag("nofire") && player.hasSkillTag("nothunder")) {
									return 0;
								}
								return player.isLinked() ? 1 : -1;
							},
						},
					},
					{
						async content(event, trigger, player) {
							const next = trigger.player.judge(card => {
								if (get.color(card) == "black") {
									return 2;
								}
								return -0.5;
							});
							next.judge2 = result => {
								return result.bool;
							};
							const result = next.forResult();
							if (result.bool) {
								trigger.player.chooseDrawRecover();
							}
						},
						translate: "其进行一次判定，若结果为黑色，其选择摸牌或者回血",
						result: {
							evtPlayer: player => (player.hasSkill("tiandu") || player.hasSkill("xinleiji") ? 3 : 1),
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.die();
						},
						translate: "其立即阵亡",
						result: {
							evtPlayer: -Infinity,
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.getBuff();
						},
						translate: "其随机获得一个正面效果",
						result: {
							evtPlayer: 1,
						},
					},
					{
						async content(event, trigger, player) {
							var card = get.cardPile2(card => get.type(card) == "equip");
							if (card) {
								await trigger.player.equip(card);
							}
						},
						translate: "其随机从牌堆中装备一张装备牌",
						result: {
							evtPlayer: 2,
						},
					},
					{
						async content(event, trigger, player) {
							var card = get.cardPile2(card => get.type(card) == "basic");
							if (card) {
								await trigger.player.gain(card, "gain2", "log");
							}
						},
						translate: "其随机从牌堆中获得一张基本牌",
						result: {
							evtPlayer: 2,
						},
					},
					{
						async content(event, trigger, player) {
							var card = get.cardPile2(card => get.type(card) == "trick");
							if (card) {
								await trigger.player.gain(card, "gain2", "log");
							}
						},
						translate: "其随机从牌堆中获得一张普通锦囊牌",
						result: {
							evtPlayer: 2,
						},
					},
					{
						async content(event, trigger, player) {
							var card = get.cardPile2(card => get.type(card) == "delay");
							if (card) {
								await trigger.player.gain(card, "gain2", "log");
							}
						},
						translate: "其随机从牌堆中获得一张延时锦囊牌",
						result: {
							evtPlayer: 2,
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.chooseToUse();
						},
						translate: "其可以立即使用一张牌",
						filter(event, player) {
							return event.player.countCards("h") > 0;
						},
						result: {
							evtPlayer: player => (player.countCards("h") > 0 ? 1 : 0),
						},
					},
					{
						async content(event, trigger, player) {
							trigger.player.addTempSkill("fengyin");
						},
						filter(event, player) {
							return !event.player.hasSkill("fengyin");
						},
						translate: "本回合其的非锁定技失效",
						result: {
							evtPlayer: -2,
						},
					},
				],
				/**
				 * @type skillContent[] 技能发动效果(仅trigger.num存在)
				 */
				skillContentList_hasNum: [
					{
						async content(event, trigger, player) {
							trigger.num++;
						},
						translate: "该数值+1",
						result: {
							evtPlayer(player, triggerName) {
								if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
									return -1;
								}
								return 1;
							},
						},
					},
					{
						async content(event, trigger, player) {
							trigger.num += 2;
						},
						translate: "该数值+2",
						result: {
							evtPlayer(player, triggerName) {
								if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
									return -2;
								}
								return 2;
							},
						},
					},
					{
						async content(event, trigger, player) {
							trigger.num--;
						},
						translate: "该数值-1",
						result: {
							evtPlayer(player, triggerName) {
								if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
									return 1;
								}
								return -1;
							},
						},
					},
					{
						async content(event, trigger, player) {
							trigger.num -= 2;
						},
						translate: "该数值-2",
						result: {
							evtPlayer(player, triggerName) {
								if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
									return 2;
								}
								return -2;
							},
						},
					},
					{
						async content(event, trigger, player) {
							trigger.num *= 2;
						},
						translate: "该数值乘2",
						result: {
							evtPlayer(player, triggerName) {
								if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
									return -2;
								}
								return 2;
							},
						},
					},
				],
				/**
				 * @type skillContent[] 技能发动效果(仅可取消的时机可用)
				 */
				skillContentList_onlyCancel: [
					{
						async content(event, trigger, player) {
							trigger.cancel();
						},
						translate: "取消该效果",
						result: {
							evtPlayer(player, triggerName) {
								if (["damage", "loseHp", "loseMaxHp", "addJudge"].includes(triggerName)) {
									return 1;
								}
								return -2;
							},
						},
					},
				],
			},
		},
	},
	//派对浪客
	nsxingyun: {
		audio: 2,
		enable: "chooseToUse",
		getSixiang(card) {
			if (typeof card == "string") {
				card = { name: card };
			}
			if (card.name == "shan") {
				return "玄武";
			}
			var type = get.type(card, null, false);
			if (type == "delay") {
				return "朱雀";
			}
			if (get.tag(card, "damage")) {
				return "白虎";
			}
			if (get.tag(card, "recover")) {
				return "玄武";
			}
			if (type == "trick") {
				return "青龙";
			}
			return false;
		},
		filter(event, player) {
			if (player.hasSkill("nsxingyun_round")) {
				return false;
			}
			var list = player.getStorage("nsxingyun");
			if (list.length >= 4) {
				return false;
			}
			for (var i of lib.inpile) {
				var type = lib.skill.nsxingyun.getSixiang(i);
				if (!type || list.includes(type)) {
					continue;
				}
				if (event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
				if (i == "sha") {
					for (var j of lib.inpile_nature) {
						if (event.filterCard(get.autoViewAs({ name: i, nature: j }, "unsure"), player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var map = { 青龙: [], 朱雀: [], 白虎: [], 玄武: [] };
				var list = player.getStorage("nsxingyun");
				for (var i of lib.inpile) {
					var type = lib.skill.nsxingyun.getSixiang(i);
					if (!type || list.includes(type)) {
						continue;
					}
					if (event.filterCard({ name: i }, player, event)) {
						map[type].push([get.type2(i, false), "", i]);
					}
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: i, nature: j }, player, event)) {
								map[type].push([get.type2(i, false), "", i, j]);
							}
						}
					}
				}
				var dialog = ["星陨", "hidden"];
				for (var i in map) {
					if (map[i].length > 0) {
						dialog.push('<div class="text center">' + i + "</div>");
						dialog.push([map[i], "vcard"]);
					}
				}
				return ui.create.dialog.apply(ui.create, dialog);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard(
					{
						name: button.link[2],
						nature: button.link[3],
					},
					player,
					_status.event.getParent()
				);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				return _status.event.player.getUseValue(
					{
						name: button.link[2],
						nature: button.link[3],
					},
					false
				);
			},
			backup(links, player) {
				return {
					selectCard: 1,
					filterCard: true,
					popname: true,
					position: "hs",
					check(card) {
						return 7 - get.value(card);
					},
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("nsxingyun_round");
					},
				};
			},
			prompt(links, player) {
				return "将一张手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			threaten: 2.6,
			order: 1,
			result: { player: 1 },
		},
		group: "nsxingyun_clear",
		derivation: ["nsxingyun_faq", "bazhen"],
		subSkill: {
			backup: {},
			clear: {
				trigger: { player: "useCardAfter" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.skill == "nsxingyun_backup" && event.cards.length == 1 && lib.skill.nsxingyun.getSixiang(event.card) != lib.skill.nsxingyun.getSixiang(event.cards[0]) && !player.getStorage("nsxingyun").includes(lib.skill.nsxingyun.getSixiang(event.card));
				},
				content() {
					"step 0";
					player.draw(2);
					player.markAuto("nsxingyun", [lib.skill.nsxingyun.getSixiang(trigger.card)]);
					"step 1";
					if (player.getStorage("nsxingyun").length >= 4) {
						player.addSkills("bazhen");
					}
				},
			},
			round: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	nshanlang: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countCards("h") > 0 && game.hasPlayer(current => player != current && player.canCompare(current));
		},
		async cost(event, trigger, player) {
			const goon = player.hasCard(function (card) {
				return get.value(card) <= 7;
			}, "h");
			event.result = await player
				.chooseTarget([1, 3], get.prompt(event.skill), "和至多三名角色进行拼点", function (card, player, target) {
					return target != player && player.canCompare(target);
				})
				.set("ai", function (target) {
					if (!_status.event.goon) {
						return false;
					}
					var att = get.attitude(_status.event.player, target);
					if (att >= 0) {
						return 0;
					}
					if (target.hasSkillTag("noh")) {
						att /= 3;
					}
					return -att / Math.sqrt(target.countCards("h"));
				})
				.set("goon", goon)
				.forResult();
		},
		content() {
			"step 0";
			event.max_num = 0;
			targets.sortBySeat();
			player.chooseToCompare(targets).callback = lib.skill.nshanlang.callback;
			"step 1";
			if (event.target) {
				player
					.chooseBool("是否令" + get.translation(target) + "获得一张牌？")
					.set("goon", get.attitude(player, target) > 0)
					.set("ai", () => _status.event.goon);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = get.cardPile2(function (card) {
					return !lib.skill.nsxingyun.getSixiang(card);
				});
				if (card) {
					target.gain(card, "gain2");
				}
			}
		},
		callback() {
			var list = [
					[player, event.num1],
					[target, event.num2],
				],
				evt = event.getParent(2);
			for (var i of list) {
				if (i[1] > evt.max_num) {
					evt.max_num = i[1];
					evt.target = i[0];
				} else if (evt.target && i[1] == evt.max_num && i[0] != evt.target) {
					delete evt.target;
				}
			}
		},
	},
	//钟离牧
	nskuanhuai: {
		trigger: { player: "phaseUseBegin" },
		content() {
			"step 0";
			var card = get.discardPile(function (card) {
				return get.type(card) != "basic";
			});
			if (card) {
				player.gain(card, "gain2");
			}
			"step 1";
			player.addTempSkill("nskuanhuai_blocker", "phaseUseAfter");
			player.addTempSkill("nskuanhuai_effect");
		},
		subSkill: {
			blocker: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (get.type(card) == "basic") {
							return false;
						}
					},
					cardSavable(card) {
						if (get.type(card) == "basic") {
							return false;
						}
					},
				},
			},
			effect: {
				trigger: { player: "phaseDiscardEnd" },
				charlotte: true,
				popup: false,
				filter(event, player) {
					return player.hasHistory("lose", function (evt) {
						if (evt.type != "discard" || evt.getParent("phaseDiscard") != event) {
							return false;
						}
						for (var i of evt.cards2) {
							if (get.type(i, null, false) == "basic" && get.position(i, true) == "d" && player.hasUseTarget(i)) {
								return true;
							}
						}
						return false;
					});
				},
				content() {
					"step 0";
					var cards = [];
					player.getHistory("lose", function (evt) {
						if (evt.type != "discard" || evt.getParent("phaseDiscard") != trigger) {
							return false;
						}
						for (var i of evt.cards2) {
							if (get.type(i, null, false) == "basic" && get.position(i, true) == "d") {
								cards.push(i);
							}
						}
						return false;
					});
					event.cards = cards;
					"step 1";
					var cards2 = event.cards.filter(function (i) {
						return get.position(i, true) == "d" && player.hasUseTarget(i);
					});
					if (cards2.length) {
						player.chooseButton(["宽怀：是否使用其中一张牌？", cards2]);
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						var card = result.links[0];
						cards.remove(card);
						player.chooseUseTarget(card, true);
						if (cards.length > 0) {
							event.goto(1);
						}
					}
				},
			},
		},
	},
	nsdingbian: {
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			return get.type(event.card) != "basic";
		},
		content() {
			"step 0";
			player.addTempSkill("nsdingbian_mark");
			player.addMark("nsdingbian_mark", 1, false);
			var storage = player.getStorage("nsdingbian_ignore");
			var goon = false;
			for (var i of lib.inpile) {
				if (get.type(i) == "basic" && !storage.includes(i)) {
					goon = true;
					break;
				}
			}
			if (goon) {
				player
					.chooseControl()
					.set("choiceList", ["从牌堆中获得一张基本牌", "令一种基本牌于本回合内不计入手牌上限"])
					.set("prompt", "定边：请选择一项")
					.set("ai", function () {
						var player = _status.event.player;
						var list = ["tao", "shan"],
							list2 = player.getStorage("nsdingbian_ignore");
						list.removeArray(list2);
						if (!list.length) {
							return 0;
						}
						var num1 = player.countCards("hs", function (card) {
								return get.type(card) != "basic" && player.hasValueTarget(card, null, true);
							}),
							num2 = player.getHandcardLimit();
						if (player.countCards("h", list) <= num2 - num1) {
							return 0;
						}
						return 1;
					});
			} else {
				event._result = { index: 0 };
			}
			"step 1";
			if (result.index == 0) {
				var card = get.cardPile2(function (card) {
					return get.type(card, null, false) == "basic";
				});
				if (card) {
					player.gain(card, "gain2");
				}
				event.finish();
			} else {
				var list = [],
					storage = player.getStorage("nsdingbian_ignore");
				for (var i of lib.inpile) {
					if (get.type(i) == "basic" && !storage.includes(i)) {
						list.push(i);
					}
				}
				player.chooseButton(["令一种基本牌于本回合内不计入手牌上限", [list, "vcard"]], true).set("ai", function (button) {
					var name = button.link[2],
						player = _status.event.player;
					if (name == "sha") {
						return 0;
					}
					var cards = player.getCards("h", name);
					if (!cards.length) {
						return 0;
					}
					return get.value(cards, player);
				});
			}
			"step 2";
			player.markAuto("nsdingbian_ignore", [result.links[0][2]]);
		},
		subSkill: {
			mark: {
				onremove(player) {
					delete player.storage.nsdingbian_mark;
					delete player.storage.nsdingbian_ignore;
				},
				mod: {
					maxHandcard: (player, num) => num - player.countMark("nsdingbian_mark"),
					ignoredHandcard(card, player) {
						if (player.getStorage("nsdingbian_ignore").includes(get.name(card, player))) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && player.getStorage("nsdingbian_ignore").includes(get.name(card, player))) {
							return false;
						}
					},
				},
				intro: { content: "手牌上限-#" },
			},
		},
	},
	//李密
	nstuilun: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return (
				player.hp > 1 &&
				player.countCards("h") > 1 &&
				player.hasCard(function (card) {
					return lib.filter.cardDiscardable(card, player, "nstuilun");
				}, "h")
			);
		},
		prompt2: "失去任意点体力（至多失去至1点）并弃置任意张手牌（至多弃置至一张）。",
		check(event, player) {
			if (
				game.hasPlayer(function (current) {
					return current != player && current.hp >= player.hp;
				})
			) {
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			if (player.hp == 2) {
				event._result = { index: 0 };
			} else {
				var list = [];
				for (var i = 1; i < player.hp; i++) {
					list.push(i + "点");
				}
				player.chooseControl(list).set("prompt", "请选择失去体力的量");
			}
			"step 1";
			player.loseHp(1 + result.index);
			"step 2";
			if (
				player.countCards("h") > 1 &&
				player.hasCard(function (card) {
					return lib.filter.cardDiscardable(card, player, "nstuilun");
				}, "h")
			) {
				player.chooseToDiscard("h", true, [1, player.countCards("h") - 1]);
			} else {
				game.delayx();
			}
			"step 3";
			player.addTempSkill("nstuilun_effect", {
				player: "phaseBeginStart",
			});
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { global: "phaseBegin" },
				forced: true,
				popup: false,
				filter(event, player) {
					return player.hp < event.player.hp || (player.hp > 0 && player.countCards("h") < event.player.countCards("h"));
				},
				content() {
					"step 0";
					if (player.hp < trigger.player.hp) {
						player.chooseTarget("退论：是否令一名角色回复或失去1点体力？").set("ai", function (target) {
							var eff = get.effect(target, { name: "losehp" }, player, player);
							if (target.isDamaged()) {
								eff = Math.max(eff, get.recoverEffect(target, player, player));
							}
							return eff;
						});
					} else {
						event.goto(3);
					}
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("nstuilun_effect", target);
						if (target.isHealthy()) {
							event._result = { index: 1 };
						} else {
							player
								.chooseControl("回复1点体力", "失去1点体力")
								.set("prompt", "令" + get.translation(target) + "…")
								.set("ai", function () {
									var player = _status.event.player,
										target = _status.event.getParent().target;
									if (get.recoverEffect(target, player, player) >= get.effect(target, { name: "losehp" }, player, player)) {
										return 0;
									}
									return 1;
								});
						}
					} else {
						event.goto(3);
					}
					"step 2";
					if (result.index == 0) {
						target.recover();
					} else {
						target.loseHp();
					}
					"step 3";
					if (trigger.player.countCards("h") > player.countCards("h")) {
						var str = get.cnNumber(player.hp);
						player.chooseTarget("退论：是否令一名角色摸一张牌或弃置一张牌？").set("ai", function (target) {
							var player = _status.event.player;
							var att = get.attitude(player, target);
							if (att > 0 || target.countCards("he") == 0) {
								return get.effect(target, { name: "draw" }, player, player);
							}
							return get.effect(target, { name: "guohe_copy2" }, target, player);
						});
					} else {
						event.finish();
					}
					"step 4";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("nstuilun_effect", target);
						if (!target.countCards("he")) {
							event._result = { index: 0 };
						} else {
							player
								.chooseControl("摸一张牌", "弃置一张牌")
								.set("prompt", "令" + get.translation(target) + "…")
								.set("ai", function (player) {
									var evt = _status.event;
									return get.attitude(evt.player, evt.getParent().target) > 0 ? 0 : 1;
								});
						}
					} else {
						event.finish();
					}
					"step 5";
					if (result.index == 0) {
						target.draw();
					} else {
						target.chooseToDiscard("he", true);
					}
				},
			},
		},
	},
	//阮籍
	nsshizui: {
		trigger: { target: "useCardToTargeted" },
		usable: 1,
		filter(event, player) {
			var type = get.type(event.card, null, false);
			return (type == "basic" || type == "trick") && player.countCards("he") > 0 && player.hasUseTarget({ name: "jiu" }, null, true);
		},
		async cost(event, trigger, player) {
			var suit = get.suit(trigger.card),
				cards = trigger.cards.filterInD();
			var str = "弃置一张牌并视为使用一张【酒】";
			if (lib.suit.includes(suit)) {
				str += "；若弃置" + get.translation(suit) + "牌，则" + get.translation(trigger.card) + "对你无效";
			}
			if (cards.length) {
				str += "；若弃置♣牌则获得" + get.translation(cards);
			}
			str += "。";
			var next = player.chooseToDiscard("he", get.prompt(event.skill), str, "chooseonly");
			next.set("val1", cards.length ? get.value(cards, player) : 0);
			next.set("val2", -get.effect(player, trigger.card, trigger.player, player));
			next.set("suit", suit);
			next.set("ai", function (card) {
				var base = 2,
					suit = get.suit(card);
				if (suit == "club") {
					base += _status.event.val1;
				}
				if (suit == _status.event.suit) {
					base += _status.event.val2;
				}
				return base - get.value(card);
			});
			event.result = await next.forResult();
		},
		content() {
			"step 0";
			event.suit1 = get.suit(cards[0], player);
			player.discard(cards);
			player.chooseUseTarget("jiu", true);
			"step 1";
			var suit1 = event.suit1,
				suit2 = get.suit(trigger.card, false);
			if (suit1 == suit2 && lib.suit.includes(suit1)) {
				trigger.excluded.add(player);
			}
			if (suit1 == "club") {
				var cards = trigger.cards.filterInD();
				if (cards.length > 0) {
					player.gain(cards, "gain2");
				}
			}
		},
	},
	nsxiaoye: {
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return (
				player.hasHistory("useCard", function (evt) {
					return evt.card.name == "jiu";
				}) &&
				event.player.hasHistory("useCard", function (evt) {
					return (
						(evt.card.name == "sha" || get.type(evt.card) == "trick") &&
						player.hasUseTarget({
							name: evt.card.name,
							nature: evt.card.nature,
							isCard: true,
						})
					);
				})
			);
		},
		async cost(event, trigger, player) {
			const list = [];
			trigger.player.getHistory("useCard", function (evt) {
				if (evt.card.name != "sha" && get.type(evt.card) != "trick") {
					return;
				}
				if (evt.card.name == "sha" && evt.card.nature) {
					list.add("sha:" + evt.card.nature);
				} else {
					list.add(evt.card.name);
				}
			});
			for (let i = 0; i < list.length; i++) {
				if (list[i].indexOf("sha:") == 0) {
					list[i] = ["基本", "", "sha", list[i].slice(4)];
				} else {
					list[i] = [get.type(list[i]), "", list[i]];
				}
			}
			const { result } = await player
				.chooseButton([get.prompt(event.skill), [list, "vcard"]])
				.set("filterButton", function (button) {
					return player.hasUseTarget({
						name: button.link[2],
						nature: button.link[3],
						isCard: true,
					});
				})
				.set("ai", function (button) {
					return player.getUseValue({
						name: button.link[2],
						nature: button.link[3],
						isCard: true,
					});
				});
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: {
						card: {
							name: result.links[0][2],
							nature: result.links[0][3],
							isCard: true,
						},
					},
				};
			}
		},
		async content(event, trigger, player) {
			player.chooseUseTarget(true, event.cost_data.card);
		},
	},
	//臧洪
	nsshimeng: {
		enable: "phaseUse",
		usable: 1,
		selectTarget: [1, Infinity],
		filterTarget: true,
		contentBefore() {
			event.getParent()._nsshimeng_count = [0, 0];
		},
		content() {
			"step 0";
			if (!target.isIn()) {
				event.finish();
				return;
			}
			target
				.chooseToUse("使用一张【杀】，或摸一张牌", function (card, player) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.cardEnabled.apply(this, arguments);
				})
				.set("addCount", false);
			"step 1";
			if (result.bool) {
				event.getParent()._nsshimeng_count[0]++;
			} else {
				event.getParent()._nsshimeng_count[1]++;
				target.draw();
			}
		},
		contentAfter() {
			var list = event.getParent()._nsshimeng_count;
			if (list[0] < list[1]) {
				player.changeHujia(1);
				player.loseHp();
			}
		},
		ai: {
			order: 3.05,
			result: {
				player(player, target) {
					var att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					if (player.hp > 1 || player.countCards("hs", ["tao", "jiu"])) {
						return 1;
					}
					if (!ui.selected.targets.length) {
						if (target != player) {
							return 0;
						}
						if (player.hasSha()) {
							return 1;
						}
						return 0;
					}
					if (ui.selected.targets.length > 1 && !target.hasSha()) {
						return 0;
					}
					return 1;
				},
			},
		},
	},

	nsqiyue: {
		trigger: {
			global: ["turnOverEnd", "linkEnd", "showCharacterEnd", "hideCharacterEnd", "removeCharacterEnd"],
		},
		forced: true,
		content() {
			player.draw();
		},
	},
	nsxuezhu: {
		trigger: { player: "damageEnd", source: "damageSource" },
		filter(event, player) {
			return event.player.isIn();
		},
		logTarget: "player",
		content() {
			trigger.player.draw(2);
			trigger.player.turnOver();
		},
		check(event, player) {
			return !event.player.isTurnedOver() || get.attitude(player, event.player) > 0;
		},
	},
	noname_zhuyuan: {
		charlotte: true,
		enable: "phaseUse",
		position: "he",
		selectCard: 4,
		complexCard: true,
		prompt: "将四张花色各不同的牌交一名角色并令你与其获得【铁骑】和【激昂】直到各自回合结束",
		check(card) {
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name == "du") {
				return 20;
			}
			var player = get.owner(card);
			if (ui.selected.cards.length >= Math.max(2, player.countCards("h") - player.hp)) {
				return 0;
			}
			if (player.hp == player.maxHp || player.countCards("h") <= 1) {
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
						return 11 - get.value(card);
					}
				}
				if (player.countCards("h") > player.hp) {
					return 10 - get.value(card);
				}
				if (player.countCards("h") > 2) {
					return 6 - get.value(card);
				}
				return -1;
			}
			return 10 - get.value(card);
		},
		filterCard(card, player) {
			var suit = get.suit(card, player);
			for (var i = 0; i < ui.selected.cards.length; i++) {
				if (get.suit(ui.selected.cards[i], player) == suit) {
					return false;
				}
			}
			return true;
		},
		filter(event, player) {
			var suits = [];
			player.countCards("he", function (card) {
				if (suits.length < 4) {
					suits.add(get.suit(card, player));
				}
			});
			if (suits.length < 4) {
				return false;
			}
			var stat = player.getStat();
			if (!stat.noname_zhuyuan) {
				return true;
			}
			return game.hasPlayer(function (current) {
				return current != player && !stat.noname_zhuyuan.includes(current);
			});
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var stat = player.getStat();
			if (!stat.noname_zhuyuan) {
				return true;
			}
			return !stat.noname_zhuyuan.includes(target);
		},
		discard: false,
		lose: false,
		delay: false,
		derivation: ["noname_retieji", "noname_jiang"],
		content() {
			"step 0";
			var stat = player.getStat();
			if (!stat.noname_zhuyuan) {
				stat.noname_zhuyuan = [];
			}
			stat.noname_zhuyuan.push(target);
			player.give(cards, target, "visible");
			"step 1";
			game.log(player, "获得了技能", "#g【铁骑】");
			player.addTempSkill("noname_retieji", {
				player: "phaseAfter",
			});
			game.log(player, "获得了技能", "#g【激昂】");
			player.addTempSkill("noname_jiang", {
				player: "phaseAfter",
			});
			game.log(target, "获得了技能", "#g【铁骑】");
			target.addTempSkill("noname_retieji", {
				player: "phaseAfter",
			});
			game.log(target, "获得了技能", "#g【激昂】");
			target.addTempSkill("noname_jiang", {
				player: "phaseAfter",
			});
		},
		mod: {
			targetInRange(card, player) {
				var stat = player.getStat();
				if (stat.noname_zhuyuan) {
					return true;
				}
			},
			cardUsable(card, player) {
				var stat = player.getStat();
				if (!stat.noname_zhuyuan) {
					return Infinity;
				}
			},
		},
		ai: {
			order: 5,
			result: {
				target: 10,
			},
		},
	},
	noname_retieji: {
		inherit: "retieji",
		mark: true,
		marktext: "<img style=width:21px src=" + lib.assetURL + "image/character/noname_machao.png>",
		intro: {
			name: "小无·铁骑",
			content: "你使用【杀】指定一名角色为目标后，可以进行一次判定并令该角色的非锁定技失效直到回合结束，除非该角色弃置一张与判定结果花色相同的牌，否则不能使用【闪】抵消此【杀】。",
		},
	},
	noname_jiang: {
		inherit: "jiang",
		mark: true,
		marktext: "<img style=width:21px src=" + lib.assetURL + "image/character/noname_sunce.png>",
		intro: {
			name: "小无·激昂",
			content: "每当你使用（指定目标后）或被使用（成为目标后）一张【决斗】或红色的【杀】时，你可以摸一张牌。",
		},
	},
	noname_duocai: {
		charlotte: true,
		trigger: {
			global: ["loseAfter", "gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter", "cardsDiscardAfter"],
		},
		filter(event, player) {
			return game.hasPlayer2(i => i !== player && event.getd(i, "cards2").length);
		},
		direct: true,
		content() {
			"step 0";
			if (trigger.delay == false && player != game.me && !player.isOnline()) {
				game.delayx();
			}
			var cards = game
				.filterPlayer2(i => i !== player && trigger.getd(i, "cards2").length)
				.map(target => {
					return trigger.getd(target, "cards2");
				})
				.flat();
			player.chooseButton([get.prompt2("noname_duocai"), cards], [1, cards.length]).set("ai", but => get.value(but.link));
			"step 1";
			if (result.bool) {
				player.logSkill("noname_duocai");
				player.gain(result.links, "gain2");
				if (result.links.length > 2) {
					var filterTarget = function (card, player, target) {
						return target != player && target.countDiscardableCards(player, "hej") > 0;
					};
					if (
						game.hasPlayer(function (current) {
							return filterTarget(null, player, current);
						})
					) {
						player.chooseTarget("弃置一名其他角色区域内的一张牌", true, filterTarget).set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, { name: "guohe" }, player, player);
						});
					} else {
						event.finish();
					}
				} else {
					if (result.links.length == 2) {
						player.draw();
					} else {
						player.recover();
					}
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				player.discardPlayerCard(target, "hej", true);
			}
		},
	},
	nsbizhao: {
		trigger: { player: "showCharacterAfter" },
		forced: true,
		hiddenSkill: true,
		filter(event, player) {
			return (
				event.toShow?.some(name => {
					return get.character(name, 3).includes("nsbizhao");
				}) && player != _status.currentPhase
			);
		},
		async content(event, trigger, player) {
			player.addTempSkill(event.name + "_effect", { player: "phaseBeginStart" });
			player.addMark(event.name + "_effect", 1, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "其他角色至自己的距离+#" },
				mod: {
					globalTo(source, player, distance) {
						return distance + player.countMark("nsbizhao_effect");
					},
				},
			},
		},
	},
	nsqingde: {
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		usable: 1,
		filter(event, player) {
			if (!event.card || !event.cards || event.player == event.source || (event.card.name != "sha" && get.type(event.card) != "trick") || event.cards.filterInD().length != 1) {
				return false;
			}
			var target = lib.skill.nsqingde.logTarget(event, player);
			if (player.hasSkillTag("noCompareSource") || target.hasSkillTag("noCompareTarget")) {
				return false;
			}
			return target.countCards("h") > 0;
		},
		logTarget(event, player) {
			if (player == event.source) {
				return event.player;
			}
			return event.source;
		},
		check(event, player) {
			var target = lib.skill.nsqingde.logTarget(event, player);
			return get.attitude(player, target) <= 0;
		},
		content() {
			"step 0";
			var target = lib.skill.nsqingde.logTarget(trigger, player);
			event.target = target;
			var next = player.chooseToCompare(target);
			if (event.triggername == "damageSource") {
				next.set("small", true);
			}
			if (!next.fixedResult) {
				next.fixedResult = {};
			}
			next.fixedResult[player.playerid] = trigger.cards.filterInD()[0];
			"step 1";
			if (result.tie) {
				event.finish();
				return;
			}
			var i = result.bool;
			if (event.triggername == "damageSource") {
				i = !i;
			}
			event.target2 = i ? player : target;
			if (event.triggername == "damageSource") {
				event.goto(3);
			} else if (event.target2.isDamaged()) {
				player.chooseBool("是否令" + get.translation(event.target2) + "回复1点体力？").set("ai", function () {
					var evt = _status.event.getParent();
					return get.attitude(evt.player, evt.target2) > 0;
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.target2.recover();
			}
			event.finish();
			"step 3";
			player.chooseBool("是否令" + get.translation(event.target2) + "摸两张牌？").set("ai", function () {
				var evt = _status.event.getParent();
				return get.attitude(evt.player, evt.target2) > 0;
			});
			"step 4";
			if (result.bool) {
				event.target2.draw(2);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (target.storage.counttrigger && target.storage.counttrigger.nsqingde) {
						return;
					}
					var num = get.number(card);
					if (typeof num == "number") {
						if (target.hasSkillTag("noCompareSource") || player.hasSkillTag("noCompareTarget")) {
							return;
						}
						var hs = player.getCards("h");
						if (card.cards) {
							hs.removeArray(card.cards);
						}
						if (ui.selected.cards) {
							hs.removeArray(ui.selected.cards);
						}
						if (!hs.length) {
							return;
						}
						for (var i of hs) {
							if (get.number(i) >= num) {
								return;
							}
							if (player.hasSkill("tianbian") && get.suit(card) == "heart") {
								return;
							}
						}
						return "zerotarget";
					}
				},
			},
		},
	},
	nsyidi: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		filterTarget: lib.filter.notMe,
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			var player = _status.event.player;
			if (get.type(card) == "basic") {
				if (
					game.hasPlayer(function (current) {
						return get.attitude(current, player) > 0 && current.getUseValue(card) > player.getUseValue(card, null, true);
					})
				) {
					return 5 + Math.random();
				}
				return 0;
			}
			if (
				game.hasPlayer(function (current) {
					return get.attitude(current, player) > 0 && !current.hasJudge("lebu") && current.getUseValue(card) > player.getUseValue(card);
				})
			) {
				return 4.7 + Math.random();
			}
			if (
				card.name == "wuxie" &&
				game.hasPlayer(function (current) {
					return get.attitude(current, player) > 0;
				})
			) {
				return 5 + Math.random();
			}
			return 4 - get.value(card);
		},
		content() {
			"step 0";
			player.give(cards, target, "visible");
			if (get.type(cards[0], player) != "basic") {
				player.draw();
				event.finish();
			}
			"step 1";
			if (target.getCards("h").includes(cards[0]) && target.hasUseTarget(cards[0])) {
				target.chooseUseTarget(cards[0]);
			}
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					if (!ui.selected.cards.length || get.type(ui.selected.cards[0], player) == "basic") {
						return 0;
					}
					if (get.value(ui.selected.cards[0]) < 4) {
						return 2;
					}
					return 0.5;
				},
				target: 1,
			},
		},
	},
	nsfuzhou: {
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			if (!player.storage.nstaiping && player.getStat("skill").nsfuzhou) {
				return false;
			}
			return player.countCards("he", { color: "black" }) > 0;
		},
		filterCard: { color: "black" },
		filterTarget(card, player, target) {
			return !target.hasJudge("nsfuzhou_card");
		},
		check(card) {
			return 8 - get.value(card);
		},
		prepare: "give",
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			target.addJudge({ name: "nsfuzhou_card" }, cards[0]);
			cards[0].storage.nsfuzhou_source = player;
			"step 1";
			game.delayx();
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (player.storage.nsfuzhou_draw) {
						if (
							get.attitude(player, target) > 0 &&
							player.countCards("he", function (card) {
								return get.color(card) == "red";
							})
						) {
							return 1;
						}
						return 0;
					}
					if (player.storage.nsfuzhou_damage) {
						return -2;
					}
					return -1.5;
				},
			},
		},
	},
	nsfuzhou_num: {
		charlotte: true,
		onremove: true,
		mod: {
			maxHandcard(player, num) {
				return num + player.storage.nsfuzhou_num;
			},
		},
		intro: {
			content(num) {
				return "手牌上限" + (num < 0 ? "" : "+") + num;
			},
		},
	},
	nsguidao: {
		trigger: { global: "judge" },
		filter(event, player) {
			return (
				player.countCards("hes", function (card) {
					if (player.storage.nstaiping || (_status.connectMode && get.position(card) != "e")) {
						return true;
					}
					return get.color(card) == "black";
				}) > 0
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("nsguidao"), "hes", function (card, player) {
					if (!player.storage.nstaiping && get.color(card) != "black") {
						return false;
					}
					var player = _status.event.player;
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				})
				.set("ai", function (card) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					var judging = _status.event.judging;
					var result = trigger.judge(card) - trigger.judge(judging);
					var attitude = get.attitude(player, trigger.player);
					let val = get.value(card);
					if (get.subtype(card) == "equip2") {
						val /= 2;
					} else {
						val /= 6;
					}
					if (attitude == 0 || result == 0) {
						return 0;
					}
					if (attitude > 0) {
						return result - val;
					}
					return -result - val;
				})
				.set("judging", trigger.player.judging[0]);
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "highlight", "nsguidao", "noOrdering");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.$gain2(trigger.player.judging[0]);
				player.gain(trigger.player.judging[0]);
				trigger.player.judging[0] = result.cards[0];
				trigger.orderingCards.addArray(result.cards);
				game.log(trigger.player, "的判定牌改为", result.cards[0]);
			}
			"step 3";
			game.delay(2);
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	nstaiping: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return (
				player.getAllHistory("sourceDamage", function (evt) {
					return evt.getParent().name == "nsfuzhou_card";
				}).length > 1 ||
				player.getAllHistory("gain", function (evt) {
					return evt.getParent(2).name == "nsfuzhou_card";
				}).length > 1
			);
		},
		content() {
			player.awakenSkill(event.name);
			player.storage.nstaiping = true;
			if (
				player.getAllHistory("sourceDamage", function (evt) {
					return evt.getParent().name == "nsfuzhou_card";
				}).length > 1
			) {
				player.storage.nsfuzhou_damage = true;
			}
			if (
				player.getAllHistory("gain", function (evt) {
					return evt.getParent(2).name == "nsfuzhou_card";
				}).length > 1
			) {
				player.storage.nsfuzhou_draw = true;
			}
		},
		ai: {
			combo: "nsfuzhou",
		},
		derivation: ["nsfuzhou_damage", "nsfuzhou_draw"],
	},
	nsweiyuan: {
		trigger: { player: "useCardToTargeted" },
		direct: true,
		filter(event, player) {
			return (
				player != event.target &&
				event.targets &&
				event.targets.length == 1 &&
				event.target.isIn() &&
				player.isPhaseUsing() &&
				!player.hasSkill("nsweiyuan2") &&
				game.hasPlayer(function (current) {
					return current != player && current != event.target;
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("nsweiyuan"), function (card, player, target) {
					return target != player && target != _status.event.getTrigger().target;
				})
				.set("ai", function (target) {
					return Math.max(Math.random(), get.attitude(player, target));
				});
			"step 1";
			if (result.bool) {
				player.addTempSkill("nsweiyuan2", "phaseUseAfter");
				var target = result.targets[0];
				event.target = target;
				player.logSkill("nsweiyuan", target);
				target
					.chooseCard("he", "交给" + get.translation(trigger.target) + "一张牌并受到1点伤害，或令" + get.translation(player) + "摸一张牌且可以重复使用牌")
					.set("ai", function (card) {
						if (_status.event.goon) {
							return Math.random();
						}
						return 0;
					})
					.set(
						"goon",
						(function () {
							if (get.attitude(target, player) > 0) {
								return false;
							}
							return Math.random() > 0.5;
						})()
					);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				target.gain(result.cards, trigger.target);
				target.damage();
			} else {
				player.addTempSkill("nsweiyuan_use");
				player.draw();
			}
		},
	},
	nsweiyuan2: { charlotte: true },
	nsweiyuan_use_backup: {},
	nsweiyuan_use: {
		enable: "phaseUse",
		charlotte: true,
		sourceSkill: "nsweiyuan",
		mod: {
			cardUsable() {
				if (_status.event.skill == "nsweiyuan_use_backup") {
					return Infinity;
				}
			},
			targetInRange() {
				if (_status.event.skill == "nsweiyuan_use_backup") {
					return true;
				}
			},
		},
		onChooseToUse(event) {
			if (game.online || event.type != "phase") {
				return;
			}
			var list = [];
			event.player.getHistory("useCard", function (evt) {
				var name = evt.card.name;
				var type = get.type(name);
				if (type != "basic" && type != "trick") {
					return;
				}
				if (name == "sha") {
					var nature = evt.card.nature;
					switch (nature) {
						case "fire":
							name = "huosha";
							break;
						case "thunder":
							name = "leisha";
							break;
						case "kami":
							name = "kamisha";
							break;
						case "ice":
							name = "icesha";
							break;
					}
				}
				list.add(type + "咕咕" + name);
			});
			event.set("nsweiyuan_list", list);
		},
		filter(event, player) {
			return player.countCards("h") > 0 && event.nsweiyuan_list && event.nsweiyuan_list.length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("围援", [
					event.nsweiyuan_list.map(function (i) {
						return i.split("咕");
					}),
					"vcard",
				]);
			},
			filter(button, player) {
				return lib.filter.cardEnabled(
					{
						name: button.link[2],
						nature: button.link[3],
					},
					player
				);
			},
			check(button) {
				return _status.event.player.getUseValue(
					{
						name: button.link[2],
						nature: button.link[3],
					},
					false
				);
			},
			backup(links, player) {
				return {
					popname: true,
					position: "h",
					filterCard: true,
					ai1(card) {
						return 7 - get.value(card);
					},
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					onuse(links, player) {
						player.removeSkill("nsweiyuan_use");
					},
				};
			},
			prompt(links, player) {
				return "将一张手牌当做" + get.translation(links[0][3] || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	nsjuxian: {
		trigger: { player: "damageBegin2" },
		filter(event, player) {
			return !player.hasSkill("nsjuxian2");
		},
		check(event, player) {
			if (player.countCards("h") + 2 >= player.maxHp) {
				return !event.source || !event.source.countCards("he") || get.attitude(player, event.source) > 0;
			}
			return true;
		},
		content() {
			"step 0";
			player.addSkill("nsjuxian2");
			player.draw(2);
			"step 1";
			var target = trigger.source;
			if (player.countCards("h") >= player.maxHp && target && target.countCards("he")) {
				player.line(target, "green");
				target.chooseToDiscard("he", true);
			}
		},
	},
	nsjuxian2: {
		trigger: { player: "phaseDrawBefore" },
		forced: true,
		charlotte: true,
		sourceSkill: "nsjuxian",
		content() {
			player.removeSkill("nsjuxian2");
			trigger.cancel();
			game.log(player, "跳过了", "#y摸牌阶段");
		},
	},
	nsdiewu: {
		trigger: {
			player: ["damageEnd", "gainAfter"],
			global: "loseAsyncAfter",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name != "damage") {
				return event.getg(player).length > 1;
			}
			return true;
		},
		content() {
			player.addMark("nsdiewu", 1);
		},
		intro: {
			content: "mark",
		},
		group: ["nsdiewu_sha", "nsdiewu_shan", "nsdiewu_draw"],
		subSkill: {
			sha: {
				enable: "chooseToUse",
				viewAs: { name: "sha", isCard: true },
				prompt: "视为使用一张【杀】",
				viewAsFilter(player) {
					return player.countMark("nsdiewu") > 0;
				},
				filterCard: () => false,
				selectCard: -1,
				onuse(links, player) {
					player.removeMark("nsdiewu", 1);
				},
				ai: {
					order() {
						var player = _status.event.player;
						if (!player.storage.nspojian && player.countMark("nsdiewu") <= player.hp) {
							return 0;
						}
						return get.order({ name: "sha" }) + 0.1;
					},
				},
			},
			shan: {
				enable: "chooseToUse",
				viewAs: { name: "shan", isCard: true },
				viewAsFilter(player) {
					return player.countMark("nsdiewu") > 0 && !player.storage.nspojian;
				},
				filterCard: () => false,
				selectCard: -1,
				onuse(links, player) {
					player.removeMark("nsdiewu", 1);
				},
				ai: {
					order() {
						var player = _status.event.player;
						if (player.hp > 1 && player.countMark("nsdiewu") <= player.hp) {
							return 0;
						}
						return get.order({ name: "shan" }) - 0.2;
					},
				},
			},
			draw: {
				trigger: { source: "damageEnd" },
				forced: true,
				popup: false,
				filter(event, player) {
					var evt = event.getParent();
					return evt && evt.type == "card" && evt.skill == "nsdiewu_sha";
				},
				content() {
					player.draw();
				},
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				if (tag == "respondShan" && player.storage.nspojian) {
					return false;
				}
				return player.countMark("nsdiewu") > 0;
			},
		},
	},
	nslingying: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + 1;
				}
			},
			targetInRange(card) {
				if (card.name == "sha") {
					return true;
				}
			},
		},
	},
	nspojian: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "fire",
		filter(event, player) {
			return player.countMark("nsdiewu") >= player.hp;
		},
		content() {
			player.awakenSkill(event.name);
			player.storage.nspojian = true;
			player.loseMaxHp();
			player.draw(2);
			player.addSkill("nsliegong");
		},
		derivation: "nsliegong",
		ai: {
			combo: "nsdiewu",
		},
	},
	nsliegong: {
		inherit: "xinliegong",
	},
	nsguolie: {
		trigger: { player: "phaseDrawBefore" },
		check(event, player) {
			var h1 = player.getUseValue({ name: "sha" }, false);
			var h2 = player.getUseValue({ name: "guohe" });
			return (
				player.countCards("h", function (card) {
					if (get.color(card) == "red") {
						return h1 > 0;
					}
					return h2 > 0;
				}) > 2
			);
		},
		content() {
			trigger.cancel();
			player.addTempSkill("nsguolie2");
		},
	},
	nsguolie2: {
		mod: {
			cardname(card, player) {
				var color = get.color(card, player);
				if (color == "red") {
					return "sha";
				}
				if (color == "black") {
					return "guohe";
				}
			},
			cardnature() {
				return false;
			},
			cardUsable() {
				return Infinity;
			},
			targetInRange() {
				return true;
			},
		},
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		sourceSkill: "nsguolie",
		filter(event, player) {
			var cards = [];
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.player == player) {
					return;
				}
				for (var i of evt.cards) {
					if (get.position(i, true) == "d") {
						cards.push(i);
					}
				}
			});
			return cards.length > 0;
		},
		content() {
			var cards = [];
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.player == player) {
					return;
				}
				if (evt.name == "cardsDiscard" && evt.parent.name == "orderingDiscard") {
					return;
				}
				for (var i of evt.cards) {
					if (get.position(i, true) == "d") {
						cards.push(i);
					}
				}
			});
			player.gain(cards, "gain2");
		},
	},
	nslongyue: {
		init: () => {
			game.addGlobalSkill("nslongyue_ai");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("nslongyue", null, null, false), true)) {
				game.removeGlobalSkill("nslongyue_ai");
			}
		},
		trigger: { global: "useCard" },
		filter(event, player) {
			return get.type(event.card, "trick") == "trick" && event.player.getHistory("useCard").indexOf(event) == 0;
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			trigger.player.draw();
		},
		ai: {
			expose: 0.2,
		},
	},
	nslongyue_ai: {
		mod: {
			aiOrder(player, card, num) {
				if (
					!player.getHistory("useCard").length &&
					get.type(card) == "trick" &&
					game.hasPlayer(function (current) {
						return current.hasSkill("nslongyue") && get.attitude(player, current) >= 0;
					})
				) {
					return num + 6;
				}
			},
		},
		trigger: { player: "dieAfter" },
		filter: () => {
			return !game.hasPlayer(i => i.hasSkill("nslongyue", null, null, false), true);
		},
		silent: true,
		forceDie: true,
		content: () => {
			game.removeGlobalSkill("nslongyue_ai");
		},
	},
	nszhenyin: {
		trigger: { global: "judge" },
		usable: 1,
		filter(event, player) {
			return _status.currentPhase && _status.currentPhase.countCards("h") > 0;
		},
		logTarget() {
			return _status.currentPhase;
		},
		check(event, player) {
			var target = _status.currentPhase;
			var judge = event.judge(event.player.judging[0]);
			var max = 0;
			var hs = target.getCards("h", function (card) {
				var mod2 = game.checkMod(card, target, "unchanged", "cardEnabled2", target);
				if (mod2 != "unchanged") {
					return mod2;
				}
				var mod = game.checkMod(card, target, "unchanged", "cardRespondable", target);
				if (mod != "unchanged") {
					return mod;
				}
				return true;
			});
			for (var i of hs) {
				var num = event.judge(i) - judge;
				if (num > max) {
					max = num;
				}
			}
			var att = get.attitude(player, target);
			if (att > 0) {
				return max > 0;
			}
			if (att < 0) {
				return max <= 0;
			}
			return false;
		},
		content() {
			"step 0";
			if (
				!_status.currentPhase.countCards("h", function (card) {
					var player = _status.currentPhase;
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				})
			) {
				event.finish();
				return;
			}
			_status.currentPhase
				.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，请打出一张手牌进行改判", "h", true, function (card) {
					var player = _status.event.player;
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				})
				.set("ai", function (card) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					var judging = _status.event.judging;
					var result = trigger.judge(card) - trigger.judge(judging);
					var attitude = get.attitude(player, trigger.player);
					if (attitude == 0 || result == 0) {
						return 0;
					}
					if (attitude > 0) {
						return result / Math.max(0.1, get.value(card));
					} else {
						return -result / Math.max(0.1, get.value(card));
					}
				})
				.set("judging", trigger.player.judging[0]);
			"step 1";
			if (result.bool) {
				_status.currentPhase.respond(result.cards, "highlight").nopopup = true;
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				if (trigger.player.judging[0].clone) {
					trigger.player.judging[0].clone.classList.remove("thrownhighlight");
					game.broadcast(function (card) {
						if (card.clone) {
							card.clone.classList.remove("thrownhighlight");
						}
					}, trigger.player.judging[0]);
					game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
				}
				game.cardsDiscard(trigger.player.judging[0]);
				trigger.player.judging[0] = result.cards[0];
				trigger.orderingCards.addArray(result.cards);
				game.log(trigger.player, "的判定牌改为", result.cards[0]);
				game.delay(2);
			}
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	nsxianhai: {
		trigger: { global: "damageSource" },
		filter(event, player) {
			return event.source && event.source != player && event.source.isIn() && event.source == _status.currentPhase && (event.source.getStat("damage") || 0) > (player.getLastStat("damage") || 0) && !player.hasSkill("nsxianhai_round");
		},
		check(event, player) {
			return player.maxHp > 1 && get.attitude(player, event.source) < -4;
		},
		logTarget: "source",
		content() {
			"step 0";
			player.addTempSkill("nsxianhai_round", "roundStart");
			player.loseMaxHp();
			var list = [];
			for (var i = 1; i < 6; i++) {
				if (trigger.source.hasEnabledSlot(i)) {
					list.add("equip" + (i == 3 || i == 4 ? "3_4" : i));
				}
			}
			if (list.length) {
				player
					.chooseControl(list)
					.set("prompt", "选择废除" + get.translation(trigger.source) + "的一种装备栏")
					.set("ai", function () {
						var target = _status.event.getTrigger().source;
						if (list.includes("equip6") && target.getEquip("equip3") && target.getEquip("equip4")) {
							return "equip6";
						}
						if (list.includes("equip2") && target.getEquip(2) && get.value(target.getEquip(2), target) > 0) {
							return "equip2";
						}
						if (list.includes("equip5") && target.getEquip(5) && get.value(target.getEquip(5), target) > 0) {
							return "equip5";
						}
						return 0;
					});
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.control != "equip3_4") {
				trigger.source.disableEquip(result.control);
			} else {
				trigger.source.disableEquip(3, 4);
			}
			"step 2";
			if (player.awakenedSkills.includes("nsxingchu")) {
				var next = game.createEvent("nsxianhai_clear");
				event.next.remove(next);
				event.getParent("phase").after.push(next);
				next.player = player;
				next.setContent(function () {
					player.restoreSkill("nsxingchu");
				});
			}
			"step 3";
			if (trigger.source) {
				var hs = trigger.source.getCards("h", "shan");
				if (hs.length) {
					trigger.source.discard(hs);
				}
			}
		},
	},
	nsxianhai_round: { charlotte: true },
	nsxingchu: {
		trigger: { global: "die" },
		forceDie: true,
		filter(event, player) {
			return player == event.player || player == event.source;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("nsxingchu"))
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				})
				.set("forceDie", true);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("nsxingchu", target);
				player.awakenSkill(event.name);
				var he = trigger.player.getCards("he");
				if (he.length) {
					target.gain(he, trigger.player, "giveAuto", "bySelf");
				}
				target.gainMaxHp();
			}
		},
	},
	nsshengyan: {
		trigger: { player: "judgeEnd" },
		forced: true,
		filter(event, player) {
			const { currentPhase } = _status;
			return currentPhase?.isIn() && !player.getStorage("nsshengyan_record").includes(event.result.suit);
		},
		logTarget: () => _status.currentPhase,
		async content(event, trigger, player) {
			const record = event.name + "_record";
			player.addTempSkill(record);
			player.markAuto(record, [trigger.result.suit]);
			player.storage[record].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
			player.addTip(record, get.translation(record) + player.getStorage(record).reduce((str, suit) => str + get.translation(suit), ""));
			const { currentPhase } = _status;
			if (!currentPhase.isIn()) {
				return;
			}
			currentPhase.addTempSkill(event.name + "_effect");
			currentPhase.addMark(event.name + "_effect", 2, false);
		},
		subSkill: {
			record: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				intro: { content: "本回合已判定花色：$" },
			},
			effect: {
				charlotte: true,
				onremove: true,
				markimage: "image/card/handcard.png",
				intro: { content: "手牌上限+#" },
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("nsshengyan_effect");
					},
				},
				marktext: "筵",
			},
		},
	},
	nsdaizhan: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return ["lebu", "bingliang"].some(name => player.hasCard(card => player.canAddJudge({ name: name, cards: [card] }) && (_status.connectMode || get.type2(card) != "trick"), "he"));
		},
		async cost(event, trigger, player) {
			const list = ["lebu", "bingliang"].filter(name => player.hasCard(card => player.canAddJudge({ name: name, cards: [card] }) && get.type2(card) != "trick", "he"));
			const { result } = await player.chooseButton([get.prompt2(event.skill), [list.map(name => [get.type(name), "", name]), "vcard"]]).set("ai", button => {
				const player = get.player();
				if (button.link[2] == "lebu") {
					return 0;
				}
				const delta = player.getHandcardLimit() + player.countCards("j") * 2 + 2 - player.hp;
				if (delta >= 2) {
					return 1 + Math.random();
				}
				if (delta >= 0 && !player.countCards("h", card => player.hasValueTarget(card))) {
					return Math.random();
				}
				return 0;
			});
			event.result = {
				bool: result?.bool,
				cost_data: result?.links,
				skill_popup: false,
			};
		},
		async content(event, trigger, player) {
			const { cost_data: links } = event;
			const card = { name: links[0][2] };
			game.broadcastAll(card => {
				lib.skill.nsdaizhan_backup.viewAs = card;
			}, card);
			const next = player.chooseToUse();
			next.set("openskilldialog", "怠战：是否将一张非锦囊牌当做" + get.translation(card) + "对自己使用？");
			next.set("norestore", true);
			next.set("addCount", false);
			next.set("_backupevent", "nsdaizhan_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("nsdaizhan_backup");
			await next;
		},
		subSkill: {
			backup: {
				filterCard(card, player) {
					return (
						get.itemtype(card) == "card" &&
						get.type2(card) != "trick" &&
						player.canAddJudge({
							name: lib.skill.nsdaizhan_backup.viewAs.name,
							cards: [card],
						})
					);
				},
				filterTarget(card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				check(card) {
					return 8 - get.value(card);
				},
				position: "he",
				async precontent(event, trigger, player) {
					player.addTempSkill("nsdaizhan_effect");
				},
				ai: { result: { target: 1 } },
			},
			effect: {
				charlotte: true,
				trigger: { player: "phaseEnd" },
				forced: true,
				popup: false,
				filter(event, player) {
					return player.countCards("h") < player.getHandcardLimit();
				},
				async content(event, trigger, player) {
					await player.drawTo(player.getHandcardLimit());
				},
				ai: { nowuxie_judge: true },
			},
		},
	},
	nsjiquan: {
		trigger: {
			global: ["damageEnd", "damageSource"],
		},
		direct: true,
		filter(event, player, name) {
			var target = name == "damageSource" ? event.source : event.player;
			return target && target != player && get.distance(player, target) <= 1 && target.countCards("hej") > 0;
		},
		locked(skill, player) {
			return player && player.storage.nsfuwei;
		},
		content() {
			"step 0";
			var target = event.triggername == "damageSource" ? trigger.source : trigger.player;
			event.target = target;
			player.choosePlayerCard(target, "hej", player.storage.nsfuwei ? true : 1).set("ai", function (button) {
				var val = get.buttonValue(button);
				if (get.attitude(_status.event.player, get.owner(button.link)) > 0) {
					return -val;
				}
				return val;
			});
			"step 1";
			if (result.bool) {
				player.logSkill("nsjiquan", target);
				player.addToExpansion(result.cards, target, "give").gaintag.add("nsjiquan_mark");
			} else {
				event.finish();
			}
			"step 2";
			game.delayx();
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + player.getExpansions("nsjiquan_mark").length;
				}
			},
		},
	},
	nsjiquan_mark: {
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		marktext: "威",
	},
	nsfuwei: {
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.getExpansions("nsjiquan_mark").length > 4;
		},
		content() {
			player.awakenSkill(event.name);
			player.addSkill("nsdiemou");
			player.addSkill("nszhihuang");
			player.gainMaxHp(2);
		},
		derivation: ["nsdiemou", "nszhihuang"],
		ai: { combo: "nsjiquan" },
	},
	nsdiemou: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		filter(event, player) {
			return player.getExpansions("nsjiquan_mark").length > game.players.length;
		},
		content() {
			var cards = player.getExpansions("nsjiquan_mark");
			player.draw(cards.length);
			player.loseMaxHp();
			player.loseToDiscardpile(cards);
			if (cards.length > 4) {
				player.turnOver();
			}
		},
		ai: {
			combo: "nsjiquan",
		},
	},
	nszhihuang: {
		available(mode) {
			return mode == "identity" || (mode == "versus" && (_status.mode == "four" || _status.mode == "guandu")) || mode == "guozhan";
		},
		group: "nszhihuang_damage",
		trigger: { global: "useCard" },
		usable: 1,
		filter(event, player) {
			return event.player == get.zhu(player) && player.getExpansions("nsjiquan_mark").length > 0 && event.cards && event.cards.filterInD().length > 0;
		},
		prompt2(event) {
			return "移去一张“威”并获得" + get.translation(event.cards.filterInD());
		},
		check(event, player) {
			if (["equip", "delay"].includes(get.type(event.card))) {
				return get.attitude(player, event.player) < 0;
			}
			return get.value(event.cards.filterInD()) > 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			var cards = player.getExpansions("nsjiquan_mark");
			if (cards.length == 1) {
				event._result = {
					bool: true,
					links: cards.slice(0),
				};
			} else {
				player.chooseButton(["选择移去一张“威”", cards], true);
			}
			"step 1";
			player.loseToDiscardpile(result.links);
			player.gain(trigger.cards.filterInD(), "gain2", "log");
		},
		ai: {
			combo: "nsjiquan",
		},
	},
	nszhihuang_damage: {
		trigger: { source: "damageBegin1" },
		forced: true,
		sourceSkill: "nszhihuang",
		filter(event, player) {
			var zhu = get.zhu(player);
			return zhu && player.countCards("h") > zhu.countCards("h") && event.getParent().type == "card";
		},
		content() {
			trigger.num++;
		},
	},
	//OL神张角
	junksijun: {
		audio: "sijun",
		inherit: "sijun",
		check(event, player) {
			return ui.cardPile.childNodes.length;
		},
		async content(event, trigger, player) {
			player.removeMark("yizhao", player.countMark("yizhao"));
			const pile = Array.from(ui.cardPile.childNodes);
			if (pile.length) {
				const max = Math.pow(2, Math.min(100, pile.length));
				let bool = false,
					index,
					cards = [];
				for (let i = 0; i < max; i++) {
					let num = 0;
					index = i.toString(2);
					while (index.length < pile.length) {
						index = "0" + index;
					}
					for (var k = 0; k < index.length; k++) {
						if (index[k] == "1") {
							num += get.number(pile[k]);
						}
						if (num > 36) {
							break;
						}
					}
					if (num == 36) {
						bool = true;
						break;
					}
				}
				if (bool) {
					for (let k = 0; k < index.length; k++) {
						if (index[k] == "1") {
							cards.push(pile[k]);
						}
					}
					await player.gain(cards, "gain2");
				} else {
					let total = 0;
					for (const card of pile) {
						total += get.number(card);
						cards.push(card);
						if (total >= 36) {
							break;
						}
					}
				}
				if (cards.length) {
					await player.gain(cards, "gain2");
				}
			}
		},
	},
	//手杀削弱版许攸
	junkshicai: {
		audio: "nzry_shicai_2",
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!event.cards.filterInD("oe").length) {
				return false;
			}
			return player.getHistory("useCard", evt => get.type2(evt.card) == get.type2(event.card)).indexOf(event) == 0;
		},
		prompt2(event, player) {
			const cards = event.cards.filterInD("oe");
			return "你可以将" + get.translation(cards) + (cards.length > 1 ? "以任意顺序" : "") + "置于牌堆顶，然后摸一张牌";
		},
		content() {
			"step 0";
			event.cards = trigger.cards.filterInD("oe");
			var lose_list = [];
			event.cards.forEach(card => {
				var owner = get.owner(card);
				if (owner) {
					var arr = lose_list.find(i => i[0] == owner);
					if (arr) {
						arr[1].push(card);
					} else {
						lose_list.push([owner, [card]]);
					}
				}
			});
			if (lose_list.length) {
				game.loseAsync({
					lose_list: lose_list,
				}).setContent("chooseToCompareLose");
			}
			"step 1";
			if (cards.length > 1) {
				var next = player.chooseToMove("恃才：将牌按顺序置于牌堆顶");
				next.set("list", [["牌堆顶", cards]]);
				next.set("reverse", _status.currentPhase?.next ? get.attitude(player, _status.currentPhase.next) > 0 : false);
				next.set("processAI", function (list) {
					var cards = list[0][1].slice(0);
					cards.sort(function (a, b) {
						return (_status.event.reverse ? 1 : -1) * (get.value(b) - get.value(a));
					});
					return [cards];
				});
			}
			"step 2";
			if (result.bool && result.moved && result.moved[0].length) {
				cards = result.moved[0].slice(0);
			}
			cards.reverse();
			game.cardsGotoPile(cards, "insert");
			game.log(player, "将", cards, "置于了牌堆顶");
			player.draw();
		},
		ai: {
			reverseOrder: true,
			skillTagFilter(player) {
				if (
					player.getHistory("useCard", function (evt) {
						return get.type(evt.card) == "equip";
					}).length > 0
				) {
					return false;
				}
			},
		},
	},
	//削弱版段煨
	junklangmie: {
		audio: "langmie",
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			if (player == event.player || player.countCards("he") == 0) {
				return false;
			}
			var num = 0;
			if (
				event.player.hasHistory("sourceDamage", function (evt) {
					num += evt.num;
					return num >= 2;
				})
			) {
				return true;
			}
			var map = {};
			return event.player.hasHistory("useCard", function (i) {
				var name = get.type2(i.card, false);
				if (!map[name]) {
					map[name] = true;
					return false;
				}
				return true;
			});
		},
		content() {
			"step 0";
			var list = [],
				num = 0,
				target = trigger.player;
			event.target = target;
			event.choices = [];
			var map = {};
			if (
				target.hasHistory("useCard", function (i) {
					var name = get.type2(i.card, false);
					if (!map[name]) {
						map[name] = true;
						return false;
					}
					return true;
				})
			) {
				list.push("弃置一张牌，然后摸两张牌");
				event.choices.push("draw");
			}
			if (
				target.hasHistory("sourceDamage", function (evt) {
					num += evt.num;
					return num >= 2;
				})
			) {
				list.push("弃置一张牌，对" + get.translation(target) + "造成1点伤害");
				event.choices.push("damage");
			}
			player
				.chooseControl("cancel2")
				.set("choiceList", list)
				.set("ai", function () {
					var player = _status.event.player;
					var choices = _status.event.getParent().choices.slice(0);
					choices.push("cancel");
					choicex = choices.slice(0);
					var getx = function (a) {
						switch (a) {
							case "draw":
								return 2 * get.effect(player, { name: "draw" }, player, player);
							case "damage":
								return get.damageEffect(_status.event.getParent().target, player, player);
							default:
								return 0;
						}
					};
					choices.sort(function (a, b) {
						return getx(b) - getx(a);
					});
					return choicex.indexOf(choices[0]);
				})
				.set("prompt", get.prompt("junklangmie", target));
			"step 1";
			if (result.control == "cancel2") {
				event.finish();
			} else {
				event.choice = event.choices[result.index];
				player.chooseToDiscard("he").set("ai", card => 7 - get.value(card)).logSkill = event.choice == "draw" ? "junklangmie" : ["junklangmie", target];
			}
			"step 2";
			if (result.bool) {
				if (event.choice == "draw") {
					player.draw(2);
				} else {
					target.damage();
				}
			}
		},
	},
	//李典光速通渠传说
	junkwangxi: {
		audio: "wangxi",
		inherit: "wangxi",
		async content(event, trigger, player) {
			const target = get.info(event.name).logTarget(trigger, player);
			const { result } = await player.draw(2);
			if (get.itemtype(result) == "cards" && target.isIn() && player.hasCard(card => result.includes(card), "he")) {
				await player.chooseToGive(target, "he", true, card => get.event("cards")?.includes(card)).set("cards", result);
			}
		},
	},
	//2013标准包双蜀黑
	junkjizhi: {
		audio: "jizhi",
		trigger: { player: "useCard" },
		frequent: true,
		filter(event, player) {
			return get.type(event.card) == "trick" && event.card.isCard;
		},
		content() {
			"step 0";
			var card = get.cards()[0];
			event.card = card;
			game.cardsGotoOrdering(card);
			player.showCards(card, get.translation(player) + "发动了【集智】");
			if (get.type(card) != "basic") {
				player.gain(card, "gain2");
				event.finish();
			} else if (!player.countCards("h")) {
				event.finish();
			}
			"step 1";
			player.chooseCard("h", "是否用一张手牌交换" + get.translation(card) + "？", "若选择「取消」，则" + get.translation(card) + "将被置入弃牌堆。");
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				player.$throw(card, 1000);
				game.log(player, "将", card, "置于牌堆顶");
				player.lose(card, ui.cardPile, "visible", "insert");
				player.gain(event.card, "gain2");
			}
		},
	},
	junkqicai: {
		mod: {
			targetInRange(card, player, target, now) {
				var type = get.type(card);
				if (type == "trick" || type == "delay") {
					return true;
				}
			},
			canBeDiscarded(card) {
				if (get.position(card) == "e" && !["equip3", "equip4", "equip6"].includes(get.subtype(card))) {
					return false;
				}
			},
		},
	},
	junkrende: {
		audio: "rende",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget: lib.filter.notMe,
		filterCard: true,
		selectCard: [1, Infinity],
		allowChooseAll: true,
		position: "h",
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			event.num = cards.length;
			event.targets = targets.slice(0);
			player.give(cards, target);
			if (event.num > 1) {
				player.recover();
			}
			"step 1";
			if (player.countCards("h") > 0 && game.hasPlayer(current => current != player && !targets.includes(current))) {
				player.chooseCardTarget({
					prompt: "是否继续分配剩余的手牌",
					prompt2: "操作提示：请先选择要分配的手牌，然后再选择一名角色，该角色将获得你选择的所有手牌。",
					filterCard: true,
					selectCard: [1, Infinity],
					filterTarget(card, player, target) {
						return target != player && !_status.event.getParent().targets.includes(target);
					},
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0],
					cards = result.cards;
				player.line(target, "green");
				player.give(cards, target);
				targets.add(target);
				event.num += cards.length;
				if (num < 2 && event.num > 1) {
					player.recover();
				}
				event.goto(1);
			}
		},
	},
	//十周年削弱版张让
	junktaoluan: {
		hiddenCard(player, name) {
			return !player.getStorage("junktaoluan").includes(name) && player.countCards("hes", card => !player.getStorage("junktaoluan2").includes(get.suit(card))) > 0 && !player.hasSkill("junktaoluan3") && lib.inpile.includes(name);
		},
		audio: "taoluan",
		enable: "chooseToUse",
		filter(event, player) {
			return (
				!player.hasSkill("junktaoluan3") &&
				player.countCards("hes", card => {
					return lib.inpile.some(name => {
						if (player.getStorage("junktaoluan2").includes(get.suit(card))) {
							return false;
						}
						if (player.getStorage("junktaoluan").includes(name)) {
							return false;
						}
						if (get.type(name) != "basic" && get.type(name) != "trick") {
							return false;
						}
						if (
							event.filterCard(
								{
									name: name,
									isCard: true,
									cards: [card],
								},
								player,
								event
							)
						) {
							return true;
						}
						if (name == "sha") {
							for (var nature of lib.inpile_nature) {
								if (
									event.filterCard(
										{
											name: name,
											nature: nature,
											isCard: true,
											cards: [card],
										},
										player,
										event
									)
								) {
									return true;
								}
							}
						}
						return false;
					});
				}) > 0
			);
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) == "basic" || get.type(name) == "trick") {
						if (player.getStorage("junktaoluan").includes(name)) {
							continue;
						}
						list.push([get.translation(get.type(name)), "", name]);
						if (name == "sha") {
							for (var j of lib.inpile_nature) {
								list.push(["基本", "", "sha", j]);
							}
						}
					}
				}
				return ui.create.dialog("滔乱", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				var card = {
					name: button.link[2],
					nature: button.link[3],
				};
				if (player.countCards("hes", cardx => cardx.name == card.name)) {
					return 0;
				}
				return _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
			},
			backup(links, player) {
				return {
					filterCard(card, player) {
						return !player.getStorage("junktaoluan2").includes(get.suit(card));
					},
					audio: "taoluan",
					popname: true,
					check(card) {
						return 7 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					onuse(result, player) {
						player.markAuto("junktaoluan2", [get.suit(result.cards[0], player)]);
						var evt = _status.event.getParent("phase");
						if (evt && evt.name == "phase" && !evt.junktaoluan) {
							evt.junktaoluan = true;
							var next = game.createEvent("taoluan_clear");
							_status.event.next.remove(next);
							evt.after.push(next);
							next.player = player;
							next.setContent(function () {
								delete player.storage.junktaoluan2;
							});
						}
						player.markAuto("junktaoluan", [result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 4,
			save: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (!player.countCards("hes", card => !player.getStorage("junktaoluan2").includes(get.suit(card))) || player.hasSkill("taoluan3")) {
					return false;
				}
				if (tag == "respondSha" || tag == "respondShan") {
					if (arg == "respond") {
						return false;
					}
					return !player.getStorage("taoluan").includes(tag == "respondSha" ? "sha" : "shan");
				}
				return !player.getStorage("taoluan").includes("tao") || (!player.getStorage("taoluan").includes("jiu") && arg == player);
			},
			result: {
				player(player) {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != player && players[i].countCards("he") && get.attitude(player, players[i]) > 0) {
							return 1;
						}
					}
					return 0;
				},
			},
			threaten: 1.9,
		},
		group: "junktaoluan2",
	},
	junktaoluan2: {
		trigger: { player: ["useCardAfter", "respondAfter"] },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "junktaoluan",
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			return event.skill == "junktaoluan_backup";
		},
		content() {
			"step 0";
			player
				.chooseTarget(
					true,
					function (card, player, target) {
						return target != player;
					},
					"###滔乱###令一名其他角色选择一项：1.交给你一张与你以此法使用的牌类别不同的牌；2.你失去1点体力"
				)
				.set("ai", function (target) {
					var player = _status.event.player;
					if (get.attitude(player, target) > 0) {
						if (get.attitude(target, player) > 0) {
							return target.countCards("h");
						}
						return target.countCards("h") / 2;
					}
					return 0;
				});
			"step 1";
			var target = result.targets[0];
			event.target = target;
			player.line(target, "green");
			var type = get.type(trigger.card, "trick");
			target
				.chooseCard("###滔乱###交给" + get.translation(player) + "一张不为" + get.translation(type) + "牌的牌，或令其失去1点体力且滔乱无效直到回合结束", "he", function (card, player, target) {
					return get.type(card, "trick") != _status.event.cardType;
				})
				.set("cardType", type)
				.set("ai", function (card) {
					if (_status.event.att) {
						return 11 - get.value(card);
					}
					return 0;
				})
				.set("att", get.attitude(target, player) > 0);
			"step 2";
			if (result.bool) {
				target.give(result.cards, player, "visible");
			} else {
				player.addTempSkill("junktaoluan3");
			}
		},
	},
	junktaoluan3: {
		charlotte: true,
		trigger: { player: "phaseEnd" },
		forced: true,
		popup: false,
		sourceSkill: "junktaoluan",
		content() {
			player.loseHp();
		},
	},
	junktaoluan_backup: { charlotte: true },

	nshuaishuang: {
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		content() {
			"step 0";
			var card = get.cardPile(function (card) {
				return card.name == "tao";
			});
			if (card) {
				player.gain(card, "gain2");
			} else {
				event.finish();
			}
			"step 1";
			game.updateRoundNumber();
			player.loseHp();
		},
	},
	nsfengli: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && !current.hasSkill("nsfengli_use");
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("nsfengli"), function (card, player, target) {
					return target != player && !target.hasSkill("nsfengli_use");
				})
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target) / (5 + target.countCards("h"));
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("nsfengli", target);
				var cards = player.getCards("h");
				player.addShownCards(cards, "visible_nsfengli");
				player.addSkill("nsfengli2");
				target.addSkill("nsfengli_use");
				target.storage.nsfengli_use = player;
			}
		},
		group: ["nsfengli_draw", "nsfengli_clear"],
		onremove(player) {
			player.removeSkill("nsfengli2");
		},
	},
	nsfengli_draw: {
		trigger: {
			player: ["loseAfter", "hideShownCardsAfter"],
			global: ["gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		direct: true,
		charlotte: true,
		sourceSkill: "nsfengli",
		filter(event, player, name) {
			if (event.name == "hideShownCards") {
				const hs = player.countCards("h");
				return game.hasPlayer(current => current.countCards("h") < hs);
			}
			var num = 0;
			var evt = event.getl(player);
			if (!evt || !evt.gaintag_map) {
				return false;
			}
			var bool = false;
			for (var i in evt.gaintag_map) {
				if (evt.gaintag_map[i].some(tag => tag.indexOf("visible_") == 0)) {
					num++;
				}
			}
			if (event.getg) {
				if (event.name == "gain") {
					if (event.getlx === false && event.gaintag.some(tag => tag.indexOf("visible_") == 0)) {
						num -= event.cards.length;
					}
				} else {
					player.checkHistory("gain", function (evt) {
						if (evt.parent == event && evt.gaintag.some(tag => tag.indexOf("visible_") == 0)) {
							num -= evt.cards.length;
						}
					});
				}
			}
			if (num > 0) {
				const hs = player.countCards("h");
				return game.hasPlayer(current => current.countCards("h") < hs);
			}
		},
		content() {
			"step 0";
			player
				.chooseTarget("奉礼：是否令一名手牌数小于你的其他角色摸一张牌？", function (card, player, target) {
					return target != player && target.countCards("h") < player.countCards("h");
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards("h"));
					if (target.hasSkillTag("nogain")) {
						att /= 10;
					}
					return att;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("nsfengli", target);
				target.draw();
			}
		},
	},
	nsfengli_clear: {
		trigger: { player: "phaseBegin" },
		forced: true,
		sourceSkill: "nsfengli",
		filter(event, player) {
			return player.hasSkill("nsfengli2");
		},
		content() {
			var cards = player.getShownCards();
			if (cards.length > 0) {
				player.hideShownCards(cards);
			}
			player.removeSkill("nsfengli2");
		},
	},
	nsfengli2: {
		onremove(player) {
			player.removeGaintag("nsfengli2");
			game.countPlayer(function (current) {
				if (current.storage.nsfengli_use == player) {
					current.removeSkill("nsfengli_use");
				}
			});
		},
	},
	nsfengli_use: {
		hiddenCard(player, name) {
			if (player == _status.currentPhase) {
				return false;
			}
			var target = player.storage.nsfengli_use;
			var cards = target.getShownCards();
			for (var i of cards) {
				if (get.name(i, target) == name) {
					return true;
				}
			}
			return false;
		},
		enable: ["chooseToUse", "chooseToRespond"],
		charlotte: true,
		onremove: true,
		sourceSkill: "nsfengli",
		filter(event, player) {
			if (player == _status.currentPhase) {
				return false;
			}
			var target = player.storage.nsfengli_use;
			var cards = target.getShownCards();
			for (var i of cards) {
				if (
					event.filterCard(
						{
							name: get.name(i, target),
							nature: get.nature(i, target),
							isCard: true,
						},
						player,
						event
					)
				) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var target = player.storage.nsfengli_use;
				var cards = target.getShownCards();
				return ui.create.dialog("奉礼", cards);
			},
			filter(button, player) {
				var evt = _status.event.getParent();
				var target = player.storage.nsfengli_use;
				return evt.filterCard(
					{
						name: get.name(button.link, target),
						nature: get.nature(button.link, target),
						isCard: true,
					},
					player,
					evt
				);
			},
			check(button) {
				var player = _status.event.player;
				var evt = _status.event.getParent();
				if (evt.dying) {
					return get.attitude(player, evt.dying);
				}
				return 1;
			},
			backup(links, player) {
				var target = player.storage.nsfengli_use;
				return {
					viewAs: {
						name: get.name(links[0], target),
						nature: get.nature(links[0], target),
						isCard: true,
					},
					card: links[0],
					filterCard: () => false,
					selectCard: -1,
					log: false,
					precontent() {
						var card = lib.skill.nsfengli_use_backup.card;
						var target = player.storage.nsfengli_use;
						event.target = target;
						player.logSkill("nsfengli", target);
						player.showCards(card, get.translation(player) + "发动了【奉礼】");
						target.hideShownCards(card);
					},
				};
			},
			ai: {
				respondSha: true,
				respondhan: true,
				skillTagFilter(player, tag) {
					var name = "s" + tag.slice("respondS".length);
					return lib.skill.nsfengli_use.hiddenCard(player, name);
				},
			},
		},
		ai: {
			order: 8,
			result: { player: 1 },
		},
	},
	ns_xiandao: {
		audio: ["huashen", 2],
		forced: true,
		noRemove: true,
		trigger: {
			player: "damageBefore",
		},
		filter(event, player) {
			return event.nature;
		},
		content() {
			trigger.cancel();
		},
		ai: {
			nofire: true,
			nothunder: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "natureDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
		group: "ns_xiandao_add",
		subSkill: {
			add: {
				audio: ["huashen", 2],
				forced: true,
				priority: 10,
				trigger: {
					global: "gameStart",
					player: ["phaseEnd", "enterGame"],
				},
				content() {
					var n = [1, 2].randomGet();
					if (n == 1) {
						player.addTempSkill("releiji", {
							player: "phaseUseBegin",
						});
						player.markSkill("releiji", {
							player: "phaseUseBegin",
						});
					} else {
						player.addTempSkill("guidao", {
							player: "phaseUseBegin",
						});
						player.markSkill("guidao", { player: "phaseUseBegin" });
					}
				},
			},
		},
	},
	ns_chuanshu: {
		audio: ["xingshuai", 2],
		trigger: { global: "dying" },
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return event.player.hp <= 0 && event.player != player;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			trigger.player.chooseControl("releiji", "guidao").set("prompt", "" + get.translation(trigger.player) + "获得一项技能");
			goon = true;
			if (!goon) {
				event.finish();
			}
			"step 1";
			trigger.player.addSkills(result.control);
			trigger.player.recover(1 - trigger.player.hp);
			trigger.player.draw(2);
			trigger.player.storage.ns_chuanshu2 = player;
			trigger.player.addSkill("ns_chuanshu2");
			player.awakenSkill(event.name);
		},
	},
	ns_chuanshu2: {
		audio: ["songwei", 2],
		mark: "character",
		intro: {
			content: "当你造成或受到一次伤害后，$摸一张牌",
		},
		nopop: true,
		trigger: {
			source: "damageEnd",
			player: "damageEnd",
		},
		forced: true,
		popup: false,
		sourceSkill: "ns_chuanshu",
		filter(event, player) {
			return player.storage.ns_chuanshu2 && player.storage.ns_chuanshu2.isIn() && event.num > 0;
		},
		content() {
			"step 0";
			game.delayx();
			"step 1";
			var target = player.storage.ns_chuanshu2;
			player.line(target, "green");
			target.draw();
			game.delay();
		},
		onremove: true,
		group: "ns_chuanshu3",
	},
	ns_chuanshu3: {
		audio: 1,
		trigger: {
			player: "dieBegin",
		},
		silent: true,
		onremove: true,
		sourceSkill: "ns_chuanshu",
		filter(event, player) {
			return player.storage.ns_chuanshu2 && player.storage.ns_chuanshu2.isIn();
		},
		content() {
			"step 0";
			game.delayx();
			"step 1";
			var target = player.storage.ns_chuanshu2;
			player.line(target, "green");
			target.restoreSkill("ns_chuanshu");
			target.update();
		},
		forced: true,
		popup: false,
	},
	ns_xiuzheng: {
		audio: ["xinsheng", 2],
		enable: "phaseUse",
		usable: 1,
		priority: 10,
		filter(event, player) {
			return ui.cardPile.childElementCount + ui.discardPile.childElementCount >= 2;
		},
		filterTarget(card, player, target) {
			return player != target;
		},
		content() {
			"step 0";
			event.cards = get.cards(2);
			player.showCards(event.cards);
			"step 1";
			if (get.color(event.cards[0]) == "red" && get.color(event.cards[1]) == "red") {
				target.damage("fire");
			}
			if (get.color(event.cards[0]) != get.color(event.cards[1])) {
				player.discardPlayerCard(target, "he", true);
			}
			if (get.color(event.cards[0]) == "black" && get.color(event.cards[1]) == "black") {
				target.damage("thunder");
			}
			"step 2";
			if (event.cards.length) {
				player.gain(event.cards, "gain2");
				game.delay();
			}
			"step 3";
			player.chooseToDiscard(2, "he", "请弃置两张牌", true);
		},
		ai: {
			threaten: 0.5,
			order: 13,
			result: {
				target(player, target) {
					return get.damageEffect(target, player);
				},
			},
		},
	},
	nsanruo: {
		unique: true,
		locked: true,
		init(player) {
			if (!player.node.handcards1.cardMod) {
				player.node.handcards1.cardMod = {};
			}
			if (!player.node.handcards2.cardMod) {
				player.node.handcards2.cardMod = {};
			}
			var cardMod = function (card) {
				if (get.info(card).multitarget) {
					return;
				}
				if (card.name == "sha" || get.type(card) == "trick") {
					return ["暗弱", "杀或普通锦囊牌对你不可见"];
				}
			};
			player.node.handcards1.cardMod.nsanruo = cardMod;
			player.node.handcards2.cardMod.nsanruo = cardMod;
			player.node.handcards1.classList.add("nsanruo");
			player.node.handcards2.classList.add("nsanruo");
			if (!ui.css.nsanruo) {
				ui.css.nsanruo = lib.init.sheet('.handcards.nsanruo>.card[data-card-type="trick"]:not(*[data-card-multitarget="1"])>*,' + '.handcards.nsanruo>.card[data-card-name="sha"]>*{visibility:hidden !important}');
			}
		},
		onremove(player) {
			player.node.handcards1.classList.remove("nsanruo");
			player.node.handcards2.classList.remove("nsanruo");
			delete player.node.handcards1.cardMod.nsanruo;
			delete player.node.handcards2.cardMod.nsanruo;
		},
		ai: {
			neg: true,
		},
	},
	nsxunshan: {
		mod: {
			selectTarget(card, player, range) {
				if (!player.hasSkill("nsanruo")) {
					return;
				}
				if (_status.auto) {
					return;
				}
				if (get.position(card) != "h" || get.owner(card) != player) {
					return;
				}
				if (get.info(card).multitarget) {
					return;
				}
				if (card.name == "sha" || get.type(card) == "trick") {
					range[1] = game.countPlayer();
				}
			},
		},
		ai: {
			combo: "nsanruo",
		},
	},
	nskaicheng: {
		enable: "phaseUse",
		usable: 1,
		zhuSkill: true,
		filter(event, player) {
			if (!player.hasZhuSkill("nskaicheng")) {
				return false;
			}
			if (
				!player.hasCard(function (card) {
					if (get.info(card).multitarget) {
						return false;
					}
					return card.name == "sha" || get.type(card) == "trick";
				})
			) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.group == "qun";
			});
		},
		filterCard(card) {
			if (get.info(card).multitarget) {
				return false;
			}
			return card.name == "sha" || get.type(card) == "trick";
		},
		filterTarget(card, player, target) {
			return player != target && target.group == "qun";
		},
		lose: false,
		content() {
			"step 0";
			target.chooseBool(function () {
				return get.attitude(target, player) > 0;
			}, "是否将" + get.translation(cards) + "告知" + get.translation(player));
			"step 1";
			if (!player.hasUseTarget(cards[0])) {
				if (result.bool) {
					player.chooseControl("确定").set("prompt", "你展示的手牌为" + get.translation(cards));
				} else {
					event.hidden = true;
					player.chooseControl("确定").set("prompt", get.translation(target) + "拒绝告知你卡牌信息");
				}
			} else {
				if (result.bool) {
					player.chooseBool("是否使用展示的牌？", "你展示的手牌为" + get.translation(cards) + "。如果你使用此牌，则在结算后摸一张牌；如果你不使用此牌，则结束出牌阶段");
				} else {
					event.hidden = true;
					player.chooseBool("是否使用展示的牌？", get.translation(target) + "拒绝告知你卡牌信息。如果你使用此牌，则在结算后摸一张牌；如果你不使用此牌，则结束出牌阶段");
				}
			}
			"step 2";
			if (result.bool) {
				player.chooseUseTarget(true, cards[0], event.hidden ? "选择此牌的目标" : null);
			} else {
				var evt = _status.event.getParent("phaseUse");
				if (evt) {
					evt.skipped = true;
				}
				event.finish();
			}
			"step 3";
			player.draw();
		},
		ai: {
			combo: "nsanruo",
		},
	},
	nsjuanli: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		filter(event, player) {
			return player.countCards("h");
		},
		init(player) {
			player.storage.nsjuanli_win = [];
			player.storage.nsjuanli_lose = [];
		},
		intro: {
			content(storage, player) {
				var str = "";
				if (player.storage.nsjuanli_win.length) {
					str += get.translation(player.storage.nsjuanli_win) + "与你距离-1直到与你下次赌牌";
				}
				if (player.storage.nsjuanli_lose.length) {
					if (str.length) {
						str += "；";
					}
					str += get.translation(player.storage.nsjuanli_lose) + "与你距离+1直到与你下次赌牌";
				}
				return str;
			},
		},
		onremove: ["nsjuanli_win", "nsjuanli_lose"],
		content() {
			"step 0";
			player.storage.nsjuanli_win.remove(target);
			player.storage.nsjuanli_lose.remove(target);
			event.prompt2 = "赌牌的两名角色分别亮开一张手牌，若花色相同则赌牌平局，若花色不同，则依次亮出牌堆顶的牌直到翻开的牌与其中一人亮出牌的花色相同，则该角色获得赌牌的胜利";
			player.chooseCard("h", true).set("prompt2", event.prompt2);
			"step 1";
			if (result.bool) {
				event.card1 = result.cards[0];
				target.chooseCard("h", true).set("prompt2", event.prompt2);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.card2 = result.cards[0];
			} else {
				event.finish();
			}
			"step 3";
			player.$compare(event.card1, event.target, event.card2);
			game.delay(0, 1500);
			game.log(player, "亮出的牌为", event.card1);
			game.log(target, "亮出的牌为", event.card2);
			"step 4";
			var suit1 = get.suit(event.card1);
			var suit2 = get.suit(event.card2);
			if (suit1 == suit2) {
				game.broadcastAll(function (str) {
					var dialog = ui.create.dialog(str);
					dialog.classList.add("center");
					setTimeout(function () {
						dialog.close();
					}, 1000);
				}, "平局");
				game.delay(2);
				if (!player.storage.nsjuanli_win.length && !player.storage.nsjuanli_lose.length) {
					player.unmarkSkill("nsjuanli");
				}
			} else {
				var cards = [];
				for (var i = 0; i < 1000; i++) {
					var current = get.cards();
					if (current && current.length) {
						current = current[0];
						current.discard();
						cards.push(current);
						var suit = get.suit(current);
						if (suit == suit1) {
							player.showCards(cards, get.translation(player) + "赌牌获胜");
							player.storage.nsjuanli_win.add(target);
							target.loseHp();
							player.markSkill("nsjuanli");
							break;
						} else if (suit == suit2) {
							player.showCards(cards, get.translation(target) + "赌牌获胜");
							player.storage.nsjuanli_lose.add(target);
							target.recover();
							player.markSkill("nsjuanli");
							break;
						}
					} else {
						break;
					}
				}
			}
		},
		mod: {
			globalTo(from, to, distance) {
				if (to.storage.nsjuanli_win && to.storage.nsjuanli_win.includes(from)) {
					return distance - 1;
				}
				if (to.storage.nsjuanli_lose && to.storage.nsjuanli_lose.includes(from)) {
					return distance + 1;
				}
			},
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					if (target.isHealthy()) {
						return -1 / (1 + target.hp);
					} else {
						return -0.3 / (1 + target.hp);
					}
				},
			},
		},
	},
	nsyuanchou: {
		trigger: { target: "useCardToBefore" },
		forced: true,
		priority: 15,
		check(event, player) {
			return get.effect(event.target, event.card, event.player, player) < 0;
		},
		filter(event, player) {
			return get.type(event.card, "trick") == "trick" && get.distance(event.player, player) > 1;
		},
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (get.type(card, "trick") == "trick" && get.distance(player, target) > 1) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	nsguhuo: {
		trigger: { player: "useCardAfter" },
		forced: true,
		usable: 2,
		filter(event, player) {
			if (event.parent.name == "nsguhuo") {
				return false;
			}
			if (event.card == event.cards[0]) {
				var type = get.type(event.card, "trick");
				var names = [];
				if (
					get.cardPile(function (card) {
						if (get.type(card, "trick") != type) {
							return false;
						}
						if (get.info(card).multitarget) {
							return false;
						}
						if (names.includes(card.name)) {
							return false;
						}
						if (player.hasUseTarget(card)) {
							return true;
						} else {
							names.add(card.name);
							return false;
						}
					})
				) {
					return true;
				}
			}
			return true;
		},
		content() {
			var type = get.type(trigger.card, "trick");
			var names = [];
			var card = get.cardPile(function (card) {
				if (get.type(card, "trick") != type) {
					return false;
				}
				if (get.info(card).multitarget) {
					return false;
				}
				if (names.includes(card.name)) {
					return false;
				}
				if (player.hasUseTarget(card)) {
					return true;
				} else {
					names.add(card.name);
					return false;
				}
			});
			if (card) {
				var info = get.info(card);
				var targets = game.filterPlayer(function (current) {
					return lib.filter.filterTarget(card, player, current);
				});
				if (targets.length) {
					targets.sort(lib.sort.seat);
					var select = get.select(info.selectTarget);
					if (select[0] == -1 || select[1] == -1) {
						player.useCard(card, targets, "noai");
					} else if (targets.length >= select[0]) {
						var num = select[0] + Math.floor(Math.random() * (select[1] - select[0] + 1));
						player.useCard(card, targets.randomGets(num), "noai");
					}
				}
			}
		},
	},
	nsbaiyi: {
		trigger: { player: "phaseDiscardBefore" },
		forced: true,
		filter(event, player) {
			return player.storage.nsqinxue && player.storage.nsqinxue.length;
		},
		content() {
			"step 0";
			trigger.cancel();
			var num = player.storage.nsqinxue.length;
			player.chooseToDiscard("白衣：请弃置" + get.cnNumber(num) + "张牌", "he", true, num);
			"step 1";
			if (result.bool && result.cards.length) {
				event.goon = true;
				if (result.cards.length == 3) {
					var type = [];
					for (var i = 0; i < result.cards.length; i++) {
						type.add(get.type(result.cards[i], "trick"));
					}
					if (type.length == 3 && trigger.getParent().skill != "nsbaiyi") {
						event.goon = false;
						player.insertPhase();
					}
				}
				if (event.goon) {
					var cards = get.cards(result.cards.length);
					event.cards = cards;
					player.chooseCardButton(cards, "获得一张牌", true);
				}
			}
			"step 2";
			if (event.goon && result.bool && result.links.length) {
				player.gain(result.links, "draw");
				for (var i = 0; i < event.cards.length; i++) {
					if (!result.links.includes(event.cards[i])) {
						event.cards[i].discard();
					}
				}
			}
		},
		ai: {
			threaten: 1.5,
			combo: "nsqinxue",
		},
	},
	nsqinxue: {
		trigger: { player: "useCard" },
		init(player) {
			player.storage.nsqinxue = [];
		},
		forced: true,
		filter(event, player) {
			var type = get.type(event.card, "trick");
			if (player.storage.nsqinxue.includes(type)) {
				return false;
			}
			return ["basic", "trick", "equip"].includes(type);
		},
		content() {
			var type = null;
			var type0 = get.type(trigger.card, "trick");
			switch (type0) {
				case "basic":
					type = "trick";
					break;
				case "trick":
					type = "equip";
					break;
				case "equip":
					type = "basic";
					break;
			}
			var card = get.cardPile(function (card) {
				return get.type(card, "trick") == type;
			});
			if (card) {
				player.gain(card, "gain2");
				player.storage.nsqinxue.push(type0);
			}
		},
		group: "nsqinxue_clear",
		subSkill: {
			clear: {
				trigger: { global: "phaseAfter" },
				silent: true,
				content() {
					player.storage.nsqinxue = [];
				},
			},
		},
	},
	nsfuge: {
		trigger: { player: "phaseAfter" },
		filter(event, player) {
			return !player.storage.nsfuge;
		},
		init(player) {
			lib.onwash.push(function () {
				delete player.storage.nsfuge;
			});
		},
		skillAnimation: true,
		check(event, player) {
			return player.hp == 1 || player.maxHp - player.hp >= 2;
		},
		content() {
			player.storage.nsfuge = true;
			player.insertPhase();
		},
		group: "nsfuge_draw",
		subSkill: {
			draw: {
				trigger: { player: "phaseDrawBegin" },
				silent: true,
				filter(event, player) {
					var evt = event.getParent("phase");
					return evt && evt.skill == "nsfuge";
				},
				content() {
					trigger.num += player.maxHp - player.hp;
				},
			},
		},
	},
	nsbaiming: {
		trigger: { player: "useCard" },
		filter(event, player) {
			if (player.additionalSkills.nsbaiming?.length) {
				return false;
			}
			return event.card?.name == "sha" && player.storage.nsbaiming?.length;
		},
		group: "nsbaiming_clear",
		init(player) {
			var check = function (list) {
				for (var i = 0; i < list.length; i++) {
					var info = lib.skill[list[i]];
					if (!info) {
						continue;
					}
					if (info && info.trigger) {
						for (var j in info.trigger) {
							var cond = info.trigger[j];
							if (typeof cond == "string") {
								cond = [cond];
							}
							if (j == "source" || j == "global") {
								if (cond.indexOf("damageBefore") != -1) {
									return true;
								}
								if (cond.indexOf("damageBegin") != -1) {
									return true;
								}
								if (cond.indexOf("damageBegin1") != -1) {
									return true;
								}
								if (cond.indexOf("damageBegin2") != -1) {
									return true;
								}
								if (cond.indexOf("damageEnd") != -1) {
									return true;
								}
								if (cond.indexOf("damageSource") != -1) {
									return true;
								}
								if (cond.indexOf("damageAfter") != -1) {
									return true;
								}
							}
						}
					}
					if (get.plainText(get.skillInfoTranslation(list[i], player)).includes("【杀】")) {
						return true;
					}
				}
				return false;
			};
			player.storage.nsbaiming = get.gainableSkills(function (info, skill) {
				var list = [skill];
				game.expandSkills(list);
				return check(list);
			}, player);
		},
		async cost(event, trigger, player) {
			const skills = player.storage.nsbaiming.slice(0);
			const list = skills.map(skill => [
				skill,
				'<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">' +
					(() => {
						let str = get.translation(skill);
						if (!lib.skill[skill]?.nobracket) {
							str = "【" + str + "】";
						}
						return str;
					})() +
					"</div><div>" +
					lib.translate[skill + "_info"] +
					"</div></div>",
			]);
			const {
				result: { bool, links },
			} = await player
				.chooseButton([`###百鸣###<div class="text center">你可以获得其中一个技能</div>`, [list, "textbutton"]])
				.set("displayIndex", false)
				.set("ai", button => {
					const { link } = button,
						{ choice } = get.event();
					if (choice.includes(link)) {
						return 2;
					}
					return 1;
				})
				.set(
					"choice",
					skills.filter(skill => {
						const info = get.info(skill) || {};
						if (info.ai?.neg || info.ai?.halfneg || info.ai?.combo) {
							return false;
						}
						return ["使用【杀】时", "使用【杀】指定"].some(str => get.plainText(get.skillInfoTranslation(skill, player)).includes(str));
					})
				);
			event.result = {
				bool: bool,
				cost_data: links,
			};
		},
		async content(event, trigger, player) {
			const { cost_data: links, name } = event;
			player.addAdditionalSkill(name, links);
			player.popup(links);
			game.log(player, "获得了技能", "【" + get.translation(links) + "】");
			await game.delay();
			player.storage.nsbaiming.remove(links[0]);
			trigger.nsbaiming = true;
		},
		subSkill: {
			clear: {
				trigger: { player: "useCardAfter" },
				silent: true,
				filter(event) {
					return event.nsbaiming == true;
				},
				content() {
					player.removeAdditionalSkill("nsbaiming");
				},
			},
		},
	},
	nsxinzhan: {
		enable: "phaseUse",
		filterCard: [1, Infinity],
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		usable: 1,
		selectCard: [1, Infinity],
		check(card) {
			var player = _status.event.player;
			if (
				player.countCards("h") >= 8 &&
				game.hasPlayer(function (current) {
					return current.isDamaged() && get.attitude(player, current) > 3;
				})
			) {
				if (ui.selected.cards.length >= 6) {
					return 0;
				}
				return 1;
			} else {
				if (ui.selected.cards.length >= 2) {
					return 0;
				}
				if (
					player.countCards("h", function (card) {
						return get.value(card) < 0;
					})
				) {
					return 8 - get.value(card, player, "raw");
				} else {
					return 4 - get.value(card, player, "raw");
				}
			}
		},
		discard: false,
		prepare: "give2",
		content() {
			target.gain(cards, player);
			var num = Math.floor(cards.length / 2);
			if (num >= 3) {
				target.loseMaxHp(true);
			} else if (num) {
				target.loseHp(num);
			}
		},
		filterTarget(card, player, target) {
			return target != player;
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (ui.selected.cards.length >= 6) {
						if (target.isDamaged()) {
							return 2;
						}
						return 1;
					}
					if (ui.selected.cards.length == 1) {
						return 1;
					}
					return -1;
				},
			},
		},
	},
	nstanbing: {
		trigger: { player: "phaseDrawBegin" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseToDiscard("h", get.prompt2("nstanbing")).set("ai", function (card) {
				if (!player.needsToDiscard(1)) {
					return get.translation(card.name).length - 1;
				}
				return 0;
			}).logSkill = "nstanbing";
			"step 1";
			if (result.bool) {
				player.draw(get.translation(result.cards[0].name).length);
				player.addTempSkill("nstanbing_sha");
			}
		},
		subSkill: {
			sha: {
				mod: {
					cardEnabled(card, player) {
						if (card.name == "sha") {
							return false;
						}
					},
					cardUsable(card, player) {
						if (card.name == "sha") {
							return false;
						}
					},
				},
			},
		},
	},
	nswangfeng: {
		trigger: { global: "judge" },
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 0;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("nswangfeng"), "he", function (card) {
					return get.color(card) == "red";
				})
				.set("ai", function (card) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					var judging = _status.event.judging;
					var result = trigger.judge(card) - trigger.judge(judging);
					var attitude = get.attitude(player, trigger.player);
					if (attitude == 0 || result == 0) {
						return 0;
					}
					if (attitude > 0) {
						return result;
					} else {
						return -result;
					}
				})
				.set("judging", trigger.player.judging[0]);
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "highlight");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.logSkill("nswangfeng");
				player.$gain2(trigger.player.judging[0]);
				player.gain(trigger.player.judging[0]);
				trigger.player.judging[0] = result.cards[0];
				if (!get.owner(result.cards[0], "judge")) {
					trigger.position.appendChild(result.cards[0]);
				}
				game.log(trigger.player, "的判定牌改为", result.cards[0]);
			}
			"step 3";
			game.delay(2);
		},
		ai: {
			tag: {
				rejudge: 1,
			},
		},
	},
	nsfuhuo: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filterTarget(card, player, target) {
			return player != target && !target.hasSkill("nsfuhuo2");
		},
		prepare: "throw",
		discard: false,
		content() {
			target.$gain2(cards);
			target.storage.nsfuhuo2 = cards[0];
			target.addSkill("nsfuhuo2");
			target.storage.nsfuhuo3 = player;
			ui.special.appendChild(cards[0]);
			target.syncStorage("nsfuhuo2");
		},
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			expose: 0.1,
			order: 4,
			result: {
				target(player, target) {
					if (target.hasSkillTag("maixie")) {
						return 0;
					}
					return -1;
				},
			},
		},
		group: ["nsfuhuo_die", "nsfuhuo_gain"],
		subSkill: {
			die: {
				trigger: { player: "dieBegin" },
				silent: true,
				content() {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].hasSkill("nsfuhuo2") && game.players[i].storage.nsfuhuo3 == player) {
							game.players[i].removeSkill("nsfuhuo2");
						}
					}
				},
			},
			gain: {
				trigger: { player: "phaseBegin" },
				silent: true,
				content() {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].hasSkill("nsfuhuo2") && game.players[i].storage.nsfuhuo3 == player) {
							var card = game.players[i].storage.nsfuhuo2;
							game.players[i].removeSkill("nsfuhuo2");
							game.players[i].$give(card, player);
							player.gain(card);
						}
					}
				},
			},
		},
	},
	nsfuhuo2: {
		trigger: { player: ["respondAfter", "useCardAfter"] },
		forced: true,
		priority: 10,
		mark: "card",
		popup: false,
		sourceSkill: "nsfuhuo",
		filter(event, player) {
			return event.card && event.card.name == "shan" && player.storage.nsfuhuo3 && player.storage.nsfuhuo3.isIn();
		},
		content() {
			"step 0";
			player.storage.nsfuhuo3.logSkill("nsfuhuo", player);
			player.judge(function (card) {
				var suit = get.suit(card);
				if (suit == "heart" || suit == "diamond") {
					return -1;
				} else {
					return 0;
				}
			});
			"step 1";
			var source = player.storage.nsfuhuo3;
			if (result.suit == "diamond") {
				player.damage("fire", source);
				if (player.countCards("h")) {
					player.randomDiscard("h");
				}
			} else if (result.suit == "heart") {
				player.damage("fire", 2, source);
			}
		},
		intro: {
			content: "card",
		},
		onremove(player) {
			player.storage.nsfuhuo2.discard();
			delete player.storage.nsfuhuo2;
			delete player.storage.nsfuhuo3;
		},
		ai: {
			noShan: true,
		},
	},
	nshunji: {
		enable: "phaseUse",
		viewAs: { name: "wanjian" },
		usable: 1,
		delay: 0,
		selectCard: 0,
		group: ["nshunji_damage", "nshunji_draw"],
		subSkill: {
			draw: {
				trigger: { player: "useCard" },
				silent: true,
				filter(event) {
					return event.skill == "nshunji";
				},
				content() {
					player.draw();
				},
			},
			damage: {
				trigger: { global: "damageAfter" },
				silent: true,
				filter(event) {
					return event.getParent(2).skill == "nshunji";
				},
				content() {
					"step 0";
					if (player.countCards("he")) {
						trigger.player
							.discardPlayerCard(player, "混击", "he")
							.set("boolline", true)
							.set("prompt2", "弃置" + get.translation(player) + "的一张牌，或取消并摸一张牌");
					} else {
						trigger.player.draw();
						event.finish();
					}
					"step 1";
					if (!result.bool) {
						trigger.player.draw();
					}
				},
			},
		},
	},
	nsbaquan: {
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		check(event, player) {
			if (player.hasShan() || player.hujia > 0) {
				return false;
			}
			var nh = player.countCards("h");
			if (player.hp == 1) {
				return nh <= 3;
			}
			if (player.hp == 2) {
				return nh <= 1;
			}
			return false;
		},
		content() {
			var cards = player.getCards("h");
			player.discard(cards);
			player.changeHujia(cards.length);
			player.storage.nsbaquan = true;
		},
		group: "nsbaquan_clear",
		subSkill: {
			clear: {
				trigger: { player: "phaseBegin" },
				forced: true,
				filter(event, player) {
					return player.storage.nsbaquan && player.hujia > 0;
				},
				content() {
					player.changeHujia(-player.hujia);
					game.log(player, "失去了所有护甲");
					delete player.storage.nsbaquan;
				},
			},
		},
	},
	nschangshi: {
		mode: ["identity"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.identity == "fan";
		},
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			if (ui.selected.targets.length) {
				return target.hp != ui.selected.targets[0].hp;
			}
			return true;
		},
		multitarget: true,
		selectTarget: 2,
		content() {
			game.broadcastAll(
				function (player, targets) {
					player.showIdentity();
					var tmp = targets[0].hp;
					targets[0].hp = targets[1].hp;
					targets[1].hp = tmp;
					targets[0].update();
					targets[1].update();
					if (Math.abs(targets[0].hp - targets[1].hp) == 1) {
						player.loseHp();
					}
				},
				player,
				targets
			);
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (ui.selected.targets.length && Math.abs(target.hp - ui.selected.targets[0].hp) === 1) {
						return get.effect(player, { name: "losehp" }, player, player) / 10;
					}
					return 0;
				},
				target(player, target) {
					let att = get.attitude(player, target),
						max;
					if (!ui.selected.targets.length) {
						let search = false;
						game.countPlayer(cur => {
							if (player === cur || target === cur || (cur.hp - target.hp) * (get.attitude(player, cur) - att) >= 0) {
								return false;
							}
							if (!search) {
								max = Math.min(cur.hp, target.maxHp) - target.hp;
								search = true;
							} else if (att > 0) {
								max = Math.max(max, Math.min(cur.hp, target.maxHp) - target.hp);
							} else {
								max = Math.min(max, Math.min(cur.hp, target.maxHp) - target.hp);
							}
						});
						if (target === get.zhu(player)) {
							return 2 * max;
						}
						return max;
					}
					max = Math.min(ui.selected.targets[0].hp, target.maxHp) - target.hp;
					if (target === get.zhu(player)) {
						return 2 * max;
					}
					return max;
				},
			},
		},
	},
	nsjianning: {
		mode: ["identity"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.identity == "nei";
		},
		filterTarget(card, player, target) {
			return target.countCards("h") < player.countCards("h");
		},
		content() {
			"step 0";
			if (!player.identityShown) {
				game.broadcastAll(function (player) {
					player.showIdentity();
				}, player);
			}
			player.swapHandcards(target);
			"step 1";
			target.damage();
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (
						!player.countCards("h", function (card) {
							return get.value(card) >= 8;
						}) &&
						player.countCards("h") - target.countCards("h") <= 1
					) {
						if (
							target.hp == 1 ||
							player.countCards("h", function (card) {
								return get.value(card) < 0;
							})
						) {
							return get.damageEffect(target, player, target);
						}
					}
					return 0;
				},
			},
		},
	},
	nscuanquan: {
		mode: ["identity"],
		init(player) {
			player.storage.nscuanquan = 0;
		},
		forced: true,
		unique: true,
		forceunique: true,
		skillAnimation: true,
		animationColor: "thunder",
		trigger: { player: "damageAfter" },
		filter(event, player) {
			return player.identity == "zhong" && player.storage.nscuanquan == 3 && game.zhu && game.zhu.isZhu;
		},
		group: "nscuanquan_count",
		subSkill: {
			count: {
				trigger: { player: "damageEnd" },
				silent: true,
				content() {
					player.storage.nscuanquan++;
				},
			},
		},
		logTarget() {
			return [game.zhu];
		},
		content() {
			player.awakenSkill(event.name);
			game.broadcastAll(function (player) {
				var tmp = player.maxHp;
				player.identity = "zhu";
				player.maxHp = game.zhu.hp;
				player.showIdentity();
				player.update();
				game.zhu.identity = "zhong";
				game.zhu.maxHp = tmp;
				game.zhu.showIdentity();
				game.zhu.update();
				game.zhu = player;
			}, player);
			event.trigger("zhuUpdate");
		},
	},
	nstianji: {
		trigger: { global: "dying" },
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return event.player.hp <= 0 && event.player != player;
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 1;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			"step 1";
			trigger.player.recover(1 - trigger.player.hp);
			"step 2";
			trigger.player.gainMaxHp();
		},
	},
	nsbugua: {
		group: "nsbugua_use",
		ai: {
			threaten: 1.4,
		},
		subSkill: {
			use: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				check(card) {
					return 9 - get.value(card);
				},
				filter(event, player) {
					return player.countCards("he");
				},
				position: "he",
				ai: {
					order: 9.5,
					result: {
						player: 1,
					},
				},
				content() {
					"step 0";
					player.throwDice();
					"step 1";
					var cards = get.cards(6);
					var cards2 = cards.slice(0);
					var card = cards2.splice(event.num - 1, 1)[0];
					player.showCards(get.translation(player) + "亮出了" + get.translation(card), cards).set("hiddencards", cards2);
					card.discard();
					var name = null;
					switch (get.suit(card)) {
						case "club": {
							if (card.number % 2 == 0) {
								name = "guohe";
							} else {
								name = "jiedao";
							}
							break;
						}
						case "spade": {
							if (card.number % 2 == 0) {
								name = "nanman";
							} else {
								name = "juedou";
							}
							break;
						}
						case "diamond": {
							if (card.number % 2 == 0) {
								name = "shunshou";
							} else {
								name = "huogong";
							}
							break;
						}
						case "heart": {
							if (card.number % 2 == 0) {
								name = "wuzhong";
							} else {
								name = "wanjian";
							}
							break;
						}
					}
					var togain = get.cardPile(name, "cardPile", "random");
					if (togain) {
						player.gain(togain, "gain2");
					} else {
						player.draw();
					}
					event.list = cards2;
					"step 2";
					player.chooseCardButton(event.list, true, "按顺序将牌置于牌堆顶（先选择的在上）", event.list.length);
					"step 3";
					var list = result.links.slice(0);
					while (list.length) {
						ui.cardPile.insertBefore(list.pop(), ui.cardPile.firstChild);
					}
				},
			},
			twice: {},
		},
	},
	nstuiyan: {
		trigger: { player: "useCard" },
		filter(event, player) {
			return _status.currentPhase == player && event.getParent("phaseUse", true) && !player.hasSkill("nstuiyan_fail") && typeof player.storage.nstuiyan == "number" && event.card.number > player.storage.nstuiyan;
		},
		frequent: true,
		priority: 2,
		content() {
			player.draw();
		},
		onremove(player) {
			delete player.storage.nstuiyan;
			delete player.storage.nstuiyan_done;
			delete player.storage.nstuiyan2;
			delete player.storage.nstuiyan2_done;
		},
		intro: {
			mark(dialog, content, player) {
				if (player.storage.nstuiyan_done) {
					dialog.addText("推演摸牌已结束");
				} else {
					dialog.addText("上一张点数：" + player.storage.nstuiyan);
				}
				if (player.storage.nstuiyan2_done) {
					dialog.addText("总点数8的倍数已达成");
				} else {
					dialog.addText("总点数：" + player.storage.nstuiyan2);
				}
			},
			content(storage, player) {
				var str = "";
				if (player.storage.nstuiyan_done) {
					str += "推演摸牌已结束；";
				} else {
					str += "上一张牌点数：" + storage + "；";
				}
				if (player.storage.nstuiyan2_done) {
					str += "总点数8的倍数已达成";
				} else {
					str += "总点数：" + player.storage.nstuiyan2;
				}
				return str;
			},
			markcount(storage, player) {
				if (player.storage.nstuiyan2_done) {
					if (player.storage.nstuiyan_done) {
						return 0;
					} else {
						return player.storage.nstuiyan;
					}
				} else {
					return player.storage.nstuiyan2;
				}
			},
		},
		group: ["nstuiyan_use", "nstuiyan_clear"],
		subSkill: {
			bugua: {
				trigger: { player: "useCardAfter" },
				direct: true,
				filter(event, player) {
					return player.countCards("h");
				},
				content() {
					"step 0";
					player.removeSkill("nstuiyan_bugua");
					player
						.chooseToDiscard("he", "推演：是否发动一次【卜卦】？")
						.set("ai", function (card) {
							return 8 - get.value(card);
						})
						.set("logSkill", "nstuiyan");
					"step 1";
					if (result.bool) {
						event.insert(lib.skill.nsbugua.subSkill.use.content, { player: player });
					}
				},
			},
			use: {
				trigger: { player: "useCard" },
				silent: true,
				priority: -1,
				filter(event, player) {
					return _status.currentPhase == player && event.getParent("phaseUse", true) && typeof event.card.number == "number";
				},
				content() {
					if (typeof player.storage.nstuiyan2 != "number") {
						player.storage.nstuiyan2 = 0;
					}
					if (!player.hasSkill("nstuiyan_fail") && (trigger.card.number <= player.storage.nstuiyan || typeof trigger.card.number != "number")) {
						player.storage.nstuiyan_done = true;
						player.addTempSkill("nstuiyan_fail");
					}
					player.storage.nstuiyan = trigger.card.number;
					player.storage.nstuiyan2 += trigger.card.number;
					if (player.storage.nstuiyan2 % 8 == 0 && !player.storage.nstuiyan2_done) {
						player.storage.nstuiyan2_done = true;
						player.addTempSkill("nstuiyan_bugua");
					}
					player.markSkill("nstuiyan");
				},
			},
			clear: {
				trigger: { player: ["phaseUseAfter", "phaseAfter"] },
				silent: true,
				content() {
					delete player.storage.nstuiyan;
					delete player.storage.nstuiyan_done;
					delete player.storage.nstuiyan2;
					delete player.storage.nstuiyan2_done;
					player.unmarkSkill("nstuiyan");
				},
			},
			fail: {},
		},
		ai: {
			threaten: 1.4,
		},
	},
	nsshijun: {
		trigger: { source: "damageBegin" },
		forced: true,
		content() {
			trigger.num++;
			trigger.nsshijun = true;
		},
		subSkill: {
			hp: {
				trigger: { source: "damageAfter" },
				silent: true,
				filter(event) {
					return event.nsshijun;
				},
				content() {
					player.loseHp();
				},
			},
		},
		group: "nsshijun_hp",
		ai: {
			halfneg: true,
		},
	},
	nszhaoxin: {
		mark: true,
		intro: {
			mark(dialog, content, player) {
				var hs = player.getCards("h");
				if (hs.length) {
					dialog.addSmall(hs);
				} else {
					dialog.addText("无手牌");
				}
			},
			content(content, player) {
				var hs = player.getCards("h");
				if (hs.length) {
					return get.translation(hs);
				} else {
					return "无手牌";
				}
			},
		},
		locked: true,
		ai: {
			neg: true,
		},
	},
	nsxiuxin: {
		mod: {
			targetEnabled(card, player, target) {
				var suit = get.suit(card);
				if (suit && !target.countCards("h", { suit: suit })) {
					return false;
				}
			},
		},
	},
	nscangxi: {
		global: "nscangxi2",
		locked: false,
		zhuSkill: true,
		init(player) {
			player.storage.nscangxi = 0;
		},
		intro: {
			content: "手牌上限+#",
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.storage.nscangxi;
			},
		},
	},
	nscangxi2: {
		trigger: { player: "phaseDiscardEnd" },
		sourceSkill: "nscangxi",
		filter(event, player) {
			if (!event.cards || event.cards.length <= 1) {
				return false;
			}
			if (player.group != "wu") {
				return false;
			}
			return game.hasPlayer(function (target) {
				return player != target && target.hasZhuSkill("nscangxi", player);
			});
		},
		direct: true,
		content() {
			"step 0";
			var list = game.filterPlayer(function (current) {
				return current != player && current.hasZhuSkill("nscangxi", player);
			});
			list.sortBySeat();
			event.list = list;
			"step 1";
			if (event.list.length) {
				var current = event.list.shift();
				event.current = current;
				player.chooseBool(get.prompt("nscangxi", current)).set("choice", get.attitude(player, current) > 0);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.logSkill("nscangxi", event.current);
				player
					.judge(function (card) {
						return _status.event.att * (get.color(card) == "black" ? 1 : 0);
					})
					.set("att", get.sgnAttitude(player, event.current));
			} else {
				event.goto(1);
			}
			"step 3";
			switch (key) {
				case "black":
					var name = get.translation(event.current.name);
					var att = 0;
					if (event.current.needsToDiscard()) {
						att = 1;
					}
					player
						.chooseControlList(["令" + name + "摸一张牌展示", "令" + name + "手牌上永久+1", "弃置一张牌并令" + name + "获得一张本回合进入弃牌堆的牌"], function () {
							return _status.event.att;
						})
						.set("att", att);
					break;

				case "red":
					event.goto(1);
					break;

				default:
					break;
			}
			"step 4";
			switch (result.index) {
				case 0:
					event.current.draw("visible");
					break;
				case 1: {
					if (typeof event.current.storage.nscangxi != "number") {
						event.current.storage.nscangxi = 0;
					}
					event.current.storage.nscangxi++;
					event.current.syncStorage("nscangxi");
					event.current.markSkill("nscangxi");
					break;
				}
				case 2: {
					player.chooseToDiscard(true, "he");
					break;
				}
			}
			if (result.index != 2) {
				event.goto(1);
			}
			"step 5";
			if (result.bool) {
				var discarded = _status.discarded;
				if (discarded.length) {
					event.current.chooseCardButton("选择一张获得之", discarded, true).set("ai", function (button) {
						return get.value(button.link);
					});
				} else {
					event.goto(1);
				}
			} else {
				event.goto(1);
			}
			"step 6";
			if (result.bool && result.links && result.links.length) {
				event.current.gain(result.links, "gain2");
			}
			event.goto(1);
		},
	},
	nswulie: {
		trigger: { player: "phaseBegin" },
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		filter(event, player) {
			return ui.discardPile.childElementCount > 0;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			"step 1";
			player.chooseCardButton(Array.from(ui.discardPile.childNodes), "将至多三张任意顺置于牌堆顶（先选择的在上）", true, [1, 3]);
			"step 2";
			if (result.bool) {
				var cards = result.links.slice(0);
				while (cards.length) {
					ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
				}
				player.addTempSkill("nswulie_end");
			}
		},
		subSkill: {
			end: {
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					return ui.discardPile.childElementCount > 0;
				},
				content() {
					"step 0";
					player.loseMaxHp();
					"step 1";
					player.chooseCardButton(Array.from(ui.discardPile.childNodes), "将至多三张任意顺置于牌堆顶（先选择的在上）", true, [1, 3]);
					"step 2";
					if (result.bool) {
						var cards = result.links.slice(0);
						while (cards.length) {
							ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
						}
					}
				},
			},
		},
	},
	nshunyou: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { type: "basic" },
		filter(event, player) {
			return player.countCards("h", { type: "basic" });
		},
		content() {
			"step 0";
			var equip = null,
				trick = null;
			for (var i = 0; i < ui.discardPile.childElementCount; i++) {
				var type = get.type(ui.discardPile.childNodes[i], "trick");
				if (type == "trick") {
					trick = ui.discardPile.childNodes[i];
				} else if (type == "equip") {
					equip = ui.discardPile.childNodes[i];
				}
				if (trick && equip) {
					break;
				}
			}
			var list = [];
			if (trick) {
				list.push(trick);
			}
			if (equip) {
				list.push(equip);
			}
			if (!list.length) {
				player.draw(Math.min(3, 1 + player.maxHp - player.hp));
			} else {
				player.gain(list, "gain2");
				event.equip = equip;
			}
			"step 1";
			if (event.equip && get.owner(event.equip) == player) {
				player
					.chooseTarget("是否将" + get.translation(event.equip) + "装备给一其角色？", function (card, player, target) {
						return target != player;
					})
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (att > 1) {
							if (!target.getEquip(_status.event.subtype)) {
								return att;
							}
						}
						return 0;
					})
					.set("subtype", get.subtype(event.equip));
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.line(result.targets, "green");
				player.$give(event.equip, result.targets[0]);
				player.lose(event.equip, ui.special);
			} else {
				event.finish();
			}
			"step 3";
			game.delay(0.5);
			"step 4";
			result.targets[0].equip(event.equip);
			"step 5";
			game.delay();
		},
		check(card) {
			return 7 - get.value(card);
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	nsgongjian: {
		trigger: { player: "phaseDiscardEnd" },
		forced: true,
		filter(event, player) {
			if (event.cards && event.cards.length > 0) {
				return game.hasPlayer(function (current) {
					return current.hp > player.hp;
				});
			}
			return false;
		},
		content() {
			"step 0";
			player
				.chooseTarget("恭俭：将弃置的牌交给一名体力值大于你的角色", function (card, player, target) {
					return target.hp > player.hp;
				})
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target) / Math.sqrt(target.countCards("h") + 1);
				});
			"step 1";
			if (result.bool) {
				player.line(result.targets, "green");
				result.targets[0].gain(trigger.cards, "gain2");
			}
		},
		ai: {
			halfneg: true,
		},
	},
	nscaijian: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var nh = player.countCards("h");
			return nh && nh <= player.maxHp;
		},
		content() {
			"step 0";
			player.showHandcards();
			event.num = player.countCards("h");
			"step 1";
			player.directgain(get.cards(event.num));
			player.chooseCard("将" + get.cnNumber(event.num) + "张手牌以按顺序置于牌堆顶（先选择的在上）", event.num, true).set("ai", function (card) {
				return -get.value(card);
			});
			"step 2";
			if (result.bool) {
				player.lose(result.cards, ui.special)._triggered = null;
				event.cards = result.cards.slice(0);
			} else {
				event.finish();
			}
			"step 3";
			if (player == game.me && _status.auto) {
				game.delay();
			}
			"step 4";
			while (event.cards.length) {
				var current = event.cards.pop();
				current.fix();
				ui.cardPile.insertBefore(current, ui.cardPile.firstChild);
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	nsdongcha: {
		trigger: { player: "damageBefore" },
		forced: true,
		priority: 15,
		filter(event, player) {
			if (get.type(event.card, "trick") == "trick") {
				if (event.getParent(2).name == "useCard") {
					return event.getParent(2).targets.length == 1;
				}
				return true;
			}
			return false;
		},
		content() {
			trigger.cancel();
		},
		ai: {
			notrick: true,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "trick" && get.tag(card, "damage") && !get.tag(card, "multitarget")) {
						return "zeroplayertarget";
					}
				},
			},
		},
		group: "nsdongcha_cancel",
		subSkill: {
			cancel: {
				trigger: { target: "useCardToAfter" },
				silent: true,
				filter(event, player) {
					return get.type(event.card, "trick") == "trick" && _status.currentPhase == event.player && event.player != player;
				},
				content() {
					player.addTempSkill("nsdongcha_disable");
				},
			},
			disable: {
				trigger: { target: "useCardToBefore" },
				forced: true,
				priority: 15,
				onremove: true,
				filter(event, player) {
					return event.player == _status.currentPhase && get.type(event.card, "trick") == "trick";
				},
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.type(card, "trick") == "trick" && _status.currentPhase == player) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	nsjianxiong: {
		trigger: { target: "useCardToBefore" },
		direct: true,
		content() {
			"step 0";
			player.chooseToUse(
				function (card) {
					return !get.info(card).multitarget;
				},
				get.prompt("nsjianxiong", trigger.player),
				trigger.player,
				-1
			);
			"step 1";
			if (event.damaged) {
				trigger.cancel();
				if (get.color(trigger.card) == "black") {
					player.draw();
				}
			}
		},
		subSkill: {
			damage: {
				trigger: { source: "damageAfter" },
				silent: true,
				filter(event, player) {
					return event.getParent(4).name == "nsjianxiong";
				},
				content() {
					trigger.getParent(4).damaged = true;
				},
			},
		},
		group: "nsjianxiong_damage",
		ai: {
			effect: {
				player(card, player, target) {
					if (_status.currentPhase != player) {
						return;
					}
					if (get.tag(card, "damage") && !player.needsToDiscard(1) && target.hp > 1) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	nsxionglue: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", { color: "black" });
		},
		check(card) {
			return 7 - get.value(card);
		},
		filterCard: { color: "black" },
		content() {
			"step 0";
			var list = get.inpile("trick");
			list = list.randomGets(3);
			for (var i = 0; i < list.length; i++) {
				list[i] = ["锦囊", "", list[i]];
			}
			var dialog = ui.create.dialog("选择一张锦囊牌加入你的手牌", [list, "vcard"], "hidden");
			player.chooseButton(dialog, true).set("ai", function (button) {
				var card = { name: button.link[2] };
				var value = get.value(card);
				return value;
			});
			"step 1";
			if (result.bool) {
				player.gain(game.createCard(result.buttons[0].link[2]), "draw");
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	nshuanhuo: {
		trigger: { player: ["loseHpAfter", "damageAfter"] },
		filter(event, player) {
			if (
				game.countPlayer(function (current) {
					return current != player && !current.isUnseen(2);
				}) < 2
			) {
				return false;
			}
			if (event.name == "damage") {
				return event.num > 1;
			}
			return true;
		},
		direct: true,
		skillAnimation: true,
		animationColor: "thunder",
		content() {
			"step 0";
			player
				.chooseTarget(2, get.prompt2("nshuanhuo"), function (card, player, target) {
					return target != player && !target.isUnseen(2);
				})
				.set("ai", function (target) {
					var att = get.attitude(player, target);
					if (ui.selected.targets.length) {
						if (att < 0) {
							return get.rank(target, true) - get.rank(ui.selected.targets[0], true);
						}
					} else {
						if (att >= 0) {
							return 1 / (1 + get.rank(target, true));
						}
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				player.logSkill("nshuanhuo", result.targets);
			} else {
				event.finish();
			}
			"step 2";
			var name1 = result.targets[0].name;
			var name2 = result.targets[1].name;
			result.targets[0].reinit(name1, name2, false);
			result.targets[1].reinit(name2, name1, false);
		},
	},
	nsyaowang: {
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return game.hasPlayer(
				current =>
					player != current &&
					current.getSkills(null, false, false).filter(skill => {
						const info = get.info(skill);
						return info && !info.charlotte;
					}).length
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return (
						player != target &&
						target.getSkills(null, false, false).filter(skill => {
							const info = get.info(skill);
							return info && !info.charlotte;
						}).length
					);
				})
				.set("ai", target => {
					if (get.attitude(get.player(), target) > 0) {
						return Math.random();
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const skills = target.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				return info && !info.charlotte;
			});
			if (!skills.length) {
				return;
			}
			const list = skills.map(skill => [
				skill,
				'<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">' +
					(() => {
						let str = get.translation(skill);
						if (!lib.skill[skill]?.nobracket) {
							str = "【" + str + "】";
						}
						return str;
					})() +
					"</div><div>" +
					lib.translate[skill + "_info"] +
					"</div></div>",
			]);
			const links = await player
				.chooseButton(["选择获得一个技能", [list, "textbutton"]])
				.set("displayIndex", false)
				.set("ai", button => {
					const player = get.player();
					let info = get.info(button.link);
					if (info?.ai?.neg || info?.ai?.halfneg) {
						return 0;
					}
					return get.skillRank(button.link, "inout");
				})
				.forResultLinks();
			if (!links?.length) {
				return;
			}
			await player.addTempSkills(links[0]);
			const names = game.players.concat(game.dead).reduce((list, i) => list.addArray(get.nameList(i)), []);
			const skillList = get.gainableSkills((info, skill, name) => !names.includes(name));
			if (!skillList.length) {
				return;
			}
			const skill = skillList.randomGet();
			await target.addTempSkills(skill, { player: "phaseAfter" });
		},
	},
	nsjianshu: {
		trigger: { player: "shaBegin" },
		forced: true,
		filter(event, player) {
			return !event.directHit && player.getEquip(1);
		},
		priority: -1,
		content() {
			if (typeof trigger.shanRequired == "number") {
				trigger.shanRequired++;
			} else {
				trigger.shanRequired = 2;
			}
		},
	},
	nscangjian: {
		trigger: { source: "damageEnd" },
		direct: true,
		filter(event) {
			return event.player.isIn() && event.player.countCards("e");
		},
		content() {
			player.gainPlayerCard(trigger.player, "e", get.prompt("nscangjian", trigger.player)).logSkill = ["nscangjian", trigger.player];
		},
	},
	nsyunxing: {
		trigger: { global: "dieAfter" },
		forced: true,
		check(event, player) {
			return event.player.group == "wei" || (event.player.group == "wu" && player.hp == 1);
		},
		filter(event, player) {
			return ["wei", "shu", "wu", "qun"].includes(event.player.group);
		},
		content() {
			"step 0";
			switch (trigger.player.group) {
				case "wei":
					player.draw();
					break;
				case "shu":
					player.loseHp();
					break;
				case "wu":
					player.recover();
					break;
				case "qun": {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
					var evt = _status.event.getParent("phase");
					if (evt && evt.name == "phase") {
						evt.finish();
					}
					break;
				}
			}
			if (
				trigger.player.group != "wei" ||
				!game.hasPlayer(function (current) {
					return current.countCards("h");
				})
			) {
				event.finish();
			}
			"step 1";
			player
				.chooseTarget("弃置一名角色的一张手牌", true, function (card, player, target) {
					return target.countCards("h");
				})
				.set("ai", function (target) {
					if (target.hasSkillTag("noh")) {
						return 0;
					}
					return -get.attitude(_status.event.player, target);
				});
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.discardPlayerCard(target, true, "h");
				player.line(target, "green");
			}
		},
		group: "nsyunxing_self",
		subSkill: {
			self: {
				trigger: { player: "dieBegin" },
				direct: true,
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("nsyunxing"), function (card, player, target) {
							return target != player;
						})
						.set("prompt2", "令一名其他角色翻面")
						.set("ai", function (target) {
							var att = get.attitude(_status.event.player, target);
							if (target.isTurnedOver()) {
								if (att > 2) {
									return att * 2;
								} else {
									return att;
								}
							} else {
								return -att;
							}
						});
					"step 1";
					if (result.bool) {
						player.logSkill("nsyunxing", result.targets);
						result.targets[0].turnOver();
					}
				},
			},
		},
	},
	nsguanxing: {
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return player.hp > 0;
		},
		content() {
			"step 0";
			event.cards = get.cards(game.countPlayer());
			event.chosen = [];
			event.num = player.hp;
			"step 1";
			var js = player.getCards("j");
			var pos;
			var choice = -1;
			var getval = function (card, pos) {
				if (js[pos]) {
					return get.judge(js[pos])(card);
				} else {
					return get.value(card);
				}
			};
			for (pos = 0; pos < Math.min(event.cards.length, js.length + 2); pos++) {
				var max = getval(event.cards[pos], pos);
				for (var j = pos + 1; j < event.cards.length; j++) {
					var current = getval(event.cards[j], pos);
					if (current > max) {
						choice = j;
						max = current;
					}
				}
				if (choice != -1) {
					break;
				}
			}
			player
				.chooseCardButton("观星：选择要移动的牌（还能移动" + event.num + "张）", event.cards)
				.set("filterButton", function (button) {
					return !_status.event.chosen.includes(button.link);
				})
				.set("chosen", event.chosen)
				.set("ai", function (button) {
					return button.link == _status.event.choice ? 1 : 0;
				})
				.set("choice", event.cards[choice]);
			event.pos = pos;
			"step 2";
			if (result.bool) {
				var card = result.links[0];
				var index = event.cards.indexOf(card);
				event.card = card;
				event.chosen.push(card);
				event.cards.remove(event.card);
				var buttons = event.cards.slice(0);
				player
					.chooseControl(function () {
						return _status.event.controlai;
					})
					.set("controlai", event.pos || 0)
					.set("sortcard", buttons)
					.set("tosort", card);
			} else {
				event.goto(4);
			}
			"step 3";
			if (typeof result.index == "number") {
				if (result.index > event.cards.length) {
					ui.cardPile.appendChild(event.card);
				} else {
					event.cards.splice(result.index, 0, event.card);
				}
				event.num--;
				if (event.num > 0) {
					event.goto(1);
				}
			}
			"step 4";
			while (event.cards.length) {
				ui.cardPile.insertBefore(event.cards.pop(), ui.cardPile.firstChild);
			}
			var js = player.getCards("j");
			if (js.length == 1) {
				if (get.judge(js[0])(ui.cardPile.firstChild) < 0) {
					player.addTempSkill("guanxing_fail");
				}
			}
		},
		ai: {
			guanxing: true,
		},
	},
	nshaoling: {
		skillAnimation: true,
		animationColor: "water",
		limited: true,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target !== player;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.target;
			let targets = game
				.filterPlayer(cur => {
					return cur !== player && cur !== target;
				})
				.sortBySeat();
			while (targets.length) {
				const current = targets.shift();
				if (target.isAlive() && current.countCards("he")) {
					const result = await current
						.chooseToUse({ name: "sha" }, target, -1, "号令")
						.set("prompt2", "选择一项：1. 对" + get.translation(target) + "使用一张【杀】；2. 取消并交给" + get.translation(player) + "一张牌，然后其视为对你使用一张【杀】")
						.forResult();
					if (result.bool) {
						continue;
					}
					if (current.countCards("he")) {
						const cards = await current.chooseCard("he", true, "交给" + get.translation(player) + "一张牌").forResultCards();
						if (cards) {
							await current.give(cards, player);
						}
					}
					await player.useCard({ name: "sha" }, current, false);
				}
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					var players = game.filterPlayer();
					if (player.hp > 1) {
						if (game.phaseNumber < game.players.length) {
							return 0;
						}
						if (player.hasUnknown()) {
							return 0;
						}
					}
					var effect = 0;
					for (var i = 0; i < players.length; i++) {
						if (players[i] != target && players[i] != player && players[i].countCards("he")) {
							effect += get.effect(target, { name: "sha" }, players[i], target);
						}
					}
					return effect;
				},
			},
		},
	},
	nsgefa: {
		enable: "chooseToUse",
		filter(event, player) {
			return player.hp <= 0;
		},
		filterCard: { suit: "club" },
		position: "hse",
		viewAs: { name: "tao" },
		prompt: "将一张梅花牌当桃使用",
		check(card) {
			return 15 - get.value(card);
		},
		ai: {
			skillTagFilter(player) {
				return player.countCards("hes", { suit: "club" }) > 0;
			},
			threaten: 1.5,
			save: true,
			respondTao: true,
		},
	},
	nscaiyi: {
		trigger: { global: "drawAfter" },
		check(event, player) {
			if (get.attitude(player, event.player) >= 0) {
				return false;
			}
			if (get.effect(event.player, { name: "sha" }, player, player) <= 0) {
				return false;
			}
			if (get.effect(player, { name: "sha" }, event.player, player) >= 0) {
				return true;
			}
			return player.hasShan() && player.hp >= event.player.hp;
		},
		filter(event, player) {
			return player != event.player && Array.isArray(event.result) && event.result.length > 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			player.viewCards(get.translation(trigger.player) + "摸到的牌", trigger.result);
			if (!event.isMine()) {
				game.delayx();
			}
			"step 1";
			var list = [];
			for (var i = 0; i < trigger.result.length; i++) {
				if (trigger.result[i].name == "sha") {
					list.push(trigger.result[i]);
				}
			}
			if (list.length) {
				player.useCard({ name: "sha" }, trigger.player);
			} else {
				trigger.player.useCard({ name: "sha" }, player);
			}
		},
	},
	nspinmin: {
		trigger: { player: "dieBefore" },
		forced: true,
		filter(event, player) {
			return player.maxHp > 0 && event.getParent().name != "giveup";
		},
		content() {
			trigger.cancel();
			player.hp = 1;
			player.update();
			if (_status.currentPhase == player) {
				var num = 4;
				if (!player.hasSkill("nspinmin_used") && player.maxHp < num) {
					player.gainMaxHp(true);
					player.addTempSkill("nspinmin_used");
				}
			} else {
				player.loseMaxHp(true);
			}
		},
		subSkill: {
			used: {},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "save")) {
						if (_status.currentPhase == player) {
							return 0;
						}
						if (target.maxHp > 1 && player != target) {
							return 0;
						}
					}
					if (get.tag(card, "recover")) {
						if (_status.currentPhase == player) {
							return 0;
						}
					}
				},
			},
		},
	},
	nsshishou: {
		trigger: { player: "loseEnd" },
		forced: true,
		filter(event, player) {
			if (_status.currentPhase != player) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original == "h") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			player.loseHp();
			"step 1";
			player.draw();
		},
		group: "nsshishou_use",
		subSkill: {
			use: {
				mod: {
					cardEnabled(card, player) {
						if (_status.currentPhase != player) {
							return;
						}
						if (get.cardCount(true, player) >= 4) {
							return false;
						}
					},
				},
			},
		},
		ai: {
			neg: true,
		},
	},
	nsduijue: {
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h");
		},
		content() {
			"step 0";
			var color = {
				black: player.countCards("h", function (card) {
					return get.color(card) == "red" && get.value(card) < 8;
				}),
				red: player.countCards("h", function (card) {
					return get.color(card) == "black" && get.value(card) < 8;
				}),
			};
			player
				.chooseToDiscard(get.prompt2("nsduijue"))
				.set("ai", function (card) {
					var num = _status.event.color[get.color(card)];
					if (_status.event.goon && num >= 1) {
						return 7 + num - get.value(card);
					}
				})
				.set(
					"goon",
					game.hasPlayer(function (current) {
						return get.effect(current, { name: "juedou" }, player, player) > 0;
					})
				)
				.set("color", color)
				.set("logSkill", "nsduijue");
			"step 1";
			if (result.bool) {
				player.addTempSkill("nsduijue_use", "phaseUseAfter");
				player.storage.nsduijue_use = get.color(result.cards[0]);
			}
		},
		subSkill: {
			use: {
				enable: "phaseUse",
				viewAs: { name: "juedou" },
				usable: 2,
				filter(event, player) {
					return player.hasCard(function (card) {
						return get.color(card) != player.storage.nsduijue_use;
					}, "hs");
				},
				position: "hs",
				filterCard(card, player) {
					return get.color(card) != player.storage.nsduijue_use;
				},
				check(card) {
					return 8 - get.value(card);
				},
				ai: {
					basic: {
						order: 10,
					},
				},
			},
		},
	},
	nsshuangxiong: {
		trigger: { player: "juedouBegin", target: "juedouBegin" },
		check(event, player) {
			return player.isTurnedOver();
		},
		content() {
			player.turnOver();
		},
		ai: { combo: "nsduijue" },
	},
	nsguanyong: {
		enable: "chooseToRespond",
		filterCard: true,
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (!player.countCards("hs")) {
				return false;
			}
		},
		position: "hs",
		prompt: "将一张手牌当杀打出",
		check(card) {
			return 7 - get.value(card);
		},
		ai: {
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg !== "respond") {
					return false;
				}
				if (!player.countCards("hs")) {
					return false;
				}
			},
		},
	},
	nsjihui: {
		trigger: { global: "discardAfter" },
		filter(event, player) {
			return event.cards.length >= 3;
		},
		forced: true,
		content() {
			player.insertPhase();
			player.storage.nsjihui_use = _status.currentPhase;
			player.addSkill("nsjihui_use");
		},
		subSkill: {
			use: {
				mark: "character",
				intro: {
					content: "使用牌只能指定自己与$为目标",
				},
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.skill == "nsjihui";
				},
				onremove: true,
				content() {
					player.removeSkill("nsjihui_use");
				},
				mod: {
					playerEnabled(card, player, target) {
						if (player != target && player.storage.nsjihui_use != target) {
							return false;
						}
					},
				},
			},
		},
	},
	nsmouyun: {
		enable: "phaseUse",
		round: 2,
		filterTarget(card, player, target) {
			return target.isMinHp() && target != player && target.isDamaged();
		},
		content() {
			if (target.isDamaged()) {
				player.discardPlayerCard(target, "hej", target.maxHp - target.hp, true);
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return target.hp - target.maxHp;
				},
			},
		},
	},
	nscongjun: {
		forbid: ["guozhan"],
		unique: true,
		forceunique: true,
		locked: true,
		init(player) {
			if (player.storage.nscongjun_show || ![player.name1, player.name2].includes("ns_huamulan")) {
				return false;
			}
			var change = function (target) {
				if (target == player) {
					var list;
					if (_status.connectMode) {
						list = get.charactersOL(function (i) {
							return lib.character[i][0] != "male";
						});
					} else {
						list = get.gainableCharacters(function (info) {
							return info[0] == "male";
						});
					}
					var name = list.randomGet();
					target.reinit("ns_huamulan", name, "nosmooth");
					target.storage.nscongjun_show = name;
					target.addSkill("nscongjun_show");
					player._inits.remove(change);
					player.hp = player.maxHp;
					player.update();
				}
			};
			if (!player._inits) {
				player._inits = [];
			}
			player._inits.push(change);
		},
		subSkill: {
			show: {
				trigger: { global: "useCard" },
				filter(event, player) {
					return player.storage.nscongjun_show && event.card.name == "wuxie" && event.getRand() < 0.1 && player.getEnemies().includes(event.player);
				},
				direct: true,
				skillAnimation: true,
				animationColor: "thunder",
				content() {
					"step 0";
					game.delay(0.5);
					"step 1";
					player.reinit(player.storage.nscongjun_show, "ns_huamulan", "nosmooth");
					player.logSkill("nscongjun_show");
					"step 2";
					player.removeSkill("nscongjun_show");
					player.line(trigger.player, "green");
					trigger.player.damage(2);
				},
			},
		},
	},
	nstaiping_nh: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return !event.nshuanxian && player.getSubPlayers("nshuanxian").length && event.num > 0;
		},
		getIndex: event => event.num,
		priority: -0.1,
		async cost(event, trigger, player) {
			const left = player.storage.nshuanxian_left;
			const right = player.storage.nshuanxian_right;
			const list = [];
			let choice = 0;
			let hpleft = 0;
			let maxleft = 0;
			if (left && player.hasSkill(left)) {
				if (player.storage[left].hp < player.storage[left].maxHp) {
					list.push("令幻身·左回复1点体力");
					hpleft = player.storage[left].hp;
				}
				list.push("令幻身·左增加1点体力上限");
				maxleft = player.storage[left].hp;
			}
			if (left && player.hasSkill(right)) {
				if (player.storage[right].hp < player.storage[right].maxHp) {
					list.push("令幻身·右回复1点体力");
					if (!hpleft || player.storage[right].hp < hpleft || (player.storage[right].hp == hpleft && Math.random() < 0.5)) {
						choice = list.length - 1;
					}
				}
				list.push("令幻身·右增加1点体力上限");
				if (!hpleft && maxleft && choice == 0) {
					if (player.storage[right].maxHp < maxleft || (player.storage[right].maxHp == maxleft && Math.random() < 0.5)) {
						choice = list.length - 1;
					}
				}
			}
			if (!list.length) {
				return;
			}
			let map = {};
			for (var i = 0; i < list.length; i++) {
				map["选项" + get.cnNumber(i + 1, true)] = list[i];
			}
			const result = await player
				.chooseControlList(list, () => get.event().choice)
				.set("prompt", get.prompt(event.skill))
				.set("choice", choice)
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: {
					control: result.control,
					map: map,
				},
			};
		},
		async content(event, trigger, player) {
			const {
				cost_data: { control, map },
			} = event;
			const left = player.storage.nshuanxian_left;
			const right = player.storage.nshuanxian_right;
			switch (map[control]) {
				case "令幻身·左回复1点体力":
					player.storage[left].hp++;
					break;
				case "令幻身·左增加1点体力上限":
					player.storage[left].maxHp++;
					break;
				case "令幻身·右回复1点体力":
					player.storage[right].hp++;
					break;
				case "令幻身·右增加1点体力上限":
					player.storage[right].maxHp++;
					break;
			}
			game.log(player, map[control].replace(/一/, "了一"));
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			combo: "nshuanxian",
		},
	},
	nsshoudao: {
		group: ["nsshoudao_gain", "nsshoudao_die"],
		subSkill: {
			gain: {
				trigger: { player: "subPlayerDie" },
				forced: true,
				filter(event, player) {
					const left = player.storage.nshuanxian_left;
					if (left && player.hasSkill(left)) {
						return false;
					}
					const right = player.storage.nshuanxian_right;
					if (right && player.hasSkill(right)) {
						return false;
					}
					if (!player.storage.nshuanxian_damage) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					await player.addSkills(["releiji", "guidao"]);
				},
			},
			die: {
				trigger: { player: "die" },
				filter(event, player) {
					if (!game.hasPlayer(current => player != current && player != event.source)) {
						return false;
					}
					const left = player.storage.nshuanxian_left;
					if (left && player.hasSkill(left)) {
						return true;
					}
					const right = player.storage.nshuanxian_right;
					if (right && player.hasSkill(right)) {
						return true;
					}
					return false;
				},
				skillAnimation: true,
				animationColor: "wood",
				forceDie: true,
				async cost(event, trigger, player) {
					const { source } = trigger;
					let str;
					const left = player.storage.nshuanxian_left;
					const right = player.storage.nshuanxian_right;
					if (left && player.hasSkill(left) && right && player.hasSkill(right)) {
						str = "令一名其他角色获得技能【雷击】和【鬼道】";
					} else {
						str = "令一名其他角色获得技能【雷击】或【鬼道】";
					}
					if (source) {
						str += "（" + get.translation(source) + "除外）";
					}
					event.result = await player
						.chooseTarget((card, player, target) => {
							return target != player && target != _status.event.source;
						}, get.prompt(event.name.slice(0, -5)))
						.set("ai", target => {
							if (target.hasSkill("releiji")) {
								return 0;
							}
							return get.attitude(get.player(), target);
						})
						.set("source", source)
						.set("prompt2", str)
						.set("forceDie", true)
						.forResult();
				},
				async content(event, trigger, player) {
					const {
						targets: [target],
					} = event;
					const left = player.storage.nshuanxian_left;
					const right = player.storage.nshuanxian_right;
					if (left && player.hasSkill(left) && right && player.hasSkill(right)) {
						await target.addSkills(["releiji", "guidao"]);
					} else {
						const control = await player
							.chooseControl("releiji", "guidao")
							.set("prompt", `令${get.translation(target)}获得一项技能`)
							.forResultControl();
						await target.addSkills(control);
					}
				},
			},
		},
		ai: { combo: "nshuanxian" },
	},
	nshuanxian: {
		trigger: { global: "gameStart", player: "enterGame" },
		forced: true,
		nosub: true,
		unique: true,
		group: ["nshuanxian_left", "nshuanxian_right", "nshuanxian_damage", "nshuanxian_swap", "nshuanxian_draw"],
		content() {
			player.storage.nshuanxian_right = player.addSubPlayer({
				name: "ns_nanhua_right",
				skills: ["nshuanxian_left", "nshuanxian_draw", "nshuanxian_swap"],
				hp: 2,
				maxHp: 2,
				hs: get.cards(2),
				skill: "nshuanxian",
				intro: "你的本体回合结束后，切换至此随从并进行一个额外的回合；若你的上家与下家不同，在你的下家的准备阶段，切换至此随从",
				intro2: "当前回合结束后切换回本体",
				onremove(player) {
					delete player.storage.nshuanxian_right;
				},
			});
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp <= 2) {
							return;
						}
						if (!target.storage.nshuanxian_damage) {
							if (get.attitude(player, target) < 0 || get.tag(card, "multineg")) {
								return [0, 1];
							}
							return [1, 1];
						}
					}
				},
			},
		},
		subSkill: {
			chosen: {},
			leftdist: {
				mod: {
					globalFrom(from, to, distance) {},
					globalTo(from, to, distance) {},
				},
			},
			rightdist: {
				mod: {
					globalFrom(from, to, distance) {},
					globalTo(from, to, distance) {},
				},
			},
			swap: {
				trigger: { global: "phaseBegin" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.player != player;
				},
				priority: 20,
				content() {
					var next = player.getNext();
					var prev = player.getPrevious();
					var left = player.storage.nshuanxian_left;
					var right = player.storage.nshuanxian_right;
					if (prev == next || (trigger.player != next && trigger.player != prev)) {
						if (player.hasSkill("subplayer")) {
							player.exitSubPlayer();
						}
					} else if (prev == trigger.player && player.name != left && left) {
						if (!player.hasSkill("subplayer")) {
							player.callSubPlayer(left);
						} else {
							player.toggleSubPlayer(left);
						}
					} else if (next == trigger.player && player.name != right && right) {
						if (!player.hasSkill("subplayer")) {
							player.callSubPlayer(right);
						} else {
							player.toggleSubPlayer(right);
						}
					}
				},
			},
			damage: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return !player.storage.nshuanxian_damage;
				},
				content() {
					player.storage.nshuanxian_damage = true;
					player.storage.nshuanxian_left = player.addSubPlayer({
						name: "ns_nanhua_left",
						skills: ["nshuanxian_middle", "nshuanxian_draw", "nshuanxian_swap"],
						hp: 2,
						maxHp: 2,
						hs: get.cards(2),
						skill: "nshuanxian",
						intro: "你的本体回合开始前，切换至此随从并进行一个额外的回合；若你的上家与下家不同，在你的上家的准备阶段，切换至此随从",
						intro2: "当前回合结束后切换回本体",
						onremove(player) {
							delete player.storage.nshuanxian_left;
						},
					});
					trigger.nshuanxian = true;
				},
			},
			draw: {
				trigger: { player: "phaseDrawBegin" },
				silent: true,
				filter(event) {
					return event.num > 0;
				},
				content() {
					trigger.num--;
				},
			},
			left: {
				trigger: { player: "phaseBefore" },
				forced: true,
				popup: false,
				priority: 40,
				filter(event, player) {
					if (event.skill == "nshuanxian_middle") {
						return false;
					}
					if (event.skill == "nshuanxian_right") {
						return false;
					}
					var left = player.storage.nshuanxian_left;
					if (player.hasSkill("subplayer")) {
						if (!left) {
							return player.name == player.storage.nshuanxian_right;
						}
						return player.storage.subplayer.skills.includes(left);
					} else {
						if (!left) {
							return false;
						}
						return player.hasSkill(left);
					}
				},
				content() {
					if (player.hasSkill("subplayer")) {
						var left = player.storage.nshuanxian_left;
						if (left && player.storage.subplayer.skills.includes(left)) {
							player.toggleSubPlayer(player.storage.nshuanxian_left);
						} else {
							player.exitSubPlayer();
						}
					} else {
						player.callSubPlayer(player.storage.nshuanxian_left);
					}
				},
			},
			middle: {
				trigger: { player: ["phaseAfter", "phaseCancelled"] },
				forced: true,
				popup: false,
				priority: -40,
				filter(event, player) {
					if (player.hasSkill("nshuanxian_chosen")) {
						return false;
					}
					return true;
				},
				content() {
					player.exitSubPlayer();
					player.insertPhase(null, true);
				},
			},
			right: {
				trigger: { player: ["phaseAfter", "phaseCancelled"] },
				forced: true,
				popup: false,
				priority: -40,
				filter(event, player) {
					if (player.hasSkill("nshuanxian_chosen")) {
						return false;
					}
					if (player.hasSkill("subplayer")) {
						return false;
					}
					var right = player.storage.nshuanxian_right;
					if (!right) {
						return false;
					}
					return player.hasSkill(right);
				},
				content() {
					player.callSubPlayer(player.storage.nshuanxian_right);
					player.insertPhase(null, true);
					player.addTempSkill("nshuanxian_chosen", ["phaseBegin", "phaseCancelled"]);
				},
			},
			end: {
				trigger: { player: ["phaseAfter", "phaseCancelled"] },
				forced: true,
				popup: false,
				priority: -40,
				filter(event, player) {
					if (player.hasSkill("nshuanxian_chosen")) {
						return false;
					}
					return true;
				},
				content() {
					if (player.hasSkill("subplayer")) {
						player.exitSubPlayer();
					}
				},
				content_old() {
					"step 0";
					var controls = ["本体"];
					var left = player.storage.nshuanxian_left;
					var right = player.storage.nshuanxian_right;
					if (player.hasSkill("subplayer")) {
						if (player.storage.subplayer.skills.includes(left)) {
							controls.unshift("幻身·左");
						}
						if (player.storage.subplayer.skills.includes(right)) {
							controls.push("幻身·右");
						}
					} else {
						if (player.hasSkill(left)) {
							controls.unshift("幻身·左");
						}
						if (player.hasSkill(right)) {
							controls.push("幻身·右");
						}
					}
					if (controls.length > 1) {
						player
							.chooseControl(controls, function (event, player) {
								return Math.floor(Math.random() * _status.event.num);
							})
							.set("prompt", "选择一个形态直到下一回合开始")
							.set("num", controls.length);
					} else {
						event.finish();
					}
					"step 1";
					switch (result.control) {
						case "幻身·左": {
							if (!player.hasSkill("subplayer")) {
								player.callSubPlayer(player.storage.nshuanxian_left);
							} else {
								player.toggleSubPlayer(player.storage.nshuanxian_left);
							}
							break;
						}
						case "幻身·右": {
							if (!player.hasSkill("subplayer")) {
								player.callSubPlayer(player.storage.nshuanxian_right);
							}
							break;
						}
						default: {
							if (player.hasSkill("subplayer")) {
								player.exitSubPlayer();
							}
							break;
						}
					}
					player.addTempSkill("nshuanxian_chosen", "phaseBegin");
				},
			},
		},
	},
	nsnongquan: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") == 1 && player.canUse("wuzhong", player);
		},
		direct: true,
		delay: 0,
		content() {
			player.useCard({ name: "wuzhong" }, player.getCards("h"), player, "nsnongquan");
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					return 10 - get.value(player.getCards("h")[0]);
				},
			},
		},
	},
	nsdufu: {
		trigger: { source: "damageBefore" },
		check(event, player) {
			return event.player.hasSkillTag("maixie");
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("nsdufu"), function (card, player, target) {
					return target != player;
				})
				.set("ai", function (target) {
					if (_status.event.bool) {
						return -get.attitude(_status.event.player, target);
					}
					return 0;
				})
				.set("bool", trigger.player.hasSkillTag("maixie_defend"));
			"step 1";
			if (result.bool) {
				player.logSkill("nsdufu", result.targets);
				trigger.source = result.targets[0];
			}
		},
	},
	liangji: {
		audio: ["liangji", 2],
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && !target.hasSkill("liangji_1");
		},
		content() {
			"step 0";
			player.chooseCard("h", "环计：将一张牌置于" + get.translation(target) + "的武将牌上", true).set("ai", function (card) {
				if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
					return 7 - get.value(card);
				}
				return -get.value(card);
			});
			"step 1";
			if (result.bool) {
				player.$give(result.cards, target);
				player.lose(result.cards, ui.special);
				target.storage.liangji_1 = result.cards;
				target.storage.liangji_1_source = target;
				target.syncStorage("liangji_1");
				target.addSkill("liangji_1");
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (get.attitude(player, target) > 0) {
						return Math.sqrt(target.countCards("he"));
					}
					return 0;
				},
				player: 1,
			},
		},
		subSkill: {
			1: {
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				mark: true,
				intro: {
					content: "cards",
				},
				content() {
					"step 0";
					var cards = player.storage.liangji_1;
					if (cards) {
						player.gain(cards, "gain2");
					}
					player.storage.liangji_1 = 0;
					"step 1";
					if (player.sex == "male") {
						player.addTempSkill("wushuang");
					}
					if (player.sex == "female") {
						player.addTempSkill("lijian");
					}
					player.removeSkill("liangji_1");
				},
				sub: true,
			},
		},
	},
	jugong: {
		audio: ["jingong", 2],
		trigger: {
			global: "damageEnd",
		},
		usable: 1,
		frequent: true,
		marktext: "功",
		init(player) {
			player.storage.jugong = [];
		},
		filter(event, player) {
			return event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.notLink() && _status.currentPhase != player;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			if (player.countCards("h")) {
				player.chooseCard("将" + get.cnNumber(1) + "张手牌置于武将牌上作为“功”", 1, true);
			} else {
				event.finish();
			}
			"step 2";
			if (result.cards && result.cards.length) {
				player.lose(result.cards, ui.special);
				player.storage.jugong = player.storage.jugong.concat(result.cards);
				player.syncStorage("jugong");
				player.markSkill("jugong");
				game.log(player, "将", result.cards, "置于武将牌上作为“功”");
			}
		},
		intro: {
			content: "cards",
		},
		group: "jugong_1",
		subSkill: {
			1: {
				trigger: {
					player: "damageBegin",
				},
				filter(event, player) {
					return player.storage.jugong.length > 1;
				},
				content() {
					"step 0";
					player.chooseCardButton("移去两张“功”", 2, player.storage.jugong, true);
					"step 1";
					if (event.directresult || result.bool) {
						player.logSkill("jugong");
						var links = event.directresult || result.links;
						for (var i = 0; i < links.length; i++) {
							player.storage.jugong.remove(links[i]);
						}
						player.syncStorage("jugong");
						if (!player.storage.jugong.length) {
							player.unmarkSkill("jugong");
						} else {
							player.markSkill("jugong");
						}
						player.$throw(links);
						game.log(player, "被移去了", links);
						for (var i = 0; i < links.length; i++) {
							ui.discardPile.appendChild(links[i]);
						}
					}
					"step 2";
					trigger.cancel();
				},
				sub: true,
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [0.5, get.tag(card, "damage") * 2];
						}
						if (!target.hasSkill("paiyi") && target.hp > 1) {
							return [0.5, get.tag(card, "damage") * 1.5];
						}
						if (target.hp == 3) {
							return [0.5, get.tag(card, "damage") * 0.2];
						}
						if (target.hp == 2) {
							return [0.1, get.tag(card, "damage") * 0.1];
						}
					}
				},
			},
		},
	},
	chengmou: {
		audio: ["moucheng", 2],
		trigger: {
			player: "phaseDrawBegin",
		},
		frequent: true,
		filter(event, player) {
			return player.storage.jugong.length > 0;
		},
		content() {
			"step 0";
			if (player.storage.jugong.length > 2) {
				player.loseHp();
			}
			"step 1";
			var cards = player.storage.jugong;
			if (cards) {
				player.gain(cards, "gain2");
			}
			player.storage.jugong = [];
			"step 2";
			trigger.cancel();
		},
		ai: {
			combo: "jugong",
		},
	},
	nsxinsheng: {
		trigger: { source: "damageEnd" },
		frequent: true,
		filter(event, player) {
			return player.isHealthy();
		},
		content() {
			player.gainMaxHp(trigger.num, true);
			player.draw(trigger.num);
		},
	},
	nsdunxing: {
		trigger: { player: "damageBefore" },
		filter(event, player) {
			return player.isDamaged();
		},
		content() {
			trigger.cancel();
			player.loseMaxHp(trigger.num, true);
			player.draw(trigger.num);
		},
	},
	tiangong: {
		group: ["tiangong2"],
		trigger: { player: "damageBefore" },
		filter(event) {
			if (event.nature == "thunder") {
				return true;
			}
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (card.name == "tiesuo") {
						return 0.1;
					}
					if (get.tag(card, "thunderDamage")) {
						return "zeroplayertarget";
					}
				},
			},
			threaten: 0.5,
		},
	},
	tiangong2: {
		trigger: { source: "damageAfter" },
		sourceSkill: "tiangong",
		filter(event) {
			if (event.nature == "thunder") {
				return true;
			}
		},
		forced: true,
		popup: false,
		priority: 1,
		content() {
			player.draw();
		},
	},
	nsdingzhou: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("hej") > 0;
		},
		content() {
			"step 0";
			var cards = target.getCards("hej");
			if (get.isLuckyStar(player)) {
				var cardx = ui.cardPile.firstChild;
				if (cardx) {
					var color = get.color(card),
						cardsx = cards.filter(function (i) {
							return get.color(i) == color;
						});
					if (cardsx.length > 0) {
						cards = cardsx;
					}
				}
			}
			var card = cards.randomGet();
			event.card = card;
			player.gain(card, target, "giveAuto", "bySelf");
			player.draw();
			"step 1";
			if (Array.isArray(result) && get.color(card) != get.color(result[0])) {
				player.loseHp();
			}
		},
		ai: {
			order: 7,
			result: { target: -1 },
		},
	},
	//比原版更令人难以吐槽的神孙权
	junkyuheng: {
		audio: "yuheng",
		trigger: { player: "phaseBegin" },
		forced: true,
		keepSkill: true,
		filter(event, player) {
			return player.hasCard(function (card) {
				return lib.filter.cardDiscardable(card, player, "junkyuheng");
			}, "he");
		},
		content() {
			"step 0";
			const num = player.getCards("he").reduce((arr, card) => arr.add(get.suit(card, player)), []).length;
			player
				.chooseToDiscard("he", true, [1, num], function (card, player) {
					if (!ui.selected.cards.length) {
						return true;
					}
					var suit = get.suit(card, player);
					for (var i of ui.selected.cards) {
						if (get.suit(i, player) == suit) {
							return false;
						}
					}
					return true;
				})
				.set("complexCard", true)
				.set("ai", function (card) {
					if (!player.hasValueTarget(card)) {
						return 5;
					}
					return 5 - get.value(card);
				});
			"step 1";
			if (result.bool) {
				var skills = lib.skill.junkyuheng.derivation.randomGets(result.cards.length);
				player.addAdditionalSkills("junkyuheng", skills, true);
			}
		},
		group: "junkyuheng_remove",
		derivation: ["olbingyi", "shenxing", "xiashu", "old_anxu", "rezhiheng", "xinanguo", "lanjiang", "xinfu_guanwei", "dimeng", "xindiaodu", "xingxue", "jiexun", "olhongyuan", "xinfu_youdi", "bizheng"],
		subSkill: {
			remove: {
				audio: "yuheng",
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.additionalSkills.junkyuheng && player.additionalSkills.junkyuheng.length > 0;
				},
				async content(event, trigger, player) {
					const skillslength = player.additionalSkills.junkyuheng.length;
					await player.removeAdditionalSkills("junkyuheng");
					await player.draw(skillslength);
				},
			},
		},
	},
	junkdili: {
		audio: "dili",
		trigger: { player: "changeSkillsAfter" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "wood",
		filter(event, player) {
			if (!event.addSkill.length) {
				return false;
			}
			var skills = player.getSkills(null, false, false).filter(function (i) {
				var info = get.info(i);
				return info && !info.charlotte;
			});
			return skills.length > player.maxHp;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			"step 1";
			var skills = player.getSkills(null, false, false).filter(function (i) {
				if (i == "junkdili") {
					return false;
				}
				var info = get.info(i);
				return info && !info.charlotte;
			});
			var next = player.chooseButton(["请选择失去任意个技能", [skills, "skill"]]);
			next.set("forced", true);
			next.set("selectButton", [1, skills.length]);
			next.set("ai", function (button) {
				var skill = button.link,
					skills = _status.event.skills.slice(0);
				skills.removeArray(["xinanguo", "lanjiang", "rezhiheng", "junkyuheng"]);
				switch (ui.selected.buttons.length) {
					case 0:
						if (skills.includes(skill)) {
							return 2;
						}
						if (skill == "junkyuheng") {
							return 1;
						}
						return Math.random();
					case 1:
						if (skills.length < 2) {
							return 0;
						}
						if (skills.includes(skill)) {
							return 2;
						}
						if (skill == "junkyuheng") {
							return 1;
						}
						return 0;
					case 2:
						if (skills.includes(skill)) {
							return 2;
						}
						if (skill == "junkyuheng") {
							return 1;
						}
						return 0;
					default:
						return 0;
				}
			});
			next.set("skills", skills);
			"step 2";
			if (result.bool) {
				var skills = result.links;
				player.removeSkills(skills.slice(0));
			}
			var list = lib.skill.junkdili.derivation;
			list = list.slice(0, Math.min(skills.length, list.length));
			player.addSkills(list);
		},
		ai: {
			combo: "junkyuheng",
		},
		derivation: ["junkshengzhi", "junkquandao", "junkchigang"],
	},
	junkshengzhi: {
		audio: "dili_shengzhi",
		trigger: { player: ["logSkill", "useSkillAfter"] },
		forced: true,
		filter(event, player) {
			if (event.type != "player") {
				return false;
			}
			var skill = get.sourceSkillFor(event);
			if (get.is.locked(skill)) {
				return false;
			}
			var info = get.info(skill);
			return !info.charlotte;
		},
		content() {
			player.addTempSkill("junkshengzhi_effect");
		},
		subSkill: {
			effect: {
				mod: {
					cardUsable: () => Infinity,
					targetInRange: () => true,
				},
				trigger: { player: "useCard1" },
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				content() {
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						player.getStat().card[trigger.card.name]--;
					}
					player.removeSkill("junkshengzhi_effect");
				},
				mark: true,
				intro: { content: "使用下一张牌无距离和次数限制" },
			},
		},
	},
	junkquandao: {
		audio: "dili_quandao",
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" || get.type(event.card, null, false) == "trick";
		},
		async content(event, trigger, player) {
			const cards1 = player.getCards("h", card => get.name(card) === "sha"),
				cards2 = player.getCards("h", card => get.type(card) === "trick");
			if (cards1.length !== cards2.length) {
				const num = cards1.length - cards2.length,
					cards = num > 0 ? cards1 : cards2;
				let i = 0;
				cards.forEach(card => {
					if (i < Math.abs(num) && lib.filter.cardDiscardable(card, player, "junkquandao")) {
						i++;
					}
				});
				if (i > 0) {
					await player.chooseToDiscard(i, true, `权道：请弃置${get.cnNumber(i)}张${num > 0 ? "杀" : "普通锦囊牌"}`, num > 0 ? card => get.name(card) === "sha" : card => get.type(card) === "trick");
				}
			}
			await player.draw();
		},
	},
	junkchigang: {
		audio: "dili_chigang",
		trigger: { player: "phaseChange" },
		forced: true,
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		filter(event, player) {
			return event.phaseList[event.num].indexOf("phaseJudge") != -1;
		},
		content() {
			player.changeZhuanhuanji(event.name);
			let phase = player.storage.junkchigang ? "phaseDraw" : "phaseUse";
			trigger.phaseList[trigger.num] = `${phase}|${event.name}`;
			game.delayx();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.type(card) == "delay") {
						return "zeroplayertarget";
					}
				},
			},
		},
		intro: {
			content(storage) {
				return "转换技，锁定技。判定阶段开始前，你取消此阶段。然后你获得一个额外的" + (storage ? "出牌阶段" : "摸牌阶段") + "。";
			},
		},
	},
	nsmanzhi: {
		audio: "dcmanzhi",
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		direct: true,
		filter(event, player) {
			var nums = [];
			game.countPlayer(current => {
				nums.add(current.hp);
				nums.add(current.maxHp);
				nums.add(current.countCards("h"));
				nums.add(current.countCards("e"));
				nums.add(current.countCards("j"));
			});
			for (var a of nums) {
				for (var b of nums) {
					if (0.5 * a * a + 2.5 * b - game.roundNumber == game.countPlayer()) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			"step 0";
			var nums = [];
			game.countPlayer(current => {
				nums.add(current.hp);
				nums.add(current.maxHp);
				nums.add(current.countCards("h"));
				nums.add(current.countCards("e"));
				nums.add(current.countCards("j"));
			});
			nums.sort((a, b) => a - b);
			var a = null,
				b = null,
				goon = false;
			for (a of nums) {
				for (b of nums) {
					if (0.5 * a * a + 2.5 * b - game.roundNumber == game.countPlayer()) {
						goon = true;
						break;
					}
				}
				if (goon) {
					break;
				}
			}
			player
				.chooseButton(2, [
					"蛮智：请选择让下列等式成立的A与B的值",
					'<div class="text center">目标等式</div>',
					`0.5 × A<sup>2</sup> + 2.5 × B - ${game.roundNumber} = ${game.countPlayer()}`,
					'<div class="text center">A的可选值</div>',
					[
						nums.map(i => {
							return [`A|${i}`, i == a ? `<span class="yellowtext">${i}</span>` : i];
						}),
						"tdnodes",
					],
					'<div class="text center">B的可选值</div>',
					[
						nums.map(i => {
							return [`B|${i}`, i == b ? `<span class="yellowtext">${i}</span>` : i];
						}),
						"tdnodes",
					],
				])
				.set("filterButton", function (button) {
					if (!ui.selected.buttons.length) {
						return true;
					}
					return button.link[0] != ui.selected.buttons[0].link[0];
				})
				.set("filterOk", function () {
					if (ui.selected.buttons.length != 2) {
						return false;
					}
					var a, b;
					for (var i of ui.selected.buttons) {
						if (i.link[0] == "A") {
							a = parseInt(i.link.slice(2));
						} else {
							b = parseInt(i.link.slice(2));
						}
					}
					return 0.5 * a * a + 2.5 * b - game.roundNumber == game.countPlayer();
				})
				.set("choice", [a, b])
				.set("ai", button => {
					var choice = _status.event.choice;
					if (button.link == `A|${choice[0]}` || button.link == `B|${choice[1]}`) {
						return 1;
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				var a, b;
				for (var i of result.links) {
					if (i[0] == "A") {
						a = parseInt(i.slice(2));
					} else {
						b = parseInt(i.slice(2));
					}
				}
				equals = `0.5×${a}<sup>2</sup>+2.5×${b}-${game.roundNumber}=${game.countPlayer()}`;
				player.logSkill("nsmanzhi");
				player.chat(equals);
				game.log(player, "的计算结果为", equals);
				player.draw(game.countPlayer());
			}
		},
	},
};

export default skills;
