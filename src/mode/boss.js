// @ts-nocheck
import { lib, game, ui, get, ai, _status } from "noname";

export const type = "mode";

/**
 * @type { importModeConfig }
 */
export default {
	name: "boss",
	start: [
		async event => {
			const playback = localStorage.getItem(`${lib.configprefix}playback`);
			if (playback) {
				ui.create.me();
				ui.arena.style.display = "none";
				ui.system.style.display = "none";
				_status.playback = playback;
				localStorage.removeItem(`${lib.configprefix}playback`);
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
				return;
			}
			for (const i in lib.characterPack.mode_boss) {
				lib.character[i] = lib.characterPack.mode_boss[i];
			}
			for (const i in lib.skill) {
				if (lib.skill[i].seatRelated === true) {
					lib.skill[i] = {};
					if (lib.translate[`${i}_info`]) {
						lib.translate[`${i}_info`] = "此模式下不可用";
					}
				}
			}
			lib.translate.restart = "返回";
			lib.init.css(`${lib.assetURL}layout/mode`, "boss");
			if (!_status.banlist) {
				_status.banlist = {};
			}
			game.delay(0.1);
		},
		async event => {
			const bosslist = ui.create.div("#bosslist.hidden");
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
			const onpause = () => {
				ui.window.classList.add("bosspaused");
			};
			const onresume = () => {
				ui.window.classList.remove("bosspaused");
			};
			game.onpause = onpause;
			game.onpause2 = onpause;
			game.onresume = onresume;
			game.onresume2 = onresume;
			ui.create.div(bosslist);

			event.current = null;
			const list = [];
			if (lib.storage.current == null) {
				lib.storage.current = "boss_hundun";
			}
			for (const i in lib.character) {
				const info = lib.character[i];
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
					const player = ui.create.player(bosslist).init(i);
					if (lib.characterPack.mode_boss[i] && get.config(`${i}_boss_config`) == false) {
						player.style.display = "none";
					}
					if (player.hp === 0) {
						player.node.hp.style.display = "none";
					}
					list.push(player);
					player.node.hp.classList.add("text");
					player.node.hp.dataset.condition = "";
					player.node.hp.innerHTML = info[2];
					if (info[2] == Infinity) {
						player.node.hp.innerHTML = "∞";
					}
					player.setIdentity(get.rawName(player.name));
					player.node.identity.dataset.color = info[5];
					// bosslistlinks[cfg]=player;
					player.classList.add("bossplayer");

					if (lib.storage.current === i) {
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
			setTimeout(() => {
				ui.control.style.transitionProperty = "";
			}, 1000);

			ui.window.appendChild(bosslist);

			setTimeout(() => {
				if (event.current) {
					const left = event.current.offsetLeft - (ui.window.offsetWidth - 180) / 2;
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
				game.chooseCharacter(target => {
					if (event.current) {
						event.current.classList.remove("highlight");
					}
					event.current = target;
					game.save("current", target.name);
					target.classList.add("highlight");
					if (_status.bosschoice) {
						let name = target.name;
						if (lib.boss[target.name] && lib.boss[target.name].controlid) {
							name = lib.boss[target.name].controlid;
						}
						if (_status.bosschoice.link === name) {
							return;
						}
						lib.boss[_status.bosschoice.name].control("cancel", _status.bosschoice);
						_status.bosschoice.classList.remove("disabled");
						_status.bosschoice.close();
						delete _status.bosschoice;
					}
					if (lib.boss[target.name] && lib.boss[target.name].control) {
						_status.createControl = ui.control.firstChild;
						_status.bosschoice = lib.boss[target.name].control();
						_status.bosschoice.name = target.name;
						_status.bosschoice.link = lib.boss[target.name].controlid || target.name;
						if (ui.cheat2 && ui.cheat2.dialog === _status.event.dialog) {
							_status.bosschoice.classList.add("disabled");
						}
						delete _status.createControl;
					}
					game.Check.button(_status.event);
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
		},
		async event => {
			let result = event._result;
			game.bossinfo = lib.boss.global;
			for (const i in lib.boss[event.current.name]) {
				game.bossinfo[i] = lib.boss[event.current.name][i];
			}

			setTimeout(() => {
				ui.control.classList.remove("bosslist");
			}, 500);
			const boss = ui.create.player();
			boss.getId();
			game.boss = boss;
			boss.init(event.current.name);
			boss.side = true;
			if (!event.noslide) {
				const rect = event.current.getBoundingClientRect();
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
			for (let i = 0; i < result.links.length; i++) {
				const player = ui.create.player();
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
				for (const i in game.bossinfo.minion) {
					const player = ui.create.player();
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
					const num = parseInt(i);
					if (result.boss) {
						player.dataset.position = num - 1;
					} else if (num === 2) {
						player.dataset.position = 7;
					} else {
						player.dataset.position = num - 3;
					}
					ui.arena.appendChild(player);
					if (boss.bossinginfo) {
						const rect = player.getBoundingClientRect();
						player.style.transform = `translate(${boss.bossinginfo[0] - rect.left - rect.width / 2}px,${boss.bossinginfo[1] - rect.top - rect.height / 2}px) scale(1.1)`;
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
						() => {
							const uiintro = ui.create.dialog("hidden");
							const players = game.players.concat(game.dead);
							for (const player of players) {
								if (player.side === game.me.side && player !== game.me) {
									uiintro.add(get.translation(player));
									const cards = player.getCards("h");
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
					() => {
						const uiintro = ui.create.dialog("hidden");

						uiintro.add("重整");
						const table = ui.create.div(".bosschongzheng");

						let added = false;
						for (const player of game.dead) {
							if (typeof player.storage.boss_chongzheng !== "number") {
								continue;
							}
							added = true;
							const tr = ui.create.div(table);
							let td = ui.create.div(tr);
							td.innerHTML = get.translation(player);
							td = ui.create.div(tr);
							if (player.maxHp > 0) {
								td.innerHTML = `剩余${game.bossinfo.chongzheng - player.storage.boss_chongzheng}回合`;
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
				() => {
					const players = get.players(game.me);
					players.remove(game.boss);
					if (players.length > 1) {
						if (ui.auto.classList.contains("hidden")) {
							game.me.popup("请稍后换人");
							return;
						}
						if (_status.event.isMine()) {
							ui.click.auto();
							setTimeout(() => {
								ui.click.auto();
							}, 500);
						}
						game.modeSwapPlayer(players[1]);
					}
				},
				true
			);
			if (get.config("single_control") || game.me === game.boss) {
				ui.single_swap.style.display = "none";
			}

			ui.arena.appendChild(boss);
			if (boss.bossinginfo) {
				const rect = boss.getBoundingClientRect();
				boss.style.transform = `translate(${boss.bossinginfo[0] - rect.left - rect.width / 2}px,${boss.bossinginfo[1] - rect.top - rect.height / 2}px) scale(1.1)`;
				ui.refresh(boss);
				boss.style.transition = "";
				boss.style.transform = "";
				delete boss.bossinginfo;
				setTimeout(() => {
					boss.node.equips.style.opacity = "";
				}, 500);
			}

			event.bosslist.delete();

			game.arrangePlayers();
			for (const player of game.players) {
				player.node.action.innerHTML = "行动";
			}

			const players = get.players(lib.sort.position);
			const info = [];
			for (const player of players) {
				info.push({
					name: player.name1,
					identity: player.identity,
					position: player.dataset.position,
				});
			}
			_status.videoInited = true;
			info.boss = game.me === game.boss;
			game.addVideo("init", null, info);
			if (game.bossinfo.init) {
				game.bossinfo.init();
			}
			delete lib.boss;
		},
		async event => {
			if (get.config("single_control")) {
				for (const player of game.players) {
					if (player.side === game.me.side) {
						game.addRecentCharacter(player.name);
					}
				}
			} else {
				game.addRecentCharacter(game.me.name);
			}
			event.trigger("gameStart");
			game.gameDraw(game.boss, game.bossinfo.gameDraw || 4);
			game.bossPhaseLoop();
			setTimeout(() => {
				ui.updatehl();
			}, 200);
		},
	],
	element: {
		player: {
			dieAfter() {
				if (this !== game.boss) {
					this.storage.boss_chongzheng = 0;
				}
				if (game.bossinfo.checkResult && game.bossinfo.checkResult(this) === false) {
					return;
				}
				if (
					this === game.boss ||
					!game.hasPlayer(current => {
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
			bingzhu: ["神山识"],
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
			bingzhu: ["篝"],
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
			bingzhu: ["佐藤雏"],
		},
		gubuzifeng: {
			type: "trick",
			fullskin: true,
			modeimage: "boss",
			enable: true,
			filterTarget(card, player, target) {
				return target !== player;
			},
			async content(event, trigger, player) {
				const { target } = event;
				target.addTempSkill("gubuzifeng_disable", { player: "phaseAfter" });
				const skills = target.getSkills(null, false);
				for (let i = 0; i < skills.length; i++) {
					if (get.info(skills[i]).charlotte) {
						skills.splice(i--, 1);
					}
				}
				if (skills.length) {
					target.storage.gubuzifeng_disable.push(skills.randomGet());
					target.disableSkill("gubuzifeng_disable", target.storage.gubuzifeng_disable);
				}
			},
			ai: {
				order: 12,
				result: {
					target(player, target) {
						return -2;
					},
				},
			},
		},
		lingsheji: {
			type: "equip",
			subtype: "equip5",
			skills: ["lingsheji"],
			bingzhu: ["甄姬"],
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
			bingzhu: ["曹丕"],
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
			bingzhu: ["张辽"],
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
			bingzhu: ["甘宁"],
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
			filterTarget(card, player, target) {
				return player === target;
			},
			async content(event, trigger, player) {
				game.countPlayer2(current => {
					current.enableSkill("boss_wanghun");
				});
			},
			ai: {
				basic: {
					order() {
						return 11;
					},
					useful: [3, 1],
					value: 10,
				},
				result: {
					player(player, target) {
						if (player === game.boss) {
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
			filterTarget(card, player, target) {
				return target === player;
			},
			modTarget: true,
			async content(event, trigger, player) {
				const { target } = event;
				const num = Math.min(5, target.maxHp);
				if (target.group === "shen") {
					target.draw(num);
				} else {
					const nh = target.countCards("h");
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
					target(player, target) {
						const num = Math.min(5, target.maxHp);
						if (target.group === "shen") {
							return Math.sqrt(num);
						}
						let nh = target.countCards("h");
						if (target === player && player.hasCards("h", "sadouchengbing")) {
							nh--;
						}
						if (nh < num) {
							return Math.sqrt(num - nh);
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
			filterTarget(card, player, target) {
				return target !== player && target.hasCards("he");
			},
			async content(event, trigger, player) {
				const { target } = event;
				let usedSha = false;
				if (target.hasSha()) {
					const result = await target
						.chooseToUse({
							filterCard: function (card, player, event) {
								return get.name(card) === "sha" && lib.filter.filterCard.apply(this, arguments);
							},
							prompt: `使用一张杀，或交给${get.translation(player)}两张牌`,
						})
						.forResult();
					usedSha = result.bool;
				}
				const num = target.countCards("he");
				if (usedSha || !num) {
					return;
				}
				if (num <= 2) {
					await target.give(target.getCards("he"), player);
					return;
				}
				const result = await target
					.chooseCard({
						position: "he",
						selectCard: 2,
						forced: true,
						prompt: `将两张牌交给${get.translation(player)}`,
					})
					.forResult();
				if (result.bool && result.cards?.length) {
					await target.give(result.cards, player);
				}
			},
			ai: {
				order: 7,
				result: {
					target(player, target) {
						if (target.hasSha() && _status.event.getRand() < 0.5) {
							return 1;
						}
						return -2;
					},
				},
			},
		},
		chiyanzhenhunqin: {
			type: "equip",
			fullskin: true,
			subtype: "equip1",
			bingzhu: ["周瑜"],
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
			bingzhu: ["曹操"],
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
			bingzhu: ["吕布"],
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
			bingzhu: ["刘备"],
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
			bingzhu: ["陆逊"],
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
			async content(event, trigger, player) {
				const { target } = event;
				if (target.group === "shen") {
					target.addSkill("honghuangzhili");
					if (target.hasCards("he")) {
						player.gainPlayerCard({ target: target, position: "he", forced: true });
					}
				} else {
					target.turnOver();
				}
			},
			ai: {
				order: 4,
				value: 10,
				result: {
					target(player, target) {
						if (target.group === "shen") {
							if (target.hasCards("he")) {
								return -2;
							}
							return 0;
						} else {
							if (target.isTurnedOver()) {
								return 4;
							}
							return -3;
						}
					},
				},
			},
		},
		//三首
		boss_sanshou: {
			fullskin: true,
			modeimage: "boss",
			bingzhu: ["张角"],
			type: "equip",
			subtype: "equip2",
			skills: ["sanshou_skill"],
			ai: {
				equipValue: 9,
			},
		},
	},
	characterPack: {
		mode_boss: {
			boss_hundun: {
				sex: "male",
				group: "qun",
				hp: 25,
				skills: ["boss_xiongshou", "boss_wuzang", "boss_xiangde", "boss_yinzei", "boss_yinzei_switch"],
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_qiongqi: {
				sex: "male",
				group: "qun",
				hp: 20,
				maxHp: 25,
				skills: ["boss_xiongshou", "boss_zhue", "boss_futai", "boss_yandu", "boss_yandu_switch"],
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_taotie: {
				sex: "male",
				group: "qun",
				hp: 20,
				skills: ["boss_xiongshou", "boss_tanyu", "boss_cangmu", "boss_jicai", "boss_jicai_switch"],
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_taowu: {
				sex: "male",
				group: "qun",
				hp: 25,
				skills: ["boss_xiongshou", "boss_minwan", "boss_nitai", "boss_luanchang", "boss_luanchang_switch"],
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_zhuyin: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["boss_xiongshou"],
				groupInGuozhan: "qun",
				isHiddenBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},

			boss_xiangliu: {
				sex: "male",
				group: "qun",
				hp: 25,
				skills: ["boss_yaoshou", "boss_duqu", "boss_jiushou", "boss_echou", "boss_echou_switch"],
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_zhuyan: {
				sex: "male",
				group: "qun",
				hp: 25,
				maxHp: 30,
				skills: ["boss_yaoshou", "boss_bingxian", "boss_juyuan", "boss_xushi", "boss_xushi_switch"],
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_bifang: {
				sex: "male",
				group: "qun",
				hp: 25,
				skills: ["boss_yaoshou", "boss_zhaohuo", "boss_honglianx", "boss_yanyu", "boss_yanyu_switch"],
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_yingzhao: {
				sex: "male",
				group: "qun",
				hp: 25,
				skills: ["boss_yaoshou", "boss_fengdong", "boss_xunyou", "boss_sipu", "boss_sipu_switch"],
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},

			boss_qingmushilian: {
				sex: "male",
				group: "",
				hp: 0,
				skills: ["boss_qingmu", "boss_qingmu_intro1", "boss_qingmu_intro2", "boss_qingmu_intro3"],
				isBoss: true,
				extraModeData: "wu",
			},
			boss_qinglong: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["boss_shenyi", "releiji", "boss_qingmu2"],
				groupInGuozhan: "wu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_mushengoumang: {
				sex: "male",
				group: "shen",
				names: "姬|重",
				hp: 5,
				skills: ["boss_shenyi", "boss_buchun", "boss_qingmu3"],
				groupInGuozhan: "wu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_shujing: {
				sex: "female",
				group: "shen",
				hp: 2,
				skills: ["boss_cuidu"],
				groupInGuozhan: "wu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_taihao: {
				sex: "male",
				group: "shen",
				names: "风|伏羲",
				hp: 6,
				skills: ["boss_shenyi", "boss_shenen", "boss_qingyi"],
				groupInGuozhan: "wu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},

			boss_chiyanshilian: {
				sex: "male",
				group: "",
				hp: 0,
				skills: ["boss_chiyan", "boss_chiyan_intro1", "boss_chiyan_intro2", "boss_chiyan_intro3"],
				isBoss: true,
				extraModeData: "zhu",
			},
			boss_zhuque: {
				sex: "female",
				group: "shen",
				hp: 4,
				skills: ["boss_shenyi", "boss_fentian", "boss_chiyan2"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_huoshenzhurong: {
				sex: "male",
				group: "shen",
				names: "姜|重黎",
				hp: 5,
				skills: ["boss_shenyi", "boss_xingxia", "boss_chiyan3"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_yanling: {
				sex: "male",
				group: "shen",
				hp: 4,
				skills: ["boss_huihuo", "boss_furan"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_yandi: {
				sex: "male",
				group: "shen",
				names: "姜|轨",
				hp: 6,
				skills: ["boss_shenyi", "boss_shenen", "boss_chiyi"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},

			boss_baimangshilian: {
				sex: "male",
				group: "",
				hp: 0,
				skills: ["boss_baimang", "boss_baimang_intro1", "boss_baimang_intro2", "boss_baimang_intro3"],
				isBoss: true,
				extraModeData: "qun",
			},
			boss_baihu: {
				sex: "male",
				group: "shen",
				hp: 4,
				skills: ["boss_shenyi", "boss_kuangxiao", "boss_baimang2"],
				groupInGuozhan: "qun",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_jinshenrushou: {
				sex: "male",
				group: "shen",
				names: "嬴|该",
				hp: 5,
				skills: ["boss_shenyi", "boss_xingqiu", "boss_baimang3"],
				groupInGuozhan: "qun",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_mingxingzhu: {
				sex: "female",
				group: "shen",
				hp: 3,
				skills: ["boss_qingzhu", "boss_jiazu", "boss_jiding"],
				groupInGuozhan: "qun",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_shaohao: {
				sex: "male",
				group: "shen",
				names: "嬴|挚",
				hp: 6,
				skills: ["boss_shenyi", "boss_shenen", "boss_baiyi"],
				groupInGuozhan: "qun",
				isHiddenBoss: true,
				isBossAllowed: true,
			},

			boss_xuanlinshilian: {
				sex: "male",
				group: "",
				hp: 0,
				skills: ["boss_xuanlin", "boss_xuanlin_intro1", "boss_xuanlin_intro2", "boss_xuanlin_intro3"],
				isBoss: true,
				extraModeData: "wei",
			},
			boss_xuanwu: {
				sex: "male",
				group: "shen",
				hp: 4,
				skills: ["boss_shenyi", "boss_lingqu", "boss_xuanlin2"],
				groupInGuozhan: "wei",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_shuishengonggong: {
				sex: "male",
				group: "shen",
				names: "姜|共工",
				hp: 5,
				skills: ["boss_shenyi", "boss_juehong", "boss_xuanlin3"],
				groupInGuozhan: "wei",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_shuishenxuanming: {
				sex: "female",
				group: "shen",
				names: "嬴|禺强",
				hp: 5,
				skills: ["boss_shenyi", "boss_zirun", "boss_xuanlin3"],
				groupInGuozhan: "wei",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_zhuanxu: {
				sex: "male",
				group: "shen",
				names: "姬|颛顼",
				hp: 6,
				skills: ["boss_shenyi", "boss_shenen", "boss_zaoyi"],
				groupInGuozhan: "wei",
				isHiddenBoss: true,
				isBossAllowed: true,
			},

			boss_zhuoguiquxie: {
				sex: "male",
				group: "",
				hp: 0,
				skills: ["boss_bianshen", "boss_bianshen_intro1", "boss_bianshen_intro2", "boss_bianshen_intro3", "boss_bianshen_intro4"],
				isBoss: true,
				extraModeData: "shu",
			},
			boss_nianshou_heti: {
				sex: "male",
				group: "shen",
				hp: 12,
				skills: ["boss_nianrui", "boss_mengtai", "boss_nbianshen", "boss_nbianshenx"],
				groupInGuozhan: "shu",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "shu",
			},
			boss_nianshou_jingjue: {
				sex: "male",
				group: "shen",
				hp: 12,
				skills: ["boss_nianrui", "boss_mengtai", "boss_jingjue", "boss_nbianshen"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
				extraModeData: "shu",
			},
			boss_nianshou_renxing: {
				sex: "male",
				group: "shen",
				hp: 12,
				skills: ["boss_nianrui", "boss_mengtai", "boss_renxing", "boss_nbianshen"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
				extraModeData: "shu",
			},
			boss_nianshou_ruizhi: {
				sex: "male",
				group: "shen",
				hp: 12,
				skills: ["boss_nianrui", "boss_mengtai", "boss_ruizhi", "boss_nbianshen"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
				extraModeData: "shu",
			},
			boss_nianshou_baonu: {
				sex: "male",
				group: "shen",
				hp: 12,
				skills: ["boss_nianrui", "boss_mengtai", "boss_nbaonu", "boss_shouyi", "boss_nbianshen"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
				extraModeData: "shu",
			},

			boss_baiwuchang: {
				sex: "male",
				group: "shen",
				names: "谢|必安",
				hp: 9,
				skills: ["boss_baolian", "boss_qiangzheng", "boss_zuijiu", "juece", "boss_bianshen4"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_heiwuchang: {
				sex: "male",
				group: "shen",
				names: "范|无救",
				hp: 9,
				skills: ["boss_guiji", "boss_taiping", "boss_suoming", "boss_xixing", "boss_bianshen4"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_luocha: {
				sex: "female",
				group: "shen",
				hp: 12,
				skills: ["boss_modao", "boss_yushou", "yizhong", "boss_moyany"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_yecha: {
				sex: "male",
				group: "shen",
				hp: 11,
				skills: ["boss_modao", "boss_mojian", "bazhen", "boss_danshu"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_niutou: {
				sex: "male",
				group: "shen",
				hp: 7,
				skills: ["boss_baolian", "niepan", "boss_manjia", "boss_xiaoshou", "boss_bianshen3"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_mamian: {
				sex: "male",
				group: "shen",
				hp: 6,
				skills: ["boss_guiji", "fankui", "boss_lianyu", "juece", "boss_bianshen3"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_chi: {
				sex: "male",
				group: "shen",
				hp: 5,
				skills: ["boss_guimei", "boss_didong", "boss_shanbeng", "boss_bianshen2"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_mo: {
				sex: "female",
				group: "shen",
				hp: 5,
				skills: ["boss_guimei", "enyuan", "boss_beiming", "boss_bianshen2"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_wang: {
				sex: "male",
				group: "shen",
				hp: 5,
				skills: ["boss_guimei", "boss_luolei", "huilei", "boss_bianshen2"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_liang: {
				sex: "female",
				group: "shen",
				hp: 5,
				skills: ["boss_guimei", "boss_guihuo", "boss_minbao", "boss_bianshen2"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},

			boss_qinguangwang: {
				sex: "male",
				group: "qun",
				hp: 3,
				skills: ["boss_panguan", "boss_juhun", "boss_wangxiang", "boss_newhuanren"],
				names: "蒋|歆",
				groupInGuozhan: "shu",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "shu",
			},
			boss_chujiangwang: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["weimu", "refankui", "boss_bingfeng"],
				names: "厉|温",
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_songdiwang: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["boss_heisheng", "boss_shengfu", "enyuan"],
				names: "余|懃",
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_wuguanwang: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["boss_zhiwang", "boss_gongzheng", "boss_xuechi"],
				names: "吕|岱",
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_yanluowang: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["boss_tiemian", "boss_zhadao", "boss_zhuxin"],
				names: "包|拯",
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_bianchengwang: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["boss_leizhou", "boss_leifu", "boss_leizhu"],
				names: "毕|元宾",
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_taishanwang: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["boss_fudu", "boss_kujiu", "boss_renao"],
				names: "董|和",
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_dushiwang: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["boss_remen", "boss_zhifen", "boss_huoxing"],
				names: "黄|中庸",
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_pingdengwang: {
				sex: "male",
				group: "qun",
				hp: 4,
				skills: ["boss_suozu", "boss_abi", "boss_pingdeng"],
				names: "陆|游",
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_zhuanlunwang: {
				sex: "male",
				group: "qun",
				hp: 6,
				skills: ["boss_modao", "boss_lunhui", "boss_wangsheng", "boss_zlfanshi"],
				names: "薛|礼",
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_mengpo: {
				sex: "female",
				group: "qun",
				names: "孟|姜女",
				hp: 3,
				skills: ["boss_shiyou", "boss_wanghun", "boss_wangshi"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_dizangwang: {
				sex: "male",
				group: "qun",
				names: "金|乔觉",
				hp: 8,
				skills: ["boss_bufo", "boss_wuliang", "boss_dayuan", "boss_diting"],
				groupInGuozhan: "shu",
				isHiddenBoss: true,
				isBossAllowed: true,
			},
			boss_shikieiki: {
				sex: "female",
				group: "qun",
				hp: 8,
				skills: ["boss_yingzhong"],
				names: "夜魔仙那度|四季映姬",
				groupInGuozhan: "qun",
				isBoss: true,
				isHiddenBoss: false,
				isBossAllowed: true,
			},

			boss_lvbu1: {
				sex: "male",
				group: "shen",
				hp: 8,
				skills: ["mashu", "wushuang", "boss_baonu", "boss_jingjia", "boss_aozhan"],
				names: "吕|布",
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_lvbu2: {
				sex: "male",
				group: "shen",
				hp: 6,
				skills: ["mashu", "wushuang", "xiuluo", "shenwei", "shenji"],
				names: "吕|布",
				groupInGuozhan: "qun",
				isHiddenBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_lvbu3: {
				sex: "male",
				group: "shen",
				hp: 6,
				skills: ["wushuang", "shenqu", "jiwu"],
				names: "吕|布",
				groupInGuozhan: "qun",
				isHiddenBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},

			boss_caocao: {
				sex: "male",
				group: "shen",
				hp: 12,
				skills: ["boss_guixin", "xiongcai"],
				names: "曹|操",
				groupInGuozhan: "wei",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "wei",
			},
			boss_guojia: {
				sex: "male",
				group: "shen",
				hp: 4,
				skills: ["tiandu", "boss_guimou", "boss_yuance", "boss_qizuo"],
				names: "郭|嘉",
				groupInGuozhan: "wei",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "zhu",
			},
			boss_zhangchunhua: {
				sex: "female",
				group: "shen",
				hp: 4,
				skills: ["jueqing", "boss_wuxin", "shangshix"],
				names: "张|春华",
				groupInGuozhan: "wei",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "wei",
			},
			boss_zhenji: {
				sex: "female",
				group: "shen",
				hp: 4,
				skills: ["tashui", "lingbo", "jiaoxia", "fanghua"],
				names: "甄|宓",
				groupInGuozhan: "wei",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "wei",
			},

			boss_liubei: {
				sex: "male",
				group: "shen",
				hp: 8,
				skills: ["xiaoxiong", "boss_zhangwu"],
				names: "刘|备",
				groupInGuozhan: "shu",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_zhugeliang: {
				sex: "male",
				group: "shen",
				hp: Infinity,
				skills: ["xiangxing", "yueyin", "fengqi", "gaiming"],
				names: "诸葛|亮",
				groupInGuozhan: "shu",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_huangyueying: {
				sex: "female",
				group: "shen",
				hp: 4,
				skills: ["boss_gongshen", "boss_jizhi", "qicai", "boss_guiyin"],
				names: "黄|月英",
				groupInGuozhan: "shu",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "wei",
			},
			boss_pangtong: {
				sex: "male",
				group: "shen",
				hp: 4,
				skills: ["boss_tianyu", "qiwu", "niepan", "boss_yuhuo"],
				names: "庞|统",
				groupInGuozhan: "shu",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "zhu",
			},

			boss_zhouyu: {
				sex: "male",
				group: "shen",
				hp: 6,
				skills: ["huoshen", "boss_honglian", "boss_xianyin"],
				names: "周|瑜",
				groupInGuozhan: "wu",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "zhu",
			},

			boss_caiwenji: {
				sex: "female",
				group: "shen",
				hp: 4,
				skills: ["beige", "boss_hujia", "boss_guihan"],
				names: "蔡|琰",
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "wei",
			},
			boss_zhangjiao: {
				sex: "male",
				group: "shen",
				hp: 8,
				skills: ["boss_leiji", "tiandao", "jidian"],
				names: "张|角",
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "shu",
			},
			boss_zuoci: {
				sex: "male",
				group: "shen",
				hp: 0,
				skills: ["huanhua"],
				names: "左|慈",
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "shu",
			},

			boss_diaochan: {
				sex: "female",
				group: "shen",
				names: "貂|蝉",
				hp: 4,
				skills: ["fengwu", "yunshen", "lianji", "boss_wange", "yuehun"],
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "qun",
			},
			boss_huatuo: {
				sex: "male",
				group: "shen",
				hp: 6,
				skills: ["chulao", "mazui", "boss_shengshou", "guizhen", "wuqin"],
				names: "华|佗",
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "wu",
			},
			boss_dongzhuo: {
				sex: "male",
				group: "shen",
				hp: 20,
				skills: ["jiuchi", "boss_qiangzheng", "boss_baolin"],
				names: "董|卓",
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				extraModeData: "shu",
			},

			boss_sunce: {
				sex: "male",
				group: "shen",
				hp: 1,
				maxHp: 8,
				skills: ["boss_jiang", "boss_hunzi", "boss_hunyou", "boss_taoni"],
				names: "孙|策",
				groupInGuozhan: "qun",
				isBoss: true,
				isBossAllowed: true,
				initFilters: ["noZhuHp", "noZhuSkill"],
				dieAudios: ["sunce"],
				extraModeData: "wu",
			},

			boss_nianshou: {
				sex: "male",
				group: "shen",
				hp: Infinity,
				skills: ["boss_nianrui", "boss_qixiang", "boss_damagecount"],
				isBoss: true,
				extraModeData: "shu",
			},
		},
	},
	cardPack: {
		mode_boss: ["honghuangzhili", "sadouchengbing", "yihuajiemu", "chiyanzhenhunqin", "juechenjinge", "xiuluolianyuji", "longfenghemingjian", "qicaishenlu", "hongmianbaihuapao", "boss_mengpohuihun", "lingsheji", "shanrangzhaoshu", "jinwuluorigong", "xingtianpojunfu", "gubuzifeng", "boss_sanshou"],
	},
	init() {
		for (const i in lib.characterPack.mode_boss) {
			if (!lib.characterPack.mode_boss[i].names) {
				lib.characterPack.mode_boss[i].names = "null|null";
			}
			if (lib.characterPack.mode_boss[i].isHiddenBoss) {
				continue;
			}
			lib.mode.boss.config[`${i}_boss_config`] = {
				name: get.translation(i),
				init: true,
				unfrequent: true,
			};
		}
	},
	characterSubstitute: {
		boss_mingxingzhu: [["boss_mingxingzhu_shadow", ["img:image/mode/boss/character/boss_mingxingzhu_shadow.jpg"]]],
	},
	game: {
		reserveDead: true,
		addBossFellow(position, name) {
			const fellow = game.addFellow(position, name, "zoominanim");
			fellow.directgain(get.cards(4));
			fellow.side = true;
			fellow.identity = "zhong";
			fellow.setIdentity("zhong");
			game.addVideo("setIdentity", fellow, "zhong");
		},
		changeBoss(name, player) {
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
			const boss = ui.create.player();
			boss.getId();
			boss.init(name);
			boss.side = true;
			game.addVideo("bossSwap", player, `${game.boss ? "_" : ""}${boss.name}`);
			boss.dataset.position = player.dataset.position;
			if (game.me === player) {
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
		checkResult() {
			if (game.boss === game.me) {
				game.over(game.boss.isAlive());
			} else {
				game.over(!game.boss.isAlive());
			}
		},
		getVideoName() {
			let str = get.translation(game.me.name);
			if (game.me.name2) {
				str += `/${get.translation(game.me.name2)}`;
			}
			let str2 = "挑战";
			if (game.me !== game.boss) {
				str2 += ` - ${get.translation(game.boss)}`;
			}
			const name = [str, str2];
			return name;
		},
		bossPhaseLoop() {
			const next = game.createEvent("phaseLoop");
			//确定首次行动的角色
			if (game.bossinfo.loopFirst) {
				next.player = game.bossinfo.loopFirst();
			} else {
				next.player = game.boss;
			}
			_status.looped = true;
			next.setContent([
				async (event, trigger, player) => {
					if (player.chongzheng) {
						player.chongzheng = false;
					} else if (player.isDead()) {
						//增加重整计数，以及复活角色
						if (player.hp < 0) {
							player.hp = 0;
						}
						player.storage.boss_chongzheng++;
						if (player.maxHp > 0 && game.bossinfo.chongzheng) {
							if (player.hp < player.maxHp) {
								player.hp++;
							} else if (player.countCards("h") < 4) {
								const card = get.cards()[0];
								const sort = lib.config.sort_card(card);
								const position = sort > 0 ? player.node.handcards1 : player.node.handcards2;
								card.fix();
								card.addTempClass("start");
								position.insertBefore(card, position.firstChild);
							}
							player.update();
							if (player.storage.boss_chongzheng >= game.bossinfo.chongzheng) {
								player.revive(player.hp);
							}
						}
						if (game.bossinfo.loopType === 2) {
							game.boss.chongzheng = true;
						}
					} else {
						//执行回合
						if (player.identity === "zhu" && game.boss !== player) {
							player = game.boss;
						}
						const phase = event.player.phase();
						event.next.remove(phase);
						let isRoundEnd = false;
						if (lib.onround.every(i => i(phase, event.player))) {
							isRoundEnd = _status.roundSkipped;
							if (_status.isRoundFilter) {
								isRoundEnd = _status.isRoundFilter(phase, event.player);
							} else if (_status.seatNumSettled) {
								const seatNum = event.player.getSeatNum();
								if (seatNum !== 0) {
									if (get.itemtype(_status.lastPhasedPlayer) !== "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
										isRoundEnd = true;
									}
								}
							} else if (event.player === _status.roundStart) {
								isRoundEnd = true;
							}
							if (isRoundEnd && _status.globalHistory.some(i => i.isRound)) {
								game.log();
								await event.trigger("roundEnd");
							}
						}
						event.next.push(phase);
						await phase;
					}
					//触发phaseOver时机
					await event.trigger("phaseOver");
				},
				async (event, trigger, player) => {
					if (game.bossinfo.loopType === 2) {
						//最强神话那种回合执行顺序，boss一个回合，玩家再按顺序执行一个回合
						_status.roundStart = true;
						if (event.player === game.boss) {
							if (!_status.last || _status.last.nextSeat === game.boss) {
								event.player = game.boss.nextSeat;
								//如果当前角色为boss且下一个角色从头开始才触发每轮结束时的时机
								delete _status.roundStart;
							} else {
								event.player = _status.last.nextSeat;
							}
						} else {
							_status.last = player;
							event.player = game.boss;
						}
					} else {
						//这个是正常的执行顺序，就按座位顺序算
						event.player = event.player.nextSeat;
					}
					event.goto(0);
				},
			]);
		},
		onSwapControl() {
			if (game.me === game.boss) {
				return;
			}
			game.addVideo("onSwapControl");
			const name = game.me.name;
			if (ui.fakeme && ui.fakeme.current !== name) {
				ui.fakeme.current = name;
				if (ui.versushighlight && ui.versushighlight !== game.me) {
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
		modeSwapPlayer(player) {
			const bool = game.me === game.boss || player === game.boss;
			game.swapControl(player);
			game.onSwapControl();
			if (!bool) {
				return;
			}
			if (game.me === game.boss) {
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
		chooseCharacter(func) {
			const next = game.createEvent("chooseCharacter");
			next.showConfig = true;
			next.customreplacetarget = func;
			next.ai = (player, list) => {
				if (get.config("double_character")) {
					player.init(list[0], list[1]);
				} else {
					player.init(list[0]);
				}
			};
			next.setContent([
				async event => {
					const list = [];
					event.list = list;
					for (const i in lib.character) {
						if (lib.character[i].isMinskin) {
							continue;
						}
						if (lib.character[i].isBoss) {
							continue;
						}
						if (lib.character[i].isHiddenBoss) {
							continue;
						}
						if (lib.character[i].isAiForbidden) {
							continue;
						}
						if (lib.config.forbidboss.includes(i)) {
							continue;
						}
						if (lib.filter.characterDisabled(i)) {
							continue;
						}
						list.push(i);
					}
					list.randomSort();
					const dialog = ui.create.dialog("选择参战角色", "hidden");
					dialog.classList.add("fixed");
					ui.window.appendChild(dialog);
					dialog.classList.add("bosscharacter");
					dialog.classList.add("modeshortcutpause");
					dialog.classList.add("withbg");
					// dialog.add('0/3');
					dialog.add([list.slice(0, 20), "character"]);
					dialog.noopen = true;
					const next = game.me
						.chooseButton({
							dialog,
							forced: true,
							selectButton: [3, 3],
							filterButton: button => {
								const { current } = get.event().getParent("game");
								if (current) {
									const { name } = current;
									const banrule = _status.banlist[name];
									if (!banrule) {
										return true;
									}
									const { link } = button;
									if (Array.isArray(banrule)) {
										if (banrule.includes(link)) {
											return false;
										}
									} else if (typeof banrule === "function") {
										return banrule(button);
									}
								}
								return true;
							},
						})
						.set("onfree", true);
					next._triggered = null;
					next.custom.replace.target = event.customreplacetarget;
					// next.custom.add.button=function(){
					//		if(ui.cheat2&&ui.cheat2.backup) return;
					//		_status.event.dialog.content.childNodes[1].innerHTML=
					//		ui.selected.buttons.length+'/3';
					// };
					event.changeDialog = () => {
						if (ui.cheat2 && ui.cheat2.dialog === _status.event.dialog) {
							return;
						}
						if (game.changeCoin) {
							game.changeCoin(-3);
						}
						list.randomSort();

						const buttons = ui.create.div(".buttons");
						const node = _status.event.dialog.buttons[0].parentNode;
						_status.event.dialog.buttons = ui.create.buttons(list.slice(0, 20), "character", buttons);
						_status.event.dialog.content.insertBefore(buttons, node);
						buttons.addTempClass("start");
						node.remove();

						game.uncheck();
						game.check();
					};
					ui.create.cheat = () => {
						_status.createControl = ui.cheat2 || event.asboss;
						ui.cheat = ui.create.control("更换", event.changeDialog);
						delete _status.createControl;
					};
					const createCharacterDialog = () => {
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
					ui.create.cheat2 = () => {
						_status.createControl = event.asboss;
						ui.cheat2 = ui.create.control("自由选将", function () {
							if (this.dialog === _status.event.dialog) {
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
					if (!ui.cheat && get.config("change_choice")) {
						ui.create.cheat();
					}
					if (!ui.cheat2 && get.config("free_choose")) {
						ui.create.cheat2();
					}

					event.asboss = ui.create.control("应战", () => {
						event.boss = true;
						event.enemy = [];
						for (const button of ui.selected.buttons) {
							event.enemy.push(button.link);
							event.list.remove(button.link);
						}
						while (event.enemy.length < 3) {
							let name = event.list
								.filter(name => {
									const { current } = get.event().getParent("game");
									if (!current) {
										return true;
									}
									const banrule = _status.banlist[current?.name];
									if (!banrule) {
										return true;
									}
									if (Array.isArray(banrule)) {
										if (banrule.includes(name)) {
											return false;
										}
									} else if (typeof banrule === "function") {
										return banrule({ link: name });
									}
									return true;
								})
								.randomRemove();
							if (lib.boss[lib.storage.current] && lib.boss[lib.storage.current].randchoice) {
								name = lib.boss[lib.storage.current].randchoice(name, event.enemy);
							}
							if (name) {
								event.enemy.push(name);
							} else {
								break;
							}
						}
						game.uncheck();
						if (ui.confirm) {
							ui.confirm.close();
						}
						game.resume();
					});
				},
				async event => {
					const result = event._result;
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
				},
			]);
			return next;
		},
	},
	boss: {
		boss_qiongqi: {
			chongzheng: 0,
			loopFirst() {
				return game.boss.nextSeat.nextSeat;
			},
			gameDraw(player) {
				return player === game.boss ? 8 : 4;
			},
			minion: {
				2: "boss_zhuyin",
				8: "boss_zhuyin",
			},
			randchoice() {
				return lib.boss.boss_taowu.randchoice.apply(this, arguments);
			},
			controlid: "shenwuzaishi",
			control() {
				return lib.boss.boss_taowu.control.apply(this, arguments);
			},
			init() {
				return lib.boss.boss_taowu.init.apply(this, arguments);
			},
		},
		boss_xiangliu: {
			chongzheng: 0,
			loopFirst() {
				return game.boss.nextSeat.nextSeat;
			},
			gameDraw(player) {
				return player === game.boss ? 8 : 4;
			},
			minion: {
				2: "boss_zhuyin",
				8: "boss_zhuyin",
			},
			randchoice() {
				return lib.boss.boss_taowu.randchoice.apply(this, arguments);
			},
			controlid: "shenwuzaishi",
			control() {
				return lib.boss.boss_taowu.control.apply(this, arguments);
			},
			init() {
				return lib.boss.boss_taowu.init.apply(this, arguments);
			},
		},
		boss_zhuyan: {
			chongzheng: 0,
			loopFirst() {
				return game.boss.nextSeat.nextSeat;
			},
			gameDraw(player) {
				return player === game.boss ? 8 : 4;
			},
			minion: {
				2: "boss_zhuyin",
				8: "boss_zhuyin",
			},
			randchoice() {
				return lib.boss.boss_taowu.randchoice.apply(this, arguments);
			},
			controlid: "shenwuzaishi",
			control() {
				return lib.boss.boss_taowu.control.apply(this, arguments);
			},
			init() {
				return lib.boss.boss_taowu.init.apply(this, arguments);
			},
		},
		boss_bifang: {
			chongzheng: 0,
			loopFirst() {
				return game.boss.nextSeat.nextSeat;
			},
			gameDraw(player) {
				return player === game.boss ? 8 : 4;
			},
			minion: {
				2: "boss_zhuyin",
				8: "boss_zhuyin",
			},
			randchoice() {
				return lib.boss.boss_taowu.randchoice.apply(this, arguments);
			},
			controlid: "shenwuzaishi",
			control() {
				return lib.boss.boss_taowu.control.apply(this, arguments);
			},
			init() {
				return lib.boss.boss_taowu.init.apply(this, arguments);
			},
		},
		boss_yingzhao: {
			chongzheng: 0,
			loopFirst() {
				return game.boss.nextSeat.nextSeat;
			},
			gameDraw(player) {
				return player === game.boss ? 8 : 4;
			},
			minion: {
				2: "boss_zhuyin",
				8: "boss_zhuyin",
			},
			randchoice() {
				return lib.boss.boss_taowu.randchoice.apply(this, arguments);
			},
			controlid: "shenwuzaishi",
			control() {
				return lib.boss.boss_taowu.control.apply(this, arguments);
			},
			init() {
				return lib.boss.boss_taowu.init.apply(this, arguments);
			},
		},
		boss_hundun: {
			chongzheng: 0,
			loopFirst() {
				return game.boss.nextSeat.nextSeat;
			},
			gameDraw(player) {
				return player === game.boss ? 8 : 4;
			},
			minion: {
				2: "boss_zhuyin",
				8: "boss_zhuyin",
			},
			randchoice() {
				return lib.boss.boss_taowu.randchoice.apply(this, arguments);
			},
			controlid: "shenwuzaishi",
			control() {
				return lib.boss.boss_taowu.control.apply(this, arguments);
			},
			init() {
				return lib.boss.boss_taowu.init.apply(this, arguments);
			},
		},
		boss_taotie: {
			chongzheng: 0,
			loopFirst() {
				return game.boss.nextSeat.nextSeat;
			},
			gameDraw(player) {
				return player === game.boss ? 8 : 4;
			},
			minion: {
				2: "boss_zhuyin",
				8: "boss_zhuyin",
			},
			randchoice() {
				return lib.boss.boss_taowu.randchoice.apply(this, arguments);
			},
			controlid: "shenwuzaishi",
			control() {
				return lib.boss.boss_taowu.control.apply(this, arguments);
			},
			init() {
				return lib.boss.boss_taowu.init.apply(this, arguments);
			},
		},
		boss_taowu: {
			chongzheng: 0,
			loopFirst() {
				return game.boss.nextSeat.nextSeat;
			},
			gameDraw(player) {
				return player === game.boss ? 8 : 4;
			},
			minion: {
				2: "boss_zhuyin",
				8: "boss_zhuyin",
			},
			randchoice(name, list) {
				if (Math.random() > 1 / 3) {
					return name;
				} else {
					const arr = ["shen_caocao", "shen_simayi", "shen_guanyu", "shen_zhugeliang", "shen_zhaoyun", "shen_zhouyu", "shen_lvmeng", "shen_lvbu", "shen_liubei", "shen_luxun", "shen_ganning", "ol_zhangliao", "shen_zhenji", "shen_caopi", "key_kagari", "key_shiki", "db_key_hina", "shen_sunquan", "junk_zhangjiao"];
					arr.removeArray(list);
					return arr.randomGet();
				}
			},
			controlid: "shenwuzaishi",
			control(type, control) {
				if (type === "cancel") {
					if (!control.classList.contains("glow")) {
						return;
					}
					const dialog = control.dialog;
					dialog.content.removeChild(control.backup1);
					dialog.buttons.removeArray(control.backup2);

					game.uncheck();
					game.check();
				} else {
					control = ui.create.control("神将", function () {
						if (ui.cheat2 && ui.cheat2.dialog === _status.event.dialog) {
							return;
						}
						const dialog = _status.event.dialog;
						this.dialog = dialog;
						if (this.classList.contains("glow")) {
							this.backup1.remove();
							dialog.buttons.removeArray(this.backup2);
						} else {
							const links = [];
							for (const button of dialog.buttons) {
								links.push(button.link);
							}
							for (const button of this.backup2) {
								if (links.includes(button.link)) {
									button.style.display = "none";
								} else {
									button.style.display = "";
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
					control.backup2 = ui.create.buttons(["shen_caocao", "shen_simayi", "shen_guanyu", "shen_zhugeliang", "shen_zhaoyun", "shen_zhouyu", "shen_lvmeng", "shen_lvbu", "shen_liubei", "shen_luxun", "shen_ganning", "ol_zhangliao", "shen_zhenji", "shen_caopi", "key_kagari", "key_shiki", "db_key_hina", "shen_sunquan", "junk_zhangjiao"], "character", control.backup1);
					return control;
				}
			},
			init() {
				game.addGlobalSkill("boss_shenwuzaishi");
				game.addGlobalSkill("TheDayIBecomeAGod");
				game.addGlobalSkill("thedayibecomeagod");
				const list = ["lebu", "bingliang"];
				lib.startEquipMap ??= new Map();
				const defaultMap = [
					["关羽", { replace: "qinglong", card: ["guilongzhanyuedao", "spade", 5] }],
					["诸葛亮", { replace: "bagua", card: ["qimenbagua", "spade", 2] }],
					["周瑜", { replace: "zhuque", card: ["chiyanzhenhunqin", "diamond", 1] }],
					["曹操", { replace: "jueying", card: ["juechenjinge", "spade", 5] }],
					["赵云", { replace: "qinggang", card: ["chixueqingfeng", "spade", 6] }],
					["吕布", { replace: "fangtian", card: ["xiuluolianyuji", "diamond", 12] }],
					["司马懿", { card: ["xuwangzhimian", "diamond", 4] }],
					["刘备", { replace: "fangtian", card: ["longfenghemingjian", "spade", 2] }],
					["吕蒙", { card: ["guofengyupao", "diamond", 3] }],
					["陆逊", { card: ["qicaishenlu", "diamond", 3] }],
					["甘宁", { replace: "qilin", card: ["jinwuluorigong", "heart", 5] }],
					["张辽", { replace: "guanshi", card: ["xingtianpojunfu", "diamond", 5] }],
					["甄姬", { card: ["lingsheji", "club", 12] }],
					["曹丕", { card: ["shanrangzhaoshu", "spade", 13] }],
					["孙权", { card: ["changandajian_equip4", "heart", 10] }],
					["张角", { card: ["boss_sanshou", "diamond", 12] }],
					["野田", { replace: "guanshi", card: ["xingtianpojunfu", "diamond", 5] }],
					["岩泽雅美", { replace: "qilin", card: ["jinwuluorigong", "heart", 5] }],
					["篝", { card: ["goujiangdesidai", "heart", 1] }],
					["神山识", { card: ["niaobaidaowenha", "diamond", 13] }],
					["佐藤雏", { card: ["shenzhixiunvfu", "spade", 13] }],
				];
				for (const [name, info] of defaultMap) {
					lib.startEquipMap.set(name, info);
				}
				for (const current of game.players) {
					const name = get
						.characterSurname(current.name1)
						.map(names => names.join(""))
						.join("-");
					if (lib.startEquipMap.has(name)) {
						const info = lib.startEquipMap.get(name);
						if (info.replace) {
							list.add(info.replace);
						}
						if (info.card) {
							current.equip(game.createCard2(...info.card));
							lib.inpile.add(info.card[0]);
						}
					}
				}
				lib.inpile.remove("wuzhong");
				lib.inpile.remove("jiedao");
				lib.inpile.add("sadouchengbing");
				lib.inpile.add("yihuajiemu");
				lib.inpile.add("gubuzifeng");
				for (let i = 0; i < ui.cardPile.childElementCount; i++) {
					const node = ui.cardPile.childNodes[i];
					if (node.name === "wuzhong") {
						node.init([node.suit, node.number, "sadouchengbing"]);
					} else if (node.name === "jiedao") {
						node.init([node.suit, node.number, "yihuajiemu"]);
					} else if (list.includes(node.name)) {
						lib.inpile.remove(node.name);
						node.remove();
					}
				}
				const cards = [game.createCard2("gubuzifeng", "club", 5), game.createCard2("gubuzifeng", "diamond", 7)];
				while (cards.length > 0) {
					ui.cardPile.insertBefore(cards.shift(), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childElementCount - 1)]);
				}
				lib.inpile.sort(lib.sort.card);
			},
		},
		boss_chiyanshilian: {
			chongzheng: 0,
			loopType: 2,
			checkResult(player) {
				if (player === game.boss && game.boss.name !== "boss_yandi") {
					return false;
				}
			},
			init() {
				_status.additionalReward = () => {
					return 500;
				};
				lib.inpile.remove("shandian");
				lib.inpile.remove("huoshan");
				lib.inpile.remove("hongshui");
				lib.inpile.remove("fulei");
				lib.inpile.add("honghuangzhili");
				lib.inpile.sort(lib.sort.card);
				for (let i = 0; i < ui.cardPile.childElementCount; i++) {
					const node = ui.cardPile.childNodes[i];
					if (node.name === "shandian") {
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
			checkResult(player) {
				if (player === game.boss && game.boss.name !== "boss_taihao") {
					return false;
				}
			},
			init() {
				lib.boss.boss_chiyanshilian.init();
			},
		},
		boss_baimangshilian: {
			chongzheng: 0,
			loopType: 2,
			checkResult(player) {
				if (player === game.boss && game.boss.name !== "boss_shaohao") {
					return false;
				}
			},
			init() {
				lib.boss.boss_chiyanshilian.init();
			},
		},
		boss_xuanlinshilian: {
			chongzheng: 0,
			loopType: 2,
			checkResult(player) {
				if (player === game.boss && game.boss.name !== "boss_zhuanxu") {
					return false;
				}
			},
			init() {
				lib.boss.boss_chiyanshilian.init();
			},
		},
		boss_zhuoguiquxie: {
			chongzheng: 0,
			checkResult(player) {
				if (player === game.boss && game.boss.name !== "boss_yecha" && game.boss.name !== "boss_luocha") {
					return false;
				}
			},
			init() {
				_status.additionalReward = () => {
					return 500;
				};
			},
		},
		boss_qinguangwang: {
			chongzheng: 0,
			checkResult(player) {
				if (player === game.boss && (!_status.shidianyanluo_level || _status.shidianyanluo_level < 3)) {
					return false;
				}
			},
			init() {
				_status.shidianyanluo_level = 0;
				lib.inpile.remove("muniu");
				for (let i = 0; i < ui.cardPile.childElementCount; i++) {
					if (ui.cardPile.childNodes[i].name === "muniu") {
						ui.cardPile.childNodes[i].remove();
						break;
					}
				}
				_status.additionalReward = () => {
					return 500;
				};
			},
		},
		boss_nianshou: {
			chongzheng: 0,
			init() {
				game.boss.node.action.classList.add("freecolor");
				game.boss.node.action.style.opacity = 1;
				game.boss.node.action.style.letterSpacing = "4px";
				game.boss.node.action.style.marginRight = 0;
				game.boss.node.action.style.fontFamily = "huangcao";
				game.boss.node.action.innerHTML = "";
				_status.additionalReward = () => {
					return Math.round(Math.pow(_status.damageCount, 2.4)) * 2;
				};
				let time = 360;
				const interval = setInterval(() => {
					if (_status.over) {
						clearInterval(interval);
						return;
					}
					let sec = time % 60;
					if (sec < 10) {
						sec = `0${sec}`;
					}
					game.boss.node.action.innerHTML = `${Math.floor(time / 60)}:${sec}`;
					if (time <= 0) {
						delete _status.additionalReward;
						if (typeof _status.coin === "number") {
							if (game.me === game.boss) {
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
			gameDraw(player) {
				if (player === game.boss) {
					return 8;
				}
				if (player === game.boss.previous) {
					return 5;
				}
				return 4;
			},
			loopFirst() {
				return game.boss.nextSeat;
			},
			init() {
				lib.inpile.remove("wugu");
				lib.inpile.remove("taoyuan");
				lib.inpile.remove("bagua");
				lib.inpile.remove("tengjia");
				lib.inpile.remove("fangtian");
				lib.inpile.remove("muniu");
				lib.inpile.addArray(["wushuangfangtianji", "shufazijinguan", "hongmianbaihuapao", "linglongshimandai", "lianjunshengyan"]);
				lib.inpile.sort(lib.sort.card);
				const equiplist = [];
				for (const node of ui.cardPile.childNodes) {
					if (node.name === "bagua") {
						node.init([node.suit, node.number, "linglongshimandai"]);
						equiplist.push(node);
					} else if (node.name === "tengjia") {
						node.init([node.suit, node.number, "hongmianbaihuapao"]);
						equiplist.push(node);
					} else if (node.name === "fangtian") {
						node.init([node.suit, node.number, "wushuangfangtianji"]);
						equiplist.push(node);
					} else if (node.name === "muniu") {
						node.init([node.suit, node.number, "shufazijinguan"]);
						equiplist.push(node);
					} else if (node.name === "wugu" || node.name === "taoyuan") {
						node.init([node.suit, node.number, "lianjunshengyan"]);
					}
				}
				equiplist.randomSort();
				const next = game.createEvent("boss_jingjia");
				next.player = game.boss;
				next.cards = equiplist;
				next.setContent([
					async (event, trigger, player) => {
						if (!event.cards.length) {
							event.finish();
							return;
						}
						player.logSkill("boss_jingjia");
					},
					async (event, trigger, player) => {
						let num = 1.5;
						while (event.cards.length) {
							const card = event.cards.shift();
							if (player.canEquip(card) && Math.random() < num) {
								await player.equip(card);
								num = 0.5;
							}
						}
					},
				]);
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
			loopFirst() {
				return game.boss.previousSeat;
			},
			gameDraw(player) {
				return player === game.boss ? 8 : 4;
			},
			init() {
				_status.taoni_over = get.copy(game.over);
			},
		},
		global: {
			loopType: 1,
			chongzheng: 6,
		},
	},

	characterIntro: {
		boss_chi: "山魑，传说中山林里害人的妖怪。",
		boss_mo: "木魅，一种老树幻化成的女子，靠着美色诱惑男性并吃掉他们的女妖。",
		boss_wang: "水魍，一种赤黑色的水怪。",
		boss_liang: "石魉，一种山川木石之怪。",
		boss_niutou: "牛头来源于佛家。牛头又叫阿傍，其形为牛头人身，手持钢叉，力能排山。据《铁城泥犁经》说：阿傍为人时，因不孝父母，死后在阴间为牛头人身，担任巡逻和搜捕逃跑罪人的衙役。",
		boss_mamian: "马面也是冥府著名的勾魂使者。鬼城酆都，及各地城隍庙中，均有牛头马面的形象。有资料说佛教最初只有牛头，传入中国时，由于民间最讲对称、成双，才又配上了马面。但也有资料说马面也称马面罗刹，同样来自佛家。但本人在查阅资料中，并未发现印度神话中有马面作为冥府差役的说法。密宗中到是有“马面明王”的形象，但那是密宗佛教中的一位大神，相传是观音菩萨的化身，和冥府差役相距甚远。",
		boss_baiwuchang: "黑白无常，亦称无常。是中国传统文化中的一对神祇，也是最有名的鬼差。此二神手执脚镣手铐，专职缉拿鬼魂、协助赏善罚恶，也常为阎罗王、城隍、东岳大帝等冥界神明的部将。 白无常名为谢必安，属阳。时常满面笑容，身材高瘦，面色惨白，口吐长舌，其头上官帽写有“一见生财”四字，予感谢并对恭敬神明之人以好运，尊之曰“活无常”，“白爷”等。对男性吸其阴魂，对女性散其阴魄。 ",
		boss_heiwuchang: "黑白无常，亦称无常。是中国传统文化中的一对神祇，也是最有名的鬼差。此二神手执脚镣手铐，专职缉拿鬼魂、协助赏善罚恶，也常为阎罗王、城隍、东岳大帝等冥界神明的部将。 黑无常名为范无救（或称范无赦、范无咎），属阴。面容凶悍，身宽体胖，个小面黑，官帽上写有“天下太平”四字，意为对违抗法令身负罪过者一概无赦，尊之曰“矮爷”或“黑爷”。对女性吸其阳魂，对男性散其阳魄。 因其在城隍麾下地位仅次于文武判官，牛头马面，枷爷，锁爷，故又得名“七爷”，“八爷”。",
		boss_luocha: "罗刹是相传原为南亚次大陆土著名称。自雅利安人征服印度后﹐凡遇恶人恶事﹐皆称罗刹﹐遂成恶鬼名。",
		boss_yecha: "夜叉是佛经中一种形象丑恶的鬼，勇健暴恶，能食人，有的后受伟大的佛陀之教化而成为护法之神，列为天龙八部众之一。",
		boss_qinguangwang: "第一殿秦广王蒋歆，东方玉宝皇上天尊化冥府一殿泰素妙广真君秦广大王，神居玄冥宫，二月初一日诞辰，位列震宫，尊居卯位，执掌风雷地狱，权衡霹雳神威，专司人间生死，统管吉凶。行善者作于青篇，作恶者标于黑簿，考察无私。专司大海之底，沃燋石外正黄泉黑路，统管幽冥吉凶、善人寿终，接引超升；功过两半者，送交第十殿发放，仍投入世间，男转为女，女转为男。恶多善少者，押赴殿右高台，名曰孽镜台，令之一望，照见在世之心好坏，随即批解第二殿，发狱受苦。",
		boss_chujiangwang: "第二殿楚江王历温，南方玄真万福天尊化冥府二殿阴德定休真君楚江大王，神居普明宫，三月初一日诞辰，位列离宫，尊居午位，执掌火医地狱，威专烈焰之权，专司大海之底，正南沃燋石下活大地狱，又名剥衣亭寒冰地狱，另设十六小地狱，凡在阳间伤人肢体、奸盗杀生者，推入此狱，另发入到十六小狱受苦，满期转解第三殿，加刑发狱。",
		boss_songdiwang: "第三殿宋帝王余懃，西方太妙至极天尊化冥府三殿洞明昔静真君宋帝大王，神居纣绝宫，二月初八诞辰，位列兑宫，尊居酉位，执掌金刚地狱，威司考掠之权，专司大海之底，东南沃燋石下黑绳大地狱，另设十六小狱，凡阳世忤逆尊长，教唆兴讼者，推入此狱，受倒吊、挖眼、刮骨之刑，刑满转解第四殿。",
		boss_wuguanwang: "第四殿五官王吕岱，北方玄上玉宸天尊化冥府四殿玄德五灵真君五官大王，神居太和宫，二月十八日诞辰，位居坎宫，尊居子位，执掌滨冷地狱，权衡冰雪之威，专司大海之底，正东沃燋石下合大地狱，又名剥剹血池地狱，另设十六小地狱，凡世人抗粮赖租，交易欺诈者，推入此狱，另再判以小狱受苦，满日送解第五殿察核。",
		boss_yanluowang: "第五殿阎罗王包拯，东北方度仙上圣天尊化冥府五殿最胜耀灵真君阎罗天子，神居纠纶宫，正月初八日诞辰，位列垦宫，尊居丑位，执掌镬汤地狱，威张煮溃之权，专司大海之底，东北沃焦石下叫唤大地狱，并十六诛心小狱。前本居第一殿，因怜屈死，屡放还阳伸雪，降调此殿。凡解到此殿者，押赴望乡台，令之闻见世上本家，因罪遭殃各事，随即推入此狱，细查曾犯何恶，再发入诛心十六小狱，钩出其心，掷与蛇食，铡其身首（包公即善于用铡刀），受苦满日，另发别殿。",
		boss_bianchengwang: "第六殿卞城王毕元宾，东南方好生度命天尊化冥府六殿宝肃昭成真君卞城大王，神居明晨宫，三月初八日诞辰，位列巽官，尊居幽府，执掌铜柱地狱，威专足履之刑，专司大海之底，正北沃燋石下大叫唤大地狱，及枉死城，另设十六小地狱。忤逆不孝者，被两小鬼用锯分尸。凡世人怨天尤地，对北溺便涕泣者，发入此狱。查所犯事件，亦要受到铁锥打、火烧舌之刑罚。再发小狱受苦，满日转解第七殿，再查有无别恶。",
		boss_taishanwang: "第七殿泰山王董和，西南方太灵虚皇天尊化冥府七殿等观明理真君泰山大王，神居神华宫，三月二十七日诞辰，位列坤宫，尊居泉曲，执掌屠割地狱，威权刀割之刑，专司大海之底，西北沃燋石下热恼大地狱，又名碓磨肉酱地狱，另设十六小地狱。凡阳世取骸合药、离人至戚者，发入此狱。再发小狱。受苦满日，转解第八殿，收狱查治。凡盗窃、诬告、敲诈、谋财害命者，均将遭受下油锅之刑罚。",
		boss_dushiwang: "第八殿都市王黄中庸，西北方无量太华天尊化冥府八殿飞魔衍庆真君都市大王，神居碧真宫，四月初一日诞辰，位列乾宫，尊居阴府，执掌火车地狱，威司运转之权，专司大海之底，正西沃焦石下大热大恼大地狱，又名恼闷锅地狱，另设十六小地狱。凡在世不孝，使父母翁姑愁闷烦恼者，掷入此狱。再交各小狱加刑，受尽痛苦，解交第十殿，改头换面，永为畜类。",
		boss_pingdengwang: "第九殿平等王陆游，上方玉虚明皇天尊化冥府九殿无上正度真君平等大王，神居七非宫，四月初八日诞辰，敕合乾元，德隆坤域，执掌普掠地狱，威转炽盛之权，专司大海之底，西南沃焦石下酆都城铁网阿鼻大地狱，另设十六小狱。凡阳世杀人放火、斩绞正法者，解到本殿，用空心铜桩，链其手足相抱，煽火焚烧，烫烬心肝，随发阿鼻地狱受刑。直到被害者个个投生，方准提出，解交第十殿发生六道（天道、修罗道、人间道、畜生道、饿鬼道、地狱道）。",
		boss_zhuanlunwang: "第十殿转轮王薛礼，下方真皇洞神天尊化冥府十殿五华威灵真君轮转大王，神居肃英宫，四月十七日诞辰，位尊幽都，名尊十帝，执掌罗酆之府，专司大海之底，沃燋石外正东直对世界五浊，司掌各殿解到鬼魂，分别善恶，核定等级，发四大部洲投生。男女寿夭，富贵贫贱，逐名详细开载，每月汇知第一殿注册。凡有作孽极恶之鬼，着令更变卵胎湿化，朝生暮死，罪满之后，再复人生，投胎蛮夷之地。凡发往投生者，先令押交孟婆神，醧忘台下，灌饮迷汤，使忘前生之事。",
		boss_dizangwang: "地藏王菩萨金乔觉，地藏菩萨梵名乞叉底鹐沙。据《地藏十轮经》讲，由于此菩萨“安忍不动如大地，静虑深密如秘藏”，所以称为地藏王。佛经中称地藏菩萨受释迦牟尼佛嘱咐，在释迦既灭、弥勒未生之前，自誓必尽度六道众生，拯救诸苦，始愿成佛。由于佛典记载，地藏菩萨在过去世中，曾经几度救出自己在地狱受苦的母亲，并在久远劫以来就不断发愿要救度一切罪苦众生尤其是地狱众生，所以这位菩萨被认为具“大孝”和“大愿”的德业，也因此被普遍尊称为“大愿地藏王菩萨”。另外，据《地藏本愿经》卷上所载，地藏菩萨的本缘有四︰于过去久远劫前为大长者之子。因见师子奋迅具足万行如来之相好庄严，乃发愿在尽未来际不可计劫，度脱六道罪苦众生，以证得此相。于过去不可思议阿僧祇劫为一婆罗门女。因欲救亡母脱离恶趣，乃设供修福。并立誓在尽未来劫，普度罪苦众生于过去久远劫时为一国王。因见国内人民多造众恶，乃誓愿救度一切罪苦众生皆至菩提，自己始成佛。于过去久远劫时为一女子，名光目。因欲拯救在地狱受苦的亡母，故誓愿济度一切罪苦众生。待彼等成佛后，始成正觉。",
		boss_mengpo: "孟婆神孟姜女，常驻在忘川河黄泉路奈何桥旁醧忘台，为了能忘记这些痛苦万分的记忆，熬制了能使人忘记记忆的孟婆汤。她在奈何桥畔熬制孟婆汤，让参与轮回的阴魂们忘记前世的一切。醧忘台高大如方丈，四周的廊房有一百零八间。有一条通道，通向东方，仅一尺四寸宽。所有奉令押解到的男女鬼魂，在各廊房中，都有杯子，招各鬼饮下此汤，多饮少饮不论。",

		boss_nianshou: "年兽，又名“年”，是中国民俗神话传说中的恶兽， 最早出自清末民初的报刊文章《沪壖话旧录》，为天界一只被锁在石柱上的动物，由紫微星君看管。相传古时候，每到新年之夜就会有凶残的怪兽闯入村落吃人，故名年兽。之后人们发现年兽有三怕，即巨响、红色与火光，于是家家户户每年放爆竹、贴春联、点灯火用以吓跑年兽，这些习惯逐渐成为了过年的习俗。 据《金刚钻报·说过年》记载，年兽的外形像狮子和狗的混合体，源于紫微高照年画。《铁报·年兽》中有载年兽体型庞大，头生独角。《大公报·年关考》中称年兽有一身雪白的毛，所到之处出现粉白色足印。《新民晚报·年的故事》之中则称年兽长着双头、四耳和八腿。《人民日报·过年的传说和风俗》提及年兽长着血盆大口。",
		boss_nianshou_heti: "请自行查看年兽的介绍。",
		boss_nianshou_jingjue: "请自行查看年兽的介绍。",
		boss_nianshou_renxing: "请自行查看年兽的介绍。",
		boss_nianshou_baonu: "请自行查看年兽的介绍。",
		boss_nianshou_ruizhi: "请自行查看年兽的介绍。",

		boss_qinglong: "青龙，源于上古星宿崇拜。我国古代把天空里的恒星划分成为“三垣”和“四象”七大星区。“三垣”是“紫微垣”，象征皇宫；“太微垣”象征行政机构；“天市垣”象征繁华街市。这三垣环绕着北极星呈三角状排列。在“三垣”外围分布着“四象”：“东苍龙、西白虎、南朱雀、北玄武”。也就是说，东方的星象如一条龙。由于地球围绕太阳公转，天空的星相也随着季节转换。每到冬春之交的傍晚，苍龙显现。 龙是东方七宿（角、亢、氐、房、心、尾、箕），而这七宿的形状又极似龙形，从他们的字义上就可以看出来，角是龙的角，亢是颈项，氐是本，而是颈根，房是膀，是胁，心是心脏，尾是尾，箕是尾末。",
		boss_mushengoumang: "句芒是中国古代民间神话中的木神、春神、东方之神，主管树木的发芽生长，忠心耿耿地辅佐伏羲。太阳每天早上从扶桑上升起，神树扶桑归句芒管，太阳升起的那片地方也归句芒管。句芒在古代非常重要，每年春祭都有份。传说它的本来面目是鸟，它鸟身人面，乘两龙，后来竟一点影响也没有了。不过我们可以在祭祀仪式和年画中见到它：它变成了春天骑牛的牧童，头有双髻，手执柳鞭，亦称芒童。",
		boss_shujing: "树精可能指由句芒管辖的灵木，《玄中记》（郭璞撰，佚文辑录）“千岁树精为青羊，万岁树精为青牛，句芒遣使巡木，见之则呼其名。”；句芒神力衍生的树妖，《云笈七签》卷十八“句芒号青帝真君，坐镇东林，万木之精皆为碧衣吏。”；古籍《山海经》亦有类似奇树记载，可认为是树精的原型之一，见《中山经·中次七经》的帝屋树及无名毒树（浮戏山）。",
		boss_taihao: "太昊（公元前4354—公元前4239年在位），是东夷部族与华夏部族的祖先和首领，是东方祖神，也是东方天帝青帝。亦作大嗥、太皞、大皥，以木德王，是为春皇。汉朝后有时与楚帛书创世神伏羲氏合并。 太昊在位115年，据说定都于汶上（今山东济宁），后迁都宛丘（今河南淮阳）。死后葬于淮阳太昊陵。最早见于文字记载的是春秋战国前期的主要文献《左传·昭公十七年》“陈，太皞之虚也。” 中国神话中的太阳神就是伏羲，皇甫谧《帝王世纪》云：太昊帝包牺氏……继天而生，首德，于木，为百王帝。帝出于震，未有年固。故位在东方。主春，象日之明，世称太昊。 一说青帝太昊伏羲氏即为天皇氏，为开天辟地后首位中国君主。",

		boss_zhuque: "朱雀，是中国古代神话中的天之四灵之一，源于远古星宿崇拜，是代表炎帝与南方七宿的南方之神，于八卦为离，于五行主火，象征四象中的老阳，四季中的夏季，同时也是天之南陆。南方神兽朱雀就是鸟的外形。南方属火，朱雀等鸟的图腾在古代神话中往往属于太阳崇拜。二十八宿的南方七宿（井、鬼、柳、星、张、翼、轸），其形象鸟，位于南方，属火，色赤，总称朱雀，亦名“朱鸟”。",
		boss_huoshenzhurong: "祝融，号赤帝，中国古代神话中的火神、南方神、南岳神、南海神、夏神、灶神，为五行神之一。历史文献中，祝融的相关记载纷繁复杂。在部分文献中，祝融指三皇时期的祝融氏；又有文献记载祝融为炎帝之后；另有文献记载祝融为黄帝之后；而祝融也指火正、夏官的官职名称。据《山海经》记载，祝融长着兽身人面，架乘着两条龙，直接听命于天帝。据《史记》记载，祝融是楚人的祖先。据《广东新语》记载，农历二月十三为祝融生日。",
		boss_yanling: "焰灵可能指《山海经·海外南经》中记载的厌火国人，“厌火国在其国南，兽身黑色，火出其口中。”。厌火国是一个栖息在讙头国之南的神秘族群，属南方炎热之地，与“火神祝融”的信仰区域呼应。其国民身形如黑色兽类（郭璞注称似猕猴），通体焦黑如炭，拥有从口中喷吐火焰的生理特性；晋代《博物志》补充揭示他们以吞食火炭为生，这一习性构成其喷火能力的自然逻辑，使其成为与炽热环境共生的“活体火焰容器”。厌火国人并非主动攻击的妖魔，而是南方荒芜火域中适应极端高温的生存者，其形象承载着古人对火山地带异族的奇幻想象——既映射了现实中有火技艺或接触地火的部族（如矿工群体），又暗含原始火崇拜的图腾色彩。",
		boss_yandi: "炎帝，是中国上古时期姜姓部落的首领尊称，号神农氏，又号魁隗氏、连山氏、列山氏，别号朱襄（尚有争议，也有说朱襄氏部落曾有三代首领尊号炎帝）。 传说姜姓部落的首领由于懂得用火而得到王位，所以称为炎帝。从神农起姜姓部落共有九代炎帝，神农生帝魁，魁生帝承，承生帝明，明生帝直，直生帝氂，氂生帝哀，哀生帝克，克生帝榆罔，传位五百三十年。炎帝所处时代为新石器时代，炎帝故里目前有六地之争，分别是：陕西宝鸡、湖南会同县连山、湖南株洲炎陵县、湖北的随州、山西高平、河南柘城。炎帝部落的活动范围在黄河中下游，在姜水（一说是今宝鸡市渭滨区的清姜河，一说是今宝鸡市岐山县的岐水。）一带时部落开始兴盛，最初定都在陈地，后来又将都城迁移到曲阜。 相传炎帝牛首人身，他亲尝百草，发展用草药治病；他发明刀耕火种创造了两种翻土农具，教民垦荒种植粮食作物；他还领导部落人民制造出了饮食用的陶器和炊具。 传说炎帝部落后来和黄帝部落结盟，共同击败了蚩尤。 华人自称炎黄子孙，将炎帝与黄帝共同尊奉为中华民族人文初祖，成为中华民族团结、奋斗的精神动力。炎帝被道教尊为神农大帝，也称五榖神农大帝。",

		boss_baihu: "白虎，战神、杀伐之神。白虎具有避邪、禳灾、祈丰及惩恶扬善、发财致富、喜结良缘等多种神力。而它是四灵之一，当然也是由星宿变成的。是由二十八星宿之的西方七宿（奎、娄、胃、昂、毕、觜、参）。所以是西方的代表，而它的白，是因是西方，西方在五行中属金，色是白的。所以它叫白虎不是因它是白色，而是从五行中说的了。白虎原为古老神话中的西方之神，从先秦时代开始它就是代表少昊与西方七宿的神兽，而到了汉代五行学说兴起，它的象征含义又多了庚辛与秋季，四象合于五行，西方白虎又多了象征五行中金行的意义。",
		boss_jinshenrushou: "蓐收，又名该，中国古代神话中的金神、秋神、西方之神、天之刑神，五行神之一。少昊之子及其辅佐神。 据《国语·晋语》记载，蓐收脸上长着白毛，有老虎一样的爪，手里拿着斧子。《山海经·海外西经》记载，蓐收左耳上有条蛇，骑着两条龙。",
		boss_mingxingzhu: "明刑柱可能指蓐收辖地的神异之柱，据《山海经·西山经》“蓐收所居泑山 “西望日之所入，其气员（圆），神红光之所司也。”（郭璞注：红光即蓐收）与汉代谶纬《龙鱼河图》“西方白帝神曰蓐收， 立金柱三千丈，主戮奸邪；亦或者是蓐收所执法器，唐朝《道法会元》卷七六所记载：道士召请蓐收时，需 “存想西方金炁凝为铁柱，罪魂环柱哀号”。”",
		boss_shaohao: "少昊，华夏人文始祖，远古时期部落联盟首领称号，黄帝的长子，母为嫘祖（一说女节）。少昊，亦作“少暤”，名“挚”，又作“质”，号“金天氏”、“穷桑氏”或“朱宣氏”，生于穷桑，和太昊伏羲一样同为上古时期东夷族的祖先和首领，因修太昊之法，故称之为少昊，姬姓，一说为嬴姓，名玄嚣。 出生于江水（古代山东西部的一条大河）边。少年时，迎娶凤鸿氏女子为妻，成为凤鸿部落的首领，最终成为整个东夷部落的首领，号金天氏，一号青阳氏。少昊是东夷部族的首领。少昊部族内有20多个以鸟为名的部落，如凤鸟氏、玄鸟氏、伯赵氏、青鸟氏、丹鸟氏、祝鸿氏、鸤鸠氏、鹘鸠氏、爽鸠氏等等，其中有凤族8个，凤族在少昊集团中地位最为尊贵，掌管天文历法，指导部落农桑。",

		boss_xuanwu: "玄武，是一种由龟和蛇组合成的一种灵物。玄武的本意就是玄冥，武、冥古音是相通的。武，是黑的意思；冥，就是阴的意思。玄冥起初是对龟卜的形容：龟背是黑色的，龟卜就是请龟到冥间去诣问袓先，将答案带回来，以卜兆的形式显给世人。因此，最早的玄武就是乌龟。二十八宿的北方七宿（斗、牛、女、虚、危、室、壁），以后，玄冥的含义不断地扩大。龟生活在江河湖海（包括海龟），因而玄冥成了水神；乌龟长寿，玄冥成了长生不老的象征；最初的冥间在北方，殷商的甲骨占卜即‘其卜必北向’，所以玄冥又成了北方神。",
		boss_shuishenxuanming: "玄冥一词指水神、海神、冬神、北方之神，而道家则用来形容“道”的，道教称肾之神。到汉代，中国民间用来指阴间，九泉；同时用于汉代郊祀歌名，歌词为：“玄冥陵阴，蛰虫盖臧……”取首二字为歌名。到唐代以后，就有用来称为北方的，也有用来称为冬季的。而到了现代，“玄冥”则成为各种武侠小说里武功怪异人的代名词了。但实际上，“冥”是商族领袖之一。因其”勤其官而水死“，故被后人奉为水神，称“玄冥”。",
		boss_shuishengonggong: "共工，又名共工氏、康回、孔壬，中国古代神话中的水神。炎帝的后裔，祝融的儿子。在早期的文献中，共工是尧的臣子，之后演变为古帝王、部落首领，后再转变为神话中怒撞不周山、破坏天体秩序的天神。共工所处的时代，往前可追溯至高辛氏、颛顼、黄帝、炎帝等时期，往后则流传至舜、禹时期。郭璞注《山海经·大荒西经》引《归藏·启筮》写道，共工长着人脸蛇身，头发是红色。",
		boss_zhuanxu: "颛顼，姬姓，高阳氏，黄帝之孙，昌意之子。上古部落联盟首领，“五帝”之一，人文始祖之一。颛顼辅佐少昊有功，封地在高阳（今河南省杞县高阳镇），故号高阳氏。少昊死后，打败争夺帝位的共工氏，成为部落联盟首领，号“高阳氏”。始都穷桑，后迁都商丘。 颛顼去世后，由黄帝曾孙帝喾继位。在流传下来的神话传说中，颛顼是主管北方的天帝。《史记·五帝本纪》记载颛顼：“静渊以有谋，疏通而知事”。",

		boss_hundun: "混沌，又作浑沌；是中国古代神话四大凶兽之一 。先秦《左传》记载，中国古代神话四大凶兽分别是：形象如同巨大的狗的“混沌”、人头羊身并且腋下长眼睛的“饕餮”、生有翅膀的大虎“穷奇”以及人头虎腿并长有野猪獠牙的“梼杌”。 据《神异经·浑沌》记载，混沌的形象特征：其状如犬，长毛四足，似熊而无爪，有目而不见。",
		boss_qiongqi: "穷奇，中国古代神话传说中的四凶之一，是西方天帝少昊的后代，因毁信恶忠，崇饰恶言，被舜流放，迁于四裔，以御魑魅；和混沌、梼杌、饕餮并称为远古“四大凶兽”。 《山海经·海内北经》记载：穷奇外貌像老虎，大小如同牛般，长有一双翅膀。传说穷奇：性情凶狠，喜欢吃人。不忠不信，不听好人之言，专门听信别人的坏话。",
		boss_taowu: "梼杌，别名傲狠，中国神话中上古时期的四凶之一。 所谓“四凶”，最早指的是上古年间四位残暴的部落首领，后来被杜撰为他们部落图腾的四种怪物。据《神异经》记载，梼杌是生活在偏远西方的怪物，它体格像老虎而毛类犬，毛很长，脸有点像人，腿有点像老虎，嘴巴长有像野猪一样的獠牙，尾长丈八尺，在西方称霸，能斗不退。而“梼杌”，较早见于《左传·文公十八年》，原文是：颛顼有不才子，不可教训，不知话言，告之则顽，舍之则嚚，傲狠明德，以乱天常，天下之民谓之梼杌。",
		boss_taotie: "饕餮，别名老饕、狍鸮，是中国古代神话传说中的一种凶恶贪食的野兽，四大凶兽之一。据《山海经》记载：饕餮其形状如羊身人面，其目在腋下，虎齿人爪，其音如婴儿。是贪欲的象征，常用来形容贪食或贪婪的人。",
		boss_zhuyin: "烛阴，又名烛龙、烛九阴、逴龙、火精，中国古代神话中钟山的山神，无足之龙，开眼为昼、闭眼为夜，有一子名为鼓。 据《山海经·大荒北经》记载，烛龙是章尾山之神，人面蛇身，浑身红色，眼睛竖着长。《山海经·海外北经》记载的钟山之神烛阴也是人面蛇身赤色。郭璞在《山海经图赞译注》中认为烛龙与烛阴乃是同一物。",
		boss_xiangliu: "相柳，又称相繇，上古时代中国神话传说中的凶神，共工的臣属，出自《山海经·海外北经》：“蛇身九头，食人无数，所到之处，尽成泽国”。 传说它喷出来的水比洪水还厉害，又苦又辣，吃了就会送命。因此，这种水泽连禽兽也不能生活。禹见相柳如此猖獗，就运用神力杀了相柳，为民除害。相柳身上流出的血，一沾土地就五谷不生，把大片地方污染了。禹尝试用泥土陉塞，但三陉三陷，禹只好把这片土地劈为池子，各方天神在池畔筑起一座高台，镇压妖魔。",
		boss_zhuyan: "朱厌是中国古代神话中的动物。 《山海经·西山经》记载：其状如猿，而白首赤足；传说这种野兽一出现，天下就会发生大乱。先秦时期《山海经·西山经》记载：“又西四百里，曰小次之山，其上多白玉，其下多赤铜。有兽焉，其状如猿，而白首赤足，名曰朱厌，见则大兵。”朱厌即猿，它有洁净的毛发（白首：白，彰明、清晰、洁净；首，标表），伺机奔跑（赤足：四肢为红色）。朱厌图有二形：其一为猴形；其二为人面猴身。",
		boss_bifang: "毕方是中国古代神话中的形象，生活在章莪山。 据《山海经·西山经》记载：毕方形状像鹤，只有一只脚，青色的羽毛之上有红色的斑纹，长着白色的嘴巴，先秦时期，《山海经·西山经》记载：“有鸟焉，其状如鹤，一足，赤文青质而白喙，名曰毕方，其鸣自叫也，见则其邑有讹火。”（山中有一种鸟，它的形状像鹤，只有一只脚，青色的羽毛之上有红色的斑纹，长着白色的嘴巴，这种鸟名叫毕方，它鸣叫起来就好像是在呼喊自己的名字，它在哪里出现，哪里就会有大片的野火。）",
		boss_yingzhao: "英招是上古时期中国神话传说中的神，为马身人面虎纹鸟翼，是看花园的天神，属华夏族和西戎部落；出自《山海经·西次三经》。《山海经·西山经》：“又西三百二十里，曰槐江之山，丘时之水出焉，而北流注于泑水。其中多蠃母，其上多肯雄黄，多藏琅歼、黄金、玉，其陨多丹粟，其陲多采黄金银。实惟帝之平圃，神英招司之，其状马身而人面，虎文而舄翼，徇于四海，其音如榴。”",

		boss_shikieiki: "四季映姬·夜摩仙那度（四季映姫・ヤマザナドゥ）是东方Project系列中的官方角色，首次登场于东方花映塚。四季映姬曾经是地藏，后来全国各地的地藏联名上书请求分担阎魔大人的工作，她也成为了阎魔。她的立绘剪影出现在了花映塚的封面上。她非常喜欢说教，且她从来不会说出失之偏颇的话语，因此在她周围会油然而生一种难以接近的氛围。但她的说教也让人有些烦。在花映塚之后，她在官方游戏和官方出版物中偶有出场。四季映姬平时生活在彼岸，偶尔也会出现在幻想乡，这时妖怪们就会躲起来。她大部分时间在是非曲直厅内进行审判的工作，经常负责幻想乡死者的裁决，幻想乡长生不老的妖怪都曾受其关照。她平时负责给死者定罪，判断让死者去地狱还是天界，或者其他地方。阎魔审判的工作采用的是二人轮换制，她休息的时候往往在彼岸享受属于自己的悠闲生活。在休假时间，她就会直截了当地警告背负着过于沉重的罪孽的长寿之人。四季映姬拥有明鉴黑白程度的能力。她拥有非常复杂而全面的标准来判断善恶，涵盖从案件的成立到有关人员的成长史等等内容，她的判决无关法律，因此她会制裁法律无法制裁的罪过。对她说谎被揭穿后会被施以重罪。但她也曾向射命丸文表示有冤罪存在，后者认为这是其不想落人话柄。她在迷途竹林也不会迷路。她拥有净玻璃之镜，用这面镜子映照受审者，受审者过去的一切言行都将在镜中得到再现，毫无隐私可言。四季映姬的净玻璃之镜大小应该和单手持的小梳妆镜相仿。她拥有强大的力量。据说对她花钱贿赂能让人起死回生。",
	},
	characterTitle: {
		boss_chi: "鬼蜮地动",
		boss_mo: "夜鬼悲鸣",
		boss_wang: "鬼工雷斧",
		boss_liang: "阴森鬼火",
		boss_niutou: "冥府差役",
		boss_mamian: "勾魂罗刹",
		boss_baiwuchang: "无常勾魂",
		boss_heiwuchang: "无常索命",
		boss_luocha: "鬼哭天惊",
		boss_yecha: "惊神泣鬼",
		boss_qinguangwang: "一殿阎王",
		boss_chujiangwang: "二殿阎王",
		boss_songdiwang: "三殿阎王",
		boss_wuguanwang: "四殿阎王",
		boss_yanluowang: "五殿阎王",
		boss_bianchengwang: "六殿阎王",
		boss_taishanwang: "七殿阎王",
		boss_dushiwang: "八殿阎王",
		boss_pingdengwang: "九殿阎王",
		boss_zhuanlunwang: "十殿阎王",
		boss_mengpo: "忘川难断",
		boss_dizangwang: "渡脱六道",
		boss_shikieiki: "乐园的最高裁判长", //取自东方花映塚
		boss_nianshou: "祥云瑞气",
		boss_nianshou_heti: "祥云瑞气",
		boss_nianshou_jingjue: "旋乾转坤",
		boss_nianshou_renxing: "怒执不扰",
		boss_nianshou_baonu: "雷嗔电击",
		boss_nianshou_ruizhi: "深思远虑",
		boss_huangyueying: "奇智女杰",
		boss_zhangchunhua: "冷血皇后",
		boss_dongzhuo: "权倾天下",
		boss_lvbu1: "最强神话",
		boss_lvbu2: "暴怒战神",
		boss_lvbu3: "神鬼无前",
		boss_zhouyu: "红莲业火",
		boss_pangtong: "铁索连舟",
		boss_zhugeliang: "观星唤雨",
		boss_zhangjiao: "驱雷策电",
		boss_zuoci: "仙人之怒",
		boss_liubei: "御驾亲征",
		boss_sunce: "江东白板",
		boss_caiwenji: "月下琵琶",
		boss_huatuo: "药坛圣手",
		boss_zhenji: "洛神赋图",
		boss_diaochan: "一舞倾城",
		boss_guojia: "乱世之书",
		boss_yuji: "妄境超凡",
		boss_shuijing: "武将列传",
		boss_luxun: "武将列传",
		boss_sunshangxiang: "武将列传",
		boss_satan: "卢奇菲罗", //取自意大利中世纪诗人但丁《神曲·地狱篇》，这个称号也就是堕天使路西法的别名
		boss_caocao: "魏武霸业",
		boss_hundun: "掩义隐贼",
		boss_qiongqi: "毁信废忠",
		boss_taowu: "傲狠明德",
		boss_taotie: "侵欲崇侈",
		boss_zhuyin: "烛照九幽",
		boss_xiangliu: "九命毒兽",
		boss_zhuyan: "兵燹凶兽",
		boss_bifang: "衔火灾兽",
		boss_yingzhao: "悬圃司兽",
		boss_qinglong: "孟章神君",
		boss_mushengoumang: "执柳春官",
		boss_shujing: "惑心甜毒",
		boss_taihao: "东方天帝",
		boss_zhuque: "陵光神君",
		boss_huoshenzhurong: "祈光夏官",
		boss_yanling: "恒古业火",
		boss_yandi: "南方天帝",
		boss_baihu: "监兵神君",
		boss_jinshenrushou: "挥旄秋官",
		boss_mingxingzhu: "执矩一樑",
		boss_shaohao: "西方天帝",
		boss_xuanwu: "执明神君",
		boss_shuishengonggong: "振涛冬官",
		boss_shuishenxuanming: "卜兆冬官",
		boss_zhuanxu: "北方天帝",
		//剑阁武将（这些武将就拿称号当武将名了）
		boss_liedixuande: "烈帝玄德",
		boss_gongshenyueying: "工神月英",
		boss_tianhoukongming: "天侯孔明",
		boss_yuhuoshiyuan: "浴火士元",
		boss_qiaokuijunyi: "巧魁儁乂",
		boss_jiarenzidan: "佳人子丹",
		boss_duanyuzhongda: "断狱仲达",
		boss_juechenmiaocai: "绝尘妙才",
		boss_jileibaihu: "机雷白虎",
		boss_yunpingqinglong: "云屏青龙",
		boss_lingjiaxuanwu: "灵甲玄武",
		boss_chiyuzhuque: "炽羽朱雀",
		boss_fudibian: "缚地狴犴",
		boss_tuntianchiwen: "吞天螭吻",
		boss_shihuosuanni: "食火狻猊",
		boss_lieshiyazi: "裂石睚眦",
		boss_kumuyuanrang: "枯目元让",
		boss_baijiwenyuan: "百计文远",
		boss_yihanyunchang: "翊汉云长",
		boss_fuweizilong: "扶危子龙",
	},

	skill: {
		boss_yingzhong: {
			getList(type, outside) {
				let characters = [];
				if (type === "highHp") {
					characters = [];
				}
				if (outside) {
					game.filterPlayer2(cur => {
						characters.removeArray(get.nameList(cur));
					});
				}
				return characters.randomSort();
			},
			trigger: {
				player: "phaseBegin",
			},
			filter(event, player, name) {
				return player.phaseNumber === 1;
			},
			forced: true,
			async content(event, trigger, player) {
				let num = 2;
				const skills = [];
				const characters = lib.skill.boss_yingzhong.getList();
				const func = name => {
					const ss = get.character(name, 3);
					if (ss.length) {
						skills.addArray(get.character(name, 3));
						return true;
					}
					return false;
				};
				for (const name of characters) {
					if (func(name)) {
						num--;
					}
					if (!num) {
						break;
					}
				}
				if (num && lib.rank) {
					//备用方案
					for (const r of ["s", "ap", "a", "am"]) {
						if (!Array.isArray(lib.rank[r])) {
							continue;
						}
						const ss = lib.rank[r].randomSort();
						for (const name of ss) {
							if (func(name)) {
								num--;
							}
							if (!num) {
								break;
							}
						}
						if (!num) {
							break;
						}
					}
				}
				if (skills.length) {
					await player.addSkills(skills);
				}
			},
		},
		niaobaidaowenha_skill: {
			trigger: { player: "loseMaxHpAfter" },
			filter(event, player) {
				return game.hasPlayer(current => current !== player) && event.num > 0;
			},
			getIndex: event => event.num,
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
					.set("ai", target => {
						const player = get.player();
						return get.attitude(player, target) / (target.maxHp || 1);
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const {
					targets: [target],
				} = event;
				await target.gainMaxHp();
				await target.recover();
			},
		},
		goujiangdesidai_skill: {
			inherit: "kagari_zongsi",
			filter(event, player) {
				return !player.hasSkill("kagari_zongsi") || Boolean(player.getStat("skill").kagari_zongsi);
			},
		},
		gubuzifeng_disable: {
			init(player, skill) {
				if (!player.storage[skill]) {
					player.storage[skill] = [];
				}
			},
			onremove(player, skill) {
				player.enableSkill(skill);
				delete player.storage[skill];
			},
			charlotte: true,
			locked: true,
			mark: true,
			intro: {
				content(storage, player, skill) {
					const list = [];
					for (const i in player.disabledSkills) {
						if (player.disabledSkills[i].includes(skill)) {
							list.push(i);
						}
					}
					if (list.length) {
						let str = "失效技能：";
						for (const skill of list) {
							if (lib.translate[`${skill}_info`]) {
								str += `${get.translation(skill)}、`;
							}
						}
						return str.slice(0, str.length - 1);
					}
				},
			},
		},
		thedayibecomeagod: {
			trigger: { player: "die" },
			filter(event, player) {
				return player.group === "shen";
			},
			forceDie: true,
			skillAnimation: true,
			animationColor: "kami",
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt2(event.skill),
						filterTarget: (card, player, target) => target.isFriendOf(player),
						ai: target => get.attitude(_status.event.player, target),
					})
					.set("forceDie", true)
					.forResult();
			},
			async content(event, trigger, player) {
				const target = event.targets[0];
				if (target.group !== "shen") {
					const changeGroup = target.changeGroup("shen");
					game.log("此刻，便是", target, "成为神明之日！");
					await changeGroup;
					return;
				}
				await target.turnOver(false);
				if (target.isDamaged()) {
					await target.recover(target.maxHp - target.hp);
				}
				await target.drawTo(5);
			},
		},
		TheDayIBecomeAGod: {
			trigger: { player: "useCard1" },
			ruleSkill: true,
			popup: false,
			forced: true,
			prompt: "是否将此【杀】改为神属性？",
			filter(event, player) {
				return player.group === "shen" && event.card.name === "sha";
			},
			async content(event, trigger, player) {
				game.log(trigger.card, "被改为神属性");
				game.setNature(trigger.card, "kami");
			},
		},
		shanrangzhaoshu: {
			trigger: {
				global: ["gainEnd", "loseAsyncAfter"],
			},
			direct: true,
			filter(event, player) {
				let min = 0;
				if (!player.hasSkill("shanrangzhaoshu", null, false)) {
					min += get.sgn(player.getEquips("shanrangzhaoshu").length);
				}
				const bool = player.countCards("he") > min;
				return game.hasPlayer(current => {
					if (current === player || current === _status.currentPhase) {
						return false;
					}
					if (!bool && !current.hasCards("h")) {
						return false;
					}
					const history = current.getHistory("gain")[0];
					if (!history) {
						return false;
					}
					if (event.name === "gain") {
						return history === event && event.getlx !== false;
					}
					return history.getParent() === event;
				});
			},
			async content(event, trigger, player) {
				const targets = game
					.filterPlayer(current => {
						if (current === player || current === _status.currentPhase) {
							return false;
						}
						const history = current.getHistory("gain")[0];
						if (!history) {
							return false;
						}
						if (trigger.name === "gain") {
							return history === trigger && trigger.getlx !== false;
						}
						return history.getParent() === trigger;
					})
					.sortBySeat(_status.currentPhase);
				for (const target of targets) {
					event.target = target;
					if (!target.isIn()) {
						continue;
					}
					const list = [];
					let min = 0;
					if (!player.hasSkill("shanrangzhaoshu", null, false)) {
						min += get.sgn(player.getEquips("shanrangzhaoshu").length);
					}
					if (player.countCards("he") > min) {
						list.push(`交给${get.translation(target)}一张牌`);
					}
					if (target.hasCards("he")) {
						list.push(`令${get.translation(target)}交给你一张牌`);
					}
					if (list.length === 0) {
						continue;
					}
					let choice = { index: 0 };
					if (list.length > 1) {
						choice = await player
							.chooseControl({
								controls: ["cancel2"],
								choiceList: list,
								prompt: get.prompt("shanrangzhaoshu", target),
								ai: () => {
									if (get.attitude(_status.event.player, _status.event.getParent().target) < 0) {
										return 1;
									}
									return "cancel2";
								},
							})
							.forResult();
					}
					if (choice.control === "cancel2") {
						continue;
					}
					player.logSkill("shanrangzhaoshu", target);
					let giver;
					let gainner;
					let result;
					if (list[choice.index][0] === "令") {
						gainner = player;
						giver = target;
						result = await target
							.chooseCard({
								position: "he",
								forced: true,
								prompt: `交给${get.translation(player)}一张牌`,
							})
							.forResult();
					} else {
						giver = player;
						gainner = target;
						result = await player
							.chooseCard({
								position: "he",
								forced: true,
								prompt: `交给${get.translation(target)}一张牌`,
								filterCard: (card, player) => {
									if (_status.event.ignoreCard) {
										return true;
									}
									const cards = player.getEquips("shanrangzhaoshu");
									if (!cards.includes(card)) {
										return true;
									}
									return cards.some(cardx => cardx !== card && !ui.selected.cards.includes(cardx));
								},
							})
							.set("ignoreCard", player.hasSkill("shanrangzhaoshu", null, false))
							.forResult();
					}
					if (result.cards?.length) {
						await giver.give(result.cards, gainner);
					}
				}
			},
		},
		lingsheji: {
			trigger: { player: "phaseUseEnd" },
			equipSkill: true,
			async cost(event, trigger, player) {
				const list = ["摸一张牌"];
				if (player.countCards("he") > 1) {
					list.push("将一张牌置于武将牌上，于回合结束后获得之");
				}
				const result = await player
					.chooseControl({
						controls: ["cancel2"],
						prompt: get.prompt(event.skill),
						choiceList: list,
						ai: () => {
							const player = _status.event.player;
							if (player.hasCards("e", card => card.name !== "tengjia" && get.value(card) <= 0)) {
								return 1;
							}
							if (!player.needsToDiscard()) {
								return 0;
							}
							return 1;
						},
					})
					.forResult();
				event.result = {
					bool: result.control !== "cancel2",
					cost_data: result.index,
				};
			},
			async content(event, trigger, player) {
				if (event.cost_data === 0) {
					await player.draw();
					return;
				}
				const result = await player
					.chooseCard({
						position: "he",
						forced: true,
						filterCard: (card, player) => card !== player.getEquip(5),
						ai: card => {
							if (get.position(card) === "e" && get.value(card) <= 0) {
								return 10;
							}
							return (get.position(card) === "h" ? 2 : 1) * -get.value(card);
						},
					})
					.forResult();
				if (!player.isIn()) {
					return;
				}
				player.addSkill("lingsheji2");
				const lose = player.lose({ cards: result.cards?.slice(), position: ui.special, toStorage: true });
				player.markAuto("lingsheji2", result.cards);
				await lose;
			},
		},
		lingsheji2: {
			trigger: { player: "phaseEnd" },
			equipSkill: true,
			forced: true,
			popup: false,
			async content(event, trigger, player) {
				const gain = player.gain({ cards: player.getStorage("lingsheji2").slice(), animate: "gain2", log: true });
				player.storage.lingsheji2.length = 0;
				player.removeSkill("lingsheji2");
				await gain;
			},
			intro: { content: "cards" },
		},
		noda_axe: {
			trigger: { player: "useCardToPlayered" },
			equipSkill: true,
			direct: true,
			filter(event, player) {
				return player.isPhaseUsing() && player !== event.target && event.targets.length === 1 && player.countCards("he") > 2;
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseToDiscard({
						position: "he",
						prompt: get.prompt("noda_axe", trigger.target),
						selectCard: 2,
						prompt2: `弃置两张牌，令${get.translation(trigger.target)}本回合内不能使用或打出牌且防具技能无效。`,
						filterCard: (card, player) => card !== player.getEquip(1),
						ai: card => (_status.event.goon ? 7.5 - get.value(card) : 0),
					})
					.set("logSkill", ["noda_axe", trigger.target])
					.set(
						"goon",
						((event, player) => {
							if (player.hasSkill("noda_axe2")) {
								return false;
							}
							if (event.getParent().excluded.includes(player)) {
								return false;
							}
							if (get.attitude(event.player, player) > 0) {
								return false;
							}
							if (get.type(event.card) === "trick" && event.player.hasWuxie()) {
								return true;
							}
							if (get.tag(event.card, "respondSha")) {
								if (!player.hasSha()) {
									return false;
								}
								return true;
							} else if (get.tag(event.card, "respondShan")) {
								if (!player.hasShan()) {
									return false;
								}
								return true;
							}
							return false;
						})(trigger, trigger.target)
					)
					.forResult();
				if (result.bool) {
					trigger.target.addTempSkill("noda_axe2");
				}
			},
		},
		noda_axe2: {
			equipSkill: true,
			mod: {
				cardEnabled() {
					return false;
				},
				cardSavable() {
					return false;
				},
				cardRespondable() {
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
			filter(event, player) {
				const evt = event.getl(player);
				return evt && evt.hs && evt.hs.length > 1 && player.isPhaseUsing();
			},
			async cost(event, trigger, player) {
				const num = trigger.getl(player).hs.length;
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						prompt2: `弃置一名其他角色的${get.cnNumber(num)}张牌`,
						filterTarget: (card, player, target) => player !== target && target.hasDiscardableCards(player, "he"),
						ai: target => {
							let att = get.attitude(player, target);
							if (target.countDiscardableCards(player, "he") >= num) {
								att *= 2;
							}
							return -att;
						},
					})
					.forResult();
				event.result.cost_data = num;
			},
			async content(event, trigger, player) {
				await player.discardPlayerCard({
					target: event.targets[0],
					position: "he",
					forced: true,
					selectButton: event.cost_data,
				});
			},
		},
		boss_panguan: {
			audio: true,
			mod: {
				targetEnabled(card) {
					if (get.type(card) === "delay") {
						return false;
					}
				},
			},
		},
		boss_juhun: {
			audio: true,
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			async content(event, trigger, player) {
				const list = game.filterPlayer(current => {
					return current !== player;
				});
				if (list.length) {
					const target = list.randomGet();
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
			async content(event, trigger, player) {
				game.countPlayer(current => {
					if (current !== player && current.hasCards("e")) {
						player.line(current);
						current.discard({ cards: current.getCards("e") });
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
			filter(event, player) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				if (_status.shidianyanluo_level == null) {
					return false;
				}
				return player === game.boss;
			},
			async content(event, trigger, player) {
				const next = game.createEvent("shidianyanluo_huanren", false, trigger.getParent());
				next.player = player;
				next.forceDie = true;
				next.setContent(lib.skill.boss_xhuanren2.contentx);
			},
			async contentx(event, trigger, player) {
				await game.delay();
				const list = [["boss_chujiangwang", "boss_songdiwang", "boss_wuguanwang", "boss_yanluowang"], ["boss_bianchengwang", "boss_taishanwang", "boss_dushiwang", "boss_pingdengwang"], ["boss_zhuanlunwang"]][_status.shidianyanluo_level];
				let control = list[0];
				if (list.length !== 1) {
					const result = await player
						.chooseControl({
							controls: list,
							prompt: "请选择下一个出战的角色",
							ai: () => list.randomGet(),
						})
						.set("forceDie", true)
						.forResult();
					control = result.control;
				}
				_status.shidianyanluo_level++;
				game.changeBoss(control);
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
			async content(event, trigger, player) {
				if (get.mode() !== "boss") {
					return;
				}
				//孟婆
				if (!_status.shidianyanluo_mengpo && Math.random() <= 0.4) {
					if (game.me !== game.boss) {
						game.boss.changeSeat(6);
					} else {
						game.boss.nextSeat.changeSeat(3);
						game.boss.previousSeat.changeSeat(5);
					}
					//	game.addBossFellow(game.me==game.boss?1:7,'boss_mengpo');
					const fellow = game.addFellow(game.me === game.boss ? 1 : 7, "boss_mengpo", "zoominanim");
					if (_status.shidianyanluo_level !== 0) {
						fellow.directgain(get.cards(4));
					}
					fellow.side = true;
					fellow.identity = "zhong";
					fellow.setIdentity("zhong");
					game.addVideo("setIdentity", fellow, "zhong");
					_status.shidianyanluo_mengpo = true;
				}
				const list = ["luxun", "re_luxun", "zhangchunhua", "zuoci", "re_zuoci", "re_yuji", "xin_yuji", "jiangfei", "kongrong"]; //禁将
				game.countPlayer(current => {
					if (current !== game.boss) {
						for (const name of list) {
							if (current.name === name || current.name2 === name) {
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
			filter(event, player) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				if (_status.shidianyanluo_level == null) {
					return false;
				}
				return player === game.boss && event.player === player;
			},
			async content(event, trigger, player) {
				const next = game.createEvent("shidianyanluo_huanren", false, trigger.getParent());
				next.player = player;
				next.forceDie = true;
				next.setContent(lib.skill.boss_newhuanren2.contentx);
			},
			contentx: [
				async (event, trigger, player) => {
					const delay = game.delay();
					const players = game.filterPlayer();
					for (const current of players) {
						current.removeSkill("diaohulishan");
						current.removeSkill("guogong2");
					}
					const enemies = game.boss.getEnemies();
					for (const current of enemies) {
						current.removeSkill("boss_wangshi2");
					}
					await delay;
				},
				async (event, trigger, player) => {
					let list = [["boss_chujiangwang", "boss_songdiwang", "boss_wuguanwang", "boss_yanluowang"], ["boss_bianchengwang", "boss_taishanwang", "boss_dushiwang", "boss_pingdengwang"], ["boss_zhuanlunwang"]][_status.shidianyanluo_level];
					//如果mengpo死亡且50回合内通过第三关，list[2]变成地藏王
					if (game.phaseNumber <= 50 && _status.shidianyanluo_level === 2 && _status.shidianyanluo_mengpodie === true) {
						list = ["boss_dizangwang"];
					}
					if (
						_status.shidianyanluo_level === 2 &&
						game.boss
							.getEnemies()
							.map(cur => {
								const names = get.nameList(cur);
								for (const name of names) {
									if (lib.rank.s.includes(name) || lib.rank.ap.includes(name) || lib.rank.a.includes(name) || lib.rank.am.includes(name)) {
										return name;
									}
								}
								return false;
							})
							.reduce((val, name) => {
								if (lib.rank.s.includes(name)) {
									return val + 1;
								}
								if (lib.rank.ap.includes(name)) {
									return val + 0.36;
								}
								if (lib.rank.a.includes(name)) {
									return val + 0.13;
								}
								if (lib.rank.am.includes(name)) {
									return val + 0.05;
								}
							}, 0) > Math.random()
					) {
						list = ["boss_shikieiki"];
					}
					let control = list[0];
					if (list.length !== 1) {
						const result = await player
							.chooseControl({
								controls: list,
								prompt: "选择下一个登场的武将",
								ai: () => _status.event.choice,
							})
							.set("forceDie", true)
							.set("choice", list.randomGet())
							.forResult();
						control = result.control;
					}
					_status.shidianyanluo_level++;
					game.changeBoss(control);
					//地藏王登场摸3
					if (control === "boss_dizangwang") {
						game.boss.draw(3);
					}
					//计回合数
					const level = _status.shidianyanluo_level;
					//孟婆
					if (!_status.shidianyanluo_mengpo) {
						if (Math.random() <= 0.5 || level === 2) {
							if (game.me !== game.boss) {
								game.boss.changeSeat(6);
							} else {
								game.boss.nextSeat.changeSeat(3);
								game.boss.previousSeat.changeSeat(5);
							}
							//game.addBossFellow();
							const fellow = game.addFellow(game.me === game.boss ? 1 : 7, "boss_mengpo", "zoominanim");
							if (_status.shidianyanluo_level !== 0) {
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
						game.countPlayer2(current => {
							if (current.name === "boss_mengpo") {
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
			],
		},
		boss_bingfeng: {
			audio: true,
			trigger: { player: "die" },
			forceDie: true,
			forced: true,
			filter(event) {
				return event.source && !event.source.isTurnedOver();
			},
			logTarget: "source",
			async content(event, trigger, player) {
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
			async content(event, trigger, player) {
				player.line(game.players.slice(0));
				game.countPlayer(current => {
					if (current !== player) {
						current.link();
					}
				});
			},
		},
		boss_shengfu: {
			audio: true,
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			popup: false,
			async content(event, trigger, player) {
				const list = [];
				game.countPlayer(current => {
					if (current === player) {
						return;
					}
					const es = current.getCards("e", { subtype: ["equip3", "equip4", "equip6"] });
					if (es.length) {
						list.push([current, es]);
					}
				});
				if (list.length) {
					player.logSkill("boss_heisheng");
					const current = list.randomGet();
					player.line(current[0]);
					current[0].discard({ cards: [current[1].randomGet()] });
				}
			},
		},
		boss_songdiwang_enyuan: { audio: true },
		boss_zhiwang: {
			audio: true,
			derivation: "boss_zhiwang_planetarian",
			trigger: { global: "gainEnd" },
			filter(event, player) {
				return event.player !== player && !(event.getParent().name === "draw" && event.getParent(2).name === "phaseDraw") && event.player.hasCards("h");
			},
			forced: true,
			logTarget: "player",
			async content(event, trigger, player) {
				const evt = trigger.getParent("boss_zhiwang");
				if (evt && evt.name === "boss_zhiwang") {
					trigger.player.uninit();
					trigger.player.init("sunce");
				}
				const hs = trigger.player.getCards("h");
				if (hs.length) {
					trigger.player.discard({ cards: [hs.randomGet()] });
				}
			},
			subSkill: { planetarian: {} },
		},
		boss_gongzheng: {
			audio: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			filter(event, player) {
				return player.hasCards("j");
			},
			async content(event, trigger, player) {
				player.discard({ cards: [player.getCards("j").randomGet()] });
			},
		},
		boss_xuechi: {
			audio: true,
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			async content(event, trigger, player) {
				const list = game.players.slice(0);
				list.remove(player);
				const target = list.randomGet();
				player.line(target);
				target.loseHp(2);
			},
		},
		boss_tiemian: {
			inherit: "renwang_skill",
			init(player, skill) {
				player.addExtraEquip(skill, "renwang", true, player => !player.getEquips(2).length && lib.card.renwang);
			},
			onremove(player, skill) {
				player.removeExtraEquip(skill);
			},
			priority: -0.3,
			equipSkill: false,
			filter(event, player) {
				if (!player.hasEmptySlot(2)) {
					return false;
				}
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
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget({
						prompt: "【诛心】：请选择一名角色，令其受到2点伤害。",
						filterTarget: (card, player, target) => target !== player && !game.hasPlayer(current => current !== player && current !== target && current.hp < target.hp),
						ai: target => -get.attitude(player, target),
					})
					.set("forceDie", true)
					.forResult();
				if (result.bool) {
					const target = result.targets[0];
					player.line(target);
					await target.damage(2);
				}
			},
		},
		boss_leizhou: {
			audio: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			async content(event, trigger, player) {
				const list = game.players.slice(0);
				list.remove(player);
				if (list.length) {
					const target = list.randomGet();
					player.line(target);
					target.damage({ nature: "thunder" });
				}
			},
		},
		boss_leifu: {
			audio: true,
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			async content(event, trigger, player) {
				const list = game.players.slice(0);
				list.remove(player);
				if (list.length) {
					const target = list.randomGet();
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
			async content(event, trigger, player) {
				const list = game.players.slice(0);
				list.remove(player);
				if (list.length) {
					list.sort(lib.sort.seat);
					player.line(list);
					for (const current of list) {
						current.damage({ nature: "thunder" });
					}
				}
			},
		},
		boss_fudu: {
			audio: true,
			trigger: { global: "useCard" },
			forced: true,
			filter(event, player) {
				return event.card.name === "tao" && event.player !== player && game.players.length > 2;
			},
			async content(event, trigger, player) {
				const list = game.players.slice(0);
				list.remove(player);
				list.remove(trigger.player);
				const target = list.randomGet();
				player.line(target);
				target.loseHp();
			},
		},
		boss_kujiu: {
			audio: true,
			trigger: { global: "phaseZhunbeiBegin" },
			forced: true,
			filter(event, player) {
				return event.player !== player;
			},
			logTarget: "player",
			async content(event, trigger, player) {
				await trigger.player.loseHp();
				await trigger.player.useCard({ card: { name: "jiu" }, targets: [trigger.player] });
			},
		},
		boss_renao: {
			audio: true,
			trigger: { player: "die" },
			forceDie: true,
			forced: true,
			async content(event, trigger, player) {
				const list = game.players.slice(0);
				list.remove(player);
				if (list.length) {
					const target = list.randomGet();
					player.line(target);
					target.damage({ num: 3, nature: "fire" });
				}
			},
		},
		boss_remen: {
			trigger: { target: ["useCardToBefore"] },
			forced: true,
			priority: 6,
			audio: true,
			filter(event, player) {
				if (!player.hasEmptySlot("equip2")) {
					return false;
				}
				if (event.card.name === "nanman") {
					return true;
				}
				if (event.card.name === "wanjian") {
					return true;
				}
				return event.card.name === "sha" && !game.hasNature(event.card);
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
			ai: {
				effect: {
					target(card, player, target, current) {
						if (!target.hasEmptySlot("equip2")) {
							return;
						}
						if (card.name === "nanman" || card.name === "wanjian") {
							return "zeroplayertarget";
						}
						if (card.name === "sha") {
							const equip1 = player.getEquip(1);
							if (equip1 && equip1.name === "zhuque") {
								return 1.9;
							}
							if (!game.hasNature(card)) {
								return "zeroplayertarget";
							}
						}
					},
				},
			},
		},
		boss_zhifen: {
			audio: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			async content(event, trigger, player) {
				const list = game.filterPlayer();
				list.remove(player);
				if (!list.length) {
					return;
				}
				const target = list.randomGet();
				player.line(target);
				if (target.hasGainableCards(player, "h")) {
					await player.gainPlayerCard({ target, position: "h", forced: true });
				}
				await target.damage({ nature: "fire" });
			},
		},

		boss_huoxing: {
			audio: true,
			trigger: { player: "die" },
			forceDie: true,
			forced: true,
			async content(event, trigger, player) {
				const list = game.players.slice(0);
				list.remove(player);
				if (list.length) {
					list.sort(lib.sort.seat);
					player.line(list);
					for (const current of list) {
						current.damage({ nature: "fire" });
					}
				}
			},
		},
		boss_suozu: {
			audio: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			async content(event, trigger, player) {
				const list = game.players.slice(0);
				list.remove(player);
				if (list.length) {
					list.sort(lib.sort.seat);
					player.line(list);
					for (const current of list) {
						current.link();
					}
				}
			},
		},
		boss_abi: {
			audio: true,
			trigger: { player: "damageEnd" },
			forced: true,
			filter(event) {
				return event.source != null;
			},
			logTarget: "source",
			async content(event, trigger, player) {
				trigger.source.damage().nature = ["fire", "thunder"].randomGet();
			},
		},
		boss_pingdeng: {
			audio: true,
			trigger: { player: "die" },
			forceDie: true,
			forced: true,
			async content(event, trigger, player) {
				// 第二次伤害沿用 damage() 的默认伤害值。
				for (const num of [2, undefined]) {
					const list = game.filterPlayer(current => current !== player && !game.hasPlayer(current2 => current2.hp > current.hp));
					if (!list.length) {
						return;
					}
					const target = list.randomGet();
					player.line(target);
					await target.damage({ num, nature: lib.linked.randomGet() });
				}
			},
		},
		boss_lunhui: {
			audio: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			filter(event, player) {
				return (
					player.hp <= 2 &&
					game.hasPlayer(current => {
						return current !== player && current.hp > 2;
					})
				);
			},
			async content(event, trigger, player) {
				const list = game.filterPlayer(current => {
					return current !== player && current.hp > 2;
				});
				if (list.length) {
					const target = list.randomGet();
					player.line(target);
					const hp1 = player.hp;
					const hp2 = target.hp;
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
			async content(event, trigger, player) {
				const name = ["nanman", "wanjian"].randomGet();
				player.useCard({
					card: { name: name },
					targets: game.filterPlayer(current => {
						return player.canUse({ name: name }, current);
					}),
					noai: true,
				});
			},
		},
		boss_zlfanshi: {
			audio: true,
			trigger: { player: "damageEnd" },
			forced: true,
			async content(event, trigger, player) {
				if (player.hasSkill("boss_zlfanshi_terra")) {
					const list = game.players.slice(0);
					list.remove(player);
					if (list.length) {
						const target = list.randomGet();
						player.line(target);
						target.damage();
					}
				} else {
					player.addTempSkill("boss_zlfanshi_terra");
				}
			},
		},
		boss_zlfanshi_terra: { charlotte: true },
		//孟婆:
		boss_shiyou: {
			audio: true,
			trigger: { global: "loseAfter" },
			filter(event, player) {
				const evt = event.getParent(3);
				return event.type === "discard" && evt.name === "phaseDiscard" && evt.player === event.player && evt.player !== player && event.cards2 && event.cards2.filterInD("d").length > 0;
			},
			async content(event, trigger, player) {
				const cards = trigger.cards2.filterInD("d");
				const result = await player
					.chooseCardButton({
						prompt: get.prompt("boss_shiyou"),
						cards,
						select: [1, cards.length],
						ai: button => get.value(button.link, player),
						filter: button => {
							for (const selected of ui.selected.buttons) {
								if (get.suit(selected.link) === get.suit(button.link)) {
									return false;
								}
							}
							return true;
						},
					})
					.forResult();
				if (result.bool) {
					await player.gain({ cards: result.links, animate: "gain2", log: true });
				}
			},
		},
		boss_wangshi: {
			trigger: { global: "phaseZhunbeiBegin" },
			forced: true,
			audio: true,
			filter(event, player) {
				if (player.getEnemies().includes(event.player)) {
					return true;
				}
				return false;
			},
			logTarget: "player",
			async content(event, trigger, player) {
				const list = ["basic", "trick", "equip"].randomGet();
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
				content(storage) {
					return `不能使用或打出${get.translation(storage)}牌`;
				},
			},
			init(player, skill) {
				if (!player.storage[skill]) {
					player.storage[skill] = [];
				}
			},
			//mark:true,
			onremove: true,
			mod: {
				cardEnabled2(card, player) {
					if (player.storage.boss_wangshi2.includes(get.type(card, "trick"))) {
						return false;
					}
				},
			},
		},
		boss_mengpohuihun1: {
			mode: ["boss"],
			trigger: {
				player: "loseEnd",
				global: "cardsDiscardEnd",
			},
			filter(event, player) {
				for (const card of event.cards) {
					if (card.name === "boss_mengpohuihun" && get.position(card, true) === "d") {
						return true;
					}
				}
				return false;
			},
			forced: true,
			popup: false,
			async content(event, trigger, player) {
				const cards = [];
				for (const card of trigger.cards) {
					if (card.name === "boss_mengpohuihun" && get.position(card) === "d") {
						cards.push(card);
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
			async content(event, trigger, player) {
				_status.shidianyanluo_mengpodie = true;
				const list = player.getEnemies();
				if (list.length > 0) {
					for (const current of list) {
						current.removeSkill("boss_wangshi2");
					}
					const ran1 = list.randomGet(); //第一个角色
					list.remove(ran1); //移除
					let skills1 = ran1.getSkills(true, false);
					if (skills1.length) {
						for (let i = 0; i < skills1.length; i++) {
							//排除技能，然后随机失去一个可以失去的技能
							if (get.skills[i] || lib.skill[skills1[i]].charlotte || !lib.translate[`${skills1[i]}_info`] || lib.skill[skills1[i]].zhuSkill === true) {
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
						const ran2 = list.randomGet(); //第二个角色
						list.remove(ran2); //移除
						let skills2 = ran2.getSkills(true, false);
						if (skills2.length) {
							for (let i = 0; i < skills2.length; i++) {
								//排除技能，然后随机失去一个可以失去的技能
								if (get.skills[i] || lib.skill[skills2[i]].charlotte || !lib.translate[`${skills2[i]}_info`] || lib.skill[skills2[i]].zhuSkill === true) {
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
					if (get.mode() === "boss") {
						const card1 = game.createCard("boss_mengpohuihun", "heart", 3, null);
						const card2 = game.createCard("boss_mengpohuihun", "club", 4, null);
						const a = [];
						if (ui.cardPile.childElementCount < 3) {
							game.boss.getCards(4);
						}
						for (let i = 0; i < ui.cardPile.childElementCount; i++) {
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
			filter(event, player, name) {
				if (name === "damageBegin4") {
					return event.num > 1;
				}
				return game.hasPlayer(target => {
					return player !== target && get.distance(player, target) <= 1;
				});
			},
			async content(event, trigger, player) {
				const name = event.triggername;
				if (name === "damageBegin4") {
					trigger.num--;
				} else {
					game.countPlayer(target => {
						if (player !== target && get.distance(player, target) <= 1) {
							target.damage({ num: 1, source: player, nature: "fire" });
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
			filter(event, player, name) {
				if (name === "gameDrawAfter" || name === "enterGame") {
					return true;
				} else if (name === "phaseZhunbeiBegin") {
					return player.hp < 3;
				}
				return true;
			},
			async content(event, trigger, player) {
				const name = event.triggername;
				if (name === "phaseZhunbeiBegin") {
					player.recover(3 - player.hp);
				} else {
					player.draw(name === "gameDrawAfter" || name === "enterGame" ? 3 : 2);
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
			async content(event, trigger, player) {
				const card = trigger.player.judging[0];
				const judge0 = trigger.judge(card);
				let judge1 = 0;
				let choice = "cancel2";
				let suitChoice = "cancel2";
				const attitude = get.attitude(player, trigger.player);
				const list = [];
				const suits = ["heart", "diamond", "club", "spade"];
				for (const suit of suits) {
					for (let i = 1; i < 14; i++) {
						list.add(i);
						const judge2 =
							(trigger.judge({
								name: get.name(card),
								suit,
								number: i,
								nature: get.nature(card),
							}) -
								judge0) *
							attitude;
						if (judge2 > judge1) {
							choice = i;
							suitChoice = suit;
							judge1 = judge2;
						}
					}
				}
				list.push("cancel2");
				suits.push("cancel2");
				const numberResult = await player
					.chooseControl({
						controls: list,
						ai: () => _status.event.choice,
						prompt: get.prompt2(event.name),
					})
					.set("choice", choice)
					.forResult();
				if (!player.isIn()) {
					return;
				}
				if (numberResult.control !== "cancel2") {
					player.logSkill(event.name, trigger.player);
					game.log(trigger.player, "判定结果点数为", `#g${numberResult.control}`);
					player.popup(numberResult.control, "fire");
					if (!trigger.fixedResult) {
						trigger.fixedResult = {};
					}
					trigger.fixedResult.number = numberResult.control;
				}
				const suitResult = await player
					.chooseControl({
						controls: suits,
						ai: () => _status.event.choice,
						prompt: get.prompt2(event.name),
					})
					.set("choice", suitChoice)
					.forResult();
				if (!player.isIn()) {
					return;
				}
				if (suitResult.control !== "cancel2") {
					if (numberResult.control === "cancel2") {
						player.logSkill(event.name, trigger.player);
					}
					game.log(trigger.player, "判定结果花色为", `#g${suitResult.control}`);
					player.popup(suitResult.control, "fire");
					if (!trigger.fixedResult) {
						trigger.fixedResult = {};
					}
					trigger.fixedResult.suit = suitResult.control;
					if (suitResult.control === "club" || suitResult.control === "spade") {
						trigger.fixedResult.color = "black";
					} else if (suitResult.control === "heart" || suitResult.control === "diamond") {
						trigger.fixedResult.color = "red";
					}
				}
			},
		},
		boss_diting: {
			audio: true,
			mod: {
				globalFrom(from, to, distance) {
					return distance - 1;
				},
				globalTo(from, to, distance) {
					return distance + 1;
				},
			},
			enable: "phaseUse",
			position: "h",
			filter(event, player) {
				return player.hasCards("he", { subtype: ["equip3", "equip4", "equip6"] });
			},
			filterCard(card) {
				return get.subtype(card) === "equip3" || get.subtype(card) === "equip4" || get.subtype(card) === "equip6";
			},
			check(card) {
				if (_status.event.player.isDisabled(get.subtype(card))) {
					return 5;
				}
				return 3 - get.value(card);
			},
			async content(event, trigger, player) {
				player.draw();
			},
			discard: false,
			visible: true,
			loseTo: "discardPile",
			prompt: "将一张坐骑牌置入弃牌堆并摸一张牌",
			delay: 0.5,
			prepare(cards, player) {
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
					filter(event, player) {
						return player.hasEnabledSlot(3) || player.hasEnabledSlot(4);
					},
					async content(event, trigger, player) {
						const disables = [];
						for (let i = 3; i <= 4; i++) {
							for (let j = 0; j < player.countEnabledSlot(i); j++) {
								disables.push(i);
							}
						}
						if (disables.length > 0) {
							player.disableEquip(disables);
						}
					},
				},
			},
		},
		boss_jingjia: {},
		boss_aozhan: {
			forced: true,
			locked: true,
			charlotte: true,
			group: ["boss_aozhan_wuqi", "boss_aozhan_fangju", "boss_aozhan_zuoji", "boss_aozhan_baowu"],
			subSkill: {
				wuqi: {
					mod: {
						cardUsable(card, player, num) {
							if (player.getEquip(1) && card.name === "sha") {
								return num + 1;
							}
						},
					},
					sub: true,
				},
				fangju: {
					trigger: {
						player: "damageBegin4",
					},
					forced: true,
					filter(event, player) {
						return player.getEquip(2) && event.num > 1;
					},
					async content(event, trigger, player) {
						trigger.num = 1;
					},
					sub: true,
				},
				zuoji: {
					trigger: {
						player: "phaseDrawBegin",
					},
					forced: true,
					filter(event, player) {
						return player.getEquip(3) != null || player.getEquip(4) != null;
					},
					async content(event, trigger, player) {
						trigger.num++;
					},
					sub: true,
				},
				baowu: {
					trigger: {
						player: "phaseJudgeBefore",
					},
					forced: true,
					filter(event, player) {
						return player.getEquip(5) != null;
					},
					async content(event, trigger, player) {
						trigger.cancel();
						game.log(player, "跳过了判定阶段");
					},
					sub: true,
				},
			},
		},

		boss_yaoshou: {
			mod: {
				globalFrom(from, to, distance) {
					return distance - 2;
				},
			},
		},
		boss_duqu: {
			trigger: { player: "damageEnd" },
			filter(event, player) {
				return event.source && !event.source.hasSkill("boss_duqu");
			},
			async content(event, trigger, player) {
				const target = trigger.source;
				if (!target.storage.boss_shedu) {
					target.storage.boss_shedu = 0;
				}
				target.storage.boss_shedu++;
				target.markSkill("boss_shedu");
			},
			forced: true,
			global: "boss_shedu",
			mod: {
				cardname(card, player) {
					if (card.name === "tao") {
						return "sha";
					}
				},
			},
		},
		boss_shedu: {
			trigger: { player: "phaseBegin" },
			mark: true,
			intro: { content: "mark" },
			forced: true,
			sourceSkill: "boss_duqu",
			filter(event, player) {
				return player.storage.boss_shedu && player.storage.boss_shedu > 0;
			},
			async content(event, trigger, player) {
				const num = player.storage.boss_shedu;
				const chs = get.cnNumber(num);
				const result = await player
					.chooseToDiscard({
						position: "he",
						selectCard: num,
						prompt: `弃置${chs}张牌，或失去${chs}点体力`,
						ai: card => 12 - get.value(card),
					})
					.forResult();
				const loseHp = !result.bool ? player.loseHp(num) : null;
				player.storage.boss_shedu--;
				if (num > 1) {
					player.markSkill("boss_shedu");
				} else {
					player.unmarkSkill("boss_shedu");
				}
				if (loseHp) {
					await loseHp;
				}
			},
		},
		boss_jiushou: {
			mod: {
				maxHandcard(player, num) {
					return num - player.hp + 9;
				},
			},
			trigger: { player: ["phaseUseBegin", "phaseJieshuBegin", "phaseDrawBegin"] },
			forced: true,
			filter(event, player) {
				return event.name === "phaseDraw" || player.countCards("h") < 9;
			},
			async content(event, trigger, player) {
				if (trigger.name === "phaseDraw") {
					trigger.cancel();
				} else {
					player.draw(9 - player.countCards("h"));
				}
			},
		},
		boss_echou_switch: {
			unique: true,
			charlotte: true,
			sourceSkill: "boss_echou",
			group: ["boss_echou_switch_on", "boss_echou_switch_off"],
			subSkill: {
				off: {
					trigger: { global: "gameStart" },
					async content(event, trigger, player) {
						player.disableSkill("boss_echou_awake", "boss_echou");
					},
					silent: true,
				},
				on: {
					trigger: { player: "changeHp" },
					filter(event, player) {
						return player.hp <= player.maxHp / 2 && event.changedHp !== 0;
					},
					forced: true,
					skillAnimation: true,
					animationColor: "thunder",
					async content(event, trigger, player) {
						player.enableSkill("boss_echou_awake");
						player.removeSkill("boss_echou_switch");
					},
				},
			},
		},
		boss_echou: {
			trigger: { global: "useCard" },
			filter(event, player) {
				return !event.player.hasSkill("boss_duqu") && ["tao", "jiu"].includes(event.card.name);
			},
			async content(event, trigger, player) {
				const target = trigger.player;
				player.line(target);
				if (!target.storage.boss_shedu) {
					target.storage.boss_shedu = 0;
				}
				target.storage.boss_shedu++;
				target.markSkill("boss_shedu");
			},
		},
		boss_bingxian: {
			trigger: { global: "phaseJieshuBegin" },
			filter(event, player) {
				return event.player !== player && event.player.countUsed("sha", true) === 0;
			},
			forced: true,
			async content(event, trigger, player) {
				player.useCard({ card: { name: "sha" }, targets: [trigger.player] });
			},
		},
		boss_juyuan: {
			init(player, skill) {
				player.storage[skill] = 0;
			},
			trigger: { player: "phaseAfter" },
			forced: true,
			silent: true,
			popup: false,
			async content(event, trigger, player) {
				player.storage.boss_juyuan = player.hp;
			},
			mod: {
				selectTarget(card, player, range) {
					if (card.name !== "sha") {
						return;
					}
					if (range[1] === -1) {
						return;
					}
					if (player.hp >= player.storage.boss_juyuan) {
						return;
					}
					range[1] += 2;
				},
			},
		},
		boss_xushi_switch: {
			unique: true,
			charlotte: true,
			sourceSkill: "boss_xushi",
			group: ["boss_xushi_switch_on", "boss_xushi_switch_off"],
			subSkill: {
				off: {
					trigger: { global: "gameStart" },
					async content(event, trigger, player) {
						player.disableSkill("boss_xushi_awake", "boss_xushi");
					},
					silent: true,
				},
				on: {
					trigger: { player: "changeHp" },
					filter(event, player) {
						return player.hp <= player.maxHp / 2 && event.changedHp !== 0;
					},
					forced: true,
					skillAnimation: true,
					animationColor: "thunder",
					async content(event, trigger, player) {
						player.enableSkill("boss_xushi_awake");
						player.removeSkill("boss_xushi_switch");
					},
				},
			},
		},
		boss_xushi: {
			trigger: { player: ["phaseUseEnd", "turnOverEnd"] },
			filter(event, player) {
				return event.name === "phaseUse" || !player.isTurnedOver();
			},
			forced: true,
			async content(event, trigger, player) {
				if (trigger.name === "phaseUse") {
					await player.turnOver();
					return;
				}
				const list = game.filterPlayer(current => current !== player);
				list.sort(lib.sort.seat);
				player.line(list, "green");
				for (const target of list) {
					await target.damage([1, 2].randomGet());
				}
			},
		},
		boss_zhaohuo: {
			trigger: {
				player: "damageBegin4",
				source: "damageBegin1",
			},
			forced: true,
			filter(event, player) {
				if (player === event.player) {
					return event.hasNature("fire") || player === event.source;
				}
				return true;
			},
			async content(event, trigger, player) {
				if (player === trigger.player) {
					trigger.cancel();
				} else {
					game.setNature(trigger, "fire");
				}
			},
			ai: {
				unequip: true,
				skillTagFilter(player) {
					if (player !== _status.currentPhase) {
						return false;
					}
				},
			},
		},
		boss_honglianx: {
			mod: {
				ignoredHandcard(card, player) {
					if (get.color(card) === "red") {
						return true;
					}
				},
				cardDiscardable(card, player, name) {
					if (name === "phaseDiscard" && get.color(card) === "red") {
						return false;
					}
				},
			},
			forced: true,
			trigger: { player: "phaseZhunbeiBegin" },
			async content(event, trigger, player) {
				const num = [0, 1, 2, 3].randomGet();
				const togain = [];
				while (togain.length < num) {
					const card = get.cardPile(card => !togain.includes(card) && get.color(card) === "red");
					if (!card) {
						break;
					}
					togain.push(card);
				}
				const targetCount = 3 - togain.length;
				const gain = togain.length ? player.gain({ cards: togain, animate: "draw" }) : null;
				if (targetCount === 0) {
					await gain;
					return;
				}
				const list = game
					.filterPlayer(current => current !== player)
					.randomGets(targetCount)
					.sortBySeat();
				player.line(list, "fire");
				if (gain) {
					await gain;
				}
				for (const target of list) {
					await target.damage({ nature: "fire" });
				}
			},
		},
		boss_yanyu_switch: {
			unique: true,
			charlotte: true,
			sourceSkill: "boss_yanyu",
			group: ["boss_yanyu_switch_on", "boss_yanyu_switch_off"],
			subSkill: {
				off: {
					trigger: { global: "gameStart" },
					async content(event, trigger, player) {
						player.disableSkill("boss_yanyu_awake", "boss_yanyu");
					},
					silent: true,
				},
				on: {
					trigger: { player: "changeHp" },
					filter(event, player) {
						return player.hp <= player.maxHp / 2 && event.changedHp !== 0;
					},
					forced: true,
					skillAnimation: true,
					animationColor: "thunder",
					async content(event, trigger, player) {
						player.enableSkill("boss_yanyu_awake");
						player.removeSkill("boss_yanyu_switch");
					},
				},
			},
		},
		boss_yanyu: {
			forced: true,
			trigger: { global: "phaseBegin" },
			filter(event, player) {
				return player !== event.player;
			},
			getIndex: () => 3,
			logTarget: "player",
			async content(event, trigger, player) {
				const { player: target } = trigger;
				player.line(target, "fire");
				const next = target.judge(card => {
					if (get.color(card) === "red") {
						return -5;
					}
					return 5;
				});
				next.judge2 = result => result.bool;
				const result = await next.forResult();
				if (!result?.bool) {
					target.damage("fire");
				}
			},
		},
		boss_fengdong: {
			trigger: { player: "phaseBegin" },
			forced: true,
			async content(event, trigger, player) {
				game.countPlayer(current => {
					if (current !== player) {
						current.addTempSkill("fengyin");
					}
				});
			},
		},
		boss_xunyou: {
			trigger: { global: "phaseBegin" },
			forced: true,
			filter(event, player) {
				return player !== event.player;
			},
			async content(event, trigger, player) {
				const list = game.filterPlayer(current => current !== player && current.hasCards("hej"));
				if (!list.length) {
					return;
				}
				const target = list.randomGet();
				player.line(target, "green");
				const card = target.getCards("hej").randomGet();
				event.card = card;
				const gain = player.gain({ cards: [card], source: target });
				target.$giveAuto(card, player);
				await gain;
				if (player.getCards("h").includes(card) && get.type(card) === "equip") {
					await player.chooseUseTarget({ card, forced: true, nopopup: true, animate: false });
				}
			},
		},
		boss_sipu_switch: {
			unique: true,
			charlotte: true,
			sourceSkill: "boss_sipu",
			group: ["boss_sipu_switch_on", "boss_sipu_switch_off"],
			subSkill: {
				off: {
					trigger: { global: "gameStart" },
					async content(event, trigger, player) {
						player.disableSkill("boss_sipu_awake", "boss_sipu");
					},
					silent: true,
				},
				on: {
					trigger: { player: "changeHp" },
					filter(event, player) {
						return player.hp <= player.maxHp / 2 && event.changedHp !== 0;
					},
					forced: true,
					skillAnimation: true,
					animationColor: "thunder",
					async content(event, trigger, player) {
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
				cardEnabled(card, player) {
					const sc = _status.currentPhase;
					if (sc && sc !== player && sc.isPhaseUsing() && sc.hasSkill("boss_sipu") && !sc.hasSkill("boss_sipu_switch") && sc.countUsed() < 3) {
						return false;
					}
				},
				cardUsable(card, player) {
					const sc = _status.currentPhase;
					if (sc && sc !== player && sc.isPhaseUsing() && sc.hasSkill("boss_sipu") && !sc.hasSkill("boss_sipu_switch") && sc.countUsed() < 3) {
						return false;
					}
				},
				cardRespondable(card, player) {
					const sc = _status.currentPhase;
					if (sc && sc !== player && sc.isPhaseUsing() && sc.hasSkill("boss_sipu") && !sc.hasSkill("boss_sipu_switch") && sc.countUsed() < 3) {
						return false;
					}
				},
				cardSavable(card, player) {
					const sc = _status.currentPhase;
					if (sc && sc !== player && sc.isPhaseUsing() && sc.hasSkill("boss_sipu") && !sc.hasSkill("boss_sipu_switch") && sc.countUsed() < 3) {
						return false;
					}
				},
			},
		},
		/*----分界线----*/
		boss_zirun: {
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			logTarget() {
				return game.filterPlayer();
			},
			async content(event, trigger, player) {
				const list = game.filterPlayer().sortBySeat();
				game.asyncDraw(list, current => {
					if (current.hasCards("e")) {
						return 2;
					}
					return 1;
				});
			},
		},
		boss_juehong: {
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			logTarget(event, player) {
				return player.getEnemies();
			},
			async content(event, trigger, player) {
				const list = player.getEnemies().sortBySeat();
				for (const target of list) {
					if (!target.hasCards("he")) {
						continue;
					}
					const es = target.getCards("e");
					if (es.length) {
						await target.discard({ cards: es });
					} else {
						await player.discardPlayerCard({ target, position: "h", forced: true });
					}
				}
			},
		},
		boss_zaoyi: {
			trigger: { global: "dieAfter" },
			forced: true,
			filter(event, player) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				const list = ["boss_shuishenxuanming", "boss_shuishengonggong"];
				if (list.includes(event.player.name)) {
					return !game.hasPlayer(current => {
						return list.includes(current.name);
					});
				}
				return false;
			},
			async content(event, trigger, player) {
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
					async content(event, trigger, player) {
						const list = player.getEnemies();
						let min = list[0].hp;
						for (const current of list) {
							if (current.hp < min) {
								min = current.hp;
							}
						}
						for (let i = 0; i < list.length; i++) {
							if (list[i].hp > min) {
								list.splice(i--, 1);
							}
						}
						player.line(list, "green");
						list.sortBySeat();
						for (const current of list) {
							current.loseHp(min);
						}
					},
				},
			},
			mod: {
				targetEnabled(card, player, target, now) {
					if (target.isEnemyOf(player)) {
						const type = get.type(card, "trick");
						if (type === "trick") {
							if (
								game.hasPlayer(current => {
									return current.name === "boss_shuishenxuanming";
								})
							) {
								return false;
							}
						}
						if (type === "basic") {
							if (
								game.hasPlayer(current => {
									return current.name === "boss_shuishengonggong";
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
			init(player) {
				player.storage.boss_lingqu = 0;
			},
			trigger: { player: "damageEnd" },
			forced: true,
			async content(event, trigger, player) {
				player.draw();
				player.storage.boss_lingqu++;
				player.markSkill("boss_lingqu");
			},
			intro: {
				content: "手牌上限+#",
			},
			mod: {
				maxHandcard(player, num) {
					return num + player.storage.boss_lingqu;
				},
			},
			group: "boss_lingqu_cancel",
			subSkill: {
				cancel: {
					trigger: { player: "damageBegin4" },
					priority: -11,
					forced: true,
					filter(event) {
						return event.num > 1;
					},
					async content(event, trigger, player) {
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
					filter() {
						return game.roundNumber === 5;
					},
					logTarget(event, player) {
						return player.getEnemies();
					},
					async content(event, trigger, player) {
						const list = player.getEnemies();
						for (const target of list) {
							await target.chooseToDiscard({ position: "he", forced: true, selectCard: 2 });
						}
					},
				},
				draw: {
					trigger: { global: "phaseDrawBegin" },
					forced: true,
					filter(event, player) {
						return game.roundNumber < 3 && event.player.isEnemyOf(player);
					},
					async content(event, trigger, player) {
						trigger.num--;
					},
				},
				thunder: {
					trigger: { player: "damageBegin4" },
					filter(event) {
						return event.hasNature("thunder") && game.roundNumber < 7;
					},
					forced: true,
					async content(event, trigger, player) {
						trigger.cancel();
					},
					ai: {
						nothunder: true,
						skillTagFilter() {
							return game.roundNumber < 7;
						},
						effect: {
							target(card, player, target, current) {
								if (get.tag(card, "thunderDamage") && game.roundNumber < 7) {
									return 0;
								}
							},
						},
					},
				},
			},
		},
		boss_qingzhu: {
			trigger: { player: "phaseDiscardBefore" },
			forced: true,
			async content(event, trigger, player) {
				trigger.cancel();
			},
			mod: {
				cardEnabled(card, player) {
					if (card.name === "sha" && _status.currentPhase === player && _status.event.getParent("phaseUse") && !player.hasSkill("boss_jiding")) {
						return false;
					}
				},
			},
		},
		boss_jiazu: {
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			getTargets(player) {
				const targets = [];
				targets.add(player.getNext());
				targets.add(player.getPrevious());
				const enemies = player.getEnemies();
				for (let i = 0; i < targets.length; i++) {
					if (!enemies.includes(targets[i]) || (!targets[i].getEquip(3) && !targets[i].getEquip(4))) {
						targets.splice(i--, 1);
					}
				}
				return targets;
			},
			filter(event, player) {
				return lib.skill.boss_jiazu.getTargets(player).length > 0;
			},
			logTarget(event, player) {
				return lib.skill.boss_jiazu.getTargets(player);
			},
			async content(event, trigger, player) {
				const targets = lib.skill.boss_jiazu.getTargets(player).sortBySeat();
				for (const target of targets) {
					const cards = target.getCards("e", card => {
						const subtype = get.subtype(card);
						return subtype === "equip3" || subtype === "equip4";
					});
					if (cards.length) {
						await target.discard({ cards });
					}
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
			init(player, skill) {
				player.changeSkin(skill, "boss_mingxingzhu");
			},
			onremove(player, skill) {
				player.changeSkin(skill, "boss_mingxingzhu_shadow");
			},
			filter(event, player) {
				if (event.player === player || event.player.isEnemyOf(player)) {
					return false;
				}
				if (!event.source?.isIn() || event.source.isFriendOf(player)) {
					return false;
				}
				const card = new lib.element.VCard({ name: "sha", nature: "thunder", isCard: true });
				return player.canUse(card, event.source, false);
			},
			logTarget: "source",
			async content(event, trigger, player) {
				const card = new lib.element.VCard({ name: "sha", nature: "thunder", isCard: true });
				const target = trigger.source;
				if (player.canUse(card, target, false)) {
					const next = player.useCard(card, target, false);
					const { skill } = player
						.when({
							source: "damageSource",
						})
						.filter(evt => evt.getParent(2) === next)
						.step(async (event, trigger, player) => {
							const target = game.findPlayer(current => current.name === "boss_jinshenrushou");
							if (target) {
								player.line(target);
								await target.recover(player);
							}
						});
					await next;
					player.removeSkill(skill);
					game.broadcastAll(skill => {
						delete lib.skill[skill];
						delete lib.translate[skill];
					}, skill);
					await player.removeSkills(event.name);
				}
			},
		},
		boss_xingqiu: {
			init(player, skill) {
				player.setStorage(skill, false);
			},
			onremove: true,
			trigger: { player: "phaseUseBegin" },
			locked: true,
			async cost(event, trigger, player) {
				const targets = player.getEnemies().sortBySeat();
				const bool = player.getStorage(event.skill, false);
				event.result = {
					bool: bool,
				};
				if (targets.length) {
					event.result.targets = targets;
				}
				player.setStorage(event.skill, !bool);
			},
			async content(event, trigger, player) {
				const link = async target => {
					if (!target.isLinked()) {
						player.line(target, "green");
						await target.link();
					}
				};
				await game.doAsyncInOrder(event.targets, link);
				const targets = game.filterPlayer(current => current.name === "boss_mingxingzhu").sortBySeat();
				const addSkill = async target => {
					if (!target.hasSkill("boss_jiding", null, null, false)) {
						await target.addSkills("boss_jiding");
					}
				};
				await game.doAsyncInOrder(targets, addSkill);
			},
		},
		boss_kuangxiao: {
			mod: {
				targetInRange(card, player, target) {
					return true;
				},
				selectTarget(card, player, range) {
					if (card.name === "sha") {
						range[1] = -1;
						range[0] = -1;
					}
				},
				playerEnabled(card, player, target) {
					if (card.name === "sha" && target.isFriendOf(player)) {
						return false;
					}
				},
			},
		},
		boss_yinzei_switch: {
			unique: true,
			charlotte: true,
			sourceSkill: "boss_yinzei",
			group: ["boss_yinzei_switch_on", "boss_yinzei_switch_off"],
			subSkill: {
				off: {
					trigger: { global: "gameStart" },
					async content(event, trigger, player) {
						player.disableSkill("boss_yinzei_awake", "boss_yinzei");
					},
					silent: true,
				},
				on: {
					trigger: { player: "changeHp" },
					filter(event, player) {
						return player.hp <= player.maxHp / 2 && event.changedHp !== 0;
					},
					forced: true,
					skillAnimation: true,
					animationColor: "thunder",
					async content(event, trigger, player) {
						player.enableSkill("boss_yinzei_awake");
						player.removeSkill("boss_yinzei_switch");
					},
				},
			},
		},
		boss_jicai_switch: {
			unique: true,
			charlotte: true,
			sourceSkill: "boss_jicai",
			group: ["boss_jicai_switch_on", "boss_jicai_switch_off"],
			subSkill: {
				off: {
					trigger: { global: "gameStart" },
					async content(event, trigger, player) {
						player.disableSkill("boss_jicai_awake", "boss_jicai");
					},
					silent: true,
				},
				on: {
					trigger: { player: "changeHp" },
					filter(event, player) {
						return player.hp <= player.maxHp / 2 && event.changedHp !== 0;
					},
					forced: true,
					skillAnimation: true,
					animationColor: "thunder",
					async content(event, trigger, player) {
						player.enableSkill("boss_jicai_awake");
						player.removeSkill("boss_jicai_switch");
					},
				},
			},
		},
		boss_luanchang_switch: {
			unique: true,
			charlotte: true,
			sourceSkill: "boss_luanchang",
			group: ["boss_luanchang_switch_on", "boss_luanchang_switch_off"],
			subSkill: {
				off: {
					trigger: { global: "gameStart" },
					async content(event, trigger, player) {
						player.disableSkill("boss_luanchang_awake", "boss_luanchang");
					},
					silent: true,
				},
				on: {
					trigger: { player: "changeHp" },
					filter(event, player) {
						return player.hp <= player.maxHp / 2 && event.changedHp !== 0;
					},
					forced: true,
					skillAnimation: true,
					animationColor: "thunder",
					async content(event, trigger, player) {
						player.enableSkill("boss_luanchang_awake");
						player.removeSkill("boss_luanchang_switch");
					},
				},
			},
		},
		boss_yandu_switch: {
			unique: true,
			charlotte: true,
			sourceSkill: "boss_yandu",
			group: ["boss_yandu_switch_on", "boss_yandu_switch_off"],
			subSkill: {
				off: {
					trigger: { global: "gameStart" },
					async content(event, trigger, player) {
						player.disableSkill("boss_yandu_awake", "boss_yandu");
					},
					silent: true,
				},
				on: {
					trigger: { player: "changeHp" },
					filter(event, player) {
						return player.hp <= player.maxHp / 2 && event.changedHp !== 0;
					},
					forced: true,
					skillAnimation: true,
					animationColor: "thunder",
					async content(event, trigger, player) {
						player.enableSkill("boss_yandu_awake");
						player.removeSkill("boss_yandu_switch");
					},
				},
			},
		},
		boss_shenwuzaishi: {
			trigger: { global: "dieAfter" },
			silent: true,
			filter(event, player) {
				return player.side !== game.boss.side;
			},
			async content(event, trigger, player) {
				if (player === trigger.source && trigger.player.name === "boss_zhuyin") {
					player.draw(3);
					player.recover();
				} else if (trigger.player.side === player.side) {
					player.draw(player.group === "shen" ? 3 : 1);
					player.recover();
				}
			},
		},
		boss_wuzang: {
			trigger: { player: "phaseDrawBegin" },
			forced: true,
			async content(event, trigger, player) {
				trigger.num += Math.max(5, Math.floor(player.hp / 2)) - 2;
			},
			mod: {
				maxHandcard(player, num) {
					return num - player.hp;
				},
			},
		},
		boss_xiangde: {
			trigger: { player: "damageBegin3" },
			forced: true,
			filter(event, player) {
				return event.source != null && event.source.isIn() && event.source !== player && event.source.getEquip(1) != null;
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
		},
		boss_yinzei: {
			trigger: { player: "damageEnd" },
			forced: true,
			logTarget: "source",
			filter(event, player) {
				return event.source && event.source.isIn() && event.source !== player && event.source.hasCards("he") && !player.hasCards("h");
			},
			async content(event, trigger, player) {
				trigger.source.randomDiscard();
			},
		},
		boss_zhue: {
			trigger: { global: "damageEnd" },
			forced: true,
			filter(event, player) {
				return event.source && event.source.isIn() && event.source !== player;
			},
			logTarget: "source",
			async content(event, trigger, player) {
				game.asyncDraw([player, trigger.source]);
			},
		},
		boss_yandu: {
			trigger: { global: "phaseJieshuBegin" },
			filter(event, player) {
				return event.player !== player && !event.player.getStat("damage") && event.player.hasCards("he");
			},
			logTarget: "player",
			forced: true,
			async content(event, trigger, player) {
				player.gainPlayerCard({ target: trigger.player, forced: true });
			},
		},
		boss_futai: {
			global: "boss_futai2",
			trigger: { player: "phaseZhunbeiBegin" },
			logTarget(event, player) {
				return game.filterPlayer(current => current.isDamaged());
			},
			forced: true,
			async content(event, trigger, player) {
				const targets = game.filterPlayer(current => current.isDamaged());
				await game.doAsyncInOrder(targets, target => target.recover());
			},
		},
		boss_futai2: {
			mod: {
				cardSavable(card, player) {
					if (card.name === "tao" && !_status.event.skill && game.hasPlayer(current => current !== player && current.hasSkill("boss_futai") && _status.currentPhase !== current)) {
						return false;
					}
				},
				cardEnabled(card, player) {
					if (card.name === "tao" && !_status.event.skill && game.hasPlayer(current => current !== player && current.hasSkill("boss_futai") && _status.currentPhase !== current)) {
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
					async content(event, trigger, player) {
						const list = game
							.filterPlayer(current => {
								return player.canUse("nanman", current);
							})
							.sortBySeat();
						if (list.length) {
							player.useCard({ card: { name: "nanman" }, targets: list });
						}
					},
				},
				end: {
					trigger: { player: "phaseJieshuBegin" },
					forced: true,
					async content(event, trigger, player) {
						const list = game
							.filterPlayer(current => {
								return player.canUse("wanjian", current);
							})
							.sortBySeat();
						if (list.length) {
							player.useCard({ card: { name: "wanjian" }, targets: list });
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
					filter(event, player) {
						return _status.currentPhase === player;
					},
					async content(event, trigger, player) {
						trigger.cancel();
					},
				},
				out: {
					trigger: { player: "damageBegin1" },
					forced: true,
					filter(event, player) {
						return _status.currentPhase !== player && event.hasNature("fire");
					},
					async content(event, trigger, player) {
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
					async content(event, trigger, player) {
						delete player.storage.boss_minwan;
					},
				},
				draw: {
					trigger: { player: "useCard" },
					forced: true,
					filter(event, player) {
						return _status.currentPhase === player && Array.isArray(player.storage.boss_minwan);
					},
					async content(event, trigger, player) {
						player.draw();
					},
				},
				add: {
					trigger: { source: "damageAfter" },
					filter(event, player) {
						return _status.currentPhase === player;
					},
					forced: true,
					async content(event, trigger, player) {
						if (!player.storage.boss_minwan) {
							player.storage.boss_minwan = [player];
						}
						player.storage.boss_minwan.add(trigger.player);
					},
				},
			},
			mod: {
				playerEnabled(card, player, target) {
					if (_status.currentPhase === player && Array.isArray(player.storage.boss_minwan) && !player.storage.boss_minwan.includes(target)) {
						return false;
					}
				},
			},
		},
		boss_tanyu: {
			trigger: { player: "phaseDiscardBefore" },
			forced: true,
			async content(event, trigger, player) {
				trigger.cancel();
			},
			group: "boss_tanyu_hp",
			subSkill: {
				hp: {
					trigger: { player: "phaseJieshuBegin" },
					forced: true,
					popup: false,
					filter(event, player) {
						return player.isMaxHandcard();
					},
					async content(event, trigger, player) {
						player.loseHp();
					},
				},
			},
		},
		boss_cangmu: {
			trigger: { player: "phaseDrawBegin" },
			forced: true,
			async content(event, trigger, player) {
				trigger.num += game.countPlayer() - 2;
			},
		},
		boss_jicai: {
			trigger: { global: "recoverAfter" },
			forced: true,
			logTarget: "player",
			async content(event, trigger, player) {
				if (trigger.player === player) {
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
					filter(event, player) {
						return event.notLink() && event.card && event.card.name === "sha" && event.player.hp < player.hp;
					},
					async content(event, trigger, player) {
						trigger.num++;
					},
				},
				turn: {
					trigger: { player: "turnOverBefore" },
					priority: 20,
					forced: true,
					filter(event, player) {
						return !player.isTurnedOver();
					},
					async content(event, trigger, player) {
						trigger.cancel();
						game.log(player, "取消了翻面");
					},
				},
			},
			mod: {
				globalFrom(from, to, distance) {
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
			async content(event, trigger, player) {
				if (trigger.xiuluolianyuji) {
					player.recover();
				}
				player.removeSkill("xiuluolianyuji2");
			},
		},
		xiuluolianyuji: {
			mod: {
				selectTarget(card, player, range) {
					if (card.name !== "sha") {
						return;
					}
					if (range[1] === -1) {
						return;
					}
					range[1] = Infinity;
				},
			},
			trigger: { source: "damageBegin1" },
			forced: true,
			filter(event) {
				return event.card && event.card.name === "sha";
			},
			async content(event, trigger, player) {
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
				globalTo(from, to, distance) {
					return (
						distance +
						game.countPlayer(current => {
							if (current === to) {
								return;
							}
							if (current.side !== to.side) {
								return;
							}
							if (current.hasSkill("juechenjinge")) {
								return 1;
							}
						})
					);
				},
			},
		},
		chiyanzhenhunqin: {
			equipSkill: true,
			trigger: { source: "damageBegin1" },
			forced: true,
			async content(event, trigger, player) {
				game.setNature(trigger, "fire");
			},
		},
		longfenghemingjian: {
			equipSkill: true,
			inherit: "cixiong_skill",
			filter(event, player) {
				return get.natureList(event.card).some(i => {
					return i === "thunder" || i === "fire";
				});
			},
		},
		qicaishenlu: {
			trigger: { source: "damageBegin1" },
			forced: true,
			filter(event, player) {
				return event.hasNature("linked");
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
		},
		sanshou_skill: {
			audio: "sanshou",
			inherit: "sanshou",
			filter(event, player) {
				return !player.hasSkillTag("unequip2");
			},
			ai: {
				effect: {
					target(card, player, target) {
						if (
							target.hasSkillTag("unequip2") ||
							player.hasSkillTag("unequip", false, {
								name: card ? card.name : null,
								target: target,
								card: card,
							})
						) {
							return;
						}
						return lib.skill.sanshou_skill.ai.effect.target(card, player, target);
					},
				},
			},
		},
		boss_chiyan: {
			trigger: { global: "gameStart" },
			forced: true,
			popup: false,
			unique: true,
			fixed: true,
			async content(event, trigger, player) {
				player.smoothAvatar();
				player.init("boss_zhuque");
				_status.noswap = true;
				game.addVideo("reinit2", player, player.name);
			},
		},
		boss_chiyan2: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_chiyan2x",
			trigger: { player: "dieBegin" },
			silent: true,
			unique: true,
			fixed: true,
			filter(event, player) {
				return player === game.boss;
			},
			async content(event, trigger, player) {
				player.hide();
				game.addVideo("hidePlayer", player);
			},
		},
		boss_chiyan2x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			fixed: true,
			globalFixed: true,
			unique: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_chiyan2");
			},
			content: [
				async (event, trigger, player) => {
					await game.delay();
					if (game.me !== game.boss) {
						game.boss.changeSeat(6);
					} else {
						game.boss.nextSeat.changeSeat(3);
						game.boss.previousSeat.changeSeat(5);
					}
					game.changeBoss("boss_huoshenzhurong");
					for (const current of game.players) {
						current.hp = current.maxHp;
						current.update();
					}
					await game.delay(0.5);
				},
				async (event, trigger, player) => {
					game.addBossFellow(game.me === game.boss ? 1 : 5, "boss_yanling");
					game.addBossFellow(7, "boss_yanling");
				},
				async (event, trigger, player) => {
					let dnum = 0;
					const dead = game.dead.slice(0);
					for (const current of dead) {
						if (!current.side && current.maxHp > 0 && current.parentNode === player.parentNode) {
							current.revive(current.maxHp);
							dnum++;
						}
					}
					for (const current of game.players) {
						if (current.side) {
							continue;
						}
						current.removeEquipTrigger();
						const hej = current.getCards("hej");
						for (const card of hej) {
							card.discard(false);
						}
						current.hp = current.maxHp;
						current.hujia = 0;
						current.classList.remove("turnedover");
						current.removeLink();
						current.directgain(get.cards(4 - dnum));
					}
				},
				async (event, trigger, player) => {
					while (_status.event.name !== "phaseLoop") {
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
			],
		},
		boss_chiyan3: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_chiyan3x",
			trigger: { player: "dieBegin" },
			silent: true,
			fixed: true,
			unique: true,
			filter(event, player) {
				return player === game.boss;
			},
			async content(event, trigger, player) {
				player.hide();
				player.nextSeat.hide();
				player.previousSeat.hide();
				game.addVideo("hidePlayer", player);
				game.addVideo("hidePlayer", player.nextSeat);
				game.addVideo("hidePlayer", player.previousSeat);
			},
		},
		boss_chiyan3x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			globalFixed: true,
			unique: true,
			fixed: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_chiyan3");
			},
			content: [
				async (event, trigger, player) => {
					await game.delay();
					game.changeBoss("boss_yandi");
					await game.delay(0.5);
				},
				async (event, trigger, player) => {
					game.changeBoss("boss_huoshenzhurong", game.boss.previousSeat);
					game.changeBoss("boss_yanling", game.boss.nextSeat);
				},
				async (event, trigger, player) => {
					let dnum = 0;
					const dead = game.dead.slice(0);
					for (const current of dead) {
						if (!current.side && current.maxHp > 0 && current.parentNode === player.parentNode) {
							current.revive(current.maxHp);
							dnum++;
						}
					}
					for (const current of game.players) {
						if (current.side) {
							continue;
						}
						current.removeEquipTrigger();
						const hej = current.getCards("hej");
						for (const card of hej) {
							card.discard(false);
						}
						current.hp = current.maxHp;
						current.hujia = 0;
						current.classList.remove("turnedover");
						current.removeLink();
						current.directgain(get.cards(4 - dnum));
					}
				},
				async (event, trigger, player) => {
					while (_status.event.name !== "phaseLoop") {
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
			],
		},
		boss_qingmu: {
			trigger: { global: "gameStart" },
			forced: true,
			popup: false,
			fixed: true,
			unique: true,
			async content(event, trigger, player) {
				player.smoothAvatar();
				player.init("boss_qinglong");
				_status.noswap = true;
				game.addVideo("reinit2", player, player.name);
			},
		},
		boss_qingmu2: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_qingmu2x",
			trigger: { player: "dieBegin" },
			silent: true,
			unique: true,
			fixed: true,
			filter(event, player) {
				return player === game.boss;
			},
			async content(event, trigger, player) {
				player.hide();
				game.addVideo("hidePlayer", player);
			},
		},
		boss_qingmu2x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			globalFixed: true,
			unique: true,
			fixed: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_qingmu2");
			},
			content: [
				async (event, trigger, player) => {
					await game.delay();
					if (game.me !== game.boss) {
						game.boss.changeSeat(6);
					} else {
						game.boss.nextSeat.changeSeat(3);
						game.boss.previousSeat.changeSeat(5);
					}
					game.changeBoss("boss_mushengoumang");
					for (const current of game.players) {
						current.hp = current.maxHp;
						current.update();
					}
					await game.delay(0.5);
				},
				async (event, trigger, player) => {
					game.addBossFellow(game.me === game.boss ? 1 : 5, "boss_shujing");
					game.addBossFellow(7, "boss_shujing");
				},
				async (event, trigger, player) => {
					let dnum = 0;
					const dead = game.dead.slice(0);
					for (const current of dead) {
						if (!current.side && current.maxHp > 0 && current.parentNode === player.parentNode) {
							current.revive(current.maxHp);
							dnum++;
						}
					}
					for (const current of game.players) {
						if (current.side) {
							continue;
						}
						current.removeEquipTrigger();
						const hej = current.getCards("hej");
						for (const card of hej) {
							card.discard(false);
						}
						current.hp = current.maxHp;
						current.hujia = 0;
						current.classList.remove("turnedover");
						current.removeLink();
						current.directgain(get.cards(4 - dnum));
					}
				},
				async (event, trigger, player) => {
					while (_status.event.name !== "phaseLoop") {
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
			],
		},
		boss_qingmu3: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_qingmu3x",
			trigger: { player: "dieBegin" },
			silent: true,
			fixed: true,
			unique: true,
			filter(event, player) {
				return player === game.boss;
			},
			async content(event, trigger, player) {
				player.hide();
				player.nextSeat.hide();
				player.previousSeat.hide();
				game.addVideo("hidePlayer", player);
				game.addVideo("hidePlayer", player.nextSeat);
				game.addVideo("hidePlayer", player.previousSeat);
			},
		},
		boss_qingmu3x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			fixed: true,
			globalFixed: true,
			unique: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_qingmu3");
			},
			content: [
				async (event, trigger, player) => {
					await game.delay();
					game.changeBoss("boss_taihao");
					await game.delay(0.5);
				},
				async (event, trigger, player) => {
					game.changeBoss("boss_mushengoumang", game.boss.previousSeat);
					game.changeBoss("boss_shujing", game.boss.nextSeat);
				},
				async (event, trigger, player) => {
					let dnum = 0;
					const dead = game.dead.slice(0);
					for (const current of dead) {
						if (!current.side && current.maxHp > 0 && current.parentNode === player.parentNode) {
							current.revive(current.maxHp);
							dnum++;
						}
					}
					for (const current of game.players) {
						if (current.side) {
							continue;
						}
						current.removeEquipTrigger();
						const hej = current.getCards("hej");
						for (const card of hej) {
							card.discard(false);
						}
						current.hp = current.maxHp;
						current.hujia = 0;
						current.classList.remove("turnedover");
						current.removeLink();
						current.directgain(get.cards(4 - dnum));
					}
				},
				async (event, trigger, player) => {
					while (_status.event.name !== "phaseLoop") {
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
			],
		},
		boss_xuanlin: {
			trigger: { global: "gameStart" },
			forced: true,
			popup: false,
			fixed: true,
			unique: true,
			async content(event, trigger, player) {
				player.smoothAvatar();
				player.init("boss_xuanwu");
				_status.noswap = true;
				game.addVideo("reinit2", player, player.name);
			},
		},
		boss_xuanlin2: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_xuanlin2x",
			trigger: { player: "dieBegin" },
			silent: true,
			unique: true,
			fixed: true,
			filter(event, player) {
				return player === game.boss;
			},
			async content(event, trigger, player) {
				player.hide();
				game.addVideo("hidePlayer", player);
			},
		},
		boss_xuanlin2x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			globalFixed: true,
			unique: true,
			fixed: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_xuanlin2");
			},
			content: [
				async (event, trigger, player) => {
					await game.delay();
					if (game.me !== game.boss) {
						game.boss.changeSeat(6);
					} else {
						game.boss.nextSeat.changeSeat(3);
						game.boss.previousSeat.changeSeat(5);
					}
					game.changeBoss("boss_shuishengonggong");
					for (const current of game.players) {
						current.hp = current.maxHp;
						current.update();
					}
					await game.delay(0.5);
				},
				async (event, trigger, player) => {
					game.addBossFellow(game.me === game.boss ? 1 : 7, "boss_shuishenxuanming");
				},
				async (event, trigger, player) => {
					let dnum = 0;
					const dead = game.dead.slice(0);
					for (const current of dead) {
						if (!current.side && current.maxHp > 0 && current.parentNode === player.parentNode) {
							current.revive(current.maxHp);
							dnum++;
						}
					}
					for (const current of game.players) {
						if (current.side) {
							continue;
						}
						current.removeEquipTrigger();
						const hej = current.getCards("hej");
						for (const card of hej) {
							card.discard(false);
						}
						current.hp = current.maxHp;
						current.hujia = 0;
						current.classList.remove("turnedover");
						current.removeLink();
						current.directgain(get.cards(4 - dnum));
					}
				},
				async (event, trigger, player) => {
					while (_status.event.name !== "phaseLoop") {
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
			],
		},
		boss_xuanlin3: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_xuanlin3x",
			trigger: { player: "dieBegin" },
			silent: true,
			fixed: true,
			unique: true,
			filter(event, player) {
				return !game.boss || game.boss.name !== "boss_zhuanxu";
			},
			async content(event, trigger, player) {
				player.hide();
				game.addVideo("hidePlayer", player);
				if (player.nextSeat.side === player.side) {
					player.nextSeat.hide();
					game.addVideo("hidePlayer", player.nextSeat);
				}
				if (player.previousSeat.side === player.side) {
					player.previousSeat.hide();
					player.previousSeat.node.handcards1.hide();
					player.previousSeat.node.handcards2.hide();
					game.addVideo("hidePlayer", player.previousSeat);
					game.addVideo("deleteHandcards", player.previousSeat);
				}
			},
		},
		boss_xuanlin3x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			fixed: true,
			globalFixed: true,
			unique: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				if (game.boss && game.boss.name === "boss_zhuanxu") {
					return false;
				}
				return event.player.hasSkill("boss_xuanlin3");
			},
			content: [
				async (event, trigger, player) => {
					await game.delay();
					game.changeBoss("boss_zhuanxu");
					await game.delay(0.5);
				},
				async (event, trigger, player) => {
					game.addBossFellow(game.me === game.boss ? 7 : 5, "boss_shuishengonggong");
					game.changeBoss("boss_shuishenxuanming", game.boss.nextSeat);
					game.boss.previousSeat.maxHp--;
					game.boss.previousSeat.update();
					game.boss.nextSeat.maxHp--;
					game.boss.nextSeat.update();
				},
				async (event, trigger, player) => {
					let dnum = 0;
					const dead = game.dead.slice(0);
					for (const current of dead) {
						if (!current.side && current.maxHp > 0 && current.parentNode === player.parentNode) {
							current.revive(current.maxHp);
							dnum++;
						}
					}
					for (const current of game.players) {
						if (current.side) {
							continue;
						}
						current.removeEquipTrigger();
						const hej = current.getCards("hej");
						for (const card of hej) {
							card.discard(false);
						}
						current.hp = current.maxHp;
						current.hujia = 0;
						current.classList.remove("turnedover");
						current.removeLink();
						current.directgain(get.cards(4 - dnum));
					}
				},
				async (event, trigger, player) => {
					while (_status.event.name !== "phaseLoop") {
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
			],
		},
		boss_baimang: {
			trigger: { global: "gameStart" },
			forced: true,
			popup: false,
			fixed: true,
			unique: true,
			async content(event, trigger, player) {
				player.smoothAvatar();
				player.init("boss_baihu");
				_status.noswap = true;
				game.addVideo("reinit2", player, player.name);
			},
		},
		boss_baimang2: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_baimang2x",
			trigger: { player: "dieBegin" },
			silent: true,
			unique: true,
			fixed: true,
			filter(event, player) {
				return player === game.boss;
			},
			async content(event, trigger, player) {
				player.hide();
				game.addVideo("hidePlayer", player);
			},
		},
		boss_baimang2x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			globalFixed: true,
			unique: true,
			fixed: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_baimang2");
			},
			content: [
				async (event, trigger, player) => {
					await game.delay();
					if (game.me !== game.boss) {
						game.boss.changeSeat(6);
					} else {
						game.boss.nextSeat.changeSeat(3);
						game.boss.previousSeat.changeSeat(5);
					}
					game.changeBoss("boss_jinshenrushou");
					for (const current of game.players) {
						current.hp = current.maxHp;
						current.update();
					}
					await game.delay(0.5);
				},
				async (event, trigger, player) => {
					game.addBossFellow(game.me === game.boss ? 1 : 5, "boss_mingxingzhu");
					game.addBossFellow(7, "boss_mingxingzhu");
				},
				async (event, trigger, player) => {
					let dnum = 0;
					const dead = game.dead.slice(0);
					for (const current of dead) {
						if (!current.side && current.maxHp > 0 && current.parentNode === player.parentNode) {
							current.revive(current.maxHp);
							dnum++;
						}
					}
					for (const current of game.players) {
						if (current.side) {
							continue;
						}
						current.removeEquipTrigger();
						const hej = current.getCards("hej");
						for (const card of hej) {
							card.discard(false);
						}
						current.hp = current.maxHp;
						current.hujia = 0;
						current.classList.remove("turnedover");
						current.removeLink();
						current.directgain(get.cards(4 - dnum));
					}
				},
				async (event, trigger, player) => {
					while (_status.event.name !== "phaseLoop") {
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
			],
		},
		boss_baimang3: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_baimang3x",
			trigger: { player: "dieBegin" },
			silent: true,
			fixed: true,
			unique: true,
			filter(event, player) {
				return player === game.boss;
			},
			async content(event, trigger, player) {
				player.hide();
				player.nextSeat.hide();
				player.previousSeat.hide();
				game.addVideo("hidePlayer", player);
				game.addVideo("hidePlayer", player.nextSeat);
				game.addVideo("hidePlayer", player.previousSeat);
			},
		},
		boss_baimang3x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			fixed: true,
			globalFixed: true,
			unique: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_baimang3");
			},
			content: [
				async (event, trigger, player) => {
					await game.delay();
					game.changeBoss("boss_shaohao");
					await game.delay(0.5);
				},
				async (event, trigger, player) => {
					game.changeBoss("boss_jinshenrushou", game.boss.previousSeat);
					game.changeBoss("boss_mingxingzhu", game.boss.nextSeat);
					game.boss.previousSeat.maxHp--;
					game.boss.previousSeat.update();
					if (game.me !== game.boss) {
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
				},
				async (event, trigger, player) => {
					let dnum = 0;
					const dead = game.dead.slice(0);
					for (const current of dead) {
						if (!current.side && current.maxHp > 0 && current.parentNode === player.parentNode) {
							current.revive(current.maxHp);
							dnum++;
						}
					}
					for (const current of game.players) {
						if (current.side) {
							continue;
						}
						current.removeEquipTrigger();
						const hej = current.getCards("hej");
						for (const card of hej) {
							card.discard(false);
						}
						current.hp = current.maxHp;
						current.hujia = 0;
						current.classList.remove("turnedover");
						current.removeLink();
						current.directgain(get.cards(4 - dnum));
					}
				},
				async (event, trigger, player) => {
					while (_status.event.name !== "phaseLoop") {
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
			],
		},
		boss_shenyi: {
			unique: true,
			mod: {
				judge(player, result) {
					if (_status.event.type === "phase") {
						if (result.bool === false) {
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
			filter(event, player) {
				return !player.isTurnedOver();
			},
			async content(event, trigger, player) {
				trigger.cancel();
				game.log(player, "取消了翻面");
			},
			ai: {
				noturn: true,
				effect: {
					target(card, player, target) {
						if (get.type(card) === "delay") {
							return 0.5;
						}
					},
				},
			},
		},
		honghuangzhili: {
			init(player) {
				player.disableSkill("honghuangzhili", "boss_shenyi");
			},
			mark: true,
			nopop: true,
			intro: {
				content: "【神裔】无效直到下家的回合开始",
			},
			marktext: "荒",
			onremove(player) {
				player.enableSkill("honghuangzhili", "boss_shenyi");
			},
			trigger: { global: "phaseZhunbeiBegin" },
			forced: true,
			popup: false,
			filter(event, player) {
				return event.player === player.next;
			},
			async content(event, trigger, player) {
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
				targetInRange(card, player) {
					if (player.side) {
						return true;
					}
				},
				maxHandcard(player, num) {
					if (!player.side) {
						return num + 1;
					}
				},
			},
			trigger: { player: "phaseDrawBegin" },
			forced: true,
			sourceSkill: "boss_shenen",
			filter(event, player) {
				return !player.side;
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
		},
		boss_fentian: {
			trigger: { source: "damageBegin1" },
			forced: true,
			filter(event) {
				return !event.hasNature("fire");
			},
			async content(event, trigger, player) {
				trigger.hasNature("fire");
			},
			mod: {
				cardUsable(card) {
					if (get.color(card) === "red") {
						return Infinity;
					}
				},
				targetInRange(card) {
					if (get.color(card) === "red") {
						return true;
					}
				},
				wuxieRespondable(card, player, target) {
					if (get.color(card) === "red" && player !== target) {
						return false;
					}
				},
			},
			group: "boss_fentian2",
		},
		boss_fentian2: {
			trigger: { player: "useCard" },
			forced: true,
			sourceSkill: "boss_fentian",
			filter(event, player) {
				return get.color(event.card) === "red";
			},
			async content(event, trigger, player) {
				trigger.directHit.addArray(game.players);
				trigger.directHit.remove(player);
			},
		},
		boss_xingxia: {
			enable: "phaseUse",
			mode: ["boss"],
			filter(event, player) {
				if (!game.hasPlayer(current => current.name === "boss_yanling")) {
					return false;
				}
				return !player.storage.boss_xingxia || game.roundNumber - player.storage.boss_xingxia >= 2;
			},
			unique: true,
			filterTarget(card, player, target) {
				return target.name === "boss_yanling";
			},
			selectTarget: -1,
			line: "fire",
			async content(event, trigger, player) {
				await event.target.damage({ num: 2, nature: "fire" });
			},
			async contentAfter(event, trigger, player) {
				player.storage.boss_xingxia = game.roundNumber;
				const result = await player
					.chooseTarget({
						filterTarget: (card, player, target) => target.side !== player.side,
						ai: target => get.damageEffect(target, player, player, "fire"),
					})
					.forResult();
				if (!result.bool || !player.isIn()) {
					return;
				}
				const target = result.targets[0];
				player.line(target, "fire");
				const discardResult = await target
					.chooseToDiscard({
						position: "he",
						filterCard: { color: "red" },
						prompt: "弃置一张红色牌或受到1点火焰伤害",
						ai: card => {
							const player = _status.event.player;
							const source = _status.event.parent.player;
							if (get.damageEffect(player, source, player, "fire") >= 0) {
								return 0;
							}
							return 8 - get.value(card);
						},
					})
					.forResult();
				if (!discardResult.bool && player.isIn()) {
					await target.damage({ nature: "fire" });
				}
			},
			ai: {
				order: 6,
				result: {
					target(player, target) {
						if (target.isLinked() && player.isLinked() && get.damageEffect(player, player, player, "fire") < 0) {
							return -1;
						}
						return 1;
					},
				},
			},
		},
		boss_huihuo: {
			global: "boss_huihuo2",
			unique: true,
			mod: {
				cardUsable(card, player, num) {
					if (card.name === "sha") {
						return num + 1;
					}
				},
			},
			ai: {
				revertsave: true,
				effect: {
					target(card, player, target) {
						if (!game.boss) {
							return;
						}
						if (card.name === "tiesuo") {
							if (_status.event.player === game.boss) {
								return "zeroplayertarget";
							}
							return 0.5;
						}
						if (get.tag(card, "damage") || get.tag(card, "recover")) {
							if (game.boss.isLinked() && get.damageEffect(game.boss, player, game.boss, "fire") < 0) {
								if (
									game.hasPlayer(current => {
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
								if (player.isEnemyOf(target) && player.hp >= -1) {
									return [0, 0, 0, 1];
								}
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
			sourceSkill: "boss_huihuo",
			filter(event, player) {
				return event.player.hasSkill("boss_huihuo") && event.player.isDead() && player.isEnemyOf(event.player);
			},
			async content(event, trigger, player) {
				trigger.player.line(player, "fire");
				player.damage({ nosource: true, nature: "fire", num: 3 }).animate = false;
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
			filter(event, player) {
				return event.type === "dying" && event.dying.hasSkill("boss_furan") && player.isEnemyOf(event.dying);
			},
			filterCard(card) {
				return get.color(card) === "red";
			},
			position: "he",
			viewAs: { name: "tao" },
			prompt: "将一张红色牌当桃使用",
			sourceSkill: "boss_furan",
			check(card) {
				return 8 - get.value(card);
			},
			ai: {
				order: 5,
				skillTagFilter(player) {
					const event = _status.event;
					if (event.dying && event.dying.hasSkill("boss_furan") && player.isEnemyOf(event.dying)) {
						return player.hasCards("he", { color: "red" }) && _status.currentPhase !== player;
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
			filter(event, player) {
				return [3, 5, 7].includes(game.roundNumber);
			},
			async content(event, trigger, player) {
				if (game.roundNumber === 3) {
					const enemies = game.filterPlayer(current => current.isEnemyOf(player));
					player.line(enemies, "green");
					for (const enemy of enemies) {
						enemy.addSkill("boss_chiyi2");
					}
					return;
				}
				let targets;
				let num;
				if (game.roundNumber === 5) {
					targets = game.filterPlayer().sortBySeat();
					num = 1;
				} else {
					targets = game.filterPlayer(current => current.name === "boss_yanling").sortBySeat();
					num = 5;
				}
				for (const target of targets) {
					player.line(target, "fire");
					await target.damage({ num, nature: "fire" });
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
			sourceSkill: "boss_chiyi",
			async content(event, trigger, player) {
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
					filter(event, player) {
						if (!player.storage.boss_buchun || game.roundNumber - player.storage.boss_buchun >= 2) {
							return game.dead.some(current => current.parentNode === player.parentNode && current.name === "boss_shujing");
						}
						return false;
					},
					async content(event, trigger, player) {
						const loseHp = player.loseHp();
						player.storage.boss_buchun = game.roundNumber;
						await loseHp;
						if (!player.isIn()) {
							return;
						}
						const targets = game.dead.filter(current => current.parentNode === player.parentNode && current.name === "boss_shujing");
						if (targets[0] === player.previousSeat) {
							targets.push(targets.shift());
						}
						for (const target of targets) {
							player.line(target, "green");
							target.revive(1);
							const draw = target.draw({ num: 2 }).set("animate", false);
							target.$draw(2);
							await draw;
							if (!player.isIn()) {
								return;
							}
						}
						await game.delay();
					},
					ai: {
						order: 6,
						result: {
							player(player, target) {
								if (player.hp <= 1) {
									return 0;
								}
								if (player.hp <= 3 && game.hasPlayer(current => current.name === "boss_shujing" && current.hp === 1)) {
									if (_status.event.getRand() < 0.4) {
										return 0;
									}
								}
								if (player.hp >= 3) {
									return 1;
								}
								if (player.hp >= 2 && player !== game.boss) {
									return 1;
								}
								if (game.hasPlayer(current => current.name === "boss_shujing")) {
									return 0;
								}
								return 1;
							},
						},
					},
				},
				recover: {
					enable: "phaseUse",
					filter(event, player) {
						if (!player.storage.boss_buchun || game.roundNumber - player.storage.boss_buchun >= 2) {
							return !game.dead.some(current => current.parentNode === player.parentNode && current.name === "boss_shujing");
						}
						return false;
					},
					prompt: "令一名己方角色回复2点体力",
					filterTarget(card, player, target) {
						return target.isFriendOf(player) && target.isDamaged();
					},
					async content(event, trigger, player) {
						const recover = event.target.recover(2);
						player.storage.boss_buchun = game.roundNumber;
						await recover;
					},
					ai: {
						order: 6,
						result: {
							target(player, target) {
								let num = 1;
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
			filter(event, player) {
				if (event._notrigger.includes(event.player)) {
					return false;
				}
				return event.player.isIn() && event.player.isEnemyOf(player) && !event.player.hasSkill("boss_zhongdu");
			},
			logTarget: "player",
			async content(event, trigger, player) {
				trigger.player.addSkill("boss_zhongdu");
				const boss = game.findPlayer(current => {
					return current.name === "boss_mushengoumang";
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
			async content(event, trigger, player) {
				const result = await player
					.judge({
						judge: card => {
							const suit = get.suit(card);
							if (suit === "spade") {
								return -1;
							}
							if (suit === "heart") {
								return 1;
							}
							return 0;
						},
					})
					.forResult();
				if (result.suit !== "spade") {
					player.removeSkill("boss_zhongdu");
				}
				if (result.suit !== "heart") {
					await player.damage({ nosource: true });
				}
			},
		},
		boss_qingyi: {
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			unique: true,
			filter(event, player) {
				return [3, 5, 7].includes(game.roundNumber);
			},
			async content(event, trigger, player) {
				let targets;
				let command;
				if (game.roundNumber === 7) {
					let goumang;
					let shujing;
					for (const current of game.players) {
						if (current.name === "boss_mushengoumang") {
							goumang = current;
						}
						if (current.name === "boss_shujing") {
							shujing = current;
						}
					}
					if (!goumang || !shujing) {
						for (const current of game.dead) {
							if (current.parentNode !== player.parentNode) {
								continue;
							}
							if (current.name === "boss_mushengoumang") {
								goumang = current;
							}
							if (current.name === "boss_shujing") {
								shujing = current;
							}
						}
					}
					targets = [];
					if (goumang) {
						targets.push(goumang);
					}
					if (shujing) {
						targets.push(shujing);
					}
					command = "revive";
				} else if (game.roundNumber === 5) {
					targets = game.filterPlayer(current => current.isEnemyOf(player)).sortBySeat();
					command = "loseHp";
				} else {
					targets = game.filterPlayer(current => current.isFriendOf(player)).sortBySeat();
					command = "recover";
				}
				let delay = false;
				for (const target of targets) {
					player.line(target, "green");
					if (command === "revive") {
						player.line(target, "green");
						if (target.isDead()) {
							target.maxHp++;
							target.revive(3);
						} else {
							target.gainMaxHp();
							target.recover(3);
						}
						const draw = target.draw({ num: 3 }).set("animate", false);
						target.$draw(3);
						delay = true;
						await draw;
					} else {
						await target[command]();
					}
					if (!player.isIn()) {
						return;
					}
				}
				if (delay) {
					await game.delay();
				}
			},
		},
		boss_qizuo: {
			trigger: { player: "useCardAfter" },
			filter(event, player) {
				if (event.parent.name === "boss_qizuo") {
					return false;
				}
				if (!event.targets || !event.card) {
					return false;
				}
				if (event.card && event.card.name === "wuxie") {
					return false;
				}
				const type = get.type(event.card);
				if (type !== "trick") {
					return false;
				}
				const card = game.createCard(event.card.name, event.card.suit, event.card.number, event.card.nature);
				const targets = event._targets || event.targets;
				for (const target of targets) {
					if (!target.isIn()) {
						return false;
					}
					if (!player.canUse({ name: event.card.name }, target, false, false)) {
						return false;
					}
				}
				return true;
			},
			check(event, player) {
				if (event.card.name === "tiesuo") {
					return false;
				}
				return true;
			},
			async content(event, trigger, player) {
				const card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
				player.useCard({ card: card, targets: (trigger._targets || trigger.targets).slice(0) });
			},
			ai: {
				threaten: 1.3,
			},
		},
		boss_guimou: {
			trigger: { player: "phaseJieshuBegin" },
			frequent: true,
			async content(event, trigger, player) {
				const list = game.filterPlayer(target => {
					return target !== player && !target.isMad();
				});
				if (list.length) {
					const target = list.randomGet();
					player.line(target, "green");
					target.goMad({ player: "phaseAfter" });
				}
			},
		},
		boss_yuance: {
			trigger: { global: "damageEnd" },
			filter(event) {
				return event.source && event.source !== event.player && event.source.isAlive() && event.player.isAlive();
			},
			async cost(event, trigger, player) {
				const att1 = get.attitude(player, trigger.player);
				const att2 = get.attitude(player, trigger.source);
				const targets = player.getEnemies();
				let stop = false;
				for (const target of targets) {
					const skills = target.getSkills();
					for (const skill of skills) {
						if (get.tag(skill, "rejudge", target)) {
							stop = true;
							break;
						}
					}
				}
				const rand = Math.random() < 0.5 ? "选项一" : "选项二";
				const sourcename = get.translation(trigger.source);
				const playername = get.translation(trigger.player);
				const result = await player
					.chooseControl({
						controls: ["选项一", "选项二", "cancel2"],
						prompt: get.prompt(event.skill),
						choiceList: [`若判定结果为黑色，${playername}失去1点体力，否则${sourcename}失去1点体力`, `若判定结果为红色，${playername}回复1点体力，否则${sourcename}回复1点体力`],
						ai: () => {
							if (att1 === 0 && att2 === 0) {
								return rand;
							}
							if (att1 * att2 >= 0) {
								return att1 + att2 > 0 ? "选项二" : "选项一";
							}
							if (trigger.player.isHealthy() && trigger.source.isHealthy()) {
								return rand;
							}
							if (trigger.player.isHealthy()) {
								if (att1 < 0) {
									return "选项二";
								}
								if (att1 > 0 && !stop) {
									return "选项一";
								}
							}
							if (trigger.source.isHealthy()) {
								if (att2 < 0) {
									return "选项二";
								}
								if (att2 > 0 && !stop) {
									return "选项一";
								}
							}
							return stop ? "cancel2" : rand;
						},
					})
					.forResult();
				event.result = {
					bool: result.control !== "cancel2",
					cost_data: result.control,
					skill_popup: false,
				};
			},
			async content(event, trigger, player) {
				const att1 = get.attitude(player, trigger.player);
				const att2 = get.attitude(player, trigger.source);
				if (event.cost_data === "选项一") {
					const result = await player
						.judge({
							judge: card => {
								const att = get.color(card) === "black" ? att1 : att2;
								if (att > 0) {
									return -1;
								}
								return att < 0 ? 1 : 0;
							},
						})
						.forResult();
					if (result.color === "black") {
						await trigger.player.loseHp();
					} else {
						await trigger.source.loseHp();
					}
				} else {
					const result = await player
						.judge({
							judge: card => {
								const red = get.color(card) === "red";
								const target = red ? trigger.player : trigger.source;
								if (!target.isDamaged()) {
									return 0;
								}
								const att = red ? att1 : att2;
								if (att > 0) {
									return 1;
								}
								return att < 0 ? -1 : 0;
							},
						})
						.forResult();
					if (result.color === "red") {
						await trigger.player.recover();
					} else {
						await trigger.source.recover();
					}
				}
			},
		},
		boss_guixin: {
			trigger: { global: "drawAfter" },
			forced: true,
			logTarget: "player",
			filter(event, player) {
				return event.result && event.result.length >= 2 && event.player !== player;
			},
			async content(event, trigger, player) {
				const result = await trigger.player
					.chooseCard({
						filterCard: card => trigger.result.includes(card),
						prompt: `归心：交给${get.translation(player)}一张牌`,
						forced: true,
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				trigger.player.$give(1, player);
				await player.gain({ cards: result.cards, source: trigger.player });
			},
		},
		xiongcai: {
			unique: true,
			trigger: { player: "phaseAfter" },
			direct: true,
			init(player) {
				player.storage.xiongcai = [];
			},
			intro: {
				content: "characters",
			},
			content: [
				async (event, trigger, player) => {
					player.logSkill("xiongcai");
					const list = [];
					const list2 = [];
					const players = game.players.concat(game.dead);
					for (const target of players) {
						list2.add(target.name);
						list2.add(target.name1);
						list2.add(target.name2);
					}
					for (const i in lib.character) {
						if (lib.character[i][1] !== "wei") {
							continue;
						}
						if (lib.character[i].isBoss) {
							continue;
						}
						if (lib.character[i].isMinskin) {
							continue;
						}
						if (player.storage.xiongcai.includes(i)) {
							continue;
						}
						if (list2.includes(i)) {
							continue;
						}
						list.push(i);
					}
					const name = list.randomGet();
					player.storage.xiongcai.push(name);
					player.markSkill("xiongcai");
					const skills = lib.character[name][3];
					for (const skill of skills) {
						player.addSkill(skill);
					}
					event.dialog = ui.create.dialog(`<div class="text center">${get.translation(player)}发动了【雄才】`, [[name], "character"]);
					await game.delay(2);
				},
				async (event, trigger, player) => {
					event.dialog.close();
				},
			],
		},
		xiaoxiong: {
			trigger: { global: "useCardAfter" },
			forced: true,
			unique: true,
			forceunique: true,
			filter(event, player) {
				const type = get.type(event.card, "trick");
				return event.player !== player && (type === "basic" || type === "trick");
			},
			async content(event, trigger, player) {
				player.gain({ cards: [game.createCard(trigger.card)], animate: "gain2" });
			},
			group: "xiaoxiong_damage",
			subSkill: {
				damage: {
					trigger: { global: "phaseJieshuBegin" },
					forced: true,
					filter(event, player) {
						return event.player !== player && event.player.countUsed() === 0;
					},
					logTarget: "player",
					async content(event, trigger, player) {
						trigger.player.damage();
					},
				},
			},
		},
		boss_zhangwu: {
			global: "boss_zhangwu_ai",
			trigger: { player: "damageEnd" },
			check(event, player) {
				return event.source && event.source.isIn() && get.damageEffect(event.source, player, player) > 0;
			},
			filter(event) {
				return event.source && event.source.isAlive();
			},
			logTarget: "source",
			async cost(event, trigger, player) {
				event.result = await player
					.chooseToDiscard({
						prompt: get.prompt(event.skill, trigger.source),
						position: "he",
						selectCard: [1, Infinity],
						allowChooseAll: true,
						chooseonly: true,
						ai: card => (get.attitude(player, trigger.source) < 0 ? 8 - get.value(card) : 0),
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const { cards } = event;
				await player.discard({ cards, discarder: player });
				const num = cards.length;
				const cnum = get.cnNumber(num);
				const result = await trigger.source
					.chooseToDiscard({
						prompt: `章武：弃置${cnum}张牌，或取消并受到${cnum}点伤害`,
						position: "he",
						selectCard: num,
						ai: card => (trigger.source.hasSkillTag("nodamage", null, { source: player }) ? 0 : 10 - get.value(card)),
					})
					.forResult();
				if (!result.bool) {
					await trigger.source.damage(num);
				}
			},
			ai: {
				maixie: true,
				maixie_hp: true,
				effect: {
					target(card, player, target) {
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
					target_use(card, player, target) {
						if (get.tag(card, "recover") && card.name !== "recover") {
							for (const current of game.players) {
								if (current.hasSkill("xiaoxiong") && get.attitude(target, current) < 0) {
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
				content(storage, player) {
					let str = `扣减${7 - player.storage.xiangxing_count}点体力后失去下一枚星；`;
					str += `防止禳星伤害条件：${lib.translate[`xiangxing${player.storage.xiangxing}_info`]}`;
					return str;
				},
				markcount(storage, player) {
					return Math.max(0, 7 - player.storage.xiangxing_count);
				},
			},
			skipDamage: {
				x7(player) {
					return !player.hasCards("h");
				},
				x6(player, event) {
					if (event.hasNature) {
						return event.hasNature("fire");
					}
				},
				x5(player, event) {
					if (event.hasNature) {
						return event.hasNature("thunder");
					}
				},
				x4(player, event) {
					return event.name === "loseHp";
				},
				x3(player, event) {
					return game.hasPlayer(current => {
						return current !== player && current.countCards("e") >= 4;
					});
				},
				x2(player) {
					return player.countCards("j") >= 2;
				},
				x1() {
					return game.players.length === 2;
				},
			},
			ai: {
				combo: "xiangxing",
				neg: true,
				effect: {
					target(card, player, target) {
						if (!target.hasSkill("xiangxing") || !target.storage.xiangxing || target.storage.xiangxing_count < 6) {
							return;
						}
						switch (target.storage.xiangxing) {
							case 7:
								if (get.tag(card, "discard") || get.tag(card, "lose")) {
									if (player !== target) {
										return [1, 0, 1, 6 / (1 + target.countCards("h"))];
									}
								}
								if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
									if (target.hasCards("h")) {
										return [1, 7, 1, -7];
									}
								}
								break;
							case 6:
								if (typeof card === "object" && game.hasNature(card, "fire")) {
									return;
								}
								if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
									return [1, 6, 1, -6];
								}
								break;
							case 5:
								if (typeof card !== "object" || game.hasNature(card, "thunder")) {
									return;
								}
								if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
									return [1, 5, 1, -5];
								}
								break;
							case 4:
								if (get.tag(card, "damage")) {
									return [1, 2, 1, -2];
								}
								if (get.tag(card, "loseHp")) {
									return [1, -4];
								}
								break;
							case 3:
								if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
									if (
										!game.hasPlayer(current => {
											return current !== target && current.countCards("e") >= 4;
										})
									) {
										return [1, 3, 1, -3];
									}
								}
								break;
							case 2:
								if (typeof card === "object" && get.type(card) === "delay") {
									if (target.hasCards("j")) {
										return [1, -4];
									}
								}
								if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
									if (target.countCards("j") <= 2) {
										return [1, 2, 1, -3];
									}
								}
								break;
							case 1:
								if (game.players.length !== 2) {
									return [1, 2, 1, -3];
								}
						}
					},
				},
			},
		},
		xiangxing: {
			unique: true,
			init(player) {
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
			content: [
				async (event, trigger, player) => {
					const num = trigger.num;
					if (num) {
						player.storage.xiangxing_count += num;
					}

					if (player.storage.xiangxing_count >= 7) {
						event.skipDamage = player.hasSkill("yueyin") && lib.skill.yueyin.skipDamage[`x${player.storage.xiangxing}`](player, trigger);
						player.removeSkill(`xiangxing${player.storage.xiangxing}`);
						player.storage.xiangxing--;
						player.storage.xiangxing_count = 0;
						player.updateMarks();
						if (player.storage.xiangxing) {
							player.addSkill(`xiangxing${player.storage.xiangxing}`);
						} else {
							player.awakenSkill(event.name);
						}
						player.popup("xiangxing");
						game.log(player, "失去了一枚星");
					} else {
						player.updateMarks();
						event.finish();
						return;
					}
				},
				async (event, trigger, player) => {
					if (!player.isIn()) {
						return;
					}
					if (!event.skipDamage) {
						const targets = game.filterPlayer();
						targets.remove(player);
						targets.sort(lib.sort.seat);
						const damageCounts = Array(targets.length).fill(0);
						for (let i = 0; i < 7; i++) {
							damageCounts[Math.floor(Math.random() * damageCounts.length)]++;
						}
						for (const [index, target] of targets.entries()) {
							const damage = target.damage({ num: damageCounts[index], nature: "thunder" });
							player.line(target, "thunder");
							await damage;
							if (!player.isIn()) {
								return;
							}
						}
					}
					if (player.storage.xiangxing === 0) {
						player.maxHp = 3;
						player.update();
					}
				},
			],
		},
		fengqi: {
			trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
			direct: true,
			async content(event, trigger, player) {
				const list = { basic: [], equip: [], trick: [], delay: [] };
				for (const name of lib.inpile) {
					const info = lib.card[name];
					if (info.autoViewAs || name === "yuansuhuimie") {
						continue;
					}
					if (!lib.filter.cardEnabled({ name }, player)) {
						continue;
					}
					if (!list[info.type]) {
						list[info.type] = [];
					}
					list[info.type].push([get.translation(lib.card[name].type), "", name]);
				}
				list.trick.sort(lib.sort.name);
				const dialog = ui.create.dialog("风起", [list.trick, "vcard"]);
				// for(var i in list){
				//		dialog.addText(get.translation(i)+'牌');
				//		dialog.add([list[i],'vcard']);
				// }
				const rand1 = Math.random() < 1 / 3;
				const rand2 = Math.random() < 0.5;
				const rand3 = Math.random() < 1 / 3;
				const rand4 = Math.random() < 1 / 3;
				const result = await player
					.chooseButton({
						dialog,
						ai: button => {
							const name = button.link[2];
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
								if (rand2) {
									return name === "chiyuxi" ? 0.8 : 0;
								}
								return name === "jingleishan" ? 0.8 : 0;
							}
							if (rand2) {
								return name === "wanjian" ? 0.8 : 0;
							}
							return name === "nanman" ? 0.8 : 0;
						},
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				await player.chooseUseTarget({
					card: { name: result.links[0][2], isCard: true },
					forced: true,
					addCount: false,
				});
			},
			ai: {
				threaten: 3,
			},
		},
		gaiming: {
			trigger: { player: "judgeBefore" },
			direct: true,
			priority: 1,
			unique: true,
			content: [
				async (event, trigger, player) => {
					const cards = get.cards(7);
					const result = await player
						.chooseCardButton({
							forced: true,
							cards,
							prompt: `改命：选择一张牌作为你的${trigger.judgestr}判定结果`,
							ai: button => {
								if (get.attitude(player, trigger.player) > 0) {
									return 1 + trigger.judge(button.link);
								}
								if (get.attitude(player, trigger.player) < 0) {
									return 1 - trigger.judge(button.link);
								}
								return 0;
							},
						})
						.forResult();
					if (!result.bool) {
						event.finish();
						return;
					}
					player.logSkill("gaiming", trigger.player);
					const card = result.links[0];
					cards.remove(card);
					const judgestr = `${get.translation(trigger.player)}的${trigger.judgestr}判定`;
					event.videoId = lib.status.videoId++;
					event.dialog = ui.create.dialog(judgestr);
					event.dialog.classList.add("center");
					event.dialog.videoId = event.videoId;

					game.addVideo("judge1", player, [get.cardInfo(card), judgestr, event.videoId]);
					for (const remainingCard of cards) {
						remainingCard.discard();
					}
					let node;
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
							card,
							judge: trigger.judge(card),
							node,
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
						await game.delay(2);
					} else {
						event.finish();
						return;
					}
				},
				async (event, trigger, player) => {
					ui.arena.classList.remove("thrownhighlight");
					event.dialog.close();
					game.addVideo("judge2", null, event.videoId);
					ui.clear();
					const resultCard = trigger.result.card;
					trigger.position.appendChild(resultCard);
					trigger.result.node.delete();
					await game.delay();
				},
			],
			ai: {
				effect: {
					target(card, player, target) {
						if (typeof card !== "object" || get.type(card) !== "delay") {
							return;
						}
						if (target.storage.xiangxing === 2 && target.storage.xiangxing_count > 4 && target.hasSkill("xiangxing") && target.hasSkill("yueyin")) {
							return;
						}
						return 0.13;
					},
				},
			},
		},
		tiandao: {
			audio: true,
			trigger: { global: "judge" },
			filter(event, player) {
				return player.hasCards("hes");
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCard(`${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`, "hes", card => {
						const player = get.player();
						const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
						if (mod2 !== "unchanged") {
							return mod2;
						}
						const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
						if (mod !== "unchanged") {
							return mod;
						}
						return true;
					})
					.set("ai", card => {
						const trigger = get.event().getTrigger();
						const { player, judging } = get.event();
						const result = trigger.judge(card) - trigger.judge(judging);
						const attitude = get.attitude(player, trigger.player);
						if (attitude === 0 || result === 0) {
							return 0;
						}
						if (attitude > 0) {
							return result;
						} else {
							return -result;
						}
					})
					.set("judging", trigger.player.judging[0])
					.forResult();
			},
			popup: false,
			async content(event, trigger, player) {
				const next = player.respond(event.cards, event.name, "highlight", "noOrdering");
				await next;
				const { cards } = next;
				if (cards?.length) {
					player.$gain2(trigger.player.judging[0]);
					await player.gain(trigger.player.judging[0]);
					trigger.player.judging[0] = cards[0];
					trigger.orderingCards.addArray(cards);
					game.log(trigger.player, "的判定牌改为", cards);
					await game.delay(2);
				}
			},
			ai: {
				rejudge: true,
				tag: { rejudge: 1 },
				threaten: 1.5,
			},
		},
		lianji: {
			audio: true,
			enable: "phaseUse",
			usable: 1,
			filterTarget(card, player, target) {
				if (player === target) {
					return false;
				}
				return target.hasCards("h");
			},
			selectTarget: 2,
			multitarget: true,
			multiline: true,
			filter(event, player) {
				return player.hasCards("h");
			},
			prepare: "throw",
			discard: false,
			filterCard: true,
			check(card) {
				return 6 - get.value(card);
			},
			async content(event, trigger, player) {
				const { targets, cards } = event;
				if (!targets[0].hasCards("h") || !targets[1].hasCards("h")) {
					return;
				}
				const result = await targets[0].chooseToCompare(targets[1]).forResult();
				const [winner, loser] = result.bool ? targets : [targets[1], targets[0]];
				winner.$gain2(cards);
				await winner.gain({ cards });
				await loser.damage({ source: winner });
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
			filterTarget(card, player, target) {
				return !target.hasSkill("mazui2");
			},
			check(card) {
				return 6 - get.value(card);
			},
			discard: false,
			prepare: "give",
			async content(event, trigger, player) {
				const { target, cards } = event;
				target.storage.mazui2 = cards[0];
				target.addSkill("mazui2");
				game.addVideo("storage", target, ["mazui2", get.cardInfo(target.storage.mazui2), "card"]);
			},
			ai: {
				expose: 0.2,
				result: {
					target(player, target) {
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
			mark: true,
			sourceSkill: "mazui",
			// intro: {
			// 	content: "expansion",
			// 	markcount: "expansion",
			// },
			filter(event) {
				return event.num > 0;
			},
			async content(event, trigger, player) {
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
			sourceSkill: "mazui",
			async content(event, trigger, player) {
				player.gain({ cards: [player.storage.mazui2], animate: "gain2" });
				game.log(player, "获得了", player.storage.mazui2);
				player.removeSkill("mazui3");
				delete player.storage.mazui2;
			},
		},
		yunshen: {
			trigger: { player: ["respond", "useCard"] },
			filter(event, player) {
				return event.card.name === "shan";
			},
			frequent: true,
			init(player) {
				player.storage.yunshen = 0;
			},
			async content(event, trigger, player) {
				player.storage.yunshen++;
				player.markSkill("yunshen");
			},
			ai: {
				effect: {
					target_use(card, player, target) {
						if (get.tag(card, "respondShan")) {
							const shans = target.countCards("h", "shan");
							const hs = target.countCards("h");
							if (shans > 1) {
								return [1, 1];
							}
							if (shans && hs > 2) {
								return [1, 1];
							}
							if (shans) {
								return [1, 0.5];
							}
							if (hs > 2) {
								return [1, 0.3];
							}
							if (hs > 1) {
								return [1, 0.2];
							}
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
			filter(event, player) {
				return player.storage.yunshen > 0;
			},
			async content(event, trigger, player) {
				player.draw(player.storage.yunshen);
				player.storage.yunshen = 0;
				player.unmarkSkill("yunshen");
			},
			mod: {
				globalTo(from, to, distance) {
					if (typeof to.storage.yunshen === "number") {
						return distance + to.storage.yunshen;
					}
				},
			},
		},
		lingbo: {
			audio: ["qingguo", 2],
			trigger: { player: ["respond", "useCard"] },
			filter(event, player) {
				return event.card.name === "shan";
			},
			frequent: true,
			async content(event, trigger, player) {
				player.draw(2);
			},
			ai: {
				mingzhi: false,
				effect: {
					target_use(card, player, target) {
						if (get.tag(card, "respondShan")) {
							const shans = target.countCards("h", "shan");
							const hs = target.countCards("h");
							if (shans > 1) {
								return [0, 1];
							}
							if (shans && hs > 2) {
								return [0, 1];
							}
							if (shans) {
								return [0, 0];
							}
							if (hs > 2) {
								return [0, 0];
							}
							if (hs > 1) {
								return [1, 0.5];
							}
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
			filter(event, player) {
				return event.card && get.color(event.card) === "red";
			},
			frequent: true,
			async content(event, trigger, player) {
				player.draw();
			},
			ai: {
				effect(card, player, target) {
					if (get.color(card) === "red") {
						return [1, 1];
					}
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
			filter(event, player) {
				return _status.currentPhase !== player;
			},
			async content(event, trigger, player) {
				player.draw();
			},
		},
		boss_ruizhi: {
			trigger: { global: "phaseZhunbeiBegin" },
			forced: true,
			filter(event, player) {
				return event.player !== player && (event.player.countCards("h") > 1 || event.player.countCards("e") > 1);
			},
			async content(event, trigger, player) {
				const target = trigger.player;
				player.line(target, "green");
				let num = 0;
				if (target.countCards("h") > 1) {
					num++;
				}
				if (target.countCards("e") > 1) {
					num++;
				}
				const result = await target
					.chooseCard({
						forced: true,
						prompt: "选择保留一张手牌和一张装备区内的牌，然后弃置其它牌",
						position: "he",
						filterCard: card => {
							switch (get.position(card)) {
								case "h": {
									if (ui.selected.cards.length) {
										return get.position(ui.selected.cards[0]) === "e";
									}
									return target.countCards("h") > 1;
								}
								case "e": {
									if (ui.selected.cards.length) {
										return get.position(ui.selected.cards[0]) === "h";
									}
									return target.countCards("e") > 1;
								}
							}
						},
						selectCard: num,
						ai: card => get.value(card),
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				const hs = target.getCards("h");
				const es = target.getCards("e");
				const he = [...(hs.length > 1 ? hs : []), ...(es.length > 1 ? es : [])].filter(card => !result.cards.includes(card));
				await target.discard({ cards: he });
			},
		},
		boss_nbaonu: {
			group: ["boss_nbaonu_sha"],
			trigger: { player: "phaseDrawBegin" },
			forced: true,
			priority: -1,
			async content(event, trigger, player) {
				if (player.hp > 4) {
					trigger.num = 4 + Math.floor(Math.random() * (player.hp - 3));
				} else {
					trigger.num = 4;
				}
			},
			subSkill: {
				sha: {
					mod: {
						cardUsable(card, player, num) {
							if (card.name === "sha" && player.hp < 5) {
								return Infinity;
							}
						},
					},
					trigger: { source: "damageBegin1" },
					filter(event, player) {
						return event.card && event.card.name === "sha" && event.notLink() && player.hp < 5;
					},
					forced: true,
					async content(event, trigger, player) {
						trigger.num++;
					},
				},
			},
		},
		boss_shouyi: {
			mod: {
				targetInRange() {
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
					async content(event, trigger, player) {
						player.storage.boss_mengtai_draw = true;
						player.storage.boss_mengtai_use = true;
					},
				},
				draw: {
					trigger: { player: "phaseDrawBegin" },
					forced: true,
					popup: false,
					async content(event, trigger, player) {
						player.storage.boss_mengtai_draw = false;
					},
				},
				use: {
					trigger: { player: "phaseUseBegin" },
					forced: true,
					popup: false,
					async content(event, trigger, player) {
						player.storage.boss_mengtai_use = false;
					},
				},
				discard: {
					trigger: { player: "phaseDiscardBefore" },
					forced: true,
					filter(event, player) {
						if (player.storage.boss_mengtai_use) {
							return true;
						}
						return false;
					},
					async content(event, trigger, player) {
						trigger.cancel();
					},
				},
				end: {
					trigger: { player: "phaseJieshuBegin" },
					forced: true,
					filter(event, player) {
						if (player.storage.boss_mengtai_draw) {
							return true;
						}
						return false;
					},
					async content(event, trigger, player) {
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
			filter(event, player) {
				if (player.name === "boss_nianshou_heti" || player.storage.boss_nbianshen) {
					return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				if (player.storage.boss_nbianshen) {
					const hp = player.hp;
					const maxHp = player.maxHp;
					const hujia = player.hujia;
					player.init(`boss_nianshou_${player.storage.boss_nbianshen_next}`);
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
				content(storage, player) {
					const map = {
						jingjue: "警觉",
						renxing: "任性",
						ruizhi: "睿智",
						baonu: "暴怒",
					};
					return `下一个状态：${map[player.storage.boss_nbianshen_next]}`;
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
			filter(event, player) {
				if (!ui.damageCount) {
					return false;
				}
				return event.num > 0 && player.isFriendOf(game.me) && event.player.isEnemyOf(game.me);
			},
			async content(event, trigger, player) {
				_status.damageCount += trigger.num;
				ui.damageCount.innerHTML = `伤害: ${_status.damageCount}`;
			},
		},
		boss_nianrui: {
			trigger: { player: "phaseDrawBegin" },
			forced: true,
			async content(event, trigger, player) {
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
					target(card, player, target, current) {
						if (card.name === "lebu" || card.name === "bingliang") {
							return 0.8;
						}
					},
				},
			},
		},
		boss_qixiang1: {
			trigger: { player: "judge" },
			forced: true,
			filter(event, player) {
				if (event.card) {
					if (event.card.viewAs) {
						return event.card.viewAs === "lebu";
					} else {
						return event.card.name === "lebu";
					}
				}
			},
			async content(event, trigger, player) {
				player.addTempSkill("boss_qixiang3", "judgeAfter");
			},
		},
		boss_qixiang2: {
			trigger: { player: "judge" },
			forced: true,
			filter(event, player) {
				if (event.card) {
					if (event.card.viewAs) {
						return event.card.viewAs === "bingliang";
					} else {
						return event.card.name === "bingliang";
					}
				}
			},
			async content(event, trigger, player) {
				player.addTempSkill("boss_qixiang4", "judgeAfter");
			},
		},
		boss_qixiang3: {
			mod: {
				suit(card, suit) {
					if (suit === "diamond") {
						return "heart";
					}
				},
			},
		},
		boss_qixiang4: {
			mod: {
				suit(card, suit) {
					if (suit === "spade") {
						return "club";
					}
				},
			},
		},
		boss_bianshen2: {
			charlotte: true,
			mode: ["boss"],
			fixed: true,
			global: "boss_bianshen2x",
			trigger: { player: "dieBegin" },
			silent: true,
			async content(event, trigger, player) {
				player.hide();
				game.addVideo("hidePlayer", player);
			},
		},
		boss_bianshen2x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			fixed: true,
			globalFixed: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_bianshen2");
			},
			async content(event, trigger, player) {
				await game.delay();
				game.changeBoss(["boss_niutou", "boss_mamian"].randomGet());
			},
		},
		boss_bianshen3: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_bianshen3x",
			trigger: { player: "dieBegin" },
			silent: true,
			fixed: true,
			async content(event, trigger, player) {
				player.hide();
				game.addVideo("hidePlayer", player);
			},
		},
		boss_bianshen3x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			fixed: true,
			globalFixed: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_bianshen3");
			},
			async content(event, trigger, player) {
				await game.delay();
				game.changeBoss(["boss_baiwuchang", "boss_heiwuchang"].randomGet());
			},
		},
		boss_bianshen4: {
			charlotte: true,
			mode: ["boss"],
			global: "boss_bianshen4x",
			trigger: { player: "dieBegin" },
			silent: true,
			fixed: true,
			async content(event, trigger, player) {
				player.hide();
				game.addVideo("hidePlayer", player);
			},
		},
		boss_bianshen4x: {
			charlotte: true,
			trigger: { global: "dieAfter" },
			forced: true,
			priority: -10,
			fixed: true,
			globalFixed: true,
			filter(event) {
				if (lib.config.mode !== "boss") {
					return false;
				}
				return event.player === game.boss && event.player.hasSkill("boss_bianshen4");
			},
			async content(event, trigger, player) {
				await game.delay();
				game.changeBoss(["boss_yecha", "boss_luocha"].randomGet());
			},
		},
		boss_moyany: {
			trigger: { player: "loseEnd" },
			frequent: true,
			unique: true,
			filter(event, player) {
				return _status.currentPhase !== player;
			},
			async content(event, trigger, player) {
				const judgeResult = await player.judge({ judge: card => (get.color(card) === "red" ? 1 : 0) }).forResult();
				if (!judgeResult.bool) {
					return;
				}
				const result = await player
					.chooseTarget({
						forced: true,
						prompt: "选择一个目标对其造成2点火焰伤害",
						filterTarget: (card, player, target) => player !== target,
						ai: target => get.damageEffect(target, player, player, "fire"),
					})
					.forResult();
				if (result.targets.length) {
					player.line(result.targets, "fire");
					await result.targets[0].damage({ num: 2, nature: "fire" });
				}
			},
			ai: {
				effect: {
					target(card) {
						if (get.tag(card, "loseCard")) {
							return [0.5, 1];
						}
					},
				},
			},
		},
		boss_danshu: {
			trigger: {
				player: "loseAfter",
				global: ["loseAsyncAfter", "gainAfter", "addJudgeAfter", "equipAfter", "addToExpansionAfter"],
			},
			frequent: true,
			unique: true,
			filter(event, player) {
				if (!event.getl?.(player)?.cards2?.length) {
					return false;
				}
				return _status.currentPhase !== player && player.isDamaged();
			},
			async content(event, trigger, player) {
				const result = await player
					.judge(card => {
						return get.color(card) === "red" ? 1 : 0;
					})
					.forResult();
				if (result?.color === "red") {
					await player.recover();
				}
			},
			ai: {
				effect: {
					target(card) {
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
			async content(event, trigger, player) {
				player.draw(2);
			},
		},
		boss_mojian: {
			trigger: { player: "phaseUseBegin" },
			async content(event, trigger, player) {
				const list = game.filterPlayer(current => {
					return player.canUse("wanjian", current) && current.isEnemyOf(player);
				});
				list.sort(lib.sort.seat);
				player.useCard({ card: { name: "wanjian" }, targets: list });
			},
			ai: {
				threaten: 1.8,
			},
		},
		boss_yushou: {
			trigger: { player: "phaseUseBegin" },
			async content(event, trigger, player) {
				const list = game.filterPlayer(current => {
					return player.canUse("nanman", current) && current.isEnemyOf(player);
				});
				list.sort(lib.sort.seat);
				player.useCard({ card: { name: "nanman" }, targets: list });
			},
		},
		boss_zuijiu: {
			trigger: { source: "damageBegin1" },
			filter(event) {
				return event.card && event.card.name === "sha" && event.getParent().name === "sha";
			},
			forced: true,
			async content(event, trigger, player) {
				trigger.num++;
			},
		},
		boss_xixing: {
			trigger: { player: "phaseZhunbeiBegin" },
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						filterTarget: (card, player, target) => player !== target && target.isLinked(),
						ai: target => get.damageEffect(target, player, player, "thunder"),
					})
					.forResult();
			},
			async content(event, trigger, player) {
				await event.targets[0].damage({ nature: "thunder" });
				await player.recover();
			},
		},
		boss_suoming: {
			trigger: { player: "phaseJieshuBegin" },
			filter(event, player) {
				return game.hasPlayer(current => current !== player && !current.isLinked());
			},
			async cost(event, trigger, player) {
				const num = game.countPlayer(current => current !== player && !current.isLinked());
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						selectTarget: [1, num],
						filterTarget: (card, player, target) => !target.isLinked() && player !== target,
						ai: target => -get.attitude(player, target),
					})
					.forResult();
			},
			async content(event, trigger, player) {
				for (const target of event.targets) {
					await target.link();
				}
			},
		},
		boss_taiping: {
			trigger: { player: "phaseDrawBegin" },
			forced: true,
			async content(event, trigger, player) {
				trigger.num += 2;
			},
		},
		boss_baolian: {
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			async content(event, trigger, player) {
				player.draw(2);
			},
		},
		boss_xiaoshou: {
			trigger: { player: "phaseJieshuBegin" },
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						filterTarget: (card, player, target) => player !== target && target.hp >= player.hp,
						ai: target => get.damageEffect(target, player, player),
					})
					.forResult();
			},
			async content(event, trigger, player) {
				await event.targets[0].damage(3);
			},
		},
		boss_manjia: {
			group: ["boss_manjia1", "boss_manjia2"],
			init(player, skill) {
				player.addExtraEquip(skill, "tengjia", true, player => !player.getEquips(2).length && lib.card.tengjia);
			},
			onremove(player, skill) {
				player.removeExtraEquip(skill);
			},
		},
		boss_manjia1: {
			trigger: { target: ["useCardToBefore", "shaBegin"] },
			forced: true,
			priority: 6,
			sourceSkill: "boss_manjia",
			filter(event, player, name) {
				if (player.getEquip(2)) {
					return false;
				}
				if (name === "shaBegin") {
					return lib.skill.tengjia3.filter(event, player);
				}
				return lib.skill.tengjia1.filter(event, player);
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
			ai: {
				effect: {
					target(card, player, target, current) {
						if (target.getEquip(2)) {
							return;
						}
						return lib.skill.tengjia1.ai.effect.target.apply(this, arguments);
					},
				},
			},
		},
		boss_manjia2: {
			trigger: { player: "damageBegin3" },
			sourceSkill: "boss_manjia",
			filter(event, player) {
				if (player.getEquip(2)) {
					return false;
				}
				if (event.hasNature("fire")) {
					return true;
				}
			},
			forced: true,
			check() {
				return false;
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
			ai: {
				effect: {
					target(card, player, target, current) {
						if (target.getEquip(2)) {
							return;
						}
						return lib.skill.tengjia2.ai.effect.target.apply(this, arguments);
					},
				},
			},
		},
		boss_lianyu: {
			trigger: { player: "phaseJieshuBegin" },
			unique: true,
			async content(event, trigger, player) {
				for (const current of get.players(player)) {
					if (!current.isEnemyOf(player)) {
						continue;
					}
					player.line(current, "fire");
					await current.damage({ nature: "fire" });
				}
			},
			ai: {
				threaten: 2,
			},
		},
		boss_guiji: {
			trigger: { player: "phaseJudgeBegin" },
			forced: true,
			async content(event, trigger, player) {
				player.discard({ cards: [player.getCards("j").randomGet()] });
			},
			filter(event, player) {
				return player.hasCards("j");
			},
			ai: {
				effect: {
					target(card, player, target, current) {
						if (get.type(card) === "delay" && !target.hasCards("j")) {
							return 0.1;
						}
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
			sourceSkill: "boss_minbao",
			filter(event, player) {
				return event.player.hasSkill("boss_minbao") && event.player.isDead();
			},
			async content(event, trigger, player) {
				trigger.player.line(player, "fire");
				player.damage({ nosource: true, nature: "fire" }).animate = false;
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
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						filterTarget: lib.filter.notMe,
						ai: target => get.damageEffect(target, player, player, "fire"),
					})
					.forResult();
			},
			async content(event, trigger, player) {
				await event.targets[0].damage({ nature: "fire" });
			},
		},
		boss_luolei: {
			trigger: { player: "phaseZhunbeiBegin" },
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						filterTarget: lib.filter.notMe,
						ai: target => get.damageEffect(target, player, player, "thunder"),
					})
					.forResult();
			},
			async content(event, trigger, player) {
				await event.targets[0].damage({ nature: "thunder" });
			},
		},
		boss_beiming: {
			trigger: { player: "dieBegin" },
			forced: true,
			filter(event) {
				return event.source != null;
			},
			async content(event, trigger, player) {
				trigger.source.discard({ cards: trigger.source.getCards("h") });
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
			async content(event, trigger, player) {
				const targets = game.filterPlayer(current => {
					return current.hasCards("e");
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
			sourceSkill: "boss_shanbeng",
			filter(event, player) {
				return player.hasCards("e") && event.player.hasSkill("boss_shanbeng") && event.player.isDead();
			},
			async content(event, trigger, player) {
				player.discard({ cards: player.getCards("e") });
			},
		},
		boss_didong: {
			trigger: { player: "phaseJieshuBegin" },
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						filterTarget: (card, player, target) => target.isEnemyOf(player),
						ai: target => {
							const att = get.attitude(player, target);
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
						},
					})
					.forResult();
			},
			async content(event, trigger, player) {
				await event.targets[0].turnOver();
			},
			ai: {
				threaten: 1.7,
			},
		},
		boss_guimei: {
			mod: {
				targetEnabled(card, player, target) {
					if (get.type(card) === "delay") {
						return false;
					}
				},
			},
		},
		boss_bianshen: {
			trigger: { global: "gameStart" },
			forced: true,
			popup: false,
			async content(event, trigger, player) {
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
			filter(event, player) {
				return event.card.name === "shan";
			},
			direct: true,
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget({
						prompt: get.prompt("boss_leiji"),
						ai: target => get.damageEffect(target, player, player, "thunder"),
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				player.logSkill("boss_leiji", result.targets, "thunder");
				const target = result.targets[0];
				const judgeResult = await target.judge({ judge: card => (get.color(card) === "black" ? -2 : 0) }).forResult();
				if (judgeResult.bool === false) {
					await target.damage({ nature: "thunder" });
					await player.draw();
				}
			},
			ai: {
				effect: {
					target_use(card, player, target, current) {
						if (get.tag(card, "respondShan")) {
							let hastarget = false;
							const players = game.filterPlayer();
							for (const current of players) {
								if (get.attitude(target, current) < 0) {
									hastarget = true;
									break;
								}
							}
							const be = target.countCards("e", { color: "black" });
							if (target.hasCards("h", "shan") && be) {
								if (!target.hasSkill("guidao")) {
									return 0;
								}
								return [0, hastarget ? target.countCards("he") / 2 : 0];
							}
							if (target.hasCards("h", "shan") && target.countCards("h") > 2) {
								if (!target.hasSkill("guidao")) {
									return 0;
								}
								return [0, hastarget ? target.countCards("h") / 4 : 0];
							}
							if (target.countCards("h") > 3 || (be && target.countCards("h") >= 2)) {
								return [0, 0];
							}
							if (!target.hasCards("h")) {
								return [1.5, 0];
							}
							if (target.countCards("h") === 1 && !be) {
								return [1.2, 0];
							}
							if (!target.hasSkill("guidao")) {
								return [1, 0.05];
							}
							return [1, Math.min(0.5, (target.countCards("h") + be) / 4)];
						}
					},
				},
			},
		},
		wuqin: {
			audio: 2,
			trigger: { player: "phaseJieshuBegin" },
			filter(event, player) {
				return !player.hasCards("h");
			},
			async content(event, trigger, player) {
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
			filter(event, player) {
				return game.hasPlayer(current => {
					return current !== player && current.hasCards("h");
				});
			},
			async content(event, trigger, player) {
				const players = get.players(player);
				players.remove(player);
				player.line(players, "green");
				for (const current of players) {
					const hs = current.getCards("h");
					if (!hs.length) {
						continue;
					}
					const card = hs.randomGet();
					const next = player.gain({ cards: [card], source: current });
					current.$giveAuto(card, player);
					await next;
				}
			},
		},
		guizhen: {
			audio: 2,
			trigger: { player: "loseEnd" },
			frequent: true,
			filter(event, player) {
				if (player.hasCards("h")) {
					return false;
				}
				return event.cards.some(card => card.original === "h");
			},
			async content(event, trigger, player) {
				const players = get.players(player);
				players.remove(player);
				for (const current of players) {
					const hs = current.getCards("h");
					if (hs.length) {
						const next = current.lose({ cards: hs });
						next._triggered = null;
						current.$throw(hs);
						await next;
					} else {
						await current.loseHp();
					}
					await game.delay(0.5);
				}
			},
		},
		boss_konghun: {
			trigger: { player: "phaseJieshuBegin" },
			filter() {
				return game.players.length >= 3;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt2(event.skill),
						filterTarget: lib.filter.notMe,
						ai: () => 1,
					})
					.forResult();
			},
			async content(event, trigger, player) {
				event.targets[0].goMad();
			},
			group: "boss_konghun2",
		},
		boss_konghun2: {
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			popup: false,
			sourceSkill: "boss_konghun",
			async content(event, trigger, player) {
				for (const current of game.players.concat(game.dead)) {
					if (current.isMad()) {
						current.unMad();
					}
				}
			},
		},
		yuehun: {
			unique: true,
			trigger: { player: "phaseJieshuBegin" },
			frequent: true,
			async content(event, trigger, player) {
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
			async content(event, trigger, player) {
				let current = player.next;
				do {
					const result = await current
						.chooseToUse({
							filterCard: { name: "sha" },
							filterTarget: (card, player, target) => {
								if (player === target) {
									return false;
								}
								if (get.distance(player, target) <= 1) {
									return true;
								}
								const players = game.filterPlayer();
								for (const current of players) {
									if (current === player) {
										continue;
									}
									if (get.distance(player, current) < get.distance(player, target)) {
										return false;
									}
								}
								return true;
							},
						})
						.forResult();
					const loseHp = result.bool === false ? current.loseHp() : null;
					// 在失去体力结算前确定下一名角色并安排延时。
					current = current.next;
					if (current !== player) {
						await game.delay(0.5);
					}
					if (loseHp) {
						await loseHp;
					}
				} while (current !== player);
			},
			ai: {
				order: 1,
				result: {
					player(player) {
						if (player.hasCards("h", "shan")) {
							return 1;
						}
						let num = 0;
						const players = game.filterPlayer();
						for (const current of players) {
							if (current.canUse("sha", player) && current.countCards("h") > 1) {
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
			async content(event, trigger, player) {
				for (const current of game.players) {
					if (current === player) {
						continue;
					}
					player.maxHp += current.maxHp;
					if (!current.name || !lib.character[current.name]) {
						continue;
					}
					const skills = lib.character[current.name][3];
					for (const skill of skills) {
						if (!lib.skill[skill].forceunique) {
							player.addSkill(skill);
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
					target(card) {
						if (card.name === "bingliang") {
							return [0, 0];
						}
					},
				},
			},
		},
		huanhua2: {
			trigger: { player: "phaseDrawBefore" },
			priority: 10,
			forced: true,
			popup: false,
			sourceSkill: "huanhua",
			check() {
				return false;
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
		},
		huanhua3: {
			trigger: { global: "drawAfter" },
			forced: true,
			sourceSkill: "huanhua",
			filter(event, player) {
				if (event.parent.name !== "phaseDraw") {
					return false;
				}
				return event.player !== player;
			},
			async content(event, trigger, player) {
				player.draw(trigger.num);
			},
		},
		huanhua4: {
			trigger: { global: "discardAfter" },
			forced: true,
			sourceSkill: "huanhua",
			filter(event, player) {
				if (event.parent.parent.name !== "phaseDiscard") {
					return false;
				}
				return event.player !== player;
			},
			async content(event, trigger, player) {
				player.chooseToDiscard({ selectCard: trigger.cards.length, forced: true });
			},
		},
		jidian: {
			audio: 2,
			trigger: { source: "damageAfter" },
			direct: true,
			unique: true,
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget({
						prompt: get.prompt("jidian"),
						filterTarget: (card, player, target) => get.distance(trigger.player, target) <= 1 && trigger.player !== target,
						ai: target => get.damageEffect(target, player, player, "thunder") + 0.1,
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				const target = result.targets[0];
				const judge = target.judge({ judge: card => (get.color(card) === "red" ? 0 : -1) });
				player.logSkill("jidian", target, false);
				trigger.player.line(target, "thunder");
				const judgeResult = await judge.forResult();
				if (judgeResult.color === "black") {
					await target.damage({ nature: "thunder" });
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
			unique: true,
			filter(event, player) {
				if (player.hp === player.maxHp) {
					return false;
				}
				if (!player.hasCards("he")) {
					return false;
				}
				return true;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCardTarget({
						position: "he",
						filterTarget(card, player, target) {
							if (player === target) {
								return false;
							}
							if (!lib.character[target.name]) {
								return false;
							}
							return true;
						},
						filterCard: lib.filter.cardDiscardable,
						ai1(card) {
							return get.unuseful(card) + 9;
						},
						ai2(target) {
							if (target.storage.boss_hujia) {
								return Math.max(1, 10 - target.maxHp);
							}
							return 1 / target.maxHp;
						},
						prompt: get.prompt(event.skill),
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const target = event.targets[0];
				if (target.storage.boss_hujia) {
					await target.loseMaxHp();
				} else {
					target.disableSkill("boss_hujia", lib.character[target.name][3]);
					target.storage.boss_hujia = true;
				}
				await player.discard({ cards: event.cards });
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
			init(player) {
				player.storage.boss_guihan = false;
			},
			filter(event, player) {
				return event.type === "dying" && player.isDying() && !player.storage.boss_guihan;
			},
			async content(event, trigger, player) {
				player.removeSkill("boss_guihan");
				const recover = player.recover(player.maxHp - player.hp);
				player.storage.boss_guihan = true;
				await recover;
				await player.draw(4);
				for (const current of game.players) {
					current.enableSkill("boss_hujia");
					delete current.storage.boss_hujia;
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
				skillTagFilter(player) {
					if (player.storage.boss_guihan) {
						return false;
					}
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
			filter(event) {
				return event.hasNature("fire");
			},
			async content(event, trigger, player) {
				trigger.cancel();
				player.recover();
			},
			ai: {
				effect: {
					target(card) {
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
			filter(event, player) {
				return _status.currentPhase !== player;
			},
			async content(event, trigger, player) {
				const judgeResult = await player.judge({ judge: card => (get.color(card) === "red" ? 1 : 0) }).forResult();
				if (!judgeResult.bool) {
					return;
				}
				const result = await player
					.chooseTarget({
						forced: true,
						prompt: "选择一个目标令其失去1点体力",
						filterTarget: (card, player, target) => player !== target,
						ai: target => Math.max(1, 9 - target.hp),
					})
					.forResult();
				if (result.targets.length) {
					player.line(result.targets);
					await result.targets[0].loseHp();
				}
			},
			ai: {
				effect: {
					target(card) {
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
			filter(event, player) {
				return _status.currentPhase?.isIn() && _status.currentPhase !== player;
			},
			async content(event, trigger, player) {
				const result = await player.judge().forResult();
				if (result.color === "black") {
					await _status.currentPhase.loseHp();
				} else {
					await player.recover();
					await player.draw();
				}
			},
			ai: {
				effect: {
					target(card) {
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
			filter(event, player) {
				return player.hp < player.maxHp;
			},
			async content(event, trigger, player) {
				const result = await player.judge({ judge: card => (get.color(card) === "red" ? 1 : 0) }).forResult();
				if (result.bool) {
					await player.recover();
				}
			},
		},
		boss_honglian: {
			audio: 2,
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			unique: true,
			async content(event, trigger, player) {
				const players = get.players(player);
				players.remove(player);
				await player.draw(2);
				for (const target of players) {
					await target.damage({ nature: "fire" });
				}
			},
		},
		boss_yuhuo: {
			trigger: { player: "niepanAfter" },
			forced: true,
			unique: true,
			derivation: ["shenwei", "zhuyu"],
			async content(event, trigger, player) {
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
			filter(event, player) {
				if (player.isLinked()) {
					return true;
				}
				return game.hasPlayer(current => current !== player && !current.isLinked());
			},
			async content(event, trigger, player) {
				const targets = game.filterPlayer();
				targets.remove(player);
				targets.sort(lib.sort.seat);
				if (player.isLinked()) {
					await player.link();
				}
				for (const target of targets) {
					if (!target.isLinked()) {
						const next = target.link();
						player.line(target, "green");
						await next;
					}
				}
			},
		},
		boss_jizhi: {
			audio: 2,
			trigger: { player: "useCard" },
			frequent: true,
			unique: true,
			filter(event) {
				const type = get.type(event.card, "trick");
				return type !== "basic" && event.card.isCard;
			},
			async content(event, trigger, player) {
				const cards = get.cards();
				player.gain({ cards: cards, animate: "gain2" });
				game.log(player, "获得了", cards);
			},
			ai: {
				threaten: 1.4,
				noautowuxie: true,
			},
		},
		boss_guiyin: {
			mod: {
				targetEnabled(card, player, target) {
					if (_status.currentPhase === player && target.hp < player.hp) {
						return false;
					}
				},
			},
		},
		boss_gongshen: {
			trigger: { global: "gameDrawAfter" },
			forced: true,
			unique: true,
			async content(event, trigger, player) {
				for (const current of game.players) {
					if (current !== player) {
						current.forcemin = true;
					}
				}
			},
			mod: {
				targetEnabled(card, player, target) {
					if (get.type(card) === "delay" && player !== target) {
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
			filter() {
				return game.hasPlayer(current => current.isTurnedOver());
			},
			async content(event, trigger, player) {
				const players = get.players(player).filter(current => current.isTurnedOver());
				for (const target of players) {
					await target.loseHp();
				}
			},
		},
		tashui: {
			audio: 2,
			trigger: { player: ["useCard", "respondAfter"] },
			direct: true,
			unique: true,
			filter(event) {
				return get.color(event.card) === "black";
			},
			async content(event, trigger, player) {
				await game.delay(0.5);
				const result = await player
					.chooseTarget({
						prompt: get.prompt("tashui"),
						filterTarget: (card, player, target) => player !== target,
						ai: target => {
							if (get.attitude(_status.event.player, target) === 0) {
								return 0;
							}
							if (get.attitude(_status.event.player, target) > 0) {
								if (target.classList.contains("turnedover")) {
									return 3;
								}
								if (target.hasSkillTag("noturn")) {
									return 1;
								}
								return -1;
							}
							if (target.hasSkillTag("noturn")) {
								return 0;
							}
							if (target.classList.contains("turnedover")) {
								return -1;
							}
							return 5 - target.getDamagedHp();
						},
					})
					.forResult();
				if (result.bool) {
					player.logSkill("tashui", result.targets, "thunder");
					await result.targets[0].turnOver();
				}
			},
			ai: {
				effect: {
					player_use(card) {
						if (get.color(card) === "black") {
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
			filter(event, player) {
				return player.countCards("h") < 4;
			},
			async content(event, trigger, player) {
				player.draw(4 - player.countCards("h"));
			},
			group: "shangshix2",
			ai: {
				effect: {
					target(card, player, target) {
						if (card.name === "shunshou") {
							return;
						}
						if (card.name === "guohe") {
							if (!target.hasCards("e")) {
								return [0, 1];
							}
						} else if (get.tag(card, "loseCard")) {
							return [0, 1];
						}
					},
				},
				noh: true,
				freeSha: true,
				freeShan: true,
				skillTagFilter() {
					return true;
				},
			},
		},
		xiuluo: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			direct: true,
			filter(event, player) {
				return player.hasCards("j");
			},
			async content(event, trigger, player) {
				while (true) {
					const result = await player
						.discardPlayerCard({
							target: player,
							selectButton: 2,
							position: "hj",
							prompt: "是否一张手牌来弃置一张花色相同的判定牌？",
							filterButton: button => {
								const card = button.link;
								if (!lib.filter.cardDiscardable(card, player)) {
									return false;
								}
								if (ui.selected.buttons.length === 0) {
									return true;
								}
								if (get.position(ui.selected.buttons[0].link) === "h") {
									if (get.position(card) !== "j") {
										return false;
									}
								}
								if (get.position(ui.selected.buttons[0].link) === "j") {
									if (get.position(card) !== "h") {
										return false;
									}
								}
								return get.suit(card) === get.suit(ui.selected.buttons[0].link);
							},
							ai: button => {
								const card = button.link;
								if (get.position(card) === "h") {
									return 11 - get.value(card);
								}
								if (card.name === "lebu") {
									return 5;
								}
								if (card.name === "bingliang") {
									return 4;
								}
								if (card.name === "guiyoujie") {
									return 3;
								}
								return 2;
							},
						})
						.set("logSkill", "xiuluo")
						.forResult();
					if (!result.bool || !player.hasCards("j")) {
						break;
					}
				}
			},
		},
		shangshix2: {
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			unique: true,
			sourceSkill: "shangshix",
			filter(event, player) {
				return player.hp > 1;
			},
			async content(event, trigger, player) {
				const players = get.players(player);
				for (const target of players) {
					await target.loseHp();
				}
			},
		},
		boss_wuxin: {
			audio: 2,
			mod: {
				targetEnabled(card, player, target) {
					if (get.type(card) === "delay" && player !== target) {
						return false;
					}
				},
			},
			trigger: { player: "damageBefore" },
			forced: true,
			priority: 10,
			async content(event, trigger, player) {
				trigger.cancel();
				player.loseHp();
			},
		},
		shenwei: {
			audio: 2,
			unique: true,
			trigger: { player: "phaseDrawBegin" },
			forced: true,
			async content(event, trigger, player) {
				trigger.num += Math.min(3, game.players.length - 1);
			},
			mod: {
				maxHandcard(player, current) {
					return current + Math.min(3, game.players.length - 1);
				},
			},
		},
		boss_baonuwash: {
			trigger: { player: "phaseAfter" },
			forced: true,
			async content(event, trigger, player) {
				game.over(game.me === game.boss);
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
			init(player) {
				if (get.mode() === "boss" && player === game.boss) {
					lib.onwash.push(() => {
						if (!_status.boss_baonuwash) {
							_status.boss_baonuwash = true;
							_status.event.parent.trigger("boss_baonuwash");
						} else {
							_status.event.player.addSkill("boss_baonuwash");
						}
					});
					for (const i in lib.card) {
						if (lib.card[i].subtype === "equip1") {
							lib.card[i].recastable = true;
						}
					}
				}
			},
			filter(event, player) {
				if (event.name === "changeHp") {
					return player.hp <= 4 && event.changedHp !== 0;
				}
				return _status.boss_baonuwash;
			},
			async content(event, trigger, player) {
				if (player.hp > 6) {
					await game.delay();
				}
				if (!player.isIn()) {
					return;
				}
				const result = await player
					.chooseControl({
						controls: ["暴怒战神", "神鬼无前"],
						prompt: "选择一个形态",
						ai: () => {
							if (Math.random() < 0.5) {
								return "神鬼无前";
							}
							return "暴怒战神";
						},
					})
					.forResult();
				if (!player.isIn()) {
					return;
				}
				const hp = player.hp;
				player.removeSkill("boss_baonu", true);
				if (result.control === "暴怒战神") {
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
				if (player.isLinked()) {
					player.link();
				}
				if (player.isTurnedOver()) {
					player.turnOver();
				}
				await player.discard({ cards: player.getCards("j") });
				if (!player.isIn()) {
					return;
				}
				const evt = event.getParent("phaseLoop", true);
				if (evt) {
					game.resetSkills();
					let evtx = event;
					while (evtx !== evt) {
						evtx.finish();
						evtx.untrigger(true);
						evtx = evtx.getParent();
					}
					evtx.player = player;
					evtx.step = 0;
				}
				if (game.bossinfo) {
					game.bossinfo.loopType = 1;
					_status.roundStart = game.boss;
				}
			},
			ai: {
				effect: {
					target(card, player, target) {
						if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
							if (player.hp === 5) {
								if (game.players.length < 4) {
									return [0, 5];
								}
								let num = 0;
								for (const current of game.players) {
									if (current !== game.boss && current.hp === 1) {
										num++;
									}
								}
								if (num > 1) {
									return [0, 2];
								}
								if (num && Math.random() < 0.7) {
									return [0, 1];
								}
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
			filter(event, player) {
				return get.suit(event.card) === "club" && player.hp < player.maxHp;
			},
			async content(event, trigger, player) {
				player.recover();
			},
		},
		jizhen: {
			trigger: { player: "phaseJieshuBegin" },
			filter(event, player) {
				return game.hasPlayer(current => current.isDamaged() && current !== player);
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						selectTarget: [1, 2],
						filterTarget: (card, player, target) => target.hp < target.maxHp && player !== target,
						ai: target => get.attitude(player, target),
					})
					.forResult();
			},
			async content(event, trigger, player) {
				await game.asyncDraw(event.targets);
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
			filter(event, player) {
				return player.countCards("h") <= player.maxHp;
			},
			frequent: true,
			async content(event, trigger, player) {
				player.draw(2);
			},
		},
		shenqu2: {
			trigger: { player: "damageAfter" },
			direct: true,
			sourceSkill: "shenqu",
			filter(event, player) {
				return player.hasSkillTag("respondTao") || player.hasCards("h", "tao");
			},
			async content(event, trigger, player) {
				player.chooseToUse({ filterCard: { name: "tao" }, prompt: "神躯：是否使用一张桃？", logSkill: "shenqu" });
			},
		},
		jiwu: {
			derivation: ["qiangxix", "retieji", "olxuanfeng", "rewansha"],
			audio: 2,
			enable: "phaseUse",
			filter(event, player) {
				if (!player.hasCards("he")) {
					return false;
				}
				if (!player.hasSkill("qiangxix")) {
					return true;
				}
				if (!player.hasSkill("retieji")) {
					return true;
				}
				if (!player.hasSkill("olxuanfeng")) {
					return true;
				}
				if (!player.hasSkill("rewansha")) {
					return true;
				}
				return false;
			},
			filterCard: true,
			position: "he",
			check(card) {
				if (get.position(card) === "e" && _status.event.player.hasSkill("olxuanfeng")) {
					return 16 - get.value(card);
				}
				return 7 - get.value(card);
			},
			async content(event, trigger, player) {
				const list = [];
				if (!player.hasSkill("qiangxix")) {
					list.push("qiangxix");
				}
				if (!player.hasSkill("retieji")) {
					list.push("retieji");
				}
				if (!player.hasSkill("olxuanfeng")) {
					list.push("olxuanfeng");
				}
				if (!player.hasSkill("rewansha")) {
					list.push("rewansha");
				}
				if (list.length === 1) {
					await player.addTempSkills(list[0]);
					return;
				}
				const result = await player
					.chooseControl({
						controls: list,
						prompt: "选择获得一项技能直到回合结束",
						ai: () => {
							if (list.includes("olxuanfeng") && player.hasCards("he", { type: "equip" })) {
								return "olxuanfeng";
							}
							if (!player.getStat().skill.qiangxix) {
								if (player.hasSkill("qiangxix") && player.getEquip(1) && list.includes("olxuanfeng")) {
									return "olxuanfeng";
								}
								if (list.includes("rewansha") || list.includes("qiangxix")) {
									const players = game.filterPlayer();
									for (const target of players) {
										if (target.hp === 1 && get.attitude(player, target) < 0) {
											if (list.includes("rewansha")) {
												return "rewansha";
											}
											if (list.includes("qiangxix")) {
												return "qiangxix";
											}
										}
									}
								}
							}
							if (list.includes("qiangxix")) {
								return "qiangxix";
							}
							if (list.includes("rewansha")) {
								return "rewansha";
							}
							if (list.includes("olxuanfeng")) {
								return "olxuanfeng";
							}
							return "retieji";
						},
					})
					.forResult();
				await player.addTempSkills(result.control);
			},
			ai: {
				order() {
					const player = _status.event.player;
					if (player.hasCards("e", { type: "equip" })) {
						return 10;
					}
					if (!player.getStat().skill.qiangxix) {
						if (player.hasSkill("qiangxix") && player.getEquip(1) && !player.hasSkill("olxuanfeng")) {
							return 10;
						}
						if (player.hasSkill("rewansha")) {
							return 1;
						}
						const players = game.filterPlayer();
						for (const target of players) {
							if (target.hp === 1 && get.attitude(player, target) < 0) {
								return 10;
							}
						}
					}
					return 1;
				},
				result: {
					player(player) {
						if (player.hasCards("e", { type: "equip" })) {
							return 1;
						}
						if (!player.getStat().skill.qiangxix) {
							if (player.hasSkill("qiangxix") && player.getEquip(1) && !player.hasSkill("olxuanfeng")) {
								return 1;
							}
							if (!player.hasSkill("rewansha") || !player.hasSkill("qiangxix")) {
								const players = game.filterPlayer();
								for (const target of players) {
									if (target.hp === 1 && get.attitude(player, target) < 0) {
										return 1;
									}
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
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter(event, player) {
				return player.hp <= 2;
			},
			forced: true,
			async content(event, trigger, player) {
				player.removeSkill("boss_hunyou");
				player.removeSkill("boss_hunyou_dying");
				player.removeSkill("boss_hunyou_dieBegin");
				player.loseMaxHp();
				player.addSkill("reyingzi");
				player.addSkill("yinghun");
				game.log(player, "获得了技能", "#g【英姿】和【英魂】");
				game.log(player, "", "#y【魂佑】");
				player.awakenSkill(event.name);
				player.storage.boss_hunzi = true;
			},
			ai: {
				threaten(player, target) {
					if (target.hp === 1) {
						return 2;
					}
					return 0.5;
				},
				maixie: true,
				effect: {
					target(card, player, target) {
						if (!target.hasFriend()) {
							return;
						}
						if (get.tag(card, "damage") == 1 && target.hp === 2 && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
							return [0.5, 1];
						}
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
			init(player) {
				const a = window.setInterval(() => {
					if (player.hasSkill("boss_jiang")) {
						player.storage.boss_jiang = true;
					} else {
						game.addGlobalSkill("boss_jiang");
						game.addGlobalSkill("boss_jiang_use");
						window.clearInterval(a);
					}
				}, 1000);
			},
			filter2(event, player) {
				if (!event.respondTo[1]) {
					return false;
				}
				if (get.itemtype(event.cards) !== "cards") {
					return false;
				}
				if (["h", "e", "j"].includes(get.position(event.cards[0]))) {
					return false;
				}
				if (event.respondTo[1] && get.itemtype(event.respondTo[1]) !== "card") {
					return false;
				}
				if (event.respondTo[1] && ["h", "e", "j"].includes(get.position(event.respondTo[1]))) {
					return false;
				}
			},
			filter(event, player) {
				if (!player.storage.boss_jiang) {
					return false;
				}
				if (!event.respondTo) {
					return false;
				}
				if (get.color(event.card) !== "red") {
					return false;
				}
				if (event.respondTo[0] !== player) {
					return event.player === player;
				} else {
					return event.player !== player;
				}
			},
			frequent: true,
			async content(event, trigger, player) {
				player.draw();
				if (!lib.skill.boss_jiang.filter2(trigger, player)) {
					return;
				}
				if (trigger.respondTo[0] !== player) {
					if (trigger.respondTo[1] && get.position(trigger.respondTo[1]) === "d") {
						player.gain({ cards: [trigger.respondTo[1]], animate: "gain2" });
					}
				} else {
					if (get.position(trigger.cards[0]) === "d") {
						player.gain({ cards: trigger.cards, animate: "gain2" });
					}
				}
			},
			group: ["boss_jiang_use"],
			subSkill: {
				use: {
					audio: "jiang",
					trigger: {
						global: ["useCard"],
					},
					filter(event, player) {
						if (!player.storage.boss_jiang) {
							return false;
						}
						if (get.color(event.card) !== "red") {
							return false;
						}
						return player === event.player || event.targets.includes(player);
					},
					frequent: true,
					async content(event, trigger, player) {
						player.draw();
						if (trigger.player !== player && get.itemtype(trigger.cards) === "cards" && get.position(trigger.cards[0]) === "d") {
							player.gain({ cards: trigger.cards, animate: "gain2" });
						}
					},
					sub: true,
				},
			},
		},
		boss_hunyou: {
			forced: true,
			init(player) {
				player.hp = 1;
				player.storage.hp = player.hp;
				player.storage.maxHp = player.maxHp;
				player.update();
			},
			trigger: {
				player: ["damageBefore", "recoverBefore", "loseHpBefore", "loseMaxHpBefore", "gainMaxHpBefore"],
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
			group: ["boss_hunyou_dying", "boss_hunyou_dieBegin"],
			subSkill: {
				dying: {
					trigger: {
						player: "dying",
					},
					silent: true,
					filter(event, player) {
						if (player.hp !== player.storage.hp && player.storage.hp > 0) {
							return true;
						}
						return false;
					},
					async content(event, trigger, player) {
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
					filter(event, player) {
						if (player.maxHp !== player.storage.maxHp && player.storage.maxHp > 0) {
							return true;
						}
						return false;
					},
					async content(event, trigger, player) {
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
			init(player) {
				player.boss_taoni = () => {
					if (typeof _status.taoni_over !== "function") {
						_status.taoni_over = str => {
							_status.over = true;
							game.alert(str);
						};
					}
					function isDefined(opd) {
						if (opd == null) {
							return false;
						}
						if (opd.get || opd.set || opd.writable !== true || opd.configurable !== true) {
							return true;
						}
						return false;
					}
					const keysArray = ["length", "players", "Player", "element"];
					for (const node of game[keysArray[1]]) {
						for (const a in Object.keys(lib[keysArray[3]][keysArray[2]].prototype)) {
							const opd = Object.getOwnPropertyDescriptor(node, a);
							if (isDefined(opd)) {
								_status.taoni_over(`${lib.translate[node.name]}触发了〖讨逆〗，游戏已被终止。`);
							}
							//还原函数
							node[a] = lib[keysArray[3]][keysArray[2]].prototype[a];
							const playerKeysArray = ["classList", "hp", "maxHp", "skills"];
							for (const key of playerKeysArray) {
								const opd2 = Object.getOwnPropertyDescriptor(node, key);
								if (isDefined(opd2)) {
									_status.taoni_over(`${lib.translate[node.name]}触发了〖讨逆〗，游戏已被终止。`);
								}
							}
							const gameKeysArray = ["players", "dead", "over"];
							for (const key of gameKeysArray) {
								const opd3 = Object.getOwnPropertyDescriptor(game, key);
								if (isDefined(opd3)) {
									_status.taoni_over("〖讨逆〗被触发，游戏终止。");
								}
							}
						}
					}
				};
			},
			async content(event, trigger, player) {
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
		boss_baiwuchang_ab: "白无常",
		boss_baiwuchang: "白无常·谢必安",
		boss_heiwuchang_ab: "黑无常",
		boss_heiwuchang: "黑无常·范无救",

		boss_luocha: "罗刹",
		boss_yecha: "夜叉",
		boss_zhuoguiquxie: "捉鬼驱邪",

		boss_nianshou: "年兽",
		boss_nianshou_heti: "年兽",
		boss_nianshou_jingjue: "警觉年兽",
		boss_nianshou_renxing: "任性年兽",
		boss_nianshou_baonu: "暴怒年兽",
		boss_nianshou_ruizhi: "睿智年兽",

		boss_huangyueying: "奇智女杰",
		boss_zhangchunhua: "冷血皇后",
		boss_dongzhuo: "乱世魔王",
		boss_lvbu1: "最强神话",
		boss_lvbu2: "暴怒战神",
		boss_lvbu3: "神鬼无前",
		boss_zhouyu: "赤壁火神",
		boss_pangtong: "涅槃凤雏",
		boss_zhugeliang: "祭风卧龙",
		boss_zhangjiao: "天公将军",
		boss_zuoci: "迷之仙人",
		boss_liubei: "蜀汉烈帝",
		boss_caiwenji: "异乡孤女",
		boss_huatuo: "药坛圣手",
		boss_zhenji: "洛水仙子",
		boss_diaochan: "绝代妖姬",
		boss_guojia: "世之奇士",
		boss_caocao: "魏武大帝",

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
		boss_sanshou: "三首",
		sanshou_skill: "三首",
		boss_sanshou_info: "当你受到伤害时，你可以亮出牌堆顶三张牌。若其中有本回合未被使用过的牌的类型，防止此伤害。",
		sanshou_skill_info: "当你受到伤害时，你可以亮出牌堆顶三张牌。若其中有本回合未被使用过的牌的类型，防止此伤害。",

		boss_qingmushilian: "春之试炼",
		boss_qinglong: "青龙",
		boss_mushengoumang_ab: "木神句芒",
		boss_mushengoumang: "木神句芒·姬重",
		boss_shujing: "树精",
		boss_taihao_ab: "太昊",
		boss_taihao: "太昊·风伏羲",

		boss_chiyanshilian: "夏之试炼",
		boss_zhuque: "朱雀",
		boss_huoshenzhurong_ab: "火神祝融",
		boss_huoshenzhurong: "火神祝融·姜重黎",
		boss_yanling: "焰灵",
		boss_yandi_ab: "炎帝",
		boss_yandi: "炎帝·姜轨",

		boss_baimangshilian: "秋之试炼",
		boss_baihu: "白虎",
		boss_jinshenrushou_ab: "金神蓐收",
		boss_jinshenrushou: "金神蓐收·嬴该",
		boss_mingxingzhu: "明刑柱",
		boss_shaohao_ab: "少昊",
		boss_shaohao: "少昊·嬴挚",

		boss_xuanlinshilian: "冬之试炼",
		boss_xuanwu: "玄武",
		boss_shuishengonggong_ab: "水神共工",
		boss_shuishengonggong: "水神共工·姜共工",
		boss_shuishenxuanming_ab: "水神玄冥",
		boss_shuishenxuanming: "水神玄冥·嬴禺强",
		boss_zhuanxu_ab: "颛顼",
		boss_zhuanxu: "颛顼·姬颛顼",

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
		boss_jiding_info: "锁定技，其他己方角色受到伤害后，若伤害来源为敌方角色，则你视为对伤害来源使用雷【杀】，若此【杀】造成伤害，蓐收回复1点体力。然后你失去此技能。",
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
		guizhen_info: "每当你失去最后一张手牌，你可以令所有敌人失去全部手牌，没有手牌的角色失去1点体力（不触发技能）。",
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
		boss_qinguangwang: "秦广王·蒋歆",
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
		boss_zhifen_info: "锁定技，准备阶段，你随机选择一名其他角色，获得其一张手牌（没有则不获得），并对其造成1点火属性伤害。",
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
		boss_shikieiki_ab: "四季映姬",
		boss_shikieiki: "四季映姬·夜魔仙那度",
		boss_yingzhong: "映冢",
		boss_yingzhong_info: "锁定技。你登场后的第一个回合开始时，你随机获得两个“阴间武将”的全部技能。",
		boss_yingzhong_append: '<span style="font-family:yuanli">四季映姬到阴曹地府<br>——阴(映)到家了！</span>',
		//孟婆:
		boss_mengpo_ab: "孟婆",
		boss_mengpo: "孟婆·孟姜女",
		boss_shiyou: "拾忧",
		boss_shiyou_info: "其他角色于弃牌阶段弃置的牌进入弃牌堆前，你可以选择其中任意张花色各不相同的牌获得之。",
		boss_wanghun: "忘魂",
		boss_wanghun_info: "锁定技，你死亡时，令随机两名敌方角色各随机失去一个技能（主公技除外），并在牌堆中加入2张回魂。(回魂只能在挑战模式出现)",
		boss_wangshi: "往事",
		boss_wangshi_info: "锁定技，你存活时，敌方角色的回合开始时，令其于本回合不能使用或打出随机一种类型的牌（基本、锦囊、装备）。",
		boss_wangshi2: "往事",
		boss_wangshi2_info: "",
		//地藏王:
		boss_dizangwang_ab: "地藏王",
		boss_dizangwang: "地藏王·金乔觉",
		boss_bufo: "不佛",
		boss_bufo_info: "锁定技，你的回合开始时，你对所有距离为1的其他角色造成1点火焰伤害；你受到大于等于2的伤害时，令此伤害-1。",
		boss_wuliang: "无量",
		boss_wuliang_info: "锁定技，你登场时额外摸三张牌；结束阶段开始时，你摸两张牌；你的回合开始时，若你当前体力小于3，则回复至3。",
		boss_dayuan: "大愿",
		boss_dayuan_info: " 当一名角色判定牌最终生效前，你可以指定该判定牌的点数和花色。",
		boss_diting: "谛听",
		boss_diting_info: "锁定技，你的坐骑区被废除，你与别人计算距离时-1，别人与你计算距离时+1；你的坐骑牌均用于重铸。",
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
		boss_newhuanren_info_boss: "第一关：挑战秦广王<br>第二关：挑战楚江王，宋帝王，五官王，阎罗王中的一个<br>第三关：挑战卞城王，泰山王，都市王，平等王中的一个<br>第四关：挑战转轮王<br>注：孟婆将在每局前三个阶段随机一个阶段登场<br>地藏王登场规则为，50回合内通过第三关，并且在前三关中成功击杀孟婆。<br>选用的武将越阴间、占比越高，四季映姬登场概率就越大。<li>选陆逊左慈张春华于吉蒋费孔融自动变孙笨",
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
		"#boss_heisheng": "此绳索，是你无法逃脱的噩梦。",
		"#boss_shengfu": "想跑？痴人说梦！",
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
		rawAttitude(from, to) {
			const num = to.identity === "zhong" ? 5 : 6;
			return from.side === to.side ? num : -num;
		},
	},
};
