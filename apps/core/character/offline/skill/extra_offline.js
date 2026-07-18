import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//PE神钟会------by 清风
	pelinjie: {
		audio: "dclinjie",
		marktext: "凛",
		intro: {
			name: "凛界（凛）",
			name2: "凛",
			content: "mark",
		},
		group: "pelinjie_effect",
		trigger: { global: "roundStart" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: `###${get.prompt(event.skill)}###对一名角色造成1点伤害然后令其获得一个「凛」标记`,
					ai(target) {
						return get.damageEffect(target, get.player(), get.player());
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.damage();
			target.addMark(event.name, 1);
		},
		subSkill: {
			effect: {
				audio: "dclinjie",
				forced: true,
				trigger: { global: "damageEnd" },
				filter(event, player) {
					const target = event.player;
					return target !== player && target.hasMark("pelinjie") && target.countDiscardableCards(target, "h");
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = event.targets[0];
					const hs = target.getDiscardableCards(target, "h");
					if (hs.length) {
						const damage = target.countCards("h") == 1;
						await target.chooseToDiscard({ forced: true, position: "h" });
						if (damage) {
							await target.damage();
						}
					}
				},
			},
		},
	},
	peduzhang: {
		audio: "dcduzhang",
		mod: {
			maxHandcard(player, num) {
				return (num += player.countMark("pelinjie"));
			},
		},
		locked: false,
		forced: true,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return get.color(event.card) == "black" && event.targets?.length === 1;
		},
		async content(event, trigger, player) {
			await player.draw({ num: 1 });
			player.addMark("pelinjie", 1);
		},
	},
	pejianghuo: {
		audio: "dcjianghuo",
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "thunder",
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			const num = game
				.filterPlayer(target => target.hasMark("pelinjie"))
				.map(target => target.countMark("pelinjie"))
				.reduce((sum, cur) => sum + cur, 0);
			return num > game.players.length;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = game
				.filterPlayer(target => target !== player && target.hasMark("pelinjie"))
				.map(target => target.countMark("pelinjie"))
				.reduce((sum, cur) => sum + cur, 0);
			game.filterPlayer(target => target !== player).forEach(target => target.clearMark("pelinjie"));
			if (num > 0) {
				player.addMark("pelinjie", num);
			}
			await player.draw({ num: player.countMark("pelinjie") });
			await player.gainMaxHp();
			await player.changeSkills(["pelishi"], ["pelinjie"]);
			player.markSkill("pelinjie");
		},
		ai: { combo: "pelinjie" },
	},
	pelishi: {
		audio: "dclishi",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return !player.hasMark("pelinjie") || game.hasPlayer(current => !player.getStorage("pelishi_effect").includes(current));
		},
		async cost(event, trigger, player) {
			if (!player.hasMark("pelinjie")) {
				event.result = {
					bool: true,
				};
			} else {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						prompt2: "你可失去任意枚“凛”并选择等量名角色令其于其下回合开始时跳过一个阶段",
						filterTarget(card, player, target) {
							return !player.getStorage("pelishi_effect").includes(target);
						},
						selectTarget: [1, player.countMark("pelinjie")],
						ai(target) {
							if (game.hasPlayer(current => get.attitude(player, current) > 2 && current.hasCards("j", card => ["lebu", "bingliang", "shandian"].includes(card.name)))) {
								return get.attitude(player, target) * (target.hasCards("j", card => get.name(card) == "lebu") ? 2 : 0);
							}
							return -get.attitude(get.player(), target);
						},
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (!player.hasMark("pelinjie")) {
				await player.damage("thunder");
			} else {
				const targets = event.targets;
				player.removeMark("pelinjie", targets.length);
				player.addSkill(event.name + "_effect");
				player.markAuto(event.name + "_effect", targets);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "$的回合开始前，你可跳过其一个阶段" },
				trigger: { global: "phaseBefore" },
				filter(event, player) {
					return player.getStorage("pelishi_effect").includes(event.player);
				},
				logTarget: "player",
				async cost(event, trigger, player) {
					player.unmarkAuto(event.skill, [trigger.player]);
					const list = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
					const result = await player
						.chooseButton({
							createDialog: [`你可令${get.translation(trigger.player)}跳过本回合的一个阶段`, [list.map(phase => [phase, get.translation(phase)]), "tdnodes"]],
							ai(button) {
								const { player, target } = get.event();
								if (get.attitude(player, target) > 0) {
									if (target.hasCards("j", card => ["shandian", "lebu", "bingliang"].includes(get.name(card)))) {
										return button.link === "phaseJudge";
									}
									return button.link === "phaseDiscard";
								}
								if (target.countCards("h") > 4) {
									return button.link === "phaseUse";
								}
								return button.link === ["phaseUse", "phaseDraw"].randomGet();
							},
						})
						.set("target", trigger.player)
						.forResult();
					if (result?.bool && result.links?.length) {
						event.result = {
							bool: true,
							cost_data: result.links,
						};
					}
				},
				async content(event, trigger, player) {
					const {
						cost_data: [phase],
						targets: [target],
					} = event;
					target.skip(phase);
					game.log(target, "跳过了", `#y${get.translation(phase)}`);
				},
			},
		},
		ai: { combo: "pelinjie" },
	},
	//线下标记神马
	mark_shouli: {
		audio: "shouli",
		addMark(player, name) {
			const next = game.createEvent("gainShouli", false);
			next.player = player;
			next.num = 1;
			next.mark = name;
			next.setContent("emptyEvent");
			if (player.countMark(name)) {
				next.hasMark = true;
			}
			player.addMark(name, 1);
			return next;
		},
		changeMark(player, target, name) {
			const num = player.countMark(name);
			const next = game.createEvent("gainShouli", false);
			next.player = target;
			next.num = num;
			next.mark = name;
			next.setContent("emptyEvent");
			if (target.countMark(name)) {
				next.hasMark = true;
			}
			player.removeMark(name, num, false);
			target.addMark(name, num, false);
			game.log(player, "的", `#g“${get.translation(name)}”`, "被移动给了", target);
			return next;
		},
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (name != "sha" && name != "shan") {
				return false;
			}
			return (
				!player.getStorage("mark_shouli_used").includes(name) &&
				game.hasPlayer(current => {
					return current != player && current.hasMark(`mark_shouli_${name == "sha" ? "jun" : "li"}`);
				})
			);
		},
		filter(event, player) {
			if (event.responded || event.mark_shouli || event.type == "wuxie") {
				return false;
			}
			return ["sha", "shan"].some(name => {
				if (
					!game.hasPlayer(current => {
						return current != player && current.hasMark(`mark_shouli_${name == "sha" ? "jun" : "li"}`);
					})
				) {
					return false;
				}
				if (player.getStorage("mark_shouli_used").includes(name)) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: name, storage: { mark_shouli: true }, isCard: true }, "unsure"), player, event);
			});
		},
		filterTarget(card, player, target) {
			if (ui.selected.targets?.length) {
				const owner = ui.selected.targets[0];
				return target == owner.getNext() || target == owner.getPrevious();
			}
			if (target == player) {
				return false;
			}
			let event = _status.event,
				evt = event;
			if (event._backup) {
				evt = event._backup;
			}
			return ["sha", "shan"].some(name => {
				const card = get.autoViewAs({ name: name, storage: { mark_shouli: true }, isCard: true }, "unsure"),
					mark = `mark_shouli_${name == "sha" ? "jun" : "li"}`;
				if (!target.hasMark(mark) || player.getStorage("mark_shouli_used").includes(name)) {
					return false;
				}
				if (!evt.filterCard(card, player, event)) {
					return false;
				}
				if (name == "sha") {
					return !evt.filterTarget || game.hasPlayer(current => evt.filterTarget(card, player, current));
				}
				return true;
			});
		},
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		delay: false,
		locked: false,
		prompt: "将一名其他角色的所有“骏”/“骊”移动至其上家或下家，视为使用或打出一张【杀】/【闪】",
		async content(event, trigger, player) {
			const evt = event.getParent(2);
			evt.set("mark_shouli", true);
			const list = [];
			const backupx = _status.event;
			_status.event = evt;
			["sha", "shan"].forEach(name => {
				const card = get.autoViewAs({ name: name, storage: { mark_shouli: true }, isCard: true }, "unsure"),
					mark = `mark_shouli_${name == "sha" ? "jun" : "li"}`;
				if (!event.targets[0].hasMark(mark) || player.getStorage("mark_shouli_used").includes(name)) {
					return false;
				}
				if (name == "sha") {
					if (!evt.filterCard(card, player, evt)) {
						return false;
					}
					if (evt.filterTarget && !game.hasPlayer(current => evt.filterTarget(card, player, current))) {
						return false;
					}
				} else if (!evt.filterCard(card, player, event)) {
					return false;
				}
				list.push(["", "", name]);
			});
			_status.event = backupx;
			const result =
				list.length > 1
					? await player
							.chooseButton(["狩骊：选择你要视为使用的牌", [list, "vcard"]], true)
							.set("ai", button => {
								return Math.random();
							})
							.forResult()
					: {
							bool: true,
							links: list,
						};
			if (!result?.bool) {
				return;
			}
			const name = result.links[0][2],
				mark = `mark_shouli_${name == "sha" ? "jun" : "li"}`;
			get.info(event.name).changeMark(...event.targets, mark);
			player.addTempSkill("mark_shouli_used");
			player.markAuto("mark_shouli_used", name);
			if (evt.name == "chooseToUse") {
				game.broadcastAll(function (name) {
					lib.skill.mark_shouli_backup.viewAs = {
						name: name,
						storage: { mark_shouli: true },
						isCard: true,
					};
					lib.skill.mark_shouli_backup.prompt = `选择${get.translation(name)}的目标`;
				}, name);
				evt.set("_backupevent", "mark_shouli_backup");
				evt.backup("mark_shouli_backup");
				evt.set("openskilldialog", `选择${get.translation(name)}的目标`);
				evt.set("norestore", true);
				evt.set("custom", {
					add: {},
					replace: { window() {} },
				});
			} else {
				delete evt.result.used;
				delete evt.result.skill;
				evt.result.card = get.autoViewAs({
					name: name,
					storage: { mark_shouli: true },
					isCard: true,
				});
				evt.result.cards = [];
				evt.redo();
				return;
			}
			evt.goto(0);
		},
		mod: {
			targetInRange(card, player) {
				if (card?.storage?.mark_shouli) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (card?.storage?.mark_shouli) {
					return Infinity;
				}
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				return get.info("mark_shouli").hiddenCard(player, tag == "respondSha" ? "sha" : "shan");
			},
			order: 2,
			result: {
				player(player, target) {
					var att = Math.max(8, get.attitude(player, target));
					if (ui.selected.targets?.length) {
						return 10 + att;
					}
					if (_status.event.type != "phase") {
						return 9 - att;
					}
					if (!player.hasValueTarget({ name: "sha" }, false)) {
						return 0;
					}
					return 9 - att;
				},
			},
		},
		derivation: ["mark_shouli_jun", "mark_shouli_li"],
		group: "mark_shouli_init",
		global: "mark_shouli_effect",
		subSkill: {
			effect: {
				trigger: {
					player: ["phaseDrawBegin2", "useCardToPlayer", "damageBegin3", "damageBegin4"],
					source: "damageBegin1",
				},
				filter(event, player, name) {
					const target = name == "damageBegin1" ? event.source : event.player;
					if (!target?.isIn() || !game.hasPlayer(current => current.hasSkill("mark_shouli"))) {
						return false;
					}
					const jun = target.countMark("mark_shouli_jun"),
						li = target.countMark("mark_shouli_li");
					if (name == "damageBegin4") {
						if (jun + li <= 0) {
							return false;
						}
						if (event.hasNature()) {
							return true;
						}
						return event.card?.name && ["wanjian", "nanman"].includes(event.card.name);
					}
					if (name == "useCardToPlayer") {
						return event.card?.name == "sha" && jun > 2;
					}
					if (event.name == "damage") {
						return li > 2;
					}
					return (jun > 1 || li > 1) && !event.numFixed;
				},
				async cost(event, trigger, player) {
					event.result = {
						bool: true,
						skill_popup: false,
					};
				},
				async content(event, trigger, player) {
					const name = event.triggername,
						target = trigger[name == "damageBegin1" ? "source" : "player"],
						jun = target.countMark("mark_shouli_jun"),
						li = target.countMark("mark_shouli_li"),
						num = game.countPlayer(current => current.hasSkill("mark_shouli"));
					switch (name) {
						case "phaseDrawBegin2": {
							if (jun > 1) {
								trigger.num += num;
							}
							if (li > 1) {
								trigger.num += num;
							}
							break;
						}
						case "useCardToPlayer": {
							trigger.target.addTempSkill("fengyin");
							break;
						}
						case "damageBegin1": {
							if (li > 2) {
								game.setNature(trigger, "thunder");
							}
							if (li > 3) {
								trigger.num += num;
							}
							break;
						}
						case "damageBegin3": {
							if (li > 2) {
								game.setNature(trigger, "thunder");
							}
							if (li > 3) {
								trigger.num += num;
							}
							break;
						}
						default: {
							if (jun > 0 && target.getPrevious()?.isIn() && target.getPrevious() != target) {
								get.info("mark_shouli").changeMark(target, target.getPrevious(), "mark_shouli_jun");
							}
							if (li > 0 && target.getNext()?.isIn() && target.getNext() != target) {
								get.info("mark_shouli").changeMark(target, target.getNext(), "mark_shouli_li");
							}
							break;
						}
					}
				},
				locked: false,
				mod: {
					globalFrom(from, to, distance) {
						if (!from.countMark("mark_shouli_jun")) {
							return;
						}
						const num = game.countPlayer(current => current.hasSkill("mark_shouli"));
						return distance - num;
					},
					globalTo(from, to, distance) {
						if (!to.countMark("mark_shouli_li")) {
							return;
						}
						const num = game.countPlayer(current => current.hasSkill("mark_shouli"));
						return distance + num;
					},
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: {
				async precontent(event, trigger, player) {
					event.result._apply_args = { addSkillCount: false };
					player.popup(event.result.card.name, "metal");
					await game.delayx();
					event.getParent().addCount = false;
				},
				filterCard: () => false,
				prompt: "请选择【杀】的目标",
				selectCard: -1,
				log: false,
			},
			init: {
				audio: "mark_shouli",
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					if (!game.hasPlayer(current => current != player)) {
						return false;
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async cost(event, trigger, player) {
					event.result = {
						bool: true,
						targets: game.filterPlayer(current => current != player),
					};
				},
				async content(event, trigger, player) {
					let marks = [];
					for (let i = 0; i < 4; i++) {
						marks.push("mark_shouli_li");
						if (i < 3) {
							marks.push("mark_shouli_jun");
						}
					}
					for (const target of event.targets) {
						if (!marks.length) {
							break;
						}
						const mark = marks.randomRemove();
						await get.info("mark_shouli").addMark(target, mark);
					}
				},
			},
			jun: {
				markimage2: "image/card/chitu.png",
				nopop: true,
				intro: {
					name: "骏",
					content(storage, player) {
						const list = ["⚡你计算与其他角色的距离-1", "⚡摸牌阶段你额外摸一张牌", "⚡你使用【杀】指定目标时，令其本回合非锁定技失效"];
						let str = "⚡当你受到属性伤害或【南蛮入侵】、【万箭齐发】造成的伤害时，你将所有“骏”移动至你上家";
						if (typeof storage != "number" || storage <= 0) {
							return str;
						}
						return `${str}<br>${list.slice(0, storage).join("<br>")}`;
					},
				},
			},
			li: {
				markimage2: "image/card/dilu.png",
				nopop: true,
				intro: {
					name: "骊",
					content(storage, player) {
						const list = ["⚡其他角色计算与你的距离+1", "⚡摸牌阶段你额外摸一张牌", "⚡你造成或受到的伤害视为雷电伤害", "⚡你造成或受到的伤害+1"];
						let str = "⚡当你受到属性伤害或【南蛮入侵】、【万箭齐发】造成的伤害时，你将所有“骊”移动至你下家";
						if (typeof storage != "number" || storage <= 0) {
							return str;
						}
						return `${str}<br>${list.slice(0, storage).join("<br>")}`;
					},
				},
			},
		},
	},
	mark_hengwu: {
		audio: "hengwu",
		trigger: {
			global: "gainShouli",
		},
		filter(event, player) {
			const mark = event.mark;
			return event.hasMark && event.player.countMark(mark);
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			await player.draw(trigger.player.countMark(trigger.mark));
		},
		ai: {
			combo: "mark_shouli",
		},
	},
	//SM神马超
	sm_tuanlian: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "damageEnd"],
			source: "damageSource",
		},
		filter(event, player, name) {
			if (event.name == "damage") {
				const key = name == "damageSource" ? "sourceDamage" : "damage";
				return player.getHistory(key, evt => evt.num > 0).indexOf(event) == 0;
				/*return (
					game
						.getGlobalHistory("everything", evt => {
							if (evt.name != "damage") {
								return false;
							}
							if (name == "damageEnd" && evt.player == evt.source) {
								return false;
							}
							return evt.player == player || evt.source == player;
						})
						.indexOf(event) == 0
				);*/
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const info = get.info(event.name);
			const characters = info.getCharacters(trigger.name == "damage" ? 1 : 5);
			info.addVisitors(characters, player);
			const next = game.createEvent("addPrettyDerby", false);
			next.player = player;
			next.characters = characters;
			next.setContent("emptyEvent");
			await next;
		},
		onremove(player, skill) {
			get.info(skill).removeVisitors(player.getStorage(skill), player);
		},
		getCharacters(num) {
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			const list = _status.characterlist.filter(name => {
				const title = get.characterTitle(name);
				if (title.includes("马")) {
					return true;
				}
				const surnames = get.characterSurname(name).map(list => list.join(""));
				return surnames.length && surnames.some(surname => surname.includes("马"));
			});
			if (!list.length) {
				return [];
			}
			return list.randomGets(Math.min(list.length, num));
		},
		getSkills(characters, player) {
			if (!player.hasSkill("sm_jingji")) {
				return [];
			}
			const list = [];
			for (const name of characters) {
				const { skills } = get.character(name);
				if (Array.isArray(skills) && skills.length) {
					list.add(skills[0]);
				}
			}
			return list;
		},
		addVisitors(characters, player) {
			_status.characterlist.removeArray(characters);
			game.log(player, "将", "#y" + get.translation(characters), "加入了", "#g“赛马”");
			game.broadcastAll(
				function (player, characters) {
					player.tempname.addArray(characters);
					player.$draw(
						characters.map(function (name) {
							var cardname = "huashen_card_" + name;
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + name,
							};
							lib.translate[cardname] = get.rawName2(name);
							return game.createCard(cardname, " ", " ");
						}),
						"nobroadcast"
					);
				},
				player,
				characters
			);
			player.markAuto("sm_tuanlian", characters);
		},
		removeVisitors(characters, player) {
			if (Array.isArray(player.tempname)) {
				game.broadcastAll((player, characters) => player.tempname.removeArray(characters), player, characters);
			}
			player.unmarkAuto("sm_tuanlian", characters);
			_status.characterlist.addArray(characters);
		},
		marktext: "马",
		intro: {
			name: "赛马",
			mark(dialog, storage, player) {
				if (!storage || !storage.length) {
					return "当前没有“赛马”";
				}
				dialog.addSmall([storage, "character"]);
				const skills = lib.skill.sm_tuanlian.getSkills(storage, player);
				if (skills.length) {
					dialog.addText("<li>当前可用技能：" + get.translation(skills), false);
				}
			},
		},
		ai: {
			combo: "sm_jingji",
		},
	},
	sm_jingji: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (!player.getStorage("sm_tuanlian").length) {
				return false;
			}
			const equip = get.autoViewAs({ name: "sm_prettyDerby", isCard: true });
			if (event.filterCard(equip, player, event)) {
				return true;
			}
			return get.inpileVCardList(info => {
				if (!["trick", "basic"].includes(info[0])) {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true });
				return event.filterCard(card, player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (!["trick", "basic"].includes(info[0])) {
						return false;
					}
					const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true });
					return event.filterCard(card, player, event);
				});
				const equip = get.autoViewAs({ name: "sm_prettyDerby", isCard: true });
				if (event.filterCard(equip, player, event)) {
					list.add(["equip", "", "sm_prettyDerby"]);
				}
				const dialog = ui.create.dialog("竞激", [list, "vcard"], "hidden");
				return dialog;
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				const card = get.autoViewAs({ name: button.link[2], nature: button.link[3], isCard: true });
				return get.player().getUseValue(card);
			},
			prompt(links, player) {
				return `移去一张“赛马”，然后视为使用${get.translation(links[0][3] || "")}${get.translation(links[0][2])}`;
			},
			backup(links, player) {
				return {
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					selectCard: -1,
					filterCard: () => false,
					popname: true,
					log: false,
					manualConfirm: true,
					async precontent(event, trigger, player) {
						const characters = player.getStorage("sm_tuanlian").slice(0);
						const result =
							characters.length > 1
								? await player.chooseButton(["竟激：移去一张“赛马”", [characters, "character"]], true).forResult()
								: {
										bool: true,
										links: characters,
									};
						if (result?.bool && result.links?.length) {
							player.logSkill("sm_jingji");
							get.info("sm_tuanlian").removeVisitors(result.links, player);
							game.log(player, "移去了", "#y" + get.translation(result.links));
							const next = game.createEvent("removePrettyDerby", false);
							next.player = player;
							next.characters = result.links;
							next.setContent("emptyEvent");
							await next;
						}
						const type = get.type(event.result.card);
						player
							.when({
								player: "useCard",
							})
							.filter(evt => evt.getParent() == event.getParent())
							.step(async (event, trigger, player) => {
								if (type == "basic") {
									trigger.baseDamage ??= 1;
									trigger.baseDamage++;
								}
								if (type == "trick") {
									await player.draw();
								}
							});
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (!["trick", "basic"].includes(get.type(name))) {
				return false;
			}
			return player.getStorage("sm_tuanlian").length;
		},
		init(player, skill) {
			player.addSkill("sm_jingji_load");
		},
		onremove(player, skill) {
			const skills = get.info("sm_tuanlian").getSkills(player.getStorage("sm_tuanlian"), player);
			if (skills?.length) {
				player.removeInvisibleSkill(skills);
			}
			player.removeSkill("sm_jingji_load");
		},
		ai: {
			order: 2,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
				},
			},
			combo: "sm_tuanlian",
		},
		group: ["sm_jingji_remove", "sm_jingji_trigger"],
		subSkill: {
			remove: {
				audio: "sm_jingji",
				trigger: { player: ["useSkill", "logSkillBegin"] },
				forced: true,
				locked: false,
				filter(event, player) {
					const skill = get.sourceSkillFor(event),
						name = "sm_tuanlian";
					if (!player.invisibleSkills.includes(skill)) {
						return false;
					}
					return get.info(name).getSkills(player.getStorage(name), player).includes(skill);
				},
				async content(event, trigger, player) {
					const name = "sm_tuanlian",
						skill = get.sourceSkillFor(trigger),
						info = get.info(name),
						visitors = player.getStorage(name).filter(namex => get.character(namex).skills?.includes(skill));
					if (!visitors?.length) {
						return;
					}
					const result =
						visitors.length > 1
							? await player.chooseButton(["竟激：移去一张“赛马”", [visitors, "character"]], true).forResult()
							: {
									bool: true,
									links: visitors,
								};
					if (result?.bool && result.links?.length) {
						info.removeVisitors(result.links, player);
						game.log(player, "移去了", "#y" + get.translation(result.links[0]));
						const next = game.createEvent("removePrettyDerby", false);
						next.player = player;
						next.characters = result.links;
						next.setContent("emptyEvent");
						await next;
					}
				},
			},
			trigger: {
				trigger: { player: "triggerInvisible" },
				forced: true,
				forceDie: true,
				popup: false,
				charlotte: true,
				priority: 10,
				filter(event, player, name, indexedData) {
					if (event.revealed) {
						return false;
					}
					const info = get.info(event.skill);
					if (info.charlotte) {
						return false;
					}
					const skills = lib.skill.sm_tuanlian.getSkills(player.getStorage("sm_tuanlian"), player);
					game.expandSkills(skills);
					if (!skills.includes(event.skill)) {
						return false;
					}
					return lib.filter.filterTrigger(event, player, name, event.skill, indexedData);
				},
				async content(evt, event, player) {
					const info = get.info(event.skill);
					if (info.slient) {
						return;
					}
					const trigger = evt._trigger,
						check = info.check;
					let str;
					if (info.prompt) {
						str = info.prompt;
					} else {
						if (typeof info.logTarget == "string") {
							str = get.prompt(event.skill, trigger[info.logTarget], player);
						} else if (typeof info.logTarget == "function") {
							let logTarget = info.logTarget(trigger, player, trigger.triggername, trigger.indexedData);
							if (get.itemtype(logTarget)?.indexOf("player") == 0) {
								str = get.prompt(event.skill, logTarget, player);
							}
						} else {
							str = get.prompt(event.skill, null, player);
						}
					}
					if (typeof str == "function") {
						str = str(trigger, player, trigger.triggername, trigger.indexedData);
					}
					const next = player.chooseBool(`竟激：${str}`);
					next.set("yes", !info.check || info.check(trigger, player, trigger.triggername, trigger.indexedData));
					next.set("hsskill", event.skill);
					next.set("forceDie", true);
					next.set("ai", function () {
						return _status.event.yes;
					});
					if (typeof info.prompt2 == "function") {
						next.set("prompt2", info.prompt2(trigger, player, trigger.triggername, trigger.indexedData));
					} else if (typeof info.prompt2 == "string") {
						next.set("prompt2", info.prompt2);
					} else if (info.prompt2 != false) {
						if (lib.dynamicTranslate[event.skill]) {
							next.set("prompt2", lib.dynamicTranslate[event.skill](player, event.skill));
						} else if (lib.translate[event.skill + "_info"]) {
							next.set("prompt2", lib.translate[event.skill + "_info"]);
						}
					}
					if (trigger.skillwarn) {
						if (next.prompt2) {
							next.set("prompt2", '<span class="thundertext">' + trigger.skillwarn + "。</span>" + next.prompt2);
						} else {
							next.set("prompt2", trigger.skillwarn);
						}
					}
					const result = await next.forResult();
					if (result?.bool) {
						if (!info.cost) {
							trigger.revealed = true;
						}
					} else {
						trigger.untrigger();
						trigger.cancelled = true;
					}
				},
			},
			load: {
				trigger: {
					player: ["addPrettyDerby", "removePrettyDerby"],
				},
				filter(event, player) {
					return event.characters?.length;
				},
				direct: true,
				firstDo: true,
				charlotte: true,
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				skillBlocker(skill, player) {
					if (!player.invisibleSkills.includes(skill) || skill == "sm_tuanlian" || skill == "sm_jingji") {
						return false;
					}
					return !player.hasSkill("sm_jingji");
				},
				async content(event, trigger, player) {
					const skills = get.info("sm_tuanlian").getSkills(trigger.characters, player);
					if (!skills?.length) {
						return;
					}
					if (trigger.name == "addPrettyDerby") {
						player.addInvisibleSkill(skills);
					} else {
						player.removeInvisibleSkill(skills);
					}
				},
			},
		},
	},
	sm_kuangchi: {
		audio: 2,
		trigger: {
			source: "dieAfter",
		},
		filter(event, player) {
			const target = event.player;
			if (event.reserveOut || target.maxHp <= 0) {
				return false;
			}
			return player.getStorage("sm_tuanlian").length;
		},
		logTarget: "player",
		async cost(event, trigger, player) {
			const names = player.getStorage("sm_tuanlian"),
				target = trigger.player;
			const result = await player
				.chooseButton([get.prompt(event.skill, target), [names, "character"]])
				.set("ai", () => {
					return Math.random();
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links[0],
				};
			}
		},
		async content(event, trigger, player) {
			const target = trigger.player,
				name = event.cost_data;
			trigger.cancel();
			const names = get.nameList(target);
			const result =
				names.length > 1
					? await player
							.chooseControl(names)
							.set("ai", () => {
								const { controls } = get.event();
								return controls.slice().sort((a, b) => get.rank(b, true) - get.rank(a, true))[0];
							})
							.set("prompt", "请选择替换的武将牌")
							.forResult()
					: { control: names[0] };
			if (result.control) {
				get.info("sm_tuanlian").removeVisitors([name], player);
				game.log(player, "移去了", "#y" + get.translation(name));
				const next = game.createEvent("removePrettyDerby", false);
				next.player = player;
				next.characters = [name];
				next.setContent("emptyEvent");
				await next;
				await target.reviveEvent(2);
				let doubleDraw = false;
				let num = (get.character(name).maxHp || get.character(name).hp) - (get.character(result.control).maxHp || get.character(result.control).hp);
				if (num !== 0) {
					if (typeof target.singleHp === "boolean") {
						if (num % 2 !== 0) {
							if (target.singleHp) {
								target.maxHp += (num + 1) / 2;
								target.singleHp = false;
							} else {
								target.maxHp += (num - 1) / 2;
								target.singleHp = true;
								doubleDraw = true;
							}
						} else {
							target.maxHp += num / 2;
						}
					} else {
						target.maxHp += num;
					}
					target.update();
				}
				await target.reinitCharacter(result.control, name);
				const owner = player["zombieshibian"] || player;
				game.broadcastAll(
					(player, target) => {
						target["zombieshibian"] = player;
						const identity = (target.identity = (identity => {
							switch (identity) {
								case "zhu":
								case "mingzhong":
									return "zhong";
								case "zhu_false":
									return "zhong_false";
								case "bZhu":
									return "bZhong";
								case "rZhu":
									return "rZhong";
								default:
									return identity;
							}
						})(player.identity));
						if (!lib.translate[identity]) {
							lib.translate[identity] = "马";
						}
						const goon = player !== game.me && target !== game.me && player.node.identity.classList.contains("guessing") && !player.identityShown;
						if (goon) {
							if (target.identityShown) {
								delete target.identityShown;
							}
							if (!target.node.identity.classList.contains("guessing")) {
								target.node.identity.classList.add("guessing");
							}
						}
						target.setIdentity(goon ? "cai" : undefined);
						if (target.node.dieidentity) {
							target.node.dieidentity.innerHTML = get.translation(target.identity + 2);
						}
						if (typeof player.ai?.shown === "number" && target.ai) {
							target.ai.shown = player.ai.shown;
						}
						if (typeof player.side == "boolean") {
							target.side = player.side;
							target.node.identity.firstChild.innerHTML = player.node.identity.firstChild.innerHTML;
							target.node.identity.dataset.color = player.node.identity.dataset.color;
						}
						if (_status._zombieshibian) {
							return;
						}
						_status.zombieshibian = true;
						//检测游戏胜负
						if (typeof game.checkResult === "function") {
							const origin_checkResult = game.checkResult;
							game.checkResult = function () {
								const player = game.me._trueMe || game.me;
								if (game.players.filter(i => i !== player).every(i => i["zombieshibian"] === (player["zombieshibian"] || player))) {
									game.over(true);
								}
								return origin_checkResult.apply(this, arguments);
							};
						}
						if (typeof game.checkOnlineResult === "function") {
							const origin_checkOnlineResult = game.checkOnlineResult;
							game.checkOnlineResult = function (player) {
								if (game.players.filter(i => i !== player).every(i => i["zombieshibian"] === (player["zombieshibian"] || player))) {
									return true;
								}
								return origin_checkOnlineResult.apply(this, arguments);
							};
						}
						//敌友判定
						if (typeof lib.element.player.getFriends === "function") {
							const origin_getFriends = lib.element.player.getFriends;
							const getFriends = function (func, includeDie) {
								const player = this;
								return [...origin_getFriends.apply(this, arguments), ...game[includeDie ? "filterPlayer2" : "filterPlayer"](target => (target["zombieshibian"] || target) === (player["zombieshibian"] || player))]
									.filter(i => i !== player || func === true)
									.unique()
									.sortBySeat(player);
							};
							lib.element.player.getFriends = getFriends;
							[...game.players, ...game.dead].forEach(i => (i.getFriends = getFriends));
						}
						if (typeof lib.element.player.isFriendOf === "function") {
							const origin_isFriendOf = lib.element.player.isFriendOf;
							const isFriendOf = function (player) {
								if ((this["zombieshibian"] || this) === (player["zombieshibian"] || player)) {
									return true;
								}
								return origin_isFriendOf.apply(this, arguments);
							};
							lib.element.player.isFriendOf = isFriendOf;
							[...game.players, ...game.dead].forEach(i => (i.isFriendOf = isFriendOf));
						}
						if (typeof lib.element.player.getEnemies === "function") {
							const origin_getEnemies = lib.element.player.getEnemies;
							const getEnemies = function (func, includeDie) {
								if (this["zombieshibian"]) {
									return this["zombieshibian"].getEnemies(func, includeDie);
								} else {
									const player = this;
									return [
										...origin_getEnemies.apply(this, arguments),
										...game[includeDie ? "filterPlayer2" : "filterPlayer"](target => {
											return origin_getEnemies.apply(this, arguments).includes(target["zombieshibian"] || target);
										}),
									]
										.filter(i => player != (i["zombieshibian"] || i))
										.unique()
										.sortBySeat(player);
								}
							};
							lib.element.player.getEnemies = getEnemies;
							[...game.players, ...game.dead].forEach(i => (i.getEnemies = getEnemies));
						}
					},
					owner,
					target
				);
				target.ai.modAttitudeFrom = function (from, to) {
					if (to == from["zombieshibian"]) {
						return 114514;
					}
					return get.attitude(from["zombieshibian"] || from, to["zombieshibian"] || to);
				};
				target.ai.modAttitudeTo = function (from, to, att) {
					if (from == to["zombieshibian"]) {
						return 7;
					}
					return get.attitude(from["zombieshibian"] || from, to["zombieshibian"] || to);
				};
				if (doubleDraw) {
					await target.doubleDraw();
				}
			}
		},
		ai: {
			combo: "sm_tuanlian",
		},
	},
	sm_kulian: {
		audio: 2,
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		logTarget(event, player) {
			return game.filterPlayer(() => true);
		},
		async content(event, trigger, player) {
			const func = async target => {
				const card = get.cardPile2(card => {
					return get.subtypes(card).containsSome("equip3", "equip4", "equip6");
				}, "random");
				if (card) {
					target.$gain2(card);
					await target.equip(card);
				}
				const card2 = game.createCard2("sm_mabian", "heart", 13);
				target.$gain2(card2);
				await target.equip(card2);
				await game.delayx();
			};
			await game.doAsyncInOrder(event.targets, func);
			game.addGlobalSkill("sm_kulian_prettyDerby");
		},
		derivation: "sm_kulian_reward",
		subSkill: {
			prettyDerby: {
				trigger: {
					global: ["roundStart", "roundEnd", "loseAsyncAfter", "gainAfter", "addJudgeAfter", "equipAfter", "addToExpansionAfter"],
					source: "damageSource",
					player: "loseAfter",
				},
				filter(event, player, name) {
					if (name == "roundStart") {
						return !event._PerttyDerbyed;
					}
					if (name == "roundEnd") {
						return _status.prettyDerbyDoing?.length;
					}
					if (event.name == "damage") {
						if (!player.getEquip("sm_mabian") || player.hasSkill("sm_kulian_damaged")) {
							return false;
						}
						return event.player != player && event.player.getEquip("sm_mabian");
					}
					const es = event.getl(player)?.es;
					return es?.length && es.some(card => card.name == "sm_mabian");
				},
				direct: true,
				async content(event, trigger, player) {
					switch (event.triggername) {
						case "roundStart": {
							trigger.set("_PerttyDerbyed", true);
							game.log("#y新一轮赛马比赛开始！");
							const list = get.info(event.name).initList(event.name);
							list.forEach((obj, index) => {
								game.log(`本轮赛马奖励${index + 1}：`, `#g${obj.info}[奖励：${obj.reward}]`);
							});
							game.broadcastAll(list => {
								_status.prettyDerbyDoing = list;
							}, list);
							const target = game.findPlayer(current => current.hasSkill("sm_kulian")),
								func = async target => {
									target.markSkill(event.name);
								};
							if (target) {
								await func(target);
							} else {
								await game.doAsyncInOrder(
									game.filterPlayer(() => true),
									func
								);
							}
							return;
						}
						case "roundEnd": {
							game.log("#y赛马比赛结束");
							await game.doAsyncInOrder(
								game.filterPlayer(() => true),
								async target => {
									target.unmarkSkill(event.name);
								}
							);
							const next = game.createEvent("perttyDerbyEnd", false);
							next.set("rewards", _status.prettyDerbyDoing);
							next.setContent("emptyEvent");
							await next;
							while (_status.prettyDerbyDoing.length) {
								const map = _status.prettyDerbyDoing.shift();
								game.broadcastAll(list => {
									_status.prettyDerbyDoing = list;
								}, _status.prettyDerbyDoing);
								const targets = game
									.filterPlayer(current => {
										return current.getEquip("sm_mabian");
									})
									.sort((a, b) => {
										return map.filter(b) - map.filter(a);
									});
								if (!targets.length) {
									continue;
								}
								if (targets.length > 1 && map.filter(targets[0]) == map.filter(targets[1])) {
									continue;
								}
								const target = targets[0];
								game.log(target, "执行了赛马奖励：", `#g${map.reward}`);
								await map.content(target);
							}
							return;
						}
						case "damageSource": {
							player.addTempSkill("sm_kulian_damaged");
							player.logSkill("sm_kulian", trigger.player);
							await player.draw();
							return;
						}
						default: {
							game.log(player, "#y退赛了！");
							await event.trigger("withdrawPrettyDerby");
							return;
						}
					}
				},
				mod: {
					targetInRange(card, player) {
						if (player.getEquip("sm_mabian") && ["equip3", "equip4", "equip6"].some(slot => player.getEquip(slot))) {
							return true;
						}
					},
				},
				intro: {
					content(_storage) {
						const list = _status.prettyDerbyDoing;
						if (!list?.length) {
							return "未进行比赛";
						}
						return list.map((obj, index) => App({ obj, index })).join("<br />");

						function App(props) {
							const { obj, index } = props;
							const html = String.raw;
							return html`
								目标${index + 1}: ${obj.info}
								<br />
								<ul>
									<li><span style="font-family: yuanli">奖励：${obj.reward}</span></li>
								</ul>
							`;
						}
					},
				},
				rewardList: [
					{
						info: "受到伤害唯一最多",
						reward: "回复全部体力",
						filter(player) {
							return player.getRoundHistory("damage").reduce((sum, evt) => sum + evt.num, 0);
						},
						async content(player) {
							if (player.isDamaged()) {
								await player.recoverTo(player.maxHp);
							}
						},
					},
					{
						info: "手牌数唯一最多",
						reward: "手牌上限改为体力上限",
						filter(player) {
							return player.countCards("h");
						},
						async content(player) {
							player.addSkill("sm_kulian_yingzi");
						},
					},
					{
						info: "体力值唯一最高",
						reward: "增加1点体力上限",
						filter(player) {
							return player.getHp();
						},
						async content(player) {
							await player.gainMaxHp();
						},
					},
					{
						info: "装备区牌数唯一最多",
						reward: "获得一张其他角色的装备牌",
						filter(player) {
							return player.countCards("e");
						},
						async content(player) {
							const targets = game.filterPlayer(current => current != player && current.countGainableCards(player, "e"));
							if (!targets?.length) {
								return;
							}
							const result =
								targets.length > 1
									? await player
											.chooseTarget(
												"获得一名其他角色一张装备牌",
												(card, player, target) => {
													return player != target && target.countGainableCards(player, "e");
												},
												true
											)
											.set("ai", target => {
												const player = get.player();
												return get.effect(target, { name: "shunshou_copy2", position: "e" }, player, player);
											})
											.forResult()
									: {
											bool: true,
											targets: targets,
										};
							if (!result?.bool || !result.targets?.length) {
								return;
							}
							const target = result.targets[0];
							await player.gainPlayerCard(target, "e", true);
						},
					},
					{
						info: "击杀数唯一最多",
						reward: "执行一个仅有出牌阶段的额外回合",
						filter(player) {
							return game.getRoundHistory("everything", evt => evt.name == "die" && evt.source == player).length;
						},
						async content(player) {
							const next = player.insertPhase("sm_kulian");
							next.phaseList = ["phaseUse"];
							next._noTurnOver = true;
						},
					},
					{
						info: "使用牌数唯一最多",
						reward: "摸五张牌",
						filter(player) {
							return player.getRoundHistory("useCard").length;
						},
						async content(player) {
							await player.draw(5);
						},
					},
					{
						info: "造成伤害唯一最多",
						reward: "使用【杀】造成伤害+1",
						filter(player) {
							return player.getRoundHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0);
						},
						async content(player) {
							const skill = "sm_kulian_sha";
							player.addSkill(skill);
							player.addMark(skill, 1, false);
						},
					},
				],
				initList(skill) {
					if (!_status.prettyDerbyList || _status.prettyDerbyList.length < 2) {
						_status.prettyDerbyList = get.info(skill).rewardList.slice(0);
					}
					const list = _status.prettyDerbyList.randomRemove(2);
					game.broadcastAll(list => {
						_status.prettyDerbyList = list;
					}, _status.prettyDerbyList);
					return list;
				},
			},
			yingzi: {
				charlotte: true,
				mark: true,
				intro: {
					content: "你的手牌上限改为体力上限",
				},
				mod: {
					maxHandcardBase(player, num) {
						return player.maxHp;
					},
				},
			},
			sha: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "使用杀造成的伤害+#",
				},
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					return event.card?.name == "sha" && player.countMark("sm_kulian_sha");
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
			},
			damaged: {
				charlotte: true,
			},
			reward: {
				nobracket: true,
				nopop: true,
			},
		},
	},
	sm_lema: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type === "wuxie") {
				return false;
			}
			return get
				.inpileVCardList(info => get.type(info[2]) == "basic")
				.some(card => {
					return event.filterCard(get.autoViewAs({ name: card[2], nature: card[3], isCard: true }), player, event);
				});
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => get.type(info[2]) == "basic")
					.filter(card => {
						return event.filterCard(get.autoViewAs({ name: card[2], nature: card[3], isCard: true }), player, event);
					});
				return ui.create.dialog("乐马", [list, "vcard"], "hidden");
			},
			check(button) {
				const event = get.event().getParent();
				if (event.type !== "phase") {
					return 1;
				}
				return get.player().getUseValue(get.autoViewAs({ name: button.link[2], nature: button.link[3], isCard: true }));
			},
			prompt(links) {
				const num = Math.max(
					1,
					game.countPlayer(
						current =>
							current.getCards("e", card => {
								return get.subtypes(card).containsSome("equip3", "equip4", "equip6");
							}).length
					)
				);
				return `视为使用${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}并摸${get.cnNumber(num)}张牌`;
			},
			backup(links, player) {
				return {
					audio: "sm_lema",
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					popname: true,
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("sm_lema");
						const num = Math.max(
							1,
							game.countPlayer(
								current =>
									current.getCards("e", card => {
										return get.subtypes(card).containsSome("equip3", "equip4", "equip6");
									}).length
							)
						);
						await player.draw(num);
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (player.getStat("skill").sm_lema) {
				return false;
			}
			return get.type(name) == "basic";
		},
		ai: {
			order: 10,
			respondShan: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				return get.info("sm_lema").hiddenCard(player, tag.slice("respond".length).toLowerCase());
			},
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: {
			backup: {},
		},
	},
	sm_chaoxuan: {
		audio: 2,
		trigger: {
			global: "perttyDerbyEnd",
		},
		filter(event, player) {
			return event.rewards?.length;
		},
		forced: true,
		async content(event, trigger, player) {
			for (const reward of trigger.rewards) {
				game.log(player, "执行了赛马奖励：", `#g${reward.reward}`);
				await reward.content(player);
			}
		},
	},
	sm_wandou: {
		audio: 2,
		trigger: {
			global: "withdrawPrettyDerby",
		},
		filter(event, player) {
			return event.player.getHp() != 1;
		},
		check(event, player) {
			const bool1 = event.player.getHp() > 1,
				bool2 = get.attitude(player, event.player) > 0;
			return bool1 != bool2;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0],
				num = target.getHp() - 1;
			if (num > 0) {
				await target.loseHp(num);
			} else if (num < 0) {
				await target.recoverTo(1);
			}
		},
	},
	sm_mabian_skill: {
		equipSkill: true,
		onremove: true,
		charlotte: true,
	},
	//神贾诩
	jxlianpo: {
		init: () => {
			game.addGlobalSkill("jxlianpo_global");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("jxlianpo", null, null, false), true)) {
				game.removeGlobalSkill("jxlianpo_global");
			}
		},
		trigger: { global: "dieAfter" },
		filter(event, player) {
			if (lib.skill.jxlianpo.getMax(event.player).length <= 1) {
				return false;
			}
			return event.source && event.source.isIn();
		},
		forced: true,
		logTarget: "source",
		getMax: dead => {
			let curs = game.players.slice(0);
			if (get.itemtype(dead) === "player" && !curs.includes(dead)) {
				curs.push(dead);
			}
			const map = {
				zhu: curs.reduce((count, current) => {
					let num = 0;
					if (["zhu", "zhong", "mingzhong"].includes(current.identity)) {
						num++;
					}
					num += current.countMark("jxlianpo_mark_zhong");
					return num + count;
				}, 0),
				fan: curs.reduce((count, current) => {
					let num = 0;
					if (current.identity == "fan") {
						num++;
					}
					num += current.countMark("jxlianpo_mark_fan");
					return num + count;
				}, 0),
				nei: curs.reduce((count, current) => {
					let num = 0;
					if (current.identity == "nei") {
						num++;
					}
					num += current.countMark("jxlianpo_mark_nei");
					return num + count;
				}, 0),
				commoner: curs.reduce((count, current) => {
					let num = 0;
					if (current.identity == "commoner") {
						num++;
					}
					num += current.countMark("jxlianpo_mark_commoner");
					return num + count;
				}, 0),
			};
			let population = 0,
				identities = [];
			for (let i in map) {
				let curPopulation = map[i];
				if (curPopulation >= population) {
					if (curPopulation > population) {
						identities = [];
					}
					identities.add(i);
					population = curPopulation;
				}
			}
			return identities;
		},
		group: "jxlianpo_show",
		async content(event, trigger, player) {
			var source = trigger.source;
			source.chooseDrawRecover(2, true);
		},
		mark: true,
		intro: {
			content: () =>
				`场上最大阵营为${lib.skill.jxlianpo
					.getMax()
					.map(i => {
						if (i == "zhu") {
							return "主忠";
						}
						return get.translation(i + "2");
					})
					.join("、")}`,
		},
		$createButton(item, type, position, noclick, node) {
			node = ui.create.identityCard(item, position, noclick);
			node.link = item;
			return node;
		},
		subSkill: {
			show: {
				audio: "jxlianpo",
				trigger: { global: "roundStart" },
				filter(event, player) {
					var list = lib.config.mode_config.identity.identity.lastItem.slice();
					list.removeArray(
						game.filterPlayer().map(i => {
							let identity = i.identity;
							if (identity == "mingzhong") {
								identity = "zhong";
							}
							return identity;
						})
					);
					return list.length;
				},
				forced: true,
				async content(event, trigger, player) {
					const list = lib.config.mode_config.identity.identity.lastItem.slice();

					const needRemoved = game.filterPlayer().map(current => {
						var identity = current.identity;
						return identity == "mingzhong" ? "zhong" : identity;
					});
					list.removeArray(needRemoved).unique();

					const cards = [list, createCard];
					const title = '###炼魄：请选择一个身份###<div class="text center">你选择的身份对应的阵营角色数于本轮内视为+1</div>';
					const next = player.chooseButton([title, cards], true);

					const result = await next.forResult();
					const choice = result.links[0];
					const mark = `jxlianpo_mark_${choice}`;

					player
						.when({ global: "roundStart" }, false)
						.assign({
							firstDo: true,
						})
						.filter(evt => evt != trigger)
						.step(async (event, trigger, player) => {
							for (const storage in player.storage) {
								if (storage.startsWith("jxlianpo_mark_")) {
									player.clearMark(storage);
								}
							}
						});

					player.addMark(mark, 1, false);
					event.videoId = lib.status.videoId++;
					const createDialog = (player, identity, id) => {
						var dialog = ui.create.dialog(`${get.translation(player)}展示了“${get.translation(identity + "2")}”的身份牌<br>`, "forcebutton");
						dialog.videoId = id;
						ui.create.spinningIdentityCard(identity, dialog);
					};
					game.broadcastAll(createDialog, player, choice, event.videoId);
					let color = "";
					if (choice == "zhong") {
						color = "#y";
					} else if (choice == "fan") {
						color = "#g";
					} else if (choice == "nei") {
						color = "#b";
					}
					game.log(player, "展示了", `${color}${get.translation(choice + "2")}`, "的身份牌");
					await game.delay(3);
					game.broadcastAll("closeDialog", event.videoId);

					return;

					function createCard(item, type, position, noclick, node) {
						return lib.skill.jxlianpo.$createButton(item, type, position, noclick, node);
					}
				},
			},
			global: {
				mod: {
					maxHandcard(player, num) {
						if (!lib.skill.jxlianpo.getMax().includes("fan")) {
							return;
						}
						return (
							num -
							game.countPlayer(current => {
								return current != player && current.hasSkill("jxlianpo");
							})
						);
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							if (!lib.skill.jxlianpo.getMax().includes("fan")) {
								return;
							}
							return (
								num +
								game.countPlayer(current => {
									return current.hasSkill("jxlianpo");
								})
							);
						}
					},
					attackRange(player, num) {
						if (!lib.skill.jxlianpo.getMax().includes("fan")) {
							return;
						}
						return (
							num +
							game.countPlayer(current => {
								return current.hasSkill("jxlianpo");
							})
						);
					},
					cardSavable(card, player, target) {
						if (card.name == "tao" && !player.hasSkill("jxlianpo")) {
							if (!lib.skill.jxlianpo.getMax().includes("zhu")) {
								return;
							}
							if (player == target) {
								return;
							}
							return false;
						}
					},
					playerEnabled(card, player, target) {
						if (card.name == "tao" && !player.hasSkill("jxlianpo")) {
							if (!lib.skill.jxlianpo.getMax().includes("zhu")) {
								return;
							}
							if (player == target) {
								return;
							}
							return false;
						}
					},
				},
				trigger: { player: "dieAfter" },
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("jxlianpo", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content: () => {
					game.removeGlobalSkill("jxlianpo_global");
				},
			},
		},
	},
	jxzhaoluan: {
		trigger: { global: "dieBegin" },
		filter(event, player) {
			return event.getParent().name == "dying" && event.player.isIn();
		},
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		logTarget: "player",
		check(event, player) {
			if (event.source && event.source.isIn() && get.attitude(player, event.source) > 0 && player.identity == "fan") {
				return false;
			}
			return get.attitude(player, event.player) > 3.5;
		},
		async content(event, trigger, player) {
			var target = trigger.player;
			player.awakenSkill(event.name);
			trigger.cancel();
			const skills = target.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (info && !info.charlotte && !get.is.locked(skill)) {
					return true;
				}
			});
			if (skills.length) {
				await target.removeSkills(skills);
			}
			await target.gainMaxHp(3);
			var num = 3 - target.getHp(true);
			if (num > 0) {
				await target.recover(num);
			}
			target.draw(4);
			player.addSkill("jxzhaoluan_effect");
			player.markAuto("jxzhaoluan_effect", target);
		},
		ai: {
			expose: 0.5,
			threaten: 3,
		},
		subSkill: {
			effect: {
				audio: "jxzhaoluan",
				enable: "phaseUse",
				filter(event, player) {
					return player.getStorage("jxzhaoluan_effect").some(i => i.isIn());
				},
				filterTarget(card, player, target) {
					return !player.getStorage("jxzhaoluan_hit").includes(target);
				},
				line: false,
				locked: true,
				charlotte: true,
				promptfunc() {
					var bodies = _status.event.player.getStorage("jxzhaoluan_effect").filter(i => i.isIn());
					return `选择一名角色，你令${get.translation(bodies)}${bodies.length > 1 ? "中的一人" : ""}减1点体力上限，然后你对选择的角色造成1点伤害。`;
				},
				delay: false,
				async content(event, trigger, player) {
					const bodies = player.getStorage("jxzhaoluan_effect").filter(target => target.isIn());

					let result;
					if (bodies.length == 1) {
						result = { bool: true, targets: bodies };
					} else {
						result = await player
							.chooseTarget("兆乱：请选择被减上限的傀儡", true, (card, player, target) => {
								return get.event().targets.includes(target);
							})
							.set("targets", bodies)
							.set("ai", target => {
								return 8 - get.attitude(_status.event.player, target);
							})
							.forResult();
					}

					if (!result.bool) {
						return;
					}

					const target = result.targets[0];
					player.line(target);
					await target.loseMaxHp();
					await game.delayex();

					player.line(target);
					await event.targets[0].damage();
					if (!player.storage.jxzhaoluan_hit) {
						player.when("phaseUseAfter").step(async (event, trigger, player) => {
							delete player.storage.jxzhaoluan_hit;
						});
					}
					player.markAuto("jxzhaoluan_hit", event.targets);
				},
				ai: {
					order: 9,
					result: {
						player(player) {
							var bodies = player.getStorage("jxzhaoluan_effect").filter(i => i.isIn());
							var body;
							if (bodies.length == 1) {
								body = bodies[0];
							} else {
								body = bodies.sort((a, b) => get.attitude(player, a) - get.attitude(player, b))[0];
							}
							if (get.attitude(player, body) > 4 && !body.isDamaged() && body.getHp() <= 2) {
								return -10;
							}
							return 0;
						},
						target(player, target) {
							return Math.sign(get.damageEffect(target, player, target));
						},
					},
				},
			},
		},
	},
	//26珍藏神黄月英
	zc26_cangqiao: {
		trigger: {
			player: "useCard",
			global: "roundStart",
		},
		filter(event, player) {
			if (event.name == "useCard") {
				if (!["duanjian", "serafuku", "yonglv"].includes(event.card.name)) {
					return false;
				}
				return player.countCards("h") < player.maxHp;
			}
			return true;
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseBool(get.prompt(event.skill), () => true).forResult();
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				await player.drawTo(player.maxHp);
			} else {
				if (!_status.zc26_cangqiao) {
					game.broadcastAll(function () {
						_status.zc26_cangqiao = [
							{ name: "duanjian", number: 13, suit: "club" },
							{ name: "serafuku", number: 9, suit: "heart" },
							{ name: "yonglv", number: 13, suit: "club" },
						];
						for (let info of _status.zc26_cangqiao) {
							if (!lib.inpile.includes(info.name)) {
								lib.inpile.add(info.name);
							}
						}
					});
				}
				let list = ["duanjian", "serafuku", "yonglv"],
					cards = [];
				for (let name of list) {
					let card = get.discardPile(name);
					if (card) {
						cards.add(card);
					} else {
						let info = _status.zc26_cangqiao.find(i => i.name == name);
						if (info) {
							game.broadcastAll(function (info) {
								_status.zc26_cangqiao.remove(info);
							}, info);
							card = game.createCard2(name, info.suit, info.number);
							card.addCardtag("gifts");
							cards.add(card);
						}
					}
				}
				if (cards.length) {
					await player.gain(cards, "draw2");
				}
			}
		},
	},
	zc26_shenxie: {
		usable: 1,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (!event.targets.includes(player) || event.targets.length != 1) {
				return false;
			} else if (get.color(event.card) != "black") {
				return false;
			}
			const storage = player.getStorage(
				"zc26_shenxie",
				lib.inpile.filter(name => get.type(name) == "delay")
			);
			if (!storage.some(name => player.hasUseTarget(name))) {
				return false;
			}
			return game.hasPlayer(current => {
				return current.countCards("ej", { type: "equip" });
			});
		},
		async cost(event, trigger, player) {
			const storage = player
				.getStorage(
					event.skill,
					lib.inpile.filter(name => get.type(name) == "delay")
				)
				.filter(name => player.hasUseTarget(name));
			const choice = storage
				.map(name => [name, player.getUseValue(get.autoViewAs({ name, isCard: false }, "unsure"))])
				.reduce(
					(max, info) => {
						if (max[1] < info[1]) {
							return info;
						}
						return max;
					},
					[null, 0]
				)[0];
			const result = await player
				.chooseTarget(get.prompt2(event.skill), (_, player, target) => target.countCards("ej", { type: "equip" }))
				.set("ai", target => {
					const { player, choice } = get.event(),
						es = target.getCards("ej", { type: "equip" });
					if (!choice) {
						return 0;
					}
					if (get.attitude(player, target) > 0) {
						return 10 - Math.min(...es.map(card => get.equipValue(card)));
					}
					return Math.max(...es.map(card => get.equipValue(card)));
				})
				.set("choice", choice)
				.forResult();
			event.result = {
				bool: result?.bool,
				targets: result?.targets,
				cost_data: choice,
			};
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: choice,
			} = event;
			const result = await player
				.choosePlayerCard(target, `###神械###将${get.translation(target)}场上的一张牌当作延时锦囊牌使用`, "ej", true)
				.set("filterButton", ({ link }) => get.type(link) == "equip")
				.set("ai", ({ link }) => {
					const { player, target } = get.event();
					if (get.attitude(player, target) > 0) {
						return 10 - get.equipValue(link);
					}
					return get.equipValue(link);
				})
				.forResult();
			if (result?.bool && result.cards?.length) {
				const storage = player
					.getStorage(
						event.name,
						lib.inpile.filter(name => get.type(name) == "delay")
					)
					.filter(name => player.hasUseTarget(name));
				const { links } = await player
					.chooseVCardButton(true, "神械：请选择要使用的延时锦囊牌", storage.slice())
					.set("ai", ({ link: [_, __, name] }) => {
						const { player, choice } = get.event();
						if (choice) {
							return name == choice;
						}
						return player.getUseValue(name);
					})
					.set("choice", choice)
					.forResult();
				if (links?.length) {
					const name = links[0][2];
					storage.remove(name);
					if (!storage.length) {
						storage.addArray(lib.inpile.filter(name => get.type(name) == "delay"));
					}
					player.setStorage(event.name, storage, true);
					await player.chooseUseTarget({ name, storage: { equipEnable: true }, isCard: false }, result.cards, true);
				}
			}
		},
	},
	zc26_huaxiu: {
		usable: 1,
		enable: "phaseUse",
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			event.set(
				"zc26_huaxiu",
				["duanjian", "serafuku", "yonglv"].filter(i => i in lib.card)
			);
		},
		filter(event, player) {
			return event.zc26_huaxiu?.length;
		},
		manualConfirm: true,
		async content(event, trigger, player) {
			const list = event.getParent(2).zc26_huaxiu.map(name => [get.type(name), "", name]);
			const result = await player
				.chooseButton(true, ["化朽", "选择要升级的装备", [list, "vcard"]])
				.set("ai", button => {
					const player = get.player(),
						name = button.link[2];
					const num = game.countPlayer(current => {
						const hs = current.countVCards("h", card => name == card.name),
							es = current.countVCards("e", card => name == card.name),
							js = current.countVCards("j", card => get.type(card) == "delay" && card.storage.equipEnable && name == get.name(card, false));
						return get.sgnAttitude(player, current) * (es + js + current == player ? hs : 0);
					});
					return num;
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				const name = result.links[0][2],
					map = {
						duanjian: "zc26_zhuge",
						serafuku: "zc26_bagua",
						yonglv: "zc26_lingling",
					};
				game.log(player, "将", `#y${get.translation({ name })}`, "升级为", `#y${get.translation({ name: map[name] })}`);
				player.addTempSkill("zc26_huaxiu_restore", { player: "phaseBegin" });
				game.broadcastAll(
					function (name, player, map) {
						if (!_status.zc26_huaxiu_origin) {
							_status.zc26_huaxiu_origin = {};
							for (let name of ["duanjian", "serafuku", "yonglv"]) {
								_status.zc26_huaxiu_origin[name] = {
									info: lib.card[name],
									translate: lib.translate[name],
									translate2: lib.translate[`${name}_info`],
								};
							}
						}
						lib.card[name] = lib.card[map[name]];
						lib.translate[name] = lib.translate[map[name]];
						lib.translate[`${name}_info`] = lib.translate[`${map[name]}_info`];
						_status.zc26_huaxiu ??= {};
						_status.zc26_huaxiu[name] ??= [];
						_status.zc26_huaxiu[name].add(player);
						lib.init.sheet(`
							.card[data-card-name = "${name}"]>.image {
								background-image: url(${lib.assetURL}image/card/${map[name]}.png) !important;
							}
						`);
					},
					name,
					player,
					map
				);
				function check(name, target, method) {
					if (method == "e") {
						return target.hasVCard({ name }, "e");
					} else if (method == "j") {
						return target.hasVCard(card => {
							if (!card.storage?.equipEnable) {
								return false;
							}
							return card.cards.some(cardx => cardx.name == name);
						}, "j");
					}
					return false;
				}
				const removeSkill = get.skillsFromEquips([{ name }]),
					addSkill = get.skillsFromEquips([{ name: map[name] }]);
				for (let current of game.players) {
					let keepSkills = Object.values(current.additionalSkills).flat(),
						removeSkill2 = removeSkill.slice().removeArray(keepSkills);
					if (removeSkill2.length) {
						current.removeSkill(removeSkill2);
					}
					if (check(name, current, "j")) {
						current.addSkill(addSkill);
					}
					if (check(name, current, "e")) {
						current.addEquipTrigger({ name: map[name] });
					}
					let vcards = current.getVCards("e", { name });
					while (vcards.length) {
						let vcard = vcards.shift();
						current.$addVirtualEquip(vcard, vcard.cards);
					}
				}
			}
		},
		subSkill: {
			restore: {
				charlotte: true,
				onremove(player, skill) {
					get.info(skill).contentx.apply(this, [null, null, player]);
				},
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					for (let name of ["duanjian", "serafuku", "yonglv"]) {
						if (_status.zc26_huaxiu?.[name]?.includes(player)) {
							return true;
						}
					}
					return false;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					get.info(event.name).contentx.apply(this, arguments);
				},
				contentx(event, trigger, player) {
					game.broadcastAll(function (player) {
						for (let name of ["duanjian", "serafuku", "yonglv"]) {
							if (_status.zc26_huaxiu?.[name]?.includes(player)) {
								_status.zc26_huaxiu[name].remove(player);
								lib.init.sheet(`
									.card[data-card-name = "${name}"]>.image {
										background-image: url(${lib.assetURL}image/card/${name}.png) !important;
									}
								`);
							}
						}
					}, player);
					function check(name, target, method) {
						if (method == "e") {
							return target.hasVCard({ name }, "e");
						} else if (method == "j") {
							return target.hasVCard(card => {
								if (!card.storage?.equipEnable) {
									return false;
								}
								return card.cards.some(cardx => cardx.name == name);
							}, "j");
						}
						return false;
					}
					const map = {
						duanjian: "zc26_zhuge",
						serafuku: "zc26_bagua",
						yonglv: "zc26_lingling",
					};
					for (let name of ["duanjian", "serafuku", "yonglv"]) {
						if (name in _status.zc26_huaxiu && !_status.zc26_huaxiu[name].length) {
							game.log(`#y${get.translation({ name })}`, "的效果还原了");
							game.broadcastAll(function (name) {
								delete _status.zc26_huaxiu[name];
							}, name);
							lib.card[name] = _status.zc26_huaxiu_origin[name].info;
							lib.translate[name] = _status.zc26_huaxiu_origin[name].translate;
							lib.translate[`${name}_info`] = _status.zc26_huaxiu_origin[name].translate2;
							const addSkill = get.skillsFromEquips([{ name }]),
								removeSkill = get.skillsFromEquips([{ name: map[name] }]);
							for (let current of game.players) {
								let keepSkills = Object.values(current.additionalSkills).flat(),
									removeSkill2 = removeSkill.slice().removeArray(keepSkills);
								if (removeSkill2.length) {
									current.removeSkill(removeSkill2);
								}
								if (check(name, current, "j")) {
									current.addSkill(addSkill);
								} else if (check(name, current, "e")) {
									current.addEquipTrigger({ name });
								}
								let vcards = current.getVCards("e", { name });
								while (vcards.length) {
									let vcard = vcards.shift();
									current.$addVirtualEquip(vcard, vcard.cards);
								}
							}
						}
					}
				},
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	zc26_zhuge_skill: {
		equipSkill: true,
		firstDo: true,
		locked: true,
		audio: "zhuge_skill",
		mod: {
			cardUsable(card, player, num) {
				let cards = player.getCards("e", card => get.name(card) == "zc26_zhuge");
				if (card.name === "sha") {
					if (!cards.length || player.hasSkill("zc26_zhuge_skill", null, false) || cards.some(card => card !== _status.zc26_zhuge_temp && !ui.selected.cards.includes(card))) {
						if (get.is.versus() || get.is.changban()) {
							return num + 3;
						}
						return Infinity;
					}
				}
			},
			cardEnabled2(card, player) {
				if (!_status.event.addCount_extra || player.hasSkill("zc26_zhuge_skill", null, false)) {
					return;
				}
				let cards = player.getCards("e", card => get.name(card) == "zc26_zhuge");
				if (card && cards.includes(card)) {
					let cardz;
					try {
						cardz = get.card();
					} catch (e) {
						return;
					}
					if (!cardz || cardz.name !== "sha") {
						return;
					}
					_status.zc26_zhuge_temp = card;
					let bool = lib.filter.cardUsable(get.autoViewAs(cardz, ui.selected.cards.concat([card])), player);
					delete _status.zc26_zhuge_temp;
					if (!bool) {
						return false;
					}
				}
			},
		},
		trigger: { player: ["useCard1", "useCardToPlayered"] },
		filter(event, player, triggername) {
			if (event.card.name != "sha") {
				return false;
			}
			if (event.name == "useCard") {
				return !event.audioed && player.countUsed("sha", true) > 1 && event.getParent().type === "phase";
			}
			return game.dead.length && event.target.countCards("h");
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = { bool: true };
			} else {
				event.result = await player
					.chooseTarget(`###${get.prompt(event.skill)}###令任意名死亡角色依次观看${get.translation(trigger.target)}手牌并可以重铸其中一张牌`, [1, game.dead.length])
					.set("filterTarget", (_, player, target) => target.isDead())
					.set("ai", target => get.attitude(get.player(), target) > 0)
					.set("deadTarget", true)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				trigger.audioed = true;
			} else {
				event.targets.sortBySeat(_status.currentPhase);
				for (const current of event.targets) {
					if (!current.isDead()) {
						continue;
					}
					await current.viewHandcards(trigger.target);
					const cards = trigger.target.getCards("h", card => lib.filter.cardRecastable(card, trigger.target, trigger.target));
					if (!cards.length) {
						return;
					}
					const result = await current
						.chooseCardButton(`请选择重铸${get.translation(trigger.target)}的一张手牌`, cards)
						.set("ai", ({ link }) => {
							const { player, target } = get.event();
							if (get.attitude(player, target) > 0) {
								return 20 - get.value(link);
							}
							return get.value(link);
						})
						.set("target", trigger.target)
						.set("forceDie", true)
						.forResult();
					if (result?.bool && result.links?.length) {
						await trigger.target.recast(result.links);
					}
				}
			}
		},
	},
	zc26_bagua_skill: {
		equipSkill: true,
		audio: "bagua_skill",
		trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
		filter(event, player) {
			if (event.responded) {
				return false;
			}
			if (event.zc26_bagua_skill) {
				return false;
			}
			if (!event.filterCard || !event.filterCard(get.autoViewAs({ name: "shan" }, []), player, event)) {
				return false;
			}
			if (event.name === "chooseToRespond" && !lib.filter.cardRespondable(get.autoViewAs({ name: "shan" }, []), player, event)) {
				return false;
			}
			if (player.hasSkillTag("unequip2")) {
				return false;
			}
			let evt = event.getParent();
			if (
				evt.player &&
				evt.player.hasSkillTag("unequip", false, {
					name: evt.card ? evt.card.name : null,
					target: player,
					card: evt.card,
				})
			) {
				return false;
			}
			return true;
		},
		check(event, player) {
			if (!event) {
				return true;
			}
			if (event.ai) {
				let ai = event.ai;
				let tmp = _status.event;
				_status.event = event;
				let result = ai({ name: "shan" }, _status.event.player, event);
				_status.event = tmp;
				return result > 0;
			}
			const type = event.name === "chooseToRespond" ? "respond" : "use";
			let evt = event.getParent();
			if (player.hasSkillTag("noShan", null, type)) {
				return false;
			}
			if (!evt || !evt.card || !evt.player || player.hasSkillTag("useShan", null, type)) {
				return true;
			}
			if (evt.card && evt.player && player.isLinked() && game.hasNature(evt.card) && get.attitude(player, evt.player._trueMe || evt.player) > 0) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			trigger.zc26_bagua_skill = true;
			if (game.dead.length) {
				const { targets } = await player
					.chooseTarget(`###${get.prompt(event.name)}###令一名死亡角色卜算3`)
					.set("filterTarget", (_, player, target) => target.isDead())
					.set("ai", target => get.attitude(get.player(), target) > 0)
					.set("deadTarget", true)
					.forResult();
				if (targets?.length) {
					player.line(targets[0]);
					game.log(player, "令", targets[0], "卜算3");
					await targets[0].chooseToGuanxing(3).set("forceDie", true);
				}
			}
			const result = await player
				.judge("zc26_bagua", card => (get.color(card) === "red" ? 1.5 : -0.5))
				.set("judge2", result => result.bool)
				.forResult();
			if (result.bool > 0) {
				trigger.untrigger();
				trigger.set("responded", true);
				trigger.result = { bool: true, card: get.autoViewAs({ name: "shan", isCard: true }, []), cards: [] };
			}
		},
		ai: {
			respondShan: true,
			freeShan: true,
			skillTagFilter(player, tag, arg) {
				if (tag !== "respondShan" && tag !== "freeShan") {
					return;
				}
				if (player.hasSkillTag("unequip2")) {
					return false;
				}
				if (!arg || !arg.player) {
					return true;
				}
				if (
					arg.player.hasSkillTag("unequip", false, {
						target: player,
					})
				) {
					return false;
				}
				return true;
			},
			effect: {
				target(card, player, target, effect) {
					if (target.hasSkillTag("unequip2")) {
						return;
					}
					if (
						player.hasSkillTag("unequip", false, {
							name: card ? card.name : null,
							target: target,
							card: card,
						}) ||
						player.hasSkillTag("unequip_ai", false, {
							name: card ? card.name : null,
							target: target,
							card: card,
						})
					) {
						return;
					}
					if (get.tag(card, "respondShan")) {
						return 0.5;
					}
				},
			},
		},
	},
	zc26_lingling_skill: {
		equipSkill: true,
		trigger: {
			player: "phaseZhunbeiBegin",
			global: "roundEnd",
		},
		getIndex(event, player) {
			if (event.name == "phaseZhunbei") {
				return 1;
			}
			const es = player.getCards("e", card => get.info(card)?.name == "zc26_lingling"),
				js = player.getCards("j", card => {
					if (get.type(card) != "delay") {
						false;
					}
					const vcard = card[card.cardSymbol];
					if (!vcard || !vcard.storage?.equipEnable) {
						return false;
					}
					return vcard.cards.some(cardx => get.info(cardx)?.name == "zc26_lingling");
				});
			return es.concat(js);
		},
		filter(event, player, triggername, card) {
			if (event.name == "phaseZhunbei") {
				return true;
			}
			if (!game.dead.length) {
				return false;
			}
			return !event.next[event.next.length - 1]?.zc26_lingling?.includes(card);
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				const { targets } = await player
					.chooseTarget(`軨軨：选择一名角色对其造成1点雷电伤害`, true)
					.set("ai", target => get.damageEffect(target, get.player(), get.player(), "thunder"))
					.forResult();
				if (targets?.length) {
					await targets[0].damage(player, "thunder");
				}
			} else {
				trigger.next[trigger.next.length - 1].zc26_lingling ??= [];
				trigger.next[trigger.next.length - 1].zc26_lingling.add(event.indexedData);
				const targets = game.dead.slice();
				const map = await game.chooseAnyOL(targets, get.info(event.name).chooseControl, [player, event.indexedData]).forResult();
				for (const target of targets) {
					let source = game.findPlayer(current => current.hasCard(card => card == event.indexedData, "ej")),
						aim;
					const control = map.get(target).control;
					if (control == "上家") {
						aim = source?.previous;
					} else if (control == "下家") {
						aim = source?.next;
					}
					if (!source || !aim) {
						return;
					}
					await target
						.moveCard(true, source, aim, card => {
							const cardx = get.event().card;
							if (get.itemtype(card) == "card") {
								return card == cardx;
							}
							return card == cardx[cardx.cardSymbol];
						})
						.set("card", event.indexedData)
						.set("forceDie", true)
						.setContent(async function (event, trigger, player) {
							if (player.canMoveCard(null, event.nojudge, event.sourceTargets, event.aimTargets, event.filter, event.canReplace ? "canReplace" : "noReplace")) {
								const source = event.sourceTargets[0],
									aim = event.aimTargets[0];
								let position = "j";
								event.result = {
									bool: true,
									links: [event.card],
									card: event.card,
								};
								if (source.getCards("e").includes(event.card)) {
									position = "e";
									/*if (!event.card.cards?.length) {
										source.removeVirtualEquip(event.card);
									}*/
									await aim.equip(event.card);
								} else {
									/*if (!event.card.cards?.length) {
										source.removeVirtualJudge(event.card);
									}*/
									await aim.addJudge(event.card, event.card?.cards);
								}
								if (event.card.cards?.length) {
									source.$give(event.card.cards, aim, false);
								}
								game.log(source, "的", event.card, "被移动给了", aim);
								event.result.position = position;
								await game.delay();
							}
						});
				}
			}
		},
		chooseControl(player, source, card, eventId) {
			return player
				.chooseControl(["上家", "下家"])
				.set("prompt", "軨軨：秘密选择一个方向")
				.set("prompt2", `令${get.translation(source)}的${get.translation(card)}移动至其上家或下家`)
				.set("ai", () => {
					//哪管死后洪水滔天
					let controls = get.event().controls.slice();
					return get.event().getRand() < 0.5 ? controls[0] : controls[1];
				})
				.set("id", eventId)
				.set("_global_waiting", true);
		},
	},
	//神貂蝉&高达一号
	xinlonghun: {
		audio: "longhun",
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || player.needsToDiscard() < 2) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num - 3.6;
				}
			},
			aiValue(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3.6;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1.8;
				}
			},
			aiUseful(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1;
				}
			},
		},
		locked: false,
		enable: ["chooseToUse", "chooseToRespond"],
		prompt: "将♦手牌当做火【杀】，♥手牌当做【桃】，♣手牌当做【闪】，♠手牌当做【无懈可击】使用或打出",
		viewAs(cards, player) {
			if (cards.length) {
				var name = false,
					nature = null;
				switch (get.suit(cards[0], player)) {
					case "club":
						name = "shan";
						break;
					case "diamond":
						name = "sha";
						nature = "fire";
						break;
					case "spade":
						name = "wuxie";
						break;
					case "heart":
						name = "tao";
						break;
				}
				if (name) {
					return { name: name, nature: nature };
				}
			}
			return null;
		},
		check(card) {
			var player = _status.event.player;
			if (_status.event.type == "phase") {
				var max = 0;
				var name2;
				var list = ["sha", "tao"];
				var map = { sha: "diamond", tao: "heart" };
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (
						player.countCards("hs", function (card) {
							return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
						}) > 0 &&
						player.getUseValue({ name: name, nature: name == "sha" ? "fire" : null }) > 0
					) {
						var temp = get.order({ name: name, nature: name == "sha" ? "fire" : null });
						if (temp > max) {
							max = temp;
							name2 = map[name];
						}
					}
				}
				if (name2 == get.suit(card, player)) {
					return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
				}
				return 0;
			}
			return 1;
		},
		position: "hs",
		filterCard(card, player, event) {
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.suit(card, player);
			if (name == "club" && filter({ name: "shan", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "diamond" && filter({ name: "sha", cards: [card], nature: "fire" }, player, event)) {
				return true;
			}
			if (name == "spade" && filter({ name: "wuxie", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "heart" && filter({ name: "tao", cards: [card] }, player, event)) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			var filter = event.filterCard;
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hs", { suit: "diamond" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hs", { suit: "club" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hs", { suit: "heart" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hs", { suit: "spade" })) {
				return true;
			}
			return false;
		},
		logAudio(event, player) {
			return "longhun" + (4 - lib.suit.indexOf(get.suit(event.cards[0], player))) + ".mp3";
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var name;
				switch (tag) {
					case "respondSha":
						name = "diamond";
						break;
					case "respondShan":
						name = "club";
						break;
					case "save":
						name = "heart";
						break;
				}
				if (!player.countCards("hs", { suit: name })) {
					return false;
				}
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao"];
					var map = { sha: "diamond", tao: "heart" };
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (
							player.countCards("hs", function (card) {
								return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
							}) > 0 &&
							player.getUseValue({
								name: name,
								nature: name == "sha" ? "fire" : null,
							}) > 0
						) {
							var temp = get.order({
								name: name,
								nature: name == "sha" ? "fire" : null,
							});
							if (temp > max) {
								max = temp;
							}
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard(player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hs") > 0) {
				return true;
			}
			if (name == "wuxie") {
				return player.countCards("hs", { suit: "spade" }) > 0;
			}
			if (name == "tao") {
				return player.countCards("hs", { suit: "heart" }) > 0;
			}
		},
	},
	zhanjiang: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i] != player && players[i].getEquips("qinggang").length > 0) {
					return true;
				}
			}
		},
		async content(event, trigger, player) {
			const players = game.filterPlayer();
			for (const current of players) {
				if (current === player) {
					continue;
				}

				const equips = current.getEquips("qinggang");
				if (equips.length > 0) {
					player.line(current, "green");
					await player.gain(equips, current, "give", "bySelf");
				}
			}
		},
	},
	boss_juejing: {
		audio: "juejing",
		audioname2: {
			dc_zhaoyun: "dcjuejing",
		},
		trigger: { player: "phaseDrawBefore" },
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
		},
		ai: {
			noh: true,
			nogain: true,
		},
		group: "boss_juejing2",
	},
	boss_juejing2: {
		audio: "juejing",
		sourceSkill: "boss_juejing",
		audioname2: {
			dc_zhaoyun: "dcjuejing",
		},
		mod: {
			aiOrder(player, card, num) {
				if (num > 0) {
					return num;
				}
				if (card.name === "zhuge" && player.getCardUsable("sha", true) < 6) {
					return 1;
				}
			},
			aiValue(player, card, num) {
				if (card.name === "zhuge") {
					return 60 / (1 + player.getCardUsable("sha", true));
				}
			},
			aiUseful(player, card, num) {
				if (card.name === "zhuge") {
					return 60 / (1 + player.getCardUsable("sha", true));
				}
			},
		},
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			if (event.name == "gain" && event.player == player) {
				return player.countCards("h") > 4;
			}
			var evt = event.getl(player);
			if (!evt || !evt.hs || evt.hs.length == 0 || player.countCards("h") >= 4) {
				return false;
			}
			var evt = event;
			for (var i = 0; i < 4; i++) {
				evt = evt.getParent("boss_juejing2");
				if (evt.name != "boss_juejing2") {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const num = 4 - player.countCards("h");
			if (num > 0) {
				await player.draw(num);
			} else {
				await player.chooseToDiscard("h", true, -num, "allowChooseAll");
			}
		},
		ai: {
			freeSha: true,
			freeShan: true,
			skillTagFilter() {
				return true;
			},
		},
	},
	dcjuejing: { audio: 2 },
	meihun: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
			target: "useCardToTargeted",
		},
		direct: true,
		filter(event, player) {
			if (event.name != "phaseJieshu" && event.card.name != "sha") {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h");
			});
		},
		async content(event, trigger, player) {
			let result = await player
				.chooseTarget(get.prompt2("meihun"), function (card, player, target) {
					return target != player && target.countCards("h") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					return 0.1 - att / target.countCards("h");
				})
				.forResult();
			if (!result.bool) {
				return;
			}

			let target = result.targets[0];
			player.logSkill("meihun", target);
			event.target = target;
			result = await player
				.chooseControl(lib.suit)
				.set("prompt", "请选择一种花色")
				.set("ai", function () {
					return lib.suit.randomGet();
				})
				.forResult();

			let suit = result.control;
			player.chat(get.translation(suit + 2));
			game.log(player, "选择了", "#y" + get.translation(suit + 2));
			if (target.countCards("h", { suit })) {
				result = await target
					.chooseCard("h", "交给" + get.translation(player) + "一张" + get.translation(suit) + "花色的手牌", true, function (card, player) {
						return get.suit(card, player) == _status.event.suit;
					})
					.set("suit", suit)
					.forResult();
			} else {
				await player.discardPlayerCard(target, true, "h", "visible");
				return;
			}
			if (result.bool && result.cards && result.cards.length) {
				await target.give(result.cards, player, "give");
			}
		},
	},
	//Connect Mode support after Angel Beats! -2nd beat-
	huoxin: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (game.countPlayer() < 3) {
				return false;
			}
			for (var i of lib.suit) {
				if (player.countCards("h", { suit: i }) > 1) {
					return true;
				}
			}
			return false;
		},
		complexCard: true,
		position: "h",
		filterCard(card, player) {
			if (!ui.selected.cards.length) {
				var suit = get.suit(card);
				return (
					player.countCards("h", function (card2) {
						return card != card2 && get.suit(card2, player) == suit;
					}) > 0
				);
			}
			return get.suit(card, player) == get.suit(ui.selected.cards[0], player);
		},
		selectCard: 2,
		selectTarget: 2,
		filterTarget: lib.filter.notMe,
		multitarget: true,
		multiline: true,
		delay: false,
		discard: false,
		lose: false,
		check(card) {
			return 6 - get.value(card);
		},
		targetprompt: ["拼点发起人", "拼点目标"],
		async content(event, trigger, player) {
			const { targets, cards } = event;
			const list = [];
			for (let i = 0; i < targets.length; i++) {
				list.push([targets[i], cards[i]]);
			}
			await game
				.loseAsync({
					gain_list: list,
					player: player,
					cards: cards,
					giver: player,
					animate: "giveAuto",
				})
				.setContent("gaincardMultiple");
			await game.delayx();

			if (!targets[0].canCompare(targets[1])) {
				return;
			}

			const result = await targets[0].chooseToCompare(targets[1]).forResult();
			if (result.winner !== targets[0]) {
				targets[0].addMark("huoxin", 1);
			}
			if (result.winner !== targets[1]) {
				targets[1].addMark("huoxin", 1);
			}
		},
		marktext: "魅",
		intro: {
			name: "魅惑",
			name2: "魅惑",
			content: "mark",
		},
		group: "huoxin_control",
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.hasMark("huoxin")) {
						return -2;
					}
					return -1;
				},
			},
		},
	},
	huoxin_control: {
		audio: "huoxin",
		forced: true,
		trigger: { global: "phaseBeginStart" },
		sourceSkill: "huoxin",
		filter(event, player) {
			return player != event.player && !event.player._trueMe && event.player.countMark("huoxin") > 1;
		},
		logTarget: "player",
		skillAnimation: true,
		animationColor: "key",
		async content(event, trigger, player) {
			trigger.player.removeMark("huoxin", trigger.player.countMark("huoxin"));
			trigger.player._trueMe = player;
			game.addGlobalSkill("autoswap");
			if (trigger.player == game.me) {
				game.notMe = true;
				if (!_status.auto) {
					ui.click.auto();
				}
			}
			trigger.player.addSkill("huoxin2");
		},
	},
	huoxin2: {
		trigger: {
			player: ["phaseAfter", "dieAfter"],
			global: "phaseBeforeStart",
		},
		lastDo: true,
		charlotte: true,
		forceDie: true,
		forced: true,
		silent: true,
		sourceSkill: "huoxin",
		async content(event, trigger, player) {
			player.removeSkill("huoxin2");
		},
		onremove(player) {
			if (player == game.me) {
				if (!game.notMe) {
					game.swapPlayerAuto(player._trueMe);
				} else {
					delete game.notMe;
				}
				if (_status.auto) {
					ui.click.auto();
				}
			}
			delete player._trueMe;
		},
	},
	//官盗S特015神马超
	psshouli: {
		audio: "shouli",
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player != _status.currentPhase && (name == "sha" || name == "shan")) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || event.psshouli || event.type == "wuxie") {
				return false;
			}
			if (
				game.hasPlayer(function (current) {
					return current.getEquips(4).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "sha",
							storage: { psshouli: true },
						},
						"unsure"
					),
					player,
					event
				)
			) {
				return true;
			}
			if (
				game.hasPlayer(function (current) {
					return current.getEquips(3).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "shan",
							storage: { psshouli: true },
						},
						"unsure"
					),
					player,
					event
				)
			) {
				return true;
			}
			return false;
		},
		delay: false,
		locked: true,
		filterTarget(card, player, target) {
			var event = _status.event,
				evt = event;
			if (event._backup) {
				evt = event._backup;
			}
			var equip3 = target.getCards("e", card => get.is.defendingMount(card, false));
			var equip4 = target.getCards("e", card => get.is.attackingMount(card, false));
			if (
				equip3.length &&
				equip3.some(card =>
					evt.filterCard(
						get.autoViewAs(
							{
								name: "shan",
								storage: { psshouli: true },
							},
							[card]
						),
						player,
						event
					)
				)
			) {
				return true;
			}
			return equip4.some(card => {
				var sha = get.autoViewAs(
					{
						name: "sha",
						storage: { psshouli: true },
					},
					[card]
				);
				if (evt.filterCard(sha, player, event)) {
					if (!evt.filterTarget) {
						return true;
					}
					return game.hasPlayer(function (current) {
						return evt.filterTarget(sha, player, current);
					});
				}
			});
		},
		prompt: "将场上的一张坐骑牌当做【杀】或【闪】使用或打出",
		content() {
			"step 0";
			var evt = event.getParent(2);
			evt.set("psshouli", true);
			var list = [];
			var equip3 = target.getCards("e", card => get.is.defendingMount(card, false));
			var equip4 = target.getCards("e", card => get.is.attackingMount(card, false));
			var backupx = _status.event;
			_status.event = evt;
			try {
				if (
					equip3.length &&
					equip3.some(card => {
						var shan = get.autoViewAs(
							{
								name: "shan",
								storage: { psshouli: true },
							},
							[card]
						);
						if (evt.filterCard(shan, player, event)) {
							return true;
						}
						return false;
					})
				) {
					list.push("shan");
				}
				if (
					equip4.length &&
					equip4.some(card => {
						var sha = get.autoViewAs(
							{
								name: "sha",
								storage: { psshouli: true },
							},
							[card]
						);
						if (
							evt.filterCard(sha, player, evt) &&
							(!evt.filterTarget ||
								game.hasPlayer(function (current) {
									return evt.filterTarget(sha, player, current);
								}))
						) {
							return true;
						}
						return false;
					})
				) {
					list.push("sha");
				}
			} catch (e) {
				game.print(e);
			}
			_status.event = backupx;
			if (list.length == 1) {
				event.cardName = list[0];
				var cards = list[0] == "shan" ? equip3 : equip4;
				if (cards.length == 1) {
					event._result = {
						bool: true,
						links: [cards[0]],
					};
				} else {
					player
						.choosePlayerCard(true, target, "e")
						.set("filterButton", function (button) {
							return _status.event.cards.includes(button.link);
						})
						.set("cards", cards);
				}
			} else {
				player.choosePlayerCard(true, target, "e").set("filterButton", function (button) {
					var card = button.link;
					return get.is.attackingMount(card) || get.is.defendingMount(card);
				});
			}
			"step 1";
			var evt = event.getParent(2);
			if (result.bool && result.links && result.links.length) {
				var name = event.cardName || (get.is.attackingMount(result.links[0]) ? "sha" : "shan");
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						function (result, name) {
							lib.skill.psshouli_backup.viewAs = {
								name: name,
								cards: [result],
								storage: { psshouli: true },
							};
							lib.skill.psshouli_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
						},
						result.links[0],
						name
					);
					evt.set("_backupevent", "psshouli_backup");
					evt.backup("psshouli_backup");
					evt.set("openskilldialog", "选择" + get.translation(name) + "（" + get.translation(result.links[0]) + "）的目标");
					evt.set("norestore", true);
					evt.set("custom", {
						add: {},
						replace: { window() {} },
					});
				} else {
					delete evt.result.used;
					delete evt.result.skill;
					evt.result.card = get.autoViewAs(
						{
							name: name,
							cards: [result.links[0]],
							storage: { psshouli: true },
						},
						result.links
					);
					evt.result.cards = [result.links[0]];
					target.$give(result.links[0], player, false);
					if (player != target) {
						target.addTempSkill("fengyin");
					}
					target.addTempSkill("psshouli_thunder");
					player.addTempSkill("psshouli_thunder");
					evt.redo();
					return;
				}
			}
			evt.goto(0);
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var func = get.is[tag == "respondSha" ? "attackingMount" : "defendingMount"];
				return game.hasPlayer(function (current) {
					return current.hasCard(card => func(card, false), "e");
				});
			},
			order: 2,
			result: {
				player(player, target) {
					var att = Math.max(8, get.attitude(player, target));
					if (_status.event.type != "phase") {
						return 9 - att;
					}
					if (!player.hasValueTarget({ name: "sha" })) {
						return 0;
					}
					return 9 - att;
				},
			},
		},
		group: "psshouli_init",
		subSkill: {
			thunder: {
				charlotte: true,
				trigger: { player: "damageBegin1" },
				forced: true,
				mark: true,
				content() {
					trigger.num++;
					game.setNature(trigger, "thunder");
				},
				marktext: "⚡",
				intro: { content: "受到的伤害+1且改为雷属性" },
				ai: {
					effect: {
						target: (card, player, target) => {
							if (!get.tag(card, "damage")) {
								return;
							}
							if (
								target.hasSkillTag("nodamage", null, {
									natures: ["thunder"],
								}) ||
								target.hasSkillTag("nothunder")
							) {
								return "zeroplayertarget";
							}
							if (
								target.hasSkillTag("filterDamage", null, {
									player: player,
									card: new lib.element.VCard(
										{
											name: card.name,
											nature: "thunder",
										},
										[card]
									),
								})
							) {
								return;
							}
							return 2;
						},
					},
				},
			},
			init: {
				audio: "psshouli",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				logTarget: () => game.filterPlayer(),
				equips: [
					["heart", 5, "chitu"],
					["diamond", 13, "zixin"],
					["spade", 5, "jueying"],
					["diamond", 13, "hualiu"],
					["club", 5, "dilu"],
					["spade", 13, "dawan"],
					["heart", 13, "zhuahuang"],
					["heart", 3, "jingfanma"],
				],
				content() {
					"step 0";
					event.targets = game.filterPlayer().sortBySeat(_status.firstAct2 || game.zhong || game.zhu || _status.firstAct || player);
					event.target = event.targets.shift();
					game.delayx();
					"step 1";
					player.line(target, "green");
					target
						.chooseToUse("狩骊：使用一张坐骑牌并摸一张牌，或使用一张坐骑牌指示物", function (card, player, event) {
							if (get.subtype(card) != "equip3" && get.subtype(card) != "equip4" && get.subtype(card) != "equip6") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						})
						.set("ai", () => 1);
					"step 2";
					if (result.bool) {
						target.draw();
					} else {
						var cardx = lib.skill.psshouli_init.equips.randomRemove();
						if (!cardx) {
							return;
						}
						cardx = {
							suit: cardx[0],
							number: cardx[1],
							name: cardx[2],
						};
						var card = game.createCard(cardx);
						if (!_status.psshouli_equips) {
							_status.psshouli_equips = [];
						}
						_status.psshouli_equips.push(card.cardid);
						if (card) {
							target.chooseUseTarget(card, true, "nopopup", "noanimate");
							player.addSkill("psshouli_remove");
						}
					}
					"step 3";
					event.target = event.targets.shift();
					if (event.target) {
						event.goto(1);
					}
				},
			},
			remove: {
				trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"] },
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				forceDie: true,
				filter(event, player) {
					if (!_status.psshouli_equips || !_status.psshouli_equips.length) {
						return false;
					}
					var cards = event.getd();
					return cards.filter(i => _status.psshouli_equips.includes(i.cardid)).length;
				},
				content() {
					var cards = trigger.getd(),
						remove = [];
					for (var card of cards) {
						if (_status.psshouli_equips.includes(card.cardid)) {
							_status.psshouli_equips.remove(card.cardid);
							remove.push(card);
						}
					}
					if (remove.length) {
						game.cardsGotoSpecial(remove);
						lib.skill.psshouli_init.equips.addArray(remove.map(i => [i.suit, i.number, i.name]));
						game.log("坐骑指示物", remove, "被移出了游戏");
					}
				},
			},
			backup: {
				precontent() {
					"step 0";
					event.result._apply_args = { throw: false, addSkillCount: false };
					var cards = event.result.card.cards;
					event.result.cards = cards;
					var owner = get.owner(cards[0]);
					event.target = owner;
					owner.$throw(cards[0]);
					player.popup(event.result.card.name, "metal");
					game.delayx();
					event.getParent().addCount = false;
					"step 1";
					if (player != target) {
						target.addTempSkill("fengyin");
					}
					target.addTempSkill("psshouli_thunder");
					player.addTempSkill("psshouli_thunder");
				},
				filterCard: () => false,
				prompt: "请选择【杀】的目标",
				selectCard: -1,
				log: false,
			},
		},
	},
	pshengwu: {
		audio: "hengwu",
		mod: {
			aiOrder: (player, card, num) => {
				if (num > 0 && get.tag(card, "draw") && ui.cardPile.childNodes.length + ui.discardPile.childNodes.length < 20) {
					return 0;
				}
			},
			aiValue: (player, card, num) => {
				if (num > 0 && card.name === "zhuge") {
					return 20;
				}
			},
			aiUseful: (player, card, num) => {
				if (num > 0 && card.name === "zhuge") {
					return 10;
				}
			},
		},
		trigger: { player: ["useCard", "respond"] },
		direct: true,
		locked: false,
		filter(event, player) {
			return game.hasPlayer(i => i.countCards("ej", cardx => get.type(cardx) == "equip" && get.suit(event.card) == get.suit(cardx)));
		},
		content() {
			"step 0";
			var suit = get.suit(trigger.card),
				extra = game
					.filterPlayer()
					.map(i =>
						i.countCards("ej", cardx => {
							return get.type(cardx) == "equip" && get.suit(trigger.card) == get.suit(cardx);
						})
					)
					.reduce((p, c) => p + c);
			var prompt2 = "弃置任意张" + get.translation(suit) + "手牌，然后摸X张牌（X为你弃置的牌数+" + extra + "）";
			player
				.chooseToDiscard("h", [1, player.countCards("h", { suit: suit })], { suit: suit }, "allowChooseAll")
				.set("prompt", get.prompt("pshengwu"))
				.set("prompt2", prompt2)
				.set("ai", card => {
					if (_status.event.tie) {
						return 0;
					}
					let player = _status.event.player;
					if (_status.event.goon) {
						return 12 - get.value(card);
					}
					if (player == _status.currentPhase) {
						if (["shan", "caochuan", "tao", "wuxie"].includes(card.name)) {
							return 8 - get.value(card);
						}
						return 6 - get.value(card);
					}
					return 5.5 - get.value(card);
				})
				.set("goon", player.countCards("h", { suit: suit }) == 1)
				.set("tie", extra > ui.cardPile.childNodes.length + ui.discardPile.childNodes.length)
				.set("logSkill", "pshengwu");
			"step 1";
			if (result.bool) {
				var num = result.cards.length;
				player.draw(
					num +
						game
							.filterPlayer()
							.map(i => i.countCards("ej", cardx => get.type(cardx) == "equip" && get.suit(trigger.card) == get.suit(cardx)))
							.reduce((p, c) => p + c)
				);
			}
		},
		ai: {
			threaten: 100,
			reverseEquip: true,
			effect: {
				player_use(card, player, target) {
					if (typeof card !== "object") {
						return;
					}
					let suit = get.suit(card);
					if (
						!lib.suit.includes(suit) ||
						player.hasCard(function (i) {
							return get.suit(i, player) == suit;
						}, "h")
					) {
						return;
					}
					return [
						1,
						game.countPlayer(current => {
							return current.countCards("e", card => {
								return get.suit(card, current) == suit;
							});
						}),
					];
				},
				target(card, player, target) {
					if (
						card.name === "sha" &&
						!player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: card,
							},
							true
						) &&
						game.hasPlayer(current => {
							return current.hasCard(cardx => {
								return get.subtype(cardx) === "equip3";
							}, "e");
						})
					) {
						return [0, -0.5];
					}
				},
			},
		},
	},
	//一战成名·群雄逐鹿·长安之战专属神贾诩
	zybishi: {
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.card.name == "sha" && event.player != player;
		},
		check(event, player) {
			var effect = 0;
			if (event.targets && event.targets.length) {
				for (var i = 0; i < event.targets.length; i++) {
					effect += get.effect(event.targets[i], event.card, event.player, player);
				}
			}
			if (effect < 0) {
				var target = event.targets[0];
				if (target == player) {
					return !player.countCards("h", "shan");
				} else {
					return target.hp == 1 || (target.countCards("h") <= 2 && target.hp <= 2);
				}
			}
			return false;
		},
		content() {
			player.line(trigger.player, "green");
			trigger.player.draw();
			var evt = trigger.getParent();
			evt.all_excluded = true;
			game.log(evt.card, "被无效了");
		},
	},
	zyjianbing: {
		trigger: { global: "damageBegin3" },
		logTarget: "player",
		filter(event, player) {
			return event.player != player && event.player.isIn() && event.card && event.card.name == "sha" && event.player.countGainableCards(player, "he") > 0;
		},
		content() {
			"step 0";
			player.gainPlayerCard(trigger.player, true, "he");
			"step 1";
			if (result.bool && result.cards && result.cards.length) {
				var card = result.cards[0];
				if (get.suit(card, trigger.player) == "heart") {
					trigger.player.recover();
				}
			}
		},
	},
};

export default skills;
