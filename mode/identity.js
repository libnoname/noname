import { lib, game, ui, get, ai, _status } from "../noname.js";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "identity",
		start() {
			"step 0";
			if (!lib.config.new_tutorial) {
				ui.arena.classList.add("only_dialog");
			}
			_status.mode = get.config("identity_mode");
			if (_status.brawl && _status.brawl.submode) {
				_status.mode = _status.brawl.submode;
			}
			event.replacePile = function () {
				var list = ["shengdong", "qijia", "caomu", "jinchan", "zengbin", "fulei", "qibaodao", "zhungangshuo", "lanyinjia"];
				var map = {
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
				for (var i = 0; i < lib.card.list.length; i++) {
					var name = lib.card.list[i][2];
					if (list.includes(name)) {
						lib.card.list.splice(i--, 1);
					} else if (map[name]) {
						lib.card.list[i][2] = map[name];
						lib.card.list[i]._replaced = true;
					}
				}
			};
			"step 1";
			var playback = localStorage.getItem(lib.configprefix + "playback");
			if (playback) {
				ui.create.me();
				ui.arena.style.display = "none";
				ui.system.style.display = "none";
				_status.playback = playback;
				localStorage.removeItem(lib.configprefix + "playback");
				var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
				store.get(parseInt(playback)).onsuccess = function (e) {
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
			"step 2";
			if (!lib.config.new_tutorial) {
				_status.new_tutorial = true;
				lib.init.onfree();
				game.saveConfig("version", lib.version);
				var clear = function () {
					ui.dialog.close();
					while (ui.controls.length) {
						ui.controls[0].close();
					}
				};
				var clear2 = function () {
					ui.auto.show();
					ui.arena.classList.remove("only_dialog");
				};
				var step1 = function () {
					ui.create.dialog("欢迎来到无名杀，是否进入新手向导？");
					game.saveConfig("new_tutorial", true);
					ui.dialog.add('<div class="text center">跳过后，你可以在选项-其它中重置新手向导');
					ui.auto.hide();
					ui.create.control("跳过向导", function () {
						clear();
						clear2();
						game.resume();
						// lib.cheat.cfg(); // owidgets
					});
					ui.create.control("继续", step2);
				};
				var step2 = function () {
					if (!lib.config.phonelayout) {
						clear();
						ui.create.dialog("如果你在使用手机，可能会觉得按钮有点小" + "，将布局改成移动可以使按钮变大");
						ui.dialog.add('<div class="text center">你可以在选项-外观-布局中更改此设置');
						var lcontrol = ui.create.control("使用移动布局", function () {
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
						ui.create.control("继续", step3);
					} else {
						step3();
					}
				};
				var step3 = function () {
					if (lib.config.touchscreen) {
						clear();
						ui.create.dialog("触屏模式中，下划可以显示菜单，上划可以切换托管，双指单击可以暂停");
						ui.dialog.add('<div class="text center">你可以在选项-通用-中更改手势设置');
						ui.create.control("继续", step4);
					} else {
						step4();
					}
				};
				var step4 = lib.genAsync(function* () {
					clear();
					ui.window.classList.add("noclick_important");
					ui.click.configMenu();
					ui.control.classList.add("noclick_click_important");
					ui.control.style.top = "calc(100% - 105px)";
					yield new Promise(resolve => ui.create.control("在菜单中，可以进行各项设置", resolve));
					ui.click.menuTab("选项");
					yield new Promise(resolve => ui.controls[0].replace("如果你感到游戏较卡，可以开启流畅模式", resolve));
					yield new Promise(resolve => ui.controls[0].replace("在技能一栏中，可以设置自动发动或双将禁配的技能", resolve));
					ui.click.menuTab("武将");
					yield new Promise(resolve => ui.controls[0].replace("在武将或卡牌一栏中，单击武将/卡牌可以将其禁用", resolve));
					ui.click.menuTab("战局");
					yield new Promise(resolve => ui.controls[0].replace("在战局中可以输入游戏命令，或者管理录像", resolve));
					ui.click.menuTab("帮助");
					yield new Promise(resolve => ui.controls[0].replace("在帮助中，可以检查更新和下载素材", resolve));
					ui.click.configMenu();
					ui.window.classList.remove("noclick_important");
					ui.control.classList.remove("noclick_click_important");
					ui.control.style.top = "";
					step5();
				});
				var step5 = function () {
					clear();
					ui.create.dialog("如果还有其它问题，欢迎来到百度无名杀吧进行交流");
					ui.create.control("完成", function () {
						clear();
						clear2();
						game.resume();
					});
				};
				game.pause();
				step1();
			} else {
				if (!_status.connectMode) {
					game.showChangeLog();
				}
			}
			"step 3";
			if (typeof _status.new_tutorial == "function") {
				_status.new_tutorial();
			}
			delete _status.new_tutorial;
			if (_status.connectMode) {
				game.waitForPlayer(function () {
					if (lib.configOL.identity_mode == "zhong" || lib.configOL.identity_mode == "purple") {
						lib.configOL.number = 8;
					}
				});
			}
			"step 4";
			var yearLimitCheck = () => {
				var next = game.createEvent("year_limit_pop", false);
				next.setContent(function () {
					"step 0";
					var str = get.cnNumber(game.shuffleNumber + 1, true);
					game.me.$fullscreenpop(`第${str}年`, "thunder");
					game.log("游戏进入了", `#y第${str}年`);
					if (game.shuffleNumber + 1 < game.countPlayer2()) {
						event.finish();
					} else {
						game.delay(2);
					}
					"step 1";
					game.me.$fullscreenpop("年份已到", "metal");
					game.log("年份已到，主忠方判定为胜利");
					game.delay(2);
					"step 2";
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
						var identity = lib.configOL.enable_commoner ? "commoner" : "nei";
						for (var i = 1; i < lib.config.mode_config.identity.identity.length; i++) {
							var list = lib.config.mode_config.identity.identity[i];
							var toReplace;
							if (list.filter(i => i == "nei").length >= 2) {
								toReplace = "nei";
							} else if (list.filter(i => i == "zhong").length > list.filter(i => i == "fan").length / 2) {
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
					var identity = get.config("enable_commoner") ? "commoner" : "nei";
					for (var i = 1; i < lib.config.mode_config.identity.identity.length; i++) {
						var list = lib.config.mode_config.identity.identity[i];
						var toReplace;
						if (list.filter(i => i == "nei").length >= 2) {
							toReplace = "nei";
						} else if (list.filter(i => i == "zhong").length > list.filter(i => i == "fan").length / 2) {
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
				for (var i = 0; i < game.players.length; i++) {
					game.players[i].getId();
				}
				if (_status.brawl && _status.brawl.chooseCharacterBefore) {
					_status.brawl.chooseCharacterBefore();
				}
				game.chooseCharacter();
			}
			"step 5";
			if (ui.coin) {
				_status.coinCoeff = get.coinCoeff([game.me.name]);
			}
			if (game.players.length == 2) {
				game.showIdentity(true);
				var map = {};
				for (var i in lib.playerOL) {
					map[i] = lib.playerOL[i].identity;
				}
				game.broadcast(function (map) {
					for (var i in map) {
						lib.playerOL[i].identity = map[i];
						lib.playerOL[i].setIdentity();
						lib.playerOL[i].ai.shown = 1;
					}
				}, map);
			} else {
				for (var i = 0; i < game.players.length; i++) {
					game.players[i].ai.shown = 0;
				}
			}
			var stratagemMode = _status.mode == "stratagem";
			if (stratagemMode) {
				var beginner;
				if (_status.cheat_seat) {
					var seat = _status.cheat_seat.link;
					beginner = seat == 0 ? game.me : game.players[game.players.length - seat];
					if (!beginner) {
						beginner = game.me;
					}
					delete _status.cheat_seat;
				} else {
					beginner = game.players[Math.floor(Math.random() * game.players.length)];
				}
				event.beginner = beginner;

				var stratagemBroadcast = () => {
					_status.stratagemFuryMax = 3;
					ui.css.stratagemCardStyle = lib.init.sheet([".card.stratagem-fury-glow:before{", "opacity:0.2;", "box-shadow:rgba(0,0,0,0.2) 0 0 0 1px,rgb(255,109,12) 0 0 5px,rgb(255,0,0) 0 0 10px;", "background-color:yellow;", "-webkit-filter:blur(5px);", "filter:blur(5px);", "}"].join(""));
				};
				game.broadcastAll(stratagemBroadcast);
				if (_status.connectMode && !_status.postReconnect.stratagemReinit) {
					_status.postReconnect.stratagemReinit = [stratagemBroadcast, {}];
				}
				for (var current of game.players) {
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
						function (player, skill) {
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

			var players = get.players(lib.sort.position);
			var info = [];
			for (var i = 0; i < players.length; i++) {
				var ifo = {
					name: players[i].name1,
					name2: players[i].name2,
					identity: players[i].identity,
					nickname: players[i].node.nameol.innerHTML,
				};
				if (stratagemMode) {
					ifo.translate = lib.translate[game.players[i].name];
					ifo.isCamouflaged = players[i].ai.stratagemCamouflage;
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
				for (var i = 0; i < game.players.length; i++) {
					//game.addVideo('markSkill',game.players[i],['stratagem_fury']);
					game.players[i].ai.shown = 0;
				}
				game.stratagemCamouflage();
			}
			"step 6";
			if (_status.mode != "stratagem") {
				event.beginner = _status.firstAct2 || game.zhong || game.zhu || _status.firstAct || game.me;
			}
			game.gameDraw(event.beginner, function (player) {
				if (_status.mode == "purple" && player.seatNum > 5) {
					return 5;
				}
				return 4;
			});
			if (_status.connectMode && lib.configOL.change_card) {
				game.replaceHandcards(game.players.slice(0));
			}
			"step 7";
			game.phaseLoop(event.beginner);
		},
		game: {
			canReplaceViewpoint: () => true,
			getState: function () {
				var state = {};
				for (var i in lib.playerOL) {
					var player = lib.playerOL[i];
					state[i] = { identity: player.identity };
					if (player == game.zhu) {
						state[i].zhu = true;
					}
					if (player == game.zhong) {
						state[i].zhong = true;
					}
					if (player.isZhu) {
						state[i].isZhu = true;
					}
					if (player.special_identity) {
						state[i].special_identity = player.special_identity;
					}
					state[i].shown = player.ai.shown;
					//state[i].group=player.group;
				}
				return state;
			},
			updateState: function (state) {
				for (var i in state) {
					var player = lib.playerOL[i];
					if (player) {
						player.identity = state[i].identity;
						if (state[i].identity == "rZhu" || state[i].identity == "bZhu") {
							game[state[i].identity] = player;
						}
						if (state[i].special_identity) {
							player.special_identity = state[i].special_identity;
							if (player.node.dieidentity) {
								player.node.dieidentity.innerHTML = get.translation(state[i].special_identity);
								player.node.identity.firstChild.innerHTML = get.translation(state[i].special_identity + "_bg");
							}
						}
						if (state[i].zhu) {
							game.zhu = player;
						}
						if (state[i].isZhu) {
							player.isZhu = true;
						}
						if (state[i].zhong) {
							game.zhong = player;
						}
						player.ai.shown = state[i].shown;
						//player.group=state[i].group;
						//player.node.name.dataset.nature=get.groupnature(player.group);
					}
				}
			},
			getRoomInfo: function (uiintro) {
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
				var last = uiintro.add('<div class="text chat">出牌时限：' + lib.configOL.choose_timeout + "秒");
				if (lib.configOL.banned.length) {
					last = uiintro.add('<div class="text chat">禁用武将：' + get.translation(lib.configOL.banned));
				}
				if (lib.configOL.bannedcards.length) {
					last = uiintro.add('<div class="text chat">禁用卡牌：' + get.translation(lib.configOL.bannedcards));
				}
				last.style.paddingBottom = "8px";
			},
			getIdentityList: function (player) {
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
			getIdentityList2: function (list) {
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
			getVideoName: function () {
				var str = get.translation(game.me.name);
				if (game.me.name2) {
					str += "/" + get.translation(game.me.name2);
				}
				var str2;
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
				var name = [str, str2];
				return name;
			},
			addRecord: function (bool) {
				if (typeof bool == "boolean") {
					var data = lib.config.gameRecord.identity.data;
					var identity = game.me.identity;
					if (identity == "mingzhong") {
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
					var list = ["zhu", "zhong", "nei", "fan", "commoner"];
					var str = "";
					for (var i = 0; i < list.length; i++) {
						if (data[list[i]]) {
							str += lib.translate[list[i] + "2"] + "：" + data[list[i]][0] + "胜" + " " + data[list[i]][1] + "负<br>";
						}
					}
					lib.config.gameRecord.identity.str = str;
					game.saveConfig("gameRecord", lib.config.gameRecord);
				}
			},
			showIdentity: function (me) {
				for (var i = 0; i < game.players.length; i++) {
					// if(me===false&&game.players[i]==game.me) continue;
					game.players[i].node.identity.classList.remove("guessing");
					game.players[i].identityShown = true;
					game.players[i].ai.shown = 1;
					game.players[i].setIdentity(game.players[i].identity);
					if (game.players[i].special_identity) {
						game.players[i].node.identity.firstChild.innerHTML = get.translation(game.players[i].special_identity + "_bg");
					}
					if (game.players[i].identity == "zhu") {
						game.players[i].isZhu = true;
					}
				}
				if (_status.clickingidentity) {
					for (var i = 0; i < _status.clickingidentity[1].length; i++) {
						_status.clickingidentity[1][i].delete();
						_status.clickingidentity[1][i].style.transform = "";
					}
					delete _status.clickingidentity;
				}
			},
			checkResult: function () {
				var me = game.me._trueMe || game.me;
				if (_status.brawl && _status.brawl.checkResult) {
					_status.brawl.checkResult();
					return;
				} else if (_status.mode == "purple") {
					var winner = [];
					var loser = [];
					var ye = game.filterPlayer(
						function (current) {
							return ["rYe", "bYe"].includes(current.identity);
						},
						null,
						true
					);
					var red = game.filterPlayer(
						function (current) {
							return ["rZhu", "rZhong", "bNei"].includes(current.identity);
						},
						null,
						true
					);
					var blue = game.filterPlayer(
						function (current) {
							return ["bZhu", "bZhong", "rNei"].includes(current.identity);
						},
						null,
						true
					);
					game.countPlayer2(function (current) {
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
					var winner2 = winner.slice(0);
					var loser2 = loser.slice(0);
					for (var i = 0; i < winner.length; i++) {
						if (winner[i].isDead()) {
							winner.splice(i--, 1);
						}
					}
					for (var i = 0; i < loser.length; i++) {
						if (loser[i].isDead()) {
							loser.splice(i--, 1);
						}
					}
					if (winner.length > 0 || loser.length == game.players.length) {
						game.broadcastAll(
							function (winner, loser) {
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
			checkOnlineResult: function (player) {
				if (_status.winner && _status.loser) {
					if (_status.loser.length == game.players.length) {
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
					return player.identity == "zhu" || player.identity == "zhong" || player.identity == "mingzhong" || (player.identity == "commoner" && player.isAlive());
				} else if ((game.players.length == 1 + game.players.filter(i => i.identity == "commoner").length && game.players[0].identity == "nei") || game.players[0].identity == "commoner") {
					return player.isAlive();
				} else {
					return player.identity == "fan" || (player.identity == "commoner" && player.isAlive());
				}
			},
			chooseCharacterPurpleOL: function () {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					"step 1";
					var list = ["rZhu", "rZhong", "rNei", "rYe"];
					var list2 = ["bZhu", "bZhong", "bNei", "bYe"];
					list.randomSort();
					list2.randomSort();
					var identityList = list.concat(list2);
					var num = get.rand(0, 7);
					var players = game.players.slice(0);
					for (var i = 0; i < num; i++) {
						players.push(players.shift());
					}
					game.broadcastAll(
						function (players, identityList, list) {
							_status.mode = "purple";
							if (game.online) {
								ui.arena.classList.add("choose-character");
							}
							for (var i = 0; i < players.length; i++) {
								players[i].node.identity.classList.add("guessing");
								players[i].identity = identityList[i];
								players[i].setIdentity(list.includes(identityList[i]) ? "cai2" : "cai");
								if (["rZhu", "bZhu"].includes(identityList[i])) {
									game[identityList[i]] = players[i];
									players[i].setIdentity(identityList[i]);
									players[i].identityShown = true;
									players[i].node.identity.classList.remove("guessing");
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
					for (var i = 0; i < players.length; i++) {
						players[i].seatNum = i;
					}
					"step 2";
					var map = {};
					var map_zhu = {};
					event.mapNum = {};
					var list = [];
					var libCharacter = {};
					for (var i = 0; i < lib.configOL.characterPack.length; i++) {
						var pack = lib.characterPack[lib.configOL.characterPack[i]];
						for (var j in pack) {
							// if(j=='zuoci') continue;
							if (lib.character[j]) {
								libCharacter[j] = pack[j];
							}
						}
					}
					for (var i in libCharacter) {
						if (lib.filter.characterDisabled(i, libCharacter)) {
							continue;
						}
						if (i.indexOf("lingju") != -1 || get.is.double(i)) {
							continue;
						}
						var group = lib.character[i][1];
						if (lib.selectGroup.includes(group)) {
							continue;
						}
						if (!map[group]) {
							map[group] = [];
							list.push(group);
						}
						map[group].push(i);
						if (lib.character[i].isZhugong) {
							if (!map_zhu[group]) {
								map_zhu[group] = [];
							}
							map_zhu[group].push(i);
						}
					}
					for (var i in map) {
						if (map[i].length < 12) {
							delete map[i];
							list.remove(i);
						} else {
							event.mapNum[i] = map[i].length > 15 ? 5 : 3;
						}
					}
					list.sort(function (a, b) {
						return lib.group.indexOf(a) - lib.group.indexOf(b);
					});
					event.list = list;
					event.map = map;
					event.map_zhu = map_zhu;
					game.bZhu
						.chooseControl(list)
						.set("prompt", "请选择冷方武将势力")
						.set("ai", function () {
							return _status.event.choice;
						})
						.set("choice", event.list.randomGet());
					"step 3";
					event.bZhu = result.control;
					event.list.remove(event.bZhu);
					game.rZhu
						.chooseControl(event.list)
						.set("prompt", "请选择暖方武将的势力")
						.set("ai", function () {
							return _status.event.choice;
						})
						.set("choice", event.list.randomGet());
					"step 4";
					event.rZhu = result.control;
					var players = [game.rZhu, game.bZhu];
					var list = [];
					for (var i = 0; i < players.length; i++) {
						var group = event[players[i].identity];
						var str = "选择角色";
						var list2 = event.map[group].randomGets(4);
						if (event.map_zhu[group]) {
							list2.addArray(event.map_zhu[group].randomGets(2));
						}
						event.map[players[i].playerid] = list2;
						list.push([players[i], [str, [list2, "character"]], true]);
					}
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0]);
							if (!player.isInitFilter("noZhuHp")) {
								player.hp++;
								player.maxHp++;
								player.update();
							}
						}
					});
					"step 5";
					for (var i in result) {
						if (result[i] == "ai" || !result[i] || !result[i].links) {
							result[i] = event.map[i].randomGet();
						} else {
							result[i] = result[i].links;
						}
						var group = lib.character[result[i][0]][1];
						event.map[group].remove(result[i][0]);
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result[i][0]);
						}
					}
					game.broadcast(function (result) {
						for (var i in result) {
							if (!lib.playerOL[i].name) {
								lib.playerOL[i].init(result[i][0], result[i][1]);
								if (!lib.playerOL[i].isInitFilter("noZhuHp")) {
									lib.playerOL[i].hp++;
									lib.playerOL[i].maxHp++;
									lib.playerOL[i].update();
								}
							}
						}
					}, result);

					var list = [];
					var players = game.players.slice(0);
					players.removeArray([game.rZhu, game.bZhu]);
					for (var i = 0; i < players.length; i++) {
						var group = event[players[i].identity.slice(0, 1) + "Zhu"];
						var str = "选择角色";
						var list2 = event.map[group].randomRemove(event.mapNum[group]);
						event.map[players[i].playerid] = list2;
						list.push([players[i], [str, [list2, "character"]], true]);
					}
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0]);
						}
					});
					"step 6";
					for (var i in result) {
						if (result[i] == "ai" || !result[i] || !result[i].links) {
							result[i] = event.map[i].randomGet();
						} else {
							result[i] = result[i].links;
						}
						var group = lib.character[result[i][0]][1];
						event.map[group].remove(result[i][0]);
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result[i][0]);
						}
					}
					game.broadcast(function (result) {
						for (var i in result) {
							if (!lib.playerOL[i].name) {
								lib.playerOL[i].init(result[i][0], result[i][1]);
							}
						}
						setTimeout(function () {
							ui.arena.classList.remove("choose-character");
						}, 500);
					}, result);
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterPurple: function () {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					game.no_continue_game = true;
					lib.init.onfree();
					"step 1";
					var list = ["rZhu", "rZhong", "rNei", "rYe"];
					var list2 = ["bZhu", "bZhong", "bNei", "bYe"];
					list.randomSort();
					list2.randomSort();
					var identityList = list.concat(list2);
					var num = get.rand(0, 7);
					var players = game.players.slice(0);
					for (var i = 0; i < num; i++) {
						players.push(players.shift());
					}
					for (var i = 0; i < players.length; i++) {
						players[i].node.identity.classList.add("guessing");
						players[i].identity = identityList[i];
						players[i].setIdentity(list.includes(identityList[i]) ? "cai2" : "cai");
						if (["rZhu", "bZhu"].includes(identityList[i])) {
							game[identityList[i]] = players[i];
							players[i].setIdentity(identityList[i]);
							players[i].identityShown = true;
							players[i].node.identity.classList.remove("guessing");
						}
					}
					game.zhu = game.rZhu;
					game.rZhu.isZhu = true;
					game.bZhu.isZhu = true;
					game.me.setIdentity();
					game.me.node.identity.classList.remove("guessing");
					players.sortBySeat(game.zhu);
					for (var i = 0; i < players.length; i++) {
						players[i].seatNum = i;
					}
					"step 2";
					var map = {};
					var map_zhu = {};
					var list = [];
					for (var i in lib.character) {
						if (lib.filter.characterDisabled(i)) {
							continue;
						}
						if (i.indexOf("lingju") != -1 || get.is.double(i)) {
							continue;
						}
						var group = lib.character[i][1];
						if (lib.selectGroup.includes(group)) {
							continue;
						}
						if (!map[group]) {
							map[group] = [];
							list.push(group);
						}
						map[group].push(i);
						if (lib.character[i].isZhugong) {
							if (!map_zhu[group]) {
								map_zhu[group] = [];
							}
							map_zhu[group].push(i);
						}
					}
					for (var i in map) {
						if (map[i].length < 12) {
							delete map[i];
							list.remove(i);
						}
					}
					list.sort(function (a, b) {
						return lib.group.indexOf(a) - lib.group.indexOf(b);
					});
					event.list = list;
					event.map = map;
					event.map_zhu = map_zhu;
					game.bZhu
						.chooseControl(list)
						.set("prompt", "请选择冷方武将势力")
						.set("ai", function () {
							return _status.event.choice;
						})
						.set("choice", event.list.randomGet());
					"step 3";
					event.bZhu = result.control;
					event.list.remove(event.bZhu);
					game.rZhu
						.chooseControl(event.list)
						.set("prompt", "请选择暖方武将的势力")
						.set("ai", function () {
							return _status.event.choice;
						})
						.set("choice", event.list.randomGet());
					"step 4";
					event.rZhu = result.control;
					if (game.me == game.rZhu || game.me == game.bZhu) {
						event.isZhu = true;
						var list = event.map[event[game.me.identity]].randomGets(4);
						if (event.map_zhu[event[game.me.identity]]) {
							list.addArray(event.map_zhu[event[game.me.identity]].randomGets(2));
						}
						game.me.chooseButton(true, ["请选择您的武将牌", [list, "character"]]);
					}
					"step 5";
					if (event.isZhu) {
						event.map[event[game.me.identity]].remove(result.links[0]);
						game.me.init(result.links[0]);
					}
					if (!game.rZhu.name) {
						var list = event.map[event.rZhu].randomGets(3);
						if (event.map_zhu[event.rZhu]) {
							list.addArray(event.map_zhu[event.rZhu]);
						}
						var character = list.randomGet();
						event.map[event.rZhu].remove(character);
						game.rZhu.init(character);
					}
					if (!game.bZhu.name) {
						var list = event.map[event.bZhu].randomGets(4);
						if (event.map_zhu[event.bZhu]) {
							list.addArray(event.map_zhu[event.bZhu].randomGets(2));
						}
						var character = list.randomGet();
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
					"step 6";
					if (!event.isZhu) {
						game.me.init(result.links[0]);
					}
					game.countPlayer(function (current) {
						if (!current.name) {
							var group = current.identity.indexOf("r") == 0 ? event.rZhu : event.bZhu;
							current.init(event.map[group].randomRemove(1)[0]);
						}
					});
					"step 7";
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterStratagemOL: function () {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
					var identityList = get.identityList(game.players.length);
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
					for (i = 0; i < game.players.length; i++) {
						game.players[i].identity = identityList[i];
						game.players[i].setIdentity("cai");
						game.players[i].node.identity.classList.add("guessing");
						if (identityList[i] == "zhu") {
							game.zhu = game.players[i];
						}
						game.players[i].identityShown = false;
					}

					game.me.setIdentity();
					game.me.node.identity.classList.remove("guessing");

					for (var i = 0; i < game.players.length; i++) {
						game.players[i].send(
							function (zhu, zhuid, me, identity) {
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
							game.players[i],
							game.players[i].identity
						);
					}

					var list;
					var list3 = [];
					var list4 = [];
					event.list = [];
					event.list2 = [];

					var libCharacter = {};
					for (var i = 0; i < lib.configOL.characterPack.length; i++) {
						var pack = lib.characterPack[lib.configOL.characterPack[i]];
						for (var j in pack) {
							if (lib.character[j]) {
								libCharacter[j] = pack[j];
							}
						}
					}
					for (i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j])) {
								ix.splice(j--, 1);
							}
						}
						if (ix.length) {
							event.list.push(i);
							event.list2.push(i);
							list4.addArray(ix);
							list3.push(i);
						}
					}
					game.broadcast(function (list) {
						for (var i in lib.characterReplace) {
							var ix = lib.characterReplace[i];
							for (var j = 0; j < ix.length; j++) {
								if (!list.includes(ix[j])) {
									ix.splice(j--, 1);
								}
							}
						}
					}, list4);
					for (i in libCharacter) {
						if (list4.includes(i)) {
							continue;
						}
						if (lib.filter.characterDisabled(i, libCharacter)) {
							continue;
						}
						event.list.push(i);
						event.list2.push(i);
						list4.push(i);
						list3.push(i);
					}
					_status.characterlist = list4.slice(0);
					list = list3.randomGets(5);
					"step 1";
					var list = [];
					var selectButton = lib.configOL.double_character ? 2 : 1;

					var num = Math.floor(event.list.length / (game.players.length - 1));
					for (var i = 0; i < game.players.length; i++) {
						let num2 = lib.configOL["choice_" + game.players[i].identity];
						var str = "选择角色";
						list.push([game.players[i], [str, [event.list.randomRemove(Math.min(num, num2)), "characterx"]], selectButton, true]);
					}
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0], result.links[1]);
						}
					});
					"step 2";
					var shen = [];
					for (var i in result) {
						if (result[i] && result[i].links) {
							for (var j = 0; j < result[i].links.length; j++) {
								event.list2.remove(get.sourceCharacter(result[i].links[j]));
							}
						}
					}
					for (var i in result) {
						if (result[i] == "ai") {
							result[i] = event.list2.randomRemove(lib.configOL.double_character ? 2 : 1);
							for (var j = 0; j < result[i].length; j++) {
								var listx = lib.characterReplace[result[i][j]];
								if (listx && listx.length) {
									result[i][j] = listx.randomGet();
								}
							}
						} else {
							result[i] = result[i].links;
						}
						if (get.is.double(result[i][0]) || (lib.character[result[i][0]] && lib.selectGroup.includes(lib.character[result[i][0]].group) && !lib.character[result[i][0]].hasHiddenSkill)) {
							shen.push(lib.playerOL[i]);
						}
					}
					event.result2 = result;
					if (shen.length) {
						var list = ["wei", "shu", "wu", "qun", "jin", "key"];
						for (var i = 0; i < list.length; i++) {
							if (!lib.group.includes(list[i])) {
								list.splice(i--, 1);
							} else {
								list[i] = ["", "", "group_" + list[i]];
							}
						}
						for (var i = 0; i < shen.length; i++) {
							if (get.is.double(result[shen[i].playerid][0])) {
								shen[i]._groupChosen = "double";
								shen[i] = [
									shen[i],
									[
										"请选择你的势力",
										[
											get.is.double(result[shen[i].playerid][0], true).map(function (i) {
												return ["", "", "group_" + i];
											}),
											"vcard",
										],
									],
									1,
									true,
								];
							} else {
								shen[i]._groupChosen = "kami";
								shen[i] = [shen[i], ["请选择你的势力", [list, "vcard"]], 1, true];
							}
						}
						game.me
							.chooseButtonOL(shen, function (player, result) {
								if (player == game.me) {
									player.changeGroup(result.links[0][2].slice(6), false, false);
								}
							})
							.set("switchToAuto", function () {
								_status.event.result = "ai";
							})
							.set("processAI", function () {
								return {
									bool: true,
									links: [_status.event.dialog.buttons.randomGet().link],
								};
							});
					} else {
						event._result = {};
					}
					"step 3";
					if (!result) {
						result = {};
					}
					for (var i in result) {
						if (result[i] && result[i].links) {
							result[i] = result[i].links[0][2].slice(6);
						} else if (result[i] == "ai") {
							result[i] = (function () {
								return ["wei", "shu", "wu", "qun", "jin", "key"].randomGet();
							})();
						}
					}
					var result2 = event.result2;
					game.broadcast(
						function (result, result2) {
							for (var i in result) {
								if (!lib.playerOL[i].name) {
									lib.playerOL[i].init(result[i][0], result[i][1]);
								}
								if (result2[i] && result2[i].length) {
									lib.playerOL[i].changeGroup(result2[i], false, false);
								}
							}
							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						result2,
						result
					);

					for (var i in result2) {
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result2[i][0], result2[i][1]);
						}
						if (result[i] && result[i].length) {
							lib.playerOL[i].changeGroup(result[i], false, false);
						}
					}

					for (var i = 0; i < game.players.length; i++) {
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

					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacter: function () {
				if (_status.mode == "purple") {
					game.chooseCharacterPurple();
					return;
				}
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.addPlayer = function (player) {
					var list = get.identityList(game.players.length - 1);
					var list2 = get.identityList(game.players.length);
					for (var i = 0; i < list.length; i++) {
						list2.remove(list[i]);
					}
					player.identity = list2[0];
					player.setIdentity("cai");
				};
				next.removePlayer = function () {
					return game.players.randomGet(game.me, game.zhu);
				};
				next.ai = function (player, list, list2, back) {
					if (_status.brawl && _status.brawl.chooseCharacterAi) {
						if (_status.brawl.chooseCharacterAi(player, list, list2, back) !== false) {
							return;
						}
					}
					var stratagemMode = _status.event.stratagemMode;
					if (_status.event.zhongmode) {
						var listc = list.slice(0, 2);
						for (var i = 0; i < listc.length; i++) {
							var listx = lib.characterReplace[listc[i]];
							if (listx && listx.length) {
								listc[i] = listx.randomGet();
							}
						}
						if (get.config("double_character")) {
							player.init(listc[0], listc[1]);
						} else {
							player.init(listc[0]);
						}
						if (player.identity == "mingzhong") {
							if (!player.isInitFilter("noZhuHp")) {
								player.hp++;
								player.maxHp++;
								player.update();
							}
						}
					} else if (player.identity == "zhu" && !stratagemMode) {
						list2.randomSort();
						var choice, choice2;
						if (!_status.event.zhongmode && Math.random() - 0.8 < 0 && list2.length) {
							choice = list2[0];
							choice2 = list[0];
							if (choice2 == choice) {
								choice2 = list[1];
							}
						} else {
							choice = list[0];
							choice2 = list[1];
						}
						if (lib.characterReplace[choice] && lib.characterReplace[choice].length) {
							choice = lib.characterReplace[choice].randomGet();
						}
						if (lib.characterReplace[choice2] && lib.characterReplace[choice2].length) {
							choice2 = lib.characterReplace[choice2].randomGet();
						}
						if (get.config("double_character")) {
							player.init(choice, choice2);
						} else {
							player.init(choice);
						}
						if (game.players.length > 4) {
							if (!player.isInitFilter("noZhuHp")) {
								player.hp++;
								player.maxHp++;
								player.update();
							}
						}
					} else if (player.identity == "zhong" && (Math.random() < 0.5 || ["sunliang", "key_akane"].includes(game.zhu.name)) && !stratagemMode) {
						var listc = list.slice(0);
						for (var i = 0; i < listc.length; i++) {
							var listx = lib.characterReplace[listc[i]];
							if (listx && listx.length) {
								listc[i] = listx.randomGet();
							}
						}
						var choice = 0;
						for (var i = 0; i < listc.length; i++) {
							if (lib.character[listc[i]][1] == game.zhu.group) {
								choice = i;
								break;
							}
						}
						if (get.config("double_character")) {
							player.init(listc[choice], listc[choice == 0 ? choice + 1 : choice - 1]);
						} else {
							player.init(listc[choice]);
						}
					} else {
						var listc = list.slice(0, 2);
						for (var i = 0; i < listc.length; i++) {
							var listx = lib.characterReplace[listc[i]];
							if (listx && listx.length) {
								listc[i] = listx.randomGet();
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
						for (var i = 0; i < list.length; i++) {
							back.push(list[i]);
						}
					}
					if (typeof lib.config.test_game == "string" && player == game.me.next) {
						if (lib.config.test_game != "_") {
							player.init(lib.config.test_game);
						}
					}
					if (get.is.double(player.name1)) {
						player._groupChosen = "double";
						player.group = get.is.double(player.name1, true).randomGet();
						player.node.name.dataset.nature = get.groupnature(player.group);
					} else if (get.config("choose_group") && lib.selectGroup.includes(player.group) && !player.isUnseen(0)) {
						player._groupChosen = "kami";
						var list = lib.group.slice(0);
						list.remove("shen");
						if (list.length) {
							player.group = (function () {
								if (_status.mode != "zhong" && game.zhu && game.zhu.group) {
									if (["re_zhangjiao", "liubei", "re_liubei", "caocao", "re_caocao", "sunquan", "re_sunquan", "zhangjiao", "sp_zhangjiao", "caopi", "re_caopi", "liuchen", "caorui", "sunliang", "sunxiu", "sunce", "re_sunben", "ol_liushan", "re_liushan", "key_akane", "dongzhuo", "re_dongzhuo", "ol_dongzhuo", "jin_simashi", "caomao"].includes(game.zhu.name)) {
										return game.zhu.group;
									}
									if (game.zhu.name == "yl_yuanshu") {
										if (player.identity == "zhong") {
											list.remove("qun");
										} else {
											return "qun";
										}
									}
									if (["sunhao", "xin_yuanshao", "re_yuanshao", "re_sunce", "ol_yuanshao", "yuanshu", "jin_simazhao", "liubian"].includes(game.zhu.name)) {
										if (player.identity != "zhong") {
											list.remove(game.zhu.group);
										} else {
											return game.zhu.group;
										}
									}
								}
								return list.randomGet();
							})();
						}
					}
					player.node.name.dataset.nature = get.groupnature(player.group);
				};
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
					var list;
					var list2 = [];
					var list3 = [];
					var list4 = [];
					var identityList;
					var chosen = lib.config.continue_name || [];
					game.saveConfig("continue_name");
					event.chosen = chosen;
					if (_status.mode == "zhong") {
						event.zhongmode = true;
						identityList = ["zhu", "zhong", "mingzhong", "nei", "fan", "fan", "fan", "fan"];
					} else {
						if (_status.mode == "stratagem") {
							event.stratagemMode = true;
						}
						identityList = get.identityList(game.players.length);
					}
					var stratagemMode = event.stratagemMode;
					var addSetting = function (dialog) {
						dialog.add("选择身份").classList.add("add-setting");
						var table = document.createElement("div");
						table.classList.add("add-setting");
						table.style.margin = "0";
						table.style.width = "100%";
						table.style.position = "relative";
						var listi;
						if (event.zhongmode) {
							listi = ["random", "zhu", "mingzhong", "zhong", "fan", "nei"];
						} else {
							listi = ["random", "zhu", "zhong", "fan", "nei"];
							if (get.config("enable_commoner") && !event.stratagemMode) {
								listi.push("commoner");
							}
						}

						for (var i = 0; i < listi.length; i++) {
							var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.link = listi[i];
							if (td.link === game.me.identity) {
								td.classList.add("bluebg");
							}
							table.appendChild(td);
							td.innerHTML = "<span>" + get.translation(listi[i] + "2") + "</span>";
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
								if (_status.dragged) {
									return;
								}
								if (_status.justdragged) {
									return;
								}
								_status.tempNoButton = true;
								setTimeout(function () {
									_status.tempNoButton = false;
								}, 500);
								var link = this.link;
								if (game.zhu) {
									if (link != "random") {
										_status.event.parent.fixedseat = get.distance(game.me, game.zhu, "absolute");
									}
									if (game.zhu.name) {
										game.zhu.uninit();
									}
									delete game.zhu.isZhu;
									delete game.zhu.identityShown;
								}
								var current = this.parentNode.querySelector(".bluebg");
								if (current) {
									current.classList.remove("bluebg");
								}
								current = _status.cheat_seat || seats.querySelector(".bluebg");
								if (current) {
									current.classList.remove("bluebg");
								}
								if (link == "random") {
									if (event.zhongmode) {
										link = ["zhu", "zhong", "nei", "fan", "mingzhong"].randomGet();
									} else {
										var listi = ["zhu", "zhong", "nei", "fan"];
										if (get.config("enable_commoner") && !event.stratagemMode) {
											listi.push("commoner");
										}
										link = listi.randomGet();
									}
									for (var i = 0; i < this.parentNode.childElementCount; i++) {
										if (this.parentNode.childNodes[i].link == link) {
											this.parentNode.childNodes[i].classList.add("bluebg");
										}
									}
								} else {
									this.classList.add("bluebg");
								}
								num = get.config("choice_" + link);
								if (event.zhongmode) {
									num = 6;
									if (link == "zhu" || link == "nei" || link == "mingzhong") {
										num = 8;
									}
								}
								_status.event.parent.swapnodialog = function (dialog, list) {
									var buttons = ui.create.div(".buttons");
									var node = dialog.buttons[0].parentNode;
									dialog.buttons = ui.create.buttons(list, "characterx", buttons);
									dialog.content.insertBefore(buttons, node);
									buttons.addTempClass("start");
									node.remove();
									game.uncheck();
									game.check();
									if (event.stratagemMode) {
										return;
									}
									for (var i = 0; i < seats.childElementCount; i++) {
										if (get.distance(game.zhu, game.me, "absolute") === seats.childNodes[i].link) {
											seats.childNodes[i].classList.add("bluebg");
										}
									}
								};
								_status.event = _status.event.parent;
								_status.event.step = 0;
								_status.event.identity = link;
								if (!event.stratagemMode) {
									if (link != (event.zhongmode ? "mingzhong" : "zhu")) {
										seats.previousSibling.style.display = "";
										seats.style.display = "";
									} else {
										seats.previousSibling.style.display = "none";
										seats.style.display = "none";
									}
								}
								game.resume();
							});
						}
						dialog.content.appendChild(table);

						dialog.add("选择座位").classList.add("add-setting");
						var seats = document.createElement("div");
						seats.classList.add("add-setting");
						seats.style.margin = "0";
						seats.style.width = "100%";
						seats.style.position = "relative";
						for (var i = stratagemMode ? 1 : 2; i <= game.players.length; i++) {
							var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.innerHTML = get.cnNumber(i, true);
							td.link = i - 1;
							seats.appendChild(td);
							if (!stratagemMode && get.distance(game.zhu, game.me, "absolute") === i - 1) {
								td.classList.add("bluebg");
							}
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
								if (_status.dragged) {
									return;
								}
								if (_status.justdragged) {
									return;
								}
								if (_status.cheat_seat) {
									_status.cheat_seat.classList.remove("bluebg");
									if (_status.cheat_seat == this) {
										delete _status.cheat_seat;
										return;
									}
								}
								if (stratagemMode) {
									this.classList.add("bluebg");
									_status.cheat_seat = this;
								} else {
									if (get.distance(game.zhu, game.me, "absolute") == this.link) {
										return;
									}
									var current = this.parentNode.querySelector(".bluebg");
									if (current) {
										current.classList.remove("bluebg");
									}
									this.classList.add("bluebg");
									for (var i = 0; i < game.players.length; i++) {
										if (get.distance(game.players[i], game.me, "absolute") == this.link) {
											game.swapSeat(game.zhu, game.players[i], false);
											return;
										}
									}
								}
							});
						}
						dialog.content.appendChild(seats);
						if (!stratagemMode && game.me == game.zhu) {
							seats.previousSibling.style.display = "none";
							seats.style.display = "none";
						}

						dialog.add(ui.create.div(".placeholder.add-setting"));
						dialog.add(ui.create.div(".placeholder.add-setting"));
						if (get.is.phoneLayout()) {
							dialog.add(ui.create.div(".placeholder.add-setting"));
						}
					};
					var removeSetting = function () {
						var dialog = _status.event.dialog;
						if (dialog) {
							dialog.style.height = "";
							delete dialog._scrollset;
							var list = Array.from(dialog.querySelectorAll(".add-setting"));
							while (list.length) {
								list.shift().remove();
							}
							ui.update();
						}
					};
					event.addSetting = addSetting;
					event.removeSetting = removeSetting;
					event.list = [];
					identityList.randomSort();
					if (event.identity) {
						identityList.remove(event.identity);
						identityList.unshift(event.identity);
						if (event.fixedseat) {
							var zhuIdentity = _status.mode == "zhong" ? "mingzhong" : "zhu";
							if (zhuIdentity != event.identity) {
								identityList.remove(zhuIdentity);
								identityList.splice(event.fixedseat, 0, zhuIdentity);
							}
							delete event.fixedseat;
						}
						delete event.identity;
					} else if (_status.mode != "zhong" && (!_status.brawl || !_status.brawl.identityShown)) {
						var ban_identity = [];
						ban_identity.push(get.config("ban_identity") || "off");
						if (ban_identity[0] != "off") {
							ban_identity.push(get.config("ban_identity2") || "off");
							if (ban_identity[1] != "off") {
								ban_identity.push(get.config("ban_identity3") || "off");
							}
						}
						ban_identity.remove("off");
						if (ban_identity.length) {
							var identityList2 = identityList.slice(0);
							for (var i = 0; i < ban_identity.length; i++) {
								while (identityList2.includes(ban_identity[i])) {
									identityList2.remove(ban_identity[i]);
								}
							}
							ban_identity = identityList2.randomGet();
							identityList.remove(ban_identity);
							identityList.splice(game.players.indexOf(game.me), 0, ban_identity);
						}
					}
					for (i = 0; i < game.players.length; i++) {
						if (_status.brawl && _status.brawl.identityShown) {
							if (game.players[i].identity == "zhu") {
								game.zhu = game.players[i];
							}
							if (!stratagemMode) {
								game.players[i].identityShown = true;
							}
						} else {
							game.players[i].node.identity.classList.add("guessing");
							game.players[i].identity = identityList[i];
							game.players[i].setIdentity("cai");
							if (event.zhongmode) {
								if (identityList[i] == "mingzhong") {
									game.zhu = game.players[i];
								} else if (identityList[i] == "zhu") {
									game.zhu2 = game.players[i];
								}
							} else {
								if (identityList[i] == "zhu") {
									game.zhu = game.players[i];
								}
							}
							game.players[i].identityShown = false;
						}
					}

					if (get.config("special_identity") && !event.zhongmode && !event.stratagemMode && game.players.length == 8) {
						for (var i = 0; i < game.players.length; i++) {
							delete game.players[i].special_identity;
						}
						event.special_identity = [];
						var zhongs = game.filterPlayer(function (current) {
							return current.identity == "zhong";
						});
						var fans = game.filterPlayer(function (current) {
							return current.identity == "fan";
						});
						if (fans.length >= 1) {
							fans.randomRemove().special_identity = "identity_zeishou";
							event.special_identity.push("identity_zeishou");
						}
						if (zhongs.length > 1) {
							zhongs.randomRemove().special_identity = "identity_dajiang";
							zhongs.randomRemove().special_identity = "identity_junshi";
							event.special_identity.push("identity_dajiang");
							event.special_identity.push("identity_junshi");
						} else if (zhongs.length == 1) {
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
							game.zhu.isZhu = game.zhu.identity == "zhu";
							game.zhu.identityShown = true;
							game.zhu.node.identity.classList.remove("guessing");
						}
						game.me.setIdentity();
						game.me.node.identity.classList.remove("guessing");
					}
					//选将框分配
					for (i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (chosen.includes(ix[j]) || lib.filter.characterDisabled(ix[j])) {
								ix.splice(j--, 1);
							}
						}
						if (ix.length) {
							event.list.push(i);
							list4.addArray(ix);
							if (stratagemMode) {
								list3.push(i);
							} else {
								var bool = false;
								for (var j of ix) {
									if (lib.character[j].isZhugong) {
										bool = true;
										break;
									}
								}
								(bool ? list2 : list3).push(i);
							}
						}
					}
					for (i in lib.character) {
						if (list4.includes(i)) {
							continue;
						}
						if (chosen.includes(i)) {
							continue;
						}
						if (lib.filter.characterDisabled(i)) {
							continue;
						}
						event.list.push(i);
						list4.push(i);
						if (!stratagemMode && lib.character[i].isZhugong) {
							list2.push(i);
						} else {
							list3.push(i);
						}
					}
					var getZhuList = function () {
						if (stratagemMode) {
							list2.sort(lib.sort.character);
							return list2;
						}
						var limit_zhu = get.config("limit_zhu");
						if (!limit_zhu || limit_zhu == "off") {
							return list2.slice(0).sort(lib.sort.character);
						}
						if (limit_zhu != "group") {
							var num = parseInt(limit_zhu) || 6;
							return list2.randomGets(num).sort(lib.sort.character);
						}
						var getGroup = function (name) {
							var characterReplace = lib.characterReplace[name];
							if (characterReplace && characterReplace[0] && lib.character[characterReplace[0]]) {
								return lib.character[characterReplace[0]][1];
							}
							return lib.character[name][1];
						};
						var list2x = list2.slice(0);
						list2x.randomSort();
						for (var i = 0; i < list2x.length; i++) {
							for (var j = i + 1; j < list2x.length; j++) {
								if (getGroup(list2x[i]) == getGroup(list2x[j])) {
									list2x.splice(j--, 1);
								}
							}
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
					var num = get.config("choice_" + game.me.identity);
					if (event.zhongmode) {
						num = 6;
						if (game.me.identity == "zhu" || game.me.identity == "nei" || game.me.identity == "mingzhong") {
							num = 8;
						}
					}
					if (stratagemMode) {
						list = event.list.slice(0, num);
					} else if (game.zhu != game.me) {
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
					var dialog;
					if (event.swapnodialog) {
						dialog = ui.dialog;
						event.swapnodialog(dialog, list);
						delete event.swapnodialog;
					} else {
						var str = "选择角色";
						if (_status.brawl && _status.brawl.chooseCharacterStr) {
							str = _status.brawl.chooseCharacterStr;
						}
						dialog = ui.create.dialog(str, "hidden", [list, "characterx"]);
						if (!_status.brawl || !_status.brawl.noAddSetting) {
							if (get.config("change_identity")) {
								addSetting(dialog);
							}
						}
					}
					if (game.me.special_identity) {
						dialog.setCaption("选择角色（" + get.translation(game.me.special_identity) + "）");
						game.me.node.identity.firstChild.innerHTML = get.translation(game.me.special_identity + "_bg");
					} else {
						dialog.setCaption("选择角色");
						game.me.setIdentity();
					}
					if (!event.chosen.length) {
						game.me.chooseButton(dialog, true).set("onfree", true).selectButton = function () {
							if (_status.brawl && _status.brawl.doubleCharacter) {
								return 2;
							}
							return get.config("double_character") ? 2 : 1;
						};
					} else {
						lib.init.onfree();
					}
					ui.create.cheat = function () {
						_status.createControl = ui.cheat2;
						ui.cheat = ui.create.control("更换", function () {
							if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
								return;
							}
							if (game.changeCoin) {
								game.changeCoin(-3);
							}
							if (game.zhu != game.me) {
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
							var buttons = ui.create.div(".buttons");
							var node = _status.event.dialog.buttons[0].parentNode;
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
						lib.onfree.push(function () {
							event.dialogxx = ui.create.characterDialog("heightset");
							if (ui.cheat2) {
								ui.cheat2.addTempClass("controlpressdownx", 500);
								ui.cheat2.classList.remove("disabled");
							}
						});
					} else {
						event.dialogxx = ui.create.characterDialog("heightset");
					}

					ui.create.cheat2 = function () {
						ui.cheat2 = ui.create.control("自由选将", function () {
							if (this.dialog == _status.event.dialog) {
								if (game.changeCoin) {
									game.changeCoin(10);
								}
								this.dialog.close();
								_status.event.dialog = this.backup;
								this.backup.open();
								delete this.backup;
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
								this.backup = _status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog = _status.event.parent.dialogxx;
								this.dialog = _status.event.dialog;
								this.dialog.open();
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
					"step 1";
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
						if (event.modchosen[0] == "random") {
							event.modchosen[0] = result.buttons[0].link;
						} else {
							event.modchosen[1] = result.buttons[0].link;
						}
						event.choosed = event.modchosen;
					} else if (result.buttons.length == 2) {
						event.choosed = [result.buttons[0].link, result.buttons[1].link];
						game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
					} else {
						event.choosed = [result.buttons[0].link];
						game.addRecentCharacter(result.buttons[0].link);
					}
					var name = event.choosed[0];
					if (get.is.double(name)) {
						game.me._groupChosen = "double";
						game.me.chooseControl(get.is.double(name, true)).set("prompt", "请选择你的势力");
					} else if (lib.selectGroup.includes(lib.character[name].group) && !lib.character[name].hasHiddenSkill && get.config("choose_group")) {
						game.me._groupChosen = "kami";
						var list = lib.group.slice(0);
						list.remove("shen");
						game.me.chooseControl(list).set("prompt", "请选择你的势力");
					}
					"step 2";
					event.group = result.control || false;
					if (event.choosed.length == 2) {
						game.me.init(event.choosed[0], event.choosed[1]);
					} else {
						game.me.init(event.choosed[0]);
					}
					event.list.remove(get.sourceCharacter(game.me.name1));
					event.list.remove(get.sourceCharacter(game.me.name2));
					if (!event.stratagemMode && game.me == game.zhu && game.players.length > 4) {
						if (!game.me.isInitFilter("noZhuHp")) {
							game.me.hp++;
							game.me.maxHp++;
							game.me.update();
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if ((event.stratagemMode || game.players[i] != game.zhu) && game.players[i] != game.me) {
							event.list.randomSort();
							event.ai(game.players[i], event.list.splice(0, get.config("choice_" + game.players[i].identity)), null, event.list);
						}
					}
					"step 3";
					if (event.group) {
						game.me.group = event.group;
						game.me.node.name.dataset.nature = get.groupnature(game.me.group);
						game.me.update();
					}
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name);
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					"step 4";
					if (event.stratagemMode) {
						["stratagem_gain", "stratagem_insight", "stratagem_expose"].forEach(globalSkill => game.addGlobalSkill(globalSkill));
						game.players.forEach(i => {
							i.storage.zhibi = [];
							i.storage.stratagem_expose = [];
							i.markSkill("stratagem_fury");
						});
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);

					if (event.special_identity) {
						for (var i = 0; i < event.special_identity.length; i++) {
							game.zhu.addSkill(event.special_identity[i]);
						}
					}
				});
			},
			chooseCharacterOL: function () {
				if (_status.mode == "purple") {
					game.chooseCharacterPurpleOL();
					return;
				} else if (_status.mode == "stratagem") {
					game.chooseCharacterStratagemOL();
					return;
				}
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
					var identityList;
					if (_status.mode == "zhong") {
						event.zhongmode = true;
						identityList = ["zhu", "zhong", "mingzhong", "nei", "fan", "fan", "fan", "fan"];
					} else {
						identityList = get.identityList(game.players.length);
					}
					identityList.randomSort();
					for (i = 0; i < game.players.length; i++) {
						game.players[i].identity = identityList[i];
						game.players[i].setIdentity("cai");
						game.players[i].node.identity.classList.add("guessing");
						if (event.zhongmode) {
							if (identityList[i] == "mingzhong") {
								game.zhu = game.players[i];
							} else if (identityList[i] == "zhu") {
								game.zhu2 = game.players[i];
							}
						} else {
							if (identityList[i] == "zhu") {
								game.zhu = game.players[i];
							}
						}
						game.players[i].identityShown = false;
					}
					if (lib.configOL.special_identity && !event.zhongmode && game.players.length == 8) {
						var map = {};
						var zhongs = game.filterPlayer(function (current) {
							return current.identity == "zhong";
						});
						var fans = game.filterPlayer(function (current) {
							return current.identity == "fan";
						});
						if (fans.length >= 1) {
							map.identity_zeishou = fans.randomRemove();
						}
						if (zhongs.length > 1) {
							map.identity_dajiang = zhongs.randomRemove();
							map.identity_junshi = zhongs.randomRemove();
						} else if (zhongs.length == 1) {
							if (Math.random() < 0.5) {
								map.identity_dajiang = zhongs.randomRemove();
							} else {
								map.identity_junshi = zhongs.randomRemove();
							}
						}
						game.broadcastAll(
							function (zhu, map) {
								for (var i in map) {
									map[i].special_identity = i;
								}
							},
							game.zhu,
							map
						);
						event.special_identity = map;
					}

					game.zhu.setIdentity();
					game.zhu.identityShown = true;
					game.zhu.isZhu = game.zhu.identity == "zhu";
					game.zhu.node.identity.classList.remove("guessing");
					game.me.setIdentity();
					game.me.node.identity.classList.remove("guessing");
					if (game.me.special_identity) {
						game.me.node.identity.firstChild.innerHTML = get.translation(game.me.special_identity + "_bg");
					}

					for (var i = 0; i < game.players.length; i++) {
						game.players[i].send(
							function (zhu, zhuid, me, identity) {
								for (var i in lib.playerOL) {
									lib.playerOL[i].setIdentity("cai");
									lib.playerOL[i].node.identity.classList.add("guessing");
								}
								zhu.identityShown = true;
								zhu.identity = zhuid;
								if (zhuid == "zhu") {
									zhu.isZhu = true;
								}
								zhu.setIdentity();
								zhu.node.identity.classList.remove("guessing");
								me.setIdentity(identity);
								me.node.identity.classList.remove("guessing");
								if (me.special_identity) {
									me.node.identity.firstChild.innerHTML = get.translation(me.special_identity + "_bg");
								}
								ui.arena.classList.add("choose-character");
							},
							game.zhu,
							game.zhu.identity,
							game.players[i],
							game.players[i].identity
						);
					}

					var list;
					var list2 = [];
					var list3 = [];
					var list4 = [];
					event.list = [];
					event.list2 = [];

					var libCharacter = {};
					for (var i = 0; i < lib.configOL.characterPack.length; i++) {
						var pack = lib.characterPack[lib.configOL.characterPack[i]];
						for (var j in pack) {
							// if(j=='zuoci') continue;
							if (lib.character[j]) {
								libCharacter[j] = lib.character[j];
							}
						}
					}
					for (i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j])) {
								ix.splice(j--, 1);
							}
						}
						if (ix.length) {
							event.list.push(i);
							event.list2.push(i);
							list4.addArray(ix);
							var bool = false;
							for (var j of ix) {
								if (libCharacter[j].isZhugong) {
									bool = true;
									break;
								}
							}
							(bool ? list2 : list3).push(i);
						}
					}
					game.broadcast(function (list) {
						for (var i in lib.characterReplace) {
							var ix = lib.characterReplace[i];
							for (var j = 0; j < ix.length; j++) {
								if (!list.includes(ix[j])) {
									ix.splice(j--, 1);
								}
							}
						}
					}, list4);
					for (i in libCharacter) {
						if (list4.includes(i)) {
							continue;
						}
						if (lib.filter.characterDisabled(i, libCharacter)) {
							continue;
						}
						event.list.push(i);
						event.list2.push(i);
						list4.push(i);
						if (libCharacter[i].isZhugong) {
							list2.push(i);
						} else {
							list3.push(i);
						}
					}
					_status.characterlist = list4.slice(0);
					if (event.zhongmode) {
						list = event.list.randomGets(8);
					} else {
						var getZhuList = function (list2) {
							var limit_zhu = lib.configOL.limit_zhu;
							if (!limit_zhu || limit_zhu == "off") {
								return list2.slice(0).sort(lib.sort.character);
							}
							if (limit_zhu != "group") {
								var num = parseInt(limit_zhu) || 6;
								return list2.randomGets(num).sort(lib.sort.character);
							}
							var getGroup = function (name) {
								if (lib.characterReplace[name]) {
									return lib.character[lib.characterReplace[name][0]][1];
								}
								return lib.character[name][1];
							};
							var list2x = list2.slice(0);
							list2x.randomSort();
							for (var i = 0; i < list2x.length; i++) {
								for (var j = i + 1; j < list2x.length; j++) {
									if (getGroup(list2x[i]) == getGroup(list2x[j])) {
										list2x.splice(j--, 1);
									}
								}
							}
							list2x.sort(lib.sort.character);
							return list2x;
						};
						list = getZhuList(list2).concat(list3.randomGets(lib.configOL.choice_zhu));
					}
					var next = game.zhu.chooseButton(true);
					next.set("selectButton", lib.configOL.double_character ? 2 : 1);
					next.set("createDialog", ["选择角色", [list, "characterx"]]);
					next.set("ai", function (button) {
						return Math.random();
					});
					"step 1";
					if (!game.zhu.name) {
						game.zhu.init(result.links[0], result.links[1]);
					}
					event.list.remove(get.sourceCharacter(game.zhu.name1));
					event.list.remove(get.sourceCharacter(game.zhu.name2));
					event.list2.remove(get.sourceCharacter(game.zhu.name1));
					event.list2.remove(get.sourceCharacter(game.zhu.name2));

					if (game.players.length > 4) {
						if (!game.zhu.isInitFilter("noZhuHp")) {
							game.zhu.maxHp++;
							game.zhu.hp++;
							game.zhu.update();
						}
					}
					game.broadcast(
						function (zhu, name, name2, addMaxHp) {
							if (!zhu.name) {
								zhu.init(name, name2);
							}
							if (addMaxHp) {
								if (!zhu.isInitFilter("noZhuHp")) {
									zhu.maxHp++;
									zhu.hp++;
									zhu.update();
								}
							}
						},
						game.zhu,
						result.links[0],
						result.links[1],
						game.players.length > 4
					);

					if (lib.selectGroup.includes(game.zhu.group) && !game.zhu.isUnseen(0)) {
						game.zhu._groupChosen = "kami";
						var list = ["wei", "shu", "wu", "qun", "jin", "key"];
						for (var i = 0; i < list.length; i++) {
							if (!lib.group.includes(list[i])) {
								list.splice(i--, 1);
							} else {
								list[i] = ["", "", "group_" + list[i]];
							}
						}
						game.zhu.chooseButton(["请选择你的势力", [list, "vcard"]], true).set("ai", function () {
							return Math.random();
						});
					} else if (get.is.double(game.zhu.name1)) {
						game.zhu._groupChosen = "double";
						var list = get.is.double(game.zhu.name1, true);
						for (var i = 0; i < list.length; i++) {
							if (!lib.group.includes(list[i])) {
								list.splice(i--, 1);
							} else {
								list[i] = ["", "", "group_" + list[i]];
							}
						}
						game.zhu.chooseButton(["请选择你的势力", [list, "vcard"]], true).set("ai", function () {
							return Math.random();
						});
					} else {
						event.goto(3);
					}
					"step 2";
					var name = result.links[0][2].slice(6);
					game.zhu.changeGroup(name);
					"step 3";
					var list = [];
					var selectButton = lib.configOL.double_character ? 2 : 1;

					var num = Math.floor(event.list.length / (game.players.length - 1));
					for (let i = 0; i < game.players.length; i++) {
						if (game.players[i] != game.zhu) {
							const identity = game.players[i].identity;
							let num2;
							if (event.zhongmode) {
								if (identity == "nei" || identity == "zhu") {
									num2 = 8;
								} else {
									num2 = 6;
								}
							} else {
								num2 = lib.configOL["choice_" + identity];
							}
							let str = "选择角色";
							if (game.players[i].special_identity) {
								str += "（" + get.translation(game.players[i].special_identity) + "）";
							}
							list.push([game.players[i], [str, [event.list.randomRemove(Math.min(num, num2)), "characterx"]], selectButton, true]);
						}
					}
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0], result.links[1]);
						}
					});
					"step 4";
					var shen = [];
					for (var i in result) {
						if (result[i] && result[i].links) {
							for (var j = 0; j < result[i].links.length; j++) {
								event.list2.remove(get.sourceCharacter(result[i].links[j]));
							}
						}
					}
					for (var i in result) {
						if (result[i] == "ai") {
							result[i] = event.list2.randomRemove(lib.configOL.double_character ? 2 : 1);
							for (var j = 0; j < result[i].length; j++) {
								var listx = lib.characterReplace[result[i][j]];
								if (listx && listx.length) {
									result[i][j] = listx.randomGet();
								}
							}
						} else {
							result[i] = result[i].links;
						}
						if (get.is.double(result[i][0]) || (lib.character[result[i][0]] && lib.selectGroup.includes(lib.character[result[i][0]].group) && !lib.character[result[i][0]].hasHiddenSkill)) {
							shen.push(lib.playerOL[i]);
						}
					}
					event.result2 = result;
					if (shen.length) {
						var list = ["wei", "shu", "wu", "qun", "jin", "key"];
						for (var i = 0; i < list.length; i++) {
							if (!lib.group.includes(list[i])) {
								list.splice(i--, 1);
							} else {
								list[i] = ["", "", "group_" + list[i]];
							}
						}
						for (var i = 0; i < shen.length; i++) {
							if (get.is.double(result[shen[i].playerid][0])) {
								shen[i]._groupChosen = "double";
								shen[i] = [
									shen[i],
									[
										"请选择你的势力",
										[
											get.is.double(result[shen[i].playerid][0], true).map(function (i) {
												return ["", "", "group_" + i];
											}),
											"vcard",
										],
									],
									1,
									true,
								];
							} else {
								shen[i]._groupChosen = "kami";
								shen[i] = [shen[i], ["请选择你的势力", [list, "vcard"]], 1, true];
							}
						}
						game.me
							.chooseButtonOL(shen, function (player, result) {
								if (player == game.me) {
									player.changeGroup(result.links[0][2].slice(6), false, false);
								}
							})
							.set("switchToAuto", function () {
								_status.event.result = "ai";
							})
							.set("processAI", function () {
								return {
									bool: true,
									links: [_status.event.dialog.buttons.randomGet().link],
								};
							});
					} else {
						event._result = {};
					}
					"step 5";
					if (!result) {
						result = {};
					}
					for (var i in result) {
						if (result[i] && result[i].links) {
							result[i] = result[i].links[0][2].slice(6);
						} else if (result[i] == "ai") {
							result[i] = (function () {
								var player = lib.playerOL[i];
								var list = ["wei", "shu", "wu", "qun", "jin", "key"];
								for (var ix = 0; ix < list.length; ix++) {
									if (!lib.group.includes(list[ix])) {
										list.splice(ix--, 1);
									}
								}
								if (_status.mode != "zhong" && game.zhu && game.zhu.group) {
									if (["re_zhangjiao", "liubei", "re_liubei", "caocao", "re_caocao", "sunquan", "re_sunquan", "zhangjiao", "sp_zhangjiao", "caopi", "re_caopi", "liuchen", "caorui", "sunliang", "sunxiu", "sunce", "re_sunben", "ol_liushan", "re_liushan", "key_akane", "dongzhuo", "re_dongzhuo", "ol_dongzhuo", "jin_simashi", "caomao"].includes(game.zhu.name)) {
										return game.zhu.group;
									}
									if (game.zhu.name == "yl_yuanshu") {
										if (player.identity == "zhong") {
											list.remove("qun");
										} else {
											return "qun";
										}
									}
									if (["sunhao", "xin_yuanshao", "re_yuanshao", "re_sunce", "ol_yuanshao", "yuanshu", "jin_simazhao", "liubian"].includes(game.zhu.name)) {
										if (player.identity != "zhong") {
											list.remove(game.zhu.group);
										} else {
											return game.zhu.group;
										}
									}
								}
								return list.randomGet();
							})();
						}
					}
					var result2 = event.result2;
					game.broadcast(
						function (result, result2) {
							for (var i in result) {
								if (!lib.playerOL[i].name) {
									lib.playerOL[i].init(result[i][0], result[i][1]);
								}
								if (result2[i] && result2[i].length) {
									lib.playerOL[i].changeGroup(result2[i], false, false);
								}
							}
							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						result2,
						result
					);

					for (var i in result2) {
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result2[i][0], result2[i][1]);
						}
						if (result[i] && result[i].length) {
							lib.playerOL[i].changeGroup(result[i], false, false);
						}
					}

					if (event.special_identity) {
						for (var i in event.special_identity) {
							game.zhu.addSkill(i);
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name);
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			stratagemCamouflage: function () {
				var next = game.createEvent("stratagemCamouflage");
				next.players = game.players.slice();
				if (_status.connectMode) {
					next.setContent("stratagemCamouflageOL");
				} else {
					next.setContent("stratagemCamouflage");
				}
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
				insightInto: function (target) {
					var next = game.createEvent("stratagemInsight");
					next.player = this;
					next.target = target;
					next.setContent("stratagemInsight");
					return next;
				},
				addExpose: function (num) {
					if (!game.zhu || !game.zhu.isZhu || !game.zhu.identityShown) {
						return;
					}
					if (typeof this.ai.shown == "number" && !this.identityShown && this.ai.shown < 1) {
						this.ai.shown += num;
						if (this.ai.shown > 0.95) {
							this.ai.shown = 0.95;
						}
					}
					return this;
				},
				yexinbilu: function () {
					game.broadcastAll(function (player) {
						player.showIdentity();
					}, this);
					this.gainMaxHp();
					this.recover();
				},
				$dieAfter: function () {
					if (_status.video) {
						return;
					}
					if (!this.node.dieidentity) {
						var str;
						if (this.special_identity) {
							str = get.translation(this.special_identity);
						} else {
							str = get.translation(this.identity + "2");
						}
						var node = ui.create.div(".damage.dieidentity", str, this);
						if (str == "野心家") {
							node.style.fontSize = "40px";
						}
						ui.refresh(node);
						node.style.opacity = 1;
						this.node.dieidentity = node;
					}
					var trans = this.style.transform;
					if (trans) {
						if (trans.indexOf("rotateY") != -1) {
							this.node.dieidentity.style.transform = "rotateY(180deg)";
						} else if (trans.indexOf("rotateX") != -1) {
							this.node.dieidentity.style.transform = "rotateX(180deg)";
						} else {
							this.node.dieidentity.style.transform = "";
						}
					} else {
						this.node.dieidentity.style.transform = "";
					}
				},
				dieAfter2: function (source) {
					if (_status.mode == "stratagem") {
						return;
					}
					if (_status.mode == "purple") {
						if (source) {
							if (this.identity == "rZhu" || this.identity == "bZhu") {
								if (this.identity.slice(0, 1) != source.identity.slice(0, 1)) {
									source.recover();
								}
							} else if (this.identity == "rZhong" || this.identity == "bZhong") {
								if (this.identity.slice(0, 1) != source.identity.slice(0, 1)) {
									source.draw(2);
								} else if (source.identity.indexOf("Zhu") == 1) {
									source.discard(source.getCards("h"));
								}
							} else if (this.identity == "rNei" || this.identity == "bNei") {
								if (this.identity.slice(0, 1) == source.identity.slice(0, 1)) {
									source.draw(3);
								}
							}
						}
						if (!_status.yeconfirm) {
							_status.yeconfirm = true;
							game.addGlobalSkill("yexinbilu");
							game.broadcastAll(function () {
								if (game.me.identity == "rYe" || game.me.identity == "bYe") {
									var player = game.findPlayer(function (current) {
										return current != game.me && (current.identity == "bYe" || current.identity == "rYe");
									});
									if (player) {
										player.showIdentity();
									}
								}
							});
						}
					}
					if (this.identity == "fan" && source) {
						source.draw(3);
					} else if (this.identity == "commoner" && source) {
						source.draw(2);
					} else if (this.identity == "mingzhong" && source) {
						if (source.identity == "zhu") {
							source.discard(source.getCards("he"));
						} else {
							source.draw(3);
						}
					} else if (this.identity == "zhong" && source && source.identity == "zhu" && source.isZhu) {
						source.discard(source.getCards("he"));
					}
				},
				dieAfter: function (source) {
					if (!this.identityShown) {
						game.broadcastAll(
							function (player, identity, identity2) {
								player.setIdentity(player.identity);
								player.identityShown = true;
								player.node.identity.classList.remove("guessing");
								if (identity) {
									player.node.identity.firstChild.innerHTML = get.translation(identity + "_bg");
									game.log(player, "的身份是", "#g" + get.translation(identity));
								} else {
									game.log(player, "的身份是", "#g" + get.translation(identity2 + "2"));
								}
							},
							this,
							this.special_identity,
							this.identity
						);
					}
					if (this.special_identity) {
						game.broadcastAll(
							function (zhu, identity) {
								zhu.removeSkill(identity);
							},
							game.zhu,
							this.special_identity
						);
					}
					game.checkResult();
					if (_status.mode == "purple") {
						var red = [];
						var blue = [];
						game.countPlayer(function (current) {
							var identity = current.identity.slice(1);
							if (identity != "Zhu") {
								if (current.identity.indexOf("r") == 0) {
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
					if (game.zhu && game.zhu.isZhu) {
						if ((get.population("zhong") + get.population("nei") == 0 || get.population("zhong") + get.population("fan") == 0) && get.population("commoner") == 0) {
							game.broadcastAll(function () {
								if (game.showIdentity) {
									game.showIdentity();
								}
								if (game.zhu && game.zhu.isAlive() && get.population("nei") == 1 && get.config("nei_fullscreenpop")) {
									game.me.$fullscreenpop('<span style="font-family:xinwei"><span data-nature="fire">主公</span><span data-nature="soil"> vs </span><span data-nature="thunder">内奸</span></span>', null, null, false);
								}
							});
						}
					}
					if (game.zhu && game.zhu.storage.enhance_zhu && !game.zhu.storage.enhance_zhu.startsWith("sixiang_") && get.population("fan") < 3) {
						game.zhu.removeSkill(game.zhu.storage.enhance_zhu);
						delete game.zhu.storage.enhance_zhu;
					}
					if (this == game.zhong) {
						game.broadcastAll(function (player) {
							game.zhu = player;
							game.zhu.identityShown = true;
							game.zhu.ai.shown = 1;
							game.zhu.setIdentity();
							game.zhu.isZhu = true;
							var skills = player.getStockSkills(true, true).filter(skill => {
								if (player.hasSkill(skill)) {
									return false;
								}
								var info = get.info(skill);
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
							if (_status.clickingidentity && _status.clickingidentity[0] == game.zhu) {
								for (var i = 0; i < _status.clickingidentity[1].length; i++) {
									_status.clickingidentity[1][i].delete();
									_status.clickingidentity[1][i].style.transform = "";
								}
								delete _status.clickingidentity;
							}
						}, game.zhu);
						game.delay(2);
						game.zhu.playerfocus(1000);
					}

					if (!_status.over) {
						var giveup;
						if (get.population("fan") + get.population("nei") == 1) {
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].identity == "fan" || game.players[i].identity == "nei") {
									giveup = game.players[i];
									break;
								}
							}
						} else if (get.population("zhong") + get.population("mingzhong") + get.population("nei") == 0) {
							giveup = game.zhu;
						}
						if (giveup) {
							giveup.showGiveup();
						}
					}
				},
				logAi: function (targets, card) {
					if (this.ai.shown == 1 || this.isMad()) {
						return;
					}
					var stratagemMode = get.mode() == "identity" && _status.mode == "stratagem";
					if (stratagemMode && (!game.zhu || !game.zhu.isZhu || !game.zhu.identityShown)) {
						return;
					}
					if (typeof targets == "number") {
						this.ai.shown += targets;
					} else {
						var effect = 0,
							c,
							shown;
						var info = get.info(card);
						if (info.ai && info.ai.expose) {
							if (_status.event.name == "_wuxie" && card.name == "wuxie") {
								const infomap = _status.event._info_map;
								if (infomap) {
									if (this != infomap.target && infomap.player && infomap.player.ai.shown) {
										this.ai.shown += 0.2;
									}
								}
							} else {
								this.ai.shown += info.ai.expose;
							}
						}
						if (targets.length > 0) {
							for (var i = 0; i < targets.length; i++) {
								shown = Math.abs(targets[i].ai.shown);
								if (shown < 0.2 || targets[i].identity == "nei") {
									c = 0;
								} else if (shown < 0.4) {
									c = 0.5;
								} else if (shown < 0.6) {
									c = 0.8;
								} else {
									c = 1;
								}
								var eff = get.effect(targets[i], card, this);
								effect += eff * c;
								if (eff == 0 && shown == 0 && ["zhong", "rZhong", "bZhong"].includes(this.identity) && targets[i] != this) {
									effect += 0.1;
								}
							}
						}
						if (effect > 0) {
							if (effect < 1) {
								c = 0.5;
							} else {
								c = 1;
							}
							if (targets.length != 1 || targets[0] != this) {
								if (targets.length == 1) {
									this.ai.shown += 0.2 * c;
								} else {
									this.ai.shown += 0.1 * c;
								}
							}
						} else if (effect < 0 && this == game.me && ["nei", "commoner", "rYe", "bYe"].includes(game.me.identity)) {
							if (targets.length != 1 || targets[0] != this) {
								if (targets.length == 1) {
									this.ai.shown -= 0.2;
								} else {
									this.ai.shown -= 0.1;
								}
							}
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

					var marknow = !_status.connectMode && this != game.me && get.config("auto_mark_identity") && this.ai.identity_mark != "finished";
					// if(true){
					if (marknow && _status.clickingidentity && _status.clickingidentity[0] == this) {
						for (var i = 0; i < _status.clickingidentity[1].length; i++) {
							_status.clickingidentity[1][i].delete();
							_status.clickingidentity[1][i].style.transform = "";
						}
						delete _status.clickingidentity;
					}
					if (!Array.isArray(targets)) {
						targets = [];
					}
					var effect = 0,
						c,
						shown;
					var zhu = game.zhu;
					if (_status.mode == "zhong" && !game.zhu.isZhu) {
						zhu = game.zhong;
					}
					if (targets.length == 1 && targets[0] == this) {
						effect = 0;
					} else if (this.identity != "nei" && this.identity != "commoner") {
						if (this.ai.shown > 0) {
							if (this.identity == "fan") {
								effect = -1;
							} else {
								effect = 1;
							}
						}
					} else if (targets.length > 0) {
						for (var i = 0; i < targets.length; i++) {
							shown = Math.abs(targets[i].ai.shown);
							if (shown < 0.2 || targets[i].identity == "nei") {
								c = 0;
							} else if (shown < 0.4) {
								c = 0.5;
							} else if (shown < 0.6) {
								c = 0.8;
							} else {
								c = 1;
							}
							effect += get.effect(targets[i], card, this, zhu) * c;
						}
					}
					if (this.identity == "nei" || this.identity == "commoner") {
						if (effect > 0) {
							if (this.ai.identity_mark == "fan") {
								if (marknow) {
									this.setIdentity();
								}
								this.ai.identity_mark = "finished";
							} else {
								if (marknow) {
									this.setIdentity("zhong");
								}
								this.ai.identity_mark = "zhong";
							}
						} else if (effect < 0 && get.population("fan") > 0) {
							if (this.ai.identity_mark == "zhong") {
								if (marknow) {
									this.setIdentity();
								}
								this.ai.identity_mark = "finished";
							} else {
								if (marknow) {
									this.setIdentity("fan");
								}
								this.ai.identity_mark = "fan";
							}
						}
					} else if (marknow) {
						if (effect > 0 && this.identity != "fan") {
							this.setIdentity("zhong");
							this.ai.identity_mark = "finished";
						} else if (effect < 0 && this.identity == "fan") {
							this.setIdentity("fan");
							this.ai.identity_mark = "finished";
						}
					}
					// }
				},
				showIdentity: function () {
					this.node.identity.classList.remove("guessing");
					this.identityShown = true;
					this.ai.shown = 1;
					this.setIdentity();
					if (this.special_identity) {
						this.node.identity.firstChild.innerHTML = get.translation(this.special_identity + "_bg");
					}
					if (this.identity == "zhu") {
						this.isZhu = true;
					} else {
						delete this.isZhu;
					}
					if (_status.clickingidentity) {
						for (var i = 0; i < _status.clickingidentity[1].length; i++) {
							_status.clickingidentity[1][i].delete();
							_status.clickingidentity[1][i].style.transform = "";
						}
						delete _status.clickingidentity;
					}
				},
			},
			content: {
				stratagemInsight: () => {
					"step 0";
					game.log(player, "洞察了", target, "与其的阵营关系");
					"step 1";
					var storage = player.storage;
					if (!storage.zhibi) {
						storage.zhibi = [];
					}
					var zhibi = storage.zhibi;
					if (!zhibi.includes(target)) {
						zhibi.push(target);
					}
					var insightResult = (event.insightResult = get.insightResult(player, target));
					event.videoId = lib.status.videoId++;
					var send = (clientTarget, clientInsightResult, id) => {
						var classList = clientTarget.classList,
							nonStratagemInsightFlashing = classList.contains("flash-animation-iteration-count-infinite");
						if (nonStratagemInsightFlashing) {
							clientTarget.nonStratagemInsightFlashing = true;
						} else {
							classList.add("flash-animation-iteration-count-infinite");
						}
						var identity = get.translation(`${clientInsightResult}2`);
						clientTarget.prompt(identity, clientInsightResult);
						var dialog = ui.create.dialog(`${get.translation(clientTarget)}是${identity}<br>`, "forcebutton");
						ui.create.spinningIdentityCard(clientInsightResult, dialog);
						var control = ui.create.control("ok", () => {
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
					} else if (event.isOnline()) {
						player.send(send, target, insightResult, event.videoId);
						player.wait();
						game.pause();
					}
					"step 2";
					game.broadcastAll("closeDialog", event.videoId);
					if (!_status.connectMode && get.config("auto_mark_identity") && !target.node.identity.firstChild.innerHTML.length) {
						game.broadcastAll(
							(clientPlayer, clientTarget, insightResult) => {
								if (clientPlayer.isUnderControl(true)) {
									clientTarget.setIdentity(insightResult);
								}
							},
							player,
							target,
							event.insightResult
						);
					}
					var afterInsight = clientTarget => {
						clientTarget.unprompt();
						if (clientTarget.nonStratagemInsightFlashing) {
							delete clientTarget.nonStratagemInsightFlashing;
							return;
						}
						var classList = clientTarget.classList;
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
				stratagemCamouflage: () => {
					"step 0";
					var camouflaged = (event.targets = game.players.filter(current => current.identity == "fan" && !current.ai.stratagemCamouflage).randomGets(Math.max(Math.round(get.population() / 6), 1)));
					camouflaged.forEach(current => (current.ai.stratagemCamouflage = true));
					var me = game.me;
					if (event.players.includes(me) && me.identity == "nei") {
						event.videoId = lib.status.videoId++;
						var rebel = get.translation("fan2"),
							dialog = ui.create.dialog(`${get.translation(camouflaged)}是${rebel}<br>`, "forcebutton");
						ui.create.spinningIdentityCard("fan", dialog);
						dialog.videoId = event.videoId;
						camouflaged.forEach(victim => {
							var classList = victim.classList,
								nonCamouflageFlashing = classList.contains("flash-animation-iteration-count-infinite");
							if (nonCamouflageFlashing) {
								victim.nonCamouflageFlashing = true;
							} else {
								classList.add("flash-animation-iteration-count-infinite");
							}
							victim.prompt(rebel, "fan");
						});
						me.chooseControl("ok").set("dialog", dialog);
					}
					game.filterPlayer(current => {
						if (current.identity != "nei") {
							return;
						}
						var storage = current.storage;
						if (!storage.zhibi) {
							storage.zhibi = [];
						}
						storage.zhibi.addArray(camouflaged);
					});
					"step 1";
					targets.forEach(current => {
						if (game.me.identity == "nei" && get.config("nei_auto_mark_camouflage")) {
							current.setIdentity();
						}
						current.unprompt();
						if (current.nonCamouflageFlashing) {
							delete current.nonCamouflageFlashing;
							return;
						}
						var classList = current.classList;
						if (classList.contains("flash-animation-iteration-count-infinite")) {
							classList.remove("flash-animation-iteration-count-infinite");
						}
					});
				},
				stratagemCamouflageOL: () => {
					"step 0";
					var send = (clientCamouflaged, id, online) => {
						var me = game.me;
						if (me.identity == "nei") {
							var storage = me.storage;
							if (!storage.zhibi) {
								storage.zhibi = [];
							}
							storage.zhibi.addArray(clientCamouflaged);
							var rebel = get.translation("fan2"),
								dialog = ui.create.dialog(`${get.translation(clientCamouflaged)}是${rebel}<br>`, "forcebutton");
							ui.create.spinningIdentityCard("fan", dialog);
							dialog.videoId = id;
							clientCamouflaged.forEach(victim => {
								var classList = victim.classList,
									nonCamouflageFlashing = classList.contains("flash-animation-iteration-count-infinite");
								if (nonCamouflageFlashing) {
									victim.nonCamouflageFlashing = true;
								} else {
									classList.add("flash-animation-iteration-count-infinite");
								}
								victim.prompt(rebel, "fan");
							});
							me.chooseControl("ok").set("dialog", dialog);
						} else {
							ui.create.dialog("请等待内奸身份确认...").videoId = id;
						}
						if (online) {
							game.resume();
						}
					};
					var camouflaged = (event.targets = game.players.filter(current => current.identity == "fan" && !current.ai.stratagemCamouflage).randomGets(Math.max(Math.round(get.population() / 6), 1)));
					camouflaged.forEach(current => (current.ai.stratagemCamouflage = true));
					event.videoId = lib.status.videoId++;
					var time = 10000;
					if (lib.configOL && lib.configOL.choose_timeout) {
						time = parseInt(lib.configOL.choose_timeout) * 1000;
					}
					var aiTargets = (event.aiTargets = []);
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
						var me = game.me;
						if (current == me) {
							event.withMe = true;
							send(camouflaged, event.videoId);
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
					if (!aiTargets.length) {
						return;
					}
					aiTargets.randomSort();
					new Promise(resolve => setTimeout(resolve, Math.ceil(3000 + 5000 * Math.random()))).then(() => {
						var interval = setInterval(() => {
							aiTargets.shift();
							if (aiTargets.length) {
								return;
							}
							clearInterval(interval);
							if (event.withAI) {
								game.resume();
							}
						}, Math.ceil(500 + 500 * Math.random()));
					});
					"step 1";
					if (event.withMe) {
						game.me.unwait(result);
					}
					"step 2";
					if (event.withOL && !event.resultOL) {
						game.pause();
					}
					"step 3";
					if (!event.aiTargets.length) {
						return;
					}
					event.withAI = true;
					game.pause();
					"step 4";
					game.broadcastAll("closeDialog", event.videoId);
					event.players.forEach(current => current.hideTimer());
					var afterCamouflage = clientCamouflaged =>
						clientCamouflaged.forEach(victim => {
							victim.unprompt();
							if (victim.nonCamouflageFlashing) {
								delete victim.nonCamouflageFlashing;
								return;
							}
							var classList = victim.classList;
							if (classList.contains("flash-animation-iteration-count-infinite")) {
								classList.remove("flash-animation-iteration-count-infinite");
							}
						});
					event.players.forEach(current => {
						if (current.isOnline()) {
							current.send(afterCamouflage, targets);
							return;
						}
						var me = game.me;
						if (current == me && me.identity == "nei") {
							afterCamouflage(targets);
						}
					});
				},
			},
		},
		get: {
			rawAttitude: function (from, to) {
				var x = 0,
					num = 0,
					temp,
					i;
				if (_status.ai.customAttitude) {
					for (i = 0; i < _status.ai.customAttitude.length; i++) {
						temp = _status.ai.customAttitude[i](from, to);
						if (temp != undefined) {
							x += temp;
							num++;
						}
					}
				}
				if (num) {
					return x / num;
				}
				if (_status.mode == "purple") {
					var real = get.realAttitude(from, to);
					if (from == to || to.identityShown || (from.storage.zhibi && from.storage.zhibi.includes(to)) || (_status.yeconfirm && ["rYe", "bYe"].includes(to.identity) && ["rYe", "bYe"].includes(to.identity))) {
						return real * 1.1;
					}
					return (to.ai.shown + 0.1) * real + (from.identity.slice(0, 1) == to.identity.slice(0, 1) ? 3 : -3) * (1 - to.ai.shown);
				} else if (_status.mode == "stratagem") {
					var x = 0,
						num = 0,
						temp,
						i;
					if (_status.ai.customAttitude) {
						for (i = 0; i < _status.ai.customAttitude.length; i++) {
							temp = _status.ai.customAttitude[i](from, to);
							if (temp != undefined) {
								x += temp;
								num++;
							}
						}
					}
					if (num) {
						return x / num;
					}
					var real = get.realAttitude(from, to),
						zhibi = from.storage.zhibi,
						stratagem_expose = from.storage.stratagem_expose,
						followCamouflage = true;
					if (to.ai.shown) {
						return to.ai.shown * (real + (from.identity == to.identity || (from.identity == "zhu" && to.identity == "zhong") || (from.identity == "zhong" && to.identity == "zhu") || (from.identity == "nei" && to.identity == "zhu" && get.situation() <= 1) || (to.identity == "nei" && get.situation() <= 0 && ["zhu", "zhong"].includes(from.identity)) || (get.situation() >= 3 && from.identity == "fan") ? 2.9 : -2.9));
					}
					if (from == to || to.identityShown || (((stratagem_expose && stratagem_expose.includes(to)) || (zhibi && zhibi.includes(to))) && !to.ai.stratagemCamouflage)) {
						return real * 1.1;
					}
					if (from.identity == "nei" && to.ai.stratagemCamouflage) {
						return real * 1.1;
					}
					if (to.identity == "nei") {
						if (from.identity == "fan") {
							if (get.population("zhong") == 0) {
								if (zhibi) {
									var dead = game.dead.slice();
									for (var current of dead) {
										if (from.storage.zhibi.includes(current) && current.ai.stratagemCamouflage) {
											if (from.storage.stratagem_expose && from.storage.stratagem_expose.includes(to)) {
												return -7;
											}
										}
									}
									if (zhibi.includes(to)) {
										return 3;
									}
								}
							}
						}
					}
					if (
						to.identity == "fan" &&
						from.identity == "nei" &&
						zhibi.includes(game.zhu) &&
						game.players
							.filter(i => i != from && !zhibi.includes(i))
							.map(i => i.identity)
							.reduce((p, c) => (!p.includes(c) ? p.push(c) && p : p), []).length == 1
					) {
						return real;
					}
					for (var fan of game.dead) {
						if (fan.identity != "fan" || !fan.storage.stratagem_revitalization) {
							continue;
						}
						for (var current of fan.storage.stratagem_expose) {
							if (to == current) {
								return real;
							}
						}
					}
					if (from.identity == "fan" && to.identity == "fan") {
						if (from.ai.stratagemCamouflage) {
							var zhu = game.zhu && game.zhu.isZhu && game.zhu.identityShown ? game.zhu : undefined;
							if (zhu) {
								if (zhu.storage.stratagem_expose && zhu.storage.stratagem_expose.includes(to)) {
									return 0;
								}
							}
							if (zhibi && zhibi.includes(to)) {
								return -7;
							}
						}
						if (to.ai.stratagemCamouflage) {
							var zhu = game.zhu && game.zhu.isZhu && game.zhu.identityShown ? game.zhu : undefined;
							if (zhu) {
								if (zhu.storage.stratagem_expose && zhu.storage.stratagem_expose.includes(to)) {
									return 0;
								}
							}
							if (zhibi && zhibi.includes(to)) {
								return -7;
							}
						}
					}
					if (from.identity != "nei" && zhibi && zhibi.includes(to) && !to.identityShown && followCamouflage && to.ai.stratagemCamouflage) {
						return -5;
					}
					if (from.identity != "nei" && stratagem_expose && stratagem_expose.includes(to) && !to.identityShown) {
						return -5;
					}
					if (zhibi) {
						for (var to2 of zhibi) {
							if (to2.storage.stratagem_expose) {
								if (to2.ai.stratagemCamouflage) {
									for (var to3 of to2.storage.stratagem_expose) {
										if (zhibi.slice().addArray(stratagem_expose).includes(to3)) {
											if (to == to2) {
												return real;
											}
										} else if (to == to3) {
											return Math.abs(real + 10) / 10;
										}
									}
								} else {
									for (var to3 of to2.storage.stratagem_expose) {
										if (!zhibi.slice().addArray(stratagem_expose).includes(to3) && to == to3) {
											return get.rawAttitude(to3, to) * Math.sign(real);
										}
									}
								}
							}
						}
					}
					return Math.max(-1, Math.min(-0.1, (-Math.min(5, to.countCards("hes") / 2 + 1) / 5 - Math.max(0, 5 - to.hp) / 4) / 2));
				}
				//正常身份模式态度
				var difficulty = 0;
				if (to == game.me) {
					difficulty = 2 - get.difficulty();
				}
				if (from == to || to.identityShown || from.storage.dongcha == to || to.identityShown || (from.storage.zhibi && from.storage.zhibi.includes(to))) {
					return get.realAttitude(from, to) + difficulty * 1.5;
				} else {
					if (from.identity == "zhong" && to.ai.shown == 0 && from.ai.tempIgnore && !from.ai.tempIgnore.includes(to)) {
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].ai.shown == 0 && game.players[i].identity == "fan") {
								return -0.1 + difficulty * 1.5;
							}
						}
					}
					var aishown = to.ai.shown;
					if ((to.identity == "nei" || to.identity == "commoner") && to.ai.shown < 1 && (to.ai.identity_mark == "fan" || to.ai.identity_mark == "zhong")) {
						aishown = 0.5;
					} else if (aishown == 0 && to.identity != "fan" && to.identity != "zhu") {
						var fanshown = true;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].identity == "fan" && game.players[i].ai.shown == 0 && game.players[i] != from) {
								fanshown = false;
								break;
							}
						}
						if (fanshown) {
							aishown = 0.3;
						}
					}
					return get.realAttitude(from, to) * aishown + difficulty * 1.5;
				}
			},
			realAttitude: function (from, to) {
				if (_status.mode == "purple") {
					if (["rZhu", "rZhong", "bNei"].includes(from.identity)) {
						if (to.identity == "rZhu") {
							return 8;
						}
						if (["rZhong", "bNei"].includes(to.identity)) {
							return 7;
						}
						return -7;
					} else if (["bZhu", "bZhong", "rNei"].includes(from.identity)) {
						if (to.identity == "bZhu") {
							return 8;
						}
						if (["bZhong", "rNei"].includes(to.identity)) {
							return 7;
						}
						return -7;
					} else {
						if (["rYe", "bYe"].includes(to.identity)) {
							return 7;
						}
						if (
							["rZhu", "bZhu"].includes(to.identity) &&
							game.hasPlayer(function (current) {
								return ["rZhong", "bZhong", "rNei", "bNei"].includes(current.identity);
							})
						) {
							return 6.5;
						}
						return -7;
					}
				} else if (_status.mode == "stratagem") {
					if (!game.zhu) {
						if (from.identity == "nei" || to.identity == "nei") {
							return -1;
						}
						if (from.identity == to.identity) {
							return 6;
						}
						return -6;
					}
					var situation = get.situation();
					var identity = from.identity;
					var identity2 = to.identity;
					if (identity2 == "zhu" && !to.isZhu) {
						identity2 = "zhong";
						if (from == to) {
							return 10;
						}
					}
					if (from != to && to.identity == "nei" && to.ai.shown < 1 && (to.ai.identity_mark == "fan" || to.ai.identity_mark == "zhong")) {
						identity2 = to.ai.identity_mark;
					}
					if (from.identity != "nei" && from != to && get.population("fan") == 0 && identity2 == "zhong") {
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].identity == "nei" && game.players[i].ai.identity_mark == "zhong" && game.players[i].ai.shown < 1) {
								identity2 = "nei";
								break;
							}
						}
					}
					switch (identity) {
						case "zhu":
							switch (identity2) {
								case "zhu":
									return 10;
								case "zhong":
									return 6;
								case "nei":
									if (game.players.length == 2) {
										return -10;
									}
									if (to.identity == "zhong") {
										return 0;
									}
									if (get.population("fan") == 0) {
										if (to.ai.identity_mark == "zhong" && to.ai.shown < 1) {
											return 0;
										}
										return -1;
									}
									if (get.population("fan") == 1 && get.population("nei") == 1 && game.players.length == 3) {
										var fan;
										for (var i = 0; i < game.players.length; i++) {
											if (game.players[i].identity == "fan") {
												fan = game.players[i];
												break;
											}
										}
										if (fan) {
											if (to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
												return -3;
											}
										}
										return 0;
									}
									if (situation > 1) {
										return Math.max((situation - 8) / 3, -2);
									}
									return Math.min(3, get.population("fan"));
								case "fan":
									if (get.population("fan") == 1 && get.population("nei") == 1 && game.players.length == 3) {
										var nei;
										for (var i = 0; i < game.players.length; i++) {
											if (game.players[i].identity == "nei") {
												nei = game.players[i];
												break;
											}
										}
										if (nei) {
											if (nei.hp > 1 && nei.hp > to.hp && nei.countCards("he") > to.countCards("he")) {
												return 0;
											}
										}
										return -3;
									}
									return -4;
							}
							break;
						case "zhong":
							switch (identity2) {
								case "zhu":
									return 10;
								case "zhong":
									if (from == to) {
										return 5;
									}
									if (get.population("zhong") > 1) {
										return 3;
									}
									return 4;
								case "nei":
									if (get.population("fan") == 0 && get.population("zhong") == 1) {
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
						case "nei":
							if (identity2 == "zhu" && game.players.length == 2) {
								return -10;
							}
							if (from != to && identity2 != "zhu" && game.players.length == 3) {
								return -8;
							}
							var strategy = get.aiStrategy();
							if (strategy == 4) {
								if (from == to) {
									return 10;
								}
								return 0;
							}
							var num;
							switch (identity2) {
								case "zhu":
									if (strategy == 6) {
										return -1;
									}
									if (strategy == 5) {
										return 10;
									}
									if (to.hp <= 0) {
										return 10;
									}
									if (get.population("fan") == 1) {
										var fan;
										for (var i = 0; i < game.players.length; i++) {
											if (game.players[i].identity == "fan") {
												fan = game.players[i];
												break;
											}
										}
										if (fan) {
											if (to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
												return -3;
											}
										}
										return 0;
									} else {
										if (situation > 1 || get.population("fan") == 0) {
											num = 0;
										} else {
											num = get.population("fan") + Math.max(0, 3 - game.zhu.hp);
										}
									}
									if (strategy == 2) {
										num--;
									}
									if (strategy == 3) {
										num++;
									}
									return num;
								case "zhong":
									if (strategy == 5) {
										return Math.min(0, -situation);
									}
									if (strategy == 6) {
										return Math.max(-1, -situation);
									}
									if (get.population("fan") == 0) {
										num = -5;
									} else if (situation <= 0) {
										num = 0;
									} else if (game.zhu && game.zhu.hp < 2) {
										num = 0;
									} else if (game.zhu && game.zhu.hp == 2) {
										num = -1;
									} else if (game.zhu && game.zhu.hp <= 2 && situation > 1) {
										num = -1;
									} else {
										num = -2;
									}
									if (strategy == 2) {
										num--;
									}
									if (strategy == 3) {
										num++;
									}
									return num;
								case "nei":
									if (from == to) {
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
									if (strategy == 5) {
										return Math.max(-1, situation);
									}
									if (strategy == 6) {
										return Math.min(0, situation);
									}
									if ((game.zhu && game.zhu.hp <= 2 && situation < 0) || situation < -1) {
										num = -3;
									} else if (situation < 0 || get.population("zhong") == 0) {
										num = -2;
									} else if ((game.zhu && game.zhu.hp >= 4 && situation > 0) || situation > 1) {
										num = 1;
									} else {
										num = 0;
									}
									if (strategy == 2) {
										num++;
									}
									if (strategy == 3) {
										num--;
									}
									return num;
							}
							break;
						case "fan":
							switch (identity2) {
								case "zhu":
									if (get.population("nei") > 0) {
										if (situation == 1) {
											return -6;
										}
										if (situation > 1) {
											return -5;
										}
									}
									return -8;
								case "zhong":
									if (game.zhu.hp >= 3 && to.hp == 1) {
										return -10;
									}
									return -7;
								case "nei":
									if (get.population("fan") == 1) {
										return 0;
									}
									if (get.population("zhong") == 0) {
										return -2;
									}
									if (game.zhu && game.zhu.hp <= 2 && game.zhu.identityShown) {
										return -1;
									}
									return 3;
								case "fan":
									return 5;
							}
					}
				}
				//正常身份模式态度
				if (!game.zhu) {
					if (from.identity == "nei" || to.identity == "nei" || from.identity == "commoner" || to.identity == "commoner") {
						return -1;
					}
					if (from.identity == to.identity) {
						return 6;
					}
					return -6;
				}
				var situation = get.situation();
				var identity = from.identity;
				var identity2 = to.identity;
				if (identity2 == "zhu" && !to.isZhu) {
					identity2 = "zhong";
					if (from == to) {
						return 10;
					}
				}
				if (from != to && to.identity == "nei" && to.ai.shown < 1 && (to.ai.identity_mark == "fan" || to.ai.identity_mark == "zhong")) {
					identity2 = to.ai.identity_mark;
				}
				if (from.identity != "nei" && from.identity != "commoner" && from != to && get.population("fan") == 0 && identity2 == "zhong") {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].identity == "nei" && game.players[i].ai.identity_mark == "zhong" && game.players[i].ai.shown < 1) {
							identity2 = "nei";
							break;
						} else if (game.players[i].identity == "commoner" && game.players[i].ai.identity_mark == "zhong" && game.players[i].ai.shown < 1) {
							identity2 = "commoner";
							break;
						}
					}
				}
				var zhongmode = false;
				if (!game.zhu.isZhu) {
					zhongmode = true;
				}
				switch (identity) {
					case "zhu":
						switch (identity2) {
							case "zhu":
								return 10;
							case "zhong":
							case "mingzhong":
								return 6;
							case "nei":
								if (game.players.length == 2) {
									return -10;
								}
								if (to.identity == "zhong") {
									return 0;
								}
								if (get.population("fan") == 0) {
									if (to.ai.identity_mark == "zhong" && to.ai.shown < 1) {
										return 0;
									}
									return -0.5;
								}
								if (zhongmode && to.ai.sizhong && to.ai.shown < 1) {
									return 6;
								}
								if (get.population("fan") == 1 && get.population("nei") == 1 && game.players.length == 3) {
									var fan;
									for (var i = 0; i < game.players.length; i++) {
										if (game.players[i].identity == "fan") {
											fan = game.players[i];
											break;
										}
									}
									if (fan) {
										if (to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
											return -3;
										}
									}
									return 0;
								}
								if (situation > 1) {
									return 0;
								}
								return Math.min(3, get.population("fan"));
							case "fan":
								if (get.population("fan") == 1 && get.population("nei") == 1 && game.players.length == 3) {
									var nei;
									for (var i = 0; i < game.players.length; i++) {
										if (game.players[i].identity == "nei") {
											nei = game.players[i];
											break;
										}
									}
									if (nei) {
										if (nei.hp > 1 && nei.hp > to.hp && nei.countCards("he") > to.countCards("he")) {
											return 0;
										}
									}
									return -3;
								}
								return -4;
							case "commoner":
								if (to.identity == "zhong") {
									return 0;
								}
								if (get.population("fan") == 0) {
									if (to.ai.identity_mark == "zhong" && to.ai.shown < 1) {
										return 0;
									}
									return -0.5;
								}
								if (zhongmode && to.ai.sizhong && to.ai.shown < 1) {
									return 6;
								}
								if (game.players.length == 3) {
									var fan;
									for (var i = 0; i < game.players.length; i++) {
										if (game.players[i].identity == "fan") {
											fan = game.players[i];
											break;
										}
									}
									if (fan) {
										if (to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
											return -3;
										}
									}
									return 3;
								}
								if (situation < 0 && game.zhu && game.zhu.hp <= 2) {
									return -3.8;
								}
								return Math.max(-4, 2 - get.population("fan"));
						}
						break;
					case "zhong":
					case "mingzhong":
						switch (identity2) {
							case "zhu":
								return 10;
							case "zhong":
							case "mingzhong":
								return 4;
							case "nei":
								if (get.population("fan") == 0) {
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
					case "nei":
						if (identity2 == "zhu" && game.players.length == 2) {
							return -10;
						}
						if (from != to && identity2 != "zhu" && identity2 != "commoner" && game.players.length == 3) {
							return -8;
						}
						var strategy = get.aiStrategy();
						if (strategy == 4) {
							if (from == to) {
								return 10;
							}
							return 0;
						}
						var num;
						switch (identity2) {
							case "zhu":
								if (strategy == 6) {
									return -1;
								}
								if (strategy == 5) {
									return 10;
								}
								if (to.hp <= 0) {
									return 10;
								}
								if (get.population("fan") == 1) {
									var fan;
									for (var i = 0; i < game.players.length; i++) {
										if (game.players[i].identity == "fan") {
											fan = game.players[i];
											break;
										}
									}
									if (fan) {
										if (to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
											return -1.7;
										}
									}
									return 0;
								} else {
									if (situation > 1 || get.population("fan") == 0) {
										num = 0;
									} else {
										num = get.population("fan") + Math.max(0, 3 - game.zhu.hp);
									}
								}
								if (strategy == 2) {
									num--;
								}
								if (strategy == 3) {
									num++;
								}
								return num;
							case "zhong":
								if (strategy == 5) {
									return Math.min(0, -situation);
								}
								if (strategy == 6) {
									return Math.max(-1, -situation);
								}
								if (get.population("fan") == 0) {
									num = -5;
								} else if (situation <= 0) {
									num = 0;
								} else if (game.zhu && game.zhu.hp < 2) {
									num = 0;
								} else if (game.zhu && game.zhu.hp == 2) {
									num = -1;
								} else if (game.zhu && game.zhu.hp <= 2 && situation > 1) {
									num = -1;
								} else {
									num = -2;
								}
								if (zhongmode && situation < 2) {
									num = 4;
								}
								if (strategy == 2) {
									num--;
								}
								if (strategy == 3) {
									num++;
								}
								return num;
							case "mingzhong":
								if (zhongmode) {
									if (from.ai.sizhong == undefined) {
										from.ai.sizhong = Math.random() < 0.5;
									}
									if (from.ai.sizhong) {
										return 6;
									}
								}
								if (strategy == 5) {
									return Math.min(0, -situation);
								}
								if (strategy == 6) {
									return Math.max(-1, -situation);
								}
								if (get.population("fan") == 0) {
									num = -5;
								} else if (situation <= 0) {
									num = 0;
								} else {
									num = -3;
								}
								if (strategy == 2) {
									num--;
								}
								if (strategy == 3) {
									num++;
								}
								return num;
							case "nei":
								if (from == to) {
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
								if (strategy == 5) {
									return Math.max(-1, situation);
								}
								if (strategy == 6) {
									return Math.min(0, situation);
								}
								if ((game.zhu && game.zhu.hp <= 2 && situation < 0) || situation < -1) {
									num = -3;
								} else if (situation < 0 || get.population("zhong") + get.population("mingzhong") == 0) {
									num = -2;
								} else if ((game.zhu && game.zhu.hp >= 4 && situation > 0) || situation > 1) {
									num = 1;
								} else {
									num = 0;
								}
								if (strategy == 2) {
									num++;
								}
								if (strategy == 3) {
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
					case "fan":
						switch (identity2) {
							case "zhu":
								if (get.population("nei") > 0) {
									if (situation == 1) {
										return -6;
									}
									if (situation > 1) {
										return -5;
									}
								}
								return -8;
							case "zhong":
								if (!zhongmode && game.zhu.hp >= 3 && to.hp == 1) {
									return -10;
								}
								return -7;
							case "mingzhong":
								return -5;
							case "nei":
								if (zhongmode && to.ai.sizhong) {
									return -7;
								}
								if (get.population("fan") == 1) {
									return 0;
								}
								if (get.population("zhong") + get.population("mingzhong") == 0) {
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
									} else {
										return 0;
									}
								}
								return -2;
							case "nei":
								if (game.players.length == 3 && get.population("nei") == 1) {
									return Math.min(3.5, to.hp - 1.5 + to.countCards("h") / 3) - (to.hp < (game.zhu ? game.zhu.hp : 0) ? 4 : 0);
								}
								if (game.players.length <= 4 && get.population("nei") == 1) {
									return Math.min(5, to.hp - 1.5 + to.countCards("h") / 3);
								}
								if (situation > 0) {
									return -3;
								}
								return 0;
							case "fan":
								if (situation < 0) {
									return to.hp + to.countCards("h") / 4 - 1.7 * get.population("fan") + 2;
								} else if (situation == 0) {
									return 0;
								}
								return 0.55 * get.population("fan") - 2.1;
							case "commoner":
								return from == to ? 10 : to.hp <= 2 ? -2 : 0;
						}
						break;
				}
			},
			situation: function (absolute) {
				var i, j, player;
				var zhuzhong = 0,
					total = 0,
					zhu,
					fan = 0;
				for (i = 0; i < game.players.length; i++) {
					player = game.players[i];
					var php = player.hp;
					if (player.hasSkill("benghuai") && php > 4) {
						php = 4;
					} else if (php > 6) {
						php = 6;
					}
					j = player.countCards("h") + player.countCards("e") * 1.5 + php * 2;
					if (player.identity == "zhu") {
						zhuzhong += j * 1.2 + 5;
						total += j * 1.2 + 5;
						zhu = j;
					} else if (player.identity == "zhong" || player.identity == "mingzhong") {
						zhuzhong += j * 0.8 + 3;
						total += j * 0.8 + 3;
					} else if (player.identity == "fan") {
						zhuzhong -= j + 4;
						total += j + 4;
						fan += j + 4;
					}
				}
				if (absolute) {
					return zhuzhong;
				}
				var result = parseInt(10 * Math.abs(zhuzhong / total));
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
			insightResult: function (from, to) {
				var friend = "friend",
					enemy = "enemy";
				if (from.identity == "nei") {
					return to.identity;
				}
				if (to.identity == "nei") {
					return friend;
				}
				if (from.ai.stratagemCamouflage || to.ai.stratagemCamouflage) {
					return enemy;
				}
				if (from.identity == to.identity || (from.identity == "zhu" && to.identity == "zhong") || (from.identity == "zhong" && to.identity == "zhu")) {
					return friend;
				}
				return enemy;
			},
		},
		skill: {
			stratagem_gain: {
				silent: true,
				charlotte: true,
				ruleSkill: true,
				trigger: {
					player: ["phaseBegin", "damageEnd"],
				},
				content: () => {
					player.changeFury(trigger.name == "damage" ? trigger.num : 1, true);
				},
			},
			stratagem_insight: {
				trigger: {
					source: "damageSource",
					global: "loseHpEnd",
				},
				filter: (event, player) => {
					if (!player.storage.stratagem_fury) {
						return false;
					}
					const target = event.player;
					if (target == player || !target.isIn() || target.identityShown) {
						return false;
					}
					let source = event.source;
					if (event.name == "loseHp") {
						const trigger = event.getParent()._trigger;
						if (trigger) {
							source = trigger.source;
						}
					}
					return player == source;
				},
				logTarget: "player",
				prompt2: event => `消耗1点怒气，洞察${get.translation(event.player)}的身份`,
				check: (event, player) => {
					const storage = player.storage,
						zhibi = storage.zhibi;
					if (zhibi && zhibi.includes(event.player)) {
						return false;
					}
					const stratagemExpose = storage.stratagem_expose;
					if (stratagemExpose && stratagemExpose.includes(event.player)) {
						return false;
					}
					if (get.population("zhong") == 0 && player.identity == "fan") {
						return false;
					}
					return Math.abs(get.attitude(player, event.player)) <= 1;
				},
				charlotte: true,
				ruleSkill: true,
				content: () => {
					player.changeFury(-1, true);
					player.insightInto(trigger.player);
				},
			},
			stratagem_monarchy: {
				trigger: {
					player: ["dying", "phaseZhunbeiBegin"],
					global: "dieAfter",
				},
				forced: true,
				priority: 100,
				popup: false,
				unique: true,
				firstDo: true,
				silent: true,
				charlotte: true,
				ruleSkill: true,
				filter: (event, player, name) => {
					if (player.storage.stratagem_monarchy || player.identity != "zhu") {
						return false;
					}
					if (name == "dieAfter") {
						return game.dead.length >= Math.max(Math.round(get.population() / 3), 2);
					}
					return name == "dying" || game.roundNumber >= Math.max(Math.round(get.population() / 2), 3);
				},
				content: () => {
					"step 0";
					if (event.triggername == "dying") {
						game.delayx();
					}
					"step 1";
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
						var config = lib.config;
						if (config.animation && !config.low_performance) {
							clientPlayer.$legend();
						}
						var clickingIdentity = _status.clickingidentity;
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
					game.delay(2);
					player.playerfocus(1000);
					event.trigger("zhuUpdate");
					"step 2";
					player.recover();
					player.draw();
					"step 3";
					const skills = player.getStockSkills(true, true).filter(stockSkill => {
						if (player.hasSkill(stockSkill)) {
							return;
						}
						var info = get.info(stockSkill);
						if (!info || !info.zhuSkill) {
							return;
						}
						return true;
					});
					if (skills.length) {
						player.addSkills(skills);
					}
				},
			},
			stratagem_revitalization: {
				trigger: {
					player: "dying",
				},
				forced: true,
				unique: true,
				silent: true,
				charlotte: true,
				ruleSkill: true,
				filter: (event, player) => {
					const storage = player.storage;
					return !storage.stratagem_revitalization && player.ai.stratagemCamouflage && game.dead.length < Math.max(Math.round(get.population() / 6), 1) && storage.stratagem_fury >= 2;
				},
				content: () => {
					"step 0";
					game.delayx();
					"step 1";
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
					game.delay(2);
					player.playerfocus(800);
					"step 2";
					player.changeFury(-player.storage.stratagem_fury, true);
					player.discard(player.getCards("hej"));
					player.link(false);
					player.turnOver(false);
					player.recover(2 - player.hp);
					player.draw(3);
				},
			},
			stratagem_expose: {
				trigger: { player: "useCard" },
				forced: true,
				silent: true,
				popup: false,
				filter: (event, player) => {
					const targets = event.targets;
					if (targets.length != 1) {
						return false;
					}
					const target = targets[0];
					return (
						target == player &&
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
				content: () => {
					var storage = trigger.targets[0].storage;
					if (!storage.stratagem_expose) {
						storage.stratagem_expose = [];
					}
					storage.stratagem_expose.add(player);
				},
			},
			yexinbilu: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.identity == "rYe" || player.identity == "bYe";
				},
				charlotte: true,
				ruleSkill: true,
				skillAnimation: "legend",
				animationColor: "thunder",
				content: function () {
					game.removeGlobalSkill("yexinbilu");
					player.yexinbilu();
				},
				ai: {
					order: 10,
					result: {
						player: function (player) {
							return (
								1 -
								game.countPlayer(function (current) {
									return current != player && (current.identity == "rYe" || current.identity == "bYe") && (current == game.me || current.isOnline());
								})
							);
						},
					},
				},
			},
			identity_junshi: {
				name: "军师",
				mark: true,
				intro: {
					content: "准备阶段开始时，可以观看牌堆顶的三张牌，然后将这些牌以任意顺序置于牌堆顶或牌堆底",
				},
				trigger: { player: "phaseZhunbeiBegin" },
				silent: true,
				charlotte: true,
				content: function () {
					"step 0";
					var cards = get.cards(3);
					game.cardsGotoOrdering(cards);
					var next = player.chooseToMove();
					next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
					next.set("prompt", "观星：点击或拖动将牌移动到牌堆顶或牌堆底");
					next.processAI = function (list) {
						var cards = list[0][1],
							player = _status.event.player;
						var top = [];
						var judges = player.getCards("j");
						var stopped = false;
						if (!player.hasWuxie()) {
							for (var i = 0; i < judges.length; i++) {
								var judge = get.judge(judges[i]);
								cards.sort(function (a, b) {
									return judge(b) - judge(a);
								});
								if (judge(cards[0]) < 0) {
									stopped = true;
									break;
								} else {
									top.unshift(cards.shift());
								}
							}
						}
						var bottom;
						if (!stopped) {
							cards.sort(function (a, b) {
								return get.value(b, player) - get.value(a, player);
							});
							while (cards.length) {
								if (get.value(cards[0], player) <= 5) {
									break;
								}
								top.unshift(cards.shift());
							}
						}
						bottom = cards;
						return [top, bottom];
					};
					"step 1";
					var top = result.moved[0];
					var bottom = result.moved[1];
					top.reverse();
					for (var i = 0; i < top.length; i++) {
						ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
					}
					for (i = 0; i < bottom.length; i++) {
						ui.cardPile.appendChild(bottom[i]);
					}
					player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
					game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
					game.updateRoundNumber();
					game.delayx();
				},
			},
			identity_dajiang: {
				name: "大将",
				mark: true,
				intro: {
					content: "手牌上限+1",
				},
				mod: {
					maxHandcard: function (player, num) {
						return num + 1;
					},
				},
				charlotte: true,
			},
			identity_zeishou: {
				name: "贼首",
				mark: true,
				intro: {
					content: "手牌上限-1",
				},
				mod: {
					maxHandcard: function (player, num) {
						return num - 1;
					},
				},
				charlotte: true,
			},
			sixiang_zhuque: {
				mark: true,
				markimage: "image/mode/identity/mark/sixiang_zhuque.jpg",
				intro: {
					content: "出牌阶段，你可以弃置一张非基本牌，对一名角色造成1点伤害，以此法杀死反贼不执行奖惩。",
				},
				enable: "phaseUse",
				filter(event, player) {
					return player.hasCard(card => {
						return get.type(card, null, player) !== "basic";
					}, "he");
				},
				filterCard(card, player) {
					return get.type(card, null, player) !== "basic";
				},
				position: "he",
				filterTarget: true,
				prompt: "弃置一张非基本牌，对一名角色造成1点伤害",
				check(card) {
					return 7 - get.value(card);
				},
				charlotte: true,
				async content(event, trigger, player) {
					player.removeSkill("sixiang_zhuque");
					player.addTempSkill("sixiang_zhuque_cancel", "phaseUseEnd");
					await event.target.damage("nocard");
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
				group: "sixiang_remove",
				subSkill: {
					cancel: {
						trigger: {
							global: ["drawBegin", "discardBegin"],
						},
						filter(event, player) {
							const evt = event.getParent();
							if (!evt || !evt.player) {
								return false;
							}
							return evt.name === "die" && evt.player.identity === "fan" && event.getParent(4).name === "sixiang_zhuque";
						},
						silent: true,
						forceDie: true,
						charlotte: true,
						content() {
							trigger.cancel();
						},
					},
				},
			},
			sixiang_xuanwu: {
				mark: true,
				markimage: "image/mode/identity/mark/sixiang_xuanwu.jpg",
				intro: {
					content: "你可以将一张牌当【桃】使用。",
				},
				enable: "chooseToUse",
				filter(event, player) {
					return player.countCards("hes");
				},
				filterCard: true,
				position: "hes",
				viewAs: {
					name: "tao",
				},
				prompt: "将一张牌当【桃】使用",
				check(card) {
					if (get.tag(card, "recover")) {
						return 0;
					}
					return 9 - get.value(card);
				},
				charlotte: true,
				precontent() {
					player.removeSkill("sixiang_xuanwu");
				},
				ai: {
					result: {
						player(player, target) {
							return -ui.selected.cards.reduce((p, c) => p + get.value(c, player), 0) / 6;
						},
					},
				},
				group: "sixiang_remove",
			},
			sixiang_qinglong: {
				mark: true,
				markimage: "image/mode/identity/mark/sixiang_qinglong.jpg",
				intro: {
					content: "回合开始时，你可以弃置两张牌，弃置你判定区的【乐不思蜀】或【兵粮寸断】。",
				},
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (!player.hasJudge("lebu") && !player.hasJudge("bingliang")) {
						return false;
					}
					return player.countCards("he") > 1;
				},
				async cost(event, trigger, player) {
					const lebu = player.hasJudge("lebu"),
						bingliang = player.hasJudge("bingliang");
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
						.chooseToDiscard("he", 2, get.prompt(event.skill), info)
						.set("logSkill", event.skill)
						.set("ai", function (card) {
							const goon = get.event("goon");
							if (goon) {
								return goon - get.value(card);
							}
							return 0;
						})
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
				charlotte: true,
				async content(event, trigger, player) {
					const lebu = player.getCards("j", j => {
							return j.viewAs === "lebu" || j.name === "lebu";
						}),
						bingliang = player.getCards("j", j => {
							return j.viewAs === "bingliang" || j.name === "bingliang";
						});
					player.removeSkill("sixiang_qinglong");
					let control;
					if (lebu.length && bingliang.length) {
						control = await player
							.chooseControl("lebu", "bingliang")
							.set("prompt", "请选择要弃置的牌")
							.set("ai", () => get.event("control"))
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
							.forResultControl();
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
			},
			sixiang_baihu: {
				mark: true,
				markimage: "image/mode/identity/mark/sixiang_baihu.jpg",
				intro: {
					content: "你可以将一张牌当【杀】或【闪】使用或打出。",
				},
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard: true,
				position: "hes",
				viewAs: { name: "sha" },
				prompt: "将一张牌当【杀】使用或打出",
				check(card) {
					return 5 - get.value(card);
				},
				charlotte: true,
				precontent() {
					player.removeSkill("sixiang_baihu");
				},
				ai: {
					respondSha: true,
					result: {
						player(player, target) {
							return -ui.selected.cards.reduce((p, c) => p + get.value(c, player), 0) / 6;
						},
					},
				},
				group: ["sixiang_baihu_shan", "sixiang_remove"],
				subSkill: {
					shan: {
						enable: ["chooseToUse", "chooseToRespond"],
						filterCard: true,
						viewAs: { name: "shan" },
						position: "hes",
						prompt: "将一张牌当【闪】使用或打出",
						check(card) {
							return 5 - get.value(card);
						},
						precontent() {
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
				silent: true,
				charlotte: true,
				content() {
					player.removeSkill(["sixiang_zhuque", "sixiang_xuanwu", "sixiang_qinglong", "sixiang_baihu"]);
				},
				sub: true,
			},
		},
		help: {
			身份模式: '<div style="margin:10px">选项</div><ul style="margin-top:0"><li>加强主公<br>反贼人数多于2时主公会额外增加一个技能（每个主公的额外技能固定，非常备主公增加天命）' + '<li>特殊身份<br><ul style="padding-left:20px;padding-top:5px"><li>军师：忠臣身份。只要军师存活，主公在准备阶段开始时，可以观看牌堆顶的三张牌，然后将这些牌以任意顺序置于牌堆顶或牌堆底<li>大将：忠臣身份。只要大将存活，主公手牌上限+1<li>贼首：反贼身份，只要贼首存活，主公手牌上限-1</ul></ul>' + "<li>平民身份<br>英盗版三国杀于2017标准版中提出的新概念。平民的获胜条件为：当其他身份的角色达成了其获胜条件，且你存活，你也获胜；同时内奸的获胜条件改为：主公死亡时，场上所有忠臣和反贼均已死亡。即内奸可以和与平民共同胜利。杀死平民的角色的奖惩为：摸两张牌。" + "<li>年机制<br>英盗版三国杀于2019标准版中提出的新概念。“年”是一个全局概念，游戏开始时为第一年，当牌堆洗牌时，年数+1。一局游戏的限定年数为本局游戏开始时玩家总数。当年数增加后，若当前年数已超过限定年数，则主忠方直接获胜，若平民存活则平民也获胜。",
			明忠模式: '<div style="margin:10px">明忠模式（忠胆英杰）</div><ul style="margin-top:0"><li>本模式需要8名玩家进行游戏，使用的身份牌为：1主公、2忠臣、4反贼和1内奸。游戏开始时，每名玩家随机获得一个身份，由系统随机选择一名忠臣身份的玩家亮出身份（将忠臣牌正面朝上放在面前），其他身份（包括主公）的玩家不亮出身份。<li>' + "首先由亮出身份的忠臣玩家随机获得六张武将牌，挑选一名角色，并将选好的武将牌展示给其他玩家。之后其余每名玩家随机获得三张武将牌，各自从其中挑选一张同时亮出<li>" + "亮出身份牌的忠臣增加1点体力上限。角色濒死和死亡的结算及胜利条件与普通身份局相同。",
			谋攻模式:
				'<div style="margin:10px">模式命名由来</div><ul style="margin-top:0"><li>《谋攻篇》一词出自《孙子兵法·谋攻篇》，是春秋时期兵法家孙武创作的一篇散文。《谋攻篇》故知胜有五：知可以战与不可以战者胜，识众寡之用者胜，上下同欲者胜，以虞待不虞者胜，将能而君不御者胜。</ul>' +
				'<div style="margin:10px">游戏规则</div><ul style="margin-top:0"><li>谋攻篇模式为六名玩家参与的全暗身份模式，引入新机制“怒气”，玩家可以消耗怒气探查其他角色的身份是敌人或者队友，或使用怒气强化手牌，以达到识别出队友并击杀敌人的目标。' +
				"<li>各身份玩家的胜利条件与身份局中对应身份的胜利条件一致，且该模式下没有奖惩。" +
				"<li>当主公进入濒死、场上有两名角色阵亡、第三轮的主公准备阶段，主公将会翻开身份牌，回复1点体力并摸一张牌，并获得武将牌上的主公技。" +
				"<li>内奸在游戏开始时将会得知一名反贼的身份，并令该反贼被“伪装”。本局游戏内，被“伪装”的反贼在被任何人探查身份时，结果都提示为“敌人”。作为补偿，其第一次进入濒死时，若场上没有角色死亡且其怒气值不小于2，其弃置区域内所有牌，重置武将牌，将体力回复至2点并摸三张牌。" +
				"<li>特殊地，内奸在被所有角色探查时，都提示为“队友”；内奸在进行探查时，直接得知目标的身份。</ul>" +
				'<div style="margin:10px">新机制“怒气”</div><ul style="margin-top:0"><li>一名角色在回合开始时或受到1点伤害后，将获得1点怒气；怒气上限为3。<li>一名角色令其他角色扣减体力后，该角色可以消耗1点怒气，查探扣减体力的角色是敌或友。</ul>' +
				'<div style="margin:10px">强化卡牌规则</div><ul style="margin-top:0"><li>在第二轮游戏开始后，当你需要使用一张“强化表”内的牌时，你可以通过消耗怒气将此牌强化。' +
				'<li>可强化卡牌<br><ul style="padding-left:20px;padding-top:5px">' +
				"<li>【杀】：消耗1点怒气进行强化，你令响应此杀所需使用的【闪】数+1" +
				"<li>【闪】：消耗1点怒气进行强化，使用时视为两张【闪】的效果" +
				"<li>【决斗】：消耗2点怒气进行强化，对此牌的目标造成伤害时，伤害+1" +
				"<li>【火攻】：消耗2点怒气进行强化，造成的伤害+1" +
				"<li>【桃】：消耗3点怒气进行强化，回复的体力+1</ul></ul>",
			"3v3v2":
				'<div style="margin:10px">3v3v2模式</div><ul style="margin-top:0"><li>游戏准备<br>本模式需要8名玩家进行游戏。游戏开始前，所有玩家随机分成两组，每组四人，分别称为「冷色阵营」和「暖色阵营」，然后分发身份牌，抽取到「主帅」身份的玩家亮出身份牌。' +
				"<li>身份牌<br>每组的身份分为四种。<br>主帅（主）和前锋（忠）：联合对方阵营的细作，击杀己方细作，对方阵营的主帅和前锋以及所有的野心家。<br>细作（内）：帮助对方阵营的主帅和前锋，击杀对方细作，己方阵营的主帅和前锋以及所有的野心家。<br>野心家（野）：联合对方阵营中的野心家，击杀所有其他角色，成为最后的生还者。<br>" +
				"<li>胜负判定<br>冷色主帅，先锋和暖色细作在所有野心家和对方主帅全部阵亡后视为胜利，在冷色主帅阵亡后视为游戏失败。<br>暖色主帅，先锋和冷色细作在所有野心家和对方主帅阵亡后视为胜利，在暖色主帅阵亡后视为失败。<br>野心家在所有不为野心家的角色阵亡后视为胜利，在双方主帅全部阵亡而有非野心家角色存活时失败。<br>当有角色阵亡后，若有角色满足胜利条件，游戏结束。若所有角色均满足失败条件，则游戏平局。若一名角色满足失败条件，即使其满足胜利条件，也视为游戏失败。<br>" +
				"<li>游戏流程<br>在「游戏准备」中的工作完成后，冷色主帅选择一个势力，然后暖色主帅选择一个其他势力，作为双方各自的势力将池。<br>双方主帅从各自的势力将池中获得两张常备主公武将牌和四张非常备主公武将牌，然后选择一张作为武将牌，将其他的武将牌放回势力将池并洗混。然后双方的其他玩家从各自的势力将池中随机获得五张武将牌，选择一张作为自己的武将牌。<br>暖色主帅成为游戏的一号位，双方主帅各加1点体力和体力上限。七号位和八号位的起始手牌+1。<br>当场上第一次有玩家死亡时，野心家确认彼此的身份牌，然后获得技能〖野心毕露〗：出牌阶段，你可以明置身份牌，加1点体力上限和体力值。若如此做，所有的野心家失去技能〖野心毕露〗<br>" +
				"<li>击杀奖惩<br>杀死颜色不同的主帅的角色回复1点体力，杀死颜色不同的先锋的角色摸两张牌，杀死颜色相同的细作的角色摸三张牌，杀死颜色相同的先锋的主帅弃置所有手牌。<br>" +
				"<li>制作团队<br>游戏出品：紫星居<br>游戏设计：食茸貳拾肆<br>游戏开发：食茸貳拾肆、紫髯的小乔、聆星Mine、空城琴音依旧弥漫、丽景原同志、雪之彩翼、拉普拉斯、明月照沟渠<br>程序化：无名杀<br>鸣谢：荆哲、魔风、萨巴鲁酱、这就是秋夜</ul></ul>",
		},
	};
};
