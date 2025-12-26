import { lib, game, ui, get, ai, _status } from "noname";

/** @type {Record<string, Skill>} */
export default {
	// gz_zangba
	gz_hengjiang: {
		audio: "hengjiang",
		trigger: {
			player: "damageEnd",
		},
		preHidden: true,
		check(event, player) {
			// @ts-expect-error 类型系统未来可期
			return get.attitude(player, _status.currentPhase) < 0 || !_status.currentPhase.needsToDiscard(2);
		},
		filter(event) {
			// @ts-expect-error 类型系统未来可期
			return _status.currentPhase && _status.currentPhase.isIn() && event.num > 0;
		},
		logTarget() {
			// @ts-expect-error 类型系统未来可期
			return _status.currentPhase;
		},
		async content(event, trigger, player) {
			// @ts-expect-error 类型系统未来可期
			const source = _status.currentPhase;
			const num = Math.max(source.countVCards("e"), 1);
			if (source.hasSkill("gz_hengjiang_effect")) {
				source.storage.gz_hengjiang_effect += num;
				source.storage.gz_hengjiang3.add(player);
				source.updateMarks();
			} else {
				source.storage.gz_hengjiang3 = [player];
				source.storage.gz_hengjiang_effect = num;
				source.addTempSkill("gz_hengjiang_effect");
			}
		},
		ai: {
			maixie_defend: true,
		},
		subSkill: {
			effect: {
				trigger: {
					player: "phaseDiscardEnd",
				},
				filter(event, player) {
					if (event.cards?.length) {
						return false;
					}
					return player.storage.gz_hengjiang3.some(target => target?.isIn() && target.countCards("h") < target.maxHp);
				},
				onremove(player) {
					delete player.storage.gz_hengjiang_effect;
					delete player.storage.gz_hengjiang3;
				},
				mark: true,
				charlotte: true,
				silent: true,
				async content(event, trigger, player) {
					const players = player.storage.gz_hengjiang3;
					for (var i = 0; i < players.length; i++) {
						const target = players[i];
						if (target.isIn() && target.countCards("h") < target.maxHp) {
							target.logSkill("gz_hengjiang", player);
							await target.drawTo(target.maxHp);
						}
					}
				},
				intro: {
					content: "手牌上限-#",
				},
				mod: {
					maxHandcard(player, num) {
						return num - player.storage.gz_hengjiang_effect;
					},
				},
			},
		},
	},

	// gz_mifuren
	gz_guixiu: {
		audio: "guixiu",
		trigger: {
			player: ["showCharacterAfter", "removeCharacterBefore"],
		},
		unique: true,
		filter(event, player) {
			if (event.name == "removeCharacter" || event.name == "changeVice") {
				// @ts-expect-error 类型系统未来可期
				return get.character(event.toRemove, 3).includes("gz_guixiu") && player.isDamaged();
			}
			// @ts-expect-error 类型系统未来可期
			return event.toShow.some(name => get.character(name, 3).includes("gz_guixiu"));
		},
		async content(_event, trigger, player) {
			if (trigger.name == "showCharacter") {
				await player.draw(2);
			} else {
				await player.recover();
			}
		},
	},
	gz_cunsi: {
		audio: "cunsi",
		enable: "phaseUse",
		filter(_event, player) {
			return player.checkMainSkill("gz_cunsi", false) || player.checkViceSkill("gz_cunsi", false);
		},
		unique: true,
		forceunique: true,
		filterTarget: true,
		skillAnimation: true,
		animationColor: "orange",
		derivation: "gzyongjue",
		async content(event, _trigger, player) {
			const { target } = event;

			if (player.checkMainSkill("gz_cunsi", false)) {
				await player.removeCharacter(0);
			} else {
				await player.removeCharacter(1);
			}

			target.addSkills("gzyongjue");
			if (target != player) {
				await target.draw(2);
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

	// gz_sunce
	yingyang: {
		audio: 2,
		trigger: {
			player: "compare",
			target: "compare",
		},
		filter(event) {
			// @ts-expect-error 类型系统未来可期
			return !event.iwhile;
		},
		preHidden: true,
		async cost(event, trigger, player) {
			const next = player.chooseControl("点数+3", "点数-3", "cancel2");

			next.set("prompt", get.prompt2("yingyang"));
			next.set("ai", check);
			next.set("small", Reflect.get(trigger, "small"));

			const result = await next.forResult();
			event.result = {
				bool: result.index != 2,
				cost_data: {
					index: result.index,
				},
			};

			return;

			function check() {
				const event = get.event();
				const small = Reflect.get(event, "small");

				return small ? 1 : 0;
			}
		},
		async content(event, trigger, player) {
			/** @type {number} */
			const index = event.cost_data?.index;

			if (index == 0) {
				game.log(player, "拼点牌点数+3");
				if (player == trigger.player) {
					// @ts-expect-error 类型系统未来可期
					trigger.num1 += 3;
					// @ts-expect-error 类型系统未来可期
					if (trigger.num1 > 13) {
						trigger.num1 = 13;
					}
				} else {
					// @ts-expect-error 类型系统未来可期
					trigger.num2 += 3;
					// @ts-expect-error 类型系统未来可期
					if (trigger.num2 > 13) {
						trigger.num2 = 13;
					}
				}
			} else {
				game.log(player, "拼点牌点数-3");
				if (player == trigger.player) {
					// @ts-expect-error 类型系统未来可期
					trigger.num1 -= 3;
					// @ts-expect-error 类型系统未来可期
					if (trigger.num1 < 1) {
						trigger.num1 = 1;
					}
				} else {
					// @ts-expect-error 类型系统未来可期
					trigger.num2 -= 3;
					// @ts-expect-error 类型系统未来可期
					if (trigger.num2 < 1) {
						trigger.num2 = 1;
					}
				}
			}
		},
	},
	baka_hunshang: {
		audio: "hunzi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		init(player) {
			if (player.checkViceSkill("baka_hunshang") && !player.viceChanged) {
				player.removeMaxHp();
			}
		},
		filter(_event, player) {
			return player.hp <= 1;
		},
		locked: false,
		forced: true,
		preHidden: true,
		viceSkill: true,
		skillAnimation: true,
		animationColor: "wood",
		derivation: ["baka_yingzi", "baka_yinghun"],
		async content(_event, _trigger, player) {
			await player.addTempSkills(["baka_yingzi", "baka_yinghun"]);
		},
		ai: {
			threaten(_player, target) {
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
					// @ts-expect-error 类型系统未来可期
					if (get.tag(card, "damage") == 1 && target.hp == 2 && !target.isTurnedOver() && _status.currentPhase != target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
						return [0.5, 1];
					}
				},
			},
		},
	},
	baka_yinghun: {
		audio: "yinghun_sunce",
		inherit: "yinghun",
	},
	baka_yingzi: {
		audio: "reyingzi_sunce",
		trigger: {
			player: "phaseDrawBegin2",
		},
		frequent: true,
		filter(event) {
			return !event.numFixed;
		},
		async content(_event, trigger, _player) {
			trigger.num++;
		},
		mod: {
			maxHandcardBase(player, _num) {
				return player.maxHp;
			},
		},
		ai: {
			threaten: 1.3,
		},
	},

	// gz_chendong
	fake_fenming: {
		audio: "fenming",
		usable: 1,
		enable: "phaseUse",
		filter(event, player) {
			return player.isLinked();
		},
		filterTarget(card, player, target) {
			return target.isLinked();
		},
		selectTarget: -1,
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

	// gz_sp_dongzhuo
	fake_baoling: {
		audio: "baoling",
		inherit: "baoling",
		init(player) {
			player.checkMainSkill("fake_baoling");
		},
		derivation: "fake_benghuai",
		async content(_event, _trigger, player) {

			await player.removeCharacter(1);

			await player.gainMaxHp(3);
			await player.recover(3);

			await player.addSkills("fake_benghuai");
		},
	},
	fake_benghuai: {
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
			// @ts-expect-error 类型系统未来可期
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

	// gz_zhangren
	gz_fengshi: {
		audio: "zfengshi",
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			// @ts-expect-error 类型系统未来可期
			if (event.card.name != "sha" || game.countPlayer() < 4) {
				return false;
			}
			// @ts-expect-error 类型系统未来可期
			return player.siege(event.target) && event.player.siege(event.target) && event.target.countCards("e");
		},
		zhenfa: "siege",
		logTarget: "target",
		async content(_event, trigger, _player) {
			await trigger.target.chooseToDiscard("e", true);
		},
	},
};
