import { lib, game, ui, get, ai, _status } from "../noname.js";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "boss",
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
				return;
			}
			for (var i in lib.characterPack.mode_boss) {
				lib.character[i] = lib.characterPack.mode_boss[i];
			}
			for (var i in lib.skill) {
				if (lib.skill[i].seatRelated) {
					lib.skill[i] = {};
					if (lib.translate[i + "_info"]) {
						lib.translate[i + "_info"] = "此模式下不可用";
					}
				}
			}
			lib.translate.restart = "返回";
			lib.init.css(lib.assetURL + "layout/mode", "boss");
			game.delay(0.1);
			"step 1";
			var bosslist = ui.create.div("#bosslist.hidden");
			event.bosslist = bosslist;
			lib.setScroll(bosslist);
			// bosslist.ontouchmove = ui.click.touchScroll;
			// bosslist.style.WebkitOverflowScrolling='touch';
			if (!lib.config.touchscreen && lib.config.mousewheel) {
				bosslist._scrollspeed = 30;
				bosslist._scrollnum = 10;
				bosslist.onmousewheel = ui.click.mousewheel;
			}
			// var bosslistlinks={};
			// var toggleBoss=function(bool){
			//		game.saveConfig(this._link.config._name,bool,true);
			//		var node=bosslistlinks[this._link.config._name];
			//		if(bool){
			//			node.style.display='';
			//		}
			//		else{
			//			node.style.display='none';
			//		}
			// };
			var onpause = function () {
				ui.window.classList.add("bosspaused");
			};
			var onresume = function () {
				ui.window.classList.remove("bosspaused");
			};
			game.onpause = onpause;
			game.onpause2 = onpause;
			game.onresume = onresume;
			game.onresume2 = onresume;
			ui.create.div(bosslist);

			event.current = null;
			var list = [];
			if (lib.storage.current == undefined) lib.storage.current = "boss_hundun";
			for (var i in lib.character) {
				var info = lib.character[i];
				if (info.isBoss) {
					// var cfg=i+'_bossconfig';
					// if(get.config(cfg)==undefined){
					//		game.saveConfig(cfg,true,true);
					// }
					// lib.translate[cfg+'_config']=lib.translate[i];
					// lib.mode.boss.config[cfg]={
					//		name:get.translation(i),
					//		onclick:toggleBoss,
					//		init:true,
					// }
					var player = ui.create.player(bosslist).init(i);
					if (lib.characterPack.mode_boss[i] && get.config(i + "_boss_config") == false) {
						player.style.display = "none";
					}
					if (player.hp == 0) {
						player.node.hp.style.display = "none";
					}
					list.push(player);
					player.node.hp.classList.add("text");
					player.node.hp.dataset.condition = "";
					player.node.hp.innerHTML = info[2];
					if (info[2] == Infinity) {
						player.node.hp.innerHTML = "∞";
					}
					player.setIdentity(player.name);
					player.node.identity.dataset.color = info[5];
					// bosslistlinks[cfg]=player;
					player.classList.add("bossplayer");

					if (lib.storage.current == i) {
						event.current = player;
						player.classList.add("highlight");
						if (!lib.config.continue_name_boss && lib.boss[i] && lib.boss[i].control) {
							_status.bosschoice = lib.boss[i].control();
							_status.bosschoice.name = i;
							_status.bosschoice.link = lib.boss[i].controlid || i;
						}
					}

					// if(!get.config(cfg)){
					//		player.style.display='none';
					// }
				}
			}
			if (!list.length) {
				alert("没有可挑战的BOSS");
				event.finish();
				lib.init.onfree();
				_status.over = true;
				return;
			}
			if (!event.current) {
				event.current = bosslist.childNodes[1];
				event.current.classList.add("highlight");
			}
			ui.create.div(bosslist);
			ui.create.cardsAsync();
			game.finishCards();
			game.addGlobalSkill("autoswap");
			ui.arena.setNumber(8);
			ui.control.style.transitionProperty = "opacity";
			ui.control.classList.add("bosslist");
			setTimeout(function () {
				ui.control.style.transitionProperty = "";
			}, 1000);

			ui.window.appendChild(bosslist);

			setTimeout(function () {
				if (event.current) {
					var left = event.current.offsetLeft - (ui.window.offsetWidth - 180) / 2;
					if (bosslist.scrollLeft < left) {
						bosslist.scrollLeft = left;
					}
				}
				bosslist.show();
			}, 200);
			game.me = ui.create.player();
			if (lib.config.continue_name_boss) {
				event.noslide = true;
				lib.init.onfree();
			} else {
				game.chooseCharacter(function (target) {
					if (event.current) {
						event.current.classList.remove("highlight");
					}
					event.current = target;
					game.save("current", target.name);
					target.classList.add("highlight");
					if (_status.bosschoice) {
						var name = target.name;
						if (lib.boss[target.name] && lib.boss[target.name].controlid) {
							name = lib.boss[target.name].controlid;
						}
						if (_status.bosschoice.link != name) {
							lib.boss[_status.bosschoice.name].control("cancel", _status.bosschoice);
							_status.bosschoice.classList.remove("disabled");
							_status.bosschoice.close();
							delete _status.bosschoice;
						} else {
							return;
						}
					}
					if (lib.boss[target.name] && lib.boss[target.name].control) {
						_status.createControl = ui.control.firstChild;
						_status.bosschoice = lib.boss[target.name].control();
						_status.bosschoice.name = target.name;
						_status.bosschoice.link = lib.boss[target.name].controlid || target.name;
						if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
							_status.bosschoice.classList.add("disabled");
						}
						delete _status.createControl;
					}
				});
			}
			if (lib.config.test_game) {
				event.current.classList.remove("highlight");
				if (event.current.nextSibling && event.current.nextSibling.classList.contains("player")) {
					event.current = event.current.nextSibling;
				} else {
					event.current = event.current.parentNode.childNodes[1];
				}
				game.save("current", event.current.name);
			}
			"step 2";
			game.bossinfo = lib.boss.global;
			for (var i in lib.boss[event.current.name]) {
				game.bossinfo[i] = lib.boss[event.current.name][i];
			}

			setTimeout(function () {
				ui.control.classList.remove("bosslist");
			}, 500);
			var boss = ui.create.player();
			boss.getId();
			game.boss = boss;
			boss.init(event.current.name);
			boss.side = true;
			if (!event.noslide) {
				var rect = event.current.getBoundingClientRect();
				boss.addTempClass("bossing");
				boss.node.hp.addTempClass("start");
				boss.bossinginfo = [rect.left + rect.width / 2, rect.top + rect.height / 2];
				boss.style.transition = "all 0s";
				boss.node.equips.style.opacity = "0";
			} else {
				boss.addTempClass("start");
			}
			boss.setIdentity("zhu");
			boss.identity = "zhu";
			if (lib.config.continue_name_boss) {
				result = lib.config.continue_name_boss;
				game.saveConfig("continue_name_boss");
			}
			for (var i = 0; i < result.links.length; i++) {
				var player = ui.create.player();
				player.getId();
				player.init(result.links[i]).addTempClass("start");
				player.setIdentity("cai");
				player.identity = "cai";
				player.side = false;
				game.players.push(player);
				if (result.boss) {
					if (game.bossinfo.minion) {
						player.dataset.position = i + 3;
					} else {
						player.dataset.position = (i + 1) * 2;
					}
				} else {
					player.dataset.position = i + 1;
				}
				ui.arena.appendChild(player);
			}
			if (result.boss) {
				game.players.unshift(boss);
				boss.dataset.position = 0;
			} else {
				game.players.push(boss);
				boss.dataset.position = 7;
			}
			if (game.bossinfo.minion) {
				if (!result.boss) {
					boss.dataset.position = 6;
				}
				for (var i in game.bossinfo.minion) {
					var player = ui.create.player();
					player.getId();
					player.init(game.bossinfo.minion[i]);
					if (boss.bossinginfo) {
						player.addTempClass("bossing");
						player.node.hp.addTempClass("start");
						player.style.transition = "all 0s";
					} else {
						player.addTempClass("start");
					}
					player.setIdentity("zhong");
					player.identity = "zhong";
					player.side = true;
					game.players.push(player);
					var num = parseInt(i);
					if (result.boss) {
						player.dataset.position = num - 1;
					} else {
						if (num == 2) {
							player.dataset.position = 7;
						} else {
							player.dataset.position = num - 3;
						}
					}
					ui.arena.appendChild(player);
					if (boss.bossinginfo) {
						var rect = player.getBoundingClientRect();
						player.style.transform = "translate(" + (boss.bossinginfo[0] - rect.left - rect.width / 2) + "px," + (boss.bossinginfo[1] - rect.top - rect.height / 2) + "px) scale(1.1)";
						ui.refresh(player);
						player.style.transition = "";
						player.style.transform = "";
					}
				}
			}
			ui.create.me();
			ui.fakeme = ui.create.div(".fakeme.avatar", ui.me);
			if (game.me !== boss) {
				game.singleHandcard = true;
				ui.arena.classList.add("single-handcard");
				ui.window.classList.add("single-handcard");
				game.onSwapControl();

				if (lib.config.show_handcardbutton) {
					lib.setPopped(
						ui.create.system("手牌", null, true),
						function () {
							var uiintro = ui.create.dialog("hidden");
							var players = game.players.concat(game.dead);
							for (var i = 0; i < players.length; i++) {
								if (players[i].side == game.me.side && players[i] != game.me) {
									uiintro.add(get.translation(players[i]));
									var cards = players[i].getCards("h");
									if (cards.length) {
										uiintro.addSmall(cards, true);
									} else {
										uiintro.add("（无）");
									}
								}
							}
							return uiintro;
						},
						220
					);
				}
			} else {
				ui.fakeme.style.display = "none";
			}
			if (game.bossinfo.chongzheng) {
				lib.setPopped(
					ui.create.system("重整", null, true),
					function () {
						var uiintro = ui.create.dialog("hidden");

						uiintro.add("重整");
						var table = ui.create.div(".bosschongzheng");

						var tr,
							td,
							added = false;
						for (var i = 0; i < game.dead.length; i++) {
							if (typeof game.dead[i].storage.boss_chongzheng !== "number") continue;
							added = true;
							tr = ui.create.div(table);
							td = ui.create.div(tr);
							td.innerHTML = get.translation(game.dead[i]);
							td = ui.create.div(tr);
							if (game.dead[i].maxHp > 0) {
								td.innerHTML = "剩余" + (game.bossinfo.chongzheng - game.dead[i].storage.boss_chongzheng) + "回合";
							} else {
								td.innerHTML = "无法重整";
							}
						}
						if (!added) {
							uiintro.add('<div class="text center">（无重整角色）</div>');
							uiintro.add(ui.create.div(".placeholder.slim"));
						} else {
							uiintro.add(table);
						}
						return uiintro;
					},
					180
				);
			}
			ui.single_swap = ui.create.system(
				"换人",
				function () {
					var players = get.players(game.me);
					players.remove(game.boss);
					if (players.length > 1) {
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
						game.modeSwapPlayer(players[1]);
					}
				},
				true
			);
			if (get.config("single_control") || game.me == game.boss) {
				ui.single_swap.style.display = "none";
			}

			ui.arena.appendChild(boss);
			if (boss.bossinginfo) {
				var rect = boss.getBoundingClientRect();
				boss.style.transform = "translate(" + (boss.bossinginfo[0] - rect.left - rect.width / 2) + "px," + (boss.bossinginfo[1] - rect.top - rect.height / 2) + "px) scale(1.1)";
				ui.refresh(boss);
				boss.style.transition = "";
				boss.style.transform = "";
				delete boss.bossinginfo;
				setTimeout(function () {
					boss.node.equips.style.opacity = "";
				}, 500);
			}

			event.bosslist.delete();

			game.arrangePlayers();
			for (var i = 0; i < game.players.length; i++) {
				game.players[i].node.action.innerHTML = "行动";
			}

			var players = get.players(lib.sort.position);
			var info = [];
			for (var i = 0; i < players.length; i++) {
				info.push({
					name: players[i].name1,
					identity: players[i].identity,
					position: players[i].dataset.position,
				});
			}
			(_status.videoInited = true), (info.boss = game.me == game.boss);
			game.addVideo("init", null, info);
			if (game.bossinfo.init) {
				game.bossinfo.init();
			}
			delete lib.boss;
			"step 3";
			if (get.config("single_control")) {
				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i].side == game.me.side) {
						game.addRecentCharacter(game.players[i].name);
					}
				}
			} else {
				game.addRecentCharacter(game.me.name);
			}
			event.trigger("gameStart");
			game.gameDraw(game.boss, game.bossinfo.gameDraw || 4);
			game.bossPhaseLoop();
			setTimeout(function () {
				ui.updatehl();
			}, 200);
		},
		element: {
			player: {
				dieAfter: function () {
					if (this != game.boss) {
						this.storage.boss_chongzheng = 0;
					}
					if (game.bossinfo.checkResult && game.bossinfo.checkResult(this) === false) {
						return;
					}
					if (
						this == game.boss ||
						!game.hasPlayer(function (current) {
							return !current.side;
						}, true)
					) {
						game.checkResult();
					}
				},
			},
		},
		card: {
			niaobaidaowenha: {
				type: "equip",
				subtype: "equip5",
				skills: ["niaobaidaowenha_skill"],
				modeimage: "boss",
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				fullskin: true,
			},
			goujiangdesidai: {
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -6 },
				skills: ["goujiangdesidai_skill"],
				modeimage: "boss",
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				fullskin: true,
			},
			shenzhixiunvfu: {
				type: "equip",
				subtype: "equip2",
				modeimage: "boss",
				fullskin: true,
			},
			gubuzifeng: {
				type: "trick",
				fullskin: true,
				modeimage: "boss",
				enable: true,
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					target.addTempSkill("gubuzifeng_disable", { player: "phaseAfter" });
					var skills = target.getSkills(null, false);
					for (var i = 0; i < skills.length; i++) {
						if (get.info(skills[i]).charlotte) skills.splice(i--, 1);
					}
					if (skills.length) {
						target.storage.gubuzifeng_disable.push(skills.randomGet());
						target.disableSkill("gubuzifeng_disable", target.storage.gubuzifeng_disable);
					}
				},
				ai: {
					order: 12,
					result: {
						target: function (player, target) {
							return -2;
						},
					},
				},
			},
			lingsheji: {
				type: "equip",
				subtype: "equip5",
				skills: ["lingsheji"],
				modeimage: "boss",
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				fullskin: true,
			},
			shanrangzhaoshu: {
				type: "equip",
				subtype: "equip5",
				skills: ["shanrangzhaoshu"],
				modeimage: "boss",
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				fullskin: true,
			},
			xingtianpojunfu: {
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -3 },
				skills: ["noda_axe"],
				modeimage: "boss",
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				fullskin: true,
			},
			jinwuluorigong: {
				type: "equip",
				subtype: "equip1",
				skills: ["iwasawa_crowbow"],
				modeimage: "boss",
				distance: { attackFrom: -8 },
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				fullskin: true,
			},
			boss_mengpohuihun: {
				mode: ["boss"],
				type: "trick",
				modeimage: "boss",
				fullskin: true,
				selectTarget: -1,
				enable: true,
				toself: true,
				multitarget: true,
				global: ["boss_mengpohuihun1"],
				modTarget: true,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				content: function () {
					game.countPlayer2(function (current) {
						current.enableSkill("boss_wanghun");
					});
				},
				ai: {
					basic: {
						order: function () {
							return 11;
						},
						useful: [3, 1],
						value: 10,
					},
					result: {
						player: function (player, target) {
							if (player == game.boss) {
								return -2;
							} else {
								return 5;
							}
						},
					},
				},
			},
			sadouchengbing: {
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				cardcolor: "red",
				toself: true,
				modeimage: "boss",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				content: function () {
					var num = Math.min(5, target.maxHp);
					if (target.group == "shen") {
						target.draw(num);
					} else {
						var nh = target.countCards("h");
						if (nh < num) {
							target.draw(num - nh);
						}
					}
				},
				ai: {
					basic: {
						order: 7.2,
						useful: 4.5,
						value: 9.2,
					},
					result: {
						target: function (player, target) {
							var num = Math.min(5, target.maxHp);
							if (target.group == "shen") {
								return Math.sqrt(num);
							} else {
								var nh = target.countCards("h");
								if (target == player && player.countCards("h", "sadouchengbing")) {
									nh--;
								}
								if (nh < num) {
									return Math.sqrt(num - nh);
								}
							}
							return 0;
						},
					},
					tag: {
						draw: 2,
					},
				},
			},
			yihuajiemu: {
				type: "trick",
				fullskin: true,
				modeimage: "boss",
				enable: true,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("he");
				},
				content: function () {
					"step 0";
					if (target.hasSha()) {
						target.chooseToUse(function (card, player, event) {
							return get.name(card) == "sha" && lib.filter.filterCard.apply(this, arguments);
						}, "使用一张杀，或交给" + get.translation(player) + "两张牌");
					} else {
						event.directfalse = true;
					}
					"step 1";
					var nh = target.countCards("he");
					if ((event.directfalse || !result.bool) && nh) {
						if (nh <= 2) {
							event.directcards = true;
						} else {
							target.chooseCard("he", 2, true, "将两张牌交给" + get.translation(player));
						}
					} else {
						event.finish();
					}
					"step 2";
					if (event.directcards) {
						target.give(target.getCards("he"), player);
					} else if (result.bool && result.cards && result.cards.length) {
						target.give(result.cards, player);
					}
				},
				ai: {
					order: 7,
					result: {
						target: function (player, target) {
							if (target.hasSha() && _status.event.getRand() < 0.5) return 1;
							return -2;
						},
					},
				},
			},
			chiyanzhenhunqin: {
				type: "equip",
				fullskin: true,
				subtype: "equip1",
				modeimage: "boss",
				distance: { attackFrom: -3 },
				skills: ["chiyanzhenhunqin"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 5,
				},
			},
			juechenjinge: {
				type: "equip",
				fullskin: true,
				modeimage: "boss",
				subtype: "equip3",
				skills: ["juechenjinge"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 9,
				},
			},
			xiuluolianyuji: {
				type: "equip",
				fullskin: true,
				subtype: "equip1",
				modeimage: "boss",
				distance: { attackFrom: -3 },
				skills: ["xiuluolianyuji"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 9,
				},
			},
			longfenghemingjian: {
				type: "equip",
				fullskin: true,
				modeimage: "boss",
				subtype: "equip1",
				distance: { attackFrom: -2 },
				skills: ["longfenghemingjian"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 9,
				},
			},
			qicaishenlu: {
				fullskin: true,
				modeimage: "boss",
				type: "equip",
				subtype: "equip4",
				distance: { globalFrom: -1 },
				skills: ["qicaishenlu"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 9,
				},
			},
			honghuangzhili: {
				type: "trick",
				enable: true,
				fullskin: true,
				filterTarget: true,
				modeimage: "boss",
				content: function () {
					if (target.group == "shen") {
						target.addSkill("honghuangzhili");
						if (target.countCards("he")) {
							player.gainPlayerCard(target, "he", true);
						}
					} else {
						target.turnOver();
					}
				},
				ai: {
					order: 4,
					value: 10,
					result: {
						target: function (player, target) {
							if (target.group == "shen") {
								if (target.countCards("he")) return -2;
								return 0;
							} else {
								if (target.isTurnedOver()) return 4;
								return -3;
							}
						},
					},
				},
			},
		},
		characterPack: {
			mode_boss: {
				boss_hundun: ["male", "qun", 25, ["boss_xiongshou", "boss_wuzang", "boss_xiangde", "boss_yinzei", "boss_yinzei_switch"], ["qun", "boss", "bossallowed"], "qun"],
				boss_qiongqi: ["male", "qun", "20/25", ["boss_xiongshou", "boss_zhue", "boss_futai", "boss_yandu", "boss_yandu_switch"], ["qun", "boss", "bossallowed"], "qun"],
				boss_taotie: ["male", "qun", 20, ["boss_xiongshou", "boss_tanyu", "boss_cangmu", "boss_jicai", "boss_jicai_switch"], ["qun", "boss", "bossallowed"], "qun"],
				boss_taowu: ["male", "qun", 25, ["boss_xiongshou", "boss_minwan", "boss_nitai", "boss_luanchang", "boss_luanchang_switch"], ["qun", "boss", "bossallowed"], "qun"],
				boss_zhuyin: ["male", "qun", 4, ["boss_xiongshou"], ["qun", "hiddenboss", "bossallowed"], "qun"],

				boss_xiangliu: ["male", "qun", 25, ["boss_yaoshou", "boss_duqu", "boss_jiushou", "boss_echou", "boss_echou_switch"], ["qun", "boss", "bossallowed"], "qun"],
				boss_zhuyan: ["male", "qun", "25/30", ["boss_yaoshou", "boss_bingxian", "boss_juyuan", "boss_xushi", "boss_xushi_switch"], ["qun", "boss", "bossallowed"], "qun"],
				boss_bifang: ["male", "qun", 25, ["boss_yaoshou", "boss_zhaohuo", "boss_honglianx", "boss_yanyu", "boss_yanyu_switch"], ["qun", "boss", "bossallowed"], "qun"],
				boss_yingzhao: ["male", "qun", 25, ["boss_yaoshou", "boss_fengdong", "boss_xunyou", "boss_sipu", "boss_sipu_switch"], ["qun", "boss", "bossallowed"], "qun"],

				boss_qingmushilian: ["male", "", 0, ["boss_qingmu", "boss_qingmu_intro1", "boss_qingmu_intro2", "boss_qingmu_intro3"], ["boss"], "wu"],
				boss_qinglong: ["male", "qun", 4, ["boss_shenyi", "releiji", "boss_qingmu2"], ["wu", "hiddenboss", "bossallowed"]],
				boss_mushengoumang: ["male", "shen", 5, ["boss_shenyi", "boss_buchun", "boss_qingmu3"], ["wu", "hiddenboss", "bossallowed"]],
				boss_shujing: ["female", "shen", 2, ["boss_cuidu"], ["wu", "hiddenboss", "bossallowed"]],
				boss_taihao: ["male", "shen", 6, ["boss_shenyi", "boss_shenen", "boss_qingyi"], ["wu", "hiddenboss", "bossallowed"]],

				boss_chiyanshilian: ["male", "", 0, ["boss_chiyan", "boss_chiyan_intro1", "boss_chiyan_intro2", "boss_chiyan_intro3"], ["boss"], "zhu"],
				boss_zhuque: ["female", "shen", 4, ["boss_shenyi", "boss_fentian", "boss_chiyan2"], ["shu", "hiddenboss", "bossallowed"]],
				boss_huoshenzhurong: ["male", "shen", 5, ["boss_shenyi", "boss_xingxia", "boss_chiyan3"], ["shu", "hiddenboss", "bossallowed"]],
				boss_yanling: ["male", "shen", 4, ["boss_huihuo", "boss_furan"], ["shu", "hiddenboss", "bossallowed"]],
				boss_yandi: ["male", "shen", 6, ["boss_shenyi", "boss_shenen", "boss_chiyi"], ["shu", "hiddenboss", "bossallowed"]],

				boss_baimangshilian: ["male", "", 0, ["boss_baimang", "boss_baimang_intro1", "boss_baimang_intro2", "boss_baimang_intro3"], ["boss"], "qun"],
				boss_baihu: ["male", "shen", 4, ["boss_shenyi", "boss_kuangxiao", "boss_baimang2"], ["qun", "hiddenboss", "bossallowed"]],
				boss_jinshenrushou: ["male", "shen", 5, ["boss_shenyi", "boss_xingqiu", "boss_baimang3"], ["qun", "hiddenboss", "bossallowed"]],
				boss_mingxingzhu: ["female", "shen", 3, ["boss_qingzhu", "boss_jiazu", "boss_jiding"], ["qun", "hiddenboss", "bossallowed"]],
				boss_shaohao: ["male", "shen", 6, ["boss_shenyi", "boss_shenen", "boss_baiyi"], ["qun", "hiddenboss", "bossallowed"]],

				boss_xuanlinshilian: ["male", "", 0, ["boss_xuanlin", "boss_xuanlin_intro1", "boss_xuanlin_intro2", "boss_xuanlin_intro3"], ["boss"], "wei"],
				boss_xuanwu: ["male", "shen", 4, ["boss_shenyi", "boss_lingqu", "boss_xuanlin2"], ["wei", "hiddenboss", "bossallowed"]],
				boss_shuishengonggong: ["male", "shen", 5, ["boss_shenyi", "boss_juehong", "boss_xuanlin3"], ["wei", "hiddenboss", "bossallowed"]],
				boss_shuishenxuanming: ["female", "shen", 5, ["boss_shenyi", "boss_zirun", "boss_xuanlin3"], ["wei", "hiddenboss", "bossallowed"]],
				boss_zhuanxu: ["male", "shen", 6, ["boss_shenyi", "boss_shenen", "boss_zaoyi"], ["wei", "hiddenboss", "bossallowed"]],

				boss_zhuoguiquxie: ["male", "", 0, ["boss_bianshen", "boss_bianshen_intro1", "boss_bianshen_intro2", "boss_bianshen_intro3", "boss_bianshen_intro4"], ["boss"], "shu"],
				boss_nianshou_heti: ["male", "shen", 12, ["boss_nianrui", "boss_mengtai", "boss_nbianshen", "boss_nbianshenx"], ["shu", "boss", "bossallowed"], "shu"],
				boss_nianshou_jingjue: ["male", "shen", 12, ["boss_nianrui", "boss_mengtai", "boss_jingjue", "boss_nbianshen"], ["shu", "hiddenboss", "bossallowed"], "shu"],
				boss_nianshou_renxing: ["male", "shen", 12, ["boss_nianrui", "boss_mengtai", "boss_renxing", "boss_nbianshen"], ["shu", "hiddenboss", "bossallowed"], "shu"],
				boss_nianshou_ruizhi: ["male", "shen", 12, ["boss_nianrui", "boss_mengtai", "boss_ruizhi", "boss_nbianshen"], ["shu", "hiddenboss", "bossallowed"], "shu"],
				boss_nianshou_baonu: ["male", "shen", 12, ["boss_nianrui", "boss_mengtai", "boss_nbaonu", "boss_shouyi", "boss_nbianshen"], ["shu", "hiddenboss", "bossallowed"], "shu"],

				boss_baiwuchang: ["male", "shen", 9, ["boss_baolian", "boss_qiangzheng", "boss_zuijiu", "juece", "boss_bianshen4"], ["shu", "hiddenboss", "bossallowed"]],
				boss_heiwuchang: ["male", "shen", 9, ["boss_guiji", "boss_taiping", "boss_suoming", "boss_xixing", "boss_bianshen4"], ["shu", "hiddenboss", "bossallowed"]],
				boss_luocha: ["female", "shen", 12, ["boss_modao", "boss_yushou", "yizhong", "boss_moyany"], ["shu", "hiddenboss", "bossallowed"]],
				boss_yecha: ["male", "shen", 11, ["boss_modao", "boss_mojian", "bazhen", "boss_danshu"], ["shu", "hiddenboss", "bossallowed"]],
				boss_niutou: ["male", "shen", 7, ["boss_baolian", "niepan", "boss_manjia", "boss_xiaoshou", "boss_bianshen3"], ["shu", "hiddenboss", "bossallowed"]],
				boss_mamian: ["male", "shen", 6, ["boss_guiji", "fankui", "boss_lianyu", "juece", "boss_bianshen3"], ["shu", "hiddenboss", "bossallowed"]],
				boss_chi: ["male", "shen", 5, ["boss_guimei", "boss_didong", "boss_shanbeng", "boss_bianshen2"], ["shu", "hiddenboss", "bossallowed"]],
				boss_mo: ["female", "shen", 5, ["boss_guimei", "enyuan", "boss_beiming", "boss_bianshen2"], ["shu", "hiddenboss", "bossallowed"]],
				boss_wang: ["male", "shen", 5, ["boss_guimei", "boss_luolei", "huilei", "boss_bianshen2"], ["shu", "hiddenboss", "bossallowed"]],
				boss_liang: ["female", "shen", 5, ["boss_guimei", "boss_guihuo", "boss_minbao", "boss_bianshen2"], ["shu", "hiddenboss", "bossallowed"]],

				boss_qinguangwang: ["male", "qun", 3, ["boss_panguan", "boss_juhun", "boss_wangxiang", "boss_newhuanren"], ["shu", "boss", "bossallowed"], "shu"],
				boss_chujiangwang: ["male", "qun", 4, ["weimu", "refankui", "boss_bingfeng"], ["shu", "hiddenboss", "bossallowed"]],
				boss_songdiwang: ["male", "qun", 4, ["boss_heisheng", "boss_shengfu", "enyuan"], ["shu", "hiddenboss", "bossallowed"]],
				boss_wuguanwang: ["male", "qun", 4, ["boss_zhiwang", "boss_gongzheng", "boss_xuechi"], ["shu", "hiddenboss", "bossallowed"]],
				boss_yanluowang: ["male", "qun", 4, ["boss_tiemian", "boss_zhadao", "boss_zhuxin"], ["shu", "hiddenboss", "bossallowed"]],
				boss_bianchengwang: ["male", "qun", 4, ["boss_leizhou", "boss_leifu", "boss_leizhu"], ["shu", "hiddenboss", "bossallowed"]],
				boss_taishanwang: ["male", "qun", 4, ["boss_fudu", "boss_kujiu", "boss_renao"], ["shu", "hiddenboss", "bossallowed"]],
				boss_dushiwang: ["male", "qun", 4, ["boss_remen", "boss_zhifen", "boss_huoxing"], ["shu", "hiddenboss", "bossallowed"]],
				boss_pingdengwang: ["male", "qun", 4, ["boss_suozu", "boss_abi", "boss_pingdeng"], ["shu", "hiddenboss", "bossallowed"]],
				boss_zhuanlunwang: ["male", "qun", 6, ["boss_modao", "boss_lunhui", "boss_wangsheng", "boss_zlfanshi"], ["shu", "hiddenboss", "bossallowed"]],
				boss_mengpo: ["female", "qun", 3, ["boss_shiyou", "boss_wanghun", "boss_wangshi"], ["shu", "hiddenboss", "bossallowed"]],
				boss_dizangwang: ["male", "qun", 8, ["boss_bufo", "boss_wuliang", "boss_dayuan", "boss_diting"], ["shu", "hiddenboss", "bossallowed"]],
				//boss_shikieiki:['female','qun',8,['boss_yingzhong'],['qun','hiddenboss','bossallowed']],

				boss_lvbu1: ["male", "shen", 8, ["mashu", "wushuang", "boss_baonu", "boss_jingjia", "boss_aozhan"], ["qun", "boss", "bossallowed"], "qun"],
				boss_lvbu2: ["male", "shen", 6, ["mashu", "wushuang", "xiuluo", "shenwei", "shenji"], ["qun", "hiddenboss", "bossallowed"], "qun"],
				boss_lvbu3: ["male", "shen", 6, ["wushuang", "shenqu", "jiwu"], ["qun", "hiddenboss", "bossallowed"], "qun"],

				boss_caocao: ["male", "shen", 12, ["boss_guixin", "xiongcai"], ["wei", "boss", "bossallowed"], "wei"],
				boss_guojia: ["male", "shen", 4, ["tiandu", "boss_guimou", "boss_yuance", "boss_qizuo"], ["wei", "boss", "bossallowed"], "zhu"],
				boss_zhangchunhua: ["female", "shen", 4, ["jueqing", "boss_wuxin", "shangshix"], ["wei", "boss", "bossallowed"], "wei"],
				boss_zhenji: ["female", "shen", 4, ["tashui", "lingbo", "jiaoxia", "fanghua"], ["wei", "boss", "bossallowed"], "wei"],

				boss_liubei: ["male", "shen", 8, ["xiaoxiong", "boss_zhangwu"], ["shu", "boss", "bossallowed"], "qun"],
				boss_zhugeliang: ["male", "shen", "Infinity/Infinity", ["xiangxing", "yueyin", "fengqi", "gaiming"], ["shu", "boss", "bossallowed"], "qun"],
				boss_huangyueying: ["female", "shen", 4, ["boss_gongshen", "boss_jizhi", "qicai", "boss_guiyin"], ["shu", "boss", "bossallowed"], "wei"],
				boss_pangtong: ["male", "shen", 4, ["boss_tianyu", "qiwu", "niepan", "boss_yuhuo"], ["shu", "boss", "bossallowed"], "zhu"],

				boss_zhouyu: ["male", "shen", 6, ["huoshen", "boss_honglian", "boss_xianyin"], ["wu", "boss", "bossallowed"], "zhu"],

				boss_caiwenji: ["female", "shen", 4, ["beige", "boss_hujia", "boss_guihan"], ["qun", "boss", "bossallowed"], "wei"],
				boss_zhangjiao: ["male", "shen", 8, ["boss_leiji", "tiandao", "jidian"], ["qun", "boss", "bossallowed"], "shu"],
				boss_zuoci: ["male", "shen", 0, ["huanhua"], ["qun", "boss", "bossallowed"], "shu"],

				boss_diaochan: ["female", "shen", 4, ["fengwu", "yunshen", "lianji", "boss_wange", "yuehun"], ["qun", "boss", "bossallowed"], "qun"],
				boss_huatuo: ["male", "shen", 6, ["chulao", "mazui", "boss_shengshou", "guizhen", "wuqin"], ["qun", "boss", "bossallowed"], "wu"],
				boss_dongzhuo: ["male", "shen", 20, ["jiuchi", "boss_qiangzheng", "boss_baolin"], ["qun", "boss", "bossallowed"], "shu"],

				boss_sunce: ["male", "shen", "1/8", ["boss_jiang", "boss_hunzi", "boss_hunyou", "boss_taoni"], ["qun", "boss", "bossallowed", "InitFilter:noZhuHp:noZhuSkill", "die:sunce"], "wu"],

				// boss_nianshou:['male','shen',Infinity,['boss_nianrui','boss_qixiang','boss_damagecount'],['boss'],'shu'],
				// boss_yuji:['male','qun',8,[],['boss','bossallowed'],'nei'],
				// boss_shuijing:['male','qun',8,[],['boss','bossallowed'],'wei'],
				// boss_sunshangxiang:['male','qun',8,[],['boss','bossallowed'],'wei'],
			},
		},
		cardPack: {
			mode_boss: ["honghuangzhili", "sadouchengbing", "yihuajiemu", "chiyanzhenhunqin", "juechenjinge", "xiuluolianyuji", "longfenghemingjian", "qicaishenlu", "hongmianbaihuapao", "boss_mengpohuihun", "lingsheji", "shanrangzhaoshu", "jinwuluorigong", "xingtianpojunfu", "gubuzifeng"],
		},
		init() {
			for (var i in lib.characterPack.mode_boss) {
				if (lib.characterPack.mode_boss[i].isHiddenBoss) continue;
				lib.mode.boss.config[i + "_boss_config"] = {
					name: get.translation(i),
					init: true,
					unfrequent: true,
				};
			}
		},
		game: {
			reserveDead: true,
			addBossFellow: function (position, name) {
				var fellow = game.addFellow(position, name, "zoominanim");
				fellow.directgain(get.cards(4));
				fellow.side = true;
				fellow.identity = "zhong";
				fellow.setIdentity("zhong");
				game.addVideo("setIdentity", fellow, "zhong");
			},
			changeBoss: function (name, player) {
				if (!player) {
					if (game.additionaldead) {
						game.additionaldead.push(game.boss);
					} else {
						game.additionaldead = [game.boss];
					}
					player = game.boss;
					delete game.boss;
				}

				player.delete();
				game.players.remove(player);
				game.dead.remove(player);
				var boss = ui.create.player();
				boss.getId();
				boss.init(name);
				boss.side = true;
				game.addVideo("bossSwap", player, (game.boss ? "_" : "") + boss.name);
				boss.dataset.position = player.dataset.position;
				if (game.me == player) {
					game.swapControl(boss);
				}
				game.players.push(boss.addTempClass("zoominanim"));
				game.arrangePlayers();
				if (!game.boss) {
					game.boss = boss;
					boss.setIdentity("zhu");
					boss.identity = "zhu";
				} else {
					boss.setIdentity("zhong");
					boss.identity = "zhong";
				}
				ui.arena.appendChild(boss);
				boss.directgain(get.cards(4));
			},
			checkResult: function () {
				if (game.boss == game.me) {
					game.over(game.boss.isAlive());
				} else {
					game.over(!game.boss.isAlive());
				}
			},
			getVideoName: function () {
				var str = get.translation(game.me.name);
				if (game.me.name2) {
					str += "/" + get.translation(game.me.name2);
				}
				var str2 = "挑战";
				if (game.me != game.boss) {
					str2 += " - " + get.translation(game.boss);
				}
				var name = [str, str2];
				return name;
			},
			bossPhaseLoop: function () {
				var next = game.createEvent("phaseLoop");
				if (game.bossinfo.loopFirst) {
					next.player = game.bossinfo.loopFirst();
				} else {
					next.player = game.boss;
				}
				_status.looped = true;
				next.setContent(function () {
					"step 0";
					if (player.chongzheng) {
						player.chongzheng = false;
					} else if (player.isDead()) {
						if (player.hp < 0) player.hp = 0;
						player.storage.boss_chongzheng++;
						if (player.maxHp > 0 && game.bossinfo.chongzheng) {
							if (player.hp < player.maxHp) {
								player.hp++;
							} else if (player.countCards("h") < 4) {
								var card = get.cards()[0];
								var sort = lib.config.sort_card(card);
								var position = sort > 0 ? player.node.handcards1 : player.node.handcards2;
								card.fix();
								card.addTempClass("start");
								position.insertBefore(card, position.firstChild);
							}
							player.update();
							if (player.storage.boss_chongzheng >= game.bossinfo.chongzheng) {
								player.revive(player.hp);
							}
						}
						if (game.bossinfo.loopType == 2) {
							game.boss.chongzheng = true;
						}
					} else {
						if (player.identity == "zhu" && game.boss != player) {
							player = game.boss;
						}
						player.phase();
					}
					"step 1";
					if (game.bossinfo.loopType == 2) {
						_status.roundStart = true;
						if (event.player == game.boss) {
							if (!_status.last || _status.last.nextSeat == game.boss) {
								event.player = game.boss.nextSeat;
							} else {
								event.player = _status.last.nextSeat;
							}
						} else {
							_status.last = player;
							event.player = game.boss;
							if (player.nextSeat == game.boss) {
								delete _status.roundStart;
							}
						}
					} else {
						event.player = event.player.nextSeat;
					}
					event.goto(0);
				});
			},
			onSwapControl: function () {
				if (game.me == game.boss) return;
				game.addVideo("onSwapControl");
				var name = game.me.name;
				if (ui.fakeme && ui.fakeme.current != name) {
					ui.fakeme.current = name;
					if (ui.versushighlight && ui.versushighlight != game.me) {
						ui.versushighlight.classList.remove("current_action");
					}
					ui.versushighlight = game.me;
					game.me.classList.add("current_action");
					// game.me.line(ui.fakeme,{opacity:0.5,dashed:true});

					ui.fakeme.style.backgroundImage = game.me.node.avatar.style.backgroundImage;
					// ui.fakeme.style.backgroundSize='cover';
				}
				ui.updatehl();
			},
			modeSwapPlayer: function (player) {
				var bool = game.me == game.boss || player == game.boss;
				game.swapControl(player);
				game.onSwapControl();
				if (!bool) return;
				if (game.me == game.boss) {
					game.singleHandcard = false;
					ui.arena.classList.remove("single-handcard");
					ui.window.classList.remove("single-handcard");
					ui.fakeme.style.display = "none";
					game.me.dataset.position = 0;
					game.me.nextSeat.dataset.position = 2;
					game.me.nextSeat.nextSeat.dataset.position = 4;
					game.me.nextSeat.nextSeat.nextSeat.dataset.position = 6;
				} else {
					game.singleHandcard = true;
					ui.arena.classList.add("single-handcard");
					ui.window.classList.add("single-handcard");
					ui.fakeme.style.display = "";
					game.boss.dataset.position = 7;
					game.boss.nextSeat.dataset.position = 1;
					game.boss.nextSeat.nextSeat.dataset.position = 2;
					game.boss.nextSeat.nextSeat.nextSeat.dataset.position = 3;
					if (game.me && game.me.node.handcards2.childNodes.length) {
						while (game.me.node.handcards2.childNodes.length) {
							game.me.node.handcards1.appendChild(game.me.node.handcards2.firstChild);
						}
					}
				}
			},
			chooseCharacter: function (func) {
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.customreplacetarget = func;
				next.ai = function (player, list) {
					if (get.config("double_character")) {
						player.init(list[0], list[1]);
					} else {
						player.init(list[0]);
					}
				};
				next.setContent(function () {
					"step 0";
					var i;
					var list = [];
					event.list = list;
					for (i in lib.character) {
						if (lib.character[i].isMinskin) continue;
						if (lib.character[i].isBoss) continue;
						if (lib.character[i].isHiddenBoss) continue;
						if (lib.character[i].isAiForbidden) continue;
						if (lib.config.forbidboss.includes(i)) continue;
						if (lib.filter.characterDisabled(i)) continue;
						list.push(i);
					}
					list.randomSort();
					var dialog = ui.create.dialog("选择参战角色", "hidden");
					dialog.classList.add("fixed");
					ui.window.appendChild(dialog);
					dialog.classList.add("bosscharacter");
					dialog.classList.add("modeshortcutpause");
					dialog.classList.add("withbg");
					// dialog.add('0/3');
					dialog.add([list.slice(0, 20), "character"]);
					dialog.noopen = true;
					var next = game.me.chooseButton(dialog, true).set("onfree", true);
					next._triggered = null;
					next.custom.replace.target = event.customreplacetarget;
					next.selectButton = [3, 3];
					// next.custom.add.button=function(){
					//		if(ui.cheat2&&ui.cheat2.backup) return;
					//		_status.event.dialog.content.childNodes[1].innerHTML=
					//		ui.selected.buttons.length+'/3';
					// };
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
						_status.event.dialog.buttons = ui.create.buttons(list.slice(0, 20), "character", buttons);
						_status.event.dialog.content.insertBefore(buttons, node);
						buttons.addTempClass("start");
						node.remove();

						game.uncheck();
						game.check();
					};
					ui.create.cheat = function () {
						_status.createControl = ui.cheat2 || event.asboss;
						ui.cheat = ui.create.control("更换", event.changeDialog);
						delete _status.createControl;
					};
					var createCharacterDialog = function () {
						event.dialogxx = ui.create.characterDialog();
						event.dialogxx.classList.add("bosscharacter");
						event.dialogxx.classList.add("withbg");
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
						_status.createControl = event.asboss;
						ui.cheat2 = ui.create.control("自由选将", function () {
							if (this.dialog == _status.event.dialog) {
								if (game.changeCoin) {
									game.changeCoin(10);
								}
								this.dialog.close();
								_status.event.dialog = this.backup;
								ui.window.appendChild(this.backup);
								delete this.backup;
								game.uncheck();
								game.check();
								if (ui.cheat) {
									ui.cheat.addTempClass("controlpressdownx", 500);
									ui.cheat.classList.remove("disabled");
								}
								if (_status.bosschoice) {
									_status.bosschoice.addTempClass("controlpressdownx", 500);
									_status.bosschoice.classList.remove("disabled");
								}
							} else {
								if (game.changeCoin) {
									game.changeCoin(-10);
								}
								this.backup = _status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog = _status.event.parent.dialogxx;
								this.dialog = _status.event.dialog;
								ui.window.appendChild(this.dialog);
								game.uncheck();
								game.check();
								if (ui.cheat) {
									ui.cheat.classList.add("disabled");
								}
								if (_status.bosschoice) {
									_status.bosschoice.classList.add("disabled");
								}
							}
						});
						if (lib.onfree) {
							ui.cheat2.classList.add("disabled");
						}
						delete _status.createControl;
					};
					if (!ui.cheat && get.config("change_choice")) ui.create.cheat();
					if (!ui.cheat2 && get.config("free_choose")) ui.create.cheat2();

					event.asboss = ui.create.control("应战", function () {
						event.boss = true;
						event.enemy = [];
						for (var i = 0; i < ui.selected.buttons.length; i++) {
							event.enemy.push(ui.selected.buttons[i].link);
							event.list.remove(ui.selected.buttons[i].link);
						}
						while (event.enemy.length < 3) {
							var name = event.list.randomRemove();
							if (lib.boss[lib.storage.current] && lib.boss[lib.storage.current].randchoice) {
								name = lib.boss[lib.storage.current].randchoice(name, event.enemy);
							}
							event.enemy.push(name);
						}
						game.uncheck();
						if (ui.confirm) {
							ui.confirm.close();
						}
						game.resume();
					});
					"step 1";
					if (ui.cheat) {
						ui.cheat.close();
						delete ui.cheat;
					}
					if (ui.cheat2) {
						ui.cheat2.close();
						delete ui.cheat2;
					}
					event.asboss.close();
					if (_status.bosschoice) {
						_status.bosschoice.close();
						delete _status.bosschoice;
					}
					if (event.boss) {
						event.result = {
							boss: true,
							links: event.enemy,
						};
					} else {
						event.result = {
							boss: false,
							links: result.links,
						};
						_status.coinCoeff = get.coinCoeff(result.links);
					}
				});
				return next;
			},
		},
		boss: {
			boss_qiongqi: {
				chongzheng: 0,
				loopFirst: function () {
					return game.boss.nextSeat.nextSeat;
				},
				gameDraw: function (player) {
					return player == game.boss ? 8 : 4;
				},
				minion: {
					2: "boss_zhuyin",
					8: "boss_zhuyin",
				},
				randchoice: function () {
					return lib.boss.boss_taowu.randchoice.apply(this, arguments);
				},
				controlid: "shenwuzaishi",
				control: function () {
					return lib.boss.boss_taowu.control.apply(this, arguments);
				},
				init: function () {
					return lib.boss.boss_taowu.init.apply(this, arguments);
				},
			},
			boss_xiangliu: {
				chongzheng: 0,
				loopFirst: function () {
					return game.boss.nextSeat.nextSeat;
				},
				gameDraw: function (player) {
					return player == game.boss ? 8 : 4;
				},
				minion: {
					2: "boss_zhuyin",
					8: "boss_zhuyin",
				},
				randchoice: function () {
					return lib.boss.boss_taowu.randchoice.apply(this, arguments);
				},
				controlid: "shenwuzaishi",
				control: function () {
					return lib.boss.boss_taowu.control.apply(this, arguments);
				},
				init: function () {
					return lib.boss.boss_taowu.init.apply(this, arguments);
				},
			},
			boss_zhuyan: {
				chongzheng: 0,
				loopFirst: function () {
					return game.boss.nextSeat.nextSeat;
				},
				gameDraw: function (player) {
					return player == game.boss ? 8 : 4;
				},
				minion: {
					2: "boss_zhuyin",
					8: "boss_zhuyin",
				},
				randchoice: function () {
					return lib.boss.boss_taowu.randchoice.apply(this, arguments);
				},
				controlid: "shenwuzaishi",
				control: function () {
					return lib.boss.boss_taowu.control.apply(this, arguments);
				},
				init: function () {
					return lib.boss.boss_taowu.init.apply(this, arguments);
				},
			},
			boss_bifang: {
				chongzheng: 0,
				loopFirst: function () {
					return game.boss.nextSeat.nextSeat;
				},
				gameDraw: function (player) {
					return player == game.boss ? 8 : 4;
				},
				minion: {
					2: "boss_zhuyin",
					8: "boss_zhuyin",
				},
				randchoice: function () {
					return lib.boss.boss_taowu.randchoice.apply(this, arguments);
				},
				controlid: "shenwuzaishi",
				control: function () {
					return lib.boss.boss_taowu.control.apply(this, arguments);
				},
				init: function () {
					return lib.boss.boss_taowu.init.apply(this, arguments);
				},
			},
			boss_yingzhao: {
				chongzheng: 0,
				loopFirst: function () {
					return game.boss.nextSeat.nextSeat;
				},
				gameDraw: function (player) {
					return player == game.boss ? 8 : 4;
				},
				minion: {
					2: "boss_zhuyin",
					8: "boss_zhuyin",
				},
				randchoice: function () {
					return lib.boss.boss_taowu.randchoice.apply(this, arguments);
				},
				controlid: "shenwuzaishi",
				control: function () {
					return lib.boss.boss_taowu.control.apply(this, arguments);
				},
				init: function () {
					return lib.boss.boss_taowu.init.apply(this, arguments);
				},
			},
			boss_hundun: {
				chongzheng: 0,
				loopFirst: function () {
					return game.boss.nextSeat.nextSeat;
				},
				gameDraw: function (player) {
					return player == game.boss ? 8 : 4;
				},
				minion: {
					2: "boss_zhuyin",
					8: "boss_zhuyin",
				},
				randchoice: function () {
					return lib.boss.boss_taowu.randchoice.apply(this, arguments);
				},
				controlid: "shenwuzaishi",
				control: function () {
					return lib.boss.boss_taowu.control.apply(this, arguments);
				},
				init: function () {
					return lib.boss.boss_taowu.init.apply(this, arguments);
				},
			},
			boss_taotie: {
				chongzheng: 0,
				loopFirst: function () {
					return game.boss.nextSeat.nextSeat;
				},
				gameDraw: function (player) {
					return player == game.boss ? 8 : 4;
				},
				minion: {
					2: "boss_zhuyin",
					8: "boss_zhuyin",
				},
				randchoice: function () {
					return lib.boss.boss_taowu.randchoice.apply(this, arguments);
				},
				controlid: "shenwuzaishi",
				control: function () {
					return lib.boss.boss_taowu.control.apply(this, arguments);
				},
				init: function () {
					return lib.boss.boss_taowu.init.apply(this, arguments);
				},
			},
			boss_taowu: {
				chongzheng: 0,
				loopFirst: function () {
					return game.boss.nextSeat.nextSeat;
				},
				gameDraw: function (player) {
					return player == game.boss ? 8 : 4;
				},
				minion: {
					2: "boss_zhuyin",
					8: "boss_zhuyin",
				},
				randchoice: function (name, list) {
					if (Math.random() > 1 / 3) {
						return name;
					} else {
						var arr = ["shen_caocao", "shen_simayi", "shen_guanyu", "shen_zhugeliang", "shen_zhaoyun", "shen_zhouyu", "shen_lvmeng", "shen_lvbu", "shen_liubei", "shen_luxun", "shen_ganning", "ol_zhangliao", "shen_zhenji", "shen_caopi", "key_kagari", "key_shiki", "db_key_hina"];
						arr.removeArray(list);
						return arr.randomGet();
					}
				},
				controlid: "shenwuzaishi",
				control: function (type, control) {
					if (type == "cancel") {
						if (!control.classList.contains("glow")) return;
						var dialog = control.dialog;
						dialog.content.removeChild(control.backup1);
						dialog.buttons.removeArray(control.backup2);

						game.uncheck();
						game.check();
					} else {
						var control = ui.create.control("神将", function () {
							if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
								return;
							}
							var dialog = _status.event.dialog;
							this.dialog = dialog;
							if (this.classList.contains("glow")) {
								this.backup1.remove();
								dialog.buttons.removeArray(this.backup2);
							} else {
								var links = [];
								for (var i = 0; i < dialog.buttons.length; i++) {
									links.push(dialog.buttons[i].link);
								}
								for (var i = 0; i < this.backup2.length; i++) {
									if (links.includes(this.backup2[i].link)) {
										this.backup2[i].style.display = "none";
									} else {
										this.backup2[i].style.display = "";
									}
								}
								dialog.content.insertBefore(this.backup1, dialog.buttons[0].parentNode);
								dialog.buttons.addArray(this.backup2);
							}
							this.classList.toggle("glow");

							game.uncheck();
							game.check();
						});
						control.backup1 = ui.create.div(".buttons");
						control.backup2 = ui.create.buttons(["shen_caocao", "shen_simayi", "shen_guanyu", "shen_zhugeliang", "shen_zhaoyun", "shen_zhouyu", "shen_lvmeng", "shen_lvbu", "shen_liubei", "shen_luxun", "shen_ganning", "ol_zhangliao", "shen_zhenji", "shen_caopi", "key_kagari", "key_shiki", "db_key_hina"], "character", control.backup1);
						return control;
					}
				},
				init: function () {
					game.addGlobalSkill("boss_shenwuzaishi");
					game.addGlobalSkill("TheDayIBecomeAGod");
					game.addGlobalSkill("thedayibecomeagod");
					var list = ["lebu", "bingliang"];
					for (var i = 0; i < game.players.length; i++) {
						switch (game.players[i].name1) {
							case "shen_guanyu": {
								game.players[i].equip(game.createCard2("guilongzhanyuedao", "spade", 5));
								lib.inpile.add("guilongzhanyuedao");
								list.push("qinglong");
								break;
							}
							case "shen_zhugeliang": {
								game.players[i].equip(game.createCard2("qimenbagua", "spade", 2));
								list.push("bagua");
								lib.inpile.add("qimenbagua");
								break;
							}
							case "shen_zhouyu": {
								game.players[i].equip(game.createCard2("chiyanzhenhunqin", "diamond", 1));
								list.push("zhuque");
								lib.inpile.add("chiyanzhenhunqin");
								break;
							}
							case "shen_caocao": {
								game.players[i].equip(game.createCard2("juechenjinge", "spade", 5));
								list.push("jueying");
								lib.inpile.add("juechenjinge");
								break;
							}
							case "shen_zhaoyun": {
								game.players[i].equip(game.createCard2("chixueqingfeng", "spade", 6));
								list.push("qinggang");
								lib.inpile.add("chixueqingfeng");
								break;
							}
							case "shen_lvbu": {
								game.players[i].equip(game.createCard2("xiuluolianyuji", "diamond", 12));
								list.push("fangtian");
								lib.inpile.add("xiuluolianyuji");
								break;
							}
							case "shen_simayi": {
								game.players[i].equip(game.createCard2("xuwangzhimian", "diamond", 4));
								lib.inpile.add("xuwangzhimian");
								break;
							}
							case "shen_liubei": {
								game.players[i].equip(game.createCard2("longfenghemingjian", "spade", 2));
								lib.inpile.add("longfenghemingjian");
								list.push("cixiong");
								break;
							}
							case "shen_lvmeng": {
								game.players[i].equip(game.createCard2("guofengyupao", "diamond", 3));
								lib.inpile.add("guofengyupao");
								break;
							}
							case "shen_luxun": {
								game.players[i].equip(game.createCard2("qicaishenlu", "diamond", 3));
								lib.inpile.add("qicaishenlu");
								break;
							}
							case "shen_ganning":
							case "key_iwasawa": {
								game.players[i].equip(game.createCard2("jinwuluorigong", "heart", 5));
								lib.inpile.add("jinwuluorigong");
								list.push("qilin");
								break;
							}
							case "ol_zhangliao":
							case "key_noda": {
								game.players[i].equip(game.createCard2("xingtianpojunfu", "diamond", 5));
								lib.inpile.add("xingtianpojunfu");
								list.push("guanshi");
								break;
							}
							case "shen_zhenji": {
								game.players[i].equip(game.createCard2("lingsheji", "club", 12));
								lib.inpile.add("lingsheji");
								break;
							}
							case "shen_caopi": {
								game.players[i].equip(game.createCard2("shanrangzhaoshu", "spade", 13));
								lib.inpile.add("shanrangzhaoshu");
								break;
							}
							case "key_kagari": {
								game.players[i].equip(game.createCard2("goujiangdesidai", "heart", 1));
								lib.inpile.add("goujiangdesidai");
								break;
							}
							case "key_shiki": {
								game.players[i].equip(game.createCard2("niaobaidaowenha", "diamond", 13));
								lib.inpile.add("niaobaidaowenha");
								break;
							}
							case "db_key_hina": {
								game.players[i].equip(game.createCard2("shenzhixiunvfu", "spade", 13));
								lib.inpile.add("shenzhixiunvfu");
								break;
							}
						}
					}
					lib.inpile.remove("wuzhong");
					lib.inpile.remove("jiedao");
					lib.inpile.add("sadouchengbing");
					lib.inpile.add("yihuajiemu");
					lib.inpile.add("gubuzifeng");
					for (var i = 0; i < ui.cardPile.childElementCount; i++) {
						var node = ui.cardPile.childNodes[i];
						if (node.name == "wuzhong") {
							node.init([node.suit, node.number, "sadouchengbing"]);
						} else if (node.name == "jiedao") {
							node.init([node.suit, node.number, "yihuajiemu"]);
						} else if (list.includes(node.name)) {
							lib.inpile.remove(node.name);
							node.remove();
						}
					}
					var cards = [game.createCard2("gubuzifeng", "club", 5), game.createCard2("gubuzifeng", "diamond", 7)];
					while (cards.length > 0) {
						ui.cardPile.insertBefore(cards.shift(), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childElementCount - 1)]);
					}
					lib.inpile.sort(lib.sort.card);
				},
			},
			boss_chiyanshilian: {
				chongzheng: 0,
				loopType: 2,
				checkResult: function (player) {
					if (player == game.boss && game.boss.name != "boss_yandi") {
						return false;
					}
				},
				init: function () {
					_status.additionalReward = function () {
						return 500;
					};
					lib.inpile.remove("shandian");
					lib.inpile.remove("huoshan");
					lib.inpile.remove("hongshui");
					lib.inpile.remove("fulei");
					lib.inpile.add("honghuangzhili");
					lib.inpile.sort(lib.sort.card);
					for (var i = 0; i < ui.cardPile.childElementCount; i++) {
						var node = ui.cardPile.childNodes[i];
						if (node.name == "shandian") {
							node.classList.remove("fullskin");
							node.classList.remove("thunder");
							node.init([node.suit, node.number, "honghuangzhili"]);
						} else if (["huoshan", "hongshui", "fulei"].includes(node.name)) {
							node.remove();
						}
					}
				},
			},
			boss_qingmushilian: {
				chongzheng: 0,
				loopType: 2,
				checkResult: function (player) {
					if (player == game.boss && game.boss.name != "boss_taihao") {
						return false;
					}
				},
				init: function () {
					lib.boss.boss_chiyanshilian.init();
				},
			},
			boss_baimangshilian: {
				chongzheng: 0,
				loopType: 2,
				checkResult: function (player) {
					if (player == game.boss && game.boss.name != "boss_shaohao") {
						return false;
					}
				},
				init: function () {
					lib.boss.boss_chiyanshilian.init();
				},
			},
			boss_xuanlinshilian: {
				chongzheng: 0,
				loopType: 2,
				checkResult: function (player) {
					if (player == game.boss && game.boss.name != "boss_zhuanxu") {
						return false;
					}
				},
				init: function () {
					lib.boss.boss_chiyanshilian.init();
				},
			},
			boss_zhuoguiquxie: {
				chongzheng: 0,
				checkResult: function (player) {
					if (player == game.boss && game.boss.name != "boss_yecha" && game.boss.name != "boss_luocha") {
						return false;
					}
				},
				init: function () {
					_status.additionalReward = function () {
						return 500;
					};
				},
			},
			boss_qinguangwang: {
				chongzheng: 0,
				checkResult: function (player) {
					if (player == game.boss && (!_status.shidianyanluo_level || _status.shidianyanluo_level < 3)) {
						return false;
					}
				},
				init: function () {
					_status.shidianyanluo_level = 0;
					lib.inpile.remove("muniu");
					for (var i = 0; i < ui.cardPile.childElementCount; i++) {
						if (ui.cardPile.childNodes[i].name == "muniu") {
							ui.cardPile.childNodes[i].remove();
							break;
						}
					}
					_status.additionalReward = function () {
						return 500;
					};
				},
			},
			boss_nianshou: {
				chongzheng: 0,
				init: function () {
					game.boss.node.action.classList.add("freecolor");
					game.boss.node.action.style.opacity = 1;
					game.boss.node.action.style.letterSpacing = "4px";
					game.boss.node.action.style.marginRight = 0;
					game.boss.node.action.style.fontFamily = "huangcao";
					game.boss.node.action.innerHTML = "";
					_status.additionalReward = function () {
						return Math.round(Math.pow(_status.damageCount, 2.4)) * 2;
					};
					var time = 360;
					var interval = setInterval(function () {
						if (_status.over) {
							clearInterval(interval);
							return;
						}
						var sec = time % 60;
						if (sec < 10) {
							sec = "0" + sec;
						}
						game.boss.node.action.innerHTML = Math.floor(time / 60) + ":" + sec;
						if (time <= 0) {
							delete _status.additionalReward;
							if (typeof _status.coin == "number") {
								if (game.me == game.boss) {
									_status.coin += Math.round(Math.pow(_status.damageCount, 2.4));
								} else {
									_status.coin += Math.round(Math.pow(_status.damageCount, 1.8));
								}
							}
							game.forceOver(true);
							clearInterval(interval);
						}
						time--;
					}, 1000);
					_status.damageCount = 0;
					ui.damageCount = ui.create.system("伤害: 0", null, true);
				},
			},
			boss_nianshou_heti: {
				chongzheng: 0,
			},
			boss_zhangjiao: {
				// loopType:2,
			},
			boss_caiwenji: {
				loopType: 2,
			},
			boss_pangtong: {
				loopType: 2,
				chongzheng: 12,
			},
			boss_zhenji: {
				chongzheng: 4,
			},
			boss_lvbu1: {
				loopType: 2,
				gameDraw: function (player) {
					if (player == game.boss) return 8;
					if (player == game.boss.previous) return 5;
					return 4;
				},
				loopFirst: function () {
					return game.boss.nextSeat;
				},
				init: function () {
					lib.inpile.remove("wugu");
					lib.inpile.remove("taoyuan");
					lib.inpile.remove("bagua");
					lib.inpile.remove("tengjia");
					lib.inpile.remove("fangtian");
					lib.inpile.remove("muniu");
					lib.inpile.addArray(["wushuangfangtianji", "shufazijinguan", "hongmianbaihuapao", "linglongshimandai", "lianjunshengyan"]);
					lib.inpile.sort(lib.sort.card);
					var equiplist = [];
					for (var i = 0; i < ui.cardPile.childElementCount; i++) {
						var node = ui.cardPile.childNodes[i];
						if (node.name == "bagua") {
							node.init([node.suit, node.number, "linglongshimandai"]);
							equiplist.push(node);
						} else if (node.name == "tengjia") {
							node.init([node.suit, node.number, "hongmianbaihuapao"]);
							equiplist.push(node);
						} else if (node.name == "fangtian") {
							node.init([node.suit, node.number, "wushuangfangtianji"]);
							equiplist.push(node);
						} else if (node.name == "muniu") {
							node.init([node.suit, node.number, "shufazijinguan"]);
							equiplist.push(node);
						} else if (node.name == "wugu" || node.name == "taoyuan") {
							node.init([node.suit, node.number, "lianjunshengyan"]);
						}
					}
					equiplist.randomSort();
					var next = game.createEvent("boss_jingjia");
					next.player = game.boss;
					next.cards = equiplist;
					next.setContent(function () {
						"step 0";
						if (!cards.length) {
							event.finish();
							return;
						}
						player.logSkill("boss_jingjia");
						event.num = 1.5;
						"step 1";
						var card = cards.shift();
						if (player.canEquip(card) && Math.random() < event.num) {
							player.equip(card);
							event.num = 0.5;
						}
						if (cards.length) event.redo();
					});
				},
			},
			boss_zuoci: {
				chongzheng: 4,
			},
			boss_diaochan: {
				chongzheng: 4,
			},
			boss_huangyueying: {
				chongzheng: 12,
			},
			boss_sunce: {
				loopType: 2,
				loopFirst: function () {
					return game.boss.previousSeat;
				},
				gameDraw: function (player) {
					return player == game.boss ? 8 : 4;
				},
				init: function () {
					_status.taoni_over = get.copy(game.over);
				},
			},
			global: {
				loopType: 1,
				chongzheng: 6,
			},
		},
		skill: {
			boss_yingzhong: {
				//Unfinished
			},
			niaobaidaowenha_skill: {
				trigger: { player: "loseMaxHpAfter" },
				direct: true,
				content: function () {
					"step 0";
					event.count = trigger.num;
					"step 1";
					event.count--;
					player.chooseTarget(get.prompt2("niaobaidaowenha_skill"), lib.filter.notMe).set("ai", function (target) {
						return get.attitude(_status.event.player, target) / (target.maxHp || 1);
					});
					"step 2";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("niaobaidaowenha_skill", target);
						target.gainMaxHp();
						target.recover();
						if (event.count) event.goto(1);
					}
				},
			},
			goujiangdesidai_skill: {
				inherit: "kagari_zongsi",
				filter: function (event, player) {
					return !player.hasSkill("kagari_zongsi") || player.getStat("skill").kagari_zongsi;
				},
			},
			gubuzifeng_disable: {
				init: function (player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				},
				onremove: function (player, skill) {
					player.enableSkill(skill);
					delete player.storage[skill];
				},
				charlotte: true,
				locked: true,
				mark: true,
				intro: {
					content: function (storage, player, skill) {
						var list = [];
						for (var i in player.disabledSkills) {
							if (player.disabledSkills[i].includes(skill)) {
								list.push(i);
							}
						}
						if (list.length) {
							var str = "失效技能：";
							for (var i = 0; i < list.length; i++) {
								if (lib.translate[list[i] + "_info"]) {
									str += get.translation(list[i]) + "、";
								}
							}
							return str.slice(0, str.length - 1);
						}
					},
				},
			},
			thedayibecomeagod: {
				trigger: { player: "die" },
				direct: true,
				filter: function (event, player) {
					return player.group == "shen";
				},
				forceDie: true,
				skillAnimation: true,
				animationColor: "kami",
				content: function () {
					"step 0";
					player
						.chooseTarget(get.prompt2("thedayibecomeagod"), function (card, player, target) {
							return target.isFriendOf(player);
						})
						.set("forceDie", true).ai = function (target) {
						return get.attitude(_status.event.player, target);
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("thedayibecomeagod", target);
						if (target.group != "shen") {
							target.changeGroup("shen");
							game.log("此刻，便是", target, "成为神明之日！");
							event.finish();
						} else target.turnOver(false);
					} else event.finish();
					"step 2";
					if (target.isDamaged()) target.recover(target.maxHp - target.hp);
					"step 3";
					target.drawTo(5);
				},
			},
			TheDayIBecomeAGod: {
				trigger: { player: "useCard1" },
				ruleSkill: true,
				popup: false,
				forced: true,
				prompt: "是否将此【杀】改为神属性？",
				filter: function (event, player) {
					return player.group == "shen" && event.card.name == "sha";
				},
				content: function () {
					game.log(trigger.card, "被改为神属性");
					game.setNature(trigger.card, "kami");
				},
			},
			shanrangzhaoshu: {
				trigger: {
					global: ["gainEnd", "loseAsyncAfter"],
				},
				direct: true,
				filter: function (event, player) {
					let min = 0;
					if (!player.hasSkill("shanrangzhaoshu", null, false)) min += get.sgn(player.getEquips("shanrangzhaoshu").length);
					const bool = player.countCards("he") > min;
					return game.hasPlayer(current => {
						if (current == player || current == _status.currentPhase) return false;
						if (!bool && current.countCards("h") == 0) return false;
						const history = current.getHistory("gain")[0];
						if (!history) return false;
						if (event.name == "gain") {
							return history == event && event.getlx !== false;
						}
						return history.getParent() == event;
					});
				},
				content: function () {
					"step 0";
					event.targets = game
						.filterPlayer(function (current) {
							if (current == player || current == _status.currentPhase) return false;
							const history = current.getHistory("gain")[0];
							if (!history) return false;
							if (trigger.name == "gain") {
								return history == trigger && trigger.getlx !== false;
							}
							return history.getParent() == trigger;
						})
						.sortBySeat(_status.currentPhase);
					"step 1";
					var target = event.targets.shift();
					event.target = target;
					if (target.isIn()) {
						var list = [];
						var min = 0;
						if (!player.hasSkill("shanrangzhaoshu", null, false)) min += get.sgn(player.getEquips("shanrangzhaoshu").length);
						if (player.countCards("he") > min) list.push(`交给${get.translation(target)}一张牌`);
						if (target.countCards("he") > 0) list.push(`令${get.translation(target)}交给你一张牌`);
						event.list = list;
						if (list.length == 0) event.goto(4);
						else if (list.length == 1) event._result = { index: 0 };
						else
							player
								.chooseControl("cancel2")
								.set("choiceList", list)
								.set("prompt", get.prompt("shanrangzhaoshu", target))
								.set("ai", function () {
									if (get.attitude(_status.event.player, _status.event.getParent().target) < 0) return 1;
									return "cancel2";
								});
					} else event.goto(4);
					"step 2";
					if (result.control == "cancel2") {
						event.goto(4);
						return;
					}
					player.logSkill("shanrangzhaoshu", target);
					if (event.list[result.index][0] == "令") {
						event.gainner = player;
						event.giver = target;
						target.chooseCard("he", true, `交给${get.translation(player)}一张牌`);
					} else {
						event.giver = player;
						event.gainner = target;
						player
							.chooseCard("he", true, `交给${get.translation(target)}一张牌`)
							.set("filterCard", function (card, player) {
								if (_status.event.ignoreCard) return true;
								var cards = player.getEquips("shanrangzhaoshu");
								if (!cards.includes(card)) return true;
								return cards.some(cardx => cardx != card && !ui.selected.cards.includes(cardx));
							})
							.set("ignoreCard", player.hasSkill("shanrangzhaoshu", null, false));
					}
					"step 3";
					if (result.cards && result.cards.length) event.giver.give(result.cards, event.gainner);
					"step 4";
					if (targets.length > 0) event.goto(1);
				},
			},
			lingsheji: {
				trigger: { player: "phaseUseEnd" },
				equipSkill: true,
				direct: true,
				content: function () {
					"step 0";
					var list = ["摸一张牌"];
					if (player.countCards("he") > 1) list.push("将一张牌置于武将牌上，于回合结束后获得之");
					player
						.chooseControl("cancel2")
						.set("prompt", get.prompt("lingsheji"))
						.set("choiceList", list)
						.set("ai", function () {
							var player = _status.event.player;
							if (
								player.countCards("e", function (card) {
									return card.name != "tengjia" && get.value(card) <= 0;
								})
							)
								return 1;
							if (!player.needsToDiscard()) return 0;
							return 1;
						});
					"step 1";
					if (result.control == "cancel2") {
						event.finish();
						return;
					}
					player.logSkill("lingsheji");
					if (result.index == 0) {
						player.draw();
						event.finish();
					} else {
						player
							.chooseCard("he", true, function (card, player) {
								return card != player.getEquip(5);
							})
							.set("ai", function (card) {
								if (get.position(card) == "e" && get.value(card) <= 0) return 10;
								return (get.position(card) == "h" ? 2 : 1) * -get.value(card);
							});
					}
					"step 2";
					player.addSkill("lingsheji2");
					player.lose(result.cards, ui.special, "toStorage");
					player.markAuto("lingsheji2", result.cards);
				},
			},
			lingsheji2: {
				trigger: { player: "phaseEnd" },
				equipSkill: true,
				forced: true,
				popup: false,
				content: function () {
					player.gain(player.getStorage("lingsheji2"), "gain2", "log");
					player.storage.lingsheji2.length = 0;
					player.removeSkill("lingsheji2");
				},
				intro: { content: "cards" },
			},
			noda_axe: {
				trigger: { player: "useCardToPlayered" },
				equipSkill: true,
				direct: true,
				filter: function (event, player) {
					return player.isPhaseUsing() && player != event.target && event.targets.length == 1 && player.countCards("he") > 2;
				},
				content: function () {
					"step 0";
					player
						.chooseToDiscard("he", get.prompt("noda_axe", trigger.target), 2, "弃置两张牌，令" + get.translation(trigger.target) + "本回合内不能使用或打出牌且防具技能无效。", function (card, player) {
							return card != player.getEquip(1);
						})
						.set("logSkill", ["noda_axe", trigger.target])
						.set(
							"goon",
							(function (event, player) {
								if (player.hasSkill("noda_axe2")) return false;
								if (event.getParent().excluded.includes(player)) return false;
								if (get.attitude(event.player, player) > 0) {
									return false;
								}
								if (get.type(event.card) == "trick" && event.player.hasWuxie()) return true;
								if (get.tag(event.card, "respondSha")) {
									if (!player.hasSha()) return false;
									return true;
								} else if (get.tag(event.card, "respondShan")) {
									if (!player.hasShan()) return false;
									return true;
								}
								return false;
							})(trigger, trigger.target)
						)
						.set("ai", function (card) {
							if (_status.event.goon) return 7.5 - get.value(card);
							return 0;
						});
					"step 1";
					if (result.bool) trigger.target.addTempSkill("noda_axe2");
				},
			},
			noda_axe2: {
				equipSkill: true,
				mod: {
					cardEnabled: function () {
						return false;
					},
					cardSavable: function () {
						return false;
					},
					cardRespondable: function () {
						return false;
					},
				},
				mark: true,
				intro: {
					content: "不能使用或打出牌且防具技能无效直到回合结束",
				},
				ai: { unequip2: true },
			},
			iwasawa_crowbow: {
				equipSkill: true,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				direct: true,
				filter: function (event, player) {
					var evt = event.getl(player);
					return evt && evt.hs && evt.hs.length > 1 && player.isPhaseUsing();
				},
				content: function () {
					"step 0";
					var evt = trigger.getl(player);
					event.num = evt.hs.length;
					player
						.chooseTarget(get.prompt("iwasawa_crowbow"), "弃置一名其他角色的" + get.cnNumber(event.num) + "张牌", function (card, player, target) {
							return player != target && target.countDiscardableCards(player, "he") > 0;
						})
						.set("ai", function (target) {
							var att = get.attitude(_status.event.player, target);
							if (target.countDiscardableCards(_status.event.player, "he") >= _status.event.getParent().num) att = att * 2;
							return -att;
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("iwasawa_crowbow", target);
						player.discardPlayerCard(target, "he", true, num);
					}
				},
			},
			boss_panguan: {
				audio: true,
				mod: {
					targetEnabled: function (card) {
						if (get.type(card) == "delay") return false;
					},
				},
			},
			boss_juhun: {
				audio: true,
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				content: function () {
					var list = game.filterPlayer(function (current) {
						return current != player;
					});
					if (list.length) {
						var target = list.randomGet();
						player.line(target);
						target[["turnOver", "link"].randomGet()]();
					}
				},
			},
			boss_wangxiang: {
				audio: true,
				trigger: { player: "die" },
				forced: true,
				forceDie: true,
				content: function () {
					game.countPlayer(function (current) {
						if (current != player && current.countCards("e")) {
							player.line(current);
							current.discard(current.getCards("e"));
						}
					});
				},
			},
			boss_xhuanren: {
				nobracket: true,
				global: "boss_xhuanren2",
			},
			boss_xhuanren2: {
				trigger: { player: "dieBegin" },
				forced: true,
				priority: -10,
				fixed: true,
				globalFixed: true,
				charlotte: true,
				silent: true,
				popup: false,
				filter: function (event, player) {
					if (lib.config.mode != "boss") return false;
					if (_status.shidianyanluo_level == undefined) return false;
					return player == game.boss;
				},
				content: function () {
					var next = game.createEvent("shidianyanluo_huanren", false, trigger.getParent());
					next.player = player;
					next.forceDie = true;
					next.setContent(lib.skill.boss_xhuanren2.contentx);
				},
				contentx: function () {
					"step 0";
					game.delay();
					"step 1";
					var list = [["boss_chujiangwang", "boss_songdiwang", "boss_wuguanwang", "boss_yanluowang"], ["boss_bianchengwang", "boss_taishanwang", "boss_dushiwang", "boss_pingdengwang"], ["boss_zhuanlunwang"]][_status.shidianyanluo_level];
					if (list.length == 1) event._result = { control: list[0] };
					else
						player.chooseControl(list).set("prompt", "请选择下一个出战的角色").set("forceDie", true).ai = function () {
							return list.randomGet();
						};
					"step 2";
					_status.shidianyanluo_level++;
					game.changeBoss(result.control);
				},
			},
			boss_newhuanren: {
				nobracket: true,
				global: "boss_newhuanren2",
				trigger: { global: "gameStart" },
				popup: false,
				forced: true,
				superCharlotte: true,
				charlotte: true,
				fixed: true,
				content: function () {
					if (get.mode() != "boss") return;
					//孟婆
					if (!_status.shidianyanluo_mengpo && Math.random() <= 0.4) {
						if (game.me != game.boss) {
							game.boss.changeSeat(6);
						} else {
							game.boss.nextSeat.changeSeat(3);
							game.boss.previousSeat.changeSeat(5);
						}
						//	game.addBossFellow(game.me==game.boss?1:7,'boss_mengpo');
						var fellow = game.addFellow(game.me == game.boss ? 1 : 7, "boss_mengpo", "zoominanim");
						if (_status.shidianyanluo_level != 0) {
							fellow.directgain(get.cards(4));
						}
						fellow.side = true;
						fellow.identity = "zhong";
						fellow.setIdentity("zhong");
						game.addVideo("setIdentity", fellow, "zhong");
						_status.shidianyanluo_mengpo = true;
					}
					var list = ["luxun", "re_luxun", "zhangchunhua", "zuoci", "re_zuoci", "re_yuji", "xin_yuji", "jiangfei", "kongrong"]; //禁将
					game.countPlayer(function (current) {
						if (current != game.boss) {
							for (var i = 0; i < list.length; i++) {
								if (current.name == list[i] || current.name2 == list[i]) {
									current.init(["sunce", "re_sunce", "shen_sunce", "sb_sunce"].randomGet());
								}
							}
						}
					});
				},
			},
			boss_newhuanren2: {
				trigger: { global: ["die"] },
				forced: true,
				priority: -10,
				fixed: true,
				globalFixed: true,
				charlotte: true,
				silent: true,
				popup: false,
				forceDie: true,
				filter: function (event, player) {
					if (lib.config.mode != "boss") return false;
					if (_status.shidianyanluo_level == undefined) return false;
					return player == game.boss && event.player == player;
				},
				content: function () {
					var next = game.createEvent("shidianyanluo_huanren", false, trigger.getParent());
					next.player = player;
					next.forceDie = true;
					next.setContent(lib.skill.boss_newhuanren2.contentx);
				},
				contentx: function () {
					"step 0";
					game.delay();
					var list = game.filterPlayer();
					for (var x = 0; x < list.length; x++) {
						list[x].removeSkill("diaohulishan");
						list[x].removeSkill("guogong2");
					}
					var list = game.boss.getEnemies();
					for (var x = 0; x < list.length; x++) {
						list[x].removeSkill("boss_wangshi2");
					}
					"step 1";
					var list = [["boss_chujiangwang", "boss_songdiwang", "boss_wuguanwang", "boss_yanluowang"], ["boss_bianchengwang", "boss_taishanwang", "boss_dushiwang", "boss_pingdengwang"], ["boss_zhuanlunwang"]][_status.shidianyanluo_level];
					//如果mengpo死亡且50回合内通过第三关，list[2]变成地藏王
					if (game.phaseNumber <= 50 && _status.shidianyanluo_level == 2 && _status.shidianyanluo_mengpodie == true) {
						list = ["boss_dizangwang"];
					}
					if (list.length == 1) event._result = { control: list[0] };
					else {
						player
							.chooseControl(list)
							.set("forceDie", true)
							.set("choice", list.randomGet())
							.set("ai", function () {
								return _status.event.choice;
							}).prompt = "选择下一个登场的武将";
					}
					"step 2";
					_status.shidianyanluo_level++;
					game.changeBoss(result.control);
					//地藏王登场摸3
					if (result.control == "boss_dizangwang") {
						game.boss.draw(3);
					}
					//计回合数
					var level = _status.shidianyanluo_level;
					//孟婆
					if (!_status.shidianyanluo_mengpo) {
						if (Math.random() <= 0.5 || level == 2) {
							if (game.me != game.boss) {
								game.boss.changeSeat(6);
							} else {
								game.boss.nextSeat.changeSeat(3);
								game.boss.previousSeat.changeSeat(5);
							}
							//game.addBossFellow();
							var fellow = game.addFellow(game.me == game.boss ? 1 : 7, "boss_mengpo", "zoominanim");
							if (_status.shidianyanluo_level != 0) {
								fellow.directgain(get.cards(4));
							}
							fellow.side = true;
							fellow.identity = "zhong";
							fellow.setIdentity("zhong");
							game.addVideo("setIdentity", fellow, "zhong");
							_status.shidianyanluo_mengpo = true;
						}
					} else {
						//移除孟婆
						game.countPlayer2(function (current) {
							if (current.name == "boss_mengpo") {
								current.removed = true;
								current.classList.add("dead");
								current.remove();
								game.players.remove(current);
							}
						});
					}
					//然后是boss进行回合
					game.phaseLoop(game.boss);
				},
			},
			boss_bingfeng: {
				audio: true,
				trigger: { player: "die" },
				forceDie: true,
				forced: true,
				filter: function (event) {
					return event.source && !event.source.isTurnedOver();
				},
				logTarget: "source",
				content: function () {
					trigger.source.turnOver();
				},
			},
			boss_chujiangwang_weimu: { audio: true },
			boss_chujiangwang_fankui: { audio: true },
			boss_heisheng: {
				audio: true,
				trigger: { player: "die" },
				forceDie: true,
				forced: true,
				content: function () {
					player.line(game.players.slice(0));
					game.countPlayer(function (current) {
						if (current != player) current.link();
					});
				},
			},
			boss_shengfu: {
				audio: true,
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				popup: false,
				content: function () {
					var list = [];
					game.countPlayer(function (current) {
						if (current == player) return;
						var es = current.getCards("e", { subtype: ["equip3", "equip4", "equip6"] });
						if (es.length) list.push([current, es]);
					});
					if (list.length) {
						player.logSkill("boss_heisheng");
						var current = list.randomGet();
						player.line(current[0]);
						current[0].discard(current[1].randomGet());
					}
				},
			},
			boss_songdiwang_enyuan: { audio: true },
			boss_zhiwang: {
				audio: true,
				derivation: "boss_zhiwang_planetarian",
				trigger: { global: "gainEnd" },
				filter: function (event, player) {
					return event.player != player && !(event.getParent().name == "draw" && event.getParent(2).name == "phaseDraw") && event.player.countCards("h");
				},
				forced: true,
				logTarget: "player",
				content: function () {
					var evt = trigger.getParent("boss_zhiwang");
					if (evt && evt.name == "boss_zhiwang") {
						trigger.player.uninit();
						trigger.player.init("sunce");
					}
					var hs = trigger.player.getCards("h");
					if (hs.length) {
						trigger.player.discard(hs.randomGet());
					}
				},
				subSkill: { planetarian: {} },
			},
			boss_gongzheng: {
				audio: true,
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				filter: function (event, player) {
					return player.countCards("j") > 0;
				},
				content: function () {
					player.discard(player.getCards("j").randomGet());
				},
			},
			boss_xuechi: {
				audio: true,
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				content: function () {
					var list = game.players.slice(0);
					list.remove(player);
					var target = list.randomGet();
					player.line(target);
					target.loseHp(2);
				},
			},
			boss_tiemian: {
				inherit: "renwang_skill",
				priority: -0.3,
				equipSkill: false,
				filter: function (event, player) {
					if (!player.hasEmptySlot(2)) return false;
					return lib.skill.renwang_skill.filter.apply(this, arguments);
				},
			},
			boss_zhadao: {
				inherit: "qinggang_skill",
				equipSkill: false,
			},
			boss_zhuxin: {
				audio: true,
				trigger: { player: "die" },
				forceDie: true,
				forced: true,
				content: function () {
					"step 0";
					player
						.chooseTarget("【诛心】：请选择一名角色，令其受到2点伤害。", function (card, player, target) {
							return (
								target != player &&
								!game.hasPlayer(function (current) {
									return current != player && current != target && current.hp < target.hp;
								})
							);
						})
						.set("forceDie", true).ai = function (target) {
						return -get.attitude(_status.event.player, target);
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target);
						target.damage(2);
					}
				},
			},
			boss_leizhou: {
				audio: true,
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				content: function () {
					var list = game.players.slice(0);
					list.remove(player);
					if (list.length) {
						var target = list.randomGet();
						player.line(target);
						target.damage("thunder");
					}
				},
			},
			boss_leifu: {
				audio: true,
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				content: function () {
					var list = game.players.slice(0);
					list.remove(player);
					if (list.length) {
						var target = list.randomGet();
						player.line(target);
						target.link();
					}
				},
			},
			boss_leizhu: {
				audio: true,
				trigger: { player: "die" },
				forceDie: true,
				forced: true,
				content: function () {
					var list = game.players.slice(0);
					list.remove(player);
					if (list.length) {
						list.sort(lib.sort.seat);
						player.line(list);
						for (var i = 0; i < list.length; i++) {
							list[i].damage("thunder");
						}
					}
				},
			},
			boss_fudu: {
				audio: true,
				trigger: { global: "useCard" },
				forced: true,
				filter: function (event, player) {
					return event.card.name == "tao" && event.player != player && game.players.length > 2;
				},
				content: function () {
					var list = game.players.slice(0);
					list.remove(player);
					list.remove(trigger.player);
					var target = list.randomGet();
					player.line(target);
					target.loseHp();
				},
			},
			boss_kujiu: {
				audio: true,
				trigger: { global: "phaseZhunbeiBegin" },
				forced: true,
				filter: function (event, player) {
					return event.player != player;
				},
				logTarget: "player",
				content: function () {
					"step 0";
					trigger.player.loseHp();
					"step 1";
					trigger.player.useCard({ name: "jiu" }, trigger.player);
				},
			},
			boss_renao: {
				audio: true,
				trigger: { player: "die" },
				forceDie: true,
				forced: true,
				content: function () {
					var list = game.players.slice(0);
					list.remove(player);
					if (list.length) {
						var target = list.randomGet();
						player.line(target);
						target.damage(3, "fire");
					}
				},
			},
			boss_remen: {
				trigger: { target: ["useCardToBefore"] },
				forced: true,
				priority: 6,
				audio: true,
				filter: function (event, player) {
					if (!player.hasEmptySlot("equip2")) return false;
					if (event.card.name == "nanman") return true;
					if (event.card.name == "wanjian") return true;
					return event.card.name == "sha" && !game.hasNature(event.card);
				},
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (!target.hasEmptySlot("equip2")) return;
							if (card.name == "nanman" || card.name == "wanjian") return "zeroplayertarget";
							if (card.name == "sha") {
								var equip1 = player.getEquip(1);
								if (equip1 && equip1.name == "zhuque") return 1.9;
								if (!game.hasNature(card)) return "zeroplayertarget";
							}
						},
					},
				},
			},
			boss_zhifen: {
				audio: true,
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				content: function () {
					"step 0";
					var list = game.filterPlayer();
					list.remove(player);
					if (list.length) {
						var target = list.randomGet();
						player.line(target);
						event.target = target;
						if (target.countGainableCards(player, "h")) player.gainPlayerCard(target, "h", true);
					} else event.finish();
					"step 1";
					target.damage("fire");
				},
			},

			boss_huoxing: {
				audio: true,
				trigger: { player: "die" },
				forceDie: true,
				forced: true,
				content: function () {
					var list = game.players.slice(0);
					list.remove(player);
					if (list.length) {
						list.sort(lib.sort.seat);
						player.line(list);
						for (var i = 0; i < list.length; i++) {
							list[i].damage("fire");
						}
					}
				},
			},
			boss_suozu: {
				audio: true,
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				content: function () {
					var list = game.players.slice(0);
					list.remove(player);
					if (list.length) {
						list.sort(lib.sort.seat);
						player.line(list);
						for (var i = 0; i < list.length; i++) {
							list[i].link();
						}
					}
				},
			},
			boss_abi: {
				audio: true,
				trigger: { player: "damageEnd" },
				forced: true,
				filter: function (event) {
					return event.source != undefined;
				},
				logTarget: "source",
				content: function () {
					trigger.source.damage().nature = ["fire", "thunder"].randomGet();
				},
			},
			boss_pingdeng: {
				audio: true,
				trigger: { player: "die" },
				forceDie: true,
				forced: true,
				content: function () {
					"step 0";
					var list = game.filterPlayer(function (current) {
						return (
							current != player &&
							!game.hasPlayer(function (current2) {
								return current2.hp > current.hp;
							})
						);
					});
					if (list.length) {
						var target = list.randomGet();
						player.line(target);
						target.damage(2).nature = lib.linked.randomGet();
					} else event.finish();
					"step 1";
					var list = game.filterPlayer(function (current) {
						return (
							current != player &&
							!game.hasPlayer(function (current2) {
								return current2.hp > current.hp;
							})
						);
					});
					if (list.length) {
						var target = list.randomGet();
						player.line(target);
						target.damage().nature = lib.linked.randomGet();
					}
				},
			},
			boss_lunhui: {
				audio: true,
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				filter: function (event, player) {
					return (
						player.hp <= 2 &&
						game.hasPlayer(function (current) {
							return current != player && current.hp > 2;
						})
					);
				},
				content: function () {
					var list = game.filterPlayer(function (current) {
						return current != player && current.hp > 2;
					});
					if (list.length) {
						var target = list.randomGet();
						player.line(target);
						var hp1 = player.hp;
						var hp2 = target.hp;
						player.hp = Math.min(player.maxHp, hp2);
						target.hp = Math.min(target.maxHp, hp1);
						player.update();
						target.update();
						game.log(player, "和", target, "交换了体力值");
					}
				},
			},
			boss_wangsheng: {
				audio: true,
				trigger: { player: "phaseUseBegin" },
				forced: true,
				content: function () {
					var name = ["nanman", "wanjian"].randomGet();
					player.useCard(
						{ name: name },
						game.filterPlayer(function (current) {
							return player.canUse({ name: name }, current);
						}),
						"noai"
					);
				},
			},
			boss_zlfanshi: {
				audio: true,
				trigger: { player: "damageEnd" },
				forced: true,
				content: function () {
					if (player.hasSkill("boss_zlfanshi_terra")) {
						var list = game.players.slice(0);
						list.remove(player);
						if (list.length) {
							var target = list.randomGet();
							player.line(target);
							target.damage();
						}
					} else player.addTempSkill("boss_zlfanshi_terra");
				},
			},
			boss_zlfanshi_terra: { charlotte: true },
			//孟婆:
			boss_shiyou: {
				audio: true,
				trigger: { global: "loseAfter" },
				filter: function (event, player) {
					var evt = event.getParent(3);
					return event.type == "discard" && evt.name == "phaseDiscard" && evt.player == event.player && evt.player != player && event.cards2 && event.cards2.filterInD("d").length > 0;
				},
				content: function () {
					"step 0";
					event.cards = trigger.cards2.filterInD("d");
					"step 1";
					var next = player
						.chooseCardButton(get.prompt("boss_shiyou"), event.cards, [1, event.cards.length])
						.set("ai", function (button) {
							return get.value(button.link, player);
						})
						.set("filterButton", function (button) {
							for (var i = 0; i < ui.selected.buttons.length; i++) {
								if (get.suit(ui.selected.buttons[i].link) == get.suit(button.link)) return false;
							}
							return true;
						});
					"step 2";
					if (result.bool) {
						player.gain(result.links, "gain2", "log");
					}
				},
			},
			boss_wangshi: {
				trigger: { global: "phaseZhunbeiBegin" },
				forced: true,
				audio: true,
				filter: function (event, player) {
					if (player.getEnemies().includes(event.player)) {
						return true;
					}
					return false;
				},
				logTarget: "player",
				content: function () {
					var list = ["basic", "trick", "equip"].randomGet();
					trigger.player.addTempSkill("boss_wangshi2");
					trigger.player.storage.boss_wangshi2 = [list];
					game.log(trigger.player, "本回合不能使用或打出", list, "牌");
					trigger.player.markSkill("boss_wangshi2");
				},
			},
			boss_wangshi2: {
				unique: true,
				charlotte: true,
				intro: {
					content: function (storage) {
						return "不能使用或打出" + get.translation(storage) + "牌";
					},
				},
				init: function (player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				},
				//mark:true,
				onremove: true,
				mod: {
					cardEnabled2: function (card, player) {
						if (player.storage.boss_wangshi2.includes(get.type(card, "trick"))) return false;
					},
				},
			},
			boss_mengpohuihun1: {
				mode: ["boss"],
				trigger: {
					player: "loseEnd",
					global: "cardsDiscardEnd",
				},
				filter: function (event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].name == "boss_mengpohuihun" && get.position(event.cards[i], true) == "d") {
							return true;
						}
					}
					return false;
				},
				forced: true,
				popup: false,
				content: function () {
					var cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (trigger.cards[i].name == "boss_mengpohuihun" && get.position(trigger.cards[i]) == "d") {
							cards.push(trigger.cards[i]);
						}
					}
					if (cards.length) {
						game.cardsGotoSpecial(cards);
						game.log(cards, "已被移出游戏");
						player.popup("回魂");
					}
				},
			},
			boss_wanghun: {
				audio: true,
				forced: true,
				trigger: { player: "die" },
				forceDie: true,
				content: function () {
					_status.shidianyanluo_mengpodie = true;
					var list = player.getEnemies();
					if (list.length > 0) {
						for (var x = 0; x < list.length; x++) {
							list[x].removeSkill("boss_wangshi2");
						}
						var ran1 = list.randomGet(); //第一个角色
						list.remove(ran1); //移除
						var skills1 = ran1.getSkills(true, false);
						if (skills1.length) {
							for (var i = 0; i < skills1.length; i++) {
								//排除技能，然后随机失去一个可以失去的技能
								if (get.skills[i] || lib.skill[skills1[i]].charlotte || !lib.translate[skills1[i] + "_info"] || lib.skill[skills1[i]].zhuSkill == true) {
									skills1.splice(i--, 1);
								}
							}
							if (skills1.length > 0) {
								skills1 = skills1.randomGet();
								ran1.disableSkill("boss_wanghun", skills1);
								game.log(ran1, "失去了", skills1);
							} else {
								game.log(ran1, "没有技能可失去");
							}
						}
						if (list.length > 0) {
							var ran2 = list.randomGet(); //第二个角色
							list.remove(ran2); //移除
							var skills2 = ran2.getSkills(true, false);
							if (skills2.length) {
								for (var i = 0; i < skills2.length; i++) {
									//排除技能，然后随机失去一个可以失去的技能
									if (get.skills[i] || lib.skill[skills2[i]].charlotte || !lib.translate[skills2[i] + "_info"] || lib.skill[skills2[i]].zhuSkill == true) {
										skills2.splice(i--, 1);
									}
								}
								if (skills2.length > 0) {
									skills2 = skills2.randomGet();
									ran2.disableSkill("boss_wanghun", skills2);
									game.log(ran2, "失去了", skills2);
								} else {
									game.log(ran2, "没有技能可失去");
								}
							}
						}
						//添加两张回魂
						if (get.mode() == "boss") {
							var card1 = game.createCard("boss_mengpohuihun", "heart", 3, null);
							var card2 = game.createCard("boss_mengpohuihun", "club", 4, null);
							var a = [];
							if (ui.cardPile.childElementCount < 3) {
								game.boss.getCards(4);
							}
							for (var i = 0; i < ui.cardPile.childElementCount; i++) {
								a.push(i);
							}
							ui.cardPile.insertBefore(card1, ui.cardPile.childNodes[a.randomGet()]);
							a.push(a.length);
							ui.cardPile.insertBefore(card2, ui.cardPile.childNodes[a.randomGet()]);
							game.log("牌堆中添加了", card1, card2);
							game.updateRoundNumber();
						}
					}
				},
			},
			//地藏王:
			boss_bufo: {
				audio: true,
				forced: true,
				trigger: {
					player: ["damageBegin4", "phaseZhunbeiBegin"],
				},
				filter: function (event, player, name) {
					if (name == "damageBegin4") {
						return event.num && event.num > 1;
					}
					return game.hasPlayer(function (target) {
						return player != target && get.distance(player, target) <= 1;
					});
				},
				content: function () {
					var name = event.triggername;
					if (name == "damageBegin4") {
						trigger.num--;
					} else {
						game.countPlayer(function (target) {
							if (player != target && get.distance(player, target) <= 1) {
								target.damage(1, player, "fire");
							}
						});
					}
				},
			},
			boss_wuliang: {
				forced: true,
				audio: true,
				trigger: {
					global: "gameDrawAfter",
					player: ["phaseZhunbeiBegin", "phaseJieshuBegin", "enterGame"],
				},
				filter: function (event, player, name) {
					if (name == "gameDrawAfter" || name == "enterGame") {
						return true;
					} else if (name == "phaseZhunbeiBegin") {
						return player.hp < 3;
					}
					return true;
				},
				content: function () {
					var name = event.triggername;
					if (name == "phaseZhunbeiBegin") {
						player.recover(3 - player.hp);
					} else {
						player.draw(name == "gameDrawAfter" || name == "enterGame" ? 3 : 2);
					}
				},
			},
			boss_dayuan: {
				trigger: {
					global: "judge",
				},
				audio: true,
				direct: true,
				lastDo: true,
				content: function () {
					"step 0";
					var card = trigger.player.judging[0];
					var judge0 = trigger.judge(card);
					var judge1 = 0;
					var choice = "cancel2";
					event.suitchoice = "cancel2";
					var attitude = get.attitude(player, trigger.player);
					var list = [];
					event.suitx = ["heart", "diamond", "club", "spade"];
					for (var x = 0; x < 4; x++) {
						for (var i = 1; i < 14; i++) {
							list.add(i);
							var judge2 =
								(trigger.judge({
									name: get.name(card),
									suit: event.suitx[x],
									number: i,
									nature: get.nature(card),
								}) -
									judge0) *
								attitude;
							if (judge2 > judge1) {
								choice = i;
								event.suitchoice = event.suitx[x];
								judge1 = judge2;
							}
						}
					}
					list.push("cancel2");
					event.suitx.push("cancel2");
					player
						.chooseControl(list)
						.set("ai", function () {
							return _status.event.choice;
						})
						.set("choice", choice).prompt = get.prompt2(event.name);
					"step 1";
					if (result.control != "cancel2") {
						if (!event.logged) {
							event.logged = true;
							player.logSkill(event.name, trigger.player);
						}
						game.log(trigger.player, "判定结果点数为", "#g" + result.control);
						player.popup(result.control, "fire");
						if (!trigger.fixedResult) trigger.fixedResult = {};
						trigger.fixedResult.number = result.control;
					}
					player
						.chooseControl(event.suitx)
						.set("ai", function () {
							return _status.event.choice;
						})
						.set("choice", event.suitchoice).prompt = get.prompt2(event.name);
					"step 2";
					if (result.control != "cancel2") {
						if (!event.logged) {
							event.logged = true;
							player.logSkill(event.name, trigger.player);
						}
						game.log(trigger.player, "判定结果花色为", "#g" + result.control);
						player.popup(result.control, "fire");
						if (!trigger.fixedResult) trigger.fixedResult = {};
						trigger.fixedResult.suit = result.control;
						if (result.control == "club" || result.control == "spade") {
							trigger.fixedResult.color = "black";
						} else if (result.control == "heart" || result.control == "diamond") {
							trigger.fixedResult.color = "red";
						}
					}
				},
			},
			boss_diting: {
				audio: true,
				mod: {
					globalFrom: function (from, to, distance) {
						return distance - 1;
					},
					globalTo: function (from, to, distance) {
						return distance + 1;
					},
				},
				enable: "phaseUse",
				position: "h",
				filter: function (event, player) {
					return player.countCards("he", { subtype: ["equip3", "equip4", "equip6"] }) > 0;
				},
				filterCard: function (card) {
					return get.subtype(card) == "equip3" || get.subtype(card) == "equip4" || get.subtype(card) == "equip6";
				},
				check: function (card) {
					if (_status.event.player.isDisabled(get.subtype(card))) return 5;
					return 3 - get.value(card);
				},
				content: function () {
					player.draw();
				},
				discard: false,
				visible: true,
				loseTo: "discardPile",
				prompt: "将一张坐骑牌置入弃牌堆并摸一张牌",
				delay: 0.5,
				prepare: function (cards, player) {
					player.$throw(cards, 1000);
					game.log(player, "将", cards, "置入了弃牌堆");
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					},
				},
				group: "boss_diting_init",
				subSkill: {
					init: {
						trigger: {
							global: "gameStart",
							player: "enterGame",
						},
						forced: true,
						filter: function (event, player) {
							return player.hasEnabledSlot(3) || player.hasEnabledSlot(4);
						},
						content: function () {
							var disables = [];
							for (var i = 3; i <= 4; i++) {
								for (var j = 0; j < player.countEnabledSlot(i); j++) {
									disables.push(i);
								}
							}
							if (disables.length > 0) player.disableEquip(disables);
						},
					},
				},
			},
			/*
			"boss_sdyl_level":{
				trigger:{global:'gameStart'},
				forced:true,
				superCharlotte:true,
				charlotte:true,
				fixed:true,
				content:function(){},
				contentplayer:function(player){
					var list=[1,2,3,4,5];
					var list2=["boss_sdyl_playerlevel1","boss_sdyl_playerlevel2","boss_sdyl_playerlevel3","boss_sdyl_playerlevel4","boss_sdyl_playerlevel5"];
					player.removeAdditionalSkill('boss_sdyl_level');
					var num=list.randomGet();
					player.storage.boss_sdyl_level=num;
					var list3=list2.concat();
					list3.length=num;
					player.addAdditionalSkill('boss_sdyl_level',list3);
					game.log(player,'的等阶为',num);
					if(num>1){
						var a=function(card){
							return get.type(card)=='equip';
						};
						for(var i=0;i<ui.cardPile.childNodes.length;i++){
							if(a(ui.cardPile.childNodes[i])){
								player.chooseUseTarget(ui.cardPile.childNodes[i],'noanimate','nopopup',true);
								ui.cardPile.removeChild(ui.cardPile.childNodes[i]);
								player.update();
								game.delay(2);
								break;
							}
						}
					}
				},
				contentboss:function(boss){
					var list=[1,2,3,4,5];
					var list2=["boss_sdyl_bosslevel1","boss_sdyl_bosslevel2","boss_sdyl_bosslevel3","boss_sdyl_bosslevel4","boss_sdyl_bosslevel5"];
					boss.removeAdditionalSkill('boss_sdyl_level');
					var num=list.randomGet();
					boss.storage.boss_sdyl_level=num;
					var list3=list2.concat();
					list3.length=num;
					boss.addAdditionalSkill('boss_sdyl_level',list3);
					game.log(boss,'的等阶为',num);
					if(num>1){
						var a=function(card){
							return get.type(card)=='equip';
						};
						for(var i=0;i<ui.cardPile.childNodes.length;i++){
							if(a(ui.cardPile.childNodes[i])){
								boss.chooseUseTarget(ui.cardPile.childNodes[i],'noanimate','nopopup',true);
								ui.cardPile.removeChild(ui.cardPile.childNodes[i]);
								boss.update();
								game.delay(2);
								break;
							}
						}
					}
				},
			},
			"boss_sdyl_playerlevel1":{
				fixed:true,
				globalFixed:true,
				charlotte:true,
				silent:true,
				popup:false,
				forced:true,
			},
			"boss_sdyl_playerlevel3":{
				fixed:true,
				globalFixed:true,
				charlotte:true,
				silent:true,
				popup:false,
				forced:true,
				init:function(player){
					player.maxHp++;
					player.hp++;
					player.update();
				},
				mod:{
					cardUsable:function (card,player,num){
						if(card.name=='sha') return num+=1;
					},
				},
			},
			"boss_sdyl_playerlevel2":{
				fixed:true,
				globalFixed:true,
				charlotte:true,
				silent:true,
				popup:false,
				forced:true,
			},
			"boss_sdyl_playerlevel4":{
				fixed:true,
				globalFixed:true,
				charlotte:true,
				silent:true,
				popup:false,
				forced:true,
				trigger:{player:'phaseDrawBegin2'},
				forced:true,
				filter:function (event,player){
					return !event.numFixed;
				},
				content:function(){
					trigger.num++;
				},
			},
			"boss_sdyl_playerlevel5":{
				init:function(player){
					player.storage.boss_sdyl_playerlevel5=false;
					player.maxHp++;
					player.hp++;
					player.update();
				},
				audio:'niepan',
				unique:true,
				enable:'chooseToUse',
				mark:true,
				skillAnimation:true,
				animationStr:'重生',
				limited:true,
				animationColor:'orange',
				filter:function(event,player){
					if(player.storage.boss_sdyl_playerlevel5) return false;
					if(event.type=='dying'){
						if(player!=event.dying) return false;
						return true;
					}
					return false;
				},
				content:function(){
					'step 0'
					player.awakenSkill('boss_sdyl_playerlevel5');
					player.storage.boss_sdyl_playerlevel5=true;
					player.discard(player.getCards('j'));
					'step 1'
					player.link(false);
					'step 2'
					player.turnOver(false);
					'step 3'
					player.drawTo(Math.min(5,player.maxHp));
					'step 4'
					player.recover(player.maxHp-player.hp);
				},
				ai:{
					order:1,
					skillTagFilter:function(player){
						if(player.storage.boss_sdyl_playerlevel5) return false;
						if(player.hp>0) return false;
					},
					save:true,
					result:{
						player:function(player){
							if(player.hp<=0) return 10;
							if(player.hp<=2&&player.countCards('he')<=1) return 10;
							return 0;
						}
					},
					threaten:function(player,target){
						if(!target.storage.boss_sdyl_playerlevel5) return 0.6;
					}
				},
				intro:{
					content:'limited'
				}
			},
			"boss_sdyl_bosslevel1":{
				fixed:true,
				globalFixed:true,
				charlotte:true,
				silent:true,
				popup:false,
				forced:true,
			},
			"boss_sdyl_bosslevel3":{
				fixed:true,
				globalFixed:true,
				charlotte:true,
				silent:true,
				popup:false,
				forced:true,
				init:function(player){
					player.maxHp++;
					player.hp++;
					player.update();
				},
				trigger:{player:'phaseZhunbeiBegin'},
				forced:true,
				content:function(){
					var card=get.cardPile('sha');
					if(card){
						player.gain(card);
					}
				},
				mod:{
					cardUsable:function (card,player,num){
						if(card.name=='sha') return num+=1;
					},
				},
			},
			"boss_sdyl_bosslevel2":{
				fixed:true,
				globalFixed:true,
				charlotte:true,
				silent:true,
				popup:false,
				forced:true,
			},
			"boss_sdyl_bosslevel4":{
				fixed:true,
				globalFixed:true,
				charlotte:true,
				silent:true,
				popup:false,
				forced:true,
				trigger:{player:'phaseDrawBegin2'},
				forced:true,
				filter:function (event,player){
					return !event.numFixed;
				},
				content:function(){
					trigger.num++;
				},
				mod:{
					maxHandcard:function (player,num){
						return num+=1;
					},
				},
			},
			"boss_sdyl_bosslevel5":{
				fixed:true,
				globalFixed:true,
				charlotte:true,
				silent:true,
				popup:false,
				forced:true,
				init:function(player){
					player.maxHp++;
					player.hp++;
					player.update();
					if(_status.shidianyanluo_level&&_status.shidianyanluo_level>0){
						var players=game.filterPlayer(function(current){return current!=player;});
						player.useCard({name:'nanman'},false,players);
					}
				},
				trigger:{
					source:"damageBegin4",
					player:"useCardAfter",
					global:'gameDrawAfter',
				},
				filter:function (event,player,name){
					if(name=='gameDrawAfter'){
						if(!_status.shidianyanluo_level||_status.shidianyanluo_level==0){
							var players=game.filterPlayer(function(current){return current!=player;});
							player.useCard({name:'nanman'},false,players);
						}
						return false;
					}
					if(player.storage.boss_sdyl_bosslevel5) return false;
					if(name=='damageBegin4'){
						if(!event.card||event.card.name!='nanman') return false;
						return true;
					}else if(name=='useCardAfter'){
						if(!event.card||event.card.name!='nanman') return false;
						player.storage.boss_sdyl_bosslevel5=true;
						return false;
					}
				},
				content:function (){
					trigger.num++;
				},
			},
	*/
			boss_jingjia: {},
			boss_aozhan: {
				forced: true,
				locked: true,
				charlotte: true,
				group: ["boss_aozhan_wuqi", "boss_aozhan_fangju", "boss_aozhan_zuoji", "boss_aozhan_baowu"],
				subSkill: {
					wuqi: {
						mod: {
							cardUsable: function (card, player, num) {
								if (player.getEquip(1) && card.name == "sha") return num + 1;
							},
						},
						sub: true,
					},
					fangju: {
						trigger: {
							player: "damageBegin4",
						},
						forced: true,
						filter: function (event, player) {
							return player.getEquip(2) && event.num > 1;
						},
						content: function () {
							trigger.num = 1;
						},
						sub: true,
					},
					zuoji: {
						trigger: {
							player: "phaseDrawBegin",
						},
						forced: true,
						filter: function (event, player) {
							return player.getEquip(3) || player.getEquip(4);
						},
						content: function () {
							trigger.num++;
						},
						sub: true,
					},
					baowu: {
						trigger: {
							player: "phaseJudgeBefore",
						},
						forced: true,
						filter: function (event, player) {
							return player.getEquip(5);
						},
						content: function () {
							trigger.cancel();
							game.log(player, "跳过了判定阶段");
						},
						sub: true,
					},
				},
			},

			boss_yaoshou: {
				mod: {
					globalFrom: function (from, to, distance) {
						return distance - 2;
					},
				},
			},
			boss_duqu: {
				trigger: { player: "damageEnd" },
				filter: function (event, player) {
					return event.source && !event.source.hasSkill("boss_duqu");
				},
				content: function () {
					var target = trigger.source;
					if (!target.storage.boss_shedu) target.storage.boss_shedu = 0;
					target.storage.boss_shedu++;
					target.markSkill("boss_shedu");
				},
				forced: true,
				global: "boss_shedu",
				mod: {
					cardname: function (card, player) {
						if (card.name == "tao") return "sha";
					},
				},
			},
			boss_shedu: {
				trigger: { player: "phaseBegin" },
				mark: true,
				intro: { content: "mark" },
				forced: true,
				filter: function (event, player) {
					return player.storage.boss_shedu && player.storage.boss_shedu > 0;
				},
				content: function () {
					"step 0";
					var num = player.storage.boss_shedu;
					event.num = num;
					var chs = get.cnNumber(num);
					player.chooseToDiscard("he", num, "弃置" + chs + "张牌，或失去" + chs + "点体力").ai = function (card) {
						return 12 - get.value(card);
					};
					"step 1";
					if (!result.bool) player.loseHp(num);
					player.storage.boss_shedu--;
					if (num > 1) player.markSkill("boss_shedu");
					else player.unmarkSkill("boss_shedu");
				},
			},
			boss_jiushou: {
				mod: {
					maxHandcard: function (player, num) {
						return num - player.hp + 9;
					},
				},
				trigger: { player: ["phaseUseBegin", "phaseJieshuBegin", "phaseDrawBegin"] },
				forced: true,
				filter: function (event, player) {
					return event.name == "phaseDraw" || player.countCards("h") < 9;
				},
				content: function () {
					if (trigger.name == "phaseDraw") trigger.cancel();
					else player.draw(9 - player.countCards("h"));
				},
			},
			boss_echou_switch: {
				unique: true,
				charlotte: true,
				group: ["boss_echou_switch_on", "boss_echou_switch_off"],
				subSkill: {
					off: {
						trigger: { global: "gameStart" },
						content: function () {
							player.disableSkill("boss_echou_awake", "boss_echou");
						},
						silent: true,
					},
					on: {
						trigger: { player: "changeHp" },
						filter: function (event, player) {
							return player.hp <= player.maxHp / 2;
						},
						forced: true,
						skillAnimation: true,
						animationColor: "thunder",
						content: function () {
							player.enableSkill("boss_echou_awake");
							player.removeSkill("boss_echou_switch");
						},
					},
				},
			},
			boss_echou: {
				trigger: { global: "useCard" },
				filter: function (event, player) {
					return !event.player.hasSkill("boss_duqu") && ["tao", "jiu"].includes(event.card.name);
				},
				content: function () {
					var target = trigger.player;
					player.line(target);
					if (!target.storage.boss_shedu) target.storage.boss_shedu = 0;
					target.storage.boss_shedu++;
					target.markSkill("boss_shedu");
				},
			},
			boss_bingxian: {
				trigger: { global: "phaseJieshuBegin" },
				filter: function (event, player) {
					return event.player != player && event.player.countUsed("sha", true) == 0;
				},
				forced: true,
				content: function () {
					player.useCard({ name: "sha" }, trigger.player);
				},
			},
			boss_juyuan: {
				init: function (player, skill) {
					player.storage[skill] = 0;
				},
				trigger: { player: "phaseAfter" },
				forced: true,
				silent: true,
				popup: false,
				content: function () {
					player.storage.boss_juyuan = player.hp;
				},
				mod: {
					selectTarget: function (card, player, range) {
						if (card.name != "sha") return;
						if (range[1] == -1) return;
						if (player.hp >= player.storage.boss_juyuan) return;
						range[1] += 2;
					},
				},
			},
			boss_xushi_switch: {
				unique: true,
				charlotte: true,
				group: ["boss_xushi_switch_on", "boss_xushi_switch_off"],
				subSkill: {
					off: {
						trigger: { global: "gameStart" },
						content: function () {
							player.disableSkill("boss_xushi_awake", "boss_xushi");
						},
						silent: true,
					},
					on: {
						trigger: { player: "changeHp" },
						filter: function (event, player) {
							return player.hp <= player.maxHp / 2;
						},
						forced: true,
						skillAnimation: true,
						animationColor: "thunder",
						content: function () {
							player.enableSkill("boss_xushi_awake");
							player.removeSkill("boss_xushi_switch");
						},
					},
				},
			},
			boss_xushi: {
				trigger: { player: ["phaseUseEnd", "turnOverEnd"] },
				filter: function (event, player) {
					return event.name == "phaseUse" || !player.isTurnedOver();
				},
				forced: true,
				content: function () {
					"step 0";
					if (trigger.name == "phaseUse") {
						player.turnOver();
						event.finish();
					} else {
						event.list = game.filterPlayer(function (current) {
							return current != player;
						});
						event.list.sort(lib.sort.seat);
						player.line(event.list, "green");
					}
					"step 1";
					var target = event.list.shift();
					target.damage([1, 2].randomGet());
					if (event.list.length) event.redo();
				},
			},
			boss_zhaohuo: {
				trigger: {
					player: "damageBegin4",
					source: "damageBegin1",
				},
				forced: true,
				filter: function (event, player) {
					if (player == event.player) return event.hasNature("fire") || player == event.source;
					return true;
				},
				content: function () {
					if (player == trigger.player) trigger.cancel();
					else game.setNature(trigger, "fire");
				},
				ai: {
					unequip: true,
					skillTagFilter: function (player) {
						if (player != _status.currentPhase) return false;
					},
				},
			},
			boss_honglianx: {
				mod: {
					ignoredHandcard: function (card, player) {
						if (get.color(card) == "red") {
							return true;
						}
					},
					cardDiscardable: function (card, player, name) {
						if (name == "phaseDiscard" && get.color(card) == "red") return false;
					},
				},
				forced: true,
				trigger: { player: "phaseZhunbeiBegin" },
				content: function () {
					"step 0";
					event.num1 = 3;
					event.num2 = [0, 1, 2, 3].randomGet();
					event.togain = [];
					while (event.togain.length < event.num2) {
						var card = get.cardPile(function (card) {
							return !event.togain.includes(card) && get.color(card) == "red";
						});
						if (card) event.togain.push(card);
						else break;
					}
					event.num1 -= event.togain.length;
					if (event.togain.length) player.gain(event.togain, "draw");
					if (event.num1 == 0) event.finish();
					else {
						event.list = game
							.filterPlayer(function (current) {
								return current != player;
							})
							.randomGets(event.num1)
							.sortBySeat();
						player.line(event.list, "fire");
					}
					"step 1";
					var target = event.list.shift();
					target.damage("fire");
					if (event.list.length) event.redo();
				},
			},
			boss_yanyu_switch: {
				unique: true,
				charlotte: true,
				group: ["boss_yanyu_switch_on", "boss_yanyu_switch_off"],
				subSkill: {
					off: {
						trigger: { global: "gameStart" },
						content: function () {
							player.disableSkill("boss_yanyu_awake", "boss_yanyu");
						},
						silent: true,
					},
					on: {
						trigger: { player: "changeHp" },
						filter: function (event, player) {
							return player.hp <= player.maxHp / 2;
						},
						forced: true,
						skillAnimation: true,
						animationColor: "thunder",
						content: function () {
							player.enableSkill("boss_yanyu_awake");
							player.removeSkill("boss_yanyu_switch");
						},
					},
				},
			},
			boss_yanyu: {
				forced: true,
				trigger: { global: "phaseBegin" },
				filter: function (event, player) {
					return player != event.player;
				},
				content: function () {
					"step 0";
					event.count = 3;
					player.line(trigger.player, "fire");
					"step 1";
					event.count--;
					trigger.player.judge(function (card) {
						if (get.color(card) == "red") return -5;
						return 5;
					});
					"step 2";
					if (!result.bool) {
						trigger.player.damage("fire");
						if (event.count) event.goto(1);
					}
				},
			},
			boss_fengdong: {
				trigger: { player: "phaseBegin" },
				forced: true,
				content: function () {
					game.countPlayer(function (current) {
						if (current != player) current.addTempSkill("fengyin");
					});
				},
			},
			boss_xunyou: {
				trigger: { global: "phaseBegin" },
				forced: true,
				filter: function (event, player) {
					return player != event.player;
				},
				content: function () {
					"step 0";
					var list = game.filterPlayer(function (current) {
						return current != player && current.countCards("hej");
					});
					if (list.length) {
						var target = list.randomGet();
						player.line(target, "green");
						var card = target.getCards("hej").randomGet();
						event.card = card;
						player.gain(card, target);
						target.$giveAuto(card, player);
					} else event.finish();
					"step 1";
					if (player.getCards("h").includes(card) && get.type(card) == "equip") player.chooseUseTarget(card, true, "nopopup", "noanimate");
				},
			},
			boss_sipu_switch: {
				unique: true,
				charlotte: true,
				group: ["boss_sipu_switch_on", "boss_sipu_switch_off"],
				subSkill: {
					off: {
						trigger: { global: "gameStart" },
						content: function () {
							player.disableSkill("boss_sipu_awake", "boss_sipu");
						},
						silent: true,
					},
					on: {
						trigger: { player: "changeHp" },
						filter: function (event, player) {
							return player.hp <= player.maxHp / 2;
						},
						forced: true,
						skillAnimation: true,
						animationColor: "thunder",
						content: function () {
							player.enableSkill("boss_sipu_awake");
							player.removeSkill("boss_sipu_switch");
						},
					},
				},
			},
			boss_sipu: {
				global: "boss_sipu2",
			},
			boss_sipu2: {
				mod: {
					cardEnabled: function (card, player) {
						var sc = _status.currentPhase;
						if (sc && sc != player && sc.isPhaseUsing() && sc.hasSkill("boss_sipu") && !sc.hasSkill("boss_sipu_switch") && sc.countUsed() < 3) {
							return false;
						}
					},
					cardUsable: function (card, player) {
						var sc = _status.currentPhase;
						if (sc && sc != player && sc.isPhaseUsing() && sc.hasSkill("boss_sipu") && !sc.hasSkill("boss_sipu_switch") && sc.countUsed() < 3) {
							return false;
						}
					},
					cardRespondable: function (card, player) {
						var sc = _status.currentPhase;
						if (sc && sc != player && sc.isPhaseUsing() && sc.hasSkill("boss_sipu") && !sc.hasSkill("boss_sipu_switch") && sc.countUsed() < 3) {
							return false;
						}
					},
					cardSavable: function (card, player) {
						var sc = _status.currentPhase;
						if (sc && sc != player && sc.isPhaseUsing() && sc.hasSkill("boss_sipu") && !sc.hasSkill("boss_sipu_switch") && sc.countUsed() < 3) {
							return false;
						}
					},
				},
			},
			/*----分界线----*/
			boss_zirun: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				logTarget: function () {
					return game.filterPlayer();
				},
				content: function () {
					var list = game.filterPlayer().sortBySeat();
					game.asyncDraw(list, function (current) {
						if (current.countCards("e")) return 2;
						return 1;
					});
				},
			},
			boss_juehong: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				logTarget: function (event, player) {
					return player.getEnemies();
				},
				content: function () {
					"step 0";
					event.list = player.getEnemies().sortBySeat();
					"step 1";
					if (event.list.length) {
						var target = event.list.shift();
						if (target.countCards("he")) {
							var es = target.getCards("e");
							if (es.length) {
								target.discard(es);
							} else {
								player.discardPlayerCard(target, "h", true);
							}
						}
						event.redo();
					}
				},
			},
			boss_zaoyi: {
				trigger: { global: "dieAfter" },
				forced: true,
				filter: function (event, player) {
					if (lib.config.mode != "boss") return false;
					var list = ["boss_shuishenxuanming", "boss_shuishengonggong"];
					if (list.includes(event.player.name)) {
						return !game.hasPlayer(function (current) {
							return list.includes(current.name);
						});
					}
					return false;
				},
				content: function () {
					player.draw(4);
					player.addSkill("boss_zaoyi_hp");
				},
				subSkill: {
					hp: {
						trigger: { player: "phaseZhunbeiBegin" },
						forced: true,
						mark: true,
						intro: {
							content: "每个回合开始时使体力值最少的敌方角色失去所有体力",
						},
						content: function () {
							var list = player.getEnemies();
							var min = list[0].hp;
							for (var i = 0; i < list.length; i++) {
								if (list[i].hp < min) {
									min = list[i].hp;
								}
							}
							for (var i = 0; i < list.length; i++) {
								if (list[i].hp > min) {
									list.splice(i--, 1);
								}
							}
							player.line(list, "green");
							list.sortBySeat();
							for (var i = 0; i < list.length; i++) {
								list[i].loseHp(min);
							}
						},
					},
				},
				mod: {
					targetEnabled: function (card, player, target, now) {
						if (target.isEnemyOf(player)) {
							var type = get.type(card, "trick");
							if (type == "trick") {
								if (
									game.hasPlayer(function (current) {
										return current.name == "boss_shuishenxuanming";
									})
								) {
									return false;
								}
							}
							if (type == "basic") {
								if (
									game.hasPlayer(function (current) {
										return current.name == "boss_shuishengonggong";
									})
								) {
									return false;
								}
							}
						}
					},
				},
			},
			boss_lingqu: {
				init: function (player) {
					player.storage.boss_lingqu = 0;
				},
				trigger: { player: "damageEnd" },
				forced: true,
				content: function () {
					player.draw();
					player.storage.boss_lingqu++;
					player.markSkill("boss_lingqu");
				},
				intro: {
					content: "手牌上限+#",
				},
				mod: {
					maxHandcard: function (player, num) {
						return num + player.storage.boss_lingqu;
					},
				},
				group: "boss_lingqu_cancel",
				subSkill: {
					cancel: {
						trigger: { player: "damageBegin4" },
						priority: -11,
						forced: true,
						filter: function (event) {
							return event.num > 1;
						},
						content: function () {
							trigger.num = 0;
						},
					},
				},
			},
			boss_baiyi: {
				group: ["boss_baiyi_draw", "boss_baiyi_thunder", "boss_baiyi_discard"],
				subSkill: {
					discard: {
						trigger: { global: "roundStart" },
						forced: true,
						filter: function () {
							return game.roundNumber == 5;
						},
						logTarget: function (event, player) {
							return player.getEnemies();
						},
						content: function () {
							"step 0";
							event.list = player.getEnemies();
							"step 1";
							if (event.list.length) {
								event.list.shift().chooseToDiscard("he", true, 2);
								event.redo();
							}
						},
					},
					draw: {
						trigger: { global: "phaseDrawBegin" },
						forced: true,
						filter: function (event, player) {
							return game.roundNumber < 3 && event.player.isEnemyOf(player);
						},
						content: function () {
							trigger.num--;
						},
					},
					thunder: {
						trigger: { player: "damageBegin4" },
						filter: function (event) {
							return event.hasNature("thunder") && game.roundNumber < 7;
						},
						forced: true,
						content: function () {
							trigger.cancel();
						},
						ai: {
							nothunder: true,
							skillTagFilter: function () {
								return game.roundNumber < 7;
							},
							effect: {
								target: function (card, player, target, current) {
									if (get.tag(card, "thunderDamage") && game.roundNumber < 7) return 0;
								},
							},
						},
					},
				},
			},
			boss_qingzhu: {
				trigger: { player: "phaseDiscardBefore" },
				forced: true,
				content: function () {
					trigger.cancel();
				},
				mod: {
					cardEnabled: function (card, player) {
						if (card.name == "sha" && _status.currentPhase == player && _status.event.getParent("phaseUse") && !player.hasSkill("boss_jiding")) {
							return false;
						}
					},
				},
			},
			boss_jiazu: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				getTargets: function (player) {
					var targets = [];
					targets.add(player.getNext());
					targets.add(player.getPrevious());
					var enemies = player.getEnemies();
					for (var i = 0; i < targets.length; i++) {
						if (!enemies.includes(targets[i]) || (!targets[i].getEquip(3) && !targets[i].getEquip(4))) {
							targets.splice(i--, 1);
						}
					}
					return targets;
				},
				filter: function (event, player) {
					return lib.skill.boss_jiazu.getTargets(player).length > 0;
				},
				logTarget: function (event, player) {
					return lib.skill.boss_jiazu.getTargets(player);
				},
				content: function () {
					"step 0";
					event.list = lib.skill.boss_jiazu.getTargets(player).sortBySeat();
					"step 1";
					if (event.list.length) {
						var target = event.list.shift();
						var cards = target.getCards("e", function (card) {
							var subtype = get.subtype(card);
							return subtype == "equip3" || subtype == "equip4";
						});
						if (cards.length) {
							target.discard(cards);
						}
						event.redo();
					}
				},
			},
			boss_jiding: {
				trigger: { global: "damageEnd" },
				forced: true,
				mark: true,
				intro: {
					content: "info",
				},
				filter: function (event, player) {
					return event.player != player && event.player.isFriendOf(player) && event.source && event.source.isIn() && event.source.isEnemyOf(player);
				},
				logTarget: "source",
				content: function () {
					"step 0";
					player.useCard({ name: "sha", nature: "thunder" }, trigger.source);
					"step 1";
					player.removeSkill("boss_jiding");
				},
				group: "boss_jiding_recover",
				subSkill: {
					recover: {
						trigger: { source: "damageEnd" },
						silent: true,
						filter: function (event, player) {
							return event.getParent(3).name == "boss_jiding";
						},
						content: function () {
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].name == "boss_jinshenrushou") {
									game.players[i].recover();
									player.line(game.players[i], "green");
								}
							}
						},
					},
				},
			},
			boss_xingqiu: {
				init: function (player) {
					player.storage.boss_xingqiu = false;
				},
				trigger: { player: "phaseDrawBegin" },
				direct: true,
				locked: true,
				content: function () {
					"step 0";
					if (player.storage.boss_xingqiu) {
						player.logSkill("boss_xingqiu");
						event.list = player.getEnemies().sortBySeat();
					} else {
						event.finish();
					}
					player.storage.boss_xingqiu = !player.storage.boss_xingqiu;
					"step 1";
					if (event.list.length) {
						var target = event.list.shift();
						if (!target.isLinked()) {
							target.link();
							player.line(target, "green");
						}
						event.redo();
					}
					"step 2";
					game.delay();
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].name == "boss_mingxingzhu") {
							game.players[i].addSkill("boss_jiding");
						}
					}
				},
			},
			boss_kuangxiao: {
				mod: {
					targetInRange: function (card, player, target) {
						return true;
					},
					selectTarget: function (card, player, range) {
						if (card.name == "sha") {
							range[1] = -1;
							range[0] = -1;
						}
					},
					playerEnabled: function (card, player, target) {
						if (card.name == "sha" && target.isFriendOf(player)) {
							return false;
						}
					},
				},
			},
			boss_yinzei_switch: {
				unique: true,
				charlotte: true,
				group: ["boss_yinzei_switch_on", "boss_yinzei_switch_off"],
				subSkill: {
					off: {
						trigger: { global: "gameStart" },
						content: function () {
							player.disableSkill("boss_yinzei_awake", "boss_yinzei");
						},
						silent: true,
					},
					on: {
						trigger: { player: "changeHp" },
						filter: function (event, player) {
							return player.hp <= player.maxHp / 2;
						},
						forced: true,
						skillAnimation: true,
						animationColor: "thunder",
						content: function () {
							player.enableSkill("boss_yinzei_awake");
							player.removeSkill("boss_yinzei_switch");
						},
					},
				},
			},
			boss_jicai_switch: {
				unique: true,
				charlotte: true,
				group: ["boss_jicai_switch_on", "boss_jicai_switch_off"],
				subSkill: {
					off: {
						trigger: { global: "gameStart" },
						content: function () {
							player.disableSkill("boss_jicai_awake", "boss_jicai");
						},
						silent: true,
					},
					on: {
						trigger: { player: "changeHp" },
						filter: function (event, player) {
							return player.hp <= player.maxHp / 2;
						},
						forced: true,
						skillAnimation: true,
						animationColor: "thunder",
						content: function () {
							player.enableSkill("boss_jicai_awake");
							player.removeSkill("boss_jicai_switch");
						},
					},
				},
			},
			boss_luanchang_switch: {
				unique: true,
				charlotte: true,
				group: ["boss_luanchang_switch_on", "boss_luanchang_switch_off"],
				subSkill: {
					off: {
						trigger: { global: "gameStart" },
						content: function () {
							player.disableSkill("boss_luanchang_awake", "boss_luanchang");
						},
						silent: true,
					},
					on: {
						trigger: { player: "changeHp" },
						filter: function (event, player) {
							return player.hp <= player.maxHp / 2;
						},
						forced: true,
						skillAnimation: true,
						animationColor: "thunder",
						content: function () {
							player.enableSkill("boss_luanchang_awake");
							player.removeSkill("boss_luanchang_switch");
						},
					},
				},
			},
			boss_yandu_switch: {
				unique: true,
				charlotte: true,
				group: ["boss_yandu_switch_on", "boss_yandu_switch_off"],
				subSkill: {
					off: {
						trigger: { global: "gameStart" },
						content: function () {
							player.disableSkill("boss_yandu_awake", "boss_yandu");
						},
						silent: true,
					},
					on: {
						trigger: { player: "changeHp" },
						filter: function (event, player) {
							return player.hp <= player.maxHp / 2;
						},
						forced: true,
						skillAnimation: true,
						animationColor: "thunder",
						content: function () {
							player.enableSkill("boss_yandu_awake");
							player.removeSkill("boss_yandu_switch");
						},
					},
				},
			},
			boss_shenwuzaishi: {
				trigger: { global: "dieAfter" },
				silent: true,
				filter: function (event, player) {
					return player.side != game.boss.side;
				},
				content: function () {
					if (player == trigger.source && trigger.player.name == "boss_zhuyin") {
						player.draw(3);
						player.recover();
					} else if (trigger.player.side == player.side) {
						player.draw(player.group == "shen" ? 3 : 1);
						player.recover();
					}
				},
			},
			boss_wuzang: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				content: function () {
					trigger.num += Math.max(5, Math.floor(player.hp / 2)) - 2;
				},
				mod: {
					maxHandcard: function (player, num) {
						return num - player.hp;
					},
				},
			},
			boss_xiangde: {
				trigger: { player: "damageBegin3" },
				forced: true,
				filter: function (event, player) {
					return event.source && event.source.isIn() && event.source != player && event.source.getEquip(1);
				},
				content: function () {
					trigger.num++;
				},
			},
			boss_yinzei: {
				trigger: { player: "damageEnd" },
				forced: true,
				logTarget: "source",
				filter: function (event, player) {
					return event.source && event.source.isIn() && event.source != player && event.source.countCards("he") && !player.countCards("h");
				},
				content: function () {
					trigger.source.randomDiscard();
				},
			},
			boss_zhue: {
				trigger: { global: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return event.source && event.source.isIn() && event.source != player;
				},
				logTarget: "source",
				content: function () {
					game.asyncDraw([player, trigger.source]);
				},
			},
			boss_yandu: {
				trigger: { global: "phaseJieshuBegin" },
				filter: function (event, player) {
					return event.player != player && !event.player.getStat("damage") && event.player.countCards("he");
				},
				logTarget: "player",
				forced: true,
				content: function () {
					player.gainPlayerCard(trigger.player, true);
				},
			},
			boss_futai: {
				global: "boss_futai2",
				trigger: { player: "phaseZhunbeiBegin" },
				logTarget: function (event, player) {
					return game.filterPlayer(function (current) {
						return current.isDamaged();
					});
				},
				forced: true,
				content: function () {
					"step 0";
					var list = game
						.filterPlayer(function (current) {
							return current.isDamaged();
						})
						.sortBySeat();
					event.list = list;
					"step 1";
					if (event.list.length) {
						event.list.shift().recover();
						event.redo();
					}
				},
			},
			boss_futai2: {
				mod: {
					cardSavable: function (card, player) {
						if (
							card.name == "tao" &&
							!_status.event.skill &&
							game.hasPlayer(function (current) {
								return current != player && current.hasSkill("boss_futai") && _status.currentPhase != current;
							})
						) {
							return false;
						}
					},
					cardEnabled: function (card, player) {
						if (
							card.name == "tao" &&
							!_status.event.skill &&
							game.hasPlayer(function (current) {
								return current != player && current.hasSkill("boss_futai") && _status.currentPhase != current;
							})
						) {
							return false;
						}
					},
				},
			},
			boss_luanchang: {
				group: ["boss_luanchang_begin", "boss_luanchang_end"],
				subSkill: {
					begin: {
						trigger: { player: "phaseZhunbeiBegin" },
						forced: true,
						content: function () {
							var list = game
								.filterPlayer(function (current) {
									return player.canUse("nanman", current);
								})
								.sortBySeat();
							if (list.length) {
								player.useCard({ name: "nanman" }, list);
							}
						},
					},
					end: {
						trigger: { player: "phaseJieshuBegin" },
						forced: true,
						content: function () {
							var list = game
								.filterPlayer(function (current) {
									return player.canUse("wanjian", current);
								})
								.sortBySeat();
							if (list.length) {
								player.useCard({ name: "wanjian" }, list);
							}
						},
					},
				},
			},
			boss_nitai: {
				group: ["boss_nitai_in", "boss_nitai_out"],
				subSkill: {
					in: {
						trigger: { player: "damageBegin4" },
						forced: true,
						filter: function (event, player) {
							return _status.currentPhase == player;
						},
						content: function () {
							trigger.cancel();
						},
					},
					out: {
						trigger: { player: "damageBegin1" },
						forced: true,
						filter: function (event, player) {
							return _status.currentPhase != player && event.hasNature("fire");
						},
						content: function () {
							trigger.num++;
						},
					},
				},
			},
			boss_minwan: {
				group: ["boss_minwan_clear", "boss_minwan_draw", "boss_minwan_add"],
				subSkill: {
					clear: {
						trigger: { player: "phaseAfter" },
						silent: true,
						content: function () {
							delete player.storage.boss_minwan;
						},
					},
					draw: {
						trigger: { player: "useCard" },
						forced: true,
						filter: function (event, player) {
							return _status.currentPhase == player && Array.isArray(player.storage.boss_minwan);
						},
						content: function () {
							player.draw();
						},
					},
					add: {
						trigger: { source: "damageAfter" },
						filter: function (event, player) {
							return _status.currentPhase == player;
						},
						forced: true,
						content: function () {
							if (!player.storage.boss_minwan) {
								player.storage.boss_minwan = [player];
							}
							player.storage.boss_minwan.add(trigger.player);
						},
					},
				},
				mod: {
					playerEnabled: function (card, player, target) {
						if (_status.currentPhase == player && Array.isArray(player.storage.boss_minwan) && !player.storage.boss_minwan.includes(target)) {
							return false;
						}
					},
				},
			},
			boss_tanyu: {
				trigger: { player: "phaseDiscardBefore" },
				forced: true,
				content: function () {
					trigger.cancel();
				},
				group: "boss_tanyu_hp",
				subSkill: {
					hp: {
						trigger: { player: "phaseJieshuBegin" },
						forced: true,
						popup: false,
						filter: function (event, player) {
							return player.isMaxHandcard();
						},
						content: function () {
							player.loseHp();
						},
					},
				},
			},
			boss_cangmu: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				content: function () {
					trigger.num += game.countPlayer() - 2;
				},
			},
			boss_jicai: {
				trigger: { global: "recoverAfter" },
				forced: true,
				logTarget: "player",
				content: function () {
					if (trigger.player == player) {
						player.draw(2);
					} else {
						game.asyncDraw([player, trigger.player]);
					}
				},
			},
			boss_xiongshou: {
				group: ["boss_xiongshou_turn", "boss_xiongshou_damage"],
				subSkill: {
					damage: {
						trigger: { source: "damageBegin1" },
						forced: true,
						filter: function (event, player) {
							return event.notLink() && event.card && event.card.name == "sha" && event.player.hp < player.hp;
						},
						content: function () {
							trigger.num++;
						},
					},
					turn: {
						trigger: { player: "turnOverBefore" },
						priority: 20,
						forced: true,
						filter: function (event, player) {
							return !player.isTurnedOver();
						},
						content: function () {
							trigger.cancel();
							game.log(player, "取消了翻面");
						},
					},
				},
				mod: {
					globalFrom: function (from, to, distance) {
						return distance - 1;
					},
				},
				ai: {
					noturn: true,
				},
			},
			xiuluolianyuji2: {
				equipSkill: true,
				vanish: true,
				trigger: { player: "damageEnd" },
				forced: true,
				popup: false,
				content: function () {
					if (trigger.xiuluolianyuji) player.recover();
					player.removeSkill("xiuluolianyuji2");
				},
			},
			xiuluolianyuji: {
				mod: {
					selectTarget: function (card, player, range) {
						if (card.name != "sha") return;
						if (range[1] == -1) return;
						range[1] = Infinity;
					},
				},
				trigger: { source: "damageBegin1" },
				forced: true,
				filter: function (event) {
					return event.card && event.card.name == "sha";
				},
				content: function () {
					trigger.num++;
					trigger.xiuluolianyuji = true;
					trigger.player.addSkill("xiuluolianyuji2");
				},
			},
			juechenjinge: {
				equipSkill: true,
				global: "juechenjinge2",
			},
			juechenjinge2: {
				equipSkill: true,
				mod: {
					globalTo: function (from, to, distance) {
						return (
							distance +
							game.countPlayer(function (current) {
								if (current == to) return;
								if (current.side != to.side) return;
								if (current.hasSkill("juechenjinge")) return 1;
							})
						);
					},
				},
			},
			chiyanzhenhunqin: {
				equipSkill: true,
				trigger: { source: "damageBegin1" },
				forced: true,
				content: function () {
					game.setNature(trigger, "fire");
				},
			},
			longfenghemingjian: {
				equipSkill: true,
				inherit: "cixiong_skill",
				filter: function (event, player) {
					return get.natureList(event.card).some(i => {
						return i === "thunder" || i === "fire";
					});
				},
			},
			qicaishenlu: {
				trigger: { source: "damageBegin1" },
				forced: true,
				filter: function (event, player) {
					return event.hasNature("linked");
				},
				content: function () {
					trigger.num++;
				},
			},
			boss_chiyan: {
				trigger: { global: "gameStart" },
				forced: true,
				popup: false,
				unique: true,
				fixed: true,
				content: function () {
					player.smoothAvatar();
					player.init("boss_zhuque");
					_status.noswap = true;
					game.addVideo("reinit2", player, player.name);
				},
			},
			boss_chiyan2: {
				mode: ["boss"],
				global: "boss_chiyan2x",
				trigger: { player: "dieBegin" },
				silent: true,
				unique: true,
				fixed: true,
				filter: function (event, player) {
					return player == game.boss;
				},
				content: function () {
					player.hide();
					game.addVideo("hidePlayer", player);
				},
			},
			boss_chiyan2x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				fixed: true,
				globalFixed: true,
				unique: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_chiyan2");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					if (game.me != game.boss) {
						game.boss.changeSeat(6);
					} else {
						game.boss.nextSeat.changeSeat(3);
						game.boss.previousSeat.changeSeat(5);
					}
					game.changeBoss("boss_huoshenzhurong");
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].update();
					}
					game.delay(0.5);
					"step 2";
					game.addBossFellow(game.me == game.boss ? 1 : 5, "boss_yanling");
					game.addBossFellow(7, "boss_yanling");
					"step 3";
					var dnum = 0;
					var dead = game.dead.slice(0);
					for (var i = 0; i < dead.length; i++) {
						if (!dead[i].side && dead[i].maxHp > 0 && dead[i].parentNode == player.parentNode) {
							dead[i].revive(dead[i].maxHp);
							dnum++;
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side) continue;
						game.players[i].removeEquipTrigger();
						var hej = game.players[i].getCards("hej");
						for (var j = 0; j < hej.length; j++) {
							hej[j].discard(false);
						}
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].hujia = 0;
						game.players[i].classList.remove("turnedover");
						game.players[i].removeLink();
						game.players[i].directgain(get.cards(4 - dnum));
					}
					"step 4";
					while (_status.event.name != "phaseLoop") {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = game.boss;
					_status.event.step = 0;
					_status.roundStart = game.boss;
					game.phaseNumber = 0;
					game.roundNumber = 0;
					if (game.bossinfo) {
						game.bossinfo.loopType = 1;
					}
				},
			},
			boss_chiyan3: {
				mode: ["boss"],
				global: "boss_chiyan3x",
				trigger: { player: "dieBegin" },
				silent: true,
				fixed: true,
				unique: true,
				filter: function (event, player) {
					return player == game.boss;
				},
				content: function () {
					player.hide();
					player.nextSeat.hide();
					player.previousSeat.hide();
					game.addVideo("hidePlayer", player);
					game.addVideo("hidePlayer", player.nextSeat);
					game.addVideo("hidePlayer", player.previousSeat);
				},
			},
			boss_chiyan3x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				globalFixed: true,
				unique: true,
				fixed: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_chiyan3");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					game.changeBoss("boss_yandi");
					game.delay(0.5);
					"step 2";
					game.changeBoss("boss_huoshenzhurong", game.boss.previousSeat);
					game.changeBoss("boss_yanling", game.boss.nextSeat);
					"step 3";
					var dnum = 0;
					var dead = game.dead.slice(0);
					for (var i = 0; i < dead.length; i++) {
						if (!dead[i].side && dead[i].maxHp > 0 && dead[i].parentNode == player.parentNode) {
							dead[i].revive(dead[i].maxHp);
							dnum++;
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side) continue;
						game.players[i].removeEquipTrigger();
						var hej = game.players[i].getCards("hej");
						for (var j = 0; j < hej.length; j++) {
							hej[j].discard(false);
						}
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].hujia = 0;
						game.players[i].classList.remove("turnedover");
						game.players[i].removeLink();
						game.players[i].directgain(get.cards(4 - dnum));
					}
					"step 4";
					while (_status.event.name != "phaseLoop") {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = game.boss;
					_status.event.step = 0;
					_status.roundStart = game.boss;
					game.phaseNumber = 0;
					game.roundNumber = 0;
				},
			},
			boss_qingmu: {
				trigger: { global: "gameStart" },
				forced: true,
				popup: false,
				fixed: true,
				unique: true,
				content: function () {
					player.smoothAvatar();
					player.init("boss_qinglong");
					_status.noswap = true;
					game.addVideo("reinit2", player, player.name);
				},
			},
			boss_qingmu2: {
				mode: ["boss"],
				global: "boss_qingmu2x",
				trigger: { player: "dieBegin" },
				silent: true,
				unique: true,
				fixed: true,
				filter: function (event, player) {
					return player == game.boss;
				},
				content: function () {
					player.hide();
					game.addVideo("hidePlayer", player);
				},
			},
			boss_qingmu2x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				globalFixed: true,
				unique: true,
				fixed: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_qingmu2");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					if (game.me != game.boss) {
						game.boss.changeSeat(6);
					} else {
						game.boss.nextSeat.changeSeat(3);
						game.boss.previousSeat.changeSeat(5);
					}
					game.changeBoss("boss_mushengoumang");
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].update();
					}
					game.delay(0.5);
					"step 2";
					game.addBossFellow(game.me == game.boss ? 1 : 5, "boss_shujing");
					game.addBossFellow(7, "boss_shujing");
					"step 3";
					var dnum = 0;
					var dead = game.dead.slice(0);
					for (var i = 0; i < dead.length; i++) {
						if (!dead[i].side && dead[i].maxHp > 0 && dead[i].parentNode == player.parentNode) {
							dead[i].revive(dead[i].maxHp);
							dnum++;
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side) continue;
						game.players[i].removeEquipTrigger();
						var hej = game.players[i].getCards("hej");
						for (var j = 0; j < hej.length; j++) {
							hej[j].discard(false);
						}
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].hujia = 0;
						game.players[i].classList.remove("turnedover");
						game.players[i].removeLink();
						game.players[i].directgain(get.cards(4 - dnum));
					}
					"step 4";
					while (_status.event.name != "phaseLoop") {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = game.boss;
					_status.event.step = 0;
					_status.roundStart = game.boss;
					game.phaseNumber = 0;
					game.roundNumber = 0;
					if (game.bossinfo) {
						game.bossinfo.loopType = 1;
					}
				},
			},
			boss_qingmu3: {
				mode: ["boss"],
				global: "boss_qingmu3x",
				trigger: { player: "dieBegin" },
				silent: true,
				fixed: true,
				unique: true,
				filter: function (event, player) {
					return player == game.boss;
				},
				content: function () {
					player.hide();
					player.nextSeat.hide();
					player.previousSeat.hide();
					game.addVideo("hidePlayer", player);
					game.addVideo("hidePlayer", player.nextSeat);
					game.addVideo("hidePlayer", player.previousSeat);
				},
			},
			boss_qingmu3x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				fixed: true,
				globalFixed: true,
				unique: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_qingmu3");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					game.changeBoss("boss_taihao");
					game.delay(0.5);
					"step 2";
					game.changeBoss("boss_mushengoumang", game.boss.previousSeat);
					game.changeBoss("boss_shujing", game.boss.nextSeat);
					"step 3";
					var dnum = 0;
					var dead = game.dead.slice(0);
					for (var i = 0; i < dead.length; i++) {
						if (!dead[i].side && dead[i].maxHp > 0 && dead[i].parentNode == player.parentNode) {
							dead[i].revive(dead[i].maxHp);
							dnum++;
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side) continue;
						game.players[i].removeEquipTrigger();
						var hej = game.players[i].getCards("hej");
						for (var j = 0; j < hej.length; j++) {
							hej[j].discard(false);
						}
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].hujia = 0;
						game.players[i].classList.remove("turnedover");
						game.players[i].removeLink();
						game.players[i].directgain(get.cards(4 - dnum));
					}
					"step 4";
					while (_status.event.name != "phaseLoop") {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = game.boss;
					_status.event.step = 0;
					_status.roundStart = game.boss;
					game.phaseNumber = 0;
					game.roundNumber = 0;
				},
			},
			boss_xuanlin: {
				trigger: { global: "gameStart" },
				forced: true,
				popup: false,
				fixed: true,
				unique: true,
				content: function () {
					player.smoothAvatar();
					player.init("boss_xuanwu");
					_status.noswap = true;
					game.addVideo("reinit2", player, player.name);
				},
			},
			boss_xuanlin2: {
				mode: ["boss"],
				global: "boss_xuanlin2x",
				trigger: { player: "dieBegin" },
				silent: true,
				unique: true,
				fixed: true,
				filter: function (event, player) {
					return player == game.boss;
				},
				content: function () {
					player.hide();
					game.addVideo("hidePlayer", player);
				},
			},
			boss_xuanlin2x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				globalFixed: true,
				unique: true,
				fixed: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_xuanlin2");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					if (game.me != game.boss) {
						game.boss.changeSeat(6);
					} else {
						game.boss.nextSeat.changeSeat(3);
						game.boss.previousSeat.changeSeat(5);
					}
					game.changeBoss("boss_shuishengonggong");
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].update();
					}
					game.delay(0.5);
					"step 2";
					game.addBossFellow(game.me == game.boss ? 1 : 7, "boss_shuishenxuanming");
					"step 3";
					var dnum = 0;
					var dead = game.dead.slice(0);
					for (var i = 0; i < dead.length; i++) {
						if (!dead[i].side && dead[i].maxHp > 0 && dead[i].parentNode == player.parentNode) {
							dead[i].revive(dead[i].maxHp);
							dnum++;
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side) continue;
						game.players[i].removeEquipTrigger();
						var hej = game.players[i].getCards("hej");
						for (var j = 0; j < hej.length; j++) {
							hej[j].discard(false);
						}
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].hujia = 0;
						game.players[i].classList.remove("turnedover");
						game.players[i].removeLink();
						game.players[i].directgain(get.cards(4 - dnum));
					}
					"step 4";
					while (_status.event.name != "phaseLoop") {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = game.boss;
					_status.event.step = 0;
					_status.roundStart = game.boss;
					game.phaseNumber = 0;
					game.roundNumber = 0;
					if (game.bossinfo) {
						game.bossinfo.loopType = 1;
					}
				},
			},
			boss_xuanlin3: {
				mode: ["boss"],
				global: "boss_xuanlin3x",
				trigger: { player: "dieBegin" },
				silent: true,
				fixed: true,
				unique: true,
				filter: function (event, player) {
					if (game.boss && game.boss.name == "boss_zhuanxu") return false;
					return true;
				},
				content: function () {
					player.hide();
					game.addVideo("hidePlayer", player);
					if (player.nextSeat.side == player.side) {
						player.nextSeat.hide();
						game.addVideo("hidePlayer", player.nextSeat);
					}
					if (player.previousSeat.side == player.side) {
						player.previousSeat.hide();
						player.previousSeat.node.handcards1.hide();
						player.previousSeat.node.handcards2.hide();
						game.addVideo("hidePlayer", player.previousSeat);
						game.addVideo("deleteHandcards", player.previousSeat);
					}
				},
			},
			boss_xuanlin3x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				fixed: true,
				globalFixed: true,
				unique: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					if (game.boss && game.boss.name == "boss_zhuanxu") return false;
					return event.player.hasSkill("boss_xuanlin3");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					game.changeBoss("boss_zhuanxu");
					game.delay(0.5);
					"step 2";
					game.addBossFellow(game.me == game.boss ? 7 : 5, "boss_shuishengonggong");
					game.changeBoss("boss_shuishenxuanming", game.boss.nextSeat);
					game.boss.previousSeat.maxHp--;
					game.boss.previousSeat.update();
					game.boss.nextSeat.maxHp--;
					game.boss.nextSeat.update();
					"step 3";
					var dnum = 0;
					var dead = game.dead.slice(0);
					for (var i = 0; i < dead.length; i++) {
						if (!dead[i].side && dead[i].maxHp > 0 && dead[i].parentNode == player.parentNode) {
							dead[i].revive(dead[i].maxHp);
							dnum++;
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side) continue;
						game.players[i].removeEquipTrigger();
						var hej = game.players[i].getCards("hej");
						for (var j = 0; j < hej.length; j++) {
							hej[j].discard(false);
						}
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].hujia = 0;
						game.players[i].classList.remove("turnedover");
						game.players[i].removeLink();
						game.players[i].directgain(get.cards(4 - dnum));
					}
					"step 4";
					while (_status.event.name != "phaseLoop") {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = game.boss;
					_status.event.step = 0;
					_status.roundStart = game.boss;
					game.phaseNumber = 0;
					game.roundNumber = 0;
				},
			},
			boss_baimang: {
				trigger: { global: "gameStart" },
				forced: true,
				popup: false,
				fixed: true,
				unique: true,
				content: function () {
					player.smoothAvatar();
					player.init("boss_baihu");
					_status.noswap = true;
					game.addVideo("reinit2", player, player.name);
				},
			},
			boss_baimang2: {
				mode: ["boss"],
				global: "boss_baimang2x",
				trigger: { player: "dieBegin" },
				silent: true,
				unique: true,
				fixed: true,
				filter: function (event, player) {
					return player == game.boss;
				},
				content: function () {
					player.hide();
					game.addVideo("hidePlayer", player);
				},
			},
			boss_baimang2x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				globalFixed: true,
				unique: true,
				fixed: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_baimang2");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					if (game.me != game.boss) {
						game.boss.changeSeat(6);
					} else {
						game.boss.nextSeat.changeSeat(3);
						game.boss.previousSeat.changeSeat(5);
					}
					game.changeBoss("boss_jinshenrushou");
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].update();
					}
					game.delay(0.5);
					"step 2";
					game.addBossFellow(game.me == game.boss ? 1 : 5, "boss_mingxingzhu");
					game.addBossFellow(7, "boss_mingxingzhu");
					"step 3";
					var dnum = 0;
					var dead = game.dead.slice(0);
					for (var i = 0; i < dead.length; i++) {
						if (!dead[i].side && dead[i].maxHp > 0 && dead[i].parentNode == player.parentNode) {
							dead[i].revive(dead[i].maxHp);
							dnum++;
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side) continue;
						game.players[i].removeEquipTrigger();
						var hej = game.players[i].getCards("hej");
						for (var j = 0; j < hej.length; j++) {
							hej[j].discard(false);
						}
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].hujia = 0;
						game.players[i].classList.remove("turnedover");
						game.players[i].removeLink();
						game.players[i].directgain(get.cards(4 - dnum));
					}
					"step 4";
					while (_status.event.name != "phaseLoop") {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = game.boss;
					_status.event.step = 0;
					_status.roundStart = game.boss;
					game.phaseNumber = 0;
					game.roundNumber = 0;
					if (game.bossinfo) {
						game.bossinfo.loopType = 1;
					}
				},
			},
			boss_baimang3: {
				mode: ["boss"],
				global: "boss_baimang3x",
				trigger: { player: "dieBegin" },
				silent: true,
				fixed: true,
				unique: true,
				filter: function (event, player) {
					return player == game.boss;
				},
				content: function () {
					player.hide();
					player.nextSeat.hide();
					player.previousSeat.hide();
					game.addVideo("hidePlayer", player);
					game.addVideo("hidePlayer", player.nextSeat);
					game.addVideo("hidePlayer", player.previousSeat);
				},
			},
			boss_baimang3x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				fixed: true,
				globalFixed: true,
				unique: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_baimang3");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					game.changeBoss("boss_shaohao");
					game.delay(0.5);
					"step 2";
					game.changeBoss("boss_jinshenrushou", game.boss.previousSeat);
					game.changeBoss("boss_mingxingzhu", game.boss.nextSeat);
					game.boss.previousSeat.maxHp--;
					game.boss.previousSeat.update();
					if (game.me != game.boss) {
						game.addBossFellow(4, "boss_mingxingzhu");
					} else {
						// ui.arena.dataset.number='7';
						// game.addVideo('arenaNumber',null,7);
						// game.boss.previousSeat.changeSeat(6);
						// game.boss.nextSeat.nextSeat.changeSeat(2);
						// game.boss.nextSeat.nextSeat.nextSeat.changeSeat(3);
						// game.boss.nextSeat.nextSeat.nextSeat.nextSeat.changeSeat(4);
						game.addBossFellow(6, "boss_mingxingzhu");
					}
					"step 3";
					var dnum = 0;
					var dead = game.dead.slice(0);
					for (var i = 0; i < dead.length; i++) {
						if (!dead[i].side && dead[i].maxHp > 0 && dead[i].parentNode == player.parentNode) {
							dead[i].revive(dead[i].maxHp);
							dnum++;
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].side) continue;
						game.players[i].removeEquipTrigger();
						var hej = game.players[i].getCards("hej");
						for (var j = 0; j < hej.length; j++) {
							hej[j].discard(false);
						}
						game.players[i].hp = game.players[i].maxHp;
						game.players[i].hujia = 0;
						game.players[i].classList.remove("turnedover");
						game.players[i].removeLink();
						game.players[i].directgain(get.cards(4 - dnum));
					}
					"step 4";
					while (_status.event.name != "phaseLoop") {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = game.boss;
					_status.event.step = 0;
					_status.roundStart = game.boss;
					game.phaseNumber = 0;
					game.roundNumber = 0;
				},
			},
			boss_shenyi: {
				unique: true,
				mod: {
					judge: function (player, result) {
						if (_status.event.type == "phase") {
							if (result.bool == false) {
								result.bool = null;
							} else {
								result.bool = false;
							}
						}
					},
				},
				trigger: { player: "turnOverBefore" },
				priority: 20,
				forced: true,
				filter: function (event, player) {
					return !player.isTurnedOver();
				},
				content: function () {
					trigger.cancel();
					game.log(player, "取消了翻面");
				},
				ai: {
					noturn: true,
					effect: {
						target: function (card, player, target) {
							if (get.type(card) == "delay") return 0.5;
						},
					},
				},
			},
			honghuangzhili: {
				init: function (player) {
					player.disableSkill("honghuangzhili", "boss_shenyi");
				},
				mark: true,
				nopop: true,
				intro: {
					content: "【神裔】无效直到下家的回合开始",
				},
				marktext: "荒",
				onremove: function (player) {
					player.enableSkill("honghuangzhili", "boss_shenyi");
				},
				trigger: { global: "phaseZhunbeiBegin" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player == player.next;
				},
				content: function () {
					player.removeSkill("honghuangzhili");
				},
			},
			boss_shenen: {
				mode: ["boss"],
				unique: true,
				global: "boss_shenen2",
			},
			boss_shenen2: {
				mod: {
					targetInRange: function (card, player) {
						if (player.side) return true;
					},
					maxHandcard: function (player, num) {
						if (!player.side) return num + 1;
					},
				},
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				filter: function (event, player) {
					return !player.side;
				},
				content: function () {
					trigger.num++;
				},
			},
			boss_fentian: {
				trigger: { source: "damageBegin1" },
				forced: true,
				filter: function (event) {
					return !event.hasNature("fire");
				},
				content: function () {
					trigger.hasNature("fire");
				},
				mod: {
					cardUsable: function (card) {
						if (get.color(card) == "red") return Infinity;
					},
					targetInRange: function (card) {
						if (get.color(card) == "red") return true;
					},
					wuxieRespondable: function (card, player, target) {
						if (get.color(card) == "red" && player != target) return false;
					},
				},
				group: "boss_fentian2",
			},
			boss_fentian2: {
				trigger: { player: "useCard" },
				forced: true,
				filter: function (event, player) {
					return get.color(event.card) == "red";
				},
				content: function () {
					trigger.directHit.addArray(game.players);
					trigger.directHit.remove(player);
				},
			},
			boss_xingxia: {
				enable: "phaseUse",
				mode: ["boss"],
				filter: function (event, player) {
					if (
						!game.hasPlayer(function (current) {
							return current.name == "boss_yanling";
						})
					) {
						return false;
					}
					return !player.storage.boss_xingxia || game.roundNumber - player.storage.boss_xingxia >= 2;
				},
				unique: true,
				filterTarget: function (card, player, target) {
					return target.name == "boss_yanling";
				},
				selectTarget: -1,
				line: "fire",
				content: function () {
					target.damage(2, "fire");
				},
				contentAfter: function () {
					"step 0";
					player.storage.boss_xingxia = game.roundNumber;
					player.chooseTarget(function (card, player, target) {
						return target.side != player.side;
					}).ai = function (target) {
						return get.damageEffect(target, player, player, "fire");
					};
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						player.line(event.target, "fire");
						event.target.chooseToDiscard("he", { color: "red" }, "弃置一张红色牌或受到1点火焰伤害").ai = function (card) {
							var player = _status.event.player;
							var source = _status.event.parent.player;
							if (get.damageEffect(player, source, player, "fire") >= 0) return 0;
							return 8 - get.value(card);
						};
					} else {
						event.finish();
					}
					"step 2";
					if (!result.bool) {
						event.target.damage("fire");
					}
				},
				ai: {
					order: 6,
					result: {
						target: function (player, target) {
							if (target.isLinked() && player.isLinked() && get.damageEffect(player, player, player, "fire") < 0) return -1;
							return 1;
						},
					},
				},
			},
			boss_huihuo: {
				global: "boss_huihuo2",
				unique: true,
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return num + 1;
					},
				},
				ai: {
					revertsave: true,
					effect: {
						target: function (card, player, target) {
							if (!game.boss) return;
							if (card.name == "tiesuo") {
								if (_status.event.player == game.boss) return "zeroplayertarget";
								return 0.5;
							}
							if (get.tag(card, "damage") || get.tag(card, "recover")) {
								if (game.boss.isLinked() && get.damageEffect(game.boss, player, game.boss, "fire") < 0) {
									if (
										game.hasPlayer(function (current) {
											return current.isEnemyOf(game.boss) && current.isLinked();
										})
									) {
										return;
									}
									if (get.tag(card, "natureDamage") && target.isLinked()) {
										return;
									}
								}
								if (target.isDying()) {
									if (player.isEnemyOf(target) && player.hp >= -1) return [0, 0, 0, 1];
									return "zeroplayertarget";
								}
								return -0.5;
							}
						},
					},
				},
			},
			boss_huihuo2: {
				trigger: { global: "dieAfter" },
				forced: true,
				globalFixed: true,
				unique: true,
				filter: function (event, player) {
					return event.player.hasSkill("boss_huihuo") && event.player.isDead() && player.isEnemyOf(event.player);
				},
				content: function () {
					trigger.player.line(player, "fire");
					player.damage("nosource", "fire", 3).animate = false;
					player.$damage(trigger.player);
					player.$damagepop(-3, "fire");
					if (lib.config.animation && !lib.config.low_performance) {
						player.$fire();
					}
					if (!event.parent.parent.boss_huihuo_logv) {
						event.parent.parent.boss_huihuo_logv = true;
						game.logv(trigger.player, "boss_huihuo", game.filterPlayer(), event.parent.parent);
					}
				},
			},
			boss_furan: {
				unique: true,
				global: "boss_furan2",
			},
			boss_furan2: {
				enable: "chooseToUse",
				filter: function (event, player) {
					return event.type == "dying" && event.dying.hasSkill("boss_furan") && player.isEnemyOf(event.dying);
				},
				filterCard: function (card) {
					return get.color(card) == "red";
				},
				position: "he",
				viewAs: { name: "tao" },
				prompt: "将一张红色牌当桃使用",
				check: function (card) {
					return 8 - get.value(card);
				},
				ai: {
					order: 5,
					skillTagFilter: function (player) {
						var event = _status.event;
						if (event.dying && event.dying.hasSkill("boss_furan") && player.isEnemyOf(event.dying)) {
							return player.countCards("he", { color: "red" }) > 0 && _status.currentPhase != player;
						} else {
							return false;
						}
					},
					save: true,
				},
			},
			boss_chiyi: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return [3, 5, 7].includes(game.roundNumber);
				},
				content: function () {
					"step 0";
					if (game.roundNumber == 3) {
						var enemies = game.filterPlayer(function (current) {
							return current.isEnemyOf(player);
						});
						player.line(enemies, "green");
						for (var i = 0; i < enemies.length; i++) {
							enemies[i].addSkill("boss_chiyi2");
						}
						event.finish();
					} else if (game.roundNumber == 5) {
						event.targets = game.filterPlayer().sortBySeat();
						event.num = 1;
					} else {
						event.targets = game
							.filterPlayer(function (current) {
								return current.name == "boss_yanling";
							})
							.sortBySeat();
						event.num = 5;
					}
					"step 1";
					if (event.targets.length) {
						var target = event.targets.shift();
						player.line(target, "fire");
						target.damage(event.num, "fire");
						event.redo();
					}
				},
			},
			boss_chiyi2: {
				mark: true,
				marktext: "赤",
				intro: {
					content: "受到的伤害+1",
				},
				trigger: { player: "damageBegin3" },
				forced: true,
				popup: false,
				content: function () {
					trigger.num++;
				},
			},
			boss_buchun: {
				mode: ["boss"],
				unique: true,
				group: ["boss_buchun_recover", "boss_buchun_revive"],
				subSkill: {
					revive: {
						enable: "phaseUse",
						filter: function (event, player) {
							if (!player.storage.boss_buchun || game.roundNumber - player.storage.boss_buchun >= 2) {
								for (var i = 0; i < game.dead.length; i++) {
									if (game.dead[i].parentNode == player.parentNode && game.dead[i].name == "boss_shujing") {
										return true;
									}
								}
							}
							return false;
						},
						content: function () {
							"step 0";
							player.loseHp();
							player.storage.boss_buchun = game.roundNumber;
							"step 1";
							event.targets = [];
							var dead = game.dead.slice(0);
							for (var i = 0; i < dead.length; i++) {
								if (dead[i].parentNode == player.parentNode && dead[i].name == "boss_shujing") {
									event.targets.push(dead[i]);
								}
							}
							if (event.targets[0] == player.previousSeat) {
								event.targets.push(event.targets.shift());
							}
							"step 2";
							if (event.targets.length) {
								var target = event.targets.shift();
								player.line(target, "green");
								target.revive(1);
								target.draw(2, false);
								target.$draw(2);
								event.redo();
							}
							"step 3";
							game.delay();
						},
						ai: {
							order: 6,
							result: {
								player: function (player, target) {
									if (player.hp <= 1) return 0;
									if (
										player.hp <= 3 &&
										game.hasPlayer(function (current) {
											return current.name == "boss_shujing" && current.hp == 1;
										})
									) {
										if (_status.event.getRand() < 0.4) {
											return 0;
										}
									}
									if (player.hp >= 3) return 1;
									if (player.hp >= 2 && player != game.boss) return 1;
									if (
										game.hasPlayer(function (current) {
											return current.name == "boss_shujing";
										})
									) {
										return 0;
									}
									return 1;
								},
							},
						},
					},
					recover: {
						enable: "phaseUse",
						filter: function (event, player) {
							if (!player.storage.boss_buchun || game.roundNumber - player.storage.boss_buchun >= 2) {
								for (var i = 0; i < game.dead.length; i++) {
									if (game.dead[i].parentNode == player.parentNode && game.dead[i].name == "boss_shujing") {
										return false;
									}
								}
								return true;
							}
							return false;
						},
						prompt: "令一名己方角色回复2点体力",
						filterTarget: function (card, player, target) {
							return target.isFriendOf(player) && target.isDamaged();
						},
						content: function () {
							target.recover(2);
							player.storage.boss_buchun = game.roundNumber;
						},
						ai: {
							order: 6,
							result: {
								target: function (player, target) {
									var num = 1;
									if (target.maxHp - target.hp >= 2) {
										num = 1.5;
									}
									return 1.5 * get.recoverEffect(target, player, target);
								},
							},
						},
					},
				},
			},
			boss_cuidu: {
				trigger: { source: "damageEnd" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return event.player.isIn() && event.player.isEnemyOf(player) && !event.player.hasSkill("boss_zhongdu");
				},
				logTarget: "player",
				content: function () {
					trigger.player.addSkill("boss_zhongdu");
					var boss = game.findPlayer(function (current) {
						return current.name == "boss_mushengoumang";
					});
					if (boss) {
						boss.draw();
					}
				},
			},
			boss_zhongdu: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				mark: true,
				nopop: true,
				temp: true,
				intro: {
					content: "锁定技，回合开始时，你进行判定，若结果不为红桃，你受到1点无来源的伤害，若结果不为黑桃，你失去此技能",
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						var suit = get.suit(card);
						if (suit == "spade") return -1;
						if (suit == "heart") return 1;
						return 0;
					});
					"step 1";
					if (result.suit != "heart") {
						player.damage("nosource");
					}
					if (result.suit != "spade") {
						player.removeSkill("boss_zhongdu");
					}
				},
			},
			boss_qingyi: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return [3, 5, 7].includes(game.roundNumber);
				},
				content: function () {
					"step 0";
					if (game.roundNumber == 7) {
						var goumang, shujing;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].name == "boss_mushengoumang") {
								goumang = game.players[i];
							}
							if (game.players[i].name == "boss_shujing") {
								shujing = game.players[i];
							}
						}
						if (!goumang || !shujing) {
							for (var i = 0; i < game.dead.length; i++) {
								if (game.dead[i].parentNode != player.parentNode) continue;
								if (game.dead[i].name == "boss_mushengoumang") {
									goumang = game.dead[i];
								}
								if (game.dead[i].name == "boss_shujing") {
									shujing = game.dead[i];
								}
							}
						}
						event.targets = [];
						if (goumang) {
							event.targets.push(goumang);
						}
						if (shujing) {
							event.targets.push(shujing);
						}
						event.command = "revive";
					} else if (game.roundNumber == 5) {
						event.targets = game
							.filterPlayer(function (current) {
								return current.isEnemyOf(player);
							})
							.sortBySeat();
						event.command = "loseHp";
					} else {
						event.targets = game
							.filterPlayer(function (current) {
								return current.isFriendOf(player);
							})
							.sortBySeat();
						event.command = "recover";
					}
					"step 1";
					if (event.targets.length) {
						var target = event.targets.shift();
						player.line(target, "green");
						if (event.command == "revive") {
							player.line(target, "green");
							if (target.isDead()) {
								target.maxHp++;
								target.revive(3);
							} else {
								target.gainMaxHp();
								target.recover(3);
							}
							target.draw(3, false);
							target.$draw(3);
							event.delay = true;
						} else {
							target[event.command]();
						}
						event.redo();
					}
					"step 2";
					if (event.delay) {
						game.delay();
					}
				},
			},
			boss_qizuo: {
				trigger: { player: "useCardAfter" },
				filter: function (event, player) {
					if (event.parent.name == "boss_qizuo") return false;
					if (!event.targets || !event.card) return false;
					if (event.card && event.card.name == "wuxie") return false;
					var type = get.type(event.card);
					if (type != "trick") return false;
					var card = game.createCard(event.card.name, event.card.suit, event.card.number, event.card.nature);
					var targets = event._targets || event.targets;
					for (var i = 0; i < targets.length; i++) {
						if (!targets[i].isIn()) return false;
						if (!player.canUse({ name: event.card.name }, targets[i], false, false)) {
							return false;
						}
					}
					return true;
				},
				check: function (event, player) {
					if (event.card.name == "tiesuo") return false;
					return true;
				},
				content: function () {
					var card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
					player.useCard(card, (trigger._targets || trigger.targets).slice(0));
				},
				ai: {
					threaten: 1.3,
				},
			},
			boss_guimou: {
				trigger: { player: "phaseJieshuBegin" },
				frequent: true,
				content: function () {
					var list = game.filterPlayer(function (target) {
						return target != player && !target.isMad();
					});
					if (list.length) {
						var target = list.randomGet();
						player.line(target, "green");
						target.goMad({ player: "phaseAfter" });
					}
				},
			},
			boss_yuance: {
				trigger: { global: "damageEnd" },
				filter: function (event) {
					return event.source && event.source != event.player && event.source.isAlive() && event.player.isAlive();
				},
				direct: true,
				content: function () {
					"step 0";
					var att1 = get.attitude(player, trigger.player);
					var att2 = get.attitude(player, trigger.source);
					var targets = player.getEnemies();
					var stop = false;
					for (var i = 0; i < targets.length; i++) {
						var skills = targets[i].getSkills();
						for (var j = 0; j < skills.length; j++) {
							if (get.tag(skills[j], "rejudge", targets[i])) {
								stop = true;
								break;
							}
						}
					}
					var rand = Math.random() < 0.5 ? "选项一" : "选项二";
					var sourcename = get.translation(trigger.source);
					var playername = get.translation(trigger.player);
					player
						.chooseControl("选项一", "选项二", "cancel2", function () {
							if (att1 == 0 && att2 == 0) return rand;
							if (att1 * att2 >= 0) {
								if (att1 + att2 > 0) {
									return "选项二";
								} else {
									return "选项一";
								}
							} else {
								if (trigger.player.isHealthy() && trigger.source.isHealthy()) return rand;
								if (trigger.player.isHealthy()) {
									if (att1 < 0) return "选项二";
									if (att1 > 0 && !stop) return "选项一";
								}
								if (trigger.source.isHealthy()) {
									if (att2 < 0) return "选项二";
									if (att2 > 0 && !stop) return "选项一";
								}
								if (stop) return "cancel2";
								return rand;
							}
						})
						.set("prompt", get.prompt("boss_yuance"))
						.set("choiceList", ["若判定结果为黑色，" + playername + "失去1点体力，否则" + sourcename + "失去1点体力", "若判定结果为红色，" + playername + "回复1点体力，否则" + sourcename + "回复1点体力"]);
					"step 1";
					var att1 = get.attitude(player, trigger.player);
					var att2 = get.attitude(player, trigger.source);
					if (result.control == "选项一") {
						event.type = 1;
						player.judge(function (card) {
							if (get.color(card) == "black") {
								if (att1 > 0) return -1;
								if (att1 < 0) return 1;
							} else {
								if (att2 > 0) return -1;
								if (att2 < 0) return 1;
							}
							return 0;
						});
					} else if (result.control == "选项二") {
						event.type = 2;
						player.judge(function (card) {
							if (get.color(card) == "red") {
								if (trigger.player.isDamaged()) {
									if (att1 > 0) return 1;
									if (att1 < 0) return -1;
								}
							} else {
								if (trigger.source.isDamaged()) {
									if (att2 > 0) return 1;
									if (att2 < 0) return -1;
								}
							}
							return 0;
						});
					} else {
						event.finish();
					}
					"step 2";
					if (event.type == 1) {
						if (result.color == "black") {
							trigger.player.loseHp();
						} else {
							trigger.source.loseHp();
						}
					} else {
						if (result.color == "red") {
							trigger.player.recover();
						} else {
							trigger.source.recover();
						}
					}
				},
			},
			boss_guixin: {
				trigger: { global: "drawAfter" },
				forced: true,
				logTarget: "player",
				filter: function (event, player) {
					return event.result && event.result.length >= 2 && event.player != player;
				},
				content: function () {
					"step 0";
					trigger.player.chooseCard(
						function (card) {
							return trigger.result.includes(card);
						},
						"归心：交给" + get.translation(player) + "一张牌",
						true
					);
					"step 1";
					if (result.bool) {
						player.gain(result.cards, trigger.player);
						trigger.player.$give(1, player);
					}
				},
			},
			xiongcai: {
				unique: true,
				trigger: { player: "phaseAfter" },
				direct: true,
				init: function (player) {
					player.storage.xiongcai = [];
					// player.storage.xiongcai2=0;
				},
				intro: {
					content: "characters",
				},
				content: function () {
					"step 0";
					// if(player.storage.xiongcai2<1){
					//		player.storage.xiongcai2++;
					//		event.finish();
					// }
					// else{
					//		player.storage.xiongcai2=0;
					// }
					"step 1";
					player.logSkill("xiongcai");
					var list = [];
					var list2 = [];
					var players = game.players.concat(game.dead);
					for (var i = 0; i < players.length; i++) {
						list2.add(players[i].name);
						list2.add(players[i].name1);
						list2.add(players[i].name2);
					}
					for (var i in lib.character) {
						if (lib.character[i][1] != "wei") continue;
						if (lib.character[i].isBoss) continue;
						if (lib.character[i].isMinskin) continue;
						if (player.storage.xiongcai.includes(i)) continue;
						if (list2.includes(i)) continue;
						list.push(i);
					}
					var name = list.randomGet();
					player.storage.xiongcai.push(name);
					player.markSkill("xiongcai");
					var skills = lib.character[name][3];
					for (var i = 0; i < skills.length; i++) {
						player.addSkill(skills[i]);
					}
					event.dialog = ui.create.dialog('<div class="text center">' + get.translation(player) + "发动了【雄才】", [[name], "character"]);
					game.delay(2);
					"step 2";
					event.dialog.close();
				},
			},
			xiaoxiong: {
				trigger: { global: "useCardAfter" },
				forced: true,
				unique: true,
				forceunique: true,
				filter: function (event, player) {
					var type = get.type(event.card, "trick");
					return event.player != player && (type == "basic" || type == "trick");
				},
				content: function () {
					player.gain(game.createCard(trigger.card), "gain2");
				},
				group: "xiaoxiong_damage",
				subSkill: {
					damage: {
						trigger: { global: "phaseJieshuBegin" },
						forced: true,
						filter: function (event, player) {
							return event.player != player && event.player.countUsed() == 0;
						},
						logTarget: "player",
						content: function () {
							trigger.player.damage();
						},
					},
				},
			},
			boss_zhangwu: {
				global: "boss_zhangwu_ai",
				trigger: { player: "damageEnd" },
				check: function (event, player) {
					return event.source && event.source.isIn() && get.damageEffect(event.source, player, player) > 0;
				},
				filter: function (event) {
					return event.source && event.source.isAlive();
				},
				direct: true,
				logTarget: "source",
				content: function () {
					"step 0";
					player
						.chooseToDiscard(get.prompt("boss_zhangwu", trigger.source), "he", [1, Infinity])
						.set("ai", function (card) {
							if (get.attitude(player, target) < 0) return 8 - get.value(card);
							return 0;
						})
						.set("logSkill", ["boss_zhangwu", trigger.source]);
					"step 1";
					if (result.bool) {
						var num = result.cards.length;
						var cnum = get.cnNumber(num);
						event.num = num;
						trigger.source.chooseToDiscard("he", "章武：弃置" + cnum + "张牌，或取消并受到" + cnum + "点伤害", num).set("ai", function (card) {
							if (!trigger.source.hasSkillTag("nodamage")) return 10 - get.value(card);
							return 0;
						});
					} else {
						event.finish();
					}
					"step 2";
					if (!result.bool) {
						trigger.source.damage(event.num);
					}
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage") && get.attitude(target, player) < 0 && player.countCards("he") < target.countCards("he")) {
								return [0, 2];
							}
						},
					},
				},
			},
			boss_zhangwu_ai: {
				ai: {
					effect: {
						target_use: function (card, player, target) {
							if (get.tag(card, "recover") && card.name != "recover") {
								for (var i = 0; i < game.players.length; i++) {
									if (game.players[i].hasSkill("xiaoxiong") && get.attitude(target, game.players[i]) < 0) {
										return "zeroplayertarget";
									}
								}
							}
						},
					},
				},
			},
			yueyin: {
				unique: true,
				mark: true,
				intro: {
					content: function (storage, player) {
						var str = "扣减" + (7 - player.storage.xiangxing_count) + "点体力后失去下一枚星；";
						str += "防止禳星伤害条件：" + lib.translate["xiangxing" + player.storage.xiangxing + "_info"];
						return str;
					},
					markcount: function (storage, player) {
						return Math.max(0, 7 - player.storage.xiangxing_count);
					},
				},
				skipDamage: {
					x7: function (player) {
						return player.countCards("h") == 0;
					},
					x6: function (player, event) {
						if (event.hasNature) return event.hasNature("fire");
					},
					x5: function (player, event) {
						if (event.hasNature) return event.hasNature("thunder");
					},
					x4: function (player, event) {
						return event.name == "loseHp";
					},
					x3: function (player, event) {
						return game.hasPlayer(function (current) {
							return current != player && current.countCards("e") >= 4;
						});
					},
					x2: function (player) {
						return player.countCards("j") >= 2;
					},
					x1: function () {
						return game.players.length == 2;
					},
				},
			},
			xiangxing: {
				unique: true,
				init: function (player) {
					player.storage.xiangxing = 7;
					player.storage.xiangxing_count = 0;
					player.addSkill("xiangxing7");
				},
				mark: true,
				intro: {
					content: "当前有#枚星",
				},
				trigger: { player: ["damageEnd", "loseHpEnd"] },
				forced: true,
				popup: false,
				content: function () {
					"step 0";
					var num = trigger.num;
					if (num) {
						player.storage.xiangxing_count += num;
					}
					if (player.storage.xiangxing_count >= 7) {
						if (player.hasSkill("yueyin") && lib.skill.yueyin.skipDamage["x" + player.storage.xiangxing](player, trigger)) {
							event.goto(3);
						}
						player.removeSkill("xiangxing" + player.storage.xiangxing);
						player.storage.xiangxing--;
						player.storage.xiangxing_count = 0;
						player.updateMarks();
						if (player.storage.xiangxing) {
							player.addSkill("xiangxing" + player.storage.xiangxing);
						} else {
							player.awakenSkill("xiangxing");
						}
						player.popup("xiangxing");
						game.log(player, "失去了一枚星");
					} else {
						player.updateMarks();
						event.finish();
					}
					"step 1";
					var list = game.filterPlayer();
					list.remove(player);
					list.sort(lib.sort.seat);
					var list2 = [];
					for (var i = 0; i < list.length; i++) {
						list2.push(0);
					}
					for (var i = 0; i < 7; i++) {
						list2[Math.floor(Math.random() * list2.length)]++;
					}
					event.list = list;
					event.list2 = list2;
					"step 2";
					if (event.list.length) {
						var target = event.list.shift();
						target.damage(event.list2.shift(), "thunder");
						player.line(target, "thunder");
						event.redo();
					}
					"step 3";
					if (player.storage.xiangxing == 0) {
						player.maxHp = 3;
						player.update();
					}
				},
			},
			fengqi: {
				trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
				direct: true,
				content: function () {
					"step 0";
					var list = { basic: [], equip: [], trick: [], delay: [] };
					for (var i = 0; i < lib.inpile.length; i++) {
						var name = lib.inpile[i];
						var info = lib.card[name];
						if (info.autoViewAs || name == "yuansuhuimie") continue;
						if (lib.filter.cardEnabled({ name: name }, player)) {
							if (!list[info.type]) {
								list[info.type] = [];
							}
							list[info.type].push([get.translation(lib.card[name].type), "", name]);
						}
					}
					list.trick.sort(lib.sort.name);
					var dialog = ui.create.dialog("风起", [list.trick, "vcard"]);
					// for(var i in list){
					//		dialog.addText(get.translation(i)+'牌');
					//		dialog.add([list[i],'vcard']);
					// }
					var rand1 = Math.random() < 1 / 3;
					var rand2 = Math.random() < 0.5;
					var rand3 = Math.random() < 1 / 3;
					var rand4 = Math.random() < 1 / 3;
					player.chooseButton(dialog).ai = function (button) {
						var name = button.link[2];
						if (player.hp <= 1) {
							switch (name) {
								case "zhiliaobo":
									return 1;
								case "dunpaigedang":
									return 0.8;
								case "nanman":
									return 0.5;
								default:
									return 0;
							}
						}
						if (rand4 && player.countCards("h") <= 1) {
							switch (name) {
								case "zengbin":
									return 1;
								case "wuzhong":
									return 0.8;
								default:
									return 0;
							}
						}
						if (player.hasSkill("qinglonglingzhu")) {
							if (rand2) return name == "chiyuxi" ? 0.8 : 0;
							return name == "jingleishan" ? 0.8 : 0;
						}
						if (rand2) return name == "wanjian" ? 0.8 : 0;
						return name == "nanman" ? 0.8 : 0;
					};
					"step 1";
					if (result.bool) {
						player.chooseUseTarget(result.links[0][2], true, false);
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			fengqi2: {
				mod: {
					wuxieRespondable: function () {
						return false;
					},
				},
			},
			gaiming: {
				trigger: { player: "judgeBefore" },
				direct: true,
				priority: 1,
				unique: true,
				content: function () {
					"step 0";
					event.cards = get.cards(7);
					player.chooseCardButton(true, event.cards, "改命：选择一张牌作为你的" + trigger.judgestr + "判定结果").ai = function (button) {
						if (get.attitude(player, trigger.player) > 0) {
							return 1 + trigger.judge(button.link);
						}
						if (get.attitude(player, trigger.player) < 0) {
							return 1 - trigger.judge(button.link);
						}
						return 0;
					};
					"step 1";
					if (!result.bool) {
						event.finish();
						return;
					}
					player.logSkill("gaiming", trigger.player);
					var card = result.links[0];
					event.cards.remove(card);
					var judgestr = get.translation(trigger.player) + "的" + trigger.judgestr + "判定";
					event.videoId = lib.status.videoId++;
					event.dialog = ui.create.dialog(judgestr);
					event.dialog.classList.add("center");
					event.dialog.videoId = event.videoId;

					game.addVideo("judge1", player, [get.cardInfo(card), judgestr, event.videoId]);
					for (var i = 0; i < event.cards.length; i++) event.cards[i].discard();
					// var node=card.copy('thrown','center',ui.arena).addTempClass('start');
					var node;
					if (game.chess) {
						node = card.copy("thrown", "center", ui.arena).addTempClass("start");
					} else {
						node = player.$throwordered(card.copy(), true);
					}
					node.classList.add("thrownhighlight");
					ui.arena.classList.add("thrownhighlight");
					if (card) {
						trigger.cancel();
						trigger.result = {
							card: card,
							judge: trigger.judge(card),
							node: node,
							number: get.number(card),
							suit: get.suit(card),
							color: get.color(card),
						};
						if (trigger.result.judge > 0) {
							trigger.result.bool = true;
							trigger.player.popup("改命成功");
						}
						if (trigger.result.judge < 0) {
							trigger.result.bool = false;
							trigger.player.popup("改命失败");
						}
						game.log(trigger.player, "的判定结果为", card);
						trigger.direct = true;
						trigger.position.appendChild(card);
						game.delay(2);
					} else {
						event.finish();
					}
					"step 2";
					ui.arena.classList.remove("thrownhighlight");
					event.dialog.close();
					game.addVideo("judge2", null, event.videoId);
					ui.clear();
					var card = trigger.result.card;
					trigger.position.appendChild(card);
					trigger.result.node.delete();
					game.delay();
				},
			},
			tiandao: {
				audio: true,
				trigger: { global: "judge" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				content: function () {
					"step 0";
					player.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("tiandao"), "he").ai = function (card) {
						var trigger = _status.event.parent._trigger;
						var player = _status.event.player;
						var result = trigger.judge(card) - trigger.judge(trigger.player.judging[0]);
						var attitude = get.attitude(player, trigger.player);
						if (attitude == 0 || result == 0) return 0;
						if (attitude > 0) {
							return result;
						} else {
							return -result;
						}
					};
					"step 1";
					if (result.bool) {
						player.respond(result.cards, "highlight");
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						player.logSkill("tiandao");
						player.$gain2(trigger.player.judging[0]);
						player.gain(trigger.player.judging[0]);
						trigger.player.judging[0] = result.cards[0];
						trigger.position.appendChild(result.cards[0]);
						game.log(trigger.player, "的判定牌改为", result.cards[0]);
					}
					"step 3";
					game.delay(2);
				},
				ai: {
					tag: {
						rejudge: 1,
					},
					threaten: 1.5,
				},
			},
			lianji: {
				audio: true,
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return target.countCards("h") > 0;
				},
				selectTarget: 2,
				multitarget: true,
				multiline: true,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				prepare: "throw",
				discard: false,
				filterCard: true,
				check: function (card) {
					return 6 - get.value(card);
				},
				content: function () {
					"step 0";
					if (targets[0].countCards("h") && targets[1].countCards("h")) {
						targets[0].chooseToCompare(targets[1]);
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						targets[0].gain(cards);
						targets[0].$gain2(cards);
						targets[1].damage(targets[0]);
					} else {
						targets[1].gain(cards);
						targets[1].$gain2(cards);
						targets[0].damage(targets[1]);
					}
				},
				ai: {
					expose: 0.3,
					threaten: 2,
					order: 9,
					result: {
						target: -1,
					},
				},
			},
			mazui: {
				audio: true,
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "black" },
				filterTarget: function (card, player, target) {
					return !target.hasSkill("mazui2");
				},
				check: function (card) {
					return 6 - get.value(card);
				},
				discard: false,
				prepare: "give",
				content: function () {
					target.storage.mazui2 = cards[0];
					target.addSkill("mazui2");
					game.addVideo("storage", target, ["mazui2", get.cardInfo(target.storage.mazui2), "card"]);
				},
				ai: {
					expose: 0.2,
					result: {
						target: function (player, target) {
							return -target.hp;
						},
					},
					order: 4,
					threaten: 1.2,
				},
			},
			mazui2: {
				trigger: { source: "damageBegin1" },
				forced: true,
				mark: "card",
				filter: function (event) {
					return event.num > 0;
				},
				content: function () {
					trigger.num--;
					player.addSkill("mazui3");
					player.removeSkill("mazui2");
				},
				intro: {
					content: "card",
				},
			},
			mazui3: {
				trigger: { source: ["damageEnd", "damageZero"] },
				forced: true,
				popup: false,
				content: function () {
					player.gain(player.storage.mazui2, "gain2");
					game.log(player, "获得了", player.storage.mazui2);
					player.removeSkill("mazui3");
					delete player.storage.mazui2;
				},
			},
			yunshen: {
				trigger: { player: ["respond", "useCard"] },
				filter: function (event, player) {
					return event.card.name == "shan";
				},
				frequent: true,
				init: function (player) {
					player.storage.yunshen = 0;
				},
				content: function () {
					player.storage.yunshen++;
					player.markSkill("yunshen");
				},
				ai: {
					effect: {
						target_use: function (card, player, target) {
							if (get.tag(card, "respondShan")) {
								var shans = target.countCards("h", "shan");
								var hs = target.countCards("h");
								if (shans > 1) return [1, 1];
								if (shans && hs > 2) return [1, 1];
								if (shans) return [1, 0.5];
								if (hs > 2) return [1, 0.3];
								if (hs > 1) return [1, 0.2];
								return [1.2, 0];
							}
						},
					},
					threaten: 0.8,
				},
				intro: {
					content: "mark",
				},
				group: "yunshen2",
			},
			yunshen2: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				filter: function (event, player) {
					return player.storage.yunshen > 0;
				},
				content: function () {
					player.draw(player.storage.yunshen);
					player.storage.yunshen = 0;
					player.unmarkSkill("yunshen");
				},
				mod: {
					globalTo: function (from, to, distance) {
						if (typeof to.storage.yunshen == "number") return distance + to.storage.yunshen;
					},
				},
			},
			lingbo: {
				audio: 2,
				trigger: { player: ["respond", "useCard"] },
				filter: function (event, player) {
					return event.card.name == "shan";
				},
				frequent: true,
				content: function () {
					player.draw(2);
				},
				ai: {
					mingzhi: false,
					effect: {
						target_use: function (card, player, target) {
							if (get.tag(card, "respondShan")) {
								var shans = target.countCards("h", "shan");
								var hs = target.countCards("h");
								if (shans > 1) return [0, 1];
								if (shans && hs > 2) return [0, 1];
								if (shans) return [0, 0];
								if (hs > 2) return [0, 0];
								if (hs > 1) return [1, 0.5];
								return [1.5, 0];
							}
						},
					},
					threaten: 0.8,
				},
			},
			jiaoxia: {
				audio: 2,
				trigger: { target: "useCardToTargeted" },
				filter: function (event, player) {
					return event.card && get.color(event.card) == "red";
				},
				frequent: true,
				content: function () {
					player.draw();
				},
				ai: {
					effect: function (card, player, target) {
						if (get.color(card) == "red") return [1, 1];
					},
				},
			},
			boss_nbianshenx: {},
			boss_jingjue: {
				inherit: "boss_danshu",
			},
			boss_renxing: {
				trigger: { global: ["damageEnd", "recoverEnd"] },
				forced: true,
				filter: function (event, player) {
					return _status.currentPhase != player;
				},
				content: function () {
					player.draw();
				},
			},
			boss_ruizhi: {
				trigger: { global: "phaseZhunbeiBegin" },
				forced: true,
				filter: function (event, player) {
					return event.player != player && (event.player.countCards("h") > 1 || event.player.countCards("e") > 1);
				},
				content: function () {
					"step 0";
					player.line(trigger.player, "green");
					var next = trigger.player.chooseCard(true, "选择保留一张手牌和一张装备区内的牌，然后弃置其它牌", "he", function (card) {
						switch (get.position(card)) {
							case "h": {
								if (ui.selected.cards.length) {
									return get.position(ui.selected.cards[0]) == "e";
								} else {
									return trigger.player.countCards("h") > 1;
								}
							}
							case "e": {
								if (ui.selected.cards.length) {
									return get.position(ui.selected.cards[0]) == "h";
								} else {
									return trigger.player.countCards("e") > 1;
								}
							}
						}
					});
					var num = 0;
					if (trigger.player.countCards("h") > 1) {
						num++;
					}
					if (trigger.player.countCards("e") > 1) {
						num++;
					}
					next.selectCard = [num, num];
					next.ai = function (card) {
						return get.value(card);
					};
					"step 1";
					if (result.bool) {
						var he = [];
						var hs = trigger.player.getCards("h");
						var es = trigger.player.getCards("e");
						if (hs.length > 1) {
							he = he.concat(hs);
						}
						if (es.length > 1) {
							he = he.concat(es);
						}
						for (var i = 0; i < result.cards.length; i++) {
							he.remove(result.cards[i]);
						}
						trigger.player.discard(he);
					}
				},
			},
			boss_nbaonu: {
				group: ["boss_nbaonu_sha"],
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				priority: -1,
				content: function () {
					if (player.hp > 4) {
						trigger.num = 4 + Math.floor(Math.random() * (player.hp - 3));
					} else {
						trigger.num = 4;
					}
				},
				subSkill: {
					sha: {
						mod: {
							cardUsable: function (card, player, num) {
								if (card.name == "sha" && player.hp < 5) return Infinity;
							},
						},
						trigger: { source: "damageBegin1" },
						filter: function (event, player) {
							return event.card && event.card.name == "sha" && event.notLink() && player.hp < 5;
						},
						forced: true,
						content: function () {
							trigger.num++;
						},
					},
				},
			},
			boss_shouyi: {
				mod: {
					targetInRange: function () {
						return true;
					},
				},
			},
			boss_mengtai: {
				group: ["boss_mengtai_begin", "boss_mengtai_draw", "boss_mengtai_use", "boss_mengtai_discard", "boss_mengtai_end"],
				subSkill: {
					begin: {
						trigger: { player: "phaseZhunbeiBegin" },
						forced: true,
						popup: false,
						content: function () {
							player.storage.boss_mengtai_draw = true;
							player.storage.boss_mengtai_use = true;
						},
					},
					draw: {
						trigger: { player: "phaseDrawBegin" },
						forced: true,
						popup: false,
						content: function () {
							player.storage.boss_mengtai_draw = false;
						},
					},
					use: {
						trigger: { player: "phaseUseBegin" },
						forced: true,
						popup: false,
						content: function () {
							player.storage.boss_mengtai_use = false;
						},
					},
					discard: {
						trigger: { player: "phaseDiscardBefore" },
						forced: true,
						filter: function (event, player) {
							if (player.storage.boss_mengtai_use) return true;
							return false;
						},
						content: function () {
							trigger.cancel();
						},
					},
					end: {
						trigger: { player: "phaseJieshuBegin" },
						forced: true,
						filter: function (event, player) {
							if (player.storage.boss_mengtai_draw) return true;
							return false;
						},
						content: function () {
							player.draw(3);
						},
					},
				},
			},
			boss_nbianshen: {
				trigger: { player: "phaseBefore" },
				forced: true,
				popup: false,
				priority: 25,
				fixed: true,
				filter: function (event, player) {
					if (player.name == "boss_nianshou_heti" || player.storage.boss_nbianshen) return true;
					return false;
				},
				content: function () {
					if (player.storage.boss_nbianshen) {
						var hp = player.hp,
							maxHp = player.maxHp,
							hujia = player.hujia;
						player.init("boss_nianshou_" + player.storage.boss_nbianshen_next);
						player.storage.boss_nbianshen.remove(player.storage.boss_nbianshen_next);
						if (!player.storage.boss_nbianshen.length) {
							player.storage.boss_nbianshen = ["jingjue", "renxing", "ruizhi", "baonu"];
						}
						player.storage.boss_nbianshen_next = player.storage.boss_nbianshen.randomGet(player.storage.boss_nbianshen_next);
						player.hp = hp;
						player.maxHp = maxHp;
						player.hujia = hujia;
						player.update();
					} else {
						player.storage.boss_nbianshen = ["jingjue", "renxing", "ruizhi", "baonu"];
						player.storage.boss_nbianshen_next = player.storage.boss_nbianshen.randomGet();
						player.markSkill("boss_nbianshen");
					}
				},
				intro: {
					content: function (storage, player) {
						var map = {
							jingjue: "警觉",
							renxing: "任性",
							ruizhi: "睿智",
							baonu: "暴怒",
						};
						return "下一个状态：" + map[player.storage.boss_nbianshen_next];
					},
				},
			},
			boss_damagecount: {
				mode: ["boss"],
				global: "boss_damagecount2",
			},
			boss_damagecount2: {
				trigger: { source: "damageEnd" },
				silent: true,
				filter: function (event, player) {
					if (!ui.damageCount) return false;
					return event.num > 0 && player.isFriendOf(game.me) && event.player.isEnemyOf(game.me);
				},
				content: function () {
					_status.damageCount += trigger.num;
					ui.damageCount.innerHTML = "伤害: " + _status.damageCount;
				},
			},
			boss_nianrui: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				content: function () {
					trigger.num += 2;
				},
				ai: {
					threaten: 1.6,
				},
			},
			boss_qixiang: {
				group: ["boss_qixiang1", "boss_qixiang2"],
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (card.name == "lebu" || card.name == "bingliang") return 0.8;
						},
					},
				},
			},
			boss_qixiang1: {
				trigger: { player: "judge" },
				forced: true,
				filter: function (event, player) {
					if (event.card) {
						if (event.card.viewAs) {
							return event.card.viewAs == "lebu";
						} else {
							return event.card.name == "lebu";
						}
					}
				},
				content: function () {
					player.addTempSkill("boss_qixiang3", "judgeAfter");
				},
			},
			boss_qixiang2: {
				trigger: { player: "judge" },
				forced: true,
				filter: function (event, player) {
					if (event.card) {
						if (event.card.viewAs) {
							return event.card.viewAs == "bingliang";
						} else {
							return event.card.name == "bingliang";
						}
					}
				},
				content: function () {
					player.addTempSkill("boss_qixiang4", "judgeAfter");
				},
			},
			boss_qixiang3: {
				mod: {
					suit: function (card, suit) {
						if (suit == "diamond") return "heart";
					},
				},
			},
			boss_qixiang4: {
				mod: {
					suit: function (card, suit) {
						if (suit == "spade") return "club";
					},
				},
			},
			boss_bianshen2: {
				mode: ["boss"],
				fixed: true,
				global: "boss_bianshen2x",
				trigger: { player: "dieBegin" },
				silent: true,
				content: function () {
					player.hide();
					game.addVideo("hidePlayer", player);
				},
			},
			boss_bianshen2x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				fixed: true,
				globalFixed: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_bianshen2");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					game.changeBoss(["boss_niutou", "boss_mamian"].randomGet());
				},
			},
			boss_bianshen3: {
				mode: ["boss"],
				global: "boss_bianshen3x",
				trigger: { player: "dieBegin" },
				silent: true,
				fixed: true,
				content: function () {
					player.hide();
					game.addVideo("hidePlayer", player);
				},
			},
			boss_bianshen3x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				fixed: true,
				globalFixed: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_bianshen3");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					game.changeBoss(["boss_baiwuchang", "boss_heiwuchang"].randomGet());
				},
			},
			boss_bianshen4: {
				mode: ["boss"],
				global: "boss_bianshen4x",
				trigger: { player: "dieBegin" },
				silent: true,
				fixed: true,
				content: function () {
					player.hide();
					game.addVideo("hidePlayer", player);
				},
			},
			boss_bianshen4x: {
				trigger: { global: "dieAfter" },
				forced: true,
				priority: -10,
				fixed: true,
				globalFixed: true,
				filter: function (event) {
					if (lib.config.mode != "boss") return false;
					return event.player == game.boss && event.player.hasSkill("boss_bianshen4");
				},
				content: function () {
					"step 0";
					game.delay();
					"step 1";
					game.changeBoss(["boss_yecha", "boss_luocha"].randomGet());
				},
			},
			boss_moyany: {
				trigger: { player: "loseEnd" },
				frequent: true,
				unique: true,
				filter: function (event, player) {
					return _status.currentPhase != player;
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.color(card) == "red" ? 1 : 0;
					});
					"step 1";
					if (result.bool) {
						player.chooseTarget(true, "选择一个目标对其造成两点火焰伤害", function (card, player, target) {
							return player != target;
						}).ai = function (target) {
							return get.damageEffect(target, player, player, "fire");
						};
					} else {
						event.finish();
					}
					"step 2";
					if (result.targets.length) {
						player.line(result.targets, "fire");
						result.targets[0].damage(2, "fire");
					}
				},
				ai: {
					effect: {
						target: function (card) {
							if (get.tag(card, "loseCard")) {
								return [0.5, 1];
							}
						},
					},
				},
			},
			boss_danshu: {
				trigger: { player: "loseEnd" },
				frequent: true,
				unique: true,
				filter: function (event, player) {
					return _status.currentPhase != player && player.hp < player.maxHp;
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.color(card) == "red" ? 1 : 0;
					});
					"step 1";
					if (result.color == "red") {
						player.recover();
					}
				},
				ai: {
					effect: {
						target: function (card) {
							if (get.tag(card, "loseCard")) {
								return [0.5, 1];
							}
						},
					},
				},
			},
			boss_modao: {
				audio: true,
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				content: function () {
					player.draw(2);
				},
			},
			boss_mojian: {
				trigger: { player: "phaseUseBegin" },
				content: function () {
					var list = game.filterPlayer(function (current) {
						return player.canUse("wanjian", current) && current.isEnemyOf(player);
					});
					list.sort(lib.sort.seat);
					player.useCard({ name: "wanjian" }, list);
				},
				ai: {
					threaten: 1.8,
				},
			},
			boss_yushou: {
				trigger: { player: "phaseUseBegin" },
				content: function () {
					var list = game.filterPlayer(function (current) {
						return player.canUse("nanman", current) && current.isEnemyOf(player);
					});
					list.sort(lib.sort.seat);
					player.useCard({ name: "nanman" }, list);
				},
			},
			boss_zuijiu: {
				trigger: { source: "damageBegin1" },
				filter: function (event) {
					return event.card && event.card.name == "sha" && event.getParent().name == "sha";
				},
				forced: true,
				content: function () {
					trigger.num++;
				},
			},
			boss_xixing: {
				trigger: { player: "phaseZhunbeiBegin" },
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("boss_xixing"), function (card, player, target) {
						return player != target && target.isLinked();
					}).ai = function (target) {
						return get.damageEffect(target, player, player, "thunder");
					};
					"step 1";
					if (result.bool) {
						player.logSkill("boss_xixing", result.targets);
						result.targets[0].damage("thunder");
						player.recover();
					}
				},
			},
			boss_suoming: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current != player && !current.isLinked();
					});
				},
				content: function () {
					"step 0";
					var num = game.countPlayer(function (current) {
						return current != player && !current.isLinked();
					});
					player.chooseTarget(get.prompt("boss_suoming"), [1, num], function (card, player, target) {
						return !target.isLinked() && player != target;
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("boss_suoming", result.targets);
						event.targets = result.targets;
						event.num = 0;
					} else {
						event.finish();
					}
					"step 2";
					if (event.num < event.targets.length) {
						event.targets[event.num].link();
						event.num++;
						event.redo();
					}
				},
			},
			boss_taiping: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				content: function () {
					trigger.num += 2;
				},
			},
			boss_baolian: {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				content: function () {
					player.draw(2);
				},
			},
			boss_xiaoshou: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("boss_xiaoshou"), function (card, player, target) {
						return player != target && target.hp >= player.hp;
					}).ai = function (target) {
						return get.damageEffect(target, player, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("boss_xiaoshou", result.targets);
						result.targets[0].damage(3);
					}
				},
			},
			boss_manjia: {
				group: ["boss_manjia1", "boss_manjia2"],
			},
			boss_manjia1: {
				trigger: { target: ["useCardToBefore", "shaBegin"] },
				forced: true,
				priority: 6,
				filter: function (event, player, name) {
					if (player.getEquip(2)) return false;
					if (name == "shaBegin") return lib.skill.tengjia3.filter(event, player);
					return lib.skill.tengjia1.filter(event, player);
				},
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (target.getEquip(2)) return;
							return lib.skill.tengjia1.ai.effect.target.apply(this, arguments);
						},
					},
				},
			},
			boss_manjia2: {
				trigger: { player: "damageBegin3" },
				filter: function (event, player) {
					if (player.getEquip(2)) return false;
					if (event.hasNature("fire")) return true;
				},
				forced: true,
				check: function () {
					return false;
				},
				content: function () {
					trigger.num++;
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (target.getEquip(2)) return;
							return lib.skill.tengjia2.ai.effect.target.apply(this, arguments);
						},
					},
				},
			},
			boss_lianyu: {
				trigger: { player: "phaseJieshuBegin" },
				unique: true,
				content: function () {
					"step 0";
					event.players = get.players(player);
					"step 1";
					if (event.players.length) {
						var current = event.players.shift();
						if (current.isEnemyOf(player)) {
							player.line(current, "fire");
							current.damage("fire");
						}
						event.redo();
					}
				},
				ai: {
					threaten: 2,
				},
			},
			boss_guiji: {
				trigger: { player: "phaseJudgeBegin" },
				forced: true,
				content: function () {
					player.discard(player.getCards("j").randomGet());
				},
				filter: function (event, player) {
					return player.countCards("j") > 0;
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (get.type(card) == "delay" && target.countCards("j") == 0) return 0.1;
						},
					},
				},
			},
			boss_minbao: {
				global: "boss_minbao2",
			},
			boss_minbao2: {
				trigger: { global: "dieAfter" },
				forced: true,
				globalFixed: true,
				filter: function (event, player) {
					return event.player.hasSkill("boss_minbao") && event.player.isDead();
				},
				content: function () {
					trigger.player.line(player, "fire");
					player.damage("nosource", "fire").animate = false;
					player.$damage(trigger.player);
					player.$damagepop(-1, "fire");
					if (lib.config.animation && !lib.config.low_performance) {
						player.$fire();
					}
					if (!event.parent.parent.boss_minbao_logv) {
						event.parent.parent.boss_minbao_logv = true;
						game.logv(trigger.player, "boss_minbao", game.filterPlayer(), event.parent.parent);
					}
				},
			},
			boss_guihuo: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("boss_guihuo"), function (card, player, target) {
						return player != target;
					}).ai = function (target) {
						return get.damageEffect(target, player, player, "fire");
					};
					"step 1";
					if (result.bool) {
						player.logSkill("boss_guihuo", result.targets);
						result.targets[0].damage("fire");
					}
				},
			},
			boss_luolei: {
				trigger: { player: "phaseZhunbeiBegin" },
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("boss_luolei"), function (card, player, target) {
						return player != target;
					}).ai = function (target) {
						return get.damageEffect(target, player, player, "thunder");
					};
					"step 1";
					if (result.bool) {
						player.logSkill("boss_luolei", result.targets);
						result.targets[0].damage("thunder");
					}
				},
			},
			boss_beiming: {
				trigger: { player: "dieBegin" },
				forced: true,
				filter: function (event) {
					return event.source != undefined;
				},
				content: function () {
					trigger.source.discard(trigger.source.getCards("h"));
				},
				ai: {
					threaten: 0.7,
				},
			},
			boss_shanbeng: {
				global: "boss_shanbeng2",
				trigger: { player: "dieBegin" },
				forced: true,
				logv: false,
				content: function () {
					var targets = game.filterPlayer(function (current) {
						return current.countCards("e");
					});
					player.line(targets, "green");
					game.delay();
					game.logv(player, "boss_shanbeng", targets, null, true);
				},
			},
			boss_shanbeng2: {
				trigger: { global: "dieAfter" },
				forced: true,
				globalFixed: true,
				filter: function (event, player) {
					return player.countCards("e") > 0 && event.player.hasSkill("boss_shanbeng") && event.player.isDead();
				},
				content: function () {
					player.discard(player.getCards("e"));
				},
			},
			boss_didong: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("boss_didong"), function (card, player, target) {
						return target.isEnemyOf(player);
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (target.isTurnedOver()) {
							if (att > 0) {
								return att + 5;
							}
							return -1;
						}
						if (player.isTurnedOver()) {
							return 5 - att;
						}
						return -att;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("boss_didong", result.targets);
						result.targets[0].turnOver();
					}
				},
				ai: {
					threaten: 1.7,
				},
			},
			boss_guimei: {
				mod: {
					targetEnabled: function (card, player, target) {
						if (get.type(card) == "delay") {
							return false;
						}
					},
				},
			},
			boss_bianshen: {
				trigger: { global: "gameStart" },
				forced: true,
				popup: false,
				content: function () {
					player.smoothAvatar();
					player.init(["boss_chi", "boss_mo", "boss_wang", "boss_liang"].randomGet());
					game.addVideo("reinit2", player, player.name);
				},
			},
			boss_bianshen_intro1: { nobracket: true },
			boss_bianshen_intro2: { nobracket: true },
			boss_bianshen_intro3: { nobracket: true },
			boss_bianshen_intro4: { nobracket: true },
			boss_chiyan_intro1: { nobracket: true },
			boss_chiyan_intro2: { nobracket: true },
			boss_chiyan_intro3: { nobracket: true },
			boss_chiyan_intro4: { nobracket: true },
			boss_qingmu_intro1: { nobracket: true },
			boss_qingmu_intro2: { nobracket: true },
			boss_qingmu_intro3: { nobracket: true },
			boss_qingmu_intro4: { nobracket: true },
			boss_baimang_intro1: { nobracket: true },
			boss_baimang_intro2: { nobracket: true },
			boss_baimang_intro3: { nobracket: true },
			boss_baimang_intro4: { nobracket: true },
			boss_xuanlin_intro1: { nobracket: true },
			boss_xuanlin_intro2: { nobracket: true },
			boss_xuanlin_intro3: { nobracket: true },
			boss_xuanlin_intro4: { nobracket: true },
			boss_leiji: {
				audio: 2,
				trigger: { player: ["respond", "useCard"] },
				filter: function (event, player) {
					return event.card.name == "shan";
				},
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("boss_leiji")).ai = function (target) {
						return get.damageEffect(target, player, player, "thunder");
					};
					"step 1";
					if (result.bool) {
						player.logSkill("boss_leiji", result.targets, "thunder");
						event.target = result.targets[0];
						event.target.judge(function (card) {
							// var suit=get.suit(card);
							// if(suit=='spade') return -4;
							// if(suit=='club') return -2;
							if (get.color(card) == "black") return -2;
							return 0;
						});
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool == false) {
						event.target.damage("thunder");
						player.draw();
					}
				},
				ai: {
					effect: {
						target_use: function (card, player, target, current) {
							if (get.tag(card, "respondShan")) {
								var hastarget = false,
									players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (get.attitude(target, players[i]) < 0) {
										hastarget = true;
										break;
									}
								}
								var be = target.countCards("e", { color: "black" });
								if (target.countCards("h", "shan") && be) {
									if (!target.hasSkill("guidao")) return 0;
									return [0, hastarget ? target.countCards("he") / 2 : 0];
								}
								if (target.countCards("h", "shan") && target.countCards("h") > 2) {
									if (!target.hasSkill("guidao")) return 0;
									return [0, hastarget ? target.countCards("h") / 4 : 0];
								}
								if (target.countCards("h") > 3 || (be && target.countCards("h") >= 2)) {
									return [0, 0];
								}
								if (target.countCards("h") == 0) {
									return [1.5, 0];
								}
								if (target.countCards("h") == 1 && !be) {
									return [1.2, 0];
								}
								if (!target.hasSkill("guidao")) return [1, 0.05];
								return [1, Math.min(0.5, (target.countCards("h") + be) / 4)];
							}
						},
					},
				},
			},
			wuqin: {
				audio: 2,
				trigger: { player: "phaseJieshuBegin" },
				filter: function (event, player) {
					return player.countCards("h") == 0;
				},
				content: function () {
					player.draw(3);
				},
			},
			boss_baolin: {
				audio: true,
				inherit: "juece",
			},
			boss_qiangzheng: {
				audio: 2,
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.countCards("h");
					});
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
			guizhen: {
				audio: 2,
				trigger: { player: "loseEnd" },
				frequent: true,
				filter: function (event, player) {
					if (player.countCards("h")) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					var players = get.players(player);
					players.remove(player);
					event.players = players;
					"step 1";
					if (event.players.length) {
						var current = event.players.shift();
						var hs = current.getCards("h");
						if (hs.length) {
							current.lose(hs)._triggered = null;
							current.$throw(hs);
						} else {
							current.loseHp();
						}
						game.delay(0.5);
						event.redo();
					}
				},
			},
			boss_konghun: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				filter: function () {
					return game.players.length >= 3;
				},
				content: function () {
					"step 0";
					player.chooseTarget(function (card, player, target) {
						return target != player;
					}).ai = function () {
						return 1;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("boss_konghun", result.targets);
						result.targets[0].goMad();
					}
				},
				group: "boss_konghun2",
			},
			boss_konghun2: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				popup: false,
				content: function () {
					var players = game.players.concat(game.dead);
					for (var i = 0; i < players.length; i++) {
						if (players[i].isMad()) {
							players[i].unMad();
						}
					}
				},
			},
			yuehun: {
				unique: true,
				trigger: { player: "phaseJieshuBegin" },
				frequent: true,
				content: function () {
					player.recover();
					player.draw(2);
				},
			},
			boss_wange: {
				inherit: "boss_guiji",
			},
			fengwu: {
				audio: 2,
				unique: true,
				enable: "phaseUse",
				usable: 1,
				content: function () {
					"step 0";
					event.current = player.next;
					"step 1";
					event.current.chooseToUse({ name: "sha" }, function (card, player, target) {
						if (player == target) return false;
						if (get.distance(player, target) <= 1) return true;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i] == player) continue;
							if (get.distance(player, players[i]) < get.distance(player, target)) return false;
						}
						return true;
					});
					"step 2";
					if (result.bool == false) event.current.loseHp();
					if (event.current.next != player) {
						event.current = event.current.next;
						game.delay(0.5);
						event.goto(1);
					}
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
							if (player.countCards("h", "shan")) return 1;
							var num = 0,
								players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (players[i].canUse("sha", player) && players[i].countCards("h") > 1) {
									num--;
								} else {
									num++;
								}
							}
							return num;
						},
					},
				},
			},
			huanhua: {
				audio: 2,
				trigger: { global: "gameDrawAfter" },
				forced: true,
				unique: true,
				content: function () {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] == player) continue;
						player.maxHp += game.players[i].maxHp;
						if (!game.players[i].name || !lib.character[game.players[i].name]) continue;
						var skills = lib.character[game.players[i].name][3];
						for (var j = 0; j < skills.length; j++) {
							if (!lib.skill[skills[j]].forceunique) {
								player.addSkill(skills[j]);
							}
						}
					}
					player.hp = player.maxHp;
					player.update();
				},
				group: ["huanhua3", "huanhua4"],
				ai: {
					threaten: 0.8,
					effect: {
						target: function (card) {
							if (card.name == "bingliang") return [0, 0];
						},
					},
				},
			},
			huanhua2: {
				trigger: { player: "phaseDrawBefore" },
				priority: 10,
				forced: true,
				popup: false,
				check: function () {
					return false;
				},
				content: function () {
					trigger.cancel();
				},
			},
			huanhua3: {
				trigger: { global: "drawAfter" },
				forced: true,
				filter: function (event, player) {
					if (event.parent.name != "phaseDraw") return false;
					return event.player != player;
				},
				content: function () {
					player.draw(trigger.num);
				},
			},
			huanhua4: {
				trigger: { global: "discardAfter" },
				forced: true,
				filter: function (event, player) {
					if (event.parent.parent.name != "phaseDiscard") return false;
					return event.player != player;
				},
				content: function () {
					player.chooseToDiscard(trigger.cards.length, true);
				},
			},
			jidian: {
				audio: 2,
				trigger: { source: "damageAfter" },
				direct: true,
				unique: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("jidian"), function (card, player, target) {
						return get.distance(trigger.player, target) <= 1 && trigger.player != target;
					}).ai = function (target) {
						return get.damageEffect(target, player, player, "thunder") + 0.1;
					};
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						event.target.judge(function (card) {
							return get.color(card) == "red" ? 0 : -1;
						});
						player.logSkill("jidian", event.target, false);
						trigger.player.line(event.target, "thunder");
					} else {
						event.finish();
					}
					"step 2";
					if (result.color == "black") {
						event.target.damage("thunder");
					}
				},
			},
			tinqin: {
				audio: false,
				inherit: "manjuan",
			},
			boss_hujia: {
				audio: 2,
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				unique: true,
				filter: function (event, player) {
					if (player.hp == player.maxHp) return false;
					if (!player.countCards("he")) return false;
					return true;
				},
				content: function () {
					"step 0";
					player.chooseCardTarget({
						position: "he",
						filterTarget: function (card, player, target) {
							if (player == target) return false;
							if (!lib.character[target.name]) return false;
							return true;
						},
						filterCard: lib.filter.cardDiscardable,
						ai1: function (card) {
							return get.unuseful(card) + 9;
						},
						ai2: function (target) {
							if (target.storage.boss_hujia) return Math.max(1, 10 - target.maxHp);
							return 1 / target.maxHp;
						},
						prompt: get.prompt("boss_hujia"),
					});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("boss_hujia", target);
						if (target.storage.boss_hujia) {
							target.loseMaxHp();
						} else {
							target.disableSkill("boss_hujia", lib.character[target.name][3]);
							target.storage.boss_hujia = true;
						}
						player.discard(result.cards);
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			boss_guihan: {
				audio: 2,
				unique: true,
				enable: "chooseToUse",
				mark: true,
				derivation: ["tinqin", "boss_huixin"],
				init: function (player) {
					player.storage.boss_guihan = false;
				},
				filter: function (event, player) {
					if (event.type != "dying") return false;
					if (!player.isDying()) return false;
					if (player.storage.boss_guihan) return false;
					return true;
				},
				content: function () {
					"step 0";
					player.removeSkill("boss_guihan");
					player.recover(player.maxHp - player.hp);
					player.storage.boss_guihan = true;
					"step 1";
					player.draw(4);
					"step 2";
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].enableSkill("boss_hujia");
						delete game.players[i].storage.boss_hujia;
					}
					if (game.bossinfo) {
						game.bossinfo.loopType = 1;
						_status.roundStart = game.boss;
					}
					player.removeSkill("beige");
					player.removeSkill("boss_hujia");
					player.addSkill("tinqin");
					player.addSkill("boss_huixin");
				},
				ai: {
					skillTagFilter: function (player) {
						if (player.storage.boss_guihan) return false;
					},
					save: true,
					result: {
						player: 4,
					},
				},
				intro: {
					content: "limited",
				},
			},
			huoshen: {
				trigger: { player: "damageBegin1" },
				forced: true,
				unique: true,
				filter: function (event) {
					return event.hasNature("fire");
				},
				content: function () {
					trigger.cancel();
					player.recover();
				},
				ai: {
					effect: {
						target: function (card) {
							if (get.tag(card, "fireDamage")) {
								return [0, 2, 0, 0];
							}
						},
					},
				},
			},
			boss_xianyin: {
				trigger: { player: "loseEnd" },
				frequent: true,
				unique: true,
				filter: function (event, player) {
					return _status.currentPhase != player;
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.color(card) == "red" ? 1 : 0;
					});
					"step 1";
					if (result.bool) {
						player.chooseTarget(true, "选择一个目标令其失去1点体力", function (card, player, target) {
							return player != target;
						}).ai = function (target) {
							return Math.max(1, 9 - target.hp);
						};
					} else {
						event.finish();
					}
					"step 2";
					if (result.targets.length) {
						player.line(result.targets);
						result.targets[0].loseHp();
					}
				},
				ai: {
					effect: {
						target: function (card) {
							if (get.tag(card, "loseCard")) {
								return [0.5, 1];
							}
						},
					},
				},
			},
			boss_huixin: {
				trigger: { player: "loseEnd" },
				frequent: true,
				unique: true,
				filter: function (event, player) {
					return _status.currentPhase != player;
				},
				content: function () {
					"step 0";
					player.judge();
					"step 1";
					if (result.color == "black") {
						_status.currentPhase.loseHp();
					} else {
						player.recover();
						player.draw();
					}
				},
				ai: {
					effect: {
						target: function (card) {
							if (get.tag(card, "loseCard")) {
								return [0.5, 1];
							}
						},
					},
				},
			},
			boss_shengshou: {
				audio: true,
				trigger: { player: "useCard" },
				frequent: true,
				unique: true,
				filter: function (event, player) {
					return player.hp < player.maxHp;
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.color(card) == "red" ? 1 : 0;
					});
					"step 1";
					if (result.bool) {
						player.recover();
					}
				},
			},
			boss_honglian: {
				audio: 2,
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				unique: true,
				content: function () {
					"step 0";
					event.players = get.players(player);
					event.players.remove(player);
					player.draw(2);
					"step 1";
					if (event.players.length) {
						event.players.shift().damage("fire");
						event.redo();
					}
				},
			},
			boss_yuhuo: {
				trigger: { player: "niepanAfter" },
				forced: true,
				unique: true,
				derivation: ["shenwei", "zhuyu"],
				content: function () {
					player.addSkill("kanpo");
					player.addSkill("shenwei");
					player.addSkill("zhuyu");
					if (game.bossinfo) {
						game.bossinfo.loopType = 1;
						_status.roundStart = game.boss;
					}
				},
			},
			boss_tianyu: {
				audio: true,
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				filter: function (event, player) {
					if (player.isLinked()) return true;
					return game.hasPlayer(function (current) {
						return current != player && !current.isLinked();
					});
				},
				content: function () {
					"step 0";
					event.targets = game.filterPlayer();
					event.targets.remove(player);
					event.targets.sort(lib.sort.seat);
					if (player.isLinked()) player.link();
					"step 1";
					if (event.targets.length) {
						var target = event.targets.shift();
						if (!target.isLinked()) {
							target.link();
							player.line(target, "green");
						}
						event.redo();
					}
				},
			},
			boss_jizhi: {
				audio: 2,
				trigger: { player: "useCard" },
				frequent: true,
				unique: true,
				filter: function (event) {
					var type = get.type(event.card, "trick");
					return type != "basic" && event.card.isCard;
				},
				content: function () {
					var cards = get.cards();
					player.gain(cards, "gain2");
					game.log(player, "获得了", cards);
				},
				ai: {
					threaten: 1.4,
					noautowuxie: true,
				},
			},
			boss_guiyin: {
				mod: {
					targetEnabled: function (card, player, target) {
						if (_status.currentPhase == player && target.hp < player.hp) return false;
					},
				},
			},
			boss_gongshen: {
				trigger: { global: "gameDrawAfter" },
				forced: true,
				unique: true,
				content: function () {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player) {
							game.players[i].forcemin = true;
						}
					}
				},
				mod: {
					targetEnabled: function (card, player, target) {
						if (get.type(card) == "delay" && player != target) {
							return false;
						}
					},
				},
			},
			fanghua: {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				locked: false,
				unique: true,
				filter: function () {
					return game.hasPlayer(function (current) {
						return current.isTurnedOver();
					});
				},
				content: function () {
					"step 0";
					event.players = get.players(player);
					event.num = 0;
					for (var i = 0; i < event.players.length; i++) {
						if (!event.players[i].isTurnedOver()) {
							event.players.splice(i--, 1);
						}
					}
					"step 1";
					if (event.players.length) {
						event.players.shift().loseHp();
						event.redo();
					}
				},
			},
			tashui: {
				audio: 2,
				trigger: { player: ["useCard", "respondAfter"] },
				direct: true,
				unique: true,
				filter: function (event) {
					return get.color(event.card) == "black";
				},
				content: function () {
					"step 0";
					game.delay(0.5);
					player.chooseTarget(get.prompt("tashui"), function (card, player, target) {
						return player != target;
					}).ai = function (target) {
						//	if(target.isTurnedOver()) return -1;
						var player = _status.event.player;
						if (get.attitude(_status.event.player, target) == 0) return 0;
						if (get.attitude(_status.event.player, target) > 0) {
							if (target.classList.contains("turnedover")) return 3;
							if (target.hasSkillTag("noturn")) return 1;
							return -1;
						} else {
							if (target.hasSkillTag("noturn")) return 0;
							if (target.classList.contains("turnedover")) return -1;
							return 5 - target.getDamagedHp();
						}
					};
					"step 1";
					if (result.bool) {
						player.logSkill("tashui", result.targets, "thunder");
						result.targets[0].turnOver();
					}
				},
				ai: {
					effect: {
						player_use: function (card) {
							if (get.color(card) == "black") {
								return [1, 2];
							}
						},
					},
				},
			},
			shangshix: {
				trigger: { player: ["loseEnd", "changeHp"] },
				forced: true,
				unique: true,
				audio: 2,
				filter: function (event, player) {
					return player.countCards("h") < 4;
				},
				content: function () {
					player.draw(4 - player.countCards("h"));
				},
				group: "shangshix2",
				ai: {
					effect: {
						target: function (card, player, target) {
							if (card.name == "shunshou") return;
							if (card.name == "guohe") {
								if (!target.countCards("e")) return [0, 1];
							} else if (get.tag(card, "loseCard")) {
								return [0, 1];
							}
						},
					},
					noh: true,
				},
			},
			xiuluo: {
				audio: 2,
				trigger: { player: "phaseZhunbeiBegin" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("j") > 0;
				},
				content: function () {
					"step 0";
					var next = player.discardPlayerCard(player, 2, "hj", "是否一张手牌来弃置一张花色相同的判定牌？");
					next.filterButton = function (button) {
						var card = button.link;
						if (!lib.filter.cardDiscardable(card, player)) return false;
						if (ui.selected.buttons.length == 0) return true;
						if (get.position(ui.selected.buttons[0].link) == "h") {
							if (get.position(card) != "j") return false;
						}
						if (get.position(ui.selected.buttons[0].link) == "j") {
							if (get.position(card) != "h") return false;
						}
						return get.suit(card) == get.suit(ui.selected.buttons[0].link);
					};
					next.ai = function (button) {
						var card = button.link;
						if (get.position(card) == "h") {
							return 11 - get.value(card);
						}
						if (card.name == "lebu") return 5;
						if (card.name == "bingliang") return 4;
						if (card.name == "guiyoujie") return 3;
						return 2;
					};
					next.logSkill = "xiuluo";
					"step 1";
					if (result.bool && player.countCards("j")) event.goto(0);
				},
			},
			shangshix2: {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return player.hp > 1;
				},
				content: function () {
					"step 0";
					event.players = get.players(player);
					event.num = 0;
					"step 1";
					if (event.players.length) {
						event.players.shift().loseHp();
						event.redo();
					}
				},
			},
			boss_wuxin: {
				audio: 2,
				mod: {
					targetEnabled: function (card, player, target) {
						if (get.type(card) == "delay" && player != target) return false;
					},
				},
				trigger: { player: "damageBefore" },
				forced: true,
				priority: 10,
				content: function () {
					trigger.cancel();
					player.loseHp();
				},
			},
			shenwei: {
				audio: 2,
				unique: true,
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				content: function () {
					trigger.num += Math.min(3, game.players.length - 1);
				},
				mod: {
					maxHandcard: function (player, current) {
						return current + Math.min(3, game.players.length - 1);
					},
				},
			},
			boss_baonuwash: {
				trigger: { player: "phaseAfter" },
				forced: true,
				content: function () {
					game.over(game.me == game.boss);
				},
				temp: true,
			},
			boss_baonu: {
				unique: true,
				trigger: { player: "changeHp", global: "boss_baonuwash" },
				forced: true,
				priority: 100,
				fixed: true,
				audio: 2,
				mode: ["identity", "guozhan", "boss", "stone"],
				init: function (player) {
					if (get.mode() == "boss" && player == game.boss) {
						lib.onwash.push(function () {
							if (!_status.boss_baonuwash) {
								_status.boss_baonuwash = true;
								_status.event.parent.trigger("boss_baonuwash");
							} else {
								_status.event.player.addSkill("boss_baonuwash");
							}
						});
						for (var i in lib.card) {
							if (lib.card[i].subtype == "equip1") lib.card[i].recastable = true;
						}
					}
				},
				filter: function (event, player) {
					return player.hp <= 4 || _status.boss_baonuwash;
				},
				content: function () {
					"step 0";
					if (player.hp > 6) {
						game.delay();
					}
					"step 1";
					player
						.chooseControl("暴怒战神", "神鬼无前", function () {
							if (Math.random() < 0.5) return "神鬼无前";
							return "暴怒战神";
						})
						.set("prompt", "选择一个形态");
					"step 2";
					var hp = player.hp;
					player.removeSkill("boss_baonu", true);
					if (result.control == "暴怒战神") {
						player.init("boss_lvbu2");
					} else {
						player.init("boss_lvbu3");
					}
					if (hp > 6) {
						player.maxHp = hp;
						player.hp = hp;
					}
					player.update();
					ui.clear();
					if (player.isLinked()) player.link();
					if (player.isTurnedOver()) player.turnOver();
					player.discard(player.getCards("j"));
					"step 3";
					while (_status.event.name != "phaseLoop") {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = player;
					_status.event.step = 0;
					if (game.bossinfo) {
						game.bossinfo.loopType = 1;
						_status.roundStart = game.boss;
					}
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
								if (player.hp == 5) {
									if (game.players.length < 4) return [0, 5];
									var num = 0;
									for (var i = 0; i < game.players.length; i++) {
										if (game.players[i] != game.boss && game.players[i].hp == 1) {
											num++;
										}
									}
									if (num > 1) return [0, 2];
									if (num && Math.random() < 0.7) return [0, 1];
								}
							}
						},
					},
				},
			},
			qiwu: {
				audio: true,
				trigger: { player: "useCard" },
				forced: true,
				filter: function (event, player) {
					return get.suit(event.card) == "club" && player.hp < player.maxHp;
				},
				content: function () {
					player.recover();
				},
			},
			jizhen: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.isDamaged() && current != player;
					});
				},
				content: function () {
					"step 0";
					var num = 0;
					for (var i = 0; i < game.players.length; i++) {
						if (!game.players[i].isLinked() && player != game.players[i]) {
							num++;
						}
					}
					player.chooseTarget(get.prompt("jizhen"), [1, 2], function (card, player, target) {
						return target.hp < target.maxHp && player != target;
					}).ai = function (target) {
						return get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("jizhen", result.targets);
						game.asyncDraw(result.targets);
					}
				},
				ai: {
					expose: 0.3,
					threaten: 1.3,
				},
			},
			shenqu: {
				audio: 2,
				group: "shenqu2",
				trigger: { global: "phaseZhunbeiBegin" },
				filter: function (event, player) {
					return player.countCards("h") <= player.maxHp;
				},
				frequent: true,
				content: function () {
					player.draw(2);
				},
			},
			shenqu2: {
				trigger: { player: "damageAfter" },
				direct: true,
				filter: function (event, player) {
					return player.hasSkillTag("respondTao") || player.countCards("h", "tao") > 0;
				},
				content: function () {
					player.chooseToUse({ name: "tao" }, "神躯：是否使用一张桃？").logSkill = "shenqu";
				},
			},
			jiwu: {
				derivation: ["qiangxix", "retieji", "olxuanfeng", "rewansha"],
				audio: 2,
				enable: "phaseUse",
				filter: function (event, player) {
					if (player.countCards("he") == 0) return false;
					if (!player.hasSkill("qiangxix")) return true;
					if (!player.hasSkill("retieji")) return true;
					if (!player.hasSkill("olxuanfeng")) return true;
					if (!player.hasSkill("rewansha")) return true;
					return false;
				},
				filterCard: true,
				position: "he",
				check: function (card) {
					if (get.position(card) == "e" && _status.event.player.hasSkill("olxuanfeng")) return 16 - get.value(card);
					return 7 - get.value(card);
				},
				content: function () {
					"step 0";
					var list = [];
					if (!player.hasSkill("qiangxix")) list.push("qiangxix");
					if (!player.hasSkill("retieji")) list.push("retieji");
					if (!player.hasSkill("olxuanfeng")) list.push("olxuanfeng");
					if (!player.hasSkill("rewansha")) list.push("rewansha");
					if (list.length == 1) {
						player.addTempSkills(list[0]);
						event.finish();
					} else {
						player
							.chooseControl(list, function () {
								if (list.includes("olxuanfeng") && player.countCards("he", { type: "equip" })) return "olxuanfeng";
								if (!player.getStat().skill.qiangxix) {
									if (player.hasSkill("qiangxix") && player.getEquip(1) && list.includes("olxuanfeng")) return "olxuanfeng";
									if (list.includes("rewansha") || list.includes("qiangxix")) {
										var players = game.filterPlayer();
										for (var i = 0; i < players.length; i++) {
											if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) {
												if (list.includes("rewansha")) return "rewansha";
												if (list.includes("qiangxix")) return "qiangxix";
											}
										}
									}
								}
								if (list.includes("qiangxix")) return "qiangxix";
								if (list.includes("rewansha")) return "rewansha";
								if (list.includes("olxuanfeng")) return "olxuanfeng";
								return "retieji";
							})
							.set("prompt", "选择获得一项技能直到回合结束");
					}
					"step 1";
					player.addTempSkills(result.control);
					// player.popup(get.translation(result.control));
				},
				ai: {
					order: function () {
						var player = _status.event.player;
						if (player.countCards("e", { type: "equip" })) return 10;
						if (!player.getStat().skill.qiangxix) {
							if (player.hasSkill("qiangxix") && player.getEquip(1) && !player.hasSkill("olxuanfeng")) return 10;
							if (player.hasSkill("rewansha")) return 1;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) return 10;
							}
						}
						return 1;
					},
					result: {
						player: function (player) {
							if (player.countCards("e", { type: "equip" })) return 1;
							if (!player.getStat().skill.qiangxix) {
								if (player.hasSkill("qiangxix") && player.getEquip(1) && !player.hasSkill("olxuanfeng")) return 1;
								if (!player.hasSkill("rewansha") || !player.hasSkill("qiangxix")) {
									var players = game.filterPlayer();
									for (var i = 0; i < players.length; i++) {
										if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) return 1;
									}
								}
							}
							return 0;
						},
					},
				},
			},
			boss_hunzi: {
				skillAnimation: true,
				animationColor: "wood",
				audio: "hunzi",
				juexingji: true,
				derivation: ["reyingzi", "yinghun"],
				unique: true,
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter: function (event, player) {
					return player.hp <= 2 && !player.storage.boss_hunzi;
				},
				forced: true,
				content: function () {
					player.removeSkill("boss_hunyou");
					player.removeSkill("boss_hunyou_dying");
					player.removeSkill("boss_hunyou_dieBegin");
					player.loseMaxHp();
					player.addSkill("reyingzi");
					player.addSkill("yinghun");
					game.log(player, "获得了技能", "#g【英姿】和【英魂】");
					game.log(player, "", "#y【魂佑】");
					player.awakenSkill("boss_hunzi");
					player.storage.boss_hunzi = true;
				},
				ai: {
					threaten: function (player, target) {
						if (target.hp == 1) return 2;
						return 0.5;
					},
					maixie: true,
					effect: {
						target: function (card, player, target) {
							if (!target.hasFriend()) return;
							if (get.tag(card, "damage") == 1 && target.hp == 2 && !target.isTurnedOver() && _status.currentPhase != target && get.distance(_status.currentPhase, target, "absolute") <= 3) return [0.5, 1];
						},
					},
				},
			},
			reyingzi_sunce: { audio: 2 },
			yinghun_sunce: { audio: 2 },
			boss_jiang: {
				audio: "jiang",
				trigger: {
					global: ["respondEnd"],
				},
				charlotte: true,
				locked: true,
				init: function (player) {
					var a = window.setInterval(function () {
						if (player.hasSkill("boss_jiang")) {
							player.storage.boss_jiang = true;
						} else {
							game.addGlobalSkill("boss_jiang");
							game.addGlobalSkill("boss_jiang_use");
							window.clearInterval(a);
						}
					}, 1000);
				},
				filter2: function (event, player) {
					if (!event.respondTo[1]) return false;
					if (get.itemtype(event.cards) != "cards") return false;
					if (["h", "e", "j"].includes(get.position(event.cards[0]))) return false;
					if (event.respondTo[1] && get.itemtype(event.respondTo[1]) != "card") return false;
					if (event.respondTo[1] && ["h", "e", "j"].includes(get.position(event.respondTo[1]))) return false;
				},
				filter: function (event, player) {
					if (!player.storage.boss_jiang) return false;
					if (!event.respondTo) return false;
					if (get.color(event.card) != "red") return false;
					if (event.respondTo[0] != player) {
						return event.player == player;
					} else {
						return event.player != player;
					}
				},
				frequent: true,
				content: function () {
					player.draw();
					if (!lib.skill.boss_jiang.filter2(trigger, player)) return;
					if (trigger.respondTo[0] != player) {
						if (trigger.respondTo[1] && get.position(trigger.respondTo[1]) == "d") player.gain(trigger.respondTo[1], "gain2");
					} else {
						if (get.position(trigger.cards[0]) == "d") player.gain(trigger.cards, "gain2");
					}
				},
				group: ["boss_jiang_use"],
				subSkill: {
					use: {
						audio: "jiang",
						trigger: {
							global: ["useCard"],
						},
						filter: function (event, player) {
							if (!player.storage.boss_jiang) return false;
							if (get.color(event.card) != "red") return false;
							return player == event.player || event.targets.includes(player);
						},
						frequent: true,
						content: function () {
							player.draw();
							if (trigger.player != player && get.itemtype(trigger.cards) == "cards" && get.position(trigger.cards[0]) == "d") player.gain(trigger.cards, "gain2");
						},
						sub: true,
					},
				},
			},
			boss_hunyou: {
				forced: true,
				init: function (player) {
					player.hp = 1;
					player.storage.hp = player.hp;
					player.storage.maxHp = player.maxHp;
					player.update();
				},
				trigger: {
					player: ["damageBefore", "recoverBefore", "loseHpBefore", "loseMaxHpBefore", "gainMaxHpBefore"],
				},
				content: function () {
					trigger.cancel();
				},
				group: ["boss_hunyou_dying", "boss_hunyou_dieBegin"],
				subSkill: {
					dying: {
						trigger: {
							player: "dying",
						},
						silent: true,
						filter: function (event, player) {
							if (player.hp != player.storage.hp && player.storage.hp > 0) return true;
							return false;
						},
						content: function () {
							trigger.cancel();
							player.maxHp = player.storage.maxHp;
							player.hp = player.storage.hp;
							player.update();
						},
						sub: true,
						forced: true,
						popup: false,
					},
					dieBegin: {
						trigger: {
							player: "dieBegin",
						},
						silent: true,
						filter: function (event, player) {
							if (player.maxHp != player.storage.maxHp && player.storage.maxHp > 0) return true;
							return false;
						},
						content: function () {
							trigger.cancel();
							player.maxHp = player.storage.maxHp;
							player.hp = player.storage.hp;
							player.update();
						},
						sub: true,
						forced: true,
						popup: false,
					},
				},
			},
			boss_taoni: {
				forced: true,
				trigger: {
					global: ["gameStart", "phaseBefore"],
					player: "dieBegin",
				},
				priority: 50,
				init: function (player) {
					player.boss_taoni = function () {
						if (typeof _status.taoni_over != "function") {
							_status.taoni_over = function (str) {
								_status.over = true;
								game.alert(str);
							};
						}
						function isDefined(opd) {
							if (opd != undefined) {
								if (opd.get || opd.set || opd.writable != true || opd.configurable != true) {
									return true;
								}
							}
							return false;
						}
						var keysArray = ["length", "players", "Player", "element"];
						for (var i = 0; i < game[keysArray[1]][keysArray[0]]; i++) {
							var node = game[keysArray[1]][i];
							for (var a in Object.keys(lib[keysArray[3]][keysArray[2]].prototype)) {
								var opd = Object.getOwnPropertyDescriptor(node, a);
								if (isDefined(opd)) _status.taoni_over(lib.translate[node.name] + "触发了〖讨逆〗，游戏已被终止。");
								//还原函数
								node[a] = lib[keysArray[3]][keysArray[2]].prototype[a];
								var playerKeysArray = ["classList", "hp", "maxHp", "skills"];
								for (var b = 0; b < playerKeysArray.length; b++) {
									var opd2 = Object.getOwnPropertyDescriptor(node, playerKeysArray[b]);
									if (isDefined(opd2)) _status.taoni_over(lib.translate[node.name] + "触发了〖讨逆〗，游戏已被终止。");
								}
								var gameKeysArray = ["players", "dead", "over"];
								for (var c = 0; c < gameKeysArray.length; c++) {
									var opd3 = Object.getOwnPropertyDescriptor(game, gameKeysArray[c]);
									if (isDefined(opd3)) _status.taoni_over("〖讨逆〗被触发，游戏终止。");
								}
							}
						}
					};
				},
				content: function () {
					player.boss_taoni();
				},
			},
		},
		translate: {
			zhu: "神",
			cai: "盟",
			zhong: "从",

			boss_chi: "魑",
			boss_mo: "魅",
			boss_wang: "魍",
			boss_liang: "魉",
			boss_niutou: "牛头",
			boss_mamian: "马面",
			boss_baiwuchang: "白无常",
			boss_heiwuchang: "黑无常",
			boss_luocha: "罗刹",
			boss_yecha: "夜叉",
			boss_zhuoguiquxie: "捉鬼驱邪",

			boss_nianshou: "年兽",
			boss_nianshou_heti: "年兽",
			boss_nianshou_jingjue: "警觉年兽",
			boss_nianshou_renxing: "任性年兽",
			boss_nianshou_baonu: "暴怒年兽",
			boss_nianshou_ruizhi: "睿智年兽",

			boss_shuijing: "水镜先生",
			boss_huangyueying: "奇智女杰",
			boss_zhangchunhua: "冷血皇后",
			boss_satan: "堕落天使",
			boss_dongzhuo: "乱世魔王",
			boss_lvbu1: "最强神话",
			boss_lvbu2: "暴怒战神",
			boss_lvbu3: "神鬼无前",
			boss_zhouyu: "赤壁火神",
			boss_pangtong: "涅槃凤雏",
			boss_zhugeliang: "祭风卧龙",
			boss_zhangjiao: "天公将军",
			boss_zuoci: "迷之仙人",
			boss_yuji: "琅琊道士",
			boss_liubei: "蜀汉烈帝",
			boss_caiwenji: "异乡孤女",
			boss_huatuo: "药坛圣手",
			boss_luxun: "蹁跹君子",
			boss_zhenji: "洛水仙子",
			boss_diaochan: "绝代妖姬",
			boss_guojia: "世之奇士",
			boss_caocao: "魏武大帝",

			boss_chiyanshilian: "夏之试炼",
			boss_zhuque: "朱雀",
			boss_huoshenzhurong: "火神祝融",
			boss_yanling: "焰灵",
			boss_yandi: "炎帝",

			boss_hundun: "混沌",
			boss_qiongqi: "穷奇",
			boss_taowu: "梼杌",
			boss_taotie: "饕餮",
			boss_zhuyin: "烛阴",
			boss_xiangliu: "相柳",
			boss_zhuyan: "朱厌",
			boss_bifang: "毕方",
			boss_yingzhao: "英招",

			boss_yaoshou: "妖兽",
			boss_yaoshou_info: "锁定技，你与其他角色计算-2。",
			boss_duqu: "毒躯",
			boss_duqu_info: "锁定技，你受到伤害时，伤害来源获得1枚“蛇毒”标记；你自身不会拥有“蛇毒”标记；你的【桃】均视为【杀】。“蛇毒”标记：锁定技，拥有“蛇毒”标记的角色回合开始时，需要选择弃置X张牌或者失去X点体力，然后弃置一枚“蛇毒”标记。X为其拥有的“蛇毒”标记个数。",
			boss_shedu: "蛇毒",
			boss_jiushou: "九首",
			boss_jiushou_info: "锁定技，你的手牌上限始终为9，你的出牌阶段开始时以及你的回合结束时，将手牌补至手牌上限，你始终跳过你的摸牌阶段。",
			boss_echou_switch: "恶臭",
			boss_echou: "恶臭",
			boss_echou_info: "体力值首次减少至一半或更少时激活此技能。锁定技，除你之外的其他角色使用“桃”或“酒”时，获得1枚“蛇毒”标记。",
			boss_bingxian: "兵燹",
			boss_bingxian_info: "锁定技，其他角色的回合结束时，若其回合内没有使用【杀】，则视为你对其使用一张【杀】。",
			boss_juyuan: "巨猿",
			boss_juyuan_info: "锁定技，你的体力上限+5，你的出牌阶段内，若你的体力少于上一次你的回合结束时的体力，则你本回合使用【杀】可额外指定1个目标。",
			boss_xushi_switch: "蓄势",
			boss_xushi: "蓄势",
			boss_xushi_info: "体力值首次减少至一半或更少时激活此技能。锁定技，你的出牌阶段结束时，你令自己翻面；当你的武将牌从背面翻至正面时，对所有其他角色造成随机1至2点伤害。",
			boss_zhaohuo: "兆火",
			boss_zhaohuo_info: "锁定技，你造成的所有伤害均视为火属性伤害；你的回合中，所有其他角色的防具牌无效；你免疫所有火属性伤害。",
			boss_honglianx: "红莲",
			boss_honglianx_info: "锁定技，你的红色牌不计入你的手牌上限；你的回合开始时，随机获得牌堆中0到3张红色牌，然后随机对3到0名其他角色各造成1点火属性伤害。",
			boss_yanyu: "炎狱",
			boss_yanyu_switch: "炎狱",
			boss_yanyu_info: "体力值首次减少至一半或更少时激活此技能。锁定技，其他角色回合开始时进行判定，若为红色则受到1点火属性伤害，并重复此过程（每个回合最多判定3次）。",
			boss_fengdong: "封冻",
			boss_fengdong_info: "锁定技，你的回合内，其他角色的非锁定技无效。",
			boss_xunyou: "巡游",
			boss_xunyou_info: "锁定技，其他角色回合开始时，你随机获得场上除你以外的一名角色区域内的一张牌，若你获得的是装备牌，则你使用之。",
			boss_sipu: "司圃",
			boss_sipu_switch: "司圃",
			boss_sipu_info: "体力值首次减少至一半或更少时激活此技能。锁定技，你的出牌阶段内，若你使用的牌数小于等于2张，其他角色无法使用或打出牌。",

			boss_wuzang: "无脏",
			boss_wuzang_info: "锁定技，摸牌阶段，你的摸牌基数改为X（X为你的体力值一半且至少为5）；你的手牌上限基数为0。",
			boss_xiangde: "相德",
			boss_xiangde_info: "锁定技，其他角色对你造成伤害时，若其装备区内有武器牌，此伤害+1。",
			boss_yinzei: "隐贼",
			boss_yinzei_switch: "隐贼",
			boss_yinzei_info: "体力值首次减少至一半或更少时激活此技能。锁定技，若你没有手牌，其他角色对你造成伤害后，随机弃置一张牌。",
			boss_zhue: "助恶",
			boss_zhue_info: "锁定技，每当一名其他角色造成伤害后，你与伤害来源各摸一张牌。",
			boss_futai: "复态",
			boss_futai_info: "锁定技，你的回合外，其他角色不能使用【桃】；你的回合开始时，你令所有角色回复1点体力。",
			boss_yandu: "厌笃",
			boss_yandu_switch: "厌笃",
			boss_yandu_info: "体力值首次减少至一半或更少时激活此技能。锁定技，其他角色回合结束后，若其未造成过伤害，你获得其一张牌。",
			boss_minwan: "冥顽",
			boss_minwan_info: "锁定技，当你于回合内使用牌对其他角色造成伤害后，你于此回合内使用牌只能指定你与这些角色为目标，且你每使用一张牌，摸一张牌。",
			boss_nitai: "拟态",
			boss_nitai_info: "锁定技，防止你于回合内受到的伤害；你于回合外受到火属性伤害+1。",
			boss_luanchang: "乱常",
			boss_luanchang_switch: "乱常",
			boss_luanchang_info: "体力值首次减少至一半或更少时激活此技能。锁定技，回合开始时，你视为使用【南蛮入侵】；回合结束时，你视为使用【万箭齐发】。",
			boss_tanyu: "贪欲",
			boss_tanyu_info: "锁定技，跳过你的弃牌阶段；结束阶段，若你的手牌数为全场最多，失去1点体力。",
			boss_cangmu: "藏目",
			boss_cangmu_info: "锁定技，你令摸牌阶段摸牌基数改为X（X为存活角色数）。",
			boss_jicai: "积财",
			boss_jicai_switch: "积财",
			boss_jicai_info: "体力值首次减少至一半或更少时激活此技能。锁定技，一名角色回复体力后，你与其各摸一张牌。",
			boss_xiongshou: "凶兽",
			boss_xiongshou_info: "锁定技，你使用【杀】对体力值小于你的角色造成的伤害+1；你与其他角色距离-1；你不能被翻面。",
			sadouchengbing: "撒豆成兵",
			sadouchengbing_info: "出牌阶段对自己使用，若你的势力为“神”，摸X张牌；否则将你手牌补至X；（X为你的体力上限且至多为5）。",
			yihuajiemu: "移花接木",
			yihuajiemu_info: "出牌阶段对一名有牌的其他角色使用，令其使用一张【杀】，或交给你两张牌。",
			chiyanzhenhunqin: "赤焰镇魂琴",
			chiyanzhenhunqin_info: "锁定技，你造成的伤害均视为具有火属性。",
			juechenjinge: "绝尘金戈",
			juechenjinge_info: "锁定技，敌方角色计算与己方其他角色距离+1。",
			xiuluolianyuji: "修罗炼狱戟",
			xiuluolianyuji_info: "你使用【杀】可以额外指定任意名攻击范围内的其他角色为目标；锁定技，你使用【杀】造成的伤害+1，然后令受到伤害的角色回复1点体力。",
			longfenghemingjian: "鸾凤和鸣剑",
			longfenghemingjian_info: "你使用的雷【杀】或火【杀】指定目标后，可令对方选择弃置一张牌或令你摸一张牌。",
			qicaishenlu: "七彩神鹿",
			qicaishenlu_info: "锁定技，你计算与其他角色的距离时-1，当你造成属性伤害时，你令此伤害+1。",
			boss_mengpohuihun: "回魂",
			boss_mengpohuihun_info: "若场上有角色在本局游戏中因孟婆的〖忘魂〗失去过技能，则令其恢复该技能；此牌进入弃牌堆后，会被销毁。",
			honghuangzhili: "洪荒之力",
			honghuangzhili_cbg: "洪",
			honghuangzhili_info: "若该角色的势力是神，你获得其一张牌，其〖神裔〗无效直到其下家的回合（这个下家是动态变化的，会随着一个人的死或者复活而变化）开始；若该角色的势力不是神，其翻面。",

			boss_qingmushilian: "春之试炼",
			boss_qinglong: "青龙",
			boss_mushengoumang: "木神勾芒",
			boss_shujing: "树精",
			boss_taihao: "太昊",

			boss_baimangshilian: "秋之试炼",
			boss_baihu: "白虎",
			boss_jinshenrushou: "金神蓐收",
			boss_mingxingzhu: "明刑柱",
			boss_shaohao: "少昊",

			boss_xuanlinshilian: "冬之试炼",
			boss_xuanwu: "玄武",
			boss_shuishenxuanming: "水神玄冥",
			boss_shuishengonggong: "水神共工",
			boss_zhuanxu: "颛顼",

			boss_lingqu: "灵躯",
			boss_lingqu_info: "锁定技，当你受到伤害后，你摸一张牌，然后手牌上限+1；防止你受到的大于1点的伤害。",
			boss_zirun: "滋润",
			boss_zirun_info: "锁定技，准备阶段开始时，你令所有角色摸一张牌，若其装备区内有牌，则其额外摸一张牌。",
			boss_juehong: "决洪",
			boss_juehong_info: "锁定技，准备阶段开始时，你令所有敌方角色自己弃置自己的装备区内的所有牌，若其装备区内没有牌，则改为你弃置其一张手牌。",
			boss_zaoyi: "皂仪",
			boss_zaoyi_info: "锁定技，只要水神玄冥存活，你不会成为敌方角色使用锦囊牌的目标，只要水神共工存活，你不会成为敌方角色使用基本牌的目标。水神玄冥和水神共工均死亡后，你摸四张牌，然后从下回合开始，每个回合开始时使体力值最少的敌方角色失去所有体力。",
			boss_baiyi: "白仪",
			boss_baiyi_info: "锁定技，每名敌方角色的摸牌阶段，若当前轮数小于3，其少摸一张牌；第五轮开始时，每名敌方角色弃置两张牌；当己方角色受到的雷电伤害时，若当前轮数小于7，其防止此伤害。",
			boss_qingzhu: "擎柱",
			boss_qingzhu_info: "锁定技，你跳过弃牌阶段，若你没有“殛顶”，你于出牌阶段不能使用【杀】。",
			boss_jiazu: "枷足",
			boss_jiazu_info: "锁定技，回合开始时，弃置你上家和下家的敌方角色的装备区内的坐骑牌。",
			boss_jiding: "殛顶",
			boss_jiding_info: "锁定技，其他己方角色受到伤害后，若伤害来源为敌方角色，则你视为对伤害来源使用雷【杀】，若此【杀】造成伤害，蓐收回复1点体力。然后你失去此技能（只有发动了才会失去，没发动不会失去）。",
			boss_xingqiu: "刑秋",
			boss_xingqiu_info: "锁定技，每两轮的出牌阶段开始时，你横置所有敌方角色，然后使明刑柱获得〖殛顶〗。",
			boss_kuangxiao: "狂啸",
			boss_kuangxiao_info: "锁定技，你的回合内，你使用【杀】没有距离限制，且指定所有敌方角色为目标。",
			boss_shenyi: "神裔",
			boss_shenyi_info: "锁定技，你的武将牌始终正面向上，你的判定区内的牌效果反转。",
			boss_shenen: "神恩",
			boss_shenen_info: "锁定技，所有己方角色使用牌无距离限制；所有敌方角色摸牌阶段多摸一张牌且手牌上限+1。",
			boss_fentian: "焚天",
			boss_fentian_info: "锁定技，你造成的伤害视为火焰伤害；你使用红色牌无距离和次数限制，且不可被其他角色使用【闪】或【无懈可击】响应。",
			boss_fentian2: "焚天",
			boss_xingxia: "行夏",
			boss_xingxia_info: "每两轮限一次，出牌阶段，你可以对焰灵造成2点火焰伤害，然后令每名敌方角色选择一项：1.弃置一张红色牌；2.你对其造成1点火焰伤害。",
			boss_huihuo: "回火",
			boss_huihuo_info: "锁定技，当你死亡时，你对所有敌方角色各造成3点火焰伤害；出牌阶段，你可以多使用一张【杀】。",
			boss_furan: "复燃",
			boss_furan2: "复燃",
			boss_furan_info: "当你濒死时，所有敌方角色视为可以将红色牌当【桃】对你使用。",
			boss_chiyi: "赤仪",
			boss_chiyi2: "赤仪",
			boss_chiyi_info: "锁定技，从第三轮开始，敌方角色受到的伤害+1；第五轮开始时，你对所有角色各造成1点火焰伤害；第七轮开始时，你对焰灵造成5点火焰伤害。",
			boss_buchun: "布春",
			boss_buchun_info: "每两轮限一次，出牌阶段，若场上有死亡的树精，你可以失去1点体力，复活所有树精，使其回复体力至1点，补充手牌至两张；若场上没有死亡的树精，你可以为一名己方角色回复2点体力。",
			boss_cuidu: "淬毒",
			boss_cuidu_info: "锁定技，你对敌方角色造成伤害后，若其没有“中毒”，你令其获得“中毒”，然后令木神勾芒摸一张牌。",
			boss_zhongdu: "中毒",
			boss_zhongdu_bg: "毒",
			boss_zhongdu_info: "锁定技，回合开始时，你进行判定，若结果不为红桃，你受到1点无来源的伤害，若结果不为黑桃，你失去此技能。",
			boss_qingyi: "青仪",
			boss_qingyi_info: "锁定技，第三轮开始时，己方角色各回复1点体力；第五轮开始时，敌方角色各失去1点体力；第七轮开始时，复活木神勾芒和树精，使其各摸三张牌，各+1体力上限，然后各回复3点体力。",

			boss_guimou: "鬼谋",
			boss_guimou_info: "结束阶段，你可以令一名随机的其他角色进入混乱状态直到其下一回合结束。",
			boss_yuance: "远策",
			boss_yuance_info: "每当一名角色受到其他角色的伤害，你可以选择一项并进行一次判定：1. 若结果为黑色，受伤害角色失去1点体力，否则伤害来源失去1点体力；2. 若结果为红色，受伤害角色回复1点体力，否则伤害来源回复1点体力。",
			boss_qizuo: "奇佐",
			boss_qizuo_info: "你可以令你的普通锦囊牌额外结算一次。",
			boss_guixin: "归心",
			boss_guixin_info: "锁定技，其他角色摸牌时，若摸牌数不少于2，须将摸到的牌中的一张交给你。",
			xiongcai: "雄才",
			xiongcai_info: "锁定技，你在回合结束后随机获得一个魏势力角色的所有技能。",
			xiaoxiong: "枭雄",
			xiaoxiong_info: "锁定技，每当一名其他角色使用一张基本牌或锦囊牌，你获得一张与之同名的牌；在一名其他角色的结束阶段，若其本回合没有使用牌，你对其造成1点伤害。",
			boss_zhangwu: "章武",
			boss_zhangwu_info: "每当你受到一次伤害，你可以弃置任意张牌并令伤害来源选择一项：弃置等量的牌，或受到等量的伤害。",
			xiangxing: "禳星",
			xiangxing_info: "锁定技，游戏开始时，你获得7枚星；每当你累计扣减7点体力，你失去一枚星，并造成7点雷属性伤害，随机分配给其他角色；当你失去全部星后，你的体力上限变为3。",
			yueyin: "月隐",
			yueyin_info: "锁定技，你的每一枚星对应的一个特定条件，当你失去星时，若满足此条件，则不造成伤害。",
			xiangxing7_info: "你没有手牌",
			xiangxing6_info: "此次受到的是火属性伤害",
			xiangxing5_info: "此次受到的是雷属性伤害",
			xiangxing4_info: "此次为失去体力",
			xiangxing3_info: "一名其他角色有至少4件装备",
			xiangxing2_info: "你的判定区内至少有两张牌",
			xiangxing1_info: "场上只有2名存活角色",
			gaiming: "改命",
			gaiming_info: "锁定技，在你的判定牌生效前，你观看牌堆顶的七张牌并选择一张作为判定结果，此结果不可更改。",
			fengqi: "风起",
			fengqi_info: "准备阶段和结束阶段，你可以视为使用任意一张普通锦囊牌。",

			jiaoxia: "皎霞",
			jiaoxia_info: "每当你成为红色牌的目标，你可以摸一张牌。",
			lingbo: "凌波",
			lingbo_info: "每当你使用或打出一张闪，你可以摸两张牌。",
			tiandao: "天道",
			tiandao_info: "任意一名角色的判定生效前，你可以打出一张牌替换之。",
			yunshen: "云身",
			yunshen2: "云身",
			yunshen_info: "每当你使用或打出一张闪时，你可以令你的防御距离+1；准备阶段，你将累计的防御距离清零，然后摸等量的牌。",
			lianji: "连计",
			lianji_info: "出牌阶段限一次，你可以选择一张手牌并指定两名角色进行拼点，拼点赢的角色获得此牌，并对没赢的角色造成1点伤害。",
			mazui: "麻醉",
			mazui2: "麻醉",
			mazui_info: "出牌阶段限一次，你可以将一张黑色手牌置于一名角色的武将牌上，该角色造成的下一次伤害-1，然后获得此牌。",

			boss_nbianshen: "变形",
			boss_nbianshenx: "变形",
			boss_nbianshenx_info: "你从第二轮开始，每一轮幻化为警觉、任性、睿智、暴怒四种随机状态中的一种。",
			boss_mengtai: "萌态",
			boss_mengtai_info: "锁定技，若你的出牌阶段被跳过，你跳过本回合的弃牌阶段；若你的摸牌阶段被跳过，结束阶段开始时，你摸三张牌。",
			boss_ruizhi: "睿智",
			boss_ruizhi_info: "锁定技，其他角色的准备阶段开始时，其选择一张手牌和一张装备区里的牌，然后弃置其余的牌。",
			boss_jingjue: "警觉",
			boss_jingjue_info: "每当你于回合外失去牌时，你可以进行一次判定，若结果为红色，你回复1点体力。",
			boss_renxing: "任性",
			boss_renxing_info: "锁定技，你的回合外，一名角色受到1点伤害后或回复1点体力时，你摸一张牌。",
			boss_nbaonu: "暴怒",
			boss_nbaonu_info: "锁定技，摸牌阶段，你改为摸X张牌（X为4到你体力值间的随机数）；若你的体力值小于5，则你使用【杀】造成的伤害+1且无次数限制。",
			boss_shouyi: "兽裔",
			boss_shouyi_info: "锁定技，你使用牌无距离限制。",

			boss_nianrui: "年瑞",
			boss_nianrui_info: "锁定技，摸牌阶段，你额外摸两张牌。",
			boss_qixiang: "祺祥",
			boss_qixiang1: "祺祥",
			boss_qixiang2: "祺祥",
			boss_qixiang_info: "乐不思蜀判定时，你的方块判定牌视为红桃；兵粮寸断判定时，你的黑桃判定牌视为草花。",

			qiwu: "栖梧",
			qiwu_info: "锁定技。每当你使用一张梅花牌，你回复1点体力。",
			jizhen: "激阵",
			jizhen_info: "结束阶段，你可以令所至多两名已受伤角色摸一张牌。",

			boss_yushou: "驭兽",
			boss_yushou_info: "出牌阶段开始时，你可以对所有敌方角色使用一张【南蛮入侵】。",
			boss_moyany: "魔炎",
			boss_moyany_info: "每当你于回合外失去牌时，你可以进行一次判定，若结果为红色，你对一名其他角色造成2点火焰伤害。",
			boss_modao: "魔道",
			boss_modao_info: "锁定技，准备阶段，你摸两张牌。",
			boss_mojian: "魔箭",
			boss_mojian_info: "出牌阶段开始时，你可以对所有敌方角色使用一张【万箭齐发】。",
			boss_danshu: "丹术",
			boss_danshu_info: "每当你于回合外失去牌时，你可以进行一次判定，若结果为红色，你回复1点体力。",

			boss_zuijiu: "醉酒",
			boss_zuijiu_info: "锁定技，你因【杀】造成伤害时，此伤害+1。",
			boss_taiping: "太平",
			boss_taiping_info: "锁定技，摸牌阶段摸牌时，你的摸牌数量+2。",
			boss_suoming: "索命",
			boss_suoming_info: "结束阶段，将任意名未被横置的其他角色的武将牌横置。",
			boss_xixing: "吸星",
			boss_xixing_info: "准备阶段，对任意一名横置的其他角色造成1点雷电伤害，然后回复1点体力。",

			boss_baolian: "暴敛",
			boss_baolian_info: "锁定技，结束阶段，你摸两张牌。",
			boss_manjia: "蛮甲",
			boss_manjia_info: "锁定技，若你的装备区内没有防具牌，则你视为装备了【藤甲】。",
			boss_xiaoshou: "枭首",
			boss_xiaoshou_info: "结束阶段，对体力不小于你的一名其他角色造成3点伤害。",
			boss_guiji: "诡计",
			boss_guiji_info: "锁定技，准备阶段结束时，若你的判定区内有牌，你随机弃置其中一张牌。",
			boss_lianyu: "炼狱",
			boss_lianyu_info: "结束阶段，你可以对所有敌方角色造成1点火焰伤害。",

			boss_guihuo: "鬼火",
			boss_guihuo_info: "结束阶段，你可以对一名其他角色造成1点火焰伤害。",
			boss_minbao: "冥爆",
			boss_minbao_info: "锁定技，当你死亡时，对场上所有其他角色造成1点火焰伤害。",
			boss_luolei: "落雷",
			boss_luolei_info: "准备阶段，你可以对一名其他角色造成1点雷电伤害。",
			boss_beiming: "悲鸣",
			boss_beiming_info: "锁定技，当你死亡时，你令杀死你的角色弃置所有手牌。",
			boss_guimei: "鬼魅",
			boss_guimei_info: "锁定技，你不能成为延时类锦囊的目标。",
			boss_didong: "地动",
			boss_didong_info: "结束阶段，你可以选择一名敌方角色将其武将牌翻面。",
			boss_shanbeng: "山崩",
			boss_shanbeng_info: "锁定技，当你死亡时，你令所有其他角色弃置其装备区内的所有牌。",

			boss_chiyan_intro1: "&nbsp;第一关",
			boss_chiyan_intro1_info: "挑战朱雀",
			boss_chiyan_intro2: "&nbsp;第二关",
			boss_chiyan_intro2_info: "挑战火神祝融、焰灵",
			boss_chiyan_intro3: "&nbsp;第三关",
			boss_chiyan_intro3_info: "挑战炎帝、火神祝融、焰灵",
			boss_chiyan_intro3_append: "每通过一关，游戏轮数清零，阵亡角色复活，所有角色重置武将和区域内的牌，并获得4-X张起始手牌，X为阵亡角色数。",

			boss_qingmu_intro1: "&nbsp;第一关",
			boss_qingmu_intro1_info: "挑战青龙",
			boss_qingmu_intro2: "&nbsp;第二关",
			boss_qingmu_intro2_info: "挑战木神勾芒、树精",
			boss_qingmu_intro3: "&nbsp;第三关",
			boss_qingmu_intro3_info: "挑战太昊、木神勾芒、树精",
			boss_qingmu_intro3_append: "每通过一关，游戏轮数清零，阵亡角色复活，所有角色重置武将和区域内的牌，并获得4-X张起始手牌，X为阵亡角色数。",

			boss_xuanlin_intro1: "&nbsp;第一关",
			boss_xuanlin_intro1_info: "挑战玄武",
			boss_xuanlin_intro2: "&nbsp;第二关",
			boss_xuanlin_intro2_info: "挑战水神玄冥、水神共工",
			boss_xuanlin_intro3: "&nbsp;第三关",
			boss_xuanlin_intro3_info: "挑战颛顼、水神玄冥、水神共工",
			boss_xuanlin_intro3_append: "每通过一关，游戏轮数清零，阵亡角色复活，所有角色重置武将和区域内的牌，并获得4-X张起始手牌，X为阵亡角色数。",

			boss_baimang_intro1: "&nbsp;第一关",
			boss_baimang_intro1_info: "挑战白虎",
			boss_baimang_intro2: "&nbsp;第二关",
			boss_baimang_intro2_info: "挑战金神蓐收、明刑柱",
			boss_baimang_intro3: "&nbsp;第三关",
			boss_baimang_intro3_info: "挑战少昊、金神蓐收、明刑柱",
			boss_baimang_intro3_append: "每通过一关，游戏轮数清零，阵亡角色复活，所有角色重置武将和区域内的牌，并获得4-X张起始手牌，X为阵亡角色数。",

			boss_bianshen_intro1: "&nbsp;第一关",
			boss_bianshen_intro1_info: "挑战魑、魅、魍、魉中的随机一个",
			boss_bianshen_intro2: "&nbsp;第二关",
			boss_bianshen_intro2_info: "挑战牛头、马面中的随机一个",
			boss_bianshen_intro3: "&nbsp;第三关",
			boss_bianshen_intro3_info: "挑战白无常、黑无常中的随机一个",
			boss_bianshen_intro4: "&nbsp;第四关",
			boss_bianshen_intro4_info: "挑战罗刹、夜叉中的随机一个",
			// boss_bianshen2:'后援',
			// boss_bianshen2_info:'你死亡后，随机召唤牛头、马面中的一个。',
			// boss_bianshen3:'后援',
			// boss_bianshen3_info:'你死亡后，随机召唤白无常、黑无常中的一个。',
			// boss_bianshen4:'后援',
			// boss_bianshen4_info:'你死亡后，随机召唤罗刹、夜叉中的一个。',

			boss_qiangzheng: "强征",
			boss_qiangzheng_info: "锁定技，结束阶段，你获得每个敌方角色的一张手牌。",
			boss_baolin: "暴凌",
			guizhen: "归真",
			guizhen_info: "每当你失去最后一张手牌，你可以所有敌人失去全部手牌，没有手牌的角色失去1点体力（不触发技能）。",
			boss_shengshou: "圣手",
			boss_shengshou_info: "每当你使用一张牌，你可以进行一次判定，若为红色，你回复1点体力。",
			wuqin: "五禽戏",
			wuqin_info: "结束阶段，若你没有手牌，可以摸三张牌。",

			boss_konghun: "控心",
			boss_konghun_info: "结束阶段，你可以指定一名敌人令其进入混乱状态（不受对方控制，并将队友视为敌人）直到下一回合开始。",
			yuehun: "月魂",
			yuehun_info: "结束阶段，你可以回复1点体力并摸两张牌。",
			fengwu: "风舞",
			fengwu_info: "出牌阶段限一次，可令除你外的所有角色依次对与其距离最近的另一名角色使用一张【杀】，无法如此做者失去1点体力。",
			boss_wange: "笙歌",

			huanhua: "幻化",
			huanhua_info: "锁定技，游戏开始时，你获得其他角色的所有技能，体力上限变为其他角色之和；其他角色于摸牌阶段摸牌时，你摸等量的牌；其他角色于弃牌阶段弃牌时，你弃置等量的手牌。",

			boss_leiji: "雷击",
			boss_leiji_info: "每当你使用或打出一张【闪】，可令任意一名角色进行一次判定，若结果为黑色，其受到1点雷电伤害，然后你摸一张牌。",
			jidian: "亟电",
			jidian_info: "每当你造成一次伤害，可以指定距离受伤害角色1以内的一名其他角色进行判定，若结果为黑色，该角色受到1点雷电伤害。",

			tinqin: "听琴",
			boss_guihan: "归汉",
			boss_guihan_info: "限定技，濒死阶段，你可以将体力回复至体力上限，摸四张牌，令所有敌人的技能恢复，失去技能〖悲歌〗和〖胡笳〗，并获得技能〖听琴〗、〖蕙质〗。",
			boss_huixin: "蕙质",
			boss_huixin_info: "每当你于回合外失去牌，可以进行一次判定，若为黑色，当前回合角色失去1点体力，否则你回复1点体力并摸一张牌。",
			boss_hujia: "胡笳",
			boss_hujia_info: "结束阶段，若你已受伤，可以弃置一张牌令一名其他角色的所有技能失效，若其所有技能已失效，改为令其失去1点体力上限。",
			boss_honglian: "红莲",
			boss_honglian_info: "锁定技，结束阶段，你摸两张牌，并对所有敌人造成1点火焰伤害。",
			huoshen: "火神",
			huoshen_info: "锁定技，你防止即将受到的火焰伤害，改为回复1点体力。",
			boss_xianyin: "仙音",
			boss_xianyin_info: "每当你于回合外失去牌，你可以进行一次判定，若为红色，你令一名敌人失去1点体力。",

			boss_yuhuo: "浴火",
			boss_yuhuo_info: "觉醒技，在你涅槃后，你获得技能〖神威〗、〖朱羽〗。",
			boss_tianyu: "天狱",
			boss_tianyu_info: "锁定技，结束阶段，你解除横置状态，除你之外的所有角色进入横置状态。",

			boss_jizhi: "集智",
			boss_jizhi_info: "每当你使用一张非转化的非基本牌，你可以摸一张牌并展示之。",
			boss_guiyin: "归隐",
			boss_guiyin_info: "锁定技，体力值比你多的角色无法在回合内对你使用卡牌。",
			boss_gongshen: "工神",
			boss_gongshen_info: "锁定技，除你之外的角色没有装备区；你不能成为其他角色的延时锦囊牌的目标。",

			fanghua: "芳华",
			fanghua_info: "结束阶段，你可以令所有已翻面角色失去1点体力。",
			tashui: "踏水",
			tashui_info: "每当你使用或打出一张黑色牌，你可以令一名其他角色翻面。",

			boss_wuxin: "无心",
			boss_wuxin_info: "锁定技，你防止即将受到的伤害，改为失去1点体力；你不能成为其他角色的延时锦囊的目标。",
			shangshix: "伤逝",
			shangshix2: "伤逝",
			shangshix_info: "锁定技，你的手牌数至少为4，结束阶段，若你的体力值大于1，你令场上所有角色失去1点体力。",

			boss_baonu: "暴怒",
			boss_baonu_info: "锁定技，当你的体力值降至4或更低时，你变身为暴怒战神或神鬼无前，并立即开始你的回合。",
			shenwei: "神威",
			shenwei_info: "锁定技，摸牌阶段，你额外摸X张牌，你的手牌上限+X（X为场上其他角色的数目且至多为3）。",
			xiuluo: "修罗",
			xiuluo_info: "准备阶段，你可以弃置一张牌，然后弃置你判定区内一张同花色的牌，然后你可以重复此流程。",
			shenqu: "神躯",
			shenqu_info: "每名角色的准备阶段，若你的手牌数少于或等于你的体力上限数，你可以摸两张牌；当你受到伤害后，你可以使用一张【桃】。",
			jiwu: "极武",
			jiwu_info: "出牌阶段，你可以弃置一张牌，然后获得获得以下一项技能直到回合结束：〖强袭〗、〖铁骑〗、〖旋风〗、〖完杀〗。",

			boss_jingjia: "精甲",
			boss_jingjia_info: "锁定技，游戏开始时，将本局游戏中加入的装备随机置入你的装备区。",
			boss_aozhan: "鏖战",
			boss_aozhan_info: "锁定技，若你装备区内有：武器牌，你可以多使用一张【杀】；防具牌，防止你受到的超过1点的伤害；坐骑牌，摸牌阶段多摸一张牌；宝物牌，跳过你的判定阶段。",

			boss_qinguangwang_ab: "秦广王",
			boss_qinguangwang: "秦广王·蒋子文",
			boss_panguan: "判官",
			boss_panguan_info: "锁定技，你不能成为延时类锦囊的目标。",
			boss_juhun: "拘魂",
			boss_juhun_info: "锁定技，结束阶段，你令随机一名其他角色的武将牌翻面或横置。",
			boss_wangxiang: "望乡",
			boss_wangxiang_info: "锁定技，当你死亡时，你令所有其他角色弃置其装备区内的所有牌。",
			boss_chujiangwang_ab: "楚江王",
			boss_chujiangwang: "楚江王·厉温",
			boss_bingfeng: "冰封",
			boss_bingfeng_info: "锁定技，你死亡时，若杀死你的角色武将牌是正面朝上， 你令其翻面。",
			boss_songdiwang_ab: "宋帝王",
			boss_songdiwang: "宋帝王·余懃",
			boss_heisheng: "黑绳",
			boss_heisheng_info: "锁定技，你死亡时，横置所有场上角色。",
			boss_shengfu: "绳缚",
			boss_shengfu_info: "锁定技，你的回合结束时，随机弃置一张场上其他角色的坐骑牌。",
			boss_wuguanwang_ab: "五官王",
			boss_wuguanwang: "五官王·吕岱",
			boss_zhiwang: "治妄",
			boss_zhiwang_info: "锁定技，当其他角色于摸牌阶段外得到牌时，你随机弃置其一张手牌。",
			boss_zhiwang_planetarian: "注意事项",
			boss_zhiwang_planetarian_info: "若触发〖治妄〗的角色因〖治妄〗触发的其他的技能（如〖伤逝〗〖连营〗等）继续得到了牌，则该角色将其武将牌变更为孙策。",
			boss_gongzheng: "公正",
			boss_gongzheng_info: "锁定技，准备阶段，若你判定区有牌，你随机弃置一张你判定区的牌。",
			boss_xuechi: "血池",
			boss_xuechi_info: "锁定技，你的回合结束时，令随机一名其他角色失去2点体力。",
			boss_yanluowang_ab: "阎罗王",
			boss_yanluowang: "阎罗王·包拯",
			boss_tiemian: "铁面",
			boss_tiemian_info: "锁定技，你的防具区没有牌时，视为你装备【仁王盾】。",
			boss_zhadao: "铡刀",
			boss_zhadao_info: "锁定技，你使用【杀】指定目标后，你令目标角色防具无效。",
			boss_zhuxin: "诛心",
			boss_zhuxin_info: "锁定技，你死亡时，你令场上血量最少的一名其他角色受到2点伤害。",
			boss_bianchengwang_ab: "卞城王",
			boss_bianchengwang: "卞城王·毕元宾",
			boss_leizhou: "雷咒",
			boss_leizhou_info: "锁定技，准备阶段，你对随机一名其他角色造成1点雷属性伤害。",
			boss_leifu: "雷缚",
			boss_leifu_info: "锁定技，你的回合结束时，随机横置一名其他角色。",
			boss_leizhu: "雷诛",
			boss_leizhu_info: "锁定技，你死亡时，对所有其他角色造成依次造成1点雷属性伤害。",
			boss_taishanwang_ab: "泰山王",
			boss_taishanwang: "泰山王·董和",
			boss_fudu: "服毒",
			boss_fudu_info: "锁定技，其他角色使用【桃】时，你令随机另一名其他角色失去1点体力。",
			boss_kujiu: "苦酒",
			boss_kujiu_info: "锁定技，其他角色准备阶段，你令其失去1点体力，然后该角色视为使用一张【酒】。",
			boss_renao: "热恼",
			boss_renao_info: "锁定技，你死亡时，你令随机一名其他角色受到3点火属性伤害。",
			boss_dushiwang_ab: "都市王",
			boss_dushiwang: "都市王·黄中庸",
			boss_remen: "热闷",
			boss_remen_info: "锁定技，若你的装备区内没有防具牌，则【南蛮入侵】、【万箭齐发】和普通【杀】对你无效。",
			boss_zhifen: "炙焚",
			boss_zhifen_info: "锁定技，准备阶段，你随机选择一名其他角色，获得其1张手牌（没有则不获得），并对其造成1点火属性伤害。",
			boss_huoxing: "火刑",
			boss_huoxing_info: "锁定技，你死亡时，你对所有其他角色造成1点火属性伤害。",
			boss_pingdengwang_ab: "平等王",
			boss_pingdengwang: "平等王·陆游",
			boss_suozu: "锁足",
			boss_suozu_info: "锁定技，准备阶段，你令所有其他角色横置。",
			boss_abi: "阿鼻",
			boss_abi_info: "锁定技，锁定技，你受到伤害时，你对伤害来源造成伤害的角色造成1点随机属性伤害（雷或火随机）。",
			boss_pingdeng: "平等",
			boss_pingdeng_info: "锁定技，你死亡时，你对体力最多的一名其他角色造成2点随机属性伤害（属性随机），然后再对一名体力最多的其他角色造成1点随机属性伤害（属性随机）。",
			boss_zhuanlunwang_ab: "转轮王",
			boss_zhuanlunwang: "转轮王·薛礼",
			boss_lunhui: "轮回",
			boss_lunhui_info: "锁定技，准备阶段，若你的体力小于等于2，则你与场上除你以外体力最高且大于2的角色交换体力值。",
			boss_wangsheng: "往生",
			boss_wangsheng_info: "锁定技，你的出牌阶段开始时，视为你随机使用一张【南蛮入侵】或【万箭齐发】。",
			boss_zlfanshi: "反噬",
			boss_zlfanshi_info: "锁定技，每个回合你受到第一次伤害后，若再次受到伤害，则对随机一名其他角色造成1点伤害。",
			boss_shikieiki_ab: "四季映姫",
			boss_shikieiki: "四季映姬·夜魔仙那度",
			boss_yingzhong: "映冢",
			boss_yingzhong_info: "锁定技。你登场后的第一个回合开始时，你随机获得两个“阴间武将”的全部技能。",
			boss_yingzhong_append: '<span style="font-family:yuanli">四季映姬到阴曹地府<br>——阴(映)到家了！</span>',
			//孟婆:
			boss_mengpo: "孟婆",
			boss_shiyou: "拾忧",
			boss_shiyou_info: "其他角色于弃牌阶段弃置的牌进入弃牌堆前，你可以选择其中任意张花色各不相同的牌获得之。",
			boss_wanghun: "忘魂",
			boss_wanghun_info: "锁定技，你死亡时，令随机两名敌方角色各随机失去一个技能（主公技除外），并在牌堆中加入2张回魂。(回魂只能在挑战模式出现)",
			boss_wangshi: "往事",
			boss_wangshi_info: "锁定技，你存活时，敌方角色的回合开始时，令其于本回合不能使用或打出随机一种类型的牌（基本、锦囊、装备）。",
			boss_wangshi2: "往事",
			boss_wangshi2_info: "",
			//地藏王:
			boss_dizangwang: "地藏王",
			boss_bufo: "不佛",
			boss_bufo_info: "锁定技，你的回合开始时，你对所有距离为1的其他角色造成1点火焰伤害；你受到大于等于2的伤害时，令此伤害-1。",
			boss_wuliang: "无量",
			boss_wuliang_info: "锁定技，你登场时额外摸三张牌；结束阶段开始时，你摸两张牌；你的回合开始时，若你当前体力小于3，则回复至3。",
			boss_dayuan: "大愿",
			boss_dayuan_info: " 当一名角色判定牌最终生效前，你可以指定该判定牌的点数和花色。",
			boss_diting: "谛听",
			boss_diting_info: "锁定技，你的坐骑区被废除，你与别人计算距离时-1，别人与你计算距离时+1；你的坐骑牌均用于重铸。",
			/*
			//等阶
			"boss_sdyl_playerlevel1":"一阶",
			"boss_sdyl_playerlevel1_info":"",
			"boss_sdyl_playerlevel2":"二阶",
			"boss_sdyl_playerlevel2_info":"开局随机使用一张装备牌，起始手牌+1。",
			"boss_sdyl_playerlevel3":"三阶",
			"boss_sdyl_playerlevel3_info":"出杀次数+1，体力上限+1。",
			"boss_sdyl_playerlevel4":"四阶",
			"boss_sdyl_playerlevel4_info":"摸牌阶段多摸一张牌，起始手牌+1。",
			"boss_sdyl_playerlevel5":"重生",
			"boss_sdyl_playerlevel5_info":"限定技，当你处于濒死状态时，你可以弃置所有判定区牌，然后复原你的武将牌，将手牌补充至手牌体力上限（至多为5），将体力回复至体力上限。",
	
			"boss_sdyl_bosslevel1":"一阶",
			"boss_sdyl_bosslevel1_info":"",
			"boss_sdyl_bosslevel2":"二阶",
			"boss_sdyl_bosslevel2_info":"登场时随机使用一张装备牌。",
			"boss_sdyl_bosslevel3":"三阶",
			"boss_sdyl_bosslevel3_info":"出杀次数+1，回合开始获得一张【杀】，体力上限+1，起始手牌+1。",
			"boss_sdyl_bosslevel4":"四阶",
			"boss_sdyl_bosslevel4_info":"摸牌阶段多摸一张牌，手牌上限+1。",
			"boss_sdyl_bosslevel5":"五阶",
			"boss_sdyl_bosslevel5_info":"登场时视为使用一张【南蛮入侵】且此【南蛮入侵】伤害+1。体力上限+1，起始手牌+1。",
			*/
			boss_sunce: "那个男人",
			boss_hunzi: "魂姿",
			boss_hunzi_info: "觉醒技，准备阶段，若你的体力值为1，你减1点体力上限，失去技能〖魂佑〗并获得技能〖英姿〗和〖英魂〗。",
			boss_jiang: "激昂",
			boss_jiang_info: "①锁定技，〖激昂〗不会无效。②每当你使用或打出红色牌时，你可以摸一张牌。若你是因响应其他角色使用或打出的牌，则你获得对方使用或打出的牌。③当有其他角色使用或打出红色牌指定你为目标或响应你后，你可以摸一张牌并获得这些牌。",
			boss_hunyou: "魂佑",
			boss_hunyou_info: "锁定技，你的体力值变化和体力上限变化无效。",
			boss_taoni: "讨逆",
			boss_taoni_info: "锁定技，游戏开始时，每名角色回合开始时或你死亡时，你检查存活角色的合法性。若有角色存在非法行为，则你终止本局游戏。",

			boss_xhuanren: "关卡说明",
			boss_xhuanren_info: "",
			boss_xhuanren_info_boss: "第一关：挑战秦广王<br>第二关：挑战楚江王，宋帝王，五官王，阎罗王中的一个<br>第三关：挑战卞城王，泰山王，都市王，平等王中的一个<br>第四关：挑战转轮王",

			boss_newhuanren: "关卡说明",
			boss_newhuanren_info: "",
			boss_newhuanren_info_boss: "第一关：挑战秦广王<br>第二关：挑战楚江王，宋帝王，五官王，阎罗王中的一个<br>第三关：挑战卞城王，泰山王，都市王，平等王中的一个<br>第四关：挑战转轮王<br>注：孟婆将在每局前三个阶段随机一个阶段登场<br>地藏王登场规则为，50回合内通过第三关，并且在前三关中成功击杀孟婆。<li>选陆逊左慈张春华于吉蒋费孔融自动变孙笨",
			lingsheji: "灵蛇髻",
			lingsheji2: "灵蛇髻",
			shanrangzhaoshu: "禅让诏书",
			xingtianpojunfu: "刑天破军斧",
			noda_axe: "刑天破军斧",
			noda_axe2: "刑天破军斧",
			jinwuluorigong: "金乌落日弓",
			iwasawa_crowbow: "金乌落日弓",
			lingsheji_info: "出牌阶段结束时，你可选择：1.摸一张牌。2.将一张牌置于武将牌上，并于回合结束后获得此牌。",
			shanrangzhaoshu_info: "其他角色于回合外得到牌后，若是其本回合内第一次得到牌，则你可以选择一项：交给其一张牌，或令其交给你一张牌。",
			xingtianpojunfu_info: "当你于出牌阶段内使用牌指定唯一目标后，你可弃置两张牌。若如此做，其本回合内不能使用或打出牌且其防具技能无效。",
			jinwuluorigong_info: "当你于出牌阶段内一次性失去了两张以上的手牌后，你可以弃置一名其他角色等量的牌。",
			TheDayIBecomeAGod: "神杀",
			thedayibecomeagod: "传承",
			thedayibecomeagod_info: "选择一名其他己方角色。若其势力非神，则改为神势力；若其势力为神，则将武将牌翻至正面，回复体力至体力上限，并将手牌摸至5。",
			gubuzifeng: "故步自封",
			gubuzifeng_disable: "故步自封",
			gubuzifeng_info: "出牌阶段，对一名其他角色使用。其的一个随机技能失效直到其下个回合结束。",
			goujiangdesidai: "篝酱的丝带",
			goujiangdesidai_info: "锁定技，若你未拥有技能〖纵丝〗，则你视为拥有技能〖纵丝〗；若你拥有技能〖纵丝〗，则你将此技能改为「出牌阶段限两次」。",
			goujiangdesidai_skill: "纵丝",
			niaobaidaowenha: "鸟白岛文蛤",
			niaobaidaowenha_skill: "鸟白岛文蛤",
			niaobaidaowenha_info: "当你减少1点体力上限后，你可令一名其他角色增加1点体力上限并回复1点体力。",
			niaobaidaowenha_skill_info: "当你减少1点体力上限后，你可令一名其他角色增加1点体力上限并回复1点体力。",
			shenzhixiunvfu: "神之修女服",
			shenzhixiunvfu_info: "没什么实际作用的衣服，仅仅是显得像个神而已。",

			mode_boss_card_config: "挑战卡牌",
			mode_boss_character_config: "挑战武将",

			// 台词部分
			"#boss_modao": "魔道影阵，助我法力。",
			"#boss_lunhui": "轮回反复，此法无解。",
			"#boss_wangsheng": "前生今世，不过皆苦。",
			"#boss_zlfanshi": "敢忤逆我，你是不知道真正的代价！",
			"#boss_zhuanlunwang:die": "你居然走到了最后！",
			"#boss_tiemian": "铁面无私，刚正不阿！",
			"#boss_zhadao": "铡刀之下，皆是恶徒！",
			"#boss_zhuxin": "诛人心魄，灭人心智。",
			"#boss_zhiwang": "罔顾伦常，必受其害！",
			"#boss_gongzheng": "公正以待，显其威法。",
			"#boss_xuechi": "炼狱血池，需要你的奉献。",
			"#boss_wuguanwang:die": "我的法阵，居然被破了！",
			"#boss_fudu": "服药止血，反被毒伤。",
			"#boss_kujiu": "此酒虽苦，酒效不减。",
			"#boss_renao": "惹恼我的代价，你可承受不起！",
			"#boss_heisheng": "想跑？痴人说梦！",
			"#boss_shengfu": "此绳索，是你无法逃脱的噩梦。",
			"#boss_songdiwang_enyuan": "有恩有惠，有伤有报。",
			"#boss_panguan": "世俗杂事，吾皆可判。",
			"#boss_juhun": "勾魂索命，拘魄入狱。",
			"#boss_wangxiang": "还是别望他乡了！",
			"#boss_suozu": "困其身，锁其足。",
			"#boss_abi": "阿鼻地狱，雷火皆来。",
			"#boss_pingdeng": "众生平等，你也难逃此罚！",
			"#boss_shiyou": "忧愁可拾，烦苦可消。",
			"#boss_wanghun": "忘情断爱，心魂可劫。",
			"#boss_wangshi": "红尘往事，再无牵挂。",
			"#boss_remen": "这燥热，真让人烦闷！",
			"#boss_zhifen": "焚身燃躯，日炙火烧！",
			"#boss_huoxing": "火海炼狱，普世之刑！",
			"#boss_bufo": "地狱未空，誓不成佛。",
			"#boss_wuliang": "无量劫难，众生度尽。",
			"#boss_dayuan": "地狱众生，发愿救度。",
			"#boss_diting": "静虑深密，犹如秘藏。",
			"#boss_chujiangwang_weimu": "暗涌掩身，查无踪迹。",
			"#boss_chujiangwang_fankui": "伤我，可是要有付出的！",
			"#boss_bingfeng": "接受这寒冰的封冻吧！",
			"#boss_leifu": "想出此阵，不要妄想！",
			"#boss_leizhou": "术法诅咒，显灵加威。",
			"#boss_leizhu": "你们皆要受到诛连罪行！",
			"#xiuluo1": "准备受死吧！",
			"#xiuluo2": "鼠辈！螳臂当车！",
			"#shenwei1": "萤烛之火，也敢与日月争辉？",
			"#shenwei2": "我不会输给任何人！",
			"#shenji1": "杂鱼们！都去死吧！",
			"#shenji2": "竟想赢我？痴人说梦！",
			"#boss_lvbu2:die": "虎牢关，失守了……",
			"#shenqu1": "别心怀侥幸了，你们不可能赢！",
			"#shenqu2": "虎牢关，我一人镇守足矣！",
			"#jiwu1": "我，是不可战胜的！",
			"#jiwu2": "今天，就让你们感受一下真正的绝望！",
			"#qiangxi_boss_lvbu31": "这么想死，那我就成全你！",
			"#qiangxi_boss_lvbu32": "项上人头，待我来取！",
			"#retieji_boss_lvbu31": "哈哈哈，破绽百出！",
			"#retieji_boss_lvbu32": "我要让这虎牢关下，血流成河！",
			"#xuanfeng_boss_lvbu31": "千钧之势，力贯苍穹！",
			"#xuanfeng_boss_lvbu32": "横扫六合，威震八荒！",
			"#wansha_boss_lvbu31": "蝼蚁，怎容偷生？",
			"#wansha_boss_lvbu32": "沉沦吧，在这无边的恐惧！",
			"#boss_lvbu3:die": "你们的项上人头，我改日再取！",
		},
		get: {
			rawAttitude: function (from, to) {
				var num = to.identity == "zhong" ? 5 : 6;
				return from.side === to.side ? num : -num;
			},
		},
	};
};
