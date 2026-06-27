import html from "dedent";
import { lib, game, ui, get, ai, _status } from "noname";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "identity",
		start: [
			async (event, trigger, player) => {
				if (!lib.config.new_tutorial) {
					ui.arena.classList.add("only_dialog");
				}
				_status.mode = get.config("identity_mode");
				if (_status.brawl && _status.brawl.submode) {
					_status.mode = _status.brawl.submode;
				}
				event.replacePile = () => {
					const list = ["shengdong", "qijia", "caomu", "jinchan", "zengbin", "fulei", "qibaodao", "zhungangshuo", "lanyinjia"];
					const map = {
						shunshou: "shengdong",
						jiedao: "qijia",
						bingliang: "caomu",
						wuxie: "jinchan",
						wuzhong: "zengbin",
						wugu: "zengbin",
						shandian: "fulei",
						qinggang: "qibaodao",
						qinglong: "zhungangshuo",
						bagua: "lanyinjia",
					};
					lib.card.list = lib.card.list.filter(cardInfo => list.includes(cardInfo[2]));
					for (const cardInfo of lib.card.list) {
						if (map[name]) {
							cardInfo[2] = map[name];
							cardInfo._replaced = true;
						}
					}
				};
			},
			async (event, trigger, player) => {
				const playback = localStorage.getItem(lib.configprefix + "playback");
				if (playback) {
					ui.create.me();
					ui.arena.style.display = "none";
					ui.system.style.display = "none";
					_status.playback = playback;
					localStorage.removeItem(lib.configprefix + "playback");
					const store = lib.db.transaction(["video"], "readwrite").objectStore("video");
					store.get(parseInt(playback)).onsuccess = e => {
						if (e.target.result) {
							game.playVideoContent(e.target.result.video);
						} else {
							alert("播放失败：找不到录像");
							game.reload();
						}
					};
					event.finish();
				} else if (!_status.connectMode) {
					if (_status.mode == "zhong") {
						if (get.config("zhong_card")) {
							event.replacePile();
						}
						game.prepareArena(8);
					} else if (_status.mode == "purple") {
						game.prepareArena(8);
					} else {
						game.prepareArena();
					}
					if (!lib.config.new_tutorial) {
						game.delay();
					}
				}
			},
			async (event, trigger, player) => {
				if (lib.config.new_tutorial) {
					if (!_status.connectMode) {
						game.showChangeLog();
					}
					return;
				}

				_status.new_tutorial = true;
				lib.init.onfree();
				game.saveConfig("version", lib.version);

				await game.promises.saveConfig("new_tutorial", true);
				ui.create.dialog("欢迎来到无名杀，是否进入新手向导？");
				ui.dialog.add('<div class="text center">跳过后，你可以在选项-其它中重置新手向导');
				ui.auto.hide();

				const { promise, resolve } = Promise.withResolvers();

				ui.create.control("跳过向导", () => resolve(true));
				ui.create.control("继续", () => resolve(false));

				const skip_tutorial = await promise;

				if (!skip_tutorial) {
					await tutorial();
				}

				clear();
				ui.auto.show();
				ui.arena.classList.remove("only_dialog");

				async function tutorial() {
					if (!lib.config.phonelayout) {
						clear();
						ui.create.dialog("如果你在使用手机，可能会觉得按钮有点小" + "，将布局改成移动可以使按钮变大");
						ui.dialog.add('<div class="text center">你可以在选项-外观-布局中更改此设置');
						ui.create.control("使用移动布局", () => {
							if (lib.config.phonelayout) {
								ui.control.firstChild.firstChild.innerHTML = "使用移动布局";
								game.saveConfig("phonelayout", false);
								lib.init.layout("mobile");
							} else {
								ui.control.firstChild.firstChild.innerHTML = "使用默认布局";
								game.saveConfig("phonelayout", true);
								lib.init.layout("mobile");
							}
						});
						await new Promise(resolve => ui.create.control("继续", resolve));
					}

					if (lib.config.touchscreen) {
						clear();
						ui.create.dialog("触屏模式中，下划可以显示菜单，上划可以切换托管，双指单击可以暂停");
						ui.dialog.add('<div class="text center">你可以在选项-通用-中更改手势设置');
						await new Promise(resolve => ui.create.control("继续", resolve));
					}

					clear();
					ui.window.classList.add("noclick_important");
					ui.click.configMenu();
					ui.control.classList.add("noclick_click_important");
					ui.control.style.top = "calc(100% - 105px)";
					await new Promise(resolve => ui.create.control("在菜单中，可以进行各项设置", resolve));
					ui.click.menuTab("选项");
					await new Promise(resolve => ui.controls[0].replace("如果你感到游戏较卡，可以开启流畅模式", resolve));
					await new Promise(resolve => ui.controls[0].replace("在技能一栏中，可以设置自动发动或双将禁配的技能", resolve));
					ui.click.menuTab("武将");
					await new Promise(resolve => ui.controls[0].replace("在武将或卡牌一栏中，单击武将/卡牌可以将其禁用", resolve));
					ui.click.menuTab("其它");
					await new Promise(resolve => ui.controls[0].replace("在其它的关于一栏中，可以检查更新和下载素材", resolve));
					await new Promise(resolve => ui.controls[0].replace("在控制/命令一栏中，可以执行一些常见的操作/输入游戏命令", resolve));
					await new Promise(resolve => ui.controls[0].replace("在录像一栏中，可以管理游戏录像", resolve));
					ui.click.configMenu();
					ui.window.classList.remove("noclick_important");
					ui.control.classList.remove("noclick_click_important");
					ui.control.style.top = "";

					clear();
					ui.create.dialog("如果还有问题，欢迎来到无名杀仓库交流");
					ui.dialog.add(html`
						<div class="text center">
							无名杀仓库地址: https://github.com/libnoname/noname
							<br />
							提交BUG/发表意见: https://github.com/libnoname/noname/issues
							<br />
							讨论/提问/吹水: https://github.com/libnoname/noname/discussions
						</div>
					`);
					await new Promise(resolve => ui.create.control("完成", resolve));
				}

				function clear() {
					ui.dialog.close();
					while (ui.controls.length) {
						ui.controls[0].close();
					}
				}
			},
			async (event, trigger, player) => {
				if (typeof _status.new_tutorial == "function") {
					_status.new_tutorial();
				}
				delete _status.new_tutorial;
				if (_status.connectMode) {
					game.waitForPlayer(() => {
						if (lib.configOL.identity_mode == "zhong" || lib.configOL.identity_mode == "purple") {
							lib.configOL.number = 8;
						}
					});
				}
			},
			async (event, trigger, player) => {
				const yearLimitCheck = () => {
					const next = game.createEvent("year_limit_pop", false);
					next.setContent(async (event, trigger, player) => {
						const str = get.cnNumber(game.shuffleNumber + 1, true);
						game.me.$fullscreenpop(`第${str}年`, "thunder");
						game.log("游戏进入了", `#y第${str}年`);
						if (game.shuffleNumber + 1 < game.countPlayer2()) {
							return;
						} else {
							await game.delay(2);
						}
						game.me.$fullscreenpop("年份已到", "metal");
						game.log("年份已到，主忠方判定为胜利");
						await game.delay(2);
						game.over(game.me.identity == "zhu" || game.me.identity == "zhong" || game.me.identity == "mingzhong" || (game.me.identity == "commoner" && game.me.isIn()));
					});
				};
				if (_status.connectMode) {
					_status.mode = lib.configOL.identity_mode;
					if (_status.mode == "zhong") {
						lib.configOL.number = 8;
						if (lib.configOL.zhong_card) {
							event.replacePile();
						}
					} else if (_status.mode == "purple") {
						lib.configOL.number = 8;
					} else if (_status.mode == "normal") {
						if (lib.configOL.enable_commoner || lib.configOL.double_nei) {
							const identity = lib.configOL.enable_commoner ? "commoner" : "nei";
							for (const list of lib.config.mode_config.identity.identity.slice(1)) {
								let toReplace;
								if (list.filter(role => role == "nei").length >= 2) {
									toReplace = "nei";
								} else if (list.filter(role => role == "zhong").length > list.filter(role => role == "fan").length / 2) {
									toReplace = "zhong";
								} else {
									toReplace = "fan";
								}
								list.remove(toReplace);
								list.push(identity);
							}
							game.broadcast(identityList => (lib.config.mode_config.identity.identity = identityList), lib.config.mode_config.identity.identity);
						}
					}
					if (lib.configOL.number < 2) {
						lib.configOL.number = 2;
					}
					if (_status.mode != "purple" && lib.configOL.enable_year_limit) {
						lib.onwash.push(yearLimitCheck);
					}
					game.randomMapOL();
				} else {
					if (_status.mode == "normal" && (get.config("enable_commoner") || get.config("double_nei"))) {
						const identity = get.config("enable_commoner") ? "commoner" : "nei";
						for (const list of lib.config.mode_config.identity.identity.slice(1)) {
							let toReplace;
							if (list.filter(role => role == "nei").length >= 2) {
								toReplace = "nei";
							} else if (list.filter(role => role == "zhong").length > list.filter(role => role == "fan").length / 2) {
								toReplace = "zhong";
							} else {
								toReplace = "fan";
							}
							list.remove(toReplace);
							list.push(identity);
						}
					}
					if (_status.mode != "purple" && get.config("enable_year_limit")) {
						lib.onwash.push(yearLimitCheck);
					}
					for (const current of game.players) {
						current.getId();
					}
					if (_status.brawl && _status.brawl.chooseCharacterBefore) {
						_status.brawl.chooseCharacterBefore();
					}
					game.chooseCharacter();
				}
			},
			async (event, trigger, player) => {
				if (ui.coin) {
					_status.coinCoeff = get.coinCoeff([game.me.name]);
				}
				if (game.players.length == 2) {
					game.showIdentity(true);
					const map = {};
					for (const id in lib.playerOL) {
						map[id] = lib.playerOL[id].identity;
					}
					game.broadcast(map => {
						for (const id in map) {
							lib.playerOL[id].identity = map[id];
							lib.playerOL[id].setIdentity();
							lib.playerOL[id].ai.shown = 1;
						}
					}, map);
				} else {
					for (const current of game.players) {
						current.ai.shown = 0;
					}
				}
				const stratagemMode = _status.mode == "stratagem";
				if (stratagemMode) {
					let beginner;
					if (_status.cheat_seat) {
						const seat = _status.cheat_seat.link;
						beginner = seat == 0 ? game.me : game.players[game.players.length - seat];
						if (!beginner) {
							beginner = game.me;
						}
						delete _status.cheat_seat;
					} else {
						beginner = game.players[Math.floor(Math.random() * game.players.length)];
					}
					event.beginner = beginner;

					const stratagemBroadcast = () => {
						_status.stratagemFuryMax = 3;
						ui.css.stratagemCardStyle = lib.init.sheet([".card.stratagem-fury-glow:before{", "opacity:0.2;", "box-shadow:rgba(0,0,0,0.2) 0 0 0 1px,rgb(255,109,12) 0 0 5px,rgb(255,0,0) 0 0 10px;", "background-color:yellow;", "-webkit-filter:blur(5px);", "filter:blur(5px);", "}"].join(""));
					};
					game.broadcastAll(stratagemBroadcast);
					if (_status.connectMode && !_status.postReconnect.stratagemReinit) {
						_status.postReconnect.stratagemReinit = [stratagemBroadcast, {}];
					}
					for (const current of game.players) {
						if (current.identity == "zhu") {
							current.addSkill("stratagem_monarchy");
						}
						if (current.identity == "fan") {
							current.addSkill("stratagem_revitalization");
						}
					}
				}
				if (game.zhu == game.me && game.zhu.identity != "zhu" && _status.brawl && _status.brawl.identityShown) {
					delete game.zhu;
				} else {
					if (!stratagemMode) {
						game.zhu.ai.shown = 1;
					}
					if (game.zhu2) {
						game.zhong = game.zhu;
						game.zhu = game.zhu2;
						delete game.zhu2;
						if (game.zhong.sex == "male" && game.zhong.maxHp <= 4) {
							game.zhong.addSkill("dongcha");
						} else {
							game.zhong.addSkill("sheshen");
						}
					}
					let enhance_zhu = !["zhong", "stratagem", "purple"].includes(_status.mode),
						skill;
					if (enhance_zhu) {
						if (_status.connectMode) {
							enhance_zhu = lib.configOL.enhance_zhu;
						} else {
							enhance_zhu = get.config("enhance_zhu");
						}
					}
					if (enhance_zhu === "sixiang") {
						skill = "sixiang_" + ["zhuque", "xuanwu", "qinglong", "baihu"].randomGet();
					} else if (enhance_zhu === "specific" && get.population("fan") >= 3) {
						switch (game.zhu.name) {
							case "key_yuri":
								skill = "buqu";
								break;
							case "liubei":
								skill = "jizhen";
								break;
							case "dongzhuo":
								skill = "hengzheng";
								break;
							case "sunquan":
								skill = "batu"; // 英雄杀技能
								break;
							case "sp_zhangjiao":
								skill = "tiangong";
								break;
							case "liushan":
								skill = "shengxi";
								break;
							/** 玩点论杀技能 */
							case "sunce":
								skill = "ciqiu";
								break;
							case "re_sunben":
								skill = "ciqiu";
								break;
							case "yuanshao":
								skill = "geju";
								break;
							case "re_caocao":
								skill = "dangping"; // 古剑奇谭技能
								break;
							case "caopi":
								skill = "junxing";
								break;
							case "liuxie":
								skill = "moukui";
								break;
							default:
								skill = "tianming";
								break;
						}
					}
					if (skill) {
						game.broadcastAll(
							(player, skill) => {
								player.addSkill(skill);
								player.storage.enhance_zhu = skill;
							},
							game.zhu,
							skill
						);
					}
					let enable_mingcha;
					if (_status.connectMode) {
						enable_mingcha = lib.configOL.enable_mingcha;
					} else {
						enable_mingcha = get.config("enable_mingcha");
					}
					if (enable_mingcha) {
						game.broadcastAll(player => {
							player.addSkill("identity_mingcha");
						}, game.zhu);
					}
				}
				game.syncState();
				event.trigger("gameStart");

				const players = get.players(lib.sort.position);
				const info = [];
				for (const [index, current] of players.entries()) {
					const ifo = {
						name: current.name1,
						name2: current.name2,
						identity: current.identity,
						nickname: current.node.nameol.innerHTML,
					};
					if (stratagemMode) {
						ifo.translate = lib.translate[game.players[index].name];
						ifo.isCamouflaged = current.ai.stratagemCamouflage;
					}
					info.push(ifo);
				}
				_status.videoInited = true;
				game.addVideo("init", null, info);
				if (stratagemMode) {
					game.addVideo("arrangeLib", null, {
						skill: {
							stratagem_fury: {
								mark: true,
								marktext: "🔥",
								intro: {
									name: "怒气",
									content: "当前怒气值：#",
								},
							},
						},
					});
					for (const current of game.players) {
						//game.addVideo('markSkill', current, ['stratagem_fury']);
						current.ai.shown = 0;
					}
					game.stratagemCamouflage();
				}
			},
			async (event, trigger, player) => {
				if (_status.mode != "stratagem") {
					event.beginner = _status.firstAct2 || game.zhong || game.zhu || _status.firstAct || game.me;
				}
				game.gameDraw(event.beginner, player => {
					if (_status.mode == "purple" && player.seatNum > 5) {
						return 5;
					}
					return 4;
				});
				if (_status.connectMode && lib.configOL.change_card) {
					game.replaceHandcards(game.players.slice(0));
				}
			},
			async (event, trigger, player) => {
				game.phaseLoop(event.beginner);
			},
		],
		game: {
			/**
			 * 是否能在菜单中切换角色（换人）
			 *
			 * @returns {boolean}
			 */
			canReplaceViewpoint() {
				return true;
			},
			// 联机相关
			/**
			 * 联机中获取当前所有玩家的状态对象
			 */
			getState() {
				const state = {};
				for (const id in lib.playerOL) {
					const player = lib.playerOL[id];
					state[id] = { identity: player.identity };
					if (player == game.zhu) {
						state[id].zhu = true;
					}
					if (player == game.zhong) {
						state[id].zhong = true;
					}
					if (player.isZhu) {
						state[id].isZhu = true;
					}
					if (player.special_identity) {
						state[id].special_identity = player.special_identity;
					}
					state[id].shown = player.ai.shown;
					//state[i].group=player.group;
				}
				return state;
			},
			/**
			 * 联机中通过状态对象更新场上玩家的状态
			 */
			updateState(state) {
				for (const id in state) {
					const player = lib.playerOL[id];
					if (player) {
						player.identity = state[id].identity;
						if (state[id].identity == "rZhu" || state[id].identity == "bZhu") {
							game[state[id].identity] = player;
						}
						if (state[id].special_identity) {
							player.special_identity = state[id].special_identity;
							if (player.node.dieidentity) {
								player.node.dieidentity.innerHTML = get.translation(state[id].special_identity);
								player.node.identity.firstChild.innerHTML = get.translation(state[id].special_identity + "_bg");
							}
						}
						if (state[id].zhu) {
							game.zhu = player;
						}
						if (state[id].isZhu) {
							player.isZhu = true;
						}
						if (state[id].zhong) {
							game.zhong = player;
						}
						player.ai.shown = state[id].shown;
						//player.group=state[i].group;
						//player.node.name.dataset.nature=get.groupnature(player.group);
					}
				}
			},
			/**
			 * 给“房间信息”界面填充身份模式的联机房间配置
			 */
			getRoomInfo(uiintro) {
				uiintro.add('<div class="text chat">游戏模式：' + (lib.configOL.identity_mode == "zhong" ? "明忠" : "标准"));
				uiintro.add('<div class="text chat">双将模式：' + (lib.configOL.double_character ? "开启" : "关闭"));
				if (lib.configOL.identity_mode != "zhong") {
					if (lib.configOL.identity_mode == "stratagem") {
						uiintro.add('<div class="text chat">首轮强化：' + (lib.configOL.round_one_use_fury ? "开启" : "关闭"));
					} else if (lib.configOL.identity_mode != "purple") {
						uiintro.add('<div class="text chat">双内奸：' + (lib.configOL.double_nei ? "开启" : "关闭"));
						if (lib.configOL.identity_mode != "stratagem") {
							uiintro.add(
								`<div class="text chat">加强主公：${(() => {
									switch (lib.configOL.enhance_zhu) {
										case "sixiang":
											return "四象标记";
										case "specific":
											return "专属技能";
										default:
											return "关闭";
									}
								})()}`
							);
							uiintro.add('<div class="text chat">平民身份：' + (lib.configOL.enable_commoner ? "开启" : "关闭"));
						}
						uiintro.add('<div class="text chat">年机制：' + (lib.configOL.enable_year_limit ? "开启" : "关闭"));
					}
				} else {
					uiintro.add('<div class="text chat">卡牌替换：' + (lib.configOL.zhong_card ? "开启" : "关闭"));
				}
				let last = uiintro.add('<div class="text chat">出牌时限：' + lib.configOL.choose_timeout + "秒");
				if (lib.configOL.banned.length) {
					last = uiintro.add('<div class="text chat">禁用武将：' + get.translation(lib.configOL.banned));
				}
				if (lib.configOL.bannedcards.length) {
					last = uiintro.add('<div class="text chat">禁用卡牌：' + get.translation(lib.configOL.bannedcards));
				}
				last.style.paddingBottom = "8px";
			},
			/**
			 * 获取某角色可能的身份对象
			 *
			 * @param {Player} player
			 */
			getIdentityList(player) {
				if (player.identityShown) {
					return;
				}
				if (player == game.me) {
					return;
				}
				if (_status.mode == "purple") {
					if (_status.yeconfirm && ["rNei", "bNei"].includes(game.me.identity) && ["rNei", "bNei"].includes(player.identity)) {
						return;
					}
					if (player.identity.slice(0, 1) == "r") {
						return {
							cai2: "猜",
							rZhong: "忠",
							rNei: "内",
							rYe: "野",
						};
					}
					return {
						cai: "猜",
						bZhong: "忠",
						bNei: "内",
						bYe: "野",
					};
				} else if (_status.mode == "zhong") {
					if (player.fanfixed) {
						return;
					}
					if (game.zhu && game.zhu.isZhu) {
						return {
							fan: "反",
							zhong: "忠",
							nei: "内",
							cai: "猜",
						};
					} else {
						return {
							fan: "反",
							zhong: "忠",
							nei: "内",
							zhu: "主",
							cai: "猜",
						};
					}
				} else if (_status.mode == "stratagem") {
					if ((game.zhu && game.zhu.isZhu && game.zhu.identityShown) || game.me.identity == "zhu") {
						return {
							fan: "反",
							zhong: "忠",
							nei: "内",
							enemy: "敌",
							friend: "友",
							cai: "猜",
						};
					} else {
						return {
							fan: "反",
							zhong: "忠",
							nei: "内",
							zhu: "主",
							enemy: "敌",
							friend: "友",
							cai: "猜",
						};
					}
				} else {
					if (get.config("enable_commoner")) {
						return {
							fan: "反",
							zhong: "忠",
							nei: "内",
							commoner: "民",
							cai: "猜",
						};
					} else {
						return {
							fan: "反",
							zhong: "忠",
							nei: "内",
							cai: "猜",
						};
					}
				}
			},
			/**
			 * 将`game.getIdentityList`返回对象的身份名变完整
			 *
			 * @param {object} list
			 * @returns {void}
			 */
			getIdentityList2(list) {
				for (var i in list) {
					switch (i) {
						case "fan":
							list[i] = "反贼";
							break;
						case "zhong":
							list[i] = "忠臣";
							break;
						case "nei":
							list[i] = "内奸";
							break;
						case "commoner":
							list[i] = "平民";
							break;
						case "zhu":
							list[i] = "主公";
							break;
						case "enemy":
							list[i] = "敌方";
							break;
						case "friend":
							list[i] = "友方";
							break;
						case "cai":
						case "cai2":
							list[i] = "未知";
							break;
						case "rZhong":
						case "bZhong":
							list[i] = "前锋";
							break;
						case "rNei":
						case "bNei":
							list[i] = "细作";
							break;
						case "rYe":
						case "bYe":
							list[i] = "野心家";
							break;
					}
				}
			},
			/**
			 * 获取当前局势生成的录像名字
			 *
			 * @returns {[playerName: string, gameName: string]}
			 */
			getVideoName() {
				let str = get.translation(game.me.name);
				if (game.me.name2) {
					str += "/" + get.translation(game.me.name2);
				}
				let str2 = "";
				if (game.identityVideoName) {
					str2 = game.identityVideoName;
				} else {
					switch (_status.mode) {
						case "purple":
							str2 = "3v3v2 - " + (game.me.identity.indexOf("r") == 0 ? "暖色" : "冷色") + lib.translate[game.me.identity + "2"];
							break;
						case "zhong":
							str2 = "忠胆英杰 - " + lib.translate[game.me.identity + "2"];
							break;
						case "stratagem":
							str2 = get.cnNumber(get.playerNumber()) + "人谋攻" + "-" + lib.translate[game.me.identity + "2"];
							break;
						default:
							str2 = get.cnNumber(get.playerNumber()) + "人" + get.translation(lib.config.mode) + " - " + lib.translate[game.me.identity + "2"];
					}
				}
				return [str, str2];
			},
			/**
			 * 为当前对局增加战绩记录
			 *
			 * @param {Boolean} bool - 当前对局是否胜利
			 */
			async addRecord(bool) {
				if (typeof bool == "boolean") {
					const data = lib.config.gameRecord.identity.data;

					let identity = game.me.identity;
					if (identity === "mingzhong") {
						identity = "zhong";
					}
					if (!data[identity]) {
						data[identity] = [0, 0];
					}
					if (bool) {
						data[identity][0]++;
					} else {
						data[identity][1]++;
					}
					const identities = ["zhu", "zhong", "nei", "fan", "commoner"];
					let str = "";
					for (const identity of identities) {
						if (data[identity]) {
							str += lib.translate[identity + "2"] + "：" + data[identity][0] + "胜" + " " + data[identity][1] + "负<br>";
						}
					}
					lib.config.gameRecord.identity.str = str;
					await game.promises.saveConfig("gameRecord", lib.config.gameRecord);
				}
			},
			/**
			 * 公开并刷新所有玩家的身份显示。
			 *
			 * 会取消身份标记上的猜测状态，将每名玩家标记为已亮明身份，
			 * 同步其身份文案与特殊身份背景，并把主公玩家标记为 `isZhu`。
			 * 若当前存在点击猜身份的临时节点，也会一并删除并清空状态。
			 *
			 * @param {boolean} [me] - 兼容旧逻辑的保留参数，目前不会影响显示范围。
			 */
			showIdentity(me) {
				for (const player of game.players) {
					// if(me===false&&player==game.me) continue;
					player.node.identity.classList.remove("guessing");
					player.identityShown = true;
					player.ai.shown = 1;
					player.setIdentity(player.identity);
					if (player.special_identity) {
						player.node.identity.firstChild.innerHTML = get.translation(`${player.special_identity}_bg`);
					}
					if (player.identity == "zhu") {
						player.isZhu = true;
					}
				}
				if (!_status.clickingidentity) {
					return;
				}
				for (const identityNode of _status.clickingidentity[1]) {
					identityNode.delete();
					identityNode.style.transform = "";
				}
				delete _status.clickingidentity;
			},
			/**
			 * 根据当前身份模式和场上存活情况结算本机视角的胜负。
			 *
			 * 普通身份局会按主公、忠臣、反贼、内奸、平民的胜利条件判断；
			 * 3v3v2（purple）会先拆分冷暖阵营和野心家，写入联机结算用的胜负名单。
			 */
			checkResult() {
				const me = game.me._trueMe || game.me;
				if (_status.brawl && _status.brawl.checkResult) {
					_status.brawl.checkResult();
					return;
				} else if (_status.mode == "purple") {
					const winner = [];
					const loser = [];
					const ye = game.filterPlayer(current => ["rYe", "bYe"].includes(current.identity), null, true);
					const red = game.filterPlayer(current => ["rZhu", "rZhong", "bNei"].includes(current.identity), null, true);
					const blue = game.filterPlayer(current => ["bZhu", "bZhong", "rNei"].includes(current.identity), null, true);
					game.countPlayer2(current => {
						switch (current.identity) {
							case "rZhu":
								if (ye.length == 0 && game.bZhu.isDead()) {
									winner.push(current);
								}
								if (current.isDead()) {
									loser.push(current);
								}
								break;
							case "rZhong":
							case "bNei":
								if (ye.length == 0 && game.bZhu.isDead()) {
									winner.push(current);
								}
								if (game.rZhu.isDead()) {
									loser.push(current);
								}
								break;
							case "bZhu":
								if (ye.length == 0 && game.rZhu.isDead()) {
									winner.push(current);
								}
								if (current.isDead()) {
									loser.push(current);
								}
								break;
							case "bZhong":
							case "rNei":
								if (ye.length == 0 && game.rZhu.isDead()) {
									winner.push(current);
								}
								if (game.bZhu.isDead()) {
									loser.push(current);
								}
								break;
							default:
								if (red.length + blue.length == 0) {
									winner.push(current);
								} else if (game.rZhu.isDead() && game.bZhu.isDead()) {
									loser.push(current);
								}
								break;
						}
					}, true);
					const winner2 = winner.slice(0);
					const loser2 = loser.slice(0);
					for (const current of winner.slice()) {
						if (current.isDead()) {
							winner.remove(current);
						}
					}
					for (const current of loser.slice()) {
						if (current.isDead()) {
							loser.remove(current);
						}
					}
					if (winner.length > 0 || loser.length == game.players.length) {
						game.broadcastAll(
							(winner, loser) => {
								_status.winner = winner;
								_status.loser = loser;
							},
							winner,
							loser
						);
						if (loser.length == game.players.length) {
							game.showIdentity();
							game.over("游戏平局");
						} else if (winner2.includes(me)) {
							game.showIdentity();
							if (loser2.includes(me)) {
								game.over(false);
							} else {
								game.over(true);
							}
						} else {
							game.showIdentity();
							game.over(false);
						}
					}
					return;
				}
				if (!game.zhu) {
					if (get.population("fan") == 0) {
						switch (me.identity) {
							case "fan":
								game.over(false);
								break;
							case "zhong":
								game.over(true);
								break;
							case "commoner":
								game.over(true);
								break;
							default:
								game.over();
								break;
						}
					} else if (get.population("zhong") == 0) {
						switch (me.identity) {
							case "fan":
								game.over(true);
								break;
							case "zhong":
								game.over(false);
								break;
							case "commoner":
								game.over(true);
								break;
							default:
								game.over();
								break;
						}
					}
					return;
				}
				if (game.zhu.isAlive() && get.population("fan") + get.population("nei") > 0) {
					return;
				}
				if (game.zhong) {
					game.zhong.identity = "zhong";
				}
				game.showIdentity();
				if (me.identity == "zhu" || me.identity == "zhong" || me.identity == "mingzhong") {
					if (game.zhu.classList.contains("dead")) {
						game.over(false);
					} else {
						game.over(true);
					}
				} else if (me.identity == "nei") {
					if (game.players.length == 1 + game.players.filter(i => i.identity == "commoner").length && me.isAlive()) {
						game.over(true);
					} else {
						game.over(false);
					}
				} else if (me.identity == "fan") {
					if ((get.population("fan") + get.population("zhong") > 0 || get.population("nei") > 1) && game.zhu.classList.contains("dead")) {
						game.over(true);
					} else {
						game.over(false);
					}
				} else if (me.identity == "commoner") {
					game.over(true);
				}
			},
			/**
			 * 联机结算时检查指定玩家是否胜利。
			 *
			 * @param { Player } player - 要检查结算结果的玩家。
			 * @returns { boolean | null } 返回`true`表示胜利，`false`表示失败；所有玩家均失败时返回`null`。
			 */
			checkOnlineResult(player) {
				if (_status.winner && _status.loser) {
					if (_status.loser.length === game.players.length) {
						return null;
					}
					if (_status.loser.includes(player)) {
						return false;
					}
					if (_status.winner.includes(player)) {
						return true;
					}
				}
				if (game.zhu.isAlive()) {
					return player.identity === "zhu" || player.identity === "zhong" || player.identity === "mingzhong" || (player.identity === "commoner" && player.isAlive());
				} else if ((game.players.length == 1 + game.players.filter(i => i.identity === "commoner").length && game.players[0].identity === "nei") || game.players[0].identity === "commoner") {
					return player.isAlive();
				} else {
					return player.identity === "fan" || (player.identity === "commoner" && player.isAlive());
				}
			},
			/**
			 * @this {Game}
			 */
			chooseCharacterPurpleOL() {
				const next = game.createEvent("chooseCharacter");
				/** @type { ContentFuncsByAll } */
				const contents = [
					// step 0
					async (event, trigger, player) => {
						ui.arena.classList.add("choose-character");
					},
					// step 1
					async (event, trigger, player) => {
						const list = ["rZhu", "rZhong", "rNei", "rYe"];
						const list2 = ["bZhu", "bZhong", "bNei", "bYe"];
						list.randomSort();
						list2.randomSort();
						const identityList = list.concat(list2);

						const num = get.rand(0, 7);
						const players = game.players.slice(num).concat(game.players.slice(0, num));

						game.broadcastAll(
							/**
							 * @param { Player[] } players
							 * @param { string[] } identityList
							 * @param { string[] } list
							 */
							(players, identityList, list) => {
								_status.mode = "purple";
								if (game.online) {
									ui.arena.classList.add("choose-character");
								}
								for (const [current, identity] of Iterator.zip([players, identityList])) {
									current.node.identity.classList.add("guessing");
									current.identity = identity;
									current.setIdentity(list.includes(identity) ? "cai2" : "cai");
									if (identity == "rZhu" || identity == "bZhu") {
										game[identity] = current;
										current.setIdentity(identity);
										current.identityShown = true;
										current.node.identity.classList.remove("guessing");
									}
								}
								game.zhu = game.rZhu;
								game.rZhu.isZhu = true;
								game.bZhu.isZhu = true;
								game.me.setIdentity();
								game.me.node.identity.classList.remove("guessing");
							},
							players,
							identityList,
							list
						);

						players.sortBySeat(game.zhu);
						for (const [i, current] of players.entries()) {
							current.seatNum = i;
						}
					},
					// step 2
					async (event, trigger, player) => {
						const map = {};
						const map_zhu = {};
						event.mapNum = {};
						const list = [];
						const libCharacter = {};
						for (const name of lib.configOL.characterPack) {
							const pack = lib.characterPack[name];
							for (const name in pack) {
								if (lib.character[name]) {
									libCharacter[name] = pack[name];
								}
							}
						}
						for (const name in libCharacter) {
							if (lib.filter.characterDisabled(name, libCharacter)) {
								continue;
							}
							if (name.indexOf("lingju") != -1 || get.is.double(name)) {
								continue;
							}
							const group = lib.character[name][1];
							if (lib.selectGroup.includes(group)) {
								continue;
							}
							if (!map[group]) {
								map[group] = [];
								list.push(group);
							}
							map[group].push(name);
							if (lib.character[name].isZhugong) {
								if (!map_zhu[group]) {
									map_zhu[group] = [];
								}
								map_zhu[group].push(name);
							}
						}
						for (const group in map) {
							if (map[group].length < 12) {
								delete map[group];
								list.remove(group);
							} else {
								event.mapNum[group] = map[group].length > 15 ? 5 : 3;
							}
						}
						list.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
						event.list = list;
						event.map = map;
						event.map_zhu = map_zhu;

						let result = await game.bZhu
							.chooseControl(list)
							.set("prompt", "请选择冷方武将势力")
							.set("ai", function () {
								return _status.event.choice;
							})
							.set("choice", event.list.randomGet())
							.forResult();
						event.bZhu = result.control;
						event.list.remove(event.bZhu);

						result = await game.rZhu
							.chooseControl(event.list)
							.set("prompt", "请选择暖方武将的势力")
							.set("ai", function () {
								return _status.event.choice;
							})
							.set("choice", event.list.randomGet())
							.forResult();
						event.rZhu = result.control;
					},
					// step 3
					async (event, trigger, player) => {
						const players = [game.rZhu, game.bZhu];
						const list = [];
						for (const current of players) {
							var group = event[current.identity];
							var str = "选择角色";
							var list2 = event.map[group].randomGets(4);
							if (event.map_zhu[group]) {
								list2.addArray(event.map_zhu[group].randomGets(2));
							}
							event.map[current.playerid] = list2;
							list.push([current, [str, [list2, "character"]], true]);
						}
						game.me.chooseButtonOL(list, (player, result) => {
							if (game.online || player === game.me) {
								player.init(result.links[0]);
								if (!player.isInitFilter("noZhuHp")) {
									player.hp++;
									player.maxHp++;
									player.update();
								}
							}
						});
					},
					// step 4
					async (event, trigger, player, result) => {
						for (const current in result) {
							if (result[current] === "ai" || !result[current] || !result[current].links) {
								result[current] = event.map[current].randomGet();
							} else {
								result[current] = result[current].links;
							}
							const group = lib.character[result[current][0]][1];
							event.map[group].remove(result[current][0]);
							if (!lib.playerOL[current].name) {
								lib.playerOL[current].init(result[current][0]);
							}
						}
						game.broadcast(result => {
							for (const current in result) {
								if (!lib.playerOL[current].name) {
									lib.playerOL[current].init(result[current][0], result[current][1]);
									if (!lib.playerOL[current].isInitFilter("noZhuHp")) {
										lib.playerOL[current].hp++;
										lib.playerOL[current].maxHp++;
										lib.playerOL[current].update();
									}
								}
							}
						}, result);

						const list = [];
						const players = game.players.slice(0);
						players.removeArray([game.rZhu, game.bZhu]);
						for (const current of players) {
							var group = event[current.identity.slice(0, 1) + "Zhu"];
							var str = "选择角色";
							var list2 = event.map[group].randomRemove(event.mapNum[group]);
							event.map[current.playerid] = list2;
							list.push([current, [str, [list2, "character"]], true]);
						}
						game.me.chooseButtonOL(list, (player, result) => {
							if (game.online || player === game.me) {
								player.init(result.links[0]);
							}
						});
					},
					// step 5
					async (event, trigger, player, result) => {
						for (const current in result) {
							if (result[current] == "ai" || !result[current] || !result[current].links) {
								result[current] = event.map[current].randomGet();
							} else {
								result[current] = result[current].links;
							}
							const group = lib.character[result[current][0]][1];
							event.map[group].remove(result[current][0]);
							if (!lib.playerOL[current].name) {
								lib.playerOL[current].init(result[current][0]);
							}
						}
						game.broadcast(result => {
							for (const current in result) {
								if (!lib.playerOL[current].name) {
									lib.playerOL[current].init(result[current][0], result[current][1]);
								}
							}
							setTimeout(() => {
								ui.arena.classList.remove("choose-character");
							}, 500);
						}, result);
						setTimeout(() => {
							ui.arena.classList.remove("choose-character");
						}, 500);
					},
				];
				next.setContent(contents);
			},
			/**
			 * @this {Game}
			 */
			chooseCharacterPurple() {
				const next = game.createEvent("chooseCharacter");
				/** @type { ContentFuncsByAll } */
				const contents = [
					// step 0
					async (event, trigger, player) => {
						ui.arena.classList.add("choose-character");
						game.no_continue_game = true;
						lib.init.onfree();
					},
					// step 1
					async (event, trigger, player) => {
						const list = ["rZhu", "rZhong", "rNei", "rYe"];
						const list2 = ["bZhu", "bZhong", "bNei", "bYe"];
						list.randomSort();
						list2.randomSort();
						const identityList = list.concat(list2);
						const num = get.rand(0, 7);

						const players = game.players.slice(num).concat(game.players.slice(0, num));
						for (const [current, identity] of Iterator.zip([players, identityList])) {
							current.node.identity.classList.add("guessing");
							current.identity = identity;
							current.setIdentity(list.includes(identity) ? "cai2" : "cai");
							if (identity === "rZhu" || identity === "bZhu") {
								game[identity] = current;
								current.setIdentity(identity);
								current.identityShown = true;
								current.node.identity.classList.remove("guessing");
							}
						}
						game.zhu = game.rZhu;
						game.rZhu.isZhu = true;
						game.bZhu.isZhu = true;
						game.me.setIdentity();
						game.me.node.identity.classList.remove("guessing");
						players.sortBySeat(game.zhu);
						for (const [i, current] of players.entries()) {
							current.seatNum = i;
						}
					},
					// step 2
					async (event, trigger, player) => {
						const map = {};
						const map_zhu = {};
						const list = [];
						for (const charaName in lib.character) {
							if (lib.filter.characterDisabled(charaName)) {
								continue;
							}
							if (charaName.indexOf("lingju") != -1 || get.is.double(charaName)) {
								continue;
							}
							const group = lib.character[charaName][1];
							if (lib.selectGroup.includes(group)) {
								continue;
							}
							if (!map[group]) {
								map[group] = [];
								list.push(group);
							}
							map[group].push(charaName);
							if (lib.character[charaName].isZhugong) {
								if (!map_zhu[group]) {
									map_zhu[group] = [];
								}
								map_zhu[group].push(charaName);
							}
						}
						for (const group in map) {
							if (map[group].length < 12) {
								delete map[group];
								list.remove(group);
							}
						}
						list.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
						event.list = list;
						event.map = map;
						event.map_zhu = map_zhu;

						let result = await game.bZhu
							.chooseControl(list)
							.set("prompt", "请选择冷方武将势力")
							.set("ai", function () {
								return _status.event.choice;
							})
							.set("choice", event.list.randomGet())
							.forResult();
						event.bZhu = result.control;
						event.list.remove(event.bZhu);

						result = await game.rZhu
							.chooseControl(event.list)
							.set("prompt", "请选择暖方武将的势力")
							.set("ai", function () {
								return _status.event.choice;
							})
							.set("choice", event.list.randomGet())
							.forResult();
						event.rZhu = result.control;
					},
					// step 3
					async (event, trigger, player) => {
						if (game.me === game.rZhu || game.me === game.bZhu) {
							event.isZhu = true;
							const list = event.map[event[game.me.identity]].randomGets(4);
							if (event.map_zhu[event[game.me.identity]]) {
								list.addArray(event.map_zhu[event[game.me.identity]].randomGets(2));
							}
							game.me.chooseButton(true, ["请选择您的武将牌", [list, "character"]]);
						}
					},
					// step 4
					async (event, trigger, player, result) => {
						if (event.isZhu) {
							event.map[event[game.me.identity]].remove(result.links[0]);
							game.me.init(result.links[0]);
						}
						if (!game.rZhu.name) {
							const list = event.map[event.rZhu].randomGets(3);
							if (event.map_zhu[event.rZhu]) {
								list.addArray(event.map_zhu[event.rZhu]);
							}
							const character = list.randomGet();
							event.map[event.rZhu].remove(character);
							game.rZhu.init(character);
						}
						if (!game.bZhu.name) {
							const list = event.map[event.bZhu].randomGets(4);
							if (event.map_zhu[event.bZhu]) {
								list.addArray(event.map_zhu[event.bZhu].randomGets(2));
							}
							const character = list.randomGet();
							event.map[event.bZhu].remove(character);
							game.bZhu.init(character);
						}
						if (!game.rZhu.isInitFilter("noZhuHp")) {
							game.rZhu.maxHp++;
							game.rZhu.hp++;
							game.rZhu.update();
						}
						if (!game.bZhu.isInitFilter("noZhuHp")) {
							game.bZhu.maxHp++;
							game.bZhu.hp++;
							game.bZhu.update();
						}
						if (!event.isZhu) {
							var group = game.me.identity.indexOf("r") == 0 ? event.rZhu : event.bZhu;
							game.me.chooseButton(true, ["请选择您的武将牌", [event.map[group].randomRemove(5), "character"]]);
						}
					},
					// step 5
					async (event, trigger, player, result) => {
						if (!event.isZhu) {
							game.me.init(result.links[0]);
						}
						for (const current of game.filterPlayer()) {
							if (!current.name) {
								const group = current.identity.indexOf("r") === 0 ? event.rZhu : event.bZhu;
								current.init(event.map[group].randomRemove(1)[0]);
							}
						}
					},
					// step 6
					async (event, trigger, player) => {
						setTimeout(() => {
							ui.arena.classList.remove("choose-character");
						}, 500);
					},
				];
				next.setContent(contents);
			},
			/**
			 * @this {Game}
			 */
			chooseCharacterStratagemOL() {
				const next = game.createEvent("chooseCharacter");
				/** @type { ContentFuncsByAll } */
				const contents = [
					// step 0
					async (event, trigger, player) => {
						ui.arena.classList.add("choose-character");

						const identityList = get.identityList(game.players.length);
						if (lib.configOL.double_nei) {
							switch (lib.configOL.number) {
								case 8:
									identityList.remove("fan");
									identityList.push("nei");
									break;
								case 7:
									identityList.remove("zhong");
									identityList.push("nei");
									break;
								case 6:
									identityList.remove("fan");
									identityList.push("nei");
									break;
								case 5:
									identityList.remove("fan");
									identityList.push("nei");
									break;
								case 4:
									identityList.remove("zhong");
									identityList.push("nei");
									break;
								case 3:
									identityList.remove("fan");
									identityList.push("nei");
									break;
							}
						}
						identityList.randomSort();
						for (const [current, identity] of Iterator.zip([game.players, identityList])) {
							current.identity = identity;
							current.setIdentity("cai");
							current.node.identity.classList.add("guessing");
							if (identity === "zhu") {
								game.zhu = current;
							}
							current.identityShown = false;
						}
						game.me.setIdentity();
						game.me.node.identity.classList.remove("guessing");

						for (const current of game.players) {
							current.send(
								(zhu, zhuid, me, identity) => {
									for (var i in lib.playerOL) {
										lib.playerOL[i].setIdentity("cai");
										lib.playerOL[i].node.identity.classList.add("guessing");
									}
									zhu.identity = zhuid;
									if (zhuid == "zhu") {
										zhu.isZhu = true;
									}
									me.node.identity.classList.remove("guessing");
									ui.arena.classList.add("choose-character");
								},
								game.zhu,
								game.zhu.identity,
								current,
								current.identity
							);
						}

						const characters = [];
						event.list = [];
						event.list2 = [];

						const libCharacter = {};
						for (const name of lib.configOL.characterPack) {
							const pack = lib.characterPack[name];
							for (const item in pack) {
								if (lib.character[item]) {
									libCharacter[item] = pack[item];
								}
							}
						}
						for (const name in lib.characterReplace) {
							const names = lib.characterReplace[name];
							for (let j = 0; j < names.length; ++j) {
								if (!libCharacter[names[j]] || lib.filter.characterDisabled(names[j])) {
									names.splice(j--, 1);
								}
							}
							if (names.length) {
								event.list.push(name);
								event.list2.push(name);
								characters.addArray(names);
							}
						}
						game.broadcast(list => {
							for (const name in lib.characterReplace) {
								const names = lib.characterReplace[name];
								for (let j = 0; j < names.length; ++j) {
									if (!list.includes(names[j])) {
										names.splice(j--, 1);
									}
								}
							}
						}, characters);
						for (const name in libCharacter) {
							if (characters.includes(name)) {
								continue;
							}
							if (lib.filter.characterDisabled(name, libCharacter)) {
								continue;
							}
							event.list.push(name);
							event.list2.push(name);
							characters.push(name);
						}
						_status.characterlist = characters.slice(0);
					},
					// step 1
					async (event, trigger, player) => {
						const list = [];

						const num = Math.floor(event.list.length / (game.players.length - 1));
						const selectButton = lib.configOL.double_character ? 2 : 1;
						for (const current of game.players) {
							const num2 = lib.configOL["choice_" + current.identity];
							const str = "选择角色";
							list.push([current, [str, [event.list.randomRemove(Math.min(num, num2)), "characterx"]], selectButton, true]);
						}

						/** @type { Record<string, Partial<Result>> } */
						const result = await game.me
							.chooseButtonOL(list, function (player, result) {
								if (game.online || player == game.me) {
									player.init(result.links[0], result.links[1]);
								}
							})
							.forResult();

						const shen = [];
						for (const id in result) {
							if (result[id] && result[id].links) {
								for (const character of result[id].links) {
									event.list2.remove(get.sourceCharacter(character));
								}
							}
						}
						for (const id in result) {
							if (result[id] === "ai") {
								result[id] = event.list2.randomRemove(lib.configOL.double_character ? 2 : 1);
								for (let j = 0; j < result[id].length; j++) {
									const listx = lib.characterReplace[result[id][j]];
									if (listx && listx.length) {
										result[id][j] = listx.randomGet();
									}
								}
							} else {
								result[id] = result[id].links;
							}
							if (get.selectGroup(result[id][0]).length > 1) {
								shen.push(lib.playerOL[id]);
							}
						}
						event.result2 = result;

						if (shen.length) {
							for (let i = 0; i < shen.length; i++) {
								const name = result[shen[i].playerid][0];
								const groups = get.selectGroup(name).map(group => ["", "", `group_${group}`]);
								const type = get.selectGroup(name, true);
								shen[i]._groupChosen = type;
								shen[i] = [shen[i], ["请选择你的势力", [groups, "vcard"]], 1, true];
							}
							game.me
								.chooseButtonOL(shen, (player, result) => {
									if (player === game.me) {
										player.changeGroup(result.links[0][2].slice(6), false, false);
									}
								})
								.set("switchToAuto", () => {
									_status.event.result = "ai";
								})
								.set("processAI", () => {
									return {
										bool: true,
										links: [_status.event.dialog.buttons.randomGet().link],
									};
								});
						} else {
							event._result = {};
						}
					},
					// step 2
					async (event, trigger, player, result) => {
						if (!result) {
							result = {};
						}
						for (const id in result) {
							if (result[id] && result[id].links) {
								result[id] = result[id].links[0][2].slice(6);
							} else if (result[id] === "ai") {
								result[id] = ["wei", "shu", "wu", "qun", "jin", "key"].randomGet();
							}
						}
						const result2 = event.result2;
						game.broadcast(
							(result, result2) => {
								for (const id in result) {
									if (!lib.playerOL[id].name) {
										lib.playerOL[id].init(result[id][0], result[id][1]);
									}
									if (result2[id] && result2[id].length) {
										lib.playerOL[id].changeGroup(result2[id], false, false);
									}
								}
								setTimeout(() => {
									ui.arena.classList.remove("choose-character");
								}, 500);
							},
							result2,
							result
						);

						for (const id in result2) {
							if (!lib.playerOL[id].name) {
								lib.playerOL[id].init(result2[id][0], result2[id][1]);
							}
							if (result[id] && result[id].length) {
								lib.playerOL[id].changeGroup(result[id], false, false);
							}
						}

						for (let i = 0; i < game.players.length; i++) {
							_status.characterlist.remove(game.players[i].name);
							_status.characterlist.remove(game.players[i].name1);
							_status.characterlist.remove(game.players[i].name2);
						}

						["stratagem_gain", "stratagem_insight", "stratagem_expose"].forEach(globalSkill => game.addGlobalSkill(globalSkill));
						game.players.forEach(current => {
							current.storage.zhibi = [];
							current.storage.stratagem_expose = [];
							current.markSkill("stratagem_fury");
						});

						setTimeout(() => {
							ui.arena.classList.remove("choose-character");
						}, 500);
					},
				];
				next.setContent(contents);
			},
			/**
			 * @this {Game}
			 */
			chooseCharacter() {
				if (_status.mode == "purple") {
					game.chooseCharacterPurple();
					return;
				}

				const next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.addPlayer = player => {
					const list = get.identityList(game.players.length - 1);
					const list2 = get.identityList(game.players.length);
					for (const item of list) {
						list2.remove(item);
					}
					player.identity = list2[0];
					player.setIdentity("cai");
				};
				next.removePlayer = () => {
					return game.players.randomGet(game.me, game.zhu);
				};
				next.ai = (player, list, list2, back) => {
					if (_status.brawl && _status.brawl.chooseCharacterAi && _status.brawl.chooseCharacterAi(player, list, list2, back) !== false) {
						return;
					}
					const stratagemMode = _status.event.stratagemMode;
					if (_status.event.zhongmode) {
						const listc = list.slice(0, 2);
						for (const index of listc.keys()) {
							const listx = lib.characterReplace[listc[index]];
							if (listx && listx.length) {
								listc[index] = listx.randomGet();
							}
						}
						if (get.config("double_character")) {
							player.init(listc[0], listc[1]);
						} else {
							player.init(listc[0]);
						}
						if (player.identity === "mingzhong" && !player.isInitFilter("noZhuHp")) {
							player.hp++;
							player.maxHp++;
							player.update();
						}
					} else if (player.identity === "zhu" && !stratagemMode) {
						list2.randomSort();
						let choice = list[0];
						let choice2 = list[1];
						if (!_status.event.zhongmode && Math.random() - 0.8 < 0 && list2.length) {
							choice = list2[0];
							choice2 = list[0];
							if (choice2 == choice) {
								choice2 = list[1];
							}
						}
						const choiceList = lib.characterReplace[choice];
						if (choiceList && choiceList.length) {
							choice = choiceList.randomGet();
						}
						const choice2List = lib.characterReplace[choice2];
						if (choice2List && choice2List.length) {
							choice2 = choice2List.randomGet();
						}
						if (get.config("double_character")) {
							player.init(choice, choice2);
						} else {
							player.init(choice);
						}
						if (game.players.length > 4 && !player.isInitFilter("noZhuHp")) {
							player.hp++;
							player.maxHp++;
							player.update();
						}
					} else if (player.identity === "zhong" && (Math.random() < 0.5 || ["sunliang", "key_akane"].includes(game.zhu.name)) && !stratagemMode) {
						const listc = list.slice(0);
						for (const index of listc.keys()) {
							const listx = lib.characterReplace[listc[index]];
							if (listx && listx.length) {
								listc[index] = listx.randomGet();
							}
						}
						let choice = 0;
						for (const index of listc.keys()) {
							if (lib.character[listc[index]][1] == game.zhu.group) {
								choice = index;
								break;
							}
						}
						if (get.config("double_character")) {
							player.init(listc[choice], listc[choice == 0 ? choice + 1 : choice - 1]);
						} else {
							player.init(listc[choice]);
						}
					} else {
						const listc = list.slice(0, 2);
						for (const index of listc.keys()) {
							const listx = lib.characterReplace[listc[index]];
							if (listx && listx.length) {
								listc[index] = listx.randomGet();
							}
						}
						if (get.config("double_character")) {
							player.init(listc[0], listc[1]);
						} else {
							player.init(listc[0]);
						}
					}
					if (back) {
						list.remove(get.sourceCharacter(player.name1));
						list.remove(get.sourceCharacter(player.name2));
						for (const name of list) {
							back.push(name);
						}
					}
					if (typeof lib.config.test_game === "string" && player === game.me.next && lib.config.test_game !== "_") {
						player.init(lib.config.test_game);
					}
					if (get.is.double(player.name1)) {
						player._groupChosen = "double";
						player.group = get.is.double(player.name1, true).randomGet();
						player.node.name.dataset.nature = get.groupnature(player.group);
					} else if (get.config("choose_group") && lib.selectGroup.includes(player.group) && !player.isUnseen(0)) {
						player._groupChosen = "kami";
						const groups = lib.group.slice(0);
						groups.remove("shen");
						if (groups.length) {
							player.group = (() => {
								if (_status.mode === "zhong" || !game.zhu || !game.zhu.group) {
									return groups.randomGet();
								}
								if (["re_zhangjiao", "liubei", "re_liubei", "caocao", "re_caocao", "sunquan", "re_sunquan", "zhangjiao", "sp_zhangjiao", "caopi", "re_caopi", "liuchen", "caorui", "sunliang", "sunxiu", "sunce", "re_sunben", "ol_liushan", "re_liushan", "key_akane", "dongzhuo", "re_dongzhuo", "ol_dongzhuo", "jin_simashi", "caomao"].includes(game.zhu.name)) {
									return game.zhu.group;
								}
								if (game.zhu.name === "yl_yuanshu") {
									if (player.identity !== "zhong") {
										return "qun";
									}
									groups.remove("qun");
								}
								if (["sunhao", "xin_yuanshao", "re_yuanshao", "re_sunce", "ol_yuanshao", "yuanshu", "jin_simazhao", "liubian"].includes(game.zhu.name)) {
									if (player.identity == "zhong") {
										return game.zhu.group;
									}
									groups.remove(game.zhu.group);
								}
								return groups.randomGet();
							})();
						}
					}
					player.node.name.dataset.nature = get.groupnature(player.group);
				};

				/** @type { ContentFuncsByAll } */
				const contents = [
					// step 0
					async (event, trigger, player) => {
						ui.arena.classList.add("choose-character");
						let list;
						let identityList;
						let num;
						const list2 = [];
						const list3 = [];
						const list4 = [];
						const chosen = lib.config.continue_name || [];
						game.saveConfig("continue_name");
						event.chosen = chosen;
						if (_status.mode === "zhong") {
							event.zhongmode = true;
							identityList = ["zhu", "zhong", "mingzhong", "nei", "fan", "fan", "fan", "fan"];
						} else {
							if (_status.mode === "stratagem") {
								event.stratagemMode = true;
							}
							identityList = get.identityList(game.players.length);
						}
						const stratagemMode = event.stratagemMode;
						const addSetting = dialog => {
							dialog.add("选择身份").classList.add("add-setting");
							const table = document.createElement("div");
							table.classList.add("add-setting");
							table.style.margin = "0";
							table.style.width = "100%";
							table.style.position = "relative";
							let identityChoices;
							let seats;
							if (event.zhongmode) {
								identityChoices = ["random", "zhu", "mingzhong", "zhong", "fan", "nei"];
							} else {
								identityChoices = ["random", "zhu", "zhong", "fan", "nei"];
								if (get.config("enable_commoner") && !event.stratagemMode) {
									identityChoices.push("commoner");
								}
							}

							for (const identity of identityChoices) {
								const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
								td.link = identity;
								if (td.link === game.me.identity) {
									td.classList.add("bluebg");
								}
								table.appendChild(td);
								td.innerHTML = `<span>${get.translation(`${identity}2`)}</span>`;
								td.addEventListener(lib.config.touchscreen ? "touchend" : "click", e => {
									const target = e.currentTarget;
									if (_status.dragged) {
										return;
									}
									if (_status.justdragged) {
										return;
									}
									_status.tempNoButton = true;
									setTimeout(() => {
										_status.tempNoButton = false;
									}, 500);
									let link = target.link;
									if (game.zhu) {
										if (link !== "random") {
											_status.event.parent.fixedseat = get.distance(game.me, game.zhu, "absolute");
										}
										if (game.zhu.name) {
											game.zhu.uninit();
										}
										delete game.zhu.isZhu;
										delete game.zhu.identityShown;
									}
									let current = target.parentNode.querySelector(".bluebg");
									if (current) {
										current.classList.remove("bluebg");
									}
									current = _status.cheat_seat || seats.querySelector(".bluebg");
									if (current) {
										current.classList.remove("bluebg");
									}
									if (link === "random") {
										if (event.zhongmode) {
											link = ["zhu", "zhong", "nei", "fan", "mingzhong"].randomGet();
										} else {
											const randomIdentities = ["zhu", "zhong", "nei", "fan"];
											if (get.config("enable_commoner") && !event.stratagemMode) {
												randomIdentities.push("commoner");
											}
											link = randomIdentities.randomGet();
										}
										for (const identityNode of target.parentNode.childNodes) {
											if (identityNode.link === link) {
												identityNode.classList.add("bluebg");
											}
										}
									} else {
										target.classList.add("bluebg");
									}
									num = get.config(`choice_${link}`);
									if (event.zhongmode) {
										num = 6;
										if (link === "zhu" || link === "nei" || link === "mingzhong") {
											num = 8;
										}
									}
									_status.event.parent.swapnodialog = (dialog, list) => {
										const buttons = ui.create.div(".buttons");
										const node = dialog.buttons[0].parentNode;
										dialog.buttons = ui.create.buttons(list, "characterx", buttons);
										dialog.content.insertBefore(buttons, node);
										buttons.addTempClass("start");
										node.remove();
										game.uncheck();
										game.check();
										if (event.stratagemMode) {
											return;
										}
										for (const seatNode of seats.childNodes) {
											if (get.distance(game.zhu, game.me, "absolute") === seatNode.link) {
												seatNode.classList.add("bluebg");
											}
										}
									};
									_status.event = _status.event.parent;
									_status.event.step = 0;
									_status.event.identity = link;
									if (ui.selected.buttons.length > 0) {
										ui.selected.buttons.forEach(button => {
											if (button && button.parentNode) {
												button.classList.remove("selected");
											}
										});
										ui.selected.buttons.length = 0;
									}
									if (!event.stratagemMode) {
										const zhuIdentity = event.zhongmode ? "mingzhong" : "zhu";
										if (link === zhuIdentity) {
											seats.previousSibling.style.display = "none";
											seats.style.display = "none";
										} else {
											seats.previousSibling.style.display = "";
											seats.style.display = "";
										}
									}
									game.resume();
								});
							}
							dialog.content.appendChild(table);

							dialog.add("选择座位").classList.add("add-setting");
							seats = document.createElement("div");
							seats.classList.add("add-setting");
							seats.style.margin = "0";
							seats.style.width = "100%";
							seats.style.position = "relative";
							const firstSeat = stratagemMode ? 1 : 2;
							for (let seatNumber = firstSeat; seatNumber <= game.players.length; seatNumber++) {
								const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
								td.innerHTML = get.cnNumber(seatNumber, true);
								td.link = seatNumber - 1;
								seats.appendChild(td);
								if (!stratagemMode && get.distance(game.zhu, game.me, "absolute") === seatNumber - 1) {
									td.classList.add("bluebg");
								}
								td.addEventListener(lib.config.touchscreen ? "touchend" : "click", e => {
									const target = e.currentTarget;
									if (_status.dragged) {
										return;
									}
									if (_status.justdragged) {
										return;
									}
									if (_status.cheat_seat) {
										_status.cheat_seat.classList.remove("bluebg");
										if (_status.cheat_seat === target) {
											delete _status.cheat_seat;
											return;
										}
									}
									if (stratagemMode) {
										target.classList.add("bluebg");
										_status.cheat_seat = target;
										return;
									}
									if (get.distance(game.zhu, game.me, "absolute") === target.link) {
										return;
									}
									const current = target.parentNode.querySelector(".bluebg");
									if (current) {
										current.classList.remove("bluebg");
									}
									target.classList.add("bluebg");
									for (const currentPlayer of game.players) {
										if (get.distance(currentPlayer, game.me, "absolute") === target.link) {
											game.swapSeat(game.zhu, currentPlayer, false);
											return;
										}
									}
								});
							}
							dialog.content.appendChild(seats);
							if (!stratagemMode && game.me === game.zhu) {
								seats.previousSibling.style.display = "none";
								seats.style.display = "none";
							}

							dialog.add(ui.create.div(".placeholder.add-setting"));
							dialog.add(ui.create.div(".placeholder.add-setting"));
							if (get.is.phoneLayout()) {
								dialog.add(ui.create.div(".placeholder.add-setting"));
							}
						};
						const removeSetting = () => {
							const dialog = _status.event.dialog;
							if (!dialog) {
								return;
							}
							dialog.style.height = "";
							delete dialog._scrollset;
							const settingNodes = Array.from(dialog.querySelectorAll(".add-setting"));
							while (settingNodes.length) {
								settingNodes.shift().remove();
							}
							ui.update();
						};
						event.addSetting = addSetting;
						event.removeSetting = removeSetting;
						event.list = [];
						identityList.randomSort();
						if (event.identity) {
							identityList.remove(event.identity);
							identityList.unshift(event.identity);
							if (event.fixedseat) {
								const zhuIdentity = _status.mode === "zhong" ? "mingzhong" : "zhu";
								if (zhuIdentity !== event.identity) {
									identityList.remove(zhuIdentity);
									identityList.splice(event.fixedseat, 0, zhuIdentity);
								}
								delete event.fixedseat;
							}
							delete event.identity;
						} else if (_status.mode !== "zhong" && (!_status.brawl || !_status.brawl.identityShown)) {
							const banIdentity = [];
							banIdentity.push(get.config("ban_identity") || "off");
							if (banIdentity[0] !== "off") {
								banIdentity.push(get.config("ban_identity2") || "off");
								if (banIdentity[1] !== "off") {
									banIdentity.push(get.config("ban_identity3") || "off");
								}
							}
							banIdentity.remove("off");
							if (banIdentity.length) {
								const identityList2 = identityList.slice(0);
								for (const bannedIdentity of banIdentity) {
									while (identityList2.includes(bannedIdentity)) {
										identityList2.remove(bannedIdentity);
									}
								}
								const selectedIdentity = identityList2.randomGet();
								identityList.remove(selectedIdentity);
								identityList.splice(game.players.indexOf(game.me), 0, selectedIdentity);
							}
						}
						let playerIndex = 0;
						for (const currentPlayer of game.players) {
							const currentIdentity = identityList[playerIndex];
							playerIndex++;
							if (_status.brawl && _status.brawl.identityShown) {
								if (currentPlayer.identity === "zhu") {
									game.zhu = currentPlayer;
								}
								if (!stratagemMode) {
									currentPlayer.identityShown = true;
								}
								continue;
							}
							currentPlayer.node.identity.classList.add("guessing");
							currentPlayer.identity = currentIdentity;
							currentPlayer.setIdentity("cai");
							if (event.zhongmode) {
								if (currentIdentity === "mingzhong") {
									game.zhu = currentPlayer;
								} else if (currentIdentity === "zhu") {
									game.zhu2 = currentPlayer;
								}
							} else if (currentIdentity === "zhu") {
								game.zhu = currentPlayer;
							}
							currentPlayer.identityShown = false;
						}

						if (get.config("special_identity") && !event.zhongmode && !event.stratagemMode && game.players.length === 8) {
							for (const currentPlayer of game.players) {
								delete currentPlayer.special_identity;
							}
							event.special_identity = [];
							const zhongs = game.filterPlayer(current => current.identity === "zhong");
							const fans = game.filterPlayer(current => current.identity === "fan");
							if (fans.length >= 1) {
								fans.randomRemove().special_identity = "identity_zeishou";
								event.special_identity.push("identity_zeishou");
							}
							if (zhongs.length > 1) {
								zhongs.randomRemove().special_identity = "identity_dajiang";
								zhongs.randomRemove().special_identity = "identity_junshi";
								event.special_identity.push("identity_dajiang");
								event.special_identity.push("identity_junshi");
							} else if (zhongs.length === 1) {
								if (Math.random() < 0.5) {
									zhongs.randomRemove().special_identity = "identity_dajiang";
									event.special_identity.push("identity_dajiang");
								} else {
									zhongs.randomRemove().special_identity = "identity_junshi";
									event.special_identity.push("identity_junshi");
								}
							}
						}

						if (!game.zhu) {
							game.zhu = game.me;
						} else {
							if (!stratagemMode) {
								game.zhu.setIdentity();
								game.zhu.isZhu = game.zhu.identity === "zhu";
								game.zhu.identityShown = true;
								game.zhu.node.identity.classList.remove("guessing");
							}
							game.me.setIdentity();
							game.me.node.identity.classList.remove("guessing");
						}
						//选将框分配
						for (const name in lib.characterReplace) {
							const replacements = lib.characterReplace[name];
							for (let index = replacements.length - 1; index >= 0; index--) {
								const replacement = replacements[index];
								if (chosen.includes(replacement) || lib.filter.characterDisabled(replacement)) {
									replacements.splice(index, 1);
								}
							}
							if (!replacements.length) {
								continue;
							}
							event.list.push(name);
							list4.addArray(replacements);
							if (stratagemMode) {
								list3.push(name);
								continue;
							}
							let hasZhugong = false;
							for (const replacement of replacements) {
								if (lib.character[replacement].isZhugong) {
									hasZhugong = true;
									break;
								}
							}
							(hasZhugong ? list2 : list3).push(name);
						}
						for (const name in lib.character) {
							if (list4.includes(name)) {
								continue;
							}
							if (chosen.includes(name)) {
								continue;
							}
							if (lib.filter.characterDisabled(name)) {
								continue;
							}
							event.list.push(name);
							list4.push(name);
							if (!stratagemMode && lib.character[name].isZhugong) {
								list2.push(name);
							} else {
								list3.push(name);
							}
						}
						const getZhuList = () => {
							if (stratagemMode) {
								list2.sort(lib.sort.character);
								return list2;
							}
							const limitZhu = get.config("limit_zhu");
							if (!limitZhu || limitZhu === "off") {
								return list2.slice(0).sort(lib.sort.character);
							}
							if (limitZhu !== "group") {
								const zhuCount = parseInt(limitZhu) || 6;
								return list2.randomGets(zhuCount).sort(lib.sort.character);
							}
							const getGroup = name => {
								const characterReplace = lib.characterReplace[name];
								if (characterReplace && characterReplace[0] && lib.character[characterReplace[0]]) {
									return lib.character[characterReplace[0]][1];
								}
								return lib.character[name][1];
							};
							const list2Random = list2.slice(0);
							const list2x = [];
							const selectedGroups = new Set();
							list2Random.randomSort();
							for (const name of list2Random) {
								const group = getGroup(name);
								if (selectedGroups.has(group)) {
									continue;
								}
								selectedGroups.add(group);
								list2x.push(name);
							}
							list2x.sort(lib.sort.character);
							return list2x;
						};
						event.list.randomSort();
						_status.characterlist = list4.slice(0).randomSort();
						list3.randomSort();
						if (_status.brawl && _status.brawl.chooseCharacterFilter) {
							_status.brawl.chooseCharacterFilter(event.list, getZhuList(), list3);
						}
						num = get.config(`choice_${game.me.identity}`);
						if (event.zhongmode) {
							num = 6;
							if (game.me.identity === "zhu" || game.me.identity === "nei" || game.me.identity === "mingzhong") {
								num = 8;
							}
						}
						if (stratagemMode) {
							list = event.list.slice(0, num);
						} else if (game.zhu !== game.me) {
							event.ai(game.zhu, event.list, getZhuList());
							event.list.remove(get.sourceCharacter(game.zhu.name1));
							event.list.remove(get.sourceCharacter(game.zhu.name2));
							if (_status.brawl && _status.brawl.chooseCharacter) {
								list = _status.brawl.chooseCharacter(event.list, num);
								if (list === false || list === "nozhu") {
									list = event.list.slice(0, num);
								}
							} else {
								list = event.list.slice(0, num);
							}
						} else {
							if (_status.brawl && _status.brawl.chooseCharacter) {
								list = _status.brawl.chooseCharacter(getZhuList(), list3, num);
								if (list === false) {
									if (event.zhongmode) {
										list = list3.slice(0, 6);
									} else {
										list = getZhuList().concat(list3.slice(0, num));
									}
								} else if (list === "nozhu") {
									list = event.list.slice(0, num);
								}
							} else {
								if (event.zhongmode) {
									list = list3.slice(0, 8);
								} else {
									list = getZhuList().concat(list3.slice(0, num));
								}
							}
						}
						delete event.swapnochoose;
						let dialog;
						if (event.swapnodialog) {
							dialog = ui.dialog;
							event.swapnodialog(dialog, list);
							delete event.swapnodialog;
						} else {
							let str = "选择角色";
							if (_status.brawl && _status.brawl.chooseCharacterStr) {
								str = _status.brawl.chooseCharacterStr;
							}
							dialog = ui.create.dialog(str, "hidden", [list, "characterx"]);
							if ((!_status.brawl || !_status.brawl.noAddSetting) && get.config("change_identity")) {
								addSetting(dialog);
							}
						}
						if (game.me.special_identity) {
							dialog.setCaption(`选择角色（${get.translation(game.me.special_identity)}）`);
							game.me.node.identity.firstChild.innerHTML = get.translation(`${game.me.special_identity}_bg`);
						} else {
							dialog.setCaption("选择角色");
							game.me.setIdentity();
						}
						if (!event.chosen.length) {
							game.me.chooseButton(dialog, true).set("onfree", true).selectButton = () => ((_status.brawl && _status.brawl.doubleCharacter) || get.config("double_character") ? 2 : 1);
						} else {
							lib.init.onfree();
						}
						ui.create.cheat = () => {
							_status.createControl = ui.cheat2;
							ui.cheat = ui.create.control("更换", () => {
								if (ui.cheat2 && ui.cheat2.dialog === _status.event.dialog) {
									return;
								}
								if (game.changeCoin) {
									game.changeCoin(-3);
								}
								if (game.zhu !== game.me) {
									event.list.randomSort();
									if (_status.brawl && _status.brawl.chooseCharacter) {
										list = _status.brawl.chooseCharacter(event.list, num);
										if (list === false || list === "nozhu") {
											list = event.list.slice(0, num);
										}
									} else {
										list = event.list.slice(0, num);
									}
								} else {
									getZhuList().sort(lib.sort.character);
									list3.randomSort();
									if (_status.brawl && _status.brawl.chooseCharacter) {
										list = _status.brawl.chooseCharacter(getZhuList(), list3, num);
										if (list === false) {
											if (event.zhongmode) {
												list = list3.slice(0, 6);
											} else {
												list = getZhuList().concat(list3.slice(0, num));
											}
										} else if (list === "nozhu") {
											event.list.randomSort();
											list = event.list.slice(0, num);
										}
									} else {
										if (event.zhongmode) {
											list = list3.slice(0, 6);
										} else {
											list = getZhuList().concat(list3.slice(0, num));
										}
									}
								}
								const buttons = ui.create.div(".buttons");
								const node = _status.event.dialog.buttons[0].parentNode;
								_status.event.dialog.buttons = ui.create.buttons(list, "characterx", buttons);
								_status.event.dialog.content.insertBefore(buttons, node);
								buttons.addTempClass("start");
								node.remove();
								game.uncheck();
								game.check();
							});
							delete _status.createControl;
						};
						if (lib.onfree) {
							lib.onfree.push(() => {
								event.dialogxx = ui.create.characterDialog("heightset");
								if (ui.cheat2) {
									ui.cheat2.addTempClass("controlpressdownx", 500);
									ui.cheat2.classList.remove("disabled");
								}
							});
						} else {
							event.dialogxx = ui.create.characterDialog("heightset");
						}

						ui.create.cheat2 = () => {
							ui.cheat2 = ui.create.control("自由选将", () => {
								const control = ui.cheat2;
								if (control.dialog === _status.event.dialog) {
									if (game.changeCoin) {
										game.changeCoin(10);
									}
									control.dialog.close();
									_status.event.dialog = control.backup;
									control.backup.open();
									delete control.backup;
									game.uncheck();
									game.check();
									if (ui.cheat) {
										ui.cheat.addTempClass("controlpressdownx", 500);
										ui.cheat.classList.remove("disabled");
									}
								} else {
									if (game.changeCoin) {
										game.changeCoin(-10);
									}
									control.backup = _status.event.dialog;
									_status.event.dialog.close();
									_status.event.dialog = _status.event.parent.dialogxx;
									control.dialog = _status.event.dialog;
									control.dialog.open();
									game.uncheck();
									game.check();
									if (ui.cheat) {
										ui.cheat.classList.add("disabled");
									}
								}
							});
							if (lib.onfree) {
								ui.cheat2.classList.add("disabled");
							}
						};
						if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
							if (!ui.cheat && get.config("change_choice")) {
								ui.create.cheat();
							}
							if (!ui.cheat2 && get.config("free_choose")) {
								ui.create.cheat2();
							}
						}
					},
					// step 1
					async (event, trigger, player, result) => {
						if (ui.cheat) {
							ui.cheat.close();
							delete ui.cheat;
						}
						if (ui.cheat2) {
							ui.cheat2.close();
							delete ui.cheat2;
						}
						if (event.chosen.length) {
							event.choosed = event.chosen;
						} else if (event.modchosen) {
							if (event.modchosen[0] === "random") {
								event.modchosen[0] = result.buttons[0].link;
							} else {
								event.modchosen[1] = result.buttons[0].link;
							}
							event.choosed = event.modchosen;
						} else if (result.buttons.length === 2) {
							event.choosed = [result.buttons[0].link, result.buttons[1].link];
							game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
						} else {
							event.choosed = [result.buttons[0].link];
							game.addRecentCharacter(result.buttons[0].link);
						}
						const name = event.choosed[0];
						const groups = get.selectGroup(name);
						const type = get.selectGroup(name, true);
						if (type !== "default") {
							game.me._groupChosen = type;
						}
						if (groups.length) {
							const groupResult = await game.me
								.chooseButton(["请选择你的势力", [groups.map(group => ["", "", `group_${group}`]), "vcard"]], true)
								.set("direct", true)
								.forResult();

							if (groupResult.links?.length) {
								event.group = groupResult.links[0][2].slice(6);
							}
						}
						if (event.choosed.length === 2) {
							game.me.init(event.choosed[0], event.choosed[1]);
						} else {
							game.me.init(event.choosed[0]);
						}
						event.list.remove(get.sourceCharacter(game.me.name1));
						event.list.remove(get.sourceCharacter(game.me.name2));
						if (!event.stratagemMode && game.me === game.zhu && game.players.length > 4 && !game.me.isInitFilter("noZhuHp")) {
							game.me.hp++;
							game.me.maxHp++;
							game.me.update();
						}
						for (const currentPlayer of game.players) {
							if ((event.stratagemMode || currentPlayer !== game.zhu) && currentPlayer !== game.me) {
								event.list.randomSort();
								event.ai(currentPlayer, event.list.splice(0, get.config(`choice_${currentPlayer.identity}`)), null, event.list);
							}
						}
					},
					// step 2
					async (event, trigger, player) => {
						if (event.group) {
							game.me.group = event.group;
							game.me.node.name.dataset.nature = get.groupnature(game.me.group);
							game.me.update();
						}
						for (const currentPlayer of game.players) {
							_status.characterlist.remove(currentPlayer.name);
							_status.characterlist.remove(currentPlayer.name1);
							_status.characterlist.remove(currentPlayer.name2);
						}
						if (event.stratagemMode) {
							["stratagem_gain", "stratagem_insight", "stratagem_expose"].forEach(globalSkill => game.addGlobalSkill(globalSkill));
							game.players.forEach(i => {
								i.storage.zhibi = [];
								i.storage.stratagem_expose = [];
								i.markSkill("stratagem_fury");
							});
						}
						setTimeout(() => {
							ui.arena.classList.remove("choose-character");
						}, 500);

						if (event.special_identity) {
							for (const specialIdentity of event.special_identity) {
								game.zhu.addSkill(specialIdentity);
							}
						}
					},
				];
				next.setContent(contents);
			},
			/**
			 * @this {Game}
			 */
			chooseCharacterOL() {
				if (_status.mode === "purple") {
					game.chooseCharacterPurpleOL();
					return;
				} else if (_status.mode === "stratagem") {
					game.chooseCharacterStratagemOL();
					return;
				}

				const next = game.createEvent("chooseCharacter");

				/** @type { ContentFuncsByAll } */
				const contents = [
					// "step 0"
					async (event, trigger, player) => {
						ui.arena.classList.add("choose-character");
						let identityList;
						if (_status.mode === "zhong") {
							event.zhongmode = true;
							identityList = ["zhu", "zhong", "mingzhong", "nei", "fan", "fan", "fan", "fan"];
						} else {
							identityList = get.identityList(game.players.length);
						}
						identityList.randomSort();
						let playerIndex = 0;
						for (const currentPlayer of game.players) {
							const identity = identityList[playerIndex];
							playerIndex++;
							currentPlayer.identity = identity;
							currentPlayer.setIdentity("cai");
							currentPlayer.node.identity.classList.add("guessing");
							if (event.zhongmode) {
								if (identity === "mingzhong") {
									game.zhu = currentPlayer;
								} else if (identity === "zhu") {
									game.zhu2 = currentPlayer;
								}
							} else if (identity === "zhu") {
								game.zhu = currentPlayer;
							}
							currentPlayer.identityShown = false;
						}
						if (lib.configOL.special_identity && !event.zhongmode && game.players.length === 8) {
							const map = {};
							const zhongs = game.filterPlayer(current => current.identity === "zhong");
							const fans = game.filterPlayer(current => current.identity === "fan");
							if (fans.length >= 1) {
								map.identity_zeishou = fans.randomRemove();
							}
							if (zhongs.length > 1) {
								map.identity_dajiang = zhongs.randomRemove();
								map.identity_junshi = zhongs.randomRemove();
							} else if (zhongs.length === 1) {
								if (Math.random() < 0.5) {
									map.identity_dajiang = zhongs.randomRemove();
								} else {
									map.identity_junshi = zhongs.randomRemove();
								}
							}
							game.broadcastAll(
								(zhu, map) => {
									for (const identity in map) {
										map[identity].special_identity = identity;
									}
								},
								game.zhu,
								map
							);
							event.special_identity = map;
						}

						game.zhu.setIdentity();
						game.zhu.identityShown = true;
						game.zhu.isZhu = game.zhu.identity === "zhu";
						game.zhu.node.identity.classList.remove("guessing");
						game.me.setIdentity();
						game.me.node.identity.classList.remove("guessing");
						if (game.me.special_identity) {
							game.me.node.identity.firstChild.innerHTML = get.translation(`${game.me.special_identity}_bg`);
						}

						for (const currentPlayer of game.players) {
							currentPlayer.send(
								(zhu, zhuid, me, identity) => {
									for (const id in lib.playerOL) {
										lib.playerOL[id].setIdentity("cai");
										lib.playerOL[id].node.identity.classList.add("guessing");
									}
									zhu.identityShown = true;
									zhu.identity = zhuid;
									if (zhuid === "zhu") {
										zhu.isZhu = true;
									}
									zhu.setIdentity();
									zhu.node.identity.classList.remove("guessing");
									me.setIdentity(identity);
									me.node.identity.classList.remove("guessing");
									if (me.special_identity) {
										me.node.identity.firstChild.innerHTML = get.translation(`${me.special_identity}_bg`);
									}
									ui.arena.classList.add("choose-character");
								},
								game.zhu,
								game.zhu.identity,
								currentPlayer,
								currentPlayer.identity
							);
						}

						let list;
						const list2 = [];
						const list3 = [];
						const list4 = [];
						event.list = [];
						event.list2 = [];

						const libCharacter = {};
						for (const characterPack of lib.configOL.characterPack) {
							const pack = lib.characterPack[characterPack];
							for (const name in pack) {
								// if (name === "zuoci") { continue; }
								if (lib.character[name]) {
									libCharacter[name] = lib.character[name];
								}
							}
						}
						for (const name in lib.characterReplace) {
							const replacements = lib.characterReplace[name];
							for (let index = replacements.length - 1; index >= 0; index--) {
								const replacement = replacements[index];
								if (!libCharacter[replacement] || lib.filter.characterDisabled(replacement)) {
									replacements.splice(index, 1);
								}
							}
							if (!replacements.length) {
								continue;
							}
							event.list.push(name);
							event.list2.push(name);
							list4.addArray(replacements);
							let hasZhugong = false;
							for (const replacement of replacements) {
								if (libCharacter[replacement].isZhugong) {
									hasZhugong = true;
									break;
								}
							}
							(hasZhugong ? list2 : list3).push(name);
						}
						game.broadcast(availableCharacters => {
							for (const name in lib.characterReplace) {
								const replacements = lib.characterReplace[name];
								for (let index = replacements.length - 1; index >= 0; index--) {
									if (!availableCharacters.includes(replacements[index])) {
										replacements.splice(index, 1);
									}
								}
							}
						}, list4);
						for (const name in libCharacter) {
							if (list4.includes(name)) {
								continue;
							}
							if (lib.filter.characterDisabled(name, libCharacter)) {
								continue;
							}
							event.list.push(name);
							event.list2.push(name);
							list4.push(name);
							if (libCharacter[name].isZhugong) {
								list2.push(name);
							} else {
								list3.push(name);
							}
						}
						_status.characterlist = list4.slice(0);
						if (event.zhongmode) {
							list = event.list.randomGets(8);
						} else {
							const getZhuList = zhuList => {
								const limitZhu = lib.configOL.limit_zhu;
								if (!limitZhu || limitZhu === "off") {
									return zhuList.slice(0).sort(lib.sort.character);
								}
								if (limitZhu !== "group") {
									const zhuCount = parseInt(limitZhu) || 6;
									return zhuList.randomGets(zhuCount).sort(lib.sort.character);
								}
								const getGroup = name => {
									if (lib.characterReplace[name]) {
										return lib.character[lib.characterReplace[name][0]][1];
									}
									return lib.character[name][1];
								};
								const zhuListRandom = zhuList.slice(0);
								const zhuListUnique = [];
								const selectedGroups = new Set();
								zhuListRandom.randomSort();
								for (const name of zhuListRandom) {
									const group = getGroup(name);
									if (selectedGroups.has(group)) {
										continue;
									}
									selectedGroups.add(group);
									zhuListUnique.push(name);
								}
								zhuListUnique.sort(lib.sort.character);
								return zhuListUnique;
							};
							list = getZhuList(list2).concat(list3.randomGets(lib.configOL.choice_zhu));
						}
						const chooseButtonEvent = game.zhu.chooseButton(true);
						chooseButtonEvent.set("selectButton", lib.configOL.double_character ? 2 : 1);
						chooseButtonEvent.set("createDialog", ["选择角色", [list, "characterx"]]);
						chooseButtonEvent.set("ai", () => Math.random());
					},
					// "step 1"
					async (event, trigger, player, result) => {
						if (!game.zhu.name) {
							game.zhu.init(result.links[0], result.links[1]);
						}
						event.list.remove(get.sourceCharacter(game.zhu.name1));
						event.list.remove(get.sourceCharacter(game.zhu.name2));
						event.list2.remove(get.sourceCharacter(game.zhu.name1));
						event.list2.remove(get.sourceCharacter(game.zhu.name2));

						if (game.players.length > 4 && !game.zhu.isInitFilter("noZhuHp")) {
							game.zhu.maxHp++;
							game.zhu.hp++;
							game.zhu.update();
						}
						game.broadcast(
							(zhu, name, name2, addMaxHp) => {
								if (!zhu.name) {
									zhu.init(name, name2);
								}
								if (addMaxHp && !zhu.isInitFilter("noZhuHp")) {
									zhu.maxHp++;
									zhu.hp++;
									zhu.update();
								}
							},
							game.zhu,
							result.links[0],
							result.links[1],
							game.players.length > 4
						);
						const groups = get.selectGroup(game.zhu.name1);
						const type = get.selectGroup(game.zhu.name1, true);
						if (type !== "default") {
							game.zhu._groupChosen = type;
						}
						if (groups.length) {
							const groupResult = await game.zhu
								.chooseButton(["请选择你的势力", [groups.map(group => ["", "", `group_${group}`]), "vcard"]], true)
								.set("ai", () => Math.random())
								.set("direct", true)
								.forResult();

							const name = groupResult.links[0][2].slice(6);
							await game.zhu.changeGroup(name);
						}
					},
					// step 2
					async (event, trigger, player) => {
						const list = [];
						const selectButton = lib.configOL.double_character ? 2 : 1;

						const num = Math.floor(event.list.length / (game.players.length - 1));
						for (const currentPlayer of game.players) {
							if (currentPlayer === game.zhu) {
								continue;
							}
							const identity = currentPlayer.identity;
							let num2;
							if (event.zhongmode) {
								if (identity === "nei" || identity === "zhu") {
									num2 = 8;
								} else {
									num2 = 6;
								}
							} else {
								num2 = lib.configOL[`choice_${identity}`];
							}
							let str = "选择角色";
							if (currentPlayer.special_identity) {
								str = `选择角色（${get.translation(currentPlayer.special_identity)}）`;
							}
							list.push([currentPlayer, [str, [event.list.randomRemove(Math.min(num, num2)), "characterx"]], selectButton, true]);
						}
						game.me.chooseButtonOL(list, (player, result) => {
							if (game.online || player === game.me) {
								player.init(result.links[0], result.links[1]);
							}
						});
					},
					// step 3
					async (event, trigger, player, result) => {
						let shen = [];
						for (const id in result) {
							if (result[id] && result[id].links) {
								for (const link of result[id].links) {
									event.list2.remove(get.sourceCharacter(link));
								}
							}
						}
						for (const id in result) {
							if (result[id] === "ai") {
								result[id] = event.list2.randomRemove(lib.configOL.double_character ? 2 : 1).map(name => {
									const listx = lib.characterReplace[name];
									if (listx && listx.length) {
										return listx.randomGet();
									}
									return name;
								});
							} else {
								result[id] = result[id].links;
							}
							if (get.selectGroup(result[id][0]).length > 0) {
								shen.push(lib.playerOL[id]);
							}
						}
						event.result2 = result;
						if (shen.length) {
							shen = shen.map(currentPlayer => {
								const name = result[currentPlayer.playerid][0];
								const groups = get.selectGroup(name).map(group => ["", "", `group_${group}`]);
								const type = get.selectGroup(name, true);
								if (type !== "default") {
									currentPlayer._groupChosen = type;
								}
								return [currentPlayer, ["请选择你的势力", [groups, "vcard"]], 1, true, "direct"];
							});
							game.me
								.chooseButtonOL(shen, (player, result) => {
									if (player === game.me) {
										player.changeGroup(result.links[0][2].slice(6), false, false);
									}
								})
								.set("switchToAuto", () => {
									_status.event.result = "ai";
								})
								.set("processAI", () => ({
									bool: true,
									links: [_status.event.dialog.buttons.randomGet().link],
								}));
						} else {
							event._result = {};
						}
					},
					// step 4
					async (event, trigger, player, result) => {
						if (!result) {
							result = {};
						}
						for (const id in result) {
							if (result[id] && result[id].links) {
								result[id] = result[id].links[0][2].slice(6);
							} else if (result[id] === "ai") {
								result[id] = (() => {
									const currentPlayer = lib.playerOL[id];
									const groups = ["wei", "shu", "wu", "qun", "jin", "key"].filter(group => lib.group.includes(group));
									if (_status.mode === "zhong" || !game.zhu || !game.zhu.group) {
										return groups.randomGet();
									}
									if (["re_zhangjiao", "liubei", "re_liubei", "caocao", "re_caocao", "sunquan", "re_sunquan", "zhangjiao", "sp_zhangjiao", "caopi", "re_caopi", "liuchen", "caorui", "sunliang", "sunxiu", "sunce", "re_sunben", "ol_liushan", "re_liushan", "key_akane", "dongzhuo", "re_dongzhuo", "ol_dongzhuo", "jin_simashi", "caomao"].includes(game.zhu.name)) {
										return game.zhu.group;
									}
									if (game.zhu.name === "yl_yuanshu") {
										if (currentPlayer.identity !== "zhong") {
											return "qun";
										}
										groups.remove("qun");
									}
									if (["sunhao", "xin_yuanshao", "re_yuanshao", "re_sunce", "ol_yuanshao", "yuanshu", "jin_simazhao", "liubian"].includes(game.zhu.name)) {
										if (currentPlayer.identity === "zhong") {
											return game.zhu.group;
										}
										groups.remove(game.zhu.group);
									}
									return groups.randomGet();
								})();
							}
						}
						const result2 = event.result2;
						game.broadcast(
							(result, result2) => {
								for (const id in result) {
									if (!lib.playerOL[id].name) {
										lib.playerOL[id].init(result[id][0], result[id][1]);
									}
									if (result2[id] && result2[id].length) {
										lib.playerOL[id].changeGroup(result2[id], false, false);
									}
								}
								setTimeout(() => {
									ui.arena.classList.remove("choose-character");
								}, 500);
							},
							result2,
							result
						);

						for (const id in result2) {
							if (!lib.playerOL[id].name) {
								lib.playerOL[id].init(result2[id][0], result2[id][1]);
							}
							if (result[id] && result[id].length) {
								lib.playerOL[id].changeGroup(result[id], false, false);
							}
						}

						if (event.special_identity) {
							for (const specialIdentity in event.special_identity) {
								game.zhu.addSkill(specialIdentity);
							}
						}
						for (const currentPlayer of game.players) {
							_status.characterlist.remove(currentPlayer.name);
							_status.characterlist.remove(currentPlayer.name1);
							_status.characterlist.remove(currentPlayer.name2);
						}
						setTimeout(() => {
							ui.arena.classList.remove("choose-character");
						}, 500);
					},
				];
				next.setContent(contents);
			},
			stratagemCamouflage() {
				const next = game.createEvent("stratagemCamouflage");
				next.players = game.players.slice();
				if (_status.connectMode) {
					next.setContent("stratagemCamouflageOL");
				} else {
					next.setContent("stratagemCamouflage");
				}
				return next;
			},
		},
		translate: {
			zhu: "主",
			zhong: "忠",
			mingzhong: "忠",
			nei: "内",
			fan: "反",
			commoner: "民",
			cai: "猜",
			cai2: "猜",
			rZhu: "主",
			rZhong: "忠",
			rNei: "内",
			rYe: "野",
			rZhu2: "主帅",
			rZhong2: "前锋",
			rNei2: "细作",
			rYe2: "野心家",
			bZhu: "主",
			bZhong: "忠",
			bNei: "内",
			bYe: "野",
			bZhu2: "主帅",
			bZhong2: "前锋",
			bNei2: "细作",
			bYe2: "野心家",
			zhu2: "主公",
			zhong2: "忠臣",
			mingzhong2: "明忠",
			nei2: "内奸",
			fan2: "反贼",
			commoner2: "平民",
			random2: "随机",
			enemy: "敌",
			friend: "友",
			enemy2: "敌方",
			friend2: "友方",
			identity_junshi_bg: "师",
			identity_dajiang_bg: "将",
			identity_zeishou_bg: "首",
			identity_junshi: "军师",
			identity_dajiang: "大将",
			identity_zeishou: "贼首",
			ai_strategy_1: "均衡",
			ai_strategy_2: "偏反",
			ai_strategy_3: "偏主",
			ai_strategy_4: "酱油",
			ai_strategy_5: "天使",
			ai_strategy_6: "仇主",
			yexinbilu: "野心毕露",
			stratagem_insight: "洞察",
			sixiang_zhuque: "朱雀",
			sixiang_xuanwu: "玄武",
			sixiang_qinglong: "青龙",
			sixiang_baihu: "白虎",
		},
		element: {
			player: {
				/**
				 * 洞察一名角色的阵营（友方/敌方）
				 *
				 * @this {Player}
				 * @param {Player} target
				 * @returns {GameEvent}
				 */
				insightInto(target) {
					const next = game.createEvent("stratagemInsight");
					next.player = this;
					next.target = target;
					next.setContent("stratagemInsight");
					return next;
				},
				/**
				 * 增加暴露值
				 *
				 * 暴露值越高，AI越容易透视身份
				 *
				 * @this {Player}
				 * @param {number} num - 添加的暴露值；暴露值最大不超过0.95
				 * @returns {Player}
				 */
				addExpose(num) {
					if (!game.zhu || !game.zhu.isZhu || !game.zhu.identityShown) {
						return this;
					}
					if (typeof this.ai.shown == "number" && !this.identityShown && this.ai.shown < 1) {
						this.ai.shown += num;
						if (this.ai.shown > 0.95) {
							this.ai.shown = 0.95;
						}
					}
					return this;
				},
				/**
				 * 3v3v2模型展示野心
				 *
				 * @this {Player}
				 */
				async yexinbilu() {
					game.broadcastAll(player => {
						player.showIdentity();
					}, this);
					await this.gainMaxHp();
					await this.recover();
				},
				/**
				 * 在角色死亡后创建并同步死亡身份标记。
				 *
				 * @this { Player }
				 * @returns { void }
				 */
				$dieAfter() {
					if (_status.video) {
						return;
					}
					if (!this.node.dieidentity) {
						let str;
						if (this.special_identity) {
							str = get.translation(this.special_identity);
						} else {
							str = get.translation(`${this.identity}2`);
						}
						const node = ui.create.div(".damage.dieidentity", str, this);
						if (str === "野心家") {
							node.style.fontSize = "40px";
						}
						ui.refresh(node);
						node.style.opacity = 1;
						this.node.dieidentity = node;
					}
					const trans = this.style.transform;
					if (trans) {
						if (trans.indexOf("rotateY") !== -1) {
							this.node.dieidentity.style.transform = "rotateY(180deg)";
						} else if (trans.indexOf("rotateX") !== -1) {
							this.node.dieidentity.style.transform = "rotateX(180deg)";
						} else {
							this.node.dieidentity.style.transform = "";
						}
					} else {
						this.node.dieidentity.style.transform = "";
					}
				},
				/**
				 * 处理角色死亡后的击杀奖励与紫势力野心家公开逻辑。
				 *
				 * @this { Player }
				 * @param { Player } [source] - 击杀来源角色。
				 * @returns { void }
				 */
				dieAfter2(source) {
					if (_status.mode === "stratagem") {
						return;
					}
					if (_status.mode === "purple") {
						if (source) {
							if (this.identity === "rZhu" || this.identity === "bZhu") {
								if (this.identity.slice(0, 1) !== source.identity.slice(0, 1)) {
									source.recover();
								}
							} else if (this.identity === "rZhong" || this.identity === "bZhong") {
								if (this.identity.slice(0, 1) !== source.identity.slice(0, 1)) {
									source.draw(2);
								} else if (source.identity.indexOf("Zhu") === 1) {
									source.discard(source.getCards("h"));
								}
							} else if (this.identity === "rNei" || this.identity === "bNei") {
								if (this.identity.slice(0, 1) === source.identity.slice(0, 1)) {
									source.draw(3);
								}
							}
						}
						if (!_status.yeconfirm) {
							_status.yeconfirm = true;
							game.addGlobalSkill("yexinbilu");
							game.broadcastAll(() => {
								if (game.me.identity === "rYe" || game.me.identity === "bYe") {
									const player = game.findPlayer(current => current !== game.me && (current.identity === "bYe" || current.identity === "rYe"));
									if (player) {
										player.showIdentity();
									}
								}
							});
						}
					}
					if (this.identity === "fan" && source) {
						source.draw(3);
					} else if (this.identity === "commoner" && source) {
						source.draw(2);
					} else if (this.identity === "mingzhong" && source) {
						if (source.identity === "zhu") {
							source.discard(source.getCards("he"));
						} else {
							source.draw(3);
						}
					} else if (this.identity === "zhong" && source && source.identity === "zhu" && source.isZhu) {
						source.discard(source.getCards("he"));
					}
				},
				/**
				 * 处理角色死亡后的身份公开、主公转移和认输提示。
				 *
				 * @this { Player }
				 * @param { Player } [source] - 击杀来源角色。
				 * @returns { void }
				 */
				dieAfter(source) {
					if (!this.identityShown) {
						game.broadcastAll(
							(player, identity, identity2) => {
								player.setIdentity(player.identity);
								player.identityShown = true;
								player.node.identity.classList.remove("guessing");
								if (identity) {
									player.node.identity.firstChild.innerHTML = get.translation(`${identity}_bg`);
									game.log(player, "的身份是", `#g${get.translation(identity)}`);
								} else {
									game.log(player, "的身份是", `#g${get.translation(`${identity2}2`)}`);
								}
							},
							this,
							this.special_identity,
							this.identity
						);
					}
					if (this.special_identity) {
						game.broadcastAll(
							(zhu, identity) => {
								zhu.removeSkill(identity);
							},
							game.zhu,
							this.special_identity
						);
					}
					game.checkResult();
					if (_status.mode === "purple") {
						const red = [];
						const blue = [];
						game.countPlayer(current => {
							const identity = current.identity.slice(1);
							if (identity !== "Zhu") {
								if (current.identity.indexOf("r") === 0) {
									red.push(current);
								} else {
									blue.push(current);
								}
							}
						});
						if (red.length <= 1 && blue.length <= 1) {
							game.broadcastAll(game.showIdentity);
						}
						return;
					}
					if (game.zhu && game.zhu.isZhu && (get.population("zhong") + get.population("nei") === 0 || get.population("zhong") + get.population("fan") === 0) && get.population("commoner") === 0) {
						game.broadcastAll(() => {
							if (game.showIdentity) {
								game.showIdentity();
							}
							if (game.zhu && game.zhu.isAlive() && get.population("nei") === 1 && get.config("nei_fullscreenpop")) {
								game.me.$fullscreenpop('<span style="font-family:xinwei"><span data-nature="fire">主公</span><span data-nature="soil"> vs </span><span data-nature="thunder">内奸</span></span>', null, null, false);
							}
						});
					}
					if (game.zhu && game.zhu.storage.enhance_zhu && !game.zhu.storage.enhance_zhu.startsWith("sixiang_") && get.population("fan") < 3) {
						game.zhu.removeSkill(game.zhu.storage.enhance_zhu);
						delete game.zhu.storage.enhance_zhu;
					}
					if (this === game.zhong) {
						game.broadcastAll(player => {
							game.zhu = player;
							game.zhu.identityShown = true;
							game.zhu.ai.shown = 1;
							game.zhu.setIdentity();
							game.zhu.isZhu = true;
							const skills = player.getStockSkills(true, true).filter(skill => {
								if (player.hasSkill(skill)) {
									return false;
								}
								const info = get.info(skill);
								return info && info.zhuSkill;
							});
							if (skills.length) {
								player.addSkills(skills);
							}
							game.zhu.node.identity.classList.remove("guessing");
							if (lib.config.animation && !lib.config.low_performance) {
								game.zhu.$legend();
							}
							delete game.zhong;
							if (_status.clickingidentity && _status.clickingidentity[0] === game.zhu) {
								for (const node of _status.clickingidentity[1]) {
									node.delete();
									node.style.transform = "";
								}
								delete _status.clickingidentity;
							}
						}, game.zhu);
						game.delay(2);
						game.zhu.playerfocus(1000);
					}

					if (!_status.over) {
						let giveup;
						if (get.population("fan") + get.population("nei") === 1) {
							giveup = game.players.find(current => current.identity === "fan" || current.identity === "nei");
						} else if (get.population("zhong") + get.population("mingzhong") + get.population("nei") === 0) {
							giveup = game.zhu;
						}
						if (giveup) {
							giveup.showGiveup();
						}
					}
				},
				/**
				 * 根据一次行动的目标和牌/技能效果更新玩家的 AI 暴露度，并在允许时刷新自动身份标记。
				 *
				 * `targets` 为数字时会直接叠加到暴露度；为目标数组时会结合目标已暴露程度、身份和行动收益推断本玩家的阵营倾向。
				 *
				 * @this { Player }
				 * @param { Player[] | number } targets - 行动目标列表，或要直接增加的暴露值。
				 * @param { Card | VCard } card - 触发暴露判断的牌或技能。
				 */
				logAi(targets, card) {
					if (this.ai.shown == 1 || this.isMad()) {
						return;
					}
					const stratagemMode = get.mode() == "identity" && _status.mode == "stratagem";
					if (stratagemMode && (!game.zhu || !game.zhu.isZhu || !game.zhu.identityShown)) {
						return;
					}
					if (typeof targets == "number") {
						this.ai.shown += targets;
					} else {
						let effect = 0;
						const info = get.info(card);
						if (info.ai && info.ai.expose) {
							if (_status.event.name != "_wuxie" || card.name != "wuxie") {
								this.ai.shown += info.ai.expose;
							} else {
								const infomap = _status.event._info_map;
								if (infomap && this != infomap.target && infomap.player && infomap.player.ai.shown) {
									this.ai.shown += 0.2;
								}
							}
						}
						for (const target of targets) {
							const shown = Math.abs(target.ai.shown);
							let coefficient = 1;
							if (shown < 0.2 || target.identity == "nei") {
								coefficient = 0;
							} else if (shown < 0.4) {
								coefficient = 0.5;
							} else if (shown < 0.6) {
								coefficient = 0.8;
							}
							const eff = get.effect(target, card, this);
							effect += eff * coefficient;
							if (eff == 0 && shown == 0 && ["zhong", "rZhong", "bZhong"].includes(this.identity) && target != this) {
								effect += 0.1;
							}
						}
						const targetsSelfOnly = targets.length == 1 && targets[0] == this;
						if (effect > 0 && !targetsSelfOnly) {
							const coefficient = effect < 1 ? 0.5 : 1;
							const expose = targets.length == 1 ? 0.2 : 0.1;
							this.ai.shown += expose * coefficient;
						} else if (effect < 0 && !targetsSelfOnly && this == game.me && ["nei", "commoner", "rYe", "bYe"].includes(game.me.identity)) {
							const expose = targets.length == 1 ? 0.2 : 0.1;
							this.ai.shown -= expose;
						}
					}
					if (!stratagemMode && this != game.me) {
						this.ai.shown *= 2;
					}
					if (this.ai.shown > 0.95) {
						this.ai.shown = 0.95;
					}
					if (this.ai.shown < -0.5) {
						this.ai.shown = -0.5;
					}
					if (_status.mode == "purple") {
						return;
					}
					if (stratagemMode) {
						return;
					}

					const marknow = !_status.connectMode && this != game.me && get.config("auto_mark_identity") && this.ai.identity_mark != "finished";
					if (marknow && _status.clickingidentity && _status.clickingidentity[0] == this) {
						for (const identityNode of _status.clickingidentity[1]) {
							identityNode.delete();
							identityNode.style.transform = "";
						}
						delete _status.clickingidentity;
					}
					if (!Array.isArray(targets)) {
						targets = [];
					}
					let effect = 0;
					let zhu = game.zhu;
					if (_status.mode == "zhong" && !game.zhu.isZhu) {
						zhu = game.zhong;
					}
					const targetsSelfOnly = targets.length == 1 && targets[0] == this;
					const hiddenIdentity = this.identity == "nei" || this.identity == "commoner";
					if (!targetsSelfOnly && !hiddenIdentity && this.ai.shown > 0) {
						effect = this.identity == "fan" ? -1 : 1;
					} else if (!targetsSelfOnly && hiddenIdentity) {
						for (const target of targets) {
							const shown = Math.abs(target.ai.shown);
							let coefficient = 1;
							if (shown < 0.2 || target.identity == "nei") {
								coefficient = 0;
							} else if (shown < 0.4) {
								coefficient = 0.5;
							} else if (shown < 0.6) {
								coefficient = 0.8;
							}
							effect += get.effect(target, card, this, zhu) * coefficient;
						}
					}
					if (!hiddenIdentity) {
						if (!marknow) {
							return;
						}
						if (effect > 0 && this.identity != "fan") {
							this.setIdentity("zhong");
							this.ai.identity_mark = "finished";
						} else if (effect < 0 && this.identity == "fan") {
							this.setIdentity("fan");
							this.ai.identity_mark = "finished";
						}
						return;
					}
					const markIdentity = identity => {
						if (marknow) {
							this.setIdentity(identity);
						}
						this.ai.identity_mark = identity || "finished";
					};
					if (effect > 0) {
						markIdentity(this.ai.identity_mark == "fan" ? undefined : "zhong");
					} else if (effect < 0 && get.population("fan") > 0) {
						markIdentity(this.ai.identity_mark == "zhong" ? undefined : "fan");
					}
				},
				/**
				 * 公开当前角色身份，并清理身份猜测交互节点。
				 *
				 * @this { Player }
				 * @returns { void }
				 */
				showIdentity() {
					this.node.identity.classList.remove("guessing");
					this.identityShown = true;
					this.ai.shown = 1;
					this.setIdentity();
					if (this.special_identity) {
						this.node.identity.firstChild.innerHTML = get.translation(`${this.special_identity}_bg`);
					}
					if (this.identity === "zhu") {
						this.isZhu = true;
					} else {
						delete this.isZhu;
					}
					if (_status.clickingidentity) {
						for (const node of _status.clickingidentity[1]) {
							node.delete();
							node.style.transform = "";
						}
						delete _status.clickingidentity;
					}
				},
			},
			content: {
				stratagemInsight: [
					async (event, _trigger, player) => {
						const { target } = event;

						game.log(player, "洞察了", target, "与其的阵营关系");

						const storage = player.storage;
						storage.zhibi ??= [];

						const zhibi = storage.zhibi;
						if (!zhibi.includes(target)) {
							zhibi.push(target);
						}
						const insightResult = (event.insightResult = get.insightResult(player, target));
						event.videoId = lib.status.videoId++;

						const send = (clientTarget, clientInsightResult, id) => {
							const classList = clientTarget.classList;
							const nonStratagemInsightFlashing = classList.contains("flash-animation-iteration-count-infinite");
							if (nonStratagemInsightFlashing) {
								clientTarget.nonStratagemInsightFlashing = true;
							} else {
								classList.add("flash-animation-iteration-count-infinite");
							}
							const identity = get.translation(`${clientInsightResult}2`);
							clientTarget.prompt(identity, clientInsightResult);
							const dialog = ui.create.dialog(`${get.translation(clientTarget)}是${identity}<br>`, "forcebutton");
							ui.create.spinningIdentityCard(clientInsightResult, dialog);
							const control = ui.create.control("ok", () => {
								dialog.close();
								control.close();
								_status.imchoosing = false;
								_status.event._result = {
									bool: true,
								};
								game.resume();
							});
							dialog.videoId = id;
							game.pause();
							game.countChoose();
						};
						game.broadcastAll(
							(clientPlayer, clientTarget, id) => {
								if (clientPlayer != game.me) {
									ui.create.dialog(`${get.translation(clientPlayer)}正在洞察${get.translation(clientTarget)}的阵营...<br>`).videoId = id;
								}
							},
							player,
							target,
							event.videoId
						);
						if (event.isMine()) {
							send(target, insightResult, event.videoId);
							game.pause();
						} else if (event.isOnline()) {
							player.send(send, target, insightResult, event.videoId);
							player.wait();
							game.pause();
						}
					},
					async (event, _trigger, player) => {
						const { target } = event;

						game.broadcastAll("closeDialog", event.videoId);
						if (!_status.connectMode && get.config("auto_mark_identity") && !target.node.identity.firstChild.innerHTML.length) {
							game.broadcastAll(
								(clientPlayer, clientTarget, currentInsightResult) => {
									if (clientPlayer.isUnderControl(true)) {
										clientTarget.setIdentity(currentInsightResult);
									}
								},
								player,
								target,
								event.insightResult
							);
						}
						const afterInsight = clientTarget => {
							clientTarget.unprompt();
							if (clientTarget.nonStratagemInsightFlashing) {
								delete clientTarget.nonStratagemInsightFlashing;
								return;
							}
							const classList = clientTarget.classList;
							if (classList.contains("flash-animation-iteration-count-infinite")) {
								classList.remove("flash-animation-iteration-count-infinite");
							}
						};
						if (event.isMine()) {
							afterInsight(target);
						} else if (event.isOnline()) {
							player.send(afterInsight, target);
						}
					},
				],
				async stratagemCamouflage(event) {
					const targets = game.players.filter(current => current.identity == "fan" && !current.ai.stratagemCamouflage).randomGets(Math.max(Math.round(get.population() / 6), 1));

					for (const target of targets) {
						target.ai.stratagemCamouflage = true;
					}

					let choosing = null;
					const me = game.me;
					if (event.players.includes(me) && me.identity === "nei") {
						event.videoId = lib.status.videoId++;
						const rebel = get.translation("fan2");
						const dialog = ui.create.dialog(`${get.translation(targets)}是${rebel}<br>`, "forcebutton");
						ui.create.spinningIdentityCard("fan", dialog);
						dialog.videoId = event.videoId;
						for (const victim of targets) {
							const classList = victim.classList;
							const nonCamouflageFlashing = classList.contains("flash-animation-iteration-count-infinite");
							if (nonCamouflageFlashing) {
								victim.nonCamouflageFlashing = true;
							} else {
								classList.add("flash-animation-iteration-count-infinite");
							}
							victim.prompt(rebel, "fan");
						}
						choosing = me.chooseControl("ok").set("dialog", dialog);
					}
					for (const current of game.filterPlayer(current => current === "nei")) {
						const storage = current.storage;
						storage.zhibi ??= [];
						storage.zhibi.addArray(targets);
					}

					if (choosing != null) {
						await choosing;
					}

					for (const current of targets) {
						if (game.me.identity == "nei" && get.config("nei_auto_mark_camouflage")) {
							current.setIdentity();
						}
						current.unprompt();
						if (current.nonCamouflageFlashing) {
							delete current.nonCamouflageFlashing;
							continue;
						}
						const classList = current.classList;
						if (classList.contains("flash-animation-iteration-count-infinite")) {
							classList.remove("flash-animation-iteration-count-infinite");
						}
					}
				},
				stratagemCamouflageOL: [
					async event => {
						const send = (clientCamouflaged, id, online) => {
							const me = game.me;
							let choosing;
							if (me.identity == "nei") {
								const storage = me.storage;
								storage.zhibi ??= [];
								storage.zhibi.addArray(clientCamouflaged);
								const rebel = get.translation("fan2");
								const dialog = ui.create.dialog(`${get.translation(clientCamouflaged)}是${rebel}<br>`, "forcebutton");
								ui.create.spinningIdentityCard("fan", dialog);
								dialog.videoId = id;
								clientCamouflaged.forEach(victim => {
									const classList = victim.classList;
									const nonCamouflageFlashing = classList.contains("flash-animation-iteration-count-infinite");
									if (nonCamouflageFlashing) {
										victim.nonCamouflageFlashing = true;
									} else {
										classList.add("flash-animation-iteration-count-infinite");
									}
									victim.prompt(rebel, "fan");
								});
								choosing = me.chooseControl("ok").set("dialog", dialog);
							} else {
								ui.create.dialog("请等待内奸身份确认...").videoId = id;
							}
							if (online) {
								game.resume();
							}
							return choosing;
						};
						const camouflaged = (event.targets = game.players.filter(current => current.identity == "fan" && !current.ai.stratagemCamouflage).randomGets(Math.max(Math.round(get.population() / 6), 1)));
						camouflaged.forEach(current => (current.ai.stratagemCamouflage = true));
						event.videoId = lib.status.videoId++;
						let time = 10000;
						if (lib.configOL && lib.configOL.choose_timeout) {
							time = parseInt(lib.configOL.choose_timeout) * 1000;
						}
						const aiTargets = (event.aiTargets = []);
						let localChoosing;
						event.players.forEach(current => {
							current.showTimer(time);
							if (current.isOnline()) {
								current.send(send, camouflaged, event.videoId, true);
								if (current.identity == "nei") {
									current.wait();
									event.withOL = true;
								}
								return;
							}
							const me = game.me;
							if (current == me) {
								event.withMe = true;
								localChoosing = send(camouflaged, event.videoId);
								if (me.identity == "nei") {
									me.wait();
								} else {
									event._result = {
										bool: true,
										_noHidingTimer: true,
									};
								}
								return;
							}
							if (current.identity == "nei") {
								aiTargets.push(current);
							}
						});
						if (aiTargets.length) {
							aiTargets.randomSort();
							new Promise(resolve => setTimeout(resolve, Math.ceil(3000 + 5000 * Math.random()))).then(() => {
								const interval = setInterval(
									() => {
										aiTargets.shift();
										if (aiTargets.length) {
											return;
										}
										clearInterval(interval);
										if (event.withAI) {
											game.resume();
										}
									},
									Math.ceil(500 + 500 * Math.random())
								);
							});
						}
						if (event.withMe) {
							let result = event._result;
							if (localChoosing) {
								result = await localChoosing.forResult();
								event._result = result;
							}
							game.me.unwait(result);
						}
						if (event.withOL && !event.resultOL) {
							game.pause();
						}
					},
					async event => {
						if (event.aiTargets.length) {
							event.withAI = true;
							game.pause();
						}
					},
					async event => {
						game.broadcastAll("closeDialog", event.videoId);
						event.players.forEach(current => current.hideTimer());
						const afterCamouflage = clientCamouflaged =>
							clientCamouflaged.forEach(victim => {
								victim.unprompt();
								if (victim.nonCamouflageFlashing) {
									delete victim.nonCamouflageFlashing;
									return;
								}
								const classList = victim.classList;
								if (classList.contains("flash-animation-iteration-count-infinite")) {
									classList.remove("flash-animation-iteration-count-infinite");
								}
							});
						const { targets } = event;
						event.players.forEach(current => {
							if (current.isOnline()) {
								current.send(afterCamouflage, targets);
								return;
							}
							const me = game.me;
							if (current == me && me.identity == "nei") {
								afterCamouflage(targets);
							}
						});
					},
				],
			},
		},
		get: {
			/**
			 * 计算一名角色对另一名角色的显式态度。
			 *
			 * @param { Player } from - 态度来源角色。
			 * @param { Player } to - 态度目标角色。
			 * @returns { number } 态度分值。
			 */
			rawAttitude(from, to) {
				let total = 0;
				let count = 0;
				if (_status.ai.customAttitude) {
					for (const customAttitude of _status.ai.customAttitude) {
						const value = customAttitude(from, to);
						if (value !== undefined) {
							total += value;
							count++;
						}
					}
				}
				if (count) {
					return total / count;
				}
				if (_status.mode === "purple") {
					const real = get.realAttitude(from, to);
					if (from === to || to.identityShown || (from.storage.zhibi && from.storage.zhibi.includes(to)) || (_status.yeconfirm && ["rYe", "bYe"].includes(to.identity) && ["rYe", "bYe"].includes(to.identity))) {
						return real * 1.1;
					}
					return (to.ai.shown + 0.1) * real + (from.identity.slice(0, 1) === to.identity.slice(0, 1) ? 3 : -3) * (1 - to.ai.shown);
				}
				if (_status.mode === "stratagem") {
					let stratagemTotal = 0;
					let stratagemCount = 0;
					if (_status.ai.customAttitude) {
						for (const customAttitude of _status.ai.customAttitude) {
							const value = customAttitude(from, to);
							if (value !== undefined) {
								stratagemTotal += value;
								stratagemCount++;
							}
						}
					}
					if (stratagemCount) {
						return stratagemTotal / stratagemCount;
					}
					const real = get.realAttitude(from, to);
					const zhibi = from.storage.zhibi;
					const stratagemExpose = from.storage.stratagem_expose;
					const followCamouflage = true;
					if (to.ai.shown) {
						return to.ai.shown * (real + (from.identity === to.identity || (from.identity === "zhu" && to.identity === "zhong") || (from.identity === "zhong" && to.identity === "zhu") || (from.identity === "nei" && to.identity === "zhu" && get.situation() <= 1) || (to.identity === "nei" && get.situation() <= 0 && ["zhu", "zhong"].includes(from.identity)) || (get.situation() >= 3 && from.identity === "fan") ? 2.9 : -2.9));
					}
					if (from === to || to.identityShown || (((stratagemExpose && stratagemExpose.includes(to)) || (zhibi && zhibi.includes(to))) && !to.ai.stratagemCamouflage)) {
						return real * 1.1;
					}
					if (from.identity === "nei" && to.ai.stratagemCamouflage) {
						return real * 1.1;
					}
					if (to.identity === "nei" && from.identity === "fan" && get.population("zhong") === 0 && zhibi) {
						const dead = game.dead.slice();
						for (const current of dead) {
							if (from.storage.zhibi.includes(current) && current.ai.stratagemCamouflage && from.storage.stratagem_expose && from.storage.stratagem_expose.includes(to)) {
								return -7;
							}
						}
						if (zhibi.includes(to)) {
							return 3;
						}
					}
					if (
						to.identity === "fan" &&
						from.identity === "nei" &&
						zhibi.includes(game.zhu) &&
						game.players
							.filter(current => current !== from && !zhibi.includes(current))
							.map(current => current.identity)
							.reduce((previous, current) => (!previous.includes(current) ? previous.push(current) && previous : previous), []).length === 1
					) {
						return real;
					}
					for (const fan of game.dead) {
						if (fan.identity !== "fan" || !fan.storage.stratagem_revitalization) {
							continue;
						}
						for (const current of fan.storage.stratagem_expose) {
							if (to === current) {
								return real;
							}
						}
					}
					if (from.identity === "fan" && to.identity === "fan") {
						if (from.ai.stratagemCamouflage) {
							const zhu = game.zhu && game.zhu.isZhu && game.zhu.identityShown ? game.zhu : undefined;
							if (zhu && zhu.storage.stratagem_expose && zhu.storage.stratagem_expose.includes(to)) {
								return 0;
							}
							if (zhibi && zhibi.includes(to)) {
								return -7;
							}
						}
						if (to.ai.stratagemCamouflage) {
							const zhu = game.zhu && game.zhu.isZhu && game.zhu.identityShown ? game.zhu : undefined;
							if (zhu && zhu.storage.stratagem_expose && zhu.storage.stratagem_expose.includes(to)) {
								return 0;
							}
							if (zhibi && zhibi.includes(to)) {
								return -7;
							}
						}
					}
					if (from.identity !== "nei" && zhibi && zhibi.includes(to) && !to.identityShown && followCamouflage && to.ai.stratagemCamouflage) {
						return -5;
					}
					if (from.identity !== "nei" && stratagemExpose && stratagemExpose.includes(to) && !to.identityShown) {
						return -5;
					}
					if (zhibi) {
						for (const to2 of zhibi) {
							if (!to2.storage.stratagem_expose) {
								continue;
							}
							if (to2.ai.stratagemCamouflage) {
								for (const to3 of to2.storage.stratagem_expose) {
									if (zhibi.slice().addArray(stratagemExpose).includes(to3)) {
										if (to === to2) {
											return real;
										}
									} else if (to === to3) {
										return Math.abs(real + 10) / 10;
									}
								}
								continue;
							}
							for (const to3 of to2.storage.stratagem_expose) {
								if (!zhibi.slice().addArray(stratagemExpose).includes(to3) && to === to3) {
									return get.rawAttitude(to3, to) * Math.sign(real);
								}
							}
						}
					}
					return Math.max(-1, Math.min(-0.1, (-Math.min(5, to.countCards("hes") / 2 + 1) / 5 - Math.max(0, 5 - to.hp) / 4) / 2));
				}
				//正常身份模式态度
				let difficulty = 0;
				if (to === game.me) {
					difficulty = 2 - get.difficulty();
				}
				if (from === to || to.identityShown || from.storage.dongcha === to || to.identityShown || (from.storage.zhibi && from.storage.zhibi.includes(to))) {
					return get.realAttitude(from, to) + difficulty * 1.5;
				}
				if (from.identity === "zhong" && to.ai.shown === 0 && from.ai.tempIgnore && !from.ai.tempIgnore.includes(to)) {
					for (const current of game.players) {
						if (current.ai.shown === 0 && current.identity === "fan") {
							return -0.1 + difficulty * 1.5;
						}
					}
				}
				let aishown = to.ai.shown;
				if ((to.identity === "nei" || to.identity === "commoner") && to.ai.shown < 1 && (to.ai.identity_mark === "fan" || to.ai.identity_mark === "zhong")) {
					aishown = 0.5;
				} else if (aishown === 0 && to.identity !== "fan" && to.identity !== "zhu") {
					let fanshown = true;
					for (const current of game.players) {
						if (current.identity === "fan" && current.ai.shown === 0 && current !== from) {
							fanshown = false;
							break;
						}
					}
					if (fanshown) {
						aishown = 0.3;
					}
				}
				return get.realAttitude(from, to) * aishown + difficulty * 1.5;
			},
			/**
			 * 计算一名角色对另一名角色的真实身份态度。
			 *
			 * @param { Player } from - 态度来源角色。
			 * @param { Player } to - 态度目标角色。
			 * @returns { number | undefined } 态度分值；无法匹配身份分支时返回`undefined`。
			 */
			realAttitude(from, to) {
				if (_status.mode === "purple") {
					if (["rZhu", "rZhong", "bNei"].includes(from.identity)) {
						if (to.identity === "rZhu") {
							return 8;
						}
						if (["rZhong", "bNei"].includes(to.identity)) {
							return 7;
						}
						return -7;
					}
					if (["bZhu", "bZhong", "rNei"].includes(from.identity)) {
						if (to.identity === "bZhu") {
							return 8;
						}
						if (["bZhong", "rNei"].includes(to.identity)) {
							return 7;
						}
						return -7;
					}
					if (["rYe", "bYe"].includes(to.identity)) {
						return 7;
					}
					if (["rZhu", "bZhu"].includes(to.identity) && game.hasPlayer(current => ["rZhong", "bZhong", "rNei", "bNei"].includes(current.identity))) {
						return 6.5;
					}
					return -7;
				}
				if (_status.mode === "stratagem") {
					if (!game.zhu) {
						if (from.identity === "nei" || to.identity === "nei") {
							return -1;
						}
						if (from.identity === to.identity) {
							return 6;
						}
						return -6;
					}
					const situation = get.situation();
					const identity = from.identity;
					let identity2 = to.identity;
					if (identity2 === "zhu" && !to.isZhu) {
						identity2 = "zhong";
						if (from === to) {
							return 10;
						}
					}
					if (from !== to && to.identity === "nei" && to.ai.shown < 1 && (to.ai.identity_mark === "fan" || to.ai.identity_mark === "zhong")) {
						identity2 = to.ai.identity_mark;
					}
					if (from.identity !== "nei" && from !== to && get.population("fan") === 0 && identity2 === "zhong") {
						for (const current of game.players) {
							if (current.identity === "nei" && current.ai.identity_mark === "zhong" && current.ai.shown < 1) {
								identity2 = "nei";
								break;
							}
						}
					}
					switch (identity) {
						case "zhu": {
							switch (identity2) {
								case "zhu":
									return 10;
								case "zhong":
									return 6;
								case "nei": {
									if (game.players.length === 2) {
										return -10;
									}
									if (to.identity === "zhong") {
										return 0;
									}
									if (get.population("fan") === 0) {
										if (to.ai.identity_mark === "zhong" && to.ai.shown < 1) {
											return 0;
										}
										return -1;
									}
									if (get.population("fan") === 1 && get.population("nei") === 1 && game.players.length === 3) {
										const fan = game.players.find(current => current.identity === "fan");
										if (fan && to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
											return -3;
										}
										return 0;
									}
									if (situation > 1) {
										return Math.max((situation - 8) / 3, -2);
									}
									return Math.min(3, get.population("fan"));
								}
								case "fan": {
									if (get.population("fan") === 1 && get.population("nei") === 1 && game.players.length === 3) {
										const nei = game.players.find(current => current.identity === "nei");
										if (nei && nei.hp > 1 && nei.hp > to.hp && nei.countCards("he") > to.countCards("he")) {
											return 0;
										}
										return -3;
									}
									return -4;
								}
							}
							break;
						}
						case "zhong":
							switch (identity2) {
								case "zhu":
									return 10;
								case "zhong":
									if (from === to) {
										return 5;
									}
									if (get.population("zhong") > 1) {
										return 3;
									}
									return 4;
								case "nei":
									if (get.population("fan") === 0 && get.population("zhong") === 1) {
										return -2;
									}
									if (get.population("zhong") >= 1) {
										return Math.min(3, -situation);
									}
									return 3;
								case "fan":
									return -8;
							}
							break;
						case "nei": {
							if (identity2 === "zhu" && game.players.length === 2) {
								return -10;
							}
							if (from !== to && identity2 !== "zhu" && game.players.length === 3) {
								return -8;
							}
							const strategy = get.aiStrategy();
							if (strategy === 4) {
								if (from === to) {
									return 10;
								}
								return 0;
							}
							let num;
							switch (identity2) {
								case "zhu":
									if (strategy === 6) {
										return -1;
									}
									if (strategy === 5) {
										return 10;
									}
									if (to.hp <= 0) {
										return 10;
									}
									if (get.population("fan") === 1) {
										const fan = game.players.find(current => current.identity === "fan");
										if (fan && to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
											return -3;
										}
										return 0;
									}
									if (situation > 1 || get.population("fan") === 0) {
										num = 0;
									} else {
										num = get.population("fan") + Math.max(0, 3 - game.zhu.hp);
									}
									if (strategy === 2) {
										num--;
									}
									if (strategy === 3) {
										num++;
									}
									return num;
								case "zhong":
									if (strategy === 5) {
										return Math.min(0, -situation);
									}
									if (strategy === 6) {
										return Math.max(-1, -situation);
									}
									if (get.population("fan") === 0) {
										num = -5;
									} else if (situation <= 0) {
										num = 0;
									} else if (game.zhu && game.zhu.hp < 2) {
										num = 0;
									} else if (game.zhu && game.zhu.hp === 2) {
										num = -1;
									} else if (game.zhu && game.zhu.hp <= 2 && situation > 1) {
										num = -1;
									} else {
										num = -2;
									}
									if (strategy === 2) {
										num--;
									}
									if (strategy === 3) {
										num++;
									}
									return num;
								case "nei":
									if (from === to) {
										return 10;
									}
									if (from.ai.friend.includes(to)) {
										return 5;
									}
									if (get.population("fan") + get.population("zhong") > 0) {
										return 0;
									}
									return -5;
								case "fan":
									if (strategy === 5) {
										return Math.max(-1, situation);
									}
									if (strategy === 6) {
										return Math.min(0, situation);
									}
									if ((game.zhu && game.zhu.hp <= 2 && situation < 0) || situation < -1) {
										num = -3;
									} else if (situation < 0 || get.population("zhong") === 0) {
										num = -2;
									} else if ((game.zhu && game.zhu.hp >= 4 && situation > 0) || situation > 1) {
										num = 1;
									} else {
										num = 0;
									}
									if (strategy === 2) {
										num++;
									}
									if (strategy === 3) {
										num--;
									}
									return num;
							}
							break;
						}
						case "fan":
							switch (identity2) {
								case "zhu":
									if (get.population("nei") > 0) {
										if (situation === 1) {
											return -6;
										}
										if (situation > 1) {
											return -5;
										}
									}
									return -8;
								case "zhong":
									if (game.zhu.hp >= 3 && to.hp === 1) {
										return -10;
									}
									return -7;
								case "nei":
									if (get.population("fan") === 1) {
										return 0;
									}
									if (get.population("zhong") === 0) {
										return -2;
									}
									if (game.zhu && game.zhu.hp <= 2 && game.zhu.identityShown) {
										return -1;
									}
									return 3;
								case "fan":
									return 5;
							}
							break;
					}
				}
				//正常身份模式态度
				if (!game.zhu) {
					if (from.identity === "nei" || to.identity === "nei" || from.identity === "commoner" || to.identity === "commoner") {
						return -1;
					}
					if (from.identity === to.identity) {
						return 6;
					}
					return -6;
				}
				const situation = get.situation();
				const identity = from.identity;
				let identity2 = to.identity;
				if (identity2 === "zhu" && !to.isZhu) {
					identity2 = "zhong";
					if (from === to) {
						return 10;
					}
				}
				if (from !== to && to.identity === "nei" && to.ai.shown < 1 && (to.ai.identity_mark === "fan" || to.ai.identity_mark === "zhong")) {
					identity2 = to.ai.identity_mark;
				}
				if (from.identity !== "nei" && from.identity !== "commoner" && from !== to && get.population("fan") === 0 && identity2 === "zhong") {
					for (const current of game.players) {
						if (current.identity === "nei" && current.ai.identity_mark === "zhong" && current.ai.shown < 1) {
							identity2 = "nei";
							break;
						} else if (current.identity === "commoner" && current.ai.identity_mark === "zhong" && current.ai.shown < 1) {
							identity2 = "commoner";
							break;
						}
					}
				}
				const zhongmode = !game.zhu.isZhu;
				switch (identity) {
					case "zhu": {
						switch (identity2) {
							case "zhu":
								return 10;
							case "zhong":
							case "mingzhong":
								return 6;
							case "nei": {
								if (game.players.length === 2) {
									return -10;
								}
								if (to.identity === "zhong") {
									return 0;
								}
								if (get.population("fan") === 0) {
									if (to.ai.identity_mark === "zhong" && to.ai.shown < 1) {
										return 0;
									}
									return -0.5;
								}
								if (zhongmode && to.ai.sizhong && to.ai.shown < 1) {
									return 6;
								}
								if (get.population("fan") === 1 && get.population("nei") === 1 && game.players.length === 3) {
									const fan = game.players.find(current => current.identity === "fan");
									if (fan && to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
										return -3;
									}
									return 0;
								}
								if (situation > 1) {
									return 0;
								}
								return Math.min(3, get.population("fan"));
							}
							case "fan": {
								if (get.population("fan") === 1 && get.population("nei") === 1 && game.players.length === 3) {
									const nei = game.players.find(current => current.identity === "nei");
									if (nei && nei.hp > 1 && nei.hp > to.hp && nei.countCards("he") > to.countCards("he")) {
										return 0;
									}
									return -3;
								}
								return -4;
							}
							case "commoner": {
								if (to.identity === "zhong") {
									return 0;
								}
								if (get.population("fan") === 0) {
									if (to.ai.identity_mark === "zhong" && to.ai.shown < 1) {
										return 0;
									}
									return -0.5;
								}
								if (zhongmode && to.ai.sizhong && to.ai.shown < 1) {
									return 6;
								}
								if (game.players.length === 3) {
									const fan = game.players.find(current => current.identity === "fan");
									if (fan && to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
										return -3;
									}
									return 3;
								}
								if (situation < 0 && game.zhu && game.zhu.hp <= 2) {
									return -3.8;
								}
								return Math.max(-4, 2 - get.population("fan"));
							}
						}
						break;
					}
					case "zhong":
					case "mingzhong":
						switch (identity2) {
							case "zhu":
								return 10;
							case "zhong":
							case "mingzhong":
								return 4;
							case "nei":
								if (get.population("fan") === 0) {
									return -2;
								}
								if (zhongmode && to.ai.sizhong && to.ai.shown < 1) {
									return 6;
								}
								return Math.min(3, -situation);
							case "fan":
								return -8;
							case "commoner":
								return Math.min(3, Math.max(-3, situation - 0.2));
						}
						break;
					case "nei": {
						if (identity2 === "zhu" && game.players.length === 2) {
							return -10;
						}
						if (from !== to && identity2 !== "zhu" && identity2 !== "commoner" && game.players.length === 3) {
							return -8;
						}
						const strategy = get.aiStrategy();
						if (strategy === 4) {
							if (from === to) {
								return 10;
							}
							return 0;
						}
						let num;
						switch (identity2) {
							case "zhu":
								if (strategy === 6) {
									return -1;
								}
								if (strategy === 5) {
									return 10;
								}
								if (to.hp <= 0) {
									return 10;
								}
								if (get.population("fan") === 1) {
									const fan = game.players.find(current => current.identity === "fan");
									if (fan && to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
										return -1.7;
									}
									return 0;
								}
								if (situation > 1 || get.population("fan") === 0) {
									num = 0;
								} else {
									num = get.population("fan") + Math.max(0, 3 - game.zhu.hp);
								}
								if (strategy === 2) {
									num--;
								}
								if (strategy === 3) {
									num++;
								}
								return num;
							case "zhong":
								if (strategy === 5) {
									return Math.min(0, -situation);
								}
								if (strategy === 6) {
									return Math.max(-1, -situation);
								}
								if (get.population("fan") === 0) {
									num = -5;
								} else if (situation <= 0) {
									num = 0;
								} else if (game.zhu && game.zhu.hp < 2) {
									num = 0;
								} else if (game.zhu && game.zhu.hp === 2) {
									num = -1;
								} else if (game.zhu && game.zhu.hp <= 2 && situation > 1) {
									num = -1;
								} else {
									num = -2;
								}
								if (zhongmode && situation < 2) {
									num = 4;
								}
								if (strategy === 2) {
									num--;
								}
								if (strategy === 3) {
									num++;
								}
								return num;
							case "mingzhong":
								if (zhongmode) {
									if (from.ai.sizhong === undefined) {
										from.ai.sizhong = Math.random() < 0.5;
									}
									if (from.ai.sizhong) {
										return 6;
									}
								}
								if (strategy === 5) {
									return Math.min(0, -situation);
								}
								if (strategy === 6) {
									return Math.max(-1, -situation);
								}
								if (get.population("fan") === 0) {
									num = -5;
								} else if (situation <= 0) {
									num = 0;
								} else {
									num = -3;
								}
								if (strategy === 2) {
									num--;
								}
								if (strategy === 3) {
									num++;
								}
								return num;
							case "nei":
								if (from === to) {
									return 10;
								}
								if (from.ai.friend.includes(to)) {
									return 5;
								}
								if (get.population("fan") + get.population("zhong") > 0) {
									return 0;
								}
								return -5;
							case "fan":
								if (strategy === 5) {
									return Math.max(-1, situation);
								}
								if (strategy === 6) {
									return Math.min(0, situation);
								}
								if ((game.zhu && game.zhu.hp <= 2 && situation < 0) || situation < -1) {
									num = -3;
								} else if (situation < 0 || get.population("zhong") + get.population("mingzhong") === 0) {
									num = -2;
								} else if ((game.zhu && game.zhu.hp >= 4 && situation > 0) || situation > 1) {
									num = 1;
								} else {
									num = 0;
								}
								if (strategy === 2) {
									num++;
								}
								if (strategy === 3) {
									num--;
								}
								return num;
							case "commoner":
								if (game.players.length <= 4) {
									return 5;
								}
								return Math.min(Math.max(-situation, -2), 2);
						}
						break;
					}
					case "fan":
						switch (identity2) {
							case "zhu":
								if (get.population("nei") > 0) {
									if (situation === 1) {
										return -6;
									}
									if (situation > 1) {
										return -5;
									}
								}
								return -8;
							case "zhong":
								if (!zhongmode && game.zhu.hp >= 3 && to.hp === 1) {
									return -10;
								}
								return -7;
							case "mingzhong":
								return -5;
							case "nei":
								if (zhongmode && to.ai.sizhong) {
									return -7;
								}
								if (get.population("fan") === 1) {
									return 0;
								}
								if (get.population("zhong") + get.population("mingzhong") === 0) {
									return -7;
								}
								if (game.zhu && game.zhu.hp <= 2) {
									return -1;
								}
								return Math.min(3, situation);
							case "fan":
								return 5;
							case "commoner":
								return 2 * get.population("fan") - 3;
						}
						break;
					case "commoner":
						switch (identity2) {
							case "zhu":
								if (situation > 0) {
									return 2 * Math.min(4, to.hp + to.countCards("h") / 4 - 2);
								}
								if (situation >= -3 && game.zhu) {
									return to.hp - 2 + to.countCards("h") / 4;
								} //return Math.min(-0.1,5-game.zhu.hp);
								return to.hp + to.countCards("h") / 3 - 4;
							case "zhong":
								if (situation > 0) {
									if (to.hp >= 2) {
										return Math.min(3, Math.max(1, to.hp + to.countCards("h") / 4 - 4));
									}
									return 0;
								}
								return -2;
							case "nei":
								if (game.players.length === 3 && get.population("nei") === 1) {
									return Math.min(3.5, to.hp - 1.5 + to.countCards("h") / 3) - (to.hp < (game.zhu ? game.zhu.hp : 0) ? 4 : 0);
								}
								if (game.players.length <= 4 && get.population("nei") === 1) {
									return Math.min(5, to.hp - 1.5 + to.countCards("h") / 3);
								}
								if (situation > 0) {
									return -3;
								}
								return 0;
							case "fan":
								if (situation < 0) {
									return to.hp + to.countCards("h") / 4 - 1.7 * get.population("fan") + 2;
								}
								if (situation === 0) {
									return 0;
								}
								return 0.55 * get.population("fan") - 2.1;
							case "commoner":
								return from === to ? 10 : to.hp <= 2 ? -2 : 0;
						}
						break;
				}
			},
			/**
			 * 计算当前主忠方相对反贼方的局势分。
			 *
			 * @param { boolean } [absolute] - 是否直接返回未归一化的局势分。
			 * @returns { number } 局势分；正数偏主忠，负数偏反贼。
			 */
			situation(absolute) {
				let zhuzhong = 0;
				let total = 0;
				let zhu;
				let fan = 0;
				for (const player of game.players) {
					let php = player.hp;
					if (player.hasSkill("benghuai") && php > 4) {
						php = 4;
					} else if (php > 6) {
						php = 6;
					}
					const score = player.countCards("h") + player.countCards("e") * 1.5 + php * 2;
					if (player.identity === "zhu") {
						zhuzhong += score * 1.2 + 5;
						total += score * 1.2 + 5;
						zhu = score;
					} else if (player.identity === "zhong" || player.identity === "mingzhong") {
						zhuzhong += score * 0.8 + 3;
						total += score * 0.8 + 3;
					} else if (player.identity === "fan") {
						zhuzhong -= score + 4;
						total += score + 4;
						fan += score + 4;
					}
				}
				if (absolute) {
					return zhuzhong;
				}
				let result = parseInt(10 * Math.abs(zhuzhong / total));
				if (zhuzhong < 0) {
					result = -result;
				}
				if (!game.zhong) {
					if (zhu < 12 && fan > 30) {
						result--;
					}
					if (zhu < 6 && fan > 15) {
						result--;
					}
					if (zhu < 4) {
						result--;
					}
				}
				return result;
			},
			/**
			 * 计算谋攻模式洞察时显示的阵营关系。
			 *
			 * @param { Player } from - 洞察来源角色。
			 * @param { Player } to - 洞察目标角色。
			 * @returns { string } 洞察结果。
			 */
			insightResult(from, to) {
				const friend = "friend";
				const enemy = "enemy";
				if (from.identity === "nei") {
					return to.identity;
				}
				if (to.identity === "nei") {
					return friend;
				}
				if (from.ai.stratagemCamouflage || to.ai.stratagemCamouflage) {
					return enemy;
				}
				if (from.identity === to.identity || (from.identity === "zhu" && to.identity === "zhong") || (from.identity === "zhong" && to.identity === "zhu")) {
					return friend;
				}
				return enemy;
			},
		},
		skill: {
			// 谋攻模式
			stratagem_gain: {
				trigger: {
					player: ["phaseBegin", "damageEnd"],
				},
				charlotte: true,
				ruleSkill: true,
				silent: true,
				async content(_event, trigger, player) {
					player.changeFury(trigger.name === "damage" ? trigger.num : 1, true);
				},
			},
			stratagem_insight: {
				trigger: {
					source: "damageSource",
					global: "loseHpEnd",
				},
				charlotte: true,
				ruleSkill: true,
				prompt2(event) {
					return `消耗1点怒气，洞察${get.translation(event.player)}的身份`;
				},
				filter(event, player) {
					if (!player.storage.stratagem_fury) {
						return false;
					}
					const target = event.player;
					if (target === player || !target.isIn() || target.identityShown) {
						return false;
					}
					let source = event.source;
					if (event.name === "loseHp") {
						const trigger = event.getParent()?._trigger;
						if (trigger != null) {
							source = trigger.source;
						}
					}
					return player === source;
				},
				check(event, player) {
					const storage = player.storage;
					const zhibi = storage.zhibi;
					if (zhibi?.includes(event.player)) {
						return false;
					}
					const stratagemExpose = storage.stratagem_expose;
					if (stratagemExpose?.includes(event.player)) {
						return false;
					}
					if (get.population("zhong") === 0 && player.identity === "fan") {
						return false;
					}
					return Math.abs(get.attitude(player, event.player)) <= 1;
				},
				logTarget: "player",
				async content(_event, trigger, player) {
					player.changeFury(-1, true);
					player.insightInto(trigger.player);
				},
			},
			stratagem_monarchy: {
				trigger: {
					player: ["dying", "phaseZhunbeiBegin"],
					global: "dieAfter",
				},
				charlotte: true,
				ruleSkill: true,
				priority: 100,
				firstDo: true,
				unique: true,
				silent: true,
				popup: false,
				filter(_event, player, name) {
					if (player.storage.stratagem_monarchy || player.identity !== "zhu") {
						return false;
					}
					if (name === "dieAfter") {
						return game.dead.length >= Math.max(Math.round(get.population() / 3), 2);
					}
					return name === "dying" || game.roundNumber >= Math.max(Math.round(get.population() / 2), 3);
				},
				async content(event, _trigger, player) {
					if (event.triggername == "dying") {
						await game.delayx();
					}
					player.storage.stratagem_monarchy = true;
					game.broadcastAll(clientPlayer => {
						if (!game.zhu) {
							game.zhu = clientPlayer;
						}
						clientPlayer.identityShown = true;
						clientPlayer.ai.shown = 1;
						clientPlayer.setIdentity();
						clientPlayer.isZhu = true;
						clientPlayer.node.identity.classList.remove("guessing");
						const config = lib.config;
						if (config.animation && !config.low_performance) {
							clientPlayer.$legend();
						}
						const clickingIdentity = _status.clickingidentity;
						if (!clickingIdentity || clickingIdentity[0] != clientPlayer) {
							return;
						}
						clickingIdentity[1].forEach(element => {
							element.delete();
							element.style.transform = "";
						});
						delete _status.clickingidentity;
					}, player);
					game.addVideo("showIdentity", player, "zhu");
					player.playerfocus(1000);
					await game.delay(2);
					await event.trigger("zhuUpdate");
					await player.recover();
					await player.draw();
					const skills = player.getStockSkills(true, true).filter(stockSkill => {
						if (player.hasSkill(stockSkill)) {
							return false;
						}
						const info = get.info(stockSkill);
						if (!info?.zhuSkill) {
							return false;
						}
						return true;
					});
					if (skills.length) {
						await player.addSkills(skills);
					}
				},
			},
			stratagem_revitalization: {
				trigger: {
					player: "dying",
				},
				charlotte: true,
				ruleSkill: true,
				unique: true,
				silent: true,
				filter(_event, player) {
					const storage = player.storage;
					return !storage.stratagem_revitalization && player.ai.stratagemCamouflage && game.dead.length < Math.max(Math.round(get.population() / 6), 1) && storage.stratagem_fury >= 2;
				},
				async content(_event, _trigger, player) {
					await game.delayx();
					player.storage.stratagem_revitalization = true;
					game.broadcastAll(clientPlayer => {
						clientPlayer.identityShown = true;
						clientPlayer.ai.shown = 1;
						clientPlayer.setIdentity();
						clientPlayer.node.identity.classList.remove("guessing");
						if (lib.config.animation && !lib.config.low_performance) {
							clientPlayer.$thunder();
						}
					}, player);
					game.addVideo("showIdentity", player, "fan");
					player.playerfocus(800);
					await game.delay(2);
					player.changeFury(-player.storage.stratagem_fury, true);
					await player.discard(player.getCards("hej"));
					await player.link(false);
					await player.turnOver(false);
					await player.recover(2 - player.hp);
					await player.draw(3);
				},
			},
			stratagem_expose: {
				trigger: {
					player: "useCard",
				},
				forced: true,
				silent: true,
				popup: false,
				filter(event, player) {
					const targets = event.targets;
					if (targets.length !== 1) {
						return false;
					}
					const target = targets[0];
					return (
						target === player &&
						(target.identityShown ||
							player.storage.zhibi.includes(target) ||
							game.hasPlayer2(current => {
								if (!current.identityShown) {
									return false;
								}
								const storage = current.storage;
								return (storage.stratagem_revitalization || storage.stratagem_monarchy) && storage.stratagem_expose.includes(target);
							}))
					);
				},
				async content(_event, trigger, player) {
					const storage = trigger.targets[0].storage;
					storage.stratagem_expose ??= [];
					storage.stratagem_expose.add(player);
				},
			},
			// 3v3v2
			yexinbilu: {
				enable: "phaseUse",
				charlotte: true,
				ruleSkill: true,
				skillAnimation: "legend",
				animationColor: "thunder",
				filter(event, player) {
					return player.identity === "rYe" || player.identity === "bYe";
				},
				async content(_event, _trigger, player) {
					game.removeGlobalSkill("yexinbilu");
					await player.yexinbilu();
				},
				ai: {
					order: 10,
					result: {
						player(player) {
							return 1 - game.countPlayer(current => current !== player && (current.identity === "rYe" || current.identity === "bYe") && (current === game.me || current.isOnline()));
						},
					},
				},
			},
			// 特殊身份
			identity_junshi: {
				name: "军师",
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				charlotte: true,
				silent: true,
				async content(event, trigger, player) {
					const cards = get.cards(3);
					await game.cardsGotoOrdering(cards);
					const result = await player
						.chooseToMove({
							prompt: "观星：点击或拖动将牌移动到牌堆顶或牌堆底",
							list: [["牌堆顶", cards], ["牌堆底"]],
							processAI(list) {
								const player = get.player();
								const cards = list[0][1];
								const judges = player.getCards("j");

								const top = [];
								let stopped = false;
								if (!player.hasWuxie()) {
									for (const card of judges) {
										const judge = get.judge(card);
										cards.sort((a, b) => judge(b) - judge(a));
										if (judge(cards[0]) < 0) {
											stopped = true;
											break;
										} else {
											top.unshift(cards.shift());
										}
									}
								}
								if (!stopped) {
									cards.sort((a, b) => get.value(b, player) - get.value(a, player));
									while (cards.length) {
										if (get.value(cards[0], player) <= 5) {
											break;
										}
										top.unshift(cards.shift());
									}
								}
								const bottom = cards;
								return [top, bottom];
							},
						})
						.forResult();

					const top = result.moved[0];
					const bottom = result.moved[1];
					top.reverse();
					await game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event, card) => {
						if (event.top_cards.includes(card)) {
							return ui.cardPile.firstChild;
						}
						return null;
					});
					player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
					game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
					game.updateRoundNumber();
					await game.delayx();
				},
				mark: true,
				intro: {
					content: "准备阶段开始时，可以观看牌堆顶的三张牌，然后将这些牌以任意顺序置于牌堆顶或牌堆底",
				},
			},
			identity_dajiang: {
				name: "大将",
				charlotte: true,
				mark: true,
				intro: {
					content: "手牌上限+1",
				},
				mod: {
					maxHandcard(player, num) {
						return num + 1;
					},
				},
			},
			identity_zeishou: {
				name: "贼首",
				charlotte: true,
				mark: true,
				intro: {
					content: "手牌上限-1",
				},
				mod: {
					maxHandcard(player, num) {
						return num - 1;
					},
				},
			},
			// 四象标记
			sixiang_zhuque: {
				enable: "phaseUse",
				charlotte: true,
				prompt: "弃置一张非基本牌，对一名角色造成1点伤害",
				filter(event, player) {
					return player.hasCard(card => get.type(card, null, player) !== "basic", "he");
				},
				filterCard(card, player) {
					return get.type(card, null, player) !== "basic";
				},
				position: "he",
				filterTarget: true,
				check(card) {
					return 7 - get.value(card);
				},
				async content(event, _trigger, player) {
					player.removeSkill("sixiang_zhuque");
					player.addTempSkill("sixiang_zhuque_cancel", "phaseUseEnd");
					await event.target.damage("nocard");
				},
				group: "sixiang_remove",
				mark: true,
				markimage: "image/mode/identity/mark/sixiang_zhuque.jpg",
				intro: {
					content: "出牌阶段，你可以弃置一张非基本牌，对一名角色造成1点伤害，以此法杀死反贼不执行奖惩。",
				},
				ai: {
					order: 0.6,
					result: {
						player(player, target) {
							if (ui.selected.cards.length) {
								return -get.value(ui.selected.cards[0], player);
							}
						},
						target(player, target) {
							return get.damageEffect(target, player, target);
						},
					},
				},
				subSkill: {
					cancel: {
						trigger: {
							global: ["drawBegin", "discardBegin"],
						},
						filter(event, player) {
							const evt = event.getParent();
							if (!evt?.player) {
								return false;
							}
							return evt.name === "die" && evt.player.identity === "fan" && event.getParent(4).name === "sixiang_zhuque";
						},
						charlotte: true,
						forceDie: true,
						silent: true,
						async content(_event, trigger) {
							trigger.cancel();
						},
					},
				},
			},
			sixiang_xuanwu: {
				enable: "chooseToUse",
				charlotte: true,
				prompt: "将一张牌当【桃】使用",
				filter(event, player) {
					return player.hasCard(true, "hes");
				},
				viewAs: {
					name: "tao",
				},
				filterCard: true,
				position: "hes",
				check(card) {
					if (get.tag(card, "recover")) {
						return 0;
					}
					return 9 - get.value(card);
				},
				async precontent(_event, _trigger, player) {
					player.removeSkill("sixiang_xuanwu");
				},
				group: "sixiang_remove",
				mark: true,
				markimage: "image/mode/identity/mark/sixiang_xuanwu.jpg",
				intro: {
					content: "你可以将一张牌当【桃】使用。",
				},
			},
			sixiang_qinglong: {
				trigger: {
					player: "phaseBegin",
				},
				charlotte: true,
				filter(event, player) {
					if (!player.hasJudge("lebu") && !player.hasJudge("bingliang")) {
						return false;
					}
					return player.countCards("he") > 1;
				},
				async cost(event, trigger, player) {
					const lebu = player.hasJudge("lebu");
					const bingliang = player.hasJudge("bingliang");

					let info = "弃置两张牌，然后弃置判定区内的";
					if (lebu) {
						info += "【乐不思蜀】";
					}
					if (bingliang) {
						if (lebu) {
							info += "或";
						}
						info += "【兵粮寸断】";
					}
					event.result = await player
						.chooseToDiscard({
							prompt: get.prompt(event.skill),
							prompt2: info,
							selectCard: 2,
							position: "he",
							ai(card) {
								const goon = get.event().goon;
								if (goon) {
									return goon - get.value(card);
								}
								return 0;
							},
						})
						.set("logSkill", event.skill)
						.set(
							"goon",
							(() => {
								if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
									return false;
								}
								const cards = player.getCards("j", card => {
									const name = card.viewAs || card.name;
									return name !== "lebu" || name !== "bingliang";
								});
								return cards.reduce((acc, card) => {
									const eff = get.effect(
										player,
										{
											name: card.viewAs || card.name,
											cards: [card],
										},
										player,
										player
									);
									if (eff < 0) {
										return Math.max(acc, Math.sqrt(-eff));
									}
									return acc;
								}, 0);
							})()
						)
						.forResult();
					event.result.skill_popup = false;
				},
				async content(event, trigger, player) {
					const lebu = player.getCards("j", j => {
						return j.viewAs === "lebu" || j.name === "lebu";
					});
					const bingliang = player.getCards("j", j => {
						return j.viewAs === "bingliang" || j.name === "bingliang";
					});
					player.removeSkill("sixiang_qinglong");
					let control;
					if (lebu.length && bingliang.length) {
						control = (
							await player
								.chooseControl({
									prompt: "请选择要弃置的牌",
									controls: ["lebu", "bingliang"],
									ai() {
										return get.event().control;
									},
								})
								.set(
									"control",
									(() => {
										if (
											get.effect(
												player,
												{
													name: "lebu",
													cards: lebu,
												},
												player,
												player
											) >
											get.effect(
												player,
												{
													name: "bingliang",
													cards: bingliang,
												},
												player,
												player
											)
										) {
											return "bingliang";
										}
										return "lebu";
									})()
								)
								.forResult()
						).control;
					} else if (lebu) {
						control = "lebu";
					} else if (bingliang) {
						control = "bingliang";
					}
					if (control) {
						await player.discard(control === "lebu" ? lebu : bingliang);
					}
				},
				group: "sixiang_remove",
				mark: true,
				markimage: "image/mode/identity/mark/sixiang_qinglong.jpg",
				intro: {
					content: "回合开始时，你可以弃置两张牌，弃置你判定区的【乐不思蜀】或【兵粮寸断】。",
				},
			},
			sixiang_baihu: {
				enable: ["chooseToUse", "chooseToRespond"],
				charlotte: true,
				prompt: "将一张牌当【杀】使用或打出",
				viewAs: {
					name: "sha",
				},
				filterCard: true,
				position: "hes",
				check(card) {
					return 5 - get.value(card);
				},
				async precontent(_event, _trigger, player) {
					player.removeSkill("sixiang_baihu");
				},
				group: ["sixiang_baihu_shan", "sixiang_remove"],
				mark: true,
				markimage: "image/mode/identity/mark/sixiang_baihu.jpg",
				intro: {
					content: "你可以将一张牌当【杀】或【闪】使用或打出。",
				},
				ai: {
					respondSha: true,
					result: {
						player(player, target) {
							return -ui.selected.cards.reduce((p, c) => p + get.value(c, player), 0) / 6;
						},
					},
				},
				subSkill: {
					shan: {
						enable: ["chooseToUse", "chooseToRespond"],
						charlotte: true,
						prompt: "将一张牌当【闪】使用或打出",
						viewAs: {
							name: "shan",
						},
						filterCard: true,
						position: "hes",
						check(card) {
							return 5 - get.value(card);
						},
						async precontent(_event, _trigger, player) {
							player.removeSkill("sixiang_baihu");
						},
						ai: {
							respondShan: true,
							result: {
								player(player, target) {
									return 1 - ui.selected.cards.reduce((p, c) => p + get.value(c, player), 0) / 6;
								},
							},
							effect: {
								target(card, player, target, current) {
									if (get.tag(card, "respondShan") && current < 0) {
										return 0.8;
									}
								},
							},
						},
					},
				},
			},
			sixiang_remove: {
				trigger: {
					global: "phaseEnd",
				},
				filter(event, player) {
					return !game.hasPlayer(cur => cur.identity === "fan");
				},
				charlotte: true,
				silent: true,
				async content(_event, _trigger, player) {
					player.removeSkill(["sixiang_zhuque", "sixiang_xuanwu", "sixiang_qinglong", "sixiang_baihu"]);
				},
				sub: true,
			},
		},
		help: {
			身份模式: '<div style="margin:10px">选项</div><ul style="margin-top:0"><li>加强主公<br>反贼人数多于2时主公会额外增加一个技能（每个主公的额外技能固定，非常备主公增加天命）' + '<li>特殊身份<br><ul style="padding-left:20px;padding-top:5px"><li>军师：忠臣身份。只要军师存活，主公在准备阶段开始时，可以观看牌堆顶的三张牌，然后将这些牌以任意顺序置于牌堆顶或牌堆底<li>大将：忠臣身份。只要大将存活，主公手牌上限+1<li>贼首：反贼身份，只要贼首存活，主公手牌上限-1</ul></ul>' + "<li>平民身份<br>英盗版三国杀于2017标准版中提出的新概念。平民的获胜条件为：当其他身份的角色达成了其获胜条件，且你存活，你也获胜；同时内奸的获胜条件改为：主公死亡时，场上所有忠臣和反贼均已死亡。即内奸可以和与平民共同胜利。杀死平民的角色的奖惩为：摸两张牌。" + "<li>年机制<br>英盗版三国杀于2019标准版中提出的新概念。“年”是一个全局概念，游戏开始时为第一年，当牌堆洗牌时，年数+1。一局游戏的限定年数为本局游戏开始时玩家总数。当年数增加后，若当前年数已超过限定年数，则主忠方直接获胜，若平民存活则平民也获胜。",
			明忠模式: '<div style="margin:10px">明忠模式（忠胆英杰）</div><ul style="margin-top:0"><li>本模式需要8名玩家进行游戏，使用的身份牌为：1主公、2忠臣、4反贼和1内奸。游戏开始时，每名玩家随机获得一个身份，由系统随机选择一名忠臣身份的玩家亮出身份（将忠臣牌正面朝上放在面前），其他身份（包括主公）的玩家不亮出身份。<li>' + "首先由亮出身份的忠臣玩家随机获得六张武将牌，挑选一名角色，并将选好的武将牌展示给其他玩家。之后其余每名玩家随机获得三张武将牌，各自从其中挑选一张同时亮出<li>" + "亮出身份牌的忠臣增加1点体力上限。角色濒死和死亡的结算及胜利条件与普通身份局相同。",
			谋攻模式: '<div style="margin:10px">模式命名由来</div><ul style="margin-top:0"><li>《谋攻篇》一词出自《孙子兵法·谋攻篇》，是春秋时期兵法家孙武创作的一篇散文。《谋攻篇》故知胜有五：知可以战与不可以战者胜，识众寡之用者胜，上下同欲者胜，以虞待不虞者胜，将能而君不御者胜。</ul>' + '<div style="margin:10px">游戏规则</div><ul style="margin-top:0"><li>谋攻篇模式为六名玩家参与的全暗身份模式，引入新机制“怒气”，玩家可以消耗怒气探查其他角色的身份是敌人或者队友，或使用怒气强化手牌，以达到识别出队友并击杀敌人的目标。' + "<li>各身份玩家的胜利条件与身份局中对应身份的胜利条件一致，且该模式下没有奖惩。" + "<li>当主公进入濒死、场上有两名角色阵亡、第三轮的主公准备阶段，主公将会翻开身份牌，回复1点体力并摸一张牌，并获得武将牌上的主公技。" + "<li>内奸在游戏开始时将会得知一名反贼的身份，并令该反贼被“伪装”。本局游戏内，被“伪装”的反贼在被任何人探查身份时，结果都提示为“敌人”。作为补偿，其第一次进入濒死时，若场上没有角色死亡且其怒气值不小于2，其弃置区域内所有牌，重置武将牌，将体力回复至2点并摸三张牌。" + "<li>特殊地，内奸在被所有角色探查时，都提示为“队友”；内奸在进行探查时，直接得知目标的身份。</ul>" + '<div style="margin:10px">新机制“怒气”</div><ul style="margin-top:0"><li>一名角色在回合开始时或受到1点伤害后，将获得1点怒气；怒气上限为3。<li>一名角色令其他角色扣减体力后，该角色可以消耗1点怒气，查探扣减体力的角色是敌或友。</ul>' + '<div style="margin:10px">强化卡牌规则</div><ul style="margin-top:0"><li>在第二轮游戏开始后，当你需要使用一张“强化表”内的牌时，你可以通过消耗怒气将此牌强化。' + '<li>可强化卡牌<br><ul style="padding-left:20px;padding-top:5px">' + "<li>【杀】：消耗1点怒气进行强化，你令响应此杀所需使用的【闪】数+1" + "<li>【闪】：消耗1点怒气进行强化，使用时视为两张【闪】的效果" + "<li>【决斗】：消耗2点怒气进行强化，对此牌的目标造成伤害时，伤害+1" + "<li>【火攻】：消耗2点怒气进行强化，造成的伤害+1" + "<li>【桃】：消耗3点怒气进行强化，回复的体力+1</ul></ul>",
			"3v3v2": '<div style="margin:10px">3v3v2模式</div><ul style="margin-top:0"><li>游戏准备<br>本模式需要8名玩家进行游戏。游戏开始前，所有玩家随机分成两组，每组四人，分别称为「冷色阵营」和「暖色阵营」，然后分发身份牌，抽取到「主帅」身份的玩家亮出身份牌。' + "<li>身份牌<br>每组的身份分为四种。<br>主帅（主）和前锋（忠）：联合对方阵营的细作，击杀己方细作，对方阵营的主帅和前锋以及所有的野心家。<br>细作（内）：帮助对方阵营的主帅和前锋，击杀对方细作，己方阵营的主帅和前锋以及所有的野心家。<br>野心家（野）：联合对方阵营中的野心家，击杀所有其他角色，成为最后的生还者。<br>" + "<li>胜负判定<br>冷色主帅，先锋和暖色细作在所有野心家和对方主帅全部阵亡后视为胜利，在冷色主帅阵亡后视为游戏失败。<br>暖色主帅，先锋和冷色细作在所有野心家和对方主帅阵亡后视为胜利，在暖色主帅阵亡后视为失败。<br>野心家在所有不为野心家的角色阵亡后视为胜利，在双方主帅全部阵亡而有非野心家角色存活时失败。<br>当有角色阵亡后，若有角色满足胜利条件，游戏结束。若所有角色均满足失败条件，则游戏平局。若一名角色满足失败条件，即使其满足胜利条件，也视为游戏失败。<br>" + "<li>游戏流程<br>在「游戏准备」中的工作完成后，冷色主帅选择一个势力，然后暖色主帅选择一个其他势力，作为双方各自的势力将池。<br>双方主帅从各自的势力将池中获得两张常备主公武将牌和四张非常备主公武将牌，然后选择一张作为武将牌，将其他的武将牌放回势力将池并洗混。然后双方的其他玩家从各自的势力将池中随机获得五张武将牌，选择一张作为自己的武将牌。<br>暖色主帅成为游戏的一号位，双方主帅各加1点体力和体力上限。七号位和八号位的起始手牌+1。<br>当场上第一次有玩家死亡时，野心家确认彼此的身份牌，然后获得技能〖野心毕露〗：出牌阶段，你可以明置身份牌，加1点体力上限和体力值。若如此做，所有的野心家失去技能〖野心毕露〗<br>" + "<li>击杀奖惩<br>杀死颜色不同的主帅的角色回复1点体力，杀死颜色不同的先锋的角色摸两张牌，杀死颜色相同的细作的角色摸三张牌，杀死颜色相同的先锋的主帅弃置所有手牌。<br>" + "<li>制作团队<br>游戏出品：紫星居<br>游戏设计：食茸貳拾肆<br>游戏开发：食茸貳拾肆、紫髯的小乔、聆星Mine、空城琴音依旧弥漫、丽景原同志、雪之彩翼、拉普拉斯、明月照沟渠<br>程序化：无名杀<br>鸣谢：荆哲、魔风、萨巴鲁酱、这就是秋夜</ul></ul>",
		},
	};
};
