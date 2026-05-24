const skills = {
	sxrmmieguo: {
		audio: 2,
		dutySkill: true,
		trigger: {
			player: "phaseEnd",
		},
		filter(event, player) {
			return !event.skill;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("sxrmmieguo"), "获得一名其他角色的至多3张牌", function (card, player, target) {
					return target != player && target.countCards("he");
				})
				.set("ai", target => {
					const player = get.player();
					if (get.attitude(player, target) > 0 && target.countCards("he") >= 4) return 10;
					if (get.attitude(player, target) < 0) return 5;
					return -1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = await player
				.choosePlayerCard(target, "选择至多3张牌获得", "he", [1, 3], true)
				.set("ai", button => {
					const player = get.player();
					if (ui.selected.buttons?.length) return -1;
					if (get.attitude(player, target) > 0) {
						if (get.position(button.link) == "h") return 5;
						return 1;
					} else {
						return 1;
					}
				})
				.forResult("cards");
			if (!cards?.length) {
				event.finish();
				return;
			}
			const num = cards.length;
			player.gain(cards, target, "give");
			const targetsx =
				game.countPlayer() <= num
					? game.filterPlayer()
					: await target
							.chooseTarget(`选择${num}名角色，${get.translation(player)}的额外回合内无法对这些角色使用牌`, true, num)
							.set("ai", target => {
								if (target == get.player) return 5;
								return 1;
							})
							.forResult("targets");
			if (!targetsx?.length) {
				event.finish();
				return;
			}
			player.addSkill("sxrmmieguo_ban");
			player.markAuto("sxrmmieguo_ban", targetsx);
			game.log(player, "执行了一个额外回合");
			player.insertPhase();
		},
		subSkill: {
			ban: {
				charlotte: true,
				forced: true,
				onremove: true,
				popup: false,
				intro: {
					content(storage) {
						if (!storage?.length) return "";
						let list = [];
						for (let i of storage) {
							list.push(get.translation(i));
						}
						return "不能对" + list.join("、") + "使用牌";
					},
				},
				mod: {
					playerEnabled: function (card, player, target) {
						if (player.getStorage("sxrmmieguo_ban")?.includes(target)) {
							return false;
						}
					},
				},
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					return event.getParent("phase").skill == "sxrmmieguo";
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					if (!player.getHistory("useCard").length) {
						game.log(player, "【灭虢】使命失败");
						player.awakenSkill("sxrmmieguo");
						player.loseMaxHp();
					}
				},
				sub: true,
				parentskill: "sxrmmieguo",
				_priority: 0,
			},
		},
		_priority: 0,
	},
};
