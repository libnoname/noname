import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//谋小乔 —— by 星の语
	//洗脚女将，再添一员（？）
	olmiluo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") && game.hasPlayer(target => target != player);
		},
		filterCard: true,
		position: "he",
		selectCard: () => [1, 2],
		filterTarget: lib.filter.notMe,
		selectTarget: () => ui.selected.cards.length,
		targetprompt() {
			const links = ui.selected.cards;
			return ["获得", get.translation(links[ui.selected.targets.length - 1])].join("<br>");
		},
		check(card) {
			const player = get.player();
			if (
				ui.selected.cards.length >=
				game.countPlayer(current => {
					return current != player && get.attitude(player, current) > 0;
				})
			) {
				return 0;
			}
			return 6 - get.value(card);
		},
		multiline: true,
		multitarget: true,
		complexSelect: true,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const { targets, cards: links } = event;
			await player.showCards(links, get.translation(player) + "发动了【" + get.translation(event.name) + "】");
			const gain_list = targets.map((target, i) => [target, [links[i]]]);
			await game
				.loseAsync({
					gain_list: gain_list,
					player: player,
					cards: links,
					giver: player,
					animate: "give",
					gaintag: ["olmiluo"],
				})
				.setContent("gaincardMultiple");
			player.addTempSkill(event.name + "_clear", "roundStart");
			player.markAuto(event.name + "_clear", targets);
		},
		group: ["olmiluo_end"],
		subSkill: {
			clear: {
				charlotte: true,
				onremove(player, skill) {
					player.storage[skill].forEach(target => {
						target.removeGaintag("olmiluo");
					});
					delete player.storage[skill];
				},
			},
			end: {
				trigger: {
					global: "roundEnd",
				},
				filter(event, player) {
					return player.getStorage("olmiluo_clear").some(target => target.isIn());
				},
				async cost(event, trigger, player) {
					const next = player
						.chooseTarget(`###${get.prompt(event.skill)}###令一名没有“迷落”牌的角色失去1点体力，或令一名有“迷落”牌的角色回复1点体力。`, (card, player, target) => {
							return player.getStorage("olmiluo_clear").includes(target);
						})
						.set("ai", target => {
							const player = get.player();
							if (target.countCards("h", card => card.hasGaintag("olmiluo"))) {
								return get.recoverEffect(target, player, player);
							}
							return get.effect(target, { name: "loseHp" }, player, player);
						});
					next.targetprompt2.add(target => {
						if (!target.isIn() || !get.event().filterTarget(null, get.player(), target)) {
							return false;
						}
						return target.countCards("h", card => card.hasGaintag("olmiluo")) ? "回复体力" : "失去体力";
					});
					event.result = await next.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					if (target.countCards("h", card => card.hasGaintag("olmiluo"))) {
						if (target.isDamaged()) {
							await target.recover();
						}
					} else {
						await target.loseHp();
					}
				},
			},
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	oljueyan: {
		enable: "chooseToUse",
		round: 1,
		hiddenCard(player, name) {
			return !player?.hasSkill("oljueyan_round") && player?.countCards("h", card => (get.type(card, player) == "trick" || (get.type(card, player) == "basic" && get.suit(card, player) == "heart")) && get.name(card, player) == name);
		},
		filter(event, player) {
			return player.countCards("h", card => {
				if (get.type(card, player) == "trick" || (get.type(card, player) == "basic" && get.suit(card, player) == "heart")) {
					return event.filterCard(
						get.autoViewAs({
							name: get.name(card, player),
							suit: get.suit(card, player),
							nature: get.nature(card, player),
							number: get.number(card, player),
							isCard: true,
						}),
						player,
						event
					);
				}
				return false;
			});
		},
		filterCard(card, player, event) {
			event = event || _status.event;
			if (get.type(card, player) == "trick" || (get.type(card, player) == "basic" && get.suit(card, player) == "heart")) {
				return event._backup.filterCard(
					get.autoViewAs({
						name: get.name(card, player),
						suit: get.suit(card, player),
						nature: get.nature(card, player),
						number: get.number(card, player),
						isCard: true,
					}),
					player,
					event
				);
			}
			return false;
		},
		position: "h",
		viewAs(cards, player) {
			if (cards.length) {
				const card = cards[0];
				return {
					name: get.name(card, player),
					suit: get.suit(card, player),
					nature: get.nature(card, player),
					number: get.number(card, player),
					isCard: true,
				};
			}
			return null;
		},
		prompt: "展示并视为使用手牌中一张普通锦囊牌或红桃基本牌",
		async precontent(event, trigger, player) {
			const cards = event.result.cards;
			await player.showCards(cards, `${get.translation(player)}发动了【绝颜】`);
			delete event.result.cards;
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
		group: ["oljueyan_draw"],
		subSkill: {
			draw: {
				trigger: {
					player: "showCardsAfter",
				},
				filter(event, player) {
					const hs = player.getCards("h"),
						cards = event.cards.filter(card => hs.includes(card)),
						map = lib.skill.oljueyan_draw.getFirstShow(player);
					return (
						cards.length &&
						Object.values(map)
							.flat()
							.filter(evt => evt == event).length > 0
					);
				},
				getFirstShow(player) {
					const history = game.getAllGlobalHistory(),
						map = {};
					if (history.length <= 1) {
						return list;
					}
					for (let i = history.length - 1; i >= 0; i--) {
						const evts = history[i]["everything"].filter(evt => {
							if (evt.name !== "showCards") {
								return false;
							}
							return evt.player == player;
						});
						if (evts.length) {
							for (let j = evts.length - 1; j >= 0; j--) {
								evts[j].cards
									.map(card => get.suit(card))
									.unique()
									.forEach(suit => (map[suit] = evts[j]));
							}
						}
						if (history[i].isRound) {
							break;
						}
					}
					return map;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const map = lib.skill.oljueyan_draw.getFirstShow(player),
						num = Object.values(map)
							.flat()
							.filter(evt => evt == trigger).length,
						skill = "oljueyan",
						str = Object.keys(map)
							.sort((a, b) => lib.suit.indexOf(a) - lib.suit.indexOf(b))
							.map(i => get.translation(i))
							.join("");
					player.addTip(skill, `${get.translation(skill)} ${str}`, "roundStart");
					await player.draw(num);
				},
			},
		},
	},
	//魔司马懿 —— by 星の语
	//舍身入魔，佛奈我何！
	olguifu: {
		audio: 2,
		trigger: {
			global: "roundStart",
			player: ["recoverEnd", "damageEnd", "loseHpEnd"],
		},
		check: () => true,
		frequent: true,
		prompt2: "随机从牌堆或弃牌堆获得一张不计入手牌上限的【闪】",
		content() {
			const card = get.cardPile("shan", null, "random");
			if (!card) {
				player.chat("桀桀桀，居然没闪了吗");
				return;
			}
			player.gain(card, "gain2").gaintag.add("olguifu");
		},
		group: ["olguifu_viewAs", "olguifu_record"],
		locked: false,
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("olguifu")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("olguifu")) {
					return false;
				}
			},
			cardUsable(card, player) {
				if (card.storage?.olguifu_viewAs) {
					return Infinity;
				}
			},
		},
		subSkill: {
			viewAs: {
				enable: "chooseToUse",
				hiddenCard(player, name) {
					if (player.storage.olguifu_record.card.includes(name) && !player.getStorage("olguifu_used").includes(name) && player.hasCard(card => card.hasGaintag("olguifu"), "h")) {
						return true;
					}
				},
				filter(event, player) {
					const names = player.storage.olguifu_record.card.slice(0).removeArray(player.getStorage("olguifu_used"));
					return player.hasCard(card => card.hasGaintag("olguifu"), "h") && names.some(name => event.filterCard(get.autoViewAs({ name: name, storage: { olguifu_viewAs: true } }, "unsure"), player, event));
				},
				chooseButton: {
					dialog(event, player) {
						const list = [];
						for (const name of player.storage.olguifu_record.card) {
							list.push([get.type(name), "", name]);
							if (name == "sha") {
								for (const nature of lib.inpile_nature) {
									list.push([get.type(name), "", name, nature]);
								}
							}
						}
						return ui.create.dialog("诡伏", [list, "vcard"], "hidden");
					},
					filter(button, player) {
						if (player.getStorage("olguifu_used").includes(button.link[2])) {
							return false;
						}
						return get
							.event()
							.getParent()
							.filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3], storage: { olguifu_viewAs: true } }, "unsure"), player, get.event().getParent());
					},
					check(button) {
						return get.player().getUseValue(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"));
					},
					backup(links, player) {
						return {
							audio: "olguifu",
							filterCard(card, player) {
								return get.itemtype(card) == "card" && card.hasGaintag("olguifu");
							},
							viewAs: {
								name: links[0][2],
								nature: links[0][3],
								storage: {
									olguifu_viewAs: true,
								},
							},
							position: "h",
							check(card) {
								return 8 - get.value(card);
							},
							log: false,
							precontent() {
								const skill = "olguifu",
									card = event.result.card;
								player.logSkill(skill);
								player.addTempSkill(skill + "_used");
								player.markAuto(skill + "_used", card.name);
								event.getParent().addCount = false;
							},
						};
					},
					prompt(links, player) {
						const name = links[0][2],
							nature = links[0][3];
						return "将一张「诡伏」牌当作" + (get.translation(nature) || "") + get.translation(name) + "使用";
					},
				},
				ai: {
					order: 7,
					result: {
						player: 1,
					},
				},
			},
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "已转化过$",
				},
			},
			record: {
				audio: "olguifu",
				init(player, skill) {
					player.storage[skill] = { card: [], skill: [] };
				},
				trigger: { global: "damageSource" },
				filter(event, player) {
					const storage = player.storage.olguifu_record;
					if (event.card?.name) {
						return !storage.card.includes(event.card.name);
					}
					const skill = lib.skill.olguifu_record.findSkill(event);
					return skill && !storage.skill.includes(skill);
				},
				findSkill(event) {
					let skill = "",
						count = 0;
					do {
						count++;
						let name = event.getParent(count)?.name;
						if (!name) {
							break;
						}
						if (name.startsWith("pre_")) {
							name = name.slice(4);
						}
						if (name.endsWith("_backup")) {
							name = name.slice(0, name.lastIndexOf("_backup"));
						}
						if (name.endsWith("ContentBefore")) {
							name = name.slice(0, name.lastIndexOf("ContentBefore"));
						}
						if (name.endsWith("ContentAfter")) {
							name = name.slice(0, name.lastIndexOf("ContentAfter"));
						}
						if (name.endsWith("_cost")) {
							name = name.slice(0, name.lastIndexOf("_cost"));
						}
						skill = get.sourceSkillFor(name);
						const info = get.info(skill);
						if (!info || !Object.keys(info).length || info.charlotte || info.equipSkill || lib.skill.global.includes(skill)) {
							continue;
						}
						return skill;
					} while (true);
					return null;
				},
				forced: true,
				locked: false,
				content() {
					let storage = player.storage[event.name];
					const skill = lib.skill[event.name].findSkill(trigger);
					if (trigger.card) {
						storage["card"].add(trigger.card.name);
					} else if (skill) {
						storage["skill"].add(skill);
					}
					player.markSkill(event.name);
				},
				intro: {
					markcount(storage, player) {
						if (!storage) {
							return "当前暂无记录";
						}
						return Object.values(storage).flat().length;
					},
					content(storage, player) {
						if (!storage) {
							return "当前暂无记录";
						}
						const cards = storage["card"],
							skills = storage["skill"];
						let str = "";
						if (cards.length) {
							str += `<li>记录的牌：${get.translation(cards)}<br>`;
						}
						if (skills.length) {
							str += `<li>记录的技能：${get.translation(skills)}`;
						}
						if (!str) {
							return "无记录的牌或技能";
						}
						return str;
					},
				},
				onremove: true,
			},
		},
	},
	olmoubian: {
		audio: 4,
		derivation: ["olzhouxi"],
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			const storage = player.storage.olguifu_record;
			if (!storage) {
				return false;
			}
			return Object.values(storage).flat().length >= 3 && !player.hasSkill("olrumo");
		},
		skillAnimation: "epic",
		animationColor: "thunder",
		check: () => true,
		async content(event, trigger, player) {
			player.addSkill("olrumo");
			const skills = player.storage.olguifu_record?.skill;
			if (skills?.length) {
				await player.addSkills(skills);
			}
			await player.addSkills(["olzhouxi"]);
		},
		ai: {
			combo: "olguifu",
		},
	},
	olzhouxi: {
		audio: 2,
		damageSkills: ["oljuece", "reganglie", "nzry_kuizhu", "zhefu", "tianjie", "xinleiji", "zhendu", "olqiangxi", "duwu", "olsanyao", "oljianhe", "clanlieshi", "xueji", "quhu", "olshuzi"],
		initList() {
			//先用许劭评鉴那个函数初始化一下角色列表
			if (!_status.characterlist) {
				game.initCharactertList();
			}
			//获取各个角色的技能并去重
			const skills = _status.characterlist
				.map(i => get.character(i, 3))
				.flat()
				.unique();
			//展开技能
			game.expandSkills(skills, true);
			const list = [];
			//筛选技能
			for (let skill of skills) {
				let info = get.info(skill);
				//获取技能的内容，后者是一些主动技会用到的内容
				info = info.content || info.chooseButton?.backup;
				//将内容转为字符串
				const str = info?.toString();
				//检测是否包含“.damage(”子串，即造成伤害的函数
				if (str?.includes(".damage(")) {
					skill = get.sourceSkillFor(skill);
					info = get.info(skill);
					//双重检测，如果技能描述中不带伤害字样的去除
					if (!skill || !get.plainText(get.skillInfoTranslation(skill)).includes("伤害")) {
						continue;
					}
					//去除觉醒技、隐匿技、势力技、主公技
					if (!info || info.silent || info.juexingji || info.hiddenSkill || info.groupSkill || info.zhuSkill) {
						continue;
					}
					//去除有联动的技能和负面技能
					if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) {
						continue;
					}
					list.add(skill);
				}
			}
			//最后用全局变量存储，就不需要反复执行这个函数了
			_status.damageSkills = list;
		},
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			if (!_status.damageSkills) {
				lib.skill.olzhouxi.initList();
			}
			const skills = _status.damageSkills.filter(skill => !player.hasSkill(skill, null, null, false)).randomGets(3);
			/*const skills = get
				.info(event.name)
				.damageSkills
				.filter(skill => !player.hasSkill(skill))
				.randomGets(3);*/
			if (!skills.length) {
				return;
			}
			const result = await player
				.chooseButton([`###${get.translation(event.name)}###你从三个可造成伤害的技能中选择一个获得直到你的下回合开始。`, [skills, "skill"]], true)
				.set("ai", () => 1 + Math.random())
				.forResult();
			if (!result?.links) {
				return;
			}
			const skill = result.links[0];
			await player.addTempSkills(skill, { player: "phaseBegin" });
		},
		group: ["olzhouxi_tiaoxin"],
		subSkill: {
			tiaoxin: {
				audio: "olzhouxi",
				trigger: { global: "roundEnd" },
				filter(event, player) {
					return lib.skill.olzhouxi_tiaoxin.logTarget(event, player).length > 0;
				},
				forced: true,
				logTarget(event, player) {
					return player
						.getRoundHistory("sourceDamage", evt => evt.num > 0)
						?.map(evt => evt.player)
						.unique()
						.filter(target => target.isIn() && target.canUse({ name: "sha", isCard: true }, player, false, false))
						.sortBySeat();
				},
				async content(event, trigger, player) {
					const targets = lib.skill.olzhouxi_tiaoxin.logTarget(trigger, player);
					if (!targets.length) {
						return;
					}
					const card = get.autoViewAs({ name: "sha", isCard: true });
					for (const target of targets) {
						if (target.canUse(card, player, false, false)) {
							await target.useCard(card, player, false);
						}
					}
				},
			},
		},
	},
	olrumo: {
		charlotte: true,
		trigger: { global: "roundEnd" },
		forced: true,
		popup: false,
		content() {
			if (!player.getRoundHistory("sourceDamage", evt => evt.num > 0)?.length) {
				player.loseHp();
			}
		},
		mark: true,
		marktext: "魔",
		intro: { content: "你已入魔" },
	},
	//OL界马岱
	olqianxi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		async content(event, trigger, player) {
			await player.draw();
			if (!player.countCards("he")) {
				return;
			}
			const result = await player
				.chooseCard(`潜袭：请展示一张牌`, "he", true)
				.set("ai", card => {
					const player = get.player();
					let value = 0;
					if (get.tag(card, "damage") > 0.5) {
						value += player.getUseValue(card);
					}
					value += get.color(card, player) == "red" ? 7 - get.value(card, player) : 6 - get.value(card, player);
					return value;
				})
				.forResult();
			if (result?.cards) {
				const card = result.cards[0],
					color = get.color(card, player);
				await player.showCards(card, `${get.translation(player)}发动了〖${get.translation(event.name)}〗`);
				player.addTempSkill(event.name + "_damage");
				player.addGaintag(card, event.name + "_damage");
				const targets = game
					.filterPlayer(target => {
						return player != target && get.distance(player, target) == 1;
					})
					.sortBySeat();
				if (!targets.length) {
					return;
				}
				player.line(targets, "green");
				targets.forEach(target => {
					target.addTempSkill(event.name + "_effect");
					target.markAuto(event.name + "_effect", [color]);
				});
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag !== "directHit_ai" || !arg.target.hasSkill("olqianxi_effect")) {
					return false;
				}
				if (arg.card.name == "sha") {
					return (
						arg.target.getStorage("olqianxi_effect").includes("red") &&
						(!arg.target.hasSkillTag(
							"freeShan",
							false,
							{
								player: player,
								card: arg.card,
								type: "use",
							},
							true
						) ||
							player.hasSkillTag("unequip", false, {
								name: arg.card ? arg.card.name : null,
								target: arg.target,
								card: arg.card,
							}) ||
							player.hasSkillTag("unequip_ai", false, {
								name: arg.card ? arg.card.name : null,
								target: arg.target,
								card: arg.card,
							}))
					);
				}
				return arg.target.getStorage("olqianxi_effect").includes("black");
			},
		},
		subSkill: {
			damage: {
				audio: "olqianxi",
				charlotte: true,
				forced: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return (
						event.card &&
						player.hasHistory("lose", evt => {
							return evt.getParent() == event.getParent("useCard") && Object.values(evt.gaintag_map).flat().includes("olqianxi_damage");
						})
					);
				},
				content() {
					trigger.num++;
				},
				mod: {
					aiOrder(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("olqianxi_damage") && get.event().name == "chooseToUse") {
							return num + 0.5;
						}
					},
				},
			},
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled2(card, player) {
						if (player.getStorage("olqianxi_effect").includes(get.color(card, player)) && get.position(card) == "h") {
							return false;
						}
					},
				},
				intro: {
					markcount: () => 0,
					content(storage) {
						return "不能使用或打出" + get.translation(storage) + "的手牌";
					},
				},
			},
		},
	},
	//OL谋卢植
	olsibing: {
		audio: 2,
		trigger: {
			player: "useCardToPlayer",
			global: "useCardAfter",
		},
		filter(event, player, name) {
			if (name == "useCardToPlayer") {
				return get.tag(event.card, "damage") > 0.5 && event.targets.length == 1 && player.countDiscardableCards(player, "he", card => get.color(card, player) == "red") && !player.hasSkill("olsibing_used");
			}
			return get.tag(event.card, "damage") > 0.5 && event.targets.includes(player) && !player.hasHistory("damage", evt => evt.getParent("useCard") == event) && player.countDiscardableCards(player, "he", card => get.color(card, player) == "black") && player.hasUseTarget({ name: "sha", isCard: true }, false, false);
		},
		logTarget(event, player, name) {
			if (name == "useCardToPlayer") {
				return [event.target];
			}
			return [];
		},
		async cost(event, trigger, player) {
			const name = event.triggername;
			if (name == "useCardToPlayer") {
				event.result = await player
					.chooseToDiscard(`###${get.prompt(event.skill, trigger.target)}###弃置任意张红色牌并令其弃置等量红色手牌，否则不能响应该牌`, [1, Infinity], "he", "chooseonly", (card, player) => get.color(card, player) == "red")
					.set("ai", card => {
						const player = get.player(),
							target = get.event().getTrigger().target,
							cardx = get.event().getTrigger().card;
						if (get.effect(target, cardx, player, player) < 0 || cardx.name == "huogong") {
							return 0;
						}
						if (ui.selected.cards?.length == target.countCards("h", { color: "red" })) {
							return 0;
						}
						return 7 - get.value(card);
					})
					.forResult();
			} else {
				event.result = await player
					.chooseToDiscard(`###${get.prompt(event.skill)}###弃置一张黑色牌并视为使用一张【杀】`, "he", "chooseonly", (card, player) => get.color(card, player) == "black")
					.set("ai", card => {
						if (!get.player().hasValueTarget({ name: "sha", isCard: true }, false, false)) {
							return 0;
						}
						return 6 - get.value(card);
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				name = event.triggername;
			if (name == "useCardToPlayer") {
				player.addTempSkill("olsibing_used");
			}
			await player.discard(cards);
			if (name == "useCardToPlayer") {
				const target = trigger.target;
				const result = await target
					.chooseToDiscard(`司兵：请弃置${cards.length}张红色手牌，或取消令你不可响应${get.translation(trigger.card)}`, cards.length, card => {
						return get.color(card, get.player()) == "red";
					})
					.set("ai", card => {
						const trigger = get.event().getTrigger(),
							player = get.player();
						if (get.event().num > 2 || !player.canRespond(trigger) || trigger.card.name == "huogong") {
							return 0;
						}
						if (player.canRespond(trigger, card)) {
							return 6 - get.value(card);
						}
						return 7 - get.value(card);
					})
					.set("num", cards.length)
					.forResult();
				if (result?.bool === false) {
					trigger.getParent().directHit.add(target);
					target.popup("不可响应");
					game.log(target, "不可响应", trigger.card);
				}
			} else {
				const card = get.autoViewAs({ name: "sha", isCard: true });
				await player.chooseUseTarget(card, true, false, "nodistance");
			}
		},
		subSkill: {
			used: { charlotte: true },
		},
	},
	olliance: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["loseAsyncAfter", "equipAfter", "addToExpansionAfter", "gainAfter", "addJudgeAfter"],
		},
		usable: 1,
		filter(event, player) {
			const bool1 = event.getg && event.getg(player)?.length,
				bool2 = event.getl && event.getl(player)?.hs?.length;
			return (bool1 || bool2) && player.isMinHandcard() && player.countCards("h") < player.maxHp && !player.getStorage("olliance_used").includes(_status.currentPhase == player ? "isMe" : "notMe");
		},
		check(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		async content(event, trigger, player) {
			player.addTempSkill(event.name + "_used", "roundStart");
			player.markAuto(event.name + "_used", _status.currentPhase == player ? "isMe" : "notMe");
			await player.drawTo(player.maxHp);
			player.addTempSkill(event.name + "_damage");
			player.addMark(event.name + "_damage", 1, false);
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			damage: {
				audio: "olliance",
				charlotte: true,
				forced: true,
				forceDie: true,
				onremove: true,
				trigger: { global: "damageBegin1" },
				content() {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				mark: true,
				intro: {
					content: "本回合下一次有角色造成的伤害+#",
				},
			},
		},
	},
	//OL界关兴张苞
	olfuhun: {
		inherit: "fuhun",
		position: "hes",
		global: ["olfuhun_block"],
		group: ["olfuhun_effect", "olfuhun_mark"],
		prompt: "将两张牌当杀使用或打出",
		viewAsFilter(player) {
			return player.countCards("hes") > 1;
		},
		subSkill: {
			effect: {
				audio: "olfuhun",
				trigger: {
					source: "damageSource",
				},
				forced: true,
				filter(event, player) {
					if (["new_rewusheng", "olpaoxiao"].every(skill => player.hasSkill(skill, null, false, false))) {
						return false;
					}
					return player.isPhaseUsing() && event.card?.name == "sha";
				},
				content() {
					player.addTempSkills(["new_rewusheng", "olpaoxiao"]);
				},
			},
			mark: {
				audio: "olfuhun",
				forced: true,
				locked: false,
				trigger: { player: "useCard" },
				firstDo: true,
				filter(event, player) {
					return event.card?.name == "sha" && get.is.convertedCard(event.card);
				},
				content() {
					if (!trigger.card.storage) {
						trigger.card.storage = {};
					}
					trigger.card.storage.olfuhun = true;
				},
			},
			//根据思召剑和谋韩当的弓骑修改
			block: {
				mod: {
					cardEnabled(card, player) {
						let evt = get.event();
						if (evt.name != "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						if (!evt?.respondTo || !evt.respondTo[1]?.storage?.olfuhun) {
							return;
						}
						const color1 = get.color(card),
							color2 = get.color(evt.respondTo[1]),
							hs = player.getCards("h"),
							cards = [card];
						if (color1 === "unsure") {
							return;
						}
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (color1 != color2 || !cards.containsSome(...hs)) {
							return false;
						} //
					},
				},
				charlotte: true,
			},
		},
	},
	//闪刘宏
	olchaozheng: {
		audio: "jsrgchaozheng",
		logAudio: index => (typeof index === "number" ? "jsrgchaozheng" + index + ".mp3" : ["jsrgchaozheng1.mp3", "jsrgchaozheng2.mp3"]),
		inherit: "jsrgchaozheng",
		filter(event, player) {
			if (!player.countCards("h")) {
				return false;
			}
			return game.hasPlayer(i => i != player && i.countCards("h"));
		},
		logTarget(event, player) {
			return game.filterPlayer(i => i != player && i.countCards("h"));
		},
		prompt2() {
			return lib.translate["olchaozheng_info"].split("②")[0].slice(1);
		},
		content() {
			player.chooseToDebate(game.filterPlayer(current => current.countCards("h"))).set("callback", async (event, trigger, player) => {
				const { debateResult: result } = event;
				const { bool, opinion, targets, opinions } = result;
				if (bool && opinion) {
					if (opinion && ["red", "black"].includes(opinion)) {
						player.logSkill("olchaozheng", targets, null, null, [opinion == "red" ? 3 : 4]);
						for (const target of result.red
							.map(i => i[0])
							.unique()
							.sortBySeat()) {
							if (target === player && opinion !== "red") {
								continue;
							}
							await target[opinion == "red" ? "recover" : "loseHp"]();
						}
					}
				}
				const ops = opinions.filter(i => result[i].flat().includes(player));
				if (ops) {
					await player.draw(
						Math.min(
							3,
							ops.reduce((sum, op) => sum + result[op].map(i => i[0]).unique().length, 0)
						)
					);
				}
			});
		},
		group: "olchaozheng_debate",
		subSkill: {
			debate: {
				audio: "olchaozheng",
				trigger: { global: "debateShowOpinion" },
				filter(event, player) {
					return event.targets.includes(player) && event.opinions.some(i => event[i].flat().includes(player));
				},
				forced: true,
				locked: false,
				content() {
					const ops = trigger.opinions.filter(i => trigger[i].flat().includes(player));
					for (const op of ops) {
						for (const list of trigger[op]) {
							if (list[0] === player) {
								const color = typeof list[1] == "string" ? list[1] : get.color(list[1], list[0]);
								trigger[op].push([player, color]);
								game.log(player, "的", "#g" + get.translation(color) + "意见+1");
								break;
							}
						}
					}
				},
			},
		},
	},
	olshenchong: {
		audio: "jsrgshenchong",
		inherit: "jsrgshenchong",
		async content(event, trigger, player) {
			const { target, name: skillName } = event;
			player.awakenSkill(skillName);
			await target.addSkills(get.info(skillName).derivation);
			player.addSkill(skillName + "_die");
			player.markAuto(skillName + "_die", [target]);
		},
		derivation: ["olrefeiyang", "jsrgbahu"],
		subSkill: {
			die: {
				charlotte: true,
				audio: "jsrgshenchong",
				trigger: { player: "die" },
				filter(event, player) {
					return player.getStorage("olshenchong_die").length;
				},
				forced: true,
				forceDie: true,
				content() {
					const targets = player.getStorage("olshenchong_die");
					player.line(targets);
					targets.sortBySeat().forEach(current => {
						current.clearSkills();
						current.chooseToDiscard(current.countCards("h"), "h", true);
					});
				},
			},
		},
	},
	olrefeiyang: {
		trigger: { player: "phaseJudgeBegin" },
		filter(event, player) {
			return (
				player.countCards("j") &&
				player.countCards("he", card => {
					if (get.position(card) === "h" && _status.connectMode) {
						return false;
					}
					return lib.filter.cardDiscardable(card, player);
				}) > 1
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("he", 2, get.prompt(event.skill), "弃置两张牌，然后弃置判定区里的所有牌")
				.set("logSkill", event.skill)
				.set("ai", card => {
					return _status.event.goon ? 7 - get.value(card) : 0;
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
			event.result.skill_popup = false;
		},
		async content(event, trigger, player) {
			await player.discardPlayerCard(player, "j", true, player.countCards("j"));
		},
	},
	//闪赵云
	ollonglin: {
		audio: "jsrglonglin",
		inherit: "jsrglonglin",
		async content(event, trigger, player) {
			const juedou = new lib.element.VCard({ name: "juedou", storage: { ollonglin: true } });
			const { result } = await player
				.chooseToDiscard(get.prompt2("ollonglin"), "he")
				.set("ai", card => {
					if (get.event("goon")) {
						return 5 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(trigger.player.canUse(juedou, player) ? Math.max(0, get.effect(player, juedou, trigger.player, trigger.player)) : 0) +
						trigger.targets
							.map(target => {
								return get.effect(target, trigger.card, trigger.player, player);
							})
							.reduce((p, c) => {
								return p + c;
							}, 0) <
						-4
				)
				.set("logSkill", ["ollonglin", trigger.player]);
			if (result.bool) {
				trigger.excluded.addArray(trigger.targets);
				await game.delayx();
				if (trigger.player.canUse(juedou, player)) {
					const { result } = await trigger.player.chooseBool(`是否视为对${get.translation(player)}使用一张【决斗】？`).set("choice", get.effect(player, juedou, trigger.player, trigger.player) >= 0);
					if (result.bool) {
						player.addTempSkill("ollonglin_source");
						trigger.player.useCard(juedou, player);
					}
				}
			}
		},
		subSkill: {
			source: {
				charlotte: true,
				trigger: { source: "damageSource" },
				filter(event, player) {
					return event.card?.storage?.ollonglin;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.line(trigger.player);
					trigger.player.addTempSkill("ollonglin_forbid", {
						player: "useCard1",
						global: "phaseUseAfter",
					});
				},
			},
			forbid: {
				charlotte: true,
				mark: true,
				intro: { content: "不能指定其他角色为目标" },
				mod: {
					playerEnabled(card, player, target) {
						if (target !== player) {
							return false;
						}
					},
				},
			},
		},
	},
	olzhendan: {
		audio: "jsrgzhendan",
		enable: ["chooseToUse", "chooseToRespond"],
		onChooseToUse(event) {
			if (!game.online && !event.onzhendan) {
				event.set("olzhendan", get.info("olzhendan").getUsed(event.player));
			}
		},
		onChooseToRespond(event) {
			if (!game.online && !event.onzhendan) {
				event.set("olzhendan", get.info("olzhendan").getUsed(event.player));
			}
		},
		filter(event, player) {
			if (event.type === "wuxie") {
				return false;
			}
			if (
				!player.hasCard(card => {
					return _status.connectMode || get.type(card) !== "basic";
				}, "hs")
			) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] !== "basic" || event.olzhendan?.includes(info[2])) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = get.inpileVCardList(info => {
					if (info[0] !== "basic" || event.olzhendan?.includes(info[2])) {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("镇胆", [vcards, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type !== "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			backup(links, player) {
				return {
					audio: "jsrgzhendan",
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard(card, player) {
						return get.type2(card) !== "basic";
					},
					position: "hs",
				};
			},
			prompt(links, player) {
				return "将一张非基本手牌当作" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name) || get.type(name) !== "basic" || player.isTempBanned("olzhendan")) {
				return false;
			}
			return (
				!get.info("olzhendan").getUsed(player).includes(name) &&
				player.hasCard(card => {
					return _status.connectMode || get.type(card) !== "basic";
				}, "hs")
			);
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				return get.info("olzhendan").hiddenCard(player, name.slice("respond".length).toLowerCase());
			},
			order: 0.5,
			result: {
				player(player) {
					if (get.event().dying) {
						return get.attitude(player, get.event().dying);
					}
					return 1;
				},
			},
		},
		getUsed: player =>
			player
				.getRoundHistory("useCard", evt => get.type(evt.card) === "basic")
				.map(evt => evt.card.name)
				.unique(),
		group: "olzhendan_damage",
		subSkill: {
			backup: {},
			damage: {
				audio: "jsrgzhendan",
				trigger: {
					player: "damageEnd",
					global: "roundEnd",
				},
				filter(event, player) {
					if (event.name === "damage" && !player.isTempBanned("olzhendan")) {
						return true;
					}
					const history = _status.globalHistory;
					if (event.name !== "damage" || !history[history.length - 1].isRound) {
						for (let i = history.length - (event.name === "damage" ? 2 : 1); i >= 0; i--) {
							if (
								game.hasPlayer2(current => {
									const actionHistory = current.actionHistory[i];
									return actionHistory.isMe && !actionHistory.isSkipped;
								})
							) {
								return true;
							}
							if (history[i].isRound) {
								break;
							}
						}
					}
					return false;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const history = _status.globalHistory;
					let num = 0;
					if (trigger.name !== "damage" || !history[history.length - 1].isRound) {
						for (let i = history.length - (trigger.name === "damage" ? 2 : 1); i >= 0; i--) {
							game.hasPlayer2(current => {
								const actionHistory = current.actionHistory[i];
								return actionHistory.isMe && !actionHistory.isSkipped;
							}) && num++;
							if (num === 5 || history[i].isRound) {
								break;
							}
						}
					}
					num > 0 && (await player.draw(num));
					trigger.name === "damage" && player.tempBanSkill("olzhendan", "roundStart");
				},
			},
		},
	},
	//OL谋贾诩
	olsbwance: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (!game.hasPlayer(target => target.countCards("h"))) {
				return false;
			}
			return lib.inpile.some(name => {
				const info = get.info({ name: name });
				return info && info.type === "trick" && !info.notarget && (info.toself || info.singleCard || !info.selectTarget || info.selectTarget === 1);
			});
		},
		filterTarget(card, player, target) {
			return target.countCards("h");
		},
		usable: 1,
		async content(event, trigger, player) {
			const names = lib.inpile.filter(name => {
					const info = get.info({ name: name });
					return info && info.type === "trick" && !info.notarget && (info.toself || info.singleCard || !info.selectTarget || info.selectTarget === 1);
				}),
				target = event.target;
			const name =
				names.length > 1
					? ((await player
							.chooseButton([get.translation(event.name) + "：请选择一个单目标普通锦囊牌牌名", [names, "vcard"]], true)
							.set("ai", button => {
								const player = get.player();
								const target = get.event().getParent().target;
								const effectCard = cardx => {
									const card = get.autoViewAs({ name: button.link[2] }, [cardx]);
									let targets = game.filterPlayer(current => target.canUse(card, current));
									if (!targets.length) {
										return 0;
									}
									targets.sort((a, b) => get.effect(b, card, target, target) - get.effect(a, card, target, target));
									let sum = get.effect(target, { name: "guohe_copy", position: "h" }, player, player);
									const effect = get.effect(targets[0], card, target, player);
									if (effect < 0) {
										let targets2 = game.filterPlayer(current => lib.filter.targetEnabled2(card, target, current) && lib.filter.targetInRange(card, target, current));
										if (targets2.length) {
											targets2.sort((a, b) => get.effect(b, card, target, player) - get.effect(a, card, target, player));
											const effect2 = get.effect(targets2[0], card, target, player);
											if (effect2 > 0) {
												sum += get.effect(player, { name: "guohe_copy2" }, player, player);
												sum += effect2;
											}
										} else {
											sum += effect;
										}
									} else {
										sum += effect;
									}
									return sum;
								};
								let cards = target.getCards("h");
								return cards
									.sort((a, b) => effectCard(b) - effectCard(a))
									.slice(0, Math.min(3, game.roundNumber))
									.reduce((num, card) => num + effectCard(card), 0);
							})
							.forResult("links")) ?? [])[0][2]
					: names[0];
			if (name) {
				player.popup(name);
				game.log(player, "声明了", "#y" + get.translation(name));
				let sum = Math.min(3, game.roundNumber);
				player.addTempSkill("olsbwance_effect");
				while (sum > 0 && target.hasCard(card => target.hasUseTarget(get.autoViewAs({ name: name }, [card])), "h")) {
					sum--;
					game.broadcastAll(viewAs => (lib.skill.olsbwance_backup.viewAs = viewAs), { name: name });
					const next = target.chooseToUse();
					next.set("openskilldialog", get.translation(event.name) + "：将一张手牌当作【" + get.translation(name) + "】使用");
					next.set("forced", true);
					next.set("norestore", true);
					next.set("addCount", false);
					next.set("_backupevent", "olsbwance_backup");
					next.set("custom", {
						add: {},
						replace: { window() {} },
					});
					next.backup("olsbwance_backup");
					await next;
				}
			}
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					const names = lib.inpile.filter(name => {
						const info = get.info({ name: name });
						return info && info.type === "trick" && !info.notarget && (info.toself || info.singleCard || !info.selectTarget || info.selectTarget === 1);
					});
					return Math.max(
						...names.map(name => {
							const effectCard = cardx => {
								const card = get.autoViewAs({ name: name }, [cardx]);
								let targets = game.filterPlayer(current => target.canUse(card, current));
								if (!targets.length) {
									return 0;
								}
								targets.sort((a, b) => get.effect(b, card, target, target) - get.effect(a, card, target, target));
								let sum = get.effect(target, { name: "guohe_copy", position: "h" }, player, player);
								const effect = get.effect(targets[0], card, target, player);
								if (effect < 0) {
									let targets2 = game.filterPlayer(current => lib.filter.targetEnabled2(card, target, current) && lib.filter.targetInRange(card, target, current));
									if (targets2.length) {
										targets2.sort((a, b) => get.effect(b, card, target, player) - get.effect(a, card, target, player));
										const effect2 = get.effect(targets2[0], card, target, player);
										if (effect2 > 0) {
											sum += get.effect(player, { name: "guohe_copy2" }, player, player);
											sum += effect2;
										}
									} else {
										sum += effect;
									}
								} else {
									sum += effect;
								}
								return sum;
							};
							let cards = target.getCards("h");
							return cards
								.sort((a, b) => effectCard(b) - effectCard(a))
								.slice(0, Math.min(3, game.roundNumber))
								.reduce((num, card) => num + effectCard(card), 0);
						})
					);
				},
			},
		},
		subSkill: {
			backup: {
				filterCard(card, player) {
					return get.itemtype(card) === "card";
				},
				position: "h",
				filterTarget: lib.filter.filterTarget,
				check: card => 8 - get.value(card),
				log: false,
			},
			effect: {
				charlotte: true,
				audio: "olsbwance",
				trigger: { global: "useCardToPlayer" },
				filter(event, player) {
					if (
						!player.hasCard(card => {
							if (get.position(card) === "h" && _status.connectMode) {
								return true;
							}
							return lib.filter.cardDiscardable(card, player);
						}, "he")
					) {
						return false;
					}
					return event.isFirstTarget && event.getParent(3).name === "olsbwance" && event.getParent(3).player === player;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseCardTarget({
							prompt: get.prompt(event.skill),
							prompt2: '<div class="text center">弃置一张牌并重新为' + get.translation(trigger.card) + "指定目标（原目标为" + get.translation(trigger.targets) + "）</div>",
							filterCard: lib.filter.cardDiscardable,
							position: "he",
							filterTarget(card, player, target) {
								const evt = get.event().getTrigger();
								if (evt.targets.length === 1 && evt.targets[0] === target) {
									return false;
								}
								return lib.filter.targetEnabled2(evt.card, evt.player, target) && lib.filter.targetInRange(evt.card, evt.player, target);
							},
							selectTarget: trigger.targets.length,
							filterOk() {
								const evt = get.event().getTrigger();
								return ui.selected.targets.some(target => !evt.targets.includes(target));
							},
							ai1(card) {
								return 7.5 - get.value(card);
							},
							ai2(target) {
								const player = get.player(),
									evt = get.event().getTrigger();
								if (evt.targets.every(aim => get.effect(aim, evt.card, evt.player, player) > 0)) {
									return 0;
								}
								return get.effect(target, evt.card, evt.player, player);
							},
						})
						.forResult();
				},
				async content(event, trigger, player) {
					await player.discard(event.cards);
					const targets = event.targets.sortBySeat();
					trigger.targets = targets;
					trigger.getParent().targets = targets;
					trigger.getParent().triggeredTargets1 = targets;
					game.log(targets, "成为了", trigger.card, "的新目标");
				},
			},
		},
	},
	olsbchenzhi: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return player.getRoundHistory("damage").length >= Math.min(3, game.roundNumber);
		},
		forced: true,
		locked: false,
		content() {
			trigger.cancel();
		},
		ai: {
			nothunder: true,
			nofire: true,
			nodamage: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (target.getRoundHistory("damage").length >= Math.min(3, game.roundNumber)) {
							return "zeroplayertarget";
						}
					}
				},
			},
		},
		group: "olsbchenzhi_effect",
		subSkill: {
			effect: {
				audio: "olsbchenzhi",
				trigger: { global: "roundEnd" },
				filter(event, player) {
					if (player.getRoundHistory("useSkill", evt => evt.skill === "olsbchenzhi").length > 0) {
						return false;
					}
					return game.hasPlayer(target => {
						return target.getSkills(null, false, false).some(skill => {
							const info = get.info(skill);
							if (!info || info.charlotte) {
								return false;
							}
							return info.limited && target.awakenedSkills.includes(skill);
						});
					});
				},
				firstDo: true,
				skillAnimation: true,
				animationColor: "thunder",
				async cost(event, trigger, player) {
					const func = (event, player) => {
						game.countPlayer(target => {
							const skills = target.getSkills(null, false, false).filter(skill => {
								const info = get.info(skill);
								if (!info || info.charlotte) {
									return false;
								}
								return info.limited && target.awakenedSkills.includes(skill);
							});
							if (skills.length) {
								target.prompt(skills.map(skill => get.translation(skill)).join("<br>"));
							}
						});
					};
					if (event.player == game.me) {
						func(event, player);
					} else if (event.isOnline()) {
						player.send(func, event, player);
					}
					event.result = await player
						.chooseTarget(
							(card, player, target) => {
								return target.getSkills(null, false, false).some(skill => {
									const info = get.info(skill);
									if (!info || info.charlotte) {
										return false;
									}
									return info.limited && target.awakenedSkills.includes(skill);
								});
							},
							get.prompt(event.skill),
							"复原一名角色的一个限定技"
						)
						.set("ai", target => {
							const player = get.player();
							if (player.hasUnknown()) {
								return 0;
							}
							return (
								Math.sign(get.attitude(player, target)) *
								Math.max(
									target
										.getSkills(null, false, false)
										.filter(skill => {
											const info = get.info(skill);
											if (!info || info.charlotte) {
												return false;
											}
											return info.limited && target.awakenedSkills.includes(skill);
										})
										.map(skill => {
											_status.event.skillRankPlayer = target;
											const num = get.skillRank(skill);
											delete _status.event.skillRankPlayer;
											return num;
										})
								)
							);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					player.tempBanSkill(event.name, "forever", false);
					const target = event.targets[0];
					const skills = target.getSkills(null, false, false).filter(skill => {
						const info = get.info(skill);
						if (!info || info.charlotte) {
							return false;
						}
						return info.limited && target.awakenedSkills.includes(skill);
					});
					const skill =
						skills.length > 1
							? await player
									.chooseControl(skills)
									.set(
										"choiceList",
										skills.map(i => {
											return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, target) + "</div>";
										})
									)
									.set("displayIndex", false)
									.set("ai", () => {
										let { player, target, controls } = get.event();
										return controls.sort((a, b) => {
											_status.event.skillRankPlayer = target;
											const limit = get.skillRank(b) - get.skillRank(a);
											delete _status.event.skillRankPlayer;
											return limit * Math.sign(get.attitude(player, target));
										})[0];
									})
									.set("prompt", get.translation(event.name) + "：请选择你要获得的技能")
									.set("target", target)
									.forResult("control")
							: skills[0];
					if (skill) {
						player.line(target);
						game.log(player, "选择了技能", "#g【" + get.translation(skill) + "】");
						target.popup(skill);
						target.restoreSkill(skill);
					}
				},
			},
		},
	},
	olsbluanchao: {
		limited: true,
		audio: 2,
		trigger: { global: "roundStart" },
		check(event, player) {
			if (player.hasUnknown()) {
				return false;
			}
			return game.countPlayer(target => Math.sign(get.attitude(player, target))) > 0;
		},
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const targets = game.filterPlayer().sortBySeat();
			player.line(targets);
			for (const target of targets) {
				const choice = await target
					.chooseControl("sha", "shan")
					.set("ai", () => {
						const { player, controls } = get.event();
						const choices = controls.filter(choice => get.cardPile2({ name: choice }));
						if (choices.length === 1) {
							return choices[0];
						}
						return player.hasValueTarget("sha") ? "sha" : "shan";
					})
					.set("prompt", "选择从牌堆中获得一张【杀】或【闪】。若选择获得【杀】，则本轮首次造成的伤害+1")
					.forResult("control");
				const card = get.cardPile2({ name: choice });
				if (card) {
					await target.gain(card, "gain2");
				}
				if (choice === "sha") {
					target.addTempSkill("olsbluanchao_effect", "roundStart");
					target.addMark("olsbluanchao_effect", 1, false);
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "本轮首次造成的伤害+#" },
				trigger: { source: "damageBegin1" },
				forced: true,
				logTarget: "player",
				content() {
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					trigger.num += num;
				},
			},
		},
	},
	//OL谋文丑
	olsblunzhan: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			const nums = Array.from({ length: 5 })
				.map((_, i) => i + 1)
				.removeArray(player.getStorage("olsblunzhan_used"));
			return nums.length > 0 && player.countCards("hes") >= Math.min(...nums);
		},
		onChooseToUse(event) {
			if (!game.online && !event.olsblunzhan) {
				const player = get.player();
				event.set("olsblunzhan", player.getHistory("useCard"));
			}
			event.targetprompt2.add(target => {
				if (!target.isIn() || get.event().skill != "olsblunzhan" || !get.event().filterTarget(get.card(), get.player(), target)) {
					return false;
				}
				const player = get.player(),
					history = get.event().olsblunzhan;
				const num = history?.filter(evt => evt.targets?.includes(target)).length;
				return `轮战${num}`;
			});
		},
		filterCard: true,
		selectCard: () => [1, 5],
		position: "hes",
		filterOk: () => !get.player().getStorage("olsblunzhan_used").includes(ui.selected.cards.length),
		viewAs: { name: "juedou", storage: { olsblunzhan: true } },
		precontent() {
			player.addTempSkill("olsblunzhan_used");
			player.markAuto("olsblunzhan_used", event.result.cards.length);
			player.addTempSkill("olsblunzhan_effect");
		},
		ai: {
			order(item, player) {
				return get.order({ name: "juedou" }, player) - 0.1;
			},
		},
		locked: false,
		mod: {
			playerEnabled(card, player, target) {
				if (card.storage?.olsblunzhan && player.getStorage("olsblunzhan_ban").includes(target)) {
					return false;
				}
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			ban: {
				charlotte: true,
				onremove: true,
			},
			effect: {
				charlottte: true,
				audio: "olsblunzhan",
				trigger: { source: "damageSource" },
				filter(event, player) {
					const evt = event.getParent(2);
					if (!evt || evt.name !== "useCard" || evt.player !== player || !evt.card?.storage?.olsblunzhan) {
						return false;
					}
					return evt.targets?.length === 1 && evt.targets[0] === event.player;
				},
				prompt2(event, player) {
					const num = player.getHistory("useCard", evt => evt.targets?.includes(event.player)).length;
					return "摸" + get.cnNumber(num) + "张牌，本回合不能再对其发动〖轮战〗";
				},
				logTarget: "player",
				async content(event, trigger, player) {
					await player.draw(player.getHistory("useCard", evt => evt.targets?.includes(trigger.player)).length);
					player.addTempSkill("olsblunzhan_ban");
					player.markAuto("olsblunzhan_ban", [trigger.player]);
				},
			},
		},
	},
	olsbjuejue: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			if (_status.currentPhase !== player) {
				return false;
			}
			if (!event.isFirstTarget || event.targets.length !== 1 || event.target === player) {
				return false;
			}
			return (
				player
					.getHistory("useCard", evt => {
						if (!evt.olsbjuejue) {
							return false;
						}
						return (evt.targets ?? []).length === 1 && evt.targets[0] !== player;
					})
					.indexOf(event.getParent()) === 0
			);
		},
		forced: true,
		logTarget: "target",
		content() {
			const { target } = trigger;
			target.chooseToDiscard("he", true, player.getHistory("useCard", evt => evt.targets?.includes(target)).length);
		},
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_mark");
		},
		subSkill: {
			mark: {
				charlotte: true,
				trigger: {
					player: "loseEnd",
					global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				filter(event, player) {
					if (_status.currentPhase !== player) {
						return false;
					}
					if (player.countCards("h") || event.getParent().name !== "useCard") {
						return false;
					}
					const evt = event.getl(player);
					return evt?.player == player && evt.hs?.length > 0 && evt.hs.length === evt.cards.length;
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					trigger.getParent().set("olsbjuejue", true);
				},
			},
		},
	},
	//OL谋张让
	olsblucun: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (!["basic", "trick"].includes(get.type(name))) {
						return false;
					}
					return !player.getStorage("olsblucun_used").includes(name);
				})
				.some(card => event.filterCard(new lib.element.VCard({ name: card[2], nature: card[3] }), player, event));
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("赂存", [get.inpileVCardList(info => ["basic", "trick"].includes(get.type(info[2]))), "vcard"]);
			},
			filter(button, player) {
				const event = get.event().getParent();
				if (player.getStorage("olsblucun_used").includes(button.link[2])) {
					return false;
				}
				return event.filterCard(new lib.element.VCard({ name: button.link[2], nature: button.link[3] }), player, event);
			},
			check(button) {
				const event = get.event().getParent();
				if (event.type !== "phase") {
					return 1;
				}
				return get.player().getUseValue(new lib.element.VCard({ name: button.link[2], nature: button.link[3] }));
			},
			prompt(links) {
				return '###赂存###<div class="text center">视为使用' + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】</div>";
			},
			backup(links) {
				return {
					audio: "olsblucun",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3], isCard: true },
					precontent() {
						player.addTempSkill("olsblucun_used", "roundStart");
						player.markAuto("olsblucun_used", [event.result.card.name]);
						player.addTempSkill("olsblucun_effect");
					},
				};
			},
		},
		hiddenCard(player, name) {
			if ((player.getStat("skill")?.olsblucun ?? 0) > 0) {
				return false;
			}
			return ["basic", "trick"].includes(get.type(name)) && !player.getStorage("olsblucun_used").includes(name);
		},
		marktext: "赂",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				return (() => {
					switch (tag) {
						case "fireAttack":
							return ["sha", "huogong"];
						default:
							return [tag.slice("respond".length).toLowerCase()];
					}
				})().some(name => get.info("olsblucun").hiddenCard(player, name));
			},
			order(item, player) {
				if (player && _status.event.type === "phase") {
					let max = 0,
						names = get.inpileVCardList(info => {
							const name = info[2];
							if (!["basic", "trick"].includes(get.type(name))) {
								return false;
							}
							return !player.getStorage("olsblucun_used").includes(name);
						});
					names = names.map(namex => new lib.element.VCard({ name: namex[2], nature: namex[3] }));
					names.forEach(card => {
						if (player.getUseValue(card) > 0) {
							let temp = get.order(card);
							if (temp > max) {
								max = temp;
							}
						}
					});
					return max + (max > 0 ? 0.2 : 0);
				}
				return 10;
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
			used: {
				charlotte: true,
				onremove: true,
				intro: { content: "本轮已使用牌名：$" },
			},
			effect: {
				audio: "olsblucun",
				charlotte: true,
				trigger: {
					player: "useCardAfter",
					global: "phaseEnd",
				},
				filter(event, player) {
					if (event.name === "useCard") {
						return event.skill === "olsblucun_backup" && _status.currentPhase?.countCards("h") > 0;
					}
					return player.getExpansions("olsblucun").length;
				},
				forced: true,
				async content(event, trigger, player) {
					if (trigger.name === "useCard") {
						const target = _status.currentPhase;
						player.line(target);
						const cards = await target.chooseCard("赂存：将一张手牌置于" + get.translation(player) + "的武将牌", "h", true).forResult("cards");
						if (cards?.length) {
							const next = player.addToExpansion(cards, target, "give");
							next.gaintag.add("olsblucun");
							await next;
						}
					} else {
						const names = player
							.getHistory("useCard", evt => evt.skill === "olsblucun_backup")
							.map(evt => evt.card.name)
							.unique();
						let prompt = "赂存：将一张“赂”置入弃牌堆并摸一张牌";
						if (names.length) {
							prompt = "###" + prompt;
							prompt += '###<div class="text center">若你移去了' + get.translation(names) + "，则额外摸一张牌</div>";
						}
						const cards = await player
							.chooseButton([prompt, player.getExpansions("olsblucun")], true)
							.set("names", names)
							.set("ai", button => {
								return Math.random() + (get.event().names.includes(get.name(button.link, false)) ? 2 : 1);
							})
							.forResult("links");
						if (cards?.length) {
							await player.loseToDiscardpile(cards);
							await player.draw(1 + cards.some(card => names.includes(get.name(card, false))));
						}
					}
				},
			},
		},
	},
	olsbtuisheng: {
		limited: true,
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "dying"] },
		filter(event, player) {
			return player.getStorage("olsblucun_used").length > 0;
		},
		check(event, player) {
			if (event.name === "dying") {
				return true;
			}
			return player.isDamaged() && player.getExpansions("olsblucun").length >= 5;
		},
		skillAnimation: true,
		animationColor: "water", //笑点解析——以水蜕生
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.removeSkill("olsblucun_used");
			const goon1 = player.countCards("h") > 0;
			const goon2 = _status.currentPhase?.isIn() && player.getExpansions("olsblucun").length;
			if (goon1 || goon2) {
				let result;
				if (!goon1) {
					result = { index: 1 };
				} else if (!goon2) {
					result = { index: 0 };
				} else {
					const str = get.translation(_status.currentPhase);
					result = await player
						.chooseControl()
						.set("choiceList", ["将所有手牌置于武将牌上，称为“赂”", "令" + str + "获得你的所有“赂”，你回复1点体力"])
						.set("prompt", "蜕生：请选择一项执行并回复1点体力")
						.set("ai", () => {
							const player = get.player(),
								target = _status.currentPhase,
								cards = player.getExpansions("olsblucun");
							return cards.reduce((sum, card) => {
								return sum + get.value(card, target);
							}, 0) *
								Math.sign(get.attitude(player, target)) >
								0
								? 1
								: 0;
						})
						.forResult();
				}
				if (result.index === 0) {
					const next = player.addToExpansion(player.getCards("h"), player, "give");
					next.gaintag.add("olsblucun");
					await next;
				} else {
					await player.give(player.getExpansions("olsblucun"), _status.currentPhase);
					await player.recover();
				}
				await player.recover();
			}
		},
		ai: { combo: "olsblucun" },
	},
	//OL界伏皇后
	olqiuyuan: {
		inherit: "qiuyuan",
		filter(event, player) {
			const { card } = event;
			return (
				(card.name == "sha" || (get.type(card) == "trick" && get.tag(card, "damage") > 0.5)) &&
				game.hasPlayer(current => {
					return current != player && !event.targets.includes(current) && lib.filter.targetEnabled(card, event.player, current);
				})
			);
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const { card } = trigger;
			const name = get.name(card),
				type = get.type2(card);
			const { result } = await target
				.chooseToGive(
					(card, player) => {
						const name = get.name(card, player);
						return name != get.event("namex") && get.type2(name) == get.event("type");
					},
					`交给${get.translation(player)}一张不为【${get.translation(name)}】的${get.translation(type)}牌，或成为${get.translation(card)}的额外目标`,
					player
				)
				.set("ai", card => {
					const { player, target } = get.event();
					return Math.sign(Math.sign(get.attitude(player, target)) - 0.5) * get.value(card);
				})
				.set("namex", name)
				.set("type", type);
			if (!result?.bool) {
				trigger.getParent().targets.push(target);
				trigger.getParent().triggeredTargets2.push(target);
				game.log(target, "成为了", card, "的额外目标");
			}
		},
	},
	//OL界郭淮
	oljingce: {
		audio: 2,
		inherit: "rejingce",
		trigger: { global: "phaseUseEnd" },
		group: "oljingce_add",
		subSkill: {
			add: {
				trigger: { player: "loseEnd" },
				silent: true,
				firstDo: true,
				filter(event, player) {
					if (_status.currentPhase !== player) {
						return false;
					}
					if (event.getParent().name != "useCard") {
						return false;
					}
					const list = player.getStorage("oljingce_effect");
					return event.cards.some(card => !list.includes(get.suit(card, player)));
				},
				async content(event, trigger, player) {
					const effect = "oljingce_effect";
					player.addTempSkill(effect);
					player.markAuto(
						effect,
						trigger.cards.map(card => get.suit(card, player))
					);
					player.storage[effect].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
					player.addTip(effect, get.translation(effect) + player.getStorage(effect).reduce((str, suit) => str + get.translation(suit), ""));
				},
			},
			effect: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				intro: { content: "当前已使用花色：$" },
				mod: {
					maxHandcard(player, num) {
						return num + player.getStorage("oljingce_effect").length;
					},
				},
			},
		},
	},
	//OL谋张绣
	olsbchoulie: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					return player.countDiscardableCards(player, "he") * get.effect(target, { name: "sha" }, player);
				})
				.forResult();
		},
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			const { targets } = event;
			player.awakenSkill(event.name);
			player.addTempSkill(["olsbchoulie_buff", "olsbchoulie_use"]);
			player.markAuto("olsbchoulie_buff", targets);
		},
		subSkill: {
			buff: {
				audio: "olsbchoulie",
				charlotte: true,
				onremove: true,
				trigger: {
					get player() {
						return lib.phaseName.map(c => `${c}Begin`);
					},
				},
				getIndex(event, player) {
					const storage = player.storage.olsbchoulie_buff;
					const vcard = new lib.element.VCard({ name: "sha" });
					return storage.filter(i => player.canUse(vcard, i, false));
				},
				filter(event, player) {
					return player.hasCard(card => {
						if (get.position(card) === "h" && _status.connectMode) {
							return true;
						}
						return lib.filter.cardDiscardable(card, player);
					}, "he");
				},
				async cost(event, trigger, player) {
					const target = event.indexedData;
					const list = [event.skill, target];
					event.result = await player
						.chooseToDiscard("he")
						.set("prompt", get.prompt2(...list))
						.set("prompt2", `弃置一张牌，视为对${get.translation(target)}使用一张【杀】`)
						.set("ai", card => {
							const player = get.player(),
								target = get.event().getParent().indexedData;
							const vcard = new lib.element.VCard({ name: "sha" });
							return get.effect(target, vcard, player, player) - get.value(card);
						})
						.set("logSkill", list)
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					const target = event.indexedData;
					const vcard = new lib.element.VCard({ name: "sha" });
					if (player.canUse(vcard, target, false)) {
						await player.useCard(vcard, target, false);
					}
				},
			},
			use: {
				charlotte: true,
				trigger: { player: "useCard" },
				filter(event, player) {
					return event.getParent().name == "olsbchoulie_buff";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const storage = player.storage.olsbchoulie_buff;
					for (const target of trigger.targets) {
						if (target == storage[0]) {
							const {
								result: { bool },
							} = await target
								.chooseToDiscard(`仇猎：你可以弃置一张基本牌或武器牌，令${get.translation(trigger.card)}对你无效`, "he")
								.set("filterCard", card => {
									return get.type(card) == "basic" || get.subtypes(card).includes("equip1");
								})
								.set("ai", card => {
									const player = get.player(),
										trigger = get.event().getTrigger();
									return -get.effect(player, trigger.card, trigger.player, player) - get.value(card);
								});
							if (bool) {
								trigger.excluded.add(target);
								game.log(trigger.card, "对", target, "无效");
								await game.delayx();
							}
						}
					}
				},
			},
		},
	},
	olsbzhuijiao: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			const evtx = get.info("dcjianying").getLastUsed(player, event);
			if (!evtx) {
				return false;
			}
			return !player.hasHistory("sourceDamage", evt => evt.card == evtx.card);
		},
		forced: true,
		content() {
			player.draw();
			trigger.baseDamage++;
			player.addTempSkill("olsbzhuijiao_debuff");
			trigger.olsbzhuijiao = true;
		},
		subSkill: {
			debuff: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (!event.olsbzhuijiao) {
						return false;
					}
					return !player.hasHistory("sourceDamage", evt => evt.card == event.card);
				},
				forced: true,
				popup: false,
				content() {
					player.chooseToDiscard("he", true);
				},
			},
		},
	},
	//OL谋赵云
	olsbnilan: {
		audio: 2,
		trigger: { source: "damageSource" },
		filter(event, player) {
			return !event.getParent().name?.startsWith("olsbnilan");
		},
		async cost(event, trigger, player) {
			const { result } = await player
				.chooseButton([
					"请选择一项",
					[
						[
							["discard", "弃置所有手牌"],
							["draw", "摸两张牌"],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					if (button.link == "discard") {
						const player = get.player();
						return player.countCards("h") && !player.hasCard(card => !lib.filter.cardDiscardable(card, player, "olsbnilan"), "h");
					}
					return true;
				})
				.set("ai", button => {
					const player = get.player();
					const { link } = button;
					if (link == "discard") {
						return player.countCards("h") < 4 && game.hasPlayer(current => current != player && get.damageEffect(current, player, player) > 0) && player.countCards("h", "sha");
					}
					if (link == "draw") {
						return 1;
					}
					return 0;
				});
			event.result = {
				bool: result?.bool,
				cost_data: result?.links?.[0],
			};
		},
		choice: {
			async discard(player) {
				const cards = player.getCards("h");
				if (cards.length) {
					await player.discard(cards);
					if (cards.some(card => card.name == "sha")) {
						const { result } = await player.chooseTarget("对一名其他角色造成1点伤害", lib.filter.notMe).set("ai", target => {
							const player = get.player();
							return get.damageEffect(target, player, player);
						});
						if (result?.bool && result?.targets?.length) {
							await result.targets[0].damage();
						}
					}
				}
			},
			async draw(player) {
				await player.draw(2);
			},
		},
		async content(event, trigger, player) {
			const { cost_data } = event;
			player.addSkill("olsbnilan_buff");
			if (cost_data == "discard") {
				player.markAuto("olsbnilan_buff", ["draw"]);
				await lib.skill.olsbnilan.choice.discard(player);
			} else {
				player.markAuto("olsbnilan_buff", ["discard"]);
				await lib.skill.olsbnilan.choice.draw(player);
			}
		},
		subSkill: {
			buff: {
				audio: "olsbnilan",
				charlotte: true,
				onremove: true,
				trigger: { player: "damageEnd" },
				prompt2(event, player) {
					const list = player.getStorage("olsbnilan_buff");
					let str = ``;
					if (list.includes("draw")) {
						str += `你可以摸两张牌`;
					}
					if (list.includes("draw") && list.includes("discard")) {
						str += `且`;
					}
					if (list.includes("discard")) {
						str += `你可以弃置所有手牌，然后若其中有【杀】，你可以对一名其他角色造成1点伤害`;
					}
					return str;
				},
				async content(event, trigger, player) {
					const list = player.getStorage(event.name);
					player.removeSkill(event.name);
					for (const i of list) {
						await lib.skill.olsbnilan.choice[i](player);
					}
				},
			},
		},
	},
	olsbjueya: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			return get.type(name) == "basic" && !player.countCards("h") && !player.getStorage("olsbjueya").includes(name);
		},
		marktext: "崖",
		onremove: true,
		intro: { content: "已以此法使用过$" },
		filter(event, player) {
			if (event.type == "wuxie" || player.countCards("h")) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] != "basic" || player.getStorage("olsbjueya").includes(info[2])) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (info[0] != "basic" || player.getStorage("olsbjueya").includes(info[2])) {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("绝崖", [list, "vcard"], "hidden");
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			backup(links, player) {
				return {
					audio: "olsbjueya",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3], isCard: true },
					async precontent(event, trigger, player) {
						player.markAuto("olsbjueya", event.result.card.name);
					},
				};
			},
			prompt(links, player) {
				return "选择【" + get.translation(links[0][2]) + "】的目标";
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				const name = tag == "respondSha" ? "sha" : "shan";
				return get.info("olsbjueya").hiddenCard(player, name);
			},
			order: 2,
			result: {
				player(player) {
					if (get.event().dying) {
						return get.attitude(player, get.event().dying);
					}
					return 1;
				},
			},
		},
		subSkill: { backup: {} },
	},
	//OL谋张飞
	olsbjingxian: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (!player.countCards("he", card => get.type(card) != "basic")) {
				return false;
			}
			return game.hasPlayer(target => {
				if (target.hasSkill("olsbjingxian_used")) {
					return false;
				}
				return player != target;
			});
		},
		filterTarget(card, player, target) {
			if (target.hasSkill("olsbjingxian_used")) {
				return false;
			}
			return player != target;
		},
		filterCard(card) {
			return get.type(card) != "basic";
		},
		selectCard: [1, 2],
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const { cards, targets } = event;
			const target = targets[0];
			player.give(cards, target);
			if (event.cards.length != 2) {
				const { result } = await target.chooseButton(
					[
						"请选择一项",
						[
							[
								["draw", `你与${get.translation(player)}各摸一张牌`],
								["gain", `令${get.translation(player)}从牌堆中获得一张【杀】`],
							],
							"textbutton",
						],
					],
					true
				);
				for (const i of result.links) {
					if (i == "draw") {
						await game.asyncDraw([player, target]);
					} else if (i == "gain") {
						const card = get.cardPile(function (card) {
							return card.name == "sha";
						});
						if (card) {
							await player.gain(card, "draw");
						} else {
							player.chat("不是哥们，杀呢");
						}
					}
				}
			} else {
				await game.asyncDraw([player, target]);
				const card = get.cardPile(function (card) {
					return card.name == "sha";
				});
				if (card) {
					await player.gain(card, "draw");
				} else {
					player.chat("不是哥们，杀呢");
				}
			}
			target.addTempSkill("olsbjingxian_used");
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	olsbxieyong: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.addSkill(["olsbxieyong_jiu", "olsbxieyong_buff"]);
			player.markAuto("olsbxieyong_jiu", event.targets);
			if (!player.storage.jiu) {
				player.storage.jiu = 0;
			}
			player.storage.jiu += 1;
			game.broadcastAll(function (player) {
				player.addSkill("jiu");
				if (!player.node.jiu && lib.config.jiu_effect) {
					player.node.jiu = ui.create.div(".playerjiu", player.node.avatar);
					player.node.jiu2 = ui.create.div(".playerjiu", player.node.avatar2);
				}
			}, player);
		},
		subSkill: {
			jiu: {
				charlotte: true,
				silent: true,
				trigger: {
					global: ["phaseAfter", "die"],
				},
				filter(event, player) {
					return player.getStorage("olsbxieyong_jiu").includes(event.player);
				},
				async content(event, trigger, player) {
					game.broadcastAll(function (player) {
						player.removeSkill(["olsbxieyong_jiu", "olsbxieyong_buff"]);
						player.removeSkill("jiu");
					}, player);
					game.addVideo("jiuNode", player, false);
				},
				ai: {
					jiuSustain: true,
				},
				onremove: true,
				intro: {
					content: "已选择$",
				},
			},
			buff: {
				charlotte: true,
				trigger: {
					global: "useCardAfter",
				},
				filter(event, player) {
					if (!player.getStorage("olsbxieyong_jiu").includes(event.player)) {
						return false;
					}
					return !event.targets?.includes(event.player);
				},
				async cost(event, trigger, player) {
					const target = trigger.player;
					const next = player.chooseToUse();
					next.set("prompt", `【狭勇】:是否对${get.translation(target)}使用一张【杀】？`);
					next.set("targetx", target);
					next.set("filterCard", function (card) {
						return get.name(card) == "sha";
					});
					next.set("filterTarget", function (card, player, target) {
						const evt = get.event();
						return evt.targetx == target && lib.filter.filterTarget.apply(this, arguments);
					});
					next.set("oncard", () => {
						const evt = get.event();
						const { targets } = evt;
						for (const target of targets) {
							target.addTempSkill("qinggang2");
							target.storage.qinggang2.add(evt.card);
							target.markSkill("qinggang2");
						}
					});
					next.set("addCount", false);
					next.set("chooseonly", true);
					next.set("logSkill", event.name.slice(0, -5));
					event.result = await next.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					const { ResultEvent, logSkill } = event.cost_data;
					event.next.push(ResultEvent);
					if (logSkill) {
						if (typeof logSkill == "string") {
							ResultEvent.player.logSkill(logSkill);
						} else if (Array.isArray(logSkill)) {
							ResultEvent.player.logSkill.call(ResultEvent.player, ...logSkill);
						}
					}
					await ResultEvent;
				},
			},
		},
	},
	//OL界廖化
	oldangxian: {
		audio: 2,
		audioname2: { guansuo: "dangxian_guansuo" },
		trigger: { player: "phaseBegin" },
		forced: true,
		async content(event, trigger, player) {
			player.addSkill(`${event.name}_effect`);
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
		subSkill: {
			effect: {
				mod: {
					targetInRange(card) {
						if ((card.cards ?? []).length === 1) {
							const card2 = card.cards[0];
							if (get.itemtype(card2) === "card" && card2.hasGaintag("oldangxian")) {
								return true;
							}
						}
					},
				},
				charlotte: true,
				audio: "oldangxian",
				audioname2: { guansuo: "dangxian_guansuo" },
				trigger: { player: ["phaseUseBegin", "phaseUseEnd"] },
				filter(event, player, name) {
					if (event._extraPhaseReason !== "oldangxian") {
						return false;
					}
					return name.endsWith("Begin") || (event.oldangxian_draw && !player.hasHistory("sourceDamage", evt => evt.getParent(event.name) === event));
				},
				async cost(event, trigger, player) {
					if (event.triggername.endsWith("Begin")) {
						event.result = await player
							.chooseBool("当先：是否从牌堆或弃牌堆获得一张无距离限制的【杀】？")
							.set("prompt2", '<div class="text center">若如此做，此阶段结束时，若你未于此阶段造成过伤害，则你对自己造成1点伤害</div>')
							.set(
								"choice",
								get.cardPile(card => card.name === "sha" && player.hasUseTarget(card, false))
							)
							.forResult();
					} else {
						event.result = { bool: true };
					}
				},
				async content(event, trigger, player) {
					if (event.triggername.endsWith("Begin")) {
						trigger.set("oldangxian_draw", true);
						const card = get.cardPile({ name: "sha" });
						if (card) {
							await player.gain(card, "draw").gaintag.add("oldangxian");
						}
					} else {
						await player.damage();
					}
				},
			},
		},
	},
	olfuli: {
		limited: true,
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			return event.type === "dying" && player == event.dying;
		},
		skillAnimation: true,
		animationColor: "soil",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const sum = game.countGroup();
			await player.recoverTo(sum);
			await player.drawTo(sum);
			const maxDamage = player.getAllHistory("sourceDamage").reduce((num, evt) => num + evt.num, 0);
			if (maxDamage < sum) {
				await player.turnOver();
			}
		},
		ai: {
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target && player.storage.olfuli != true;
			},
			result: {
				player: 10,
			},
			threaten(player, target) {
				if (!target.storage.olfuli) {
					return 0.9;
				}
			},
		},
	},
	//OL谋黄月英
	olsbbingcai: {
		audio: 2,
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			if (!player.countCards("he", { type: ["trick", "delay"] })) {
				return false;
			}
			return game.getGlobalHistory("everything", evt => evt.name === "useCard" && get.type(evt.card) === "basic").indexOf(event) === 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard("he")
				.set("filterCard", function (card) {
					return get.type2(card) === "trick";
				})
				.set("prompt", get.prompt(event.name.slice(0, -5)))
				.set("prompt2", "你可重铸一张锦囊牌。若重铸牌为" + (get.tag(trigger.card, "damage") ? "" : "非") + "伤害类，则" + get.translation(trigger.card) + "对相同目标再结算一次。")
				.set("ai", card => {
					const eff = get.event("eff");
					if (get.tag(card, "damage") === Boolean(eff[0])) {
						return 6 - get.value(card) + eff[1];
					}
					return 6 - get.value(card);
				})
				.set("eff", [
					Boolean(get.tag(trigger.card, "damage")),
					trigger.targets.reduce((acc, target) => {
						if (trigger.card.name === "tao" && target.getDamagedHp() < 2) {
							return acc;
						}
						return acc + get.effect(target, trigger.card, trigger.player, player);
					}, 0),
				])
				.forResult();
		},
		async content(event, trigger, player) {
			await player.recast(event.cards);
			const card = event.cards[0];
			if (Boolean(get.tag(card, "damage")) === Boolean(get.tag(trigger.card, "damage"))) {
				trigger.effectCount++;
				if (
					(get.mode() !== "identity" || player.identity !== "nei") &&
					trigger.targets.reduce((acc, target) => {
						if (trigger.card.name === "tao" && target.getDamagedHp() < 2) {
							return acc;
						}
						return acc + get.effect(target, trigger.card, trigger.player, player);
					}, 0) > 6
				) {
					player.addExpose(0.16);
				}
			}
		},
	},
	olsblixian: {
		mod: {
			cardEnabled(card, player, result) {
				const evt = get.event();
				if (get.itemtype(card) == "vcard" && Array.isArray(card.cards)) {
					if (card.cards.some(c => c.hasGaintag("olsblixian")) && !["olsblixian_sha", "olsblixian_shan"].includes(evt.skill)) {
						return false;
					}
				}
				if (card.hasGaintag("olsblixian") && !["olsblixian_sha", "olsblixian_shan"].includes(evt.skill)) {
					return false;
				}
			},
		},
		group: ["olsblixian_gain", "olsblixian_sha", "olsblixian_shan"],
		subSkill: {
			gain: {
				audio: "olsblixian",
				trigger: {
					global: "phaseJieshuBegin",
				},
				forced: true,
				filter(event, player) {
					const gain = [];
					game.getGlobalHistory("useCard").forEach(evt => {
						if (get.type2(evt.card) != "trick" || get.position(evt.card) != "d") {
							return false;
						}
						if (!evt.targets || !evt.targets.includes(player)) {
							return false;
						}
						gain.addArray(evt.cards);
					});
					return gain.length;
				},
				async content(event, trigger, player) {
					const gain = [];
					game.getGlobalHistory("useCard").forEach(evt => {
						if (get.type2(evt.card) != "trick" || get.position(evt.card) != "d") {
							return false;
						}
						if (!evt.targets || !evt.targets.includes(player)) {
							return false;
						}
						gain.addArray(evt.cards);
					});
					await player.gain(gain, "draw").gaintag.add("olsblixian");
				},
			},
			sha: {
				audio: "olsblixian",
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card) {
					return card.hasGaintag("olsblixian");
				},
				viewAs: {
					name: "sha",
				},
				viewAsFilter(player) {
					if (!player.countCards("hs", lib.skill["olsblixian_sha"].filterCard)) {
						return false;
					}
				},
				position: "hs",
				prompt: "将一张“理贤”牌当杀使用或打出",
				check() {
					return 1;
				},
				ai: {
					respondSha: true,
					skillTagFilter(player) {
						if (!player.countCards("hs", lib.skill["olsblixian_sha"].filterCard)) {
							return false;
						}
					},
					order() {
						return get.order({ name: "sha" }) - 0.1;
					},
				},
			},
			shan: {
				audio: "olsblixian",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard(card) {
					return card.hasGaintag("olsblixian");
				},
				viewAs: {
					name: "shan",
				},
				prompt: "将一张“理贤”牌当闪打出",
				check() {
					return 1;
				},
				viewAsFilter(player) {
					if (!player.countCards("hs", lib.skill["olsblixian_sha"].filterCard)) {
						return false;
					}
				},
				position: "hs",
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						if (!player.countCards("hs", lib.skill["olsblixian_sha"].filterCard)) {
							return false;
						}
					},
				},
			},
		},
	},
	//OL谋沮授
	olsbguliang: {
		audio: 2,
		trigger: { target: "useCardToPlayer" },
		filter(event, player) {
			return event.player != player;
		},
		usable: 1,
		check(event, player) {
			return get.effect(player, event.card, event.player, player) < 0;
		},
		async content(event, trigger, player) {
			trigger.getParent().excluded.add(player);
			player.addTempSkill("olsbguliang_debuff");
			player.markAuto("olsbguliang_debuff", trigger.player);
		},
		subSkill: {
			debuff: {
				charlotte: true,
				onremove: true,
				trigger: { target: "useCardToPlayer" },
				silent: true,
				filter(event, player) {
					return player.getStorage("olsbguliang_debuff").includes(event.player);
				},
				async content(event, trigger, player) {
					trigger.getParent().directHit.add(player);
				},
			},
		},
	},
	olsbxutu: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		marktext: "资",
		mark: true,
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const cards = get.cards(3);
			const next = player.addToExpansion(cards, player, "giveAuto");
			next.gaintag.add(event.name);
			await next;
		},
		group: ["olsbxutu_exchange"],
		subSkill: {
			exchange: {
				audio: "olsbxutu",
				trigger: { global: "phaseJieshuBegin" },
				filter(event, player) {
					return get.discarded().someInD("d") && player.countExpansions("olsbxutu");
				},
				async cost(event, trigger, player) {
					const cards = player.getExpansions("olsbxutu");
					const discardPile = get.discarded().filterInD("d");
					const dialog = ["徐图：选择要交换的牌", '<div class="text center">“资”</div>', cards, '<div class="text center">弃牌堆</div>', discardPile];
					const { result } = await player
						.chooseButton(dialog, 2)
						.set("filterButton", button => {
							if (ui.selected.buttons.length) {
								return get.position(button.link) != get.position(ui.selected.buttons[0].link);
							}
							return true;
						})
						.set("cards1", cards)
						.set("cards2", discardPile)
						.set("ai", button => {
							const player = get.player(),
								{ link } = button;
							let cards1 = get.event().cards1.slice(0),
								cards2 = get.event().cards2.slice(0);
							if (!ui.selected.buttons.length) {
								if (!cards2.includes(link)) {
									return 0;
								}
								cards2.remove(link);
								const suits = cards1.filter(card => get.suit(card) == get.suit(link));
								const numbers = cards1.filter(card => get.number(card) == get.number(link));
								if (suits.length > 2 || numbers.length > 2) {
									return 20 + get.value(link);
								}
								return get.value(link);
							}
							cards1.push(ui.selected.buttons[0].link);
							cards1.remove(link);
							const bool = cards1.every(card => get.suit(card) == get.suit(cards1[0])) || cards1.every(card => get.number(card) == get.number(cards1[0]));
							if (bool) {
								return 20 - get.value(link);
							}
							return get.value(ui.selected.buttons[0].link) - get.value(link);
						});
					event.result = {
						bool: result.bool,
						cost_data: result.links,
					};
				},
				async content(event, trigger, player) {
					const { cost_data } = event;
					const cards = cost_data;
					if (get.position(cards[0]) != "x") {
						cards.reverse();
					}
					const next = player.addToExpansion(cards[1], player, "giveAuto");
					next.gaintag.add("olsbxutu");
					await next;
					await player.loseToDiscardpile(cards[0]);
					const expansion = player.getExpansions("olsbxutu");
					if (!expansion.length) {
						return;
					}
					const bool = expansion.every(card => get.suit(card) == get.suit(expansion[0])) || expansion.every(card => get.number(card) == get.number(expansion[0]));
					if (!bool) {
						return;
					}
					const { result } = await player.chooseTarget(true).set("prompt", `将${get.translation(expansion)}交给一名角色`);
					if (result?.bool && result?.targets?.length) {
						await result.targets[0].gain(expansion, "draw");
						const num = 3 - player.countExpansions("olsbxutu");
						if (num > 0) {
							const next = player.addToExpansion(get.cards(num), player, "giveAuto");
							next.gaintag.add("olsbxutu");
							await next;
						}
					}
				},
			},
		},
	},
	//OL谋公孙
	olsbjiaodi: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			return event.card.name === "sha" && event.isFirstTarget && event.targets.length === 1;
		},
		forced: true,
		logTarget: "target",
		async content(event, trigger, player) {
			const { target } = trigger,
				num = target.getAttackRange() - player.getAttackRange();
			if (num <= 0) {
				trigger.getParent().baseDamage++;
				await player.gainPlayerCard(target, "h", true);
			}
			if (num >= 0) {
				await player.discardPlayerCard(target, "hej", true);
				const evt = trigger.getParent();
				if (
					game.hasPlayer(target => {
						return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
					})
				) {
					const { result } = await player
						.chooseTarget(
							(card, player, target) => {
								const evt = get.event().getTrigger().getParent();
								return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
							},
							get.translation(event.name) + "：为" + get.translation(trigger.card) + "额外指定一个目标",
							true
						)
						.set("ai", target => {
							const player = get.player(),
								evt = get.event().getTrigger().getParent();
							return get.effect(target, evt.card, evt.player, player);
						});
					if (result?.bool && result.targets?.length) {
						trigger.targets.addArray(result.targets);
						trigger.getParent().triggeredTargets1.addArray(result.targets);
						game.log(result.targets, "成为了", trigger.card, "的额外目标");
					}
				}
			}
		},
		mod: { attackRange: player => player.getHp() },
	},
	olsbbaojing: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => target !== player);
		},
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			let index = await player
				.chooseControl(" +1 ", "-1")
				.set("ai", () => {
					const player = get.player(),
						{ target } = get.event().getParent();
					return get.attitude(player, target) > 0 ? 0 : 1;
				})
				.set("prompt", "令" + get.translation(target) + "的攻击范围+1或-1")
				.forResult("index");
			if (typeof index === "number") {
				index = Math.sign(0.5 - index);
				player.popup((index > 0 ? "+" : "") + index);
				target.addSkill("olsbbaojing_effect");
				if (!target.storage["olsbbaojing_effect"][player.playerid]) {
					target.storage["olsbbaojing_effect"][player.playerid] = 0;
				}
				target.storage["olsbbaojing_effect"][player.playerid] += index;
				target.markSkill("olsbbaojing_effect");
			}
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (get.attitude(player, target) < 0) {
						return 1 / (target.getAttackRange() + 1);
					}
					return target.getAttackRange();
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				init: (player, skill) => (player.storage[skill] = player.storage[skill] || {}),
				onremove: true,
				intro: {
					markcount(storage = {}) {
						const num = Object.keys(storage).reduce((sum, i) => sum + storage[i], 0);
						if (!num) {
							return num;
						}
						return (num > 0 ? "+" : "") + num.toString();
					},
					content(storage = {}) {
						const num = Object.keys(storage).reduce((sum, i) => sum + storage[i], 0);
						if (!num) {
							return "攻击范围无变化";
						}
						return "攻击范围" + (num > 0 ? "+" : "") + num;
					},
				},
				mod: {
					attackRange(player, num) {
						const storage = player.storage["olsbbaojing_effect"] || {};
						const numx = Object.keys(storage).reduce((sum, i) => sum + storage[i], 0);
						if (!numx) {
							return;
						}
						const sum = num + numx;
						if (numx > 0 || sum > 1) {
							return sum;
						}
					},
				},
				trigger: { global: "phaseUseBegin" },
				filter(event, player) {
					return player.storage?.["olsbbaojing_effect"]?.[event.player.playerid];
				},
				forced: true,
				popup: false,
				content() {
					const target = trigger.player;
					delete player.storage[event.name][target.playerid];
					player[Object.keys(player.storage[event.name]).length ? "markSkill" : "removeSkill"](event.name);
				},
			},
		},
	},
	//谋邓艾
	olsbjigu: {
		audio: 2,
		trigger: { global: ["cardsDiscardAfter", "phaseBegin"] },
		filter(event, player) {
			const num1 = player.maxHp,
				num2 = player.countExpansions("olsbjigu");
			if (event.name == "cardsDiscard") {
				if (num2 >= num1) {
					return false;
				}
				if (!event.cards.filterInD("d").some(card => get.suit(card) != "heart")) {
					return false;
				}
				const evtx = event.getParent();
				if (evtx.name !== "orderingDiscard") {
					return true;
				}
				const evt2 = evtx.relatedEvent || evtx.getParent();
				return evt2.name == "useCard" && evt2.player != event.getParent("phaseUse")?.player;
			}
			return event.player.maxHp == num1 && num2 && player.countCards("h");
		},
		locked: true,
		async cost(event, trigger, player) {
			if (trigger.name == "cardsDiscard") {
				event.result = {
					bool: true,
				};
			} else {
				const next = player.chooseToMove("积谷：是否交换“谷”和手牌？");
				next.set("list", [
					[get.translation(player) + "（你）的“谷”", player.getExpansions("olsbjigu")],
					["手牌区", player.getCards("h")],
				]);
				next.set("filterMove", (from, to) => {
					return typeof to != "number";
				});
				next.set("processAI", list => {
					let player = get.player(),
						cards = list[0][1].concat(list[1][1]).sort((a, b) => get.useful(a) - get.useful(b)),
						cards2 = cards.splice(0, player.getExpansions("olsbjigu").length);
					return [cards2, cards];
				});
				const {
					result: { bool, moved },
				} = await next;
				event.result = {
					bool: bool,
					cost_data: moved,
				};
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "cardsDiscard") {
				const cards = trigger.cards.filter(card => get.position(card, true) == "d" && get.suit(card) != "heart");
				const next = player.addToExpansion(cards, "gain2");
				next.gaintag.add(event.name);
				await next;
			} else {
				const { cost_data: moved } = event;
				const pushs = moved[0],
					gains = moved[1];
				pushs.removeArray(player.getExpansions(event.name));
				gains.removeArray(player.getCards("h"));
				if (!pushs.length || pushs.length != gains.length) {
					return;
				}
				const next = player.addToExpansion(pushs);
				next.gaintag.add(event.name);
				await next;
				await player.gain(gains, "draw");
			}
		},
		marktext: "谷",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
	},
	olsbjiewan: {
		audio: 2,
		trigger: { global: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		filter(event, player) {
			const num1 = player.maxHp,
				num2 = player.countExpansions("olsbjigu");
			if (event.name == "phaseZhunbei") {
				if (!num1 && num2 < 1) {
					return false;
				}
				return player.countCards("hs", card => player.hasUseTarget(get.autoViewAs({ name: "shunshou" }, [card]), false, false));
			}
			return player.countCards("h") == num2 && !player.isMaxMaxHp(true);
		},
		async cost(event, trigger, player) {
			if (trigger.name == "phaseJieshu") {
				event.result = {
					bool: true,
				};
			} else {
				const next = player.chooseButton([
					"解腕：是否选择一项执行？",
					[
						[
							["lose", "减少1点体力上限"],
							["discard", "移去两张“谷”"],
						],
						"textbutton",
					],
				]);
				next.set("filterButton", button => {
					const { link } = button,
						player = get.player();
					return (link == "lose" && player.maxHp > 0) || (link == "discard" && player.countExpansions("olsbjigu") > 1);
				});
				next.set("ai", button => {
					const { link } = button,
						player = get.player();
					if (player.getUseValue({ name: "shunshou" } <= 0)) {
						return 0;
					}
					let num1 = player.maxHp,
						num2 = player.countExpansions("olsbjigu"),
						num3 = player.countCards("h");
					if (num3 == num2 - 1 && link == "discard") {
						return 3;
					}
					if (
						(num3 == num2 + 1 || player.maxHp > 3) &&
						!game.hasPlayer(current => {
							if (player == current) {
								return false;
							}
							return current.maxHp <= num1 - 1 && num1 - 1 < 3;
						}) &&
						link == "lose"
					) {
						return 2;
					}
					return 0;
				});
				const {
					result: { bool, links },
				} = await next;
				event.result = {
					bool: bool,
					cost_data: links,
				};
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseJieshu") {
				await player.gainMaxHp();
			} else {
				const { cost_data: links } = event;
				if (links.includes("lose")) {
					await player.loseMaxHp();
				} else {
					const cards =
						player.countExpansions("olsbjigu") <= 2
							? player.getExpansions("olsbjigu")
							: await player
									.chooseButton([`解腕：移去两张“谷”`, player.getExpansions("olsbjigu")], 2, true)
									.set("ai", button => 6 - get.value(button.link))
									.forResultLinks();
					if (cards?.length) {
						await player.loseToDiscardpile(cards);
					}
				}
				if (!player.countCards("hs", card => player.hasUseTarget(get.autoViewAs({ name: "shunshou" }, [card]), false, false))) {
					return;
				}
				const next = player.chooseToUse();
				next.set("openskilldialog", `###${get.prompt(event.name)}###将一张手牌当无距离限制的【顺手牵羊】使用`);
				next.set("norestore", true);
				next.set("_backupevent", `${event.name}_backup`);
				next.set("forced", true);
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.set("targetRequired", true);
				next.set("complexSelect", true);
				next.set("filterTarget", function (card, player, target) {
					return lib.filter.targetEnabled.apply(this, arguments);
				});
				next.backup(`${event.name}_backup`);
				await next;
			}
		},
		subSkill: {
			backup: {
				audio: "olsbjiewan",
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: { name: "shunshou" },
				position: "hs",
				ai1(card) {
					const player = get.player();
					if (player.hasSkill("olsbjigu") && get.suit(card) != "heart") {
						return 10;
					}
					return 6 - get.value(card);
				},
			},
		},
	},
	//谋董卓
	olguanbian: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "roundEnd"],
			player: ["enterGame", "olxiongniAfter", "olfengshangAfter"],
		},
		filter(event, player, name) {
			if (name == "roundEnd") {
				return game.roundNumber == 1;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "roundEnd" || ["olxiongni", "olfengshang"].includes(trigger.name)) {
				await player.removeSkills(event.name);
			} else {
				player.addMark(event.name, game.players.length + game.dead.length, false);
			}
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("olguanbian");
			},
			globalFrom(from, to, current) {
				return current + from.countMark("olguanbian");
			},
			globalTo(from, to, current) {
				return current + to.countMark("olguanbian");
			},
		},
		intro: {
			content: "<li>手牌上限+#<br><li>计算与其他角色的距离+#<br><li>其他角色计算与你的距离+#",
		},
	},
	olxiongni: {
		audio: 6,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			if (!game.hasPlayer(target => target != player)) {
				return false;
			}
			return player.countCards("he", card => _status.connectMode || lib.filter.cardDiscardable(card, player));
		},
		async cost(event, trigger, player) {
			const skillName = event.name.slice(0, -5);
			event.result = await player
				.chooseToDiscard(get.prompt2(skillName), "he")
				.set("ai", card => {
					const player = get.player();
					if (!game.hasPlayer(target => player != target && get.damageEffect(target, player, player) > 0)) {
						return 0;
					}
					if (get.suit(card, player) == "heart") {
						return 8 - get.value(card);
					}
					return 7.5 - get.value(card);
				})
				.set("logSkill", [skillName, get.info(skillName).logTarget(trigger, player)])
				.forResult();
		},
		popup: false,
		logTarget: (event, player) => game.filterPlayer(target => target != player).sortBySeat(),
		async content(event, trigger, player) {
			player.changeSkin({ characterName: "ol_sb_dongzhuo" }, "ol_sb_dongzhuo_shadow1");
			const suit = get.suit(event.cards[0]);
			for (const target of event.targets) {
				const bool = await target
					.chooseToDiscard(`弃置一张${get.translation(suit)}牌，否则${get.translation(player)}对你造成1点伤害`, "he", (card, player) => {
						return get.event("suit") == get.suit(card);
					})
					.set("ai", card => {
						const player = get.player(),
							target = get.event().getParent().player;
						if (get.damageEffect(player, target, player) > 0) {
							return 0;
						}
						return 7.5 - get.value(card);
					})
					.set("suit", suit)
					.forResultBool();
				if (!bool) {
					await target.damage();
				}
			}
		},
	},
	olfengshang: {
		audio: 6,
		getCards(player) {
			const cards = [];
			game.checkGlobalHistory("cardMove", evt => {
				if (evt.name != "cardsDiscard" && (evt.name != "lose" || evt.position != ui.discardPile)) {
					return;
				}
				cards.addArray(evt.cards.filter(card => !player.getStorage("olfengshang_clear").includes(get.suit(card))));
			});
			return cards.filterInD("d");
		},
		enable: "phaseUse",
		trigger: { global: "dying" },
		filter(event, player) {
			const cards = event.name == "chooseToUse" ? event.olfengshang_cards || [] : get.info("olfengshang").getCards(player);
			if (
				!cards
					.map(i => get.suit(i))
					.unique()
					.some(suit => cards.filter(card => get.suit(card) == suit).length > 1)
			) {
				return false;
			}
			return !player.hasSkill("olfengshang_" + (event.name === "chooseToUse" ? "used" : "round"), null, null, false);
		},
		onChooseToUse(event) {
			if (!game.online && !event.olfengshang_cards) {
				event.set("olfengshang_cards", get.info("olfengshang").getCards(event.player));
			}
		},
		prompt: event => (event.name === "chooseToUse" ? get.info("olfengshang").prompt2() : get.prompt("olfengshang")),
		prompt2: () => lib.translate["olfengshang_info"].split("你可以")[1],
		async content(event, trigger, player) {
			player.addTempSkill(event.name + (trigger ? "_round" : "_used"), trigger ? "phaseAfter" : "phaseUseAfter");
			if (_status.connectMode) {
				game.broadcastAll(() => (_status.noclearcountdown = true));
			}
			player.changeSkin({ characterName: "ol_sb_dongzhuo" }, "ol_sb_dongzhuo_shadow2");
			const cards = !trigger ? event.getParent(2).olfengshang_cards : get.info(event.name).getCards(player);
			const result = await player
				.chooseButtonTarget({
					createDialog: ["封赏：选择两张牌依次分配给两名角色", cards],
					forced: true,
					selectButton: 2,
					cardx: cards,
					filterButton(button) {
						const { link } = button;
						if (!ui.selected.buttons?.length) {
							return get.event("cardx").filter(card => get.suit(card) == get.suit(link)).length > 1;
						}
						return get.suit(link) == get.suit(ui.selected.buttons[0].link);
					},
					ai1(button) {
						return get.buttonValue(button);
					},
					complexSelect: true,
					filterTarget: true,
					selectTarget: 2,
					ai2(target) {
						const player = get.player(),
							att = get.attitude(player, target);
						let button = ui.selected.buttons[ui.selected.targets.length];
						if (!button?.link) {
							return 0;
						}
						if (get.value(button.link, player, "raw") < 0) {
							return Math.max(0.01, 100 - att);
						} else if (att > 0) {
							if (player.getUseValue({ name: "jiu" }) && player != target) {
								return 10;
							}
							return Math.max(0.1, att / Math.sqrt(1 + target.countCards("h")));
						} else {
							return Math.max(0.01, (100 + att) / 200);
						}
					},
				})
				.forResult();
			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			player.addTempSkill("olfengshang_clear", "roundStart");
			player.markAuto("olfengshang_clear", [get.suit(result.links[0])]);
			player.storage["olfengshang_clear"].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
			player.addTip("olfengshang_clear", ["olfengshang", ...player.getStorage("olfengshang_clear")].map(i => get.translation(i)).join(""));
			const gain_list = [];
			for (let i = 0; i < result.links.length; i++) {
				const source = result.targets[i];
				player.line(source, "green");
				game.log(source, "获得了", result.links[i]);
				gain_list.push([source, result.links[i]]);
			}
			await game
				.loseAsync({
					gain_list,
					giver: player,
					animate: "gain2",
				})
				.setContent("gaincardMultiple");
			await game.delayx();
			if (!player.hasHistory("gain", evt => evt.getParent(2) == event) && player.hasUseTarget({ name: "jiu", isCard: true }, true, false)) {
				await player.chooseUseTarget({ name: "jiu", isCard: true }, true, false);
			}
		},
		ai: {
			order: 7,
			result: { player: 1 },
		},
		subSkill: {
			used: { charlotte: true },
			round: { charlotte: true },
			clear: {
				marktext: "赏",
				charlotte: true,
				onremove(player, skill) {
					player.removeTip(skill);
					delete player.storage[skill];
				},
				intro: { content: "本轮已赏赐过$花色的牌" },
			},
		},
	},
	olzhibin: {
		audio: 6,
		getNum(player) {
			let num = 0;
			game.countPlayer2(current => {
				if (current != player && current.group == "qun") {
					num += current.getAllHistory("useCard", evt => get.color(evt.card) == "black").length;
				}
			});
			return num;
		},
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			const num = get.info("olzhibin").getNum(player);
			return get.info("olzhibin").filterx(player, num) || get.info("olzhibin").filtery(player, num) || get.info("olzhibin").filterz(player, num);
		},
		filterx(player, num) {
			return num >= 3 && !game.getAllGlobalHistory("everything", evt => evt.name == "gainMaxHp" && evt.player == player && evt.getParent().name == "olzhibin").length;
		},
		filtery(player, num) {
			return num >= 6 && !player.hasSkill("dcfencheng", null, null, false) && !game.getAllGlobalHistory("everything", evt => evt.name == "changeSkills" && evt.player == player && evt.getParent().name == "olzhibin" && evt.addSkill.includes("dcfencheng")).length;
		},
		filterz(player, num) {
			return num >= 9 && !player.hasSkill("benghuai", null, null, false) && !game.getAllGlobalHistory("everything", evt => evt.name == "changeSkills" && evt.player == player && evt.getParent().name == "olzhibin" && evt.addSkill.includes("benghuai")).length;
		},
		zhuSkill: true,
		forced: true,
		async content(event, trigger, player) {
			const skillName = event.name,
				num = get.info(skillName).getNum(player);
			if (get.info(skillName).filterx(player, num)) {
				await player.gainMaxHp();
				await player.recover();
			}
			if (get.info(skillName).filtery(player, num)) {
				await player.addSkills("dcfencheng");
			}
			if (get.info(skillName).filterz(player, num)) {
				await player.addSkills("benghuai");
			}
		},
		derivation: ["dcfencheng", "benghuai"],
	},
	//谋华雄
	olsbbojue: {
		audio: 2,
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		usable: 2,
		async content(event, trigger, player) {
			const target = event.target,
				targets = [player, target],
				total = player.countCards("h") + target.countCards("h");
			let map = {},
				locals = targets.slice();
			let humans = targets.filter(current => current === game.me || current.isOnline());
			locals.removeArray(humans);
			const eventId = get.id();
			const send = (current, targets, eventId) => {
				lib.skill.olsbbojue.chooseCard(current, targets, eventId);
				game.resume();
			};
			event._global_waiting = true;
			let time = 10000;
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			targets.forEach(current => current.showTimer(time));
			if (humans.length > 0) {
				const solve = function (resolve, reject) {
					return function (result, player) {
						if (result?.bool && result.cards?.length) {
							map[player.playerid] = result.cards[0];
						}
						resolve();
					};
				};
				await Promise.all(
					humans.map(current => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, current, targets, eventId);
								current.wait(solve(resolve, reject));
							} else {
								const next = lib.skill.olsbbojue.chooseCard(current, targets, eventId);
								const solver = solve(resolve, reject);
								if (_status.connectMode) {
									game.me.wait(solver);
								}
								return next.forResult().then(result => {
									if (_status.connectMode) {
										game.me.unwait(result, current);
									} else {
										solver(result, current);
									}
								});
							}
						});
					})
				).catch(() => {});
				game.broadcastAll("cancel", eventId);
			}
			if (locals.length > 0) {
				for (const current of locals) {
					const result = await lib.skill.olsbbojue.chooseCard(current, targets).forResult();
					if (result?.bool && result.cards?.length) {
						map[current.playerid] = result.cards[0];
					}
				}
			}
			delete event._global_waiting;
			for (const i of targets) {
				i.hideTimer();
				i.popup(map[i.playerid] ? "弃牌" : "摸牌");
			}
			switch (Object.keys(map).length) {
				case 0:
					await player.draw("nodelay");
					await target.draw();
					break;
				case 2:
					await game
						.loseAsync({
							lose_list: [
								[player, [map[player.playerid]]],
								[target, [map[target.playerid]]],
							],
						})
						.setContent("discardMultiple");
					break;
				default:
					for (const current of [player, target]) {
						if (map[current.playerid]) {
							await current.discard([map[current.playerid]]);
						} else {
							await current.draw();
						}
					}
					break;
			}
			await game.delay(0.5);
			switch (Math.abs(total - player.countCards("h") - target.countCards("h"))) {
				case 0:
					for (const current of [player, target]) {
						const aim = current === player ? target : player;
						if (current.isIn()) {
							current.line(aim);
							await current.discardPlayerCard(aim, "he", true);
						}
					}
					break;
				case 2:
					for (const current of [player, target]) {
						const aim = current === player ? target : player;
						const sha = new lib.element.VCard({ name: "sha" });
						if (current.isIn() && current.canUse(sha, aim, false)) {
							current.line(aim);
							await current.useCard(sha, aim, false, "noai");
						}
					}
					break;
			}
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					return get.effect(player, { name: "guohe" }, target, player) + get.effect(player, { name: "sha" }, target, player);
				},
				target(player, target) {
					return get.effect(target, { name: "guohe" }, player, target) + get.effect(target, { name: "sha" }, player, target);
				},
			},
		},
		chooseCard(player, targets, eventId) {
			const str = get.translation(targets[0] == player ? targets[1] : targets[0]);
			return player
				.chooseCard("he", (card, player) => {
					return lib.filter.cardDiscardable(card, player, "olsbbojue");
				})
				.set("prompt", "搏决：弃置一张牌，或点击“取消”摸一张牌")
				.set("prompt2", "若你与" + str + "的手牌数之和的变化值为：0，你与其依次弃置对方一张牌；2，你与其依次视为对对方使用一张【杀】")
				.set("ai", card => {
					return 0;
				})
				.set("id", eventId)
				.set("_global_waiting", true);
		},
	},
	olsbyangwei: {
		audio: 2,
		trigger: { player: "gainAfter" },
		filter(event, player) {
			if (event.getParent().name !== "draw" || event.getParent("phaseDraw").player === player) {
				return false;
			}
			let history = player.getHistory(
				"gain",
				evt => {
					return evt.getParent().name === "draw" && evt.getParent("phaseDraw").player !== player;
				},
				event
			);
			history = history
				.slice()
				.map(evt => evt.cards)
				.flat();
			return history.length >= 2 && event.cards.includes(history[1]);
		},
		forced: true,
		usable: 1,
		content() {
			player.addSkill("olsbyangwei_attack");
			player.addMark("olsbyangwei_attack", 1, false);
		},
		group: "olsbyangwei_discard",
		subSkill: {
			discard: {
				audio: "olsbyangwei",
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (player.countSkill("olsbyangwei_discard")) {
						return false;
					}
					if (event.type != "discard" || event.getlx === false || event.getParent("phaseDiscard").player === player) {
						return false;
					}
					if (!event.getl(player)?.cards2?.length) {
						return false;
					}
					let history = game.getGlobalHistory(
						"everything",
						evt => {
							if (evt.name !== "loseAsync" && (event.name !== "lose" || evt.player !== player)) {
								return false;
							}
							if (evt.type != "discard" || evt.getlx === false || evt.getParent("phaseDiscard").player === player) {
								return false;
							}
							return evt.getl(player)?.cards2?.length > 0;
						},
						event
					);
					history = history
						.slice()
						.map(evt => evt.getl(player).cards2)
						.flat();
					return history.length >= 2 && event.getl(player).cards2.includes(history[1]);
				},
				forced: true,
				usable: 1,
				content() {
					player.addSkill("olsbyangwei_defend");
					player.addMark("olsbyangwei_defend", 1, false);
				},
			},
			attack: {
				audio: "olsbyangwei",
				charlotte: true,
				onremove: true,
				trigger: { source: "damageBegin1" },
				forced: true,
				content() {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				markimage: "image/card/pss_stone.png",
				intro: {
					name: "扬威 - 增伤",
					content: "下次造成的伤害+#",
				},
				ai: {
					damageBonus: true,
					effect: {
						player(card, player, target) {
							if (get.tag(card, "damage")) {
								return [1, 0, 2, 0];
							}
						},
					},
				},
			},
			defend: {
				audio: "olsbyangwei",
				charlotte: true,
				onremove: true,
				trigger: { player: "damageBegin2" },
				forced: true,
				content() {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				markimage: "image/card/pss_paper.png",
				intro: {
					name: "扬威 - 受伤",
					content: "下次受到的伤害+#",
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								return 2;
							}
						},
					},
				},
			},
		},
	},
	//界曹植
	oljiushi: {
		audio: 2,
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			if (!player.isTurnedOver()) {
				return false;
			}
			return event.player.hasHistory("lose", function (evt) {
				if (evt.getParent() != event) {
					return false;
				}
				for (var i in evt.gaintag_map) {
					if (evt.gaintag_map[i].includes("reluoying")) {
						return true;
					}
				}
				return false;
			});
		},
		async content(event, trigger, player) {
			trigger.directHit.addArray(game.players);
		},
		forced: true,
		locked: false,
		mod: {
			targetInRange(card, player, target) {
				if (!player.isTurnedOver()) {
					return;
				}
				if (!card.cards) {
					return;
				}
				for (var i of card.cards) {
					if (i.hasGaintag("reluoying")) {
						return true;
					}
				}
			},
		},
		init(player) {
			player.addSkill("oljiushi_gain");
		},
		onremove(player) {
			player.removeSkill("oljiushi_gain");
		},
		group: ["oljiushi_use", "oljiushi_damage"],
		subSkill: {
			gain: {
				audio: "oljiushi",
				trigger: {
					player: ["gainAfter", "phaseEnd"],
				},
				onremove: true,
				filter(event, player) {
					if (event.name == "phase") {
						return true;
					}
					return event.getParent().name.indexOf("reluoying") != -1;
				},
				charlotte: true,
				async cost(event, trigger, player) {
					event.result = { bool: false };
					if (trigger.name != "phase") {
						player.addGaintag(trigger.cards, "reluoying");
						let bool = player.isTurnedOver() && player != _status.currentPhase && player.hasSkill("oljiushi", null, false);
						player.markAuto("oljiushi_gain", trigger.cards);
						if (bool && player.getStorage("oljiushi_gain").length >= player.maxHp) {
							const result = await player.chooseBool("是否发动【酒诗】，将武将牌翻面？").forResult();
							event.result = result;
						}
					} else {
						player.unmarkAuto("oljiushi_gain", player.getStorage("oljiushi_gain"));
					}
				},
				async content(event, trigger, player) {
					await player.turnOver();
				},
			},
			use: {
				audio: "oljiushi",
				enable: "chooseToUse",
				hiddenCard(player, name) {
					if (name == "jiu") {
						return !player.isTurnedOver();
					}
					return false;
				},
				filter(event, player) {
					if (player.isTurnedOver()) {
						return false;
					}
					return event.filterCard({ name: "jiu", isCard: true }, player, event);
				},
				async content(event, trigger, player) {
					if (_status.event.getParent(2).type == "dying") {
						event.dying = player;
						event.type = "dying";
					}
					await player.turnOver();
					await player.useCard({ name: "jiu", isCard: true }, player);
				},
				ai: {
					save: true,
					skillTagFilter(player, tag, arg) {
						return !player.isTurnedOver() && _status.event?.dying == player;
					},
					order: 5,
					result: {
						player(player) {
							if (_status.event.parent.name == "phaseUse") {
								if (player.countCards("h", "jiu") > 0) {
									return 0;
								}
								if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) {
									return 0;
								}
								if (!player.countCards("h", "sha")) {
									return 0;
								}
								var targets = [];
								var target;
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (get.attitude(player, players[i]) < 0) {
										if (player.canUse("sha", players[i], true, true)) {
											targets.push(players[i]);
										}
									}
								}
								if (targets.length) {
									target = targets[0];
								} else {
									return 0;
								}
								var num = get.effect(target, { name: "sha" }, player, player);
								for (var i = 1; i < targets.length; i++) {
									var num2 = get.effect(targets[i], { name: "sha" }, player, player);
									if (num2 > num) {
										target = targets[i];
										num = num2;
									}
								}
								if (num <= 0) {
									return 0;
								}
								var e2 = target.getEquip(2);
								if (e2) {
									if (e2.name == "tengjia") {
										if (
											!player.countCards("h", {
												name: "sha",
												nature: "fire",
											}) &&
											!player.getEquip("zhuque")
										) {
											return 0;
										}
									}
									if (e2.name == "renwang") {
										if (!player.countCards("h", { name: "sha", color: "red" })) {
											return 0;
										}
									}
									if (e2.name == "baiyin") {
										return 0;
									}
								}
								if (player.getEquip("guanshi") && player.countCards("he") > 2) {
									return 1;
								}
								return target.countCards("h") > 3 ? 0 : 1;
							}
							if (player == _status.event.dying || player.isTurnedOver()) {
								return 3;
							}
						},
					},
					effect: {
						target(card, player, target) {
							if (target.isTurnedOver()) {
								if (get.tag(card, "damage")) {
									if (player.hasSkillTag("jueqing", false, target)) {
										return [1, -2];
									}
									if (target.hp == 1) {
										return;
									}
									return [1, target.countCards("h") / 2];
								}
							}
						},
					},
				},
			},
			damage: {
				audio: "oljiushi",
				trigger: { player: "damageEnd" },
				check(event, player) {
					return player.isTurnedOver();
				},
				prompt: "是否发动【酒诗】，将武将牌翻面？",
				filter(event, player) {
					if (event.checkJiushi) {
						return true;
					}
					return false;
				},
				content() {
					player.turnOver();
				},
			},
		},
	},
	//谋袁术
	olsbjinming: {
		audio: 2,
		trigger: {
			player: "phaseBegin",
		},
		init(player, skill) {
			player.storage[skill] = [1, 2, 3, 4];
		},
		onremove: true,
		filter(event, player) {
			return player.getStorage("olsbjinming").length;
		},
		async cost(event, trigger, player) {
			let choiceList = ["1.回复过1点体力", "2.弃置过两张牌", "3.使用过三种类型的牌", "4.造成过4点伤害"];
			for (let i = 0; i < choiceList.length; i++) {
				if (!player.getStorage("olsbjinming").includes(i + 1)) {
					choiceList[i] = `<span style="text-decoration: line-through;">${choiceList[i]}</span>`;
				}
			}
			const result = (event.result = await player
				.chooseButton([get.prompt2(event.skill), [choiceList.slice(0, 2), "tdnodes"], [choiceList.slice(2, 4), "tdnodes"]])
				.set("filterButton", button => {
					const player = get.player();
					return player.getStorage("olsbjinming").includes(parseInt(button.link.slice(0, 1)));
				})
				.set("ai", button => parseInt(button.link.slice(0, 1)))
				.forResult());
			if (result?.links?.length) {
				event.result.cost_data = result.links[0];
			}
		},
		async content(event, trigger, player) {
			const choice = event.cost_data;
			player.addSkill("olsbjinming_used");
			player.addTempSkill("olsbjinming_target");
			player.storage.olsbjinming_used = player.storage.olsbjinming_target = choice;
			player.markSkill("olsbjinming_used");
			player.markSkill("olsbjinming_target");
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeSkill("olsbjinming_target");
				},
				marktext: "玺",
				intro: {
					name: "玉玺",
					markcount(storage, player) {
						if (!storage) {
							return null;
						}
						return parseInt(storage.slice(0, 1));
					},
					content(storage, player) {
						if (!storage) {
							return "当前未发动过〖矜名〗";
						}
						return `最后一次发动〖矜名〗所选选项为${storage.slice(0, 1)}`;
					},
				},
			},
			target: {
				charlotte: true,
				onremove: true,
				audio: "olsbjinming",
				trigger: {
					player: "phaseEnd",
				},
				forced: true,
				async content(event, trigger, player) {
					const choice = player.storage[event.name],
						num = parseInt(choice.slice(0, 1));
					await player.draw(num);
					if (lib.skill.olsbjinming_target.checkTarget(player, num)) {
						player.popup("成功", "wood");
						return;
					}
					player.popup("失败", "fire");
					player.storage.olsbjinming.remove(num);
					game.log(player, "删除了", "#g【矜名】", "的选项", `#y${choice.slice(2)}`);
				},
				intro: {
					markcount: () => null,
					content(storage) {
						if (!storage) {
							return "本回合没有〖矜名〗目标";
						}
						return `本回合需要${storage.slice(2)}`;
					},
				},
				checkTarget(player, key) {
					let num = 0;
					switch (key) {
						case 1: {
							game.getGlobalHistory("everything", evt => {
								if (evt.name == "recover" && evt.player == player && evt.num > 0) {
									num += evt.num;
								}
							});
							break;
						}
						case 2: {
							player.getHistory("lose", evt => {
								if (evt.type == "discard" && evt.cards2?.length) {
									num += evt.cards2.length;
								}
							});
							break;
						}
						case 3: {
							let types = [];
							player.getHistory("useCard", evt => {
								let type = get.type2(evt.card);
								if (!types.includes(type)) {
									types.add(type);
								}
							});
							num = types.length;
							break;
						}
						case 4: {
							player.getHistory("sourceDamage", evt => {
								if (evt.num > 0) {
									num += evt.num;
								}
							});
							break;
						}
					}
					return num >= key;
				},
			},
		},
	},
	olsbxiaoshi: {
		audio: 2,
		trigger: { player: "useCard2" },
		filter(event, player) {
			if (!player.isPhaseUsing() || player.getStorage("olsbxiaoshi_used").includes(event.getParent("phaseUse"))) {
				return false;
			}
			if (!["trick", "basic"].includes(get.type(event.card))) {
				return false;
			}
			return game.hasPlayer(current => !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current));
		},
		async cost(event, trigger, player) {
			const num = player.storage.olsbjinming_used ? parseInt(player.storage.olsbjinming_used.slice(0, 1)) : 0;
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					const trigger = get.event().getTrigger();
					if (trigger.targets.includes(target)) {
						return false;
					}
					return lib.filter.targetEnabled2(trigger.card, get.player(), target);
				})
				.set("num", num)
				.set("ai", target => {
					const trigger = get.event().getTrigger();
					const eff1 = get.effect(target, trigger.card, trigger.player, get.player());
					const eff2 = get.effect(target, { name: "draw" }, get.player(), get.player());
					return eff1 + eff2 * get.event("num");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.addTempSkill("olsbxiaoshi_used");
			player.markAuto("olsbxiaoshi_used", [trigger.getParent("phaseUse")]);
			player.addTempSkill("olsbxiaoshi_effect");
			player.markAuto("olsbxiaoshi_effect", [trigger]);
			trigger.targets.addArray(event.targets);
			game.log(event.targets, "成为了", trigger.card, "的额外目标");
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return player.getStorage("olsbxiaoshi_effect").includes(event) && !player.hasHistory("sourceDamage", evt => evt.card === event.card);
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const num = player.storage.olsbjinming_used ? parseInt(player.storage.olsbjinming_used.slice(0, 1)) : 0;
					const result = !num
						? { bool: false }
						: await player
								.chooseTarget(
									get.translation("olsbxiaoshi") + "：请选择一项",
									(card, player, target) => {
										const trigger = get.event().getTrigger();
										return trigger.targets?.includes(target);
									},
									"令其中一个目标摸" + get.cnNumber(num) + "张牌，或失去1点体力"
								)
								.set("ai", target => {
									const player = get.player();
									let eff = get.effect(target, { name: "draw" }, player, player);
									if (eff < 0) {
										eff -= get.effect(player, { name: "losehp" }, player, player);
									}
									return eff;
								})
								.set("num", num)
								.forResult();
					if (result?.targets?.length) {
						await result.targets[0].draw(parseInt(player.storage.olsbjinming_used.slice(0, 1)));
					} else {
						await player.loseHp();
					}
				},
			},
		},
	},
	olsbyanliang: {
		audio: 2,
		zhuSkill: true,
		global: "olsbyanliang_give",
		subSkill: {
			used: {
				charlotte: true,
			},
			give: {
				audio: "olsbyanliang",
				enable: "phaseUse",
				discard: false,
				lose: false,
				delay: false,
				line: true,
				prepare(cards, player, targets) {
					targets[0].logSkill("olsbyanliang");
				},
				prompt() {
					let player = _status.event.player;
					let list = game.filterPlayer(target => {
						return target != player && target.hasZhuSkill("olsbyanliang", player) && !target.hasSkill("olsbyanliang_used");
					});
					let str = "将一张装备牌交给" + get.translation(list);
					if (list.length > 1) {
						str += "中的一人";
					}
					str += "，然后视为使用一张【酒】";
					return str;
				},
				filter(event, player) {
					if (player.group != "qun") {
						return false;
					}
					if (
						!game.hasPlayer(target => {
							return target != player && target.hasZhuSkill("olsbyanliang", player) && !target.hasSkill("olsbyanliang_used");
						})
					) {
						return false;
					}
					if (!player.canUse({ name: "jiu", isCard: true }, player, true, true)) {
						return false;
					}
					return player.hasCard(card => {
						return lib.skill.olsbyanliang_give.filterCard(card, player);
					}, "he");
				},
				filterCard(card, player) {
					return get.type(card) == "equip";
				},
				position: "he",
				log: false,
				visible: true,
				filterTarget(card, player, target) {
					return target != player && target.hasZhuSkill("olsbyanliang", player) && !target.hasSkill("olsbyanliang_used");
				},
				async content(event, trigger, player) {
					player.give(event.cards, event.target);
					await player.useCard({ name: "jiu", isCard: true }, player);
					event.target.addTempSkill("olsbyanliang_used", "phaseUseEnd");
				},
				ai: {
					expose: 0.3,
					order() {
						return get.order({ name: "jiu" }) + 0.2;
					},
					result: {
						target: 5,
					},
				},
			},
		},
	},
	//谋孙坚
	olsbhulie: {
		audio: 3,
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (event.targets.length != 1 || !["sha", "juedou"].includes(event.card.name)) {
				return false;
			}
			return !player.getStorage("olsbhulie_used").includes(event.card.name);
		},
		check(event, player) {
			return get.attitude(player, event.targets[0]) <= 0;
		},
		logTarget: event => event.targets[0],
		async content(event, trigger, player) {
			const evt = trigger.getParent();
			if (typeof evt.baseDamage != "number") {
				evt.baseDamage = 1;
			}
			evt.baseDamage++;
			player.addTempSkill("olsbhulie_used");
			player.markAuto("olsbhulie_used", trigger.card.name);
			const target = trigger.targets[0],
				sha = get.autoViewAs({ name: "sha", isCard: true });
			player
				.when("useCardAfter")
				.filter(
					evt =>
						evt == trigger.getParent() &&
						target.canUse(sha, player, false) &&
						target.isIn() &&
						!game.hasPlayer2(current => {
							return current.hasHistory("damage", evtx => evtx.card === evt.card);
						})
				)
				.step(async (event, trigger, player) => {
					const bool = await player
						.chooseBool("虎烈", `是否令${get.translation(target)}视为对你使用一张杀？`)
						.set("choice", get.effect(player, sha, target, player) > 0)
						.forResultBool();
					if (bool) {
						await target.useCard(sha, player, false);
					}
				});
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	olsbyipo: {
		audio: 3,
		trigger: {
			player: "changeHp",
		},
		filter(event, player) {
			const hp = player.getHp();
			if (hp <= 0) {
				return false;
			}
			return !player
				.getAllHistory("custom", evt => evt.olsbyipo_num)
				.map(evt => evt.olsbyipo_num)
				.includes(hp);
		},
		async cost(event, trigger, player) {
			player.getHistory("custom").push({
				olsbyipo_num: player.getHp(),
			});
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)))
				.set("ai", target => {
					const player = get.player();
					if (player.getDamagedHp() == 1 && target.countCards("he") == 0) {
						return 0;
					}
					if (get.attitude(player, target) > 0) {
						return 10 + get.attitude(player, target);
					}
					if (player.getDamagedHp() == 1) {
						return -1;
					}
					return 1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const num = Math.max(player.getDamagedHp(), 1);
			const [target] = event.targets;
			let directcontrol = num == 1;
			if (!directcontrol) {
				const str1 = "摸" + get.cnNumber(num, true) + "弃一";
				const str2 = "摸一弃" + get.cnNumber(num, true);
				directcontrol =
					str1 ==
					(await player
						.chooseControl(str1, str2, function (event, player) {
							return _status.event.choice;
						})
						.set("choice", get.attitude(player, target) > 0 ? str1 : str2)
						.set("prompt", "毅魄：请选择一项")
						.forResultControl());
			}
			if (directcontrol) {
				await target.draw(num);
				await target.chooseToDiscard(true, "he");
			} else {
				await target.draw();
				await target.chooseToDiscard(num, true, "he");
			}
		},
	},
	//OL界曹冲
	olchengxiang: {
		audioname: ["strong_caochong"],
		inherit: "chengxiang",
		getIndex(event, player) {
			return event.num;
		},
		intro: { content: "下次发动【称象】多亮出$张牌" },
	},
	olrenxin: {
		audio: 2,
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			return event.player != player && player.countCards("he", { type: "equip" }) > 0;
		},
		logTarget: "player",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt(event.name.slice(0, -5), trigger.player), `弃置一张装备牌并将武将牌翻面，然后${get.translation(trigger.player)}回复至1点体力`, { type: "equip" }, "he")
				.set("ai", card => {
					const player = get.player();
					if (get.attitude(player, get.event().getTrigger().player) > 3) {
						return 11 - get.value(card);
					}
					return -1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.turnOver();
			await trigger.player.recoverTo(1);
		},
		ai: {
			expose: 0.5,
		},
	},
	//OL张春华
	oljianmie: {
		audio: 2,
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		usable: 1,
		async content(event, trigger, player) {
			const target = event.target,
				targets = [player, target];
			let map = {},
				locals = targets.slice();
			let humans = targets.filter(current => current === game.me || current.isOnline());
			locals.removeArray(humans);
			const eventId = get.id();
			const send = (current, targets, eventId) => {
				lib.skill.oljianmie.chooseControl(current, targets, eventId);
				game.resume();
			};
			event._global_waiting = true;
			let time = 10000;
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			targets.forEach(current => current.showTimer(time));
			if (humans.length > 0) {
				const solve = function (resolve, reject) {
					return function (result, player) {
						if (result?.control) {
							map[player.playerid] = result.control == "none2" ? "none" : result.control;
						}
						resolve();
					};
				};
				await Promise.all(
					humans.map(current => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, current, targets, eventId);
								current.wait(solve(resolve, reject));
							} else {
								const next = lib.skill.oljianmie.chooseControl(current, targets, eventId);
								const solver = solve(resolve, reject);
								if (_status.connectMode) {
									game.me.wait(solver);
								}
								return next.forResult().then(result => {
									if (_status.connectMode) {
										game.me.unwait(result, current);
									} else {
										solver(result, current);
									}
								});
							}
						});
					})
				).catch(() => {});
				game.broadcastAll("cancel", eventId);
			}
			if (locals.length > 0) {
				for (const current of locals) {
					const result = await lib.skill.oljianmie.chooseControl(current, targets).forResult();
					if (result && result.control) {
						map[current.playerid] = result.control == "none2" ? "none" : result.control;
					}
				}
			}
			delete event._global_waiting;
			for (const i of targets) {
				i.hideTimer();
			}
			const cards_player = player.getDiscardableCards(player, "h").filter(card => get.color(card) == map[player.playerid]);
			const cards_target = target.getDiscardableCards(target, "h").filter(card => get.color(card) == map[target.playerid]);
			if (cards_player.length && cards_target.length) {
				await game
					.loseAsync({
						lose_list: [
							[player, cards_player],
							[target, cards_target],
						],
					})
					.setContent("discardMultiple");
			} else if (cards_player.length) {
				await player.discard(cards_player);
			} else if (cards_target.length) {
				await target.discard(cards_target);
			}
			if (cards_player.length != cards_target.length) {
				const user = cards_player.length > cards_target.length ? player : target;
				const aim = user == player ? target : player;
				const juedou = new lib.element.VCard({ name: "juedou" });
				if (user.canUse(juedou, aim, false)) {
					await user.useCard(juedou, aim, false);
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					let num = (player.hasSkill("shangshi") ? Math.max(0, player.getDamagedHp() - player.countCards("h") / 2) : 0) - player.countDiscardableCards(player, "h") / 2;
					return get.effect(player, { name: "juedou" }, target, player) + get.effect(player, { name: "draw" }, player, player) * num;
				},
				target(player, target) {
					return get.effect(target, { name: "juedou" }, player, target) - (get.effect(target, { name: "draw" }, target, target) * target.countDiscardableCards(target, "h")) / 2;
				},
			},
		},
		chooseControl(player, targets, eventId) {
			let colors = ["red", "black"];
			if (player.getDiscardableCards(player, "h").some(card => get.color(card) == "none")) {
				colors.push("none2");
			}
			const str = get.translation(targets[0] == player ? targets[1] : targets[0]);
			return player
				.chooseControl(colors)
				.set("prompt", "翦灭：请选择一个颜色")
				.set("prompt2", "弃置选择颜色的手牌，然后若你/" + str + "弃置的牌更多，则你/" + str + "视为对" + str + "/你使用【决斗】")
				.set("ai", () => {
					const player = get.event().player;
					let controls = get.event().controls.slice();
					return controls.sort((a, b) => {
						return (
							player
								.getDiscardableCards(player, "h")
								.filter(card => {
									return get.color(card) == (a == "none2" ? "none" : a);
								})
								.reduce((sum, card) => sum + get.value(card, player), 0) -
							player
								.getDiscardableCards(player, "h")
								.filter(card => {
									return get.color(card) == (b == "none2" ? "none" : b);
								})
								.reduce((sum, card) => sum + get.value(card, player), 0)
						);
					})[0];
				})
				.set("id", eventId)
				.set("_global_waiting", true);
		},
	},
	//OL谋孔融
	olsbliwen: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && _status.currentPhase === player) {
					const evt = player.getLastUsed(1);
					if (evt && evt.card && ((get.suit(evt.card) && get.suit(evt.card) == get.suit(card)) || get.type2(evt.card) == get.type2(card))) {
						return num + 10;
					}
				}
			},
		},
		trigger: {
			global: "phaseBefore",
			player: ["phaseEnd", "useCardAfter", "respondAfter", "enterGame"],
		},
		filter(event, player, name) {
			if (name == "phaseEnd") {
				return game.hasPlayer(t => t.hasMark("olsbliwen"));
			}
			if (player.countMark("olsbliwen") >= 5) {
				return false;
			}
			if (!["respond", "useCard"].includes(event.name)) {
				return event.name !== "phase" || game.phaseNumber === 0;
			}
			const evts = game.getAllGlobalHistory("everything", evt => ["useCard", "respond"].includes(evt.name) && evt.player == player && evt != event);
			if (!evts.length) {
				return false;
			}
			const {
				lastItem: { card },
			} = evts;
			return get.suit(card) == get.suit(event.card) || get.type2(card) == get.type2(event.card);
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			if (event.triggername == "phaseEnd") {
				while (player.hasMark("olsbliwen") && game.hasPlayer(t => t != player && t.countMark("olsbliwen") < 5)) {
					const result = await player
						.chooseTarget("是否发动【立文】？", "将任意枚“贤”标记分配给任意其他角色", (card, player, target) => {
							return target !== player && target.countMark("olsbliwen") < 5;
						})
						.set("ai", target => get.attitude(get.event().player, target) * (target.countCards("h") + 1))
						.forResult();
					if (result.bool) {
						player.line(result.targets);
						player.removeMark("olsbliwen", 1);
						result.targets[0].addMark("olsbliwen", 1);
					} else {
						break;
					}
				}
				const targets = game.filterPlayer(target => target.hasMark("olsbliwen")).sort((a, b) => b.countMark("olsbliwen") - a.countMark("olsbliwen"));
				if (!targets.length) {
					return;
				}
				player.line(targets);
				for (const target of targets) {
					const result = await target
						.chooseToUse(function (card) {
							const evt = _status.event;
							if (!lib.filter.cardEnabled(card, evt.player, evt)) {
								return false;
							}
							return get.position(card) == "h";
						}, '###立文###<div class="text center">使用一张手牌，或移去所有“贤”标记并令' + get.translation(player) + "摸等量的牌</div>")
						.set("addCount", false)
						.forResult();
					if (!result.bool) {
						const num = target.countMark("olsbliwen");
						target.clearMark("olsbliwen");
						await player.draw(num);
					}
				}
			} else {
				player.addMark("olsbliwen", ["useCard", "respond"].includes(trigger.name) ? 1 : Math.min(3, 5 - player.countMark("olsbliwen")));
			}
		},
		intro: {
			name2: "贤",
			content: "mark",
		},
		marktext: "贤",
		ai: { threaten: 3 },
	},
	olsbzhengyi: {
		audio: 2,
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			if (event.hasNature() || !event.player.hasMark("olsbliwen")) {
				return false;
			}
			return game.hasPlayer(target => target != event.player && target.hasMark("olsbliwen"));
		},
		logTarget(event, player) {
			return game.filterPlayer(target => target != event.player && target.hasMark("olsbliwen"));
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const targets = game.filterPlayer(target => target != trigger.player && target.hasMark("olsbliwen"));
			let humans = targets.filter(current => current === game.me || current.isOnline());
			let locals = targets.slice();
			locals.removeArray(humans);
			const eventId = get.id();
			const send = (current, trigger, eventId) => {
				lib.skill.olsbzhengyi.chooseBool(current, trigger, eventId);
				game.resume();
			};
			let choices = [];
			event._global_waiting = true;
			let time = 10000;
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			targets.forEach(current => current.showTimer(time));
			if (humans.length > 0) {
				const solve = function (resolve, reject) {
					return function (result, player) {
						if (result?.bool) {
							choices.push(player);
						}
						resolve();
					};
				};
				await Promise.all(
					humans.map(current => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, current, trigger, eventId);
								current.wait(solve(resolve, reject));
							} else {
								const next = lib.skill.olsbzhengyi.chooseBool(current, trigger, eventId);
								const solver = solve(resolve, reject);
								if (_status.connectMode) {
									game.me.wait(solver);
								}
								return next.forResult().then(result => {
									if (_status.connectMode) {
										game.me.unwait(result, current);
									} else {
										solver(result, current);
									}
								});
							}
						});
					})
				).catch(() => {});
				game.broadcastAll("cancel", eventId);
			}
			if (locals.length > 0) {
				for (const current of locals) {
					const result = await lib.skill.olsbzhengyi.chooseBool(current, trigger).forResult();
					if (result?.bool) {
						choices.push(current);
					}
				}
			}
			delete event._global_waiting;
			for (const i of targets) {
				i.hideTimer();
				i.chat(choices.includes(i) ? "同意" : "拒绝");
			}
			if (!choices.length) {
				trigger.player.chat("杯具");
			} else {
				trigger.cancel();
				trigger.player.chat("洗具");
				game.log(choices, "响应了", trigger.player, "的号召");
				const max = Math.max(...targets.slice().map(i => i.getHp()));
				for (const i of targets) {
					if (choices.includes(i) && i.getHp() == max) {
						await i.loseHp(trigger.num);
					}
				}
			}
		},
		chooseBool(player, trigger, eventId) {
			return player
				.chooseBool()
				.set("prompt", "是否失去" + trigger.num + "点体力，为" + get.translation(trigger.player) + "取消此次伤害？")
				.set(
					"choice",
					(function (player, trigger) {
						const target = trigger.player;
						let eff1 = get.damageEffect(target, trigger.source, player);
						if (trigger.num > 1) {
							eff1 = Math.min(-1, eff1) * trigger.num;
						}
						const eff2 = get.effect(player, { name: "losehp" }, player, player) * trigger.num;
						return eff2 > eff1;
					})(player, trigger)
				)
				.set("id", eventId)
				.set("_global_waiting", true);
		},
		ai: { combo: "olsbliwen" },
	},
	//OL界吴国太
	olganlu: {
		inherit: "xinganlu",
		async content(event, trigger, player) {
			const num = Math.abs(event.targets[0].countCards("e") - event.targets[1].countCards("e"));
			await event.targets[0].swapEquip(event.targets[1]);
			await game.delayx();
			if (player.getDamagedHp() < num) {
				await player.chooseToDiscard("he", num, true);
			}
		},
	},
	olbuyi: {
		audio: 2,
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			return event.player.hp <= 0 && event.player.countCards("he") > 0;
		},
		logTarget: "player",
		async cost(event, trigger, player) {
			const target = trigger.player;
			let check;
			if (trigger.player.isUnderControl(true, player)) {
				check = player.hasCard(card => {
					return get.type(card) != "basic";
				}, "he");
			} else {
				check = get.attitude(player, target) > 0;
			}
			event.result = await player
				.choosePlayerCard(target, get.prompt(event.name.slice(0, -5), target), "he")
				.set("ai", button => {
					if (!get.event().check) {
						return 0;
					}
					if (get.event().target.isUnderControl(true, get.player())) {
						if (get.type(button.link) != "basic") {
							return 10 - get.value(button.link);
						}
						return 0;
					} else {
						return Math.random();
					}
				})
				.set("check", check)
				.set("filterButton", button => {
					if (get.player() == get.event().target) {
						return lib.filter.cardDiscardable(button.link, get.player());
					}
					return true;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.showCards(event.cards, get.translation(player) + "对" + (player == target ? "自己" : get.translation(target)) + "发动了【补益】");
			if (get.type(event.cards[0]) != "basic") {
				await target.discard(event.cards[0]);
				await target.recover();
			}
		},
	},
	//OL界刘表（袁术
	olzishou: {
		audio: 2,
		trigger: {
			player: "phaseDrawBegin2",
		},
		filter(event, player) {
			return !event.numFixed;
		},
		check(event, player) {
			return (
				player.countCards("h") <= (player.hasSkill("olzongshi") ? player.maxHp : player.hp - 2) ||
				player.skipList.includes("phaseUse") ||
				!player.countCards("h", function (card) {
					return get.tag(card, "damage") && player.hasUseTarget(card);
				})
			);
		},
		async content(event, trigger, player) {
			trigger.num += game.countGroup();
			player
				.when("phaseJieshuBegin")
				.filter(evt => evt.getParent() == trigger.getParent())
				.then(() => {
					if (player.hasHistory("useCard", evtx => get.tag(evtx.card, "damage") > 0.5) && player.countDiscardableCards("he")) {
						player.chooseToDiscard("he", game.countGroup(), true);
					}
				});
		},
		ai: {
			threaten: 1.5,
		},
	},
	olzongshi: {
		mod: {
			maxHandcard(player, num) {
				return num + game.countGroup();
			},
		},
		audio: 2,
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			const source = event.source;
			if (!source || source == player || !source.isIn()) {
				return false;
			}
			return !player.getStorage("olzongshi_record").includes(source.group);
		},
		forced: true,
		logTarget: "source",
		async content(event, trigger, player) {
			const target = trigger.source;
			trigger.cancel();
			player.addSkill("olzongshi_record");
			player.markAuto("olzongshi_record", [target.group]);
			if (player.countGainableCards(target, "hej")) {
				await target.gainPlayerCard(player, "hej", true);
			}
		},
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.player && player.getStorage("olzongshi_record").includes(arg.player.group)) {
					return true;
				}
				return false;
			},
		},
		subSkill: {
			record: {
				charlotte: true,
				intro: {
					content: (storage, player) => `已记录势力：${get.translation(storage)}`,
				},
			},
		},
	},
	//OL界李儒
	oljuece: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target !== player && player.countCards("h") >= target.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return target !== player && player.countCards("h") >= target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await event.targets[0].damage();
		},
	},
	olmieji: {
		audio: 2,
		inherit: "xinmieji",
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"] });
		},
		filterCard(card) {
			return get.type2(card) == "trick";
		},
		async content(event, trigger, player) {
			const { target, cards } = event;
			player.$throw(cards.length, 1000);
			if (!target.countCards("he", card => lib.filter.cardDiscardable(card, target))) {
				return;
			}
			const result = await target.chooseToDiscard("he", true).set("prompt", "请弃置一张锦囊牌，或依次弃置两张牌。").forResult();
			if ((!result.cards || get.type(result.cards[0], "trick", result.cards[0].original == "h" ? target : false) != "trick") && target.countCards("he", card => lib.filter.cardDiscardable(card, target))) {
				await target.chooseToDiscard("he", true).set("prompt", "请弃置第二张牌");
			}
		},
	},
	//OL界蔡夫人
	olqieting: {
		audio: 2,
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			const target = event.player;
			if (target == player || !target.isIn()) {
				return false;
			}
			return !target.hasHistory("sourceDamage", evt => evt.player != target) || !target.hasHistory("useCard", evt => evt.targets && evt.targets.some(i => i != target));
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			let num = 0;
			if (!target.hasHistory("useCard", evt => evt.targets && evt.targets.some(i => i != target))) {
				num += 2;
			}
			if (!target.hasHistory("sourceDamage", evt => evt.player != target)) {
				num += 1;
			}
			const next = player.chooseButton([
				"窃听：请选择" + (num > 1 ? "一至两" : "一") + "项",
				[
					[
						["move", "将" + get.translation(target) + "装备区的一张牌置于你的装备区"],
						["draw", "摸一张牌"],
					],
					"textbutton",
				],
			]);
			next.set("selectButton", [1, num]);
			next.set("filterButton", button => {
				if (
					button.link == "move" &&
					!get
						.event()
						.getTrigger()
						.player.countCards("e", card => {
							return get.player().canEquip(card);
						})
				) {
					return false;
				}
				return true;
			});
			next.set("ai", button => {
				const target = get.event().getTrigger().player,
					val = target.hasSkillTag("noe") ? 6 : 0,
					player = get.player();
				if (
					button.link == "move" &&
					(get.attitude(player, target) > 0 ||
						!target.countCards("e", function (card) {
							return player.canEquip(card) && get.value(card, target) > val && get.effect(player, card, player, player) > 0;
						}))
				) {
					return 0;
				}
				return 1;
			});
			const {
				result: { bool, links },
			} = await next;
			event.result = {
				bool: bool,
				cost_data: links,
			};
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player,
				choices = event.cost_data;
			if (choices.includes("move")) {
				const cards = await player
					.choosePlayerCard(target, "e", true)
					.set("filterButton", button => {
						return get.player().canEquip(button.link);
					})
					.set("ai", button => {
						const player = get.player();
						return get.effect(player, button.link, player, player);
					})
					.forResultCards();
				const card = cards[0];
				target.$give(card, player, false);
				await game.delay(0.5);
				await player.equip(card);
			}
			if (choices.includes("draw")) {
				await player.draw();
			}
		},
	},
	//谋庞统
	olsbhongtu: {
		audio: 6,
		trigger: {
			get global() {
				return (lib.phaseName || []).map(i => i + "End");
			},
		},
		filter(event, player) {
			let count = 0;
			player.checkHistory("gain", evt => {
				if (evt.getParent(event.name) !== event) {
					return;
				}
				count += evt.cards.length;
			});
			return count >= 2;
		},
		derivation: ["nzry_feijun", "qianxi"],
		prompt2: "你可以摸三张牌，展示三张手牌，令一名其他角色选择是否使用其中一张牌并令你随机弃置其中另一张牌。若使用牌的点数于三张牌中满足以下条件，其获得如下技能或效果直到其下一个回合的回合结束：唯一最大：〖飞军〗；不为最大且不为最小：〖潜袭〗；唯一最小：手牌上限+2。若其未以此法使用牌，你对其与你各造成1点火焰伤害。",
		check(event, player) {
			if (
				game.hasPlayer(current => {
					return current !== player && get.attitude(player, current) > 0;
				})
			) {
				return true;
			}
			const eff = get.damageEffect(player, player, player, "fire");
			if (
				game.hasPlayer(current => {
					return (
						get.damageEffect(current, player, player, "fire") > eff &&
						player.countCards("h", card => {
							return !current.hasUseTarget(card);
						}) >=
							2 + (player.getHp() > 1)
					);
				})
			) {
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			await player.draw(3);
			if (player.countCards("h") < 3 || !game.hasPlayer(current => player != current)) {
				return;
			}
			const [cards, targets] = await player
				.chooseCardTarget({
					prompt: "鸿图：请展示三张手牌并选择一名角色",
					prompt2: "你选择的角色须选择是否使用其中的一张牌，并令你随机弃置其中的另一张牌。",
					position: "h",
					filterCard: true,
					selectCard: 3,
					filterTarget: lib.filter.notMe,
					forced: true,
					hasFriend: game.hasPlayer(current => {
						return current !== player && get.attitude(player, current) > 0;
					}),
					ai1(card) {
						const player = get.player(),
							val = player.getUseValue(card);
						if (get.event("hasFriend")) {
							if (
								ui.selected.cards.some(cardx => {
									return player.getUseValue(cardx) > 5;
								})
							) {
								return -val - get.value(card);
							}
							return val - 5;
						}
						if (
							game.hasPlayer(current => {
								return get.attitude(get.player(), current) < 0 && !current.hasUseTarget(card);
							})
						) {
							return 100 - val;
						}
						return -val;
					},
					ai2(target) {
						const att = get.attitude(get.player(), target);
						if (!ui.selected.cards.length) {
							return 0;
						}
						if (ui.selected.cards.every(card => !target.hasUseTarget(card))) {
							return 10 * (get.damageEffect(target, player, player, "fire") - get.damageEffect(player, player, player, "fire"));
						}
						return Math.max(...ui.selected.cards.map(card => target.getUseValue(card) * att));
					},
				})
				.forResult("cards", "targets");
			if (!cards?.length || !targets?.length) {
				return;
			}
			const [target] = targets;
			player.line(target, "green");
			await player.showCards(cards, `${get.translation(player)}对${get.translation(target)}发动了【鸿图】`);
			const links = await target
				.chooseButton([`鸿图：是否使用${get.translation(player)}展示的其中一张牌？`, cards])
				.set("filterButton", button => {
					const player = get.player(),
						card = button.link;
					const cardx = get.autoViewAs(
						{
							name: get.name(card),
							nature: get.nature(card),
						},
						[card]
					);
					return player.hasUseTarget(cardx, null, false);
				})
				.set("ai", button => {
					return get.player().getUseValue(button.link);
				})
				.forResultLinks();
			if (!links?.length) {
				for (const current of [target, player]) {
					if (!current.isIn()) {
						continue;
					}
					player.line(current, "fire");
					await current.damage("fire");
				}
			} else {
				const numbers = cards.map(card => get.number(card, player)).toUniqued();
				const min = Math.min(...numbers);
				const max = Math.max(...numbers);
				const [card] = links;
				cards.remove(card);
				const cardx = get.autoViewAs(
					{
						name: get.name(card),
						nature: get.nature(card),
					},
					[card]
				);
				const owner = get.owner(card);
				const next = target
					.chooseUseTarget(cardx, [card], true, false)
					.set("throw", false)
					.set("owner", owner)
					.set("oncard", card => {
						const owner = get.event().getParent().owner;
						if (owner) {
							owner.$throw(card.cards);
						}
					});
				if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
					next.set("viewAs", false);
				}
				await next;
				const restCards = cards.filter(card => {
					return get.owner(card) === player && get.position(card) === "h" && lib.filter.cardDiscardable(card, player, "olsbhongtu");
				});
				if (restCards.length) {
					player.discard(restCards.randomGet());
				}
				const num = get.number(card, player);
				let skill = null;
				if (
					cards.every(cardx => {
						if (cardx === card) {
							return true;
						}
						return get.number(cardx) < num;
					})
				) {
					skill = "nzry_feijun";
				} else if (
					cards.every(cardx => {
						if (cardx === card) {
							return true;
						}
						return get.number(cardx) > num;
					})
				) {
					target.addSkill("olsbhongtu_limit");
					if (!target.storage.olsbhongtu_limit) {
						target.storage.olsbhongtu_limit = [0, 0];
					}
					target.storage.olsbhongtu_limit[0] += 2;
					target.markSkill("olsbhongtu_limit");
				} else if (num != min && num != max) {
					skill = "qianxi";
				}
				if (skill) {
					let skillName = `olsbhongtu_${player.playerid}`;
					target.addAdditionalSkills(skillName, [skill], true);
					delete target.storage.olsbhongtu_phased;
					target.when({ player: "phaseBegin" }).then(() => {
						player.storage.olsbhongtu_phased = true;
					});
					target
						.when({ player: "phaseEnd" })
						.filter(() => {
							return target.storage.olsbhongtu_phased;
						})
						.assign({
							firstDo: true,
							priority: Infinity,
						})
						.vars({
							skillName,
						})
						.then(() => {
							delete player.storage.olsbhongtu_phased;
							player.removeAdditionalSkills(skillName);
						});
				}
			}
		},
		subSkill: {
			limit: {
				markimage: "image/card/handcard.png",
				intro: {
					content(storage, player) {
						return "手牌上限+" + storage[0];
					},
				},
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.storage.olsbhongtu_limit[0];
					},
				},
				trigger: { player: "phaseEnd" },
				silent: true,
				lastDo: true,
				async content(event, trigger, player) {
					const skillName = event.name;
					player.storage[skillName] = [player.storage[skillName][1], 0];
					if (!player.storage[skillName][0]) {
						player.removeSkill(skillName);
					}
				},
			},
		},
	},
	olsbqiwu: {
		audio: 6,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			if (!event.source) {
				return false;
			}
			if (event.source !== player && !event.source.inRangeOf(player)) {
				return false;
			}
			return (
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "damage" && evt.player == player;
						},
						event
					)
					.indexOf(event) === 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt(event.skill), `你可以弃置一张红色牌，防止${get.translation(trigger.source)}对你造成的${trigger.num}点伤害。`, "chooseonly", { color: "red" }, "he")
				.set("ai", card => {
					if (get.event("goon")) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set("goon", get.damageEffect(player, trigger.source, player) < 0)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			trigger.cancel();
		},
	},
	//法正
	olxuanhuo: {
		audio: 2,
		trigger: { player: "phaseDrawEnd" },
		filter(event, player) {
			return player.countCards("he") > 1 && game.hasPlayer(target => target != player);
		},
		async cost(event, trigger, player) {
			const ai2 = function (target) {
				const player = _status.event.player;
				if (
					!game.hasPlayer(current => {
						return current != player && current != target;
					})
				) {
					return get.effect(target, new lib.element.VCard({ name: "shunshou_copy2" }), player, player);
				}
				if (get.attitude(player, target) <= 0) {
					return 0;
				}
				let num = target.getUseValue(new lib.element.VCard({ name: "sha" }), false);
				if (target.hasSkillTag("nogain")) {
					num /= 4;
				}
				return num;
			};
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard: true,
					selectCard: 2,
					position: "he",
					filterTarget: lib.filter.notMe,
					goon: game.hasPlayer(function (current) {
						return current != player && ai2(player, current) > 0;
					}),
					ai1(card) {
						if (!_status.event.goon && game.countPlayer(target => target != _status.event.player) > 1) {
							return 0;
						}
						return 7 - get.value(card);
					},
					ai2: ai2,
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(event.cards, target);
			if (
				game.hasPlayer(function (current) {
					return current != player && current != target;
				})
			) {
				const result2 = await player
					.chooseTarget(
						function (card, player, target) {
							return target != player && target != _status.event.target;
						},
						"请选择" + get.translation(target) + "使用【杀】的目标",
						true
					)
					.set("target", target)
					.set("ai", function (target) {
						const evt = _status.event,
							card = new lib.element.VCard({ name: "sha" });
						if (!evt.target.canUse(card, target, false)) {
							return 0;
						}
						return get.effect(target, card, evt.target, evt.player);
					})
					.set("target", target)
					.forResult();
				if (result2.bool) {
					const target2 = result2.targets[0];
					player.line(target2);
					const result = await target
						.chooseToUse(function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						}, "眩惑：对" + get.translation(target2) + "使用一张【杀】，或令" + get.translation(player) + "你的手牌并获得你的两张牌")
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("targetRequired", true)
						.set("complexTarget", true)
						.set("complexSelect", true)
						.set("sourcex", target2)
						.forResult();
					if (result.bool) {
						return;
					}
				}
			}
			await player.gainPlayerCard(target, 2, "he", true, "visible");
		},
		ai: { expose: 0.15 },
	},
	olenyuan: {
		audio: 2,
		group: ["olenyuan1", "olenyuan2"],
	},
	olenyuan1: {
		inherit: "xinenyuan1",
		sourceSkill: "olenyuan",
	},
	olenyuan2: {
		inherit: "xinenyuan2",
		sourceSkill: "olenyuan",
		prompt2: event => "令" + get.translation(event.source) + "交给你一张红色手牌或失去1点体力",
		async content(event, trigger, player) {
			const result = await trigger.source
				.chooseToGive(
					"恩怨：交给" + get.translation(player) + "一张红色手牌，或失去1点体力",
					(card, player) => {
						return get.color(card) == "red";
					},
					"h",
					player
				)
				.set("ai", card => {
					const { player, target } = get.event();
					if (get.effect(player, { name: "losehp" }, player, player) >= 0) {
						return 0;
					}
					if (get.attitude(target, player) > 0) {
						return 11 - get.value(card);
					}
					return 7 - get.value(card);
				})
				.forResult();
			if (!result?.bool) {
				await trigger.source.loseHp();
			}
		},
	},
	//王异
	olzhenlie: {
		audio: 2,
		inherit: "zhenlie",
		async content(event, trigger, player) {
			const target = trigger.player;
			if (get.attitude(player, target) < 0 && target.countDiscardableCards(player, "he")) {
				player.addTempSkill("zhenlie_lose");
			}
			await player.loseHp();
			player.removeSkill("zhenlie_lose");
			trigger.getParent().excluded.add(player);
			if (!player.isIn()) {
				return;
			}
			const goon = target.hasCard(card => {
				if (get.position(card) == "h") {
					return true;
				}
				return lib.filter.canBeGained(card, player, target);
			}, "he");
			if (goon || player.isDamaged()) {
				let result;
				if (goon && player.isDamaged()) {
					result = await player
						.chooseControl()
						.set("choiceList", ["获得" + get.translation(target) + "的一张牌", "于本回合的结束阶段发动一次〖秘计〗"])
						.set("ai", () => {
							const player = get.event("player"),
								target = get.event().getTrigger().player;
							return get.effect(target, { name: "shunshou_copy2" }, player, player) > get.effect(player, { name: "draw" }, player, player) * player.getDamagedHp() ? 0 : 1;
						})
						.forResult();
				} else {
					result = { index: goon ? 0 : 1 };
				}
				if (result.index == 0) {
					await player.gainPlayerCard(target, "he", true);
				} else {
					player.addTempSkill("olzhenlie_effect");
					player.addMark("olzhenlie_effect", 1, false);
				}
			}
		},
		subSkill: {
			effect: {
				audio: "olzhenlie",
				charlotte: true,
				onremove: true,
				intro: { content: "本回合的结束阶段额外发动#次〖秘计〗" },
				trigger: { global: "phaseJieshuBegin" },
				filter(event, player) {
					if (player.isHealthy()) {
						return false;
					}
					return player.hasMark("olzhenlie_effect");
				},
				getIndex(event, player) {
					return player.countMark("olzhenlie_effect");
				},
				forced: true,
				inherit: "olmiji",
			},
		},
		derivation: "olmiji",
	},
	olmiji: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			if (player.isHealthy()) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			let num = player.getDamagedHp();
			await player.draw(num);
			if (player.countCards("he") && game.hasPlayer(target => target != player)) {
				if (_status.connectMode) {
					game.broadcastAll(() => (_status.noclearcountdown = true));
				}
				let given_map = [];
				while (num > 0 && player.hasCard(card => !card.hasGaintag("olsujian_given"), "he")) {
					const {
						result: { bool, cards, targets },
					} = await player.chooseCardTarget({
						filterCard(card, player) {
							return !card.hasGaintag("olsujian_given");
						},
						selectCard: [1, num],
						position: "he",
						filterTarget: lib.filter.notMe,
						prompt: "秘计：请选择要分配的卡牌和目标",
						prompt2: "（还可分配" + num + "张）",
						ai1(card) {
							return !ui.selected.cards.length && card.name == "du" ? 1 : 0;
						},
						ai2(target) {
							const player = get.event("player");
							const card = ui.selected.cards[0];
							if (card) {
								return get.value(card, target) * get.attitude(player, target);
							}
							return 0;
						},
					});
					if (bool) {
						num -= cards.length;
						const target = targets[0];
						if (given_map.some(i => i[0] == target)) {
							given_map[given_map.indexOf(given_map.find(i => i[0] == target))][1].addArray(cards);
						} else {
							given_map.push([target, cards]);
						}
						player.addGaintag(cards, "olsujian_given");
					} else {
						break;
					}
				}
				if (_status.connectMode) {
					game.broadcastAll(() => {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				if (given_map.length) {
					await game
						.loseAsync({
							gain_list: given_map,
							player: player,
							cards: given_map.slice().flatMap(list => list[1]),
							giver: player,
							animate: "giveAuto",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
	},
	//程普
	dclihuo: {
		audio: "relihuo",
		trigger: { player: "useCard1" },
		filter(event, player) {
			return event.card.name == "sha" && !game.hasNature(event.card, "fire");
		},
		check(event, player) {
			let card = new lib.element.VCard(get.copy(event.card));
			game.setNature(card, "fire");
			const eff1 = event.targets.reduce((sum, target) => {
				return sum + get.effect(target, event.card, player, player);
			}, 0);
			let targets = event.targets.slice();
			if (get.info("lihuo2").filter(event, player)) {
				let targetx = game.filterPlayer(target => {
					return !targets.includes(target) && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
				});
				if (targetx.length) {
					targets.add(
						targetx.sort((a, b) => {
							return get.effect(b, card, player, player) - get.effect(a, card, player, player);
						})[0]
					);
				}
			}
			const eff2 = targets.reduce((sum, target) => {
				return sum + get.effect(target, card, player, player);
			}, 0);
			return eff2 > eff1;
		},
		content() {
			game.log(player, "将", trigger.card, "改为了火属性");
			game.setNature(trigger.card, "fire");
			player
				.when("useCardAfter")
				.filter(evt => evt == trigger)
				.then(() => {
					if (
						game.hasPlayer2(target => {
							return target.getHistory("damage", evt => evt.card && evt.card == trigger.card).length;
						})
					) {
						player.chooseToDiscard("he", "疠火：弃置一张牌，或失去1点体力").set("ai", card => {
							const player = get.event("player"),
								cards = player.getCards("h");
							if ((get.name(card) == "tao" || get.name(card) == "jiu") && lib.filter.cardSavable(card, player, player)) {
								return -1;
							}
							if (player.hp <= 1) {
								if (
									cards.length < player.getEnemies().length &&
									player.hasCard(cardx => {
										return (get.name(cardx) == "tao" || get.name(cardx) == "jiu") && lib.filter.cardSavable(cardx, player, player);
									}, "hs")
								) {
									return 7 - get.value(card);
								}
								return -1;
							}
							return 24 - 5 * cards.length - 2 * Math.min(4, player.getHp()) - get.value(card);
						});
					} else {
						event.finish();
					}
				})
				.then(() => {
					if (!result.bool) {
						player.loseHp();
					}
				});
		},
		ai: { fireAttack: true },
		group: "dclihuo_add",
		subSkill: {
			add: {
				inherit: "lihuo2",
				async content(event, trigger, player) {
					const {
						result: { bool, targets },
					} = await player
						.chooseTarget(get.prompt("dclihuo"), "为" + get.translation(trigger.card) + "增加一个目标", (card, player, target) => {
							const trigger = get.event().getTrigger();
							return !trigger.targets.includes(target) && player.canUse(trigger.card, target);
						})
						.set("card", trigger.card)
						.set("ai", target => {
							const player = get.event("player"),
								trigger = get.event().getTrigger();
							return get.effect(target, trigger.card, player, player);
						});
					if (bool) {
						player.logSkill("dclihuo", targets);
						trigger.targets.addArray(targets);
					}
				},
			},
		},
	},
	olchunlao: {
		audio: "chunlao",
		audioname: ["xin_chengpu"],
		trigger: { global: ["loseAfter", "loseAsyncAfter"] },
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return false;
			}
			if (player.getExpansions("olchunlao").length >= 9) {
				return false;
			}
			return game.hasPlayer(target => {
				if (![player.getPrevious(), player, player.getNext()].includes(target)) {
					return false;
				}
				return event.getl(target)?.cards2?.some(i => i.name == "sha" && get.position(i) == "d");
			});
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const cards = game
				.filterPlayer(target => {
					if (![player.getPrevious(), player, player.getNext()].includes(target)) {
						return false;
					}
					return trigger.getl(target)?.cards2?.some(i => i.name == "sha" && get.position(i) == "d");
				})
				.map(target => {
					return trigger.getl(target).cards2.filter(i => i.name == "sha" && get.position(i) == "d");
				})
				.flat()
				.unique();
			const gain = cards.slice(0, Math.min(cards.length, 9 - player.getExpansions("olchunlao").length));
			if (gain.length) {
				const gainEvent = player.addToExpansion(gain, "gain2");
				gainEvent.gaintag.add("olchunlao");
				await gainEvent;
			}
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (_status.currentPhase != player) {
						return;
					}
					if (card.name == "sha" && !player.getExpansions("olchunlao").length && target.hp > 1) {
						return "zeroplayertarget";
					}
				},
			},
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: ["olchunlao_save"],
		subSkill: {
			save: {
				inherit: "chunlao2",
				filter(event, player) {
					const num =
						player.getRoundHistory("useCard", evt => {
							return evt.card?.name == "jiu" && evt.card?.storage?.olchunlao;
						}).length + 1;
					return event.type == "dying" && event.dying && event.dying.hp <= 0 && player.getExpansions("olchunlao").length >= num;
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const num =
						player.getRoundHistory("useCard", evt => {
							return evt.card?.name == "jiu" && evt.card?.storage?.olchunlao;
						}).length + 1;
					const {
						result: { bool, links },
					} = await player.chooseCardButton(get.translation("olchunlao"), player.getExpansions("olchunlao"), true, num);
					if (bool) {
						player.logSkill("olchunlao", target);
						await player.loseToDiscardpile(links);
						event.type = "dying";
						await target.useCard({ name: "jiu", isCard: true, storage: { olchunlao: true } }, target);
					}
				},
				ai: {
					save: true,
					skillTagFilter(player) {
						const num =
							player.getRoundHistory("useCard", evt => {
								return evt.card?.name == "jiu" && evt.card?.storage?.olchunlao;
							}).length + 1;
						return player.getExpansions("olchunlao").length >= num;
					},
					order: 6,
					result: { target: 1 },
				},
			},
			gain: {
				audio: "chunlao",
				audioname: ["xin_chengpu"],
				trigger: { global: "loseHpEnd" },
				filter(event, player) {
					return player.getExpansions("olchunlao").length;
				},
				async cost(event, trigger, player) {
					const cards = player.getExpansions("olchunlao");
					event.result = await player
						.chooseButton(["###" + get.prompt("olchunlao") + "###获得至多两张“醇”？", cards], [1, 2])
						.set("ai", button => {
							const player = get.event().player;
							return player.hasSha() ? 0 : get.value(button.link);
						})
						.forResult();
					if (event.result.bool) {
						event.result.cards = event.result.links;
					}
				},
				async content(event, trigger, player) {
					await player.gain(event.cards, player, "give");
				},
			},
		},
	},
	//虞翻
	olzongxuan: {
		audio: 2,
		trigger: { global: ["loseAfter", "loseAsyncAfter"] },
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return false;
			}
			return get.info("olzongxuan").getCards(event, player).length;
		},
		check(event, player) {
			if (event.getParent(3).name != "phaseDiscard") {
				return false;
			}
			const cards = get.info("olzongxuan").getCards(event, player);
			return game.hasPlayer(target => {
				if (cards.some(i => get.type(i, null, target) == "equip") && (get.attitude(player, target) > 0 || get.recoverEffect(target, player, player) > 0)) {
					return true;
				}
				if (cards.some(i => get.type(i, null, target) != "equip") && target.getHp() >= player.getHp() && get.effect(target, { name: "losehp" }, player, player) > 0) {
					return true;
				}
				return false;
			});
		},
		async content(event, trigger, player) {
			const {
				result: { bool, moved },
			} = await player
				.chooseToMove("纵玄：将任意张牌置于牌堆顶", true)
				.set("list", [["本次弃置的牌", get.info("olzongxuan").getCards(trigger, player)], ["牌堆顶"]])
				.set("filterOk", moved => moved[1].length)
				.set("processAI", list => {
					const player = get.event("player");
					const cards = list[0][1].slice(),
						cards2 = cards.filter(card => {
							return game.hasPlayer(target => {
								if (get.type(card, null, target) == "equip" && (get.attitude(player, target) > 0 || get.recoverEffect(target, player, player) > 0)) {
									return true;
								}
								if (get.type(card, null, target) != "equip" && target.getHp() >= player.getHp() && get.effect(target, { name: "losehp" }, player, player) > 0) {
									return true;
								}
								return false;
							});
						}),
						cards3 = cards2.length ? cards2.randomGet() : cards.randomGet();
					return [[], [cards3]];
				});
			if (bool) {
				let cards = moved[1].slice();
				game.log(player, "将", cards, "置于了牌堆顶");
				while (cards.length) {
					ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild);
				}
			}
		},
		getCards(event, player) {
			let cards = [];
			for (const target of [player, player.getPrevious()]) {
				const evt = event.getl(target);
				if (evt && evt.cards2 && evt.cards2.some(i => get.position(i) == "d")) {
					if (
						target == player ||
						target
							.getHistory("lose", evt => {
								return evt.type == "discard" && evt.getlx !== false;
							})
							.indexOf(event) == 0
					) {
						cards.addArray(evt.cards2.filter(i => get.position(i) == "d"));
					}
				}
			}
			return cards;
		},
	},
	olzhiyan: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return event.player == player || event.player == player.getPrevious();
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(get.prompt2("olzhiyan"))
				.set("ai", target => {
					const player = get.event("player"),
						cards = get.event("cards");
					if (!cards.length) {
						return 0;
					}
					const card = cards[0],
						att = get.attitude(player, target);
					if (get.type(card, null, target) == "equip" && (get.attitude(player, target) > 0 || get.recoverEffect(target, player, player) > 0)) {
						return get.recoverEffect(target, player, player) * 20 + att / 114514;
					}
					if (get.type(card, null, target) != "equip") {
						if (target.getHp() !== player.getHp()) {
							return get.effect(target, { name: "losehp" }, player, player) * 20 - att / 114514;
						}
						return get.effect(target, { name: "draw" }, player, player);
					}
					return 0;
				})
				.set("cards", Array.from(ui.cardPile.childNodes || []) || []);
			if (bool) {
				const target = targets[0];
				player.logSkill("olzhiyan", target);
				const { result } = await target.draw("visible");
				if (result) {
					const card = result[0];
					if (get.type(card, null, target) == "equip") {
						if (target.getCards("h").includes(card) && target.hasUseTarget(card)) {
							const {
								result: { bool },
							} = await target.chooseUseTarget(card, true, "nopopup");
							if (bool) {
								await target.recover();
							}
						}
					} else if (target.getHp() !== player.getHp()) {
						await target.loseHp();
					}
				}
			}
		},
		ai: { expose: 0.2 },
	},
	//OL谋袁绍
	//真·四世三公——袁神，启动
	olsbhetao: {
		audio: 6,
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			return (
				event.player != player &&
				event.isFirstTarget &&
				event.targets.length > 1 &&
				player.countCards("he", card => {
					if (get.position(card) == "h" && _status.connectMode) {
						return true;
					}
					return get.color(card) == get.color(event.card) && lib.filter.cardDiscardable(card, player);
				})
			);
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, cards, targets },
			} = await player
				.chooseCardTarget({
					prompt: get.prompt("olsbhetao"),
					filterCard(card, player) {
						return get.color(card) == get.color(get.event().getTrigger().card) && lib.filter.cardDiscardable(card, player);
					},
					position: "he",
					filterTarget(card, player, target) {
						return get.event().getTrigger().targets.includes(target);
					},
					ai1(card) {
						return 7.5 - get.value(card);
					},
					ai2(target) {
						const player = get.event("player"),
							trigger = get.event().getTrigger();
						const att = get.attitude(player, target),
							eff = get.effect(target, trigger.card, trigger.player, player);
						if (trigger.card.name == "tiesuo") {
							return eff > 0 ? 0 : get.sgn(att) * (2 + get.sgn(att));
						}
						const sum = trigger.targets.reduce((i, j) => i + get.effect(j, trigger.card, trigger.player, player), 0);
						return eff * 2 - sum;
					},
				})
				.set("prompt2", "弃置一张" + get.translation(get.color(trigger.card)) + "牌，令" + get.translation(trigger.card) + "改为对其中一个目标结算两次");
			if (bool) {
				const target = targets[0];
				player.logSkill("olsbhetao", target);
				player.changeSkin({ characterName: "ol_sb_yuanshao" }, "ol_sb_yuanshao");
				player.discard(cards);
				trigger.getParent().effectCount++;
				trigger.getParent().excluded.addArray(game.filterPlayer(i => trigger.targets.includes(i) && target != i));
			}
		},
		ai: { threaten: 3.5 },
		global: "olsbhetao_ai",
		subSkill: {
			ai: {
				ai: {
					effect: {
						player_use(card, player) {
							if (
								typeof card != "object" ||
								!game.hasPlayer(target => {
									return target.hasSkill("olsbhetao") && (get.attitude(player, target) < 0 || get.attitude(target, player) < 0);
								}) ||
								game.countPlayer(target => {
									return player.canUse(card, target);
								}) < 2
							) {
								return;
							}
							const select = get.info(card).selectTarget;
							let range;
							if (select == undefined) {
								range = [1, 1];
							} else if (typeof select == "number") {
								range = [select, select];
							} else if (get.itemtype(select) == "select") {
								range = select;
							} else if (typeof select == "function") {
								range = select(card, player);
							}
							game.checkMod(card, player, range, "selectTarget", player);
							if (range[1] == -1 || (range[1] > 1 && ui.selected.targets && ui.selected.targets.length)) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	olsbshenli: {
		audio: 6,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!player.isPhaseUsing() || player.hasSkill("olsbshenli_used")) {
				return false;
			}
			return (
				event.card.name == "sha" &&
				game.hasPlayer(target => {
					return !event.targets.includes(target) && player.canUse(event.card, target, false);
				}) &&
				event.isFirstTarget
			);
		},
		check(event, player) {
			const targets = game.filterPlayer(target => player.canUse(event.card, target, false));
			const num1 = event.targets.reduce((sum, target) => sum + get.effect(target, event.card, player, player), 0);
			const num2 = targets.reduce((sum, target) => sum + get.effect(target, event.card, player, player), 0);
			if (num2 >= num1) {
				return true;
			}
			let num = event.baseDamage || 1;
			if (event.extraDamage) {
				num += event.extraDamage;
			}
			let extra_num = 0;
			for (const target of targets) {
				if (
					target.mayHaveShan(player, "use") &&
					!player.hasSkillTag(
						"directHit_ai",
						true,
						{
							target: target,
							card: event.card,
						},
						true
					)
				) {
					if (player.hasSkillTag("jueqing", false, target)) {
						extra_num--;
					} else if (
						target.hasSkillTag("filterDamage", null, {
							player: event.player,
							card: event.card,
						})
					) {
						extra_num++;
					}
				} else {
					extra_num += num;
				}
			}
			const sum = targets.length + extra_num;
			return num2 + (sum > player.countCards("h") ? Math.min(5, sum) : 0) + (sum > player.getHp() ? num2 : 0) >= num1;
		},
		async content(event, trigger, player) {
			player.changeSkin({ characterName: "ol_sb_yuanshao" }, "ol_sb_yuanshao_shadow");
			player.addTempSkill("olsbshenli_used", "phaseUseAfter");
			trigger.getParent().targets.addArray(
				game.filterPlayer(target => {
					return !trigger.targets.includes(target) && player.canUse(trigger.card, target, false);
				})
			);
			player
				.when("useCardAfter")
				.filter(evt => evt == trigger.getParent())
				.then(() => {
					const sum = player
						.getHistory("sourceDamage", evt => evt.card && evt.card == trigger.card)
						.reduce((num, evt) => {
							return num + evt.num;
						}, 0);
					const bool = sum > player.countCards("h"),
						goon = sum > player.getHp();
					if (bool) {
						player.draw(Math.min(5, sum));
					}
					if (goon) {
						const targets = game.filterPlayer(target => trigger.targets.includes(target) && player.canUse(trigger.card, target, false));
						if (
							targets.length &&
							(!trigger.cards ||
								!trigger.cards.length ||
								trigger.cards.every(card => {
									return !get.owner(card);
								}))
						) {
							player.useCard(trigger.card, targets, false);
						}
					}
				});
		},
		ai: { threaten: 3.5 },
		subSkill: { used: { charlotte: true } },
	},
	olsbyufeng: {
		audio: 3,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
			return (event.name != "phase" || game.phaseNumber == 0) && player.canEquip(card, true);
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			if (lib.card.sizhaojian.inShanShanFestival()) {
				game.broadcastAll(() => lib.inpile.add("sizhaojian"));
			}
			const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
			if (get.owner(card)) {
				get.owner(card).$give(card, player, false);
			} else {
				player.$gain2(card, false);
				await game.delayx();
			}
			player.equip(card);
		},
		subSkill: {
			block: {
				mod: {
					cardEnabled(card, player) {
						if (!player.storage.olsbyufeng_block) {
							return;
						}
						const storage = player.getStorage("olsbyufeng_block");
						let evt = get.event();
						if (evt.name != "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						if (!evt || !evt.respondTo || !storage.some(i => i.cardid == evt.respondTo[1].cardid)) {
							return;
						}
						const num = get.number(card);
						if (num != "unsure" && typeof num == "number" && num < get.number(evt.respondTo[1])) {
							return false;
						}
					},
				},
				onremove(player) {
					delete player.storage.olsbyufeng_block;
				},
				charlotte: true,
				trigger: {
					player: ["damageBefore", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
					global: ["useCardEnd"],
				},
				filter(event, player) {
					const evt = event.getParent("useCard", true, true);
					if (evt && evt.effectedCount < evt.effectCount) {
						return false;
					}
					if (!event.card || !player.storage.olsbyufeng_block) {
						return false;
					}
					return player.getStorage("olsbyufeng_block").includes(event.card);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.unmarkAuto(event.name, [trigger.card]);
					if (!player.getStorage(event.name).length) {
						player.removeSkill(event.name);
					}
				},
			},
		},
	},
	sizhaojian_skill: {
		equipSkill: true,
		mod: {
			aiOrder(player, card, num) {
				if (card.name == "sha" && typeof get.number(card) == "number") {
					return num + get.number(card) / 114514;
				}
			},
		},
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && typeof get.number(event.card) == "number";
		},
		forced: true,
		locked: false,
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target;
			target.addTempSkill("olsbyufeng_block");
			target.markAuto("olsbyufeng_block", [trigger.card]);
		},
	},
	olsbshishou: {
		audio: 6,
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (player.getEquip(1)) {
				return false;
			}
			const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
			if (!player.canEquip(card, true)) {
				return false;
			}
			return game.hasPlayer(target => {
				if (target == player || target.group != "qun") {
					return false;
				}
				const evt = event.getl(target);
				return evt && evt.player == target && evt.es && evt.es.length > 0;
			});
		},
		direct: true,
		zhuSkill: true,
		async content(event, trigger, player) {
			const targets = game
				.filterPlayer(target => {
					if (target == player || target.group != "qun") {
						return false;
					}
					const evt = trigger.getl(target);
					return evt && evt.player == target && evt.es && evt.es.length > 0;
				})
				.sortBySeat();
			const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
			for (const target of targets) {
				const {
					result: { bool },
				} = await target.chooseBool(get.prompt("olsbshishou", player), "将" + get.translation(card) + "置入" + get.translation(player) + "的装备区中").set("choice", get.attitude(target, player) > 0);
				if (bool) {
					target.logSkill("olsbshishou", player);
					if (get.owner(card)) {
						get.owner(card).$give(card, player, false);
					} else {
						player.$gain2(card, false);
						await game.delayx();
					}
					player.equip(card);
					break;
				}
			}
		},
	},
	//界高顺
	olxianzhen: {
		audio: "rexianzhen",
		inherit: "xianzhen",
		async content(event, trigger, player) {
			const target = event.target;
			const {
				result: { bool },
			} = await player.chooseToCompare(target);
			if (bool) {
				player.markAuto("olxianzhen_effect", [target]);
				player.addTempSkill("olxianzhen_effect");
			} else {
				player.markAuto("olxianzhen_buff", [target]);
				player.addTempSkill("olxianzhen_buff");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				audio: "rexianzhen",
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("olxianzhen_effect").includes(target)) {
							return true;
						}
					},
					cardUsableTarget(card, player, target) {
						if (player.getStorage("olxianzhen_effect").includes(target)) {
							return true;
						}
					},
				},
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (event.card.name != "sha" && get.type(event.card) != "trick") {
						return false;
					}
					if (!Array.isArray(event.targets)) {
						return false;
					}
					return game.hasPlayer(target => {
						if (!player.getStorage("olxianzhen_effect").includes(target)) {
							return false;
						}
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target);
					});
				},
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(target => {
						if (!player.getStorage("olxianzhen_effect").includes(target)) {
							return false;
						}
						return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
					});
					if (targets.length == 1) {
						const target = targets[0];
						const bool = await player.chooseBool(get.prompt(event.skill, target), "令" + get.translation(target) + "也成为" + get.translation(trigger.card) + "的目标").forResult("bool");
						event.result = { bool: bool, targets: targets };
					} else {
						event.result = await player
							.chooseTarget(get.prompt(event.skill), "令任意名【陷阵】拼点成功的目标角色也成为" + get.translation(trigger.card) + "的目标", (card, player, target) => {
								const trigger = get.event().getTrigger();
								if (!player.getStorage("olxianzhen_effect").includes(target)) {
									return false;
								}
								return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
							})
							.set("ai", target => {
								const player = get.event("player"),
									trigger = get.event().getTrigger();
								return get.effect(target, trigger.card, player, player);
							})
							.forResult();
					}
				},
				content() {
					trigger.targets.addArray(event.targets);
					game.log(event.targets, "成为了", trigger.card, "的额外目标");
				},
				ai: {
					unequip: true,
					skillTagFilter(player, tag, arg) {
						if (!arg || !arg.target || !player.getStorage("olxianzhen_effect").includes(arg.target)) {
							return false;
						}
					},
					effect: {
						player_use(card, player, target, current, isLink) {
							if (isLink || !target || player._olxianzhen_effect_temp) {
								return;
							}
							if (!player.getStorage("olxianzhen_effect").includes(target) && ["sha", "guohe", "shunshou", "huogong", "juedou"].includes(card.name)) {
								player._olxianzhen_effect_temp = true;
								let eff = get.effect(target, card, player, player);
								delete player._olxianzhen_effect_temp;
								if (eff > 0) {
									return [1, 2];
								}
							}
						},
					},
				},
			},
			buff: {
				charlotte: true,
				onremove: true,
				mod: {
					playerEnabled(card, player, target) {
						if (get.name(card, player) == "sha" && player.getStorage("olxianzhen_buff").includes(target)) {
							return false;
						}
					},
					ignoredHandcard(card, player) {
						if (get.name(card, player) == "sha") {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && get.name(card, player) == "sha") {
							return false;
						}
					},
				},
			},
		},
	},
	//新OL谋关羽
	olsbweilin: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (name != "sha" && name != "jiu") {
						return false;
					}
					return get.type(name) == "basic";
				})
				.some(card => player.hasCard(cardx => event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => {
						const name = info[2];
						if (name != "sha" && name != "jiu") {
							return false;
						}
						return get.type(name) == "basic";
					})
					.filter(card => player.hasCard(cardx => event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
				return ui.create.dialog("威临", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"), player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				const player = get.event("player"),
					value = player.getUseValue({ name: button.link[2], nature: button.link[3] });
				if (button.link[2] == "sha" && !player.getHistory("useCard", evt => get.type(evt.card) == "basic").length) {
					if (value > 0) {
						return value + 20;
					}
				}
				return value;
			},
			backup(links, player) {
				return {
					audio: "olsbweilin",
					filterCard: true,
					popname: true,
					check(card) {
						const name = lib.skill.olsbweilin_backup.viewAs.name,
							color = get.color(card);
						const phase = _status.event.getParent().type == "phase";
						if (phase && name == "sha" && color == "red") {
							return 10 - get.value(card);
						}
						if (name == "tao") {
							return 7 + [-2, 0, 2][["black", "red", "none"].indexOf(color)] - get.value(card);
						}
						return 6 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("olsbweilin_effect");
					},
					ai: {
						directHit_ai: true,
						skillTagFilter(player, tag, arg) {
							if (get.event("skill") != "olsbweilin_backup") {
								return false;
							}
							return arg && arg.card && arg.card.name == "sha" && get.color(arg.card) == "red";
						},
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name) || name != "jiu") {
				return false;
			}
			return get.type(name) == "basic" && !player.getStat("skill").olsbweilin && player.countCards("hes");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				if (player.getStat("skill").olsbweilin || !player.countCards("hes")) {
					return false;
				}
			},
			order(item, player) {
				if (player && _status.event.type == "phase" && player.hasValueTarget({ name: "sha" }, true, true)) {
					let max = 0,
						names = get.inpileVCardList(info => {
							const name = info[2];
							if (name != "sha" && name != "jiu") {
								return false;
							}
							return get.type(name) == "basic";
						});
					names = names.map(namex => {
						return { name: namex[2], nature: namex[3] };
					});
					names.forEach(card => {
						if (player.getUseValue(card) > 0) {
							let temp = get.order(card);
							if (card.name == "jiu") {
								let cards = player.getCards("hs", cardx => get.value(cardx) < 8);
								cards.sort((a, b) => get.value(a) - get.value(b));
								if (!cards.some(cardx => get.name(cardx) == "sha" && !cards.slice(0, 2).includes(cardx))) {
									temp = 0;
								}
							}
							if (temp > max) {
								max = temp;
							}
						}
					});
					if (max > 0) {
						max += 15;
					}
					return max;
				}
				return 0.5;
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
			effect: {
				charlotte: true,
				trigger: { player: "useCardToBegin" },
				filter(event, player) {
					return event.target?.isIn() && event.skill === "olsbweilin_backup";
				},
				forced: true,
				popup: false,
				content() {
					const target = trigger.target;
					target.addTempSkill("olsbweilin_wusheng");
					target.markAuto("olsbweilin_wusheng", [get.color(trigger.card)]);
				},
			},
			wusheng: {
				charlotte: true,
				onremove: true,
				mod: {
					cardname(card, player) {
						if (player.getStorage("olsbweilin_wusheng").includes(get.color(card))) {
							return "sha";
						}
					},
				},
				intro: { content: "手牌中所有$牌均视为【杀】" },
			},
		},
	},
	olsbduoshou: {
		init(player) {
			if (player.getHistory("useCard", evt => get.color(evt.card) == "red").length) {
				player.addTempSkill("olsbduoshou_used");
			}
		},
		mod: {
			targetInRange(card, player, target) {
				if (get.color(card) == "red" && !player.hasSkill("olsbduoshou_used")) {
					return true;
				}
			},
		},
		audio: 2,
		trigger: {
			player: "useCard",
			source: "damageSource",
		},
		filter(event, player) {
			if (event.name == "damage") {
				return player.getHistory("sourceDamage").indexOf(event) == 0;
			}
			if (get.color(event.card) == "red" && !player.hasSkill("olsbduoshou_used")) {
				return true;
			}
			return get.type(event.card) == "basic" && player.getHistory("useCard", evt => get.type(evt.card) == "basic").indexOf(event) == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				player.draw();
			} else {
				if (get.color(trigger.card) == "red" && !player.hasSkill("olsbduoshou_used")) {
					game.log(trigger.card, "无距离限制");
					player.addTempSkill("olsbduoshou_used");
				}
				if (get.type(trigger.card) == "basic" && player.getHistory("useCard", evt => get.type(evt.card) == "basic").indexOf(trigger) == 0) {
					game.log(trigger.card, "不计入次数上限");
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.stat[player.stat.length - 1].card;
						if (typeof stat[trigger.card.name] === "number") {
							stat[trigger.card.name]--;
						}
					}
				}
			}
		},
		subSkill: { used: { charlotte: true } },
	},
	//OL谋太史慈
	olsbdulie: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			if (event.player == player || !event.isFirstTarget || event.targets.length != 1) {
				return false;
			}
			if (player.getAttackRange() <= 0) {
				return;
			}
			return ["basic", "trick"].includes(get.type(event.card));
		},
		prompt2(event, player) {
			return "令" + get.translation(event.card) + "额外结算一次，此牌结算完毕后，你摸等同于你攻击范围的牌";
		},
		check(event, player) {
			const num = Math.min(5, player.getAttackRange());
			if (get.effect(player, event.card, event.player, player) > 0) {
				return true;
			}
			if (event.card.name == "guohe" || event.card.name == "shunshou" || event.card.name == "zhujinqiyuan") {
				return num > (event.effectCount || 0);
			}
			if (!get.tag(event.card, "damage")) {
				return true;
			}
			return num > 1;
		},
		usable: 1,
		async content(event, trigger, player) {
			trigger.getParent().effectCount++;
			player
				.when({ global: "useCardAfter" })
				.filter(evt => evt == trigger.getParent())
				.then(() => {
					const num = Math.min(5, player.getAttackRange());
					if (num > 0) {
						player.draw(num);
					}
				});
		},
	},
	olsbdouchan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		async content(event, trigger, player) {
			const card = get.cardPile2(card => card.name == "juedou");
			if (card) {
				player.gain(card, "gain2");
			} else if (player.countMark("olsbdouchan") < game.players.length + game.dead.length) {
				player.addMark("olsbdouchan", 1, false);
			}
		},
		mod: {
			attackRange(player, num) {
				return num + player.countMark("olsbdouchan");
			},
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + player.countMark("olsbdouchan");
				}
			},
		},
		intro: { content: "<li>攻击距离+#<br><li>使用【杀】的次数上限+#" },
	},
	//OL谋关羽
	//可以和手杀谋关羽组成卧龙凤雏了
	olsbfumeng: {
		audio: 2,
		trigger: { global: "roundStart" },
		filter(event, player) {
			return player.countCards("h", card => {
				if (_status.connectMode) {
					return true;
				}
				return get.name(card, player) != "sha";
			});
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, cards },
			} = await player
				.chooseCard(get.prompt2("olsbfumeng"), [1, Infinity], (card, player) => {
					return get.name(card, player) != "sha";
				})
				.set("ai", card => {
					const player = get.event("player");
					if (player.hasSkill("olsbfumeng")) {
						return 7 - get.value(card);
					}
					return 4.5 - get.value(card);
				});
			if (!bool) {
				return;
			}
			player.logSkill("olsbfumeng");
			player.addSkill("olsbfumeng_buff");
			player.addGaintag(cards, "olsbfumeng_buff");
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					cardname(card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("olsbfumeng_buff")) {
							return "sha";
						}
					},
				},
			},
		},
	},
	olsbguidao: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (event.olsbguidao_num > 2) {
				return false;
			}
			const card = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true } });
			return (
				game.hasPlayer(target => {
					return player.canUse(card, target, false);
				}) &&
				player.countCards("he", cardx => {
					return player.canRecast(cardx);
				}) >= 2 &&
				player.countCards("he", cardx => {
					return get.name(cardx, player) == "sha" && player.canRecast(cardx);
				}) >= event.olsbguidao_num
			);
		},
		onChooseToUse(event) {
			if (!game.online && !event.olsbguidao_num) {
				const player = event.player,
					history = player.getHistory("custom", evt => evt.olsbguidao_num);
				if (!history.length) {
					event.set("olsbguidao_num", 1);
				} else {
					const evt = history[history.length - 1];
					event.set("olsbguidao_num", evt.olsbguidao_num);
				}
			}
		},
		filterCard(card, player) {
			const num = get.event("olsbguidao_num");
			if (ui.selected.cards.filter(cardx => get.name(cardx, player) == "sha").length < num && get.name(card, player) != "sha") {
				return false;
			}
			return player.canRecast(card);
		},
		selectCard: 2,
		position: "he",
		check(card) {
			const player = get.event("player");
			if (get.name(card, player) == "sha") {
				return 1 / (get.value(card) || 0.5);
			}
			return 7 - get.value(card);
		},
		complexCard: true,
		lose: false,
		discard: false,
		delay: 0,
		filterTarget(card, player, target) {
			const cardx = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true } });
			return player.canUse(cardx, target, false);
		},
		prompt() {
			let str = "重铸两张牌";
			const num = get.event("olsbguidao_num");
			if (num > 0) {
				str += "（至少重铸" + get.cnNumber(num) + "张【杀】）";
			}
			str += "并视为使用【决斗】";
			return str;
		},
		async content(event, trigger, player) {
			const target = event.target,
				cards = event.cards;
			player.getHistory("custom").push({
				olsbguidao_num: cards.filter(card => get.name(card, player) == "sha").length + 1,
			});
			const card = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true } });
			await player.recast(cards);
			player.addTempSkill("olsbguidao_buff");
			if (player.canUse(card, target, false)) {
				player.useCard(card, target, false);
			}
		},
		ai: {
			order(item, player) {
				const card = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true } });
				const order = get.order(card, player);
				if (order <= 0) {
					return 0;
				}
				return order + 0.1;
			},
			result: {
				target(player, target) {
					const card = new lib.element.VCard({
						name: "juedou",
						storage: { olsbguidao: true },
					});
					return get.sgn(get.attitude(player, target)) * get.effect(target, card, player, player);
				},
			},
		},
		subSkill: {
			buff: {
				charlotte: true,
				trigger: { global: "damageBegin3" },
				filter(event, player) {
					if (!event.card || !event.card.storage || !event.card.storage.olsbguidao) {
						return false;
					}
					if (!event.source || event.source != player) {
						return false;
					}
					const evt = event.getParent("useCard");
					return evt.player == player && evt.targets.includes(event.player);
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const target = trigger.player;
					const {
						result: { control },
					} = await target
						.chooseControl("【杀】更多", "非【杀】更多")
						.set("prompt", "归刀：请猜测" + get.translation(player) + "手牌中【杀】与非【杀】牌数哪个更多")
						.set("prompt2", "若猜错，则" + get.translation(trigger.card) + "对你造成的伤害+1")
						.set("ai", () => _status.event.controls.randomGet());
					const goon1 = player.countCards("h", card => get.name(card, player) == "sha") >= player.countCards("h", card => get.name(card, player) != "sha");
					const goon2 = player.countCards("h", card => get.name(card, player) != "sha") >= player.countCards("h", card => get.name(card, player) == "sha");
					if ((goon1 && control == "【杀】更多") || (goon2 && control == "非【杀】更多")) {
						target.popup("洗具");
						game.log(target, "猜测", "#g正确");
					} else {
						target.popup("杯具");
						game.log(target, "猜测", "#y错误");
						trigger.increase("num");
					}
				},
			},
		},
	},
	//OL谋姜维
	olsbzhuri: {
		audio: 2,
		trigger: {
			get player() {
				return (lib.phaseName || []).map(i => i + "End");
			},
		},
		filter(event, player) {
			if (!game.hasPlayer(target => player.canCompare(target))) {
				return false;
			}
			return player.getHistory("gain", evt => evt.getParent(event.name) == event).length + player.getHistory("lose", evt => evt.getParent(event.name) == event && evt.hs.length).length;
		},
		direct: true,
		*content(event, map) {
			var player = map.player;
			var trigger = map.trigger;
			var result = yield player
				.chooseTarget(get.prompt2("olsbzhuri"), (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					var player = _status.event.player;
					var ts = target.getCards("h").sort((a, b) => get.number(a) - get.number(b));
					if (get.attitude(player, target) < 0) {
						var hs = player.getCards("h").sort((a, b) => get.number(b) - get.number(a));
						var ts = target.getCards("h").sort((a, b) => get.number(b) - get.number(a));
						if (get.number(hs[0]) > get.number(ts[0])) {
							return 1;
						}
						if (get.effect(player, { name: "losehp" }, player, player) > 0) {
							return Math.random() + 0.2;
						}
						if (player.getHp() > 2) {
							return Math.random() - 0.5;
						}
						return 0;
					}
					return 0;
				});
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("olsbzhuri", target);
				var result2 = yield player.chooseToCompare(target);
				if (result2.bool) {
					var cards = [result2.player, result2.target].filterInD("d");
					cards = cards.filter(card => player.hasUseTarget(card));
					if (cards.length) {
						var result3 = yield player.chooseButton(["是否使用其中的牌？", cards]).set("ai", button => _status.event.player.getUseValue(button.link));
						if (result3.bool) {
							var card = result3.links[0];
							player.$gain2(card, false);
							game.delayx();
							player.chooseUseTarget(true, card, false);
						}
					}
				} else {
					var list = lib.skill.olsbranji.getList(trigger);
					var result3 = yield player
						.chooseControl("失去体力", "技能失效")
						.set("prompt", "逐日：失去1点体力，或令此技能于本回合失效")
						.set("ai", () => {
							var player = _status.event.player;
							if (player.getHp() > 2) {
								var list = _status.event.list;
								list.removeArray(player.skipList);
								if (list.includes("phaseDraw") || list.includes("phaseUse")) {
									return "失去体力";
								}
							}
							if (get.effect(player, { name: "losehp" }, player, player) > 0) {
								return "失去体力";
							}
							return "技能失效";
						})
						.set("list", list.slice(trigger.getParent().num, list.length));
					if (result3.control == "失去体力") {
						player.loseHp(1);
					} else {
						player.addTempSkill("olsbzhuri_block");
						player.tempBanSkill("olsbzhuri");
					}
				}
			}
		},
		subSkill: {
			block: {
				charlotte: true,
				mark: true,
				marktext: '<span style="text-decoration: line-through;">日</span>',
				intro: { content: "追不动太阳了" },
			},
		},
	},
	olsbranji: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		prompt2(event, player) {
			var str = "获得技能";
			var num = lib.skill.olsbranji.getNum(player);
			if (num >= player.getHp()) {
				str += "【困奋】";
			}
			if (num == player.getHp()) {
				str += "和";
			}
			if (num <= player.getHp()) {
				str += "【诈降】";
			}
			str += "，然后";
			var num1 = player.countCards("h") - player.getHandcardLimit();
			if (num1 || player.isDamaged()) {
				if (num1) {
					str += num1 < 0 ? "摸" + get.cnNumber(-num1) + "张牌" : "弃置" + get.cnNumber(num1) + "张牌";
				}
				if (num1 && player.isDamaged()) {
					str += "或";
				}
				if (player.isDamaged()) {
					str += "回复" + player.getDamagedHp() + "点体力";
				}
				str += "，最后";
			}
			str += "你不能回复体力直到你杀死角色。";
			return str;
		},
		check(event, player) {
			var num = lib.skill.olsbranji.getNum(player);
			if (num == player.getHp()) {
				return true;
			}
			return player.getHandcardLimit() - player.countCards("h") >= 3 || player.getDamagedHp() >= 2;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		*content(event, map) {
			var player = map.player;
			var trigger = map.trigger;
			player.awakenSkill(event.name);
			var num = lib.skill.olsbranji.getNum(player);
			const skills = [];
			if (num >= player.getHp()) {
				skills.push("kunfen");
				player.storage.kunfen = true;
			}
			if (num <= player.getHp()) {
				skills.push("zhaxiang");
			}
			player.addSkills(skills);
			if (player.countCards("h") != player.getHandcardLimit() || player.isDamaged()) {
				var result,
					num1 = player.countCards("h") - player.getHandcardLimit();
				if (!num1) {
					result = { index: 1 };
				} else if (player.isHealthy()) {
					result = { index: 0 };
				} else {
					result = yield player
						.chooseControl("手牌数", "体力值")
						.set("choiceList", [num1 < 0 ? "摸" + get.cnNumber(-num1) + "张牌" : "弃置" + get.cnNumber(num1) + "张牌", "回复" + player.getDamagedHp() + "点体力"])
						.set("ai", () => {
							var player = _status.event.player;
							var list = _status.event.list;
							var num1 = get.effect(player, { name: "draw" }, player, player);
							var num2 = get.recoverEffect(player, player, player);
							return num1 * list[0] > num2 * list[1] ? 0 : 1;
						})
						.set("list", [-num1, player.getDamagedHp()]);
				}
				if (result.index == 0) {
					if (num1 < 0) {
						yield player.drawTo(player.getHandcardLimit());
					} else {
						yield player.chooseToDiscard(num1, "h", true);
					}
				} else {
					yield player.recover(player.maxHp - player.hp);
				}
			}
			player.addSkill("olsbranji_norecover");
			player.when({ source: "dieAfter" }).then(() => player.removeSkill("olsbranji_norecover"));
		},
		derivation: ["kunfenx", "zhaxiang"],
		getList(event) {
			return event.getParent().phaseList.map(list => list.split("|")[0]);
		},
		getNum(player) {
			return player
				.getHistory("useCard", evt => {
					return lib.phaseName.some(name => {
						return evt.getParent(name).name == name;
					});
				})
				.reduce((list, evt) => {
					return list.add(evt.getParent(lib.phaseName.find(name => evt.getParent(name).name == name)));
				}, []).length;
		},
		subSkill: {
			norecover: {
				audio: "olsbranji",
				charlotte: true,
				mark: true,
				intro: { content: "不能回复体力" },
				trigger: { player: "recoverBefore" },
				forced: true,
				firstDo: true,
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "recover")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	kunfenx: {
		audio: "kunfen",
		audioname2: { ol_sb_jiangwei: "kunfen_ol_sb_jiangwei" },
	},
	kunfen_ol_sb_jiangwei: { audio: 1 },
	zhaxiang_ol_sb_jiangwei: { audio: 1 },
	//界曹彰
	oljiangchi: {
		audio: "rejiangchi",
		trigger: { player: "phaseDrawEnd" },
		direct: true,
		logAudio: index => (typeof index === "number" ? "rejiangchi" + index + ".mp3" : 2),
		*content(event, map) {
			var player = map.player;
			var choiceList = ["摸一张牌，本回合使用【杀】的次数上限-1，且【杀】不计入手牌上限。", "重铸一张牌，本回合使用【杀】无距离限制，且使用【杀】的次数上限+1。"],
				list = ["cancel2"];
			if (player.countCards("he", card => player.canRecast(card))) {
				list.unshift("重铸，+1");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			list.unshift("摸牌，-1");
			var result = yield player
				.chooseControl(list)
				.set("ai", () => {
					var player = _status.event.player;
					var controls = _status.event.controls.slice();
					if (controls.includes("重铸，+1") && player.countCards("hs", card => get.name(card) == "sha" && player.hasValueTarget(card)) >= 2) {
						return "重铸，+1";
					}
					return "摸牌，-1";
				})
				.set("choiceList", choiceList)
				.set("prompt", get.prompt("oljiangchi"));
			if (result.control != "cancel2") {
				player.logSkill("oljiangchi", null, null, null, [result.control == "摸牌，-1" ? 1 : 2]);
				if (result.control == "摸牌，-1") {
					player.draw();
					player.addTempSkill("oljiangchi_less");
					player.addMark("oljiangchi_less", 1, false);
				} else {
					var result2 = yield player.chooseCard("he", "将驰：请重铸一张牌", true, (card, player) => player.canRecast(card));
					if (result2.bool) {
						player.recast(result2.cards);
						player.addTempSkill("oljiangchi_more");
						player.addMark("oljiangchi_more", 1, false);
					}
				}
			}
		},
		subSkill: {
			less: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num - player.countMark("oljiangchi_less");
						}
					},
					ignoredHandcard(card, player) {
						if (card.name == "sha") {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.name == "sha") {
							return false;
						}
					},
				},
			},
			more: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("oljiangchi_more");
						}
					},
					targetInRange(card, player) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
			},
		},
	},
	//界简雍
	olqiaoshui: {
		audio: "reqiaoshui",
		inherit: "reqiaoshui",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const target = event.target;
			const result = await player.chooseToCompare(target).forResult();
			if (result.bool) {
				player.addTempSkill("olqiaoshui_target", { player: "phaseUseAfter" });
			} else {
				player.addTempSkill("qiaoshui2");
				player.addTempSkill("olqiaoshui_used");
				player.tempBanSkill("olqiaoshui");
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				mark: true,
				marktext: '<span style="text-decoration: line-through;">说</span>',
				intro: { content: "被迫闭嘴" },
			},
			target: {
				audio: "olqiaoshui",
				inherit: "qiaoshui3",
				sourceSkill: "olqiaoshui",
			},
		},
	},
	//界凌统
	olxuanfeng: {
		audio: "xuanfeng",
		audioname: ["boss_lvbu3", "re_lingtong"],
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			const evt = event.getl(player);
			return evt && (evt.es.length || evt.cards2.length > 1);
		},
		getIndex: () => 2,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "弃置一名其他角色的一张牌", (card, player, target) => {
					if (player == target) {
						return false;
					}
					return target.countDiscardableCards(player, "he");
				})
				.set("ai", target => {
					const player = get.event("player");
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		content() {
			const target = event.targets[0];
			player.discardPlayerCard(target, "he", true);
		},
		ai: {
			reverseEquip: true,
			noe: true,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
						return [1, 3];
					}
				},
			},
		},
	},
};

export default skills;
