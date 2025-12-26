import { lib, game, ui, get, ai, _status } from "noname";

/** @type {Record<string, Skill>} */
export default {
	//OL程普
	gz_ol_daohuo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			return ui.selected.cards.every(cardx => get.color(cardx) != get.color(card));
		},
		complexCard: true,
		selectCard: 2,
		position: "hes",
		viewAs: {
			name: "sha",
			nature: "fire",
		},
		viewAsFilter(player) {
			return (
				player
					.getCards("hes")
					.map(card => get.color(card))
					.toUniqued().length > 1
			);
		},
		prompt: "将两张颜色不同的牌当火杀使用",
		check(card) {
			return 6 - get.value(card);
		},
		async precontent(event, trigger, player) {
			player
				.when("useCardToPlayered")
				.filter(evt => evt.getParent(2) == event.getParent() && evt.getParent().targets.length == 1)
				.step(async (event, trigger, player) => {
					const target = trigger.target;
					const bool1 = !player.hasMark("yinyang_mark"),
						bool2 = game.hasPlayer(current => current != target && current.isFriendOf(target));
					if (!bool1 && !bool2) {
						return;
					}
					const result = await target
						.chooseButton(
							[
								"蹈火：选择一项",
								[
									[
										["yinyang", `令${get.translation(player)}获得1枚“阴阳鱼”标记`],
										["change", `令${get.translation(player)}选择一名与你同势力的其他角色，你与该角色副将易位`],
									],
									"textbutton",
								],
							],
							true
						)
						.set("filterButton", button => {
							const { bool1, bool2 } = get.event();
							if (button.link == "yinyang") {
								return bool1;
							}
							return bool2;
						})
						.set("bool1", bool1)
						.set("bool2", bool2)
						.set("ai", button => {
							return Math.random();
						})
						.forResult();
					if (!result?.bool || !result.links?.length) {
						return;
					}
					if (result.links.includes("yinyang")) {
						if (!player.countMark("yinyang_mark")) {
							player.addMark("yinyang_mark", 1, false);
							game.log(player, "获得了一个", "#g“阴阳鱼”");
						}
					}
					if (result.links.includes("change")) {
						const targets = game.filterPlayer(current => current != target && current.isFriendOf(target));
						if (!targets?.length) {
							return;
						}
						const result2 = await player
							.chooseTarget(
								`选择一名角色，令其与${get.translation(target)}副将易位`,
								(card, player, target) => {
									return get.event("targetx").includes(target);
								},
								true
							)
							.set("targetx", targets)
							.set("ai", () => Math.random())
							.forResult();
						if (result2?.bool && result2.targets?.length) {
							// @ts-expect-error 祖宗之法就是这么做的
							await target.transCharacter(result2.targets[0]);
						}
					}
				});
		},
	},
	gz_ol_chunlao: {
		audio: "chunlao",
		global: "gz_ol_chunlao_jiu",
		subSkill: {
			jiu: {
				enable: "chooseToUse",
				filter(event, player) {
					if (!game.hasPlayer(current => current.isFriendOf(player) && current.hasSkill("gz_ol_chunlao"))) {
						return false;
					}
					if (!player.hasMark("yinyang_mark") && !player.hasMark("zhulianbihe_mark")) {
						return false;
					}
					const jiu = new lib.element.VCard({ name: "jiu", isCard: true });
					return event.filterCard(jiu, player, event);
				},
				hiddenCard(player, name) {
					if (name != "jiu" || !game.hasPlayer(current => current.isFriendOf(player) && current.hasSkill("gz_ol_chunlao"))) {
						return false;
					}
					return player.hasMark("yinyang_mark") || player.hasMark("zhulianbihe_mark");
				},
				chooseButton: {
					dialog(event, player) {
						return ui.create.dialog("###醇醪###弃置一枚“阴阳鱼”或“珠联璧合”，视为使用一张【酒】");
					},
					chooseControl(event, player) {
						const list = [];
						if (player.hasMark("zhulianbihe_mark")) {
							list.push("珠联璧合");
						}
						if (player.hasMark("yinyang_mark")) {
							list.push("阴阳鱼");
						}
						list.push("cancel2");
						return list;
					},
					check(button) {
						const player = get.player(),
							card = new lib.element.VCard({ name: "jiu", isCard: true });
						if (!player.getUseValue(card)) {
							return "cancel2";
						}
						if (player.hasMark("yinyang_mark")) {
							return "阴阳鱼";
						}
						if (player.hasMark("zhulianbihe_mark")) {
							if (player.getUseValue("tao") < player.getUseValue("jiu")) {
								return "珠联璧合";
							}
						}
						return "cancel2";
					},
					backup(result, player) {
						return {
							link: result.control,
							filterCard: () => false,
							selectCard: -1,
							viewAs: {
								name: "jiu",
								isCard: true,
							},
							async precontent(event, trigger, player) {
								delete event.result.skill;
								player.logSkill("gz_ol_chunlao");
								const map = {
									阴阳鱼: "yinyang_mark",
									珠联璧合: "zhulianbihe_mark",
								};
								player.removeMark(map[get.info("gz_ol_chunlao_jiu_backup").link], 1, false);
							},
						};
					},
					prompt(result, player) {
						return `移去一个${result.control}标记，视为使用一张【酒】`;
					},
				},
				ai: {
					order(item, player) {
						return get.order({ name: "jiu" }, player) + 0.1;
					},
					result: {
						player: 1,
					},
				},
			},
		},
	},
	//OL吴懿
	gz_ol_benxi: {
		audio: "benxi",
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return player == _status.currentPhase;
		},
		forced: true,
		async content(event, trigger, player) {
			const name = `${event.name}_effect`;
			player.addTempSkill(name);
			player.addMark(name, 1, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount(storage, player) {
						return -1 * (storage || 0);
					},
					content: "计算与其他角色距离-#",
				},
				mod: {
					globalFrom(from, to, distance) {
						return distance - from.countMark("gz_ol_benxi_effect");
					},
				},
			},
		},
	},
	gz_ol_zhuanzheng: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (player.countMark("gz_ol_zhuanzheng_used") > 1) {
				return false;
			}
			return game.hasPlayer(current => player.isFriendOf(current));
		},
		filterTarget(card, player, target) {
			return player.isFriendOf(target) && get.distance(player, target) <= 1;
		},
		async content(event, trigger, player) {
			const { target } = event,
				name = `${event.name}_used`;
			player.addTempSkill(name, { global: "roundStart" });
			player.addMark(name, 1, false);
			let num = -1,
				left = player,
				right = player;
			while (target?.isIn()) {
				if (left == target || right == target) {
					break;
				}
				left = left.getPrevious();
				right = right.getNext();
				num++;
			}
			await player.draw(Math.max(1, num));
			const result =
				target == player
					? {
							bool: false,
						}
					: await target
							.chooseBool(`是否与${get.translation(player)}交换副将？`)
							.set("choice", Math.random() > 0.5)
							.forResult();
			if (result.bool) {
				// @ts-expect-error 祖宗之法就是这么做的
				await player.transCharacter(target);
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//手杀陆逊
	gz_mb_qianxun: {
		audio: "sbqianxun",
		trigger: {
			target: "useCardToTarget",
		},
		filter(event, player) {
			return get.type2(event.card) == "trick" && event.targets?.length == 1 && player.countExpansions("gz_mb_qianxun") < 3;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.getParent().all_excluded = true;
			trigger.getParent().targets.length = 0;
			trigger.untrigger();
			const cards = trigger.cards?.filterInD("od");
			if (cards?.length) {
				const next = player.addToExpansion(cards, "gain2");
				next.gaintag.add(event.name);
				await next;
			}
		},
		marktext: "节",
		intro: {
			name: "节",
			markcount: "expansion",
			content: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (!card?.name || target.countExpansions("gz_mb_qianxun") >= 3) {
						return;
					}
					const info = lib.card[card.name];
					if (!info || !["trick", "delay"].includes(info.type)) {
						return;
					}
					if (info.notarget) {
						return;
					}
					const select = info.selectTarget;
					let range;
					if (select == undefined) {
						range = [1, 1];
					} else if (typeof select == "number") {
						range = [select, select];
					} else if (get.itemtype(select) == "select") {
						range = select;
					} else if (typeof select == "function") {
						range = select(card, player);
						if (typeof range == "number") {
							range = [range, range];
						}
					}
					game.checkMod(card, player, range, "selectTarget", player);
					if (
						(() => {
							if (range[1] !== -1) {
								return !ui.selected.targets.length;
							}
							return !game.hasPlayer(current => current !== target && player.canUse(card, current));
						})()
					) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	gz_mb_duoshi: {
		audio: "sblianying",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (
				player.countCards("hs", card => {
					if (get.color(card) != "red") {
						return false;
					}
					const viewAs = get.autoViewAs({ name: "yiyi" }, [card]);
					return event.filterCard(viewAs, player, event);
				})
			) {
				return true;
			}
			if (player.countExpansions("gz_mb_qianxun") < 3) {
				return false;
			}
			return (
				get.inpileVCardList(info => {
					if (!["basic", "trick"].includes(info[0])) {
						return false;
					}
					const card = new lib.element.VCard({ name: info[2], nature: info[3], isCard: true });
					return get.tag(card, "fireDamage") && event.filterCard(card, player, event);
				}).length > 0
			);
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (!["basic", "trick"].includes(info[0])) {
						return false;
					}
					if (info[2] == "yiyi") {
						return player.countCards("hs", card => {
							if (get.color(card) != "red") {
								return false;
							}
							const viewAs = get.autoViewAs({ name: "yiyi" }, [card]);
							return event.filterCard(viewAs, player, event);
						});
					}
					if (player.countExpansions("gz_mb_qianxun") < 3) {
						return false;
					}
					const card = new lib.element.VCard({ name: info[2], nature: info[3], isCard: true });
					return get.tag(card, "fireDamage") && event.filterCard(card, player, event);
				});
				const dialog = ui.create.dialog("度势", [list, "vcard"], "hidden");
				if (list.length === 1 && list[0][2] === "yiyi") {
					dialog.direct = true;
				}
				return dialog;
			},
			check(button) {
				const player = get.player(),
					card = get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure");
				return player.getUseValue(card);
			},
			backup(links, player) {
				const [_1, _2, name, nature] = links[0],
					backup = get.copy(get.info(`gz_mb_duoshi_${name === "yiyi" ? "yiyi" : "fire"}`));
				if (name !== "yiyi") {
					backup.viewAs = {
						name: name,
						nature: nature,
						isCard: true,
					};
				}
				return backup;
			},
			prompt(links, player) {
				if (links[0][2] === "yiyi") {
					return "###度势###将一张红色手牌当作【以逸待劳】使用";
				}
				return `###度势###移去三张“节”，视为使用一张${get.translation(links[0][3] || "")}${get.translation(links[0][2])}`;
			},
		},
		ai: {
			order() {
				return get.order({ name: "yiyi" }) + 0.1;
			},
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {},
			yiyi: {
				audio: "gz_mb_duoshi",
				logAudio: () => "sblianying2.mp3",
				viewAs: {
					name: "yiyi",
				},
				filterCard: {
					color: "red",
				},
				position: "hs",
				check(card) {
					return 5 - get.value(card);
				},
			},
			fire: {
				audio: "gz_mb_duoshi",
				logAudio: () => "sblianying1.mp3",
				viewAs: {
					name: "sha",
					nature: "fire",
					isCard: true,
				},
				filterCard: () => false,
				selectCard: -1,
				async precontent(event, trigger, player) {
					const cards = player.getExpansions("gz_mb_qianxun"),
						result = cards.length > 3 ? await player.chooseButton(["移去三张“节”", cards], 3, true).forResult() : { bool: true, links: cards };
					if (result?.bool && result.links?.length) {
						await player.loseToDiscardpile(result.links);
					}
				},
			},
		},
	},
	//OL钟会
	gz_ol_quanji: {
		audio: "quanji",
		trigger: {
			player: "damageEnd",
		},
		frequent: true,
		filter(event, player) {
			return event.num > 0;
		},
		async content(event, trigger, player) {
			await player.draw();
			if (!player.countCards("h")) {
				return;
			}
			const { result } = await player.chooseCard("将一张牌置于武将牌上作为“权”", "he", true);
			if (result?.bool && result?.cards?.length) {
				const next = player.addToExpansion(result.cards, player, "give");
				next.gaintag.add(event.name);
				await next;
			}
		},
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
			maixie: true,
			maixie_hp: true,
			threaten: 0.8,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [0.5, get.tag(card, "damage") * 2];
						}
						if (!target.hasSkill("paiyi") && target.hp > 1) {
							return [0.5, get.tag(card, "damage") * 1.5];
						}
						if (target.hp == 3) {
							return [0.5, get.tag(card, "damage") * 1.5];
						}
						if (target.hp == 2) {
							return [1, get.tag(card, "damage") * 0.5];
						}
					}
				},
			},
		},
	},
	gz_ol_paiyi: {
		audio: "paiyi",
		mainSkill: true,
		init(player) {
			if (player.checkMainSkill("gz_ol_paiyi")) {
				player.removeMaxHp();
			}
		},
		trigger: {
			player: "phaseDiscardEnd",
		},
		filter(event, player) {
			if (!player.countExpansions("gz_ol_quanji")) {
				return false;
			}
			return !player.hasHistory("lose", evt => {
				return evt.type == "discard" && evt.getParent(event.name) == event;
			});
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseButtonTarget({
					createDialog: [get.prompt(event.skill), player.getExpansions("gz_ol_quanji")],
					selectButton: [1, Infinity],
					filterTarget: true,
					allowChooseAll: true,
					ai1(card) {
						return get.value(card);
					},
					ai2(target) {
						const cards = ui.selected.cards;
						if (!cards?.length) {
							return 0;
						}
						const vals = cards.reduce((sum, card) => {
							return sum + get.value(card, target);
						}, 0);
						if (target != player && target.countCards("h") + cards.length > player.countCards("h")) {
							return vals + get.damageEffect(target, player, player);
						}
						return vals;
					},
				})
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					cards: result.links,
					targets: result.targets,
				};
			}
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			await target.gain(cards, "give", player);
			if (target.countCards("h") > player.countCards("h")) {
				await target.damage();
			}
		},
	},
	gz_yaopan: {
		audio: 2,
		viceSkill: true,
		init(player) {
			player.checkViceSkill("gz_yaopan");
		},
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			return player.getStat("kill") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player == target || player.isFriendOf(target);
				})
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result =
				target == player
					? {
							bool: false,
						}
					: await target
							.chooseBool(`是否与${get.translation(player)}交换副将？`)
							.set("choice", Math.random() > 0.5)
							.forResult();
			if (result.bool) {
				// @ts-expect-error 祖宗之法就是这么做的
				await player.transCharacter(target);
			}
			const targetx = result.bool ? target : player,
				cards = targetx?.getExpansions("gz_ol_quanji");
			if (cards.length) {
				if (targetx) {
					await targetx.gain(cards, "give", player);
				} else {
					await player.loseToDiscardpile(cards);
				}
			}
			if (targetx) {
				const next = targetx.insertPhase();
				// @ts-expect-error 祖宗之法就是这么做的
				next.phaseList = ["phaseUse"];
			}
		},
	},
	//国战典藏2024-2025，启动！
	//国战限定
	//卑弥呼
	gzguishu: {
		audio: "bmcanshi",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("hs", { suit: "spade" }) > 0;
		},
		chooseButton: {
			dialog(event, player) {
				var list = ["yuanjiao", "zhibi"];
				for (var i = 0; i < list.length; i++) {
					list[i] = ["锦囊", "", list[i]];
				}
				return ui.create.dialog("鬼术", [list, "vcard"]);
			},
			filter(button, player) {
				var name = button.link[2];
				if (player.storage.gzguishu_used == 1 && name == "yuanjiao") {
					return false;
				}
				if (player.storage.gzguishu_used == 2 && name == "zhibi") {
					return false;
				}
				return lib.filter.filterCard({ name: name }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				if (button.link == "yuanjiao") {
					return 3;
				}
				if (button.link == "zhibi") {
					if (player.countCards("hs", { suit: "spade" }) > 2) {
						return 1;
					}
					return 0;
				}
			},
			backup(links, player) {
				return {
					audio: "bmcanshi",
					filterCard: { suit: "spade" },
					position: "hs",
					popname: true,
					ai(card) {
						return 6 - get.value(card);
					},
					viewAs: { name: links[0][2] },
					precontent() {
						player.addTempSkill("gzguishu_used");
						player.storage.gzguishu_used = ["yuanjiao", "zhibi"].indexOf(event.result.card.name) + 1;
					},
				};
			},
			prompt(links, player) {
				return "###鬼术###将一张黑桃手牌当作【" + get.translation(links[0][2]) + "】使用";
			},
		},
		ai: {
			order: 4,
			result: { player: 1 },
			threaten: 2,
		},
		subSkill: {
			backup: {},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	gzyuanyu: {
		inherit: "hmkyuanyu",
		filter(event, player) {
			return !event.source?.inRange(player);
		},
		content() {
			trigger.num--;
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (player.inRange(target)) {
						return;
					}
					const num = get.tag(card, "damage");
					if (num) {
						if (num > 1) {
							return 0.5;
						}
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	//伏完
	gzmoukui: {
		audio: "moukui",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card?.name == "sha";
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			var list = ["选项一"];
			if (trigger.target.countDiscardableCards(player, "he") > 0) {
				list.push("选项二");
			}
			list.push("背水！");
			list.push("cancel2");
			player
				.chooseControl(list)
				.set("choiceList", ["摸一张牌", "弃置" + get.translation(trigger.target) + "的一张牌", "背水！依次执行以上两项。然后若此【杀】未对其造成过伤害，则其弃置你的一张牌。"])
				.set("prompt", get.prompt(event.name, trigger.target))
				.setHiddenSkill(event.name);
			"step 1";
			if (result.control != "cancel2") {
				var target = trigger.target;
				player.logSkill(event.name, target);
				if (result.control == "选项一" || result.control == "背水！") {
					player.draw();
				}
				if (result.control == "选项二" || result.control == "背水！") {
					player.discardPlayerCard(target, true, "he");
				}
				if (result.control == "背水！") {
					player.addTempSkill(event.name + "_effect");
					var evt = trigger.getParent();
					if (!evt[event.name + "_effect"]) {
						evt[event.name + "_effect"] = [];
					}
					evt[event.name + "_effect"].add(target);
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return event.gzmoukui_effect?.some(current => {
						return current.isIn() && !current.hasHistory("damage", evt => evt.card == event.card);
					});
				},
				forced: true,
				popup: false,
				content() {
					var list = trigger.gzmoukui_effect
						.filter(current => {
							return current.isIn() && !current.hasHistory("damage", evt => evt.card == trigger.card);
						})
						.sortBySeat();
					for (var i of list) {
						i.discardPlayerCard(player, true, "he").boolline = true;
					}
				},
			},
		},
	},
	//南华老仙
	gzjinghe_new: {
		inherit: "gzjinghe",
		filter: () => true,
		filterCard: () => false,
		selectCard: -1,
		filterTarget: true,
		selectTarget: 1,
		usable: 1,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const skill = get.info(event.name).derivation?.randomGet();
			if (!skill) {
				return;
			}
			const cardname = "gzrejinghe_" + skill;
			const videoId = lib.status.videoId++;
			lib.card[cardname] = {
				fullimage: true,
				image: "character:re_nanhualaoxian",
			};
			lib.translate[cardname] = get.translation(skill);
			game.broadcastAll(
				function (player, id, card) {
					ui.create.dialog(get.translation(player) + "发动了【经合】", [[card], "card"]).videoId = id;
				},
				player,
				videoId,
				game.createCard(cardname, " ", " ")
			);
			await game.delay(3);
			game.broadcastAll("closeDialog", videoId);
			player.addTempSkill("gzjinghe_new_clear", { player: "phaseBegin" });
			target.addAdditionalSkills("gzjinghe_new_" + player.playerid, skill);
			target.popup(skill);
		},
		subSkill: {
			clear: {
				charlotte: true,
				onremove(player) {
					game.countPlayer(current => current.removeAdditionalSkills("gzjinghe_new_" + player.playerid));
				},
			},
		},
	},
	//凌操
	gzdujin: {
		audio: "dujin",
		inherit: "dujin",
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			trigger.num += Math.floor(player.countCards("e") / 2) + 1;
		},
		group: "gzdujin_first",
		subSkill: {
			first: {
				audio: "dujin",
				trigger: { player: "showCharacterEnd" },
				filter(event, player) {
					if (
						game
							.getAllGlobalHistory(
								"everything",
								evt => {
									return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("gzdujin"));
								},
								event
							)
							.indexOf(event) != 0
					) {
						return false;
					}
					return (
						game.getAllGlobalHistory("everything", evt => {
							return evt.name == "showCharacter" && evt.player.isFriendOf(player);
						})[0].player == player
					);
				},
				forced: true,
				locked: false,
				content() {
					player.addMark("xianqu_mark", 1);
				},
			},
		},
	},
	//王基
	gzqizhi: {
		audio: "qizhi",
		inherit: "qizhi",
		usable: 4,
	},
	gzjinqu: {
		audio: "jinqu",
		trigger: { player: "phaseJieshuBegin" },
		check(event, player) {
			return (
				player.getHistory("custom", evt => {
					return evt.gzqizhi == true;
				}).length >= player.countCards("h")
			);
		},
		prompt(event, player) {
			var num = player.getHistory("custom", evt => {
				return evt.gzqizhi == true;
			}).length;
			return "进趋：是否摸两张牌并将手牌弃置至" + get.cnNumber(num) + "张？";
		},
		async content(event, trigger, player) {
			await player.draw(2);
			let dh =
				player.countCards("h") -
				player.getHistory("custom", evt => {
					return evt.gzqizhi == true;
				}).length;
			if (dh > 0) {
				await player.chooseToDiscard(dh, true, "allowChooseAll");
			}
		},
		ai: { combo: "gzqizhi" },
	},
	//徐荣
	gzxionghuo: {
		audio: "xinfu_xionghuo",
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("gzxionghuo_used") < 3;
		},
		filterTarget(card, player, target) {
			return target.isEnemyOf(player);
		},
		usable: 1,
		content() {
			player.addSkill("gzxionghuo_used");
			player.addMark("gzxionghuo_used", 1, false);
			player.addSkill("gzxionghuo_effect");
			const targets = player.getStorage("gzxionghuo_effect").slice().concat([target]);
			player.setStorage("gzxionghuo_effect", targets, true);
		},
		ai: {
			order: 9,
			result: { target: -1 },
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: { content: "已发动过#次" },
			},
			effect: {
				charlotte: true,
				intro: { content: "已指定$" },
				trigger: {
					source: "damageBegin1",
					global: "phaseUseBegin",
				},
				filter(event, player) {
					if (!player.getStorage("gzxionghuo_effect").includes(event.player)) {
						return false;
					}
					return event.name === "phaseUse" || (event.card && !player.hasHistory("sourceDamage", evt => evt.player === event.player));
				},
				forced: true,
				logTarget: "player",
				async content(event, trigger, player) {
					let num = player.getStorage("gzxionghuo_effect").filter(i => i === trigger.player).length;
					if (trigger.name === "damage") {
						trigger.num += num;
					} else {
						const target = trigger.player;
						while (player.getStorage("gzxionghuo_effect").includes(target)) {
							player.unmarkAuto("gzxionghuo_effect", [target]);
						}
						while (num > 0) {
							num--;
							switch (get.rand(1, 3)) {
								case 1:
									player.line(target, "fire");
									await target.damage(1, "fire");
									target.addTempSkill("xinfu_xionghuo_disable");
									target.markAuto("xinfu_xionghuo_disable", [player]);
									break;
								case 2:
									player.line(target, "water");
									await target.loseHp();
									target.addTempSkill("xinfu_xionghuo_low");
									target.addMark("xinfu_xionghuo_low", 1, false);
									break;
								case 3:
									player.line(target, "green");
									for (const pos of ["e", "h"]) {
										await player.gainPlayerCard(target, pos, true);
									}
									break;
							}
						}
					}
				},
			},
		},
	},
	//向郎
	gzkanji: {
		audio: "dckanji",
		inherit: "dckanji",
		usable: 1,
		async content(event, trigger, player) {
			await player.showHandcards();
			const suits = player
				.getCards("h")
				.slice()
				.map(card => get.suit(card, player))
				.unique();
			if (suits.length == player.countCards("h")) {
				event.suitsLength = suits.length;
				player.addTempSkill("gzkanji_check");
				await player.draw(2);
			}
		},
		subSkill: {
			check: {
				charlotte: true,
				trigger: { player: "gainAfter" },
				filter(event, player) {
					if (event.getParent(2).name != "gzkanji") {
						return false;
					}
					const len = event.getParent(2).suitsLength;
					const suits = player
						.getCards("h")
						.slice()
						.map(card => get.suit(card, player))
						.unique();
					return suits.length >= 4 && len < 4;
				},
				forced: true,
				popup: false,
				content() {
					player.addTempSkill("gzkanji_hand");
					player.addMark("gzkanji_hand", 4, false);
				},
			},
			hand: {
				charlotte: true,
				onremove: true,
				intro: { content: "手牌上限+#" },
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("gzkanji_hand");
					},
				},
			},
		},
	},
	//滕胤
	gzchenjian: {
		audio: "chenjian",
		trigger: { player: "phaseZhunbeiBegin" },
		content() {
			"step 0";
			var cards = get.cards(3);
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【陈见】");
			"step 1";
			var list = [];
			if (
				player.countCards("he", i => {
					return lib.filter.cardDiscardable(i, player, "gzchenjian");
				})
			) {
				list.push("选项一");
			}
			if (
				event.cards.some(i => {
					return player.hasUseTarget(i);
				})
			) {
				list.push("选项二");
			}
			if (list.length === 1) {
				event._result = { control: list[0] };
			} else if (list.length > 1) {
				player
					.chooseControl(list)
					.set("choiceList", ["弃置一张牌，然后令一名角色获得与你弃置牌花色相同的牌", "使用" + get.translation(event.cards) + "中的一张牌"])
					.set("prompt", "陈见：请选择一项")
					.set("ai", () => {
						let player = _status.event.player,
							cards = _status.event.getParent().cards;
						if (
							cards.some(i => {
								return player.getUseValue(i) > 0;
							})
						) {
							return "选项二";
						}
						return "选项一";
					});
			} else {
				event.finish();
			}
			"step 2";
			event.choosed = result.control;
			if (result.control === "cancel2") {
				event.finish();
			} else if (result.control === "选项二") {
				event.goto(6);
			}
			"step 3";
			if (
				player.countCards("he", i => {
					return lib.filter.cardDiscardable(i, player, "chenjian");
				})
			) {
				player
					.chooseToDiscard("he", true)
					.set("ai", function (card) {
						let evt = _status.event.getParent(),
							val = evt.player.countMark("chenjian") < 2 ? 0 : -get.value(card),
							suit = get.suit(card);
						for (let i of evt.cards) {
							if (get.suit(i, false) == suit) {
								val += get.value(i, "raw");
							}
						}
						return val;
					})
					.set("prompt", "陈见：请弃置一张牌，然后令一名角色获得" + get.translation(event.cards) + "中花色与之相同的牌" + (event.goon ? "？" : ""));
			} else if (event.choosed === "选项一") {
				event.goto(6);
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool) {
				var suit = get.suit(result.cards[0], player);
				var cards2 = event.cards.filter(function (i) {
					return get.suit(i, false) == suit;
				});
				if (cards2.length) {
					event.cards2 = cards2;
					player.chooseTarget(true, "选择一名角色获得" + get.translation(cards2)).set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (att > 0) {
							return att + Math.max(0, 5 - target.countCards("h"));
						}
						return att;
					});
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 5";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.gain(event.cards2, "gain2");
			}
			event.finish();
			"step 6";
			var cards2 = cards.filter(function (i) {
				return player.hasUseTarget(i);
			});
			if (cards2.length) {
				player.chooseButton(["陈见：" + (event.goon ? "是否" : "请") + "使用其中一张牌" + (event.goon ? "？" : ""), cards2], !event.goon).set("ai", function (button) {
					return player.getUseValue(button.link);
				});
			} else {
				event.finish();
			}
			"step 7";
			if (result.bool) {
				player.chooseUseTarget(true, result.links[0], false);
			}
		},
	},
	gzxixiu: {
		audio: "xixiu",
		trigger: {
			player: "loseBegin",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.name === "lose") {
				if (event.type != "discard" || event.getlx === false) {
					return false;
				}
				if (event.getParent(2).player === player || player.countCards("e") !== 1) {
					return false;
				}
				return event.cards.includes(player.getCards("e")[0]);
			}
			if (player == event.player || !player.countCards("e")) {
				return false;
			}
			var suit = get.suit(event.card, false);
			if (suit == "none") {
				return false;
			}
			return player.hasCard(function (card) {
				return get.suit(card, player) == suit;
			}, "e");
		},
		forced: true,
		content() {
			if (trigger.name === "lose") {
				trigger.cards.remove(player.getCards("e")[0]);
			} else {
				player.draw();
			}
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (typeof card == "object" && player != target) {
						var suit = get.suit(card);
						if (suit == "none") {
							return;
						}
						if (
							player.hasCard(function (card) {
								return get.suit(card, player) == suit;
							}, "e")
						) {
							return [1, 0.08];
						}
					}
				},
			},
		},
	},
	//潘淑
	gzyaner: {
		audio: "yaner",
		inherit: "yaner",
		prompt2: "与该角色各摸一张牌",
		content() {
			game.asyncDraw([_status.currentPhase, player]);
		},
	},
	//曹真
	gzsidi: {
		audio: "sidi",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (
				!player.hasCard(card => {
					if (get.position(card) === "h" && _status.connectMode) {
						return true;
					}
					return !player.getExpansions("gzsidi").some(cardx => get.type2(cardx) === get.type2(card));
				}, "he")
			) {
				return false;
			}
			return player.isFriendOf(event.player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(
					get.prompt("gzsidi"),
					(card, player) => {
						return !player.getExpansions("gzsidi").some(cardx => get.type2(cardx) === get.type2(card));
					},
					"将一张与武将牌上的“驭”类别均不同的牌置于武将牌上",
					"he"
				)
				.set("ai", card => {
					return 6 - get.value(card);
				})
				.forResult();
		},
		content() {
			player.addToExpansion(event.cards, player, "give").gaintag.add("gzsidi");
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		marktext: "驭",
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "gzsidi_effect",
		subSkill: {
			effect: {
				audio: "sidi",
				trigger: { global: "phaseBegin" },
				filter(event, player) {
					if (!event.player.isEnemyOf(player)) {
						return false;
					}
					return player.getExpansions("gzsidi").length;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseButton(["###" + get.prompt("sidi", trigger.player) + '###<div class="text center">将至多三张“驭”置入弃牌堆，然后执行等量条效果</div>', player.getExpansions("gzsidi")], [1, 3])
						.set("ai", button => {
							const player = get.player(),
								target = get.event().getTrigger().player;
							if (get.attitude(player, target) >= 0) {
								return 0;
							}
							return ["equip", "trick", "basic"].indexOf(get.type2(button.link)) + 2;
						})
						.forResult();
					if (event.result?.bool && event.result.links?.length) {
						event.result.cards = event.result.links;
					}
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const cards = event.cards,
						target = trigger.player;
					await player.loseToDiscardpile(cards);
					let num = cards.length,
						result;
					let list = cards.slice().map(i => get.type2(i, false));
					if (num !== 3) {
						list.add("cancel2");
					}
					result = await player
						.chooseControl(list)
						.set("ai", () => {
							return get.event().controls.randomGet();
						})
						.set("prompt", (num === 3 ? "" : "是否") + "封禁其本回合一种类别的牌" + (num === 3 ? "" : "？（还可选择" + num + "次）"))
						.forResult();
					if (result.control !== "cancel2") {
						num--;
						player.popup(result.control);
						game.log(player, "选择了", "#g" + get.translation(result.control));
						target.addTempSkill("gzsidi_ban");
						target.markAuto("gzsidi_ban", [result.control]);
						if (!num) {
							return event.finish();
						}
					}
					let skills = target.getStockSkills(null, true);
					if (skills.length) {
						if (num !== 2) {
							skills.add("cancel2");
						}
						result = await player
							.chooseControl(skills)
							.set("ai", () => {
								return get.event().controls.randomGet();
							})
							.set("prompt", (num === 2 ? "" : "是否") + "封禁其明置武将牌上的一个技能" + (num === 3 ? "" : "？（还可选择" + num + "次）"))
							.forResult();
						if (result.control !== "cancel2") {
							num--;
							player.popup(result.control);
							game.log(player, "选择了", "#g" + get.translation(result.control));
							target.addTempSkill("gzsidi_disable");
							target.disableSkill("gzsidi_disable", result.control);
							if (!num) {
								return event.finish();
							}
						}
					}
					if (game.hasPlayer(target => target !== player && target.isDamaged() && target.isFriendOf(player))) {
						result = await player
							.chooseTarget("是否令一名与你势力相同的其他角色回复1点体力？", (card, player, target) => {
								return target !== player && target.isDamaged() && target.isFriendOf(player);
							})
							.set("ai", target => {
								const player = get.player();
								return get.recoverEffect(target, player, player);
							})
							.forResult();
						if (result.bool) {
							player.line(result.targets[0]);
							await result.targets[0].recover();
						}
					}
				},
			},
			ban: {
				charlotte: true,
				onremove: true,
				intro: { content: "不能使用$牌" },
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("gzsidi_ban").includes(get.type2(card))) {
							var hs = player.getCards("h"),
								cards = [card];
							if (Array.isArray(card.cards)) {
								cards.addArray(card.cards);
							}
							for (var i of cards) {
								if (hs.includes(i)) {
									return false;
								}
							}
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("gzsidi_ban").includes(get.type2(card))) {
							var hs = player.getCards("h"),
								cards = [card];
							if (Array.isArray(card.cards)) {
								cards.addArray(card.cards);
							}
							for (var i of cards) {
								if (hs.includes(i)) {
									return false;
								}
							}
						}
					},
				},
			},
			disable: {
				charlotte: true,
				onremove(player, skill) {
					player.enableSkill(skill);
				},
			},
		},
	},
	//甘夫人

	//徐盛

	//陆逊

	//臧霸

	gzshushen_new: {
		audio: "shushen",
		trigger: { player: "recoverEnd" },
		getIndex: event => event.num || 1,
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("gzshushen_new"), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "draw" }, player, player) * (1 + !target.countCards("h"));
				})
				.setHiddenSkill("gzshushen_new")
				.forResult();
		},
		content() {
			event.targets[0].draw(event.targets[0].countCards("h") ? 1 : 2);
		},
		ai: {
			threaten: 0.8,
			expose: 0.1,
		},
	},
	//徐盛
	gzyicheng_new: {
		audio: "yicheng",
		trigger: { global: ["useCardToPlayered", "useCardToTargeted"] },
		filter(event, player, name) {
			const bool = name === "useCardToPlayered";
			if (bool && !event.isFirstTarget) {
				return false;
			}
			return event.card.name == "sha" && event[bool ? "player" : "target"].isFriendOf(player);
		},
		logTarget(event, player, name) {
			return event[name === "useCardToPlayered" ? "player" : "target"];
		},
		async content(event, trigger, player) {
			await event.targets[0].draw();
			await event.targets[0].chooseToDiscard("he", true);
		},
	},
	//陆逊
	gzduoshi: {
		audio: "duoshi",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.hasUseTarget(new lib.element.VCard({ name: "yiyi", isCard: true }));
		},
		direct: true,
		preHidden: true,
		content() {
			player.chooseUseTarget(get.prompt2(event.name), new lib.element.VCard({ name: "yiyi", isCard: true }), false).set("hiddenSkill", event.name).logSkill = event.name;
		},
	},
	//臧霸
	gzhengjiang: {
		audio: "hengjiang",
		trigger: { player: "damageEnd" },
		preHidden: true,
		check(event, player) {
			return get.attitude(player, _status.currentPhase) < 0 || !_status.currentPhase.needsToDiscard(2);
		},
		filter(event) {
			return _status.currentPhase && _status.currentPhase.isIn() && event.num > 0;
		},
		logTarget() {
			return _status.currentPhase;
		},
		content() {
			const source = _status.currentPhase;
			const num = Math.max(source.countVCards("e"), 1);
			if (source.hasSkill("gzhengjiang_effect")) {
				source.storage.gzhengjiang_effect += num;
				source.storage.gzhengjiang3.add(player);
				source.updateMarks();
			} else {
				source.storage.gzhengjiang3 = [player];
				source.storage.gzhengjiang_effect = num;
				source.addTempSkill("gzhengjiang_effect");
			}
		},
		ai: { maixie_defend: true },
		subSkill: {
			effect: {
				mark: true,
				charlotte: true,
				intro: { content: "手牌上限-#" },
				mod: {
					maxHandcard(player, num) {
						return num - player.storage.gzhengjiang_effect;
					},
				},
				onremove(player) {
					delete player.storage.gzhengjiang_effect;
					delete player.storage.gzhengjiang3;
				},
				trigger: { player: "phaseDiscardEnd" },
				filter(event, player) {
					if (event.cards?.length) {
						return false;
					}
					return player.storage.gzhengjiang3.some(target => target?.isIn() && target.countCards("h") < target.maxHp);
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const players = player.storage.gzhengjiang3;
					for (var i = 0; i < players.length; i++) {
						const target = players[i];
						if (target.isIn() && target.countCards("h") < target.maxHp) {
							target.logSkill("gzhengjiang", player);
							await target.drawTo(target.maxHp);
						}
					}
				},
			},
		},
	},
	//宗预
	gzchengshang: {
		audio: "chengshang",
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (player.hasHistory("sourceDamage", evt => evt.card === event.card)) {
				return false;
			}
			return event.targets?.some(i => i.isIn() && i.countCards("he"));
		},
		usable: 1,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("gzchengshang"), (card, player, target) => {
					return get.event().getTrigger().targets.includes(target) && target.countCards("he");
				})
				.set("ai", target => {
					if (_status.event.player === target) {
						return 0;
					}
					var att = get.attitude(_status.event.player, target);
					if (att > 0) {
						return Math.sqrt(att) / 10;
					}
					return 5 - att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const result = await event.targets[0]
				.chooseToGive(player, "he", true, `承赏：交给${get.translation(player)}一张牌，若为${get.translation(trigger.card.suit)}${get.strNumber(trigger.card.number)}则${get.translation(player)}失去此技能`)
				.set("ai", card => {
					const player = get.player(),
						source = get.event().getParent().player,
						cardx = get.event().getTrigger().card;
					if (get.suit(card) === get.suit(cardx) && get.number(card) === get.number(cardx)) {
						return 1145141919810 * get.sgn(-get.attitude(player, source));
					}
					return -get.value(card);
				})
				.forResult();
			if (result?.bool && result.cards?.length) {
				const card = result.cards[0];
				if (get.suit(card) === get.suit(trigger.card) && get.number(card) === get.number(trigger.card)) {
					await player.removeSkills("gzchengshang");
				}
			}
		},
	},
	//官盗2023

	fakexiaoguo: {
		audio: "xiaoguo",
		audioname2: { gz_jun_caocao: "jianan_xiaoguo" },
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			return (
				event.player != player &&
				player.countCards("h", card => {
					if (_status.connectMode) {
						return true;
					}
					return get.type(card) == "basic" && lib.filter.cardDiscardable(card, player);
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(
					get.prompt2("fakexiaoguo", trigger.player),
					(card, player) => {
						return get.type(card) == "basic";
					},
					[1, Infinity]
				)
				.set("complexSelect", true)
				.set("ai", card => {
					const player = get.event("player"),
						target = get.event().getTrigger().player;
					const effect = get.damageEffect(target, player, player);
					const cards = target.getCards("e", card => get.attitude(player, target) * get.value(card, target) < 0);
					if (effect <= 0 && !cards.length) {
						return 0;
					}
					if (ui.selected.cards.length > cards.length - (effect <= 0 ? 1 : 0)) {
						return 0;
					}
					return 1 / (get.value(card) || 0.5);
				})
				.set("logSkill", ["fakexiaoguo", trigger.player])
				.setHiddenSkill("fakexiaoguo")
				.forResult();
		},
		popup: false,
		preHidden: true,
		async content(event, trigger, player) {
			const num = trigger.player.countCards("e"),
				num2 = event.cards.length;
			await player.discardPlayerCard(trigger.player, "e", num2, true);
			if (num2 > num) {
				await trigger.player.damage();
			}
		},
	},
	fakeduanbing: {
		audio: "duanbing",
		inherit: "reduanbing",
		preHidden: ["fakeduanbing_sha"],
		group: ["fakeduanbing", "fakeduanbing_sha"],
		subSkill: {
			sha: {
				audio: "duanbing",
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.card.name == "sha" && !event.getParent().directHit.includes(event.target) && event.targets.length == 1;
				},
				forced: true,
				logTarget: "target",
				content() {
					var id = trigger.target.playerid;
					var map = trigger.getParent().customArgs;
					if (!map[id]) {
						map[id] = {};
					}
					if (typeof map[id].shanRequired == "number") {
						map[id].shanRequired++;
					} else {
						map[id].shanRequired = 2;
					}
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!arg || !arg.card || !arg.target || arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player, arg.target) > 1) {
							return false;
						}
					},
				},
			},
		},
	},
	fakeduoshi: {
		audio: "duoshi",
		global: "fakeduoshi_global",
		subSkill: {
			global: {
				audio: "duoshi",
				forceaudio: true,
				enable: "phaseUse",
				filter(event, player) {
					const info = get.info("fakeduoshi").subSkill.global;
					return (
						game.hasPlayer(target => {
							return info.filterTarget(null, player, target);
						}) &&
						player.countCards("hs", card => {
							return info.filterCard(card, player);
						})
					);
				},
				filterTarget(card, player, target) {
					return target.hasSkill("fakeduoshi") && !target.isTempBanned("fakeduoshi") && target.isFriendOf(player);
				},
				filterCard(card, player) {
					if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
						return false;
					}
					return get.color(card) == "red" && player.hasUseTarget(get.autoViewAs({ name: "yiyi" }, [card]));
				},
				discard: false,
				lose: false,
				delay: false,
				line: false,
				prompt: "选择一张红色手牌当作【以逸待劳】使用，并选择一名拥有【度势】的角色",
				async content(event, trigger, player) {
					const target = event.target;
					target.tempBanSkill("fakeduoshi", "roundStart", false);
					let { result } = await player.chooseUseTarget(true, { name: "yiyi" }, event.cards);
					if (result.bool && result.targets.length && target.isNotMajor()) {
						const num = result.targets.length,
							str = "将" + get.cnNumber(num) + "张手牌当作不可被响应的【火烧连营】使用？";
						const {
							result: { bool, targets },
						} = await player
							.chooseTarget("是否令一名友方角色" + str, (card, player, target) => {
								return (
									target.isFriendOf(player) &&
									target.countCards("h", card => {
										if (!target.hasUseTarget(get.autoViewAs({ name: "huoshaolianying" }, [card]))) {
											return false;
										}
										return target != player || game.checkMod(card, player, "unchanged", "cardEnabled2", player);
									}) >= get.event("num")
								);
							})
							.set("num", num)
							.set("ai", target => {
								return target.getUseValue(new lib.element.VCard({ name: "huoshaolianying", isCard: true }));
							});
						if (bool) {
							player.line(targets[0]);
							game.broadcastAll(num => {
								lib.skill.fakeduoshi_backup.selectCard = num;
								lib.skill.fakeduoshi.subSkill.backup.selectCard = num;
							}, num);
							await targets[0]
								.chooseToUse()
								.set("openskilldialog", "度势：是否" + str)
								.set("norestore", true)
								.set("_backupevent", "fakeduoshi_backup")
								.set("custom", {
									add: {},
									replace: { window() {} },
								})
								.set("addCount", false)
								.set("oncard", () => _status.event.directHit.addArray(game.players))
								.backup("fakeduoshi_backup");
						}
					}
				},
				ai: {
					order(item, player) {
						const card = new lib.element.VCard({ name: "huoshaolianying", isCard: true });
						return get.order(card, player) + 0.1;
					},
					result: { target: 1 },
				},
			},
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "hs",
				check(card) {
					return 7 - get.value(card);
				},
				log: false,
				viewAs: { name: "huoshaolianying" },
			},
		},
	},

	fakehanzhan: {
		audio: "hanzhan",
		trigger: {
			player: ["chooseToCompareAfter", "compareMultipleAfter"],
			target: ["chooseToCompareAfter", "compareMultipleAfter"],
		},
		filter(event, player) {
			if (event.preserve) {
				return false;
			}
			const list = [event.player, event.target];
			const targets = list.slice().filter(i => (event.num1 - event.num2) * get.sgn(0.5 - list.indexOf(i)) <= 0);
			return targets.some(i => {
				const target = list[1 - list.indexOf(i)];
				return target.hasCard(card => {
					return lib.filter.canBeGained(card, i, target);
				}, "e");
			});
		},
		async cost(event, trigger, player) {
			let users = [];
			const list = [trigger.player, trigger.target];
			let targets = list.slice().filter(i => (trigger.num1 - trigger.num2) * get.sgn(0.5 - list.indexOf(i)) <= 0);
			targets = targets
				.filter(i => {
					const target = list[1 - list.indexOf(i)];
					return target.hasCard(card => {
						return lib.filter.canBeGained(card, i, target);
					}, "e");
				})
				.sortBySeat(player);
			for (const i of targets) {
				const aim = list[1 - list.indexOf(i)];
				const {
					result: { bool },
				} = await i.chooseBool(get.prompt("fakehanzhan"), "获得" + get.translation(aim) + "装备区的一张牌").set(
					"choice",
					aim.hasCard(card => {
						return get.value(card, aim) * get.attitude(i, aim) < 0;
					}, "e")
				);
				if (bool) {
					users.push(i);
				}
			}
			event.result = { bool: Boolean(users.length), targets: users };
		},
		logLine: false,
		async content(event, trigger, player) {
			const list = [trigger.player, trigger.target];
			let targets = list.slice().filter(i => (trigger.num1 - trigger.num2) * get.sgn(0.5 - list.indexOf(i)) <= 0);
			targets = targets
				.filter(i => {
					const target = list[1 - list.indexOf(i)];
					return target.hasCard(card => {
						return lib.filter.canBeGained(card, i, target);
					}, "e");
				})
				.sortBySeat(player);
			for (const i of targets) {
				const aim = list[1 - list.indexOf(i)];
				i.line(aim, "green");
				await i.gainPlayerCard(aim, "e", true);
			}
		},
	},
	fakeshuangxiong: {
		audio: "shuangxiong",
		subfrequent: ["tiandu"],
		group: ["fakeshuangxiong_effect", "fakeshuangxiong_tiandu"],
		subSkill: {
			effect: {
				audio: "shuangxiong1",
				inherit: "shuangxiong1",
				content() {
					player.judge().set("callback", get.info("fakeshuangxiong").subSkill.effect.callback);
					trigger.changeToZero();
				},
				callback() {
					player.addTempSkill("shuangxiong2");
					player.markAuto("shuangxiong2", [event.judgeResult.color]);
				},
			},
			tiandu: {
				audio: "shuangxiong",
				inherit: "tiandu",
				filter(event, player) {
					return _status.currentPhase == player && get.info("tiandu").filter(event, player);
				},
			},
		},
	},
	fakeyicheng: {
		audio: "yicheng",
		inherit: "yicheng",
		async content(event, trigger, player) {
			const target = trigger.target;
			await target.draw();
			await target.chooseToUse(function (card) {
				if (get.type(card) != "equip") {
					return false;
				}
				return lib.filter.cardEnabled(card, _status.event.player, _status.event);
			}, "疑城：是否使用装备牌？");
			if (!target.storage.fakeyicheng) {
				target.when({ global: "phaseEnd" }).then(() => {
					player.chooseToDiscard("he", player.countMark("fakeyicheng"), true);
					delete player.storage.fakeyicheng;
				});
			}
			target.addMark("fakeyicheng", 1, false);
		},
	},

	fakefenming: {
		audio: "fenming",
		enable: "phaseUse",
		filter(event, player) {
			return player.isLinked();
		},
		filterTarget(card, player, target) {
			return target.isLinked();
		},
		selectTarget: -1,
		usable: 1,
		multiline: true,
		multitarget: true,
		async content(event, trigger, player) {
			for (const target of event.targets) {
				if (player == target) {
					await player.chooseToDiscard(true, "he");
				} else {
					await player.discardPlayerCard(true, "he", target);
				}
			}
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) + 0.1;
			},
			result: {
				target(player, target) {
					return get.sgn(get.attitude(player, target)) * get.effect(target, { name: "guohe_copy2" }, player, player);
				},
			},
		},
	},
	fakebaoling: {
		audio: "baoling",
		inherit: "baoling",
		init(player) {
			player.checkMainSkill("fakebaoling");
		},
		content() {
			"step 0";
			player.removeCharacter(1);
			"step 1";
			player.gainMaxHp(3);
			player.recover(3);
			"step 2";
			player.addSkills("fakebenghuai");
		},
		derivation: "fakebenghuai",
	},
	fakebenghuai: {
		audio: "benghuai",
		inherit: "benghuai",
		async content(event, trigger, player) {
			const {
				result: { control },
			} = await player
				.chooseControl("体力", "上限", "背水！")
				.set("prompt", "崩坏：请选择一项")
				.set("choiceList", ["失去1点体力", "减1点体力上限", "背水！依次执行前两项，然后执行一个额外的摸牌阶段"])
				.set("ai", () => {
					const player = get.event("player");
					if (player.maxHp > 1 && (player.getHp() == 2 || !player.countCards("h"))) {
						return "背水！";
					}
					return player.isDamaged() ? "上限" : "体力";
				});
			player.popup(control);
			game.log(player, "选择了", "#g" + control);
			if (control != "上限") {
				await player.loseHp();
			}
			if (control != "体力") {
				await player.loseMaxHp();
			}
			if (control == "背水！") {
				let num = trigger.getParent().num + 1;
				trigger.getParent().phaseList.splice(num, 0, `phaseDraw|${event.name}`);
			}
		},
	},
	fakediaodu: {
		audio: "diaodu",
		inherit: "xindiaodu",
		group: "fakediaodu_use",
		subSkill: {
			use: {
				trigger: { global: "useCard" },
				filter(event, player) {
					if (!lib.skill.xindiaodu.isFriendOf(player, event.player) || !(event.targets || []).includes(player)) {
						return false;
					}
					return (player == event.player || player.hasSkill("fakediaodu")) && !event.player.getStorage("fakediaodu_temp").includes(get.type2(event.card));
				},
				direct: true,
				async content(event, trigger, player) {
					const target = trigger.target,
						next = await target.chooseBool(get.prompt("fakediaodu"), "摸一张牌？");
					if (player.hasSkill("fakediaodu")) {
						next.set("frequentSkill", "fakediaodu");
					}
					if (player == trigger.player) {
						next.setHiddenSkill("fakediaodu");
					}
					const {
						result: { bool },
					} = next;
					if (bool) {
						player.logSkill("fakediaodu", target);
						target.draw("nodelay");
						target.addTempSkill("fakediaodu_temp");
						target.markAuto("fakediaodu_temp", [get.type2(trigger.card)]);
					}
				},
			},
			temp: {
				charlotte: true,
				onremove: true,
			},
		},
	},

	fakeyigui: {
		audio: "yigui",
		hiddenCard(player, name) {
			if (["shan", "wuxie"].includes(name) || !["basic", "trick"].includes(get.type(name))) {
				return false;
			}
			return lib.inpile.includes(name) && player.getStorage("fakeyigui").length && !player.getStorage("fakeyigui2").includes(get.type2(name));
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type == "wuxie" || event.type == "respondShan") {
				return false;
			}
			const storage = player.getStorage("fakeyigui"),
				storage2 = player.getStorage("fakeyigui2");
			if (!storage.length || storage2.length > 1) {
				return false;
			}
			if (event.type == "dying") {
				if (storage2.includes("basic")) {
					return false;
				}
				if (!event.filterCard({ name: "tao" }, player, event) && !event.filterCard({ name: "jiu" }, player, event)) {
					return false;
				}
				const target = event.dying;
				return (
					target.identity == "unknown" ||
					target.identity == "ye" ||
					storage.some(i => {
						var group = get.character(i, 1);
						if (group == "ye" || target.identity == group) {
							return true;
						}
						var double = get.is.double(i, true);
						if (double && double.includes(target.identity)) {
							return true;
						}
					})
				);
			}
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (storage2.includes(get.type(name))) {
						return false;
					}
					return get.type(name) == "basic" || get.type(name) == "trick";
				})
				.some(cardx => {
					const card = { name: cardx[2], nature: cardx[3] },
						info = get.info(card);
					return storage.some(character => {
						if (!lib.filter.filterCard(card, player, event)) {
							return false;
						}
						if (event.filterCard && !event.filterCard(card, player, event)) {
							return false;
						}
						const group = get.character(character, 1),
							double = get.is.double(character, true);
						if (info.changeTarget) {
							const list = game.filterPlayer(current => player.canUse(card, current));
							for (let i = 0; i < list.length; i++) {
								let giveup = false,
									targets = [list[i]];
								info.changeTarget(player, targets);
								for (let j = 0; j < targets.length; j++) {
									if (group != "ye" && targets[j].identity != "unknown" && targets[j].identity != "ye" && targets[j].identity != group && (!double || !double.includes(targets[j].identity))) {
										giveup = true;
										break;
									}
								}
								if (giveup) {
									continue;
								}
								if (!giveup) {
									return true;
								}
							}
							return false;
						}
						return game.hasPlayer(current => {
							return event.filterTarget(card, player, current) && (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity)));
						});
					});
				});
		},
		chooseButton: {
			select: 2,
			dialog(event, player) {
				var dialog = ui.create.dialog("役鬼", "hidden");
				dialog.add([player.getStorage("fakeyigui"), "character"]);
				const list = get.inpileVCardList(info => {
					const name = info[2];
					if (player.getStorage("fakeyigui2").includes(get.type(name))) {
						return false;
					}
					return get.type(name) == "basic" || get.type(name) == "trick";
				});
				dialog.add([list, "vcard"]);
				return dialog;
			},
			filter(button, player) {
				var evt = _status.event.getParent("chooseToUse");
				if (!ui.selected.buttons.length) {
					if (typeof button.link != "string") {
						return false;
					}
					if (evt.type == "dying") {
						if (evt.dying.identity == "unknown" || evt.dying.identity == "ye") {
							return true;
						}
						var double = get.is.double(button.link, true);
						return evt.dying.identity == lib.character[button.link][1] || lib.character[button.link][1] == "ye" || (double && double.includes(evt.dying.identity));
					}
					return true;
				} else {
					if (typeof ui.selected.buttons[0].link != "string") {
						return false;
					}
					if (typeof button.link != "object") {
						return false;
					}
					var name = button.link[2];
					if (player.getStorage("fakeyigui2").includes(get.type(name))) {
						return false;
					}
					var card = { name: name };
					if (button.link[3]) {
						card.nature = button.link[3];
					}
					var info = get.info(card);
					var group = lib.character[ui.selected.buttons[0].link][1];
					var double = get.is.double(ui.selected.buttons[0].link, true);
					if (evt.type == "dying") {
						return evt.filterCard(card, player, evt);
					}
					if (!lib.filter.filterCard(card, player, evt)) {
						return false;
					} else if (evt.filterCard && !evt.filterCard(card, player, evt)) {
						return false;
					}
					if (info.changeTarget) {
						var list = game.filterPlayer(function (current) {
							return player.canUse(card, current);
						});
						for (var i = 0; i < list.length; i++) {
							var giveup = false;
							var targets = [list[i]];
							info.changeTarget(player, targets);
							for (var j = 0; j < targets.length; j++) {
								if (group != "ye" && targets[j].identity != "unknown" && targets[j].identity != "ye" && targets[j].identity != group && (!double || !double.includes(targets[j].identity))) {
									giveup = true;
									break;
								}
							}
							if (giveup) {
								continue;
							}
							if (giveup == false) {
								return true;
							}
						}
						return false;
					} else {
						return game.hasPlayer(function (current) {
							return evt.filterTarget(card, player, current) && (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity)));
						});
					}
				}
			},
			check(button) {
				if (ui.selected.buttons.length) {
					var evt = _status.event.getParent("chooseToUse");
					var name = button.link[2];
					var group = lib.character[ui.selected.buttons[0].link][1];
					var double = get.is.double(ui.selected.buttons[0].link, true);
					var player = _status.event.player;
					if (evt.type == "dying") {
						if (evt.dying != player && get.effect(evt.dying, { name: name }, player, player) <= 0) {
							return 0;
						}
						if (name == "jiu") {
							return 2.1;
						}
						return 2;
					}
					if (!["tao", "juedou", "guohe", "shunshou", "wuzhong", "xietianzi", "yuanjiao", "taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) {
						return 0;
					}
					if (["taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) {
						var list = game.filterPlayer(function (current) {
							return (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity))) && player.canUse({ name: name }, current);
						});
						var num = 0;
						for (var i = 0; i < list.length; i++) {
							num += get.effect(list[i], { name: name }, player, player);
						}
						if (num <= 0) {
							return 0;
						}
						if (list.length > 1) {
							return (1.7 + Math.random()) * Math.max(num, 1);
						}
					}
				}
				return 1 + Math.random();
			},
			backup(links, player) {
				var name = links[1][2],
					nature = links[1][3] || null;
				var character = links[0],
					group = lib.character[character][1];
				var next = {
					character: character,
					group: group,
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					audio: "yigui",
					viewAs: {
						name: name,
						nature: nature,
						isCard: true,
					},
					filterTarget(card, player, target) {
						var xx = lib.skill.fakeyigui_backup;
						var evt = _status.event;
						var group = xx.group;
						var double = get.is.double(xx.character, true);
						var info = get.info(card);
						if (!(info.singleCard && ui.selected.targets.length) && group != "ye" && target.identity != "unknown" && target.identity != "ye" && target.identity != group && (!double || !double.includes(target.identity))) {
							return false;
						}
						if (info.changeTarget) {
							var targets = [target];
							info.changeTarget(player, targets);
							for (var i = 0; i < targets.length; i++) {
								if (group != "ye" && targets[i].identity != "unknown" && targets[i].identity != "ye" && targets[i].identity != group && (!double || !double.includes(targets[i].identity))) {
									return false;
								}
							}
						}
						if (evt._backup && evt._backup.filterTarget) {
							return evt._backup.filterTarget(card, player, target);
						}
						return lib.filter.filterTarget(card, player, target);
					},
					onuse(result, player) {
						var character = lib.skill.fakeyigui_backup.character;
						player.flashAvatar("fakeyigui", character);
						player.unmarkAuto("fakeyigui", [character]);
						_status.characterlist.add(character);
						game.log(player, "移去了一张", "#g“魂（" + get.translation(character) + "）”");
						if (!player.storage.fakeyigui2) {
							player.when({ global: "phaseBefore" }).then(() => delete player.storage.fakeyigui2);
						}
						player.markAuto("fakeyigui2", [get.type(result.card.name)]);
					},
				};
				return next;
			},
			prompt(links, player) {
				var name = links[1][2],
					character = links[0],
					nature = links[1][3];
				return "移除「" + get.translation(character) + "」并视为使用" + (get.translation(nature) || "") + get.translation(name);
			},
		},
		ai: {
			order: () => 1 + 10 * Math.random(),
			result: { player: 1 },
		},
		group: "fakeyigui_init",
		marktext: "魂",
		intro: {
			onunmark(storage) {
				_status.characterlist.addArray(storage);
				storage = [];
			},
			mark(dialog, storage, player) {
				if (storage && storage.length) {
					if (player.isUnderControl(true)) {
						dialog.addSmall([storage, "character"]);
					} else {
						return "共有" + get.cnNumber(storage.length) + "张“魂”";
					}
				} else {
					return "没有“魂”";
				}
			},
			content(storage) {
				return "共有" + get.cnNumber(storage.length) + "张“魂”";
			},
		},
		gainHun(player, num) {
			const list = _status.characterlist.randomGets(num);
			if (list.length) {
				_status.characterlist.removeArray(list);
				player.markAuto("fakeyigui", list);
				get.info("rehuashen").drawCharacter(player, list);
				game.log(player, "获得了" + get.cnNumber(list.length) + "张", "#g“魂”");
			}
		},
		subSkill: {
			backup: {},
			init: {
				audio: "fakeyigui",
				trigger: { player: "showCharacterAfter" },
				filter(event, player) {
					if (!event.toShow.some(i => get.character(i, 3).includes("fakeyigui"))) {
						return false;
					}
					return (
						game
							.getAllGlobalHistory(
								"everything",
								evt => {
									return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakeyigui"));
								},
								event
							)
							.indexOf(event) == 0
					);
				},
				forced: true,
				locked: false,
				content() {
					get.info("fakeyigui").gainHun(player, 2);
				},
			},
		},
	},
	fakejihun: {
		audio: "jihun",
		inherit: "jihun",
		content() {
			get.info("fakeyigui").gainHun(player, 1);
		},
		ai: { combo: "fakeyigui" },
		group: "fakejihun_zhiheng",
		subSkill: {
			zhiheng: {
				audio: "jihun",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getStorage("fakeyigui").length;
				},
				async cost(event, trigger, player) {
					const {
						result: { bool, links },
					} = await player.chooseButton([get.prompt("fakejihun"), '<div class="text center">弃置至多两张“魂”，然后获得等量的“魂”</div>', [player.getStorage("fakeyigui"), "character"]], [1, 2]).set("ai", button => {
						const getNum = character => {
							return (
								game.countPlayer(target => {
									const group = get.character(character, 1);
									if (group == "ye" || target.identity == group) {
										return true;
									}
									const double = get.is.double(character, true);
									if (double && double.includes(target.identity)) {
										return true;
									}
								}) + 1
							);
						};
						return game.countPlayer() - getNum(button.link);
					});
					event.result = { bool: bool, cost_data: links };
				},
				async content(event, trigger, player) {
					player.unmarkAuto("fakeyigui", event.cost_data);
					_status.characterlist.addArray(event.cost_data);
					game.log(player, "移除了" + get.cnNumber(event.cost_data.length) + "张", "#g“魂”");
					get.info("fakeyigui").gainHun(player, event.cost_data.length);
				},
			},
		},
	},
	fakejueyan: {
		mainSkill: true,
		init(player) {
			if (player.checkMainSkill("fakejueyan")) {
				player.removeMaxHp();
			}
		},
		audio: "drlt_jueyan",
		derivation: "fakejizhi",
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			const {
				result: { control },
			} = await player
				.chooseControl("判定区", "装备区", "手牌区", "cancel2")
				.set("prompt", "###" + get.prompt("fakejueyan") + '###<div class="text center">于本回合结束阶段弃置一个区域的所有牌，然后…</div>')
				.set("choiceList", ["判定区：跳过判定阶段，获得〖集智〗直到回合结束", "装备区：摸三张牌，本回合手牌上限+3", "手牌区：本回合使用【杀】的额定次数+3"])
				.set("ai", () => {
					const player = get.event("player");
					if (player.countCards("j", { type: "delay" })) {
						return "判定区";
					}
					if (player.countCards("h") < 3) {
						return "装备区";
					}
					if (
						player.countCards("hs", card => {
							return get.name(card) == "sha" && player.hasUseTarget(card);
						}) > player.getCardUsable("sha")
					) {
						return "手牌区";
					}
					return "判定区";
				});
			event.result = { bool: control != "cancel2", cost_data: control };
		},
		async content(event, trigger, player) {
			const position = { 判定区: "j", 装备区: "e", 手牌区: "h" }[event.cost_data];
			switch (position) {
				case "j":
					player.skip("phaseJudge");
					player.addTempSkills("fakejizhi");
					break;
				case "e":
					await player.draw(3);
					player.addTempSkill("drlt_jueyan3");
					break;
				case "h":
					player.addTempSkill("drlt_jueyan1");
					break;
			}
			player
				.when("phaseJieshuBegin")
				.then(() => {
					if (player.countCards(pos)) {
						player.discard(player.getCards(pos));
					}
				})
				.vars({ pos: position });
		},
	},
	fakejizhi: {
		audio: "rejizhi",
		audioname2: {
			gz_lukang: "rejizhi_lukang",
			new_simayi: "rejizhi_new_simayi",
		},
		inherit: "jizhi",
	},
	fakequanji: {
		audio: "gzquanji",
		inherit: "gzquanji",
		filter(event, player, name) {
			return !player.hasHistory("useSkill", evt => {
				return evt.skill == "fakequanji" && evt.event.triggername == name;
			});
		},
		async content(event, trigger, player) {
			const num = Math.max(1, Math.min(player.maxHp, player.getExpansions("fakequanji").length));
			await player.draw(num);
			const hs = player.getCards("he");
			let result;
			if (hs.length > 0) {
				if (hs.length <= num) {
					result = { bool: true, cards: hs };
				} else {
					result = await player.chooseCard("he", true, "选择" + get.cnNumber(num) + "张牌作为“权”", num, "allowChooseAll").forResult();
				}
				if (result?.bool) {
					const cards = result.cards;
					const next = player.addToExpansion(cards, player, "give");
					next.gaintag.add("fakequanji");
					await next;
				}
			}
		},
		mod: {
			maxHandcard(player, num) {
				return num + Math.max(1, Math.min(player.maxHp, player.getExpansions("fakequanji").length));
			},
		},
		ai: {
			notemp: true,
		},
	},
	fakepaiyi: {
		audio: "gzpaiyi",
		enable: "phaseUse",
		filterTarget: true,
		usable: 1,
		async content(event, trigger, player) {
			const target = event.target;
			const {
				result: { junling, targets },
			} = await player.chooseJunlingFor(target);
			if (junling) {
				const str = get.translation(player),
					num = Math.max(1, Math.min(player.maxHp, player.getExpansions("fakequanji").length));
				const cnNum = get.cnNumber(num);
				const {
					result: { index },
				} = await target
					.chooseJunlingControl(player, junling, targets)
					.set("prompt", "排异")
					.set("choiceList", ["执行此军令，然后" + str + "摸" + cnNum + "张牌并将一张“权”置入弃牌堆", "不执行此军令，然后" + str + "可以对至多" + cnNum + "名与你势力相同的角色各造成1点伤害并移去等量的“权”"])
					.set("ai", () => {
						const all = Math.max(1, Math.min(player.maxHp, player.getExpansions("fakequanji").length));
						const effect = get.junlingEffect(player, junling, target, targets, target);
						const eff1 = effect + get.effect(player, { name: "draw" }, player, target) * all;
						const eff2 = ((source, player, num) => {
							let targets = game
								.filterPlayer(current => {
									return current.isFriendOf(player) && get.damageEffect(current, source, source) > 0 && get.damageEffect(current, source, player) < 0;
								})
								.sort((a, b) => {
									return (get.damageEffect(b, source, source) > 0 - get.damageEffect(b, source, player)) - (get.damageEffect(a, source, source) > 0 - get.damageEffect(a, source, player));
								})
								.slice(0, num);
							return targets.reduce((sum, target) => {
								return sum + (get.damageEffect(target, source, source) - get.damageEffect(target, source, player)) / 2;
							}, 0);
						})(player, target, all);
						return Math.max(0, get.sgn(eff2 - eff1));
					});
				if (index == 0) {
					await target.carryOutJunling(player, junling, targets);
					await player.draw(num);
					if (player.getExpansions("fakequanji").length) {
						const {
							result: { bool, links },
						} = await player.chooseButton(["排异：请移去一张“权”", player.getExpansions("fakequanji")], true);
						if (bool) {
							await player.loseToDiscardpile(links);
						}
					}
				} else {
					const { result } = await player
						.chooseTarget(
							"排异：是否对至多" + cnNum + "名与" + get.translation(target) + "势力相同的角色各造成1点伤害并移去等量的“权”？",
							(card, player, target) => {
								return target.isFriendOf(get.event("target"));
							},
							[1, num]
						)
						.set("target", target)
						.set("ai", target => {
							return get.damageEffect(target, get.event("player"), get.event("player"));
						});
					if (result.bool) {
						const targetx = result.targets.sortBySeat();
						player.line(targetx);
						for (const i of targetx) {
							await i.damage();
						}
						if (player.getExpansions("fakequanji").length) {
							const {
								result: { bool, links },
							} = await player.chooseButton(["排异：请移去" + get.cnNumber(targetx.length) + "张“权”", player.getExpansions("fakequanji")], targetx.length, true);
							if (bool) {
								await player.loseToDiscardpile(links);
							}
						}
					}
				}
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					return -game.countPlayer(current => {
						return current == target || current.isFriendOf(target);
					});
				},
			},
			combo: "fakequanji",
		},
	},
	fakeshilu: {
		audio: "zyshilu",
		trigger: { player: ["phaseZhunbeiBegin", "phaseUseEnd"] },
		filter(event, player) {
			if (event.name == "phaseZhunbei") {
				return player.getStorage("fakeshilu").length;
			}
			if (!player.hasViceCharacter()) {
				return false;
			}
			const skills = get.character(player.name2, 3).filter(i => !get.is.locked(i, player));
			return !player.hasHistory("useSkill", evt => skills.includes(evt.sourceSkill || evt.skill));
		},
		forced: true,
		//locked: false,
		async content(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				const num = player.getStorage("fakeshilu").length;
				await player.chooseToDiscard(num, "h", true);
				await player.draw(num);
			} else {
				await player.changeVice().setContent(get.info("fakeshilu").changeVice);
			}
		},
		getGroups(player) {
			return player
				.getStorage("fakeshilu")
				.map(i => {
					const double = get.is.double(i, true);
					return double ? double : [get.character(i, 1)];
				})
				.reduce((all, groups) => {
					all.addArray(groups);
					return all;
				}, []);
		},
		changeVice() {
			"step 0";
			player.showCharacter(2);
			if (!event.num) {
				event.num = 3;
			}
			var group = player.identity;
			if (!lib.group.includes(group)) {
				group = lib.character[player.name1][1];
			}
			_status.characterlist.randomSort();
			event.tochange = [];
			for (var i = 0; i < _status.characterlist.length; i++) {
				if (_status.characterlist[i].indexOf("gz_jun_") == 0) {
					continue;
				}
				var goon = false,
					group2 = lib.character[_status.characterlist[i]][1];
				if (group == "ye") {
					if (group2 != "ye") {
						goon = true;
					}
				} else {
					if (group == group2) {
						goon = true;
					} else {
						var double = get.is.double(_status.characterlist[i], true);
						if (double && double.includes(group)) {
							goon = true;
						}
					}
				}
				if (goon) {
					event.tochange.push(_status.characterlist[i]);
				}
			}
			event.tochange = event.tochange
				.filter(character => {
					const groups = get.info("fakeshilu").getGroups(player);
					const doublex = get.is.double(character, true);
					const group = doublex ? doublex : [get.character(character, 1)];
					return !group.some(j => groups.includes(j));
				})
				.randomGets(event.num);
			if (!event.tochange.length) {
				event.finish();
			} else {
				if (event.tochange.length == 1) {
					event._result = {
						bool: true,
						links: event.tochange,
					};
				} else {
					player.chooseButton(true, ["请选择要变更的武将牌，并将原副将武将牌置于武将牌上", [event.tochange, "character"]]).ai = function (button) {
						return get.guozhanRank(button.link);
					};
				}
			}
			"step 1";
			var name = result.links[0];
			_status.characterlist.remove(name);
			if (player.hasViceCharacter()) {
				event.change = true;
			}
			event.toRemove = player.name2;
			event.toChange = name;
			if (event.change) {
				event.trigger("removeCharacterBefore");
			}
			if (event.hidden) {
				if (!player.isUnseen(1)) {
					player.hideCharacter(1);
				}
			}
			"step 2";
			var name = event.toChange;
			if (event.hidden) {
				game.log(player, "替换了副将", "#g" + get.translation(player.name2));
			} else {
				game.log(player, "将副将从", "#g" + get.translation(player.name2), "变更为", "#g" + get.translation(name));
			}
			player.viceChanged = true;
			player.reinitCharacter(player.name2, name, false);
			"step 3";
			if (event.change && event.toRemove) {
				const list = [event.toRemove];
				player.markAuto("fakeshilu", list);
				game.log(player, "将", "#g" + get.translation(list), "置于武将牌上作为", "#y“戮”");
				game.broadcastAll(
					(player, list) => {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = "huashen_card_" + list[i];
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + list[i],
							};
							lib.translate[cardname] = get.rawName2(list[i]);
							cards.push(game.createCard(cardname, "", ""));
						}
						player.$draw(cards, "nobroadcast");
					},
					player,
					list
				);
			}
		},
		marktext: "戮",
		intro: {
			content: "character",
			onunmark(storage, player) {
				if (storage && storage.length) {
					_status.characterlist.addArray(storage);
					storage = [];
				}
			},
			mark(dialog, storage, player) {
				if (storage && storage.length) {
					dialog.addSmall([storage, "character"]);
				} else {
					return "没有“戮”";
				}
			},
		},
	},
	fakexiongnve: {
		audio: "zyxiongnve",
		trigger: {
			source: "damageBegin1",
			player: ["damageBegin3", "damageBegin4"],
		},
		filter(event, player, name) {
			if (!event.source) {
				return false;
			}
			const num = parseInt(name.slice("damageBegin".length));
			const groups = get.info("fakeshilu").getGroups(player);
			const goon = event.card && event.card.name == "sha";
			if (num != 4) {
				return goon && (groups.includes(event.source.identity) || groups.includes(event.player.identity));
			}
			return !goon && groups.includes(event.source.identity);
		},
		forced: true,
		//locked: false,
		logTarget(event, player) {
			return event.source == player ? event.player : event.source;
		},
		async content(event, trigger, player) {
			trigger[parseInt(event.triggername.slice("damageBegin".length)) == 4 ? "decrease" : "increase"]("num");
		},
		ai: {
			combo: "fakeshilu",
			effect: {
				target(card, player, target) {
					if (card && card.name == "sha") {
						return;
					}
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					const groups = get.info("fakeshilu").getGroups(target);
					if (groups.includes(player.identity)) {
						var num = get.tag(card, "damage");
						if (num) {
							if (num > 1) {
								return 0.5;
							}
							return 0;
						}
					}
				},
			},
		},
	},
	fakehuaiyi: {
		audio: "gzhuaiyi",
		enable: "phaseUse",
		filter(event, player) {
			if (!game.hasPlayer(target => target.isMajor())) {
				return false;
			}
			return (
				player.hasViceCharacter() ||
				["h", "e", "j"].some(pos => {
					const cards = player.getCards(pos);
					return cards.length && cards.every(card => lib.filter.cardDiscardable(card, player));
				})
			);
		},
		usable: 1,
		chooseButton: {
			dialog() {
				return ui.create.dialog("###怀异###" + get.translation("fakehuaiyi_info"));
			},
			chooseControl(event, player) {
				let list = [],
					map = { h: "手牌区", e: "装备区", j: "判定区" };
				list.addArray(
					["h", "e", "j"]
						.filter(pos => {
							const cards = player.getCards(pos);
							return cards.length && cards.every(card => lib.filter.cardDiscardable(card, player));
						})
						.map(i => map[i])
				);
				if (player.hasViceCharacter()) {
					list.push("移除副将");
				}
				list.push("cancel2");
				return list;
			},
			check() {
				const player = get.event("player"),
					count = pos => {
						const cards = player.getCards(pos);
						return cards.length && cards.every(card => lib.filter.cardDiscardable(card, player));
					};
				if (count("j")) {
					return "判定区";
				}
				if (player.hasViceCharacter() && get.guozhanRank(player.name2, player) <= 3) {
					return "移除副将";
				}
				if (count("e") && player.getCards("e") <= 1) {
					return "装备区";
				}
				if (count("h") && player.getCards("h") <= 2) {
					return "手牌区";
				}
				return "cancel2";
			},
			backup(result, player) {
				return {
					audio: "gzhuaiyi",
					filterCard: () => false,
					selectCard: -1,
					info: result.control,
					async content(event, trigger, player) {
						const control = get.info("fakehuaiyi_backup").info;
						if (control == "移除副将") {
							await player.removeCharacter(1);
						} else {
							const map = { 手牌区: "h", 装备区: "e", 判定区: "j" };
							await player.discard(player.getCards(map[control]));
						}
						let num = {};
						const targetx = game.filterPlayer(target => target.isMajor());
						for (const target of targetx) {
							if (typeof num[target.identity] != "number") {
								num[target.identity] = 0;
							}
						}
						let groups = Object.keys(num);
						const competition = groups.length > 1;
						for (const target of targetx) {
							if (target == player) {
								continue;
							}
							const {
								result: { bool, cards },
							} = await target
								.chooseToGive(player, "he", true, [1, Infinity], "怀异：交给" + get.translation(player) + "至少一张牌")
								.set("ai", card => {
									const player = get.event("player"),
										targets = get.event("targetx");
									if (
										!get.event("competition") ||
										!game.hasPlayer(target => {
											return target.isFriendOf(player) && target.hasViceCharacter() && get.guozhanRank(target.name2, target) > 4;
										})
									) {
										return -get.value(card);
									}
									if (ui.selected.cards.length >= get.rand(2, 3)) {
										return 0;
									}
									return 7.5 - get.value(card);
								})
								.set("targets", targetx)
								.set("num", num)
								.set("prompt2", competition ? "交牌最少的势力的一名角色的副将会被移除" : "")
								.set("complexCard", true)
								.set("competition", competition);
							if (bool) {
								num[target.identity] += cards.length;
							}
						}
						groups.sort((a, b) => num[a] - num[b]);
						const group = groups[0];
						if (num[group] < num[groups[groups.length - 1]]) {
							player.line(targetx.filter(target => target.identity == group));
							if (targetx.some(target => target.identity == group && target.hasViceCharacter())) {
								const {
									result: { bool, targets },
								} = await player
									.chooseTarget(
										"怀异：移除" + get.translation(group) + "势力的其中一名角色的副将",
										(card, player, target) => {
											return target.identity == get.event("group") && target.hasViceCharacter();
										},
										true
									)
									.set("group", group)
									.set("ai", target => -get.guozhanRank(target.name2, target));
								if (bool) {
									const target = targets[0];
									player.line(target);
									game.log(player, "选择了", target);
									await target.removeCharacter(1);
								}
							}
						}
					},
					ai: { result: { player: 1 } },
				};
			},
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (!game.hasPlayer(i => i.isMajor() && get.attitude(player, i) < 0)) {
						return 0;
					}
					if (player.getCards("j").every(card => lib.filter.cardDiscardable(card, player))) {
						return 1;
					}
					if (player.hasViceCharacter() && get.guozhanRank(player.name2, player) <= 3) {
						return 1;
					}
					if (player.getCards("e").every(card => lib.filter.cardDiscardable(card, player)) && player.getCards("e") <= 1) {
						return 1;
					}
					if (player.getCards("h").every(card => lib.filter.cardDiscardable(card, player)) && player.getCards("h") <= 1) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: { backup: {} },
	},
	fakezisui: {
		audio: "gzzisui",
		trigger: { global: "removeCharacterEnd" },
		filter(event, player) {
			return event.getParent().player == player;
		},
		forced: true,
		content() {
			const list = [trigger.toRemove];
			player.markAuto("fakezisui", list);
			game.log(player, "将", "#g" + get.translation(list), "置于武将牌上作为", "#y“异”");
			game.broadcastAll(
				(player, list) => {
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						var cardname = "huashen_card_" + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: "character:" + list[i],
						};
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, "", ""));
					}
					player.$draw(cards, "nobroadcast");
				},
				player,
				list
			);
		},
		marktext: "异",
		intro: {
			content: "character",
			onunmark(storage, player) {
				if (storage && storage.length) {
					_status.characterlist.addArray(storage);
					storage = [];
				}
			},
			mark(dialog, storage, player) {
				if (storage && storage.length) {
					dialog.addSmall([storage, "character"]);
				} else {
					return "没有“异”";
				}
			},
		},
		group: "fakezisui_effect",
		subSkill: {
			effect: {
				audio: "gzzisui",
				trigger: { player: ["phaseDrawBegin2", "phaseJieshuBegin"] },
				filter(event, player) {
					const num = player.getStorage("fakezisui").length;
					if (!num) {
						return false;
					}
					if (event.name == "phaseDraw") {
						return !event.numFixed;
					}
					return num > player.maxHp;
				},
				forced: true,
				content() {
					const num = player.getStorage("fakezisui").length;
					if (trigger.name == "phaseDraw") {
						trigger.num += num;
					} else {
						player.die();
					}
				},
			},
		},
	},
	fakejujian: {
		audio: "gzjujian",
		init(player) {
			if (player.checkViceSkill("fakejujian") && !player.viceChanged) {
				player.removeMaxHp();
			}
		},
		viceSkill: true,
		filter(event, player) {
			return player.countCards("he", card => {
				return _status.connectMode || (get.type(card) != "basic" && lib.filter.cardDiscardable(card, player));
			});
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseCardTarget({
				prompt: get.prompt2("fakejujian"),
				filterTarget(card, player, target) {
					return target.isFriendOf(player);
				},
				filterCard(card, player) {
					return get.type(card) != "basic" && lib.filter.cardDiscardable(card, player);
				},
				position: "he",
				ai1(card) {
					return 7.5 - get.value(card);
				},
				ai2(target) {
					const player = get.event("player");
					return Math.max(get.effect(target, { name: "wuzhong" }, player, player), get.recoverEffect(target, player, player));
				},
			});
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			const target = event.targets[0];
			await target.chooseDrawRecover(2, "举荐：摸两张牌或回复1点体力", true);
			await target.mayChangeVice();
		},
	},
	fakexibing: {
		audio: "xibing",
		filter(event, player) {
			if (player == event.player || event.targets.length != 1 || event.player.countCards("h") >= event.player.hp) {
				return false;
			}
			var bool = function (card) {
				return (card.name == "sha" || get.type(card, null, false) == "trick") && get.color(card, false) == "black";
			};
			if (!bool(event.card)) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (evt.player != event.player) {
				return false;
			}
			return (
				event.player.getHistory("useCard", function (evtx) {
					return bool(evtx.card) && evtx.getParent("phaseUse") == evt;
				})[0] == event.getParent()
			);
		},
		logTarget: "player",
		check(event, player) {
			var target = event.player;
			var att = get.attitude(player, target);
			var num2 = Math.min(5, target.hp) - target.countCards("h");
			if (num2 <= 0) {
				return att <= 0;
			}
			var num = target.countCards("h", function (card) {
				return target.hasValueTarget(card, null, true);
			});
			if (!num) {
				return att > 0;
			}
			return (num - num2) * att < 0;
		},
		preHidden: true,
		content() {
			"step 0";
			var num = trigger.player.hp - trigger.player.countCards("h");
			if (num > 0) {
				trigger.player.draw(num);
			}
			"step 1";
			trigger.player.addTempSkill("fakexibing_banned");
			if (get.mode() != "guozhan" || player.isUnseen(2) || trigger.player.isUnseen(2)) {
				event.finish();
			}
			"step 2";
			var target = trigger.player;
			var players1 = [player.name1, player.name2];
			var players2 = [target.name1, target.name2];
			player
				.chooseButton(2, ["是否暗置自己和" + get.translation(target) + "的各一张武将牌？", '<div class="text center">你的武将牌</div>', [players1, "character"], '<div class="text center">' + get.translation(target) + "的武将牌</div>", [players2, "character"]])
				.set("players", players1)
				.set("complexSelect", true)
				.set("filterButton", function (button) {
					return !get.is.jun(button.link) && (ui.selected.buttons.length == 0) == _status.event.players.includes(button.link);
				});
			"step 3";
			if (result.bool) {
				var target = trigger.player;
				player.hideCharacter(player.name1 == result.links[0] ? 0 : 1);
				target.hideCharacter(target.name1 == result.links[1] ? 0 : 1);
				player.addTempSkill("fakexibing_nomingzhi");
				target.addTempSkill("fakexibing_nomingzhi");
			}
		},
		subSkill: {
			banned: {
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
			},
			nomingzhi: {
				ai: { nomingzhi: true },
			},
		},
	},
	fakechengshang: {
		audio: "chengshang",
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!lib.suit.includes(get.suit(event.card, false)) || typeof get.number(event.card) != "number") {
				return false;
			}
			if (
				player.getHistory("sourceDamage", evt => {
					return evt.card == event.card;
				}).length
			) {
				return false;
			}
			const phsu = event.getParent("phaseUse");
			if (!phsu || phsu.player != player) {
				return false;
			}
			return event.targets.some(i => i.isEnemyOf(player));
		},
		usable: 1,
		preHidden: true,
		async content(event, trigger, player) {
			await player.draw();
			player.tempBanSkill("fakechengshang", "phaseUseAfter", false);
			player.addTempSkill("fakechengshang_effect");
			player.markAuto("fakechengshang_effect", [[get.suit(trigger.card), get.number(trigger.card), trigger.card.name]]);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				hiddenCard(player, name) {
					const type = get.type(name);
					if (type != "basic" && type != "trick") {
						return false;
					}
					const storage = player.getStorage("fakechengshang_effect");
					return lib.card.list.some(list => {
						return (
							name == list[2] &&
							storage.some(card => {
								return card[0] == list[0] && card[1] == list[1] && card[2] != list[2];
							})
						);
					});
				},
				audio: "chengshang",
				enable: "phaseUse",
				chooseButton: {
					dialog(event, player) {
						const storage = player.getStorage("fakechengshang_effect");
						const list = lib.card.list
							.filter(list => {
								const type = get.type(list[2]);
								if (type != "basic" && type != "trick") {
									return false;
								}
								return storage.some(card => card[0] == list[0] && card[1] == list[1] && card[2] != list[2]);
							})
							.map(card => [get.translation(get.type2(card[2])), "", card[2], card[3]]);
						return ui.create.dialog("承赏", [list, "vcard"]);
					},
					filter(button, player) {
						return get.event().getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, event);
					},
					check(button) {
						const player = get.event("player");
						const card = { name: button.link[2], nature: button.link[3] };
						if (player.countCards("hes", cardx => cardx.name == card.name)) {
							return 0;
						}
						return player.getUseValue(card);
					},
					backup(links, player) {
						return {
							audio: "chengshang",
							filterCard: true,
							position: "hs",
							popname: true,
							log: false,
							precontent() {
								player.logSkill("fakechengshang_effect");
								const cardx = event.result.card;
								const removes = player.getStorage("fakechengshang_effect").filter(card => {
									return lib.card.list.some(list => {
										return cardx.name == list[2] && card[0] == list[0] && card[1] == list[1] && card[2] != list[2];
									});
								});
								player.unmarkAuto("fakechengshang_effect", removes);
							},
							viewAs: {
								name: links[0][2],
								nature: links[0][3],
							},
						};
					},
					prompt(links, player) {
						return "将一张手牌当作" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
					},
				},
			},
		},
	},
	fakezhente: {
		audio: "zhente",
		inherit: "zhente",
		filter(event, player) {
			var color = get.color(event.card),
				type = get.type(event.card);
			if (player == event.player || event.player.isDead() || color == "none") {
				return false;
			}
			return type == "trick" || (type == "basic" && color == "black");
		},
	},
	fakezhiwei: {
		unique: true,
		audio: "zhiwei",
		inherit: "zhiwei",
		filter(event, player, name) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			return (
				event.name == "showCharacter" &&
				event.toShow.some(name => {
					return get.character(name, 3).includes("fakezhiwei");
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget("请选择【至微】的目标", true, lib.filter.notMe)
				.set("ai", target => {
					var att = get.attitude(_status.event.player, target);
					if (att > 0) {
						return 1 + att;
					}
					return Math.random();
				})
				.set("prompt2", lib.translate.fakezhiwei_info);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("fakezhiwei", target);
				player.storage.fakezhiwei_effect = target;
				player.addSkill("fakezhiwei_effect");
			}
		},
		onremove(player) {
			player.removeSkill("fakezhiwei_effect");
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				audio: "zhiwei",
				trigger: { player: "hideCharacterBefore" },
				filter(event, player) {
					return get.character(event.toHide, 3).includes("fakezhiwei");
				},
				forced: true,
				content() {
					trigger.cancel();
				},
				mark: "character",
				intro: { content: "已选择$" },
				group: ["fakezhiwei_draw", "fakezhiwei_discard", "fakezhiwei_gain", "fakezhiwei_clear"],
			},
			draw: {
				audio: "zhiwei",
				trigger: { global: "damageSource" },
				forced: true,
				filter(event, player) {
					return event.source == player.storage.fakezhiwei_effect;
				},
				logTarget: "source",
				content() {
					player.draw();
				},
			},
			discard: {
				audio: "zhiwei",
				trigger: { global: "damageEnd" },
				forced: true,
				filter(event, player) {
					return (
						event.player == player.storage.fakezhiwei_effect &&
						player.hasCard(card => {
							return _status.connectMode || lib.filter.cardDiscardable(card, player);
						}, "h")
					);
				},
				logTarget: "player",
				content() {
					player.chooseToDiscard("h", true);
				},
			},
			gain: {
				audio: "zhiwei",
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				forced: true,
				filter(event, player) {
					if (event.type != "discard" || event.getlx === false || event.getParent("phaseDiscard").player != player || !player.storage.fakezhiwei_effect || !player.storage.fakezhiwei_effect.isIn()) {
						return false;
					}
					var evt = event.getl(player);
					return evt && evt.cards2.filterInD("d").length > 0;
				},
				logTarget(event, player) {
					return player.storage.fakezhiwei_effect;
				},
				content() {
					if (trigger.delay === false) {
						game.delay();
					}
					player.storage.fakezhiwei_effect.gain(trigger.getl(player).cards2.filterInD("d"), "gain2");
				},
			},
			clear: {
				audio: "zhiwei",
				trigger: {
					global: "die",
					player: ["hideCharacterEnd", "removeCharacterEnd"],
				},
				forced: true,
				filter(event, player) {
					if (event.name == "die") {
						return event.player == player.storage.fakezhiwei_effect;
					}
					if (event.name == "removeCharacter") {
						return get.character(event.toRemove, 3).includes("fakezhiwei");
					}
					return get.character(event.toHide, 3).includes("fakezhiwei");
				},
				content() {
					"step 0";
					player.removeSkill("fakezhiwei_effect");
					if (trigger.name != "die") {
						event.finish();
					}
					"step 1";
					if (get.character(player.name1, 3).includes("fakezhiwei")) {
						player.hideCharacter(0);
					}
					if (get.character(player.name2, 3).includes("fakezhiwei")) {
						player.hideCharacter(1);
					}
				},
			},
		},
	},
	fakekuangcai: {
		inherit: "gzrekuangcai",
		content() {
			const goon = Boolean(player.getHistory("useCard").length);
			get.info("rekuangcai").change(player, goon ? -1 : 1);
			player
				.when({ global: "phaseAfter" })
				.then(() => {
					get.info("rekuangcai").change(player, goon ? 1 : -1);
				})
				.vars({ goon: goon });
		},
	},
	faketunchu: {
		audio: "tunchu",
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed;
		},
		check(event, player) {
			return player.countCards("h") <= 2;
		},
		locked: false,
		preHidden: true,
		content() {
			trigger.num += 2;
			player
				.when(["phaseDrawEnd", "phaseDrawSkipped", "phaseDrawCancelled"])
				.filter(evt => evt == trigger)
				.then(() => {
					var nh = player.countCards("h");
					if (nh) {
						player.chooseCard("h", [1, Math.min(nh, 2)], "将至多两张手牌置于你的武将牌上", true).set("ai", card => {
							return 7.5 - get.value(card);
						});
					} else {
						player.addTempSkill("faketunchu_effect");
						event.finish();
					}
				})
				.then(() => {
					if (result.bool) {
						player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("faketunchu");
					}
				})
				.then(() => {
					player.addTempSkill("faketunchu_effect");
				});
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		marktext: "粮",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						if (card.name == "sha") {
							return false;
						}
					},
				},
				mark: true,
				intro: { content: "本回合不能使用【杀】" },
			},
		},
	},
	fakeshuliang: {
		audio: "shuliang",
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			const num = player.getExpansions("faketunchu").length;
			if (!num || !event.player.isFriendOf(player)) {
				return false;
			}
			return event.player.isIn() && get.distance(player, event.player) <= num;
		},
		async cost(event, trigger, player) {
			const {
				result: { bool, links },
			} = await player
				.chooseButton([get.prompt2("fakeshuliang", trigger.player), player.getExpansions("faketunchu")])
				.set("ai", button => {
					if (get.attitude(get.event("player"), get.event().getTrigger().player) <= 0) {
						return 0;
					}
					return 1 + Math.random();
				})
				.setHiddenSkill("fakeshuliang");
			event.result = { bool: bool, cost_data: links };
		},
		preHidden: true,
		logTarget: "player",
		content() {
			player.loseToDiscardpile(event.cost_data);
			trigger.player.draw(2);
		},
		ai: { combo: "faketunchu" },
	},
	fakedujin: {
		audio: "dujin",
		inherit: "dujin",
		filter(event, player) {
			return player.countCards("e") && !event.numFixed;
		},
		content() {
			trigger.num += Math.ceil(player.countCards("e") / 2);
		},
		group: "fakedujin_first",
		subSkill: {
			first: {
				audio: "dujin",
				trigger: { player: "showCharacterEnd" },
				filter(event, player) {
					if (
						game
							.getAllGlobalHistory(
								"everything",
								evt => {
									return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakedujin"));
								},
								event
							)
							.indexOf(event) != 0
					) {
						return false;
					}
					return (
						game.getAllGlobalHistory("everything", evt => {
							return evt.name == "showCharacter" && evt.player.isFriendOf(player);
						})[0].player == player
					);
				},
				forced: true,
				locked: false,
				content() {
					player.addMark("xianqu_mark", 1);
				},
			},
		},
	},
	fakezhufu: {
		audio: "spwuku",
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => {
				return get.info("fakezhufu").filterCard(card, player);
			}, "he");
		},
		filterCard(card, player) {
			if (!lib.suit.includes(get.suit(card))) {
				return false;
			}
			return lib.filter.cardDiscardable(card, player) && !player.getStorage("fakezhufu_effect").includes(get.suit(card));
		},
		position: "he",
		check(card) {
			const player = get.event("player");
			let cards = player.getCards("hs", card => player.hasValueTarget(card, true, true));
			let discards = player.getCards("he", card => get.info("fakezhufu").filterCard(card, player));
			for (let i = 1; i < discards.length; i++) {
				if (discards.slice(0, i).some(card => get.suit(card) == get.suit(discards[i]))) {
					discards.splice(i--, 1);
				}
			}
			cards.removeArray(discards);
			if (!cards.length || !discards.length) {
				return 0;
			}
			cards.sort((a, b) => {
				return (player.getUseValue(b, true, true) > 0 ? get.order(b) : 0) - (player.getUseValue(a, true, true) > 0 ? get.order(a) : 0);
			});
			const cardx = cards[0];
			if (get.order(cardx, player) > 0 && discards.includes(card)) {
				if (
					(get.suit(card) == "heart" &&
						get.type(cardx) != "equip" &&
						(function (card, player) {
							const num = get.info("fakezhufu").getMaxUseTarget(card, player);
							return num != -1 && game.countPlayer(target => player.canUse(card, target, true, true) && get.effect(target, card, player, player) > 0) > num;
						})(cardx, player) &&
						game.hasPlayer(target => {
							return (
								target.isFriendOf(player) &&
								target.hasCard(cardy => {
									return lib.filter.cardDiscardable(cardy, target) && get.type2(cardy) == get.type2(cardx);
								}, "h")
							);
						})) ||
					(get.suit(card) == "diamond" &&
						get.type(cardx) != "equip" &&
						!game.hasPlayer(target => {
							return target.countCards("h") > player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0);
						})) ||
					(get.suit(card) == "spade" && player.getHp() == 1) ||
					(get.suit(card) == "club" && get.tag(cardx, "damage") && player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0) == 0)
				) {
					return 1 / (get.value(card) || 0.5);
				}
			}
			return 0;
		},
		async content(event, trigger, player) {
			const suit = get.suit(event.cards[0], player);
			player.addTempSkill("fakezhufu_effect", "phaseUseAfter");
			player.markAuto("fakezhufu_effect", [[suit, false]]);
		},
		ai: {
			order(item, player) {
				let cards = player.getCards("hs", card => player.hasValueTarget(card, true, true));
				let discards = player.getCards("he", card => get.info("fakezhufu").filterCard(card, player));
				for (let i = 1; i < discards.length; i++) {
					if (discards.slice(0, i).some(card => get.suit(card) == get.suit(discards[i]))) {
						discards.splice(i--, 1);
					}
				}
				cards.removeArray(discards);
				if (!cards.length || !discards.length) {
					return 0;
				}
				cards.sort((a, b) => {
					return (player.getUseValue(b, true, true) > 0 ? get.order(b) : 0) - (player.getUseValue(a, true, true) > 0 ? get.order(a) : 0);
				});
				const cardx = cards[0];
				return get.order(cardx, player) > 0 &&
					((discards.some(card => {
						return get.suit(card) == "heart";
					}) &&
						get.type(cardx) != "equip" &&
						(function (card, player) {
							const num = get.info("fakezhufu").getMaxUseTarget(card, player);
							return num != -1 && game.countPlayer(target => player.canUse(card, target, true, true) && get.effect(target, card, player, player) > 0) > num;
						})(cardx, player) &&
						game.hasPlayer(target => {
							return (
								target.isFriendOf(player) &&
								target.hasCard(cardy => {
									return lib.filter.cardDiscardable(cardy, target) && get.type2(cardy) == get.type2(cardx);
								}, "h")
							);
						})) ||
						(get.type(cardx) != "equip" &&
							discards.some(card => {
								return (
									get.suit(card) == "diamond" &&
									!game.hasPlayer(target => {
										return target.countCards("h") > player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0);
									})
								);
							})) ||
						(discards.some(card => {
							return get.suit(card) == "spade";
						}) &&
							player.getHp() == 1) ||
						(get.tag(cardx, "damage") &&
							discards.some(card => {
								return get.suit(card) == "club" && player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0) == 0;
							})))
					? get.order(cardx, player) + 0.00001
					: 0;
			},
			result: {
				player(player, target) {
					let cards = player.getCards("hs", card => player.hasValueTarget(card, true, true));
					let discards = player.getCards("he", card => get.info("fakezhufu").filterCard(card, player));
					discards = discards.sort((a, b) => get.value(a) - get.value(b));
					for (let i = 1; i < discards.length; i++) {
						if (discards.slice(0, i).some(card => get.suit(card) == get.suit(discards[i]))) {
							discards.splice(i--, 1);
						}
					}
					cards.removeArray(discards);
					if (!cards.length || !discards.length) {
						return 0;
					}
					if (
						(discards.some(card => {
							return get.suit(card) == "heart";
						}) &&
							cards.some(card => {
								return (
									get.type(card) != "equip" &&
									(function (card, player) {
										const num = get.info("fakezhufu").getMaxUseTarget(card, player);
										return num != -1 && game.countPlayer(target => player.canUse(card, target, true, true) && get.effect(target, card, player, player) > 0) > num;
									})(card, player) &&
									game.hasPlayer(target => {
										return (
											target.isFriendOf(player) &&
											target.hasCard(cardx => {
												return lib.filter.cardDiscardable(cardx, target) && get.type2(cardx) == get.type2(card);
											}, "h")
										);
									})
								);
							})) ||
						discards.some(card => {
							return (
								get.suit(card) == "diamond" &&
								cards.some(cardx => {
									return (
										get.type(cardx) != "equip" &&
										!game.hasPlayer(target => {
											return target.countCards("h") > player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0);
										})
									);
								})
							);
						}) ||
						(discards.some(card => {
							return get.suit(card) == "spade";
						}) &&
							player.getHp() == 1) ||
						discards.some(card => {
							return (
								get.suit(card) == "club" &&
								cards.some(cardx => {
									return get.tag(cardx, "damage") && player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0) == 0;
								})
							);
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content(storage) {
						const suitStorage = storage.slice().sort((a, b) => lib.suit.indexOf(a[0]) - lib.suit.indexOf(b[0]));
						const suits = suitStorage.reduce((str, list) => str + get.translation(list[0]), "");
						const usedSuits = suitStorage.filter(list => list[1]).reduce((str, list) => str + get.translation(list[0]), "");
						let str = "";
						str += "<li>已弃置过的花色：";
						str += suits;
						if (usedSuits.length) {
							str += "<br><li>已触发过的花色：";
							str += usedSuits;
						}
						return str;
					},
				},
				audio: "spwuku",
				trigger: { player: "yingbian" },
				filter(event, player) {
					return player.getStorage("fakezhufu_effect").some(list => !list[1]);
				},
				forced: true,
				firstDo: true,
				async content(event, trigger, player) {
					const list = player.getStorage("fakezhufu_effect").filter(i => !i[1]);
					const forced = (function (trigger, player) {
						if (trigger.forceYingbian || player.hasSkillTag("forceYingbian")) {
							return true;
						}
						const list = trigger.temporaryYingbian || [];
						return list.includes("force") || get.cardtag(trigger.card, "yingbian_force");
					})(trigger, player);
					if (forced) {
						player.popup("yingbian_force_tag", lib.yingbian.condition.color.get("force"));
						game.log(player, "触发了", "#g【注傅】", "为", trigger.card, "添加的应变条件");
					}
					const hasYingBian = trigger.temporaryYingbian || [],
						map = get.info("fakezhufu").YingBianMap;
					for (const j of list) {
						player.storage.fakezhufu_effect[player.getStorage("fakezhufu_effect").indexOf(j)][1] = true;
						const tag = map[j[0]][0],
							eff = map[j[0]][1];
						if (get.cardtag(trigger.card, `yingbian_${tag}`)) {
							continue;
						}
						if (j[0] == "heart") {
							if (!forced && !hasYingBian.includes("add")) {
								const { result } = await lib.yingbian.condition.complex.get("zhuzhan")(trigger);
								if (result.bool) {
									game.log(player, "触发了", "#g【注傅】", "为", trigger.card, "添加的应变条件（", "#g" + get.translation(j[0]), "）");
									trigger.yingbian_addTarget = true;
									player.addTempSkill("yingbian_changeTarget");
								}
							} else {
								if (!forced) {
									game.log(player, "触发了", "#g【注傅】", "为", trigger.card, "添加的应变条件（", "#g" + get.translation(j[0]), "）");
								}
								trigger.yingbian_addTarget = true;
								player.addTempSkill("yingbian_changeTarget");
							}
						} else {
							const goon = hasYingBian.includes(eff) || lib.yingbian.condition.simple.get(tag)(trigger);
							if (!forced && goon) {
								player.popup("yingbian_force_tag", lib.yingbian.condition.color.get(eff));
								game.log(player, "触发了", "#g【注傅】", "为", trigger.card, "添加的应变条件（", "#g" + get.translation(j[0]), "）");
							}
							if (forced || goon) {
								await game.yingbianEffect(trigger, lib.yingbian.effect.get(eff));
							}
						}
					}
				},
			},
		},
		YingBianMap: {
			heart: ["zhuzhan", "add"],
			diamond: ["fujia", "hit"],
			spade: ["canqu", "draw"],
			club: ["kongchao", "damage"],
		},
		getMaxUseTarget(card, player) {
			let range;
			const select = get.copy(get.info(card).selectTarget);
			if (select == undefined) {
				range = [1, 1];
			} else if (typeof select == "number") {
				range = [select, select];
			} else if (get.itemtype(select) == "select") {
				range = select;
			} else if (typeof select == "function") {
				range = select(card, player);
				if (typeof range == "number") {
					range = [range, range];
				}
			}
			game.checkMod(card, player, range, "selectTarget", player);
			return range;
		},
	},
	fakeguishu: {
		inherit: "hmkguishu",
		usable: 1,
	},
	fakeyuanyu: {
		inherit: "hmkyuanyu",
		filter(event, player) {
			if (event.num <= 0 || !event.source) {
				return false;
			}
			return !event.source.inRange(player);
		},
		content() {
			trigger.num--;
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (player.inRange(target)) {
						return;
					}
					const num = get.tag(card, "damage");
					if (num) {
						if (num > 1) {
							return 0.5;
						}
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	fakemibei: {
		audio: "mibei",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return !player.isMaxHandcard();
		},
		async cost(event, trigger, player) {
			const filterTarget = (card, player, target) => {
					return target != player && target.isMaxHandcard();
				},
				targetx = game.filterPlayer(current => filterTarget(null, player, current));
			if (targetx.length == 1) {
				event.result = { bool: true, targets: targetx };
			} else {
				event.result = await player
					.chooseTarget(filterTarget, true)
					.set("prompt2", lib.translate.fakemibei_info)
					.set("prompt", "请选择【秘备】的目标")
					.set("ai", target => {
						const player = get.event("player");
						return get.attitude(player, target);
					})
					.forResult();
			}
		},
		preHidden: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const {
				result: { junling, targets },
			} = await target.chooseJunlingFor(player);
			const {
				result: { index },
			} = await player.chooseJunlingControl(target, junling, targets).set("prompt", "秘备：是否执行军令？");
			if (index == 0) {
				await player.carryOutJunling(target, junling, targets);
			}
		},
		group: "fakemibei_junling",
		subSkill: {
			junling: {
				audio: "mibei",
				trigger: { player: ["carryOutJunlingEnd", "chooseJunlingControlEnd"] },
				filter(event, player) {
					if (event.name == "carryOutJunling") {
						return event.source.countCards("h") > player.countCards("h");
					}
					return event.result.index == 1 && player.countCards("h");
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					if (trigger.name == "carryOutJunling") {
						const num = Math.min(5, trigger.source.countCards("h") - player.countCards("h"));
						await player.draw(num);
					} else {
						const {
							result: { bool, cards },
						} = await player.chooseCard("秘备：展示一至三张手牌，本回合你可以将其中一张牌当作另一张基本牌或普通锦囊牌使用一次", [1, 3], true).set("ai", card => {
							const player = get.event("player"),
								goon = _status.currentPhase == player;
							if (goon) {
								return player.getUseValue(card) / get.value(card);
							}
							return get.value(card);
						});
						if (bool) {
							await player.showCards(cards, get.translation(player) + "发动了【秘备】");
							player.addGaintag(cards, "fakemibei_effect");
							player.addTempSkill("fakemibei_effect");
						}
					}
				},
			},
			effect: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("fakemibei_effect");
				},
				hiddenCard(player, name) {
					const cards = player.getCards("h", card => card.hasGaintag("fakemibei_effect"));
					if (cards.length < 2) {
						return false;
					}
					const type = get.type(name);
					if (type != "basic" && type != "trick") {
						return false;
					}
					return cards
						.slice()
						.map(i => i.name)
						.includes(name);
				},
				audio: "mibei",
				enable: "phaseUse",
				chooseButton: {
					dialog(event, player) {
						const list = player
							.getCards("h", card => {
								const type = get.type(card);
								if (type != "basic" && type != "trick") {
									return false;
								}
								return card.hasGaintag("fakemibei_effect");
							})
							.sort((a, b) => {
								return (
									lib.inpile.indexOf(a.name) +
									get.natureList(a, false).reduce((sum, nature) => {
										return sum + lib.inpile_nature.indexOf(nature);
									}, 0) -
									lib.inpile.indexOf(b.name) -
									get.natureList(b, false).reduce((sum, nature) => {
										return sum + lib.inpile_nature.indexOf(nature);
									}, 0)
								);
							})
							.slice()
							.map(card => [get.translation(get.type(card)), "", card.name, card.nature]);
						return ui.create.dialog("秘备", [list, "vcard"]);
					},
					filter(button, player) {
						const event = get.event().getParent();
						return event.filterCard({ name: button.link[2], nature: button.link[3] }, player, event);
					},
					check(button) {
						const player = get.event("player");
						const card = { name: button.link[2], nature: button.link[3] };
						if (player.countCards("hes", cardx => cardx.name == card.name)) {
							return 0;
						}
						return player.getUseValue(card);
					},
					backup(links, player) {
						return {
							audio: "chengshang",
							filterCard(card, player) {
								const cardx = get.info("fakemibei_effect_backup").viewAs;
								if (cardx.name == card.name && cardx.nature == card.nature) {
									return false;
								}
								return card.hasGaintag("fakemibei_effect");
							},
							position: "h",
							popname: true,
							log: false,
							precontent() {
								player.logSkill("fakemibei_effect");
								player.tempBanSkill("fakemibei_effect", null, false);
							},
							viewAs: {
								name: links[0][2],
								nature: links[0][3],
							},
						};
					},
					prompt(links, player) {
						return "将一张“秘备”牌当作" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
					},
				},
			},
		},
	},
	fakeqizhi: {
		audio: "qizhi",
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (!event.targets || !event.targets.length) {
				return false;
			}
			if (_status.currentPhase != player) {
				return false;
			}
			if (get.type(event.card) == "equip") {
				return false;
			}
			return game.hasPlayer(target => !event.targets.includes(target) && target.countCards("he") > 0);
		},
		direct: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("fakeqizhi"), (card, player, target) => {
					return !get.event().getTrigger().targets.includes(target) && target.countCards("he") > 0;
				})
				.set("ai", target => {
					const player = get.event("player");
					if (target == player) {
						return 2;
					}
					if (get.attitude(player, target) <= 0) {
						return 1;
					}
					return 0.5;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const {
				result: { bool, cards },
			} = await player.discardPlayerCard(target, "he", true);
			if (bool) {
				await target.draw();
				if (cards.some(i => get.suit(i, target) == get.suit(trigger.card))) {
					trigger.forceYingbian = true;
				}
			}
		},
	},
	fakejinqu: {
		audio: "jinqu",
		trigger: { player: "phaseJieshuBegin" },
		check(event, player) {
			return (
				player.getHistory("useSkill", evt => {
					return evt.skill == "fakeqizhi";
				}).length >= player.countCards("h")
			);
		},
		prompt2(event, player) {
			const num = player.getHistory("useSkill", evt => evt.skill == "fakeqizhi").length;
			return "摸两张牌，然后将手牌弃置至" + get.cnNumber(num) + "张";
		},
		content() {
			"step 0";
			player.draw(2);
			"step 1";
			var dh =
				player.countCards("h") -
				player.getHistory("useSkill", evt => {
					return evt.skill == "fakeqizhi";
				}).length;
			if (dh > 0) {
				player.chooseToDiscard(dh, true);
			}
		},
		ai: { combo: "fakeqizhi" },
	},
	fakejuzhan: {
		zhuanhuanji: true,
		locked: false,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "当你使用【杀】指定目标后，你可以获得其X张牌，然后若你的武将牌均明置，则其可以暗置此武将牌，且你本回合不能明置此武将牌（X为你已损失的体力值且至少为1）";
				}
				return "当你成为【杀】的目标后，你可以与其各摸X张牌，然后其武将牌均明置，则你可以暗置其一张武将牌，且其本回合不能明置此武将牌（X为其已损失的体力值且至少为1）";
			},
		},
		audio: "nzry_juzhan_1",
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player, name) {
			if (event.card.name != "sha" || player._isInJuzhan == name) {
				return false;
			}
			const storage = player.storage.fakejuzhan;
			if ((event.player == player) != Boolean(storage)) {
				return false;
			}
			if (storage && !event.target.countCards("he")) {
				return false;
			}
			return true;
		},
		async cost(event, trigger, player) {
			const storage = player.storage.fakejuzhan,
				target = trigger[storage ? "target" : "player"];
			event.result = await player.chooseBool(get.prompt2(event.skill, target)).setHiddenSkill("fakejuzhan").forResult();
			if (event.result.bool) {
				player._isInJuzhan = event.triggername;
			}
		},
		async content(event, trigger, player) {
			delete player._isInJuzhan;
			const storage = player.storage.fakejuzhan;
			player.changeZhuanhuanji("fakejuzhan");
			const target = trigger[storage ? "target" : "player"];
			const num = Math.max(target.getDamagedHp(), 1);
			if (!storage) {
				await player.draw(num, "nodelay");
				await target.draw(num);
				if (!target.isUnseen(2)) {
					const {
						result: { bool, links },
					} = await player.chooseButton(["拒战：是否暗置" + get.translation(target) + "的一张武将牌？", '<div class="text center">' + get.translation(target) + "的武将牌</div>", [[target.name1, target.name2], "character"]]).set("filterButton", button => !get.is.jun(button.link));
					if (bool) {
						await target.hideCharacter(target.name1 == links[0] ? 0 : 1);
						target.addTempSkill("donggui2");
					}
				}
			} else {
				await player.gainPlayerCard(target, num, "he", true, "allowChooseAll");
				const names = [player.name1, player.name2].filter(i => {
					return get.character(i, 3).includes("fakejuzhan");
				});
				if (!player.isUnseen(2) && names.length) {
					const {
						result: { bool, links },
					} = await target.chooseBool("拒战：是否暗置" + get.translation(player) + "的" + (names.includes(player.name1) ? "主将" : "") + (names.length > 1 ? "和" : "") + (names.includes(player.name2) ? "副将" : "") + "?");
					if (bool) {
						if (names.includes(player.name1)) {
							await player.hideCharacter(0);
						}
						if (names.includes(player.name2)) {
							await player.hideCharacter(1);
						}
						player.addTempSkill("donggui2");
					}
				}
			}
		},
		group: "fakejuzhan_mark",
		subSkill: {
			mark: {
				charlotte: true,
				trigger: { player: ["hideCharacterBegin", "showCharacterEnd"] },
				filter(event, player) {
					if (event.name == "hideCharacter") {
						return get.character(event.toHide, 3).includes("fakejuzhan");
					}
					return event.toShow?.some(name => {
						return get.character(name, 3).includes("fakejuzhan");
					});
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player[(trigger.name == "hideCharacter" ? "un" : "") + "markSkill"]("fakejuzhan");
				},
			},
		},
	},
	fakedanshou: {
		audio: "mobiledanshou",
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			return ["h", "e", "j"].some(pos => {
				const cards = player.getCards(pos);
				return cards.length > 0 && cards.every(card => lib.filter.cardDiscardable(card, player));
			});
		},
		async cost(event, trigger, player) {
			let list = [],
				map = { h: "手牌区", e: "装备区", j: "判定区" };
			list.addArray(
				["h", "e", "j"]
					.filter(pos => {
						const cards = player.getCards(pos);
						return cards.length > 0 && cards.every(card => lib.filter.cardDiscardable(card, player));
					})
					.map(i => map[i])
			);
			list.push("cancel2");
			const {
				result: { control },
			} = await player
				.chooseControl(list)
				.set("prompt", get.prompt2("fakedanshou", trigger.player))
				.set("ai", () => {
					const player = get.event().player,
						controls = get.event().controls.slice();
					if (controls.includes("判定区")) {
						return "判定区";
					}
					if (controls.includes("装备区") && player.countCards("e") < 3) {
						return "装备区";
					}
					if (controls.includes("手牌区") && player.countCards("e") < 5) {
						return "手牌区";
					}
					return "cancel2";
				});
			event.result = { bool: control != "cancel2", cost_data: control };
		},
		round: 1,
		logTarget: "player",
		async content(event, trigger, player) {
			player.popup(event.cost_data);
			await player.discard(player.getCards({ 手牌区: "h", 装备区: "e", 判定区: "j" }[event.cost_data]));
			player.addTempSkill("fakedanshou_effect");
			player.addMark("fakedanshou_effect", 1, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove(player) {
					delete player.storage.fakedanshou_effect;
					delete player._fakedanshou_effect;
				},
				audio: "mobiledanshou",
				trigger: {
					global: ["phaseJudgeBegin", "phaseDrawBegin", "phaseUseBegin", "phaseDiscardBegin"],
				},
				async cost(event, trigger, player) {
					const {
						result: { control },
					} = await player
						.chooseControl("摸牌", "增加摸牌数")
						.set("prompt", `胆守：请选择一项（当前为${get.translation(trigger.name)}）`)
						.set("ai", () => {
							const player = get.event().player,
								trigger = get.event().getTrigger();
							if (trigger.name == "phaseJudge") {
								return "增加摸牌数";
							}
							if (trigger.name == "phaseDiscard") {
								return "摸牌";
							}
							if (trigger.name == "phaseDraw") {
								if (get.damageEffect(trigger.player, player, player) > 0) {
									player._fakedanshou_effect = true;
									return "增加摸牌数";
								}
							}
							return player._fakedanshou_effect ? "增加摸牌数" : "摸牌";
						});
					event.result = { bool: true, cost_data: control };
				},
				logTarget: "player",
				async content(event, trigger, player) {
					if (event.cost_data == "增加摸牌数") {
						player.addMark("fakedanshou_effect", 1, false);
					} else {
						const num = player.countMark("fakedanshou_effect");
						await player.draw(num);
						if (num >= 4) {
							const {
								result: { bool },
							} = await player.chooseBool("胆守：是否对" + get.translation(trigger.player) + "造成1点伤害？").set("choice", get.damageEffect(trigger.player, player, player) > 0);
							if (bool) {
								player.line(trigger.player);
								await trigger.player.damage();
							}
						}
					}
				},
			},
		},
	},
	fakexunxi: {
		trigger: { global: "showCharacterEnd" },
		filter(event, player) {
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			return event.player != player && event.player != _status.currentPhase && player.canUse(card, event.player, false);
		},
		check(event, player) {
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			return get.effect(event.player, card, player, player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			await player.useCard(card, trigger.player, false);
		},
	},
	fakehuanjia: {
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			if (event.target == player) {
				if (player.getStorage("fakehuanjia_used").includes(2)) {
					return false;
				}
				return event.player.getEquips(2).length;
			}
			if (event.targets.length != 1) {
				return false;
			}
			if (player.getStorage("fakehuanjia_used").includes(1)) {
				return false;
			}
			return event.target.getEquips(1).length;
		},
		logTarget(event, player) {
			return event.target == player ? event.player : event.target;
		},
		forced: true,
		async content(event, trigger, player) {
			player.addTempSkill("fakehuanjia_used");
			if (trigger.target == player) {
				player.markAuto("fakehuanjia_used", [2]);
				if (!player.getEquips(2).length && player.hasEmptySlot(2)) {
					player.addSkill("fakehuanjia_equip2");
					player.markAuto("fakehuanjia_equip2", [trigger.player]);
					player
						.when({
							global: "phaseAfter",
							player: ["equipEnd", "disableEquipEnd", "die"],
						})
						.filter((evt, player) => {
							if (evt.name == "phase" || evt.name == "die") {
								return true;
							}
							if (evt.name == "discardEquip") {
								return !player.hasEmptySlot(2);
							}
							return get.type(evt.card) == "equip2";
						})
						.then(() => player.removeSkill("fakehuanjia_equip2"));
					const cards = trigger.player.getEquips(2);
					if (cards.length) {
						const skills = cards.reduce((list, card) => {
							if (get.info(card) && get.info(card).skills) {
								list.addArray(get.info(card).skills);
							}
							return list;
						}, []);
						if (skills.length) {
							player.addAdditionalSkill("fakehuanjia_equip2", skills);
						}
					}
				}
			} else {
				player.markAuto("fakehuanjia_used", [1]);
				if (!player.getEquips(1).length && player.hasEmptySlot(1)) {
					player.addSkill("fakehuanjia_equip1");
					player.markAuto("fakehuanjia_equip1", [trigger.target]);
					player
						.when({
							global: "phaseAfter",
							player: ["equipEnd", "disableEquipEnd", "die"],
						})
						.filter((evt, player) => {
							if (evt.name == "phase" || evt.name == "die") {
								return true;
							}
							if (evt.name == "discardEquip") {
								return !player.hasEmptySlot(1);
							}
							return get.type(evt.card) == "equip1";
						})
						.then(() => player.removeSkill("fakehuanjia_equip1"));
					const cards = trigger.target.getEquips(1);
					if (cards.length) {
						const skills = cards.reduce((list, card) => {
							if (get.info(card) && get.info(card).skills) {
								list.addArray(get.info(card).skills);
							}
							return list;
						}, []);
						if (skills.length) {
							player.addAdditionalSkill("fakehuanjia_equip1", skills);
						}
					}
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			equip1: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "攻",
				mod: {
					attackRange(player, num) {
						const targets = player.getStorage("fakehuanjia_equip1").filter(i => i.isIn());
						return (
							num +
							targets.reduce((sum, target) => {
								return sum + target.getEquipRange();
							}, 0)
						);
					},
				},
				intro: { content: "视为装备$的武器" },
				trigger: {
					global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "die"],
				},
				filter(event, player) {
					return game.hasPlayer(target => {
						if (!player.getStorage("fakehuanjia_equip1").includes(target)) {
							return false;
						}
						if (event.name == "die" && event.player == target) {
							return true;
						}
						if (event.name == "equip" && event.player == target) {
							return get.subtype(event.card) == "equip1";
						}
						if (event.getl) {
							const evt = event.getl(target);
							return evt && evt.player == target && evt.es && evt.es.some(i => get.subtype(i) == "equip1");
						}
						return false;
					});
				},
				forced: true,
				popup: false,
				content() {
					const targets = player.getStorage("fakehuanjia_equip1").filter(i => i.isIn());
					const skills = targets.reduce((list, target) => {
						const cards = target.getEquips(1);
						if (cards.length) {
							const skills = cards.reduce((listx, card) => {
								if (get.info(card) && get.info(card).skills) {
									listx.addArray(get.info(card).skills);
								}
								return listx;
							}, []);
							if (skills.length) {
								list.addArray(skills);
							}
						}
						return list;
					}, []);
					player.addAdditionalSkill("fakehuanjia_equip1", skills);
				},
			},
			equip2: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "防",
				intro: { content: "视为装备$的防具" },
				trigger: {
					global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "die"],
				},
				filter(event, player) {
					return game.hasPlayer(target => {
						if (!player.getStorage("fakehuanjia_equip2").includes(target)) {
							return false;
						}
						if (event.name == "die" && event.player == target) {
							return true;
						}
						if (event.name == "equip" && event.player == target) {
							return get.subtype(event.card) == "equip2";
						}
						if (event.getl) {
							const evt = event.getl(target);
							return evt && evt.player == target && evt.es && evt.es.some(i => get.subtype(i) == "equip2");
						}
						return false;
					});
				},
				forced: true,
				popup: false,
				content() {
					const targets = player.getStorage("fakehuanjia_equip2").filter(i => i.isIn());
					const skills = targets.reduce((list, target) => {
						const cards = target.getEquips(2);
						if (cards.length) {
							const skills = cards.reduce((listx, card) => {
								if (get.info(card) && get.info(card).skills) {
									listx.addArray(get.info(card).skills);
								}
								return listx;
							}, []);
							if (skills.length) {
								list.addArray(skills);
							}
						}
						return list;
					}, []);
					player.addAdditionalSkill("fakehuanjia_equip2", skills);
				},
			},
		},
	},

	fakehuyuan: {
		audio: "yuanhu",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return (
				player.countCards("he", card => {
					if (get.position(card) == "h" && _status.connectMode) {
						return true;
					}
					return get.type(card) == "equip";
				}) > 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2("fakehuyuan"),
					filterCard(card) {
						return get.type(card) == "equip";
					},
					position: "he",
					filterTarget(card, player, target) {
						return target.canEquip(card);
					},
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						return get.attitude(_status.event.player, target) - 3;
					},
				})
				.setHiddenSkill("fakehuyuan")
				.forResult();
		},
		preHidden: true,
		async content(event, trigger, player) {
			const card = event.cards[0],
				target = event.targets[0];
			if (target != player) {
				player.$give(card, target, false);
			}
			await target.equip(card);
		},
		group: "fakehuyuan_discard",
		subSkill: {
			discard: {
				trigger: { global: "equipEnd" },
				filter(event, player) {
					return (
						_status.currentPhase == player &&
						game.hasPlayer(target => {
							return get.distance(event.player, target) <= 1 && target != event.player && target.countCards("hej");
						})
					);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("fakehuyuan"), "弃置一名与" + get.translation(trigger.player) + "距离为1以内的另一名角色区域里的一张牌", (card, player, target) => {
							const trigger = get.event().getTrigger();
							return get.distance(trigger.player, target) <= 1 && target != trigger.player && target.countCards("hej");
						})
						.set("ai", target => {
							const player = get.event("player");
							return get.effect(target, { name: "guohe" }, player, player);
						})
						.setHiddenSkill("fakehuyuan")
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill("fakehuyuan", target);
					await player.discardPlayerCard(target, "hej", true);
				},
			},
		},
	},
	fakekeshou: {
		audio: "keshou",
		trigger: { player: "damageBegin3" },
		filter(event, player) {
			return event.num > 0;
		},
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt("fakekeshou"), "弃置两张颜色相同的牌，令即将受到的伤害-1", "he", 2, card => {
					return !ui.selected.cards.length || get.color(card) == get.color(ui.selected.cards[0]);
				})
				.set("logSkill", "fakekeshou")
				.set("complexCard", true)
				.setHiddenSkill("fakekeshou")
				.set("ai", card => {
					if (!_status.event.check) {
						return 0;
					}
					var player = _status.event.player;
					if (player.hp == 1) {
						if (
							!player.countCards("h", function (card) {
								return get.tag(card, "save");
							}) &&
							!player.hasSkillTag("save", true)
						) {
							return 10 - get.value(card);
						}
						return 7 - get.value(card);
					}
					return 6 - get.value(card);
				})
				.set("check", player.countCards("h", { color: "red" }) > 1 || player.countCards("h", { color: "black" }) > 1)
				.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			trigger.num--;
		},
		group: "fakekeshou_draw",
		subSkill: {
			draw: {
				audio: "keshou",
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (event.type != "discard" || event.getlx === false) {
						return false;
					}
					if (
						!(
							!player.isUnseen() &&
							!game.hasPlayer(current => {
								return current != player && current.isFriendOf(player);
							})
						)
					) {
						return false;
					}
					const evt = event.getl(player);
					return evt && evt.cards2 && evt.cards2.length > 1;
				},
				prompt2: "进行一次判定，若为红色，则你摸一张牌",
				async content(event, trigger, player) {
					const result = await player
						.judge(card => {
							return get.color(card) == "red" ? 1 : 0;
						})
						.forResult();
					if (result.judge > 0) {
						await player.draw();
					}
				},
			},
		},
	},
	//国战典藏2023补充
	//吕范
	gzdiaodu: {
		audio: "diaodu",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => {
				if (!current.isFriendOf(player)) {
					return false;
				}
				return current.countGainableCards(player, "e") > 0;
			});
		},
		frequent: true,
		preHidden: true,
		async cost(event, trigger, player) {
			const next = player.chooseTarget(get.prompt2("gzdiaodu"), (_card, player, current) => current.isFriendOf(player) && current.countGainableCards(player, "e") > 0);

			next.set("ai", target => {
				let num = 0;

				if (target.hasSkill("gz_xiaoji")) {
					num += 2.5;
				}
				if (target.isDamaged() && target.getEquip("baiyin")) {
					num += 2.5;
				}
				if (target.hasSkill("xuanlve")) {
					num += 2;
				}

				return num;
			});

			next.setHiddenSkill("gzdiaodu");

			event.result = await next.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { result } = await player.gainPlayerCard(target, "e", true);

			if (!result.bool) {
				return;
			}

			const card = result.cards[0];
			if (!player.getCards("h").includes(card)) {
				return;
			}

			const { result: result2 } = await player.chooseTarget("将" + get.translation(card, void 0) + "交给另一名角色", (_card, player, current) => current != player && current != _status.event.target, true).set("target", target);

			if (result2.bool) {
				const target2 = result2.targets[0];
				player.line(target2, "green");
				await player.give(card, target2);
			}
		},
		group: "gzdiaodu_use",
		subSkill: {
			use: {
				audio: "diaodu",
				trigger: {
					global: "useCard",
				},
				filter(event, player) {
					if (get.type(event.card) !== "equip") {
						return false;
					}
					if (!event.player.isIn()) {
						return false;
					}
					if (!event.player.isFriendOf(player)) {
						return false;
					}
					return player === event.player || player.hasSkill("gzdiaodu");
				},
				logTarget: "player",
				async cost(event, trigger, player) {
					const next = trigger.player.chooseBool(get.prompt("gzdiaodu"), "摸一张牌");

					if (player.hasSkill("gzdiaodu")) {
						next.set("frequentSkill", "gzdiaodu");
					}
					if (player === trigger.player) {
						next.setHiddenSkill("gzdiaodu");
					}

					event.result = await next.forResult();
				},
				async content(event, trigger, player) {
					trigger.player.draw("nodelay");
				},
			},
		},
	},

	// 回来吧老调度
	gzdiaodu_backports: {
		audio: "diaodu",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => {
				if (!current.isFriendOf(player)) {
					return false;
				}
				return current.countGainableCards(player, "e") > 0;
			});
		},
		frequent: true,
		preHidden: true,
		async cost(event, trigger, player) {
			const next = player.chooseTarget(get.prompt2("gzdiaodu_backports"), (_card, player, current) => current.isFriendOf(player) && current.countGainableCards(player, "e") > 0);

			next.set("ai", target => {
				let num = 0;

				if (target.hasSkill("gz_xiaoji")) {
					num += 2.5;
				}
				if (target.isDamaged() && target.getEquip("baiyin")) {
					num += 2.5;
				}
				if (target.hasSkill("xuanlve")) {
					num += 2;
				}

				return num;
			});

			next.setHiddenSkill("gzdiaodu_backports");

			event.result = await next.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { result } = await player.gainPlayerCard(target, "e", true);

			if (!result.bool) {
				return;
			}

			const card = result.cards[0];
			if (!player.getCards("h").includes(card)) {
				return;
			}

			const next = player.chooseTarget(`是否将${get.translation(card)}交给一名其他角色？`);
			next.set("filterTarget", (_card, player, current) => {
				return current !== player && current !== _status.event.target && player.isFriendOf(current);
			});
			next.set("target", target);

			const result2 = await next.forResult();

			if (result2.bool) {
				const target2 = result2.targets[0];
				player.line(target2, "green");
				await player.give(card, target2);
			}
		},
		group: "gzdiaodu_backports_use",
		subSkill: {
			use: {
				audio: "diaodu",
				trigger: {
					global: "useCard",
				},
				filter(event, player) {
					if (get.type(event.card) !== "equip") {
						return false;
					}
					if (!event.player.isIn()) {
						return false;
					}
					if (!event.player.isFriendOf(player)) {
						return false;
					}
					return player === event.player || player.hasSkill("gzdiaodu_backports");
				},
				logTarget: "player",
				async cost(event, trigger, player) {
					const next = trigger.player.chooseBool(get.prompt("gzdiaodu_backports"), "摸一张牌");

					if (player.hasSkill("gzdiaodu_backports")) {
						next.set("frequentSkill", "gzdiaodu_backports");
					}
					if (player === trigger.player) {
						next.setHiddenSkill("gzdiaodu_backports");
					}

					event.result = await next.forResult();
				},
				async content(event, trigger, player) {
					trigger.player.draw("nodelay");
				},
			},
		},
	},
	//徐庶
	gzqiance: {
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || get.type(/*2*/ event.card) != "trick") {
				return false;
			} //延时锦囊不能响应有个锤用
			return event.player.isFriendOf(player) && event.targets.some(target => target.isMajor());
		},
		check(event, player) {
			var num = 0,
				targets = event.targets.filter(target => target.isMajor());
			for (var target of targets) {
				num += get.sgn(get.attitude(player, target) * get.effect(target, event.card, event.player, player));
			}
			return num >= 0;
		},
		logTarget: "player",
		content() {
			trigger.getParent().directHit.addArray(trigger.targets.filter(target => target.isMajor()));
		},
	},
	gzjujian: {
		init(player) {
			if (player.checkViceSkill("gzjujian") && !player.viceChanged) {
				player.removeMaxHp();
			}
		},
		viceSkill: true,
		audio: "gzjiancai",
		trigger: { global: "dying" },
		filter(event, player) {
			return event.player.isFriendOf(player);
		},
		forced: true,
		logTarget: "player",
		content() {
			trigger.player.recover(1 - trigger.player.hp);
			player.changeVice();
		},
	},
	//彭羕
	gztongling: {
		audio: "daming",
		trigger: { source: "damageSource" },
		filter(event, player) {
			if (event.player.isFriendOf(player)) {
				return false;
			}
			return player.isPhaseUsing() && event.player.isIn() && !player.hasSkill("gztongling_used");
		},
		direct: true,
		content() {
			"step 0";
			var str = "";
			if (get.itemtype(trigger.cards) == "cards" && trigger.cards.filterInD().length) {
				str += "；未造成伤害，其获得" + get.translation(trigger.cards.filterInD());
			}
			player
				.chooseTarget(get.prompt("gztongling"), "令一名势力与你相同的角色选择是否对其使用一张牌。若使用且此牌：造成伤害，你与其各摸两张牌" + str, function (card, player, target) {
					return target.isFriendOf(player);
				})
				.set("ai", function (target) {
					var aim = _status.event.aim;
					var cards = target.getCards("hs", function (card) {
						return target.canUse(card, aim, false) && get.effect(aim, card, target, player) > 0 && get.effect(aim, card, target, target) > 0;
					});
					if (cards.length) {
						return cards.some(card => get.tag(card, "damage")) ? 2 : 1;
					}
					return 0;
				})
				.set("aim", trigger.player);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("gztongling", target);
				player.addTempSkill("gztongling_used", "phaseUseAfter");
				player.line2([target, trigger.player]);
				target
					.chooseToUse(
						function (card, player, event) {
							return lib.filter.filterCard.apply(this, arguments);
						},
						"通令：是否对" + get.translation(trigger.player) + "使用一张牌？"
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
					.set("sourcex", trigger.player)
					.set("addCount", false);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				if (target.hasHistory("sourceDamage", evt => evt.getParent(4).name == "gztongling")) {
					player.draw(2, "nodelay");
					target.draw(2);
				} else {
					if (get.itemtype(trigger.cards) == "cards" && trigger.cards.filterInD().length && trigger.player.isIn()) {
						trigger.player.gain(trigger.cards.filterInD(), "gain2");
					}
				}
			}
		},
		subSkill: { used: { charlotte: true } },
	},
	gzjinyu: {
		audio: "xiaoni",
		trigger: { player: "showCharacterAfter" },
		filter(event, player) {
			if (
				!game.hasPlayer(function (current) {
					return get.distance(player, current) <= 1;
				})
			) {
				return false;
			}
			return event.toShow.some(name => get.character(name, 3).includes("gzjinyu"));
		},
		logTarget(event, player) {
			return game
				.filterPlayer(function (current) {
					return get.distance(player, current) <= 1;
				})
				.sortBySeat(player);
		},
		forced: true,
		locked: false,
		content() {
			"step 0";
			event.targets = game
				.filterPlayer(function (current) {
					return get.distance(player, current) <= 1;
				})
				.sortBySeat(player);
			"step 1";
			var target = event.targets.shift();
			event.target = target;
			if (!target.isUnseen(2)) {
				if (get.is.jun(target)) {
					event._result = { control: "副将" };
				} else {
					target
						.chooseControl("主将", "副将")
						.set("prompt", "近谀：请暗置一张武将牌")
						.set("ai", function () {
							var target = _status.event.player;
							if (get.character(target.name, 3).includes("gzjinyu")) {
								return "主将";
							}
							if (get.character(target.name2, 3).includes("gzjinyu")) {
								return "副将";
							}
							if (
								lib.character[target.name][3].some(skill => {
									var info = get.info(skill);
									return info && info.ai && info.ai.maixie;
								})
							) {
								return "主将";
							}
							if (target.name == "gz_zhoutai") {
								return "副将";
							}
							if (target.name2 == "gz_zhoutai") {
								return "主将";
							}
							return "副将";
						});
				}
			} else {
				target.chooseToDiscard(2, "he", true);
				event.goto(3);
			}
			"step 2";
			if (result.control) {
				target.hideCharacter(result.control == "主将" ? 0 : 1);
			}
			"step 3";
			if (event.targets.length) {
				event.goto(1);
			}
		},
	},
	//公孙渊
	gzrehuaiyi: {
		audio: "gzhuaiyi",
		enable: "phaseUse",
		locked: false,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		usable: 1,
		delay: false,
		content() {
			"step 0";
			player.showHandcards();
			var hs = player.getCards("h"),
				color = get.color(hs[0], player);
			if (
				hs.length === 1 ||
				!hs.some((card, index) => {
					return index > 0 && get.color(card) !== color;
				})
			) {
				event.finish();
			}
			"step 1";
			const list = [],
				bannedList = [],
				indexs = Object.keys(lib.color);
			player.getCards("h").forEach(card => {
				const color = get.color(card, player);
				list.add(color);
				if (!lib.filter.cardDiscardable(card, player, "gzrehuaiyi")) {
					bannedList.add(color);
				}
			});
			list.removeArray(bannedList);
			list.sort((a, b) => indexs.indexOf(a) - indexs.indexOf(b));
			if (!list.length) {
				event.finish();
			} else if (list.length === 1) {
				event._result = { control: list[0] };
			} else {
				player
					.chooseControl(list.map(i => `${i}2`))
					.set("ai", function () {
						var player = _status.event.player;
						if (player.countCards("h", { color: "red" }) == 1 && player.countCards("h", { color: "black" }) > 1) {
							return 1;
						}
						return 0;
					})
					.set("prompt", "请选择弃置一种颜色的所有手牌");
			}
			"step 2";
			event.control = result.control.slice(0, result.control.length - 1);
			var cards = player.getCards("h", { color: event.control });
			player.discard(cards);
			event.num = cards.length;
			"step 3";
			player
				.chooseTarget("请选择至多" + get.cnNumber(event.num) + "名有牌的其他角色，获得这些角色的各一张牌。", [1, event.num], function (card, player, target) {
					return target != player && target.countCards("he") > 0;
				})
				.set("ai", function (target) {
					return -get.attitude(_status.event.player, target) + 0.5;
				});
			"step 4";
			if (result.bool && result.targets) {
				player.line(result.targets, "green");
				event.targets = result.targets;
				event.targets.sort(lib.sort.seat);
				event.cards = [];
			} else {
				event.finish();
			}
			"step 5";
			if (player.isIn() && event.targets.length) {
				player.gainPlayerCard(event.targets.shift(), "he", true);
			} else {
				event.finish();
			}
			"step 6";
			if (result.bool && result.cards && result.cards.length) {
				event.cards.addArray(result.cards);
			}
			if (event.targets.length) {
				event.goto(5);
			}
			"step 7";
			var hs = player.getCards("h");
			cards = cards.filter(function (card) {
				return get.type(card) == "equip" && hs.includes(card);
			});
			if (cards.length) {
				player.$give(cards, player, false);
				game.log(player, "将", cards, "置于了武将牌上");
				player.loseToSpecial(cards, "gzrehuaiyi").visible = true;
			} else {
				event.finish();
			}
			"step 8";
			player.addSkill("gzrehuaiyi_unmark");
			player.markSkill("gzrehuaiyi");
			game.delayx();
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					var map = {};
					for (var i of ["red", "black", "none"]) {
						if (player.countCards("h", { color: i })) {
							map[i] = true;
						}
					}
					if (Object.keys(map).length < 2) {
						return 0;
					}
					var num =
						player.maxHp -
						player.countCards("s", function (card) {
							return card.hasGaintag("gzrehuaiyi");
						});
					if (player.countCards("h", { color: "red" }) <= num) {
						return 1;
					}
					if (player.countCards("h", { color: "black" }) <= num) {
						return 1;
					}
					return 0;
				},
			},
		},
		marktext: "异",
		intro: {
			mark(dialog, storage, player) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("gzrehuaiyi");
				});
				if (!cards || !cards.length) {
					return;
				}
				dialog.addAuto(cards);
			},
			markcount(storage, player) {
				return player.countCards("s", function (card) {
					return card.hasGaintag("gzrehuaiyi");
				});
			},
			onunmark(storage, player) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("gzrehuaiyi");
				});
				if (cards.length) {
					player.loseToDiscardpile(cards);
				}
			},
		},
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("gzrehuaiyi")) {
					return (
						num +
						(player.countCards("s", function (card) {
							return card.hasGaintag("gzrehuaiyi");
						}) > player.maxHp
							? 0.5
							: -0.5)
					);
				}
			},
		},
		subSkill: {
			unmark: {
				trigger: { player: "loseAfter" },
				filter(event, player) {
					if (!event.ss || !event.ss.length) {
						return false;
					}
					return !player.countCards("s", function (card) {
						return card.hasGaintag("gzrehuaiyi");
					});
				},
				charlotte: true,
				forced: true,
				silent: true,
				content() {
					player.unmarkSkill("gzrehuaiyi");
					player.removeSkill("gzrehuaiyi_unmark");
				},
			},
		},
	},
	gzrezisui: {
		audio: "gzzisui",
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return (
				!event.numFixed &&
				player.countCards("s", function (card) {
					return card.hasGaintag("gzrehuaiyi");
				}) > 0
			);
		},
		forced: true,
		content() {
			trigger.num += player.countCards("s", function (card) {
				return card.hasGaintag("gzrehuaiyi");
			});
		},
		group: "gzrezisui_die",
		subSkill: {
			die: {
				audio: "gzzisui",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return (
						player.countCards("s", function (card) {
							return card.hasGaintag("gzrehuaiyi");
						}) > player.maxHp
					);
				},
				forced: true,
				content() {
					player.die();
				},
			},
		},
	},
	//南华老仙
	gztaidan: {
		derivation: "taipingyaoshu",
		audio: "tianshu",
		locked: true,
		group: "gztaidan_taipingyaoshu",
	},
	gztaidan_taipingyaoshu: {
		equipSkill: true,
		mod: {
			maxHandcard(player, num) {
				if (!player.hasEmptySlot(2) || game.hasPlayer(target => target.getVEquip("taipingyaoshu"))) {
					return;
				}
				if (player.hasSkill("hongfa")) {
					num += player.getExpansions("huangjintianbingfu").length;
				}
				return (
					num +
					game.countPlayer(function (current) {
						return current.isFriendOf(player);
					})
				);
			},
		},
		audio: "tianshu",
		inherit: "taipingyaoshu",
		filter(event, player) {
			if (!player.hasEmptySlot(2) || game.hasPlayer(target => target.getVEquip("taipingyaoshu"))) {
				return false;
			}
			return lib.skill.taipingyaoshu.filter(event, player);
		},
		noHidden: true,
		ai: {
			effect: {
				target(card, player, target) {
					if (!target.hasEmptySlot(2) || game.hasPlayer(targetx => targetx.getVEquip("taipingyaoshu"))) {
						return;
					}
					if (player == target && get.subtype(card) == "equip2") {
						if (get.equipValue(card) <= 7.5) {
							return 0;
						}
					}
					return lib.skill.taipingyaoshu.ai.effect.target.apply(this, arguments);
				},
			},
		},
	},
	gzrejinghe: {
		audio: "jinghe",
		enable: "phaseUse",
		usable: 1,
		//delay:0,
		content() {
			"step 0";
			if (!player.storage.gzrejinghe_tianshu) {
				var list = lib.skill.gzrejinghe.derivation.slice(0);
				list.remove("gzrejinghe_faq");
				var list2 = list.slice(0, get.rand(0, list.length));
				list.removeArray(list2);
				list.addArray(list2);
				player.storage.gzrejinghe_tianshu = list;
			} else {
				var first = player.storage.gzrejinghe_tianshu[0];
				player.storage.gzrejinghe_tianshu.remove(first);
				player.storage.gzrejinghe_tianshu.push(first);
			}
			game.log(player, "转动了", "#g“天书”");
			player.markSkill("gzrejinghe");
			var skill = player.storage.gzrejinghe_tianshu[0];
			event.skill = skill;
			var cardname = "gzrejinghe_" + skill;
			lib.card[cardname] = {
				fullimage: true,
				image: "character:re_nanhualaoxian",
			};
			lib.translate[cardname] = get.translation(skill);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, card) {
					ui.create.dialog(get.translation(player) + "转动了“天书”", [[card], "card"]).videoId = id;
				},
				player,
				event.videoId,
				game.createCard(cardname, " ", " ")
			);
			game.delay(3);
			"step 1";
			game.broadcastAll("closeDialog", event.videoId);
			var targets = game.filterPlayer(current => !current.hasSkill(event.skill));
			if (!targets.length) {
				event.finish();
				return;
			}
			player
				.chooseTarget(
					"经合：令一名角色获得技能【" + get.translation(event.skill) + "】",
					function (card, player, target) {
						return _status.event.targets.includes(target);
					},
					true
				)
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.attitude(player, target);
				})
				.set("targets", targets);
			"step 2";
			if (result.bool) {
				var target = result.targets[0],
					skill = event.skill;
				player.line(target);
				player.addTempSkill("gzrejinghe_clear", { player: "phaseBegin" });
				target.addAdditionalSkills("gzrejinghe_" + player.playerid, skill);
				target.popup(skill);
			}
		},
		intro: {
			name: "写满技能的天书",
			markcount: () => 8,
			mark(dialog, storage, player) {
				dialog.content.style["overflow-x"] = "visible";
				var list = player.storage.gzrejinghe_tianshu;
				var core = document.createElement("div");
				var centerX = -10,
					centerY = 80,
					radius = 80;
				var radian = (Math.PI * 2) / list.length;
				for (var i = 0; i < list.length; i++) {
					var td = document.createElement("div");
					td.innerHTML = get.translation(list[i]).slice(0, 1);
					td.style.position = "absolute";
					core.appendChild(td);
					td.style.left = centerX + radius * Math.sin(radian * i) + "px";
					td.style.top = centerY - radius * Math.cos(radian * i) + "px";
				}
				dialog.content.appendChild(core);
			},
		},
		ai: {
			order: 10,
			result: { target: 1 },
		},
		derivation: ["gzrejinghe_faq", "leiji", "nhyinbing", "nhhuoqi", "nhguizhu", "nhxianshou", "nhlundao", "nhguanyue", "nhyanzheng"],
		subSkill: {
			clear: {
				onremove(player) {
					game.countPlayer(function (current) {
						current.removeAdditionalSkills("gzrejinghe_" + player.playerid);
					});
				},
			},
		},
	},
	//张鲁·新
	gzrebushi: {
		onremove: true,
		onunmark: true,
		intro: { content: "mark" },
		group: "gzrebushi_give",
		audio: "gzbushi",
		trigger: { player: ["phaseZhunbeiBegin", "phaseAfter"] },
		check(event, player) {
			return event.name == "phase";
		},
		forced: true,
		locked: false,
		content() {
			"step 0";
			if (trigger.name == "phaseZhunbei") {
				var num = game.countPlayer() - player.hp - 2;
				if (num > 0) {
					player.chooseToDiscard(num, "he", true);
				}
			} else {
				player.addMark("gzrebushi", player.hp);
				event.finish();
			}
			"step 1";
			player.removeMark("gzrebushi", player.countMark("gzrebushi"));
			if (!player.hasMark("gzrebushi")) {
				player.unmarkSkill("gzrebushi");
			}
		},
		ai: { mingzhi_no: true },
		subSkill: {
			give: {
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					return player.hasMark("gzrebushi") && player.countCards("he");
				},
				direct: true,
				content() {
					"step 0";
					player.chooseCard(get.prompt("gzrebushi"), "he", "失去1个“义舍”标记，将一张牌交给" + get.translation(trigger.player) + "并摸两张牌").set("ai", function (card) {
						var player = _status.event.player;
						var trigger = _status.event.getTrigger();
						var target = trigger.player;
						var num = 0,
							current = target;
						while (current != player) {
							if (current.isFriendOf(player) && !current.isTurnedOver()) {
								num++;
							}
							current = current.next;
						}
						if (num >= player.countMark("gzrebushi") && !target.isFriendOf(player)) {
							return -1;
						}
						return 6 - get.value(card);
					});
					"step 1";
					if (result.bool) {
						player.logSkill("gzrebushi", trigger.player);
						player.removeMark("gzrebushi", 1);
						if (!player.hasMark("gzrebushi")) {
							player.unmarkSkill("gzrebushi");
						}
						trigger.player.gain(result.cards, player, "giveAuto");
						player.draw(2);
					}
				},
			},
		},
	},
	gzremidao: {
		group: "gzremidao_change",
		audio: "gzmidao",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return !player.getExpansions("gzremidao").length;
		},
		content() {
			"step 0";
			player.draw(2);
			"step 1";
			var cards = player.getCards("he");
			if (!cards.length) {
				event.finish();
			} else if (cards.length <= 2) {
				event._result = { bool: true, cards: cards };
			} else {
				player.chooseCard(2, "he", true, "选择两张牌作为“米”");
			}
			"step 2";
			if (result.bool) {
				player.addToExpansion(result.cards, player, "give").gaintag.add("gzremidao");
			}
		},
		marktext: "米",
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
		subSkill: {
			change: {
				trigger: { global: "judge" },
				filter(event, player) {
					return player.getExpansions("gzremidao").length && event.player.isAlive();
				},
				direct: true,
				content() {
					"step 0";
					var list = player.getExpansions("gzremidao");
					player
						.chooseButton([get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("gzremidao"), list, "hidden"], function (button) {
							var card = button.link;
							var trigger = _status.event.getTrigger();
							var player = _status.event.player;
							var judging = _status.event.judging;
							var result = trigger.judge(card) - trigger.judge(judging);
							var attitude = get.attitude(player, trigger.player);
							if (result == 0) {
								return 0.5;
							}
							return result * attitude;
						})
						.set("judging", trigger.player.judging[0])
						.set("filterButton", function (button) {
							var player = _status.event.player;
							var card = button.link;
							var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
							if (mod2 != "unchanged") {
								return mod2;
							}
							var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
							if (mod != "unchanged") {
								return mod;
							}
							return true;
						});
					"step 1";
					if (result.bool) {
						event.forceDie = true;
						player.respond(result.links, "gzremidao", "highlight", "noOrdering");
						result.cards = result.links;
						var card = result.cards[0];
						event.card = card;
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						if (trigger.player.judging[0].clone) {
							trigger.player.judging[0].clone.classList.remove("thrownhighlight");
							game.broadcast(function (card) {
								if (card.clone) {
									card.clone.classList.remove("thrownhighlight");
								}
							}, trigger.player.judging[0]);
							game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
						}
						player.$gain2(trigger.player.judging[0]);
						player.gain(trigger.player.judging[0]);
						trigger.player.judging[0] = result.cards[0];
						trigger.orderingCards.addArray(result.cards);
						game.log(trigger.player, "的判定牌改为", card);
						game.delay(2);
					}
				},
				ai: {
					rejudge: true,
					tag: { rejudge: 0.6 },
				},
			},
		},
	},
	//许贡
	gzbiaozhao: {
		audio: "biaozhao",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var players = game.filterPlayer(current => current != player);
			if (players.length < 2) {
				return false;
			}
			for (var i = 0; i < players.length - 1; i++) {
				for (var j = i + 1; j < players.length; j++) {
					if (players[i].isEnemyOf(players[j])) {
						return true;
					}
				}
			}
			return false;
		},
		multitarget: true,
		complexTarget: true,
		complexSelect: true,
		selectTarget: 2,
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			var targets = ui.selected.targets;
			if (targets.length == 0) {
				return player.canUse("zhibi", target);
			}
			return target.isEnemyOf(targets[0]);
		},
		targetprompt: ["被知己知彼", "获得牌"],
		content() {
			"step 0";
			player.useCard({ name: "zhibi", isCard: true }, targets[0]);
			"step 1";
			if (player.countCards("he") > 0 && targets[1].isAlive()) {
				player.chooseCard("he", true, "交给" + get.translation(targets[1]) + "一张牌");
			} else {
				event.finish();
			}
			"step 2";
			player.give(result.cards, targets[1]);
			player.draw();
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if (ui.selected.targets.length) {
						return 0.1;
					}
					return get.effect(target, { name: "zhibi" }, player, player) + 0.1;
				},
				target(player, target) {
					if (ui.selected.targets.length) {
						return 2;
					}
					return 0;
				},
			},
		},
	},
	gzyechou: {
		audio: "yechou",
		trigger: { player: "die" },
		forced: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "gray",
		logTarget: "source",
		filter(event, player) {
			return event.source && event.source.isIn() && player.canUse("sha", event.source, false);
		},
		content() {
			"step 0";
			var target = trigger.source;
			event.target = target;
			target.addTempSkill("gzyechou_unsavable");
			player
				.useCard({ name: "sha", isCard: true }, target)
				.set("forceDie", true)
				.set("oncard", function () {
					_status.event.directHit.addArray(game.filterPlayer());
				});
			"step 1";
			player.addTempSkill("gzyechou_unequip");
			if (!target.isIn() || !player.canUse("sha", target, false)) {
				player.removeSkill("gzyechou_unequip");
				event.goto(3);
			} else {
				player
					.useCard(
						{
							name: "sha",
							isCard: true,
							storage: { gzyechou: true },
						},
						target
					)
					.set("forceDie", true);
			}
			"step 2";
			player.removeSkill("gzyechou_unequip");
			if (!target.isIn() || !player.canUse("sha", target, false)) {
				event.goto(3);
			} else {
				player
					.useCard({ name: "sha", isCard: true }, target)
					.set("forceDie", true)
					.set("oncard", function () {
						_status.event.baseDamage++;
					});
			}
			"step 3";
			target.removeSkill("gzyechou_unsavable");
		},
		ai: {
			threaten: 0.001,
		},
		subSkill: {
			unsavable: {
				charlotte: true,
				mod: {
					targetEnabled(card, player, target) {
						if (card.name == "tao" && target.isDying() && player.isFriendOf(target) && target != player) {
							return false;
						}
					},
				},
			},
			unequip: {
				charlotte: true,
				ai: {
					unequip: true,
					skillTagFilter(player, tag, arg) {
						if (!arg || !arg.card || !arg.card.storage || !arg.card.storage.gzyechou) {
							return false;
						}
					},
				},
			},
		},
	},
	//陈宫
	gzyinpan: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			event.targets = game
				.filterPlayer(function (current) {
					return current != target && current.isEnemyOf(target);
				})
				.sortBySeat();
			"step 1";
			if (!event.target.isIn()) {
				event.finish();
				return;
			}
			var target = targets.shift();
			if (target.isIn() && (_status.connectMode || !lib.config.skip_shan || target.hasSha())) {
				target
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"是否对" + get.translation(event.target) + "使用一张【杀】？"
					)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("addCount", false)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", event.target);
			}
			if (targets.length > 0) {
				event.redo();
			}
			"step 2";
			if (target.isIn()) {
				var dying = false;
				var num = target.getHistory("damage", function (evt) {
					if (evt.card && evt.card.name == "sha") {
						var evtx = evt.getParent("useCard");
						if (evt.card == evtx.card && evtx.getParent(2) == event) {
							if (evt._dyinged) {
								dying = true;
							}
							return true;
						}
					}
				}).length;
				if (num > 0) {
					target.addTempSkill("gzyinpan_effect", { player: "phaseAfter" });
					target.addMark("gzyinpan_effect", num, false);
					if (dying) {
						target.recover();
					}
				}
			}
		},
		ai: {
			order: 1,
			result: { target: -1 },
		},
		subSkill: {
			effect: {
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("gzyinpan_effect");
						}
					},
				},
				onremove: true,
				charlotte: true,
				intro: { content: "使用【杀】的次数上限+#" },
			},
		},
	},
	gzxingmou: {
		trigger: { global: "gainAfter" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			return event.getParent().name == "draw" && event.getParent(2).name == "die";
		},
		content() {
			player.draw();
		},
		ai: {
			noDieAfter: true,
			noDieAfter2: true,
		},
	},
	//朱儁
	gzgongjian: {
		audio: "gongjian",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || event.card.name != "sha") {
				return false;
			}
			var history = game.getAllGlobalHistory("useCard", function (evt) {
				return evt.card.name == "sha";
			});
			var evt = event.getParent(),
				index = history.indexOf(evt);
			if (index < 1) {
				return false;
			}
			var evt0 = history[index - 1];
			for (var i of evt.targets) {
				if (evt0.targets.includes(i) && i.countCards("he") > 0) {
					return true;
				}
			}
			return false;
		},
		usable: 1,
		prompt2: "弃置这些角色的各两张牌",
		preHidden: ["gzgongjian_gain"],
		subfrequent: ["gain"],
		logTarget(event, player) {
			var history = game.getAllGlobalHistory("useCard", function (evt) {
				return evt.card.name == "sha";
			});
			var evt = event.getParent(),
				index = history.indexOf(evt);
			var evt0 = history[index - 1];
			return evt.targets.filter(function (target) {
				return evt0.targets.includes(target) && target.countCards("he") > 0;
			});
		},
		check(event, player) {
			var targets = lib.skill.gzgongjian.logTarget(event, player),
				att = 0;
			for (var i of targets) {
				att += get.attitude(player, i);
			}
			return att < 0;
		},
		content() {
			var history = game.getAllGlobalHistory("useCard", function (evt) {
				return evt.card.name == "sha";
			});
			var evt = trigger.getParent(),
				index = history.indexOf(evt);
			var evt0 = history[index - 1];
			var targets = evt.targets
				.filter(function (target) {
					return evt0.targets.includes(target);
				})
				.sortBySeat();
			for (var i of targets) {
				i.chooseToDiscard(true, "he", 2);
			}
		},
		group: "gzgongjian_gain",
		subSkill: {
			gain: {
				audio: "gongjian",
				trigger: {
					global: ["loseAfter", "loseAsyncAfter"],
				},
				filter(event, player) {
					if (event.name == "lose") {
						if (event.type != "discard" || event.player == player) {
							return false;
						}
						if ((event.getParent(event.getParent(2).name == "chooseToDiscard" ? 3 : 2).player || event.discarder) != player) {
							return false;
						}
						for (var i of event.cards2) {
							if (i.name == "sha") {
								return true;
							}
						}
					} else if (event.type == "discard") {
						if (!event.discarder || event.discarder != player) {
							return false;
						}
						var cards = event.getd(null, "cards2");
						cards.removeArray(event.getd(player, "cards2"));
						for (var i of cards) {
							if (i.name == "sha") {
								return true;
							}
						}
					}
					return false;
				},
				frequent: true,
				prompt2(event, player) {
					var cards = event.getd(null, "cards2");
					cards.removeArray(event.getd(player, "cards2"));
					cards = cards.filter(card => card.name == "sha");
					return "获得" + get.translation(cards);
				},
				content() {
					var cards = trigger.getd(null, "cards2");
					cards.removeArray(trigger.getd(player, "cards2"));
					cards = cards.filter(card => card.name == "sha");
					if (cards.length) {
						player.gain(cards, "gain2");
					}
				},
			},
		},
	},
	gzkuimang: {
		audio: "kuimang",
		trigger: { source: "die" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			var target = event.player;
			if (target.isFriendOf(player)) {
				return false;
			}
			var prev = target.getPrevious(),
				next = target.getNext();
			return (prev && prev.isFriendOf(target)) || (next && next.isFriendOf(target));
		},
		content() {
			player.draw(2);
		},
	},
	//毌丘俭
	gzzhengrong: {
		audio: "drlt_zhenrong",
		trigger: {
			source: "damageBegin3",
			player: ["damageBegin1", "chooseJunlingForBegin"],
		},
		forced: true,
		preHidden: true,
		filter(event, player) {
			if (event.name != "damage") {
				return true;
			}
			if (player.identity != "unknown") {
				return !game.hasPlayer(function (current) {
					return current != player && current.isFriendOf(player);
				});
			}
			return !player.wontYe("wei") || !game.hasPlayer(current => current.identity == "wei");
		},
		check(event, player) {
			return (
				!event.player.hasSkillTag("filterDamage", null, {
					player: event.source,
					card: event.card,
				}) && get.damageEffect(event.player, event.source, player, _status.event.player) > 0
			);
		},
		content() {
			trigger.num++;
		},
		mod: {
			globalFrom(player, target, num) {
				if (target.isMajor()) {
					return num - 1;
				}
			},
		},
		ai: { halfneg: true },
	},
	gzhongju: {
		audio: "drlt_hongju",
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			player.awakenSkill("gzhongju");
			event.players = game
				.filterPlayer(function (current) {
					return current != player && current != target;
				})
				.sortBySeat();
			game.delayx();
			player.chooseJunlingFor(event.players[0]).set("prompt", "请选择一项“军令”");
			"step 1";
			event.junling = result.junling;
			event.targets = result.targets;
			event.num = 0;
			player.carryOutJunling(player, event.junling, event.targets);
			"step 2";
			if (num < event.players.length) {
				event.current = event.players[num];
			}
			if (event.current && event.current.isAlive()) {
				player.line(event.current);
				event.current
					.chooseJunlingControl(player, event.junling, targets)
					.set("prompt", "鸿举")
					.set("choiceList", ["执行该军令", "不执行该军令，且被“调虎离山”化"])
					.set("ai", function () {
						var evt = _status.event.getParent(2);
						return get.junlingEffect(evt.player, evt.junling, evt.current, evt.targets, evt.current) > 0 ? 0 : 1;
					});
			} else {
				event.goto(4);
			}
			"step 3";
			if (result.index == 0) {
				event.current.carryOutJunling(player, event.junling, event.targets);
			} else {
				event.current.addTempSkill("diaohulishan");
			}
			"step 4";
			game.delayx();
			event.num++;
			if (event.num < event.players.length) {
				event.goto(2);
			}
		},
	},
	//郭淮
	gzduanshi: {
		audio: "yuzhang",
		trigger: { global: "drawBegin" },
		forced: true,
		mainSkill: true,
		preHidden: true,
		init(player) {
			if (player.checkMainSkill("gzduanshi")) {
				player.removeMaxHp();
			}
		},
		filter(event, player) {
			var evt = event.getParent();
			if (evt.name != "die") {
				return false;
			}
			if (player.identity == "unknown") {
				return player.wontYe("wei") && evt.player.identity == "wei";
			}
			return evt.player.isFriendOf(player);
		},
		logTarget: "player",
		content() {
			trigger.num--;
			if (trigger.num < 1) {
				trigger.cancel();
			}
			if (!trigger.gzduanshi) {
				trigger.gzduanshi = [];
			}
			trigger.gzduanshi.add(player);
			player.addTempSkill("gzduanshi_draw");
		},
		subSkill: {
			draw: {
				trigger: { global: ["drawAfter", "drawCancelled"] },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event.gzduanshi && event.gzduanshi.includes(player);
				},
				content() {
					player.draw();
				},
			},
		},
	},
	gzjingce: {
		audio: "decadejingce",
		getDiscardNum() {
			var cards = [];
			//因为是线下武将 所以同一张牌重复进入只算一张
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name == "cardsDiscard" || (evt.name == "lose" && evt.position == ui.discardPile)) {
					cards.addArray(evt.cards);
				}
			});
			return cards.length;
		},
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			if (player.getHistory("useCard").length >= player.hp) {
				return true;
			}
			return lib.skill.gzjingce.getDiscardNum() >= player.hp;
		},
		prompt2(event, player) {
			var num1 = player.getHistory("useCard").length,
				num2 = lib.skill.gzjingce.getDiscardNum();
			if (num1 >= player.hp && num2 >= player.hp) {
				return "执行一套额外的摸牌阶段和出牌阶段";
			}
			return "执行一个额外的" + (num1 > num2 ? "出牌阶段" : "摸牌阶段");
		},
		preHidden: true,
		frequent: true,
		async content(event, trigger, player) {
			let num1 = player.getHistory("useCard").length,
				num2 = lib.skill.gzjingce.getDiscardNum(),
				num3 = player.hp;
			if (num1 >= num3) {
				trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
			}
			if (num2 >= num3) {
				trigger.phaseList.splice(trigger.num, 0, `phaseDraw|${event.name}`);
			}
		},
		ai: { threaten: 2.6 },
	},
	//黄权
	gzdianhu: {
		unique: true,
		audio: "xinfu_dianhu",
		trigger: { player: "showCharacterAfter" },
		forced: true,
		filter(event, player) {
			return (
				event.toShow.some(name => {
					return get.character(name, 3).includes("gzdianhu");
				}) && !player.storage.gzdianhu_effect
			);
		},
		content() {
			"step 0";
			player.chooseTarget("请选择【点虎】的目标", true, "给一名角色标上“虎”标记。当你或你的队友对该角色造成伤害后摸一张牌。", lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player;
				var distance = game.countPlayer(function (current) {
					if (current.isFriendOf(player)) {
						return Math.pow(get.distance(current, target), 1.2);
					}
				});
				return 10 / distance;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("gzdianhu", target);
				target.markSkill("gzdianhu_mark");
				player.addSkill("gzdianhu_effect");
				player.markAuto("gzdianhu_effect", [target]);
			}
		},
		subSkill: {
			mark: {
				mark: true,
				marktext: "虎",
				intro: { content: "已成为“点虎”目标" },
			},
			effect: {
				trigger: { global: "damageEnd" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					if (!player.getStorage("gzdianhu_effect").includes(event.player)) {
						return false;
					}
					var source = event.source;
					return source && source.isAlive() && source.isFriendOf(player);
				},
				logTarget: "source",
				content() {
					trigger.source.draw();
				},
			},
		},
	},
	gzjianji: {
		audio: "xinfu_jianji",
		inherit: "xinfu_jianji",
		filterTarget: true,
		content() {
			"step 0";
			target.draw("visible");
			"step 1";
			var card = result[0];
			if (
				card &&
				game.hasPlayer(function (current) {
					return target.canUse(card, current);
				}) &&
				get.owner(card) == target
			) {
				target.chooseToUse({
					prompt: "是否使用" + get.translation(card) + "？",
					filterCard(cardx, player, target) {
						return cardx == _status.event.cardx;
					},
					cardx: card,
				});
			}
		},
		ai: {
			order: 10,
			result: { target: 1 },
		},
	},
	//杨婉
	gzyouyan: {
		audio: "youyan",
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false || player != _status.currentPhase) {
				return false;
			}
			var evt = event.getl(player);
			if (!evt || !evt.cards2 || !evt.cards2.length) {
				return false;
			}
			var list = [];
			for (var i of evt.cards2) {
				list.add(get.suit(i, player));
				if (list.length >= lib.suit.length) {
					return false;
				}
			}
			return true;
		},
		usable: 1,
		preHidden: true,
		async content(event, trigger, player) {
			let cards = get.cards(4, true);
			await player.showCards(cards, get.translation(player) + "发动了【诱言】");
			var evt = trigger.getl(player);
			var list = [];
			for (var i of evt.cards2) {
				list.add(get.suit(i, player));
			}
			cards = cards.filter(card => !list.includes(get.suit(card, false)));
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (
						typeof card == "object" &&
						player == _status.currentPhase &&
						(!player.storage.counttrigger || !player.storage.counttrigger.gzyouyan) &&
						player.needsToDiscard() == 1 &&
						card.cards &&
						card.cards.filter(function (i) {
							return get.position(i) == "h";
						}).length > 0 &&
						!get.tag(card, "draw") &&
						!get.tag(card, "gain") &&
						!get.tag(card, "discard")
					) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	gzzhuihuan: {
		audio: "zhuihuan",
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget([1, 2], `###${get.prompt(event.skill)}###选择至多两名角色获得“追还”效果`)
				.setHiddenSkill(event.skill)
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const prompt2 = "被选择的目标角色下次受到伤害后，其对伤害来源造成1点伤害；未被选择的目标角色下次受到伤害后，伤害来源弃置两张牌。";
			const next = player
				.chooseTarget("选择一名角色获得反伤效果", prompt2, (card, player, target) => {
					return get.event("allTargets").includes(target);
				})
				.set("allTargets", event.targets)
				.set("ai", target => {
					return get.attitude(get.player(), target);
				});
			if (event.targets.length > 1) {
				next.set("forced", true);
			}
			const result = await next.forResult();
			player.addTempSkill("gzzhuihuan_timeout", { player: "phaseZhunbeiBegin" });
			const id = `gzzhuihuan_${player.playerid}`;
			event.targets.forEach(target => {
				if (result?.bool && result.targets?.includes(target)) {
					player.line(target, "fire");
					target.addAdditionalSkill(id, "gzzhuihuan_damage");
				} else {
					player.line(target, "thunder");
					target.addAdditionalSkill(id, "gzzhuihuan_discard");
				}
			});
		},
		subSkill: {
			timeout: {
				charlotte: true,
				onremove(player) {
					var id = "gzzhuihuan_" + player.playerid;
					game.countPlayer(current => current.removeAdditionalSkill(id));
				},
			},
			damage: {
				charlotte: true,
				trigger: { player: "damageEnd" },
				forced: true,
				forceDie: true,
				filter(event, player) {
					return event.source && event.source.isAlive();
				},
				logTarget: "source",
				content() {
					player.removeSkill("gzzhuihuan_damage");
					trigger.source.damage();
				},
				mark: true,
				marktext: "追",
				intro: {
					content: "当你下次受到伤害后，你对伤害来源造成1点伤害。",
				},
				ai: {
					threaten: 0.5,
				},
			},
			discard: {
				charlotte: true,
				trigger: { player: "damageEnd" },
				forced: true,
				forceDie: true,
				filter(event, player) {
					return event.source && event.source.isAlive();
				},
				logTarget: "source",
				content() {
					player.removeSkill("gzzhuihuan_discard");
					trigger.source.chooseToDiscard(2, "he", true);
				},
				mark: true,
				marktext: "还",
				intro: {
					content: "当你下次受到伤害后，你令伤害来源弃置两张牌。",
				},
				ai: {
					threaten: 0.8,
				},
			},
		},
	},
	//海外田豫
	gzzhenxi: {
		audio: "twzhenxi",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			if (
				event.target.countCards("he") ||
				player.hasCard(function (card) {
					return get.suit(card) == "diamond" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "lebu" }, [card]), event.target);
				}, "he") ||
				player.hasCard(function (card) {
					return get.suit(card) == "club" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "bingliang" }, [card]), event.target, false);
				}, "he")
			) {
				return true;
			}
			return false;
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		direct: true,
		content() {
			"step 0";
			var target = trigger.target;
			event.target = target;
			var list = [],
				choiceList = ["弃置" + get.translation(target) + "一张牌", "将一张♦非锦囊牌当做【乐不思蜀】或♣非锦囊牌当做【兵粮寸断】对" + get.translation(target) + "使用", "背水！若其有暗置的武将牌且你的武将牌均明置，你依次执行上述两项"];
			if (target.countDiscardableCards(player, "he")) {
				list.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			if (
				player.countCards("he", function (card) {
					return get.suit(card) == "diamond" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "lebu" }, [card]), target);
				}) ||
				player.countCards("he", function (card) {
					return get.suit(card) == "club" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "bingliang" }, [card]), target);
				})
			) {
				list.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			if (target.isUnseen(2) && !player.isUnseen(2)) {
				list.push("背水！");
			} else {
				choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "</span>";
			}
			player
				.chooseControl(list, "cancel2")
				.set("prompt", get.prompt("gzzhenxi", target))
				.set("choiceList", choiceList)
				.set("ai", function () {
					var player = _status.event.player,
						trigger = _status.event.getTrigger(),
						list = _status.event.list;
					if (get.attitude(player, trigger.target) > 0) {
						return "cancel2";
					}
					if (list.includes("背水！")) {
						return "背水！";
					}
					if (list.includes("选项二")) {
						return "选项二";
					}
					return "选项一";
				})
				.set("list", list)
				.setHiddenSkill("gzzhenxi");
			"step 1";
			if (result.control == "cancel2") {
				event.finish();
				return;
			}
			player.logSkill("gzzhenxi", target);
			event.choice = result.control;
			if (event.choice != "选项二" && target.countDiscardableCards(player, "he")) {
				player.discardPlayerCard(target, "he", true);
			}
			"step 2";
			if (
				event.choice != "选项一" &&
				(player.hasCard(function (card) {
					return get.suit(card) == "diamond" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "lebu" }, [card]), target);
				}, "he") ||
					player.hasCard(function (card) {
						return get.suit(card) == "club" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "bingliang" }, [card]), target, false);
					}, "he"))
			) {
				var next = game.createEvent("gzzhenxi_use");
				next.player = player;
				next.target = target;
				next.setContent(lib.skill.gzzhenxi.contentx);
			}
		},
		ai: { unequip_ai: true },
		contentx() {
			"step 0";
			player.chooseCard({
				position: "hes",
				forced: true,
				prompt: "震袭",
				prompt2: "将一张♦非锦囊牌当做【乐不思蜀】或♣非锦囊牌当做【兵粮寸断】对" + get.translation(target) + "使用",
				filterCard(card, player) {
					if (get.itemtype(card) != "card" || get.type2(card) == "trick" || !["diamond", "club"].includes(get.suit(card))) {
						return false;
					}
					var cardx = { name: get.suit(card) == "diamond" ? "lebu" : "bingliang" };
					return player.canUse(get.autoViewAs(cardx, [card]), _status.event.getParent().target, false);
				},
			});
			"step 1";
			if (result.bool) {
				player.useCard({ name: get.suit(result.cards[0], player) == "diamond" ? "lebu" : "bingliang" }, target, result.cards);
			}
		},
	},
	gzjiansu: {
		init(player) {
			if (player.checkViceSkill("gzjiansu") && !player.viceChanged) {
				player.removeMaxHp();
			}
		},
		viceSkill: true,
		audio: 2,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (player == _status.currentPhase) {
				return false;
			}
			return event.getg(player).length;
		},
		frequent: true,
		group: "gzjiansu_use",
		preHidden: ["gzjiansu_use"],
		content() {
			player.showCards(trigger.getg(player), get.translation(player) + "发动了【俭素】");
			player.addGaintag(trigger.getg(player), "gzjiansu_tag");
			player.markSkill("gzjiansu");
		},
		intro: {
			mark(dialog, content, player) {
				var hs = player.getCards("h", function (card) {
					return card.hasGaintag("gzjiansu_tag");
				});
				if (hs.length) {
					dialog.addSmall(hs);
				} else {
					dialog.addText("无已展示手牌");
				}
			},
			content(content, player) {
				var hs = player.getCards("h", function (card) {
					return card.hasGaintag("gzjiansu_tag");
				});
				if (hs.length) {
					return get.translation(hs);
				} else {
					return "无已展示手牌";
				}
			},
		},
		subSkill: {
			use: {
				audio: "gzjiansu",
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					var num = player.countCards("h", function (card) {
						return card.hasGaintag("gzjiansu_tag");
					});
					return (
						num > 0 &&
						game.hasPlayer(function (current) {
							return current.isDamaged() && current.getDamagedHp() <= num;
						})
					);
				},
				direct: true,
				content() {
					"step 0";
					player
						.chooseCardTarget({
							prompt: get.prompt("gzjiansu"),
							prompt2: "弃置任意张“俭”，令一名体力值不大于你以此法弃置的牌数的角色回复1点体力",
							filterCard(card) {
								return get.itemtype(card) == "card" && card.hasGaintag("gzjiansu_tag");
							},
							selectCard: [1, Infinity],
							filterTarget(card, player, target) {
								return target.isDamaged();
							},
							filterOk() {
								return ui.selected.targets.length && ui.selected.targets[0].hp <= ui.selected.cards.length;
							},
							ai1(card) {
								if (ui.selected.targets.length && ui.selected.targets[0].hp <= ui.selected.cards.length) {
									return 0;
								}
								return 6 - get.value(card);
							},
							ai2(target) {
								var player = _status.event.player;
								return get.recoverEffect(target, player, player);
							},
							allowChooseAll: true,
						})
						.setHiddenSkill("gzjiansu_use");
					"step 1";
					if (result.bool) {
						var target = result.targets[0],
							cards = result.cards;
						player.logSkill("gzjiansu_use", target);
						player.discard(cards);
						target.recover();
					}
				},
			},
		},
	},
	//海外刘夫人
	gzzhuidu: {
		audio: "twzhuidu",
		trigger: { source: "damageBegin3" },
		filter(event, player) {
			return player.isPhaseUsing();
		},
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		usable: 1,
		logTarget: "player",
		content() {
			"step 0";
			var target = trigger.player;
			event.target = target;
			if (target.hasSex("female") && target.countCards("e") > 0) {
				player.chooseToDiscard("he", "追妒：是否弃置一张牌并令其执行两项？").set("ai", function (card) {
					return 8 - get.value(card);
				});
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.bool) {
				event._result = { control: "我全都要！" };
				event.goto(3);
			}
			"step 2";
			if (target.countCards("e") > 0) {
				target
					.chooseControl()
					.set("prompt", "追妒：请选择一项")
					.set("choiceList", ["令" + get.translation(player) + "此次对你造成的伤害+1", "弃置装备区里的所有牌"])
					.set("ai", function () {
						var player = _status.event.player,
							cards = player.getCards("e");
						if (player.hp <= 2) {
							return 1;
						}
						if (get.value(cards) <= 7) {
							return 1;
						}
						return 0;
					});
			} else {
				event._result = { control: "选项一" };
			}
			"step 3";
			player.line(target);
			if (result.control != "选项二") {
				trigger.num++;
			}
			if (result.control != "选项一") {
				target.chooseToDiscard(target.countCards("e"), true, "e");
			}
		},
	},
	gzshigong: {
		audio: "twshigong",
		trigger: { player: "dying" },
		filter(event, player) {
			return _status.currentPhase && _status.currentPhase != player && _status.currentPhase.isIn() && player.hasViceCharacter() && player.hp <= 0;
		},
		skillAnimation: true,
		animationColor: "gray",
		limited: true,
		logTarget: () => _status.currentPhase,
		check(event, player) {
			if (
				player.countCards("h", function (card) {
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					var mod = game.checkMod(card, player, event.player, "unchanged", "cardSavable", player);
					if (mod != "unchanged") {
						return mod;
					}
					var savable = get.info(card).savable;
					if (typeof savable == "function") {
						savable = savable(card, player, event.player);
					}
					return savable;
				}) >=
				1 - event.player.hp
			) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			var target = _status.currentPhase;
			event.target = target;
			player.awakenSkill("gzshigong");
			var list = lib.character[player.name2][3].filter(function (skill) {
				return get.skillCategoriesOf(skill, player).length == 0;
			});
			if (!list.length) {
				event._result = { control: "cancel2" };
				event.goto(2);
			} else {
				event.list = list;
			}
			player.removeCharacter(1);
			"step 1";
			target
				.chooseControl(event.list, "cancel2")
				.set(
					"choiceList",
					event.list.map(i => {
						return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, _status.currentPhase, false) + "</div>";
					})
				)
				.set("displayIndex", false)
				.set("ai", function () {
					if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
						return 0;
					}
					return [0, 1].randomGet();
				})
				.set("prompt", get.translation(player) + "对你发动了【示恭】")
				.set("prompt2", "获得一个技能并令其将体力回复至体力上限；或点击“取消”，令其将体力值回复至1点。");
			"step 2";
			if (result.control == "cancel2") {
				player.recover(1 - player.hp);
				event.finish();
			} else {
				target.addSkills(result.control);
				target.line(player);
				player.recover(player.maxHp - player.hp);
			}
		},
	},
	//海外服华雄
	gzyaowu: {
		audio: "new_reyaowu",
		limited: true,
		trigger: { source: "damageSource" },
		filter(event, player) {
			if (player.isUnseen(0) && lib.character[player.name1][3].includes("gzyaowu")) {
				return true;
			}
			if (player.isUnseen(1) && lib.character[player.name2][3].includes("gzyaowu")) {
				return true;
			}
			return false;
		},
		skillAnimation: true,
		animationColor: "fire",
		check(event, player) {
			return player.isDamaged() || player.hp <= 2;
		},
		content() {
			player.awakenSkill("gzyaowu");
			player.gainMaxHp(2);
			player.recover(2);
			player.addSkill("gzyaowu_die");
		},
		ai: { mingzhi_no: true },
		subSkill: {
			die: {
				audio: "new_reyaowu",
				trigger: { player: "dieAfter" },
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.isFriendOf(player);
					});
				},
				forced: true,
				forceDie: true,
				charlotte: true,
				skillAnimation: true,
				animationColor: "fire",
				logTarget(event, player) {
					return game.filterPlayer(function (current) {
						return current != player && current.isFriendOf(player);
					});
				},
				content() {
					for (var target of lib.skill.gzyaowu_die.logTarget(trigger, player)) {
						target.loseHp();
					}
				},
			},
		},
	},
	gzshiyong: {
		audio: "shiyong",
		derivation: "gzshiyongx",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!event.card) {
				return false;
			}
			if (player.awakenedSkills.includes("gzyaowu")) {
				return event.source && event.source.isIn() && get.color(event.card) != "black";
			}
			return get.color(event.card) != "red";
		},
		forced: true,
		logTarget(event, player) {
			if (player.awakenedSkills.includes("gzyaowu")) {
				return event.source;
			}
			return;
		},
		content() {
			(lib.skill.gzshiyong.logTarget(trigger, player) || player).draw();
		},
	},
	//海外服夏侯尚
	gztanfeng: {
		audio: "twtanfeng",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return !current.isFriendOf(player) && current.countDiscardableCards(player, "hej") > 0;
			});
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("gztanfeng"), function (card, player, target) {
					return !target.isFriendOf(player) && target.countDiscardableCards(player, "hej") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					if (target.hp + target.countCards("hs", { name: ["tao", "jiu"] }) <= 2) {
						return 3 * get.effect(target, { name: "guohe" }, player, player);
					}
					return get.effect(target, { name: "guohe" }, player, player);
				})
				.setHiddenSkill(event.name);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("gztanfeng", target);
				player.discardPlayerCard(target, "hej", true);
			} else {
				event.finish();
			}
			"step 2";
			target
				.chooseBool("是否受到" + get.translation(player) + "造成的1点火焰伤害，令其跳过一个阶段？")
				.set("ai", () => _status.event.choice)
				.set("choice", get.damageEffect(target, player, target, "fire") >= -5);
			"step 3";
			if (result.bool) {
				player.line(target);
				target.damage(1, "fire");
			} else {
				event.finish();
			}
			"step 4";
			var list = [];
			var list2 = [];
			event.map = {
				phaseJudge: "判定阶段",
				phaseDraw: "摸牌阶段",
				phaseUse: "出牌阶段",
				phaseDiscard: "弃牌阶段",
			};
			for (var i of ["phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard"]) {
				if (!player.skipList.includes(i)) {
					i = event.map[i];
					list.push(i);
					if (i != "判定阶段" && i != "弃牌阶段") {
						list2.push(i);
					}
				}
			}
			target
				.chooseControl(list)
				.set("prompt", "探锋：令" + get.translation(player) + "跳过一个阶段")
				.set("ai", function () {
					return _status.event.choice;
				})
				.set(
					"choice",
					(function () {
						var att = get.attitude(target, player);
						var num = player.countCards("j");
						if (att > 0) {
							if (list.includes("判定阶段") && num > 0) {
								return "判定阶段";
							}
							return "弃牌阶段";
						}
						if (list.includes("摸牌阶段") && player.hasJudge("lebu")) {
							return "摸牌阶段";
						}
						if ((list.includes("出牌阶段") && player.hasJudge("bingliang")) || player.needsToDiscard() > 0) {
							return "出牌阶段";
						}
						return list2.randomGet();
					})()
				);
			"step 5";
			for (var i in event.map) {
				if (event.map[i] == result.control) {
					player.skip(i);
				}
			}
			target.popup(result.control);
			target.line(player);
			game.log(player, "跳过了", "#y" + result.control);
		},
	},
	//十周年羊祜
	gzdeshao: {
		audio: "dcdeshao",
		trigger: { target: "useCardToTargeted" },
		usable(skill, player) {
			return player.hp;
		},
		preHidden: true,
		countUnseen(player) {
			let num = 0;
			if (player.isUnseen(0)) {
				num++;
			}
			if (player.isUnseen(1)) {
				num++;
			}
			return num;
		},
		filter(event, player) {
			if (player == event.player || event.targets.length != 1 || get.color(event.card) != "black") {
				return false;
			}
			if (lib.skill.gzdeshao.countUnseen(event.player) < lib.skill.gzdeshao.countUnseen(player)) {
				return false;
			}
			return event.player.countDiscardableCards(player, "he");
		},
		check(event, player) {
			return get.effect(event.player, { name: "guohe_copy2" }, player, player) > 0;
		},
		logTarget: "player",
		content() {
			player.discardPlayerCard(trigger.player, true, "he");
		},
	},
	gzmingfa: {
		audio: "dcmingfa",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target && target.isEnemyOf(player);
		},
		content() {
			player.markAuto("gzmingfa", targets);
			game.delayx();
		},
		onremove: true,
		ai: {
			order: 1,
			result: { target: -1 },
		},
		group: "gzmingfa_effect",
		subSkill: {
			effect: {
				audio: "dcmingfa",
				trigger: { global: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.getStorage("gzmingfa").includes(event.player);
				},
				logTarget: "player",
				content() {
					var target = trigger.player;
					player.unmarkAuto("gzmingfa", [target]);
					if (target.isIn()) {
						var num = player.countCards("h") - target.countCards("h");
						if (num > 0) {
							target.damage();
							player.gainPlayerCard(target, true, "h");
						} else if (num < 0) {
							player.draw(Math.min(5, -num));
						}
					}
				},
			},
		},
	},
	//海外服国战
	//杨修
	gzdanlao: {
		audio: "danlao",
		inherit: "danlao",
		preHidden: true,
		filter(event, player) {
			return get.type2(event.card) == "trick" && event.targets?.length > 1;
		},
	},
	gzjilei: {
		inherit: "jilei",
		preHidden: true,
		content() {
			"step 0";
			player
				.chooseControl("basic", "trick", "equip", "cancel2", function () {
					var source = _status.event.source;
					if (get.attitude(_status.event.player, source) > 0) {
						return "cancel2";
					}
					var list = ["basic", "trick", "equip"].filter(function (name) {
						return !source.storage.jilei2 || !source.storage.jilei2.includes(name);
					});
					if (!list.length) {
						return "cancel2";
					}
					if (
						list.includes("trick") &&
						source.countCards("h", function (card) {
							return get.type(card, null, source) == "trick" && source.hasValueTarget(card);
						}) > 1
					) {
						return "trick";
					}
					return list[0];
				})
				.set("prompt", get.prompt2("jilei", trigger.source))
				.set("source", trigger.source)
				.setHiddenSkill("gzjilei");
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("gzjilei", trigger.source);
				player.chat(get.translation(result.control) + "牌");
				game.log(player, "声明了", "#y" + get.translation(result.control) + "牌");
				trigger.source.addTempSkill("jilei2");
				trigger.source.storage.jilei2.add(result.control);
				trigger.source.updateMarks("jilei2");
				game.delayx();
			}
		},
	},
	//诸葛瑾
	gzhuanshi: {
		audio: "huanshi",
		trigger: { global: "judge" },
		popup: false,
		preHidden: true,
		filter(event, player) {
			return player.countCards("hes") > 0 && event.player.isFriendOf(player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(`${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`, "hes", card => {
					const player = get.player();
					const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				})
				.set("ai", card => {
					const trigger = get.event().getTrigger();
					const { player, judging } = get.event();
					const result = trigger.judge(card) - trigger.judge(judging);
					const attitude = get.attitude(player, trigger.player);
					if (attitude == 0 || result == 0) {
						return 0;
					}
					if (attitude > 0) {
						return result - get.value(card) / 2;
					} else {
						return -result - get.value(card) / 2;
					}
				})
				.set("judging", trigger.player.judging[0])
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = await player.respond(event.cards, event.name, "highlight", "noOrdering");
			if (cards?.length) {
				if (trigger.player.judging[0].clone) {
					trigger.player.judging[0].clone.classList.remove("thrownhighlight");
					game.broadcast(function (card) {
						if (card.clone) {
							card.clone.classList.remove("thrownhighlight");
						}
					}, trigger.player.judging[0]);
					game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
				}
				await game.cardsDiscard(trigger.player.judging[0]);
				trigger.player.judging[0] = cards[0];
				trigger.orderingCards.addArray(cards);
				game.log(trigger.player, "的判定牌改为", cards);
				await game.delay(2);
			}
		},
		ai: {
			rejudge: true,
			tag: { rejudge: 1 },
		},
	},
	gzhongyuan: {
		audio: "hongyuan",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCard(function (card) {
				return lib.skill.gzhongyuan.filterCard(card);
			}, "h");
		},
		filterCard(card) {
			return !card.hasTag("lianheng") && !card.hasGaintag("_lianheng");
		},
		position: "h",
		discard: false,
		lose: false,
		content() {
			cards[0].addGaintag("_lianheng");
			player.addTempSkill("gzhongyuan_clear");
		},
		check(card) {
			return 4.5 - get.value(card);
		},
		group: "gzhongyuan_draw",
		preHidden: true,
		ai: { order: 2, result: { player: 1 } },
		subSkill: {
			clear: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("_lianheng");
				},
			},
			draw: {
				audio: "hongyuan",
				trigger: { player: "drawBefore" },
				direct: true,
				filter(event, player) {
					return (
						event.getParent().name == "_lianheng" &&
						game.hasPlayer(function (current) {
							return current != player && current.isFriendOf(player);
						})
					);
				},
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("gzhongyuan"), "将摸牌（" + get.cnNumber(trigger.num) + "张）转移给一名同势力角色", function (card, player, target) {
							return target != player && target.isFriendOf(player);
						})
						.setHiddenSkill("gzhongyuan")
						.set("ai", () => -1);
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("gzhongyuan", target);
						trigger.cancel();
						target.draw(trigger.num);
					}
				},
			},
		},
	},
	gzmingzhe: {
		audio: "mingzhe",
		trigger: {
			player: ["loseAfter", "useCard", "respond"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (player == _status.currentPhase) {
				return false;
			}
			if (event.name == "useCard" || event.name == "respond") {
				return (
					get.color(event.card, false) == "red" &&
					player.hasHistory("lose", function (evt) {
						return (evt.relatedEvent || evt.getParent()) == event && evt.hs && evt.hs.length > 0;
					})
				);
			}
			var evt = event.getl(player);
			if (!evt || !evt.es || !evt.es.length) {
				return false;
			}
			for (var i of evt.es) {
				if (get.color(i, player) == "red") {
					return true;
				}
			}
			return false;
		},
		frequent: true,
		preHidden: true,
		content() {
			player.draw();
		},
	},
	//廖化
	gzdangxian: {
		trigger: { global: "phaseBegin" },
		forced: true,
		preHidden: true,
		audio: "dangxian",
		audioname: ["guansuo"],
		audioname2: {
			gz_guansuo: "dangxian_guansuo",
		},
		filter(event, player) {
			return event.player.isFriendOf(player) && event.player.hasMark("xianqu_mark");
		},
		async content(event, trigger, player) {
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
		group: "gzdangxian_show",
		global: "gzdangxian_ai",
		subSkill: {
			ai: {
				ai: {
					keepXianqu: true,
					skillTagFilter(player, tag, arg) {
						if (player.countMark("xianqu_mark") > 1) {
							return false;
						}
						if (!game.hasPlayer(current => current.isFriendOf(player) && current.hasSkill("gzdangxian"))) {
							return false;
						}
					},
				},
			},
			show: {
				audio: "dangxian",
				trigger: { player: "showCharacterAfter" },
				forced: true,
				filter(event, player) {
					return (
						event.toShow.some(name => {
							return get.character(name, 3).includes("gzdangxian");
						}) && !player.storage.gzdangxian_draw
					);
				},
				content() {
					player.storage.gzdangxian_draw = true;
					player.addMark("xianqu_mark", 1);
				},
			},
		},
	},
	//新国标2022
	//许褚
	gzluoyi: {
		audio: "luoyi",
		trigger: { player: "phaseDrawEnd" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player
				.chooseToDiscard("he", get.prompt2("gzluoyi"))
				.setHiddenSkill("gzluoyi")
				.set("ai", function (card) {
					var player = _status.event.player;
					if (
						player.hasCard(function (cardx) {
							if (cardx == card) {
								return false;
							}
							return (cardx.name == "sha" || cardx.name == "juedou") && player.hasValueTarget(cardx, null, true);
						}, "hs")
					) {
						return 5 - get.value(card);
					}
					return -get.value(card);
				}).logSkill = "gzluoyi";
			"step 1";
			if (result.bool) {
				player.addTempSkill("gzluoyi_buff");
			}
		},
		subSkill: {
			buff: {
				audio: "luoyi",
				charlotte: true,
				forced: true,
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.getParent().type == "card";
				},
				content() {
					trigger.num++;
				},
			},
		},
	},
	//典韦
	gzqiangxi: {
		audio: "qiangxi",
		inherit: "qiangxi",
		filterTarget(card, player, target) {
			return target != player;
		},
	},
	//小乔
	gztianxiang: {
		audio: "tianxiang",
		audioname: ["daxiaoqiao", "re_xiaoqiao", "ol_xiaoqiao"],
		trigger: { player: "damageBegin4" },
		preHidden: true,
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("h", card => {
					return _status.connectMode || (get.suit(card, player) == "heart" && lib.filter.cardDiscardable(card, player));
				}) > 0 && event.num > 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard(card, player) {
						return get.suit(card) == "heart" && lib.filter.cardDiscardable(card, player);
					},
					filterTarget: lib.filter.notMe,
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						const att = get.attitude(get.player(), target);
						const trigger = get.event().getTrigger();
						let da = 0;
						if (get.player().hp == 1) {
							da = 10;
						}
						const eff = get.damageEffect(target, trigger.source, target);
						if (att == 0) {
							return 0.1 + da;
						}
						if (eff >= 0 && att > 0) {
							return att + da;
						}
						if (att > 0 && target.hp > 1) {
							if (target.maxHp - target.hp >= 3) {
								return att * 1.1 + da;
							}
							if (target.maxHp - target.hp >= 2) {
								return att * 0.9 + da;
							}
						}
						return -att + da;
					},
					prompt: get.prompt(event.skill),
					prompt2: lib.translate[`${event.skill}_info`],
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			trigger.cancel();
			await player.discard(cards);
			const { result } = await player
				.chooseControlList(true, (event, player) => get.event().index, [`令${get.translation(target)}受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）`, `令${get.translation(target)}失去1点体力，然后获得${get.translation(cards)}`])
				.set(
					"index",
					(() => {
						let att = get.attitude(player, target);
						if (target.hasSkillTag("maihp")) {
							att = -att;
						}
						return att > 0 ? 0 : 1;
					})()
				);
			if (typeof result.index != "number") {
				return;
			}
			if (result.index == 0) {
				await target.damage(trigger.source || "nosource", "nocard");
				if (target.getDamagedHp()) {
					await target.draw(Math.min(5, target.getDamagedHp()));
				}
			} else {
				await target.loseHp();
				if (cards[0].isInPile()) {
					await target.gain(cards, "gain2");
				}
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (get.tag(card, "damage") && target.countCards("he") > 1) {
						return 0.7;
					}
				},
			},
		},
	},
	gzhongyan: {
		mod: {
			suit(card, suit) {
				if (suit == "spade") {
					return "heart";
				}
			},
			maxHandcard(player, num) {
				if (
					player.hasCard(function (card) {
						return get.suit(card, player) == "heart";
					}, "e")
				) {
					return num + 1;
				}
			},
		},
	},
	//黄忠
	gzliegong: {
		audio: "liegong",
		audioname2: { gz_jun_liubei: "shouyue_liegong" },
		locked: false,
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "sha" && target.countCards("h") < player.countCards("h")) {
					return true;
				}
			},
			attackRange(player, distance) {
				if (get.zhu(player, "shouyue")) {
					return distance + 1;
				}
			},
		},
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && player.hp <= event.target.hp;
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			var str = get.translation(trigger.target),
				card = get.translation(trigger.card);
			player
				.chooseControl("cancel2")
				.set("choiceList", ["令" + card + "对" + str + "的伤害+1", "令" + str + "不能响应" + card])
				.set("prompt", get.prompt("gzliegong", trigger.target))
				.setHiddenSkill("gzliegong")
				.set("ai", function () {
					var player = _status.event.player,
						target = _status.event.getTrigger().target;
					if (get.attitude(player, target) > 0) {
						return 2;
					}
					return target.mayHaveShan(player, "use") ? 1 : 0;
				});
			"step 1";
			if (result.control != "cancel2") {
				var target = trigger.target;
				player.logSkill("gzliegong", target);
				if (result.index == 1) {
					game.log(trigger.card, "不可被", target, "响应");
					trigger.directHit.add(target);
				} else {
					game.log(trigger.card, "对", target, "的伤害+1");
					var map = trigger.getParent().customArgs,
						id = target.playerid;
					if (!map[id]) {
						map[id] = {};
					}
					if (!map[id].extraDamage) {
						map[id].extraDamage = 0;
					}
					map[id].extraDamage++;
				}
			}
		},
	},
	//潘凤
	gzkuangfu: {
		audio: "kuangfu",
		trigger: { player: "useCardToPlayered" },
		preHidden: true,
		logTarget: "target",
		filter(event, player) {
			return event.card.name == "sha" && player.isPhaseUsing() && !player.hasSkill("gzkuangfu_extra") && event.target.countGainableCards(player, "e") > 0;
		},
		check(event, player) {
			if (
				get.attitude(player, event.target) > 0 ||
				!event.target.hasCard(function (card) {
					return lib.filter.canBeGained(card, player, event.target) && get.value(card, event.target) > 0;
				}, "e")
			) {
				return false;
			}
			return true;
		},
		content() {
			trigger.getParent()._gzkuangfued = true;
			player.gainPlayerCard(trigger.target, "e", true);
			player.addTempSkill("gzkuangfu_extra", "phaseUseAfter");
		},
		subSkill: {
			extra: {
				trigger: { player: "useCardAfter" },
				charlotte: true,
				forced: true,
				filter(event, player) {
					return (
						event._gzkuangfued &&
						!player.hasHistory("sourceDamage", function (evt) {
							return evt.card && event.card;
						}) &&
						player.countCards("h") > 0
					);
				},
				content() {
					player.chooseToDiscard("h", 2, true);
				},
			},
		},
	},
	//吕布
	gzwushuang: {
		audio: "wushuang",
		audioname2: { gz_lvlingqi: "wushuang_lvlingqi" },
		forced: true,
		locked: true,
		group: ["wushuang1", "wushuang2"],
		preHidden: ["wushuang1", "wushuang2", "gzwushuang"],
		trigger: { player: "useCard1" },
		direct: true,
		filter(event, player) {
			if (event.card.name != "juedou" || !event.card.isCard) {
				return false;
			}
			if (event.targets) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var num = game.countPlayer(function (current) {
				return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current);
			});
			player
				.chooseTarget("无双：是否为" + get.translation(trigger.card) + "增加" + (num > 1 ? "至多两个" : "一个") + "目标？", [1, Math.min(2, num)], function (card, player, target) {
					var trigger = _status.event.getTrigger();
					var card = trigger.card;
					return !trigger.targets.includes(target) && lib.filter.targetEnabled2(card, player, target);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var card = _status.event.getTrigger().card;
					return get.effect(target, card, player, player);
				})
				.setHiddenSkill("gzwushuang");
			"step 1";
			if (result.bool) {
				if (player != game.me && !player.isOnline()) {
					game.delayx();
				}
			} else {
				event.finish();
			}
			"step 2";
			var targets = result.targets.sortBySeat();
			player.logSkill("gzwushuang", targets);
			trigger.targets.addArray(targets);
		},
	},
	//夏侯渊
	gzshensu: {
		audio: "shensu1",
		audioname: ["xiahouba", "re_xiahouyuan", "ol_xiahouyuan"],
		group: ["gzshensu_1", "gzshensu_2"],
		preHidden: ["gzshensu_1", "gzshensu_2", "gzshensu"],
		trigger: { player: "phaseDiscardBegin" },
		direct: true,
		filter(event, player) {
			return player.hp > 0;
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("gzshensu"), "失去1点体力并跳过弃牌阶段，视为对一名其他角色使用一张无距离限制的【杀】", function (card, player, target) {
					return player.canUse("sha", target, false);
				})
				.setHiddenSkill("gzshensu")
				.set("goon", player.needsToDiscard())
				.set("ai", function (target) {
					var player = _status.event.player;
					if (!_status.event.goon || player.hp <= target.hp) {
						return false;
					}
					return get.effect(target, { name: "sha", isCard: true }, player, player);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("gzshensu", target);
				player.loseHp();
				trigger.cancel();
				player.useCard({ name: "sha", isCard: true }, target, false);
			}
		},
		subSkill: {
			1: {
				audio: "shensu1",
				inherit: "shensu1",
				sourceSkill: "gzshensu",
			},
			2: {
				inherit: "shensu2",
				sourceSkill: "gzshensu",
			},
		},
	},
	//吕玲绮
	gzshenwei: {
		audio: "llqshenwei",
		mainSkill: true,
		init(player) {
			if (player.checkMainSkill("gzshenwei")) {
				player.removeMaxHp();
			}
		},
		trigger: { player: "phaseDrawBegin2" },
		forced: true,
		locked: false,
		filter: (event, player) => !event.numFixed && player.isMaxHandcard(),
		preHidden: true,
		content() {
			trigger.num += 2;
		},
		mod: {
			maxHandcard: (player, num) => num + 2,
		},
	},
	gzzhuangrong: {
		audio: "zhuangrong",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				!player.hasSkill("gz_wushuang") &&
				player.hasCard(function (card) {
					return get.type2(card, player) == "trick";
				}, "h")
			);
		},
		filterCard(card, player) {
			return get.type2(card, player) == "trick";
		},
		content() {
			player.addTempSkills("gz_wushuang", "phaseUseEnd");
		},
		derivation: "gz_wushuang",
	},
	wushuang_lvlingqi: { audio: 2 },
	//荀谌
	gzfenglve: {
		audio: "refenglve",
		derivation: "gzfenglve_zongheng",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				!player.hasSkillTag("noCompareSource") &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("h") > 0 && !current.hasSkillTag("noCompareTarget");
				})
			);
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0 && !target.hasSkillTag("noCompareTarget");
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				if (!target.countCards("hej")) {
					event.goto(3);
				} else {
					event.giver = target;
					event.gainner = player;
					target.choosePlayerCard(target, true, "hej", 2, "交给" + get.translation(player) + "两张牌");
				}
			} else if (result.tie) {
				event.goto(3);
			} else {
				if (!player.countCards("he")) {
					event.goto(3);
				} else {
					event.giver = player;
					event.gainner = target;
					player.chooseCard(true, "he", "交给" + get.translation(target) + "一张牌");
				}
			}
			"step 2";
			if (result.bool) {
				event.giver.give(result.cards, event.gainner, "giveAuto");
			}
			"step 3";
			if (target.isIn()) {
				player.chooseBool("纵横：是否令" + get.translation(target) + "获得【锋略】？").set("ai", function () {
					var evt = _status.event.getParent();
					return get.attitude(evt.player, evt.target) > 0;
				});
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool) {
				target.addTempSkill("gzfenglve_zongheng", { player: "phaseEnd" });
				game.log(player, "发起了", "#y纵横", "，令", target, "获得了技能", "#g【锋略】");
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (
						!player.hasCard(function (card) {
							if (get.position(card) != "h") {
								return false;
							}
							var val = get.value(card);
							if (val < 0) {
								return true;
							}
							if (val <= 5) {
								return card.number >= 10;
							}
							if (val <= 6) {
								return card.number >= 13;
							}
							return false;
						})
					) {
						return 0;
					}
					return -Math.sqrt(1 + target.countCards("he")) / (1 + target.countCards("j"));
				},
			},
		},
	},
	gzfenglve_zongheng: {
		inherit: "gzfenglve",
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				if (!target.countCards("hej")) {
					event.finish();
				} else {
					event.giver = target;
					event.gainner = player;
					target.choosePlayerCard(target, true, "hej", "交给" + get.translation(player) + "一张牌");
				}
			} else if (result.tie) {
				event.finish();
			} else {
				if (!player.countCards("he")) {
					event.finish();
				} else {
					event.giver = player;
					event.gainner = target;
					player.chooseCard(true, "he", 2, "交给" + get.translation(target) + "两张牌");
				}
			}
			"step 2";
			if (result.bool) {
				event.giver.give(result.cards, event.gainner, "giveAuto");
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (
						!player.hasCard(function (card) {
							if (get.position(card) != "h") {
								return false;
							}
							var val = get.value(card);
							if (val < 0) {
								return true;
							}
							if (val <= 5) {
								return card.number >= 12;
							}
							if (val <= 6) {
								return card.number >= 13;
							}
							return false;
						})
					) {
						return 0;
					}
					return -Math.sqrt(1 + target.countCards("he")) / (1 + target.countCards("j"));
				},
			},
		},
	},
	gzanyong: {
		audio: "anyong",
		trigger: { global: "damageBegin1" },
		usable: 1,
		filter(event, player) {
			return event.source && event.player != event.source && event.source.isFriendOf(player) && event.player.isIn();
		},
		check(event, player) {
			if (get.attitude(player, event.player) > 0) {
				return false;
			}
			if (
				event.player.hasSkillTag("filterDamage", null, {
					player: event.source,
					card: event.card,
				})
			) {
				return false;
			}
			if (event.player.isUnseen()) {
				return true;
			}
			if (event.player.hp > event.num && event.player.hp <= event.num * 2) {
				return player.hp > 1 || event.player.isUnseen(2);
			}
			return false;
		},
		logTarget: "player",
		preHidden: true,
		content() {
			trigger.num *= 2;
			if (!trigger.player.isUnseen(2)) {
				player.loseHp();
				player.removeSkill("gzanyong");
			} else if (!trigger.player.isUnseen()) {
				player.chooseToDiscard("h", 2, true);
			}
		},
	},
	//周夷
	gzzhukou: {
		audio: "zhukou",
		trigger: { source: "damageSource" },
		preHidden: true,
		filter(event, player) {
			if (!player.getHistory("useCard").length) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (!evt || !evt.player) {
				return false;
			}
			return (
				player
					.getHistory("sourceDamage", function (evtx) {
						return evtx.getParent("phaseUse") == evt;
					})
					.indexOf(event) == 0
			);
		},
		frequent: true,
		content() {
			player.draw(Math.min(player.getHistory("useCard").length, 5));
		},
	},
	gzduannian: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		preHidden: true,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				!player.hasCard(function (card) {
					return !lib.filter.cardDiscardable(card, player, "gzduannian");
				}, "h")
			);
		},
		check(event, player) {
			return (
				player.countCards("h", function (card) {
					return get.value(card) >= 6;
				}) <= Math.max(1, player.countCards("h") / 2)
			);
		},
		content() {
			"step 0";
			var cards = player.getCards("h", function (card) {
				return lib.filter.cardDiscardable(card, player, "gzduannian");
			});
			if (cards.length) {
				player.discard(cards);
			} else {
				event.finish();
			}
			"step 1";
			player.drawTo(player.maxHp);
		},
	},
	gzlianyou: {
		trigger: { player: "die" },
		direct: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "fire",
		content() {
			"step 0";
			player
				.chooseTarget(lib.filter.notMe, get.prompt("gzlianyou"), "令一名其他角色获得〖兴火〗")
				.set("forceDie", true)
				.set("ai", function (target) {
					return 10 + get.attitude(_status.event.player, target) * (target.hasSkillTag("fireAttack", null, null, true) ? 2 : 1);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("gzlianyou", target);
				target.addSkills("gzxinghuo");
				game.delayx();
			}
		},
		derivation: "gzxinghuo",
	},
	gzxinghuo: {
		trigger: { source: "damageBegin1" },
		forced: true,
		filter(event) {
			return event.hasNature("fire");
		},
		content() {
			trigger.num++;
		},
	},
	//南华老仙
	gzgongxiu: {
		audio: "gongxiu",
		trigger: { player: "phaseDrawBegin2" },
		preHidden: true,
		filter(event, player) {
			return !event.numFixed && event.num > 0 && player.maxHp > 0;
		},
		content() {
			trigger.num--;
			player.addTempSkill("gzgongxiu2", "phaseDrawAfter");
		},
	},
	gzgongxiu2: {
		trigger: { player: "phaseDrawEnd" },
		forced: true,
		charlotte: true,
		popup: false,
		content() {
			"step 0";
			var str = "令至多" + get.cnNumber(player.maxHp) + "名角色";
			if (typeof player.storage.gzgongxiu != "number") {
				player.chooseControl().set("choiceList", [str + "各摸一张牌", str + "各弃置一张牌"]);
			} else {
				event._result = { index: 1 - player.storage.gzgongxiu };
			}
			"step 1";
			var num = result.index;
			event.index = num;
			player.storage.gzgongxiu = num;
			player
				.chooseTarget(true, [1, player.maxHp], "选择至多" + get.cnNumber(player.maxHp) + "名角色各" + (num ? "弃置" : "摸") + "一张牌")
				.set("goon", event.index ? -1 : 1)
				.set("ai", function (target) {
					var evt = _status.event;
					return evt.goon * get.attitude(evt.player, target);
				});
			"step 2";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.line(targets, "green");
				if (event.index == 0) {
					game.asyncDraw(targets);
				} else {
					for (var i of targets) {
						i.chooseToDiscard("he", true);
					}
					event.finish();
				}
			}
			"step 3";
			game.delayx();
		},
	},
	gzjinghe: {
		audio: "jinghe",
		enable: "phaseUse",
		filter(event, player) {
			return player.maxHp > 0 && player.countCards("h") > 0 && !player.hasSkill("gzjinghe_clear");
		},
		selectCard() {
			var max = _status.event.player.maxHp;
			if (ui.selected.targets.length) {
				return [ui.selected.targets.length, max];
			}
			return [1, max];
		},
		selectTarget() {
			return ui.selected.cards.length;
		},
		filterTarget(card, player, target) {
			return !target.isUnseen();
		},
		filterCard(card) {
			if (ui.selected.cards.length) {
				var name = get.name(card);
				for (var i of ui.selected.cards) {
					if (get.name(i) == name) {
						return false;
					}
				}
			}
			return true;
		},
		position: "h",
		check(card) {
			var player = _status.event.player;
			if (
				game.countPlayer(function (current) {
					return get.attitude(player, current) > 0 && !current.isUnseen();
				}) > ui.selected.cards.length
			) {
				return get.position(card) == "e" ? 2 : 1;
			}
			return 0;
		},
		complexCard: true,
		discard: false,
		lose: false,
		delay: false,
		multitarget: true,
		multiline: true,
		content() {
			"step 0";
			player.showCards(cards, get.translation(player) + "发动了【经合】");
			event.skills = lib.skill.gzjinghe.derivation.randomGets(targets.length);
			player.addTempSkill("gzjinghe_clear", { player: "phaseBegin" });
			event.targets.sortBySeat();
			event.num = 0;
			"step 1";
			event.target = targets[num];
			event.num++;
			event.target
				.chooseControl(event.skills, "cancel2")
				.set(
					"choiceList",
					event.skills.map(function (i) {
						return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player, false) + "</div>";
					})
				)
				.set("displayIndex", false)
				.set("prompt", "选择获得一个技能");
			"step 2";
			var skill = result.control;
			if (skill != "cancel2") {
				event.skills.remove(skill);
				target.addAdditionalSkills("gzjinghe_" + player.playerid, skill);
				target.popup(skill);
			}
			if (event.num < event.targets.length) {
				event.goto(1);
			}
			if (target != game.me && !target.isOnline2()) {
				game.delayx();
			}
		},
		ai: {
			threaten: 3,
			order: 10,
			result: {
				target: 1,
			},
		},
		derivation: ["leiji", "nhyinbing", "nhhuoqi", "nhguizhu", "nhxianshou", "nhlundao", "nhguanyue", "nhyanzheng"],
		subSkill: {
			clear: {
				onremove(player) {
					game.countPlayer(function (current) {
						current.removeAdditionalSkills("gzjinghe_" + player.playerid);
					});
				},
			},
		},
	},
	//孙綝
	gzshilu: {
		audio: "zyshilu",
		preHidden: true,
		trigger: { global: "dieAfter" },
		prompt2(event, player) {
			return "将其的所有武将牌" + (player == event.source ? "及武将牌库里的两张随机武将牌" : "") + "置于武将牌上作为“戮”";
		},
		logTarget: "player",
		content() {
			var list = [],
				target = trigger.player;
			if (target.name1 && target.name1.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) {
				list.push(target.name1);
			}
			if (target.name2 && target.name2.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) {
				list.push(target.name2);
			}
			_status.characterlist.removeArray(list);
			if (player == trigger.source) {
				list.addArray(_status.characterlist.randomRemove(2));
			}
			if (list.length) {
				player.markAuto("gzshilu", list);
				game.log(player, "将", "#g" + get.translation(list), "置于武将牌上作为", "#y“戮”");
				game.broadcastAll(
					function (player, list) {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = "huashen_card_" + list[i];
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + list[i],
							};
							lib.translate[cardname] = get.rawName2(list[i]);
							cards.push(game.createCard(cardname, "", ""));
						}
						player.$draw(cards, "nobroadcast");
					},
					player,
					list
				);
			}
		},
		marktext: "戮",
		intro: {
			content: "character",
			onunmark(storage, player) {
				if (storage && storage.length) {
					_status.characterlist.addArray(storage);
					storage.length = 0;
				}
			},
			mark(dialog, storage, player) {
				if (storage && storage.length) {
					dialog.addSmall([storage, "character"]);
				} else {
					return "没有“戮”";
				}
			},
			// content:function(storage,player){
			// 	return '共有'+get.cnNumber(storage.length)+'张“戮”';
			// },
		},
		group: "gzshilu_zhiheng",
		subSkill: {
			zhiheng: {
				audio: "gzshilu",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getStorage("gzshilu").length > 0 && player.countCards("he") > 0;
				},
				direct: true,
				content() {
					"step 0";
					var num = Math.min(player.getStorage("gzshilu").length, player.countCards("he"));
					player.chooseToDiscard("he", get.prompt("gzshilu"), "弃置至多" + get.cnNumber(num) + "张牌并摸等量的牌", [1, num]).logSkill = "gzshilu";
					"step 1";
					if (result.bool && result.cards && result.cards.length) {
						player.draw(result.cards.length);
					}
				},
			},
		},
	},
	gzxiongnve: {
		audio: "zyxiongnve",
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.getStorage("gzshilu").length > 0;
		},
		content() {
			"step 0";
			player
				.chooseButton([get.prompt("gzxiongnve"), [player.storage.gzshilu, "character"]])
				.set("ai", function (button) {
					if (!_status.event.goon) {
						return 0;
					}
					var name = button.link,
						group = get.is.double(name, true);
					if (!group) {
						group = [lib.character[name][1]];
					}
					for (var i of group) {
						if (
							game.hasPlayer(function (current) {
								return player.inRange(current) && current.identity == i;
							})
						) {
							return 1 + Math.random();
						}
					}
					return 0;
				})
				.set(
					"goon",
					player.countCards("hs", function (card) {
						return get.tag(card, "damage") && player.hasValueTarget(card);
					}) > 1
				);
			"step 1";
			if (result.bool) {
				player.logSkill("gzxiongnve");
				lib.skill.gzxiongnve.throwCharacter(player, result.links);
				game.delayx();
				var group = get.is.double(result.links[0], true);
				if (!group) {
					group = [lib.character[result.links[0]][1]];
				}
				event.group = group;
				var str = get.translation(group);
				player
					.chooseControl()
					.set("prompt", "选择获得一项效果")
					.set("choiceList", ["本回合对" + str + "势力的角色造成的伤害+1", "本回合对" + str + "势力的角色造成伤害后，获得对方的一张牌", "本回合对" + str + "势力的角色使用牌没有次数限制"])
					.set("ai", function () {
						var player = _status.event.player;
						if (
							player.countCards("hs", function (card) {
								return get.name(card) == "sha" && player.hasValueTarget(card);
							}) > player.getCardUsable("sha")
						) {
							return 0;
						}
						return get.rand(1, 2);
					});
			} else {
				event.finish();
			}
			"step 2";
			var skill = "gzxiongnve_effect" + result.index;
			player.markAuto(skill, event.group);
			player.addTempSkill(skill);
			game.log(player, "本回合对" + get.translation(event.group) + "势力的角色", "#g" + lib.skill[skill].promptx);
		},
		group: "gzxiongnve_end",
		throwCharacter(player, list) {
			player.unmarkAuto("gzshilu", list);
			_status.characterlist.addArray(list);
			game.log(player, "从", "#y“戮”", "中移去了", "#g" + get.translation(list));
			game.broadcastAll(
				function (player, list) {
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						var cardname = "huashen_card_" + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: "character:" + list[i],
						};
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, "", ""));
					}
					player.$throw(cards, 1000, "nobroadcast");
				},
				player,
				list
			);
		},
		subSkill: {
			effect0: {
				promptx: "造成的伤害+1",
				charlotte: true,
				onremove: true,
				audio: "zyxiongnve",
				intro: {
					content: "对$势力的角色造成的伤害+1",
				},
				trigger: { source: "damageBegin1" },
				forced: true,
				filter(event, player) {
					return player.getStorage("gzxiongnve_effect0").includes(event.player.identity);
				},
				logTarget: "player",
				content() {
					trigger.num++;
				},
			},
			effect1: {
				promptx: "造成伤害后，获得对方的一张牌",
				charlotte: true,
				onremove: true,
				audio: "zyxiongnve",
				intro: {
					content: "对$势力的角色造成伤害后，获得对方的一张牌",
				},
				trigger: { source: "damageEnd" },
				forced: true,
				filter(event, player) {
					return player.getStorage("gzxiongnve_effect1").includes(event.player.identity) && event.player.countGainableCards(player, "he") > 0;
				},
				logTarget: "player",
				content() {
					player.gainPlayerCard(trigger.player, true, "he");
				},
			},
			effect2: {
				promptx: "使用牌没有次数限制",
				charlotte: true,
				onremove: true,
				intro: {
					content: "对$势力的角色使用牌没有次数限制",
				},
				mod: {
					cardUsableTarget(card, player, target) {
						if (player.getStorage("gzxiongnve_effect2").includes(target.identity)) {
							return true;
						}
					},
				},
			},
			effect3: {
				charlotte: true,
				audio: "zyxiongnve",
				mark: true,
				intro: {
					content: "其他角色对你造成伤害时，此伤害-1",
				},
				trigger: { player: "damageBegin3" },
				filter(event, player) {
					return event.source && event.source != player;
				},
				forced: true,
				logTarget: "source",
				content() {
					trigger.num--;
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (target == player) {
								return;
							}
							if (player.hasSkillTag("jueqing", false, target)) {
								return;
							}
							var num = get.tag(card, "damage");
							if (num) {
								if (num > 1) {
									return 0.5;
								}
								return 0;
							}
						},
					},
				},
			},
			end: {
				trigger: { player: "phaseUseEnd" },
				direct: true,
				filter(event, player) {
					return player.getStorage("gzshilu").length > 1;
				},
				content() {
					"step 0";
					player.chooseButton(["是否移去两张“戮”获得减伤？", [player.storage.gzshilu, "character"]], 2).set("ai", function (button) {
						var name = button.link,
							group = get.is.double(name, true);
						if (!group) {
							group = [lib.character[name][1]];
						}
						for (var i of group) {
							if (
								game.hasPlayer(function (current) {
									return current.identity == i;
								})
							) {
								return 0;
							}
						}
						return 1;
					});
					"step 1";
					if (result.bool) {
						player.logSkill("gzxiongnve");
						lib.skill.gzxiongnve.throwCharacter(player, result.links);
						player.addTempSkill("gzxiongnve_effect3", { player: "phaseBegin" });
						game.delayx();
					}
				},
			},
		},
	},
	//邓芝
	gzjianliang: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		frequent: true,
		preHidden: true,
		filter(event, player) {
			return player.isMinHandcard();
		},
		logTarget(event, player) {
			var isFriend;
			if (player.identity == "unknown") {
				var group = "shu";
				if (!player.wontYe("shu")) {
					group = null;
				}
				isFriend = function (current) {
					return current == player || current.identity == group;
				};
			} else {
				isFriend = function (target) {
					return target.isFriendOf(player);
				};
			}
			return game.filterPlayer(isFriend);
		},
		content() {
			"step 0";
			var list = game.filterPlayer(function (current) {
				return current.isFriendOf(player);
			});
			if (list.length == 1) {
				list[0].draw();
				event.finish();
			} else {
				game.asyncDraw(list);
			}
			"step 1";
			game.delayx();
		},
	},
	gzweimeng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countGainableCards(player, "h") > 0;
		},
		content() {
			"step 0";
			player.gainPlayerCard(target, "h", true, event.name == "gzweimeng" ? [1, player.hp] : 1);
			"step 1";
			if (result.bool && target.isIn()) {
				var num = result.cards.length,
					hs = player.getCards("he");
				if (!hs.length) {
					event.goto(3);
				} else if (hs.length <= num) {
					event._result = { bool: true, cards: hs };
				} else {
					player.chooseCard("he", true, "选择交给" + get.translation(target) + get.cnNumber(num) + "张牌", num);
				}
			} else {
				event.goto(3);
			}
			"step 2";
			player.give(result.cards, target);
			"step 3";
			if (target.isIn() && event.name == "gzweimeng") {
				player.chooseBool("纵横：是否令" + get.translation(target) + "获得【危盟】？").set("ai", function () {
					var evt = _status.event.getParent();
					return get.attitude(evt.player, evt.target) > 0;
				});
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool) {
				target.addTempSkill("gzweimeng_zongheng", { player: "phaseEnd" });
				game.log(player, "发起了", "#y纵横", "，令", target, "获得了技能", "#g【危盟】");
			}
		},
		derivation: "gzweimeng_zongheng",
		subSkill: {
			zongheng: {
				inherit: "gzweimeng",
				ai: {
					order: 6,
					tag: {
						lose: 1,
						loseCard: 1,
						gain: 1,
					},
					result: {
						target: -1,
					},
				},
			},
		},
		ai: {
			order: 6,
			tag: {
				lose: 1,
				loseCard: 1,
				gain: 1,
			},
			result: {
				target(player, target) {
					return -Math.pow(Math.min(player.hp, target.countCards("h")), 2) / 4;
				},
			},
		},
	},
	//邹氏
	huoshui: {
		audio: 2,
		forced: true,
		global: "huoshui_mingzhi",
		trigger: { player: "useCardToTargeted" },
		preHidden: true,
		filter(event, player) {
			return (event.card.name == "sha" || event.card.name == "wanjian") && event.target.isUnseen(2) && event.target.isEnemyOf(player);
		},
		logTarget: "target",
		content() {
			var target = trigger.target;
			target.addTempSkill("huoshui_norespond");
			target.markAuto("huoshui_norespond", [trigger.card]);
		},
	},
	huoshui_norespond: {
		charlotte: true,
		trigger: { global: "useCardEnd" },
		onremove: true,
		forced: true,
		popup: false,
		silent: true,
		firstDo: true,
		filter(event, player) {
			return player.getStorage("huoshui_norespond").includes(event.card);
		},
		content() {
			player.unmarkAuto("huoshui_norespond", [trigger.card]);
			if (!player.storage.huoshui_norespond.length) {
				player.removeSkill("huoshui_norespond");
			}
		},
		mod: {
			cardEnabled(card) {
				if (card.name == "shan") {
					return false;
				}
			},
			cardRespondable(card) {
				if (card.name == "shan") {
					return false;
				}
			},
		},
	},
	huoshui_mingzhi: {
		ai: {
			nomingzhi: true,
			skillTagFilter(player) {
				if (_status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill("huoshui")) {
					return true;
				}
				return false;
			},
		},
	},
	qingcheng: {
		audio: 2,
	},
	qingcheng_ai: {
		ai: {
			effect: {
				target(card) {
					if (get.tag(card, "damage")) {
						return 2;
					}
				},
			},
		},
	},
	//朱灵
	gzjuejue: {
		audio: 2,
		trigger: { player: "phaseDiscardBegin" },
		check(event, player) {
			return (
				player.hp > 2 &&
				player.needsToDiscard() > 0 &&
				game.countPlayer(function (current) {
					return get.attitude(current, player) <= 0;
				}) >
					game.countPlayer() / 2
			);
		},
		preHidden: true,
		content() {
			player.addTempSkill("gzjuejue_effect");
			player.loseHp();
		},
		subSkill: {
			effect: {
				trigger: { player: "phaseDiscardAfter" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return (
						player.getHistory("lose", function (evt) {
							return evt.type == "discard" && evt.cards2 && evt.cards2.length > 0 && evt.getParent("phaseDiscard") == event;
						}).length > 0
					);
				},
				content() {
					"step 0";
					var num = 0;
					player.getHistory("lose", function (evt) {
						if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) {
							num += evt.cards2.length;
						}
					});
					event.num = num;
					event.targets = game
						.filterPlayer(function (current) {
							return current != player;
						})
						.sortBySeat();
					player.line(event.targets, "green");
					"step 1";
					var target = targets.shift();
					event.target = target;
					if (target.isIn()) {
						target.addTempClass("target");
						target.chooseCard("h", num, "将" + get.cnNumber(num) + "张牌置入弃牌堆，或受到1点伤害").set("ai", function (card) {
							var evt = _status.event.getParent();
							if (get.damageEffect(evt.target, evt.player, evt.target) >= 0) {
								return 0;
							}
							return 8 / Math.sqrt(evt.num) + evt.target.getDamagedHp() - get.value(card);
						});
					} else if (targets.length) {
						event.redo();
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						target.lose(result.cards, ui.discardPile, "visible");
						target.$throw(result.cards, 1000);
						game.log(target, "将", result.cards, "置入了弃牌堆");
					} else {
						target.damage();
					}
					"step 3";
					game.delayx();
					if (targets.length) {
						event.goto(1);
					}
				},
			},
		},
		ai: {
			noDieAfter2: true,
			skillTagFilter(player, tag, target) {
				return target.isFriendOf(player);
			},
		},
	},
	gzfangyuan: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		zhenfa: "siege",
		direct: true,
		locked: false,
		filter(event, player) {
			return (
				game.countPlayer() >= 4 &&
				game.hasPlayer(function (current) {
					return player.sieged(current) && player.canUse("sha", current, false);
				})
			);
		},
		preHidden: true,
		content() {
			"step 0";
			var list = game.filterPlayer(function (current) {
				return player.sieged(current) && player.canUse("sha", current, false);
			});
			if (player.hasSkill("gzfangyuan")) {
				if (list.length == 1) {
					event._result = { bool: true, targets: list };
				} else {
					player
						.chooseTarget(
							"方圆：视为对一名围攻你的角色使用【杀】",
							function (card, player, target) {
								return _status.event.list.includes(target);
							},
							true
						)
						.set("list", list)
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, { name: "sha", isCard: true }, player, player);
						})
						.setHiddenSkill("gzfangyuan");
				}
			} else {
				player
					.chooseTarget(get.prompt("gzfangyuan"), "视为对一名围攻你的角色使用【杀】", function (card, player, target) {
						return _status.event.list.includes(target);
					})
					.set("list", list)
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, { name: "sha", isCard: true }, player, player);
					});
			}
			"step 1";
			if (result.bool) {
				player.useCard({ name: "sha", isCard: true }, result.targets[0], "gzfangyuan", false);
			}
		},
		global: "gzfangyuan_siege",
		subSkill: {
			siege: {
				mod: {
					maxHandcard(player, num) {
						if (game.countPlayer() < 4) {
							return;
						}
						var next = player.getNext(),
							prev = player.getPrevious(),
							siege = [];
						if (player.siege(next)) {
							siege.push(next.getNext());
						}
						if (player.siege(prev)) {
							siege.push(prev.getPrevious());
						}
						if (siege.length) {
							siege.push(player);
							num += siege.filter(function (source) {
								return source.hasSkill("gzfangyuan");
							}).length;
						}
						if (player.sieged()) {
							if (next.hasSkill("gzfangyuan")) {
								num--;
							}
							if (prev.hasSkill("gzfangyuan")) {
								num--;
							}
						}
						return num;
					},
				},
			},
		},
	},
	//彭羕
	daming: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			if (
				!player.isFriendOf(event.player) ||
				!game.hasPlayer(function (current) {
					return !current.isLinked();
				})
			) {
				return false;
			}
			if (_status.connectMode && player.hasSkill("daming")) {
				return player.countCards("h") > 0;
			}
			return player.countCards("h", function (card) {
				return get.type2(card, player) == "trick";
			});
		},
		content() {
			"step 0";
			player
				.chooseCardTarget({
					prompt: get.prompt("daming"),
					prompt2: "弃置一张锦囊牌并选择要横置的角色",
					filterCard(card, player) {
						return get.type2(card, player) == "trick" && lib.filter.cardDiscardable(card, player, "daming");
					},
					filterTarget(card, player, target) {
						return !target.isLinked();
					},
					goon: (function () {
						var target = trigger.player;
						if (get.recoverEffect(target, player, player) > 0) {
							return true;
						}
						var card = { name: "sha", nature: "thunder", isCard: true };
						if (
							game.hasPlayer(function (current) {
								return current != player && current != target && target.canUse(card, current, false) && get.effect(current, card, target, player) > 0;
							})
						) {
							return true;
						}
						return false;
					})(),
					ai1(card) {
						if (_status.event.goon) {
							return 7 - get.value(card);
						}
						return 0;
					},
					ai2(target) {
						var player = _status.event.player;
						return (
							(target.identity != "unknown" &&
							!game.hasPlayer(function (current) {
								return current != target && current.isFriendOf(target) && current.isLinked();
							})
								? 3
								: 1) *
							(-get.attitude(target, player, player) + 1)
						);
					},
				})
				.setHiddenSkill("daming");
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("daming", target);
				player.discard(result.cards);
			} else {
				event.finish();
			}
			"step 2";
			if (!target.isLinked()) {
				target.link();
			}
			"step 3";
			var map = {},
				sides = [],
				pmap = _status.connectMode ? lib.playerOL : game.playerMap,
				player;
			for (var i of game.players) {
				if (i.identity == "unknown") {
					continue;
				}
				var added = false;
				for (var j of sides) {
					if (i.isFriendOf(pmap[j])) {
						added = true;
						map[j].push(i);
						if (i == this) {
							player = j;
						}
						break;
					}
				}
				if (!added) {
					map[i.playerid] = [i];
					sides.push(i.playerid);
					if (i == this) {
						player = i.playerid;
					}
				}
			}
			var num = 0;
			for (var i in map) {
				if (
					map[i].filter(function (i) {
						return i.isLinked();
					}).length
				) {
					num++;
				}
			}
			if (num > 0) {
				player.draw(num);
			}
			"step 4";
			if (trigger.player.isIn()) {
				var target = trigger.player,
					sha = game.filterPlayer(function (current) {
						return current != target && current != player && target.canUse({ name: "sha", nature: "thunder", isCard: true }, current, false);
					});
				if (sha.length) {
					var next = player.chooseTarget("请选择" + get.translation(target) + "使用雷【杀】的目标", function (card, player, target) {
						return _status.event.list.includes(target);
					});
					next.set("prompt2", "或点「取消」令其回复1点体力");
					next.set("goon", get.recoverEffect(target, player, player));
					next.set("list", sha);
					next.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, { name: "sha", nature: "thunder", isCard: true }, _status.event.getTrigger().player, player) - _status.event.goon;
					});
				} else if (target.isDamaged()) {
					event._result = { bool: false };
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 5";
			if (result.bool) {
				var target = result.targets[0];
				if (player == trigger.player) {
					player.line(target);
				} else {
					player.line2([trigger.player, target]);
					game.delay(0.5);
				}
				trigger.player.useCard({ name: "sha", nature: "thunder", isCard: true }, target, false).animate = false;
			} else {
				player.line(trigger.player);
				trigger.player.recover();
			}
		},
	},
	xiaoni: {
		audio: 2,
		trigger: {
			player: "useCard",
			target: "useCardToTargeted",
		},
		forced: true,
		filter(event, player) {
			var type = get.type2(event.card);
			if (type != "basic" && type != "trick") {
				return false;
			}
			var list = game.filterPlayer(function (current) {
				return current != player && current.isFriendOf(player);
			});
			if (!list.length) {
				return false;
			}
			var hs = player.countCards("h");
			for (var i of list) {
				if (i.countCards("h") > hs) {
					return false;
				}
			}
			return true;
		},
		check: () => false,
		preHidden: true,
		content() {
			if (trigger.name == "useCard") {
				trigger.directHit.addArray(game.players);
			} else {
				trigger.directHit.add(player);
			}
		},
		global: "xiaoni_ai",
		ai: {
			halfneg: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "halfneg") {
					return true;
				}
				if (!arg?.card) {
					return false;
				}
				var type = get.type2(arg.card);
				if (type != "basic" && type != "trick") {
					return false;
				}
				var list = game.filterPlayer(function (current) {
					return current != player && current.isFriendOf(player);
				});
				if (!list.length) {
					return false;
				}
				var cards = [arg.card];
				if (arg.card.cards) {
					cards.addArray(arg.card.cards);
				}
				cards.addArray(ui.selected.cards);
				var hhs = function (card) {
					return !cards.includes(card);
				};
				var hs = player.countCards("h", hhs);
				for (var i of list) {
					if (i.countCards("h", hhs) > hs) {
						return false;
					}
				}
				return true;
			},
		},
		subSkill: {
			ai: {
				ai: {
					directHit_ai: true,
					skillTagFilter(playerx, tag, arg) {
						if (!arg?.card) {
							return false;
						}
						var type = get.type2(arg.card);
						if (type != "basic" && type != "trick") {
							return false;
						}
						var player;
						if (arg.target && arg.target.hasSkill("xiaoni")) {
							player = arg.target;
						} else {
							return false;
						}
						var list = game.filterPlayer(function (current) {
							return current != player && current.isFriendOf(player);
						});
						if (!list.length) {
							return false;
						}
						var cards = [arg.card];
						if (arg.card.cards) {
							cards.addArray(arg.card.cards);
						}
						cards.addArray(ui.selected.cards);
						var hhs = function (card) {
							return !cards.includes(card);
						};
						var hs = player.countCards("h", hhs);
						for (var i of list) {
							if (i.countCards("h", hhs) > hs) {
								return false;
							}
						}
						return true;
					},
				},
			},
		},
	},
	//刘巴
	gztongduo: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			if ((player != event.player && !player.hasSkill("gztongduo")) || !event.player.isFriendOf(player)) {
				return false;
			}
			return (
				event.player.getHistory("lose", function (evt) {
					return evt.type == "discard" && evt.cards2.length > 0 && evt.getParent("phaseDiscard").player == event.player;
				}).length > 0
			);
		},
		content() {
			"step 0";
			var num = 0;
			trigger.player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard").player == trigger.player) {
					num += evt.cards2.length;
				}
			});
			num = Math.min(3, num);
			event.num = num;
			var next = trigger.player.chooseBool("是否发动【统度】摸" + get.cnNumber(num) + "张牌？");
			if (player == trigger.player) {
				next.setHiddenSkill("gztongduo");
			}
			"step 1";
			if (result.bool) {
				player.logSkill("gztongduo", trigger.player);
				trigger.player.draw(num);
			}
		},
	},
	qingyin: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		delay: false,
		filter(event, player) {
			var isFriend;
			if (player.identity == "unknown") {
				var group = "shu";
				if (!player.wontYe("shu")) {
					group = null;
				}
				isFriend = function (current) {
					return current == player || current.identity == group;
				};
			} else {
				isFriend = function (target) {
					return target.isFriendOf(player);
				};
			}
			return game.hasPlayer(function (current) {
				return isFriend(current) && current.isDamaged();
			});
		},
		selectTarget: -1,
		filterTarget(card, player, target) {
			if (player == target) {
				return true;
			}
			if (player.identity == "unknown") {
				var group = "shu";
				if (!player.wontYe("shu")) {
					return false;
				}
				return target.identity == group;
			}
			return target.isFriendOf(player);
		},
		selectCard: [0, 1],
		filterCard: () => false,
		multitarget: true,
		multiline: true,
		skillAnimation: true,
		animationColor: "orange",
		content() {
			"step 0";
			player.awakenSkill("qingyin");
			event.num = 0;
			"step 1";
			if (targets[num].isDamaged()) {
				targets[num].recover(targets[num].maxHp - targets[num].hp);
			}
			event.num++;
			if (event.num < targets.length) {
				event.redo();
			}
			"step 2";
			if (lib.character[player.name1][3].includes("qingyin")) {
				player.removeCharacter(0);
			}
			if (lib.character[player.name2][3].includes("qingyin")) {
				player.removeCharacter(1);
			}
		},
		ai: {
			order(item, player) {
				var isFriend;
				if (player.identity == "unknown") {
					var group = "shu";
					if (!player.wontYe("shu")) {
						group = null;
					}
					isFriend = function (current) {
						return current == player || current.identity == group;
					};
				} else {
					isFriend = function (target) {
						return target.isFriendOf(player);
					};
				}
				var targets = game.filterPlayer(function (current) {
					return isFriend(current);
				});
				var num = 0,
					max = 0;
				for (var i of targets) {
					var dam = i.maxHp - i.hp;
					num += dam;
					max += i.maxHp;
				}
				return num / max >= 1 / Math.max(1.6, game.roundNumber) ? 1 : -1;
			},
			result: {
				player: 1,
			},
		},
	},
	//苏飞
	gzlianpian: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			if (player != event.player && !player.hasSkill("gzlianpian")) {
				return false;
			}
			var num = 0;
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name == "lose" && evt.type == "discard" && evt.getParent(2).player == event.player) {
					num += evt.cards2.length;
				}
			});
			if (num <= player.hp) {
				return false;
			}
			if (player == event.player) {
				return game.hasPlayer(function (current) {
					return current.isFriendOf(player) && current.countCards("h") < current.maxHp;
				});
			}
			return player.countDiscardableCards(event.player, "he") > 0 || player.isDamaged();
		},
		content() {
			"step 0";
			if (player == trigger.player) {
				player
					.chooseTarget(get.prompt("gzlianpian"), "令一名己方角色将手牌摸至手牌上限", function (card, player, target) {
						return target.isFriendOf(player) && target.maxHp > target.countCards("h");
					})
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (target.hasSkillTag("nogain")) {
							att /= 6;
						}
						if (att > 2) {
							return Math.min(5, target.maxHp) - target.countCards("h");
						}
						return att / 3;
					})
					.setHiddenSkill(event.name);
			} else {
				event.goto(2);
				event.addIndex = 0;
				var list = [],
					target = trigger.player,
					str = get.translation(player);
				event.target = target;
				if (player.countDiscardableCards(target, "he") > 0) {
					list.push("弃置" + str + "的一张牌");
				} else {
					event.addIndex++;
				}
				if (player.isDamaged()) {
					list.push("令" + str + "回复1点体力");
				}
				target
					.chooseControl("cancel2")
					.set("choiceList", list)
					.set("ai", function () {
						var evt = _status.event.getParent();
						if (get.attitude(evt.target, evt.player) > 0) {
							return 1 - evt.addIndex;
						}
						return evt.addIndex;
					})
					.set("prompt", "是否对" + str + "发动【连翩】？");
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("gzlianpian", target);
				target.draw(Math.min(5, target.maxHp - target.countCards("h")));
			}
			event.finish();
			"step 2";
			if (result.control == "cancel2") {
				event.finish();
				return;
			}
			player.logSkill("gzlianpian", target, false);
			target.line(player, "green");
			if (result.index + event.addIndex == 0) {
				target.discardPlayerCard("he", player, true);
				event.finish();
			} else {
				player.recover();
			}
			"step 3";
			game.delayx();
		},
	},
	//冯熙
	gzyusui: {
		audio: "yusui",
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player != player && event.player.isIn() && event.player.isEnemyOf(player) && get.color(event.card) == "black";
		},
		logTarget: "player",
		check(event, player) {
			var target = event.player;
			if (player.hp < 3 || get.attitude(player, target) > -3) {
				return false;
			}
			if (player.hp < target.hp) {
				return true;
			}
			if (Math.min(target.maxHp, target.countCards("h")) > 3) {
				return true;
			}
			return false;
		},
		usable: 1,
		preHidden: true,
		content() {
			"step 0";
			player.loseHp();
			event.target = trigger.player;
			"step 1";
			event.addIndex = 0;
			var list = [];
			if (target.maxHp > 0 && target.countCards("h") > 0) {
				list.push("令其弃置" + get.cnNumber(target.maxHp) + "张手牌");
			} else {
				event.addIndex++;
			}
			if (target.hp > player.hp) {
				list.push("令其失去" + get.cnNumber(target.hp - player.hp) + "点体力");
			}
			if (!list.length) {
				event.finish();
			} else if (list.length == 1) {
				event._result = { index: 0 };
			} else {
				player
					.chooseControl()
					.set("choiceList", list)
					.set("prompt", "令" + get.translation(target) + "执行一项")
					.set("ai", function () {
						var player = _status.event.player,
							target = _status.event.getParent().target;
						return target.hp - player.hp > Math.min(target.maxHp, target.countCards("h")) / 2 ? 1 : 0;
					});
			}
			"step 2";
			if (result.index + event.addIndex == 0) {
				target.chooseToDiscard(target.maxHp, true, "h");
			} else {
				target.loseHp(target.hp - player.hp);
			}
		},
	},
	gzboyan: {
		audio: "boyan",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.gzboyan.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") < target.maxHp;
		},
		content() {
			"step 0";
			target.draw(Math.min(5, target.maxHp - target.countCards("h")));
			"step 1";
			target.addTempSkill("gzboyan_block");
			"step 2";
			if (target.isIn()) {
				player.chooseBool("纵横：是否令" + get.translation(target) + "获得【驳言】？").set("ai", function () {
					var evt = _status.event.getParent();
					return get.attitude(evt.player, evt.target) > 0;
				});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				target.addTempSkill("gzboyan_zongheng", { player: "phaseEnd" });
				game.log(player, "发起了", "#y纵横", "，令", target, "获得了技能", "#g【驳言】");
			}
		},
		derivation: "gzboyan_zongheng",
		subSkill: {
			zongheng: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: lib.filter.notMe,
				content() {
					target.addTempSkill("gzboyan_block");
				},
				ai: {
					order: 4,
					result: {
						target(player, target) {
							if (
								target.countCards("h", "shan") &&
								!target.hasSkillTag("respondShan", true, null, true) &&
								player.countCards("h", function (card) {
									return get.tag(card, "respondShan") && get.effect(target, card, player, player) > 0 && player.getUseValue(card) > 0;
								})
							) {
								return -target.countCards("h");
							}
							return -0.5;
						},
					},
				},
			},
			block: {
				mark: true,
				intro: { content: "不能使用或打出手牌" },
				charlotte: true,
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
			},
		},
		ai: {
			order: (item, player) => {
				if (
					game.hasPlayer(cur => {
						if (player === cur || get.attitude(player, cur) <= 0) {
							return false;
						}
						return Math.min(5, cur.maxHp) - cur.countCards("h") > 2;
					})
				) {
					return get.order({ name: "nanman" }, player) - 0.1;
				}
				return 10;
			},
			result: {
				target(player, target) {
					if (get.attitude(player, target) > 0) {
						return Math.min(5, target.maxHp - target.countCards("h"));
					}
					if (
						target.maxHp - target.countCards("h") == 1 &&
						target.countCards("h", "shan") &&
						!target.hasSkillTag("respondShan", true, null, true) &&
						player.countCards("h", function (card) {
							return get.tag(card, "respondShan") && get.effect(target, card, player, player) > 0 && player.getUseValue(card, null, true) > 0;
						})
					) {
						return -2;
					}
				},
			},
		},
	},
	//文钦
	gzjinfa: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("he") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("he") > 0;
				})
			);
		},
		filterCard: true,
		position: "he",
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			target
				.chooseCard("he", "交给" + get.translation(player) + "一张装备牌，或令其获得你的一张牌", { type: "equip" })
				.set("ai", function (card) {
					if (_status.event.goon && get.suit(card) == "spade") {
						return 8 - get.value(card);
					}
					return 5 - get.value(card);
				})
				.set("goon", target.canUse("sha", player, false) && get.effect(player, { name: "sha" }, target, target) > 0);
			"step 1";
			if (!result.bool) {
				player.gainPlayerCard(target, "he", true);
				event.finish();
			} else {
				target.give(result.cards, player);
			}
			"step 2";
			if (result.bool && result.cards && result.cards.length && target.isIn() && player.isIn() && get.suit(result.cards[0], target) == "spade" && target.canUse("sha", player, false)) {
				target.useCard({ name: "sha", isCard: true }, false, player);
			}
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if (
						target.countCards("e", function (card) {
							return get.suit(card) == "spade" && get.value(card) < 8;
						}) &&
						target.canUse("sha", player, false)
					) {
						return get.effect(player, { name: "sha" }, target, player);
					}
					return 0;
				},
				target(player, target) {
					var es = target.getCards("e").sort(function (a, b) {
						return get.value(b, target) - get.value(a, target);
					});
					if (es.length) {
						return -Math.min(2, get.value(es[0]));
					}
					return -2;
				},
			},
		},
	},
	//诸葛恪
	gzduwu: {
		limited: true,
		audio: 2,
		enable: "phaseUse",
		delay: false,
		filter(event, player) {
			var isEnemy;
			if (player.identity == "unknown") {
				if (!player.wontYe("wu")) {
					isEnemy = function (current) {
						return current != player;
					};
				} else {
					isEnemy = function (current) {
						return current != player && current.identity != "wu";
					};
				}
			} else {
				isEnemy = function (target) {
					return target.isEnemyOf(player);
				};
			}
			return game.hasPlayer(function (current) {
				return isEnemy(current) && player.inRange(current);
			});
		},
		filterTarget(card, player, target) {
			if (player == target || !player.inRange(target)) {
				return false;
			}
			if (player.identity == "unknown") {
				if (!player.wontYe("wu")) {
					return true;
				}
				return target.identity != "wu";
			}
			return target.isEnemyOf(player);
		},
		selectTarget: -1,
		filterCard: () => false,
		selectCard: [0, 1],
		multitarget: true,
		multiline: true,
		content() {
			"step 0";
			player.awakenSkill("gzduwu");
			player.addSkill("gzduwu_count");
			targets.sortBySeat();
			event.players = targets.slice(0);
			game.delayx();
			player.chooseJunlingFor(event.players[0]).set("prompt", "为所有目标角色选择军令牌");
			"step 1";
			event.junling = result.junling;
			event.targets = result.targets;
			event.num = 0;
			"step 2";
			if (num < event.players.length) {
				event.current = event.players[num];
			}
			if (event.current && event.current.isAlive()) {
				event.current
					.chooseJunlingControl(player, event.junling, targets)
					.set("prompt", "黩武")
					.set("choiceList", ["执行该军令", "不执行该军令并受到1点伤害"])
					.set("ai", function () {
						var evt = _status.event.getParent(2);
						var junlingEff = get.junlingEffect(evt.player, evt.junling, evt.current, evt.targets, evt.current);
						var damageEff = get.damageEffect(evt.current, evt.player, evt.current);
						var attitudeSelf = get.attitude(evt.current, evt.current);
						var drawEff = get.effect(evt.player, { name: "draw" }, evt.player, evt.current);

						return junlingEff > damageEff / attitudeSelf + drawEff ? 0 : 1;
					});
			} else {
				event.goto(4);
			}
			"step 3";
			if (result.index == 0) {
				event.current.carryOutJunling(player, event.junling, targets);
			} else {
				player.draw();
				event.current.damage();
			}
			"step 4";
			game.delayx();
			event.num++;
			if (event.num < event.players.length) {
				event.goto(2);
			}
			"step 5";
			var list = player.getStorage("gzduwu_count").filter(function (target) {
				return target.isAlive();
			});
			if (list.length) {
				player.loseHp();
			}
			player.removeSkill("gzduwu_count");
		},
		animationColor: "wood",
		ai: {
			order: 2,
			result: {
				player(player) {
					if (
						game.countPlayer(function (current) {
							return !current.isFriendOf(player) && !player.inRange(current);
						}) <= Math.min(2, Math.max(0, game.roundNumber - 1))
					) {
						return 1;
					}
					if (player.hp == 1) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			count: {
				sub: true,
				trigger: { global: "dyingBegin" },
				silent: true,
				charlotte: true,
				filter(event, player) {
					return event.getParent("gzduwu").player == player;
				},
				content() {
					player.markAuto("gzduwu_count", [trigger.player]);
				},
			},
		},
	},
	//黄祖
	gzxishe: {
		audio: 2,
		trigger: { global: "phaseZhunbeiBegin" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			return event.player != player && event.player.isIn() && player.countCards("e") > 0 && player.canUse("sha", event.player, false);
		},
		content() {
			"step 0";
			player
				.chooseCard("e", get.prompt("gzxishe", trigger.player), "将装备区内的一张牌当做" + (player.hp > trigger.player.hp ? "不可响应的" : "") + "【杀】对其使用", function (card, player) {
					return player.canUse(
						{
							name: "sha",
							cards: [card],
						},
						_status.event.target,
						false
					);
				})
				.set("target", trigger.player)
				.set("ai", function (card) {
					var evt = _status.event,
						eff = get.effect(
							evt.target,
							{
								name: "sha",
								cards: [card],
							},
							evt.player,
							evt.player
						);
					if (eff <= 0) {
						return 0;
					}
					var val = get.value(card);
					if (get.attitude(evt.player, evt.target) < -2 && evt.target.hp <= Math.min(2, evt.player.countCards("e"), evt.player.hp - 1)) {
						return 2 / Math.max(1, val);
					}
					return eff - val;
				})
				.setHiddenSkill(event.name);
			"step 1";
			if (result.bool) {
				var next = player.useCard({ name: "sha" }, result.cards, "gzxishe", trigger.player, false);
				if (player.hp > trigger.player.hp) {
					next.oncard = function () {
						_status.event.directHit.add(trigger.player);
					};
				}
			} else {
				event.finish();
			}
			"step 2";
			if (trigger.player.isDead()) {
				player.mayChangeVice(null, "hidden");
			} else if (lib.skill.gzxishe.filter(trigger, player)) {
				event.goto(0);
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (_status.event.getParent().name == "gzxishe" && arg.card && arg.card.name == "sha" && arg.target && arg.target == _status.event.target && player.hp > arg.target.hp) {
					return true;
				}
				return false;
			},
		},
	},
	//公孙渊
	gzhuaiyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		delay: false,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			if (!player.countCards("h", { color: "red" })) {
				event._result = { control: "黑色" };
			} else if (!player.countCards("h", { color: "black" })) {
				event._result = { control: "红色" };
			} else {
				player.chooseControl("红色", "黑色").set("ai", function () {
					var player = _status.event.player,
						num = player.maxHp - player.getExpansions("gzhuaiyi").length;
					if (player.countCards("h", { color: "red" }) <= num && player.countCards("h", { color: "black" }) > num) {
						return "红色";
					}
					return "黑色";
				});
			}
			"step 2";
			event.control = result.control;
			var cards;
			if (event.control == "红色") {
				cards = player.getCards("h", { color: "red" });
			} else {
				cards = player.getCards("h", { color: "black" });
			}
			player.discard(cards);
			event.num = cards.length;
			"step 3";
			player
				.chooseTarget("请选择至多" + get.cnNumber(event.num) + "名有牌的其他角色，获得这些角色的各一张牌。", [1, event.num], function (card, player, target) {
					return target != player && target.countCards("he") > 0;
				})
				.set("ai", function (target) {
					return -get.attitude(_status.event.player, target) + 0.5;
				});
			"step 4";
			if (result.bool && result.targets) {
				player.line(result.targets, "green");
				event.targets = result.targets;
				event.targets.sort(lib.sort.seat);
				event.cards = [];
			} else {
				event.finish();
			}
			"step 5";
			if (player.isAlive() && event.targets.length) {
				player.gainPlayerCard(event.targets.shift(), "he", true);
			} else {
				event.finish();
			}
			"step 6";
			if (result.bool && result.cards && result.cards.length) {
				event.cards.addArray(result.cards);
			}
			if (event.targets.length) {
				event.goto(5);
			}
			"step 7";
			var hs = player.getCards("h");
			cards = cards.filter(function (card) {
				return get.type(card) == "equip" && hs.includes(card);
			});
			if (cards.length) {
				player.addToExpansion(cards, player, "give").gaintag.add("gzhuaiyi");
			}
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					var num = player.maxHp - player.getExpansions("gzhuaiyi").length;
					if (player.countCards("h", { color: "red" }) <= num) {
						return 1;
					}
					if (player.countCards("h", { color: "black" }) <= num) {
						return 1;
					}
					return 0;
				},
			},
		},
		marktext: "异",
		intro: { content: "expansion", markcount: "expansion" },
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
	},
	gzzisui: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		forced: true,
		filter(event, player) {
			return !event.numFixed && player.getExpansions("gzhuaiyi").length > 0;
		},
		content() {
			trigger.num += player.getExpansions("gzhuaiyi").length;
		},
		group: "gzzisui_die",
		subSkill: {
			die: {
				audio: "gzzisui",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				filter(event, player) {
					return player.getExpansions("gzhuaiyi").length > player.maxHp;
				},
				content() {
					player.die();
				},
			},
		},
	},
	//潘濬
	gzcongcha: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.isUnseen();
			});
		},
		preHidden: "gzcongcha_draw",
		prompt2: "选择一名武将牌均暗置的其他角色",
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("gzcongcha"), function (card, player, target) {
					return target != player && target.isUnseen();
				})
				.set("ai", function (target) {
					if (get.attitude(_status.event.player, target) > 0) {
						return Math.random() + Math.sqrt(target.hp);
					}
					return Math.random() + Math.sqrt(Math.max(1, 4 - target.hp));
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("gzcongcha", target);
				player.storage.gzcongcha2 = target;
				player.addTempSkill("gzcongcha2", { player: "phaseBegin" });
				target.addSkill("gzcongcha_ai");
				game.delayx();
			}
		},
		subfrequent: ["draw"],
		group: "gzcongcha_draw",
		subSkill: {
			draw: {
				audio: "gzcongcha",
				trigger: { player: "phaseDrawBegin2" },
				frequent: true,
				filter(event, player) {
					return (
						!event.numFixed &&
						!game.hasPlayer(function (current) {
							return current.isUnseen();
						})
					);
				},
				prompt: "是否发动【聪察】多摸两张牌？",
				content() {
					trigger.num += 2;
				},
			},
		},
	},
	gzcongcha_ai: {
		charlotte: true,
		ai: {
			mingzhi_yes: true,
			mingzhi_no: true,
			skillTagFilter(player, tag) {
				if (_status.brawl) {
					return false;
				}
				var group = lib.character[player.name1][1];
				if (tag == "mingzhi_yes") {
					if (
						group != "ye" &&
						player.wontYe(group) &&
						game.hasPlayer(function (current) {
							return current.storage.gzcongcha2 == player && current.identity == group;
						})
					) {
						return true;
					}
					return false;
				}
				if (group == "ye" && !player.wontYe(group)) {
					return true;
				}
				return game.hasPlayer(function (current) {
					return current.storage.gzcongcha2 == player && current.identity != group;
				});
			},
		},
	},
	gzcongcha2: {
		trigger: { global: "showCharacterAfter" },
		forced: true,
		charlotte: true,
		onremove: true,
		filter(event, player) {
			return event.player == player.storage.gzcongcha2;
		},
		logTarget: "player",
		content() {
			"step 0";
			player.removeSkill("gzcongcha2");
			trigger.player.removeSkill("gzcongcha_ai");
			if (player.isFriendOf(trigger.player)) {
				game.asyncDraw([player, trigger.player].sortBySeat(_status.currentPhase), 2);
			} else {
				trigger.player.loseHp();
			}
			"step 1";
			game.delayx();
		},
		mark: "character",
		intro: { content: "已指定$为目标" },
	},
	//司马昭
	gzzhaoxin: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		check: () => false,
		preHidden: true,
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			var hs = player.countCards("h");
			if (
				game.hasPlayer(function (current) {
					return current != player && current.countCards("h") <= hs;
				})
			) {
				player.chooseTarget(true, "请选择要交换手牌的目标角色", function (card, player, target) {
					return target != player && target.countCards("h") <= player.countCards("h");
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				player.swapHandcards(target);
			}
		},
	},
	gzsuzhi: {
		audio: 2,
		derivation: "gzfankui",
		mod: {
			targetInRange(card, player, target) {
				if (player == _status.currentPhase && player.countMark("gzsuzhi_count") < 3 && get.type2(card) == "trick") {
					return true;
				}
			},
		},
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			return player.countMark("gzsuzhi_count") < 3;
		},
		content() {
			player.addTempSkills("gzfankui", { player: "phaseBegin" });
		},
		group: ["gzsuzhi_damage", "gzsuzhi_draw", "gzsuzhi_gain"],
		preHidden: ["gzsuzhi_damage", "gzsuzhi_draw", "gzsuzhi_gain"],
		subSkill: {
			damage: {
				audio: "gzsuzhi",
				trigger: { source: "damageBegin1" },
				forced: true,
				filter(event, player) {
					return player == _status.currentPhase && player.countMark("gzsuzhi_count") < 3 && event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.getParent().type == "card";
				},
				content() {
					trigger.num++;
					player.addTempSkill("gzsuzhi_count");
					player.addMark("gzsuzhi_count", 1, false);
				},
			},
			draw: {
				audio: "gzsuzhi",
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					return player == _status.currentPhase && player.countMark("gzsuzhi_count") < 3 && event.card.isCard && get.type2(event.card) == "trick";
				},
				content() {
					player.draw();
					player.addTempSkill("gzsuzhi_count");
					player.addMark("gzsuzhi_count", 1, false);
				},
			},
			gain: {
				audio: "gzsuzhi",
				trigger: { global: "loseAfter" },
				forced: true,
				filter(event, player) {
					if (player != _status.currentPhase || event.type != "discard" || player == event.player || player.countMark("gzsuzhi_count") >= 3) {
						return false;
					}
					return event.player.countGainableCards(player, "he") > 0;
				},
				logTarget: "player",
				content() {
					"step 0";
					player.addTempSkill("gzsuzhi_count");
					player.addMark("gzsuzhi_count", 1, false);
					if (trigger.delay == false) {
						game.delay();
					}
					"step 1";
					player.gainPlayerCard(trigger.player, "he", true);
				},
			},
			count: {
				onremove: true,
			},
		},
	},
	gzfankui: {
		audio: 2,
		inherit: "fankui",
	},
	//夏侯霸
	gzbaolie: {
		audio: 2,
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "sha" && target.hp >= player.hp) {
					return true;
				}
			},
			cardUsableTarget(card, player, target) {
				if (card.name == "sha" && target.hp >= player.hp) {
					return true;
				}
			},
		},
		trigger: { player: "phaseUseBegin" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.isEnemyOf(player) && player.inRangeOf(current);
			});
		},
		logTarget(event, player) {
			return game.filterPlayer(function (current) {
				return current.isEnemyOf(player) && player.inRangeOf(current);
			});
		},
		check: () => false,
		content() {
			"step 0";
			event.targets = game
				.filterPlayer(function (current) {
					return current.isEnemyOf(player) && player.inRangeOf(current);
				})
				.sortBySeat();
			"step 1";
			var target = event.targets.shift();
			if (target.isIn()) {
				event.target = target;
				target
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"豹烈：对" + get.translation(player) + "使用一张杀，或令其弃置你的一张牌"
					)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.filterTarget.apply(this, arguments);
					})
					.set("sourcex", player);
			} else if (targets.length) {
				event.redo();
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool == false && target.countCards("he") > 0) {
				player.discardPlayerCard(target, "he", true);
			}
			if (targets.length) {
				event.goto(1);
			}
		},
	},
	//许攸
	gzchenglve: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			return event.targets.length > 1 && event.player.isIn() && event.player.isFriendOf(player);
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		preHidden: true,
		content() {
			"step 0";
			trigger.player.draw();
			if (
				player.hasHistory("damage", function (evt) {
					return evt.card == trigger.card;
				}) &&
				game.hasPlayer(function (current) {
					if (current.hasMark("yinyang_mark") || !current.isFriendOf(player)) {
						return false;
					}
					let names = get.nameList(current).filter(i => i.indexOf("gz_shibing") !== 0);
					game.getAllGlobalHistory("everything", evt => {
						if (evt.name !== "showCharacter" || evt.player !== current) {
							return false;
						}
						names.removeArray(evt.toShow);
					});
					return names.length === 0;
				})
			) {
				player
					.chooseTarget("是否令一名武将牌均明置过的己方角色获得“阴阳鱼”标记？", function (card, player, current) {
						if (current.hasMark("yinyang_mark") || !current.isFriendOf(player)) {
							return false;
						}
						let names = get.nameList(current).filter(i => i.indexOf("gz_shibing") !== 0);
						game.getAllGlobalHistory("everything", evt => {
							if (evt.name !== "showCharacter" || evt.player !== current) {
								return false;
							}
							names.removeArray(evt.toShow);
						});
						return names.length === 0;
					})
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target) * Math.sqrt(1 + target.needsToDiscard());
					});
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.addMark("yinyang_mark", 1, false);
				game.delayx();
			}
		},
	},
	gzshicai: {
		audio: 2,
		trigger: { player: "damageEnd" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			return event.num == 1 || player.countCards("he") > 0;
		},
		check(event, player) {
			return event.num == 1;
		},
		content() {
			if (trigger.num == 1) {
				player.draw();
			} else {
				player.chooseToDiscard(true, "he", 2);
			}
		},
	},
	gzzhuhai: {
		audio: "zhuhai",
		audioname: ["gz_re_xushu"],
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			return event.player.isAlive() && event.player.getStat("damage") && lib.filter.targetEnabled({ name: "sha" }, player, event.player) && (player.hasSha() || (_status.connectMode && player.countCards("h") > 0));
		},
		content() {
			var next = player
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"诛害：是否对" + get.translation(trigger.player) + "使用一张杀？"
				)
				.set("logSkill", "gzzhuhai")
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", trigger.player)
				.setHiddenSkill(event.name);
			player.addTempSkill("gzzhuhai2");
			next.oncard = function (card, player) {
				try {
					if (
						trigger.player.getHistory("sourceDamage", function (evt) {
							return evt.player.isFriendOf(player);
						}).length
					) {
						player.addTempSkill("gzzhuhai2");
						card.gzzhuhai_tag = true;
					}
				} catch (e) {
					alert("发生了一个导致【诛害】无法正常触发无视防具效果的错误。请关闭十周年UI/手杀UI等扩展以解决");
				}
			};
		},
		ai: {
			unequip_ai: true,
			skillTagFilter(player, tag, arg) {
				var evt = _status.event.getParent();
				if (evt.name != "gzzhuhai" || !arg || !arg.target) {
					return false;
				}
				if (
					!arg.target.getHistory("sourceDamage", function (evt) {
						return evt.player.isFriendOf(player);
					}).length
				) {
					return false;
				}
				return true;
			},
		},
	},
	gzzhuhai2: {
		trigger: { player: "shaMiss" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.card.gzzhuhai_tag == true && event.target.countCards("he") > 0;
		},
		content() {
			player.line(trigger.target);
			trigger.target.chooseToDiscard("he", true);
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (!arg || !arg.card || !arg.card.gzzhuhai_tag) {
					return false;
				}
			},
		},
	},
	quanjin: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		onChooseToUse(event) {
			if (!game.online) {
				event.set(
					"quanjin_list",
					game.filterPlayer(i => i != event.player && i.getHistory("damage").length)
				);
			}
		},
		filter(event, player) {
			return event.quanjin_list && event.quanjin_list.length > 0 && player.countCards("h") > 0;
		},
		filterCard: true,
		filterTarget(card, player, target) {
			return _status.event.quanjin_list.includes(target);
		},
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			var evt = _status.event;
			if (
				evt.quanjin_list.filter(function (target) {
					return get.attitude(evt.player, target) > 0;
				}).length
			) {
				return 8 - get.value(card);
			}
			return 6.5 - get.value(card);
		},
		content() {
			"step 0";
			player.give(cards, target);
			"step 1";
			player.chooseJunlingFor(target);
			"step 2";
			event.junling = result.junling;
			event.targets = result.targets;
			var str = get.translation(player);
			target
				.chooseJunlingControl(player, result.junling, result.targets)
				.set("prompt", "劝进")
				.set("choiceList", ["执行该军令，然后" + str + "摸一张牌", "不执行该军令，然后其将手牌摸至与全场最多相同"])
				.set("ai", function () {
					var evt = _status.event.getParent(2),
						player = evt.target,
						source = evt.player,
						junling = evt.junling,
						targets = evt.targets;
					var num = 0;
					game.countPlayer(function (current) {
						var num2 = current.countCards("h");
						if (num2 > num) {
							num = num2;
						}
					});
					num = Math.max(0, num - source.countCards("h"));
					if (num > 1) {
						if (get.attitude(player, target) > 0) {
							return get.junlingEffect(source, junling, player, targets, player) > num;
						}
						return get.junlingEffect(source, junling, player, targets, player) > -num;
					}
					if (get.attitude(player, target) > 0) {
						return get.junlingEffect(source, junling, player, targets, player) > 0;
					}
					return get.junlingEffect(source, junling, player, targets, player) > 1;
				});
			"step 3";
			if (result.index == 0) {
				target.carryOutJunling(player, event.junling, targets);
				player.draw();
			} else {
				var num = 0;
				game.countPlayer(function (current) {
					var num2 = current.countCards("h");
					if (num2 > num) {
						num = num2;
					}
				});
				num -= player.countCards("h");
				if (num > 0) {
					player.draw(Math.min(num, 5));
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (get.attitude(player, target) > 0) {
						return 3.3;
					}
					var num = 0;
					game.countPlayer(function (current) {
						var num2 = current.countCards("h");
						if (player == current) {
							num2--;
						}
						if (target == current) {
							num2++;
						}
						if (num2 > num) {
							num = num2;
						}
					});
					num = Math.max(0, num - player.countCards("h"));
					if (!num) {
						return 0;
					}
					if (num > 1) {
						return 2;
					}
					if (ui.selected.cards.length && get.value(ui.selected.cards[0]) > 5) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	zaoyun: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var num = player.countCards("h");
			return game.hasPlayer(function (current) {
				if (current.isEnemyOf(player)) {
					var dist = get.distance(player, current);
					return dist > 1 && dist <= num;
				}
			});
		},
		selectCard() {
			var list = [],
				player = _status.event.player;
			if (ui.selected.targets.length) {
				return get.distance(player, ui.selected.targets[0]) - 1;
			}
			game.countPlayer(function (current) {
				if (current.isEnemyOf(player)) {
					var dist = get.distance(player, current);
					if (dist > 1) {
						list.push(dist - 1);
					}
				}
			});
			list.sort();
			return [list[0], list[list.length - 1]];
		},
		filterCard: true,
		filterTarget(card, player, target) {
			return target.isEnemyOf(player) && get.distance(player, target) == ui.selected.cards.length + 1;
		},
		check(card) {
			var player = _status.event.player;
			if (
				ui.selected.cards.length &&
				game.hasPlayer(function (current) {
					return current.isEnemyOf(player) && get.distance(player, current) == ui.selected.cards.length + 1 && get.damageEffect(current, player, player) > 0;
				})
			) {
				return 0;
			}
			return 7 - ui.selected.cards.length * 2 - get.value(card);
		},
		content() {
			target.damage("nocard");
			if (!player.storage.zaoyun2) {
				player.storage.zaoyun2 = [];
			}
			player.storage.zaoyun2.push(target);
			player.addTempSkill("zaoyun2");
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target);
				},
			},
		},
	},
	zaoyun2: {
		onremove: true,
		charlotte: true,
		mod: {
			globalFrom(player, target) {
				if (player.getStorage("zaoyun2").includes(target)) {
					return -Infinity;
				}
			},
		},
	},
	gzzhidao: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		forced: true,
		preHidden: true,
		content() {
			"step 0";
			player.chooseTarget("请选择【雉盗】的目标", "本回合内只能对自己和该角色使用牌，且第一次对其造成伤害时摸一张牌", lib.filter.notMe, true).set("ai", function (target) {
				var player = _status.event.player;
				return (1 - get.sgn(get.attitude(player, target))) * Math.max(1, get.distance(player, target));
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				game.log(player, "选择了", target);
				player.storage.gzzhidao2 = target;
				player.addTempSkill("gzzhidao2");
			}
		},
	},
	gzzhidao2: {
		mod: {
			playerEnabled(card, player, target) {
				if (target != player && target != player.storage.gzzhidao2) {
					return false;
				}
			},
			globalFrom(from, to) {
				if (to == from.storage.gzzhidao2) {
					return -Infinity;
				}
			},
		},
		audio: "gzzhidao",
		trigger: { source: "damageSource" },
		forced: true,
		charlotte: true,
		filter(event, player) {
			return (
				event.player == player.storage.gzzhidao2 &&
				player
					.getHistory("sourceDamage", function (evt) {
						return evt.player == event.player;
					})
					.indexOf(event) == 0 &&
				event.player.countGainableCards(player, "hej") > 0
			);
		},
		logTarget: "player",
		content() {
			player.gainPlayerCard(trigger.player, "hej", true);
		},
	},
	gzyjili: {
		audio: 2,
		forced: true,
		preHidden: ["gzyjili_remove"],
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			if (get.color(event.card) != "red" || event.targets.length != 1) {
				return false;
			}
			var type = get.type(event.card);
			return type == "basic" || type == "trick";
		},
		check() {
			return false;
		},
		content() {
			player.addTempSkill("gzyjili2");
			var evt = trigger.getParent();
			if (!evt.gzyjili) {
				evt.gzyjili = [];
			}
			evt.gzyjili.add(player);
		},
		group: "gzyjili_remove",
		subSkill: {
			remove: {
				audio: "gzyjili",
				trigger: { player: "damageBegin2" },
				forced: true,
				filter(event, player) {
					var evt = false;
					for (var i of lib.phaseName) {
						evt = event.getParent(i);
						if (evt && evt.player) {
							break;
						}
					}
					return (
						evt &&
						evt.player &&
						player.getHistory("damage", function (evtx) {
							return evtx.getParent(evt.name) == evt;
						}).length == 1
					);
				},
				content() {
					trigger.cancel();
					player.removeCharacter(get.character(player.name1, 3).includes("gzyjili") ? 0 : 1);
				},
			},
		},
	},
	gzyjili2: {
		trigger: { global: "useCardAfter" },
		charlotte: true,
		popup: false,
		forced: true,
		filter(event, player) {
			return (
				event.gzyjili &&
				event.gzyjili.includes(player) &&
				!event.addedTarget &&
				event.player &&
				event.player.isAlive() &&
				event.player.canUse(
					{
						name: event.card.name,
						nature: event.card.nature,
						isCard: true,
					},
					player
				)
			);
		},
		content() {
			trigger.player.useCard(
				{
					name: trigger.card.name,
					nature: trigger.card.nature,
					isCard: true,
				},
				player,
				false
			);
		},
	},
	donggui: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return lib.skill.donggui.filterTarget(null, player, current);
			});
		},
		filterTarget(card, player, target) {
			return target != player && !target.isUnseen(2) && player.canUse("diaohulishan", target);
		},
		content() {
			"step 0";
			player.chooseButton(["暗置" + get.translation(target) + "的一张武将牌", [[target.name1, target.name2], "character"]], true).set("filterButton", function (button) {
				return !get.is.jun(button.link);
			});
			"step 1";
			var target1 = target.getNext();
			var target2 = target.getPrevious();
			if (target1 == target2 || target.inline(target1) || target.inline(target2) || target1.inline(target2)) {
				event.finish();
			} else {
				event.target1 = target1;
				event.target2 = target2;
			}
			target.hideCharacter(result.links[0] == target.name1 ? 0 : 1);
			target.addTempSkill("donggui2");
			player.useCard({ name: "diaohulishan", isCard: true }, target);
			"step 2";
			if (event.target1.inline(event.target2)) {
				player.draw(
					game.countPlayer(function (current) {
						return current.inline(event.target1);
					})
				);
			}
		},
		ai: {
			order: 2,
			result: {
				player(player, target) {
					var target1 = target.getNext();
					var target2 = target.getPrevious();
					if (target1 == target2 || target.inline(target1) || target.inline(target2) || target1.inline(target2) || !target1.isFriendOf(target2)) {
						return 0;
					}
					var num = game.countPlayer(function (current) {
						return current != target1 && current != target2 && (current.inline(target1) || current.inline(target2));
					});
					return 2 + num;
				},
			},
		},
	},
	donggui2: { ai: { nomingzhi: true } },
	fengyang: {
		audio: 2,
		zhenfa: "inline",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			var bool = player.hasSkill("fengyang");
			return (
				game.hasPlayer(function (current) {
					return current != player && current.inline(player);
				}) &&
				game.hasPlayer(function (current) {
					return (current == player || bool) && current.inline(player) && current.countCards("e") > 0;
				})
			);
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			event.list = game
				.filterPlayer(function (current) {
					return current.inline(player);
				})
				.sortBySeat();
			"step 1";
			var target = event.list.shift();
			if ((target == player || player.hasSkill("fengyang")) && target.countCards("e")) {
				event.target = target;
				var next = target.chooseToDiscard("e", get.prompt("fengyang"), "弃置装备区内的一张牌并摸两张牌").set("ai", function (card) {
					return 5.5 - get.value(card);
				});
				next.logSkill = "fengyang";
				if (player == target) {
					next.setHiddenSkill("fengyang");
				}
			} else {
				event.goto(3);
			}
			"step 2";
			if (result.bool) {
				target.draw(2);
			}
			"step 3";
			if (event.list.length) {
				event.goto(1);
			}
		},
	},
	fengyang_old: {
		audio: "fengyang",
		zhenfa: "inline",
		global: "fengyang_old_nogain",
		subSkill: {
			nogain: {
				mod: {
					canBeDiscarded(card, player, target) {
						if (
							get.position(card) == "e" &&
							player.identity != target.identity &&
							game.hasPlayer(function (current) {
								return current.hasSkill("fengyang_old") && (current == target || target.inline(current));
							})
						) {
							return false;
						}
					},
					canBeGained(card, player, target) {
						if (
							get.position(card) == "e" &&
							player.identity != target.identity &&
							game.hasPlayer(function (current) {
								return current.hasSkill("fengyang_old") && (current == target || target.inline(current));
							})
						) {
							return false;
						}
					},
				},
			},
		},
	},
	gzrekuangcai: {
		audio: "gzkuangcai",
		forced: true,
		preHidden: true,
		trigger: { player: "phaseDiscardBegin" },
		filter(event, player) {
			return !player.getHistory("useCard").length || !player.getHistory("sourceDamage").length;
		},
		check(event, player) {
			return !player.getHistory("useCard").length;
		},
		content() {
			lib.skill.rekuangcai.change(player, player.getHistory("useCard").length ? -1 : 1);
		},
		mod: {
			targetInRange(card, player) {
				if (player == _status.currentPhase) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (player == _status.currentPhase) {
					return Infinity;
				}
			},
		},
	},
	gzkuangcai: {
		audio: 2,
		trigger: { player: "useCard1" },
		forced: true,
		firstDo: true,
		noHidden: true,
		preHidden: ["gzkuangcai_discard"],
		filter(event, player) {
			return player == _status.currentPhase && get.type(event.card) == "trick";
		},
		content() {
			trigger.nowuxie = true;
		},
		mod: {
			targetInRange(card, player) {
				if (player == _status.currentPhase) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (player == _status.currentPhase) {
					return Infinity;
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player) {
				return player == _status.currentPhase;
			},
		},
		group: "gzkuangcai_discard",
		subSkill: {
			discard: {
				audio: "gzkuangcai",
				trigger: { player: "phaseDiscardBegin" },
				forced: true,
				filter(event, player) {
					var use = player.getHistory("useCard").length;
					var damage = player.getStat("damage") || 0;
					if (use && !damage) {
						return true;
					}
					if (damage >= use) {
						return true;
					}
					return false;
				},
				check(event, player) {
					var use = player.getHistory("useCard").length;
					var damage = player.getStat("damage") || 0;
					if (use && !damage) {
						return false;
					}
					return true;
				},
				content() {
					var use = player.getHistory("useCard").length;
					var damage = player.getStat("damage") || 0;
					if (use && !damage) {
						player.addTempSkill("gzkuangcai_less");
					} else {
						player.drawTo(player.maxHp);
						player.addTempSkill("gzkuangcai_more");
					}
				},
			},
			more: {
				mod: {
					maxHandcard(player, num) {
						return num + 2;
					},
				},
				charlotte: true,
			},
			less: {
				mod: {
					maxHandcard(player, num) {
						return num - 2;
					},
				},
				charlotte: true,
			},
		},
	},
	gzshejian: {
		audio: 2,
		preHidden: true,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			if (player == event.player || event.targets.length != 1 || !event.player.isIn()) {
				return false;
			}
			if (!event.player.countCards("he") && _status.event.dying) {
				return false;
			}
			var hs = player.getCards("h");
			if (hs.length == 0) {
				return false;
			}
			return hs.every(i => lib.filter.cardDiscardable(i, player, "gzshejian"));
		},
		check(event, player) {
			var target = event.player;
			if (get.damageEffect(target, player, player) <= 0) {
				return false;
			}
			if (
				target.hp <= (player.hasSkill("gzcongjian") ? 2 : 1) &&
				!target.getEquip("huxinjing") &&
				!game.hasPlayer(function (current) {
					return current != target && !current.isFriendOf(player);
				})
			) {
				return true;
			}
			if (player.hasSkill("lirang") && player.hasFriend()) {
				return true;
			}
			if ((event.card.name == "guohe" || event.card.name == "shunshou" || event.card.name == "zhujinqiyuan") && player.countCards("h") == 1) {
				return true;
			}
			if (
				player.countCards("h") < 3 &&
				!player.countCards("h", function (card) {
					return get.value(card, player) > 5;
				})
			) {
				return true;
			}
			if (player.hp <= event.getParent().baseDamage) {
				if (get.tag(event.card, "respondSha")) {
					if (player.countCards("h", { name: "sha" }) == 0) {
						return true;
					}
				} else if (get.tag(event.card, "respondShan")) {
					if (player.countCards("h", { name: "shan" }) == 0) {
						return true;
					}
				} else if (get.tag(event.card, "damage")) {
					if (event.card.name == "shuiyanqijunx") {
						return player.countCards("e") == 0;
					}
					return true;
				}
			}
			return false;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const hs = player.getCards("h"),
				target = trigger.player;
			const { cards } = await player.modedDiscard(hs);
			if (!target?.isIn()) {
				return;
			}
			let choiceList = [`弃置${get.translation(target)}${get.cnNumber(cards.length)}张牌`, `对${get.translation(target)}造成1点伤害`],
				choice = [0, 1];
			if (_status.event.dying) {
				choice.remove(1);
			}
			if (!cards?.length || target.countCards("he") < cards.length) {
				choice.remove(0);
			}
			if (!choice.length) {
				return;
			}
			const result =
				choice.length > 1
					? await player
							.chooseControl()
							.set("choiceList", choiceList)
							.set("ai", () => 1)
							.forResult()
					: {
							index: choice[0],
						};
			if (result.index == 0) {
				await player.discardPlayerCard(target, cards.length, true, "he");
			} else {
				await target.damage();
			}
		},
	},
	gzpozhen: {
		audio: 2,
		trigger: { global: "phaseBegin" },
		limited: true,
		preHidden: true,
		filter(event, player) {
			return player != event.player;
		},
		logTarget: "player",
		skillAnimation: true,
		animationColor: "orange",
		check(event, player) {
			var target = event.player;
			if (get.attitude(player, target) >= -3) {
				return false;
			}
			if (
				event.player.hasJudge("lebu") &&
				!game.hasPlayer(function (current) {
					return get.attitude(current, target) > 0 && current.hasWuxie();
				})
			) {
				return false;
			}
			var num =
				Math.min(
					target.getCardUsable("sha"),
					target.countCards("h", function (card) {
						return get.name(card, target) == "sha" && target.hasValueTarget(card);
					})
				) +
				target.countCards("h", function (card) {
					return get.name(card, target) != "sha" && target.hasValueTarget(card);
				});
			return num >= Math.max(2, target.hp);
		},
		content() {
			"step 0";
			player.awakenSkill("gzpozhen");
			var target = trigger.player;
			target.addTempSkill("gzpozhen2");
			var list = game.filterPlayer(function (current) {
				return current != target && (current.inline(target) || (current == target.getNext().getNext() && current.siege(target.getNext())) || (current == target.getPrevious().getPrevious() && current.siege(target.getPrevious())));
			});
			if (list.length) {
				list.add(target);
				list.sortBySeat(target);
				event.targets = list;
			} else {
				event.finish();
			}
			"step 1";
			var target = targets.shift();
			if (target.countDiscardableCards(player, "he") > 0) {
				player.discardPlayerCard(target, "he", true).boolline = true;
			}
			if (targets.length) {
				event.redo();
			}
		},
	},
	gzpozhen2: {
		mod: {
			cardEnabled2(card) {
				if (get.position(card) == "h") {
					return false;
				}
			},
			cardRecastable(card) {
				if (get.position(card) == "h") {
					return false;
				}
			},
		},
	},
	gzjiancai: {
		audio: 2,
		viceSkill: true,
		trigger: { global: "damageBegin4" },
		preHidden: true,
		init(player, skill) {
			if (player.checkViceSkill(skill) && !player.viceChanged) {
				player.removeMaxHp();
			}
		},
		filter(event, player) {
			return event.player.isFriendOf(player) && event.num >= event.player.hp;
		},
		check(event, player) {
			if (get.attitude(player, event.player) < 3) {
				return false;
			}
			if (event.num >= 1 || player.storage.gzpozhen) {
				return true;
			}
			if (
				player.countCards("h", function (card) {
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					var mod = game.checkMod(card, player, event.player, "unchanged", "cardSavable", player);
					if (mod != "unchanged") {
						return mod;
					}
					var savable = get.info(card).savable;
					if (typeof savable == "function") {
						savable = savable(card, player, event.player);
					}
					return savable;
				}) >=
				1 + event.num - event.player.hp
			) {
				return false;
			}
			return true;
		},
		logTarget: "player",
		skillAnimation: true,
		animationColor: "orange",
		content() {
			trigger.cancel();
			player.changeVice();
		},
		group: "gzjiancai_add",
		subSkill: {
			add: {
				trigger: { global: "changeViceBegin" },
				logTarget: "player",
				forced: true,
				locked: false,
				prompt(event, player) {
					return get.translation(event.player) + "即将变更副将，是否发动【荐才】，令其此次变更副将时增加两张可选武将牌？";
				},
				filter(event, player) {
					return event.player.isFriendOf(player);
				},
				content() {
					trigger.num += 2;
				},
			},
		},
	},
	gzxingzhao: {
		audio: 2,
		getNum() {
			var list = [],
				players = game.filterPlayer();
			for (var target of players) {
				if (target.isUnseen() || target.isHealthy()) {
					continue;
				}
				var add = true;
				for (var i of list) {
					if (i.isFriendOf(target)) {
						add = false;
						break;
					}
				}
				if (add) {
					list.add(target);
				}
			}
			return list.length;
		},
		mod: {
			maxHandcard(player, num) {
				return num + (lib.skill.gzxingzhao.getNum() > 2 ? 4 : 0);
			},
		},
		group: ["gzxingzhao_xunxun", "gzxingzhao_use", "gzxingzhao_lose"],
		preHidden: ["gzxingzhao_xunxun", "gzxingzhao_use", "gzxingzhao_lose"],
		subfrequent: ["use"],
		subSkill: {
			xunxun: {
				audio: 2,
				name: "恂恂",
				description: "摸牌阶段，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，并将其余的牌以任意顺序置于牌堆底。",
				trigger: { player: "phaseDrawBegin1" },
				filter(event, player) {
					return lib.skill.gzxingzhao.getNum() > 0;
				},
				content() {
					"step 0";
					var cards = get.cards(4);
					game.cardsGotoOrdering(cards);
					var next = player.chooseToMove("恂恂：将两张牌置于牌堆顶", true);
					next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
					next.set("filterMove", function (from, to, moved) {
						if (to == 1 && moved[1].length >= 2) {
							return false;
						}
						return true;
					});
					next.set("filterOk", function (moved) {
						return moved[1].length == 2;
					});
					next.set("processAI", function (list) {
						var cards = list[0][1].slice(0).sort(function (a, b) {
							return get.value(b) - get.value(a);
						});
						return [cards, cards.splice(2)];
					});
					"step 1";
					var top = result.moved[0];
					var bottom = result.moved[1];
					top.reverse();
					for (var i = 0; i < top.length; i++) {
						ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
					}
					for (i = 0; i < bottom.length; i++) {
						ui.cardPile.appendChild(bottom[i]);
					}
					game.updateRoundNumber();
					game.delayx();
				},
			},
			use: {
				audio: "gzxingzhao",
				trigger: {
					player: ["useCard", "damageEnd"],
				},
				forced: true,
				filter(event, player) {
					return (event.name == "damage" || get.type(event.card) == "equip") && lib.skill.gzxingzhao.getNum() > 1 && !player.isMaxHandcard();
				},
				frequent: true,
				content() {
					player.draw();
				},
			},
			draw: {
				audio: "gzxingzhao",
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return lib.skill.gzxingzhao.getNum() > 1 && event.source && event.source.isAlive() && event.source.countCards("h") != player.countCards("h");
				},
				logTarget(event, player) {
					var target = event.source;
					return target.countCards("h") > player.countCards("h") ? player : target;
				},
				check(event, player) {
					return get.attitude(player, lib.skill.gzxingzhao_draw.logTarget(event, player)) > 0;
				},
				content() {
					lib.skill.gzxingzhao_draw.logTarget(trigger, player).draw();
				},
			},
			skip: {
				audio: "gzxingzhao",
				trigger: { player: "phaseDiscardBefore" },
				forced: true,
				filter() {
					return lib.skill.gzxingzhao.getNum() > 2;
				},
				content() {
					trigger.cancel();
					game.log(player, "跳过了", "#y弃牌阶段");
				},
			},
			lose: {
				audio: "gzxingzhao",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					var evt = event.getl(player);
					return evt && evt.player == player && evt.es && evt.es.length > 0 && lib.skill.gzxingzhao.getNum() > 3;
				},
				forced: true,
				content() {
					player.draw();
				},
			},
		},
		ai: {
			threaten: 3,
			effect: {
				target_use(card, player, target, current) {
					if (lib.skill.gzxingzhao.getNum() > 3 && get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
						return [1, 2];
					}
				},
			},
			reverseEquip: true,
			skillTagFilter() {
				return lib.skill.gzxingzhao.getNum() > 3;
			},
		},
	},
	gzwenji: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("he");
			});
		},
		preHidden: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("gzwenji"), function (card, player, target) {
					return target != player && target.countCards("he") > 0;
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (target.identity == "unknown" && att <= 0) {
						return 20;
					}
					if (att > 0) {
						return Math.sqrt(att) / 10;
					}
					return 5 - att;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("gzwenji", target);
				target.chooseCard("he", true, "问计：将一张牌交给" + get.translation(player));
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.card = result.cards[0];
				target.give(result.cards, player).gaintag.add("gzwenji");
			}
			"step 3";
			if (target.identity == "unknown" || target.isFriendOf(player)) {
				player.addTempSkill("gzwenji_respond");
				event.finish();
			} else if (
				target.isIn() &&
				player.countCards("he", function (card) {
					return !card.hasGaintag("gzwenji");
				})
			) {
				player
					.chooseCard("he", "交给" + get.translation(target) + "一张其他牌，或令其摸一张牌", function (card) {
						return !card.hasGaintag("gzwenji");
					})
					.set("ai", function (card) {
						return 5 - get.value(card);
					});
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool) {
				player.give(result.cards, target);
				player.removeGaintag("gzwenji");
			} else {
				target.draw();
			}
		},
		subSkill: {
			respond: {
				onremove(player) {
					player.removeGaintag("gzwenji");
				},
				mod: {
					targetInRange(card, player, target) {
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("gzwenji")) {
								return true;
							}
						}
					},
					cardUsable(card, player, target) {
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("gzwenji")) {
								return Infinity;
							}
						}
					},
				},
				trigger: { player: "useCard" },
				forced: true,
				charlotte: true,
				audio: "gzwenji",
				filter(event, player) {
					return (
						player.getHistory("lose", function (evt) {
							if ((evt.relatedEvent || evt.getParent()) != event) {
								return false;
							}
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("gzwenji")) {
									return true;
								}
							}
							return false;
						}).length > 0
					);
				},
				content() {
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							return current != player;
						})
					);
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						var stat = player.getStat();
						if (stat && stat.card && stat.card[trigger.card.name]) {
							stat.card[trigger.card.name]--;
						}
					}
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return arg.card && arg.card.cards && arg.card.cards.filter(card => card.hasGaintag("gzwenji")).length > 0;
					},
				},
			},
		},
	},
	gztunjiang: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		preHidden: true,
		filter(event, player) {
			if (
				!player.getHistory("useCard", function (evt) {
					return evt.isPhaseUsing();
				}).length
			) {
				return false;
			}
			return (
				player.getHistory("useCard", function (evt) {
					if (evt.targets && evt.targets.length && evt.isPhaseUsing()) {
						var targets = evt.targets.slice(0);
						while (targets.includes(player)) {
							targets.remove(player);
						}
						return targets.length > 0;
					}
					return false;
				}).length == 0
			);
		},
		content() {
			player.draw(game.countGroup());
		},
	},
	gzbushi: {
		audio: 2,
		trigger: { player: "damageEnd" },
		frequent: true,
		preHidden: true,
		content() {
			"step 0";
			event.count = trigger.num;
			"step 1";
			event.count--;
			player.draw();
			"step 2";
			if (event.count > 0) {
				player.chooseBool(get.prompt2("gzbushi")).set("frequentSkill", "gzbushi");
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				event.goto(1);
			}
		},
		group: "gzbushi_draw",
		subSkill: {
			draw: {
				trigger: { source: "damageSource" },
				direct: true,
				noHidden: true,
				filter(event, player) {
					return event.player.isEnemyOf(player) && event.player.isIn();
				},
				content() {
					"step 0";
					trigger.player.chooseBool("是否对" + get.translation(player) + "发动【布施】？", "你摸一张牌，然后其摸一张牌");
					"step 1";
					if (result.bool) {
						player.logSkill("gzbushi", trigger.player);
						game.asyncDraw([trigger.player, player]);
					} else {
						event.finish();
					}
					"step 2";
					game.delayx();
				},
			},
		},
	},
	gzbushi_old: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		forced: true,
		filter(event, player, name) {
			if (name == "damageSource" && player == event.player) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current.isFriendOf(event.player);
			});
		},
		check(event, player) {
			return player.isFriendOf(event.player);
		},
		content() {
			"step 0";
			event.count = trigger.num;
			if (event.triggername == "damageSource") {
				event.count = 1;
			}
			"step 1";
			event.count--;
			var target = trigger.player;
			var list = game.filterPlayer(function (current) {
				return current.isFriendOf(target);
			});
			if (list.length) {
				if (list.length == 1) {
					event._result = { bool: true, targets: list };
				} else {
					player
						.chooseTarget("布施：令一名与" + (player == target ? "你" : get.translation(target)) + "势力相同的角色摸一张牌", true, function (card, player, target) {
							return target.isFriendOf(_status.event.target);
						})
						.set("target", target);
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.draw();
				if (event.count) {
					event.goto(1);
				}
			}
		},
	},
	gzmidao: {
		audio: 2,
		trigger: { global: "useCardToPlayered" },
		direct: true,
		//noHidden:true,
		filter(event, player) {
			var target = event.player;
			return event.isFirstTarget && target.isFriendOf(player) && target.isPhaseUsing() && (target == player || player.hasSkill("gzmidao")) && ["basic", "trick"].includes(get.type(event.card)) && get.tag(event.card, "damage") > 0 && event.cards && event.cards.length && !target.hasSkill("gzmidao2");
		},
		preHidden: true,
		content() {
			"step 0";
			var next = trigger.player.chooseBool("是否对" + get.translation(player) + "发动【米道】？", "令该角色修改" + get.translation(trigger.card) + "的花色和伤害属性");
			next.set("ai", () => false);
			if (player == next.player) {
				next.setHiddenSkill(event.name);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("gzmidao");
				trigger.player.addTempSkill("gzmidao2");
				if (player != trigger.player) {
					trigger.player.line(player, "green");
					//player.gain(result.cards,trigger.player,'giveAuto');
				}
			} else {
				event.finish();
			}
			"step 2";
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				_status.imchoosing = false;
				var listn = ["普通"].concat(lib.inpile_nature);
				event._result = {
					bool: true,
					suit: lib.suit.randomGet(),
					nature: listn.randomGet(),
				};
				if (event.dialog) {
					event.dialog.close();
				}
				if (event.control) {
					event.control.close();
				}
			};
			var chooseButton = function (player, card) {
				var event = _status.event;
				player = player || event.player;
				if (!event._result) {
					event._result = {};
				}
				var dialog = ui.create.dialog("米道：请修改" + card + "的花色和属性", "forcebutton", "hidden");
				event.dialog = dialog;
				dialog.addText("花色");
				var table = document.createElement("div");
				table.classList.add("add-setting");
				table.style.margin = "0";
				table.style.width = "100%";
				table.style.position = "relative";
				var listi = ["spade", "heart", "club", "diamond"];
				for (var i = 0; i < listi.length; i++) {
					var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
					td.link = listi[i];
					table.appendChild(td);
					td.innerHTML = "<span>" + get.translation(listi[i]) + "</span>";
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
						var current = this.parentNode.querySelector(".bluebg");
						if (current) {
							current.classList.remove("bluebg");
						}
						this.classList.add("bluebg");
						event._result.suit = link;
					});
				}
				dialog.content.appendChild(table);
				dialog.addText("属性");
				var table2 = document.createElement("div");
				table2.classList.add("add-setting");
				table2.style.margin = "0";
				table2.style.width = "100%";
				table2.style.position = "relative";
				var listn = ["普通"].concat(lib.inpile_nature);
				for (var i = 0; i < listn.length; i++) {
					var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
					var nature = listn[i];
					td.link = nature;
					table2.appendChild(td);
					td.innerHTML = "<span>" + get.translation(nature) + "</span>";
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
						var current = this.parentNode.querySelector(".bluebg");
						if (current) {
							current.classList.remove("bluebg");
						}
						this.classList.add("bluebg");
						event._result.nature = link;
					});
				}
				dialog.content.appendChild(table2);
				dialog.add("　　");
				event.dialog.open();

				event.switchToAuto = function () {
					event._result = {
						bool: true,
						nature: listn.randomGet(),
						suit: listi.randomGet(),
					};
					event.dialog.close();
					event.control.close();
					game.resume();
					_status.imchoosing = false;
				};
				event.control = ui.create.control("ok", "cancel2", function (link) {
					var result = event._result;
					if (link == "cancel2") {
						result.bool = false;
					} else {
						if (!result.nature || !result.suit) {
							return;
						}
						result.bool = true;
					}
					event.dialog.close();
					event.control.close();
					game.resume();
					_status.imchoosing = false;
				});
				for (var i = 0; i < event.dialog.buttons.length; i++) {
					event.dialog.buttons[i].classList.add("selectable");
				}
				game.pause();
				game.countChoose();
			};
			if (event.isMine()) {
				chooseButton(player, get.translation(trigger.card));
			} else if (event.isOnline()) {
				event.player.send(chooseButton, event.player, get.translation(trigger.card));
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 3";
			var map = event.result || result;
			if (map.bool) {
				game.log(player, "将", trigger.card, "的花色属性修改为了", "#g" + get.translation(map.suit + 2), "#y" + get.translation(map.nature));
				trigger.card.suit = map.suit;
				if (map.nature == "普通") {
					delete trigger.card.nature;
				} else {
					trigger.card.nature = map.nature;
				}
				trigger.player.storage.gzmidao2 = [trigger.card, map.nature];
				player.popup(get.translation(map.suit + 2) + get.translation(map.nature), "thunder");
			}
		},
	},
	gzmidao2: {
		charlotte: true,
		trigger: { global: "damageBefore" },
		forced: true,
		firstDo: true,
		popup: false,
		onremove: true,
		filter(event, player) {
			return player.storage.gzmidao2 && event.card == player.storage.gzmidao2[0];
		},
		content() {
			var nature = player.storage.gzmidao2[1];
			if (nature == "普通") {
				delete trigger.nature;
			} else {
				trigger.nature = nature;
			}
		},
	},
	gzbiluan: {
		audio: 2,
		mod: {
			globalTo(from, to, distance) {
				return distance + to.countCards("e");
			},
		},
	},
	gzrelixia: {
		audio: "gzlixia",
		trigger: { global: "phaseZhunbeiBegin" },
		noHidden: true,
		forced: true,
		filter(event, player) {
			return player != event.player && !event.player.isFriendOf(player) && !player.inRangeOf(event.player);
		},
		logTarget: "player",
		content() {
			"step 0";
			var target = trigger.player;
			event.target = target;
			if (!player.countDiscardableCards(target, "e")) {
				player.draw();
				event.finish();
				return;
			}
			var str = get.translation(player);
			target
				.chooseControl()
				.set("prompt", str + "发动了【礼下】，请选择一项")
				.set("choiceList", ["令" + str + "摸一张牌", "弃置" + str + "装备区内的一张牌并失去1点体力"])
				.set("ai", function () {
					var player = _status.event.player,
						target = _status.event.getParent().player;
					if (player.hp <= 1 || get.attitude(player, target) >= 0) {
						return 0;
					}
					if (
						target.countCards("e", function (card) {
							return get.value(card, target) >= 7 - player.hp;
						}) > 0
					) {
						return 1;
					}
					var dist = get.distance(player, target, "attack");
					if (dist > 1 && dist - target.countCards("e") <= 1) {
						return true;
					}
					return 0;
				});
			"step 1";
			if (result.index == 0) {
				player.draw();
			} else {
				target.discardPlayerCard(player, "e", true);
				target.loseHp();
			}
		},
	},
	gzlixia: {
		audio: 2,
		trigger: { global: "phaseZhunbeiBegin" },
		noHidden: true,
		direct: true,
		filter(event, player) {
			return player != event.player && !event.player.isFriendOf(player) && player.countDiscardableCards(event.player, "e") > 0;
		},
		content() {
			"step 0";
			trigger.player.chooseBool("是否对" + get.translation(player) + "发动【礼下】？", "弃置其装备区内的一张牌，然后选择一项：①弃置两张牌。②失去1点体力。③令其摸两张牌。").set("ai", function () {
				var player = _status.event.player;
				var target = _status.event.getParent().player;
				if (get.attitude(player, target) > 0) {
					return (
						target.countCards("e", function (card) {
							return get.value(card, target) < 3;
						}) > 0
					);
				}
				if (
					target.countCards("e", function (card) {
						return get.value(card, target) >= 7;
					})
				) {
					return true;
				}
				var dist = get.distance(player, target, "attack");
				if (dist > 1 && dist - target.countCards("e") <= 1) {
					return true;
				}
				return false;
			});
			"step 1";
			if (result.bool) {
				var target = trigger.player;
				event.target = target;
				player.logSkill("gzlixia");
				target.line(player, "green");
				target.discardPlayerCard(player, "e", true);
			} else {
				event.finish();
			}
			"step 2";
			var list = ["失去1点体力", "令" + get.translation(player) + "摸两张牌"];
			event.addIndex = 0;
			if (
				target.countCards("h", function (card) {
					return lib.filter.cardDiscardable(card, target, "gzlixia");
				}) > 1
			) {
				list.unshift("弃置两张牌");
			} else {
				event.addIndex++;
			}
			target
				.chooseControl()
				.set("choiceList", list)
				.set("ai", function () {
					var num = 2;
					var player = _status.event.player;
					var target = _status.event.getParent().player;
					if (get.attitude(player, target) >= 0) {
						num = 2;
					} else if (
						player.countCards("he", function (card) {
							return lib.filter.cardDiscardable(card, player, "gzlixia") && get.value(card, player) < 5;
						}) > 1
					) {
						num = 0;
					} else if (player.hp + player.countCards("h", "tao") > 3 && !player.hasJudge("lebu")) {
						num = 1;
					}
					return num - _status.event.getParent().addIndex;
				});
			"step 3";
			switch (result.index + event.addIndex) {
				case 0:
					target.chooseToDiscard(2, "h", true);
					break;
				case 1:
					target.loseHp();
					break;
				case 2:
					player.draw(2);
					break;
			}
		},
	},

	yigui: {
		audio: 2,
		hiddenCard(player, name) {
			var storage = player.storage.yigui;
			if (name == "shan" || name == "wuxie" || !storage || !storage.character.length || storage.used.includes(name) || !lib.inpile.includes(name)) {
				return false;
			}
			return true;
		},
		init(player, skill) {
			if (!player.storage.skill) {
				player.storage[skill] = {
					character: [],
					used: [],
				};
			}
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type == "wuxie" || event.type == "respondShan") {
				return false;
			}
			var storage = player.storage.yigui;
			if (!storage || !storage.character.length) {
				return false;
			}
			if (event.type == "dying") {
				if ((!event.filterCard({ name: "tao" }, player, event) || storage.used.includes("tao")) && (!event.filterCard({ name: "jiu" }, player, event) || storage.used.includes("jiu"))) {
					return false;
				}
				var target = event.dying;
				if (target.identity == "unknown" || target.identity == "ye") {
					return true;
				}
				for (var i = 0; i < storage.character.length; i++) {
					var group = lib.character[storage.character[i]][1];
					if (group == "ye" || target.identity == group) {
						return true;
					}
					var double = get.is.double(storage.character[i], true);
					if (double && double.includes(target.identity)) {
						return true;
					}
				}
				return false;
			} else {
				return true;
			}
		},
		chooseButton: {
			select: 2,
			dialog(event, player) {
				var dialog = ui.create.dialog("役鬼", "hidden");
				dialog.add([player.storage.yigui.character, "character"]);
				var list = lib.inpile;
				var list2 = [];
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (name == "shan" || name == "wuxie") {
						continue;
					}
					var type = get.type(name);
					if (name == "sha") {
						list2.push(["基本", "", "sha"]);
						list2.push(["基本", "", "sha", "fire"]);
						list2.push(["基本", "", "sha", "thunder"]);
					} else if (type == "basic") {
						list2.push(["基本", "", list[i]]);
					} else if (type == "trick") {
						list2.push(["锦囊", "", list[i]]);
					}
				}
				dialog.add([list2, "vcard"]);
				return dialog;
			},
			check(button) {
				if (ui.selected.buttons.length) {
					var evt = _status.event.getParent("chooseToUse");
					var name = button.link[2];
					var group = lib.character[ui.selected.buttons[0].link][1];
					var double = get.is.double(ui.selected.buttons[0].link, true);
					var player = _status.event.player;
					if (evt.type == "dying") {
						if (evt.dying != player && get.effect(evt.dying, { name: name }, player, player) <= 0) {
							return 0;
						}
						if (name == "jiu") {
							return 2.1;
						}
						return 2;
					}
					if (!["tao", "juedou", "guohe", "shunshou", "wuzhong", "xietianzi", "yuanjiao", "taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) {
						return 0;
					}
					if (["taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) {
						var list = game.filterPlayer(function (current) {
							return (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity))) && player.canUse({ name: name }, current);
						});
						var num = 0;
						for (var i = 0; i < list.length; i++) {
							num += get.effect(list[i], { name: name }, player, player);
						}
						if (num <= 0) {
							return 0;
						}
						if (list.length > 1) {
							return (1.7 + Math.random()) * Math.max(num, 1);
						}
					}
				}
				return 1 + Math.random();
			},
			filter(button, player) {
				var evt = _status.event.getParent("chooseToUse");
				if (!ui.selected.buttons.length) {
					if (typeof button.link != "string") {
						return false;
					}
					if (evt.type == "dying") {
						if (evt.dying.identity == "unknown" || evt.dying.identity == "ye") {
							return true;
						}
						var double = get.is.double(button.link, true);
						return evt.dying.identity == lib.character[button.link][1] || lib.character[button.link][1] == "ye" || (double && double.includes(evt.dying.identity));
					}
					return true;
				} else {
					if (typeof ui.selected.buttons[0].link != "string") {
						return false;
					}
					if (typeof button.link != "object") {
						return false;
					}
					var name = button.link[2];
					if (player.storage.yigui.used.includes(name)) {
						return false;
					}
					var card = { name: name };
					if (button.link[3]) {
						card.nature = button.link[3];
					}
					var info = get.info(card);
					var group = lib.character[ui.selected.buttons[0].link][1];
					var double = get.is.double(ui.selected.buttons[0].link, true);
					if (evt.type == "dying") {
						return evt.filterCard(card, player, evt);
					}
					if (!lib.filter.filterCard(card, player, evt)) {
						return false;
					} else if (evt.filterCard && !evt.filterCard(card, player, evt)) {
						return false;
					}
					if (info.changeTarget) {
						var list = game.filterPlayer(function (current) {
							return player.canUse(card, current);
						});
						for (var i = 0; i < list.length; i++) {
							var giveup = false;
							var targets = [list[i]];
							info.changeTarget(player, targets);
							for (var j = 0; j < targets.length; j++) {
								if (group != "ye" && targets[j].identity != "unknown" && targets[j].identity != "ye" && targets[j].identity != group && (!double || !double.includes(targets[j].identity))) {
									giveup = true;
									break;
								}
							}
							if (giveup) {
								continue;
							}
							if (giveup == false) {
								return true;
							}
						}
						return false;
					} else {
						return game.hasPlayer(function (current) {
							return evt.filterTarget(card, player, current) && (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity)));
						});
					}
				}
			},
			backup(links, player) {
				var name = links[1][2];
				var nature = links[1][3] || null;
				var character = links[0];
				var group = lib.character[character][1];
				var next = {
					character: character,
					group: group,
					filterCard() {
						return false;
					},
					selectCard: -1,
					complexCard: true,
					check() {
						return 1;
					},
					popname: true,
					audio: "yigui",
					viewAs: {
						name: name,
						nature: nature,
						isCard: true,
					},
					filterTarget(card, player, target) {
						var xx = lib.skill.yigui_backup;
						var evt = _status.event;
						var group = xx.group;
						var double = get.is.double(xx.character, true);
						var info = get.info(card);
						if (!(info.singleCard && ui.selected.targets.length) && group != "ye" && target.identity != "unknown" && target.identity != "ye" && target.identity != group && (!double || !double.includes(target.identity))) {
							return false;
						}
						if (info.changeTarget) {
							var targets = [target];
							info.changeTarget(player, targets);
							for (var i = 0; i < targets.length; i++) {
								if (group != "ye" && targets[i].identity != "unknown" && targets[i].identity != "ye" && targets[i].identity != group && (!double || !double.includes(targets[i].identity))) {
									return false;
								}
							}
						}
						//if(evt.type=='dying') return target==evt.dying;
						if (evt._backup && evt._backup.filterTarget) {
							return evt._backup.filterTarget(card, player, target);
						}
						return lib.filter.filterTarget(card, player, target);
					},
					onuse(result, player) {
						player.logSkill("yigui");
						var character = lib.skill.yigui_backup.character;
						player.flashAvatar("yigui", character);
						player.storage.yigui.character.remove(character);
						_status.characterlist.add(character);
						game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
						player.syncStorage("yigui");
						player.updateMarks("yigui");
						player.storage.yigui.used.add(result.card.name);
					},
				};
				return next;
			},
			prompt(links, player) {
				var name = links[1][2];
				var character = links[0];
				var nature = links[1][3];
				return "移除「" + get.translation(character) + "」并视为使用" + (get.translation(nature) || "") + get.translation(name);
			},
		},
		group: ["yigui_init", "yigui_refrain"],
		ai: {
			order() {
				return 1 + 10 * Math.random();
			},
			result: {
				player: 1,
			},
		},
		mark: true,
		marktext: "魂",
		intro: {
			onunmark(storage, player) {
				_status.characterlist.addArray(storage.character);
				storage.character = [];
			},
			mark(dialog, storage, player) {
				if (storage && storage.character.length) {
					if (player.isUnderControl(true)) {
						dialog.addSmall([storage.character, "character"]);
					} else {
						return "共有" + get.cnNumber(storage.character.length) + "张“魂”";
					}
				} else {
					return "没有魂";
				}
			},
			content(storage, player) {
				return "共有" + get.cnNumber(storage.character.length) + "张“魂”";
			},
			markcount(storage, player) {
				if (storage && storage.character) {
					return storage.character.length;
				}
				return 0;
			},
		},
	},
	yigui_init: {
		audio: "yigui",
		trigger: {
			player: "showCharacterAfter",
		},
		forced: true,
		filter(event, player) {
			return (
				event.toShow.some(name => {
					return get.character(name, 3).includes("yigui");
				}) && !player.storage.yigui_init
			);
		},
		content() {
			player.storage.yigui_init = true;
			var list = _status.characterlist.randomGets(2);
			if (list.length) {
				_status.characterlist.removeArray(list);
				player.storage.yigui.character.addArray(list);
				lib.skill.gzhuashen.drawCharacter(player, list);
				player.syncStorage("yigui");
				player.updateMarks("yigui");
				game.log(player, "获得了" + get.cnNumber(list.length) + "张「魂」");
			}
		},
	},
	yigui_refrain: {
		trigger: { global: "phaseBefore" },
		forced: true,
		silent: true,
		popup: false,
		content() {
			player.storage.yigui.used = [];
		},
	},
	yigui_shan: {
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type != "respondShan") {
				return false;
			}
			var storage = player.storage.yigui;
			if (!storage || !storage.character.length || storage.used.includes("shan")) {
				return false;
			}
			return event.filterCard({ name: "shan" }, player, event);
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("役鬼", "hidden");
				dialog.add([player.storage.yigui.character, "character"]);
				return dialog;
			},
			check(button) {
				return (
					1 /
					(1 +
						game.countPlayer(function (current) {
							return current.identity == button.link;
						}))
				);
			},
			backup(links, player) {
				var character = links[0];
				var next = {
					character: character,
					filterCard() {
						return false;
					},
					selectCard: -1,
					complexCard: true,
					check() {
						return 1;
					},
					popname: true,
					audio: "yigui",
					viewAs: {
						name: "shan",
						isCard: true,
					},
					onuse(result, player) {
						player.logSkill("yigui");
						var character = lib.skill.yigui_shan_backup.character;
						player.flashAvatar("yigui", character);
						player.storage.yigui.character.remove(character);
						_status.characterlist.add(character);
						game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
						player.syncStorage("yigui");
						player.updateMarks("yigui");
						player.storage.yigui.used.add(result.card.name);
					},
				};
				return next;
			},
		},
		ai: {
			respondShan: true,
			skillTagFilter(player) {
				var storage = player.storage.yigui;
				if (!storage || !storage.character.length || storage.used.includes("shan")) {
					return false;
				}
			},
			order: 0.1,
			result: {
				player: 1,
			},
		},
	},
	yigui_wuxie: {
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type != "wuxie") {
				return false;
			}
			var storage = player.storage.yigui;
			if (!storage || !storage.character.length || storage.used.includes("wuxie")) {
				return false;
			}
			return event.filterCard({ name: "wuxie" }, player, event);
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("役鬼", "hidden");
				dialog.add([player.storage.yigui.character, "character"]);
				return dialog;
			},
			check(button) {
				return (
					1 /
					(1 +
						game.countPlayer(function (current) {
							return current.identity == button.link;
						}))
				);
			},
			backup(links, player) {
				var character = links[0];
				var next = {
					character: character,
					filterCard() {
						return false;
					},
					selectCard: -1,
					complexCard: true,
					check() {
						return 1;
					},
					popname: true,
					audio: "yigui",
					viewAs: {
						name: "wuxie",
						isCard: true,
					},
					onuse(result, player) {
						player.logSkill("yigui");
						var character = lib.skill.yigui_wuxie_backup.character;
						player.flashAvatar("yigui", character);
						player.storage.yigui.character.remove(character);
						_status.characterlist.add(character);
						game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
						player.syncStorage("yigui");
						player.updateMarks("yigui");
						player.storage.yigui.used.add(result.card.name);
					},
				};
				return next;
			},
		},
		ai: {
			order: 0.1,
			result: {
				player: 1,
			},
		},
	},
	yigui_gzshan: {
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type != "respondShan" || !event.filterCard({ name: "shan" }, player, event) || !lib.inpile.includes("shan")) {
				return false;
			}
			var storage = player.storage.yigui,
				target = event.getParent().player;
			if (!storage || !target || !storage.character.length || storage.used.includes("shan")) {
				return false;
			}
			var identity = target.identity;
			return (
				["unknown", "ye"].includes(identity) ||
				storage.character.some(function (i) {
					if (lib.character[i][1] == "ye") {
						return true;
					}
					var double = get.is.double(i, true);
					var groups = double ? double : [lib.character[i][1]];
					return groups.includes(identity);
				})
			);
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("役鬼", "hidden");
				dialog.add([player.storage.yigui.character, "character"]);
				return dialog;
			},
			filter(button, player) {
				var evt = _status.event.getParent("chooseToUse");
				var target = evt.getParent().player,
					identity = target.identity;
				if (["unknown", "ye"].includes(identity)) {
					return true;
				}
				if (lib.character[button.link][1] == "ye") {
					return true;
				}
				var double = get.is.double(button.link, true);
				var groups = double ? double : [lib.character[button.link][1]];
				return groups.includes(identity);
			},
			check(button) {
				return (
					1 /
					(1 +
						game.countPlayer(function (current) {
							return current.identity == lib.character[button.link][1];
						}))
				);
			},
			backup(links, player) {
				var character = links[0];
				var next = {
					character: character,
					filterCard: () => false,
					selectCard: -1,
					complexCard: true,
					check: () => 1,
					popname: true,
					audio: "yigui",
					viewAs: { name: "shan", isCard: true },
					onuse(result, player) {
						player.logSkill("yigui");
						var character = lib.skill.yigui_gzshan_backup.character;
						player.flashAvatar("yigui", character);
						player.storage.yigui.character.remove(character);
						_status.characterlist.add(character);
						game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
						player.syncStorage("yigui");
						player.updateMarks("yigui");
						player.storage.yigui.used.add(result.card.name);
					},
				};
				return next;
			},
		},
		ai: {
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond" || !lib.inpile.includes("shan")) {
					return false;
				}
				var storage = player.storage.yigui;
				if (!storage || !storage.character.length || storage.used.includes("shan")) {
					return false;
				}
			},
			order: 0.1,
			result: { player: 1 },
		},
	},
	yigui_gzwuxie: {
		hiddenWuxie(player, info) {
			if (!lib.inpile.includes("wuxie")) {
				return false;
			}
			const storage = player.storage.yigui;
			if (!storage || !storage.character || !storage.character.length || (storage.used && storage.used.includes("wuxie"))) {
				return false;
			}
			if (_status.connectMode) {
				return true;
			}
			const target = info.target;
			if (!target) {
				return false;
			}
			const identity = target.identity;
			return (
				["unknown", "ye"].includes(identity) ||
				storage.character.some(function (i) {
					if (lib.character[i][1] == "ye") {
						return true;
					}
					const double = get.is.double(i, true);
					return (double ? double : [lib.character[i][1]]).includes(identity);
				})
			);
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type != "wuxie" || !lib.inpile.includes("wuxie")) {
				return false;
			}
			const storage = player.storage.yigui;
			if (!storage || !storage.character || !storage.character.length || (storage.used && storage.used.includes("wuxie"))) {
				return false;
			}
			const info = event.info_map,
				target = info.target,
				identity = target.identity;
			return (
				["unknown", "ye"].includes(identity) ||
				storage.character.some(function (i) {
					if (lib.character[i][1] == "ye") {
						return true;
					}
					const double = get.is.double(i, true);
					return (double ? double : [lib.character[i][1]]).includes(identity);
				})
			);
		},
		chooseButton: {
			dialog(event, player) {
				let dialog = ui.create.dialog("役鬼", "hidden");
				dialog.add([player.storage.yigui.character, "character"]);
				return dialog;
			},
			filter(button, player) {
				const evt = get.event().getParent("chooseToUse");
				const info = evt.info_map,
					target = info.target,
					identity = target.identity;
				if (["unknown", "ye"].includes(identity)) {
					return true;
				}
				if (lib.character[button.link][1] == "ye") {
					return true;
				}
				const double = get.is.double(button.link, true);
				return (double ? double : [lib.character[button.link][1]]).includes(identity);
			},
			check(button) {
				return 1 + Math.random();
			},
			backup(links, player) {
				return {
					character: links[0],
					filterCard: () => false,
					selectCard: -1,
					complexCard: true,
					check: () => 1,
					popname: true,
					audio: "yigui",
					viewAs: { name: "wuxie", isCard: true },
					onuse(result, player) {
						player.logSkill("yigui");
						const character = lib.skill.yigui_gzwuxie_backup.character;
						player.flashAvatar("yigui", character);
						player.storage.yigui.character.remove(character);
						_status.characterlist.add(character);
						game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
						player.syncStorage("yigui");
						player.updateMarks("yigui");
						player.storage.yigui.used.add(result.card.name);
					},
				};
			},
		},
		ai: {
			order: 0.1,
			result: { player: 1 },
		},
	},
	jihun: {
		trigger: {
			player: "damageEnd",
			global: "dyingAfter",
		},
		audio: 2,
		frequent: true,
		preHidden: true,
		filter(event, player) {
			return event.name == "damage" || (event.player.isAlive() && !event.player.isFriendOf(player));
		},
		content() {
			var list = _status.characterlist.randomGets(1);
			if (list.length) {
				_status.characterlist.removeArray(list);
				player.storage.yigui.character.addArray(list);
				lib.skill.gzhuashen.drawCharacter(player, list);
				player.syncStorage("yigui");
				player.updateMarks("yigui");
				game.log(player, "获得了" + get.cnNumber(list.length) + "张「魂」");
			}
		},
	},
	gzbuyi: {
		trigger: { global: "dyingAfter" },
		usable: 1,
		filter(event, player) {
			if (!(event.player && event.player.isAlive() && event.source && event.source.isAlive())) {
				return false;
			}
			return event.player.isFriendOf(player) && event.reason && event.reason.name == "damage";
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "source",
		preHidden: true,
		content() {
			"step 0";
			player.chooseJunlingFor(trigger.source);
			"step 1";
			event.junling = result.junling;
			event.targets = result.targets;
			var choiceList = [];
			choiceList.push("执行该军令");
			choiceList.push("令" + get.translation(trigger.player) + (trigger.player == trigger.source ? "（你）" : "") + "回复1点体力");
			trigger.source
				.chooseJunlingControl(player, result.junling, result.targets)
				.set("prompt", "补益")
				.set("choiceList", choiceList)
				.set("ai", function () {
					if (get.recoverEffect(trigger.player, player, _status.event.player) > 0) {
						return 1;
					}
					return get.attitude(trigger.source, trigger.player) < 0 && get.junlingEffect(player, result.junling, trigger.source, result.targets, trigger.source) >= -2 ? 1 : 0;
				});
			"step 2";
			if (result.index == 0) {
				trigger.source.carryOutJunling(player, event.junling, targets);
			} else {
				trigger.player.recover(player);
			}
		},
		audio: ["buyi", 2],
	},
	keshou: {
		audio: 2,
		trigger: { player: "damageBegin3" },
		filter(event, player) {
			return event.num > 0;
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			var check = player.countCards("h", { color: "red" }) > 1 || player.countCards("h", { color: "black" }) > 1;
			player
				.chooseCard(get.prompt("keshou"), "弃置两张颜色相同的牌，令即将受到的伤害-1", "he", 2, function (card) {
					if (ui.selected.cards.length) {
						return get.color(card) == get.color(ui.selected.cards[0]);
					}
					return true;
				})
				.set("complexCard", true)
				.set("ai", function (card) {
					if (!_status.event.check) {
						return 0;
					}
					var player = _status.event.player;
					if (player.hp == 1) {
						if (
							!player.countCards("h", function (card) {
								return get.tag(card, "save");
							}) &&
							!player.hasSkillTag("save", true)
						) {
							return 10 - get.value(card);
						}
						return 7 - get.value(card);
					}
					return 6 - get.value(card);
				})
				.set("check", check)
				.setHiddenSkill(event.name);
			"step 1";
			var logged = false;
			if (result.cards) {
				logged = true;
				player.logSkill("keshou");
				player.discard(result.cards);
				trigger.num--;
			}
			if (
				!player.isUnseen() &&
				!game.hasPlayer(function (current) {
					return current != player && current.isFriendOf(player);
				})
			) {
				if (!logged) {
					player.logSkill("keshou");
				}
				player.judge(function (card) {
					if (get.color(card) == "red") {
						return 1;
					}
					return 0;
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.judge > 0) {
				player.draw();
			}
		},
	},
	zhuwei: {
		audio: 2,
		trigger: { player: "judgeEnd" },
		filter(event) {
			if (get.owner(event.result.card)) {
				return false;
			}
			if (event.nogain && event.nogain(event.result.card)) {
				return false;
			}
			return true;
			//return event.result.card.name=='sha'||event.result.card.name=='juedou';
		},
		frequent: true,
		preHidden: true,
		content() {
			"step 0";
			player.gain(trigger.result.card, "gain2");
			player.chooseBool("是否令" + get.translation(_status.currentPhase) + "本回合的手牌上限和使用【杀】的次数上限+1？").ai = function () {
				return get.attitude(player, _status.currentPhase) > 0;
			};
			"step 1";
			if (result.bool) {
				var target = _status.currentPhase;
				if (!target.hasSkill("zhuwei_eff")) {
					target.addTempSkill("zhuwei_eff");
					target.storage.zhuwei_eff = 1;
				} else {
					target.storage.zhuwei_eff++;
				}
				target.updateMarks();
			}
		},
		subSkill: {
			eff: {
				sub: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.storage.zhuwei_eff;
						}
					},
					maxHandcard(player, num) {
						return num + player.storage.zhuwei_eff;
					},
				},
				mark: true,
				charlotte: true,
				intro: {
					content(storage) {
						if (storage) {
							return "使用【杀】的次数上限+" + storage + "，手牌上限+" + storage;
						}
					},
				},
			},
		},
	},
	gzweidi: {
		init(player) {
			player.storage.gzweidi = [];
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.storage.gzweidi.length > 0;
		},
		filterTarget(card, player, target) {
			return target != player && player.storage.gzweidi.includes(target);
		},
		content() {
			"step 0";
			player.chooseJunlingFor(target);
			"step 1";
			event.junling = result.junling;
			event.targets = result.targets;
			var choiceList = ["执行该军令"];
			if (target != player) {
				choiceList.push("令" + get.translation(player) + "获得你所有手牌，然后交给你等量的牌");
			} else {
				choiceList.push("不执行该军令");
			}
			target
				.chooseJunlingControl(player, result.junling, result.targets)
				.set("prompt", "伪帝")
				.set("choiceList", choiceList)
				.set("ai", function () {
					if (get.attitude(target, player) >= 0) {
						return get.junlingEffect(player, result.junling, target, result.targets, target) >= 0 ? 0 : 1;
					}
					return get.junlingEffect(player, result.junling, target, result.targets, target) >= -1 ? 0 : 1;
				});
			"step 2";
			if (result.index == 0) {
				target.carryOutJunling(player, event.junling, targets);
			} else if (target != player && target.countCards("h")) {
				event.num = target.countCards("h");
				player.gain(target.getCards("h"), target, "giveAuto");
				player.chooseCard("交给" + get.translation(target) + get.cnNumber(event.num) + "张牌", "he", event.num, true).set("ai", function (card) {
					return -get.value(card);
				});
			} else {
				event.finish();
			}
			"step 3";
			if (result.cards) {
				player.give(result.cards, target);
			}
		},
		group: ["gzweidi_ft", "gzweidi_ftc"],
		ai: {
			order: 3,
			result: {
				player: 1,
			},
		},
		subSkill: {
			ft: {
				sub: true,
				trigger: { global: "gainBefore" },
				silent: true,
				filter(event, player) {
					if (player == event.player || player.storage.gzweidi.includes(event.player) || _status.currentPhase != player) {
						return false;
					}
					if (event.cards.length) {
						if (event.getParent().name == "draw") {
							return true;
						}
						for (var i = 0; i < event.cards.length; i++) {
							if (get.position(event.cards[i]) == "c" || (!get.position(event.cards[i]) && event.cards[i].original == "c")) {
								return true;
							}
						}
					}
					return false;
				},
				content() {
					player.storage.gzweidi.push(trigger.player);
				},
			},
			ftc: {
				sub: true,
				trigger: { global: "phaseAfter" },
				silent: true,
				filter(event, player) {
					return event.player == player;
				},
				content() {
					player.storage.gzweidi = [];
				},
			},
		},
		audio: ["weidi", 2],
	},
	gzyongsi: {
		audio: "yongsi1",
		group: ["gzyongsi_eff1", "gzyongsi_eff2", "gzyongsi_eff3"],
		preHidden: ["gzyongsi_eff3"],
		ai: {
			threaten(player, target) {
				if (
					game.hasPlayer(function (current) {
						return current != target && current.getEquip("yuxi");
					})
				) {
					return 0.5;
				}
				return 2;
			},
			forceMajor: true,
			skillTagFilter() {
				return !game.hasPlayer(function (current) {
					return current.getEquip("yuxi");
				});
			},
		},
		subSkill: {
			eff1: {
				sub: true,
				equipSkill: true,
				noHidden: true,
				trigger: { player: "phaseDrawBegin2" },
				//priority:8,
				forced: true,
				filter(event, player) {
					if (event.numFixed || player.isDisabled(5)) {
						return false;
					}
					return !game.hasPlayer(function (current) {
						return current.getEquips("yuxi").length > 0;
					});
				},
				content() {
					trigger.num++;
				},
				audio: ["yongsi1", 2],
			},
			eff2: {
				sub: true,
				trigger: { player: "phaseUseBegin" },
				//priority:8,
				forced: true,
				noHidden: true,
				equipSkill: true,
				filter(event, player) {
					if (player.isDisabled(5)) {
						return false;
					}
					return (
						game.hasPlayer(function (current) {
							return player.canUse("zhibi", current);
						}) &&
						!game.hasPlayer(function (current) {
							return current.getEquips("yuxi").length > 0;
						})
					);
				},
				content() {
					player.chooseUseTarget("玉玺（庸肆）：选择知己知彼的目标", { name: "zhibi" });
				},
				audio: ["yongsi1", 2],
			},
			eff3: {
				sub: true,
				trigger: { global: "useCardToTargeted" },
				//priority:16,
				forced: true,
				filter(event, player) {
					return event.target && event.target == player && event.card && event.card.name == "zhibi";
				},
				check() {
					return false;
				},
				content() {
					player.showHandcards();
				},
			},
		},
	},
	gzfudi: {
		trigger: { global: "damageEnd" },
		direct: true,
		preHidden: true,
		audio: 2,
		filter(event, player) {
			return event.source && event.source.isAlive() && event.source != player && event.player == player && player.countCards("h") && event.num > 0;
		},
		content() {
			"step 0";
			var players = game.filterPlayer(function (current) {
				return (
					current.isFriendOf(trigger.source) &&
					current.hp >= player.hp &&
					!game.hasPlayer(function (current2) {
						return current2.hp > current.hp && current2.isFriendOf(trigger.source);
					})
				);
			});
			var check = true;
			if (!players.length) {
				check = false;
			} else {
				if (get.attitude(player, trigger.source) >= 0) {
					check = false;
				}
			}
			player
				.chooseCard(get.prompt("gzfudi", trigger.source), "交给其一张手牌，然后对其势力中体力值最大且不小于你的一名角色造成1点伤害")
				.set("aicheck", check)
				.set("ai", function (card) {
					if (!_status.event.aicheck) {
						return 0;
					}
					return 9 - get.value(card);
				})
				.setHiddenSkill(event.name);
			"step 1";
			if (result.bool) {
				player.logSkill("gzfudi", trigger.source);
				player.give(result.cards, trigger.source);
			} else {
				event.finish();
			}
			"step 2";
			var list = game.filterPlayer(function (current) {
				return (
					current.hp >= player.hp &&
					current.isFriendOf(trigger.source) &&
					!game.hasPlayer(function (current2) {
						return current2.hp > current.hp && current2.isFriendOf(trigger.source);
					})
				);
			});
			if (list.length) {
				if (list.length == 1) {
					event._result = { bool: true, targets: list };
				} else {
					player
						.chooseTarget(true, "对" + get.translation(trigger.source) + "势力中体力值最大的一名角色造成1点伤害", function (card, player, target) {
							return _status.event.list.includes(target);
						})
						.set("list", list)
						.set("ai", function (target) {
							return get.damageEffect(target, player, player);
						});
				}
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool && result.targets.length) {
				player.line(result.targets[0]);
				result.targets[0].damage();
			}
		},
		ai: {
			maixie: true,
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && target.hp > 1) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.countCards("h")) {
							return [1, -1];
						}
						if (
							game.countPlayer(function (current) {
								return current.isFriendOf(player) && current.hp >= target.hp - 1;
							})
						) {
							return [1, 0, 0, -2];
						}
					}
				},
			},
		},
	},
	gzcongjian: {
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		forced: true,
		preHidden: true,
		audio: "drlt_congjian",
		filter(event, player, name) {
			if (event.num <= 0) {
				return false;
			}
			if (name == "damageBegin1" && _status.currentPhase != player) {
				return true;
			}
			if (name == "damageBegin3" && _status.currentPhase == player) {
				return true;
			}
			return false;
		},
		check(event, player) {
			return _status.currentPhase != player;
		},
		content() {
			trigger.num++;
		},
	},
	jianan: {
		audio: 1,
		unique: true,
		forceunique: true,
		derivation: ["wuziliangjiangdao", "new_retuxi", "qiaobian", "gz_xiaoguo", "gz_jieyue", "gz_duanliang"],
		lordSkill: true,
		global: ["wuziliangjiangdao", "g_jianan"],
		init(player) {
			player.markSkill("wuziliangjiangdao");
		},
	},
	g_jianan: {
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseBefore", "dieBegin"],
		},
		audio: "wuziliangjiangdao",
		forceaudio: true,
		filter(event, player, name) {
			if (name != "phaseZhunbeiBegin") {
				return get.is.jun(player) && player.identity == "wei";
			}
			return this.filter2.apply(this, arguments);
		},
		filter2(event, player) {
			if (!get.zhu(player, "jianan")) {
				return false;
			}
			if (!player.countCards("he")) {
				return false;
			}
			return !player.isUnseen();
		},
		direct: true,
		content() {
			"step 0";
			if (event.triggername != "phaseZhunbeiBegin") {
				event.trigger("jiananUpdate");
				event.finish();
				return;
			}
			var skills = ["new_retuxi", "qiaobian", "gz_xiaoguo", "gz_jieyue", "gz_duanliang"];
			game.countPlayer(function (current) {
				if (current.hasSkill("new_retuxi")) {
					skills.remove("new_retuxi");
				}
				if (current.hasSkill("qiaobian")) {
					skills.remove("qiaobian");
				}
				if (current.hasSkill("gz_xiaoguo")) {
					skills.remove("gz_xiaoguo");
				}
				if (current.hasSkill("gz_jieyue")) {
					skills.remove("gz_jieyue");
				}
				if (current.hasSkill("gz_duanliang")) {
					skills.remove("gz_duanliang");
				}
			});
			if (!skills.length) {
				event.finish();
			} else {
				event.skills = skills;
				var next = player.chooseToDiscard("he");
				var str = "";
				for (var i = 0; i < skills.length; i++) {
					str += "、【";
					str += get.translation(skills[i]);
					str += "】";
				}
				next.set("prompt", "是否发动【五子良将纛】？");
				next.set("prompt2", get.translation("弃置一张牌并暗置一张武将牌，获得以下技能中的一个直到下回合开始：" + str.slice(1)));
				next.logSkill = "g_jianan";
				next.skills = skills;
				next.ai = function (card) {
					var skills = _status.event.skills;
					var player = _status.event.player;
					var rank = 0;
					if (
						skills.includes("new_retuxi") &&
						game.countPlayer(function (current) {
							return get.attitude(player, current) < 0 && current.countGainableCards(player, "h");
						}) > 1
					) {
						rank = 4;
					}
					if (
						skills.includes("gz_jieyue") &&
						player.countCards("h", function (card) {
							return get.value(card) < 7;
						}) > 1
					) {
						rank = 5;
					}
					if (skills.includes("qiaobian") && player.countCards("h") > 4) {
						rank = 6;
					}
					if ((get.guozhanRank(player.name1, player) < rank && !player.isUnseen(0)) || (get.guozhanRank(player.name2, player) < rank && !player.isUnseen(1))) {
						return rank + 1 - get.value(card);
					}
					return -1;
				};
			}
			"step 1";
			if (!result.bool) {
				event.finish();
			} else {
				var list = ["主将", "副将"];
				if (player.isUnseen(0) || get.is.jun(player)) {
					list.remove("主将");
				}
				if (player.isUnseen(1)) {
					list.remove("副将");
				}
				if (!list.length) {
					event.goto(3);
				} else if (list.length < 2) {
					event._result = { control: list[0] };
				} else {
					player.chooseControl(list).set("ai", function () {
						return get.guozhanRank(player.name1, player) < get.guozhanRank(player.name2, player) ? "主将" : "副将";
					}).prompt = "请选择暗置一张武将牌";
				}
			}
			"step 2";
			if (!result.control) {
				event.finish();
			} else {
				var num = result.control == "主将" ? 0 : 1;
				player.hideCharacter(num);
			}
			"step 3";
			player
				.chooseControl(event.skills)
				.set("ai", function () {
					var skills = event.skills;
					if (skills.includes("qiaobian") && player.countCards("h") > 3) {
						return "qiaobian";
					}
					if (
						skills.includes("gz_jieyue") &&
						player.countCards("h", function (card) {
							return get.value(card) < 7;
						})
					) {
						return "gz_jieyue";
					}
					if (skills.includes("new_retuxi")) {
						return "new_retuxi";
					}
					return skills.randomGet();
				})
				.set("prompt", "选择获得其中的一个技能直到君主的回合开始");
			"step 4";
			var link = result.control;
			player.addTempSkill(link, "jiananUpdate");
			player.addTempSkill("jianan_eff", "jiananUpdate");
			game.log(player, "获得了技能", "#g【" + get.translation(result.control) + "】");

			// 语音修复
			var map = {
				new_retuxi: "jianan_tuxi",
				qiaobian: "jianan_qiaobian",
				gz_xiaoguo: "jianan_xiaoguo",
				gz_jieyue: "jianan_jieyue",
				gz_duanliang: "jianan_duanliang",
			};
			var mapSkills = map[link];
			game.broadcastAll(function () {
				var info = lib.skill[link];
				if (!info.audioname2) {
					info.audioname2 = {};
				}
				info.audioname2[player.name1] = mapSkills;
				info.audioname2[player.name2] = mapSkills;
			}, link);
		},
	},
	jianan_eff: {
		ai: { nomingzhi: true },
	},
	jianan_tuxi: { audio: 2 },
	jianan_qiaobian: { audio: 2 },
	jianan_xiaoguo: { audio: 2 },
	jianan_jieyue: { audio: 2 },
	jianan_duanliang: { audio: 2 },
	huibian: {
		enable: "phaseUse",
		audio: 2,
		usable: 1,
		filter(event, player) {
			return (
				game.countPlayer(function (current) {
					return current.identity == "wei";
				}) > 1 &&
				game.hasPlayer(function (current) {
					return current.isDamaged() && current.identity == "wei";
				})
			);
		},
		filterTarget(card, player, target) {
			if (ui.selected.targets.length) {
				return target.isDamaged() && target.identity == "wei";
			}
			return target.identity == "wei";
		},
		selectTarget: 2,
		multitarget: true,
		targetprompt: ["受伤摸牌", "回复体力"],
		async content(event, trigger, player) {
			const {
				targets: [target1, target2],
			} = event;
			await target1.damage(player);
			if (target1.isAlive()) {
				await target1.draw(2);
			}
			await target2.recover();
		},
		ai: {
			threaten: 1.2,
			order: 9,
			result: {
				target(player, target) {
					if (ui.selected.targets.length) {
						return 1;
					}
					if (get.damageEffect(target, player, player) > 0) {
						return 2;
					}
					if (target.hp > 2) {
						return 1;
					}
					if (target.hp == 1) {
						return -1;
					}
					return 0.1;
				},
			},
		},
	},
	gzzongyu: {
		audio: 2,
		derivation: "liulongcanjia",
		unique: true,
		forceunique: true,
		group: "gzzongyu_others",
		global: "gzzongyu_player",
		ai: {
			threaten: 1.2,
		},
		subSkill: {
			others: {
				trigger: { global: "equipAfter" },
				filter(event, player) {
					if (event.player == player || !player.countCards("e", { subtype: ["equip3", "equip4"] })) {
						return false;
					}
					return event.card.name == "liulongcanjia";
				},
				async cost(event, trigger, player) {
					const target = trigger.player;
					event.result = await player
						.chooseBool("是否发动【总御】，与" + get.translation(target) + "交换装备区内坐骑牌？")
						.set("ai", () => {
							const { player, target } = get.event();
							if (get.attitude(player, target) <= 0) {
								return player.countCards("e", { subtype: ["equip4", "equip4"] }) < 2;
							}
							return true;
						})
						.set("target", target)
						.setHiddenSkill("gzzongyu")
						.forResult();
					event.result.targets = [target];
				},
				async content(event, trigger, player) {
					const target = trigger.player,
						cards1 = player.getCards("e", { subtype: ["equip3", "equip4"] }),
						cards2 = trigger.player.getCards("e", { name: "liulongcanjia" });
					const next = game.createEvent("swapEquip");
					next.player = player;
					next.target = target;
					next.cards1 = cards1;
					next.cards2 = cards2;
					next.setContent(async (event, trigger, player) => {
						const { target, cards1, cards2 } = event;
						game.log(player, "和", target, "交换了装备区中的坐骑牌");
						await game
							.loseAsync({
								player: player,
								target: target,
								cards1: cards1,
								cards2: cards2,
							})
							.setContent("swapHandcardsx");
						for (let i of cards2) {
							if (get.position(i, true) == "o") {
								await player.equip(i);
							}
						}
						for (let i of cards1) {
							if (get.position(i, true) == "o") {
								await target.equip(i);
							}
						}
					});
					await next;
				},
			},
			player: {
				audio: "gzzongyu",
				forceaudio: true,
				trigger: { player: "equipAfter" },
				forced: true,
				filter(event, player) {
					// if (!player.hasSkill("gzzongyu")) return false;
					// 村规
					if (!player.hasSkill("gzzongyu", null, null, false)) {
						return false;
					}
					if (!["equip3", "equip4"].includes(get.subtype(event.card))) {
						return false;
					}
					for (var i = 0; i < ui.discardPile.childElementCount; i++) {
						if (ui.discardPile.childNodes[i].name == "liulongcanjia") {
							return true;
						}
					}
					return game.hasPlayer(function (current) {
						return current != player && current.countCards("ej", "liulongcanjia");
					});
				},
				content() {
					var list = [];
					for (var i = 0; i < ui.discardPile.childElementCount; i++) {
						if (ui.discardPile.childNodes[i].name == "liulongcanjia") {
							list.add(ui.discardPile.childNodes[i]);
						}
					}
					game.countPlayer(function (current) {
						if (current != player) {
							var ej = current.getCards("ej", "liulongcanjia");
							if (ej.length) {
								list.addArray(ej);
							}
						}
					});
					if (list.length) {
						var card = list.randomGet();
						var owner = get.owner(card);
						if (owner) {
							player.line(owner, "green");
							owner.$give(card, player);
						} else {
							player.$gain(card, "log");
						}
						player.equip(card);
					}
				},
			},
		},
	},
	wuziliangjiangdao: {
		audio: 2,
		nopop: true,
		unique: true,
		forceunique: true,
		mark: true,
		intro: {
			content() {
				return get.translation("wuziliangjiangdao_info");
			},
		},
	},

	gzzhengbi: {
		audio: "zhengbi",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			//if(event.player!=player) return false;
			return (
				game.hasPlayer(function (current) {
					return current != player && current.identity == "unknown";
				}) || player.countCards("h", { type: "basic" })
			);
		},
		check(event, player) {
			if (
				player.countCards("h", function (card) {
					return get.value(card) < 7;
				})
			) {
				if (player.isUnseen()) {
					return Math.random() > 0.7;
				}
				return true;
			}
		},
		preHidden: true,
		content() {
			"step 0";
			var choices = [];
			if (
				game.hasPlayer(function (current) {
					return current.isUnseen();
				})
			) {
				choices.push("选择一名未确定势力的角色");
			}
			if (
				game.hasPlayer(function (current) {
					return current != player && !current.isUnseen();
				}) &&
				player.countCards("h", { type: "basic" })
			) {
				choices.push("将一张基本牌交给一名已确定势力的角色");
			}
			if (choices.length == 1) {
				event._result = { index: choices[0] == "选择一名未确定势力的角色" ? 0 : 1 };
			} else {
				player
					.chooseControl()
					.set("ai", function () {
						if (choices.length > 1) {
							var player = _status.event.player;
							if (
								!game.hasPlayer(function (current) {
									return (
										(!current.isUnseen() && current.getEquip("yuxi")) ||
										(current.hasSkill("gzyongsi") &&
											!game.hasPlayer(function (current) {
												return current.getEquips("yuxi").length > 0;
											}))
									);
								}) &&
								game.hasPlayer(function (current) {
									return current != player && current.isUnseen();
								})
							) {
								var identity;
								for (var i = 0; i < game.players; i++) {
									if (game.players[i].isMajor()) {
										identity = game.players[i].identity;
										break;
									}
								}
							}
							if (!player.isUnseen() && player.identity != identity && get.population(player.identity) + 1 >= get.population(identity)) {
								return 0;
							}
							return 1;
						}
						return 0;
					})
					.set("prompt", "征辟：请选择一项")
					.set("choiceList", choices);
			}
			"step 1";
			if (result.index == 0) {
				player.chooseTarget(
					"请选择一名未确定势力的角色",
					function (card, player, target) {
						return target != player && target.identity == "unknown";
					},
					true
				);
			} else {
				player
					.chooseCardTarget({
						prompt: "请将一张基本牌交给一名已确定势力的其他角色",
						position: "h",
						filterCard(card) {
							return get.type(card) == "basic";
						},
						filterTarget(card, player, target) {
							return target != player && target.identity != "unknown";
						},
						ai1(card) {
							return 5 - get.value(card);
						},
						ai2(target) {
							var player = _status.event.player;
							var att = get.attitude(player, target);
							if (att > 0) {
								return 0;
							}
							return -(att - 1) / target.countCards("h");
						},
					})
					.set("forced", true);
			}
			"step 2";
			event.target = result.targets[0];
			player.line(result.targets, "green");
			if (result.cards.length) {
				event.cards = result.cards;
				player.give(result.cards, result.targets[0]);
			} else {
				player.storage.gzzhengbi_eff1 = result.targets[0];
				player.addTempSkill("gzzhengbi_eff1", "phaseUseAfter");
				event.finish();
			}
			"step 3";
			var choices = [];
			if (target.countCards("he", { type: ["trick", "delay", "equip"] })) {
				choices.push("一张非基本牌");
			}
			if (target.countCards("h", { type: "basic" }) > 1) {
				choices.push("两张基本牌");
			}
			if (choices.length) {
				target
					.chooseControl(choices)
					.set("ai", function (event, player) {
						if (choices.length > 1) {
							if (
								player.countCards("he", { type: ["trick", "delay", "equip"] }, function (card) {
									return get.value(card) < 7;
								})
							) {
								return 0;
							}
							return 1;
						}
						return 0;
					})
					.set("prompt", "征辟：交给" + get.translation(player) + "…</div>");
			} else {
				if (target.countCards("h")) {
					var cards = target.getCards("h");
					target.give(cards, player);
					event.finish();
				} else {
					event.finish();
				}
			}
			"step 4";
			var check = result.control == "一张非基本牌";
			target.chooseCard("he", check ? 1 : 2, { type: check ? ["trick", "delay", "equip"] : "basic" }, true);
			"step 5";
			if (result.cards) {
				target.give(result.cards, player);
			}
		},
		subSkill: {
			eff1: {
				audio: "zhengbi",
				sub: true,
				onremove: true,
				trigger: { player: "phaseUseEnd" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					var target = player.storage.gzzhengbi_eff1;
					return target && !target.isUnseen() && target.countGainableCards(player, "he") > 0;
				},
				logTarget(event, player) {
					return player.storage.gzzhengbi_eff1;
				},
				content() {
					var num = 0;
					var target = player.storage.gzzhengbi_eff1;
					if (target.countGainableCards(player, "h")) {
						num++;
					}
					if (target.countGainableCards(player, "e")) {
						num++;
					}
					if (num) {
						player.gainPlayerCard(target, num, "he", true).set("filterButton", function (button) {
							for (var i = 0; i < ui.selected.buttons.length; i++) {
								if (get.position(button.link) == get.position(ui.selected.buttons[i].link)) {
									return false;
								}
							}
							return true;
						});
					}
				},
			},
		},
	},
	gzfengying: {
		audio: "fengying",
		limited: true,
		enable: "phaseUse",
		position: "h",
		filterCard: true,
		selectCard: -1,
		filter(event, player) {
			return !player.storage.gzfengying && player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return target == player;
		},
		selectTarget: -1,
		discard: false,
		lose: false,
		content() {
			"step 0";
			player.awakenSkill("gzfengying");
			player.storage.gzfengying = true;
			player.useCard({ name: "xietianzi" }, cards, target);
			"step 1";
			var list = game.filterPlayer(function (current) {
				return current.isFriendOf(player) && current.countCards("h") < current.maxHp;
			});
			list.sort(lib.sort.seat);
			player.line(list, "thunder");
			game.asyncDraw(list, function (current) {
				return current.maxHp - current.countCards("h");
			});
		},
		skillAnimation: "epic",
		animationColor: "gray",
		ai: {
			order: 0.1,
			result: {
				player(player) {
					var value = 0;
					var cards = player.getCards("h");
					if (cards.length >= 4) {
						return 0;
					}
					for (var i = 0; i < cards.length; i++) {
						value += Math.max(0, get.value(cards[i], player, "raw"));
					}
					var targets = game.filterPlayer(function (current) {
						return current.isFriendOf(player) && current != player;
					});
					var eff = 0;
					for (var i = 0; i < targets.length; i++) {
						var num = targets[i].countCards("h") < targets[i].maxHp;
						if (num <= 0) {
							continue;
						}
						eff += num;
					}
					return 5 * eff - value;
				},
			},
		},
	},

	junling4_eff: {
		mod: {
			cardEnabled2(card) {
				if (get.position(card) == "h") {
					return false;
				}
			},
		},
		mark: true,
		marktext: "令",
		intro: {
			content: "不能使用或打出手牌",
		},
	},
	junling5_eff: {
		trigger: { player: "recoverBefore" },
		priority: 44,
		forced: true,
		silent: true,
		popup: false,
		content() {
			trigger.cancel();
		},
		mark: true,
		marktext: "令",
		intro: {
			content: "不能回复体力",
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

	gzjieyue: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return (
				player.countCards("h") &&
				game.hasPlayer(function (current) {
					return current != player && current.identity != "wei";
				})
			);
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			player
				.chooseCardTarget({
					prompt: get.prompt2("gzjieyue"),
					position: "h",
					filterCard: true,
					filterTarget(card, player, target) {
						return target.identity != "wei" && target != player;
					},
					ai1(card, player, target) {
						if (get.attitude(player, target) > 0) {
							return 11 - get.value(card);
						}
						return 7 - get.value(card);
					},
					ai2(target) {
						var att = get.attitude(get.event().player, target);
						if (att < 0) {
							return -att;
						}
						return 1;
					},
				})
				.setHiddenSkill("gzjieyue");
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("gzjieyue", result.targets);
				player.give(result.cards[0], result.targets[0]);
				player.chooseJunlingFor(result.targets[0]);
			} else {
				event.finish();
			}
			"step 2";
			event.junling = result.junling;
			event.targets = result.targets;
			var choiceList = [];
			choiceList.push("执行该军令，然后" + get.translation(player) + "摸一张牌");
			choiceList.push("令" + get.translation(player) + "摸牌阶段额外摸三张牌");
			target
				.chooseJunlingControl(player, result.junling, result.targets)
				.set("prompt", "节钺")
				.set("choiceList", choiceList)
				.set("ai", function () {
					if (get.attitude(target, player) > 0) {
						return get.junlingEffect(player, result.junling, target, result.targets, target) > 1 ? 0 : 1;
					}
					return get.junlingEffect(player, result.junling, target, result.targets, target) >= -1 ? 0 : 1;
				});
			"step 3";
			if (result.index == 0) {
				target.carryOutJunling(player, event.junling, targets);
				player.draw();
			} else {
				player.addTempSkill("gzjieyue_eff");
			}
		},
		ai: { threaten: 2 },
		subSkill: {
			eff: {
				sub: true,
				trigger: { player: "phaseDrawBegin2" },
				filter(event, player) {
					return !event.numFixed;
				},
				forced: true,
				popup: false,
				content() {
					trigger.num += 3;
				},
			},
		},
		audio: ["jieyue", 2],
		audioname2: { gz_jun_caocao: "jianan_jieyue" },
	},

	jianglue: {
		limited: true,
		audio: 2,
		enable: "phaseUse",
		prepare(cards, player) {
			var targets = game.filterPlayer(function (current) {
				return current.isFriendOf(player) || current.isUnseen();
			});
			player.line(targets, "fire");
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.addTempSkill("jianglue_count");
			player.chooseJunlingFor(player).set("prompt", "选择一张军令牌，令与你势力相同的其他角色选择是否执行");
			"step 1";
			event.junling = result.junling;
			event.targets = result.targets;
			event.players = game
				.filterPlayer(function (current) {
					if (current == player) {
						return false;
					}
					return current.isFriendOf(player) || (player.identity != "ye" && current.isUnseen());
				})
				.sort(lib.sort.seat);
			event.num = 0;
			event.filterName = function (name) {
				return lib.character[name][1] == player.identity && !get.is.double(name);
			};
			"step 2";
			if (num < event.players.length) {
				event.current = event.players[num];
			}
			if (event.current && event.current.isAlive()) {
				event.showCharacter = false;
				var choiceList = ["执行该军令，增加1点体力上限，然后回复1点体力", "不执行该军令"];
				if (event.current.isFriendOf(player)) {
					event.current
						.chooseJunlingControl(player, event.junling, targets)
						.set("prompt", "将略")
						.set("choiceList", choiceList)
						.set("ai", function () {
							if (event.junling == "junling6" && (event.current.countCards("h") > 3 || event.current.countCards("e") > 2)) {
								return 1;
							}
							return event.junling == "junling5" ? 1 : 0;
						});
				} else if ((event.filterName(event.current.name1) || event.filterName(event.current.name2)) && event.current.wontYe(player.identity)) {
					event.showCharacter = true;
					choiceList[0] = "明置一张武将牌以" + choiceList[0];
					choiceList[1] = "不明置武将牌且" + choiceList[1];
					event.current
						.chooseJunlingControl(player, event.junling, targets)
						.set("prompt", "将略")
						.set("choiceList", choiceList)
						.set("ai", function () {
							if (event.junling == "junling6" && (event.current.countCards("h") > 3 || event.current.countCards("e") > 2)) {
								return 1;
							}
							return event.junling == "junling5" ? 1 : 0;
						});
				} else {
					event.current.chooseJunlingControl(player, event.junling, targets).set("prompt", "将略").set("controls", ["ok"]);
				}
			} else {
				event.goto(4);
			}
			"step 3";
			event.carry = false;
			if (result.index == 0 && result.control != "ok") {
				event.carry = true;
				if (event.showCharacter) {
					var list = [];
					if (event.filterName(event.current.name1)) {
						list.push("主将");
					}
					if (event.filterName(event.current.name2)) {
						list.push("副将");
					}
					if (list.length > 1) {
						event.current.chooseControl(["主将", "副将"]).set("ai", function () {
							let player = _status.event.player;
							if (get.character(player.name1, 3).includes("gzxuanhuo")) {
								return 0;
							}
							if (get.character(player.name2, 3).includes("gzxuanhuo")) {
								return 1;
							}
							return Math.random() > 0.5 ? 0 : 1;
						}).prompt = "选择并展示一张武将牌，然后执行军令";
					} else {
						event._result = { index: list[0] == "主将" ? 0 : 1 };
					}
				}
			}
			"step 4";
			if (!event.list) {
				event.list = [player];
			}
			if (event.carry) {
				if (event.showCharacter) {
					event.current.showCharacter(result.index);
				}
				event.current.carryOutJunling(player, event.junling, targets);
				event.list.push(event.current);
			}
			event.num++;
			if (event.num < event.players.length) {
				event.goto(2);
			}
			"step 5";
			event.num = 0;
			player.storage.jianglue_count = 0;
			"step 6";
			if (event.list[num].isAlive()) {
				event.list[num].gainMaxHp(true);
				event.list[num].recover();
			}
			event.num++;
			"step 7";
			if (event.num < event.list.length) {
				event.goto(6);
			} else if (player.storage.jianglue_count > 0) {
				player.draw(player.storage.jianglue_count);
			}
		},
		marktext: "略",
		skillAnimation: "epic",
		animationColor: "soil",
		ai: {
			order: 10,
			result: {
				player(player) {
					if (player.isUnseen() && player.wontYe()) {
						if (get.population(player.group) >= game.players.length / 4) {
							return 1;
						}
						return Math.random() > 0.7 ? 1 : 0;
					} else {
						return 1;
					}
				},
			},
		},
		subSkill: {
			count: {
				sub: true,
				trigger: { global: "recoverAfter" },
				silent: true,
				filter(event) {
					return event.getParent("jianglue");
				},
				content() {
					player.storage.jianglue_count++;
				},
			},
		},
	},
	gzxuanhuo: {
		audio: "xinxuanhuo",
		global: "gzxuanhuo_others",
		derivation: ["fz_wusheng", "fz_new_paoxiao", "fz_new_longdan", "fz_new_tieji", "fz_liegong", "fz_xinkuanggu"],
		ai: {
			threaten(player, target) {
				if (
					game.hasPlayer(function (current) {
						return current != target && current.isFriendOf(target);
					})
				) {
					return 1.5;
				}
				return 0.5;
			},
		},
		subSkill: {
			others: {
				audio: "xinxuanhuo",
				forceaudio: true,
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return (
						!player.isUnseen() &&
						player.countCards("h") > 0 &&
						game.hasPlayer(function (current) {
							return current != player && current.hasSkill("gzxuanhuo") && player.isFriendOf(current);
						})
					);
				},
				prompt: "弃置一张手牌，然后获得以下技能中的一个：〖武圣〗〖咆哮〗〖龙胆〗〖铁骑〗〖烈弓〗〖狂骨〗",
				position: "h",
				filterCard: true,
				check(card) {
					let player = _status.event.player,
						shas = player.countCards("h", cardx => {
							return cardx != card && cardx.name == "sha" && player.hasUseTarget(cardx);
						}),
						count = player.getCardUsable("sha"),
						val = (get.name(card) == "sha" ? 2 : 1) * get.value(card);
					if (!shas || count - shas > 1) {
						return (player.needsToDiscard() ? 7 : 1) - val;
					}
					return 7 - val;
				},
				content() {
					"step 0";
					var list = ["gz_wusheng", "gz_paoxiao", "gz_longdan", "gz_tieji", "liegong", "xinkuanggu"];
					player
						.chooseControl(list)
						.set("ai", function () {
							let res = get.event().res;
							if (list.includes(res)) {
								return res;
							}
							return 0;
						})
						.set(
							"res",
							(function () {
								let shas = player.mayHaveSha(player, "use", null, "count"),
									count = player.getCardUsable("sha");
								if (shas > count) {
									return "gzpaoxiao";
								}
								if (shas < count) {
									return "new_rewusheng";
								}
								if (!shas) {
									return "xinkuanggu";
								}
								return ["new_longdan", "new_tieji", "liegong"].randomGet(); //脑子不够用了
							})()
						)
						.set("prompt", "选择并获得一项技能直到回合结束");
					"step 1";
					player.popup(result.control);
					var map = {
						gz_wusheng: "fz_wusheng",
						gz_paoxiao: "fz_new_paoxiao",
						gz_longdan: "fz_new_longdan",
						gz_tieji: "fz_new_tieji",
						liegong: "fz_liegong",
						xinkuanggu: "fz_xinkuanggu",
					};
					player.addTempSkill(map[result.control]);
					game.log(player, "获得了技能", "#g【" + get.translation(result.control) + "】");
					game.delay();
				},
				// forceaudio:true,
				// audio:['xuanhuo',2],
				ai: {
					order: 8,
					result: { player: 1 },
				},
			},
			//used:{},
		},
		// audio:['xuanhuo',2],
	},
	fz_new_paoxiao: {
		audio: true,
		inherit: "gz_paoxiao",
	},
	fz_new_tieji: {
		audio: true,
		inherit: "gz_tieji",
	},
	fz_wusheng: {
		audio: true,
		inherit: "gz_wusheng",
	},
	fz_liegong: {
		audio: true,
		inherit: "liegong",
	},
	fz_xinkuanggu: {
		audio: true,
		inherit: "xinkuanggu",
	},
	fz_new_longdan: {
		audio: true,
		group: ["fz_new_longdan_sha", "fz_new_longdan_shan", "fz_new_longdan_draw", "fz_new_longdan_shamiss", "fz_new_longdan_shanafter"],
		subSkill: {
			shanafter: {
				sub: true,
				audio: "fz_new_longdan",
				trigger: {
					player: "useCard",
				},
				//priority:1,
				filter(event, player) {
					return event.skill == "fz_new_longdan_shan" && event.getParent(2).name == "sha";
				},
				direct: true,
				content() {
					"step 0";
					player
						.chooseTarget("是否发动【龙胆】令一名其他角色回复1点体力？", function (card, player, target) {
							return target != _status.event.source && target != player && target.isDamaged();
						})
						.set("ai", function (target) {
							return get.attitude(_status.event.player, target);
						})
						.set("source", trigger.getParent(2).player);
					"step 1";
					if (result.bool && result.targets && result.targets.length) {
						player.logSkill("fz_new_longdan", result.targets[0]);
						result.targets[0].recover();
					}
				},
			},
			shamiss: {
				sub: true,
				audio: "fz_new_longdan",
				trigger: {
					player: "shaMiss",
				},
				direct: true,
				filter(event, player) {
					return event.skill == "fz_new_longdan_sha";
				},
				content() {
					"step 0";
					player
						.chooseTarget("是否发动【龙胆】对一名其他角色造成1点伤害？", function (card, player, target) {
							return target != _status.event.target && target != player;
						})
						.set("ai", function (target) {
							return -get.attitude(_status.event.player, target);
						})
						.set("target", trigger.target);
					"step 1";
					if (result.bool && result.targets && result.targets.length) {
						player.logSkill("fz_new_longdan", result.targets[0]);
						result.targets[0].damage();
					}
				},
			},
			draw: {
				trigger: {
					player: ["useCard", "respond"],
				},
				audio: "fz_new_longdan",
				forced: true,
				locked: false,
				filter(event, player) {
					if (!get.zhu(player, "shouyue")) {
						return false;
					}
					return event.skill == "fz_new_longdan_sha" || event.skill == "fz_new_longdan_shan";
				},
				content() {
					player.draw();
					//player.storage.fanghun2++;
				},
				sub: true,
			},
			sha: {
				audio: "fz_new_longdan",
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard: {
					name: "shan",
				},
				viewAs: {
					name: "sha",
				},
				viewAsFilter(player) {
					if (!player.countCards("hs", "shan")) {
						return false;
					}
				},
				prompt: "将一张闪当杀使用或打出",
				position: "hs",
				check() {
					return 1;
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
					skillTagFilter(player) {
						if (!player.countCards("hs", "shan")) {
							return false;
						}
					},
					order() {
						return get.order({ name: "sha" }) + 0.1;
					},
				},
				sub: true,
			},
			shan: {
				audio: "fz_new_longdan",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: {
					name: "sha",
				},
				viewAs: {
					name: "shan",
				},
				position: "hs",
				prompt: "将一张杀当闪使用或打出",
				check() {
					return 1;
				},
				viewAsFilter(player) {
					if (!player.countCards("hs", "sha")) {
						return false;
					}
				},
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						if (!player.countCards("hs", "sha")) {
							return false;
						}
					},
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondShan") && current < 0) {
								return 0.6;
							}
						},
					},
				},
				sub: true,
			},
		},
	},
	gzenyuan: {
		locked: true,
		audio: "xinenyuan",
		group: ["gzenyuan_gain", "gzenyuan_damage"],
		preHidden: true,
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1.5];
					}
					if (!target.hasFriend()) {
						return;
					}
					if (get.tag(card, "damage")) {
						return [1, 0, 0, -0.7];
					}
				},
			},
		},
		subSkill: {
			gain: {
				audio: "xinenyuan",
				trigger: { target: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					return event.card.name == "tao" && event.player != player;
				},
				logTarget: "player",
				content() {
					trigger.player.draw();
				},
			},
			damage: {
				audio: "xinenyuan",
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return event.source && event.source != player && event.num > 0;
				},
				content() {
					"step 0";
					player.logSkill("enyuan_damage", trigger.source);
					trigger.source.chooseCard("交给" + get.translation(player) + "一张手牌，或失去1点体力", "h").set("ai", function (card) {
						if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
							return 11 - get.value(card);
						}
						return 7 - get.value(card);
					});
					"step 1";
					if (result.bool) {
						trigger.source.give(result.cards[0], player, "giveAuto");
					} else {
						trigger.source.loseHp();
					}
				},
			},
		},
	},

	gzjushou: {
		audio: "xinjushou",
		trigger: {
			player: "phaseJieshuBegin",
		},
		preHidden: true,
		content() {
			"step 0";
			var list = [],
				players = game.filterPlayer();
			for (var target of players) {
				if (target.isUnseen()) {
					continue;
				}
				var add = true;
				for (var i of list) {
					if (i.isFriendOf(target)) {
						add = false;
						break;
					}
				}
				if (add) {
					list.add(target);
				}
			}
			event.num = list.length;
			player.draw(event.num);
			if (event.num > 2) {
				player.turnOver();
			}
			"step 1";
			player
				.chooseCard("h", true, "弃置一张手牌，若以此法弃置的是装备牌，则你改为使用之")
				.set("ai", function (card) {
					if (get.type(card) == "equip") {
						return 5 - get.value(card);
					}
					return -get.value(card);
				})
				.set("filterCard", lib.filter.cardDiscardable);
			"step 2";
			if (result.bool && result.cards.length) {
				if (get.type(result.cards[0]) == "equip" && player.hasUseTarget(result.cards[0])) {
					player.chooseUseTarget(result.cards[0], true, "nopopup");
				} else {
					player.discard(result.cards[0]);
				}
			}
		},
	},
	new_duanliang: {
		subSkill: {
			off: {
				sub: true,
			},
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "bingliang") {
					return true;
				}
			},
		},
		locked: false,
		audio: "duanliang1",
		audioname2: { gz_jun_caocao: "jianan_duanliang" },
		enable: "chooseToUse",
		filterCard(card) {
			if (get.type(card) != "basic" && get.type(card) != "equip") {
				return false;
			}
			return get.color(card) == "black";
		},
		filter(event, player) {
			if (player.hasSkill("new_duanliang_off")) {
				return false;
			}
			return player.countCards("hes", { type: ["basic", "equip"], color: "black" });
		},
		position: "hes",
		viewAs: {
			name: "bingliang",
		},
		onuse(result, player) {
			if (get.distance(player, result.targets[0]) > 2) {
				player.addTempSkill("new_duanliang_off");
			}
		},
		prompt: "将一黑色的基本牌或装备牌当兵粮寸断使用",
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			order: 9,
			basic: {
				order: 1,
				useful: 1,
				value: 4,
			},
			result: {
				target(player, target) {
					if (target.hasJudge("caomu")) {
						return 0;
					}
					return -1.5 / Math.sqrt(target.countCards("h") + 1);
				},
			},
			tag: {
				skip: "phaseDraw",
			},
		},
	},
	new_shushen: {
		audio: "shushen",
		trigger: {
			player: "recoverAfter",
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			event.num = trigger.num || 1;
			"step 1";
			player
				.chooseTarget(get.prompt2("new_shushen"), function (card, player, target) {
					return target != player;
				})
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				})
				.setHiddenSkill("new_shushen");
			"step 2";
			if (result.bool) {
				player.logSkill("new_shushen", result.targets);
				result.targets[0].draw();
				if (event.num > 1) {
					event.num--;
					event.goto(1);
				}
			}
		},
		ai: {
			threaten: 0.8,
			expose: 0.1,
		},
	},
	new_luanji: {
		audio: "luanji",
		enable: "phaseUse",
		viewAs: {
			name: "wanjian",
		},
		filterCard(card, player) {
			if (!player.storage.new_luanji) {
				return true;
			}
			return !player.storage.new_luanji.includes(get.suit(card));
		},
		selectCard: 2,
		position: "hs",
		filter(event, player) {
			return (
				player.countCards("hs", function (card) {
					return !player.storage.new_luanji || !player.storage.new_luanji.includes(get.suit(card));
				}) > 1
			);
		},
		check(card) {
			var player = _status.event.player;
			var targets = game.filterPlayer(function (current) {
				return player.canUse("wanjian", current);
			});
			var num = 0;
			for (var i = 0; i < targets.length; i++) {
				var eff = get.sgn(get.effect(targets[i], { name: "wanjian" }, player, player));
				if (targets[i].hp == 1) {
					eff *= 1.5;
				}
				num += eff;
			}
			if (!player.needsToDiscard(-1)) {
				if (targets.length >= 7) {
					if (num < 2) {
						return 0;
					}
				} else if (targets.length >= 5) {
					if (num < 1.5) {
						return 0;
					}
				}
			}
			return 6 - get.value(card);
		},
		group: ["new_luanji_count", "new_luanji_reset", "new_luanji_respond"],
		subSkill: {
			reset: {
				trigger: {
					player: "phaseAfter",
				},
				silent: true,
				filter(event, player) {
					return player.storage.new_luanji ? true : false;
				},
				content() {
					delete player.storage.new_luanji;
				},
				sub: true,
				forced: true,
				popup: false,
			},
			count: {
				trigger: {
					player: "useCard",
				},
				silent: true,
				filter(event) {
					return event.skill == "new_luanji";
				},
				content() {
					if (!player.storage.new_luanji) {
						player.storage.new_luanji = [];
					}
					for (var i = 0; i < trigger.cards.length; i++) {
						player.storage.new_luanji.add(get.suit(trigger.cards[i]));
					}
				},
				sub: true,
				forced: true,
				popup: false,
			},
			respond: {
				trigger: {
					global: "respond",
				},
				silent: true,
				filter(event) {
					if (event.player.isUnseen()) {
						return false;
					}
					return event.getParent(2).skill == "new_luanji" && event.player.isFriendOf(_status.currentPhase);
				},
				content() {
					trigger.player.draw();
				},
				sub: true,
				forced: true,
				popup: false,
			},
		},
	},
	new_qingcheng: {
		audio: "qingcheng",
		enable: "phaseUse",
		filter(event, player) {
			return (
				player.countCards("he", { color: "black" }) &&
				game.hasPlayer(function (current) {
					return current != player && !current.isUnseen(2);
				})
			);
		},
		filterCard: {
			color: "black",
		},
		position: "he",
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			return !target.isUnseen(2);
		},
		check(card) {
			return 6 - get.value(card, _status.event.player);
		},
		content() {
			"step 0";
			event.target = target;
			event.done = false;
			"step 1";
			if (get.is.jun(event.target)) {
				event._result = { control: "副将" };
			} else {
				var choice = "主将";
				var skills = lib.character[event.target.name2][3];
				for (var i = 0; i < skills.length; i++) {
					var info = get.info(skills[i]);
					if (info && info.ai && info.ai.maixie) {
						choice = "副将";
						break;
					}
				}
				if (get.character(event.target.name, 3).includes("buqu")) {
					choice = "主将";
				} else if (get.character(event.target.name2, 3).includes("buqu")) {
					choice = "副将";
				}
				player
					.chooseControl("主将", "副将", function () {
						return _status.event.choice;
					})
					.set("prompt", "暗置" + get.translation(event.target) + "的一张武将牌")
					.set("choice", choice);
			}
			"step 2";
			if (result.control == "主将") {
				event.target.hideCharacter(0);
			} else {
				event.target.hideCharacter(1);
			}
			event.target.addTempSkill("qingcheng_ai");
			if (get.type(cards[0]) == "equip" && !event.done) {
				player
					.chooseTarget("是否暗置一名武将牌均为明置的角色的一张武将牌？", function (card, player, target) {
						return target != player && !target.isUnseen(2);
					})
					.set("ai", function (target) {
						return -get.attitude(_status.event.player, target);
					});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool && result.targets && result.targets.length) {
				player.line(result.targets[0], "green");
				event.done = true;
				event.target = result.targets[0];
				event.goto(1);
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (target.hp <= 0) {
						return -5;
					}
					if (player.getStat().skill.new_qingcheng) {
						return 0;
					}
					if (!target.hasSkillTag("maixie")) {
						return 0;
					}
					if (get.attitude(player, target) >= 0) {
						return 0;
					}
					if (
						player.hasCard(function (card) {
							return get.tag(card, "damage") && player.canUse(card, target, true, true);
						})
					) {
						if (target.maxHp > 3) {
							return -0.5;
						}
						return -1;
					}
					return 0;
				},
			},
		},
	},
	new_kongcheng: {
		group: ["new_kongcheng_gain", "new_kongcheng_got"],
		subSkill: {
			gain: {
				audio: "kongcheng",
				trigger: {
					player: "gainBefore",
				},
				filter(event, player) {
					return event.source && event.source != player && player != _status.currentPhase && !event.bySelf && player.countCards("h") == 0;
				},
				content() {
					trigger.name = "addToExpansion";
					trigger.setContent("addToExpansion");
					trigger.gaintag = ["new_kongcheng"];
					trigger.untrigger();
					trigger.trigger("addToExpansionBefore");
				},
				sub: true,
				forced: true,
			},
			got: {
				trigger: {
					player: "phaseDrawBegin1",
				},
				filter(event, player) {
					return player.getExpansions("new_kongcheng").length > 0;
				},
				content() {
					player.gain(player.getExpansions("new_kongcheng"), "draw");
				},
				sub: true,
				forced: true,
			},
		},
		audio: "kongcheng",
		trigger: {
			target: "useCardToTarget",
		},
		forced: true,
		check(event, player) {
			return get.effect(event.target, event.card, event.player, player) < 0;
		},
		filter(event, player) {
			return player.countCards("h") == 0 && (event.card.name == "sha" || event.card.name == "juedou");
		},
		content() {
			trigger.getParent().targets.remove(player);
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (target.countCards("h") == 0 && (card.name == "sha" || card.name == "juedou")) {
						return "zeroplayertarget";
					}
				},
			},
		},
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("new_kongcheng");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张牌";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("new_kongcheng");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张牌";
				}
			},
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
	},
	new_keji: {
		audio: "keji",
		forced: true,
		trigger: {
			player: "phaseDiscardBegin",
		},
		filter(event, player) {
			var list = [];
			player.getHistory("useCard", function (evt) {
				if (evt.isPhaseUsing(player)) {
					var color = get.color(evt.card);
					if (color != "nocolor") {
						list.add(color);
					}
				}
			});
			return list.length <= 1;
		},
		check(event, player) {
			return player.needsToDiscard();
		},
		content() {
			player.addTempSkill("keji_add", "phaseAfter");
		},
	},
	keji_add: {
		charlotte: true,
		mod: {
			maxHandcard(player, num) {
				return num + 4;
			},
		},
	},
	new_mouduan: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		//priority:2,
		audio: "botu",
		filter(event, player) {
			var history = player.getHistory("useCard");
			var suits = [];
			var types = [];
			for (var i = 0; i < history.length; i++) {
				var suit = get.suit(history[i].card);
				if (suit) {
					suits.add(suit);
				}
				types.add(get.type(history[i].card));
			}
			return suits.length >= 4 || types.length >= 3;
		},
		check(event, player) {
			return player.canMoveCard(true);
		},
		content() {
			player.moveCard();
		},
	},
	new_longdan: {
		audio: "longdan_sha",
		audioname2: { gz_jun_liubei: "shouyue_longdan" },
		group: ["new_longdan_sha", "new_longdan_shan", "new_longdan_draw", "new_longdan_shamiss", "new_longdan_shanafter"],
		subSkill: {
			shanafter: {
				sub: true,
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				trigger: {
					player: "useCard",
				},
				//priority:1,
				filter(event, player) {
					return event.skill == "new_longdan_shan" && event.getParent(2).name == "sha";
				},
				direct: true,
				content() {
					"step 0";
					player
						.chooseTarget("是否发动【龙胆】令一名其他角色回复1点体力？", function (card, player, target) {
							return target != _status.event.source && target != player && target.isDamaged();
						})
						.set("ai", function (target) {
							return get.attitude(_status.event.player, target);
						})
						.set("source", trigger.getParent(2).player);
					"step 1";
					if (result.bool && result.targets && result.targets.length) {
						player.logSkill("new_longdan", result.targets[0]);
						result.targets[0].recover();
					}
				},
			},
			shamiss: {
				sub: true,
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				trigger: {
					player: "shaMiss",
				},
				direct: true,
				filter(event, player) {
					return event.skill == "new_longdan_sha";
				},
				content() {
					"step 0";
					player
						.chooseTarget("是否发动【龙胆】对一名其他角色造成1点伤害？", function (card, player, target) {
							return target != _status.event.target && target != player;
						})
						.set("ai", function (target) {
							return -get.attitude(_status.event.player, target);
						})
						.set("target", trigger.target);
					"step 1";
					if (result.bool && result.targets && result.targets.length) {
						player.logSkill("new_longdan", result.targets[0]);
						result.targets[0].damage();
					}
				},
			},
			draw: {
				trigger: {
					player: ["useCard", "respond"],
				},
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				forced: true,
				locked: false,
				filter(event, player) {
					if (!get.zhu(player, "shouyue")) {
						return false;
					}
					return event.skill == "new_longdan_sha" || event.skill == "new_longdan_shan";
				},
				content() {
					player.draw();
					//player.storage.fanghun2++;
				},
				sub: true,
			},
			sha: {
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard: {
					name: "shan",
				},
				viewAs: {
					name: "sha",
				},
				position: "hs",
				viewAsFilter(player) {
					if (!player.countCards("hs", "shan")) {
						return false;
					}
				},
				prompt: "将一张闪当杀使用或打出",
				check() {
					return 1;
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
					skillTagFilter(player) {
						if (!player.countCards("hs", "shan")) {
							return false;
						}
					},
					order() {
						return get.order({ name: "sha" }) + 0.1;
					},
				},
				sub: true,
			},
			shan: {
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: {
					name: "sha",
				},
				viewAs: {
					name: "shan",
				},
				position: "hs",
				prompt: "将一张杀当闪使用或打出",
				check() {
					return 1;
				},
				viewAsFilter(player) {
					if (!player.countCards("hs", "sha")) {
						return false;
					}
				},
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						if (!player.countCards("hs", "sha")) {
							return false;
						}
					},
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondShan") && current < 0) {
								return 0.6;
							}
						},
					},
				},
				sub: true,
			},
		},
	},
	gzpaoxiao: {
		audio: "paoxiao",
		audioname2: { gz_jun_liubei: "shouyue_paoxiao" },
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			if (_status.currentPhase != player) {
				return false;
			}
			if (event.card.name != "sha") {
				return false;
			}
			var history = player.getHistory("useCard", function (evt) {
				return evt.card.name == "sha";
			});
			return history && history.indexOf(event) == 1;
		},
		forced: true,
		preHidden: true,
		content() {
			player.draw();
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return Infinity;
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (!get.zhu(player, "shouyue")) {
					return false;
				}
				if (arg && arg.name == "sha") {
					return true;
				}
				return false;
			},
		},
	},
	new_kurou: {
		audio: "rekurou",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		check(card) {
			return 8 - get.value(card);
		},
		position: "he",
		content() {
			player.loseHp();
			player.draw(3);
			player.addTempSkill("kurou_effect", "phaseAfter");
		},
		ai: {
			order: 8,
			result: {
				player(player) {
					if (player.hp <= 2) {
						return player.countCards("h") == 0 ? 1 : 0;
					}
					if (player.countCards("h", { name: "sha", color: "red" })) {
						return 1;
					}
					return player.countCards("h") <= player.hp ? 1 : 0;
				},
			},
		},
	},
	kurou_effect: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + 1;
				}
			},
		},
	},
	new_chuli: {
		audio: "chulao",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			for (var i = 0; i < ui.selected.targets.length; i++) {
				if (ui.selected.targets[i].isFriendOf(target)) {
					return false;
				}
			}
			return target.countCards("he") > 0;
		},
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard: true,
		position: "he",
		selectTarget: [1, 3],
		check(card) {
			if (get.suit(card) == "spade") {
				return 8 - get.value(card);
			}
			return 5 - get.value(card);
		},
		contentBefore() {
			var evt = event.getParent();
			evt.draw = [];
			if (get.suit(cards[0]) == "spade") {
				evt.draw.push(player);
			}
		},
		content() {
			"step 0";
			player.discardPlayerCard(target, "he", true);
			"step 1";
			if (result.bool) {
				if (get.suit(result.cards[0]) == "spade") {
					event.getParent().draw.push(target);
				}
			}
		},
		contentAfter() {
			"step 0";
			var list = event.getParent().draw;
			if (!list.length) {
				event.finish();
			} else {
				game.asyncDraw(list);
			}
			"step 1";
			game.delay();
		},
		ai: {
			result: {
				target: -1,
			},
			tag: {
				discard: 1,
				lose: 1,
				loseCard: 1,
			},
			threaten: 1.2,
			order: 3,
		},
	},
	baka_hunshang: {
		skillAnimation: true,
		animationColor: "wood",
		audio: "hunzi",
		preHidden: true,
		derivation: ["baka_yingzi", "baka_yinghun"],
		viceSkill: true,
		init(player) {
			if (player.checkViceSkill("baka_hunshang") && !player.viceChanged) {
				player.removeMaxHp();
			}
		},
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.hp <= 1;
		},
		forced: true,
		locked: false,
		//priority:3,
		content() {
			player.addTempSkills(["baka_yingzi", "baka_yinghun"]);
		},
		ai: {
			threaten(player, target) {
				if (target.hp == 1) {
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
					if (get.tag(card, "damage") == 1 && target.hp == 2 && !target.isTurnedOver() && _status.currentPhase != target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
						return [0.5, 1];
					}
				},
			},
		},
	},
	baka_yinghun: {
		inherit: "yinghun",
		audio: "yinghun_sunce",
	},
	baka_yingzi: {
		mod: {
			maxHandcardBase(player, num) {
				return player.maxHp;
			},
		},
		audio: "reyingzi_sunce",
		trigger: {
			player: "phaseDrawBegin2",
		},
		frequent: true,
		filter(event) {
			return !event.numFixed;
		},
		content() {
			trigger.num++;
		},
		ai: {
			threaten: 1.3,
		},
	},
	gzyiji: {
		audio: "yiji",
		trigger: {
			player: "damageEnd",
		},
		frequent: true,
		preHidden: true,
		content() {
			"step 0";
			event.cards = game.cardsGotoOrdering(get.cards(2)).cards;
			"step 1";
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			event.given_map = {};
			"step 2";
			if (event.cards.length > 1) {
				player.chooseCardButton("遗计：请选择要分配的牌", true, event.cards, [1, event.cards.length]).set("ai", function (button) {
					if (ui.selected.buttons.length == 0) {
						return 1;
					}
					return 0;
				});
			} else if (event.cards.length == 1) {
				event._result = { links: event.cards.slice(0), bool: true };
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				event.cards.removeArray(result.links);
				event.togive = result.links.slice(0);
				player
					.chooseTarget("选择一名角色获得" + get.translation(result.links), true)
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (_status.event.enemy) {
							return -att;
						} else if (att > 0) {
							return att / (1 + target.countCards("h"));
						} else {
							return att / 100;
						}
					})
					.set("enemy", get.value(event.togive[0], player, "raw") < 0);
			}
			"step 4";
			if (result.targets.length) {
				var id = result.targets[0].playerid,
					map = event.given_map;
				if (!map[id]) {
					map[id] = [];
				}
				map[id].addArray(event.togive);
			}
			if (cards.length > 0) {
				event.goto(2);
			}
			"step 5";
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			var list = [];
			for (var i in event.given_map) {
				var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				list.push([source, event.given_map[i]]);
			}
			game.loseAsync({
				gain_list: list,
				giver: player,
				animate: "draw",
			}).setContent("gaincardMultiple");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						var num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) {
								num = 0.7;
							} else {
								num = 0.5;
							}
						}
						if (target.hp >= 4) {
							return [1, num * 2];
						}
						if (target.hp == 3) {
							return [1, num * 1.5];
						}
						if (target.hp == 2) {
							return [1, num * 0.5];
						}
					}
				},
			},
		},
	},
	gzjieming: {
		audio: "jieming",
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("gzjieming"), "令一名角色将手牌补至X张（X为其体力上限且至多为5）", function (card, player, target) {
					return true; //target.countCards('h')<Math.min(target.maxHp,5);
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (att > 2) {
						return Math.max(0, Math.min(5, target.maxHp) - target.countCards("h"));
					}
					return att / 3;
				})
				.setHiddenSkill("gzjieming");
			"step 1";
			if (result.bool) {
				player.logSkill("gzjieming", result.targets);
				for (var i = 0; i < result.targets.length; i++) {
					var num = Math.min(5, result.targets[i].maxHp) - result.targets[i].countCards("h");
					if (num > 0) {
						result.targets[i].draw(num);
					}
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && target.hp > 1) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						var max = 0;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) > 0) {
								max = Math.max(Math.min(5, players[i].hp) - players[i].countCards("h"), max);
							}
						}
						switch (max) {
							case 0:
								return 2;
							case 1:
								return 1.5;
							case 2:
								return [1, 2];
							default:
								return [0, max];
						}
					}
					if ((card.name == "tao" || card.name == "caoyao") && target.hp > 1 && target.countCards("h") <= target.hp) {
						return [0, 0];
					}
				},
			},
		},
	},
	gzfangzhu: {
		audio: "fangzhu",
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("gzfangzhu"), function (card, player, target) {
					return player != target;
				})
				.setHiddenSkill("gzfangzhu").ai = function (target) {
				if (target.hasSkillTag("noturn")) {
					return 0;
				}
				var player = _status.event.player,
					att = get.attitude(player, target);
				if (att == 0) {
					return 0;
				}
				if (att > 0) {
					if (target.isTurnedOver()) {
						return 1000 - target.countCards("h");
					}
					return -1;
				} else {
					if (target.isTurnedOver()) {
						return -1;
					}
					if (player.getDamagedHp() >= 3) {
						return -1;
					}
					return target.countCards("h") + 1;
				}
			};
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("gzfangzhu", target);
				var num = player.getDamagedHp();
				if (num > 0) {
					target.chooseToDiscard("he", num, "放逐：弃置" + get.cnNumber(num) + "张牌并失去1点体力", "或者点击“取消”不弃牌，改为摸" + get.cnNumber(num) + "张牌并叠置").set("ai", function (card) {
						var player = _status.event.player;
						if (player.isTurnedOver()) {
							return -1;
						}
						return player.hp * player.hp - Math.max(1, get.value(card));
					});
				} else {
					target.turnOver();
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				target.loseHp();
			} else {
				target.draw(player.getDamagedHp());
				target.turnOver();
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (target.hp <= 1) {
							return;
						}
						if (!target.hasFriend()) {
							return;
						}
						var hastarget = false;
						var turnfriend = false;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) < 0 && !players[i].isTurnedOver()) {
								hastarget = true;
							}
							if (get.attitude(target, players[i]) > 0 && players[i].isTurnedOver()) {
								hastarget = true;
								turnfriend = true;
							}
						}
						if (get.attitude(player, target) > 0 && !hastarget) {
							return;
						}
						if (turnfriend || target.hp == target.maxHp) {
							return [0.5, 1];
						}
						if (target.hp > 1) {
							return [1, 0.5];
						}
					}
				},
			},
		},
	},
	fengyin_main: {
		init(player, skill) {
			player.addSkillBlocker(skill);
		},
		onremove(player, skill) {
			player.removeSkillBlocker(skill);
		},
		charlotte: true,
		skillBlocker(skill, player) {
			return lib.character[player.name1][3].includes(skill) && !lib.skill[skill].charlotte && !get.is.locked(skill, player);
		},
		mark: true,
		marktext: "主",
		intro: {
			content(storage, player, skill) {
				var list = player.getSkills(null, null, false).filter(function (i) {
					return lib.skill.fengyin_main.skillBlocker(i, player);
				});
				if (list.length) {
					return "失效技能：" + get.translation(list);
				}
				return "无失效技能";
			},
		},
	},
	fengyin_vice: {
		init(player, skill) {
			player.addSkillBlocker(skill);
		},
		onremove(player, skill) {
			player.removeSkillBlocker(skill);
		},
		charlotte: true,
		skillBlocker(skill, player) {
			return lib.character[player.name2][3].includes(skill) && !lib.skill[skill].charlotte && !get.is.locked(skill, player);
		},
		mark: true,
		marktext: "副",
		intro: {
			content(storage, player, skill) {
				var list = player.getSkills(null, null, false).filter(function (i) {
					return lib.skill.fengyin_vice.skillBlocker(i, player);
				});
				if (list.length) {
					return "失效技能：" + get.translation(list);
				}
				return "无失效技能";
			},
		},
	},
	new_tieji: {
		audio: "retieji",
		audioname2: { gz_jun_liubei: "shouyue_tieji" },
		trigger: {
			player: "useCardToPlayered",
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		filter(event) {
			return event.card.name == "sha";
		},
		logTarget: "target",
		content() {
			"step 0";
			var target = trigger.target;
			var controls = [];
			if (get.zhu(player, "shouyue")) {
				if (!target.isUnseen(0)) {
					target.addTempSkill("fengyin_main");
				}
				if (!target.isUnseen(1)) {
					target.addTempSkill("fengyin_vice");
				}
				event.goto(2);
			}
			if (!target.isUnseen(0) && !target.hasSkill("fengyin_main")) {
				controls.push("主将");
			}
			if (!target.isUnseen(1) && !target.hasSkill("fengyin_vice")) {
				controls.push("副将");
			}
			if (controls.length > 0) {
				if (controls.length == 1) {
					event._result = { control: controls[0] };
				} else {
					player
						.chooseControl(controls)
						.set("ai", function () {
							var choice = "主将";
							var skills = lib.character[target.name2][3];
							for (var i = 0; i < skills.length; i++) {
								var info = get.info(skills[i]);
								if (info && info.ai && info.ai.maixie) {
									choice = "副将";
									break;
								}
							}
							return choice;
						})
						.set("prompt", "请选择一个武将牌，令" + get.translation(target) + "该武将牌上的非锁定技全部失效。");
				}
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.control) {
				player.popup(result.control, "fire");
				var target = trigger.target;
				if (result.control == "主将") {
					target.addTempSkill("fengyin_main");
				} else {
					target.addTempSkill("fengyin_vice");
				}
			}
			"step 2";
			player.judge(function () {
				return 0;
			});
			"step 3";
			var suit = get.suit(result.card);
			var target = trigger.target;
			var num = target.countCards("h", "shan");
			target
				.chooseToDiscard("请弃置一张" + get.translation(suit) + "牌，否则不能使用闪抵消此杀", "he", function (card) {
					return get.suit(card) == _status.event.suit;
				})
				.set("ai", function (card) {
					var num = _status.event.num;
					if (num == 0) {
						return 0;
					}
					if (card.name == "shan") {
						return num > 1 ? 2 : 0;
					}
					return 8 - get.value(card);
				})
				.set("num", num)
				.set("suit", suit);
			"step 4";
			if (result && !result.bool) {
				trigger.getParent().directHit.add(trigger.target);
			}
		},
	},
	hmkyuanyu: {
		audio: "zongkui",
		trigger: {
			player: "damageBegin4",
		},
		forced: true,
		preHidden: true,
		check(event, player) {
			return true;
		},
		filter(event, player) {
			if (event.num <= 0 || !event.source) {
				return false;
			}
			var n1 = player.getNext();
			var p1 = player.getPrevious();
			if (event.source != n1 && event.source != p1) {
				return true;
			}
		},
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (player == target.getNext() || player == target.getPrevious()) {
						return;
					}
					if (get.tag(card, "damage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	hmkguishu: {
		audio: "bmcanshi",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("hs", { suit: "spade" }) > 0;
		},
		init(player) {
			if (!player.storage.hmkguishu) {
				player.storage.hmkguishu = 0;
			}
		},
		chooseButton: {
			dialog(event, player) {
				var list = ["yuanjiao", "zhibi"];
				for (var i = 0; i < list.length; i++) {
					list[i] = ["锦囊", "", list[i]];
				}
				return ui.create.dialog("鬼术", [list, "vcard"]);
			},
			filter(button, player) {
				var name = button.link[2];
				if (player.storage.hmkguishu == 1 && name == "yuanjiao") {
					return false;
				}
				if (player.storage.hmkguishu == 2 && name == "zhibi") {
					return false;
				}
				return lib.filter.filterCard({ name: name }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				if (button.link == "yuanjiao") {
					return 3;
				}
				if (button.link == "zhibi") {
					if (player.countCards("hs", { suit: "spade" }) > 2) {
						return 1;
					}
					return 0;
				}
			},
			backup(links, player) {
				return {
					audio: "bmcanshi",
					filterCard(card, player) {
						return get.suit(card) == "spade";
					},
					position: "hs",
					selectCard: 1,
					popname: true,
					ai(card) {
						return 6 - get.value(card);
					},
					viewAs: { name: links[0][2] },
					onuse(result, player) {
						player.logSkill("hmkguishu");
						if (result.card.name == "yuanjiao") {
							player.storage.hmkguishu = 1;
						} else {
							player.storage.hmkguishu = 2;
						}
					},
				};
			},
			prompt(links, player) {
				return "将一张手牌当作" + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 4,
			result: {
				player(player) {
					return 2;
				},
			},
			threaten: 1.6,
		},
	},
	_mingzhisuodingji: {
		mode: ["guozhan"],
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasSkillTag("nomingzhi", false, null, true)) {
				return false;
			}
			var bool = false;
			var skillm = lib.character[player.name1][3];
			var skillv = lib.character[player.name2][3];
			if (player.isUnseen(0)) {
				for (var i = 0; i < skillm.length; i++) {
					if (get.is.locked(skillm[i])) {
						bool = true;
					}
				}
			}
			if (player.isUnseen(1)) {
				for (var i = 0; i < skillv.length; i++) {
					if (get.is.locked(skillv[i])) {
						bool = true;
					}
				}
			}
			return bool;
		},
		popup: false,
		content() {
			"step 0";
			var choice = [];
			var skillm = lib.character[player.name1][3];
			var skillv = lib.character[player.name2][3];
			if (player.isUnseen(0)) {
				for (var i = 0; i < skillm.length; i++) {
					if (get.is.locked(skillm[i]) && !choice.includes("明置主将")) {
						choice.push("明置主将");
					}
				}
			}
			if (player.isUnseen(1)) {
				for (var i = 0; i < skillv.length; i++) {
					if (get.is.locked(skillv[i]) && !choice.includes("明置副将")) {
						choice.push("明置副将");
					}
				}
			}
			if (choice.length == 2) {
				choice.push("全部明置");
			}
			player.chooseControl(choice);
			"step 1";
			if (result.control) {
				switch (result.control) {
					case "取消":
						break;
					case "明置主将":
						player.showCharacter(0);
						break;
					case "明置副将":
						player.showCharacter(1);
						break;
					case "全部明置":
						player.showCharacter(2);
						break;
				}
			}
		},
		ai: {
			order: 11,
			result: {
				player: -99,
			},
		},
	},
	/*----分界线----*/
	_viewnext: {
		trigger: {
			global: "gameDrawBefore",
		},
		silent: true,
		popup: false,
		forced: true,
		filter() {
			if (_status.connectMode && !lib.configOL.viewnext) {
				return false;
			} else if (!_status.connectMode && !get.config("viewnext")) {
				return false;
			}
			return game.players.length > 1;
		},
		content() {
			var target = player.getNext();
			player.viewCharacter(target, 1);
		},
	},
	_aozhan_judge: {
		trigger: {
			player: "phaseBefore",
		},
		forced: true,
		priority: 22,
		filter(event, player) {
			if (get.mode() != "guozhan") {
				return false;
			}
			if (_status.connectMode && !lib.configOL.aozhan) {
				return false;
			} else if (!_status.connectMode && !get.config("aozhan")) {
				return false;
			}
			if (_status._aozhan) {
				return false;
			}
			if (game.players.length > 4) {
				return false;
			}
			if (game.players.length > 3 && game.players.length + game.dead.length <= 7) {
				return false;
			}
			for (var i = 0; i < game.players.length; i++) {
				for (var j = i + 1; j < game.players.length; j++) {
					if (game.players[i].isFriendOf(game.players[j])) {
						return false;
					}
				}
			}
			return true;
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
						var list = ["当游戏中仅剩四名或更少角色时（七人以下游戏时改为三名或更少），若此时全场没有超过一名势力相同的角色，则从一个新的回合开始，游戏进入鏖战模式直至游戏结束。", "在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。", "进入鏖战模式后，即使之后有两名或者更多势力相同的角色出现，仍然不会取消鏖战模式。"];
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
				lib.init.sheet(`
					.card[data-card-name = "tao"]>.image {
						background-image: url(${lib.assetURL}image/card/gz_aozhantao.png) !important;
					}
				`);
			});
			game.addGlobalSkill("aozhan");
		},
	},
	_guozhan_marks: {
		ruleSkill: true,
		enable: "phaseUse",
		filter(event, player) {
			return ["yexinjia", "xianqu", "yinyang", "zhulianbihe"].some(mark => player.hasMark(`${mark}_mark`));
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###国战标记###弃置一枚对应的标记，发动其对应的效果");
			},
			chooseControl(event, player) {
				const list = [],
					bool = player.hasMark("yexinjia_mark");
				if (bool || player.hasMark("xianqu_mark")) {
					list.push("先驱");
				}
				if (bool || player.hasMark("zhulianbihe_mark")) {
					list.push("珠联(摸牌)");
					if (event.filterCard({ name: "tao", isCard: true }, player, event)) {
						list.push("珠联(桃)");
					}
				}
				if (bool || player.hasMark("yinyang_mark")) {
					list.push("阴阳鱼");
				}
				list.push("cancel2");
				return list;
			},
			check() {
				const player = get.player(),
					bool = player.hasMark("yexinjia_mark"),
					evt = get.event().getParent();
				if ((bool || player.hasMark("xianqu_mark")) && !player.hasSkillTag("keepXianqu", false, null, true) && 4 - player.countCards("h") > 1) {
					return "先驱";
				}
				if (bool || player.hasMark("zhulianbihe_mark")) {
					if (evt.filterCard({ name: "tao", isCard: true }, player, evt) && get.effect_use(player, { name: "tao" }, player) > 0) {
						return "珠联(桃)";
					}
					if (
						player.getHandcardLimit() - player.countCards("h") > 1 &&
						!game.hasPlayer(function (current) {
							return current != player && current.isFriendOf(player) && current.hp + current.countCards("h", "shan") <= 2;
						})
					) {
						return "珠联(摸牌)";
					}
				}
				if (player.hasMark("yinyang_mark") && player.getHandcardLimit() - player.countCards("h") > 0) {
					return "阴阳鱼";
				}
				return "cancel2";
			},
			backup(result, player) {
				switch (result.control) {
					case "珠联(桃)":
						return get.copy(lib.skill._zhulianbihe_mark_tao);
					case "珠联(摸牌)":
						return {
							async content(event, trigger, player) {
								await player.draw(2);
								player.removeMark(player.hasMark("zhulianbihe_mark") ? "zhulianbihe_mark" : "yexinjia_mark", 1);
							},
						};
					case "阴阳鱼":
						return {
							async content(event, trigger, player) {
								await player.draw();
								player.removeMark(player.hasMark("yinyang_mark") ? "yinyang_mark" : "yexinjia_mark", 1);
							},
						};
					case "先驱":
						return { content: lib.skill.xianqu_mark.content };
				}
			},
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	xianqu_mark: {
		intro: { content: "◇出牌阶段，你可以弃置此标记，然后将手牌摸至四张并观看一名其他角色的一张武将牌。" },
		async content(event, trigger, player) {
			player.removeMark(player.hasMark("xianqu_mark") ? "xianqu_mark" : "yexinjia_mark", 1);
			await player.drawTo(4);
			if (
				game.hasPlayer(current => {
					return current != player && current.isUnseen(2);
				})
			) {
				let result = await player
					.chooseTarget("是否观看一名其他角色的一张暗置武将牌？", (card, player, target) => {
						return target != player && target.isUnseen(2);
					})
					.set("ai", target => {
						const player = get.player();
						if (target.isUnseen()) {
							const next = player.getNext();
							if (target != next) {
								return 10;
							}
							return 9;
						}
						return -get.attitude(player, target);
					})
					.forResult();
				if (result?.bool && result?.targets?.length) {
					const [target] = result.targets;
					const controls = [];
					if (target.isUnseen(0)) {
						controls.push("主将");
					}
					if (target.isUnseen(1)) {
						controls.push("副将");
					}
					if (!controls.length) {
						return;
					}
					player.line(target, "green");
					result = controls.length == 1 ? { control: controls[0] } : await player.chooseControl(controls).forResult();
					if (!result?.control) {
						return;
					}
					await player.viewCharacter(target, result.control == "主将" ? 0 : 1);
				} else {
					player.removeSkill("xianqu_mark");
				}
			}
		},
	},
	zhulianbihe_mark: {
		intro: { content: "◇出牌阶段，你可以弃置此标记，然后摸两张牌。<br>◇你可以将此标记当做【桃】使用。" },
	},
	yinyang_mark: {
		intro: { content: "◇出牌阶段，你可以弃置此标记，然后摸一张牌。<br>◇弃牌阶段，你可以弃置此标记，然后本回合手牌上限+2。" },
	},
	_zhulianbihe_mark_tao: {
		ruleSkill: true,
		enable: "chooseToUse",
		viewAsFilter(player) {
			return ["yexinjia_mark", "zhulianbihe_mark"].some(mark => player.hasMark(mark));
		},
		viewAs: {
			name: "tao",
			isCard: true,
		},
		filterCard: () => false,
		selectCard: -1,
		async precontent(event, trigger, player) {
			player.removeMark(player.hasMark("zhulianbihe_mark") ? "zhulianbihe_mark" : "yexinjia_mark", 1);
		},
	},
	_yinyang_mark_add: {
		ruleSkill: true,
		trigger: { player: "phaseDiscardBegin" },
		filter(event, player) {
			return ["yexinjia_mark", "yinyang_mark"].some(mark => player.hasMark(mark)) && player.needsToDiscard();
		},
		prompt(event, player) {
			return `是否弃置一枚【${player.hasMark("yinyang_mark") ? "阴阳鱼" : "野心家"}】标记，使本回合的手牌上限+2？`;
		},
		async content(event, trigger, player) {
			player.addTempSkill("yinyang_add", "phaseAfter");
			player.removeMark(player.hasMark("yinyang_mark") ? "yinyang_mark" : "yexinjia_mark", 1);
		},
	},
	yinyang_add: {
		charlotte: true,
		mod: {
			maxHandcard(player, num) {
				return num + 2;
			},
		},
	},
	yexinjia_mark: {
		intro: {
			content: "◇你可以弃置此标记，并发动【先驱】标记或【珠联璧合】标记或【阴阳鱼】标记的效果。",
		},
	},
	yexinjia_friend: {
		marktext: "盟",
		intro: {
			name: "结盟",
			content: "已经与$结成联盟",
		},
	},
	/*----分界线----*/
	_lianheng: {
		mode: ["guozhan"],
		enable: "phaseUse",
		usable: 1,
		prompt: "将至多三张可合纵的牌交给一名与你势力不同的角色，或未确定势力的角色，若你交给与你势力不同的角色，则你摸等量的牌",
		filter(event, player) {
			return player.hasCard(function (card) {
				return card.hasTag("lianheng") || card.hasGaintag("_lianheng");
			}, "h");
		},
		filterCard(card) {
			if (get.itemtype(card) != "card") {
				return false;
			}
			return card.hasTag("lianheng") || card.hasGaintag("_lianheng");
		},
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			if (player.isUnseen()) {
				return target.isUnseen();
			}
			return !target.isFriendOf(player);
		},
		check(card) {
			if (card.name == "tao") {
				return 0;
			}
			return 7 - get.value(card);
		},
		selectCard: [1, 3],
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			player.give(cards, target);
			"step 1";
			if (!target.isUnseen()) {
				player.draw(cards.length);
			}
		},
		ai: {
			basic: {
				order: 8,
			},
			result: {
				player(player, target) {
					var huoshao = false;
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (ui.selected.cards[i].name == "huoshaolianying") {
							huoshao = true;
							break;
						}
					}
					if (huoshao && player.inline(target.getNext())) {
						return -3;
					}
					if (target.isUnseen()) {
						return 0;
					}
					if (player.isMajor()) {
						return 0;
					}
					if (!player.isMajor() && huoshao && player.getNext().isMajor()) {
						return -2;
					}
					if (!player.isMajor() && huoshao && player.getNext().isMajor() && player.getNext().getNext().isMajor()) {
						return -3;
					}
					if (!player.isMajor() && huoshao && !target.isMajor() && target.getNext().isMajor() && target.getNext().getNext().isMajor()) {
						return 3;
					}
					if (!player.isMajor() && huoshao && !target.isMajor() && target.getNext().isMajor()) {
						return 1.5;
					}
					return 1;
				},
				target(player, target) {
					if (target.isUnseen()) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	qianhuan: {
		group: ["qianhuan_add", "qianhuan_use"],
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
		ai: {
			threaten: 1.8,
		},
		audio: 2,
		preHidden: true,
		subSkill: {
			add: {
				trigger: { global: "damageEnd" },
				filter(event, player) {
					var suits = [],
						cards = player.getExpansions("qianhuan");
					for (var i = 0; i < cards.length; i++) {
						suits.add(get.suit(cards[i]));
					}
					if (suits.length >= lib.suit.length) {
						return false;
					}
					return (
						player.isFriendOf(event.player) &&
						player.hasCard(function (card) {
							if (_status.connectMode && get.position(card) == "h") {
								return true;
							}
							return !suits.includes(get.suit(card));
						}, "he")
					);
				},
				direct: true,
				content() {
					"step 0";
					var suits = [],
						cards = player.getExpansions("qianhuan");
					for (var i = 0; i < cards.length; i++) {
						suits.add(get.suit(cards[i]));
					}
					player
						.chooseCard("he", get.prompt2("qianhuan"), function (card) {
							return !_status.event.suits.includes(get.suit(card));
						})
						.set("ai", function (card) {
							return 9 - get.value(card);
						})
						.set("suits", suits)
						.setHiddenSkill("qianhuan");
					"step 1";
					if (result.bool) {
						player.logSkill("qianhuan");
						var card = result.cards[0];
						player.addToExpansion(card, player, "give").gaintag.add("qianhuan");
					}
				},
			},
			use: {
				trigger: { global: "useCardToTarget" },
				filter(event, player) {
					if (!["basic", "trick"].includes(get.type(event.card, "trick"))) {
						return false;
					}
					return event.target && player.isFriendOf(event.target) && event.targets.length == 1 && player.getExpansions("qianhuan").length;
				},
				direct: true,
				content() {
					"step 0";
					var goon = get.effect(trigger.target, trigger.card, trigger.player, player) < 0;
					if (goon) {
						if (["tiesuo", "diaohulishan", "lianjunshengyan", "zhibi", "chiling", "lulitongxin"].includes(trigger.card.name)) {
							goon = false;
						} else if (trigger.card.name == "sha") {
							if (trigger.target.mayHaveShan(player, "use") || trigger.target.hp >= 3) {
								goon = false;
							}
						} else if (trigger.card.name == "guohe") {
							if (trigger.target.countCards("he") >= 3 || !trigger.target.countCards("h")) {
								goon = false;
							}
						} else if (trigger.card.name == "shuiyanqijunx") {
							if (trigger.target.countCards("e") <= 1 || trigger.target.hp >= 3) {
								goon = false;
							}
						} else if (get.tag(trigger.card, "damage") && trigger.target.hp >= 3) {
							goon = false;
						}
					}
					player
						.chooseButton()
						.set("goon", goon)
						.set("ai", function (button) {
							if (_status.event.goon) {
								return 1;
							}
							return 0;
						})
						.set("createDialog", [get.prompt("qianhuan"), '<div class="text center">移去一张“千幻”牌令' + get.translation(trigger.player) + "对" + get.translation(trigger.target) + "的" + get.translation(trigger.card) + "失效</div>", player.getExpansions("qianhuan")]);
					"step 1";
					if (result.bool) {
						player.logSkill("qianhuan", trigger.player);
						trigger.getParent().targets.remove(trigger.target);
						var card = result.links[0];
						player.loseToDiscardpile(card);
					}
				},
			},
		},
	},
	gzsanyao: {
		audio: "sanyao",
		inherit: "sanyao",
		filterTarget(card, player, target) {
			return target.hp > player.hp || target.countCards("h") > player.countCards("h");
		},
	},
	gzzhiman: {
		audio: "zhiman",
		inherit: "zhiman",
		preHidden: true,
		content() {
			"step 0";
			if (trigger.player.countGainableCards(player, "ej")) {
				player.gainPlayerCard(trigger.player, "ej", true);
			}
			trigger.cancel();
			"step 1";
			if (player.isFriendOf(trigger.player)) {
				trigger.player.mayChangeVice();
			}
		},
	},
	gzdiancai: {
		audio: "diancai",
		trigger: {
			global: "phaseUseEnd",
		},
		filter(event, player) {
			if (_status.currentPhase === player) {
				return false;
			}

			let num = 0;

			player.getHistory("lose", evt => {
				if (evt.cards2 && evt.getParent("phaseUse") === event) {
					num += evt.cards2.length;
				}
			});

			return num >= player.hp;
		},
		preHidden: true,
		async content(event, trigger, player) {
			const num = player.maxHp - player.countCards("h");
			if (num > 0) {
				await player.draw(num);
			}

			await player.mayChangeVice();
		},
	},
	xuanlve: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		preHidden: true,
		filter(event, player) {
			var evt = event.getl(player);
			return evt && evt.es && evt.es.length > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "弃置一名其他角色的一张牌", (card, player, target) => {
					return target != player && target.countDiscardableCards(player, "he");
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discardPlayerCard(event.targets[0], "he", true);
		},
		ai: {
			noe: true,
			reverseEquip: true,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "equip") {
						return [1, 1];
					}
				},
			},
		},
	},
	lianzi: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		derivation: "gz_zhiheng",
		filterCard: true,
		check(card) {
			if (get.type(card) == "equip") {
				return 0;
			}
			var player = _status.event.player;
			var num =
				game.countPlayer(function (current) {
					if (current.identity == "wu") {
						return current.countCards("e");
					}
				}) + player.getExpansions("yuanjiangfenghuotu").length;
			if (num >= 5) {
				return 8 - get.value(card);
			}
			if (num >= 3) {
				return 7 - get.value(card);
			}
			if (num >= 2) {
				return 3 - get.value(card);
			}
			return 0;
		},
		content() {
			"step 0";
			var num =
				game.countPlayer(function (current) {
					if (current.identity == "wu") {
						return current.countCards("e");
					}
				}) + player.getExpansions("yuanjiangfenghuotu").length;
			if (num) {
				event.shown = get.cards(num);
				player.showCards(event.shown, get.translation("lianzi"));
			} else {
				event.finish();
				return;
			}
			"step 1";
			var list = [];
			var discards = [];
			var type = get.type(cards[0], "trick");
			for (var i = 0; i < event.shown.length; i++) {
				if (get.type(event.shown[i], "trick") == type) {
					list.push(event.shown[i]);
				} else {
					discards.push(event.shown[i]);
				}
			}
			game.cardsDiscard(discards);
			if (list.length) {
				player.gain(list, "gain2");
				if (list.length >= 3 && player.hasStockSkill("lianzi")) {
					player.changeSkills(["gz_zhiheng"], ["lianzi"]);
				}
			}
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	jubao: {
		mod: {
			canBeGained(card, source, player) {
				if (source != player && get.position(card) == "e" && get.subtype(card) == "equip5") {
					return false;
				}
			},
		},
		trigger: { player: "phaseJieshuBegin" },
		audio: 2,
		derivation: "dinglanyemingzhu",
		forced: true,
		unique: true,
		filter(event, player) {
			if (
				game.hasPlayer(function (current) {
					return current.countCards("ej", function (card) {
						return card.name == "dinglanyemingzhu";
					});
				})
			) {
				return true;
			}
			for (var i = 0; i < ui.discardPile.childElementCount; i++) {
				if (ui.discardPile.childNodes[i].name == "dinglanyemingzhu") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			var target = game.findPlayer(function (current) {
				return current != player && current.countCards("e", "dinglanyemingzhu");
			});
			if (target && target.countGainableCards(player, "he")) {
				player.line(target, "green");
				player.gainPlayerCard(target, true);
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	jiahe: {
		audio: true,
		unique: true,
		forceunique: true,
		lordSkill: true,
		mark: true,
		derivation: ["yuanjiangfenghuotu", "jiahe_reyingzi", "jiahe_haoshi", "jiahe_shelie", "jiahe_duoshi"],
		global: ["yuanjiangfenghuotu", "jiahe_damage", "jiahe_put", "jiahe_skill"],
		init(player) {
			player.markSkill("yuanjiangfenghuotu");
		},
	},
	jiahe_damage: {
		audio: ["yuanjiangfenghuotu3.mp3", "yuanjiangfenghuotu4.mp3"],
		forceaudio: true,
		ai: {
			threaten: 2,
		},
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.card && (event.card.name == "sha" || get.type(event.card, "trick") == "trick") && player.getExpansions("yuanjiangfenghuotu").length > 0;
		},
		content() {
			"step 0";
			player.chooseCardButton("将一张“烽火”置入弃牌堆", player.getExpansions("yuanjiangfenghuotu"), true);
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				player.loseToDiscardpile(card);
			}
		},
	},
	jiahe_put: {
		enable: "phaseUse",
		audio: ["yuanjiangfenghuotu", 2],
		forceaudio: true,
		filter(event, player) {
			var zhu = get.zhu(player, "jiahe");
			if (zhu) {
				return player.countCards("he", { type: "equip" }) > 0;
			}
			return false;
		},
		filterCard: { type: "equip" },
		position: "he",
		usable: 1,
		check(card) {
			var zhu = get.zhu(_status.event.player, "jiahe");
			if (!zhu) {
				return 0;
			}
			var num = 7 - get.value(card);
			if (get.position(card) == "h") {
				if (zhu.getExpansions("huangjintianbingfu").length >= 5) {
					return num - 3;
				}
				return num + 3;
			} else {
				var player = _status.event.player;
				var zhu = get.zhu(player, "jiahe");
				var sub = get.subtype(card);
				if (
					player.countCards("h", function (card) {
						return get.type(card) == "equip" && get.subtype(card) == "sub" && player.hasValueTarget(card);
					})
				) {
					return num + 4;
				}
				if (zhu.getExpansions("yuanjiangfenghuotu").length >= 5 && !player.hasSkillTag("noe")) {
					return num - 5;
				}
			}
			return num;
		},
		discard: false,
		lose: false,
		delay: false,
		prepare(cards, player) {
			var zhu = get.zhu(player, "jiahe");
			player.line(zhu);
		},
		content() {
			var zhu = get.zhu(player, "jiahe");
			zhu.addToExpansion(cards, player, "give").gaintag.add("yuanjiangfenghuotu");
		},
		ai: {
			order(item, player) {
				if (
					player.hasSkillTag("noe") ||
					!player.countCards("h", function (card) {
						return get.type(card) == "equip" && !player.canEquip(card) && player.hasValueTarget(card);
					})
				) {
					return 1;
				}
				return 10;
			},
			result: {
				player: 1,
			},
		},
	},
	jiahe_skill: {
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		audio: "jiahe_put",
		forceaudio: true,
		filter(event, player) {
			var zhu = get.zhu(player, "jiahe");
			if (zhu && zhu.getExpansions("yuanjiangfenghuotu").length) {
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			var zhu = get.zhu(player, "jiahe");
			event.num = zhu.getExpansions("yuanjiangfenghuotu").length;
			"step 1";
			var list = [];
			if (event.num >= 1 && !(player.hasSkill("reyingzi") || player.hasSkill("jiahe_reyingzi"))) {
				list.push("reyingzi");
			}
			if (event.num >= 2 && !(player.hasSkill("haoshi") || player.hasSkill("jiahe_haoshi"))) {
				list.push("haoshi");
			}
			if (event.num >= 3 && !(player.hasSkill("shelie") || player.hasSkill("jiahe_shelie"))) {
				list.push("shelie");
			}
			if (event.num >= 4 && !(player.hasSkill("gz_duoshi") || player.hasSkill("jiahe_duoshi"))) {
				list.push("gz_duoshi");
			}
			if (!list.length) {
				event.finish();
				return;
			}
			var prompt2 = "你可以获得下列一项技能直到回合结束";
			if (list.length >= 5) {
				if (event.done) {
					prompt2 += " (2/2)";
				} else {
					prompt2 += " (1/2)";
				}
			}
			list.push("cancel2");
			player
				.chooseControl(list)
				.set("prompt", get.translation("yuanjiangfenghuotu"))
				.set("prompt2", prompt2)
				.set("centerprompt2", true)
				.set("ai", function (evt, player) {
					var controls = _status.event.controls;
					if (controls.includes("haoshi")) {
						var nh = player.countCards("h");
						if (player.hasSkill("reyingzi")) {
							if (nh == 0) {
								return "haoshi";
							}
						} else {
							if (nh <= 1) {
								return "haoshi";
							}
						}
					}
					if (controls.includes("shelie")) {
						return "shelie";
					}
					if (controls.includes("reyingzi")) {
						return "reyingzi";
					}
					if (controls.includes("gz_duoshi")) {
						return "gz_duoshi";
					}
					return controls.randomGet();
				});
			"step 2";
			if (result.control != "cancel2") {
				var map = {
					reyingzi: "jiahe_reyingzi",
					haoshi: "jiahe_haoshi",
					shelie: "jiahe_shelie",
					gz_duoshi: "jiahe_duoshi",
				};
				var skills = map[result.control];
				player.addTempSkills(skills);

				/* 语音修复
						if (skills == "gz_duoshi") {
							game.broadcastAll(function (player) {
								let info = lib.skill["gz_duoshi"];
								if (!info.audioname2) info.audioname2 = {};
								info.audioname2[player.name1] = "jiahe_duoshi";
								info.audioname2[player.name2] = "jiahe_duoshi";
								let subSkillInfo = info?.subSkill?.global;
								if (subSkillInfo) {
									if (!subSkillInfo.audioname2) subSkillInfo.audioname2 = {};
									subSkillInfo.audioname2[player.name1] = "jiahe_duoshi";
									subSkillInfo.audioname2[player.name2] = "jiahe_duoshi";
								}
							}, player);
						}*/

				if (!event.done) {
					player.logSkill("jiahe_put");
				}
				// game.log(player,'获得了技能','【'+get.translation(skill)+'】');
				if (event.num >= 5 && !event.done) {
					event.done = true;
					event.goto(1);
				}
			}
		},
	},
	jiahe_reyingzi: {
		audio: 2,
		inherit: "reyingzi",
	},
	jiahe_haoshi: {
		audio: 2,
		inherit: "haoshi",
	},
	jiahe_shelie: {
		audio: 2,
		inherit: "shelie",
	},
	jiahe_duoshi: {
		audio: 2,
		inherit: "gz_duoshi",
	},
	yuanjiangfenghuotu: {
		audio: 4,
		unique: true,
		forceunique: true,
		nopop: true,
		mark: true,
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("yuanjiangfenghuotu");
				if (content && content.length) {
					dialog.addSmall(content);
				}
				dialog.addText('<ul style="margin-top:5px;padding-left:22px;"><li>每名吴势力角色的出牌阶段限一次，该角色可以将一张装备牌置于“缘江烽火图”上，称之为“烽火”。<li>根据“烽火”的数量，所有吴势力角色可于其准备阶段选择并获得其中一个技能直到回合结束：一张及以上~英姿；两张及以上~好施；三张及以上~涉猎；四张及以上~度势；五张及以上~可额外选择一项。<li>锁定技，当你受到【杀】或锦囊牌造成的伤害后，你将一张“烽火”置入弃牌堆。', false);
			},
		},
	},
	gzqice: {
		enable: "phaseUse",
		usable: 1,
		audio: "qice",
		filter(event, player) {
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var i = 0; i < hs.length; i++) {
				var mod2 = game.checkMod(hs[i], player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) {
					return false;
				}
			}
			return true;
		},
		group: "gzqice_change",
		subSkill: {
			change: {
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return event.skill == "gzqice_backup";
				},
				silent: true,
				content() {
					player.mayChangeVice();
					event.skill = "gzqice";
					event.trigger("skillAfter");
				},
			},
		},
		chooseButton: {
			dialog() {
				var list = lib.inpile;
				var list2 = [];
				for (var i = 0; i < list.length; i++) {
					if (list[i] != "wuxie" && get.type(list[i]) == "trick") {
						list2.push(["锦囊", "", list[i]]);
					}
				}
				return ui.create.dialog(get.translation("gzqice"), [list2, "vcard"]);
			},
			filter(button, player) {
				var card = { name: button.link[2] };
				var info = get.info(card);
				var num = player.countCards("h");
				//if(get.tag(card,'multitarget')&&get.select(info.selectTarget)[1]==-1){
				if (get.select(info.selectTarget)[1] == -1) {
					if (
						game.countPlayer(function (current) {
							return player.canUse(card, current);
						}) > num
					) {
						return false;
					}
				} else if (info.changeTarget) {
					var giveup = true;
					var list = game.filterPlayer(function (current) {
						return player.canUse(card, current);
					});
					for (var i = 0; i < list.length; i++) {
						var targets = [list[i]];
						info.changeTarget(player, targets);
						if (targets.length <= num) {
							giveup = false;
							break;
						}
					}
					if (giveup) {
						return false;
					}
				}
				return lib.filter.filterCard(card, player, _status.event.getParent());
			},
			check(button) {
				if (["chiling", "xietianzi", "tiesuo", "lulitongxin", "diaohulishan", "jiedao"].includes(button.link[2])) {
					return 0;
				}
				return _status.event.player.getUseValue(button.link[2]);
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "qice",
					selectCard: -1,
					position: "h",
					selectTarget() {
						var select = get.select(get.info(get.card()).selectTarget);
						var nh = _status.event.player.countCards("h");
						if (select[1] > nh) {
							select[1] = nh;
						}
						return select;
					},
					filterTarget(card, player, target) {
						var info = get.info(card);
						if (info.changeTarget) {
							var targets = [target];
							info.changeTarget(player, targets);
							if (targets.length > player.countCards("h")) {
								return false;
							}
						}
						return lib.filter.filterTarget(card, player, target);
					},
					popname: true,
					viewAs: { name: links[0][2] },
					ai1() {
						return 1;
					},
				};
			},
			prompt(links, player) {
				return "将全部手牌当作" + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					var num = 0;
					var cards = player.getCards("h");
					if (cards.length >= 3 && player.hp >= 3) {
						return 0;
					}
					for (var i = 0; i < cards.length; i++) {
						num += Math.max(0, get.value(cards[i], player, "raw"));
					}
					return 16 - num;
				},
			},
			threaten: 1.6,
		},
	},
	gzyuejian: {
		trigger: { global: "phaseDiscardBegin" },
		audio: "yuejian",
		preHidden: true,
		filter(event, player) {
			if (player.isFriendOf(event.player)) {
				return (
					event.player.getHistory("useCard", function (evt) {
						if (evt.targets) {
							var targets = evt.targets.slice(0);
							while (targets.includes(event.player)) {
								targets.remove(event.player);
							}
							return targets.length != 0;
						}
						return false;
					}) == 0
				);
			}
			return false;
		},
		content() {
			trigger.player.addTempSkill("gzyuejian_num");
		},
		logTarget: "player",
		forced: true,
		subSkill: {
			num: {
				mod: {
					maxHandcardBase(player, num) {
						return player.maxHp;
					},
				},
			},
		},
	},
	gzxinsheng: {
		trigger: { player: "damageEnd" },
		// frequent:true,
		content() {
			game.log(player, "获得了一张", "#g化身");
			lib.skill.gzhuashen.addCharacter(player, _status.characterlist.randomGet(), true);
			game.delayx();
		},
	},
	gzhuashen: {
		unique: true,
		group: ["gzhuashen_add", "gzhuashen_swap", "gzhuashen_remove", "gzhuashen_disallow", "gzhuashen_flash"],
		init(player) {
			player.storage.gzhuashen = [];
			player.storage.gzhuashen_removing = [];
			player.storage.gzhuashen_trigger = [];
			player.storage.gzhuashen_map = {};
		},
		onremove(player) {
			delete player.storage.gzhuashen;
			delete player.storage.gzhuashen_removing;
			delete player.storage.gzhuashen_trigger;
			delete player.storage.gzhuashen_map;
		},
		ondisable: true,
		mark: true,
		intro: {
			mark(dialog, storage, player) {
				if (storage && storage.length) {
					if (player.isUnderControl(true)) {
						dialog.addSmall([storage, "character"]);
						var skills = [];
						for (var i in player.storage.gzhuashen_map) {
							skills.addArray(player.storage.gzhuashen_map[i]);
						}
						dialog.addText("可用技能：" + (skills.length ? get.translation(skills) : "无"));
					} else {
						return "共有" + get.cnNumber(storage.length) + "张“化身”";
					}
				} else {
					return "没有化身";
				}
			},
			content(storage, player) {
				if (player.isUnderControl(true)) {
					var skills = [];
					for (var i in player.storage.gzhuashen_map) {
						skills.addArray(player.storage.gzhuashen_map[i]);
					}
					return get.translation(storage) + "；可用技能：" + (skills.length ? get.translation(skills) : "无");
				} else {
					return "共有" + get.cnNumber(storage.length) + "张“化身”";
				}
			},
		},
		filterSkill(name) {
			var skills = lib.character[name][3].slice(0);
			for (var i = 0; i < skills.length; i++) {
				var info = lib.skill[skills[i]];
				if (info.unique || info.limited || info.mainSkill || info.viceSkill || get.is.locked(skills[i])) {
					skills.splice(i--, 1);
				}
			}
			return skills;
		},
		addCharacter(player, name, show) {
			var skills = lib.skill.gzhuashen.filterSkill(name);
			if (skills.length) {
				player.storage.gzhuashen_map[name] = skills;
				for (var i = 0; i < skills.length; i++) {
					player.addAdditionalSkill("hidden:gzhuashen", skills[i], true);
				}
			}
			player.storage.gzhuashen.add(name);
			player.updateMarks("gzhuashen");
			_status.characterlist.remove(name);
			if (show) {
				lib.skill.gzhuashen.drawCharacter(player, [name]);
			}
		},
		drawCharacter(player, list) {
			game.broadcastAll(
				function (player, list) {
					if (player.isUnderControl(true)) {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = "huashen_card_" + list[i];
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + list[i],
							};
							lib.translate[cardname] = get.rawName2(list[i]);
							cards.push(game.createCard(cardname, "", ""));
						}
						player.$draw(cards, "nobroadcast");
					}
				},
				player,
				list
			);
		},
		removeCharacter(player, name) {
			var skills = lib.skill.gzhuashen.filterSkill(name);
			if (skills.length) {
				delete player.storage.gzhuashen_map[name];
				for (var i = 0; i < skills.length; i++) {
					var remove = true;
					for (var j in player.storage.gzhuashen_map) {
						if (j != name && game.expandSkills(player.storage.gzhuashen_map[j].slice(0)).includes(skills[i])) {
							remove = false;
							break;
						}
					}
					if (remove) {
						player.removeAdditionalSkill("hidden:gzhuashen", skills[i]);
						player.storage.gzhuashen_removing.remove(skills[i]);
					}
				}
			}
			player.storage.gzhuashen.remove(name);
			player.updateMarks("gzhuashen");
			_status.characterlist.add(name);
		},
		getSkillSources(player, skill) {
			if (player.getStockSkills().includes(skill)) {
				return [];
			}
			var sources = [];
			for (var i in player.storage.gzhuashen_map) {
				if (game.expandSkills(player.storage.gzhuashen_map[i].slice(0)).includes(skill)) {
					sources.push(i);
				}
			}
			return sources;
		},
		subfrequent: ["add"],
		subSkill: {
			add: {
				trigger: { player: "phaseBeginStart" },
				frequent: true,
				filter(event, player) {
					return player.storage.gzhuashen.length < 2;
				},
				content() {
					"step 0";
					var list = _status.characterlist.randomGets(5);
					if (!list.length) {
						event.finish();
						return;
					}
					player
						.chooseButton([1, 2])
						.set("ai", function (button) {
							return get.rank(button.link, true);
						})
						.set("createDialog", ["选择至多两张武将牌作为“化身”", [list, "character"]]);
					"step 1";
					if (result.bool) {
						for (var i = 0; i < result.links.length; i++) {
							lib.skill.gzhuashen.addCharacter(player, result.links[i]);
						}
						lib.skill.gzhuashen.drawCharacter(player, result.links.slice(0));
						game.delayx();
						player.addTempSkill("gzhuashen_triggered");
						game.log(player, "获得了" + get.cnNumber(result.links.length) + "张", "#g化身");
					}
				},
			},
			swap: {
				trigger: { player: "phaseBeginStart" },
				direct: true,
				filter(event, player) {
					if (player.hasSkill("gzhuashen_triggered")) {
						return false;
					}
					return player.storage.gzhuashen.length >= 2;
				},
				content() {
					"step 0";
					var list = player.storage.gzhuashen.slice(0);
					if (!list.length) {
						event.finish();
						return;
					}
					player
						.chooseButton()
						.set("ai", function () {
							return Math.random() - 0.3;
						})
						.set("createDialog", ["是否替换一张“化身”？", [list, "character"]]);
					"step 1";
					if (result.bool) {
						player.logSkill("gzhuashen");
						game.log(player, "替换了一张", "#g化身");
						lib.skill.gzhuashen.addCharacter(player, _status.characterlist.randomGet(), true);
						lib.skill.gzhuashen.removeCharacter(player, result.links[0]);
						game.delayx();
					}
				},
			},
			triggered: {},
			flash: {
				hookTrigger: {
					log(player, skill) {
						var sources = lib.skill.gzhuashen.getSkillSources(player, skill);
						if (sources.length) {
							player.flashAvatar("gzhuashen", sources.randomGet());
							player.storage.gzhuashen_removing.add(skill);
						}
					},
				},
				trigger: { player: ["useSkillBegin", "useCard", "respond"] },
				silent: true,
				filter(event, player) {
					return event.skill && lib.skill.gzhuashen.getSkillSources(player, event.skill).length > 0;
				},
				content() {
					lib.skill.gzhuashen_flash.hookTrigger.log(player, trigger.skill);
				},
			},
			clear: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content() {
					player.storage.gzhuashen_trigger.length = 0;
				},
			},
			disallow: {
				hookTrigger: {
					block(event, player, name, skill) {
						for (var i = 0; i < player.storage.gzhuashen_trigger.length; i++) {
							var info = player.storage.gzhuashen_trigger[i];
							if (info[0] == event && info[1] == name && lib.skill.gzhuashen.getSkillSources(player, skill).length > 0) {
								return true;
							}
						}
						return false;
					},
				},
			},
			remove: {
				trigger: {
					player: ["useSkillAfter", "useCardAfter", "respondAfter", "triggerAfter", "skillAfter"],
				},
				hookTrigger: {
					after(event, player) {
						if (event._direct && !player.storage.gzhuashen_removing.includes(event.skill)) {
							return false;
						}
						if (lib.skill[event.skill].silent) {
							return false;
						}
						return lib.skill.gzhuashen.getSkillSources(player, event.skill).length > 0;
					},
				},
				silent: true,
				filter(event, player) {
					return event.skill && lib.skill.gzhuashen.getSkillSources(player, event.skill).length > 0;
				},
				content() {
					"step 0";
					if (trigger.name == "trigger") {
						player.storage.gzhuashen_trigger.push([trigger._trigger, trigger.triggername]);
					}
					var sources = lib.skill.gzhuashen.getSkillSources(player, trigger.skill);
					if (sources.length == 1) {
						event.directresult = sources[0];
					} else {
						player.chooseButton(true).set("createDialog", ["移除一张“化身”牌", [sources, "character"]]);
					}
					"step 1";
					if (!event.directresult && result && result.links[0]) {
						event.directresult = result.links[0];
					}
					var name = event.directresult;
					lib.skill.gzhuashen.removeCharacter(player, name);
					game.log(player, "移除了化身牌", "#g" + get.translation(name));
				},
			},
		},
		ai: {
			nofrequent: true,
			skillTagFilter(player, tag, arg) {
				if (arg && player.storage.gzhuashen) {
					if (lib.skill.gzhuashen.getSkillSources(player, arg).length > 0) {
						return true;
					}
				}
				return false;
			},
		},
	},
	gzxiongsuan: {
		limited: true,
		audio: "xiongsuan",
		enable: "phaseUse",
		filterCard: true,
		filter(event, player) {
			return player.countCards("h");
		},
		filterTarget(card, player, target) {
			return target.isFriendOf(player);
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			"step 0";
			player.awakenSkill("gzxiongsuan");
			target.damage("nocard");
			"step 1";
			player.draw(3);
			var list = [];
			var skills = target.getOriginalSkills();
			for (var i = 0; i < skills.length; i++) {
				if (lib.skill[skills[i]].limited && target.awakenedSkills.includes(skills[i])) {
					list.push(skills[i]);
				}
			}
			if (list.length == 1) {
				target.storage.gzxiongsuan_restore = list[0];
				target.addTempSkill("gzxiongsuan_restore");
				event.finish();
			} else if (list.length > 1) {
				player.chooseControl(list).set("prompt", "选择一个限定技在回合结束后重置之");
			} else {
				event.finish();
			}
			"step 2";
			target.storage.gzxiongsuan_restore = result.control;
			target.addTempSkill("gzxiongsuan_restore");
		},
		subSkill: {
			restore: {
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				charlotte: true,
				onremove: true,
				content() {
					player.restoreSkill(player.storage.gzxiongsuan_restore);
				},
			},
		},
		ai: {
			order: 4,
			damage: true,
			result: {
				target(player, target) {
					if (target.hp > 1) {
						var skills = target.getOriginalSkills();
						for (var i = 0; i < skills.length; i++) {
							if (lib.skill[skills[i]].limited && target.awakenedSkills.includes(skills[i])) {
								return 8;
							}
						}
					}
					if (target != player) {
						return 0;
					}
					if (get.damageEffect(target, player, player) >= 0) {
						return 10;
					}
					if (target.hp >= 4) {
						return 5;
					}
					if (target.hp == 3) {
						if (
							player.countCards("h") <= 2 &&
							game.hasPlayer(function (current) {
								return current.hp <= 1 && get.attitude(player, current) < 0;
							})
						) {
							return 3;
						}
					}
					return 0;
				},
			},
		},
	},
	gzsuishi: {
		audio: "suishi",
		preHidden: ["gzsuishi2"],
		trigger: { global: "dying" },
		forced: true,
		logAudio: () => "suishi1.mp3",
		check() {
			return false;
		},
		filter(event, player) {
			return event.player != player && event.parent.name == "damage" && event.parent.source && event.parent.source.isFriendOf(player);
		},
		content() {
			player.draw();
		},
		group: "gzsuishi2",
	},
	gzsuishi2: {
		audio: "suishi2.mp3",
		trigger: { global: "dieAfter" },
		forced: true,
		filter(event, player) {
			return event.player.isFriendOf(player);
		},
		content() {
			player.loseHp();
		},
	},
	hongfa_respond: {
		audio: ["huangjintianbingfu", 2],
		forceaudio: true,
		trigger: { player: "chooseToRespondBegin" },
		direct: true,
		filter(event, player) {
			if (event.responded) {
				return false;
			}
			if (!event.filterCard({ name: "sha" })) {
				return false;
			}
			var zhu = get.zhu(player, "hongfa");
			if (zhu && zhu.getExpansions("huangjintianbingfu").length > 0) {
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			var zhu = get.zhu(player, "hongfa");
			player
				.chooseCardButton(get.prompt("huangjintianbingfu"), zhu.getExpansions("huangjintianbingfu"))
				.set("ai", function () {
					if (_status.event.goon) {
						return 1;
					}
					return 0;
				})
				.set("goon", player.countCards("h", "sha") == 0);
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				trigger.untrigger();
				trigger.responded = true;
				trigger.result = { bool: true, card: { name: "sha" }, cards: [card] };
				var zhu = get.zhu(player, "hongfa");
				player.logSkill("hongfa_respond", zhu);
			}
		},
	},
	hongfa_use: {
		audio: ["huangjintianbingfu", 2],
		forceaudio: true,
		enable: "chooseToUse",
		filter(event, player) {
			if (!event.filterCard({ name: "sha" }, player)) {
				return false;
			}
			var zhu = get.zhu(player, "hongfa");
			if (zhu && zhu.getExpansions("huangjintianbingfu").length > 0) {
				return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var zhu = get.zhu(player, "hongfa");
				return ui.create.dialog("黄巾天兵符", zhu.getExpansions("huangjintianbingfu"), "hidden");
			},
			backup(links, player) {
				return {
					filterCard() {
						return false;
					},
					selectCard: -1,
					viewAs: { name: "sha", cards: links },
					cards: links,
					precontent() {
						var cards = lib.skill.hongfa_use_backup.cards;
						event.result.cards = cards;
						player.logSkill("hongfa_use", result.targets);
					},
				};
			},
			prompt(links, player) {
				return "选择杀的目标";
			},
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				var zhu = get.zhu(player, "hongfa");
				if (zhu && zhu.getExpansions("huangjintianbingfu").length > 0) {
					return true;
				}
				return false;
			},
			order() {
				return get.order({ name: "sha" }) - 0.1;
			},
			result: {
				player(player) {
					if (player.countCards("h", "sha")) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	hongfa: {
		audio: 3,
		locked: false,
		derivation: "huangjintianbingfu",
		unique: true,
		forceunique: true,
		lordSkill: true,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		init(player) {
			player.markSkill("huangjintianbingfu");
		},
		filter(event, player) {
			return player.getExpansions("huangjintianbingfu").length == 0 && get.population("qun") > 0;
		},
		content() {
			var cards = get.cards(get.population("qun"));
			player.addToExpansion(cards, "gain2").gaintag.add("huangjintianbingfu");
		},
		ai: {
			threaten: 2,
		},
		group: "hongfa_hp",
		global: ["huangjintianbingfu", "hongfa_use", "hongfa_respond"],
		subSkill: {
			hp: {
				audio: "huangjintianbingfu3.mp3",
				trigger: { player: "loseHpBefore" },
				filter(event, player) {
					return player.getExpansions("huangjintianbingfu").length > 0;
				},
				direct: true,
				content() {
					"step 0";
					player.chooseCardButton(get.prompt("hongfa"), player.getExpansions("huangjintianbingfu")).set("ai", function () {
						return 1;
					});
					"step 1";
					if (result.bool) {
						player.logSkill("hongfa_hp");
						player.loseToDiscardpile(result.links);
						trigger.cancel();
					}
				},
			},
		},
	},
	wendao: {
		audio: 2,
		derivation: "taipingyaoshu",
		unique: true,
		forceunique: true,
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			return get.name(card) != "taipingyaoshu" && get.color(card) == "red";
		},
		position: "he",
		check(card) {
			return 6 - get.value(card);
		},
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			event.set(
				"wendao",
				(function () {
					for (var i = 0; i < ui.discardPile.childElementCount; i++) {
						if (ui.discardPile.childNodes[i].name == "taipingyaoshu") {
							return true;
						}
					}
					return game.hasPlayer(function (current) {
						return current.countCards("ej", "taipingyaoshu");
					});
				})()
			);
		},
		filter(event, player) {
			return event.wendao == true;
		},
		content() {
			var list = [];
			for (var i = 0; i < ui.discardPile.childElementCount; i++) {
				if (ui.discardPile.childNodes[i].name == "taipingyaoshu") {
					list.add(ui.discardPile.childNodes[i]);
				}
			}
			game.countPlayer(function (current) {
				var ej = current.getCards("ej", "taipingyaoshu");
				if (ej.length) {
					list.addArray(ej);
				}
			});
			if (list.length) {
				var card = list.randomGet();
				var owner = get.owner(card);
				if (owner) {
					player.gain(card, owner, "give", "bySelf");
					player.line(owner, "green");
				} else {
					player.gain(card, "gain2");
				}
			}
		},
		ai: {
			order: 8.5,
			result: {
				player: 1,
			},
		},
	},
	huangjintianbingfu: {
		audio: 3,
		unique: true,
		forceunique: true,
		nopop: true,
		mark: true,
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("huangjintianbingfu");
				if (content && content.length) {
					dialog.addSmall(content);
				}
				dialog.addText('<ul style="margin-top:5px;padding-left:22px;"><li>锁定技，当你计算群势力角色数时，每一张“天兵”均可视为一名群势力角色。<li>每当你失去体力时，你可改为将一张“天兵”置入弃牌堆。<li>与你势力相同的角色可将一张“天兵”当【杀】使用或打出。', false);
			},
		},
	},
	wuxin: {
		trigger: { player: "phaseDrawBegin1" },
		audio: 2,
		filter(event, player) {
			return get.population("qun") > 0;
		},
		content() {
			"step 0";
			var num = get.population("qun");
			// if (player.hasSkill("hongfa")) {
			// 村规
			if (player.hasSkill("hongfa", null, null, false)) {
				num += player.getExpansions("huangjintianbingfu").length;
			}
			var cards = get.cards(num);
			game.cardsGotoOrdering(cards);
			var next = player.chooseToMove("悟心：将卡牌以任意顺序置于牌堆顶");
			next.set("list", [["牌堆顶", cards]]);
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0);
				cards.sort(function (a, b) {
					return get.value(b) - get.value(a);
				});
				return [cards];
			});
			"step 1";
			if (result.bool) {
				var list = result.moved[0].slice(0);
				while (list.length) {
					ui.cardPile.insertBefore(list.pop(), ui.cardPile.firstChild);
				}
				game.updateRoundNumber();
			}
		},
	},
	zhangwu: {
		audio: 2,
		derivation: "feilongduofeng",
		unique: true,
		forceunique: true,
		ai: {
			threaten: 2,
		},
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "equipAfter"],
		},
		forced: true,
		filter(event, player) {
			if (event.name == "equip") {
				if (player == event.player) {
					return false;
				}
				if (event.cards.some(card => card.name == "feilongduofeng" && event.player.getCards("e").includes(card))) {
					return true;
				}
				return event.player.hasHistory("lose", function (evt) {
					if (evt.position != ui.discardPile || evt.getParent().name != "equip") {
						return false;
					}
					if (evt.cards.some(card => card.name == "feilongduofeng" && get.position(card, true) == "d")) {
						return true;
					}
					return false;
				});
			}
			if (event.name == "lose" && (event.position != ui.discardPile || event.getParent().name == "equip")) {
				return false;
			}
			if (event.cards.some(card => card.name == "feilongduofeng" && get.position(card, true) == "d")) {
				return true;
			}
			return false;
		},
		logTarget(event, player) {
			if (event.name == "equip" && event.cards.some(card => card.name == "feilongduofeng" && event.player.getCards("e").includes(card))) {
				return event.player;
			}
			return [];
		},
		async content(event, trigger, player) {
			await game.delayx();
			let cards = [];
			if (trigger.name == "equip") {
				for (const card of trigger.cards) {
					if (card.name == "feilongduofeng" && trigger.player.getCards("e").includes(card)) {
						cards.push(card);
					}
				}
				trigger.player.getHistory("lose", function (evt) {
					if (evt.position != ui.discardPile || evt.getParent() != trigger) {
						return false;
					}
					for (const card of evt.cards) {
						if (card.name == "feilongduofeng" && get.position(card, true) == "d") {
							cards.push(card);
						}
					}
					return false;
				});
			}
			if (["lose", "cardsDiscard"].includes(trigger.name)) {
				for (const card of trigger.cards) {
					if (card.name == "feilongduofeng" && get.position(card, true) == "d") {
						cards.push(card);
					}
				}
			}
			if (!cards.length) {
				return;
			}
			let owner = get.owner(cards[0]);
			if (owner) {
				await player.gain(cards, "give", owner, "bySelf");
			} else {
				await player.gain(cards, "gain2");
			}
		},
		group: "zhangwu_draw",
		subSkill: {
			draw: {
				audio: "zhangwu",
				trigger: {
					player: "loseEnd",
					global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				filter(event, player) {
					if (event.getParent().name == "useCard") {
						return false;
					}
					const evt = event.getl(player);
					return (
						evt &&
						evt.player == player &&
						evt.cards2.filter(function (i) {
							return i.name == "feilongduofeng" && get.owner(i) != player;
						}).length > 0
					);
				},
				forced: true,
				async content(event, trigger, player) {
					const cards = [],
						evt = trigger.getl(player);
					cards.addArray(
						evt.cards2.filter(function (i) {
							return i.name == "feilongduofeng" && get.owner(i) != player;
						})
					);
					await player.showCards(cards, get.translation(player) + "发动了【章武】");
					for (const i of cards) {
						const owner = get.owner(i);
						if (owner) {
							owner.lose(i, ui.cardPile)._triggered = null;
						} else {
							i.fix();
							ui.cardPile.appendChild(i);
						}
					}
					await player.draw(2);
				},
			},
		},
	},
	shouyue: {
		audio: true,
		unique: true,
		forceunique: true,
		global: "wuhujiangdaqi",
		derivation: ["wuhujiangdaqi", "gz_wusheng", "gz_paoxiao", "gz_longdan", "gz_tieji", "gz_liegong"],
		mark: true,
		lordSkill: true,
		init(player) {
			player.markSkill("wuhujiangdaqi");
		},
	},
	shouyue_wusheng: { audio: 2 },
	shouyue_paoxiao: { audio: 2 },
	shouyue_longdan: { audio: 2 },
	shouyue_tieji: { audio: 2 },
	shouyue_liegong: { audio: 2 },
	wuhujiangdaqi: {
		unique: true,
		forceunique: true,
		nopop: true,
		mark: true,
		intro: {
			content: '@<div style="margin-top:-5px"><div class="skill">【武圣】</div><div class="skillinfo">将“红色牌”改为“任意牌”</div><div class="skill">【咆哮】</div><div class="skillinfo">增加描述“你使用的【杀】无视其他角色的防具”</div><div class="skill">【龙胆】</div><div class="skillinfo">增加描述“你每发动一次‘龙胆’便摸一张牌”</div><div class="skill">【铁骑】</div><div class="skillinfo">将“一张明置的武将牌”改为“所有明置的武将牌”</div><div class="skill">【烈弓】</div><div class="skillinfo">增加描述“你的攻击范围+1”</div></div>',
		},
	},
	jizhao: {
		derivation: "rerende",
		unique: true,
		audio: 2,
		enable: "chooseToUse",
		mark: true,
		skillAnimation: true,
		animationColor: "fire",
		init(player) {
			player.storage.jizhao = false;
		},
		filter(event, player) {
			if (player.storage.jizhao) {
				return false;
			}
			if (event.type == "dying") {
				if (player != event.dying) {
					return false;
				}
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			player.awakenSkill("jizhao");
			player.storage.jizhao = true;
			var num = player.maxHp - player.countCards("h");
			if (num > 0) {
				player.draw(num);
			}
			"step 1";
			if (player.hp < 2) {
				player.recover(2 - player.hp);
			}
			"step 2";
			player.removeSkill("wuhujiangdaqi");
			player.changeSkills(["rerende"], ["shouyue"]);
		},
		ai: {
			order: 1,
			skillTagFilter(player, arg, target) {
				if (player != target || player.storage.jizhao) {
					return false;
				}
			},
			save: true,
			result: {
				player: 10,
			},
		},
		intro: {
			content: "limited",
		},
	},
	gzshoucheng: {
		inherit: "shoucheng",
		audio: "shoucheng",
		preHidden: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				if (current == _status.currentPhase || !current.isFriendOf(player)) {
					return false;
				}
				var evt = event.getl(current);
				return evt && evt.hs && evt.hs.length && current.countCards("h") == 0;
			});
		},
		content() {
			"step 0";
			event.list = game
				.filterPlayer(function (current) {
					if (current == _status.currentPhase || !current.isFriendOf(player)) {
						return false;
					}
					var evt = trigger.getl(current);
					return evt && evt.hs && evt.hs.length;
				})
				.sortBySeat(_status.currentPhase);
			"step 1";
			var target = event.list.shift();
			event.target = target;
			if (target.isAlive() && target.countCards("h") == 0) {
				player
					.chooseBool(get.prompt2("gzshoucheng", target))
					.set("ai", function () {
						return get.attitude(_status.event.player, _status.event.getParent().target) > 0;
					})
					.setHiddenSkill(event.name);
			} else {
				event.goto(3);
			}
			"step 2";
			if (result.bool) {
				player.logSkill(event.name, target);
				target.draw();
			}
			"step 3";
			if (event.list.length) {
				event.goto(1);
			}
		},
	},
	gzyicheng: {
		audio: "yicheng",
		trigger: {
			global: ["useCardToPlayered", "useCardToTargeted"],
		},
		preHidden: true,
		//frequent:true,
		direct: true,
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			if (event.name == "useCardToPlayered" && !event.isFirstTarget) {
				return false;
			}
			var target = lib.skill.gzyicheng.logTarget(event, player);
			if (target == player) {
				return true;
			}
			return target.inline(player) && target.isAlive() && player.hasSkill("gzyicheng");
		},
		logTarget(event, player) {
			return event.name == "useCardToPlayered" ? event.player : event.target;
		},
		content() {
			"step 0";
			var target = lib.skill.gzyicheng.logTarget(trigger, player);
			event.target = target;
			target.chooseBool(get.prompt("gzyicheng"), "摸一张牌，然后弃置一张牌").set("frequentSkill", "gzyicheng");
			"step 1";
			if (result.bool) {
				player.logSkill("gzyicheng", target);
				target.draw();
				target.chooseToDiscard("he", true);
			}
		},
	},

	gzhuyuan: {
		audio: "huyuan",
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player
				.chooseCardTarget({
					filterCard: true,
					position: "he",
					filterTarget(card, player, target) {
						if (player == target) {
							return false;
						}
						var card = ui.selected.cards[0];
						if (get.type(card) != "equip") {
							return true;
						}
						return target.canEquip(card);
					},
					prompt: get.prompt2("gzhuyuan"),
					complexSelect: true,
					ai1(card) {
						if (!_status.event.goon) {
							return false;
						}
						var player = _status.event.player;
						if (get.type(card) != "equip") {
							return 0;
						}
						return 7.5 - get.value(card);
					},
					ai2(target) {
						if (!_status.event.goon) {
							return false;
						}
						var player = _status.event.player,
							card = ui.selected.cards[0];
						return get.effect(target, card, player, player);
					},
					goon: game.hasPlayer(function (current) {
						return get.effect(current, { name: "guohe_copy", position: "ej" }, player, player) > 0;
					}),
				})
				.setHiddenSkill("gzhuyuan");
			"step 1";
			if (result.bool) {
				var target = result.targets[0],
					card = result.cards[0];
				player.logSkill("gzhuyuan", target);
				if (get.type(card) == "equip") {
					player.$give(card, target, false);
					game.delayx();
					target.equip(card);
				} else {
					player.give(card, target);
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (
				game.hasPlayer(function (current) {
					return current.hasCard(function (card) {
						return lib.filter.canBeDiscarded(card, player, current);
					}, "ej");
				})
			) {
				player
					.chooseTarget("是否弃置场上的一张牌？", function (card, player, target) {
						return target.hasCard(function (card) {
							return lib.filter.canBeDiscarded(card, player, target);
						}, "ej");
					})
					.set("ai", function (target) {
						const player = _status.event.player;
						return get.effect(target, { name: "guohe_copy", position: "ej" }, player, player);
					});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "thunder");
				player.discardPlayerCard(target, true, "ej");
			}
		},
	},
	huyuan: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			return player.countCards("he", { type: "equip" }) > 0;
		},
		content() {
			"step 0";
			player
				.chooseCardTarget({
					filterCard(card) {
						return get.type(card) == "equip";
					},
					position: "he",
					filterTarget(card, player, target) {
						return target.canEquip(card);
					},
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						return get.attitude(_status.event.player, target) - 3;
					},
					prompt: get.prompt2("huyuan"),
				})
				.setHiddenSkill("huyuan");
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("huyuan", target);
				event.current = target;
				target.equip(result.cards[0]);
				if (target != player) {
					player.$give(result.cards, target, false);
					game.delay(2);
				}
				player
					.chooseTarget("弃置一名角色的一张牌", function (card, player, target) {
						var source = _status.event.source;
						return get.distance(source, target) <= 1 && source != target && target.countCards("he");
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.set("source", target);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool && result.targets.length) {
				event.current.line(result.targets, "green");
				player.discardPlayerCard(true, result.targets[0], "he");
			}
		},
	},
	heyi: {
		zhenfa: "inline",
		global: "heyi_distance",
	},
	heyi_distance: {
		mod: {
			globalTo(from, to, distance) {
				if (
					game.hasPlayer(function (current) {
						return current.hasSkill("heyi") && current.inline(to);
					})
				) {
					return distance + 1;
				}
			},
		},
	},
	tianfu: {
		init(player) {
			player.checkMainSkill("tianfu");
		},
		mainSkill: true,
		inherit: "kanpo",
		zhenfa: "inline",
		viewAsFilter(player) {
			return _status.currentPhase && _status.currentPhase.inline(player) && !player.hasSkill("kanpo") && player.countCards("h", { color: "black" }) > 0;
		},
	},
	yizhi: {
		init(player) {
			if (player.checkViceSkill("yizhi") && !player.viceChanged) {
				player.removeMaxHp();
			}
		},
		viceSkill: true,
		inherit: "guanxing",
		filter(event, player) {
			return !player.hasSkill("guanxing");
		},
	},
	gzshangyi: {
		audio: "shangyi",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return player != target && (target.countCards("h") || target.isUnseen(2));
		},
		content() {
			"step 0";
			target.viewHandcards(player);
			"step 1";
			if (!target.countCards("h")) {
				event._result = { index: 1 };
			} else if (!target.isUnseen(2)) {
				event._result = { index: 0 };
			} else {
				player.chooseControl().set("choiceList", ["观看" + get.translation(target) + "的手牌并可以弃置其中的一张黑色牌", "观看" + get.translation(target) + "的所有暗置的武将牌"]);
			}
			"step 2";
			if (result.index == 0) {
				player
					.discardPlayerCard(target, "h")
					.set("filterButton", function (button) {
						return get.color(button.link) == "black";
					})
					.set("visible", true);
			} else {
				player.viewCharacter(target, 2);
			}
		},
		ai: {
			order: 11,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
			threaten: 1.1,
		},
	},
	niaoxiang: {
		zhenfa: "siege",
		audio: "zniaoxiang",
		global: "niaoxiang_sha",
		preHidden: true,
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			if (game.countPlayer() < 4) {
				return false;
			}
			return player.siege(event.target) && event.player.siege(event.target);
		},
		forced: true,
		locked: false,
		forceaudio: true,
		logTarget: "target",
		content() {
			var id = trigger.target.playerid;
			var map = trigger.getParent().customArgs;
			if (!map[id]) {
				map[id] = {};
			}
			if (typeof map[id].shanRequired == "number") {
				map[id].shanRequired++;
			} else {
				map[id].shanRequired = 2;
			}
		},
	},
	fengshi: {
		audio: "zfengshi",
		zhenfa: "siege",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (event.card.name != "sha" || game.countPlayer() < 4) {
				return false;
			}
			return player.siege(event.target) && event.player.siege(event.target) && event.target.countCards("e");
		},
		logTarget: "target",
		content() {
			trigger.target.chooseToDiscard("e", true);
		},
	},
	gzguixiu: {
		unique: true,
		audio: "guixiu",
		trigger: { player: ["showCharacterAfter", "removeCharacterBefore"] },
		filter(event, player) {
			if (event.name == "removeCharacter" || event.name == "changeVice") {
				return get.character(event.toRemove, 3).includes("gzguixiu") && player.isDamaged();
			}
			return event.toShow.some(name => {
				return get.character(name, 3).includes("gzguixiu");
			});
		},
		content() {
			if (trigger.name == "showCharacter") {
				player.draw(2);
			} else {
				player.recover();
			}
		},
	},
	gzcunsi: {
		derivation: "gzyongjue",
		enable: "phaseUse",
		audio: "cunsi",
		filter(event, player) {
			return player.checkMainSkill("gzcunsi", false) || player.checkViceSkill("gzcunsi", false);
		},
		unique: true,
		forceunique: true,
		filterTarget: true,
		skillAnimation: true,
		animationColor: "orange",
		content() {
			"step 0";
			if (player.checkMainSkill("gzcunsi", false)) {
				player.removeCharacter(0);
			} else {
				player.removeCharacter(1);
			}
			"step 1";
			target.addSkills("gzyongjue");
			if (target != player) {
				target.draw(2);
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					var num = 0;
					if (player.isDamaged() && target.isFriendOf(player)) {
						num++;
						if (target.hasSkill("kanpo")) {
							num += 0.5;
						}
						if (target.hasSkill("liegong")) {
							num += 0.5;
						}
						if (target.hasSkill("tieji")) {
							num += 0.5;
						}
						if (target.hasSkill("gzrende")) {
							num += 1.2;
						}
						if (target.hasSkill("longdan")) {
							num += 1.2;
						}
						if (target.hasSkill("paoxiao")) {
							num += 1.2;
						}
						if (target.hasSkill("zhangwu")) {
							num += 1.5;
						}
						if (target != player) {
							num += 0.5;
						}
					}
					return num;
				},
			},
		},
	},
	gzyongjue: {
		audio: "yongjue",
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (event == event.player.getHistory("useCard")[0] && event.card.name == "sha" && _status.currentPhase == event.player && event.player.isFriendOf(player)) {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.position(event.cards[i], true) == "o") {
						return true;
					}
				}
			}
			return false;
		},
		mark: true,
		intro: {
			content: "若与你势力相同的一名角色于其回合内使用的第一张牌为【杀】，则该角色可以在此【杀】结算完成后获得之",
		},
		content() {
			var cards = [];
			for (var i = 0; i < trigger.cards.length; i++) {
				if (get.position(trigger.cards[i], true) == "o") {
					cards.push(trigger.cards[i]);
				}
			}
			trigger.player.gain(cards, "gain2");
		},
		global: "gzyongjue_ai",
	},
	gzyongjue_ai: {
		ai: {
			presha: true,
			skillTagFilter(player) {
				if (
					!game.hasPlayer(function (current) {
						return current.isFriendOf(player) && current.hasSkill("gzyongjue");
					})
				) {
					return false;
				}
			},
		},
	},
	baoling: {
		trigger: { player: "phaseUseEnd" },
		init(player) {
			player.checkMainSkill("baoling");
		},
		mainSkill: true,
		forced: true,
		preHidden: true,
		filter(event, player) {
			return player.hasViceCharacter();
		},
		check(event, player) {
			return player.hp <= 1 || get.guozhanRank(player.name2, player) <= 3;
		},
		content() {
			"step 0";
			player.removeCharacter(1);
			"step 1";
			player.removeSkills("baoling");
			player.gainMaxHp(3, true);
			"step 2";
			player.recover(3);
			player.addSkills("benghuai");
		},
		derivation: "benghuai",
	},
	gzmingshi: {
		audio: "mingshi",
		trigger: { player: "damageBegin3" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			return event.num > 0 && event.source && event.source.isUnseen(2);
		},
		content() {
			trigger.num--;
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (!player.isUnseen(2)) {
						return;
					}
					var num = get.tag(card, "damage");
					if (num) {
						if (num > 1) {
							return 0.5;
						}
						return 0;
					}
				},
			},
		},
	},
	hunshang: {
		init(player) {
			if (player.checkViceSkill("hunshang") && !player.viceChanged) {
				player.removeMaxHp();
			}
		},
		viceSkill: true,
		group: ["hunshang_yingzi", "hunshang_yinghun"],
	},
	reyingzi_sunce: { audio: 2 },
	yinghun_sunce: { audio: 2 },
	hunshang_yingzi: {
		inherit: "yingzi",
		audio: "reyingzi_sunce",
		filter(event, player) {
			return player.hp <= 1 && !player.hasSkill("yingzi");
		},
	},
	hunshang_yinghun: {
		inherit: "yinghun",
		audio: "yinghun_sunce",
		filter(event, player) {
			return player.hp <= 1 && player.isDamaged() && !player.hasSkill("yinghun");
		},
	},
	yingyang: {
		audio: 2,
		trigger: { player: "compare", target: "compare" },
		filter(event) {
			return !event.iwhile;
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			player
				.chooseControl("点数+3", "点数-3", "cancel2")
				.set("prompt", get.prompt2("yingyang"))
				.set("ai", function () {
					if (_status.event.small) {
						return 1;
					} else {
						return 0;
					}
				})
				.set("small", trigger.small);
			"step 1";
			if (result.index != 2) {
				player.logSkill("yingyang");
				if (result.index == 0) {
					game.log(player, "拼点牌点数+3");
					if (player == trigger.player) {
						trigger.num1 += 3;
						if (trigger.num1 > 13) {
							trigger.num1 = 13;
						}
					} else {
						trigger.num2 += 3;
						if (trigger.num2 > 13) {
							trigger.num2 = 13;
						}
					}
				} else {
					game.log(player, "拼点牌点数-3");
					if (player == trigger.player) {
						trigger.num1 -= 3;
						if (trigger.num1 < 1) {
							trigger.num1 = 1;
						}
					} else {
						trigger.num2 -= 3;
						if (trigger.num2 < 1) {
							trigger.num2 = 1;
						}
					}
				}
			}
		},
	},
	gzqianxi: {
		audio: "qianxi",
		trigger: { player: "phaseZhunbeiBegin" },
		content() {
			"step 0";
			player.judge();
			"step 1";
			event.color = result.color;
			player
				.chooseTarget(function (card, player, target) {
					return player != target && get.distance(player, target) <= 1;
				}, true)
				.set("ai", function (target) {
					return -get.attitude(_status.event.player, target);
				});
			"step 2";
			if (result.bool && result.targets.length) {
				result.targets[0].storage.qianxi2 = event.color;
				result.targets[0].addSkill("qianxi2");
				player.line(result.targets, "green");
				game.addVideo("storage", result.targets[0], ["qianxi2", event.color]);
			}
		},
	},
	gzduanchang: {
		audio: "duanchang",
		trigger: { player: "die" },
		forced: true,
		forceDie: true,
		filter(event, player) {
			return event.source && event.source.isIn() && event.source != player && (event.source.hasMainCharacter() || event.source.hasViceCharacter());
		},
		content() {
			"step 0";
			if (!trigger.source.hasViceCharacter()) {
				event._result = { control: "主将" };
			} else if (!trigger.source.hasMainCharacter()) {
				event._result = { control: "副将" };
			} else {
				player
					.chooseControl("主将", "副将", function () {
						return _status.event.choice;
					})
					.set("prompt", "令" + get.translation(trigger.source) + "失去一张武将牌的所有技能")
					.set("forceDie", true)
					.set(
						"choice",
						(function () {
							var rank = get.guozhanRank(trigger.source.name1, trigger.source) - get.guozhanRank(trigger.source.name2, trigger.source);
							if (rank == 0) {
								rank = Math.random() > 0.5 ? 1 : -1;
							}
							return rank * get.attitude(player, trigger.source) > 0 ? "副将" : "主将";
						})()
					);
			}
			"step 1";
			var skills;
			if (result.control == "主将") {
				trigger.source.showCharacter(0);
				game.broadcastAll(function (player) {
					player.node.avatar.classList.add("disabled");
				}, trigger.source);
				skills = lib.character[trigger.source.name][3];
				game.log(trigger.source, "失去了主将技能");
			} else {
				trigger.source.showCharacter(1);
				game.broadcastAll(function (player) {
					player.node.avatar2.classList.add("disabled");
				}, trigger.source);
				skills = lib.character[trigger.source.name2][3];
				game.log(trigger.source, "失去了副将技能");
			}
			var list = skills.filter(skill => {
				const info = get.info(skill);
				return info && !info.charlotte && !info.persevereSkill;
			});
			if (list.length) {
				trigger.source.removeSkills(list);
			}
			player.line(trigger.source, "green");
		},
		logTarget: "source",
		ai: {
			threaten(player, target) {
				if (target.hp == 1) {
					return 0.2;
				}
				return 1.5;
			},
			effect: {
				target(card, player, target, current) {
					if (!target.hasFriend()) {
						return;
					}
					if (target.hp <= 1 && get.tag(card, "damage")) {
						return [1, 0, 0, -2];
					}
				},
			},
		},
	},
	gzweimu: {
		audio: "weimu",
		trigger: { target: "useCardToTarget", player: "addJudgeBefore" },
		forced: true,
		priority: 15,
		preHidden: true,
		check(event, player) {
			return event.name == "addJudge" || (event.card.name != "chiling" && get.effect(event.target, event.card, event.player, player) < 0);
		},
		filter(event, player) {
			if (event.name == "addJudge") {
				return get.color(event.card) == "black";
			}
			return get.type(event.card, null, false) == "trick" && get.color(event.card) == "black";
		},
		content() {
			if (trigger.name == "addJudge") {
				trigger.cancel();
				var owner = get.owner(trigger.card);
				if (owner && owner.getCards("hej").includes(trigger.card)) {
					owner.lose(trigger.card, ui.discardPile);
				} else {
					game.cardsDiscard(trigger.card);
				}
				game.log(trigger.card, "进入了弃牌堆");
			} else {
				trigger.getParent().targets.remove(player);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card, "trick") == "trick" && get.color(card) == "black") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	gzqianxun: {
		audio: "qianxun",
		trigger: {
			target: "useCardToTarget",
			player: "addJudgeBefore",
		},
		forced: true,
		preHidden: true,
		priority: 15,
		check(event, player) {
			return event.name == "addJudge" || get.effect(event.target, event.card, event.player, player) < 0;
		},
		filter(event, player) {
			return event.card.name == (event.name == "addJudge" ? "lebu" : "shunshou");
		},
		content() {
			if (trigger.name == "addJudge") {
				trigger.cancel();
				var owner = get.owner(trigger.card);
				if (owner && owner.getCards("hej").includes(trigger.card)) {
					owner.lose(trigger.card, ui.discardPile);
				} else {
					game.cardsDiscard(trigger.card);
				}
				game.log(trigger.card, "进入了弃牌堆");
			} else {
				trigger.getParent().targets.remove(player);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (card.name == "shunshou" || card.name == "lebu") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	gzkongcheng: {
		audio: "kongcheng",
		trigger: { target: "useCardToTarget" },
		forced: true,
		priority: 15,
		check(event, player) {
			return get.effect(event.target, event.card, event.player, player) < 0;
		},
		filter(event, player) {
			return player.countCards("h") == 0 && (event.card.name == "sha" || event.card.name == "juedou");
		},
		content() {
			trigger.getParent().targets.remove(player);
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (target.countCards("h") == 0 && (card.name == "sha" || card.name == "juedou")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	gzxiaoji: {
		inherit: "xiaoji",
		audio: "xiaoji",
		preHidden: true,
		getIndex(event, player) {
			const evt = event.getl(player);
			if (evt && evt.player === player && evt.es && evt.es.length) {
				return 1;
			}
			return false;
		},
		content() {
			player.draw(player == _status.currentPhase ? 1 : 3);
		},
	},
	gzrende: {
		audio: "rende",
		group: ["gzrende1"],
		enable: "phaseUse",
		filterCard: true,
		selectCard: [1, Infinity],
		allowChooseAll: true,
		discard: false,
		prepare: "give",
		filterTarget(card, player, target) {
			return player != target;
		},
		check(card) {
			if (ui.selected.cards.length > 2) {
				return 0;
			}
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name == "du") {
				return 20;
			}
			var player = get.owner(card);
			if (player.hp == player.maxHp || player.storage.gzrende < 0 || player.countCards("h") + player.storage.gzrende <= 2) {
				if (ui.selected.cards.length) {
					return -1;
				}
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
						return 11 - get.value(card);
					}
				}
				if (player.countCards("h") > player.hp) {
					return 10 - get.value(card);
				}
				if (player.countCards("h") > 2) {
					return 6 - get.value(card);
				}
				return -1;
			}
			return 10 - get.value(card);
		},
		content() {
			target.gain(cards, player);
			if (typeof player.storage.gzrende != "number") {
				player.storage.gzrende = 0;
			}
			if (player.storage.gzrende >= 0) {
				player.storage.gzrende += cards.length;
				if (player.storage.gzrende >= 3) {
					player.recover();
					player.storage.gzrende = -1;
				}
			}
		},
		ai: {
			order(skill, player) {
				if (player.hp == player.maxHp || player.storage.gzrende < 0 || player.countCards("h") + player.storage.gzrende <= 2) {
					return 1;
				}
				return 10;
			},
			result: {
				target(player, target) {
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						return -10;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					var nh = target.countCards("h");
					var np = player.countCards("h");
					if (player.hp == player.maxHp || player.storage.gzrende < 0 || player.countCards("h") + player.storage.gzrende <= 2) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
							return 0;
						}
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
				target_use(card, player, target) {
					if (player == target && get.type(card) == "equip") {
						if (player.countCards("e", { subtype: get.subtype(card) })) {
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (players[i] != player && get.attitude(player, players[i]) > 0) {
									return 0;
								}
							}
						}
					}
				},
			},
			threaten: 0.8,
		},
	},
	gzrende1: {
		trigger: { player: "phaseUseBegin" },
		silent: true,
		content() {
			player.storage.gzrende = 0;
		},
	},
	duoshi: {
		audio: 2,
		enable: "chooseToUse",
		viewAs: { name: "yiyi" },
		usable: 4,
		filterCard: { color: "red" },
		position: "hs",
		viewAsFilter(player) {
			return player.countCards("hs", { color: "red" }) > 0;
		},
		check(card) {
			return 5 - get.value(card);
		},
	},
	gzxiaoguo: {
		inherit: "xiaoguo",
		audio: "xiaoguo",
		preHidden: true,
		content() {
			"step 0";
			var nono = Math.abs(get.attitude(player, trigger.player)) < 3;
			if (get.damageEffect(trigger.player, player, player) <= 0) {
				nono = true;
			}
			var next = player.chooseToDiscard(get.prompt2("gzxiaoguo", trigger.player), {
				type: "basic",
			});
			next.set("ai", function (card) {
				if (_status.event.nono) {
					return 0;
				}
				return 8 - get.useful(card);
			});
			next.set("logSkill", ["gzxiaoguo", trigger.player]);
			next.set("nono", nono);
			next.setHiddenSkill("gzxiaoguo");
			"step 1";
			if (result.bool) {
				var nono = get.damageEffect(trigger.player, player, trigger.player) >= 0;
				trigger.player
					.chooseToDiscard("弃置一张装备牌，或受到1点伤害", "he", { type: "equip" })
					.set("ai", function (card) {
						if (_status.event.nono) {
							return 0;
						}
						if (_status.event.player.hp == 1) {
							return 10 - get.value(card);
						}
						return 9 - get.value(card);
					})
					.set("nono", nono);
			} else {
				event.finish();
			}
			"step 2";
			if (!result.bool) {
				trigger.player.damage();
			}
		},
	},
	_mingzhi1: {
		trigger: { player: "phaseBeginStart" },
		//priority:19,
		ruleSkill: true,
		forced: true,
		popup: false,
		filter(event, player) {
			return player.isUnseen(2) && !player.hasSkillTag("nomingzhi", false, null, true);
		},
		async content(event, trigger, player) {
			const junzhu = _status.connectMode ? lib.configOL.junzhu : get.config("junzhu");
			if (player.phaseNumber == 1 && player.isUnseen(0) && junzhu) {
				let name = player.name1;
				if (name.indexOf("gz_") == 0 && (lib.junList.includes(name.slice(3)) || get.character(name)?.junName)) {
					const junzhu_name = get.character(name).junName ?? `gz_jun_${name.slice(3)}`,
						group = lib.character[junzhu_name][1];
					const notChange = game.hasPlayer(current => get.is.jun(current) && current.identity == group);
					const result = notChange
						? {
								bool: false,
							}
						: await player
								.chooseBool("是否将主武将牌替换为“" + get.translation(junzhu_name) + "”？")
								.set("createDialog", [`是否替换主武将牌为君主武将“${get.translation(junzhu_name)}”`, [[junzhu_name], "character"]])
								.forResult();
					if (result.bool) {
						const maxHp = player.maxHp;
						player.reinit(name, junzhu_name, 4);
						const map = {
							gz_jun_liubei: "shouyue",
							gz_jun_zhangjiao: "hongfa",
							gz_jun_sunquan: "jiahe",
							gz_jun_caocao: "jianan",
							gz_jun_jin_simayi: "smyyingshi",
						};
						game.trySkillAudio(map[junzhu_name], player);

						await player.showCharacter(0);
						const yelist = game.filterPlayer(function (current) {
							if (current == player) {
								return current.identity != group;
							}
							if (current.identity != "ye") {
								return false;
							}
							return current.group == group;
						});
						if (yelist.length > 0) {
							const next = game.createEvent("changeGroupInGuozhan", false);
							next.player = player;
							next.targets = yelist;
							next.fromGroups = yelist.map(current => current.identity);
							next.toGroup = group;
							next.setContent("emptyEvent");
							player.line(yelist, "green");
							if (yelist.includes(player)) {
								game.log(player, "变回了", `<span data-nature=${get.groupnature(group, "raw")}m>${get.translation(group + 2)}</span>身份`);
							}
							game.log(
								yelist.filter(current => current != player),
								"失去了野心家身份"
							);
							game.broadcastAll(
								function (list, group) {
									for (let i = 0; i < list.length; i++) {
										list[i].identity = group;
										list[i].group = group;
										list[i].setIdentity();
									}
								},
								yelist,
								group
							);
							await next;
						}
						game.tryResult();
						if (player.maxHp > maxHp) {
							await player.recover(player.maxHp - maxHp);
						}
					}
				}
			}
			let choice = 1;
			for (let i = 0; i < player.hiddenSkills.length; i++) {
				if (lib.skill[player.hiddenSkills[i]].ai) {
					let mingzhi = lib.skill[player.hiddenSkills[i]].ai.mingzhi;
					if (mingzhi == false) {
						choice = 0;
						break;
					}
					if (typeof mingzhi == "function" && mingzhi(trigger, player) == false) {
						choice = 0;
						break;
					}
				}
			}
			let control;
			if (player.isUnseen()) {
				let group = lib.character[player.name1][1];
				const result = await player
					.chooseControl("bumingzhi", "明置" + get.translation(player.name1), "明置" + get.translation(player.name2), "tongshimingzhi", true)
					.set("ai", (event, player) => {
						if (player.hasSkillTag("mingzhi_yes")) {
							return get.rand(1, 2);
						}
						if (player.hasSkillTag("mingzhi_no")) {
							return 0;
						}
						var popu = get.population(lib.character[player.name1][1]);
						if (popu >= 2 || (popu == 1 && game.players.length <= 4)) {
							return Math.random() < 0.5 ? 3 : Math.random() < 0.5 ? 2 : 1;
						}
						if (choice == 0) {
							return 0;
						}
						if (get.population(group) > 0 && player.wontYe()) {
							return Math.random() < 0.2 ? (Math.random() < 0.5 ? 3 : Math.random() < 0.5 ? 2 : 1) : 0;
						}
						var nming = 0;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i] != player && game.players[i].identity != "unknown") {
								nming++;
							}
						}
						if (nming == game.players.length - 1) {
							return Math.random() < 0.5 ? (Math.random() < 0.5 ? 3 : Math.random() < 0.5 ? 2 : 1) : 0;
						}
						return Math.random() < (0.1 * nming) / game.players.length ? (Math.random() < 0.5 ? 3 : Math.random() < 0.5 ? 2 : 1) : 0;
					})
					.forResult();
				control = result.control;
			} else {
				if (Math.random() < 0.5) {
					choice = 0;
				}
				if (player.isUnseen(0)) {
					const result = await player
						.chooseControl("bumingzhi", "明置" + get.translation(player.name1), true)
						.set("choice", choice)
						.forResult();
					control = result.control;
				} else if (player.isUnseen(1)) {
					const result = await player
						.chooseControl("bumingzhi", "明置" + get.translation(player.name2), true)
						.set("choice", choice)
						.forResult();
					control = result.control;
				} else {
					return;
				}
			}
			switch (control) {
				case "明置" + get.translation(player.name1):
					await player.showCharacter(0);
					break;
				case "明置" + get.translation(player.name2):
					await player.showCharacter(1);
					break;
				case "tongshimingzhi":
					await player.showCharacter(2);
					break;
			}
		},
	},
	_mingzhi2: {
		trigger: { player: "triggerHidden" },
		forced: true,
		forceDie: true,
		popup: false,
		priority: 10,
		async content(event, trigger, player) {
			const { skill } = trigger;
			if (get.info(skill).silent) {
				event.finish();
			} else {
				event.skillHidden = true;
				const bool1 = game.expandSkills(lib.character[player.name1][3]).includes(skill);
				const bool2 = game.expandSkills(lib.character[player.name2][3]).includes(skill);
				const info = get.info(skill);
				const isLockedCost = get.is.locked(skill, player) && typeof info?.cost == "function";
				const choice = (() => {
					const yes = !info?.check || info?.check?.(trigger._trigger, player, trigger.triggername, trigger.indexedData);
					if (!yes) {
						return false;
					}
					if (player.hasSkillTag("mingzhi_no")) {
						return false;
					}
					if (player.hasSkillTag("mingzhi_yes")) {
						return true;
					}
					if (player.identity != "unknown") {
						return true;
					}
					if (Math.random() < 0.5) {
						return true;
					}
					if (info?.ai?.mingzhi === true) {
						return true;
					}
					if (info?.ai?.maixie) {
						return true;
					}
					const group = lib.character[player.name1][1];
					const popu = get.population(lib.character[player.name1][1]);
					if (popu >= 2 || (popu == 1 && game.players.length <= 4)) {
						return true;
					}
					if (get.population(group) > 0 && player.wontYe()) {
						return Math.random() < 0.2 ? true : false;
					}
					let nming = 0;
					for (let i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i].identity != "unknown") {
							nming++;
						}
					}
					if (nming == game.players.length - 1) {
						return Math.random() < 0.5 ? true : false;
					}
					return Math.random() < (0.1 * nming) / game.players.length ? true : false;
				})();
				if (bool1 && bool2) {
					event.name1 = player.name1;
					event.name2 = player.name2;
					const { result } = await player
						.chooseButton([`明置：请选择你要明置以发动【${get.translation(skill)}】的角色`, [[event.name1, event.name2], "character"]])
						.set("ai", button => {
							const { player, choice } = get.event();
							if (!choice) {
								return 0;
							}
							return 1;
						})
						.set("choice", choice);
					if (result?.links?.length) {
						const index = event.name1 == result.links[0] ? 0 : 1;
						await player.showCharacter(index);
						if (!isLockedCost) {
							trigger.revealed = true;
						}
					} else {
						trigger.untrigger();
						trigger.cancelled = true;
					}
				} else {
					event.name1 = bool1 ? player.name1 : player.name2;
					const { result } = await player.chooseBool(`是否明置${get.translation(event.name1)}以发动【${get.translation(skill)}】？`).set("choice", choice);
					if (result?.bool) {
						const index = bool1 ? 0 : 1;
						await player.showCharacter(index);
						if (!isLockedCost) {
							trigger.revealed = true;
						}
					} else {
						trigger.untrigger();
						trigger.cancelled = true;
					}
				}
			}
		},
	},
	_mingzhiSelectGroup: {
		trigger: { player: "showCharacterBegin" },
		forced: true,
		forceDie: true,
		popup: false,
		priority: 11,
		async content(event, trigger, player) {
			const checkChange = name => lib.selectGroup.includes(lib.character[name][1]);
			if (trigger.toShow?.every(name => !checkChange(name))) {
				return;
			}
			if (!lib.selectGroup.includes(player.identity) && !get.nameList(player).every(name => checkChange(name))) {
				return;
			}
			const groups = ["wei", "shu", "wu", "qun", "jin"];
			if (_status.bannedGroup) {
				groups.remove(_status.bannedGroup?.slice(6));
			}
			const willBeYe = groups.filter(group => {
				if (_status.yeidentity && _status.yeidentity.includes(group)) {
					return true;
				}
				if (get.zhu(player, null, group)) {
					return false;
				}
				const num = player.identity == group ? 0 : 1;
				// @ts-expect-error 类型就是这么写的
				return get.totalPopulation(group) + num > (_status.separatism ? Math.max(get.population() / 2 - 1, 1) : get.population() / 2);
			});
			if (willBeYe?.length) {
				groups.removeArray(willBeYe);
				groups.add("ye");
			}
			if (!groups?.length) {
				return;
			}
			const newGroup = await player
				.chooseControl(groups)
				.set("prompt", "请选择一个新的势力")
				.set("ai", (event, player) => {
					const { groups } = get.event();
					const getn = group => {
						const targets = game.filterPlayer(current => current.identity == group);
						if (!targets.length || group == "ye") {
							return 1 + Math.random();
						}
						return targets.reduce((sum, current) => sum + current.hp, 0) / targets.length + Math.random();
					};
					return groups.maxBy(getn);
				})
				.set("groups", groups)
				.forResult("control");
			if (newGroup != player.identity) {
				const next = game.createEvent("changeGroupInGuozhan", false);
				next.player = player;
				next.targets = [player];
				next.fromGroups = [player.identity];
				next.toGroup = newGroup;
				next.setContent("emptyEvent");
				game.log(player, "变更了势力为", `<span data-nature=${get.groupnature(newGroup, "raw")}m>${get.translation(newGroup)}</span>`);
				game.broadcastAll(
					function (player, group) {
						player.identity = group;
						player.group = group;
						player.setIdentity();
					},
					player,
					newGroup
				);
				await next;
				game.tryResult();
			}
		},
	},
	_zhenfazhaohuan: {
		enable: "phaseUse",
		usable: 1,
		getConfig(player, target) {
			if (target == player || !target.isUnseen()) {
				return false;
			}
			var config = {};
			var skills = player.getSkills();
			for (var i = 0; i < skills.length; i++) {
				var info = get.info(skills[i]).zhenfa;
				if (info) {
					config[info] = true;
				}
			}
			if (config.inline) {
				var next = target.getNext();
				var previous = target.getPrevious();
				if (next == player || previous == player || (next && next.inline(player)) || (previous && previous.inline(player))) {
					return true;
				}
			}
			if (config.siege) {
				if (target == player.getNext().getNext() || target == player.getPrevious().getPrevious()) {
					return true;
				}
			}
			return false;
		},
		filter(event, player) {
			if (player.identity == "ye" || player.identity == "unknown" || !player.wontYe(player.identity)) {
				return false;
			}
			if (player.hasSkill("undist")) {
				return false;
			}
			if (
				game.countPlayer(function (current) {
					return !current.hasSkill("undist");
				}) < 4
			) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return lib.skill._zhenfazhaohuan.getConfig(player, current);
			});
		},
		content() {
			"step 0";
			event.list = game
				.filterPlayer(function (current) {
					return current.isUnseen();
				})
				.sortBySeat();
			"step 1";
			var target = event.list.shift();
			event.target = target;
			if (target.wontYe(player.identity) && lib.skill._zhenfazhaohuan.getConfig(player, target)) {
				player.line(target, "green");
				var list = [];
				if (target.getGuozhanGroup(0) == player.identity) {
					list.push("明置" + get.translation(target.name1));
				}
				if (target.getGuozhanGroup(1) == player.identity) {
					list.push("明置" + get.translation(target.name2));
				}
				if (list.length > 0) {
					target
						.chooseControl(list, "cancel2")
						.set("prompt", "是否响应" + get.translation(player) + "发起的阵法召唤？")
						.set("ai", function () {
							return Math.random() < 0.5 ? 0 : 1;
						});
				} else {
					event.goto(3);
				}
			} else {
				event.goto(3);
			}
			"step 2";
			if (result.control != "cancel2") {
				if (result.control == "明置" + get.translation(target.name1)) {
					target.showCharacter(0);
				} else {
					target.showCharacter(1);
				}
			}
			"step 3";
			if (event.list.length) {
				event.goto(1);
			}
			"step 4";
			game.delay();
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	ushio_huanxin: {
		trigger: {
			player: ["damageEnd", "useCardAfter"],
			source: "damageSource",
		},
		frequent: true,
		preHidden: true,
		filter(event, player, name) {
			if (name == "useCardAfter") {
				return get.type(event.card) == "equip";
			}
			if (name == "damageEnd") {
				return true;
			}
			return event.getParent().name == "sha";
		},
		content() {
			player.judge().set("callback", function () {
				var card = event.judgeResult.card;
				if (card && get.position(card, true) == "o") {
					player.gain(card, "gain2");
					player.chooseToDiscard(true, "he");
				}
			});
		},
	},
	ushio_xilv: {
		trigger: { player: "judgeEnd" },
		forced: true,
		preHidden: true,
		content() {
			player.addTempSkill("ushio_xilv2", { player: "phaseJieshu" });
			player.addMark("ushio_xilv2", 1, false);
		},
	},
	ushio_xilv2: {
		onremove: true,
		charlotte: true,
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("ushio_xilv2");
			},
		},
		intro: {
			content: "手牌上限+#",
		},
	},
};
