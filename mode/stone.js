import { lib, game, ui, get, ai, _status } from "../noname.js";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "stone",
		start() {
			"step 0";
			lib.init.css(lib.assetURL + "layout/mode/", "stone");
			_status.mode = "deck";
			game.initStone();
			var playback = localStorage.getItem(lib.configprefix + "playback");

			if (!playback && _status.mode == "deck") {
				var createCardDialog = function () {
					ui.deckBuilder = ui.create.div(".popup-container#deck-builder", function () {
						if (careerList.classList.contains("shown")) {
							careerList.classList.remove("shown");
							newDeck.classList.remove("active");
						} else if (!cardDialog.classList.contains("shown")) {
							this.classList.remove("shown");
							this.timeout = setTimeout(function () {
								ui.deckBuilder.remove();
							}, 500);
							ui.arena.style.top = "";
							ui.arena.style.transform = "";
							ui.arena.style.opacity = "";
							ui.system.style.opacity = "";
							ui.auto.show();
							ui.pause.show();
							ui.historybar.show();
						}
					});
					var clickNode = function () {
						cardDialog.classList.add("shown");
						controls.classList.add("shown");
						var name = "未命名";
						for (var i = 1; ; i++) {
							if (!lib.storage.deckList[name + i]) {
								break;
							}
						}
						cardDialog.editing = {
							name: name + i,
							content: {
								career: this.firstChild.dataset.career,
								deck: [],
							},
						};
						rename.innerHTML = name + i;
						newDeck.innerHTML = "确认编辑";
						newDeck.classList.add("active");
						careerList.classList.remove("shown");
						listContainer.style.transform = "translateX(200px)";
						deckContainer.innerHTML = "";
						deckContainer.classList.add("shown");
						updateCardDialog();
					};
					var careerList = ui.create.div(".shadowed.career", ui.deckBuilder);
					for (var i = 0; i < lib.careerList.length; i++) {
						var node = ui.create.div(careerList, clickNode);
						ui.create.div(".menubutton.round", node).dataset.career = lib.careerList[i];
						ui.create.div(".text", lib.translate[lib.careerList[i]], node);
					}
					var controls = ui.create.div(".controls", ui.deckBuilder);
					var cardCount = ui.create.div(".card-count", controls);
					ui.create.div(".menubutton.large", "删除", controls, function (e) {
						if (this.innerHTML == "删除") {
							this.innerHTML = "确定";
							var that = this;
							setTimeout(function () {
								that.innerHTML = "删除";
							}, 1000);
						} else {
							cardDialog.classList.remove("shown");
							controls.classList.remove("shown");
							newDeck.innerHTML = "新建卡组";
							newDeck.classList.remove("active");
							var editing = cardDialog.editing;
							if (editing) {
								if (editing.origin) {
									delete lib.storage.deckList[editing.origin];
									for (var i = 0; i < listContainer.childElementCount; i++) {
										if (listContainer.childNodes[i].name == editing.origin) {
											listContainer.childNodes[i].remove();
											break;
										}
									}
								}
							}
							game.save("deckList", lib.storage.deckList);
							listContainer.style.transform = "";
							deckContainer.classList.remove("shown");
							updateCardDialog();
						}
						e.stopPropagation();
					});
					var rename = ui.create.div(".menubutton.large", "重命名", controls);
					rename.contentEditable = true;
					rename.onfocus = function () {
						var range = document.createRange();
						range.selectNodeContents(this);
						var sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					};
					rename.onblur = function () {
						if (cardDialog.editing) {
							if (!lib.storage.deckList[this.innerHTML]) {
								cardDialog.editing.name = this.innerHTML;
							} else {
								this.innerHTML = cardDialog.editing.name;
							}
						}
						var sel = window.getSelection();
						sel.removeAllRanges();
					};
					rename.onkeydown = function (e) {
						if (e.keyCode == 13) {
							e.preventDefault();
							e.stopPropagation();
							rename.blur();
						}
					};
					var removeLine = function () {
						rename.innerHTML = rename.innerHTML.replace(/\n|<br>/g, "");
					};
					var observer = new MutationObserver(removeLine);
					observer.observe(rename, { characterData: true, subtree: true });
					rename.addEventListener("keyup", removeLine);

					var cardDialog = ui.create.cardDialog(
						true,
						function (name) {
							if (lib.card[name].stonehidden) {
								return true;
							}
							var type = lib.card[name].type;
							return type != "stonecard" && type != "stonecharacter";
						},
						{
							seperate: function (list) {
								var nl = [],
									ns = [];
								var career = {};
								var careerspell = {};
								for (var i = 0; i < lib.careerList.length; i++) {
									career[lib.careerList[i]] = [];
									careerspell[lib.careerList[i]] = [];
								}
								var result = {
									list: {},
								};
								for (var i = 0; i < list.length; i++) {
									if (lib.card[list[i][2]].type == "stonecard") {
										if (lib.card[list[i][2]].career && lib.careerList.includes(lib.card[list[i][2]].career)) {
											careerspell[lib.card[list[i][2]].career].push(list[i]);
										} else {
											ns.push(list[i]);
										}
									} else {
										if (lib.card[list[i][2]].career && lib.careerList.includes(lib.card[list[i][2]].career)) {
											career[lib.card[list[i][2]].career].push(list[i]);
										} else {
											nl.push(list[i]);
										}
									}
								}
								for (var i = 0; i < lib.careerList.length; i++) {
									result.list[get.translation(lib.careerList[i])] = careerspell[lib.careerList[i]].concat(career[lib.careerList[i]]);
									result["法术·" + get.translation(lib.careerList[i]) + "_link:" + lib.careerList[i]] = careerspell[lib.careerList[i]];
									result["随从·" + get.translation(lib.careerList[i]) + "_link:" + lib.careerList[i]] = career[lib.careerList[i]];
								}
								result.list["中立"] = ns.concat(nl);
								result["法术·中立"] = ns;
								result["随从·中立"] = nl;
								return result;
							},
						}
					);
					for (var i = 0; i < cardDialog.buttons.length; i++) {
						if (cardDialog.buttons[i].node.info.innerHTML.indexOf("随从") != -1) {
							var buttonName = cardDialog.buttons[i].link[2];
							buttonName = buttonName.slice(0, buttonName.indexOf("_stonecharacter"));
							buttonName = lib.character[buttonName];
							cardDialog.buttons[i].node.info.innerHTML = buttonName[5][1] + "/" + buttonName[2];
						}
						lib.setIntro(cardDialog.buttons[i]);
					}
					var updateCardDialog = function (button) {
						if (!deckContainer.classList.contains("shown")) {
							for (var i = 0; i < cardDialog.buttons.length; i++) {
								cardDialog.buttons[i].classList.remove("unselectable");
							}
							for (var i = 0; i < cardDialog.content.childElementCount; i++) {
								cardDialog.content.childNodes[i].classList.remove("nodisplay");
							}
							return;
						}
						if (deckContainer.childElementCount >= 30) {
							for (var i = 0; i < cardDialog.buttons.length; i++) {
								cardDialog.buttons[i].classList.add("unselectable");
							}
						} else {
							var nummap = {};
							for (var i = 0; i < deckContainer.childElementCount; i++) {
								var name = deckContainer.childNodes[i].name;
								if (!nummap[name]) {
									nummap[name] = 1;
								} else {
									nummap[name]++;
								}
							}
							var list = [];
							for (var i in nummap) {
								if (nummap[i] >= 2) {
									list.push(i);
								}
							}
							for (var i = 0; i < cardDialog.buttons.length; i++) {
								if (list.includes(cardDialog.buttons[i].link[2])) {
									cardDialog.buttons[i].classList.add("unselectable");
								} else {
									cardDialog.buttons[i].classList.remove("unselectable");
								}
							}
						}
						var career = cardDialog.editing.content.career;
						for (var i = 0; i < cardDialog.content.childElementCount; i++) {
							var currentNode = cardDialog.content.childNodes[i];
							if (currentNode.link) {
								if (currentNode.link == career) {
									currentNode.classList.remove("nodisplay");
									currentNode.nextSibling.classList.remove("nodisplay");
								} else {
									currentNode.classList.add("nodisplay");
									currentNode.nextSibling.classList.add("nodisplay");
								}
							}
						}
						cardCount.innerHTML = deckContainer.childElementCount + "/30";
					};
					var clickCard = function () {
						this.remove();
						updateCardDialog();
					};
					var clickButton = function () {
						if (!deckContainer.classList.contains("shown")) {
							return;
						}
						if (!this.classList.contains("unselectable")) {
							var card = ui.create.card(null, "noclick").init(this.link).listen(clickCard);
							deckContainer.insertBefore(card, deckContainer.firstChild);
							updateCardDialog();
						}
					};
					for (var i = 0; i < cardDialog.buttons.length; i++) {
						cardDialog.buttons[i].listen(clickButton);
					}
					cardDialog.classList.add("fullheight");
					cardDialog.classList.add("scroll1");
					cardDialog.classList.add("scroll2");
					cardDialog.classList.add("fixed");
					cardDialog.listen(function (e) {
						e.stopPropagation();
					});

					ui.deckBuilder.appendChild(cardDialog);
					var deckList = ui.create.div(".shadowed.list", ui.deckBuilder, function (e) {
						e.stopPropagation();
						if (careerList.classList.contains("shown")) {
							careerList.classList.remove("shown");
							newDeck.classList.remove("active");
						}
					});
					var editDeck = function () {
						if (!cardDialog.classList.contains("shown")) {
							cardDialog.classList.add("shown");
							controls.classList.add("shown");
							var info = lib.storage.deckList[this.name];
							cardDialog.editing = {
								origin: this.name,
								name: this.name,
								content: {
									career: info.career,
									deck: info.deck,
								},
							};
							rename.innerHTML = this.name;
							newDeck.innerHTML = "确认编辑";
							newDeck.classList.add("active");
							careerList.classList.remove("shown");
							listContainer.style.transform = "translateX(200px)";
							deckContainer.innerHTML = "";
							for (var i = 0; i < info.deck.length; i++) {
								ui.create
									.card(deckContainer, "noclick")
									.init(["", get.translation(lib.card[info.deck[i]].type), info.deck[i]])
									.listen(clickCard);
							}
							deckContainer.classList.add("shown");
							updateCardDialog();
						}
					};
					var newDeck = ui.create.div(".menubutton.large.create", "新建卡组", deckList, function (e) {
						if (this.innerHTML == "新建卡组") {
							this.classList.toggle("active");
							if (this.classList.contains("active")) {
								careerList.classList.add("shown");
							} else {
								careerList.classList.remove("shown");
							}
						} else {
							cardDialog.classList.remove("shown");
							controls.classList.remove("shown");
							this.innerHTML = "新建卡组";
							this.classList.remove("active");
							var editing = cardDialog.editing;
							if (editing) {
								editing.content.deck.length = 0;
								for (var i = 0; i < deckContainer.childElementCount; i++) {
									editing.content.deck.push(deckContainer.childNodes[i].name);
								}
								editing.content.deck.sort(function (a, b) {
									if (a > b) {
										return 1;
									}
									if (a < b) {
										return -1;
									}
									return 0;
								});
								if (editing.origin) {
									for (var i = 0; i < listContainer.childElementCount; i++) {
										if (listContainer.childNodes[i].name == editing.origin) {
											listContainer.childNodes[i].name = editing.name;
											listContainer.childNodes[i].firstChild.innerHTML = editing.name;
											break;
										}
									}
									delete lib.storage.deckList[editing.origin];
								} else if (!lib.storage.deckList[editing.name]) {
									var deckitem = ui.create.div(".deckitem.shadowed", "<span>" + editing.name + "</span>", listContainer, editDeck);
									ui.create.div(".menubutton.round", deckitem).dataset.career = editing.content.career;
									deckitem.name = editing.name;
								}
								lib.storage.deckList[editing.name] = editing.content;
							}
							game.save("deckList", lib.storage.deckList);
							listContainer.style.transform = "";
							deckContainer.classList.remove("shown");
							updateCardDialog();
						}
						e.stopPropagation();
					});
					var listContainer = ui.create.div(".list-container", deckList);
					for (var i in lib.storage.deckList) {
						var deckitem = ui.create.div(".deckitem.shadowed", "<span>" + i + "</span>", listContainer, editDeck);
						ui.create.div(".menubutton.round", deckitem).dataset.career = lib.storage.deckList[i].career;
						deckitem.name = i;
					}
					var deckContainer = ui.create.div(".list-container.deck", deckList);
					if (ui.deckcontrol) {
						ui.deckcontrol.show();
						setTimeout(function () {
							if (ui.deckcontrol) {
								ui.deckcontrol.style.transition = "";
							}
						}, 500);
					}
				};

				ui.deckcontrol = ui.create.system(
					"卡组管理",
					function () {
						if (this.classList.contains("hidden")) {
							return;
						}
						// if(lib.config.low_performance){
						// 	ui.arena.style.transform='translateY('+ui.window.offsetHeight+'px)';
						// }
						// else{
						// 	ui.arena.style.top='100%';
						// }
						// ui.arena.style.transform='scale(0.6)';
						ui.arena.style.opacity = 0;
						ui.system.style.opacity = 0;
						ui.window.appendChild(ui.deckBuilder);
						if (ui.deckBuilder.timeout) {
							clearTimeout(ui.deckBuilder.timeout);
							delete ui.deckBuilder.timeout;
						}
						ui.refresh(ui.deckBuilder);
						ui.deckBuilder.classList.add("shown");
						ui.auto.hide();
						ui.pause.hide();
						ui.historybar.hide();
					},
					true
				);

				if (lib.onfree) {
					ui.deckcontrol.style.transition = "all 0.5s";
					ui.deckcontrol.hide();
					lib.onfree.push(createCardDialog);
				} else {
					createCardDialog();
				}
			}

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
			} else {
				game.prepareArena(2);
				// game.delay();
			}
			ui.arena.classList.add("stone");
			"step 1";
			for (var i = 0; i < game.players.length; i++) {
				game.players[i].getId();
				game.players[i].classList.add("noidentity");
			}
			game.enemy = game.me.next;
			game.chooseCharacter();
			"step 2";
			if (_status.mode == "deck") {
				_status.deckButton = ui.create.system("卡组", null, true);
				lib.setPopped(
					_status.deckButton,
					function () {
						var uiintro = ui.create.dialog("hidden");
						uiintro.listen(function (e) {
							e.stopPropagation();
						});
						uiintro.add('剩余 <span style="font-family:' + "xinwei" + '">' + game.me.deckCards.length);
						uiintro.addSmall([game.me.deckCards, "card"]);
						return uiintro;
					},
					220
				);
				if (get.config("skill_bar")) {
					_status.rageEnabled = true;

					ui.friendBar = ui.create.div(".skillbar.right.shadowed.playerbg", ui.arena);
					ui.enemyBar = ui.create.div(".skillbar.left.shadowed.playerbg", ui.arena);
					// ui.friendBar.dataset.nature='metal';
					// ui.enemyBar.dataset.nature='fire';
					ui.create.div(".skillbarshadow", ui.friendBar);
					ui.create.div(".skillbarshadow", ui.enemyBar);
					ui.create.div(".skillbarfill", ui.friendBar);
					ui.create.div(".skillbarfill", ui.enemyBar);
					ui.friendBar.fillnode = ui.create.div(ui.friendBar.lastChild);
					ui.enemyBar.fillnode = ui.create.div(ui.enemyBar.lastChild);
					// ui.friendBar.popnode=ui.create.div('.skillbartext',ui.friendBar);
					// ui.enemyBar.popnode=ui.create.div('.skillbartext',ui.enemyBar);
					_status.friendRage = 0;
					_status.enemyRage = 0;

					lib.setIntro(ui.friendBar, null, true);
					lib.setIntro(ui.enemyBar, null, true);
				}
			}
			_status.friendCount = ui.create.system("", null, true);
			_status.enemyCount = ui.create.system("", null, true);
			game.updateStatusCount();
			lib.setPopped(_status.friendCount, function () {
				var uiintro = ui.create.dialog("hidden");

				if (_status.deadfriend.length) {
					uiintro.add("已阵亡");
					uiintro.add([_status.deadfriend, "player"]);
				}

				uiintro.add("未上场");
				if (_status.mylist.length) {
					uiintro.add([_status.mylist, "character"]);
				} else {
					uiintro.add("（无）");
				}

				return uiintro;
			});
			lib.setPopped(_status.enemyCount, function () {
				if (_status.deadenemy.length) {
					var uiintro = ui.create.dialog("hidden");
					uiintro.add("已阵亡");
					uiintro.add([_status.deadenemy, "player"]);
					return uiintro;
				}
			});

			game.me.side = Math.random() < 0.5;
			game.enemy.side = !game.me.side;

			var players = get.players(lib.sort.position);
			var info = [];
			for (var i = 0; i < players.length; i++) {
				info.push({
					name: players[i].name1,
					name2: players[i].name2,
					count: players[i].actcount,
				});
			}
			(_status.videoInited = true), game.addVideo("init", null, info);

			event.trigger("gameStart");
			if (_status.mode == "deck") {
				game.gameDraw(game.me, 3);
				game.me.drawDeck(1, false);
				game.me.next.drawDeck(1, false);
			} else {
				game.gameDraw(game.me);
			}
			"step 3";
			game.me.chooseBool("是否置换手牌？");
			"step 4";
			if (result.bool) {
				var hs = game.me.getCards("h");
				for (var i = 0; i < hs.length; i++) {
					hs[i].discard(false);
				}
				if (_status.mode == "deck") {
					game.me.drawDeck(1, false);
					game.me.directgain(get.cards(3));
				} else {
					game.me.directgain(get.cards(4));
				}
			}
			"step 5";
			if (game.me.side) {
				game.stoneLoop(game.me);
			} else {
				game.stoneLoop(game.enemy);
			}
		},
		element: {
			content: {
				addFellowAuto: function () {
					"step 0";
					if (!player.canAddFellow()) {
						event.finish();
						return;
					}
					var name = event.fellowName;
					var added = false;
					var i;
					for (i = 0; i < player.actcharacterlist.length; i++) {
						if (player.actcharacterlist[i] === null) {
							added = true;
							break;
						}
					}
					var pos = i + 4;
					if (player != game.me) {
						pos += 4;
					}
					var fellow = game.addFellow(pos, name, "zoominanim");
					fellow.side = player.side;
					fellow.classList.add("turnedover");
					player.actcharacterlist[i] = fellow;
					event.source = fellow;
					var num = lib.character[name][5][1];
					if (num) {
						fellow.draw(num, false);
					}
					player.updateActCount();
					if (fellow.hasSkillTag("noPhaseDelay") || event.delay === false) {
						fellow.noPhaseDelay = true;
					}
					// player.line(fellow,'green');
					"step 1";
					event.trigger("fellow");
					event.result = event.source;
				},
			},
			stonecharacter: {
				type: "stonecharacter",
				fullimage: true,
				enable: function (event, player) {
					return player.canAddFellow();
				},
				recastable: function (event, player) {
					return !player.isMin() && !player.canAddFellow();
				},
				notarget: true,
				content: function () {
					"step 0";
					var name = card.name.slice(0, card.name.indexOf("_stonecharacter"));
					var added = false;
					var i;
					for (i = 0; i < player.actcharacterlist.length; i++) {
						if (player.actcharacterlist[i] === null) {
							added = true;
							break;
						}
					}
					var pos = i + 4;
					if (player != game.me) {
						pos += 4;
					}
					var fellow = game.addFellow(pos, name);
					fellow.side = player.side;
					fellow.classList.add("turnedover");
					player.actcharacterlist[i] = fellow;
					fellow.$gain2(card);
					event.source = fellow;
					var num = lib.character[name][5][1];
					if (num) {
						fellow.draw(num, false);
					}
					player.updateActCount();
					if (fellow.hasSkillTag("noPhaseDelay")) {
						fellow.noPhaseDelay = true;
					}
					"step 1";
					event.trigger("fellow");
				},
				ai: {
					order: 8.5,
					useful: [5.5, 1],
					result: {
						player: 1,
					},
				},
			},
			player: {
				init: function (player) {
					if (!player.isMin() || player.forcemin) {
						if (!player.node.actcount) {
							player.node.actcount = ui.create.div(".actcount.hp", player);
						}
						if (typeof player.actcount !== "number") {
							player.actcount = 0;
						}
						player.actused = 0;
						if (!player.actcharacterlist) {
							player.actcharacterlist = [];
						}
						player.updateActCount();
					}
				},
				changeRage: function (num) {
					if (_status.mode != "deck") {
						return;
					}
					if (!_status.rageEnabled) {
						return;
					}
					var popup = null;
					if (this.side == game.me.side) {
						if (_status.friendRage < 100) {
							popup = ui.friendBar;
						}
						_status.friendRage += num;
						if (_status.friendRage < 0) {
							_status.friendRage = 0;
						}
						if (_status.friendRage >= 100) {
							_status.friendRage = 100;
							ui.friendBar.fillnode.style.top = "-50%";
							ui.friendBar.classList.add("full");
						} else {
							ui.friendBar.fillnode.style.top = 100 - _status.friendRage + "%";
							ui.friendBar.classList.remove("full");
						}
					} else {
						if (_status.enemyRage < 100) {
							popup = ui.enemyBar;
						}
						_status.enemyRage += num;
						if (_status.enemyRage < 0) {
							_status.enemyRage = 0;
						}
						if (_status.enemyRage >= 100) {
							_status.enemyRage = 100;
							ui.enemyBar.fillnode.style.top = "-50%";
							ui.enemyBar.classList.add("full");
						} else {
							ui.enemyBar.fillnode.style.top = 100 - _status.enemyRage + "%";
							ui.enemyBar.classList.remove("full");
						}
					}
					if (num > 0 && popup) {
						var node = ui.create.div(".skillbartext", num.toString(), popup);
						ui.refresh(node);
						node.style.opacity = 1;
						setTimeout(function () {
							node.delete();
						}, 700);
					}
				},
				drawDeck: function (num, log) {
					if (!num) {
						num = 1;
					}
					var cards = this.getDeckCards(num);
					if (log == false) {
						this.directgain(cards);
					} else if (log == true) {
						this.directgain(cards);
						game.log(this, "从牌库中获得了" + get.cnNumber(num) + "张牌");
					} else {
						this.gain(cards, "draw");
						game.log(this, "从牌库中获得了" + get.cnNumber(num) + "张牌");
					}
					return cards;
				},
				updateActCount: function (used, countx, current) {
					if (_status.video) {
						this.actcount = countx || 2;
					} else {
						game.addVideo("updateActCount", this, [used, this.actcount, this.getActCount()]);
					}
					var maxcount, overflow2;
					if (game.layout == "default" || used == "outphase" || _status.currentPhase != this) {
						maxcount = this.actcount;
					} else {
						if (_status.video) {
							maxcount = this.actcount - (current || 0);
						} else {
							maxcount = this.actcount - this.getActCount();
						}
						if (this.actcount > maxcount) {
							maxcount = this.actcount;
						}
						if (maxcount > 12) {
							maxcount = this.actcount + 1;
							this.node.actcount.classList.add("overflow2");
						} else {
							this.node.actcount.classList.remove("overflow2");
						}
					}
					for (var i = 0; i < 12; i++) {
						if (maxcount > this.node.actcount.childElementCount) {
							ui.create.div(this.node.actcount);
						} else if (maxcount < this.node.actcount.childElementCount) {
							this.node.actcount.lastChild.remove();
						} else {
							break;
						}
					}
					if (used !== false) {
						var count;
						if (_status.video) {
							count = this.actcount - (current || 0);
						} else {
							count = this.actcount - this.getActCount();
						}
						for (var i = 0; i < this.node.actcount.childElementCount; i++) {
							if (i < count) {
								this.node.actcount.childNodes[i].classList.remove("lost");
								if (i >= this.actcount) {
									this.node.actcount.childNodes[i].classList.add("overflow");
								} else {
									this.node.actcount.childNodes[i].classList.remove("overflow");
								}
							} else {
								this.node.actcount.childNodes[i].classList.add("lost");
								this.node.actcount.childNodes[i].classList.remove("overflow");
							}
						}
					}
				},
				getAct: function () {
					return this.actcount - this.getActCount();
				},
				hasFellowSkill: function (skill, exclude) {
					for (var i = 0; i < game.players.length; i++) {
						if (exclude && game.players[i] == this) {
							continue;
						}
						if (game.players[i].hasSkill(skill) && game.players[i].side == this.side) {
							return true;
						}
					}
					return false;
				},
				countFellowSkill: function (skill, exclude) {
					var num = 0;
					for (var i = 0; i < game.players.length; i++) {
						if (exclude && game.players[i] == this) {
							continue;
						}
						if (game.players[i].hasSkill(skill) && game.players[i].side == this.side) {
							num++;
						}
					}
					return num;
				},
				canAddFellow: function () {
					if (!this.actcharacterlist) {
						return false;
					}
					if (this.actcharacterlist.length < 4) {
						return true;
					}
					for (var i = 0; i < this.actcharacterlist.length; i++) {
						if (this.actcharacterlist[i] === null) {
							return true;
						}
					}
					return false;
				},
				getDeckCards: function (num) {
					if (typeof num != "number") {
						num = 1;
					}
					if (!this.deckCards) {
						return get.cards(num);
					}
					var player = this;
					for (var i = 0; i < 5; i++) {
						if (player.deckCards.length < num) {
							get.deck(player, player.deck);
						} else {
							break;
						}
					}
					var list = [];
					for (var i = 0; i < num; i++) {
						list.push(player.deckCards.randomRemove());
					}
					return list;
				},
				getActCount: function () {
					return this.countUsed() + (this.actused || 0);
				},
				getLeader: function () {
					return this.side == game.me.side ? game.me : game.enemy;
				},
				getEnemy: function () {
					return this.side != game.me.side ? game.me : game.enemy;
				},
				hasFellow: function () {
					if (!this.actcharacterlist) {
						return false;
					}
					for (var i = 0; i < this.actcharacterlist.length; i++) {
						if (this.actcharacterlist[i]) {
							return true;
						}
					}
					return false;
				},
				getFellow: function (enemy) {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin()) {
							if (enemy) {
								if (game.players[i].side != this.side) {
									list.push(game.players[i]);
								}
							} else {
								if (game.players[i].side == this.side) {
									list.push(game.players[i]);
								}
							}
						}
					}
					return list;
				},
				countFellow: function () {
					if (!this.actcharacterlist) {
						return 0;
					}
					var num = 0;
					for (var i = 0; i < this.actcharacterlist.length; i++) {
						if (this.actcharacterlist[i]) {
							num++;
						}
					}
					return num;
				},
				addFellow: function (fellow) {
					if (!this.actcharacterlist) {
						return this;
					}
					var i;
					for (i = 0; i < this.actcharacterlist.length; i++) {
						if (this.actcharacterlist[i] === null) {
							break;
						}
					}
					this.actcharacterlist[i] = fellow;
					game.addVideo("stonePosition", null, [fellow.dataset.position, i + 4 + (this == game.me ? 0 : 4)]);
					fellow.dataset.position = i + 4 + (this == game.me ? 0 : 4);
					return this;
				},
				addFellowAuto: function (name, delay) {
					var next = game.createEvent("addFellowAuto");
					next.player = this;
					next.fellowName = name;
					if (typeof delay == "boolean") {
						next.delay = delay;
					}
					next.setContent("addFellowAuto");
				},
				removeFellow: function (fellow) {
					if (!this.actcharacterlist) {
						return this;
					}
					var index = this.actcharacterlist.indexOf(fellow);
					if (index >= 0) {
						this.actcharacterlist[index] = null;
					}
					return this;
				},
				dieAfter: function (source) {
					var dead = this;
					if (game.me.isDead()) {
						if (!_status.mylist.length) {
							_status.friendCount.innerHTML = "友军: " + get.cnNumber(0);
							game.over(false);
						}
					} else if (game.enemy.isDead()) {
						if (!_status.enemylist.length) {
							_status.enemyCount.innerHTML = "敌军: " + get.cnNumber(0);
							game.over(true);
						}
					}
				},
				dieAfter2: function (source) {
					var dead = this;
					if (game.me.isDead()) {
						if (!_status.mylist.length) {
							_status.friendCount.innerHTML = "友军: " + get.cnNumber(0);
							game.over(false);
						} else {
							game.pause();
							_status.deadfriend.push(this);
							game.additionaldead.push(this);
							setTimeout(function () {
								var player = ui.create.player();
								player.getId();
								player.classList.add("noidentity");
								player.dataset.position = dead.dataset.position;
								player.side = dead.side;
								player.actcharacterlist = dead.actcharacterlist;
								player.addTempClass("replaceme");
								player.actcount = game.enemy.actcount;
								player.actcount = dead.actcount;
								if (_status.double_character) {
									player.init(_status.mylist.shift(), _status.mylist.shift());
								} else {
									player.init(_status.mylist.shift());
								}
								player.maxHp++;
								player.hp++;
								if (_status.mode == "deck") {
									get.deck(player, _status.deck.shift());
								}
								game.players.push(player);
								ui.arena.appendChild(player);

								game.addVideo("stoneSwap", null, {
									name: player.name1,
									name2: player.name2,
									position: player.dataset.position,
									actcount: player.actcount,
									me: true,
								});
								game.swapControl(player);
								game.arrangePlayers();
								if (_status.mode == "deck") {
									var nd = game.enemy.countFellow();
									if (nd) {
										player.draw(3 + nd, { drawDeck: nd }, false);
									} else {
										player.draw(3, false);
									}
								} else {
									player.draw(3 + game.enemy.countFellow(), false);
								}
								game.resume();
								game.updateStatusCount();
							}, lib.config.duration);
						}
					} else if (game.enemy.isDead()) {
						if (!_status.enemylist.length) {
							_status.enemyCount.innerHTML = "敌军: " + get.cnNumber(0);
							game.over(true);
						} else {
							game.pause();
							_status.deadenemy.push(this);
							game.additionaldead.push(this);
							setTimeout(function () {
								var player = ui.create.player();
								player.getId();
								player.classList.add("noidentity");
								player.dataset.position = dead.dataset.position;
								player.side = dead.side;
								player.actcharacterlist = dead.actcharacterlist;
								player.addTempClass("replaceenemy");
								player.actcount = dead.actcount;
								if (_status.double_character) {
									player.init(_status.enemylist.shift(), _status.enemylist.shift());
								} else {
									player.init(_status.enemylist.shift());
								}
								player.maxHp++;
								player.hp++;
								if (_status.mode == "deck") {
									get.deck(player, "random");
								}
								game.players.push(player);
								game.enemy = player;
								ui.arena.appendChild(player);

								game.addVideo("stoneSwap", null, {
									name: player.name1,
									name2: player.name2,
									position: player.dataset.position,
									actcount: player.actcount,
								});
								game.arrangePlayers();
								if (_status.mode == "deck") {
									var nd = game.me.countFellow();
									if (nd) {
										player.draw(3 + nd, { drawDeck: nd }, false);
									} else {
										player.draw(3, false);
									}
								} else {
									player.draw(3 + game.me.countFellow(), false);
								}
								game.resume();
								game.updateStatusCount();
							}, lib.config.duration);
						}
					}
					if (source && source.side != this.side && !source.isMin()) {
						if (_status.mode == "deck") {
							source.drawDeck();
						} else {
							source.draw();
						}
						source.actused--;
						source.updateActCount();
					}
					game.dead.remove(this);
					game.arrangePlayers();
					this.getLeader().removeFellow(this);
					setTimeout(function () {
						dead.delete();
					}, 500);
				},
			},
		},
		beastList: ["stone_misha", "stone_leiouke", "stone_huofu", "stone_caoyuanshi", "stone_jiewangzhu", "stone_huangjialeixiang", "stone_damoshatuo", "stone_tujiu", "stone_senlinlang", "stone_fennuxiaoji", "stone_juxingchanchu", "stone_yanjingshe", "stone_yuanhou"],
		cardPack: {
			mode_stone: [
				"spell_xiaoshi",
				"spell_chenmo",
				"spell_morizaihuo",
				"spell_shengerpingdeng",
				"spell_jingshenkongzhi",
				"spell_anyingkuangluan",
				"spell_binghuan",
				"spell_yanmie",
				"spell_zhiliaozhichu",
				"spell_wangzhezhufu",
				"spell_diyulieyan",
				"spell_zhiliaoshui",
				"spell_hanbingjian",
				"spell_huoqiushu",
				"spell_bianxingshu",
				"spell_aoshuzhihui",
				"spell_baofengxue",
				"spell_lieyanfengbao",
				"spell_shandianfengbao",
				"spell_chazhuangshandian",
				"spell_yaoshu",
				"spell_shixue",
				"spell_lianhuanbaolie",
				"spell_yexinglanghun",
				"spell_fuchouzhinu",
				"spell_liliangzhufu",
				"spell_fennuzhichui",
				"spell_fengxian",
				"spell_zuozhandongyuan",
				"spell_shengliaoshu",
				"spell_cigu",
				"spell_modaoyou",
				"spell_jianrenluanwu",
				"spell_daoshan",
				"spell_cisha",
				"spell_sijidaifa",
				"spell_huotigenxu",
				"spell_wuyashenxiang",
				"spell_ziranzhili",
				"spell_yemanpaoxiao",
				"spell_hengsao",
				"spell_yexingchengzhang",
				"spell_xishengqiyue",
				"spell_zuzhou",
				"spell_xiaoguibaopo",
				"spell_emozhinu",
				"spell_anyinglieyan",
				"spell_liliangdaijia",
				"spell_shenshengxinxing",
				"spell_shengguangzhadan",
				"spell_maizang",
				"spell_xinlingshijie",
				"spell_naluzhiguang",
				"spell_zhiliaozhihuan",
				"spell_nuxi",
				"spell_dunpaimengji",
				"spell_zhansha",
				"spell_nuhuozhongshao",
				"spell_xuanfengzhan",
				"spell_juemingluandou",
				"spell_lierenyinji",
				"spell_kuaisusheji",
				"spell_guanmenfanggou",
				"spell_zhaohuanchongwu",
				"spell_zidanshangtang",
				"spell_duochongsheji",
				"spell_xianzuzhihun",
				"spell_xianzuzhaohuan",
				"spell_fengnu",
				"spell_shihuawuqi",
				"spell_xianzuzhishi",
				"spell_rongyanbaolie",
				"spell_laojiuhuoba",
				"spell_chirehuoba",
				"spell_aoshufeidan",
				"spell_canying",
				"spell_yanbaoshu",
				"spell_hanbingpingzhang",
				"spell_jingxiang",
				"spell_mengun",
				"spell_jipao",
				"spell_beici",
				"spell_weijisifu",
				"spell_zhumo",
				"spell_anzhongpohuai",
				"spell_piaoqie",
				"spell_conglinzhihun",
				"spell_heiandiyu",
				"spell_fugen",
				"spell_xingchenzhuiluo",
				"spell_fennu",
				"spell_ziyang",
				"spell_shalumingling",
				"spell_tianjiangzhuqun",
				"spell_tanxianmao",
				"spell_dubiao",
				"spell_qiangfengsheji",
				"spell_zhuizongshu",
				"spell_zhenyanshu",
				"spell_enzeshu",
				"spell_anyingxingtai",
				"spell_kuaisuzhiliao",
				"spell_kongxinshu",
				"spell_xinlinghanbao",
				"spell_jinyingduijue",
				"spell_zhihuizhufu",
				"spell_shenshengfennu",
				"spell_yongshizhufu",
				"spell_shenpan",
				"spell_zhengqianghaosheng",
				"spell_zhongnian",
				"spell_fuchoudaji",
				"spell_yingyongdaji",
				"spell_zhandounuhuo",
				"spell_chongfeng",
				"spell_kuangbao",
				"spell_linghunhongxi",
				"spell_siwangchanrao",
				"spell_emozhixin",
				"spell_fushishu",
				"spell_ansezhadan",
				"spell_heianqiyue",
			],
		},
		characterPack: {
			mode_stone: {
				stone_tutengyongshi: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["shaman_jili"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "shaman"],
				},
				stone_xuejuren: {
					sex: "male",
					group: "wei",
					hp: 2,
					skills: ["shaman_xueju"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1, "shaman"],
				},
				stone_tuyuansu: {
					sex: "male",
					group: "qun",
					hp: 5,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "shaman"],
				},
				stone_huoyuansu: {
					sex: "male",
					group: "shu",
					hp: 3,
					skills: ["shaman_huoxi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 3, "shaman"],
				},
				stone_fachao: {
					sex: "male",
					group: "wei",
					hp: 3,
					skills: ["shaman_tuteng", "shaman_fachao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 0, "shaman"],
				},
				stone_huoshe: {
					sex: "male",
					group: "shu",
					hp: 3,
					skills: ["shaman_tuteng", "shaman_huoshe"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 0, "shaman"],
				},
				stone_huoli: {
					sex: "male",
					group: "wei",
					hp: 3,
					skills: ["shaman_tuteng", "shaman_huoli"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 0, "shaman"],
				},
				stone_huoyanweishi: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["shaman_zhuhuo"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 1, "shaman"],
				},
				stone_tutengshi: {
					sex: "female",
					group: "wei",
					hp: 2,
					skills: ["shaman_peiyu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "shaman"],
				},
				stone_shachuisaman: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["shaman_fengnu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 4, "shaman"],
				},
				stone_wanshiyuansu: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["shaman_zoushi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1, "shaman"],
				},
				stone_shalinxingzhe: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["shaman_anhun"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "shaman"],
				},

				stone_kuangyedoushi: {
					sex: "male",
					group: "wu",
					hp: 3,
					skills: ["druid_nuhuo"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "druid"],
				},
				stone_conglinshouwei: {
					sex: "male",
					group: "wu",
					hp: 3,
					skills: ["druid_huwei"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "druid"],
				},
				stone_baohuzhishu: {
					sex: "male",
					group: "qun",
					hp: 6,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [6, 4, "druid"],
				},
				stone_liebao: {
					sex: "male",
					group: "wei",
					hp: 3,
					skills: ["stone_chongfeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2, "druid"],
				},
				stone_zongxiong: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "druid"],
				},
				stone_baoqishi: {
					sex: "female",
					group: "wei",
					hp: 2,
					skills: ["druid_chengzhang"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "druid"],
				},
				stone_renyaqishi: {
					sex: "female",
					group: "wei",
					hp: 1,
					skills: ["druid_renya"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1, "druid"],
				},
				stone_huangyeqishi: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["druid_chicheng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 2, "druid"],
				},
				stone_huoshanxiemu: {
					sex: "male",
					group: "wei",
					hp: 3,
					skills: ["druid_juhuo", "lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 6, "druid"],
				},
				stone_conglinxiaoshou: {
					sex: "male",
					group: "wei",
					hp: 3,
					skills: ["druid_yuehuo"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 4, "druid"],
				},
				stone_lindishuyao: {
					sex: "female",
					group: "wei",
					hp: 3,
					skills: ["druid_yeyou"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "druid"],
				},
				stone_xunmenglong: {
					sex: "male",
					group: "wei",
					hp: 2,
					skills: ["druid_qicheng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "druid"],
				},

				stone_caoyuanshi: {
					sex: "male",
					group: "qun",
					hp: 5,
					skills: ["hunter_nuhou"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 2, "hunter"],
				},
				stone_leiouke: {
					sex: "male",
					group: "shu",
					hp: 2,
					skills: ["hunter_zhanhuo"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1, "hunter"],
				},
				stone_huofu: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["stone_chongfeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 4, "hunter"],
				},
				stone_misha: {
					sex: "male",
					group: "shu",
					hp: 3,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "hunter"],
				},
				stone_jiewangzhu: {
					sex: "male",
					group: "wu",
					hp: 1,
					skills: ["hunter_jiewang"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2, "hunter"],
				},
				stone_xunshoushi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["hunter_xunshou"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 3, "hunter"],
				},
				stone_senlinlang: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: ["hunter_qunxi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2, "hunter"],
				},
				stone_tujiu: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["hunter_mishi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2, "hunter"],
				},
				stone_muyangren: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["hunter_muyang"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 3, "hunter"],
				},
				stone_jujishou: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["hunter_juji"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "hunter"],
				},
				stone_damoshatuo: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["hunter_dusha"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "hunter"],
				},
				stone_huangjialeixiang: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["hunter_chuanlin"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 3, "hunter"],
				},

				stone_shuiyuansu: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["mage_bingdong"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "mage"],
				},
				stone_wushixuetu: {
					sex: "female",
					group: "wu",
					hp: 1,
					skills: ["mage_zhufa"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2, "mage"],
				},
				stone_huoyao: {
					sex: "male",
					group: "shu",
					hp: 3,
					skills: ["mage_lieyan"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1, "mage"],
				},
				stone_falifulong: {
					sex: "male",
					group: "shu",
					hp: 2,
					skills: ["mage_tunfa"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1, "mage"],
				},
				stone_yingxiongzhihun: {
					sex: "male",
					group: "wei",
					hp: 1,
					skills: ["mage_minghuo"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2, "mage"],
				},
				stone_shifazhe: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["mage_shifa"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "mage"],
				},
				stone_aoshushi: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["mage_aoshu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2, "mage"],
				},
				stone_faqishi: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["mage_jili"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "mage"],
				},
				stone_fuhuokaijia: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["mage_gushou"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "mage"],
				},
				stone_kaodalalong: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["mage_yufa"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "mage"],
				},
				stone_yanshushi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["mage_yanshu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 4, "mage"],
				},
				stone_xulingwushi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["mage_pingxu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "mage"],
				},

				stone_hudunren: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["paladin_hudun"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "paladin"],
				},
				stone_junxuguan: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["paladin_buji"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 1, "paladin"],
				},
				stone_yurenqishi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["paladin_zhaochao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "paladin"],
				},
				stone_chidunweishi: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["paladin_chidun"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2, "paladin"],
				},
				stone_liewangshouwei: {
					sex: "male",
					group: "qun",
					hp: 5,
					skills: ["paladin_shouwei"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 2, "paladin"],
				},
				stone_longwangpeiou: {
					sex: "female",
					group: "qun",
					hp: 4,
					skills: ["paladin_zhaohuan"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "paladin"],
				},
				stone_baoweizhe: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["paladin_baowei"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 1, "paladin"],
				},
				stone_guiqishi: {
					sex: "male",
					group: "qun",
					hp: 5,
					skills: ["paladin_tuxi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "paladin"],
				},
				stone_shenmiqishou: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["paladin_miying"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "paladin"],
				},
				stone_shixiangweishi: {
					sex: "female",
					group: "qun",
					hp: 3,
					skills: ["paladin_huashi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "paladin"],
				},
				stone_xuefanzhanshi: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["paladin_jinghua"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 4, "paladin"],
				},
				stone_xunmashi: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["paladin_moma"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2, "paladin"],
				},

				stone_lieyanxiaogui: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["warlock_nonghuo"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 4, "warlock"],
				},
				stone_xiaoguishouling: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["warlock_zhaogui"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1, "warlock"],
				},
				stone_xiaogui: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: [],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [1, 1],
				},
				stone_kongjuzhanma: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: ["warlock_yongsheng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1, "warlock"],
				},
				stone_morishouwei: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["stone_chongfeng", "warlock_zaihuo"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 4, "warlock"],
				},
				stone_xukongxingzhe: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1, "warlock"],
				},
				stone_diyuhuo: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["warlock_yuhuo"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "warlock"],
				},
				stone_diyuhuox: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: [],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 2, "warlock"],
				},
				stone_heishitanfan: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["warlock_anyu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "warlock"],
				},
				stone_zhaohuanzhe: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["warlock_zhaohuan"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "warlock"],
				},
				stone_meimo: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["warlock_huanmeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 3, "warlock"],
				},
				stone_tongkunvwang: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["warlock_tongku"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 1, "warlock"],
				},
				stone_xukongkongmo: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["warlock_tunshi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "warlock"],
				},
				stone_fukongmoyan: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["warlock_shijie"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "warlock"],
				},

				stone_zhihuiguan: {
					sex: "female",
					group: "qun",
					hp: 2,
					skills: ["warrior_tongling"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2, "warrior"],
				},
				stone_kuangzhanshi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["warrior_baoluan"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1, "warrior"],
				},
				stone_zhujiashi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["warrior_zhujia"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 1, "warrior"],
				},
				stone_jiangong: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["warrior_jiangong"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "warrior"],
				},
				stone_chidunshinv: {
					sex: "female",
					group: "qun",
					hp: 4,
					skills: ["warrior_tidun"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "warrior"],
				},
				stone_yuanhou: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 3, "warrior"],
				},
				stone_heiyaoyaoshou: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["warrior_heiyao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "warrior"],
				},
				stone_honglongyongshi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["warrior_fenyong"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 3, "warrior"],
				},
				stone_peilianshi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["lschaofeng", "warrior_peilian"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "warrior"],
				},
				stone_jingyingweishi: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["stone_chongfeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 3, "warrior"],
				},
				stone_mengmaren: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["warrior_chuanci"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 4, "warrior"],
				},
				stone_zhifuzhe: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["warrior_zhifu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1, "warrior"],
				},

				stone_daomufeizei: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["rogue_xunbao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 3, "rogue"],
				},
				stone_qiezei: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["rogue_touqie"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "rogue"],
				},
				stone_heitieairen: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["rogue_qiancang"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 3, "rogue"],
				},
				stone_tegong: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["rogue_touxi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 3, "rogue"],
				},
				stone_haidaotoumu: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["rogue_zhaomu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "rogue"],
				},
				stone_haidao: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: [],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [1, 2, "rogue"],
				},
				stone_cike: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: ["rogue_cisha", "stone_qianxing"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1, "rogue"],
				},
				stone_duyanhaidao: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["rogue_duxing"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 4, "rogue"],
				},
				stone_gangtiewushi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["rogue_shoudao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2, "rogue"],
				},
				stone_lifaji: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["rogue_lifa"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "rogue"],
				},
				stone_shihualong: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: ["rogue_fusheng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2, "rogue"],
				},
				stone_xiushuihaidao: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: ["rogue_jielue"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2, "rogue"],
				},
				stone_zousishangfan: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["rogue_jiaoyi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 3, "rogue"],
				},

				stone_beijunmushi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["priest_shengliao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1, "priest"],
				},
				stone_guanliyuan: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["priest_faxian"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 1, "priest"],
				},
				stone_linghunjisi: {
					sex: "female",
					group: "qun",
					hp: 4,
					skills: ["priest_hunwu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 2, "priest"],
				},
				stone_heianjiaotu: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["priest_zhufu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2, "priest"],
				},
				stone_guangyaozhizi: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["priest_guangyao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 3, "priest"],
				},
				stone_longmianjiaoguan: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["priest_xundao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "priest"],
				},
				stone_shengdianzhishi: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["priest_puzhao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [5, 4, "priest"],
				},
				stone_suoxiaojishi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["priest_suoxiao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2, "priest"],
				},
				stone_anyingzisi: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["priest_shixin"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 4, "priest"],
				},
				stone_guangmingquan: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["priest_shengshui"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 0, "priest"],
				},
				stone_muguangchulong: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["priest_muguang"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1, "priest"],
				},
				stone_shenshengyongshi: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["priest_shengguang"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [4, 3, "priest"],
				},

				stone_zhongshi: {
					sex: "male",
					group: "wei",
					hp: 1,
					skills: ["stone_zhongshi1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2],
				},
				stone_zhucangzhe: {
					sex: "male",
					group: "wei",
					hp: 1,
					skills: ["stone_zhucangzhe1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2],
				},
				stone_huoqiangshou: {
					sex: "male",
					group: "wei",
					hp: 3,
					skills: ["stone_huoqiangshou1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1],
				},

				stone_lansaizhanshi: {
					sex: "male",
					group: "shu",
					hp: 1,
					skills: ["stone_chongfeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2],
				},
				stone_kutongsiseng: {
					sex: "male",
					group: "shu",
					hp: 1,
					skills: ["stone_kutongsiseng1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2],
				},
				stone_yuanguanying: {
					sex: "male",
					group: "shu",
					hp: 3,
					skills: ["stone_yuanguanying1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1],
				},

				stone_dijieshicong: {
					sex: "male",
					group: "wu",
					hp: 2,
					skills: ["stone_dijieshicong1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1],
				},
				stone_yaosaishouwei: {
					sex: "male",
					group: "wu",
					hp: 2,
					skills: ["stone_yaosaishouwei1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1],
				},
				stone_famingjia: {
					sex: "male",
					group: "wu",
					hp: 3,
					skills: ["stone_famingjia1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1],
				},

				stone_chilundashi: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["stone_chilundashi1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 1],
				},
				stone_hanguangzhizhe: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["stone_hanguangzhizhe1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2],
				},
				stone_aihaozhihun: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["stone_aihaozhihun1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1],
				},

				stone_fennuxiaoji: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: ["stone_fennuxiaoji1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2],
				},
				stone_juxingchanchu: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["stone_juxingchanchu1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 1],
				},
				stone_wuyi: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: ["jijiu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					dieAudios: ["wuyi"],
					extraModeData: [2, 2],
				},
				stone_langren: {
					sex: "male",
					group: "qun",
					hp: 1,
					skills: ["stone_qianxing"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2],
				},
				stone_shishigui: {
					sex: "male",
					group: "qun",
					hp: 2,
					skills: ["stone_shishigui1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 1],
				},

				stone_fatiaozhuru: {
					sex: "female",
					group: "qun",
					hp: 1,
					skills: ["stone_fatiaozhuru1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2],
				},
				stone_mingguangjisi: {
					sex: "female",
					group: "wu",
					hp: 2,
					skills: ["shushen"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 1],
				},
				stone_nianqingjisi: {
					sex: "female",
					group: "wei",
					hp: 2,
					skills: ["stone_zhufu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 1],
				},
				stone_aomishouwei: {
					sex: "female",
					group: "qun",
					hp: 1,
					skills: ["biyue"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [2, 2],
				},
				stone_yanjingshe: {
					sex: "female",
					group: "qun",
					hp: 2,
					skills: ["stone_yanjingshe1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 2],
				},
				stone_zhiyuzhe: {
					sex: "female",
					group: "qun",
					hp: 3,
					skills: ["stone_zhiyu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [3, 1],
				},
				stone_mafengzhuru: {
					sex: "female",
					group: "qun",
					hp: 1,
					skills: ["stone_mafengzhuru1"],
					isMinskin: true,
					isFellowInStoneMode: true,
					extraModeData: [1, 2],
				},

				stone_shumiao: {
					sex: "none",
					group: "wu",
					hp: 1,
					skills: [],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [1, 1],
				},
				stone_shuren: {
					sex: "none",
					group: "wu",
					hp: 2,
					skills: ["stone_chongfeng", "stone_zibao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 2],
				},
				stone_shurenx: {
					sex: "none",
					group: "wu",
					hp: 2,
					skills: [],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 2],
				},
				stone_shurenxx: {
					sex: "none",
					group: "wu",
					hp: 2,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 2],
				},
				stone_youlinglang: {
					sex: "none",
					group: "qun",
					hp: 2,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 2],
				},
				stone_xiaojingling: {
					sex: "none",
					group: "qun",
					hp: 1,
					skills: ["xuying"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [1, 1],
				},
				stone_zhumo: {
					sex: "none",
					group: "qun",
					hp: 2,
					skills: [],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 2],
				},
				stone_jingxiang: {
					sex: "none",
					group: "qun",
					hp: 2,
					skills: ["stone_jingxiang", "lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 0],
				},
				stone_shengguanghuwei: {
					sex: "female",
					group: "qun",
					hp: 2,
					skills: ["priest_shengguang"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [1, 1],
				},
				stone_liegou: {
					sex: "none",
					group: "qun",
					hp: 1,
					skills: ["stone_chongfeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [1, 2],
				},
				stone_mianyang: {
					sex: "none",
					group: "qun",
					hp: 1,
					skills: ["mage_mianyang"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [1, 0],
				},
				stone_qingwa: {
					sex: "none",
					group: "wu",
					hp: 1,
					skills: ["shaman_qingwa"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [1, 0],
				},
				stone_shengjiachong: {
					sex: "none",
					group: "qun",
					hp: 1,
					skills: ["lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [1, 1],
				},

				stone_tuteng1: {
					sex: "none",
					group: "qun",
					hp: 2,
					skills: ["shaman_tuteng", "lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 0],
				},
				stone_tuteng2: {
					sex: "none",
					group: "qun",
					hp: 2,
					skills: ["shaman_tuteng", "shaman_zhuore"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 0],
				},
				stone_tuteng3: {
					sex: "none",
					group: "qun",
					hp: 2,
					skills: ["shaman_tuteng", "shaman_fali"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 0],
				},
				stone_tuteng4: {
					sex: "none",
					group: "qun",
					hp: 2,
					skills: ["shaman_tuteng", "shaman_zhiliao"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 0],
				},
				stone_xinbing: {
					sex: "none",
					group: "qun",
					hp: 2,
					skills: [],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					extraModeData: [2, 0],
				},

				stone_siwangzhiyi: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["stone_mieshi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend"],
					extraModeData: [6, 4],
				},
				stone_alaikesita: {
					sex: "female",
					group: "qun",
					hp: 4,
					skills: ["stone_fushi"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend"],
					extraModeData: [6, 4],
				},
				stone_nuoziduomu: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["stone_shixu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend"],
					extraModeData: [6, 4],
				},
				stone_maligousi: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["stone_mowang"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend"],
					extraModeData: [6, 2],
				},

				stone_aolajier: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["stone_chongfeng", "shaman_fengnu", "paladin_hudun", "lschaofeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend_shaman"],
					extraModeData: [6, 4],
				},
				stone_andongni: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["stone_zhiyin"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend_mage"],
					extraModeData: [6, 4],
				},
				stone_jialakesi: {
					sex: "male",
					group: "qun",
					hp: 6,
					skills: ["stone_bianshen"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend_warlock"],
					extraModeData: [6, 0],
				},
				stone_jialakesix: {
					sex: "male",
					group: "qun",
					hp: 6,
					skills: ["stone_lianyu"],
					trashBin: ["modeimage"],
					isHiddenInStoneMode: true,
					isSpecialInStoneMode: true,
				},
				stone_kelushi: {
					sex: "male",
					group: "qun",
					hp: 5,
					skills: ["stone_chongfeng"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend_hunter"],
					extraModeData: [6, 5],
				},
				stone_geluomashi: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["stone_chongfeng", "stone_jinu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend_warrior"],
					extraModeData: [6, 4],
				},
				stone_aidewen: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["stone_lianji"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend_rogue"],
					extraModeData: [6, 3],
				},
				stone_sainaliusi: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["stone_shenyu"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend_druid"],
					extraModeData: [6, 3],
				},
				stone_fuding: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["paladin_hudun", "lschaofeng", "stone_fuchou"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend_paladin"],
					extraModeData: [6, 3],
				},
				stone_weilun: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["stone_shenyou"],
					isMinskin: true,
					isFellowInStoneMode: true,
					isHiddenInStoneMode: true,
					trashBin: ["stonelegend_priest"],
					extraModeData: [6, 6],
				},
			},
		},
		careerList: ["mage", "shaman", "druid", "paladin", "rogue", "priest", "hunter", "warrior", "warlock"],
		game: {
			reserveDead: true,
			bannedcards: ["lebu", "xietianzi"],
			onwash: function () {
				if (_status.mode != "deck") {
					return;
				}
				var list = [];
				for (var i = 0; i < ui.discardPile.childElementCount; i++) {
					var type = get.type(ui.discardPile.childNodes[i]);
					if (type == "stonecard" || type == "stonecharacter") {
						list.push(ui.discardPile.childNodes[i]);
					}
				}
				while (list.length) {
					list.shift().remove();
				}
			},
			getVideoName: function () {
				var str = get.translation(game.me.name);
				if (game.me.name2) {
					str += "/" + get.translation(game.me.name2);
				}
				var name = [str, "炉石 - " + get.config("battle_number") + "人"];
				return name;
			},
			updateStatusCount: function () {
				_status.friendCount.innerHTML = "友军: " + get.cnNumber(1 + _status.mylist.length / (_status.double_character ? 2 : 1), true);
				_status.enemyCount.innerHTML = "敌军: " + get.cnNumber(1 + _status.enemylist.length / (_status.double_character ? 2 : 1), true);
			},
			stoneLoop: function (player) {
				var next = game.createEvent("phaseLoop");
				next.player = player;
				next.setContent(function () {
					"step 0";
					_status.roundStart = game.me;
					player.phase();
					event.num = 0;
					"step 1";
					if (event.num < player.actcharacterlist.length) {
						var current = player.actcharacterlist[event.num];
						if (current) {
							current.phase();
						}
						event.num++;
						event.redo();
					}
					"step 2";
					if (event.player == game.me) {
						event.player = game.enemy;
					} else {
						event.player = game.me;
					}
					event.goto(0);
				});
			},
			initStone: function () {
				var list = [],
					list2 = [],
					list3 = {},
					list4 = {};
				for (var i = 0; i < lib.careerList.length; i++) {
					list3[lib.careerList[i]] = [];
					list4[lib.careerList[i]] = [];
				}
				var i, j, name;
				for (var i in lib.characterPack.mode_stone) {
					lib.character[i] = lib.characterPack.mode_stone[i];
					if (lib.character[i].isSpecialInStoneMode) {
						continue;
					}
					lib.character[i].skills.add("stonesha");
					lib.character[i].skills.add("stoneshan");
					lib.character[i].skills.add("stonedraw");
					name = i + "_stonecharacter";
					lib.card[name] = {
						image: "mode/stone/character/" + i,
						stoneact: lib.character[i].extraModeData[0],
						career: lib.character[i].extraModeData[2] || null,
					};
					for (j in lib.element.stonecharacter) {
						lib.card[name][j] = lib.element.stonecharacter[j];
					}
					lib.translate[name] = get.translation(i);
					lib.translate[name + "_info"] = get.skillintro(i);
					if (lib.character[i].isHiddenInStoneMode) {
						lib.card[name].stonehidden = true;
						continue;
					}
					if (!lib.character[i].extraModeData[2]) {
						if (lib.character[i].extraModeData[0] < 3) {
							list.push(name);
						} else {
							list2.push(name);
						}
					} else {
						list3[lib.character[i].extraModeData[2]].push(name);
					}
				}
				if (_status.mode == "deck") {
					lib.spells = [];
					var spells = lib.cardPack.mode_stone;
					for (var i = 0; i < spells.length; i++) {
						if (lib.card[spells[i]].stonehidden) {
							continue;
						}
						if (lib.card[spells[i]].career) {
							list4[lib.card[spells[i]].career].push(spells[i]);
						} else {
							lib.spells.push(spells[i]);
						}
					}
					lib.careerSpells = list4;
					lib.minions = list.concat(list2);
					lib.careerMinions = list3;
					if (!lib.storage.deckList) {
						lib.storage.deckList = {};
					}
				} else {
					delete game.modPhaseDraw;
					var random_length = parseInt(get.config("random_length").slice(2));
					if (!random_length) {
						random_length = 80;
					}
					var addedcardcount = Math.ceil(lib.card.list.length / random_length);
					var addedcardcount2 = Math.ceil(lib.card.list.length / random_length / 2);
					var suit = ["heart", "diamond", "club", "spade"];
					while (addedcardcount--) {
						for (i = 0; i < list.length; i++) {
							lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), list[i]]);
						}
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_shengerpingdeng"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_anyingkuangluan"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_jingshenkongzhi"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_binghuan"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_zuzhou"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_diyulieyan"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_diyulieyan"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_chenmo"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_xishengqiyue"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_zhiliaoshui"]);
					}
					while (addedcardcount2--) {
						for (i = 0; i < list2.length; i++) {
							lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), list2[i]]);
						}
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_morizaihuo"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_zhiliaozhichu"]);
						lib.card.list.push([suit.randomGet(), Math.ceil(Math.random() * 13), "spell_wangzhezhufu"]);
					}
					lib.card.list.randomSort();
				}

				lib.skill._recasting.usable = 3;
				for (var i in lib.skill) {
					if (lib.skill[i].seatRelated === true) {
						lib.skill[i] = {};
						if (lib.translate[i + "_info"]) {
							lib.translate[i + "_info"] = "此模式下不可用";
						}
					}
				}
				for (i in lib.card) {
					if (lib.card[i].type == "equip") {
						lib.card[i].stoneact = 0;
					} else {
						if (typeof lib.card[i].stoneact === "number" && !lib.card[i].addinfo) {
							lib.card[i].addinfo = "消耗: " + lib.card[i].stoneact;
							lib.card[i].addinfomenu = "消耗：" + lib.card[i].stoneact;
						}
					}
				}

				_status.deadfriend = [];
				_status.deadenemy = [];
				game.additionaldead = [];
			},
			chooseCharacter: function () {
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var i;
					var list = [];
					event.list = list;
					for (i in lib.character) {
						if (lib.character[i].isMinskin) {
							continue;
						}
						if (lib.character[i].isHiddenInStoneMode) {
							continue;
						}
						if (lib.config.forbidstone.includes(i)) {
							continue;
						}
						if (lib.filter.characterDisabled(i)) {
							continue;
						}
						list.push(i);
					}
					list.randomSort();
					var dialog = ui.create.dialog("按顺序选择出场角色" + (get.config("double_character") ? "（双将）" : ""), "hidden");
					dialog.add("0/" + (get.config("double_character") ? 2 : 1) * get.config("battle_number"));
					dialog.add([list.slice(0, get.config("battle_number") * 2 + 5), "character"]);
					dialog.open();

					var next = game.me.chooseButton(dialog, true).set("onfree", true);
					next.selectButton = function () {
						return (get.config("double_character") ? 2 : 1) * get.config("battle_number");
					};
					next.custom.add.button = function () {
						if (ui.cheat2 && ui.cheat2.backup) {
							return;
						}
						_status.event.dialog.content.childNodes[0].innerHTML = "按顺序选择出场角色" + (get.config("double_character") ? "（双将）" : "");
						_status.event.dialog.content.childNodes[1].innerHTML = ui.selected.buttons.length + "/" + _status.event.selectButton();
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
						_status.event.dialog.buttons = ui.create.buttons(list.slice(0, get.config("battle_number") * 2 + 5), "character", buttons);
						_status.event.dialog.content.insertBefore(buttons, node);
						buttons.addTempClass("start");
						node.remove();

						game.uncheck();
						game.check();
					};
					ui.create.cheat = function () {
						_status.createControl = ui.cheat2;
						ui.cheat = ui.create.control("更换", event.changeDialog);
						delete _status.createControl;
					};
					if (lib.onfree) {
						lib.onfree.push(function () {
							event.dialogxx = ui.create.characterDialog("heightset");
							if (ui.cheat2) {
								ui.cheat2.addTempClass("controlpressdownx", 500);
								ui.cheat2.classList.remove("disabled");
							}
							event.dialogxx.style.height = (game.layout == "newlayout" ? 350 : 410) + "px";
							event.dialogxx._scrollset = true;
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
					if (!ui.cheat && get.config("change_choice")) {
						ui.create.cheat();
					}
					if (!ui.cheat2 && get.config("free_choose")) {
						ui.create.cheat2();
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
					if (ui.deckcontrol) {
						ui.deckcontrol.remove();
						delete ui.deckcontrol;
					}
					_status.mylist = result.links.slice(0);
					for (var i = 0; i < result.links.length; i++) {
						event.list.remove(result.links[i]);
					}
					event.list.randomSort();
					_status.enemylist = event.list.slice(0, result.links.length);
					_status.double_character = get.config("double_character");
					"step 2";
					event.choosingDeck = true;
					if (_status.mode == "deck") {
						_status.deck = [];
						if (!_status.auto) {
							ui.auto.hide();
							game.pause();
							var list = _status.mylist.slice(0);
							if (_status.double_character) {
								event.dialog = ui.create.dialog("", "hidden", "forcebutton");
							} else {
								event.dialog = ui.create.dialog("", "hidden", "forcebutton");
							}

							var buttons = ui.create.div(".buttons", event.dialog.content);
							var currentNode = null;
							var clickButton = function (click) {
								if (!event.choosingDeck) {
									return;
								}
								if (click !== false) {
									_status.deck.push(this.name);
								}
								if (currentNode) {
									currentNode.delete();
								}
								if (list.length) {
									var names = [];
									if (_status.double_character) {
										names.push(list.shift());
										names.push(list.shift());
										event.dialog.content.firstChild.innerHTML = "为" + get.translation(names[0]) + "/" + get.translation(names[1]) + "选择一个卡组";
										currentNode = ui.create.player().init(names[0], names[1]);
									} else {
										names.push(list.shift());
										event.dialog.content.firstChild.innerHTML = "为" + get.translation(names[0]) + "选择一个卡组";
										currentNode = ui.create.player().init(names[0]);
									}
									currentNode.classList.add("stone_deck");
									ui.arena.appendChild(currentNode);
									ui.refresh(currentNode);
									currentNode.classList.add("shown");
								} else {
									event.choosingDeck = false;
									event.dialog.close();
									ui.auto.show();
									game.resume();
								}
							};
							clickButton(false);
							for (var i in lib.storage.deckList) {
								if (lib.storage.deckList[i].deck.length == 30) {
									var deckitem = ui.create.div(".deckitem.shadowed", "<span>" + i + "</span>", buttons, clickButton);
									ui.create.div(".menubutton.round", deckitem).dataset.career = lib.storage.deckList[i].career;
									deckitem.name = i;
								}
							}
							for (var i = 0; i < lib.careerList.length; i++) {
								var deckitem = ui.create.div(".deckitem.shadowed", "<span>随机</span>", buttons, clickButton);
								ui.create.div(".menubutton.round", deckitem).dataset.career = lib.careerList[i];
								deckitem.name = "random:" + lib.careerList[i];
							}
							event.dialog.open();
						} else {
							var bn = parseInt(get.config("battle_number"));
							for (var i = 0; i < bn; i++) {
								_status.deck.push("random");
							}
						}
					}
					"step 3";
					game.addRecentCharacter.apply(this, _status.mylist);
					if (ui.coin) {
						_status.coinCoeff = get.coinCoeff(_status.mylist);
					}
					if (_status.double_character) {
						game.me.init(_status.mylist.shift(), _status.mylist.shift());
						game.enemy.init(_status.enemylist.shift(), _status.enemylist.shift());
					} else {
						game.me.init(_status.mylist.shift());
						game.enemy.init(_status.enemylist.shift());
					}
					game.me.maxHp++;
					game.me.hp++;
					game.me.update();
					game.enemy.maxHp++;
					game.enemy.hp++;
					game.enemy.update();
					if (_status.mode == "deck") {
						get.deck(game.me, _status.deck.shift());
						get.deck(game.enemy, "random");
					}
					ui.control.style.transitionDuration = "0s";
					ui.refresh(ui.control);
					ui.arena.classList.remove("choose-character");
					setTimeout(function () {
						ui.control.style.transitionDuration = "";
					}, 500);
				});
			},
		},
		get: {
			rawAttitude: function (from, to) {
				var num;
				if (to.isMin() && !to.hasSkill("lschaofeng")) {
					num = 5;
				} else {
					num = 6;
				}
				return num * (from.side == to.side ? 1 : -1);
			},
			stonecard: function (type, career) {
				var list = [];
				for (var i in lib.card) {
					if (lib.card[i].stonehidden) {
						continue;
					}
					if (lib.card[i].type != "stonecard" && lib.card[i].type != "stonecharacter") {
						continue;
					}
					if (type == 1 && lib.card[i].type != "stonecard") {
						continue;
					}
					if (type == 2 && lib.card[i].type != "stonecharacter") {
						continue;
					}
					if (career && lib.card[i].career != career) {
						continue;
					}
					list.push(i);
				}
				return list;
			},
			deck: function (player, name) {
				var career, deck;
				if (name == "random" || name.indexOf("random:") == 0) {
					if (name == "random") {
						career = lib.careerList.randomGet();
						name = name + ":" + career;
					} else {
						career = name.slice(7);
					}
					deck = lib.careerMinions[career].randomGets(6).concat(lib.careerMinions[career].randomGets(6)).concat(lib.minions.randomGets(6)).concat(lib.spells.randomGets(4)).concat(lib.careerSpells[career].randomGets(4)).concat(lib.careerSpells[career].randomGets(4));
				} else {
					career = lib.storage.deckList[name].career;
					deck = lib.storage.deckList[name].deck.slice(0);
				}
				deck.sort(function (a, b) {
					if (a > b) {
						return 1;
					}
					if (a == b) {
						return 0;
					}
					return -1;
				});
				player.deck = name;
				player.career = career;
				if (!player.node.career) {
					player.node.career = ui.create.div(".menubutton.round.identity", player);
					player.node.career.dataset.career = career;
					lib.setIntro(player.node.career, null, true);
				}
				if (!player.deckCards) {
					player.deckCards = [];
				}
				for (var i = 0; i < deck.length; i++) {
					player.deckCards.push(game.createCard(deck[i]));
				}
			},
		},
		cardType: {
			stonecard: -0.5,
			stonecharacter: 1,
		},
		card: {
			spell_siwangchanrao: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "warlock",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					"step 0";
					target.damage();
					"step 1";
					if (target.isDead()) {
						player.drawDeck();
					}
				},
				ai: {
					order: 2,
					value: 5,
					useful: 5,
					result: {
						target: -1,
					},
					tag: {
						damage: 1,
					},
				},
			},
			spell_ansezhadan: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "warlock",
				filterTarget: true,
				content: function () {
					target.damage(2);
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: -2,
					},
					tag: {
						damage: 2,
					},
				},
			},
			spell_emozhixin: {
				type: "stonecard",
				stoneact: 4,
				career: "warlock",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					if (target.side != player.side) {
						target.damage(4);
					} else {
						target.draw(4);
					}
				},
				ai: {
					order: 4,
					value: 3,
					useful: 3,
					result: {
						target: function (player, target) {
							if (target.side != player.side) {
								return -3;
							} else {
								return 2;
							}
						},
					},
				},
			},
			spell_heianqiyue: {
				type: "stonecard",
				stoneact: 4,
				career: "warlock",
				enable: true,
				fullimage: true,
				notarget: true,
				content: function () {
					"step 0";
					var fellows = player.getEnemy().getFellow();
					if (fellows.length) {
						fellows.randomGet().die();
					}
					"step 1";
					var fellows = player.getEnemy().getFellow();
					if (fellows.length) {
						fellows.randomGet().die();
					}
					"step 2";
					var hs = player.getCards("h");
					if (hs.length) {
						player.discard(hs.randomGets(2));
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						player: function (player) {
							if (player.getEnemy().countFellow() >= 2) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			spell_linghunhongxi: {
				type: "stonecard",
				stoneact: 4,
				career: "warlock",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					"step 0";
					target.die();
					"step 1";
					player.recover();
				},
				ai: {
					order: 7.5,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -target.hp - target.countCards("h") / 2;
						},
					},
				},
			},
			spell_fushishu: {
				type: "stonecard",
				stoneact: 2,
				career: "warlock",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && !target.hasSkill("warlock_fushishu");
				},
				content: function () {
					target.addSkill("warlock_fushishu");
				},
				ai: {
					order: 7.5,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -target.hp - target.countCards("h") / 2;
						},
					},
				},
			},

			spell_fuchoudaji: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "warrior",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				selectTarget: -1,
				content: function () {
					if (player.hp <= 2) {
						target.damage(3);
					} else {
						target.damage();
					}
				},
				ai: {
					order: 8.9,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_yingyongdaji: {
				type: "stonecard",
				stoneact: 2,
				career: "warrior",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.side != player.side;
				},
				content: function () {
					"step 0";
					player.damage(2, target);
					"step 1";
					target.damage(2);
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							if (player.hujia >= 2) {
								return -1.5;
							}
							if (player.hujia == 1) {
								if (player.hp > 3) {
									return -1.5;
								}
								return 0;
							}
							return 0;
						},
					},
					tag: {
						damage: 1,
					},
				},
			},
			spell_zhandounuhuo: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i].isDamaged()) {
							return true;
						}
					}
					return false;
				},
				stoneact: 1,
				career: "warrior",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					var num = 0;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i].isDamaged()) {
							num++;
						}
					}
					if (num) {
						player.drawDeck(num);
					}
				},
				ai: {
					order: 0.5,
					result: {
						player: 1,
					},
				},
			},
			spell_kuangbao: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "warrior",
				filterTarget: function (card, player, target) {
					return target.isMin() && target.isDamaged();
				},
				content: function () {
					target.draw(4);
				},
				ai: {
					order: 6,
					value: 3,
					useful: 3,
					result: {
						target: 1,
					},
				},
			},
			spell_chongfeng: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				career: "warrior",
				filterTarget: function (card, player, target) {
					return target.isMin() && target.isTurnedOver();
				},
				content: function () {
					"step 0";
					target.draw(3);
					"step 1";
					if (target.isTurnedOver()) {
						target.turnOver();
					}
				},
				ai: {
					order: 6,
					value: 3,
					useful: 3,
					result: {
						target: function (player, target) {
							if (target.isTurnedOver()) {
								return 2;
							}
							return 1;
						},
					},
				},
			},
			spell_zhongnian: {
				type: "stonecard",
				stoneact: 3,
				career: "warrior",
				enable: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i].isDamaged()) {
							return true;
						}
					}
					return false;
				},
				fullimage: true,
				filterTarget: true,
				content: function () {
					var num = 0;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i].isDamaged()) {
							num++;
						}
					}
					if (num) {
						target.damage(Math.min(3, num));
					}
				},
				ai: {
					order: 7.2,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							var num = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].side == player.side && game.players[i].isDamaged()) {
									num++;
									if (num >= 2) {
										return -1.5;
									}
								}
							}
							return 0;
						},
						tag: {
							damage: 1,
						},
					},
				},
			},

			spell_jinyingduijue: {
				type: "stonecard",
				stoneact: 4,
				career: "paladin",
				enable: function (card, player) {
					var n1 = player.countFellow();
					var n2 = player.getEnemy().countFellow();
					return n1 > 0 && n2 > 0 && n1 + n2 > 2;
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				content: function () {
					"step 0";
					if (!targets.length) {
						event.finish();
						return;
					}
					var maxf = [],
						maxe = [];
					for (var i = 0; i < targets.length; i++) {
						if (targets[i].side == player.side) {
							if (!maxf.length || targets[i].hp == maxf[0].hp) {
								maxf.push(targets[i]);
							} else if (targets[i].hp > maxf[0].hp) {
								maxf.length = 0;
								maxf.push(targets[i]);
							}
						} else {
							if (!maxe.length || targets[i].hp == maxe[0].hp) {
								maxe.push(targets[i]);
							} else if (targets[i].hp > maxe[0].hp) {
								maxe.length = 0;
								maxe.push(targets[i]);
							}
						}
					}
					if (maxf.length) {
						targets.remove(maxf.randomGet());
					}
					if (maxe.length) {
						targets.remove(maxe.randomGet());
					}
					targets.sort(lib.sort.seat);
					event.targets = targets;
					"step 1";
					if (event.targets.length) {
						event.targets.shift().die();
						event.redo();
					}
				},
				ai: {
					order: 9,
					value: 2,
					useful: 2,
					result: {
						player: function (player, target) {
							return player.getEnemy().countFellow() - player.countFellow();
						},
					},
				},
			},
			spell_zhihuizhufu: {
				type: "stonecard",
				stoneact: 1,
				career: "paladin",
				enable: function (card, player) {
					return !player.isMin();
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && !target.hasSkill("paladin_zhihuizhufu");
				},
				content: function () {
					target.addSkill("paladin_zhihuizhufu");
					target.storage.paladin_zhihuizhufu = player;
				},
				ai: {
					order: 2,
					value: 5,
					useful: 5,
					result: {
						player: function (player, target) {
							return target.hp;
						},
					},
				},
			},
			spell_shenshengfennu: {
				type: "stonecard",
				stoneact: 5,
				career: "paladin",
				enable: true,
				fullimage: true,
				filterTarget: true,
				content: function () {
					"step 0";
					event.card = player.getDeckCards()[0];
					player.gain(event.card, "gain2", "log");
					"step 1";
					var num = lib.card[event.card.name].stoneact;
					if (num && typeof num == "number") {
						target.damage(num);
					}
				},
				ai: {
					order: 6,
					value: 2,
					useful: 2,
					result: {
						target: -2,
					},
					tag: {
						damage: 2,
					},
				},
			},
			spell_yongshizhufu: {
				type: "stonecard",
				stoneact: 2,
				career: "paladin",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.countCards("h") > 0;
				},
				content: function () {
					target.draw(target.countCards("h"));
				},
				ai: {
					order: 4,
					value: 2,
					useful: 2,
					result: {
						target: function (player, target) {
							return Math.max(0, target.countCards("h") - 1);
						},
					},
				},
			},
			spell_shenpan: {
				type: "stonecard",
				stoneact: 2,
				career: "paladin",
				enable: function (card, player) {
					var num = player.getEnemy().countFellow();
					return num > 0 && num >= player.countFellow();
				},
				fullimage: true,
				notarget: true,
				content: function () {
					var target = player.getEnemy().getFellow().randomGet();
					player.line(target);
					target.die();
				},
				ai: {
					order: 9,
					value: 4,
					useful: 4,
					result: {
						player: 1,
					},
				},
			},
			spell_zhengqianghaosheng: {
				type: "stonecard",
				stoneact: 2,
				career: "paladin",
				enable: function (card, player) {
					return !player.hasSkill("paladin_zhengqianghaosheng");
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				content: function () {
					player.addSkill("paladin_zhengqianghaosheng");
				},
				ai: {
					order: 3,
					value: 4,
					useful: 4,
					result: {
						player: function (player) {
							if (player.countFellow() >= 2) {
								return 1;
							}
							return 0;
						},
					},
				},
			},

			spell_zhenyanshu: {
				type: "stonecard",
				stoneact: 1,
				career: "priest",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					target.maxHp++;
					target.hp++;
					target.update();
					player.drawDeck();
				},
				ai: {
					order: 7,
					value: 3,
					useful: 3,
					result: {
						target: function (player, target) {
							return Math.max(1, 10 - target.hp);
						},
					},
				},
			},
			spell_enzeshu: {
				type: "stonecard",
				stoneact: 3,
				career: "priest",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					target.maxHp += 3;
					target.hp += 3;
					target.update();
				},
				ai: {
					order: 5,
					value: 3,
					useful: 3,
					result: {
						target: function (player, target) {
							return Math.max(1, 10 - target.hp);
						},
					},
				},
			},
			spell_anyingxingtai: {
				type: "stonecard",
				stoneact: 2,
				career: "priest",
				recastable: true,
				enable: function (event, player) {
					if (player.career != "priest") {
						return false;
					}
					return !player.storage.anyingxingtai || player.storage.anyingxingtai < 2;
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				content: function () {
					if (typeof player.storage.anyingxingtai != "number") {
						player.storage.anyingxingtai = 1;
					} else if (player.storage.anyingxingtai < 2) {
						player.storage.anyingxingtai = 2;
					}
					player.markSkill("priest_anyingxingtai");
				},
				ai: {
					order: 6.1,
					value: 3,
					useful: 3,
					result: {
						player: 1,
					},
				},
			},
			spell_kuaisuzhiliao: {
				type: "stonecard",
				stoneact: 2,
				career: "priest",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					if (player.hasFellowSkill("priest_hunwu")) {
						return true;
					}
					return target.hp < target.maxHp;
				},
				content: function () {
					var num = 2;
					if (player.hasFellowSkill("stone_shenyou")) {
						num = 4;
					}
					if (player.hasFellowSkill("priest_hunwu")) {
						target.loseHp(num);
					} else {
						target.recover(num);
					}
					// player.addTempSkill('priest_kuaisuzhiliao');
				},
				ai: {
					order: 7,
					value: 7,
					useful: 5,
					result: {
						target: function (player, target) {
							if (player.hasFellowSkill("priest_hunwu")) {
								return -2;
							}
							return get.recoverEffect(target, player, target);
						},
					},
				},
			},
			spell_kongxinshu: {
				type: "stonecard",
				stoneact: 3,
				career: "priest",
				enable: function (card, player) {
					return player.canAddFellow();
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target == player.getEnemy();
				},
				selectTarget: -1,
				content: function () {
					if (!player.canAddFellow()) {
						return;
					}
					var deck = player.getEnemy().deckCards;
					if (deck) {
						var list = [];
						for (var i = 0; i < deck.length; i++) {
							if (get.type(deck[i]) == "stonecharacter") {
								list.push(deck[i].name);
							}
						}
						if (list.length) {
							var name = list.randomGet();
							player.addFellowAuto(name.slice(0, name.indexOf("_stonecharacter")));
						}
					}
				},
				ai: {
					order: 3,
					value: 2,
					useful: 2,
					result: {
						player: 1,
					},
				},
			},
			spell_xinlinghanbao: {
				type: "stonecard",
				stoneact: 2,
				career: "priest",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target == player.getEnemy();
				},
				selectTarget: -1,
				content: function () {
					var num = 2;
					// if(player.hasFellowSkill('stone_shenyou')){
					// 	num=4;
					// }
					target.damage(num);
				},
				ai: {
					order: 6,
					value: 5,
					useful: 5,
					result: {
						target: -2,
					},
					tag: {
						damage: 2,
					},
				},
			},

			spell_shalumingling: {
				type: "stonecard",
				stoneact: 2,
				career: "hunter",
				enable: true,
				fullimage: true,
				filterTarget: true,
				content: function () {
					var num = 1;
					var friends = player.getFellow();
					for (var i = 0; i < friends.length; i++) {
						if (lib.beastList.includes(friends[i].name)) {
							num = 2;
							break;
						}
					}
					target.damage(num);
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: -2,
					},
					tag: {
						damage: 2,
					},
				},
			},
			spell_dubiao: {
				type: "stonecard",
				stoneact: 0,
				career: "hunter",
				enable: true,
				fullimage: true,
				notarget: true,
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side) {
							list.push(game.players[i]);
						}
					}
					if (list.length) {
						var target = list.randomGet();
						target.damage();
						player.line(target);
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_tanxianmao: {
				type: "stonecard",
				stoneact: 2,
				career: "hunter",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side == player.side;
				},
				content: function () {
					target.maxHp++;
					target.hp++;
					target.update();
					target.draw();
					target.addSkill("hunter_tanxianmao");
				},
				ai: {
					order: 2,
					value: 2,
					useful: 2,
					result: {
						target: function (player, target) {
							return Math.max(1, 10 - target.hp);
						},
					},
				},
			},
			spell_zhuizongshu: {
				type: "stonecard",
				stoneact: 1,
				career: "hunter",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				content: function () {
					"step 0";
					player.chooseCardButton("选择一张加入手牌", player.getDeckCards(3), true);
					"step 1";
					player.gain(result.links, "draw");
				},
				ai: {
					order: 2,
					value: 3,
					useful: 3,
					result: {
						player: 1,
					},
				},
			},
			spell_qiangfengsheji: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "hunter",
				filterTarget: function (card, player, target) {
					return target.side != player.side && target.isMin();
				},
				selectTarget: [1, 2],
				content: function () {
					"step 0";
					target.damage();
					"step 1";
					if (target.isAlive()) {
						var hs = target.getCards("h");
						if (hs.length) {
							target.discard(hs.randomGets(2));
						}
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							if (target.countCards("h")) {
								return -2;
							}
							return -1.5;
						},
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_tianjiangzhuqun: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return player.canAddFellow();
				},
				stoneact: 3,
				career: "hunter",
				notarget: true,
				content: function () {
					"step 0";
					if (player.canAddFellow()) {
						player.addFellowAuto("stone_jiewangzhu");
					}
					"step 1";
					if (player.canAddFellow()) {
						player.addFellowAuto("stone_jiewangzhu");
					}
					"step 2";
					if (player.canAddFellow()) {
						player.addFellowAuto("stone_jiewangzhu");
					}
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},

			spell_conglinzhihun: {
				type: "stonecard",
				stoneact: 3,
				career: "druid",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return player.side == target.side && target.isMin() && !target.hasSkill("druid_conglinzhihun");
				},
				selectTarget: -1,
				content: function () {
					target.addSkill("druid_conglinzhihun");
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						player: function (player) {
							var num = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].isMin() && game.players[i].side == player.side && !game.players[i].hasSkill("druid_conglinzhihun")) {
									num++;
									if (num >= 2) {
										return 1;
									}
								}
							}
							return 0;
						},
					},
				},
			},
			spell_heiandiyu: {
				fullimage: true,
				type: "stonecard",
				enable: true,
				stoneact: 4,
				career: "druid",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				multitarget: true,
				targetprompt: ["增加体力并摸牌"],
				selectTarget: [0, 1],
				notarget: true,
				content: function () {
					"step 0";
					if (targets.length) {
						targets[0].maxHp++;
						targets[0].hp++;
						target.update();
						targets[0].draw(3);
						event.finish();
					} else {
						event.num = 0;
					}
					"step 1";
					if (player.canAddFellow() && event.num++ < 10) {
						player.addFellowAuto("stone_xiaojingling");
						event.redo();
					}
				},
				ai: {
					order: 5,
					result: {
						target: function (player, target) {
							return Math.max(1, target.hp - target.countCards("h"));
						},
					},
				},
			},
			spell_ziyang: {
				type: "stonecard",
				stoneact: 3,
				career: "druid",
				enable: function (card, player) {
					return player.deckCards && !player.isMin();
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				content: function () {
					"step 0";
					if (player.hasSkill("druid_ziyang")) {
						player.drawDeck(3);
						event.finish();
					} else {
						player.chooseControl("获得行动值", "摸牌").ai = function () {
							if (player.countCards("h") <= 1) {
								return "摸牌";
							}
							return "获得行动值";
						};
					}
					"step 1";
					if (result.control == "摸牌") {
						player.drawDeck(3);
					} else {
						player.addSkill("druid_ziyang");
					}
				},
				ai: {
					order: 1,
					value: 4,
					useful: 4,
					result: {
						player: 1,
					},
				},
			},
			spell_xingchenzhuiluo: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 6,
				career: "druid",
				targetprompt: ["造成五点伤害"],
				multitarget: true,
				filterTarget: function (card, player, target) {
					return target.side != player.side && target.isMin();
				},
				selectTarget: [0, 1],
				notarget: true,
				content: function () {
					"step 0";
					if (targets.length) {
						targets[0].damage(4);
						event.finish();
					} else {
						var list = player.getFellow(true);
						if (list.length) {
							list.sort(lib.sort.seat);
							event.list = list;
							player.line(list);
						} else {
							event.finish();
						}
					}
					"step 1";
					if (event.list.length) {
						event.list.shift().damage(2);
						event.redo();
					}
				},
				ai: {
					order: 7,
					useful: 5,
					value: 5,
					result: {
						target: function (player, target) {
							if (target == player.getEnemy()) {
								return -2;
							}
							return -1;
						},
					},
					tag: {
						damage: 2,
					},
				},
			},
			spell_fennu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				career: "druid",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					"step 0";
					player.chooseControl("两点", "一点").prompt = "造成2点伤害，或造成1点伤害并从牌库中获得一张牌";
					"step 1";
					if (result.control == "一点") {
						target.damage();
					} else {
						target.damage(2);
						event.finish();
					}
					"step 2";
					player.drawDeck();
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: -1,
					},
					tag: {
						damage: 2,
					},
				},
			},
			spell_fugen: {
				type: "stonecard",
				stoneact: 2,
				career: "druid",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					"step 0";
					target.die();
					"step 1";
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].stonehidden) {
							continue;
						}
						if (lib.card[i].type == "stonecharacter") {
							list.push(i);
						}
					}
					player.getEnemy().gain(game.createCard(list.randomGet()), "draw");
				},
				ai: {
					order: 8.8,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -target.hp - target.countCards("h") / 2;
						},
					},
				},
			},

			spell_mengun: {
				type: "stonecard",
				stoneact: 2,
				career: "rogue",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side != player.side;
				},
				content: function () {
					"step 0";
					target.die()._triggered = null;
					event.name = target.name;
					"step 1";
					player.getEnemy().gain(game.createCard(event.name + "_stonecharacter"), "gain2");
				},
				ai: {
					order: 8.8,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -target.hp - target.countCards("h") / 2;
						},
					},
				},
			},
			spell_jipao: {
				type: "stonecard",
				stoneact: 3,
				career: "rogue",
				enable: function (card, player) {
					return !player.isMin();
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					if (!player.isMin()) {
						player.drawDeck(4);
					}
				},
				ai: {
					order: 1,
					value: 3,
					useful: 3,
					result: {
						player: 1,
					},
				},
			},
			spell_beici: {
				type: "stonecard",
				stoneact: 0,
				career: "rogue",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.hp == target.maxHp;
				},
				content: function () {
					target.loseHp();
				},
				ai: {
					order: 9,
					result: {
						target: -1,
					},
					value: 6,
					useful: 6,
				},
			},
			spell_weijisifu: {
				type: "stonecard",
				stoneact: 2,
				career: "rogue",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target == player.getEnemy();
				},
				selectTarget: -1,
				content: function () {
					if (target.deckCards) {
						var cards = [];
						for (var i = 0; i < 3; i++) {
							cards.push(game.createCard("spell_zhumo"));
						}
						player.$give(cards, target);
						for (var i = 0; i < cards.length; i++) {
							target.deckCards.push(cards[i]);
						}
						game.addGlobalSkill("rogue_zhumo");
					}
				},
				ai: {
					order: 6,
					value: 5,
					useful: 5,
					result: {
						target: -1,
					},
				},
			},
			spell_zhumo: {
				type: "stonecard",
				stoneact: 0,
				enable: false,
				fullimage: true,
				stonehidden: true,
			},
			spell_anzhongpohuai: {
				type: "stonecard",
				stoneact: 3,
				career: "rogue",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target == player.getEnemy();
				},
				selectTarget: -1,
				content: function () {
					"step 0";
					var list = target.getFellow();
					if (list.length) {
						list.randomGet().die({ source: player });
					}
					"step 1";
					var es = target.getCards("e");
					if (es.length) {
						target.discard(es.randomGet());
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							if (target.hasFellow()) {
								return -1;
							}
							return 0;
						},
					},
				},
			},
			spell_piaoqie: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "rogue",
				filterTarget: function (card, player, target) {
					return target == player.getEnemy();
				},
				selectTarget: -1,
				content: function () {
					var cards = player.getEnemy().deckCards.randomGets(2);
					var list = [];
					for (var i = 0; i < cards.length; i++) {
						list.push(game.createCard(cards[i].name, cards[i].suit, cards[i].number, cards[i].nature));
					}
					if (list.length) {
						player.gain(list, "draw");
					}
				},
				ai: {
					order: 0.5,
					result: {
						player: 1,
					},
				},
			},

			spell_canying: {
				type: "stonecard",
				stoneact: 1,
				career: "mage",
				enable: function (event, player) {
					return player.hasFellow();
				},
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side == player.side;
				},
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				fullimage: true,
				content: function () {
					var cards = [];
					for (var i = 0; i < targets.length; i++) {
						if (lib.card[targets[i].name + "_stonecharacter"]) {
							cards.push(game.createCard(targets[i].name + "_stonecharacter"));
						}
					}
					player.gain(cards, "gain2");
				},
				ai: {
					order: 2,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_laojiuhuoba: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				career: "mage",
				filterTarget: true,
				content: function () {
					target.damage("fire");
					if (player.deckCards) {
						player.deckCards.push(game.createCard("spell_chirehuoba"));
					}
				},
				ai: {
					order: 7,
					value: 4,
					useful: 4,
					result: {
						target: -1,
					},
					tag: {
						damage: 1,
						natureDamage: 1,
						fireDamage: 1,
					},
				},
			},
			spell_chirehuoba: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				career: "mage",
				stonehidden: true,
				filterTarget: true,
				content: function () {
					target.damage(2, "fire");
				},
				ai: {
					order: 7,
					value: 6,
					useful: 6,
					result: {
						target: -2,
					},
					tag: {
						damage: 2,
						natureDamage: 2,
						fireDamage: 2,
					},
				},
			},
			spell_hanbingpingzhang: {
				type: "stonecard",
				stoneact: 1,
				career: "mage",
				enable: true,
				fullimage: true,
				filterTarget: true,
				content: function () {
					if (target.maxHp < 2) {
						target.maxHp = 2;
					}
					if (target.hp < 2) {
						target.hp = 2;
						target.update();
					}
					target.addSkill("mage_hanbingpingzhang");
				},
				ai: {
					order: 1,
					value: 3,
					useful: 3,
					result: {
						target: function (player, target) {
							if (target.hp <= 2) {
								return 3 - target.hp;
							}
							return 0;
						},
					},
				},
			},
			spell_aoshufeidan: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return player.getEnemy().countFellow() > 0;
				},
				stoneact: 2,
				career: "mage",
				filterTarget: function (card, player, target) {
					return target.side != player.side && target.isMin();
				},
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				content: function () {
					"step 0";
					if (!targets.length) {
						event.finish();
						return;
					}
					var map = [];
					for (var i = 0; i < targets.length; i++) {
						map.push(0);
					}
					for (var i = 0; i < 3; i++) {
						map[Math.floor(Math.random() * map.length)]++;
					}
					event.num = 0;
					event.map = map;
					"step 1";
					if (event.num < targets.length) {
						if (event.map[event.num]) {
							targets[event.num].damage(event.map[event.num]);
						}
						event.num++;
						event.redo();
					}
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
					},
				},
			},
			spell_jingxiang: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return player.canAddFellow();
				},
				stoneact: 2,
				career: "mage",
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				content: function () {
					"step 0";
					if (player.canAddFellow()) {
						player.addFellowAuto("stone_jingxiang", false);
					}
					"step 1";
					if (player.canAddFellow()) {
						player.addFellowAuto("stone_jingxiang", false);
					}
				},
				ai: {
					order: 4,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_yanbaoshu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 6,
				career: "mage",
				filterTarget: true,
				content: function () {
					var num = 4;
					if (!target.isMin()) {
						num = Math.min(4, target.hp);
					}
					target.damage(num, "fire");
				},
				ai: {
					order: 8,
					value: 4,
					useful: 4,
					result: {
						target: -2,
					},
					tag: {
						damage: 2,
						natureDamage: 2,
						fireDamage: 2,
					},
				},
			},

			spell_fengnu: {
				type: "stonecard",
				stoneact: 2,
				career: "shaman",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && !target.hasSkill("shaman_fengnu");
				},
				content: function () {
					target.addSkill("shaman_fengnu");
				},
				ai: {
					order: 4,
					value: 4,
					useful: 4,
					result: {
						target: function (player, target) {
							if (target.hasSkill("shaman_tuteng")) {
								return 0;
							}
							if (target.hp > 1) {
								return target.hp;
							}
							return 0;
						},
					},
				},
			},
			spell_shihuawuqi: {
				type: "stonecard",
				stoneact: 1,
				career: "shaman",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && !target.hasSkill("shaman_shihuawuqi");
				},
				content: function () {
					target.addSkill("shaman_shihuawuqi");
				},
				ai: {
					order: 4,
					value: 4,
					useful: 4,
					result: {
						target: function (player, target) {
							if (target.isTurnedOver()) {
								return 0;
							}
							var num = 0;
							if (target.hasSkill("shaman_fengnu")) {
								num = 3;
							}
							if (target.isMin()) {
								return target.hp + num;
							}
							return 1.1;
						},
					},
				},
			},
			spell_xianzuzhaohuan: {
				type: "stonecard",
				stoneact: 2,
				career: "shaman",
				fullimage: true,
				enable: true,
				filterTarget: function (card, player, target) {
					return !target.isMin();
				},
				multitarget: true,
				multiline: true,
				selectTarget: -1,
				content: function () {
					"step 0";
					if (targets[0]) {
						var hs = targets[0].getCards("h", function (card) {
							return get.type(card) == "stonecharacter";
						});
						if (hs.length && targets[0].canAddFellow()) {
							targets[0].useCard(targets[0], hs.randomGet(), false).noActCount = true;
						}
					}
					"step 1";
					if (targets[1]) {
						var hs = targets[1].getCards("h", function (card) {
							return get.type(card) == "stonecharacter";
						});
						if (hs.length && targets[1].canAddFellow()) {
							targets[1].useCard(targets[1], hs.randomGet(), false).noActCount = true;
						}
					}
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						player: function (player) {
							var hs = player.getCards("h", function (card) {
								return get.type(card) == "stonecharacter";
							});
							if (hs.length == 0) {
								return 0;
							}
							var enemy = player.getEnemy();
							if (enemy.countCards("h") <= 1) {
								return 1;
							}
							var num = 0;
							for (var i = 0; i < hs.length; i++) {
								num += get.info(hs[i]).stoneact;
							}
							if (num / hs.length >= 3) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			spell_xianzuzhihun: {
				type: "stonecard",
				stoneact: 2,
				career: "shaman",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && !target.hasSkill("shaman_xianzuzhihun");
				},
				content: function () {
					target.addSkill("shaman_xianzuzhihun");
				},
				ai: {
					order: 5,
					value: 4,
					useful: 4,
					result: {
						target: function (player, target) {
							if (lib.card[target.name + "_stonecharacter"]) {
								return lib.card[target.name + "_stonecharacter"].stoneact - 1;
							}
							return 0;
						},
					},
				},
			},
			spell_xianzuzhishi: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 0,
				career: "shaman",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					player.drawDeck(2);
					player.addTempSkill("shaman_xianzuzhishi");
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					},
				},
			},
			spell_rongyanbaolie: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "shaman",
				filterTarget: true,
				content: function () {
					"step 0";
					target.damage(3, "fire");
					"step 1";
					player.loseHp();
				},
				ai: {
					order: 8,
					value: 6,
					useful: 5,
					result: {
						target: -2,
					},
					tag: {
						damage: 2,
						natureDamage: 2,
						fireDamage: 2,
					},
				},
			},

			spell_shenshengxinxing: {
				type: "stonecard",
				stoneact: 5,
				career: "priest",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					if (player.hasFellowSkill("priest_hunwu") || target.side != player.side) {
						return true;
					}
					return target.isDamaged();
				},
				selectTarget: -1,
				content: function () {
					var num = 1;
					if (player.hasFellowSkill("stone_shenyou")) {
						num = 2;
					}
					if (player.side == target.side) {
						if (player.hasFellowSkill("priest_hunwu")) {
							target.loseHp(num);
						} else {
							target.recover(num);
						}
					} else {
						target.damage();
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							if (player.hasFellowSkill("priest_hunwu")) {
								return -1;
							}
							if (player.side == target.side) {
								return 1;
							}
							return -1;
						},
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_shengguangzhadan: {
				type: "stonecard",
				stoneact: 2,
				career: "priest",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.countCards("h") > 0;
				},
				selectTarget: -1,
				content: function () {
					var num = 1;
					// if(player.hasFellowSkill('stone_shenyou')){
					// 	num=2;
					// }
					target.damage(target.countCards("h") * num);
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -Math.min(target.countCards("h"), target.hp);
						},
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_maizang: {
				type: "stonecard",
				stoneact: 3,
				career: "priest",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side != player.side;
				},
				content: function () {
					"step 0";
					target.die()._triggered = null;
					"step 1";
					if (player.deckCards) {
						player.deckCards.push(game.createCard(target.name + "_stonecharacter"));
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -target.hp - target.countCards("h") / 2;
						},
					},
				},
			},
			spell_xinlingshijie: {
				type: "stonecard",
				stoneact: 0,
				career: "priest",
				enable: function (event, player) {
					return player.getEnemy().countCards("h") > 0;
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target == player.getEnemy();
				},
				selectTarget: -1,
				content: function () {
					var card = target.getCards("h").randomGet();
					if (card) {
						player.gain(game.createCard(card.name, card.suit, card.number, card.nature), "draw");
					}
				},
				ai: {
					order: 9.5,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_naluzhiguang: {
				type: "stonecard",
				stoneact: 1,
				career: "priest",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					if (player.hasFellowSkill("priest_hunwu")) {
						return true;
					}
					return target.hp < target.maxHp;
				},
				content: function () {
					"step 0";
					var num = 1;
					if (player.hasFellowSkill("stone_shenyou")) {
						num = 2;
					}
					if (player.hasFellowSkill("priest_hunwu")) {
						target.loseHp(num);
					} else {
						target.recover(num);
					}
					"step 1";
					if (target.hp < target.maxHp && player.canAddFellow()) {
						player.addFellowAuto("stone_shengguanghuwei");
					}
				},
				ai: {
					order: 7,
					value: 7,
					useful: 5,
					result: {
						player: function (player, target) {
							if (player.hasFellowSkill("priest_hunwu")) {
								return 1;
							}
							if (target.hp < target.maxHp - 1) {
								return 2;
							}
							return 0;
						},
						target: function (player, target) {
							if (player.hasFellowSkill("priest_hunwu")) {
								return -2;
							}
							return get.recoverEffect(target, player, target);
						},
					},
				},
			},
			spell_zhiliaozhihuan: {
				type: "stonecard",
				stoneact: 0,
				career: "priest",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				selectTarget: -1,
				content: function () {
					var num = 3;
					if (player.hasFellowSkill("stone_shenyou")) {
						num = 6;
					}
					if (player.hasFellowSkill("priest_hunwu")) {
						target.loseHp(num);
					} else {
						target.recover(num);
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							if (player.hasFellowSkill("priest_hunwu")) {
								return -1;
							}
							return get.recoverEffect(target, player, target);
						},
					},
				},
			},

			spell_nuxi: {
				type: "stonecard",
				stoneact: 3,
				career: "warrior",
				enable: true,
				fullimage: true,
				filterTarget: true,
				content: function () {
					target.damage();
					player.changeHujia(2);
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
					},
				},
			},
			spell_dunpaimengji: {
				type: "stonecard",
				stoneact: 2,
				career: "warrior",
				enable: function (event, player) {
					return player.hujia > 0;
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					target.damage(player.hujia);
				},
				ai: {
					order: 7.2,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
						tag: {
							damage: 1,
						},
					},
				},
			},
			spell_zhansha: {
				type: "stonecard",
				stoneact: 1,
				career: "warrior",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.hp < target.maxHp;
				},
				content: function () {
					target.die();
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -target.hp - target.countCards("h") / 2;
						},
					},
				},
			},
			spell_nuhuozhongshao: {
				type: "stonecard",
				stoneact: 0,
				career: "warrior",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					"step 0";
					target.damage();
					"step 1";
					if (target.isAlive()) {
						target.draw(2);
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							if (target.hp == 1) {
								return -1;
							}
							if (target.hp >= 4) {
								return 1.5;
							}
							if (target.hp >= 3 && target.countCards("h") < target.hp) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			spell_xuanfengzhan: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				career: "warrior",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				selectTarget: -1,
				content: function () {
					target.damage();
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_juemingluandou: {
				type: "stonecard",
				stoneact: 4,
				career: "warrior",
				enable: function () {
					var num = 0;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin()) {
							num++;
							if (num >= 2) {
								return true;
							}
						}
					}
					return false;
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				selectTarget: -1,
				content: function () {
					"step 0";
					targets.randomRemove();
					targets.sort(lib.sort.seat);
					event.list = targets;
					"step 1";
					if (event.list.length) {
						event.list.shift().die();
						event.redo();
					}
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						target: -2,
					},
				},
			},

			spell_lierenyinji: {
				type: "stonecard",
				stoneact: 0,
				career: "hunter",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.maxHp > 1;
				},
				content: function () {
					target.loseMaxHp(target.maxHp - 1);
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return 1 - target.hp;
						},
					},
				},
			},
			spell_kuaisusheji: {
				type: "stonecard",
				stoneact: 2,
				career: "hunter",
				enable: true,
				fullimage: true,
				filterTarget: true,
				content: function () {
					target.damage();
					player.draw();
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
					},
				},
			},
			spell_guanmenfanggou: {
				type: "stonecard",
				stoneact: 2,
				career: "hunter",
				enable: function (event, player) {
					return player.getEnemy().countFellow() > 0 && player.canAddFellow();
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					"step 0";
					event.num = player.getEnemy().countFellow();
					"step 1";
					if (player.canAddFellow() && event.num--) {
						player.addFellowAuto("stone_liegou");
						event.redo();
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: 1,
					},
				},
			},
			spell_zhaohuanchongwu: {
				type: "stonecard",
				stoneact: 2,
				career: "hunter",
				enable: function (event, player) {
					return player.canAddFellow();
				},
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					player.addFellowAuto(lib.beastList.randomGet());
				},
				ai: {
					order: 6,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_zidanshangtang: {
				type: "stonecard",
				stoneact: 1,
				career: "hunter",
				enable: true,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					var list = ["spell_lierenyinji", "spell_guanmenfanggou", "spell_duochongsheji", "spell_kuaisusheji", "spell_zhaohuanchongwu"];
					player.gain(game.createCard(list.randomGet()), "draw");
					player.addTempSkill("hunter_zidanshangtang");
				},
				ai: {
					order: 7.5,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_duochongsheji: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side != player.side) {
							return true;
						}
					}
					return false;
				},
				stoneact: 4,
				career: "hunter",
				notarget: true,
				content: function () {
					"step 0";
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side != player.side) {
							list.push(game.players[i]);
						}
					}
					if (list.length) {
						list = list.randomGets(2);
						list.sort(lib.sort.seat);
					}
					event.list = list;
					"step 1";
					if (event.list.length) {
						var current = event.list.shift();
						player.line(current);
						current.damage(2);
						event.redo();
					}
				},
				ai: {
					order: 5,
					result: {
						player: 1,
					},
				},
			},

			spell_liliangdaijia: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "warlock",
				filterTarget: function (card, player, target) {
					return target.side == player.side && target.isMin();
				},
				content: function () {
					target.draw(4);
					target.hp = 5;
					target.maxHp = 5;
					target.update();
					target.addSkill("stone_zibao");
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							if (target.hasSkill("warlock_yongsheng")) {
								return 2;
							}
							if (target.hp == 1 && target.countCards("h") <= 2) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			spell_xiaoguibaopo: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "warlock",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					"step 0";
					event.num = Math.ceil(Math.random() * 3);
					target.damage(event.num);
					"step 1";
					if (player.canAddFellow() && event.num--) {
						player.addFellowAuto("stone_xiaogui");
						event.redo();
					}
				},
				ai: {
					order: 6,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
					},
				},
			},
			spell_emozhinu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 4,
				career: "warlock",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				selectTarget: -1,
				content: function () {
					target.damage(2);
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_anyinglieyan: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "warlock",
				filterTarget: function (card, player, target) {
					return target.side == player.side && target.isMin();
				},
				content: function () {
					"step 0";
					target.die({ source: player });
					event.num = target.hp;
					"step 1";
					event.list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side != player.side) {
							event.list.push(game.players[i]);
						}
					}
					event.list.sort(lib.sort.seat);
					"step 2";
					if (event.list.length) {
						event.list.shift().damage(event.num);
						event.redo();
					}
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						player: function (player, target) {
							if (player == target) {
								return -10;
							}
							var list = [];
							var maxHp = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].isMin() && game.players[i].side != player.side) {
									list.push(game.players[i]);
									if (game.players[i].hp > maxHp) {
										maxHp = game.players[i].hp;
									}
								}
							}
							if (list.length < 2) {
								return 0;
							}
							if (list.length == 2 && target.hp >= 4) {
								return 0;
							}
							if (target.hp > maxHp) {
								return 1;
							}
							return target.hp;
						},
					},
				},
			},
			spell_xishengqiyue: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 0,
				career: "warlock",
				filterTarget: function (card, player, target) {
					if (!target.isMin()) {
						return false;
					}
					if (ui.selected.targets.length) {
						return target.side != ui.selected.targets[0].side;
					}
					return true;
				},
				selectTarget: 2,
				multitarget: true,
				multiline: true,
				content: function () {
					targets.sort(lib.sort.seat);
					for (var i = 0; i < targets.length; i++) {
						targets[i].die();
					}
				},
				ai: {
					result: {
						target: function (player, target) {
							if (ui.selected.targets.length && target.hp < ui.selected.targets[0].hp) {
								return 1;
							}
							return -1;
						},
					},
					order: 6,
				},
			},
			spell_zuzhou: {
				type: "stonecard",
				enable: true,
				stoneact: 1,
				fullimage: true,
				career: "warlock",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					target.turnOver();
					player.draw();
				},
				ai: {
					order: 6,
					result: {
						target: function (player, target) {
							if (target.isTurnedOver()) {
								return 1;
							}
							return -1;
						},
					},
				},
			},

			spell_yexingchengzhang: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return !player.hasSkill("druid_yexingchengzhang") && !player.isMin();
				},
				stoneact: 2,
				career: "druid",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					player.addSkill("druid_yexingchengzhang");
				},
				ai: {
					order: 2,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_ziranzhili: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return player.canAddFellow();
				},
				stoneact: 4,
				career: "druid",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					"step 0";
					event.num = 3;
					"step 1";
					if (player.canAddFellow() && event.num--) {
						player.addFellowAuto("stone_shuren");
						event.redo();
					}
				},
				ai: {
					order: 6,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_yemanpaoxiao: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return !player.hasSkill("spell_yemanpaoxiao");
				},
				stoneact: 2,
				career: "druid",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					player.addTempSkill("spell_yemanpaoxiao", { player: "phaseBegin" });
				},
				ai: {
					order: 1,
					value: 5,
					useful: 5,
					result: {
						player: function (player) {
							if (player.countFellow() >= 2) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			spell_hengsao: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 4,
				career: "druid",
				filterTarget: function (card, player, target) {
					return target.side != player.side;
				},
				content: function () {
					"step 0";
					event.list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != target && game.players[i].side == target.side) {
							event.list.push(game.players[i]);
						}
					}
					target.damage(2);
					"step 1";
					if (event.list.length) {
						event.list.shift().damage();
						event.redo();
					}
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						target: -2,
					},
					tag: {
						damage: 1,
					},
				},
			},
			spell_wuyashenxiang: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "druid",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					"step 0";
					player.chooseControl("法术牌", "随从牌").ai = function () {
						return Math.random() < 0.5 ? "法术牌" : "随从牌";
					};
					"step 1";
					var list = [];
					var bool = result.control == "法术牌";
					for (var i in lib.card) {
						if (lib.card[i].stonehidden) {
							continue;
						}
						if (bool) {
							if (lib.card[i].type == "stonecard") {
								list.push(i);
							}
						} else {
							if (lib.card[i].type == "stonecharacter") {
								list.push(i);
							}
						}
					}
					list = list.randomGets(3);
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						cards.push(game.createCard(list[i]));
					}
					player.chooseCardButton(cards, "选择一张加入手牌", true);
					"step 2";
					player.gain(result.links, "draw");
				},
				ai: {
					order: 2,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_huotigenxu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "druid",
				filterTarget: true,
				selectTarget: [0, 1],
				notarget: true,
				multitarget: true,
				targetprompt: ["造成一点伤害"],
				content: function () {
					"step 0";
					if (targets.length) {
						targets[0].damage();
						event.finish();
					} else {
						event.num = 2;
					}
					"step 1";
					if (player.canAddFellow() && event.num--) {
						player.addFellowAuto("stone_shumiao");
						event.redo();
					}
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: -1,
					},
					tag: {
						damage: 1,
					},
				},
			},

			spell_cigu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				career: "rogue",
				filterTarget: true,
				content: function () {
					"step 0";
					if (player.countCards("e")) {
						player.chooseToDiscard("e", "是否弃置一张装备区内的牌令伤害+1？").ai = function (card) {
							return 7 - get.value(card);
						};
					} else {
						event.goto(2);
					}
					"step 1";
					if (result.bool) {
						event.add = true;
					}
					"step 2";
					if (event.add) {
						target.damage(2);
					} else {
						target.damage();
					}
					player.storage.spell_cigu = false;
				},
				ai: {
					order: 8,
					value: 6,
					useful: 6,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
					},
				},
			},
			spell_sijidaifa: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return !player.hasSkill("spell_sijidaifa");
				},
				stoneact: 0,
				career: "rogue",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					player.addSkill("spell_sijidaifa");
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_daoshan: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "rogue",
				filterTarget: function (card, player, target) {
					return target.side != player.side && target.isMin();
				},
				selectTarget: -1,
				content: function () {
					target.damage();
				},
				contentAfter: function () {
					player.drawDeck();
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_jianrenluanwu: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return player.getEquip(1) ? true : false;
				},
				stoneact: 2,
				career: "rogue",
				filterTarget: function (card, player, target) {
					return target.side != player.side;
				},
				selectTarget: -1,
				contentBefore: function () {
					player.discard(player.getEquip(1));
				},
				content: function () {
					if (typeof player.storage.spell_modaoyou == "number") {
						target.damage(player.storage.spell_modaoyou + 1);
					} else {
						target.damage();
					}
					player.unmarkSkill("spell_modaoyou");
				},
				contentAfter: function () {
					player.storage.spell_modaoyou = 0;
				},
				ai: {
					order: 8,
					value: 6,
					useful: 6,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_cisha: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 4,
				career: "rogue",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					target.die({ source: player });
				},
				ai: {
					order: 8.8,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -target.hp - target.countCards("h") / 2;
						},
					},
				},
			},
			spell_modaoyou: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				career: "rogue",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					player.markSkill("spell_modaoyou");
					if (typeof player.storage.spell_modaoyou != "number") {
						player.storage.spell_modaoyou = 1;
					} else {
						player.storage.spell_modaoyou++;
					}
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side == player.side) {
							list.push(game.players[i]);
						}
					}
					if (list.length) {
						game.asyncDraw([player, list.randomGet()], 2);
					} else {
						player.draw(2);
					}
				},
				ai: {
					order: 1,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},

			spell_fengxian: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "paladin",
				filterTarget: function (card, player, target) {
					return target.side != player.side;
				},
				selectTarget: -1,
				content: function () {
					target.damage();
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_fuchouzhinu: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return player.getEnemy().countFellow() > 0;
				},
				stoneact: 4,
				career: "paladin",
				filterTarget: function (card, player, target) {
					return target.side != player.side && target.isMin();
				},
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				content: function () {
					"step 0";
					if (!targets.length) {
						event.finish();
						return;
					}
					var map = [];
					for (var i = 0; i < targets.length; i++) {
						map.push(0);
					}
					for (var i = 0; i < 5; i++) {
						map[Math.floor(Math.random() * map.length)]++;
					}
					event.num = 0;
					event.map = map;
					"step 1";
					if (event.num < targets.length) {
						if (event.map[event.num]) {
							targets[event.num].damage(event.map[event.num]);
						}
						event.num++;
						event.redo();
					}
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
					},
				},
			},
			spell_liliangzhufu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "paladin",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					target.draw(2);
				},
				ai: {
					order: 6,
					value: 5,
					useful: 5,
					result: {
						target: 1,
					},
				},
			},
			spell_shengliaoshu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "paladin",
				filterTarget: true,
				content: function () {
					target.recover(2);
					target.draw(2);
				},
				ai: {
					order: 4,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return 1 + target.maxHp - target.hp;
						},
					},
				},
			},
			spell_zuozhandongyuan: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return player.canAddFellow();
				},
				stoneact: 3,
				career: "paladin",
				notarget: true,
				content: function () {
					"step 0";
					if (player.canAddFellow()) {
						player.addFellowAuto("stone_xinbing");
					}
					"step 1";
					if (player.canAddFellow()) {
						player.addFellowAuto("stone_xinbing");
					}
					"step 2";
					var equip1 = get.cardPile(function (card) {
						return get.subtype(card) == "equip1";
					});
					if (!equip1) {
						equip1 = game.createCard("qingnang");
					}
					player.equip(equip1);
				},
				ai: {
					order: 8.5,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_fennuzhichui: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				career: "paladin",
				filterTarget: true,
				content: function () {
					target.damage();
					player.drawDeck();
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
					},
				},
			},

			spell_lianhuanbaolie: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "shaman",
				filterTarget: true,
				content: function () {
					target.damage(Math.ceil(Math.random() * 2), "thunder");
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
						natureDamage: 1,
						thunderDamage: 1,
					},
				},
			},
			spell_shandianfengbao: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				career: "shaman",
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side != player.side;
				},
				selectTarget: -1,
				content: function () {
					target.damage(Math.ceil(Math.random() * 2), "thunder");
				},
				ai: {
					order: 9,
					useful: 5,
					value: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
						natureDamage: 1,
						thunderDamage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_yaoshu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "shaman",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					target.clearSkills(true);
					target.init("stone_qingwa");
					target.noPhaseDelay = true;
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -target.hp;
						},
					},
				},
			},
			spell_shixue: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 4,
				career: "shaman",
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side == player.side;
				},
				multitarget: true,
				multiline: true,
				content: function () {
					game.asyncDraw(targets, 2);
				},
				ai: {
					order: 5,
					value: 5,
					useful: 5,
					result: {
						target: 2,
					},
					tag: {
						multitarget: 1,
					},
				},
			},
			spell_yexinglanghun: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return player.canAddFellow();
				},
				stoneact: 4,
				career: "shaman",
				notarget: true,
				content: function () {
					"step 0";
					if (player.canAddFellow()) {
						player.addFellowAuto("stone_youlinglang");
					}
					"step 1";
					if (player.canAddFellow()) {
						player.addFellowAuto("stone_youlinglang");
					}
				},
				ai: {
					order: 9,
					value: 5,
					useful: 5,
					result: {
						player: 1,
					},
				},
			},
			spell_chazhuangshandian: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side != player.side) {
							return true;
						}
					}
					return false;
				},
				stoneact: 2,
				career: "shaman",
				notarget: true,
				content: function () {
					"step 0";
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side != player.side) {
							list.push(game.players[i]);
						}
					}
					if (list.length) {
						list = list.randomGets(2);
						list.sort(lib.sort.seat);
					}
					event.list = list;
					"step 1";
					if (event.list.length) {
						var current = event.list.shift();
						player.line(current, "thunder");
						current.damage("thunder");
						event.redo();
					}
				},
				ai: {
					order: 5,
					result: {
						player: 1,
					},
				},
			},

			spell_hanbingjian: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				career: "mage",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					"step 0";
					target.damage(2);
					"step 1";
					if (target.isAlive() && !target.isTurnedOver()) {
						target.turnOver();
					}
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: -1,
					},
					tag: {
						damage: 2,
					},
				},
			},
			spell_huoqiushu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 4,
				career: "mage",
				filterTarget: true,
				content: function () {
					var num = 3;
					if (!target.isMin()) {
						num = Math.min(3, target.hp);
					}
					target.damage(num, "fire");
				},
				ai: {
					order: 8,
					value: 5,
					useful: 5,
					result: {
						target: -2,
					},
					tag: {
						damage: 2,
						natureDamage: 2,
						fireDamage: 2,
					},
				},
			},
			spell_lieyanfengbao: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 5,
				career: "mage",
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side != player.side;
				},
				selectTarget: -1,
				content: function () {
					target.damage(2);
				},
				ai: {
					order: 9,
					useful: 5,
					value: 5,
					result: {
						target: -2,
					},
					tag: {
						damage: 2,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			spell_bianxingshu: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "mage",
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					target.clearSkills();
					target.init("stone_mianyang");
				},
				ai: {
					order: 7,
					value: 5,
					useful: 5,
					result: {
						target: function (player, target) {
							return -target.hp;
						},
					},
				},
			},
			spell_aoshuzhihui: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 1,
				career: "mage",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					player.drawDeck(2);
				},
				ai: {
					order: 0.5,
					result: {
						player: 1,
					},
				},
			},
			spell_baofengxue: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 4,
				career: "mage",
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side != player.side;
				},
				selectTarget: -1,
				content: function () {
					"step 0";
					target.damage();
					"step 1";
					if (target.isAlive()) {
						target.turnOver();
					}
				},
				ai: {
					order: 9,
					useful: 5,
					value: 5,
					result: {
						target: -1.5,
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},

			spell_chenmo: {
				type: "stonecard",
				enable: true,
				stoneact: 2,
				fullimage: true,
				filterTarget: function (card, player, target) {
					return target.isMin() && (target.maxHp > 1 || target.countCards("he") > 0);
				},
				content: function () {
					"step 0";
					target.discard(target.getCards("he"));
					"step 1";
					if (target.maxHp > 2) {
						target.loseMaxHp(target.maxHp - 2);
					}
				},
				ai: {
					result: {
						target: function (player, target) {
							return Math.min(0, 2 - target.hp) - target.countCards("h") / 2;
						},
					},
					order: 7,
				},
			},
			spell_morizaihuo: {
				fullimage: true,
				type: "stonecard",
				enable: true,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				selectTarget: -1,
				multiline: true,
				multitarget: true,
				content: function () {
					"step 0";
					targets.sort(lib.sort.seat);
					event.list = targets;
					"step 1";
					if (event.list.length) {
						event.list.shift().die();
						event.redo();
					}
					"step 2";
					player.recover(2);
				},
				stoneact: 5,
				ai: {
					order: 9,
					result: {
						target: -1,
						player: function (player) {
							if (player.hp < player.maxHp) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			spell_shengerpingdeng: {
				fullimage: true,
				type: "stonecard",
				enable: true,
				stoneact: 2,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.maxHp > 1;
				},
				selectTarget: -1,
				content: function () {
					target.loseMaxHp(target.maxHp - 1);
				},
				ai: {
					order: 9.1,
					result: {
						target: function (player, target) {
							if (target.hp > 1) {
								return -1;
							}
							if (target.maxHp > 1) {
								return -0.1;
							}
							return 0;
						},
					},
				},
			},
			spell_jingshenkongzhi: {
				fullimage: true,
				type: "stonecard",
				enable: function (event, player) {
					if (player.isMin()) {
						return false;
					}
					return player.canAddFellow();
				},
				stoneact: 6,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side != player.side;
				},
				content: function () {
					target.getLeader().removeFellow(target);
					target.side = player.side;
					player.addFellow(target);
					if (!target.isTurnedOver()) {
						target.turnOver();
					}
				},
				ai: {
					order: 9.5,
					result: {
						target: function (player, target) {
							return -target.hp;
						},
					},
				},
			},
			spell_anyingkuangluan: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					if (player.isMin()) {
						return false;
					}
					return player.canAddFellow();
				},
				stoneact: 4,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side != player.side && target.countCards("h") <= 1;
				},
				content: function () {
					target.getLeader().removeFellow(target);
					target.side = player.side;
					player.addFellow(target);
					target.addSkill("spell_anyingkuangluan_die");
				},
				ai: {
					order: 9.5,
					result: {
						target: function (player, target) {
							return -target.hp;
						},
					},
				},
			},
			spell_binghuan: {
				fullimage: true,
				type: "stonecard",
				enable: true,
				stoneact: 1,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				selectTarget: -1,
				content: function () {
					target.turnOver();
				},
				ai: {
					order: 7,
					result: {
						target: function (player, target) {
							if (target.isTurnedOver()) {
								return 1;
							}
							return -1;
						},
					},
				},
			},
			spell_zhiliaozhichu: {
				fullimage: true,
				type: "stonecard",
				enable: true,
				stoneact: 1,
				filterTarget: function (card, player, target) {
					return target.isMin() && target.side == player.side && (!target.hasSkill("lschaofeng") || target.hp < target.maxHp);
				},
				content: function () {
					if (target.hp < target.maxHp) {
						target.recover(target.maxHp - target.hp);
					}
					target.addSkill("lschaofeng");
					target.markSkill("lschaofeng");
					game.log(target, "获得了嘲讽");
					target.popup("嘲讽");
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							return target.maxHp - target.hp;
						},
					},
				},
			},
			spell_wangzhezhufu: {
				fullimage: true,
				type: "stonecard",
				enable: true,
				stoneact: 4,
				filterTarget: function (card, player, target) {
					return target.isMin();
				},
				content: function () {
					target.maxHp += 2;
					target.hp += 2;
					target.update();
					target.draw(2);
				},
				ai: {
					order: 7,
					result: {
						target: function (player, target) {
							return Math.max(1, 10 - target.hp);
						},
					},
				},
			},
			spell_diyulieyan: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				filterTarget: true,
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				content: function () {
					targets.sort(lib.sort.seat);
					for (var i = 0; i < targets.length; i++) {
						targets[i].loseHp();
					}
					ui.clear();
				},
				ai: {
					order: 9,
					result: {
						target: -1,
					},
				},
			},
			spell_zhiliaoshui: {
				type: "stonecard",
				fullimage: true,
				enable: function (event, player) {
					return player.hp < player.maxHp;
				},
				savable: true,
				stoneact: 2,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				content: function () {
					if (target.isDying()) {
						target.recover();
					} else {
						target.recover(2);
					}
				},
				ai: {
					order: 8,
					value: 6,
					useful: 6,
					result: {
						target: 1,
					},
				},
			},
			spell_yanmie: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 3,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player.getEnemy();
				},
				content: function () {
					"step 0";
					var targets = [player, target];
					event.cards = [targets[0].getCards("e"), targets[1].getCards("e")];
					targets[0].lose(event.cards[0], ui.special);
					targets[1].lose(event.cards[1], ui.special);
					if (event.cards[0].length) {
						targets[0].$give(event.cards[0], targets[1]);
					}
					if (event.cards[1].length) {
						targets[1].$give(event.cards[1], targets[0]);
					}
					"step 1";
					var targets = [player, target];
					for (var i = 0; i < event.cards[1].length; i++) {
						targets[0].equip(event.cards[1][i]);
					}
					for (var i = 0; i < event.cards[0].length; i++) {
						targets[1].equip(event.cards[0][i]);
					}
					"step 2";
					var dh = target.countCards("h") - player.countCards("h");
					if (dh > 0) {
						player.draw(dh);
					}
				},
				ai: {
					order: 7,
					value: 1,
					useful: 1,
					result: {
						target: function (player, target) {
							var ne1 = target.countCards("e"),
								ne2 = player.countCards("e");
							var nh1 = target.countCards("h"),
								nh2 = player.countCards("h");
							if (nh1 < nh2) {
								nh1 = nh2;
							}
							if (ne2 - ne1 < nh1 - nh2 + ne1 - ne2) {
								return -1;
							}
							return 0;
						},
					},
				},
			},
			spell_xiaoshi: {
				type: "stonecard",
				fullimage: true,
				enable: true,
				stoneact: 2,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player.getEnemy();
				},
				content: function () {
					"step 0";
					target.gain(target.getCards("e"), "gain2");
					"step 1";
					var dh = target.countCards("h") - player.countCards("h");
					if (dh > 0) {
						target.discard(target.getCards("h").randomGets(dh));
					}
				},
				ai: {
					order: 1,
					value: 1,
					useful: 1,
					result: {
						target: function (player, target) {
							if (target.countCards("he") >= player.countCards("h")) {
								return -1;
							}
							return 0;
						},
					},
				},
			},
		},
		skill: {
			stone_mieshi: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player) {
							list.push(game.players[i]);
						}
					}
					list.sort(lib.sort.seat);
					event.list = list;
					"step 1";
					if (event.list.length) {
						var current = event.list.shift();
						current.damage(2, "fire");
						player.line(current, "fire");
						event.redo();
					}
					"step 2";
					var target = player.getLeader();
					var hs = target.getCards("h");
					if (hs.length) {
						target.discard(hs);
					}
					game.delay();
				},
			},
			stone_fushi: {
				trigger: { source: "fellow" },
				forced: true,
				unique: false,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i].isDamaged()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i].isDamaged()) {
							list.push(game.players[i]);
							game.players[i].recover(game.players[i].maxHp);
						}
					}
					player.line(list, "green");
				},
			},
			stone_shixu: {
				trigger: { source: "fellow" },
				forced: true,
				unique: false,
				filter: function (event, player) {
					return _status.currentPhase == player.getLeader();
				},
				content: function () {
					var target = player.getLeader();
					target.actused -= 4;
					target.updateActCount();
					player.line(target, "green");
				},
			},
			stone_mowang: {
				trigger: { global: "damageBegin" },
				forced: true,
				filter: function (event, player) {
					return event.source && event.source != player && player.side == event.source.side && event.notLink() && event.card && get.type(event.card) == "stonecard";
				},
				content: function () {
					if (trigger.player.isMin()) {
						trigger.num += 4;
					} else {
						trigger.num += 2;
					}
				},
				ai: {
					threaten: 1.6,
				},
			},
			shaman_fali: {
				trigger: { global: "damageBegin" },
				forced: true,
				filter: function (event, player) {
					return event.source && event.source != player && event.source == player.getLeader() && event.notLink() && event.card && get.type(event.card) == "stonecard";
				},
				content: function () {
					trigger.num++;
				},
				ai: {
					threaten: 1.3,
				},
			},
			stone_zhiyin: {
				trigger: { global: "useCard" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return get.type(event.card) == "stonecard" && event.player == player.getLeader();
				},
				content: function () {
					trigger.player.gain(game.createCard("spell_huoqiushu"), "gain2");
				},
				ai: {
					threaten: 1.5,
				},
			},
			stone_bianshen: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getLeader().career == "warlock";
				},
				content: function () {
					"step 0";
					var target = player.getLeader();
					if (target.name == "stone_jialakesix") {
						target.hp = target.maxHp;
						target.update();
						target.actused -= 6;
						target.updateActCount();
						target.storage.stone_lianyu++;
					} else {
						if (target.name2) {
							target.storage.stone_lianyu = 1;
						} else {
							target.storage.stone_lianyu = 0;
						}
						target.init("stone_jialakesix");
						game.addVideo("reinit2", target, "stone_jialakesix");
					}
					target.syncStorage("stone_lianyu");
					game.delay();
					"step 1";
					player.die()._triggered = null;
				},
			},
			stone_jinu: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				filter: function (event, player) {
					return player.isDamaged();
				},
				content: function () {
					trigger.num += 2;
				},
				ai: {
					threaten: function (player, target) {
						if (target.hp < target.maxHp) {
							return 2;
						}
						return 0.5;
					},
					maixie: true,
					effect: {
						target: function (card, player, target) {
							if (target.maxHp <= 3) {
								return;
							}
							if (get.tag(card, "damage")) {
								if (target.hp == target.maxHp) {
									return [0, 1];
								}
							}
							if (get.tag(card, "recover") && player.hp >= player.maxHp - 1) {
								return [0, 0];
							}
						},
					},
				},
			},
			stone_lianyu: {
				mark: true,
				intro: {
					content: function (storage) {
						return "地狱火的初始手牌数和体力值为" + (storage + 2);
					},
				},
				ai: {
					threaten: function (player, target) {
						return 1 + target.storage.stone_lianyu;
					},
				},
			},
			stone_lianji: {
				trigger: { global: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.player.side == player.side && event.source != player;
				},
				content: function () {
					player.maxHp++;
					player.hp++;
					player.update();
					player.draw();
				},
				ai: {
					threaten: 2,
				},
			},
			stone_shenyu: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					var target = player.getLeader();
					var next = target.chooseControl("召唤树人", "增强随从");
					next.prompt = "召唤两个嘲讽树人，或令所有其他随从增加1点体力和体力上限并摸两张牌";
					next.ai = function () {
						if (target.countFellow() <= 2) {
							return "召唤树人";
						}
						return "增强随从";
					};
					"step 1";
					if (result.control == "增强随从") {
						var targets = player.getLeader().getFellow();
						targets.remove(player);
						for (var i = 0; i < targets.length; i++) {
							targets[i].hp++;
							targets[i].maxHp++;
							targets[i].update();
						}
						game.asyncDraw(targets, 2);
						event.finish();
					}
					"step 2";
					var target = player.getLeader();
					if (target.canAddFellow()) {
						target.addFellowAuto("stone_shurenxx");
					}
					"step 3";
					var target = player.getLeader();
					if (target.canAddFellow()) {
						target.addFellowAuto("stone_shurenxx");
					}
				},
			},
			stone_fuchou: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addSkill("stone_fuchou2");
				},
			},
			stone_fuchou2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player.hasSkill("stone_fuchou");
				},
				content: function () {
					game.delay();
					player.removeSkill("stone_fuchou2");
					var targets = player.getEnemy().getFellow();
					if (targets.length) {
						player.useCard(targets, game.createCard("spell_fuchouzhinu"), false).noActCount = true;
					}
				},
			},
			stone_shenyou: {
				ai: {
					threaten: 1.6,
				},
			},

			warlock_anyu: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].stonehidden) {
							continue;
						}
						if (lib.card[i].type == "stonecharacter" || lib.card[i].type) {
							if (lib.card[i].stoneact == 1) {
								list.push(i);
							}
						}
					}
					list = list.randomGets(3);
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						cards.push(game.createCard(list[i]));
					}
					player.getLeader().chooseCardButton(cards, "选择一张加入手牌", true);
					"step 1";
					player.getLeader().gain(result.links, "draw");
				},
			},
			warlock_zhaohuan: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addSkill("warlock_zhaohuan2");
				},
				ai: {
					threaten: 0.9,
				},
			},
			warlock_zhaohuan2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player.hasSkill("warlock_zhaohuan");
				},
				content: function () {
					game.delay();
					player.removeSkill("warlock_zhaohuan2");
					var hs = player.getCards("h", function (card) {
						return get.type(card) == "stonecharacter";
					});
					if (hs.length && player.canAddFellow()) {
						player.useCard(player, hs.randomGet(), false).noActCount = true;
					}
				},
			},
			warlock_huanmeng: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var target = player.getLeader();
					var hs = target.getCards("h");
					if (hs.length) {
						target.discard(hs.randomGets(1));
					}
				},
			},
			warlock_tongku: {
				trigger: { source: "damageEnd" },
				unique: true,
				forced: true,
				filter: function (event, player) {
					return player.getLeader().isDamaged();
				},
				content: function () {
					var target = player.getLeader();
					player.line(target, "green");
					target.recover();
				},
				ai: {
					threaten: 1.3,
				},
			},
			warlock_tunshi: {
				trigger: { source: "fellow" },
				unique: true,
				forced: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side == player.side && game.players[i] != player) {
							return true;
						}
					}
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget(
						"吞噬：令一名友方随从死亡",
						function (card, playerx, target) {
							return player != target && target.isMin() && target.side == player.side;
						},
						true
					).ai = function (target) {
						return -target.hp - target.countCards("h") / 4;
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						game.delay();
						var target = result.targets[0];
						var hs = target.getCards("h");
						if (hs.length) {
							player.gain(hs);
						}
						target.$give(hs.length, player);
						player.hp += target.hp;
						player.maxHp += target.hp;
						player.update();
						target.die();
					}
				},
			},
			warlock_shijie: {
				trigger: { global: "damageEnd" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.player == player.getLeader();
				},
				content: function () {
					player.maxHp++;
					player.hp++;
					player.update();
					player.draw();
				},
				ai: {
					threaten: 1.6,
				},
			},

			warrior_heiyao: {
				trigger: { global: "phaseEnd" },
				forced: true,
				direct: true,
				filter: function (event, player) {
					return event.player == player.getLeader() && event.player.canAddFellow();
				},
				content: function () {
					trigger.player.addFellowAuto("stone_shengjiachong");
				},
				ai: {
					threaten: 1.3,
				},
			},
			warrior_fenyong: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getLeader().countCards("h", { type: "stonecharacter" }) > 0;
				},
				content: function () {
					player.addSkill("stone_chongfeng");
					if (player.isTurnedOver()) {
						player.turnOver();
					}
				},
			},
			warrior_peilian: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i].isMin() && !game.players[i].hasSkill("lschaofeng")) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("陪练：令一名随从获得嘲讽", function (card, playerx, target) {
						return player != target && target.isMin() && !target.hasSkill("lschaofeng");
					}).ai = function (target) {
						return get.attitude(event.chooser, target) * target.hp;
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						result.targets[0].addSkill("lschaofeng");
					}
				},
			},
			warrior_chuanci: {
				trigger: { source: "damageEnd" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					var target = event.player;
					if (target.side == player.side) {
						return false;
					}
					if (event.parent.name == "warrior_chuanci") {
						return false;
					}
					if (!target.isMin()) {
						return false;
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != target && game.players[i].isMin() && game.players[i].side != player.side) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != trigger.player && game.players[i].isMin() && game.players[i].side != player.side) {
							list.push(game.players[i]);
						}
					}
					if (list.length) {
						var target = list.randomGet();
						player.line(target, "green");
						target.damage(trigger.num);
					}
				},
			},
			warrior_zhifu: {
				trigger: { player: "damageEnd" },
				forced: true,
				unique: true,
				content: function () {
					var target = player.getEnemy();
					player.line(target, "green");
					target.damage();
				},
			},

			priest_puzhao: {
				trigger: { source: "fellow" },
				unique: true,
				forced: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i] != player && game.players[i].isMin()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("普照：选择一名己方随从增加2点体力和体力上限", function (card, playerx, target) {
						return player != target && player.side == target.side && target.isMin();
					}).ai = function (target) {
						return get.attitude(event.chooser, target) * Math.max(1, 10 - target.hp);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						result.targets[0].maxHp += 2;
						result.targets[0].hp += 2;
						result.targets[0].update();
					}
				},
			},
			priest_suoxiao: {
				trigger: { source: "fellow" },
				unique: true,
				forced: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i].isMin() && game.players[i].maxHp > 1) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("缩小：令一名随从减少2点体力上限", function (card, playerx, target) {
						return player != target && target.isMin() && target.maxHp > 1;
					}).ai = function (target) {
						if (get.attitude(player, target) >= 0) {
							return 0;
						}
						if (target.hp == 1) {
							return 0.01;
						}
						if (target.maxHp - target.hp >= 2) {
							return 0.01;
						}
						if (target.maxHp - target.hp == 1) {
							if (target.hp == 2) {
								return 1;
							}
							return 0.1;
						}
						switch (target.hp) {
							case 1:
								return 0.01;
							case 2:
								return 1;
							case 3:
								return 2;
							case 4:
								return 1.5;
							case 5:
								return 1;
							default:
								return 0.8;
						}
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						result.targets[0].maxHp -= 2;
						if (result.targets[0].maxHp < 1) {
							result.targets[0].maxHp = 1;
						}
						result.targets[0].update();
					}
				},
			},
			priest_shixin: {
				trigger: { global: "useSkillAfter" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.career && event.player.side == player.side;
				},
				content: function () {
					"step 0";
					var target = player.getLeader();
					target.damage();
					player.line(target, "green");
					"step 1";
					var target = player.getEnemy();
					target.damage();
					player.line(target, "green");
				},
			},
			priest_shengshui: {
				trigger: { player: "phaseBegin" },
				unique: true,
				forced: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i].isDamaged()) {
							return true;
						}
					}
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i].isDamaged()) {
							list.push(game.players[i]);
						}
					}
					if (list.length) {
						var target = list.randomGet();
						target.recover(2);
						player.line(target, "green");
					}
				},
				ai: {
					threaten: 1.5,
				},
				group: "priest_shengshui2",
			},
			priest_shengshui2: {
				trigger: { player: "phaseDrawBefore" },
				forced: true,
				popup: false,
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: function (card) {
							if (card.name == "bingliang") {
								return [0, 0];
							}
						},
					},
					noPhaseDelay: 1,
				},
			},
			priest_muguang: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getLeader().countCards("h", { type: "stonecharacter" }) > 0;
				},
				content: function () {
					player.maxHp++;
					player.hp++;
					player.update();
				},
			},

			hunter_mishi: {
				trigger: { global: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.player.side == player.side && event.source != player;
				},
				content: function () {
					player.draw();
				},
			},
			hunter_muyang: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getLeader().countFellow() > 1 && player.getLeader().canAddFellow();
				},
				content: function () {
					var num = player.getLeader().countFellow() - 1;
					var list = [];
					for (var i in lib.character) {
						if (lib.character[i].isFellowInStoneMode && !lib.character[i].isHiddenInStoneMode && lib.character[i].extraModeData && lib.character[i].extraModeData[0] == num) {
							list.push(i);
						}
					}
					var target = player.getLeader();
					if (list.length) {
						target.addFellowAuto(list.randomGet());
					}
				},
			},
			hunter_juji: {
				unique: true,
			},
			hunter_dusha: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					var list = [];
					var target = player.getLeader();
					for (var i = 0; i < target.deckCards.length; i++) {
						if (get.type(target.deckCards[i]) == "stonecharacter" && get.info(target.deckCards[i]).stoneact == 1) {
							list.push(target.deckCards[i]);
						}
					}
					if (list.length && target.canAddFellow()) {
						target.useCard(target, list.randomGet(), false).noActCount = true;
					}
					"step 1";
					var list = [];
					var target = player.getEnemy();
					for (var i = 0; i < target.deckCards.length; i++) {
						if (get.type(target.deckCards[i]) == "stonecharacter" && get.info(target.deckCards[i]).stoneact == 1) {
							list.push(target.deckCards[i]);
						}
					}
					if (list.length && target.canAddFellow()) {
						target.useCard(target, list.randomGet(), false).noActCount = true;
					}
				},
			},
			hunter_chuanlin: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var list = [];
					var target = player.getLeader();
					for (var i = 0; i < target.deckCards.length; i++) {
						if (get.type(target.deckCards[i]) == "stonecharacter") {
							list.push(target.deckCards[i]);
						}
					}
					if (list.length) {
						target.gain(target, list.randomGet(), "gain2");
					}
				},
			},
			hunter_zhanhuo: {
				global: "hunter_zhanhuo2",
				ai: {
					threaten: 1.8,
				},
			},
			hunter_zhanhuo2: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				filter: function (event, player) {
					return player.hasFellowSkill("hunter_zhanhuo", true) && player.isMin();
				},
				content: function () {
					trigger.num += player.countFellowSkill("hunter_zhanhuo", true);
				},
			},

			rogue_jiaoyi: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					var target = player.getLeader();
					return target.countCards("e") > 0;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseToDiscard("是否弃置一张装备牌令" + get.translation(player) + "摸三张牌？", "he", function (card) {
						return get.type(card) == "equip";
					}).ai = function (card) {
						return 7 - get.value(card);
					};
					"step 1";
					if (result.bool) {
						player.draw(3);
					}
				},
			},
			rogue_jielue: {
				trigger: { global: "equipEnd" },
				unique: true,
				forced: true,
				filter: function (event, player) {
					return event.player.side == player.side && get.subtype(event.card) == "equip1";
				},
				content: function () {
					player.draw(2);
				},
				ai: {
					threaten: 1.3,
				},
			},
			rogue_fusheng: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].hp > 1) {
							return true;
						}
					}
				},
				content: function () {
					var num = 1;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].hp > num) {
							num = game.players[i].hp;
						}
					}
					player.hp = num;
					player.maxHp = num;
					player.update();
				},
			},
			rogue_lifa: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					var target = player.getLeader();
					if (target.getEquip(1)) {
						target = target.getEnemy();
						player.line(target, "green");
						target.damage();
					} else {
						player.line(target, "green");
						var equip1 = get.cardPile(function (card) {
							return get.subtype(card) == "equip1";
						});
						if (!equip1) {
							equip1 = game.createCard("qingnang");
						}
						target.equip(equip1);
					}
				},
			},
			rogue_shoudao: {
				trigger: { global: "phaseEnd" },
				forced: true,
				direct: true,
				filter: function (event, player) {
					return event.player == player.getLeader() && event.player.countFellow() > 1;
				},
				content: function () {
					"step 0";
					var players = get.players();
					var targets = [];
					for (var i = 0; i < players.length; i++) {
						if (players[i].side == player.side && players[i].isMin() && players[i] != player) {
							targets.push(players[i]);
						}
					}
					if (targets.length) {
						var target = targets.randomGet();
						player.logSkill("rogue_shoudao", target);
						target.maxHp++;
						target.hp++;
						target.update();
						target.draw();
					}
				},
				ai: {
					threaten: 1.8,
				},
			},
			rogue_duxing: {
				trigger: { global: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.player.side != player.side && !player.hasSkill("qianxing");
				},
				content: function () {
					player.tempHide();
				},
			},

			paladin_moma: {
				global: "paladin_moma2",
				ai: {
					threaten: 1.5,
				},
			},
			paladin_moma2: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				filter: function (event, player) {
					return player.name == "stone_xinbing" && player.hasFellowSkill("paladin_moma");
				},
				content: function () {
					trigger.num += player.countFellowSkill("paladin_moma");
				},
			},
			paladin_jinghua: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player && game.players[i].countCards("h") > 1) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player && game.players[i].countCards("h") > 1) {
							list.push(game.players[i]);
						}
					}
					list.sort(lib.sort.seat);
					event.list = list;
					"step 1";
					if (event.list.length) {
						var current = event.list.shift();
						current.damage(2);
						player.line(current, "green");
						event.redo();
					}
				},
			},
			paladin_tuxi: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					var leader = player.getLeader();
					return leader.hp < leader.maxHp;
				},
				content: function () {
					"step 0";
					player.line(target, "green");
					var target = player.getLeader();
					event.target = target;
					target.judge(function (card) {
						return get.color(card) == "red" ? 1 : 0;
					});
					"step 1";
					if (result.color == "red") {
						event.target.recover();
					}
				},
			},
			paladin_huashi: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player && (game.players[i].hp != 2 || game.players[i].maxHp != 2)) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("化石：令一名随从的体力值及体力上限变为2", function (card, playerx, target) {
						return player != target && target.isMin() && (target.hp != 2 || target.maxHp != 2);
					}).ai = function (target) {
						if (target.hp == 2 && target.maxHp > 2) {
							return (get.attitude(event.chooser, target) * (2 - target.maxHp)) / 100;
						}
						return get.attitude(event.chooser, target) * (2 - target.hp);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						result.targets[0].hp = 2;
						result.targets[0].maxHp = 2;
						result.targets[0].update();
					}
				},
			},
			paladin_baowei: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i] != player && game.players[i].isMin()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("保卫：令一名友方随从获得1点护甲", function (card, playerx, target) {
						return player != target && player.side == target.side && target.isMin();
					}).ai = function (target) {
						return get.attitude(event.chooser, target);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						result.targets[0].changeHujia();
					}
				},
			},
			paladin_miying: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var target = player.getEnemy();
					var added = [];
					for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
						if (get.type(ui.cardPile.childNodes[i]) == "delay") {
							var name = ui.cardPile.childNodes[i].name;
							if (!added.includes(name) && !target.hasJudge(name)) {
								target.addJudge(ui.cardPile.childNodes[i]);
								added.add(name);
							}
						}
					}
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						if (get.type(ui.discardPile.childNodes[i]) == "delay") {
							var name = ui.discardPile.childNodes[i].name;
							if (!added.includes(name) && !target.hasJudge(name)) {
								target.addJudge(ui.discardPile.childNodes[i]);
								added.add(name);
							}
						}
					}
					if (added.length) {
						player.line(target, "green");
					}
				},
			},

			mage_yufa: {
				trigger: { global: "useSkillAfter" },
				forced: true,
				filter: function (event, player) {
					return event.career && event.player.side == player.side;
				},
				content: function () {
					trigger.player.actused--;
					trigger.player.updateActCount();
				},
			},
			mage_pingxu: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].stonehidden) {
							continue;
						}
						if (lib.card[i].type == "stonecard") {
							list.push(i);
						}
					}
					list = list.randomGets(3);
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						cards.push(game.createCard(list[i]));
					}
					player.getLeader().chooseCardButton(cards, "选择一张法术加入手牌", true);
					"step 1";
					player.getLeader().gain(result.links, "draw");
				},
			},
			mage_gushou: {
				trigger: { global: "damageBegin" },
				forced: true,
				filter: function (event, player) {
					if (event.num <= 1) {
						return false;
					}
					return event.player == player.getLeader();
				},
				priority: -11,
				content: function () {
					trigger.num = 1;
				},
			},
			mage_jili: {
				trigger: { global: "useSkillAfter" },
				forced: true,
				filter: function (event, player) {
					return event.career && event.player.side == player.side;
				},
				content: function () {
					player.draw();
				},
			},
			mage_aoshu: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().gain(game.createCard("spell_aoshuzhihui"), "gain2");
				},
			},
			mage_yanshu: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getLeader().countCards("e") > 0 && player.getEnemy().hasFellow();
				},
				content: function () {
					"step 0";
					var num = player.getLeader().countCards("e");
					var map = [];
					var targets = player.getEnemy().getFellow();
					event.targets = targets;
					for (var i = 0; i < targets.length; i++) {
						map.push(0);
					}
					for (var i = 0; i < num; i++) {
						map[Math.floor(Math.random() * map.length)]++;
					}
					event.num = 0;
					event.map = map;
					"step 1";
					var targets = event.targets;
					if (event.num < targets.length) {
						if (event.map[event.num]) {
							player.line(targets[event.num], "fire");
							targets[event.num].damage(event.map[event.num], "fire");
						}
						event.num++;
						event.redo();
					}
				},
			},

			druid_juhuo: {
				trigger: { global: "dieAfter" },
				filter: function (event, player) {
					return event.player.isMin() && _status.currentPhase == player.getLeader();
				},
				unique: true,
				content: function () {
					var target = player.getLeader();
					target.actused--;
					target.updateActCount();
					player.line(target, "green");
				},
			},
			druid_yeyou: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					game.asyncDraw([player.getLeader(), player.getEnemy()], 1, { drawDeck: 1 });
				},
			},
			druid_chicheng: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					var target = player.getLeader();
					return _status.currentPhase == target && target.countFellow() > 1;
				},
				content: function () {
					var target = player.getLeader();
					var num = target.countFellow();
					if (num > 1) {
						target.actused -= num - 1;
						target.updateActCount();
					}
				},
			},
			druid_qicheng: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addSkill("druid_qicheng2");
				},
				ai: {
					threaten: 0.8,
				},
			},
			druid_qicheng2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player.hasSkill("druid_qicheng");
				},
				content: function () {
					game.delay();
					var list = [];
					for (var i in lib.character) {
						if (lib.character[i].isFellowInStoneMode && !lib.character[i].isHiddenInStoneMode && lib.character[i].extraModeData && lib.character[i].extraModeData[0] == 1) {
							list.push(i);
						}
					}
					player.addFellowAuto(list.randomGet());
					player.removeSkill("druid_qicheng2");
				},
			},
			druid_renya: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					player.getLeader().chooseControl("冲锋", "潜行").ai = function () {
						if (Math.random() < 0.5) {
							return "潜行";
						}
						return "冲锋";
					};
					"step 1";
					if (result.control == "潜行") {
						player.maxHp++;
						player.hp++;
						player.update();
						player.tempHide();
					} else {
						player.draw();
						player.addSkill("stone_chongfeng");
						if (player.isTurnedOver()) {
							player.turnOver();
						}
					}
				},
			},
			druid_yuehuo: {
				trigger: { global: "damageBegin" },
				forced: true,
				unique: true,
				filter: function (event) {
					return event.card && get.type(event.card) == "trick" && event.notLink();
				},
				content: function () {
					trigger.num++;
				},
			},

			shaman_anhun: {
				trigger: { global: "dieAfter" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.player.side == player.side;
				},
				content: function () {
					player.line(player.getLeader(), "green");
					player.getLeader().drawDeck();
				},
			},
			shaman_zoushi: {
				trigger: { global: "useCardAfter" },
				direct: true,
				unique: true,
				filter: function (event, player) {
					return get.type(event.card) == "stonecharacter" && event.player == player.getLeader();
				},
				content: function () {
					if (!player.storage.shaman_zoushi) {
						player.storage.shaman_zoushi = true;
					} else {
						var list = [];
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].side != player.side) {
								list.push(game.players[i]);
							}
						}
						var target = list.randomGet();
						player.line(target, "green");
						target.damage();
						game.delay();
						player.logSkill("shaman_zoushi");
					}
				},
				ai: {
					threaten: 1.3,
				},
			},
			shaman_zhuhuo: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					player.draw(Math.ceil(Math.random() * 3));
				},
			},
			shaman_peiyu: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					var fellows = player.getLeader().getFellow();
					for (var i = 0; i < fellows.length; i++) {
						if (fellows[i].hasSkill("shaman_tuteng")) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var num = 0;
					var fellows = player.getLeader().getFellow();
					for (var i = 0; i < fellows.length; i++) {
						if (fellows[i].hasSkill("shaman_tuteng")) {
							num++;
						}
					}
					player.maxHp += num;
					player.hp += num;
					player.update();
				},
			},
			shaman_huoli: {
				trigger: { global: "phaseUseBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.player.career && player.side == event.player.side;
				},
				content: function () {
					player.line(trigger.player, "green");
					trigger.player.actused--;
					trigger.player.updateActCount();
				},
				ai: {
					threaten: 1.5,
				},
			},

			warlock_fushishu: {
				trigger: { player: "phaseAfter" },
				forced: true,
				mark: true,
				intro: {
					content: "下个回合结束后死亡",
				},
				content: function () {
					player.die();
				},
				ai: {
					threaten: 0.1,
				},
			},

			paladin_zhengqianghaosheng: {
				trigger: { player: "phaseBegin" },
				forced: true,
				mark: true,
				intro: {
					content: "在你的下一准备阶段，令所有友方随从增加1点体力和体力上限并摸一张牌",
				},
				content: function () {
					player.removeSkill("paladin_zhengqianghaosheng");
					var list = player.getFellow();
					for (var i = 0; i < list.length; i++) {
						list[i].maxHp++;
						list[i].hp++;
						list[i].update();
					}
					game.asyncDraw(list);
				},
			},
			paladin_zhihuizhufu: {
				trigger: { player: "phaseBegin" },
				forced: true,
				mark: true,
				intro: {
					content: function (storage) {
						return "准备阶段，" + get.translation(storage) + "从牌库中获得一张牌";
					},
				},
				filter: function (event, player) {
					return game.players.includes(player.storage.paladin_zhihuizhufu);
				},
				content: function () {
					player.storage.paladin_zhihuizhufu.drawDeck();
				},
			},

			priest_kuaisuzhiliao: {
				mark: true,
				intro: {
					content: "本回合手牌上限-1",
				},
				marktext: "治",
				mod: {
					maxHandcard: function (player, num) {
						return num - 1;
					},
				},
			},
			priest_anyingxingtai: {
				intro: {
					content: function (storage, player) {
						return "职业技能改为造成" + get.cnNumber(player.storage.anyingxingtai) + "点伤害";
					},
				},
			},
			hunter_tanxianmao: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				mark: true,
				marktext: "帽",
				intro: {
					content: "你死亡时，将一张探险帽置入主将的手牌",
				},
				content: function () {
					player.getLeader().addSkill("hunter_tanxianmao2");
				},
			},
			hunter_tanxianmao2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player.hasSkill("hunter_tanxianmao");
				},
				content: function () {
					player.gain(game.createCard("spell_tanxianmao"), "gain2");
					player.removeSkill("hunter_tanxianmao2");
				},
			},
			rogue_zhumo: {
				trigger: { player: "discardAfter" },
				filter: function (event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) == "d") {
							if (event.cards[i].name == "spell_zhumo") {
								return true;
							}
						}
					}
					return false;
				},
				forced: true,
				popup: false,
				content: function () {
					"step 0";
					event.num = 0;
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i]) == "d") {
							if (trigger.cards[i].name == "spell_zhumo") {
								event.num++;
							}
						}
					}
					event.target = player.getEnemy();
					"step 1";
					if (event.num-- && event.target.canAddFellow()) {
						event.target.addFellowAuto("stone_zhumo");
						event.redo();
					}
				},
			},

			druid_conglinzhihun: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				mark: true,
				intro: {
					content: "你死亡后，召唤一个树人",
				},
				content: function () {
					player.getLeader().addSkill("druid_conglinzhihun2");
				},
				ai: {
					threaten: 0.8,
				},
			},
			druid_conglinzhihun2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player.hasSkill("druid_conglinzhihun");
				},
				content: function () {
					game.delay();
					player.addFellowAuto("stone_shurenx");
					player.removeSkill("druid_conglinzhihun2");
				},
			},
			shaman_xianzuzhishi: {
				mark: true,
				intro: {
					content: "本回合手牌上限-1",
				},
				marktext: "祖",
				mod: {
					maxHandcard: function (player, num) {
						return num - 1;
					},
				},
			},
			shaman_xianzuzhihun: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				mark: true,
				intro: {
					content: "你死亡后，召唤一个自身的复制",
				},
				marktext: "魂",
				content: function () {
					var target = player.getLeader();
					target.addSkill("shaman_xianzuzhihun2");
					target.storage.shaman_xianzuzhihun = player.name;
				},
				ai: {
					threaten: 0.5,
				},
			},
			shaman_xianzuzhihun2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					if (!player.storage.shaman_xianzuzhihun) {
						return false;
					}
					return event.player.hasSkill("shaman_xianzuzhihun");
				},
				content: function () {
					game.delay();
					player.addFellowAuto(player.storage.shaman_xianzuzhihun);
					player.removeSkill("shaman_xianzuzhihun2");
					delete player.storage.shaman_xianzuzhihun;
				},
			},

			shaman_fengnu: {
				unique: true,
				trigger: { player: "phaseAfter" },
				forced: true,
				mark: true,
				intro: {
					content: "结合结束后，你获得一个额外的回合",
				},
				filter: function (event, player) {
					return event.parent.name != "shaman_fengnu";
				},
				content: function () {
					player.phase();
				},
				ai: {
					order: -10,
					result: {
						target: 2,
					},
					threaten: 1.5,
				},
			},
			shaman_shihuawuqi: {
				trigger: { player: "phaseBegin" },
				forced: true,
				content: function () {
					player.draw(3);
				},
				mark: true,
				intro: {
					content: "准备阶段，摸三张牌",
				},
				group: "shaman_shihuawuqi2",
			},
			shaman_shihuawuqi2: {
				trigger: { global: "phaseBegin" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player == player.getLeader();
				},
				content: function () {
					player.removeSkill("shaman_shihuawuqi");
				},
			},
			mage_hanbingpingzhang: {
				trigger: { player: ["damageBegin", "loseHpBegin"] },
				forced: true,
				unique: true,
				priority: -55,
				mark: true,
				filter: function (event, player) {
					return player.hp - event.num < 2;
				},
				content: function () {
					trigger.num = player.hp - 2;
				},
				intro: {
					content: "体力值不能降至2以内",
				},
				marktext: "屏",
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
								if (target.hp <= 2) {
									return 0;
								}
							}
						},
					},
				},
				group: "mage_hanbingpingzhang2",
			},
			mage_hanbingpingzhang2: {
				trigger: { global: "phaseBegin" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player == player.getLeader();
				},
				content: function () {
					player.removeSkill("mage_hanbingpingzhang");
				},
			},
			spell_modaoyou: {
				intro: {
					content: function (storage) {
						return "下次剑刃乱舞的伤害+" + storage;
					},
				},
			},
			hunter_jiewang2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player.hasSkill("hunter_jiewang");
				},
				content: function () {
					player.gain(game.createCard(lib.beastList.randomGet() + "_stonecharacter"), "draw");
					player.removeSkill("hunter_jiewang2");
				},
			},
			hunter_zidanshangtang: {
				trigger: { player: "useCard" },
				forced: true,
				mark: true,
				intro: {
					content: "每当你使用一张法术牌，便随机获得一张猎人职业法术牌",
				},
				filter: function (event) {
					return get.type(event.card) == "stonecard";
				},
				content: function () {
					var list = ["spell_lierenyinji", "spell_guanmenfanggou", "spell_duochongsheji", "spell_kuaisusheji", "spell_zhaohuanchongwu"];
					player.gain(game.createCard(list.randomGet()), "draw");
				},
			},
			spell_yemanpaoxiao: {
				mark: true,
				intro: {
					content: "友方角色造成的伤害+1",
				},
				global: "spell_yemanpaoxiao2",
			},
			spell_yemanpaoxiao2: {
				trigger: { source: "damageBegin" },
				forced: true,
				filter: function (event, player) {
					return player.getLeader().hasSkill("spell_yemanpaoxiao") && event.notLink();
				},
				content: function () {
					trigger.num++;
				},
			},
			stone_zibao: {
				trigger: { player: "phaseAfter" },
				forced: true,
				content: function () {
					player.die();
				},
			},
			spell_sijidaifa: {
				trigger: { player: "useCard" },
				forced: true,
				filter: function (event, player) {
					return get.type(event.card) == "stonecard";
				},
				mark: true,
				intro: {
					content: "使用下一张法术牌时获得X点行动值，X为该法术的行动值消耗且不超过3",
				},
				content: function () {
					var num = lib.card[trigger.card.name].stoneact;
					if (num > 3) {
						num = 3;
					}
					player.actused -= num;
					player.updateActCount();
					player.removeSkill("spell_sijidaifa");
				},
			},
			shaman_qingwa: {
				trigger: { player: "phaseDrawBefore" },
				forced: true,
				unique: true,
				popup: false,
				content: function () {
					trigger.cancel();
				},
				ai: {
					threaten: 0.1,
				},
			},
			stone_jingxiang: {
				trigger: { player: "phaseDrawBefore" },
				forced: true,
				unique: true,
				popup: false,
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: function (card) {
							if (card.name == "bingliang") {
								return [0, 0];
							}
						},
					},
					noPhaseDelay: 1,
				},
			},
			mage_mianyang: {
				mod: {
					cardEnabled: function (card) {
						if (card.name == "sha") {
							return false;
						}
					},
				},
				ai: {
					threaten: 0.1,
				},
			},
			priest_xundao: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getLeader().countCards("h", { type: "stonecharacter" }) > 0;
				},
				content: function () {
					player.draw();
					player.addSkill("lschaofeng");
				},
			},
			priest_guangyao: {
				trigger: { player: "changeHp" },
				forced: true,
				unique: true,
				filter: function (event) {
					return event.num != 0;
				},
				content: function () {
					player.draw(Math.abs(trigger.num));
				},
			},
			priest_zhufu: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side == player.side && game.players[i] != player) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side == player.side && game.players[i] != player) {
							list.push(game.players[i]);
						}
					}
					var target = list.randomGet();
					player.line(target, "green");
					target.maxHp++;
					target.hp++;
					target.update();
				},
			},
			priest_hunwu: {
				unique: true,
			},
			priest_faxian: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].stonehidden) {
							continue;
						}
						if (lib.card[i].type == "stonecharacter") {
							list.push(i);
						}
					}
					list = list.randomGets(3);
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						cards.push(game.createCard(list[i]));
					}
					player.getLeader().chooseCardButton(cards, "选择一个随从加入手牌", true);
					"step 1";
					player.getLeader().gain(result.links, "draw");
				},
			},
			priest_shengliao: {
				trigger: { global: "recoverEnd" },
				forced: true,
				unique: true,
				filter: function (event) {
					return event.player.isMin();
				},
				content: function () {
					player.getLeader().drawDeck();
				},
			},
			priest_shengguang: {
				trigger: { global: "recoverEnd" },
				forced: true,
				unique: true,
				filter: function (event) {
					return event.player.isMin();
				},
				content: function () {
					player.draw();
				},
			},
			rogue_cisha: {
				trigger: { source: "damageEnd" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.player.isAlive() && event.player.isMin();
				},
				content: function () {
					trigger.player.die({ source: player });
				},
			},
			rogue_touxi: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					var target = player.getLeader();
					return target.countCards("e") > 0;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseCardTarget({
						position: "e",
						filterTarget: function (card, player, target) {
							return player.side != target.side;
						},
						filterCard: true,
						ai1: function (card) {
							return 9 - get.value(card);
						},
						ai2: function (target) {
							return get.damageEffect(target, player, player);
						},
						prompt: "偷袭：弃置一张装备区内的牌并对一名敌方角色1点伤害",
					});
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.discard(result.cards);
						event.chooser.line(result.targets[0]);
						result.targets[0].damage(event.chooser);
					}
				},
			},
			rogue_qiancang: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side != player.side && game.players[i].hp == game.players[i].maxHp) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side != player.side && game.players[i].hp == game.players[i].maxHp) {
							list.push(game.players[i]);
						}
					}
					list.sort(lib.sort.seat);
					event.list = list;
					"step 1";
					if (event.list.length) {
						var current = event.list.shift();
						current.damage();
						player.line(current, "green");
						event.redo();
					}
				},
			},
			rogue_xunbao: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addSkill("rogue_xunbao2");
				},
			},
			rogue_xunbao2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player.hasSkill("rogue_xunbao");
				},
				content: function () {
					player.gain(game.createCard("spell_sijidaifa"), "gain2");
					player.removeSkill("rogue_xunbao2");
				},
			},
			rogue_touqie: {
				trigger: { source: "damageEnd" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().drawDeck();
				},
			},
			rogue_zhaomu: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getLeader().canAddFellow();
				},
				content: function () {
					"step 0";
					player.getLeader().addFellowAuto("stone_haidao");
					"step 1";
					player.line(result, "green");
				},
			},
			warrior_zhujia: {
				trigger: { player: "damageEnd" },
				forced: true,
				unique: true,
				content: function () {
					var leader = player.getLeader();
					leader.changeHujia();
				},
			},
			warrior_tidun: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var leader = player.getLeader();
					leader.changeHujia(2);
				},
			},
			warrior_tongling: {
				trigger: { global: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.source.side == player.side && event.source != player && event.source.countCards("h") <= 2;
				},
				content: function () {
					trigger.source.classList.remove("turnedover");
					player.line(trigger.source, "green");
				},
				ai: {
					threaten: 1.3,
				},
			},
			warrior_baoluan: {
				trigger: { global: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return event.player.isMin();
				},
				content: function () {
					player.draw();
				},
				ai: {
					threaten: 1.6,
				},
			},
			warrior_jiangong: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i].isMin()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("监工：对一名随从造成1点伤害然后令其摸两张牌", function (card, playerx, target) {
						return player != target && target.isMin();
					}).ai = function (target) {
						var att = get.attitude(event.chooser, target);
						if (target.hp == 1) {
							return -att;
						}
						if (target.hp == 2) {
							return 0;
						}
						return att;
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						game.delay();
						result.targets[0].damage(event.chooser);
						result.targets[0].draw(2);
					}
				},
			},
			warlock_yuhuo: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player) {
							list.push(game.players[i]);
						}
					}
					list.sort(lib.sort.seat);
					event.list = list;
					"step 1";
					if (event.list.length) {
						var current = event.list.shift();
						current.damage();
						player.line(current, "green");
						event.redo();
					}
				},
			},
			warlock_zaihuo: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var target = player.getLeader();
					var hs = target.getCards("h");
					if (hs.length) {
						target.discard(hs.randomGets(2));
					}
				},
			},
			warlock_yongsheng: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addSkill("warlock_yongsheng2");
				},
				ai: {
					threaten: 0.1,
				},
			},
			warlock_yongsheng2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player.hasSkill("warlock_yongsheng");
				},
				content: function () {
					game.delay();
					player.addFellowAuto("stone_kongjuzhanma");
					player.removeSkill("warlock_yongsheng2");
				},
			},
			warlock_zhaogui: {
				trigger: { player: "damageEnd" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getLeader().canAddFellow();
				},
				content: function () {
					player.getLeader().addFellowAuto("stone_xiaogui");
				},
			},
			warlock_nonghuo: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var target = player.getLeader();
					target.damage("fire");
					player.line(target, "green");
					game.delay();
				},
			},
			paladin_zhaohuan: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addSkill("paladin_zhaohuan2");
				},
			},
			paladin_zhaohuan2: {
				trigger: { player: "useCard" },
				forced: true,
				mark: true,
				intro: {
					content: "使用下一张随从牌时，获得两点行动值",
				},
				filter: function (event, player) {
					return get.type(event.card) == "stonecharacter";
				},
				content: function () {
					player.actused -= 2;
					player.updateActCount();
					player.removeSkill("paladin_zhaohuan2");
				},
			},
			paladin_shouwei: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					var leader = player.getLeader();
					return leader.hp < leader.maxHp;
				},
				content: function () {
					var leader = player.getLeader();
					leader.recover(2);
				},
			},
			paladin_chidun: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side && game.players[i].isMin() && game.players[i].countCards("he")) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("持盾：弃置对方一名随从的所有牌", function (card, playerx, target) {
						return player.side != target.side && target.isMin() && target.countCards("he") > 0;
					}).ai = function (target) {
						return target.countCards("he");
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						game.delay();
						result.targets[0].discard(result.targets[0].getCards("he"));
					}
				},
			},
			paladin_zhaochao: {
				trigger: { global: "useSkillAfter" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return event.career && event.player.side == player.side;
				},
				content: function () {
					player.draw(2);
				},
			},
			paladin_buji: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].name == "stone_xinbing" && game.players[i].side == player.side) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].name == "stone_xinbing" && game.players[i].side == player.side) {
							list.push(game.players[i]);
						}
					}
					for (var i = 0; i < list.length; i++) {
						list[i].maxHp++;
						list[i].hp++;
						list[i].update();
					}
					game.asyncDraw(list, 2);
					player.line(list, "green");
				},
			},
			paladin_hudun: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					player.changeHujia();
				},
			},
			mage_shifa: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i] != player) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var target1 = player.getLeader();
					var target2 = player.getEnemy();
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].stonehidden) {
							continue;
						}
						if (lib.card[i].type == "stonecard") {
							list.push(i);
						}
					}
					target1.gain(game.createCard(list.randomGet()));
					target2.gain(game.createCard(list.randomGet()));
					target1.$draw();
					target2.$draw();
					game.delay();
				},
			},
			mage_minghuo: {
				trigger: { global: "damageBegin" },
				forced: true,
				filter: function (event, player) {
					return event.source && event.source == player.getLeader() && event.parent.name == "_mage_skill";
				},
				content: function () {
					trigger.num++;
				},
			},
			mage_tunfa: {
				trigger: { global: "useCard" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return get.type(event.card) == "stonecard" && event.player == player.getLeader();
				},
				content: function () {
					player.draw();
				},
			},
			mage_lieyan: {
				trigger: { global: "useCardAfter" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return get.type(event.card) == "stonecard" && event.player == player.getLeader();
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side) {
							list.push(game.players[i]);
						}
					}
					var target = list.randomGet();
					player.line(target, "fire");
					target.damage("fire");
					game.delay();
				},
				ai: {
					threaten: 1.3,
				},
			},
			mage_zhufa: {
				trigger: { global: "useCard" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return get.type(event.card) == "stonecard" && event.player == player.getLeader();
				},
				content: function () {
					trigger.player.actused--;
					trigger.player.updateActCount();
				},
			},
			mage_bingdong: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return event.player.isMin() && event.player != player && !event.player.isTurnedOver();
				},
				content: function () {
					trigger.player.turnOver();
				},
			},
			hunter_xunshou: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i] != player && game.players[i].isMin()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("驯兽：选择一名己方随从增加1点体力和体力上限并摸两张牌", function (card, playerx, target) {
						return player != target && player.side == target.side && target.isMin();
					}).ai = function (target) {
						return get.attitude(event.chooser, target);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						result.targets[0].maxHp++;
						result.targets[0].hp++;
						result.targets[0].update();
						result.targets[0].draw(2);
						result.targets[0].addSkill("lschaofeng");
					}
				},
			},
			hunter_jiewang: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addSkill("hunter_jiewang2");
				},
			},
			hunter_qunxi: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var targets = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player && game.players[i].side == player.side) {
							targets.push(game.players[i]);
						}
					}
					targets.sort(lib.sort.seat);
					game.asyncDraw(targets);
				},
			},
			stone_zhiyu: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player && game.players[i].side == player.side && game.players[i].hp < game.players[i].maxHp) {
							game.players[i].recover();
						}
					}
				},
			},
			hunter_nuhou: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				content: function () {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side) {
							game.players[i].addSkill("hunter_nuhou2");
						}
					}
				},
			},
			hunter_nuhou2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				unique: true,
				filter: function (event, player) {
					return player.hasSkill("hunter_nuhou2");
				},
				content: function () {
					player.damage("nosource");
					player.removeSkill("hunter_nuhou2");
				},
			},
			stone_chongfeng: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					player.classList.remove("turnedover");
				},
			},
			druid_nuhuo: {
				trigger: { global: "useSkillAfter" },
				forced: true,
				filter: function (event, player) {
					return event.career && event.player.side == player.side;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side) {
							list.push(game.players[i]);
						}
					}
					var target = list.randomGet();
					player.line(target, "green");
					target.damage();
					game.delay();
				},
				ai: {
					threaten: 1.5,
				},
			},
			druid_huwei: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side && game.players[i].isMin()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("护卫：对一名对方随从造成1点伤害或弃置其所有牌并将其体力上限改为1", function (card, playerx, target) {
						return player.side != target.side && target.isMin();
					}).ai = function (target) {
						return Math.max(1, 10 - target.hp);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						event.chooser.chooseControl("造成伤害", "discard_card").ai = function () {
							if (event.target.hp > 1) {
								return "discard_card";
							}
							return "造成伤害";
						};
						event.chooser.line(event.target);
						game.delay();
					} else {
						event.finish();
					}
					"step 2";
					if (result.control == "造成伤害") {
						event.target.damage(event.chooser);
					} else {
						event.target.discard(event.target.getCards("h"));
						if (event.target.maxHp > 2) {
							event.target.loseMaxHp(event.target.maxHp - 2);
						}
					}
				},
			},
			druid_yexingchengzhang: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				mark: true,
				intro: {
					content: "下个出牌阶段开始时获得三点额外行动值",
				},
				content: function () {
					player.actused -= 3;
					player.updateActCount();
					player.removeSkill("druid_yexingchengzhang");
				},
			},
			druid_ziyang: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				mark: true,
				intro: {
					content: "下个出牌阶段开始时获得四点额外行动值",
				},
				content: function () {
					player.actused -= 4;
					player.updateActCount();
					player.removeSkill("druid_ziyang");
				},
			},
			druid_chengzhang: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var target = player.getLeader();
					target.actused--;
					target.updateActCount();
				},
				group: "druid_chengzhang2",
			},
			druid_chengzhang2: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addSkill("druid_chengzhang3");
				},
			},
			druid_chengzhang3: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player.hasSkill("druid_chengzhang");
				},
				content: function () {
					if (player.countCards("h")) {
						game.delay();
						player.chooseToDiscard("h", true);
					}
					player.removeSkill("druid_chengzhang3");
				},
			},
			shaman_xueju: {
				trigger: { global: "useCard" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return get.type(event.card) == "stonecharacter" && event.player == player.getLeader();
				},
				content: function () {
					player.draw();
				},
			},
			shaman_huoxi: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side && game.players[i].isMin()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("火袭：对一名对方随从造成2点伤害", function (card, playerx, target) {
						return player.side != target.side && target.isMin();
					}).ai = function (target) {
						return Math.max(1, 10 - target.hp);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						game.delay();
						result.targets[0].damage(2, "fire", event.chooser);
					}
				},
			},
			shaman_fachao: {
				trigger: { global: "phaseEnd" },
				forced: true,
				filter: function (event, player) {
					return event.player.career && player.side == event.player.side && event.player.isAlive();
				},
				content: function () {
					trigger.player.drawDeck();
					trigger.player.recover();
				},
			},
			shaman_jili: {
				trigger: { global: "phaseEnd" },
				forced: true,
				filter: function (event, player) {
					if (event.player.career && player.side == event.player.side) {
						for (var i = 0; i < game.players.length; i++) {
							if (!game.players[i].career && game.players[i].hasSkill("shaman_tuteng") && game.players[i].side == player.side) {
								return true;
							}
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (!game.players[i].career && game.players[i].hasSkill("shaman_tuteng") && game.players[i].side == player.side) {
							list.push(game.players[i]);
						}
					}
					if (list.length) {
						game.asyncDraw(list);
					}
				},
			},
			shaman_huoshe: {
				trigger: { global: "damageBegin" },
				forced: true,
				filter: function (event, player) {
					return event.source && event.source != player && event.source.isMin() && player.side == event.source.side && event.notLink();
				},
				content: function () {
					trigger.num++;
				},
				ai: {
					threaten: 1.8,
				},
			},
			_priest_skill: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.career != "priest") {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					if (player.storage.anyingxingtai) {
						return false;
					}
					return true;
				},
				usable: 1,
				prompt: function (event) {
					if (event.player.hasFellowSkill("priest_hunwu")) {
						return "令目标失去1点体力";
					}
					return "回复1点体力";
				},
				filterTarget: function (card, player, target) {
					if (player.hasFellowSkill("priest_hunwu")) {
						return true;
					}
					return target.hp < target.maxHp;
				},
				content: function () {
					player.actused += 2;
					player.updateActCount();
					event.parent.career = "priest";
					var num = 1;
					if (player.hasFellowSkill("stone_shenyou")) {
						num = 2;
					}
					if (player.hasFellowSkill("priest_hunwu")) {
						target.loseHp(num);
					} else {
						target.recover(num);
					}
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							if (player.hasFellowSkill("priest_hunwu")) {
								return -1;
							}
							return get.recoverEffect(target, player, target);
						},
					},
				},
			},
			_priest_skillx: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.career != "priest") {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					if (!player.storage.anyingxingtai) {
						return false;
					}
					return true;
				},
				usable: 1,
				prompt: function (event, player) {
					return "造成" + get.cnNumber(_status.event.player.storage.anyingxingtai) + "点伤害";
				},
				filterTarget: true,
				content: function () {
					player.actused += 2;
					player.updateActCount();
					event.parent.career = "priest";
					var num = 1;
					// if(player.hasFellowSkill('stone_shenyou')){
					// 	num=2;
					// }
					target.damage(player.storage.anyingxingtai * num);
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target);
						},
					},
				},
			},
			_mage_skill: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.career != "mage") {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					return true;
				},
				usable: 1,
				line: "fire",
				filterTarget: function (card, player, target) {
					return !target.career;
				},
				content: function () {
					player.actused += 2;
					player.updateActCount();
					target.damage("fire");
					event.parent.career = "mage";
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target, "fire");
						},
					},
				},
			},
			_warlock_skill: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.hasSkill("stone_lianyu")) {
						return false;
					}
					if (player.career != "warlock") {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					return true;
				},
				usable: 1,
				content: function () {
					player.actused += 2;
					player.updateActCount();
					player.drawDeck(2);
					event.parent.career = "warlock";
				},
				ai: {
					order: 0.5,
					result: {
						player: 1,
					},
				},
			},
			_warlock_skillx: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (!player.hasSkill("stone_lianyu")) {
						return false;
					}
					if (player.career != "warlock") {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					if (!player.canAddFellow()) {
						return false;
					}
					return true;
				},
				usable: 1,
				content: function () {
					"step 0";
					player.actused += 2;
					player.updateActCount();
					event.parent.career = "warlock";
					player.addFellowAuto("stone_diyuhuox");
					"step 1";
					var num = player.storage.stone_lianyu;
					if (num && get.itemtype(result) == "player") {
						result.maxHp += num;
						result.hp += num;
						result.directgain(get.cards(num));
					}
				},
				ai: {
					order: 0.5,
					result: {
						player: 1,
					},
				},
			},
			_hunter_skill: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.career != "hunter") {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					return true;
				},
				usable: 1,
				prompt: function (event) {
					if (event.player.hasFellowSkill("hunter_juji")) {
						return "造成1点伤害";
					}
					return "对敌方主将造成1点伤害";
				},
				selectTarget: function () {
					if (_status.event.player.hasFellowSkill("hunter_juji")) {
						return 1;
					}
					return -1;
				},
				filterTarget: function (card, player, target) {
					if (player.hasFellowSkill("hunter_juji")) {
						return target != player;
					}
					return target.career && target.side != player.side;
				},
				content: function () {
					player.actused += 2;
					player.updateActCount();
					target.damage();
					event.parent.career = "hunter";
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target);
						},
					},
				},
			},
			_warrior_skill: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.hujia >= 3) {
						return false;
					}
					if (player.career != "warrior") {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					return true;
				},
				usable: 1,
				content: function () {
					player.actused += 2;
					player.updateActCount();
					player.changeHujia(1);
					event.parent.career = "warrior";
				},
				ai: {
					order: 2,
					result: {
						player: 1,
					},
				},
			},
			_rogue_skill: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.career != "rogue") {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					return true;
				},
				usable: 1,
				content: function () {
					"step 0";
					player.actused += 2;
					player.updateActCount();
					var equip1 = get.cardPile(function (card) {
						return get.subtype(card) == "equip1";
					});
					if (!equip1) {
						equip1 = game.createCard("qingnang");
					}
					var equip4 = get.cardPile(function (card) {
						return get.type(card) == "equip" && get.subtype(card) != "equip1";
					});
					if (!equip4) {
						equip4 = game.createCard("chitu");
					}
					player.$gain(equip1);
					setTimeout(function () {
						player.$gain(equip4);
					}, 250);
					game.delay();
					event.equip1 = equip1;
					event.equip4 = equip4;
					"step 1";
					player.equip(event.equip1);
					game.delay(0.5);
					"step 2";
					player.equip(event.equip4);
					event.parent.career = "rogue";
				},
				ai: {
					order: function (skill, player) {
						if (!player.getEquip(1) && player.countCards("e") < 2) {
							if (player.countCards("h", "sha") && player.getActCount() + 3 <= player.actcount) {
								return 4;
							}
							return 0.1;
						}
						return 0;
					},
					result: {
						player: function (player) {
							if (player.countCards("e") <= 2) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			_druid_skill: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.career != "druid") {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					return lib.filter.cardEnabled({ name: "sha" }, player);
				},
				usable: 1,
				filterTarget: function (card, player, target) {
					return player.canUse("sha", target, null, false);
				},
				direct: true,
				content: function () {
					player.actused += 2;
					player.updateActCount();
					player.useCard({ name: "sha" }, targets, "_druid_skill", false).animate = false;
					event.parent.career = "druid";
				},
				ai: {
					order: function () {
						return get.order({ name: "sha" }) - 0.1;
					},
					result: {
						target: function (player, target) {
							return get.effect(target, { name: "sha" }, player, target);
						},
					},
				},
			},
			shaman_tuteng: {
				trigger: { player: "phaseDrawBefore" },
				forced: true,
				popup: false,
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: function (card) {
							if (card.name == "bingliang") {
								return [0, 0];
							}
						},
					},
					noPhaseDelay: 1,
				},
			},
			shaman_zhiliao: {
				trigger: { player: "phaseEnd" },
				forced: true,
				direct: true,
				content: function () {
					"step 0";
					var players = get.players();
					var targets = [];
					for (var i = 0; i < players.length; i++) {
						if (players[i].side == player.side && !players[i].career && players[i].hp < players[i].maxHp) {
							targets.push(players[i]);
							players[i].recover();
						}
					}
					if (targets.length) {
						player.logSkill("shaman_zhiliao");
					} else {
						event.finish();
					}
					"step 1";
					game.delay();
				},
				ai: {
					threaten: 2,
				},
			},
			shaman_fali_old: {
				trigger: { global: "phaseEnd" },
				forced: true,
				direct: true,
				filter: function (event, player) {
					return event.player == player.getLeader();
				},
				content: function () {
					"step 0";
					var players = get.players();
					var targets = [];
					for (var i = 0; i < players.length; i++) {
						if (players[i].side == player.side && !players[i].career && players[i].countCards("h") <= 1) {
							targets.push(players[i]);
						}
					}
					if (targets.length) {
						game.asyncDraw(targets);
						player.logSkill("shaman_fali");
					} else {
						event.finish();
					}
					"step 1";
					game.delay();
				},
			},
			shaman_zhuore: {
				trigger: { global: "phaseEnd" },
				forced: true,
				direct: true,
				filter: function (event, player) {
					return event.player == player.getLeader();
				},
				content: function () {
					"step 0";
					var players = get.players();
					var targets = [];
					for (var i = 0; i < players.length; i++) {
						if (players[i].side != player.side && !players[i].career) {
							targets.push(players[i]);
						}
					}
					if (targets.length) {
						var target = targets.randomGet();
						player.logSkill("shaman_zhuore", target);
						target.damage();
					} else {
						event.finish();
					}
					"step 1";
					game.delay();
				},
			},
			_shaman_skill: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.career != "shaman") {
						return false;
					}
					if (!player.canAddFellow()) {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					return true;
				},
				usable: 1,
				content: function () {
					player.actused += 2;
					player.updateActCount();
					var name = "stone_tuteng" + Math.ceil(Math.random() * 4);
					player.addFellowAuto(name);
					event.parent.career = "shaman";
				},
				ai: {
					order: 2,
					result: {
						player: 1,
					},
				},
			},
			_paladin_skill: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.career != "paladin") {
						return false;
					}
					if (!player.canAddFellow()) {
						return false;
					}
					if (player.getActCount() + 2 > player.actcount) {
						return false;
					}
					return true;
				},
				usable: 1,
				content: function () {
					player.actused += 2;
					player.updateActCount();
					player.addFellowAuto("stone_xinbing");
					event.parent.career = "paladin";
				},
				ai: {
					order: 2,
					result: {
						player: 1,
					},
				},
			},
			lschaofeng: {
				mark: true,
				intro: {
					content: "已获得嘲讽",
				},
			},
			_lschaofeng: {
				mod: {
					targetEnabled: function (card, player, target) {
						if (target.hasSkill("lschaofeng")) {
							return;
						}
						if (card.name == "sha") {
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].side == target.side && game.players[i].hasSkill("lschaofeng")) {
									return false;
								}
							}
						}
					},
				},
			},
			spell_anyingkuangluan_die: {
				trigger: { player: "phaseAfter" },
				forced: true,
				unique: true,
				content: function () {
					player.die();
				},
			},
			stone_juxingchanchu1: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side && game.players[i].isMin()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("毒液：令一名敌方随从失去1点体力", function (card, playerx, target) {
						return player.side != target.side && target.isMin();
					}).ai = function (target) {
						return Math.max(1, 10 - target.hp);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						game.delay();
						result.targets[0].addSkill("stone_juxingchanchu2");
					}
				},
			},
			stone_juxingchanchu2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				unique: true,
				filter: function (event, player) {
					return player.hasSkill("stone_juxingchanchu2");
				},
				content: function () {
					player.loseHp();
					player.removeSkill("stone_juxingchanchu2");
				},
			},
			stone_shishigui1: {
				trigger: { player: "dieBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i].isMin()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player) {
							game.players[i].addSkill("stone_shishigui2");
						}
					}
				},
			},
			stone_shishigui2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				unique: true,
				filter: function (event, player) {
					return player.hasSkill("stone_shishigui2");
				},
				content: function () {
					player.loseHp();
					player.removeSkill("stone_shishigui2");
				},
			},
			stone_fennuxiaoji1: {
				trigger: { player: "phaseBegin" },
				filter: function (event, player) {
					return player.countCards("h") == 0;
				},
				content: function () {
					player.draw(2);
				},
			},
			stone_fatiaozhuru1: {
				trigger: { player: "phaseEnd" },
				filter: function (event, player) {
					return player.countCards("h") == 0;
				},
				content: function () {
					player.draw(2);
				},
			},
			stone_qianxing: {
				trigger: { source: "fellow" },
				silent: true,
				unique: true,
				content: function () {
					player.tempHide();
				},
			},
			stone_kutongsiseng1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addSkill("stone_kutongsiseng2");
				},
			},
			stone_kutongsiseng2: {
				trigger: { player: "phaseEnd" },
				forced: true,
				content: function () {
					player.draw();
					player.removeSkill("stone_kutongsiseng2");
				},
			},
			stone_yuanguanying1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("暗影：选择敌方一名角色视为对其使用一张杀", function (card, player, target) {
						return lib.filter.targetEnabled({ name: "sha" }, event.chooser, target);
					}).ai = function (target) {
						return get.effect(target, { name: "sha" }, event.chooser);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.useCard({ name: "sha" }, result.targets, false);
					}
				},
			},
			stone_zhucangzhe1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side == player.side && game.players[i] != player) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("发明：选择己方一名角色摸一张牌", function (card, playerx, target) {
						return player != target && player.side == target.side;
					}).ai = function (target) {
						return get.attitude(event.chooser, target);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						result.targets[0].draw();
					}
				},
			},
			stone_zhongshi1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side && game.players[i].isMin() && game.players[i].countCards("he")) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("叫嚣：弃置对方一名随从的所有牌", function (card, playerx, target) {
						return player.side != target.side && target.isMin() && target.countCards("he") > 0;
					}).ai = function (target) {
						return target.countCards("he");
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						game.delay();
						result.targets[0].discard(result.targets[0].getCards("he"));
					}
				},
			},
			stone_huoqiangshou1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side != player.side && game.players[i].isMin()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.chooser = player.getLeader();
					event.chooser.chooseTarget("火枪：对一名对方随从造成1点伤害", function (card, playerx, target) {
						return player.side != target.side && target.isMin();
					}).ai = function (target) {
						return Math.max(1, 10 - target.hp);
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						game.delay();
						result.targets[0].damage(event.chooser);
					}
				},
			},
			stone_dijieshicong1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getEnemy().countCards("e") > 0;
				},
				content: function () {
					var enemy = player.getEnemy();
					var es = enemy.getCards("e");
					if (es.length) {
						player.getLeader().line(enemy);
						game.delay();
						enemy.discard(es.randomGet());
						// game.log(get.translation(event.enemy)+'将'+get.translation(es)+'收入手牌')
					}
				},
			},
			stone_yaosaishouwei1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().addTempSkill("stone_yaosaishouwei2");
				},
			},
			stone_yaosaishouwei2: {
				mod: {
					maxHandcard: function (player, num) {
						return num + 2;
					},
				},
			},
			stone_famingjia1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					player.getLeader().draw(2);
				},
			},
			stone_chilundashi1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					player.addSkill("stone_chilundashi2");
				},
			},
			stone_chilundashi2: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				content: function () {
					trigger.num++;
					player.removeSkill("stone_chilundashi2");
				},
			},
			stone_hanguangzhizhe1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var targets = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player) {
							targets.push(game.players[i]);
						}
					}
					targets.sort(lib.sort.seat);
					game.asyncDraw(targets);
				},
			},
			stone_aihaozhihun1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				content: function () {
					var targets = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side != player.side) {
							targets.push(game.players[i]);
						}
					}
					targets.sort(lib.sort.seat);
					for (var i = 0; i < targets.length; i++) {
						targets[i].discard(targets[i].getCards("he"));
					}
				},
			},
			stone_yanjingshe1: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					var num = player.getEnemy().countFellow();
					return num > 0 && num >= player.getLeader().countFellow();
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i].side != player.side) {
							list.push(game.players[i]);
						}
					}
					if (list.length) {
						var target = list.randomGet();
						player.line(target, "green");
						target.die({ source: player });
						game.delay();
					}
				},
			},
			stone_yanjingshe_old: {
				trigger: { source: "fellow" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.getEnemy().countFellow() >= player.getLeader().countFellow();
				},
				content: function () {
					"step 0";
					event.chooser = player.getEnemy();
					event.chooser.chooseTarget(
						"毒噬：选择己方一名随从令其死亡",
						function (card, playerx, target) {
							return target.isMin() && target.side != player.side;
						},
						true
					).ai = function (target) {
						return -target.hp;
					};
					player.line(event.chooser);
					"step 1";
					if (result.bool) {
						event.chooser.line(result.targets[0]);
						game.delay();
						result.targets[0].die();
					}
				},
			},
			stone_mafengzhuru1: {
				trigger: { player: "dieBegin" },
				forced: true,
				filter: function (event) {
					return event.source && event.source.isMin();
				},
				content: function () {
					trigger.source.addSkill("stone_mafengzhuru2");
				},
			},
			stone_mafengzhuru2: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				unique: true,
				filter: function (event, player) {
					return player.hasSkill("stone_mafengzhuru2");
				},
				content: function () {
					player.loseHp();
					player.removeSkill("stone_mafengzhuru2");
				},
			},
			stone_zhufu: {
				trigger: { global: "phaseEnd" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					if (event.player != player.getLeader()) {
						return false;
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player && game.players[i].side == player.side && game.players[i].hp < game.players[i].maxHp) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					var list = [];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMin() && game.players[i] != player && game.players[i].side == player.side && game.players[i].hp < game.players[i].maxHp) {
							list.push(game.players[i]);
						}
					}
					if (list.length) {
						var target = list.randomGet();
						target.recover();
						game.delay();
						player.line(target, "green");
					}
				},
			},
			_actcount: {
				mod: {
					cardEnabled: function (card, player) {
						if (player.isMin()) {
							return;
						}
						if (_status.currentPhase != player) {
							return;
						}
						var stoneact = get.info(card).stoneact;
						if (typeof stoneact != "number") {
							stoneact = 1;
						}
						if (player.getActCount() + stoneact > player.actcount) {
							return false;
						}
					},
				},
				trigger: { player: "phaseBegin" },
				forced: true,
				popup: false,
				priority: 15,
				filter: function (event, player) {
					return !player.isMin();
				},
				content: function () {
					player.actused = 0;
					if (player.side) {
						player.actcount = player.getEnemy().actcount + 1;
					} else {
						player.actcount = player.getEnemy().actcount;
						if (!_status.actcoin) {
							_status.actcoin = true;
							player.actused--;
						}
					}
					if (player.actcount > 6) {
						if (get.config("mana_mode") == "inc") {
							player.actcount = 6;
						} else {
							player.actcount -= 4;
						}
					}
					player.updateActCount();
					player.getEnemy().updateActCount("outphase");
				},
			},
			_actcount2: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return !player.isMin() && !event.noActCount && _status.currentPhase == player;
				},
				content: function () {
					var stoneact = get.info(trigger.card).stoneact;
					if (typeof stoneact === "number") {
						player.actused += stoneact - 1;
					}
					player.updateActCount();
				},
			},
			stonesha: {
				unique: true,
				mod: {
					cardname: function (card) {
						if (lib.card[card.name].type == "equip") {
							return "sha";
						}
					},
				},
			},
			stoneshan: {
				unique: true,
				mod: {
					cardname: function (card) {
						if (lib.card[card.name].type.indexOf("stone") == 0) {
							return "shan";
						}
					},
				},
			},
			stonedraw: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				popup: false,
				content: function () {
					trigger.num--;
				},
				ai: {
					effect: {
						target: function (card) {
							if (card.name == "bingliang") {
								return 0.6;
							}
						},
					},
				},
			},
			_stonerage1: {
				trigger: { player: "damageEnd" },
				forced: true,
				popup: false,
				content: function () {
					if (player.isMin()) {
						player.changeRage(3 * trigger.num);
					} else {
						player.changeRage(6 * trigger.num);
					}
				},
			},
			_stonerage2: {
				trigger: { player: "dieBegin" },
				forced: true,
				popup: false,
				content: function () {
					if (player.isMin()) {
						player.changeRage(10);
					} else {
						player.changeRage(20);
					}
				},
			},
			_stonerage3: {
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return !player.isMin() && player.getEnemy().countFellow() > player.countFellow();
				},
				content: function () {
					player.changeRage((player.getEnemy().countFellow() - player.countFellow()) * 10);
				},
			},
			_stonerage_add: {
				trigger: { player: "phaseBegin" },
				direct: true,
				priority: 10,
				filter: function (event, player) {
					if (!player.canAddFellow()) {
						return false;
					}
					if (player == game.me) {
						return _status.friendRage >= 100;
					} else if (player == game.me.getEnemy()) {
						return _status.enemyRage >= 100;
					}
					return false;
				},
				content: function () {
					"step 0";
					var list = [];
					var list2 = [];
					for (var i in lib.character) {
						if (lib.character[i].trashBin.includes("stonelegend_" + player.career)) {
							list.push(i);
						} else if (lib.character[i].trashBin.includes("stonelegend")) {
							list2.push(i);
						}
					}
					var dialog = ui.create.dialog("hidden", "召唤一名传说随从", '<div class="text center">消耗100怒气值和4点行动值</div>', [list.concat(list2), "character"]);
					var heilong = false;
					var dc = player.getEnemy().countFellow() - player.countFellow();
					if (dc > 2) {
						heilong = true;
					} else if (dc == 2) {
						if (player.getEnemy().countFellow() >= 3) {
							heilong = Math.random() < 0.5;
						} else if (player.actcount - player.getActCount() <= 0) {
							heilong = true;
						} else {
							dc = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].isMin() && game.players[i].side != player.side) {
									dc += game.players[i].hp;
								}
							}
							if (dc > 5) {
								heilong = true;
							} else {
								heilong = Math.random() < 0.3;
							}
						}
					}
					var honglong = false;
					if (!heilong) {
						var num = 0;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i] == player) {
								num += 1.5 * (game.players[i].maxHp - game.players[i].hp);
							} else if (game.players[i].side == player.side) {
								num += game.players[i].maxHp - game.players[i].hp;
							}
						}
						if (num > 6) {
							honglong = true;
						} else if (player.maxHp - player.hp >= 3 && player.hp <= 2) {
							honglong = true;
						}
					}
					player.chooseButton(dialog).ai = function (button) {
						if (button.link == "stone_siwangzhiyi") {
							if (heilong) {
								return 3;
							}
							return 0;
						}
						if (button.link == "stone_alaikesita") {
							if (honglong) {
								return 2;
							}
							return 0;
						}
						return Math.random();
					};
					"step 1";
					if (result.bool) {
						player.$skill(get.translation(result.links[0]), "legend", "metal");
						game.delay(2);
						event.addname = result.links[0];
						player.changeRage(-100);
						player.actused += 4;
						player.updateActCount();
					} else {
						event.finish();
					}
					"step 2";
					if (event.addname) {
						if (event.addname == "stone_jialakesi") {
							if (player.name == "stone_jialakesix") {
								player.hp = player.maxHp;
								player.update();
								player.actused -= 4;
								player.updateActCount();
								player.storage.stone_lianyu++;
							} else {
								if (player.name2) {
									player.storage.stone_lianyu = 1;
								} else {
									player.storage.stone_lianyu = 0;
								}
								player.init("stone_jialakesix");
								game.addVideo("reinit2", player, "stone_jialakesix");
							}
							player.syncStorage("stone_lianyu");
							var card = game.createCard("stone_jialakesi_stonecharacter");
							card.node.info.remove();
							card.node.addinfo.remove();
							player.$give(card, player);
						} else {
							player.addFellowAuto(event.addname);
						}
					}
				},
			},
		},
		translate: {
			shaman: "萨满",
			mage: "法师",
			priest: "牧师",
			warrior: "战士",
			warlock: "术士",
			knight: "死亡骑士",
			rogue: "潜行者",
			paladin: "圣骑士",
			hunter: "猎人",
			druid: "德鲁伊",

			stone_siwangzhiyi: "死亡之翼",
			stone_alaikesita: "阿莱克萨",
			stone_nuoziduomu: "诺兹多姆",
			stone_maligousi: "玛里苟斯",
			stone_aolajier: "奥拉基尔",
			stone_andongni: "安东尼",
			stone_jialakesi: "加拉克斯",
			stone_jialakesix: "加拉克斯",
			stone_kelushi: "克鲁什",
			stone_geluomashi: "格罗玛什",
			stone_aidewen: "艾德温",
			stone_sainaliusi: "塞纳留斯",
			stone_fuding: "弗丁",
			stone_weilun: "维纶",

			stone_fushi: "缚誓",
			stone_fushi_info: "你出场时，为所有友方角色回复所有体力值。",
			stone_mieshi: "灭世",
			stone_mieshi_info: "你出场时，对所有其他随从造成2点伤害，然后弃置己方主将的所有手牌。",
			stone_shixu: "时序",
			stone_shixu_info: "你出场的回合内，己方主将获得4点行动值。",
			stone_mowang: "魔网",
			stone_mowang_info: "己方法术对主将伤害+2，对随从伤害+4。",

			stone_zhiyin: "指引",
			stone_zhiyin_info: "每当己方主将使用一张法术牌，将一张火球术置于其手牌。",
			stone_bianshen: "变身",
			stone_bianshen_info: "你出场时，若己方主将职业为术士，则代之成为新的主将；若己变身，则改为令你召唤的地狱火的初始手牌数和体力值+1。",
			stone_lianyu: "炼狱",
			stone_lianyu_info: "你的职业技能改为召唤一个地狱火。",
			stone_lianji: "连击",
			stone_lianji_info: "每当己方主将召唤一个随从，便增加1点体力和体力上限并摸一张牌。",
			stone_shenyu: "神谕",
			stone_shenyu_info: "你出场时，己方主将可以选择一项：召唤两个嘲讽树人，或令所有其他随从增加1点体力和体力上限并摸两张牌。",
			stone_fuchou: "复仇",
			stone_fuchou_info: "你死亡后，视为己方主将使用了一张复仇之怒。",
			stone_shenyou: "神佑",
			stone_shenyou_info: "己方主将的职业技能和法术的治疗效果翻倍。",
			stone_jinu: "激怒",
			stone_jinu_info: "摸牌阶段，若你己受伤，则额外摸两张牌。",

			spell_shenshengxinxing: "神圣新星",
			spell_shenshengxinxing_info: "对所有敌方角色造成1点伤害，令所有友方角色回复1点体力。",
			spell_shengguangzhadan: "圣光炸弹",
			spell_shengguangzhadan_info: "对所有随从造成等同于其手牌数的伤害。",
			spell_maizang: "埋葬",
			spell_maizang_info: "令一名敌方随从死亡（不触发死亡技能），并将一张与该随从同名的随从洗入你的牌库。",
			spell_xinlingshijie: "心灵视界",
			spell_xinlingshijie_info: "将一张敌方主将手牌的复制置于你的手牌。",
			spell_naluzhiguang: "纳鲁之光",
			spell_naluzhiguang_info: "恢复1点体力值，若目标仍处于受伤状态，则召唤一名圣光护卫。",
			spell_zhiliaozhihuan: "治疗之环",
			spell_zhiliaozhihuan_info: "令所有随从回复3点体力。",

			spell_zhenyanshu: "真言术",
			spell_zhenyanshu_info: "令一名随从增加1点体力和体力上限；从牌库中获得一张牌。",
			spell_enzeshu: "恩泽术",
			spell_enzeshu_info: "令一名随从增加3点体力和体力上限。",
			spell_anyingxingtai: "暗影形态",
			priest_anyingxingtai: "暗影形态",
			spell_anyingxingtai_info: "你的职业技能改为造成1点伤害，若已进入暗影形态，则改为造成2点伤害。",
			spell_kuaisuzhiliao: "快速治疗",
			spell_kuaisuzhiliao_info: "回复2点体力。",
			spell_xinlinghanbao: "心灵撼爆",
			spell_xinlinghanbao_info: "对敌方主将造成2点伤害。",
			spell_kongxinshu: "控心术",
			spell_kongxinshu_info: "复制敌方牌库中的一张随从，将其置入战场。",

			stone_shengguanghuwei: "圣光护卫",
			priest_shengguang: "圣光",
			priest_shengguang_info: "每当一名随从获得治疗，摸一张牌。",

			spell_nuxi: "怒袭",
			spell_nuxi_info: "造成1点伤害，获得2点护甲。",
			spell_dunpaimengji: "盾牌猛击",
			spell_dunpaimengji_info: "对一名随从造成等同于你护甲值的伤害。",
			spell_zhansha: "斩杀",
			spell_zhansha_info: "令一名已受伤的敌方随从死亡。",
			spell_nuhuozhongshao: "怒火中烧",
			spell_nuhuozhongshao_info: "对一名随从造成1点伤害，然后令其摸两张牌。",
			spell_xuanfengzhan: "旋风斩",
			spell_xuanfengzhan_info: "对所有随从造成1点伤害。",
			spell_juemingluandou: "绝命乱斗",
			spell_juemingluandou_info: "随机保留一名随从，然后令所有其他随从死亡。",

			spell_zhongnian: "重碾",
			spell_zhongnian_info: "造成X点伤害，X为已受伤的友方角色数且不超过3。",
			spell_zhandounuhuo: "战斗怒火",
			spell_zhandounuhuo_info: "从牌库中获得X张牌，X为已受伤的友方角色数。",
			spell_chongfeng: "冲锋",
			spell_chongfeng_info: "令一名武将牌背面朝上的友方随从摸三张牌，然后将武将牌翻至正面。",
			spell_fuchoudaji: "复仇打击",
			spell_fuchoudaji_info: "对所有随从造成1点伤害，若你的体力值不大于2，改为造成3点伤害。",
			spell_kuangbao: "狂暴",
			spell_kuangbao_info: "令一名已受伤的友方随从摸四张牌。",
			spell_yingyongdaji: "英勇打击",
			spell_yingyongdaji_info: "令一名敌方角色对你造成2点伤害，然后对其造成2点伤害。",

			spell_dubiao: "毒镖",
			spell_dubiao_info: "对一名随机敌方角色造成1点伤害。",
			spell_qiangfengsheji: "强风射击",
			spell_qiangfengsheji_info: "对两名敌方随从各造成1点伤害，并弃置其两张手牌。",
			spell_tanxianmao: "探险帽",
			hunter_tanxianmao: "探险帽",
			hunter_tanxianmao_info: "你死亡时，将一张探险帽置入主将的手牌。",
			spell_tanxianmao_info: "令一名友方随从增加1点体力和体力上限并摸一张牌，当该随从死亡时，将一张探险帽置入你的手牌。",
			spell_shalumingling: "杀戮命令",
			spell_shalumingling_info: "造成1点伤害，如果你控制任何野兽，则改为造成2点伤害。",
			spell_zhuizongshu: "追踪术",
			spell_zhuizongshu_info: "从牌库中随机选择三张牌，获得其中的一张。",
			spell_tianjiangzhuqun: "天降蛛群",
			spell_tianjiangzhuqun_info: "召唤三只结网蛛。",

			spell_lierenyinji: "猎人印记",
			spell_lierenyinji_info: "将一名随从的体力上限降至1。",
			spell_kuaisusheji: "快速射击",
			spell_kuaisusheji_info: "造成1点伤害，摸一张牌。",
			spell_guanmenfanggou: "关门放狗",
			spell_guanmenfanggou_info: "每有一名敌方随从，便召唤一只猎狗。",
			spell_zhaohuanchongwu: "动物伙伴",
			spell_zhaohuanchongwu_info: "随机召唤一只野兽。",
			spell_zidanshangtang: "子弹上膛",
			spell_zidanshangtang_info: "随机获得一张猎人职业法术牌，并获得技能〖上膛〗直到回合结束。",
			spell_duochongsheji: "多重射击",
			spell_duochongsheji_info: "对两名随机敌方随从各造成2点伤害。",

			stone_liegou: "猎狗",
			hunter_zidanshangtang: "上膛",
			hunter_zidanshangtang_bg: "膛",
			hunter_zidanshangtang_info: "每当你使用一张法术牌，便随机获得一张猎人职业法术牌。",

			spell_zuzhou: "诅咒",
			spell_zuzhou_info: "将目标随从翻面，摸一张牌。",
			spell_xishengqiyue: "牺牲契约",
			spell_xishengqiyue_info: "令双方各一名随从立即死亡。",
			spell_xiaoguibaopo: "小鬼爆破",
			spell_xiaoguibaopo_info: "对一名随从造成1~3点伤害，每造成1点伤害，便召唤一只小鬼。",
			spell_anyinglieyan: "暗影裂焰",
			spell_anyinglieyan_info: "杀死一名友方随从，并对所有敌方随从造成等于其体力值的伤害。",
			spell_liliangdaijia: "力量代价",
			spell_liliangdaijia_info: "令一名友方随从摸四张牌，将体力值变为5，并在其下个回合结束后死亡。",
			spell_emozhinu: "恶魔之怒",
			spell_emozhinu_info: "对所有随从造成2点伤害。",

			spell_emozhixin: "恶魔之心",
			spell_emozhixin_info: "对一名敌方随从造成4点伤害，或令一名友方随从摸四张牌。",
			spell_ansezhadan: "暗色炸弹",
			spell_ansezhadan_info: "造成2点伤害。",
			spell_fushishu: "腐蚀术",
			warlock_fushishu: "腐蚀",
			warlock_fushishu_info: "下个回合结束后死亡。",
			spell_fushishu_info: "令一名敌方随从于其下个回合结束后死亡。",
			spell_heianqiyue: "黑暗契约",
			spell_heianqiyue_info: "随机令两名敌方随从死亡，随机弃置两张手牌。",
			spell_linghunhongxi: "灵魂虹吸",
			spell_linghunhongxi_info: "令一名随从死亡，回复1点体力。",
			spell_siwangchanrao: "死亡缠绕",
			spell_siwangchanrao_info: "对一名随从造成1点伤害；若该随从死亡，从牌库中获得一张牌。",

			spell_wuyashenxiang: "乌鸦神像",
			spell_wuyashenxiang_info: "从三张法术牌或随从牌中选择一张加入手牌。",
			spell_huotigenxu: "活体根须",
			spell_huotigenxu_info: "造成1点伤害，或召唤两个树苗。",
			spell_hengsao: "横扫",
			spell_hengsao_info: "对一名敌方角色造成2点伤害，然后对其他敌方角色造成1点伤害。",
			spell_yexingchengzhang: "野性成长",
			spell_yexingchengzhang_info: "下个出牌阶段开始时获得三点额外行动值。",
			spell_ziranzhili: "自然之力",
			spell_ziranzhili_info: "召唤三个自爆树人。",
			spell_yemanpaoxiao: "野蛮咆哮",
			spell_yemanpaoxiao_bg: "咆",
			spell_yemanpaoxiao2: "咆哮",
			spell_yemanpaoxiao_info: "所有友方角色造成的伤害+1，直到你的下个回合开始。",

			spell_conglinzhihun: "丛林之魂",
			druid_conglinzhihun: "树魂",
			druid_conglinzhihun_info: "你死亡后召唤一个树人。",
			spell_conglinzhihun_info: "令所有友方随从获得技能树魂（你死亡后召唤一个树人）。",
			spell_ziyang: "滋养",
			spell_ziyang_info: "下个出牌开始阶段获得4点额外行动值，或从牌库中获得三张牌。",
			spell_fugen: "腐根",
			spell_fugen_info: "令一名随从死亡，将一张随机随从置入对手的手牌。",
			spell_xingchenzhuiluo: "星辰坠落",
			spell_xingchenzhuiluo_info: "对一名敌方随从造成5点伤害，或对所有敌方随从造成2点伤害。",
			spell_fennu: "愤怒",
			spell_fennu_info: "对一名随从造成2点伤害，或造成1点伤害并从牌库中获得一张牌。",
			spell_heiandiyu: "黑暗低语",
			spell_heiandiyu_info: "召唤若干个小精灵直到你的随从数达到4；或令一名随从增加1点体力和体力上限并摸三张牌。",

			druid_yexingchengzhang: "成长",
			druid_yexingchengzhang_bg: "长",
			druid_yexingchengzhang_info: "下个出牌阶段开始时获得三点额外行动值。",
			druid_ziyang: "滋养",
			druid_ziyang_bg: "养",
			druid_ziyang_info: "下个出牌阶段开始时获得四点额外行动值。",

			stone_shumiao: "树苗",
			stone_shuren: "自爆树人",
			stone_shurenx: "树人",
			stone_shurenxx: "嘲讽树人",
			stone_zibao: "自爆",
			stone_zibao_info: "结合结束后立即死亡。",

			spell_cigu: "刺骨",
			spell_cigu_info: "造成1点伤害，你可以弃置一张装备区内的牌令伤害+1。",
			spell_jianrenluanwu: "剑刃乱舞",
			spell_jianrenluanwu_info: "弃置你的武器牌，并对所有敌方角色造成1点伤害。",
			spell_daoshan: "刀扇",
			spell_daoshan_info: "对所有敌方随从造成1点伤害，从牌库中获得一张牌。",
			spell_sijidaifa: "伺机待发",
			spell_sijidaifa_info: "你使用下一张法术牌时获得X点行动值，X为该法术的行动值消耗且不超过3。",
			spell_cisha: "刺杀",
			spell_cisha_info: "杀死一名随从。",
			spell_modaoyou: "磨刀油",
			spell_modaoyou_info: "令你下一次剑刃乱舞造成的伤害+1，并与一名随机友方随从各摸两张牌。",

			spell_mengun: "闷棍",
			spell_mengun_info: "令一名敌方随从死亡（不触发死亡技能），将一张该随从的复制置入对手的手牌。",
			spell_anzhongpohuai: "暗中破坏",
			spell_anzhongpohuai_info: "随机杀死一名敌方随从，随机弃置敌方的一张装备牌。",
			spell_beici: "背刺",
			spell_beici_info: "令一名未受伤的随从失去1点体力。",
			spell_weijisifu: "危机四伏",
			spell_zhumo: "蛛魔",
			stone_zhumo: "蛛魔",
			spell_zhumo_info: "每当该牌被弃置，为你的对手召唤一只蛛魔。",
			spell_weijisifu_info: "将三张蛛魔牌洗入对手的牌库；每当一名角色弃置蛛魔牌，为其对手召唤一只蛛魔。",
			spell_piaoqie: "剽窃",
			spell_piaoqie_info: "复制两张对手牌库中的牌加入你的手牌。",
			spell_jipao: "疾跑",
			spell_jipao_info: "从牌库中获得四张牌。",

			spell_fengxian: "奉献",
			spell_fengxian_info: "对所有敌方角色造成1点伤害。",
			spell_fuchouzhinu: "复仇之怒",
			spell_fuchouzhinu_info: "造成5点伤害，随机分配到所有敌方随从上。",
			spell_shengliaoshu: "圣疗术",
			spell_shengliaoshu_info: "恢复2点体力，摸两张牌。",
			spell_fennuzhichui: "愤怒之锤",
			spell_fennuzhichui_info: "造成1点伤害，从牌库中获得一张牌。",
			spell_zuozhandongyuan: "作战动员",
			spell_zuozhandongyuan_info: "召唤两个新兵，随机装备一把武器。",
			spell_liliangzhufu: "力量祝福",
			spell_liliangzhufu_info: "令一名随从摸两张牌。",

			spell_jinyingduijue: "精英对决",
			spell_jinyingduijue_info: "双方各保留体力值最高的一名随从，然后令其他随从死亡。",
			spell_shenpan: "审判",
			spell_shenpan_info: "若你的对手随从数不少于你，则随机令一名敌方随从死亡。",
			spell_shenshengfennu: "神圣愤怒",
			spell_shenshengfennu_info: "从牌库中获得一张牌，并造成等同于其行动值消耗的伤害。",
			spell_yongshizhufu: "勇士祝福",
			spell_yongshizhufu_info: "令一名随从的手牌数翻倍。",
			spell_zhengqianghaosheng: "争强好胜",
			paladin_zhengqianghaosheng: "争强好胜",
			paladin_zhengqianghaosheng_info: "在你的下一准备阶段，令所有友方随从增加1点体力和体力上限并摸一张牌。",
			spell_zhengqianghaosheng_info: "在你的下一准备阶段，令所有友方随从增加1点体力和体力上限并摸一张牌。",
			spell_zhihuizhufu: "智慧祝福",
			paladin_zhihuizhufu: "智慧祝福",
			spell_zhihuizhufu_info: "选择一名随从，在其每个准备阶段，你从牌库中获得一张牌。",

			spell_fengnu: "风怒",
			shaman_fengnu: "风怒",
			shaman_fengnu_info: "回合结束后，你获得一个额外回合。",
			spell_fengnu_info: "令一名随从获得技能风怒（回合结束后，你获得一个额外回合）。",
			spell_rongyanbaolie: "熔岩爆裂",
			spell_rongyanbaolie_info: "造成3点火焰伤害，失去1点体力。",
			spell_shihuawuqi: "石化武器",
			shaman_shihuawuqi: "充能",
			shaman_shihuawuqi_info: "准备阶段，你摸三张牌。",
			spell_shihuawuqi_info: "令一名友方随从获得技能充能（准备阶段，你摸三张牌），直到你的下一回合开始。",
			spell_xianzuzhaohuan: "先祖召唤",
			spell_xianzuzhaohuan_info: "双方各将手牌中的一张随机随从牌置入战场。",
			spell_xianzuzhihun: "先祖之魂",
			shaman_xianzuzhihun: "转生",
			shaman_xianzuzhihun_info: "你死亡后，召唤一个自身的复制。",
			spell_xianzuzhihun_info: "令一名随从获得技能转生（你死亡后，召唤一个自身的复制）。",
			spell_xianzuzhishi: "先祖知识",
			shaman_xianzuzhishi: "先祖知识",
			shaman_xianzuzhishi_info: "本回合手牌上限-1。",
			spell_xianzuzhishi_info: "从牌库中获得两张牌，本回合手牌上限-1（多次使用不叠加）。",

			spell_lianhuanbaolie: "连环爆裂",
			spell_lianhuanbaolie_info: "造成1~2点雷电伤害。",
			spell_shandianfengbao: "闪电风暴",
			spell_shandianfengbao_info: "对所有敌方随从造成1~2点伤害。",
			spell_yaoshu: "妖术",
			spell_yaoshu_info: "将一个随从变成一只青蛙。",
			spell_yexinglanghun: "野性狼魂",
			spell_yexinglanghun_info: "召唤两个幽灵狼。",
			spell_shixue: "嗜血",
			spell_shixue_info: "所有友方随从摸两张牌。",
			spell_chazhuangshandian: "叉状闪电",
			spell_chazhuangshandian_info: "对两个随机敌方随从各造成1点雷电伤害。",

			stone_qingwa: "青蛙",
			stone_youlinglang: "幽灵狼",
			stone_jingxiang: "镜像",
			stone_jingxiang_info: "锁定技，你跳过摸牌阶段。",
			shaman_qingwa: "青蛙",
			shaman_qingwa_info: "锁定技，你跳过摸牌阶段。",
			stone_xiaojingling: "小精灵",

			spell_laojiuhuoba: "老旧火把",
			spell_laojiuhuoba_info: "造成1点伤害，将一张炽热火把置入你的牌库。",
			spell_chirehuoba: "炽热火把",
			spell_chirehuoba_info: "造成2点火焰伤害。",
			spell_canying: "残影",
			spell_canying_info: "复制你的所有随从，并将其置入你的手牌。",
			spell_yanbaoshu: "炎爆术",
			spell_yanbaoshu_info: "造成4点火焰伤害（若目标为主将，伤害不能超过目标的当前体力值）。",
			spell_jingxiang: "镜像",
			spell_jingxiang_info: "召唤两个具有嘲讽且摸牌阶段不摸牌的随从。",
			spell_aoshufeidan: "奥术飞弹",
			spell_aoshufeidan_info: "造成3点伤害，随从分配到所有敌方随从上。",
			spell_hanbingpingzhang: "寒冰屏障",
			mage_hanbingpingzhang: "寒冰屏障",
			mage_hanbingpingzhang_info: "体力值不能降到2以内。",
			spell_hanbingpingzhang_info: "令一名角色的体力值不能降到2以内，直到你的下一回合开始。",

			spell_hanbingjian: "寒冰箭",
			spell_hanbingjian_info: "对一个随从造成2点伤害，然后将其翻面。",
			spell_lieyanfengbao: "烈焰风暴",
			spell_lieyanfengbao_info: "对所有敌方随从造成2点伤害。",
			spell_baofengxue: "暴风雪",
			spell_baofengxue_info: "对所有敌方随从造成1点伤害，然后将其翻面。",
			spell_aoshuzhihui: "奥术智慧",
			spell_aoshuzhihui_info: "从牌库中获得两张牌。",
			spell_bianxingshu: "变形术",
			spell_bianxingshu_info: "将一个随从变成一只绵羊。",
			spell_huoqiushu: "火球术",
			spell_huoqiushu_info: "造成3点火焰伤害（若目标为主将，伤害不能超过目标的当前体力值）。",

			stone_mianyang: "绵羊",
			mage_mianyang: "绵羊",
			mage_mianyang_info: "锁定技，你不能使用【杀】。",

			stone_beijunmushi: "北郡牧师",
			stone_guangyaozhizi: "光耀之子",
			stone_longmianjiaoguan: "龙眠教官",
			stone_linghunjisi: "灵魂祭司",
			stone_guanliyuan: "管理员",
			stone_heianjiaotu: "黑暗教徒",

			stone_shengdianzhishi: "圣殿执事",
			stone_suoxiaojishi: "缩小技师",
			stone_anyingzisi: "暗影子嗣",
			stone_guangmingquan: "光明泉",
			stone_muguangchulong: "暮光雏龙",
			stone_shenshengyongshi: "神圣勇士",

			priest_puzhao: "普照",
			priest_puzhao_info: "你出场时，己方主将可令一名其他友方随从增加2点体力和体力上限。",
			priest_suoxiao: "缩小",
			priest_suoxiao_info: "你出场时，己方主将可令一名其他随从减少2点体力上限（不能小于1)。",
			priest_shengshui: "圣水",
			priest_shengshui_info: "你跳过摸牌阶段；在你的准备阶段，令一名随机友方角色回复2点体力。",
			priest_muguang: "暮光",
			priest_muguang_info: "你出场时，若主将手牌中有随从牌，则增加1点体力和体力上限。",
			priest_shixin: "蚀心",
			priest_shixin_info: "每当己方主将使用一次职业技能，对双方主将各造成1点伤害。",

			priest_shengliao: "圣疗",
			priest_shengliao_info: "每当一名随从回复体力，己方主将从牌库中获得一张牌。",
			priest_guangyao: "光耀",
			priest_guangyao_info: "每当你的体力值发生改变，摸一张牌。",
			priest_xundao: "训导",
			priest_xundao_info: "你出场时，若己方主将手牌中有随从牌，则摸一张牌并获得嘲讽。",
			priest_hunwu: "魂舞",
			priest_hunwu_info: "己方主将的职业技能及法术的治疗效果改为令目标失去等量体力。",
			priest_faxian: "发现",
			priest_faxian_info: "你出场时，己方主将从三张随机随从牌中选择一张加入手牌。",
			priest_zhufu: "献身",
			priest_zhufu_info: "你死亡时，令一名随机友方随从增加1点体力和体力上限。",

			stone_daomufeizei: "盗墓匪贼",
			stone_haidao: "海盗",
			stone_haidaotoumu: "海盗头目",
			stone_cike: "刺客",
			stone_tegong: "特工",
			stone_qiezei: "窃贼",
			stone_heitieairen: "黑铁矮人",

			stone_duyanhaidao: "独眼海盗",
			stone_gangtiewushi: "刚铁武师",
			stone_lifaji: "理发机",
			stone_shihualong: "石化龙",
			stone_xiushuihaidao: "锈水海盗",
			stone_zousishangfan: "走私商贩",

			rogue_duxing: "独行",
			rogue_duxing_info: "每当敌方主将召唤一名随从，便获得潜行。",
			rogue_shoudao: "授道",
			rogue_shoudao_info: "在己方主将的结束阶段，令一名随机友方随从增加1点体力和体力上限并摸一张牌。",
			rogue_lifa: "理发",
			rogue_lifa_info: "为己方主将装备一把武器，若已有武器，改为对敌方主将造成1点伤害。",
			rogue_fusheng: "复生",
			rogue_fusheng_info: "你出场时，体力值和体力上限变为X，X为场上体力最高的随从的体力值。",
			rogue_jielue: "劫掠",
			rogue_jielue_info: "每当己方主将装备一把武器牌，摸两张牌。",
			rogue_jiaoyi: "交易",
			rogue_jiaoyi_info: "你出场时，己方主将可以弃置一张装备牌令你摸三张牌。",

			rogue_touqie: "偷窃",
			rogue_touqie_info: "每当你造成一次伤害，己方主将从牌库中获得一张牌。",
			rogue_xunbao: "寻宝",
			rogue_xunbao_info: "你死亡时，将一张伺机行发置于己方主将的手牌。",
			rogue_cisha: "刺杀",
			rogue_cisha_info: "每当你对一名随从造成伤害，受伤害随从立即死亡。",
			rogue_touxi: "偷袭",
			rogue_touxi_info: "你出场时，己方主将可弃置一张装备区内的牌并对一名敌方角色造成1点伤害。",
			rogue_qiancang: "潜藏",
			rogue_qiancang_info: "你出场时，对所有未受伤害的敌方随从造成1点伤害。",
			rogue_zhaomu: "结伙",
			rogue_zhaomu_info: "你出场时，召唤一个海盗。",

			stone_zhihuiguan: "指挥官",
			stone_jiangong: "监工",
			stone_yuanhou: "猿猴",
			stone_chidunshinv: "持盾侍女",
			stone_zhujiashi: "铸甲师",
			stone_kuangzhanshi: "狂战士",

			stone_heiyaoyaoshou: "黑曜妖兽",
			stone_honglongyongshi: "红龙勇士",
			stone_peilianshi: "陪练师",
			stone_jingyingweishi: "精英卫士",
			stone_shengjiachong: "圣甲虫",
			stone_mengmaren: "猛犸人",
			stone_zhifuzhe: "掷斧者",

			warrior_heiyao: "黑曜",
			warrior_heiyao_info: "在己方主将的结束阶段，召唤一只圣甲虫。",
			warrior_peilian: "陪练",
			warrior_peilian_info: "你出场时，己方主将可令一名其他随从获得嘲讽。",
			warrior_fenyong: "奋勇",
			warrior_fenyong_info: "你出场时，若己方主将手牌中有随从牌，则获得冲锋。",
			warrior_chuanci: "穿刺",
			warrior_chuanci_info: "每当你对一名敌方随从造成伤害，对另一名随机敌方随从造成等量的伤害。",
			warrior_zhifu: "掷斧",
			warrior_zhifu_info: "每当你受到一次伤害，对敌方主将造成1点伤害。",

			warrior_tongling: "统领",
			warrior_tongling_info: "每当你召唤一个初始手牌数不大于2的随从，令其获得冲锋。",
			warrior_baoluan: "暴乱",
			warrior_baoluan_info: "每当一名随从受到一次伤害，摸一张牌。",
			warrior_jiangong: "监工",
			warrior_jiangong_info: "你出场时，己方主将可对一名随从造成1点伤害，然后令该随从摸两张牌。",
			warrior_zhujia: "铸甲",
			warrior_zhujia_info: "每当你受到一次伤害，己方主将获得1点护甲。",
			warrior_tidun: "提盾",
			warrior_tidun_info: "你出场时，己方主将获得2点护甲。",

			stone_lieyanxiaogui: "烈焰小鬼",
			stone_xiaoguishouling: "小鬼首领",
			stone_kongjuzhanma: "恐惧战马",
			stone_morishouwei: "末日守卫",
			stone_xukongxingzhe: "虚空行者",
			stone_diyuhuo: "地狱火",
			stone_diyuhuox: "地狱火",
			stone_xiaogui: "小鬼",

			stone_heishitanfan: "黑市摊贩",
			stone_zhaohuanzhe: "召唤者",
			stone_meimo: "魅魔",
			stone_tongkunvwang: "痛苦女王",
			stone_xukongkongmo: "虚空恐魔",
			stone_fukongmoyan: "浮空魔眼",

			warlock_anyu: "暗语",
			warlock_anyu_info: "你出场时，己方主将从三张随机的行动值消耗为1的牌中选择一张加入手牌。",
			warlock_zhaohuan: "召唤",
			warlock_zhaohuan_info: "你死亡时，将手牌中的一张随机随从牌置入战场。",
			warlock_huanmeng: "幻梦",
			warlock_huanmeng_info: "你出场时，己方主将随机弃置一张手牌。",
			warlock_tongku: "痛苦",
			warlock_tongku_info: "每当你造成一次伤害，令己方主将回复1点体力。",
			warlock_tunshi: "吞噬",
			warlock_tunshi_info: "你出场时，己方主将须令一名其他友方随从死亡，然后你获得其全部的手牌和体力值。",
			warlock_shijie: "视界",
			warlock_shijie_info: "每当己方主将受到一次伤害，你增加1点体力和体力上限并摸一张牌。",

			warlock_nonghuo: "弄火",
			warlock_nonghuo_info: "你出场时，对己方主将造成1点火焰伤害。",
			warlock_zhaogui: "召鬼",
			warlock_zhaogui_info: "每当你受到一次伤害，召唤一个小鬼。",
			warlock_yongsheng: "永生",
			warlock_yongsheng_info: "你死亡后，召唤一匹恐惧战马。",
			warlock_yuhuo: "狱火",
			warlock_yuhuo_info: "你出场时，对所有其他随从造成1点伤害。",
			warlock_zaihuo: "灾祸",
			warlock_zaihuo_info: "你出场时，随机弃置主将的两张手牌。",

			stone_hudunren: "护盾人",
			stone_junxuguan: "军需官",
			stone_yurenqishi: "鱼人骑士",
			stone_chidunweishi: "持盾卫士",
			stone_liewangshouwei: "列王守卫",
			stone_longwangpeiou: "龙王配偶",

			stone_baoweizhe: "保卫者",
			stone_guiqishi: "龟骑士",
			stone_shenmiqishou: "神秘骑手",
			stone_shixiangweishi: "石像卫士",
			stone_xuefanzhanshi: "血帆战士",
			stone_xunmashi: "训马师",

			paladin_baowei: "保卫",
			paladin_baowei_info: "你出场时，己方主将可令一名其他随从获得1点护甲。",
			paladin_tuxi: "吐息",
			paladin_tuxi_info: "你出场时，己方主将进行一次判定，若为红色，则回复1点体力。",
			paladin_miying: "秘影",
			paladin_miying_info: "你出场时，依次将牌堆中的所有不重名的判定牌置入敌方主将的判定区。",
			paladin_huashi: "化石",
			paladin_huashi_info: "你出场时，己方主将可将一名其他随从的体力值及体力上限变为2。",
			paladin_jinghua: "净化",
			paladin_jinghua_info: "你出场时，对所有手牌数大于1的随从造成2点伤害。",
			paladin_moma: "秣马",
			paladin_moma2: "秣马",
			paladin_moma_info: "所有友方新兵摸牌阶段摸牌数+1。",

			paladin_zhaohuan: "召唤",
			paladin_zhaohuan2: "召唤",
			paladin_zhaohuan_info: "你出场后，你的主将在使用下一张随从牌时获得两点行动值。",
			paladin_shouwei: "守卫",
			paladin_shouwei_info: "你出场时，你的主将回复2点体力值。",
			paladin_chidun: "持盾",
			paladin_chidun_info: "你出场时，己方主将可以弃置对方一名随从的所有牌。",
			paladin_buji: "补给",
			paladin_buji_info: "你出场时，所有友方新兵增加1点体力和体力上限并摸两张牌。",
			paladin_hudun: "护盾",
			paladin_hudun_info: "你出场时，获得1点护甲值。",
			paladin_zhaochao: "招潮",
			paladin_zhaochao_info: "每当你的主将使用一次英雄技能，便摸两张牌。",

			stone_shifazhe: "嗜法者",
			stone_wushixuetu: "巫师学徒",
			stone_shuiyuansu: "水元素",
			stone_falifulong: "法力浮龙",
			stone_yingxiongzhihun: "英雄之魂",
			stone_huoyao: "火妖",

			stone_aoshushi: "奥术师",
			stone_faqishi: "法骑士",
			stone_fuhuokaijia: "复活铠甲",
			stone_kaodalalong: "考达拉龙",
			stone_yanshushi: "炎术士",
			stone_xulingwushi: "虚灵巫师",

			mage_aoshu: "奥术",
			mage_aoshu_info: "你出场时，将一张奥术智慧置入主将的手牌。",
			mage_jili: "激励",
			mage_jili_info: "每当主将使用一次职业技能，摸一张牌。",
			mage_gushou: "固守",
			mage_gushou_info: "每当己方主将受到多于1伤害时，防止其余伤害。",
			mage_yufa: "驭法",
			mage_yufa_info: "每当己方主将使用一次职业技能，令其获得1点行动值。",
			mage_yanshu: "炎术",
			mage_yanshu_info: "你出场时，造成X点火焰伤害，随机分配到敌方随从上，X为己方主将装备区内装备牌的数量。",
			mage_pingxu: "冯虚",
			mage_pingxu_info: "你出场时，己方主将从三张随机法术牌中选择一张加入手牌。",

			mage_shifa: "嗜法",
			mage_shifa_info: "你出场时，将一张随机法术牌置入双方主将的手牌。",
			mage_minghuo: "冥火",
			mage_minghuo_info: "你的主将的职业技能造成的伤害+1。",
			mage_tunfa: "吞法",
			mage_tunfa_info: "每当己方主将使用一张法术牌，摸一张牌。",
			mage_lieyan: "烈焰",
			mage_lieyan_info: "每当己方主将使用一张法术牌，对一名随机敌方角色造成1点火焰伤害。",
			mage_zhufa: "助法",
			mage_zhufa_info: "每当己方主将使用一张法术牌，令其获得1点行动值。",
			mage_bingdong: "冰冻",
			mage_bingdong_info: "每当你对一个随从造成伤害，该随从将武将牌翻至背面。",

			stone_caoyuanshi: "草原狮",
			stone_leiouke: "雷欧克",
			stone_misha: "米莎",
			stone_huofu: "霍弗",
			stone_jiewangzhu: "结网蛛",
			stone_xunshoushi: "驯兽师",

			stone_senlinlang: "森林狼",
			stone_tujiu: "秃鹫",
			stone_muyangren: "牧羊人",
			stone_jujishou: "狙击手",
			stone_damoshatuo: "大漠沙驼",
			stone_huangjialeixiang: "皇家雷象",

			hunter_jiewang: "结网",
			hunter_jiewang_info: "你死亡时，己方主将获得一张随机野兽牌。",
			hunter_xunshou: "驯兽",
			hunter_xunshou_info: "你出场时，己方主将可选择一名其他友方随从令其增加1点体力和体力上限，摸两张牌并获得嘲讽。",
			hunter_nuhou: "怒吼",
			hunter_nuhou_info: "当你死亡时，对所有敌方角色造成1点伤害。",
			hunter_zhanhuo: "战火",
			hunter_zhanhuo2: "战火",
			hunter_zhanhuo_info: "其他友方随从摸牌阶段的摸牌数+1。",

			hunter_qunxi: "群袭",
			hunter_qunxi_info: "你出场时，所有友方随从摸一张牌。",
			hunter_mishi: "觅食",
			hunter_mishi_info: "每当己方主将召唤一个随从，摸一张牌。",
			hunter_dusha: "渡沙",
			hunter_dusha_info: "你出场时，令双方主将各随机使用一张牌库中的1费随从牌（不计入行动值消耗）。",
			hunter_chuanlin: "穿林",
			hunter_chuanlin_info: "你出场时，己方主将展示牌库中的一张随机随从牌并获得之。",
			hunter_muyang: "牧羊",
			hunter_muyang_info: "你出场时，随机召唤一个行动值消耗为X的随从，X为其他友方随从数。",
			hunter_juji: "狙击",
			hunter_juji_info: "你的职业技能可以指定随从为目标。",

			stone_baoqishi: "豹骑士",
			stone_conglinshouwei: "从林守卫",
			stone_baohuzhishu: "保护之树",
			stone_kuangyedoushi: "狂野斗士",
			stone_liebao: "猎豹",
			stone_zongxiong: "棕熊",

			stone_renyaqishi: "刃牙骑士",
			stone_conglinxiaoshou: "丛林枭兽",
			stone_huangyeqishi: "荒野骑士",
			stone_xunmenglong: "迅猛龙",
			stone_lindishuyao: "林地树妖",
			stone_huoshanxiemu: "火山邪木",

			druid_renya: "刃牙",
			druid_renya_info: "你出场时，己方主将可以选择一项：令你摸一张牌并将武将牌翻至正面，或令你增加1点体力上限并获得技能潜行。",
			druid_yuehuo: "月火",
			druid_yuehuo_info: "所有锦囊牌造成的伤害+1。",
			druid_qicheng: "骑乘",
			druid_qicheng_info: "你死亡时，随机召唤一个行动消耗为1的随从。",
			druid_chicheng: "驰骋",
			druid_chicheng_info: "你出场时，己方主将获得X点行动值，X为其他友方随从数。",
			druid_yeyou: "夜游",
			druid_yeyou_info: "双方主将各从牌库中获得一张牌。",
			druid_juhuo: "举火",
			druid_juhuo_info: "己方主将回合内，每有一名随从死亡，令己方主将获得1点行动值。",

			stone_chongfeng: "冲锋",
			stone_chongfeng_info: "你出场时，立即将武将牌翻至正面。",
			druid_nuhuo: "怒火",
			druid_nuhuo_info: "每当己方主将使用一次职业技能，便对一名随机敌人造成1点伤害。",
			druid_chengzhang: "成长",
			druid_chengzhang2: "成长",
			druid_chengzhang_info: "你出场时，己方主将获得1点行动值；你死亡时，己方主将需弃置一张手牌。",
			druid_huwei: "护卫",
			druid_huwei_info: "你出场时，己方主将可以选择一项：对一名随从造成1点伤害，或弃置一名随从的所有牌并将其体力上限改为2。",

			stone_fachao: "法潮图腾",
			stone_tutengyongshi: "图腾勇士",
			stone_huoshe: "火舌图腾",
			stone_huoyuansu: "火元素",
			stone_tuyuansu: "土元素",
			stone_xuejuren: "穴居人",
			stone_huoli: "活力图腾",
			stone_tutengshi: "图腾师",
			stone_shachuisaman: "砂槌萨满",
			stone_huoyanweishi: "火焰卫士",
			stone_wanshiyuansu: "顽石元素",
			stone_shalinxingzhe: "砂鳞行者",

			shaman_anhun: "暗魂",
			shaman_anhun_info: "每当一名友方随从死亡，令主将从牌库中获得一张牌。",
			shaman_zoushi: "走石",
			shaman_zoushi_info: "每当己方主将使用一张随从牌，对一名随机敌方角色造成1点伤害。",
			shaman_zhuhuo: "逐火",
			shaman_zhuhuo_info: "你出场时，摸1~3张牌。",
			shaman_peiyu: "培育",
			shaman_peiyu_info: "你出场时，增加X点体力和体力上限，X为友方图腾数。",
			shaman_huoli: "活力",
			shaman_huoli_info: "己方主将出牌阶段开始时，你令其获得1点行动值。",
			shaman_xueju: "穴居",
			shaman_xueju_info: "每当己主将使用一张随从牌，摸一张牌。",
			shaman_huoxi: "火袭",
			shaman_huoxi_info: "你出场时，己方主将可以对对方一名随从造成2点火焰伤害。",
			shaman_fachao: "法潮",
			shaman_fachao_info: "己方主将在其每个回合结束阶从牌库中获得一张牌并回复1点体力。",
			shaman_huoshe: "火舌",
			shaman_huoshe_info: "其他友方随从造成的伤害始终+1。",

			shaman_jili: "激励",
			shaman_jili_info: "己方主将的结束阶段，所有友方图腾摸一张牌。",
			shaman_tuteng: "图腾",
			shaman_tuteng_info: "你跳过摸牌阶段。",
			shaman_fali: "空气",
			shaman_fali_info: "已方主将使用的法术牌伤害+1。",
			shaman_zhiliao: "治疗",
			shaman_zhiliao_info: "在你的结束阶段，令所有友方随从回复1点体力。",
			shaman_zhuore: "灼热",
			shaman_zhuore_info: "已方主将的结束阶段，对一名随机敌方随从造成1点伤害。",

			_shaman_skill: "图腾",
			_shaman_skill_info: "召唤一个随机图腾。",
			_mage_skill: "火冲",
			_mage_skill_info: "对一名随从造成1点火焰伤害。",
			_priest_skill: "治疗",
			_priest_skill_info: "回复1点体力。",
			_priest_skillx: "心刺",
			_priest_skillx_info: "造成1点伤害。",
			_warrior_skill: "战甲",
			_warrior_skill_info: "获得1点护甲（不能超过3点）。",
			_warlock_skill: "分流",
			_warlock_skill_info: "从牌库中获得两张牌。",
			_warlock_skillx: "炼狱",
			_warlock_skillx_info: "召唤一个地狱火。",
			_rogue_skill: "出鞘",
			_rogue_skill_info: "装备一把武器和一个随机非武器装备。",
			_paladin_skill: "动员",
			_paladin_skill_info: "召唤一名士兵。",
			_hunter_skill: "射击",
			_hunter_skill_info: "对敌方主将造成1点伤害。",
			_druid_skill: "猛击",
			_druid_skill_info: "视为使用一张不计入出杀次数的【杀】。",

			stone_tuteng1: "石爪图腾",
			stone_tuteng2: "灼热图腾",
			stone_tuteng3: "空气图腾",
			stone_tuteng4: "治疗图腾",

			stone_xinbing: "新兵",

			stone_zhongshi: "中士",
			stone_zhongshi1: "叫嚣",
			stone_zhongshi1_info: "你出场时，己方主将可以弃置对方一名随从的所有牌。",
			stone_zhucangzhe: "伫藏者",
			stone_zhucangzhe1: "伫藏",
			stone_zhucangzhe1_info: "你出场时，己方主将可以令己方一名其他角色摸一张牌。",
			stone_huoqiangshou: "火枪手",
			stone_huoqiangshou1: "火枪",
			stone_huoqiangshou1_info: "你出场时，己方主将可以对对方一名随从造成1点伤害。",

			stone_lansaizhanshi: "蓝腮战士",
			stone_kutongsiseng: "苦痛侍僧",
			stone_kutongsiseng1: "苦痛",
			stone_kutongsiseng2: "苦痛",
			stone_kutongsiseng1_info: "你出场时，己方主将于本结束阶段摸一张牌。",
			stone_yuanguanying: "远古暗影",
			stone_yuanguanying1: "暗影",
			stone_yuanguanying1_info: "你出场时，己方主将可视为对一名敌方角色使用一张【杀】。",

			stone_dijieshicong: "低阶侍从",
			stone_dijieshicong1: "持枪",
			stone_dijieshicong1_info: "你出场时，敌方主将随机弃置一张装备牌。",
			stone_yaosaishouwei: "要塞守卫",
			stone_yaosaishouwei1: "守卫",
			stone_yaosaishouwei1_info: "你出场时，己方主将本回合手牌上限+2。",
			stone_famingjia: "发明家",
			stone_famingjia1: "发明",
			stone_famingjia1_info: "你出场时，己方主将摸两张牌。",

			stone_chilundashi: "齿轮大师",
			stone_chilundashi1: "齿轮",
			stone_chilundashi2: "齿轮",
			stone_chilundashi1_info: "你出场后的第一个摸牌阶段摸牌数+1。",
			stone_hanguangzhizhe: "寒光智者",
			stone_hanguangzhizhe1: "寒光",
			stone_hanguangzhizhe1_info: "你出场时，所有其他随从各摸一张牌。",
			stone_aihaozhihun: "哀嚎之魂",
			stone_aihaozhihun1: "哀嚎",
			stone_aihaozhihun1_info: "你出场时，敌方随从弃置所有牌。",

			stone_fennuxiaoji: "愤怒小鸡",
			stone_fennuxiaoji1: "暴怒",
			stone_fennuxiaoji1_info: "准备阶段，若你没有手牌，你摸两张牌。",
			stone_juxingchanchu: "巨型蟾蜍",
			stone_juxingchanchu1: "毒液",
			stone_juxingchanchu1_info: "你死亡时，己方主将可令一名敌方随从失去1点体力。",
			stone_shishigui: "食尸鬼",
			stone_shishigui1: "食尸",
			stone_shishigui1_info: "你死亡后，场上所有其他随从失去1点体力。",
			stone_wuyi: "巫医",
			stone_langren: "狼人",
			stone_qianxing: "潜行",
			stone_qianxing_info: "你出场时，获得潜行直到下一回合开始。",

			stone_mingguangjisi: "明光祭司",
			stone_nianqingjisi: "年轻祭司",
			stone_zhufu: "祝福",
			stone_zhufu_info: "己方主将的结束阶段，你令一名随机的受伤友方随从回复1点体力。",
			stone_aomishouwei: "奥秘守卫",
			stone_yanjingshe: "眼镜蛇",
			stone_yanjingshe1: "毒噬",
			stone_yanjingshe1_info: "你出场时，若敌方随从数不少于己方，则随机杀死一名随从。",
			stone_zhiyuzhe: "治愈者",
			stone_zhiyu: "治愈",
			stone_zhiyu_info: "你出场时，令所有友方随从回复1点体力。",
			stone_mafengzhuru: "麻风侏儒",
			stone_mafengzhuru1: "麻风",
			stone_mafengzhuru1_info: "杀死你的随从失去1点体力。",
			stone_fatiaozhuru: "发条侏儒",
			stone_fatiaozhuru1: "发条",
			stone_fatiaozhuru1_info: "结束阶段，若你没有手牌，你摸两张牌。",

			stonesha: "进攻",
			stonesha_info: "锁定技，你的装备牌均视为【杀】。",
			stoneshan: "格挡",
			stoneshan_info: "锁定技，你的随从和法术牌均视为闪。",

			stonecharacter: "随从",
			spell_shengerpingdeng: "生而平等",
			spell_shengerpingdeng_info: "将所有随从体力上限降为1。",
			spell_jingshenkongzhi: "精神控制",
			spell_jingshenkongzhi_info: "将一名敌方随从吸收为己方。",
			spell_anyingkuangluan: "暗影狂乱",
			spell_anyingkuangluan_info: "将一名手牌数不超过1的敌方随从吸收为己方，并令其于下个回合结束后死亡。",
			spell_anyingkuangluan_die: "暗影狂乱",
			spell_anyingkuangluan_die_info: "下个回合结束后死亡。",
			spell_binghuan: "冰环",
			spell_binghuan_info: "将场上所有随从翻面。",
			spell_morizaihuo: "末日灾祸",
			spell_morizaihuo_info: "令场上所有随从立即死亡，回复2点体力。",
			spell_zhiliaozhichu: "治疗之触",
			spell_zhiliaozhichu_info: "令目标随从恢复所有体力值并获得嘲讽。",
			lschaofeng: "嘲讽",
			lschaofeng_info: "同阵营的无嘲讽角色不能成为【杀】的目标。",
			spell_wangzhezhufu: "王者祝福",
			spell_wangzhezhufu_info: "令一名随从增加2点体力和体力上限并摸两张牌。",
			spell_diyulieyan: "地狱烈焰",
			spell_diyulieyan_info: "所有角色失去1点体力。",
			spell_chenmo: "沉默",
			spell_chenmo_info: "弃置一名随从的所有牌，并令其体力上限减至2。",
			spell_zhiliaoshui: "治疗水",
			spell_zhiliaoshui_info: "出牌阶段对自己使用，恢复2点体力值；或于濒死阶段对一名角色使用，令目标恢复1点体力。",
			spell_yanmie: "极恶之咒",
			spell_yanmie_info: "交换你与敌方主将的装备区，并摸若干张牌直到你的手牌数与敌方主将相等。",
			spell_xiaoshi: "消失",
			spell_xiaoshi_info: "令敌方主将将所有装备区内的牌收入手牌，并弃置其若干张手牌，直到其手牌数与你相等。",

			stonecard: "法术",
			mode_stone_card_config: "炉石模式",
			mode_stone_character_config: "炉石模式",
		},
		help: {
			炉石模式:
				'<div style="margin:10px">构筑</div><ul style="margin-top:0"><li>点击右上角的卡组管理构建卡组<li>一套卡组共30张牌，由法术和随从牌构成，每个同名卡牌最多带两张' +
				"<li>卡组管理器中，随从右上角的x/y表示登场状态为x牌y血" +
				"<li>游戏开始时，双方摸三张牌并从牌库中获得一张牌，并可选择将手牌置换一次" +
				"<li>每当主将摸X张牌时，若X至少为2，则其中的X-1张牌从牌堆中获得，一张牌从牌库中获得" +
				"<li>每名角色使用一套卡组，卡组用完后会重新补满" +
				"<li>卡组与职业绑定，每个职业有一个专属技能，每回合限用一次，消耗两点行动值</ul>" +
				'<div style="margin:10px">职业技能</div><ul style="margin-top:0"><li>祭司：召唤一个随机图腾' +
				"<li>法师：对一名随从造成1点火焰伤害" +
				"<li>牧师：回复1点体力" +
				"<li>战士：获得1点护甲（不能超过3点）" +
				"<li>术士：牌库中摸两张牌" +
				"<li>潜行者：装备一把武器和一个随机非武器装备" +
				"<li>圣骑士：召唤一名士兵" +
				"<li>猎人：对敌方主将造成1点伤害" +
				"<li>德鲁伊：视为使用一张不计入出杀次数的杀</ul>" +
				'<div style="margin:10px">怒气值</div><ul style="margin-top:0"><li>每当友方随从受到伤害获得3点怒气值，主将受到伤害获得6点怒气值' +
				"<li>每有一个友方随从死亡，获得10点怒气值，主将死亡获得20点怒气值" +
				"<li>结束阶段，若己方随从数少于对方会获得10X点怒气值，X为随从数之差" +
				"<li>怒气值达到100时不再增加。准备阶段，若怒气值己满，可消耗全部怒气值和4点行动值并召唤一名传说随从</ul>" +
				'<div style="margin:10px">战斗</div><ul style="margin-top:0"><li>场上有两名主将进行对抗，主将的体力上限+1' +
				"<li>游戏牌堆移除了乐不思蜀等跳过出牌阶段以及包含翻面功能的卡牌" +
				"<li>主将出牌阶段的出牌数量（行动值）有上限，从1开始递增，后手的首个回合有一点额外行动值，装备牌不计入出牌上限<li>游戏每进行一轮，主将的出牌上限+1，直到增加至6" +
				"<li>使用随从牌可召唤一个随从，随从出场时背面朝上。每一方在场的随从数不能超过4<li>随从于摸牌阶段摸牌基数为1，随从的法术和随从牌均视为闪，装备牌均视为杀<li>" +
				"随从与其他所有角色相互距离基数为1<li>" +
				"主将杀死对方随从后获得一个额外的行动值并从牌库中获得一张牌，杀死己方随从无惩罚，随从杀死随从无效果" +
				"<li>主将在随从满员时可重铸随从牌，但回合内总的重铸次数不能超过3；若重铸的牌为随从牌或法术牌，则摸牌改为获得一张随机法术牌" +
				"<li>嘲讽：若一方阵营中有嘲讽角色，则同阵营的无嘲讽角色不以能成为杀目标" +
				"<li>行动顺序为先主将后随从。主将或随从死亡后立即移出游戏，主将死亡后替补登场，替补登场时摸3+X张牌，X为对方存活的随从数，无替补时游戏结束",
		},
	};
};
