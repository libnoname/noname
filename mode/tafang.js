import { lib, game, ui, get, ai, _status } from "noname";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "tafang",
		canvasUpdates2: [],
		start() {
			"step 0";
			_status.gameDrawed = true;
			lib.init.css(lib.assetURL + "layout/mode", "chess");
			lib.init.css(lib.assetURL + "layout/mode", "tafang");
			game.loadMode("chess");
			"step 1";
			if (get.is.phoneLayout() && lib.config.touchscreen && !lib.config.show_round_menu && !["system", "menu"].includes(lib.config.swipe_left) && !["system", "menu"].includes(lib.config.swipe_right) && !["system", "menu"].includes(lib.config.swipe_up)) {
				ui.roundmenu.style.display = "";
			}
			if (lib.config.player_border == "normal" && (lib.config.layout == "long" || lib.config.layout == "long2")) {
				ui.arena.classList.add("lslim_player");
			}
			for (var i in result.element) {
				for (var j in result.element[i]) {
					if (j != "dieAfter") {
						lib.element[i][j] = result.element[i][j];
					}
				}
			}
			for (var i in result.ui) {
				for (var j in result.ui[i]) {
					ui[i][j] = result.ui[i][j];
				}
			}
			get.chessDistance = result.get.chessDistance;
			get.rawAttitude = result.get.rawAttitude;
			var toLoad = ["addChessPlayer", "addObstacle", "removeObstacle", "isChessNeighbour", "draw2", "updateCanvas2", "setChessInfo", "modeSwapPlayer", "initChess"];
			for (var i = 0; i < toLoad.length; i++) {
				game[toLoad[i]] = result.game[toLoad[i]];
			}
			toLoad = ["_attackmove", "_phasequeue", "_chessmove", "_chesscenter", "_tempobstacle"];
			for (var i = 0; i < toLoad.length; i++) {
				lib.skill[toLoad[i]] = result.skill[toLoad[i]];
			}
			ui.placeChess = result.ui.placeChess;
			ui.click.moveContainer = result.ui.click.moveContainer;
			for (var i in lib.skill) {
				if (lib.skill[i].seatRelated === true) {
					lib.skill[i] = {};
					if (lib.translate[i + "_info"]) {
						lib.translate[i + "_info"] = "此模式下不可用";
					}
				}
			}
			// if(!localStorage.getItem(lib.configprefix+'playback')){
			//     game.loadMap();
			// }
			"step 2";
			var result = "basic_medium";
			_status.map = lib.tafang.map[result];
			_status.mapname = result;
			ui.chesssheet = document.createElement("style");
			document.head.appendChild(ui.chesssheet);
			var playback = localStorage.getItem(lib.configprefix + "playback");
			lib.mechlist = [];
			for (var i in lib.characterPack.mode_tafang) {
				if (i.indexOf("tafang_mech_") == 0) {
					lib.characterPack.mode_tafang[i][3].push(i + "_skill");
					lib.mechlist.push(i);
				}
				lib.character[i] = lib.characterPack.mode_tafang[i];
			}
			ui.create.cardsAsync();
			game.finishCards();
			game.addGlobalSkill("autoswap");
			ui.chessContainer = ui.create.div("#chess-container", ui.arena);
			ui.chessContainer.move = ui.click.moveContainer;
			ui.chessContainer.chessLeft = 0;
			ui.chessContainer.chessTop = 0;
			// lib.setScroll(ui.chessContainer);
			ui.chess = ui.create.div("#chess", ui.chessContainer);
			ui.canvas2 = document.createElement("canvas");
			ui.canvas2.id = "canvas2";
			ui.chess.appendChild(ui.canvas2);
			ui.ctx2 = ui.canvas2.getContext("2d");
			game.me = ui.create.player();
			if (playback) {
				for (var i in lib.characterPack) {
					for (var j in lib.characterPack[i]) {
						lib.character[j] = lib.character[j] || lib.characterPack[i][j];
					}
				}
				game.pause();
				ui.system.style.display = "none";
				_status.playback = playback;
				localStorage.removeItem(lib.configprefix + "playback");
				var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
				store.get(parseInt(playback)).onsuccess = function (e) {
					if (e.target.result) {
						event.video = e.target.result.video;
						game.resume();
					} else {
						alert("播放失败：找不到录像");
						game.reload();
					}
				};
			}
			_status.mylist = [];
			_status.enemylist = [];
			"step 3";
			ui.arena.classList.add("chess");
			if (event.video) {
				for (var ii = 0; ii < event.video.length; ii++) {
					if (event.video[ii].type == "init") {
						_status.mapname = event.video[ii].content;
						break;
					}
				}
				_status.map = lib.tafang.map[_status.mapname];
				game.playerMap = lib.posmap;
			}
			ui.chesswidth = _status.map.size[0];
			ui.chessheight = _status.map.size[1];
			game.initChess();

			var grids = [];
			var gridnum = ui.chessheight * ui.chesswidth;
			for (var i = 0; i < gridnum; i++) {
				grids.push(i);
			}
			event.obs = [];
			if (!event.video) {
				var tafanglist = [0, 2, 3, 5, 6, 8, 9, 11, 12];
				for (var i = 0; i < ui.chessheight - 1; i++) {
					for (var j = 0; j < ui.chesswidth; j++) {
						if (i >= 8 && j != 0 && j != ui.chesswidth - 1) {
							continue;
						}
						if (tafanglist.includes(j)) {
							var cg = i * ui.chesswidth + j;
							grids.remove(cg);
							game.addObstacle(cg.toString(), false);
							event.obs.push(cg.toString());
						}
					}
				}
				for (var i = 0; i < ui.chesswidth; i++) {
					switch (ui.chesswidth) {
						case 6:
							if (i == 2 || i == 3) {
								continue;
							}
							break;
						case 9:
							if (i == 3 || i == 4 || i == 5) {
								continue;
							}
							break;
						case 12:
							if (i == 4 || i == 5 || i == 6 || i == 7) {
								continue;
							}
							break;
					}
					var cg = (ui.chessheight - 1) * ui.chesswidth + i;
					grids.remove(cg);
					game.addObstacle(cg.toString(), false);
					event.obs.push(cg.toString());
				}
			}

			if (lib.config.show_handcardbutton) {
				lib.setPopped(
					ui.create.system("手牌", null, true),
					function () {
						var uiintro = ui.create.dialog("hidden");
						var added = false;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].side == game.me.side && game.players[i] != game.me) {
								added = true;
								uiintro.add(get.translation(game.players[i]));
								var cards = game.players[i].getCards("h");
								if (cards.length) {
									uiintro.addSmall(cards, true);
								} else {
									uiintro.add("（无）");
								}
							}
						}
						if (!added) {
							uiintro.add("无队友");
						}
						return uiintro;
					},
					220
				);
			}

			ui.create.me();
			ui.create.fakeme();

			ui.chessinfo = ui.create.div(".fakeme.player", ui.me, function (e) {
				e.stopPropagation();
			});
			ui.create.div(ui.chessinfo);
			lib.setScroll(ui.chessinfo.firstChild);

			game.arrangePlayers();
			"step 4";
			ui.control.style.display = "";
			if (event.video) {
				game.playVideoContent(event.video);
				game.setChessInfo();
				return;
			}
			_status.videoInited = true;
			game.addVideo("init", null, _status.mapname);
			if (game.friendZhu) {
				game.addVideo("identityText", game.friendZhu, "将");
				game.addVideo("identityText", game.enemyZhu, "帅");
				if (game.friendViceZhu) {
					game.addVideo("identityText", game.friendViceZhu, "仕");
					game.addVideo("identityText", game.enemyViceZhu, "士");
				}
			}
			if (event.obs) {
				game.addVideo("initobs", null, event.obs);
			}

			ui.me.querySelector(".fakeme.player").hide();
			ui.me.querySelector(".fakeme.avatar").hide();

			var list = [];
			for (i in lib.character) {
				if (i.indexOf("treasure_") == 0) {
					continue;
				}
				if (i.indexOf("tafang_mech_") == 0) {
					continue;
				}
				if (lib.character[i].isMinskin) {
					continue;
				}
				if (lib.config.forbidchess.includes(i)) {
					continue;
				}
				if (lib.character[i].isBoss) {
					continue;
				}
				if (lib.filter.characterDisabled(i)) {
					continue;
				}
				list.push(i);
			}
			list.randomSort();
			_status.characterList = list;
			_status.friends = [];
			_status.enemies = [];
			_status.turnCount = 0;
			_status.turnTotal = parseInt(get.config("tafang_turn"));
			ui.turnCount = ui.create.system("", null, true);
			_status.remainingCount = 0;

			_status.tafangend = [];
			for (var i = 0; i < ui.chesswidth; i++) {
				var tafangdes = ui.chesswidth * (ui.chessheight - 1) + i;
				if (!lib.posmap[tafangdes]) {
					_status.tafangend.push(tafangdes.toString());
				}
			}
			lib.init.onfree();
			event.trigger("gameStart");
			game.phaseLoopTafang();
		},
		element: {
			content: {
				chessMechRemove: function () {
					game.treasures.remove(player);
					setTimeout(function () {
						player.delete();
					}, 500);
					delete lib.posmap[player.dataset.position];
					game.addVideo("deleteChessPlayer", player);
					game.addObstacle(player.dataset.position);
					game.log(get.translation(player) + "使用期限已到");
				},
			},
			player: {
				dieAfter2: function () {
					var player = this;
					delete lib.posmap[player.dataset.position];
					setTimeout(function () {
						player.delete();
					}, 500);
					for (var i = 0; i < ui.phasequeue.length; i++) {
						if (ui.phasequeue[i].link == player) {
							ui.phasequeue[i].remove();
							ui.phasequeue.splice(i, 1);
							break;
						}
					}
				},
				dieAfter: function (source) {
					var player = this;
					if (_status.friends) {
						_status.friends.remove(this);
					}
					if (_status.enemies) {
						_status.enemies.remove(this);
					}
					if (player == game.me) {
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].side == player.side) {
								game.modeSwapPlayer(game.players[i]);
							}
						}
					}
					if (_status.friends.length == 0) {
						ui.fakeme.hide();
						this.node.handcards1.delete();
						this.node.handcards2.delete();
						game.me = ui.create.player();
						game.me.side = false;
						game.addVideo("removeTafangPlayer");
					}
				},
			},
		},
		tafang: {
			map: {
				basic_small: {
					name: "小型战场",
					size: [6, 11],
					obstacle: [],
				},
				basic_medium: {
					name: "中型战场",
					size: [9, 11],
				},
				basic_large: {
					name: "大型战场",
					size: [12, 11],
				},
			},
		},
		game: {
			minskin: true,
			singleHandcard: true,
			chess: true,
			treasures: [],
			obstacles: [],
			getVideoName: function () {
				return [get.translation(game.me.name), "塔防模式"];
			},
			addOverDialog: function (dialog) {
				dialog.classList.add("center");
			},
			phaseLoopTafang: function () {
				var next = game.createEvent("phaseLoop");
				next.setContent(function () {
					"step 0";
					delete _status.roundStart;
					_status.turnCount++;
					_status.remainingCount -= _status.friends.length;
					ui.turnCount.innerHTML = "回合" + get.cnNumber(_status.turnCount, true);
					var dialog = ui.create.dialog("剩余行动点：" + (10 + _status.remainingCount), "hidden");
					dialog.style.height = "260px";
					dialog.style.maxHeight = "260px";
					dialog.style.top = "calc(50% - 160px)";
					dialog.classList.add("center");
					dialog.classList.add("noupdate");
					dialog.classList.add("fixed");
					event.dialog = dialog;
					var list = _status.characterList.splice(0, 6);
					list.sort(function (a, b) {
						return get.rank(a, true) - get.rank(b, true);
					});
					var map = {};
					var mechlist = lib.mechlist.randomGets(6);
					mechlist.sort(function (a, b) {
						return lib.character[a][5] - lib.character[b][5];
					});
					map.bufang = ui.create.buttons(mechlist, "character", dialog.content);
					var difficulty = parseInt(get.config("tafang_difficulty"));
					for (var i = 0; i < map.bufang.length; i++) {
						var button = map.bufang[i];
						// button.node.name.style.top='8px';
						button.node.intro.classList.add("showintro");
						button.node.intro.classList.add("tafang");
						button.count = difficulty + lib.character[button.link][5] - 2;
						button.node.intro.innerHTML = get.cnNumber(button.count, true);
						button._link = "布防";
					}
					map.zhaomu = ui.create.buttons(list, "character", dialog.content);
					for (var i = 0; i < map.zhaomu.length; i++) {
						var button = map.zhaomu[i];
						if (lib.config.buttoncharacter_style == "default") {
							button.node.group.style.display = "none";
						}
						button.node.intro.classList.add("showintro");
						button.node.intro.classList.add("tafang");
						button.count = difficulty + get.rank(button.link, 3.9) + 3;
						button.node.intro.innerHTML = get.cnNumber(button.count, true);
						button._link = "招募";
					}
					if (_status.friends.length) {
						map.xingdong = ui.create.buttons(_status.friends, "player", dialog.content);
						for (var i = 0; i < map.xingdong.length; i++) {
							var button = map.xingdong[i];
							button.node.intro.classList.add("showintro");
							button.node.intro.classList.add("tafang");
							if (difficulty < 2) {
								button.count = 1;
							} else {
								button.count = 2;
							}
							button.node.intro.innerHTML = get.cnNumber(button.count, true);
							button._link = "行动";
						}
					} else {
						map.xingdong = [];
					}
					var updateSelected = function () {
						var count = 10 + _status.remainingCount;
						var selected = dialog.querySelectorAll(".button.selected");
						var selectedZhaomu = 0;
						for (var i = 0; i < selected.length; i++) {
							count -= selected[i].count;
							if (selected[i]._link == "招募") {
								selectedZhaomu++;
							}
						}
						for (var i in map) {
							for (var j = 0; j < map[i].length; j++) {
								map[i][j].classList.remove("unselectable");
								map[i][j].classList.add("pointerdiv");
								if (map[i][j].count > count) {
									map[i][j].classList.add("unselectable");
								} else if (i == "zhaomu" && _status.friends.length + selectedZhaomu >= 5) {
									map[i][j].classList.add("unselectable");
								} else if (i == "bufang") {
									var numbufang = 0;
									for (var k = 0; k < game.treasures.length; k++) {
										if (game.treasures[k].name == map[i][j].link) {
											numbufang++;
										}
										if (numbufang >= 3) {
											map[i][j].classList.add("unselectable");
											break;
										}
									}
								}
							}
						}
						ui.dialog.content.firstChild.innerHTML = "剩余行动点：" + count;
					};
					var clickOrder = 0;
					event.custom.replace.button = function (button) {
						if (!button.classList.contains("unselectable") || button.classList.contains("selected")) {
							button.classList.toggle("selected");
							button._clickOrder = clickOrder++;
						}
						updateSelected();
					};
					event.custom.add.window = function (clicked) {
						if (clicked) {
							return;
						}
						if (event.step > 1) {
							return;
						}
						for (var i in map) {
							for (var j = 0; j < map[i].length; j++) {
								map[i][j].classList.remove("selected");
								map[i][j].classList.remove("unselectable");
							}
						}
						updateSelected();
					};
					var update = function (link) {
						for (var i in map) {
							for (var j = 0; j < map[i].length; j++) {
								if (map[i][j]._link != link) {
									map[i][j].style.display = "none";
								} else {
									map[i][j].style.display = "";
								}
							}
						}
						for (var i = 0; i < event.control.childNodes.length; i++) {
							if (event.control.childNodes[i].innerHTML == link) {
								event.control.childNodes[i].classList.add("thundertext");
							}
						}
						_status.lastTafangCommand = link;
					};
					event.control = ui.create.control("布防", "招募", function (link, node) {
						if (node.disabled) {
							return;
						}
						var current = node.parentNode.querySelector(".thundertext");
						if (current == node) {
							return;
						}
						if (current) {
							current.classList.remove("thundertext");
						}
						update(link);
					});
					// if(!_status.friends.length){
					// 	event.control.lastChild.style.opacity=0.5;
					// 	if(_status.lastTafangCommand=='行动'){
					// 		_status.lastTafangCommand='招募';
					// 	}
					// }
					if (_status.friends.length >= 5) {
						event.control.childNodes[1].style.opacity = 0.5;
						event.control.childNodes[1].disabled = true;
						if (_status.lastTafangCommand == "招募") {
							_status.lastTafangCommand = "布防";
						}
					}
					_status.imchoosing = true;
					ui.auto.hide();
					var eventdong = function () {
						var selected = dialog.querySelectorAll(".button.selected");
						event.bufang = [];
						event.zhaomu = [];
						event.xingdong = _status.friends.slice(0);
						// var xingdongs=[];
						_status.remainingCount += 10;
						for (var i = 0; i < selected.length; i++) {
							switch (selected[i]._link) {
								case "布防":
									event.bufang.push(selected[i].link);
									break;
								case "招募":
									event.zhaomu.push(selected[i].link);
									break;
								// case '行动':xingdongs.push(selected[i]);break;
							}
							_status.remainingCount -= selected[i].count;
						}
						_status.remainingCount = Math.floor(_status.remainingCount / 2);
						// xingdongs.sort(function(a,b){
						// 	return a._clickOrder-b._clickOrder;
						// });
						// for(var i=0;i<xingdongs.length;i++){
						// 	event.xingdong.push(xingdongs[i].link);
						// }
						game.resume();
					};
					event.done = ui.create.control("完成", eventdong);
					if (_status.lastTafangCommand) {
						update(_status.lastTafangCommand);
					} else {
						update("招募");
					}
					if (_status.characterList.length < 6) {
						game.over(true);
						event.done.close();
						event.control.close();
						return;
					}
					setTimeout(function () {
						dialog.open();
						updateSelected();
					}, 50);
					event.switchToAuto = eventdong;
					if (!_status.auto && 10 + _status.remainingCount > 0) {
						game.pause();
					} else {
						eventdong();
					}
					"step 1";
					event.dialog.close();
					event.control.close();
					event.done.close();
					delete event.dialog;
					delete event.control;
					delete event.done;
					"step 2";
					event.chooseObstacle = false;
					if (event.bufang.length) {
						event.obstacles = game.obstacles.slice(0);
						for (var i = 0; i < event.obstacles.length; i++) {
							event.obstacles[i].classList.add("glow");
						}
						event.chooseObstacle = true;
						event.currentBufang = event.bufang.shift();
						event.dialog = ui.create.dialog("选择一个位置放置【" + get.translation(event.currentBufang) + "】");
						if (!_status.auto) {
							game.pause();
						} else {
							event.obstacle = event.obstacles.randomGet();
						}
						event.switchToAuto = function () {
							event.obstacle = event.obstacles.randomGet();
							game.resume();
						};
					} else {
						delete event.bufang;
					}
					"step 3";
					if (event.dialog) {
						event.dialog.close();
						delete event.dialog;
					}
					if (event.chooseObstacle) {
						game.removeObstacle(event.obstacle.dataset.position);
						var mech = game.addChessPlayer(event.currentBufang, "treasure", 0, event.obstacle.dataset.position);
						event.chooseObstacle = false;
						event.goto(2);
					} else {
						if (event.obstacles) {
							for (var i = 0; i < event.obstacles.length; i++) {
								event.obstacles[i].classList.remove("glow");
							}
							delete event.obstacles;
						}
						delete event.obstacle;
						delete event.currentBufang;
					}
					"step 4";
					if (event.dialog) {
						event.dialog.close();
						delete event.dialog;
					}
					if (event.zhaomu.length) {
						event.currentZhaomu = event.zhaomu.shift();
						event.dialog = ui.create.dialog("选择一个位置安排【" + get.translation(event.currentZhaomu) + "】");
						var size = ui.chesswidth * (ui.chessheight - 1);
						var clickGrid = function () {
							var player = game.addChessPlayer(event.currentZhaomu, false, 4, this.dataset.position);
							_status.friends.push(player);
							if (!game.me.name) {
								game.me = player;
								game.me.classList.add("current_action");
								ui.me.querySelector(".fakeme.avatar").show();
								ui.me.querySelector(".fakeme.player").show();
								ui.create.fakeme();
								ui.handcards1 = player.node.handcards1.addTempClass("start").fix();
								ui.handcards2 = player.node.handcards2.addTempClass("start").fix();
								ui.handcards1Container.appendChild(ui.handcards1);
								ui.handcards2Container.appendChild(ui.handcards2);
								ui.updatehl();
								game.setChessInfo();
								game.addVideo("tafangMe", player);
							}
							this.delete();
							event.redo();
							game.resume();
						};
						if (!event.playergrids) {
							event.playergrids = [];
							for (var i = ui.chesswidth; i < size; i++) {
								if (!lib.posmap[i.toString()]) {
									var grid = ui.create.div(".player.minskin.playerblank.glow", clickGrid, ui.chess);
									grid.addTempClass("start");
									ui.placeChess(grid, i);
									event.playergrids.push(grid);
								}
							}
						}
						game.pause();
						if (_status.auto) {
							setTimeout(function () {
								clickGrid.call(event.playergrids.randomGet());
							}, 50);
						}
					} else {
						delete event.zhaomu;
					}
					"step 5";
					_status.imchoosing = false;
					ui.auto.show();
					game.delay();
					if (event.dialog) {
						event.dialog.close();
						delete event.dialog;
					}
					if (event.playergrids) {
						for (var i = 0; i < event.playergrids.length; i++) {
							event.playergrids[i].delete();
						}
						delete event.playergrids;
					}
					delete event.currentZhaomu;
					"step 6";
					var shalldelay = false;
					for (var i = 0; i < ui.chesswidth; i++) {
						if (lib.posmap[i] && game.players.includes(lib.posmap[i])) {
							for (var j = 0; j < ui.chessheight; j++) {
								var pos = i + j * ui.chesswidth;
								if (lib.posmap[pos] && lib.posmap[pos].movable(0, 1)) {
									break;
								}
							}
							if (j < ui.chessheight) {
								shalldelay = true;
								for (var k = j; k >= 0; k--) {
									var pos = i + k * ui.chesswidth;
									if (lib.posmap[pos]) {
										lib.posmap[pos].moveDown();
									}
								}
							}
						}
					}
					if (shalldelay) {
						game.delay();
					}
					"step 7";
					event.justadded = [];
					if (_status.characterList.length) {
						if (_status.enemies.length < ui.chesswidth * 2) {
							var list1 = [];
							for (var i = 0; i < ui.chesswidth; i++) {
								if (!lib.posmap[i]) {
									list1.push(i);
								}
							}
							if (list1.length) {
								var enemy = game.addChessPlayer(_status.characterList.shift(), true, 4, list1.randomRemove());
								_status.enemies.push(enemy);
								event.justadded.push(enemy.name);
								if (game.players.length == 1) {
									ui.me.querySelector(".fakeme.player").show();
									game.setChessInfo(game.players[0]);
								}
								game.delay();
							}
							// var difficulty=get.config('tafang_difficulty');
							// if(_status.turnCount>=10&&list1.length&&difficulty>1){
							// 	var enemy=game.addChessPlayer(_status.characterList.shift(),true,4,list1.randomRemove());
							// 	_status.enemies.push(enemy);
							// 	event.justadded.push(enemy.name);
							// }
							// if(_status.turnCount>=20&&list1.length&&difficulty>1){
							// 	var enemy=game.addChessPlayer(_status.characterList.shift(),true,4,list1.randomRemove());
							// 	_status.enemies.push(enemy);
							// 	event.justadded.push(enemy.name);
							// }
							// if(list1.length&&difficulty>2){
							// 	var enemy=game.addChessPlayer(_status.characterList.shift(),true,4,list1.randomRemove());
							// 	_status.enemies.push(enemy);
							// 	event.justadded.push(enemy.name);
							// }
						}
					} else {
						game.over(true);
					}
					"step 8";
					if (event.xingdong.length) {
						var toact = event.xingdong.shift();
						if (game.players.includes(toact)) {
							toact.phase();
						}
						event.redo();
					} else {
						event.xingdong = _status.enemies.slice(0);
					}
					"step 9";
					if (event.xingdong.length) {
						var enemy = event.xingdong.shift();
						if (!event.justadded.includes(enemy.name) && game.players.includes(enemy)) {
							enemy.phase();
						}
						event.redo();
					} else {
						event.mechlist = game.treasures.slice(0);
					}
					"step 10";
					if (event.mechlist.length) {
						var mech = event.mechlist.shift();
						var info = lib.skill[mech.name + "_skill"];
						if (!info.filter || info.filter(mech)) {
							var next = game.createEvent("chessMech");
							next.player = mech;
							next.setContent(info.content);
							mech.chessFocus();
							if (lib.config.animation && !lib.config.low_performance) {
								mech.$epic2();
							}
							game.delay();
						}
						if (--mech.hp <= 0) {
							var next = game.createEvent("chessMechRemove");
							next.player = mech;
							next.setContent("chessMechRemove");
						} else {
							mech.update();
						}
						event.redo();
					}
					"step 11";
					delete event.xingdong;
					delete event.mechlist;
					if (_status.turnCount >= _status.turnTotal) {
						game.over(true);
					} else {
						event.goto(0);
						game.delay();
					}
				});
			},
			loadMap: function () {
				var next = game.createEvent("loadMap");
				next.setContent(function () {
					if (!lib.storage.map) {
						lib.storage.map = ["basic_small", "basic_medium", "basic_large"];
					}
					if (!lib.storage.newmap) {
						lib.storage.newmap = [];
					}
					var sceneview = ui.create.div(".storyscene");
					if (!lib.config.touchscreen && lib.config.mousewheel) {
						sceneview._scrollspeed = 30;
						sceneview._scrollnum = 10;
						sceneview.onmousewheel = function () {
							if (!this.classList.contains("lockscroll")) {
								ui.click.mousewheel.apply(this, arguments);
							}
						};
					}
					lib.setScroll(sceneview);
					var switchScene = function () {
						event.result = this.link;
						sceneview.delete();
						setTimeout(game.resume, 300);
					};
					var clickScene = function (e) {
						if (this.classList.contains("unselectable")) {
							return;
						}
						if (this._clicking) {
							return;
						}
						if (e && e.stopPropagation) {
							e.stopPropagation();
						}
						if (this.classList.contains("flipped")) {
							return;
						}
						if (this.classList.contains("glow3")) {
							this.classList.remove("glow3");
							lib.storage.newmap.remove(this.name);
							game.save("newmap", lib.storage.newmap);
						}
						var sceneNode = this.parentNode;
						var current = document.querySelector(".flipped.scene");
						if (current) {
							restoreScene(current, true);
						}
						this.content.innerHTML = "";
						ui.create.div(".menubutton.large.enter", "进入", this.content, switchScene).link = this.name;
						sceneNode.classList.add("lockscroll");
						var node = this;
						node._clicking = true;
						setTimeout(function () {
							node._clicking = false;
						}, 700);
						sceneNode.dx = ui.window.offsetWidth / 2 - (-sceneNode.scrollLeft + this.offsetLeft + this.offsetWidth / 2);
						if (Math.abs(sceneNode.dx) < 20) {
							sceneNode.dx = 0;
						}
						if (!sceneNode.sceneInterval && sceneNode.dx) {
							sceneNode.sceneInterval = setInterval(function () {
								var dx = sceneNode.dx;
								if (Math.abs(dx) <= 2) {
									sceneNode.scrollLeft -= dx;
									clearInterval(sceneNode.sceneInterval);
									delete sceneNode.sceneInterval;
								} else {
									var ddx = (dx / Math.sqrt(Math.abs(dx))) * 1.5;
									sceneNode.scrollLeft -= ddx;
									sceneNode.dx -= ddx;
								}
							}, 16);
						}
						node.style.transition = "all ease-in 0.2s";
						node.style.transform = "perspective(1600px) rotateY(90deg) scale(0.75)";
						var onEnd = function () {
							node.removeEventListener("webkitTransitionEnd", onEnd);
							node.classList.add("flipped");
							sceneNode.classList.add("lockscroll");
							node.style.transition = "all ease-out 0.4s";
							node.style.transform = "perspective(1600px) rotateY(180deg) scale(1)";
						};
						node.listenTransition(onEnd);
					};
					ui.click.scene = clickScene;
					var restoreScene = function (node, forced) {
						if (node._clicking && !forced) {
							return;
						}
						if (node.transformInterval) {
							clearInterval(node.transformInterval);
							delete node.transformInterval;
						}
						var sceneNode = node.parentNode;
						node._clicking = true;
						setTimeout(function () {
							node._clicking = false;
						}, 700);
						node.style.transition = "all ease-in 0.2s";
						node.style.transform = "perspective(1600px) rotateY(90deg) scale(0.75)";
						var onEnd = function () {
							node.removeEventListener("webkitTransitionEnd", onEnd);
							node.classList.remove("flipped");
							if (!sceneNode.querySelector(".flipped")) {
								sceneNode.classList.remove("lockscroll");
							}
							node.style.transition = "all ease-out 0.4s";
							node.style.transform = "perspective(1600px) rotateY(0deg) scale(0.7)";
						};
						node.listenTransition(onEnd);
					};
					ui.click.scene2 = restoreScene;
					var createScene = function (name) {
						var scene = lib.tafang.map[name];
						var node = ui.create.div(".scene", clickScene);
						node.style.transform = "perspective(1600px) rotateY(0deg) scale(0.7)";
						node.name = name;
						node.bgnode = ui.create.div(".background.player", node);
						node.info = scene;
						ui.create.div(".avatar.menu", node.bgnode);
						node.namenode = ui.create.div(".name", node, scene.name);
						if (lib.storage.map.includes(name)) {
							if (lib.storage.newmap.includes(name)) {
								node.classList.add("glow3");
							}
							node.namenode.dataset.nature = "soilm";
						} else {
							node.classList.add("unselectable");
							node.namenode.innerHTML = "未开启";
						}
						var content = ui.create.div(".menu", node);
						lib.setScroll(content);
						node.content = content;
						sceneview.appendChild(node);
						return node;
					};
					event.custom.add.window = function () {
						var current = document.querySelector(".flipped.scene");
						if (current) {
							restoreScene(current);
						}
					};
					for (var i in lib.tafang.map) {
						createScene(i);
					}
					ui.window.appendChild(sceneview.addTempClass("start"));
					game.pause();
				});
			},
		},
		skill: {
			tafang_mech_weixingxianjing_skill: {
				filter: function (player) {
					for (var i = 0; i < _status.enemies.length; i++) {
						if (!_status.enemies[i].isTurnedOver() && get.chessDistance(player, _status.enemies[i]) <= 2) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < _status.enemies.length; i++) {
						if (!_status.enemies[i].isTurnedOver() && get.chessDistance(player, _status.enemies[i]) <= 2) {
							list.push(_status.enemies[i]);
						}
					}
					if (list.length) {
						game.log("小型陷阱发动");
						var target = list.randomGet();
						target.turnOver();
						game.logv(player, "tafang_mech_weixingxianjing_skill", [target]).node.text.style.display = "none";
						player.line(target, "green");
					}
				},
			},
			tafang_mech_nengliangqiu_skill: {
				filter: function (player) {
					for (var i = 0; i < _status.friends.length; i++) {
						if (get.chessDistance(player, _status.friends[i]) <= 3) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list1 = [],
						list2 = [];
					for (var i = 0; i < _status.friends.length; i++) {
						if (get.chessDistance(player, _status.friends[i]) <= 1) {
							list2.push(_status.friends[i]);
						} else if (get.chessDistance(player, _status.friends[i]) <= 3) {
							list1.push(_status.friends[i]);
						}
						// else if(get.chessDistance(player,_status.friends[i])<=4){
						// 	list2.push(_status.friends[i]);
						// }
					}
					if (list2.length) {
						game.asyncDraw(list2, 2);
						player.line(list2, "green");
					}
					if (list1.length) {
						game.asyncDraw(list1);
						player.line(list1, "green");
					}
					if (list1.length || list2.length) {
						game.log("能量球发动");
						game.logv(player, "tafang_mech_nengliangqiu_skill", list1.concat(list2)).node.text.style.display = "none";
					}
				},
			},
			tafang_mech_mutong_skill: {
				filter: function (player) {
					for (var i = 0; i < _status.enemies.length; i++) {
						if (get.chessDistance(player, _status.enemies[i]) <= 3) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < _status.enemies.length; i++) {
						if (get.chessDistance(player, _status.enemies[i]) <= 3) {
							list.push(_status.enemies[i]);
						}
					}
					if (list.length) {
						game.log("木桶发动");
						var targets = list.randomGets(1);
						game.logv(player, "tafang_mech_mutong_skill", targets).node.text.style.display = "none";
						player.line(targets, "green");
						for (var i = 0; i < targets.length; i++) {
							targets[i].damage("nosource");
						}
					}
				},
			},
			tafang_mech_guangmingquan_skill: {
				filter: function (player) {
					for (var i = 0; i < _status.friends.length; i++) {
						if (_status.friends[i].hp < _status.friends[i].maxHp && get.chessDistance(player, _status.friends[i]) <= 2) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < _status.friends.length; i++) {
						if (_status.friends[i].hp < _status.friends[i].maxHp && get.chessDistance(player, _status.friends[i]) <= 2) {
							list.push(_status.friends[i]);
						}
					}
					if (list.length) {
						game.log("光明泉发动");
						player.line(list, "green");
						game.logv(player, "tafang_mech_guangmingquan_skill", list.slice(0)).node.text.style.display = "none";
						while (list.length) {
							list.shift().recover();
						}
					}
				},
			},
			tafang_mech_jiguanren_skill: {
				filter: function (player) {
					for (var i = 0; i < _status.enemies.length; i++) {
						if (get.chessDistance(player, _status.enemies[i]) <= 3) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var list = [];
					for (var i = 0; i < _status.enemies.length; i++) {
						if (get.chessDistance(player, _status.enemies[i]) <= 3) {
							list.push(_status.enemies[i]);
						}
					}
					if (list.length) {
						game.log("机关人发动");
						player.line(list, "green");
						game.logv(player, "tafang_mech_jiguanren_skill", list.slice(0)).node.text.style.display = "none";
						event.list = list;
					} else {
						event.finish();
					}
					"step 1";
					if (event.list.length) {
						var target = event.list.shift();
						var he = target.getCards("he");
						if (he.length) {
							target.discard(he.randomGets(Math.ceil(Math.random() * 2)));
						}
						event.redo();
					}
				},
			},
			tafang_mech_gongchengche_skill: {
				filter: function (player) {
					for (var i = 0; i < _status.enemies.length; i++) {
						if (get.chessDistance(player, _status.enemies[i]) <= 2) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < _status.enemies.length; i++) {
						if (get.chessDistance(player, _status.enemies[i]) <= 2) {
							list.push(_status.enemies[i]);
						}
					}
					if (list.length) {
						game.log("攻城车发动");
						var target = list.randomGet();
						player.line(target, "fire");
						target.damage("fire", "nosource");
						var he = target.getCards("he");
						if (he.length) {
							target.discard(he.randomGet());
						}
						game.logv(player, "tafang_mech_gongchengche_skill", [target]).node.text.style.display = "none";
					}
				},
			},
		},
		translate: {
			friend: "友",
			enemy: "敌",
			neutral: "中",
			trueColor: "zhu",
			falseColor: "wei",
			_chessmove: "移动",

			mode_tafang_character_config: "塔防模式",
			mode_tafang_card_config: "塔防模式",

			tafang_mech_weixingxianjing: "小型陷阱",
			tafang_mech_weixingxianjing_skill: "捕猎",
			tafang_mech_weixingxianjing_skill_info: "每一轮令距离你2格以内的一名随机敌人翻面。",
			tafang_mech_mutong: "木桶",
			tafang_mech_mutong_skill: "飞滚",
			tafang_mech_mutong_skill_info: "每一轮对距离3格以内的一名随机敌人造成1点伤害。",
			tafang_mech_nengliangqiu: "能量球",
			tafang_mech_nengliangqiu_skill: "充能",
			tafang_mech_nengliangqiu_skill_info: "每一轮令距离3格以内的所有友方角色摸一张牌，距离1以内改为摸2张。",
			tafang_mech_jiguanren: "机关人",
			tafang_mech_jiguanren_skill: "掠夺",
			tafang_mech_jiguanren_skill_info: "每一轮弃置3格以内的所有敌方角色各1~2张牌。",
			tafang_mech_gongchengche: "攻城车",
			tafang_mech_gongchengche_skill: "攻坚",
			tafang_mech_gongchengche_skill_info: "每一轮对距离2格以内的一名随机敌方角色造成1点火焰伤害，并随机弃置其一张牌。",
			tafang_mech_guangmingquan: "光明泉",
			tafang_mech_guangmingquan_skill: "圣疗",
			tafang_mech_guangmingquan_skill_info: "每一轮令距离2格以内的所有友方角色各回复1点体力。",
		},
		characterPack: {
			mode_tafang: {
				tafang_mech_guangmingquan: { sex: "", group: "", hp: 3, skills: [], isBoss: true, extraModeData: 3 },
				tafang_mech_nengliangqiu: { sex: "", group: "", hp: 3, skills: [], isBoss: true, extraModeData: 3 },
				tafang_mech_jiguanren: { sex: "", group: "", hp: 3, skills: [], isBoss: true, extraModeData: 3 },
				tafang_mech_weixingxianjing: { sex: "", group: "", hp: 3, skills: [], isBoss: true, extraModeData: 4 },
				tafang_mech_mutong: { sex: "", group: "", hp: 3, skills: [], isBoss: true, extraModeData: 4 },
				tafang_mech_gongchengche: { sex: "", group: "", hp: 3, skills: [], isBoss: true, extraModeData: 4 },
			},
		},
		cardPack: {
			mode_tafang: [],
		},
		posmap: {},
		help: {
			塔防模式: "<ul><li>阻上敌人到达最下方的出口，坚持到给定的回合数即获得胜利<li>" + "每轮可获得10个行动点，用来布置机关、招募武将。场上每有一个友方武将，行动点数-1。游戏难度将影响不同操作消耗的行动点数。未用完的行动点将减半（向下取整）并累积到下一轮<li>" + "每一轮在最上方的一个随机位置增加一名敌人，若最上方已有角色，则将其下移一格<li>" + "战场上最多出现3个相同的机关，每个机关在置入战场3轮后消失。战场上最多招募5名友方角色。<li>" + "敌方角色到达底部出口时游戏失败，已方角色到达底部出口，将被移出游戏",
		},
	};
};
