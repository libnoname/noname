import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//桃园挽歌
	//铠甲合体
	_taoyuanwange: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (event.name == "phase" && game.phaseNumber != 0) {
				return false;
			}
			return Object.keys(lib.skill._taoyuanwange.getEquip).some(name => {
				return get.nameList(player).includes(name);
			});
		},
		direct: true,
		getEquip: {
			ty_liubei: ["dilu", "ty_feilongduofeng"],
			ty_luxun: ["shangfangbaojian"],
			ty_sunquan: ["qingmingjian"],
		},
		getAudio: {
			ty_liubei: "jizhao2",
			ty_luxun: "nzry_cuike2",
			ty_sunquan: "sbzhiheng2",
		},
		async content(event, trigger, player) {
			let list = get.nameList(player),
				info = lib.skill._taoyuanwange,
				names = Object.keys(info.getEquip);
			for (const name of names) {
				if (list.includes(name)) {
					let equips = [];
					for (let card of info.getEquip[name]) {
						let cardx = get.cardPile(cardx => cardx.name == card && player.canEquip(cardx));
						if (cardx) {
							equips.push(cardx);
						}
					}
					if (equips.length) {
						game.broadcastAll(function (audio) {
							if (lib.config.background_speak) {
								game.playAudio("skill", audio);
							}
						}, info.getAudio[name]);
						player.$gain2(equips);
						await player.equip(equips);
					}
				}
			}
		},
	},
	//刺客×4
	//孩子们，我分身了
	tyliupo: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (storage) {
					return "回合开始时，你可令本轮所有所有即将造成的伤害均视为体力流失";
				}
				return "回合开始时，你可令所有角色不能使用【桃】";
			},
		},
		trigger: {
			player: "phaseBegin",
		},
		logTarget: () => game.players,
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			let skill = event.name + "_" + (player.storage[event.name] ? "wansha" : "jueqing");
			for (let i of game.players) {
				i.addTempSkill(skill, "roundStart");
			}
		},
		subSkill: {
			wansha: {
				charlotte: true,
				mod: {
					cardSavable(card, player) {
						if (card.name == "tao") {
							return false;
						}
					},
					cardEnabled(card, player) {
						if (card.name == "tao") {
							return false;
						}
					},
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">桃</span>',
				intro: {
					content: "不能使用桃",
				},
			},
			jueqing: {
				trigger: { player: "damageBefore" },
				forced: true,
				charlotte: true,
				content() {
					trigger.cancel();
					trigger.player.loseHp(trigger.num);
				},
				ai: {
					jueqing: true,
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">伤</span>',
				intro: {
					content: "造成伤害改为失去体力",
				},
			},
		},
	},
	tyzhuiling: {
		trigger: {
			global: "loseHpEnd",
		},
		filter(event, player) {
			return player.countMark("tyzhuiling") < 3 && event.num > 0;
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			let num = Math.min(3 - player.countMark(event.name), trigger.num);
			player.addMark(event.name, num);
		},
		marktext: "魂",
		intro: {
			name: "魂",
			content: "mark",
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (!target.countCards("h")) {
					return Infinity;
				}
			},
			targetInRange(card, player, target) {
				if (!target.countCards("h")) {
					return true;
				}
			},
		},
	},
	tyxihun: {
		trigger: { global: "roundEnd" },
		forced: true,
		async content(event, trigger, player) {
			for (const target of game.players) {
				if (target == player) {
					continue;
				}
				const result = await target
					.chooseToDiscard(2, "h", "弃置两张手牌，或点取消失去1点体力")
					.set("ai", card => {
						let player = get.player();
						if (get.effect(player, { name: "losehp" }, player, player) > 0) {
							return 0;
						}
						return 6 - get.value(card);
					})
					.forResult();
				if (!result.bool) {
					await target.loseHp();
				}
			}
			if (!player.hasMark("tyzhuiling")) {
				return;
			}
			let list = [];
			for (let i = 1; i <= player.countMark("tyzhuiling"); i++) {
				list.push(get.cnNumber(i, true));
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", "吸魂：选择要移去的“魂”数")
				.set("ai", () => {
					const player = get.player();
					return get.cnNumber(Math.max(1, Math.min(player.countMark("tyzhuiling"), player.getDamagedHp())), true);
				})
				.forResult();
			let num = result.index + 1;
			player.removeMark("tyzhuiling", num);
			if (player.isDamaged()) {
				await player.recover(num);
			}
		},
	},
	tyxianqi: {
		global: "tyxianqi_damage",
		subSkill: {
			damage: {
				enable: "phaseUse",
				usable: 1,
				prompt: "弃置两张牌或对自身造成1点伤害，然后令有【献气】的其他角色受到1点伤害",
				filterCard: true,
				position: "he",
				selectCard: [0, 2],
				filter(event, player) {
					return game.hasPlayer(current => current.hasSkill("tyxianqi") && current != player);
				},
				filterTarget(card, player, target) {
					if (ui.selected.cards?.length == 1) {
						return false;
					}
					return target.hasSkill("tyxianqi") && target != player;
				},
				selectTarget() {
					if (ui.selected.cards?.length == 1) {
						return 114514;
					}
					return -1;
				},
				chessForceAll: true,
				check(card) {
					let player = get.player();
					if (get.damageEffect(player, player, player) > 0) {
						return 0;
					}
					return 8 - get.value(card);
				},
				complexTarget: true,
				async contentBefore(event, trigger, player) {
					if (!event.cards || !event.cards.length) {
						await player.damage();
					}
				},
				async content(event, trigger, player) {
					await event.target.damage();
				},
				ai: {
					order: 6,
					result: {
						player(player, target) {
							if (ui.selected.cards.length) {
								return 0;
							}
							if (player.hp >= target.hp) {
								return -0.9;
							}
							if (player.hp <= 2) {
								return -10;
							}
							return -2;
						},
						target(player, target) {
							if (!ui.selected.cards.length) {
								if (player.hp < 2) {
									return 0;
								}
								if (player.hp == 2 && target.hp >= 2) {
									return 0;
								}
								if (target.hp > player.hp) {
									return 0;
								}
							}
							return get.damageEffect(target, player);
						},
					},
				},
			},
		},
	},
	tyfansheng: {
		trigger: {
			player: "dying",
		},
		filter(event, player) {
			return (
				game
					.getAllGlobalHistory("everything", evt => {
						return evt.name == "dying" && evt.player == player;
					})
					.indexOf(event) == 0
			);
		},
		forced: true,
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			await player.recoverTo(1);
			for (const target of game.players) {
				if (target == player) {
					continue;
				}
				const list = [];
				if (target.countCards("h")) {
					list.push("手牌区");
				}
				if (target.countCards("e")) {
					list.push("装备区");
				}
				if (list.length == 0) {
					continue;
				}
				let result;
				if (list.length == 1) {
					result = { control: list[0] };
				} else {
					result = await target
						.chooseControl(list)
						.set("prompt", "返生：弃置一个区域的所有牌")
						.set("ai", () => [0, 1].randomGet())
						.forResult();
				}
				let pos = result.control == "手牌区" ? "h" : "e";
				let cards = target.getCards(pos);
				if (cards.length) {
					await target.discard(cards);
				}
			}
		},
	},
	tyansha: {
		inherit: "tysiji",
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return (
				player.countCards("hes") &&
				player.canUse(
					{
						name: "sha",
						nature: "stab",
					},
					event.player
				)
			);
		},
		group: "tyansha_range",
		subSkill: {
			range: {
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return event.skill == "tyansha_backup" && event.targets?.some(current => current.isIn() && !player.getStorage("tyansha_effect").includes(current));
				},
				firstDo: true,
				silent: true,
				content() {
					player.addTempSkill("tyansha_effect", "roundStart");
					player.markAuto(
						"tyansha_effect",
						trigger.targets.filter(current => current.isIn() && !player.getStorage("tyansha_effect").includes(current))
					);
				},
			},
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: {
					name: "sha",
					nature: "stab",
				},
				selectCard: 1,
				position: "hes",
				ai1(card) {
					return 7 - get.value(card);
				},
				log: false,
			},
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					globalTo(from, to, num) {
						if (to.getStorage("tyansha_effect").includes(from)) {
							return -Infinity;
						}
					},
				},
				intro: { content: "$本轮计算与你的距离视为1" },
			},
		},
	},
	tycangshen: {
		forced: true,
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			player.tempBanSkill("tycangshen", "roundStart");
		},
		mod: {
			globalTo(from, to, num) {
				if (!to.isTempBanned("tycangshen")) {
					return num + 1;
				}
			},
		},
	},
	tyxiongren: {
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			if (get.distance(event.player, player) <= 1) {
				return false;
			}
			return event.card?.name == "sha";
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (get.distance(target, player) <= 1) {
					return Infinity;
				}
			},
			targetInRange(card, player, target) {
				if (get.distance(target, player) <= 1) {
					return true;
				}
			},
		},
	},
	tysiji: {
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (
				!event.player.hasHistory("lose", evt => {
					const evtx = evt.relatedEvent || evt.getParent();
					return !["useCard", "respond"].includes(evtx.name);
				})
			) {
				return false;
			}
			return (
				player.countCards("hes") &&
				player.canUse(
					{
						name: "sha",
						nature: "stab",
					},
					event.player,
					false
				)
			);
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			const next = player.chooseToUse();
			next.set("openskilldialog", `${get.translation(event.name)}：是否将一张牌当作刺【杀】对${get.translation(trigger.player)}使用？`);
			next.set("norestore", true);
			next.set("_backupevent", `${event.name}_backup`);
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup(`${event.name}_backup`);
			next.set("targetRequired", true);
			next.set("complexSelect", true);
			next.set("complexTarget", true);
			next.set("filterTarget", function (card, player, target) {
				const { sourcex } = get.event();
				if (target != sourcex && !ui.selected.targets.includes(sourcex)) {
					return false;
				}
				return lib.filter.targetEnabled.apply(this, arguments);
			});
			next.set("sourcex", trigger.player);
			next.set("addCount", false);
			next.set("logSkill", event.name);
			await next;
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: {
					name: "sha",
					nature: "stab",
				},
				selectCard: 1,
				position: "hes",
				ai1(card) {
					return 7 - get.value(card);
				},
				log: false,
			},
		},
	},
	tydaifa: {
		inherit: "tysiji",
		filter(event, player) {
			if (
				!game.hasPlayer2(current => {
					if (current == event.player) {
						return false;
					}
					if (
						current.hasHistory("lose", evt => {
							if (evt.type != "gain") {
								return false;
							}
							var evtx = evt.getParent();
							if (evtx.giver || evtx.getParent().name == "gift") {
								return false;
							}
							var cards = evtx.getg(event.player);
							if (!cards.length) {
								return false;
							}
							var cards2 = evtx.getl(current).cards2;
							for (var card of cards2) {
								if (cards.includes(card)) {
									return true;
								}
							}
							return false;
						})
					) {
						return true;
					}
				})
			) {
				return false;
			}
			return (
				player.countCards("hes") &&
				player.canUse(
					{
						name: "sha",
						nature: "stab",
					},
					event.player,
					false
				)
			);
		},
	},
	//桃神关羽
	tywushen: {
		audio: "wushen",
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			return get.suit(card) == "heart";
		},
		position: "hes",
		viewAs: {
			name: "sha",
			storage: {
				tywushen: true,
			},
		},
		viewAsFilter(player) {
			if (!player.countCards("hes", { suit: "heart" })) {
				return false;
			}
		},
		prompt: "将一张红桃牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { suit: "heart" })) {
					return false;
				}
			},
			respondSha: true,
		},
		locked: false,
		mod: {
			cardUsable(card, player) {
				if (card?.storage?.tywushen) {
					return Infinity;
				}
			},
			targetInRange(card, player) {
				if (card?.storage?.tywushen) {
					return true;
				}
			},
		},
		group: "tywushen_respond",
		subSkill: {
			respond: {
				trigger: { player: "useCard" },
				direct: true,
				forced: true,
				filter(event, player) {
					return event.card?.storage?.tywushen;
				},
				content() {
					trigger.directHit.addArray(game.players);
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						if (player.stat[player.stat.length - 1].card.sha > 0) {
							player.stat[player.stat.length - 1].card.sha--;
						}
					}
				},
			},
		},
	},
	tywuhun: {
		audio: "wuhun2",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.isIn();
		},
		forced: true,
		logTarget: "source",
		content() {
			trigger.source.addMark("tywuhun", trigger.num);
		},
		group: "tywuhun_die",
		ai: {
			notemp: true,
			effect: {
				target: (card, player, target) => {
					if (!target.hasFriend()) {
						return;
					}
					let rec = get.tag(card, "recover"),
						damage = get.tag(card, "damage");
					if (!rec && !damage) {
						return;
					}
					if (damage && player.hasSkillTag("jueqing", false, target)) {
						return 1.7;
					}
					let die = [null, 1],
						temp;
					game.filterPlayer(i => {
						temp = i.countMark("new_wuhun");
						if (i === player && target.hp + target.hujia > 1) {
							temp++;
						}
						if (temp > die[1]) {
							die = [i, temp];
						} else if (temp === die[1]) {
							if (!die[0]) {
								die = [i, temp];
							} else if (get.attitude(target, i) < get.attitude(target, die[0])) {
								die = [i, temp];
							}
						}
					});
					if (die[0]) {
						if (damage) {
							return [1, 0, 1, (-6 * get.sgnAttitude(player, die[0])) / Math.max(1, target.hp)];
						}
						return [1, (6 * get.sgnAttitude(player, die[0])) / Math.max(1, target.hp)];
					}
				},
			},
		},
		marktext: "魇",
		intro: {
			name: "梦魇",
			content: "mark",
			onunmark: true,
		},
		subSkill: {
			die: {
				audio: "wuhun2",
				trigger: { player: "die" },
				filter(event, player) {
					return (
						event.source ||
						game.hasPlayer(function (current) {
							return current != player && current.hasMark("tywuhun");
						})
					);
				},
				forced: true,
				direct: true,
				forceDie: true,
				skillAnimation: true,
				animationColor: "soil",
				content() {
					"step 0";
					var num = 0;
					for (var i = 0; i < game.players.length; i++) {
						var current = game.players[i];
						if (current != player && current.countMark("tywuhun") > num) {
							num = current.countMark("tywuhun");
						}
					}
					player
						.chooseTarget(true, "请选择【武魂】的目标", "令其进行判定，若判定结果不为【桃】，则其死亡", function (card, player, target) {
							return target != player && (target == _status.event.getTrigger().source || target.countMark("tywuhun") == _status.event.num);
						})
						.set("ai", function (target) {
							return -get.attitude(_status.event.player, target);
						})
						.set("forceDie", true)
						.set("num", num);
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("tywuhun_die", target);
						player.line(target, { color: [255, 255, 0] });
						game.delay(2);
					}
					"step 2";
					target.judge(function (card) {
						if (["tao"].includes(card.name)) {
							return 10;
						}
						return -10;
					}).judge2 = function (result) {
						return result.bool == false ? true : false;
					};
					"step 3";
					if (!result.bool) {
						target.die();
					}
				},
			},
		},
	},
	//桃神张飞
	tyshencai: {
		audio: "shencai",
		enable: "phaseUse",
		filter(event, player) {
			if (player.countMark("tyshencai") > player.countMark("shencai")) {
				return false;
			}
			return true;
		},
		filterTarget: lib.filter.notMe,
		onremove: true,
		prompt: "选择一名其他角色进行地狱审判",
		content() {
			player.addMark("tyshencai", 1, false);
			player.addTempSkill("tyshencai_used", "phaseChange");
			var next = target.judge();
			next.callback = lib.skill.shencai.contentx;
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					const att = get.sgnAttitude(player, target),
						hp = target.getHp(true) + 0.1,
						hs = target.countCards("h") + 0.1;
					if (att < 0) {
						return (att * hp * hs) / 100;
					}
					return 0;
				},
			},
		},
		group: "tyshencai_wusheng",
		subSkill: {
			used: {
				onremove: ["tyshencai"],
				charlotte: true,
			},
			wusheng: {
				audio: "shencai",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard(card, player) {
					return get.suit(card) == "none";
				},
				position: "hes",
				viewAs: {
					name: "sha",
					color: "none",
					suit: "none",
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", { suit: "none" })) {
						return false;
					}
				},
				prompt: "将一张无色牌当杀使用或打出",
				check(card) {
					const val = get.value(card);
					if (_status.event.name == "chooseToRespond") {
						return 1 / Math.max(0.1, val);
					}
					return 5 - val;
				},
				ai: {
					skillTagFilter(player) {
						if (!player.countCards("hes", { color: "none" })) {
							return false;
						}
					},
					respondSha: true,
				},
			},
		},
	},
	tyxunshi: {
		audio: "xunshi",
		mod: {
			suit(card) {
				if (lib.skill.xunshi.isXunshi(card)) {
					return "none";
				}
			},
			targetInRange(card) {
				const suit = get.color(card);
				if (suit == "none" || suit == "unsure") {
					return true;
				}
			},
			cardUsable(card) {
				const suit = get.color(card);
				if (suit == "none" || suit == "unsure") {
					return Infinity;
				}
			},
		},
		init(player, skill) {
			player.addSkill("tyxunshi_mark");
		},
		onremove(player, skill) {
			player.removeSkill("tyxunshi_mark");
		},
		trigger: { player: "useCard2" },
		forced: true,
		filter(event, player) {
			return get.color(event.card) == "none";
		},
		content() {
			"step 0";
			if (player.countMark("shencai") < 4 && player.hasSkill("tyshencai", null, null, false)) {
				player.addMark("shencai", 1, false);
			}
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				var stat = player.getStat().card,
					name = trigger.card.name;
				if (typeof stat[name] == "number") {
					stat[name]--;
				}
			}
			var info = get.info(trigger.card);
			if (info.allowMultiple == false) {
				event.finish();
			} else if (trigger.targets && !info.multitarget) {
				if (
					!game.hasPlayer(function (current) {
						return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current);
					})
				) {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 1";
			var prompt2 = "为" + get.translation(trigger.card) + "增加任意个目标";
			player
				.chooseTarget(
					get.prompt("xunshi"),
					function (card, player, target) {
						var player = _status.event.player;
						return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
					},
					[1, Infinity]
				)
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player);
				})
				.set("card", trigger.card)
				.set("targets", trigger.targets);
			"step 2";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 3";
			if (event.targets) {
				player.line(event.targets, "fire");
				trigger.targets.addArray(event.targets);
			}
		},
		subSkill: {
			mark: {
				charlotte: true,
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player, name) {
					return event.getg(player).length && player.countCards("h");
				},
				direct: true,
				firstDo: true,
				content() {
					let cards1 = [],
						cards2 = [];
					player.getCards("h").forEach(card => {
						let bool1 = lib.skill.xunshi.isXunshi(card),
							bool2 = card.hasGaintag("tyxunshi_tag");
						if (bool1 && !bool2) {
							cards1.add(card);
						}
						if (!bool1 && bool2) {
							cards2.add(card);
						}
					});
					if (cards1.length) {
						player.addGaintag(cards1, "tyxunshi_tag");
					}
					if (cards2.length) {
						cards2.forEach(card => card.removeGaintag("tyxunshi_tag"));
					}
				},
			},
		},
	},
	//范强张达
	tybianta: {
		trigger: { target: "useCardToTargeted" },
		usable: 1,
		filter(event, player) {
			return get.is.damageCard(event.card) && event.cards?.length;
		},
		marktext: "怨",
		intro: {
			name: "怨",
			content: "expansion",
			markcount: "expansion",
		},
		init(player, skill) {
			if (player.getExpansions("tyxingsha").length) {
				for (let card of player.getExpansions("tyxingsha")) {
					card.gaintag.remove("tyxingsha");
					card.gaintag.add(skill);
				}
				player.markSkill(skill);
			}
		},
		onremove(player, skill) {
			if (!_status.event.getParent("tyxiezhan", true)) {
				let cards = player.getExpansions(skill);
				if (cards.length) {
					player.loseToDiscardpile(skill);
				}
			}
		},
		async content(event, trigger, player) {
			const next = player.addToExpansion(trigger.cards, "gain2");
			next.gaintag.add("tybianta");
			await next;
		},
		group: "tybianta_jieshu",
		subSkill: {
			jieshu: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					return player.getExpansions("tybianta").length;
				},
				prompt2: "依次使用或打出你所有的“怨”",
				async content(event, trigger, player) {
					player.addTempSkill("tybianta_use");
					while (player.getExpansions("tybianta").length) {
						const card = player.getExpansions("tybianta")[0];
						if (player.hasUseTarget(card)) {
							const result = await player.chooseUseTarget(card).forResult();
							if (!result.bool) {
								break;
							}
						} else {
							break;
						}
					}
					player.removeSkill("tybianta_use");
				},
			},
			use: {
				enable: ["chooseToUse", "chooseToRespond"],
				filter(event, player) {
					if (!event.tybianta) {
						return false;
					}
					let card = event.tybianta;
					return event.filterCard(card, player, event);
				},
				onChooseToUse(event) {
					if (game.online) {
						return;
					}
					var player = event.player;
					if (!player.getExpansions("tybianta").length) {
						event.set("tybianta", false);
					} else {
						event.set("tybianta", player.getExpansions("tybianta")[0]);
					}
				},
				onChooseToRespond(event) {
					if (game.online) {
						return;
					}
					var player = event.player;
					if (!player.getExpansions("tybianta").length) {
						event.set("tybianta", false);
					} else {
						event.set("tybianta", player.getExpansions("tybianta")[0]);
					}
				},
				filterCard(card, player) {
					return card == _status.event.tybianta;
				},
				selectCard: -1,
				position: "x",
				viewAs(cards, player) {
					let card = _status.event.tybianta;
					if (card) {
						return card;
					}
					return null;
				},
				prompt(event, player) {
					let card = _status.event.tybianta;
					return `是否使用${get.translation(card)}？`;
				},
				precontent() {
					event.result.card = event.result.cards[0];
				},
				hiddenCard(player, name) {
					if (!player.getExpansions("tybianta").length) {
						return false;
					}
					return get.name(player.getExpansions("tybianta")[0], false) == name;
				},
				ai: {
					respondSha: true,
					respondShan: true,
					skillTagFilter(player, tag) {
						let name = tag.slice(7).toLowerCase();
						if (!player.getExpansions("tybianta").length) {
							return false;
						}
						return get.name(player.getExpansions("tybianta")[0], false) == name;
					},
				},
			},
		},
	},
	tybenxiang: {
		trigger: {
			source: "die",
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), lib.filter.notMe, true)
				.set("ai", target => {
					return get.effect(target, { name: "draw" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(3);
		},
	},
	tyxiezhan: {
		audio: "juesheng",
		trigger: {
			player: ["phaseUseBegin", "enterGame"],
			global: "phaseBefore",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		locked: true,
		async cost(event, trigger, player) {
			let list = get.nameList(player),
				bool = trigger.name == "phaseUse";
			if (bool) {
				if (list.includes("ty_fanjiang")) {
					event.result = {
						bool: true,
						cost_data: "ty_zhangda",
					};
				} else if (list.includes("ty_zhangda")) {
					event.result = {
						bool: true,
						cost_data: "ty_fanjiang",
					};
				} else {
					bool = false;
				}
			}
			if (!bool) {
				const result = await player
					.chooseControl("范疆", "张达")
					.set("prompt", "协战：请变身")
					.set("ai", () => [0, 1].randomGet())
					.forResult();
				event.result = {
					bool: true,
					cost_data: result.control == "范疆" ? "ty_fanjiang" : "ty_zhangda",
				};
			}
		},
		async content(event, trigger, player) {
			let prename = player.name1;
			if (player.name2 && get.character(player.name2, 3).includes("tyxiezhan")) {
				prename = player.name2;
			}
			await player.reinitCharacter(prename, event.cost_data);
			await game.delay();
		},
	},
	tyxingsha: {
		marktext: "怨",
		intro: {
			name: "怨",
			content: "expansion",
			markcount: "expansion",
		},
		init(player, skill) {
			if (player.getExpansions("tybianta").length) {
				for (let card of player.getExpansions("tybianta")) {
					card.gaintag.remove("tybianta");
					card.gaintag.add(skill);
				}
				player.markSkill(skill);
			}
		},
		onremove(player, skill) {
			if (!_status.event.getParent("tyxiezhan", true)) {
				let cards = player.getExpansions(skill);
				if (cards.length) {
					player.loseToDiscardpile(skill);
				}
			}
		},
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") && !player.hasSkill("tyxingsha_used");
		},
		filterCard: true,
		selectCard: [1, 2],
		lose: false,
		discard: false,
		async content(event, trigger, player) {
			player.addTempSkill("tyxingsha_used");
			const next = player.addToExpansion(event.cards, player, "give");
			next.gaintag.add("tyxingsha");
			await next;
		},
		group: "tyxingsha_use",
		subSkill: {
			used: {
				charlotte: true,
			},
			use: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					if (!player.hasUseTarget(get.autoViewAs({ name: "sha" }, "unsure"), false)) {
						return false;
					}
					return player.getExpansions("tyxingsha").length;
				},
				async cost(event, trigger, player) {
					const result = await player
						.chooseButton(["刑杀：是否将两张“怨”当作杀使用？", player.getExpansions("tyxingsha")], 2)
						.set("ai", button => {
							let player = get.player(),
								eff = player.getUseValue(get.autoViewAs({ name: "sha" }, "unsure"), false);
							if (eff <= 0) {
								return 0;
							}
							return player.getHp() - player.getUseValue(button.link);
						})
						.forResult();
					event.result = {
						bool: result.bool,
						cards: result.links,
					};
				},
				async content(event, trigger, player) {
					let card = get.autoViewAs({ name: "sha" }, event.cards);
					await player.chooseUseTarget(card, event.cards, false, "nodistance");
				},
			},
		},
	},
	tyxianshou: {
		trigger: {
			source: "die",
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), lib.filter.notMe, true)
				.set("ai", target => {
					return get.effect(target, { name: "recover" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.isDamaged()) {
				await target.recover(2);
			}
		},
	},
	//刘阿
	tyxiyu: {
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			return event.isFirstTarget && (get.is.convertedCard(event.card) || get.is.virtualCard(event.card));
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	//谭雄
	tylengjian: {
		trigger: {
			player: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return !player.getStorage("tylengjian").includes(event.target);
		},
		intro: {
			content: "本回合已对$使用过【杀】",
		},
		forced: true,
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (!player.getStorage("tylengjian").length) {
				player.when({ global: "phaseEnd" }).step(async () => {
					player.unmarkSkill("tylengjian");
					delete player.storage.tylengjian;
				});
			}
			player.markAuto("tylengjian", target);
			if (player.inRange(target)) {
				const id = target.playerid;
				const map = trigger.getParent().customArgs;
				if (!map[id]) {
					map[id] = {};
				}
				if (typeof map[id].extraDamage != "number") {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage++;
			} else {
				trigger.getParent().directHit.push(target);
			}
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "sha" && !player.inRange(target)) {
					if (!player.getStorage("tylengjian").includes(target)) {
						return true;
					}
				}
			},
		},
	},
	tysheju: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return event.targets?.some(current => current.isIn() && current.countDiscardableCards(player, "he"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().getTrigger().targets.includes(target) && target.countDiscardableCards(player, "he");
				})
				.set("ai", target => {
					return get.effect(target, { name: "guohe_copy2" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player.discardPlayerCard(target, "he", true).forResult();
			if (!result?.bool || !result?.links?.length) {
				return;
			}
			let subtype = get.subtype(result.links[0]);
			if (subtype && ["equip3", "equip4", "equip6"].includes(subtype)) {
				return;
			}
			target.addTempSkill("tysheju_range");
			target.addMark("tysheju_range", 1, false);
			if (target.inRange(player)) {
				await target
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"是否对" + get.translation(player) + "使用一张杀？"
					)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", player);
			}
		},
		subSkill: {
			range: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: { content: "本回合攻击范围+#" },
				mod: {
					attackFrom(from, to, distance) {
						return distance - from.countMark("tysheju_range");
					},
				},
			},
		},
	},
	//buzhi
	tyhongde: {
		audio: "hongde",
		trigger: {
			player: ["loseAfter", "gainAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			var num = event.getl(player).cards2.length;
			if (event.getg) {
				num = Math.max(num, event.getg(player).length);
			}
			return num > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", function (target) {
					let player = get.player(),
						name = get.attitude(player, target) > 0 ? "draw" : "guohe_copy2";
					return get.effect(target, { name: name }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseControl("摸一张牌", "弃置一张牌")
				.set("prompt", `令${get.translation(target)}执行一项`)
				.set("target", target)
				.set("ai", () => {
					const player = get.player(),
						target = get.event().target;
					let eff1 = get.effect(target, { name: "guohe_copy2" }, player, player),
						eff2 = get.effect(target, { name: "draw" }, player, player);
					if (eff1 > eff2) {
						return 1;
					}
					return 0;
				})
				.forResult();
			if (result.index == 0) {
				await target.draw();
			} else if (target.countCards("he")) {
				await target.chooseToDiscard("he", true);
			}
		},
	},
	tydingpan: {
		audio: "dingpan",
		enable: "phaseUse",
		usable(skill, player) {
			return get.event().tydingpan?.length;
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("e"));
		},
		filterTarget(event, player, target) {
			return target.countCards("e");
		},
		onChooseToUse(event) {
			if (event.type != "phase" || game.online) {
				return;
			}
			var list = [],
				player = event.player;
			player.getHistory("useCard", function (evt) {
				list.add(get.type2(evt.card));
			});
			event.set("tydingpan", list);
		},
		async content(event, trigger, player) {
			const { target } = event;
			await target.draw();
			let goon = get.damageEffect(target, player, target) >= 0;
			if (!goon && target.hp >= 4 && get.attitude(player, target) < 0) {
				var es = target.getCards("e");
				for (var i = 0; i < es.length; i++) {
					if (get.equipValue(es[i], target) >= 8) {
						goon = true;
						break;
					}
				}
			}
			const result = await target
				.chooseControl(function () {
					if (_status.event.goon) {
						return "选项二";
					}
					return "选项一";
				})
				.set("goon", goon)
				.set("prompt", "定叛")
				.set("choiceList", ["令" + get.translation(player) + "弃置你两张牌", "获得你装备区内的所有牌并受到1点伤害"])
				.forResult();
			if (result.index == 0) {
				await player.discardPlayerCard(target, "he", Math.min(target.countCards("he"), 2), true);
			} else {
				await target.gain(target.getCards("e"), "gain2");
				await target.damage();
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (get.damageEffect(target, player, target) >= 0) {
						return 2;
					}
					var att = get.attitude(player, target);
					if (att == 0) {
						return 0;
					}
					var es = target.getCards("e");
					if (att > 0 && (target.countCards("h") > 2 || target.needsToDiscard(1))) {
						return 0;
					}
					if (es.length == 1 && att > 0) {
						return 0;
					}
					for (var i = 0; i < es.length; i++) {
						var val = get.equipValue(es[i], target);
						if (val <= 4) {
							if (att > 0) {
								return 1;
							}
						} else if (val >= 7) {
							if (att < 0) {
								return -1;
							}
						}
					}
					return 0;
				},
			},
		},
	},
	//甘宁
	tyqixi: {
		audio: "qixi",
		inherit: "qixi",
		group: "tyqixi_nowuxie",
		subSkill: {
			nowuxie: {
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					if (event.card.name != "guohe" || !get.is.convertedCard(event.card)) {
						return false;
					}
					return event.cards?.some(card => get.type(card) != "basic");
				},
				direct: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
				},
			},
		},
	},
	tyfenwei: {
		skillAnimation: true,
		animationColor: "wood",
		audio: "fenwei",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (event.getParent().triggeredTargets3.length > 1) {
				return false;
			}
			if (get.type(event.card) != "trick") {
				return false;
			}
			if (get.info(event.card).multitarget) {
				return false;
			}
			if (event.targets.length < 2) {
				return false;
			}
			return true;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), [1, trigger.targets.length], function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					if (game.phaseNumber > game.players.length * 2 && trigger.targets.length >= game.players.length - 1 && !trigger.excluded.includes(target)) {
						return -get.effect(target, trigger.card, trigger.player, _status.event.player);
					}
					return -1;
				})
				.set("targets", trigger.targets)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.getParent().excluded.addArray(event.targets);
			let num = Math.max(1, player.getAllHistory("useSkill", evt => evt.skill == event.name).length - 1);
			const result = await player
				.chooseBool(`失去${num}点体力，或点取消失去【奋威】`)
				.set("choice", player.hp > num)
				.forResult();
			if (result.bool) {
				await player.loseHp(num);
			} else {
				await player.removeSkills(event.name);
			}
		},
	},
	//陆逊
	tyqianshou: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "其他角色的回合开始时，若其体力值大于你，或其未处于横置状态，你可令其展示并交给你一张牌，若此牌不为黑色，你失去1点体力。";
				}
				return "其他角色的回合开始时，若其体力值大于你，或其未处于横置状态，你可展示并交给其一张红色牌，本回合你不能使用手牌且你与其不能成为牌的目标。";
			},
		},
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			if (event.player.hp <= player.hp && event.player.isLinked()) {
				return false;
			}
			if (player.storage.tyqianshou) {
				return event.player.countCards("he");
			}
			return player.countCards("he", { color: "red" });
		},
		async cost(event, trigger, player) {
			if (player.storage.tyqianshou) {
				event.result = await player
					.chooseBool(get.prompt2(event.skill, trigger.player))
					.set("choice", get.attitude(player, trigger.player) > 0 || player.hp > 1)
					.forResult();
			} else {
				event.result = await player
					.chooseCard(get.prompt2(event.skill, trigger.player), "he", function (card) {
						return get.color(card) == "red";
					})
					.set(
						"canGive",
						(function () {
							const att = get.attitude(player, trigger.player) > 0;
							if (trigger.player.hp >= 3) {
								return att;
							}
							if (trigger.player.countCards("h") < 4) {
								return att;
							}
							return false;
						})()
					)
					.set("ai", card => {
						if (get.event().canGive) {
							return 6 - get.value(card);
						}
						return 0;
					})
					.forResult();
			}
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			if (player.storage[event.name]) {
				await player.showCards(get.translation(player) + "发动了【谦守】", event.cards);
				await player.give(event.cards, event.targets[0]);
				player.addTempSkill("tyqianshou_use");
				for (let target of [player].concat(event.targets)) {
					target.addTempSkill("tyqianshou_target");
				}
			} else {
				const target = event.targets[0],
					result = await target
						.chooseCard("he", true, `交给${get.translation(player)}一张牌，若不为黑色其失去1点体力`)
						.set("att", get.attitude(target, player))
						.set("ai", card => {
							let att = _status.event.att,
								val = 7 - get.value(card);
							if (get.color(card) == "black") {
								val += att;
							}
							return val;
						})
						.forResult();
				await target.showCards(get.translation(player) + "发动了【谦守】", result.cards);
				await target.give(result.cards, player);
				if (
					!player.getHistory("gain", evt => {
						return evt?.cards?.includes(result.cards[0]) && evt.getParent(event.name) == event;
					}).length
				) {
					return;
				}
				if (get.color(result.cards[0]) != "black") {
					await player.loseHp();
				}
			}
		},
		subSkill: {
			use: {
				mark: true,
				marktext: '<span style="text-decoration: line-through;">谦</span>',
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
				charlotte: true,
				intro: {
					content: "不能使用或打出手牌",
				},
			},
			target: {
				charlotte: true,
				mark: true,
				marktext: '<span style="text-decoration: line-through;">守</span>',
				intro: { content: "本回合无法成为牌的目标" },
				mod: { targetEnabled: () => false },
			},
		},
	},
	tytanlong: {
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + game.countPlayer(current => current.isLinked());
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		filterTarget(event, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const next = player.chooseToCompare(target);
			if (get.attitude(player, target) > 0) {
				next.set("small", true);
			}
			const result = await next.forResult();
			if (result.tie) {
				return;
			}
			let winner = result.bool ? player : target,
				card = result[result.bool ? "target" : "player"];
			if (winner?.isIn() && card && [card].filterInD("d")) {
				let bool = get.attitude(winner, player) > 0;
				if (winner.getUseValue(card) >= 4) {
					bool = true;
				}
				const result2 = await winner
					.chooseBool(`是否获得${get.translation(card)}并视为对自己使用一张【铁索连环】？`)
					.set("choice", bool)
					.forResult();
				if (!result2.bool) {
					return;
				}
				await winner.gain(card, "gain2");
				let cardx = { name: "tiesuo", isCard: true };
				if (winner.canUse(cardx, winner)) {
					await winner.useCard(cardx, winner);
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					return get.effect(target, { name: "tiesuo" }, target, target);
				},
			},
		},
	},
	tyxibei: {
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (!event.getg) {
				return [];
			}
			return game
				.filterPlayer(current => {
					if (current == player) {
						return false;
					}
					if (event.name == "gain") {
						return event.getg(current)?.length && event.notFromCardpile;
					}
					return event.getg(current)?.some(card => {
						return card.original != "c";
					});
				})
				.sortBySeat();
		},
		logTarget(event, player, name, target) {
			return target;
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw("nodelay");
			if (!player.isPhaseUsing()) {
				return;
			}
			const result = await player
				.chooseCard("h", "是否展示一张锦囊牌，令此牌视为【火烧连营】？", card => {
					return get.type2(card) == "trick";
				})
				.set("ai", card => {
					let player = get.player();
					if (player.getUseValue("huogong") > 0) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			game.broadcastAll(function (cards) {
				cards.forEach(card => card.addGaintag("tyxibei"));
			}, result.cards);
			player.addTempSkill("tyxibei_viewAs");
		},
		group: "tyxibei_record",
		subSkill: {
			record: {
				trigger: { global: "gainBefore" },
				direct: true,
				filter(event, player) {
					if (player == event.player) {
						return false;
					}
					if (event.cards?.length) {
						if (event.getParent().name == "draw") {
							return false;
						}
						for (var i = 0; i < event.cards.length; i++) {
							if (get.position(event.cards[i]) != "c" || (!get.position(event.cards[i]) && event.cards[i].original != "c")) {
								return true;
							}
						}
					}
					return false;
				},
				content() {
					trigger.notFromCardpile = true;
				},
			},
			viewAs: {
				mod: {
					cardname(card, player) {
						if (card.hasGaintag("tyxibei")) {
							return "lx_huoshaolianying";
						}
					},
				},
				charlotte: true,
				onremove(player) {
					player.removeGaintag("tyxibei");
				},
			},
		},
	},
	//神刘
	tylongnu: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "出牌阶段开始时，你可以减少1点体力上限并摸一张牌，然后本阶段内你可以将锦囊牌当作无次数限制雷杀使用或打出";
				}
				return "锁定技，出牌阶段开始时，你可以失去1点体力并摸一张牌，然后本阶段内你可以将红色手牌当作无距离限制的火杀使用或打出";
			},
		},
		audio: "nzry_longnu",
		trigger: {
			player: "phaseUseBegin",
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji("tylongnu");
			await player.draw();
			if (!player.storage.tylongnu) {
				await player.loseMaxHp();
				player.addTempSkill("tylongnu_yang", "phaseUseAfter");
			} else {
				await player.loseHp();
				player.addTempSkill("tylongnu_yin", "phaseUseAfter");
			}
		},
		group: "tylongnu_change",
		subSkill: {
			change: {
				audio: "nzry_longnu",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【龙怒】为状态" + (player.storage.tylongnu ? "阴" : "阳");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("tylongnu");
				},
			},
			yang: {
				mod: {
					cardUsable(card, player) {
						if (card?.storage?.tylongnu) {
							return Infinity;
						}
					},
				},
				charlotte: true,
				locked: false,
				audio: "nzry_longnu",
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					return get.type2(card) == "trick";
				},
				position: "hes",
				viewAs: {
					name: "sha",
					nature: "thunder",
					storage: {
						tylongnu: true,
					},
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", card => get.type2(card) == "trick")) {
						return false;
					}
				},
				prompt: "将一张锦囊牌当雷杀使用或打出",
				check(card) {
					var val = get.value(card);
					return 5 - val;
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondSha") && current < 0) {
								return 0.6;
							}
						},
					},
					respondSha: true,
				},
			},
			yin: {
				mod: {
					targetInRange(card) {
						if (card?.storage?.tylongnu) {
							return true;
						}
					},
				},
				charlotte: true,
				locked: false,
				audio: "nzry_longnu",
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					return get.color(card) == "red";
				},
				position: "hs",
				viewAs: {
					name: "sha",
					nature: "fire",
					storage: {
						tylongnu: true,
					},
				},
				viewAsFilter(player) {
					if (!player.countCards("hs", { color: "red" })) {
						return false;
					}
				},
				prompt: "将一张红色手牌当火杀使用或打出",
				check(card) {
					var val = get.value(card);
					return 5 - val;
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondSha") && current < 0) {
								return 0.6;
							}
						},
					},
					respondSha: true,
				},
			},
		},
		ai: {
			fireAttack: true,
			halfneg: true,
			threaten: 1.05,
		},
	},
	tytaoyuan: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 2,
		position: "he",
		filterTarget: true,
		check(card) {
			return 4 - get.value(card);
		},
		async content(event, trigger, player) {
			const card = game.createCard("taoyuan", "heart", 1);
			if (card) {
				await event.target.gain(card, "gain2");
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					if (target.getUseValue("taoyuan") * get.sgnAttitude(player, target) >= player.getUseValue("wuzhong")) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	//关银屏
	tywuji: {
		skillAnimation: true,
		animationColor: "orange",
		audio: "wuji",
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		juexingji: true,
		filter(event, player) {
			return player.getStat("damage") >= 3;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recover();
			await player.removeSkills(["huxiao", "draghuxiao"]);
			const result = await player
				.chooseControl("获得青龙刀", "摸两张牌")
				.set("prompt", "武继：选择一项")
				.set("ai", () => 1)
				.forResult();
			if (result.index == 0) {
				const card = game.createCard("qinglong", "spade", 5);
				if (card) {
					await player.gain(card, "gain2", "log");
				}
			} else {
				await player.draw(2);
			}
		},
	},
	//沙和尚
	tymanyong: {
		onremove: true,
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			let hasCard = player.getEquips("tiejili").length > 0;
			if (event.name == "phaseZhunbei") {
				return !hasCard;
			}
			return hasCard;
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				const card = game.createCard("tiejili", "spade", 5);
				if (card) {
					player.$gain2(card);
					await player.chooseUseTarget(card, true);
				}
			} else {
				const cards = player.getEquips("tiejili");
				if (cards?.length) {
					await player.discard(cards);
				}
			}
		},
	},
	//关兴
	tyconglong: {
		trigger: {
			global: ["useCard", "damageBegin1", "phaseEnd"],
		},
		filter(event, player) {
			if (event.name == "phase") {
				let num = 0;
				player.getHistory("lose", evt => {
					if (evt.type == "discard") {
						num += evt.cards2.length;
					}
				});
				return num >= 2;
			}
			if (!event.card || event.card.name != "sha" || get.color(event.card) != "red") {
				return false;
			}
			return player.countCards("he", card => get.type2(card) == (event.name == "damage" ? "equip" : "trick"));
		},
		frequent: true,
		async cost(event, trigger, player) {
			if (trigger.name == "phase") {
				event.result = await player.chooseBool(get.prompt(event.skill), "摸一张牌").set("frequentSkill", event.skill).forResult();
			} else {
				const eff1 = get.damageEffect(trigger.player, trigger.source, player);
				const eff2 = get.attitude(player, trigger.player);
				event.result = await player
					.chooseToDiscard("he", card => {
						const type = _status.event.typex;
						return get.type2(card) == type;
					})
					.set("typex", trigger.name == "damage" ? "equip" : "trick")
					.set("prompt", get.prompt(event.skill))
					.set("prompt2", trigger.name == "damage" ? "令此伤害+1" : "令此牌不可响应")
					.set("eff", trigger.name == "damage" ? eff1 : eff2)
					.set("ai", card => {
						if (get.event().eff <= 0) {
							return 0;
						}
						if (get.color(card) == "red") {
							return 4 - get.value(card);
						}
						return 8 - get.value(card);
					})
					.set("chooseonly", true)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "phase") {
				await player.draw();
			} else {
				await player.discard(event.cards);
				if (trigger.name == "damage") {
					trigger.num++;
				} else {
					trigger.directHit.addArray(game.players);
				}
			}
		},
	},
	tyzhaowu: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!player.countCards("he")) {
				return false;
			}
			return event.source && event.source != player;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("he", get.prompt2(event.skill, trigger.source))
				.set("ai", card => {
					let player = get.player(),
						target = get.event().getTrigger().source;
					if (get.attitude(player, target) >= 0 || player.getStorage("tyzhaowu").includes(target)) {
						return 0;
					}
					return 7 - get.value(card);
				})
				.set("chooseonly", true)
				.forResult();
			event.result.targets = [trigger.source];
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			player.addTempSkill("tyzhaowu_wusheng", "roundStart");
			player.markAuto("tyzhaowu_wusheng", event.targets);
		},
		subSkill: {
			wusheng: {
				mark: true,
				intro: {
					content: "本轮可对$使用父亲的力量",
				},
				charlotte: true,
				onremove: true,
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("tyzhaowu_wusheng").includes(target)) {
							return true;
						}
					},
					playerEnabled(card, player, target) {
						if (player.getStorage("tyzhaowu_wusheng").includes(target)) {
							return;
						}
						if (card.storage?.tyzhaowu) {
							return false;
						}
					},
				},
				locked: false,
				audio: "new_rewusheng",
				enable: "chooseToUse",
				filterCard(card, player) {
					return get.color(card) == "red";
				},
				position: "hes",
				viewAs: {
					name: "sha",
					storage: {
						tyzhaowu: true,
					},
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", { color: "red" })) {
						return false;
					}
				},
				prompt: "将一张红色牌当杀使用或打出",
				check(card) {
					var val = get.value(card);
					return 5 - val;
				},
				ai: {
					respondSha: true,
					skillTagFilter(player) {
						if (!player.countCards("hes", { color: "red" })) {
							return false;
						}
					},
				},
			},
		},
	},
	//侍从
	tyjinzhong: {
		trigger: {
			player: ["phaseUseBegin", "damageEnd"],
		},
		filter(event, player) {
			if (game.hasPlayer(i => i.getSeatNum() == 1 || get.nameList(i).some(name => get.rawName(name) == "刘备"))) {
				return true;
			}
			if (player.countCards("h")) {
				return true;
			}
			return false;
		},
		seatRelated: true,
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl("选项一", "选项二", "cancel2")
				.set("choiceList", ["失去1点体力，令一号位或“刘备”回复1点体力", "交给一名角色至多两张手牌"])
				.set("prompt", get.prompt(event.skill))
				.set(
					"choice",
					(function () {
						let targets = game.filterPlayer(i => i.getSeatNum() == 1 || get.nameList(i).some(name => get.rawName(name) == "刘备"));
						if (targets?.length && targets.some(i => get.attitude(player, i) > 0 && i.hp <= player.hp && i.isDamaged())) {
							return "选项一";
						}
						if (game.hasPlayer(i => get.attitude(player, i) > 0 && player.countCards("h") > Math.min(2, player.hp))) {
							return "选项二";
						}
						return "cancel2";
					})()
				)
				.set("ai", () => get.event().choice)
				.forResult();
			if (result.control == "cancel2") {
				event.result = { bool: false };
				return;
			}
			if (result.control == "选项一") {
				event.result = await player
					.chooseTarget("尽忠：是否失去1点体力并令一号位或“刘备”回复1点体力？", function (card, player, target) {
						return target.getSeatNum() == 1 || get.nameList(target).some(name => get.rawName(name) == "刘备");
					})
					.set("ai", target => {
						const player = get.player();
						if (get.attitude(player, target) <= 0) {
							return 0;
						}
						return player.hp + 1 - target.hp;
					})
					.forResult();
			} else {
				event.result = await player
					.chooseCardTarget({
						filterCard: true,
						selectCard: [1, 2],
						position: "h",
						filterTarget: lib.filter.notMe,
						prompt: "尽忠：是否交给一名其他角色至多两张牌？",
						ai1(card) {
							return 8 - get.value(card);
						},
						ai2(target) {
							let player = _status.event.player,
								card = ui.selected.cards[0],
								att = get.attitude(player, target);
							if (att <= 0) {
								return 0;
							}
							return target.getUseValue(card) + 4;
						},
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (event.cards?.length > 0) {
				await player.give(event.cards, event.targets[0]);
			} else {
				await player.loseHp();
				await event.targets[0].recover();
			}
		},
	},
	//吴班
	tyyoujun: {
		audio: "dcyouzhan",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countGainableCards(player, "he") && target != player;
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.gainPlayerCard(target, "he", true);
			const result = await target
				.chooseBool("是否令你所有手牌视为杀，然后视为对" + get.translation(player) + "使用决斗？")
				.set("choice", get.effect(player, { name: "juedou" }, target, target) > 0)
				.forResult();
			if (result.bool) {
				target.addTempSkill("tyyoujun_sha");
				const card = { name: "juedou", isCard: true };
				if (target.canUse(card, player)) {
					await target.useCard(card, player);
				}
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				mod: {
					cardname(card) {
						return "sha";
					},
				},
			},
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (player.hp == 1) {
						return 0;
					}
					return get.effect(target, { name: "shunshou_copy2" }, player, target);
				},
			},
		},
	},
	tyjicheng: {
		skillAnimation: true,
		animationColor: "fire",
		limited: true,
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (player.hp > 2) {
				return false;
			}
			return event.card && get.type(event.card) == "trick";
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.chooseDrawRecover(2, true);
		},
	},
	//黄忠
	tyyizhuang: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countCards("j");
		},
		check(event, player) {
			return player.hp > 1 && player.countCards("j", card => card.viewAs || card.name != "xumou_jsrg");
		},
		async content(event, trigger, player) {
			await player.damage();
			await player.discardPlayerCard(player, "j", true, player.countCards("j"));
		},
	},
	//廖化
	tydangxian: {
		trigger: { player: "phaseBegin" },
		forced: true,
		audio: "dangxian",
		async content(event, trigger, player) {
			const cards = Array.from(ui.discardPile.childNodes).filter(card => card.name == "sha");
			if (cards.length) {
				const result = await player.chooseButton(["获得一张杀", cards], true).forResult();
				if (result?.bool && result?.links?.length) {
					await player.gain(result.links, "gain2");
				}
			}
			game.updateRoundNumber();
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
	},
	tyfuli: {
		audio: "xinfuli",
		skillAnimation: true,
		animationColor: "soil",
		limited: true,
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type != "dying") {
				return false;
			}
			if (player != event.dying) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(2);
			await player.drawTo(2);
		},
		ai: {
			order: 3,
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target;
			},
			result: { player: 10 },
			threaten(player, target) {
				if (!target.storage.tyfuli) {
					return 0.9;
				}
			},
		},
	},
	//冯习
	tyqingkou: {
		audio: "twqingkou",
		trigger: {
			player: "phaseJieshuBegin",
		},
		frequent: true,
		async content(event, trigger, player) {
			const result = (await player.draw("bottom").forResult()).cards;
			await player.showCards(get.translation(player) + "发动了【轻寇】", result);
			if (result?.length != 1) {
				return;
			}
			let list = [],
				card = result[0];
			for (let name of lib.inpile) {
				if (get.type(name) == "trick" && get.cardNameLength(name) == player.hp) {
					list.push(["锦囊", "", name]);
				}
			}
			list.push(["基本", "", "sha"]);
			const result2 = await player
				.chooseButton([`是否将${get.translation(result)}当作其中一张使用？`, [list, "vcard"]])
				.set("filterButton", button => {
					let card = get.autoViewAs({ name: button.link[2], nature: button.link[3] }, get.event().resultCard);
					return get.player().hasUseTarget(card);
				})
				.set("resultCard", [card])
				.set("ai", button => {
					let card = get.autoViewAs({ name: button.link[2], nature: button.link[3] }, get.event().resultCard);
					return get.player().getUseValue(card);
				})
				.forResult();
			if (result2.bool && player.getCards("h").includes(card)) {
				const cardx = { name: result2.links[0][2], nature: result2.links[0][3] };
				game.broadcastAll(function (card) {
					lib.skill.tyqingkou_backup.viewAs = card;
					lib.skill.tyqingkou_backup.prompt = `是否将此牌当作${get.translation(card)}使用？`;
				}, cardx);
				const next = player.chooseToUse();
				next.set("cards", result);
				next.set("openskilldialog", `是否将此牌当作${get.translation(cardx)}使用？`);
				next.set("norestore", true);
				next.set("_backupevent", "tyqingkou_backup");
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.backup("tyqingkou_backup");
				await next;
			}
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card" && get.event().cards.includes(card);
				},
				position: "h",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
			},
		},
	},
	//张南
	tyfenwu: {
		audio: "twfenwu",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		async content(event, trigger, player) {
			const result = (await player.draw().forResult()).cards;
			if (get.itemtype(result) != "cards") {
				return;
			}
			await player.showCards(get.translation(player) + "发动了【奋武】", result);
			if (result?.length != 1) {
				return;
			}
			let list = [],
				card = result[0];
			for (let name of lib.inpile) {
				if (get.type(name) == "basic" && get.cardNameLength(name) == get.cardNameLength(card)) {
					list.push(["基本", "", name]);
					if (name == "sha") {
						for (let nature of lib.inpile_nature) {
							list.push(["基本", "", name, nature]);
						}
					}
				}
			}
			list.push(["锦囊", "", "juedou"]);
			const result2 = await player
				.chooseButton([`是否将${get.translation(result)}当作其中一张使用？`, [list, "vcard"]])
				.set("filterButton", button => {
					let card = get.autoViewAs({ name: button.link[2], nature: button.link[3] }, get.event().resultCard);
					return get.player().hasUseTarget(card);
				})
				.set("resultCard", [card])
				.set("ai", button => {
					let card = get.autoViewAs({ name: button.link[2], nature: button.link[3] }, get.event().resultCard);
					return get.player().getUseValue(card);
				})
				.forResult();
			if (result2.bool && result2?.links?.length && player.getCards("h").includes(card)) {
				const cardx = { name: result2.links[0][2], nature: result2.links[0][3] };
				game.broadcastAll(function (card) {
					lib.skill.tyfenwu_backup.viewAs = card;
					lib.skill.tyfenwu_backup.prompt = `是否将此牌当作${get.translation(card)}使用？`;
				}, cardx);
				const next = player.chooseToUse();
				next.set("cards", result);
				next.set("openskilldialog", `是否将此牌当作${get.translation(cardx)}使用？`);
				next.set("norestore", true);
				next.set("_backupevent", "tyfenwu_backup");
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.backup("tyfenwu_backup");
				await next;
			}
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card" && get.event().cards.includes(card);
				},
				position: "h",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
				log: false,
			},
		},
	},
	//赵融
	tyyuantao: {
		trigger: {
			global: "useCard",
		},
		usable: 1,
		filter(event, player) {
			if (!event.targets.length) {
				return false;
			}
			return get.type(event.card) == "basic";
		},
		check(event, player) {
			return get.effect(event.targets[0], event.card, event.player, player) > 0 && player.hp > 2;
		},
		async content(event, trigger, player) {
			trigger.effectCount++;
			player.when({ global: "phaseEnd" }).step(async () => {
				await player.loseHp();
			});
		},
	},
	//程畿
	tyzhongen: {
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return player.getHistory("gain").length + player.getHistory("lose", evt => evt.hs?.length).length;
		},
		async cost(event, trigger, player) {
			const target = trigger.player,
				goon = player.hasCard(card => {
					if (_status.connectMode) {
						return true;
					}
					return get.name(card, player) == "sha" && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false && lib.filter.targetEnabled2(get.autoViewAs({ name: "wuzhong" }, [card]), player, target);
				}, "hs");
			let list = [];
			if (goon) {
				list.push("选项一");
			}
			list.addArray(["选项二", "cancel2"]);
			const result = await player
				.chooseControl(list)
				.set("choiceList", [`将一张【杀】当【无中生有】对${get.translation(target)}使用`, `使用一张无距离限制的【杀】`])
				.set("ai", () => {
					const player = get.event().player,
						target = get.event().getTrigger().player;
					return get.effect(target, { name: "wuzhong" }, player, player) > player.getUseValue({ name: "sha" }) ? 0 : 1;
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				skill_popup: false,
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const index = event.cost_data,
				target = trigger.player;
			if (index == "选项一") {
				const { bool, cards } = await player
					.chooseCard(
						"hes",
						true,
						(card, player) => {
							if (get.name(card, player) != "sha") {
								return false;
							}
							if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
								return false;
							}
							return lib.filter.targetEnabled2(get.autoViewAs({ name: "wuzhong" }, [card]), player, get.event().target);
						},
						"将一张【杀】当作【无中生有】对" + get.translation(target) + "使用"
					)
					.set("ai", card => {
						const player = get.event().player,
							target = get.event().target;
						return get.effect(target, get.autoViewAs({ name: "wuzhong" }, [card]), player, player) / Math.max(1, get.value(card));
					})
					.set("target", target)
					.forResult();
				if (bool) {
					player.logSkill(event.name, target);
					await player.useCard({ name: "wuzhong" }, cards, target, false);
				}
			} else {
				await player
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					}, "忠恩：是否使用一张【杀】？")
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("logSkill", event.name)
					.set("addCount", false)
					.forResult();
			}
		},
	},
	tyliebao: {
		trigger: { global: "useCardToTarget" },
		filter(event, player) {
			if (event.card.name != "sha" || event.targets?.includes(player)) {
				return false;
			}
			if (!event.target.isMinHandcard()) {
				return false;
			}
			return lib.filter.targetEnabled(event.card, event.player, player);
		},
		check(event, player) {
			return get.attitude(player, event.target) > 0 && (player.hp > 2 || player.countCards("h", "shan"));
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const evt = trigger.getParent();
			evt.triggeredTargets2.remove(target);
			evt.targets.remove(target);
			evt.targets.push(player);
			await player.draw();
			target
				.when({ global: "useCardAfter" })
				.filter(evt => evt.card == trigger.card)
				.step(async () => {
					if (!player.hasHistory("damage", evtx => evtx.getParent("useCard") == evt) && target.isDamaged()) {
						await target.recover();
					}
				});
		},
	},
	//龙果子
	tyzhuan: {
		audio: "qingbei",
		enable: "phaseUse",
		filterCard(card, player) {
			return get.name(card, player) == "sha";
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("ej", card => get.type(card, target) == "equip");
		},
		check(card) {
			return 5 - get.value(card);
		},
		filter(event, player) {
			if (!player.countCards("he", card => lib.skill.tyzhuan.filterCard(card, player))) {
				return false;
			}
			return game.hasPlayer(target => lib.skill.tyzhuan.filterTarget(event, player, target));
		},
		async content(event, trigger, player) {
			const target = event.target;
			if (!target.countCards("ej", card => get.type(card, target) == "equip")) {
				return;
			}
			await player.gainPlayerCard("ej", target, true).set("filterButton", button => {
				return get.type(button.link, get.owner(button.link)) == "equip";
			});
		},
		ai: {
			order(item, player) {
				if (!player.hasCard(card => player.hasValueTarget(card), "h")) {
					return 9;
				}
				return 1;
			},
			result: {
				target: -1,
			},
		},
		subfrequent: ["draw"],
		group: "tyzhuan_draw",
		subSkill: {
			draw: {
				audio: "tyzhuan",
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return get.type(event.card, null, false) == "equip";
				},
				frequent: true,
				prompt2: "摸一张牌",
				content() {
					player.draw("nodelay");
				},
			},
		},
	},
	//龙刘备
	tyqingshi: {
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget([1, player.hp], get.prompt2(event.skill), function (card, player, target) {
					return target.countCards("h");
				})
				.set("ai", target => {
					return Math.max(0.1, get.attitude(get.player(), target));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.chooseToDebate(event.targets.sortBySeat()).set("callback", lib.skill.tyqingshi.callback);
		},
		async callback(event, trigger, player) {
			const result = event.debateResult;
			if (result.bool && result.opinion) {
				if (!["red", "black"].includes(result.opinion)) {
					return;
				}
				const targets = result[result.opinion].map(i => i[0]);
				if (result.opinion == "red") {
					for (const target of targets) {
						target.addTempSkill("tyqingshi_distance", "roundStart");
						target.addMark("tyqingshi_distance", 1, false);
					}
				} else {
					await player.draw(targets.length);
					let gains = [],
						give_map = [];
					while (true) {
						const result = await player
							.chooseCardTarget({
								filterCard(card) {
									return get.itemtype(card) == "card" && !card.hasGaintag("mbjiejian_tag");
								},
								filterTarget(card, player, target) {
									return get.event().canGain(target) && target != player;
								},
								prompt: "倾师：是否分配手牌？",
								prompt2: "请选择要分配的卡牌和目标",
								ai1(card) {
									return 8 - get.value(card);
								},
								ai2(target) {
									let player = _status.event.player,
										card = ui.selected.cards[0],
										att = get.attitude(player, target);
									if (att <= 0) {
										return 0;
									}
									return target.getUseValue(card) + 4;
								},
							})
							.set("canGain", target => {
								return targets.includes(target) && !gains.includes(target);
							})
							.forResult();
						if (result.bool && result.targets?.length) {
							give_map.add([result.targets[0], result.cards]);
							player.addGaintag(result.cards, "mbjiejian_tag");
							gains.addArray(result.targets);
						} else {
							break;
						}
						if (!game.hasPlayer(i => i != player && targets.includes(i) && !gains.includes(i))) {
							break;
						}
					}
					await game
						.loseAsync({
							gain_list: give_map,
							player: player,
							cards: give_map.map(i => i[1]).flat(),
							giver: player,
							animate: "giveAuto",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
		subSkill: {
			distance: {
				charlotte: true,
				mod: {
					globalFrom(from, to, distance) {
						return distance + from.countMark("tyqingshi_distance");
					},
					globalTo(from, to, distance) {
						return distance + to.countMark("tyqingshi_distance");
					},
				},
				onremove: true,
				mark: true,
				intro: {
					content: "你与其他角色的相互距离+$",
				},
			},
		},
	},
	tyyilin: {
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") {
				return [];
			}
			if (!event.getl || !event.getg) {
				return [];
			}
			let cardsx = event.getl(player).cards2,
				cardsy = event.getg(player);
			return game
				.filterPlayer(current => {
					if (current == player) {
						return false;
					}
					if (player.getHistory("useSkill", evt => evt.skill == "tyyilin" && evt.targets?.includes(current)).length) {
						return false;
					}
					if (cardsx.length) {
						let cards = event.getg(current);
						if (cards?.length && cards.some(card => cardsx.includes(card))) {
							return true;
						}
					}
					if (cardsy.length) {
						let evt = event.getl(current);
						if (evt?.cards2?.length && evt.cards2.some(card => cardsy.includes(card))) {
							return true;
						}
					}
					return false;
				})
				.sortBySeat();
		},
		logTarget(event, player, name, target) {
			return target;
		},
		check(event, player, name, target) {
			return get.attitude(player, target) > 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let cards1 = trigger.getl(player)?.cards2,
				cards2 = trigger.getg(player);
			let cardsx = trigger.getl(target)?.cards2,
				cardsy = trigger.getg(target);
			if (cards1?.some(card => cardsy.includes(card))) {
				await target
					.chooseToUse({
						filterCard(card) {
							if (get.itemtype(card) != "card" || !get.event().useCard.includes(card)) {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						prompt: "是否使用获得的一张牌？",
					})
					.set("useCard", cards1);
			}
			if (cardsx?.some(card => cards2.includes(card))) {
				await player
					.chooseToUse({
						filterCard(card) {
							if (get.itemtype(card) != "card" || !get.event().useCard.includes(card)) {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						prompt: "是否使用获得的一张牌？",
					})
					.set("useCard", cardsx);
			}
		},
	},
	tychengming: {
		skillAnimation: true,
		animationColor: "fire",
		trigger: { player: "dying" },
		zhuSkill: true,
		filter(event, player) {
			if (player.hp > 0) {
				return false;
			}
			if (!player.hasZhuSkill("tychengming")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.group == "shu";
			});
		},
		limited: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return target != player && target.group == "shu";
				})
				.set("ai", target => {
					return Math.max(1, get.attitude(get.player(), target));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			let cards = player.getCards("hej"),
				target = event.targets[0];
			if (cards.length) {
				await target.gain(cards, "give");
			}
			await player.recoverTo(1);
			let skills = target.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || !get.is.locked(skill) || get.skillInfoTranslation(skill, target).length == 0) {
					return false;
				}
				return true;
			});
			if (skills.length) {
				await target.addSkills("rerende");
			}
		},
	},
	//蜀孙权-孩子们，其实我早就是蜀国人了
	tyfuhan: {
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") {
				return [];
			}
			if (!event.getl || !event.getg) {
				return [];
			}
			let cardsx = event.getl(player).cards2,
				cardsy = event.getg(player);
			return game
				.filterPlayer(current => {
					if (current == player) {
						return false;
					}
					if (cardsx.length) {
						let cards = event.getg(current);
						if (cards?.length && cards.some(card => cardsx.includes(card))) {
							return true;
						}
					}
					if (cardsy.length) {
						let evt = event.getl(current);
						if (evt?.cards2?.length && evt.cards2.some(card => cardsy.includes(card))) {
							return true;
						}
					}
					return false;
				})
				.sortBySeat();
		},
		filter(event, player, name, target) {
			if (!target.isIn()) {
				return false;
			}
			return true;
		},
		async cost(event, trigger, player) {
			const target = event.indexedData;
			let dialog = [get.prompt(event.skill, player, target)],
				list1 = [],
				list2 = [],
				bool = false;
			for (let i = 1; i < 6; i++) {
				if (player.hasEnabledSlot(i)) {
					list1.push(i);
				}
				if (player.hasDisabledSlot(i)) {
					list2.push(i);
				}
			}
			if (list2.length && trigger.getl(player)?.cards2?.length && trigger.getg(target).some(card => trigger.getl(player).cards2.includes(card))) {
				dialog.push("恢复其一个装备栏");
				dialog.push([list2.map(i => [[i, true], get.translation(`equip${i}`) + "栏"]), "tdnodes"]);
				bool = true;
			}
			if (list1.length && trigger.getg(player) && trigger.getl(target)?.cards2.some(card => trigger.getg(player).includes(card))) {
				dialog.push("废除其一个装备栏");
				dialog.push([list1.map(i => [[i, false], get.translation(`equip${i}`) + "栏"]), "tdnodes"]);
				bool = true;
			}
			if (bool) {
				const result = await target
					.chooseButton(dialog)
					.set("ai", button => {
						const type = button.link[1];
						if (_status.event.att > 0) {
							if (!_status.event.used || type) {
								return 1 + Math.random();
							}
							return 0;
						}
						return type ? 0 : 1 + Math.random();
					})
					.set("used", player.getHistory("useSkill", evt => evt.skill == "tyfuhan").length > 0)
					.set("att", get.attitude(target, _status.currentPhase))
					.forResult();
				event.result = {
					bool: result.bool,
					targets: [target],
					cost_data: result.links?.[0],
				};
			} else {
				event.result = { bool: false };
			}
		},
		async content(event, trigger, player) {
			const cost = event.cost_data;
			if (cost[1]) {
				await player.enableEquip(cost[0]);
			} else {
				await player.disableEquip(cost[0]);
			}
		},
		group: "tyfuhan_draw",
		subSkill: {
			draw: {
				trigger: {
					global: "phaseEnd",
				},
				filter(event, player) {
					if (!_status.currentPhase || _status.currentPhase.countCards("h") >= _status.currentPhase.maxHp) {
						return false;
					}
					return player.getHistory("useSkill", evt => evt.skill == "tyfuhan").length;
				},
				forced: true,
				locked: true,
				logTarget: () => _status.currentPhase,
				async content(event, trigger, player) {
					await event.targets[0].drawTo(event.targets[0].maxHp);
				},
			},
		},
	},
	tychende: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: [2, Infinity],
		filter(event, player) {
			return player.countCards("h") > 1;
		},
		check(card) {
			const player = get.player();
			if (ui.selected.cards.length >= 2) {
				return 0;
			}
			if (player.getUseValue(card)) {
				return 10 - get.value(card);
			}
			return 6 - get.value(card);
		},
		position: "h",
		lose: false,
		delay: false,
		discard: false,
		filterTarget: lib.filter.notMe,
		allowChooseAll: true,
		async content(event, trigger, player) {
			const target = event.target,
				cards = event.cards;
			await player.showCards(get.translation(player) + "发动了【臣德】", cards);
			await player.give(cards, target, true);
			let list = [];
			for (let card of cards) {
				if (player.hasUseTarget(card, true, true) && ["trick", "basic"].includes(get.type(card))) {
					list.push([get.type(card), "", get.name(card, false), get.nature(card, false)]);
				}
			}
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseButton(["臣德：是否视为使用其中一张？", [list, "vcard"]])
				.set("ai", button => {
					return get.player().getUseValue(button.link[2]);
				})
				.forResult();
			if (result.bool) {
				await player.chooseUseTarget({ name: result.links[0][2], nature: result.links[0][3] }, true);
			}
		},
		ai: {
			order: 6,
			result: {
				target: 1,
			},
		},
	},
	tywansu: {
		trigger: {
			global: ["useCard", "damageBefore"],
		},
		filter(event, player) {
			if (!event.card || !get.is.virtualCard(event.card)) {
				return false;
			}
			if (event.name == "useCard") {
				return game.players.some(target => target.hasDisabledSlot());
			}
			return true;
		},
		forced: true,
		logTarget(event, player) {
			if (event.name == "useCard") {
				return game.players.filter(target => target.hasDisabledSlot());
			}
			return event.player;
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				trigger.directHit.addArray(event.targets);
			} else {
				trigger.cancel();
				trigger.player.loseHp(trigger.num);
			}
		},
		ai: {
			jueqing: true,
		},
	},
	//神秘将军-孩子们，其实我没有死
	tywusheng: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			return get.color(card) == "red";
		},
		position: "hes",
		viewAs: {
			name: "sha",
			storage: {
				tywusheng: true,
			},
		},
		viewAsFilter(player) {
			if (!player.countCards("hes", { color: "red" })) {
				return false;
			}
		},
		precontent() {
			var targets = event.result.targets;
			for (var target of targets) {
				target.addTempSkill("tywusheng_guanjue");
			}
		},
		prompt: "将一张红色牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "red" })) {
					return false;
				}
			},
			respondSha: true,
		},
		subSkill: {
			guanjue: {
				mod: {
					cardEnabled(card, player) {
						let evt = _status.event;
						if (evt.name != "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						if (!evt || !evt.respondTo) {
							return;
						}
						const cardx = evt.respondTo[1];
						if (!cardx.storage?.tywusheng) {
							return;
						}
						const suit = get.suit(card);
						if (suit != "unsure" && suit != get.suit(cardx)) {
							return false;
						}
					},
				},
				charlotte: true,
			},
		},
	},
	tychengshi: {
		trigger: {
			source: "damageSource",
		},
		forced: true,
		usable: 1,
		filter(event, player) {
			if (!_status.currentPhase) {
				return false;
			}
			if (_status.currentPhase != player && !event.player.isIn()) {
				return false;
			}
			return event.card?.name == "sha" && get.color(event.card) == "red";
		},
		async content(event, trigger, player) {
			if (player == _status.currentPhase) {
				let evt = trigger.getParent("useCard", true);
				if (evt?.addCount !== false) {
					evt.addCount = false;
					const stat = evt.player.getStat().card,
						name = evt.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
				}
			} else if (trigger.player.isIn()) {
				trigger.player.addTempSkill("tychengshi_tiaoxin", { global: "phaseAnyEnd" });
				trigger.player.markAuto("tychengshi_tiaoxin", [player]);
			}
		},
		subSkill: {
			tiaoxin: {
				mark: true,
				intro: {
					content(storage, player) {
						if (!storage || !storage.length) {
							return "无记录";
						}
						if (storage.length > 1) {
							return "不能使用伤害类牌指定任何人";
						}
						return `不能使用伤害类牌指定${get.translation(storage)}以外的角色`;
					},
				},
				charlotte: true,
				onremove: true,
				mod: {
					playerEnabled(card, player, target) {
						if (!get.tag(card, "damage")) {
							return;
						}
						let storage = player.getStorage("tychengshi_tiaoxin");
						if (!storage.length) {
							return;
						}
						if (storage.length > 1 || !player.getStorage("tychengshi_tiaoxin").includes(target)) {
							return false;
						}
					},
				},
			},
		},
	},
	tyfuwei: {
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			if (!player.countCards("he") || !event.player.isIn() || event.player == player) {
				return false;
			}
			if (event.player.getSeatNum() == 1) {
				return true;
			}
			if (get.nameList(event.player).some(name => get.rawName(name) == "刘备")) {
				return true;
			}
		},
		usable: 1,
		seatRelated: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.skill, trigger.player),
					prompt2: `交给其至多${trigger.num}张牌，然后可以对伤害来源使用至多${trigger.num}张杀`,
					filterCard: true,
					selectCard: [1, trigger.num],
					position: "he",
					filterTarget(card, player, target) {
						return target == _status.event.getTrigger().player;
					},
					ai1(card) {
						return 4 - get.value(card);
					},
					ai2(target) {
						let att = get.attitude(_status.event.player, target);
						return Math.max(0, att);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = event.cards;
			await player.give(cards, target);
			if (!trigger.source || !trigger.source.isIn() || !player.canUse(get.autoViewAs({ name: "sha" }, "unsure"), trigger.source, false)) {
				return;
			}
			let num = 0;
			while (num < trigger.num) {
				const result = await player
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						`抚危：是否对${get.translation(trigger.source)}使用一张杀？（${num}/${trigger.num}）`
					)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.source)
					.forResult();
				if (result.bool == false) {
					break;
				} else {
					num++;
				}
			}
		},
	},
};

export default skills;
