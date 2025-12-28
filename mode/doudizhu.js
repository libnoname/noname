import { lib, game, ui, get, ai, _status } from "noname";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "doudizhu",
		start() {
			"step 0";
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
				game.prepareArena(3);
			}
			"step 1";
			event.replacePile = function () {
				var map = {
					shuiyanqijunx: "shuiyanqijuny",
					bingliang: "binglinchengxia",
					fangtian: "toushiche",
					wutiesuolian: "toushiche",
				};
				for (var i = 0; i < lib.card.list.length; i++) {
					var name = lib.card.list[i][2];
					if (map[name]) {
						lib.card.list[i][2] = map[name];
						lib.card.list[i][4] = null;
						lib.card.list[i]._replaced = true;
					} else if (name == "lebu") {
						switch (lib.card.list[i][0]) {
							case "spade":
								lib.card.list[i][2] = "shuiyanqijuny";
								break;
							case "club":
								lib.card.list[i][2] = "luojingxiashi";
								break;
							default:
								lib.card.list[i][2] = "baiyidujiang";
								break;
						}
						lib.card.list[i]._replaced = true;
					}
				}
			};
			_status.mode = get.config("doudizhu_mode");
			if (_status.connectMode) {
				_status.mode = lib.configOL.doudizhu_mode;
				game.waitForPlayer(function () {
					lib.configOL.number = 3;
				});
			} else if (_status.mode == "binglin") {
				event.replacePile();
			} else if (_status.mode == "online") {
				lib.card.list = lib.online_cardPile.slice(0);
				lib.inpile.addArray(["nanman", "wanjian", "taoyuan", "wugu"]);
				game.fixedPile = true;
			}
			"step 2";
			if (_status.connectMode) {
				if (_status.mode == "online") {
					lib.card.list = lib.online_cardPile.slice(0);
					lib.inpile.addArray(["nanman", "wanjian", "taoyuan", "wugu"]);
					game.fixedPile = true;
				} else if (_status.mode == "binglin") {
					event.replacePile();
				}
				if (lib.configOL.number < 3) {
					lib.configOL.number = 3;
				}
				game.randomMapOL();
			} else {
				for (var i = 0; i < game.players.length; i++) {
					game.players[i].getId();
				}
				game.chooseCharacter();
			}
			"step 3";
			if (ui.coin) {
				_status.coinCoeff = get.coinCoeff([game.me.name]);
			}
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
			switch (_status.mode) {
				case "online":
					game.addGlobalSkill("online_juzhong");
					game.addGlobalSkill("online_zhadan_button");
					game.addGlobalSkill("online_zhadan");
					game.addGlobalSkill("online_aozhan");
					game.addGlobalSkill("online_gongshoujintui");
					break;
				case "binglin":
					game.addGlobalSkill("binglin_bingjin");
					break;
				default:
					if (!game.zhu.isInitFilter("noZhuSkill")) {
						const list = [];
						const version = _status.connectMode ? lib.configOL.feiyang_version : get.config("feiyang_version");
						if (version === "online") {
							list.push("feiyang");
						} else if (version === "mobile") {
							list.push("mbfeiyang");
						} else if (version === "decade") {
							list.push("dcfeiyang");
						}
						list.push("bahu");
						const enhance = _status.connectMode ? lib.configOL.enhance_dizhu : get.config("enhance_dizhu");
						if (["kaihei", "yinfu", "shiqiang", "qiangyi", "oldshiqiang"].includes(enhance)) {
							list.push(enhance);
						}
						game.zhu.addSkill(list);
					}
			}
			game.addGlobalSkill("doudizhu_viewHandcard");
			game.syncState();
			event.trigger("gameStart");

			var players = get.players(lib.sort.position);
			var info = [];
			for (var i = 0; i < players.length; i++) {
				info.push({
					name: players[i].name1,
					name2: players[i].name2,
					identity: players[i].identity,
					nickname: players[i].node.nameol.innerHTML,
				});
			}
			_status.videoInited = true;
			game.addVideo("init", null, info);
			if (_status.mode == "kaihei") {
				game.addGlobalSkill("kaihei");
			}

			var next = game.gameDraw(game.zhu || _status.firstAct || game.me);
			if (_status.mode == "online") {
				const card = game.createCard("diqi", "club", 13);
				game.zhu.addVirtualEquip(get.autoViewAs(card, void 0, false), [card]);
				next.num = function (player) {
					var num = 4;
					if (player == game.zhu) {
						if (lib.character[player.name1] && get.infoHp(lib.character[player.name1][2]) > 3) {
							num++;
						}
						if (lib.character[player.name2] && get.infoHp(lib.character[player.name2][2]) > 3) {
							num++;
						}
					}
					return num;
				};
			} else if (_status.mode == "binglin") {
				next.num = function (player) {
					return player == game.zhu ? 5 : 4;
				};
			}
			if (_status.mode != "online" && _status.connectMode && lib.configOL.change_card) {
				game.replaceHandcards(game.players.slice(0));
			}
			game.phaseLoop(game.zhu || _status.firstAct || game.me);
			game.zhu.showGiveup();
		},
		game: {
			canReplaceViewpoint: () => true,
			recommendDizhu: ["re_guojia", "re_huanggai", "re_lvbu", "re_guanyu", "re_sunquan", "re_xusheng", "re_wuyi", "re_sunben", "xuyou", "zhangchunhua", "caochong", "zhangsong", "zhongyao", "wangyi", "caochun", "maliang", "sp_diaochan", "quyi", "sp_zhaoyun", "shamoke", "lijue", "liuzan", "wenyang", "shen_lvmeng", "shen_ganning", "jiakui", "wangyuanji", "lingcao", "miheng", "sp_key_yuri", "key_hinata", "key_rin", "key_kyousuke", "ns_chendao", "jiakui", "haozhao"],
			addRecord(bool) {
				if (typeof bool == "boolean") {
					var data = lib.config.gameRecord.doudizhu.data;
					var identity = game.me.identity;
					if (!data[identity]) {
						data[identity] = [0, 0];
					}
					if (bool) {
						data[identity][0]++;
					} else {
						data[identity][1]++;
					}
					var list = ["zhu", "fan"];
					var str = "";
					for (var i = 0; i < list.length; i++) {
						if (data[list[i]]) {
							str += lib.translate[list[i] + "2"] + "：" + data[list[i]][0] + "胜" + " " + data[list[i]][1] + "负<br>";
						}
					}
					lib.config.gameRecord.doudizhu.str = str;
					game.saveConfig("gameRecord", lib.config.gameRecord);
				}
			},
			getState() {
				var state = {};
				for (var i in lib.playerOL) {
					var player = lib.playerOL[i];
					state[i] = { identity: player.identity };
				}
				return state;
			},
			updateState(state) {
				for (var i in state) {
					var player = lib.playerOL[i];
					if (player) {
						player.identity = state[i].identity;
					}
				}
			},
			updateRoundNumber() {
				if (_status.mode == "online") {
					game.broadcastAll(
						function (num1, num2, top, bonusNum) {
							if (ui.cardPileNumber) {
								var str = num1 + "轮 公共牌堆: " + num2;
								if (game.me && game.me.storage.doudizhu_cardPile && game.me.storage.doudizhu_cardPile.length) {
									str += " 个人牌堆: " + game.me.storage.doudizhu_cardPile.length;
								}
								if (bonusNum) {
									str += "<br>本场叫价: " + bonusNum * 100;
								}
								ui.cardPileNumber.innerHTML = str;
							}
							_status.pileTop = top;
						},
						game.roundNumber,
						ui.cardPile.childNodes.length,
						ui.cardPile.firstChild,
						game.bonusNum
					);
					return;
				}
				game.broadcastAll(
					function (num1, num2, top) {
						if (ui.cardPileNumber) {
							ui.cardPileNumber.innerHTML = num1 + "轮 剩余牌: " + num2;
						}
						_status.pileTop = top;
					},
					game.roundNumber,
					ui.cardPile.childNodes.length,
					ui.cardPile.firstChild
				);
			},
			getRoomInfo(uiintro) {
				uiintro.add('<div class="text chat">双将模式：' + (lib.configOL.double_character ? "开启" : "关闭"));
				if (lib.configOL.banned.length) {
					uiintro.add('<div class="text chat">禁用武将：' + get.translation(lib.configOL.banned));
				}
				if (lib.configOL.bannedcards.length) {
					uiintro.add('<div class="text chat">禁用卡牌：' + get.translation(lib.configOL.bannedcards));
				}
				uiintro.style.paddingBottom = "8px";
			},
			getVideoName() {
				var str = get.translation(game.me.name);
				if (game.me.name2) {
					str += "/" + get.translation(game.me.name2);
				}
				var namex;
				switch (_status.mode) {
					case "normal":
						namex = "休闲斗地主";
						break;
					case "kaihei":
						namex = "开黑斗地主";
						break;
					case "huanle":
						namex = "欢乐斗地主";
						break;
					case "binglin":
						namex = "兵临城下";
						break;
					case "online":
						namex = "智斗三国";
						break;
				}
				var name = [str, namex + " - " + lib.translate[game.me.identity + "2"]];
				return name;
			},
			showIdentity(me) {
				for (var i = 0; i < game.players.length; i++) {
					// if(me===false&&game.players[i]==game.me) continue;
					game.players[i].node.identity.classList.remove("guessing");
					game.players[i].identityShown = true;
					game.players[i].ai.shown = 1;
					game.players[i].setIdentity(game.players[i].identity);
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
			checkResult() {
				var me = game.me._trueMe || game.me;
				if (game.zhu.isAlive()) {
					if (_status.mode != "online" && (_status.mode != "binglin" || game.roundNumber < 3) && game.players.length > 1) {
						return;
					}
					if (me == game.zhu) {
						game.over(true);
					} else {
						game.over(false);
					}
				} else {
					if (me == game.zhu) {
						game.over(false);
					} else {
						game.over(true);
					}
				}
			},
			checkOnlineResult(player) {
				if (game.zhu.isAlive()) {
					return player.identity == "zhu";
				} else {
					return player.identity == "fan";
				}
			},
			chooseCharacterZhidou() {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					game.no_continue_game = true;
					lib.init.onfree();
					"step 1";
					ui.arena.classList.add("choose-character");
					var i;
					var groups = [];
					event.list = [];
					event.map = {};
					var chara = get.config("character_online") || lib.characterOnline;
					for (i in chara) {
						var list = chara[i];
						for (var j = 0; j < list.length; j++) {
							if (!lib.character[list[j]] || (i == "key" && lib.filter.characterDisabled(list[j]))) {
								list.splice(j--, 1);
							}
						}
						if (list.length >= 3) {
							groups.push(i);
							event.list.addArray(list);
						}
					}
					event.list.randomSort();
					_status.characterlist = event.list.slice(0);
					event.controls = ["不叫地主", "一倍", "两倍", "三倍"];
					for (var player of game.players) {
						var id = player.playerid;
						player._group = groups.randomRemove(1)[0];
						event.map[id] = chara[player._group].randomGets(4);
						player.storage.doudizhu_cardPile = get.cards(20).sort(function (a, b) {
							if (a.name != b.name) {
								return lib.sort.card(a.name, b.name);
							} else if (a.suit != b.suit) {
								return lib.suit.indexOf(a) - lib.suit.indexOf(b);
							} else {
								return a.number - b.number;
							}
						});
					}
					event.dialog = ui.create.dialog("你的选将框与底牌", [event.map[game.me.playerid], "character"], game.me.storage.doudizhu_cardPile);
					event.start = game.players.randomGet();
					event.current = event.start;
					game.delay(7);
					"step 2";
					event.current.classList.add("glow_phase");
					if (event.current == game.me) {
						event.dialog.content.firstChild.innerHTML = "是否叫地主？";
					} else {
						event.dialog.content.firstChild.innerHTML = "请等待其他玩家叫地主";
						game.delay(2);
					}
					event.current.chooseControl(event.controls).set("ai", function () {
						return _status.event.getParent().controls.randomGet();
					});
					"step 3";
					event.current.classList.remove("glow_phase");
					event.current._control = result.control;
					event.current.chat(result.control);
					if (result.control == "三倍") {
						game.bonusNum = 3;
						game.zhu = event.current;
						return;
					} else if (result.control != "不叫地主") {
						event.controls.splice(1, event.controls.indexOf(result.control));
						event.tempDizhu = event.current;
						if (result.control == "二倍") {
							game.bonusNum = 2;
						}
					}
					event.current = event.current.next;
					if (event.current == event.start && (event.start == event.tempDizhu || event.start._control == "不叫地主")) {
						game.zhu = event.tempDizhu || event.start.previous;
					} else if (event.current == event.start.next && event.current._control) {
						game.zhu = event.tempDizhu;
					} else {
						event.goto(2);
					}
					if (event.current == event.start.previous && !event.tempDizhu) {
						event.controls.remove("不叫地主");
					}
					"step 4";
					game.updateRoundNumber();
					for (var player of game.players) {
						player.identity = player == game.zhu ? "zhu" : "fan";
						player.showIdentity();
					}
					event.dialog.content.firstChild.innerHTML = "请选择" + get.cnNumber(game.me == game.zhu ? 2 : 1) + "张武将牌";
					game.me.chooseButton(event.dialog, true, game.me == game.zhu ? 2 : 1).set("filterButton", function (button) {
						return typeof button.link == "string";
					});
					"step 5";
					game.me.init(result.links[0], result.links[1]);
					for (var player of game.players) {
						if (player != game.me) {
							if (player == game.zhu) {
								var list = event.map[player.playerid].randomGets(2);
								player.init(list[0], list[1]);
							} else {
								player.init(event.map[player.playerid].randomGet());
							}
						}
						player.markSkill("doudizhu_cardPile");
					}
					game.zhu.hp = 4;
					game.zhu.maxHp = 4;
					game.zhu.update();
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterBinglin() {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					game.no_continue_game = true;
					lib.init.onfree();
					"step 1";
					ui.arena.classList.add("choose-character");
					game.zhuSkill = "zhuSkill_" + ["xiangyang", "jiangling", "fancheng"].randomGet();
					var i;
					event.list = [];
					event.map = {};
					for (i in lib.character) {
						if (lib.filter.characterDisabled(i)) {
							continue;
						}
						event.list.push(i);
					}
					event.list.randomSort();
					_status.characterlist = event.list.slice(0);
					for (var player of game.players) {
						event.map[player.playerid] = event.list.randomRemove(4);
					}
					event.controls = ["不叫地主", "一倍", "两倍", "三倍"];
					event.dialog = ui.create.dialog("本局城池：" + get.translation(game.zhuSkill), [event.map[game.me.playerid], "character"]);
					event.start = game.players.randomGet();
					event.current = event.start;
					game.delay(8);
					"step 2";
					event.current.classList.add("glow_phase");
					if (event.current == game.me) {
						event.dialog.content.firstChild.innerHTML = "是否叫地主？";
					} else {
						event.dialog.content.firstChild.innerHTML = "请等待其他玩家叫地主";
						game.delay(2);
					}
					event.current.chooseControl(event.controls).set("ai", function () {
						return _status.event.getParent().controls.randomGet();
					});
					"step 3";
					event.current.classList.remove("glow_phase");
					event.current._control = result.control;
					event.current.chat(result.control);
					if (result.control == "三倍") {
						game.bonusNum = 3;
						game.zhu = event.current;
						return;
					} else if (result.control != "不叫地主") {
						event.controls.splice(1, event.controls.indexOf(result.control));
						event.tempDizhu = event.current;
						if (result.control == "二倍") {
							game.bonusNum = 2;
						}
					}
					event.current = event.current.next;
					if (event.current == event.start) {
						game.zhu = event.tempDizhu || event.start.previous;
					} else {
						event.goto(2);
					}
					if (event.current == event.start.previous && !event.tempDizhu) {
						event.controls.remove("不叫地主");
					}
					"step 4";
					for (var player of game.players) {
						player.identity = player == game.zhu ? "zhu" : "fan";
						player.showIdentity();
					}
					event.dialog.close();
					event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
					"step 5";
					var list = ["请选择你的武将", [event.map[game.me.playerid], "character"]];
					if (game.me.identity == "fan") {
						var friend = game.findPlayer(function (current) {
							return current != game.me && current.identity == "fan";
						});
						list.push('<div class="text center">队友的选将框</div>');
						list.push([event.map[friend.playerid], "character"]);
					}
					game.me
						.chooseButton(list, true)
						.set("list", event.map[game.me.playerid])
						.set("filterButton", function (button) {
							return _status.event.list.includes(button.link);
						});
					"step 6";
					game.me.init(result.links[0]);
					for (var player of game.players) {
						if (player != game.me) {
							player.init(event.map[player.playerid].randomGet());
						}
						if (player == game.zhu) {
							player.addSkill(game.zhuSkill);
						} else {
							player.addSkill("binglin_neihong");
						}
					}
					if (!game.zhu.isInitFilter("noZhuHp")) {
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterHuanle() {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					game.no_continue_game = true;
					var i;
					event.list = [];
					event.list2 = [];
					var list4 = [];
					if (!event.map) {
						event.map = {};
					}
					for (i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (lib.filter.characterDisabled(ix[j])) {
								ix.splice(j--, 1);
							}
						}
						if (ix.length) {
							var name = ix.randomGet();
							event.list.push(name);
							if (game.recommendDizhu.includes(name)) {
								event.list2.push(name);
							}
							list4.addArray(ix);
						}
					}
					for (i in lib.character) {
						if (list4.includes(i) || lib.filter.characterDisabled(i)) {
							continue;
						}
						event.list.push(i);
						if (game.recommendDizhu.includes(i)) {
							event.list2.push(i);
						}
					}
					event.list.randomSort();
					_status.characterlist = event.list.slice(0);
					event.controls = ["不叫", "叫地主"];
					for (var player of game.players) {
						var id = player.playerid;
						if (!event.map[id]) {
							event.map[id] = [];
						}
						event.map[id].addArray(event.list2.randomRemove(1));
						event.list.removeArray(event.map[id]);
						event.map[id].addArray(event.list.randomRemove(4 - event.map[id].length));
						event.list2.removeArray(event.map[id]);
					}
					event.dialog = ui.create.dialog("你的选将框", [event.map[game.me.playerid], "character"]);
					event.start = game.players.randomGet();
					event.current = event.start;
					lib.init.onfree();
					game.delay(2.5);
					"step 1";
					event.current.chooseControl(event.controls).set("ai", function () {
						return Math.random() > 0.5 ? "不叫" : "叫地主";
					});
					if (event.current == game.me) {
						event.dialog.content.childNodes[0].innerHTML = "是否抢地主？";
					}
					"step 2";
					event.current.chat(result.control);
					if (result.control == "叫地主" || event.current == event.start.next) {
						game.zhu = result.control == "叫地主" ? event.current : event.current.next;
						for (var player of game.players) {
							player.identity = player == game.zhu ? "zhu" : "fan";
							player.showIdentity();
						}
						event.dialog.close();
						event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
					} else {
						event.current = event.current.next;
						event.goto(1);
						game.delay(1.5);
					}
					"step 3";
					game.me.chooseButton(["请选择你的武将", [event.map[game.me.playerid], "character"]], true);
					"step 4";
					game.me.init(result.links[0]);
					for (var player of game.players) {
						if (player != game.me) {
							player.init(event.map[player.playerid].randomGet());
						}
					}
					if (!game.zhu.isInitFilter("noZhuHp")) {
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},

			chooseCharacterKaihei() {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					game.no_continue_game = true;
					var i;
					var identityList = ["zhu", "fan", "fan"];
					game.saveConfig("continue_name");
					event.list = [];
					var list4 = [];
					identityList.randomSort();
					for (i = 0; i < game.players.length; i++) {
						game.players[i].identity = identityList[i];
						game.players[i].showIdentity();
						if (identityList[i] == "zhu") {
							game.zhu = game.players[i];
						}
					}

					if (!game.zhu) {
						game.zhu = game.me;
					} else {
						game.zhu.setIdentity();
						game.zhu.identityShown = true;
						game.zhu.isZhu = game.zhu.identity == "zhu";
						game.zhu.node.identity.classList.remove("guessing");
						game.me.setIdentity();
						game.me.node.identity.classList.remove("guessing");
					}

					for (i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (lib.filter.characterDisabled(ix[j])) {
								ix.splice(j--, 1);
							}
						}
						if (ix.length) {
							event.list.push(ix.randomGet());
							list4.addArray(ix);
						}
					}
					for (i in lib.character) {
						if (list4.includes(i) || lib.filter.characterDisabled(i)) {
							continue;
						}
						event.list.push(i);
					}
					event.list.randomSort();
					_status.characterlist = event.list.slice(0);
					for (var player of game.players) {
						player._characterChoice = event.list.randomRemove(get.config("choice_" + player.identity));
						if (player.identity == "fan") {
							player._friend = player.next.identity == "fan" ? player.next : player.previous;
						}
					}
					var createDialog = ["选择武将"];
					createDialog.push([game.me._characterChoice, "character"]);
					if (game.me._friend) {
						createDialog.push("队友的武将");
						createDialog.push([game.me._friend._characterChoice, "character"]);
					}
					game.me
						.chooseButton(createDialog, true)
						.set("onfree", true)
						.set("filterButton", function (button) {
							return _status.event.player._characterChoice.includes(button.link);
						});
					"step 1";
					game.me.init(result.links[0]);
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != game.me) {
							game.players[i].init(game.players[i]._characterChoice.randomGet());
						}
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
						if (game.players[i] == game.zhu) {
							if (!game.zhu.isInitFilter("noZhuHp")) {
								game.zhu.maxHp++;
								game.zhu.hp++;
								game.zhu.update();
							}
						}
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacter() {
				if (_status.mode == "kaihei") {
					game.chooseCharacterKaihei();
					return;
				}
				if (_status.mode == "huanle") {
					game.chooseCharacterHuanle();
					return;
				}
				if (_status.mode == "online") {
					game.chooseCharacterZhidou();
					return;
				}
				if (_status.mode == "binglin") {
					game.chooseCharacterBinglin();
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
					if (player == game.zhu) {
						if (!game.zhu.isInitFilter("noZhuHp")) {
							game.zhu.maxHp++;
							game.zhu.hp++;
							game.zhu.update();
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
					player.node.name.dataset.nature = get.groupnature(player.group);
				};
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
					var list;
					var list4 = [];
					var identityList = ["zhu", "fan", "fan"];
					var chosen = lib.config.continue_name || [];
					game.saveConfig("continue_name");
					event.chosen = chosen;

					var addSetting = function (dialog) {
						dialog.add("选择身份").classList.add("add-setting");
						var table = document.createElement("div");
						table.classList.add("add-setting");
						table.style.margin = "0";
						table.style.width = "100%";
						table.style.position = "relative";

						var listi = ["random", "zhu", "fan"];
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
								if (game.zhu.name) {
									if (link != "random") {
										_status.event.parent.fixedseat = get.distance(game.me, game.zhu, "absolute");
									}
									game.zhu.uninit();
									delete game.zhu.isZhu;
									delete game.zhu.identityShown;
								}
								var current = this.parentNode.querySelector(".bluebg");
								if (current) {
									current.classList.remove("bluebg");
								}
								current = seats.querySelector(".bluebg");
								if (current) {
									current.classList.remove("bluebg");
								}
								if (link == "random") {
									link = ["zhu", "fan"].randomGet();
									for (var i = 0; i < this.parentNode.childElementCount; i++) {
										if (this.parentNode.childNodes[i].link == link) {
											this.parentNode.childNodes[i].classList.add("bluebg");
										}
									}
								} else {
									this.classList.add("bluebg");
								}
								num = get.config("choice_" + link);
								_status.event.parent.swapnodialog = function (dialog, list) {
									var buttons = ui.create.div(".buttons");
									var node = dialog.buttons[0].parentNode;
									dialog.buttons = ui.create.buttons(list, "characterx", buttons);
									dialog.content.insertBefore(buttons, node);
									buttons.addTempClass("start");
									node.remove();
									game.uncheck();
									game.check();
									for (var i = 0; i < seats.childElementCount; i++) {
										if (get.distance(game.zhu, game.me, "absolute") === seats.childNodes[i].link) {
											seats.childNodes[i].classList.add("bluebg");
										}
									}
								};
								_status.event = _status.event.parent;
								_status.event.step = 0;
								_status.event.identity = link;
								if (ui.selected.buttons.length > 0) {
									ui.selected.buttons.forEach(function (button) {
										if (button && button.parentNode) {
											button.classList.remove("selected");
										}
									});
									ui.selected.buttons.length = 0;
								}
								if (link != (event.zhongmode ? "mingzhong" : "zhu")) {
									seats.previousSibling.style.display = "";
									seats.style.display = "";
								} else {
									seats.previousSibling.style.display = "none";
									seats.style.display = "none";
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
						for (var i = 2; i <= game.players.length; i++) {
							var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.innerHTML = get.cnNumber(i, true);
							td.link = i - 1;
							seats.appendChild(td);
							if (get.distance(game.zhu, game.me, "absolute") === i - 1) {
								td.classList.add("bluebg");
							}
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
								if (_status.dragged) {
									return;
								}
								if (_status.justdragged) {
									return;
								}
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
							});
						}
						dialog.content.appendChild(seats);
						if (game.me == game.zhu) {
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
							var zhuIdentity = "zhu";
							if (zhuIdentity != event.identity) {
								identityList.remove(zhuIdentity);
								identityList.splice(event.fixedseat, 0, zhuIdentity);
							}
							delete event.fixedseat;
						}
						delete event.identity;
					}
					for (i = 0; i < game.players.length; i++) {
						game.players[i].identity = identityList[i];
						game.players[i].showIdentity();
						if (identityList[i] == "zhu") {
							game.zhu = game.players[i];
						}
					}

					if (!game.zhu) {
						game.zhu = game.me;
					} else {
						game.zhu.setIdentity();
						game.zhu.identityShown = true;
						game.zhu.isZhu = game.zhu.identity == "zhu";
						game.zhu.node.identity.classList.remove("guessing");
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
						}
					}
					for (i in lib.character) {
						if (chosen.includes(i) || list4.includes(i)) {
							continue;
						}
						if (lib.filter.characterDisabled(i)) {
							continue;
						}
						event.list.push(i);
						list4.push(i);
					}
					event.list.randomSort();
					_status.characterlist = list4.slice(0);
					var num = get.config("choice_" + game.me.identity);
					list = event.list.slice(0, num);
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
					dialog.setCaption("选择角色");
					game.me.setIdentity();

					if (!event.chosen.length) {
						game.me.chooseButton(dialog, true).set("onfree", true).selectButton = function () {
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

							event.list.randomSort();
							list = event.list.slice(0, num);

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
					var chooseGroup = false;
					if (event.chosen.length) {
						if (lib.selectGroup.includes(lib.character[event.chosen[0]][1])) {
							chooseGroup = true;
						}
					} else if (event.modchosen) {
						if (event.modchosen[0] == "random") {
							event.modchosen[0] = result.buttons[0].link;
						} else {
							event.modchosen[1] = result.buttons[0].link;
						}
					} else if (result.buttons.length == 2) {
						event.choosed = [result.buttons[0].link, result.buttons[1].link];
						game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
						if (lib.selectGroup.includes(lib.character[event.choosed[0]][1])) {
							chooseGroup = true;
						}
					} else {
						event.choosed = [result.buttons[0].link];
						if (lib.selectGroup.includes(lib.character[event.choosed[0]][1])) {
							chooseGroup = true;
						}
						game.addRecentCharacter(result.buttons[0].link);
					}
					"step 2";
					if (event.chosen.length) {
						game.me.init(event.chosen[0], event.chosen[1]);
					} else if (event.modchosen) {
						game.me.init(event.modchosen[0], event.modchosen[1]);
					} else if (event.choosed.length == 2) {
						game.me.init(event.choosed[0], event.choosed[1]);
					} else {
						game.me.init(event.choosed[0]);
					}
					event.list.remove(get.sourceCharacter(game.me.name1));
					event.list.remove(get.sourceCharacter(game.me.name2));
					if (game.me == game.zhu) {
						if (!game.me.isInitFilter("noZhuHp")) {
							game.me.hp++;
							game.me.maxHp++;
							game.me.update();
						}
					}

					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != game.me) {
							event.list.randomSort();
							event.ai(game.players[i], event.list.splice(0, get.config("choice_" + game.players[i].identity)), null, event.list);
						}
					}
					"step 3";
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},

			chooseCharacterKaiheiOL() {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
					var identityList = ["fan", "fan", "fan"];
					var aiList = game.filterPlayer(function (current) {
						return current != game.me && !current.isOnline();
					});
					if (aiList.length == 1) {
						identityList[game.players.indexOf(aiList[0])] = "zhu";
					} else {
						identityList[0] = "zhu";
						identityList.randomSort();
					}
					for (i = 0; i < game.players.length; i++) {
						game.players[i].identity = identityList[i];
						game.players[i].showIdentity();
						game.players[i].identityShown = true;
						if (identityList[i] == "zhu") {
							game.zhu = game.players[i];
						}
					}
					event.list = [];
					var list4 = [];

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
					for (i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j], libCharacter)) {
								ix.splice(j--, 1);
							}
						}
						if (ix.length) {
							event.list.push(ix.randomGet());
							list4.addArray(ix);
						}
					}
					for (i in libCharacter) {
						if (list4.includes(i) || lib.filter.characterDisabled(i, libCharacter)) {
							continue;
						}
						event.list.push(i);
					}
					_status.characterlist = event.list.slice(0);

					var map = {};
					for (var player of game.players) {
						player._characterChoice = event.list.randomRemove(lib.configOL["choice_" + player.identity]);
						if (player.identity == "fan") {
							player._friend = player.next.identity == "fan" ? player.next : player.previous;
						}
						map[player.playerid] = player._characterChoice;
					}
					game.broadcastAll(function (map) {
						for (var i in map) {
							lib.playerOL[i]._characterChoice = map[i];
						}
					}, map);
					"step 1";
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						var dialog = ["请选择武将", [game.players[i]._characterChoice, "character"]];
						if (game.players[i]._friend) {
							dialog.push("队友的武将");
							dialog.push([game.players[i]._friend._characterChoice, "character"]);
						}
						list.push([
							game.players[i],
							dialog,
							true,
							function () {
								return Math.random();
							},
							function (button) {
								return _status.event.player._characterChoice.includes(button.link);
							},
						]);
					}
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0]);
						}
					});
					"step 2";
					for (var i in lib.playerOL) {
						if (!result[i] || result[i] == "ai" || !result[i].links || !result[i].links.length) {
							result[i] = lib.playerOL[i]._characterChoice.randomGet();
						} else {
							result[i] = result[i].links[0];
						}
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result[i]);
						}
					}

					if (!game.zhu.isInitFilter("noZhuHp")) {
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}

					game.broadcast(
						function (result, zhu) {
							for (var i in result) {
								if (!lib.playerOL[i].name) {
									lib.playerOL[i].init(result[i]);
								}
							}
							game.zhu = zhu;
							if (!game.zhu.isInitFilter("noZhuHp")) {
								game.zhu.maxHp++;
								game.zhu.hp++;
								game.zhu.update();
							}

							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						result,
						game.zhu
					);
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterHuanleOL() {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
					event.list = [];
					event.list2 = [];
					var list4 = [];
					event.controls = ["不叫", "叫地主"];
					if (!event.map) {
						event.map = {};
					}
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
					for (i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j], libCharacter)) {
								ix.splice(j--, 1);
							}
						}
						if (ix.length) {
							var name = ix.randomGet();
							event.list.push(name);
							if (game.recommendDizhu.includes(name)) {
								event.list2.push(name);
							}
							list4.addArray(ix);
						}
					}
					for (i in libCharacter) {
						if (list4.includes(i) || lib.filter.characterDisabled(i, libCharacter)) {
							continue;
						}
						event.list.push(i);
						if (game.recommendDizhu.includes(i)) {
							event.list2.push(i);
						}
					}
					for (var player of game.players) {
						var id = player.playerid;
						if (!event.map[id]) {
							event.map[id] = [];
						}
						event.map[id].addArray(event.list2.randomRemove(1));
						event.list.removeArray(event.map[id]);
						event.map[id].addArray(event.list.randomRemove(4 - event.map[id].length));
						event.list2.removeArray(event.map[id]);
					}
					_status.characterlist = event.list.slice(0);
					event.videoId = lib.status.videoId++;
					game.broadcastAll(
						function (map, id) {
							ui.create.dialog("你的选将框", [map[game.me.playerid], "character"]).videoId = id;
						},
						event.map,
						event.videoId
					);
					event.start = game.players.randomGet();
					event.current = event.start;
					if (event.current != game.me || !event.current.isOnline()) {
						game.delay(3);
					}
					"step 1";
					event.current.chooseControl(event.controls).set("ai", function () {
						return Math.random() > 0.5 ? "不叫" : "叫地主";
					});
					"step 2";
					event.current.chat(result.control);
					if (result.control == "叫地主" || event.current == event.start.next) {
						game.zhu = result.control == "叫地主" ? event.current : event.current.next;
						for (var player of game.players) {
							player.identity = player == game.zhu ? "zhu" : "fan";
							player.showIdentity();
							player.identityShown = true;
						}
						game.broadcastAll("closeDialog", event.videoId);
						event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
					} else {
						event.current = event.current.next;
						event.goto(1);
					}
					"step 3";
					var list = [];
					var str = "选择角色";
					for (var i = 0; i < game.players.length; i++) {
						list.push([game.players[i], [str, [event.map[game.players[i].playerid], "character"]], true]);
					}
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0], result.links[1]);
						}
					});
					"step 4";
					for (var i in result) {
						if (result[i] && result[i].links) {
							for (var j = 0; j < result[i].links.length; j++) {
								event.list2.remove(result[i].links[j]);
							}
						}
					}
					for (var i in result) {
						if (result[i] == "ai") {
							result[i] = event.list2.randomRemove(lib.configOL.double_character ? 2 : 1);
						} else {
							result[i] = result[i].links;
						}
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result[i][0], result[i][1]);
						}
					}

					if (!game.zhu.isInitFilter("noZhuHp")) {
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}

					game.broadcast(
						function (result, zhu) {
							for (var i in result) {
								if (!lib.playerOL[i].name) {
									lib.playerOL[i].init(result[i][0], result[i][1]);
								}
							}
							game.zhu = zhu;
							if (!game.zhu.isInitFilter("noZhuHp")) {
								game.zhu.maxHp++;
								game.zhu.hp++;
								game.zhu.update();
							}

							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						result,
						game.zhu
					);
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterBinglinOL() {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
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
					event.list = [];
					event.map = {};
					for (i in libCharacter) {
						if (lib.filter.characterDisabled(i, libCharacter)) {
							continue;
						}
						event.list.push(i);
					}
					event.list.randomSort();
					_status.characterlist = event.list.slice(0);
					event.controls = ["不叫地主", "一倍", "两倍", "三倍"];
					for (var player of game.players) {
						var id = player.playerid;
						event.map[id] = event.list.randomRemove(4);
					}
					event.start = game.players.randomGet();
					event.current = event.start;

					event.videoId = lib.status.videoId++;
					game.zhuSkill = "zhuSkill_" + ["xiangyang", "jiangling", "fancheng"].randomGet();
					game.broadcastAll(
						function (map, id, skill) {
							ui.create.dialog("本局城池：" + get.translation(skill), [map[game.me.playerid], "character"]).videoId = id;
						},
						event.map,
						event.videoId,
						game.zhuSkill
					);
					game.delay(6);
					"step 1";
					game.broadcastAll(
						function (id, current) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (game.me == current) {
									dialog.content.firstChild.innerHTML = "是否叫地主？";
								} else {
									dialog.content.firstChild.innerHTML = "请等待其他玩家叫地主";
								}
							}
						},
						event.videoId,
						event.current
					);
					if (event.current != game.me && !event.current.isOnline()) {
						game.delay(2);
					}
					event.current.chooseControl(event.controls).set("ai", function () {
						return _status.event.getParent().controls.randomGet();
					});
					"step 2";
					event.current._control = result.control;
					event.current.chat(result.control);
					if (result.control == "三倍") {
						game.bonusNum = 3;
						game.zhu = event.current;
						return;
					} else if (result.control != "不叫地主") {
						event.controls.splice(1, event.controls.indexOf(result.control));
						event.tempDizhu = event.current;
						if (result.control == "二倍") {
							game.bonusNum = 2;
						}
					}
					event.current = event.current.next;
					if (event.current == event.start) {
						game.zhu = event.tempDizhu || event.start;
					} else {
						event.goto(1);
					}
					if (event.current == event.start.previous && !event.tempDizhu) {
						event.controls.remove("不叫地主");
					}
					"step 3";
					for (var player of game.players) {
						player.identity = player == game.zhu ? "zhu" : "fan";
						player.showIdentity();
						player.identityShown = true;
						player._characterChoice = event.map[player.playerid];
					}
					event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
					game.broadcastAll(
						function (id, map) {
							var dialog = get.idDialog(id);
							if (dialog) {
								dialog.close();
							}
							game.me._characterChoice = map[game.me.playerid];
						},
						event.videoId,
						event.map
					);
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						var dialog = ["请选择武将", [event.map[game.players[i].playerid], "character"]];
						if (game.players[i].identity == "fan") {
							var friend = game.findPlayer(function (current) {
								return current != game.players[i] && current.identity == "fan";
							});
							dialog.push('<div class="text center">队友的选将框</div>');
							dialog.push([event.map[friend.playerid], "character"]);
						}
						list.push([
							game.players[i],
							dialog,
							true,
							function () {
								return Math.random();
							},
							function (button) {
								return _status.event.player._characterChoice.includes(button.link);
							},
						]);
					}
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0]);
						}
					});
					"step 4";
					for (var i in lib.playerOL) {
						if (!result[i] || result[i] == "ai" || !result[i].links || !result[i].links.length) {
							result[i] = event.map[i].randomGet();
						} else {
							result[i] = result[i].links[0];
						}
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result[i]);
						}
					}

					if (!game.zhu.isInitFilter("noZhuHp")) {
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}

					game.broadcast(
						function (result, zhu) {
							for (var i in result) {
								if (!lib.playerOL[i].name) {
									lib.playerOL[i].init(result[i]);
								}
							}
							game.zhu = zhu;
							if (!game.zhu.isInitFilter("noZhuHp")) {
								game.zhu.maxHp++;
								game.zhu.hp++;
								game.zhu.update();
							}

							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						result,
						game.zhu
					);
					for (var player of game.players) {
						if (player == game.zhu) {
							player.addSkill(game.zhuSkill);
						} else {
							player.addSkill(["binglin_shaxue", "binglin_neihong"]);
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterZhidouOL() {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
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
					var groups = [];
					event.list = [];
					event.map = {};
					var chara = get.config("character_online") || lib.characterOnline;
					for (i in chara) {
						var list = chara[i];
						for (var j = 0; j < list.length; j++) {
							if (!lib.character[list[j]] || lib.connectBanned.includes(list[j]) || (i == "key" && lib.filter.characterDisabled(list[j], libCharacter))) {
								list.splice(j--, 1);
							}
						}
						if (list.length >= 3) {
							groups.push(i);
							event.list.addArray(list);
						}
					}
					event.list.randomSort();
					_status.characterlist = event.list.slice(0);
					event.controls = ["不叫地主", "一倍", "两倍", "三倍"];
					for (var player of game.players) {
						var id = player.playerid;
						player._group = groups.randomRemove(1)[0];
						event.map[id] = chara[player._group].randomGets(3);
						player.storage.doudizhu_cardPile = get.cards(20).sort(function (a, b) {
							if (a.name != b.name) {
								return lib.sort.card(a.name, b.name);
							} else if (a.suit != b.suit) {
								return lib.suit.indexOf(a) - lib.suit.indexOf(b);
							} else {
								return a.number - b.number;
							}
						});
						player.markSkill("doudizhu_cardPile");
					}
					event.start = game.players.randomGet();
					event.current = event.start;

					event.videoId = lib.status.videoId++;
					game.broadcastAll(
						function (map, id) {
							ui.create.dialog("你的选将框和底牌", [map[game.me.playerid], "character"], game.me.storage.doudizhu_cardPile).videoId = id;
						},
						event.map,
						event.videoId
					);
					game.delay(4);
					"step 1";
					game.broadcastAll(
						function (id, current) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (game.me == current) {
									dialog.content.firstChild.innerHTML = "是否叫地主？";
								} else {
									dialog.content.firstChild.innerHTML = "请等待其他玩家叫地主";
								}
							}
						},
						event.videoId,
						event.current
					);
					if (event.current != game.me && !event.current.isOnline()) {
						game.delay(2);
					}
					event.current.chooseControl(event.controls).set("ai", function () {
						return _status.event.getParent().controls.randomGet();
					});
					"step 2";
					event.current._control = result.control;
					event.current.chat(result.control);
					if (result.control == "三倍") {
						game.bonusNum = 3;
						game.zhu = event.current;
						return;
					} else if (result.control != "不叫地主") {
						event.controls.splice(1, event.controls.indexOf(result.control));
						event.tempDizhu = event.current;
						if (result.control == "二倍") {
							game.bonusNum = 2;
						}
					}
					event.current = event.current.next;
					if (event.current == event.start && (event.start == event.tempDizhu || event.start._control == "不叫地主")) {
						game.zhu = event.tempDizhu || event.start.previous;
					} else if (event.current == event.start.next && event.current._control) {
						game.zhu = event.tempDizhu;
					} else {
						event.goto(1);
					}
					if (event.current == event.start.previous && !event.tempDizhu) {
						event.controls.remove("不叫地主");
					}
					"step 3";
					for (var player of game.players) {
						player.identity = player == game.zhu ? "zhu" : "fan";
						player.showIdentity();
						player.identityShown = true;
					}
					game.broadcastAll("closeDialog", event.videoId);
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						list.push([game.players[i], ["选择" + (game.players[i] == game.zhu ? "两" : "一") + "张武将牌", [event.map[game.players[i].playerid], "character"]], true, game.players[i] == game.zhu ? 2 : 1]);
					}
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0], result.links[1]);
						}
					});
					"step 4";
					for (var i in result) {
						if (result[i] == "ai") {
							result[i] = event.map[i].randomRemove(lib.playerOL[i] == game.zhu ? 2 : 1);
						} else {
							result[i] = result[i].links;
						}
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result[i][0], result[i][1]);
						}
					}

					game.zhu.hp = 4;
					game.zhu.maxHp = 4;
					game.zhu.update();

					game.broadcast(
						function (result, zhu) {
							for (var i in result) {
								if (!lib.playerOL[i].name) {
									lib.playerOL[i].init(result[i][0], result[i][1]);
								}
							}
							game.zhu = zhu;
							game.zhu.hp = 4;
							game.zhu.maxHp = 4;
							game.zhu.update();

							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						result,
						game.zhu
					);
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterOL() {
				if (_status.mode == "kaihei") {
					game.chooseCharacterKaiheiOL();
					return;
				} else if (_status.mode == "huanle") {
					game.chooseCharacterHuanleOL();
					return;
				} else if (_status.mode == "online") {
					game.chooseCharacterZhidouOL();
					return;
				} else if (_status.mode == "binglin") {
					game.chooseCharacterBinglinOL();
					return;
				}
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
					var identityList = ["zhu", "fan", "fan"];
					identityList.randomSort();
					for (i = 0; i < game.players.length; i++) {
						game.players[i].identity = identityList[i];
						game.players[i].showIdentity();
						game.players[i].identityShown = true;
						if (identityList[i] == "zhu") {
							game.zhu = game.players[i];
						}
					}

					var list;
					var list4 = [];
					event.list = [];

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
					for (i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j], libCharacter)) {
								ix.splice(j--, 1);
							}
						}
						if (ix.length) {
							event.list.push(i);
							list4.addArray(ix);
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
						if (list4.includes(i) || lib.filter.characterDisabled(i, libCharacter)) {
							continue;
						}
						event.list.push(i);
						list4.push(i);
					}
					_status.characterlist = list4;
					"step 1";
					var list = [];
					var selectButton = lib.configOL.double_character ? 2 : 1;

					var num = Math.floor(event.list.length / game.players.length);

					for (var i = 0; i < game.players.length; i++) {
						var num3 = Math.min(num, lib.configOL["choice_" + game.players[i].identity]);
						var str = "选择角色";
						list.push([game.players[i], [str, [event.list.randomRemove(num3), "characterx"]], selectButton, true]);
					}
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0], result.links[1]);
						}
					});
					"step 2";
					for (var i in result) {
						if (result[i] && result[i].links) {
							for (var j = 0; j < result[i].links.length; j++) {
								event.list.remove(get.sourceCharacter(result[i].links[j]));
							}
						}
					}
					for (var i in result) {
						if (result[i] == "ai") {
							var listc = event.list.randomRemove(lib.configOL.double_character ? 2 : 1);
							for (var i = 0; i < listc.length; i++) {
								var listx = lib.characterReplace[listc[i]];
								if (listx && listx.length) {
									listc[i] = listx.randomGet();
								}
							}
							result[i] = listc;
						} else {
							result[i] = result[i].links;
						}
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result[i][0], result[i][1]);
						}
					}

					if (!game.zhu.isInitFilter("noZhuHp")) {
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}

					game.broadcast(
						function (result, zhu) {
							for (var i in result) {
								if (!lib.playerOL[i].name) {
									lib.playerOL[i].init(result[i][0], result[i][1]);
								}
							}
							game.zhu = zhu;
							if (!game.zhu.isInitFilter("noZhuHp")) {
								game.zhu.maxHp++;
								game.zhu.hp++;
								game.zhu.update();
							}

							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						result,
						game.zhu
					);
					for (var i = 0; i < game.players.length; i++) {
						_status.characterlist.remove(game.players[i].name1);
						_status.characterlist.remove(game.players[i].name2);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
		},
		translate: {
			zhu: "主",
			fan: "反",
			zhu2: "地主",
			fan2: "农民",
			random2: "随机",
			feiyang: "飞扬",
			doudizhu_viewHandcard: "手牌可见",
			bahu: "跋扈",
			feiyang_info: "判定阶段开始时，若你的判定区有牌，则你可以弃置两张牌，然后弃置你判定区的所有牌。",
			bahu_info: "锁定技，准备阶段开始时，你摸一张牌。出牌阶段，你出【杀】次数+1。",
			kaihei: "强易",
			kaihei_info: "出牌阶段，你可以获得一名其他角色的至多两张牌，然后交给其等量的牌。每名角色每局游戏限一次。",
			dcfeiyang: "飞扬",
			dcfeiyang_info: "判定阶段开始时，若你的判定区有牌，则你可以弃置两张手牌，然后弃置你判定区的所有牌。",
			mbfeiyang: "飞扬",
			mbfeiyang_info: "判定阶段开始时，若你的判定区有牌，则你可以弃置两张手牌，然后弃置你判定区的一张牌。",
			yinfu: "殷富",
			yinfu_info: "锁定技。①回合开始时，若你的已损失体力值不小于游戏轮次，你回复1点体力。②当你发动〖殷富①〗至少3次后，你失去〖殷富〗。",
			shiqiang: "恃强",
			shiqiang_info: "出牌阶段限一次，你可以将一张牌当无距离限制的【杀】使用。此【杀】结算结束后，若未造成伤害，你减1点体力上限。",
			oldshiqiang: "恃强",
			oldshiqiang_info: "出牌阶段限一次，你可以将一张牌当无距离限制的任意【杀】使用。你以此法使用【杀】时，摸一张牌。此【杀】结算结束后，若未造成伤害，你减1点体力上限。",
			qiangyi: "强易",
			qiangyi_info: "每名角色限一次。出牌阶段，你选择一名其他角色，获得其一张手牌，然后交给其一张手牌。",
			doudizhu_cardPile: "底牌",
			online_gongshoujintui: "攻守进退",
			gongshoujianbei: "攻守兼备",
			gongshoujianbei_info: "出牌阶段，你可选择：①将此牌当做【万箭齐发】使用。②将此牌当做【桃园结义】使用。",
			jintuiziru: "进退自如",
			jintuiziru_info: "出牌阶段，你可选择：①将此牌当做【南蛮入侵】使用。②将此牌当做【五谷丰登】使用。",
			diqi: "地契",
			diqi_skill: "地契",
			diqi_info: "当你受到伤害时，你可以弃置此牌，防止此伤害。当此牌离开你的装备区后，销毁之。",
			_juzhong: "聚众",
			juzhong_jiu: "聚众",
			zhadan: "炸弹",
			zhadan_info: "当一张牌被使用时，对此牌使用。取消此牌的所有目标，且本局游戏的底价翻倍。",
			jiwangkailai: "继往开来",
			jiwangkailai_info: "出牌阶段，对包含你自己在内的一名角色使用。目标角色选择一项：①弃置所有手牌，然后摸等量的牌。②将所有手牌当做一张不为【继往开来】的普通锦囊牌使用。",
			zhuSkill_xiangyang: "襄阳",
			zhuSkill_xiangyang_info: "回合结束时，你可获得一个额外的出牌阶段或摸牌阶段。",
			zhuSkill_jiangling: "江陵",
			zhuSkill_jiangling0: "江陵",
			zhuSkill_jiangling1: "江陵",
			zhuSkill_jiangling_info: "出牌阶段开始时，你可选择一项：①本阶段内使用【杀】或普通锦囊牌选择唯一目标时可增加一个目标。②本阶段内使用【杀】或普通锦囊牌无次数限制。",
			zhuSkill_fancheng: "樊城",
			zhuSkill_fancheng0: "樊城",
			zhuSkill_fancheng1: "樊城",
			zhuSkill_fancheng_info: "限定技，出牌阶段，你可选择获得一项效果直到游戏结束：①因执行【杀】的效果而对其他角色造成的伤害+1。②对其他角色造成的渠道不为【杀】的伤害+1。",
			binglin_shaxue: "歃血",
			binglin_shaxue_info: "锁定技，每局游戏限三次，当你受到队友造成的伤害时，你防止此伤害。",
			binglin_neihong: "内讧",
			binglin_neihong_info: "锁定技，当你杀死队友后，你所在的阵营视为游戏失败。",
			baiyidujiang: "白衣渡江",
			baiyidujiang_info: "出牌阶段，对地主使用。你选择一项：①令其将手牌数摸至全场最多。②令其将手牌数弃置至全场最少。",
			luojingxiashi: "落井下石",
			luojingxiashi_info: "出牌阶段，对所有其他的已受伤角色使用。目标角色受到1点伤害。",
			binglinchengxia: "兵临城下",
			binglinchengxia_info: "出牌阶段，对一名其他角色使用。将此牌横置于目标角色的判定区内。目标角色于判定阶段进行判定，若判定结果不为♦，则其弃置装备区内的所有牌或受到1点伤害。",
			toushiche: "投石车",
			toushiche_skill: "投石车",
			toushiche_info: "锁定技，结束阶段开始时，你令所有手牌数大于你的角色依次弃置一张手牌。",
			binglin_bingjin: "兵尽",
		},
		element: {
			player: {
				getTopCards(num) {
					if (typeof num != "number") {
						num = 1;
					}
					var cards;
					var player = this;
					if (num <= 0) {
						cards = [];
					} else if (player.storage.doudizhu_cardPile?.length) {
						cards = player.storage.doudizhu_cardPile.randomRemove(num);
						if (player.storage.doudizhu_cardPile.length) {
							player.markSkill("doudizhu_cardPile");
						} else {
							player.unmarkSkill("doudizhu_cardPile");
						}
					} else {
						cards = [];
					}
					if (cards.length < num) {
						cards.addArray(get.cards(num - cards.length));
					} else {
						game.updateRoundNumber();
					}
					return cards;
				},
				$dieAfter() {
					if (_status.video) {
						return;
					}
					if (!this.node.dieidentity) {
						var str = { zhu: "地主", fan: "农民" }[this.identity];
						var node = ui.create.div(".damage.dieidentity", str, this);
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
				dieAfter(source) {
					if (_status.mode == "binglin" && source && this != source && this.identity == source.identity && source.hasSkill("binglin_neihong")) {
						if (game.me == game.zhu) {
							game.over(true);
						} else {
							game.over(false);
						}
					} else {
						game.checkResult();
					}
				},
				dieAfter2() {
					if (_status.mode == "binglin" || _status.mode == "online" || this.identity != "fan") {
						return;
					}
					var player = this,
						target = game.findPlayer(function (current) {
							return current != player && current.identity == "fan";
						}, true);
					if (target) {
						target.showGiveup();
						const version = _status.connectMode ? lib.configOL.enhance_nongmin : get.config("enhance_nongmin");
						if (version !== "decade") {
							target[version === "mobile" ? "chooseDrawRecover" : "draw"](version === "mobile" ? 2 : 1);
						}
					}
				},
				logAi(targets, card) { },
				showIdentity() {
					game.broadcastAll(
						function (player, identity) {
							player.identity = identity;
							player.node.identity.classList.remove("guessing");
							player.identityShown = true;
							player.ai.shown = 1;
							player.setIdentity();
							if (player.identity == "zhu") {
								player.isZhu = true;
							}
							if (_status.clickingidentity) {
								for (var i = 0; i < _status.clickingidentity[1].length; i++) {
									_status.clickingidentity[1][i].delete();
									_status.clickingidentity[1][i].style.transform = "";
								}
								delete _status.clickingidentity;
							}
						},
						this,
						this.identity
					);
				},
			},
		},
		get: {
			rawAttitude(from, to) {
				if (from.identity == to.identity) {
					return 10;
				}
				return -10;
			},
		},
		skill: {
			binglin_bingjin: {
				trigger: { player: "phaseEnd" },
				forced: true,
				ruleSkill: true,
				filter(event, player) {
					return _status.mode == "binglin" && game.roundNumber > 14;
				},
				content() {
					player.loseHp();
				},
			},
			zhuSkill_xiangyang: {
				trigger: { player: "phaseEnd" },
				charlotte: true,
				direct: true,
				content() {
					"step 0";
					player.chooseControl("摸牌阶段", "出牌阶段", "cancel2").set("prompt", "襄阳：是否执行一个额外的阶段？");
					"step 1";
					if (result.control != "cancel2") {
						player.logSkill(event.name);
						var next = player[result.index ? "phaseUse" : "phaseDraw"]();
						event.next.remove(next);
						trigger.next.push(next);
					}
				},
			},
			zhuSkill_jiangling: {
				trigger: { player: "phaseUseBegin" },
				direct: true,
				charlotte: true,
				content() {
					"step 0";
					player
						.chooseControl("加目标", "多刀", "取消")
						.set("prompt", get.prompt2("zhuSkill_jiangling"))
						.set("ai", () => 3 - game.countPlayer());
					"step 1";
					if (result.index < 2) {
						player.logSkill("zhuSkill_jiangling");
						player.addTempSkill("zhuSkill_jiangling" + result.index, "phaseUseAfter");
						game.log(player, "选择了", "#y" + result.control, "的效果");
					}
				},
			},
			zhuSkill_jiangling0: {
				trigger: { player: "useCard2" },
				direct: true,
				charlotte: true,
				filter(event, player) {
					if (event.card.name != "sha" && get.type(event.card) != "trick") {
						return false;
					}
					if (!event.targets || event.targets.length != 1) {
						return false;
					}
					var info = get.info(event.card);
					if (info.allowMultiple == false) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
					player
						.chooseTarget(get.prompt("zhuSkill_jiangling"), function (card, player, target) {
							var player = _status.event.player;
							if (_status.event.targets.includes(target)) {
								return false;
							}
							return lib.filter.targetEnabled2(_status.event.card, player, target) && lib.filter.targetInRange(_status.event.card, player, target);
						})
						.set("prompt2", prompt2)
						.set("ai", function (target) {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player;
							return get.effect(target, trigger.card, player, player) * (_status.event.targets.includes(target) ? -1 : 1);
						})
						.set("targets", trigger.targets)
						.set("card", trigger.card);
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) {
							game.delayx();
						}
						event.targets = result.targets;
					} else {
						event.finish();
					}
					"step 2";
					if (event.targets) {
						player.logSkill("zhuSkill_jiangling", event.targets);
						if (trigger.targets.includes(event.targets[0])) {
							trigger.targets.removeArray(event.targets);
						} else {
							//trigger.directHit.addArray(event.targets);
							trigger.targets.addArray(event.targets);
						}
					}
				},
			},
			zhuSkill_jiangling1: {
				charlotte: true,
				mod: {
					cardUsable(card, player) {
						if (card.name == "sha" || get.type(card) == "trick") {
							return Infinity;
						}
					},
				},
			},
			zhuSkill_fancheng: {
				enable: "phaseUse",
				limited: true,
				charlotte: true,
				skillAnimation: true,
				animationColor: "gray",
				content() {
					"step 0";
					player.awakenSkill(event.name);
					player
						.chooseControl("杀", "其他")
						.set("prompt", "选择要强化的伤害")
						.set("ai", () => get.rand(0, 1));
					"step 1";
					player.addSkill("zhuSkill_fancheng" + result.index);
					game.log(player, "本局游戏内", result.index ? "#g杀以外" : "#y杀", "的伤害+1");
				},
				ai: {
					order: 100,
					result: { player: 100 },
				},
			},
			zhuSkill_fancheng0: {
				trigger: { source: "damageBegin2" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return event.player != player && event.card && event.card.name == "sha" && event.getParent().name == "sha";
				},
				logTarget: "player",
				content() {
					trigger.num++;
				},
				mark: true,
				marktext: "殺",
				intro: { content: "因执行【杀】的效果对其他角色造成的伤害+1" },
			},
			zhuSkill_fancheng1: {
				trigger: { source: "damageBegin2" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return event.player != player && (!event.card || event.card.name != "sha");
				},
				logTarget: "player",
				content() {
					trigger.num++;
				},
				mark: true,
				marktext: "谋",
				intro: { content: "不因【杀】对其他角色造成的伤害+1" },
			},
			binglin_shaxue: {
				init(player, skill) {
					player.addMark(skill, 3, false);
				},
				trigger: { player: "damageBegin3" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return event.source && player != event.source && player.identity == event.source.identity && player.countMark("binglin_shaxue") > 0;
				},
				content() {
					trigger.cancel();
					player.removeMark("binglin_shaxue", 1, false);
					trigger.source.removeMark("binglin_shaxue", 1, false);
				},
				intro: { content: "剩余次数：#" },
				ai: {
					viewHandcard: true,
					skillTagFilter(player, tag, arg) {
						return player != arg && arg.hasSkill("binglin_shaxue");
					},
				},
			},
			binglin_neihong: { charlotte: true },
			toushiche_skill: {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				equipSkill: true,
				filter(event, player) {
					return lib.skill.toushiche_skill.logTarget(null, player).length > 0;
				},
				logTarget(event, player) {
					var hs = player.countCards("h");
					return game.filterPlayer(function (current) {
						return current != player && current.countCards("h") > hs;
					});
				},
				content() {
					"step 0";
					event.targets = lib.skill.toushiche_skill.logTarget(null, player).sortBySeat();
					"step 1";
					var target = targets.shift();
					if (target.countCards("h") > 0) {
						target.chooseToDiscard("h", true);
					}
					if (targets.length) {
						event.redo();
					}
				},
			},
			online_gongshoujintui: {
				enable: "chooseToUse",
				filter(event, player) {
					var cards = player.getCards("hs");
					for (var i of cards) {
						var name = get.name(i, player);
						if (name == "gongshoujianbei") {
							if (
								event.filterCard(
									{
										name: "wanjian",
										isCard: true,
										cards: [i],
									},
									player,
									event
								) ||
								event.filterCard(
									{
										name: "taoyuan",
										isCard: true,
										cards: [i],
									},
									player,
									event
								)
							) {
								return true;
							}
						}
						if (name == "jintuiziru") {
							if (
								event.filterCard(
									{
										name: "nanman",
										isCard: true,
										cards: [i],
									},
									player,
									event
								) ||
								event.filterCard(
									{
										name: "wugu",
										isCard: true,
										cards: [i],
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
				},
				chooseButton: {
					dialog(event, player) {
						var list = [];
						if (player.countCards("hs", "gongshoujianbei")) {
							list.push(["锦囊", "", "wanjian"]);
							list.push(["锦囊", "", "taoyuan"]);
						}
						if (player.countCards("hs", "jintuiziru")) {
							list.push(["锦囊", "", "nanman"]);
							list.push(["锦囊", "", "wugu"]);
						}
						return ui.create.dialog("攻守兼备/进退自如", [list, "vcard"], "hidden");
					},
					filter(button, player) {
						var name = button.link[2];
						var rawname = name == "wanjian" || name == "taoyuan" ? "gongshoujianbei" : "jintuiziru";
						var cards = player.getCards("hs");
						var evt = _status.event.getParent();
						for (var i of cards) {
							if (
								get.name(i, player) == rawname &&
								evt.filterCard(
									{
										name: name,
										isCard: true,
										cards: [i],
									},
									player,
									evt
								)
							) {
								return true;
							}
						}
						return false;
					},
					check(button) {
						return _status.event.player.getUseValue({ name: button.link[2], isCard: true });
					},
					backup(links) {
						var name = links[0][2];
						var rawname = name == "wanjian" || name == "taoyuan" ? "gongshoujianbei" : "jintuiziru";
						return {
							popname: true,
							viewAs: { name: name, isCard: true },
							filterCard: { name: rawname },
							ai1: () => 1,
						};
					},
					prompt(links) {
						var name = links[0][2];
						var rawname = name == "wanjian" || name == "taoyuan" ? "gongshoujianbei" : "jintuiziru";
						return "将一张" + get.translation(rawname) + "当做" + get.translation(name) + "使用";
					},
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					},
				},
			},
			doudizhu_cardPile: {
				intro: {
					content: "cardCount",
				},
			},
			kaihei: {
				charlotte: true,
				enable: "phaseUse",
				filter(event, player) {
					return (
						player == game.zhu &&
						game.hasPlayer(function (current) {
							return lib.skill.kaihei.filterTarget(null, player, current);
						})
					);
				},
				filterTarget(card, player, target) {
					return player != target && !player.getStorage("kaihei_used").includes(target) && target.countGainableCards(player, "he") > 0;
				},
				async content(event, trigger, player) {
					const { target } = event;
					player.markAuto(`${event.name}_used`, target);
					const result = await player.gainPlayerCard(target, [1, 2], "he", true).forResult();
					if (!result?.bool || !result.cards?.length) {
						return;
					}
					let num = result.cards.length,
						hs = player.getCards("he"),
						resultx;
					if (hs.length) {
						if (hs.length <= num) {
							resultx = { bool: true, cards: hs };
						} else {
							resultx = await player.chooseCard("he", true, num, `选择交给${get.translation(target)}${get.cnNumber(num)}张牌`).forResult();
						}
						if (resultx?.bool && resultx?.cards?.length) {
							await player.give(resultx.cards, target);
						}
					}
				},
				ai: {
					order: 5,
					result: {
						player: 1,
						target: -1,
					},
				},
			},
			doudizhu_viewHandcard: {
				ai: {
					viewHandcard: true,
					skillTagFilter(player, tag, target) {
						if (player == target || player.identity != "fan" || target.identity != "fan") {
							return false;
						}
					},
				},
			},
			//OL飞扬
			feiyang: {
				charlotte: true,
				trigger: { player: "phaseJudgeBegin" },
				filter(event, player) {
					return _status.mode != "online" && _status.mode != "binglin" && player == game.zhu && player.countCards("j") && player.countCards("he") > 1;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseToDiscard("he", 2, get.prompt(event.skill), "弃置两张牌，然后弃置判定区里的所有牌")
						.set("logSkill", event.skill)
						.set("ai", function (card) {
							if (_status.event.goon) {
								return 7 - get.value(card);
							}
							return 0;
						})
						.set(
							"goon",
							(() => {
								if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
									return false;
								}
								return player.hasCard(function (card) {
									if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
										return false;
									}
									return (
										get.effect(
											player,
											{
												name: card.viewAs || card.name,
												cards: [card],
											},
											player,
											player
										) < 0
									);
								}, "j");
							})()
						)
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					await player.discardPlayerCard(player, "j", true, player.countCards("j"));
				},
			},
			//十周年飞扬
			dcfeiyang: {
				charlotte: true,
				trigger: { player: "phaseJudgeBegin" },
				filter(event, player) {
					return _status.mode != "online" && _status.mode != "binglin" && player == game.zhu && player.countCards("j") && player.countCards("h") > 1;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseToDiscard("h", 2, get.prompt(event.skill), "弃置两张手牌，然后弃置判定区里的所有牌")
						.set("logSkill", event.skill)
						.set("ai", function (card) {
							if (_status.event.goon) {
								return 7 - get.value(card);
							}
							return 0;
						})
						.set(
							"goon",
							(() => {
								if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
									return false;
								}
								return player.hasCard(function (card) {
									if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
										return false;
									}
									return (
										get.effect(
											player,
											{
												name: card.viewAs || card.name,
												cards: [card],
											},
											player,
											player
										) < 0
									);
								}, "j");
							})()
						)
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					await player.discardPlayerCard(player, "j", true, player.countCards("j"));
				},
			},
			//手杀飞扬
			mbfeiyang: {
				charlotte: true,
				trigger: { player: "phaseJudgeBegin" },
				filter(event, player) {
					return _status.mode != "online" && _status.mode != "binglin" && player == game.zhu && player.countCards("j") && player.countCards("h") > 1;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseToDiscard("h", 2, get.prompt(event.skill), "弃置两张手牌，然后弃置判定区里的一张牌")
						.set("logSkill", event.skill)
						.set("ai", function (card) {
							if (_status.event.goon) {
								return 7 - get.value(card);
							}
							return 0;
						})
						.set(
							"goon",
							(() => {
								if (player.hasSkillTag("rejudge")) {
									return false;
								}
								return player.hasCard(function (card) {
									if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
										return false;
									}
									return (
										get.effect(
											player,
											{
												name: card.viewAs || card.name,
												cards: [card],
											},
											player,
											player
										) < 0
									);
								}, "j");
							})()
						)
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					await player.discardPlayerCard(player, "j", true);
				},
			},
			//跋扈
			bahu: {
				charlotte: true,
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return _status.mode != "online" && _status.mode != "binglin" && player == game.zhu;
				},
				forced: true,
				content() {
					player.draw();
				},
				mod: {
					cardUsable(card, player, num) {
						if (_status.mode != "online" && _status.mode != "binglin" && player == game.zhu && card.name == "sha") {
							return num + 1;
						}
					},
				},
			},
			//殷富
			yinfu: {
				charlotte: true,
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					return player.isDamaged() && player.getDamagedHp() >= game.roundNumber;
				},
				forced: true,
				async content(event, trigger, player) {
					await player.recover();
					if (player.getAllHistory("useSkill", evt => evt.skill == event.name).length > 2) {
						await player.removeSkills(event.name);
					}
				},
			},
			//恃强·削弱
			shiqiang: {
				charlotte: true,
				enable: "phaseUse",
				filter(event, player) {
					return event.filterCard(get.autoViewAs({ name: "sha", storage: { shiqiang: true } }, "unsure"), player, event);
				},
				usable: 1,
				filterCard: true,
				position: "hes",
				viewAs: {
					name: "sha",
					storage: { shiqiang: true },
				},
				locked: false,
				precontent() {
					player.addTempSkill("shiqiang_effect");
				},
				mod: {
					targetInRange(card, player, target) {
						if (card?.storage?.shiqiang) {
							return true;
						}
					},
				},
				subSkill: {
					effect: {
						charlotte: true,
						trigger: { player: "useCardAfter" },
						filter(event, player) {
							if (event.skill === "shiqiang") {
								return !game.hasPlayer2(target => target.hasHistory("damage", evt => evt.card === event.card));
							}
							return false;
						},
						forced: true,
						popup: false,
						async content(event, trigger, player) {
							await player.loseMaxHp();
						},
					},
				},
				ai: {
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			//恃强
			oldshiqiang: {
				enable: "phaseUse",
				usable: 1,
				hiddenCard(player, name) {
					return name == "sha" && player.countCards("hes");
				},
				filter(event, player) {
					return event.filterCard(get.autoViewAs({ name: "sha", storage: { oldshiqiang: true } }, "unsure"), player, event) || lib.inpile_nature.some(nature => event.filterCard(get.autoViewAs({ name: "sha", nature, storage: { oldshiqiang: true } }, "unsure"), player, event));
				},
				chooseButton: {
					dialog(event, player) {
						var list = [];
						if (event.filterCard(get.autoViewAs({ name: "sha", storage: { oldshiqiang: true } }, "unsure"), player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (var j of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name: "sha", nature: j, storage: { oldshiqiang: true } }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", j]);
							}
						}
						var dialog = ui.create.dialog("恃强", [list, "vcard"], "hidden");
						dialog.direct = true;
						return dialog;
					},
					check(button) {
						var player = _status.event.player;
						var card = { name: button.link[2], nature: button.link[3] };
						if (
							_status.event.getParent().type == "phase" &&
							game.hasPlayer(function (current) {
								return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
							})
						) {
							switch (button.link[2]) {
								case "sha":
									if (button.link[3] == "fire") {
										return 2.95;
									} else if (button.link[3] == "thunder" || button.link[3] == "ice") {
										return 2.92;
									} else {
										return 2.9;
									}
							}
						}
						return 1 + Math.random();
					},
					backup(links, player) {
						return {
							filterCard: true,
							check(card) {
								return 6 - get.value(card);
							},
							viewAs: {
								name: links[0][2],
								nature: links[0][3],
								storage: {
									oldshiqiang: true,
								},
							},
							position: "hes",
							popname: true,
						};
					},
					prompt(links, player) {
						return "将一张牌当作" + get.translation(links[0][3] || "") + "【" + get.translation(links[0][2]) + "】使用";
					},
				},
				locked: false,
				group: ["oldshiqiang_effect"],
				mod: {
					targetInRange(card, player, target) {
						if (card?.storage?.oldshiqiang) {
							return true;
						}
					},
				},
				subSkill: {
					effect: {
						forced: true,
						locked: false,
						trigger: { player: ["useCard", "useCardAfter"] },
						filter(event, player, name) {
							if (!event.card?.storage?.oldshiqiang) {
								return false;
							}
							if (name == "useCardAfter") {
								return !player.hasHistory("sourceDamage", evt => evt.card == event.card);
							}
							return true;
						},
						async content(event, trigger, player) {
							if (event.triggername == "useCard") {
								await player.draw();
							} else {
								await player.loseMaxHp();
							}
						},
					},
				},
				ai: {
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			//强易·削弱
			qiangyi: {
				charlotte: true,
				enable: "phaseUse",
				filter(event, player) {
					return (
						player == game.zhu &&
						game.hasPlayer(function (current) {
							return lib.skill.qiangyi.filterTarget(null, player, current);
						})
					);
				},
				filterTarget(card, player, target) {
					return player != target && !player.getStorage("qiangyi_used").includes(target) && target.countGainableCards(player, "h") > 0;
				},
				async content(event, trigger, player) {
					const { target } = event;
					player.markAuto(`${event.name}_used`, target);
					const result = await player.gainPlayerCard(target, "h", true).forResult();
					if (!result?.bool || !result.cards?.length) {
						return event.finish();
					}
					const hs = player.getCards("h");
					if (hs.length) {
						let resultx;
						if (hs.length == 1) {
							resultx = { bool: true, cards: hs };
						} else {
							resultx = await player.chooseCard("h", true, `选择交给${get.translation(target)}一张手牌`).forResult();
						}
						if (resultx?.bool && resultx.cards?.length) {
							await player.give(resultx.cards, target);
						}
					}
				},
				ai: {
					order: 5,
					result: {
						player: 1,
						target: -1,
					},
				},
			},
			diqi_skill: {
				trigger: { player: "damageBegin2" },
				filter(event, player) {
					var card = player.getEquip("diqi");
					return get.itemtype(card) == "card" && lib.filter.cardDiscardable(card, player, "diqi_skill");
				},
				check(event, player) {
					return event.num >= Math.min(player.hp, 2);
				},
				prompt2(event, player) {
					return "弃置" + get.translation(player.getEquip("diqi")) + "并防止即将受到的" + get.cnNumber(event.num) + "点伤害";
				},
				content() {
					player.discard(player.getEquip("diqi"));
					trigger.cancel();
				},
				ai: {
					filterDamage: true,
					skillTagFilter(player, tag, arg) {
						if (arg && arg.player) {
							if (arg.player.hasSkillTag("jueqing", false, player)) {
								return false;
							}
						}
					},
				},
			},
			online_aozhan: {
				trigger: { player: "phaseBefore" },
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return !_status._aozhan && game.roundNumber > 10;
				},
				content() {
					var color = get.groupnature(player.group, "raw");
					if (player.isUnseen()) {
						color = "fire";
					}
					player.$fullscreenpop("鏖战模式", color);
					game.broadcastAll(function () {
						_status._aozhan = true;
						ui.aozhan = ui.create.div(".touchinfo.left", ui.window);
						ui.aozhan.innerHTML = "鏖战模式";
						if (ui.time3) {
							ui.time3.style.display = "none";
						}
						ui.aozhanInfo = ui.create.system("鏖战模式", null, true);
						lib.setPopped(
							ui.aozhanInfo,
							function () {
								var uiintro = ui.create.dialog("hidden");
								uiintro.add("鏖战模式");
								var list = ["从第11轮开始，游戏将进入〔鏖战模式〕。", "在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。"];
								var intro = '<ul style="text-align:left;margin-top:0;width:450px">';
								for (var i = 0; i < list.length; i++) {
									intro += "<li>" + list[i];
								}
								intro += "</ul>";
								uiintro.add('<div class="text center">' + intro + "</div>");
								var ul = uiintro.querySelector("ul");
								if (ul) {
									ul.style.width = "180px";
								}
								uiintro.add(ui.create.div(".placeholder"));
								return uiintro;
							},
							250
						);
						game.playBackgroundMusic();
					});
					game.removeGlobalSkill("online_aozhan");
					game.countPlayer(function (current) {
						current.addSkill("aozhan");
					});
				},
			},
			online_juzhong: {
				trigger: { global: "useCard" },
				direct: true,
				ruleSkill: true,
				filter(event, player) {
					return (
						_status.mode == "online" &&
						!event.all_excluded &&
						event.player.isFriendOf(player) &&
						event.player != player &&
						lib.skill.online_juzhong.infos[event.card.name] &&
						player.hasCard(function (card) {
							if (_status.connectMode) {
								return true;
							}
							return get.name(card, player) == event.card.name;
						}, "h")
					);
				},
				content() {
					"step 0";
					player
						.chooseToDiscard("是否响应【聚众】？", get.translation(trigger.player) + "使用了" + get.translation(trigger.card) + "。你可弃置一张名称相同的牌，令" + lib.skill.online_juzhong.infos[trigger.card.name][0], function (card, player) {
							return get.name(card, player) == _status.event.getTrigger().card.name;
						})
						.set("ai", lib.skill.online_juzhong.infos[trigger.card.name][2]).logSkill = ["_juzhong", trigger.player];
					"step 1";
					if (result.bool) {
						lib.skill.online_juzhong.infos[trigger.card.name][1]();
						if (!event.goon) {
							event.finish();
						}
					} else {
						event.finish();
					}
					"step 2";
					trigger.player
						.chooseTarget("你可选择一名角色，弃置其的一张牌", function (card, player, target) {
							return target.countDiscardableCards(player, "he") > 0;
						})
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, { name: "guohe_copy2" }, player, player);
						});
					"step 3";
					if (result.bool) {
						var target = result.targets[0];
						trigger.player.line(target, "green");
						trigger.player.discardPlayerCard(target, true, "he");
					}
				},
				infos: {
					sha: [
						"此【杀】的伤害值基数+1。",
						function () {
							var evt = _status.event._trigger;
							if (!evt.baseDamage) {
								evt.baseDamage = 1;
							}
							evt.baseDamage++;
						},
						function (card) {
							var evt = _status.event.getTrigger();
							if (!evt.targets.length) {
								return 0;
							}
							if (
								evt.targets[0].hasShan() ||
								evt.targets[0].hasSkillTag("filterDamage", null, {
									player: evt.targets[0],
									card: evt.card,
								})
							) {
								return 0;
							}
							return 1;
						},
					],
					shan: [
						"其可弃置一名角色的一张牌。",
						function () {
							_status.event.goon = true;
						},
						function (card) {
							if (
								game.zhu.countCards("he", function (card) {
									return get.value(card, game.zhu) >= 6;
								})
							) {
								return 7 - get.value(card);
							}
							if (
								game.zhu.countCards("he", function (card) {
									return get.value(card, game.zhu) > 0;
								})
							) {
								return 5 - get.value(card);
							}
							return 0;
						},
					],
					tao: [
						"其摸两张牌。",
						function () {
							_status.event._trigger.player.draw(2);
						},
						function (card) {
							return 6 - get.value(card);
						},
					],
					jiu: [
						"其本回合的伤害值或回复值+1。",
						function () {
							var player = _status.event._trigger.player;
							player.addTempSkill("juzhong_jiu");
							player.addMark("juzhong_jiu", 1, false);
						},
						function (card) {
							return 6 - get.value(card);
						},
					],
				},
				ai: {
					viewHandcard: true,
					skillTagFilter(player, tag, target) {
						if (_status.mode != "online" || player == target || player.identity != target.identity) {
							return false;
						}
					},
				},
			},
			juzhong_jiu: {
				trigger: {
					player: "recoverBegin",
					source: "damageBegin1",
				},
				forced: true,
				popup: false,
				content() {
					trigger.num += player.countMark("juzhong_jiu");
				},
				onremove: true,
				intro: { content: "本回合的伤害值和回复值+#" },
			},
			online_zhadan_button: {
				trigger: {
					global: "gameDrawAfter",
					player: ["gainEnd", "loseEnd"],
				},
				firstDo: true,
				forced: true,
				charlotte: true,
				popup: false,
				silent: true,
				filter(event, player) {
					if (_status.mode != "online" || (player != game.me && !player.isOnline())) {
						return;
					}
					if (event.name != "lose") {
						return !player.hasZhadan && player.countCards("hs", "zhadan") > 0;
					}
					return player.hasZhadan && !player.countCards("hs", "zhadan");
				},
				content() {
					if (!player.hasZhadan) {
						player.hasZhadan = true;
						if (player == game.me) {
							lib.skill.online_zhadan_button.initZhadan();
						} else {
							player.send(function () {
								lib.skill.online_zhadan_button.initZhadan();
							});
						}
					} else {
						delete player.hasZhadan;
						if (player == game.me) {
							lib.skill.online_zhadan_button.removeZhadan();
						} else {
							player.send(function () {
								lib.skill.online_zhadan_button.removeZhadan();
							});
						}
					}
				},
				initZhadan() {
					ui.zhadan_button = ui.create.control("激活炸弹", "stayleft", function () {
						if (this.classList.contains("hidden")) {
							return;
						}
						this.classList.toggle("glow");
						if (this.classList.contains("glow") && _status.event.type == "zhadan" && _status.event.isMine() && ui.confirm && _status.imchoosing) {
							ui.click.cancel(ui.confirm.lastChild);
						}
					});
				},
				removeZhadan() {
					if (ui.zhadan_button) {
						ui.zhadan_button.remove();
						delete ui.zhadan_button;
					}
				},
			},
			online_zhadan: {
				trigger: { player: "useCard" },
				priority: 5,
				popup: false,
				forced: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current.hasCard(function (card) {
							if (get.name(card) != "zhadan") {
								return false;
							}
							return lib.filter.cardEnabled(card, player, "forceEnable");
						}, "hs");
					});
				},
				forceLoad: true,
				content() {
					"step 0";
					event.source = trigger.player;
					event.card = trigger.card;
					event.targets = trigger.targets;
					event._global_waiting = true;
					event.filterCard = function (card, player) {
						if (get.name(card) != "zhadan" || get.itemtype(card) != "card") {
							return false;
						}
						return lib.filter.cardEnabled(card, player, "forceEnable");
					};
					event.send = function (player, card, source, targets, id, id2, skillState) {
						if (skillState) {
							player.applySkills(skillState);
						}
						if (player == game.me && ui.zhadan_button && !ui.zhadan_button.classList.contains("glow")) {
							_status.event._result = { bool: false };
							if (game.online) {
								_status.event._resultid = id;
								game.resume();
							}
							return;
						}
						var str = get.translation(source);
						if (targets && targets.length) {
							str += "对" + get.translation(targets);
						}
						str += "使用了";
						str += get.translation(card);
						str += "，是否对其使用【炸弹】？";

						var next = player.chooseToUse({
							filterCard(card, player) {
								if (get.name(card) != "zhadan" || get.itemtype(card) != "card") {
									return false;
								}
								return lib.filter.cardEnabled(card, player, "forceEnable");
							},
							prompt: str,
							_global_waiting: true,
							ai1(card) {
								var evt = _status.event.getParent("_zhadan")._trigger,
									player = _status.event.player;
								if (!evt) {
									return 0;
								}
								if (get.attitude(player, evt.player) > 0) {
									return 0;
								}
								var eff = 0;
								if (!targets.length) {
									return Math.random() - 0.5;
								}
								for (var i of targets) {
									eff -= get.effect(i, evt.card, evt.player, player);
								}
								return eff - 8;
							},
							source: source,
							source2: targets,
							id: id,
							id2: id2,
							type: "zhadan",
						});
						next.set("respondTo", [source, card]);

						if (game.online) {
							_status.event._resultid = id;
							game.resume();
						} else {
							next.nouse = true;
						}
					};
					"step 1";
					var list = game.filterPlayer(function (current) {
						return current.hasCard(function (card) {
							if (get.name(card) != "zhadan") {
								return false;
							}
							return lib.filter.cardEnabled(card, player, "forceEnable");
						}, "hs");
					});
					event.list = list;
					event.id = get.id();
					list.sort(function (a, b) {
						return get.distance(event.source, a, "absolute") - get.distance(event.source, b, "absolute");
					});
					"step 2";
					if (event.list.length == 0) {
						event.finish();
					} else if (_status.connectMode && (event.list[0].isOnline() || event.list[0] == game.me)) {
						event.goto(4);
					} else {
						event.current = event.list.shift();
						event.send(event.current, event.card, event.source, event.targets, event.id, trigger.parent.id);
					}
					"step 3";
					if (result.bool) {
						event.zhadanresult = event.current;
						event.zhadanresult2 = result;
						if (event.current != game.me && !event.current.isOnline()) {
							game.delayx();
						}
						event.goto(8);
					} else {
						event.goto(2);
					}
					"step 4";
					var id = event.id;
					var sendback = function (result, player) {
						if (result && result.id == id && !event.zhadanresult && result.bool) {
							event.zhadanresult = player;
							event.zhadanresult2 = result;
							game.broadcast("cancel", id);
							if (_status.event.id == id && _status.event.name == "chooseToUse" && _status.paused) {
								return function () {
									event.resultOL = _status.event.resultOL;
									ui.click.cancel();
									if (ui.confirm) {
										ui.confirm.close();
									}
								};
							}
						} else {
							if (_status.event.id == id && _status.event.name == "chooseToUse" && _status.paused) {
								return function () {
									event.resultOL = _status.event.resultOL;
								};
							}
						}
					};

					var withme = false;
					var withol = false;
					var list = event.list;
					for (var i = 0; i < list.length; i++) {
						if (list[i].isOnline()) {
							withol = true;
							list[i].wait(sendback);
							list[i].send(event.send, list[i], event.card, event.source, event.targets, event.id, trigger.parent.id, get.skillState(list[i]));
							list.splice(i--, 1);
						} else if (list[i] == game.me) {
							withme = true;
							event.send(list[i], event.card, event.source, event.targets, event.id, trigger.parent.id);
							list.splice(i--, 1);
						}
					}
					if (!withme) {
						event.goto(6);
					}
					if (_status.connectMode) {
						if (withme || withol) {
							for (var i = 0; i < game.players.length; i++) {
								game.players[i].showTimer();
							}
						}
					}
					event.withol = withol;
					"step 5";
					if (result && result.bool && !event.zhadanresult) {
						game.broadcast("cancel", event.id);
						event.zhadanresult = game.me;
						event.zhadanresult2 = result;
					}
					"step 6";
					if (event.withol && !event.resultOL) {
						game.pause();
					}
					"step 7";
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].hideTimer();
					}
					"step 8";
					if (event.zhadanresult) {
						event.zhadanresult.$fullscreenpop("炸弹", get.groupnature(event.zhadanresult));
						var next = event.zhadanresult.useResult(event.zhadanresult2);
						next.respondTo = [trigger.player, trigger.card];
						game.bonusNum *= 2;
						game.updateRoundNumber();
					}
				},
			},
		},
		card: {
			baiyidujiang: {
				fullskin: true,
				enable: true,
				filterTarget(card, player, target) {
					return target == game.zhu;
				},
				selectTarget: -1,
				type: "trick",
				content() {
					"step 0";
					if (!player.isIn() || !target.isIn()) {
						event.finish();
						return;
					}
					var num1 = 0,
						num2 = Infinity,
						str = get.translation(target);
					game.countPlayer(function (current) {
						var num = current.countCards("h");
						if (num > num1) {
							num1 = num;
						}
						if (num < num2) {
							num2 = num;
						}
					});
					var num = target.countCards("h"),
						choices = [];
					event.addIndex = 0;
					if (num < num1) {
						choices.push("令" + str + "将手牌摸至" + get.cnNumber(num1) + "张");
						event.num1 = num1;
					} else {
						event.addIndex++;
					}
					if (num > num2) {
						choices.push("令" + str + "将手牌弃置至" + get.cnNumber(num2) + "张");
						event.num2 = num2;
					}
					if (!choices.length) {
						event.finish();
					} else if (choices.length == 1) {
						event._result = { index: 0 };
					} else {
						player
							.chooseControl()
							.set("choiceList", choices)
							.set("ai", function () {
								var evt = _status.event.getParent();
								return get.attitude(evt.player, evt.target) > 0 ? 0 : 1;
							});
					}
					"step 1";
					if (result.index + event.addIndex == 0) {
						target.drawTo(event.num1);
					} else {
						target.chooseToDiscard(true, "h", target.countCards("h") - event.num2, "allowChooseAll");
					}
				},
				ai: {
					order: 6,
					value: 4,
					useful: 2,
					tag: {
						draw: 1,
						loseCard: 1,
					},
					result: {
						target(player, target, card, isLink) {
							var num1 = 0,
								num2 = Infinity,
								str = get.translation(target);
							game.countPlayer(function (current) {
								var num = current.countCards("h", function (cardx) {
									if (ui.selected.cards.includes(cardx)) {
										return false;
									}
									if (card.cards && card.cards.includes(cardx)) {
										return false;
									}
									return true;
								});
								if (num > num1) {
									num1 = num;
								}
								if (num < num2) {
									num2 = num;
								}
							});
							var num = target.countCards("h", function (cardx) {
								if (ui.selected.cards.includes(cardx)) {
									return false;
								}
								if (card.cards && card.cards.includes(cardx)) {
									return false;
								}
								return true;
							});
							if (num1 > num) {
								if (get.attitude(player, target) > 0) {
									return (num1 - num) / 1.2;
								}
							}
							if (num2 < num) {
								if (get.attitude(player, target) > 0) {
									return (num2 - num) / 1.2;
								}
							}
							return 0;
						},
					},
				},
			},
			luojingxiashi: {
				fullskin: true,
				enable: true,
				type: "trick",
				selectTarget: -1,
				filterTarget(card, player, target) {
					return target != player && target.isDamaged();
				},
				content() {
					target.damage();
				},
				ai: {
					order: 3,
					value: 4,
					useful: 2,
					tag: {
						loseCard: 1,
					},
					result: {
						target: -1.5,
					},
				},
			},
			binglinchengxia: {
				fullskin: true,
				type: "delay",
				filterTarget(card, player, target) {
					return lib.filter.judge(card, player, target) && player != target;
				},
				judge(card) {
					if (get.suit(card) == "diamond") {
						return 0;
					}
					return -3;
				},
				effect() {
					"step 0";
					if (result.bool == false) {
						if (
							!player.countCards("e", function (card) {
								return lib.filter.cardDiscardable(card, player, "shuiyanqijuny");
							})
						) {
							player.damage("nosource");
							event.finish();
							return;
						} else {
							player.chooseControl("discard_card", "take_damage", function (event, player) {
								if (get.damageEffect(player, event.player, player) >= 0) {
									return "take_damage";
								}
								if (player.hp >= 3 && player.countCards("e") >= 2) {
									return "take_damage";
								}
								return "discard_card";
							});
						}
					} else {
						event.finish();
					}
					"step 1";
					if (result.control == "discard_card") {
						player.discard(
							player.getCards("e", function (card) {
								return lib.filter.cardDiscardable(card, player, "shuiyanqijuny");
							})
						);
					} else {
						player.damage("nosource");
					}
				},
				ai: {
					order: 1,
					value: 3,
					useful: 2,
					tag: {
						damage: 1,
						loseCard: 1,
					},
					result: {
						target(player, target, card, isLink) {
							var es = target.getCards("e");
							if (!es.length) {
								return -1.5;
							}
							var val = 0;
							for (var i of es) {
								val += get.value(i, target);
							}
							return -Math.min(1.5, val / 5);
						},
					},
				},
			},
			toushiche: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -3 },
				ai: {
					basic: {
						equipValue: 2.5,
					},
				},
				skills: ["toushiche_skill"],
			},
			gongshoujianbei: {
				fullskin: true,
				type: "trick",
			},
			jintuiziru: {
				fullskin: true,
				type: "trick",
			},
			diqi: {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				cardcolor: "club",
				skills: ["diqi_skill"],
				destroy: "diqi_skill",
				ai: {
					basic: {
						equipValue: 6,
					},
				},
			},
			zhadan: {
				audio: true,
				fullskin: true,
				type: "trick",
				ai: {
					basic: {
						useful: [6, 4],
						value: [6, 4],
					},
					result: { player: 1 },
				},
				notarget: true,
				content() {
					var evt = event.getParent(2)._trigger;
					evt.targets.length = 0;
					evt.all_excluded = true;
					game.log(evt.card, "的效果被炸弹抵消了");
				},
			},
			jiwangkailai: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable(card, player) {
					var hs = player.getCards("h", function (cardx) {
						return cardx != card && (!card.cards || !card.cards.includes(cardx));
					});
					if (!hs.length) {
						return false;
					}
					var use = true,
						discard = true;
					for (var i of hs) {
						if (use && !game.checkMod(i, player, "unchanged", "cardEnabled2", player)) {
							use = false;
						}
						if (discard && !lib.filter.cardDiscardable(i, player, "jiwangkailai")) {
							discard = false;
						}
						if (!use && !discard) {
							return false;
						}
					}
					return true;
				},
				selectTarget: -1,
				toself: true,
				filterTarget(card, player, target) {
					return target == player;
				},
				modTarget: true,
				content() {
					"step 0";
					var hs = player.getCards("h");
					if (hs.length) {
						var use = true,
							discard = true;
						for (var i of hs) {
							if (use && !game.checkMod(i, player, "unchanged", "cardEnabled2", player)) {
								use = false;
							}
							if (discard && !lib.filter.cardDiscardable(i, player, "jiwangkailai")) {
								discard = false;
							}
							if (!use && !discard) {
								break;
							}
						}
						if (use && discard) {
							player
								.chooseControl()
								.set("prompt", "继往开来：请选择一项")
								.set("choiceList", ["弃置所有手牌，然后摸等量的牌", "将所有手牌当做一张普通锦囊牌使用"])
								.set("ai", function () {
									if (_status.event.player.countCards("h") > 2) {
										return 0;
									}
									return 1;
								});
						} else if (use) {
							event._result = { index: 1 };
						} else if (discard) {
							event._result = { index: 0 };
						} else {
							event.finish();
						}
					} else {
						event.finish();
					}
					"step 1";
					var cards = player.getCards("h");
					if (result.index == 0) {
						player.discard(cards);
						player.draw(cards.length);
						event.finish();
					} else {
						var list = [];
						for (var i of lib.inpile) {
							if (i != "jiwangkailai" && get.type(i) == "trick" && lib.filter.filterCard({ name: i, cards: cards }, player)) {
								list.push(["锦囊", "", i]);
							}
						}
						if (list.length) {
							player.chooseButton(["继往开来：选择要使用的牌", [list, "vcard"]], true).set("ai", function (button) {
								var player = _status.event.player;
								return player.getUseValue({
									name: button.link[2],
									cards: player.getCards("h"),
								});
							});
						} else {
							event.finish();
						}
					}
					"step 2";
					if (result.bool) {
						player.chooseUseTarget({ name: result.links[0][2] }, player.getCards("h"), true);
					}
				},
				ai: {
					basic: {
						order: 0.5,
						useful: 3,
						value: 5,
					},
					result: {
						target(player, target) {
							if (
								target.needsToDiscard(1) ||
								!target.countCards("h", function (card) {
									return get.value(card, player) >= 5.5;
								})
							) {
								return 1;
							}
							return 0;
						},
					},
					tag: {
						draw: 2,
					},
				},
			},
		},
		characterOnline: {
			wei: ["re_caocao", "re_guojia", "re_simayi", "re_xiahoudun", "xuzhu", "re_zhangliao", "re_zhenji", "ol_xiahouyuan", "dianwei", "re_xunyu", "zhanghe", "yujin_yujin", "re_caozhang", "wangyi", "guohuai", "hanhaoshihuan", "chenqun", "re_caoxiu", "guohuanghou", "sunziliufang", "xunyou", "xinxianying", "sp_caiwenji", "caoang", "caochun", "caohong", "sp_caoren", "chenlin", "sp_jiaxu", "litong", "sp_pangde", "simalang", "wanglang", "kuailiangkuaiyue", "wangji", "sp_simazhao", "sp_wangyuanji", "yuejin", "zangba", "xinpi", "liuye", "simashi", "zhuling", "duji", "caoanmin"],
			shu: ["re_guanyu", "re_huangyueying", "re_liubei", "re_machao", "re_zhangfei", "zhaoyun", "re_huangzhong", "re_weiyan", "re_pangtong", "ol_sp_zhugeliang", "re_menghuo", "re_zhurong", "re_fazheng", "re_masu", "xin_liaohua", "old_madai", "re_jianyong", "wuyi", "zhangsong", "zhoucang", "liuchen", "xiahoushi", "re_zhangyi", "liyan", "guanyinping", "guansuo", "mayunlu", "mazhong", "mizhu", "sunqian", "xiahouba", "zhangxingcai", "wangping", "yanyan", "chendao", "ganfuren", "re_maliang", "dengzhi", "lifeng", "zhangyì"],
			wu: ["re_ganning", "re_huanggai", "re_sunquan", "re_sunshangxiang", "re_zhouyu", "old_zhoutai", "re_xiaoqiao", "re_taishici", "sunjian", "re_zhangzhang", "re_lingtong", "re_wuguotai", "xin_xusheng", "re_bulianshi", "re_chengpu", "handang", "xin_panzhangmazhong", "xin_zhuran", "guyong", "zhuhuan", "cenhun", "sundeng", "xuezong", "daxiaoqiao", "heqi", "kanze", "sunhao", "re_sunluyu", "sunshao", "zhugejin", "zumao", "dingfeng", "sunliang", "zhoufei", "weiwenzhugezhi", "xf_sufei", "xugong", "lingcao", "sunru", "lvdai", "panjun", "yanjun", "zhoufang"],
			qun: ["re_diaochan", "re_gongsunzan", "re_huatuo", "re_huaxiong", "re_lvbu", "ol_pangde", "re_yanwen", "jiaxu", "gaoshun", "xin_liubiao", "chengong", "re_gongsunyuan", "guotufengji", "dongbai", "fuwan", "liuxie", "sp_machao", "tadun", "yanbaihu", "yuanshu", "zhangbao", "yl_luzhi", "huangfusong", "sp_ganning", "huangjinleishi", "re_panfeng", "guosi", "sp_liuqi", "mangyachang", "gaolan", "lvkuanglvxiang", "xunchen", "sp_zhanghe", "re_hansui", "re_hejin", "zhujun", "ol_dingyuan", "hanfu", "wangrong", "dongcheng", "gongsunkang", "hucheer", "sp_sufei", "yj_xuhuang", "yj_zhanghe", "yj_zhangliao", "liuyao", "wangcan", "sp_taishici", "caimao", "jiling"],
			key: ["sp_key_yuri", "key_akane", "key_akiko", "key_ao", "key_harukakanata", "key_haruko", "key_hinata", "key_kengo", "key_komari", "key_kotori", "key_kyoko", "key_nagisa", "key_noda", "key_rei", "key_rin", "key_rumi", "key_ryoichi", "key_sasami", "key_shiorimiyuki", "key_shiroha", "key_shizuku", "key_tomoya", "key_tsumugi", "key_umi", "key_yoshino", "key_youta", "key_yukine", "key_nao", "key_misuzu"],
		},
		online_cardPile: [
			["spade", 1, "guding"],
			["spade", 1, "zhadan"],
			["spade", 2, "tengjia"],
			["spade", 2, "cixiong"],
			["spade", 3, "jiu"],
			["spade", 3, "guohe"],
			["spade", 4, "sha", "thunder"],
			["spade", 4, "guohe"],
			["spade", 5, "sha", "thunder"],
			["spade", 5, "qinglong"],
			["spade", 6, "sha", "thunder"],
			["spade", 6, "jiwangkailai"],
			["spade", 7, "sha", "thunder"],
			["spade", 7, "jintuiziru"],
			["spade", 8, "sha", "thunder"],
			["spade", 8, "sha"],
			["spade", 9, "jiu"],
			["spade", 9, "sha"],
			["spade", 10, "gongshoujianbei"],
			["spade", 10, "sha"],
			["spade", 11, "tiesuo"],
			["spade", 11, "shunshou"],
			["spade", 12, "tiesuo"],
			["spade", 12, "zhangba"],
			["spade", 13, "wuxie"],
			["spade", 13, "dawanma"],

			["club", 1, "baiyin"],
			["club", 1, "zhuge"],
			["club", 2, "tengjia"],
			["club", 2, "bagua"],
			["club", 3, "jiu"],
			["club", 3, "sha"],
			["club", 4, "jintuiziru"],
			["club", 4, "sha"],
			["club", 5, "sha", "thunder"],
			["club", 5, "dilu"],
			["club", 6, "sha", "thunder"],
			["club", 6, "sha"],
			["club", 7, "sha", "thunder"],
			["club", 7, "sha"],
			["club", 8, "sha", "thunder"],
			["club", 8, "sha"],
			["club", 9, "jiu"],
			["club", 9, "sha"],
			["club", 10, "tiesuo"],
			["club", 10, "sha"],
			["club", 11, "tiesuo"],
			["club", 11, "sha"],
			["club", 12, "tiesuo"],
			["club", 12, "wuxie"],
			["club", 13, "tiesuo"],
			["club", 13, "jiedao"],
			["club", 13, "wuxie"],

			["heart", 1, "wuxie"],
			["heart", 1, "gongshoujianbei"],
			["heart", 1, "zhadan"],
			["heart", 2, "huogong"],
			["heart", 2, "shan"],
			["heart", 3, "huogong"],
			["heart", 3, "wuzhong"],
			["heart", 4, "sha", "fire"],
			["heart", 4, "tao"],
			["heart", 5, "tao"],
			["heart", 5, "chitu"],
			["heart", 6, "tao"],
			["heart", 6, "jiwangkailai"],
			["heart", 7, "sha", "fire"],
			["heart", 7, "tao"],
			["heart", 8, "shan"],
			["heart", 8, "wuzhong"],
			["heart", 9, "shan"],
			["heart", 9, "tao"],
			["heart", 10, "sha", "fire"],
			["heart", 10, "sha"],
			["heart", 11, "shan"],
			["heart", 11, "wuzhong"],
			["heart", 12, "shan"],
			["heart", 12, "guohe"],
			["heart", 13, "wuxie"],
			["heart", 13, "zhuahuang"],

			["diamond", 1, "zhuque"],
			["diamond", 1, "juedou"],
			["diamond", 2, "tao"],
			["diamond", 2, "shan"],
			["diamond", 3, "tao"],
			["diamond", 3, "shan"],
			["diamond", 4, "sha", "fire"],
			["diamond", 4, "shunshou"],
			["diamond", 5, "sha", "fire"],
			["diamond", 5, "guanshi"],
			["diamond", 6, "shan"],
			["diamond", 6, "sha"],
			["diamond", 7, "shan"],
			["diamond", 7, "shan"],
			["diamond", 8, "shan"],
			["diamond", 8, "shan"],
			["diamond", 9, "jiu"],
			["diamond", 9, "shan"],
			["diamond", 10, "shan"],
			["diamond", 10, "sha"],
			["diamond", 11, "shan"],
			["diamond", 11, "shan"],
			["diamond", 12, "huogong"],
			["diamond", 12, "tao"],
			["diamond", 13, "xiliu"],
			["diamond", 13, "sha"],
			["diamond", 13, "wuxie"],
		],
		help: {
			斗地主: '<div style="margin:10px">游戏规则</div><ul style="margin-top:0"><li>游戏人数<br>游戏人数为3人（地主x1 + 农民x2）。<li>胜利条件<br>农民：地主死亡。<br>地主：所有农民死亡且自己存活。' + "<li>死亡奖惩<br>当有农民死亡时，若另一名农民存活，则其可以选择摸两张牌或回复1点体力。<li>地主专属技能<br>地主可以使用专属技能〖飞扬〗和〖跋扈〗。<br>〖飞扬〗判定阶段开始时，若你的判定区有牌，则你可以弃置两张手牌，然后弃置你判定区的一张牌。每回合限一次。<br>〖跋扈〗锁定技，准备阶段开始时，你摸一张牌。出牌阶段，你可以多使用一张【杀】。</ul>",
		},
	};
};
