// 不经过编译
import { _status, game, get, lib, ui, ai } from "noname";
import { GameEvent } from "./gameEvent.js";
import { Player } from "./player.js";

import { delay } from "@/util/index.js";

// 未来再改
/**
 * @type {Record<string, ContentFuncByAll | ContentFuncsByAll>}
 */
export const Content = {
	async emptyEvent(event) {
		await event.trigger(event.name);
	},
	async _save(event, trigger) {
		event.dying = trigger.player;

		const dying = trigger.player;
		const acted = new Set();
		const prompt = `${get.translation(trigger.player)}濒死，是否帮助？`;

		outer: while (!trigger.player.isDead()) {
			const player = event.player;
			acted.add(player);

			// @ts-expect-error 部分模式存在Player#side
			const taoEnemyConfig =
				lib.config.tao_enemy &&
				dying.side !== player.side &&
				lib.config.mode != "identity" &&
				lib.config.mode != "guozhan" &&
				!dying.hasSkillTag("revertsave");
			/** @type {Partial<Result>} */
			let result = { bool: false };
			if (!taoEnemyConfig && player.canSave(dying) && player.isIn()) {
				result = await player
					.chooseToUse({
						filterCard(card, player, event) {
							event = event || _status.event;
							return lib.filter.cardSavable(card, player, event.dying);
						},
						filterTarget(card, player, target) {
							if (target != _status.event.dying) {
								return false;
							}
							if (!card) {
								return false;
							}
							var info = get.info(card);
							if (!info.singleCard || ui.selected.targets.length == 0) {
								var mod = game.checkMod(card, player, target, "unchanged", "playerEnabled", player);
								if (mod == false) {
									return false;
								}
								var mod = game.checkMod(card, player, target, "unchanged", "targetEnabled", target);
								if (mod != "unchanged") {
									return mod;
								}
							}
							return true;
						},
						prompt,
						prompt2: `当前体力：${dying.hp}`,
						ai1(card) {
							if (typeof card == "string") {
								var info = get.info(card);
								if (info.ai && info.ai.order) {
									if (typeof info.ai.order == "number") {
										return info.ai.order;
									} else if (typeof info.ai.order == "function") {
										return info.ai.order();
									}
								}
							}
							return 1;
						},
						ai2(target) {
							let effect_use = get.effect_use(target);
							if (effect_use <= 0) {
								return effect_use;
							}
							return get.effect(target);
						},
						type: "dying",
						targetRequired: true,
						dying,
					})
					.forResult();
			}/* else {
				result = { bool: false };
			}*/

			if (event.finished) {
				break;
			}
			if (result.bool) {
				if (dying.hp > 0 || trigger.nodying || dying.nodying || !dying.isAlive() || dying.isOut() || dying.removed) {
					trigger.untrigger();
					break;
				}
			} else {
				let next = player.next;
				const cacheNext = new Set();

				while (true) {
					if (acted.has(next) || cacheNext.has(next)) {
						break outer;
					}

					if (!next.isOut()) {
						event.player = next;
						break;
					}

					cacheNext.add(next);
					next = next.next;
				}
			}
		}
	},
	async chooseNumbers(event, trigger, player) {
		if (event.chooseTime && _status.connectMode && !game.online) {
			event.time = lib.configOL.choose_timeout;
			game.broadcastAll(function (time) {
				lib.configOL.choose_timeout = time;
			}, event.chooseTime);
		}
		let result;
		if (!Array.isArray(event.numbers)) {
			event.numbers = [];
		}
		if (!event.numbers.length) {
			event.list.forEach(function (item) {
				if (Array.isArray(item)) {
					if (["asc", "sort"].includes(item[0])) {
						event.numbers.push(item.slice(1).sort((a, b) => a - b)[0]);
					} else if (item[0] == "desc") {
						event.numbers.push(item.slice(1).sort((a, b) => b - a)[0]);
					} else {
						event.numbers.push(item[0]);
					}
				} else {
					event.numbers.push(item.min || 0);
				}
			});
		}
		if (event.isMine()) {
			result = await new Promise(function (resolve, reject) {
				_status.imchoosing = true;
				event.settleed = false;
				event.dialog = ui.create.dialog(event.prompt || "请调整以下数值", "forcebutton", "hidden");
				if (event.prompt2) {
					event.dialog.addText(event.prompt2);
				}
				event.switchToAuto = function () {
					if (!event.filterOk(event)) {
						if (!event.forced) {
							event._result = { bool: false };
						} else {
							event._result = "ai";
						}
					} else {
						event._result = "ai";
					}
					event.dialog.close();
					if (ui.confirm) {
						ui.confirm.close();
					}
					game.resume();
					_status.imchoosing = false;
					resolve(event._result);
				};

				function optionUpdate(select) {
					const index = parseInt(select.id.slice(6));
					const item = event.list[index],
						current = event.numbers[index];
					while (select.childElementCount) {
						select.removeChild(select.firstChild);
					}
					if (Array.isArray(item)) {
						let numbers;
						if (["asc", "sort"].includes(item[0])) {
							numbers = item.slice(1).sort((a, b) => a - b);
						} else if (item[0] == "desc") {
							numbers = item.slice(1).sort((a, b) => b - a);
						} else {
							numbers = item;
						}
						for (const num of numbers) {
							const option = document.createElement("option");
							option.innerHTML = num;
							if (event.optprompt) {
								if (typeof event.optprompt == "string") {
									option.innerHTML = event.optprompt.replace("#", num).replace("$", get.cnNumber(num, true));
								} else if (typeof event.optprompt == "function") {
									option.innerHTML = event.optprompt(num, index);
								}
							}
							option.value = num;
							if (num == current) {
								option.selected = true;
							}
							if (!event.filterSelect(num, index, event)) {
								option.disabled = true;
							}
							select.appendChild(option);
						}
					} else {
						let actual;
						const max = item.max || 9;
						if (event.optionSum) {
							actual = event.optionSum - event.numbers.reduce((sum, num) => sum + num, 0) + current;
						}
						for (let num = item.min || 0; num <= Math.min(actual || max, max); num += item.base || 1) {
							const option = document.createElement("option");
							option.innerHTML = num;
							if (event.optprompt) {
								if (typeof event.optprompt == "string") {
									option.innerHTML = event.optprompt.replace("#", num).replace("$", get.cnNumber(num, true));
								} else if (typeof event.optprompt == "function") {
									option.innerHTML = event.optprompt(num, index);
								}
							}
							option.value = num;
							if (num == current) {
								option.selected = true;
							}
							if (!event.filterSelect(num, index, event)) {
								option.disabled = true;
							}
							select.appendChild(option);
						}
					}
				}

				for (let index = 0; index < event.list.length; index++) {
					event.dialog.addText(event.list[index].prompt || "选择一个数值");
					const select = document.createElement("select");
					select.id = `select${index}`;
					select.classList.add("add-setting");
					select.style.margin = "0";
					select.style.width = "30%";
					select.style.position = "relative";
					select.onchange = function () {
						event.numbers[parseInt(this.id.slice(6))] = parseInt(this.value);
						event.dialog.content.querySelectorAll(`[id ^= 'select']`).forEach(select => optionUpdate(select));
						if (event.filterOk(event)) {
							if (event.forced) {
								ui.create.confirm("o");
							} else {
								ui.create.confirm("oc");
							}
						} else {
							if (!event.forced) {
								ui.create.confirm("c");
							} else if (ui.confirm) {
								ui.confirm.close();
							}
						}
					};
					optionUpdate(select);
					event.dialog.content.appendChild(select);
				}
				event.dialog.add(" <br> ");
				event.dialog.open();
				event.custom.replace.confirm = function (bool) {
					if (bool) {
						event._result = { bool: true, numbers: event.numbers };
					} else {
						event._result = { bool: false };
					}
					event.dialog.close();
					if (ui.confirm) {
						ui.confirm.close();
					}
					game.resume();
					_status.imchoosing = false;
					resolve(event._result);
				};
				if (event.filterOk(event)) {
					if (event.forced) {
						ui.create.confirm("o");
					} else {
						ui.create.confirm("oc");
					}
				} else {
					if (!event.forced) {
						ui.create.confirm("c");
					} else if (ui.confirm) {
						ui.confirm.close();
					}
				}
				game.pause();
				game.countChoose();
				event.choosing = true;
			});
		} else if (event.isOnline()) {
			result = await event.sendAsync();
		} else {
			result = "ai";
		}
		if (event.time) {
			game.broadcastAll(function (time) {
				lib.configOL.choose_timeout = time;
			}, event.time);
		}
		if ((!result || result == "ai" || (event.forced && !result.bool)) && event.processAI) {
			const numbers = event.processAI(event);
			if (typeof numbers == "boolean") {
				if (numbers == true) {
					result = { bool: true, numbers: event.numbers };
				} else {
					result = { bool: false };
				}
			} else if (Array.isArray(numbers)) {
				result = { bool: true, numbers };
			} else {
				result = { bool: false };
			}
		}
		event.result = result;
	},
	//变更武将牌
	async changeCharacter(event, trigger, player) {
		const rawPairs = [player.name1];
		if (player.name2 && lib.character[player.name2]) {
			rawPairs.push(player.name2);
		}
		event.rawPairs = rawPairs;
		const newPairs = event.newPairs;
		for (let name of newPairs) {
			if (!lib.character[name]) {
				console.warn(`警告：Player[${player.name}]试图将武将牌变更为不存在的武将:`, name);
				return;
			}
		}
		const removeSkills = [],
			addSkills = [];
		//进行Log
		if (event.log !== false) {
			//变更前后数量相同的情况
			if (rawPairs.length == newPairs.length) {
				for (let i = 0; i < Math.min(2, rawPairs.length); i++) {
					let rawName = rawPairs[i],
						newName = newPairs[i];
					if (rawName != newName) {
						game.log(
							player,
							`将${i == 0 ? "主" : "副"}将从`,
							`#b${get.translation(rawName)}`,
							"变更为了",
							`#b${get.translation(newName)}`
						);
					}
				}
			} else if (rawPairs.length == 1 && newPairs.length == 2) {
				game.log(
					player,
					"将单将",
					`#b${get.translation(rawPairs[0])}`,
					"变更为了双将",
					`#b${get.translation(newPairs[0])}+${get.translation(newPairs[1])}`
				);
			} else if (rawPairs.length == 2 && newPairs.length == 1) {
				game.log(
					player,
					"将双将",
					`#b${get.translation(rawPairs[0])}+${get.translation(rawPairs[1])}`,
					"变更为了单将",
					`#b${get.translation(newPairs[0])}`
				);
			}
		}
		//确定要失去和获得的技能
		//失去技能时全部失去，但获得技能时，非主公角色不能获得主公技。
		rawPairs.forEach(name => {
			removeSkills.addArray(lib.character[name][3]);
		});
		newPairs.forEach(name => {
			addSkills.addArray(
				lib.character[name][3].filter(skill => {
					const info = get.info(skill);
					if (!info || (info.zhuSkill && !player.isZhu2())) {
						return false;
					}
					return true;
				})
			);
		});
		//实际变更武将牌
		player.reinit2(newPairs);
		//操作武将牌堆
		if (_status.characterlist) {
			_status.characterlist.removeArray(newPairs);
			_status.characterlist.addArray(rawPairs);
		}
		//变更一下获得前后的技能
		const next = player.changeSkills(addSkills, removeSkills);
		if (event.log === false) {
			next.$handle = (current, add, remove, evt) => {
				if (add.length) {
					current.addSkill(add);
				}
				if (remove.length) {
					current.removeSkill(remove);
				}
			};
		}
		await next;
		//变更角色的所属势力。如果新将是双势力，重选一下势力。 国战不因换将而重选势力
		if (event.changeGroup !== false && get.mode() != "guozhan") {
			let newGroups = [];
			if (!player.isUnseen(1)) {
				newGroups = get.is.double(player.name1, true) || [get.character(player.name1, 1)];
			} else if (player.name2 && !player.isUnseen(2)) {
				newGroups = get.is.double(player.name2, true) || [get.character(player.name2, 1)];
			}
			if (newGroups.length > 1) {
				const { control: newGroup } = await player.chooseControl(newGroups).set("prompt", "请选择一个新的势力").forResult();
				if (newGroup != player.group) {
					await player.changeGroup(newGroup);
				}
			} else if (newGroups.length == 1 && newGroups[0] != player.group) {
				await player.changeGroup(newGroups[0]);
			}
		}
	},
	//变更技能
	async changeSkills(event, trigger, player) {
		//获取玩家当前已有的技能
		const ownedSkills = player.getSkills(true, false, false);
		//去重检查
		event.addSkill.unique();
		event.removeSkill.unique();
		//避免失去还没拥有的技能
		event.removeSkill = event.removeSkill.filter(skill => ownedSkills.includes(skill));
		const duplicatedSkills = event.addSkill.filter(skill => event.removeSkill.includes(skill));
		if (duplicatedSkills.length) {
			event.addSkill.removeArray(duplicatedSkills);
			event.removeSkill.removeArray(duplicatedSkills);
		}
		//if (!event.addSkill.length&&!event.removeSkill.length) return;
		//手动触发时机
		await event.trigger("changeSkillsBefore");
		await event.trigger("changeSkillsBegin");
		//处理失去和获得的技能
		if (event.$handle) {
			event.$handle(player, event.addSkill, event.removeSkill, event);
		} else {
			if (event.addSkill.length) {
				player.addSkill(event.addSkill);
				game.log(
					player,
					"获得了技能",
					...event.addSkill
						.filter(i => i in lib.translate)
						.map(i => {
							if (event.popup) {
								player.popup(i);
							}
							return "#g【" + get.translation(i) + "】";
						})
				);
			}
			if (event.removeSkill.length) {
				player.removeSkill(event.removeSkill);
				game.log(
					player,
					"失去了技能",
					...event.removeSkill
						.filter(i => i in lib.translate)
						.map(i => {
							if (event.popup) {
								player.popup(i);
							}
							return "#g【" + get.translation(i) + "】";
						})
				);
			}
		}
		//手动触发时机
		await event.trigger("changeSkillsEnd");
		await event.trigger("changeSkillsAfter");
	},
	//连接牌
	async connectCards(event, trigger, player) {
		const { source, cards, log } = event;
		const shown = cards.filter(card => get.is.connectedCard(card)),
			hidden = cards.filter(card => !shown.includes(card));
		event.shownCards = shown;
		event.hiddenCards = hidden;
		game.addConnectedCards(cards);
		if (log) {
			game.log(source, `连接了<span class="bluetext">${player == source ? "自己" : get.translation(player)}</span>的`, event.cards);
		}
	},
	//重置连接牌
	async resetConnectedCards(event, trigger, player) {
		const { source, cards, log } = event;
		game.removeConnectedCards(cards);
		if (log) {
			game.log(
				source,
				`重置了<span class="bluetext">${player == source ? "自己" : get.translation(player)}</span>的连接牌（`,
				event.cards,
				"）"
			);
		}
	},
	//增加明置手牌
	async addShownCards(event, _trigger, player) {
		const hs = player.getCards("h");
		const showingCards = event._cards.filter(showingCard => hs.includes(showingCard));
		const shown = player.getShownCards();

		for (const tag of event.gaintag) {
			player.addGaintag(showingCards, tag);
		}

		if (!(event.cards = showingCards.filter(showingCard => !shown.includes(showingCard))).length) {
			return;
		}

		game.log(player, "明置了", event.cards);
		//if (event.animate != false) player.$give(event.cards, player, false);
		await event.trigger("addShownCardsAfter");
	},
	//隐藏明置手牌
	async hideShownCards(event, _trigger, player) {
		const shown = player.getShownCards();
		const hidingCards = event._cards.filter(hidingCard => shown.includes(hidingCard));

		if (!hidingCards.length) {
			return;
		}

		if (event.gaintag.length) {
			for (const tag of event.gaintag) {
				player.removeGaintag(tag, hidingCards);
			}
		} else {
			const map = new Map();
			for (const hidingCard of hidingCards) {
				for (const tag of hidingCard) {
					if (!tag.startsWith("visible_")) {
						continue;
					}

					if (!map.has(tag)) {
						map.set(tag, []);
					}

					map.get(tag).push(hidingCard);
				}
			}

			for (const [tag, card] of map) {
				player.removeGaintag(tag, card);
			}
		}

		hidingCards.removeArray(player.getShownCards());
		if (!hidingCards.length) {
			return;
		}
		game.log(player, "取消明置了", (event.cards = hidingCards));
		//if (event.animate != false) player.$give(hidingCards, player, false);
		await event.trigger("hideShownCardsAfter");
	},
	//Execute the delay card effect
	//执行延时锦囊牌效果
	//TODO: 修改此处的虚拟牌/实体牌判断
	async executeDelayCardEffect(event, trigger, player) {
		const { card, target } = event;

		target.$phaseJudge(card);
		event.cancelled = false;
		event.cardName = card.viewAs || card.name;
		target.popup(event.cardName, "thunder");

		if (!lib.card[event.cardName].effect) {
			await game.delay();
			return;
		} else if (!lib.card[event.cardName].judge) {
			await game.delay();
			event.nojudge = true;
		}

		await event.trigger("executeDelayCardEffect");
		if (event.cancelled || event.nojudge) {
			return;
		}

		const judgeEvent = player.judge(card);
		const judge = event.judge;
		const judge2 = event.judge2;
		if (typeof judge === "function") {
			judgeEvent.judge = judge;
		}
		if (typeof judge2 === "function") {
			judgeEvent.judge2 = judge2;
		}

		const result = await judgeEvent.forResult();

		if (event.excluded) {
			delete event.excluded;
		} else {
			const cardName = event.cardName;
			if (event.cancelled && !event.direct) {
				const cardCancel = lib.card[cardName].cancel;
				if (cardCancel) {
					const next = game.createEvent(`${cardName}Cancel`);
					next.setContent(cardCancel);
					next.cards = [card];
					if (!card.viewAs) {
						const autoViewAs = get.autoViewAs(card);
						next.card = autoViewAs;
						autoViewAs.expired = card.expired;
					} else {
						const autoViewAs = get.autoViewAs(
							{
								name: cardName,
							},
							next.cards
						);
						next.card = autoViewAs;
						autoViewAs.expired = card.expired;
					}
					next.player = player;

					await next;
				}
			} else {
				var next = game.createEvent(cardName);
				next.setContent(lib.card[cardName].effect);
				next._result = result;
				next.cards = [card];
				if (!card.viewAs) {
					const autoViewAs = get.autoViewAs(card);
					next.card = autoViewAs;
					autoViewAs.expired = card.expired;
				} else {
					const autoViewAs = get.autoViewAs(
						{
							name: cardName,
						},
						next.cards
					);
					next.card = autoViewAs;
					autoViewAs.expired = card.expired;
				}
				next.player = player;
				await next;
			}
		}

		ui.clear();
		card.delete();
	},
	//Gift
	//赠予
	async gift(event, trigger, player) {
		const { target, cards } = event;

		for (const card of cards) {
			event.card = card;
			await event.trigger("gift");

			if (event.deniedGifts.includes(card)) {
				game.log(target, "拒绝了", player, "赠予的", card);
				await event.trigger("giftDeny");

				const next = player.loseToDiscardpile(card);
				next.log = false;
				await next;

				await event.trigger("giftDenied");

				continue;
			}

			game.log(player, "将", card, "赠予了", target);
			player.$give(card, target, false);

			await game.delay(0.5);
			await event.trigger("giftAccept");

			if (get.type(card) == "equip") {
				const next = target.equip(card);
				next.log = false;
				await next;
			} else {
				const next = target.gain(card, player);
				next.visible = true;
				await next;
			}

			await event.trigger("giftAccepted");
		}

		await game.delayx();
	},
	//Recast
	//重铸
	async recast(event, trigger, player) {
		const { cards } = event;

		game.log(player, "重铸了", cards);
		if (typeof event.recastingLose === "function") {
			const lose = event.trigger("recastingLose");
			const recast = event.recastingLose(player, cards);
			const lost = event.trigger("recastingLost");
			// ?
			event.recastingLosingEvents.push(...event.next.filter(value => value.name != "arrangeTrigger"));
			await lose;
			await recast;
			await lost;
		}

		await event.trigger("recast");

		if (typeof event.recastingGain === "function") {
			const gain = event.trigger("recastingGain");
			const recast = event.recastingGain(player, cards);
			const gained = event.trigger("recastingGained");
			// ?
			event.recastingGainingEvents.push(...event.next.filter(value => value.name != "arrangeTrigger"));
			await gain;
			await recast;
			await gained;
		}
	},
	//装备栏相关
	async disableEquip(event, trigger, player) {
		const cards = [];
		event.cards = cards;
		const slots = [];
		if (get.is.mountCombined()) {
			for (const slot of event.slots) {
				if (slot == "equip3" || slot == "equip4") {
					slots.add("equip3_4");
				} else {
					slots.add(slot);
				}
			}
		} else {
			slots.addArray(event.slots);
		}

		slots.sort();
		if (!slots.length) {
			return;
		}

		for (const slot of slots) {
			const left = player.countEnabledSlot(slot);

			let slot_key = slot;
			/** @type {number} */
			let lose;
			if (slot == "equip3_4") {
				lose = Math.min(left, Math.max(get.numOf(event.slots, "equip3"), get.numOf(event.slots, "equip4")));
				slot_key = "equip3";
			} else {
				lose = Math.min(left, get.numOf(event.slots, slot));
			}

			if (lose > 0) {
				game.log(player, "废除了" + get.cnNumber(lose) + "个", "#g" + get.translation(slot) + "栏");
				player.disabledSlots ??= {};
				player.disabledSlots[slot_key] ??= 0;
				player.disabledSlots[slot_key] += lose;

				const discardingCards = player.getCards("e", card => get.subtypes(card).includes(slot) && !event.cards.includes(card));
				if (discardingCards.length < 0) {
					continue;
				}

				/** @type {Partial<Result>} */
				let result;
				if (lose < left) {
					let source = event.source;
					const num = cards.length - (left - lose);
					if (!source || !source.isIn()) {
						source = player;
					}

					result = await source
						.chooseButton(
							[
								"选择" +
									(player == source ? "你" : get.translation(player)) +
									"的" +
									get.cnNumber(num) +
									"张" +
									get.translation(slot) +
									"牌置入弃牌堆",
								cards,
							],
							true,
							[1, num]
						)
						.set("filterOk", () => {
							const evt = get.event();

							let result = 0;
							for (const button of ui.selected.buttons) {
								if (evt.slot == "equip3_4") {
									result += Math.max(
										get.numOf(get.subtypes(button.link, false), "equip3"),
										get.numOf(get.subtypes(button.link, false), "equip4")
									);
								} else {
									result += get.numOf(get.subtypes(button.link, false), evt.slot);
								}
							}

							return result === evt.required;
						})
						.set("required", num)
						.set("slot", slot)
						.forResult();
				} else {
					result = { bool: true, links: discardingCards };
				}

				if (result.bool && result.links) {
					cards.addArray(result.links);
				}
			}
		}

		player.$syncDisable();
		if (cards.length > 0) {
			await player.loseToDiscardpile(cards);
		}
	},
	async enableEquip(event, trigger, player) {
		const { slots } = event;
		if (!slots.length) {
			return;
		}

		const slotsx = [...new Set(slots)].sort();
		for (const slot of slotsx) {
			const lost = player.countDisabledSlot(slot);
			const gain = Math.min(lost, get.numOf(slots, slot));
			if (lost <= 0) {
				continue;
			}

			game.log(player, "恢复了" + get.cnNumber(gain) + "个", "#g" + get.translation(slot) + "栏");
			player.disabledSlots ??= {};
			player.disabledSlots[slot] ??= 0;
			player.disabledSlots[slot] -= gain;
		}

		player.$syncDisable();
	},
	async expandEquip(event, trigger, player) {
		const { slots } = event;

		if (!slots.length) {
			return;
		}

		const slotsx = [];
		if (get.is.mountCombined()) {
			for (const slot of slots) {
				if (slot == "equip3" || slot == "equip4") {
					slotsx.add("equip3_4");
				} else {
					slotsx.add(slot);
				}
			}
		} else {
			slotsx.addArray(slots);
		}
		slotsx.sort();

		for (const slot of slotsx) {
			let expand = get.numOf(slots, slot);
			let slot_key = slot;
			if (slot == "equip3_4") {
				expand = Math.max(get.numOf(slots, "equip3"), get.numOf(slots, "equip4"));
				slot_key = "equip3";
			}
			game.log(player, "获得了" + get.cnNumber(expand) + "个额外的", "#g" + get.translation(slot) + "栏");

			player.expandedSlots ??= {};
			player.expandedSlots[slot_key] ??= 0;
			player.expandedSlots[slot_key] += expand;
		}

		player.$syncExpand();
	},
	//选择顶装备要顶的牌
	async replaceEquip(event, trigger, player) {
		let vcards = [];
		vcards.push(event.card[event.card.cardSymbol] ? event.card[event.card.cardSymbol] : get.autoViewAs(event.card, void 0, false));
		const specializedVCards = [],
			normalVCards = [];
		const replacedCards = [];
		vcards.forEach(card => {
			const info = get.info(card, false);
			(info?.customSwap ? specializedVCards : normalVCards).push(card);
		});
		specializedVCards.forEach(card => {
			const info = get.info(card, false);
			replacedCards.addArray(player.getVCards("e", card => info.customSwap(card)));
		});
		const types = normalVCards.reduce((types, card) => {
			return types.concat(get.subtypes(card, false));
		}, []);
		if (types.length > 0) {
			const slots = types,
				slotsx = [];
			if (get.is.mountCombined()) {
				slots.forEach(type => {
					if (type == "equip3" || type == "equip4") {
						slotsx.add("equip3_4");
					} else {
						slotsx.add(type);
					}
				});
			} else {
				slotsx.addArray(slots);
			}
			slotsx.sort();
			for (const slot of slotsx) {
				let left = player.countEquipableSlot(slot),
					lose;
				if (slot == "equip3_4") {
					lose = Math.min(left, Math.max(get.numOf(slots, "equip3"), get.numOf(slots, "equip4")));
				} else {
					lose = Math.min(left, get.numOf(slots, slot));
				}
				let result;
				if (lose <= 0) {
					continue;
				} else {
					const cards = player.getVEquips(slot).filter(card => {
						return !replacedCards.includes(card) && lib.filter.canBeReplaced(card, player);
					});
					if (cards.length > 0) {
						if (lose >= left) {
							result = { bool: true, links: cards };
						} else if (cards.length > left - lose) {
							let source = event.source;
							const num = cards.length - (left - lose);
							if (!source || !source.isIn()) {
								source = player;
							}
							const chooseEvent = source
								.chooseButton(["选择替换掉" + get.cnNumber(num) + "张" + get.translation(slot) + "装备牌", [cards, "vcard"]], true, [
									1,
									num,
								])
								.set("filterOk", function () {
									var evt = _status.event;
									return (
										ui.selected.buttons.reduce(function (num, button) {
											if (evt.slot == "equip3_4") {
												return (
													num +
													Math.max(
														get.numOf(get.subtypes(button.link, false), "equip3"),
														get.numOf(get.subtypes(button.link, false), "equip4")
													)
												);
											}
											return num + get.numOf(get.subtypes(button.link, false), evt.slot);
										}, 0) == evt.required
									);
								})
								.set("required", num)
								.set("slot", slot);
							result = await chooseEvent.forResult();
						}
					}
				}
				if (result?.links) {
					replacedCards.addArray(result.links);
				}
			}
		}
		event.result = {
			vcards: replacedCards,
			cards: player.getCards("e", i => replacedCards.includes(i[i.cardSymbol])),
		};
	},
	//装备牌
	async equip(event, trigger, player) {
		event.visible = true;
		//先确定这次的cards是什么成分也防止有人在equipBegin之类的时机往里面塞垃圾
		if (event.cards.length > 1 && event.cards.some(cardx => cardx.isViewAsCard)) {
			//实体牌数大于1且里面有虚拟假牌，终止此事件
			event.untrigger();
			return;
		}
		//进行第一轮先行判断，让所有装备牌的原主失去装备牌
		let loseCards = [];
		//判断card是不是假牌，如果是改为失去假牌
		if (event.card.isViewAsCard) {
			loseCards.add(event.card);
		} else {
			loseCards.addArray(event.cards);
		}
		if (loseCards.length) {
			const map = {};
			for (const i of loseCards) {
				var owner = get.owner(i, "judge");
				if (owner && (owner != player || get.position(i) != "e")) {
					var id = owner.playerid;
					if (!map[id]) {
						map[id] = [[], [], []];
					}
					map[id][0].push(i);
					var position = get.position(i);
					if (position == "h") {
						map[id][1].push(i);
					} else {
						map[id][2].push(i);
					}
				} else if (!event.updatePile && get.position(i) == "c") {
					event.updatePile = true;
				}
				if (event.visible) {
					i.addKnower("everyone");
				}
			}
			event.losing_map = map;
			for (const i in map) {
				const owner = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				const next = owner.lose(map[i][0], ui.special).set("type", "equip").set("forceDie", true).set("getlx", false);
				if (event.visible == true) {
					// @ts-expect-error ignore
					next.visible = true;
				}
				await next;
				event.relatedLose = next;
			}
			for (const [key, value] of lib.commonArea) {
				const list = (_status[value.areaStatusName] || []).filter(card => loseCards.includes(card));
				if (event[value.fromName] || list.length) {
					const next = game.createEvent("from_" + value.fromName);
					next.setContent(value.removeHandeler);
					next.cards = list;
					next.player = player;
					next.type = event.name;
					await next;
				}
			}
		}
		player.equiping = true;
		const handleEquip = async card => {
			const cards = event.cards;
			// @ts-expect-error ignore
			let cardInfo = get.info(card, false);
			if (player.isMin() || !player.canEquip(card)) {
				await game.cardsDiscard(cards);
				delete player.equiping;
				return;
			}
			let audioSubtype = get.subtype(card);
			if (audioSubtype == "equip6") {
				audioSubtype = "equip3";
			}
			// @ts-expect-error ignore
			game.broadcastAll(type => {
				if (lib.config.background_audio) {
					// @ts-expect-error ignore
					game.playAudio("effect", type);
				}
			}, audioSubtype);
			player.addVirtualEquip(card, cards);
			//player.$equip(card);
			//game.addVideo("equip", player, get.cardInfo(card));
			if (event.log != false) {
				const isViewAsCard = cards.length !== 1 || cards[0].name !== card.name;
				if (isViewAsCard && cards.length) {
					game.log(player, '装备了<span class="yellowtext">' + get.translation(card) + "</span>（", cards, "）");
				} else {
					game.log(player, "装备了", card);
				}
			}
			if (cardInfo.onEquip && (!cardInfo.filterEquip || cardInfo.filterEquip(card, player))) {
				if (Array.isArray(cardInfo.onEquip)) {
					for (var i = 0; i < cardInfo.onEquip.length; i++) {
						var next = game.createEvent("equip_" + card.name);
						next.setContent(cardInfo.onEquip[i]);
						next.player = player;
						next.card = event.vcards[0];
						await next;
					}
				} else {
					var next = game.createEvent("equip_" + card.name);
					next.setContent(cardInfo.onEquip);
					next.player = player;
					next.card = event.vcards[0];
					await next;
				}
				if (cardInfo.equipDelay != false) {
					await game.delayx();
				}
			}
			delete player.equiping;
			if (event.delay) {
				await game.delayx();
			}
		};
		//检查实体牌会不会被销毁
		let stop = false;
		const list = [];
		for (const cardx of event.cards) {
			if (cardx.willBeDestroyed("equip", player, event)) {
				cardx.selfDestroy(event);
				stop = true;
			} else if ("hejx".includes(get.position(cardx, true))) {
				stop = true;
			} else {
				list.add(cardx);
			}
		}
		if (stop) {
			if (list.length) {
				await game.cardsDiscard(list);
			}
			return;
		}

		event.vcards = [];
		const card = event.card;
		if (get.itemtype(card) === "card" && !card.isViewAsCard) {
			//cards = [card];
			event.card = card.cardSymbol ? card[card.cardSymbol] : get.autoViewAs(card, void 0, false);
			event.vcards.push(event.card);
		} else {
			if (get.itemtype(card) === "card" && card.isViewAsCard) {
				event.vcards.push(card[card.cardSymbol]);
			} else {
				event.vcards.push(card);
			}
		}
		//准备上装备时的处理
		let cardInfo = get.info(event.card, false);
		if (cardInfo.prepareEquip && (!cardInfo.filterEquip || cardInfo.filterEquip(event.card, player))) {
			const next = game.createEvent("prepare_" + event.card.name);
			next.setContent(cardInfo.prepareEquip);
			next.player = player;
			next.card = event.card;
			await next;
		}
		//同时播放所有装备牌的装备动画
		if (event.cards.length) {
			if (event.draw) {
				player.$draw(event.cards);
				await game.delay(0, 300);
			} else {
				// @ts-expect-error ignore
				game.broadcast(
					function (cards, player) {
						cards.forEach(card => {
							if (card.clone) {
								card.clone.moveDelete(player);
							}
						});
					},
					event.cards,
					player
				);
				event.cards.forEach(card => {
					if (card.clone) {
						card.clone.moveDelete(player);
						game.addVideo("gain2", player, get.cardsInfo([card.clone]));
					}
				});
			}
		}
		//将多张装备牌的牌替换事件合并为一个，废弃卡牌的replaceEquip自定义事件属性（反正没人用）
		const replaceEquipEvent = game.createEvent("replaceEquip");
		replaceEquipEvent.player = player;
		// @ts-expect-error ignore
		replaceEquipEvent.card = event.card;
		replaceEquipEvent.setContent("replaceEquip");
		const result = await replaceEquipEvent.forResult();
		// @ts-expect-error ignore
		if (get.itemtype(result?.cards) == "cards") {
			// @ts-expect-error ignore
			event.swapped = true;
			const loseEvent = player.lose(result.cards, "visible").set("type", "equip").set("getlx", false);
			loseEvent.swapEquip = true;
			if (get.info(event.card, true)?.loseThrow) {
				player.$throw(result.cards, 1000);
			}
			await loseEvent;
			// @ts-expect-error ignore
			for (let card of result.cards) {
				if (card.willBeDestroyed("discardPile", player, event)) {
					card.selfDestroy(event);
				}
			}
		}
		//就算是vcard也应该用lose处理
		/*result?.vcards?.forEach(card => {
			player.removeVirtualEquip(card);
		});*/
		//然后处理每一张装备牌的装备
		await handleEquip(event.card);
		//如果event.card是实体牌，改为虚拟牌
		if (get.itemtype(event.card) == "card") {
			event.card = event.card[event.card.cardSymbol];
		}
		if (event.updatePile) {
			game.updateRoundNumber();
		}
	},
	//装备栏 END
	async changeGroup(event, trigger, player) {
		event.originGroup = player.group;
		event.group ??= player.group;

		const group = event.group;
		game.addVideo("changeGroup", player, group);
		player.getHistory("custom").push(event);

		if (event.broadcast !== false) {
			game.broadcast(
				(player, group) => {
					player.group = group;
					player.node.name.dataset.nature = get.groupnature(group);
				},
				player,
				group
			);
		}

		player.group = group;
		player.node.name.dataset.nature = get.groupnature(group);

		if (event.log !== false) {
			game.log(player, "将势力变为了", "#y" + get.translation(group + 2));
		}
	},
	async chooseToDebate(event, trigger, player) {
		const { list } = event;

		/** @type {Player[]} */
		let targets = list.filter(target => target.countCards("h") > 0);

		/** @type {Partial<Result> | Partial<Result>[]} */
		let result;
		if (targets.length) {
			if (event.fixedResult) {
				targets = targets.removeArray(event.fixedResult.map(i => i[0]));
			}

			if (targets.length) {
				const next = player
					.chooseCardOL(targets, `${get.translation(player)}发起了议事，请选择展示的手牌`, true)
					.set("type", "debate")
					.set("source", player)
					.set("ai", event.ai ?? (() => Math.random()))
					.set(
						"aiCard",
						event.aiCard ??
							(target => {
								const getAi =
									get.event().ai ||
									function (card) {
										return Math.random();
									};
								let hs = target.getCards("h").sort((a, b) => getAi(b) - getAi(a));
								return { bool: true, cards: [hs[0]] };
							})
					);

				next._args.remove("glow_result");
				result = await next.forResult();
			} else {
				event.noselected = true;
				result = { bool: false };
			}
		} else {
			result = { bool: false };
		}

		const red = [];
		const black = [];
		const others = [];

		const otherColors = new Map();

		event.opinions = ["red", "black"];
		event.videoId = lib.status.videoId++;

		if (!event.noselected) {
			for (let i = 0; i < targets.length; ++i) {
				const card = result[i].cards[0];
				const target = targets[i];

				if (card == "red" || get.color(card, target) == "red") {
					red.push([target, card]);
				} else if (card == "black" || get.color(card, target) == "black") {
					black.push([target, card]);
				} else {
					others.push([target, card]);
				}
			}
		}

		if (event.fixedResult) {
			for (const list of event.fixedResult) {
				if (list[1] == "red" || get.color(list[1], list[0]) == "red") {
					red.push(list);
				} else if (list[1] == "black" || get.color(list[1], list[0]) == "black") {
					black.push(list);
				} else {
					others.push(list);
				}
				targets.push(list[0]);
			}
		}

		if (event.debateIgnore !== false) {
			event.opinions.add("others");
		} else {
			const colors = new Map();
			for (const list of others) {
				const color = typeof list[1] == "string" ? list[1] : get.color(list[1], list[0]);

				if (!colors.has(color)) {
					colors.set(color, []);
				}
				colors.get(color).push(list);
			}
			for (const color in colors) {
				event.opinions.add(color);
				otherColors.set(color, colors.get(color));
			}
		}

		event.targets = targets;
		// 再次失算了
		const colors = {
			red,
			black,
			others,
		};
		for (const [color, list] of otherColors) {
			colors[color] = list;
		}
		Object.assign(event, colors);
		await event.trigger("debateShowOpinion");

		/**
		 * @param {string} color
		 * @returns {[player: Player, card: Card | string][]}
		 */
		const getPairs = color => {
			switch (color) {
				case "red":
					return red;
				case "black":
					return black;
				case "others":
					return others;
				default:
					return otherColors.get(color);
			}
		};

		for (const color of event.opinions) {
			const pairs = getPairs(color);

			if (pairs.length) {
				const filteredPair = pairs.filter(card => get.itemtype(card[1]) == "card");
				game.log(
					[...new Set(pairs.map(pair => pair[0]))],
					color == "other" ? "没有意见" : '意见为<span class="firetext">' + get.translation(color) + "</span>",
					pairs.length ? "，展示了" : "",
					pairs.map(pair => pair[1])
				);
				for (const [target, card] of pairs) {
					await target.showCards(card).set("triggeronly", true);
				}
			}
		}

		game.broadcastAll(showDebateResult, get.translation(player), event.videoId, event, colors);

		await game.delay(4);

		// @ts-check
		game.broadcastAll("closeDialog", event.videoId);

		const opinions = event.opinions.filter(i => i != "others").toSorted((a, b) => getPairs(b).length - getPairs(a).length);

		const opinion = getPairs(opinions[0]).length > getPairs(opinions[1]).length ? opinions[0] : null;
		if (opinion) {
			game.log(player, "本次发起的议事结果为", opinion == "red" ? '<span class="firetext">红色</span>' : `#g${get.translation(opinion)}`);
		} else {
			game.log(player, "本次发起的议事无结果");
		}

		event.result = {
			bool: true,
			opinion,
			opinions: event.opinions,
			targets,
		};
		for (var color of event.opinions) {
			event.result[color] = getPairs(color);
		}

		if (event.callback) {
			const next = game.createEvent("debateCallback", false);
			next.player = player;
			next.debateResult = get.copy(event.result);
			next.setContent(event.callback);

			await next;
		}

		return;

		/**
		 * > 以前真的没出过问题吗
		 *
		 * @param {string} name
		 * @param {number} id
		 * @param {GameEvent} event
		 * @param {Record<string, [player: Player, card: Card | string][]>} colors
		 */
		function showDebateResult(name, id, event, colors) {
			const dialog = ui.create.dialog(name + "发起了议事", "hidden", "forcebutton");
			dialog.videoId = id;
			dialog.classList.add("scroll1");
			dialog.classList.add("scroll2");
			dialog.classList.add("fullwidth");

			if (event.opinions.includes("others")) {
				if (colors.other?.length > 2) {
					dialog.classList.add("fullheight");
				}
				for (const color of event.opinions) {
					if (color == "others" && !colors.other?.length) {
						continue;
					}
					dialog.addNewRow(
						{ item: get.translation(color), ratio: 1 },
						{
							item: colors[color].slice().map(list => {
								let element = get.copy(list[1]);
								if (typeof element == "string") {
									if (!lib.card["debate_" + element]) {
										lib.card["debate_" + element] = {};
										lib.translate["debate_" + element] = get.translation(element);
									}
									element = new lib.element.VCard(game.createCard("debate_" + element, " ", " "));
								}
								element._custom = button => {
									game.createButtonCardsetion(list[0].getName(true), button);
								};
								return element;
							}),
							ratio: 8,
						}
					);
				}
			} else {
				dialog.buttonss = [];
				dialog.add('<div class="text center">意见</div>');
				const buttons = ui.create.div(".buttons", dialog.content);
				dialog.buttonss.push(buttons);
				buttons.classList.add("popup");
				buttons.classList.add("guanxing");
				for (var color of event.opinions) {
					for (var list of colors[color]) {
						let button;
						if (typeof list[1] == "string") {
							button = ui.create.button(["", "", list[1]], "vcard", dialog.buttonss[0]);
						} else {
							button = ui.create.button(list[1], "card", dialog.buttonss[0]);
						}
						game.createButtonCardsetion(list[0].getName(true), button);
					}
				}
			}

			dialog.open();
		}
	},
	async delay(event) {
		await game[event.name].apply(game, event._args);
	},
	async chooseCooperationFor(event, trigger, player) {
		const { target } = event;

		const next = player.chooseButton([`选择和${get.translation(target)}的协力方式`, [event.cardlist, "vcard"]], true);
		next.set("ai", event.ai ?? (() => Math.random()));

		const result = await next.forResult();
		if (result.bool) {
			player.cooperationWith(target, result.links[0][2].slice(12), event.reason);
		}
	},

	// 苏婆！
	async chooseToPlayBeatmap(event, trigger, player) {
		if (game.online) {
			return;
		}
		if (_status.connectMode) {
			event.time = lib.configOL.choose_timeout;
		}
		event.videoId = lib.status.videoId++;
		//给其他角色看的演奏框
		game.broadcastAll(
			(player, id, beatmap) => {
				if (_status.connectMode) {
					lib.configOL.choose_timeout = (
						Math.ceil((beatmap.timeleap[beatmap.timeleap.length - 1] + beatmap.speed * 100 + (beatmap.current || 0)) / 1000) + 5
					).toString();
				}
				if (player == game.me) {
					return;
				}
				let str = `${get.translation(player)}正在演奏《" + beatmap.name + "》...`;
				if (!_status.connectMode) {
					str += "<br>（点击屏幕可以跳过等待AI操作）";
				}
				ui.create.dialog(str).videoId = id;
				if (ui.backgroundMusic) {
					ui.backgroundMusic.pause();
				}
				if (lib.config.background_audio) {
					if (beatmap.filename.startsWith("ext:")) {
						game.playAudio(beatmap.filename);
					} else {
						game.playAudio("effect", beatmap.filename);
					}
				}
			},
			player,
			event.videoId,
			event.beatmap
		);

		const beatmap = event.beatmap;
		/** @type {Partial<Result>} */
		let result;
		if (event.isMine()) {
			// 摆了，有空再修
			const { promise, resolve } = Promise.withResolvers();

			var timeleap = beatmap.timeleap.slice(0);
			var current = beatmap.current;
			//获取两个音符的时间间隔
			var getTimeout = function () {
				var time = timeleap.shift();
				var out = time - current;
				current = time;
				return out;
			};
			//初始化一堆变量
			var score = 0;
			var added = timeleap.length;
			var number_of_tracks = beatmap.number_of_tracks || 6;
			var custom_mapping = Array.isArray(beatmap.mapping);
			var mapping = custom_mapping ? beatmap.mapping.slice() : beatmap.mapping;
			var hitsound = beatmap.hitsound || "hitsound.wav";
			if (hitsound.startsWith("ext:")) {
				hitsound = lib.assetURL + "extension/" + hitsound.slice(4);
			} else {
				hitsound = lib.assetURL + "audio/effect/" + hitsound;
			}
			var hitsound_audio = new Audio(hitsound);
			hitsound_audio.volume = 0.25;
			var abs = 1;
			var node_pos = 0;
			if (custom_mapping) {
				node_pos = mapping.shift();
			} else if (mapping == "random") {
				abs = get.rand(number_of_tracks);
				node_pos = abs;
			}
			var combo = 0;
			var max_combo = 0;
			var nodes = [];
			var roundmenu = false;
			//隐藏菜单按钮
			if (ui.roundmenu && ui.roundmenu.display != "none") {
				roundmenu = true;
				ui.roundmenu.style.display = "none";
			}
			if (ui.backgroundMusic) {
				ui.backgroundMusic.pause();
			}
			event.settleed = false;
			//建个框框
			var dialog = ui.create.dialog("forcebutton", "hidden");
			event.dialog = dialog;
			event.dialog.textPrompt = event.dialog.add(
				'<div class="text center">' + (beatmap.prompt || "在音符滑条和底部判定区重合时点击屏幕！") + "</div>"
			);
			event.switchToAuto = function () {};
			event.dialog.classList.add("fixed");
			event.dialog.classList.add("scroll1");
			event.dialog.classList.add("scroll2");
			event.dialog.classList.add("fullwidth");
			event.dialog.classList.add("fullheight");
			event.dialog.classList.add("noupdate");
			event.dialog.style.overflow = "hidden";
			//结束后操作
			event.settle = function () {
				if (event.settleed) {
					return;
				}
				event.settleed = true;
				//评分
				var acc = Math.floor((score / (added * 5)) * 100);
				if (!Array.isArray(lib.config.choose_to_play_beatmap_accuracies)) {
					lib.config.choose_to_play_beatmap_accuracies = [];
				}
				lib.config.choose_to_play_beatmap_accuracies.push(acc);
				if (lib.config.choose_to_play_beatmap_accuracies.length > 5) {
					lib.config.choose_to_play_beatmap_accuracies.shift();
				}
				game.saveConfigValue("choose_to_play_beatmap_accuracies");
				var rank;
				if (acc == 100) {
					rank = ["SS", "metal"];
				} else if (acc >= 94) {
					rank = ["S", "orange"];
				} else if (acc >= 87) {
					rank = ["A", "wood"];
				} else if (acc >= 80) {
					rank = ["B", "water"];
				} else if (acc >= 65) {
					rank = ["C", "thunder"];
				} else {
					rank = ["D", "fire"];
				}
				event.dialog.textPrompt.innerHTML =
					'<div class="text center">演奏结束！<br>最大连击数：' + max_combo + "  精准度：" + acc + "%</div>";
				game.me.$fullscreenpop(
					'<span style="font-family:xinwei">演奏评级：<span data-nature="' + rank[1] + '">' + rank[0] + "</span></span>",
					null,
					null,
					false
				);
				//返回结果并继续游戏
				setTimeout(function () {
					event.dialog.close();
					_status.imchoosing = false;
					if (roundmenu) {
						ui.roundmenu.style.display = "";
					}
					if (ui.backgroundMusic && !isNaN(ui.backgroundMusic.duration)) {
						ui.backgroundMusic.play();
					}
					hitsound_audio.remove();
					resolve({
						bool: true,
						accuracy: acc,
						rank: rank,
					});
				}, 1000);
			};
			event.dialog.open();
			//操作容差
			var height = event.dialog.offsetHeight;
			var width = event.dialog.offsetWidth;
			var range1 = beatmap.range1 || [90, 110];
			var range2 = beatmap.range2 || [93, 107];
			var range3 = beatmap.range3 || [96, 104];
			var speed = beatmap.speed || 25;
			//初始化底部的条子
			var judger = ui.create.div("");
			judger.style["background-image"] = beatmap.judgebar_color || "linear-gradient(rgba(240, 235, 3, 1), rgba(230, 225, 5, 1))";
			judger.style["border-radius"] = "3px";
			judger.style.position = "absolute";
			judger.style.opacity = "0.3";
			var heightj = Math.ceil(height * (beatmap.judgebar_height || 0.1));
			judger.style.height = heightj + "px";
			judger.style.width = width + "px";
			judger.style.left = "0px";
			judger.style.top = height - heightj + "px";
			event.dialog.appendChild(judger);
			//生成每个音符
			var addNode = function () {
				var node = ui.create.div("");
				nodes.push(node);
				node.style["background-image"] = beatmap.node_color || "linear-gradient(rgba(120, 120, 240, 1), rgba(100, 100, 230, 1))";
				node.style["border-radius"] = "3px";
				node.style.position = "absolute";
				node.style.height = Math.ceil(height / 10) + "px";
				node.style.width = Math.ceil(width / number_of_tracks) - 10 + "px";
				node._position = get.utc();
				event.dialog.appendChild(node);

				node.style.left = Math.ceil((width * node_pos) / number_of_tracks + 5) + "px";
				node.style.top = "-" + Math.ceil(height / 10) + "px";
				ui.refresh(node);
				node.style.transition = "all " + speed * 110 + "ms linear";
				node.style.transform = "translateY(" + Math.ceil(height * 1.1) + "px)";
				node.timeout = setTimeout(function () {
					if (nodes.includes(node)) {
						nodes.remove(node);
						player.popup("Miss", "fire", false);
						if (player.damagepopups.length) {
							player.$damagepop();
						}
						combo = 0;
					}
				}, speed * 110);

				if (custom_mapping) {
					node_pos = mapping.shift();
				} else if (mapping == "random") {
					while (node_pos == abs) {
						node_pos = get.rand(number_of_tracks);
					}
					abs = node_pos;
				} else {
					node_pos += abs;
					if (node_pos > number_of_tracks - 1) {
						abs = -1;
						node_pos = number_of_tracks - 2;
					} else if (node_pos < 0) {
						abs = 1;
						node_pos = 1;
					}
				}
				if (timeleap.length) {
					setTimeout(function () {
						addNode();
					}, getTimeout());
				} else {
					setTimeout(
						function () {
							event.settle();
						},
						speed * 110 + 100
					);
				}
			};
			//点击时的判断操作
			var click = function () {
				if (!nodes.length) {
					return;
				}
				for (var node of nodes) {
					//用生成到点击的时间差来判断距离
					var time = get.utc();
					var top = (time - node._position) / speed;
					if (top > range1[1]) {
						continue;
					} else if (top < range1[0]) {
						return;
					}
					nodes.remove(node);
					clearTimeout(node.timeout);
					node.style.transform = "";
					node.style.transition = "all 0s";
					node.style.top = height * ((top - 10) / 100) + "px";
					ui.refresh(node);
					node.style.transition = "all 0.5s";
					node.style.transform = "scale(1.2)";
					node.delete();
					if (top >= range3[0] && top < range3[1]) {
						score += 5;
						player.popup("Perfect", "orange", false);
					} else if (top >= range2[0] && top < range2[1]) {
						score += 3;
						player.popup("Great", "wood", false);
					} else {
						score += 1;
						player.popup("Good", "soil", false);
					}
					if (player.damagepopups.length) {
						player.$damagepop();
					}
					combo++;
					max_combo = Math.max(combo, max_combo);
					hitsound_audio.currentTime = 0;
					if (hitsound_audio.paused) {
						Promise.resolve(hitsound_audio.play()).catch(() => void 0);
					}
					break;
				}
			};
			document.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", click);

			game.countChoose();
			setTimeout(
				() => {
					if (!lib.config.background_audio) {
						return;
					}
					if (beatmap.filename.startsWith("ext:")) {
						game.playAudio(beatmap.filename);
					} else {
						game.playAudio("effect", beatmap.filename);
					}
				},
				Math.floor(speed * 100 * (0.9 + beatmap.judgebar_height)) + beatmap.current
			);
			setTimeout(function () {
				addNode();
			}, getTimeout());

			result = await promise;
		} else if (event.isOnline()) {
			result = await event.sendAsync();
		} else {
			game.countChoose();

			const songDuration = beatmap.timeleap[beatmap.timeleap.length - 1] + beatmap.speed * 100 + 1000 + (beatmap.current || 0);
			const control = new AbortController();
			const songPlaybackDelay = delayExt(songDuration, { signal: control.signal, rejectOnAbort: false });

			const delays = [songPlaybackDelay];
			if (!_status.connectMode) {
				const skip = () => {
					Array.from(ui.window.getElementsByTagName("audio")).forEach(audio => {
						if (audio.currentSrc.includes(beatmap.filename.startsWith("ext:") ? beatmap.name : beatmap.filename)) {
							audio.remove();
						}
					});
					control.abort();
				};

				document.addEventListener(lib.config.touchscreen ? "touchend" : "click", skip);
				const skipDelay = delayExt(songDuration, { signal: control.signal, rejectOnAbort: false }).then(() => {
					document.removeEventListener(lib.config.touchscreen ? "touchend" : "click", skip);
				});
				delays.push(skipDelay);
			}

			await Promise.all(delays);

			_status.imchoosing = false;
			//Algorithm: Generate the random number range using the mean and the half standard deviation of accuracies of the player's last 5 plays
			//算法：用玩家的上5次游玩的准确率的平均数和半标准差生成随机数范围
			const chooseToPlayBeatmapAccuracies = (lib.config.choose_to_play_beatmap_accuracies || []).concat(
				Array.from(
					{
						length: 6 - (lib.config.choose_to_play_beatmap_accuracies || []).length,
					},
					() => get.rand(70, 100)
				)
			);
			const mean = Math.round(
				chooseToPlayBeatmapAccuracies.reduce((previousValue, currentValue) => previousValue + currentValue) /
					chooseToPlayBeatmapAccuracies.length
			);
			const half_standard_deviation = Math.round(
				Math.sqrt(
					chooseToPlayBeatmapAccuracies.reduce((previousValue, currentValue) => previousValue + Math.pow(currentValue - mean, 2), 0)
				) / 2
			);
			const acc = Math.min(
				Math.max(
					get.rand.apply(
						get,
						beatmap.aiAcc || [
							mean - half_standard_deviation - get.rand(0, half_standard_deviation),
							mean + half_standard_deviation + get.rand(0, half_standard_deviation),
						]
					),
					0
				),
				100
			);
			let rank;
			if (acc == 100) {
				rank = ["SS", "metal"];
			} else if (acc >= 94) {
				rank = ["S", "orange"];
			} else if (acc >= 87) {
				rank = ["A", "green"];
			} else if (acc >= 80) {
				rank = ["B", "water"];
			} else if (acc >= 65) {
				rank = ["C", "thunder"];
			} else {
				rank = ["D", "fire"];
			}
			if (event.dialog) {
				event.dialog.close();
			}
			if (event.control) {
				event.control.close();
			}

			result = {
				bool: true,
				accuracy: acc,
				rank: rank,
			};
		}

		game.broadcastAll(
			(id, time) => {
				if (_status.connectMode) {
					lib.configOL.choose_timeout = time;
				}
				const dialog = get.idDialog(id);
				if (dialog) {
					dialog.close();
				}
				if (ui.backgroundMusic && !isNaN(ui.backgroundMusic.duration)) {
					ui.backgroundMusic.play();
				}
			},
			event.videoId,
			event.time
		);

		event.result = result;

		return;

		/**
		 * 暂停x毫秒
		 *
		 * @param { number } ms - 毫秒数
		 * @param { Object } [option] - 选项
		 * @param { AbortSignal } [option.signal] - 中止信号
		 * @param { boolean } [option.rejectOnAbort = true] - 中止时是否拒绝Promise
		 * @returns { Promise<void> }
		 */
		function delayExt(ms, option = {}) {
			const { signal, rejectOnAbort = true } = option;
			if (signal?.aborted) {
				return rejectOnAbort ? Promise.reject(signal.reason) : Promise.resolve();
			}

			return new Promise((resolve, reject) => {
				const abort = () => {
					clearTimeout(timeout);
					if (rejectOnAbort) {
						reject(signal?.reason);
					} else {
						resolve();
					}
				};
				const done = () => {
					signal?.removeEventListener("abort", abort);
					clearTimeout(timeout);
					resolve();
				};
				let timeout = setTimeout(done, ms);
				signal?.addEventListener("abort", abort, { once: true });
			});
		}
	},

	async chooseToMove(event, trigger, player) {
		if (event.chooseTime && _status.connectMode && !game.online) {
			event.time = lib.configOL.choose_timeout;
			game.broadcastAll(time => {
				lib.configOL.choose_timeout = time;
			}, event.chooseTime);
		}

		let result;
		if (event.isMine()) {
			result = await new Promise(resolve => {
				// 兼容旧版本扩展使用guanxing_button喵
				ui.selected.guanxing_button = null;
				// 使用guanxing_buttons作为数组喵，因为buttons会被uncheck清除但是选中状态不会喵，导致不同步哦
				ui.selected.guanxing_buttons = [];

				const list = event.list;
				const filterMove = event.filterMove;
				const filterOk = event.filterOk;
				// 如果只有一行那么多选一般来说就没什么意义喵
				const canMultiselect = list.length > 1 && lib.config.choose_all_button && event.allowChooseAll;

				//_status.imchoosing = true;
				event.settleed = false;

				event.dialog = ui.create.dialog(event.prompt || "请选择要操作的牌", "hidden", "forcebutton");

				event.switchToAuto = () => {
					if (!filterOk(event.moved)) {
						if (!event.forced) {
							event._result = { bool: false };
						} else {
							event._result = "ai";
						}
					} else {
						event._result = {
							bool: true,
							moved: event.moved,
						};
					}
					event.dialog.close();
					if (ui.confirm) {
						ui.confirm.close();
					}
					game.resume();
					_status.imchoosing = false;
					setTimeout(function () {
						ui.arena.classList.remove("choose-to-move");
					}, 500);
					resolve(event._result);
				};
				event.dialog.classList.add("scroll1");
				event.dialog.classList.add("scroll2");
				event.dialog.classList.add("fullwidth");
				if (list.length > 2) {
					ui.arena.classList.add("choose-to-move");
					event.dialog.classList.add("fullheight");
				}

				/**
				 * @type { Card[][] } 保存每次移动后的对应实体牌的位置
				 */
				event.moved = [];
				/**
				 * @type { HTMLDivElement[] } 所有可移动的buttons数组
				 */
				var buttonss = [];
				event.buttonss = buttonss;
				/**
				 * 是否处于拖拽动画中(禁止其他的选择，拖拽)
				 */
				event.isPlayingAnimation = false;

				// 动画时长
				const animationDuration = lib.config.animation_choose_to_move ? 300 : 0;

				// 初始化触摸点位置和元素偏移量
				var touchStartX = 0;
				var touchStartY = 0;
				var elementOffsetX = 0;
				var elementOffsetY = 0;
				var currentElement;
				/**
				 * 每次移动后更新数据
				 */
				var updateButtons = function () {
					for (var i of buttonss) {
						// 更新每次移动后的对应实体牌的位置
						event.moved[i._link] = get.links(Array.from(i.childNodes));
						// 更新这个buttons的提示文本
						if (typeof i.textPrompt == "function") {
							i.previousSibling.innerHTML = '<div class="text center">' + i.textPrompt(event.moved[i._link]) + "</div>";
						}
					}
					if (filterOk(event.moved)) {
						ui.create.confirm("o");
					} else {
						if (!event.forced) {
							ui.create.confirm("c");
						} else if (ui.confirm) {
							ui.confirm.close();
						}
					}
				};

				/**
				 * 计算可以批量移动的按钮
				 *
				 * @param {Button[]} buttonList
				 * @param {HTMLDivElement} buttonsDiv
				 * @param {"first"|"last"} position
				 */
				var filterBatchMove = function (buttonList, buttonsDiv, position) {
					const parent = buttonList[0]?.parentElement;

					if (!parent) {
						return [];
					}

					const original = Array.from(parent.children);
					const filtered = [];
					const movedButtons = new Set();
					const eventMoved = Object.assign({}, event.moved);
					const addChildren =
						position === "first" ? b => buttonsDiv.insertBefore(b, buttonsDiv.firstChild) : b => buttonsDiv.appendChild(b);
					const addMovedList =
						position === "first" ? l => event.moved[buttonsDiv._link].unshift(l) : l => event.moved[buttonsDiv._link].push(l);

					for (const button of buttonList) {
						if (button.parentElement !== parent) {
							continue;
						}

						if (!filterMove(button, buttonsDiv._link, event.moved)) {
							continue;
						}

						filtered.push(button);
						movedButtons.add(button);
						addChildren(button);
						addMovedList(button.link);
					}

					let previous = null;

					for (const button of original) {
						if (!movedButtons.has(button)) {
							previous = button;
							continue;
						}

						if (!previous) {
							parent.insertBefore(button, parent.firstChild);
						} else {
							parent.insertBefore(button, previous.nextSibling);
						}

						previous = button;
					}

					Object.assign(event.moved, eventMoved);
					return filtered;
				};

				var updateSelectAllButtons = function () {
					const buttons = Array.from(event.dialog.querySelectorAll(".select-all"));

					for (const button of buttons) {
						const hasSelected = button.nextElementSibling.querySelector(".glow2");
						button.innerHTML = hasSelected ? "反选" : "全选";
					}
				};

				/**
				 * 移除所有符合条件的选中按钮
				 *
				 * @param { ((button: HTMLDivElement) => boolean)? } filter
				 */
				var clearSelected = function (filter) {
					for (let i = ui.selected.guanxing_buttons.length; i--; ) {
						const button = ui.selected.guanxing_buttons[i];

						if (!filter || filter(button)) {
							ui.selected.guanxing_buttons.splice(i, 1);
							button.classList.remove("glow2");
						}
					}

					ui.selected.guanxing_button = ui.selected.guanxing_buttons[0] || null;
					updateSelectAllButtons();
				};

				/**
				 * 选中所有传入的按钮
				 * 只能多选相同容器的按钮
				 *
				 * @param { HTMLDivElement[] } button
				 */
				var selectButtons = function (...buttons) {
					if (!buttons.length) {
						return;
					}

					const container = buttons[0].parentElement;
					clearSelected(button => button.parentElement !== container);
					buttons = buttons.filter(button => button.parentElement === container);

					buttons.forEach(button => {
						button.classList.add("glow2");
					});

					ui.selected.guanxing_buttons.addArray(buttons);
					ui.selected.guanxing_button = ui.selected.guanxing_buttons[0] || null;
					updateSelectAllButtons();
				};

				/**
				 * 切换按钮的选中状态
				 *
				 * @param {HTMLElement} button
				 * @returns {boolean}
				 */
				var toggleButton = function (button) {
					const nextState = !button.classList.contains("glow2");

					if (!nextState) {
						button.classList.remove("glow2");
						ui.selected.guanxing_buttons.remove(button);
						ui.selected.guanxing_button = ui.selected.guanxing_buttons[0] || null;
						updateSelectAllButtons();
					} else {
						if (!canMultiselect) {
							clearSelected(); // 对于不能多选就要清空之前的选择喵
						}
						selectButtons(button); // 这里要使用selectButtons排除其他容器的按钮喵
					}

					return nextState;
				};

				/**
				 * 反转容器中所有按钮的选择状态
				 *
				 * @param { HTMLDivElement } container
				 */
				var revertSelection = function (container) {
					const selecteds = new Set(ui.selected.guanxing_buttons.filter(button => button.parentElement === container));
					const nextSelecteds = Array.prototype.filter.call(container.childNodes, button => {
						return !selecteds.has(button);
					});

					clearSelected();
					selectButtons(...nextSelecteds);
				};

				/**
				 * 确认是否是拖拽开始
				 *
				 * 按下时，是不能判断出是否拖拽开始的，得在move事件才可以
				 *
				 * @this buttons
				 * @param { TouchEvent | MouseEvent } e
				 */
				var dragStart = function (e) {
					if (event.isPlayingAnimation) {
						return;
					}
					// 左键按下
					if (e instanceof MouseEvent) {
						if (e.which != 1) {
							return;
						}
					}
					// 单个手指按下
					if (window.TouchEvent && e instanceof TouchEvent) {
						if (e.touches.length != 1) {
							return;
						}

						e = e.touches[0];
					}
					// 判断按下的元素是否是card
					var cards = Array.from(this.children);
					var target = cards.find(card => {
						// Node.contains()
						return card.contains(e.target);
					});
					if (target) {
						if (!target.copy) {
							target.copy = target.cloneNode(true);
							target.copy.style.opacity = "0.75";
							target.copy.style.pointerEvents = "none";
						}
						touchStartX = e.clientX / game.documentZoom;
						touchStartY = e.clientY / game.documentZoom;
						elementOffsetX = target.getBoundingClientRect().x / game.documentZoom - touchStartX;
						elementOffsetY = target.getBoundingClientRect().y / game.documentZoom - touchStartY;
						currentElement = target;
						// e.stopPropagation();
					}
				};

				/**
				 * 判断出是否拖拽开始
				 *
				 * move事件是在button元素上监听的，而不是在dialog.content上。
				 *
				 * @this {Dialog}
				 * @param { TouchEvent | MouseEvent } e
				 */
				var onDrag = function (e) {
					if (event.isPlayingAnimation) {
						return;
					}
					if (e instanceof MouseEvent) {
						if (e.which != 1) {
							return;
						}
					}
					if (window.TouchEvent && e instanceof TouchEvent) {
						if (e.touches.length != 1) {
							return;
						}

						e = e.touches[0];
					}
					if (!currentElement || !currentElement.copy) {
						return;
					}

					// 获取点击位置
					const ex = e.clientX / game.documentZoom;
					const ey = e.clientY / game.documentZoom;

					// 如果是首次移动距离
					if (!document.contains(currentElement.copy)) {
						// 检查过小的移动距离，防止误触
						if (Math.abs(ex - touchStartX) < 10 && Math.abs(ey - touchStartY) < 10) {
							// 我们取消本次移动
							return;
						}
					}

					// 选中单个按钮
					clearSelected();
					selectButtons(currentElement);
					// 显示拖拽的元素
					/**
					 * @type { HTMLDivElement }
					 */
					var copy = currentElement.copy;
					if (!ui.window.contains(copy)) {
						copy.style.position = "absolute";
						copy.style.transition = "none";
						copy.style.zIndex = "100";
						copy.css({
							boxShadow: "0px 0px 7px 2px rgba(233, 30, 77, 0.95)",
						});
						ui.window.appendChild(copy);
					}

					copy.style.left = `${ex + elementOffsetX}px`;
					copy.style.top = `${ey + elementOffsetY}px`;

					// 当拖动到对话框最上面或者最下面我们滚动内容
					const bounds = event.dialog.getBoundingClientRect();
					const relY = e.clientY - bounds.top;
					const minY = bounds.height * 0.1;
					const maxY = bounds.height * 0.9;

					if (relY < minY) {
						// 让event.dialog.content向上滚动
						event.dialog.content.parentElement.scrollTop -= 15;
					} else if (relY > maxY) {
						// 让event.dialog.content向下滚动
						event.dialog.content.parentElement.scrollTop += 15;
					}
				};

				var dragEnd = function (e) {
					if (event.isPlayingAnimation) {
						return;
					}
					if (e instanceof MouseEvent) {
						if (e.which != 1) {
							return;
						}
					}
					if (window.TouchEvent && e instanceof TouchEvent) {
						if (e.changedTouches.length != 1) {
							return;
						}

						e = e.changedTouches[0];
					}

					const isDragging = ui.selected.guanxing_buttons.length === 1 && document.contains(ui.selected.guanxing_buttons[0]?.copy);

					buttonss.forEach(btn => {
						Array.from(btn.children).forEach(element => {
							if (element.copy && ui.window.contains(element.copy)) {
								ui.window.removeChild(element.copy);
							}
						});
					});

					// 如果点击的是全选按钮我们不处理喵
					if (e.target.classList.contains("select-all")) {
						return;
					}

					// 获取鼠标位置喵
					const clientX = e.clientX / game.documentZoom;
					const clientY = e.clientY / game.documentZoom;
					let aniamtionPromise = null;

					let spannedSingle = false;

					// 我们要判断是不是跨区的单个交换喵，但是如果是拖拽的情况下一定是单个交换喵，所以没必要进行额外判断喵
					if (!isDragging && ui.selected.guanxing_buttons.length === 1) {
						const curCard = ui.selected.guanxing_buttons[0];
						const target = e.target;
						if (!curCard.contains(target)) {
							const buttons = buttonss.find(b => {
								return b.contains(target);
							});
							if (buttons && !buttons.contains(curCard)) {
								// 此时用户点击了第一张牌，并在另一个区域点击了第二张牌喵
								spannedSingle = true;
							}
						}
					}

					// 如果是拖动移动、非多选或者跨区单个交换的情况下，我们走原来的代码喵
					if (isDragging || (!canMultiselect && ui.selected.guanxing_buttons.length === 1) || spannedSingle) {
						const curCard = ui.selected.guanxing_buttons[0];
						// 鼠标当前处于哪个元素上
						const target = document.elementFromPoint(clientX * game.documentZoom, clientY * game.documentZoom);
						// 相当于没移动，让它自己触发后续的click
						if (curCard.contains(target)) {
							return;
						}
						// 停止拖拽的目标处于哪个buttons区域中
						const buttons = buttonss.find(b => {
							// Node.contains()
							return b.contains(target);
						});
						// 不能拖拽到区域外
						if (!buttons) {
							return;
						}
						const children = Array.from(buttons.children);
						// 与card交换位置
						const card = children.find(element => element.contains(target));
						// 判断是否可以移动
						if (!card) {
							if (!filterMove(curCard, buttons._link, event.moved)) {
								return;
							}
						} else {
							if (!filterMove(card, curCard, event.moved)) {
								return;
							}
						}

						// 用flip动画移动过去喵
						if (!card) {
							// 如果拖动在按钮区域而不是按钮
							// 那么我们计算应该拖动到最前面还是最后面喵
							let position = null;

							if (buttons.hasChildNodes()) {
								const firstChild = children[0];
								if (clientX < firstChild.getBoundingClientRect().left / game.documentZoom) {
									position = "first";
								}
							} else {
								position = "last";
							}

							// 执行动画喵
							aniamtionPromise = game.$elementGoto(curCard, buttons, position, animationDuration);
						} else {
							// 如果拖动到按钮上面，我们交换两个按钮喵
							const buttons2 = curCard.parentElement;
							const pos1 = card.nextElementSibling || "last";
							const pos2 = curCard.nextElementSibling || "last";

							// 执行动画喵
							aniamtionPromise = game.$elementSwap(curCard, card, animationDuration);
						}

						clearSelected();
					} else if (ui.selected.guanxing_buttons.length) {
						// 获取当前点击的节点喵
						const target = e.target;
						// 寻找点击的是那个区域哦喵
						const buttons = buttonss.find(b => {
							return b.contains(target);
						});

						if (buttons !== target) {
							// 如果点击的是按钮或者区域外喵
							return; // 不产生任何效果喵，点击选中由其他位置实现喵，此处仅负责移动哦
						}

						// 判断一下要移动到哪里去哦喵
						let position = null;

						if (buttons.hasChildNodes()) {
							const firstChild = buttons.childNodes[0];

							if (clientX < firstChild.getBoundingClientRect().left / game.documentZoom) {
								position = firstChild; // 此处不可以使用"first"喵，会导致倒序哦喵
							}
						} else {
							position = "last";
						}

						const selected = filterBatchMove(ui.selected.guanxing_buttons, buttons, position !== "last" ? "first" : "last");
						const subPromises = [];

						for (const element of selected) {
							subPromises.push(game.$elementGoto(element, buttons, position, animationDuration));
						}

						aniamtionPromise = Promise.all(subPromises);
						clearSelected();
					}

					if (aniamtionPromise) {
						event.isPlayingAnimation = true;

						aniamtionPromise.then(() => {
							event.isPlayingAnimation = false;
							updateButtons();
						});
					}

					currentElement = null;
				};

				// 根据数据创建区域
				for (var i = 0; i < list.length; i++) {
					var tex = event.dialog.add('<div class="text center">' + list[i][0] + "</div>");
					tex.classList.add("choosetomove");
					if (canMultiselect) {
						const selectAll = ui.create.div(".select-all.popup.pointerdiv", event.dialog.content);
						selectAll.innerHTML = "全选";
						selectAll.listen(e => {
							revertSelection(e.target.nextElementSibling);
						});
					}
					var buttons = ui.create.div(".buttons.popup.guanxing", event.dialog.content);
					buttons.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", dragStart, true);
					event.dialog.addEventListener(lib.config.touchscreen ? "touchmove" : "mousemove", onDrag, true);
					event.dialog.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", dragEnd, true);
					buttonss.push(buttons);
					buttons._link = i;
					if (list[i][1]) {
						if (get.itemtype(list[i][1]) == "cards") {
							var cardsb = ui.create.buttons(list[i][1], "card", buttons);
							if (list[i][2] && typeof list[i][2] == "string") {
								for (var ij of cardsb) {
									ij.node.gaintag.innerHTML = get.translation(list[i][2]);
								}
							}
						} else if (list[i][1].length == 2) {
							ui.create.buttons(list[i][1][0], list[i][1][1], buttons);
						}
					}
					if (list[i][2] && typeof list[i][2] == "function") {
						buttons.textPrompt = list[i][2];
					}
				}
				var tex = event.dialog.add(
					'<div class="text center">点击或拖动两张牌以交换位置；点击一张牌并点击其他区域或拖动到其他区域以移动卡牌</div>'
				);
				tex.classList.add("choosetomove");

				event.dialog.open();
				updateButtons();

				event.custom.replace.button = function (button) {
					if (event.isPlayingAnimation) {
						return;
					}
					var node = button.parentNode;
					if (!buttonss.includes(node)) {
						return;
					}
					toggleButton(button);
				};
				event.custom.replace.confirm = function (bool) {
					if (event.isPlayingAnimation) {
						return;
					}
					event.buttonss.forEach(btn => {
						Array.from(btn.children).forEach(element => {
							if (element.copy && ui.window.contains(element.copy)) {
								ui.window.removeChild(element.copy);
								delete element.copy;
							}
						});
					});
					if (bool) {
						event._result = {
							bool: true,
							moved: event.moved,
						};
					} else {
						event._result = { bool: false };
					}
					event.dialog.close();
					if (ui.confirm) {
						ui.confirm.close();
					}
					game.resume();
					_status.imchoosing = false;
					setTimeout(function () {
						ui.arena.classList.remove("choose-to-move");
					}, 500);
					resolve(event._result);
				};

				game.pause();
				game.countChoose();
				event.choosing = true;
			});

			delete ui.selected.guanxing_button;
			delete ui.selected.guanxing_buttons;
		} else if (event.isOnline()) {
			result = await event.sendAsync();
		} else {
			result = "ai";
		}

		if (event.time) {
			game.broadcastAll(time => {
				lib.configOL.choose_timeout = time;
			}, event.time);
		}

		if ((!result || result == "ai" || (event.forced && !result.bool)) && event.processAI) {
			var moved = event.processAI(event.list);
			if (moved) {
				result = {
					bool: true,
					moved,
				};
			} else {
				result = { bool: false };
			}
		}

		event.result = result;
	},
	async showCharacter(event, trigger, player) {
		await event.trigger("showCharacterBegin");
		await event.trigger("showCharacterEnd");
		await event.trigger("showCharacterAfter");
		if (get.mode() == "identity" && player.isZhu) {
			await event.trigger("zhuUpdate");
		}
	},
	async removeCharacter(event, trigger, player) {
		player.$removeCharacter(event.num);
	},
	chooseUseTarget: [
		async (event, trigger, player) => {
			// 摆了
			let { card, cards, targets } = event;

			if (get.is.object(card) && event.viewAs === false) {
				card.isCard = true;
			}
			if (cards && get.itemtype(card) != "card") {
				card = get.copy(card);
				card.cards = cards.slice(0);
				event.card = card;
			}
			let evt = event.getParent("chooseToUse");
			if (get.itemtype(evt) !== "event") {
				evt = event;
			}
			if (!lib.filter.cardEnabled(card, player) || (event.addCount !== false && !lib.filter.cardUsable(card, player, evt))) {
				event.result = { bool: false };
				event.finish();
				return;
			}

			const info = get.info(card);
			let range;
			if (!info.notarget) {
				var select = get.copy(info.selectTarget);
				range = get.select(select);
				if (event.selectTarget) {
					range = get.select(event.selectTarget);
					if (typeof range == "number") {
						range = [range, range];
					}
				}
				game.checkMod(card, player, range, "selectTarget", player);
			}

			if (info.notarget || range[1] <= -1) {
				if (!info.notarget && range[1] <= -1) {
					for (let i = 0; i < targets.length; i++) {
						if (event.filterTarget) {
							if (!event.filterTarget(card, player, targets[i])) {
								targets.splice(i--, 1);
							}
						} else if (!player.canUse(card, targets[i], event.nodistance ? false : null, event.addCount === false ? null : true)) {
							targets.splice(i--, 1);
						}
					}
					if (targets.length) {
						event.targets2 = targets;
					} else {
						event.finish();
						return;
					}
				} else {
					event.targets2 = [];
				}
				if (event.forced) {
					return { bool: true };
				} else {
					const next = player.chooseBool();
					next.set(
						"prompt",
						event.prompt ||
							"是否" + (event.targets2.length ? "对" : "") + get.translation(event.targets2) + "使用" + get.translation(card) + "?"
					);
					if (event.hsskill) {
						next.setHiddenSkill(event.hsskill);
					}
					if (event.prompt2) {
						next.set("prompt2", event.prompt2);
					}
					next.set(
						"choice",
						(() => {
							let eff = 0;
							for (var i = 0; i < event.targets2.length; i++) {
								eff += get.effect(event.targets2[i], card, player, player);
							}
							return eff > 0;
						})()
					);
					if (typeof event.ai == "function") {
						next.set("ai", event.ai);
					}

					return next.forResult();
				}
			} else {
				if (event.filterTarget) {
					let targets = game.filterPlayer2(
						function (current) {
							return event.filterTarget(card, player, current);
						},
						null,
						true
					);
					if (targets.length < range[0]) {
						return { bool: false };
					} else if (!info.complexTarget && targets.length == range[0] && range[0] == range[1] && event.forced) {
						event.targets2 = targets;
						return { bool: true };
					}
				}

				const next = player.chooseTarget();
				next.set("_get_card", card);
				next.set(
					"filterTarget",
					event.filterTarget ||
						function (card, player, target) {
							if (!_status.event.targets.includes(target)) {
								return false;
							}
							if (!_status.event.nodistance && !lib.filter.targetInRange(card, player, target)) {
								return false;
							}
							return lib.filter.targetEnabledx(card, player, target);
						}
				);
				next.set("ai", event.ai || get.effect_use);
				next.set("selectTarget", event.selectTarget || lib.filter.selectTarget);
				if (event.nodistance) {
					next.set("nodistance", true);
				}
				if (event.forced) {
					next.set("forced", true);
				}
				if (event.addCount !== false) {
					next.set("addCount_extra", true);
				}
				next.set("targets", targets);
				next.set("prompt", event.prompt || "选择" + get.translation(card) + "的目标");
				if (event.prompt2) {
					next.set("prompt2", event.prompt2);
				}
				if (event.hsskill) {
					next.setHiddenSkill(event.hsskill);
				}

				return next.forResult();
			}
		},
		async (event, trigger, player, result) => {
			const { card, cards } = event;

			if (result.bool) {
				event.result = {
					bool: true,
					targets: event.targets2 || result.targets,
				};
				const args = [card, event.targets2 || result.targets];
				if (cards) {
					args.push(cards.slice());
				}
				const next = player.useCard(...args);
				next.oncard = event.oncard;
				if (cards) {
					next.cards = cards.slice(0);
				}
				if (event.nopopup) {
					next.nopopup = true;
				}
				if (event.animate === false) {
					next.animate = false;
				}
				if (event.throw === false) {
					next.throw = false;
				}
				if (event.addCount === false) {
					next.addCount = false;
				}
				if (event.noTargetDelay) {
					next.targetDelay = false;
				}
				if (event.nodelayx) {
					next.delayx = false;
				}
				if (event.logSkill) {
					if (typeof event.logSkill == "string") {
						next.skill = event.logSkill;
					} else if (Array.isArray(event.logSkill)) {
						player.logSkill.apply(player, event.logSkill);
					}
				}
				await next;
			} else {
				event.result = { bool: false };
			}
		},
	],
	async chooseToDuiben(event, trigger, player) {
		const { target } = event;

		event.title ??= "对策";
		event.namelist ??= ["全军出击", "分兵围城", "奇袭粮道", "开城诱敌"];
		event.translationList ??= [
			"若对方选择“开城诱敌”，你胜",
			"若对方选择“奇袭粮道”，你胜",
			"若对方选择“全军出击”，你胜",
			"若对方选择“分兵围城”，你胜",
		];
		event.ai ??= () => 1 + Math.random();

		const cardNameList = ["db_atk1", "db_atk2", "db_def1", "db_def2"];
		game.broadcastAll(loadImages, cardNameList, event.namelist, event.translationList);
		game.log(player, "向", target, "发起了", "#y" + event.title);

		const defendChoices = ["db_def1", "db_def2"];
		const attackChoices = ["db_atk1", "db_atk2"];
		const defendVCards = defendChoices.map(name => ["", "", name]);
		const attackVCards = attackChoices.map(name => ["", "", name]);
		const defendButtons = [defendVCards, "vcard"];
		const attackButtons = [attackVCards, "vcard"];
		const defendChoose = [event.title + "：请选择一种策略", defendButtons];
		const attackChoose = [event.title + "：请选择一种策略", attackButtons];

		let playerResult;
		let targetResult;
		if (_status.connectMode) {
			const playerChoose = [player, defendChoose, true];
			const targetChoose = [target, attackChoose, true];

			const choose = [playerChoose, targetChoose];
			/** @type {Record<string, Partial<Result>>} */
			const result = await player
				.chooseButtonOL(choose, () => {}, event.ai)
				.set("switchToAuto", () => {
					_status.event.result = "ai";
				})
				.set("processAI", () => {
					const buttons = _status.event.dialog.buttons;
					return {
						bool: true,
						links: [buttons.randomGet().link],
					};
				})
				.forResult();

			playerResult = result[player.playerid].links[0][2];
			targetResult = result[target.playerid].links[0][2];
		} else {
			const playerChooseEvent = player.chooseButton(defendChoose, true);
			playerChooseEvent.ai = event.ai;
			playerResult = await playerChooseEvent.forResult().then(result => result.links[0][2]);

			const targetChooseEvent = target.chooseButton(attackChoose, true);
			targetChooseEvent.ai = event.ai;
			targetResult = await targetChooseEvent.forResult().then(result => result.links[0][2]);
		}

		game.broadcast(() => void ui.arena.classList.add("thrownhighlight"));
		ui.arena.classList.add("thrownhighlight");
		game.addVideo("thrownhighlight1");
		target.$compare(game.createCard(targetResult, "", ""), player, game.createCard(playerResult, "", ""));
		game.log(target, "选择的策略为", "#g" + get.translation(targetResult));
		game.log(player, "选择的策略为", "#g" + get.translation(playerResult));
		await game.delay(0, lib.config.game_speed == "vvfast" ? 4000 : 1500);

		const playerResultType = playerResult.slice(6);
		const targetResultType = targetResult.slice(6);
		let resultPopup;
		if (playerResultType == targetResultType) {
			resultPopup = get.translation(player) + event.title + "成功";
			player.popup("胜", "wood");
			target.popup("负", "fire");
			game.log(player, "#g胜");
			event.result = { bool: true };
		} else {
			resultPopup = get.translation(player) + event.title + "失败";
			target.popup("胜", "wood");
			player.popup("负", "fire");
			game.log(target, "#g胜");
			event.result = { bool: false };
		}
		event.result.player = playerResult;
		event.result.target = targetResult;
		game.broadcastAll(popup => {
			const dialog = ui.create.dialog(popup);
			dialog.classList.add("center");
			setTimeout(() => void dialog.close(), 1000);
		}, resultPopup);

		const skill = event.getParent().name + "_" + (event.result.bool ? "true" + playerResult : "false");
		game.trySkillAudio(skill, player, true, null, null, [event, event.player]);

		await game.delay(2);

		game.broadcastAll(() => void ui.arena.classList.remove("thrownhighlight"));
		game.addVideo("thrownhighlight2");
		if (event.clear !== false) {
			game.broadcastAll(ui.clear);
		}

		return;

		/**
		 * @param {string[]} cardNameList
		 * @param {string[]} nameList
		 * @param {string[]} translationList
		 */
		function loadImages(cardNameList, nameList, translationList) {
			for (let i = 0; i < cardNameList.length; i++) {
				const name = nameList[i];
				const cardName = cardNameList[i];
				const translation = translationList[i];

				lib.card[cardName].image = "image/card/" + cardName + (nameList[0] == "全军出击" ? "" : "_" + name) + ".jpg";
				lib.translate[cardName] = name;
				lib.translate[cardName + "_info"] = translation;
			}
		}
	},
	async chooseToPSS(event, trigger, player) {
		const { target } = event;

		game.log(player, "对", target, "发起了猜拳");

		const pssChoices = ["pss_stone", "pss_scissor", "pss_paper"];
		const pssVCards = pssChoices.map(name => ["", "", name]);
		const pssButtons = [pssVCards, "vcard"];
		const pssChoose = ["猜拳：请选择一种手势", pssButtons];

		let playerResult;
		let targetResult;
		if (_status.connectMode) {
			const choose = [
				[player, pssChoose, true],
				[target, pssChoose, true],
			];

			/** @type {Record<string, Partial<Result>>} */
			const result = await player
				.chooseButtonOL(
					choose,
					() => {},
					() => 1 + Math.random()
				)
				.set("switchToAuto", () => {
					_status.event.result = "ai";
				})
				.set("processAI", () => {
					const buttons = _status.event.dialog.buttons;
					return {
						bool: true,
						links: [buttons.randomGet().link],
					};
				})
				.forResult();

			playerResult = result[player.playerid].links[0][2];
			targetResult = result[target.playerid].links[0][2];
		} else {
			const playerChooseEvent = player.chooseButton(pssChoose, true);
			playerChooseEvent.ai = () => 1 + Math.random();
			playerResult = await playerChooseEvent.forResult().then(result => result.links[0][2]);

			const targetChooseEvent = target.chooseButton(pssChoose, true);
			targetChooseEvent.ai = () => 1 + Math.random();
			targetResult = await targetChooseEvent.forResult().then(result => result.links[0][2]);
		}

		game.broadcastAll(() => void ui.arena.classList.add("thrownhighlight"));
		game.addVideo("thrownhighlight1");
		player.$compare(game.createCard(playerResult, "", ""), target, game.createCard(targetResult, "", ""));
		game.log(player, "选择的手势为", "#g" + get.translation(playerResult));
		game.log(target, "选择的手势为", "#g" + get.translation(targetResult));

		await game.delay(0, 1500);

		const mes = playerResult.slice(4);
		const tes = targetResult.slice(4);
		let str;
		if (mes == tes) {
			str = "二人平局";
			player.popup("平", "metal");
			target.popup("平", "metal");
			game.log("猜拳的结果为", "#g平局");
			event.result = { tie: true };
		} else {
			if ({ paper: "stone", scissor: "paper", stone: "scissor" }[mes] == tes) {
				str = get.translation(player) + "胜利";
				player.popup("胜", "wood");
				target.popup("负", "fire");
				game.log(player, "#g胜");
				event.result = { bool: true };
			} else {
				str = get.translation(target) + "胜利";
				target.popup("胜", "wood");
				player.popup("负", "fire");
				game.log(target, "#g胜");
				event.result = { bool: false };
			}
		}

		game.broadcastAll(str => {
			const dialog = ui.create.dialog(str);
			dialog.classList.add("center");
			setTimeout(() => void dialog.close(), 1000);
		}, str);
		await game.delay(2);

		game.broadcastAll(() => void ui.arena.classList.remove("thrownhighlight"));
		game.addVideo("thrownhighlight2");
		if (event.clear !== false) {
			game.broadcastAll(ui.clear);
		}
	},
	async cardsDiscard(event, trigger, player) {
		const { cards } = event;

		game.getGlobalHistory().cardMove.push(event);
		let withPile = false;
		for (const card of cards) {
			if (card.willBeDestroyed("discardPile", null, event)) {
				card.selfDestroy(event);
				continue;
			}

			if (get.position(card, true) == "c") {
				withPile = true;
			}

			card.discard();
		}
		if (withPile) {
			game.updateRoundNumber();
		}
		const waitings = [];
		for (const [key, value] of lib.commonArea) {
			const list = (_status[value.areaStatusName] || []).filter(card => cards.includes(card));
			if (event[value.fromName] || list.length) {
				const next = game.createEvent("from_" + value.fromName);
				next.setContent(value.removeHandeler);
				next.cards = cards;
				next.player = player;
				next.type = event.name;
				waitings.push(next);
			}
		}
		await Promise.all(waitings);
	},
	async orderingDiscard(event, trigger, player) {
		const cards = event.relatedEvent.orderingCards.filter(card => get.position(card, true) == "o");
		if (cards.length) {
			await game.cardsDiscard(cards);
		}
	},
	async cardsGotoOrdering(event, trigger, player) {
		const { cards } = event;
		game.getGlobalHistory().cardMove.push(event);
		let withPile = false;
		for (const card of cards) {
			if (card.willBeDestroyed("ordering", null, event)) {
				card.selfDestroy(event);
				continue;
			}
			if (get.position(card, true) == "c") {
				withPile = true;
			}
			card.fix();
			ui.ordering.appendChild(card);
		}
		if (withPile) {
			game.updateRoundNumber();
		}
		const waitings = [];
		for (const [key, value] of lib.commonArea) {
			const list = (_status[value.areaStatusName] || []).filter(card => cards.includes(card));
			if (event[value.fromName] || list.length) {
				const next = game.createEvent("from_" + value.fromName);
				next.setContent(value.removeHandeler);
				next.cards = cards;
				next.player = player;
				next.type = event.name;
				waitings.push(next);
			}
		}
		const evt = event.relatedEvent || event.getParent();
		if (!evt.orderingCards) {
			evt.orderingCards = [];
		}
		if (!evt.noOrdering && !evt.cardsOrdered) {
			evt.cardsOrdered = true;
			const next = game.createEvent("orderingDiscard", false);
			event.next.remove(next);
			evt.after.push(next);
			next.relatedEvent = evt;
			next.setContent("orderingDiscard");
			waitings.push(next);
		}
		if (!evt.noOrdering) {
			evt.orderingCards.addArray(cards);
		}
		event.result = { cards };
		await Promise.all(waitings);
	},
	async cardsGotoSpecial(event, trigger, player) {
		const { cards } = event;

		game.getGlobalHistory().cardMove.push(event);

		let withPile = false;
		for (const card of cards) {
			if (card.willBeDestroyed("special", null, event)) {
				card.selfDestroy(event);
				continue;
			}
			if (get.position(card, true) == "c") {
				withPile = true;
			}
			card.fix();
			ui.special.appendChild(card);
		}
		if (withPile) {
			game.updateRoundNumber();
		}

		const waitings = [];
		for (const [key, value] of lib.commonArea) {
			if (event[value.toName]) {
				const next = game.createEvent("lose_" + value.toName);
				next.setContent(value.addHandeler);
				next.player = player;
				next.cards = cards;
				next.relatedEvent = event;
				next.type = event.name;
				waitings.push(next);
			}
		}

		await Promise.all(waitings);
	},
	async cardsGotoPile(event, trigger, player) {
		const { cards } = event;
		const waitings = [];
		if (event.washCard) {
			waitings.push(event.trigger("washCard"));
			for (let i = 0; i < lib.onwash.length; ++i) {
				if (lib.onwash[i]() == "remove") {
					lib.onwash.splice(i--, 1);
				}
			}
		}
		game.getGlobalHistory().cardMove.push(event);
		if (!event._triggeronly) {
			game.$cardsGotoPile(event);
			for (const [key, value] of lib.commonArea) {
				const list = (_status[value.areaStatusName] || []).filter(card => cards.includes(card));
				if (event[value.fromName] || list.length) {
					const next = game.createEvent("from_" + value.fromName);
					next.setContent(value.removeHandeler);
					next.cards = cards;
					next.player = player;
					next.type = event.name;
					waitings.push(next);
				}
			}
		}

		await Promise.all(waitings);
	},
	async chooseToEnable(event, trigger, player) {
		const { source } = event;
		if (event.selectButton) {
			/** @type {string[]} */
			const list = Array(5);
			for (let i = 0; i < 5; i++) {
				list[i] = `equip${i + 1}`;
			}
			const realList = list.filter(current => player.hasDisabledSlot(current));
			if (!list.length) {
				return;
			}

			/** @type {Partial<Result>} */
			let result;
			if (event.selectButton[0] >= realList.length) {
				event.list = list;
				result = { links: list };
			} else {
				const sortedList = list.toSorted().map(current => [current, get.translation(current)]);
				event.list = sortedList;
				let str = `请选择恢复${get.translation(player.name)}的`;
				const selectButton = get.select(event.selectButton);
				if (selectButton[0] == selectButton[1]) {
					str += get.cnNumber(selectButton[0]);
				} else if (selectButton[1] == Infinity) {
					str += "至少" + get.cnNumber(selectButton[0]);
				} else {
					str += get.cnNumber(selectButton[0]) + "至" + get.cnNumber(selectButton[1]);
				}
				str += "个装备栏";

				const next = source.chooseButton(selectButton, true, [str, [sortedList, "tdnodes"]]);
				next.set("filterButton", button => player.hasDisabledSlot(button.link));

				event.ai ??= () => Math.random();
				next.set("ai", event.ai);

				result = await next.forResult();
			}
			event.result = { links: result.links };
			const slots = result.links;
			await player.enableEquip(slots);
		} else {
			/** @type {string[]} */
			const list = [];
			for (let i = 1; i <= 5; i++) {
				if (player.hasDisabledSlot(i)) {
					list.push("equip" + i);
				}
			}
			if (!list.length) {
				return;
			}

			/** @type {Partial<Result>} */
			let result;
			if (list.length == 1) {
				event.list = list;
				result = { control: list[0] };
			} else {
				const next = source.chooseControl(list);
				next.set("prompt", "请选择恢复" + get.translation(player.name) + "的一个装备栏");
				event.ai ??= (event, player, list) => list.randomGet();
				event.ai = event.ai(event.getParent(), player, list);
				next.ai = () => event.ai;
				result = await next.forResult();
			}
			event.result = { control: result.control };
			await player.enableEquip(result.control);
		}
	},
	async chooseToDisable(event, trigger, player) {
		const { source } = event;
		if (event.selectButton) {
			/** @type {string[]} */
			const list = Array(5);
			for (let i = 0; i < 5; i++) {
				list[i] = `equip${i + 1}`;
			}
			const realList = list.filter(current => player.hasEnabledSlot(current));
			if (event.horse) {
				if (list.includes("equip3") && (get.is.mountCombined() || list.includes("equip4"))) {
					list.push("equip3_4");
					realList.push("equip3_4");
				}
				list.remove("equip3", "equip4");
				realList.remove("equip3", "equip4");
			}
			if (!list.length) {
				return;
			}

			/** @type {Partial<Result>} */
			let result;
			if (event.selectButton[0] >= realList.length) {
				event.list = list;
				result = { links: list };
			} else {
				const sortedList = list.toSorted().map(current => [current, get.translation(current)]);
				event.list = sortedList;
				let str = `请选择废除${get.translation(player.name)}的`;
				const selectButton = get.select(event.selectButton);
				if (selectButton[0] == selectButton[1]) {
					str += get.cnNumber(selectButton[0]);
				} else if (selectButton[1] == Infinity) {
					str += "至少" + get.cnNumber(selectButton[0]);
				} else {
					str += get.cnNumber(selectButton[0]) + "至" + get.cnNumber(selectButton[1]);
				}
				str += "个装备栏";

				const next = source.chooseButton(selectButton, true, [str, [sortedList, "tdnodes"]]);
				next.set("filterButton", button => player.hasEnabledSlot(button.link));
				event.ai ??= () => Math.random();
				next.set("ai", event.ai);

				result = await next.forResult();
			}

			event.result = { links: result.links };
			const slots = result.links?.slice() ?? [];
			if (slots.includes("equip3_4")) {
				slots.remove("equip3_4");
				slots.add("equip3");
				slots.add("equip4");
			}
			await player.disableEquip(slots);
		} else {
			/** @type {string[]} */
			const list = [];
			for (let i = 1; i <= 5; i++) {
				if (player.hasEnabledSlot(i)) {
					list.push("equip" + i);
				}
			}
			if (event.horse) {
				if (list.includes("equip3") && (get.is.mountCombined() || list.includes("equip4"))) {
					list.push("equip3_4");
				}
				list.remove("equip3");
				list.remove("equip4");
			}
			if (!list.length) {
				return;
			}

			/** @type {Partial<Result>} */
			let result;
			if (list.length == 1) {
				event.list = list;
				result = { control: list[0] };
			} else {
				list.sort();
				event.list = list;

				const next = source.chooseControl(list);
				next.set("prompt", "请选择废除" + get.translation(player.name) + "的一个装备栏");
				event.ai ??= (event, player, list) => list.randomGet();
				event.ai = event.ai(event.getParent(), player, list);
				next.ai = () => event.ai;

				result = await next.forResult();
			}
			event.result = { control: result.control };
			if (result.control == "equip3_4") {
				await player.disableEquip(3, 4);
			} else {
				await player.disableEquip(result.control);
			}
		}
	},
	async swapEquip(event, trigger, player) {
		const { target } = event;
		const cards = (event.cards = [player.getCards("e"), target.getCards("e")]);
		await game
			.loseAsync({
				player: player,
				target: target,
				cards1: cards[0],
				cards2: cards[1],
			})
			.setContent("swapHandcardsx");

		for (const card of cards[1]) {
			const vcard = card[card.cardSymbol];
			if (vcard.cards?.length && vcard.cards.some(i => get.position(i, true) !== "o")) {
				continue;
			}
			await player.equip(vcard);
		}
		for (const card of cards[0]) {
			const vcard = card[card.cardSymbol];
			if (vcard.cards?.length && vcard.cards.some(i => get.position(i, true) !== "o")) {
				continue;
			}
			await target.equip(vcard);
		}
	},
	async disableJudge(event, trigger, player) {
		game.log(player, "废除了判定区");
		const js = player.getCards("j");
		player.storage._disableJudge = true;
		if (js.length) {
			await player.discard(js);
		}
		game.broadcastAll(function (player, card) {
			player.$disableJudge();
		}, player);
	},
	async enableJudge(event, trigger, player) {
		if (!player.storage._disableJudge) {
			return;
		}
		game.log(player, "恢复了判定区");
		game.broadcastAll(function (player) {
			player.$enableJudge();
		}, player);
	},
	/*----分界线----*/
	async phasing(event, trigger, player) {
		while (ui.dialogs.length) {
			ui.dialogs[0].close();
		}
		game.phaseNumber++;
		player.phaseNumber++;
		game.broadcastAll(
			function (player, player2, num, popup) {
				if (lib.config.glow_phase) {
					if (player2) {
						player2.classList.remove("glow_phase");
					}
					player.classList.add("glow_phase");
				}
				player.phaseNumber = num;
				if (popup && lib.config.show_phase_prompt) {
					player.popup("回合开始", null, false);
				}
			},
			player,
			_status.currentPhase,
			player.phaseNumber,
			!player.noPhaseDelay
		);
		_status.currentPhase = player;
		_status.discarded = [];
		game.syncState();
		game.addVideo("phaseChange", player);
		if (game.phaseNumber >= 1 && !lib.configOL.observeReady) {
			delete player._start_cards;
			if (lib.configOL.observe) {
				lib.configOL.observeReady = true;
				game.send("server", "config", lib.configOL);
			}
		}
		game.log();
		game.log(player, "的回合开始");
		player._noVibrate = true;
		if (get.config("identity_mode") != "zhong" && get.config("identity_mode") != "purple" && !_status.connectMode) {
			let num;
			switch (get.config("auto_identity")) {
				case "one":
					num = 1;
					break;
				case "two":
					num = 2;
					break;
				case "three":
					num = 3;
					break;
				case "always":
					num = -1;
					break;
				default:
					num = 0;
					break;
			}
			if (num && !_status.identityShown && game.phaseNumber > game.players.length * num && game.showIdentity) {
				if (!_status.video) {
					player.popup("显示身份");
				}
				_status.identityShown = true;
				game.showIdentity(false);
			}
		}
		player.ai.tempIgnore = [];
		if (ui.land && ui.land.player == player) {
			game.addVideo("destroyLand");
			ui.land.destroy();
		}

		await event.trigger("phaseBeginStart");
	},
	async toggleSubPlayer(event, trigger, player) {
		const list = event.list || player.storage.subplayer.skills.slice(0);
		list.remove(player.storage.subplayer.name2);
		event.list = list;

		/** @type {Partial<Result>} */
		let result;
		if (!event.directresult) {
			if (list.length > 1) {
				const dialog = ui.create.dialog("更换一个随从", "hidden");
				dialog.add([list, "character"]);
				result = await player.chooseButton(dialog, true).forResult();
			} else if (list.length == 1) {
				event.directresult = list[0];
			} else {
				return;
			}
		} else {
			if (!list.includes(event.directresult)) {
				return;
			}
		}

		if (!event.directresult) {
			if (result && result.bool && result.links[0]) {
				event.directresult = result.links[0];
			} else {
				return;
			}
		}

		let waiting = null;
		if (player.storage.subplayer) {
			const current = player.storage.subplayer.name2;
			if (event.directresult == current) {
				return;
			}
			player.storage[current].hp = player.hp;
			player.storage[current].maxHp = player.maxHp;
			player.storage[current].hujia = player.hujia;
			player.storage[current].hs = player.getCards("h");
			player.storage[current].es = player.getVCards("e");

			const next = player.lose(player.getCards("he"), ui.special);
			next._triggered = null;
			waiting = next;

			const cfg = player.storage[event.directresult];
			player.storage.subplayer.name2 = event.directresult;
			player.reinit(current, event.directresult, [cfg.hp, cfg.maxHp, cfg.hujia]);
			if (player.name == event.directresult || player.name1 == event.directresult) {
				const groupx = cfg.group || "qun";
				player.group = groupx;
				player.node.name.dataset.nature = get.groupnature(groupx);
			}
			if (cfg.hs.length) {
				player.directgain(cfg.hs);
			}
			if (cfg.es.length) {
				player.directequip(cfg.es);
			}
		}

		if (waiting != null) {
			await waiting;
		}
	},
	async exitSubPlayer(event, trigger, player) {
		if (player.storage.subplayer) {
			const current = player.storage.subplayer.name2;
			const goon = player.name == current || player.name1 == current;
			if (event.remove) {
				player.lose(player.getCards("he"), ui.discardPile)._triggered = null;
			} else {
				player.storage[current].hp = player.hp;
				player.storage[current].maxHp = player.maxHp;
				player.storage[current].hujia = player.hujia;
				player.storage[current].hs = player.getCards("h");
				player.storage[current].es = player.getVCards("e");
				player.lose(player.getCards("he"), ui.special)._triggered = null;
			}
			player.reinit(current, player.storage.subplayer.name, [
				player.storage.subplayer.hp,
				player.storage.subplayer.maxHp,
				player.storage.subplayer.hujia,
			]);
			if (goon) {
				const groupx = player.storage.subplayer.group || "qun";
				player.group = groupx;
				player.node.name.dataset.nature = get.groupnature(groupx);
			}
			player.update();
			if (event.remove) {
				if (player.storage[current].onremove) {
					player.storage[current].onremove(player, current);
				}
				delete player.storage[current];
				player.storage.subplayer.skills.remove(current);
				game.log(player, "牺牲了随从", "#g" + current);
			} else {
				game.log(player, "收回了随从", "#g" + current);
			}
			player.addSkill(player.storage.subplayer.skills);
		}

		if (player.storage.subplayer) {
			player.directgain(player.storage.subplayer.hs);
			player.directequip(player.storage.subplayer.es);
		}
		player.removeSkill("subplayer");

		if (event.remove) {
			await event.trigger("subPlayerDie");
		}
	},
	async callSubPlayer(event, trigger, player) {
		const list = player.getSubPlayers(event.tag);
		event.list = list;
		if (!event.directresult) {
			if (list.length > 1) {
				const dialog = ui.create.dialog("调遣一个随从", "hidden");
				dialog.add([list, "character"]);
				const result = await player.chooseButton(dialog, true).forResult();

				if (result && result.bool && result.links[0]) {
					event.directresult = result.links[0];
				}
			} else if (list.length == 1) {
				event.directresult = list[0];
			} else {
				return;
			}
		} else {
			if (!list.includes(event.directresult)) {
				return;
			}
		}

		if (!event.directresult) {
			await game.delay();
			return;
		}

		const cfg = player.storage[event.directresult];
		/** @type {string} */
		const source = cfg.source || player.name;
		const name = event.directresult;
		game.log(player, "调遣了随从", "#g" + name);
		player.storage.subplayer = {
			name: source,
			name2: event.directresult,
			hp: player.hp,
			maxHp: player.maxHp,
			hujia: player.hujia,
			skills: event.list.slice(0),
			hs: player.getCards("h"),
			es: player.getVCards("e"),
			intro2: cfg.intro2,
			group: player.group,
		};
		player.removeSkill(event.list);
		player.reinit(source, name, [cfg.hp, cfg.maxHp, cfg.hujia]);
		if (player.name == name || player.name1 == name) {
			const groupx = cfg.group || "qun";
			player.group = groupx;
			player.node.name.dataset.nature = get.groupnature(groupx);
		}
		player.addSkill("subplayer");
		player.lose(player.getCards("he"), ui.special)._triggered = null;
		if (cfg.hs.length) {
			player.directgain(cfg.hs);
		}
		if (cfg.es.length) {
			player.directequip(cfg.es);
		}

		await game.delay();
	},
	async addExtraTarget(event, trigger, player) {
		const { card, targets } = event;
		event.addedTargets = [];

		const info = get.info(card);
		for (const target of targets) {
			/** @type {Partial<Result>} */
			let result;
			if (target == event.target && event.addedTarget) {
				event.addedTargets.push(event.addedTarget);
				result = { bool: false };
			} else if (game.hasPlayer(current => info.filterAddedTarget(card, player, current, target))) {
				const next = player.chooseTarget(
					get.translation(event.card) + "：选择" + get.translation(target) + "对应的指向目标",
					(_card, player, target) => {
						const card = get.card();
						const info = get.info(card);
						return info.filterAddedTarget(card, player, target, _status.event.preTarget);
					},
					true
				);
				next.set("_get_card", card);
				next.set("preTarget", target);
				next.set("ai", target => get.effect(target, get.card(), player, _status.event.player));

				result = await next.forResult();
			} else {
				event.addedTargets.push(false);
				result = { bool: false };
			}

			if (result.bool) {
				event.addedTargets.push(result.targets[0]);
				player.line2([target, result.targets[0]]);
			}
		}
	},
	async reverseOrder(event, trigger, player) {
		const { card } = event;
		await game.delay();

		let choice;
		if (get.tag(card, "multineg")) {
			choice = player.previous.side == player.side ? "逆时针" : "顺时针";
		} else {
			choice = player.next.side == player.side ? "逆时针" : "顺时针";
		}

		const result = await player
			.chooseControl("顺时针", "逆时针", function (event, player) {
				return _status.event.choice || "逆时针";
			})
			.set("prompt", "选择" + get.translation(card) + "的结算方向")
			.set("choice", choice)
			.set("forceDie", true)
			.forResult();

		if (result && result.control == "顺时针") {
			const evt = event.getParent();
			const sorter = _status.currentPhase || player;
			evt.fixedSeat = true;
			evt.targets.sortBySeat(sorter);
			evt.targets.reverse();
			if (evt.targets[evt.targets.length - 1] == sorter) {
				evt.targets.unshift(evt.targets.pop());
			}
		}
	},
	async addJudgeCard(event) {
		const { target, card, cards } = event;
		if (!card?.cards.some(card => get.position(card, true) !== "o") && target.canAddJudge(card)) {
			await target.addJudge(card, cards);
		}
	},
	async equipCard(event) {
		const { card, target } = event;

		if (!card?.cards.some(card => get.position(card, true) !== "o")) {
			await target.equip(card);
		}
		//if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
	},
	async gameDraw(event, trigger, player) {
		const { num } = event;
		if (_status.brawl && _status.brawl.noGameDraw) {
			return;
		}

		let end = player;
		let numx = num;

		const waitings = [];
		do {
			if (typeof num == "function") {
				numx = num(player);
			}

			/*otherPile主要是针对那些用专属牌堆，不从一般牌堆摸牌的角色（如陈寿），该属性目前只有两个键值对，且都为函数
			 *getCards函数与获得牌相关，只传入要获得的牌数num作为参数
			 *discard与手气卡换牌后弃置牌相关，只传入要弃置的牌card作为参数
			 */
			const cards = [];
			const otherGetCards = event.otherPile?.[player.playerid]?.getCards;
			//先看有没有专属牌堆，再看其他的
			if (otherGetCards) {
				cards.addArray(otherGetCards(numx));
			} else if (player.getTopCards) {
				cards.addArray(player.getTopCards(numx));
			} else {
				cards.addArray(get.cards(numx));
			}
			//别问，问就是初始手牌要有标记 by 星の语
			//event.gaintag支持函数、字符串、数组。数组就是添加一连串的标记；函数的返回格式为[[cards1,gaintag1],[cards2,gaintag2]...]
			if (event.gaintag?.[player.playerid]) {
				const gaintag = event.gaintag[player.playerid];
				const list = typeof gaintag == "function" ? gaintag(numx, cards) : [[cards, gaintag]];
				game.broadcastAll(
					(player, list) => {
						for (let i = list.length - 1; i >= 0; i--) {
							player.directgain(list[i][0], null, list[i][1]);
						}
					},
					player,
					list
				);
			} else {
				player.directgain(cards);
			}

			if (player.singleHp === true && get.mode() != "guozhan" && (lib.config.mode != "doudizhu" || _status.mode != "online")) {
				const next = player.doubleDraw();
				waitings.push(next);
			}
			player._start_cards = player.getCards("h");
			player = player.next;
		} while (player != end);

		event.changeCard = get.config("change_card");
		if (
			_status.connectMode ||
			(lib.config.mode == "single" && _status.mode != "wuxianhuoli") ||
			(lib.config.mode == "doudizhu" && _status.mode == "online") ||
			(lib.config.mode != "identity" && lib.config.mode != "guozhan" && lib.config.mode != "doudizhu" && lib.config.mode != "single")
		) {
			event.changeCard = "disabled";
		}

		await Promise.all(waitings);

		if (event.changeCard == "disabled" || _status.auto || !game.me.countCards("h")) {
			return;
		}

		event.dialog = ui.create.dialog("是否使用手气卡？");
		ui.create.confirm("oc");
		event.custom.replace.confirm = bool => {
			_status.event.bool = bool;
			game.resume();
		};

		while (true) {
			if (event.changeCard == "once") {
				event.changeCard = "disabled";
			} else if (event.changeCard == "twice") {
				event.changeCard = "once";
			} else if (event.changeCard == "disabled") {
				event.bool = false;
				_status.imchoosing = false;
				break;
			}

			_status.imchoosing = true;
			event.switchToAuto = function () {
				_status.event.bool = false;
				game.resume();
			};
			await game.pause();
			_status.imchoosing = false;
			if (!event.bool) {
				break;
			}

			if (game.changeCoin) {
				game.changeCoin(-3);
			}
			/*otherPile主要是针对那些用专属牌堆，不从一般牌堆摸牌的角色（如陈寿），该属性目前只有两个键值对，且都为函数
			 *getCards函数与获得牌相关，只传入要获得的牌数num作为参数
			 *discard与手气卡换牌后弃置牌相关，只传入要弃置的牌card作为参数
			 */
			const hs = game.me.getCards("h");
			const cards = [];
			const otherGetCards = event.otherPile?.[game.me.playerid]?.getCards;
			const otherDiscacrd = event.otherPile?.[game.me.playerid]?.discard;
			//先弃牌
			game.addVideo("lose", game.me, [get.cardsInfo(hs), [], [], []]);
			for (let i = 0; i < hs.length; i++) {
				hs[i].removeGaintag(true);
				if (otherDiscacrd) {
					otherDiscacrd(hs[i]);
				} else {
					hs[i].discard(false);
				}
			}
			//再摸牌，先看有没有专属牌堆
			if (otherGetCards) {
				cards.addArray(otherGetCards(hs.length));
			} else {
				cards.addArray(get.cards(hs.length));
			}
			//添加标记相关
			//别问，问就是初始手牌要有标记 by 星の语
			//event.gaintag支持函数、字符串、数组。数组就是添加一连串的标记；函数的返回格式为[[cards1,gaintag1],[cards2,gaintag2]...]
			if (event.gaintag?.[game.me.playerid]) {
				const gaintag = event.gaintag[game.me.playerid];
				const list = typeof gaintag == "function" ? gaintag(hs.length, cards) : [[cards, gaintag]];
				for (let i = list.length - 1; i >= 0; i--) {
					game.me.directgain(list[i][0], null, list[i][1]);
				}
			} else {
				game.me.directgain(cards);
			}
			game.me._start_cards = game.me.getCards("h");
		}

		if (event.dialog) {
			event.dialog.close();
		}
		if (ui.confirm) {
			ui.confirm.close();
		}
		game.me._start_cards = game.me.getCards("h");
	},
	async phaseLoop(event, trigger, player) {
		let num = 1,
			current = player;
		while (current.getSeatNum() === 0) {
			current.setSeatNum(num);
			current = current.next;
			num++;
		}
		while (true) {
			if (game.players.includes(event.player)) {
				lib.onphase.forEach(i => i());
				const phase = event.player.phase();
				event.next.remove(phase);
				let isRoundEnd = false;
				if (lib.onround.every(i => i(phase, event.player))) {
					isRoundEnd = _status.roundSkipped;
					if (_status.isRoundFilter) {
						isRoundEnd = _status.isRoundFilter(phase, event.player);
					} else if (_status.seatNumSettled) {
						const seatNum = event.player.getSeatNum();
						if (seatNum != 0) {
							if (get.itemtype(_status.lastPhasedPlayer) != "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
								isRoundEnd = true;
							}
						}
					} else if (event.player == _status.roundStart) {
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
			await event.trigger("phaseOver");
			let findNext = current => {
				let players = game.players
					.slice(0)
					.concat(game.dead)
					.sort((a, b) => parseInt(a.dataset.position) - parseInt(b.dataset.position));
				let position = parseInt(current.dataset.position);
				for (let i = 0; i < players.length; i++) {
					if (parseInt(players[i].dataset.position) > position) {
						return players[i];
					}
				}
				return players[0];
			};
			event.player = findNext(event.player);
		}
	},
	async loadPackage(event, trigger, player) {
		for (const pack of event.packages) {
			const [path, file] = pack.split("/");
			window.game = game;
			await lib.init.promises.js(lib.assetURL + path, file);
			if (!lib.config.dev) {
				delete window.game;
			}

			const characters = lib.imported.character;
			const cards = lib.imported.card;
			for (const charaPackName in characters) {
				const charaPack = characters[charaPackName];
				if (charaPack.character) {
					const characterPack = lib.characterPack[charaPackName];
					if (characterPack) {
						Object.assign(characterPack, charaPack.character);
					} else {
						lib.characterPack[charaPackName] = charaPack.character;
					}
				}
				if (charaPack.forbid && charaPack.forbid.includes(lib.config.mode)) {
					continue;
				}
				if (charaPack.mode && charaPack.mode.includes(lib.config.mode) == false) {
					continue;
				}

				// ???
				// if (Array.isArray(lib[j]) && Array.isArray(character[i][j])) {
				// 	lib[j].addArray(character[i][j]);
				// 	continue;
				// }
				for (const itemName in charaPack) {
					if (itemName == "name" || itemName == "mode" || itemName == "forbid" || itemName == "characterSort") {
						continue;
					}
					const item = charaPack[itemName];
					for (const termName in item) {
						const term = item[termName];

						if (itemName == "character") {
							const character = get.convertedCharacter(term);

							if (character.isBoss || character.isHiddenBoss) {
								lib.config.forbidai.add(termName);
							}
							if (lib.config.forbidai_user && lib.config.forbidai_user.includes(termName)) {
								lib.config.forbidai.add(termName);
							}
							for (const skill of character.skills) {
								lib.skilllist.add(skill);
							}
						}
						if (itemName == "translate" && termName == charaPackName) {
							lib[itemName][termName + "_character_config"] = term;
						} else {
							if (lib[itemName][termName] == null) {
								Object.defineProperty(lib[itemName], termName, Object.getOwnPropertyDescriptor(item, termName));
							} else if (Array.isArray(lib[itemName][termName]) && Array.isArray(term)) {
								lib[itemName][termName].addArray(term);
							} else {
								console.log(
									`duplicated ${itemName} in character ${charaPackName}:\n${termName}:\nlib.${itemName}.${termName}`,
									lib[itemName][termName],
									`\ncharacter.${charaPackName}.${itemName}.${termName}`,
									term
								);
							}
						}
					}
				}

				for (const cardPackName in cards) {
					lib.cardPack[cardPackName] ??= [];
					const cardPack = lib.cardPack[cardPackName];
					if (cards[cardPackName].card) {
						for (const cardName in cards[cardPackName].card) {
							if (!cards[cardPackName].card[cardName].hidden && cards[cardPackName].translate[cardName + "_info"]) {
								cardPack.push(cardName);
							}
						}
					}
					for (const itemName in cards[cardPackName]) {
						const item = cards[cardPackName][itemName];
						if (itemName == "name" || itemName == "mode" || itemName == "forbid") {
							continue;
						}
						if (itemName == "list") {
							continue;
						}
						for (const termName in item) {
							const term = item[termName];
							if (itemName == "skill" && termName[0] == "_" && !lib.config.cards.includes(cardPackName)) {
								continue;
							}
							if (itemName == "translate" && termName == cardPackName) {
								lib[itemName][termName + "_card_config"] = term;
							} else {
								if (lib[itemName][termName] == undefined) {
									Object.defineProperty(lib[itemName], termName, Object.getOwnPropertyDescriptor(item, termName));
								} else {
									console.log(
										`duplicated ${itemName} in card ${cardPackName}:\n${termName}\nlib.${itemName}.${termName}`,
										lib[itemName][termName],
										`\ncard.${cardPackName}.${itemName}.${termName}`,
										term
									);
								}
							}
						}
					}
				}
			}
		}
	},
	async loadMode(event) {
		await game.loadModeAsync(event.mode, exports => {
			event.result = exports;
			if (lib.imported.mode[event.mode]) {
				delete lib.imported.mode[event.mode];
			}
		});
	},
	async forceOver(event) {
		while (ui.controls.length) {
			ui.controls[0].close();
		}
		while (ui.dialogs.length) {
			ui.dialogs[0].close();
		}
		if (event.bool != "noover") {
			game.over(event.bool);
		}
		if (event.callback) {
			event.callback();
		}
	},
	async arrangeTrigger(event, trigger, player) {
		const doingList = event.doingList.slice(0);

		while (doingList.length > 0) {
			event.doing = doingList.shift();
			while (true) {
				if (trigger.filterStop && trigger.filterStop()) {
					return;
				}
				const usableSkills = event.doing.todoList.filter(info => {
					return lib.filter.filterTrigger(trigger, info.player, event.triggername, info.skill, info.indexedData);
				});
				if (usableSkills.length == 0) {
					break;
				} else {
					event.doing.todoList = event.doing.todoList.filter(i => i.priority <= usableSkills[0].priority);
					//firstDo时机和lastDo时机不进行技能优先级选择
					if (get.itemtype(event.doing.player) !== "player") {
						event.current = usableSkills[0];
					} else {
						event.choice = usableSkills.filter(n => n.priority == usableSkills[0].priority);
						//现在只要找到一个同优先度技能为silent，或没有技能描述的技能 便优先执行该技能
						const silentSkill = event.choice.find(item => {
							const skillInfo = lib.skill[item.skill];
							return skillInfo && (skillInfo.silent || !lib.translate[item.skill]);
						});
						if (silentSkill) {
							event.current = silentSkill;
						} else {
							const currentChoice = event.choice[0],
								skillsToChoose = event.choice.map(i => i.skill).unique();
							if (event.choice.length === 1 || skillsToChoose.length === 1) {
								event.current = currentChoice;
							} else {
								const currentPlayer = currentChoice.player;
								const next = currentPlayer.chooseControl(
									skillsToChoose.map(skill => get.skillTranslation(skill, currentPlayer, true))
								);
								next.set("prompt", "选择下一个触发的技能");
								next.set("forceDie", true);
								next.set("arrangeSkill", true);
								next.set("includeOut", true);
								const result = await next.forResult();
								//千里走单骑全责，把敌人打死可能会打断chooseControl
								if (result) {
									event.current = usableSkills.find(info => info.skill == skillsToChoose[result.index]);
								} else {
									event.current = usableSkills[0];
								}
							}
						}
					}
					event.doing.doneList.push(event.current);
					event.doing.todoList.remove(event.current);
					const result = await game
						.createTrigger(event.triggername, event.current.skill, event.current.player, trigger, event.current.indexedData)
						.forResult();
					if (get.itemtype(event.doing.player) === "player" && result === "cancelled") {
						for (let i = 0; i < event.doing.todoList.length; i++) {
							if (event.current.skill === event.doing.todoList[i].skill) {
								event.doing.doneList.push(event.doing.todoList.splice(i--, 1)[0]);
							}
						}
					}
				}
			}
		}
	},
	async createTrigger(event, trigger, player) {
		const info = get.info(event.skill);

		if (!game.expandSkills(player.getSkills().concat(lib.skill.global)).includes(event.skill)) {
			const hidden = player.hiddenSkills.slice(0);
			const invisible = player.invisibleSkills.slice(0);
			game.expandSkills(hidden);
			game.expandSkills(invisible);
			if (hidden.includes(event.skill)) {
				if (!info.silent && player.hasSkillTag("nomingzhi", false, null, true)) {
					return;
				} else if (
					(!info.direct && typeof info.cost !== "function") ||
					(get.is.locked(event.skill, player) && typeof info.cost == "function")
				) {
					await event.trigger("triggerHidden");
				} else {
					event.skillHidden = true;
				}
			} else if (invisible.includes(event.skill)) {
				await event.trigger("triggerInvisible");
			} else {
				let flag = true;
				for (const skill in player.additionalSkills) {
					if (skill.startsWith("hidden:")) {
						continue;
					}

					if (!game.expandSkills(player.additionalSkills[skill]).includes(event.skill)) {
						continue;
					}

					flag = false;
					break;
				}
				if (flag) {
					return;
				}
			}
		}

		if (event.cancelled) {
			return;
		}
		if (event.skill.startsWith("player_when_")) {
			lib.skill[event.skill].triggered = true;
		}

		/** @type {Partial<Result>} */
		let result;
		if (event.revealed || info.forced) {
			result = { bool: true };
		} else {
			const checkFrequent = info => {
				if (player.hasSkillTag("nofrequent", false, event.skill)) {
					return false;
				}
				if (typeof info.frequent == "boolean") {
					return info.frequent;
				}
				if (typeof info.frequent == "function") {
					return info.frequent(trigger, player, event.triggername, event.indexedData);
				}
				if (info.frequent == "check" && typeof info.check == "function") {
					return info.check(trigger, player, event.triggername, event.indexedData);
				}
				return false;
			};

			if (info.direct) {
				if (player.isUnderControl()) {
					game.swapPlayerAuto(player);
				}
				result = { bool: true };
				event._direct = true;
			} else if (typeof info.cost === "function") {
				if (checkFrequent(info)) {
					event.frequentSkill = true;
				}
				if (player.isUnderControl()) {
					game.swapPlayerAuto(player);
				}
				//创建cost事件
				const next = game.createEvent(`${event.skill}_cost`);
				next.player = player;
				if (event.frequentSkill) {
					next.set("frequentSkill", event.skill);
				}
				next.set("forceDie", true);
				next.set("includeOut", true);
				next._trigger = trigger;
				next.triggername = event.triggername;
				next.skillHidden = event.skillHidden;
				next.indexedData = event.indexedData;
				if (info.forceDie) {
					next.forceDie = true;
				}
				if (info.forceOut) {
					next.includeOut = true;
				}
				next.skill = event.skill;
				next.setContent(info.cost);

				result = await next.forResult();
			} else {
				if (checkFrequent(info)) {
					event.frequentSkill = true;
				}
				let str;
				const check = info.check;
				if (info.prompt) {
					str = info.prompt;
				} else if (typeof info.logTarget == "string") {
					str = get.prompt(event.skill, trigger[info.logTarget], player);
				} else if (typeof info.logTarget == "function") {
					const logTarget = info.logTarget(trigger, player, event.triggername, event.indexedData);
					if (get.itemtype(logTarget).startsWith("player")) {
						str = get.prompt(event.skill, logTarget, player);
					}
				} else {
					str = get.prompt(event.skill, null, player);
				}
				if (typeof str == "function") {
					str = str(trigger, player, event.triggername, event.indexedData);
				}

				const next = player.chooseBool(str);
				if (event.frequentSkill) {
					next.set("frequentSkill", event.skill);
				}
				next.set("forceDie", true);
				next.set("includeOut", true);
				next.ai = () => !check || check(trigger, player, event.triggername, event.indexedData);

				if (typeof info.prompt2 == "function") {
					next.set("prompt2", info.prompt2(trigger, player, event.triggername, event.indexedData));
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

				result = await next.forResult();
			}
		}

		if (result && result.control) {
			result.bool = !result.control.includes("cancel");
		}
		if (!result || !result.bool) {
			if (info.oncancel) {
				info.oncancel(trigger, player);
			}
			if (event.indexedData === true) {
				event.result = "cancelled";
			}
			return;
		}

		let autodelay = info.autodelay;
		if (typeof autodelay == "function") {
			autodelay = autodelay(trigger, player);
		}
		if (autodelay && (info.forced || !event.isMine())) {
			if (typeof autodelay == "number") {
				await game.delayx(autodelay);
			} else {
				await game.delayx();
			}
		}

		let targets = null;
		if (result.targets && result.targets.length > 0) {
			targets = result.targets.slice(0);
		} else if (info.logTarget) {
			if (typeof info.logTarget === "string") {
				targets = trigger[info.logTarget];
			} else if (typeof info.logTarget === "function") {
				targets = info.logTarget(trigger, player, event.triggername, event.indexedData);
			}
		}
		if (get.itemtype(targets) === "player") {
			targets = [targets];
		}
		if (info.popup != false && !info.direct && !("skill_popup" in result && !result["skill_popup"])) {
			const popup_info = typeof info.popup === "string" ? [event.skill, info.popup] : event.skill;
			const args = [trigger, player, event.triggername, event.indexedData, result];
			player.logSkill(popup_info, info.logLine === false ? false : targets, info.line, null, args);
		}
		if (info.usable !== undefined) {
			player.getStat("triggerSkill")[event.skill] ??= 0;
			player.getStat("triggerSkill")[event.skill]++;
		}

		const next = game.createEvent(event.skill);
		next.player = player;
		next._trigger = trigger;
		next.triggername = event.triggername;
		next.setContent(info.content);

		next.skillHidden = event.skillHidden;
		if (info.forceDie) {
			next.forceDie = true;
		}
		if (info.forceOut) {
			next.includeOut = true;
		}
		//传入数据
		if (get.itemtype(targets) == "players") {
			next.targets = targets.slice(0);
		}
		if (get.itemtype(result.cards) === "cards") {
			next.cards = result.cards.slice(0);
		}
		//语法糖部分
		if ("cost_data" in result) {
			next.cost_data = result.cost_data;
		}
		next.indexedData = event.indexedData;

		await next;

		//删除when生成的临时技能
		if (event.skill.startsWith("player_when_")) {
			player.removeSkill(event.skill);
			game.broadcastAll(skill => {
				delete lib.skill[skill];
				delete lib.translate[skill];
			}, event.skill);
		}

		if (!player._hookTrigger) {
			return;
		}
		if (
			player._hookTrigger.some(i => {
				const info = lib.skill[i].hookTrigger;
				return info && info.after && info.after(event, player, event.triggername);
			})
		) {
			await event.trigger("triggerAfter");
		}
	},
	async playVideoContent(event, trigger, player) {
		await game.delay(0, 500);

		if (!game.chess) {
			ui.control.innerHTML = "";
			const nodes = [...ui.arena.childNodes];
			for (const node of nodes) {
				if (node == ui.canvas) {
					continue;
				}
				if (node == ui.control) {
					continue;
				}
				if (node == ui.mebg) {
					continue;
				}
				if (node == ui.me) {
					continue;
				}
				if (node == ui.roundmenu) {
					continue;
				}
				node.remove();
			}
			ui.sidebar.innerHTML = "";
			ui.cardPile.innerHTML = "";
			ui.discardPile.innerHTML = "";
			ui.special.innerHTML = "";
			ui.ordering.innerHTML = "";
		}

		ui.system.firstChild.innerHTML = "";
		ui.system.lastChild.innerHTML = "";
		ui.system.firstChild.appendChild(ui.config2);
		if (ui.updateVideoMenu) {
			ui.updateVideoMenu();
		}

		_status.videoDuration = 1 / parseFloat(lib.config.video_default_play_speed.slice(0, -1));
		ui.create.system("返回", function () {
			const mode = localStorage.getItem(lib.configprefix + "playbackmode");
			if (mode) {
				game.saveConfig("mode", mode);
			}
			game.reload();
		});
		ui.create.system("重播", function () {
			_status.replayvideo = true;
			game.playVideo(_status.playback, lib.config.mode);
		});
		ui.create.system("暂停", ui.click.pause, true).id = "pausebutton";
		const atempo = ui.create.system(
			"原速",
			function () {
				_status.videoDuration = 1;
				updateDuration();
			},
			true
		);
		const slow = ui.create.system(
			"减速",
			function () {
				_status.videoDuration *= 1.5;
				updateDuration();
			},
			true
		);
		const fast = ui.create.system(
			"加速",
			function () {
				_status.videoDuration /= 1.5;
				updateDuration();
			},
			true
		);
		const updateDuration = function () {
			atempo.innerHTML = `原速(当前${Math.round(100 / _status.videoDuration) / 100}倍速)`;
			if (_status.videoDuration > 1) {
				slow.classList.add("glow");
			} else {
				slow.classList.remove("glow");
			}
			if (_status.videoDuration < 1) {
				fast.classList.add("glow");
			} else {
				fast.classList.remove("glow");
			}
		};
		updateDuration();
		ui.system.style.display = "";
		ui.refresh(ui.system);
		ui.system.show();
		ui.window.show();
		if (lib.config.mode != "versus" && lib.config.mode != "boss") {
			ui.arena.style.display = "";
			ui.refresh(ui.arena);
			ui.arena.show();
		}
		if (!game.chess) {
			game.playerMap = {};
		}
		game.finishCards();

		// 不确定，但录像年久失修，还是加上吧
		await event.waitNext();

		while (event.video.length) {
			const content = event.video.shift();
			// console.log(content);
			if (content.type == "delay") {
				await game.delay(content.content);
			} else if (content.type == "play") {
				window.play = {};
				if (!event.playtoload) {
					event.playtoload = 1;
				} else {
					event.playtoload++;
				}
				const script = lib.init.js(lib.assetURL + "play", content.name);
				script.addEventListener("load", function () {
					const play = window.play[content.name];
					if (play && play.video) {
						play.video(content.init);
					}
					event.playtoload--;
					if (event.playtoload == 0) {
						delete window.play;
					}
				});
			} else if (
				typeof content.player == "string" &&
				game.playerMap[content.player] &&
				game.playerMap[content.player].classList &&
				!game.playerMap[content.player].classList.contains("obstacle")
			) {
				await game.videoContent[content.type](game.playerMap[content.player], content.content);
			} else {
				await game.videoContent[content.type](content.content);
			}
			if (event.video.length) {
				await game.delay(0, _status.videoDuration * Math.min(2000, event.video[0].delay));
			}

			// 同上，~~早知道不改成Async Content了~~
			await event.waitNext();
		}

		_status.over = true;
		ui.system.lastChild.hide();
		delay(500).then(() => void (ui.system.lastChild.innerHTML = ""));
	},
	async waitForPlayer(event, trigger, player) {
		ui.auto.hide();
		ui.pause.hide();

		game.createServer();
		if (!lib.translate.zhu) {
			lib.translate.zhu = "主";
		}
		if (event.func) {
			event.func();
		}
		if (!lib.configOL.number) {
			lib.configOL.number = parseInt(lib.configOL.player_number);
		}
		if (game.onlineroom) {
			game.send("server", "config", lib.configOL);
		}

		ui.create.connectPlayers(game.ip);

		const me = game.connectPlayers[0];
		me.setIdentity("zhu");
		me.initOL(get.connectNickname(), lib.config.connect_avatar);
		me.playerid = "1";
		game.onlinezhu = "1";
		_status.waitingForPlayer = true;

		await game.pause();

		_status.waitingForPlayer = false;
		lib.configOL.gameStarted = true;
		if (game.onlineroom) {
			game.send("server", "config", lib.configOL);
		}
		for (var i = 0; i < game.connectPlayers.length; i++) {
			game.connectPlayers[i].delete();
		}
		delete game.connectPlayers;
		if (ui.roomInfo) {
			ui.roomInfo.remove();
			delete ui.roomInfo;
		}
		if (ui.exitroom) {
			ui.exitroom.remove();
			delete ui.exitroom;
		}
		game.broadcast("gameStart");
		game.delay(2);
		ui.auto.show();
		ui.pause.show();
		if (lib.config.show_cardpile) {
			ui.cardPileButton.style.display = "";
		}
		if (lib.config.show_commonCardpile) {
			ui.commonCardPileButton.style.display = "";
		}
	},
	async replaceHandcards(event, trigger, player) {
		if (!event.players.includes(game.me)) {
			return;
		}

		const result = await game.me.chooseBool("是否置换手牌？").forResult();
		if (result && result.bool) {
			/*otherPile主要是针对那些用专属牌堆，不从一般牌堆摸牌的角色（如陈寿），该属性目前只有两个键值对，且都为函数
			 *getCards函数与获得牌相关，只传入要获得的牌数num作为参数
			 *discard与手气卡换牌后弃置牌相关，只传入要弃置的牌card作为参数
			 */
			const hs = game.me.getCards("h");
			const cards = [];
			const otherGetCards = event.otherPile?.[game.me.playerid]?.getCards;
			const otherDiscacrd = event.otherPile?.[game.me.playerid]?.discard;
			//先弃牌
			game.addVideo("lose", game.me, [get.cardsInfo(hs), [], [], []]);
			for (const card of hs) {
				card.removeGaintag(true);
				if (otherDiscacrd) {
					otherDiscacrd(card);
				} else {
					card.discard(false);
				}
			}
			//再摸牌，先看有没有专属牌堆
			if (otherGetCards) {
				cards.addArray(otherGetCards(hs.length));
			} else {
				cards.addArray(get.cards(hs.length));
			}
			//添加标记相关
			//event.gaintag支持函数、字符串、数组。数组就是添加一连串的标记；函数的返回格式为[[cards1,gaintag1],[cards2,gaintag2]...]
			if (event.gaintag?.[game.me.playerid]) {
				const gaintag = event.gaintag[game.me.playerid];
				const list = typeof gaintag == "function" ? gaintag(hs.length, cards) : [[cards, gaintag]];
				for (let i = list.length - 1; i >= 0; i--) {
					game.me.directgain(list[i][0], null, list[i][1]);
				}
			} else {
				game.me.directgain(cards);
			}
			game.me._start_cards = cards;
		}
	},
	async replaceHandcardsOL(event, trigger, player) {
		const send = function () {
			game.me.chooseBool("是否置换手牌？");
			game.resume();
		};

		const sendback = function (result, player) {
			if (!result || !result.bool) {
				return;
			}

			/*otherPile主要是针对那些用专属牌堆，不从一般牌堆摸牌的角色（如陈寿），该属性目前只有两个键值对，且都为函数
			 *getCards函数与获得牌相关，只传入要获得的牌数num作为参数
			 *discard与手气卡换牌后弃置牌相关，只传入要弃置的牌card作为参数
			 */
			const hs = player.getCards("h");
			const cards = [];
			const otherGetCards = event.otherPile?.[player.playerid]?.getCards;
			const otherDiscacrd = event.otherPile?.[player.playerid]?.discard;
			//先弃牌
			game.broadcastAll(
				function (player, hs, otherDiscacrd) {
					game.addVideo("lose", player, [get.cardsInfo(hs), [], [], []]);
					for (var i = 0; i < hs.length; i++) {
						hs[i].removeGaintag(true);
						if (otherDiscacrd) {
							otherDiscacrd(hs[i]);
						} else {
							hs[i].discard(false);
						}
					}
				},
				player,
				hs,
				otherDiscacrd
			);
			//再摸牌，先看有没有专属牌堆
			if (otherGetCards) {
				cards.addArray(otherGetCards(hs.length));
			} else {
				cards.addArray(get.cards(hs.length));
			}
			//添加标记相关
			//event.gaintag支持函数、字符串、数组。数组就是添加一连串的标记；函数的返回格式为[[cards1,gaintag1],[cards2,gaintag2]...]
			if (event.gaintag?.[player.playerid]) {
				const gaintag = event.gaintag[player.playerid];
				const list = typeof gaintag == "function" ? gaintag(hs.length, cards) : [[cards, gaintag]];
				game.broadcastAll(
					(player, list) => {
						for (let i = list.length - 1; i >= 0; i--) {
							player.directgain(list[i][0], null, list[i][1]);
						}
					},
					player,
					list
				);
			} else {
				player.directgain(cards);
			}
			player._start_cards = cards;
		};

		let withol = false;
		for (const current of event.players) {
			if (current.isOnline()) {
				withol = true;
				current.send(send);
				current.wait(sendback);
			} else if (current == game.me) {
				const next = game.me.chooseBool("是否置换手牌？");
				game.me.wait(sendback);
				const result = await next.forResult();
				game.me.unwait(result);
			}
		}

		if (withol && !event.resultOL) {
			await game.pause();
		}
	},
	phase: [
		async (event, trigger, player) => {
			//规则集中的“回合开始后③（处理“游戏开始时”的时机）”
			//提前phaseBefore时机解决“游戏开始时”时机和“一轮开始时”先后
			await event.trigger("phaseBefore");
		},
		async (event, trigger, player) => {
			game.phaseNumber++;
			//初始化阶段列表
			event.phaseList ??= ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
			if (typeof event.num != "number") {
				event.num = 0;
			}
			//规则集中的“回合开始后①”，更新游戏轮数，触发“一轮游戏开始时”
			let isRound = false;
			if (lib.onround.every(onRound => onRound(event, player))) {
				isRound = _status.roundSkipped;
				if (_status.isRoundFilter) {
					isRound = _status.isRoundFilter(event, player);
				} else if (_status.seatNumSettled) {
					const seatNum = player.getSeatNum();
					if (seatNum != 0) {
						if (get.itemtype(_status.lastPhasedPlayer) != "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
							isRound = true;
						}
						_status.lastPhasedPlayer = player;
					}
				} else if (player == _status.roundStart) {
					isRound = true;
				}
				if (isRound) {
					delete _status.roundSkipped;
					game.roundNumber++;
					event._roundStart = true;
					game.updateRoundNumber();
					for (const current of game.players) {
						if (current.isOut() && current.outCount > 0) {
							current.outCount--;
							if (current.outCount == 0 && !current.outSkills) {
								current.in();
							}
						}
					}
					//await event.trigger("roundStart");
				}
			}
			_status.globalHistory.push({
				cardMove: [],
				custom: [],
				useCard: [],
				changeHp: [],
				everything: [],
			});
			const players = game.players.slice(0).concat(game.dead);
			for (const current of players) {
				current.actionHistory.push({
					useCard: [],
					respond: [],
					skipped: [],
					lose: [],
					gain: [],
					sourceDamage: [],
					damage: [],
					custom: [],
					useSkill: [],
				});
				current.stat.push({ card: {}, skill: {}, triggerSkill: {} });
				if (isRound) {
					current.getHistory().isRound = true;
					current.getStat().isRound = true;
				}
			}
			if (isRound) {
				game.getGlobalHistory().isRound = true;
				await event.trigger("roundStart");
			}
		},
		async (event, trigger, player) => {
			//规则集中的“回合开始后②（1v1武将登场专用）”
			await event.trigger("phaseBeforeStart");
		},
		async (event, trigger, player) => {
			//规则集中的“回合开始后④（卑弥呼〖纵傀〗的时机）”
			await event.trigger("phaseBeforeEnd");
		},
		async (event, trigger, player) => {
			//规则集中的“回合开始后⑤”，进行翻面检测
			if (player.isTurnedOver() && !event._noTurnOver) {
				const next = player.turnOver();
				player.phaseSkipped = true;
				const players = game.players.slice(0).concat(game.dead);
				for (const current of players) {
					current.getHistory().isSkipped = true;
					current.getStat().isSkipped = true;
				}
				event.cancel();
				return next.forResult();
			} else {
				player.phaseSkipped = false;
				player.getHistory().isMe = true;
				player.getStat().isMe = true;
			}
		},
		async (event, trigger, player) => {
			//规则集中的“回合开始后⑥”，更新“当前回合角色”
			while (ui.dialogs.length) {
				ui.dialogs[0].close();
			}
			player.phaseNumber++;
			game.broadcastAll(
				function (player, num, popup) {
					if (lib.config.glow_phase) {
						player.classList.add("glow_phase");
					}
					player.phaseNumber = num;
					_status.currentPhase = player;
					if (popup && lib.config.show_phase_prompt) {
						player.popup("回合开始", null, false);
					}
				},
				player,
				player.phaseNumber,
				!player.noPhaseDelay
			);
			_status.currentPhase = player;
			_status.discarded = [];
			game.syncState();
			game.addVideo("phaseChange", player);
			if (game.phaseNumber >= 1 && !lib.configOL.observeReady) {
				if (lib.configOL.observe) {
					lib.configOL.observeReady = true;
					game.send("server", "config", lib.configOL);
				}
			}
			game.log();
			const skill = event.skill && get.sourceSkillFor(event.skill);
			game.log(player, "的", skill ? `#y【${get.translation(skill)}】` : "", "回合开始");
			player._noVibrate = true;
			if (get.config("identity_mode") != "zhong" && get.config("identity_mode") != "purple" && !_status.connectMode) {
				let num;
				switch (get.config("auto_identity")) {
					case "one":
						num = 1;
						break;
					case "two":
						num = 2;
						break;
					case "three":
						num = 3;
						break;
					case "always":
						num = -1;
						break;
					default:
						num = 0;
						break;
				}
				if (num && !_status.identityShown && game.phaseNumber > game.players.length * num && game.showIdentity) {
					if (!_status.video) {
						player.popup("显示身份");
					}
					_status.identityShown = true;
					game.showIdentity(false);
				}
			}
			player.ai.tempIgnore = [];
			if (ui.land && ui.land.player == player) {
				game.addVideo("destroyLand");
				ui.land.destroy();
			}
		},
		async (event, trigger, player) => {
			//规则集中的“回合开始后⑦”，国战武将明置武将牌
			await event.trigger("phaseBeginStart");
		},
		async (event, trigger, player) => {
			//规则集中的“回合开始后⑨”，进行当先，化身等操作
			//没有⑧ 因为⑧用不到
			await event.trigger("phaseBegin");
		},
		//阶段部分
		async (event, trigger, player) => {
			const { num } = event;
			if (num < event.phaseList.length) {
				//规则集中没有的新时机 可以用来插入额外阶段啥的
				if (player.isIn()) {
					await event.trigger("phaseChange");
				}
			} else {
				event.goto(11);
			}
		},
		async (event, trigger, player) => {
			const { num } = event;

			if (!player.isIn() || num >= event.phaseList.length) {
				return;
			}

			const list = event.phaseList[num].split("|");
			const phase = list[0].split("-");
			let skip = false;
			if (phase[0].startsWith("skip")) {
				event.currentPhase = `phase${phase[0].slice(4)}`;
				skip = true;
			} else {
				event.currentPhase = phase[0];
			}
			const next = player[event.currentPhase]();
			next.phaseIndex = num;
			if (list.length > 1) {
				next._extraPhaseReason = list[1];
			}
			if (skip) {
				next.isSkipped = true;
				if (phase.length > 1) {
					next._skipPhaseReason = phase[1];
				}
				game.log(player, "跳过了", event.currentPhase);
			}
			if (event.currentPhase == "phaseDraw" || event.currentPhase == "phaseDiscard") {
				if (!player.noPhaseDelay) {
					if (player == game.me) {
						await game.delay();
					} else {
						await game.delayx();
					}
				}
			}

			return next.forResult();
		},
		async (event, trigger, player) => {
			if (event.currentPhase == "phaseUse") {
				game.broadcastAll(function () {
					if (ui.tempnowuxie) {
						ui.tempnowuxie.close();
						delete ui.tempnowuxie;
					}
				});
				delete player._noSkill;
			}
			event.num++;
		},
		async (event, trigger, player) => {
			if (event.num < event.phaseList.length) {
				event.goto(8);
			} else if (!event._phaseEndTriggered) {
				event._phaseEndTriggered = true;
				event.redo();
				await event.trigger("phaseEnd");
			}
		},
		async (event, trigger, player) => {
			await event.trigger("phaseAfter");
		},
		async (event, trigger, player) => {
			//删除当前回合角色 此时处于“不属于任何角色的回合”的阶段
			game.broadcastAll(function (player) {
				player.classList.remove("glow_phase");
				delete _status.currentPhase;
			}, player);
		},
	],
	async phaseZhunbei(event, trigger, player) {
		game.log(player, "进入了准备阶段");
		await event.trigger(event.name);
	},
	phaseJudge: [
		async (event, trigger, player) => {
			game.log(player, "进入了判定阶段");
			event.cards = player.getCards("j");
		},
		async (event, trigger, player) => {
			if (!event.cards.length) {
				event.finish();
				return;
			}
			event.card = event.cards.shift();
			const cardName = event.card.name,
				cardInfo = lib.card[cardName],
				VJudge = event.card[event.card.cardSymbol];
			if (cardInfo.noEffect || !player.getCards("j").includes(event.card)) {
				event.redo();
			} else {
				if (event.card) {
					await player.lose(event.card, "visible", ui.ordering);
				}
				player.$phaseJudge(event.card);
				event.cancelled = false;
				await event.trigger("phaseJudge");
				player.popup(cardName, "thunder");
				if (!cardInfo.effect) {
					await game.delay();
					event.redo();
				} else if (!cardInfo.judge) {
					await game.delay();
					event.nojudge = true;
				} else {
					event.nojudge = false;
				}
			}
		},
		async (event, trigger, player) => {
			if (!event.cancelled && !event.nojudge) {
				event.result = await player.judge(event.card).set("type", "phase").forResult();
			}
		},
		async (event, trigger, player) => {
			const name = event.card.name;
			const VJudge = event.card[event.card.cardSymbol];
			if (event.excluded) {
				delete event.excluded;
			} else if (event.cancelled && !event.direct) {
				if (lib.card[name].cancel) {
					const next = game.createEvent(name + "Cancel");
					next.setContent(lib.card[name].cancel);
					next.card = VJudge;
					next.cards = VJudge?.cards ?? [];
					next.player = player;
					await next;
				}
			} else {
				const next = game.createEvent(name);
				next.setContent(lib.card[name].effect);
				next._result = event.result;
				next.card = VJudge;
				next.cards = VJudge?.cards ?? [];
				next.player = player;
				await next;
			}
			ui.clear();
			event.goto(1);
		},
	],
	phaseDraw: [
		async event => {
			game.log(event.player, "进入了摸牌阶段");
			await event.trigger("phaseDrawBegin1");
		},
		async event => {
			await event.trigger("phaseDrawBegin2");
		},
		async (event, trigger, player) => {
			if (game.modPhaseDraw) {
				return game.modPhaseDraw(player, event.num);
			} else {
				if (event.num > 0) {
					let num = event.num;

					if (event.attachDraw) {
						for (const card of event.attachDraw) {
							ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
						}
						num += event.attachDraw.length;
					}

					const next = player.draw(num);
					if (event.attachDraw) {
						next.minnum = event.attachDraw.length;
					}
					return next.forResult();
				}
			}
		},
		async (event, trigger, player, result) => {
			if (result.bool && result.cards) {
				event.cards = result.cards;
			}
		},
	],
	phaseUse: [
		async (event, trigger, player) => {
			const stat = player.getStat();
			for (const skill in stat.skill) {
				let bool = false;
				const info = lib.skill[skill];
				if (!info) {
					continue;
				}
				if (info.enable != undefined) {
					if (typeof info.enable == "string" && info.enable == "phaseUse") {
						bool = true;
					} else if (typeof info.enable == "object" && info.enable.includes("phaseUse")) {
						bool = true;
					}
				}
				if (bool) {
					stat.skill[skill] = 0;
				}
			}
			for (let card in stat.card) {
				let bool = false;
				const info = lib.card[card];
				if (!info) {
					continue;
				}
				if (info.updateUsable == "phaseUse") {
					stat.card[card] = 0;
				}
			}
		},
		async (event, trigger, player) => {
			await event.trigger("phaseUseBefore");
		},
		async (event, trigger, player) => {
			await event.trigger("phaseUseBegin");
		},
		async (event, trigger, player) => {
			if (!event.logged) {
				game.log(player, "进入了出牌阶段");
				event.logged = true;
			}
			const next = player.chooseToUse();
			if (!lib.config.show_phaseuse_prompt) {
				next.set("prompt", false);
			}
			next.set("type", "phase");
			return next.forResult();
		},
		async (event, trigger, player, result) => {
			if (result.bool && !event.skipped) {
				event.goto(3);
			}
			game.broadcastAll(function () {
				if (ui.tempnowuxie) {
					ui.tempnowuxie.close();
					delete ui.tempnowuxie;
				}
			});
		},
		async (event, trigger, player) => {
			await event.trigger("phaseUseEnd");
		},
		async (event, trigger, player) => {
			await event.trigger("phaseUseAfter");
		},
	],
	phaseDiscard: [
		async (event, trigger, player) => {
			game.log(player, "进入了弃牌阶段");
			event.num = player.needsToDiscard();
			if (event.num <= 0) {
				event.finish();
				return;
			} else {
				game.broadcastAll(function (player) {
					if (lib.config.show_phase_prompt) {
						player.popup("弃牌阶段", null, false);
					}
				}, player);
			}
			await event.trigger("phaseDiscard");
		},
		async (event, trigger, player) => {
			const { num } = event;
			return player.chooseToDiscard(num, true).set("useCache", true).set("allowChooseAll", true).forResult();
		},
		async (event, trigger, player, result) => {
			event.cards = result.cards;
		},
	],
	async phaseJieshu(event, trigger, player) {
		game.log(player, "进入了结束阶段");
		await event.trigger(event.name);
	},
	chooseToUse: [
		async (event, trigger, player) => {
			if (event.responded) {
				return;
			}
			if (game.modeSwapPlayer && !_status.auto && player.isUnderControl() && !lib.filter.wuxieSwap(event)) {
				game.modeSwapPlayer(player);
			}
			const skills = player.getSkills("invisible").concat(lib.skill.global);
			game.expandSkills(skills);
			for (const name of skills) {
				var info = lib.skill[name];
				if (info && info.onChooseToUse) {
					info.onChooseToUse(event);
				}
			}
			if (_status.noclearcountdown !== "direct") {
				_status.noclearcountdown = true;
			}
			if (event.type == "phase") {
				if (event.isMine()) {
					event.endButton = ui.create.control("结束回合", "stayleft", function () {
						var evt = _status.event;
						if (evt.name != "chooseToUse" || evt.type != "phase") {
							return;
						}
						if (evt.skill) {
							ui.click.cancel();
						}
						ui.click.cancel();
					});
					event.fakeforce = true;
				} else {
					if (event.endButton) {
						event.endButton.close();
						delete event.endButton;
					}
					event.fakeforce = false;
				}
			}
			if (event.player.isUnderControl() && !_status.auto) {
				event.result = {
					bool: false,
				};
				return;
			} else if (event.isMine()) {
				if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
					ui.click.cancel();
					return;
				}
				if (event.type == "wuxie") {
					if (ui.tempnowuxie) {
						var triggerevent = event.getTrigger();
						if (triggerevent && triggerevent.targets && triggerevent.num == triggerevent.targets.length - 1) {
							ui.tempnowuxie.close();
						}
					}
					if (lib.filter.wuxieSwap(event)) {
						event.result = {
							bool: false,
						};
						return;
					}
				}
				const ok = game.check();
				const cardinfo = get.info(get.card()) || {};
				const skillinfo = get.info(event.skill) || {};
				if (!ok || !lib.config.auto_confirm || cardinfo?.manualConfirm || skillinfo?.manualConfirm) {
					game.pause();
					if (lib.config.enable_vibrate && player._noVibrate) {
						delete player._noVibrate;
						game.vibrate();
					}
					if (typeof event.prompt == "string") {
						if (event.openskilldialog) {
							event.skillDialog = ui.create.dialog(event.openskilldialog);
							delete event.openskilldialog;
							event.dialog = event.prompt;
						} else {
							event.dialog = ui.create.dialog(event.prompt);
							if (event.prompt2) {
								event.dialog.addText(event.prompt2);
							}
						}
					} else if (typeof event.prompt == "function") {
						event.dialog = ui.create.dialog(event.prompt(event));
					} else if (event.prompt == undefined) {
						let str;
						if (typeof event.filterCard == "object") {
							var filter = event.filterCard;
							str = "请使用" + get.cnNumber(event.selectCard[0]) + "张";
							if (filter.name) {
								str += get.translation(filter.name);
							} else {
								str += "牌";
							}
						} else {
							str = "请选择要使用的牌";
						}
						if (event.openskilldialog) {
							event.skillDialog = ui.create.dialog(event.openskilldialog);
							delete event.openskilldialog;
							event.dialog = str;
						} else if (typeof event.skillDialog != "string") {
							event.dialog = ui.create.dialog(str);
						} else {
							event.dialog = str;
						}
					}
				} else {
					delete event.openskilldialog;
				}
			} else if (event.isOnline()) {
				event.send();
			} else {
				event.result = "ai";
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;

			if (event.result != "ai") {
				return;
			}

			const ok = game.check();
			if (ok) {
				ui.click.ok();
			} else if (ai.basic.chooseCard(event.ai1) || forced) {
				if ((ai.basic.chooseTarget(event.ai2) || forced) && (!event.filterOk || event.filterOk())) {
					ui.click.ok();
					event._aiexcludeclear = true;
				} else {
					if (!event.norestore) {
						if (event.skill) {
							var skill = event.skill;
							ui.click.cancel();
							event._aiexclude.add(skill);
							var info = get.info(skill);
							if (info.sourceSkill) {
								event._aiexclude.add(info.sourceSkill);
							}
						} else {
							get.card(true).aiexclude();
							game.uncheck();
						}
						event.redo();
						game.resume();
					} else {
						ui.click.cancel();
					}
				}
			} else if (event.skill && !event.norestore) {
				const skill = event.skill;
				ui.click.cancel();
				event._aiexclude.add(skill);
				const info = get.info(skill);
				if (info.sourceSkill) {
					event._aiexclude.add(info.sourceSkill);
				}
				event.redo();
				game.resume();
			} else {
				ui.click.cancel();
			}
			if (event.aidelay && event.result && event.result.bool) {
				await game.delayx();
			}
		},
		async (event, trigger, player) => {
			if (event.endButton) {
				event.endButton.close();
				delete event.endButton;
			}
			event.resume();

			if (!event.result) {
				return;
			}

			if (event.result._sendskill) {
				lib.skill[event.result._sendskill[0]] = event.result._sendskill[1];
			}

			if (!event.result.skill) {
				return;
			}

			const info = get.info(event.result.skill);
			if (info && info.chooseButton) {
				if (event.dialog && typeof event.dialog == "object") {
					event.dialog.close();
				}
				const dialog = info.chooseButton.dialog(event, player);

				let next;
				if (info.chooseButton.chooseControl) {
					next = player.chooseControl(info.chooseButton.chooseControl(event, player));
					if (dialog.direct) {
						next.direct = true;
					}
					if (dialog.forceDirect) {
						next.forceDirect = true;
					}
					next.dialog = dialog;
					next.set(
						"ai",
						info.chooseButton.check ||
							function () {
								return 0;
							}
					);
					if (event.id) {
						next._parent_id = event.id;
					}
					next.type = "chooseToUse_button";
				} else {
					next = player.chooseButton(dialog);
					if (dialog.direct) {
						next.direct = true;
					}
					if (dialog.forceDirect) {
						next.forceDirect = true;
					}
					next.set(
						"ai",
						info.chooseButton.check ||
							function () {
								return 1;
							}
					);
					next.set(
						"filterButton",
						info.chooseButton.filter ||
							function () {
								return true;
							}
					);
					next.set("selectButton", info.chooseButton.select || 1);
					next.set(
						"complexSelect",
						(() => {
							if (info.chooseButton.complexSelect !== false) {
								if (info.chooseButton.complexSelect === undefined && info.chooseButton.allowChooseAll === true) {
									// 如果complexSelect没有被显式的定义但是全选被显式要求了，那么我们默认认为调用者需要全选而不是complexSelect喵
									return false;
								} else {
									return true;
								}
							}
							return false;
						})()
					);
					next.set("filterOk", info.chooseButton.filterOk || (() => true));
					next.set("allowChooseAll", info.chooseButton.allowChooseAll);
					if (event.id) {
						next._parent_id = event.id;
					}
					next.type = "chooseToUse_button";
				}
				event.buttoned = event.result.skill;

				return next.forResult();
			} else if (info && info.precontent && !game.online && !event.nouse) {
				const next = game.createEvent("pre_" + event.result.skill);

				next.setContent(info.precontent);
				next.set("result", event.result);
				next.set("player", player);

				return next.forResult();
			}
		},
		async (event, trigger, player, result) => {
			if (!event.buttoned) {
				return;
			}

			if (result.bool || (result.control && result.control != "cancel2")) {
				const info = get.info(event.buttoned).chooseButton;
				lib.skill[event.buttoned + "_backup"] = info.backup(info.chooseControl ? result : result.links, player);
				lib.skill[event.buttoned + "_backup"].sourceSkill = event.buttoned;
				if (game.online) {
					event._sendskill = [event.buttoned + "_backup", lib.skill[event.buttoned + "_backup"]];
				} else {
					game.broadcast(
						(skill, audio) => {
							if (!lib.skill[skill]) {
								lib.skill[skill] = {};
							}
							lib.skill[skill].audio = audio;
						},
						event.buttoned + "_backup",
						lib.skill[event.buttoned + "_backup"].audio
					);
				}
				event.backup(event.buttoned + "_backup");
				if (info.prompt) {
					event.openskilldialog = info.prompt(info.chooseControl ? result : result.links, player);
				}
			} else {
				ui.control.addTempClass("nozoom", 100);
				event._aiexclude.add(event.buttoned);
			}

			event.goto(0);
			delete event.buttoned;
		},
		async (event, trigger, player) => {
			if (event._aiexcludeclear) {
				delete event._aiexcludeclear;
				event._aiexclude.length = 0;
			}
			delete _status.noclearcountdown;
			if (event.skillDialog && get.objtype(event.skillDialog) == "div") {
				event.skillDialog.close();
			}
			if (event.result && event.result.bool && !game.online && !event.nouse) {
				if (event.result?.cancel) {
					event.goto(0);
				} else {
					const oldLogSkill = event.logSkill;
					if (event.chooseonly) {
						event.logSkill = false;
					}
					if (!event.chooseonly) {
						//event.done = player.useResult(event.result, event);
						const next = player.useResult(event.result, event);
					} else {
						event.result.cost_data = { result: event.result };
						if (oldLogSkill) {
							event.result.cost_data.logSkill = oldLogSkill;
						}
					}
				}
			} else if (event._sendskill) {
				event.result._sendskill = event._sendskill;
			}
			if ((!event.result?.bool || event.result?._noHidingTimer) && (event.result?.skill || event.logSkill)) {
				var info = get.info(event.result.skill || (Array.isArray(event.logSkill) ? event.logSkill[0] : event.logSkill));
				if (info.direct && !info.clearTime) {
					_status.noclearcountdown = "direct";
				}
			}
			if (event.dialog && typeof event.dialog == "object") {
				event.dialog.close();
			}
			if (!_status.noclearcountdown) {
				game.stopCountChoose();
			}
		},
		async (event, trigger, player) => {
			if (event._result && event.result) {
				event.result.result = event._result;
			}
		},
	],
	chooseToRespond: [
		async (event, trigger, player) => {
			if (event.responded) {
				delete event.dialog;
				return;
			}

			const skills = player.getSkills("invisible").concat(lib.skill.global);
			game.expandSkills(skills);
			for (const skill of skills) {
				var info = lib.skill[skill];
				if (info && info.onChooseToRespond) {
					info.onChooseToRespond(event);
				}
			}
			if (_status.noclearcountdown !== "direct") {
				_status.noclearcountdown = true;
			}
			if (!_status.connectMode && lib.config.skip_shan && event.autochoose && event.autochoose()) {
				event.result = { bool: false };
			} else {
				if (game.modeSwapPlayer && !_status.auto && player.isUnderControl()) {
					game.modeSwapPlayer(player);
				}
				if (event.isMine()) {
					if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
						ui.click.cancel();
						return;
					}
					const ok = game.check();
					const cardinfo = get.info(get.card()) || {};
					const skillinfo = get.info(event.skill) || {};
					if (!ok || !lib.config.auto_confirm || cardinfo?.manualConfirm || skillinfo?.manualConfirm) {
						game.pause();
						if (event.openskilldialog) {
							event.skillDialog = ui.create.dialog(event.openskilldialog);
							delete event.openskilldialog;
							event.dialog = event.prompt;
						} else {
							if (event.prompt) {
								event.dialog = ui.create.dialog(event.prompt);
							}
							if (event.prompt2) {
								event.dialog.addText(event.prompt2);
							}
						}
					} else {
						delete event.openskilldialog;
					}
				} else if (event.isOnline()) {
					event.send();
				} else {
					event.result = "ai";
				}
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;

			if (event.result != "ai") {
				return;
			}

			const ok = game.check();
			if (ok) {
				ui.click.ok();
			} else if (ai.basic.chooseCard(event.ai1 || event.ai) || forced) {
				if ((ai.basic.chooseTarget(event.ai2) || forced) && (!event.filterOk || event.filterOk())) {
					ui.click.ok();
					event._aiexcludeclear = true;
				} else {
					if (!event.norestore) {
						if (event.skill) {
							var skill = event.skill;
							ui.click.cancel();
							event._aiexclude.add(skill);
							var info = get.info(skill);
							if (info.sourceSkill) {
								event._aiexclude.add(info.sourceSkill);
							}
						} else {
							get.card(true).aiexclude();
							game.uncheck();
						}
						event.redo();
						game.resume();
					} else {
						ui.click.cancel();
					}
				}
			} else if (event.skill && !event.norestore) {
				var skill = event.skill;
				ui.click.cancel();
				event._aiexclude.add(skill);
				var info = get.info(skill);
				if (info.sourceSkill) {
					event._aiexclude.add(info.sourceSkill);
				}
				event.redo();
				game.resume();
			} else {
				ui.click.cancel();
			}
			if (event.aidelay && event.result && event.result.bool) {
				game.delayx();
			}
		},
		async (event, trigger, player) => {
			event.resume();
			if (!event.result) {
				return;
			}

			if (event.result._sendskill) {
				lib.skill[event.result._sendskill[0]] = event.result._sendskill[1];
			}
			if (event.result.skill) {
				const info = get.info(event.result.skill);
				if (info && info.chooseButton) {
					if (event.dialog && typeof event.dialog == "object") {
						event.dialog.close();
					}
					const dialog = info.chooseButton.dialog(event, player);

					let next;
					if (info.chooseButton.chooseControl) {
						next = player.chooseControl(info.chooseButton.chooseControl(event, player));
						if (dialog.direct) {
							next.direct = true;
						}
						if (dialog.forceDirect) {
							next.forceDirect = true;
						}
						next.dialog = dialog;
						next.set(
							"ai",
							info.chooseButton.check ||
								function () {
									return 0;
								}
						);
					} else {
						next = player.chooseButton(dialog);
						if (dialog.direct) {
							next.direct = true;
						}
						if (dialog.forceDirect) {
							next.forceDirect = true;
						}
						next.set(
							"ai",
							info.chooseButton.check ||
								function () {
									return 1;
								}
						);
						next.set(
							"filterButton",
							info.chooseButton.filter ||
								function () {
									return true;
								}
						);
						next.set("selectButton", info.chooseButton.select || 1);
						next.set("filterOk", info.chooseButton.filterOk || (() => true));
						next.set(
							"complexSelect",
							(() => {
								if (info.chooseButton.complexSelect !== false) {
									if (info.chooseButton.complexSelect === undefined && info.chooseButton.allowChooseAll === true) {
										// 如果complexSelect没有被显式的定义但是全选被显式要求了，那么我们默认认为调用者需要全选而不是complexSelect喵
										return false;
									} else {
										return true;
									}
								}
								return false;
							})()
						);
						next.set("allowChooseAll", info.chooseButton.allowChooseAll);
					}
					event.buttoned = event.result.skill;

					return next.forResult();
				} else if (info && info.precontent && !game.online) {
					const next = game.createEvent("pre_" + event.result.skill);
					next.setContent(info.precontent);
					next.set("result", event.result);
					next.set("player", player);
					return next.forResult();
				}
			}
		},
		async (event, trigger, player, result) => {
			if (!event.buttoned) {
				return;
			}

			if (result.bool || (result.control && result.control != "cancel2")) {
				const info = get.info(event.buttoned).chooseButton;
				lib.skill[event.buttoned + "_backup"] = info.backup(info.chooseControl ? result : result.links, player);
				lib.skill[event.buttoned + "_backup"].sourceSkill = event.buttoned;
				if (game.online) {
					event._sendskill = [event.buttoned + "_backup", lib.skill[event.buttoned + "_backup"]];
				} else {
					game.broadcast(
						(skill, audio) => {
							if (!lib.skill[skill]) {
								lib.skill[skill] = {};
							}
							lib.skill[skill].audio = audio;
						},
						event.buttoned + "_backup",
						lib.skill[event.buttoned + "_backup"].audio
					);
				}
				event.backup(event.buttoned + "_backup");
				if (info.prompt) {
					event.openskilldialog = info.prompt(info.chooseControl ? result : result.links, player);
				}
			} else {
				ui.control.addTempClass("nozoom", 100);
				event._aiexclude.add(event.buttoned);
			}
			event.goto(0);
			delete event.buttoned;
		},
		async (event, trigger, player) => {
			delete _status.noclearcountdown;
			if (event.skillDialog && get.objtype(event.skillDialog) == "div") {
				event.skillDialog.close();
			}
			if (event.result.bool && !game.online) {
				if (event.result._sendskill) {
					lib.skill[event.result._sendskill[0]] = event.result._sendskill[1];
				}
				if (event.onresult) {
					event.onresult(event.result);
				}
				if ((!event.result?.bool || event.result?._noHidingTimer) && (event.result?.skill || event.logSkill)) {
					var info = get.info(event.result.skill || (Array.isArray(event.logSkill) ? event.logSkill[0] : event.logSkill));
					if (info.direct && !info.clearTime) {
						_status.noclearcountdown = "direct";
					}
				}
				if (event.logSkill) {
					if (typeof event.logSkill == "string") {
						player.logSkill(event.logSkill);
					} else if (Array.isArray(event.logSkill)) {
						player.logSkill.apply(player, event.logSkill);
					}
				}
				if (!event.result.card && event.result.skill) {
					event.result.used = event.result.skill;
					player.useSkill(event.result.skill, event.result.cards, event.result.targets);
				} else if (event.result?.cancel) {
					event.goto(0);
				} else {
					if (info && info.prerespond) {
						info.prerespond(event.result, player);
					}
					var next = player.respond(event.result.cards, event.result.card, event.animate, event.result.skill, event.source);
					if (event.result.noanimate) {
						next.animate = false;
					}
					if (event.parent.card && event.parent.type == "card") {
						next.set("respondTo", [event.parent.player, event.parent.card]);
					}
					if (event.noOrdering) {
						next.noOrdering = true;
					}
					if (event.result._apply_args) {
						for (var i in event.result._apply_args) {
							next[i] = event.result._apply_args[i];
						}
					}
				}
			} else if (event._sendskill) {
				event.result._sendskill = event._sendskill;
			}
			if (event.dialog && event.dialog.close) {
				event.dialog.close();
			}
			if (!_status.noclearcountdown) {
				game.stopCountChoose();
			}
		},
	],
	chooseToGive: [
		async (event, trigger, player) => {
			const { target } = event;
			event.result = {
				bool: true,
				confirm: "ok",
				buttons: [],
				links: [],
				cards: [],
				targets: [],
			};
			event.filterCard = (event => {
				const filterCard = event.filterCard;
				return function (card, player) {
					if (!lib.filter.canBeGained(card, this.target, player)) {
						return false;
					}
					return filterCard.call(this, card, player);
				};
			})(event);
			if (event.directresult) {
				event.result.cards = event.directresult.slice(0);
				event.goto(2);
				return;
			}
			const directFilter = event.forced && typeof event.filterOk != "function" && typeof event.selectCard != "function" && !event.complexCard;
			const cards = directFilter
				? player
						.getCards(event.position)
						.filter(card => !card.classList.contains("uncheck") && lib.filter.cardAiIncluded(card) && event.filterCard(card, player))
				: [];
			const range = get.select(event.selectCard);
			if (directFilter && (range[0] >= cards.length || range[1] <= -1)) {
				if (player.isOut()) {
					event.result.cards = [];
				} else {
					event.result.cards = cards;
				}
			} else if (event.isMine()) {
				game.check();
				if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
					ui.click.cancel();
					return;
				}
				game.pause();
				if (range[1] > 1 && typeof event.selectCard != "function") {
					ui.create.cardChooseAll();
					event.aiChoose = ui.create.control("AI代选", function () {
						ai.basic.chooseCard(event.ai);
						if (typeof _status.event.custom?.add?.card == "function") {
							_status.event.custom.add.card();
						}
						ui.selected.cards.forEach(i => i.updateTransform(true));
					});
				}
				if (Array.isArray(event.dialog)) {
					event.dialog = ui.create.dialog.apply(this, event.dialog);
					event.dialog.open();
					event.dialog.classList.add("noselect");
				} else if (event.prompt != false) {
					let prompt;
					if (typeof event.prompt == "string") {
						prompt = event.prompt;
					} else {
						let select;
						if (range[0] == range[1]) {
							select = get.cnNumber(range[0]);
						} else if (range[1] == Infinity) {
							select = "至少" + get.cnNumber(range[0]);
						} else {
							select = get.cnNumber(range[0]) + "至" + get.cnNumber(range[1]);
						}
						const position = event.position == "h" ? "手" : event.position == "e" ? "装备" : "";
						prompt = `请交给${get.translation(target)}${select}张${position}牌`;
					}
					event.dialog = ui.create.dialog(prompt);
					if (event.prompt2) {
						event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
					}
					if (Array.isArray(event.promptx)) {
						event.promptx.forEach(i => event.dialog.add(i));
					}
					if (Array.isArray(event.selectCard)) {
						event.promptbar = event.dialog.add("0/" + get.numStr(event.selectCard[1], "card"));
						event.custom.add.card = function () {
							_status.event.promptbar.innerHTML = ui.selected.cards.length + "/" + get.numStr(_status.event.selectCard[1], "card");
						};
					}
				} else if (get.itemtype(event.dialog) == "dialog") {
					event.dialog.style.display = "";
					event.dialog.open();
				}
			} else if (event.isOnline()) {
				event.send();
			} else {
				event.result = "ai";
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;
			if (event.result != "ai") {
				return;
			}

			game.check();
			if ((ai.basic.chooseCard(event.ai) || forced) && (!event.filterOk || event.filterOk())) {
				ui.click.ok();
			} else if (event.skill) {
				ui.click.cancel();
				event._aiexclude.add(event.skill);
				event.redo();
				game.resume();
			} else {
				ui.click.cancel();
			}
		},
		async (event, trigger, player) => {
			event.resume();
			if (event.cardChooseAll) {
				event.cardChooseAll.close();
			}
			if (event.aiChoose) {
				event.aiChoose.close();
			}
			if (event.glow_result && event.result.cards && !event.directresult) {
				event.result.cards.forEach(i => i.classList.add("glow"));
			}
			if (event.dialog) {
				event.dialog.close();
			}
		},
		async (event, trigger, player) => {
			if (!event.result.bool || !event.result.cards || game.online) {
				event.finish();
				return;
			}

			event.cards = event.result.cards.slice(0);
			if (event.logSkill) {
				if (Array.isArray(event.logSkill)) {
					player.logSkill(...event.logSkill);
				} else {
					player.logSkill(event.logSkill);
				}
			}
			if (event.autodelay && !event.isMine()) {
				if (typeof event.autodelay == "number") {
					game.delayx(event.autodelay);
				} else {
					game.delayx();
				}
			}
		},
		async (event, trigger, player) => {
			const { cards, target } = event;
			if (event.boolline) {
				player.line(target, "green");
			}
			event.done = target.gain(event.cards, player);
			event.done.gaintag.addArray(event.gaintag);
			event.done.giver = player;
			if (event.delay !== false) {
				event.done.animate = event.visibleMove ? "give" : "giveAuto";
			} else {
				target[event.visibleMove ? "$give" : "$giveAuto"](cards, player);
				if (event.visibleMove) {
					event.done.visible = true;
				}
			}
		},
	],
	chooseToDiscard: [
		async (event, trigger, player) => {
			event.filterCard = (event => {
				const filterCard = event.filterCard;
				return function (card, player) {
					if (!lib.filter.cardDiscardable(card, player, this)) {
						return false;
					}
					return filterCard.call(this, card, player);
				};
			})(event);
			if (_status.noclearcountdown !== "direct") {
				_status.noclearcountdown = true;
			}
			/*if (!player.getCards(event.position).filter(card => event.filterCard(card, player)).length) {
				event.result = {
					bool: false,
					cards: [],
				};
			} else */
			if (event.autochoose()) {
				event.result = {
					bool: true,
					autochoose: true,
					cards: player.getCards(event.position),
					rawcards: player.getCards(event.position),
				};
				for (var i = 0; i < event.result.cards.length; i++) {
					if (!lib.filter.cardDiscardable(event.result.cards[i], player, event)) {
						event.result.cards.splice(i--, 1);
					}
				}
			} else {
				if (game.modeSwapPlayer && !_status.auto && player.isUnderControl()) {
					game.modeSwapPlayer(player);
				}
				event.rangecards = player.getCards(event.position);
				for (var i = 0; i < event.rangecards.length; i++) {
					if (lib.filter.cardDiscardable(event.rangecards[i], player, event)) {
						event.rangecards.splice(i--, 1);
					} else {
						event.rangecards[i].uncheck("chooseToDiscard");
					}
				}
				const directFilter =
					event.forced && typeof event.filterOk != "function" && typeof event.selectCard != "function" && !event.complexCard;
				const cards = directFilter
					? player
							.getCards(event.position)
							.filter(card => !card.classList.contains("uncheck") && lib.filter.cardAiIncluded(card) && event.filterCard(card, player))
					: [];
				const range = get.select(event.selectCard);
				if (directFilter && (range[0] >= cards.length || range[1] <= -1)) {
					if (player.isOut()) {
						event.result = {
							cards: [],
						};
					} else {
						event.result = {
							bool: true,
							cards: cards,
						};
					}
				} else if (event.isMine()) {
					game.check();
					if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
						ui.click.cancel();
						return;
					}
					game.pause();
					if (range[1] > 1 && typeof event.selectCard != "function") {
						ui.create.cardChooseAll();
						event.promptdiscard = ui.create.control("AI代选", function () {
							ai.basic.chooseCard(event.ai);
							if (typeof _status.event.custom?.add?.card == "function") {
								_status.event.custom.add.card();
							}
							for (var i = 0; i < ui.selected.cards.length; i++) {
								ui.selected.cards[i].updateTransform(true);
							}
						});
					}
					if (Array.isArray(event.dialog)) {
						event.dialog = ui.create.dialog.apply(this, event.dialog);
						event.dialog.open();
						event.dialog.classList.add("noselect");
					} else if (event.prompt != false) {
						let str;
						if (typeof event.prompt == "string") {
							str = event.prompt;
						} else {
							str = "请弃置";
							if (range[0] == range[1]) {
								str += get.cnNumber(range[0]);
							} else if (range[1] == Infinity) {
								str += "至少" + get.cnNumber(range[0]);
							} else {
								str += get.cnNumber(range[0]) + "至" + get.cnNumber(range[1]);
							}
							str += "张";
							if (event.position == "h" || event.position == undefined) {
								str += "手";
							}
							if (event.position == "e") {
								str += "装备";
							}
							str += "牌";
						}
						event.dialog = ui.create.dialog(str);
						if (event.prompt2) {
							event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
						}
						if (Array.isArray(event.selectCard)) {
							event.promptbar = event.dialog.add("0/" + get.numStr(event.selectCard[1], "card"));
							event.custom.add.card = function () {
								_status.event.promptbar.innerHTML = ui.selected.cards.length + "/" + get.numStr(_status.event.selectCard[1], "card");
							};
						}
					} else if (get.itemtype(event.dialog) == "dialog") {
						event.dialog.style.display = "";
						event.dialog.open();
					}
				} else if (event.isOnline()) {
					event.result = await event.sendAsync();
				} else {
					event.result = "ai";
				}
			}
		},
		async (event, trigger, player) => {
			if (event.result == "ai") {
				game.check();
				if ((ai.basic.chooseCard(event.ai) || event.forced) && (!event.filterOk || event.filterOk())) {
					ui.click.ok();
				} else if (event.skill) {
					const skill = event.skill;
					ui.click.cancel();
					event._aiexclude.add(skill);
					event.redo();
					game.resume();
				} else {
					ui.click.cancel();
				}
			}
			if (event.rangecards) {
				for (var i = 0; i < event.rangecards.length; i++) {
					event.rangecards[i].recheck("chooseToDiscard");
				}
			}
		},
		async (event, trigger, player) => {
			event.resume();
			if (event.cardChooseAll) {
				event.cardChooseAll.close();
			}
			if (typeof event.promptdiscard?.close == "function") {
				event.promptdiscard.close();
			}
			if (event.result) {
				if (event.result._sendskill) {
					lib.skill[event.result._sendskill[0]] = event.result._sendskill[1];
				}
				if (event.result.skill) {
					const info = get.info(event.result.skill);
					if (info && info.precontent && !game.online) {
						const next = game.createEvent("pre_" + event.result.skill);
						next.setContent(info.precontent);
						next.set("result", event.result);
						next.set("player", player);
						await next;
					}
				}
			}
		},
		async (event, trigger, player) => {
			if (event.result.bool && event.result.cards?.length && !game.online && event.autodelay && !event.isMine()) {
				if (typeof event.autodelay == "number") {
					await game.delayx(event.autodelay);
				} else {
					await game.delayx();
				}
			}
		},
		async (event, trigger, player) => {
			delete _status.noclearcountdown;
			if (typeof event.dialog?.close == "function") {
				event.dialog.close();
			}
			if (!game.online && event.result.bool) {
				if (event.logSkill) {
					if (typeof event.logSkill == "string") {
						player.logSkill(event.logSkill);
					} else if (Array.isArray(event.logSkill)) {
						player.logSkill.apply(player, event.logSkill);
					}
				}
				if (!event.chooseonly) {
					const next = player.discard(event.result.cards);
					if (typeof event.delay == "boolean") {
						next.delay = event.delay;
					}
					next.discarder = player;
					event.done = next;
					await next;
				}
			} else if (event._sendskill) {
				event.result._sendskill = event._sendskill;
			}
			if (!_status.noclearcountdown) {
				game.stopCountChoose();
			}
		},
	],
	async gaincardMultiple(event, trigger, player) {
		const { cards } = event;
		event.type = "gain";
		if (event.animate == "give" || event.animate == "gain2") {
			event.visible = true;
		}
		if (player && cards) {
			event._lose = true;
			await player.lose(cards, ui.special).set("type", "gain").set("forceDie", true).set("getlx", false);
		}

		let delay;
		switch (event.animate) {
			case "draw":
				for (const pair of event.gain_list) {
					if (get.itemtype(pair[1]) == "card") {
						pair[1] = [pair[1]];
					}
					if (event._lose) {
						pair[1] = pair[1].filter(card => {
							return !cards.includes(card) || !player.getCards("hejsx").includes(card);
						});
					}
					if (pair[1].length > 0) {
						pair[0].$draw(pair[1].length);
					}
				}
				delay = game.delay(0, get.delayx(500, 500));
				break;
			case "gain":
				for (const pair of event.gain_list) {
					if (get.itemtype(pair[1]) == "card") {
						pair[1] = [pair[1]];
					}
					if (event._lose) {
						pair[1] = pair[1].filter(card => {
							return !cards.includes(card) || !player.getCards("hejsx").includes(card);
						});
					}
					if (pair[1].length > 0) {
						pair[0].$gain(pair[1].length);
					}
				}
				delay = game.delay(0, get.delayx(700, 700));
				break;
			case "gain2":
			case "draw2":
				for (const pair of event.gain_list) {
					if (get.itemtype(pair[1]) == "card") {
						pair[1] = [pair[1]];
					}
					if (event._lose) {
						pair[1] = pair[1].filter(card => {
							return !cards.includes(card) || !player.getCards("hejsx").includes(card);
						});
					}
					if (pair[1].length > 0) {
						pair[0].$gain2(pair[1]);
					}
				}
				delay = game.delay(0, get.delayx(500, 500));
				break;
			case "give":
			case "giveAuto": {
				if (!player) {
					break;
				}
				const evt = event.getl(player);
				for (const pair of event.gain_list) {
					if (get.itemtype(pair[1]) == "card") {
						pair[1] = [pair[1]];
					}
					if (event._lose) {
						pair[1] = pair[1].filter(card => {
							return !cards.includes(card) || !player.getCards("hejsx").includes(card);
						});
					}
					const shown = pair[1].slice(0);
					const hidden = [];
					if (event.animate == "giveAuto") {
						for (const card of pair[1]) {
							if (evt.hs.includes(card)) {
								shown.remove(card);
								hidden.push(card);
							}
						}
					}
					if (shown.length > 0) {
						player.$give(shown, pair[0]);
					}
					if (hidden.length > 0) {
						player.$giveAuto(hidden, pair[0]);
					}
				}
				delay = game.delay(0, get.delayx(500, 500));
				break;
			}
		}
		const nexts = [];
		for (const pair of event.gain_list) {
			if (pair[1].length > 0) {
				const next = pair[0].gain(pair[1]);
				next.getlx = false;
				if (event.visible) {
					next.visible = true;
				}
				if (event.giver) {
					next.giver = event.giver;
				}
				if (event.gaintag) {
					next.gaintag.addArray(event.gaintag);
				}
				nexts.push(next);
			}
		}
		await delay;
		await Promise.all(nexts);
		await game.delayx();
	},
	async discardMultiple(event, trigger, player) {
		event.type = "discard";
		event.visible = true;
		if (!event.position) {
			event.position = ui.discardPile;
		}

		const allCards = [];
		const events = [];
		event.cards = allCards;
		for (const [target, cards] of event.lose_list) {
			const next = target.lose(cards, event.position);
			game.log(target, "弃置了", cards);
			next.type = "discard";
			next.animate = false;
			next.delay = false;
			allCards.addArray(cards);
			next.getlx = false;

			events.push(next);
		}

		const evt = event;
		const { cards } = event;
		if (evt.animate != false) {
			evt.discardid = lib.status.videoId++;
			game.broadcastAll(
				function (list, id, cards) {
					for (var i of list) {
						for (var j of i[1]) {
							j.classList.remove("glow");
							j.classList.remove("glows");
						}
						i[0].$throw(i[1], null, "nobroadcast");
					}
					var cardnodes = [];
					cardnodes._discardtime = get.time();
					for (var ix of list) {
						var card = ix[1];
						for (var i = 0; i < cards.length; i++) {
							if (cards[i].clone) {
								cardnodes.push(cards[i].clone);
							}
						}
					}
					ui.todiscard[id] = cardnodes;
				},
				event.lose_list,
				evt.discardid,
				cards
			);
			if (lib.config.sync_speed && cards[0] && cards[0].clone) {
				if (evt.delay != false) {
					const waitingForTransition = get.time();
					evt.waitingForTransition = waitingForTransition;
					cards[0].clone.listenTransition(function () {
						if (_status.waitingForTransition == waitingForTransition && _status.paused) {
							game.resume();
						}
						delete evt.waitingForTransition;
					});
				} else if (evt.getParent().discardTransition) {
					delete evt.getParent().discardTransition;
					const waitingForTransition = get.time();
					evt.getParent().waitingForTransition = waitingForTransition;
					cards[0].clone.listenTransition(function () {
						if (_status.waitingForTransition == waitingForTransition && _status.paused) {
							game.resume();
						}
						delete evt.getParent().waitingForTransition;
					});
				}
			}
		}

		await Promise.all(events);

		if (event.delay != false) {
			if (event.waitingForTransition) {
				_status.waitingForTransition = event.waitingForTransition;
				await game.pause();
			} else {
				await game.delayx();
			}
		}
	},
	addToExpansionMultiple: [
		async (event, trigger, player) => {
			if (event.animate == "give") {
				event.visible = true;
			}
			event.type = "addToExpansion";
			event.gaintag ??= [];
			event.cards ??= [];
			if (event.lose_list) {
				var map = {},
					map2 = {};
				for (var list of event.lose_list) {
					var player = list[0],
						cards = list[1];
					event.cards.addArray(cards);
					var myId = player.playerid;
					if (!map2[myId]) {
						map2[myId] = [];
					}
					for (const i of cards) {
						var owner = get.owner(i, "judge");
						if (owner && (owner != player || get.position(i) != "x")) {
							var id = owner.playerid;
							if (!map[id]) {
								map[id] = [[], [], []];
							}
							map[id][0].push(i);
							map2[myId].push(i);
							var position = get.position(i);
							if (position == "h") {
								map[id][1].push(i);
							} else {
								map[id][2].push(i);
							}
						} else if (!event.updatePile && get.position(i) == "c") {
							event.updatePile = true;
						}
					}
				}
				event.losing_map = map;
				event.gaining_map = map2;
				for (const i in map) {
					var owner = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
					var next = owner.lose(map[i][0], ui.special).set("forceDie", true).set("getlx", false);
					next.set("relatedEvent", event.getParent());
					next.set("forceDie", true);
					next.set("getlx", false);
					if (event.visible == true) {
						next.set("visible", true);
					}
					await next;
				}
			} else {
				event.finish();
				return;
			}
		},
		async (event, trigger, player) => {
			let { cards: cardsx } = event;
			/*event.cards = cards = cards.map(i => (i.cards ? i.cards : [i])).flat();*/
			if (event.lose_list) {
				var map = {};
				for (var list of event.lose_list) {
					const player = list[0];
					const cards = list[1];
					for (var i = 0; i < cards.length; i++) {
						if (cards[i].willBeDestroyed("expansion", player, event)) {
							cards[i].selfDestroy(event);
							cards.splice(i--, 1);
							cardsx.remove(cards[i]);
						} else if (event.losing_map) {
							for (var id in event.losing_map) {
								if (event.losing_map[id][0].includes(cards[i])) {
									const source = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
									var hs = source.getCards("hejsx");
									if (hs.includes(cards[i])) {
										cards.splice(i--, 1);
										cardsx.remove(cards[i]);
									}
								}
							}
						}
					}
				}
			}
			if (cardsx.length == 0) {
				event.finish();
				return;
			}
		},
		async (event, trigger, player) => {
			let { lose_list } = event;
			for (const [source, cards] of lose_list) {
				for (const [key, value] of lib.commonArea) {
					const list = (_status[value.areaStatusName] || []).filter(card => cards.includes(card));
					if (event[value.fromName] || list.length) {
						const next = game.createEvent("from_" + value.fromName);
						next.setContent(value.removeHandeler);
						next.cards = cards;
						next.player = source;
						next.type = event.type;
						await next;
					}
				}
			}
		},
		async (event, trigger, player) => {
			var loopedCount = 0,
				mapLength = Object.keys(event.gaining_map).length;
			for (var j in event.gaining_map) {
				loopedCount++;
				var map = {};
				var player = (_status.connectMode ? lib.playerOL : game.playerMap)[j],
					cards = event.gaining_map[j];
				var hs = player.getCards("x");
				for (var i = 0; i < cards.length; i++) {
					if (hs.includes(cards[i])) {
						cards.splice(i--, 1);
					}
				}
				for (var num = 0; num < cards.length; num++) {
					if (_status.discarded) {
						_status.discarded.remove(cards[num]);
					}
					for (var num2 = 0; num2 < cards[num].vanishtag.length; num2++) {
						if (cards[num].vanishtag[num2][0] != "_") {
							cards[num].vanishtag.splice(num2--, 1);
						}
					}
				}
				if (event.animate == "draw") {
					player.$draw(cards.length);
					if (event.log) {
						game.log(player, "将", get.cnNumber(cards.length), "张牌置于了武将牌上");
					}
					game.pause();
					setTimeout(
						(player, cards, resume) => {
							player.$addToExpansion(cards, null, event.gaintag);
							for (var i of event.gaintag) {
								player.markSkill(i);
							}
							if (resume) {
								game.resume();
							}
						},
						get.delayx(500, 500),
						player,
						cards,
						loopedCount === mapLength
					);
				} else if (event.animate == "gain") {
					player.$gain(cards, false);
					game.pause();
					setTimeout(
						(player, cards, resume) => {
							player.$addToExpansion(cards, null, event.gaintag);
							for (var i of event.gaintag) {
								player.markSkill(i);
							}
							if (resume) {
								game.resume();
							}
						},
						get.delayx(700, 700),
						player,
						cards,
						loopedCount === mapLength
					);
				} else if (event.animate == "gain2" || event.animate == "draw2") {
					var gain2t = 300;
					if (player.$gain2(cards) && player == game.me) {
						gain2t = 500;
					}
					game.pause();
					setTimeout(
						(player, cards, resume) => {
							player.$addToExpansion(cards, null, event.gaintag);
							for (var i of event.gaintag) {
								player.markSkill(i);
							}
							if (resume) {
								game.resume();
							}
						},
						get.delayx(gain2t, gain2t),
						player,
						cards,
						loopedCount === mapLength
					);
				} else if (event.animate == "give" || event.animate == "giveAuto") {
					var evtmap = event.losing_map;
					var entries = Object.entries(evtmap).map(entry => [entry[0], entry[1][0]]);
					var getOwner = card => {
						var entry = entries.find(entry => entry[1].includes(card));
						if (entry) {
							return (_status.connectMode ? lib.playerOL : game.playerMap)[entry[0]];
						}
						return null;
					};
					var gainmap = {};
					for (var cardx of cards) {
						var owner = getOwner(cardx);
						if (owner) {
							var id = owner.playerid;
							if (!gainmap[id]) {
								gainmap[id] = [];
							}
							gainmap[id].push(cardx);
						}
					}
					if (event.animate == "give") {
						for (let i in gainmap) {
							const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
							source.$give(evtmap[i][0], player, false);
							if (event.log) {
								game.log(player, "将", evtmap[i][0], "置于了武将牌上");
							}
						}
					} else {
						for (let i in gainmap) {
							const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
							if (evtmap[i][1].length) {
								source.$giveAuto(evtmap[i][1], player, false);
								if (event.log) {
									game.log(player, "将", get.cnNumber(evtmap[i][1].length), "张牌置于了武将牌上");
								}
							}
							if (evtmap[i][2].length) {
								source.$give(evtmap[i][2], player, false);
								if (event.log) {
									game.log(player, "将", evtmap[i][2], "置于了武将牌上");
								}
							}
						}
					}
					game.pause();
					setTimeout(
						(player, cards, resume) => {
							player.$addToExpansion(cards, null, event.gaintag);
							for (var i of event.gaintag) {
								player.markSkill(i);
							}
							if (resume) {
								game.resume();
							}
						},
						get.delayx(500, 500),
						player,
						cards,
						loopedCount === mapLength
					);
				} else if (typeof event.animate == "function") {
					var time = event.animate(event);
					game.pause();
					setTimeout(
						(player, cards, resume) => {
							player.$addToExpansion(cards, null, event.gaintag);
							for (var i of event.gaintag) {
								player.markSkill(i);
							}
							if (resume) {
								game.resume();
							}
						},
						get.delayx(time, time),
						player,
						cards,
						loopedCount === mapLength
					);
				} else {
					player.$addToExpansion(cards, null, event.gaintag);
					for (var i of event.gaintag) {
						player.markSkill(i);
					}
					event.finish();
				}
			}
		},
		async (event, trigger, player) => {
			if (event.updatePile) {
				game.updateRoundNumber();
			}
			await game.delayx();
		},
	],
	loseToDiscardpileMultiple: [
		async (event, trigger, player) => {
			event.visible = true;
			if (!event.position) {
				event.position = ui.discardPile;
			}
			event.type = "loseToDiscardpile";
			const cards = [];
			event.cards = cards;
			for (var i = 0; i < event.lose_list.length; i++) {
				var next = event.lose_list[i][0].lose(event.lose_list[i][1], event.position);
				game.log(event.lose_list[i][0], "将", event.lose_list[i][1], "置入了弃牌堆");
				next.animate = false;
				next.delay = false;
				cards.addArray(event.lose_list[i][1]);
				next.getlx = false;
			}
			var evt = event;
			if (evt.animate != false) {
				evt.discardid = lib.status.videoId++;
				game.broadcastAll(
					function (list, id, cards) {
						for (var i of list) {
							for (var j of i[1]) {
								j.classList.remove("glow");
								j.classList.remove("glows");
							}
							i[0].$throw(i[1], null, "nobroadcast");
						}
						var cardnodes = [];
						cardnodes._discardtime = get.time();
						for (var ix of list) {
							var card = ix[1];
							for (var i = 0; i < cards.length; i++) {
								if (cards[i].clone) {
									cardnodes.push(cards[i].clone);
								}
							}
						}
						ui.todiscard[id] = cardnodes;
					},
					event.lose_list,
					evt.discardid,
					cards
				);
				if (lib.config.sync_speed && cards[0] && cards[0].clone) {
					if (evt.delay != false) {
						var waitingForTransition = get.time();
						evt.waitingForTransition = waitingForTransition;
						cards[0].clone.listenTransition(function () {
							if (_status.waitingForTransition == waitingForTransition && _status.paused) {
								game.resume();
							}
							delete evt.waitingForTransition;
						});
					} else if (evt.getParent().discardTransition) {
						delete evt.getParent().discardTransition;
						var waitingForTransition = get.time();
						evt.getParent().waitingForTransition = waitingForTransition;
						cards[0].clone.listenTransition(function () {
							if (_status.waitingForTransition == waitingForTransition && _status.paused) {
								game.resume();
							}
							delete evt.getParent().waitingForTransition;
						});
					}
				}
			}
		},
		async (event, trigger, player) => {
			if (event.delay != false) {
				if (event.waitingForTransition) {
					_status.waitingForTransition = event.waitingForTransition;
					game.pause();
				} else {
					await game.delayx();
				}
			}
		},
	],
	async chooseToCompareLose(event) {
		const waitings = [];
		for (const [player, cards] of event.lose_list) {
			const next = player.lose(cards, ui.ordering);
			next.relatedEvent = event.relatedEvent || event.getParent();
			next.getlx = false;
			waitings.push(next);
		}
		await Promise.all(waitings);
	},
	chooseToCompareMeanwhile: [
		async (event, trigger, player) => {
			const targets = event.targets;
			if (player.countCards("h") == 0 && (!event.fixedResult || !event.fixedResult[player.playerid])) {
				event.result = { cancelled: true, bool: false };
				event.finish();
				return;
			}
			for (var i = 0; i < targets.length; i++) {
				if (targets[i].countCards("h") == 0 && (!event.fixedResult || !event.fixedResult[targets[i].playerid])) {
					event.result = { cancelled: true, bool: false };
					event.finish();
					return;
				}
			}
			if (!event.multitarget) {
				targets.sort(lib.sort.seat);
			}
			game.log(player, "对", targets, "发起了共同拼点");
			event.compareMeanwhile = true;
			event.filterCard ??= lib.filter.all;
		},
		async (event, trigger, player) => {
			const targets = event.targets;
			event._result = [];
			event.list = targets.filter(current => !event.fixedResult?.[current.playerid]);
			if (event.list.length || !event.fixedResult || !event.fixedResult[player.playerid]) {
				if (!event.fixedResult || !event.fixedResult[player.playerid]) {
					event.list.unshift(player);
				}
				player
					.chooseCardOL(event.list, "请选择拼点牌", true)
					.set("filterCard", event.filterCard)
					.set("type", "compare")
					.set("ai", event.ai)
					.set("source", player).aiCard = function (target) {
					var hs = target.getCards("h");
					var event = _status.event;
					event.player = target;
					hs.sort(function (a, b) {
						return event.ai(b) - event.ai(a);
					});
					delete event.player;
					return { bool: true, cards: [hs[0]] };
				};
			}
		},
		async (event, trigger, player, result) => {
			var cards = [];
			var lose_list = [];
			if (event.fixedResult?.[player.playerid]) {
				event.list.unshift(player);
				result.unshift({ bool: true, cards: [event.fixedResult[player.playerid]] });
				lose_list.push([player, [event.fixedResult[player.playerid]]]);
			} else {
				if (result[0].skill && lib.skill[result[0].skill]?.onCompare) {
					player.logSkill(result[0].skill);
					result[0].cards = lib.skill[result[0].skill].onCompare(player);
				} else {
					lose_list.push([player, result[0].cards]);
				}
			}
			const targets = event.targets;
			for (var j = 0; j < targets.length; j++) {
				if (event.list.includes(targets[j])) {
					var i = event.list.indexOf(targets[j]);
					if (result[i].skill && lib.skill[result[i].skill]?.onCompare) {
						event.list[i].logSkill(result[i].skill);
						result[i].cards = lib.skill[result[i].skill].onCompare(event.list[i]);
					} else {
						lose_list.push([targets[j], result[i].cards]);
					}
					cards.push(result[i].cards[0]);
				} else if (event.fixedResult?.[targets[j].playerid]) {
					cards.push(event.fixedResult[targets[j].playerid]);
					lose_list.push([targets[j], [event.fixedResult[targets[j].playerid]]]);
				}
			}
			if (lose_list.length) {
				game.loseAsync({
					lose_list: lose_list,
				}).setContent("chooseToCompareLose");
			}
			event.lose_list = lose_list;
			event.getNum = card => {
				for (var i of event.lose_list) {
					if (i[1].includes && i[1].includes(card)) {
						return get.number(card, i[0]);
					}
				}
				return get.number(card, false);
			};
			event.cardlist = cards;
			event.cards = cards;
			event.card1 = result[0].cards[0];
			event.num1 = event.getNum(event.card1);
			event.iwhile = 0;
			event.winner = null;
			event.maxNum = -1;
			event.tempplayer = event.player;
			event.result = {
				winner: null,
				player: event.card1,
				targets: event.cardlist.slice(0),
				num1: [],
				num2: [],
			};
		},
		async (event, trigger, player) => {
			event.trigger("compareCardShowBefore");
		},
		async (event, trigger, player) => {
			const { targets, cards } = event;
			player.$compareMultiple(event.card1, targets, cards);
			game.log(player, "的拼点牌为", event.card1);
			await player.showCards(event.card1).set("triggeronly", true);
			const func = async (card, index) => {
				game.log(targets[index], "的拼点牌为", card);
				await targets[index].showCards(card).set("triggeronly", true);
			};
			await game.doAsyncInOrder(event.cardlist, func, () => 1);
			player.addTempClass("target");
			game.delay(0, lib.config.game_speed == "vvfast" ? 4000 : 1000);
		},
		async (event, trigger, player) => {
			event.target = null;
			event.trigger("compare");
		},
		async (event, trigger, player) => {
			const targets = event.targets;
			if (event.iwhile < targets.length) {
				event.target = targets[event.iwhile];
				event.target.addTempClass("target");
				event.card2 = event.cardlist[event.iwhile];
				event.num2 = event.getNum(event.card2);
				delete event.player;
				event.trigger("compare");
			} else {
				event.iwhile = 0;
				game.delay(0, 1000);
				event.goto(9);
			}
		},
		async (event, trigger, player) => {
			event.result.num1[event.iwhile] = event.num1;
			event.result.num2[event.iwhile] = event.num2;
			var list = [
				[event.tempplayer, event.num1],
				[event.target, event.num2],
			];
			for (var i of list) {
				if (i[1] > event.maxNum) {
					event.maxNum = i[1];
					event.winner = i[0];
				} else if (event.winner && i[1] == event.maxNum && i[0] != event.winner) {
					event.winner = null;
				}
			}
		},
		async (event, trigger, player) => {
			event.iwhile++;
			event.goto(6);
		},
		async (event, trigger, player) => {
			event.player = event.tempplayer;
			event.trigger("compareFixing");
		},
		async (event, trigger, player) => {
			if (event.player) {
				delete event.player;
			}
			const targets = event.targets;
			if (event.iwhile < targets.length) {
				event.target = targets[event.iwhile];
				event.card2 = event.cardlist[event.iwhile];
				event.num2 = event.result.num2[event.iwhile];
				event.trigger("compareFixing");
			} else {
				event.goto(12);
			}
		},
		async (event, trigger, player) => {
			event.iwhile++;
			event.goto(10);
		},
		async (event, trigger) => {
			const targets = event.targets;
			const player = (event.player = event.tempplayer);
			delete event.tempplayer;
			event.str = "无人拼点成功";
			const winner = event.forceWinner || event.winner;
			if (winner) {
				event.result.winner = winner;
				event.str = get.translation(winner) + "拼点成功";
				game.log(winner, "拼点成功");
				winner.popup("胜");
			} else {
				game.log("#b无人", "拼点成功");
			}
			var list = [player].addArray(targets);
			list.remove(winner);
			for (var i of list) {
				i.popup("负");
			}
		},
		async (event, trigger, player) => {
			if (event.str) {
				game.broadcastAll(str => {
					var dialog = ui.create.dialog(str);
					dialog.classList.add("center");
					setTimeout(function () {
						dialog.close();
					}, 1000);
				}, event.str);
			}
			game.delay(3);
		},
		async (event, trigger, player) => {
			game.broadcastAll(ui.clear);
		},
		async (event, trigger, player) => {
			event.cards.add(event.card1);
		},
	],
	chooseToCompareMultiple: [
		async (event, trigger, player) => {
			const targets = event.targets;
			if (!event.fixedResult?.[player.playerid] && player.countCards("h") == 0) {
				event.result = { cancelled: true, bool: false };
				event.finish();
				return;
			}
			for (var i = 0; i < targets.length; i++) {
				if ((!event.fixedResult || !event.fixedResult[targets[i].playerid]) && targets[i].countCards("h") == 0) {
					event.result = { cancelled: true, bool: false };
					event.finish();
					return;
				}
			}
			if (!event.multitarget) {
				targets.sort(lib.sort.seat);
			}
			game.log(player, "对", targets, "发起拼点");
			event.filterCard ??= lib.filter.all;
		},
		async (event, trigger, player) => {
			const targets = event.targets;
			event._result = [];
			event.list = targets.filter(current => !event.fixedResult?.[current.playerid]);
			if (event.list.length || !event.fixedResult?.[player.playerid]) {
				if (!event.fixedResult?.[player.playerid]) {
					event.list.unshift(player);
				}
				player
					.chooseCardOL(event.list, "请选择拼点牌", true)
					.set("filterCard", event.filterCard)
					.set("type", "compare")
					.set("ai", event.ai)
					.set("source", player).aiCard = function (target) {
					var hs = target.getCards("h");
					var event = _status.event;
					event.player = target;
					hs.sort(function (a, b) {
						return event.ai(b) - event.ai(a);
					});
					delete event.player;
					return { bool: true, cards: [hs[0]] };
				};
			}
		},
		async (event, trigger, player, result) => {
			var cards = [];
			var lose_list = [];
			if (event.fixedResult?.[player.playerid]) {
				event.list.unshift(player);
				result.unshift({ bool: true, cards: [event.fixedResult[player.playerid]] });
				lose_list.push([player, [event.fixedResult[player.playerid]]]);
			} else {
				if (result[0].skill && lib.skill[result[0].skill]?.onCompare) {
					player.logSkill(result[0].skill);
					result[0].cards = lib.skill[result[0].skill].onCompare(player);
				} else {
					lose_list.push([player, result[0].cards]);
				}
			}
			const targets = event.targets;
			for (var j = 0; j < targets.length; j++) {
				if (event.list.includes(targets[j])) {
					var i = event.list.indexOf(targets[j]);
					if (result[i].skill && lib.skill[result[i].skill] && lib.skill[result[i].skill].onCompare) {
						event.list[i].logSkill(result[i].skill);
						result[i].cards = lib.skill[result[i].skill].onCompare(event.list[i]);
					} else {
						lose_list.push([targets[j], result[i].cards]);
					}
					cards.push(result[i].cards[0]);
				} else if (event.fixedResult?.[targets[j].playerid]) {
					cards.push(event.fixedResult[targets[j].playerid]);
					lose_list.push([targets[j], [event.fixedResult[targets[j].playerid]]]);
				}
			}
			if (lose_list.length) {
				game.loseAsync({
					lose_list: lose_list,
				}).setContent("chooseToCompareLose");
			}
			event.lose_list = lose_list;
			event.getNum = function (card) {
				for (var i of event.lose_list) {
					if (i[1].includes && i[1].includes(card)) {
						return get.number(card, i[0]);
					}
				}
				return get.number(card, false);
			};
			event.cardlist = cards;
			event.cards = cards;
			event.card1 = result[0].cards[0];
			event.num1 = event.getNum(event.card1);
			event.iwhile = 0;
			event.result = {
				player: event.card1,
				targets: event.cardlist.slice(0),
				num1: [],
				num2: [],
			};
		},
		async (event, trigger, player) => {
			event.trigger("compareCardShowBefore");
		},
		async (event, trigger, player) => {
			game.log(player, "的拼点牌为", event.card1);
			player.showCards(event.card1).set("triggeronly", true);
		},
		async (event, trigger, player) => {
			const targets = event.targets;
			if (event.iwhile < targets.length) {
				event.target = targets[event.iwhile];
				event.target.addTempClass("target");
				player.addTempClass("target");
				event.card2 = event.cardlist[event.iwhile];
				event.num2 = event.getNum(event.card2);
				game.log(event.target, "的拼点牌为", event.card2);
				player.line(event.target);
				player.$compare(event.card1, event.target, event.card2);
				event.target.showCards(event.card2).set("triggeronly", true);
			} else {
				event.goto(12);
			}
		},
		async (event, trigger, player) => {
			await game.delay(0, lib.config.game_speed == "vvfast" ? 4000 : 1500);
			await event.trigger("compare");
		},
		async (event, trigger, player) => {
			event.iiwhile = event.iwhile;
			delete event.iwhile;
			event.trigger("compareFixing");
		},
		async (event, trigger, player) => {
			const target = event.target;
			event.result.num1[event.iiwhile] = event.num1;
			event.result.num2[event.iiwhile] = event.num2;
			if (event.forceWinner === player || (event.forceWinner !== target && event.num1 > event.num2)) {
				event.winner = player;
				event.str = get.translation(player) + "拼点成功";
				player.popup("胜");
				target.popup("负");
			} else {
				event.str = get.translation(player) + "拼点失败";
				if (event.forceWinner !== target && event.num1 == event.num2) {
					player.popup("平");
					target.popup("平");
				} else {
					event.winner = target;
					player.popup("负");
					target.popup("胜");
				}
			}
		},
		async (event, trigger, player) => {
			game.broadcastAll(str => {
				var dialog = ui.create.dialog(str);
				dialog.classList.add("center");
				setTimeout(() => dialog.close(), 1000);
			}, event.str);
			game.delay(2);
		},
		async (event, trigger, player) => {
			if (event.callback) {
				game.broadcastAll(
					function (card1, card2) {
						if (card1.clone) {
							card1.clone.style.opacity = 0.5;
						}
						if (card2.clone) {
							card2.clone.style.opacity = 0.5;
						}
					},
					event.card1,
					event.card2
				);
				var next = game.createEvent("compareMultiple");
				next.player = player;
				next.target = event.target;
				next.card1 = event.card1;
				next.card2 = event.card2;
				next.num1 = event.num1;
				next.num2 = event.num2;
				next.winner = event.winner;
				next.setContent(event.callback);
				event.compareMultiple = true;
			}
		},
		async (event, trigger, player) => {
			game.broadcastAll(ui.clear);
			delete event.winner;
			delete event.forceWinner;
			event.iwhile = event.iiwhile + 1;
			event.goto(5);
		},
		async (event, trigger, player) => {
			event.cards.add(event.card1);
		},
	],
	chooseToCompare: [
		async (event, trigger, player) => {
			const target = event.target;
			if (target === "cardPile") {
				event.compareWithCardPile = true;
				event.compareType ??= "top";
			}
			if (!event.position || typeof event.position != "string") {
				event.position = "h";
			}
			if (
				(!event.fixedResult?.[player.playerid] && player.countCards(event.position) == 0) ||
				(!event.compareWithCardPile && !event.fixedResult?.[target.playerid] && target.countCards(event.position) == 0)
			) {
				event.result = { cancelled: true, bool: false };
				event.finish();
				return;
			}
			game.log(player, "对", event.compareWithCardPile ? "牌堆" : target, "发起", event.isDelay ? "延时" : "", "拼点");
			event.filterCard ??= lib.filter.all;
		},
		async (event, trigger, player) => {
			const target = event.target;
			event.list = [player, target].filter(current => get.itemtype(current) == "player" && !event.fixedResult?.[current.playerid]);
			if (event.list.length) {
				player
					.chooseCardOL(event.list, "请选择拼点牌", true, event.position)
					.set("small", event.small)
					.set("filterCard", event.filterCard)
					.set("type", "compare")
					.set("ai", event.ai)
					.set("source", player).aiCard = function (target) {
					var hs = target.getCards("h");
					var event = _status.event;
					event.player = target;
					hs.sort((a, b) => event.ai(b) - event.ai(a));
					delete event.player;
					return { bool: true, cards: [hs[0]] };
				};
			}
		},
		async (event, trigger, player, result) => {
			const target = event.target;
			const lose_list = [];
			if (event.fixedResult?.[player.playerid]) {
				lose_list.push([player, [event.fixedResult[player.playerid]]]);
			} else {
				if (result[0].skill && lib.skill[result[0].skill]?.onCompare) {
					player.logSkill(result[0].skill);
					result[0].cards = lib.skill[result[0].skill].onCompare(player);
				}
				lose_list.push([player, result[0].cards]);
			}
			event.card1 = lose_list[0][1][0];
			if (event.list.includes(target)) {
				let index = event.list.indexOf(target);
				if (result[index].skill && lib.skill[result[index].skill]?.onCompare) {
					target.logSkill(result[index].skill);
					result[index].cards = lib.skill[result[index].skill].onCompare(target);
				}
				lose_list.push([target, result[index].cards]);
			} else if (get.itemtype(target) == "player" && event.fixedResult?.[target.playerid]) {
				lose_list.push([target, [event.fixedResult[target.playerid]]]);
			}
			let card2;
			if (event.compareWithCardPile) {
				if (event.compareType == "top") {
					card2 = game.cardsGotoOrdering(get.cards()).cards[0];
				} else if (event.compareType == "bottom") {
					card2 = game.cardsGotoOrdering(get.bottomCards()).cards[0];
				}
			} else {
				card2 = lose_list[1][1][0];
			}
			event.card2 = card2;
			event.lose_list = lose_list;
		},
		async (event, trigger, player) => {
			const target = event.target;
			if (get.itemtype(target) == "player" && (event.card2.number >= 10 || event.card2.number <= 4)) {
				if (target.countCards("h") > 2) {
					event.addToAI = true;
				}
			}
		},
		async (event, trigger, player) => {
			if (event.lose_list.length) {
				game.loseAsync({
					lose_list: event.lose_list,
				}).setContent("chooseToCompareLose");
			}
		},
		async (event, trigger, player) => {
			const target = event.target;
			if (event.isDelay) {
				let cards = [];
				for (let current of event.lose_list) {
					current[0].$giveAuto(current[1], current[0], false);
					cards.addArray(current[1]);
				}
				game.cardsGotoSpecial(cards);
				const evt = event;
				player
					.when({
						global: ["dieAfter", "phaseEnd"],
					})
					.assign({
						forceDie: true,
					})
					.filter((event, player) => {
						return event.name == "phase" || [player, target].includes(event.player);
					})
					.step(async (event, trigger, player) => {
						if (cards?.some(card => get.position(card) == "s")) {
							evt.isDestoryed = true;
							await game.cardsGotoOrdering(cards);
							await game.cardsDiscard(cards);
						}
					});
				event.untrigger();
				event.finish();
			} else {
				event.trigger("compareCardShowBefore");
			}
		},
		async (event, trigger, player) => {
			const target = event.target;
			game.broadcastAll(() => ui.arena.classList.add("thrownhighlight"));
			game.addVideo("thrownhighlight1");
			player.$compare(event.card1, event.compareWithCardPile ? player : target, event.card2);
		},
		async (event, trigger, player) => {
			const target = event.target;
			game.log(player, "的拼点牌为", event.card1);
			await player.showCards(event.card1).set("triggeronly", true);
			game.log(event.compareWithCardPile ? "牌堆" : target, "的拼点牌为", event.card2);
			if (event.compareWithCardPile) {
				await player.showCards(event.card2).set("triggeronly", true);
			} else {
				await target.showCards(event.card2).set("triggeronly", true);
			}
			var getNum = function (card) {
				for (var i of event.lose_list) {
					if (i[1].includes(card)) {
						return get.number(card, i[0]);
					}
				}
				return get.number(card, false);
			};
			event.num1 = getNum(event.card1);
			event.num2 = getNum(event.card2);
			event.trigger("compare");
		},
		async (event, trigger, player) => {
			game.delay(0, lib.config.game_speed == "vvfast" ? 4000 : 1500);
		},
		async (event, trigger, player) => {
			event.result = {
				player: event.card1,
				target: event.card2,
				num1: event.num1,
				num2: event.num2,
			};
			event.trigger("compareFixing");
		},
		async (event, trigger, player) => {
			const target = event.target;
			if (event.forceWinner === player || (event.forceWinner !== target && event.num1 > event.num2)) {
				event.result.bool = true;
				event.result.winner = player;
				event.str = get.translation(player) + "拼点成功";
				player.popup("胜");
				if (get.itemtype(target) == "player") {
					target.popup("负");
				}
			} else {
				event.result.bool = false;
				event.str = get.translation(player) + "拼点失败";
				if (event.forceWinner !== target && event.num1 == event.num2) {
					event.result.tie = true;
					player.popup("平");
					if (get.itemtype(target) == "player") {
						target.popup("平");
					}
				} else {
					if (get.itemtype(target) == "player") {
						event.result.winner = target;
					}
					player.popup("负");
					if (get.itemtype(target) == "player") {
						target.popup("胜");
					}
				}
			}
		},
		async (event, trigger, player) => {
			game.broadcastAll(str => {
				var dialog = ui.create.dialog(str);
				dialog.classList.add("center");
				setTimeout(() => dialog.close(), 1000);
			}, event.str);
			game.delay(2);
		},
		async (event, trigger, player) => {
			const target = event.target;
			if (get.itemtype(target) == "player" && typeof target.ai.shown == "number" && target.ai.shown <= 0.85 && event.addToAI) {
				target.ai.shown += 0.1;
			}
			game.broadcastAll(() => ui.arena.classList.remove("thrownhighlight"));
			game.addVideo("thrownhighlight2");
			if (event.clear !== false) {
				game.broadcastAll(ui.clear);
			}
			if (typeof event.preserve == "function") {
				event.preserve = event.preserve(event.result);
			} else if (event.preserve == "win") {
				event.preserve = event.result.bool;
			} else if (event.preserve == "lose") {
				event.preserve = !event.result.bool;
			}
		},
	],
	chooseToCompareEffect: [
		async (event, trigger, player) => {
			const evt = event.parentEvent;
			for (const key of ["target", "card1", "card2", "lose_list", "forceWinner", "clear", "preserve"]) {
				event[key] = evt[key];
			}
			event.result = {};
			if (evt.isDestoryed) {
				event.finish();
				event.untrigger();
				return;
			}
		},
		async (event, trigger, player) => {
			const target = event.target;
			await game.cardsGotoOrdering([event.card1, event.card2]);
			game.log(player, "揭示了和", target, "的延时拼点结果");
			await game.delayx();
			await event.trigger("compareCardShowBefore");
		},
		async (event, trigger, player) => {
			const target = event.target;
			game.broadcastAll(() => ui.arena.classList.add("thrownhighlight"));
			ui.arena.classList.add("thrownhighlight");
			game.addVideo("thrownhighlight1");
			player.$compare(event.card1, target, event.card2);
		},
		async (event, trigger, player) => {
			const target = event.target;
			game.log(player, "的拼点牌为", event.card1);
			game.log(target, "的拼点牌为", event.card2);
			let getNum = function (card) {
				for (var i of event.lose_list) {
					if (i[1].includes(card)) {
						return get.number(card, i[0]);
					}
				}
				return get.number(card, false);
			};
			event.num1 = getNum(event.card1);
			event.num2 = getNum(event.card2);
			await event.trigger("compare");
		},
		async (event, trigger, player) => {
			await game.delay(0, lib.config.game_speed == "vvfast" ? 4000 : 1500);
		},
		async (event, trigger, player) => {
			event.result = {
				player: event.card1,
				target: event.card2,
				num1: event.num1,
				num2: event.num2,
			};
			await event.trigger("compareFixing");
		},
		async (event, trigger, player) => {
			const target = event.target;
			if (event.forceWinner === player || (event.forceWinner !== target && event.num1 > event.num2)) {
				event.result.bool = true;
				event.result.winner = player;
				event.str = get.translation(player) + "拼点成功";
				player.popup("胜");
				target.popup("负");
			} else {
				event.result.bool = false;
				event.str = get.translation(player) + "拼点失败";
				if (event.forceWinner !== target && event.num1 == event.num2) {
					event.result.tie = true;
					player.popup("平");
					target.popup("平");
				} else {
					event.result.winner = target;
					player.popup("负");
					target.popup("胜");
				}
			}
		},
		async (event, trigger, player) => {
			game.broadcastAll(str => {
				var dialog = ui.create.dialog(str);
				dialog.classList.add("center");
				setTimeout(() => dialog.close(), 1000);
			}, event.str);
			await game.delay(2);
		},
		async (event, trigger, player) => {
			const target = event.target;
			if (typeof target.ai.shown == "number" && target.ai.shown <= 0.85 && event.addToAI) {
				target.ai.shown += 0.1;
			}
			game.broadcastAll(() => ui.arena.classList.remove("thrownhighlight"));
			game.addVideo("thrownhighlight2");
			if (event.clear !== false) {
				game.broadcastAll(ui.clear);
			}
			if (typeof event.preserve == "function") {
				event.preserve = event.preserve(event.result);
			} else if (event.preserve == "win") {
				event.preserve = event.result.bool;
			} else if (event.preserve == "lose") {
				event.preserve = !event.result.bool;
			}
		},
		async (event, trigger, player) => {
			await event.trigger("chooseToCompareEnd");
			await event.trigger("chooseToCompareAfter");
		},
	],
	async chooseSkill(event, trigger, player) {
		let list;
		if (typeof event.target == "string") {
			list = get.gainableSkillsName(event.target, event.func);
		} else {
			list = event.target.getGainableSkills(event.func);
		}
		if (!list.length) {
			event.result = { bool: false };
			return;
		}
		event.skillai = function (list) {
			return get.max(list, get.skillRank, "item");
		};

		/** @type {string} */
		let result;
		if (event.isMine()) {
			const { promise, resolve } = Promise.withResolvers();
			const dialog = ui.create.dialog("forcebutton");
			dialog.add(event.prompt || "选择获得一项技能");
			_status.event.list = list;
			const clickItem = skill => () => {
				resolve(skill);
			};
			for (const skill of list) {
				if (lib.translate[skill + "_info"]) {
					var translation = get.translation(skill);
					if (translation[0] == "新" && translation.length == 3) {
						translation = translation.slice(1, 3);
					} else {
						translation = translation.slice(0, 2);
					}
					const item = dialog.add(
						'<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' +
							translation +
							"】</div><div>" +
							lib.translate[skill + "_info"] +
							"</div></div>"
					);
					item.firstChild.addEventListener("click", clickItem(skill));
					item.firstChild.link = skill;
				}
			}
			dialog.add(ui.create.div(".placeholder"));
			event.dialog = dialog;
			event.switchToAuto = function () {
				resolve(event.skillai(event.list));
			};
			_status.imchoosing = true;
			result = await promise;
		} else {
			result = event.skillai(list);
		}

		_status.imchoosing = false;
		if (event.dialog) {
			event.dialog.close();
		}
		event.result = { bool: true, skill: result };
	},
	async discoverCard(event, trigger, player) {
		const { num = 3 } = event;

		let choice;
		if (typeof event.list == "string" || typeof event.list == "function") {
			choice = get.inpile(event.list).randomGets(num);
		} else if (Array.isArray(event.list)) {
			choice = event.list.randomGets(num);
		} else {
			choice = Array.from(event.list).randomGets(num);
		}

		if (!choice.length) {
			return;
		}

		let prompt = event.prompt;
		if (!prompt) {
			prompt = "选择一张牌";
			if (event.use) {
				prompt += "使用之";
			} else if (!event.nogain) {
				prompt += "获得之";
			}
		}

		let next;
		if (typeof choice[0] === "string") {
			next = player.chooseVCardButton(choice, prompt, event.forced);
			if (event.ai) {
				next.set("ai", event.ai);
			}
		} else if (get.itemtype(choice[0]) == "card") {
			next = player.chooseCardButton(choice, prompt, event.forced);
			if (event.ai) {
				next.set("ai", event.ai);
			}
		} else {
			return;
		}

		const result = await next.forResult();

		event.result = {
			bool: result.bool,
			card: null,
			choice: null,
		};
		if (result.bool && result.links.length) {
			const link = result.links[0];
			let togain = null;
			if (get.itemtype(link) == "card") {
				event.result.card = link;
				togain = link;
			} else if (Array.isArray(link)) {
				event.result.choice = link[2];
				togain = game.createCard(link[2]);
			}
			if (togain) {
				if (event.use) {
					await player.chooseUseTarget(togain);
				} else if (!event.nogain) {
					game.log(player, "获得了一张牌");
					await player.gain(togain, "draw");
				}
			}
		}
	},
	chooseButton: [
		async (event, trigger, player) => {
			if (typeof event.dialog == "number") {
				event.dialog = get.idDialog(event.dialog);
			}
			if (event.createDialog && !event.dialog) {
				if (Array.isArray(event.createDialog)) {
					event.createDialog.add("hidden");
					event.dialog = ui.create.dialog.apply(this, event.createDialog);
				}
				event.closeDialog = true;
			}
			if (event.dialog == undefined) {
				event.dialog = ui.dialog;
			}
			if (event.isMine() || event.dialogdisplay) {
				event.dialog.style.display = "";
				event.dialog.open();
			}

			const filterButton = event.filterButton ?? (() => true);
			const selectButton = get.select(event.selectButton);
			const buttons = event.dialog.buttons;
			const buttonsx = [];
			let num = 0;
			for (const button of buttons) {
				if (filterButton(button, player)) {
					num++;
					buttonsx.add(button);
				}
			}
			if (event.isMine()) {
				if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
					ui.click.cancel();
					return;
				} else if ((event.direct && num == selectButton[0]) || event.forceDirect) {
					const buttons = buttonsx.slice(0, num);
					event.result = {
						bool: true,
						button: [buttons],
						links: get.links(buttons),
					};
					event.dialog.close();
				} else {
					ui.create.buttonChooseAll();
					game.check();
					game.pause();
				}
			} else if (event.isOnline()) {
				if ((event.direct && num == 1) || event.forceDirect) {
					const buttons = buttonsx.slice(0, num);
					event.result = {
						bool: true,
						button: [buttons],
						links: get.links(buttons),
					};
					event.dialog.close();
				} else {
					event.send();
				}
				delete event.callback;
			} else {
				event.result = "ai";
			}
			if (event.onfree) {
				lib.init.onfree();
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;
			if (event.result == "ai") {
				if (event.processAI) {
					event.result = event.processAI();
				} else {
					game.check();
					if ((ai.basic.chooseButton(event.ai) || forced) && (!event.filterOk || event.filterOk())) {
						ui.click.ok();
					} else {
						ui.click.cancel();
					}
				}
			}
			if (event.closeDialog) {
				event.dialog.close();
			}
			if (event.callback) {
				event.callback(event.player, event.result);
			}
			event.resume();
		},
	],
	chooseCardOL: [
		async (event, trigger, player) => {
			event.targets = event.list.slice(0);
			if (!_status.connectMode) {
				event.result = [];
				event.goto(7);
			} else {
				for (let i = 0; i < event.list.length; i++) {
					const target = event.list[i];
					target.wait();
					if (target.isOnline()) {
						target.send(
							function (args, set) {
								game.me.chooseCard.apply(game.me, args).set(set);
								game.resume();
							},
							event._args,
							event._set
						);
						event.list.splice(i--, 1);
					} else if (target == game.me) {
						event.withme = true;
						event.list.splice(i--, 1);
					}
				}
			}
		},
		async (event, trigger, player) => {
			if (event.list.length) {
				event.target = event.list.shift();
				event.target.chooseCard.apply(event.target, event._args).set(event._set);
			} else {
				event.goto(3);
			}
		},
		async (event, trigger, player, result) => {
			event.target.unwait(result);
			event.goto(1);
		},
		async (event, trigger, player) => {
			if (event.withme) {
				game.me.chooseCard.apply(game.me, event._args).set(event._set);
			} else {
				event.goto(5);
			}
		},
		async (event, trigger, player, result) => {
			game.me.unwait(result);
		},
		async (event, trigger, player) => {
			if (!event.resultOL) {
				game.pause();
			}
		},
		async (event, trigger, player) => {
			event.result = [];
			for (let i = 0; i < event.targets.length; i++) {
				const target = event.targets[i];
				event.result.push(event.resultOL[target.playerid] || {});
				if (event.result[i] == "ai" && event.aiCard) {
					event.result[i] = event.aiCard(event.targets[i]);
				}
			}
			event.finish();
		},
		async (event, trigger, player) => {
			if (event.list.length) {
				event.target = event.list.shift();
				event.target.chooseCard.apply(event.target, event._args).set(event._set);
			} else {
				for (let i = 0; i < event.targets.length; i++) {
					if (!event.result[i]) {
						event.result[i] = {};
					}
				}
				event.finish();
			}
		},
		async (event, trigger, player, result) => {
			event.result[event.targets.indexOf(event.target)] = result;
			event.goto(7);
		},
	],
	chooseButtonOL: [
		async (event, trigger, player) => {
			event.targets = event.list.slice();
			if (!_status.connectMode) {
				event.result = {};
				event.goto(7);
				return;
			}
			//ui.arena.classList.add('markhidden');
			for (var i = 0; i < event.list.length; i++) {
				const current = event.list[i];
				current[0].wait();
				if (current[0].isOnline()) {
					const target = current.shift();
					target.send(
						function (args, callback, switchToAuto, processAI) {
							//ui.arena.classList.add('markhidden');
							const next = game.me.chooseButton.apply(game.me, args);
							next.callback = callback;
							next.switchToAuto = switchToAuto;
							next.processAI = processAI;
							next.complexSelect = true;
							game.resume();
						},
						current,
						event.callback,
						event.switchToAuto,
						event.processAI
					);
					target._choose_button_ol = current;
					event.list.splice(i--, 1);
				} else if (current[0] == game.me) {
					event.last = current;
					event.last.shift();
					event.list.splice(i--, 1);
				}
			}
		},
		async (event, trigger, player) => {
			if (event.list.length) {
				const current = event.list.shift();
				event.target = current.shift();
				const next = event.target.chooseButton.apply(event.target, current);
				next.callback = event.callback;
				next.switchToAuto = event.switchToAuto;
				next.processAI = event.processAI;
				return next.forResult();
			} else {
				event.goto(3);
			}
		},
		async (event, trigger, player, result) => {
			event.target.unwait(result);
			event.goto(1);
		},
		async (event, trigger, player) => {
			if (event.last) {
				const next = game.me.chooseButton.apply(game.me, event.last);
				next.callback = event.callback;
				next.switchToAuto = event.switchToAuto;
				next.processAI = event.processAI;
				return next.forResult();
			} else {
				event.goto(5);
			}
		},
		async (event, trigger, player, result) => {
			game.me.unwait(result);
		},
		async (event, trigger, player) => {
			if (!event.resultOL) {
				game.pause();
			}
		},
		async (event, trigger, player) => {
			event.result = event.resultOL;
			event.finish();
		},
		async (event, trigger, player) => {
			if (event.list.length) {
				const current = event.list.shift();
				event.target = current.shift();
				const next = event.target.chooseButton.apply(event.target, current);
				next.callback = event.callback;
				next.switchToAuto = event.switchToAuto;
				next.processAI = event.processAI;
				return next.forResult();
			}
		},
		async (event, trigger, player, result) => {
			const { target } = event;
			event.result[target.playerid] = result;
			if (event.list.length) {
				event.goto(7);
			}
		},
	],
	async chooseAnyOL(event, trigger, player) {
		const { targets, func, args } = event;
		let map = new Map(),
			locals = targets.slice();
		let humans = targets.filter(current => current === game.me || current.isOnline());
		//分别处理人类玩家和其他玩家
		locals.removeArray(humans);
		const eventId = get.id();
		const send = function () {
			const [func, ...args] = Array.from(arguments);
			func(...args);
			game.resume();
		};
		//让读条不消失
		event._global_waiting = true;
		let time = 10000;
		if (lib.configOL && lib.configOL.choose_timeout) {
			time = parseInt(lib.configOL.choose_timeout) * 1000;
		}
		targets.forEach(current => current.showTimer(time));
		if (humans.length > 0) {
			const solve = function (resolve, reject) {
				return function (result, player) {
					if (result) {
						map.set(player, result);
					}
					resolve();
				};
			};
			await Promise.all(
				humans.map(current => {
					return new Promise((resolve, reject) => {
						if (current.isOnline()) {
							current.send(send, func, current, ...args, eventId);
							current.wait(solve(resolve, reject));
						} else {
							const next = func(current, ...args, eventId);
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
			//模拟ai先后作答
			for (const current of locals.randomSort()) {
				const result = await func(current, ...args, eventId).forResult();
				if (result) {
					map.set(current, result);
				}
			}
		}
		//清除读条
		delete event._global_waiting;
		targets.forEach(current => current.hideTimer(time));
		event.result = map;
	},
	chooseCard: [
		async (event, trigger, player) => {
			if (event.directresult) {
				event.result = {
					buttons: [],
					cards: event.directresult.slice(0),
					targets: [],
					confirm: "ok",
					bool: true,
					links: [],
				};
			} else if (event.autochoose()) {
				event.result = {
					bool: true,
					autochoose: true,
					cards: player.getCards(event.position),
					confirm: "ok",
					buttons: [],
					targets: [],
					links: [],
				};
			} else {
				if (event.isMine()) {
					game.check();
					game.pause();
					if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
						ui.click.cancel();
						return;
					}
					if (event.custom === undefined) {
						event.custom = {
							add: {},
							replace: {},
						};
					}
					ui.create.cardChooseAll();
					if (event.prompt != false) {
						let str;
						if (typeof event.prompt == "string") {
							str = event.prompt;
						} else {
							str = "请选择";
							var range = get.select(event.selectCard);
							if (range[0] == range[1]) {
								str += get.cnNumber(range[0]);
							} else if (range[1] == Infinity) {
								str += "至少" + get.cnNumber(range[0]);
							} else {
								str += get.cnNumber(range[0]) + "至" + get.cnNumber(range[1]);
							}
							str += "张";
							if (event.position == "h" || event.position == undefined) {
								str += "手";
							}
							if (event.position == "e") {
								str += "装备";
							}
							str += "牌";
						}
						event.dialog = ui.create.dialog(str);
						if (event.prompt2) {
							event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
						}
						if (Array.isArray(event.promptx)) {
							for (var i = 0; i < event.promptx.length; i++) {
								event.dialog.add(event.promptx[i]);
							}
						}
						if (Array.isArray(event.selectCard)) {
							event.promptbar = event.dialog.add("0/" + get.numStr(event.selectCard[1], "card"));
							if (event.custom.add.card === undefined) {
								event.custom.add.card = function () {
									_status.event.promptbar.innerHTML =
										ui.selected.cards.length + "/" + get.numStr(_status.event.selectCard[1], "card");
								};
							}
						}
					}
				} else if (event.isOnline()) {
					event.send();
				} else {
					event.result = "ai";
				}
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;
			if (event.result != "ai") {
				return;
			}

			game.check();
			if ((ai.basic.chooseCard(event.ai) || forced) && (!event.filterOk || event.filterOk())) {
				ui.click.ok();
			} else if (event.skill) {
				var skill = event.skill;
				ui.click.cancel();
				event._aiexclude.add(skill);
				event.redo();
				game.resume();
			} else {
				ui.click.cancel();
			}
		},
		async (event, trigger, player) => {
			event.resume();
			if (event.cardChooseAll) {
				event.cardChooseAll.close();
			}
			if (event.glow_result && event.result.cards && !event.directresult) {
				for (const card of event.result.cards) {
					card.classList.add("glow");
				}
			}
			if (event.dialog) {
				event.dialog.close();
			}
		},
	],
	chooseTarget: [
		async (event, trigger, player) => {
			const skills = player.getSkills("invisible").concat(lib.skill.global);
			game.expandSkills(skills);
			for (const skill of skills) {
				const info = lib.skill[skill];
				if (info?.onChooseTarget) {
					info.onChooseTarget(event, player);
				}
			}
			if (event.isMine()) {
				if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
					ui.click.cancel();
					return;
				}
				game.check();
				game.pause();
				if (event.createDialog && !event.dialog && Array.isArray(event.createDialog)) {
					event.dialog = ui.create.dialog.apply(this, event.createDialog);
				} else if (event.prompt != false) {
					let str;
					if (typeof event.prompt == "string") {
						str = event.prompt;
					} else {
						str = "请选择";
						var range = get.select(event.selectTarget);
						if (range[0] == range[1]) {
							str += get.cnNumber(range[0]);
						} else if (range[1] == Infinity) {
							str += "至少" + get.cnNumber(range[0]);
						} else {
							str += get.cnNumber(range[0]) + "至" + get.cnNumber(range[1]);
						}
						str += "个目标";
					}
					event.dialog = ui.create.dialog(str);
					if (event.prompt2) {
						event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
					}
					if (event.promptbar != "none") {
						event.promptbar = event.dialog.add("0/" + get.numStr(get.select(event.selectTarget)[1], "target"));
						event.custom.add.target = function () {
							_status.event.promptbar.innerHTML =
								ui.selected.targets.length + "/" + get.numStr(get.select(event.selectTarget)[1], "target");
						};
					}
				} else if (get.itemtype(event.dialog) == "dialog") {
					event.dialog.open();
				}
			} else if (event.isOnline()) {
				event.send();
			} else {
				event.result = "ai";
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;
			if (event.result == "ai") {
				game.check();
				if ((ai.basic.chooseTarget(event.ai) || forced) && (!event.filterOk || event.filterOk())) {
					ui.click.ok();
				} else {
					ui.click.cancel();
				}
			}
			if (event.result.bool && event.animate !== false) {
				for (var i = 0; i < event.result.targets.length; i++) {
					event.result.targets[i].addTempClass("target");
				}
			}
			if (event.dialog) {
				event.dialog.close();
			}
		},
		async (event, trigger, player) => {
			if (event.onresult) {
				event.onresult(event.result);
			}
			if (event.result.bool && event.autodelay && !event.isMine()) {
				if (typeof event.autodelay == "number") {
					await game.delayx(event.autodelay);
				} else {
					await game.delayx();
				}
			}
		},
	],
	chooseCardTarget: [
		async (event, trigger, player) => {
			if (event.isMine()) {
				if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
					ui.click.cancel();
					return;
				}
				ui.create.cardChooseAll();
				game.check();
				game.pause();
				if (event.prompt != false) {
					event.dialog = ui.create.dialog(event.prompt || "请选择卡牌和目标");
					if (event.prompt2) {
						event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
					}
				}
			} else if (event.isOnline()) {
				event.send();
			} else {
				event.result = "ai";
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;
			if (event.result != "ai") {
				return;
			}

			game.check();
			if (ai.basic.chooseCard(event.ai1) || forced) {
				if ((ai.basic.chooseTarget(event.ai2) || forced) && (!event.filterOk || event.filterOk())) {
					ui.click.ok();
					_status.event._aiexclude.length = 0;
				} else {
					ui.click.cancel();
				}
			} else {
				ui.click.cancel();
			}
		},
		async (event, trigger, player) => {
			event.resume();
			if (event.cardChooseAll) {
				event.cardChooseAll.close();
			}
			if (event.result.bool && event.animate !== false) {
				for (var i = 0; i < event.result.targets.length; i++) {
					event.result.targets[i].addTempClass("target");
				}
			}
			if (event.dialog) {
				event.dialog.close();
			}
		},
	],
	//先选择按钮再选择目标的函数，可以简化一些交互流程，目前可以隐藏弹窗
	//该事件目前采用async contents的写法
	chooseButtonTarget: [
		async (event, _trigger, player) => {
			//根据player.chooseButtonTarget获取到的dialog信息创建对话框，也支持createDialog
			if (typeof event.dialog == "number") {
				event.dialog = get.idDialog(event.dialog);
			}
			if (event.createDialog && !event.dialog) {
				if (Array.isArray(event.createDialog)) {
					event.createDialog.add("hidden");
					event.dialog = ui.create.dialog.apply(this, event.createDialog);
				}
				event.closeDialog = true;
			}
			if (event.dialog == undefined) {
				event.dialog = ui.dialog;
			}
			if (event.isMine() || event.dialogdisplay) {
				event.dialog.style.display = "";
				event.dialog.open();
			}
			if (event.isMine()) {
				if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
					ui.click.cancel();
					return;
				}
				if (event.canHidden) {
					//增加隐藏窗口的按钮
					const func = () => {
						const event = get.event();
						const controls = [
							link => {
								ui.selected.buttons.length = 0;
								game.check();
								return;
							},
						];
						event.controls = [
							ui.create.control(
								controls.concat([
									"隐藏窗口",
									"stayleft",
									link => {
										const control = event.controls[0];
										if (event.dialog.style.display == "none") {
											control.childNodes[0].innerHTML = "隐藏窗口";
											event.dialog.style.display = "";
										} else {
											control.childNodes[0].innerHTML = "显示窗口";
											event.dialog.style.display = "none";
										}
									},
								])
							),
						];
					};
					if (event.isMine()) {
						func(event);
					} else if (event.isOnline()) {
						event.player.send(func, event);
					}
					if (event.custom == undefined) {
						event.custom = {
							add: {},
							replace: {},
						};
					}
					if (event.custom.add.confirm == undefined) {
						//如果有人canHidden是true然后还动了这部分请把一部分代码复制过去适配一下，不然隐藏的按钮不会关闭
						event.custom.add.confirm = function (bool) {
							if (bool != true) {
								return;
							}
							const event = get.event();
							if (event.controls) {
								event.controls.forEach(i => i.close());
							}
							if (ui.confirm) {
								ui.confirm.close();
							}
							game.uncheck();
						};
					}
				}
				ui.create.buttonChooseAll();
				game.check();
				game.pause();
			} else if (event.isOnline()) {
				event.result = await event.sendAsync();
			} else {
				//考虑中途托管的情况
				event.result = "ai";
			}
		},
		async (event, _trigger, player, result) => {
			//处理ai的选择结果
			if (event.result != "ai") {
				return;
			}

			if (event.processAI) {
				event.result = event.processAI();
			} else {
				game.check();
				if (ai.basic.chooseButton(event.ai1) || event.forced) {
					if ((ai.basic.chooseTarget(event.ai2) || event.forced) && (!event.filterOk || event.filterOk())) {
						ui.click.ok();
						_status.event._aiexclude.length = 0;
					} else {
						ui.click.cancel();
					}
				} else {
					ui.click.cancel();
				}
			}
		},
		async (event, _trigger, player, result) => {
			//处理选择的结果
			event.resume();
			if (event.result.bool && event.animate !== false) {
				for (var i = 0; i < event.result.targets.length; i++) {
					event.result.targets[i].addTempClass("target");
				}
			}
			if (event.dialog) {
				event.dialog.close();
			}
		},
	],
	chooseControl: [
		async (event, trigger, player) => {
			if (event.controls.length == 0) {
				if (event.sortcard) {
					let sortnum = 2;
					if (event.sorttop) {
						sortnum = 1;
					}
					for (let i = 0; i < event.sortcard.length + sortnum; i++) {
						event.controls.push(get.cnNumber(i, true));
					}
				} else if (event.choiceList) {
					for (let i = 0; i < event.choiceList.length; i++) {
						event.controls.push("选项" + get.cnNumber(i + 1, true));
					}
				} else {
					event.finish();
					return;
				}
			} else if (event.choiceList && event.controls.length == 1 && event.controls[0] == "cancel2") {
				event.controls.shift();
				for (let i = 0; i < event.choiceList.length; i++) {
					event.controls.push("选项" + get.cnNumber(i + 1, true));
				}
				// ?
				event.controls.push("cancel2");
			}

			if (event.isMine()) {
				if (event.arrangeSkill) {
					const hidden = player.hiddenSkills.slice(0);
					game.expandSkills(hidden);
					if (hidden.length) {
						for (const control of event.controls) {
							if (_status.prehidden_skills.includes(control) && hidden.includes(control)) {
								event.result = {
									bool: true,
									control,
								};
								return;
							}
						}
					}
				} else if (event.hsskill && _status.prehidden_skills.includes(event.hsskill) && event.controls.includes("cancel2")) {
					event.result = {
						bool: true,
						control: "cancel2",
					};
					return;
				}
				if (event.sortcard) {
					let prompt = event.prompt || "选择一个位置";
					if (event.tosort) {
						prompt += "放置" + get.translation(event.tosort);
					}
					event.dialog = ui.create.dialog(prompt, "hidden");
					if (event.sortcard && event.sortcard.length) {
						event.dialog.addSmall(event.sortcard);
					} else {
						event.dialog.buttons = [];
						event.dialog.add(ui.create.div(".buttons"));
					}
					const buttons = event.dialog.content.lastChild;
					let sortnum = 2;
					if (event.sorttop) {
						sortnum = 1;
					}
					for (let i = 0; i < event.dialog.buttons.length + sortnum; i++) {
						const item = ui.create.div(".button.card.pointerdiv.mebg");
						item.style.width = "50px";
						buttons.insertBefore(item, event.dialog.buttons[i]);
						item.innerHTML =
							'<div style="font-family: xinwei;font-size: 25px;height: 75px;line-height: 25px;top: 8px;left: 10px;width: 30px;">第' +
							get.cnNumber(i + 1, true) +
							"张</div>";
						if (i == event.dialog.buttons.length + 1) {
							item.firstChild.innerHTML = "牌堆底";
						}
						item.link = get.cnNumber(i, true);
						item.listen(ui.click.dialogcontrol);
					}

					event.dialog.forcebutton = true;
					event.dialog.classList.add("forcebutton");
					event.dialog.open();
				} else if (event.dialogcontrol) {
					event.dialog = ui.create.dialog(event.prompt || "选择一项", "hidden");
					for (const control of event.controls) {
						const item = event.dialog.add(
							'<div class="popup text pointerdiv" style="width:calc(100% - 10px);display:inline-block">' + control + "</div>"
						);
						item.firstChild.listen(ui.click.dialogcontrol);
						item.firstChild.link = control;
					}
					event.dialog.forcebutton = true;
					event.dialog.classList.add("forcebutton");
					if (event.addDialog) {
						for (const dialog of event.addDialog) {
							if (get.itemtype(dialog) == "cards") {
								event.dialog.addSmall(dialog);
							} else {
								event.dialog.add(dialog);
							}
						}
						event.dialog.add(ui.create.div(".placeholder.slim"));
					}
					event.dialog.open();
				} else {
					if (event.seperate || lib.config.seperate_control) {
						const controls = event.controls.slice(0);
						controls.remove("cancel2");
						if ((event.direct && controls.length == 1) || event.forceDirect) {
							event.result = {
								control: event.controls[0],
								links: get.links([event.controls[0]]),
							};
							return;
						} else {
							event.controlbars = [];
							for (const control of event.controls) {
								event.controlbars.push(ui.create.control([control]));
							}
						}
					} else {
						const controls = event.controls.slice(0);
						controls.remove("cancel2");
						if ((event.direct && controls.length == 1) || event.forceDirect) {
							event.result = {
								control: event.controls[0],
								links: get.links([event.controls[0]]),
							};
							return;
						}
						event.controlbar = ui.create.control(event.controls);
					}
					if (event.dialog) {
						if (Array.isArray(event.dialog)) {
							event.dialog = ui.create.dialog.apply(this, event.dialog);
						}
						event.dialog.open();
					} else if (event.choiceList) {
						event.dialog = ui.create.dialog(event.prompt || "选择一项", "hidden");
						event.dialog.forcebutton = true;
						event.dialog.open();
						for (let i = 0; i < event.choiceList.length; i++) {
							event.dialog.add(
								'<div class="popup text" style="width:calc(100% - 10px);display:inline-block">' +
									(event.displayIndex !== false ? "选项" + get.cnNumber(i + 1, true) + "：" : "") +
									event.choiceList[i] +
									"</div>"
							);
						}
					} else if (event.prompt) {
						event.dialog = ui.create.dialog(event.prompt);
						if (event.prompt2) {
							event.dialog.addText(event.prompt2, Boolean(event.prompt2.length <= 20 || event.centerprompt2));
						}
					}
				}
				game.pause();
				game.countChoose();
				event.choosing = true;
			} else if (event.isOnline()) {
				event.send();
			} else {
				event.result = "ai";
			}
		},
		async (event, trigger, player) => {
			if (event.result == "ai") {
				event.result = {};
				if (event.ai) {
					const result = event.ai(event.getParent(), player);
					if (typeof result == "number") {
						event.result.control = event.controls[result];
					} else {
						event.result.control = result;
					}
				} else {
					event.result.control = event.controls[event.choice];
				}
			}
			event.result.index = event.controls.indexOf(event.result.control);
			event.choosing = false;
			_status.imchoosing = false;
			if (event.dialog && event.dialog.close) {
				event.dialog.close();
			}
			if (event.controlbar) {
				event.controlbar.close();
			}
			if (event.controlbars) {
				for (const controlBar of event.controlbars) {
					controlBar.close();
				}
			}
			event.resume();
		},
	],
	async chooseBool(event, trigger, player) {
		if (event.isMine()) {
			if (event.frequentSkill && !lib.config.autoskilllist.includes(event.frequentSkill)) {
				ui.click.ok();
				return;
			} else if (event.hsskill && _status.prehidden_skills.includes(event.hsskill)) {
				ui.click.cancel();
				return;
			}
			ui.create.confirm("oc");
			if (event.createDialog && !event.dialog) {
				if (Array.isArray(event.createDialog)) {
					event.dialog = ui.create.dialog.apply(this, event.createDialog);
					if (event.dialogselectx) {
						for (const button of event.dialog.buttons) {
							button.classList.add("selectedx");
						}
					}
				}
			}
			if (event.dialog) {
				event.dialog.open();
			} else if (event.prompt) {
				event.dialog = ui.create.dialog(event.prompt);
				if (event.prompt2) {
					event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
				}
			}

			game.countChoose();
			event.choosing = true;
			await game.pause();
		} else if (event.isOnline()) {
			event.result = await event.sendAsync();
		} else {
			event.result = "ai";
		}

		if (event.result == "ai") {
			if (event.ai) {
				event.choice = event.ai(event.getParent(), player);
			}
			event.result = { bool: event.choice };
		}
		_status.imchoosing = false;
		event.choosing = false;
		if (event.dialog) {
			event.dialog.close();
		}
		game.resume();
	},
	async chooseDrawRecover(event, trigger, player) {
		const { target, forced } = event;
		const controls = ["draw_card"];
		if (target.isDamaged()) {
			event.num2 = Math.min(event.num2, target.getDamagedHp());
			controls.push("recover_hp");
		}
		if (!forced) {
			controls.push("cancel2");
		}
		let result;
		if (controls.length == 1) {
			result = { control: controls[0] };
		} else {
			const prompt =
				event.prompt ||
				(() => {
					let str = ``;
					if (!forced) {
						str += `是否`;
					}
					if (player !== target) {
						str += `令${get.translation(target)}`;
					}
					str += `摸${get.cnNumber(event.num1)}张牌`;
					if (target.isDamaged()) {
						str += `或回复${event.num2}点体力`;
					}
					if (!forced) {
						str += `？`;
					}
					return str;
				})();
			const next = player.chooseControl(controls);
			next.set("prompt", prompt);
			if (event.hsskill) {
				next.setHiddenSkill(event.hsskill);
			}
			next.set(
				"ai",
				event.ai ||
					function () {
						const player = get.player();
						const { target, num1, num2 } = get.event().getParent();
						const att = get.attitude(player, target);
						const choices = get.event().controls.slice();
						const eff1 = get.recoverEffect(target, player, player);
						const eff2 = get.effect(target, { name: "draw" }, player, player) * 2;
						if (
							choices.includes("recover_hp") &&
							eff1 > 0 &&
							(target.hp == 1 ||
								target.needsToDiscard() ||
								target.hasSkillTag("maixie_hp") ||
								num2 > num1 ||
								(num2 == num1 && target.needsToDiscard(1)))
						) {
							return "recover_hp";
						}
						if (eff2 > 0) {
							return "draw_card";
						}
						if (choices.includes("cancel2") && att <= 0) {
							return "cancel2";
						}
						return choices.randomGet();
					}
			);
			result = await next.forResult();
		}
		if (result?.control != "cancel2") {
			if (event.logSkill) {
				if (typeof event.logSkill == "string") {
					player.logSkill(event.logSkill);
				} else if (Array.isArray(event.logSkill)) {
					player.logSkill.apply(player, event.logSkill);
				}
			}
			if (result?.control == "draw_card") {
				const next = target.draw(event.num1);
				next.gaintag.addArray(event.gaintag);
				await next;
			} else if (result?.control == "recover_hp") {
				await target.recover(event.num2);
			}
		}
		event.result = result;
	},
	choosePlayerCard: [
		async (event, trigger, player) => {
			const { target } = event;

			if (!event.dialog) {
				event.dialog = ui.create.dialog("hidden");
			} else if (!event.isMine()) {
				event.dialog.style.display = "none";
			}
			const select = get.select(event.selectButton);
			if (event.prompt == undefined) {
				let str = "请选择" + get.translation(target) + "的";
				if (select[0] == select[1]) {
					str += get.cnNumber(select[0]);
				} else if (select[1] == Infinity) {
					str += "至少" + get.cnNumber(select[0]);
				} else {
					str += get.cnNumber(select[0]) + "至" + get.cnNumber(select[1]);
				}
				str += "张";
				if (event.position == "h" || event.position == undefined) {
					str += "手";
				}
				if (event.position == "e") {
					str += "装备";
				}
				str += "牌";
				event.prompt = str;
			}
			event.dialog.add(event.prompt);
			if (event.prompt2) {
				event.dialog.addText(event.prompt2);
			}
			let expand_length = 0;
			const cs = target.getCards(event.position);
			const directFilter =
				event.forced &&
				typeof event.filterOk != "function" &&
				typeof event.selectButton != "function" &&
				event.filterButton == lib.filter.all;
			let directh = !lib.config.unauto_choose && !event.isOnline() && select[0] == select[1] && (!event.complexSelect || select[1] === 1);

			for (const position of event.position) {
				if (position == "h") {
					const hs = target.getCards("h");
					if (hs.length) {
						expand_length += Math.ceil(hs.length / 6);
						const title = event.dialog.add('<div class="text center" style="margin: 0px;">手牌区</div>');
						title.style.margin = "0px";
						title.style.padding = "0px";
						hs.randomSort();
						if (event.visible || target.isUnderControl(true) || player.hasSkillTag("viewHandcard", null, target, true)) {
							event.dialog.add(hs);
							directh = false;
						} else {
							var shown = hs.filter(card => get.is.shownCard(card));
							if (shown.length) {
								const hidden = hs.filter(card => !shown.includes(card));
								const buttons = ui.create.div(".buttons", event.dialog.content);
								event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(shown, "card", buttons));
								event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(hidden, "blank", buttons));
								if (event.dialog.forcebutton !== false) {
									event.dialog.forcebutton = true;
								}
								if (event.dialog.buttons.length > 3) {
									event.dialog.classList.remove("forcebutton-auto");
								} else if (!event.dialog.noforcebutton) {
									event.dialog.classList.add("forcebutton-auto");
								}
								directh = false;
							} else {
								event.dialog.add([hs, "blank"]);
							}
						}
					}
				} else if (position == "e") {
					const es = target.getCards("e");
					if (es.length) {
						expand_length += Math.ceil(es.length / 6);
						const title = event.dialog.add('<div class="text center" style="margin: 0px;">装备区</div>');
						title.style.margin = "0px";
						title.style.padding = "0px";
						event.dialog.add(es);
						directh = false;
					}
				} else if (position == "j") {
					const js = target.getCards("j");
					if (js.length) {
						expand_length += Math.ceil(js.length / 6);
						const title = event.dialog.add('<div class="text center" style="margin: 0px;">判定区</div>');
						title.style.margin = "0px";
						title.style.padding = "0px";
						const shown = js.filter(card => {
							const name = card.viewAs || card.name;
							const info = lib.card[name];
							if (!info || !info.blankCard) {
								return true;
							}
							return false;
						});
						if (shown.length < js.length && !target.isUnderControl(true)) {
							const hidden = js.filter(card => !shown.includes(card));
							const buttons = ui.create.div(".buttons", event.dialog.content);
							event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(shown, "card", buttons));
							event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(hidden, "blank", buttons));
							if (event.dialog.forcebutton !== false) {
								event.dialog.forcebutton = true;
							}
							if (event.dialog.buttons.length > 3) {
								event.dialog.classList.remove("forcebutton-auto");
							} else if (!event.dialog.noforcebutton) {
								event.dialog.classList.add("forcebutton-auto");
							}
						} else {
							event.dialog.add(js);
						}
						directh = false;
					}
				}
			}
			if (event.dialog.buttons.length == 0) {
				event.finish();
				return;
			}
			if (directFilter && select[0] >= cs.length) {
				event.result = {
					bool: true,
					buttons: event.dialog.buttons,
					links: cs,
				};
			} else if (directFilter && directh) {
				event.result = {
					bool: true,
					buttons: event.dialog.buttons.randomGets(select[0]),
					links: [],
				};
				for (const button of event.result.buttons) {
					event.result.links?.push(button.link);
				}
			} else {
				if (event.isMine()) {
					if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
						ui.click.cancel();
						return;
					}
					event.dialog.open();
					ui.create.buttonChooseAll();
					game.check();
					game.pause();
					if (expand_length > 2) {
						ui.arena.classList.add("choose-player-card");
						event.dialog.classList.add("fullheight");
					}
				} else if (event.isOnline()) {
					event.send();
				} else {
					event.result = "ai";
				}
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;
			if (event.result == "ai") {
				game.check();
				if ((ai.basic.chooseButton(event.ai) || forced) && (!event.filterOk || event.filterOk())) {
					ui.click.ok();
				} else {
					ui.click.cancel();
				}
			}
			event.dialog.close();
			if (event.result.links) {
				event.result.cards = event.result.links.slice(0);
			}
			event.resume();
			delay(500).then(() => void ui.arena.classList.remove("choose-player-card"));
		},
	],
	discardPlayerCard: [
		async (event, trigger, player) => {
			const { target } = event;

			if (event.directresult) {
				event.result = {
					buttons: [],
					cards: event.directresult.slice(0),
					links: event.directresult.slice(0),
					targets: [],
					confirm: "ok",
					bool: true,
				};
				event.cards = event.directresult.slice(0);
				event.goto(2);
				return;
			}

			if (!event.dialog) {
				event.dialog = ui.create.dialog("hidden");
			} else if (!event.isMine()) {
				event.dialog.style.display = "none";
			}

			if (event.prompt == null) {
				let str = "弃置" + get.translation(target);
				const range = get.select(event.selectButton);
				if (range[0] == range[1]) {
					str += get.cnNumber(range[0]);
				} else if (range[1] == Infinity) {
					str += "至少" + get.cnNumber(range[0]);
				} else {
					str += get.cnNumber(range[0]) + "至" + get.cnNumber(range[1]);
				}
				str += "张";
				if (event.position == "h" || event.position == undefined) {
					str += "手";
				}
				if (event.position == "e") {
					str += "装备";
				}
				str += "牌";
				event.prompt = str;
			}
			if (event.prompt) {
				event.dialog.add(event.prompt);
			}
			if (event.prompt2) {
				event.dialog.addText(event.prompt2);
			}

			let expand_length = 0;
			const cs = target.getCards(event.position);
			const select = get.select(event.selectButton);
			const directFilter =
				event.forced &&
				typeof event.filterOk != "function" &&
				typeof event.selectButton != "function" &&
				event.filterButton == lib.filter.all;
			let directh = !lib.config.unauto_choose && !event.isOnline() && select[0] == select[1] && (!event.complexSelect || select[1] === 1);

			for (const position of event.position) {
				if (position == "h") {
					const hs = target.getDiscardableCards(player, "h");
					expand_length += Math.ceil(hs.length / 6);
					if (hs.length) {
						var title = event.dialog.add('<div class="text center" style="margin: 0px;">手牌区</div>');
						title.style.margin = "0px";
						title.style.padding = "0px";
						hs.randomSort();
						if (event.visible || target.isUnderControl(true) || player.hasSkillTag("viewHandcard", null, target, true)) {
							event.dialog.add(hs);
							directh = false;
						} else {
							var shown = hs.filter(card => get.is.shownCard(card));
							if (shown.length) {
								var hidden = hs.filter(card => !shown.includes(card));
								var buttons = ui.create.div(".buttons", event.dialog.content);
								event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(shown, "card", buttons));
								event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(hidden, "blank", buttons));
								if (event.dialog.forcebutton !== false) {
									event.dialog.forcebutton = true;
								}
								if (event.dialog.buttons.length > 3) {
									event.dialog.classList.remove("forcebutton-auto");
								} else if (!event.dialog.noforcebutton) {
									event.dialog.classList.add("forcebutton-auto");
								}
								directh = false;
							} else {
								event.dialog.add([hs, "blank"]);
							}
						}
					}
				} else if (position == "e") {
					const es = target.getDiscardableCards(player, "e");
					if (es.length) {
						expand_length += Math.ceil(es.length / 6);
						const title = event.dialog.add('<div class="text center" style="margin: 0px;">装备区</div>');
						title.style.margin = "0px";
						title.style.padding = "0px";
						event.dialog.add(es);
						directh = false;
					}
				} else if (position == "j") {
					const js = target.getDiscardableCards(player, "j");
					if (js.length) {
						expand_length += Math.ceil(js.length / 6);
						const title = event.dialog.add('<div class="text center" style="margin: 0px;">判定区</div>');
						title.style.margin = "0px";
						title.style.padding = "0px";
						const shown = js.filter(card => {
							const name = card.viewAs || card.name;
							const info = lib.card[name];
							if (!info || !info.blankCard) {
								return true;
							}
							return false;
						});
						if (shown.length < js.length && !target.isUnderControl(true)) {
							const hidden = js.filter(card => !shown.includes(card));
							const buttons = ui.create.div(".buttons", event.dialog.content);
							event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(shown, "card", buttons));
							event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(hidden, "blank", buttons));
							if (event.dialog.forcebutton !== false) {
								event.dialog.forcebutton = true;
							}
							if (event.dialog.buttons.length > 3) {
								event.dialog.classList.remove("forcebutton-auto");
							} else if (!event.dialog.noforcebutton) {
								event.dialog.classList.add("forcebutton-auto");
							}
						} else {
							event.dialog.add(js);
						}
						directh = false;
					}
				}
			}
			if (event.dialog.buttons.length == 0) {
				event.finish();
				return;
			}

			if (directFilter && select[0] >= cs.length) {
				event.result = {
					bool: true,
					buttons: event.dialog.buttons,
					links: cs,
				};
			} else if (directFilter && directh) {
				event.result = {
					bool: true,
					buttons: event.dialog.buttons.randomGets(select[0]),
					links: [],
				};
				for (const button of event.result.buttons) {
					event.result.links?.push(button.link);
				}
			} else {
				if (event.isMine()) {
					event.dialog.open();
					ui.create.buttonChooseAll();
					game.check();
					game.pause();
					if (expand_length > 2) {
						ui.arena.classList.add("discard-player-card");
						event.dialog.classList.add("fullheight");
					}
				} else if (event.isOnline()) {
					event.send();
				} else {
					event.result = "ai";
				}
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;
			if (event.result == "ai") {
				game.check();
				if ((ai.basic.chooseButton(event.ai) || forced) && (!event.filterOk || event.filterOk())) {
					ui.click.ok();
				} else {
					ui.click.cancel();
				}
			}
			event.dialog.close();
		},
		async (event, trigger, player) => {
			event.resume();
			delay(500).then(() => void ui.arena.classList.remove("discard-player-card"));
			if (event.result.bool && event.result.links && !game.online) {
				if (event.logSkill) {
					if (typeof event.logSkill == "string") {
						player.logSkill(event.logSkill);
					} else if (Array.isArray(event.logSkill)) {
						player.logSkill.apply(player, event.logSkill);
					}
				}
				const cards = [];
				for (const link of event.result.links) {
					cards.push(link);
				}
				event.result.cards = event.result.links.slice(0);
				event.cards = cards;
				await event.trigger("rewriteDiscardResult");
			}
		},
		async (event, trigger, player) => {
			const { target } = event;
			if (event.boolline) {
				player.line(target, "green");
			}
			if (!event.chooseonly) {
				const next = target.discard(event.cards);
				next.discarder = player;
				event.done = next;
				if (event.delay === false) {
					next.set("delay", false);
				}
				await next;
			}
		},
	],
	gainPlayerCard: [
		async (event, trigger, player) => {
			const { target } = event;
			if (event.directresult) {
				event.result = {
					buttons: [],
					cards: event.directresult.slice(0),
					links: event.directresult.slice(0),
					targets: [],
					confirm: "ok",
					bool: true,
				};
				event.cards = event.directresult.slice(0);
				event.goto(2);
				return;
			}

			if (!event.dialog) {
				event.dialog = ui.create.dialog("hidden");
			} else if (!event.isMine()) {
				event.dialog.style.display = "none";
			}

			if (event.prompt == null) {
				let str = "获得" + get.translation(target);
				const range = get.select(event.selectButton);
				if (range[0] == range[1]) {
					str += get.cnNumber(range[0]);
				} else if (range[1] == Infinity) {
					str += "至少" + get.cnNumber(range[0]);
				} else {
					str += get.cnNumber(range[0]) + "至" + get.cnNumber(range[1]);
				}
				str += "张";
				if (event.position == "h" || event.position == undefined) {
					str += "手";
				}
				if (event.position == "e") {
					str += "装备";
				}
				str += "牌";
				event.prompt = str;
			}

			if (event.prompt) {
				event.dialog.add(event.prompt);
			}
			if (event.prompt2) {
				event.dialog.addText(event.prompt2);
			}

			let expand_length = 0;
			const cs = target.getCards(event.position);
			const select = get.select(event.selectButton);
			const directFilter =
				event.forced &&
				typeof event.filterOk != "function" &&
				typeof event.selectButton != "function" &&
				event.filterButton == lib.filter.all;
			let directh = !lib.config.unauto_choose && !event.isOnline() && select[0] == select[1] && (!event.complexSelect || select[1] === 1);

			for (const position of event.position) {
				if (position == "h") {
					var hs = target.getGainableCards(player, "h");
					if (hs.length) {
						expand_length += Math.ceil(hs.length / 6);
						var title = event.dialog.add('<div class="text center" style="margin: 0px;">手牌区</div>');
						title.style.margin = "0px";
						title.style.padding = "0px";
						hs.randomSort();
						if (event.visible || target.isUnderControl(true) || player.hasSkillTag("viewHandcard", null, target, true)) {
							event.dialog.add(hs);
							directh = false;
						} else {
							var shown = hs.filter(card => get.is.shownCard(card));
							if (shown.length) {
								var hidden = hs.filter(card => !shown.includes(card));
								var buttons = ui.create.div(".buttons", event.dialog.content);
								event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(shown, "card", buttons));
								event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(hidden, "blank", buttons));
								if (event.dialog.forcebutton !== false) {
									event.dialog.forcebutton = true;
								}
								if (event.dialog.buttons.length > 3) {
									event.dialog.classList.remove("forcebutton-auto");
								} else if (!event.dialog.noforcebutton) {
									event.dialog.classList.add("forcebutton-auto");
								}
								directh = false;
							} else {
								event.dialog.add([hs, "blank"]);
							}
						}
					}
				} else if (position == "e") {
					var es = target.getGainableCards(player, "e");
					if (es.length) {
						expand_length += Math.ceil(es.length / 6);
						var title = event.dialog.add('<div class="text center" style="margin: 0px;">装备区</div>');
						title.style.margin = "0px";
						title.style.padding = "0px";
						event.dialog.add(es);
						directh = false;
					}
				} else if (position == "j") {
					var js = target.getGainableCards(player, "j");
					if (js.length) {
						expand_length += Math.ceil(js.length / 6);
						var title = event.dialog.add('<div class="text center" style="margin: 0px;">判定区</div>');
						title.style.margin = "0px";
						title.style.padding = "0px";
						var shown = js.filter(card => {
							var name = card.viewAs || card.name,
								info = lib.card[name];
							if (!info || !info.blankCard) {
								return true;
							}
							return false;
						});
						if (shown.length < js.length && !target.isUnderControl(true)) {
							var hidden = js.filter(card => !shown.includes(card));
							var buttons = ui.create.div(".buttons", event.dialog.content);
							event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(shown, "card", buttons));
							event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(hidden, "blank", buttons));
							if (event.dialog.forcebutton !== false) {
								event.dialog.forcebutton = true;
							}
							if (event.dialog.buttons.length > 3) {
								event.dialog.classList.remove("forcebutton-auto");
							} else if (!event.dialog.noforcebutton) {
								event.dialog.classList.add("forcebutton-auto");
							}
						} else {
							event.dialog.add(js);
						}
						directh = false;
					}
				}
			}

			if (event.dialog.buttons.length == 0) {
				event.dialog.close();
				event.finish();
				return;
			}

			if (directFilter && select[0] >= cs.length) {
				event.result = {
					bool: true,
					buttons: event.dialog.buttons,
					links: cs,
				};
			} else if (directFilter && directh) {
				event.result = {
					bool: true,
					buttons: event.dialog.buttons.randomGets(select[0]),
					links: [],
				};
				for (const button of event.result.buttons) {
					event.result.links.push(button.link);
				}
			} else {
				if (event.isMine()) {
					event.dialog.open();
					ui.create.buttonChooseAll();
					game.check();
					game.pause();
					if (expand_length > 2) {
						ui.arena.classList.add("gain-player-card");
						event.dialog.classList.add("fullheight");
					}
				} else if (event.isOnline()) {
					event.send();
				} else {
					event.result = "ai";
				}
			}
		},
		async (event, trigger, player) => {
			const { forced } = event;
			if (event.result == "ai") {
				game.check();
				if ((ai.basic.chooseButton(event.ai) || forced) && (!event.filterOk || event.filterOk())) {
					ui.click.ok();
				} else {
					ui.click.cancel();
				}
			}
			event.dialog.close();
		},
		async (event, trigger, player) => {
			event.resume();
			delay(500).then(() => void ui.arena.classList.remove("gain-player-card"));
			if (game.online || !event.result.bool) {
				event.finish();
			}
		},
		async (event, trigger, player) => {
			if (event.logSkill && event.result.bool && !game.online) {
				if (typeof event.logSkill == "string") {
					player.logSkill(event.logSkill);
				} else if (Array.isArray(event.logSkill)) {
					player.logSkill.apply(player, event.logSkill);
				}
			}

			const cards = [];
			for (const link of event.result.links) {
				cards.push(link);
			}
			event.result.cards = event.result.links.slice(0);
			event.cards = cards;
			await event.trigger("rewriteGainResult");
		},
		async (event, trigger, player) => {
			const { cards, target } = event;
			if (event.boolline) {
				player.line(target, "green");
			}
			if (!event.chooseonly) {
				let waiting = null;
				if (event.delay !== false) {
					const next = player.gain(event.cards, target, event.visibleMove ? "give" : "giveAuto", "bySelf");
					next.gaintag.addArray(event.gaintag);
					event.done = next;
				} else {
					const next = player.gain(event.cards, target, "bySelf");
					next.gaintag.addArray(event.gaintag);
					event.done = next;
					target[event.visibleMove ? "$give" : "$giveAuto"](cards, player);
					if (event.visibleMove) {
						next.visible = true;
					}
				}
			} else {
				target[event.visibleMove ? "$give" : "$giveAuto"](cards, player);
			}
		},
	],
	/**
	 * @deprecated
	 */
	async showHandcards(event, trigger, player) {
		if (player.countCards("h") == 0) {
			return;
		}

		const cards = player.getCards("h");
		const next = player.showCards(cards);
		next.setContent(function () {});

		let str = get.translation(player.name) + "的手牌";
		if (typeof event.prompt == "string") {
			str = event.prompt;
		}
		event.dialog = ui.create.dialog(str, cards);
		event.dialogid = lib.status.videoId++;
		event.dialog.videoId = event.dialogid;
		game.broadcast(
			function (str, cards, id) {
				ui.create.dialog(str, cards).videoId = id;
			},
			str,
			cards,
			event.dialogid
		);
		game.log(player, "展示了", cards);
		game.addVideo("showCards", player, [str, get.cardsInfo(cards)]);
		await game.delayx(2);
		await next;
		game.broadcast("closeDialog", event.dialogid);
		event.dialog.close();
	},
	showCards: async function (event, trigger, player) {
		const { cards, str, flashAnimation, triggeronly } = event;
		if (get.itemtype(cards) != "cards") {
			return event.finish();
		}
		//初始化show_map用来存储展示牌的位置和来源
		event.show_map = new Map();
		event.show_map.set("others", {
			cardPile: [],
			discardPile: [],
			ordering: [],
			special: [],
			noPosition: [],
		});
		//触发展示牌时机该时机允许修改展示牌
		await event.trigger("showCards");

		if (get.itemtype(cards) != "cards") {
			return event.finish();
		}

		//确定要展示的牌
		event.result = {
			cards: cards.slice(0),
			show_map: event.show_map,
		};
		await event.trigger("showCardsFixing");
		event.cards = event.result.cards;

		//被展示牌的所在的区域
		const directLose = [];
		event.directLose = directLose;
		const ownerLose = new Map();
		event.ownerLose = ownerLose;
		for (const card of cards) {
			const pos = get.position(card, true);
			const owner = get.owner(card);
			if (owner && !event.show_map.has(owner)) {
				event.show_map.set(owner, {
					hs: [],
					es: [],
					js: [],
					xs: [],
					ss: [],
					cards2: [],
					cards: [],
				});
				ownerLose.set(owner, []);
			}
			//给牌分区域处理，各回各家各找各妈
			if ("hejsx".includes(pos) && owner) {
				event.show_map.get(owner)[`${pos}s`].push(card);
				event.show_map.get(owner)["cards"].push(card);
				if ("he".includes(pos)) {
					event.show_map.get(owner)["cards2"].push(card);
				}
				ownerLose.get(owner).push(card);
			} else if ("cds".includes(pos)) {
				directLose.push(card);
				event.show_map.get("others")[["cardPile", "discardPile", "special"].find(i => i.startsWith(pos))]?.push(card);
			} else {
				directLose.push(card);
				if ("cds".includes(card.original)) {
					//沟槽的get.cards
					event.show_map.get("others")[["cardPile", "discardPile", "special"].find(i => i.startsWith(pos))]?.push(card);
				} else if (pos == "o") {
					event.show_map.get("others")["ordering"].push(card);
				} else {
					event.show_map.get("others")["noPosition"].push(card);
				}
			}
		}

		//仅触发时机，不做后续处理
		if (triggeronly) {
			return;
		}

		//展示牌的动画
		if (!event.str) {
			event.str = get.translation(player.name) + "展示的牌";
		}
		if (!flashAnimation) {
			//允许自定义dialog，类似chooseButton
			if (typeof event.dialog == "number") {
				event.videoId = event.dialog;
				event.dialog = get.idDialog(event.dialog);
			} else {
				event.videoId = lib.status.videoId++;
			}
			if (event.createDialog && !event.dialog) {
				if (Array.isArray(event.createDialog)) {
					//event.createDialog.add("hidden");
					game.broadcastAll(
						(id, createDialog) => {
							const dialog = ui.create.dialog.apply(this, createDialog);
							dialog.videoId = id;
						},
						event.videoId,
						event.createDialog
					);
				}
				//event.closeDialog = true;
			}
			if (event.dialog == undefined) {
				game.broadcastAll(
					(id, str, cards) => {
						const dialog = ui.create.dialog(str, cards);
						dialog.videoId = id;
					},
					event.videoId,
					event.str,
					cards
				);
			}
			event.dialog = get.idDialog(event.videoId);

			const createDialog = function (cards2, id, customButton) {
				const dialog = get.idDialog(id);
				dialog.forcebutton = true;
				//dialog.style.display = "none";
				//处理隐藏牌（这东西有人用过？）
				if (cards2) {
					for (let i = 0; i < dialog.buttons.length; i++) {
						if (cards2.includes(dialog.buttons[i].link)) {
							dialog.buttons[i].className = "button card";
							dialog.buttons[i].innerHTML = "";
						}
					}
				}
				//允许自定义展示牌时对话框里的按钮
				if (typeof customButton == "function") {
					dialog.buttons.forEach(button => customButton(button));
				}
				//dialog.style.display = "";
			};
			const customButton = event.customButton || function () {};
			//创建对话框
			createDialog(event.hiddencards, event.videoId, customButton);
			game.broadcast(
				function (func, cards2, id, customButton) {
					func(cards2, id, customButton);
				},
				createDialog,
				event.hiddencards,
				event.videoId,
				customButton
			);
			const cards2 = cards.slice(0);
			if (event.hiddencards) {
				cards2.removeArray(event.hiddencards);
			}
			//处理历史记录的log，允许自定义log的内容，log函数参数为对应角色要展示的牌cards和角色player
			if (event.log != false) {
				if (get.itemtype(event.showers) !== "players") {
					const logList = event.log?.(cards2, player) || [player, "展示了", cards2];
					game.log(...logList);
				} else {
					const targets = event.showers.concat(Array.from(ownerLose.keys()));
					for (const target of targets.unique().sortBySeat()) {
						const cardsx = ownerLose.get(target)?.filter(card => !event.hiddenCards?.includes(card));
						if (cardsx?.length) {
							const logList = event.log?.(cardsx, target) || [target, "展示了", cardsx];
							game.log(...logList);
						}
					}
					if (directLose.length) {
						const logList = event.log?.(directLose, player) || [player, "展示了", directLose];
						game.log(...logList);
					}
				}
			}
			game.addVideo("showCards", player, [event.str, get.cardsInfo(cards)]);
		} else {
			event.videoId = lib.status.videoId++;
			//这部分是处理亮出牌的，动画效果类似判定，需要另外处理
			if (!event.noOrdering) {
				//有noOrdering属性亮出牌就不会把牌丢进处理区
				//showCards的relatedEvent属性是牌要在某个特定事件之后进入弃牌堆的，比如一些需要多次亮出牌的，因为多个展示牌事件独立，不set的话会在展示牌事件结束后就置入弃牌堆
				if (Array.from(ownerLose.values())?.flat()?.length > 0) {
					const next = game
						.loseAsync({ lose_list: Array.from(ownerLose.entries()) })
						.set("relatedEvent", event.relatedEvent || event.getParent());
					next.setContent("chooseToCompareLose");
					await next;
				}
				if (directLose.length > 0) {
					await game.cardsGotoOrdering(directLose).set("relatedEvent", event.relatedEvent || event.getParent());
				}
			}
			for (const card of cards) {
				game.addVideo("judge1", player, [get.cardInfo(card), event.str, event.videoId]);
			}
			//创建动画，其实就跟judge的类似
			game.broadcastAll(
				function (player, cards, str, id, cardids) {
					var event;
					if (game.online) {
						event = {};
					} else {
						event = _status.event;
					}
					event.nodes ??= [];
					cards.forEach((card, index) => {
						let node;
						const cardid = cardids[index];
						if (game.chess) {
							node = card.copy("thrown", "center", ui.arena).addTempClass("start");
						} else {
							node = player.$throwordered(card.copy(), true);
						}
						if (lib.cardOL) {
							lib.cardOL[cardid] = node;
						}
						node.cardid = cardid;
						node.classList.add("thrownhighlight");
						event.nodes.push(node);
					});
					ui.arena.classList.add("thrownhighlight");
					event.dialog = ui.create.dialog(str);
					event.dialog.classList.add("center");
					event.dialog.videoId = id;
				},
				player,
				cards,
				event.str,
				event.videoId,
				cards.map(i => get.id())
			);
			if (event.log != false) {
				const logList = event.log?.(cards, player) || [player, "亮出了", cards];
				game.log(...logList);
			}
		}
		game.addCardKnower(cards, "everyone");
		await game.delayx(event.delay_time || 2.5);

		//关闭对话框，结束动画
		if (!flashAnimation) {
			if (event.closeDialog != false) {
				game.broadcastAll("closeDialog", event.videoId);
			}
		} else {
			//亮出牌的还需要清理一次中央的区域残留的动画效果
			if (event.clearArena !== false) {
				game.broadcastAll(() => ui.clear());
			}
			event.highlightRemove = () => {
				game.broadcastAll(function (id) {
					const dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
					ui.arena.classList.remove("thrownhighlight");
				}, event.videoId);
			};
			if (event.removeHighlight !== false) {
				event.highlightRemove();
			}
			game.addVideo("judge2", null, event.videoId);
		}

		//新增callback事件
		if (event.callback) {
			const next = game.createEvent("showCardsCallback", false);
			next.player = player;
			next.cards = event.result.cards;
			next.result = event.result;
			next.setContent(event.callback);
			await next;
		}
	},
	async viewCards(event, trigger, player) {
		game.addCardKnower(event.cards, player);

		/** @type {Partial<Result>} */
		let result;
		if (player == game.me) {
			event.dialog = ui.create.dialog(event.str, event.cards);
			if (event.isMine()) {
				game.countChoose();
				event.choosing = true;
				await new Promise(resolve => {
					ui.create.confirm("o", resolve);
				});
			} else {
				event.result = "viewed";
				const wait = delay(2 * lib.config.duration).then(() => {
					event.dialog.close();
				});
				await game.delayx(2);
				await wait;
				return;
			}
		} else if (event.isOnline()) {
			await event.sendAsync();
		} else {
			return;
		}

		event.result = "viewed";
		_status.imchoosing = false;
		event.choosing = false;
		if (event.dialog) {
			event.dialog.close();
		}
	},
	async moveCard(event, trigger, player) {
		if (
			!player.canMoveCard(
				null,
				event.nojudge,
				event.sourceTargets,
				event.aimTargets,
				event.filter,
				event.canReplace ? "canReplace" : "noReplace"
			)
		) {
			return;
		}

		let next = player.chooseTarget(2, function (card, player, target) {
			var filterCard = get.event().filter;
			if (ui.selected.targets.length) {
				if (!get.event().aimTargets.includes(target)) {
					return false;
				}
				var from = ui.selected.targets[0];
				var js = from.getCards("j", filterCard);
				for (var i = 0; i < js.length; i++) {
					if (_status.event.nojudge) {
						break;
					}
					if (target.canAddJudge(js[i])) {
						return true;
					}
				}
				if (target.isMin()) {
					return false;
				}
				var es = from.getCards("e", filterCard);
				for (var i = 0; i < es.length; i++) {
					if (target.canEquip(es[i], _status.event.canReplace)) {
						return true;
					}
				}
				return false;
			} else {
				if (!get.event().sourceTargets.includes(target)) {
					return false;
				}
				return game.hasPlayer(current => {
					if (!get.event().aimTargets.includes(current) || target == current) {
						return false;
					}
					var js = target.getCards("j", filterCard);
					for (var i = 0; i < js.length; i++) {
						if (_status.event.nojudge) {
							break;
						}
						if (current.canAddJudge(js[i])) {
							return true;
						}
					}
					if (current.isMin()) {
						return false;
					}
					var es = target.getCards("e", filterCard);
					for (var i = 0; i < es.length; i++) {
						if (current.canEquip(es[i], _status.event.canReplace)) {
							return true;
						}
					}
					return false;
				});
			}
		});
		next.set("nojudge", event.nojudge || false);
		next.set("ai", function (target) {
			var player = _status.event.player;
			var att = get.attitude(player, target);
			var sgnatt = get.sgn(att);
			var aimTargets = get.event().aimTargets,
				filterCard = get.event().filter;
			if (ui.selected.targets.length == 0) {
				if (att > 0) {
					let noEffect = true;
					if (
						!_status.event.nojudge &&
						target.countVCards("j", function (card) {
							if (!filterCard(card)) {
								return false;
							}
							if (get.effect(target, card, target, target) <= -5) {
								noEffect = false;
							}
							return game.hasPlayer(function (current) {
								if (!aimTargets.includes(current)) {
									return false;
								}
								return current != target && current.canAddJudge(card) && get.attitude(player, current) < 0;
							});
						})
					) {
						return noEffect ? 8 : 14;
					}
					if (
						target.countVCards("e", function (card) {
							if (!filterCard(card)) {
								return false;
							}
							return (
								get.value(card, target) < 0 &&
								game.hasPlayer(function (current) {
									if (!aimTargets.includes(current)) {
										return false;
									}
									return (
										current != target &&
										get.attitude(player, current) < 0 &&
										current.canEquip(card, _status.event.canReplace) &&
										get.effect(target, card, player, player) < 0
									);
								})
							);
						}) > 0
					) {
						return 9;
					}
				} else if (att < 0) {
					if (
						game.hasPlayer(function (current) {
							if (current != target && get.attitude(player, current) > 0) {
								var es = target.getCards("e", filterCard);
								for (var i = 0; i < es.length; i++) {
									if (
										get.value(es[i], target) > 0 &&
										current.canEquip(es[i], _status.event.canReplace) &&
										get.effect(current, es[i], player, player) >
											(_status.event.canReplace ? get.effect(target, es[i], player, player) : 0)
									) {
										return true;
									}
								}
							}
						})
					) {
						return -att;
					}
				}
				return 0;
			}
			const current = ui.selected.targets[0],
				pos = get.event().nojudge ? "e" : "ej",
				cards = current.getCards(pos, filterCard),
				att2 = get.sgn(get.attitude(player, current));
			let maxEff = 0;
			for (let card of cards) {
				if (att2 <= 0 && get.sgn(get.value(card, current)) < 0) {
					continue;
				}
				let att3 = get.sgn(get.attitude(player, target)),
					val = get.effect(target, card, player, target);
				if (att3 != get.sgn(val)) {
					continue;
				}
				if (att2 > 0 && get.position(card) == "e") {
					val /= 2;
				}
				if (Math.abs(val) > maxEff) {
					maxEff = Math.abs(val);
				}
			}
			return maxEff;
		});
		next.set("multitarget", true);
		next.set("targetprompt", _status.event.targetprompt || ["被移走", "移动目标"]);
		next.set("prompt", event.prompt || "移动场上的一张牌");
		next.set("filter", event.filter);
		next.set("sourceTargets", event.sourceTargets || game.filterPlayer());
		next.set("aimTargets", event.aimTargets || game.filterPlayer());
		next.set("canReplace", event.canReplace);
		next.set("custom", get.copy(event.custom));
		if (event.prompt2) {
			next.set("prompt2", event.prompt2);
		}
		if (event.forced) {
			next.set("forced", true);
		}

		let result = await next.forResult();
		event.result = result;
		if (!result.bool) {
			return;
		}

		if (event.logSkill) {
			if (typeof event.logSkill == "string") {
				player.logSkill(event.logSkill, result.targets, false);
			} else if (Array.isArray(event.logSkill)) {
				if (event.logSkill.length >= 3) {
					event.logSkill[1] = result.targets;
					event.logSkill[2] = false;
				} else if (event.logSkill.length) {
					event.logSkill = [event.logSkill[0], result.targets, false];
				}
				player.logSkill.apply(player, event.logSkill);
			}
		}
		player.line2(result.targets, "green");
		await game.delay();

		const targets = result.targets;
		if (targets.length == 2) {
			const dialogArgs = ["请选择要移动的牌"];
			const es = targets[0].getCards("e", card => {
				return event.filter(card) && targets[1].canEquip(card, event.canReplace);
			});
			const js = event.nojudge
				? []
				: targets[0].getCards("j", card => {
						return event.filter(card) && targets[1].canAddJudge(card);
					});
			if (es.length) {
				dialogArgs.push(`<div class="text center">装备区</div>`);
				dialogArgs.push([es, "vcard"]);
			}
			if (js.length) {
				dialogArgs.push(`<div class="text center">判定区</div>`);
				dialogArgs.push([js, "vcard"]);
			}
			if (es.length + js.length === 1) {
				result = {
					bool: true,
					links: es.length > 0 ? es : js,
				};
			} else {
				result = await player
					.chooseButton(dialogArgs, true, function (button) {
						var player = _status.event.player;
						var targets0 = _status.event.targets0;
						var targets1 = _status.event.targets1;
						if (get.attitude(player, targets0) > 0 && get.attitude(player, targets1) < 0) {
							if (get.position(button.link) == "j") {
								return 12;
							}
							if (get.value(button.link, targets0) < 0 && get.effect(targets1, button.link, player, targets1) > 0) {
								return 10;
							}
							return 0;
						} else {
							if (get.position(button.link) == "j") {
								return -10;
							}
							return get.value(button.link) * get.effect(targets1, button.link, player, targets1);
						}
					})
					.set("target", targets[0])
					.set("nojudge", event.nojudge || false)
					.set("targets0", targets[0])
					.set("targets1", targets[1])
					/*.set("filterButton", function (button) {
				var targets1 = _status.event.targets1;
				if (!get.event().filter(button.link)) return false;
				if (get.position(button.link) == "j") {
					if (_status.event.nojudge) return false;
					return targets1.canAddJudge(button.link);
				} else {
					return targets1.canEquip(button.link, _status.event.canReplace);
				}
			})*/
					.set("filter", event.filter)
					.set("canReplace", event.canReplace)
					.set("custom", get.copy(event.custom))
					.forResult();
			}
		} else {
			return;
		}

		if (result.bool && result.links.length) {
			const link = result.links[0];
			let position = "j";
			let waiting;
			if (targets[0].getCards("e").includes(link)) {
				position = "e";
				if (!link.cards?.length) {
					targets[0].removeVirtualEquip(link);
				}
				waiting = targets[1].equip(link);
			} else {
				if (!link.cards?.length) {
					targets[0].removeVirtualJudge(link);
				}
				waiting = targets[1].addJudge(link, link?.cards);
			}
			if (link.cards?.length) {
				targets[0].$give(link.cards, targets[1], false);
			}
			game.log(targets[0], "的", link, "被移动给了", targets[1]);
			event.result.card = link;
			event.result.position = position;
			await waiting;
			await game.delay();
		}
	},
	useCard: [
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (!event.card) {
				console.log("err: no card", get.translation(event.player));
				event.finish();
				return;
			}
			if (!get.info(event.card, false).noForceDie) {
				event.forceDie = true;
			}
			//player.using=cards;
			let cardaudio = true;

			if (event.skill) {
				if (lib.skill[event.skill].audio) {
					cardaudio = false;
				}
				if (lib.skill[event.skill].log != false) {
					player.logSkill(event.skill, false, null, null, [event, event.player]);
				}
				if (get.info(event.skill).popname) {
					player.tryCardAnimate(event.card, event.card.name, "metal", true);
				}
			} else if (!event.nopopup) {
				if (lib.translate[event.card.name + "_pop"]) {
					player.tryCardAnimate(event.card, lib.translate[event.card.name + "_pop"], "metal");
				} else {
					player.tryCardAnimate(event.card, event.card.name, "metal");
				}
			}
			if (event.audio === false) {
				cardaudio = false;
			}
			if (cardaudio) {
				game.broadcastAll(
					(player, card) => {
						game.playCardAudio(card, player);
					},
					player,
					event.card
				);
			}
			event.id = get.id();
			if (!Array.isArray(event.excluded)) {
				event.excluded = [];
			}
			if (!Array.isArray(event.directHit)) {
				event.directHit = [];
			}
			if (typeof event.customArgs != "object" || typeof event.customArgs.default != "object") {
				event.customArgs = { default: {} };
			}
			if (typeof event.baseDamage != "number") {
				event.baseDamage = get.info(event.card, false).baseDamage || 1;
			}
			if (typeof event.effectCount != "number") {
				event.effectCount = get.info(event.card, false).effectCount || 1;
			}
			event.effectedCount = 0;
			if (event.oncard) {
				event.oncard(event.card, event.player);
			}
			player.actionHistory[player.actionHistory.length - 1].useCard.push(event);
			game.getGlobalHistory().useCard.push(event);
			if (event.addCount !== false) {
				if (player.stat[player.stat.length - 1].card[event.card.name] == undefined) {
					player.stat[player.stat.length - 1].card[event.card.name] = 1;
				} else {
					player.stat[player.stat.length - 1].card[event.card.name]++;
				}
			}
			if (event.skill && event.addSkillCount !== false) {
				if (player.stat[player.stat.length - 1].skill[event.skill] == undefined) {
					player.stat[player.stat.length - 1].skill[event.skill] = 1;
				} else {
					player.stat[player.stat.length - 1].skill[event.skill]++;
				}
				let sourceSkill = get.info(event.skill).sourceSkill;
				if (sourceSkill) {
					if (player.stat[player.stat.length - 1].skill[sourceSkill] == undefined) {
						player.stat[player.stat.length - 1].skill[sourceSkill] = 1;
					} else {
						player.stat[player.stat.length - 1].skill[sourceSkill]++;
					}
				}
			}
			event.lose_map = {
				noowner: [],
			};
			event.lose_map[player.playerid] = [];
			let cards_ow = event.cards.slice();
			while (cards_ow.length) {
				const owner = get.owner(cards_ow[0]);
				if (owner) {
					const id = owner.playerid;
					let Cards_card = cards.filter(card => get.owner(card) == owner);
					cards_ow.removeArray(Cards_card);
					owner.getCards("ej").forEach(card => {
						const cardsx = card?.[card.cardSymbol]?.cards?.filter(cardx => cards.includes(cardx));
						if (!cardsx?.length) {
							return;
						}
						event.cards.removeArray(cardsx);
						event.cards.add(card);
					});
					event.lose_map[id] ??= [];
					event.lose_map[id].addArray(Cards_card);
				} else {
					event.lose_map.noowner.add(cards_ow.shift());
				}
			}
			player.useCardAnimateBefore?.(event, trigger, player);
			if (event.animate != false && event.throw !== false) {
				let throw_cards = event.cards;
				let virtualCard_str = false;
				for (let id in event.lose_map) {
					if (id == "noowner") {
						continue;
					}
					const owner = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
					let throws = event.lose_map[id];
					if (owner == player) {
						if (!throw_cards.length && lib.config.card_animation_info) {
							const virtualCard = ui.create.card();
							virtualCard._destroy = true;
							virtualCard.expired = true;
							const info = lib.card[card.name],
								number = card.number;
							virtualCard.init([get.suit(card), typeof number == "number" ? number : "虚拟", card.name, card.nature]);
							virtualCard_str = virtualCard.querySelector(".info").innerHTML;
							throw_cards = [virtualCard];
							throws.add(virtualCard);
						}
					}
					if (throws.length) {
						owner.$throw(throws);
					}
				}
				if (event.lose_map.noowner.length) {
					for (const card of event.lose_map.noowner) {
						game.broadcastAll(
							function (player, card, cardid) {
								var event;
								if (game.online) {
									event = {};
								} else {
									event = _status.event;
								}
								if (game.chess) {
									event.node = card.copy("thrown", "center", ui.arena).addTempClass("start");
								} else {
									event.node = player.$throwordered(card.copy(), true);
								}
								if (lib.cardOL) {
									lib.cardOL[cardid] = event.node;
								}
								event.node.cardid = cardid;
								event.node.classList.add("thrownhighlight");
							},
							player,
							card,
							get.id()
						);
					}
				}
				if (lib.config.card_animation_info) {
					game.broadcastAll(
						function (cards, card, card_cards, str) {
							for (let nodex of cards) {
								let node = nodex.clone;
								if (nodex._tempName) {
									nodex._tempName.delete();
									delete nodex._tempName;
								}
								if (!node) {
									continue;
								}
								if (str) {
									node.querySelector(".info").innerHTML = str;
								}
								if (cards.length > 1 || !card.isCard || card.name != node.name || card.nature != node.nature || !card.cards.length) {
									ui.create.cardTempName(card, node);
									if (node._tempName && card_cards?.length <= 0) {
										node._tempName.innerHTML = node._tempName.innerHTML.slice(0, node._tempName.innerHTML.indexOf("<span", -1));
										node._tempName.innerHTML += "<span style='color:black'>虚拟</span></span>";
									}
								}
							}
						},
						throw_cards,
						event.card,
						event.cards,
						virtualCard_str
					);
				}
				if (lib.config.sync_speed && throw_cards[0] && throw_cards[0].clone) {
					let waitingForTransition = get.time();
					event.waitingForTransition = waitingForTransition;
					throw_cards[0].clone.listenTransition(function () {
						if (_status.waitingForTransition == waitingForTransition && _status.paused) {
							game.resume();
						}
						delete event.waitingForTransition;
					});
				}
			}
			if (event.cards.length) {
				const ownerCards = event.cards.filter(card => get.owner(card)),
					directDiscard = event.cards.filter(card => !get.owner(card));
				if (ownerCards.length) {
					const ownerx = get.owner(cards.find(card => get.owner(card) !== false));
					if (
						cards.some(card => {
							const owner = get.owner(card);
							if (owner === false) {
								return false;
							}
							return owner != ownerx;
						})
					) {
						await game.loseAsync({ player: player, cards: ownerCards }).setContent(async (event, trigger, player) => {
							let cards = event.cards;
							let cards_noowner = [];
							while (cards.length) {
								const owner = get.owner(cards[0]);
								if (!owner) {
									cards_noowner.add(cards.shift());
								} else {
									const id = owner.playerid;
									let onLoseCards = cards.filter(card => get.owner(card) == owner);
									event.cards.removeArray(onLoseCards);
									await owner
										.lose(onLoseCards, "visible", ui.ordering)
										.set("relatedEvent", event.getParent())
										.set("getlx", false)
										.set("type", "use");
								}
							}
							if (cards_noowner.length) {
								await game.cardsGotoOrdering(cards_noowner).set("relatedEvent", event.getParent());
							}
						});
					} else {
						await ownerx.lose(ownerCards, "visible", ui.ordering).set("type", "use");
					}
				}
				if (directDiscard.length) {
					event.lose_map.noowner.addArray(directDiscard);
					await game.cardsGotoOrdering(directDiscard);
				}
			}
			await event.trigger("useCard0");
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.animate != false && event.line != false && !event.hideTargets) {
				if (event.card.name == "wuxie" && event.getParent()._info_map) {
					var evtmap = event.getParent()._info_map;
					if (evtmap._source) {
						evtmap = evtmap._source;
					}
					var lining = (evtmap.multitarget ? evtmap.targets : evtmap.target) || event.player;
					if (Array.isArray(lining) && event.getTrigger().name == "jiedao") {
						player.line(lining[0], "green");
					} else {
						player.line(lining, "green");
					}
				} else if (event.card.name == "youdishenru" && event.getParent().source) {
					var lining = event.getParent().sourcex || event.getParent().source2 || event.getParent().source;
					if (lining == player && event.getParent().sourcex2) {
						lining = event.getParent().sourcex2;
					}
					if (Array.isArray(lining) && event.getTrigger().name == "jiedao") {
						player.line(lining[0], "green");
					} else {
						player.line(lining, "green");
					}
				} else {
					var config = {};
					var nature = get.natureList(event.card)[0];
					if (nature || (event.card.classList && event.card.classList.contains(nature))) {
						config.color = nature;
					}
					if (event.addedTarget) {
						player.line2(targets.concat(event.addedTargets), config);
					} else if (get.info(event.card, false).multitarget && targets.length > 1 && !get.info(event.card, false).multiline) {
						player.line2(targets, config);
					} else {
						player.line(targets, config);
					}
				}
			}
			if (targets.length && !event.hideTargets) {
				var str = targets.length == 1 && targets[0] == player ? "#b自己" : targets.sortBySeat();
				if (cards.length && !event.card.isCard) {
					if (event.addedTarget) {
						game.log(player, "对", str, "使用了", event.card, "（", cards, "，指向", event.addedTargets, "）");
					} else {
						game.log(player, "对", str, "使用了", event.card, "（", cards, "）");
					}
				} else {
					if (event.addedTarget) {
						game.log(player, "对", str, "使用了", event.card, "（指向", event.addedTargets, "）");
					} else {
						game.log(player, "对", str, "使用了", event.card);
					}
				}
			} else {
				if (cards.length && !event.card.isCard) {
					if (event.addedTarget) {
						game.log(player, "使用了", event.card, "（", cards, "，指向", event.addedTargets, "）");
					} else {
						game.log(player, "使用了", event.card, "（", cards, "）");
					}
				} else {
					if (event.addedTarget) {
						game.log(player, "使用了", event.card, "（指向", event.addedTargets, "）");
					} else {
						game.log(player, "使用了", event.card);
					}
				}
			}
			if (event.card.name == "wuxie") {
				game.logv(player, [event.card, cards], [event.getTrigger().card]);
			} else {
				game.logv(player, [event.card, cards], targets);
			}
			await event.trigger("useCard1");
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			await event.trigger("yingbian");
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			await event.trigger("useCard2");
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			await event.trigger("useCard");
			event._oncancel = function () {
				game.broadcastAll(function (id) {
					if (ui.tempnowuxie && ui.tempnowuxie._origin == id) {
						ui.tempnowuxie.close();
						delete ui.tempnowuxie;
					}
				}, event.id);
			};
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			event.sortTarget = function (animate, sort) {
				let info = get.info(event.card, false);
				if (num == 0 && targets.length > 1) {
					if (!info.multitarget) {
						if (!event.fixedSeat && !sort) {
							targets.sortBySeat(_status.currentPhase || player);
						}
						if (animate) {
							for (let i = 0; i < targets.length; i++) {
								targets[i].addTempClass("target");
							}
						}
					} else if (animate) {
						for (let i = 0; i < targets.length; i++) {
							targets[i].addTempClass("target");
						}
					}
				}
			};
			event.sortTarget();
			event.getTriggerTarget = function (list1, list2) {
				let listx = list1.slice(0).sortBySeat(_status.currentPhase || player);
				for (let i = 0; i < listx.length; i++) {
					if (get.numOf(list2, listx[i]) < get.numOf(listx, listx[i])) {
						return listx[i];
					}
				}
				return null;
			};
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.all_excluded) {
				return;
			}
			if (!event.triggeredTargets1) {
				event.triggeredTargets1 = [];
			}
			let target = event.getTriggerTarget(targets, event.triggeredTargets1);
			if (target) {
				event.triggeredTargets1.push(target);
				let next = game.createEvent("useCardToPlayer", false);
				if (!event.isFirstTarget1) {
					event.isFirstTarget1 = true;
					next.isFirstTarget = true;
				}
				next.setContent("emptyEvent");
				next.targets = targets;
				next.target = target;
				next.card = event.card;
				next.cards = cards;
				next.player = player;
				next.skill = event.skill;
				next.excluded = event.excluded;
				next.directHit = event.directHit;
				next.customArgs = event.customArgs;
				if (event.forceDie) {
					next.forceDie = true;
				}
				await next;
				event.redo();
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.all_excluded) {
				return;
			}
			if (!event.triggeredTargets2) {
				event.triggeredTargets2 = [];
			}
			let target = event.getTriggerTarget(targets, event.triggeredTargets2);
			if (target) {
				event.triggeredTargets2.push(target);
				let next = game.createEvent("useCardToTarget", false);
				if (!event.isFirstTarget2) {
					event.isFirstTarget2 = true;
					next.isFirstTarget = true;
				}
				next.setContent("emptyEvent");
				next.targets = targets;
				next.target = target;
				next.card = event.card;
				next.cards = cards;
				next.player = player;
				next.skill = event.skill;
				next.excluded = event.excluded;
				next.directHit = event.directHit;
				next.customArgs = event.customArgs;
				if (event.forceDie) {
					next.forceDie = true;
				}
				await next;
				event.redo();
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			let info = get.info(event.card, false);
			if (!info.nodelay && event.animate != false) {
				if (event.delayx !== false) {
					if (event.waitingForTransition) {
						_status.waitingForTransition = event.waitingForTransition;
						game.pause();
					} else {
						game.delayx();
					}
				}
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.all_excluded) {
				return;
			}
			if (!event.triggeredTargets3) {
				event.triggeredTargets3 = [];
			}
			let target = event.getTriggerTarget(targets, event.triggeredTargets3);
			if (target) {
				event.triggeredTargets3.push(target);
				let next = game.createEvent("useCardToPlayered", false);
				if (!event.isFirstTarget3) {
					event.isFirstTarget3 = true;
					next.isFirstTarget = true;
				}
				next.setContent("emptyEvent");
				next.targets = targets;
				next.target = target;
				next.card = event.card;
				next.cards = cards;
				next.player = player;
				next.skill = event.skill;
				next.excluded = event.excluded;
				next.directHit = event.directHit;
				next.customArgs = event.customArgs;
				if (event.forceDie) {
					next.forceDie = true;
				}
				await next;
				event.redo();
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.all_excluded) {
				return;
			}
			if (!event.triggeredTargets4) {
				event.triggeredTargets4 = [];
			}
			let target = event.getTriggerTarget(targets, event.triggeredTargets4);
			if (target) {
				event.triggeredTargets4.push(target);
				let next = game.createEvent("useCardToTargeted", false);
				if (!event.isFirstTarget4) {
					event.isFirstTarget4 = true;
					next.isFirstTarget = true;
				}
				next.setContent("emptyEvent");
				next.targets = targets;
				next.target = target;
				next.card = event.card;
				next.cards = cards;
				next.player = player;
				next.skill = event.skill;
				next.excluded = event.excluded;
				next.directHit = event.directHit;
				next.customArgs = event.customArgs;
				if (event.forceDie) {
					next.forceDie = true;
				}
				if (targets.length == event.triggeredTargets4.length) {
					event.sortTarget();
				}
				await next;
				event.redo();
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num, target } = event;
			if (event.all_excluded) {
				return;
			}
			event.effectedCount++;
			event.num = 0;
			let info = get.info(event.card, false);
			if (info.contentBefore) {
				let next = game.createEvent(event.card.name + "ContentBefore");
				next.setContent(info.contentBefore);
				next.targets = targets;
				next.card = event.card;
				next.cards = cards;
				next.player = player;
				next.skill = event.skill;
				next.type = "precard";
				if (event.forceDie) {
					next.forceDie = true;
				}
				await next;
			} else if (info.reverseOrder && get.is.versus() && targets.length > 1) {
				let next = game.createEvent(event.card.name + "ContentBefore");
				next.setContent("reverseOrder");
				next.targets = targets;
				next.card = event.card;
				next.cards = cards;
				next.player = player;
				next.skill = event.skill;
				next.type = "precard";
				if (event.forceDie) {
					next.forceDie = true;
				}
				await next;
			} else if (info.singleCard && info.filterAddedTarget && event.addedTargets && event.addedTargets.length < targets.length) {
				let next = game.createEvent(event.card.name + "ContentBefore");
				next.setContent("addExtraTarget");
				next.target = target;
				next.targets = targets;
				next.card = event.card;
				next.cards = cards;
				next.player = player;
				next.skill = event.skill;
				next.type = "precard";
				next.addedTarget = event.addedTarget;
				next.addedTargets = event.addedTargets;
				if (event.forceDie) {
					next.forceDie = true;
				}
				await next;
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.all_excluded) {
				return;
			}
			let info = get.info(event.card, false);
			if (num == 0 && targets.length > 1) {
				event.sortTarget(true, true);
			}
			if (targets[num] && targets[num].isDead() && !info?.deadTarget) {
				return;
			}
			if (targets[num] && targets[num].isOut() && !info?.includeOut) {
				return;
			}
			if (targets[num] && targets[num].removed) {
				return;
			}
			if (targets[num] && info.ignoreTarget && info.ignoreTarget(event.card, player, targets[num])) {
				let next = game.createEvent("useCardToIgnored", false);
				next.setContent("emptyEvent");
				next.targets = targets;
				next.target = targets[num];
				next.num = num;
				next.card = event.card;
				next.cards = cards;
				next.player = player;
				await next;
				return;
			}
			if (targets.length == 0 && !info.notarget) {
				return;
			}
			if (targets[num] && event.excluded.includes(targets[num])) {
				let next = game.createEvent("useCardToExcluded", false);
				next.setContent("emptyEvent");
				next.targets = targets;
				next.target = targets[num];
				next.num = num;
				next.card = event.card;
				next.cards = cards;
				next.player = player;
				await next;
				return;
			}
			let next = game.createEvent(event.card.name);
			next.setContent(info.content);
			next.targets = targets;
			next.card = event.card;
			next.cards = cards;
			next.player = player;
			next.num = num;
			next.type = "card";
			next.skill = event.skill;
			next.multitarget = info.multitarget;
			next.preResult = event.preResult;
			next.baseDamage = event.baseDamage;
			if (event.forceDie) {
				next.forceDie = true;
			}
			if (event.addedTargets) {
				next.addedTargets = event.addedTargets;
				next.addedTarget = event.addedTargets[num];
				next._targets = event._targets;
			}
			if (info.targetDelay === false) {
				event.targetDelay = false;
			}
			next.target = targets[num];
			for (let i in event.customArgs.default) {
				next[i] = event.customArgs.default[i];
			}
			if (next.target && event.customArgs[next.target.playerid]) {
				let customArgs = event.customArgs[next.target.playerid];
				for (let i in customArgs) {
					next[i] = customArgs[i];
				}
			}
			if (next.target && event.directHit.includes(next.target)) {
				next.directHit = true;
			}
			if (next.target && !info.multitarget) {
				if (num == 0 && targets.length > 1) {
					// var ttt=next.target;
					// setTimeout(function(){ttt.addTempClass('target');},0.5*lib.config.duration);
				} else {
					next.target.addTempClass("target");
				}
			}
			if (!info.nodelay && num > 0) {
				if (event.targetDelay !== false) {
					await game.delayx(0.5);
				}
			}
			event._result = await next.forResult();
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.all_excluded) {
				return;
			}
			if (!get.info(event.card, false).multitarget && num < targets.length - 1 && !event.cancelled) {
				event.num++;
				event.goto(12);
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.all_excluded) {
				return;
			}
			if (get.info(event.card, false).contentAfter) {
				let next = game.createEvent(event.card.name + "ContentAfter");
				next.setContent(get.info(event.card, false).contentAfter);
				next.targets = targets;
				next.card = event.card;
				next.cards = event.cards;
				next.player = player;
				next.skill = event.skill;
				next.preResult = event.preResult;
				next.type = "postcard";
				if (event.forceDie) {
					next.forceDie = true;
				}
				await next;
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.all_excluded) {
				return;
			}
			if (event.effectedCount < event.effectCount) {
				if (document.getElementsByClassName("thrown").length) {
					if (event.delayx !== false && get.info(event.card, false).finalDelay !== false) {
						game.delayx();
					}
				}
				event.goto(11);
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			if (event.postAi) {
				event.player.logAi(event.targets, event.card);
			}
			if (event._result) {
				event.result = event._result;
			}
			//delete player.using;
			if (document.getElementsByClassName("thrown").length) {
				if (event.delayx !== false && get.info(event.card, false).finalDelay !== false) {
					game.delayx();
				}
			} else {
				event.finish();
			}
		},
		async (event, trigger, player) => {
			let { cards, card, targets, num } = event;
			event._oncancel();
		},
	],
	useSkill: [
		async (event, trigger, player) => {
			const { cards, targets, skill } = event;
			const info = get.info(event.skill);
			if (!info.noForceDie) {
				event.forceDie = true;
			}
			if (!info.noForceOut) {
				event.includeOut = true;
			}
			event._skill = event.skill;

			const checkShow = player.checkShow(event.skill);
			const waitings = [];
			let losecard = null;
			if (info.discard != false && info.lose != false && !info.viewAs) {
				const next = player.discard(cards);
				next.delay = false;
				if (lib.config.low_performance) {
					event.discardTransition = true;
				}
				waitings.push(next);
			} else {
				if (info.lose != false) {
					if (info.losetrigger == false) {
						losecard = player.lose(cards, ui.special);
						losecard._triggered = null;
					} else {
						losecard = player.lose(cards, ui.special);
						if (info.visible) {
							losecard.visible = true;
						}
						if (info.loseTo) {
							losecard.position = ui[info.loseTo];
						}
						if (info.insert) {
							losecard.insert_card = true;
						}
						if (losecard.position == ui.special && info.toStorage) {
							losecard.toStorage = true;
						}
					}
				}
				if (!info.prepare && info.viewAs) {
					player.$throw(cards);
					if (losecard) {
						losecard.visible = true;
					}
					if (lib.config.sync_speed && cards[0] && cards[0].clone) {
						const waitingForTransition = get.time();
						event.waitingForTransition = waitingForTransition;
						cards[0].clone.listenTransition(function () {
							if (_status.waitingForTransition == waitingForTransition && _status.paused) {
								game.resume();
							}
							delete event.waitingForTransition;
						});
					}
				}
			}
			if (losecard) {
				waitings.push(losecard);
			}
			if (info.line != false && targets.length) {
				let config = {};
				if (get.is.object(info.line)) {
					config = info.line;
				} else if (info.line == "fire") {
					config.color = "fire";
				} else if (info.line == "thunder") {
					config.color = "thunder";
				} else if (info.line === undefined || info.line == "green") {
					config.color = "green";
				}
				if (info.multitarget && !info.multiline && targets.length > 1) {
					player.line2(targets, config);
				} else {
					player.line(targets, config);
				}
			}
			let str = "";
			if (targets && targets.length && info.log != "notarget") {
				str += '对<span class="bluetext">' + (targets[0] == player ? "自己" : get.translation(targets[0]));
				for (let i = 1; i < targets.length; i++) {
					str += "、" + (targets[i] == player ? "自己" : get.translation(targets[i]));
				}
				str += "</span>";
			}
			str += "发动了";
			if (!info.direct && info.log !== false) {
				game.trySkillAudio(event.skill, player, null, null, null, [event, event.player]);
				game.log(player, str, "【" + get.skillTranslation(skill, player) + "】");
				if (info.logv !== false) {
					game.logv(player, skill, targets);
				}
				player.trySkillAnimate(skill, skill, checkShow);
			}
			if (event.addCount != false) {
				if (player.stat[player.stat.length - 1].skill[skill] == undefined) {
					player.stat[player.stat.length - 1].skill[skill] = 1;
				} else {
					player.stat[player.stat.length - 1].skill[skill]++;
				}
				var sourceSkill = get.info(skill).sourceSkill;
				if (sourceSkill) {
					if (player.stat[player.stat.length - 1].skill[sourceSkill] == undefined) {
						player.stat[player.stat.length - 1].skill[sourceSkill] = 1;
					} else {
						player.stat[player.stat.length - 1].skill[sourceSkill]++;
					}
				}
			}
			if (player.stat[player.stat.length - 1].allSkills == undefined) {
				player.stat[player.stat.length - 1].allSkills = 1;
			} else {
				player.stat[player.stat.length - 1].allSkills++;
			}
			if (info.prepare) {
				switch (info.prepare) {
					case "give":
						if (losecard) {
							losecard.visible = true;
						}
						player.$give(cards, targets[0]);
						break;
					case "give2":
						player.$give(cards.length, targets[0]);
						break;
					case "throw":
						if (losecard) {
							losecard.visible = true;
						}
						player.$throw(cards);
						break;
					case "throw2":
						player.$throw(cards.length);
						break;
					default:
						info.prepare(cards, player, targets);
				}
			}
			if (info.round) {
				const roundname = skill + "_roundcount";
				player.storage[roundname] = game.roundNumber;
				player.syncStorage(roundname);
				player.markSkill(roundname);
			}
			const name = event.skill;
			const players = player.getSkills(false, false, false);
			const equips = player.getSkills("e");
			const global = lib.skill.global.slice(0);
			const logInfo = {
				skill: name,
				targets: targets,
				event: _status.event,
			};
			if (info.sourceSkill) {
				logInfo.sourceSkill = info.sourceSkill;
				if (global.includes(info.sourceSkill)) {
					logInfo.type = "global";
				} else if (players.includes(info.sourceSkill)) {
					logInfo.type = "player";
				} else if (equips.includes(info.sourceSkill)) {
					logInfo.type = "equip";
				}
			} else {
				if (global.includes(name)) {
					logInfo.sourceSkill = name;
					logInfo.type = "global";
				} else if (players.includes(name)) {
					logInfo.sourceSkill = name;
					logInfo.type = "player";
				} else if (equips.includes(name)) {
					logInfo.sourceSkill = name;
					logInfo.type = "equip";
				} else {
					let bool = false;
					for (let skill of players) {
						const expand = [skill];
						game.expandSkills(expand);
						if (expand.includes(name)) {
							bool = true;
							logInfo.sourceSkill = skill;
							logInfo.type = "player";
							break;
						}
					}
					if (!bool) {
						for (let skill of players) {
							const expand = [skill];
							game.expandSkills(expand);
							if (expand.includes(name)) {
								logInfo.sourceSkill = skill;
								logInfo.type = "equip";
								break;
							}
						}
					}
				}
			}
			event.sourceSkill = logInfo.sourceSkill;
			event.type = logInfo.type;
			if (!info.direct && info.log !== false) {
				player.getHistory("useSkill").push(logInfo);
				await event.trigger("useSkill");
			}

			return Promise.all(waitings);
		},
		async (event, trigger, player) => {
			const { cards, targets } = event;
			const info = get.info(event.skill);
			if (info && info.contentBefore) {
				const next = game.createEvent(event.skill + "ContentBefore");
				next.setContent(info.contentBefore);
				next.targets = targets;
				next.cards = cards;
				next.player = player;
				next.skill = event.skill;
				if (event.forceDie) {
					next.forceDie = true;
				}
				if (event.includeOut) {
					next.includeOut = true;
				}
				return next.forResult();
			}
		},
		async (event, trigger, player) => {
			const { num, cards, targets } = event;

			if (!event.skill) {
				console.log("error: no skill", get.translation(event.player), event.player.getSkills());
				if (event._skill) {
					event.skill = event._skill;
					console.log(event._skill);
				} else {
					event.finish();
					return;
				}
			}

			const info = get.info(event.skill);

			if (
				(targets[num] && targets[num].isDead() && !info?.deadTarget) ||
				(targets[num] && targets[num].isOut() && !info?.includeOut) ||
				(targets[num] && targets[num].removed)
			) {
				if (!info.multitarget && num < targets.length - 1) {
					event.num++;
					event.redo();
				}
				return;
			}

			const next = game.createEvent(event.skill);
			next.setContent(info.content);
			next.targets = targets;
			next.cards = cards;
			next.player = player;
			next.num = num;
			next.multitarget = info.multitarget;
			if (num == 0 && next.targets.length > 1) {
				if (!info.multitarget) {
					lib.tempSortSeat = player;
					targets.sort(lib.sort.seat);
					delete lib.tempSortSeat;
				}
				for (const target of targets) {
					target.addTempClass("target");
				}
			}
			next.target = targets[num];
			if (event.forceDie) {
				next.forceDie = true;
			}
			if (event.includeOut) {
				next.includeOut = true;
			}
			if (next.target && !info.multitarget) {
				if (num == 0 && targets.length > 1) {
					// var ttt=next.target;
					// setTimeout(function(){ttt.addTempClass('target');},0.5*lib.config.duration);
				} else {
					next.target.addTempClass("target");
				}
			}
			if (num == 0) {
				if (typeof info.delay == "number") {
					game.delay(info.delay);
				} else if (info.delay !== false && info.delay !== 0) {
					if (event.waitingForTransition) {
						_status.waitingForTransition = event.waitingForTransition;
						game.pause();
					} else {
						await game.delayx();
					}
				}
			} else {
				await game.delayx(0.5);
			}
			if (!info.multitarget && num < targets.length - 1) {
				event.num++;
				event.redo();
			}
		},
		async (event, trigger, player) => {
			const { targets, cards } = event;
			const info = get.info(event.skill);
			if (info && info.contentAfter) {
				const next = game.createEvent(event.skill + "ContentAfter");
				next.setContent(info.contentAfter);
				next.targets = targets;
				next.cards = cards;
				next.player = player;
				next.skill = event.skill;
				if (event.forceDie) {
					next.forceDie = true;
				}
				if (event.includeOut) {
					next.includeOut = true;
				}
				return next.forResult();
			}
		},
		async (event, trigger, player) => {
			if (player.getStat().allSkills > 200) {
				player._noSkill = true;
				console.log(player.name, event.skill);
			}
			if (document.getElementsByClassName("thrown").length) {
				if (event.skill && get.info(event.skill).delay !== false && get.info(event.skill).delay !== 0) {
					await game.delayx();
				}
			} else {
				event.finish();
			}
		},
		async () => {
			ui.clear();
		},
	],
	async draw(event, trigger, player) {
		// if(lib.config.background_audio){
		//     game.playAudio('effect','draw');
		// }
		// game.broadcast(function(){
		//     if(lib.config.background_audio){
		//         game.playAudio('effect','draw');
		//     }
		// });
		let { num } = event;
		if (typeof event.minnum == "number" && num < event.minnum) {
			num = event.minnum;
		}
		if (event.drawDeck) {
			if (event.drawDeck > num) {
				event.drawDeck = num;
			}
			num -= event.drawDeck;
		}
		let logList;
		if (event.log != false) {
			logList = [player];
			if (num > 0) {
				if (event.bottom) {
					logList.add("从牌堆底摸了" + get.cnNumber(num) + "张牌");
				} else {
					logList.add("摸了" + get.cnNumber(num) + "张牌");
				}
			}
			if (event.drawDeck) {
				logList.add("从牌库中获得了" + get.cnNumber(event.drawDeck) + "张牌");
			}
		}
		let cards = [];
		if (num > 0) {
			//otherGetCards属性是从专属牌堆摸牌，没有再看其他的
			if (event.otherGetCards) {
				cards.addArray(event.otherGetCards(num));
			} else if (event.bottom) {
				cards.addArray(get.bottomCards(num));
			} else if (player.getTopCards) {
				cards.addArray(player.getTopCards(num));
			} else {
				cards.addArray(get.cards(num));
			}
		} else {
			cards = [];
		}
		if (event.drawDeck) {
			cards = cards.concat(player.getDeckCards(event.drawDeck));
		}
		if (get.itemtype(cards) == "cards") {
			let next;
			if (event.animate != false) {
				if (event.visible) {
					next = player.gain(cards, "gain2").set("log", false);
					logList.addArray(["（", cards, "）"]);
				} else {
					next = player.gain(cards, "draw");
				}
			} else {
				next = player.gain(cards);
				if (event.$draw) {
					player.$draw(cards.length);
				}
			}
			if (logList?.length) {
				game.log(...logList);
			}
			next.gaintag.addArray(event.gaintag);
			await next;
		}
		event.result = {
			bool: true,
			cards,
		};
	},
	async discard(event, trigger, player) {
		const { cards } = event;
		game.log(player, "弃置了", cards);
		event.done = player.lose(cards, event.position, "visible");
		event.done.type = "discard";
		if (event.discarder) {
			event.done.discarder = event.discarder;
		}
		await event.done;
		await event.trigger("discard");
	},
	async loseToDiscardpile(event, trigger, player) {
		const { cards } = event;
		if (event.log != false) {
			game.log(player, "将", cards, "置入了弃牌堆");
		}
		const next = player.lose(cards, event.position);
		if (event.insert_index) {
			next.insert_index = event.insert_index;
		}
		if (event.insert_card) {
			next.insert_card = true;
		}
		if (!event.blank) {
			next.visible = true;
		}
		next.type = "loseToDiscardpile";
		event.done = next;
		await next;
		await event.trigger("loseToDiscardpile");
	},
	respond: [
		async (event, trigger, player) => {
			let { cards, card } = event;
			var cardaudio = true;
			if (event.skill) {
				if (lib.skill[event.skill].audio) {
					cardaudio = false;
				}
				if (lib.skill[event.skill].log != false) {
					player.logSkill(event.skill, false, null, null, [event, event.player]);
				}
				/*if (get.info(event.skill).popname) {
					player.tryCardAnimate(event.card, event.card.name, "metal", true);
				}*/
				player.checkShow(event.skill, true);
				if (lib.skill[event.skill].onrespond && !game.online) {
					lib.skill[event.skill].onrespond(event, player);
				}
			} else if (!event.nopopup) {
				player.tryCardAnimate(event.card, event.card.name, "wood");
			}
			if (cardaudio && event.getParent(3).name == "useCard") {
				game.broadcastAll(
					(player, card) => {
						game.playCardAudio(card, player);
					},
					player,
					event.card
				);
			}
			if (event.skill && event.addSkillCount !== false) {
				if (player.stat[player.stat.length - 1].skill[event.skill] == undefined) {
					player.stat[player.stat.length - 1].skill[event.skill] = 1;
				} else {
					player.stat[player.stat.length - 1].skill[event.skill]++;
				}
				var sourceSkill = get.info(event.skill).sourceSkill;
				if (sourceSkill) {
					if (player.stat[player.stat.length - 1].skill[sourceSkill] == undefined) {
						player.stat[player.stat.length - 1].skill[sourceSkill] = 1;
					} else {
						player.stat[player.stat.length - 1].skill[sourceSkill]++;
					}
				}
			}
			if (cards.length && (cards.length > 1 || cards[0].name != event.card.name)) {
				game.log(player, "打出了", event.card, "（", cards, "）");
			} else {
				game.log(player, "打出了", event.card);
			}
			player.actionHistory[player.actionHistory.length - 1].respond.push(event);
			event.lose_map = {
				noowner: [],
			};
			event.lose_map[player.playerid] = [];
			let cards_ow = event.cards.slice();
			while (cards_ow.length) {
				const owner = get.owner(cards_ow[0]);
				if (owner) {
					const id = owner.playerid;
					let Cards_card = cards.filter(card => get.owner(card) == owner);
					cards_ow.removeArray(Cards_card);
					owner.getCards("ej").forEach(card => {
						const cardsx = card?.[card.cardSymbol]?.cards?.filter(cardx => cards.includes(cardx));
						if (!cardsx?.length) {
							return;
						}
						event.cards.removeArray(cardsx);
						event.cards.add(card);
					});
					event.lose_map[id] ??= [];
					event.lose_map[id].addArray(Cards_card);
				} else {
					event.lose_map.noowner.add(cards_ow.shift());
				}
			}
			player.respondAnimateBefore?.(event, trigger, player);
			if (event.animate != false && event.throw !== false) {
				let throw_cards = cards;
				let virtualCard_str = false;
				for (let id in event.lose_map) {
					if (id == "noowner") {
						continue;
					}
					const owner = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
					let throws = event.lose_map[id];
					if (owner == player) {
						if (!throw_cards.length && lib.config.card_animation_info) {
							const virtualCard = ui.create.card();
							virtualCard._destroy = true;
							virtualCard.expired = true;
							const info = lib.card[card.name],
								number = card.number;
							virtualCard.init([get.suit(card), typeof number == "number" ? number : "虚拟", card.name, card.nature]);
							virtualCard_str = virtualCard.querySelector(".info").innerHTML;
							throw_cards = [virtualCard];
							throws.add(virtualCard);
						}
					}
					if (throws.length) {
						owner.$throw(throws);
					}
				}
				if (event.lose_map.noowner.length) {
					for (const card of event.lose_map.noowner) {
						game.broadcastAll(
							function (player, card, cardid) {
								var event;
								if (game.online) {
									event = {};
								} else {
									event = _status.event;
								}
								if (game.chess) {
									event.node = card.copy("thrown", "center", ui.arena).addTempClass("start");
								} else {
									event.node = player.$throwordered(card.copy(), true);
								}
								if (lib.cardOL) {
									lib.cardOL[cardid] = event.node;
								}
								event.node.cardid = cardid;
								event.node.classList.add("thrownhighlight");
							},
							player,
							card,
							get.id()
						);
					}
				}
				if (lib.config.card_animation_info) {
					game.broadcastAll(
						function (cards, card, card_cards, str, judgeing) {
							for (let nodex of cards) {
								let node = nodex.clone;
								if (nodex._tempName) {
									nodex._tempName.delete();
									delete nodex._tempName;
								}
								if (!node) {
									continue;
								}
								if (str) {
									node.querySelector(".info").innerHTML = str;
								}
								if (
									(cards.length > 1 ||
										!card.isCard ||
										card.name != node.name ||
										card.nature != node.nature ||
										!card.cards.length) &&
									!judgeing
								) {
									ui.create.cardTempName(card, node);
									if (node._tempName && card_cards?.length <= 0) {
										node._tempName.innerHTML = node._tempName.innerHTML.slice(0, node._tempName.innerHTML.indexOf("<span", -1));
										node._tempName.innerHTML += "<span style='color:black'>虚拟</span></span>";
									}
								}
							}
						},
						throw_cards,
						event.card,
						event.cards,
						virtualCard_str,
						event.highlight
					);
				}
				if (event.highlight) {
					for (var i = 0; i < throw_cards.length; i++) {
						throw_cards[i].clone.classList.add("thrownhighlight");
						game.addVideo("highlightnode", player, get.cardInfo(throw_cards[i]));
					}
				}
				if (event.highlight) {
					game.broadcast(function (cards) {
						for (var i = 0; i < cards.length; i++) {
							if (cards[i].clone) {
								cards[i].clone.classList.add("thrownhighlight");
							}
						}
					}, throw_cards);
				}
			}
			if (cards.length) {
				const ownerCards = cards.filter(card => get.owner(card)),
					directDiscard = cards.filter(card => !get.owner(card));
				if (ownerCards.length) {
					const ownerx = get.owner(cards.find(card => get.owner(card) !== false));
					if (
						cards.some(card => {
							const owner = get.owner(card);
							if (owner === false) {
								return false;
							}
							return owner != ownerx;
						})
					) {
						await game.loseAsync({ player: player, cards: ownerCards }).setContent(async (event, trigger, player) => {
							let cards = event.cards;
							let cards_noowner = [];
							while (cards.length) {
								const owner = get.owner(cards[0]);
								if (!owner) {
									cards_noowner.add(cards.shift());
								} else {
									const id = owner.playerid;
									let onLoseCards = cards.filter(card => get.owner(card) == owner);
									event.cards.removeArray(onLoseCards);
									await owner
										.lose(onLoseCards, "visible", ui.ordering)
										.set("relatedEvent", event.getParent())
										.set("getlx", false)
										.set("type", "use");
								}
							}
							if (cards_noowner.length) {
								await game.cardsGotoOrdering(cards_noowner).set("relatedEvent", event.getParent());
							}
						});
					} else {
						await ownerx.lose(ownerCards, "visible", ui.ordering).set("type", "use");
					}
				}
				if (directDiscard.length) {
					event.lose_map.noowner.addArray(directDiscard);
					await game.cardsGotoOrdering(directDiscard);
				}
			}
			await event.trigger("respond");
			await game.delayx(0.5);
		},
	],
	async swapHandcards(event, trigger, player) {
		const { target } = event;

		event.cards1 = event.cards1 || player.getCards("h");
		event.cards2 = event.cards2 || target.getCards("h");
		await game
			.loseAsync({
				player: player,
				target: target,
				cards1: event.cards1,
				cards2: event.cards2,
			})
			.setContent("swapHandcardsx");
		await game
			.loseAsync({
				gain_list: [
					[player, event.cards2.filterInD()],
					[target, event.cards1.filterInD()],
				],
			})
			.setContent("gaincardMultiple");
		await game.delayx();
	},
	async swapHandcardsx(event, trigger, player) {
		const { target } = event;
		const { cards1, cards2 } = event;

		player.$giveAuto(cards1, target);
		target.$giveAuto(cards2, player);

		let delayed = false;

		let cards = cards1;
		const next1 = player.lose(cards, ui.ordering);
		next1.getlx = false;
		next1.relatedEvent = event.getParent();
		if (player == game.me) {
			delayed = true;
		} else {
			next1.delay = false;
		}

		await next1;

		cards = event.cards2;
		const next2 = target.lose(cards, ui.ordering);
		next2.getlx = false;
		next2.relatedEvent = event.getParent();
		if (target == game.me) {
			delayed = true;
		} else {
			next2.delay = false;
		}

		await next2;

		if (!delayed) {
			await game.delay();
		}
	},
	async gainMultiple(event, trigger, player) {
		const { targets } = event;
		let delayed = false;
		const cards = [];

		for (let i = 0; i < targets.length; ++i) {
			const target = targets[i];
			const result = await player
				.gainPlayerCard(targets[i], event.position, true)
				.set("boolline", false)
				.set("delay", i == targets.length - 1)
				.forResult();

			if (result.bool) {
				cards.addArray(result.cards);
				if (i == targets.length - 1) {
					delayed = true;
				}
			}
		}

		if (!delayed) {
			await game.delay();
		}
	},
	gain: [
		async (event, trigger, player) => {
			let { cards } = event;
			if (event.animate == "give" || event.animate == "gain2" || event.animate == "draw2") {
				event.visible = true;
			}
			if (get.itemtype(cards) == "cards") {
				var map = {};
				for (var i of cards) {
					var owner = get.owner(i, "judge");
					if (owner && (owner != player || get.position(i) != "h")) {
						var id = owner.playerid;
						if (!map[id]) {
							map[id] = [[], [], []];
						}
						map[id][0].push(i);
						var position = get.position(i);
						if (position == "h") {
							map[id][1].push(i);
						} else {
							map[id][2].push(i);
						}
					} else if (!event.updatePile && get.position(i) == "c") {
						event.updatePile = true;
					}
					if (event.visible) {
						i.addKnower("everyone");
					}
				}
				event.losing_map = map;
				for (var i in map) {
					var owner = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
					var next = owner.lose(map[i][0], ui.special).set("type", "gain").set("forceDie", true).set("getlx", false);
					if (event.visible == true) {
						next.visible = true;
					}
					event.relatedLose = next;
				}
			} else {
				const name = event.getParent(event.getlx === false ? 2 : 1).name;
				console.warn(`请检查技能：${name}中关于gain的写法`);
				event.finish();
			}
		},
		async (event, trigger, player) => {
			let { cards } = event;
			event.cards = cards = cards.map(i => (i.cards ? i.cards : [i])).flat();
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].willBeDestroyed("handcard", player, event)) {
					cards[i].selfDestroy(event);
					cards.splice(i--, 1);
				} else if (event.losing_map) {
					for (const id in event.losing_map) {
						if (event.losing_map[id][0].includes(cards[i])) {
							const source = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
							var hs = source.getCards("hejsx");
							if (hs.includes(cards[i])) {
								cards.splice(i--, 1);
							} else {
								cards[i].addKnower(source);
							}
						}
					}
				}
			}
			if (cards.length == 0) {
				event.finish();
				return;
			}
			player.getHistory("gain").push(event);
			//if(event.source&&event.delay!==false) game.delayx();
		},
		async (event, trigger, player) => {
			let { cards } = event;
			if (player.getStat().gain == undefined) {
				player.getStat().gain = cards.length;
			} else {
				player.getStat().gain += cards.length;
			}
		},
		async (event, trigger, player) => {
			let { cards } = event;
			for (const [key, value] of lib.commonArea) {
				const list = (_status[value.areaStatusName] || []).filter(card => cards.includes(card));
				if (event[value.fromName] || list.length) {
					const next = game.createEvent("from_" + value.fromName);
					next.setContent(value.removeHandeler);
					next.cards = cards;
					next.player = player;
					next.type = event.name;
					await next;
				}
			}
		},
		async (event, trigger, player) => {
			let { cards } = event;
			var sort;
			var frag1 = document.createDocumentFragment();
			var frag2 = document.createDocumentFragment();
			var hs = player.getCards("hs");
			for (var i = 0; i < cards.length; i++) {
				if (hs.includes(cards[i])) {
					cards.splice(i--, 1);
				}
			}
			for (var num = 0; num < cards.length; num++) {
				sort = lib.config.sort_card(cards[num]);
				if (lib.config.reverse_sort) {
					sort = -sort;
				}
				if (["o", "d"].includes(get.position(cards[num], true))) {
					cards[num].addKnower("everyone");
				}
				cards[num].fix();
				cards[num].style.transform = "";
				event.gaintag.forEach(tag => cards[num].addGaintag(tag));
				if (event.knowers) {
					cards[num].addKnower(event.knowers); //添加事件设定的知情者。
				}
				if (_status.discarded) {
					_status.discarded.remove(cards[num]);
				}
				// cards[num].vanishtag.length=0;
				for (var num2 = 0; num2 < cards[num].vanishtag.length; num2++) {
					if (cards[num].vanishtag[num2][0] != "_") {
						cards[num].vanishtag.splice(num2--, 1);
					}
				}
				if (player == game.me) {
					cards[num].classList.add("drawinghidden");
				}
				if (get.is.singleHandcard() || sort > 1) {
					frag1.appendChild(cards[num]);
				} else {
					frag2.appendChild(cards[num]);
				}
			}
			var addv = function () {
				if (player == game.me) {
					game.addVideo("gain12", player, [get.cardsInfo(frag1.childNodes), get.cardsInfo(frag2.childNodes), event.gaintag]);
				}
			};
			var broadcast = function () {
				game.broadcast(
					function (player, cards, num, gaintag) {
						player.directgain(cards, null, gaintag);
						_status.cardPileNum = num;
					},
					player,
					cards,
					ui.cardPile.childNodes.length,
					event.gaintag
				);
			};
			if (event.animate == "draw") {
				player.$draw(cards.length);
				game.pause();
				setTimeout(
					function () {
						addv();
						player.node.handcards1.insertBefore(frag1, player.node.handcards1.firstChild);
						player.node.handcards2.insertBefore(frag2, player.node.handcards2.firstChild);
						player.update();
						if (player == game.me) {
							ui.updatehl();
						}
						broadcast();
						game.resume();
					},
					get.delayx(500, 500)
				);
			} else if (event.animate == "gain") {
				player.$gain(cards, event.log);
				game.pause();
				setTimeout(
					function () {
						addv();
						player.node.handcards1.insertBefore(frag1, player.node.handcards1.firstChild);
						player.node.handcards2.insertBefore(frag2, player.node.handcards2.firstChild);
						player.update();
						if (player == game.me) {
							ui.updatehl();
						}
						broadcast();
						game.resume();
					},
					get.delayx(700, 700)
				);
			} else if (event.animate == "gain2" || event.animate == "draw2") {
				var gain2t = 300;
				if (player.$gain2(cards, event.log) && player == game.me) {
					gain2t = 500;
				}
				game.pause();
				setTimeout(
					function () {
						addv();
						player.node.handcards1.insertBefore(frag1, player.node.handcards1.firstChild);
						player.node.handcards2.insertBefore(frag2, player.node.handcards2.firstChild);
						player.update();
						if (player == game.me) {
							ui.updatehl();
						}
						broadcast();
						game.resume();
					},
					get.delayx(gain2t, gain2t)
				);
			} else if (event.animate == "give" || event.animate == "giveAuto") {
				var evtmap = event.losing_map;
				if (event.animate == "give") {
					for (let i in evtmap) {
						const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						source.$give(evtmap[i][0], player, event.log);
					}
				} else {
					for (let i in evtmap) {
						const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						if (evtmap[i][1].length) {
							source.$giveAuto(evtmap[i][1], player, event.log);
						}
						if (evtmap[i][2].length) {
							source.$give(evtmap[i][2], player, event.log);
						}
					}
				}
				game.pause();
				setTimeout(
					function () {
						addv();
						player.node.handcards1.insertBefore(frag1, player.node.handcards1.firstChild);
						player.node.handcards2.insertBefore(frag2, player.node.handcards2.firstChild);
						player.update();
						if (player == game.me) {
							ui.updatehl();
						}
						broadcast();
						game.resume();
					},
					get.delayx(500, 500)
				);
			} else if (typeof event.animate == "function") {
				var time = event.animate(event);
				game.pause();
				setTimeout(
					function () {
						addv();
						player.node.handcards1.insertBefore(frag1, player.node.handcards1.firstChild);
						player.node.handcards2.insertBefore(frag2, player.node.handcards2.firstChild);
						player.update();
						if (player == game.me) {
							ui.updatehl();
						}
						broadcast();
						game.resume();
					},
					get.delayx(time, time)
				);
			} else {
				addv();
				player.node.handcards1.insertBefore(frag1, player.node.handcards1.firstChild);
				player.node.handcards2.insertBefore(frag2, player.node.handcards2.firstChild);
				player.update();
				if (player == game.me) {
					ui.updatehl();
				}
				broadcast();
				event.finish();
			}
		},
		async (event, trigger, player) => {
			game.delayx();
			if (event.updatePile) {
				game.updateRoundNumber();
			}
		},
	],
	addToExpansion: [
		async (event, trigger, player) => {
			let { cards } = event;
			if (event.animate == "give") {
				event.visible = true;
			}
			if (get.itemtype(cards) == "cards") {
				var map = {};
				for (var i of cards) {
					var owner = get.owner(i, "judge");
					if (owner && (owner != player || get.position(i) != "x")) {
						var id = owner.playerid;
						if (!map[id]) {
							map[id] = [[], [], []];
						}
						map[id][0].push(i);
						var position = get.position(i);
						if (position == "h") {
							map[id][1].push(i);
						} else {
							map[id][2].push(i);
						}
					} else if (!event.updatePile && get.position(i) == "c") {
						event.updatePile = true;
					}
					if (event.visible) {
						i.addKnower("everyone");
					}
				}
				event.losing_map = map;
				for (var i in map) {
					var owner = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
					var next = owner.lose(map[i][0], ui.special).set("type", "loseToExpansion").set("forceDie", true).set("getlx", false);
					if (event.visible == true) {
						next.visible = true;
					}
					event.relatedLose = next;
				}
			} else {
				event.finish();
			}
		},
		async (event, trigger, player) => {
			let { cards, source } = event;
			event.cards = cards = cards.map(i => (i.cards ? i.cards : [i])).flat();
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].willBeDestroyed("expansion", player, event)) {
					cards[i].selfDestroy(event);
					cards.splice(i--, 1);
				} else if (event.losing_map) {
					for (let id in event.losing_map) {
						if (event.losing_map[id][0].includes(cards[i])) {
							const source = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
							var hs = source.getCards("hejsx");
							if (hs.includes(cards[i])) {
								cards.splice(i--, 1);
							}
						} else {
							cards[i].addKnower(source);
						}
					}
				}
			}
			if (cards.length == 0) {
				event.finish();
				return;
			}
		},
		async (event, trigger, player) => {
			let { cards } = event;
			for (const [key, value] of lib.commonArea) {
				const list = (_status[value.areaStatusName] || []).filter(card => cards.includes(card));
				if (event[value.fromName] || list.length) {
					const next = game.createEvent("from_" + value.fromName);
					next.setContent(value.removeHandeler);
					next.cards = cards;
					next.player = player;
					next.type = event.name;
					await next;
				}
			}
		},
		async (event, trigger, player) => {
			let { cards } = event;
			var hs = player.getCards("x");
			for (var i = 0; i < cards.length; i++) {
				if (hs.includes(cards[i])) {
					cards.splice(i--, 1);
				}
			}
			for (var num = 0; num < cards.length; num++) {
				if (["o", "d"].includes(get.position(cards[num], true))) {
					cards[num].addKnower("everyone");
				}
				if (_status.discarded) {
					_status.discarded.remove(cards[num]);
				}
				for (var num2 = 0; num2 < cards[num].vanishtag.length; num2++) {
					if (cards[num].vanishtag[num2][0] != "_") {
						cards[num].vanishtag.splice(num2--, 1);
					}
				}
			}
			if (event.animate == "draw") {
				player.$draw(cards.length);
				if (event.log) {
					game.log(player, "将", get.cnNumber(cards.length), "张牌置于了武将牌上");
				}
				game.pause();
				setTimeout(
					function () {
						player.$addToExpansion(cards, null, event.gaintag);
						for (var i of event.gaintag) {
							player.markSkill(i);
						}
						game.resume();
					},
					get.delayx(500, 500)
				);
			} else if (event.animate == "gain") {
				player.$gain(cards, false);
				game.pause();
				setTimeout(
					function () {
						player.$addToExpansion(cards, null, event.gaintag);
						for (var i of event.gaintag) {
							player.markSkill(i);
						}
						game.resume();
					},
					get.delayx(700, 700)
				);
			} else if (event.animate == "gain2" || event.animate == "draw2") {
				var gain2t = 300;
				if (player.$gain2(cards) && player == game.me) {
					gain2t = 500;
				}
				game.pause();
				setTimeout(
					function () {
						player.$addToExpansion(cards, null, event.gaintag);
						for (var i of event.gaintag) {
							player.markSkill(i);
						}
						game.resume();
					},
					get.delayx(gain2t, gain2t)
				);
			} else if (event.animate == "give" || event.animate == "giveAuto") {
				var evtmap = event.losing_map;
				if (event.animate == "give") {
					for (let i in evtmap) {
						const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						source.$give(evtmap[i][0], player, false);
						if (event.log) {
							game.log(player, "将", evtmap[i][0], "置于了武将牌上");
						}
					}
				} else {
					for (let i in evtmap) {
						const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						if (evtmap[i][1].length) {
							source.$giveAuto(evtmap[i][1], player, false);
							if (event.log) {
								game.log(player, "将", get.cnNumber(evtmap[i][1].length), "张牌置于了武将牌上");
							}
						}
						if (evtmap[i][2].length) {
							source.$give(evtmap[i][2], player, false);
							if (event.log) {
								game.log(player, "将", evtmap[i][2], "置于了武将牌上");
							}
						}
					}
				}
				game.pause();
				setTimeout(
					function () {
						player.$addToExpansion(cards, null, event.gaintag);
						for (var i of event.gaintag) {
							player.markSkill(i);
						}
						game.resume();
					},
					get.delayx(500, 500)
				);
			} else if (typeof event.animate == "function") {
				var time = event.animate(event);
				game.pause();
				setTimeout(
					function () {
						player.$addToExpansion(cards, null, event.gaintag);
						for (var i of event.gaintag) {
							player.markSkill(i);
						}
						game.resume();
					},
					get.delayx(time, time)
				);
			} else {
				player.$addToExpansion(cards, null, event.gaintag);
				for (var i of event.gaintag) {
					player.markSkill(i);
				}
				event.finish();
			}
		},
		async (event, trigger, player) => {
			game.delayx();
			if (event.updatePile) {
				game.updateRoundNumber();
			}
		},
	],
	lose: [
		async (event, trigger, player) => {
			let { cards } = event;
			var evt = event.getParent();
			if ((evt.name != "discard" || event.type != "discard") && (evt.name != "loseToDiscardpile" || event.type != "loseToDiscardpile")) {
				event.delay = false;
				return;
			}
			if (evt.delay === false) {
				event.delay = false;
			}
			if (evt.animate != false) {
				evt.discardid = lib.status.videoId++;
				game.broadcastAll(
					function (player, cards, id, visible) {
						const cardx = cards
							.slice()
							.map(i => (i.cards ? i.cards : [i]))
							.flat();
						player.$throw(cardx, null, "nobroadcast");
						var cardnodes = [];
						cardnodes._discardtime = get.time();
						for (var i = 0; i < cardx.length; i++) {
							if (cardx[i].clone) {
								cardnodes.push(cardx[i].clone);
								if (!visible) {
									cardx[i].clone.classList.add("infohidden");
									cardx[i].clone.classList.add("infoflip");
								}
							}
						}
						ui.todiscard[id] = cardnodes;
					},
					player,
					cards,
					evt.discardid,
					event.visible
				);
				if (lib.config.sync_speed && cards[0] && cards[0].clone) {
					if (evt.delay != false) {
						var waitingForTransition = get.time();
						evt.waitingForTransition = waitingForTransition;
						cards[0].clone.listenTransition(function () {
							if (_status.waitingForTransition == waitingForTransition && _status.paused) {
								game.resume();
							}
							delete evt.waitingForTransition;
						});
					} else if (evt.getParent().discardTransition) {
						delete evt.getParent().discardTransition;
						var waitingForTransition = get.time();
						evt.getParent().waitingForTransition = waitingForTransition;
						cards[0].clone.listenTransition(function () {
							if (_status.waitingForTransition == waitingForTransition && _status.paused) {
								game.resume();
							}
							delete evt.getParent().waitingForTransition;
						});
					}
				}
			}
		},
		async (event, trigger, player) => {
			let { cards } = event;
			event.vcards = {
				//这玩意拿来存储假牌
				cards: [],
				es: [],
				js: [],
			};
			//这个拿来存储虚拟牌对应的实体牌
			event.vcard_cards = [];
			event.gaintag_map = {};
			var hs = [],
				es = [],
				js = [],
				ss = [],
				xs = [];
			var unmarks = [];
			if (event.insert_card && event.position == ui.cardPile) {
				event.cards.reverse();
			}
			var hej = player.getCards("hejsx");
			event.stockcards = cards.slice(0);
			for (var i = 0; i < cards.length; i++) {
				let cardx = [cards[i]];
				if (!hej.includes(cards[i])) {
					cards.splice(i--, 1);
					continue;
				} else if (cards[i].parentNode) {
					if (cards[i].parentNode.classList.contains("equips")) {
						cards[i].original = "e";
						const VEquip = cards[i][cards[i].cardSymbol];
						if (VEquip) {
							//判断是否是假牌
							if (cards[i].isViewAsCard) {
								let loseCards = VEquip.cards;
								//解体！
								cardx.addArray(loseCards);
								event.vcard_cards.addArray(loseCards);
								loseCards.forEach(cardi => {
									cardi.original = "e";
									delete cardi.destiny;
									es.push(cardi);
									event.vcard_map.set(cardi, VEquip || get.autoViewAs(cards[i], void 0, false));
								});
							} else {
								es.push(cards[i]);
								event.vcard_map.set(cards[i], VEquip || get.autoViewAs(cards[i], void 0, false));
								event.vcard_cards.add(cards[i]);
							}
							event.vcards.cards.push(cards[i]);
							event.vcards.es.push(cards[i]);
						}
					} else if (cards[i].parentNode.classList.contains("judges")) {
						cards[i].original = "j";
						const VJudge = cards[i][cards[i].cardSymbol];
						if (VJudge) {
							//判断是否是假牌
							if (cards[i].isViewAsCard) {
								let loseCards = VJudge.cards;
								//解体！
								cardx.addArray(loseCards);
								event.vcard_cards.addArray(loseCards);
								loseCards.forEach(cardi => {
									cardi.original = "j";
									delete cardi.destiny;
									js.push(cardi);
									event.vcard_map.set(cardi, VJudge || get.autoViewAs(cards[i], void 0, false));
								});
							} else {
								js.push(cards[i]);
								event.vcard_map.set(cards[i], VJudge || get.autoViewAs(cards[i], void 0, false));
								event.vcard_cards.add(cards[i]);
							}
							event.vcards.cards.push(cards[i]);
							event.vcards.js.push(cards[i]);
						}
					} else if (cards[i].parentNode.classList.contains("expansions")) {
						cards[i].original = "x";
						xs.push(cards[i]);
						event.vcard_map.set(cards[i], get.autoViewAs(cards[i], void 0, false));
						if (cards[i].gaintag && cards[i].gaintag.length) {
							unmarks.addArray(cards[i].gaintag);
						}
					} else if (cards[i].parentNode.classList.contains("handcards")) {
						if (cards[i].classList.contains("glows")) {
							cards[i].original = "s";
							ss.push(cards[i]);
							event.vcard_map.set(cards[i], get.autoViewAs(cards[i], void 0, false));
						} else {
							cards[i].original = "h";
							hs.push(cards[i]);
							event.vcard_map.set(cards[i], get.autoViewAs(cards[i], void 0, player));
						}
					} else {
						cards[i].original = null;
					}
				}
				for (var j = 0; j < cardx.length; j++) {
					if (cardx[j].gaintag && cardx[j].gaintag.length) {
						event.gaintag_map[cardx[j].cardid] = cardx[j].gaintag.slice(0);
						//仅移除非永久标记
						const tags = cardx[j].gaintag.filter(tag => !tag.startsWith("eternal_"));
						tags.forEach(tag => cardx[j].removeGaintag(tag));
					}

					cardx[j].style.transform += " scale(0.2)";
					cardx[j].classList.remove("glow");
					cardx[j].classList.remove("glows");
					cardx[j].recheck();

					var info = lib.card[cardx[j].name];
					if ("_destroy" in cardx[j]) {
						if (cardx[j]._destroy) {
							cardx[j].delete();
							cardx[j].destroyed = cardx[j]._destroy;
							continue;
						}
					} else if (event.position && cardx[j].willBeDestroyed(event.position.id, null, event)) {
						cardx[j].selfDestroy(event);
						continue;
					} else if (info.destroy) {
						cardx[j].delete();
						cardx[j].destroyed = info.destroy;
						continue;
					}
					/*else if ("destroyed" in cardx[j]) {
						
					}*/
					if (event.position) {
						if (_status.discarded) {
							if (event.position == ui.discardPile) {
								_status.discarded.add(cardx[j]);
							} else {
								_status.discarded.remove(cardx[j]);
							}
						}
						if (event.insert_index) {
							cardx[j].fix();
							event.position.insertBefore(cardx[j], event.insert_index(event, cardx[j]));
						} else if (event.insert_card) {
							cardx[j].fix();
							event.position.insertBefore(cardx[j], event.position.firstChild);
						} else if (event.position == ui.cardPile) {
							cardx[j].fix();
							event.position.appendChild(cardx[j]);
						} else {
							cardx[j].goto(event.position);
						}
					} else {
						cardx[j].remove();
					}
					//if(ss.includes(cardx[j])) cards.splice(i--,1);
				}
			}
			if (player == game.me) {
				ui.updatehl();
			}
			ui.updatej(player);
			game.broadcast(
				function (player, cards, num) {
					for (var i = 0; i < cards.length; i++) {
						//cards[i].removeGaintag(true);
						//仅移除非永久标记
						const tags = cards[i].gaintag.filter(tag => !tag.startsWith("eternal_"));
						tags.forEach(tag => cards[i].removeGaintag(tag));
						cards[i].classList.remove("glow");
						cards[i].classList.remove("glows");
						cards[i].fix();
						cards[i].remove();
					}
					if (player == game.me) {
						ui.updatehl();
					}
					ui.updatej(player);
					_status.cardPileNum = num;
				},
				player,
				cards.slice(),
				ui.cardPile.childNodes.length
			);
			game.addVideo("lose", player, [get.cardsInfo(hs), get.cardsInfo(es), get.cardsInfo(js), get.cardsInfo(ss)]);
			event.cards2 = hs.concat(es);
			cards.removeArray(event.vcards.cards);
			cards.addArray(event.vcard_cards);
			player.getHistory("lose").push(event);
			game.getGlobalHistory().cardMove.push(event);
			player.update();
			game.addVideo("loseAfter", player);
			event.num = 0;
			if (event.position == ui.ordering) {
				var evt = event.relatedEvent || event.getParent();
				if (!evt.orderingCards) {
					evt.orderingCards = [];
				}
				if (!evt.noOrdering && !evt.cardsOrdered) {
					evt.cardsOrdered = true;
					var next = game.createEvent("orderingDiscard", false);
					event.next.remove(next);
					evt.after.push(next);
					next.relatedEvent = evt;
					next.setContent("orderingDiscard");
				}
				if (!evt.noOrdering) {
					evt.orderingCards.addArray(cards);
				}
			} else if (event.position == ui.cardPile) {
				game.updateRoundNumber();
			}
			if (unmarks.length) {
				for (var i of unmarks) {
					player[(lib.skill[i] && lib.skill[i].mark) || player.hasCard(card => card.hasGaintag(i), "x") ? "markSkill" : "unmarkSkill"](i);
				}
			}
			event.hs = hs;
			event.es = es;
			event.js = js;
			event.ss = ss;
			event.xs = xs;
			game.clearCardKnowers(hs);
			if (hs.length && !event.visible) {
				player.getCards("h").forEach(hcard => {
					hcard.clearKnowers();
				});
			}
		},
		async (event, trigger, player) => {
			let { num } = event;
			if (num < event.vcards.cards.length) {
				if (event.vcards.es.includes(event.vcards.cards[num])) {
					event.loseEquip = true;
					const VEquip = event.vcards.cards[num][event.vcards.cards[num].cardSymbol];
					if (VEquip) {
						player.removeVirtualEquip(VEquip);
						//player.removeEquipTrigger(cards[num]);
						var info = get.info(VEquip, false);
						if (info.onLose && (!info.filterLose || info.filterLose(VEquip, player))) {
							event.goto(3);
							event.currentVEquip = VEquip;
							return;
						}
					}
				} else if (event.vcards.js.includes(event.vcards.cards[num])) {
					const VJudge = event.vcards.cards[num][event.vcards.cards[num].cardSymbol];
					if (VJudge) {
						player.removeVirtualJudge(VJudge);
					}
				}
				event.num++;
				event.redo();
			} else {
				if (event.loseEquip) {
					player.addEquipTrigger();
				}
				event.goto(4);
			}
		},
		async (event, trigger, player) => {
			const VEquip = event.currentVEquip;
			var info = get.info(VEquip, false);
			if (info.loseDelay != false && (player.isAlive() || info.forceDie)) {
				player.popup(VEquip.name);
				game.delayx();
			}
			if (Array.isArray(info.onLose)) {
				for (var i = 0; i < info.onLose.length; i++) {
					var next = game.createEvent("lose_" + VEquip.name);
					next.setContent(info.onLose[i]);
					if (info.forceDie) {
						next.forceDie = true;
					}
					next.player = player;
					next.card = VEquip;
					next.cards = VEquip.cards;
				}
			} else {
				var next = game.createEvent("lose_" + VEquip.name);
				next.setContent(info.onLose);
				next.player = player;
				if (info.forceDie) {
					next.forceDie = true;
				}
				next.card = VEquip;
				next.cards = VEquip.cards;
			}
			event.num++;
			event.goto(2);
		},
		async (event, trigger, player) => {
			let { cards } = event;
			event.cards = cards.map(i => (i.cards ? i.cards : [i])).flat();
			for (const [key, value] of lib.commonArea) {
				if (event[value.toName]) {
					const next = game.createEvent("lose_" + value.toName);
					next.setContent(value.addHandeler);
					next.player = player;
					next.cards = cards;
					next.relatedEvent = event;
					next.type = event.name;
					await next;
				}
			}
		},
		async (event, trigger, player) => {
			var evt = event.getParent();
			if (evt.name != "discard" && event.type != "discard" && evt.name != "loseToDiscardpile" && event.type != "loseToDiscardpile") {
				return;
			}
			if (event.animate === false || event.delay === false) {
				return;
			}
			if (evt.delay != false) {
				if (evt.waitingForTransition) {
					_status.waitingForTransition = evt.waitingForTransition;
					game.pause();
				} else {
					game.delayx();
				}
			}
		},
	],
	damage: [
		async (event, trigger, player) => {
			event.forceDie = true;
			event.includeOut = true;
			if (event.unreal) {
				event.goto(4);
				return;
			}
			game.callHook("checkDamage1", [event, player]);
			await event.trigger("damageBegin1");
		},
		async (event, trigger, player) => {
			game.callHook("checkDamage2", [event, player]);
			await event.trigger("damageBegin2");
		},
		async (event, trigger, player) => {
			game.callHook("checkDamage3", [event, player]);
			await event.trigger("damageBegin3");
		},
		async (event, trigger, player) => {
			game.callHook("checkDamage4", [event, player]);
			event.trigger("damageBegin4");
		},
		async (event, trigger, player) => {
			const { num, source } = event;
			if (player.hujia > 0 && !player.hasSkillTag("nohujia") && !event.nohujia) {
				var damageAudioInfo = lib.natureAudio.hujia_damage[event.nature];
				if (!damageAudioInfo || damageAudioInfo == "normal") {
					damageAudioInfo = "effect/hujia_damage" + (num > 1 ? "2" : "") + ".mp3";
				} else if (damageAudioInfo == "default") {
					damageAudioInfo = "effect/hujia_damage_" + event.nature + (num > 1 ? "2" : "") + ".mp3";
				} else {
					damageAudioInfo = damageAudioInfo[num > 1 ? 2 : 1];
				}
				game.broadcastAll(function (damageAudioInfo) {
					if (lib.config.background_audio) {
						game.playAudio(damageAudioInfo);
					}
				}, damageAudioInfo);
			} else {
				var damageAudioInfo = lib.natureAudio.damage[event.nature];
				if (!damageAudioInfo || damageAudioInfo == "normal") {
					damageAudioInfo = "effect/damage" + (num > 1 ? "2" : "") + ".mp3";
				} else if (damageAudioInfo == "default") {
					damageAudioInfo = "effect/damage_" + event.nature + (num > 1 ? "2" : "") + ".mp3";
				} else {
					damageAudioInfo = damageAudioInfo[num > 1 ? 2 : 1];
				}
				game.broadcastAll(function (damageAudioInfo) {
					if (lib.config.background_audio) {
						game.playAudio(damageAudioInfo);
					}
				}, damageAudioInfo);
			}
			var str = event.unreal ? "视为受到了" : "受到了";
			if (source) {
				str += '来自<span class="bluetext">' + (source == player ? "自己" : get.translation(source)) + "</span>的";
			}
			str += get.cnNumber(num) + "点";
			if (event.nature) {
				str += get.translation(event.nature) + "属性";
			}
			str += "伤害";
			game.log(player, str);
			if (player.stat[player.stat.length - 1].damaged == undefined) {
				player.stat[player.stat.length - 1].damaged = num;
			} else {
				player.stat[player.stat.length - 1].damaged += num;
			}
			if (source) {
				source.getHistory("sourceDamage").push(event);
				if (source.stat[source.stat.length - 1].damage == undefined) {
					source.stat[source.stat.length - 1].damage = num;
				} else {
					source.stat[source.stat.length - 1].damage += num;
				}
			}
			player.getHistory("damage").push(event);
			if (!event.unreal) {
				if (event.notrigger) {
					player.changeHp(-num, false)._triggered = null;
				} else {
					player.changeHp(-num, false);
				}
			}
			if (event.animate !== false) {
				player.$damage(source);
				var natures = (event.nature || "").split(lib.natureSeparator);
				game.broadcastAll(
					function (natures, player) {
						if (lib.config.animation && !lib.config.low_performance) {
							if (natures.includes("fire")) {
								player.$fire();
							}
							if (natures.includes("thunder")) {
								player.$thunder();
							}
						}
					},
					natures,
					player
				);
				var numx = player.hasSkillTag("nohujia") ? num : Math.max(0, num - player.hujia);
				player.$damagepop(-numx, natures[0]);
			}
			if (event.unreal) {
				event.goto(6);
			}
			if (!event.notrigger) {
				if (num == 0) {
					await event.trigger("damageZero");
					event._triggered = null;
				} else {
					await event.trigger("damage");
				}
			}
		},
		async (event, trigger, player) => {
			const { source } = event;
			let next;
			if (player.hp <= 0 && player.isAlive() && !event.nodying) {
				await game.delayx();
				event._dyinged = true;
				next = player.dying(event);
			}
			if (source && lib.config.border_style == "auto") {
				var dnum = 0;
				for (var j = 0; j < source.stat.length; j++) {
					if (source.stat[j].damage != undefined) {
						dnum += source.stat[j].damage;
					}
				}
				if (dnum >= 2) {
					if (lib.config.autoborder_start == "silver") {
						dnum += 4;
					} else if (lib.config.autoborder_start == "gold") {
						dnum += 8;
					}
				}
				if (lib.config.autoborder_count == "damage") {
					source.node.framebg.dataset.decoration = "";
					if (dnum >= 10) {
						source.node.framebg.dataset.auto = "gold";
						if (dnum >= 12) {
							source.node.framebg.dataset.decoration = "gold";
						}
					} else if (dnum >= 6) {
						source.node.framebg.dataset.auto = "silver";
						if (dnum >= 8) {
							source.node.framebg.dataset.decoration = "silver";
						}
					} else if (dnum >= 2) {
						source.node.framebg.dataset.auto = "bronze";
						if (dnum >= 4) {
							source.node.framebg.dataset.decoration = "bronze";
						}
					}
					if (dnum >= 2) {
						source.classList.add("topcount");
					}
				} else if (lib.config.autoborder_count == "mix") {
					source.node.framebg.dataset.decoration = "";
					switch (source.node.framebg.dataset.auto) {
						case "bronze":
							if (dnum >= 4) {
								source.node.framebg.dataset.decoration = "bronze";
							}
							break;
						case "silver":
							if (dnum >= 8) {
								source.node.framebg.dataset.decoration = "silver";
							}
							break;
						case "gold":
							if (dnum >= 12) {
								source.node.framebg.dataset.decoration = "gold";
							}
							break;
					}
				}
			}
			if (next) {
				return next.forResult();
			}
		},
		async (event, trigger, player) => {
			if (!event.notrigger) {
				await event.trigger("damageSource");
			}
		},
	],
	async recover(event, trigger, player) {
		let { num } = event;
		if (num > player.maxHp - player.hp) {
			num = player.maxHp - player.hp;
			event.num = num;
		}
		if (num > 0) {
			delete event.filterStop;
			if (lib.config.background_audio) {
				game.playAudio("effect", "recover");
			}
			game.broadcast(function () {
				if (lib.config.background_audio) {
					game.playAudio("effect", "recover");
				}
			});
			game.broadcastAll(function (player) {
				if (lib.config.animation && !lib.config.low_performance) {
					player.$recover();
				}
			}, player);
			player.$damagepop(num, "wood");
			game.log(player, "回复了" + get.cnNumber(num) + "点体力");

			await player.changeHp(num, false);
		} else {
			event._triggered = null;
		}
	},
	async loseHp(event, trigger, player) {
		const { num } = event;
		if (event.num <= 0) {
			event._triggered = null;
			return;
		}

		if (lib.config.background_audio) {
			game.playAudio("effect", "loseHp");
		}
		game.broadcast(function () {
			if (lib.config.background_audio) {
				game.playAudio("effect", "loseHp");
			}
		});
		game.log(player, "失去了" + get.cnNumber(num) + "点体力");

		await player.changeHp(-num);

		if (player.hp <= 0 && !event.nodying) {
			await game.delayx();
			event._dyinged = true;
			await player.dying(event);
		}
	},
	async doubleDraw(event, trigger, player) {
		const result = await player.chooseBool("你的主副将体力上限之和是奇数，是否摸一张牌？").forResult();
		if (result.bool) {
			await player.draw();
		}
	},
	async loseMaxHp(event) {
		const { player, num } = event;
		game.log(player, "减少了" + get.cnNumber(num) + "点体力上限");
		player.maxHp -= num;
		if (isNaN(player.maxHp)) {
			player.maxHp = 0;
		}
		event.loseHp = Math.max(0, player.hp - player.maxHp);
		player.update();

		if (player.maxHp <= 0) {
			await player.die(event);
		}
	},
	async gainMaxHp(event) {
		const { player, num } = event;
		game.log(player, "增加了" + get.cnNumber(num) + "点体力上限");
		player.maxHp += num;
		player.update();
	},
	async changeHp(event) {
		let { player, num } = event;
		//add to GlobalHistory
		game.getGlobalHistory().changeHp.push(event);
		//changeHujia moved here
		if (num < 0 && player.hujia > 0 && event.getParent().name == "damage" && !player.hasSkillTag("nohujia") && !event.getParent().nohujia) {
			event.hujia = Math.min(-num, player.hujia);
			event.getParent().hujia = event.hujia;
			event.num += event.hujia;
			//log moved to changeHujia
			//game.log(player,'的护甲抵挡了'+get.cnNumber(event.hujia)+'点伤害');
			player.changeHujia(-event.hujia).type = "damage";
		}
		//old part
		num = event.num;
		player.hp += num;
		if (isNaN(player.hp)) {
			player.hp = 0;
		}
		if (player.hp > player.maxHp) {
			player.hp = player.maxHp;
		}
		player.update();
		if (event.popup !== false) {
			player.$damagepop(num, "water");
		}
		if (_status.dying.includes(player) && player.hp > 0) {
			_status.dying.remove(player);
			game.broadcast(function (list) {
				_status.dying = list;
			}, _status.dying);
			let evt = event.getParent("_save");
			if (evt && evt.finish) {
				evt.finish();
			}
			evt = event.getParent("dying");
			if (evt && evt.finish) {
				evt.finish();
			}
		}
		await event.trigger("changeHp");
	},
	async changeHujia(event) {
		const { player } = event;
		let { num } = event;
		if (num > 0) {
			game.log(player, "获得了" + get.cnNumber(num) + "点护甲");
		} else if (num < 0) {
			if (-num > player.hujia) {
				num = -player.hujia;
				event.num = num;
			}
			switch (
				event.type //log moved here
			) {
				case "damage":
					game.log(player, "的护甲抵挡了" + get.cnNumber(-num) + "点伤害");
					break;
				case "lose":
					game.log(player, "失去了" + get.cnNumber(-num) + "点护甲");
					break;
			}
		}
		player.hujia += num;
		//if(player.hujia<0){
		//	player.hujia=0;
		//}
		player.update();
	},
	dying: [
		async (event, trigger, player) => {
			event.forceDie = true;
			if (player.isDying() || player.hp > 0) {
				event.finish();
				return;
			}
			_status.dying.unshift(player);
			game.broadcast(function (list) {
				_status.dying = list;
			}, _status.dying);
			await event.trigger("dying");
			game.log(player, "濒死");
		},
		async (event, trigger, player) => {
			delete event.filterStop;
			if (player.hp > 0 || event.nodying) {
				_status.dying.remove(player);
				game.broadcast(function (list) {
					_status.dying = list;
				}, _status.dying);
				event.finish();
			} else if (!event.skipTao) {
				let start = false;
				const starts = [_status.currentPhase, event.source, event.player, game.me, game.players[0]];
				for (var i = 0; i < starts.length; i++) {
					if (get.itemtype(starts[i]) == "player" && game.players.concat(game.dead).includes(starts[i])) {
						start = game.players.slice().sortBySeat(starts[i]).find(i => !i.isOut());
						if (start) {
							break;
						}
					}
				}
				if (start) {
					const next = game.createEvent("_save");
					next.player = start;
					next._trigger = event;
					next.triggername = "_save";
					next.forceDie = true;
					next.setContent("_save");
					await next;
				}
			}
		},
		async (event, trigger, player) => {
			_status.dying.remove(player);
			game.broadcast(function (list) {
				_status.dying = list;
			}, _status.dying);
			if (player.hp <= 0 && !event.nodying && !player.nodying) {
				await player.die(event.reason);
			}
		},
	],
	die: [
		async (event, trigger, player) => {
			const { reason, source } = event;
			event.forceDie = true;
			//只有真正死亡才会影响每轮起始的角色（注意：不是每个模式都有这个属性，只有个别几个模式有，身份22斗地主都是判断的onround来决定是否进入下一轮）
			if (_status.roundStart == player && !event.reserveOut) {
				_status.roundStart = player.next || player.getNext() || game.players[0];
			}
			if (ui.land && ui.land.player == player) {
				game.addVideo("destroyLand");
				ui.land.destroy();
			}
			//因为隐匿等原因看不到武将牌的需要展示出来
			let unseen = false;
			if (player.classList.contains("unseen")) {
				player.classList.remove("unseen");
				unseen = true;
			}
			//加载侧边的历史记录栏关于这次死亡事件的信息
			const logvid = game.logv(player, "die", source);
			event.logvid = logvid;
			if (unseen) {
				player.classList.add("unseen");
			}
			if (source) {
				game.log(player, "被", source, "杀害");
				if (source.stat[source.stat.length - 1].kill == undefined) {
					source.stat[source.stat.length - 1].kill = 1;
				} else {
					source.stat[source.stat.length - 1].kill++;
				}
			} else {
				game.log(player, "阵亡");
			}

			/*player.removeEquipTrigger();
			for (const i in lib.skill.globalmap) {
				if (lib.skill.globalmap[i].includes(player)) {
					lib.skill.globalmap[i].remove(player);
					if (lib.skill.globalmap[i].length == 0 && !lib.skill[i].globalFixed) {
						game.removeGlobalSkill(i);
					}
				}
			}*/
			game.broadcastAll(function (player) {
				player.classList.add("dead");
				player.removeLink();
				player.classList.remove("turnedover");
				player.classList.remove("out");
				player.node.count.innerHTML = "0";
				player.node.hp.hide();
				player.node.equips.hide();
				player.node.count.hide();
				player.previous.next = player.next;
				player.next.previous = player.previous;
				game.players.remove(player);
				game.dead.push(player);
				_status.dying.remove(player);
			}, player);

			//是否播放阵亡语音
			if (!event.noDieAudio) {
				game.tryDieAudio(player);
			}
			//添加死亡动画（包括录像的）
			if (!event.reserveOut) {
				game.addVideo("diex", player);
				if (event.animate !== false) {
					player.$die(source);
				}
			}
			//将体力值修改为0
			/*if (event.reserveOut && !game.countPlayer()) {
				game.over();
			} else */
			if (player.hp != 0) {
				await player.changeHp(0 - player.hp, false).set("forceDie", true);
			}
		},
		async (event, trigger, player) => {
			const { source } = event;
			//是否执行展示身份牌和胜负判断的操作
			if (player.dieAfter && !event.reserveOut && !event.noDieAfter) {
				await player.dieAfter(source);
			}
		},
		async (event, trigger, player) => {
			game.callHook("checkDie", [event, player]);
			await event.trigger("die");
		},
		async (event, trigger, player) => {
			const { reason, source } = event;
			if (player.isDead()) {
				// || event.reserveOut
				//死亡移除武将牌的标记显示，有些不想移除的可以放进excludeMark排除（比如十常侍的常侍标记）
				if (!game.reserveDead) {
					const exclude = event.excludeMark;
					for (const mark in player.marks) {
						if (exclude.includes(mark)) {
							continue;
						}
						player.unmarkSkill(mark);
					}
					let count = 1;
					const list = Array.from(player.node.marks.childNodes);
					count += exclude.filter(name => list.some(i => i.name == name)).length;
					const func = function (player, count, exclude) {
						while (player.node.marks.childNodes.length > count) {
							let node = player.node.marks.lastChild;
							if (exclude.includes(node.name)) {
								node = node.previousSibling;
							}
							node.remove();
						}
					};
					func(player, count, exclude);
					game.broadcast(
						function (func, player, count, exclude) {
							func(player, count, exclude);
						},
						func,
						player,
						count,
						exclude
					);
					player.removeTip();
				}
				//移除临时技能
				for (const i in player.tempSkills) {
					player.removeSkill(i);
				}
				const skills = player.getSkills();
				for (let i = 0; i < skills.length; i++) {
					if (lib.skill[skills[i]].temp) {
						player.removeSkill(skills[i]);
					}
				}
				//武将牌返回武将牌堆
				if (_status.characterlist && !event.reserveOut) {
					if (lib.character[player.name] && !player.name.startsWith("gz_shibing") && !player.name.startsWith("gz_jun_")) {
						_status.characterlist.add(player.name);
					}
					if (lib.character[player.name1] && !player.name1.startsWith("gz_shibing") && !player.name1.startsWith("gz_jun_")) {
						_status.characterlist.add(player.name1);
					}
					if (lib.character[player.name2] && !player.name2.startsWith("gz_shibing") && !player.name2.startsWith("gz_jun_")) {
						_status.characterlist.add(player.name2);
					}
				}
				//死亡弃置所有牌包括s和x区域的
				event.cards = player.getCards("hejsx");
				if (event.cards.length) {
					await player.discard(event.cards).set("forceDie", true);
					//player.$throw(event.cards,1000);
				}
			}
		},
		async (event, trigger, player) => {
			const { source } = event;
			//是否执行击杀奖惩的操作
			if (player.dieAfter2 && !event.reserveOut && !event.noDieAfter2) {
				await player.dieAfter2(source);
			}
		},
		async (event, trigger, player) => {
			const { reason, source } = event;
			if (!event.reserveOut) {
				//真正的死亡才会显示再战那些按钮，以及隐藏一些按钮什么的
				game.broadcastAll(function (player) {
					if (game.online && player == game.me && !_status.over && !game.controlOver && !ui.exit) {
						if (lib.mode[lib.configOL.mode].config.dierestart) {
							ui.create.exit();
						}
					}
				}, player);
				if (!_status.connectMode && player == game.me && !_status.over && !game.controlOver) {
					ui.control.show();
					if (get.config("revive") && lib.mode[lib.config.mode].config.revive && !ui.revive) {
						ui.revive = ui.create.control("revive", ui.click.dierevive);
					}
					if (
						get.config("continue_game") &&
						!ui.continue_game &&
						lib.mode[lib.config.mode].config.continue_game &&
						!_status.brawl &&
						!game.no_continue_game
					) {
						ui.continue_game = ui.create.control("再战", game.reloadCurrent);
					}
					if (get.config("dierestart") && lib.mode[lib.config.mode].config.dierestart && !ui.restart) {
						ui.restart = ui.create.control("restart", game.reload);
					}
				}

				if (!_status.connectMode && player == game.me && !game.modeSwapPlayer) {
					// _status.auto=false;
					if (ui.auto) {
						// ui.auto.classList.remove('glow');
						ui.auto.hide();
					}
					if (ui.wuxie) {
						ui.wuxie.hide();
					}
				}

				if (typeof _status.coin == "number" && source && !_status.auto) {
					if (source == game.me || source.isUnderControl()) {
						_status.coin += 10;
					}
				}
			}
			if (source && lib.config.border_style == "auto" && (lib.config.autoborder_count == "kill" || lib.config.autoborder_count == "mix")) {
				switch (source.node.framebg.dataset.auto) {
					case "gold":
					case "silver":
						source.node.framebg.dataset.auto = "gold";
						break;
					case "bronze":
						source.node.framebg.dataset.auto = "silver";
						break;
					default:
						source.node.framebg.dataset.auto = lib.config.autoborder_start || "bronze";
				}
				if (lib.config.autoborder_count == "kill") {
					source.node.framebg.dataset.decoration = source.node.framebg.dataset.auto;
				} else {
					let dnum = 0;
					for (let j = 0; j < source.stat.length; j++) {
						if (source.stat[j].damage != undefined) {
							dnum += source.stat[j].damage;
						}
					}
					source.node.framebg.dataset.decoration = "";
					switch (source.node.framebg.dataset.auto) {
						case "bronze":
							if (dnum >= 4) {
								source.node.framebg.dataset.decoration = "bronze";
							}
							break;
						case "silver":
							if (dnum >= 8) {
								source.node.framebg.dataset.decoration = "silver";
							}
							break;
						case "gold":
							if (dnum >= 12) {
								source.node.framebg.dataset.decoration = "gold";
							}
							break;
					}
				}
				source.classList.add("topcount");
			}
		},
	],
	//进入休整状态
	async rest(event, trigger, player) {
		const { type = "phase", count = -1 } = event.restMap; //, audio
		if (_status._rest_return?.[player.playerid]) {
			return;
		}
		/*if (audio) {
			game.broadcastAll(function (audio) {
				if (lib.config.background_speak) {
					game.playAudio("die", audio);
				}
			}, audio);
		}*/

		game.log(player, "进入了修整状态");
		player.classList.remove("dead");
		game.dead.remove(player);
		game.players.add(player);
		game.arrangePlayers();
		game.broadcastAll(
			(id, type, count) => {
				_status._rest_return ??= {};
				_status._rest_return[id] = {
					type: type,
					count: count,
				};
			},
			player.playerid,
			type,
			count
		);
		player.markSkill("_rest_return");

		game.log(player, "移出了游戏");
		game.broadcastAll(function (player) {
			player.classList.add("out");
		}, player);
		player.addSkill("undist");

		await event.trigger("rest");
	},
	//结束休整状态
	async restEnd(event, trigger, player) {
		const { hp = player.maxHp } = event.restEndMap; //, audio
		if (!_status._rest_return?.[player.playerid]) {
			return;
		}
		/*if (typeof audio == "string") {
			game.broadcastAll(function (audio) {
				if (lib.config.background_speak) {
					game.playAudio("die", audio);
				}
			}, audio);
		}*/

		game.log(player, "结束了休整");
		game.broadcastAll(id => {
			delete _status._rest_return[id];
		}, player.playerid);
		player.unmarkSkill("_rest_return");

		game.log(player, "移回了游戏");
		game.broadcastAll(function (player) {
			player.classList.remove("out");
		}, player);
		player.removeSkill("undist");

		await player.reviveEvent(hp, false);
		await event.trigger("restEnd");
	},
	//复活事件
	async revive(event, trigger, player) {
		const { hp, log } = event;
		if (log !== false) {
			game.log(player, "复活");
		}
		game.broadcastAll(
			(player, hp) => {
				if (player.maxHp < 1) {
					player.maxHp = 1;
				}
				player.hp = hp;
				game.addVideo("revive", player);
				player.classList.remove("dead");
				player.removeAttribute("style");
				player.node.avatar.style.transform = "";
				player.node.avatar2.style.transform = "";
				player.node.hp.show();
				player.node.equips.show();
				player.node.count.show();
				player.update();
				let playerx;
				playerx = player.previousSeat;
				while (playerx.isDead()) {
					playerx = playerx.previousSeat;
				}
				playerx.next = player;
				player.previous = playerx;
				playerx = player.nextSeat;
				while (playerx.isDead()) {
					playerx = playerx.nextSeat;
				}
				playerx.previous = player;
				player.next = playerx;
				game.players.add(player);
				game.dead.remove(player);
				if (player == game.me) {
					if (ui.auto) {
						ui.auto.show();
					}
					if (ui.wuxie) {
						ui.wuxie.show();
					}
					if (ui.revive) {
						ui.revive.close();
						delete ui.revive;
					}
					if (ui.exit) {
						ui.exit.close();
						delete ui.exit;
					}
					if (ui.swap) {
						ui.swap.close();
						delete ui.swap;
					}
					if (ui.restart) {
						ui.restart.close();
						delete ui.restart;
					}
					if (ui.continue_game) {
						ui.continue_game.close();
						delete ui.continue_game;
					}
					if (player.node.dieidentity) {
						player.node.dieidentity.delete();
						delete player.node.dieidentity;
					}
				}
			},
			player,
			hp
		);
	},
	//暂时还是只能一次加一张牌，需要后续跟进处理
	//一次加一张够用了
	async addJudge(event, trigger, player) {
		let card, cardName;
		if (typeof event.card == "string") {
			cardName = event.card;
			card = get.autoViewAs({ name: cardName }, event.cards);
			event.card = card;
		} else {
			cardName = event.card.name;
			if (get.itemtype(event.card) === "card") {
				if (event.card.cardSymbol) {
					event.cards = event.card[event.card.cardSymbol].cards;
					if (!event.card.isViewAsCard) {
						event.card = event.card[event.card.cardSymbol];
					}
				} else {
					card = get.autoViewAs(event.card, void 0, false);
					event.card = card;
					event.cards = event.card.cards ?? [];
				}
			} else if (!event.card.cards?.length && event.cards?.length) {
				card = get.autoViewAs({ name: cardName, isCard: true }, event.cards);
				event.card = card;
			} else if (!event.cards) {
				event.cards = [];
			}
		}
		card = event.card;
		const cards = event.cards,
			cardInfo = lib.card[cardName],
			visible = cardInfo && !cardInfo.blankCard;
		event.visible = visible;
		//失去牌的一长串
		let loseCards = [];
		if (event.card.isViewAsCard) {
			loseCards.add(event.card);
		} else {
			loseCards.addArray(event.cards);
		}
		if (loseCards.length) {
			const map = {};
			for (const i of loseCards) {
				var owner = get.owner(i, "judge");
				if (owner /* && (owner != player || get.position(i) != "e")*/) {
					var id = owner.playerid;
					if (!map[id]) {
						map[id] = [[], [], []];
					}
					map[id][0].push(i);
					var position = get.position(i);
					if (position == "h") {
						map[id][1].push(i);
					} else {
						map[id][2].push(i);
					}
				} else if (!event.updatePile && get.position(i) == "c") {
					event.updatePile = true;
				}
				if (event.visible) {
					i.addKnower("everyone");
				}
			}
			event.losing_map = map;
			for (const i in map) {
				const owner = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				const next = owner.lose(map[i][0], ui.special).set("type", "addJudge").set("forceDie", true).set("getlx", false);
				if (event.visible == true) {
					// @ts-expect-error ignore
					next.visible = true;
				}
				await next;
				event.relatedLose = next;
			}
			let stop = false;
			const list = [];
			for (const cardx of loseCards) {
				if (cardx.willBeDestroyed("judge", player, event)) {
					cardx.selfDestroy(event);
					stop = true;
				} else if ("hejx".includes(get.position(cardx, true))) {
					stop = true;
				} else {
					list.add(cardx);
				}
			}
			if (stop) {
				if (list.length) {
					await game.cardsDiscard(list);
				}
				return;
			}
		}
		if (!cardInfo.effect && !cardInfo.noEffect) {
			if (event.cards.length) {
				await game.cardsDiscard(event.cards);
			}
			return;
		}
		game.broadcastAll(
			(player, card, cards) => {
				const cardsCloned = cards.filter(card => {
					return cards[0].clone && (cards[0].clone.parentNode == player.parentNode || cards[0].clone.parentNode == ui.arena);
				});
				if (cardsCloned.length) {
					cardsCloned.forEach(card => {
						card.clone.moveDelete(player);
					});
					game.addVideo("gain2", player, get.cardsInfo(cardsCloned));
				}
			},
			player,
			event.card,
			loseCards
		);
		player.addVirtualJudge(event.card, event.cards);
		const isViewAsCard = cards?.length !== 1 || cards[0].name !== card.name || !card.isCard;
		if (isViewAsCard && cards?.length) {
			if (cardInfo.blankCard) {
				game.log(player, '被扣置了<span class="yellowtext">' + get.translation(cardName) + "</span>");
			} else {
				game.log(player, '被贴上了<span class="yellowtext">' + get.translation(cardName) + "</span>（", cards, "）");
			}
		} else {
			game.log(player, "被贴上了", card);
		}
		if (get.itemtype(event.card) == "card") {
			event.card = event.card[event.card.cardSymbol];
		}
	},
	judge: [
		async (event, trigger, player) => {
			const judgestr = `${get.translation(player)}的${event.judgestr}判定`;
			event.videoId = lib.status.videoId++;
			let cardj = event.directresult;
			if (!cardj) {
				if (player.getTopCards) {
					cardj = player.getTopCards()[0];
				} else {
					cardj = get.cards()[0];
				}
			}
			if (!cardj) {
				event.finish();
				return;
			}
			let waiting;
			const owner = get.owner(cardj);
			if (owner) {
				waiting = owner.lose(cardj, "visible", ui.ordering);
			} else {
				const nextj = game.cardsGotoOrdering(cardj);
				if (event.position != ui.discardPile) {
					nextj.noOrdering = true;
				}
				waiting = nextj;
			}
			player.judging.unshift(cardj);
			game.addVideo("judge1", player, [get.cardInfo(player.judging[0]), judgestr, event.videoId]);
			game.broadcastAll(
				function (player, card, str, id, cardid) {
					var event;
					if (game.online) {
						event = {};
					} else {
						event = _status.event;
					}
					if (game.chess) {
						event.node = card.copy("thrown", "center", ui.arena).addTempClass("start");
					} else {
						event.node = player.$throwordered(card.copy(), true);
					}
					if (lib.cardOL) {
						lib.cardOL[cardid] = event.node;
					}
					event.node.cardid = cardid;
					event.node.classList.add("thrownhighlight");
					ui.arena.classList.add("thrownhighlight");
					event.dialog = ui.create.dialog(str);
					event.dialog.classList.add("center");
					event.dialog.videoId = id;
				},
				player,
				player.judging[0],
				judgestr,
				event.videoId,
				get.id()
			);

			game.log(player, "进行" + event.judgestr + "判定，亮出的判定牌为", player.judging[0]);
			await game.delay(2);
			if (!event.noJudgeTrigger) {
				await event.trigger("judge");
			}
			return waiting.forResult();
		},
		async (event, trigger, player) => {
			event.result = {
				card: player.judging[0],
				name: player.judging[0].name,
				number: get.number(player.judging[0]),
				suit: get.suit(player.judging[0]),
				color: get.color(player.judging[0]),
				node: event.node,
			};
			if (event.fixedResult) {
				for (var i in event.fixedResult) {
					event.result[i] = event.fixedResult[i];
				}
			}
			event.result.judge = event.judge(event.result);
			if (event.result.judge > 0) {
				event.result.bool = true;
			} else if (event.result.judge < 0) {
				event.result.bool = false;
			} else {
				event.result.bool = null;
			}
			player.judging.shift();
			game.checkMod(player, event.result, "judge", player);
			if (event.judge2) {
				var judge2 = event.judge2(event.result);
				if (typeof judge2 == "boolean") {
					player.tryJudgeAnimate(judge2);
				}
			}
			if (event.clearArena != false) {
				game.broadcastAll(ui.clear);
			}
			game.broadcast(function (id) {
				var dialog = get.idDialog(id);
				if (dialog) {
					dialog.close();
				}
				ui.arena.classList.remove("thrownhighlight");
			}, event.videoId);
			event.dialog.close();
			game.addVideo("judge2", null, event.videoId);
			ui.arena.classList.remove("thrownhighlight");
			game.log(player, "的判定结果为", event.result.card);
			const triggerFixing = event.trigger("judgeFixing");
			let callback = null;
			if (event.callback) {
				const next = game.createEvent("judgeCallback", false);
				next.player = player;
				next.card = event.result.card;
				next.judgeResult = get.copy(event.result);
				next.setContent(event.callback);
				callback = next;
			} else {
				if (!get.owner(event.result.card)) {
					if (event.position != ui.discardPile) {
						event.position.appendChild(event.result.card);
					}
				}
			}
			await triggerFixing;
			if (event.next.includes(callback)) {
				await callback;
			}
		},
	],
	async turnOver(event) {
		const { player } = event;

		game.log(player, "翻面");
		game.broadcastAll(player => player.classList.toggle("turnedover"), player);
		game.addVideo("turnOver", player, player.classList.contains("turnedover"));
	},
	async link(event) {
		const { player } = event;

		const isLinked = player.isLinked();
		game.log(player, (isLinked ? "解除" : "被") + "连环");
		game.broadcastAll(
			(player, isLinked) => {
				if (lib.config.background_audio) {
					game.playAudio("effect", "link" + (isLinked ? "_clear" : ""));
				}
				player.classList.remove("target");
				player.classList.toggle(get.is.linked2(player) ? "linked2" : "linked");
				ui.updatej(player);
				ui.updatem(player);
			},
			player,
			isLinked
		);
		game.addVideo("link", player, player.isLinked());
	},
	async chooseToGuanxing(event, trigger, player) {
		const cards = get.cards(event.num);
		await game.cardsGotoOrdering(cards);
		const next = player.chooseToMove("allowChooseAll");
		next.set("forceDie", event.forceDie);
		next.set("includeOut", event.includeOut);
		next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
		next.set("prompt", event.prompt || "点击或拖动将牌移动到牌堆顶或牌堆底");
		next.processAI =
			event.processAI ||
			function (list) {
				let cards = list[0][1],
					player = _status.event.player,
					target = _status.currentPhase || player,
					name = _status.event.getTrigger()?.name,
					countWuxie = current => {
						let num = current.getKnownCards(player, card => {
							return get.name(card, current) === "wuxie";
						});
						if (num && current !== player) {
							return num;
						}
						let skills = current.getSkills("invisible").concat(lib.skill.global);
						game.expandSkills(skills);
						for (let i = 0; i < skills.length; i++) {
							let ifo = get.info(skills[i]);
							if (!ifo) {
								continue;
							}
							if (ifo.viewAs && typeof ifo.viewAs != "function" && ifo.viewAs.name == "wuxie") {
								if (!ifo.viewAsFilter || ifo.viewAsFilter(current)) {
									num++;
									break;
								}
							} else {
								let hiddenCard = ifo.hiddenCard;
								if (typeof hiddenCard == "function" && hiddenCard(current, "wuxie")) {
									num++;
									break;
								}
							}
						}
						return num;
					},
					top = [];
				switch (name) {
					case "phaseJieshu":
						target = target.next;
					// [falls through]
					case "phaseZhunbei": {
						let att = get.sgn(get.attitude(player, target)),
							judges = target.getCards("j"),
							needs = 0,
							wuxie = countWuxie(target);
						for (let i = Math.min(cards.length, judges.length) - 1; i >= 0; i--) {
							let j = judges[i],
								cardj = j.viewAs ? { name: j.viewAs, cards: j.cards || [j] } : j;
							if (wuxie > 0 && get.effect(target, j, target, target) < 0) {
								wuxie--;
								continue;
							}
							let judge = get.judge(j);
							cards.sort((a, b) => {
								return (judge(b) - judge(a)) * att;
							});
							if (judge(cards[0]) * att < 0) {
								needs++;
								continue;
							} else {
								top.unshift(cards.shift());
							}
						}
						if (needs > 0 && needs >= judges.length) {
							return [top, cards];
						}
						cards.sort((a, b) => {
							return (get.value(b, target) - get.value(a, target)) * att;
						});
						while (needs--) {
							top.unshift(cards.shift());
						}
						while (cards.length) {
							if (get.value(cards[0], target) > 6 == att > 0) {
								top.push(cards.shift());
							} else {
								break;
							}
						}
						return [top, cards];
					}
					default:
						cards.sort((a, b) => {
							return get.value(b, target) - get.value(a, target);
						});
						while (cards.length) {
							if (get.value(cards[0], target) > 6) {
								top.push(cards.shift());
							} else {
								break;
							}
						}
						return [top, cards];
				}
			};
		const result = await next.forResult();
		const top = result?.moved?.[0] || [];
		const bottom = result?.moved?.[1] || [];
		top.reverse();
		await game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event, card) => {
			if (event.top_cards.includes(card)) {
				return ui.cardPile.firstChild;
			}
			return null;
		});
		game.addCardKnower(top, player);
		game.addCardKnower(bottom, player);
		event.result = {
			bool: true,
			moved: [top, bottom],
		};
		player.popup(`${get.cnNumber(top.length)}上${get.cnNumber(bottom.length)}下`);
		game.log(player, `将${get.cnNumber(top.length)}张牌置于牌堆顶`);
		await game.delayx();
	},
	async chooseToMove_new(event, trigger, player) {
		//联机时间
		if (player.isUnderControl()) {
			game.swapPlayerAuto(player);
		}
		if (event.chooseTime && _status.connectMode && !game.online) {
			event.time = lib.configOL.choose_timeout;
			game.broadcastAll(function (time) {
				lib.configOL.choose_timeout = time;
			}, event.chooseTime);
		}

		/** @type {Partial<Result>} */
		let result;
		if (event.isMine()) {
			const { promise, resolve } = Promise.withResolvers();
			const animationDuration = lib.config.animation_choose_to_move ? 300 : 0;
			//自动选择
			event.switchToAuto = function () {
				if (!event.filterOk(event.moved)) {
					if (!event.forced) {
						event._result = { bool: false };
					} else {
						event._result = "ai";
					}
				} else {
					event._result = {
						bool: true,
						moved: event.moved,
					};
				}
				event.dialog.close();
				if (ui.confirm) {
					ui.confirm.close();
				}
				game.resume();
				_status.imchoosing = false;
				setTimeout(function () {
					ui.arena.classList.remove("choose-to-move");
				}, 500);
			};
			//创造dialog
			event.dialog = ui.create.dialog();
			event.dialog.addNewRow(event.prompt || "请选择要操作的牌");
			event.dialog.selectedCard = null;
			event.dialog.isBusy = false;
			event.dialog.classList.add("scroll1");
			event.dialog.classList.add("scroll2");
			event.dialog.classList.add("fullwidth");
			if (get.is.phoneLayout() || event.list.length > 2) {
				ui.arena.classList.add("choose-to-move");
				event.dialog.classList.add("fullheight");
			}
			//刷新，确认是否返回结果
			function updateButtons() {
				event.moved = Array.from({
					length: event.list.slice().reduce((sum, currentList) => {
						if (!Array.isArray(currentList[0])) {
							currentList = [currentList];
						}
						return (sum += currentList.length);
					}, 0),
				}).map((_, i) => {
					const num = 2 * (i + 1);
					return Array.from(event.dialog.itemContainers[num].children).map(e => e.link);
				});
				if (event.filterOk(event.moved)) {
					ui.create.confirm("o");
				} else {
					if (!event.forced) {
						ui.create.confirm("c");
					} else if (ui.confirm) {
						ui.confirm.close();
					}
				}
			}
			//点击每个卡的事件
			function clickItem(card, container, allContainers) {
				if (event.dialog.isBusy) {
					return;
				}
				if (event.dialog.selectedCard) {
					if (card !== event.dialog.selectedCard && event.filterMove(event.dialog.selectedCard, card, event.moved)) {
						event.dialog.isBusy = true;
						game.$swapElement(card, event.dialog.selectedCard, animationDuration).then(() => {
							event.dialog.isBusy = false;
							updateButtons();
						});
					}
					event.dialog.selectedCard.classList.remove("selected");
					event.dialog.selectedCard = null;
				} else {
					event.dialog.selectedCard = card;
					card.classList.add("selected");
				}
			}
			//点击容器的事件回调
			function clickItemContainer(itemContainer, i, allContainers) {
				if (event.dialog.isBusy || !event.dialog.selectedCard) {
					return;
				}
				if (itemContainer.contains(event.dialog.selectedCard)) {
					return;
				}
				let index = Array.from(event.dialog.itemContainers).indexOf(itemContainer) / 2 - 1;
				if (event.filterMove(event.dialog.selectedCard, index, event.moved)) {
					event.dialog.isBusy = true;
					game.$elementGoto(event.dialog.selectedCard, itemContainer, undefined, animationDuration).then(() => {
						event.dialog.isBusy = false;
						updateButtons();
					});
				}
				event.dialog.selectedCard.classList.remove("selected");
				event.dialog.selectedCard = null;
			}
			//框的部分属性
			let itemContainerCss = event.itemContainerCss || {
				justifyContent: "center",
				minHeight: "100px",
			};
			for (let i = 0; i < event.list.length; i++) {
				let currentList = event.list[i].slice();
				if (!Array.isArray(currentList[0])) {
					currentList = [currentList];
				}
				event.dialog.addNewRow(
					...currentList
						.slice()
						.map(listx => {
							return [
								{ item: listx[0], ratio: 1 },
								listx[1]?.length
									? { item: listx[1], ratio: 6 / currentList.length, itemContainerCss, clickItem, clickItemContainer }
									: { item: listx[1], ratio: 6 / currentList.length, itemContainerCss, clickItemContainer },
							];
						})
						.flat()
				);
			}
			event.dialog.open();
			updateButtons();
			//获取结果
			event.custom.replace.confirm = function (bool) {
				let result;
				if (bool) {
					result = {
						bool: true,
						moved: event.moved,
					};
				} else {
					result = { bool: false };
				}
				event.dialog.close();
				if (ui.confirm) {
					ui.confirm.close();
				}
				_status.imchoosing = false;
				setTimeout(function () {
					ui.arena.classList.remove("choose-to-move");
				}, 500);
				resolve(result);
			};
			//开搞
			game.countChoose();
			event.choosing = true;
			result = await promise;
		} else if (event.isOnline()) {
			result = await event.sendAsync();
		} else {
			result = "ai";
		}
		//时间限制
		if (event.time) {
			game.broadcastAll(function (time) {
				lib.configOL.choose_timeout = time;
			}, event.time);
		}
		//结果获取
		if ((!result || result == "ai" || (event.forced && !result.bool)) && event.processAI) {
			const moved = event.processAI(event.list);
			if (moved) {
				result = {
					bool: true,
					moved: moved,
				};
			} else {
				result = { bool: false };
			}
		}
		event.result = result;
	},
};
