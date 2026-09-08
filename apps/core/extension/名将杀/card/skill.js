import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCardConfig['skill'] } */
const skill = {
	//龙泉剑：武器，攻击范围2，当你受到伤害后，可以削弱伤害来源的2张牌。
	mjslongquanjian_skill: {
		equipSkill: true,
		trigger: {
			player: "damageEnd",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event.source?.isIn();
		},
		logTarget: "source",
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = target.getCards("he", card => {
                return lib.filter.canBeWeakened(card, target, "mjstaiejian_skill");
            });
            if (!cards.length) {
                return;
            }
            if (cards.length <= 2) {
                event.result = { bool: true, cards: cards };
            } else {
                event.result = await player
                    .choosePlayerCard(target, "he", 2, true)
                    .set("filterButton", button => {
                        return get.event().cards.includes(button.link);
                    })
                    .set("cards", cards)
                    .forResult();
            }
            if (event.result?.bool && event.result?.cards?.length) {
                await target.mjsWeakenCards(event.result.cards, player);
            }
		},
	},
	//太阿剑：武器，攻击范围2，当你造成伤害后，可以削弱目标的2张牌。
	mjstaiejian_skill: {
		equipSkill: true,
		trigger: {
			source: "damageSource",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event.player?.isIn();
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = target.getCards("he", card => {
                return lib.filter.canBeWeakened(card, target, "mjstaiejian_skill");
            });
            if (!cards.length) {
                return;
            }
            if (cards.length <= 2) {
                event.result = { bool: true, cards: cards };
            } else {
                event.result = await player
                    .choosePlayerCard(target, "he", 2, true)
                    .set("filterButton", button => {
                        return get.event().cards.includes(button.link);
                    })
                    .set("cards", cards)
                    .forResult();
            }
            if (event.result?.bool && event.result?.cards?.length) {
                await target.mjsWeakenCards(event.result.cards, player);
            }
		},
	},
	//渠
	g_mjsqu: {
		cardSkill: true,
		mod: {
			cardDiscardable(card, player) {
	            if (card.name == "mjsqu") {
	                return false;
	            }
	        },
	        cardEnabled2(card, player) {
	            if (get.itemtype(card) == "card" && card.name == "mjsqu") {
	                return false;
	            }
	        },
		},
	},
	//义兵
	g_mjsyibing: {
		mod: {
	        ignoredHandcard(card, player) {
	            if (card.name == "mjsyibing") {
	                return true;
	            }
	        },
	        cardDiscardable(card, player, name) {
	            if (name == "phaseDiscard" && card.name == "mjsyibing") {
	                return false;
	            }
	        },
	    },
	},
	g_mjsyibing_use: {
		cardSkill: true,
		enable: "chooseToUse",
		usable: 1,
		filter(event, player) {
	        return get.inpileVCardList(info => {
	            const name = info[2], type = get.type(name), infox = get.info({ name: name });
	            return !info[3] && ["sha", "shan"].includes(name);
	        }).some(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
	    },
	    chooseButton: {
	        dialog(event, player) {
	            var vcards = [];
	            for (var name of ["sha", "shan"]) {
	                var card = { name: name, isCard: true };
	                if (event.filterCard(card, player, event)) vcards.push(["", "", name]);
	            }
	            const dialog = ui.create.dialog("义兵", [vcards, "vcard"]);
	            dialog.direct = true;
	            return dialog;
	        },
	        check(button) {
	            return get.player().getUseValue({
	                name: button.link[2],
	            });
	        },
	        backup(links) {
	            return {
	                viewAs: {
	                    name: links[0][2],
	                },
	                filterCard(card) {
	                	return card.name == "mjsyibing";
	                },
	                ai1(card) {
	                    return 7 - get.value(card);
	                },
	                log: false,
	            }
	        },
	        prompt(links) {
	            return "将一张义兵当做" + get.translation(links[0][2]) + "使用或打出";
	        },
	    },
	    ai: {
	        respondSha: true,
	        respondShan: true,
	        skillTagFilter(player, tag, arg) {
	            if (!player.countCards("hs", "mjsyibing")) return false;
	        },
	        order(item, player) {
	            var player = _status.event.player;
	            var event = _status.event;
	            if (event.filterCard({ name: "sha" }, player, event)) {
	                if (
	                    !player.hasShan() &&
	                    !game.hasPlayer(function (current) {
	                        return player.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player, player) > 0;
	                    })
	                ) {
	                    return 0;
	                }
	                return 2.95;
	            } else {
	                var player = _status.event.player;
	                return 3.15;
	            }
	        },
	        result: {
	            player: 1,
	        },
	    },
	    subSkill: {
	    	backup: {},
	    },
	},
	//玉钩
	g_mjsyugou: {
		cardSkill: true,
		mod: {
			cardDiscardable(card2, player2) {
	            if (card2.name == "mjsyugou") {
	              	return false;
	            }
	        },
	        cardEnabled2(card2, player2) {
	            if (card2.name == "mjsyugou") {
	              	return false;
	            }
	        },
		},
	},
	mjsyugou_skill: {
		equipSkill: true,
		mod: {
			canBeDiscarded(card2, source, player2) {
	            if (player2.getEquips("mjsyugou").includes(card2)) {
	              	return false;
	            }
	        },
	        canBeReplaced(card2, player2) {
	            if (player2.getVEquips("mjsyugou").includes(card2)) {
	              	return false;
	            }
	       	},
		},
		trigger: {
	        player: "gainAfter",
	        global: "loseAsyncAfter",
	    },
	    usable: 1,
	    priority: 15,
	    locked: false,
	    filter(event, player) {
	        if (!player.countCards("h")) return false;
	        if (event.name == "gameDraw") return true;
	        return event.getg?.(player)?.length > 0 && player.countCards("h") >= player.getHandcardLimit();
	    },
	    async content(event, trigger, player) {
	    	await player.recover();
	    },
	},
	//虎
	mjshu_skill: {
		equipSkill: true,
		trigger: {
			player: "phaseEnd",
		},
		popup: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjshu");
			return cards.length ? cards : 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "mjs_debuff_zhongdu" }, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const num = Math.pow(1 + Math.max(1, player.getEquips("mjsxiang").length));
			target.addSkill("mjs_debuff_liuxue");
			target.addMark("mjs_debuff_liuxue", num, false);
		},
	},
	//蛇
	mjsshe_skill: {
		equipSkill: true,
		trigger: {
			source: "damageSource",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsshe");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return event.card.name == "sha" && event.player?.isIn();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const num = Math.pow(Math.max(1, player.getEquips("mjsxiang").length), player.getEquips("mjsxiang").length - 1 );
			trigger.player.addSkill("mjs_debuff_zhongdu");
			trigger.player.addMark("mjs_debuff_zhongdu", num, false);
		},
	},
	//鳄
	mjse_skill: {
		equipSkill: true,
		mod: {
			maxHandcard(player, num) {
				const count = Math.pow(Math.max(1, player.getEquips("mjsxiang").length), player.getEquips("mjsxiang").length - 1 );
				return (num + count);
			},
		},
		trigger: {
			player: "phaseUseBegin",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjse");
			return cards.length ? cards : 1;
		},
		async content(event, trigger, player) {2 ^ 2
			const num = Math.pow(Math.max(1, player.getEquips("mjsxiang").length), player.getEquips("mjsxiang").length - 1 );
			player.addTempSkill("mjse_skill_sha", "phaseChange");
			player.addMark("mjse_skill_sha", num, false);
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjse_skill_sha");
					},
				},
			},
		},
	},
	//鹰
	mjsying_skill: {
		equipSkill: true,
		mod: {
			maxHandcard(player, num) {
				const count = Math.pow(Math.max(1, player.getEquips("mjsxiang").length), player.getEquips("mjsxiang").length - 1 );
				return (num += count);
			},
		},
		trigger: {
			player: "phaseDrawBegin2",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsying");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			const num = Math.pow(1 + Math.max(1, player.getEquips("mjsxiang").length));
			trigger.num += num;
		},
	},
	//象
	mjsxiang_skill: {
		equipSkill: true,
		mod: {
			maxEquipBase(player, num) {
				const cards = player.getEquips("mjsxiang");
				const count = Math.pow(Math.max(1, player.getEquips("mjsxiang").length), player.getEquips("mjsxiang").length - 1 );
				if (!cards.length || player.hasSkill("mjsxiang_skill", null, false) || cards.some(card => !ui.selected.cards.includes(card))) {
					return (num + count);
				}
			},
		},
		trigger: {
			player: "phaseEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsxiang");
			return cards.length ? cards : 1;
		},
		async content(event, trigger, player) {
			const num = Math.pow(Math.max(1, player.getEquips("mjsxiang").length), player.getEquips("mjsxiang").length - 1 );
			await player.recover(num);
		},
	},
	//传国玉玺
	mjschuanguoyuxi_skill: {
		equipSkill: true,
		mod: {
			globalFrom(from, to, distance) {
				if (from != to) {
					return -Infinity;
				}
			},
			cardDestuctible(card, player) {
				if (player.getEquips("mjschuanguoyuxi").includes(card)) {
					return false;
				}
			},
			cardCombustible(card, player) {
				if (player.getEquips("mjschuanguoyuxi").includes(card)) {
					return false;
				}
			},
		},
		trigger: {
			player: "phaseChange",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjschuanguoyuxi");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return event.phaseList[event.num].startsWith("phaseDiscard");
		},
		async content(event, trigger, player) {
			trigger.phaseList[trigger.num] = `phaseDraw|${event.name}`;
		},
		intro: {
			content(storage, player) {
				const cards = player.getEquips("mjschuanguoyuxi");
			},
		},
		group: "mjschuanguoyuxi_skill_win",
		subSkill: {
			win: {
				equipSkill: true,
				trigger: {
					player: "phaseEnd",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getEquips("mjschuanguoyuxi");
					return cards.length ? cards : 1;
				},
				filter(event, player, triggername, card) {
					return get.itemtype(card) == "card";
				},
				async content(event, trigger, player) {
					const card = event.indexedData;
					if (!card?.storage) card.storage = {};
					if (!card.storage?.mjschuanguoyuxi) card.storage.mjschuanguoyuxi = 0;
					card.storage.mjschuanguoyuxi++;
					if (card?.storage?.mjschuanguoyuxi >= 5) {
						var winners = player.getFriends();
						game.over(player == game.me || winners.includes(game.me));
					}
				},
			},
		},
	},
	g_mjschuanguoyuxi: {
		cardSkill: true,
		trigger: {
			player: "loseBegin",
		},
		equipSkill: true,
		forceDie: true,
		charlotte: true,
		forced: true,
		popup: false,
		filter(event, player) {
			return event.cards.some(card => card.name == "mjschuanguoyuxi");
		},
		async content(event, trigger, player) {
			for (const card of trigger.cards) {
				if (card.name == "mjschuanguoyuxi") {
					delete card?.storage?.mjschuanguoyuxi;
				}
			}
		},
	},
	//吕氏春秋
	mjslvshichunqiu_skill: {
		equipSkill: true,
		mod: {
			canBeDiscarded(card, source, player) {
				if (player.getEquips("mjslvshichunqiu").includes(card)) {
					return false;
				}
			},
			cardDiscardable(card, player) {
				if (player.getEquips("mjslvshichunqiu").includes(card)) {
					return false;
				}
			},
		},
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		usable: 1,
		forced: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjslvshichunqiu");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			if (event.type != "discard") {
				return false;
			}
			return event.getl && event.getl(player)?.cards2?.length;
		},
		async content(event, trigger, player) {
			player.draw();
		},
	},
	//徐夫人匕首
	g_mjsxufurenbishou: {
		cardSkill: true,
		trigger: {
			global: "phaseEnd",
		},
		forced: true,
		silent: false,
		async content(event, trigger, player) {
			const cards = ["cardPile", "discardPile"].map(pos => Array.from(ui[pos].childNodes)).flat();
			const cardList = [];
			const destroy = card => card.name == "mjsxufurenbishou";
			const lose_list = [],
				players = game.filterPlayer();
			players.forEach(current => {
				const pos = "hejxs";
				const cards = current.getCards(pos, destroy);
				if (cards.length > 0) {
					current.$throw(cards);
					lose_list.push([current, cards]);
					cardList.addArray(cards);
				}
			});
			if (lose_list.length) {
				await game.loseAsync({ lose_list }).setContent("chooseToCompareLose");
				await game.delayx();
			}
			cardList.addArray(cards.filter(destroy));
			if (cardList.length) {
				game.cardsGotoSpecial(cardList);
				game.log(cardList, "被销毁");
			}
		},
	},
	mjsxufurenbishou_sha: {
		charlotte: true,
		onremove: true,
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") return num + player.countMark("mjsxufurenbishou_sha");
			},
		},
	},
	mjsxufurenbishou_skill: {
		cardSkill: true,
		name: "徐夫人匕首",
		trigger: {
			source: "damageSource",
		},
		forced: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsxufurenbishou");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return event.card?.name == "sha";
		},
		async content(event, trigger, player) {
			trigger.player.addSkill("mjs_debuff_liuxue");
			trigger.player.addMark("mjs_debuff_liuxue");
			trigger.player.addSkill("mjs_debuff_zhongdu");
			trigger.player.addMark("mjs_debuff_zhongdu");
		},
	},
	//笞
	g_mjschi: {
		cardSkill: true,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		popup: false,
		filter(event, player, name) {
			if (event.type != "discard" || event.getlx === false) {
				return false;
			}
			return event.getl?.(player)?.hs?.some(card => get.name(card, player) == "mjschi");
		},
		async content(event, trigger, player) {
			if (trigger.delay === false) {
				await game.delayx();
			}
			game.log(player, "触发了", "#g【笞】", "的效果");
			const num = trigger.getl(player).hs.filter(function (i) {
				return get.name(i, player) == "mjschi";
			}).length;
			await player.loseHp(num);
		},
	},
	//武刚车
	mjswugangche_skill: {
		cardSkill: true,
		name: "武刚车",
		trigger: {
			target: "useCardToTarget",
		},
		forced: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjswugangche");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return event.card?.name == "sha";
		},
		async content(event, trigger, player) {
			const eff = get.effect(player, trigger.card, trigger.player, trigger.player);
			const result = await trigger.player
				.chooseToDiscard(`武刚车：弃置一张手牌，否则杀对${get.translation(player)}无效`)
				.set("ai", function (card) {
					if (_status.event.eff > 0) {
						return 10 - get.value(card);
					}
					return 0;
				})
				.set("eff", eff)
				.forResult();
			if (!result?.bool) {
				trigger.getParent().excluded.add(player);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (card.name == "sha" && get.attitude(player, target) < 0) {
						if (_status.event.name == "mjswugangche_skill") {
							return;
						}
						if (get.attitude(player, target) > 0 && current < 0) {
							return "zerotarget";
						}
						const bs = player.getCards("h");
						bs.remove(card);
						if (card.cards) {
							bs.removeArray(card.cards);
						} else {
							bs.removeArray(ui.selected.cards);
						}
						if (!bs.length) {
							return "zerotarget";
						}
						if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) {
							return;
						}
						if (bs.length <= 2) {
							for (let i = 0; i < bs.length; i++) {
								if (get.value(bs[i]) < 7) {
									return [1, 0, 1, -0.5];
								}
							}
							return [1, 0, 0.3, 0];
						}
						return [1, 0, 1, -0.5];
					}
				},
			},
		},
	},
	//白登解围
	mjsbaidengjiewei_effect: {
		name: "白登解围",
		cardSkill: true,
		charlotte: true,
		mod: {
			targetEnabled(card, player, target, now) {
				if (card.name == "sha") {
					return false;
				}
			},
		},
		mark: true,
		marktext: "白",
		intro: {
			name: "白登解围",
			content: "直到你下个回合开始，无法被选择为杀的目标",
		},
	},
	//太公六韬
	mjslongtao_effect: {
		cardSkill: true,
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		firstDo: true,
		charlotte: true,
		onremove: true,
		filter(event, player) {
			return player.countMark("mjslongtao_effect") > 0;
		},
		async content(event, trigger, player) {
			player.addMark("mjslongtao_buff", player.countMark("mjslongtao_effect"), false);
			player.addTempSkill("mjslongtao_buff");
			player.removeSkill("mjslongtao_effect");
		},
	},
	mjslongtao_buff: {
		charlotte: true,
		onremove: true,
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") return num + player.countMark("mjslongtao_buff");
			},
		},
	},
	mjshutao_effect: {
		cardSkill: true,
		trigger: {
			player: "useCard",
		},
		forced: true,
		popup: false,
		charlotte: true,
		onremove: true,
		filter(event, player) {
			return get.type(event.card) == "trick";
		},
		async content(event, trigger, player) {
			trigger.effectCount += player.countMark(event.name);
			player.removeSkill(event.name);
		},
	},
	mjsquantao_effect: {
		cardSkill: true,
		trigger: {
			player: "useCard",
		},
		forced: true,
		popup: false,
		charlotte: true,
		onremove: true,
		filter(event, player) {
			return get.type(event.card) == "basic";
		},
		async content(event, trigger, player) {
			trigger.effectCount += player.countMark(event.name);
			player.removeSkill(event.name);
		},
	},
	//狐鸣
	g_mjshuming: {
		cardSkill: true,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		popup: false,
		getIndex(event, player) {
			if (!event.getg) return [];
			return event.getg(player)?.filter(card => card.name == "mjshuming");
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			await player.chooseUseTarget(card, true);
		},
	},
	//魏虎符
	mjsweihufu_skill: {
		equipSkill: true,
		mod: {
			maxEquipBase(player, num) {
				var cards = player.getEquips("mjsweihufu");
				if (!cards.length || player.hasSkill("mjsweihufu_skill", null, false) || cards.some(card => !ui.selected.cards.includes(card))) {
					return (num += Math.max(1, cards.length));
				}
			},
		},
		trigger: {
			global: "phaseEnd",
		},
		forced: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsweihufu");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return player.countCards("h") < player.getHandcardLimit();
		},
		async content(event, trigger, player) {
			player.drawTo(player.getHandcardLimit());
		},
	},
	//锦囊妙计
	mjsshezhanqunru_effect: {
		name: "舌战群儒",
		cardSkill: true,
		trigger: {
			player: "useCard",
		},
		forced: true,
		charlotte: true,
		onremove: true,
		filter(event, player) {
			return get.type2(event.card) == "trick";
		},
		async content(event, trigger, player) {
			await player.draw(player.countMark(event.name));
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (get.type(card) == "trick") {
						return [1, 1];
					}
				},
			},
		},
		markimage: "image/card/handcard.png",
		intro: {
			content: "每打出1张战法牌摸#张牌",
		},
	},
	g_mjscaochuanjiejian: {
		cardSkill: true,
		trigger: {
			player: "damageBegin4",
		},
		forced: true,
		filter(event, player) {
			return player.hasUsableCard("mjscaochuanjiejian");
		},
		async content(event, trigger, player) {
			player
				.chooseToUse(card => {
					if (get.name(card) != "mjscaochuanjiejian") {
						return false;
					}
					return lib.filter.cardEnabled(card, player, "forceEnable");
				})
				.set("prompt", "###是否使用【草船借箭】###抵消即将受到的伤害，并获得即将对你造成伤害的牌")
				.set("goon", get.damageEffect(player, trigger.source, player, trigger.nature) < 0)
				.set("ai1", function (card) {
					return get.event("goon");
				})
				.forResult();
		},
	},
	mjszhiquhuarong_skill: {
		cardSkill: true,
		trigger: {
			global: "damageEnd",
		},
		forced: true,
		charlotte: true,
		onremove: true,
		filter(event, player) {
			return event.player.isIn() && player.getStorage("mjszhiquhuarong_skill").includes(event.player);
		},
		async content(event, trigger, player) {
			const targets = game
				.filterPlayer(target => {
					return target != trigger.player && target.inRange(trigger.player);
				})
				.sortBySeat(player);
			for (const target of targets) {
				await target
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"智取华容：是否对" + get.translation(trigger.player) + "使用一张杀？"
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
			}
		},
		mark: true,
		intro: {
			content: "当$受到伤害后，其他角色若攻击范围内包含该角色，可以立即对其打出1张杀",
		},
	},
	mjsqixingjifeng_effect: {
		name: "七星借风",
		cardSkill: true,
		trigger: {
			global: "damageBegin1",
		},
		forced: true,
		silent: true,
		charlotte: true,
		onremove: true,
		filter(event, player) {
			return event.hasNature("fire");
		},
		async content(event, trigger, player) {
			trigger.num += player.countMark(event.name);
		},
		markimage: "image/card/handcard.png",
		intro: {
			content: "所有火焰伤害+#",
		},
	},
	g_mjsqiqinqizong: {
		cardSkill: true,
		trigger: {
			source: "damageBegin2",
		},
		forced: true,
		filter(event, player) {
			return player.hasUsableCard("mjsqiqinqizong");
		},
		async content(event, trigger, player) {
			await player
				.chooseToUse(card => {
					if (get.name(card) != "mjsqiqinqizong") {
						return false;
					}
					return lib.filter.cardEnabled(card, player, "forceEnable");
				})
				.set("prompt", `###是否使用【七擒七纵】###防止你即将对${get.translation(trigger.player)}造成的伤害，改为获得其2张牌`)
				.set("ai1", function (card) {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					if (get.damageEffect(trigger.player, player, player) < 0) {
						return 1;
					}
					var att = get.attitude(player, trigger.player);
					if (event.num > 1) {
						if (att < 0) {
							return 0;
						}
						if (att > 0) {
							return 1;
						}
					}
					var cards = trigger.player.getGainableCards(player, "he");
					for (var i = 0; i < cards.length; i++) {
						if (get.equipValue(cards[i]) >= 6) {
							return 1;
						}
					}
					return 0;
				});
		},
	},
	mjskongchengji_skill: {
		name: "空城计",
		cardSkill: true,
		charlotte: true,
		onremove: true,
		mark: true,
		intro: {
			content: "你没有手牌时，无法成为手牌和技能的目标",
		},
		mod: {
			targetEnabled(card, player, target, now) {
	            if (target.countCards("h")) {
					return;
				}
				return false;
	        },
			skillEnabledx(player, target) {
				if (target.countCards("h")) {
					return;
				}
				return false;
			},
		},
	},
	mjskongchengji_clear: {
		charlotte: true,
		onremove(player2) {
			game.countPlayer2((current) => {
				if (current.getStorage("mjskongchengji_skill").includes(player2)) {
					current.unmarkAuto("mjskongchengji_skill", player2);
					current.removeAdditionalSkill(`mjskongchengji_${player2.playerid}`);
				}
			}, true);
		},
	},
	//桃花
	g_mjstaohua: {
		cardSkill: true,
		trigger: {
			player: "damageBegin4",
		},
		popup: false,
		filter(event, player) {
			return player.countCards("hs", "mjstaohua");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard("hs", card => {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					if (card.name != "mjstaohua") return false;
					const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") return mod2;
					const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") return mod;
					return true;
				})
				.set("ai", function (card) {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					if (get.damageEffect(player, trigger.source, player, trigger.nature) >= 0) {
						return 0;
					}
					return 10 - get.value(card);
				})
				.set("prompt", "你可以打出1张桃花，防止此次你受到的伤害")
				.forResult();
		},
		async content(event, trigger, player) {
			const chooseCardResultCards = event.cards;
			const next = player.respond(chooseCardResultCards);
			await next;
			trigger.cancel();
			game.log(player, "防止此次受到的伤害");
		},
	},
	//符水
	g_mjsfushui: {
		cardSkill: true,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		locked: false,
		popup: false,
		getIndex(event, player) {
			if (!event.getg) return [];
			return event.getg(player)?.filter(card => card.name == "mjsfushui");
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			await player.chooseUseTarget(card, true);
		},
	},

	//巫蛊人偶
	g_mjswugurenou: {
		cardSkill: true,
		trigger: {
			player: "phaseBegin",
		},
		popup: false,
		forced: true,
		locked: false,
		filter(event, player) {
			if (!player.countCards("h", "mjswugurenou")) {
				return false;
			}
			return game.hasPlayer(target => {
				return target != player && target.countCards("he");
			});
		},
		async content(event, trigger, player) {
			const targets = game.filterPlayer(target => {
				return target != player && target.countCards("he");
			});
			const func = async target => {
				const cards = target.getCards("he", card => {
					return lib.filter.cardDiscardable(card, player, "g_mjswugurenou");
				});
				if (cards.length > 0) {
					await target.discard(cards.randomGets(1)).set("discarder", player);
				}
			};
			await game.doAsyncInOrder(targets, func);
		},
	},

	//霜冻
	mjsshuangdong_debuff: {
		cardSkill: true,
		charlotte: true,
		mod: {
			playerEnabled(card, player, target) {
				if (target != player) {
					return false;
				}
			},
		},
		init(player, skill) {
			game.addGlobalSkill("mjsshuangdong_debuff_g");
		},
		onremove: (player) => {
	      if (!game.hasPlayer((current) => current.hasSkill("mjsshuangdong_debuff", null, null, false), true)) {
	        game.removeGlobalSkill("mjsshuangdong_debuff_g");
	      }
	    },
		name: "霜冻",
		mark: true,
		marktext: "冻",
		intro: {
			content: "无法选择其他角色为目标",
		},
		ai: {
			isRemoved: true,
		},
		subSkill: {
			g: {
				charlotte: true,
				mod: {
					skillEnabledx(player, target) {
						if (player.hasSkill("mjsshuangdong_debuff") && player != target) {
							return false;
						}
					},
				},
				trigger: {
	                player: "dieAfter",
	            },
	            filter: (event, player) => {
	              return !game.hasPlayer((current) => current.hasSkill("mjsshuangdong_debuff", null, null, false), true);
	            },
	            silent: true,
	            forceDie: true,
	            charlotte: true,
	            content: () => {
	              game.removeGlobalSkill("mjsshuangdong_debuff_g");
	            },
			},
		},
	},
};

const skill2 = {
	//赤兔
	mjschitu_skill: {
		equipSkill: true,
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getCards("e", card => {
				return get.skillsFromEquips([card]).includes("mjschitu_skill");
			});
			return cards.length ? cards : 1;
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			const num = card?.storage?.mjsstrengthen ? 2 : 1;
			await player.draw(num);
		},
		subSkill: {
			strengthen: {
				equipSkill: true,
				trigger: {
					player: "phaseBegin",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjschitu_skill_strengthen");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					await player.draw(2);
				},
			},
			weaken: {
				equipSkill: true,
				trigger: {
					player: "phaseBegin",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjschitu_skill_weaken");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					await player.draw();
					if (player.countCards("he")) {
						await player.chooseToDiscard("he", true);
					}
				},
			},
		},
	},
	//盗骊
	mjsdaoli_skill: {
		equipSkill: true,
		trigger: {
			player: "equipAfter",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const evt = event.getParent(2);
			if (evt.name == "useCard" && typeof evt.equipCount == "number") {
				return event.cards?.length ? event.cards.flatMap(card => Array(evt.equipCount).fill(card)) : [];
			}
	        return event.cards ?? [];
	    },
		filter(event, player, name, card) {
			return card?.name == "mjsdaoli" || card?.skills?.includes("mjsdaoli_skill");
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			const num = card?.storage?.mjsstrengthen ? 3 : 2;
	    	await player.draw(num);
		},
		subSkill: {
			strengthen: {
				equipSkill: true,
				trigger: {
					player: "equipAfter",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const evt = event.getParent(2);
					if (evt.name == "useCard" && typeof evt.equipCount == "number") {
						return event.cards?.length ? event.cards.flatMap(card => Array(evt.equipCount).fill(card)) : [];
					}
			        return event.cards ?? [];
			    },
				filter(event, player, name, card) {
					return card?.name == "mjsdaoli" || card?.skills?.includes("mjsdaoli_skill_strengthen");
				},
				async content(event, trigger, player) {
			    	await player.draw(3);
				},
			},
			weaken: {
				equipSkill: true,
				trigger: {
					player: "equipAfter",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const evt = event.getParent(2);
					if (evt.name == "useCard" && typeof evt.equipCount == "number") {
						return event.cards?.length ? event.cards.flatMap(card => Array(evt.equipCount).fill(card)) : [];
					}
			        return event.cards ?? [];
			    },
				filter(event, player, name, card) {
					return card?.name == "mjsdaoli" || card?.skills?.includes("mjsdaoli_skill_weaken");
				},
				async content(event, trigger, player) {
			    	await player.draw();
				},
			},
		},
	},
	//白蹄乌
	mjsbaitiwu_skill: {
		equipSkill: true,
		trigger: {
			source: "dieAfter",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getCards("e", card => {
				return get.skillsFromEquips([card]).includes("mjsbaitiwu_skill");
			});
			return cards.length ? cards : 1;
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			const num = card?.storage?.mjsstrengthen ? 5 : 3;
			await player.draw(num);
		},
		subSkill: {
			strengthen: {
				equipSkill: true,
				trigger: {
					source: "dieAfter",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjsbaitiwu_skill_strengthen");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					await player.draw(5);
				},
			},
			weaken: {
				equipSkill: true,
				trigger: {
					source: "dieAfter",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjsbaitiwu_skill_weaken");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	//飒露紫
	mjssaluzi_skill: {
		equipSkill: true,
		trigger: {
			player: "dying",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getCards("e", card => {
				return get.skillsFromEquips([card]).includes("mjssaluzi_skill");
			});
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return !player.hasSkill("mjssaluzi_skill_used");
		},
		async content(event, trigger, player) {
			player.addTempSkill("mjssaluzi_skill_used");
			const card = event.indexedData;
			const num = card?.storage?.mjsstrengthen ? player.maxHp : 1;
			await player.recoverTo(num);
			await player.draw(3);
			if (get.itemtype(card) == "card") {
				game.log(card, "被销毁了");
				await player.lose(card, "toDestroy", ui.special);
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			strengthen: {
				equipSkill: true,
				trigger: {
					player: "dying",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjssaluzi_skill_strengthen");
					});
					return cards.length ? cards : 1;
				},
				filter(event, player) {
					return !player.hasSkill("mjssaluzi_skill_used");
				},
				async content(event, trigger, player) {
					player.addTempSkill("mjssaluzi_skill_used");
					const card = event.indexedData;
					await player.recoverTo(player.maxHp);
					await player.draw(3);
					if (get.itemtype(card) == "card") {
						game.log(card, "被销毁了");
						await player.lose(card, "toDestroy", ui.special);
					}
				},
			},
			weaken: {
				equipSkill: true,
				trigger: {
					player: "dying",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjssaluzi_skill_weaken");
					});
					return cards.length ? cards : 1;
				},
				filter(event, player) {
					return !player.hasSkill("mjssaluzi_skill_used");
				},
				async content(event, trigger, player) {
					player.addTempSkill("mjssaluzi_skill_used");
					const card = event.indexedData;
					await player.recover();
					await player.draw(2);
					if (get.itemtype(card) == "card") {
						game.log(card, "被销毁了");
						await player.lose(card, "toDestroy", ui.special);
					}
				},
			},
		},
	},
	//爪黄飞电
	mjszhuahuangfeidian_skill: {
		equipSkill: true,
		trigger: {
			player: "phaseEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getCards("e", card => {
				return get.skillsFromEquips([card]).includes("mjszhuahuangfeidian_skill");
			});
			return cards.length ? cards : 1;
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			const num = card?.storage?.mjsstrengthen ? 2 : 1;
			await player.draw(num);
		},
		subSkill: {
			strengthen: {
				equipSkill: true,
				trigger: {
					player: "phaseEnd",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjszhuahuangfeidian_skill_strengthen");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					await player.draw(2);
				},
			},
			weaken: {
				equipSkill: true,
				trigger: {
					player: "phaseEnd",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjszhuahuangfeidian_skill_weaken");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	//绝影
	mjsjueying_skill: {
		equipSkill: true,
		trigger: {
			target: "useCardToTarget",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getCards("e", card => {
				return get.skillsFromEquips([card]).includes("mjsjueying_skill");
			});
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			const num = card?.storage?.mjsstrengthen ? 2 : 1;
			await player.draw(num);
		},
		subSkill: {
			strengthen: {
				equipSkill: true,
				trigger: {
					target: "useCardToTarget",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjsjueying_skill_strengthen");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					await player.draw(2);
				},
			},
			weaken: {
				equipSkill: true,
				trigger: {
					target: "useCardToTarget",
				},
				usable: 1,
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjsjueying_skill_weaken");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	//的卢
	mjsdilu_skill: {
		equipSkill: true,
		trigger: {
			player: "damageEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getCards("e", card => {
				return get.skillsFromEquips([card]).includes("mjsdilu_skill");
			});
			return cards.length ? cards : 1;
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			if (card?.storage?.mjsstrengthen) {
				await player.draw(2);
				return;
			}
			const judgeEvent = player.judge(card => {
				if (get.number(card) >= 1 && get.number(card) <= 7) return 2;
				if (get.number(card) == 8) return -4;
				return -2;
			});
			judgeEvent.judge2 = result => result?.bool;
			const result = await judgeEvent.forResult();
			if (get.number(result) >= 1 && get.number(result) <= 7) {
				await player.draw(2);
			} else if (get.number(result) == 8) {
				await player.modedDiscard(player.getCards("he"));
				if (get.itemtype(card) == "card") {
					game.log(card, "被销毁了");
					await player.lose(card, "toDestroy", ui.special);
				}
			}
		},
		subSkill: {
			strengthen: {
				equipSkill: true,
				trigger: {
					player: "damageEnd",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjsdilu_skill_strengthen");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					await player.draw(2);
				},
			},
			weaken: {
				equipSkill: true,
				trigger: {
					player: "damageEnd",
				},
				silent: true,
				popup: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjsdilu_skill_weaken");
					});
					return cards.length ? cards : 1;
				},
				async content(event, trigger, player) {
					const card = event.indexedData;
					const judgeEvent = player.judge(card => {
						if (get.number(card) >= 1 && get.number(card) <= 7) return 2;
						if (get.number(card) == 8) return -4;
						return -2;
					});
					judgeEvent.judge2 = result => result?.bool;
					const result = await judgeEvent.forResult();
					if (get.number(result) >= 1 && get.number(result) <= 7) {
						await player.draw();
					} else if (get.number(result) == 8) {
						await player.modedDiscard(player.getCards("he"));
						return;
						if (get.itemtype(card) == "card") {
							game.log(card, "被销毁了");
							await player.lose(card, "toDestroy", ui.special);
						}
					}
				},
			},
		},
	},
	//乌骓
	mjswuzhui_skill: {
		equipSkill: true,
		trigger: {
			player: ["useCard", "respond"],
		},
		silent: true,
		popup: false,
		locked: false,
		getIndex(event, player) {
			const cards = player.getCards("e", card => {
				return get.skillsFromEquips([card]).includes("mjswuzhui_skill");
			});
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			const num = card?.storage?.mjsstrengthen ? 2 : 1;
			await player.draw(num);
		},
		subSkill: {
			strengthen: {
				equipSkill: true,
				trigger: {
					player: ["useCard", "respond"],
				},
				forced: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjswuzhui_skill_strengthen");
					});
					return cards.length ? cards : 1;
				},
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					await player.draw(2);
				},
			},
			weaken: {
				equipSkill: true,
				trigger: {
					player: ["useCard", "respond"],
				},
				usable: 1,
				forced: true,
				locked: false,
				getIndex(event, player) {
					const cards = player.getCards("e", card => {
						return get.skillsFromEquips([card]).includes("mjswuzhui_skill_weaken");
					});
					return cards.length ? cards : 1;
				},
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	//银狮盔
	mjsyinshikui_skill: {
		equipSkill: true,
		trigger: {
			player: "damageBegin4",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsyinshikui");
			return cards.length ? cards : 1;
		},
		filter(event, player, triggername, card) {
			if (event.num <= 1) {
				return false;
			}
			if (get.is.mjsWeakenedCard(card, player)) {
				return false;
			}
			if (player.hasSkillTag("unequip2")) {
				return false;
			}
			if (
				event.source &&
				event.source.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			if (get.is.mjsStrengthenedCard(card)) {
				trigger.cancel();
			} else {
				trigger.num = 1;
			}
			if (get.itemtype(card) == "card") {
				game.log(card, "被销毁了");
				await player.lose(card, "toDestroy", ui.special);
			}
		},
	},
	mjsyinshikui_equip: {
		equipSkill: true,
		charlotte: true,
		trigger: {
	        player: "equipAfter",
	    },
	    silent: true,
		popup: true,
		locked: false,
	    getIndex(event, player) {
	        const evt = event.getParent(2);
	        if (evt.name == "useCard" && typeof evt.equipCount == "number") {
	            return event.cards?.length ? event.cards.flatMap(card => Array(evt.equipCount).fill(card)) : [];
	        }
	        return event.cards ?? [];
	    },
	    filter(event, player, name, card) {
	    	if (player.isHealthy()) {
	    		return false;
	    	}
	        return card?.name == "mjsyinshikui";
	    },
	    async content(event, trigger, player) {
	        const card = event.indexedData;
	        const num = get.is.mjsStrengthenedCard(card) ? 2 : 1;
	        await player.recover(num);
	    },
	},
	//凤羽盔
	mjsfengyukui_skill: {
		equipSkill: true,
		locked: false,
		mod: {
			maxHandcard(player, num) {
				const count = player.getEquips("mjsfengyukui").reduce((sum, card) => {
					sum += get.is.mjsStrengthenedCard(card, player) ? 4 : get.is.mjsWeakenedCard(card, player) ? 1 : 2;
					return sum;
				}, 0);
				return num + count;
			},
		},
	},
	//玄武盾
	mjsxuanwudun_skill: {
		equipSkill: true,
		trigger: {
			target: "useCardToTarget",
		},
		silent: true,
		forced: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsxuanwudun");
			return cards.length ? cards : 1;
		},
		filter(event, player, triggername, card) {
			if (event.card.name != "sha") return false;
			if (
				event.player &&
				event.player.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return false;
			}
			return player.countCards(card?.storage?.mjsstrengthen ? "he" : "h", card => {
				if (card?.storage?.mjsstrengthen) return true;
				return card.name == "sha";
			});
		},
		async cost(event, trigger, player) {
			const card = event.indexedData;
			event.result = await player
				.chooseCard(get.prompt2(event.skill), "hs", card => {
					const player = get.player();
					if (!get.event().strengthen && get.name(card) !== "sha") {
						return false;
					}
					if (get.event().weaken && game.hasNature(card)) {
						return false;
					}
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
					const player = get.player();
					const trigger = get.event().getTrigger();
					if (get.effect(player, trigger.card, trigger.player, player) <= 0) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("strengthen", card?.storage?.mjsstrengthen)
				.set("weaken", get.is.mjsWeakenedCard(card))
				.forResult();
		},
		async content(event, trigger, player) {
			const next = player.respond(event.cards, event.name, "highlight", "noOrdering");
			await next;
			trigger.getParent().excluded.add(player);
		},
		ai: {
			effect: {
				target(card) {
					if (card.name === "sha") {
						return [1, 0.35];
					}
				},
			},
		},
	},
	//八卦盾
	mjsbaguadun_skill: {
		equipSkill: true,
		trigger: {
			target: "useCardToTarget",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsbaguadun");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			if (event.card.name != "sha") return false;
			if (
				event.player &&
				event.player.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			const strengthen = card?.storage?.mjsstrengthen;
			const weaken = get.is.mjsWeakenedCard(card);
			const judgeEvent = player.judge(card => {
				if (strengthen) {
					if (["club", "spade"].includes(get.suit(card))) {
						return get.recoverEffect(player, player, player) + 2;
					}
				} else if (weaken) {
					if (get.suit(card) == "spade") return 2;
					return -2;
				}
				if (get.suit(card) == "club") return get.recoverEffect(player, player, player);
				if (get.suit(card) == "spade") return 2;
				return -2;
			});
			judgeEvent.judge2 = result => result?.bool;
			const result = await judgeEvent.forResult();
			if (strengthen) {
				if (["club", "spade"].includes(result.suit)) {
					await player.recover();
					trigger.getParent().excluded.add(player);
				}
			} else if (!weaken && result.suit == "club") {
				await player.recover();
			} else if (result.suit == "spade") {
				trigger.getParent().excluded.add(player);
			}
		},
		ai: {
			effect: {
				target(card) {
					if (card.name === "sha") {
						return [1, 0.4];
					}
				},
			},
		},
	},
	//云锦袍
	mjsyunjinpao_skill: {
		equipSkill: true,
		mod: {
			maxEquipBase(player, num) {
				const count = player.getEquips("mjsyunjinpao").reduce((sum, card) => {
					sum += get.is.mjsStrengthenedCard(card, player) ? 3 : get.is.mjsWeakenedCard(card, player) ? 1 : 2;
					return sum;
				}, 0);
				return num + count;
			},
		},
	},
	//藤甲
	mjstengjia_skill: {
		equipSkill: true,
		trigger: {
			player: ["damageBegin3", "damageBegin4"],
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjstengjia");
			return cards.length ? cards : 1;
		},
		filter(event, player, name) {
			if (player.hasSkillTag("unequip2")) {
				return false;
			}
			if (
				event.source &&
				event.source.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return false;
			}
			return (!event.hasNature() && name == "damageBegin4") || (event.hasNature("fire") && name == "damageBegin3");
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			if (!trigger.hasNature()) {
				trigger.cancel();
			} else {
				if (!get.is.mjsStrengthenedCard(card)) {
					trigger.num++;
				}
				if (get.is.mjsWeakenedCard(card)) {
					return;
				}
				if (get.itemtype(card) == "card") {
					game.log(card, "被销毁了");
					await player.lose(card, "toDestroy", ui.special);
				}
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (card.name == "sha") {
						if (game.hasNature(card, "fire")) {
							return 2;
						}
						if (player.hasSkill("zhuque_skill")) {
							return 1.9;
						}
					}
					if (get.tag(card, "fireDamage") && current < 0) {
						return 2;
					}
					if (get.tag(card, "damage") && !get.tag(card, "natureDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	//亮银枪
	mjsliangyinqiang_skill: {
		equipSkill: true,
		trigger: {
			target: "useCardToTarget",
			player: "damageEnd",
		},
		silent: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsliangyinqiang");
			return cards.length ? cards : 1;
		},
		filter(event, player, triggername, card) {
			if (event.name == "damage") {
				if (!get.is.mjsWeakenedCard(card)) {
					return false;
				}
			}
			if (event.card?.name != "sha") {
				return false;
			}
			if (lib.filter.autoRespondSha.call({ player: player })) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			const next = player
				.chooseToUse(`###${get.prompt(event.name)}###对${get.translation(trigger.player)}使用一张${card?.storage?.mjsstrengthen ? "强命的" : ""}杀`)
				.set("filterCard", function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				})
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("sourcex", trigger.player)
				.set("oncard")
				.set("addCount", false)
				.set("logSkill", event.name)
				.forResult();
			if (get.is.mjsStrengthenedCard(card)) {
				next.set("oncard", (card, player) => {
					_status.event.directHit.addArray(game.filterPlayer());
					game.log(card, "强命");
				});
			}
			await next;
		},
	},
	//诸葛连弩
	mjszhugeliannu_skill: {
		equipSkill: true,
		trigger: {
			player: "useCardToPlayer",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (event.getParent()._mjszhugeliannu_skill) {
				return false;
			}
			return event.card.name == "sha";
		},
		check(event, player) {
			return player.countCards("h", "sha") && get.attitude(player, event.target) <= 0;
		},
		logTarget: "target",
		prompt2(event, player, triggername, card) {
			if (get.is.mjsStrengthenedCard(card)) {
				return `出杀，你可以对${get.translation(event.target)}依次打出手牌中的所有杀。`;
			} else if (get.is.mjsWeakenedCard(card)) {
				return `出杀，你可以对${get.translation(event.target)}依次打出手牌中的2张杀。`;
			}
			return `出杀，你可以对${get.translation(event.target)}依次打出手牌中的所有杀，直到有目标因此重伤。`;
		},
		async content(event, trigger, player) {
			//by萌新转型中，感谢萌喵！
			const target = trigger.target;
			player
				.when("useCardAfter")
				.filter(evt => evt === trigger.getParent() && target.isIn())
				.step(async (event, trigger, player) => {
					event.count = 0;
					const strengthen = player => player.getEquips("mjszhugeliannu").some(card => card?.storage?.mjsstrengthen);
					if (strengthen(player) || !game.hasGlobalHistory("everything", evt => evt.name == "dying" && evt.getParent(3) === trigger)) {
						while (player.hasSkill("mjszhugeliannu_skill")) {
							const cards = player.getCards("h", card => {
								return get.name(card, player) == "sha" && player.canUse(card, target);
							});
							if (!cards.length) {
								break;
							}
							const weaken = player.getEquips("mjszhugeliannu").every(card => get.is.mjsWeakenedCard(card, player));
							if (weaken) {
								event.count++
							}
							const card = cards.randomGet();
							const next = player.useCard(card, target, false);
							next._mjszhugeliannu_skill = true;
							await next;
							if (!strengthen(player) && weaken && event.count >= 2) {
								break;
							}
							else if (!strengthen(player) && game.hasGlobalHistory("everything", evt => evt.name == "dying" && evt.getParent(3) === next)) {
								break;
							}
						}
					}
				});
		},
	},
	//羽扇
	mjsyushan_skill: {
		equipSkill: true,
		trigger: {
			source: "damageBegin1",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsyushan");
			return cards.length ? cards : 1;
		},
		filter(event, player, triggername, card) {
			if (!event.hasNature("fire")) {
				return false;
			}
			if (get.is.mjsWeakenedCard(card, player)) {
				return !player.getHistory("sourceDamage").length;
			}
			return true;
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
		group: "mjsyushan_skill_effect",
		subSkill: {
			effect: {
				trigger: {
					source: "damageSource",
				},
				popup: false,
				forced: true,
				locked: false,
				getIndex(event, player) {
					return player.getEquips("mjsyushan").filter(card => card?.storage?.mjsstrengthen).length;
				},
				filter(event, player) {
					return event.hasNature("fire") && !event._mjsyushan_skill;
				},
				async content(event, trigger, player) {
					trigger.player.addSkill("mjsyushan_skill_debuff");
					trigger.player.addMark("mjsyushan_skill_debuff", 1, false);
				},
			},
			debuff: {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				locked: false,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return player.hasMark("mjsyushan_skill_debuff");
				},
				async content(event, trigger, player) {
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					const next = player.damage(num, "fire");
					next.set("_mjsyushan_skill", true);
					await next;
				},
				marktext: "🔥",
				intro: {
					content: "下回合开始时受到#点火焰伤害",
				},
			},
		},
	},
	//青龙偃月刀
	mjsqinglongyanyuedao_skill: {
		equipSkill: true,
		trigger: {
			player: ["shaMiss", "eventNeutralized"],
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsqinglongyanyuedao");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			if (!event.card || event.card.name !== "sha") {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			if (!get.is.mjsWeakenedCard(card)) {
				const num = get.is.mjsStrengthenedCard(card, player) ? 2 : 1;
				player.addTempSkill("mjsqinglongyanyuedao_skill_sha");
				player.addMark("mjsqinglongyanyuedao_skill_sha", num, false);
			} else {
				player
		            .chooseToUse(
		                get.prompt(event.name, trigger.target),
		                function (card, player, event) {
		                    if (get.name(card) !== "sha") {
		                        return false;
		                    }
		                    if (!player.hasSkill("mjsqinglongyanyuedao_skill", null, false)) {
		                        var cards = player.getCards("e", card => get.name(card) == "mjsqinglongyanyuedao");
		                        if (!cards.some(card2 => card2 !== card && !ui.selected.cards.includes(card2))) {
		                            return false;
		                        }
		                    }
		                    return lib.filter.filterCard.apply(this, arguments);
		                },
		                trigger.target,
		                -1
		            )
		            .set("addCount", false);
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjsqinglongyanyuedao_skill_sha");
					},
				},
			},
		},
	},
	//方天画戟
	mjsfangtianhuaji_skill: {
		equipSkill: true,
		trigger: {
			player: "useCard2",
		},
		silent: true,
		forced: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsfangtianhuaji");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			if (event.card.name != "sha") return false;
			return game.hasPlayer(target => !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target));
		},
		async cost(event, trigger, player) {
			const card = event.indexedData;
			if (get.is.mjsStrengthenedCard(card)) {
				event.result = await player
					.chooseTarget(get.prompt(event.skill), "你可以令此杀的目标+1或+2。", [1, 2], (card, player, target) => {
						const event = get.event().getTrigger();
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					})
					.set("ai", target => {
						const player = get.event().player,
							event = get.event().getTrigger();
						return get.effect(target, event.card, player);
					})
					.forResult();
				return;
			}
			const range = get.is.mjsWeakenedCard(card) ? 1 : 2;
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard(card, player) {
						return lib.filter.cardDiscardable(card, player, "mjsfangtianhuaji_skill");
					},
					selectCard: [1, range],
					filterTarget(card, player, target) {
						const event = get.event().getTrigger();
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					},
					selectTarget() {
						return ui.selected.cards.length;
					},
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						const player = get.event().player,
							event = get.event().getTrigger();
						return get.effect(target, event.card, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, event.targets);
			if (event.cards?.length) {
				await player.discard(event.cards);
			}
			trigger.targets.addArray(event.targets);
			game.log(event.targets, "成为了", trigger.card, "的额外目标");
		},
	},
	//干将莫邪
	mjsganjiangmoye_skill: {
		equipSkill: true,
		trigger: {
			global: "useCard",
		},
		silent: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsganjiangmoye");
			return cards.length ? cards : 1;
		},
		filter(event, player, triggername, card) {
			if (event.card.name != "sha") {
				return false;
			}
			if (event.player == player) {
				return false;
			}
			if (!event.targets.some(target => player.inRange(target))) {
				return false;
			}
			if (card?.storage?.mjsstrengthen) {
				return true;
			}
			if (player.hasSkill("mjsganjiangmoye_skill_used")) {
				return false;
			}
			if (get.is.mjsWeakenedCard(card, player)) {
				return player.hasCards("he", card => lib.filter.cardDiscardable(card, player));
			}
			return true;
		},
		logTarget(event, player) {
			return event.targets?.filter(target => player.inRange(target));
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			const targets = trigger.targets.filter(target => player.inRange(target));
			if (!targets?.length) {
				return;
			}
			if (get.is.mjsWeakenedCard(card)) {
				const result = await player
					.chooseToDiscard(`干将莫邪：你可以弃置1张牌，对${get.translation(targets)}打出1张杀。`, "he", true)
					.set("ai", card => {
						const player = get.player();
						if (!player.hasSha()) {
							return 0;
						}
						return 6 - get.value(card);
					})
					.forResult();
				if (!result?.bool) {
					return;
				}
				player.logSkill(event.name);
			}
			const next = player
				.chooseToUse("干将莫邪：是否对" + get.translation(targets) + "打出一张杀？", function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				})
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (!get.event().targets.includes(target)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("targets", targets)
				.set("logSkill", event.name)
				.set("addCount", false);
			next.set("onresult", result => {
				player.addTempSkill("mjsganjiangmoye_skill_used");
			});
			await next;
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	//龙舌弓
	mjslongshegong_skill: {
		equipSkill: true,
		trigger: {
			source: "damageSource",
			player: "useCardToPlayer",
		},
		silent: true,
		forced: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjslongshegong");
			return cards.length ? cards : 1;
		},
		filter(event, player, triggername, card) {
			if (event.name == "damage") {
				return !card?.storage?.mjsstrengthen && event.card?.name === "sha" && event.player.countDiscardableCards(player, "hej");
			}
			return event.card.name == "sha" && card?.storage?.mjsstrengthen && event.target.countDiscardableCards(player, "hej");
		},
		async cost(event, trigger, player) {
			const target = trigger.name == "damage" ? trigger.player : trigger.target;
			if (get.is.mjsWeakenedCard(event.indexedData)) {
				const cards = target.getCards("hej", card => {
                    return lib.filter.cardDiscardable(card, target, "mjslongshegong_skill");
                });
                if (!cards.length) {
                	return;
                }
				event.result = { bool: true, cards: cards.randomGets(1) };
				return;
			}
			event.result = await player
				.discardPlayerCard(target, "hej")
				.set("prompt", get.prompt(event.skill, target))
				.set("prompt2", "你可以选择其任意区域的1张牌")
				.set("chooseonly", true)
				.set("forceAuto", true)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = trigger.name == "damage" ? trigger.player : trigger.target;
			player.logSkill(event.name, target);
			await target.discard(event.cards).set("discarder", player);
		},
	},
	//惊羽弓
	mjsjingyugong_skill: {
		equipSkill: true,
		mod: {
			aiOrder(player, card, num) {
				if (player.hasSkill("mjsjingyugong_skill_unCheck")) {
					return;
				}
	            if (get.type(card) == "basic" && card.name != "sha") {
	                return num - 5;
	            }
	        },
		},
		trigger: {
			player: "useCard",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjslongshegong");
			return cards.length ? cards : 1;
		},
		filter(event, player, triggername, card) {
			if (event.card.name != "sha") {
				return false;
			}
			return player
				.getHistory("useCard", evt => {
					if (get.is.mjsStrengthenedCard(card)) {
						return evt.card.name == "sha";
					} else if (get.is.mjsWeakenedCard(card)) {
						return true;
					}
					return get.type(evt.card) == "basic";
				})
				.indexOf(event) == 0;
		},
		async content(event, trigger, player) {
			trigger.directHit.addArray(game.filterPlayer());
			game.log(trigger.card, "强命");
		},
		subSkill: {
			unCheck: {
				charlotte: true,
			},
		},
	},
	//鸣鸿刀
	mjsminghongdao_skill: {
		equipSkill: true,
		trigger: {
			player: ["useCardToPlayered", "shaMiss", "eventNeutralized"],
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsminghongdao");
			return cards.length ? cards : 1;
		},
		filter(event, player, triggername, card) {
			if (event.card.name != "sha") {
				return false;
			}
			if (triggername == "useCardToPlayered") {
				return !event.getParent().directHit.includes(event.target);
			}
			if (event.type !== "card" || event.card?.name !== "sha") {
				return false;
			}
			if (card?.storage?.mjsstrengthen) return false;
			return player.countCards("he");
		},
		logTarget: "target",
		async content(event, trigger, player) {
			if (event.triggername == "useCardToPlayered") {
				const id = trigger.target.playerid;
				const map = trigger.getParent().customArgs;
				if (!map[id]) {
					map[id] = {};
				}
				if (typeof map[id].shanRequired == "number") {
					//map[id].shanRequired++;
					map[id].shanRequired = 2;
				} else {
					map[id].shanRequired = 2;
				}
			} else {
				const cards = player.getCards("he", card => {
					return lib.filter.cardDiscardable(card, player, "mjsminghongdao_skill");
				});
				if (cards.length > 0) {
					await player.discard(cards.randomGets(1));
				}
				const card = event.indexedData;
				if (get.is.mjsWeakenedCard(card)) {
					if (get.itemtype(card) == "card") {
			            game.log(card, "被销毁了");
			            await player.lose(card, "toDestroy", ui.special);
			        }
				}
			}
		},
		ai: {
			halfneg: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) {
					return false;
				}
			},
		},
	},
	//开山斧
	mjskaishanfu_skill: {
		equipSkill: true,
		trigger: {
			player: "useCard",
		},
		silent: true,
		popup: true,
		forced: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjskaishanfu");
			return cards.length ? cards : 1;
		},
		filter(event, player, triggername, card) {
			if (event.card.name != "sha") return false;
			var min = 2;
			if (!player.hasSkill("mjskaishanfu_skill", null, false)) {
				min += get.sgn(player.getCards("e", card => get.name(card) == "mjskaishanfu").length);
			}
			return card?.storage?.mjsstrengthen || player.countCards("he") >= min;
		},
		async cost(event, trigger, player) {
			const card = event.indexedData;
			if (card?.storage?.mjsstrengthen) {
				event.result = await player.chooseBool(get.prompt(event.skill), "你可以令此杀伤害+1。").forResult();
				return;
			}
			const cost = get.is.mjsWeakenedCard(card) ? 2 : 1;
			event.result = player
				.chooseToDiscard(get.prompt(event.skill), "he", cost, "chooseonly", (card, player) => {
					if (_status.event.ignoreCard) {
						return true;
					}
					var cards = player.getCards("e", card => get.name(card) == "mjskaishanfu");
					if (!cards.includes(card)) {
						return true;
					}
					return cards.some(cardx => cardx !== card && !ui.selected.cards.includes(cardx));
				})
				.set("ignoreCard", player.hasSkill("mjskaishanfu_skill", null, false))
				.set("ai", function (card) {
					const player = get.player();
					const trigger = get.event().getTrigger();
					const sum = trigger.targets?.reduce((sum, target) => {
						if (
							target.hasSkillTag("nodamage", null, {
								source: player,
								card: trigger.card,
								natures: get.natureList(trigger.card),
							})
						) {
							return sum;
						}
						sum += get.effect(target, trigger.card, player);
						return sum;
					}, 0);
					if (sum < trigger.targets.length) {
						return 0;
					}
					return 7 - get.value(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			if (event.cards?.length) {
				await player.discard(event.cards);
			}
			trigger.baseDamage++;
		},
	},
	//轩辕剑
	mjsxuanyuanjian_skill: {
		equipSkill: true,
		trigger: {
			player: "useCardToPlayer",
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			const cards = player.getEquips("mjsxuanyuanjian");
			return cards.length ? cards : 1;
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target,
				card = event.indexedData;
			if (get.is.mjsStrengthenedCard(card)) {
				target.addTempSkill("mjs_debuff_fengjin", { player: "phaseBegin" });
			} else if (!get.is.mjsWeakenedCard(card)) {
				target.addTempSkill("mjs_debuff_fengjin");
			}
			target.addTempSkill("qinggang2");
			target.storage.qinggang2.add(trigger.card);
			game.log(trigger.card, "无视防具");
		},
	},
};
Object.assign(skill, skill2);

const skill4 = {
	nu: {
		trigger: {
	        player: "useCard1",
	    },
	    forced: true,
	    charlotte: true,
	    firstDo: true,
	    filter(event) {
	        return event.card && event.card.name == "sha";
	    },
	    content() {
	        if (!trigger.baseDamage) {
	            trigger.baseDamage = 1;
	        }
	        trigger.baseDamage += player.storage.nu;
	        trigger.nu = true;
	        trigger.nu_add = player.storage.nu;
	        if (lib.skill.jiu2.filter(trigger, player)) {
	            game.broadcastAll(function (player) {
	                player.removeSkill("nu");
	            }, player);
	            game.addVideo("jiuNode", player, false);
	        }
	    },
	    temp: true,
	    vanish: true,
	    silent: true,
	    popup: false,
	    nopop: true,
	    onremove(player) {
	        if (player.node.nu) {
	            player.node.nu.delete();
	            player.node.nu2.delete();
	            delete player.node.nu;
	            delete player.node.nu2;
	        }
	        delete player.storage.nu;
	    },
	    ai: {
	        damageBonus: true,
	        skillTagFilter(player, tag, arg) {
	            if (tag === "damageBonus") {
	                return arg && arg.card && arg.card.name === "sha";
	            }
	        },
	    },
	    group: "nu_clear",
	    subSkill: {
	    	clear: {
	    		trigger: {
			        player: "useCardAfter",
			        global: "phaseAfter",
			    },
			    priority: 2,
			    firstDo: true,
			    charlotte: true,
			    filter(event, player) {
			        if (event.name == "useCard") {
			            return event.card && event.card.name == "sha";
			        }
			        return true;
			    },
			    forced: true,
			    popup: false,
			    audio: false,
			    content() {
			        game.broadcastAll(function (player) {
			            player.removeSkill("nu");
			        }, player);
			        game.addVideo("jiuNode", player, false);
			    },
	    	},
	    },
	},
	g_yi: {
		cardSkill: true,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
	        return get
	            .inpileVCardList(info => {
	            	if (info[3]) return false;
	                return ["basic", "trick", "delay"].includes(info[0]);
	            })
	            .some(info =>
	                player.hasCard(cardx => {
	                    if (cardx.name != "yi") {
	                        return false;
	                    }
	                    if (["trick", "delay"].includes(info[0]) && !cardx.storage?.mjsstrengthen) {
	                    	return false;
	                    }
	                    const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { zombiechuce: true }, cards: [cardx] }, [cardx]);
	                    return event.filterCard(card, player, event);
	                }, "hs")
	            );
	    },
	    chooseButton: {
	        dialog(event, player) {
	            const list = get
		            .inpileVCardList(info => {
		            	if (info[3]) return false;
		                return ["basic", "trick", "delay"].includes(info[0]);
		            })
		            .filter(info =>
		                player.hasCard(cardx => {
		                    if (cardx.name != "yi") {
		                        return false;
		                    }
		                    if (["trick", "delay"].includes(info[0]) && !cardx.storage?.mjsstrengthen) {
		                    	return false;
		                    }
		                    const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { yi: true }, cards: [cardx] }, [cardx]);
		                    return event.filterCard(card, player, event);
		                }, "hs")
		            );
		        const dialog = ui.create.dialog("易", [list, "vcard"]);
		        dialog.direct = true;
	            return dialog;
	        },
	        filter(button, player) {
	            const event = get.event().getParent();
	            return player.hasCard(cardx => {
	                if (cardx.name != "yi") {
	                    return false;
	                }
	                const card = get.autoViewAs({ name: button.link[2], nature: button.link[3], storage: { zombiechuce: true }, cards: [cardx] }, [cardx]);
	                return event.filterCard(card, player, event);
	            }, "hs");
	        },
	        check(button) {
	            if (get.event().getParent().type != "phase") {
	                return 1;
	            }
	            return get.player().getUseValue({ name: button.link[2], nature: button.link[3] }, false);
	        },
	        prompt(links, player) {
	            return "将一张易当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
	        },
	        backup(links, player) {
	            return {
	            	viewAs: {
	                    name: links[0][2],
	                },
	                filterCard(card, player) {
	                	if (card.name !== "yi") {
	                		return false;
	                	}
	                	if (["trick", "delay"].includes(get.type(get.card()))) {
	                		return card?.storage?.mjsstrengthen;
	                	}
	                    return true;
	                },
	                popname: true,
	                check(card) {
	                    return 10 - get.value(card);
	                },
	                position: "hs",
	                log: false,
	                async precontent(event, trigger, player) {},
	            };
	        },
	    },
	    hiddenCard(player, name) {
	        if (!lib.inpile.includes(name) || !["basic", "trick"].includes(get.type2(name))) {
	            return false;
	        }
	        const type = get.type2(name);
	        return player.hasCards(
	        	"hs",
	        	card => {
	        		if (_status.connectMode && get.position(card) === "h") {
		                return true;
		            }
		            if (card.name !== "yi") {
		            	return false;
		            }
		            return card?.storage?.mjsstrengthen || type != "trick";
		        }
	        );
	    },
	    ai: {
	        fireAttack: true,
	        respondSha: true,
	        skillTagFilter(player, tag, arg) {
	            if (!player.countCards("hs", { name: "yi" })) {
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
	    },
	},
};
Object.assign(skill, skill4);

export default skill;
