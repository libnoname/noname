import { lib, game, ui, get, ai, _status } from "noname";
const info = {
	name: "mjs",
	game: {
		syncMenu: true,
	},
	start() {
		ui.auto.hide();
		var dialog = ui.create.dialog("hidden");
		dialog.classList.add("fixed");
		dialog.classList.add("scroll1");
		dialog.classList.add("scroll2");
		dialog.classList.add("fullwidth");
		dialog.classList.add("fullheight");
		dialog.classList.add("noupdate");
		dialog.classList.add("character");
		dialog.contentContainer.style.overflow = "visible";
		dialog.style.overflow = "hidden";
		dialog.content.style.height = "100%";
		dialog.contentContainer.style.transition = "all 0s";
		dialog.open();
		var packnode = ui.create.div(".packnode", dialog);
		lib.setScroll(packnode);
		var clickCapt = function () {
			var active = this.parentNode.querySelector(".active");
			if (this.link == "stage") {
				if (get.is.empty(lib.storage.scene)) {
					alert("请创建至少1个场景");
					return;
				}
			}
			if (active) {
				if (active == this) {
					return;
				}
				for (var i = 0; i < active.nodes.length; i++) {
					active.nodes[i].remove();
					if (active.nodes[i].showcaseinterval) {
						clearInterval(active.nodes[i].showcaseinterval);
						delete active.nodes[i].showcaseinterval;
					}
				}
				active.classList.remove("active");
			}
			this.classList.add("active");
			for (var i = 0; i < this.nodes.length; i++) {
				dialog.content.appendChild(this.nodes[i]);
			}
			var showcase = this.nodes[this.nodes.length - 1];
			showcase.style.height = dialog.content.offsetHeight - showcase.offsetTop + "px";
			if (typeof showcase.action == "function") {
				if (showcase.action(showcase._showcased ? false : true) !== false) {
					showcase._showcased = true;
				}
			}
			if (this._nostart) {
				start.style.display = "none";
			} else {
				start.style.display = "";
			}
			game.save("currentBrawl", this.link);
		};
		var createNode = function (name) {
			var info = lib.brawl[name];
			var node = ui.create.div(".dialogbutton.menubutton.large", info.name, packnode, clickCapt);
			node.style.transition = "all 0s";
			var caption = info.name;
			var modeinfo = "";
			var intro;
			if (Array.isArray(info.intro)) {
				intro = '<ul style="text-align:left;margin-top:0;width:450px">';
				if (modeinfo) {
					intro += "<li>" + modeinfo;
				}
				for (var i = 0; i < info.intro.length; i++) {
					intro += "<li>" + info.intro[i];
				}
			} else {
				intro = "";
				if (modeinfo) {
					intro += "（" + modeinfo + "）";
				}
				intro += info.intro;
			}
			var showcase = ui.create.div();
			showcase.style.margin = "0px";
			showcase.style.padding = "0px";
			showcase.style.width = "100%";
			showcase.style.display = "block";
			showcase.action = info.showcase;
			showcase.link = name;
			if (info.fullshow) {
				node.nodes = [showcase];
				showcase.style.height = "100%";
			} else {
				node.nodes = [ui.create.div(".caption", caption), ui.create.div(".text center", intro), showcase];
			}
			node.link = name;
			node._nostart = info.nostart;
			if (lib.storage.currentBrawl == name) {
				clickCapt.call(node);
			}
			return node;
		};
		var clickStart = function () {
			var active = packnode.querySelector(".active");
			if (active) {
				for (var i = 0; i < active.nodes.length; i++) {
					if (active.nodes[i].showcaseinterval) {
						clearInterval(active.nodes[i].showcaseinterval);
						delete active.nodes[i].showcaseinterval;
					}
				}
				var info;
				if (active.link.indexOf("stage_") == 0) {
					var level;
					if (Array.isArray(arguments[0])) {
						level = { index: arguments[0][1] };
					} else {
						level = dialog.content.querySelector(".menubutton.large.active");
					}
					if (level) {
						var stagesave = lib.storage.stage;
						var stage = stagesave[active.link.slice(6)];
						game.save("lastStage", level.index);
						if (stage.mode == "loopTest") {
							//console.log('关卡 lastStage: ', level.index, stage);
							var SSS = localStorage.getItem("SSS");
							if (!SSS) {
								SSS = 1;
							}
							var NNN = ui.create.system("LV" + (level.index + 1) + "/" + SSS, null, true);
						}
						lib.onover.push(function (bool) {
							_status.createControl = ui.controls[0];
							//lib.storage.stage[stage.name] = stage;
							//console.log('关卡 场景对局结果: ', bool, level.index + 1, stage.scenes.length);
							if (stage.mode == "loopTest") {
								//console.log('关卡 自动进入下一Scene场景', level.index, stage.scenes);
								game.delay(1, 1500);
								//next_level.click();
								if (level.index + 1 < stage.scenes.length) {
									game.save("directStage", [stage.name, level.index + 1], "brawl");
								} else {
									game.save("directStage", [stage.name, 0], "brawl");
									var SSS = localStorage.getItem("SSS");
									if (!SSS) {
										SSS = 1;
									} else {
										SSS = Number(SSS) + 1;
									}
									//当前通关数
									localStorage.setItem("SSS", SSS);
								}
								localStorage.setItem(lib.configprefix + "directstart", true);
								game.reload();
							}

							if (bool && level.index + 1 < stage.scenes.length) {
								ui.create.control("下一关", function () {
									game.save("directStage", [stage.name, level.index + 1], "brawl");
									localStorage.setItem(lib.configprefix + "directstart", true);
									game.reload();
								});
								if (level.index + 1 > stage.level) {
									stage.level = level.index + 1;
									game.save("stage", stagesave, "brawl");
								}
								if (stage.mode != "sequal") {
									game.save("lastStage", level.index + 1, "brawl");
								}
							} else {
								ui.create.control("重新开始", function () {
									if (stage.mode == "sequal" && bool && level.index == stage.scenes.length - 1) {
										game.save("directStage", [stage.name, 0], "brawl");
									} else {
										game.save("directStage", [stage.name, level.index], "brawl");
									}
									localStorage.setItem(lib.configprefix + "directstart", true);
									game.reload();
								});
								if (stage.mode == "sequal" && level.index == stage.scenes.length - 1) {
									stage.level = 0;
									game.save("stage", stagesave, "brawl");
								}
								if (stage.mode != "sequal") {
									game.save("lastStage", level.index, "brawl");
								}
							}
							delete _status.createControl;
						});
						var scene = stage.scenes[level.index];
						info = {
							name: scene.name,
							intro: scene.intro,
						};
						for (var i in lib.brawl.scene.template) {
							info[i] = get.copy(lib.brawl.scene.template[i]);
						}
						if (!scene.gameDraw) {
							info.content.noGameDraw = true;
						}
						info.content.scene = scene;
					} else {
						return;
					}
				} else {
					info = lib.brawl[active.link];
				}
				lib.translate.restart = "返回";
				dialog.delete();
				ui.brawlinfo = ui.create.system("乱斗", null, true);
				lib.setPopped(
					ui.brawlinfo,
					function () {
						var uiintro = ui.create.dialog("hidden");
						uiintro.add(info.name);
						var intro;
						if (Array.isArray(info.intro)) {
							intro = '<ul style="text-align:left;margin-top:0;width:450px">';
							for (var i = 0; i < info.intro.length; i++) {
								intro += "<li>" + info.intro[i];
							}
							intro += "</ul>";
						} else {
							intro = info.intro;
						}
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
				ui.auto.show();
				_status.brawl = info.content;
				game.switchMode(info.mode);
				if (info.init) {
					info.init();
				}
				if (stage && stage.mode == "loopTest") {
					//console.log("关卡开局就托管：brawl", info, stage);
					ui.click.auto();
				}
			}
		};
		var start = ui.create.div(".menubutton.round.highlight", "斗", dialog.content, clickStart);
		start.style.position = "absolute";
		start.style.left = "auto";
		start.style.right = "10px";
		start.style.top = "auto";
		start.style.bottom = "10px";
		start.style.width = "80px";
		start.style.height = "80px";
		start.style.lineHeight = "80px";
		start.style.margin = "0";
		start.style.padding = "5px";
		start.style.fontSize = "72px";
		start.style.zIndex = 3;
		start.style.transition = "all 0s";
		var sceneNode;
		for (var i in lib.brawl) {
			if (get.config(i) === false) {
				continue;
			}
			if (i == "scene") {
				sceneNode = createNode(i);
			} else {
				createNode(i);
			}
		}
		if (!lib.storage.currentBrawl) {
			clickCapt.call(packnode.firstChild);
		}
		game.save("lastStage");
		if (lib.storage.directStage) {
			var directStage = lib.storage.directStage;
			game.save("directStage");
			clickStart(directStage);
		}
		lib.init.onfree();
	},
	brawl: {
		chuhanzhengba: {
			name: "楚汉争霸",
			mode: "versus",
			intro: [
				"仅剩1人的阵营会获得“孤注一掷”，并且从游戏第6轮开始，所有角色会获得“酣战”。",
				"孤注一掷：每回合额外摸1张牌，每个出牌阶段的出杀次数+1。",
				"酣战：每回合额外摸1张牌，下回合摸牌数+1。",
				"每名玩家与匹配到的队友随机展示4名武将。玩家可从这8名武将中自由选择2名，组成自己的出战阵容。",
				"1号位玩家的初始手牌固定为3张；2、3号位玩家初始手牌为4张；4号位玩家初始手牌为5张。",
			],
			showcase(init) {
				var node = this;
				var player1, player2;
				var list = [
					["mjs_xiangyu", "mjs_liubang", "mjs_lvzhi", "mjs_yuji"],
				].randomGet();
				if (init) {
					player1 = ui.create.player(null, true);
					player2 = ui.create.player(null, true);
					player1.node.marks.remove();
					player1.node.hp.remove();
					player2.node.marks.remove();
					player2.node.hp.remove();
					player1.style.left = "20px";
					player1.style.top = "20px";
					player1.style.transform = "scale(0.9)";
					player1.node.count.remove();
					player2.style.left = "auto";
					player2.style.right = "20px";
					player2.style.top = "20px";
					player2.style.transform = "scale(0.9)";
					player2.node.count.remove();
					this.appendChild(player1);
					this.appendChild(player2);
					this.player1 = player1;
					this.player2 = player2;
				} else {
					player1 = this.player1;
					player2 = this.player2;
				}
				var player3, player4;
				if (init) {
					player3 = ui.create.player(null, true);
					player4 = ui.create.player(null, true);
					player3.node.marks.remove();
					player3.node.hp.remove();
					player4.node.marks.remove();
					player4.node.hp.remove();
					player3.style.left = "60px";
					player3.style.top = "120px";
					player3.style.transform = "scale(0.9)";
					player3.node.count.remove();
					player4.style.left = "auto";
					player4.style.right = "60px";
					player4.style.top = "120px";
					player4.style.transform = "scale(0.9)";
					player4.node.count.remove();
					this.appendChild(player3);
					this.appendChild(player4);
					this.player3 = player3;
					this.player4 = player4;
				} else {
					player3 = this.player3;
					player4 = this.player4;
				}
				player1.init(list[0]);
				player2.init(list[1]);
				player3.init(list[3]);
				player4.init(list[2]);
			},
			init() {
				lib.configOL.number = 4;
				lib.configOL.olfeiyang_four = false;
				lib.config.mode_config.versus.olfeiyang_four = false;
				game.saveConfig("olfeiyang_four", lib.config.mode_config.versus.olfeiyang_four, "versus");
				lib.config.mode_config.versus.replace_handcard_two = false;
				game.saveConfig("replace_handcard_two", lib.config.mode_config.versus.replace_handcard_two, "versus");
				lib.config.mode_config.versus.replace_character_two = false;
				game.saveConfig("replace_character_two", lib.config.mode_config.versus.replace_character_two, "versus");
				lib.skill._mjs_gameDraw = {
					trigger: {
						global: "gameDrawBegin",
					},
					silent: true,
					firstDo: true,
					filter(event, player) {
						return player == _status.firstAct;
					},
					async content(event, trigger, player) {
						const me = player;
			            const numx = trigger.num;
			            trigger.num = function (player) {
			                return (player == _status.firstAct ? -1 : (player == _status.firstAct.previous ? 1 : 0)) + (typeof numx == "function" ? numx(player) : numx);
			            };
			            _status.first_less = false;
			            _status.first_less_forced = false;
					},
				};
				game.addGlobalSkill("mjshanzhan");
			},
			content: {
				submode: "two",
				chooseCharacterBefore() {
					Object.assign(game, {
						chooseCharacterTwo() {
							var next = game.createEvent("chooseCharacter");
							next.showConfig = true;
							next.setContent(function () {
								"step 0"
								ui.arena.classList.add("choose-character");
								var bool = Math.random() < 0.5;
								var bool2 = Math.random() < 0.5;
								var ref = game.players[0];

								ref.side = bool;
								ref.next.side = bool2;
								ref.next.next.side = !bool;
								ref.previous.side = !bool2;

								var firstChoose = game.players.randomGet();
								if (firstChoose.next.side == firstChoose.side) {
									firstChoose = firstChoose.next;
								}
								_status.firstAct = firstChoose;
								for (var i = 0; i < 4; i++) {
									firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(i + 1, true) + "号位");
									firstChoose.identity = ([1, 4].includes(i + 1) ? "fan" : "zhong");
									firstChoose.node.identity.firstChild.innerHTML = get.translation(game.players[i].identity);
									firstChoose.node.identity.dataset.color = game.players[i].side + "zhu";
									firstChoose.setIdentity();
									firstChoose.identityShown = true;
									firstChoose = firstChoose.next;
								}
								//22选将框分配
								var list = [];
								var list4 = [];
								for (i in lib.characterReplace) {
									var ix = lib.characterReplace[i];
									for (var j = 0; j < ix.length; j++) {
										if (lib.filter.characterDisabled(ix[j])) {
											ix.splice(j--, 1);
										}
									}
									if (ix.length) {
										list.push(i);
										list4.addArray(ix);
									}
								}
								for (i in lib.character) {
									if (!list4.includes(i) && !lib.filter.characterDisabled(i)) {
										list.push(i);
										list4.push(i);
									}
								}
								var choose = [];
								event.list = list;
								_status.characterlist = list4;

								var addSetting = function (dialog) {
									dialog.add("选择座位").classList.add("add-setting");
									var seats = document.createElement("table");
									seats.classList.add("add-setting");
									seats.style.margin = "0";
									seats.style.width = "100%";
									seats.style.position = "relative";
									for (var i = 1; i <= game.players.length; i++) {
										var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
										td.innerHTML = get.cnNumber(i, true);
										td.link = i - 1;
										seats.appendChild(td);
										if (get.distance(_status.firstAct, game.me, "absolute") === i - 1) {
											td.classList.add("bluebg");
										}
										td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
											if (_status.dragged) {
												return;
											}
											if (_status.justdragged) {
												return;
											}
											if (get.distance(_status.firstAct, game.me, "absolute") == this.link) {
												return;
											}
											var current = this.parentNode.querySelector(".bluebg");
											if (current) {
												current.classList.remove("bluebg");
											}
											this.classList.add("bluebg");
											_status.firstAct = game.me;
											for (var i = 0; i < this.link; i++) {
												_status.firstAct = _status.firstAct.previous;
											}
											var firstChoose = _status.firstAct;
											firstChoose.next.side = !firstChoose.side;
											firstChoose.next.next.side = !firstChoose.side;
											firstChoose.previous.side = firstChoose.side;
											for (var i = 0; i < 4; i++) {
												firstChoose.Act = i + 1;
												firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(i + 1, true) + "号位");
												firstChoose.identity = ([1, 4].includes(i + 1) ? "fan" : "zhong");
												firstChoose.node.identity.firstChild.innerHTML = get.translation(game.players[i].identity);
												firstChoose.node.identity.dataset.color = game.players[i].side + "zhu";
												firstChoose.setIdentity();
												firstChoose.identityShown = true;
												firstChoose = firstChoose.next;
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

								var characterChoice;
								if (_status.brawl && _status.brawl.chooseCharacter) {
									characterChoice = _status.brawl.chooseCharacter(list, game.me);
								} else {
									characterChoice = list.randomGets(10);
								}
								event.characterChoice = characterChoice;
								var basenum = 1;
								var basestr = "选择角色";
								if (get.config("two_assign", "mjs")) {
									basenum = 2;
									basestr = "选择你和队友的角色";
									event.two_assign = true;
								}
								var dialog = ui.create.dialog(basestr, [characterChoice, "characterx"]);
								game.me.chooseButton(true, dialog, basenum).set("onfree", true);
								if (!_status.brawl || !_status.brawl.noAddSetting) {
									if (get.config("change_identity")) {
										addSetting(dialog);
									}
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
										var buttons = ui.create.div(".buttons");
										var node = _status.event.dialog.buttons[0].parentNode;
										_status.event.dialog.buttons = ui.create.buttons(list.randomGets(10), "characterx", buttons);
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
									if (!get.config("free_choose", "mjs")) {
										ui.cheat2.classList.add("disabled");
									}
								};
								if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
									if (!ui.cheat && get.config("change_choice", "mjs")) {
										ui.create.cheat();
									}
									if (!ui.cheat2 && get.config("free_choose", "mjs")) {
										ui.create.cheat2();
									}
								}
								"step 1"
								event.characterChoice.removeArray(result.links);
								if (ui.cheat) {
									ui.cheat.close();
									delete ui.cheat;
								}
								if (ui.cheat2) {
									ui.cheat2.close();
									delete ui.cheat2;
								}
								for (var i = 0; i < result.links.length; i++) {
									game.addRecentCharacter(result.links[i]);
								}
								game.me.init(result.links[0]);
								event.list.remove(game.me.name1);
								for (var i = 0; i < game.players.length; i++) {
									if (game.players[i] != game.me) {
										if (_status.brawl && _status.brawl.chooseCharacter) {
											var list = _status.brawl.chooseCharacter(event.list, game.players[i]);
											game.players[i].init(list.randomGet());
											event.list.remove(game.players[i].name1);
										} else {
											if (event.two_assign && game.players[i].side == game.me.side) {
												game.players[i].init(result.links[1]);
											} else {
												if (game.players[i].side == game.me.side) {
													var name = event.characterChoice.randomRemove();
												} else {
													var name = event.list.randomRemove();
												}
												if (lib.characterReplace[name] && lib.characterReplace[name].length) {
													name = lib.characterReplace[name].randomGet();
												}
												game.players[i].init(name);
											}
										}
									}
								}
								for (var i = 0; i < game.players.length; i++) {
									_status.characterlist.remove(game.players[i].name1);
								}
								setTimeout(function () {
									ui.arena.classList.remove("choose-character");
								}, 500);
								game.addGlobalSkill("versus_viewHandcard");
								if (get.config("two_phaseswap")) {
									game.addGlobalSkill("autoswap");
									if (lib.config.show_handcardbutton) {
										ui.versushs = ui.create.system("手牌", null, true);
										lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
									}
								}
							});
						},
					});
					Object.assign(lib.element.player, {
						dieAfter2() {
							const player = this, identity = player.identity;
							const targets = game.filterPlayer(target => target.identity == identity);
							if (targets.length == 1) {
								for (const target of targets) {
									target.addSkill("mjsguzhuyizhi");
								}
							}
						},
					});
					Object.assign(lib.translate, {
						fan: "楚",
						fan2: "楚军",
						zhong: "汉",
						zhong2: "汉军",
					});
				},
			},
		},
		jingdianshenfen: {
			name: "经典身份",
			mode: "identity",
			intro: [
				"经典身份",
			],
		},
		qianlidanqi: {
			name: "千里单骑",
			mode: "identity",
			intro: [
				"1.消耗1个天命令开始千里单骑挑战",
				"2.挑战开始后会随机生成地图，以层的形式排布，各个节点之间可能存在通路。地图中存在3种类型的节点，分别为战斗节点，事件节点与休息节点。玩家通过一个节点视为通过此层，通过地图上最高层视为通关此次千里单骑挑战。",
				"3.挑战中通过所有层关卡，或者玩家控制的武将阵亡后，挑战结束进行奖励结算。模式根据通过的层数随机发放义旗奖励，通过的层数越多,可以随机获得的最大义旗数量越多。",
				"4.模式分为8个难度等级，从“壹”到“捌”，通关前一难度即可解锁下一难度。",
				"5.难度每提升1级，地图层数+2，初始层敌方武将总属性+2，随机分配。同难度下每前进1层，敌方武将的总属性+2，随机分配。",
				"6.挑战中，“速度”越大的角色，座位号越靠前。（每轮开始时，如果有角色的速度大于座位号小于自己的角色，则重新根据速度进行排序）。",
			],
		},
		gongxingtianfa: {
			name: "龚行天罚",
			mode: "identity",
			intro: [
				"1.消耗1个天罚令开始龚行天罚挑战。",
				"2.每天00:00更换敌方武将。",
				"3.战胜敌方武将可获得随机数量的义旗奖励并概率获得1个对应敌方武将的信物。",
				"4.玩家可以通过使用对应敌方武将的信物在挑战中进行复活。",
				"5.挑战中，“速度”越大的角色，座位号越靠前。（每轮开始时，如果有角色的速度大于座位号小于自己的角色，则重新根据速度进行排序）。",
				"6.赵高与十常侍的技能无法被刻写，复制，转移，废除。",
			],
		},
		wuhoujiangwu: {
			name: "武侯讲武",
			mode: "identity",
			intro: [
				"1.玩家可以选择任意关卡进行挑战。",
				"2.完成任意关卡挑战可获得奖励，单个关卡的奖励不可重复获得。",
			],
		},
		qunxionghzulu: {
			name: "群雄逐鹿",
			mode: "identity",
			intro: [
				"1.群雄逐鹿模式中，所有玩家各自独立阵营。",
				"2.此模式支持使用变阵令、换将令，不支持亲率武将、熔炼武将。",
				"3.开始游戏需要至少100兵力，额外增加200兵力，额外选将+1；额外增加400兵力，额外选将+2，额外增加800兵力，额外选将+4，所有玩家都选择兵力后，进入选将阶段。",
				"4.游戏开始时，每个玩家根据消耗的兵力获得等量的青梅，并根据青梅数量从大到小排列座位号，相同者随机排列。",
				"5.所有玩家对其他玩家造成伤害后，获得目标玩家一半青梅；击杀其他玩家后，获得目标全部青梅，并摸3张牌。",
				"6.游戏中每轮开始时/有角色阵亡时，进行一次卜卦并根据卜卦结果切换一个天气效果，天气效果对所有角色生效。",
				"7.每个角色阵亡后，可消耗至少100兵力，重新选择一个武将再次登场，并获得等量青梅，每局游戏限2次。",
				"8.当仅剩最后3名玩家时，游戏结束，存活玩家胜利并获得自己当前的所有青梅。",
			],
		},
		binglinchengxia: {
			name: "兵临城下",
			mode: "doudizhu",
			intro: [
				"1.每局游戏会在3个城池中的随机1个城池进行。",
				"2.游戏开始后，三个玩家会先确定初始手牌和可选武将，此模式仅可在备战阶段使用换将令，变阵令。",
				"3.备战阶段，三个玩家需要同时选择要派出的兵力，派出兵力最大的玩家会成为城主，共有两次派兵阶段。",
				"4.如果出现派出的兵力相同的情况，则初始手牌总点数最小的一方成为城主。",
				"5.城主的目标是消灭所有联军，联军的目标是消灭城主，城主胜利后获得等于本局游戏备战阶段总兵力的青梅道具，联军获胜则根据各自在备战阶段与对局中消耗的兵力之和的比例分配等于本局游戏青梅池的青梅道具。",
			],
		},
	},
	skill: {
		mjsguzhuyizhi: {
			nobracket: true,
			mod: {
				cardUsable(card, player, num) {
					if (card.name == "sha") return num + 1;
				},
			},
			trigger: {
				player: "phaseDrawBegin2",
			},
			silent: true,
			forced: true,
			locked: false,
			charlotte: true,
			filter(event, player) {
				return !event.numFixed;
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
		},
		mjshanzhan: {
			trigger: {
				player: ["phaseDrawBegin2", "phaseBegin"],
			},
			silent: true,
			forced: true,
			locked: false,
			charlotte: true,
			filter(event, player) {
				if (game.roundNumber < 6) {
					return false;
				}
				return event.name == "phase" || !event.numFixed;
			},
			async content(event, trigger, player) {
				if (trigger.name == "phase") {
					player.addMark(event.name, 1, false);
				} else {
					trigger.num += player.countMark(event.name);
				}
			},
		},
	},
	translate: {
		mjsguzhuyizhi: "孤注一掷",
		mjsguzhuyizhi_info: "每回合额外摸1张牌，每个出牌阶段的出杀次数+1。",
		mjshanzhan: "酣战",
		mjshanzhan_info: "每回合额外摸1张牌，下回合摸牌数+1。",
	},
	splash: "extension/名将杀/image/ui/mode.jpg",
};
const info2 = {
	translate: "名将杀",
	config: {
		free_choose: {
			name: "自由选将",
			init: true,
			frequent: true,
		},
		change_choice: {
			name: "启用换将卡",
			init: true,
			frequent: true,
		},
		two_assign: {
			name: "代替队友选将",
			init: true,
			frequent: true,
		},
	},
	onremove() {
		game.clearModeConfig("mjs");
	},
};
game.addMode("mjs", info, info2);
