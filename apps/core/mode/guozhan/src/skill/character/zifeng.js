import { lib, game, ui, get, _status } from "noname";

export default {
	gz_liaoye: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			const result = await target
				.chooseTarget({ prompt: "燎野：选择任意名角色", selectTarget: [0, Infinity] })
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				})
				.forResult();
			const selected = result.targets || [];
			const targets1 = selected.filter(current => current != player && current.isIn());
			const targets2 = game.filterPlayer(current => current != player && !selected.includes(current));
			let targets;
			if (!targets1.length) {
				targets = targets2;
			} else if (!targets2.length) {
				targets = targets1;
			} else {
				const result2 = await player
					.chooseControl({ controls: ["选项一", "选项二"] })
					.set("choiceList", ["对其以此法选择的所有其他角色各造成1点伤害（" + get.translation(targets1) + "）", "对所有其未以此法选择的其他角色各造成1点伤害（" + get.translation(targets2) + "）"])
					.set("ai", () => {
						const player = get.player();
						const targets1 = get.event().targets1;
						const targets2 = get.event().targets2;
						const getEffect = targets => targets.reduce((num, target) => num + get.damageEffect(target, player, player), 0);
						return getEffect(targets1) >= getEffect(targets2) ? 0 : 1;
					})
					.set("targets1", targets1)
					.set("targets2", targets2)
					.forResult();
				targets = result2.index == 0 ? targets1 : targets2;
			}
			if (targets.length) {
				player.line(targets, "fire");
				for (const current of targets) {
					if (current.isIn()) {
						await current.damage({ source: player, nocard: true });
					}
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target: -1,
			},
		},
	},
	gz_fangzi: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		direct: true,
		filter(event, player) {
			return player.hasViceCharacter?.() && !!player.name2;
		},
		async content(event, trigger, player) {
			const oldVice = player.name2;
			const result = await player
				.chooseBool({ prompt: get.prompt2(event.name) })
				.set("ai", () => true)
				.forResult();
			if (!result.bool) {
				return;
			}
			player.logSkill(event.name);
			await player.changeVice();
			if (!oldVice || player.name2 == oldVice) {
				return;
			}
			const groups = lib.skill.gz_fangzi.getCharacterGroups(oldVice);
			if (!groups.length) {
				return;
			}
			let group = groups[0];
			if (groups.length > 1) {
				const result2 = await player
					.chooseControl({ controls: groups })
					.set("prompt", "放恣：选择被变更副将的一个势力")
					.set("ai", () => {
						const groups = get.event().controls.slice();
						return groups
							.sort((a, b) => {
								const player = get.player();
								const getValue = group => game.filterPlayer(current => current.identity == group && current.countCards("h")).reduce((num, current) => num - get.attitude(player, current), 0);
								return getValue(b) - getValue(a);
							})
							.shift();
					})
					.forResult();
				group = result2.control || group;
			}
			const targets = game.filterPlayer(current => current.identity == group && current.countCards("h"));
			if (targets.length) {
				player.line(targets, "green");
				for (const target of targets) {
					if (target.isIn() && target.countCards("h")) {
						await player.gainPlayerCard({ target: target, position: "h", forced: true });
					}
				}
			}
		},
		getCharacterGroups(name) {
			const info = get.character(name);
			if (!info) {
				return [];
			}
			const groups = [];
			if (info.group && info.group != "ye") {
				groups.add(info.group);
			}
			if (info.doubleGroup?.length) {
				groups.addArray(info.doubleGroup.filter(group => group != "ye"));
			}
			return groups;
		},
	},
	gz_liudu: {
		audio: 2,
		skillAnimation: true,
		animationColor: "wood",
		trigger: {
			player: "dieAfter",
		},
		forced: true,
		forceDie: true,
		filter() {
			return !_status._aozhan;
		},
		async content(event, trigger, player) {
			lib.skill.gz_liudu.enterAozhan(player);
		},
		enterAozhan(player) {
			if (_status._aozhan) {
				return;
			}
			const config = _status.connectMode ? lib.configOL.aozhan : get.config("aozhan");
			const mode = config == "jiubian" ? "jiubian" : "normal";
			const color = player?.isUnseen?.() ? "fire" : get.groupnature(player?.group || "ye", "raw");
			game.broadcastAll(
				function (player, color) {
					player?.$fullscreenpop?.("鏖战模式", color, null, false);
				},
				player,
				color
			);
			game.broadcastAll(function (mode) {
				_status._aozhan = true;
				_status._aozhanMode = mode;
				ui.aozhan = ui.create.div(".touchinfo.left", ui.window);
				ui.aozhan.innerHTML = mode == "jiubian" ? "九变鏖战" : "鏖战模式";
				if (mode == "jiubian") {
					ui.gzAozhanEventInfo = ui.create.div(ui.window);
					ui.gzAozhanEventInfo.style.cssText = "position:absolute;left:8px;top:34px;z-index:8;max-width:220px;padding:7px 9px;border-radius:4px;background:rgba(0,0,0,0.72);box-shadow:0 0 8px rgba(0,0,0,0.35);color:#f5e9cf;text-align:left;line-height:1.35;font-size:14px;pointer-events:auto;cursor:pointer;";
					ui.gzAozhanEventInfo.innerHTML = '<div style="font-weight:bold;color:#ffe0a0;">场景牌：未翻开</div>';
				}
				if (ui.time3) {
					ui.time3.style.display = "none";
				}
				ui.aozhanInfo = ui.create.system(mode == "jiubian" ? "九变鏖战" : "鏖战模式", null, true);
				lib.setPopped(
					ui.aozhanInfo,
					function () {
						const uiintro = ui.create.dialog("hidden");
						uiintro.add(mode == "jiubian" ? "九变鏖战" : "鏖战模式");
						const list = ["由〖流毒〗令游戏进入鏖战模式。"];
						if (mode == "jiubian") {
							list.push("在九变鏖战下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【酒】使用或打出。");
							list.push("每轮开始时，翻开一张鏖战事件牌并执行对应效果。事件牌堆全部翻开后，重新洗混。");
						} else {
							list.push("在鏖战模式下，【桃】只能当做【杀】或【闪】使用或打出，不能用来回复体力。");
						}
						let intro = '<ul style="text-align:left;margin-top:0;width:450px">';
						for (let i = 0; i < list.length; i++) {
							intro += "<li>" + list[i];
						}
						intro += "</ul>";
						uiintro.add('<div class="text center">' + intro + "</div>");
						const ul = uiintro.querySelector("ul");
						if (ul) {
							ul.style.width = "180px";
						}
						uiintro.add(ui.create.div(".placeholder"));
						return uiintro;
					},
					250
				);
				game.playBackgroundMusic();
				if (mode == "jiubian") {
					lib.init.sheet(`
						.card[data-card-name = "tao"]>.image {
							background-image: url(${lib.assetURL}image/card/jiu.png) !important;
						}
					`);
				}
			}, mode);
			game.addGlobalSkill(mode == "jiubian" ? "aozhan_jiubian" : "aozhan");
			if (mode == "jiubian") {
				lib.skill._aozhan_event_round.initEvents();
			}
		},
	},
	gz_chuchong: {
		audio: 2,
		trigger: {
			source: "dieAfter",
		},
		forced: true,
		forceDie: true,
		filter(event, player) {
			return event.player?.isFriendOf(player);
		},
		async content(event, trigger, player) {
			const targets = game.filterPlayer(current => current.isFriendOf(player)).sortBySeat();
			for (const target of targets) {
				if (!target.isIn()) {
					continue;
				}
				player.line(target, "green");
				if (target.hp < target.maxHp) {
					await target.recover(target.maxHp - target.hp);
				}
				const num = 5 - target.countCards("h");
				if (num > 0) {
					await target.draw(num);
				}
				if (target.hasViceCharacter?.()) {
					const result = await target
						.chooseBool({ prompt: "除蟲：是否变更一次副将？" })
						.set("ai", () => {
							// 候选在同意后随机产生，不窥看将池；未知或高价值副将优先保留。
							const current = get.player();
							const name = current.name2;
							if (!name || !lib.character[name]) return false;
							if (name.startsWith("gz_shibing")) return true;
							const rank = get.guozhanRank(name);
							return rank > 0 && rank <= 2;
						})
						.forResult();
					if (result.bool) {
						await target.changeVice();
					}
				}
			}
		},
		ai: {
			noDieAfter2: true,
			skillTagFilter(player, tag, target) {
				return target?.isFriendOf(player);
			},
		},
	},
	gz_dufu: {
		audio: 2,
		trigger: {
			source: "damageBegin1",
			player: "phaseDrawBegin2",
		},
		forced: true,
		filter(event, player, name) {
			if (game.hasPlayer(current => current != player && current.isFriendOf(player))) {
				return false;
			}
			if (name == "phaseDrawBegin2") {
				return !event.numFixed;
			}
			return event.num > 0;
		},
		async content(event, trigger, player) {
			if (event.triggername == "phaseDrawBegin2") {
				trigger.num += 2;
			} else {
				trigger.num++;
			}
		},
		ai: {
			threaten(player, target) {
				return game.hasPlayer(current => current != target && current.isFriendOf(target)) ? 1 : 1.5;
			},
			damageBonus: true,
			skillTagFilter(player, tag, arg) {
				if (tag != "damageBonus") return;
				if (game.hasPlayer(current => current != player && current.isFriendOf(player))) return false;
				if (arg?.card && !get.tag(arg.card, "damage")) return false;
				if (arg?.target?.hasSkillTag("filterDamage", null, { player, card: arg.card })) return false;
			},
		},
	},
	gz_chengguan: {
		audio: 2,
		trigger: {
			player: "damageAfter",
		},
		direct: true,
		preHidden: true,
		filter(event, player) {
			const history = player.getHistory("damage");
			if (history[0] == event) {
				return game.hasPlayer(current => current != player);
			}
			return event.source?.isIn() && event.source != player;
		},
		async content(event, trigger, player) {
			const history = player.getHistory("damage");
			if (history[0] == trigger) {
				const result = await player
					.chooseTarget({ prompt: get.prompt("gz_chengguan"), prompt2: "与一名其他角色交换手牌", filterTarget: lib.filter.notMe })
					.set("ai", target => {
						const player = get.player();
						return get.attitude(player, target) * Math.sign(target.countCards("h") - player.countCards("h"));
					})
					.forResult();
				if (result.bool) {
					const target = result.targets[0];
					player.logSkill("gz_chengguan", target);
					await player.swapHandcards(target);
				}
			} else {
				const source = trigger.source;
				if (!source?.isIn()) {
					return;
				}
				const result = await source
					.chooseBool({ prompt: "承冠：是否与" + get.translation(player) + "交换手牌？" })
					.set("ai", () => {
						const player = get.player();
						const target = get.event().target;
						return target.countCards("h") > player.countCards("h");
					})
					.set("target", player)
					.forResult();
				if (result.bool) {
					player.logSkill("gz_chengguan", source);
					await source.swapHandcards(player);
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
		},
	},
	gz_jianyi: {
		audio: 2,
		trigger: {
			player: "damageAfter",
		},
		direct: true,
		preHidden: true,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseBool({ prompt: get.prompt2(event.name) })
				.set("ai", () => true)
				.forResult();
			if (!result.bool) {
				return;
			}
			player.logSkill(event.name);
			const cards = player.getCards("h");
			await player.showCards(cards, get.translation(player) + "发动了【减翼】");
			const damageCards = cards.filter(card => get.owner(card) == player && get.position(card) == "h" && get.tag(card, "damage"));
			if (damageCards.length) {
				const viewAs = get.autoViewAs({ name: "yuanjiao" }, damageCards);
				if (player.hasUseTarget(viewAs)) {
					await player.chooseUseTarget({ prompt: "减翼：将" + get.translation(damageCards) + "当做【远交近攻】使用", card: viewAs, cards: damageCards, addCount: false });
				}
			}
		},
	},
	gz_gouni: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		filterTarget(card, player, target) {
			return target != player && target.isFriendOf(player) && !target.getStorage("gz_gouni_effect").includes(player);
		},
		async content(event, trigger, player) {
			const target = event.target;
			player.awakenSkill(event.name);
			target.addSkill("gz_gouni_effect");
			target.markAuto("gz_gouni_effect", [player]);
			game.log(target, "与", player, "势力视为不同");
		},
		ai: {
			order: 1,
			result: {
				target: 1,
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					targetEnabled(card, player, target) {
						if (lib.skill.gz_gouni.subSkill.effect.blocksCard(card, player, target)) {
							return false;
						}
					},
				},
				blocksCard(card, player, target) {
					if (!player.getStorage("gz_gouni_effect").includes(target) && !target.getStorage("gz_gouni_effect").includes(player)) {
						return false;
					}
					return card.name == "fendao";
				},
				intro: {
					content(storage) {
						return "与" + get.translation(storage) + "势力视为不同";
					},
				},
			},
		},
	},
	gz_huluan: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		direct: true,
		preHidden: true,
		filter(event, player) {
			return game.hasPlayer(current => current.isUnseen(0) || current.isUnseen(1));
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget({ prompt: get.prompt("gz_huluan"), prompt2: "观看一至三名角色的各一张暗置的武将牌", selectTarget: [1, 3], filterTarget: (card, player, target) => target.isUnseen(0) || target.isUnseen(1) })
				.set("ai", target => {
					const player = get.player();
					return 1 + Math.max(0, -get.attitude(player, target));
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const targets = result.targets.sortBySeat();
			player.logSkill("gz_huluan", targets);
			const viewed = [];
			for (const target of targets) {
				const controls = [];
				if (target.isUnseen(0)) {
					controls.push("主将");
				}
				if (target.isUnseen(1)) {
					controls.push("副将");
				}
				if (!controls.length) {
					continue;
				}
				const result2 =
					controls.length == 1
						? { control: controls[0] }
						: await player
								.chooseControl({ controls: controls })
								.set("prompt", "怙乱：观看" + get.translation(target) + "的哪张武将牌？")
								.forResult();
				const num = result2.control == "主将" ? 0 : 1;
				viewed.push(target["name" + (num + 1)]);
				await player.viewCharacter(target, num);
			}
			if (!viewed.length) {
				return;
			}
			let commonGroups = lib.skill.gz_huluan.getCharacterGroups(viewed[0]);
			for (let i = 1; i < viewed.length; i++) {
				const groups = lib.skill.gz_huluan.getCharacterGroups(viewed[i]);
				commonGroups = commonGroups.filter(group => groups.includes(group));
			}
			if (!commonGroups.length) {
				return;
			}
			const result3 = await player
				.chooseControl({ controls: ["造成伤害", "摸牌"] })
				.set("prompt", "怙乱：请选择一项")
				.set("choiceList", ["对" + get.translation(targets) + "各造成1点伤害", "令" + get.translation(targets) + "各摸两张牌"])
				.set("ai", () => {
					const player = get.player();
					const targets = get.event().targets;
					const damage = targets.reduce((sum, target) => sum + get.damageEffect(target, player, player), 0);
					const draw = targets.reduce((sum, target) => sum + get.effect(target, { name: "wuzhong" }, player, player), 0);
					return damage >= draw ? 0 : 1;
				})
				.set("targets", targets)
				.forResult();
			if (result3.index == 0) {
				player.line(targets, "fire");
				for (const target of targets) {
					if (target.isIn()) {
						await target.damage({ source: player, nocard: true });
					}
				}
			} else {
				player.line(targets, "green");
				for (const target of targets) {
					if (target.isIn()) {
						await target.draw(2);
					}
				}
			}
		},
		getCharacterGroups(name) {
			const info = get.character(name);
			if (!info) {
				return [];
			}
			const groups = [];
			if (info.group && info.group != "ye") {
				groups.add(info.group);
			}
			if (info.doubleGroup?.length) {
				groups.addArray(info.doubleGroup.filter(group => group != "ye"));
			}
			return groups;
		},
	},
	gz_yinfu: {
		audio: 2,
		mainSkill: true,
		init(player) {
			if (player.checkMainSkill("gz_yinfu")) {
				player.removeMaxHp();
			}
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (player.hasSkill("gz_yinfu_used") || !player.checkMainSkill("gz_yinfu", false) || !player.name2 || player.isUnseen(1)) {
				return false;
			}
			return event.filterCard({ name: "juedou", isCard: true }, player, event) || event.filterCard({ name: "wuxie", isCard: true }, player, event);
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				if (event.filterCard({ name: "juedou", isCard: true }, player, event)) {
					list.push(["锦囊", "", "juedou"]);
				}
				if (event.filterCard({ name: "wuxie", isCard: true }, player, event)) {
					list.push(["锦囊", "", "wuxie"]);
				}
				return ui.create.dialog("隐伏", [list, "vcard"], "hidden");
			},
			check(button) {
				const player = _status.event.player;
				return player.getUseValue({ name: button.link[2], isCard: true });
			},
			backup(links) {
				return {
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: { name: links[0][2], isCard: true },
					async precontent(event, trigger, player) {
						player.logSkill("gz_yinfu");
						player.addTempSkill("gz_yinfu_used", "phaseAfter");
						await player.hideCharacter(1);
					},
				};
			},
			prompt(links) {
				return "暗置副将，视为使用【" + get.translation(links[0][2]) + "】";
			},
		},
		hiddenCard(player, name) {
			return (name == "juedou" || name == "wuxie") && !player.hasSkill("gz_yinfu_used") && player.checkMainSkill("gz_yinfu", false) && player.name2 && !player.isUnseen(1);
		},
		ai: {
			order: 4,
			result: {
				player: 1,
			},
		},
	},
	gz_guorui: {
		audio: 2,
		trigger: {
			global: "useCardAfter",
		},
		direct: true,
		preHidden: true,
		filter(event, player) {
			if (event.card?.name != "juedou") {
				return false;
			}
			return lib.skill.gz_guorui.getCards(event).length > 0 || player.hasViceCharacter?.();
		},
		async content(event, trigger, player) {
			const cards = lib.skill.gz_guorui.getCards(trigger);
			const controls = [];
			if (cards.length && game.hasPlayer(current => current != player)) {
				controls.push("使用杀");
			}
			if (player.hasViceCharacter?.()) {
				controls.push("变更副将");
			}
			if (!controls.length) {
				return;
			}
			const choiceList = controls.map(control => {
				if (control == "使用杀") {
					return "对一名其他角色依次使用" + get.translation(cards) + "（无距离限制）";
				}
				return "变更副将";
			});
			controls.push("cancel2");
			const result = await player
				.chooseControl({ controls: controls })
				.set("prompt", get.prompt("gz_guorui"))
				.set("choiceList", choiceList)
				.set("ai", () => {
					const player = get.player();
					const cards = get.event().cards;
					if (cards.length) {
						const target = game.filterPlayer(current => current != player).sort((a, b) => get.effect(b, { name: "sha" }, player, player) - get.effect(a, { name: "sha" }, player, player))[0];
						if (target && get.effect(target, { name: "sha" }, player, player) > 0) {
							return "使用杀";
						}
					}
					return "cancel2";
				})
				.set("cards", cards)
				.forResult();
			if (result.control == "使用杀") {
				const result2 = await player
					.chooseTarget({ prompt: "果锐：选择一名其他角色", filterTarget: lib.filter.notMe })
					.set("ai", target => {
						const player = get.player();
						return get.effect(target, { name: "sha" }, player, player);
					})
					.forResult();
				if (!result2.bool) {
					return;
				}
				const target = result2.targets[0];
				player.logSkill("gz_guorui", target);
				player.addTempSkill("gz_guorui_range");
				player.storage.gz_guorui_range = cards.slice();
				for (const card of cards) {
					if (target.isIn() && get.position(card) == "d") {
						await player.useCard({ card: card, targets: [target], addCount: false });
					}
				}
				player.removeSkill("gz_guorui_range");
			} else if (result.control == "变更副将") {
				player.logSkill("gz_guorui");
				await player.changeVice();
			}
		},
		getCards(event) {
			const cards = [];
			game.getGlobalHistory("everything", evt => {
				if (evt.name != "respond" || !evt.cards?.length) {
					return;
				}
				if (evt.respondTo?.[1] != event.card && evt.getParent("useCard", true) != event) {
					return;
				}
				cards.addArray(evt.cards.filter(card => get.name(card) == "sha" && get.position(card) == "d"));
			});
			return cards;
		},
		subSkill: {
			range: {
				charlotte: true,
				onremove: true,
				mod: {
					targetInRange(card, player) {
						if (card.name == "sha" && player.getStorage("gz_guorui_range").includes(card)) {
							return true;
						}
					},
				},
			},
		},
	},
	gz_fengguo: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		direct: true,
		preHidden: true,
		filter(event, player) {
			return game.hasPlayer(current => current.identity != "unknown");
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget({ prompt: get.prompt("gz_fengguo"), prompt2: "选择一名已确定势力的角色", filterTarget: (card, player, target) => target.identity != "unknown" })
				.set("ai", target => {
					const player = get.player();
					if (target.isFriendOf(player)) {
						return target.hp == target.maxHp ? 3 : 1;
					}
					return -get.attitude(player, target);
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const target = result.targets[0];
			player.logSkill("gz_fengguo", target);
			if (player.hasSkill("gz_fengguo_effect")) {
				player.removeSkill("gz_fengguo_effect");
			}
			player.storage.gz_fengguo_effect = target;
			player.addSkill("gz_fengguo_effect");
			game.log(target, "成为了", "#g【奉国】", "目标");
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mark: "character",
				intro: {
					content: "已选择$为奉国目标",
				},
				group: ["gz_fengguo_norecover", "gz_fengguo_prevent", "gz_fengguo_clear"],
			},
			norecover: {
				audio: "gz_fengguo",
				trigger: {
					global: "recoverBegin",
				},
				forced: true,
				filter(event, player) {
					return event.player == player.storage.gz_fengguo_effect;
				},
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
			prevent: {
				audio: "gz_fengguo",
				trigger: {
					global: "damageBegin4",
				},
				forced: true,
				filter(event, player) {
					const target = player.storage.gz_fengguo_effect;
					return target?.isIn() && event.player != target && event.player.isFriendOf(target);
				},
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
			clear: {
				trigger: {
					player: ["phaseBegin", "dieAfter"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return player.hasSkill("gz_fengguo_effect");
				},
				async content(event, trigger, player) {
					player.removeSkill("gz_fengguo_effect");
				},
			},
		},
	},
};
