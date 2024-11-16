import { lib, game, ui, get, ai, _status } from "../noname.js";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "chess",
		canvasUpdates2: [],
		hiddenCharacters: [],
		start() {
			"step 0";
			_status.gameDrawed = true;
			_status.mode = get.config("chess_mode");
			if (lib.config.player_border == "normal" && (lib.config.layout == "long" || lib.config.layout == "long2")) {
				ui.arena.classList.add("lslim_player");
			}
			// if(_status.mode=='leader'){
			// 	_status.mode='combat';
			// }
			if (lib.config.test_game) {
				_status.mode = "combat";
				game.saveConfig("additional_player", false, true);
			}
			if (_status.mode == "combat") {
				_status.first_less = true;
			}
			"step 1";
			for (var i in lib.skill) {
				if (lib.skill[i].seatRelated) {
					lib.skill[i] = {};
					if (lib.translate[i + "_info"]) {
						lib.translate[i + "_info"] = "此模式下不可用";
					}
				}
			}
			lib.init.css(lib.assetURL + "layout/mode", "chess");
			ui.chesssheet = document.createElement("style");
			document.head.appendChild(ui.chesssheet);
			var playback = localStorage.getItem(lib.configprefix + "playback");
			lib.treasurelist = [];
			if (get.config("chess_character") || playback || _status.mode == "leader") {
				for (var i in lib.characterPack.mode_chess) {
					if (i.indexOf("treasure_") == 0) {
						lib.treasurelist.push(i);
					}
					if (!playback && i.indexOf("leader_") == 0 && _status.mode != "leader") continue;
					lib.character[i] = lib.characterPack.mode_chess[i];
				}
			}
			if (get.config("chess_card")) {
				lib.card.list.addArray(lib.chess_cardlist);
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
			} else {
				switch (_status.mode) {
					case "leader": {
						game.leaderView();
						break;
					}
					case "three": {
						if (lib.config.continue_name_chess) {
							event._result = {
								friend: lib.config.continue_name_chess.friend,
								enemy: lib.config.continue_name_chess.enemy,
							};
							_status.color = lib.config.continue_name_chess.color;
							game.saveConfig("continue_name_chess");
							game.delay(0.5);
							lib.init.onfree();
						} else {
							game.chooseCharacterDouble(
								function (i) {
									if (lib.character[i].isChessBoss) {
										return false;
									}
									return !lib.filter.characterDisabled(i);
								},
								function (i) {
									switch (i) {
										case 0:
											return "主帅";
										case 1:
											return "副帅";
										default:
											return "前锋";
									}
								}
							);
						}
						break;
					}
					case "combat": {
						game.chooseCharacter();
						break;
					}
					default: {
						game.chooseCharacter();
					}
				}
			}
			"step 2";
			ui.arena.classList.add("chess");
			if (_status.mode == "three") {
				_status.mylist = result.friend;
				_status.enemylist = result.enemy;
				_status.friendBackup = _status.mylist.slice(0);
				_status.enemyBackup = _status.enemylist.slice(0);
			}
			var mylistmap, enemylistmap;
			if (event.video) {
				var videocontent;
				for (var ii = 0; ii < event.video.length; ii++) {
					if (event.video[ii].type == "init") {
						videocontent = event.video[ii].content;
						break;
					}
				}
				_status.mylist = [];
				_status.enemylist = [];
				mylistmap = [];
				enemylistmap = [];
				for (var i = 0; i < videocontent.length; i++) {
					if (videocontent[i].lord) {
						_status.lord = videocontent[i].name;
					}
					if (videocontent[i].identity == "friend") {
						_status.mylist.push(videocontent[i].name);
						mylistmap.push(videocontent[i].position);
					} else {
						_status.enemylist.push(videocontent[i].name);
						enemylistmap.push(videocontent[i].position);
					}
				}
				game.playerMap = lib.posmap;
			}
			var num = Math.round((_status.mylist.length + _status.enemylist.length) / 2);
			var friend, enemy;
			var side;
			if (_status.mode == "three") {
				side = !_status.color;
			} else if (_status.mode == "leader") {
				side = true;
			} else {
				side = Math.random() < 0.5;
			}

			switch (num) {
				case 1:
					ui.chessheight = 4;
					break;
				case 2:
					ui.chessheight = 5;
					break;
				case 3:
					ui.chessheight = 5;
					break;
				case 4:
					ui.chessheight = 6;
					break;
				case 5:
					ui.chessheight = 6;
					break;
				case 6:
					ui.chessheight = 7;
					break;
				case 7:
					ui.chessheight = 7;
					break;
				case 8:
					ui.chessheight = 8;
					break;
				default:
					ui.chessheight = 8;
			}
			ui.chesswidth = Math.round(ui.chessheight * 1.5);

			if (num == 1) ui.chesswidth++;
			game.initChess();

			var grids = [];
			var gridnum = ui.chessheight * ui.chesswidth;
			for (var i = 0; i < gridnum; i++) {
				grids.push(i);
			}
			event.obs = [];
			if (!event.video) {
				var nco = parseFloat(get.config("chess_obstacle"));
				if (nco > 0) {
					var ng = Math.floor(gridnum * nco);
					for (var i = 0; i < ng; i++) {
						var cg = grids.randomRemove();
						game.addObstacle(cg.toString(), false);
						event.obs.push(cg.toString());
					}
				}
			}
			_status.enemyCount = _status.enemylist.length;
			_status.friendCount = _status.mylist.length;
			while (_status.mylist.length) {
				friend = ui.create.player().addTempClass("start");
				friend.getId();
				if (!event.friendZhu) {
					event.friendZhu = friend;
				} else if (!event.friendViceZhu) {
					event.friendViceZhu = friend;
				}
				friend.init(_status.mylist.shift());
				friend.side = side;
				friend.setIdentity("friend");
				friend.identity = "friend";
				friend.node.identity.dataset.color = get.translation(side + "Color");
				game.players.push(friend);
				ui.chess.appendChild(friend);
				if (event.video) {
					ui.placeChess(friend, mylistmap.shift());
				} else {
					ui.placeChess(friend, grids.randomRemove());
					if (_status.enterArena && game.data.arena.acted.includes(friend.name)) {
						friend.hp--;
						friend.update();
					}
					if (_status.enterArena) {
						friend.addSkill("arenaAdd");
					}
				}
				lib.posmap[friend.dataset.position] = friend;
			}
			while (_status.enemylist.length) {
				enemy = ui.create.player().addTempClass("start");
				enemy.getId();
				enemy.init(_status.enemylist.shift());
				enemy.side = !side;
				enemy.setIdentity("enemy");
				enemy.identity = "enemy";
				enemy.node.identity.dataset.color = get.translation(!side + "Color");
				game.players.push(enemy);
				ui.chess.appendChild(enemy);
				if (event.video) {
					ui.placeChess(enemy, enemylistmap.shift());
				} else {
					ui.placeChess(enemy, grids.randomRemove());
				}
				lib.posmap[enemy.dataset.position] = enemy;
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

			if (!event.video && _status.mode == "combat" && !_status.vsboss && (_status.replacelist.length || get.config("additional_player"))) {
				_status.enemyDied = 0;
				_status.friendDied = 0;
				ui.enemyDied = ui.create.system("杀敌: " + get.cnNumber(0), null, true);
				ui.friendDied = ui.create.system("阵亡: " + get.cnNumber(0), null, true);
				if (!get.config("additional_player")) {
					lib.setPopped(ui.friendDied, function () {
						if (_status.replacelist.length) {
							var uiintro = ui.create.dialog("hidden");

							uiintro.add("未上场");
							uiintro.add([_status.replacelist, "character"]);

							return uiintro;
						}
					});
				}
			}
			if (!event.video && _status.mode == "combat" && !get.config("single_control") && !_status.boss) {
				ui.single_swap = ui.create.system(
					"换人",
					function () {
						var bool = false;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].side == game.me.side && game.players[i] != game.me) {
								bool = true;
								break;
							}
						}
						if (bool) {
							if (ui.auto.classList.contains("hidden")) {
								game.me.popup("请稍后换人");
								return;
							}
							if (_status.event.isMine()) {
								ui.click.auto();
								setTimeout(function () {
									ui.click.auto();
								}, 500);
							}
							var player = game.me;
							for (var i = 0; i < game.players.length; i++) {
								player = player.next;
								if (player.side == game.me.side) {
									game.modeSwapPlayer(player);
									return;
								}
							}
						}
					},
					true
				);
			}
			if (!event.video && _status.mode == "combat" && !_status.vsboss && get.config("additional_player")) {
				var finishGameBr = document.createElement("br");
				finishGameBr.classList.add("finish_game");
				ui.finishGame = ui.create.system("结束游戏", function () {
					ui.finishGame.remove();
					if (_status.friendDied < _status.enemyDied) {
						game.forceOver(true);
					} else if (_status.friendDied > _status.enemyDied) {
						game.forceOver(false);
					} else {
						game.forceOver();
					}
				});
				ui.finishGame.classList.add("finish_game");
				ui.finishGame.parentNode.insertBefore(finishGameBr, ui.finishGame);
			}

			ui.create.me();
			ui.create.fakeme();

			if (!event.video && ((_status.mode == "combat" && get.config("zhu") && !_status.vsboss && game.players.length > 2) || _status.mode == "three")) {
				game.friendZhu = event.friendZhu;
				game.friendZhu.hp++;
				game.friendZhu.maxHp++;
				game.friendZhu.update();
				game.friendZhu.node.identity.firstChild.innerHTML = "将";

				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i].side != game.me.side) {
						game.enemyZhu = game.players[i];
						game.players[i].hp++;
						game.players[i].maxHp++;
						game.players[i].update();
						game.players[i].node.identity.firstChild.innerHTML = "帅";
						break;
					}
				}

				if ((get.config("main_zhu") || _status.mode == "three") && event.friendViceZhu) {
					game.friendViceZhu = event.friendViceZhu;
					game.friendViceZhu.node.identity.firstChild.innerHTML = "仕";
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != game.me.side && game.players[i] != game.enemyZhu) {
							game.enemyViceZhu = game.players[i];
							game.players[i].node.identity.firstChild.innerHTML = "士";
							break;
						}
					}
				}
			}

			ui.chessinfo = ui.create.div(".fakeme.player.playerbg", ui.me, function (e) {
				e.stopPropagation();
			});
			ui.create.div(ui.chessinfo);
			lib.setScroll(ui.chessinfo.firstChild);

			game.arrangePlayers();
			"step 3";
			ui.control.style.display = "";
			var p;
			for (var i = 0; i < game.players.length; i++) {
				if (_status.lord) {
					if (game.players[i].name == _status.lord) {
						p = game.players[i];
						p.addSkill("tongshuai");
						p.addSkill("leader_zhaoxiang");
						break;
					}
				} else {
					if (game.players[i].side) {
						p = game.players[i];
						break;
					}
				}
			}
			if (event.video) {
				game.playVideoContent(event.video);
				game.setChessInfo(p);
				return;
			}

			var players = get.players(lib.sort.position);
			var info = [];
			for (var i = 0; i < players.length; i++) {
				info.push({
					name: players[i].name,
					identity: players[i].identity,
					position: players[i].dataset.position,
					lord: players[i].name == _status.lord,
				});
			}
			_status.videoInited = true;
			game.addVideo("init", null, info);
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

			event.trigger("gameStart");
			game.gameDraw(p);
			game.me.classList.add("current_action");
			if (_status.mode == "three") {
				game.phaseLoopThree(_status.color ? game.enemyZhu : game.friendZhu);
			} else if (_status.mode == "leader") {
				game.phaseLoopOrdered(p);
			} else if (get.config("seat_order") == "指定") {
				game.phaseLoopOrdered(p);
			} else {
				game.phaseLoop(p);
			}
			game.setChessInfo(p);
		},
		element: {
			card: {
				moveTo: function (player) {
					var rect1 = this.getBoundingClientRect();
					var rect2 = player.getBoundingClientRect();
					var dx = rect2.left + rect2.width / 2 - (rect1.left + rect1.width / 2);
					var dy = rect2.top + rect2.height / 2 - (rect1.top + rect1.height / 2);
					this.style.transform += " translate(" + dx + "px," + dy + "px)";
				},
			},
			player: {
				getLeft: function () {
					var left = this.offsetLeft;
					if (this._chesstransform) {
						left += this._chesstransform[0];
					}
					return left;
				},
				getTop: function () {
					var top = this.offsetLeft;
					if (this._chesstransform) {
						top += this._chesstransform[1];
					}
					return top;
				},
				createRangeShadow: function (num, move) {
					num++;
					var shadows = this.parentNode.getElementsByClassName("playergrid");
					while (shadows.length) {
						shadows[0].remove();
					}
					var grids = [];
					for (var i = 1 - num; i < num; i++) {
						for (var j = 1 - num + Math.abs(i); j < num - Math.abs(i); j++) {
							if (this.movable(i, j)) {
								var grid = ui.create.playergrid(this, i, j);
								if (grid) {
									grids.push(grid);
									if (typeof move == "function") {
										grid.listen(move);
									} else if (move) {
										grid.classList.add("pointerdiv");
										grid.listen(ui.click.playergrid);
										ui.movegrids.push(grid);
									} else {
										grid.classList.add("temp");
									}
								}
							}
						}
					}
					return grids;
				},
				chooseToMoveChess: function (num, prompt) {
					var next = game.createEvent("chooseToMoveChess");
					next.num = num || 1;
					next.player = this;
					next.setContent("chooseToMoveChess");
					next.prompt = prompt;
					return next;
				},
				move: function (x, y) {
					var xy = this.getXY();
					return this.moveTo(x + xy[0], y + xy[1]);
				},
				moveTo: function (x, y) {
					game.addVideo("moveTo", this, [x, y]);
					if (x >= ui.chesswidth) {
						x = ui.chesswidth - 1;
					}
					if (y >= ui.chessheight) {
						y = ui.chessheight - 1;
					}

					var pos = y * ui.chesswidth + x;
					if (!lib.posmap[pos]) {
						delete lib.posmap[this.dataset.position];
						// this.changeSeat(pos,false);
						ui.placeChess(this, pos);
						lib.posmap[pos] = this;
						this.chessFocus();
					}

					if (get.mode() == "tafang" && !_status.video) {
						if (_status.tafangend.includes(this.dataset.position)) {
							if (_status.enemies.includes(this)) {
								game.over(false);
							} else {
								this.delete();
								delete lib.posmap[this];
								game.players.remove(this);
								_status.friends.remove(this);
								this.classList.add("dead");
								if (_status.roundStart == this) {
									_status.roundStart = player.next || player.getNext() || game.players[0];
								}
								if (this == game.me) {
									if (ui.confirm) {
										ui.confirm.close();
									}
									if (_status.friends.length == 0) {
										ui.fakeme.hide();
										this.node.handcards1.delete();
										this.node.handcards2.delete();
										game.me = ui.create.player();
										game.me.side = false;
										game.addVideo("removeTafangPlayer");
									} else {
										game.modeSwapPlayer(_status.friends[0]);
									}
								}
								for (var i = 0; i < ui.phasequeue.length; i++) {
									if (ui.phasequeue[i].link == this) {
										ui.phasequeue[i].remove();
										ui.phasequeue.splice(i, 1);
										break;
									}
								}
								game.addVideo("deleteChessPlayer", this);
							}
						}
					}
					return this;
				},
				canMoveTowards: function (target) {
					var fxy = this.getXY();
					var txy = target.getXY();
					var dx = txy[0] - fxy[0];
					var dy = txy[1] - fxy[1];
					if (dx < 0 && this.movable(-1, 0)) return true;
					if (dx > 0 && this.movable(1, 0)) return true;
					if (dy < 0 && this.movable(0, -1)) return true;
					if (dy > 0 && this.movable(0, 1)) return true;
					return false;
				},
				moveTowards: function (target, forbid) {
					var fxy = this.getXY();
					var txy;
					if (Array.isArray(target)) {
						txy = target;
					} else if (typeof target == "string") {
						var pos = parseInt(target);
						txy = [pos % ui.chesswidth, Math.floor(pos / ui.chesswidth)];
					} else {
						txy = target.getXY();
					}
					var dx = txy[0] - fxy[0];
					var dy = txy[1] - fxy[1];
					forbid = forbid || [];
					if (Math.abs(dx) > Math.abs(dy)) {
						if (dx < 0) {
							if (!forbid.includes("moveLeft") && this.movable(-1, 0)) {
								this.moveLeft();
								return "moveLeft";
							}
						} else if (dx > 0) {
							if (!forbid.includes("moveRight") && this.movable(1, 0)) {
								this.moveRight();
								return "moveRight";
							}
						}
						if (dy < 0) {
							if (!forbid.includes("moveUp") && this.movable(0, -1)) {
								this.moveUp();
								return "moveUp";
							}
						} else if (dy > 0) {
							if (!forbid.includes("moveDown") && this.movable(0, 1)) {
								this.moveDown();
								return "moveDown";
							}
						}
					} else {
						if (dy < 0) {
							if (!forbid.includes("moveUp") && this.movable(0, -1)) {
								this.moveUp();
								return "moveUp";
							}
						} else if (dy > 0) {
							if (!forbid.includes("moveDown") && this.movable(0, 1)) {
								this.moveDown();
								return "moveDown";
							}
						}
						if (dx < 0) {
							if (!forbid.includes("moveLeft") && this.movable(-1, 0)) {
								this.moveLeft();
								return "moveLeft";
							}
						} else if (dx > 0) {
							if (!forbid.includes("moveRight") && this.movable(1, 0)) {
								this.moveRight();
								return "moveRight";
							}
						}
					}
					return false;
				},
				chessFocus: function () {
					game.addVideo("chessFocus", this);
					if (ui.chess._chessdrag) return;
					if (_status.chessscrolling) return;
					var player = this;
					var dx = 0,
						dy = 0;

					if (player.getLeft() - ui.chessContainer.chessLeft < 14) {
						dx = player.getLeft() - ui.chessContainer.chessLeft - 14;
					} else if (player.getLeft() - ui.chessContainer.chessLeft > ui.chessContainer.offsetWidth - 134) {
						dx = player.getLeft() - ui.chessContainer.chessLeft - ui.chessContainer.offsetWidth + 134;
					}
					if (player.getTop() - ui.chessContainer.chessTop < 14) {
						dy = player.getTop() - ui.chessContainer.chessTop - 14;
					} else if (player.getTop() + ui.chess.offsetTop - ui.chessContainer.chessTop > ui.chessContainer.offsetHeight - 134) {
						dy = player.getTop() + ui.chess.offsetTop - ui.chessContainer.chessTop - ui.chessContainer.offsetHeight + 134;
					}
					// if(_status.currentChessFocus){
					// 	cancelAnimationFrame(_status.currentChessFocus);
					// }
					var count = lib.config.low_performance ? 6 : 12;
					var ddx = Math.floor(dx / count);
					var ddy = Math.floor(dy / count);
					if (dx || dy) {
						ui.chessContainer.move(dx, dy, true);
						// var chessFocus=function(){
						// 	if(count--){
						// 		ui.chessContainer.chessLeft+=ddx;
						// 		ui.chessContainer.chessTop+=ddy;
						// 		_status.currentChessFocus=requestAnimationFrame(chessFocus);
						// 	}
						// 	else{
						// 		ui.chessContainer.chessLeft+=dx%count;
						// 		ui.chessContainer.chessTop+=dy%count;
						// 		cancelAnimationFrame(_status.currentChessFocus);
						// 		delete _status.currentChessFocus;
						// 	}
						// };
						// _status.currentChessFocus=requestAnimationFrame(chessFocus);
					}
				},
				getXY: function () {
					var pos = parseInt(this.dataset.position);
					var x = pos % ui.chesswidth;
					var y = Math.floor(pos / ui.chesswidth);
					return [x, y];
				},
				getDataPos: function (x, y) {
					var xy = this.getXY();
					if (typeof x != "number") x = 0;
					if (typeof y != "number") y = 0;
					x += xy[0];
					y += xy[1];
					return x + y * ui.chesswidth;
				},
				getNeighbour: function (x, y) {
					var xy = this.getXY();
					if (xy[0] + x < 0) return null;
					if (xy[1] + y < 0) return null;
					if (xy[0] + x >= ui.chesswidth) return null;
					if (xy[1] + y >= ui.chessheight) return null;
					return lib.posmap[this.getDataPos(x, y)] || null;
				},
				getNeighbours: function () {
					var players = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.isChessNeighbour(game.players[i], this)) {
							players.push(game.players[i]);
						}
					}
					return players;
				},
				movable: function (x, y) {
					var xy = this.getXY();
					if (xy[0] + x < 0) return false;
					if (xy[1] + y < 0) return false;
					if (xy[0] + x >= ui.chesswidth) return false;
					if (xy[1] + y >= ui.chessheight) return false;
					return !this.getNeighbour(x, y);
				},
				moveRight: function () {
					if (this.movable(1, 0)) {
						this.move(1, 0);
						return true;
					}
					return false;
				},
				moveLeft: function () {
					if (this.movable(-1, 0)) {
						this.move(-1, 0);
						return true;
					}
					return false;
				},
				moveUp: function () {
					if (this.movable(0, -1)) {
						this.move(0, -1);
						return true;
					}
					return false;
				},
				moveDown: function () {
					if (this.movable(0, 1)) {
						this.move(0, 1);
						return true;
					}
					return false;
				},
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
					if (ui.friendDied && player.side == game.me.side) {
						ui.friendDied.innerHTML = "阵亡: " + get.cnNumber(++_status.friendDied, true);
					}
					if (ui.enemyDied && player.side != game.me.side) {
						ui.enemyDied.innerHTML = "杀敌: " + get.cnNumber(++_status.enemyDied, true);
					}
					if (player == game.friendZhu) {
						if (game.friendViceZhu && game.friendViceZhu.isAlive()) {
							game.friendZhu = game.friendViceZhu;
							delete game.friendViceZhu;
							game.friendZhu.node.identity.lastChild.innerHTML = "将";
							game.addVideo("identityText", game.friendZhu, "将");
						} else {
							game.over(false);
							return;
						}
					} else if (player == game.enemyZhu) {
						if (game.enemyViceZhu && game.enemyViceZhu.isAlive()) {
							game.enemyZhu = game.enemyViceZhu;
							delete game.enemyViceZhu;
							game.enemyZhu.node.identity.lastChild.innerHTML = "帅";
							game.addVideo("identityText", game.enemyZhu, "帅");
						} else {
							game.over(true);
							return;
						}
					}
					if (player == game.me && get.config("single_control")) {
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].side == player.side) {
								game.modeSwapPlayer(game.players[i]);
							}
						}
					}
					var notend = false;
					for (var i = 1; i < game.players.length; i++) {
						if (game.players[i].side != game.players[0].side) {
							if (source && game.players.includes(source)) {
								if (_status.mode == "combat") {
									if (source.side != player.side) {
										source.draw(get.config("reward"));
									} else {
										switch (get.config("punish")) {
											case "弃牌":
												var he = source.getCards("he");
												if (he.length) {
													source.discard(he);
												}
												break;
											case "摸牌":
												source.draw(get.config("reward"));
												break;
										}
									}
								} else if (_status.mode == "three") {
									source.draw(2);
								} else if (source.side != player.side) {
									source.draw();
								}
							}
							if (_status.mode != "combat" || _status.vsboss) {
								return;
							} else {
								notend = true;
								break;
							}
						}
					}
					if (_status.mode == "combat" && !_status.vsboss) {
						if (game.players.length == 1 && get.config("additional_player") && _status.additionallist.length && source == game.players[0]) {
							source.draw(get.config("reward"));
						}
						if (player.side == game.me.side) {
							if (get.config("additional_player") && _status.additionallist.length) {
								game.replaceChessPlayer();
								return;
							} else if (_status.replacelist.length) {
								if (game.players.length == 1 && source == game.players[0]) {
									source.draw(get.config("reward"));
								}
								game.replaceChessPlayer(_status.replacelist.randomRemove());
								return;
							} else if (get.config("noreplace_end")) {
								game.over(player.side != game.me.side);
								return;
							} else if (notend) {
								return;
							}
						} else {
							if (get.config("additional_player") && _status.additionallist.length) {
								game.replaceChessPlayer(null, true);
								return;
							} else if (_status.enemyreplacelist.length) {
								if (game.players.length == 1 && source == game.players[0]) {
									source.draw(get.config("reward"));
								}
								game.replaceChessPlayer(_status.enemyreplacelist.randomRemove(), true);
								return;
							} else if (get.config("noreplace_end")) {
								game.over(player.side != game.me.side);
								return;
							} else if (notend) {
								return;
							}
						}
					}
					game.over(game.me.side == game.players[0].side);
				},
				$draw_old: function (num) {
					var cards;
					if (get.itemtype(num) == "cards") {
						cards = num;
					} else if (get.itemtype(num) == "card") {
						cards = [num];
					}
					if (cards) {
						game.addVideo("chessgainmod", this, get.cardsInfo(num));
					} else if (!num || typeof num == "number") {
						game.addVideo("chessgainmod", this, num);
					}

					return this.$gainmod(num);
				},
				$gainmod: function (num) {
					var cards, node;
					if (get.itemtype(num) == "cards") {
						cards = num;
						num = cards.length;
					} else if (get.itemtype(num) == "card") {
						cards = [num];
						num = 1;
					}
					if (cards) {
						cards = cards.slice(0);
						node = cards.shift().copy("thrown", "hidden");
					} else {
						node = ui.create.div(".card.thrown.hidden");
					}
					node.fixed = true;
					this.$randomMove(node, 130, 0);
					var ot = node.style.transform;
					if (node.style.transform && node.style.transform != "none") {
						node.style.transform += " scale(0.6)";
					} else {
						node.style.transform = "scale(0.6)";
					}
					node.dataset.position = this.dataset.position;
					this.parentNode.appendChild(node);
					ui.refresh(node);
					node.show();
					node.style.transform = ot;
					setTimeout(function () {
						node.style.transform = "";
						node.delete();
					}, 500);
					var that = this;
					if (num && num > 1) {
						if (cards) {
							that.$gain(cards, null, false);
						} else {
							that.$gain(num - 1, null, false);
						}
					}
				},
				$throw: function (card, time, init) {
					if (init !== false) {
						if (get.itemtype(card) != "cards") {
							if (get.itemtype(card) == "card") {
								card = [card];
							} else {
								return;
							}
						}
						game.addVideo("throw", this, [get.cardsInfo(card), time]);
					}
					this.chessFocus();
					if (get.itemtype(card) == "cards") {
						for (var i = 0; i < card.length; i++) {
							this.$throw(card[i], time, false);
						}
					} else {
						if (card == undefined || card.length == 0) return;
						var node = card.copy("thrown", "hidden");
						node.dataset.position = this.dataset.position;
						if (this.parentNode) this.parentNode.appendChild(node);
						ui.refresh(node);
						node.show();
						this.$randomMove(node, 130, 0);
						if (time != undefined) {
							node.fixed = true;
							setTimeout(function () {
								node.delete();
							}, time);
						}
					}
				},
				$givemod: function (card, player) {
					this.chessFocus();
					var from = this;
					if (get.itemtype(card) == "cards") {
						for (var i = 0; i < card.length; i++) {
							from.$givemod(card[i], player);
						}
					} else if (typeof card == "number" && card >= 0) {
						for (var i = 0; i < card; i++) {
							from.$givemod("", player);
						}
					} else {
						var node;
						if (get.itemtype(card) == "card") {
							node = card.copy("card", "thrown", false);
						} else {
							node = ui.create.div(".card.thrown");
						}

						node.dataset.position = this.dataset.position;
						node.fixed = true;
						node.hide();

						this.parentNode.appendChild(node);
						ui.refresh(node);
						node.show();

						this.$randomMove(node, 130, 0);

						setTimeout(function () {
							lib.element.card.moveTo.call(node, player);
							setTimeout(function () {
								node.delete();
							}, 200);
							// node.removeAttribute('style');
							// node.dataset.position=player.dataset.position;
							// node.delete();
						}, 700);
					}
				},
				$throwxy: function (card, left, top, transform) {
					var node = card.copy("thrown", "thrownhighlight");
					var rect = this.getBoundingClientRect();
					node.style.left = rect.left + 8 + "px";
					node.style.top = rect.top + 8 + "px";
					node.hide();
					node.style.transitionProperty = "left,top,opacity";
					if (transform) {
						node.style.transform = "rotate(" + (Math.random() * 16 - 8) + "deg)";
					}
					ui.arena.appendChild(node);
					ui.refresh(node);
					node.show();
					node.style.left = left;
					node.style.top = top;
					return node;
				},
				$phaseJudge: function (card) {
					game.addVideo("phaseJudge", this, get.cardInfo(card));
					let cardToThrow;
					if (card.cards?.length) {
						//TODO: 这里先偷懒，只用其中的第一张牌进行处理，先解决bug
						cardToThrow = card.cards[0];
					} else {
						cardToThrow = game.createCard(card.name, "虚拟", "");
					}
					const clone = cardToThrow.copy("thrown", this.parentNode).addTempClass("judgestart");
					const player = this;
					clone.style.opacity = 0.6;
					clone.style.left = Math.random() * 100 - 50 + ui.chessContainer.chessLeft + ui.chessContainer.offsetWidth / 2 - 52 + "px";
					clone.style.top = Math.random() * 80 - 40 + ui.chessContainer.chessTop + ui.chessContainer.offsetHeight / 2 - 52 - ui.chessContainer.offsetTop + "px";
					game.delay();
					game.linexy([clone.offsetLeft + clone.offsetWidth / 2, clone.offsetTop + clone.offsetHeight / 2, player.getLeft() + player.offsetWidth / 2, player.getTop() + player.offsetHeight / 2], { opacity: 0.5, dashed: true }, true);
				},
				$randomMove: function (node, length, rand) {
					if (!this.node.chessthrown) {
						this.node.chessthrown = [];
					}
					var thrown = this.node.chessthrown;
					for (var i = 0; i < thrown.length; i++) {
						if (thrown[i].parentNode != this.parentNode || thrown[i].classList.contains("removing")) {
							thrown.splice(i--, 1);
						}
					}
					thrown.push(node);

					var rect = this.getBoundingClientRect();
					var amax, amin;
					if (rect.left <= 80) {
						if (rect.top <= 80) {
							amin = -90;
							amax = 0;
						} else if (rect.top + rect.height + 80 >= ui.chessContainer.offsetHeight) {
							amin = 0;
							amax = 90;
						} else {
							amin = -90;
							amax = 90;
						}
					} else if (rect.left + rect.width + 80 >= ui.chessContainer.offsetWidth) {
						if (rect.top <= 80) {
							amin = 180;
							amax = 270;
						} else if (rect.top + rect.height + 80 >= ui.chessContainer.offsetHeight) {
							amin = 90;
							amax = 180;
						} else {
							amin = 90;
							amax = 270;
						}
					} else if (rect.top <= 80) {
						amin = 180;
						amax = 360;
					} else if (rect.top + rect.height + 80 >= ui.chessContainer.offsetHeight) {
						amin = 0;
						amax = 180;
					} else {
						var dx = ui.chessContainer.offsetWidth / 2 - (rect.left + rect.width / 2);
						var dy = -ui.chessContainer.offsetHeight / 2 + (rect.top + rect.height / 2);
						var ang = (Math.abs(Math.atan(dy / dx)) * 180) / Math.PI;
						if (dx < 0) {
							if (dy > 0) {
								ang = 180 - ang;
							} else {
								ang += 180;
							}
						} else if (dy < 0) {
							ang = 360 - ang;
						}
						amin = ang - 180;
						amax = ang + 180;
					}
					var da = (amax - amin) / (thrown.length * 2);
					if (da > 30 && thrown.length > 1) {
						amin += (da - 30) * thrown.length;
						da = 30;
					}
					for (var i = 0; i < thrown.length; i++) {
						var lengthi = length + Math.random() * rand;
						var ang = amin + da * (2 * i + 1);
						ang *= Math.PI / 180;
						var tx = lengthi * Math.cos(ang);
						var ty = -lengthi * Math.sin(ang);
						if (Math.abs(tx) < 0.1) {
							tx = 0;
						}
						if (Math.abs(ty) < 0.1) {
							ty = 0;
						}
						thrown[i].style.transform = "translate(" + tx + "px," + ty + "px)";
					}
				},
			},
			content: {
				replaceChessPlayer: function () {
					"step 0";
					if (get.config("additional_player")) {
						if (!event.enemy && !_status.auto && (game.me.isDead() || get.config("single_control"))) {
							event.dialog = ui.create.dialog("选择替补角色", [_status.additionallist.randomGets(parseInt(get.config("choice_number"))), "character"]);
							event.filterButton = function () {
								return true;
							};
							event.player = game.me;
							event.forced = true;
							event.forceDie = true;
							event.custom.replace.confirm = function () {
								event.playername = ui.selected.buttons[0].link;
								event.dialog.close();
								_status.additionallist.remove(event.playername);
								if (ui.confirm) ui.confirm.close();
								game.resume();
							};
							game.check();
							game.pause();
						} else {
							event.playername = _status.additionallist.randomRemove();
						}
					} else if (!event.enemy && get.config("seat_order") == "指定" && !_status.auto && _status.replacelist.length) {
						_status.replacelist.add(event.playername);
						event.dialog = ui.create.dialog("选择替补角色", [_status.replacelist, "character"]);
						event.filterButton = function () {
							return true;
						};
						event.player = game.me;
						event.forced = true;
						event.forceDie = true;
						event.custom.replace.confirm = function () {
							event.playername = ui.selected.buttons[0].link;
							event.dialog.close();
							_status.replacelist.remove(event.playername);
							if (ui.confirm) ui.confirm.close();
							game.resume();
						};
						game.check();
						game.pause();
					} else {
						game.delay();
					}
					if (game.me.isDead()) {
						event.swapNow = true;
					}
					"step 1";
					game.uncheck();
					var player = game.addChessPlayer(event.playername, event.enemy);
					game.log(player, "加入游戏");
					player.chessFocus();
					player.playerfocus(1000);
					game.delay(2);
					if (event.swapNow && player.side == game.me.side) {
						game.modeSwapPlayer(player);
					}
				},
				chooseToMoveChess: function () {
					"step 0";
					if (!player.movable(0, 1) && !player.movable(0, -1) && !player.movable(1, 0) && !player.movable(-1, 0)) {
						return;
					}
					event.switchToAuto = function () {
						if (ui.movegrids) {
							while (ui.movegrids.length) {
								ui.movegrids.shift().delete();
							}
						}
						var list = [];
						var randomMove = ["moveUp", "moveDown", "moveLeft", "moveRight"];
						var getMove = function (move) {
							switch (move) {
								case "moveUp":
									return "moveDown";
								case "moveDown":
									return "moveUp";
								case "moveLeft":
									return "moveRight";
								case "moveRight":
									return "moveLeft";
							}
						};
						var dontMove = null;
						for (var iwhile = 0; iwhile < num; iwhile++) {
							if (get.mode() == "tafang" && _status.enemies.includes(player)) {
								var targets2 = [];
								for (var i = 0; i < ui.chesswidth; i++) {
									var tafangdes = ui.chesswidth * (ui.chessheight - 1) + i;
									if (!lib.posmap[tafangdes]) {
										targets2.push(tafangdes);
									}
								}
								targets2.sort(function (a, b) {
									return Math.abs((a % ui.chesswidth) - player.getXY()[0]) - Math.abs((b % ui.chesswidth) - player.getXY()[0]);
								});
								var tafangmoved = false;
								for (var i = 0; i < targets2.length; i++) {
									if (player.moveTowards(targets2[i].toString())) {
										tafangmoved = true;
										break;
									}
								}
								if (tafangmoved) {
									event.moved = true;
								}
							} else {
								var targets = game.filterPlayer(function (current) {
									return current.side != player.side && current.isIn();
								});
								targets.sort(function (a, b) {
									return get.distance(player, a) - get.distance(player, b);
								});
								while (targets.length) {
									var target = targets.shift();
									var moveTowards = player.moveTowards(target, [dontMove]);
									if (moveTowards) {
										dontMove = getMove(moveTowards);
										randomMove.remove(dontMove);
										event.moved = true;
										break;
									}
									if (targets.length == 0) {
										if (randomMove.length) {
											var list = randomMove.slice(0);
											while (list.length) {
												var thismove = list.randomRemove();
												if (player[thismove]()) {
													event.moved = true;
													dontMove = getMove(thismove);
													randomMove.remove(dontMove);
													break;
												}
												if (list.length == 0) return;
											}
										} else {
											return;
										}
									}
								}
								if (lib.skill._chessmove.ai.result.player(player) <= 0) break;
							}
						}
					};
					if (event.isMine()) {
						if (event.prompt) {
							event.dialog = ui.create.dialog(event.prompt);
						}
						var resume = function () {
							if (ui.movegrids) {
								while (ui.movegrids.length) {
									ui.movegrids.shift().delete();
								}
							}
							event.result = { bool: false };
							game.resume();
						};
						if (event.phasing) {
							event.custom.replace.confirm = resume;
						} else {
							event.control = ui.create.control("取消", resume);
						}
						game.pause();
						_status.imchoosing = true;
						ui.movegrids = [];
						player.createRangeShadow(num, true);
						for (var i = 0; i < ui.movegrids.length; i++) {
							var grid = ui.movegrids[i];
							if (game.isChessNeighbour(grid, player)) continue;
							for (var j = 0; j < ui.movegrids.length; j++) {
								if (game.isChessNeighbour(grid, ui.movegrids[j])) break;
							}
							if (j == ui.movegrids.length) grid.remove();
						}
					} else {
						event.switchToAuto();
					}
					"step 1";
					_status.imchoosing = false;
					if (event.moved) {
						game.delay();
						event.result = {
							bool: true,
							move: player.dataset.position,
						};
					}
					if (!event.result) {
						event.result = {
							bool: false,
						};
					}
					if (event.control) {
						event.control.close();
					}
					if (event.dialog) {
						event.dialog.close();
					}
				},
			},
		},
		game: {
			minskin: true,
			singleHandcard: true,
			chess: true,
			treasures: [],
			obstacles: [],
			initChess: function () {
				ui.chess.style.height = 148 * ui.chessheight + "px";
				ui.chess.style.width = 148 * ui.chesswidth + "px";
				ui.chessContainer.xmax = Math.max(0, 148 * ui.chesswidth - ui.chessContainer.offsetWidth);
				ui.chessContainer.ymax = Math.max(0, 148 * ui.chessheight - ui.chessContainer.offsetHeight) + 72;
				if (lib.config.show_history == "right") {
					ui.chessContainer.xmax += 50;
				}
				lib.onresize.push(function () {
					ui.chessContainer.xmax = Math.max(0, 148 * ui.chesswidth - ui.chessContainer.offsetWidth);
					ui.chessContainer.ymax = Math.max(0, 148 * ui.chessheight - ui.chessContainer.offsetHeight) + 72;
					if (lib.config.show_history == "right") {
						ui.chessContainer.xmax += 50;
					}
				});
				if (!lib.config.touchscreen) {
					ui.chess.addEventListener("mousedown", function (e) {
						if (Array.isArray(e.path)) {
							for (var i = 0; i < e.path.length; i++) {
								var itemtype = get.itemtype(e.path[i]);
								if (itemtype == "button" || itemtype == "card" || itemtype == "player") {
									return;
								}
							}
						}
						this._chessdrag = [e, this.parentNode.chessLeft, this.parentNode.chessTop];
					});
					ui.chess.addEventListener("mouseleave", function () {
						this._chessdrag = null;
					});
					ui.chess.addEventListener("mouseup", function () {
						if (this._chessdrag) {
							this._chessdrag = null;
						}
					});
					ui.chess.addEventListener("mousemove", function (e) {
						if (_status.mousedragging) return;
						if (this._chessdrag) {
							ui.chessContainer.move(this._chessdrag[1] - e.x + this._chessdrag[0].x - ui.chessContainer.chessLeft, this._chessdrag[2] - e.y + this._chessdrag[0].y - ui.chessContainer.chessTop);
							// this.parentNode.scrollLeft=this._chessdrag[1]-e.x+this._chessdrag[0].x;
							// this.parentNode.scrollTop=this._chessdrag[2]-e.y+this._chessdrag[0].y;
							_status.clicked = true;
						}
						e.preventDefault();
					});
					ui.chess.addEventListener("wheel", function (e) {
						ui.chessContainer.move(e.deltaX, e.deltaY);
						e.preventDefault();
					});
					// ui.chessContainer.addEventListener('mousewheel',function(){
					// 	if(_status.currentChessFocus){
					// 		cancelAnimationFrame(_status.currentChessFocus);
					// 		delete _status.currentChessFocus;
					// 	}
					// },{passive:true});
				} else {
					ui.chess.addEventListener("touchstart", function (e) {
						if (e.touches.length == 1) {
							this._chessdrag = [e, this.parentNode.chessLeft, this.parentNode.chessTop];
						}
					});
					ui.chess.addEventListener("touchend", function () {
						this._chessdrag = null;
					});
					ui.chess.addEventListener("touchmove", function (e) {
						if (_status.mousedragging) return;
						if (this._chessdrag && e.touches.length == 1) {
							ui.chessContainer.move(this._chessdrag[1] - e.touches[0].clientX + this._chessdrag[0].touches[0].clientX - ui.chessContainer.chessLeft, this._chessdrag[2] - e.touches[0].clientY + this._chessdrag[0].touches[0].clientY - ui.chessContainer.chessTop);
							_status.clicked = true;
						}
						e.preventDefault();
					});
				}

				ui.chessscroll1 = ui.create.div(".chessscroll.left", ui.chessContainer);
				ui.chessscroll2 = ui.create.div(".chessscroll.right", ui.chessContainer);
				var chessscroll = function () {
					if (lib.config.touchscreen) return;
					var direction = this.direction;
					var speed = parseInt(get.config("chessscroll_speed"));
					if (!speed) return;
					var interval = setInterval(function () {
						ui.chessContainer.move(speed * direction);
						// ui.chessContainer.chessLeft+=speed*direction;
					}, 16);
					_status.chessscrolling = interval;
				};
				var leavescroll = function () {
					if (_status.chessscrolling) {
						clearInterval(_status.chessscrolling);
						delete _status.chessscrolling;
					}
				};
				ui.chessscroll1.direction = -1;
				ui.chessscroll1.addEventListener("mouseenter", chessscroll);
				ui.chessscroll1.addEventListener("mouseleave", leavescroll);

				ui.chessscroll2.direction = 1;
				ui.chessscroll2.addEventListener("mouseenter", chessscroll);
				ui.chessscroll2.addEventListener("mouseleave", leavescroll);

				for (var i = 0; i < ui.chesswidth; i++) {
					for (var j = 0; j < ui.chessheight; j++) {
						var pos = '[data-position="' + (i + j * ui.chesswidth) + '"]';
						// ui.chesssheet.sheet.insertRule('#arena.chess #chess>.player'+pos+
						// '{left:'+(14+i*148)+'px;top:'+(14+j*148)+'px}',0);
						ui.chesssheet.sheet.insertRule("#arena.chess #chess>.card" + pos + "{left:" + (22 + i * 148) + "px;top:" + (22 + j * 148) + "px}", 0);
						ui.chesssheet.sheet.insertRule("#arena.chess #chess>.popup" + pos + "{left:" + (19 + i * 148) + "px;top:" + (142 + j * 148) + "px}", 0);
					}
				}
			},
			getVideoName: function () {
				var str = "战棋" + get.translation(_status.mode) + " - " + _status.friendCount + "v" + _status.enemyCount;
				var name = [get.translation(game.me.name), str];
				return name;
			},
			addChessPlayer: function (name, enemy, num, pos) {
				if (typeof num != "number") {
					num = 4;
				}
				var player = ui.create.player();
				player.getId();
				if (enemy == "treasure") {
					player.addTempClass("judgestart");
					player.side = null;
					player.identity = "neutral";
					player.setIdentity();
					player.node.identity.dataset.color = "zhong";
					player.classList.add("treasure");
					player.node.hp.classList.add("treasure");
					player.life = 6 + Math.floor(Math.random() * 6);
					game.treasures.add(player);
				} else {
					player.addTempClass("start");
					if (enemy) {
						if (get.mode() == "tafang") {
							player.side = true;
						} else {
							player.side = !game.me.side;
						}
						player.setIdentity("enemy");
						player.identity = "enemy";
					} else {
						if (get.mode() == "tafang") {
							player.side = false;
						} else {
							player.side = game.me.side;
						}
						player.setIdentity("friend");
						player.identity = "friend";
					}
					player.node.identity.dataset.color = get.translation(player.side + "Color");
					game.players.push(player);
					// if(lib.config.animation){
					// 	setTimeout(function(){
					// 		player.$rare2();
					// 	},300);
					// }
				}
				ui.chess.appendChild(player);
				if (_status.video || (pos && !lib.posmap[pos])) {
					ui.placeChess(player, pos);
				} else {
					var grids = [];
					var gridnum = ui.chessheight * ui.chesswidth;
					for (var i = 0; i < gridnum; i++) {
						grids.push(i);
					}
					for (var i = 0; i < game.players.length; i++) {
						grids.remove(parseInt(game.players[i].dataset.position));
					}
					for (var i = 0; i < game.obstacles.length; i++) {
						grids.remove(parseInt(game.obstacles[i].dataset.position));
					}
					for (var i = 0; i < game.treasures.length; i++) {
						grids.remove(parseInt(game.treasures[i].dataset.position));
					}
					ui.placeChess(player, grids.randomGet());
				}
				lib.posmap[player.dataset.position] = player;
				game.addVideo("addChessPlayer", null, [name, enemy, num, player.dataset.position]);
				player.init(name);
				if (num && !_status.video) {
					player.directgain(get.cards(num));
				}
				game.arrangePlayers();
				player.chessFocus();
				if (game.me && game.me.name) {
					game.setChessInfo();
				} else if (game.players.length) {
					game.setChessInfo(game.players[0]);
				}

				game.triggerEnter(player);

				return player;
			},
			replaceChessPlayer: function (name, enemy) {
				var next = game.createEvent("replaceChessPlayer");
				next.playername = name;
				next.enemy = enemy;
				next.setContent("replaceChessPlayer");
			},
			removeTreasure: function (player) {
				game.addVideo("removeTreasure", null, player.dataset.position);
				player.delete();
				delete lib.posmap[player.dataset.position];
				game.treasures.remove(player);
			},
			addObstacle: function (x, y) {
				if (y !== false) {
					game.addVideo("addObstacle", null, [x, y]);
				}
				var pos;
				if (typeof x == "string") {
					pos = x;
				} else {
					if (x >= ui.chesswidth) {
						x = ui.chesswidth - 1;
					}
					if (y >= ui.chessheight) {
						y = ui.chessheight - 1;
					}

					pos = y * ui.chesswidth + x;
				}
				if (!lib.posmap[pos]) {
					var grid = ui.create.div(".player.minskin.obstacle", ui.chess).addTempClass("start");
					ui.placeChess(grid, pos);
					grid.listen(ui.click.obstacle);
					lib.posmap[pos] = grid;
					game.obstacles.push(grid);
					return grid;
				}
				return null;
			},
			addTempObstacle: function (x, y, num) {
				var node = game.addObstacle(x, y);
				if (node) {
					game.colorObstacle(node, "blue");
					node.tempObstacle = num;
				}
			},
			removeObstacle: function (pos) {
				if (get.is.div(pos)) {
					pos = pos.dataset.position;
				}
				var node = lib.posmap[pos];
				if (node && game.obstacles.includes(node)) {
					game.addVideo("removeObstacle", null, pos);
					game.obstacles.remove(node);
					delete lib.posmap[pos];
					node.delete();
				}
			},
			moveObstacle: function (pos, x, y) {
				if (get.is.div(pos)) {
					pos = pos.dataset.position;
				}
				var node = lib.posmap[pos];
				if (node && game.obstacles.includes(node)) {
					pos = parseInt(pos);
					var x2 = (pos % ui.chesswidth) + x;
					var y2 = Math.floor(pos / ui.chesswidth) + y;
					if (x2 >= ui.chesswidth) {
						x2 = ui.chesswidth - 1;
					}
					if (y2 >= ui.chessheight) {
						y2 = ui.chessheight - 1;
					}
					if (x2 < 0) {
						x2 = 0;
					}
					if (y2 < 0) {
						y2 = 0;
					}
					var pos2 = y2 * ui.chesswidth + x2;
					if (!lib.posmap[pos2]) {
						game.addVideo("moveObstacle", null, [pos, x, y]);
						ui.placeChess(node, pos2);
						delete lib.posmap[pos];
						lib.posmap[pos2] = node;
						return true;
					}
				}
				return false;
			},
			colorObstacle: function (pos, color) {
				if (get.is.div(pos)) {
					pos = pos.dataset.position;
				}
				var node = lib.posmap[pos];
				if (node && game.obstacles.includes(node)) {
					game.addVideo("colorObstacle", null, [pos, color]);
					node.dataset.obscolor = color;
				}
			},
			addOverDialog: function (dialog, result) {
				if (ui.finishGame) {
					ui.finishGame.remove();
				}
				dialog.classList.add("center");
				if (_status.mode != "leader") return;
				if (result == "战斗胜利") {
					_status.victory = true;
					if (!_status.enterArena) {
						var div = ui.create.div();
						div.innerHTML = "获得" + game.reward + "金";
						dialog.add(div);
						if (_status.challenge && _status.challengeMoney <= game.data.dust) {
							var div2 = ui.create.div();
							div2.style.display = "block";
							div2.innerHTML = "招降所需招募令：" + _status.challengeMoney + "/" + game.data.dust;
							dialog.add(div2);
						}
						game.changeMoney(game.reward);
						game.saveData();
					}
				} else if (_status.zhaoxiang) {
					var div = ui.create.div();
					div.innerHTML = "招降" + get.translation(_status.zhaoxiang) + "成功";
					dialog.add(div);
				}
			},
			controlOver: function () {
				if (_status.mode == "three") {
					ui.create.control("再战", function () {
						game.saveConfig("continue_name_chess", {
							friend: _status.friendBackup,
							enemy: _status.enemyBackup,
							color: _status.color,
						});
						game.saveConfig("mode", lib.config.mode);
						localStorage.setItem(lib.configprefix + "directstart", true);
						game.reload();
					});
				}
				ui.create.control("返回", game.reload);
				if (_status.mode != "leader") return;
				if (_status.enterArena) {
					game.data.arena.acted.length = 0;
					if (_status.victory) {
						game.data.arena.win++;
						for (var i = 0; i < game.players.length; i++) {
							if (_status.arenaAdd && _status.arenaAdd.includes(game.players[i].name)) {
								continue;
							}
							if (game.data.arena.dead.includes(game.players[i].name)) {
								game.data.arena.dead.remove(game.players[i].name);
								game.data.arena.acted.push(game.players[i].name);
							}
						}
					}
					game.saveData();
				} else {
					if (_status.challenge && (_status.zhaoxiang || _status.victory)) {
						game.data.challenge = game.getLeaderList();
						game.saveData();
					}
					if (_status.challenge && !_status.zhaoxiang && _status.victory) {
						var money = _status.challengeMoney;
						if (game.data.dust >= money) {
							ui.create.control("招降" + get.translation(_status.challenge), function () {
								game.data.character.add(_status.challenge);
								game.data.challenge = game.getLeaderList();
								game.changeDust(-money);
								game.reload();
							});
						}
					}
				}
			},
			phaseLoopThree: function (player) {
				var next = game.createEvent("phaseLoop");
				next.player = player;
				(next.swap = function (player) {
					if (player.side == game.me.side) {
						return game.enemyZhu;
					} else {
						return game.me;
					}
				}),
					next.setContent(function () {
						"step 0";
						player.classList.add("acted");
						player.phase();
						"step 1";
						if (player != game.friendZhu && player != game.enemyZhu) {
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].side == player.side && game.players[i] != game.friendZhu && game.players[i] != game.enemyZhu && game.players[i] != player && !game.players[i].classList.contains("acted")) {
									game.players[i].classList.add("acted");
									game.players[i].phase();
									break;
								}
							}
						}
						"step 2";
						var target = event.swap(player);
						var swap = [],
							swap2 = [];
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].isOut()) continue;
							if (!game.players[i].classList.contains("acted")) {
								if (game.players[i].side == target.side) {
									swap.push(game.players[i]);
								} else {
									swap2.push(game.players[i]);
								}
							}
						}
						if (swap.length == 0) {
							if (swap2.length) {
								target = event.swap(target);
								swap = swap2;
							} else {
								for (var i = 0; i < game.players.length; i++) {
									if (game.players[i].isOut()) continue;
									game.players[i].classList.remove("acted");
								}
								delete _status.roundStart;
								event.redo();
								game.delay();
								return;
							}
						}
						if (swap.length == 1) {
							event.directresult = swap[0];
						} else {
							var rand = Math.random();
							var next = target.chooseTarget("选择行动的角色", true, function (card, player, target2) {
								return target2.side == target.side && !target2.classList.contains("acted");
							});
							next._triggered = null;
							next.includeOut = true;
							next.ai = function (target2) {
								var num = 0;
								if (target2.countCards("j")) {
									num -= 5;
								}
								if (target2 != game.friendZhu && target2 != game.enemyZhu) {
									for (var i = 0; i < game.players.length; i++) {
										if (game.players[i] != game.friendZhu && game.players[i] != game.enemyZhu && game.players[i] != target2 && game.players[i].side == target2.side && game.players[i].countCards("j")) {
											num -= 2;
										}
									}
								}
								if (rand < 1 / 3) {
									num += 1 / (target2.hp + 1);
								} else if (rand < 2 / 3) {
									num += target2.countCards("h") / 5;
								}
								return num;
							};
						}
						"step 3";
						if (event.directresult) {
							event.player = event.directresult;
							delete event.directresult;
						} else if (result.bool) {
							event.player = result.targets[0];
						}
						event.goto(0);
					});
			},
			phaseLoopOrdered: function (player) {
				var next = game.createEvent("phaseLoop");
				next.player = player;
				next.setContent(function () {
					"step 0";
					if (
						!game.hasPlayer(function (current) {
							return current.side == player.side && !current.classList.contains("acted");
						})
					) {
						var num1 = 0;
						var next = null;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].side == player.side) {
								game.players[i].classList.remove("acted");
								num1++;
							} else if (!next) {
								next = game.players[i];
							}
						}
						if (_status.roundStart && _status.roundStart.side == player.side) {
							delete _status.roundStart;
						}
						var num2 = game.players.length - num1;
						if (num2 > num1) {
							if (next.side == game.me.side) {
								next = game.me;
							}
							var str;
							if (num2 - num1 > 1) {
								str = "选择至多" + get.cnNumber(num2 - num1) + "个已方角色各摸一张牌";
							} else {
								str = "选择一个已方角色摸一张牌";
							}
							var nevt = player.chooseTarget(
								str,
								function (card, player, target) {
									return target.side == player.side;
								},
								[1, num2 - num1]
							);
							nevt.ai = function (target) {
								return Math.max(1, 10 - target.countCards("h"));
							};
							nevt.includeOut = true;
							nevt.chessForceAll = true;
						} else {
							game.delay();
							event.goto(2);
						}
					} else {
						event.goto(2);
					}
					"step 1";
					if (result.bool) {
						game.asyncDraw(result.targets);
					}
					"step 2";
					if (player.side == game.me.side) {
						player = game.me;
					}
					if (player.isDead()) {
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].side == player.side) {
								player = game.players[i];
							}
						}
					}
					var players = game.filterPlayer(function (current) {
						return player.side == current.side && !current.classList.contains("acted");
					});
					if (players.length > 1) {
						var nevt = player.chooseTarget(
							"选择下一个行动的角色",
							function (card, player, target) {
								return target.side == player.side && !target.classList.contains("acted");
							},
							true
						);
						nevt.chessForceAll = true;
						nevt.includeOut = true;
						nevt.ai = function (target) {
							var nj = target.countCards("j");
							if (nj) {
								return -nj;
							}
							return Math.max(0, 10 - target.hp);
						};
					} else if (players.length) {
						event.decided = players[0];
					} else {
						event.player = game.findPlayer(function (current) {
							return current.side != player.side;
						});
						event.goto(0);
					}
					"step 3";
					if (event.decided) {
						event.decided.phase();
						event.justacted = event.decided;
						delete event.decided;
					} else {
						var current = result.targets[0];
						current.phase();
						event.justacted = current;
					}
					"step 4";
					event.justacted.classList.add("acted");
					event.goto(0);
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != event.justacted.side) {
							event.player = game.players[i];
							break;
						}
					}
					if (Math.random() < parseFloat(get.config("chess_treasure"))) {
						var list = [];
						for (var i = 0; i < game.treasures.length; i++) {
							list.push(game.treasures[i].name);
						}
						if (list.length < lib.treasurelist.length) {
							var name = Array.prototype.randomGet.apply(lib.treasurelist, list);
							var treasure = game.addChessPlayer(name, "treasure", 0);
							treasure.playerfocus(1500);
							if (lib.config.animation && !lib.config.low_performance) {
								setTimeout(function () {
									treasure.$rare2();
								}, 500);
							}
							game.delay(3);
						}
					}
					for (var i = 0; i < game.treasures.length; i++) {
						game.treasures[i].life--;
						if (game.treasures[i].life <= 0) {
							game.removeTreasure(game.treasures[i--]);
						}
					}
				});
			},
			isChessNeighbour: function (a, b) {
				if (a && a.dataset) {
					a = a.dataset.position;
				}
				if (b && b.dataset) {
					b = b.dataset.position;
				}
				var ax = a % ui.chesswidth;
				var ay = Math.floor(a / ui.chesswidth);

				var bx = b % ui.chesswidth;
				var by = Math.floor(b / ui.chesswidth);

				if (ax == bx && Math.abs(ay - by) == 1) return true;
				if (ay == by && Math.abs(ax - bx) == 1) return true;

				return false;
			},
			draw2: function (func) {
				lib.canvasUpdates2.push(func);
				if (!lib.status.canvas2) {
					lib.status.canvas2 = true;
					game.update(game.updateCanvas2);
				}
			},
			updateCanvas2: function (time) {
				if (lib.canvasUpdates2.length === 0) {
					lib.status.canvas2 = false;
					return false;
				}
				ui.canvas2.width = ui.chess.offsetWidth;
				ui.canvas2.height = ui.chess.offsetHeight;
				ui.canvas2.style.left = 0;
				ui.canvas2.style.top = 0;
				var ctx = ui.ctx2;
				ctx.shadowBlur = 5;
				ctx.shadowColor = "rgba(0,0,0,0.3)";
				ctx.fillStyle = "white";
				ctx.strokeStyle = "white";
				ctx.lineWidth = 3;
				ctx.save();
				for (var i = 0; i < lib.canvasUpdates2.length; i++) {
					ctx.restore();
					ctx.save();
					var update = lib.canvasUpdates2[i];
					if (!update.starttime) {
						update.starttime = time;
					}
					if (update(time - update.starttime, ctx) === false) {
						lib.canvasUpdates2.splice(i--, 1);
					}
				}
			},
			setChessInfo: function (p) {
				if (!p) {
					if (ui.phasequeue && ui.phasequeue.length) {
						p = ui.phasequeue[0].link;
					} else {
						p = game.me;
					}
				}
				ui.chessinfo.firstChild.innerHTML = "";
				ui.phasequeue = [];
				for (var i = 0; i < game.players.length; i++) {
					var node = ui.create.div(".avatar", ui.chessinfo.firstChild);
					node.style.backgroundImage = p.node.avatar.style.backgroundImage;
					node.link = p;
					node.listen(ui.click.chessInfo);
					lib.setIntro(node);
					node.linkplayer = true;
					p.instance = node;
					if (_status.currentPhase == p) {
						node.classList.add("glow2");
					}
					ui.phasequeue.push(node);
					p = p.next;
				}
			},
			initLeaderSave: function (save) {
				game.save(save, {
					money: 300,
					dust: 0,
					legend: 0,
					character: [],
				});
			},
			leaderView: function () {
				var next = game.createEvent("leaderView", false);
				next.setContent(function () {
					"step 0";
					var save = get.config("chess_leader_save");
					if (!save) {
						save = "save1";
					}
					if (!lib.storage[save]) {
						game.initLeaderSave(save);
					}
					game.data = lib.storage[save];
					ui.wuxie.hide();
					ui.auto.hide();
					ui.money = ui.create.div(ui.window);
					lib.setIntro(ui.money, function (uiintro) {
						uiintro.add('<span style="font-family:xinwei">' + game.data.money + "金币");
						uiintro.addText("通过战斗或竞技场可获得金币。花费100金币可招募3名随机武将；花费150金币可参加一次竞技场");
						uiintro.add('<span style="font-family:xinwei">' + game.data.dust + "招募令");
						uiintro.addText("通过遣返武将或竞技场可获得招募令。挑战武将成功后可通过招募令招募该武将，普通/稀有/史诗/传说武将分别花费40/100/400/1600招募令");
					});
					ui.money.innerHTML = "<span>⚑</span><span>" + game.data.dust + "</span>" + "<span>㉤</span><span>" + game.data.money + "</span>";
					ui.money.style.top = "auto";
					ui.money.style.left = "auto";
					ui.money.style.right = "20px";
					ui.money.style.bottom = "15px";
					ui.money.childNodes[0].style.color = "rgb(111, 198, 255)";
					ui.money.childNodes[1].style.fontFamily = "huangcao";
					ui.money.childNodes[1].style.marginRight = "10px";
					ui.money.childNodes[2].style.color = "#FFE600";
					ui.money.childNodes[3].style.fontFamily = "huangcao";
					ui.money.style.letterSpacing = "4px";
					if (get.config("chess_leader_allcharacter")) {
						for (var i in lib.rank) {
							if (Array.isArray(lib.rank[i])) {
								for (var j = 0; j < lib.rank[i].length; j++) {
									if (!lib.character[lib.rank[i][j]]) {
										lib.rank[i].splice(j--, 1);
									}
								}
							}
						}
						for (var i in lib.rank.rarity) {
							if (Array.isArray(lib.rank.rarity[i])) {
								for (var j = 0; j < lib.rank.rarity[i].length; j++) {
									if (!lib.character[lib.rank.rarity[i][j]]) {
										lib.rank.rarity[i].splice(j--, 1);
									}
								}
							}
						}
					} else {
						var list = get.gainableCharacters().filter(function (i) {
							return i.indexOf("leader_") != 0;
						});
						list.randomSort();
						for (var i in lib.rank.rarity) {
							if (Array.isArray(lib.rank.rarity[i])) {
								for (var j = 0; j < lib.rank.rarity[i].length; j++) {
									if (!list.includes(lib.rank.rarity[i][j]) || !lib.character[lib.rank.rarity[i][j]]) {
										lib.rank.rarity[i].splice(j--, 1);
									}
								}
							}
						}
						for (var i in lib.rank) {
							if (Array.isArray(lib.rank[i])) {
								for (var j = 0; j < lib.rank[i].length; j++) {
									if (!list.includes(lib.rank[i][j])) {
										lib.rank[i].splice(j--, 1);
									}
								}
							}
						}
						//var length=Math.ceil(list.length/9);
						//for(var i in lib.rank){
						//	if(Array.isArray(lib.rank[i])){
						//		lib.rank[i]=list.splice(0,length);
						//	}
						//}
					}
					"step 1";
					lib.rank.all = lib.rank.s.concat(lib.rank.ap).concat(lib.rank.a).concat(lib.rank.am).concat(lib.rank.bp).concat(lib.rank.b).concat(lib.rank.bm).concat(lib.rank.c).concat(lib.rank.d);
					lib.rank.rarity.common = [];
					for (var i = 0; i < lib.rank.all.length; i++) {
						if (!lib.rank.rarity.legend.includes(lib.rank.all[i]) && !lib.rank.rarity.epic.includes(lib.rank.all[i]) && !lib.rank.rarity.rare.includes(lib.rank.all[i])) {
							lib.rank.rarity.common.push(lib.rank.all[i]);
						}
					}

					ui.control.style.transition = "all 0s";
					if (get.is.phoneLayout()) {
						ui.control.style.top = "calc(100% - 80px)";
					} else {
						ui.control.style.top = "calc(100% - 70px)";
					}
					var cardNode = function (i, name, load) {
						var node = ui.create.player(ui.window);
						node.style.transition = "all 0.7s";
						node.style.opacity = 0;
						node.style.zIndex = 4;
						node.classList.add("pointerdiv");

						var kaibao = false;
						if (!name || typeof i == "string") {
							if (!name) {
								name = game.getLeaderCharacter();
								event.cardnodes.push(node);
							} else {
								node.classList.add("minskin");
							}
							kaibao = true;
							node.style.left = "calc(50% - 75px)";
							node.style.top = "calc(50% - 90px)";
							ui.refresh(node);
						} else if (!load) {
							node.style.transform = "perspective(1200px) rotateY(180deg) translate(0,-200px)";
						}
						node.name = name;
						if (!load) {
							switch (i) {
								case 0: {
									node.style.left = "calc(50% - 75px)";
									node.style.top = "calc(25% - 90px)";
									break;
								}
								case 1: {
									node.style.left = "calc(30% - 90px)";
									node.style.top = "calc(75% - 90px)";
									break;
								}
								case 2: {
									node.style.left = "calc(70% - 60px)";
									node.style.top = "calc(75% - 90px)";
									break;
								}
								case "51": {
									node.style.left = "calc(50% - 60px)";
									node.style.top = "calc(25% - 75px)";
									break;
								}
								case "52": {
									node.style.left = "calc(35% - 55px)";
									node.style.top = "calc(75% - 25px)";
									break;
								}
								case "53": {
									node.style.left = "calc(65% - 65px)";
									node.style.top = "calc(75% - 25px)";
									break;
								}
								case "54": {
									node.style.left = "calc(25% - 75px)";
									node.style.top = "calc(50% - 70px)";
									break;
								}
								case "55": {
									node.style.left = "calc(75% - 45px)";
									node.style.top = "calc(50% - 70px)";
									break;
								}
							}
							if (!kaibao) {
								node.style.top = "calc(50% - 180px)";
								ui.refresh(node);
							}
							node.style.opacity = 1;
						}
						node.node.count.remove();
						node.node.marks.remove();
						var rarity = game.getRarity(name);
						if (rarity != "common") {
							node.rarity = rarity;
							node.node.intro.style.left = "14px";
							if (node.classList.contains("minskin")) {
								node.node.intro.style.top = "84px";
							} else {
								node.node.intro.style.top = "145px";
							}
							node.node.intro.style.fontSize = "20px";
							node.node.intro.style.fontFamily = "yuanli";
							switch (rarity) {
								case "rare":
									node.node.intro.dataset.nature = "thunderm";
									break;
								case "epic":
									node.node.intro.dataset.nature = "metalm";
									break;
								case "legend":
									node.node.intro.dataset.nature = "orangem";
									break;
							}
						}
						if (kaibao) {
							node.node.avatar.style.display = "none";
							node.style.transform = "perspective(1200px) rotateY(180deg) translateX(0)";
							if (typeof i == "string") {
								node.listen(event.turnCard2);
							} else {
								node.listen(turnCard);
								if (!game.data.character.includes(name)) {
									game.data.character.push(name);
									if (game.data.challenge.includes(name)) {
										game.data.challenge = game.getLeaderList();
										game.saveData();
									}
									var button = ui.create.button(name, "character");
									button.classList.add("glow2");
									dialog1.content.lastChild.insertBefore(button, dialog1.content.lastChild.firstChild);
									dialog1.buttons.push(button);
									fixButton(button);
									button.area = "character";
								} else {
									switch (rarity) {
										case "common":
											game.data.dust += 10;
											break;
										case "rare":
											game.data.dust += 30;
											break;
										case "epic":
											game.data.dust += 150;
											break;
										case "legend":
											game.data.dust += 600;
											break;
									}
								}
							}
						} else {
							node.style.transform = "";
						}
						return node;
					};
					event.cardNode = cardNode;
					if (game.data.arena) {
						ui.money.style.display = "none";
						_status.enterArena = true;
						return;
					}
					var groupSort = function (name) {
						if (lib.character[name][1] == "wei") return 0;
						if (lib.character[name][1] == "shu") return 1;
						if (lib.character[name][1] == "wu") return 2;
						if (lib.character[name][1] == "qun") return 3;
						if (lib.character[name][1] == "key") return 4;
					};
					game.data.character = game.data.character.filter(function (i) {
						return get.is.object(lib.character[i]);
					});
					game.data.character.sort(function (a, b) {
						var del = groupSort(a) - groupSort(b);
						if (del != 0) return del;
						var aa = a,
							bb = b;
						if (a.indexOf("_") != -1) {
							a = a.slice(a.indexOf("_") + 1);
						}
						if (b.indexOf("_") != -1) {
							b = b.slice(b.indexOf("_") + 1);
						}
						if (a != b) {
							return a > b ? 1 : -1;
						}
						return aa > bb ? 1 : -1;
					});
					if (game.data.character.length == 0 || !game.data.challenge) {
						game.data.character = lib.rank.rarity.common.randomGets(3);
						game.data.challenge = game.getLeaderList();
						game.saveData();
					}
					var fixButton = function (button) {
						var rarity = game.getRarity(button.link);
						if (rarity != "common") {
							var intro = button.node.intro;
							intro.classList.add("showintro");
							intro.style.fontFamily = "yuanli";
							intro.style.fontSize = "20px";
							intro.style.top = "82px";
							intro.style.left = "2px";
							switch (rarity) {
								case "rare":
									intro.dataset.nature = "thunderm";
									break;
								case "epic":
									intro.dataset.nature = "metalm";
									break;
								case "legend":
									intro.dataset.nature = "orangem";
									break;
							}
							intro.innerHTML = get.translation(rarity);
						}
					};
					game.leaderLord = ["leader_caocao", "leader_liubei", "leader_sunquan", "leader_yuri"];
					var dialog1 = ui.create.dialog("选择君主", "hidden");
					event.dialog1 = dialog1;
					dialog1.classList.add("fullheight");
					dialog1.classList.add("halfleft");
					dialog1.classList.add("fixed");
					dialog1.classList.add("pointerbutton");
					dialog1.add([game.leaderLord, "character"]);
					var i;
					for (i = 0; i < dialog1.buttons.length; i++) {
						dialog1.buttons[i].area = "lord";
					}
					var j = i;
					dialog1.add("选择武将");
					var getCapt = function (str) {
						if (str.indexOf("_") == -1) {
							return str[0];
						}
						return str[str.indexOf("_") + 1];
					};
					var clickCapt = function (e) {
						if (_status.dragged) return;
						if (this.classList.contains("thundertext")) {
							dialog1.currentcapt = null;
							dialog1.currentcaptnode = null;
							this.classList.remove("thundertext");
							for (var i = 0; i < dialog1.buttons.length; i++) {
								dialog1.buttons[i].style.display = "";
							}
						} else {
							if (dialog1.currentcaptnode) {
								dialog1.currentcaptnode.classList.remove("thundertext");
							}
							dialog1.currentcapt = this.link;
							dialog1.currentcaptnode = this;
							this.classList.add("thundertext");
							for (var i = 0; i < dialog1.buttons.length; i++) {
								if (dialog1.buttons[i].area != "character") continue;
								if (getCapt(dialog1.buttons[i].link) != dialog1.currentcapt) {
									dialog1.buttons[i].style.display = "none";
								} else {
									dialog1.buttons[i].style.display = "";
								}
							}
						}
						e.stopPropagation();
					};
					var captnode = ui.create.div(".caption");
					var initcapt = function () {
						var namecapt = [];
						for (var i = 0; i < game.data.character.length; i++) {
							var ii = game.data.character[i];
							if (namecapt.indexOf(getCapt(ii)) == -1) {
								namecapt.push(getCapt(ii));
							}
						}
						namecapt.sort(function (a, b) {
							return a > b ? 1 : -1;
						});
						captnode.innerHTML = "";
						for (i = 0; i < namecapt.length; i++) {
							var span = document.createElement("span");
							span.innerHTML = " " + namecapt[i].toUpperCase() + " ";
							span.link = namecapt[i];
							span.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickCapt);
							captnode.appendChild(span);
						}
						if (game.data.character.length <= 15) {
							captnode.style.display = "none";
						} else {
							captnode.style.display = "";
						}
					};
					initcapt();
					dialog1.captnode = captnode;
					dialog1.add(captnode);
					dialog1.add([game.data.character, "character"]);
					for (i = j; i < dialog1.buttons.length; i++) {
						dialog1.buttons[i].area = "character";
						fixButton(dialog1.buttons[i]);
					}
					dialog1.open();

					var dialog2 = ui.create.dialog("战斗难度", "hidden");
					event.dialog2 = dialog2;
					dialog2.classList.add("fullheight");
					dialog2.classList.add("halfright");
					dialog2.classList.add("fixed");
					dialog2.classList.add("pointerbutton");
					dialog2.add([
						[
							["", "", "leader_easy"],
							["", "", "leader_medium"],
							["", "", "leader_hard"],
						],
						"vcard",
					]);
					// for(i=0;i<dialog2.buttons.length;i++){
					// 	dialog2.buttons[i].node.name.style.fontFamily='xinwei';
					// 	dialog2.buttons[i].node.name.style.fontSize='30px';
					// 	dialog2.buttons[i].node.name.style.left='4px';
					// 	dialog2.buttons[i].node.name.dataset.color='unknownm';
					// 	dialog2.buttons[i]._nopup=true;
					// 	dialog2.buttons[i].area='difficulty';
					// }
					dialog2.add("敌方人数");
					dialog2.add([
						[
							["", "", "leader_2"],
							["", "", "leader_3"],
							["", "", "leader_5"],
							["", "", "leader_8"],
						],
						"vcard",
					]);
					for (i = 0; i < dialog2.buttons.length; i++) {
						dialog2.buttons[i].className = "menubutton large pointerdiv";
						dialog2.buttons[i].innerHTML = dialog2.buttons[i].node.background.innerHTML;
						dialog2.buttons[i].style.position = "relative";
						dialog2.buttons[i].style.fontSize = "";
						dialog2.buttons[i].style.color = "";
						dialog2.buttons[i].style.textShadow = "";
						dialog2.buttons[i]._nopup = true;
						dialog2.buttons[i].style.marginLeft = "4px";
						dialog2.buttons[i].style.marginRight = "4px";

						if (i < 3) {
							dialog2.buttons[i].area = "difficulty";
						} else {
							dialog2.buttons[i].area = "number";
						}
						// if(i<3){
						// 	dialog2.buttons[i].style.width='160px';
						// 	dialog2.buttons[i].node.background.classList.remove('tight');
						// 	dialog2.buttons[i].node.background.style.whiteSpace='nowrap';
						// }
						// dialog2.buttons[i].style.background='rgba(0,0,0,0.2)';
						// dialog2.buttons[i].style.boxShadow='rgba(0, 0, 0, 0.3) 0 0 0 1px';
						// dialog2.buttons[i].node.background.style.fontFamily='lishu';
						// dialog2.buttons[i]._nopup=true;
						// dialog2.buttons[i].area='number';
						// dialog2.buttons[i].classList.add('menubg');
						// dialog2.buttons[i].classList.add('large');
						// dialog2.buttons[i].classList.remove('card');
					}
					dialog2.add("挑战武将");
					dialog2.add([game.data.challenge, "character"]);
					for (; i < dialog2.buttons.length; i++) {
						dialog2.buttons[i].area = "challenge";
						fixButton(dialog2.buttons[i]);
					}
					dialog2.open();
					dialog1.classList.remove("hidden");

					var selected = {
						lord: [],
						character: [],
						difficulty: [],
						number: [],
						challenge: [],
					};
					var clearSelected = function () {
						for (var i = 0; i < dialog1.buttons.length; i++) {
							dialog1.buttons[i].classList.remove("unselectable");
							dialog1.buttons[i].classList.remove("selected");
						}
						for (var i = 0; i < dialog2.buttons.length; i++) {
							dialog2.buttons[i].classList.remove("unselectable");
							dialog2.buttons[i].classList.remove("selected");
						}
						for (var j in selected) {
							selected[j].length = 0;
						}
						event.removeCharacter.classList.add("disabled");
					};
					event.enterArena = ui.create.control("竞技场", "nozoom", function () {
						if (game.data.money < 150 && !game.data._arena) return;
						if (_status.qianfan || _status.kaibao) return;
						if (!game.data._arena) game.changeMoney(-150);
						_status.enterArena = true;
						game.resume();
					});
					var turnCard = function () {
						if (this.turned) return;
						_status.chessclicked = true;
						this.turned = true;
						var node = this;
						node.style.transition = "all ease-in 0.3s";
						node.style.transform = "perspective(1200px) rotateY(270deg) translateX(150px)";
						var onEnd = function () {
							game.minskin = false;
							node.init(node.name);
							game.minskin = true;
							node.node.avatar.style.display = "";
							if (node.rarity) {
								node.node.intro.innerHTML = get.translation(node.rarity);
								node.node.intro.classList.add("showintro");
							}
							node.classList.add("playerflip");
							node.style.transform = "none";
							node.style.transition = "";
							if (lib.config.animation && !lib.config.low_performance) {
								setTimeout(function () {
									switch (game.getRarity(node.name)) {
										case "rare":
											node.$rare();
											break;
										case "epic":
											node.$epic();
											break;
										case "legend":
											node.$legend();
											break;
									}
								}, 150);
							}
						};
						node.listenTransition(onEnd);
					};
					var zhaomu2 = function () {
						if (_status.qianfan || _status.kaibao) return;
						if (game.data.money < 100) return;
						_status.chessclicked = true;
						ui.arena.classList.add("leaderhide");
						ui.arena.classList.add("leadercontrol");
						ui.money.hide();
						_status.kaibao = true;
						event.cardnodes = [];
						setTimeout(function () {
							event.cardnodes.push(cardNode(0));
							setTimeout(function () {
								event.cardnodes.push(cardNode(1));
								setTimeout(function () {
									event.cardnodes.push(cardNode(2));
									ui.money.childNodes[1].innerHTML = game.data.dust;
									game.changeMoney(-100);
									if (game.data.character.length > 3 && selected.character.length) {
										event.removeCharacter.addTempClass("controlpressdownx", 500);
										event.removeCharacter.classList.remove("disabled");
									}
									if (game.data.money < 150 && !game.data._arena) {
										event.enterArena.classList.add("disabled");
									} else {
										event.enterArena.addTempClass("controlpressdownx", 500);
										event.enterArena.classList.remove("disabled");
									}
									if (game.data.money < 100) {
										event.addCharacter.classList.add("disabled");
									} else {
										event.addCharacter.addTempClass("controlpressdownx", 500);
										event.addCharacter.classList.remove("disabled");
									}
									initcapt();
								}, 200);
							}, 200);
						}, 500);
					};
					event.addCharacter = ui.create.control("招募", "nozoom", zhaomu2);
					if (game.data.money < 150 && !game.data._arena) {
						event.enterArena.classList.add("disabled");
					}
					if (game.data.money < 100) {
						event.addCharacter.classList.add("disabled");
					}
					var qianfan = function () {
						if (_status.kaibao) return;
						if (game.data.character.length <= 3) return;
						if (!selected.character.length) return;
						// _status.chessclicked=true;
						// _status.qianfan=true;
						// event.enterArena.style.opacity=0.5;
						// event.addCharacter.style.opacity=0.5;
						// event.fight.style.opacity=0.5;
						var current = selected.character.slice(0);
						clearSelected();
						var maxq = game.data.character.length - 3;
						if (current.length <= maxq) {
							for (var i = 0; i < current.length; i++) {
								current[i].classList.add("selected");
								selected.character.push(current[i]);
							}
						}
						for (var i = 0; i < dialog1.buttons.length; i++) {
							if (dialog1.buttons[i].area != "character" || maxq == current.length) {
								dialog1.buttons[i].classList.add("unselectable");
							}
						}
						for (var i = 0; i < dialog2.buttons.length; i++) {
							dialog2.buttons[i].classList.add("unselectable");
						}
						if (!selected.character.length) {
							alert("至少需要保留3名武将");
							return;
						}
						var translation = get.translation(selected.character[0].link);
						for (var i = 1; i < selected.character.length; i++) {
							translation += "、" + get.translation(selected.character[i].link);
						}
						var dust = 0;
						for (var i = 0; i < selected.character.length; i++) {
							var node = selected.character[i];
							var rarity = game.getRarity(node.link);
							switch (rarity) {
								case "common":
									dust += 5;
									break;
								case "rare":
									dust += 20;
									break;
								case "epic":
									dust += 100;
									break;
								case "legend":
									dust += 400;
									break;
							}
						}
						if (confirm(translation + "将被遣返，一共将获得" + dust + "个招募令。是否确定遣返？")) {
							for (var i = 0; i < selected.character.length; i++) {
								var node = selected.character[i];
								var rarity = game.getRarity(node.link);
								switch (rarity) {
									case "common":
										game.changeDust(5);
										break;
									case "rare":
										game.changeDust(20);
										break;
									case "epic":
										game.changeDust(100);
										break;
									case "legend":
										game.changeDust(400);
										break;
								}
								game.data.character.remove(node.link);
								game.saveData();
								if (game.data.money >= 100) {
									event.addCharacter.addTempClass("controlpressdownx", 500);
									event.addCharacter.classList.remove("disabled");
								}
								if (game.data.money >= 150) {
									event.enterArena.addTempClass("controlpressdownx", 500);
									event.enterArena.classList.remove("disabled");
								}
								node.delete();
								dialog1.buttons.remove(node);
							}
							initcapt();
						}
					};
					event.removeCharacter = ui.create.control("遣返", "nozoom", qianfan);
					event.removeCharacter.classList.add("disabled");
					event.fight = ui.create.control("开始战斗", "nozoom", function () {
						if (_status.kaibao || _status.qianfan) return;
						if (selected.challenge.length) {
							var cname = selected.challenge[0].link;
							var rarity = game.getRarity(cname);
							switch (rarity) {
								case "common":
									rarity = 40;
									break;
								case "rare":
									rarity = 100;
									break;
								case "epic":
									rarity = 400;
									break;
								case "legend":
									rarity = 1600;
									break;
							}
							if (!confirm("即将挑战" + get.translation(cname) + "，战斗胜利后可消耗" + rarity + "招募令招募该武将，无论是否招募，挑战列表将被刷新。是否继续？")) {
								return;
							}
						}
						_status.enemylist = [];
						_status.mylist = [];
						if (selected.lord.length) {
							_status.mylist.push(selected.lord[0].link);
							_status.lord = selected.lord[0].link;
						}
						if (selected.character.length) {
							for (var i = 0; i < selected.character.length; i++) {
								_status.mylist.push(selected.character[i].link);
							}
						} else {
							_status.mylist = _status.mylist.concat(game.data.character.randomGets(_status.lord ? 2 : 3));
						}
						var difficulty;
						if (selected.challenge.length) {
							_status.challenge = selected.challenge[0].link;
							_status.enemylist.push(_status.challenge);
							switch (game.getRarity(_status.challenge)) {
								case "common":
									_status.challengeMoney = 40;
									break;
								case "rare":
									_status.challengeMoney = 100;
									break;
								case "epic":
									_status.challengeMoney = 400;
									break;
								case "legend":
									_status.challengeMoney = 1600;
									break;
							}
							var rank = get.rank(_status.challenge);
							var total = Math.max(2, _status.mylist.length - 1);
							var list;
							switch (rank) {
								case "s":
									list = lib.rank.ap;
									break;
								case "ap":
									list = lib.rank.s.concat(lib.rank.a);
									break;
								case "a":
									list = lib.rank.ap.concat(lib.rank.am);
									break;
								case "am":
									list = lib.rank.a.concat(lib.rank.bp);
									break;
								case "bp":
									list = lib.rank.am.concat(lib.rank.b);
									break;
								case "b":
									list = lib.rank.bp.concat(lib.rank.bm);
									break;
								case "bm":
									list = lib.rank.b.concat(lib.rank.c);
									break;
								case "c":
									list = lib.rank.bm.concat(lib.rank.d);
									break;
								case "d":
									list = lib.rank.c;
									break;
							}
							for (var i = 0; i < total; i++) {
								if (Math.random() < 0.7) {
									_status.enemylist.push(Array.prototype.randomGet.apply(lib.rank[rank], _status.enemylist.concat(_status.mylist)));
								} else {
									_status.enemylist.push(Array.prototype.randomGet.apply(list, _status.enemylist.concat(_status.mylist)));
								}
							}
						} else {
							var number, list;
							if (selected.difficulty.length) {
								difficulty = selected.difficulty[0].link[2];
							} else {
								difficulty = "leader_easy";
							}
							_status.difficulty = difficulty;
							if (selected.number.length) {
								number = selected.number[0].link[2];
								number = parseInt(number[number.length - 1]);
							} else {
								number = 3;
							}
							switch (difficulty) {
								case "leader_easy":
									list = lib.rank.d.concat(lib.rank.c).concat(lib.rank.bm);
									break;
								case "leader_medium":
									list = lib.rank.b.concat(lib.rank.bp).concat(lib.rank.am);
									break;
								case "leader_hard":
									list = lib.rank.a
										.concat(lib.rank.ap)
										.concat(lib.rank.s)
										.concat(lib.rank.am.randomGets(Math.floor(lib.rank.am.length / 2)));
									break;
							}
							for (var i = 0; i < lib.hiddenCharacters.length; i++) {
								if (list.length <= number) {
									break;
								}
								list.remove(lib.hiddenCharacters[i]);
							}
							for (var i = 0; i < _status.mylist.length; i++) {
								list.remove(_status.mylist[i]);
							}
							_status.enemylist = list.randomGets(number);
						}
						var numdel = _status.enemylist.length - _status.mylist.length;
						var reward = 0;
						for (var i = 0; i < _status.enemylist.length; i++) {
							switch (get.rank(_status.enemylist[i])) {
								case "s":
									reward += 50;
									break;
								case "ap":
									reward += 40;
									break;
								case "a":
									reward += 32;
									break;
								case "am":
									reward += 25;
									break;
								case "bp":
									reward += 19;
									break;
								case "b":
									reward += 14;
									break;
								case "bm":
									reward += 10;
									break;
								case "c":
									reward += 7;
									break;
								case "d":
									reward += 5;
									break;
							}
						}
						if (numdel > 0) {
							switch (difficulty) {
								case "leader_easy":
									reward += 10 * numdel;
									break;
								case "leader_medium":
									reward += 20 * numdel;
									break;
								case "leader_hard":
									reward += 40 * numdel;
									break;
							}
						}
						var punish = 0;
						for (var i = 0; i < _status.mylist.length; i++) {
							switch (get.rank(_status.mylist[i])) {
								case "s":
									punish += 25;
									break;
								case "ap":
									punish += 20;
									break;
								case "a":
									punish += 16;
									break;
								case "am":
									punish += 12;
									break;
								case "bp":
									punish += 9;
									break;
								case "b":
									punish += 7;
									break;
								case "bm":
									punish += 5;
									break;
								case "c":
									punish += 3;
									break;
								case "d":
									punish += 2;
									break;
							}
						}
						if (numdel < 0) {
							switch (difficulty) {
								case "leader_easy":
									punish -= 5 * numdel;
									break;
								case "leader_medium":
									punish -= 10 * numdel;
									break;
								case "leader_hard":
									punish -= 20 * numdel;
									break;
							}
						}
						game.reward = Math.max(3 * _status.enemylist.length, reward - punish);
						if (!_status.lord) {
							switch (difficulty) {
								case "leader_easy":
									game.reward += 10;
									break;
								case "leader_medium":
									game.reward += 20;
									break;
								case "leader_hard":
									game.reward += 40;
									break;
							}
						}
						game.resume();
					});
					event.custom.replace.button = function (button) {
						if (_status.kaibao) return;
						if (button.classList.contains("unselectable") && !button.classList.contains("selected")) return;
						_status.chessclicked = true;
						button.classList.toggle("selected");
						if (button.classList.contains("selected")) {
							selected[button.area].add(button);
						} else {
							selected[button.area].remove(button);
						}
						switch (button.area) {
							case "lord": {
								for (var i = 0; i < dialog1.buttons.length; i++) {
									if (dialog1.buttons[i].area == "lord") {
										if (selected.lord.length) {
											dialog1.buttons[i].classList.add("unselectable");
										} else {
											dialog1.buttons[i].classList.remove("unselectable");
										}
									}
								}
								break;
							}
							case "character": {
								for (var i = 0; i < dialog1.buttons.length; i++) {
									if (dialog1.buttons[i].area == "character") {
										var maxq = game.data.character.length - 3;
										if ((!_status.qianfan && selected.character.length > 5) || (_status.qianfan && selected.character.length >= maxq)) {
											dialog1.buttons[i].classList.add("unselectable");
										} else {
											dialog1.buttons[i].classList.remove("unselectable");
										}
									}
								}
								break;
							}
							case "difficulty":
							case "number": {
								for (var i = 0; i < dialog2.buttons.length; i++) {
									if (dialog2.buttons[i].area == button.area) {
										if (selected[button.area].length) {
											dialog2.buttons[i].classList.add("unselectable");
										} else {
											dialog2.buttons[i].classList.remove("unselectable");
										}
									}
								}
								break;
							}
							case "challenge": {
								if (selected.challenge.length) {
									for (var i = 0; i < dialog2.buttons.length; i++) {
										if (dialog2.buttons[i].area == "challenge") {
											dialog2.buttons[i].classList.add("unselectable");
										} else {
											dialog2.buttons[i].classList.add("unselectable");
											dialog2.buttons[i].classList.remove("selected");
										}
									}
								} else {
									for (var i = 0; i < dialog2.buttons.length; i++) {
										dialog2.buttons[i].classList.remove("unselectable");
									}
								}
								break;
							}
						}
						if (selected.character.length && game.data.character.length > 3) {
							event.removeCharacter.addTempClass("controlpressdownx", 500);
							event.removeCharacter.classList.remove("disabled");
						} else {
							event.removeCharacter.classList.add("disabled");
						}
					};
					event.custom.add.window = function () {
						if (!_status.kaibao) {
							var glows = document.querySelectorAll(".button.glow2");
							for (var i = 0; i < glows.length; i++) {
								glows[i].classList.remove("glow2");
							}
						}
						if (_status.chessclicked) {
							_status.chessclicked = false;
							return;
						}
						if (_status.kaibao && event.cardnodes && event.cardnodes.length) {
							for (var i = 0; i < event.cardnodes.length; i++) {
								if (!event.cardnodes[i].turned) return;
							}
							for (var i = 0; i < event.cardnodes.length; i++) {
								event.cardnodes[i].delete();
							}
							ui.arena.classList.remove("leaderhide");
							setTimeout(function () {
								ui.arena.classList.remove("leadercontrol");
							}, 500);
							ui.money.show();
							delete event.cardnodes;
							_status.kaibao = false;
							return;
						}
						if (_status.qianfan) {
							_status.qianfan = false;
							event.removeCharacter.replace("遣返", qianfan);
							if (game.data.money >= 100) {
								event.addCharacter.addTempClass("controlpressdownx", 500);
								event.addCharacter.classList.remove("disabled");
							} else {
								event.addCharacter.classList.add("disabled");
							}
							if (game.data.money >= 150 || game.data._arena) {
								event.enterArena.addTempClass("controlpressdownx", 500);
								event.enterArena.classList.remove("disabled");
							} else {
								event.enterArena.classList.add("disabled");
							}
							event.fight.style.opacity = 1;
						}
						clearSelected();
					};
					lib.init.onfree();
					game.pause();
					"step 2";
					if (!game.data.arena) {
						event.dialog1.close();
						event.dialog2.close();
						event.fight.close();
						event.enterArena.close();
						event.addCharacter.close();
						event.removeCharacter.close();
					}
					ui.arena.classList.add("leaderhide");
					ui.money.hide();
					game.delay();
					"step 3";
					ui.arena.classList.remove("leaderhide");
					if (!_status.enterArena) {
						ui.wuxie.show();
						ui.auto.show();
						ui.control.style.top = "";
						if (!get.is.safari()) {
							ui.control.style.transition = "";
							ui.control.style.display = "none";
						}
						event.finish();
					} else {
						game.minskin = false;
						event.arenanodes = [];
						event.arenachoice = [];
						event.arenachoicenodes = [];
						event.arrangeNodes = function () {
							var num = event.arenachoicenodes.length;
							var width = num * 75 + (num - 1) * 8;
							for (var i = 0; i < event.arenachoicenodes.length; i++) {
								var left = -width / 2 + i * 83 - 37.5;
								if (left < 0) {
									event.arenachoicenodes[i].style.left = "calc(50% - " + -left + "px)";
								} else {
									event.arenachoicenodes[i].style.left = "calc(50% + " + left + "px)";
								}
							}
						};
						event.clickNode = function () {
							if (this.classList.contains("removing")) return;
							if (this.isChosen) {
								if (_status.chessgiveup) return;
								if (!event.choosefinished) return;
								if (this.classList.contains("unselectable") && !this.classList.contains("selected")) return;
								_status.chessclicked = true;
								this.classList.toggle("selected");
								if (this.classList.contains("selected")) {
									this.style.transform = "scale(0.85)";
								} else {
									this.style.transform = "scale(0.8)";
								}
								if (document.querySelectorAll(".player.selected").length >= 3) {
									for (var i = 0; i < event.arenachoicenodes.length; i++) {
										if (!event.arenachoicenodes[i].classList.contains("dead")) {
											event.arenachoicenodes[i].classList.add("unselectable");
										}
									}
								} else {
									for (var i = 0; i < event.arenachoicenodes.length; i++) {
										event.arenachoicenodes[i].classList.remove("unselectable");
									}
								}
							} else {
								while (event.arenanodes.length) {
									var node = event.arenanodes.shift();
									if (node == this) {
										node.node.hp.hide();
										node.style.transform = "scale(0.5)";
										node.style.top = "calc(50% + 50px)";
										event.arenachoicenodes.push(node);
										event.arrangeNodes();
									} else {
										node.delete();
									}
								}
								this.isChosen = true;
								event.arenachoice.push(this.name);
								game.resume();
							}
						};
					}
					"step 4";
					var choice;
					if (game.data._arena) {
						game.data.arena = game.data._arena;
						delete game.data._arena;
					}
					if (game.data.arena && !_status.arenaLoaded) {
						game.data.arena.loaded = true;
						event.arenachoice = game.data.arena.arenachoice;
						for (var i = 0; i < event.arenachoice.length; i++) {
							var node = event.cardNode(0, event.arenachoice[i], true);
							node.node.hp.style.display = "none";
							node.init(node.name);
							node.isChosen = true;
							node.listen(event.clickNode);
							node.style.transform = "scale(0.5)";
							node.style.top = "calc(50% + 50px)";
							event.arenachoicenodes.push(node);
						}
						event.arrangeNodes();
						for (var i = 0; i < event.arenachoicenodes.length; i++) {
							var node = event.arenachoicenodes[i];
							if (game.data.arena.choice) {
								ui.refresh(node);
								node.style.opacity = 1;
							}
						}
						if (game.data.arena.choice) {
							choice = game.data.arena.choice;
						} else {
							return;
						}
					} else {
						switch (event.arenachoice.length) {
							case 0:
								choice = lib.rank.d.randomGets(3);
								break;
							case 1:
								choice = lib.rank.c.randomGets(3);
								break;
							case 2:
								choice = lib.rank.bm.randomGets(3);
								break;
							case 3:
								choice = lib.rank.b.randomGets(3);
								break;
							case 4:
								choice = lib.rank.bp.randomGets(3);
								break;
							case 5:
								choice = lib.rank.am.randomGets(3);
								break;
							case 6:
								choice = lib.rank.a.randomGets(3);
								break;
							case 7:
								choice = lib.rank.ap.randomGets(3);
								break;
							case 8:
								choice = lib.rank.s.randomGets(3);
								break;
						}
						game.data.arena = {
							win: 0,
							dead: [],
							acted: [],
							choice: choice,
							arenachoice: event.arenachoice,
						};
						game.saveData();
					}
					_status.arenaLoaded = true;
					var node;
					node = event.cardNode(0, choice[0]);
					node.init(node.name);
					node.listen(event.clickNode);
					event.arenanodes.push(node);
					setTimeout(function () {
						node = event.cardNode(1, choice[1]);
						node.init(node.name);
						node.listen(event.clickNode);
						if (event.choosefinished) {
							node.delete();
						} else {
							event.arenanodes.push(node);
						}
						setTimeout(function () {
							node = event.cardNode(2, choice[2]);
							node.init(node.name);
							node.listen(event.clickNode);
							if (event.choosefinished) {
								node.delete();
							} else {
								event.arenanodes.push(node);
							}
						}, 200);
					}, 200);
					lib.init.onfree();
					game.pause();
					"step 5";
					if (event.arenachoice.length < 9) {
						event.goto(4);
					} else {
						if (_status.arenaLoaded) {
							game.delay(2);
						}
						game.data.arena.arenachoice = event.arenachoice;
						delete game.data.arena.choice;
						game.saveData();
						event.choosefinished = true;
					}
					"step 6";
					game.minskin = true;
					ui.arena.classList.add("noleft");
					var nodes = event.arenachoicenodes;
					for (var i = 0; i < nodes.length; i++) {
						nodes[i].style.transform = "scale(0.8)";
					}
					if (_status.arenaLoaded) {
						setTimeout(function () {
							nodes[0].style.left = "calc(50% - 215px)";
							nodes[0].style.top = "calc(50% - 260px)";
						}, 0);
						setTimeout(function () {
							nodes[1].style.left = "calc(50% - 75px)";
							nodes[1].style.top = "calc(50% - 260px)";
						}, 50);
						setTimeout(function () {
							nodes[2].style.left = "calc(50% + 65px)";
							nodes[2].style.top = "calc(50% - 260px)";
						}, 100);
						setTimeout(function () {
							nodes[3].style.left = "calc(50% - 215px)";
							nodes[3].style.top = "calc(50% - 90px)";
						}, 150);
						setTimeout(function () {
							nodes[4].style.left = "calc(50% - 75px)";
							nodes[4].style.top = "calc(50% - 90px)";
						}, 200);
						setTimeout(function () {
							nodes[5].style.left = "calc(50% + 65px)";
							nodes[5].style.top = "calc(50% - 90px)";
						}, 250);
						setTimeout(function () {
							nodes[6].style.left = "calc(50% - 215px)";
							nodes[6].style.top = "calc(50% + 80px)";
						}, 300);
						setTimeout(function () {
							nodes[7].style.left = "calc(50% - 75px)";
							nodes[7].style.top = "calc(50% + 80px)";
						}, 350);
						setTimeout(function () {
							nodes[8].style.left = "calc(50% + 65px)";
							nodes[8].style.top = "calc(50% + 80px)";
						}, 400);
					} else {
						nodes[0].style.left = "calc(50% - 215px)";
						nodes[0].style.top = "calc(50% - 260px)";
						nodes[1].style.left = "calc(50% - 75px)";
						nodes[1].style.top = "calc(50% - 260px)";
						nodes[2].style.left = "calc(50% + 65px)";
						nodes[2].style.top = "calc(50% - 260px)";
						nodes[3].style.left = "calc(50% - 215px)";
						nodes[3].style.top = "calc(50% - 90px)";
						nodes[4].style.left = "calc(50% - 75px)";
						nodes[4].style.top = "calc(50% - 90px)";
						nodes[5].style.left = "calc(50% + 65px)";
						nodes[5].style.top = "calc(50% - 90px)";
						nodes[6].style.left = "calc(50% - 215px)";
						nodes[6].style.top = "calc(50% + 80px)";
						nodes[7].style.left = "calc(50% - 75px)";
						nodes[7].style.top = "calc(50% + 80px)";
						nodes[8].style.left = "calc(50% + 65px)";
						nodes[8].style.top = "calc(50% + 80px)";
						for (var i = 0; i < nodes.length; i++) {
							ui.refresh(nodes[i]);
							if (game.data.arena.dead.includes(nodes[i].name)) {
								nodes[i].classList.add("dead");
								nodes[i].style.opacity = 0.3;
							} else {
								nodes[i].style.opacity = 1;
								if (game.data.arena.acted.includes(nodes[i].name)) {
									var acted = nodes[i].node.action;
									acted.style.opacity = 1;
									acted.innerHTML = "疲劳";
									acted.dataset.nature = "soilm";
									acted.classList.add("freecolor");
								}
							}
						}
					}

					var victory = ui.create.div().hide();
					victory.innerHTML = "<span>" + game.data.arena.win + "</span>胜";
					victory.style.top = "auto";
					victory.style.left = "auto";
					victory.style.right = "20px";
					victory.style.bottom = "15px";
					victory.style.fontSize = "30px";
					victory.style.fontFamily = "huangcao";
					victory.firstChild.style.marginRight = "5px";
					ui.window.appendChild(victory);
					ui.refresh(victory);
					victory.show();

					event.checkPrize = function () {
						// event.kaibao=true;
						event.prize = [];
						event.turnCard2 = function () {
							if (this.turned) return;
							_status.chessclicked = true;
							this.turned = true;
							var node = this;
							setTimeout(function () {
								node.turned2 = true;
							}, 1000);
							if (node.name == "chess_coin" || node.name == "chess_dust") {
								node.style.transition = "all 0s";
								node.style.transform = "none";
								node.style.overflow = "visible";
								node.style.background = "none";
								node.style.boxShadow = "none";
								var div = ui.create.div(node);
								div.style.transition = "all 0s";
								if (node.name == "chess_coin") {
									div.innerHTML = "<span>㉤</span><span>" + node.num + "</span>";
									div.firstChild.style.color = "rgb(255, 230, 0)";
									node.$coin();
								} else {
									div.innerHTML = "<span>⚑</span><span>" + node.num + "</span>";
									div.firstChild.style.color = "rgb(111, 198, 255)";
									div.firstChild.style.marginRight = "3px";
									node.$dust();
								}
								div.style.fontFamily = "huangcao";
								div.style.fontSize = "50px";
								div.style.top = "40px";
								div.style.letterSpacing = "8px";
								div.style.whiteSpace = "nowrap";
								// div.dataset.nature='metal';

								return;
							}
							node.style.transition = "all ease-in 0.3s";
							node.style.transform = "perspective(1200px) rotateY(270deg) translateX(150px)";
							var onEnd = function () {
								node.init(node.name);
								node.node.avatar.style.display = "";
								if (node.rarity) {
									node.node.intro.innerHTML = get.translation(node.rarity);
									node.node.intro.classList.add("showintro");
								}
								node.classList.add("playerflip");
								node.style.transform = "none";
								node.style.transition = "";
								if (lib.config.animation && !lib.config.low_performance) {
									setTimeout(function () {
										switch (game.getRarity(node.name)) {
											case "rare":
												node.$rare();
												break;
											case "epic":
												node.$epic();
												break;
											case "legend":
												node.$legend();
												break;
										}
									}, 150);
								}
							};
							node.listenTransition(onEnd);
						};
						setTimeout(function () {
							nodes[0].delete();
						}, 400 + Math.random() * 300);
						setTimeout(function () {
							nodes[1].delete();
						}, 400 + Math.random() * 300);
						setTimeout(function () {
							nodes[2].delete();
						}, 400 + Math.random() * 300);
						setTimeout(function () {
							nodes[3].delete();
						}, 400 + Math.random() * 300);
						setTimeout(function () {
							nodes[4].delete();
						}, 400 + Math.random() * 300);
						setTimeout(function () {
							nodes[5].delete();
						}, 400 + Math.random() * 300);
						setTimeout(function () {
							nodes[6].delete();
						}, 400 + Math.random() * 300);
						setTimeout(function () {
							nodes[7].delete();
						}, 400 + Math.random() * 300);
						setTimeout(function () {
							nodes[8].delete();
						}, 400 + Math.random() * 300);
						setTimeout(function () {
							var prize = new Array(6);
							var map = [1, 2, 3, 4, 5];
							var ccount = 3;
							var win = game.data.arena.win;
							var prizeValue;
							switch (win) {
								case 0:
									prizeValue = 100;
									break;
								case 1:
									prizeValue = 120;
									break;
								case 2:
									prizeValue = 150;
									break;
								case 3:
									prizeValue = 190;
									break;
								case 4:
									prizeValue = 240;
									break;
								case 5:
									prizeValue = 300;
									break;
								case 6:
									prizeValue = 370;
									break;
								case 7:
									prizeValue = 450;
									break;
								case 8:
									prizeValue = 540;
									break;
								case 9:
									prizeValue = 640;
									break;
								case 10:
									prizeValue = 750;
									break;
								case 11:
									prizeValue = 870;
									break;
								case 12:
									prizeValue = 1000;
									break;
							}
							if (Math.random() < 0.4) {
								if (win >= 3 && Math.random() < 0.5) {
									ccount = 4;
									prizeValue -= 33;
								} else {
									ccount = 2;
									prizeValue += 33;
								}
							}
							prizeValue -= 100;
							while (ccount--) {
								prize[map.randomRemove()] = game.getLeaderCharacter();
							}
							if (map.length) {
								prizeValue /= map.length;
							}
							while (map.length) {
								var val = Math.round((Math.random() * 0.4 + 0.8) * prizeValue);
								if (Math.random() < 0.7) {
									prize[map.shift()] = ["chess_coin", Math.max(Math.ceil(Math.random() * 5), val)];
								} else {
									val = Math.round(val / 3);
									prize[map.shift()] = ["chess_dust", Math.max(Math.ceil(Math.random() * 3), val)];
								}
							}
							for (var i = 1; i < prize.length; i++) {
								if (typeof prize[i] == "string") {
									var name = prize[i];
									var rarity = game.getRarity(name);
									if (!game.data.character.includes(name)) {
										game.data.character.push(name);
										if (game.data.challenge.includes(name)) {
											game.data.challenge = game.getLeaderList();
										}
									} else {
										switch (rarity) {
											case "common":
												game.data.dust += 10;
												break;
											case "rare":
												game.data.dust += 30;
												break;
											case "epic":
												game.data.dust += 150;
												break;
											case "legend":
												game.data.dust += 600;
												break;
										}
									}
								} else if (prize[i][0] == "chess_coin") {
									game.data.money += prize[i][1];
								} else {
									game.data.dust += prize[i][1];
								}
								setTimeout(
									(function (i) {
										return function () {
											var node;
											if (typeof prize[i] == "string") {
												node = event.cardNode("5" + i, prize[i]);
											} else {
												node = event.cardNode("5" + i, prize[i][0]);
												node.num = prize[i][1];
											}
											event.prize.push(node);
											if (i == prize.length - 1) {
												event.kaibao = true;
											}
										};
									})(i),
									i * 200
								);
							}
							delete game.data.arena;
							game.saveData();
						}, 1000);
					};
					if (game.data.arena.dead.length < 9 && game.data.arena.win < 12) {
						event.arenafight = ui.create.control("开始战斗", "nozoom", function () {
							if (_status.chessgiveup) return;
							_status.mylist = [];
							var list = [];
							for (var i = 0; i < nodes.length; i++) {
								if (nodes[i].classList.contains("selected")) {
									_status.mylist.push(nodes[i].name);
								} else if (!nodes[i].classList.contains("dead")) {
									list.push(nodes[i].name);
								}
							}
							if (_status.mylist.length == 0) {
								_status.mylist = list.randomGets(3);
							}
							if (_status.mylist.length == 0) return;
							for (var i = 0; i < _status.mylist.length; i++) {
								game.data.arena.dead.push(_status.mylist[i]);
							}
							game.saveData();
							switch (game.data.arena.win) {
								case 0:
									list = lib.rank.d.concat(lib.rank.c);
									break;
								case 1:
									list = lib.rank.c.concat(lib.rank.bm);
									break;
								case 2:
									list = lib.rank.bm.concat(lib.rank.b);
									break;
								case 3:
									list = lib.rank.b.concat(lib.rank.bp);
									break;
								case 4:
									list = lib.rank.bp.concat(lib.rank.am);
									break;
								case 5:
									list = lib.rank.am.concat(lib.rank.a);
									break;
								case 6:
									list = lib.rank.a.concat(lib.rank.ap);
									break;
								default:
									list = lib.rank.ap.concat(lib.rank.s);
							}
							for (var i = 0; i < _status.mylist.length; i++) {
								list.remove(_status.mylist[i]);
							}
							_status.enemylist = list.randomGets(3);
							for (var i = 0; i < nodes.length; i++) {
								nodes[i].delete();
							}
							victory.delete();
							event.arenafight.close();
							event.arenaback.close();
							event.arenagiveup.close();
							game.resume();
						});
						event.arenaback = ui.create.control("返回", "nozoom", function () {
							if (_status.chessgiveup) return;
							game.data._arena = game.data.arena;
							delete game.data.arena;
							game.saveData();
							game.reload();
						});
						var giveup = function () {
							if (confirm("放弃后剩余战斗将视为战败并结算奖励，是否确定放弃？")) {
								_status.chessclicked = true;
								event.arenafight.close();
								event.arenaback.close();
								event.arenagiveup.close();
								event.checkPrize();
							}
							// _status.chessclicked=true;
							// _status.chessgiveup=true;
							// event.arenafight.style.opacity=0.5;
							// event.arenaback.style.opacity=0.5;
							// this.replace('确认放弃',function(){
							// 	_status.chessclicked=true;
							// 	event.arenafight.close();
							// 	event.arenaback.close();
							// 	event.arenagiveup.close();
							// 	event.checkPrize();
							// });
						};
						event.arenagiveup = ui.create.control("放弃", "nozoom", giveup);
					} else {
						event.checkPrize();
					}

					event.custom.add.window = function () {
						if (_status.chessclicked) {
							_status.chessclicked = false;
							return;
						}
						if (event.kaibao) {
							for (var i = 0; i < event.prize.length; i++) {
								if (!event.prize[i].turned2) {
									return;
								}
							}
							game.reload();
						}
						_status.chessgiveup = false;
						event.arenafight.style.opacity = 1;
						event.arenaback.style.opacity = 1;
						event.arenagiveup.replace("放弃", giveup);
						for (var i = 0; i < nodes.length; i++) {
							nodes[i].style.transform = "scale(0.8)";
							nodes[i].classList.remove("selected");
							nodes[i].classList.remove("unselectable");
						}
					};
					lib.init.onfree();
					game.pause();
					"step 7";
					ui.control.style.top = "";
					if (!get.is.safari()) {
						ui.control.style.transition = "";
						ui.control.style.display = "none";
					}
					ui.arena.classList.remove("leaderhide");
					ui.wuxie.show();
					ui.auto.show();
					game.delay();
				});
			},
			saveData: function () {
				game.save(get.config("chess_leader_save"), game.data);
			},
			getLeaderList: function () {
				var list = lib.rank.all.slice(0);
				for (var i = 0; i < game.data.character.length; i++) {
					list.remove(game.data.character[i]);
				}
				if (!list.length) {
					return ["chess_xingtian"];
				}
				return list.randomGets(6);
			},
			getLeaderCharacter: function () {
				var pleg;
				if (game.data.legend <= 20) {
					pleg = 0.01;
				} else {
					pleg = 0.01 + ((game.data.legend - 20) * (game.data.legend - 20) * 0.99) / 10000;
				}
				if (Math.random() < pleg) {
					game.data.legend = 0;
					game.saveData();
					return lib.rank.rarity.legend.randomGet();
				}
				game.data.legend++;
				game.saveData();
				if (Math.random() < 0.05) return lib.rank.rarity.epic.randomGet();
				if (Math.random() < 0.3) return lib.rank.rarity.rare.randomGet();
				return lib.rank.rarity.common.randomGet();
			},
			changeMoney: function (num) {
				game.data.money += num;
				game.saveData();
				ui.money.lastChild.innerHTML = game.data.money;
			},
			changeDust: function (num) {
				game.data.dust += num;
				game.saveData();
				ui.money.childNodes[1].innerHTML = game.data.dust;
			},
			chooseCharacter: function () {
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.ai = function (player, list) {
					if (get.config("double_character")) {
						player.init(list[0], list[1]);
					} else {
						player.init(list[0]);
					}
				};
				next.setContent(function () {
					"step 0";
					ui.wuxie.hide();
					var i;
					var list = [];
					var bosslist = [];
					var jiangelist = [];
					event.list = list;
					for (i in lib.character) {
						if (lib.character[i].isChessBoss) {
							bosslist.push(i);
							continue;
						} else if (lib.character[i].isJiangeBoss) {
							// if(get.config('chess_jiange')) jiangelist.push(i);
							continue;
						}
						if (i.indexOf("treasure_") == 0) continue;
						if (lib.character[i].isMinskin) continue;
						if (lib.config.forbidchess.includes(i)) continue;
						if (lib.filter.characterDisabled(i)) continue;
						list.push(i);
					}
					list.randomSort();
					var bosses = ui.create.div(".buttons");
					event.bosses = bosses;
					var bossbuttons = ui.create.buttons(bosslist, "character", bosses);
					var addToButton = function () {
						if (ui.cheat2 && ui.cheat2.backup) return;
						_status.event.dialog.content.childNodes[1].innerHTML = ui.selected.buttons.length + "/" + _status.event.selectButton();
					};
					var jiange = ui.create.div(".buttons");
					event.jiange = jiange;
					var jiangebuttons = ui.create.buttons(jiangelist, "character", jiange);

					var clickedBoss = false;
					var clickBoss = function () {
						clickedBoss = true;
						var num = bosses.querySelectorAll(".glow").length;
						if (this.classList.contains("glow")) {
							this.classList.remove("glow");
							num--;
						} else {
							if (num < 4) {
								this.classList.add("glow");
								num++;
							}
						}
						for (var i = 0; i < bosses.childElementCount; i++) {
							if (num >= 4 && !bosses.childNodes[i].classList.contains("glow")) {
								bosses.childNodes[i].classList.add("forbidden");
							} else {
								bosses.childNodes[i].classList.remove("forbidden");
							}
						}
						if (num) {
							if (!event.asboss) {
								event.asboss = ui.create.control("应战", function () {
									_status.boss = true;
									ui.click.ok();
								});
							}
						} else {
							if (event.asboss) {
								event.asboss.close();
								delete event.asboss;
							}
						}
						addToButton();
					};

					var clickedJiange = false;
					var clickJiange = function () {
						clickedJiange = true;
						if (this.classList.contains("glow2")) {
							this.classList.remove("glow2");
						} else {
							this.classList.add("glow2");
						}
						addToButton();
					};

					for (var i = 0; i < bossbuttons.length; i++) {
						bossbuttons[i].classList.add("noclick");
						bossbuttons[i].listen(clickBoss);
					}
					for (var i = 0; i < jiangebuttons.length; i++) {
						jiangebuttons[i].classList.add("noclick");
						jiangebuttons[i].listen(clickJiange);
					}

					if (get.config("additional_player") == undefined) game.saveConfig("additional_player", true, true);
					if (get.config("reward") == undefined) game.saveConfig("reward", 3, true);
					if (get.config("punish") == undefined) game.saveConfig("punish", "无", true);
					if (get.config("battle_number") == undefined) game.saveConfig("battle_number", 3, true);
					if (get.config("choice_number") == undefined) game.saveConfig("choice_number", 6, true);
					if (get.config("seat_order") == undefined) game.saveConfig("seat_order", "交替", true);
					if (get.config("replace_number") == undefined) game.saveConfig("replace_number", 0, true);
					if (get.config("single_control") == undefined) game.saveConfig("single_control", false, true);
					if (get.config("first_less") == undefined) game.saveConfig("first_less", true, true);

					var dialog = ui.create.dialog("选择出场角色", "hidden");
					dialog.classList.add("fullwidth");
					dialog.classList.add("fullheight");
					dialog.classList.add("fixed");
					dialog.add("0/0");
					dialog.add([list.slice(0, parseInt(get.config("battle_number")) * 4 + parseInt(get.config("replace_number")) + 5), "character"]);
					if (bossbuttons.length) {
						dialog.add("挑战魔王");
						dialog.add(bosses);
					}
					if (jiangebuttons.length) {
						dialog.add("守卫剑阁");
						dialog.add(jiange);
					}
					event.addConfig = function (dialog) {
						dialog.add("选项");
						dialog.choice = {};
						dialog.choice.zhu = dialog.add(ui.create.switcher("zhu", get.config("zhu"))).querySelector(".toggle");
						dialog.choice.main_zhu = dialog.add(ui.create.switcher("main_zhu", get.config("main_zhu"))).querySelector(".toggle");
						if (get.config("zhu")) {
							dialog.choice.main_zhu.parentNode.classList.remove("disabled");
						} else {
							dialog.choice.main_zhu.parentNode.classList.add("disabled");
						}
						dialog.choice.noreplace_end = dialog.add(ui.create.switcher("noreplace_end", get.config("noreplace_end"))).querySelector(".toggle");
						dialog.choice.additional_player = dialog.add(ui.create.switcher("additional_player", get.config("additional_player"))).querySelector(".toggle");
						dialog.choice.single_control = dialog.add(ui.create.switcher("single_control", get.config("single_control"))).querySelector(".toggle");
						dialog.choice.first_less = dialog.add(ui.create.switcher("first_less", get.config("first_less"))).querySelector(".toggle");
						// dialog.attack_move=dialog.add(ui.create.switcher('attack_move',get.config('attack_move'))).querySelector('.toggle');
						// this.dialog.versus_single_control=this.dialog.add(ui.create.switcher('versus_single_control',lib.storage.single_control)).querySelector('.toggle');
						// this.dialog.versus_first_less=this.dialog.add(ui.create.switcher('versus_first_less',lib.storage.first_less)).querySelector('.toggle');
						dialog.choice.reward = dialog.add(ui.create.switcher("reward", [0, 1, 2, 3, 4], get.config("reward"))).querySelector(".toggle");
						dialog.choice.punish = dialog.add(ui.create.switcher("punish", ["弃牌", "无", "摸牌"], get.config("punish"))).querySelector(".toggle");
						dialog.choice.seat_order = dialog.add(ui.create.switcher("seat_order", ["指定", "交替"], get.config("seat_order"))).querySelector(".toggle");
						dialog.choice.battle_number = dialog.add(ui.create.switcher("battle_number", [1, 2, 3, 4, 6, 8], get.config("battle_number"))).querySelector(".toggle");
						dialog.choice.replace_number = dialog.add(ui.create.switcher("replace_number", [0, 1, 2, 3, 5, 7, 9, 17], get.config("replace_number"))).querySelector(".toggle");
						dialog.choice.choice_number = dialog.add(ui.create.switcher("choice_number", [3, 6, 9], get.config("choice_number"))).querySelector(".toggle");
						if (get.config("additional_player")) {
							dialog.choice.noreplace_end.parentNode.classList.add("disabled");
							dialog.choice.replace_number.parentNode.classList.add("disabled");
							dialog.choice.choice_number.parentNode.classList.remove("disabled");
						} else {
							dialog.choice.noreplace_end.parentNode.classList.remove("disabled");
							dialog.choice.replace_number.parentNode.classList.remove("disabled");
							dialog.choice.choice_number.parentNode.classList.add("disabled");
						}
					};
					event.addConfig(dialog);
					for (var i = 0; i < bosses.childNodes.length; i++) {
						bosses.childNodes[i].classList.add("squarebutton");
					}
					for (var i = 0; i < jiange.childNodes.length; i++) {
						jiange.childNodes[i].classList.add("squarebutton");
					}
					ui.control.style.transition = "all 0s";

					if (get.is.phoneLayout()) {
						ui.control.style.top = "calc(100% - 80px)";
					} else {
						ui.control.style.top = "calc(100% - 70px)";
					}

					var next = game.me.chooseButton(dialog, true).set("onfree", true);
					next._triggered = null;
					next.selectButton = function () {
						var bossnum = bosses.querySelectorAll(".glow").length;
						if (bossnum) {
							return 3 * bossnum;
						}
						if (!get.config("single_control")) {
							return 1;
						}
						if (get.config("additional_player")) {
							return parseInt(get.config("battle_number"));
						}
						return parseInt(get.config("battle_number")) + parseInt(get.config("replace_number"));
					};
					next.custom.add.button = addToButton;
					next.custom.add.window = function (clicked) {
						if (clicked) return;
						if (clickedBoss) {
							clickedBoss = false;
						} else {
							for (var i = 0; i < bosses.childElementCount; i++) {
								bosses.childNodes[i].classList.remove("forbidden");
								bosses.childNodes[i].classList.remove("glow");
							}
							if (event.asboss) {
								event.asboss.close();
								delete event.asboss;
							}
						}
						if (clickedJiange) {
							clickedJiange = false;
						} else {
							for (var i = 0; i < jiange.childElementCount; i++) {
								jiange.childNodes[i].classList.remove("forbidden");
								jiange.childNodes[i].classList.remove("glow2");
							}
						}
						var dialog = _status.event.dialog;
						if (dialog.choice) {
							for (var i in dialog.choice) {
								game.saveConfig(i, dialog.choice[i].link, true);
							}
							if (get.config("zhu")) {
								dialog.choice.main_zhu.parentNode.classList.remove("disabled");
							} else {
								dialog.choice.main_zhu.parentNode.classList.add("disabled");
							}
							if (get.config("additional_player")) {
								dialog.choice.noreplace_end.parentNode.classList.add("disabled");
								dialog.choice.replace_number.parentNode.classList.add("disabled");
								dialog.choice.choice_number.parentNode.classList.remove("disabled");
							} else {
								dialog.choice.noreplace_end.parentNode.classList.remove("disabled");
								dialog.choice.replace_number.parentNode.classList.remove("disabled");
								dialog.choice.choice_number.parentNode.classList.add("disabled");
							}
							var num = parseInt(get.config("battle_number")) * 4 + parseInt(get.config("replace_number")) + 5;
							if (dialog.buttons.length > num) {
								for (var i = num; i < dialog.buttons.length; i++) {
									dialog.buttons[i].remove();
								}
								dialog.buttons.splice(num);
							} else if (dialog.buttons.length < num) {
								for (var i = dialog.buttons.length; i < num; i++) {
									dialog.buttons.push(ui.create.button(list[i], "character", dialog.buttons[0].parentNode).addTempClass("zoom"));
								}
								game.check();
							}
						}
						addToButton();
					};
					event.changeDialog = function () {
						if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
							return;
						}
						if (game.changeCoin) {
							game.changeCoin(-3);
						}
						list.randomSort();

						var buttons = ui.create.div(".buttons");
						var node = _status.event.dialog.buttons[0].parentNode;
						_status.event.dialog.buttons = ui.create.buttons(list.slice(0, parseInt(get.config("battle_number")) * 4 + parseInt(get.config("replace_number")) + 5), "character", buttons);
						_status.event.dialog.content.insertBefore(buttons, node);
						buttons.addTempClass("start");
						node.remove();

						// _status.event.dialog.close();
						// var dialog=ui.create.dialog('选择出场角色','hidden');
						// _status.event.dialog=dialog;
						// dialog.classList.add('fullwidth');
						// dialog.classList.add('fullheight');
						// dialog.classList.add('fixed');
						// dialog.add('0/'+_status.event.selectButton());
						// dialog.add([list.slice(0,parseInt(get.config('battle_number'))*4+parseInt(get.config('replace_number'))+5),'character']);
						// if(bossbuttons.length){
						// 	dialog.add('挑战魔王');
						// 	dialog.add(bosses);
						// }
						// if(jiangebuttons.length){
						// 	dialog.add('守卫剑阁');
						// 	dialog.add(jiange);
						// }
						// event.addConfig(dialog);
						// dialog.open();
						game.uncheck();
						game.check();
					};
					ui.create.cheat = function () {
						_status.createControl = ui.cheat2;
						ui.cheat = ui.create.control("更换", event.changeDialog);
						delete _status.createControl;
					};
					var createCharacterDialog = function () {
						event.dialogxx = ui.create.characterDialog();
						event.dialogxx.classList.add("fullwidth");
						event.dialogxx.classList.add("fullheight");
						event.dialogxx.classList.add("fixed");
						if (ui.cheat2) {
							ui.cheat2.addTempClass("controlpressdownx", 500);
							ui.cheat2.classList.remove("disabled");
						}
					};
					if (lib.onfree) {
						lib.onfree.push(createCharacterDialog);
					} else {
						createCharacterDialog();
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
					if (!ui.cheat && get.config("change_choice")) ui.create.cheat();
					if (!ui.cheat2 && get.config("free_choose")) ui.create.cheat2();
					"step 1";
					ui.wuxie.show();
					if (ui.cheat) {
						ui.cheat.close();
						delete ui.cheat;
					}
					if (ui.cheat2) {
						ui.cheat2.close();
						delete ui.cheat2;
					}
					if (event.asboss) {
						event.asboss.close();
						delete ui.asboss;
					}
					ui.control.style.top = "";
					if (!get.is.safari()) {
						ui.control.style.transition = "";
						ui.control.style.display = "none";
					}

					var glows = event.bosses.querySelectorAll(".glow");
					var glows2 = event.jiange.querySelectorAll(".glow2");
					if (!glows.length && !glows2.length) {
						if (!get.config("single_control")) {
							var addnum;
							if (get.config("additional_player")) {
								addnum = parseInt(get.config("battle_number"));
							} else {
								addnum = parseInt(get.config("battle_number")) + parseInt(get.config("replace_number"));
							}
							for (var i = 0; i < addnum - 1; i++) {
								result.links.push(event.list.randomRemove());
							}
						}
					}
					for (var i = 0; i < result.links.length; i++) {
						game.addRecentCharacter(result.links[i]);
					}
					if (_status.mode == "combat") {
						_status.mylist = result.links.slice(0, parseInt(get.config("battle_number")));
						_status.replacelist = result.links.slice(parseInt(get.config("battle_number")));
					} else {
						_status.mylist = result.links.slice(0);
					}
					if (ui.coin) {
						_status.coinCoeff = get.coinCoeff(_status.mylist);
					}
					for (var i = 0; i < result.links.length; i++) {
						event.list.remove(result.links[i]);
					}
					if (glows.length) {
						_status.vsboss = true;
						_status.enemylist = [];
						for (var i = 0; i < glows.length; i++) {
							_status.enemylist.push(glows[i].link);
						}
						if (_status.boss) {
							var temp = _status.mylist;
							_status.mylist = _status.enemylist;
							_status.enemylist = temp;
							for (var i = _status.enemylist.length; i < _status.mylist.length * 3; i++) {
								_status.enemylist.push(event.list.randomRemove());
							}
						}
					} else if (glows2.length) {
						_status.vsboss = true;
						_status.enemylist = [];
						for (var i = 0; i < glows2.length; i++) {
							_status.enemylist.push(glows2[i].link);
						}
					} else {
						event.list.randomSort();
						_status.enemylist = event.list.splice(0, _status.mylist.length);
						if (_status.mode == "combat" && _status.replacelist) {
							_status.enemyreplacelist = event.list.splice(0, _status.replacelist.length);
						}
					}
					if (_status.mode == "combat" && get.config("additional_player")) {
						_status.additionallist = event.list;
					}
				});
			},
			modeSwapPlayer: function (player) {
				var content = [game.me.dataset.position, player.dataset.position];
				game.me.classList.remove("current_action");
				player.classList.add("current_action");
				game.addVideo("chessSwap", null, content);
				game.swapControl(player);
				player.chessFocus();
				ui.create.fakeme();
			},
		},
		skill: {
			_tempobstacle: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content: function () {
					var list = game.obstacles.slice(0);
					for (var i = 0; i < list.length; i++) {
						if (typeof list[i].tempObstacle == "number") {
							if (--list[i].tempObstacle == 0) {
								game.removeObstacle(list[i]);
							}
						}
					}
				},
			},
			_attackmove: {
				trigger: { player: "damage" },
				silent: true,
				priority: 50,
				filter: function (event, player) {
					if (!event.source) return false;
					if (get.distance(event.source, player, "pure") > 2) return false;
					var xy1 = event.source.getXY();
					var xy2 = player.getXY();
					var dx = xy2[0] - xy1[0];
					var dy = xy2[1] - xy1[1];
					// if(dx*dy!=0) return false;
					if (dx == 0 && Math.abs(dy) == 2) {
						dy /= 2;
					}
					if (dy == 0 && Math.abs(dx) == 2) {
						dx /= 2;
					}
					return player.movable(dx, dy);
				},
				content: function () {
					var xy1 = trigger.source.getXY();
					var xy2 = player.getXY();
					var dx = xy2[0] - xy1[0];
					var dy = xy2[1] - xy1[1];
					if (dx == 0 && Math.abs(dy) == 2) {
						dy /= 2;
					}
					if (dy == 0 && Math.abs(dx) == 2) {
						dx /= 2;
					}
					if (player.movable(dx, dy)) {
						player.move(dx, dy);
					}
				},
			},
			dubiaoxianjing: {
				global: "dubiaoxianjing2",
			},
			dubiaoxianjing2: {
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					if (player.hp <= 1) return false;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_dubiaoxianjing") {
							return get.chessDistance(game.treasures[i], player) <= 2;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var source = null;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_dubiaoxianjing") {
							source = game.treasures[i];
							break;
						}
					}
					if (source) {
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player, "thunder");
						if (lib.config.animation && !lib.config.low_performance) {
							setTimeout(function () {
								source.$epic2();
							}, 300);
						}
						game.delay(2);
					} else {
						event.finish();
					}
					"step 1";
					game.log("毒镖陷阱发动");
					player.damage("nosource");
					player.draw(2);
				},
			},
			jiqishi: {
				global: "jiqishi2",
			},
			jiqishi2: {
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					if (player.hp == player.maxHp) return false;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_jiqishi") {
							return get.chessDistance(game.treasures[i], player) <= 2;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var source = null;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_jiqishi") {
							source = game.treasures[i];
							break;
						}
					}
					if (source) {
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player, "thunder");
						if (lib.config.animation && !lib.config.low_performance) {
							setTimeout(function () {
								source.$epic2();
							}, 300);
						}
						game.delay(2);
					} else {
						event.finish();
					}
					"step 1";
					game.log("集气石发动");
					player.recover("nosource");
					var he = player.getCards("he");
					if (he.length) {
						player.discard(he.randomGets(2));
					}
				},
			},
			wuyashenxiang: {
				global: "wuyashenxiang2",
			},
			wuyashenxiang2: {
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					if (player.hp > 1) return false;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_wuyashenxiang") {
							return get.chessDistance(game.treasures[i], player) <= 3;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var source = null;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_wuyashenxiang") {
							source = game.treasures[i];
							break;
						}
					}
					if (source) {
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player, "thunder");
						if (lib.config.animation && !lib.config.low_performance) {
							setTimeout(function () {
								source.$epic2();
							}, 300);
						}
						game.delay(2);
					} else {
						event.finish();
					}
					"step 1";
					game.log("乌鸦神像发动");
					player.recover("nosource");
					// player.draw();
					var card = get.cardPile(function (c) {
						return get.type(c) == "delay";
					});
					if (card) {
						player.addJudge(card);
					}
				},
			},
			shenpanxianjing: {
				global: "shenpanxianjing2",
			},
			shenpanxianjing2: {
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					var nh = player.countCards("h");
					if (!nh) return false;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_shenpanxianjing") {
							for (var j = 0; j < game.players.length; j++) {
								if (game.players[j].countCards("h") > nh) return false;
							}
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var source = null;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_shenpanxianjing") {
							source = game.treasures[i];
							break;
						}
					}
					if (source) {
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player, "thunder");
						if (lib.config.animation && !lib.config.low_performance) {
							setTimeout(function () {
								source.$epic2();
							}, 300);
						}
						game.delay(2);
					} else {
						event.finish();
					}
					"step 1";
					game.log("审判之刃发动");
					var hs = player.getCards("h");
					if (hs.length) {
						player.discard(hs.randomGet());
					}
				},
			},
			shiyuansu: {
				global: "shiyuansu2",
			},
			shiyuansu2: {
				trigger: { player: "damageAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					if (event.num < 2) return false;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_shiyuansu") {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					game.delayx();
					"step 1";
					var source = null;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_shiyuansu") {
							source = game.treasures[i];
							break;
						}
					}
					if (source) {
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player, "thunder");
						if (lib.config.animation && !lib.config.low_performance) {
							setTimeout(function () {
								source.$epic2();
							}, 300);
						}
						game.delay(2);
					} else {
						event.finish();
					}
					"step 2";
					game.log("石元素像发动");
					player.changeHujia();
				},
			},
			shenmidiaoxiang: {
				global: "shenmidiaoxiang2",
			},
			shenmidiaoxiang2: {
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_shenmidiaoxiang") {
							return player.canMoveTowards(game.treasures[i]) && get.chessDistance(game.treasures[i], player) > 3;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var source = null;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == "treasure_shenmidiaoxiang") {
							source = game.treasures[i];
							break;
						}
					}
					if (source) {
						event.source = source;
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player, "thunder");
						if (lib.config.animation && !lib.config.low_performance) {
							setTimeout(function () {
								source.$epic2();
							}, 300);
						}
						game.delay(2);
					} else {
						event.finish();
					}
					"step 1";
					game.log("神秘雕像发动");
					player.moveTowards(event.source);
				},
			},
			arenaAdd: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return _status.enterArena && player.side == game.me.side && game.data.arena.arenachoice.length > game.data.arena.dead.length;
				},
				direct: true,
				delay: 0,
				preservecancel: true,
				content: function () {
					"step 0";
					var list = game.data.arena.arenachoice.slice(0);
					for (var i = 0; i < game.data.arena.dead.length; i++) {
						list.remove(game.data.arena.dead[i]);
					}
					event.dialog = ui.create.dialog("选择一个出场武将", [list, "character"]);
					game.pause();
					_status.imchoosing = true;
					event.custom.replace.button = function (button) {
						event.choice = button.link;
						game.resume();
					};
					event.custom.replace.confirm = game.resume;
					event.switchToAuto = game.resume;
					"step 1";
					if (ui.confirm) {
						ui.confirm.classList.add("removing");
					}
					_status.imchoosing = false;
					event.dialog.close();
					if (event.choice) {
						var name = event.choice;
						game.addChessPlayer(name);
						game.data.arena.dead.push(name);
						game.saveData();
						if (!_status.arenaAdd) {
							_status.arenaAdd = [];
						}
						_status.arenaAdd.push(name);
						game.delay();
					} else {
						player.getStat("skill").arenaAdd--;
					}
				},
			},
			leader_zhaoxiang: {
				unique: true,
				enable: "phaseUse",
				usable: 1,
				promptfunc: function (event, player) {
					var targets = [];
					var skill = lib.skill.leader_zhaoxiang;
					for (var i = 0; i < game.players.length; i++) {
						if (!game.data.character.includes(game.players[i].name) && game.players[i].side != player.side) {
							targets.push(game.players[i]);
						}
					}
					var str = lib.translate.leader_zhaoxiang_info;
					if (targets.length) {
						str = '<p style="text-align:center;line-height:20px;margin-top:0">⚑ ' + game.data.dust + '</p><p style="text-align:center;line-height:20px;margin-top:8px">';
						for (var i = 0; i < targets.length; i++) {
							str += '<span style="width:120px;display:inline-block;text-align:right">' + get.translation(targets[i]) + '：</span><span style="width:120px;display:inline-block;text-align:left">' + (skill.chance(targets[i], player) * 100).toFixed(2) + "%</span><br>";
						}
						str += "</p>";
					}
					return str;
				},
				chance: function (target, player) {
					var chance;
					var renyi = player.hasSkill("leader_renyi");
					switch (target.hp) {
						case 1:
							chance = 0.7;
							break;
						case 2:
							chance = 0.4;
							break;
						default:
							chance = 0.2;
							break;
					}
					switch (target.countCards("he")) {
						case 0:
							break;
						case 1:
							chance /= 1.2;
							break;
						case 2:
							chance /= 1.4;
							break;
						case 3:
							chance /= 1.7;
							break;
						default:
							chance /= 2;
							break;
					}
					switch (game.getRarity(target.name)) {
						case "common": {
							if (renyi) chance *= 2;
							break;
						}
						case "rare": {
							chance /= 2;
							if (renyi) chance *= 2;
							break;
						}
						case "epic": {
							chance /= 5;
							if (renyi) chance *= 1.5;
							break;
						}
						case "legend": {
							chance /= 15;
							if (renyi) chance *= 1.2;
							break;
						}
					}
					return Math.min(1, chance);
				},
				filter: function () {
					return game.data.dust >= 10;
				},
				filterTarget: function (card, player, target) {
					return game.isChessNeighbour(player, target) && !game.data.character.includes(target.name);
				},
				content: function () {
					var chance = lib.skill.leader_zhaoxiang.chance(target, player);
					game.changeDust(-10);
					if (Math.random() < chance) {
						_status.zhaoxiang = target.name;
						game.data.character.add(target.name);
						game.saveData();
						game.over();
					} else {
						game.log("招降", target, "失败");
						player.popup("招降失败");
						player.damage(target);
					}
				},
			},
			leader_xiaoxiong: {
				unique: true,
				forced: true,
				trigger: { source: "damageSource" },
				filter: function (event, player) {
					return event.num > 0;
				},
				content: function () {
					switch (_status.difficulty) {
						case "leader_easy":
							game.reward += 2 * trigger.num;
							break;
						case "leader_medium":
							game.reward += 4 * trigger.num;
							break;
						case "leader_hard":
							game.reward += 6 * trigger.num;
							break;
					}
				},
			},
			leader_renyi: {
				unique: true,
			},
			leader_mouduan: {
				unique: true,
				global: "leader_mouduan2",
			},
			leader_mouduan2: {
				mod: {
					chessMove: function (player, current) {
						if (player.side && player.name != _status.lord) return current + 1;
					},
				},
			},
			leader_zhenlve: {
				trigger: { global: "useCard1" },
				unique: true,
				charlotte: true,
				firstDo: true,
				forced: true,
				popup: false,
				filter: function (event, player) {
					return get.type(event.card) == "trick" && event.player.isFriendOf(player);
				},
				content: function () {
					trigger.nowuxie = true;
				},
			},
			tongshuai: {
				unique: true,
				forbid: ["guozhan"],
				init: function (player) {
					player.storage.tongshuai = {
						list: [],
						owned: {},
						player: player,
						get: function (num) {
							if (typeof num != "number") num = 1;
							var player = this.player;
							while (num--) {
								var name = player.storage.tongshuai.unowned.shift();
								if (!name) return;
								var skills = lib.character[name][3].slice(0);
								for (var i = 0; i < skills.length; i++) {
									var info = lib.skill[skills[i]];
									if (info.unique && !info.gainable) {
										skills.splice(i--, 1);
									}
								}
								player.storage.tongshuai.owned[name] = skills;
								game.addVideo("chess_tongshuai", player, player.storage.tongshuai.owned);
							}
						},
					};
				},
				group: ["tongshuai1", "tongshuai2", "tongshuai3"],
				intro: {
					content: function (storage, player) {
						var str = "";
						var slist = storage.owned;
						var list = [];
						for (var i in slist) {
							list.push(i);
						}
						if (list.length) {
							str += get.translation(list[0]);
							for (var i = 1; i < list.length; i++) {
								str += "、" + get.translation(list[i]);
							}
						}
						var skill = player.additionalSkills.tongshuai[0];
						if (skill) {
							str += "<p>当前技能：" + get.translation(skill);
						}
						return str;
					},
					mark: function (dialog, content, player) {
						var slist = content.owned;
						var list = [];
						for (var i in slist) {
							list.push(i);
						}
						if (list.length) {
							dialog.addSmall([list, "character"]);
						}
						var skill = player.additionalSkills.tongshuai[0];
						if (skill) {
							dialog.add('<div><div class="skill">【' + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>");
						}
					},
				},
				// mark:true
			},
			tongshuai1: {
				trigger: { global: "gameStart" },
				forced: true,
				popup: false,
				priority: 10,
				content: function () {
					for (var i = 0; i < game.data.character.length; i++) {
						var skills = lib.character[game.data.character[i]][3];
						var add = false;
						for (var j = 0; j < skills.length; j++) {
							var info = lib.skill[skills[j]];
							if (info.gainable || !info.unique) {
								add = true;
								break;
							}
						}
						if (add) {
							player.storage.tongshuai.list.push(game.data.character[i]);
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						player.storage.tongshuai.list.remove([game.players[i].name]);
						player.storage.tongshuai.list.remove([game.players[i].name1]);
						player.storage.tongshuai.list.remove([game.players[i].name2]);
					}
					player.storage.tongshuai.unowned = player.storage.tongshuai.list.slice(0);
					player.storage.tongshuai.unowned.sort(lib.sort.random);
					if (player.storage.tongshuai.unowned.length > 1) {
						player.storage.tongshuai.get(2);
					} else if (player.storage.tongshuai.unowned.length == 1) {
						player.storage.tongshuai.get();
					} else {
						player.removeSkill("tongshuai");
					}
				},
			},
			tongshuai2: {
				audio: 2,
				trigger: { player: ["phaseBegin", "phaseEnd"], global: "gameStart" },
				filter: function (event, player, name) {
					if (!player.hasSkill("tongshuai")) return false;
					if (name == "phaseBegin" && game.phaseNumber == 1) return false;
					return true;
				},
				priority: -9,
				forced: true,
				popup: false,
				content: function () {
					var slist = player.storage.tongshuai.owned;
					var list = [];
					for (var i in slist) {
						list.push(i);
					}
					if (event.isMine()) {
						event.dialog = ui.create.dialog("选择获得一项技能", [list, "character"]);
						if (trigger.name == "game") {
							event.control = ui.create.control();
						} else {
							event.control = ui.create.control(["cancel"]);
						}
						event.clickControl = function (link) {
							if (link != "cancel") {
								var currentname = event.dialog.querySelector(".selected.button").link;
								var mark = player.marks.tongshuai;
								if (!mark) {
									player.markSkill("tongshuai");
									mark = player.marks.tongshuai;
									if (mark.firstChild) {
										mark.firstChild.remove();
									}
								}
								mark.setBackground(currentname, "character");

								player.addAdditionalSkill("tongshuai", link);
								game.addVideo("chess_tongshuai_skill", player, [currentname, link]);
								player.logSkill("tongshuai2");
								game.log(player, "获得技能", "【" + get.translation(link) + "】");
								player.popup(link);

								for (var i = 0; i < event.dialog.buttons.length; i++) {
									if (event.dialog.buttons[i].classList.contains("selected")) {
										var name = event.dialog.buttons[i].link;
										player.sex = lib.character[name][0];
										player.group = lib.character[name][1];
										// player.node.identity.style.backgroundColor=get.translation(player.group+'Color');
										break;
									}
								}
							}
							ui.auto.show();
							event.dialog.close();
							event.control.close();
							_status.imchoosing = false;
							game.resume();
						};
						event.control.custom = event.clickControl;
						ui.auto.hide();
						_status.imchoosing = true;
						game.pause();
						for (var i = 0; i < event.dialog.buttons.length; i++) {
							event.dialog.buttons[i].classList.add("selectable");
						}
						event.custom.replace.button = function (button) {
							if (button.classList.contains("selected")) {
								button.classList.remove("selected");
								if (trigger.name == "game") {
									event.control.style.opacity = 0;
								} else {
									event.control.replace(["cancel"]);
								}
							} else {
								for (var i = 0; i < event.dialog.buttons.length; i++) {
									event.dialog.buttons[i].classList.remove("selected");
								}
								button.classList.add("selected");
								event.control.replace(slist[button.link]);
								if (trigger.name == "game" && getComputedStyle(event.control).opacity == 0) {
									event.control.style.transition = "opacity 0.5s";
									ui.refresh(event.control);
									event.control.style.opacity = 1;
									event.control.style.transition = "";
									ui.refresh(event.control);
								} else {
									event.control.style.opacity = 1;
								}
							}
							event.control.custom = event.clickControl;
						};
						event.custom.replace.window = function () {
							for (var i = 0; i < event.dialog.buttons.length; i++) {
								if (event.dialog.buttons[i].classList.contains("selected")) {
									event.dialog.buttons[i].classList.remove("selected");
									if (trigger.name == "game") {
										event.control.style.opacity = 0;
									} else {
										event.control.replace(["cancel"]);
									}
									event.control.custom = event.clickControl;
									return;
								}
							}
						};
					} else {
						event.finish();
					}
				},
			},
			tongshuai3: {
				unique: true,
				trigger: { player: "phaseBegin" },
				forced: true,
				filter: function (event, player) {
					return player.storage.tongshuai && player.storage.tongshuai.unowned && player.storage.tongshuai.unowned.length > 0;
				},
				content: function () {
					player.storage.tongshuai.get();
				},
			},
			cangming: {
				enable: "phaseUse",
				usable: 1,
				unique: true,
				filter: function (event, player) {
					if (player.isTurnedOver()) return false;
					var suits = [];
					var hs = player.getCards("h");
					for (var i = 0; i < hs.length; i++) {
						suits.add(get.suit(hs[i]));
						if (suits.length >= 4) return true;
					}
					return false;
				},
				filterCard: function (card) {
					var suit = get.suit(card);
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (suit == get.suit(ui.selected.cards[i])) return false;
					}
					return true;
				},
				complexCard: true,
				selectCard: 4,
				check: function (card) {
					return 10 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					return player != target;
				},
				selectTarget: -1,
				content: function () {
					target.goMad();
					if (!player.isTurnedOver()) {
						player.turnOver();
					}
					player.addSkill("cangming2");
				},
				ai: {
					order: 10,
					effect: {
						player_use: function (card, player) {
							var num = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (get.attitude(player, game.players[i]) < 0) {
									num++;
									if (num > 1) break;
								}
							}
							if (num <= 1) return;
							if (_status.currentPhase == player && player.countCards("h") < player.hp && player.hp >= 6) {
								if (typeof card == "string") return;
								if (card.name == "wuzhong") return;
								if (card.name == "shunshou") return;
								if (card.name == "yuanjiao") return;
								if (card.name == "yiyi") return;
								if (!player.hasSkill("cangming2")) return "zeroplayertarget";
							}
						},
					},
					result: {
						target: function (player) {
							var num = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (get.attitude(player, game.players[i]) < 0) {
									num++;
									if (num > 1) break;
								}
							}
							if (num <= 1) return 0;
							return -10;
						},
					},
				},
			},
			cangming2: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				popup: false,
				content: function () {
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].unMad();
					}
					player.removeSkill("cangming2");
				},
			},
			boss_moyan: {
				trigger: { player: "phaseEnd" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					event.players = get.players(player);
					"step 1";
					if (event.players.length) {
						event.players.shift().damage("fire");
						event.redo();
					}
				},
			},
			boss_stonebaolin: {
				inherit: "juece",
			},
			boss_stoneqiangzheng: {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i].countCards("h")) return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					var players = get.players(player);
					players.remove(player);
					event.players = players;
					player.line(players, "green");
					"step 1";
					if (event.players.length) {
						var current = event.players.shift();
						var hs = current.getCards("h");
						if (hs.length) {
							var card = hs.randomGet();
							player.gain(card, current);
							current.$giveAuto(card, player);
						}
						event.redo();
					}
				},
			},
			guanchuan: {
				trigger: { player: "useCardToPlayer" },
				getTargets: function (player, target) {
					var targets = [];
					var pxy = player.getXY();
					var txy = target.getXY();
					var dx = txy[0] - pxy[0];
					var dy = txy[1] - pxy[1];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i] != target) {
							var axy = game.players[i].getXY();
							var dx2 = axy[0] - pxy[0];
							var dy2 = axy[1] - pxy[1];
							if (dx * dx2 < 0) continue;
							if (dy * dy2 < 0) continue;
							if (dx == 0) {
								if (dx2 == 0) {
									targets.push(game.players[i]);
								}
							} else if (dx2 != 0) {
								if (dy2 / dx2 == dy / dx) {
									targets.push(game.players[i]);
								}
							}
						}
					}
					return targets;
				},
				filter: function (event, player) {
					if (event.targets.length != 1 || event.card.name != "sha") return false;
					return lib.skill.guanchuan.getTargets(player, event.targets[0]).length > 0;
				},
				check: function (event, player) {
					var targets = lib.skill.guanchuan.getTargets(player, event.targets[0]);
					var eff = 0;
					for (var i = 0; i < targets.length; i++) {
						eff += get.effect(targets[i], event.card, player, player);
					}
					return eff > 0;
				},
				content: function () {
					var targets = lib.skill.guanchuan.getTargets(player, trigger.targets[0]);
					for (var i = 0; i < targets.length; i++) {
						trigger.targets.push(targets[i]);
					}
					player.logSkill("guanchuan", targets);
				},
			},
			sanjiansheji: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards("h", "sha") > 1 && lib.filter.filterCard({ name: "sha" }, player);
				},
				filterCard: { name: "sha" },
				selectCard: 2,
				check: function (card) {
					var num = 0;
					var player = _status.event.player;
					for (var i = 0; i < game.players.length; i++) {
						if (lib.filter.targetEnabled({ name: "sha" }, player, game.players[i]) && get.effect(game.players[i], { name: "sha" }, player) > 0) {
							num++;
							if (num > 1) return 8 - get.value(card);
						}
					}
					return 0;
				},
				selectTarget: [1, Infinity],
				discard: false,
				prepare: "throw",
				filterTarget: function (card, player, target) {
					return lib.filter.targetEnabled({ name: "sha" }, player, target) && get.distance(player, target, "pure") <= 5;
				},
				content: function () {
					targets.sort(lib.sort.seat);
					player.useCard({ name: "sha" }, cards, targets, "luanjian").animate = false;
				},
				multitarget: true,
				ai: {
					order: function () {
						return get.order({ name: "sha" }) + 0.1;
					},
					result: {
						target: function (player, target) {
							return get.effect(target, { name: "sha" }, player, target);
						},
					},
					effect: {
						player: function (card, player) {
							if (_status.currentPhase != player) return;
							if (card.name == "sha" && player.countCards("h", "sha") < 2 && player.countCards("h") <= player.hp) {
								var num = 0;
								var player = _status.event.player;
								for (var i = 0; i < game.players.length; i++) {
									if (lib.filter.targetEnabled({ name: "sha" }, player, game.players[i]) && get.attitude(player, game.players[i]) < 0) {
										num++;
										if (num > 1) return "zeroplayertarget";
									}
								}
							}
						},
					},
				},
			},
			zhiming: {
				trigger: { source: "damageBegin1" },
				filter: function (event, player) {
					return get.distance(event.player, player, "attack") > 1 && event.card && event.card.name == "sha";
				},
				forced: true,
				content: function () {
					trigger.num++;
				},
			},
			lianshe: {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") {
							return (
								num +
								player.getHistory("useCard", function (evt) {
									return evt.card.name != "sha";
								}).length
							);
						}
					},
				},
				trigger: { player: "useCard" },
				frequent: true,
				filter: function (event, player) {
					return (
						event.card &&
						event.card.name == "sha" &&
						player.getHistory("useCard", function (evt) {
							return evt.card.name == "sha";
						})[0] == event
					);
				},
				content: function () {
					player.draw();
				},
				ai: {
					threaten: 1.5,
				},
			},
			pianyi: {
				direct: true,
				filter: function (event, player) {
					return !player.getStat("damage");
				},
				content: function () {
					"step 0";
					player.chooseToMoveChess(2, get.prompt("pianyi"));
					"step 1";
					if (result.bool) {
						player.logSkill("pianyi");
					}
				},
			},
			lingdong: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				filter: function (event, player) {
					return (
						player.getHistory("useCard", function (evt) {
							return evt.card.name == "sha";
						}).length > 0
					);
				},
				content: function () {
					"step 0";
					player.chooseToMoveChess(
						player.getHistory("useCard", function (evt) {
							return evt.card.name == "sha";
						}).length,
						get.prompt("lingdong")
					);
					"step 1";
					if (result.bool) {
						player.logSkill("lingdong");
					}
				},
			},
			_noactpunish: {
				trigger: { player: "useCard" },
				filter: function (event, player) {
					return _status.currentPhase == player && event.targets && (event.targets.length > 1 || event.targets[0] != player);
				},
				forced: true,
				popup: false,
				content: function () {
					player.addTempSkill("noactpunish");
				},
			},
			noactpunish: {},
			_chess_chuzhang: {
				enable: "phaseUse",
				usable: 1,
				direct: true,
				delay: false,
				preservecancel: true,
				filter: function (event, player) {
					var num = 0;
					var xy = player.getXY();
					var neighbour;
					neighbour = player.getNeighbour(-1, 0);
					if (neighbour && typeof neighbour.tempObstacle != "number" && game.obstacles.includes(neighbour)) {
						num++;
					} else if (xy[0] == 0) {
						num++;
					}
					neighbour = player.getNeighbour(1, 0);
					if (neighbour && typeof neighbour.tempObstacle != "number" && game.obstacles.includes(neighbour)) {
						num++;
					} else if (xy[0] + 1 >= ui.chesswidth) {
						num++;
					}
					neighbour = player.getNeighbour(0, -1);
					if (neighbour && typeof neighbour.tempObstacle != "number" && game.obstacles.includes(neighbour)) {
						num++;
					} else if (xy[1] == 0) {
						num++;
					}
					neighbour = player.getNeighbour(0, 1);
					if (neighbour && typeof neighbour.tempObstacle != "number" && game.obstacles.includes(neighbour)) {
						num++;
					} else if (xy[1] + 1 >= ui.chessheight) {
						num++;
					}
					return num >= 3;
				},
				content: function () {
					"step 0";
					event.obstacles = [];
					event.movemap = {};
					var neighbour;
					neighbour = player.getNeighbour(-1, 0);
					if (neighbour && typeof neighbour.tempObstacle != "number" && game.obstacles.includes(neighbour)) {
						event.obstacles.push(neighbour);
						if (player.movable(-2, 0)) {
							event.movemap["[-1,0]"] = neighbour;
						}
					}
					neighbour = player.getNeighbour(1, 0);
					if (neighbour && typeof neighbour.tempObstacle != "number" && game.obstacles.includes(neighbour)) {
						event.obstacles.push(neighbour);
						if (player.movable(2, 0)) {
							event.movemap["[1,0]"] = neighbour;
						}
					}
					neighbour = player.getNeighbour(0, -1);
					if (neighbour && typeof neighbour.tempObstacle != "number" && game.obstacles.includes(neighbour)) {
						event.obstacles.push(neighbour);
						if (player.movable(0, -2)) {
							event.movemap["[0,-1]"] = neighbour;
						}
					}
					neighbour = player.getNeighbour(0, 1);
					if (neighbour && typeof neighbour.tempObstacle != "number" && game.obstacles.includes(neighbour)) {
						event.obstacles.push(neighbour);
						if (player.movable(0, 2)) {
							event.movemap["[0,1]"] = neighbour;
						}
					}
					if (!event.obstacles.length) {
						event.finish();
						return;
					} else if (event.obstacles.length == 1) {
						event.obstacle = event.obstacles[0];
					} else if (event.isMine()) {
						for (var i = 0; i < event.obstacles.length; i++) {
							event.obstacles[i].classList.add("glow");
						}
						event.chooseObstacle = true;
						game.pause();
						_status.imchoosing = true;
						event.dialog = ui.create.dialog("移动一个与你相邻的路障");
						event.dialog.add('<div class="text">' + lib.translate._chess_chuzhang_info + "</div>");
						event.custom.replace.confirm = function () {
							player.getStat().skill._chess_chuzhang--;
							event.cancelled = true;
							game.resume();
						};
					}
					"step 1";
					if (ui.confirm) {
						ui.confirm.classList.add("removing");
					}
					_status.imchoosing = false;
					if (!event.cancelled) {
						if (!event.obstacle) {
							event.obstacle = event.obstacles.randomGet();
						}
						var moved = false;
						for (var i in event.movemap) {
							if (event.movemap[i] == event.obstacle) {
								var xy = JSON.parse(i);
								if (game.moveObstacle(event.obstacle, xy[0], xy[1])) {
									moved = true;
									break;
								}
							}
						}
						if (!moved) {
							game.removeObstacle(event.obstacle);
						}
						player.popup("除障");
						game.delay();
					}
					for (var i = 0; i < event.obstacles.length; i++) {
						event.obstacles[i].classList.remove("glow");
					}
					if (event.dialog) {
						event.dialog.close();
					}
				},
				ai: {
					result: {
						player: 1,
					},
					order: 7.5,
				},
			},
			_phasequeue: {
				trigger: { player: "phaseBegin" },
				forced: true,
				popup: false,
				content: function () {
					var current = ui.chessinfo.firstChild.querySelector(".glow2");
					if (current) {
						current.classList.remove("glow2");
					}
					if (player.instance) {
						player.instance.classList.add("glow2");
						ui.chessinfo.firstChild.scrollTop = player.instance.offsetTop - 8;
					}
				},
			},
			_chessmove: {
				enable: "phaseUse",
				usable: 1,
				direct: true,
				delay: false,
				preservecancel: true,
				filter: function (event, player) {
					if (!player.movable(0, 1) && !player.movable(0, -1) && !player.movable(1, 0) && !player.movable(-1, 0)) {
						return false;
					}
					var move = 2;
					move = game.checkMod(player, move, "chessMove", player);
					return move > 0;
				},
				content: function () {
					"step 0";
					var move = 2;
					move = game.checkMod(player, move, "chessMove", player);
					player.chooseToMoveChess(move).phasing = true;
					"step 1";
					if (ui.confirm) {
						ui.confirm.classList.add("removing");
					}
					if (!result.bool) {
						var skill = player.getStat().skill;
						skill._chessmove--;
						if (typeof skill._chessmovetried == "number") {
							skill._chessmovetried++;
						} else {
							skill._chessmovetried = 1;
						}
					}
				},
				ai: {
					order: 5,
					result: {
						playerx: function (player) {
							if (get.mode() == "tafang" && _status.enemies.includes(player)) {
								return 1;
							}
							var nh = player.countCards("h");
							if (!player.countCards("h", "sha") && !player.countCards("h", "shunshou") && !player.countCards("h", "bingliang")) {
								if (nh <= Math.min(3, player.hp)) return Math.random() - 0.3;
								else if (nh <= Math.min(2, player.hp)) return Math.random() - 0.4;
								return Math.random() - 0.5;
							}
							var neighbour;
							neighbour = player.getNeighbour(0, 1);
							if (neighbour && game.players.includes(neighbour) && neighbour.side != player.side) {
								if (get.distance(player, neighbour, "attack") < 1) return 1;
								return 0;
							}
							neighbour = player.getNeighbour(0, -1);
							if (neighbour && game.players.includes(neighbour) && neighbour.side != player.side) {
								if (get.distance(player, neighbour, "attack") < 1) return 1;
								return 0;
							}
							neighbour = player.getNeighbour(1, 0);
							if (neighbour && game.players.includes(neighbour) && neighbour.side != player.side) {
								if (get.distance(player, neighbour, "attack") < 1) return 1;
								return 0;
							}
							neighbour = player.getNeighbour(-1, 0);
							if (neighbour && game.players.includes(neighbour) && neighbour.side != player.side) {
								if (get.distance(player, neighbour, "attack") < 1) return 1;
								return 0;
							}
							return 1;
						},
						player: function (player) {
							if (player.getStat().skill._chessmovetried >= 10) {
								return 0;
							}
							var x = lib.skill._chessmove.ai.result.playerx(player);
							if (player.isMad()) return -x;
							return x;
						},
					},
				},
			},
			_chesscenter: {
				trigger: {
					player: ["phaseBegin", "useCardBegin", "useSkillBegin", "respondBegin", "damageBegin", "loseHpBegin"],
					target: "useCardToBegin",
				},
				forced: true,
				priority: 100,
				popup: false,
				content: function () {
					player.chessFocus();
				},
			},
			boss_bfengxing: {
				mod: {
					chessMove: function (player, current) {
						return current + 2;
					},
					attackFrom: function (from, to, current) {
						return current - 2;
					},
				},
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				filter: function (event) {
					return !event.numFixed;
				},
				content: function () {
					trigger.num += 2;
				},
			},
			boss_chiyu: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "red" },
				nodelay: true,
				check: function (card) {
					return 8 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					return get.distance(player, target) <= 5 && player != target;
				},
				filter: function (event, player) {
					return player.countCards("h", { color: "red" }) > 0;
				},
				selectTarget: -1,
				content: function () {
					target.damage("fire");
				},
				line: "fire",
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target, "fire");
						},
					},
				},
			},
			boss_tenglong: {
				enable: "phaseUse",
				usable: 1,
				position: "he",
				filterCard: { type: "equip" },
				init: function (player) {
					for (var i = 1; i < 6; i++) {
						player.disableEquip("equip" + i);
					}
				},
				check: function (card) {
					var player = _status.currentPhase;
					if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
						return 12 - get.equipValue(card);
					}
					return 8 - get.equipValue(card);
				},
				filter: function (event, player) {
					return player.countCards("he", { type: "equip" });
				},
				filterTarget: function (card, player, target) {
					return player != target && get.distance(player, target) <= 2;
				},
				content: function () {
					target.damage(3, "fire");
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target, "fire");
						},
					},
				},
			},
			boss_wuying: {
				mod: {
					globalTo: function (from, to, distance) {
						return distance + 2;
					},
					chessMove: function (player, current) {
						return current - 1;
					},
				},
			},
			boss_wushang: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i].countCards("h") && get.distance(player, game.players[i]) <= 5) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var players = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i].countCards("h") && get.distance(player, game.players[i]) <= 5) {
							players.push(game.players[i]);
						}
					}
					players.sort(lib.sort.seat);
					event.players = players;
					"step 1";
					if (event.players.length) {
						event.current = event.players.shift();
						event.current.chooseCard("神天并地：交给" + get.translation(player) + "一张手牌", true);
					} else {
						event.finish();
					}
					"step 2";
					if (result.cards.length) {
						player.gain(result.cards, event.current);
						event.current.$give(1, player);
						event.goto(1);
					}
				},
			},
		},
		translate: {
			zhu_config: "启用主将",
			main_zhu_config: "启用副将",
			noreplace_end_config: "无替补时结束",
			reward_config: "杀敌摸牌",
			punish_config: "杀死队友",
			seat_order_config: "行动顺序",
			battle_number_config: "对战人数",
			replace_number_config: "替补人数",
			first_less_config: "先手少摸牌",
			single_control_config: "单人控制",
			additional_player_config: "无尽模式",
			choice_number_config: "无尽模式候选",

			friend: "友",
			enemy: "敌",
			neutral: "中",
			trueColor: "zhu",
			falseColor: "wei",
			_chessmove: "移动",
			leader: "君主",
			combat: "对阵",
			chessscroll_speed_config: "边缘滚动速度",
			chess_character_config: "战棋武将",
			only_chess_character_config: "只用战棋武将",
			chess_ordered_config: "指定行动顺序",
			chess_mode_config: "游戏模式",
			chess_leader_save_config: "选择历程",
			chess_leader_clear_config: "清除进度",
			save1: "一",
			save2: "二",
			save3: "三",
			save4: "四",
			save5: "五",

			leader_2: " ",
			leader_2_bg: "二",
			leader_3: " ",
			leader_3_bg: "三",
			leader_5: " ",
			leader_5_bg: "五",
			leader_8: " ",
			leader_8_bg: "八",

			leader_easy: " ",
			leader_easy_bg: "简单",
			leader_medium: " ",
			leader_medium_bg: "普通",
			leader_hard: " ",
			leader_hard_bg: "困难",

			chess_caocao: "曹操",
			chess_xunyu: "荀彧",
			chess_simayi: "司马懿",
			chess_xiahoudun: "夏侯惇",
			chess_dianwei: "典韦",
			chess_xuzhu: "许褚",
			chess_zhangliao: "张辽",
			chess_jiaxu: "贾诩",

			chess_liubei: "刘备",
			chess_guanyu: "关羽",
			chess_zhangfei: "张飞",
			chess_zhaoyun: "赵云",
			chess_machao: "马超",
			chess_huangzhong: "黄忠",
			chess_maliang: "马良",
			chess_zhugeliang: "诸葛亮",

			chess_sunquan: "孙权",
			chess_zhouyu: "周瑜",
			chess_lvmeng: "吕蒙",
			chess_huanggai: "黄盖",
			chess_lusu: "鲁肃",
			chess_luxun: "陆逊",
			chess_ganning: "甘宁",
			chess_taishici: "太史慈",

			chess_lvbu: "吕布",
			chess_sunshangxiang: "孙尚香",
			chess_diaochan: "貂蝉",
			chess_huatuo: "华佗",
			chess_zhangjiao: "张辽",
			chess_menghuo: "孟获",

			chess_dongzhuo: "董卓",
			chess_xingtian: "刑天",
			chess_jinchidiao: "金翅雕",
			chess_beimingjukun: "北溟巨鲲",
			chess_wuzhaojinlong: "五爪金龙",

			treasure_dubiaoxianjing: "毒镖陷阱",
			treasure_jiqishi: "集气石",
			treasure_shenmidiaoxiang: "神秘雕像",
			treasure_shenpanxianjing: "审判之刃",
			treasure_shiyuansu: "石元素",
			treasure_wuyashenxiang: "乌鸦神像",

			dubiaoxianjing: "飞刃",
			dubiaoxianjing_info: "距离两格体力值大于1的角色在回合结束后受到1点伤害，然后摸两张牌。",
			jiqishi: "集气",
			jiqishi_info: "距离两格以内的已受伤角色在回合结束后回复1点体力，然后弃置两张牌。",
			shenmidiaoxiang: "秘咒",
			shenmidiaoxiang_info: "距离三格以外的所有角色在回合结束后强制向此处移动一格。",
			shenpanxianjing: "审判",
			shenpanxianjing_info: "在任意一名角色回合结束后，若没有其他角色手牌数比其多，随机弃置其一张手牌。",
			shiyuansu: "护体",
			shiyuansu_info: "任意一名角色一次性受到不少于2点伤害后，使其获得1点护甲。",
			wuyashenxiang: "厄音",
			wuyashenxiang_info: "距离3格以内的角色在其回合结束后，若体力值不大于1，令其回复1点体力，然后将牌堆中的一张延时锦囊牌置于其判定区。",

			leader_caocao: "曹操",
			leader_liubei: "刘备",
			leader_sunquan: "孙权",
			leader_yuri: "由理",
			leader_xiaoxiong: "枭雄",
			leader_xiaoxiong_info: "当你造成伤害后，获胜后会得到一定数量的额外金币奖励。",
			leader_renyi: "仁义",
			leader_renyi_info: "你招降敌将的成功率大幅增加。",
			leader_mouduan: "谋断",
			leader_mouduan_info: "其他友方角色回合内的行动范围+1。",
			leader_zhenlve: "缜略",
			leader_zhenlve_info: "友方角色使用的普通锦囊牌不可被【无懈可击】响应。",

			tongshuai: "统率",
			tongshuai_info: "准备阶段和结束阶段，你可以选择一名未上场的已方武将的一个技能作为你的技能。",
			leader_zhaoxiang: "招降",
			leader_zhaoxiang_info: "出牌阶段限一次，你可以尝试对相邻敌方武将进行招降，若成功，你获得该武将并立即结束本局游戏，若失败，你受到1点伤害。每发动一次消耗10招募令。",

			common: "普通",
			rare: "精品",
			epic: "史诗",
			legend: "传说",

			chess_shezhang: "设置路障",
			chess_shezhang_info: "选择一名角色，在其四周设置临时路障，持续X回合（X为存活角色数）。",
			chess_chuzhang: "清除路障",
			chess_chuzhang_info: "将与你相邻的路障向后推移一格，每影响一个路障你摸一张牌。",

			_chess_chuzhang: "除障",
			_chess_chuzhang_info: "出牌阶段限一次，若你周围四格至少有三个为障碍或在边缘外，你可以选择将其中一个障碍向后推移一格（若无法推移则改为清除之）。",

			arenaAdd: "援军",
			arenaAdd_info: "出牌阶段限一次，你可以令一名未出场的已方角色加入战场。战斗结束后，该角色无论是否存活均不能再次出场。",

			pianyi: "翩仪",
			pianyi_info: "结束阶段，若你于本回合内未造成过伤害，你获得一次移动机会。",
			lingdong: "灵动",
			lingdong_info: "结束阶段，你可以移动至多X格（X为你本回合内使用【杀】的次数）。",
			lianshe: "箭舞",
			lianshe_info: "当你于一回合内首次使用【杀】时，你可以摸一张牌；你的回合内，当你使用一张不为【杀】的牌时，你令本回合内使用【杀】的次数上限+1。",
			zhiming: "穿杨",
			zhiming_info: "锁定技，当你使用【杀】造成伤害时，若你不在目标角色的攻击范围内，此伤害+1。",
			sanjiansheji: "散箭",
			sanjiansheji_info: "你可以将两张【杀】当做【杀】使用，你以此法使用的【杀】可以指定距离5格内的角色为目标。",
			guanchuan: "强弩",
			guanchuan_info: "当你使用【杀】指定唯一目标后，你可令攻击射线内的其他角色也成为此【杀】的目标。",

			boss_stoneqiangzheng: "强征",
			boss_stoneqiangzheng_info: "锁定技，结束阶段，你获得所有其他角色的各一张手牌。",
			boss_stonebaolin: "暴凌",
			boss_moyan: "魔焰",
			boss_moyan_info: "锁定技，结束阶段，你对场上所有角色造成1点火焰伤害。",

			cangming: "颠动沧溟",
			cangming_info: "出牌阶段限一次，你可弃置四张花色不同的手牌并将武将牌翻至背面，然后令所有其他角色进入混乱状态直到你的下一回合开始。",
			boss_bfengxing: "风行",
			boss_bfengxing_info: "锁定技，摸牌阶段，你多摸两张牌；你的攻击范围+2；你回合内的移动距离+2。",
			boss_chiyu: "炽羽",
			boss_chiyu_info: "出牌阶段限一次，你可以弃置一张红色牌，对距离5以内的所有其他角色各造成1点火焰伤害。",
			boss_tenglong: "腾龙八齐",
			boss_tenglong_info: "锁定技，你废除你的装备区；出牌阶段限一次，你可以弃置一张装备牌并对一名距离你2以内的其他角色造成3点火焰伤害。",
			boss_wushang: "神天并地",
			boss_wushang_info: "锁定技，准备阶段，距离你5以内的所有其他角色需交给你一张手牌。",
			boss_wuying: "无影",
			boss_wuying_info: "锁定技，你回合内的移动距离-1；其他角色至你的距离+2。",

			chess_default: "常规",
			chess_boss: "魔王",
			chess_leader: "君主",

			mode_chess_character_config: "战棋模式",
			mode_chess_card_config: "战棋模式",
		},
		ui: {
			placeChess: function (player, pos) {
				player.dataset.position = pos;
				pos = parseInt(pos);
				var j = Math.floor(pos / ui.chesswidth);
				var i = pos - j * ui.chesswidth;
				var dx = i * 148;
				var dy = j * 148;
				player._chesstransform = [dx, dy];
				player.style.transform = "translate(" + dx + "px," + dy + "px)";
			},
			create: {
				playergrid: function (player, x, y) {
					var pos = player.getDataPos(x, y);
					if (get.mode() == "tafang") {
						if (pos < ui.chesswidth) return false;
						if (pos / ui.chesswidth >= ui.chessheight - 1) return false;
					}
					var node = ui.create.div(".player.minskin.playergrid", player.parentNode);
					node.link = player;
					ui.placeChess(node, pos);
					return node;
				},
				fakeme: function () {
					if (ui.fakeme) {
						ui.fakeme.delete();
					}
					ui.fakeme = ui.create.div(".fakeme.avatar", ui.me);
					ui.fakeme.style.backgroundImage = game.me.node.avatar.style.backgroundImage;
				},
			},
			click: {
				moveContainer: function (x, y, scroll) {
					if (scroll) {
						clearTimeout(ui.chessContainer._scrolling);
						ui.chessContainer._scrolling = true;
						ui.chess.style.transition = "transform 0.5s";
						ui.refresh(ui.chess);
					} else if (ui.chessContainer._scrolling) {
						return;
					}
					if (typeof x === "number") ui.chessContainer.chessLeft += x;
					if (typeof y === "number") ui.chessContainer.chessTop += y;
					var xmin = 0;
					if (lib.config.show_history == "left") {
						xmin = -50;
					}
					if (ui.chessContainer.chessLeft < xmin) ui.chessContainer.chessLeft = xmin;
					if (ui.chessContainer.chessTop < 0) ui.chessContainer.chessTop = 0;
					var xmax = ui.chessContainer.xmax;
					var ymax = ui.chessContainer.ymax;
					if (ui.chessContainer.chessLeft > xmax) ui.chessContainer.chessLeft = xmax;
					if (ui.chessContainer.chessTop > ymax) ui.chessContainer.chessTop = ymax;
					ui.chess.style.transform = "translate(" + -ui.chessContainer.chessLeft + "px," + -ui.chessContainer.chessTop + "px)";
					if (scroll) {
						var ending = ui.chess.listenTransition(function () {
							if (ui.chess._ending == ending) {
								clearTimeout(ui.chessContainer._scrolling);
								delete ui.chess._ending;
								ui.chess._scrolling = setTimeout(function () {
									ui.chessContainer._scrolling = null;
									ui.chess.style.transition = "";
								}, 500);
							}
						});
						ui.chess._ending = ending;
					}
				},
				chessInfo: function (e) {
					if (this.link.isAlive()) {
						this.link.chessFocus();
						if (this.link.classList.contains("selectable") || this.link.classList.contains("selected")) {
							ui.click.target.call(this.link, e);
							ui.click.window.call(ui.window, e);
						}
						e.stopPropagation();
					}
				},
				playergrid: function () {
					if (!_status.paused) return;
					var pos = parseInt(this.dataset.position);
					this.link.moveTo(pos % ui.chesswidth, Math.floor(pos / ui.chesswidth));
					if (ui.movegrids) {
						while (ui.movegrids.length) {
							ui.movegrids.shift().delete();
						}
					}
					_status.event.result = {
						bool: true,
						move: this.link.dataset.position,
					};
					game.resume();
				},
				obstacle: function () {
					if (_status.event.chooseObstacle && _status.paused && _status.event.obstacles && _status.event.obstacles.includes(this)) {
						_status.event.obstacle = this;
						game.resume();
					}
				},
			},
		},
		get: {
			chessDistance: function (from, to) {
				var fxy = from.getXY();
				var txy = to.getXY();
				return Math.abs(fxy[0] - txy[0]) + Math.abs(fxy[1] - txy[1]);
			},
			rawAttitude: function (from, to) {
				return from.side === to.side ? 6 : -6;
			},
		},
		card: {
			chess_shezhang: {
				type: "basic",
				fullskin: true,
				modeimage: "chess",
				enable: true,
				filterTarget: function (card, player, target) {
					if (target.movable(-1, 0)) return true;
					if (target.movable(1, 0)) return true;
					if (target.movable(0, -1)) return true;
					if (target.movable(0, 1)) return true;
					return false;
				},
				content: function () {
					var xy = target.getXY();
					var x = xy[0];
					var y = xy[1];
					if (target.movable(-1, 0)) {
						game.addTempObstacle(x - 1, y, game.countPlayer());
					}
					if (target.movable(1, 0)) {
						game.addTempObstacle(x + 1, y, game.countPlayer());
					}
					if (target.movable(0, 1)) {
						game.addTempObstacle(x, y + 1, game.countPlayer());
					}
					if (target.movable(0, -1)) {
						game.addTempObstacle(x, y - 1, game.countPlayer());
					}
				},
				content_old: function () {
					"step 0";
					var pos = parseInt(player.dataset.position);
					var poses = [];
					if (player.movable(-1, 0)) {
						poses.push(pos - 1);
					}
					if (player.movable(1, 0)) {
						poses.push(pos + 1);
					}
					if (player.movable(0, -1)) {
						poses.push(pos - ui.chesswidth);
					}
					if (player.movable(0, 1)) {
						poses.push(pos + ui.chesswidth);
					}
					event.poses = poses;
					if (poses.length == 1) {
						event.obstacle = poses[0];
						event.grids = [];
					} else if (event.isMine()) {
						event.grids = player.createRangeShadow(1, function () {
							event.obstacle = this.dataset.position;
							game.resume();
						});
						game.pause();
						_status.imchoosing = true;
						for (var i = 0; i < event.grids.length; i++) {
							event.grids[i].addTempClass("start");
						}
						event.dialog = ui.create.dialog("选择一个位置放置障碍");
					} else {
						event.grids = [];
					}
					"step 1";
					_status.imchoosing = false;
					if (!event.obstacle) {
						event.obstacle = event.poses.randomGet();
					}
					if (event.obstacle) {
						game.addObstacle(event.obstacle.toString());
					}
					while (event.grids.length) {
						event.grids.shift().delete();
					}
					if (event.dialog) {
						event.dialog.close();
					}
					player.draw();
				},
				ai: {
					result: {
						target: function (player, target) {
							if (target.getNeighbours().length) return 0;
							return -1;
						},
					},
					order: 1,
				},
			},
			chess_chuzhang: {
				type: "basic",
				fullskin: true,
				modeimage: "chess",
				filterTarget: function (card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				enable: function (event, player) {
					if (game.obstacles.includes(player.getNeighbour(-1, 0)) && player.movable(-2, 0)) return true;
					if (game.obstacles.includes(player.getNeighbour(1, 0)) && player.movable(2, 0)) return true;
					if (game.obstacles.includes(player.getNeighbour(0, -1)) && player.movable(0, -2)) return true;
					if (game.obstacles.includes(player.getNeighbour(0, 1)) && player.movable(0, 2)) return true;
				},
				content: function () {
					var neighbour,
						num = 0;
					neighbour = player.getNeighbour(-1, 0);
					if (neighbour && game.obstacles.includes(neighbour) && player.movable(-2, 0)) {
						game.moveObstacle(neighbour, -1, 0);
						num++;
					}
					neighbour = player.getNeighbour(1, 0);
					if (neighbour && game.obstacles.includes(neighbour) && player.movable(2, 0)) {
						game.moveObstacle(neighbour, 1, 0);
						num++;
					}
					neighbour = player.getNeighbour(0, -1);
					if (neighbour && game.obstacles.includes(neighbour) && player.movable(0, -2)) {
						game.moveObstacle(neighbour, 0, -1);
						num++;
					}
					neighbour = player.getNeighbour(0, 1);
					if (neighbour && game.obstacles.includes(neighbour) && player.movable(0, 2)) {
						game.moveObstacle(neighbour, 0, 1);
						num++;
					}
					if (num) {
						player.draw(num);
					}
				},
				content_old: function () {
					"step 0";
					event.obstacles = [];
					var neighbour;
					neighbour = player.getNeighbour(-1, 0);
					if (neighbour && game.obstacles.includes(neighbour)) {
						event.obstacles.push(neighbour);
					}
					neighbour = player.getNeighbour(1, 0);
					if (neighbour && game.obstacles.includes(neighbour)) {
						event.obstacles.push(neighbour);
					}
					neighbour = player.getNeighbour(0, -1);
					if (neighbour && game.obstacles.includes(neighbour)) {
						event.obstacles.push(neighbour);
					}
					neighbour = player.getNeighbour(0, 1);
					if (neighbour && game.obstacles.includes(neighbour)) {
						event.obstacles.push(neighbour);
					}
					if (!event.obstacles.length) {
						event.finish();
						return;
					} else if (event.obstacles.length == 1) {
						event.obstacle = event.obstacles[0];
					} else if (event.isMine()) {
						for (var i = 0; i < event.obstacles.length; i++) {
							event.obstacles[i].classList.add("glow");
						}
						event.chooseObstacle = true;
						game.pause();
						_status.imchoosing = true;
						event.dialog = ui.create.dialog("选择一个与你相邻的障碍清除之");
					}
					"step 1";
					_status.imchoosing = false;
					if (!event.obstacle) {
						event.obstacle = event.obstacles.randomGet();
					}
					game.removeObstacle(event.obstacle.dataset.position);
					for (var i = 0; i < event.obstacles.length; i++) {
						event.obstacles[i].classList.remove("glow");
					}
					if (event.dialog) {
						event.dialog.close();
					}
					player.draw();
				},
				ai: {
					result: {
						player: 1,
					},
					order: 8,
				},
			},
			leader_2: {
				opacity: 1,
				color: "white",
				textShadow: "black 0 0 2px",
			},
			leader_3: {
				opacity: 1,
				color: "white",
				textShadow: "black 0 0 2px",
			},
			leader_5: {
				opacity: 1,
				color: "white",
				textShadow: "black 0 0 2px",
			},
			leader_8: {
				opacity: 1,
				color: "white",
				textShadow: "black 0 0 2px",
			},
			leader_easy: {
				color: "white",
				opacity: 1,
				textShadow: "black 0 0 2px",
				// image:'mode/chess/difficulty/leader_easy'
			},
			leader_medium: {
				color: "white",
				opacity: 1,
				textShadow: "black 0 0 2px",
				// image:'mode/chess/difficulty/leader_medium'
			},
			leader_hard: {
				color: "white",
				opacity: 1,
				textShadow: "black 0 0 2px",
				// image:'mode/chess/difficulty/leader_hard'
			},
		},
		characterSort: {
			mode_chess: {
				chess_default: ["chess_zhangliao", "chess_huangzhong", "chess_taishici", "chess_sunshangxiang", "chess_diaochan"],
				chess_boss: ["chess_jinchidiao", "chess_beimingjukun", "chess_wuzhaojinlong", "chess_dongzhuo", "chess_xingtian"],
				chess_leader: ["leader_caocao", "leader_liubei", "leader_sunquan", "leader_yuri"],
			},
		},
		characterPack: {
			mode_chess: {
				leader_caocao: ["male", "wei", 4, ["leader_xiaoxiong"]],
				leader_liubei: ["male", "shu", 4, ["leader_renyi"]],
				leader_sunquan: ["male", "wu", 4, ["leader_mouduan"]],
				leader_yuri: ["female", "key", 4, ["leader_zhenlve"]],
				// chess_caocao:['male','wei',3,['']],
				// chess_xunyu:['male','wei',3,['']],
				// chess_simayi:['male','wei',3,['']],
				// chess_xiahoudun:['male','wei',3,['']],
				// chess_dianwei:['male','wei',3,['']],
				// chess_xuzhu:['male','wei',3,['']],
				chess_zhangliao: ["male", "wei", 4, ["gongji", "zhiming"]],
				// chess_jiaxu:['male','wei',3,['']],
				//
				// chess_liubei:['male','shu',3,['']],
				// chess_guanyu:['male','shu',3,['']],
				// chess_zhangfei:['male','shu',3,['']],
				// chess_zhaoyun:['male','shu',3,['']],
				// chess_machao:['male','shu',3,['']],
				chess_huangzhong: ["male", "shu", 4, ["sanjiansheji", "liegong"]],
				// chess_maliang:['male','shu',3,['']],
				// chess_zhugeliang:['male','shu',3,['']],
				//
				// chess_sunquan:['male','wu',3,['']],
				// chess_zhouyu:['male','wu',3,['qinyin']],
				// chess_lvmeng:['male','wu',3,['']],
				// chess_huanggai:['male','wu',3,['']],
				// chess_lusu:['male','wu',3,['']],
				// chess_luxun:['male','wu',3,['']],
				// chess_ganning:['male','wu',3,['']],
				chess_taishici: ["male", "wu", 4, ["gongji", "guanchuan", "pojun"]],
				//
				// chess_lvbu:['male','qun',3,['']],
				chess_sunshangxiang: ["female", "wu", 3, ["lingdong", "lianshe", "gongji"]],
				chess_diaochan: ["female", "qun", 3, ["xingzhui", "pianyi", "rebiyue"]],
				// chess_huatuo:['male','qun',3,['zhenjiu','mazui']],
				// chess_zhangjiao:['male','qun',3,['']],
				// chess_menghuo:['male','qun',3,['']],
				//
				chess_jinchidiao: ["male", "qun", 15, ["boss_bfengxing", "boss_chiyu"], ["boss", "chessboss"]],
				chess_beimingjukun: ["male", "qun", 25, ["boss_wuying", "cangming"], ["boss", "chessboss"]],
				chess_wuzhaojinlong: ["male", "qun", 30, ["boss_tenglong", "boss_wushang"], ["boss", "chessboss"]],
				chess_dongzhuo: ["male", "qun", 20, ["jiuchi", "boss_stoneqiangzheng", "boss_stonebaolin"], ["boss", "chessboss"]],
				chess_xingtian: ["male", "qun", 99, ["boss_moyan", "wushuang"], ["boss", "chessboss"]],
			},
		},
		cardPack: {
			mode_chess: ["chess_shezhang", "chess_chuzhang"],
		},
		chess_cardlist: [
			["heart", 1, "chess_shezhang"],
			["diamond", 1, "chess_shezhang"],
			["club", 1, "chess_chuzhang"],
			["spade", 1, "chess_chuzhang"],
		],
		rank: {},
		posmap: {},
		help: {
			战棋模式:
				'<div style="margin:10px">对阵模式</div><ul style="margin-top:0"><li>n人对战n人的模式，由单人控制，开始游戏后随机分配位置与出牌顺序<li>' +
				"每人在出牌阶段有一次移动的机会，可移动的最大距离为2<li>" +
				"任何卡牌或技能无法指定位置相隔8个格以上的角色为目标<li>" +
				"杀死对方阵营的角色可摸一张牌，杀死本方阵营无惩罚<li>" +
				"若开启主将，双方各选择一名角色成为主将。主将体力上限加一，主将死亡后，若有副将，副将代替之成为主将，否则游戏结束<li>" +
				"开启无尽模式后，任何一方有角色死亡都将选择一名新角色重新加入战场，直到点击左上角的结束游戏按钮手动结束游戏。结束游戏时，杀敌更多的一方获胜<li>" +
				"行动顺序为指定时，双方无论存活角色角色多少都将轮流进行行动。在一方所有角色行动完毕进行下一轮行动时，若其人数比另一方少，另一方可指定至多X名角色名摸一张牌，X为人数之差<li>" +
				"开启战场机关后，每个回合结束时有一定机率出现一个机关，该机关不参与战斗，并有一个影响周围或全体角色的效果。机关在出现后的5~10个回合内消失<li>" +
				"开启击退效果后，当一名角色对距离两格以内的目标造成伤害后，受伤害角色将沿反方向移动一格<li>" +
				"战场上可设置出现随机路障，角色无法移动到路障处。当一名角色的周围四格有至少三格为路障或在战场外时，其可以在回合内清除一个相邻路障</ul>" +
				'<div style="margin:10px">君主模式</div><ul style="margin-top:0"><li>收集武将进行战斗，根据战斗难度及我方出场武将的强度，战斗胜利后将获得数量不等的金钱。没有君主出场时，获得的金钱较多<li>' +
				"金钱可以用来招募随机武将，招到已有武将，或遣返不需要的武将时可得到招募令<li>" +
				"战斗中有君主出场时可招降敌将，成功率取决于敌将的稀有度、剩余体力值以及手牌数。成功后战斗立即结束且没有金钱奖励。每发动一次招降，无论成功还是失败，都会扣除10招募令<li>" +
				"挑战武将会与该武将以及与其强度相近的武将进行战斗，敌方人数与我方出场人数相同，但不少于3。胜利后可通过招募令招募该武将，普通/稀有/史诗/传说武将分别需要40/100/400/1600招募令<li>" +
				"竞技场：<br>随机选择9名武将，每次派出1~3名武将参战。战斗中阵亡的武将不能再次上场。<br><br>战斗后武将进入疲劳状态，若立即再次出场则初始体力值-1。<br><br>战斗中本方武将行动时可召唤后援，令一名未出场的已方武将加入战斗。后援武将在战斗结束后无论存活与否均不能再次出场<br><br>当取得12场胜利或所有武将全部阵亡后结束，并根据胜场数获得随机奖励<li>" +
				"修改金钱：<br>game.changeMoney<br>修改招募令：<br>game.changeDust</ul>",
		},
	};
};
