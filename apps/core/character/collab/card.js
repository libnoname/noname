import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	//菌子害人不浅呐
	kuratamashiro: {
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: -1,
		filterTarget: true,
		cardimage: "mashiro",
		derivation: "ol_le_menghuo",
		async contentBefore(event, trigger, player) {
			const card = event.card;
			const targets = event.targets;
			if (!targets.length) return;
			if (card.storage?.chooseDirection || get.is.versus()) {
				const result = await player
					.chooseControl("顺时针", "逆时针", (event, player) => {
						if ((get.event().isVersus && player.next.side === player.side) || get.attitude(player, player.next) > get.attitude(player, player.previous)) return "逆时针";
						return "顺时针";
					})
					.set("prompt", `选择${get.translation(card)}的结算方向`)
					.set("isVersus", get.is.versus())
					.forResult();
				if (result && result.control === "顺时针") {
					const evt = event.getParent();
					const sorter = _status.currentPhase || player;
					evt.fixedSeat = true;
					evt.targets.sortBySeat(sorter);
					evt.targets.reverse();
					if (evt.targets[evt.targets.length - 1] === sorter) evt.targets.unshift(evt.targets.pop());
				}
			}
			ui.clear();
			let nextEvents = [];
			let num = 5;
			if (typeof card.storage?.extraCardsNum === "number") num += card.storage.extraCardsNum;
			let cards = Array.from({ length: num }).map(() => {
				const card = game.createCard("mashiro", " ", " ");
				game.broadcastAll(card => (card.isGood = Math.random() > 0.5), card);
				return card;
			});
			const orderingEvent = game.cardsGotoOrdering(cards);
			orderingEvent.relatedEvent = event.getParent();
			nextEvents.push(orderingEvent);
			event.getParent().wuguTargets = [];
			const dialog = ui.create.dialog("五菇丰登", cards, true);
			_status.dieClose.push(dialog);
			if (
				get.nameList(game.me).some(name => {
					if (lib.character[name]?.skills?.includes("manyi")) return true;
					return ["孟获", "祝融", "诸葛亮", "鲍三娘", "关索"].includes(get.rawName(name));
				})
			)
				dialog.buttons.forEach(button => game.createButtonCardsetion(button.link.isGood ? "👍" : "👎", button));
			dialog.videoId = lib.status.videoId++;
			game.addVideo("cardDialog", null, ["五菇丰登", get.cardsInfo(cards), dialog.videoId]);
			event.getParent().preResult = dialog.videoId;
			game.broadcast(
				(cards, id) => {
					const dialog = ui.create.dialog("五菇丰登", cards, true);
					_status.dieClose.push(dialog);
					if (
						get.nameList(game.me).some(name => {
							if (lib.character[name]?.skills?.includes("manyi")) return true;
							return ["孟获", "祝融", "诸葛亮", "鲍三娘", "关索"].includes(get.rawName(name));
						})
					)
						dialog.buttons.forEach(button => game.createButtonCardsetion(button.link.isGood ? "👍" : "👎", button));
					dialog.videoId = id;
				},
				cards,
				dialog.videoId
			);
			for (const nextEvent of nextEvents) await nextEvent;
		},
		async content(event, trigger, player) {
			const target = event.target;
			const dialog = ui.dialogs.find(dialog => dialog.videoId === event.preResult);
			if (!dialog || !dialog.buttons.length) return;
			let result;
			let directButton;
			if (dialog.buttons.length > 1) {
				const next = target.chooseButton(true);
				next.set("ai", button => {
					const player = get.player();
					const card = button.link;
					if (
						get.nameList(player).some(name => {
							if (lib.character[name]?.skills?.includes("manyi")) return true;
							return ["孟获", "祝融", "诸葛亮", "鲍三娘", "关索"].includes(get.rawName(name));
						})
					)
						return (card.isGood ? 1.5 : -1.5) + Math.random();
					return 1 + Math.random();
				});
				next.set("dialog", event.preResult);
				next.set("closeDialog", false);
				next.set("dialogdisplay", true);
				result = await next.forResult();
			} else {
				directButton = dialog.buttons[0];
			}
			let card;
			if (directButton) {
				card = directButton.link;
			} else {
				for (const button of dialog.buttons) {
					if (button.link === result.links[0]) {
						card = button.link;
						break;
					}
				}
				if (!card) card = dialog.buttons[0].link;
			}
			const button = dialog.buttons.find(button => button.link === card);
			if (button) {
				const innerHTML = target.getName(true);
				game.createButtonCardsetion(innerHTML, button);
				dialog.buttons.remove(button);
			}
			const capt = `${get.translation(target)}选择了${get.translation(button.link)}`;
			if (card) {
				target.$gain2(card);
				target.addTempSkill(`oljunzhu_${card.isGood ? "effect" : "debuff"}`, { player: "phaseAfter" });
				game.broadcast(
					(card, id, name, capt) => {
						const dialog = get.idDialog(id);
						if (dialog) {
							dialog.content.firstChild.innerHTML = capt;
							const button = dialog.buttons.find(button => button.link === card);
							if (button) {
								game.createButtonCardsetion(name, button);
								dialog.buttons.remove(button);
							}
						}
					},
					card,
					dialog.videoId,
					target.getName(true),
					capt
				);
			}
			dialog.content.firstChild.innerHTML = capt;
			game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
			event.getParent().wuguTargets.push(target);
			const delayEvent = game.delay();
			await delayEvent;
		},
		async contentAfter(event) {
			const dialog = ui.dialogs.find(dialog => dialog.videoId === event.preResult);
			if (dialog) {
				dialog.close();
				_status.dieClose.remove(dialog);
			}
			game.broadcast(id => {
				const dialog = get.idDialog(id);
				if (dialog) {
					dialog.close();
					_status.dieClose.remove(dialog);
				}
			}, event.preResult);
			game.addVideo("cardDialog", null, event.preResult);
			for (const target of game.filterPlayer().sortBySeat()) {
				if (!event.getParent().wuguTargets.includes(target)) await target.loseHp();
			}
		},
		ai: {
			wuxie() {
				return 0;
			},
			basic: {
				order: 3,
				useful: 0.5,
			},
			result: {
				target(player, target) {
					const sorter = _status.currentPhase || player;
					let opt = 6 + 0.75 * (game.countPlayer() - 2 * get.distance(sorter, target, "absolute"));
					if (get.is.versus()) {
						if (target !== sorter && get.attitude(player, player.next) < get.attitude(player, player.previous)) opt = 6 + 0.75 * (2 * get.distance(sorter, target, "absolute") - game.countPlayer());
					}
					if (player.hasUnknown(2)) return 0;
					return opt / 6;
				},
			},
			tag: {
				draw: 1,
				multitarget: 1,
			},
		},
	},
	//巧合的是，ましろ的读音与英语mushroom（蘑菇/菌子）谐音
	mashiro: {
		fullskin: true,
		type: "mashiro",
		derivation: "ol_le_menghuo",
		ai: {
			value: 0,
			useful: 0,
		},
	},
	bachiqionggouyu: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		ai: {
			equipValue(card, player) {
				const lose = player.maxHp - player.getHp();
				if (_status.currentPhase !== player) {
					return 4 - lose * 2;
				}
				if (_status.currentPhase) {
					const phase = get.event().getParent("phase");
					const nexts = phase?.phaseList.slice(phase.num);
					if (nexts.includes("phaseUse") && !player.isDamaged()) {
						return 2;
					}
				}
				return 0;
			},
		},
		skills: ["bachiqionggouyu_skill"],
	},
	bazhijing: {
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		async onLose({ player }) {
			player.unmarkAuto("bazhing", player.getStorage("bazhijing"));
		},
		ai: {
			equipValue(card, player) {
				return 10 - player.getStorage("bazhijing").length;
			},
		},
		skills: ["bazhijing_skill"],
	},
	luoyangchan: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		destroy: true,
		derivation: "ol_le_caohong",
		distance: {
			attackFrom: -1,
		},
		skills: ["luoyangchan_skill"],
	},
	real_zhuge: {
		derivation: "you_zhugeliang",
		cardimage: "zhuge",
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		distance: {
			attackFrom: -98,
		},
		destroy: true,
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
			equipValue(card, player) {
				if (player._zhuge_temp) {
					return 1;
				}
				player._zhuge_temp = true;
				const result = (() => {
					if (!game.hasPlayer(current => get.distance(player, current) <= 1 && player.canUse("sha", current) && get.effect(current, { name: "sha" }, player, player) > 0)) {
						return 1;
					}
					if (player.hasSha() && _status.currentPhase === player) {
						if ((player.getEquip("zhuge") && player.countUsed("sha")) || player.getCardUsable("sha") === 0) {
							return 10;
						}
					}
					const num = player.countCards("h", "sha");
					if (num > 1) {
						return 6 + num;
					}
					return 3 + num;
				})();
				delete player._zhuge_temp;
				return result;
			},
			basic: {
				equipValue: 5,
			},
			tag: {
				valueswap: 1,
			},
		},
		skills: ["real_zhuge_skill"],
	},
	olhuaquan_heavy: {
		fullskin: true,
		noname: true,
	},
	olhuaquan_light: {
		fullskin: true,
		noname: true,
	},
	ruyijingubang: {
		fullskin: true,
		derivation: "sunwukong",
		type: "equip",
		subtype: "equip1",
		cardcolor: "heart",
		skills: ["ruyijingubang_skill", "ruyijingubang_effect"],
		equipDelay: false,
		distance: {
			attackFrom: -2,
			attackRange: (card, player) => player.storage.ruyijingubang_skill || 3,
		},
		async onEquip({ card, player }) {
			if (!card.storage.ruyijingubang_skill) {
				card.storage.ruyijingubang_skill = 3;
			}
			player.storage.ruyijingubang_skill = card.storage.ruyijingubang_skill;
			player.markSkill("ruyijingubang_skill");
		},
		async onLose({ player }) {
			if (!player.getStat().skill.ruyijingubang_skill) {
				return;
			}
			delete player.getStat().skill.ruyijingubang_skill;
		},
	},
	oljuhun_poker: {
		type: "special",
		enable: false,
		ai: {
			value: 0,
			useful: 0,
		},
	},
};
export default cards;
