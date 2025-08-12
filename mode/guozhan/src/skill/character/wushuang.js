import { lib, game, ui, get as _get, ai, _status } from "../../../../../noname.js";
import { cast } from "../../../../../noname/util/index.js";
import { GetGuozhan } from "../../patch/get.js";
import { PlayerGuozhan } from "../../patch/player.js";

/** @type {GetGuozhan}  */
const get = cast(_get);

/** @type {Record<string, Skill>} */
export default {
	//张媱
	gz_yuanyu: {
		audio: "yuanyu",
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			await player.draw();
			if (player.countCards("h") > 0) {
				const result = await player
					.chooseCard("怨语：将一张手牌当作“怨”置于武将牌上", "h", true)
					.set("ai", card => {
						const player = get.player(),
							cards = player.getExpansions("gz_yuanyu");
						if (cards?.length && cards.some(cardx => get.color(cardx) == get.color(card))) {
							return 5 - get.value(card);
						}
						return 8 - get.value(card);
					})
					.forResult();
				const gainEvent = player.addToExpansion(result.cards, player, "give");
				gainEvent.gaintag.add("gz_yuanyu");
				await gainEvent;
			}
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
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	gz_xiyan: {
		audio: "xiyan",
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (!event.card || !player.countExpansions("gz_yuanyu")) {
				return false;
			}
			return event.source?.isIn() && player.getExpansions("gz_yuanyu").some(card => {
				return get.color(card) == get.color(event.card);
			});
		},
		logTarget: "source",
		check(event, player) {
			return get.attitude(player, event.source) <= 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.chooseControl()
				.set("choiceList", [
					"本回合手牌上限-4",
					"本回合不能使用基本牌",
				])
				.set("prompt", "夕颜：请选择一项")
				.set("ai", () => {
					const player = get.player();
					if (player.hasSkill("gz_xiyan_basic")) {
						return 1;
					}
					if (player.countCards("h", card => {
						return get.type(card) == "basic" && player.hasValueTarget(card);
					}) >= (player.countCards("h") / 2)) {
						return 0;
					}
					return 1;
				})
				.forResult();
			if (result.index == 0) {
				target.addTempSkill("gz_xiyan_limit");
				target.addMark("gz_xiyan_limit", 4, false);
			} else {
				target.addTempSkill("gz_xiyan_basic");
			}
		},
		subSkill: {
			limit: {
				intro: { content: "本回合手牌上限-#" },
				onremove: true,
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("gz_xiyan_limit");
					},
				},
			},
			basic: {
				intro: { content: "本回合不能使用基本牌" },
				mark: true,
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						if (get.type(card) == "basic") {
							return false;
						}
					},
					cardSavable(card, player) {
						if (get.type(card) == "basic") {
							return false;
						}
					},
				},
			},
		},
	},
	//曹纯
	gz_shanjia: {
		audio: "shanjia",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			const num = game.countPlayer(current => current.isFriendOf(player));
			return num > 0;
		},
		frequent: true,
		async content(event, trigger, player) {
			const num = game.countPlayer(current => current.isFriendOf(player));
			await player.draw(num);
			const result = await player
				.chooseToDiscard("he", true)
				.set("ai", card => {
					if (get.type(card) == "equip") {
						return 10 - get.value(card);
					}
					return 7 - get.value(card);
				})
				.forResult();
			if (result.bool && get.type(result.cards[0]) == "equip") {
				const card = new lib.element.VCard({ name: "sha" });
				if (player.hasUseTarget(card)) {
					await player.chooseUseTarget(card, true, false);
				}
			}
		},
	},
	//糜竺
	gz_ziyuan: {
		audio: "ziyuan",
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			let num = 0;
			for (let i = 0; i < ui.selected.cards.length; i++) {
				num += get.number(ui.selected.cards[i]);
			}
			return get.number(card) + num <= 13;
		},
		complexCard: true,
		selectCard() {
			let num = 0;
			for (let i = 0; i < ui.selected.cards.length; i++) {
				num += get.number(ui.selected.cards[i]);
			}
			if (num == 13) {
				return ui.selected.cards.length;
			}
			return ui.selected.cards.length + 2;
		},
		discard: false,
		lose: false,
		delay: false,
		filterTarget(card, player, target) {
			return player != target && target.isFriendOf(player);
		},
		check(card) {
			let num = 0;
			for (let i = 0; i < ui.selected.cards.length; i++) {
				num += get.number(ui.selected.cards[i]);
			}
			if (num + get.number(card) == 13) {
				return 9 - get.value(card);
			}
			if (ui.selected.cards.length == 0) {
				let cards = _status.event.player.getCards("h");
				for (let i = 0; i < cards.length; i++) {
					for (let j = i + 1; j < cards.length; j++) {
						if (cards[i].number + cards[j].number == 13) {
							if (cards[i] == card || cards[j] == card) {
								return 8.5 - get.value(card);
							}
						}
					}
				}
			}
			return 0;
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			await player.showCards(cards, `${get.translation(player)}发动了【资援】`);
			await player.give(cards, target, true);
			await target.recover();
		},
		ai: {
			order(skill, player) {
				if (
					game.hasPlayer(function (current) {
						return current.hp < current.maxHp && current != player && get.recoverEffect(current, player, player) > 0;
					})
				) {
					return 10;
				}
				return 1;
			},
			result: {
				player(player, target) {
					if (get.attitude(player, target) < 0) {
						return -1;
					}
					let eff = get.recoverEffect(target, player, player);
					if (eff < 0) {
						return 0;
					}
					if (eff > 0) {
						if (target.hp == 1) {
							return 3;
						}
						return 2;
					}
					if (player.needsToDiscard()) {
						return 1;
					}
					return 0;
				},
			},
			threaten: 1.3,
		},
	},
	gz_jugu: {
		audio: "jugu",
		trigger: {
			player: "showCharacterAfter",
		},
		forced: true,
		filter(event, player) {
			return event.toShow.some(name => {
				return get.character(name, 3).includes("gz_jugu");
			});
		},
		async content(event, trigger, player) {
			await player.draw(player.maxHp);
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.maxHp;
			},
		},
	},
	//群张郃
	gz_zhilve: {
		audio: "zhilve",
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				var list = ["移动场上的一张牌", "摸一张牌并视为使用一张【杀】"];
				var choiceList = ui.create.dialog("知略：失去1点体力并选择一项", "forcebutton", "hidden");
				choiceList.add([
					list.map((item, i) => {
						return [i, item];
					}),
					"textbutton",
				]);
				return choiceList;
			},
			filter(button, player) {
				if (button.link == 0) {
					return player.canMoveCard();
				}
				return player.hasUseTarget({ name: "sha", isCard: true }, false);
			},
			check(button) {
				return button.link;
			},
			backup(links) {
				if (links[0] == 1) {
					return {
						audio: "gz_zhilve",
						async content(event, trigger, player) {
							await player.loseHp();
							player.addTempSkill("gz_zhilve_limit");
							player.addMark("gz_zhilve_limit", 1, false);
							await player.draw();
							const card = new lib.element.VCard({ name: "sha" });
							if (player.hasUseTarget(card, false)) {
								await player.chooseUseTarget(card, true, false, "nodistance");
							}
						},
					};
				} else {
					return { 
						audio: "gz_zhilve",
						async content(event, trigger, player) {
							await player.loseHp();
							player.addTempSkill("gz_zhilve_limit");
							player.addMark("gz_zhilve_limit", 1, false);
							if (player.canMoveCard()) {
								await player.moveCard(true);
							}
						},
					};
				}
			},
			prompt() {
				return "请选择【杀】的目标";
			},
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }) + 0.1;
			},
			result: {
				player(player) {
					if (player.hp > 2 && player.hasValueTarget({ name: "sha" })) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			backup: {},
			limit: {
				intro: { content: "本回合手牌上限+#" },
				onremove: true,
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("gz_zhilve_limit");
					},
				},
			},
		},
	},
	//十常侍
	gz_danggu: {
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		derivation: ["gz_taoluan", "gz_chiyan", "gz_zimou", "gz_picai", "gz_yaozhuo", "gz_xiaolu", "gz_kuiji", "gz_chihe", "gz_niqu", "gz_miaoyu"],
		forced: true,
		unique: true,
		onremove(player) {
			delete player.storage.gz_danggu;
			delete player.storage.gz_danggu_current;
			player.changeSkin("gz_mowang", "gz_shichangshi");
		},
		changshi: [
			["gz_scs_zhangrang", "gz_taoluan"],
			["gz_scs_zhaozhong", "gz_chiyan"],
			["gz_scs_sunzhang", "gz_zimou"],
			["gz_scs_bilan", "gz_picai"],
			["gz_scs_xiayun", "gz_yaozhuo"],
			["gz_scs_hankui", "gz_xiaolu"],
			["gz_scs_lisong", "gz_kuiji"],
			["gz_scs_duangui", "gz_chihe"],
			["gz_scs_guosheng", "gz_niqu"],
			["gz_scs_gaowang", "gz_miaoyu"],
		],
		async content(event, trigger, player) {
			const list = lib.skill.gz_danggu.changshi.map(i => i[0]);
			player.markAuto("gz_danggu", list);
			game.broadcastAll(
				function (player, list) {
					const cards = [];
					for (let i = 0; i < list.length; i++) {
						const cardname = "huashen_card_" + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: "character/" + list[i].slice(3),
						};
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, "", ""));
					}
					player.$draw(cards, "nobroadcast");
				},
				player,
				list
			);
			const next = game.createEvent("gz_danggu_clique");
			next.player = player;
			next.setContent(lib.skill.gz_danggu.contentx);
			await next;
		},
		async contentx(event, trigger, player) {
			let list = player.getStorage("gz_danggu").slice();
			const result = list.length == 1 ? {
				bool: true,
				links: list,
			} : await player
					.chooseButton(["党锢：请选择亮出常侍", [list, "character"]], true)
					.set("ai", button => Math.random() * 10)
					.forResult();
			if (result?.bool) {
				const changshis = result.links;
				const skills = [];
				const map = get.info("gz_danggu").changshi;
				player.unmarkAuto("gz_danggu", changshis);
				player.storage.gz_danggu_current = changshis;
				for (const changshi of changshis) {
					for (const cs of map) {
						if (changshi == cs[0]) {
							skills.push(cs[1]);
						}
					}
				}
				game.broadcastAll((player, name) => {
					if (player.name1 == "gz_shichangshi") {
						player.node.name.innerHTML = get.slimName(name);
					}
					if (player.name2 == "gz_shichangshi") {
						player.node.name2.innerHTML = get.slimName(name);
					}
				}, player, changshis[0]);
				player.changeSkin("gz_mowang", changshis[0]);
				game.log(player, "选择了常侍", "#y" + get.translation(changshis));
				if (skills.length) {
					player.addAdditionalSkill("gz_danggu", skills);
					let str = "";
					for (const i of skills) {
						str += "【" + get.translation(i) + "】、";
						player.popup(i);
					}
					str = str.slice(0, -1);
					game.log(player, "获得了技能", "#g" + str);
				}
			}
		},
		mod: {
			aiValue(player, card, num) {
				if (["shan", "tao", "wuxie", "caochuan"].includes(card.name)) {
					return num / 10;
				}
			},
			aiUseful() {
				return lib.skill.gz_danggu.mod.aiValue.apply(this, arguments);
			},
		},
		ai: {
			combo: "gz_mowang",
			nokeep: true,
			mingzhi_yes: true,
			skillTagFilter(player, tag) {
				if (tag !== "mingzhi_yes") {
					return true;
				}
				const event = _status.event;
				return event?.name === "_mingzhi2" && event._trigger?.skill === "gz_danggu";
			},
		},
		intro: {
			mark(dialog, storage, player) {
				dialog.addText("剩余常侍");
				dialog.addSmall([storage, "character"]);
				if (player.storage.gz_danggu_current && player.isIn()) {
					dialog.addText("当前常侍");
					dialog.addSmall([player.storage.gz_danggu_current, "character"]);
				}
			},
		},
	},
	gz_mowang: {
		trigger: {
			player: ["dieBefore", "rest"],
		},
		filter(event, player, name) {
			if (name == "rest") {
				return true;
			}
			return event.getParent().name != "giveup" && player.maxHp > 0;
		},
		derivation: "mbmowang_faq",
		forced: true,
		forceDie: true,
		forceOut: true,
		direct: true,
		priority: 15,
		group: ["gz_mowang_die", "gz_mowang_return"],
		async content(event, trigger, player) {
			if (event.triggername == "rest") {
				if (player.name1 == "gz_shichangshi") {
					player.changeSkin("gz_mowang", `${player.skin.name}_dead`);
				}
				if (player.name2 == "gz_shichangshi") {
					player.changeSkin("gz_mowang", `${player.skin.name2}_dead`);
				}
				return;
			}
			if (_status._rest_return?.[player.playerid]) {
				trigger.cancel();
			} else {
				if (player.getStorage("gz_danggu").length) {
					player.logSkill("gz_mowang");
					trigger.restMap = {
						type: "round",
						count: 1,
						audio: "shichangshiRest",
					};
					trigger.excludeMark.add("gz_danggu");
					trigger.includeOut = true;
				} else {
					game.broadcastAll(player => {
						if (player.name1 == "gz_shichangshi") {
							player.node.name.innerHTML = get.slimName(player.name1);
						}
						if (player.name2 == "gz_shichangshi") {
							player.node.name2.innerHTML = get.slimName(player.name2);
						}
					}, player);
					player.changeSkin("gz_mowang", "gz_shichangshi_dead");
				}
			}
		},
		ai: {
			combo: "gz_danggu",
			neg: true,
		},
		subSkill: {
			die: {
				audio: "gz_mowang",
				trigger: { player: "phaseAfter" },
				forced: true,
				forceDie: true,
				async content(event, trigger, player) {
					if (!player.getStorage("gz_danggu").length) {
						game.broadcastAll(player => {
							if (player.name1 == "gz_shichangshi") {
								player.node.name.innerHTML = get.slimName(player.name1);
							}
							if (player.name2 == "gz_shichangshi") {
								player.node.name2.innerHTML = get.slimName(player.name2);
							}
						}, player);
						player.changeSkin("gz_mowang", "gz_shichangshi");
						await game.delay();
					}
					await player.die();
				},
			},
			return: {
				trigger: { player: "restEnd" },
				forced: true,
				charlotte: true,
				silent: true,
				forceDie: true,
				forceOut: true,
				filter(event, player) {
					return event.player == player && player.hasSkill("gz_danggu", null, null, false);
				},
				async content(event, trigger, player) {
					game.broadcastAll(player => {
						if (player.name1 == "gz_shichangshi") {
							player.node.name.innerHTML = get.slimName(player.name1);
						}
						if (player.name2 == "gz_shichangshi") {
							player.node.name2.innerHTML = get.slimName(player.name2);
						}
					}, player);
					player.changeSkin("gz_mowang", "gz_shichangshi");
					delete player.storage.gz_danggu_current;
					const next = game.createEvent("gz_danggu_clique");
					next.player = player;
					next.setContent(lib.skill.gz_danggu.contentx);
					await next;
					await player.draw();
				},
			},
		},
	},
	gz_taoluan: {
		audio: "scstaoluan",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("hes") > 0;
		},
		chooseButton: {
			dialog(event, player) {
				let list = [];
				for (let i = 0; i < lib.inpile.length; i++) {
					let name = lib.inpile[i];
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (let j of lib.inpile_nature) {
							list.push(["基本", "", "sha", j]);
						}
					} else if (get.type(name) == "trick") {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic") {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("滔乱", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				let player = _status.event.player;
				if (player.countCards("hs", button.link[2]) > 0) {
					return 0;
				}
				if (button.link[2] == "wugu") {
					return;
				}
				let effect = player.getUseValue(button.link[2]);
				if (effect > 0) {
					return effect;
				}
				return 0;
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "gz_taoluan",
					selectCard: 1,
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 4,
			result: {
				player: 1,
			},
			threaten: 1.9,
		},
		subSkill: { backup: {} },
	},
	gz_chiyan: {
		audio: "scschiyan",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.target.countCards("he") && player.countCards("he");
		},
		logTarget: "target",
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		async content(event, trigger, player) {
			for (const target of [player, trigger.target].sortBySeat()) {
				if (!target.isIn() || !target.countCards("he")) {
					continue;
				}
				const { result } = await target.chooseCard("鸱咽：将任意张牌置于武将牌上直到回合结束", [1, Infinity], true, "he").set("ai", card => {
					const player = get.player();
					if (ui.selected.cards.length) {
						return 0;
					}
					return 6 - get.value(card);
				});
				if (result?.bool && result?.cards?.length) {
					target.addSkill(event.name + "_gain");
					const next = target.addToExpansion("giveAuto", result.cards, target);
					next.gaintag.add(event.name + "_gain");
					await next;
				}
			}
			const { target } = trigger;
			if (target.countCards("h") <= player.countCards("h")) {
				target.addTempSkill(event.name + "_damage");
			}
			if (target.countCards("h") >= player.countCards("h")) {
				target.addTempSkill(event.name + "_effect");
			}
		},
		subSkill: {
			gain: {
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.countExpansions("gz_chiyan_gain");
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions(event.name);
					await player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“鸱咽”牌");
					player.removeSkill(event.name);
				},
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						var cards = player.getExpansions("gz_chiyan_gain");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
			},
			damage: {
				charlotte: true,
				trigger: { player: "damageBegin3" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num++;
				},
				mark: true,
				intro: { content: "本回合受到的伤害+1" },
			},
			effect: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						const hs = player.getCards("h");
						if ([card].concat(card.cards || []).containsSome(...hs)) {
							return false;
						}
					},
					cardSavable(card, player) {
						return lib.skill.gz_chiyan_effect.mod.cardEnabled.apply(this, arguments);
					},
				},
				mark: true,
				intro: { content: "本回合不能使用手牌" },
			},
		},
	},
	gz_zimou: {
		audio: "scszimou",
		trigger: { player: "phaseUseBegin" },
		forced: true,
		logTarget: () => game.filterPlayer().sortBySeat(),
		async content(event, trigger, player) {
			for (const target of event.targets) {
				if (!target.isIn()) {
					continue;
				}
				if (target != player) {
					const result = !target.countCards("he")
						? { bool: false }
						: await target
								.chooseToGive(player, "he", `交给${get.translation(player)}一张牌，或弃置其一张牌并受到其造成的1点伤害`)
								.set("ai", card => {
									const { player, target } = get.event();
									if (get.damageEffect(player, target, player) + get.effect(target, { name: "guohe_copy2" }, player, player) > 0) {
										return 0;
									}
									return 6 - get.value(card);
								})
								.forResult();
					if (!result?.bool) {
						if (player.countDiscardableCards(target, "he")) {
							await target.discardPlayerCard(player, "he", true);
							await target.damage();
						}
					}
				} else if (player.countDiscardableCards(player, "he")) {
					await player.chooseToDiscard("he", true);
					await player.damage();
				}
			}
		},
	},
	gz_picai: {
		audio: "scspicai",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(current => current.countCards("h")) >= player.getHp() && player.getHp() > 0;
		},
		filterTarget(card, player, target) {
			return target.countCards("h");
		},
		selectTarget() {
			return get.player().getHp();
		},
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const num = event.targets.length;
			const list = [];
			for (const target of event.targets.sortBySeat()) {
				if (target.isIn() && target.countCards("h")) {
					const { result } = await target.chooseCard("选择一张手牌置于牌堆顶", "h", true);
					if (result?.bool && result?.cards?.length) {
						list.push(target);
						await target.lose(result.cards, ui.cardPile, "insert");
						game.broadcastAll(player => {
							const cardx = ui.create.card();
							cardx.classList.add("infohidden");
							cardx.classList.add("infoflip");
							player.$throw(cardx, 1000, "nobroadcast");
						}, target);
					}
					if (player == game.me) {
						await game.delay(0.5);
					}
				}
			}
			let cards = get.cards(num);
			await game.cardsGotoOrdering(cards);
			await player.showCards(cards, get.translation(player) + `发动了【${get.translation(event.name)}】`);
			const draw = cards.map(card => get.type2(card)).toUniqued().length;
			await player.draw(draw);
			if (draw == 3 && cards.someInD()) {
				cards = cards.filterInD();
				for (const target of list.sortBySeat()) {
					if (!target.isIn()) {
						continue;
					}
					const result = cards.length == 1 ? { bool: true, links: cards } : await target.chooseButton([`${get.translation(event.name)}：获得其中一张牌`, cards], true).forResult();
					if (result?.bool && result?.links?.length) {
						const { links } = result;
						await target.gain(links, "gain2");
						cards.remove(links[0]);
					}
				}
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	gz_yaozhuo: {
		audio: "scsyaozhuo",
		enable: "phaseUse",
		filter(event, player) {
			if (!game.hasPlayer(current => player.canCompare(current))) {
				return false;
			}
			return true;
		},
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const { result } = await player.chooseToCompare(target);
			if (result?.bool) {
				await target.chooseToDiscard(2, true, "h");
			} else {
				await player.recover();
			}
		},
		ai: {
			order(item, player) {
				if (player.isDamaged()) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					var hs = player.getCards("h").sort((a, b) => b.number - a.number);
					var ts = target.getCards("h").sort((a, b) => b.number - a.number);
					if (!hs.length || !ts.length) {
						return 0;
					}
					if ((hs[0].number > ts[0].number - 2 && hs[0].number > 5) || player.isDamaged()) {
						return -1;
					}
					return 0;
				},
			},
		},
		group: "gz_yaozhuo_gain",
		subSkill: {
			gain: {
				audio: "gz_yaozhuo",
				getCards: (event, player) => (player == event.player ? event.card2 : event.card1),
				trigger: { global: ["chooseToCompareAfter", "compareMultipleAfter"] },
				filter(event, player) {
					if (![event.player, event.target].includes(player)) {
						return false;
					}
					if (event.preserve) {
						return false;
					}
					const card = get.info("gz_yaozhuo_gain").getCards(event, player);
					return !get.owner(card);
				},
				check(event, player) {
					const card = get.info("gz_yaozhuo_gain").getCards(event, player);
					return card.name != "du";
				},
				prompt2(event, player) {
					const card = get.info("gz_yaozhuo_gain").getCards(event, player);
					return `获得${get.translation(card)}`;
				},
				async content(event, trigger, player) {
					const card = get.info(event.name).getCards(trigger, player);
					if (!get.owner(card)) {
						await player.gain(card, "gain2");
					}
				},
			},
		},
	},
	gz_xiaolu: {
		audio: "scsxiaolu",
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			await player.draw(2);
			const num = player.countCards("h");
			if (!num) {
				return;
			}
			const result = num >= 2 ? await player
				.chooseControl()
				.set("choiceList", ["将两张手牌交给一名其他角色", "弃置两张手牌"])
				.set("ai", function () {
					if (
						game.hasPlayer(function (current) {
							return current != player && get.attitude(player, current) > 0;
						})
					) {
						return 0;
					}
					return 1;
				})
				.forResult() : {
					index: 1,
				};
			if (result.index == 0) {
				const { bool, cards, targets } = await player.chooseCardTarget({
					position: "h",
					filterCard: true,
					selectCard: 2,
					filterTarget(card, player, target) {
						return player != target;
					},
					ai1(card) {
						return get.unuseful(card);
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						if (target.hasJudge("lebu")) {
							att /= 5;
						}
						return att;
					},
					prompt: "选择两张手牌，交给一名其他角色",
					forced: true,
				})
				.forResult();
				if (bool) {
					await player.give(cards, targets[0]);
				}
			} else {
				await player.chooseToDiscard(2, true, "h");
			}
		},
		ai: {
			order: 9,
			result: { player: 2 },
		},
	},
	gz_kuiji: {
		audio: "scskuiji",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const list1 = [],
				list2 = [],
				target = event.target;
			let chooseButton;
			if (player.countCards("h") > 0) {
				chooseButton = player.chooseButton(4, ["你的手牌", player.getCards("h"), get.translation(target.name) + "的手牌", target.getCards("h")]);
			} else {
				chooseButton = player.chooseButton(4, [get.translation(target.name) + "的手牌", target.getCards("h")]);
			}
			chooseButton.set("target", target);
			chooseButton.set("ai", function (button) {
				const { player, target } = get.event();
				let ps = [],
					ts = [];
				for (let i = 0; i < ui.selected.buttons.length; i++) {
					let card = ui.selected.buttons[i].link;
					if (target.getCards("h").includes(card)) {
						ts.push(card);
					} else {
						ps.push(card);
					}
				}
				let card = button.link;
				let owner = get.owner(card);
				let val = get.value(card) || 1;
				if (owner == target) {
					return 2 * val;
				}
				return 7 - val;
			});
			chooseButton.set("filterButton", function (button) {
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					if (get.suit(button.link) == get.suit(ui.selected.buttons[i].link)) {
						return false;
					}
				}
				return true;
			});
			const result = await chooseButton.forResult();
			if (result.bool) {
				const list = result.links;
				for (let i = 0; i < list.length; i++) {
					if (get.owner(list[i]) == player) {
						list1.push(list[i]);
					} else {
						list2.push(list[i]);
					}
				}
				if (list1.length && list2.length) {
					await game.loseAsync({
						lose_list: [
							[player, list1],
							[target, list2],
						],
						discarder: player,
					}).setContent("discardMultiple");
				} else if (list2.length) {
					await target.discard(list2);
				} else {
					await player.discard(list1);
				}
			}
		},
		ai: {
			order: 13,
			result: {
				target: -1,
			},
		},
	},
	gz_chihe: {
		audio: "scschihe",
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			return event.targets.length == 1 && event.card.name == "sha";
		},
		logTarget(event, player) {
			return player == event.player ? event.targets[0] : event.player;
		},
		check(event, player) {
			const target = get.info("gz_chihe").logTarget(event, player);
			return get.attitude(player, target) <= 0 || !player.canCompare(target);
		},
		async content(event, trigger, player) {
			await player.draw(2);
			if (!player.countCards("h")) {
				return;
			}
			const { result } = await player.chooseCard("h", true, 2, "选择两张手牌展示");
			if (result?.bool && result?.cards?.length) {
				await player.showCards(result.cards, get.translation(player) + "发动了【" + get.translation(event.name) + "】");
			}
			const target = get.info(event.name).logTarget(trigger, player);
			if (player.canCompare(target)) {
				const { result } = await player.chooseToCompare(target);
				if (result?.bool) {
					const evt = trigger.getParent();
					if (typeof evt.baseDamage != "number") {
						evt.baseDamage = 1;
					}
					evt.baseDamage++;
				} else if (player.countDiscardableCards(player, "he")) {
					await player.chooseToDiscard("he", 2, true);
				}
			}
		},
	},
	gz_niqu: {
		audio: "scsniqu",
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			return event.card?.name == "shan" && player.isPhaseUsing();
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0 || player == event.player;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.draw();
			const { player: target } = trigger;
			const sha = get.autoViewAs({ name: "sha", isCard: true });
			if (player.canUse(sha, target, false)) {
				await player.useCard(sha, target, false);
			}
		},
	},
	gz_miaoyu: {
		audio: "scsmiaoyu",
		enable: "chooseToUse",
		filterCard(card, player) {
			return get.suit(card) == "diamond";
		},
		position: "hes",
		viewAs: { name: "sha", nature: "fire" },
		viewAsFilter(player) {
			if (!player.countCards("hes", { suit: "diamond" })) {
				return false;
			}
		},
		prompt: "将一张♦牌当火杀使用",
		check(card) {
			const val = get.value(card);
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { suit: "diamond" })) {
					return false;
				}
			},
			respondSha: true,
		},
		locked: false,
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return Infinity;
				}
			},
		},
	},
	//野刘焉
	gz_tushe: {
		audio: "xinfu_tushe",
		trigger: {
			player: "useCardToPlayer",
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current.isMajor())) {
				return false;
			}
			return event.targets?.some(target => target != player) && event.isFirstTarget;
		},
		frequent: true,
		async content(event, trigger, player) {
			const targets = game.filterPlayer(current => current.isMajor());
			if (targets?.length) {
				await player.draw(targets.length);
			}
		},
	},
	gz_limu: {
		audio: "xinfu_limu",
		enable: "phaseUse",
		discard: false,
		filter(event, player) {
			if (player.hasJudge("lebu")) {
				return false;
			}
			return player.countCards("hes", { suit: "diamond" }) > 0;
		},
		viewAs: { name: "lebu" },
		position: "hes",
		filterCard(card, player, event) {
			return get.suit(card) == "diamond" && player.canAddJudge({ name: "lebu", cards: [card] });
		},
		selectTarget: -1,
		filterTarget(card, player, target) {
			return player == target;
		},
		check(card) {
			return 13 - get.number(card);
		},
		onuse(result, player) {
			var next = game.createEvent("limu_recover", false, _status.event.getParent());
			next.player = player;
			next.card = result.card;
			next.setContent(async (event, trigger, player) => {
				await player.recover();
				const num = get.number(event.card);
				player.addTempSkill("gz_limu_effect");
				player.addMark("gz_limu_effect", num, false);
			});
		},
		ai: {
			result: {
				target(player, target) {
					let res = lib.card.lebu.ai.result.target(player, target);
					if (player.countCards("hs", "sha") >= player.hp) {
						res++;
					}
					if (target.isDamaged()) {
						return res + 2 * Math.abs(get.recoverEffect(target, player, target));
					}
					return res;
				},
				ignoreStatus: true,
			},
			order(item, player) {
				if (player.hp > 1 && player.countCards("j")) {
					return 0;
				}
				return 12;
			},
			effect: {
				target(card, player, target) {
					if (target.isPhaseUsing() && typeof card === "object" && get.type(card, null, target) === "delay" && !target.countCards("j")) {
						let shas =
							target.getCards("hs", i => {
								if (card === i || (card.cards && card.cards.includes(i))) {
									return false;
								}
								return get.name(i, target) === "sha" && target.getUseValue(i) > 0;
							}) - target.getCardUsable("sha");
						if (shas > 0) {
							return [1, 1.5 * shas];
						}
					}
				},
			},
		},
		subSkill: {
			effect: {
				intro: {
					content: "本回合可以额外使用$张杀",
				},
				locked: false,
				onremove: true,
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("gz_limu_effect");
						}
					},
				},
			},
		},
	},
	//野袁术
	gz_new_yongsi: {
		audio: "drlt_yongsi",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countGainableCards(player, "he");
		},
		filter(event, player) {
			return game.hasPlayer(target => target != player && target.countGainableCards(player, "he"));
		},
		selectTarget: [1, 2],
		multiline: true,
		async content(event, trigger, player) {
			await player.gainPlayerCard(event.target, "he", true);
		},
		async contentAfter(event, trigger, player) {
			if (!player.getHistory("sourceDamage").length) {
				await player.chooseToDiscard(2, true, "he");
				await player.loseHp();
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					const eff = name => get.effect(target, { name: name }, player, target);
					if (!player.getHistory("sourceDamage").length) {
						return Math.max(0, eff("guohe_copy2") + get.effect(player, { name: "losehp" }, player, player) / 2);
					}
					return eff("shunshou_copy2");
				},
			},
		},
		preHidden: ["yingzi"],
		group: "gz_new_yongsi_yingzi",
		subSkill: {
			yingzi: {
				audio: "drlt_yongsi",
				trigger: {
					player: "phaseDrawBegin2",
				},
				forced: true,
				filter(event, player) {
					if (event.numFixed) {
						return false;
					}
					return game.hasPlayer(current => current.identity != "unknown" && current.isNotMajor());
				},
				async content(event, trigger, player) {
					const num = game.countPlayer(current => current.identity != "unknown" && current.isNotMajor());
					trigger.num += num;
				},
			},
		},
	},
	gz_new_weidi: {
		audio: "drlt_weidi",
		group: ["gz_new_weidi_draw", "gz_new_weidi_zhibi"],
		ai: {
			threaten(player, target) {
				if (
					game.hasPlayer(function (current) {
						return current.getEquip("yuxi");
					}) ||
					!target.hasEmptySlot(5)
				) {
					return 0.5;
				}
				return 2;
			},
			forceMajor: true,
			skillTagFilter(player, tag, arg) {
				return (
					!game.hasPlayer(function (current) {
						return current.getEquip("yuxi");
					}) && player.hasEmptySlot(5)
				);
			},
		},
		subSkill: {
			draw: {
				audio: "gz_new_weidi",
				equipSkill: true,
				noHidden: true,
				trigger: {
					player: "phaseDrawBegin2",
				},
				forced: true,
				filter(event, player) {
					if (event.numFixed || !player.hasEmptySlot(5)) {
						return false;
					}
					return !game.hasPlayer(function (current) {
						return current.getEquips("yuxi").length > 0;
					});
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
			zhibi: {
				audio: "gz_new_weidi",
				trigger: {
					player: "phaseUseBegin",
				},
				forced: true,
				noHidden: true,
				equipSkill: true,
				filter(event, player) {
					if (!player.hasEmptySlot(5)) {
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
				async content(event, trigger, player) {
					await player.chooseUseTarget("玉玺（伪帝）：选择知己知彼的目标", { name: "zhibi" });
				},
			},
		},
	},
	//野吕布
	gz_wuchang: {
		audio: "olyuyu",
		logAudio: () => ["olyuyu"],
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		getIndex(event, player) {
			if (!event.getg || !event.getl) {
				return [];
			}
			return game.filterPlayer(current => current != player && event.getl(current).cards2?.length);
		},
		filter(event, player, name, target) {
			const cards = event.getg(player);
			if (!cards.length || target.identity == "unknown") {
				return false;
			}
			return event.getl(target).cards2?.containsSome(...cards);
		},
		preHidden: true,
		logTarget(_1, _2, _3, target) {
			return target;
		},
		async content(event, trigger, player) {
			const skill = `${event.name}_effect`,
				map = player.getStorage(skill, new Map()),
				group = event.targets[0].identity;
			player.addTempSkill(skill);
			let num = (map.has(group) ? map.get(group) : 0) + 1;
			map.set(group, num);
			player.setStorage(skill, map, true);
		},
		group: "gz_wuchang_draw",
		subSkill: {
			draw: {
				audio: "gz_wuchang",
				trigger: {
					global: ["dieAfter", "changeGroupInGuozhan", "diaohulishanAfter"],
				},
				filter(event, player, name) {
					if (event.name == "die") {
						return event.player && !game.hasPlayer(current => current.identity == event.player.identity);
					}
					if (event.name == "diaohulishan") {
						return event.target && !game.hasPlayer(current => current.identity == event.target.identity);
					}
					return event.fromGroups?.some(group => {
						return !game.hasPlayer(current => current.identity == group);
					}) && !game.hasPlayer(current => !event.targets.includes(current) && current.identity == event.toGroup);
				},
				locked: true,
				async cost(event, trigger, player) {
					const { bool, cost_data } = await player
						.chooseToUse()
						.set("openskilldialog", "###无常###将一张牌当【出其不意】使用，或点取消摸两张牌")
						.set("norestore", true)
						.set("_backupevent", "gz_wuchang_backup")
						.set("custom", {
							add: {},
							replace: { window() {} },
						})
						.backup("gz_wuchang_backup")
						.setHiddenSkill("gz_wuchang")
						.set("chooseonly", true)
						.forResult();
					event.result = {
						bool: true,
						cost_data: bool ? cost_data : null,
						skill_popup: !bool,
					};
				},
				async content(event, trigger, player) {
					if (event.cost_data) {
						const { ResultEvent } = event.cost_data;
						event.next.push(ResultEvent);
						await ResultEvent;
					} else {
						await player.draw(2);
					}
				},
			},
			backup: {
				audio: "gz_wuchang",
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "hes",
				viewAs: {
					name: "chuqibuyi",
				},
				popname: true,
				prompt: "将一张牌当出其不意使用",
				check(card) {
					return 7 - get.value(card);
				},
			},
			effect: {
				intro: {
					markcount: () => null,
					content(storage, player) {
						if (!storage) {
							return "未发动过【无常】";
						}
						let list = [];
						storage.forEach((num, group) => {
							if (num > 0) {
								list.push(`对${get.translation(group)}势力造成的伤害+${num}`);
							}
						});
						return list.join("<br>");
					},
				},
				onremove: true,
				charlotte: true,
				trigger: {
					source: "damageBegin1",
				},
				audio: "gz_wuchang",
				filter(event, player) {
					const map = player.getStorage("gz_wuchang_effect", new Map()),
						group = event.player.identity;
					return group != "unknown" && map.has(group) && typeof map.get(group) == "number";
				},
				forced: true,
				async content(event, trigger, player) {
					const map = player.getStorage("gz_wuchang_effect", new Map()),
						group = trigger.player.identity;
					trigger.num += map.get(group);
				},
			},
		},
	},
	gz_liyu: {
		audio: ["wushuang", "liyu"],
		logAudio: () => ["liyu"],
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countGainableCards(player, "ej"));
		},
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(`###${get.prompt(event.skill)}###获得一名角色场上一张牌，然后其摸一张牌`, (card, player, target) => {
					return target.countGainableCards(player, "ej");
				})
				.set("ai", target => {
					const player = get.player();
					const eff = name => get.effect(target, { name: name }, player, player);
					return eff("shunshou") + eff("draw");
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.gainPlayerCard(target, "ej", true);
			await target.draw();
		},
		locked: false,
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha" && player.countCards("e")) {
					return num + player.countCards("e");
				}
			},
		},
		group: "gz_liyu_wushuang",
		subSkill: {
			wushuang: {
				audio: "gz_liyu",
				logAudio: () => ["wushuang"],
				trigger: {
					player: "useCardToPlayered",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (!player.countCards("e")) {
						return false;
					}
					return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
				},
				logTarget: "target",
				async content(event, trigger, player) {
					const id = trigger.target.playerid;
					const map = trigger.getParent().customArgs;
					if (!map[id]) {
						map[id] = {};
					}
					if (typeof map[id].shanRequired != "number") {
						map[id].shanRequired = 1;
					}
					const num = Math.max(0, player.countCards("e") - 1);
					map[id].shanRequired += num;
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) {
							return false;
						}
					},
				},
			},
		},
	},
	//野魏延
	gz_new_kuanggu: {
		audio: "potkuanggu_pot_weiyan_achieve",
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		getIndex(event) {
			return event.num || 0;
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
		},
		locked: false,
		mod: {
			selectTarget(card, player, range) {
				if (range[1] == -1 || !get.tag(card, "damage")) {
					return;
				}
				let info = lib.card[card.name];
				if (!info || info.notarget || info.selectTarget != 1) {
					return;
				}
				let num = player.getDamagedHp() + 1;
				range[1] += num;
			},
		},
	},
	//蛋神
	gz_gongao: {
		audio: "gongao",
		trigger: {
			player: "phaseZhunbeiBegin",
			global: "die",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "die") {
				return event.player != player;
			}
			return player.countCards("h") < player.maxHp;
		},
		async content(event, trigger, player) {
			if (trigger.name == "die") {
				await player.gainMaxHp();
				await player.recover();
			} else {
				await player.drawTo(player.maxHp);
			}
		},
		ai: {
			threaten: 114514,
		},
	},
	//辛宪英
	gz_caishi: {
		audio: "caishi",
		trigger: { player: "phaseDrawEnd" },
		async cost(event, trigger, player) {
			const choices = [];
			const choiceList = ["本回合手牌上限+2", "回复1点体力，然后本回合你不能对其他角色使用牌"];
			choices.push("选项一");
			if (player.isDamaged()) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			const { result } = await player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt(event.skill))
				.set("ai", () => {
					return get.event("choice");
				})
				.set(
					"choice",
					(() => {
						if (player.isDamaged()) {
							if (player.countCards("h", "tao")) {
								return 0;
							}
							if (player.hp < 2) {
								return 1;
							}
							if (
								!game.hasPlayer(current => {
									if (get.attitude(player, current) >= 0) {
										return false;
									}
									return (
										player.countCards("h", card => {
											return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
										}) >= player.getHandcardLimit()
									);
								})
							) {
								return 1;
							}
							return 0;
						}
						return 0;
					})()
				);
			event.result = {
				bool: result?.control !== "cancel2",
				cost_data: result?.index,
			};
		},
		async content(event, trigger, player) {
			const index = event.cost_data;
			if (index == 0) {
				player.addTempSkill(event.name + "_effect");
				player.addMark(event.name + "_effect", 2, false);
			} else if (index == 1) {
				await player.recover();
				player.addTempSkill(event.name + "_buff");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				markimage: "image/card/handcard.png",
				intro: { content: "手牌上限+#" },
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("gz_caishi_effect");
					},
				},
			},
			buff: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合内不能对其他角色使用牌" },
				mod: {
					playerEnabled(card, player, target) {
						if (player != target) {
							return false;
						}
					},
				},
			},
		},
	},
	//关银屏
	gz_huxiao: {
		audio: "huxiao",
		trigger: {
			source: "damageSource",
		},
		forced: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player) || !event.player.isIn()) {
				return false;
			}
			return event.hasNature("fire");
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await target.draw();
			player.addTempSkill("gz_huxiao_effect");
			const map = player.getStorage("gz_huxiao_effect", new Map());
			map.set(target, 3);
			player.setStorage("gz_huxiao_effect", map);
		},
		subSkill: {
			effect: {
				onremove: true,
				charlotte: true,
				mark: true,
				intro: {
					markcount: () => null,
					content(storage, player) {
						const map = player.getStorage("gz_huxiao_effect", new Map()),
							list = [];
						for (let i of map) {
							if (i[0]?.isIn?.() && i[1] > 0) {
								list.add(`${get.translation(i[0])} 剩余${i[1]}次`);
							}
						}
						if (!list.length) {
							return "无剩余次数";
						}
						return list.join("<br>");
					},
				},
				trigger: {
					player: "useCardToPlayer",
				},
				filter(event, player) {
					const map = player.getStorage("gz_huxiao_effect", new Map());
					return map.has(event.target);
				},
				async cost(event, trigger, player) {
					const map = player.getStorage(event.skill, new Map());
					map.set(trigger.target, map.get(trigger.target) - 1);
					player.setStorage(event.skill, map);
					if (!map.some((num, current) => num > 0)) {
						player.unmarkSkill(event.skill);
					}
					event.result = {
						bool: true,
						skill_popup: false,
					};
				},
				async content(event, trigger, player) {
					if (trigger.getParent().addCount !== false) {
						trigger.getParent().addCount = false;
						player.getStat().card[trigger.card.name]--;
					}
				},
				mod: {
					cardUsableTarget(card, player, target) {
						const map = player.getStorage("gz_huxiao_effect", new Map());
						if (map.has(target) && map.get(target) > 0) {
							return true;
						}
					},
				},
			},
		},
	},
	//张璇
	gz_tongli: {
		audio: "tongli",
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (!get.info("gz_tongli")?.filterx(event) || get.tag(event.card, "norepeat")) {
				return false;
			}
			return event.isFirstTarget && player.countCards("h");
		},
		filterx(event) {
			if (event.targets.length == 0) {
				return false;
			}
			var type = get.type(event.card);
			if (type != "basic" && type != "trick") {
				return false;
			}
			return true;
		},
		usable: 1,
		check(event, player) {
			return (
				player
					.getCards("h")
					.map(card => get.color(card))
					?.toUniqued()?.length == 1
			);
		},
		preHidden: true,
		async content(event, trigger, player) {
			await player.showHandcards();
			if (
				player
					.getCards("h")
					.map(card => get.color(card))
					?.toUniqued()?.length != 1
			) {
				return;
			}
			if (!get.info("gz_tongli")?.filterx(trigger)) {
				return;
			}
			trigger.getParent().effectCount++;
			game.log(trigger.card, "额外结算一次");
		},
	},
	gz_shezang: {
		audio: "shezang",
		trigger: {
			player: "dying",
		},
		frequent: true,
		filter(event, player) {
			return (
				game
					.getAllGlobalHistory("everything", evt => {
						return evt.name == "dying" && evt.player == player;
					})
					.indexOf(event) == 0
			);
		},
		async content(event, trigger, player) {
			await player.draw(4);
		},
	},
	//关索
	gz_zhengnan: {
		audio: "zhengnan",
		trigger: { global: "dieAfter" },
		frequent: true,
		async content(event, trigger, player) {
			await player.draw(3);
			const list = lib.skill.gz_zhengnan.derivation.filter(skill => !player.hasSkill(skill, null, false, false));
			if (list.length > 0) {
				const result =
					list.length > 1
						? await player
								.chooseControl(list)
								.set("prompt", "选择获得一项技能")
								.set("ai", function () {
									const controls = get.event().controls;
									if (controls.includes("gzdangxian")) {
										return "gzdangxian";
									}
									return controls[0];
								})
								.forResult()
						: { control: list[0] };
				if (result.control) {
					await player.addSkills(result.control);
				}
			}
		},
		ai: { threaten: 2 },
		derivation: ["gz_wusheng", "gzdangxian", "gz_zhiman"],
	},
	//曹婴
	gz_lingren: {
		audio: "xinfu_lingren",
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (!event.isFirstTarget || !get.tag(event.card, "damage")) {
				return false;
			}
			return event.targets?.some(target => target.countCards("h") <= player.countCards("h"));
		},
		preHidden: true,
		usable: 1,
		async cost(event, trigger, player) {
			const targets = trigger.targets?.filter(target => target.countCards("h") <= player.countCards("h"));
			if (targets.length > 1) {
				event.result = await player
					.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
						return get.event("targetx").includes(target);
					})
					.set("targetx", targets)
					.set("ai", target => {
						return 10 - get.attitude(get.player(), target);
					})
					.setHiddenSkill(event.skill)
					.forResult();
			} else {
				event.result = await player.chooseBool(get.prompt2(event.skill, targets)).setHiddenSkill(event.skill).forResult();
				event.result.targets = targets;
			}
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseBool(`令${get.translation(trigger.card)}对${get.translation(target)}造成的伤害+1，或点取消摸两张牌`)
				.set(
					"choice",
					(() => {
						if (get.damageEffect(target, player, player) <= 0) {
							return false;
						}
						return Math.random() > 0.6;
					})()
				)
				.forResult();
			if (result.bool) {
				const map = trigger.getParent()?.customArgs;
				const id = target.playerid;
				map[id] ??= {};
				map[id].extraDamage ??= 0;
				map[id].extraDamage++;
			} else {
				await player.draw(2);
			}
		},
	},
	gz_fujian: {
		audio: "xinfu_fujian",
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			const card = new lib.element.VCard({ name: "zhibi" });
			return game.hasPlayer(current => current != player && player.canUse(card, current) && current.countCards("h") <= player.countCards("h"));
		},
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (cardx, player, target) => {
					const card = new lib.element.VCard({ name: "zhibi" });
					return target != player && player.canUse(card, target) && target.countCards("h") <= player.countCards("h");
				})
				.set("ai", target => {
					const card = new lib.element.VCard({ name: "zhibi" }),
						player = get.player();
					return get.effect(target, card, player, player);
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "zhibi" });
			await player.useCard(card, event.targets);
		},
	},
	//鲁芝
	gz_qingzhong: {
		audio: "qingzhong",
		trigger: { player: "phaseUseBegin" },
		check(event, player) {
			if (
				game.hasPlayer(function (current) {
					return current != player && current.isMinHandcard() && get.attitude(player, current) > 0;
				})
			) {
				return true;
			}
			if (player.countCards("h") <= 2) {
				return true;
			}
			return false;
		},
		preHidden: true,
		async content(event, trigger, player) {
			await player.draw(2);
			player
				.when("phaseUseEnd")
				.filter(evt => evt == trigger)
				.step(async (event, trigger, player) => {
					const targets = game.filterPlayer(current => {
						if (!current.isMinHandcard() || current == player) {
							return false;
						}
						return player.isFriendOf(current) || current.isUnseen();
					});
					if (!targets?.length) {
						return;
					}
					const result =
						targets.length > 1
							? await player
									.chooseTarget("清忠：与一名手牌数最少且和你势力相同或未确定势力的其他角色交换手牌", true, (card, player, current) => {
										if (!current.isMinHandcard() || current == player) {
											return false;
										}
										return player.isFriendOf(current) || current.isUnseen();
									})
									.set("ai", target => {
										return get.attitude(get.player(), target);
									})
									.forResult()
							: {
									bool: true,
									targets: targets,
							  };
					if (result?.bool) {
						const [target] = result.targets;
						player.logSkill("gz_qingzhong", [target]);
						await player.swapHandcards(target);
					}
				});
		},
	},
	gz_weijing: {
		audio: "weijing",
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type == "wuxie" || !player.countCards("hes") || player.hasSkill("gz_weijing_used")) {
				return false;
			}
			for (let name of lib.inpile) {
				if (name != "sha" && name != "shan") {
					continue;
				}
				if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				let list = [];
				for (var name of lib.inpile) {
					if (name != "sha" && name != "shan") {
						continue;
					}
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
				}
				const dialog = ui.create.dialog("卫境", [list, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				let player = _status.event.player,
					card = { name: button.link[2], nature: button.link[3] };
				return player.getUseValue(card, null, true);
			},
			backup(links, player) {
				return {
					audio: "gz_weijing",
					viewAs: {
						name: links[0][2],
					},
					filterCard: true,
					position: "hes",
					popname: true,
					check(card) {
						return 6 / Math.max(1, get.value(card));
					},
					async precontent(event, trigger, player) {
						player.addTempSkill("gz_weijing_used", "roundEnd");
					},
				};
			},
			prompt(links, player) {
				const card = links[0][2];
				return `将一张牌当做${get.translation(card)}使用`;
			},
		},
		hiddenCard(player, name) {
			if (name != "sha" && name != "shan") {
				return false;
			}
			return player.countCards("hes") && !player.hasSkill("gz_weijing_used");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				return lib.skill.gz_weijing.hiddenCard(player, tag == "respondSha" ? "sha" : "shan");
			},
			order: 9,
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
			},
		},
	},
	//张星彩
	gz_qiangwu: {
		enable: "phaseUse",
		usable: 1,
		audio: "qiangwu",
		async content(event, trigger, player) {
			const result = await player.judge(card => 1 / get.number(card)).forResult();
			if (typeof result.number == "number") {
				for (let eff of ["limit", "distance"]) {
					const skill = `${event.name}_${eff}`;
					player.addTempSkill(skill);
					player.setStorage(skill, result.number);
					player.addTip(skill, `${eff == "limit" ? "不计次数 >" : "无视距离 <"}${result.number}`);
				}
			}
		},
		subSkill: {
			limit: {
				trigger: {
					player: "useCard1",
				},
				onremove(player, skill) {
					player.removeTip(skill);
					player.setStorage(skill);
				},
				filter(event, player) {
					if (event.card?.name != "sha") {
						return false;
					}
					const num = get.number(event.card);
					return typeof num == "number" && num > player.getStorage("gz_qiangwu_limit", 13);
				},
				charlotte: true,
				direct: true,
				async content(event, trigger, player) {
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						player.getStat().card.sha--;
					}
					player.removeSkill(event.name);
				},
				locked: false,
				mod: {
					cardUsable(card, player) {
						if (card.name == "sha") {
							const num = get.number(card);
							if (num == "unsure" || num > player.getStorage("gz_qiangwu_limit", 13)) {
								return true;
							}
						}
					},
				},
			},
			distance: {
				trigger: {
					player: "useCard1",
				},
				onremove(player, skill) {
					player.removeTip(skill);
					player.setStorage(skill);
				},
				filter(event, player) {
					if (event.card?.name != "sha") {
						return false;
					}
					const num = get.number(event.card);
					return typeof num == "number" && num < player.getStorage("gz_qiangwu_distance", 1);
				},
				charlotte: true,
				direct: true,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
				},
				locked: false,
				mod: {
					targetInRange(card, player) {
						if (card.name == "sha") {
							const num = get.number(card);
							if (num == "unsure" || num < player.getStorage("gz_qiangwu_distance", 1)) {
								return true;
							}
						}
					},
				},
			},
		},
		ai: {
			order: 11,
			result: {
				player: 1,
			},
		},
	},
	//高览
	gz_jungong: {
		audio: "spjungong",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var num = player.countMark("spjungong_used");
			return num < player.hp || num <= player.countCards("he");
		},
		filterTarget(card, player, target) {
			return target != player && player.canUse("sha", target, false);
		},
		filterCard: true,
		position: "he",
		selectCard() {
			var player = _status.event.player,
				num = player.countMark("spjungong_used") + 1;
			if (ui.selected.cards.length || num > player.hp) {
				return num;
			}
			return [0, num];
		},
		check(card) {
			return 6 - get.value(card);
		},
		prompt() {
			var player = _status.event.player,
				num = get.cnNumber(player.countMark("spjungong_used") + 1);
			return "弃置" + num + "张牌或失去" + num + "点体力，视为使用杀";
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			if (!cards.length) {
				await player.loseHp();
			}
			await player.useCard({ name: "sha", isCard: true }, target, false);
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) + 1;
			},
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					return get.effect(target, { name: "sha" }, player, target);
				},
			},
		},
	},
	gz_dengli: {
		audio: "spdengli",
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		frequent: true,
		filter(event, player, name) {
			if (event.card.name != "sha" || (name == "useCardToPlayered" && event.targets?.length != 1)) {
				return false;
			}
			return event.player.hp == event.target.hp;
		},
		async content(event, trigger, player) {
			await player.draw();
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					var hp = player.hp,
						evt = _status.event;
					if (evt.name == "chooseToUse" && evt.player == player && evt.skill == "gz_jungong" && !ui.selected.cards.length) {
						hp--;
					}
					if (card && card.name == "sha" && hp == target.hp) {
						return [1, 0.3];
					}
				},
				target_use(card, player, target) {
					if (card && card.name == "sha" && player.hp == target.hp) {
						return [1, 0.3];
					}
				},
			},
		},
	},
	//双势力文鸯
	gz_quedi: {
		audio: ["dbquedi1.mp3", "dbquedi2.mp3", "dbchoujue1.mp3", "dbchoujue2.mp3"],
		logAudio: () => "dbquedi",
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			const { card, targets, target } = event;
			return (
				["sha", "juedou"].includes(card.name) &&
				targets.length == 1 &&
				(target.countGainableCards(player, "h") > 0 ||
					player.hasCard(card => {
						return _status.connectMode || (get.type(card, null, player) == "basic" && lib.filter.cardDiscardable(card, player, "gz_quedi"));
					}, "h"))
			);
		},
		async cost(event, trigger, player) {
			const { target } = trigger;
			const list = [];
			if (target.countGainableCards(player, "h") > 0) {
				list.push("选项一");
			}
			if (player.hasCard(card => get.type(card, null, player) == "basic" && lib.filter.cardDiscardable(card, player, "dbquedi"), "h")) {
				list.push("选项二");
			}
			list.push("cancel2");
			const control = await player
				.chooseControl(list)
				.set("choiceList", [`获得${get.translation(target)}的一张手牌`, `弃置一张基本牌并令${get.translation(trigger.card)}伤害+1`])
				.set("prompt", get.prompt(event.skill, target))
				.set("ai", () => {
					const evt = _status.event.getTrigger(),
						player = evt.player,
						target = evt.target,
						card = evt.card;
					if (get.attitude(player, target) > 0) {
						return "cancel2";
					}
					const bool1 = target.countGainableCards(player, "h") > 0;
					const bool2 =
						player.hasCard(cardx => {
							return get.type(cardx, null, player) == "basic" && lib.filter.cardDiscardable(cardx, player, "dbquedi") && get.value(card, player) < 5;
						}, "h") &&
						!target.hasSkillTag("filterDamage", null, {
							player: player,
							card: card,
						});
					if (bool1) {
						return "选项一";
					}
					if (bool2) {
						return "选项二";
					}
					return "cancel2";
				})
				.forResultControl();
			event.result = {
				bool: control != "cancel2",
				cost_data: control,
			};
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const { cost_data: control } = event,
				{ target } = trigger;
			if (["选项一", "背水！"].includes(control) && target.countGainableCards(player, "h") > 0) {
				await player.gainPlayerCard(target, true, "h");
			}
			if (["选项二", "背水！"].includes(control) && player.hasCard(card => get.type(card, null, player) == "basic" && lib.filter.cardDiscardable(card, player, "dbquedi"), "h")) {
				const bool = await player.chooseToDiscard("h", "弃置一张基本牌", { type: "basic" }, true).forResultBool();
				if (bool) {
					trigger.getParent().baseDamage++;
				}
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag !== "directHit_ai" || !arg || !arg.card || !arg.target || (arg.card.name != "sha" && arg.card.name != "juedou")) {
					return false;
				}
				if (
					arg.target.countCards("h") == 1 &&
					(arg.card.name != "sha" ||
						!arg.target.hasSkillTag("freeShan", false, {
							player: player,
							card: arg.card,
							type: "use",
						}) ||
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
				) {
					return true;
				}
				return false;
			},
		},
		group: "gz_quedi_choujue",
		subSkill: {
			choujue: {
				logAudio: () => "dbchoujue",
				trigger: { source: "dieAfter" },
				prompt2: "交换主副将",
				async content(event, trigger, player) {
					await player.showCharacter(2);
					game.broadcastAll(
						(player, name1, name2) => {
							player.name = name2;
							player.sex = get.character(name2).sex;

							player.smoothAvatar(false);
							player.name1 = name2;
							player.skin.name = name2;
							player.node.avatar.setBackground(name2, "character");
							player.node.name.innerHTML = get.slimName(name2);

							player.smoothAvatar(true);
							player.name2 = name1;
							player.skin.name2 = name1;
							player.node.avatar2.setBackground(name1, "character");
							player.node.name2.innerHTML = get.slimName(name1);
						},
						player,
						player.name1,
						player.name2
					);
					player.update();
					player.getSkills(null, false, false).forEach(skill => {
						const info = get.info(skill);
						if (info?.viceSkill && player.checkViceSkill(skill)) {
							player.restoreSkill(skill);
						}
						if (info?.mainSkill && player.checkMainSkill(skill)) {
							player.restoreSkill(skill);
						}
					});
					game.log(player, "交换了主副将");
				},
			},
		},
	},
	gz_zhuifeng: {
		mainSkill: true,
		init(player, skill) {
			player.checkMainSkill(skill);
		},
		audio: "dbzhuifeng",
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "juedou",
			isCard: true,
		},
		selectCard: -1,
		filterCard: () => false,
	},
	gz_chongjian: {
		viceSkill: true,
		init(player, skill) {
			player.checkViceSkill(skill);
		},
		audio: "dbchongjian",
		hiddenCard(player, name) {
			if (
				(name == "sha" || name == "jiu") &&
				player.hasCard(function (card) {
					return get.type(card) == "equip";
				}, "hes")
			) {
				return true;
			}
			return false;
		},
		enable: "chooseToUse",
		filter(event, player) {
			return (
				player.hasCard(function (card) {
					return get.type(card) == "equip";
				}, "hes") &&
				(event.filterCard({ name: "sha", storage: { gzchongjian: true } }, player, event) || event.filterCard({ name: "jiu", storage: { gzchongjian: true } }, player, event))
			);
		},
		locked: false,
		mod: {
			cardUsable(card) {
				if (card?.storage?.gzchongjian) {
					return Infinity;
				}
			},
		},
		chooseButton: {
			dialog() {
				let list = [];
				list.push(["基本", "", "sha"]);
				for (var i of lib.inpile_nature) {
					list.push(["基本", "", "sha", i]);
				}
				list.push(["基本", "", "jiu"]);
				return ui.create.dialog("冲坚", [list, "vcard"]);
			},
			filter(button, player) {
				let evt = _status.event.getParent();
				return evt.filterCard({ name: button.link[2], nature: button.link[3], storage: { gzchongjian: true } }, player, evt);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				let player = _status.event.player;
				if (
					button.link[2] == "jiu" &&
					(player.hasCard(function (card) {
						return get.name(card) == "sha";
					}, "hs") ||
						player.countCards("hes", function (card) {
							if (get.type(card) != "equip") {
								return false;
							}
							if (get.position(card) == "e") {
								if (player.hasSkillTag("noe")) {
									return 10 - get.value(card) > 0;
								}
								var sub = get.subtype(card);
								if (
									player.hasCard(function (card) {
										return get.subtype(card) == sub && player.canUse(card, player) && get.effect(player, card, player, player) > 0;
									}, "hs")
								) {
									return 10 - get.value(card) > 0;
								}
							}
							return 5 - get.value(card) > 0;
						}) > 1)
				) {
					return player.getUseValue({ name: "jiu" }) * 4;
				}
				return player.getUseValue({ name: button.link[2], nature: button.link[3], storage: { gzchongjian: true } }, false);
			},
			backup(links, player) {
				return {
					audio: "gz_chongjian",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: { gzchongjian: true },
					},
					filterCard: { type: "equip" },
					position: "hes",
					popname: true,
					async precontent(event, trigger, player) {
						event.getParent().addCount = false;
					},
					check(card) {
						var player = _status.event.player;
						if (get.position(card) == "e") {
							if (player.hasSkillTag("noe")) {
								return 10 - get.value(card);
							}
							var sub = get.subtype(card);
							if (
								player.hasCard(function (card) {
									return get.subtype(card) == sub && player.canUse(card, player) && get.effect(player, card, player, player) > 0;
								}, "hs")
							) {
								return 10 - get.value(card);
							}
						}
						return 5 - get.value(card);
					},
				};
			},
			prompt(links) {
				return "将一张装备牌当做" + (links[0][3] ? get.translation(links[0][3]) : "") + "【" + get.translation(links[0][2]) + "】使用";
			},
		},
		ai: {
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				return player.hasCard({ type: "equip" }, "hes");
			},
			order(item, player) {
				if (_status.event.type != "phase") {
					return 1;
				}
				var player = _status.event.player;
				if (
					player.hasCard(function (card) {
						if (get.value(card, player) < 0) {
							return true;
						}
						var sub = get.subtype(card);
						return (
							player.hasCard(function (card) {
								return get.subtype(card) == sub && player.canUse(card, player) && get.effect(player, card, player, player) > 0;
							}, "hs") > 0
						);
					}, "e")
				) {
					return 10;
				}
				if (
					player.countCards("hs", "sha") ||
					player.countCards("he", function (card) {
						return get.type(card) == "equip" && get.value(card, player) < 5;
					}) > 1
				) {
					return get.order({ name: "jiu" }) - 0.1;
				}
				return get.order({ name: "sha" }) - 0.1;
			},
			result: { player: 1 },
		},
		subSkill: {
			backup: {},
		},
	},
};