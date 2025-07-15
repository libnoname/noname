import { lib, game, ui, get, ai, _status } from "../../../noname.js";

const card = {
	diaobingqianjiang: {
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: -1,
		filterTarget(card, player, target) {
			return player === target || target.countCards("h");
		},
		contentBefore() {
			"step 0";
			game.delay();
			player.draw();
			"step 1";
			if (get.is.versus()) {
				player
					.chooseControl("顺时针", "逆时针", function (event, player) {
						if (player.next.side === player.side) {
							return "逆时针";
						}
						return "顺时针";
					})
					.set("prompt", "选择" + get.translation(card) + "的结算方向");
			} else {
				event.goto(3);
			}
			"step 2";
			if (result && result.control === "顺时针") {
				var evt = event.getParent();
				evt.fixedSeat = true;
				evt.targets.sortBySeat();
				evt.targets.reverse();
				if (evt.targets[evt.targets.length - 1] === player) {
					evt.targets.unshift(evt.targets.pop());
				}
			}
			"step 3";
			ui.clear();
			var cards = get.cards(Math.ceil(game.countPlayer() / 2));
			var dialog = ui.create.dialog("调兵遣将", cards, true);
			_status.dieClose.push(dialog);
			dialog.videoId = lib.status.videoId++;
			game.addVideo("cardDialog", null, ["调兵遣将", get.cardsInfo(cards), dialog.videoId]);
			event.getParent().preResult = dialog.videoId;
		},
		content() {
			"step 0";
			for (var i = 0; i < ui.dialogs.length; i++) {
				if (ui.dialogs[i].videoId === event.preResult) {
					event.dialog = ui.dialogs[i];
					break;
				}
			}
			if (!event.dialog || !target.countCards("h")) {
				event.finish();
				return;
			}
			var minValue = 20;
			var hs = target.getCards("h");
			for (var i = 0; i < hs.length; i++) {
				minValue = Math.min(minValue, get.value(hs[i], target));
			}
			if (target.isUnderControl(true)) {
				event.dialog.setCaption("选择一张牌并用一张手牌替换之");
			}
			var next = target.chooseButton(function (button) {
				return get.value(button.link, _status.event.player) - minValue;
			});
			next.set("dialog", event.preResult);
			next.set("closeDialog", false);
			next.set("dialogdisplay", true);
			"step 1";
			event.dialog.setCaption("调兵遣将");
			if (result.bool) {
				event.button = result.buttons[0];
				target.chooseCard("用一张牌牌替换" + get.translation(result.links), true).ai = function (card) {
					return -get.value(card);
				};
			} else {
				target.popup("不换");
				event.finish();
			}
			"step 2";
			if (result.bool) {
				target.lose(result.cards, ui.special);
				target.$throw(result.cards);
				game.log(target, "用", result.cards, "替换了", event.button.link);
				target.gain(event.button.link);
				target.$gain2(event.button.link);
				event.dialog.buttons.remove(event.button);
				event.dialog.buttons.push(ui.create.button(result.cards[0], "card", event.button.parentNode));
				event.button.remove();
			}
			"step 3";
			game.delay(2);
		},
		contentAfter() {
			"step 0";
			event.dialog = get.idDialog(event.preResult);
			if (!event.dialog) {
				event.finish();
				return;
			}
			var nextSeat = _status.currentPhase?.next;
			var att = get.attitude(player, nextSeat);
			if (player.isUnderControl(true) && !_status.auto) {
				event.dialog.setCaption("将任意张牌以任意顺序置于牌堆顶（先选择的在上）");
			}
			var next = player.chooseButton([1, event.dialog.buttons.length], event.dialog);
			next.ai = function (button) {
				const { nextSeat } = get.event();
				if (att > 0) {
					return get.value(button.link, nextSeat) - 5;
				} else {
					return 5 - get.value(button.link, nextSeat);
				}
			};
			next.set("closeDialog", false);
			next.set("dialogdisplay", true);
			next.set("nextSeat", nextSeat);
			"step 1";
			if (result && result.bool && result.links && result.links.length) {
				for (var i = 0; i < result.buttons.length; i++) {
					event.dialog.buttons.remove(result.buttons[i]);
				}
				var cards = result.links.slice(0);
				while (cards.length) {
					ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
				}
				game.log(player, "将" + get.cnNumber(result.links.length) + "张牌置于牌堆顶");
			}
			for (var i = 0; i < event.dialog.buttons.length; i++) {
				event.dialog.buttons[i].link.discard();
			}
			"step 2";
			var dialog = event.dialog;
			dialog.close();
			_status.dieClose.remove(dialog);
			game.addVideo("cardDialog", null, event.preResult);
		},
		ai: {
			wuxie() {
				return 0;
			},
			basic: {
				order: 2,
				useful: [3, 1],
				value: [5, 1],
			},
			result: {
				player: (player, target) => {
					return 1 / game.countPlayer();
				},
				target(player, target) {
					if (target.countCards("h") === 0) {
						return 0;
					}
					return (Math.sqrt(target.countCards("h")) - get.distance(player, target, "absolute") / game.countPlayer() / 3) / 2;
				},
			},
			tag: {
				loseCard: 1,
				multitarget: 1,
			},
		},
	},
	youdishenru: {
		fullskin: true,
		type: "trick",
		notarget: true,
		wuxieable: true,
		global: "g_youdishenru",
		content() {
			"step 0";
			var info = event.getParent(2).youdiinfo || event.getParent(3).youdiinfo;
			if (!info) {
				event.finish();
				return;
			}
			info.evt.cancel();
			event.source = info.source;
			event.source.storage.youdishenru = player;
			event.source.addSkill("youdishenru");
			"step 1";
			var next = event.source.chooseToUse({ name: "sha" }, player, -1, "对" + get.translation(player) + "使用一张杀，或受到1点伤害").set("addCount", false);
			next.ai2 = function () {
				return 1;
			};
			"step 2";
			if (result.bool) {
				if (event.source.storage.youdishenru) {
					event.goto(1);
				} else {
					event.source.removeSkill("youdishenru");
				}
			} else {
				event.source.damage(player);
				event.source.removeSkill("youdishenru");
			}
		},
		ai: {
			value: [5, 1],
			useful: [5, 1],
			order: 1,
			wuxie(target, card, player, current, state) {
				return -state * get.attitude(player, current);
			},
			result: {
				player(player) {
					if (_status.event.parent.youdiinfo && get.attitude(player, _status.event.parent.youdiinfo.source) <= 0) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	wangmeizhike: {
		audio: "ext:玩点论杀/audio/card",
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			let rec = false;
			if (target.isMinHp() && target.isDamaged()) {
				await target.recover();
				rec = true;
			}
			if (target.isMinHandcard()) {
				await target.draw(rec ? 1 : 2);
			}
		},
		ai: {
			order(item) {
				let player = _status.event.player,
					aoe = 0,
					max = 0;
				player.getCards("hs", i => {
					const name = get.name(i);
					if (name === "nanman" || name === "wanjian") {
						aoe = Math.max(aoe, get.order(i, player));
					}
				});
				const fs = game.filterPlayer(cur => get.attitude(player, cur) > 0);
				for (const current of fs) {
					let hp = current.isMinHp();
					let hc;
					if (player === current) {
						let ph = player.countCards("h", i => {
							if (i === item || item.cards?.includes(i)) {
								return false;
							}
							return true;
						});
						hc = !game.hasPlayer(cur => {
							if (cur === player) {
								return false;
							}
							return cur.countCards("h") < ph;
						});
					} else {
						hc = current.isMinHandcard();
					}
					if (aoe && (hp || hc)) {
						return aoe + 0.2;
					}
					if (hp && hc && max !== 1) {
						max = current === player ? 1 : -1;
					}
				}
				if (max) {
					return 5.8;
				}
				if (player.isDamaged() && player.isMinHp() && player.countCards("hs", "tao")) {
					return get.order("tao") + 0.2;
				}
				return 0.5;
			},
			value: 7,
			result: {
				target(player, target, vcard) {
					let num = 0,
						mei = [],
						draw = target.hasSkillTag("nogain") ? 0.1 : 1;
					if (vcard?.cards) {
						mei.addArray(vcard.cards);
					}
					if (ui.selected.cards) {
						mei.addArray(ui.selected.cards);
					} //再把ui.selected.xxx赋值给变量我把所有ai都吃了
					let mine = player.countCards("h", i => {
						if (mei.includes(i)) {
							return false;
						}
						// if (!mei.length && get.name(i) === "wangmeizhike") {
						// 	mei.push(i);
						// 	return false;
						// }
						return true;
					});
					if (player.hasSkillTag("noh") && player.countCards("h")) {
						mine++;
					}
					let min = mine;
					game.filterPlayer(current => {
						if (player === current) {
							return false;
						}
						min = Math.min(min, current.countCards("h"));
					});
					if (target.isMinHp() && target.isDamaged() && get.recoverEffect(target, player, target) > 0) {
						if (target.hp === 1) {
							num += 3;
						} else {
							num += 2;
						}
					}
					if (player === target) {
						if (mine <= min) {
							num += (num ? 2 : 1) * draw;
						}
					} else if (target.countCards("h") <= min) {
						num += (num ? 2 : 1) * draw;
					}
					return num;
				},
			},
			tag: {
				draw: 1.2,
				recover: 0.5,
			},
		},
	},
};

for (let i in card) {
	card[i].image = "ext:玩点论杀/image/card/" + i + ".png";
}

export default card;
