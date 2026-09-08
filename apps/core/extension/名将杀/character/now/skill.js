import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//终军
	/**弃繻 
	 * 出牌阶段限1次，你可以令一名其他角色选择展示其1张手牌，然后你可以弃置任意张点数和与展示牌相同的牌，对其造成1点伤害，若此过程中你只弃置了1张牌，重置此技能。
	 * */
	mjsqiru: {
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		async content(event, trigger, player) {
			const target = event.target;
			const result = await target
				.chooseCard("选择展示1张手牌", true)
				.set("ai", card => {
					return 1 + Math.random();
				})
				.forResult();
			if (result?.cards?.length) {
				const num = result.cards[0].number;
				await target.showCards(result.cards, true).set("clearArena", false);
				const result2 = await player
					.chooseToDiscard(`你可弃置任意张点数之和等于${num}的牌并对${get.translation(target)}造成1点伤害`, "he", [1, Infinity])
					.set("filterOk", () => {
						return ui.selected.cards.reduce((sum, card) => sum + card.number, 0) == get.event().num;
					})
					.set("num", num)
					.forResult();
				if (result2?.bool) {
					await target.damage();
					if (result2.cards?.length == 1) {
						player.refreshSkill(event.name);
					}
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					return get.damageEffect(target, player);
				},
			},
		},
	},
	/**请缨
	 * 出牌阶段开始时，你可以令一名其他角色交给你至少1张牌，然后直到回合结束，当你造成伤害时，其摸1张牌。
	 * 出牌阶段开始时，你可以令一名其他角色交给你至少1张牌，然后直到回合结束，当你造成伤害时，你与其各摸1张牌。
	 * */
	mjsqingying: {
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        player: "phaseUseBegin",
	    },
	    silent: true,
	    forced: false,
	    async cost(event, trigger, player) {
	        event.result = await player
	            .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
	                return target != player && target.countCards("he");
	            })
	            .set("ai", target => {
	                const player = get.player();
	                return get.attitude(player, target);
	            })
	            .forResult();
	    },
	    async content(event, trigger, player) {
	        const target = event.targets[0];
	        player.logSkill(event.name, target);
	        const result = await target
	            .chooseToGive(player, "he", [1, Infinity], "allowChooseAll")
	            .set("ai", card => {
	                const player = get.player();
	                const source = get.event().getParent().player;
	                const att = get.attitude(player, source);
	                if (ui.selected.cards.length >= 2) {
	                    return 0;
	                }
	                if (att > 0) {
	                    return 8 - get.value(card);
	                }
	                return 0;
	            })
	            .forResult();
	        if (result?.bool) {
	            player.addTempSkill("mjsqingying_effect");
	            player.markAuto("mjsqingying_effect", [target]);
	        }
	    },
	    subSkill: {
	    	effect: {
	    		trigger: {
	    			source: "damageSource",
	    		},
	    		silent: true,
	    		popup: true,
	    		async content(event, trigger, player) {
	    			const targets = player.getStorage(event.name);
	    			await game.asyncDraw(targets);
	    		},
	    	},
	    },
	},
	//韩安国
	/**强弩之末
	 * 当一名其他角色失去最后的手牌时，你可以令其受到的下1次伤害+1，并且下回合手牌上限-1；或每个回合限1次，交给其至少1张手牌。
	 * 当一名其他角色失去最后的手牌时，你可以令其受到的下1次伤害+1，并且下回合手牌上限-1；或交给其至少1张手牌。
	 * */
	mjsqiangnuzhimo: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        global: ["loseAfter","equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
	    },
	    silent: true,
	    popup: true,
	    forced: false,
	    getIndex(event, player) {
	        return game.filterPlayer(function (target) {
	            if (target.countCards("h")) {
	                return false;
	            }
	            return event?.getl?.(target)?.hs?.length;
	        });
	    },
	    filter(event, player, triggername, target) {
	        return target != player;
	    },
	    logTarget(event, player, triggername, target) {
	        return target;
	    },
	    check(event, player, triggername, target) {
	    	const att = get.attitude(player, target);
	    	if (!player.hasCards("h") || player.hasSkill("mjsqiangnuzhimo_used")) {
	    		return att <= 0;
	    	}
	    	return true;
	    },
	    async content(event, trigger, player) {
	        const target = event.targets[0];
	        if (!player.hasCards("h") || player.hasSkill("mjsqiangnuzhimo_used")) {
	        	event.result = { bool: false };
	        } else {
	        	event.result = await player
		        	.chooseToGive(target, "h", `${mjs.prompt(event.name)}，选择交给${get.translation(target)}至少1张手牌，或取消令其受到的下1次伤害+1，并且下回合手牌上限-1`)
		        	.set("ai", card => {
		        		if (get.event().goon) {
		        			return 0;
		        		}
		        		return 20 - get.value(card);
		        	})
		        	.set(
		        		"goon",
		        		(() => {
		        			const att = get.attitude(player, target);
		        			return att <= 0;
		        		})()
		        	)
		        	.forResult();
	        }
	        if (!event?.result?.bool) {
	        	target.addTempSkill("mjsqiangnuzhimo_debuff");
	        	target.addMark("mjsqiangnuzhimo_debuff", 1, false);
	        	target.when("phaseBegin")
	        		.then(() => {
	        			target.addTempSkill("mjsqiangnuzhimo_max");
	        			target.addMark("mjsqiangnuzhimo_max", 1, false);
	        		});
	        }
	    },
		subSkill: {
			debuff: {
				trigger: {
	                player: "damageBegin3",
	            },
	            silent: true,
	            charlotte: true,
	            onremove: true,
	            async content(event, trigger, player) {
	                trigger.num += player.countMark(event.name);
	                player.removeSkill(event.name);
	            },
	            mark: true,
	            marktext: "末",
	            intro: {
	                content: "受到的下1次伤害+#",
	            },
			},
			max: {
				charlotte: true,
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("mjsqiangnuzhimo_max");
					},
				},
			},
		},
	},
	/**死灰复燃 
	 * 每个回合限1次，当你失去最后的手牌时，你可以摸牌至手牌上限，然后卜卦，若结果为♠，手牌上限-1；若结果为♥，手牌上限+1。
	 * */
	mjssihuifuran: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
            player: "loseAfter",
            global: ["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
        },
        usable: 1,
        silent: true,
        popup: true,
        forced: true,
        locked: false,
        filter(event, player) {
            if (player.countCards("h")) {
                return false;
            }
            const evt = event.getl(player);
            return evt?.player == player && evt?.hs?.length > 0;
        },
        async content(event, trigger, player) {
        	await player.drawTo(player.getHandcardLimit());
        	const next = player.judge(card => {
        		if (get.suit(card) == "spade") {
        			return -2;
        		} else if (get.suit(card) == "heart") {
        			return 2;
        		}
        		return 1;
        	});
        	const result = await next.forResult();
        	if (result?.suit == "spade") {
        		lib.skill.mjsallmax.change(player, -1);
        	} else if (result?.suit == "heart") {
        		lib.skill.mjsallmax.change(player, 1);
        	}
        },
	},
	//卫玠
	/**风神秀异
	 * 当你即将受到伤害时，若你的手牌上限＞体力值，则改为减少等量的手牌上限。当你打出牌时，每回合每种类型的牌限1次，若所有其他角色手牌中都不存在与此牌相同牌名的牌，则你的手牌上限
	 * 当你即将受到伤害时，若你的手牌上限＞体力值，则改为减少等量的手牌上限。当你打出行动牌或战法牌时，若所有其他角色手牌中都不存在与此牌相同牌名的牌，则你的手牌上限+1，并可以选择一名有手牌的角色，获得1张与其手牌中相同牌名的牌。
	 * 当你即将受到伤害时，若你的手牌上限＞体力值，则改为减少等量的手牌上限。当你打出牌时，若所有其他角色手牌中都不存在与此牌相同牌名的牌，则你的手牌上限+1，并可以选择一名有手牌的角色，获得1张与其手牌中相同牌名的牌。
	 * */
	mjsfengshenxiuyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["damageBegin4", "useCard", "respond"],
		},
		silent: true,
		popup: true,
		filter(event, player) {
			if (event.name == "damage") {
				return player.getHandcardLimit() > player.getHp(true);
			}
			if (player.hasStorage("mjsfengshenxiuyi_used", get.type2(event.card))) {
				return false;
			}
			return !game.hasPlayer(target => {
				if (target == player) {
					return false;
				}
				return target.hasCards("h", card => card.name == event.card.name);
			});
		},
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				trigger.cancel();
				lib.skill.mjsallmax.change(player, -trigger.num);
			} else {
				player.addTempSkill("mjsfengshenxiuyi_used");
				player.markAuto("mjsfengshenxiuyi_used", get.type2(trigger.card));
				lib.skill.mjsallmax.change(player, 1);
				const result = await player
					.chooseTarget(get.prompt(event.name), "选择一名角色并获得1张与其手牌中相同牌名的牌", (card, player, target) => {
						return target != player && target.countCards("h");
					})
					.set("ai", target => {
						const player = get.player();
						return 1 + Math.random();
					})
					.forResult();
				if (result?.targets?.length) {
					const [target] = result.targets;
					player.logSkill(event.name, target);
					const nameList = target.getCards("h").reduce((list, card) => list.add(card.name), []);
					const card = get.cardPile2(card => {
						return nameList.includes(card.name);
					});
					if (card) {
						await player.gain(card, "draw");
					}
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**珠玉在侧
	 * 当你打出牌后，你可以削弱一名与你距离最近的其他角色手牌中所有相同牌名的牌。 
	 * */
	mjszhuyuzaice: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		getClosest(player, target) {
	        const targets = game.filterPlayer();
	        targets.remove(player);
	        targets.sort(function (a, b) {
	            return Math.max(1, get.distance(player, a)) - Math.max(1, get.distance(player, b));
	        });
	        const distance = Math.max(1, get.distance(player, targets[0]));
	        for (let i = 1; i < targets.length; i++) {
	            if (Math.max(1, get.distance(player, targets[i])) > distance) {
	                targets.splice(i);
	                break;
	            }
	        }
	        return targets.includes(target);
	    },
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		silent: true,
		forced: false,
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(target => {
				return get.info("mjszhuyuzaice").getClosest(player, target) && target != player && target.countCards("h");
			});
			if (!targets.length) {
				return;
			}
			event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                	return get.event().targets.includes(target);
                })
                .set("targets", targets)
                .set("ai", target => {
                    const player = get.player();
                    const att = get.attitude(player, target);
                    const cards = target.getCards("h", card => {
                        return lib.filter.canBeWeakened(card, target, "mjszhuyuzaice");
                    });
                    return -att * cards.length;
                })
                .forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			player.logSkill(event.name, target);
			const cards = target.getCards("he", card => {
				if (card.name != trigger.card.name) {
					return false;
				}
                return lib.filter.canBeWeakened(card, target, "mjstaishixinlv_effect");
            });
            if (!cards.length) {
                return;
            }
            await target.mjsWeakenCards(cards, player);
		},
	},
	/**思梦成疾
	 * 出牌阶段，你可以获得1张与所有其他角色手牌中牌名都不相同的牌，然后失去1点体力，若没有因此获得牌，此技能失效直到当前回合结束。 
	 * */
	mjssimengchengji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		async content(event, trigger, player) {
			const nameList = game.filterPlayer(target => target != player)
				.reduce((list, target) => {
					const list2 = target.getCards("h").reduce((list3, card) => list3.add(card.name), []);
					if (list2.length) {
						list.addArray(list2);
					}
					return list;
				}, []);
			const card = get.cardPile2(card => {
				return nameList.includes(card.name);
			});
			if (card) {
				await player.gain(card, "draw");
				//await player.loseHp();
			}
			//没有从牌堆中获得牌则不会失去体力
			if (!player.hasHistory("gain", evt => evt.getParent(event.name) == event)) {
				player.tempBanSkill(event.name);
			} else {
				await player.loseHp();
			}
		},
		ai: {
			order: 13,
			result: {
				player(player) {
					if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
	                    return 0;
	                }
	                if (player.hasSkillTag("nogainFromCardPile")) {
	                	return 0;
	                }
					return 1;
				},
			},
		},
	},
	//乐广
	/**约言析理
	 * 回合结束时，若你在本回合的每个出牌阶段打出的牌数都≤2，直到你的下个回合开始，当其他角色主动打出战法牌后，你可以立即将1张牌当作同名战法牌打出。
	 * */
	mjsyueyanxili: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseEnd",
		},
		silent: true,
		popup: true,
		filter(event, player) {
			const historys = game.getGlobalHistory("everything", evt => {
				return evt.name == "phaseUse" && evt.player == player;
			});
			for (const history of historys) {
				if (player.getHistory("useCard", evt => evt.getParent("phaseUse") == history).length > 2) {
					return false;
				}
			}
			return true;
		},
		async content(event, trigger, player) {
			player.addTempSkill("mjsyueyanxili_use", { player: "phaseBegin" });
		},
		subSkill: {
			use: {
				trigger: {
					global: "useCardAfter",
				},
				silent: true,
				forced: false,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					if (get.type2(event.card) != "trick") {
						return false;
					}
					return player.hasCards("hes", card => player.hasUseTarget(get.autoViewAs({ name: event.card.name }, [card])));
				},
				async cost(event, trigger, player) {
					game.broadcastAll(function (card) {
			            lib.skill.mjsyueyanxili_use_backup.viewAs = {
			                name: card.name,
			                nature: card.nature,
			                suit: card.suit,
			                number: card.number,
			            };
			        }, trigger.card);
			        const result = await player.chooseToUse()
			            .set("openskilldialog", `###${get.prompt(event.skill)}###你可以将一张牌当做${get.translation(trigger.card)}打出`)
			            .set("norestore", true)
			            .set("_backupevent", `${event.skill}_backup`)
			            .set("custom", {
			                add: {},
			                replace: { window: function () { } },
			            })
			            .backup(`${event.skill}_backup`)
			            .set("chooseonly", true)
			            .forResult()
			        event.result = { bool: result.bool, cost_data: { result } };
				},
				async content(event, trigger, player) {
					const { cost_data: { result } } = event;
        			await player.useResult(result, event);
				},
				mark: true,
				intro: {
					content: "当其他角色主动打出战法牌后，你可以立即将1张牌当作同名战法牌打出",
				},
			},
			use_backup: {
	            filterCard(card) {
	                return get.itemtype(card) == "card";
	            },
	            position: "hes",
	            ai1(card) {
	                return 7 - get.value(card);
	            },
			},
		},
	},
	/**名教乐地
	 * 其他角色的回合结束时，若其在本回合没有发动过技能，且未拥有此技能，则你可以令其获得此技能。你的出牌阶段结束时，若你上个出牌阶段内没有发动过技能，则你可以摸0张牌，并进行1个额外的出牌阶段，场上每额外存在1个名教乐地，此技能的摸牌数+1。  
	 * */
	mjsmingjiaoyuedi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init(player, skill) {
	        player.addSkill(skill + "_record");
	    },
		trigger: {
			global: "phaseEnd",
			player: "phaseUseEnd",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (event.name == "phase") {
				if (!event.player.isIn()) {
					return false;
				}
				if (event.player.hasSkill("mjsmingjiaoyuedi", null, null, false)) {
					return false;
				}
				return !event.player.hasHistory("useSkill", evt => {
					if (evt.type != "player" || !evt.sourceSkill) {
			          	return false;
			        }
			        const info1 = get.info(evt.skill);
			        if (info1.charlotte) {
			          	return false;
			        }
			        const info = get.info(evt.sourceSkill);
			        if (info.charlotte || get.is.locked(evt.skill)) {
			          	return false;
			        }
			        return true;
				});
			}
			return event._mjsmingjiaoyuedi_record;
		},
		prompt2(event, player) {
			if (event.name == "phase") {
				return `你可以令其获得${get.poptip("mjsmingjiaoyuedi")}`;
			}
			const targets = game.filterPlayer(target => target.hasSkill("mjsmingjiaoyuedi", null, null, false));
			return `你可以摸${targets.length}张牌，并进行1个额外的出牌阶段`;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			if (trigger.name == "phase") {
				await trigger.player.addSkills(event.name);
			} else {
				trigger._mjsmingjiaoyuedi = true;
				const targets = game.filterPlayer(target => target.hasSkill("mjsmingjiaoyuedi", null, null, false));
				if (targets.length > 0) {
					await player.draw(targets.length);
				}
				player.phaseUse();
			}
		},
		subSkill: {
			record: {
	            trigger: {
	                player: "phaseUseEnd",
	            },
	            firstDo: true,
	            charlotte: true,
	            forced: true,
	            popup: false,
	            async content(event, trigger, player) {
	            	const historys = game.getAllGlobalHistory("everything", evt => {
						return evt.name == "phaseUse" && evt.player == player;
					});
					const index = historys.indexOf(trigger);
					if (index <= 0) {
						trigger._mjsmingjiaoyuedi_record = true;
						return;
					}
					const history = historys[index - 1];
					if (!history._mjsmingjiaoyuedi) {
						trigger._mjsmingjiaoyuedi_record = true;
					}
	            },
			},
		},
	},
	/**杯弓蛇影
	 * 当一名其他角色获得牌后，若其中包含与本轮对其造成过伤害的牌相同牌名的牌，则其选择是否将其中相同牌名的牌交给你，并令此技能对其无效，直到本轮结束；否则其每个回合结束时失去1点体力，直到其再次触发此技能。 
	 * */
	mjsbeigongsheying: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        global: ["gainAfter","loseAsyncAfter"],
	    },
	    silent: true,
	    popup: true,
	    locked: false,
	    getIndex(event, player) {
	        if (event.name === "loseAsync" && event.type !== "gain") return [];
	        return game.filterPlayer(target => {
	            if (target == player) {
	            	return false;
	            }
	            return event.getg(target)?.length;
	        })
	        .sortBySeat();
	    },
	    filter: (event, player, name, target) => {
	    	if (!target?.isIn() || target.hasSkill("mjsbeigongsheying_targeted", null, null, false)) {
	    		return false;
	    	}
	    	const cards = event.getg(target);
	    	return cards.some(card => target.getRoundHistory("damage", evt => evt.card?.name == card.name).length);
	    },
	    logTarget: (event, player, name, target) => target,
	    async content(event, trigger, player) {
	        const target = event.targets[0];
	        target.removeSkill("mjsbeigongsheying_effect");
	        const cards = trigger.getg(target).filter(card => target.hasCards("h", card2 => card2 == card));
	        if (cards.length) {
	        	event.result = await target
		        	.chooseBool(`是否响应${get.translation(player)}的【${get.translation(event.name)}】？`, `将${get.translation(cards)}交给${get.translation(player)}`)
		            .set("ai", () => {
		                return get.event().goon;
		            })
		            .set(
		            	"goon", 
		            	(() => {
		            		const att = get.attitude(target, player);
		            		return att > 0 || cards.length == 1;
		            	})()
		            )
		            .forResult();
	        }
	        if (event?.result?.bool) {
	        	await target.give(cards, player, "giveAuto");
	        	target.addTempSkill("mjsbeigongsheying_targeted", "roundStart");
	        } else {
	        	target.addTempSkill("mjsbeigongsheying_effect", "roundStart");
	        }
	    },
	    subSkill: {
	    	targeted: {
	    		charlotte: true,
	    		onremove: true,
	    	},
	    	effect: {
	    		trigger: {
	    			global: "phaseEnd",
	    		},
	    		silent: true,
	    		popup: true,
	    		async content(event, trigger, player) {
	    			player.loseHp();
	    		},
	    		mark: true,
	    		marktext: "蛇",
	    		intro: {
	    			content: "每个回合结束时失去1点体力",
	    		},
	    	},
	    },
	},
	//王元姬
	/**烛奸抑势
	 * 出牌阶段结束时，你可以获得一名其他角色的1张牌，并且当其发动“出牌阶段限1次”的技能后，你可以获得其2张牌，直到你的下个回合开始。
	 * 出牌阶段结束时，若你的行动牌全场最多，你可以获得一名其他角色的1张牌，并且当其发动“出牌阶段限1次”的技能后，你可以获得其2张牌，直到你的下个回合开始。
	 * 出牌阶段结束时，若你的行动牌全场最多，你可以选择一名其他角色，当其发动“出牌阶段限1次”的技能后，交给你2张牌，直到你的下个回合开始。
	 * 限定，若你的行动牌全场最多，你可以将一名其他角色的1个技能中的“出牌阶段限1次”改为“限定”。
	 * */
	mjszhujianyishi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		getSkills(player) {
			return player.getSkills(null, false, false)
	            .filter(skill => {
	                var info = get.info(skill);
		            if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
		                return false;
		            }
	                var translation = get.skillInfoTranslation(skill, player);
	                if (!translation) {
	                	return false;
	                }
	                var match = get.plainText(translation).match(/“?出牌阶段限[一1]次/g);
	                if (!match || match.every(value => !["出牌阶段限一次", "出牌阶段限1次"].includes(value))) {
	                	return false;
	                }
	                return true;
	            });
		},
		trigger: {
			player: "phaseUseEnd",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			return true;
			const numberOfHandCards = player.countCards("h", card => get.type(card) == "basic");
		    return game.filterPlayer().every((value) => {
		      if (value.isOut() || value == player) {
		        return true;
		      }
		      return value.countCards("h", card => get.type(card) == "basic") <= numberOfHandCards;
		    });
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					const eff = get.effect(target, { name: "shunshou_copy", position: "he" }, player, player);
					return get.info("mjszhujianyishi").getSkills(target).length + eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			player.logSkill(event.name, target);
			if (target.countGainableCards(player, "he")) {
				await player.gainPlayerCard(target, "he", true);
			}
			const skill = event.name + "_effect";
			player.addTempSkill(skill, { player: "phaseBegin" });
			player.markAuto(skill, [target]);
			player.addTip(skill, get.translation(skill) + " " + player.getStorage(skill).reduce((str, target) => str + get.translation(target), ""), false, { whiteSpace: "nowrap" });
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					return -2;
				},
			},
		},
		subSkill: {
			effect: {
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				trigger: {
			        global: ["useSkillAfter", "logSkill"],
			    },
			    silent: true,
			    popup: true,
			    charlotte: true,
			    filter(event, player) {
			    	if (!player.getStorage("mjszhujianyishi_awaken").includes(event.player)) {
			    		return false;
			    	}
			        if (["global", "equip"].includes(event.type)) {
			            return false;
			        }
			        let skill = get.sourceSkillFor(event);
			        if (!skill || skill === "mjszhujianyishi") {
			            return false;
			        }
			        let info = get.info(skill);
			        if (!info || info.charlotte || info.equipSkill) {
			            return false;
			        }
			        var translation = get.skillInfoTranslation(skill, player);
	                if (!translation) {
	                	return false;
	                }
	                var match = get.plainText(translation).match(/“?出牌阶段限[一1]次/g);
	                if (!match || match.every(value => !["出牌阶段限一次", "出牌阶段限1次"].includes(value))) {
	                	return false;
	                }
	                return event.player.hasGainableCards(player, "he");
			    },
			    logTarget: "player",
			    prompt2: "你可以获得其2张牌",
				async content(event, trigger, player) {
					if (trigger.player.countGainableCards(player, "he")) {
						await player.gainPlayerCard(trigger.player, "he", 2, true);
					}
				},
				mark: true,
				intro: {
					markcount: () => 0,
					content: "当$发动“出牌阶段限1次”的技能后，你可以获得其2张牌，直到你的下个回合开始",
				},
			},
		},
	},
	/**谦冲接下
	 * 每个回合限1次，当你获得其他角色的牌时，你可以令你与其描述中有“出牌阶段限1次”的技能下个出牌阶段的发动次数+1。
	 * 每个回合限1次，当你获得其他角色的牌时，若你的手牌数不是全场最低，你可以令你与其描述中有“出牌阶段限1次”的技能下个出牌阶段的发动次数+1。
	 * */
	mjsqianchongjiexia: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        player: "gainAfter",
	        global: "loseAsyncAfter",
	    },
	    usable: 1,
	    silent: true,
	    popup: true,
	    forced: false,
	    getIndex(event, player) {
	        if (event.name == "loseAsync" && event.type != "gain") return [];
	        if (!event.getl || !event.getg) return [];
	        const cards = event.getg(player);
	        return game
	            .filterPlayer(target => {
	                if (target == player) return false;
	                if (cards.length) {
	                    let evt = event.getl(target);
	                    if (evt?.cards2?.length && evt.cards2.some(card => cards.includes(card))) return true;
	                }
	                return false;
	            })
	            .sortBySeat();
	    },
	    filter(event, player, triggername, target) {
	    	return true;
	    	return !player.isMinHandcard();
	    },
	    logTarget: (event, player, triggername, target) => target,
	    check(event, player, triggername, target) {
	    	const att = get.attitude(player, target);
	    	if (att > 0) {
	    		return true;
	    	}
	    	const skills = get.info("mjszhujianyishi").getSkills(target);
	    	const ignoreSkills = ["mjsqianchongjiexia"];
	    	skills.removeArray(ignoreSkills);
	    	return !skills.length;
	    },
		async content(event, trigger, player) {
			const targets = [player, ...event.targets];
			for (const target of targets) {
				target.addTempSkill("mjsqianchongjiexia_mark", { player: "phaseBegin" });
				target.addMark("mjsqianchongjiexia_mark", 1, false);
				continue;
				const skills = get.info("mjszhujianyishi").getSkills(target);
		        if (!skills.length) {
		            continue;
		        }
		        target
		        	.when("phaseUseBegin")
		        	.then(async (event, trigger, player) => {
		        		const skillCount = "mjsqianchongjiexia_restore";
		        		player.addTempSkill(skillCount, "phaseUseAfter");
		        		for (const skill of skills) {
		        			let num = 1;
		        			if (player.storage[skillCount].has(skill)) {
		        				num += player.storage[skillCount].get(skill);
		        			}
		        			player.storage[skillCount].set(skill, num);
		        		}
		        	});
			}
		},
		restoreSkill(player, skill) {
			const resetSkills = [], suffixs = ["used", "round", "block", "blocker", "sunben"];
		    const skills = [skill];
		    for (const skill of skills) {
		      const info = get.info(skill);
		      if (info.usable !== void 0) {
		        if (typeof player.getStat("triggerSkill")[skill] == "number" && player.getStat("triggerSkill")[skill] >= 1) {
		          delete player.getStat("triggerSkill")[skill];
		          resetSkills.add(skill);
		        }
		        if (typeof player.getStat("skill")[skill] == "number" && player.getStat("skill")[skill] >= 1) {
		          delete player.getStat("skill")[skill];
		          resetSkills.add(skill);
		        }
		      }
		      if (info.round && player.storage[skill + "_roundcount"]) {
		        delete player.storage[skill + "_roundcount"];
		        player.unmarkSkill(skill + "_roundcount");
		        resetSkills.add(skill);
		      }
		      if (player.storage[`temp_ban_${skill}`]) {
		        delete player.storage[`temp_ban_${skill}`];
		        resetSkills.add(skill);
		      }
		      if (player.awakenedSkills.includes(skill)) {
		        player.restoreSkill(skill);
		        resetSkills.add(skill);
		      }
		      for (const suffix of suffixs) {
		        if (player.hasSkill(skill + "_" + suffix)) {
		          player.removeSkill(skill + "_" + suffix);
		          resetSkills.add(skill);
		        }
		      }
		    }
		},
		subSkill: {
			restore: {
				init(player, skill) {
					player.storage[skill] ??= new Map();
				},
				trigger: {
			        player: ["useSkill", "logSkillBegin"],
			    },
			    silent: true,
			    charlotte: true,
			    onremove: true,
			    filter(event, player) {
			        if (["global", "equip"].includes(event.type)) {
			            return false;
			        }
			        let skill = get.sourceSkillFor(event);
			        if (!skill || skill === "mjsqianchongjiexia_restore") {
			            return false;
			        }
			        let info = get.info(skill);
			        if (!info || info.charlotte || info.equipSkill) {
			            return false;
			        }
			        if (info.mjszhujianyishi) {
			        	return false;
			        }
			        let map = player.storage.mjsqianchongjiexia_restore;
			        return map.has(skill) && map.get(skill) > 0;
			    },
				async content(event, trigger, player) {
					let skill = get.sourceSkillFor(trigger);
        			if (player.storage[event.name].has(skill)) {
        				let num = player.storage[event.name].get(skill) - 1;
        				player.storage[event.name].set(skill, num);
        				lib.skill.mjsqianchongjiexia.restoreSkill(player, skill);
        			}
				},
			},
			mark: {
				charlotte: true,
				mark: true,
				marktext: "谦",
				intro: {
					name: "谦",
					content: "描述中有“出牌阶段限1次”的技能下个出牌阶段的发动次数+#。",
				},
				trigger: {
					player: "phaseUseBegin",
				},
				silent: true,
				charlotte: true,
				onremove: true,
				async content(event, trigger, player) {
					const count = player.countMark(event.name);
					player.removeSkill(event.name);
					const skillCount = "mjsqianchongjiexia_restore";
		        	player.addTempSkill(skillCount, "phaseUseAfter");
					const skills = get.info("mjszhujianyishi").getSkills(target);
			        if (!skills.length) {
			            return;
			        }
			        for (const skill of skills) {
	        			let num = count;
	        			if (player.storage[skillCount].has(skill)) {
	        				num += player.storage[skillCount].get(skill);
	        			}
	        			player.storage[skillCount].set(skill, num);
	        		}
				},
			},
		},
	},
	/**躬执纺绩
	 * 出牌阶段限1次，获得1张行动牌，然后你可以将此牌交给一名其他角色，或者令一名未拥有此技能的其他角色获得此技能。 
	 * */
	mjsgongzhifangji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsgongzhifangji" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			const card = get.cardPile2(card => get.type(card) == "basic");
			if (!card) {
				return;
			}
			await player.gain(card, "gain2");
			const targets = game.filterPlayer(target => {
				return !target.hasSkill(event.name, null, null, false);
			});
			if (!player.getCards("he").includes(card) && targets.length) {
				return;
			}
			const result = await player
				.chooseCardTarget({
					prompt: mjs.prompt(event.name),
					prompt2: `你可以选择将${get.translation(card.name)}交给一名其他角色，或者令一名未拥有此技能的其他角色获得${get.translation(event.name)}`,
					filterCard(card) {
						return get.event().card == card;
					},
					selectCard() {
						if (!get.event().targets?.length) {
							return 1;
						}
						return [0, 1];
					},
					filterTarget(card, player, target) {
						if (target == player) {
							return false;
						}
						if (ui.selected.cards.length) {
							return true;
						}
						return get.event().targets.includes(target);
					},
					ai1(card) {
						const player = get.player();
						const targets = game.filterPlayer(target => {
							return target.isFriendsOf(player, false);
						});
						if (!targets.length) {
							return 0;
						}
						if (targets.some(target => !target.hasSkill("mjsqianchongjiexia") && !target.hasSkillTag("nogain"))) {
							return 0;
						}
						if (player.hasSkill("mjsqianchongjiexia")) {
							return 8 - get.value(card);
						}
						return 10 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						const att = get.attitude(player, target);
						if (ui.selected.cards.length) {
							if (target.hasSkill("mjsqianchongjiexia", null, null, false) && !target?.storage?.counttrigger?.mjsqianchongjiexia) {
								return att *= 2;
							}
						}
						if (!target.hasSkill("mjsqianchongjiexia")) {
							return att * 1.5;
						}
						return att;
					},
				})
				.set("card", card)
				.set("targets", targets)
				.forResult();
			if (!result?.targets?.length) {
				return;
			}
			if (result?.cards?.length) {
				await player.give(result.cards, result.targets[0]);
			} else {
				await result.targets[0].addSkills(event.name);
			}
		},
		ai: {
			skillRank: 1.1,
			order: 12,
			result: {
				player(player) {
					if (!player.hasFriend()) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//杜预
	/**杜武库
	 * 登场，复制初始牌堆中每种牌名的牌各1张放入武库。应战/出牌阶段限1次，你可以立即打出武库中的一张牌。
	 * 登场，复制牌堆中每种牌名的牌各1张放入武库。应战/出牌阶段限1次，你可以立即打出武库中的一张牌。
	 * */
	mjsduwuku: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			target: "useCardToTarget",
		},
		enable: "phaseUse",
		filter(event, player) {
	        if (!player.getExpansions("mjsduwuku").length) {
	            return false;
	        }
	        if (event.name == "chooseToUse") {
	            return !player.hasSkill("mjsduwuku_used");
	        }
	        return event.card.name == "sha";
	    },
	    silent: true,
	    forced: false,
	    async cost(event, trigger, player) {
	    	const cards = player.getExpansions("mjsduwuku");
	    	const result = await player
	    		.chooseCardButton(get.translation(event.skill), cards)
	    		.set("filterButton", button => {
	    			return get.player().hasUseTarget(button.link, null, false);
	    		})
	    		.set("ai", button => {
	    			return get.player().getUseValue(button.link);
	    		})
	    		.forResult();
	    	if (result?.links?.length) {
	    		event.result = {
	    			bool: result.bool,
	    			cost_data: result.links
	    		};
	    	}
	    },
	    log: false,
	    async precontent(event, trigger, player) {
	    	const skillName = event.name.slice("pre_".length);
	    	const cards = player.getExpansions("mjsduwuku");
	    	const result = await player
	    		.chooseCardButton(get.translation(skillName), cards)
	    		.set("filterButton", button => {
	    			const card = button.link;
	    			return get.player().hasUseTarget(card, null, false);
	    		})
	    		.set("ai", button => {
	    			return get.player().getUseValue(button.link);
	    		})
	    		.forResult();
	    	if (result?.links?.length) {
	    		event.getParent().cost_data = result.links;
	    		return;
	    	}
	    	player.addTempSkill(`${skillName}_aiCheck`, {
	            player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
	        });
	        event.getParent().goto(0);
	    },
		async content(event, trigger, player) {
			player.logSkill(event.name);
			if (!trigger?.name) {
	            player.addTempSkill(event.name + "_used", ["phaseBefore", "phaseChange", "phaseAfter"]);
	        }
			const cards = event.cost_data || event.getParent(2).cost_data;
			const card = cards[0];
			if (player.hasUseTarget(card, true, false)) {
				await player.chooseUseTarget(card, true, false);
			}
		},
		intro: {
	        markcount: "expansion",
	        mark(dialog, content, player2) {
	            var content = player2.getExpansions("mjsduwuku");
	            if (content && content.length) {
	              if (player2 == game.me || player2.isUnderControl()) {
	                dialog.addAuto(content);
	              } else {
	                return "共有" + get.cnNumber(content.length) + "张武库牌";
	              }
	            }
	        },
	        content(content, player2) {
	            var content = player2.getExpansions("mjsduwuku");
	            if (content && content.length) {
	              if (player2 == game.me || player2.isUnderControl()) {
	                return get.translation(content);
	              }
	              return "共有" + get.cnNumber(content.length) + "张武库牌";
	            }
	        },
	    },
		ai: {
			yingzhan: true,
			order() {
				const player = get.event().player;
				const cards = player.getExpansions("mjsduwuku");
				const list = cards.map(card => {
					return player.getUseValue(card) > 0 ? get.order({ name: card.name }) : 1;
				});
	            return Math.max(...list) - 0.2;
	        },
	        result: {
	            player(player) {
	            	if (player.hasSkill("mjsduwuku_aiCheck")) {
	            		return 0;
	            	}
	                return 1;
	            },
	        },
		},
		group: "mjsduwuku_init",
		subSkill: {
			record: {

			},
			init: {
				audio: "mjsduwuku",
				trigger: {
			        global: "phaseBefore",
			        player: ["enterGame","changeSkillsAfter"],
			    },
			    silent: true,
			    popup: true,
			    locked: false,
			    filter(event, player) {
			    	if (event.name == "changeSkills") {
			            return event.addSkill.includes("mjsduwuku");
			        }
			        return (event.name != "phase" || game.phaseNumber == 0);
			    },
				async content(event, trigger, player) {
					const cardList = [];
				  	const nameList = Array.from(ui.cardPile.childNodes)
				  		.flat()
				  		.reduce((list, card) => list.add(card.name), []);
				  	for (const name of nameList) {
				  		const card = get.cardPile(
				  			card => {
				  				return card.name == name;
				  			},
				  			null,
				  			"random"
				  		);
				  		if (card) {
				  			cardList.push(card);
				  		}
				  	}
				  	if (cardList.length) {
				  		const cards = [];
				  		for (const card of cardList) {
				  			const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
				  			if (card) {
				  				cards.push(card);
				  			}
				  		}
				  		const next = player.addToExpansion(cards);
				      	next.gaintag.add("mjsduwuku");
				      	await next;
				  	}
				},
			},
			aiCheck: {
				charlotte: true,
				ai: {
					skill_aiCheck: true,
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	/**势如破竹
	 * 当你打出的战法牌造成伤害后，可以削弱目标角色2张牌，且你本回合选择其为目标的下1张杀对其伤害+1。 
	 * */
	mjsshirupozhu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		onremove(player, skill) {
			player.removeSkill(skill + "_effect");
		},
		trigger: {
			source: "damageSource",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event.card && get.type(event.card) == "trick" && event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			const cards = target.getCards("he", card => {
	            return lib.filter.canBeWeakened(card, target, "mjsshirupozhu");
	        });
	        if (cards.length) {
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
	        }
	        const skill = "mjsshirupozhu_effect";
	        player.addTempSkill(skill);
	        player.storage[skill].push(trigger.player);
		},
		subSkill: {
			effect: {
				init(player, skill) {
					player.storage[skill] ??= [];
				},
				trigger: {
					player: "useCardToPlayer",
				},
				silent: true,
				popup: true,
				onremove: true,
				filter(event, player) {
					return event.card.name == "sha" && player.getStorage("mjsshirupozhu_effect").includes(event.target);
				},
				logTarget: "target",
				async content(event, trigger, player) {
					const list = player.getStorage(event.name).filter(target => target == trigger.target);
					player.storage[event.name].removeArray(list);
					if (!player.getStorage(event.name).length) {
						player.removeSkill(event.name);
					}
					const num = list.length;
					const id = trigger.target.playerid;
			        const map = trigger.getParent().customArgs;
			        if (!map[id]) {
			            map[id] = {};
			        }
			        if (typeof map[id].extraDamage != "number") {
			            map[id].extraDamage = 0;
			        }
			        map[id].extraDamage += num;
			        game.log(player, "使用的", trigger.card, "对", trigger.target, "造成的伤害", "#y+" + num);
				},
			},
		},
	},
	/**陵谷存勋
	 * 击杀，永久标记此时牌堆顶和牌堆底的各1张牌。之后每当有此标记的牌被打出时，你摸3张牌。
	 * */
	mjslinggucunxun: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			source: "dieAfter",
			player: ["useCard", "respond"],
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return event.name == "die" || (event.cards && event.cards?.some(card => card?.storage?.eternal_mjslinggucunxun_tag));
		},
		async content(event, trigger, player) {
			if (trigger.name == "die") {
				const cards = [];
				cards.addArray(Array.from(ui.cardPile.childNodes).slice(0, 1));
                cards.addArray(Array.from(ui.cardPile.childNodes).slice(-1));
                if (cards.length) {
                	game.broadcastAll(
                		cards=> {
                			for (const card of cards) {
		                		card.addGaintag("eternal_mjslinggucunxun_tag");
		                		card.storage.eternal_mjslinggucunxun_tag = true;
		                	}
	                	},
	                	cards
                	);
                }
			} else {
				await player.draw(3);
			}
		},
		subSkill: {
			tag: {
				name: "勋",
			},
		},
	},
	//张华
	/**双剑化龙
	 * 登场，添加随机花色和点数的龙泉剑/太阿剑至牌堆底。当你打出牌时，若此牌花色或点数与龙泉剑/太阿剑相同，则你获得龙泉剑/太阿剑。当你同时装备龙泉剑和太阿剑时，增强你的所有其他牌。 
	 * 龙泉剑：武器，攻击范围2，当你受到伤害后，可以削弱伤害来源的2张牌。
	 * 太阿剑：武器，攻击范围2，当你造成伤害后，可以削弱目标的2张牌。 
	 * */
	mjsshuangjianhualong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		getList: ["mjslongquanjian", "mjstaiejian"],
		getCards(player) {
			const cardList = [];
			const cards2 = ["cardPile", "discardPile"].map((pos) => Array.from(ui[pos].childNodes)).flat();
			const filter = (card) => lib.skill.mjsshuangjianhualong.getList.includes(card.name);
			const players = game.filterPlayer(target => target != player);
			players.forEach((current) => {
		        const pos = "ej" + (current !== player ? "h" : "");
		        const cards = current.getCards(pos, filter);
		        if (cards.length > 0) {
		          cardList.addArray(cards);
		        }
		    });
		    cardList.addArray(cards2.filter(filter));
		    return cardList;
		},
		trigger: {
			player: ["useCard", "respond", "equipAfter"],
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			const list = lib.skill.mjsshuangjianhualong.getList.slice();
			if (event.name == "equip") {
				return event.cards?.length && event.cards.some(card => list.includes(card.name)) && list.every(name => player.hasCards("e", name));
			}
			const suit = get.suit(event.card), number = get.number(event.card);
			return lib.skill.mjsshuangjianhualong.getCards(player).some(card => card.suit == suit || card.number == number);
		},
		async content(event, trigger, player) {
			if (trigger.name != "equip") {
				const suit = get.suit(trigger.card), number = get.number(trigger.card);
				const cards = lib.skill.mjsshuangjianhualong.getCards(player).filter(card => card.suit == suit || card.number == number);
	            if (cards.length) {
	            	for (const card of cards) {
	            		if (get.owner(card)) {
		                    get.owner(card).$give(card, player, false);
		                }
	            	}
	            	await player.gain(cards, "draw");
	            }
			} else {
				const cards = player.getCards("he", card => {
		            return lib.filter.canBeStrengthened(card, player, event.name);
		        });
		        if (cards.length) {
		            await player.mjsStrengthenCards(cards);
		        }
			}
		},
		group: "mjsshuangjianhualong_init",
		subSkill: {
			init: {
				audio: "mjsshuangjianhualong",
				trigger: {
	                global: "phaseBefore",
	                player: ["enterGame","changeSkillsAfter"],
	            },
	            silent: true,
	            popup: true,
	            filter(event, player) {
	                if (event.name == "changeSkills") {
	                    return event.addSkill.includes("mjsshuangjianhualong");
	                }
	                return event.name != "phase" || game.phaseNumber == 0;
	            },
	            async content(event, trigger, player) {
	                const cards = [];
	                for (const name of lib.skill.mjsshuangjianhualong.getList) {
	                	const card = game.createCard(name, mjs.suits.randomGet(), get.rand(1, 8));
		                if (card) {
		                	cards.push(card);
		                }
	                }
	                if (cards.length) {
	                	player.$throw(cards.length, 1000);
	                	await game.cardsGotoPile(cards);
	                }
	                await game.delayx();
	            },
			},
		},
	},
	/**博物志
	 * 出牌阶段限1次，你可以弃置1张牌，查看牌堆中前10张与此牌花色相同的牌与这些牌在牌堆中的位置，你可以交换这些牌的位置，并且可以选择获得其中2张牌。 
	 * */
	mjsbowuzhi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCards(lib.skill.mjsbowuzhi.position, card => lib.skill.mjsbowuzhi.filterCard(card, player));
		},
		filterCard(card, player) {
			return lib.filter.cardDiscardable(card, player);
		},
		position: "he",
		check(card) {
			const player = get.event().player;
			const list = lib.skill.mjsshuangjianhualong.getList.slice();
			if (player.hasSkill("mjsshuangjianhualong")) {
				if (list.includes(card.name)) {
					return 20 - get.value(card);
				}
			}
			return 8 - get.value(card);
		},
		async content(event, trigger, player) {
			const suit = get.suit(event.cards[0], false);
			const cards2 = Array.from(ui.cardPile.childNodes).flat();
			const cards = cards2.filter(card => card.suit == suit).slice(0, 10);
			if (!cards.length) {
				return;
			}
			await game.cardsGotoOrdering(cards);
			const cardList = [];
			for (const card of cards) {
				const index = cards2.indexOf(card) + 1;
				cardList.push([index.toString(), [card]]);
			}
			const list = [];
			list.push(cardList.slice(0, 5));
			if (cardList.length > 5) {
				list.push(cardList.slice(5));
			}
			list.push(["获得"]);
			const len = list.slice(0, -1).flat().length;
			const next = player
				.chooseToMove_new(get.translation(event.name))
				.set("list", list)
			    .set("filterMove", (from, to, moved) => {
			    	const len = get.event().len;
			    	if (to === len) {
			          	return moved[to].length < 2;
			        }
			        if (typeof to == "number" && moved[to].length) {
			        	return false;
			        }
			        return true;
			    })
			    .set("processAI", list => {
			    	const cards = list.slice(0, -1).flat().map(info => info[1]).flat().slice(0).sort((a, b) => {
			    		return get.value(a, "raw") - get.value(b, "raw");
			    	});
			    	const gains = cards.splice(-2);
			    	const result = [...cards.map(card => [card]), [], []].randomSort();
			    	return [...result, gains];
			    })
			    .set("len", len);
			const result = await next.forResult();
			if (result.bool) {
				const moved = result.moved;
				const gains = moved?.[len];
				if (gains?.length) {
					cards.removeArray(gains);
				}
				for (const info of cardList) {
					const index = cardList.indexOf(info);
					if (moved[index].length) {
						const [card] = moved[index];
						card.fix();
						ui.cardPile.insertBefore(card, ui.cardPile.childNodes[info[0] - 1]);
					}
				}
				game.updateRoundNumber();
				if (gains.length) {
					await player.gain(gains, "draw");
				}
			}
		},
		ai: {
			order: 17,
			result: {
				player: 1,
			},
		},
	},
	/**兰艾同焚
	 * 阵亡，销毁所有龙泉剑和太阿剑，然后可以削弱任意名其他角色的所有牌。 
	 * */
	mjslanaitongfen: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        player: "die",
	    },
	    silent: false,
	    popup: true,
	    locked: false,
	    forceDie: true,
	    async content(event, trigger, player) {
	    	const cards = ["cardPile", "discardPile"].map(pos => Array.from(ui[pos].childNodes)).flat();
	    	const cardList = [];
	    	const filter = card => lib.skill.mjsshuangjianhualong.getList.includes(card.name);
	        const lose_list = [], players = game.filterPlayer();
	        players.forEach((current) => {
	        	const pos = "hej";
	        	const cards = current.getCards(pos, filter);
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
	        	game.log(cardList, "被销毁");
	            await game.cardsGotoSpecial(cardList);
	        }
	        const result = await player
	        	.chooseTarget(`${mjs.prompt(event.name)}，你可以削弱任意名其他角色的所有牌`, [1, Infinity], lib.filter.notMe)
	        	.set("ai", target => {
	        		const player = get.player();
	        		const att = get.attitude(player, target);
	        		const cards = target.getCards("he", card => {
		                return lib.filter.canBeWeakened(card, target, "mjslanaitongfen");
		            });
	        		return -att * cards.length;
	        	})
	        	.forResult();
	        if (!result?.targets?.length) {
	        	return;
	        }
	        for (const target of result?.targets) {
	        	if (!target?.isIn()) {
	        		continue;
	        	}
	        	const cards = target.getCards("he", card => {
	                return lib.filter.canBeWeakened(card, target, "mjslanaitongfen");
	            });
	            if (!cards.length) {
	                return;
	            }
	            await target.mjsWeakenCards(cards, player);
	        }
	    },
	},
	//荀勖
	/**十二笛律
	 * 当你打出牌后，若本回合你打出过的牌的总点数等于12，你可以选择1个点数，查看牌堆中前12张与此牌点数相同的牌在牌堆中的位置，你可以交换这些牌的位置，并且可以选择获得其中1张牌。 
	 * */
	mjsshierdilv: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			player: "useCardAfter",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event._mjsshierdilv;
			return ["useCard", "respond"].reduce((sum, evt) => {
				const num = player
					.getHistory(evt, evtx => {
						return get.number(evtx.card) && typeof get.number(evtx.card) == "number";
					})
					.reduce((sum2, evtx2) => sum2 + get.number(evtx2.card), 0);
				if (num > 0) sum += num;
				return sum;
			}, 0) == 12;
		},
		async cost(event, trigger, player) {
			const list = Array.from({ length: 8 }, (_, index) => index + 1);
			const result = await player
				.chooseControl(list, "cancel2")
				.set("prompt", get.prompt(event.skill))
				.forResult();
			if (result.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.index + 1
				};
			}
		},
		async content(event, trigger, player) {
			const number = event.cost_data;
			const cards2 = Array.from(ui.cardPile.childNodes).flat();
			const cards = cards2.filter(card => card.number == number).slice(0, 12);
			if (!cards.length) {
				return;
			}
			await game.cardsGotoOrdering(cards);
			const cardList = [];
			for (const card of cards) {
				const index = cards2.indexOf(card) + 1;
				cardList.push([index.toString(), [card]]);
			}
			const list = [];
			list.push(cardList.slice(0, 6));
			if (cardList.length > 6) {
				list.push(cardList.slice(6));
			}
			list.push(["获得"]);
			const len = list.slice(0, -1).flat().length;
			const next = player
				.chooseToMove_new(get.translation(event.name))
				.set("list", list)
			    .set("filterMove", (from, to, moved) => {
			    	const len = get.event().len;
			    	if (to === len) {
			          	return moved[to].length < 1;
			        }
			        if (typeof to == "number" && moved[to].length) {
			        	return false;
			        }
			        return true;
			    })
			    .set("processAI", list => {
			    	const cards = list.slice(0, -1).flat().map(info => info[1]).flat().slice(0).sort((a, b) => {
			    		return get.value(a, "raw") - get.value(b, "raw");
			    	});
			    	const gains = cards.splice(-1);
			    	const result = [...cards.map(card => [card]), []].randomSort();
			    	return [...result, gains];
			    })
			    .set("len", len);
			const result = await next.forResult();
			if (result.bool) {
				const moved = result.moved;
				const gains = moved?.[len];
				if (gains?.length) {
					cards.removeArray(gains);
				}
				for (const info of cardList) {
					const index = cardList.indexOf(info);
					if (moved[index].length) {
						const [card] = moved[index];
						card.fix();
						ui.cardPile.insertBefore(card, ui.cardPile.childNodes[info[0] - 1]);
					}
				}
				game.updateRoundNumber();
				if (gains.length) {
					await player.gain(gains, "draw");
				}
			}
		},
		group: "mjsshierdilv_mark",
		subSkill: {
			mark: {
				trigger: {
					player: ["useCard1", "respond"],
				},
				silent: true,
				firstDo: true,
				filter(event, player) {
					return get.number(event.card) && typeof get.number(event.card) == "number";
				},
				async content(event, trigger, player) {
					const num = get.number(trigger.card);
					const skill = "mjsshierdilv_counter";
					player.addTempSkill(skill);
					player.addMark(skill, num, false);
					if (player.countMark(skill) === 12) {
						trigger._mjsshierdilv = true;
					}
				},
			},
			counter: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
	                content(storage, player) {
	                    return "上一张牌的点数：" + get.strNumber(storage);
	                },
	            },
			},
		},
	},
	/**四部分类
	 * 登场，你将1~8的点数分为甲乙丙丁4组；每轮结束时，若你本轮打出过每组点数的至少1张牌，随机获得每组点数的各1张牌。
	 * */
	mjssibufenlei: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init(player, skill) {
			const nameList = lib.skill.mjssibufenlei.nameList;
			for (const name of nameList) {
				game.addTempTag(`mjssibufenlei_${name}`, name);
			}
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_effect");
		},
		nameList: ["甲", "乙", "丙", "丁"],
		getList(player) {
			return [[1, 2], [3], [2, 6], [4, 7, 8]];
		},
		trigger: {
	        global: ["phaseBefore", "roundEnd"],
	        player: ["enterGame", "changeSkillsAfter"],
	    },
	    silent: true,
	    popup: true,
	    locked: false,
	    filter(event, player, name) {
	    	if (name == "roundEnd") {
	    		const list = player.getStorage("mjssibufenlei", []);
	    		if (list.length != 4) {
	    			return false;
	    		}
	    		const nums = ["useCard", "respond"].reduce((list, evt) => {
	    			const history = player
	    				.getRoundHistory(evt, evtx => get.number(evtx.card))
	    				.reduce((list2, evt2) => {
		    				const number = get.number(evt2.card);
			    			if (number && typeof number == "number") {
			    				list2.add(number);
			    			}
			    			return list2;
		    			}, []);
	    			if (history.length > 0) {
	    				list.addArray(history);
	    			}
	    			return list;
	    		}, []);
	    		return list.every(info => info.some(num => nums.includes(num)));
	    	}
	        if (event.name == "changeSkills") {
	            return event.addSkill.includes("mjssibufenlei");
	        }
	        return (event.name != "phase" || game.phaseNumber == 0);
	    },
		async content(event, trigger, player) {
			const list = player.getStorage(event.name);
			if (event.triggername != "roundEnd") {
				const sort = [];
				const list = Array.from({ length: 8 }, (_, index) => [index + 1, index + 1]);
				while (sort.length < 4) {
					if (sort.length == 3) {
						event.result = {
							links: list.slice().map(info => info[0]).removeArray(sort.flat())
						};
					} else {
						event.result = await player
							.chooseButton([
								get.translation(event.name), 
								[
									dialog => {
										const { list, sort } = get.event();
										const contentx = ui.create.div(".content", dialog.content);
										const div = ui.create.div(".buttons", contentx);
										div.css({
											display: "flex",
			                                alignItems: "center",
			                                justifyContent: "center",
										});
										const buttons = ui.create.buttons(
	                                        list.map(i => {
	                                        	if (sort.flat().includes(i)) {
	                                        		const st = sort.find(info => info.includes(i));
	                                        		return [i, lib.skill.mjssibufenlei.nameList[sort.indexOf(st)]];
	                                        	}
	                                        	return [i, ""];
	                                        }),
	                                        "tdnodes",
	                                        div
	                                    );
	                                    buttons.forEach(button => {
	                                    	button.style.setProperty("width", "10px", "important");
	                                    	button.style.setProperty("height", "15px", "important");
	                                    	button.style.setProperty("opacity", "1", "important");
	                                    	button.style.setProperty("pointer-events", "none");
	                                    	button.style.setProperty("text-align", "center");
	                                    });
										dialog.add([list, "tdnodes"]);
										dialog.buttons.forEach(button => {
	                                    	button.style.setProperty("width", "10px", "important");
	                                    	button.style.setProperty("height", "15px", "important");
	                                    	button.style.setProperty("text-align", "center");
	                                    });
									},
									"handle"
								],
							], "hidden", true)
							.set("filterButton", button => {
								return !get.event().sort.flat().includes(button.link);
							})
							.set("selectButton", [1, 8 - sort.flat().length - (3 - sort.length)])
							.set("ai", button => {
								const sort = get.event().sort;
								const list = lib.skill.mjssibufenlei.getList(get.event().player);
								if (list[sort.length].includes(button.link)) {
									return 2 + Math.random();
								}
								return 0;
							})
							.set("sort", sort)
							.set("list", list.map(info => info[0]))
							.forResult();
					}
					if (event?.result?.links?.length) {
						sort.push(event.result.links);
					}
				}
				if (sort.length == 4) {
					player.setStorage(event.name, sort);
					player.addSkill("mjssibufenlei_effect");
				}
			} else {
				const cards = [];
				for (const info of list) {
					const number = info.randomGet();
					const card = get.cardPile2(
						card => {
							if (cards.includes(card)) {
								return false;
							}
							return get.number(card, false) == number;
						}, 
						null, 
						"random"
					);
					if (card) {
						cards.push(card);
					}
				}
				if (cards.length) {
					await player.gain(cards, "draw");
					game.log(player, "获得了", get.cnNumber(cards.length), "张牌");
				}
			}
		},
		subSkill: {
			effect: {
				trigger: {
					player: ["useCard1", "respond"],
				},
				silent: true,
				firstDo: true,
				filter(event, player) {
					return get.number(event.card) && typeof get.number(event.card) == "number";
				},
				async content(event, trigger, player) {
					const num = get.number(trigger.card);
					const nameList = lib.skill.mjssibufenlei.nameList;
					const skill = "mjssibufenlei_counter";
					player.addTempSkill(skill, "roundStart");
					for (const nums of player.getStorage("mjssibufenlei")) {
						if (nums.includes(num)) {
							const index = player.getStorage("mjssibufenlei").indexOf(nums);
							player.markAuto(skill, nameList[index]);
							player.addTip(skill, player.getStorage(skill).join("/"));
						}
					}
				},
				group: "mjssibufenlei_mark",
			},
			mark: {
				trigger: {
	                player: "gainAfter",
	                global: ["gameDrawAfter","loseAsyncAfter"],
	            },
	            forced: true,
	            charlotte: true,
	            popup: false,
	            firstDo: true,
	            filter(event, player) {
	                if (!player.countCards("he")) return false;
	                if (event.name == "gameDraw") return true;
	                return event?.getg?.(player)?.length > 0;
	            },
				async content(event, trigger, player) {
					const nameList = lib.skill.mjssibufenlei.nameList;
	                for (const nums of player.getStorage("mjssibufenlei")) {
	                	const index = player.getStorage("mjssibufenlei").indexOf(nums);
	                	const cards = player.getCards("h", card => {
		                    return nums.includes(get.number(card, player));
		                });
		                if (cards.length) {
		                	player.addGaintag(cards, `mjssibufenlei_${nameList[index]}`);
		                }
					}
				},
			},
			counter: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
			},
		},
	},
	/**省官清心 
	 * 当你打出牌时，若此牌的点数<上一张你打出牌的点数，你可以削弱一名角色的1张牌。
	 * */
	mjsxingguanqingxin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["useCard", "respond"],
		},
		silent: true,
		forced: false,
		filter(event, player) {
			const num = player.storage.mjsxingguanqingxin_mark;
			if (!num || typeof num != "number") {
				return false;
			}
			return get.number(event.card, player) < num;
		},
		async cost(event, trigger, player) {
			event.result = await player
	            .chooseTarget(get.prompt(event.skill), "削弱一名角色的1张牌")
	            .set("ai", target => {
	                const player = get.player();
	                const att = get.attitude(player, target);
	                const cards = target.getCards("he", card => {
	                    return lib.filter.canBeWeakened(card, target, "mjsxingguanqingxin");
	                });
	                return -att * cards.length;
	            })
	            .forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
            player.logSkill(event.name, target);
            const cards = target.getCards("he", card => {
                return lib.filter.canBeWeakened(card, target, "mjsxingguanqingxin");
            });
            if (!cards.length) {
                return;
            }
            if (cards.length <= 1) {
                event.result = { bool: true, cards: cards };
            } else {
                event.result = await player
                    .choosePlayerCard(target, "he", true)
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
		group: "mjsxingguanqingxin_mark",
		subSkill: {
			mark: {
	            charlotte: true,
	            trigger: {
	                player: ["useCardAfter", "respondAfter"],
	            },
	            forced: true,
	            popup: false,
	            firstDo: true,
	            async content(event, trigger, player) {
	            	player.storage.mjsxingguanqingxin_mark = get.number(trigger.card, player);
	              	if (typeof get.number(trigger.card, player) != "number") {
	                	player.unmarkSkill("mjsxingguanqingxin_mark");
	              	} else {
		                player.markSkill("mjsxingguanqingxin_mark");
	              	}
	            },
	            intro: {
	                content(storage, player) {
	                    return "上一张牌的点数：" + get.strNumber(storage);
	                },
	            },
	        },
		},
	},
	//主父偃
	/**献策推恩
	 * 每个回合限1次，当有角色回合外获得大于1张牌时，你可以令其将其中至少1张牌，交给你指定的另外一名其他角色。所有角色每累计获得其他角色4张牌时，你摸1张牌。
	 * 每个回合限1次，当有角色回合外获得大于1张牌时，你可以令其将其中至少1张牌，交给一名你指定的其他角色。所有角色每累计获得其他角色4张牌时，你摸1张牌。
	 * */
	mjsxiancetuien: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
	        global: ["gainAfter", "gameDrawAfter","loseAsyncAfter"],
	    },
	    usable: 1,
	    silent: true,
	    popup: true,
	    forced: false,
	    getIndex: (event, player) => {
	        if (event.name === "loseAsync" && event.type !== "gain") {
	        	return [];
	        }
	        return game.filterPlayer(target => {
	        	if (event.name == "gameDraw") {
	        		return target.countCards("h") > 1;
	        	}
	            return event.getg(target)?.length > 1 && target.getCards("h").containsSome(...event.getg(target));
	        })
	        .sortBySeat();
	    },
	    filter: (event, player, name, target) => {
	    	if (game.countPlayer() < 2) {
	    		return false;
	    	}
	    	if (_status.currentPhase == target) {
	    		return false;
	    	}
	    	return target?.isIn();
	    },
	    logTarget: (event, player, name, target) => target,
	    async cost(event, trigger, player) {
	    	const source = event.indexedData;
	    	event.result = await player
	    		.chooseTarget(get.prompt(event.skill), `令${get.translation(source)}交出至少1张牌给你指定的另外一名其他角色。`, (card, player, target) => {
	    			return target != player && target != get.event().source;
	    		})
	    		.set("sourcex", source)
	    		.set("ai", target => {
	    			const { player, sourcex } = get.event();
	    			const att = get.attitude(player, sourcex);
	    			const att2 = get.attitude(player, target);
	    			if (att2 <= 0) {
	    				return 0;
	    			}
	    			return att2;
	    		})
	    		.forResult();
	    },
	    async content(event, trigger, player) {
	        const source = event.indexedData;
	        const cards = (trigger?.getg?.(source) ?? source.getCards("h"));
	        const target = event.targets[0];
	        await source
	        	.chooseToGive(target, "h", [1, Infinity], true, "allowChooseAll")
	        	.set("filterCard", card => {
	        		return get.event().cards.includes(card);
	        	})
	        	.set("ai", card => {
	        		const player = get.player();
	        		return 5 - get.value(card);
	        	})
	        	.set("cards", cards)
	        	.forResult();
	    },
	    intro: {
	        markcount(storage, player) {
	            return player.countMark("mjsxiancetuien_counter");
	        },
	        content(storage, player) {
	            return `所有角色每累计获得其他角色${player.countMark("mjsxiancetuien_counter")}张牌`;
	        },
	    },
	    group: "mjsxiancetuien_counter",
	    subSkill: {
	    	counter: {
	    		trigger: {
			        global: ["gainAfter","loseAsyncAfter"],
			    },
			    silent: true,
			    locked: false,
			    getIndex(event, player) {
			        if (event.name == "loseAsync" && event.type != "gain") return [];
			        if (!event.getl || !event.getg) return [];
			        return game
			            .filterPlayer(target => {
			                return game.hasPlayer(current => {
			                    if (current == target) return false;
			                    let cards2 = event.getl(current).cards2;
			                    if (cards2.length) {
			                        let cards = event.getg(target);
			                        if (cards?.length && cards.containsSome(...cards2)) return true;
			                    }
			                    return false;
			                });
			            })
			            .sortBySeat();
			    },
	    		async content(event, trigger, player) {
	    			const target = event.indexedData;
	    			const cards = trigger.getg(target).filter(card => {
	    				return game.hasPlayer(current => {
	    					if (current == target) return false;
	    					let cards2 = trigger.getl(current)?.cards2;
	    					if (cards2.length) {
	    						return cards2?.includes(card);
	    					}
		                    return false;
	    				});
	    			});
	    			if (!cards.length) {
	    				return;
	    			}
	    			player.addMark(event.name, cards.length, false);
	    			player.markSkill("mjsxiancetuien");
	    			while (player.countMark(event.name) >= 4) {
	    				player.removeMark(event.name, 4, false);
	    				player.logSkill(event.name);
	    				await player.draw();
	    			}
	    		},
	    	},
	    },
	},
	/**徙豪茂陵
	 * 出牌阶段限1次，令任意名有牌的角色依次将至少1张牌放回牌堆顶，这些角色若因此放回大于1张牌，则在本轮结束时，摸等量张牌。
	 * */
	mjstuhaomaoling: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("he");
		},
		selectTarget: [1, Infinity],
		multitarget: true,
		line: false,
		async content(event, trigger, player) {
			for (const target of event.targets) {
				if (!target.isIn()) {
					return;
				}
				const result = await target
					.chooseCard(`${mjs.prompt(event.name)}选择将至少1张牌放回牌堆顶，若因此放回大于1张牌，则在本轮结束时，摸等量张牌`, "he", true, [1, Infinity], "allowChooseAll")
					.set("ai", card => {
						if (get.event().goon) {
							if (ui.selected.cards.length >= 1) {
								return 0;
							}
						}
						if (ui.selected.cards.length == 1) {
							return 8 - get.value(card);
						}
						return 6 - get.value(card);
					})
					.set(
						"goon",
						(() => {
							const att = get.attitude(target, player);
							if (!target.hasSkill("mjsxiancetuien")) {
								return true;
							}
							return att > 0;
						})()
					)
					.forResult();
				if (result?.bool && result.cards?.length) {
					await target.lose(result.cards, ui.cardPile, "insert");
					if (result.cards.length <= 1) {
						return;
					}
					target.when({ global: "roundEnd" }).then(async (event, trigger, player) => {
						await player.draw(result.cards.length);
					});
				}
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					const hs = target.getCards("h", card => {
						return ["mjschi", "mjsqu"].includes(card);
					});
					if (att <= 0) {
						if (target.hasSkillTag("gain")) {
							return 0;
						}
						if (hs.length) {
							return 0;
						}
					}
					if (target.hasSkillTag("gain")) {
						return 2;
					}
					return hs.length;
				},
			},
		},
	},
	/**筑城朔方
	 * 当有牌被放入牌堆时，你随机将其中1张牌的复制放入“朔方”。每个回合限1次，当你即将受到伤害时，你可以随机销毁“朔方”中的1张牌，令此伤害-1，或者选择获得朔方中的1张牌。
	 * 当有牌被放入牌堆时，你随机将其中1张牌的复制放入“朔方”。当你即将受到伤害时，你可以随机销毁“朔方”中的1张牌，令此伤害-1，或者选择获得朔方中的1张牌。
	 * */
	mjszhuchengshuofang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			global: "loseEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return event.position == ui.cardPile;
		},
		async content(event, trigger, player) {
			const card = trigger.cards.randomGet();
            const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
            if (cardx) {
                const next = player.addToExpansion(cardx, "draw");
		        next.gaintag.add(event.name);
		        await next;
            }
		},
		marktext: "朔方",
		intro: {
	        content: "expansion",
	        markcount: "expansion",
	    },
	    onremove(player, skill) {
	      const cards2 = player.getExpansions(skill);
	      if (cards2.length) {
	        player.loseToDiscardpile(cards2);
	      }
	    },
		group: "mjszhuchengshuofang_destroy",
		subSkill: {
			destroy: {
				trigger: {
					player: "damageBegin3",
				},
				usable: 1,
				silent: true,
				popup: true,
				forced: false,
				filter(event, player) {
					return player.getExpansions("mjszhuchengshuofang").length;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseControl("销毁", "获得", "cancel2")
						.set("prompt", `${mjs.prompt(event.skill)}，选择随机销毁“朔方”中的1张牌，令此伤害-1，或者选择获得朔方中的1张牌`)
						.set("ai", () => {
							const trigger = _status.event.getTrigger();
							if (trigger.num == 1) {
								return 0;
							}
							return 1;
						})
						.forResult();
					if (event.result.index != 2) {
						event.result.cost_data = event.result.index;
					}
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("mjszhuchengshuofang");
					if (event.cost_data == 0) {
						const cards2 = cards.randomGets(1);
						game.log(cards2, "被销毁了");
            			await player.lose(cards2, "toDestroy", ui.special);
						trigger.num--;
						game.log(trigger.player, "受到的伤害", "#y-1");
					} else {
						const result = await player
							.chooseCardButton(get.translation(event.name), cards, true)
							.set("ai", button => {
								return get.player().getUseValue(button.link);
							})
							.forResult();
						if (result?.bool && result.links?.length) {
							await player.gain(result.links, 'draw');
						}
					}
				},
			},
		},
	},
	//郭解
	/**江湖道敕
	 * 当有角色即将受到伤害时，你可以交给伤害来源1张牌并令此伤害-1，接下来本局游戏伤害来源再次对同一角色造成伤害时，你令其随机弃置1张牌。
	 * */
	mjsjianghudaochi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		onremove: (player, skill) => player.removeSkill(skill + "_effect"),
		trigger: {
			global: "damageBegin3",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event.source && event.source?.isIn() && player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
	            .chooseCard(get.prompt(event.skill), `交给${get.translation(trigger.source)}1张牌，令其对${get.translation(trigger.player)}的伤害-1`, "he")
	            .set("ai", card => {
	                const player = get.player(),
	                    trigger = get.event().getTrigger();
	                if (get.attitude(player, trigger.player) <= 0) {
	                	return 0;
	                }
	                if (get.attitude(player, trigger.source) > 0) {
	                	return 0;
	                }
	                return 5 - get.value(card);
	            })
	            .forResult();
		},
		async content(event, trigger, player) {
			await player.give(event.cards, trigger.source);
			trigger.num--;
			game.log(trigger.player, "受到的伤害", "#y-1");
			const skill = event.name + "_effect", targets = [trigger.player];
			player.addSkill(skill);
			if (player.storage[skill].has(trigger.source)) {
				targets.addArray(player.storage[skill].get(trigger.source));
			}
			player.storage[skill].set(trigger.source, targets);
		},
		subSkill: {
			effect: {
				audio: "mjsjianghudaochi",
				init(player, skill) {
					player.storage[skill] = new Map();
				},
				trigger: {
					global: "damageSource",
				},
				silent: true,
				popup: true,
				locked: false,
				filter(event, player) {
					if (!event.source || !event.source?.isIn()) {
						return false;
					}
					const map = player.getStorage("mjsjianghudaochi_effect", new Map());
					if (!map?.has(event.source)) {
	                    return false;
	                }
	                return map.get(event.source).includes(event.player);
				},
				logTarget: "source",
				async content(event, trigger, player) {
					const target = trigger.source;
					const cards = target.getCards("h", card => {
	                    return lib.filter.cardDiscardable(card, target, "mjsjianghudaochi_effect");
	                });
	                if (cards.length > 0) {
	                    await target.discard(cards.randomGets(1)).set("discarder", player);
	                }
				},
			},
		},
	},
	/**权行州里
	 * 每轮限1次，当有角色失去最后一张手牌时，你可以选择另外任意名有牌的其他角色，令这些角色可以将1张牌当作杀对其打出，若拒绝，则下个摸牌阶段摸牌数-1。在此过程中当有一名角色阵亡时，你与伤害来源各失去1点体力。
	 * */
	mjsquanxingzhouli: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
	        global: ["loseAfter","equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
	    },
	    getIndex(event, player, name) {
	        return game
	            .filterPlayer(target => {
	                if (target.countCards("h")) {
	                    return false;
	                }
	                const evt = event.getl(target);
	                return evt?.hs?.length;
	            })
	            .sortBySeat();
	    },
	    filter: (event, player, name, target) => target?.isIn(),
	    logTarget: (event, player, name, target) => target,
	    check: (event, player, name, target) => {
	        return get.attitude(player, target) < 0;
	    },
	    async cost(event, trigger, player) {
	    	const target = event.indexedData;
	    	event.result = await player
	    		.chooseTarget(get.prompt2(event.skill, target), [1, Infinity], (card, player, target) => {
	    			if (target == player || target == get.event().sourcex) {
	    				return false;
	    			}
	    			return target.countCards("he");
	    		})
	    		.set("sourcex", target)
	    		.forResult();
	    },
	    async content(event, trigger, player) {
	    	player.tempBanSkill(event.name, "roundStart", false);
	        const source = event.indexedData;
	        for (const target of event.targets) {
	        	if (!target.isIn()) {
	        		continue;
	        	}
	        	const result = await target.chooseToUse()
		            .set("openskilldialog", `###${get.prompt(event.name)}###你可以将一张牌当作杀对${get.translation(source)}使用，若拒绝，则下个摸牌阶段摸牌数-1。`)
		            .set("norestore", true)
		            .set("_backupevent", `${event.name}_backup`)
		            .set("custom", {
		                add: {},
		                replace: { window: function () { } },
		            })
		            .backup(`${event.name}_backup`)
		            .set("sourcex", source)
		            .forResult()
	        	if (!result.bool) {
	        		target.addSkill("mjsquanxingzhouli_debuff");
	        		target.addMark("mjsquanxingzhouli_debuff", 1, false);
	        	}
	        	if (
                    game.hasGlobalHistory("everything", evt => {
                        if (evt.name != "die" || evt.player != source || !evt.reason) {
                            return false;
                        }
                        return evt.reason.getParent(evtx => evtx == result, true);
                    })
                ) {
                    await player.loseHp();
	        		await target.loseHp();
                }
	        }
	    },
	    subSkill: {
	    	backup: {
	    		viewAs: {
	    			name: "sha",
	    		},
	    		filterTarget(card, player, target) {
	                return target == get.event().sourcex;
	            },
	            filterCard(card) {
	                return get.itemtype(card) == "card";
	            },
	            position: "hes",
	            ai1(card) {
	                return 7 - get.value(card);
	            },
	            log: false,
	    	},
	    	debuff: {
	    		trigger: {
	                player: "phaseDrawBegin2",
	            },
	            silent: true,
	            popup: true,
	            charlotte: true,
	            onremove: true,
	            filter(event, player) {
	                return !event.numFixed;
	            },
	            async content(event, trigger, player) {
	                trigger.num -= player.countMark(event.name);
	                player.removeSkill(event.name);
	            },
	    	},
	    },
	},
	/**为侠者众
	 * 阵亡，接下来本局游戏每轮结束时，所有本轮对其他角色造成过伤害的角色失去1点体力。
	 * */
	mjsweixiazhezhong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        player: "die",
	    },
	    silent: true,
	    popup: true,
	    locked: false,
	    forceDie: true,
	    async content(event, trigger, player) {
	    	//game.addGlobalSkill("mjsweixiazhezhong_effect");
	    	player.addSkill("mjsweixiazhezhong_effect");
	    },
	    ai: {
	    	threaten(player, target) {
	            if (target.hp == 1) {
	              	return 0.2;
	            }
	            return 1.5;
	        },
	    },
	    subSkill: {
	    	effect: {
	    		audio: "mjsweixiazhezhong",
	    		trigger: {
	    			global: "roundEnd",
	    		},
	    		silent: true,
	    		popup: true,
	    		forceDie: true,
	    		filter(event, player) {
	    			return game.hasPlayer(target => {
	    				return target.getRoundHistory("sourceDamage", evt => evt.player != target).length;
	    			});
	    		},
	    		async content(event, trigger, player) {
	    			const targets = game.filterPlayer(target => {
	    				return target.getRoundHistory("sourceDamage", evt => evt.player != target).length;
	    			});
	    			for (const target of targets) {
	    				await target.loseHp();
	    			}
	    		},
	    	},
	    },
	},
	//傅玄
	/**元气上清
	 * 回合开始时，获得1点元气，并且之后每回合获得的元气+1。出牌阶段，你可以消耗2点元气，令一名角色添加1张你选择的类型的牌至其手牌。
	 * */
	mjsyuanqishangqing: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		enable: "phaseUse",
		silent: true,
		filter(event, player) {
			if (event.name == "chooseToUse") {
				return player.countMark("mjsyuanqishangqing") > 1;
			}
			return true;
		},
		addMark(player, num) {
	        player.addMark("mjsyuanqishangqing", num, false);
	        game.log(player, "获得了", "#y" + num, "点", "#g元气");
	    },
		async precontent(event, trigger, player) {
			const skillName = event.name.slice("pre_".length);
			const result = await player
				.chooseTarget(`${mjs.prompt(skillName)}，令1名角色添加1张你选择的类型的牌至其手牌`)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (target == player) {
						return att / 2;
					}
					return att;
				})
				.forResult();
			if (result.bool && result.targets?.length) {
				const target = result.targets[0];
				const result2 = await player
					.chooseControl("basic", "trick", "equip", "cancel2")
					.set("prompt", `令1${get.translation(target)}添加1张你选择的类型的牌至其手牌`)
					.set("ai", () => {
						const { player, target } = get.event();
						const controls = get.event().controls.slice();
						controls.remove("cancel2");
						if (player.hasSkill("mjsjinzhuzhechi", null, null, false)) {
							return "trick";
						}
						return controls.randomGet();
					})
					.set("target", target)
					.forResult();
				if (result2.control != "cancel2") {
					event.result.targets = result.targets;
            		event.getParent().cost_data = result2.control;
					return;
				}
			}
			player.addTempSkill(`${skillName}_aiCheck`, {
	            player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
	        });
	        event.getParent().goto(0);
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				lib.skill.mjsyuanqishangqing.addMark(player, 1);
			} else {
				const target = event.targets[0];
				const type = event.getParent(2).cost_data;
				const trick = mjs.getCardList(type).randomGet();
				const card = mjs.createCard(trick);
				if (card) {
					await target.gain(card, "draw");
				}
			}
		},
		marktext: "元气",
		intro: {
			name: "元气",
			markcount: (storage) => {
				return storage > 0 ? `x${storage}` : storage;
			},
			content: "当前元气值为#",
		},
		ai: {
			order() {
				return 12;
			},
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					return att;
				},
			},
		},
	},
	/**近朱者赤
	 * 当一名其他角色在其回合内累计打出3张战法牌时，你可以令一名与其距离为1的角色获得1张战法牌，若目标角色是你，你获得2点元气。
	 * */
	mjsjinzhuzhechi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "useCard",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			if (event.player == player || event.player != _status.currentPhase) {
				return false;
			}
			return event._mjsjinzhuzhechi;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					const trigger = _status.event.getTrigger();
					if (target == trigger.player) {
						return false;
					}
					return get.distance(target, trigger.player) <= 1;
				})
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (target == player) {
						return att * 2;
					}
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const card = get.cardPile(card => get.type2(card) == "trick");
			if (card) {
				await target.gain(card, "draw");
			}
			if (target == player) {
				lib.skill.mjsyuanqishangqing.addMark(player, 2);
			}
		},
		group: "mjsjinzhuzhechi_counter",
		subSkill: {
			counter: {
				trigger: {
					global: "useCard1",
				},
				forced: true,
	            charlotte: true,
	            popup: false,
	            firstDo: true,
				filter(event, player) {
					if (event.player == player || event.player != _status.currentPhase) {
						return false;
					}
					return get.type2(event.card) == "trick";
				},
				async content(event, trigger, player) {
					const target = trigger.player, skill = event.name;
					let map = player.storage[skill], num = 1;
					if (!map) {
						player.storage[skill] = map = new Map();
					}
			        if (map.has(target)) {
			            num += map.get(target);
			        }
			        map.set(target, num);
			        if (map.get(target) < 3) {
			            return;
			        }
			        map.set(target, 0);
			        trigger._mjsjinzhuzhechi = true;
				},
			},
			aiCheck: {
	            charlotte: true,
	            ai: {
	            	skill_aiCheck: true,
	            },
	        },
		},
	},
	/**政在去私
	 * 限定，选择一种类型的牌，将场上所有此类型的牌放回牌堆顶。
	 * */
	mjszhengzaiqusi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		async precontent(event, trigger, player) {
			const skillName = event.name.slice("pre_".length);
			const result = await player
				.chooseControl("basic", "trick", "equip", "cancel2")
				.set("prompt", `是否发动${mjs.prompt(skillName)}，选择1种类型的牌，将场上所有此类型的牌放回牌堆顶`)
				.set("ai", () => {
					const { player } = get.event();
					const controls = get.event().controls.slice();
					controls.remove("cancel2");
					if (player.hasSkill("mjsjinzhuzhechi", null, null, false)) {
						return "trick";
					}
					return controls.randomGet();
				})
				.forResult();
			if (result.control != "cancel2") {
        		event.getParent().cost_data = result.control;
				return;
			}
			player.addTempSkill(`${skillName}_aiCheck`, {
	            player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
	        });
	        event.getParent().goto(0);
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cardList = [];
			const lose_list = [], players = game.filterPlayer().sortBySeat(player);
		      players.forEach((current) => {
		        const cards = current.getCards("hej", card => get.type2(card) == event.getParent(2).cost_data);
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
		    if (cardList.length) {
	            await game.cardsGotoPile(cardList, "insert");
	        }
		},
		ai: {
			order() {
				return 12;
			},
			result: {
				player(player) {
					return 0;
				},
			},
		},
		subSkill :{
			aiCheck: {
	            charlotte: true,
	            ai: {
	            	skill_aiCheck: true,
	            },
	        },
		},
	},
	//陆机
	/**缘情绮靡
	 * 当有角色成为本轮首次被打出的战法牌的目标时，若你或打出此牌的角色不是此牌的目标，你可以令你或打出此牌的角色也成为此牌的目标。
	 * */
	mjsyuanqingqimi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "useCardToTarget",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			if (get.type(event.card) != "trick") {
				return false;
			}
			if (!event.targets.length) {
	        	return false;
	        }
			const info = get.info(event.card);
	        if (info.multitarget) {
	            return false;
	        }
	        if (event.targets.containsAll(player, event.player)) {
	        	return false;
	        }
	        const evt = event.getParent();
			return game
	            .getRoundHistory(
	                "useCard",
	                evtx => {
	                	if (get.type(evtx.card) != "trick") {
	                		return false;
	                	}
	                    if (!evtx.targets?.includes(event.target)) {
	                        return false;
	                    }
	                    return true;
	                },
	                evt
	            )
	            .indexOf(evt) == 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), `令你${trigger.player == player ? "" : `或${get.translation(trigger.player)}`}也成为${get.translation(trigger.card)}的目标`, (card, player, target) => {
					const trigger = _status.event.getTrigger();
					return target == player || target == trigger.player;
				})
				.set("ai", target => {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					return get.effect(target, trigger.card, trigger.player, _status.event.player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			trigger.getParent().targets.push(trigger.player);
	        trigger.getParent().triggeredTargets2.push(trigger.player);
	        await game.delayx();
		},
	},
	/**陆才如海
	 * 回合开始时，你可以将所有手牌当作本轮未被打出过的任意1张战法牌打出，然后直到你的下个回合开始，当一名其他角色打出本轮首次被打出的战法牌后，你可以将所有手牌当作本轮未被打出过的任意1张战法牌打出。
	 * */
	mjslucairuhai: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		locked: false,
		filter(event, player) {
			return player.countCards("h");
		},
		async content(event, trigger, player) {
			const list = get
	            .inpileVCardList(info => {
	                const name = info[2], nature = info[3];
	                if (get.type2(name) != "trick") {
	                	return false;
	                }
	                if (!player.hasUseTarget({ name: name })) {
	                	return false;
	                }
	                return !game.hasPlayer2(target => {
	                	return target.getRoundHistory("useCard", evt => evt.card.name == name).length > 0
	                });
	            });
	        if (!list.length) {
	        	return;
	        }
			const result = await player
				.chooseButton([get.translation(event.name), [list, "vcard"]])
				.set("ai", button => {
					const player = get.player();
					return player.getUseValue(button.link[2]);
				})
				.forResult();
			if (!result?.links?.length) {
				return;
			}
			game.broadcastAll(function (event, name) {
	            lib.skill[`${event.name}_backup`].viewAs = {
	                name: name,
	            };
	        }, event, result.links[0][2]);
			await player
	            .chooseToUse()
	            .set("openskilldialog", get.prompt(event.name))
	            .set("norestore", true)
	            .set("_backupevent", `${event.name}_backup`)
	            .set("custom", {
	                add: {},
	                replace: { window() {} },
	            })
	            .backup(`${event.name}_backup`)
	            .set("addCount", false)
	            .set("oncard", (card, player) => {
	                player.addTempSkill("mjslucairuhai_effect", { player: "phaseBegin" });
	            });
		},
		subSkill: {
			backup: {
				filterCard(card) {
	                return get.itemtype(card) === "card";
	            },
	            selectCard: -1,
	            position: "h",
	            check(card) {
	                return 7 - get.value(card);
	            },
			},
			effect: {
				audio: "mjslucairuhai",
				trigger: {
					global: "useCard",
				},
				silent: true,
				locked: false,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					return event.player.getRoundHistory("useCard", evt => get.type2(evt.card) == "trick").indexOf(event) == 0;
				},
				async content(event, trigger, player) {
					player.useSkill("mjslucairuhai");
				},
			},
		},
	},
	/**华亭鹤唳 
	 * 每轮结束时，若你在本轮受到过伤害，你可以选择并添加1张你本局游戏打出过的战法牌到手牌，每种牌限1次，之后每当有其他角色打出与此牌相同名称的战法牌时，你可以随机削弱其1张牌。
	 * */
	mjshuatingheli: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		onremove(player, skill) {
			player.removeSkill(skill + "_effect");
		},
		trigger: {
			global: "roundStart",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (!player.getRoundHistory("damage").length) {
				return false;
			}
			return player.hasAllHistory("useCard", evt => get.type2(evt.card) == "trick");
		},
		async cost(event, trigger, player) {
			const list = get.inpileVCardList(info => {
				if (!["trick", "delay"].includes(info[0])) {
					return false;
				}
				if (player.hasStorage("mjshuatingheli_effect", info[2])) {
					return false;
				}
				return player.hasAllHistory("useCard", evt => evt.card.name == info[2]);
			});
			if (!list.length) {
				return;
			}
			event.result = await player
				.chooseButton([get.translation(event.skill), [list, "vcard"]])
				.set("ai", button => {
					return get.player().getUseValue(button.link[2]);
				})
				.forResult();
			if (event.result?.bool && event.result?.links?.length) {
				event.result.cost_data = event.result.links[0][2];
			}
		},
		async content(event, trigger, player) {
			player.addSkill("mjshuatingheli_effect");
			player.markAuto("mjshuatingheli_effect", event.cost_data);
			const card = mjs.createCard(equip.cost_data);
			if (card) {
				await player.gain(card, "draw");
			}
		},
		subSkill: {
			effect: {
				audio: "mjshuatingheli",
				trigger: {
					global: "useCard",
				},
				silent: true,
				popup: true,
				forced: false,
				onremove: true,
				logTarget: "player",
				filter(event, player) {
					return player.hasStorage("mjshuatingheli_effect", event.card.name);
				},
				check(event, player) {
					return get.attitude(player, event.player) <= 0;
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					const cards = target.getCards("he", card => {
						return lib.filter.canBeWeakened(card, target, event.name);
					});
					if (cards.length) {
						await target.mjsWeakenCards(cards.randomGets(1), player);
					}
				},
			},
		},
	},
	//刘禅
	/**素丝守成
	 * 出牌阶段限4次，可以令一名其他角色查看并打出你的1张手牌，其打出此牌时无法选择你为目标，并且当其打出此牌后，将此过程中获得的牌交给你，若其无法打出，则其随机弃置1张牌。
	 * */
	mjssusishoucheng: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		mod: {
			targetEnabled(card, player, target, now) {
				if (_status.event.getParent(2).name == "mjssusishoucheng" && target != player) {
					return false;
				}
			},
		},
		enable: "phaseUse",
		usable: 4,
		filter(event, player) {
			return player.countCards("h");
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			const hs = player.getCards("h");
            if (!hs.length) {
            	return;
            }
            //官方有一个先看的动作隐藏
            //await target.viewHandcards(player);
            const cards = hs.filter(card => {
                /*var cardx = {
					name: get.name(card, get.owner(card)),
					nature: get.nature(card, get.owner(card)),
					cards: [card],
				};*/
				var cardx = card;
                return target.hasUseTarget(cardx, true, false);
            });
            const result = await target
                .chooseButton(["###素丝守成###是否使用其中一张牌", hs])
                .set("filterButton", button => {
                    return get.event().cards.includes(button.link);
                })
                .set("cards", cards)
                .set("ai", button => {
                    const card = button.link;
                    const player = get.player();
                    if (!game.hasPlayer(target => {
                    	return target != get.owner(card) && player.canUse(card, target, true, false);
                    })) {
                    	return 0;
                    }
                    return player.getUseValue(card);
                })
                .forResult();
            if (result?.links?.length) {
                var card = result.links[0];
                /*var cardx = {
					name: get.name(card, get.owner(card)),
					nature: get.nature(card, get.owner(card)),
					cards: [card],
				};
				var next = player.chooseUseTarget(cardx, [card], true, false);
				if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
					next.viewAs = false;
				}*/
				if (target.hasUseTarget(card, true, false)) {
					const next = target.chooseUseTarget(card);
					next.addCount = false;
					event.result = await next.forResult();
					const gains = target
						.getHistory("gain", evt => {
							return evt.getParent(event.name) == event;
						})
						.reduce((list, evt) => list.add(evt.cards), [])
						.flat();
					const cards = target.getCards("h", card => {
						return gains.includes(card);
					});
					if (cards.length) {
						await target.give(cards, player, "giveAuto");
					}
				}
            }
            if (!event?.result?.bool) {
            	const cards = target.getCards("he", card => {
                    return lib.filter.cardDiscardable(card, player, "mjssusishoucheng");
                });
                if (cards.length > 0) {
                    await target.discard(cards.randomGets(1)).set("discarder", player);
                }
            }
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					const hs = player.getCards("h", card => {
						return target.hasUseTarget(card, true, false);
					});
					if (att > 0) {
						if (!hs.length) {
							return 0;
						}
						return att * 2;
					}
					if (hs.length) {
						return 0;
					}
					return att;
				},
			},
		},
    },
	/**乐不思蜀
	 * 你打出的牌无法选择其他角色为目标，并且生效2次。
	 * */
    mjslebusishu: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			playerEnabled(card, player, target) {
	            if (player != target) {
	              return false;
	            }
	        },
		},
		trigger: {
			player: "useCard",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return lib.skill.mjslebusishu.filterx(event);
		},
		filterx(event) {
			if (!["basic", "trick"].includes(get.type(event.card))) {
				return false;
			}
			if (!event.targets.length) {
				return false;
			}
			return true;
	    },
		async content(event, trigger, player) {
			trigger.effectCount++;
		},
		ai: {
			halfneg: true,
		},
    },
    //魏延
    /**子午奇谋
	 * 每轮开始时，你可以将任意牌当作杀对一名其他角色打出，若此杀造成伤害，你摸2张牌。
	 * */
    mjsziwuqimou: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "roundStart",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return player.hasCards("hes");
		},
		async content(event, trigger, player) {
			const next = player.chooseToUse();
			next.set("openskilldialog", `###${get.prompt(event.name)}###将任意牌当作杀对一名其他角色打出，若此杀造成伤害，你摸2张牌。`);
			next.set("norestore", true);
			next.set("_backupevent", `${event.name}_backup`);
			next.set("addCount", false);
			next.set("logSkill", event.name);
			next.set("custom", {
                add: {},
                replace: { window() { } },
            });
			next.backup(`${event.name}_backup`);
			const result = await next.forResult();
			if (result.bool && player.hasHistory("sourceDamage", evt => evt.getParent("chooseToUse") == next)) {
				await player.draw(2);
			}
		},
		subSkill: {
			backup: {
				filterCard(card) {
	              	return get.itemtype(card) == "card";
	            },
	            viewAs: {
	                name: "sha",
	            },
	            selectCard: 1,
	            position: "hes",
	            ai1(card) {
	            	return 8 - get.value(card);
	            },
	            log: false,
			},
		},
    },
    /**反骨逆战
	 * 当你选择杀的目标时，目标本轮每对你打出过1张杀，此杀对其伤害+1。
	 * */
    mjsfangunizhan: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "useCard",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return event.card.name == "sha" && event.targets?.length;
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			for (const target of trigger.targets) {
				const num = target.getRoundHistory("useCard", evt => evt.card.name == "sha" && evt.targets.includes(player)).length;
	            const id = target.playerid;
                const map = trigger.customArgs;
                if (!map[id]) {
                    map[id] = {};
                }
                if (typeof map[id].extraDamage != "number") {
                    map[id].extraDamage = 0;
                }
                map[id].extraDamage += num;
	        }
		},
    },
    /**谁敢杀我
	 * 限定，令所有其他角色依次对你打出1张杀，若无法打出，则你获得其1张牌，并且出杀次数+1。
	 * */
    mjsshuiganshawo: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		filterTarget(card, player, target) {
			return target != player;
		},
		selectTarget: -1,
		multitarget: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			for (const target of event.targets) {
				const result = await target
					.chooseToUse(
						function(card, player2, event2) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"谁敢杀我：对" + get.translation(player) + "使用一张杀，或令其获得你的一张牌"
					)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("filterTarget", function(card, player2, target2) {
						if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.filterTarget.apply(this, arguments);
					})
					.set("sourcex", player)
					.forResult();
				if (result.bool == false && target.countCards("he") > 0) {
					if (target.hasGainableCards(player, "he")) {
						await player.gainPlayerCard(target, "he", true);
					}
					player.addTempSkill("mjsshuiganshawo_sha");
					player.addMark("mjsshuiganshawo", 1, false);
				}
			}
		},
		ai: {
	        order() {
	        	const player = get.player();
	        	if (player && player.hasSkill("mjsfangunizhan", null, null, false)) {
	        		return get.order({ name: "sha" }) + 0.5;
	        	}
	        	return get.order({ name: "sha" }) - 0.5;
	        },
	        result: {
	            player(player) {
	              	return 1;
	            },
	        },
	    },
	    subSkill: {
	    	sha: {
	    		charlotte: true,
	    		onremove: true,
	    		mod: {
	    			cardUsable(card, player, num) {
	    				if (card.name == "sha") {
	    					return num + player.countMark("mjsshuiganshawo_sha");
	    				}
	    			},
	    		},
	    	},
	    },
    },
    //司马炎
	/**泰始新律
	 * 限定，你选择1张手牌，削弱游戏中所有同名牌，接下来本局游戏当你打出削弱牌后，可以削弱一名角色的2张牌。
	 * */
    mjstaishixinlv: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		enable: "phaseUse",
	    filter(event, player) {
	        return player.countCards("h");
	    },
	    limited: true,
	    filterCard: true,
	    check(card) {
	        return 8 - get.value(card);
	    },
	    lose: false,
	    discard: false,
	    delay: false,
	    async content(event, trigger, player) {
	        player.awakenSkill(event.name);
	        const cards = ["cardPile", "discardPile"].map(pos => Array.from(ui[pos].childNodes)).flat();
	        const filter = card => event.cards[0].name == card.name && lib.filter.canBeWeakened(card, player, "mjstaishixinlv");
	        const cards2 = cards.filter(filter);
	        if (cards2.length) {
	            await player.mjsWeakenCards(cards2, "notBySelf");
	        }
	        for (const target of game.filterPlayer()) {
	            const cards = target.getCards("hej", filter);
	            if (cards.length) {
	                await target.mjsWeakenCards(cards, player);
	            }
	        }
	        player.addSkill(event.name + "_effect");
	    },
	    ai: {
	        order: 10,
	        result: {
	            player(player) {
	                return 1;
	            },
	        },
	    },
	    subSkill: {
	    	effect: {
	    		trigger: {
	    			player: "useCardAfter",
	    		},
	    		silent: true,
	    		forced: false,
	    		filter(event, player) {
	    			return get.is.mjsWeakenedCard(event.card);
	    		},
	    		async cost(event, trigger, player) {
	    			event.result = await player
	    				.chooseTarget(get.prompt(event.skill), "削弱一名角色的2张牌")
	    				.set("ai", card => {
							const player = get.player();
							const att = get.attitude(player, target);
							const cards = target.getCards("he", card => {
								return lib.filter.canBeWeakened(card, target, "mjstaishixinlv_effect");
							});
							return -att * cards.length;
						})
	    				.forResult();
	    		},
	    		async content(event, trigger, player) {
	    			const target = event.targets[0];
	    			player.logSkill(event.name, target);
	    			const cards = target.getCards("he", card => {
	    				return lib.filter.canBeWeakened(card, target, "mjstaishixinlv_effect");
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
	    },
    },
    /**容纳谠正
	 * 你的怒只能当作上1张被打出的战法牌打出。你打出的或你装备区的削弱牌以普通牌效果生效。
	 * */
    mjsrongnadangzheng: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		init(player, skill) {
	        player.addSkill(skill + "_mark");
	    },
	    onremove(player, skill) {
	        player.removeSkill(skill + "_mark");
	    },
	    mod: {
	        cardEnabled(card, player) {
	        	const name = player.storage.mjsrongnadangzheng_mark;
	            if (card.name != "nu") {
	                return;
	            }
	            const hs = player.getCards("h", "nu");
	            if ("cards" in card && Array.isArray(card.cards) && card.cards.containsSome(...hs)) {
	                return false;
	            }
	        },
	        cardRespondable(card, player) {
	        	const name = player.storage.mjsrongnadangzheng_mark;
	            const evt = get.event();
	            const judge = evt.skill === "mjsrongnadangzheng";
	            if ([name].includes(get.name(card)) || card.name != "nu" || judge) {
	                return;
	            }
	            const hs = player.getCards("h", "nu");
	            if ("cards" in card && Array.isArray(card.cards) && card.cards.containsSome(...hs)) {
	                return false;
	            }
	        },
	        cardSavable(card, player) {
	            return lib.skill.mjsrongnadangzheng.mod.cardEnabled.apply(this, arguments);
	        },
	    },
		enable: "chooseToUse",
		filter(event, player) {
			const name = player.storage.mjsrongnadangzheng_mark;
			if (!name) {
				return false;
			}
			if (!player.countCards("h", { name: "nu" })) return false;
			return player.hasCards("h", cardx => event.filterCard({ name: name, cards: [cardx] }, player, event))
		},
		viewAs(cards, player) {
			const name = player.storage.mjsrongnadangzheng_mark;
			if (name) {
				return { name: name };
			}
			return null;
		},
		filterCard(card) {
			return card.name == "nu";
		},
		hiddenCard(player, name) {
			const name2 = player.storage.mjsrongnadangzheng_mark;
			if (!name2) {
				return false;
			}
	        return [name2].includes(name) && player.hasCards("h", "nu");
	    },
		ai: {
			unweakened: true,
			skillTagFilter(player, tag, arg) {
				if (arg && get.position(arg) == "j") {
					return false;
				}
			},
			order(item, player) {
				player = player || get.event().player;
				const name = player.storage.mjsrongnadangzheng_mark;
				return get.order({ name: name }) + 0.5;
			},
			result: {
				player(player) {
					const name = player.storage.mjsrongnadangzheng_mark;
					if (!name) {
						return 0;
					}
					return 1;
				},
			},
		},
		subSkill: {
			mark: {
				init(player, skill) {
					const history = game.getAllGlobalHistory("useCard", evt => get.type2(evt.card) == "trick"),
                    	length = history.length;
	                if (!length) {
	                    return;
	                }
	                const card = history[length - 1].card;
	                player.storage[skill] = card.name;
					player.addTip(skill, "怒 " + get.translation(player.storage[skill]));
				},
				onremove(player, skill) {
	                delete player.storage[skill];
	                player.removeTip(skill);
	            },
				charlotte: true,
				trigger: {
					global: "useCard1",
				},
				silent: true,
				filter(event, player) {
					return get.type2(event.card) == "trick";
				},
				async content(event, trigger, player) {
					lib.skill[event.name].init(player, event.name);
				},
			},
		},
    },
    /**善始难终
	 * 当你打出削弱牌时，摸1张牌，当所有角色累计打出15张削弱牌后，失去技能容纳说正，此技能增加效果“每个回合限1次，当你获得牌时，削弱这些牌”。
	 * */
    mjsshanshinanzhong: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:6",
		logAudio: index => "ext:名将杀/audio/skill/mjsshanshinanzhong" + (typeof index === "number" ? index : get.rand(1, 6)) + ".mp3",
		onremove(player, skill) {
			player.removeSkill(skill + "_rewrite");
		},
		trigger: {
			player: "useCard",
			global: "useCardAfter",
		},
		silent: true,
		popup: true,
		filter(event, player, name) {
			if (name == "useCard") {
				return get.is.mjsWeakenedCard(event.card);
			}
			return event._mjsshanshinanzhong;
		},
		async content(event, trigger, player) {
			if (event.triggername == "useCard") {
				await player.draw();
			} else {
				player.$fullscreenpop("善始难终", "xijin");
				await player.removeSkills("mjsrongnadangzheng");
				player.addSkill(event.name + "_rewrite");
				game.log(player, "修改了技能", "#g" + `【${get.translation(event.name)}】`);
			}
		},
		group: "mjsshanshinanzhong_counter",
		subSkill: {
			counter: {
				trigger: {
					global: "useCard1",
				},
				forced: true,
	            charlotte: true,
	            popup: false,
	            firstDo: true,
	            filter(event, player) {
	            	return get.is.mjsWeakenedCard(event.card);
	            },
				async content(event, trigger, player) {
					player.addMark(event.name, 1, false);
					player.markSkill("mjsshanshinanzhong");
					if (player.countMark(event.name) === 15) {
						trigger._mjsshanshinanzhong = true;
						player.removeSkill(event.name);
					}
				},
			},
			rewrite: {
				trigger: {
			        player: "gainAfter",
			        global: ["gameDrawAfter","loseAsyncAfter"],
			    },
			    usable: 1,
			    silent: true,
			    popup: true,
			    filter(event, player) {
			        if (!player.countCards("h")) return false;
			        if (event.name == "gameDraw") return true;
			        return event.getg?.(player)?.length > 0;
			    },
				async content(event, trigger, player) {
					const cards = (trigger?.getg?.(player) ?? player.getCards("h")).filter(card => {
						return lib.filter.canBeWeakened(card, player, event.name);
					});
					if (cards.length) {
						await player.mjsWeakenCards(cards, player);
					}
				},
			},
		},
    },
    //羊祜
    /**轻裘缓带
     * 你的每个阶段结束时：若你的装备区没有牌，则你的下一轮的同名阶段改为出牌阶段；若你的装备区有牌，则你的下一轮的同名阶段改为摸牌阶段。
	 * 你的每个阶段结束时：若你的装备区没有牌，则你的装备上限-1并且下一轮的同名阶段改为出牌阶段；若你的装备区有牌，则你的装备上限+1并且下一轮的同名阶段改为摸牌阶段。
	 * */
    mjsqingqiuhuandai: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			player: "phaseAnyEnd",
		},
		silent: true,
		locked: false,
		async content(event, trigger, player) {
			const phasename = player.hasCards("e") ? "phaseDraw" : "phaseUse";
			game.log(player, "下一轮的", "#g" + trigger.name, "=>", "#g" + phasename);
			player
				.when("phaseBegin")
				.then(async (event2, trigger2, player2) => {
					player2.addTempSkill(`mjsqingqiuhuandai_${phasename}`);
					player2.markAuto(`mjsqingqiuhuandai_${phasename}`, trigger.name);
				});
		},
		subSkill: {
			phaseUse: {
				trigger: {
					player: "phaseChange",
				},
				silent: true,
				popup: true,
				onremove: true,
				filter(event, player) {
					if (event.phaseList[event.num].startsWith("phaseUse")) {
						return false;
					}
					if (event.phaseList[event.num].endsWith("mjsqingqiuhuandai")) {
			            return false;
			        }
					const phasename = event.phaseList[event.num].split("|")[0];
					return player.hasStorage("mjsqingqiuhuandai_phaseUse", phasename);
				},
				async content(event, trigger, player) {
					const phasename = trigger.phaseList[trigger.num].split("|")[0];
					game.log(player, "的", "#g" + phasename, "=>", "#g" + "phaseUse");
					trigger.phaseList[trigger.num] = `phaseUse|mjsqingqiuhuandai`;
					await game.delayx();
				},
			},
			phaseDraw: {
				trigger: {
					player: "phaseChange",
				},
				silent: true,
				popup: true,
				onremove: true,
				filter(event, player) {
					if (event.phaseList[event.num].startsWith("phaseDraw")) {
						return false;
					}
					if (event.phaseList[event.num].endsWith("mjsqingqiuhuandai")) {
			            return false;
			        }
					const phasename = event.phaseList[event.num].split("|")[0];
					return player.hasStorage("mjsqingqiuhuandai_phaseDraw", phasename);
				},
				async content(event, trigger, player) {
					const phasename = trigger.phaseList[trigger.num].split("|")[0];
					game.log(player, "的", "#g" + phasename, "=>", "#g" + "phaseDraw");
					trigger.phaseList[trigger.num] = `phaseDraw|mjsqingqiuhuandai`;
					await game.delayx();
				},
			},
		},
    },
    /**德冠四海
     * 出牌阶段限1次，当你选择其他角色为牌的目标时，你可以将你的装备牌收回手牌，并且令你与所有此牌的目标分别展示2张手牌(不足则全展示)，然后你选择其中一名其他角色，交换你与其展示的牌，若交换后你的手牌总点数全场最大，添加1张装备牌至手牌并且装备上限+1。
	 * 出牌阶段限1次，当你选择其他角色为牌的目标时，你可以令你与所有此牌的目标分别展示2张手牌（不足则全展示），并且你选择其中一名其他角色，交换你与其展示的牌，若交换后你的手牌总点数全场最大，添加1张装备牌至手牌并且装备上限+1。
	 * */
    mjsdeguansihai: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:6",
		trigger: {
			player: "useCardToPlayer",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (!event.isFirstTarget) {
				return false;
			}
			if (!event.targets?.length || event.targets?.includes(player)) {
				return false;
			}
			return !player.hasSkill("mjsdeguansihai_used");
		},
		logTarget: "targets",
		chooseToShow(target, player) {
	        const next = target.chooseCard(`${mjs.prompt("mjsdeguansihai")}，请选择展示2张手牌`, 2, true);
	        next.set("sourcex", player);
	        next.set("att", get.attitude(target, player));
	        next.set("ai", card => {
	            const { player, att, sourcex } = get.event();
	            if (player == sourcex) {
	                if (!player.hasFriend()) {
	                    if (ui.selected.cards.length >= 1) return 0;
	                    return 4 - get.value(card);
	                }
	                return 8 - get.value(card);
	            }
	            if (att > 0) {
	                return 15 - get.value(card);
	            }
	            return 0;
	        });
	        return next;
	    },
		async content(event, trigger, player) {
			player.addTempSkill("mjsdeguansihai_used", "phaseUseAfter");
			const cards = player.getCards("e");
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
			const list = [];
	        const map = await game.chooseAnyOL([player, ...trigger.targets], get.info(event.name).chooseToShow, [player]).forResult();
	        if (!map.size) {
	            return;
	        }
	        for (const target of Array.from(map.keys())) {
	            const result = map.get(target);
	            if (result?.bool && result.cards?.length) {
	                list.push([target, result.cards]);
	                const next = game.createEvent("showCards");
	                next.player = target;
	                next.cards = result.cards;
	                next.setContent("emptyEvent");
	                game.log(target, "展示了", result.cards);
	                await next;
	            } else {
	                list.push([target, []]);
	            }
	        }
	        game.showCardsOnPlayer(list);
	        const result = await player
	            .chooseTarget(`${mjs.prompt(event.name)}，请选择需要交换手牌的目标`, true, (card, player, target) => {
	            	const trigger = _status.event.getTrigger();
	            	return target != player && trigger.targets.includes(target);
	            })
	            .set("ai", target => {
	                const { player, list } = get.event();
	                if (!list.some(info => info[0] == target)) {
	                    return 0;
	                }
	                const cards = list.find(info => info[0] == target)[1];
	                return cards.length;
	            })
	            .set("list", list)
	            .forResult();
	        game.hideCardsFromPlayer(game.filterPlayer());
	        if (result?.targets?.length) {
	            const [target] = result.targets;
	            const cards = list.find(info => info[0] == player)[1],
	                cards2 = list.find(info => info[0] == target)[1];
	            //交换手牌不触发失去和获得的时机，感觉名将杀的流程应该是相反的
	            //await player.swapHandcards(target, cards, cards2);
	            await target.gain(cards, player, "giveAuto", "bySelf");
	            await player.gain(cards2, target, "giveAuto", "bySelf");
	            const isMaxNumberOfHandCards = player2 => {
	            	const numberOfHandCards = player2.getCards("h").reduce((sum, card) => sum + get.number(card, player2), 0);
	            	return game.filterPlayer().every((value) => {
				      	if (value.isOut() || value == player2) {
				        	return true;
				      	}
				      	return value.getCards("h").reduce((sum, card) => sum + get.number(card, value), 0) <= numberOfHandCards;
				    });
	            };
	            if (isMaxNumberOfHandCards(player)) {
	            	const equip = mjs.getEquip("random");
	            	const card = mjs.createCard(equip);
	            	if (card) {
	            		await player.gain(card, "draw");
	            	}
	            	await player.mjsContractEquip();
	            }
	        }
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
    },
    /**潜谋远计
     * 回合结束时，你选择一名其他角色，你本回合每打出过1张装备牌，就随机削弱其1张牌。
	 * 回合结束时，你选择一名其他角色，你本回合每弃置1张牌，就随机削弱其1张牌。
	 * */
    mjsqianmouyuanji: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			return player.hasHistory("useCard", evt => get.type(evt.card) == "equip");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", card => {
					const player = get.player();
					const att = get.attitude(player, target);
					const cards = target.getCards("he", card => {
						return lib.filter.canBeWeakened(card, target, "mjsqianmouyuanji");
					});
					return -att * cards.length;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const num = player.getHistory("useCard", evt => get.type(evt.card) == "equip").length;
			const cards = target.getCards("he", card => {
				return lib.filter.canBeWeakened(card, target, "mjsqianmouyuanji");
			});
			if (cards.length) {
				await target.mjsWeakenCards(cards.randomGets(num), player);
			}
		},
    },
	//刘据
	/**博望纳贤
	 * 每个回合限1次，当你失去最后的手牌时，其他角色可以交给你任意张牌；当你获得其他角色的牌时，随机获得其中1张牌的复制，每名其他角色每个回合限1次。
	 * */
    mjsbowangnaxian: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		chooseToGive(target, player) {
	        const next = target.chooseCard("h");
	        next.set("prompt", "是否交给" + get.translation(player) + "任意张牌？", "he");
	        next.set("_global_waiting", true);
	        next.set("selectCard", [1, Infinity])
	        next.set("ai", card => {
	            if (get.event().att > 0) {
					if (get.is.playerNames(get.player(), "mjs_weizifu")) {
						return 520;
					}
					if (ui.selected.cards.length > 1) {
						return 0;
					}
	            	return 10 - get.value(card);
	            }
	            return 0;
	        });
	        next.set("att", get.attitude(target, player));
	        return next;
	    },
		group: ["mjsbowangnaxian_lose", "mjsbowangnaxian_gain"],
		subSkill: {
			lose: {
				audio: "mjsbowangnaxian",
				trigger: {
			        player: "loseAfter",
			        global: ["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
			    },
			    usable: 1,
				silent: true,
				popup: true,
				forced: true,
				locked: false,
			    filter(event, player) {
			        if (player.countCards("h")) {
			            return false;
			        }
			        const evt = event.getl(player);
			        return evt?.player == player && evt?.hs?.length > 0 && game.hasPlayer(current => current != player);
			    },
			    logTarget(event, player) {
			        return game.filterPlayer(current => current != player);
			    },
			    async content(event, trigger, player) {
			    	const map = await game.chooseAnyOL(event.targets, get.info("mjsbowangnaxian").chooseToGive, [player]).forResult();
			        if (!map.size) {
			            return;
			        }
			        const cards = [];
			        for (const target of Array.from(map.keys())) {
			            const result = map.get(target);
			            if (result?.bool && result.cards?.length) {
			                cards.addArray(result.cards);
			            }
			        }
			        let next;
			        if (cards.length) {
			            next = player.gain(cards, "giveAuto");
			            await next;
			        }
			    },
			},
			gain: {
				audio: "mjsbowangnaxian",
				trigger: {
			        player: "gainAfter",
			        global: "loseAsyncAfter",
			    },
			    silent: true,
			    popup: true,
				locked: false,
			    getIndex(event, player) {
			        if (event.name == "loseAsync" && event.type != "gain") return [];
			        if (!event.getl || !event.getg) return [];
			        const cards = event.getg(player);
			        return game
			            .filterPlayer(target => {
			                if (target == player) return false;
			                if (cards.length) {
			                    let evt = event.getl(target);
			                    if (evt?.cards2?.length && evt.cards2.some(card => cards.includes(card))) return true;
			                }
			                return false;
			            })
			            .sortBySeat();
			    },
			    filter(event, player, triggername, target) {
			    	return !player.hasStorage("mjsbowangnaxian_used", target);
			    },
			    async content(event, trigger, player) {
			    	const cards = trigger.getg(player);
			    	const target = event.indexedData;
			    	player.addTempSkill("mjsbowangnaxian_used");
			    	player.markAuto("mjsbowangnaxian_used", target);
			    	if (cards.length) {
			    		const card = cards.randomGet();
			    		const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
                    	if (cardx) {
							await player.gain(cardx, "draw");
						}
			    	}
			    },
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
    },
    /**惧忿成戾
	 * 限定，回合结束时，若你的体力值全场最低，你可以销毁所有手牌，摸2倍数量张牌，并获得1个额外的出牌阶段，直到此阶段结束时，若没有角色阵亡，你失去全部体力。
	 * */
    mjsjufenchengli: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseEnd",
		},
		silent: true,
		popup: true,
		forced: false,
		limited: true,
		filter(event, player) {
			return player.isMinHp();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = player.getCards("h");
			if (cards.length) {
				game.log(cards, "被销毁了");
        		await player.lose(cards, "toDestroy", ui.special);
        		await player.draw(cards.length * 2);
			}
			player
                .when("phaseUseEnd")
                .filter(evt => evt._extraPhaseReason == "mjsjufenchengli")
                .then(async (event2, trigger2, player2) => {
                    if (!game.hasGlobalHistory("everything", evt => {
                    	return evt.name == "die" && evt.getParent("phaseUse") == trigger2;
                    })) {
                        await player2.loseHp(player2.getHp(true));
                    }
                });
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
    },
    /**归来望思
	 * 阵亡，你可以令一名其他角色的手牌上限-1，并且之后每个摸牌阶段的摸牌数-1。
	 * */
    mjsguilaiwangsi: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        player: "die",
	    },
	    silent: true,
	    forced: false,
	    forceDie: true,
	    async cost(event, trigger, player) {
	        event.result = await player
	            .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
	            .set("ai", target => {
	                const player = get.player();
	                const att = get.attitude(player, target);
	                return -att;
	            })
	            .forResult();
	    },
	    async content(event, trigger, player) {
	        const target = event.targets[0];
	        player.logSkill(event.name, target);
	        target.addSkill(event.name + "_debuff");
	        target.addMark(event.name + "_debuff", 1, false);
	    },
	    subSkill: {
	    	debuff: {
	    		mod: {
	    			maxHandcard(player, num) {
	    				return num - player.countMark("mjsguilaiwangsi_debuff");
	    			},
	    		},
	    		trigger: {
	    			player: "phaseDrawBegin2",
	    		},
	    		silent: true,
	    		popup: true,
	    		charlotte: true,
	    		filter(event, player) {
	    			return !event.numFixed;
	    		},
	    		async content(event, trigger, player) {
	    			trigger.num -= player.countMark(event.name);
	    		},
	    	},
	    },
    },
    //郭舍人
	/**巧言解祸
	 * 每个回合限1次，当其他角色选择你为牌的目标时，你可以立即打出1张相同花色或点数的牌，然后抵消此牌。
	 * */
    mjsqiaoyanjiehuo: {
    	nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			target: "useCardToTarget",
		},
		usable: 1,
		direct: true,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			if (typeof get.number(event.card) != "number" || !lib.suit.includes(get.suit(event.card))) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const next = player.chooseToUse({
				prompt: get.prompt2(event.name),
				filterCard(card, player) {
					const trigger = get.event().getTrigger();
					if (get.suit(card) != get.suit(trigger.card) && get.number(card) != get.number(trigger.card)) {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				},
				ai1(card) {
					return get.player().getUseValue(card);
				},
			});
			next.set("logSkill", event.name);
			const result = await next.forResult();
			if (!result?.bool) {
				return;
			}
			trigger.getParent().excluded.add(player);
            game.log(trigger.card, "对", player, "无效");
		},
    },
    /**投壶
	 * 出牌阶段限1次，卜卦，并翻开牌堆顶的3张牌，然后你可以弃置1张牌，若点数与卜卦牌相同，则你获得这3张牌，否则你选择获得其中1张，并将另外2张牌按原顺序放回牌堆顶。
	 * */
    mjstouhu: {
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			const cards = get.cards(3);
            await game.cardsGotoOrdering(cards);
            game.log(player, "翻开牌堆顶的", cards);
			event.videoId = lib.status.videoId++;
            const createDialog = function (player, cards, id) {
                const dialog = ui.create.dialog("forcebutton", true);
                dialog.classList.add("mj-flip");
                dialog.videoId = id;
                const buttons = ui.create.div(".buttons", dialog.content);
                for (const card of cards) {
                    buttons.appendChild(card);
                    dialog.open();
                    ui.create.cardSpinning(card);
                }
            };
            const closeDialog = function (id) {
                const dialog = get.idDialog(id);
                if (dialog) {
                    dialog.close();
                }
            };
            game.broadcastAll(createDialog, player, cards, event.videoId);
			await game.delay(2);
			game.broadcastAll(closeDialog, event.videoId);
			const result = await player.judge().forResult();
			if (result) {
				const cardList = [];
				cardList.addArray(cards);
				if (get.itemtype(result.card) == "card") {
					cardList.add(result.card);
				}
				const createDialog = function (player, cards, id) {
					const dialog = ui.create.dialog("投壶");
					dialog.css({
						top: get.is.phoneLayout() ? "10%" : "45%",
					});
					dialog.add(cards);
					dialog.buttons.forEach((button, index) => {
						button.style.setProperty("opacity", "1");
						if (index == (dialog.buttons.length - 1)) {
							button.style.setProperty("left", "80px");
						}
					});
					dialog.add(`<div><div style="width:100%;text-align:center"><span class="mj-skilltext">投壶</span>发动，你可以弃置1张牌，若点数与卜卦牌相同，则你获得这3张牌，否则你选择获得其中1张</div></div>`);
					dialog.videoId = id;
				};
				game.broadcastAll(createDialog, player, cardList, event.videoId);
				const result2 = await player
					.chooseToDiscard("he")
					.set("prompt", false)
					.set("ai", card => {
						return 6 - get.value(card);
					})
					.forResult();
				if (result2?.bool && result2?.cards?.length) {
					if (get.number(result2.cards[0]) == result.number) {
						event.result = { bool: true, links: cards };
					} else {
						event.result = await player
							.chooseButton(get.idDialog(event.videoId))
							.set("filterButton", button => {
								return get.event().cards.includes(button.link);
							})
							.set("ai", button => {
								return get.value(button.link);
							})
							.set("cards", cards)
							.forResult();
					}
					game.broadcastAll(closeDialog, event.videoId);
					if (event.result?.bool && event.result?.links?.length) {
						await player.gain(event.result.links, "gain2");
						cards.removeArray(event.result.links);
					}
				}
			}
			if (cards.length) {
				cards.reverse();
                game.addCardKnower(cards, player);
                await game.cardsGotoPile(cards, "insert");
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return 1;
				},
			},
		},
    },
	//吕蒙
	/**束军克己
	 * 每个回合结束时，若你此回合没有打出过牌，你获得1张杀；回合开始时，你每拥有3张杀，随机添加1张战法牌到你的手牌。
	 * 每个回合结束时，若你此回合没有打出过牌，你获得1张杀；回合开始时，你每拥有2张杀，随机添加1张战法牌到你的手牌。
	 * */
	mjsshujunkeji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseEnd",
			player: "phaseBegin",
		},
		silent: true,
	    popup: true,
	    locked: false,
		filter(event, player, name) {
			if (name == "phaseEnd") {
				return !game
					.getGlobalHistory("everything", evt => {
						return ["useCard", "respond"].includes(evt.name) && evt.player == player && evt.card.name == "sha";
					})
					.length;
			}
			return player.countCards("h", "Sha") > 1;
		},
		async content(event, trigger, player) {
			if (event.triggername == "phaseEnd") {
				const card = get.cardPile("sha");
				if (card) {
					await player.gain(card, "draw");
				}
			} else {
				const num = Math.floor(player.countCards("h") / 2);
				const cards = [];
				while (cards.length < num) {
					const trick = mjs.getTrick("random");
					const card = mjs.createCard(trick);
					if (card) {
						cards.push(card);
					} else {
						break;
					}
				}
				if (cards.length) {
					await player.gain(cards, "gain2");
				}
			}
		},
	},
	/**笃志奋学
	 * 你每获得3张战法牌，手牌上限+1。
	 * 你每获得3张战法牌，手牌上限+2。
	 * */
	mjsduzhifenxue: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        player: "gainAfter",
	        global: "loseAsyncAfter",
	    },
	    silent: true,
	    popup: true,
	    locked: false,
	    filter(event, player) {
	        return event.getg && event.getg(player)?.some(card => get.type2(card) == "trick");
	    },
	    async content(event, trigger, player) {
	        const num = trigger.getg(player).filter(card => get.type2(card) == "trick").length;
	        if (num > 0) player.addMark(event.name, num, false);
	        while (player.countMark(event.name) >= 3) {
	            player.removeMark(event.name, 3, false);
	            lib.skill.mjsallmax.change(player, 2);
	        }
	    },
	},
	/**白衣渡江
	 * 当你的手牌上限大于体力值时，隐藏你的手牌数和体力值，并且回合开始时，你可以选择获得一名其他角色的所有手牌，并对其打出其中的所有杀，然后你失去此技能。
	 * */
	mjsbaiyidujiang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init(player, skill) {
			if (!_status._mjbaiyidujiang) {
				_status._mjbaiyidujiang = true;
				lib.element.player.updates ??= [];
                lib.element.player.updates.push(function (player) {
                    if (player.hasSkillTag("hide_hp", player)) {
						player.node.hp.style.setProperty("display", "none");
					}
					if (player.hasSkillTag("hide_hs", player)) {
						player.node.count.style.setProperty("display", "none");
					}
					if (!player.hasSkillTag("hide_hp", player)) {
						player.node.hp.style.setProperty("display", "block");
					}
					if (!player.hasSkillTag("hide_hs", player)) {
						player.node.count.style.setProperty("display", "block");
					}
                });
			}
			player.addSkill(skill + "_hide");
			if (player.hasSkillTag("hide_hp", player)) {
				player.node.hp.style.setProperty("display", "none");
			}
			if (player.hasSkillTag("hide_hs", player)) {
				player.node.count.style.setProperty("display", "none");
			}
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_hide");
			if (!player.hasSkillTag("hide_hp", player)) {
				player.node.hp.style.setProperty("display", "block");
			}
			if (!player.hasSkillTag("hide_hs", player)) {
				player.node.count.style.setProperty("display", "block");
			}
		},
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		forced: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "你可以选择获得一名其他角色的所有手牌，并对其打出其中的所有杀", (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					const hs = target.getCards("h", "sha");
					const eff = hs.reduce((sum, card) => {
						sum += get.effect(target, card, player, player);
						return sum;
					}, 0);
					return (hs.length - target.getHp()) * eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const hs = target.getGainableCards(player, "h");
			if (hs.length) {
				await player.gain(hs, target, "giveAuto", "bySelf");
				while (true) {
					const cards = player.getCards("h", card => {
						return hs.includes(card) && get.name(card, false) == "sha" && player.canUse(card, target, false, false);
					});
					if (!cards.length) {
						break;
					}
                    const card = cards.randomGet();
                    const next = player.useCard(card, target, false);
                    await next;
				}
			}
			await player.removeSkills(event.name);
		},
		subSkill: {
			hide: {
				ai: {
					hide_hs: true,
					hide_hp: true,
					skillTagFilter(player, tag, arg) {
						return player.getHandcardLimit() > player.getHp(true);
					},
				},
			},
		},
	},
	//徐盛
	/**濡须破军
	 * 当你的装备区获得或失去装备牌时，你可以将一名其他角色的1张牌移出游戏，直到你的下个回合结束。 
	 * 当你的装备区获得或失去装备牌时，你可以将一名其他角色的1张牌移出游戏，直到其下个回合开始。
	 * */
	mjsruxupojun: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        player: "loseAfter",
	        global: ["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
	    },
	    silent: true,
	    forced: false,
	    filter(event, player) {
	        const evt = event.getl(player);
	        if (event.name == "equip" && event.player == player) {
	            return true;
	        }
	        return evt && evt.es.length;
	    },
	    getIndex(event, player) {
	        const evt = event.getl(player);
	        if (event.name == "equip" && event.player == player && evt && evt.es.length) {
	            return 2;
	        }
	        return 1;
	    },
	    async cost(event, trigger, player) {
	    	event.result = await player
		    	.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
		    		return target != player && target.countCards("he");
		    	})
		    	.set("ai", target => {
		    		const player = get.player();
		    		return -get.attitude(player, target);
		    	})
		    	.forResult();
	    },
	    async content(event, trigger, player) {
	        const target = event.targets[0];
	        player.logSkill(event.name, target);
	        const result = await player.choosePlayerCard(target, "he", true).forResult();
	        if (result?.bool && result.cards?.length) {
	        	const next = target.addToExpansion(result.cards, "giveAuto", target);
	            next.gaintag.add("mjsruxupojun");
	            await next;
	            player.when("phaseBegin")
	            	.then(async () => {
	            		const skill = "mjsruxupojun_pojun";
	            		player.addSkill(skill);
	            		const cards = [];
	            		if (player.storage[skill].has(target)) {
	            			cards.addArray(player.storage[skill].get(target));
	            		}
	            		cards.addArray(result.cards);
	            		player.storage[skill].set(target, cards);
	            	});
	        }
	    },
	    /*intro: {
	        markcount: "expansion",
	        mark(dialog, storage, player) {
	            var cards = player.getExpansions("mjsruxupojun");
	            if (player.isUnderControl(true)) {
	                dialog.addAuto(cards);
	            } else {
	                return "共有" + get.cnNumber(cards.length) + "张牌";
	            }
	        },
	    },*/
	    subSkill: {
	    	pojun: {
	    		init(player, skill) {
	    			player.storage[skill] ??= new Map();
	    		},
	    		trigger: {
	    			player: "phaseEnd",
	    		},
	    		silent: true,
	    		charlotte: true,
	    		onremove: true,
	    		async content(event, trigger, player) {
	    			const map = player.getStorage(event.name);
	    			player.removeSkill(event.name);
	    			for (const [target, cards] of map) {
	    				const cards2 = target.getExpansions("mjsruxupojun").filter(card => cards.includes(card));
	                    if (cards2.length) {
	                        target.gain(cards2, "draw");
	                        game.log(target, "收回了" + get.cnNumber(cards2.length) + "张牌");
	                    }
	    			}
	    		},
	    	},
	    },
	},
	/**百里疑城
	 * 当你成为其他角色打出牌的目标时，你可以立即打出1张装备牌，或者将一名角色装备区的1张牌收回其手牌，然后每个回合限1次，随机添加1张装备牌到你的手牌。
	 * 当你成为其他角色打出牌的目标时，你可以将一名角色装备区的1张牌收回其手牌，然后每个回合限1次，随机添加1张装备牌到你的手牌，或者立即打出1张装备牌。 
	 * 当你成为其他角色打出牌的目标时，你可以将一名角色装备区的1张牌收回其手牌，然后随机添加1张装备牌到你的手牌，或者立即打出1张装备牌。 
	 * 当你成为其他角色打出牌的目标时，你可以将一名角色装备区的1张牌收回其手牌，然后若此牌是其装备区最后1张牌，随机添加1张装备牌至其手牌。
	 * */
	mjsbailiyicheng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
            target: "useCardToTarget",
        },
        silent: true,
        forced: false,
        filter(event, player) {
            if (event.player == player) {
                return false;
            }
            return player.hasCards("hs", card => get.type(card) == "equip" && player.canEquip(card, true)) || game.hasPlayer(target => target.hasCards("e"));
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCardTarget({
                    prompt: get.prompt2(event.skill),
                    filterCard(card, player) {
                        if (!lib.filter.cardEnabled(card, player, _status.event)) {
                            return false;
                        }
                        return get.type(card) == "equip" && player.canEquip(card, true);
                    },
                    selectCard: [0, 1],
                    filterTarget(card, player, target) {
                        if (ui.selected.cards.length) {
                            return false;
                        }
                        return target.hasCards("e");
                    },
                    selectTarget: [0, 1],
                    ai1(card) {
                        return get.cacheOrder;
                    },
                    ai2(target) {
                        const player = get.player();
                        const att = get.attitude(player, target);
                        if (att > 0) {
                            if (target.hasSkillTag("reverseEquip")) {
                                return att * 2;
                            }
                        }
                        return -att;
                    },
                    filterOk() {
                        return ui.selected.cards.length + ui.selected.targets.length == 1;
                    },
                })
                .forResult();
        },
        async content(event, trigger, player) {
            if (event?.targets?.length) {
                const target = event.targets[0];
                player.logSkill(event.name, target);
                const es = target.getCards("e");
                if (es.length == 1) {
                    event.result = { bool: true, cards: es };
                } else {
                    event.result = await player.choosePlayerCard(target, "e", true).forResult();
                }
                if (event.result?.cards?.length) {
                    await target.gain(event.result.cards, "gain2");
                }
                if (player.hasSkill(event.name + "_used")) {
	                return;
	            }
	            player.addTempSkill(event.name + "_used");
	            const equip = mjs.getEquip("random");
	            const card = mjs.createCard(equip);
	            if (card) {
	                await player.gain(card, "draw");
	            }
            } else {
                player.logSkill(event.name);
                await player.equip(event.cards[0]);
            }
        },
        subSkill: {
            used: {
                charlotte: true,
            },
        },
	},
	//韩娥
	/**千古留音
	 * 登场/当你的体力值变化后，令一名未获得余音的角色获得一种余音，或者令一名已经获得余音的角色切换一种余音。 
	 * *余音效果： 
	 * 宫：获得时/每个回合首次打出战法牌时，随机添加1张战法牌至手牌。
	 * 商：获得时/每个回合首次造成伤害后，随机弃置1张牌。（商：获得时/回合结束时，随机弃置1张牌。）
	 * 角：获得时/每个回合非摸牌阶段首次获得牌后，随机添加1张装备牌至手牌。
	 * 徵：获得时/出牌阶段开始时，可以立即打出1张杀，此杀不消耗出杀次数。
	 * 羽：获得时/每个回合首次弃置牌后，失去1点体力。
	 * */
	mjsqianguliuyin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		init(player, skill) {
			player.addSkill(skill + "_clear");
			lib.skill.mjsyuyin.init(player, "mjyuyin");
        },
        onremove(player, skill) {
        	player.removeSkill(skill + "_clear");
        },
		trigger: {
        	global: "phaseBefore",
	        player: ["enterGame", "changeSkillsAfter", "changeHpAfter"],
	    },
	    silent: true,
	    forced: false,
	    filter(event, player) {
	    	if (event.name == "changeHp") {
	    		return event.changeHp != 0 && player.getHp(true) > 0;
	    	}
	    	if (event.name == "changeSkills") {
				return event.addSkill.includes("mjsqianguliuyin");
			}
	        return (event.name != "phase" || game.phaseNumber == 0);
	    },
	    async cost(event, trigger, player) {
	    	const list = Array.from(lib.skill.mjsyuyin.getMode).map(info => info[1]);
	        event.result = await player
	            .chooseTarget(`${mjs.prompt(event.skill)}，请选择一名角色获得或切换一种余音`, true)
	            .set("ai", target => {
	                const { player, list } = get.event();
                    return Math.max.apply(
                        Math.max,
                        list.map(i => {
                            return get.attitude(player, target) * i.ai(player, target);
                        })
                    );
	            })
	            .set("list", list)
	            .forResult();
	    },
	    async content(event, trigger, player) {
	        const target = event.targets[0];
	        player.logSkill(event.name, target);
	        const backups = Array.from(lib.skill.mjsyuyin.getMode);
            const list = backups.map(info => [`mjsyuyin_${info[0]}`, info[1].name]);
	        const result = await player
	        	.chooseButton([
	        		[[get.translation(event.name)], "addNewRow"],
                    [list, "tdnodes"],
                    `<div><div style="width:100%;text-align:center">选择令<span class="mj-playertext">${get.translation(target)}</span>${!target.additionalSkills?.mjsyuyin?.length ? "获得" : "切换"}<span class="mj-skilltext">余音</span></div></div>`,
                    [
                        dialog => {
                        	dialog.css({
								top: get.is.phoneLayout() ? "25%" : "45%",
							});
							dialog.buttons.forEach(i => {
                                i.setNodeIntro(get.translation(i.link), get.skillInfoTranslation(i.link));
                            });
                        },
                        "handle",
                    ],
	        	], true)
	        	.set("filterButton", button => {
	        		const { player, target } = get.event();
	        		if (!target.additionalSkills?.mjsyuyin?.length) {
	        			return true;
	        		}
	        		if (!ui.selected.buttons.length) {
	        			return target.additionalSkills.mjsyuyin.includes(button.link);
	        		}
	        		return true;
	        	})
	        	.set("selectButton", button => {
	        		const { player, target } = get.event();
	        		if (!target.additionalSkills?.mjsyuyin?.length) {
	        			return 1;
	        		}
	        		return 2;
	        	})
	        	.set("ai", button => {
	        		const { player, target } = get.event();
	        		return get.attitude(player, target) * get.info("mjsyuyin").getMode.get(button.link.slice("mjsyuyin_".length)).ai(player, target);
	        	})
	        	.set("target", target)
	        	.forResult();
	        if (result?.bool && result.links?.length) {
	        	if (result.links.length > 1) {
	        		await target.removeAdditionalSkills("mjsyuyin", result.links[0]);
	        	}
	        	await target.addAdditionalSkills("mjsyuyin", result.links[result.links.length - 1], true);
	        }
	    },
	    subSkill: {
	        clear: {
	        	trigger: {
	        		player: "dieAfter",
	        	},
	        	silent: true,
	        	firstDo: true,
	        	forceDie: true,
	        	charlotte: true,
	        	filter(event, player) {
	        		return !event._mjyuyinraoliang;
	        	},
	        	async content(event, trigger, player) {
	        		const targets = game.filterPlayer(target => {
	        			return target.additionalSkills?.mjsyuyin?.length;
	        		});
	        		const func = async target => {
	        			await target.removeAdditionalSkills("mjsyuyin");
	        		};
	        		await game.doAsyncInOrder(targets, func);
	        	},
	        },
	    },
	},
	/**余音绕梁
	 * 阵亡，令一名其他角色获得你的余音，并且保留当前的所有余音效果，持续到游戏结束。
	 * */
	mjsyuyinraoliang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "die",
		},
		silent: true,
		forced: false,
		forceDie: true,
		filter(event, player) {
			if (!player.additionalSkills?.mjsyuyin?.length) {
				return false;
			}
			return game.hasPlayer(target => target != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(`选择1名其他角色发动${get.translation(event.skill)}，其获得你的余音`, lib.filter.notMe, true)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					const skills = player.additionalSkills.mjsyuyin;
					if (skills.containsSome("mjsyuyin_Re", "mjsyuyin_La")) {
						return -att;
					}
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			trigger._mjyuyinraoliang = true;
			const skills = player.additionalSkills.mjsyuyin;
			if (skills.length) {
				await target.addAdditionalSkills("mjsyuyin", skills, true);
			}
		},
	},
	mjsyuyin: {
		charlotte: true,
		name: "余音",
		init(player, skill) {
			if (_status.mjyuyin) {
				return;
			}
			_status.mjyuyin = true;
            game.broadcastAll(() => lib.skill.mjsyuyin.video());
		},
		video() {
            const mode = lib.skill.mjsyuyin.getMode;
            const list = Array.from(mode).map(info => info[0]);
            const backups = Array.from(mode).map(info => info[1]);
            for (const name of list) {
                const skill = `mjsyuyin_${name}`;
                game.broadcastAll(
                    (skill, from) => {
                        lib.skill[skill] = {
                        	charlotte: true,
                            mark: true,
                            marktext: from.name,
                            intro: {
                                content: from.description.slice(0, -1),
                            },
                            init(player, skill) {
			                	const next = game.createEvent(skill + "_init");
			                	next.player = player;
			                	next.setContent("emptyEvent");
			                },
                            ...from,
                        };
                        lib.translate[skill] = from.name;
                        lib.translate[`${skill}_info`] = from.description;
                        game.finishSkill(skill);
                    },
                    skill,
                    mode.get(name)
                );
            }
        },
		getMode: new Map([
            ["Do", {
            	name: "宫",
                description: "获得时/每个回合首次打出战法牌时，随机添加1张战法牌至手牌。",
                trigger: {
                    player: ["mjsyuyin_Do_init", "useCard"],
                },
                silent: true,
                popup: true,
                filter(event, player) {
                	if (event.name == "mjsyuyin_Do_init") {
                		return true;
                	}
                    return get.type2(event.card) == "trick" && player.getHistory("useCard", evt => get.type2(evt.card) == "trick").indexOf(event) == 0;
                },
                async content(event, trigger, player) {
                    const trick = mjs.getTrick("random");
                    const card = mjs.createCard(trick);
	                if (card) {
	                    await player.gain(card, "draw");
	                }
                },
                ai(player, target) {
                    return 1.2 + Math.random();
                },
            }],
            ["Re", {
            	name: "商",
                description: "获得时/每个回合首次造成伤害后，随机弃置1张牌。",
                trigger: {
                    player: "mjsyuyin_Re_init",
                    source: "damageSource",
                },
                silent: true,
                popup: true,
                filter(event, player) {
                	if (event.name == "mjsyuyin_Re_init") {
                		return true;
                	}
                    return player.getHistory("sourceDamage").indexOf(event) == 0;
                },
                async content(event, trigger, player) {
                    const cards = player.getCards("h", (card) => lib.filter.cardDiscardable(card, player, event.name));
		            if (cards.length) {
		            	await player.discard(cards.randomGets(1));
		            }
                },
                ai(player, target) {
                    const eff = get.effect(target, { name: "guohe_copy2" }, target);
                    return eff;
                },
            }],
            ["Mi", {
            	name: "角",
                description: "获得时/每个回合非摸牌阶段首次获得牌后，随机添加1张装备牌至手牌。",
                trigger: {
                    player: ["mjsyuyin_Mi_init", "gainAfter"],
                    global: "loseAsyncAfter",
                },
                silent: true,
                popup: true,
                filter(event, player) {
                	if (event.name == "mjsyuyin_Mi_init") {
                		return true;
                	}
                	const evt = event.getParent("phaseDraw");
				    if (evt?.player == player) {
				        return false;
				    }
                    return event.getg && event.getg?.(player)?.length && player.getHistory("gain", (evt) => evt.cards.length).indexOf(event) == 0;
                },
                async content(event, trigger, player) {
                    const equip = mjs.getEquip("random");
                    const card = mjs.createCard(equip);
	                if (card) {
	                    await player.gain(card, "draw");
	                }
                },
                ai(player, target) {
                    return 1.1 + Math.random();
                },
            }],
            ["Sol", {
            	name: "徵",
                description: "获得时/出牌阶段开始时，可以立即打出1张杀，此杀不消耗出杀次数。",
                trigger: {
                    player: ["mjsyuyin_Sol_init", "phaseUseBegin"],
                },
                silent: true,
                popup: true,
                filter(event, player) {
                    if (event.name == "mjsyuyin_Sol_init") {
                		return true;
                	}
                    return player.hasSha();
                },
                async content(event, trigger, player) {
                    const next = player
			            .chooseToUse(
			                function (card, player, event) {
			                    if (get.name(card) !== "sha") {
			                        return false;
			                    }
			                    return lib.filter.cardEnabled.apply(this, arguments);
			                },
			                `${mjs.prompt(event.name)}，你可以打出一张杀`
			            );
			        next.set("addCount", false);
			        await next;
                },
                ai(player, target) {
                	if (!target.hasSha()) {
                		return 0;
                	}
                	const hs = target.getCards("h");
                    return 1 + hs * 0.1;
                },
            }],
            ["La", {
            	name: "羽",
                description: "获得时/每个回合首次弃置牌后，失去1点体力。",
                trigger: {
                    player: ["mjsyuyin_La_init", "loseAfter"],
                    global: "loseAsyncAfter",
                },
                silent: true,
                popup: true,
                filter(event, player) {
                    if (event.name == "mjsyuyin_La_init") {
                		return true;
                	}
                    if (event.type != "discard") {
			            return false;
			        }
			        return event.getl?.(player)?.cards2?.length && player.getHistory("lose", (evtx) => {
			        	if (evtx.type != "discard") {
		                    return false;
		                }
		                return evtx?.cards2?.length;
			        }).indexOf(event) == 0;
                },
                async content(event, trigger, player) {
                    await player.loseHp();
                },
                ai(player, target) {
                    const eff = get.effect(target, { name: "losehp" }, target);
                    return eff * 1.2;
                },
            }],
        ]),
	},
	//郑国
	/**作注溉渠
	 * 每轮开始时，你可以将至多等同于存活角色张牌转化为“渠”并交给等量角色，然后你摸对应数量张牌。你的渠不计入手牌上限。
	 * （渠：此牌无法打出，无法主动弃置。） 
	 * */
	mjszuozhuguanju: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
	        ignoredHandcard(card, player) {
	            if (card.name == "mjsqu") {
	                return true;
	            }
	        },
	        cardDiscardable(card, player, name) {
	            if (name === "phaseDiscard" && card.name == "mjsqu") {
	                return false;
	            }
	        },
	    },
		trigger: {
			global: "roundStart",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			return player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard: true,
					selectCard: [1, Infinity],
					filterTarget: true,
					selectTarget: [1,Infinity],
					ai1(card) {
						return 8 - get.value(card);
					},
					ai2(target) {
						let player = get.player();
						let att = get.attitude(player, target);
						if (att == 0) {
							att = -10 * Math.random();
						}
						if (att > 0) {
							if (target == player) {
								return att;
							}
							return 0;
						}
						return -att;
					},
					filterOk() {
				        return ui.selected.cards.length == ui.selected.targets.length;
				    },
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards, 
				targets
			} = event;
			player.logSkill(event.name, targets);
			for (const card of cards) {
				game.broadcastAll(function (card) {
                    card.init(["spade", 7, "mjsqu"]);
                }, card);
			}
			const list = [];
	        for (var i = 0; i < targets.length; i++) {
	            var target = targets[i];
	            var card = cards[i];
	            list.push([target, card]);
	        }
	        await game.loseAsync({
	            gain_list: list,
	            player: player,
	            cards: cards,
	            giver: player,
	            animate: "giveAuto",
	        }).setContent("gaincardMultiple");
	        await player.draw(list.length);
		},
	},
	/**疲秦之计
	 * 每名角色每个回合限2次，当其他角色获得你的牌时，若其手牌中有"渠"，你可以令其顺时针或者逆时针随机将1张牌交给相邻的手牌中有“渠”的角色，然后该角色重复此动作直到你。
	 * 当其他角色获得你的牌时，若其手牌中有"渠"，你可以令其顺时针或者逆时针随机将1张牌交给相邻的手牌中有“渠”的角色，然后该角色重复此动作直到你。
	 * */
	mjspiqinzhiji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        global: ["gainAfter","loseAsyncAfter"],
	    },
	    silent: true,
	    popup: true,
	    forced: false,
	    getIndex(event2, player2) {
	      	return game.filterPlayer((target) => {
	            if (target == player2) {
	            	return false;
	            }
	            const gain = event2.getg?.(target) ?? [];
	            const lose = event2.getl?.(player2)?.cards2 ?? [];
	            return gain.length > 0 && (event2.giver === player2 || lose.some((i) => gain.includes(i)));
	        }).sortBySeat();
	    },
	    filter(event2, player2, name, target) {
	    	if (player2.getHistory("useSkill", evt => evt.skill == "mjspiqinzhiji" && evt.targets.includes(target)).length > 1) {
	    		return false;
	    	}
	    	const gain = event2.getg?.(target) ?? [];
	        const hs = target.getCards("h").removeArray(gain);
	        return target?.isIn() && hs.some(i => i.name == "mjsqu");
	    },
	    logTarget(event2, player2, name, target) {
	        return target;
	    },
	    async cost(event, trigger, player) {
	    	const target = event.indexedData;
	    	let previous = 0,
	    		next = 0;
	    	let current = target;
	    	while (current != player) {
	    		current = current.getPrevious();
	    		previous++;
	    	}
	    	current = target;
	    	while (current != player) {
	    		current = current.getNext();
	    		next++;
	    	}
	    	event.result = await player
	    		.chooseControl("顺时针", "逆时针", "cancel2")
	    		.set("prompt", `${mjs.prompt(event.skill)}，你可以令${get.translation(target)}按一个方向随机传牌`)
	    		.set("ai", () => get.event().choice)
            	.set("choice", previous >= next ? 0 : 1)
	    		.forResult();
	    	if (event.result.index != 2) {
	    		event.result.cost_data = event.result.index;
	    	}
	    },
	    async content(event, trigger, player) {
	        const target = event.targets[0];
	        const targets = [];
	        const choice = event.cost_data == 0 ? "getPrevious" : "getNext";
	        let giver = target,
	        	current = giver[choice]();
	        while (true) {
	            if (current.countCards("h", "mjsqu") || current == player) {
	            	const cards = giver.getCards("h");
	            	if (cards.length) {
	            		await giver.give(cards.randomGets(1), current);
	            	}
	            	giver = current;
	            }
	            current = current[choice]();
	            if (giver == player) {
	            	break;
	            }
	        }
	    },
	},
	/**关中沃野
	 * 出牌阶段限1次，你可以将1张牌交给有“渠”的角色，然后你可以销毁其1张“渠”并摸1张牌。
	 * */
	mjsguanzhongwoye: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") && game.hasPlayer(target => lib.skill.mjsguanzhongwoye.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target.countCards("h", "mjsqu");
		},
		filterCard: true,
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const target = event.target;
			if (target == player) {
				const cards = event.cards.filter(card => get.position(card) == "e");
                if (cards.length) {
                    await player.gain(cards, "giveAuto");
                }
			} else {
				await player.give(event.cards, target);
			}
			if (!target.countCards("h", "mjsqu")) {
				return;
			}
			const result = await player
				.chooseBool(`${mjs.prompt(event.name)}，你可以销毁${get.translation(target)}1张渠并摸1张牌`)
				.set("ai", () => {
					return get.event().goon;
				})
				.set(
					"goon",
					(() => {
						const att = get.attitude(player, target);
						return att > 0;
					})()
				)
				.forResult();
			if (result?.bool) {
				const cards = target.getCards("h", card => {
					if (card.name != "mjsqu") {
						return false;
					}
					return lib.filter.cardDestuctible(card, target, event.name);
				});
				if (cards.length) {
					game.log(cards, "被销毁了");
                	await target.lose(cards, "toDestroy", ui.special);
				}
				await player.draw();
			}
		},
		ai: {
			order() {
				return 7;
			},
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) {
	                    return 0;
	                }
					const att = get.attitude(player, target);
					const card = ui.selected.cards[0];
					if (get.value(card, target) < 0) {
						return att > 0 ? -att : att;
					}
					return get.value(card, target) / 1.5;
				},
			},
		},
	},
	//贾诩
	/**算无遗策
	 * 你打出的战法牌无法被识破抵消；你可以将任意战法牌当作识破打出。
	 * */
	mjssuanwuyice: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "chooseToUse",
		viewAs: {
			name: "wuxie",
		},
		prompt: "将一张战法牌当识破使用",
		filterCard(card) {
			return get.type2(card) == "trick";
		},
		check(card) {
			return 8 - get.value(card);
		},
		trigger: {
	        player: "useCard",
	    },
	    silent: true,
	    locked: false,
	    filter(event, player) {
	    	if (event.name == "chooseToUse") {
	    		return player.countCards("hs", { type: ["trick", "delay"] });
	    	}
	        return get.type(event.card) == "trick";
	    },
	    content() {
	        trigger.nowuxie = true;
	    },
	},
	/**文和乱武
	 * 限定，直到你的下个回合开始，所有其他角色无法从牌堆获得牌，并且出杀次数+1。
	 * */
	mjswenheluanwu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addTempSkill(event.name + "_effect", { player: "phaseBeforeStart" });
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return 1;
				},
			},
		},
		subSkill: {
			effect: {
				init(player, skill) {
					game.addGlobalSkill("mjswenheluanwu_sha");
				},
				onremove: player => {
			        if (!game.hasPlayer(current => current.hasSkill("mjswenheluanwu_effect", null, null, false), true)) {
			            game.removeGlobalSkill("mjswenheluanwu_sha");
			        }
			    },
				trigger: {
			        global: "gainBefore",
			    },
			    silent: true,
			    locked: false,
			    charlotte: true,
			    getIndex(event, player) {
			        if (!event.getg) {
			            return [];
			        }
			        return game
			            .filterPlayer(current => {
			                if (current == player || !event.getg(current)?.length) {
			                    return false;
			                }
			                if (event.name == "gain") {
			                    if (event.cards?.length) {
				                    if (event.getParent().name == "draw") {
				                        return true;
				                    }
				                    for (var i = 0; i < event.cards.length; i++) {
				                        if (get.position(event.cards[i]) == "c" || (get.position(event.cards[i]) && event.cards[i].original == "c")) {
				                            return true;
				                        }
				                    }
				                }
				                return false;
			                }
			                return event.getg(current)?.some(card => {
			                    return card.original == "c";
			                });
			            })
			            .sortBySeat();
			    },
			    filter(event, player, triggername, target) {
			    	return target != player;
			    },
			    logTarget(event, player, name, target) {
			        return target;
			    },
			    async content(event, trigger, player) {
			        if (trigger.name == "gain") {
			        	trigger.cards = trigger.cards.filter(card => {
			                if (trigger.getParent().name == "draw") {
		                        return false;
		                    }
			                if (get.position(card) == "c" || (get.position(card) && card.original == "c")) {
	                            return false;
	                        }
	                        return true;
			            });
			            if (!trigger.cards.length) {
			            	trigger.cancel();
			            }
			        }
			    },
			    mark: true,
			    intro: {
			    	content: "所有其他角色无法从牌堆获得牌，并且出杀次数+1",
			    },
			},
			sha: {
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + game.countPlayer(target => target.hasSkill("mjswenheluanwu_effect"));
						}
					},
				},
				trigger: {
	                player: "dieAfter",
	            },
	            filter: (event, player) => {
	                return !game.hasPlayer(current => current.hasSkill("mjswenheluanwu_effect", null, null, false), true);
	            },
	            silent: true,
	            forceDie: true,
	            charlotte: true,
	            content: () => {
	                game.removeGlobalSkill("mjswenheluanwu_sha");
	            },
	            ai: {
	            	nogainFromCardPile: true,
	            	skillTagFilter(player, tag, arg) {
						if (!game.hasPlayer(target => {
							return target.hasSkill("mjswenheluanwu_effect") && target != player;
						})) {
							return false;
						}
						return true;
					},
	            },
			},
		},
	},
	/**毒士
	 * 所有角色每累计受到3点杀的伤害时，你获得1张战法牌。
	 * */
	mjsdushi: {
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "mjsdushiEvent",
		},
		silent: true,
		popup: true,
		locked: false,
		async content(event, trigger, player) {
			const card = get.cardPile(card => get.type2(card) == "trick");
			if (card) {
				await player.gain(card, "draw");
			}
		},
	    intro: {
	        markcount(storage, player) {
	            return player.countMark("mjsdushi_counter");
	        },
	        content(storage, player) {
	            return `累计累计受到${player.countMark("mjsdushi_counter")}点伤害`;
	        },
	    },
		group: "mjsdushi_counter",
		subSkill: {
			counter: {
				trigger: {
					global: "damageEnd",
				},
				popup: false,
				forced: true,
	            locked: false,
	            firstDo: true,
	            filter(event, player) {
	            	return event.card?.name == "sha";
	            },
				async content(event, trigger, player) {
	                const num = trigger.num;
	                player.addMark(event.name, num, false);
	                player.markSkill("mjsdushi");
	                while (player.countMark(event.name) >= 3) {
	                    player.removeMark(event.name, 3, false);
	                    const next = game.createEvent("mjsdushiEvent");
	                    next.player = player;
	                    next.setContent("emptyEvent");
	                    await next;
	                }
	            },
			},
		},
	},
	//陈宫
	/**弃官投义
	 * 当你在非摸牌阶段获得牌时，每回合每种牌限1次，可以将其中1张牌交给一名其他角色，令其可以对你选择的另外一名其他角色打出此牌，然后你下个摸牌阶段摸牌数+1，若其没有打出，你受到1点伤害。
	 * 当你在非摸牌阶段获得牌时，可以将其中1张牌交给一名其他角色，令其可以对你选择的另外一名其他角色打出此牌，然后你下个摸牌阶段摸牌数+1，若其没有打出，你受到1点伤害。
	 * */
	mjsqiguantouyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        player: "gainAfter",
	        global: ["gameDrawAfter","loseAsyncAfter"],
	    },
	    silent: true,
	    forced: false,
	    filter(event, player) {
	        if (!player.countCards("h")) return false;
	        if (event.name == "gameDraw") return true;
	        const evt = event.getParent("phaseDraw");
	        if (evt?.player == player) {
	            return false;
	        }
	        return event.getg?.(player)?.length > 0;
	    },
	    async cost(event, trigger, player) {
	    	if (game.countPlayer(target => target != player) < 2) {
	    		return;
	    	}
	        event.result = await player
	            .chooseCardTarget({
	                prompt: get.prompt2(event.skill),
	                filterCard(card) {
	                    const player = get.player();
	                    if (player.hasStorage("mjsqiguantouyi_used", card.name)) {
	                    	return false;
	                    }
	                    const trigger = _status.event.getTrigger();
	                    return (trigger?.getg?.(player) ?? player.getCards("h")).includes(card);
	                },
	                filterTarget(card, player, target) {
	                	if (target == player) {
	                		return false;
	                	}
	                	return true;
	                	if (!ui.selected.targets.length) {
	                		return game.hasPlayer(target2 => {
	                			return target2 != player && target2 != target && target.canUse(card, target2, false, false);
	                		});
	                	}
	                	return ui.selected.targets[0].canUse(card, target, false, false);
	                },
	                selectTarget: 2,
	                targetprompt: ["来源", "目标"],
	                ai1(card) {
	                    const player = get.player();
	                    if (card.name != "du" && get.attitude(player, _status.currentPhase) < 0 && _status.currentPhase?.needsToDiscard()) {
	                        return -1;
	                    }
	                    if (card.name == "du") {
	                        return 20;
	                    }
	                    return 6.5 - get.value(card);
	                },
	                ai2(target) {
	                    const player = get.player();
	                    const att = get.attitude(player, target);
	                    const card = ui.selected.cards[0];
	                    if (!ui.selected.targets.length) {
	                		return att - 4;
	                	}
	                    return get.effect(target, card, ui.selected.targets[0], player);
	                },
	            })
	            .forResult();
	    },
	    async content(event, trigger, player) {
	        const {
	            targets: [target, target2],
	            cards,
	        } = event;
	        const card = cards[0];
	        player.logSkill(event.name, event.targets);
	        player.addTempSkill("mjsqiguantouyi_used");
	        player.markAuto("mjsqiguantouyi_used", card.name);
	        await player.give(card, target);
	        player.addSkill(event.name + "_effect");
	        player.addMark(event.name + "_effect", 1, false);
	        game.broadcastAll(card => {
                lib.skill.mjshongmenyan_backup.viewAs = card;
                lib.skill.mjshongmenyan_backup.viewAs.cards = [card];
            }, card);
            target.addTempSkill("mjshongmenyan_target");
            const next = target.chooseToUse();
            next.set("openskilldialog", `弃官投义：你可以对${get.translation(target2)}打出${get.translation(card)}，否则${get.translation(player)}受到1点伤害`);
            next.set("target", target2);
            next.set("norestore", true);
            next.set("_backupevent", "mjshongmenyan_backup");
            next.set("custom", {
                add: {},
                replace: { window() { } },
            });
            next.backup("mjshongmenyan_backup");
            next.set("addCount", false);
            target
                .when("chooseToUseBegin")
                .filter(evt => evt === next)
                .then(() => (trigger.filterCard = () => false));
            const result2 = await next.forResult();
            if (!result2?.bool) {
                await player.damage("nosource");
            }
	    },
	    subSkill: {
	    	effect: {
	    		trigger: {
	    			player: "phaseDrawBegin2",
	    		},
	    		silent: true,
	    		charlotte: true,
	    		onremove: true,
	    		filter(event, player) {
	    			return !event.numFixed;
	    		},
	    		async content(event, trigger, player) {
	    			trigger.num += player.countMark(event.name);
	    			player.removeSkill(event.name);
	    		},
	    	},
	    	used: {
	    		charlotte: true,
	    		onremove: true,
	    	},
	    },
	},
	/**策直明义
	 * 受伤，你可以令一名其他角色受到的下1次伤害+1，当你选择的目标下1次受伤后，你获得1张战法牌。
	 * */
	mjscezhimingyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageEnd",
		},
		silent: true,
		forced: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			target.addSkill(event.name + "_debuff");
			target.addMark(event.name + "_debuff", 1, false);
			player
				.when({ global: "damageEnd" })
				.filter(evt => evt.player == target)
				.then(async () => {
					const card = get.cardPile(card => get.type2(card) == "trick");
					if (card) {
						await player.gain(card, "draw");
					}
				});
		},
		subSkill: {
			debuff: {
				trigger: {
					player: "damageBegin3",
				},
				silent: true,
				charlotte: true,
				onremove: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				mark: true,
				marktext: "直",
				intro: {
					content: "受到的下1次伤害+#",
				},
			},
		},
	},
	//赵奢
	/**狭路相逢
	 * 出牌阶段限1次，你可以选择一名其他角色，翻开牌堆顶的5张牌，你获得其中除杀之外的牌，令其对你依次打出剩余杀，然后：其对你再次执行此效果。
	 * */
	mjsxialuxiangfeng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			for (const source of [player, target]) {
				const current = source == player ? target : player;
				const cards = get.cards(5, true);
        		await game.cardsGotoOrdering(cards);
        		game.log(player, "翻开牌堆顶的", cards);
		        event.videoId = lib.status.videoId++;
		        const createDialog = function (player, cards, id) {
		            const dialog = ui.create.dialog("forcebutton", true);
		            dialog.classList.add("mj-flip");
		            dialog.classList.add("fullwidth");
		            dialog.videoId = id;
		            const buttons = ui.create.div(".buttons", dialog.content);
		            for (const card of cards) {
		                buttons.appendChild(card);
		                dialog.open();
		                ui.create.cardSpinning(card);
		            }
		        };
		        const closeDialog = function (id) {
		            const dialog = get.idDialog(id);
		            if (dialog) {
		                dialog.close();
		            }
		        };
		        game.broadcastAll(createDialog, source, cards, event.videoId);
		        await game.delay(2);
        		const gains = cards.filter(card => get.name(card, false) != "sha");
        		if (gains.length) {
        			cards.removeArray(gains);
        			await source.gain(gains, "gain2");
        		}
        		for (const card of cards) {
        			if (current.canUse(card, source, false, false)) {
        				await current.useCard(card, source, false);
        			}
        		}
        		game.broadcastAll(closeDialog, event.videoId);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					return att;
				},
			},
		},
	},
	/**奉公如法
	 * 出牌阶段限1次，你可以令一名其他角色进行1个弃牌阶段，你获得其在此阶段内弃置的牌。
	 * */
	mjsfenggongrufa: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			target
				.when("phaseDiscardAfter")
				.filter(evt => evt.getParent() == event)
				.then(async (event2, trigger2, player2) => {
					const cards = player2
						.getHistory("lose", function (evt) {
		                    return evt.type == "discard" && evt.getParent("phaseDiscard") == trigger2 && evt.cards.filterInD("d").length > 0;
		                })
		                .reduce((list, evt) => {
		                	list.addArray(evt.cards.filterInD("d"));
		                	return list;
		                }, []);
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
				});
			const next = target.phaseDiscard();
		},
		ai: {
			order() {
				return get.order({ name: "mjsxialuxiangfeng" }) - 0.1;
			},
			result: {
				target(player, target) {
					const att = get.sgnAttitude(player, target);
					if (target.getEquips("mjschuanguoyuxi").length) {
						return att > 0 ? att - 5 : 0;
					}
					if (target.hasSkill("mjsmodaiqinwang")) {
						return 0;
					}
					return att * target.needsToDiscard();
				},
			},
		},
	},
	//李牧
	/**雁门纵牧
	 * 当你成为其他角色打出杀的目标时，其不消耗出杀次数并且你下个出牌阶段的出杀次数+1。当你每累计受伤或应战3次时，你可以手牌上限+1，然后摸牌至手牌上限，并可以立即打出1张牌。
	 * */
	mjsyanmenzongmu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			target: "useCardToTarget",
			player: "damageEnd",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event._mjsyanmenzongmu;
		},
		prompt2: "你可以手牌上限+1，然后摸牌至手牌上限，并可以立即打出1张牌。",
		async content(event, trigger, player) {
			lib.skill.mjsallmax.change(player, 1);
			await player.drawTo(player.getHandcardLimit());
			const next = player
	            .chooseToUse(
	                function (card, player, event) {
	                    return lib.filter.cardEnabled.apply(this, arguments);
	                },
	                `${mjs.prompt(event.name)}，你可以打出1张牌`
	            );
	        next.set("oncard", () => {
	            const evt = _status.event;
	            player.logSkill("mjsyanmenzongmu", evt.targets);
	        });
	        next.set("addCount", false);
	        await next;
		},
	    intro: {
	        markcount(storage, player) {
	            return player.countMark("mjsyanmenzongmu_counter");
	        },
	        content(storage, player) {
	            return `已累计受伤或应战${get.cnNumber(player.countMark("mjsyanmenzongmu_counter"))}次`;
	        },
	    },
		group: ["mjsyanmenzongmu_use", "mjsyanmenzongmu_counter"],
		subSkill: {
			use: {
				audio: "mjsyanmenzongmu",
				trigger: {
					target: "useCardToTarget",
				},
				silent: true,
				popup: true,
				filter(event, player) {
					return event.card.name == "sha" && event.player != player;
				},
				logTarget: "player",
				async content(event, trigger, player) {
					if (trigger.getParent().addCount !== false) {
		                trigger.getParent().addCount = false;
		                trigger.player.getStat().card.sha--;
		            }
		            player.when("phaseUseBegin").then(() => {
		                player.addTempSkill("mjsyanmenzongmu_sha");
		                player.addMark("mjsyanmenzongmu_sha", 1, false);
		            });
				},
			},
			sha: {
				charlotte: true,
	            onremove: true,
	            mod: {
	                cardUsable(card, player, num) {
	                    if (card.name == "sha") {
	                        return num + player.countMark("mjsyanmenzongmu_sha");
	                    }
	                },
	            },
			},
			counter: {
				trigger: {
					player: ["damageEnd", "useCardToTarget"],
				},
				silent: true,
				firstDo: true,
				filter(event, player) {
					return event.name == "damage" || event.card.name == "sha";
				},
				async content(event, trigger, player) {
					player.addMark(event.name, 1, false);
	                if (player.countMark(event.name) % 3 === 0) {
	                	player.clearMark(event.name, false);
	                    trigger._mjsyanmenzongmu = true;
	                }
	                player.markSkill("mjsyanmenzongmu");
				},
			},
		},
	},
	/**击牛飨士
	 * 应战/出牌阶段限1次，你可以弃置1张牌，增强手牌中的杀。
	 * */
	mjsjiniuxiangshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			target: "useCardToTarget",
		},
		enable: "phaseUse",
		filter(event, player) {
			if (!player.countCards("he")) {
				return false;
			}
			if (event.name == "chooseToUse") {
				return !player.hasSkill("mjsjiniuxiangshi_used");
			}
			return event.card.name == "sha";
		},
		filterCard: true,
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		lose: false,
		discard: false,
		delay: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), "he", "chooseonly")
				.set("ai", card => {
					const player = get.player();
					if (get.event().hasSha) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set(
					"hasSha",
					(() => {
						return player.countCards("h", card => {
				            return card.name == "sha" && lib.filter.canBeStrengthened(card, player, "mjsjiniuxiangshi");
				        }) > 2;
					})()
				)
				.forResult();
		},
		async content(event, trigger, player) {
			if (!trigger?.name) {
				player.addTempSkill("mjsjiniuxiangshi_used", ["phaseBefore", "phaseChange", "phaseAfter"]);
			}
			await player.discard(event.cards);
			const cards = player.getCards("h", card => {
	            return card.name == "sha" && lib.filter.canBeStrengthened(card, player, event.name);
	        });
			if (cards.length) {
				await player.mjsStrengthenCards(cards);
			}
		},
		ai: {
			yingzhan: true,
			order() {
				return get.order({ name: "sha" }) + 0.5;
			},
			result: {
				player(player) {
			        return player.countCards("h", card => {
			            return card.name == "sha" && lib.filter.canBeStrengthened(card, target, "mjsjiniuxiangshi");
			        });
				},
			},
		},
	},
	//魏咎
	/**流亡储君
	 * 登场，你可以选择一名其他角色，当其弃置牌时，你获得其中1张牌，并转化为“义兵”。当你打出“义兵”时，你令一名其他角色进入连环状态。
	 * 登场，你可以选择一名其他角色，当其弃置牌时，你获得其中1张牌，并转化为“义兵”。当你打出♦花色的“义兵”时，你令一名其他角色进入连环状态。
	 * （义兵：每个回合限1次，你可以将此牌当作“杀”或“闪”打出。此牌不计入手牌上限。）
	 * */
	mjsliuwangchujun: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        global: "phaseBefore",
	        player: ["enterGame","changeSkillsAfter"],
	    },
	    silent: true,
	    forced: false,
	    onremove(player, skill) {
	        player.removeSkill(skill + "_effect");
	    },
	    filter(event, player) {
	    	if (!game.hasPlayer(current => current != player)) {
	    		return false;
	    	}
	    	if (event.name == "changeSkills") {
				return event.addSkill.includes("mjsliuwangchujun");
			}
	        return (event.name != "phase" || game.phaseNumber == 0);
	    },
	    async cost(event, trigger, player) {
	        event.result = await player
	            .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
	            .set("ai", target => {
	                const player = get.player();
	                return target.getSkills(null, false, false).length + 1;
	            })
	            .forResult();
	    },
	    async content(event, trigger, player) {
	        const target = event.targets[0];
	        const skill = event.name + "_effect";
	        delete player.storage[skill];
	        player.addSkill(skill);
	        player.markAuto(skill, [target]);
	        player.addTip(skill, get.translation(skill) + " " + player.getStorage(skill).reduce((str, target) => str + get.translation(target), ""), false, { whiteSpace: "nowrap" });
	    },
	    group: "mjsliuwangchujun_use",
	    subSkill: {
	        use: {
	        	trigger: {
	        		player: ['useCardAfter', "respondAfter"],
	        	},
	        	silent: true,
	            popup: true,
	            filter(event, player) {
	            	return event.card.name == "mjsyibing";
	            	return event.card.name == "mjsyibing" && get.suit(event.card) == "diamond";
	            },
	        	async cost(event, trigger, player) {
	        		event.result = await player
	        			.chooseTarget(`${mjs.prompt(event.skill)}，选择令1名其他角色进入连环状态`, lib.filter.notMe)
	        			.set("ai", target => {
	        				return get.effect(target, { name: "tiesuo" }, get.player(), get.player());
	        			})
	        			.forResult();
	        	},
	        	async content(event, trigger, player) {
	        		const target = event.targets[0];
	        		player.logSkill(event.name, target);
	        		await target.link(true);
	        	},
	        },
	        effect: {
	            audio: "mjsliuwangchujun",
	            trigger: {
	                global: ["loseAfter","loseAsyncAfter"],
	            },
	            silent: true,
	            popup: true,
	            forced: false,
	            getIndex(event, player) {
	                if (event.type != "discard" || event.getlx === false) {
	                    return [];
	                }
	                return game
	                    .filterPlayer(target => {
	                        if (target == player) return false;
	                        return event.getl?.(target)?.cards2?.length;
	                    })
	                    .sortBySeat(player);
	            },
	            filter(event, player, triggername, target) {
	                if (!player.hasStorage("mjsjunshengbieli_effect", target)) {
	                	return false;
	                }
	                return target;
	            },
	            onremove(player, skill) {
	                delete player.storage[skill];
	                player.removeTip(skill);
	            },
	            async cost(event, trigger, player) {
	                const target = event.indexedData;
	                const cards = trigger.getl(target).cards2;
	                if (!cards.length) return;
	                event.result = await player
	                    .chooseCardButton(get.translation(event.skill), cards)
	                    .set("ai", button => {
	                        return get.value(button.link);
	                    })
	                    .forResult();
	                if (event.result?.bool && event.result.links?.length) {
	                    event.result.cards = event.result.links;
	                }
	            },
	            async content(event, trigger, player) {
	                const target = event.targets[0];
	                await player.gain(event.cards, "gain2");
	                for (const card of event.cards) {
	                    game.broadcastAll(function (card) {
	                        card.init([card.suit, card.number, "mjsyibing"]);
	                    }, card);
	                }
	            },
	            mark: true,
	            intro: {
	                markcount: () => 0,
	                content: "$弃置牌后，你获得其中1张牌，并转化为【义兵】。",
	            },
	        },
	    },
	},
	/**受立魏王
	 * 限定，回合开始时，你每有1张“义兵”，你可以增加1点体力上限，然后回复1点体力，并获得技能“焚身救民”。
	 * */
	mjsshouliweiwang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		derivation: "mjsfenshenjiumin",
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		forced: false,
		popup: true,
		filter(event, player) {
			return player.countCards("h", "mjsyibing");
		},
		check(event, player) {
			return player.countCards("h", "mjsyibing") >= 4 || player.getHp() == 1;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = player.countCards("h", "mjsyibing");
			await player.gainMaxHp(num);
			await player.recover(num);
			await player.addSkills(lib.skill[event.name].derivation);
		},
	},
	/**焚身救民
	 * 回合结束时，你进入连环状态，摸2张牌，然后受到1点火焰伤害，并失去1点体力上限。
	 * */
	mjsfenshenjiumin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseEnd",
		},
		silent: true,
		popup: true,
		async content(event, trigger, player) {
			player.link(true);
			await player.draw(2);
			await player.damage("fire", "nosource");
			await player.loseMaxHp();
		},
		ai: {
			neg: true,
		},
	},
	//庞煖
	/**耆年韧甲
	 * 回合开始/结束时，失去1点体力，手牌上限+1。当你的体力值首次变为1时，摸牌至手牌上限。
	 * */
	mjsqinianrenjia: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		//global: "mjsqinianrenjia_history",
		trigger: {
			player: ["phaseBegin", "phaseEnd", "changeHpEnd"],
		},
		silent: true,
		popup: true,
		filter(event, player) {
			if (event.name != "changeHp") {
				return true;
			}
			if (player.storage.mjsqinianrenjia_checkHistory) return false;
			const evts = game.getAllGlobalHistory("changeHp", (evt) => {
	            return evt.player == player && evt.changedHp != 0 && (evt.originalHp + evt.changedHp == 1);
	        });
	        if (evts.indexOf(event) !== 0) {
	           return false;
	        }
	        return true;

			return game.getAllGlobalHistory("changeHp", evt => {
				return evt.player == player && evt.num != 0 && evt._changeNum == 1;
			}).indexOf(event) == 0;
		},
		async content(event, trigger, player) {
			if (trigger.name != "changeHp") {
				await player.loseHp();
				lib.skill.mjsallmax.change(player, 1);
			} else {
				player.setStorage("mjsqinianrenjia_checkHistory", true);
				await player.drawTo(player.getHandcardLimit());
			}
		},
		subSkill: {
			history: {
				trigger: {
	                player: "changeHpEnd",
	            },
	            silent: true,
	            firstDo: true,
	            charlotte: true,
	            filter(event, player) {
	                return player.getHp(true) == 1;
	            },
	            async content(event, trigger, player) {
	                trigger.set("_changeNum", 1);
	            },
			},
		},
	},
	/**五国纵师
	 * 摸牌阶段开始时，若你的手牌上限≥5，则你摸牌阶段摸牌数+3，出杀次数+4。
	 * */
	mjswuguozongshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseDrawBegin2",
		},
		silent: true,
		popup: true,
		filter(event, player) {
			return !event.numFixed && player.getHandcardLimit() >= 5;
		},
		async content(event, trigger, player) {
			trigger.num += 3;
			player.addTempSkill("mjswuguozongshi_effect");
			player.addMark("mjswuguozongshi_effect", 4, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("mjswuguozongshi_effect");
						}
					},
				},
			},
		},
	},
	//卓文君
	/**夜奔相如
	 * 出牌阶段开始时，你可以翻开牌堆底的5张牌，将其中的♠牌交给一名其他角色，然后可以将剩余牌按原顺序放回牌堆顶。
	 * 出牌阶段开始时，你可以翻开牌堆底的5张牌，将其中的♠牌交给一名角色，然后可以将剩余牌按原顺序放回牌堆顶。
	 * 出牌阶段开始时，你翻开牌堆底的5张牌，将其中的♠牌交给一名其他角色，然后可以将剩余牌按原顺序放回牌堆顶。
	 * */
	mjsyebenxiangru: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsyebenxiangru" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			player: "phaseUseBegin",
		},
		silent: true,
		forced: false,
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			const cards = get.bottomCards(5);
			await game.cardsGotoOrdering(cards);
			game.log(player, "翻开牌堆底的", cards);
			event.videoId = lib.status.videoId++;
	        const createDialog = function (player, cards, id) {
	            const dialog = ui.create.dialog("forcebutton", true);
	            dialog.classList.add("mj-flip");
	            dialog.classList.add("fullwidth");
	            dialog.videoId = id;
	            const buttons = ui.create.div(".buttons", dialog.content);
	            for (const card of cards) {
		            buttons.appendChild(card);
		            dialog.open();
		            ui.create.cardSpinning(card);
	            }
	        };
	        const closeDialog = function (id) {
	            const dialog = get.idDialog(id);
	            if (dialog) {
	                dialog.close();
	            }
	        };
	        game.broadcastAll(createDialog, player, cards, event.videoId);
			const gains = cards.filter(card => get.suit(card) == "spade");
			if (gains.length) {
				cards.removeArray(gains);
				const result2 = await player
					.chooseTarget(`${mjs.prompt(event.name)}，将其中的♠牌交给一名其他角色`, lib.filter.notMe, true)
					.set("ai", target => {
						const player = get.player();
						const att = get.attitude(player, target);
						return att;
					})
					.forResult();
				if (result2.bool && result2.targets?.length) {
					const target = result2.targets[0];
					player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
					const gainEvent = target.gain(gains, "gain2");
        			gainEvent.giver = player;
        			await gainEvent;
				}
			}
			if (cards.length) {
				const result = await player
					.chooseBool(`${mjs.prompt(event.name)}，是否将剩余牌按原顺序放回牌堆顶`)
					.forResult();
				game.broadcastAll(closeDialog, event.videoId);
				if (result.bool) {
					cards.reverse();
					game.addCardKnower(cards, player);
		            await game.cardsGotoPile(cards, "insert");
		        }
			}
		},
	},
	/**当垆卖酒
	 * 每个回合限1次，当你获得♥牌时，添加1张酒到你手牌，你可以将此牌交给一名其他角色，然后选择获得其1张牌。
	 * 每个回合限1次，当你获得♥牌时，添加1张酒到你手牌，你可以将此牌交给一名其他角色，然后随机获得其1张牌。
	 * */
	mjsdanglumaijiu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
	        player: "gainAfter",
	        global: ["gameDrawAfter","loseAsyncAfter"],
	    },
	    usable: 1,
	    silent: true,
	    popup: true,
	    filter(event, player) {
	        if (event.name == "gameDraw") {
	            return player.countCards("h", { suit: "heart" });
	        }
	        return event.getg && event.getg(player)?.some(card => get.suit(card) == "heart");
	    },
	    async content(event, trigger, player) {
	    	const card = game.createCard2("jiu", "spade", 4);
	    	await player.gain(card, "gain2");
    		const result = await player
    			.chooseTarget(`${mjs.prompt(event.name)}，你可以将${get.translation(card)}交给一名其他角色，然后选择获得其1张牌。`)
    			.set("ai", target => {
    				const player = get.player();
    				const eff = get.effect(target, { name: "shunshou_copy", position: "he" }, player, player);
    				return eff;
    			})
    			.forResult();
    		if (result?.bool && result.targets?.length) {
    			const target = result.targets[0];
    			player.logSkill(event.name, target);
    			const gainEvent = target.gain(card);
    			gainEvent.giver = player;
    			await gainEvent;
    			if (target.countGainableCards(player, "he")) {
    				await player.gainPlayerCard(target, "he", true);
    			}
    		}
	    },
	},
	/**白头吟
	 * 受伤，你可以令任意名其他角色随机弃置1张牌。
	 * 每个回合限1次，受伤，你可以令所有其他角色弃置1张牌。
	 * */
	mjsbaitouyin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageEnd",
		},
		silent: true,
		popup: false,
		forced: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, Infinity], (card, player, target) => {
					return target != get.event().getTrigger().player;
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, target, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, event.targets);
			const func = async target => {
				const cards = target.getCards("h", (card) => lib.filter.cardDiscardable(card, player, event.name));
		        if (cards.length) {
		          	await target.discard(cards.randomGet());
		        }
			};
			await game.doAsyncInOrder(event.targets, func);
		},
	},
	//司马相如
	/**凤求凰
	 * 出牌阶段开始时，你可以翻开牌堆顶的5张牌，将其中的♥牌交给一名其他角色，然后可以将剩余牌按原顺序放回牌堆底。
	 * 出牌阶段开始时，你可以翻开牌堆顶的5张牌，将其中的♥牌交给一名角色，然后可以将剩余牌按原顺序放回牌堆底。
	 * 出牌阶段开始时，你翻开牌堆顶的5张牌，将其中的♥牌交给一名角色，然后可以将剩余牌按原顺序放回牌堆底。
	 * */
	mjsfengqiuhuang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsfengqiuhuang" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			player: "phaseUseBegin",
		},
		silent: true,
		forced: false,
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			const cards = get.cards(5);
			await game.cardsGotoOrdering(cards);
			game.log(player, "翻开牌堆顶的", cards);
	        event.videoId = lib.status.videoId++;
	        const createDialog = function (player, cards, id) {
	            const dialog = ui.create.dialog("forcebutton", true);
	            dialog.classList.add("mj-flip");
	            dialog.classList.add("fullwidth");
	            dialog.videoId = id;
	            const buttons = ui.create.div(".buttons", dialog.content);
	            for (const card of cards) {
	                buttons.appendChild(card);
	                dialog.open();
	                ui.create.cardSpinning(card);
	            }
	        };
	        const closeDialog = function (id) {
	            const dialog = get.idDialog(id);
	            if (dialog) {
	                dialog.close();
	            }
	        };
	        game.broadcastAll(createDialog, player, cards, event.videoId);
			const gains = cards.filter(card => get.suit(card) == "heart");
			if (gains.length) {
				cards.removeArray(gains);
				const result2 = await player
					.chooseTarget(`${mjs.prompt(event.name)}，将其中的♥牌交给一名角色`, lib.filter.notMe, true)
					.set("ai", target => {
						const player = get.player();
						const att = get.attitude(player, target);
						return att;
					})
					.forResult();
				if (result2.bool && result2.targets?.length) {
					const target = result2.targets[0];
					player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
					const gainEvent = target.gain(gains, "draw");
        			gainEvent.giver = player;
        			await gainEvent;
				}
			}
			if (cards.length) {
				const result = await player
					.chooseBool(`${get.translation(event.name)}，是否将剩余牌按原顺序放回牌堆底`)
					.forResult();
				game.broadcastAll(closeDialog, event.videoId);
				if (result.bool) {
					game.addCardKnower(cards, player);
		            await game.cardsGotoPile(cards);
		        }
			}
		},
	},
	/**自着犊鼻
	 * 你可以弃置1张♠牌，令你打出的下1张行动牌或战法牌生效2次。
	 * 出牌阶段限1次，你可以弃置1张♠牌，令你打出的下1张行动牌或战法牌生效2次。
	 * */
	mjszizhedubi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { suit: "spade" });
		},
		filterCard: {
			suit: "spade",
		},
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		async content(event, trigger, player) {
			player.addSkill(event.name + "_effect");
			player.addMark(event.name + "_effect", 1, false);
		},
		ai: {
			order() {
				return 7;
			},
			result: {
				player(player) {
					return 1;
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard",
				},
				silent: true,
				popup: true,
				forced: true,
				locked: false,
				filter(event, player) {
					if (!["basic", "trick"].includes(get.type(event.card))) {
						return false;
					}
					return event.targets?.length;
				},
				async content(event, trigger, player) {
					trigger.effectCount += player.countMark(event.name);
					player.removeSkill(event.name);
				},
			},
		},
	},
	/**劝百讽一
	 * 每个回合限2次，当你造成伤害时，你可以令任意名未受到此伤害的角色摸1张牌。
	 * 每个回合限1次，当你造成伤害时，你可以令所有未受到此伤害的角色摸1张牌。
	 * */
	mjsquanbaifengyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			source: "damageSource",
		},
		usable: 2,
		silent: true,
		popup: false,
		forced: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != get.event().getTrigger().player;
				})
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, event.targets);
			await game.asyncDraw(event.targets);
		},
	},
	//赵婕妤
	/**握拳藏钩
	 * 登场，添加1张随机花色和点数的“玉钩”，当一名其他角色打出与其相同花色或点数的牌后，你可以将“玉钩”置入该角色的装备区，之后每个回合限1次，当该角色获得牌时，你添加这些牌的复制到你的手牌。
	 * （玉钩：装备，防具，无法被打出和弃置，当你获得牌时，若手牌数≥你的手牌上限，则回复1点体力）
	 * 只要成功将玉钩置入目标的装备区，后续的复制牌效果就会持续存在。 
	 * */
	mjswoquancanggou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:6",
		logAudio: index => "ext:名将杀/audio/skill/mjswoquancanggou" + (typeof index === "number" ? index : get.rand(1, 6)) + ".mp3",
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		trigger: {
			global: ["useCardAfter", "respondAfter"],
		},
		popup: false,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return player.hasCard(card => {
				if (card.name != "mjsyugou") {
					return false;
				}
				return get.suit(card) == get.suit(event.card) || get.number(card) == get.number(event.card);
			}, "h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt(event.skill, trigger.player), `你可以将【玉钩】置入该角色的装备区，之后每个回合限1次，当该角色获得牌时，你添加这些牌的复制到你的手牌。`)
				.set("filterCard", card => {
					if (card.name != "mjsyugou") {
						return false;
					}
					const event = get.event().getTrigger();
					return get.suit(card) == get.suit(event.card) || get.number(card) == get.number(event.card);
				})
				.set("ai", card => {
					const player = get.player();
					const trigger = get.event().getTrigger();
					return get.attitude(player, trigger.player);
				})
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
			const card = event.cards[0];
			if (card) {
				player.$give(card, target, false);
				await target.equip(card);
				await game.delayx();
				const skill = event.name + "_effect";
				player.addSkill(skill);
				player.markAuto(skill, [target]);
				player.addTip(skill, get.translation(skill) + " " + player.getStorage(skill).reduce((str, target) => str + get.translation(target), ""), false, { whiteSpace: "nowrap" });
			}
		},
		group: "mjswoquancanggou_init",
		subSkill: {
			init: {
				trigger: {
					global: "phaseBefore",
					player: ["enterGame", "changeSkillsAfter"],
				},
				silent: true,
				filter(event, player) {
					if (event.name == "changeSkills") {
						return event.addSkill.includes("mjswoquancanggou");
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					player.logSkill("mjswoquancanggou", null, null, null, [get.rand(1, 2)]);
					const card = game.createCard("mjsyugou", mjs.suits.randomGet(), get.rand(1, 8));
					await game.delayx();
					await player.gain(card, "draw");
				},
			},
			effect: {
				trigger: {
					global: ["gainAfter", "loseAsyncAfter"],
				},
				usable: 1,
				popup: false,
				forced: true,
				locked: false,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				getIndex(event, player) {
					if (event.name == "loseAsync" && event.type != "gain") return [];
					return game
						.filterPlayer(target => {
							if (!event.getg?.(target)?.length) return false;
							return player.hasStorage("mjswoquancanggou_effect", target);
						})
						.sortBySeat();
				},
				logTarget: (event, player, triggername, target) => target,
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill("mjswoquancanggou", null, null, null, [get.rand(5, 6)]);
					const cards = [];
					for (const card of trigger.getg(target)) {
						const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
						if (cardx) cards.push(cardx);
					}
					if (cards.length) {
						await player.gain(cards, "draw");
					}
				},
				mark: true,
				marktext: "钩",
				intro: {
					markcount: () => 0,
					content: "$获得牌后，你添加这些牌的复制到你的手牌",
				},
			},
		},
	},
	/**尧母门
	 * 当你失去“玉钩”后的第14个回合结束时，用刘弗陵替换你的角色。每个回合限1次，当你成为其他角色打出牌的目标时，可以将目标改为装备区有“玉钩”的一名其他角色。
	 * */
	mjsyaomumen: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseEnd",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return player.hasAllHistory("lose", evt => evt.cards2?.some(card => card.name == "mjsyugou"));
		},
		async content(event, trigger, player) {
			player.addMark(event.name, 1, false);
			player.markSkill(event.name);
			if (player.countMark(event.name) < 14) return;
			player.tempBanSkill(event.name, "forever", false);
			const cards = player.getCards("hej");
			if (cards.length) {
				await player.discard(cards);
			}
			player.directgain(get.cards(4));
			if (player.name2 && get.character(player.name2, 3).includes(event.name)) {
				await player.reinitCharacter(player.name2, "mjs_liufuling");
			} else {
				await player.reinitCharacter(player.name1, "mjs_liufuling");
			}
		},
		marktext: "门",
		intro: {
			content(storage, player) {
				return `${14 - storage}个回合结束时，用刘弗陵替换你的角色`;
			},
		},
		group: "mjsyaomumen_change",
		subSkill: {
			change: {
				audio: "mjsyaomumen",
				trigger: {
					target: "useCardToTarget",
				},
				popup: false,
				usable: 1,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					if (!["basic", "trick"].includes(get.type(event.card))) {
						return false;
					}
					return game.hasPlayer(target => {
						if (!target.getEquips("mjsyugou").length || target == player || target == event.player) {
							return false;
						}
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, event.player, target);
					});
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "将目标改为装备区有【玉钩】的一名其他角色。", (card, player, target) => {
							const trigger = get.event().getTrigger();
							if (!target.getEquips("mjsyugou").length || target == player || target == event.player) {
								return false;
							}
							return lib.filter.targetEnabled2(trigger.card, trigger.player, target);
							//return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
						})
						.set("ai", target => {
							const trigger = get.event().getTrigger(),
								player = get.player();
							return get.effect(target, trigger.card, trigger.player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill(event.name, target);
					const evt = trigger.getParent();
					evt.triggeredTargets2.remove(player);
					evt.targets.remove(player);
					evt.targets.push(target);
				},
			},
		},
	},
	//刘弗陵
	/**麟趾承统
	 * 登场，获得场上手牌数最多的一名其他角色的所有手牌的复制。
	 * */
	mjslinzhichengtong: {
		nobracket: true,
		audio: ["ext:名将杀/audio/enter/mjs_liufuling.mp3", "ext:名将杀/audio/enter/mjs_liufuling2.mp3"],
		trigger: {
			global: ["phaseBefore", "changeSkillsAfter"],
			player: "enterGame",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			if (!game.hasPlayer(target => lib.skill.mjslinzhichengtong.filterTarget(null, player, target))) {
				return false;
			}
			if (event.name == "changeSkills") {
				return event.addSkill.includes("mjslinzhichengtong");
			}
			return (event.name != "phase" || game.phaseNumber == 0);
		},
		filterTarget(card, player, target) {
			return target != player && !game.hasPlayer((current) => current != player && current.countCards("h") > target.countCards("h"));
		},
		async content(event, trigger, player) {
			const targets = game.filterPlayer(target => {
				return lib.skill.mjslinzhichengtong.filterTarget(null, player, target);
			});
			if (!targets.length) {
				return;
			}
			const target = targets.randomGet();
			const cards = [];
			for (const card of target.getCards("h")) {
				const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
				if (cardx) cards.push(cardx);
			}
			if (cards.length) {
				await player.gain(cards, "draw");
			}
		},
	},
	/**盐铁之议
	 * 出牌阶段限1次，你可以选择令所有角色摸牌阶段的摸牌数+1，或者令所有其他角色的手牌上限-1，你的手牌上限+1。
	 * */
	mjsyantiezhiyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		logAudio: index => "ext:名将杀/audio/skill/mjsyantiezhiyi" + (typeof index === "number" ? index : get.rand(1, 2)) + ".mp3",
		enable: "phaseUse",
		usable: 1,
		log: false,
		async precontent(event, trigger, player) {
			const skillName = event.name.slice("pre_".length);
			const result = await player
				.chooseControl("所有角色摸牌+1", "其他角色手牌上限-1", "cancel2")
				.set("prompt", `###${get.prompt(skillName)}###选择所有角色摸牌+1或者令所有其他角色的手牌上限-1，你的手牌上限+1。`)
				.set("ai", () => {
					let player = get.player();
					return "其他角色手牌上限-1";
				})
				.forResult();
			if (result.control != "cancel2") {
				event.getParent().cost_data = result.control;
				return;
			}
			event.getParent().goto(0);
		},
		async content(event, trigger, player) {
			if (event.getParent(2).cost_data == "所有角色摸牌+1") {
				player.logSkill(event.name, null, null, null, [1]);
				for (const target of game.filterPlayer()) {
					target.addSkill(event.name + "_effect");
					target.addMark(event.name + "_effect", 1, false);
				}
			} else {
				player.logSkill(event.name, null, null, null, [2]);
				for (const target of game.filterPlayer(i => i != player)) {
					lib.skill.mjsallmax.change(target, -1);
				}
				lib.skill.mjsallmax.change(player, 1);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return 1;
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					player: "phaseDrawBegin2",
				},
				popup: false,
				forced: true,
				charlotte: true,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
			},
		},
	},
	//李夫人
	/**倾国倾城
	 * 出牌阶段限2次，你可以令一名其他角色查看并选择添加1张你的手牌的复制，当其打出此牌首次造成伤害时，你摸2张牌。
	 * 出牌阶段限2次，你可以令一名其他角色查看并选择添加1张你的手牌的复制，直到你的下个回合开始，若其没有对其他角色造成过伤害，则弃置这些牌，并失去1点体力。
	 * */
	mjsqingguoqingcheng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		onremove(player, skill) {
			player.removeSkill(skill + "_effect");
		},
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return player.countCards("h");
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			const cards = player.getCards("h");
			if (!cards.length) {
				return;
			}
			const result = await target
				.chooseCardButton(get.translation(event.name), cards, true)
				.set("ai", button => {
					const player = get.player();
					return player.getUseValue(button.link);
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				const card = result.links[0];
				const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
				if (cardx) {
					const skill = event.name + "_effect";
					player.addSkill(skill);
					if (player.storage[skill].has(target)) {
						const cards = player.storage[skill].get(target).slice().add(cardx);
						player.storage[skill].set(target, cards);
					} else {
						player.storage[skill].set(target, [cardx]);
					}
					const next = target.gain(cardx, "draw");
					next.gaintag.add(event.name + "_tag");
					await next;
				}
			}
		},
		ai: {
			order(item, player) {
				player = player || get.event().player;
				if (player.hasFriend()) {
					return 13;
				}
				return 1;
			},
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					return att;
				},
			},
		},
		subSkill: {
			tag: { name: "倾" },
			effect: {
				init(player, skill) {
					player.storage[skill] = new Map();
				},
				trigger: {
					global: "damageSource",
				},
				forced: true,
				locked: false,
				onremove: true,
				filter(event, player) {
					if (!event.card || !event.cards || !event.cards.length) {
			            return true;
			        }
					const map = player.storage.mjsqingguoqingcheng_effect;
					return event.source && event.source != event.player && map instanceof Map && map.has(event.source) && map.get(event.source).containsSome(...event.cards);
				},
				logTarget: "source",
				async content(event, trigger, player) {
					const map = player.storage.mjsqingguoqingcheng_effect;
					if (map instanceof Map) {
						const cards = map.get(trigger.source).slice().removeArray(trigger.cards);
						map.set(trigger.source, cards);
					}
					await player.draw(2);
				},
			},
		},
	},
	/**姗姗来迟
	 * 你在游戏的第2轮开始时登场。登场/阵亡，令一名其他角色摸牌至手牌上限，并且回复所有体力值。
	 * 你在游戏的第2轮开始时登场。登场/阵亡，令一名其他角色选择摸牌至手牌上限或回复所有体力值。
	 * 第1轮李夫人的武将没有登场，无法成为目标，也不会进行回合（其实就类似庞统的涅槃状态） 
	 * */
	mjsshanshanlaichi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: ["phaseBefore", "die"],
			player: ["enterGame", "changeSkillsAfter"],
		},
		popup: false,
		forceDie: true,
		filter(event, player) {
			if (event.name == "changeSkills") {
				return event.addSkill.includes("mjsshanshanlaichi");
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			if (!game.hasPlayer(target => target != player)) {
				return;
			}
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名其他角色选择摸牌至手牌上限并回复所有体力值。", lib.filter.notMe, true)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					const draw = (target.getHandcardLimit() - target.countCards("h")) * get.effect(target, { name: "draw" }, player, _status.event.player);
					const recover = get.recoverEffect(target, player, player) * target.getDamagedHp();
					return draw + recover;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			await target.drawTo(target.getHandcardLimit());
			await target.recoverTo(target.maxHp);
		},
		ai: {
			deferHide: true,
		},
	},
	//黄月英
	/**巧手匠心
	 * 出牌阶段限1次，你可以选择1张手牌或场上任意1张装备牌，获得1张此牌的复制。
	 * */
	mjsqiaoshoujiangxin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (ui.selected.cards.length || target == player) {
				return false;
			}
			return target.countCards("e");
		},
		selectTarget: [0, 1],
		filterCard(card, player) {
			if (ui.selected.targets.length) {
				return false;
			}
			return true;
		},
		position: "he",
		selectCard: [0, 1],
		check(card) {
			const player = get.player();
			return player.getUseValue(card);
		},
		filterOk() {
			return ui.selected.targets.length != ui.selected.cards.length;
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			if (event.cards?.length) {
				const card = event.cards[0];
				const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
				if (cardx) await player.gain(cardx, "draw");
				return;
			}
			const [target] = event.targets;
			const result = await player
				.choosePlayerCard(get.translation(event.name), target, "e", true)
				.set("ai", button => {
					const player = get.player();
					return get.value(button.link);
				})
				.forResult();
			if (result?.bool && result.cards?.length) {
				const card = result.cards[0];
				const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
				if (cardx) await player.gain(cardx, "draw");
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return 1;
				},
				target(player, target) {
					let att = get.attitude(player, target);
					let es = target.getCards("e");
					return att * es.length;
				},
			},
		},
	},
	/**奇智佐谋
	 * 你主动打出的战法牌生效2次，每种战法牌每回合限1次。
	 * */
	mjsqizhizuomou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "useCard",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (player.hasStorage("mjsqizhizuomou_used", event.card.name)) {
				return false;
			}
			return get.type(event.card) == "trick";
		},
		async content(event, trigger, player) {
			player.addTempSkill("mjsqizhizuomou_used");
			player.markAuto("mjsqizhizuomou_used", [trigger.card.name]);
			if (typeof trigger.effectCount != "number") {
				trigger.effectCount = 1;
			}
			trigger.effectCount++;
		},
		ai: {
			player(card, player, target, current) {
				if (["tiesuo", "mjslianhuan"].includes(card.name)) {
					return "zeroplayertarget";
				}
				if (get.type(card) == "trick" && get.tag(card, "norepeat")) {
					return 0.5;
				}
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//王异
	/**忠贞刚烈
	 * 回合结束时，你可以令一名其他角色的手牌数变为与你相同，若其手牌数因此改变>=2，你受到1点伤害。
	 * 回合结束时，你可以令一名其他角色的手牌数或者体力值变为与你相同，若其手牌数或者体力值因此改变>=2，你受到1点伤害。
	 * */
	mjszhongzhenganglie: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseEnd",
		},
		popup: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					return get.sgnAttitude(player, target) * (player.countCards("h") - target.countCards("h"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const num = target.countCards("h") - player.countCards("h");
			if (num > 0) {
				await target.chooseToDiscard("h", num, true);
			} else {
				await target.drawTo(player.countCards("h"));
			}
			if (Math.abs(num) >= 2) {
				await player.damage("nosource");
			}
		},
	},
	/**舍子全义
	 * 受伤，你可以令一名角色弃置所有手牌并摸牌至手牌上限。
	 * */
	mjssheziquanyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageEnd",
		},
		popup: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return true;
					return target.countCards("h");
				})
				.set("ai", target => {
					let player = get.player();
					let eff = get.effect(player, { name: "draw" }, player, player) * target.getHandcardLimit() -
						target.countCards("h", card => {
							return lib.filter.cardDiscardable(card, target);
						});
					return get.sgnAttitude(player, target) * eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			await target.modedDiscard(target.getCards("h"));
			await target.drawTo(target.getHandcardLimit());
		},
	},
	//平阳公主
	/**荐姝入掖
	 * 每局游戏限2次，出牌阶段限1次，选择一名其他角色，然后抽取3张武将牌，选择其中一名武将的1个技能，令其获得此技能，直到你再次发动此技能或你阵亡；当其首次发动此技能时，你的手牌上限+1，并摸牌至手牌上限。
	 * */
	mjsjianshuruye: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		audioname: ["mjs_pingyanggongzhu_yunquehegui"],
		init(player, skill) {
			player.setMark(skill, 3, false);
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!player.hasMark("mjsjianshuruye")) {
				return false;
			}
			return game.hasPlayer(target => lib.skill.mjsjianshuruye.filterTarget(null, player, target));
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.removeSkill(event.name + "_clear");
			player.removeSkill(event.name + "_effect");
			player.removeMark(event.name, 1, false);
			const target = event.target;
			const characters = lib.skill.mjsdunjiatianshu.getList(player).randomGets(3);
			const list = characters.randomGets(3);
			if (!list.length) {
				return;
			}
			let num = 0,
				skillMap = {};
			for (const i of list) {
				const skills = (lib.character[i][3] || []).filter(skill => {
					const info = get.info(skill);
					return info && !info.zhuSkill && !info.hiddenSkill && !info.charlotte;
				});
				if (skills.length > num) {
					num = skills.length;
				}
				skillMap[i] = skills;
			}
			if (num == 0) {
				return;
			}
			const result = await player
				.chooseButton(
					[
						[[`###${get.translation(event.name)}###请选择要获得的技能`], "addNewRow"],
						[
							dialog => {
								dialog.css({
									top: get.is.phoneLayout() ? "5%" : "45%",
								});
								const { list, skillMap } = get.event();
								//算出来需要多少列，最多八列
								const num = 8;
								const column = Math.min(list.length, num);
								if (column > 6) {
									dialog.css({
										width: "100%",
										left: 0,
									});
								}
								//重新创建一个容器，不然css之后会导致dialog.content内的其他元素也加入到布局中
								const contentx = ui.create.div(".content", dialog.content);
								contentx.css({
									display: "grid",
									gridTemplateColumns: `repeat(${column}, 1fr)`,
									width: "fit-content",
									margin: "auto",
								});
								//一个一个塞进去
								for (const i of list) {
									const div = ui.create.div(".buttons", contentx);
									const button = ui.create.button(i, "character", div);
									const skills = skillMap[i];
									//让角色和技能按钮水平居中垂直排列
									div.css({
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									});
									//角色因为不是可选按钮所以需要调整一下透明度
									button.style.setProperty("opacity", "1", "important");
									if (skills.length) {
										//创建技能按钮
										const buttons = ui.create.buttons(
											skills.map(i => [i, get.translation(i)]),
											"tdnodes",
											div
										);
										//丢进可选按钮中
										dialog.buttons = dialog.buttons.concat(buttons);
									}
								}
							},
							"handle",
						],
					],
				)
				.set("list", list.slice())
				.set("skillMap", skillMap)
				.set("ai", button => {
					const skill = button.link;
					return get.skillRank(skill, "inout");
				})
				.forResult();
			if (result?.bool && result?.links?.length) {
				const createSkills = mjs.addCreateSkills(result.links);
				player.addSkill(event.name + "_clear");
				player.storage[event.name + "_clear"].set(target, createSkills);
				player.addSkill(event.name + "_effect");
				player.storage[event.name + "_effect"].set(target, createSkills);
				await target.addSkills(createSkills);
			}
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					return 1;
				},
			},
		},
		subSkill: {
			clear: {
				init(player, skill) {
					player.storage[skill] = new Map();
				},
				onremove(player, skill) {
					if (!(player.storage[skill] instanceof Map)) {
						return;
					}
					const info = player.getStorage(skill, new Map());
					delete player.storage[skill];
					[...info.entries()].forEach(list => {
						const target = list[0], skills = list[1];
						if (get.itemtype(target) == "player" && target?.isIn()) {
							target.removeSkills(skills);
						}
					});
				},
			},
			effect: {
				init(player, skill) {
					player.storage[skill] = new Map();
				},
				onremove: true,
				trigger: {
					global: ["useSkill", "logSkillBegin"],
				},
				silent: true,
				popup: true,
				filter(event, player) {
					const map = player.getStorage("mjsjianshuruye_effect", new Map());
					if (!map?.has(event.player)) {
						return false;
					}
					if (["global", "equip"].includes(event.type)) {
						return false;
					}
					let skill = get.sourceSkillFor(event);
					if (!skill) {
						return false;
					}
					let info = get.info(skill);
					if (!info || info.charlotte || info.equipSkill) {
						return false;
					}
					return map?.get(event.player).includes(skill);
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					lib.skill.mjsallmax.change(player, 1);
					await player.drawTo(player.getHandcardLimit());
				},
			},
		},
	},
	/**凤历三春
	 * 每局游戏限3次，出牌阶段限1次，选择一名其他男性角色，每名角色限1次，选择其1个技能并添加1个与其同名的技能，直到你再次发动此技能或目标角色阵亡。
	 * */
	mjsfenglisanchun: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		audioname: ["mjs_pingyanggongzhu_yunquehegui"],
		init(player, skill) {
			player.setMark(skill, 3, false);
		},
		onremove(player, skill) {
			delete player.storage[skill + "_used"];
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!player.hasMark("mjsfenglisanchun")) {
				return false;
			}
			return game.hasPlayer(target => lib.skill.mjsfenglisanchun.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			if (player.getStorage('mjsfenglisanchun_targeted').includes(target)) {
				return false;
			}
			return target != player && target.hasSex("male");
		},
		async content(event, trigger, player) {
			player.removeSkill(event.name + "_clear");
			player.removeMark(event.name, 1, false);
			const target = event.target;
			player.addSkill(event.name + "_used");
			player.markAuto(event.name + "_used", [target]);
			const skills = target.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
					return false;
				}
				return true;
			});
			if (!skills.length) return;
			const list = [target.name];
			let num = 0,
				skillMap = {};
			for (const i of list) {
				if (skills.length > num) {
					num = skills.length;
				}
				skillMap[i] = skills;
			}
			if (num == 0) {
				return;
			}
			const result = await player
				.chooseButton(
					[
						[[`###${get.translation(event.name)}###选择一个技能获得`], "addNewRow"],
						[
							dialog => {
								dialog.css({
									top: get.is.phoneLayout() ? "5%" : "45%",
								});
								const { list, skillMap } = get.event();
								//算出来需要多少列，最多八列
								const num = 8;
								const column = Math.min(list.length, num);
								if (column > 6) {
									dialog.css({
										width: "100%",
										left: 0,
									});
								}
								//重新创建一个容器，不然css之后会导致dialog.content内的其他元素也加入到布局中
								const contentx = ui.create.div(".content", dialog.content);
								contentx.css({
									display: "grid",
									gridTemplateColumns: `repeat(${column}, 1fr)`,
									width: "fit-content",
									margin: "auto",
								});
								//一个一个塞进去
								for (const i of list) {
									const div = ui.create.div(".buttons", contentx);
									const button = ui.create.button(i, "character", div);
									const skills = skillMap[i];
									//让角色和技能按钮水平居中垂直排列
									div.css({
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									});
									//角色因为不是可选按钮所以需要调整一下透明度
									button.style.setProperty("opacity", "1", "important");
									if (skills.length) {
										//创建技能按钮
										const buttons = ui.create.buttons(
											skills.map(i => [i, get.translation(i)]),
											"tdnodes",
											div
										);
										//丢进可选按钮中
										dialog.buttons = dialog.buttons.concat(buttons);
									}
								}
							},
							"handle",
						],
					],
				)
				.set("list", list.slice())
				.set("skillMap", skillMap)
				.set("ai", button => {
					let { player, target } = get.event();
					if (get.attitude(player, target) > 0) return 0;
					_status.event.skillRankPlayer = target;
					let eff = get.skillRank(button.link);
					delete _status.event.skillRankPlayer;
					return eff;
				})
				.set("target", target)
				.forResult();
			if (result?.bool && result.links?.length) {
				const createSkills = mjs.addCreateSkills(result.links);
				game.broadcastAll(function (list) {
	                game.expandSkills(list);
	                for (const i of list) {
	                    var info = lib.skill[i];
	                    if (!info) {
	                        continue;
	                    }
	                    if (!info.audioname2) {
	                        info.audioname2 = {};
	                    }
	                    info.audioname2.mjs_pingyanggongzhu = "mjsfenglisanchun";
	                }
	            }, createSkills);
				player.addSkill(event.name + "_clear");
				player.storage[event.name + "_clear"].set(target, createSkills);
				await player.addSkills(createSkills);
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					let att = get.sgnAttitude(player, target);
					let eff = target.getSkills(null, false, false).length;
					return att * eff;
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			clear: {
				init(player, skill) {
					player.storage[skill] = new Map();
				},
				onremove(player, skill) {
					if (!(player.storage[skill] instanceof Map)) {
						return;
					}
					const skills = [...player.storage[skill].values()].flatMap(v => v);
					delete player.storage[skill];
					if (skills.length) {
						player.removeSkills(skills);
					}
				},
				trigger: {
					global: "dieAfter",
				},
				forced: true,
				charlotte: true,
				filter(event, player) {
					return player.storage?.mjsfenglisanchun_clear?.has(event.player);
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
				},
			},
		},
	},
	//霍光
	/**行举有常
	 * 当你打出牌时，若此牌的点数等于当前轮数，你摸1张牌，并增加1点体力上限。
	 * */
	mjsxingjuyouchang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					if (get.number(card) == game.roundNumber) {
						return num + 20;
					}
				}
			},
		},
		trigger: {
			player: ["useCard", "respond"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return get.number(event.card, player) == game.roundNumber;
		},
		async content(event, trigger, player) {
			await player.draw();
			await player.gainMaxHp();
		},
		ai: {

		},
	},
	/**芒刺在背
	 * 你的回合内，当其他角色打出牌时，若此牌点数＞你打出的上1张牌的点数，则你可以令其失去1点体力。 
	 * 回合结束时，与你距离为1并且体力值≥你的其他角色失去1点体力。
	 * */
	mjsmangcizaibei: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init() {
			game.addGlobalSkill("mjsmangcizaibei_ai");
		},
		onremove(player) {
			if (!game.hasPlayer((current) => current.hasSkill("mjsmangcizaibei", null, null, false), true)) {
				game.removeGlobalSkill("mjsmangcizaibei_ai");
			}
		},
		trigger: {
			global: ["useCard", "respond"],
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (event.player == player || _status.currentPhase != player) {
				return false;
			}
			const num = player.storage.mjsmangcizaibei_mark;
	        if (!num || typeof num != "number") {
	            return false;
	        }
	        return get.number(event.card, event.player) > num;
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			trigger.player.loseHp();
		},
		group: "mjsmangcizaibei_mark",
	    subSkill: {
	        mark: {
	            charlotte: true,
	            trigger: {
	                player: ["useCardAfter","respondAfter"],
	            },
	            forced: true,
	            popup: false,
	            firstDo: true,
	            async content(event, trigger, player) {
	                player.storage.mjsmangcizaibei_mark = get.number(trigger.card, player);
	                if (typeof get.number(trigger.card, player) != "number") {
	                    player.unmarkSkill("mjsmangcizaibei_mark");
	                } else {
	                    player.markSkill("mjsmangcizaibei_mark");
	                }
	            },
	            intro: {
	                content(storage, player) {
	                    return "上一张牌的点数：" + get.strNumber(storage);
	                },
	            },
	        },
	        ai: {
				trigger: {
	                player: "dieAfter",
	            },
	            filter: (event, player) => {
	              return !game.hasPlayer((current) => current.hasSkill("mjsmangcizaibei", null, null, false), true);
	            },
	            silent: true,
	            forceDie: true,
	            charlotte: true,
	            content: () => {
	              	game.removeGlobalSkill("mjsmangcizaibei_ai");
	            },
	            ai: {
			        effect: {
			            player_use(card, player) {
			            	const source = _status.currentPhase;
			            	if (!source?.isIn() || source == player || !source.hasSkill("mjsmangcizaibei") || get.attitude(source, player) > 0) {
			            		return;
			            	}
			            	const num = source.storage.mjsmangcizaibei_mark;
					        if (!num || typeof num != "number") {
					            return;
					        }
			            	if (get.number(card) > num) {
			                	return [0, -2];
			              	}
			            },
			        },
			    },
			},
	    },
	},
	/**擅专废立
	 * 限定，令两名其他角色交换体力上限与体力值、手牌和装备区的牌，然后你减少两者体力值差值的体力上限，并弃置等量张牌。 
	 * 限定，你可以弃置所有手牌，令两名其他角色交换体力上限与体力值、手牌和装备区的牌，然后你减少两者体力值差值的体力上限。
	 * */
	mjsshanzhuanfeili: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		filter(event, player) {
			return game.countPlayer(target => target != player) > 1;
		},
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		line: false,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { targets } = event;
			const maxHp1 = targets[0].maxHp,
				maxHp2 = targets[1].maxHp,
				deltMaxHp = Math.abs(maxHp1 - maxHp2);
			if (maxHp1 > maxHp2) {
				await targets[0].loseMaxHp(deltMaxHp);
				await targets[1].gainMaxHp(deltMaxHp);
			} else if (maxHp1 < maxHp2) {
				await targets[0].gainMaxHp(deltMaxHp);
				await targets[1].loseMaxHp(deltMaxHp);
			}
			const hp1 = targets[0].hp,
				hp2 = targets[1].hp,
				deltHp = Math.abs(hp1 - hp2);
			if (deltHp != 0) {
				await targets[0].changeHp(hp2 - hp1);
				await targets[1].changeHp(hp1 - hp2);
			}
			//名将交换手牌触发失去和获得的时机
			const hs1 = targets[0].getCards("h"),
				hs2 = targets[1].getCards("h");
			if (hs2.length) await targets[0].gain(hs2, targets[1], "giveAuto", "bySelf");
			if (hs1.length) await targets[1].gain(hs1, targets[0], "giveAuto", "bySelf");
			await targets[0].swapEquip(targets[1]);
			const delt = Math.abs(targets[0].hp - targets[1].hp);
			if (delt > 0) {
				await player.loseMaxHp(delt);
				await player.chooseToDiscard("he", delt, true);
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (!ui.selected.targets.length) {
						return -Math.sqrt(target.maxHp + target.countCards("h") + target.countCards("e"));
					}
					var h1 = ui.selected.targets[0].getCards("h"), h2 = target.getCards("h");
					if (h2.length > h1.length) {
						return 0;
					}
					var delval = get.value(h2, target) - get.value(h1, ui.selected.targets[0]);
					if (delval >= 0) {
						return 0;
					}
					return -delval * (h1.length - h2.length);
				},
			},
		},
	},
	//侯嬴
	/**修身洁行
	 * 你受到的>1的伤害-1。
	 * */
	mjsxiushenjiexing: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageBegin3",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.num > 1;
		},
		async content(event, trigger, player) {
			trigger.num--;
		},
	},
	/**市井隐者
	 * 你打出目标唯一的战法牌在生效前暗置。回合结束时，本回合你每打出1张战法牌，就可以获得1张装备牌，并交给一名其他角色。
	 * 你打出目标唯一的战法牌在生效前暗置。你每打出1张战法牌，你可以令一名其他角色从弃牌堆获得1张装备牌。
	 * */
	mjsshijingyinzhe: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init() {
			game.addGlobalSkill("mjsshijingyinzhe_hide");
		},
		onremove(player) {
			if (!game.hasPlayer((current) => current.hasSkill("mjsshijingyinzhe", null, null, false), true)) {
				game.removeGlobalSkill("mjsshijingyinzhe_hide");
			}
		},
		trigger: {
			player: "useCardBefore",
		},
		popup: false,
		forced: true,
		locked: false,
		firstDo: true,
		filter(event, player) {
			return get.type(event.card) == "trick" && event.targets?.length == 1;
		},
		async content(event, trigger, player) {
			const [card] = trigger.cards;
			const name = trigger.card.name;
			const loseEvent = player.lose(card, ui.ordering);
			loseEvent.relatedEvent = trigger;
			await loseEvent;
			trigger.skill = "mjsshijingyinzhe_backup";
			trigger.nopop = true;
			trigger.animate = false;
			trigger.throw = false;
			trigger.card.hidden = true;
			game.broadcastAll(
				function (card2, player2) {
					_status.mjsshijingyinzheNode = card2.copy("thrown");
					if (lib.config.cardback_style != "default") {
						_status.mjsshijingyinzheNode.style.transitionProperty = "none";
						ui.refresh(_status.mjsshijingyinzheNode);
						_status.mjsshijingyinzheNode.classList.add("infohidden");
						ui.refresh(_status.mjsshijingyinzheNode);
						_status.mjsshijingyinzheNode.style.transitionProperty = "";
					} else {
						_status.mjsshijingyinzheNode.classList.add("infohidden");
					}
					_status.mjsshijingyinzheNode.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
					player2.$throwordered2(_status.mjsshijingyinzheNode);
				},
				trigger.cards[0],
				player
			);
			event.onEnd_mjsshijingyinzhe = function () {
				_status.mjsshijingyinzheNode.removeEventListener("webkitTransitionEnd", _status.event.onEnd01);
				setTimeout(function () {
					_status.mjsshijingyinzheNode.style.transition = "all ease-in 0.3s";
					_status.mjsshijingyinzheNode.style.transform = "perspective(600px) rotateY(270deg)";
					const onEnd = function () {
						_status.mjsshijingyinzheNode.classList.remove("infohidden");
						_status.mjsshijingyinzheNode.style.transition = "all 0s";
						ui.refresh(_status.mjsshijingyinzheNode);
						_status.mjsshijingyinzheNode.style.transform = "perspective(600px) rotateY(-90deg)";
						ui.refresh(_status.mjsshijingyinzheNode);
						_status.mjsshijingyinzheNode.style.transition = "";
						ui.refresh(_status.mjsshijingyinzheNode);
						_status.mjsshijingyinzheNode.style.transform = "";
						_status.mjsshijingyinzheNode.removeEventListener("webkitTransitionEnd", onEnd);
					};
					_status.mjsshijingyinzheNode.listenTransition(onEnd);
				}, 300);
			};
			await game.delayx();
			player
				.when({ global: "useCardToBegin" })
				.filter(evt => evt.card == trigger.card)
				.then(async () => {
					game.broadcastAll(function (onEnd) {
						_status.event.onEnd_mjsshijingyinzhe = onEnd;
						if (_status.mjsshijingyinzheNode) {
							_status.mjsshijingyinzheNode.listenTransition(onEnd, 300);
						}
					}, event.onEnd_mjsshijingyinzhe);
					await game.delay(2);
				});
		},
		group: ["mjsshijingyinzhe_use"],
		subSkill: {
			backup: {
				audio: "mjsshijingyinzhe",
			},
			use: {
				trigger: {
					player: "phaseEnd",
				},
				filter(event, player) {
					return player.hasHistory("useCard", evt => get.type2(evt.card) == "trick");
				},
				prompt2(event, player) {
					const num = player.getHistory("useCard", evt => get.type2(evt.card) == "trick").length;
					return `获得${num}张装备牌，并交给一名其他角色。`;
				},
				check(event, player) {
					return game.hasPlayer(target => {
						return target != player && get.attitude(player, target) > 0;
					});
				},
				async content(event, trigger, player) {
					const num = player.getHistory();
					const cards = [];
					while (cards.length < num) {
						const card = get.cardPile(card => {
							if (cards.includes(card)) return false;
							return get.type(card) == "equip";
						});
						if (card) {
							cards.push(card);
						} else {
							break;
						}
					}
					if (cards.length) {
						await player.gain(cards, "draw");
						if (!game.hasPlayer(target => target != player)) {
							return;
						}
						const result = await player
							.chooseTarget(`${mjs.prompt(event.name)}，请选择一名其他角色令其获得${cards.length}张装备牌`, lib.filter.notMe, true)
							.set("ai", target => {
								const player = get.player();
								return get.attitude(player, target);
							})
							.forResult();
						if (result?.targets?.length) {
							const target = event.targets[0];
							await player.give(cards, target);
						}
					}
				},
			},
			hide: {
				trigger: {
					player: "chooseToUseBegin",
				},
				popup: false,
				forced: true,
				locked: false,
				firstDo: true,
				filter(event, player) {
					if (event.type != "wuxie") {
						return false;
					}
					let info = event.info_map;
					if (!info || get.type(info.card) != "trick") {
						return false;
					}
					return info.card.hidden;
				},
				async content(event, trigger, player) {
					const prompt = trigger.prompt.slice().replace(/使用的.*?即将/, "使用的暗置锦囊牌即将");
					trigger.prompt = prompt;
				},
			},
		},
	},
	/**以身明志
	 * 出牌阶段，你可以失去1点体力，然后获得1张战法牌。
	 * */
	mjsyishenmingzhi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		filter(event, player) {
			return player.getHp(true) > 0;
		},
		async content(event, trigger, player) {
			await player.loseHp();
			const card = get.cardPile2(card => get.type2(card) == "trick");
			if (card) {
				await player.gain(card, "draw");
			}
		},
		ai: {
			order: 7,
			result: {
				player(player) {
					if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
						return 0;
					}
					if (player.hasSkillTag("nogainFromCardPile")) {
	                	return 0;
	                }
					if (!Array.from(ui.cardPile.childNodes).some(card => get.type2(card) == "trick")) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//朱亥
	/**不拘小礼
	 * 你造成的>1的伤害+1。
	 * */
	mjsbujuxiaoli: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			source: "damageBegin1",
		},
		silent: true,
		popup: true,
		priority: -12,
		filter(event, player) {
			return event.num > 1;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.num++;
			game.log(player, "对", trigger.player, "造成的伤害", "#y+1");
		},
		ai: {
			damageBonus: true,
		},
	},
	/**市井国士
	 * 装备上限+1；你的装备牌仅你可见。
	 * */
	mjsshijingguoshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init(player, skill) {
			game.broadcastAll(
				(player2, skill2) => {
					const observer = new MutationObserver((mutationsList) => {
						for (const mutation of mutationsList) {
							if (mutation.type === "childList") {
								const cards2 = player.getCards("e") ?? [];
								if (player2.node.equips) {
									for (const card2 of mutation.addedNodes) {
										if (cards2.includes(card2)) {
											game.broadcastAll(
												(card3, player3, skill3) => {
													card3.classList.add(skill3);
													game.addVideo("skill", player3, [skill3, [true, [get.cardInfo(card3)]]]);
												},
												card2,
												player2,
												"mj-shijingguoshi"
											);
										}
									}
								}
								for (const card2 of mutation.removedNodes) {
									if (card2.classList.contains("mj-shijingguoshi")) {
										game.broadcastAll(
											(card3, player3, skill3) => {
												card3.classList.remove(skill3);
												game.addVideo("skill", player3, [skill3, [false, [get.cardInfo(card3)]]]);
											},
											card2,
											player2,
											"mj-shijingguoshi"
										);
									}
								}
							}
						}
					});
					const config = { childList: true };
					observer.observe(player2.node.equips, config);
					player2.getCards("e").forEach((card2) => {
						game.broadcastAll(
							(card3, player3, skill3) => {
								card3.classList.add(skill3);
								game.addVideo("skill", player2, [skill3, [false, [get.cardInfo(card3)]]]);
							},
							card2,
							player2,
							"mj-shijingguoshi"
						);
					});
					const { card, blank, ...others } = ui.create.buttonPresets;
					ui.create.buttonPresets = {
						...others,
						card(item, ...args) {
							if (item.classList.contains("mj-shijingguoshi") && args[args.length - 1] !== skill2) {
								return blank(item, ...args, skill2);
							}
							return card(item, ...args);
						},
						blank(item, ...args) {
							if (item.classList.contains("mj-shijingguoshi") && args[args.length - 1] !== skill2) {
								return card(item, ...args, skill2);
							}
							return blank(item, ...args);
						}
					};
				},
				player,
				skill
			);
			player.mjsExpandEquip();
			if (_status._mj_shijingguoshi) {
				return;
			}
			_status._mj_shijingguoshi = true;
			game.broadcastAll(() => {
				const nameList = Object.values(lib.cardPack).flat().filter(name => get.type(name) == "equip");
				if (!nameList.length) {
					return;
				}
				for (const name of nameList) {
					const info = get.info({ name: name });
					if (!info) continue;
					const origin_cardPrompt = info.cardPrompt;
					if (!origin_cardPrompt) {
						info.cardPrompt = function (card, player) {
							if (Array.isArray(card)) {
								return lib.translate[card[2] + "_info"];
							}
							if (card?.classList?.contains("mj-shijingguoshi") && player?.dataset?.position != "0") {
								return "一张暗置的装备牌（对你不可见）。";
							}
							return lib.translate[card.name + "_info"];
						};
					} else if (typeof origin_cardPrompt === "function") {
						info.cardPrompt = function (card, player) {
							if (Array.isArray(card)) {
								return lib.translate[card[2] + "_info"];
							}
							if (card?.classList?.contains("mj-shijingguoshi") && player?.dataset?.position != "0") {
								return "一张暗置的装备牌（对你不可见）。";
							}
							return origin_cardPrompt.call(this, card, player);
						};
					}
				}
			});
		},
		onremove(player) {
			game.broadcastAll(
				(player2, skill2) => {
					player2.getCards("e").forEach((card) => {
						if (card.classList.contains("mj-shijingguoshi")) {
							card.classList.remove(skill2);
							game.addVideo("skill", player2, [skill2, [false, [get.cardInfo(card)]]]);
						}
					});
				},
				player,
				"mj-shijingguoshi"
			);
			player.mjsContractEquip();
		},
		video(player, info) {
			for (const cardid of info[1]) {
				for (const card of player.getCards("e")) {
					if (card.cardid === cardid[4]) {
						card.classList[info[0] ? "add" : "remove"]("mj-shijingguoshi");
					}
				}
			}
		},
		trigger: {
			player: "useCardBefore",
		},
		popup: false,
		forced: true,
		locked: false,
		firstDo: true,
		filter(event, player) {
			return get.type(event.card) == "equip" && event.cards?.length;
		},
		async content(event, trigger, player) {
			trigger.skill = "mjsshijingyinzhe_backup";
			trigger.nopop = true;
			trigger.animate = false;
			trigger.throw = false;
		},
		subSkill: {
			backup: {
				audio: "mjsshijingguoshi",
			},
		},
	},
	/**以身搏虎
	 * 杀伤，令目标角色流血+1。你对流血效果的角色伤害+1。
	 * */
	mjsyishenbohu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		logAudio: index => "ext:名将杀/audio/skill/mjsyishenbohu" + (typeof index === "number" ? index : get.rand(1, 2)) + ".mp3",
		derivation: "mjs_debuff_liuxue_faq",
		trigger: {
			source: ["damageSource", "damageBegin1"],
		},
		popup: false,
		forced: true,
		locked: false,
		filter(event, player, name) {
			if (name == "damageSource") {
				return event.card?.name == "sha" && event.player?.isIn();
			}
			return event.player.hasSkill("mjs_debuff_liuxue");
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, trigger.player, null, null, [event.triggername == "damageSource" ? 1 : 2]);
			if (event.triggername == "damageSource") {
				trigger.player.addSkill("mjs_debuff_liuxue");
				trigger.player.addMark("mjs_debuff_liuxue", 1, false);
			} else {
				trigger.num++;
				game.log(player, "对", trigger.player, "造成的伤害", "#y+1");
			}
		},
		ai: {
			presha: true,
			damageBonus: true,
			effect: {
				player(card2, player2, target) {
					if (card2.name === "sha" && target?.hasSkill("mjs_debuff_liuxue")) {
						if (get.attitude(player2, target) > 0) {
							return [1, -0.5];
						}
					}
				},
			},
		},
	},
	//公孙瓒
	/**白马义从
	 * 登场，复制牌堆中所有的坐骑牌，并洗入牌堆；你的坐骑牌的效果会触发2次。
	 * 游戏开始时，复制牌堆中所有的坐骑牌，并洗入牌堆；你的坐骑牌的效果会触发2次。
	 * */
	mjsbaimayicong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsbaimayicong" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		init(player) {
			if (_status._mj_baimayicong) {
				return;
			}
			_status._mj_baimayicong = true;
			game.broadcastAll(() => {
				const nameList = Object.values(lib.cardPack).flat().filter(name => {
					const type = get.subtype({ name: name });
					return type == "equip3" || type == "equip4" || type == "equip6";
				});
				if (!nameList.length) {
					return;
				}
				for (const name of nameList) {
					const info = get.info({ name: name });
					if (!info || !info.skills?.length) continue;
					const skills = info.skills;
					game.expandSkills(skills);
					for (const skill of skills) {
						const info = get.info(skill);
						const origin_getIndex = info.getIndex;
						if (!origin_getIndex) {
							info.getIndex = (event, player) => {
								return player.hasSkillTag("horseEffectCount") ? 2 : 1;
							};
						} else if (typeof origin_getIndex === "function") {
							info.getIndex = function (event, player, triggername) {
								const result = origin_getIndex.call(this, event, player, triggername);
								if (player.hasSkillTag("horseEffectCount")) {
									if (Array.isArray(result)) {
										return [...result, ...result];
									} else if (typeof result === "number") {
										return result *= 2;
									}
								}
								return result;
							};
						}
					}
				}
			});
		},
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "changeSkillsAfter"],
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			if (event.name == "changeSkills") {
				return event.addSkill.includes("mjsbaimayicong");
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const cardList = Array.from(ui.cardPile.childNodes).flat()
				.filter(card => {
					const type = get.subtype(card);
					return type == "equip3" || type == "equip4" || type == "equip6";
				});
			if (!cardList.length) {
				return;
			}
			const cards = [];
			for (const card of cardList) {
				cards.push(game.createCard2(card.name, card.suit, card.number, card.nature));
			}
			if (cards.length) {
				await game.cardsGotoPile(cards, () => {
					return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
				});
			}
		},
		ai: {
			horseEffectCount: true,
		},
	},
	/**筑京自固
	 * 受伤，你获得1张坐骑牌。
	 * */
	mjszhujingzigu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		async content(event, trigger, player) {
			const card = get.cardPile(card => {
				const type = get.subtype(card);
				return type == "equip3" || type == "equip4" || type == "equip6";
			});
			if (card) {
				await player.gain(card, "draw");
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -0.85];
					}
					if (get.tag(card, "damage")) {
						return [1, 0.85];
					}
				},
			},
		},
	},
	//凌统
	/**纵马提刀
	 * 每回合限1次，出杀，获得并装备1张装备牌。
	 * 出杀，获得并装备1张装备牌。
	 * 出杀，获得并装备1张装备牌，并且出杀次数+1。
	 * */
	mjszongmatidao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "useCard",
		},
		usable: 1,
		forced: true,
		locked: false,
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			const card = get.cardPile(card => get.type(card) == "equip");
			if (card) {
				await player.gain(card, "draw");
				if (player.getCards("h").includes(card) && get.type(card, player) == "equip") {
					await player.chooseUseTarget(card, "nopopup", true);
				}
			}
		},
	},
	/**浴血奋威
	 * 出牌阶段限1次，你可以失去1点体力，获得2张杀，并且出杀次数+1。
	 * */
	mjsyuxuefenwei: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			await player.loseHp();
			const cards = [];
			while (cards.length < 2) {
				const card = get.cardPile(card => {
					if (cards.includes(card)) return false;
					return card.name == "sha";
				});
				if (card) {
					cards.push(card);
				} else {
					break;
				}
			}
			if (cards.length) {
				await player.gain(cards, "draw");
			}
			player.addTempSkill(event.name + "_effect");
			player.addMark(event.name + "_effect", 1, false);
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
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("mjsyuxuefenwei_effect");
						}
					},
				},
			},
		},
	},
	//项燕
	/**破秦锋锐
	 * 每个回合首次成为其他角色打出牌的目标时，获得2张杀，若此牌对你造成伤害，你进行1个出牌阶段。
	 * */
	mjspoqinfengrui: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			target: "useCardToTarget",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			const evt = event.getParent();
			return game
				.getGlobalHistory(
					"useCard",
					evt => {
						if (!evt.targets?.includes(player)) {
							return false;
						}
						return evt.player != player;
					},
					evt
				)
				.indexOf(evt) == 0;
		},
		async content(event, trigger, player) {
			const cards = [];
			while (cards.length <= 2) {
				const card = get.cardPile(card => {
					if (cards.includes(card)) return false;
					return card.name == "sha";
				});
				if (card) {
					cards.push(card);
				} else {
					break;
				}
			}
			if (cards.length) {
				await player.gain(cards, "draw");
			}
			trigger.player
				.when("useCardAfter")
				.filter(evt => evt.card == trigger.card)
				.then(async (event, trigger) => {
					if (player.hasHistory("damage", evt => evt.card == trigger.card)) {
						player.phaseUse();
					}
				});
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (game.hasGlobalHistory(
						"useCard",
						evt => {
							if (!evt.targets?.includes(player)) {
								return false;
							}
							return evt.player != player;
						},
					)) {
						return;
					}
					if (typeof card == "object" && player != target) {
						let eff = get.is.damageCard(card) ? 1.35 : 0.6;
						return [1, eff];
					}
				},
			},
		},
	},
	/**楚虽三户
	 * 阵亡，你可以令一名其他角色获得技能“破秦锋锐”，并且之后每回合的摸牌数+2。
	 * 阵亡，你可以将所有牌交给一名其他角色，令其获得技能“破秦锋锐”，并且之后每回合的摸牌数+2。
	 * */
	mjschusuisaihu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		derivation: "mjspoqinfengrui",
		trigger: {
			player: "die",
		},
		popup: false,
		silent: true,
		forced: true,
		forceDie: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const createSkills = mjs.addCreateSkills("mjspoqinfengrui");
			await target.addSkills(createSkills);
			lib.skill.mjsalldraw.change(player, 2);
			return;
			target.addTempSkill(event.name + "_effect");
			target.addMark(event.name + "_effect", 2, false);
		},
		subSkill: {
			effect: {
				trigger: {
					player: "phaseDrawBegin2",
				},
				silent: true,
				charlotte: true,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
			},
		},
	},
	//卢莫愁
	/**阳春白雪
	 * 每回合每种牌限1次，当你以其他角色为目标打出牌后，若此牌没有被其他角色抵消或响应，则你可以将此牌交给一名其他角色，此牌再次被打出时无法被抵消和响应。
	 * 当你以其他角色为目标打出牌后，若此牌没有被其他角色抵消或响应，则你可以将此牌交给一名其他角色，此牌再次被打出时无法被抵消和响应。
	 * */
	mjsyangchunbaixue: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		global: "mjsyangchunbaixue_global",
		trigger: {
			player: "useCardAfter",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			if (player.hasStorage("mjsyangchunbaixue_used", event.card.name)) {
				return false;
			}
			if (!event.cards.filterInD().length) {
				return false;
			}
			if (!event.targets?.length || event.targets.includes(player)) {
				return false;
			}
			return event.targets.every(target => {
				if (target == player) {
					return true;
				}
				if (game.hasGlobalHistory("everything", evt => {
					if (evt._neutralized || evt.responded && (!evt.result || !evt.result.bool)) {
						return evt.getParent() == event;
					}
				})) {
					return false;
				}
				return !["useCard", "respond"].some(evtx => {
					return target.hasHistory(evtx, evt => {
						return evt.respondTo && evt.respondTo[1] == event.card;
					});
				});
			});
		},
		async cost(event, trigger, player) {
			const cards = trigger.cards.filterInD();
			if (!cards.length) {
				return;
			}
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					let player = get.player();
					let att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					if (target.hasSkillTag("nogain")) {
						att /= 10;
					}
					return att / (1 + get.distance(player, target, "absolute"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			player.addTempSkill("mjsyangchunbaixue_used");
			player.markAuto("mjsyangchunbaixue_used", [trigger.card.name]);
			const cards = trigger.cards.filterInD();
			if (cards.length) {
				const gainEvent = target.gain(cards, "gain2");
				gainEvent.giver = player;
				await gainEvent;
				target.addGaintag(cards, "eternal_mjsyangchunbaixue_tag");
			}
		},
		subSkill: {
			tag: {
				name: "雪",
			},
			used: {
				charlotte: true,
				onremove: true,
			},
			global: {
				trigger: {
					player: "useCard",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (!game.hasPlayer(target => {
						return target.hasSkill("mjsyangchunbaixue");
					})) {
						return false;
					}
					return player.hasHistory("lose", evt => evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.includes("eternal_mjsyangchunbaixue_tag")));
				},
				async content(event, trigger, player) {
					player.removeGaintag("eternal_mjsyangchunbaixue_tag", trigger.cards);
					trigger.directHit.addArray(game.filterPlayer());
					game.log(trigger.card, "不可被响应");
				},
			},
		},
	},
	/**清音忘忧
	 * 当你交给其他角色手牌后，随机弃置其卜卦区中的1张牌，若其卜卦区中没有牌，每个回合限1次，你可以选择并添加任意1张牌到其手牌。
	 * 当你交给其他角色手牌后，随机弃置其卜卦区中的1张牌，若其卜卦区中没有牌，每个回合限2次，你可以选择并添加任意1张牌到其手牌。
	 * */
	mjsqingyinwangyou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsqingyinwangyou" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		silent: true,
		popup: true,
		locked: false,
		getIndex(event, player) {
			if (event.name !== "loseAsync") {
				return [event.player];
			} else {
				return game.filterPlayer(current => current != player && event.getg(current).length > 0).sortBySeat();
			}
		},
		filter(event, player, triggername, target) {
			if (!target.isIn()) {
				return false;
			}
			if (!target.hasDiscardableCards(player, "j") && player.hasSkill("mjsqingyinwangyou_used")) {
				return false;
			}
			if (event.giver !== player) {
				return false;
			}
			if (event.name === "gain") {
				return event.player != player && event.getg(target).length > 0;
			}
			return game.hasPlayer(current => current != player && event.getg(current).length > 0);
		},
		logTarget(event, player, triggername, target) {
			return target;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = target.getDiscardableCards(player, "j");
			if (cards.length) {
				player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
				await target.discard(cards.randomGets(1));
			}
			if (player.hasSkill(event.name + "_used")) {
				return;
			}
			const basic = mjs.getVCardList("basic").map(info => [info, get.translation(info[3] || "") + get.translation(info[2])]);
			const trick = mjs.getVCardList("trick").map(info => [info, get.translation(info[2])]);
			const equip = mjs.getVCardList("equip").map(info => [info, get.translation(info[2])]);
			const result = await player
				.chooseButton(
					[
						[[get.translation(event.name)], "addNewRow"],
						`<div><div style="width:100%;text-align:center">———— 行动牌 ————</div></div>`,
						[basic, "tdnodes"],
						`<div><div style="width:100%;text-align:center">———— 战法牌 ————</div></div>`,
						[trick, "tdnodes"],
						`<div><div style="width:100%;text-align:center">———— 装备牌 ————</div></div>`,
						[equip, "tdnodes"],
						[
							dialog => {
								dialog.css({
									top: get.is.phoneLayout() ? "5%" : "45%",
								});
								const buttons = dialog.content.querySelectorAll(".buttons");
								for (const button of buttons) {
									button.style.setProperty("text-align", "left", "important");
									button.style.setProperty("max-width", "800px", "important");
								}
								dialog.buttons.forEach(i => {
									i.setNodeIntro(get.translation(i.link[2]));
	                                i._customintro = function(uiintro, evt) {
										const card = i.link;
										uiintro.add(get.translation(card[3] || "") + get.translation(card[2]));
										uiintro.add([[card], "vcard"]);
										const name2 = card[2];
										if (lib.card[name2].cardPrompt) {
								            uiintro.add(`<div class="text" style="display:inline">${lib.card[name2].cardPrompt(i.link || i)}</div>`);
								        } else if (lib.translate[name2 + "_info"]) {
								        	uiintro.add(`<div class="text" style="display:inline">${lib.translate[name2 + "_info"]}</div>`);
								        }
									};
	                                i.style.setProperty("width", "100px", "important");
	                                i.style.setProperty("text-align", "left", "important");
	                            });
							},
							"handle",
						],
					],
				)
				.set("ai", button => {
					const { player, target } = get.event();
					const att = get.attitude(player, target);
					const eff = target.getUseValue({ name: button.link[2], nature: button.link[3] });
					if (att <= 0) {
						return 0;
					}
					return eff;
				})
				.set("target", target)
				.forResult();
			if (result.bool && result.links?.length) {
				player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
				player.addTempSkill(event.name + "_used");
				const card = game.createCard2(result.links[0][2], lib.suit.randomGet(), get.rand(1, 8));
				if (card) {
					await target.gain(card, "draw");
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	//桑弘羊
	/**盐铁官营
	 * 出牌阶段限1次，你可以查看一名其他角色的手牌，展示其中所有的♦/♣牌，令另外一名其他角色选择获得其中1张牌，然后交给你1张牌。
	 * */
	mjsyantieguanying: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(target => target != player) > 1;
		},
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			if (ui.selected.targets.length) {
				return true;
			}
			return target.countCards("h");
		},
		targetprompt: ["查看目标", "获得目标"],
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		async content(event, trigger, player) {
			const [target1, target2] = event.targets;
			await player.viewHandcards(target1);
			const cards = target1.getCards("h", card => ["diamond", "club"].includes(get.suit(card, target1)));
			if (!cards.length) {
				return;
			}
			await target1.showCards(cards);
			const result = await target2
				.chooseCardButton(get.translation(event.name), cards, true)
				.set("ai", button => {
					return get.value(button.link, get.player());
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				await target2.gain(result.links, "draw");
				if (target2.countCards("he")) {
					await target2.chooseToGive(player, "he", true);
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (!ui.selected.targets.length) {
						return -target.countCards("h", { suit: ["diamond", "club"] });
					} else {
						if (player.storage?.counttrigger?.mjssuanmingaomin) {
							return get.attitude(player, target);
						}
						return get.sgnAttitude(player, target);
					}
				},
			},
		},
	},
	/**均输平准
	 * 当你获得其他角色的牌时，你可以令这些牌的点数+1或-1（最小为1，最大为8），然后若这些牌的总点数等于你手牌中其他牌的总点数，你可以令一名角色获得1张你选择的花色或点数的牌。
	 * */
	mjsjunshupingzhun: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		silent: true,
		popup: true,
		forced: false,
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") return [];
			if (!event.getl || !event.getg) return [];
			const cards = event.getg(player);
			return game
				.filterPlayer(target => {
					if (target == player) return false;
					if (cards.length) {
						let evt = event.getl(target);
						if (evt?.cards2?.length && evt.cards2.some(card => cards.includes(card))) return true;
					}
					return false;
				})
				.sortBySeat();
		},
		async cost(event, trigger, player) {
			const cards = trigger.getg(player);
			const sum = player.getCards("h").removeArray(cards).reduce((sum, card) => sum + get.number(card, player), 0);
			const num = cards.reduce((sum, card) => sum + get.number(card, false), 0);
			const add = num + cards.filter(card => get.number(card, false) < 8).length,
				sub = num - cards.filter(card => get.number(card, false) > 1).length;
			const list = [`点数+1（${add}）`, `点数-1（${sub}）`];
			event.result = await player
				.chooseControl(list, "cancel2")
				.set("prompt", `###${get.prompt(event.skill)}###令这些牌的点数+1或-1，手牌点数（${sum}）`)
				.set("ai", () => _status.event.choice)
				.set(
					"choice",
					(function () {
						if (add == sum) {
							return 0;
						} else if (sub == sum) {
							return 1;
						}
						return get.rand(0, 2);
					})()
				)
				.forResult();
			if (event.result.control != "cancel2") {
				event.result.cost_data = (event.result.index == 0 ? 1 : -1);
			}
		},
		async content(event, trigger, player) {
			const cards = trigger.getg(player);
			const sum = player.getCards("h").removeArray(cards).reduce((sum, card) => sum + get.number(card, player), 0);
			for (const card of cards) {
				const num = get.number(card, false);
				if ((num <= 1 && event.cost_data == -1) || (num >= 8 && event.cost_data == 1)) continue;
				const number = num + event.cost_data;
				game.broadcastAll(function (card, number) {
					card.init([card.suit, number, card.name, card.nature]);
				}, card, number);
			}
			const num = cards.reduce((sum, card) => sum + get.number(card, player), 0);
			if (sum != num) {
				return;
			}
			const suits = lib.suit.map(suit => [suit, get.translation(suit)]);
			const nums = Array.from({ length: 8 }, (_, index) => index + 1).map(num => [num, num]);
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						get.translation(event.name),
						[
							suits,
							"tdnodes",
						],
						[
							nums,
							"tdnodes",
						],
						`<div><div style="width:100%;text-align:center">令一名角色获得1张你选择的花色或点数的牌</div></div>`,
						[
							dialog => {
								dialog.css({
									top: get.is.phoneLayout() ? "5%" : "45%",
								});
							},
							"handle",
						],
					],
					filterTarget: true,
					ai1(button) {
						return 1 + Math.random();
					},
					ai2(target) {
						const player = get.player();
						return get.attitude(player, target);
					},
				})
				.forResult();
			if (result?.bool && result.links?.length && result.targets?.length) {
				const link = result.links[0],
					target = result.targets[0];
				const card = get.cardPile(card => {
					if (typeof link == "number") {
						return get.number(card, false) == link;
					}
					return get.suit(card, false) == link;
				});
				if (card) {
					await target.gain(card, "draw");
				}
			}
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (card.name == "shunshou" || get.tag(card, "gain")) {
						return [1, 0.5];
					}
				},
			},
		},
	},
	/**算缗告缗
	 * 每个回合限1次，当有其他角色获得另外一名角色的牌后，你可以查看这些牌并获得其中1张。
	 * */
	mjssuanmingaomin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		usable: 1,
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") return [];
			if (!event.getl || !event.getg) return [];
			return game
				.filterPlayer(target => {
					return game.hasPlayer(current => {
						if (current == target) return false;
						let cards2 = event.getl(current).cards2;
						if (cards2.length) {
							let cards = event.getg(target);
							if (cards?.length && cards.containsSome(...cards2)) return true;
						}
						return false;
					});
				})
				.sortBySeat();
		},
		filter(event, player, triggername, target) {
			return target?.isIn() && target != player;
		},
		check(event, player, triggername, target) {
			return get.attitude(player, target) <= 0;
		},
		logTarget(event, player, triggername, target) {
			return target;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = trigger.getg(target);
			if (!cards.length) {
				return;
			}
			const result = await player
				.chooseCardButton(get.translation(event.name), cards, true)
				.set("ai", button => {
					return get.value(button.link, get.player());
				})
				.forResult();
			if (result.bool && result.links?.length) {
				await player.gain(result.links);
			}
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (target.storage?.counttrigger?.mjssuanmingaomin) {
						return;
					}
					if (card.name == "shunshou" || get.tag(card, "gain")) {
						return [0.85, 0.5];
					}
				},
			},
		},
	},
	//张宝
	/**三十六方
	 * 出牌阶段限1次，你可以弃置至少1张牌，然后令一名其他角色弃置等量的牌，因此弃置的牌的总点数每累计36点，你可以对一名角色造成2点雷电伤害。
	 * */
	mjssanshiliufang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjssanshiliufang" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCards("he", card => lib.filter.cardDiscardable(card, player, "mjssanshiliufang"));
		},
		position: "he",
		filterCard: lib.filter.cardDiscardable,
		check(card) {
			return 6 - get.value(card);
		},
		filterTarget: lib.filter.notMe,
		selectCard: [1, Infinity],
		allowChooseAll: true,
		async content(event, trigger, player) {
			//by萌新转型中，感谢萌喵！
			const target = event.targets[0];
			player.addMark(
				event.name,
				event.cards.reduce((sum, card) => sum + get.number(card, player), 0),
				false
			);
			const result = await target.chooseToDiscard("he", event.cards.length, true).forResult();
			if (result?.bool && result.cards?.length) {
				player.addMark(
					event.name,
					result.cards.reduce((sum, card) => sum + get.number(card, target), 0),
					false
				);
			}
			while (player.countMark(event.name) >= 36) {
				const result = await player
					.chooseTarget(get.prompt(event.name), "你可以对一名角色造成2点雷电伤害")
					.set("ai", target => {
						const player = get.player();
						return get.damageEffect(target, player, player, "thunder") * 2;
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					const [target] = result.targets;
					player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
					player.removeMark(event.name, 36, false);
					await target.damage(2, "thunder");
				} else {
					break;
				}
			}
		},
		ai: {
			order(item, player) {
				if (player.hasCard(i => get.value(i) > Math.max(6, 9 - player.hp), "he")) {
					return 1;
				}
				return 10;
			},
			result: {
				target(player, target) {
					return get.effect(target, { name: "guohe_copy2" }, player);
				},
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg && arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat().skill.rezhiheng && player.hasCard(card => get.name(card) !== "tao", "h");
				}
			},
		},
		marktext: "⚡",
		intro: {
			content: "已累计点数#",
		},
	},
	/**黄天妖法
	 * 当你获得杀时，你将其转化为雷杀（♦4）。当有角色受到雷电伤害时，你摸1张牌。
	 * */
	mjshuangtianyaofa: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjshuangtianyaofa" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			global: "damageEnd",
		},
		silent: true,
		popup: false,
		forced: true,
		locked: false,
		filter(event, player) {
			return event.hasNature("thunder");
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
			await player.draw();
		},
		group: "mjshuangtianyaofa_init",
		subSkill: {
			init: {
				trigger: {
					player: "gainAfter",
					global: ["gameDrawAfter", "loseAsyncAfter"],
				},
				silent: true,
				silent: true,
				filter(event, player) {
					if (event.name == "gameDraw") {
						return player.countCards("h", { name: "sha" });
					}
					return event.getg && event.getg(player)?.some(card => get.name(card, false) == "sha");
				},
				async content(event, trigger, player) {
					player.logSkill("mjshuangtianyaofa", null, null, null, [get.rand(1, 2)]);
					const cards = (trigger?.getg?.(player) ?? player.getCards("h")).filter(card => get.name(card, false) == "sha");
					for (const card of cards) {
						game.broadcastAll(function (card) {
							card.init(["diamond", 4, "leisha"]);
						}, card);
					}
				},
			},
		},
	},
	//张梁
	/**神力一击
	 * 当有角色弃置♦牌后，你可以将1张牌转化为雷杀（♦4），并且你对目标角色打出的下1张雷杀的伤害+1。
	 * */
	mjsshenliyiji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		onremove(player, skill) {
			player.removeSkill(skill + "_effect");
		},
		trigger: {
			global: ["loseAfter", "loseAsyncAfter"],
		},
		silent: true,
		popup: false,
		forced: false,
		locked: false,
		getIndex(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return [];
			}
			return game
				.filterPlayer(target => {
					return event.getl?.(target)?.cards2?.some(card => get.suit(card, target) == "diamond");
				})
				.sortBySeat();
		},
		filter(event, player, triggername, target) {
			return target?.isIn();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), [0, 1], "he")
				.set("ai", card => {
					if (card.name == "sha" && !game.hasNature(card, "thunder")) {
						return 20;
					}
					return 4 - get.value(card);
				})
				.forResult();
			event.result.bool = true;
		},
		async content(event, trigger, player) {
			//by萌新转型中，感谢萌喵！
			if (event.cards?.length) {
				player.logSkill(event.name);
				const card = event.cards[0];
				const bool = get.position(card) == "e";
				if (bool) {
					player.removeEquipTrigger(card.card || card);
				}
				game.broadcastAll(function (card) {
					card.init(["diamond", 4, "leisha"]);
				}, card);
				if (bool) {
					await player.gain(card, "gain2");
				}
			}
			player.addSkill(event.name + "_effect");
			player.addMark(event.name + "_effect", 1, false);
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard",
				},
				silent: true,
				popup: true,
				forced: true,
				locked: false,
				onremove: true,
				filter(event, player) {
					return event.card.name == "sha" && event.targets?.length && game.hasNature(event.card, "thunder");
				},
				async content(event, trigger, player) {
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					trigger.baseDamage += num;
				},
				mark: true,
				marktext: "⚡",
				intro: {
					content: "你对目标角色打出的下1张雷杀的伤害+#",
				},
			},
		},
	},
	/**黄天精勇
	 * 出牌阶段限1次，你可以弃置1张♦牌，若场上存活角色少于8名，且不存在因此召唤的黄巾兵，则召唤一名黄巾兵，否则令所有黄巾势力的角色增加1点体力上限。
	 * */
	mjshuangtianjingyong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init: () => {
			game.broadcastAll(() => {
				if (!lib.characterSubstitute.mjs_huangjinbing) {
					lib.characterSubstitute.mjs_huangjinbing = [
						["mjs_huangjinbing2", ["ext:名将杀/image/character/full/mjs_huangjinbing2.jpg"]],
						["mjs_huangjinbing3", ["ext:名将杀/image/character/full/mjs_huangjinbing3.jpg"]],
					];
					lib.translate.mjshuangtianjingyong_identity = " ";
					lib.translate.mjshuangtianjingyong_identity2 = "召唤物";
				}
			});
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCards("he", card => lib.skill.mjshuangtianjingyong.filterCard(card, player));
		},
		filterCard(card, player) {
			return get.suit(card) === "diamond" && lib.filter.cardDiscardable(card, player);
		},
		position: "he",
		check(card) {
			const player = get.event().player;
			if (!player) {
				return 0;
			}
			if (game.countPlayer() < 8) {
				return 8 - get.value(card);
			}
			const hasFriend = game.hasPlayer(target => {
				return get.attitude(player, target) > 0 && target.group == "huangjin";
			});
			if (hasFriend) {
				return 6 - get.value(card);
			}
			return 4 - get.value(card);
		},
		async content(event, trigger, player) {
			//感谢萌喵（by萌新转型中）
			if (game.countPlayer() < 8 && !player.storage[event.name]?.isAlive()) {
				let target;
				if (game.dead.length) {
					target = [...game.dead].sort((a, b) => get.distance(player, a, "absolute") - get.distance(player, b, "absolute"))[0];
					target.uninit();
					target.init("mjs_huangjinbing");
					target.revive(1, false);
				} else {
					let begin = player;
					if (player.getSeatNum() !== 0) {
						begin = game.filterPlayer2().sort((a, b) => a.getSeatNum() - b.getSeatNum())[0];
					}
					target = await game.addPlayerOL(begin, "mjs_huangjinbing", null);
				}
				if (get.itemtype(target) != "player") {
					return;
				}
				player.addSkill(event.name + "_clear");
				player.setStorage(event.name, target);
				game.broadcastAll(
					(player, target) => {
						target["zombieshibian"] = player;
						target.identity = "mjshuangtianjingyong_identity";
						const bgImage = player.node?.avatar?.style?.backgroundImage;
						if (bgImage) {
							const matches = bgImage.matchAll(/url\(["']?([^"')]+)["']?\)/g);
							let onload = false;
							for (const match of matches) {
								const src = match[1];
								if (match[1]) {
									const testImg = new Image();
									testImg.onload = function () {
										if (onload) return;
										onload = true;
										const node = target.node.identity.firstChild;
										node.innerHTML = "";
										node.style.width = "30px";
										node.style.height = "30px";
										node.style.backgroundImage = `url(${src})`;
										node.style.backgroundSize = "200% auto";
										node.style.backgroundPosition = "50% 10%";
										node.style.borderRadius = "50%";
									};
									testImg.src = src;
									if (onload) break;
								}
							}
						}
						if (target.ai) {
							target.ai.identity_mark = "finished";
							if (typeof player.ai?.shown === "number") {
								target.ai.shown = player.ai.shown;
							}
						}
						if (typeof player.side == "boolean") {
							target.side = player.side;
						}
						target.ai.modAttitudeFrom = function (from, to) {
							if (to == from["zombieshibian"]) {
								return 114514;
							}
							return get.attitude(from["zombieshibian"] || from, to["zombieshibian"] || to);
						};
						target.ai.modAttitudeTo = function (from, to, att) {
							if (from == to["zombieshibian"]) {
								return 7;
							}
							return get.attitude(from["zombieshibian"] || from, to["zombieshibian"] || to);
						};
						target.updates ??= [];
						target.updates.push(function (player) {
							const num = player.maxHp;
							player.changeSkin({ characterName: "mjs_huangjinbing" }, "mjs_huangjinbing" + (num <= 2 ? "" : num >= 7 ? "3" : "2"));
						});
						if (_status._zombieshibian) {
							return;
						}
						_status.zombieshibian = true;
						//检测游戏胜负
						if (typeof game.checkResult === "function") {
							const origin_checkResult = game.checkResult;
							game.checkResult = function () {
								if (_status.event?.name === "die" && _status.event.player?.zombieshibian) {
									return;
								}
								const player = game.me._trueMe || game.me;
								if (game.players.filter(i => i !== player).every(i => i["zombieshibian"] === (player["zombieshibian"] || player))) {
									game.over(true);
								}
								return origin_checkResult.apply(this, arguments);
							};
						}
						if (typeof game.checkOnlineResult === "function") {
							const origin_checkOnlineResult = game.checkOnlineResult;
							game.checkOnlineResult = function (player) {
								if (_status.event?.name === "die" && _status.event.player?.zombieshibian) {
									return;
								}
								if (game.players.filter(i => i !== player).every(i => i["zombieshibian"] === (player["zombieshibian"] || player))) {
									return true;
								}
								return origin_checkOnlineResult.apply(this, arguments);
							};
						}
						/*/检测态度
						if (typeof get.attitude === "function") {
							const origin_attitude = get.attitude;
							get.attitude = function (from, to) {
								if ((from["zombieshibian"] || from) === (to["zombieshibian"] || to)) {
									return 114514;
								}
								return origin_attitude.apply(this, arguments);
							};
						}
						if (typeof get.rawAttitude === "function") {
							const origin_rawAttitude = get.rawAttitude;
							get.rawAttitude = function (from, to) {
								if ((from["zombieshibian"] || from) === (to["zombieshibian"] || to)) {
									return 114514;
								}
								return origin_rawAttitude.apply(this, arguments);
							};
						}*/
						//敌友判定
						//实际上只是友方，敌方不用写
						if (typeof lib.element.player.getFriends === "function") {
							const origin_getFriends = lib.element.player.getFriends;
							const getFriends = function (func, includeDie) {
								const player = this;
								return [...origin_getFriends.apply(this, arguments), ...game[includeDie ? "filterPlayer2" : "filterPlayer"](target => (target["zombieshibian"] || target) === (player["zombieshibian"] || player))]
									.filter(i => i !== player || func === true)
									.unique()
									.sortBySeat(player);
							};
							lib.element.player.getFriends = getFriends;
							[...game.players, ...game.dead].forEach(i => (i.getFriends = getFriends));
						}
						if (typeof lib.element.player.isFriendOf === "function") {
							const origin_isFriendOf = lib.element.player.isFriendOf;
							const isFriendOf = function (player) {
								if ((this["zombieshibian"] || this) === (player["zombieshibian"] || player)) {
									return true;
								}
								return origin_isFriendOf.apply(this, arguments);
							};
							lib.element.player.isFriendOf = isFriendOf;
							[...game.players, ...game.dead].forEach(i => (i.isFriendOf = isFriendOf));
						}
						if (typeof lib.element.player.getEnemies === "function") {
							const origin_getEnemies = lib.element.player.getEnemies;
							const getEnemies = function (func, includeDie) {
								if (this["zombieshibian"]) {
									return this["zombieshibian"].getEnemies(func, includeDie);
								} else {
									const player = this;
									return [
										...origin_getEnemies.apply(this, arguments),
										...game[includeDie ? "filterPlayer2" : "filterPlayer"](target => {
											return origin_getEnemies.apply(this, arguments).includes(target["zombieshibian"] || target);
										}),
									]
										.filter(i => player != (i["zombieshibian"] || i))
										.unique()
										.sortBySeat(player);
								}
							};
							lib.element.player.getEnemies = getEnemies;
							[...game.players, ...game.dead].forEach(i => (i.getEnemies = getEnemies));
						}
					},
					player,
					target
				);
				target.directgain(get.cards(4));
				const next = game.createEvent("enterGame");
				next.player = target;
				next.setContent("emptyEvent");
				await next;
			} else {
				const targets = game.filterPlayer(target => target.group == "huangjin");
				const func = async target => {
					await target.gainMaxHp();
				};
				await game.doAsyncInOrder(event.targets, func);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return 1;
				},
			},
		},
		subSkill: {
			clear: {
				trigger: {
					player: "die",
				},
				silent: true,
				charlotte: true,
				filter(event, player) {
					const target = player.storage.mjshuangtianjingyong;
					return get.itemtype(target) == "player" && target?.isIn();
				},
				async content(event, trigger, player) {
					const target = player.storage.mjshuangtianjingyong;
					await target.die();
				},
			},
		},
	},
	//黄巾兵
	/**黄天当立
	 * 登场，卜卦，你的体力上限与手牌上限之和等于卜卦牌点数，并随机分配。
	 * 黄巾兵随机分配的体力上限最低为1。
	 * */
	mjshuangtiandangli: {
		nobracket: true,
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "changeSkillsAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "changeSkills") {
				return event.addSkill.includes("mjshuangtiandangli");
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const next = player.judge(card => {
				if (get.number(card) == 0) {
					return 16;
				}
				return get.number(card);
			});
			const result = await next.forResult();
			const num = result.number;
			if (typeof result.number != "number") {
				result.number = 0;
			}
			let hp, hs;
			if (result.number == 0) {
				hp = 8;
				hs = 8;
			} else {
				hp = get.rand(1, num);
				hs = num - hp;
			}
			player.maxHp = hp;
			player.hp = hp;
			player.addSkill("mjshuangtiandangli_max");
			player.setStorage("mjshuangtiandangli_max", hs);
			game.log(player, "体力上限设置为", "#y" + hp);
			game.log(player, "手牌上限设置为", "#y" + hs);
			player.update();
			player.chat("苍天已死，黄天当立！");
		},
		subSkill: {
			max: {
				charlotte: true,
				mod: {
					maxHandcardFinal(player, num) {
						const info = player.storage?.mjshuangtiandangli_max;
						if (typeof info !== "number") return;
						return info;
					},
				},
			},
		},
	},
	//尉缭
	/**挟义而战
	 * 当有角色受伤时，你可以选择查看并增强其1张手牌。
	 * 当有角色受伤时，你可以选择增强其1张手牌。
	 * */
	mjsxieyierzhan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "damageEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return event.player.isIn() && event.player.hasCards("h", card => lib.filter.canBeStrengthened(card, event.player, "mjsxieyierzhan"));
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			const cards = target.getCards("h", card => {
				return lib.filter.canBeStrengthened(card, target, event.name);
			});
			if (!cards.length) {
				return;
			}
			const result = await player
				.choosePlayerCard(target, "h", true, "visible")
				.set("prompt", get.translation(event.name))
				.set("ai", button => {
					const player = get.player();
					const att = get.attitude(player, get.owner(button.link));
					if (att == 0) return 0;
					if (button.link?.storage?.mjsstrengthen) return 0;
					return get.value(button.link);
				})
				.forResult();
			if (result?.links?.length) {
				await target.mjsStrengthenCards(result.links, player);
			}
		},
	},
	/**天官兵谈
	 * 你无法卜卦；其他角色卜卦后，你获得1张♣牌。
	 * */
	mjstianguanbingtan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjstianguanbingtan" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			player: "judgeFixing",
			global: "judgeEnd",
		},
		silent: true,
		locked: false,
		filter(event, player, name) {
			return name == "judgeFixing" || event.player != player;
		},
		async content(event, trigger, player) {
			if (event.triggername == "judgeFixing") {
				player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
				var evt = trigger.getParent();
				if (evt.name == "phaseJudge") {
					evt.excluded = true;
				} else {
					evt.finish();
					evt._triggered = null;
					if (evt.name.startsWith("pre_")) {
						var evtx = evt.getParent();
						evtx.finish();
						evtx._triggered = null;
					}
					var nexts = trigger.next.slice();
					for (var next of nexts) {
						if (next.name == "judgeCallback") {
							trigger.next.remove(next);
						}
					}
					var evts = game.getGlobalHistory("cardMove", function (evt) {
						return evt.getParent(2) == trigger.getParent();
					});
					var cards = [];
					for (var i = evts.length - 1; i >= 0; i--) {
						var evt = evts[i];
						for (var card of evt.cards) {
							if (get.position(card, true) == "o") {
								cards.push(card);
							}
						}
					}
					trigger.orderingCards.addArray(cards);
				}
			} else {
				player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
				const card = get.cardPile(card => get.suit(card) == "club");
				if (card) {
					await player.gain(card, "draw2");
				}
			}
		},
		ai: {
			nojudge: true,
			effect: {
	            target(card, player, target) {
	              	if (get.type(card) == "delay") {
	                	return [1, 0.35];
	              	}
	            },
	        },
		},
	},
	/**战威攻权
	 * 当你打出增强牌时，可以弃置一名其他角色任意区域的1张牌。
	 * */
	mjszhanweigongquan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["useCard", "respond"],
		},
		silent: true,
		forced: false,
		filter(event, player) {
			return event.card.isCard && event.card?.storage?.mjsstrengthen;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countDiscardableCards(player, "hej") > 0;
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			await player.discardPlayerCard(target, "hej", true);
		},
	},
	//白起
	/**料敌合变
	 * 当其他角色失去最后的手牌后，你可以立即对其打出1张杀。
	 * */
	mjsliaodihebian: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		audioname: ["mjs_baiqi_cangsunpoqiong"],
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		direct: true,
		getIndex(event, player) {
			return game.filterPlayer(function (target) {
				if (target == player || target.countCards("h")) {
					return false;
				}
				return event?.getl?.(target)?.hs?.length;
			});
		},
		filter(event, player, triggername, target) {
			return target?.isIn() && lib.filter.targetEnabled({ name: "sha" }, player, target) && (player.hasSha() || (_status.connectMode && player.countCards("h") > 0));
		},
		logTarget(event, player, triggername, target) {
			return target;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					`${get.translation(event.name)}：是否对${get.translation(get.translation(target))}使用一张杀？`
				)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("complexSelect", true)
				.set("sourcex", target)
				.set("logSkill", event.name);
		},
	},
	/**出奇无穷
	 * 每个回合限1次，当你在回合外需要打出行动牌时，可以将任意1张手牌当作要打出的牌打出，然后获得1张杀。
	 * 每个回合限1次，当你在回合外需要打出牌时，可以将任意1张手牌当作要打出的牌打出，然后获得1张杀。
	 * 每个回合限1次，当你在回合外需要打出牌时，可以将任意1张手牌当作要打出的牌打出，然后获得1张要打出的牌。
	 * */
	mjschuqiwuqiong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		audioname: ["mjs_baiqi_cangsunpoqiong"],
		enable: ["chooseToUse", "chooseToRespond"],
		usable: 1,
		filter(event, player) {
			if (_status.currentPhase == player || !player.countCards("h")) {
				return false;
			}
			return get
				.inpileVCardList(info => {
					const name = info[2],
						nature = info[3];
					return !nature && ["basic"].includes(get.type2(name));
				})
				.some(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
		},
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => {
						const name = info[2],
							nature = info[3];
						return !nature && ["basic"].includes(get.type2(name));
					})
					.filter(card => event.filterCard(get.autoViewAs({ name: card[2] }, "unsure"), player, event));
				const dialog = ui.create.dialog("出奇无穷", [list, "vcard"]);
				dialog.direct = true;
				return dialog;
			},
			check(button) {
				const player = get.player();
				return player.getUseValue({ name: button.link[2] }) + 1;
			},
			backup(links, player) {
				return {
					viewAs: { name: links[0][2] },
					filterCard: true,
					ai1(card) {
						const name = get.card().name;
						if (card.name == name) {
							return 0;
						}
						return 8 - get.value(card);
					},
					popname: true,
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("mjschuqiwuqiong");
						player
							.when(["useCard", "respond"])
							.filter(evt => evt.skill == "mjschuqiwuqiong_backup")
							.then(async (event, trigger, player) => {
								const card = get.cardPile("sha");
								if (card) {
									await player.gain(card);
								}
							});
					},
				};
			},
			prompt(links, player) {
				return "将一张手牌当作" + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (player.getStat().skill.mjschuqiwuqiong) return false;
			if (_status.currentPhase == player || !player.countCards("h")) {
				return false;
			}
			return ["basic"].includes(get.type2(name));
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (player.getStat().skill.mjschuqiwuqiong) return false;
				if (_status.currentPhase == player || !player.countCards("h")) {
					return false;
				}
			},
			order: 7,
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
	/**歼灭
	 * 出杀/杀伤，可以销毁一名其他角色任意区域的1张牌。
	 * */
	mjsjianmie: {
		audio: "ext:名将杀/audio/skill:2",
		audioname: ["mjs_baiqi_cangsunpoqiong"],
		trigger: {
			player: "useCard",
			source: "damageSource",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			return event.card?.name == "sha";
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(target => {
				return target != player && target.countCards("hej", cardx => lib.filter.cardDestuctible(cardx, target, event.skill));
			});
			if (!targets.length) {
				return;
			}
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countCards("hej", cardx => lib.filter.cardDestuctible(cardx, target, event.skill));
				})
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			if (!target.countCards("hej", card => lib.filter.cardDestuctible(card, target, event.name))) {
				return;
			}
			const result = await player
				.choosePlayerCard(target, "hej", true)
				.set("filterButton", button => {
					return lib.filter.cardDestuctible(button.link, get.owner(button.link), event.name);
				})
				.set("prompt", get.translation(event.name))
				.set("prompt2", `选择销毁${get.translation(target)}区域内的1张牌`)
				.set("ai", button => {
					return get.value(button.link);
				})
				.forResult();
			if (result?.cards?.length) {
				const cards = result.cards;
				game.log(cards, "被销毁了");
				await target.lose(cards, "toDestroy", ui.special);
			}
		},
	},
	//李信
	/**果势壮勇
	 * 当你造成伤害后，若你的体力值不满，则你回复1点体力；当你即将造成伤害时，若你的体力值满，你可以令此伤害+1。
	 * 当你造成伤害后，若你的体力值不满，则你回复1点体力；每个回合限1次，当你即将造成伤害时，若你的体力值满，你可以令此伤害+1。
	 * */
	mjsguoshizhuangyong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		logAudio: index => "ext:名将杀/audio/skill/mjsguoshizhuangyong" + (typeof index === "number" ? index : get.rand(1, 2)) + ".mp3",
		trigger: {
			source: ["damageSource", "damageBegin1"],
		},
		silent: true,
		locked: false,
		filter(event, player, name) {
			return player[name == "damageSource" ? "isDamaged" : "isHealthy"]();
		},
		async content(event, trigger, player) {
			player.logSkill("mjsguoshizhuangyong", null, null, null, [event.triggername == "damageSource" ? 1 : 2]);
			if (event.triggername == "damageSource") {
				await player.recover();
			} else {
				trigger.num++;
				game.log(player, "造成的伤害", "#y+1");
			}
		},
		//group: ["mjsguoshizhuangyong_damaged", "mjsguoshizhuangyong_healthy"],
		subSkill: {
			damaged: {
				trigger: {
					source: "damageSource",
				},
				silent: true,
				locked: false,
				filter(event, player) {
					return player.isDamaged();
				},
				async content(event, trigger, player) {
					player.logSkill("mjsguoshizhuangyong", null, null, null, [1]);
					player.recover();
				},
			},
			healthy: {
				trigger: {
					source: "damageBegin1",
				},
				usable: 1,
				silent: true,
				locked: false,
				filter(event, player) {
					return player.isHealthy();
				},
				check(event, player) {
					return (
						get.attitude(player, event.player) < 0 &&
						!event.player.hasSkillTag("filterDamage", null, {
							player: player,
							card: event.card,
						})
					);
				},
				async content(event, trigger, player) {
					player.logSkill("mjsguoshizhuangyong", null, null, null, [2]);
					trigger.num++;
					game.log(player, "造成的伤害", "#y+1");
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**衍水追锋
	 * 你可以弃置1张牌，出杀次数+1，然后令此技能需要弃置的牌数改为2直到当前回合结束。击杀，你本回合每打出过1张杀，就可以摸2张牌，然后此技能本回合无效。
	 * 你可以弃置1张牌，出杀次数+1，然后令此技能需要弃置的牌数+1直到当前回合结束。击杀，你本回合每打出过1张杀，就可以摸2张牌，然后此技能本回合无效。
	 * */
	mjsyanshuizhuifeng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio(event, player, name, indexedData, costResult) {
			if (event.name == "useSkill") {
				return "ext:名将杀/audio/skill/mjsyanshuizhuifeng" + get.rand(1, 2) + ".mp3";
			}
			return "ext:名将杀/audio/skill/mjsyanshuizhuifeng" + get.rand(3, 4) + ".mp3";
		},
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", card => lib.skill.mjsyanshuizhuifeng.filterCard(card, player, event)) >= lib.skill.mjsyanshuizhuifeng.selectCard();
		},
		filterCard(card, player, event) {
			event = event || _status.event;
			if (typeof event != "string") {
				event = event.getParent().name;
			}
			var mod = game.checkMod(card, player, event, "unchanged", "cardDiscardable", player);
			if (mod != "unchanged") {
				return mod;
			}
			return true;
		},
		selectCard() {
			return get.player().hasSkill("mjsyanshuizhuifeng_sha") ? 2 : 1;
		},
		check(card) {
			let player = get.player();
			let val = 6;
			let cards = ui.selected.cards.slice().add(card);
			cards.forEach(card => {
				card.classList.add("removing");
			});
			try {
				if (!player.hasSha()) val = 0;
			} catch (e) {
				cards.forEach(card => {
					card.classList.remove("removing");
				});
			}
			cards.forEach(card => {
				card.classList.remove("removing");
			});
			return val - get.value(card);
		},
		async content(event, trigger, player) {
			player.addTempSkill("mjsyanshuizhuifeng_sha");
			player.addMark("mjsyanshuizhuifeng_sha", 1, false);
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) - 0.1;
			},
			result: {
				player(player) {
					if (!player.hasSha()) {
						return 0;
					}
					return player.hasValueTarget({ name: "sha" });
				},
			},
		},
		group: "mjsyanshuizhuifeng_use",
		subSkill: {
			use: {
				audio: ["ext:名将杀/audio/skill/mjsyanshuizhuifeng3.mp3", "ext:名将杀/audio/skill/mjsyanshuizhuifeng4.mp3"],
				trigger: {
					source: "dieAfter",
				},
				silent: true,
				forced: false,
				popup: true,
				filter(event, player) {
					return player.hasHistory("useCard", evt => evt.card.name == "sha");
				},
				prompt2(event, player) {
					const num = 2 * player.getHistory("useCard", evt => evt.card.name == "sha").length;
					return `你可以摸${num}张牌，然后令${get.poptip("mjsyanshuizhuifeng")}本回合无效。`;
				},
				async content(event, trigger, player) {
					const num = 2 * player.getHistory("useCard", evt => evt.card.name == "sha").length;
					if (num > 0) {
						await player.draw(num);
					}
					player.tempBanSkill("mjsyanshuizhuifeng");
				},
			},
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjsyanshuizhuifeng_sha");
					},
				},
			},
		},
	},
	//祝融夫人
	/**赤黎飞刃
	 * 当你打出的牌被响应时，你可以将1张牌转化为杀对其打出，并获得对应花色的效果。
	 * 当你的杀被抵消时，你可以将1张牌转化为杀对其打出，此杀获得对应花色的效果。
	 * 当你的杀被抵消时，你可以将1张牌当作杀对其打出，此杀获得对应花色的效果。
	 * 金（♦️）：贯穿。
	 * 木（♣️）：杀伤，中毒+1。
	 * 水（♠️）：杀伤，随机获得目标1张牌。
	 * 火（♥）：杀伤，随机烧毁目标1张牌。
	 * 土（☯）：此杀伤害+1。
	 * */
	mjschilifeiren: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		derivation: "mjschilifeiren_faq",
		init(player, skill) {
			const suits = mjs.suits.slice();
			for (const suit of suits) {
				game.addTempTag(`${skill}_${suit}`, lib.skill[`${skill}_${suit}`].name);
			}
		},
		trigger: {
			//player: ["shaMiss", "eventNeutralized"],
			global: ["useCard","respond"],
		},
		silent: true,
		locked: false,
		filter(event, player) {
			/*if (event.type !== "card" || event.card.name !== "sha" || !event.target.isIn()) {
				return false;
			}*/
			if (!event.respondTo || !Array.isArray(event.respondTo)) {
	            return false;
	        }
	        if (player != event.respondTo[0]) {
	            return false;
	        }
	        if (!lib.filter.targetEnabled({ name: "sha" }, player, event.player)) {
	        	return false;
	        }
			return player.hasCards("he", card => {
				if (_status.connectMode && get.position(card) === "h") {
					return true;
				}
				return true;
			});
		},
		async content(event, trigger, player) {
			const suits = mjs.suits.slice();
	        for (const suit of suits) {
	            const cards = player.getCards("he", { suit: suit });
	            if (cards.length) {
	                player.addGaintag(cards, `${event.name}_${suit}`);
	            }
	        }
			const next = player.chooseToUse();
			next.set("openskilldialog", get.prompt2(event.name, trigger.player));
			next.set("norestore", true);
			next.set("_backupevent", `${event.name}_backup`);
			next.set("custom", {
				add: {},
				replace: { window: function () { } },
			});
			next.backup(`${event.name}_backup`);
			next.set("targetRequired", true);
			next.set("complexSelect", true);
			next.set("filterTarget", function (card, player, target) {
				if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
				return lib.filter.targetEnabled.apply(this, arguments);
			});
			next.set("sourcex", trigger.player);
			next.set("addCount", false);
			next.set("logSkill", event.name);
			await next;
			player.getCards("h").forEach(card => {
	            let tags = card.gaintag?.filter(tag => tag.startsWith(event.name));
	            tags.forEach(tag => {
	                player.removeGaintag(tag, card);
	            });
	        });
		},
		subSkill: {
			backup: {
				viewAs: {
					name: "sha",
				},
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "he",
				check(card) {
					var eff = 6;
					switch (get.suit(card)) {
						case "spade": {
							eff += 1.2;
						}
						break;
						case "heart": {
							eff += 2;
						}
						break;
					}
					return eff - get.value(card);
				},
				log: false,
				async precontent(event, trigger, player) {
					const cards = event.result.cards;
					const name = event.result.card.name;
					for (const card of cards) {
						game.broadcastAll(
							function (card) {
								card.init([card.suit, card.number, name]);
								//card.addGaintag("eternal_mjschilifeiren_converted");
							},
							card,
							name
						);
					}
					const card = cards[0],
						suit = get.suit(card),
						number = get.number(card);
					event.result.card = get.autoViewAs(card, [card]);
					if (suit == "heart") {
						game.setNature(event.result.card, "fire");
					} else if (suit == "diamond" && number == 4) {
						game.setNature(event.result.card, "thunder");
					}
					if (!mjs.suits.includes(suit)) {
						return;
					}
					const skill = `mjschilifeiren_${suit}`;
					event.result.card.storage ??= {};
					event.result.card.storage[skill] = true;
					player.addTempSkill(skill);
				},
			},
			converted: {
				name: "转化",
			},
			diamond: {
				name: "贯穿",
				description: "贯穿",
				trigger: {
					player: "useCardToPlayer",
				},
				nopop: true,
				silent: true,
				popup: true,
				charlotte: true,
				filter(event, player) {
					return event.card?.storage?.mjschilifeiren_diamond;
				},
				async content(event, trigger, player) {
					const target = trigger.target,
						card = trigger.card;
					target.addTempSkill("qinggang2");
					target.storage.qinggang2.add(card);
					game.log(card, "无视防具");
				},
			},
			club: {
				name: "中毒",
				description: "杀伤，中毒+1",
				trigger: {
					source: "damageSource",
				},
				nopop: true,
				silent: true,
				popup: true,
				charlotte: true,
				filter(event, player) {
					return event?.card?.storage?.mjschilifeiren_club;
				},
				async content(event, trigger, player) {
					trigger.player.addSkill("mjs_debuff_zhongdu");
					trigger.player.addMark("mjs_debuff_zhongdu", 1, false);
				},
			},
			spade: {
				name: "夺牌",
				description: "杀伤，随机获得目标1张牌",
				trigger: {
					source: "damageSource",
				},
				nopop: true,
				silent: true,
				popup: true,
				charlotte: true,
				filter(event, player) {
					return event?.card?.storage?.mjschilifeiren_spade;
				},
				async content(event, trigger, player) {
					const cards = trigger.player.getGainableCards(player, trigger.player == player ? "h" : "he");
					if (cards.length) {
						await player.gain(cards.randomGets(1), trigger.player, "giveAuto", "bySelf");
					}
				},
			},
			heart: {
				name: "烧毁",
				description: "杀伤，随机烧毁目标1张牌",
				trigger: {
					source: "damageSource",
				},
				nopop: true,
				silent: true,
				popup: true,
				charlotte: true,
				filter(event, player) {
					return event?.card?.storage?.mjschilifeiren_heart;
				},
				async content(event, trigger, player) {
					const cards = trigger.player
						.getCards("he", card => {
							return lib.filter.cardCombustible(card, trigger.player, "mjschilifeiren_heart");
						})
						.randomGets(1);
					if (cards.length) {
						await trigger.player.lose(cards, "toBurnDown");
						game.log(cards, "被烧毁了");
					}
				},
			},
			taiji: {
				name: "增伤",
				description: "此杀伤害+1",
				trigger: {
					source: "damageBegin1",
				},
				nopop: true,
				silent: true,
				popup: true,
				charlotte: true,
				filter(event, player) {
					return event?.card?.storage?.mjschilifeiren_taiji;
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
		},
	},
	/**火神族裔
	 * 你每个回合首次受到的火焰伤害-1，对其他角色首次造成的火焰伤害+1。
	 * */
	mjshuoshenzuyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio(event, player, name, indexedData, costResult) {
			if (name == "damageBegin3") {
				return "ext:名将杀/audio/skill/mjshuoshenzuyi" + get.rand(1, 2) + ".mp3";
			}
			return "ext:名将杀/audio/skill/mjshuoshenzuyi" + get.rand(3, 4) + ".mp3";
		},
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player, name) {
			if (name == "damageBegin3") {
				return game.getGlobalHistory("everything", evt => evt.name == "damage" && evt.player == player && evt.hasNature("fire")).indexOf(event) == 0;
			}
			return game.getGlobalHistory("everything", evt => evt.name == "damage" && evt.source == player && evt.player != player && evt.hasNature("fire")).indexOf(event) == 0;
		},
		async content(event, trigger, player) {
			trigger.num += (event.triggername == "damageBegin3" ? -1 : 1);
		},
	},
	//太子丹
	/**恣卿所欲
	 * 当有角色失去最后1张手牌时，你可以失去1点体力，令其摸2张牌。
	 * */
	mjsziqingsuoyu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		getIndex(event, player, name) {
			return game
				.filterPlayer(target => {
					if (target.countCards("h")) {
						return false;
					}
					const evt = event.getl(target);
					return evt?.hs?.length;
				})
				.sortBySeat();
		},
		filter: (event, player, name, target) => target?.isIn(),
		logTarget: (event, player, name, target) => target,
		check: (event, player, name, target) => {
			if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) return false;
			return get.attitude(player, target) > 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.loseHp();
			await target.draw(2);
		},
	},
	/**易水促行
	 * 每个角色出牌阶段结束时，若你在当前回合内失去过体力，你可以将当前回合角色的弃牌阶段改为出牌阶段，当其在此阶段造成伤害时，你回复1点体力。
	 * */
	mjsyishuicuxing: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		trigger: {
			global: "phaseChange",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (event.phaseList[event.num].startsWith("phaseDiscard")) {
				return true;
			}
			return game
				.getGlobalHistory("changeHp", evt => {
					return evt.player == player && evt.getParent().name == "loseHp";
				}).length;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			trigger.phaseList[trigger.num] = `phaseUse|${event.name}`;
			player.addTempSkill("mjsyishuicuxing_effect", ["phaseBefore", "phaseChange", "phaseAfter"]);
			player.markAuto("mjsyishuicuxing_effect", [trigger.player]);
		},
		subSkill: {
			effect: {
				trigger: {
					source: "damageSource",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return player.hasStorage("mjsyishuicuxing_effect", event.source);
				},
				async content(event, trigger, player) {
					player.recover();
				},
			},
		},
	},
	//孟获
	/**雄驭百兽
	 * 出牌阶段限1次，你可以将1张牌转化为对应花色的猛兽牌。当有角色失去猛兽牌时，你可以销毁此牌，然后获得1张与此牌花色相同的牌。
	 * 出牌阶段限1次，你可以将1张牌转化为对应花色的猛兽牌。
	 * 虎（♦）- 回合结束时，你可以令一名其他角色流血+1。
	 * 蛇（♣）- 杀伤，令目标中毒+1。
	 * 鳄（♠）- 手牌上限+1。出牌阶段开始时，出杀次数+1。
	 * 鹰（♥）- 摸牌+1，手牌上限+1。
	 * 象（☯）- 装备上限+1。回合结束时回复1点体力。除此牌外的猛兽效果+1。
	 * */
	mjsxiongyubaishou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		derivation: "mjsxiongyubaishou_faq",
		map: {
			"diamond": "mjshu",
			"club": "mjsshe",
			"spade": "mjse",
			"heart": "mjsying",
			"taiji": "mjsxiang",
		},
		getList: ["mjshu", "mjsshe", "mjse", "mjsying", "mjsxiang"],
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			return mjs.suits.includes(get.suit(card));
		},
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const card = event.cards[0];
			const suit = card.suit;
			const bool = get.position(card) == "e";
			if (bool) {
				player.removeEquipTrigger(card.card || card);
			}
			const name = lib.skill.mjsxiongyubaishou.getList[mjs.suits.indexOf(suit)];
			game.broadcastAll(
				function (card, name, bool, player) {
					card.init([card.suit, card.number, name]);
					let vcard = card[card.cardSymbol];
					if (bool && vcard && player.vcardsMap?.equips) {
						const cardx = get.autoViewAs(card, void 0, false);
						player.vcardsMap.equips[player.vcardsMap.equips.indexOf(vcard)] = cardx;
						card[card.cardSymbol] = cardx;
					}
				},
				card,
				name,
				bool,
				player
			);
			if (bool) {
				player.addEquipTrigger(card.card || card);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return 1;
				},
			},
		},
		group: "mjsxiongyubaishou_destroy",
		subSkill: {
			destroy: {
				audio: "mjsxiongyubaishou",
				trigger: {
	                global: ["loseEnd","equipEnd","addJudgeEnd","gainEnd","loseAsyncEnd","addToExpansionEnd"],
	            },
	            getIndex(event, player) {
	            	return game.filterPlayer(target => {
	            		var evt = event.getl(target);
	                    if (evt && evt.es) {
	                        return evt.es.some(i => lib.skill.mjsxiongyubaishou.getList.includes(i.name));
	                    }
	                    return false;
	            	}).sortBySeat(player);
	            },
	            logTarget(event, player, triggername, target) {
	            	return target;
	            },
	            prompt2(event, player, triggername, target) {
	            	const cards = event.getl(target).cards2.filter(i => lib.skill.mjsxiongyubaishou.getList.includes(i.name));
	            	return `你可以销毁${get.translation(cards)}，然后获得1张与${cards.length > 1 ? "这些牌" : "此牌"}花色相同的牌。`;
	            },
	            async content(event, trigger, player) {
	            	const target = event.targets[0];
	                const cards2 = trigger.getl(target).cards2.filter(i => lib.skill.mjsxiongyubaishou.getList.includes(i.name));
	                game.log(player, "将", cards2, "销毁");
	                await game.cardsGotoSpecial(cards2, "toDestroy");
	                const cards = [];
	                for (const card2 of cards2) {
	                	const card = get.cardPile(card22 => {
	                		if (cards.includes(card22)) return false;
	                		return get.suit(card22) == get.suit(card2);
	                	});
	                	if (card) {
	                		cards.push(card);
	                	}
	                }
	                if (cards.length) {
	                	await player.gain(cards, "draw");
	                }
	            },
			},
		},
	},
	/**南中之主
	 * 出牌阶段限1次，获得1张你手牌中没有的花色的牌。
	 * */
	mjsnanzhongzhizhu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		getSuit(card, player) {
			if (typeof card !== "object") {
		      return;
		    }
		    if (Array.isArray(card)) {
		      if (card.length == 1) {
		        return get.suit(card[0], player);
		      }
		      return "none";
		    } else if (!("suit" in card) && Array.isArray(card.cards)) {
		      return get.suit(card.cards, player);
		    } else {
		      if (player !== false) {
		        const owner = player || get.owner(card);
		        if (owner) {
		          return game.checkMod(card, owner, game.checkMod(card, card.suit, "suit", owner), "cardsuit", owner);
		        }
		      }
		      if (card.suit === "taiji" || lib.suits.includes(card.suit)) {
		        return card.suit;
		      }
		      return "none";
		    }
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getCards("h").reduce((list, card) => list.add(get.info("mjsnanzhongzhizhu").getSuit(card, player)), []).length < mjs.suits.length;
		},
		async content(event, trigger, player) {
			const suits = player.getCards("h").reduce((list, card) => list.add(get.info("mjsnanzhongzhizhu").getSuit(card)), []);
			const list = mjs.suits.slice().removeArray(suits);
			const card = get.cardPile(card => list.includes(get.info("mjsnanzhongzhizhu").getSuit(card)));
			if (card) {
				await player.gain(card, "draw");
			}
		},
		ai: {
			order: 12,
			result: {
				player(player) {
					const suits = player.getCards("h", card => get.info("mjsnanzhongzhizhu").getSuit(card, player), []);
					const card = get.cardPile(card => get.suit(card) == "taiji");
					if (card && !suits.includes("taiji")) {
						return mjs.suits.length - suits.length;
					}
					if (suits.length >= lib.suit.length) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//嬴政
	/**一统六合
	 * 与你势力相同的角色造成伤害后，你可以将受伤角色的势力改为与你相同或移除受伤角色的势力。当全场首次仅存在一种势力时，你回复全部体力，之后你的回合开始时，随机获得每个无势力角色的1张牌。
	 * 与你势力相同的角色造成伤害后，你可以将受伤角色的势力改为与你相同或移除受伤角色的势力。当全场首次仅存在一种势力时，你对所有无势力的角色造成1点伤害，回复全部体力，之后你的回合开始时，随机获得每个无势力角色的1张牌。
	 * */
	mjsyitongliuhe: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init() {
			lib.skill.mjsliuguoxiangyin.init();
		},
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		trigger: {
			global: "damageSource",
		},
		filter(event, player) {
			if (!event.source?.isIn()) {
				return false;
			}
			if (!get.info("mjsyitongliuhe").groupFiter(event.source)) {
				return false;
			}
			if (!get.info("mjsyitongliuhe").groupFiter(player)) {
				return false;
			}
			return event.source?.group == player.group;
		},
		groupFiter(player) {
			if (player.group == "g_noname") {
				return false;
			}
			return true;
		},
		async cost(event, trigger, player) {
			const list = [];
			if (get.info("mjsyitongliuhe").groupFiter(player) && get.info("mjsyitongliuhe").groupFiter(trigger.player)) {
				list.push("相同势力");
			}
			if (get.info("mjsyitongliuhe").groupFiter(trigger.player)) {
				list.push("移除势力");
			}
			if (!list.length) {
				return;
			}
			event.result = await player
				.chooseControl(list, "cancel2")
				.set("prompt", get.prompt(event.skill, trigger.player))
				.set("ai", () => {
					const player = get.player();
					const trigger = get.event().getTrigger();
					let controls = get.event().controls.slice();
					let att = get.attitude(player, trigger.player);
					if (controls.includes("相同势力") && att > 0) {
						return "相同势力";
					}
					return "移除势力";
				})
				.forResult();
			if (event.result.control != "cancel2") {
				event.result.cost_data = event.result.control;
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			if (event.cost_data == "相同势力") {
				const next = trigger.player.changeGroup(player.group);
				next.source = player;
				await next;
			} else {
				//delete trigger.player.group;
				const group = trigger.player.group;
				const next = trigger.player.changeGroup("g_noname", false);
				next.source = trigger.player;
				await next;
				game.log(trigger.player, "移除了", "#g" + group, "势力");
			}
		},
		group: "mjsyitongliuhe_change",
		subSkill: {
			change: {
				audio: "mjsyitongliuhe",
				trigger: {
					global: ["changeGroupAfter", "dieAfter"],
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return game.countGroup() == 1;
				},
				async content(event, trigger, player) {
					player.$fullscreenpop("一统六合", "daqin");
					player.tempBanSkill(event.name, "forever", false);
					await player.recoverTo(player.maxHp);
					player.addSkill("mjsyitongliuhe_effect");
				},
			},
			effect: {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const targets = game.filterPlayer(target => {
						return target.group == "g_noname";
					});
					const func = async target => {
						const cards = target.getCards("he").randomGets(1);
						if (cards.length) {
							await player.gain(cards, target, "giveAuto", "bySelf");
						}
					};
					await game.doAsyncInOrder(targets, func);
				},
			},
		},
	},
	/**秦弩齐射
	 * 出牌阶段限1次，翻开牌堆顶的8张牌，你可以为其中的每张杀选择一名不同的其他角色作为目标，依次对目标打出，然后你可以将剩余牌按原顺序放回牌堆顶或弃置。
	 * */
	mjsqinnuqishe: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:6",
		logAudio: index => "ext:名将杀/audio/skill/mjsqinnuqishe" + (typeof index === "number" ? index : get.rand(1, 6)) + ".mp3",
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			const cards = get.cards(8);
			await game.cardsGotoOrdering(cards);
			game.log(player, "翻开牌堆顶的", cards);
	        event.videoId = lib.status.videoId++;
	        const createDialog = function (player, cards, id) {
	            const dialog = ui.create.dialog("forcebutton", true);
	            dialog.classList.add("mj-flip");
	            dialog.classList.add("fullwidth");
	            dialog.videoId = id;
	            const buttons = ui.create.div(".buttons", dialog.content);
	            for (const card of cards) {
	                buttons.appendChild(card);
	                dialog.open();
	                ui.create.cardSpinning(card);
	            }
	        };
	        const closeDialog = function (id) {
	            const dialog = get.idDialog(id);
	            if (dialog) {
	                dialog.close();
	            }
	        };
	        game.broadcastAll(createDialog, player, cards, event.videoId);
	        await game.delay(2);
	        game.broadcastAll(closeDialog, event.videoId);
			event.result = await player
				.chooseButtonTarget({
					createDialog: [get.translation(event.name), cards],
					filterButton(button) {
						return button.link.name == "sha";
					},
					filterTarget(card, player, target) {
						if (ui.selected.targets.length >= ui.selected.buttons.length) {
							return false;
						}
						const sha = ui.selected.buttons[ui.selected.targets.length].link;
						return player.canUse(sha, target, false, false);
					},
					selectButton: [1, Infinity],
					selectTarget() {
						return ui.selected.buttons.length;
					},
					complexSelect: true,
					ai1(button) {
						const player = get.player();
						return player.getUseValue(button.link) + 1;
					},
					ai2(target) {
						const player = get.player();
						const card = ui.selected.buttons[ui.selected.targets.length].link;
						if (card) {
							return get.effect(target, card, player);
						}
						return get.effect(target, { name: "sha" }, player);
					},
				})
				.forResult();
			if (event.result?.bool && event.result.links?.length && event.result.targets?.length) {
				cards.removeArray(event.result.links);
				for (let i = 0; i < event.result.targets.length; i++) {
					const card = event.result.links[i];
					const target = event.result.targets[i];
					if (player.canUse(card, target, false, false)) {
						await player.useCard(card, target, false);
					}
				}
			}			
			if (!cards.length) {
				return;
			}
			const result = await player.chooseControl("放回", "弃置").set("dialog", [`###秦弩齐射###你可以将剩余牌按原顺序放回牌堆顶或弃置`, cards]).forResult();
			if (result.control == "放回") {
				cards.reverse();
				await game.cardsGotoPile(cards, "insert");
			} else {
				await game.cardsDiscard(cards);
			}
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) - 0.5;
			},
			result: {
				player(player) {
					return player.getUseValue("sha");
				},
			},
		},
	},
	/**万里长城
	 * 每轮开始时，对你翻开牌堆顶的8张牌，将其中的闪放入万里长城，然后你可以将剩余牌按原顺序放回牌堆顶或弃置。每个回合限1次，与你势力相同的角色需要打出闪时，你可以代替其从万里长城中打出。
	 * */
	mjswanlichangcheng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:6",
		trigger: {
			global: "roundStart",
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const cards = get.cards(8);
			await game.cardsGotoOrdering(cards);
			const shans = cards.filter(card => card.name == "shan");
			if (shans.length) {
				cards.removeArray(shans);
				const next = player.addToExpansion(shans, "draw");
				next.gaintag.add(event.name);
				await next;
			}
			if (!cards.length) return;
			const result = await player
				.chooseControl("放回", "弃置")
				.set("dialog", [`###万里长城###你可以将剩余牌按原顺序放回牌堆顶或弃置`, cards])
				.forResult();
			if (result.control == "放回") {
				cards.reverse();
				await game.cardsGotoPile(cards, "insert");
			} else {
				await game.cardsDiscard(cards);
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
		group: "mjswanlichangcheng_use",
		subSkill: {
			use: {
				audio: "mjswanlichangcheng",
				trigger: {
					global: ["chooseToUseBegin", "chooseToRespondBegin"],
				},
				usable: 1,
				filter(event, player) {
					if (!get.info("mjsyitongliuhe").groupFiter(player)) {
						return false;
					}
					if (event.player.group != player.group) {
						return false;
					}
					if (event.responded) {
						return false;
					}
					if (!player.getExpansions("mjswanlichangcheng").length) {
						return false;
					}
					const card = { name: "shan", isCard: true };
					return event.filterCard(card, event.player, event);
				},
				async cost(event, trigger, player) {
					const cards = player.getExpansions("mjswanlichangcheng");
					if (!cards.length) return;
					event.result = await player
						.chooseCardButton(get.translation(event.skill, trigger.player), cards)
						.set("ai", button => {
							const player = get.player();
							const trigger = get.event().getTrigger();
							return get.attitude(player, trigger.player);
						})
						.forResult();
					if (event.result.bool && event.result?.links?.length) {
						event.result.cards = event.result.links;
					}
				},
				async content(event, trigger, player) {
					trigger.untrigger();
					trigger.set("responded", true);
					const result = {
						bool: true,
						card: event.cards[0],
					};
					trigger.result = result;
				},
			},
		},
	},
	//王翦
	/**横扫三晋
	 * 当你的杀选择目标时，随机将目标3张手牌移出游戏，直到其下回合开始。
	 * 每个回合限1次，当你的杀选择目标时，随机将目标3张手牌移出游戏，直到其下回合开始。
	 * 出杀，随机将目标3张手牌移出游戏，直到其下回合开始。（每个回合限一次）
	 * */
	mjshengsaosanjin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "useCard",
			player: "useCardToPlayer",
		},
		silent: true,
		popup: true,
		filter(event, player) {
			return event.card.name == "sha" && event.isFirstTarget;
			return event.card.name == "sha" && event.targets?.some(target => target.countCards("h"));
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			for (const target of event.targets) {
				const cards = target.getCards("h").randomGets(3);
				if (!cards.length) {
					return;
				}
				const next = target.addToExpansion(cards, "giveAuto", target);
				next.gaintag.add("mjshengsaosanjin");
				await next;
				target
					.when("phaseBegin")
					.then(() => {
						const cards = player.getExpansions("mjshengsaosanjin");
						if (cards.length) {
							player.gain(cards, "draw");
							game.log(player, "收回了" + get.cnNumber(cards.length) + "张牌");
						}
					});
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("mjshengsaosanjin");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
	},
	/**请田
	 * 出牌阶段开始时，你可以选择一名其他角色，其可以交给你任意张牌，然后你此阶段增加1次出杀次数。
	 * 回合开始时/杀伤，可以选择一名其他角色，其可以交给你任意张牌，然后你本回合出杀次数+1。
	 * */
	mjsqingtian: {
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseUseBegin",
		},
		popup: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countCards("he");
				})
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const result = await target
				.chooseToGive(player, "he", [1, Infinity], "allowChooseAll")
				.set("ai", card => {
					const player = get.player();
					const source = get.event().getParent().player;
					const att = get.attitude(player, source);
					if (ui.selected.cards.length >= 2) {
						return 0;
					}
					if (att > 0) {
						return 8 - get.value(card);
					}
					return 0;
				})
				.forResult();
			if (result?.bool) {
				player.addTempSkill("mjsqingtian_sha", "phaseChange");
				player.addMark("mjsqingtian_sha", 1, false);
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjsqingtian_sha");
					},
				},
			},
		},
	},
	/**尺短寸长
	 * 其他角色回合开始时，若其本轮交给过你牌，则可以令你对另一名其他角色打出1张杀，若你拒绝则获得你的1张牌。
	 * */
	mjschiduancunchang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseBegin",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return game.getRoundHistory("everything", evt => {
				if (evt.name != "gain") return false;
				return evt.giver == event.player && evt.player == player;
			}).length;
		},
		async cost(event, trigger, player) {
			event.result = await trigger.player
				.chooseTarget(`是否响应${get.translation(get.translation(player))}的【${get.translation(event.skill)}】？`, `你可以令${get.translation(player)}对另一名其他角色打出1张杀，若其拒绝则获得其的1张牌`)
				.set("ai", target => {
					const { player, source } = get.event();
					return get.effect(target, { name: "sha" }, source, player);
				})
				.set("source", player)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					`尺短寸长：对${get.translation(get.translation(target))}使用一张杀，否则${get.translation(trigger.player)}获得你的1张牌`
				)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", target)
				.forResult();
			if (!result?.bool) {
				if (player.countGainableCards(trigger.player, "he")) {
					await trigger.player.gainPlayerCard(player, "he", true);
				}
			}
		},
	},
	//刘协
	/**负鼎见胁
	 * 其他角色出牌阶段限1次，若其与你的距离为1，其可以交给你1张牌，然后其可以打出你的1张手牌，若此牌造成伤害，你与其摸1张牌。
	 * */
	mjsfudingjianxie: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		global: "mjsfudingjianxie_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				prompt() {
					const player = get.player();
					const targets = game.filterPlayer(target => lib.skill.mjsfudingjianxie_global.filterTarget(null, player, target));
					let str = "交给" + get.translation(targets);
					if (targets.length > 1) {
						str += "中的一人";
					}
					str += "1张牌，然后你可以打出其的1张手牌，若此牌造成伤害，你与其摸1张牌";
					return str;
				},
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					return game.hasPlayer(target => lib.skill.mjsfudingjianxie_global.filterTarget(null, player, target));
				},
				filterTarget(card, player, target) {
					if (get.distance(player, target) > 1) return false;
					return target != player && target.hasSkill("mjsfudingjianxie") && !target.hasSkill("mjsfudingjianxie_used", null, null, false);
				},
				selectTarget() {
					const player = get.player();
					const count = game.countPlayer(target => lib.skill.mjsfudingjianxie_global.filterTarget(null, player, target));
					return count > 1 ? 1 : -1;
				},
				check(card) {
					const player = get.player();
					const hasFriend = game.hasPlayer(target => {
						if (get.attitude(player, target) <= 0) return false;
						return lib.skill.mjsfudingjianxie_global.filterTarget(null, player, target);
					});
					return (hasFriend ? 8 : 6) - get.value(card);
				},
				filterCard: true,
				discard: false,
				lose: false,
				delay: false,
				line: true,
				log: false,
				async precontent(event, trigger, player) {
					event.result.targets[0].logSkill("mjsfudingjianxie", player);
				},
				async content(event, trigger, player) {
					const { target } = event;
					target.addTempSkill("mjsfudingjianxie_used", "phaseUseAfter");
					await player.give(event.cards, target);
					const hs = target.getCards("h");
					if (!hs.length) return;
					const cards = hs.filter(card => {
						/*var cardx = {
							name: get.name(card, get.owner(card)),
							nature: get.nature(card, get.owner(card)),
							cards: [card],
						};*/
						var cardx = card;
						return player.hasUseTarget(cardx, null, false);
					});
					const result = await player
						.chooseButton(["###负鼎见胁###是否使用其中一张牌", cards])
						.set("filterButton", button => {
							return get.event().cards.includes(button.link);
						})
						.set("cards", cards)
						.set("ai", button => {
							const card = button.link;
							const player = get.player(),
								target = get.owner(card);
							let eff = player.getUseValue(card);
							if (get.is.damageCard(card)) {
								eff += get.effect(player, { name: "draw" }, player, player) + get.effect(target, { name: "draw" }, player, player) / 2;
							}
							return eff;
						})
						.forResult();
					if (result?.bool && result.links?.length) {
						var card = result.links[0];
						/*var cardx = {
							name: get.name(card, get.owner(card)),
							nature: get.nature(card, get.owner(card)),
							cards: [card],
						};
						var next = player.chooseUseTarget(cardx, [card], true, false);
						if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
							next.viewAs = false;
						}*/
						await player.chooseUseTarget(card, true, false);
						if (player.hasHistory("useCard", evt => {
							return evt.getParent() == event && targets[0].hasHistory("sourceDamage", evtx => evtx.card == evt.card);
						})) {
							await game.asyncDraw([player, target]);
						}
					}
				},
				ai: {
					expose: 0.3,
					order: 1,
					result: {
						target: 5,
					},
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	/**衣带诏
	 * 限定，你可以选择一名其他角色，令所有其他角色与其的距离始终为1。当其受到伤害时，伤害来源角色摸1张牌。当其阵亡时，你获得其所有牌，并且重置此技能。
	 * */
	mjsyidaizhao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		logAudio: index => "ext:名将杀/audio/skill/mjsyidaizhao" + (typeof index === "number" ? index : get.rand(1, 2)) + ".mp3",
		enable: "phaseUse",
		limited: true,
		onremove(player, skill) {
			player.getStorage(`${skill}_effect`).forEach(target => {
				target.removeSkill(`${skill}_debuff`);
			});
			player.removeSkill(`${skill}_effect`);
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.targets[0];
			target.addSkill(event.name + "_debuff");
			player.addSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", [target]);
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					return get.damageEffect(target, player);
				},
			},
		},
		subSkill: {
			debuff: {
				mod: {
					globalFrom(from, to, distance) {
						if (from != to) {
							return -Infinity;
						}
					},
				},
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				locked: false,
				charlotte: true,
				filter(event, player) {
					return event.source?.isIn();
				},
				async content(event, trigger, player) {
					trigger.source.draw();
				},
				mark: true,
				marktext: "诏",
				intro: {
					content: "所有其他角色与你的距离始终为1，当你受到伤害时，伤害来源角色摸1张牌",
				},
			},
			effect: {
				trigger: {
					global: "die",
				},
				forced: true,
				locked: false,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return player.hasStorage("mjsyidaizhao_effect", event.player);
				},
				async content(event, trigger, player) {
					const cards = trigger.player.getCards("he");
					if (cards.length) {
						await player.gain(cards, trigger.player, "giveAuto", "bySelf");
					}
					player.restoreSkill("mjsyidaizhao");
					game.log(player, "重置了技能", `#g【${get.translation("mjsyidaizhao")}】`);
				},
			},
		},
	},
	//刘表
	/**自守待时
	 * 每回合每种花色限1次，你可以弃置2张同花色的牌，摸2张牌。
	 * */
	mjszishoudaishi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		filterCard(card, player) {
			if (player.hasStorage("mjszishoudaishi_used", get.suit(card))) {
				return false;
			}
			if (ui.selected.cards.length) {
				return get.suit(card) == get.suit(ui.selected.cards[0]);
			}
			const cards = player.getCards("hs");
			for (let i = 0; i < cards.length; i++) {
				if (card != cards[i]) {
					if (get.suit(card) == get.suit(cards[i])) {
						return true;
					}
				}
			}
			return false;
		},
		selectCard: 2,
		check(card) {
			if (ui.selected.cards.length) {
				return 7 - get.value(card);
			}
			return 6 - get.value(card);
		},
		complexCard: true,
		async content(event, trigger, player) {
			const suits = event.cards.reduce((list, card) => list.add(get.suit(card)), []);
			const skill = event.name + "_used";
			player.addTempSkill(skill);
			player.markAuto(skill, suits);
			player.addTip(skill, get.translation(skill) + " " + player.getStorage(skill).reduce((str, suit) => str + get.translation(suit), ""), false, { whiteSpace: "nowrap" });
			await player.draw(2);
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					return 1;
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
			},
		},
	},
	/**偏安荆襄
	 * 回合结束时，若你本回合没有造成过伤害，直到你的下回合开始，当其他角色弃牌时，你随机获得其中1张牌。
	 * 回合结束时，若你本回合没有造成过伤害，直到你的下回合开始，当其他角色弃牌时，你可以选择获得其中1张牌。
	 * */
	mjspiananjingxiang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseEnd",
		},
		forced: true,
		locked: false,
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		filter(event, player) {
			return !player.hasHistory("sourceDamage");
		},
		async content(event, trigger, player) {
			player.addTempSkill("mjspiananjingxiang_effect", { player: "phaseBegin" });
		},
		subSkill: {
			effect: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter"],
				},
				forced: true,
				locked: false,
				getIndex(event, player) {
					if (event.type != "discard" || event.getlx === false) {
						return [];
					}
					return game
						.filterPlayer(current => {
							if (current == player) return false;
							const evt = event.getl(current);
							return evt?.cards2?.length;
						})
						.sortBySeat();
				},
				logTarget(event, player, triggername, target) {
					return target;
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const cards = trigger.getl(target).cards2;
					if (!cards.length) return;
					await player.gain(cards.randomGets(1), "gain2");
				},
				mark: true,
				marktext: "襄",
				intro: {
					content: "直到你的下回合开始，当其他角色弃牌时，你随机获得其中1张牌",
				},
			},
		},
	},
	//高渐离
	/**击筑而歌
	 * 当你打出牌时，若此牌与你当前回合打出的前1张牌的点数不同，可以弃置一名其他角色的1张牌；若点数相同，则你摸1张牌，并且此技能失效直到当前回合结束。
	 * */
	mjsjizhuerge: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			player: ["useCard", "respond"],
		},
		priority: 2,
		forced: true,
		locked: false,
		filter(event, player) {
			var evt = lib.skill.mjsjizhuerge.getLastUsed(player, event);
			if (!evt || !evt.card) {
				return false;
			}
			return true;
		},
		getLastUsed(player, event) {
			var history = player.getHistory("useCard");
			var index;
			if (event) {
				index = history.indexOf(event) - 1;
			} else {
				index = history.length - 1;
			}
			if (index >= 0) {
				return history[index];
			}
			return false;
		},
		async content(event, trigger, player) {
			const evt = lib.skill.mjsjizhuerge.getLastUsed(player, trigger);
			if (get.number(trigger.card) != get.number(evt.card)) {
				if (game.hasPlayer(target => {
					return target != player && target.countDiscardableCards(player, "he") > 0;
				})) {
					const result = await player
						.chooseTarget("你可以弃置一名其他角色的一张牌", (card, player, target) => {
							return target != player && target.countDiscardableCards(player, "he") > 0;
						})
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, { name: "guohe_copy2" }, player);
						})
						.forResult();
					if (result?.bool && result.targets?.length) {
						const target = result.targets[0];
						await player.discardPlayerCard(target, "he", true);
					}
				}
			} else {
				await player.draw();
				player.removeGaintag("mjsjizhuerge_mark");
				player.tempBanSkill(event.name);
			}
		},
		group: "mjsjizhuerge_mark",
		subSkill: {
			mark: {
				name: "筑",
				trigger: {
					player: ["gainAfter", "useCard1", "respond"],
					global: ["loseAsyncAfter", "phaseBegin"],
				},
				forced: true,
				locked: false,
				silent: true,
				firstDo: true,
				filter(event, player) {
					if (!player.countCards("h")) return false;
					if (["useCard", "respond", "phase"].includes(event.name)) {
						return true;
					}
					return event.getg && event.getg(player)?.length;
				},
				async content(event, trigger, player) {
					player.removeGaintag(event.name);
					var evt = lib.skill.mjsjizhuerge.getLastUsed(player);
					const cards = player.getCards("h").filter(card => {
						if (!evt || !evt.card) {
							return false;
						}
						return get.number(card) != get.number(evt.card);
					});
					if (cards.length) {
						player.addGaintag(cards, event.name);
					}
				},
			},
		},
	},
	/**变徴之声
	 * 当你打出牌时，若此牌与你当前回合打出的前1张牌的花色不同，则你可以弃置所有手牌，并摸等量牌；若花色相同，则你摸1张牌，并且此技能失效直到当前回合结束。
	 * */
	mjsbianzhizhisheng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			player: ["useCard", "respond"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			var evt = lib.skill.mjsjizhuerge.getLastUsed(player, event);
			if (!evt || !evt.card) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const evt = lib.skill.mjsjizhuerge.getLastUsed(player, trigger);
			if (get.suit(trigger.card) != get.suit(evt.card)) {
				const cards = player.getCards("h", card => {
					return lib.filter.cardDiscardable(card, player, "mjsbianzhizhisheng");
				});
				if (!cards.length) return;
				const result = await player
					.chooseBool("你可以弃置所有手牌，并摸等量牌")
					.set("ai", () => {
						return player.getCards("h").every(card => {
							return lib.skill.rezhiheng.check(card) > 0;
						});
					})
					.forResult();
				if (result.bool) {
					await player.discard(cards);
					await player.draw(cards.length);
				}
			} else {
				await player.draw();
				player.removeGaintag("mjsbianzhizhisheng_mark");
				player.tempBanSkill(event.name);
			}
		},
		group: "mjsbianzhizhisheng_mark",
		subSkill: {
			mark: {
				name: "徴",
				trigger: {
					player: ["gainAfter", "useCard1", "respond"],
					global: ["loseAsyncAfter", "phaseBegin"],
				},
				forced: true,
				locked: false,
				silent: true,
				firstDo: true,
				filter(event, player) {
					if (!player.countCards("h")) return false;
					if (["useCard", "respond", "phase"].includes(event.name)) {
						return true;
					}
					return event.getg && event.getg(player)?.length;
				},
				async content(event, trigger, player) {
					player.removeGaintag(event.name);
					var evt = lib.skill.mjsjizhuerge.getLastUsed(player);
					const cards = player.getCards("h").filter(card => {
						if (!evt || !evt.card) {
							return false;
						}
						return get.suit(card) != get.suit(evt.card);
					});
					if (cards.length) {
						player.addGaintag(cards, event.name);
					}
				},
			},
		},
	},
	/**壮士去兮
	 * 阵亡，你可以对一名其他角色打出弃牌堆中你本轮弃置的杀，直到目标重伤。
	 * */
	mjszhuangshiquxi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "die",
		},
		popup: false,
		forceDie: true,
		filter(event, player) {
			return get.info("mjszhuangshiquxi").getCards(player).length;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					if (player == target) {
						return false;
					}
					return player.canUse({ name: "sha" }, target, false);
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "sha" }, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const cards = get.info(event.name).getCards(player);
			while (cards.length) {
				const card = cards.randomGet();
				cards.remove(card);
				const next = player.useCard(card, target, false);
				next.set("forceDie", true);
				await next;
			}
		},
		getCards(player) {
			const cards = player
				.getRoundHistory("lose", evt => {
					if (evt.type != "discard") {
						return false;
					}
					return evt.cards2.filterInD("d").some(card => card.name == "sha");
				})
				.reduce((list, evt) => {
					list.addArray(evt.cards2.filterInD("d").filter(card => card.name == "sha"));
					return list;
				}, []);
			return cards;
		},
	},
	//巴清
	/**礼抗万乘
	 * 每轮开始时，场上所有角色的手牌中，每有1张杀，就添加1张丹砂到你的手牌。
	 * 丹砂：♦️-7，出牌阶段限1次，打出，令一名其他角色获得此牌，然后获得其任意区域的1张牌。
	 * */
	mjslikangwancheng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		audioname: [],
		trigger: {
			global: "roundStart",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return game.hasPlayer(target => target.countCards("h", "sha"));
		},
		async content(event, trigger, player) {
			const num = game.filterPlayer().reduce((sum, target) => {
				sum += target.countCards("h", "sha");
				return sum;
			}, 0);
			const cards = [];
			while (cards.length < num) {
				const card = game.createCard2("mjsdansha", "diamond", 7);
				cards.push(card);
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
		},
	},
	/**丹砂女王
	 * 你的【丹砂】不计入手牌上限；打出【丹砂】不消耗次数，直到你在当前阶段获得【丹砂】；当其他角色打出【丹砂】时，你获得1张♦牌。
	 * 你的丹砂不计入手牌上限。每个回合限1次，当你即将受到伤害时，你可以将1张丹砂交给伤害来源，并令此伤害-1。
	 * */
	mjsdanshanvwang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			ignoredHandcard(card, player) {
				if (card.name == "mjsdansha") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name === "phaseDiscard" && card.name == "mjsdansha") {
					return false;
				}
			},
		},
		trigger: {
			global: ["useCard", "respond"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.card.name != "mjsdansha") {
				return false;
			}
			if (event.player == player) {
				for (const phase of lib.phaseName) {
					const evt = event.getParent(phase);
					if (evt?.name === phase) {
						if (player.hasHistory("gain", evtx => evtx.cards.some(card => card.name == "mjsdansha") && evtx.getParent(evt.name) == evt)) {
							return false;
						}
					}
				}
			}
			return true;
		},
		async content(event, trigger, player) {
			if (trigger.player == player) {
				trigger.addCount = false;
				const stat = player.getStat().card, name = trigger.card.name;
				if (typeof stat[name] === "number") {
					stat[name]--;
				}
				game.log(player, "使用的", trigger.card, "不计入次数限制");
			} else {
				const card = get.cardPile(card => get.suit(card, false) == "diamond");
				if (card) {
					await player.gain(card, "draw");
				}
			}
		},
	},
	/**怀清台
	 * 你阵亡后，你的座位变为怀清台。
	 * 怀清台：没有体力和手牌，无法成为任何手牌或技能的目标，回合开始时，令所有未对巴清造成过伤害的角色各摸1张牌，然后回合结束
	 * */
	mjshuaiqingtai: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "dieAfter",
		},
		forced: true,
		locked: false,
		forceDie: true,
		async content(event, trigger, player) { },
		group: ["mjshuaiqingtai_phase", "mjshuaiqingtai_effect"],
		subSkill: {
			phase: {
				trigger: {
					global: "phaseOver",
				},
				forced: true,
				locked: false,
				forceDie: true,
				filter(event, player) {
					return event.player == player && player.isDead();
				},
				async content(event, trigger, player) {
					const next = player.insertPhase();
					next.set("forceDie", true);
					delete next.skill;
				},
			},
			effect: {
				audio: "mjshuaiqingtai",
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				locked: false,
				forceDie: true,
				filter(event, player) {
					if (!player.isDead()) {
						return false;
					}
					return game.hasPlayer(target => {
						return !target.hasAllHistory("sourceDamage", evt => evt.player == player);
					});
				},
				async content(event, trigger, player) {
					const targets = game.filterPlayer(target => {
						return !target.hasAllHistory("sourceDamage", evt => evt.player == player);
					});
					if (targets.length) {
						await game.asyncDraw(targets);
					}
				},
			},
		},
	},
	//庞统
	/**铁索连舟
	 * 你可以将♦️牌当作连环打出。当处于连环状态的角色受到属性伤害时，你摸1张牌。
	 * */
	mjstiesuolianzhou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "chooseToUse",
		viewAs: {
			name: "mjslianhuan",
		},
		filterCard: {
			suit: "diamond",
		},
		position: "hes",
		trigger: {
			global: "damageEnd",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "chooseToUse") {
				return player.countCards("hes", { suit: "diamond" });
			}
			if (event.name != "damage") return true;
			return event.checkJyliezhou && event.hasNature();
		},
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	/**入蜀三策
	 * 每轮限1次，其他角色的回合开始时，你可以随机添加3张战法牌至其手牌，令其可以立即打出其中1张，然后弃置另外2张牌，否则销毁这些牌。
	 * 每轮限1次，其他角色的回合开始时，你可以随机添加3张战法牌至其手牌，令其立即打出其中1张，然后可以将另外2张牌交给你，否则销毁这些牌。
	 * */
	mjsrushusance: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseBegin",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event.player != player;
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			player.tempBanSkill(event.name, "roundStart", false);
			const cards = [];
			while (cards.length < 3) {
				const trick = mjs.getTrick("random");
				if (trick) {
					const card = mjs.createCard(trick);
					if (card) {
						cards.push(card);
					} else {
						break;
					}
				} else {
					break;
				}
			}
			if (cards.length) {
				await trigger.player.gain(cards, "draw");
			}
			const next = trigger.player
				.chooseToUse(`${get.translation(player)}发动了【${get.translation(event.name)}】`, "你可以立即打出1张牌", function (card) {
					if (!lib.filter.cardEnabled(card, _status.event.player, _status.event)) {
						return false;
					}
					return get.event().cards.includes(card);
				})
				.set("cards", cards);
			next.set("oncard", () => {
	            const evt = _status.event;
	            player.logSkill("mjsrushusance", evt.targets);
	        });
			const result = await next.forResult();
			if (result?.bool && result.card) {
				cards.removeArray(result.card.cards);
				await trigger.player.discard(cards);
			} else {
				game.log(cards, "被销毁了");
				await trigger.player.lose(cards, "toDestroy", ui.special);
			}
		},
	},
	/**欲展骥足
	 * 出牌阶段限1次，你可以将所有牌转化为等量随机战法牌。
	 * */
	mjsyuzhanjizu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he");
		},
		async content(event, trigger, player) {
			const cards = player.getCards("he");
			const gains = [];
			for (const card of cards) {
				const bool = get.position(card) == "e";
				if (bool) {
					player.removeEquipTrigger(card.card || card);
				}
				const trick = mjs.getTrick("random");
				const suit = mjs.getSuit(trick);
				const number = mjs.getNumber(trick);
				game.broadcastAll(function (card, suit, number, name) {
					card.init([suit, number, name]);
				}, card, suit, number, trick);
				if (bool) {
					gains.push(card);
				}
			}
			if (gains.length) {
				await player.gain(gains, "draw");
			}
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					return 1;
				},
			},
		},
	},
	//袁术
	/**涂高代汉
	 * 登场，添加【传国玉玺】至你的手牌。出牌阶段限1次，若你没有【传国玉玺】，你可以弃置至少1张牌并获得【传国玉玺】，若你是从其他角色处获得【传国玉玺】，令其获得这些牌。
	 * 传国玉玺：♦️，点数1，防具牌，此牌无法被销毁或烧毁。其他角色与你的距离始终为1。你的弃牌阶段改为摸牌阶段。当你连续装备此牌5个你的回合结束后，你所在的阵营获胜。
	 * */
	mjstugaodaihan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			aiOrder(player, card, num) {
				if (card.name == "mjschuanguoyuxi") {
					return num - 10;
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		locked: false,
		filter(event, player) {
			return !player.countCards("he", "mjschuanguoyuxi");
		},
		filterCard(card) {
			return lib.filter.cardDiscardable(card, get.player(), "mjstugaodaihan");
		},
		selectCard: [1, Infinity],
		check(card) {
			if (ui.selected.cards.length > 0) {
				return 0;
			}
			return 7 - get.value(card);
		},
		async content(event, trigger, player) {
			//正式上线为土属性
			const card = get.cardPile("mjschuanguoyuxi", "field") || game.createCard2("mjschuanguoyuxi", "taiji", 1);
			const owner = get.owner(card);
			if (owner) {
				await player.gain(card, target, "give");
				await target.gain(event.cards, "gain2");
			} else {
				await player.gain(card, "gain2");
				await game.delayx();
			}
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					return 1;
				},
			},
		},
		group: "mjstugaodaihan_init",
		subSkill: {
			init: {
				audio: "mjstugaodaihan",
				trigger: {
					global: "phaseBefore",
					player: ["enterGame", "changeSkillsAfter"],
				},
				silent: true,
				popup: true,
				forced: true,
				locked: false,
				filter(event, player) {
					if (event.name == "changeSkills") {
						return event.addSkill.includes("mjstugaodaihan");
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					const card = game.createCard("mjschuanguoyuxi", "taiji", 1);
					await game.delayx();
					await player.gain(card, "gain2");
				},
			},
		},
	},
	/**妄自尊大
	 * 与你距离为1的其他角色，手牌上限-1。回合结束时，你的手牌上限-1。
	 * */
	mjswangzizunda: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		global: "mjswangzizunda_global",
		trigger: {
			player: "phaseEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		async content(event, trigger, player) {
			lib.skill.mjsallmax.change(player, -1);
		},
		subSkill: {
			global: {
				mod: {
					maxHandcard(player, num) {
						return (
							num -
							game.countPlayer(target => {
								return target != player && target.hasSkill("mjswangzizunda") && get.distance(target, player) <= 1;
							})
						);
					},
				},
			},
		},
	},
	//鲁仲连
	/**义不帝秦
	 * 其他角色无法改变你的势力。当你打出牌后，若此牌的花色是你在本轮首次打出，你可以将此牌放入牌堆底，然后摸1张牌。
	 * 其他角色无法改变你的势力。当你打出牌后，若此牌的花色是你在当前回合首次打出，你可以将此牌放入牌堆底，然后摸1张牌。
	 * 其他角色无法改变你的势力。当你打出牌时，若此牌的花色是你在当前回合首次打出，你可以将1张手牌放入牌堆底，然后摸1张牌。
	 * */
	mjsyibudiqin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "changeGroupBegin",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return event.source && event.source != player;
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
		ai: {
			noChangeGroup: true,
		},
		group: ["mjsyibudiqin_change", "mjsyibudiqin_use"],
		subSkill: {
			change: {
				audio: "mjsyibudiqin",
				trigger: {
					player: "changeGroupBefore",
				},
				silent: true,
				async content(event, trigger, player) {
					if (get.itemtype(trigger.source) != "player") {
						const source = trigger.getParent()?.player;
						if (get.itemtype(source) == "player") {
							trigger.source = source;
						}
					}
				},
			},
			use: {
				audio: "mjsyibudiqin",
				trigger: {
					player: ["useCard1", "respond"],
				},
				silent: true,
				popup: true,
				forced: false,
				getList(player) {
					const list = ["useCard", "respond"].map(key => player.getRoundHistory(key).reduce((list, evt) => list.add(get.suit(evt.card)), [])).flat().toUniqued();
					return list;
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				filter(event, player) {
					if (!mjs.suits.includes(get.suit(event.card))) {
						return false;
					}
					if (!event.cards.someInD()) {
						return false;
					}
					const suit = get.suit(event.card);
					const suits = lib.skill.mjsyibudiqin_use.getList(player);
					player.addTip("mjsyibudiqin_use", get.translation("mjsyibudiqin_use") + " " + suits.reduce((str, suit) => str + get.translation(suit), ""), "roundStart", { whiteSpace: "nowrap" });
					if (player.getRoundHistory("useCard", evt => get.suit(evt.card) == suit).indexOf(event) != 0 && player.getRoundHistory("respond", evt => get.suit(evt.card) == suit).indexOf(event) != 0) {
						return false;
					}
					return true;
				},
				prompt2(event, player) {
					const cards2 = event.cards.filterInD("oe");
					return "你可以将" + get.translation(cards2) + "置于牌堆底，然后摸一张牌";
				},
				async content(event, trigger, player) {
					const cards = trigger.cards.filterInD();
					await player.lose(cards, ui.cardPile);
					game.log(player, "将", cards, "置于了牌堆底");
					await player.draw();
				},
			},
		},
	},
	/**一箭定聊
	 * 出牌阶段限1次，你可以弃置至多3张花色各不相同的手牌，并令一名其他角色弃置与你弃置的牌数量、花色均相同的牌，然后将这些牌放入牌堆底。若其弃置的牌数量不足，则其失去等量体力。 
	 * 出牌阶段限1次，你可以消耗1个出杀次数，弃置至多3张花色各不相同的手牌，并令一名其他角色弃置与你弃置的牌数量、花色均相同的牌，然后将这些牌放入牌堆底。若其弃置的牌数量不足，则其失去等量体力。
	 * */
	mjsyijiandingliao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCard(card => lib.filter.cardDiscardable(card, player, "mjsyijiandingliao"));
		},
		filterTarget: lib.filter.notMe,
		filterCard(card, player) {
			return !ui.selected.cards.some(cardx => get.suit(cardx, player) == get.suit(card, player));
		},
		selectCard: [1, 3],
		check(card) {
			return 7 - get.value(card);
		},
		complexCard: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const suits = event.cards.reduce((list, card) => list.add(get.suit(card)), []);
			const result = await target
				.chooseToDiscard("he", [1, event.cards.length], card => {
					if (!lib.skill.mjsyijiandingliao.filterCard(card, get.player())) {
						return false;
					}
					return get.event().suits.includes(get.suit(card, get.player()));
				})
				.set("suits", suits)
				.set("ai", card => {
					const player = get.player();
					if (get.tag(card, "recover")) {
						return 0;
					}
					return 8 - get.value(card);
				})
				.set("complexCard", true)
				.forResult();
			if (result.bool && result.cards?.length) {
				//await game.cardsGotoPile(result.cards);
				//特殊处理player.lose
				player.directgains(result.cards, null, "mjsyijiandingliao_tag");
				await player.lose(result.cards, ui.cardPile);
				game.log(player, "将", result.cards, "置入了牌堆底");
				if (result.cards.length < event.cards.length) {
					await target.loseHp(event.cards.length - result.cards.length);
				}
			} else {
				await target.loseHp(event.cards.length);
			}
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) - 0.5;
			},
			result: {
				target(player, target) {
					return get.effect(target, { name: "losehp" }, target) / Math.sqrt(target.countCards("he") + 1);
				},
			},

		},
		subSkill: {
			tag: {
				name: "invisible",
			},
		},
	},
	/**珠明烁今
	 * 回合结束时，你可以将本回合你放入牌堆底的其中1张牌交给一名角色。
	 * */
	mjszhumingshuojin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseEnd",
		},
		popup: false,
		async cost(event, trigger, player) {
			const cards = player.getStorage("mjszhumingshuojin_record");
			if (!cards.length) {
				return;
			}
			event.result = await player
				.chooseButtonTarget({
					createDialog: [get.translation(event.skill), cards],
					filterTarget: true,
					ai1(button) {
						const player = get.player();
						return player.getUseValue(button.link) + 1;
					},
					ai2(target) {
						const player = get.player();
						const card = ui.selected.buttons[0].link;
						if (card) {
							return get.value(card, target) * get.attitude(player, target);
						}
						return get.attitude(player, target);
					},
				})
				.forResult();
			if (event.result?.bool && event.result.links?.length) {
				event.result.cards = event.result.links;
			}
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const gainEvent = target.gain(event.cards);
			gainEvent.giver = player;
			await gainEvent;
		},
		group: "mjszhumingshuojin_mark",
		subSkill: {
			mark: {
				trigger: {
					player: "loseEnd",
				},
				popup: false,
				forced: true,
				charlotte: true,
				filter(event, player) {
					//兼容其他技能的置底牌流程
					return event.position == ui.cardPile && !event.insert_card;
				},
				async content(event, trigger, player) {
					const cards = trigger.cards;
					if (cards.length) {
						player.addTempSkill("mjszhumingshuojin_record");
						player.markAuto("mjszhumingshuojin_record", cards);
					}
				},
			},
			record: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//君王后
	/**慧眼识郎
	 * 登场，你可以选择一名其他男性角色。每个回合你们的体力值或手牌数变化后首次相同，你们各摸1张牌。
	 * 登场，你可以选择一名其他男性角色。每个回合限1次，若你们的体力值或手牌数首次变化后相同，你们各摸1张牌。
	 * */
	mjshuiyanshilang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjshuiyanshilang" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "changeSkillsAfter"],
		},
		popup: false,
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		filter(event, player) {
			if (!game.hasPlayer(target => target != player && target.hasSex("male"))) {
				return false;
			}
			if (event.name == "changeSkills") {
				return event.addSkill.includes("mjshuiyanshilang");
			}
			return (event.name != "phase" || game.phaseNumber == 0);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return target != player && target.hasSex("male");
				})
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att > 0) {
						return att + 1;
					}
					if (att == 0) {
						return Math.random();
					}
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
			const skill = event.name + "_effect";
			delete player.storage[skill];
			player.addSkill(skill);
			player.markAuto(skill, [target]);
			player.addTip(skill, get.translation(skill) + " " + player.getStorage(skill).reduce((str, target) => str + get.translation(target), ""), false, { whiteSpace: "nowrap" });
		},
		subSkill: {
			effect: {
				trigger: {
					player: "mjshuiyanshilangChange",
				},
				usable: 1,
				silent: true,
				forced: true,
				locked: false,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				filter(event, player) {
					return player.getStorage("mjshuiyanshilang_effect").some(target => {
						return (target.hp == player.hp || target.countCards("h") == player.countCards("h"));
						return target?.isIn() && (target.hp == player.hp || target.countCards("h") == player.countCards("h"));
					});
				},
				async content(event, trigger, player) {
					// 阵亡角色0体力0手牌也可以摸，很神奇吧
					const targets = player.getStorage("mjshuiyanshilang_effect").filter(target => {
						return (target.hp == player.hp || target.countCards("h") == player.countCards("h"));
						return target?.isIn() && (target.hp == player.hp || target.countCards("h") == player.countCards("h"));
					});
					if (targets.length) {
						const targets2 = targets.filter(target => target.isAlive());
						if (targets2.length) {
							player.logSkill("mjshuiyanshilang", targets2, null, null, [get.rand(3, 4)]);
							await game.asyncDraw([player, ...targets2]);
							return;
						}
					}
					player.logSkill("mjshuiyanshilang", player, null, null, [get.rand(3, 4)]);
					await player.draw();
				},
				mark: true,
				intro: {
					markcount: () => 0,
					content: "你和$的体力值或手牌数首次变化后相同，你们各摸1张牌",
				},
				group: ["mjshuiyanshilang_hp", "mjshuiyanshilang_hs"],
			},
			hp: {
				trigger: {
					global: "changeHp",
				},
				silent: true,
				charlotte: true,
				filter(event, player) {
					const targets = [player].slice().addArray(player.getStorage("mjshuiyanshilang_effect"));
					return targets.includes(event.player);
				},
				filterx(event, player) {
					return player.getStorage("mjshuiyanshilang_effect").some(target => {
						return target.hp == player.hp;
						return target?.isIn() && target.hp == player.hp;
					});
				},
				async content(event, trigger, player) {
					if (get.info(event.name).filterx(event, player)) {
						await event.trigger("mjshuiyanshilangChange");
					}
				},
			},
			hs: {
				trigger: {
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "loseAfter", "addToExpansionAfter"],
				},
				silent: true,
				charlotte: true,
				filter(event, player) {
					const targets = [player].slice().addArray(player.getStorage("mjshuiyanshilang_effect"));
					return targets.some(target => {
						var gain = 0,
							lose = 0;
						if (event.getg) {
							gain = event.getg?.(player).length;
						}
						if (event.getl) {
							lose = event.getl?.(player)?.hs?.length;
						}
						return gain || lose;
					});
				},
				filterx(event, player) {
					return player.getStorage("mjshuiyanshilang_effect").some(target => {
						return target.countCards("h") == player.countCards("h");
						return target?.isIn() && target.countCards("h") == player.countCards("h");
					});
				},
				async content(event, trigger, player) {
					if (get.info(event.name).filterx(event, player)) {
						await event.trigger("mjshuiyanshilangChange");
					}
				},
			},
		},
	},
	/**事秦谨慎
	 * 每个回合限1次，体力值>你的角色对你造成伤害后，你可以令一名角色摸1张牌；手牌数>你的角色对你造成伤害后，你可以令一名角色回复1点体力值。
	 * 每个回合各限1次，体力值>你的角色对你造成伤害后，你可以令一名角色摸1张牌；手牌数>你的角色对你造成伤害后，你可以令一名角色回复1点体力值。
	 * */
	mjsshiqinjinshen: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		logAudio: index => "ext:名将杀/audio/skill/mjsshiqinjinshen" + (typeof index === "number" ? index : get.rand(1, 2)) + ".mp3",
		trigger: {
			player: "damageEnd",
		},
		usable: 1,
		silent: true,
		locked: false,
		filter(event, player) {
			return event.source?.isIn() && (event.source.hp > player.hp || event.source.countCards("h") > player.countCards("h"));
		},
		async content(event, trigger, player) {
			const bool1 = trigger.source.hp > player.hp;
			const bool2 = trigger.source.countCards("h") > player.countCards("h");
			const draw = Math.max();
			const recover = Math.max();
			if (bool1) {
				const result = await player
					.chooseTarget(get.prompt(event.name), "你可以令一名角色摸1张牌")
					.set("ai", target => {
						const player = get.player();
						const sgn = get.sgnAttitude(player, target);
						const eff = get.effect(target, { name: "draw" }, player, player);
						if (player.hasSkill("mjshuiyanshilang_effect")) {
							const targets = player.getStorage("mjshuiyanshilang_effect").filter(target2 => {
								return Math.abs(target2.countCards("h") - player.countCards("h")) == 1;
							});
							return sgn * eff * 2;
						}
						return sgn * eff;
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					const [target] = result.targets;
					player.logSkill(event.name, target, null, null, [1]);
					player.addTempSkill("mjsshiqinjinshen_used");
					await target.draw();
				}
			}
			if (player.storage?.counttrigger?.[event.name]) {
				return;
			}
			if (bool2) {
				const result = await player
					.chooseTarget(get.prompt(event.name), "你可以令一名角色回复1点体力值")
					.set("ai", target => {
						const player = get.player();
						return get.recoverEffect(target, player, player);
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					const [target] = result.targets;
					player.logSkill(event.name, target, null, null, [2]);
					await target.recover();
				}
			}
		},
	},
	/**巧解玉环
	 * 每个回合限1次，当你成为其他角色打出的战法牌目标时，你可以将其转化为杀并对你打出。
	 * 当你成为其他角色打出的战法牌目标时，你可以将其转化为杀并对你打出。
	 * */
	mjsqiaojieyuhuan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			target: "useCardToTarget",
		},
		usable: 1,
		filter(event, player) {
			if (event.player == player) return false;
			//延时锦囊不生效
			return get.type(event.card) == "trick" && event.cards.length;
		},
		check(event, player) {
			return get.effect(player, event.card, event.player, player) <= 0;
		},
		async content(event, trigger, player) {
			const name = "sha";
			const cards = trigger.cards.filterInD();
			for (const card of cards) {
				game.broadcastAll(
					function (card) {
						card.init([card.suit, card.number, name]);
						//card.addGaintag("eternal_mjsqiaojieyuhuan_converted");
					},
					card,
					name
				);
			}
			const suit = get.suit(cards[0]),
				number = get.number(cards[0]);
			if (suit == "heart") {
				game.setNature(trigger.card, "fire");
			} else if (number == 4) {
				game.setNature(trigger.card, "thunder");
			}
			const card = get.autoViewAs({ ...trigger.card, name }, cards);
			game.log(player, "将", trigger.card, "转化为", card);
			trigger.card.name = name;
			trigger.cards = cards.slice();
			trigger.card.cards = cards.slice();
			trigger.targets.length = 0;
			trigger.all_excluded = true;
			trigger.addCount = false;
			trigger.targets.add(player);
		},
		subSkill: {
			converted: {
				name: "转化",
			},
		},
	},
	//步练师
	/**仁惠抚下
	 * 当一名其他角色受到伤害时，你可以交给其1张牌，然后令其获得并装备1张装备牌。
	 * */
	mjsrenhuifuxia: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			return event.player != player && player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill, trigger.player), "he")
				.set("ai", card => {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					if (get.attitude(player, trigger.player) <= 0) {
						return 0;
					}
					return 8 - get.value(card);
				})
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.give(event.cards, target);
			const card = get.cardPile(card => get.type(card) == "equip");
			if (card) {
				await target.gain(card);
				if (target.getCards("h").includes(card) && get.type(card, target) == "equip") {
					await target.chooseUseTarget(card, "nopopup", true);
				}
			}
		},
		ai: {
			threaten: 5,
		},
	},
	/**宠冠后庭
	 * 每个角色的回合结束时，若你的手牌数不是全场最多，你摸1张牌。
	 * */
	mjsguanchonghouting: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseEnd",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return !player.isMaxHandcard();
		},
		async content(event, trigger, player) {
			player.draw();
		},
		ai: {
			threaten: 2.8,
		},
	},
	/**追册中宫
	 * 阵亡，你可以将所有手牌交给一名其他角色，然后令其获得并装备装备牌直到达到装备上限或获得了装备上限张装备牌。
	 * 阵亡，你可以将所有手牌交给一名其他角色，然后令其获得并装备装备牌直到达到装备上限。
	 * */
	mjszhuicezhonggong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "die",
		},
		popup: false,
		forceDie: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					return att + target.mjsGetEquipLimit() - target.countCards("e");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			await player.give(player.getCards("h"), target);
			const count = target.mjsGetEquipLimit();
			const cards = [];
			while (true) {
				if (target.countCards("e") >= count) break;
				if (cards.length >= count) break;
				const card = get.cardPile(card => get.type(card) == "equip");
				if (card) {
					cards.push(card);
					await target.gain(card);
					if (target.getCards("h").includes(card) && get.type(card, target) == "equip") {
						await target.chooseUseTarget(card, "nopopup", true);
					}
				} else break;
			}
		},
	},
	//太史慈
	/**猿臂善射
	 * 当你选择杀的目标时，若目标手牌中没有闪，则此杀伤害+1；闪避，获得1张杀。
	 * */
	mjsyuanbishanshe: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["useCardToTarget", "useCard", "respond"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "useCardToTarget") {
				return event.card.name == "sha" && !event.target.countCards("h", "shan");
			}
			return event.card.name == "shan";
		},
		async content(event, trigger, player) {
			if (trigger.card.name == "sha") {
				const id = trigger.target.playerid;
				const map = trigger.getParent().customArgs;
				if (!map[id]) {
					map[id] = {};
				}
				if (typeof map[id].extraDamage != "number") {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage++;
			} else {
				const card = get.cardPile("sha");
				if (card) await player.gain(card);
			}
		},
	},
	/**神亭酣战
	 * 出牌阶段限1次，选择一名其他角色，从你开始依次对对方打出手牌中的所有杀，直至其中一方因此重伤。若有角色因此阵亡，你失去此技能。
	 * */
	mjsshentinghanzzhan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			event.source = player;
			event.turn = event.targets[0];
			event.num = 0;
			while (event.num < 2) {
				const cards = event.source.getCards("h", card => {
					return get.name(card, event.source) == "sha" && event.source.canUse(card, event.turn, false, false);
				});
				if (cards.length) {
					const card = cards.randomGet();
					const next = event.source.useCard(card, event.turn, false);
					await next;
				} else {
					event.num++;
				}
				[event.source, event.turn] = [event.turn, event.source];
				if (game.hasGlobalHistory("everything", evt => evt.name == "dying" && evt.getParent(3) == next)) {
					break;
				}
			}
			if (
				game.getGlobalHistory("everything", evt => {
					if (evt.name != "die") {
						return false;
					}
					return evt.reason?.getParent(event.name) == event;
				}).length > 0
			) {
				player.removeSkills(event.name);
			}
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) - 0.1;
			},
			result: {
				target(player, target) {
					if (!player.countCards("h", "sha")) return 0;
					return get.effect(target, { name: "sha" }, player);
				},
			},
		},
	},
	//赵姬
	/**绝好善舞
	 * 当你打出牌时，你可以弃置1张牌，然后摸1张牌。当你打出最后1张手牌时，摸1张牌。
	 * */
	mjsjuehaoshanwu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsjuehaoshanwu" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			player: ["useCard", "respond"],
		},
		popup: false,
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const bool =
				!player.countCards("h") &&
				player.hasHistory("lose", function (evt) {
					return evt.hs?.length && evt.getParent() == trigger;
				});
			if (player.countCards("he")) {
				event.result = await player
					.chooseToDiscard(get.prompt(event.name), "你可以弃置1张牌，然后摸1张牌。", "he", "chooseonly")
					.set("ai", card => {
						const player = get.player();
						if (player.countCards("h") == 1 && player.hasUseTarget(card)) {
							return 0;
						}
						if (player.hasSkill("mjsyinguiganquan")) {
							return 9 - get.value(card);
						}
						return 7 - get.value(card);
					})
					.forResult();
			}
			if (event.result?.bool && event.result?.cards?.length) {
				player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
				await player.discard(event.result?.cards);
			}
			if (bool) {
				if (event.result?.bool) {
					game.trySkillAudio(event.name, player, null, null, [get.rand(3, 4)]);
				} else {
					player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
				}
			}
			await player.draw(Number(bool) + Number(event.result?.bool));
		},
	},
	/**迎归甘泉
	 * 限定，失去你的所有其他技能，然后获得弃牌堆中所有你弃置的牌。
	 * */
	mjsyinguiganquan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		filter(event, player) {
			return get.info("mjsyinguiganquan").getCards(player).length;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const skills = player.getSkills(null, false, false).filter(skill => {
				if (skill === event.name) {
					return false;
				}
				const info = get.info(skill);
				if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
					return false;
				}
				return true;
			});
			if (skills.length) {
				await player.removeSkills(skills);
			}
			const cards = get.info("mjsyinguiganquan").getCards(player);
			if (cards.length) await player.gain(cards, "gain2");
		},
		getCards(player) {
			return player
				.getAllHistory("lose", evt => {
					return evt.type == "discard" && evt.cards.someInD("d");
				})
				.slice()
				.map(evt => {
					return evt.cards.filterInD("d");
				})
				.flat();
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					const cards = get.info("mjsyinguiganquan").getCards(player);
					if (player.hasSkill("mjsjuehaoshanwu") && player.hasCard(card => player.hasUseTarget(card), "h")) {
						return 0;
					}
					const skills = player.getSkills(null, false, false).filter(skill => {
						if (skill === "mjsyinguiganquan") {
							return false;
						}
						const info = get.info(skill);
						if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
							return false;
						}
						return true;
					});
					if (skills.length) {
						return cards.length / 5 - skills.length;
					}
					return cards.length / 5;
				},
			},
		},
	},
	//吕不韦
	/**奇货可居
	 * 每个回合限1次，当你获得牌时，你可以将其中任意张牌交给一名其他角色，然后你摸1张牌。其他角色每累计打出4张获得过的你的牌后，你与其各摸2张牌。
	 * */
	mjsqihuokeju: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsqihuokeju" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			player: "gainAfter",
			global: ["gameDrawAfter", "loseAsyncAfter"],
		},
		usable: 1,
		silent: true,
		forced: false,
		priority: 15,
		filter(event, player) {
			if (!player.countCards("h")) return false;
			if (event.name == "gameDraw") return true;
			return event.getg?.(player)?.length > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard(card) {
						const player = get.player();
						const trigger = _status.event.getTrigger();
						return (trigger?.getg?.(player) ?? player.getCards("h")).includes(card);
					},
					selectCard: [1, Infinity],
					allowChooseAll: true,
					filterTarget: lib.filter.notMe,
					ai1(card) {
						const player = get.player();
						if (card.name == "mjslvshichunqiu") {
							return 0;
						}
						if (ui.selected.cards.length > 1) {
							return 0;
						}
						if (card.name != "du" && get.attitude(player, _status.currentPhase) < 0 && _status.currentPhase?.needsToDiscard()) {
							return -1;
						}
						if (card.name == "du") {
							return 20;
						}
						return 6.5 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						const att = get.attitude(player, target);
						if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
							if (target.hasSkillTag("nodu")) {
								return 0;
							}
							return 1 - att;
						}
						if (target.countCards("h") > player.countCards("h")) {
							return 0;
						}
						return att - 4;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
			await player.give(cards, target);
			await player.draw();
		},
		intro: {
			markcount(storage, player) {
				return player.countMark("mjsqihuokeju_counter");
			},
			content(storage, player) {
				return `已打出过${get.cnNumber(player.countMark("mjsqihuokeju_counter"))}张牌`;
			},
		},
		ai: {
			expose: 0.3,
			gain: true,
		},
		group: ["mjsqihuokeju_eternal", "mjsqihuokeju_use", "mjsqihuokeju_counter"],
		subSkill: {
			eternal: {
				trigger: {
					player: "gainAfter",
					global: ["gameDrawAfter", "loseAsyncAfter"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (!player.countCards("he")) return false;
					if (event.name == "gameDraw") return true;
					return event?.getg?.(player)?.length > 0;
				},
				async content(event, trigger, player) {
					//仅显示，实际无名杀技能结算用的记录
					let cards = player.getCards("h");
					player.addGaintag(cards, "eternal_mjsqihuokeju_tag");
				},
			},
			tag: {
				name: "奇",
			},
			use: {
				audio: "mjsqihuokeju",
				trigger: {
					global: ["useCardAfter", "respondAfter"],
				},
				silent: true,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					return event._mjsqihuokeju;
				},
				async content(event, trigger, player) {
					player.logSkill(event.name, trigger.player, null, null, [get.rand(3, 4)]);
					await game.asyncDraw([player, trigger.player], 2);
				},
			},
			counter: {
				trigger: {
					global: ["useCard1", "respond"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					return event.cards?.some(card => lib.skill.mjsyanxiugongchan.getCards(player).includes(card));
				},
				async content(event, trigger, player) {
					player.addMark(event.name, 1, false);
					if (player.countMark(event.name) % 4 === 0) {
						trigger._mjsqihuokeju = true;
					}
					player.markSkill("mjsqihuokeju");
				},
			},
		},
	},
	/**一字千金
	 * 当你累计打出或弃置7张牌后，添加1张吕氏春秋到你的手牌。
	 * 吕氏春秋：装备，防具，此牌无法被弃置，每个回合限1次，当你弃牌后，摸1张牌
	 * */
	mjsyiziqianjin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event._mjsyiziqianjin;
		},
		async content(event, trigger, player) {
			const card = game.createCard2("mjslvshichunqiu", "club", 1);
			if (card) {
				await player.gain(card, "gain2");
			}
		},
		intro: {
			markcount(storage, player) {
				return player.countMark("mjsyiziqianjin_counter");
			},
			content(storage, player) {
				return `已打出或弃置${player.countMark("mjsyiziqianjin_counter")}张牌`;
			},
		},
		group: "mjsyiziqianjin_counter",
		subSkill: {
			counter: {
				trigger: {
					player: ["useCard1", "respond", "loseAfter"],
					global: "loseAsyncAfter",
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (player.countMark("mjsyiziqianjin_counter") >= 7) {
						return false;
					}
					if (["useCard", "respond"].includes(event.name)) {
						return true;
					}
					if (event.type != "discard") {
						return false;
					}
					return event?.getl?.(player)?.cards2?.length > 0;
				},
				async content(event, trigger, player) {
					const num = trigger?.getl?.(player)?.cards2?.length || 1;
					player.addMark("mjsyiziqianjin_counter", num, false);
					player.markSkill("mjsyiziqianjin");
					if (player.countMark("mjsyiziqianjin_counter") >= 7) {
						trigger._mjsyiziqianjin = true;
						player.unmarkSkill("mjsyiziqianjin");
					}
				},
			},
		},
	},
	//姜维
	/**天水麒麟儿
	 * 出牌阶段限1次，你可以将任意1张牌当作调兵遣将打出。
	 * */
	mjstianshuiqiliner: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "mjsdiaobingqianjiang",
		},
		viewAsFilter(player) {
			if (!player.countCards("hes")) return false;
			return true;
		},
		filterCard: true,
		position: "hes",
		check(card) {
			return 8 - get.value(card);
		},
	},
	/**九伐中原
	 * 出牌阶段限1次，摸2张牌，出杀次数+1，并且出牌阶段结束时选择手牌上限-1或体力上限-1。
	 * */
	mjsjiufazhongyuan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			await player.draw(2);
			player.addTempSkill("mjsjiufazhongyuan_sha");
			player.addMark("mjsjiufazhongyuan_sha", 1, false);
			player.when("phaseUseEnd").then(async (event, trigger, player) => {
				const result = await player
					.chooseControl("手牌上限-1", "体力上限-1")
					.set("prompt", "请选择手牌上限-1或体力上限-1")
					.set("ai", () => {
						const player = get.player();
						if (player.maxHp == 1) return 0;
						if (player.hasSkill("mjsshizhikuanghan")) {
							if (
								!game.getGlobalHistory("everything", evt => {
									if (evt.name != "loseMaxHp" || evt.player != player) {
										return false;
									}
									return evt._mjsshizhikuanghan;
								}).length
							) {
								return 1;
							}
						}
						return 0;
					})
					.forResult();
				if (result.index == 0) {
					lib.skill.mjsallmax.change(player, -1);
				} else {
					await player.loseMaxHp();
				}
			});
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) - 0.1;
			},
			result: {
				player(player) {
					return player.hasSha();
				},
			},
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjsjiufazhongyuan_sha");
					},
				},
			},
		},
	},
	/**矢志匡汉
	 * 当你的体力值首次变为1时，你可以将所有牌交给一名其他角色，令其对另外一名其他角色打出所有杀，然后弃置所有牌。
	 * 当你的体力上限首次变为1时，你可以将所有牌交给一名其他角色，令其对另外一名其他角色打出所有杀，然后你与其受到其当前手牌数的伤害。
	 * */
	mjsshizhikuanghan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "changeHpEnd",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			if (player.storage.mjsshizhikuanghan_checkHistory) return false;
			const evts = game.getAllGlobalHistory("changeHp", (evt) => {
				return evt.player == player && evt.changedHp != 0 && (evt.originalHp + evt.changedHp == 1);
			});
		    if (evts.indexOf(event) !== 0) {
		       return false;
		    }
		    return true;
		},
		async cost(event, trigger, player) {
			player.setStorage("mjsshizhikuanghan_checkHistory", true);
			if (!player.countCards("he") || game.countPlayer(target => target != player) < 2) {
				return;
			}
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), 2, (card, player, target) => {
					if (target == player) {
						return false;
					}
					const cardx = get.autoViewAs({ name: "sha" }, "unsure");
					if (ui.selected.targets.length) {
						return ui.selected.targets[0].canUse(cardx, target);
					}
					return game.hasPlayer(current => {
						return current != player && target.canUse(cardx, current, false, false);
					});
				})
				.set("complexTarget", true)
				.set("targetprompt", ["交给", "目标"])
				.set("ai", target => {
					const player = get.player();
					if (ui.selected.targets.length) {
						const cards = player.getCards("h", "sha").addArray(ui.selected.targets[0].getCards("h", "sha"));
						return cards.reduce((sum, card) => {
							sum += get.effect(target, card, ui.selected.targets[0], player);
							return sum;
						}, 0);
					}
					return target.countCards("h", { name: "sha" });
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			player.logSkill(event.name, targets);
			const cards = player.getCards("he");
			if (!cards.length) {
				return;
			}
			await player.give(cards, targets[0]);
			if (targets[0].countCards("h", "sha")) {
				const cards = targets[0].getCards("h", { name: "sha" });
				for (const card of cards) {
					if (targets[0].canUse(card, targets[1], false, false)) {
						await targets[0].useCard(card, targets[1], false, "noai");
					}
				}
			}
			await targets[0].modedDiscard(targets[0].getCards("he"));
		},
	},
	//法正
	/**奇画策算
	 * 出牌阶段，当你打出牌时，若此牌点数等于你本回合累计打出的牌数，则获得2张与此牌点数相同的牌。
	 * */
	mjsqihuacesuan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			aiOrder(player, card, num) {
				if (!player.isPhaseUsing()) return;
				if (typeof card == "object") {
					const num = 1 + player.countMark("mjsqihuacesuan_counter");
					if (get.number(card) == num) {
						return num + 10;
					}
				}
			},
		},
		trigger: {
			player: ["useCard", "respond"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (!player.isPhaseUsing()) return false;
			return event._mjsqihuacesuan;
		},
		async content(event, trigger, player) {
			const cards = [];
			while (cards.length < 2) {
				const card = get.cardPile(card => {
					if (cards.includes(card)) return false;
					return get.number(card) == get.number(trigger.card);
				});
				if (card) {
					cards.push(card);
				} else {
					break;
				}
			}
			if (cards.length) {
				await player.gain(cards, "draw");
			}
		},
		group: "mjsqihuacesuan_mark",
		subSkill: {
			mark: {
				trigger: {
					player: ["useCard1", "respond"],
					global: "phaseBegin",
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					/*
					if (!player.countMark("mjsqihuacesuan_counter")) {
						player.addTempSkill("mjsqihuacesuan_counter");
						const num = game.getGlobalHistory("everything", evt => {
							return evt.player === player && ["useCard", "respond"].includes(evt.name) && evt !== trigger;
						}).length;
						if (num) {
							player.addMark("mjsqihuacesuan_counter", num, false);
						}
					}
					*/
					if (["useCard", "respond"].includes(trigger.name)) {
						player.addMark("mjsqihuacesuan_counter", 1, false);
					}
					if (player.countMark("mjsqihuacesuan_counter") === get.number(trigger.card)) {
						trigger._mjsqihuacesuan = true;
					}
					player.markSkill("mjsqihuacesuan_counter");
					player.removeGaintag("mjsqihuacesuan_counter");
					const cards = player.getCards("h", card => {
						return get.number(card) == (player.countMark("mjsqihuacesuan_counter") + 1);
					});
					if (cards.length) {
						player.addGaintag(cards, "mjsqihuacesuan_counter");
					}
				},
			},
			counter: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeGaintag(skill);
				},
				intro: {
					markcount(storage, player) {
						return player.countMark("mjsqihuacesuan_counter");
					},
					content(storage, player) {
						return `已打出过${player.countMark("mjsqihuacesuan_counter")}张牌`;
					},
				},
			},
		},
	},
	/**睚眦必报
	 * 每回合限1次，受伤，你可以查看并打出伤害来源的1张手牌，若其手牌均无法打出，你对其造成1点伤害。
	 * */
	mjsyazibibao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageEnd",
		},
		usable: 1,
		filter(event, player) {
			return event.source?.isIn();
		},
		check(event, player) {
			const target = event.source;
			const att = get.attitude(player, event.source);
			if (att > 0) {
				return target.countCards("h", "sha") > 1 && !target.getCardUsable("sha");
			}
			if (!target.countCards("h")) {
				return get.damageEffect(target, player, player) > 0;
			}
			return true;
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const target = trigger.source;
			const cards = target.getCards("h");
			if (!cards.length) {
				await target.damage();
				return;
			}
			const cards2 = cards.filter(card => {
				/*var cardx = {
					name: get.name(card, get.owner(card)),
					nature: get.nature(card, get.owner(card)),
					cards: [card],
				};*/
				var cardx = card;
				return player.hasUseTarget(cardx, null, false);
			});
			const result = await player
				.chooseButton(["###睚眦必报###是否使用其中一张牌", cards])
				.set("filterButton", button => {
					return get.event().cards.includes(button.link);
				})
				.set("cards", cards2)
				.set("ai", button => {
					var card = button.link;
					return _status.event.player.getUseValue(card);
				})
				.forResult();
			if (!cards2.length) {
				await target.damage();
				return;
			}
			if (result?.bool) {
				var card = result.links[0];
				/*var cardx = {
					name: get.name(card, get.owner(card)),
					nature: get.nature(card, get.owner(card)),
					cards: [card],
				};
				var next = player.chooseUseTarget(cardx, [card], true, false);
				if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
					next.viewAs = false;
				}*/
				await player.chooseUseTarget(card, true, false);
			}
		},
		ai: {
			maixie_defend: true,
			expose: 0.4,
			skillTagFilter(player, tag, arg) {
				if (player.storage?.counttrigger?.mjsyazibibao) {
					return false;
				}
			},
		},
	},
	//荆轲
	/**图穷匕见
	 * 出牌阶段限1次，当你失去最后手牌时，添加1张“♦8徐夫人匕首”和1张杀到你的手牌。
	 * 出牌阶段限1次，当你打出最后1张手牌时，添加1张“徐夫人匕首”和1张杀至你的手牌。
	 * */
	mjstuqiongbijian: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (!player.isPhaseUsing() || player.hasSkill("mjstuqiongbijian_used", null, null, false)) {
				return false;
			}
			if (player.countCards("h")) {
				return false;
			}
			return event.getl?.(player)?.hs?.length;
			//return ["useCard", "respond"].includes(event.getParent().name) && event.getl?.(player)?.hs?.length;
		},
		async content(event, trigger, player) {
			player.addTempSkill("mjstuqiongbijian_used", "phaseChange");
			const card = game.createCard("mjsxufurenbishou", lib.suit.randomGet(), get.rand(1, 8));
			const card2 = game.createCard("sha", lib.suit.randomGet(), get.rand(1, 8));
			const cards = [card, card2];
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	/**把袖而揕
	 * 出牌阶段限1次，你可以交出1张手牌给一名其他角色，令其与你的距离变为1，并且你对其造成的下一次伤害+1，直到回合结束。
	 * */
	mjsbaxiuerzhen: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		onremove(player, skill) {
			player.getStorage(`${skill}_buff`).forEach(target => {
				target?.removeSkill(`${skill}_debuff`);
			});
			player.removeSkill(`${skill}_buff`);
		},
		filter(event, player) {
			return player.countCards("h");
		},
		filterCard: true,
		check(card) {
			return 8 - get.value(card);
		},
		filterTarget: lib.filter.notMe,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const [target] = event.targets;
			await player.give(event.cards, target);
			target.addTempSkill("mjsbaxiuerzhen_debuff");
			target.markAuto("mjsbaxiuerzhen_debuff", [player]);
			player.addTempSkill("mjsbaxiuerzhen_buff");
			player.markAuto("mjsbaxiuerzhen_buff", [target]);
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return get.damageEffect(target, player);
				},
			},
		},
		subSkill: {
			debuff: {
				charlotte: true,
				onremove: true,
				mod: {
					globalTo(from, to, num) {
						if (to.getStorage("mjsbaxiuerzhen_debuff").includes(from)) {
							return -Infinity;
						}
					},
				},
				intro: {
					markcount: () => 0,
					content: "$本回合计算与你的距离视为1",
				},
			},
			buff: {
				mod: {
					globalFrom(from, to) {
						if (from.hasStorage("mjsbaxiuerzhen_buff", to)) {
							return -Infinity;
						}
					},
				},
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				async content(event, trigger, player) {
					player.unmarkAuto(event.name, [trigger.player]);
					trigger.num++;
				},
			},
		},
	},
	/**持匕掷柱
	 * 当你的杀被抵消后，你可以弃置1张武器牌，对目标角色造成1点伤害。
	 * */
	mjschibizhizhu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["shaMiss", "eventNeutralized"],
		},
		filter(event, player) {
			if (event.type !== "card" || event.card.name !== "sha" || !event.target.isIn()) {
				return false;
			}
			return player.countCards("he", card => {
				if (_status.connectMode && get.position(card) === "h") {
					return true;
				}
				return get.subtype(card) == "equip1";
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill, trigger.target), "he", { subtype: "equip1" }, "chooseonly")
				.set("ai", card => {
					let player = get.player();
					let trigger = _status.event.getTrigger();
					let eff = get.damageEffect(trigger.player, player, player);
					if (card.name == "mjsxufurenbishou") eff *= 1.8;
					return eff - get.value(card);
				})
				.forResult();
		},
		logTarget: "target",
		async content(event, trigger, player) {
			await player.discard(event.cards);
			await trigger.target.damage("nocard");
		},
	},
	//秦舞阳
	/**奉匣献图
	 * 其他角色出牌阶段限1次，其可以令你摸1张牌，然后你可以对其指定的另外一名角色打出杀。
	 * */
	mjsfengxiaxiantu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		global: "mjsfengxiaxiantu_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				prompt() {
					const player = get.player();
					const targets = game.filterPlayer(target => lib.skill.mjsfengxiaxiantu_global.filterTarget(null, player, target));
					let str = "令" + get.translation(targets);
					if (targets.length > 1) {
						str += "中的一人";
					}
					str += "摸1张牌，然后其可以对你指定的另外一名角色打出杀。";
					return str;
				},
				filter(event, player) {
					return game.hasPlayer(target => lib.skill.mjsfengxiaxiantu_global.filterTarget(null, player, target));
				},
				filterTarget(card, player, target) {
					if (!ui.selected.targets.length) {
						return target != player && target.hasSkill("mjsfengxiaxiantu") && !target.hasSkill("mjsfengxiaxiantu_used", null, null, false);
					}
					return ui.selected.targets[0].canUse({ name: "sha" }, target);
				},
				selectTarget: 2,
				complexTarget: true,
				targetprompt: ["来源", "目标"],
				multitarget: true,
				line: true,
				log: false,
				async precontent(event, trigger, player) {
					event.result.targets[0].logSkill("mjsfengxiaxiantu", player);
				},
				async content(event, trigger, player) {
					const { targets } = event;
					targets[0].addTempSkill("mjsfengxiaxiantu_used", "phaseUseEnd");
					await targets[0].draw();
					if (!targets[0].isIn() || !targets[1].isIn()) {
						return;
					}
					const result = await targets[0]
						.chooseToUse(
							function (card, player, event) {
								if (get.name(card) != "sha") {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							},
							"奉匣献图：对" + get.translation(targets[1]) + "使用一张杀"
						)
						.set("complexSelect", true)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("sourcex", targets[1])
						.forResult();
				},
				ai: {
					expose: 0.3,
					order: 1,
					result: {
						target: 5,
					},
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	/**燕有勇士
	 * 当你失去体力时，你可以令一名角色摸1张牌，并且令其造成下1次杀的伤害时，令目标角色中毒+1。
	 * */
	mjsyanyouyongshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "loseHpEnd",
		},
		silent: true,
		forced: false,
		locked: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "draw" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			await target.draw();
			target.addSkill("mjsyanyouyongshi_effect");
			target.addMark("mjsyanyouyongshi_effect", 1, false);
		},
		subSkill: {
			effect: {
				trigger: {
					source: "damageSource",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.card?.name == "sha";
				},
				async content(event, trigger, player) {
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					trigger.player.addSkill("mjs_debuff_zhongdu");
					trigger.player.addMark("mjs_debuff_zhongdu", num);
				},
				mark: true,
				intro: {
					content: "造成下1次杀的伤害时，令目标角色中毒+#",
				},
			},
		},
	},
	/**色变振恐
	 * 出杀，你失去1点体力。
	 * */
	mjssebianzhenkong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["useCard", "respond"],
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			player.loseHp();
		},
		ai: {
			neg: true,
			effect: {
				player_use(card, player) {
					if (card.name != "sha") {
						return;
					}
					if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 2) {
						return [0, -2];
					}
				},
			},
		},
	},
	//徐晃
	/**截粮焚辎
	 * 每个回合限1次，杀伤，你可以选择1种花色并烧毁目标所有此花色的牌，然后令一名角色摸等量的牌。
	 * */
	mjsjieliangfenzi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			source: "damageSource",
		},
		usable: 1,
		filter(event, player) {
			return event.card?.name == "sha" && event.player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseControl(lib.suit.slice(0), "cancel2")
				.set("prompt", get.prompt2(event.skill, trigger.player))
				.set("ai", () => {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					if (get.attitude(player, trigger.player) > 0) return "cancel2";
					const suits = trigger.player.getCards("he").reduce((list, card) => list.add(get.suit(card)), []);
					return suits.randomGet();
				})
				.forResult();
			if (event.result.control != "cancel2") {
				event.result.cost_data = event.result.control;
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const cards = trigger.player.getCards("he", card => {
				if (!lib.filter.cardCombustible(card, player, "mjsjieliangfenzi")) {
					return false;
				}
				return get.suit(card) == event.cost_data;
			});
			if (!cards.length) return;
			await trigger.player.lose(cards, "toBurnDown", ui.special);
			game.log(cards, "被烧毁了");
			const result = await player
				.chooseTarget(`${mjs.prompt(event.name)}，令一名角色摸${cards.length}张牌`, true)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "draw" }, player);
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.line(target);
				await target.draw(cards.length);
			}
		},
	},
	/**斧破重围
	 * 若你对目标打出的杀被抵消，你可以弃置1张牌，令此杀仍然造成伤害。
	 * */
	mjsfupochongwei: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["shaMiss", "eventNeutralized"],
		},
		filter(event, player) {
			if (event.type !== "card" || event.card.name !== "sha" || !event.target.isIn()) {
				return false;
			}
			return player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill, trigger.target), "he", "chooseonly")
				.set("ai", function (card) {
					var evt = _status.event.getTrigger();
					if (get.attitude(evt.player, evt.target) < 0) {
						if (evt.player.needsToDiscard()) {
							return 15 - get.value(card);
						}
						if (evt.baseDamage + evt.extraDamage >= Math.min(2, evt.target.hp)) {
							return 8 - get.value(card);
						}
						return 5 - get.value(card);
					}
					return -1;
				})
				.forResult();
		},
		logTarget: "target",
		async content(event, trigger, player) {
			await player.discard(event.cards);
			if (event.triggername === "shaMiss") {
				trigger.untrigger();
				trigger.trigger("shaHit");
				trigger._result.bool = false;
				trigger._result.result = null;
			} else {
				trigger.unneutralize();
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (player._mjsfupochongwei_temp) {
					return;
				}
				player._mjsfupochongwei_temp = true;
				var bool =
					get.attitude(player, arg.target) < 0 &&
					arg.card &&
					arg.card.name === "sha" &&
					player.countCards("he", function (card) {
						return card !== arg.card && (!arg.card.cards || !arg.card.cards.includes(card)) && get.value(card) < 5;
					});
				delete player._mjsfupochongwei_temp;
				return bool;
			},
		},
	},
	//张春华
	/**花落绝情
	 * 每个回合限1次，当你选择其他角色为打出牌的目标时，你可以失去1点体力，令其封禁。
	 * */
	mjshualuojueqing: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "useCardToPlayer",
		},
		usable: 1,
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			return event.targets?.length > 0 && !event.targets.includes(player);
		},
		check(event, player) {
			if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
				return false;
			}
			return event.targets.some(target => {
				if (!target.getSkills(null, false, false).length) return false;
				return get.attitude(player, target) <= 0;
			});
		},
		logTarget: "target",
		async content(event, trigger, player) {
			await player.loseHp();
			for (const target of trigger.targets) {
				target.addTempSkill("mjs_debuff_fengjin");
			}
		},
	},
	/**痛随伤逝
	 * 当一名角色失去体力时，你可以令另一名角色流血+1，然后你摸1张牌。
	 * */
	mjstongshuishangshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "loseHpEnd",
		},
		silent: true,
		forced: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					const trigger = _status.event.getTrigger();
					return target != trigger.player;
				})
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			target.addSkill("mjs_debuff_liuxue");
			target.addMark("mjs_debuff_liuxue", 1, false);
			await player.draw();
		},
	},
	//孙坚
	/**猛虎啸林
	 * 装备上限+1；当你的装备区获得或失去装备牌时，你打出的下1张杀的伤害+1。
	 * */
	mjsmenghuxiaolin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init(player) {
			player.mjsExpandEquip();
		},
		onremove(player) {
			player.mjsContractEquip();
		},
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			const evt = event.getl(player);
			if (event.name == "equip" && event.player == player) {
				return true;
			}
			return evt && evt.es.length;
		},
		getIndex(event, player) {
			const evt = event.getl(player);
			if (event.name == "equip" && event.player == player && evt && evt.es.length) {
				return 2;
			}
			return 1;
		},
		async content(event, trigger, player) {
			const skill = event.name + "_effect";
			player.addSkill(skill);
			player.addMark(skill, 1, false);
			return;
			player
				.when("useCard")
				.filter(evt => evt.card?.name == "sha")
				.then(async (event, trigger, player) => {
					trigger.baseDamage ??= 1;
					trigger.baseDamage++;
				});
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard",
				},
				popup: false,
				forced: true,
				locked: false,
				onremove: true,
				firstDo: true,
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					game.trySkillAudio("mjsmenghuxiaolin", player);
					trigger.baseDamage ??= 1;
					trigger.baseDamage += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				mark: true,
				marktext: "虎",
				intro: {
					content: "你打出的下1张杀的伤害+#",
				},
			},
		},
	},
	/**跨江击表
	 * 出牌阶段限1次，你可以弃置1张装备牌，对一名其他角色造成1点伤害，然后若你与此目标距离>1，随机添加1张装备牌至你的手牌。
	 * */
	mjskuajiangjibiao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", { type: "equip" });
		},
		filterCard(card) {
			return get.type(card) == "equip";
		},
		position: "he",
		check(card) {
			return 10 - get.value(card);
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const [target] = event.targets;
			await target.damage("nocard");
			if (get.distance(player, target) <= 1) return;
			const card = get.cardPile(
				card => {
					return get.type(card) == "equip";
				},
				null,
				"random"
			);
			if (card) await player.gain(card);
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return get.damageEffect(target, player);
				},
			},
		},
	},
	/**魂定江东
	 * 阵亡，你可以令一名其他角色的装备上限+2。
	 * */
	mjshundingjiangdong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "die",
		},
		popup: false,
		forceDie: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					let att = get.attitude(player, target);
					if (target.hasSkillTag("reverseEquip")) {
						att += 2;
					}
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			await target.mjsExpandEquip(2);
		},
	},
	//黄盖
	/**苦肉计
	 * 出牌阶段限1次，受到1点伤害，摸2张牌，本回合你造成的火焰伤害+1。
	 * */
	mjskurouji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		async content(event, trigger, player) {
			await player.damage();
			await player.draw(2);
			player.addTempSkill(event.name + "_effect");
			player.addMark(event.name + "_effect", 1, false);
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
						return 0;
					}
					if (get.damageEffect(player, player) < get.effect(player, { name: "wuzhong" }, player)) {
						return 1;
					}
					return player.countCards("hs", card => {
						return player.hasUseTarget(card) && get.tag(card, "fireDamage");
					});
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				locked: false,
				//charlotte: true,
				onremove: true,
				filter(event) {
					return event.hasNature("fire");
				},
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
				mark: true,
				intro: {
					content: "本回合你造成的火焰伤害+#",
				},
			},
		},
	},
	/**诈降焚舟
	 * 限定，将所有牌交给一名其他角色，对其造成1点火焰伤害，然后在其下回合开始时，烧毁这些牌。
	 * */
	mjszhaxiangfenzhou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard: true,
		position: "he",
		selectCard: -1,
		filterTarget: lib.filter.notMe,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const [target] = event.targets;
			await player.give(event.cards, target, "giveAuto");
			await target.damage("nocard", "fire");
			target.when("phaseBegin").then(async () => {
				const cards = target.getCards("he", card => {
					if (!lib.filter.cardCombustible(card, target, "mjszhaxiangfenzhou")) {
						return false;
					}
					return event.cards.includes(card);
				});
				if (cards.length) {
					await target.lose(cards, "toBurnDown");
					game.log(cards, "被烧毁了");
				}
			});
		},
		ai: {
			order: 0.1,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "fire");
				},
			},
		},
	},
	//吴国太
	/**甘露招亲
	 * 每个回合限1次，当一名角色成为杀的目标时，你可以展示其所有手牌，其中每存在1种类型的牌，就令其获得并装备1张装备牌。
	 * */
	mjsganluzhaoqin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "useCardToTarget",
		},
		usable: 1,
		filter(event, player) {
			return event.card.name == "sha" && event.target.isIn() && event.target.countCards("h");
		},
		check(event, player) {
			return get.attitude(player, event.target) > 0;
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target;
			const hs = target.getCards("h");
			if (!hs.length) return;
			const types = hs.reduce((list, card) => list.add(get.type2(card)), []);
			await target.showCards(hs);
			const cards = [];
			while (cards.length < types.length) {
				const card = get.cardPile(card => {
					return get.type(card) == "equip" && !cards.includes(card);
				});
				if (card) cards.push(card);
				else break;
			}
			for (const card of cards) {
				await target.gain(card);
				if (target.getCards("h").includes(card) && get.type(card, target) == "equip") {
					await target.chooseUseTarget(card, "nopopup", true);
				}
			}
		},
		ai: {
			threaten: 1.1,
			expose: 0.5,
			effect: {
				player_use(card, player, target, current) {
					if (_status._mjsganluzhaoqin_check) {
						return;
					}
					if (card.name != "sha" || get.attitude(player, target) <= 0 || target.countCards("e") >= 2 || player.storage?.counttrigger?.mjsganluzhaoqin) {
						return;
					}
					return [
						1,
						(() => {
							_status._mjsganluzhaoqin_check = true;
							const num = target.getCards("h").reduce((list, card) => list.add(get.type2(card)), []).length;
							delete _status._mjsganluzhaoqin_check;
							return num;
						})(),
					];
				},
			},
		},
	},
	/**刀斧藏恩
	 * 出牌阶段限1次，令一名角色将装备区的所有牌收回手牌。
	 * */
	mjsdaofucangen: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.mjsdaofucangen.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target.countCards("e") > 0;
		},
		async content(event, trigger, player) {
			await event.target.gain(event.target.getCards("e"), "gain2");
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					var att = get.attitude(player, target);
					if (att == 0) {
						return 0;
					}
					var es = target.getCards("e");
					var eff = 0;
					if (att > 0) {
						if (target.countCards("e", ["mjszhangbashemao", "mjsdaoli"])) eff++;
						if (target.countCards("e", ["baiyin", "mjsyinshikui"])) {
							var by = 3 - 0.6 * Math.min(5, target.hp);
							eff += get.sgn(get.recoverEffect(target, player, player)) * by;
						}
						return eff;
					}
					for (var i = 0; i < es.length; i++) {
						var val = get.equipValue(es[i], target);
						if (val <= 4) {
							if (att > 0) {
								return 1;
							}
						} else if (val >= 7) {
							if (att < 0) {
								return -1;
							}
						}
					}
					return 0;
				},
			},
		},
	},
	//曹仁
	/**誓盟据守
	 * 当你的体力值等于1时，你可以将任意牌当作闪打出。你在回合外每累计打出3张牌时，你回复1点体力。
	 * */
	mjsshimengjushou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsshimengjushou" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard: true,
		viewAs: {
			name: "shan",
		},
		position: "hes",
		prompt: "将一张牌当闪使用或打出",
		check(card) {
			return 1;
		},
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		popup: false,
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "chooseToUse") {
				return player.getHp(true) == 1 && player.countCards("hes");
			}
			return event._mjsshimengjushou;
		},
		log: false,
		async precontent(event, trigger, player) {
			player.logSkill("mjsshimengjushou", null, null, null, [get.rand(1, 2)]);
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
			player.recover();
		},
		marktext: "守",
		intro: {
			markcount(storage, player) {
				return player.countMark("mjsshimengjushou_counter");
			},
			content(storage, player) {
				return `已打出过${get.cnNumber(player.countMark("mjsshimengjushou_counter"))}张杀和闪`;
			},
		},
		group: "mjsshimengjushou_counter",
		subSkill: {
			counter: {
				trigger: {
					player: ["useCard1", "respond"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return _status.currentPhase != player;
				},
				async content(event, trigger, player) {
					player.addMark("mjsshimengjushou_counter", 1, false);
					if (player.countMark("mjsshimengjushou_counter") % 3 === 0) {
						trigger._mjsshimengjushou = true;
					}
					player.markSkill("mjsshimengjushou");
				},
			},
		},
	},
	/**奉法行令
	 * 其他角色在其回合内的非摸牌阶段获得战法牌时，你可以将其中随机1张转化为“笞”；其他角色在非弃牌阶段弃牌时，若其手牌中存在“笞”，你可以对其造成1点伤害。
	 * */
	mjsfengfaxingling: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:3",
		logAudio: index => "ext:名将杀/audio/skill/mjsfengfaxingling" + (typeof index === "number" ? index : get.rand(1, 3)) + ".mp3",
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		popup: false,
		filter(event, player) {
			const target = _status.currentPhase;
			if (!target?.isIn() || target == player) {
				return false;
			}
			if (event.name == "loseAsync" && event.type != "gain") return false;
			const evt = event.getParent("phaseDraw");
			if (evt?.player == target) {
				return false;
			}
			return event.getg?.(target)?.some(card => get.type2(card) == "trick");
		},
		logTarget: () => _status.currentPhase,
		check(event, player) {
			const target = _status.currentPhase;
			return get.attitude(player, target) <= 0;
		},
		prompt2: "其他角色在其回合内的非摸牌阶段获得战法牌时，你可以将其中随机1张转化为“笞”",
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
			const cards = trigger.getg(target).filter(card => get.type2(card) == "trick");
			if (cards.length) {
				const card = cards.randomGet();
				game.broadcastAll(function (card) {
					card.init([card.suit, card.number, "mjschi"]);
				}, card);
			}
		},
		group: "mjsfengfaxingling_discard",
		subSkill: {
			discard: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter"],
				},
				popup: false,
				getIndex(event, player) {
					if (event.type != "discard" || event.getlx === false) {
						return [];
					}
					return game
						.filterPlayer(target => {
							if (target == player || event.getParent("phaseDiscard")?.player == target) {
								return false;
							}
							return event.getl?.(target)?.cards2?.length;
						})
						.sortBySeat();
				},
				filter(event, player, triggername, target) {
					if (!target?.isIn() || event.getParent("phaseDiscard")?.player == target) {
						return false;
					}
					return target.countCards("h", { name: "mjschi" });
				},
				logTarget(event, player, triggername, target) {
					return target;
				},
				check(event, player, triggername, target) {
					return get.damageEffect(target, player, player) > 0;
				},
				prompt2: "你可以对其造成1点伤害",
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill("mjsfengfaxingling", target, null, null, [3]);
					target.damage();
				},
			},
		},
	},
	/**天人将军
	 * 其他角色体力值首次变为1时，你可以失去体力至1点，你每因此失去1点体力，就令其回复1点体力。
	 * */
	mjstianrenjiangjun: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "changeHpEnd",
		},
		filter(event, player) {
			if (event.player.hp != 1 || event.player == player) return false;
			if (event.player.storage.mjstianrenjiangjun_checkHistory) return false;
			const evts = game.getAllGlobalHistory("changeHp", (evt) => {
	            return evt.player == event.player && evt.changedHp != 0 && (evt.originalHp + evt.changedHp == 1);
	        });
	        if (evts.indexOf(event) !== 0) {
	           return false;
	        }
			return true;
		},
		check(event, player) {
			if (get.attitude(player, event.player) < 4) {
				return false;
			}
			if (player.countCards("hs", card => player.canSaveCard(card, event.player)) >= 1 - event.player.hp) {
				return false;
			}
			if (event.player == player || event.player == get.zhu(player)) {
				return true;
			}
			if (_status.currentPhase && get.damageEffect(_status.currentPhase, player, player) < 0) {
				return false;
			}
			if (get.recoverEffect(event.player, player, player) <= 0) {
				return false;
			}
			return !player.hasUnknown();
		},
		logTarget: "player",
		async cost(event, trigger, player) {
			trigger.player.setStorage("mjstianrenjiangjun_checkHistory", true);
			event.result = await player
				.chooseBool(get.prompt2(event.skill, trigger.player))
				.set("ai", () => get.info(event.skill).check(trigger, player))
				.forResult();
		},
		async content(event, trigger, player) {
			const num = player.hp - 1;
			if (num > 0) {
				await player.loseHp(num);
				const loseHp = num;
				await trigger.player.recover(loseHp);
			}
		},
	},
	//夏侯惇
	/**拔矢啖睛
	 * 受伤，你可以弃置1张牌，对伤害来源造成1点伤害，然后每局游戏限1次，你可以减1点体力上限，回复1点体力，并可以对目标打出1张具有强命的杀。
	 * */
	mjsbashidanjing: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsbashidanjing" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			player: "damageEnd",
		},
		popup: false,
		filter(event, player) {
			return event.source?.isIn() && player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill, trigger.source), "chooseonly", "he")
				.set("ai", card => {
					const { eff } = get.event();
					if (eff > 0) {
						return eff * 1.2 - get.value(card);
					}
					return 0;
				})
				.set(
					"eff",
					(() => {
						let source = trigger.source,
							eff = 0;
						if (trigger.source?.isIn()) {
							eff += Math.max(eff, get.damageEffect(trigger.source, player, player));
						}
						return eff;
					})()
				)
				.forResult();
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, trigger.source, null, null, [get.rand(1, 2)]);
			await player.discard(event.cards);
			await trigger.source.damage();
			if (player.storage[event.name]) return;
			const { bool } = await player
				.chooseBool(`你可以减1点体力上限，回复1点体力，并可以对${get.translation(trigger.source)}打出1张具有强命的杀`)
				.set("ai", () => {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					if (player.getDamagedHp() < 2) return false;
					return get.recoverEffect(player, player, player) > 0 && player.hasSha();
				})
				.forResult();
			if (bool) {
				player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
				player.setStorage(event.name, true);
				await player.loseMaxHp();
				await player.recover();
				await player
					.chooseToUse("是否对" + get.translation(trigger.source) + "打出一张具有强命杀？", function (card, player, event) {
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
					.set("sourcex", trigger.source)
					.set("oncard", () => {
						_status.event.directHit.addArray(game.filterPlayer());
					})
					.set("addCount", false);
			}
		},
	},
	/**清俭尊师
	 * 每个回合限1次，当你在回合外获得牌后，你可以将至少1张牌交给1名其他角色，然后添加等量杀至你的手牌，并且你下个出牌阶段的出杀次数+1。
	 * */
	mjsqingjianzunshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "gainAfter",
			global: ["gameDrawAfter", "loseAsyncAfter"],
		},
		usable: 1,
		filter(event, player) {
			if (!player.countCards("he")) return false;
			if (event.name == "gameDraw") return true;
			if (_status.currentPhase == player) return false;
			return event.getg?.(player)?.length > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					position: "he",
					filterCard: true,
					selectCard: [1, Infinity],
					allowChooseAll: true,
					filterTarget: lib.filter.notMe,
					ai1(card) {
						const player = get.player();
						if (ui.selected.cards.length > 1) return 0;
						if (card.name != "du" && get.attitude(player, _status.currentPhase) < 0 && _status.currentPhase?.needsToDiscard()) {
							return -1;
						}
						if (card.name == "du") {
							return 20;
						}
						return 6.5 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						const att = get.attitude(player, target);
						if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
							if (target.hasSkillTag("nodu")) {
								return 0;
							}
							return 1 - att;
						}
						if (target.countCards("h") > player.countCards("h")) {
							return 0;
						}
						return att - 4;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			await player.give(cards, target);
			const gains = [];
			while (gains.length < cards.length) {
				const card = game.createCard("sha", "diamond", get.rand(1, 8));
				if (card) gains.push(card);
				else break;
			}
			if (gains.length) {
				await player.gain(gains);
			}
			game.log(player, "下回合的", "#g出杀次数", "#y+1");
			player.when("phaseBegin").then(() => {
				player.addTempSkill("mjsqingjianzunshi_sha");
				player.addMark("mjsqingjianzunshi_sha", 1, false);
			});
		},
		ai: {
			expose: 0.3,
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjsqingjianzunshi_sha");
					},
				},
			},
		},
	},
	//张郃
	/**巧变善战
	 * 出牌阶段各限1次，你可以将1张行动牌或战法牌当作本局游戏未选择过的任意同类型牌打出。
	 * */
	mjsqiaobianshanzhan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "chooseToUse",
		filter(event, player) {
			return get
				.inpileVCardList(info => {
					if (player.hasStorage("mjsqiaobianshanzhan", info[2])) return false;
					if (player.hasStorage("mjsqiaobianshanzhan_used", info[0])) return false;
					return ["basic", "trick"].includes(info[0]);
				})
				.some(info =>
					player.hasCard(cardx => {
						if (get.type2(cardx) !== get.type(info[2])) {
							return false;
						}
						const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { mjsqiaobianshanzhan: true }, cards: [cardx] }, [cardx]);
						return event.filterCard(card, player, event);
					}, "hes")
				);
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (player.hasStorage("mjsqiaobianshanzhan", info[2])) return false;
					if (player.hasStorage("mjsqiaobianshanzhan_used", info[0])) return false;
					return ["basic", "trick"].includes(info[0]);
				});
				return ui.create.dialog("巧变善战", [list, "vcard"]);
			},
			filter(button, player) {
				const event = get.event().getParent();
				return player.hasCard(cardx => {
					if (get.type2(cardx) !== get.type(button.link[2])) {
						return false;
					}
					const card = get.autoViewAs({ name: button.link[2], nature: button.link[3], storage: { mjsqiaobianshanzhan: true }, cards: [cardx] }, [cardx]);
					return event.filterCard(card, player, event);
				}, "hes");
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] }, false);
			},
			prompt(links, player) {
				return "将一张牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
			backup(links, player) {
				return {
					filterCard(card, player) {
						return get.type2(card) === get.type2(get.card());
					},
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "hes",
					log: false,
					async precontent(event, trigger, player) {
						player.markAuto("mjsqiaobianshanzhan", [event.result.card.name]);
						player.addTempSkill("mjsqiaobianshanzhan_used", "phaseUseAfter");
						player.markAuto("mjsqiaobianshanzhan_used", [get.type2(event.result.card)]);
					},
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (player.hasStorage("mjsqiaobianshanzhan", name)) return false;
			if (!lib.inpile.includes(name) || !["basic", "trick"].includes(get.type(name))) {
				return false;
			}
			return player.hasCard(card => {
				if (_status.connectMode && get.position(card) === "h") {
					return true;
				}
				return get.type2(card) === get.type2(name);
			}, "hes");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				if (!player.countCards("hes")) {
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
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**应势布阵
	 * 受伤/回合结束，你可以摸1张牌，然后将至少1张牌放入“军阵”。出牌阶段限1次，你可以用至少1张牌替换“军阵”中等量的牌。你从“军阵”中获得的牌无法被其他角色响应。
	 * 回合结束，你可以将任意张牌放入“军阵”，然后手牌上限+1。出牌阶段限1次，你可以用任意张手牌替换“军阵”中等量的牌。你从“军阵”中获得的牌无法被其他角色响应。
	 * 回合结束，你可以将任意张牌放入“军阵”。出牌阶段限1次，你可以用任意张手牌替换“军阵”中等量的牌。你从“军阵”中获得的牌无法被其他角色响应。
	 * */
	mjsyingshibuzhen: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") && player.countExpansions("mjsyingshibuzhen");
		},
		async precontent(event, trigger, player) {
			const cards = player.getExpansions("mjsyingshibuzhen");
			const next = player.chooseToMove("应势布阵");
			next.set("list", [
				["军阵", cards],
				["手牌", player.getCards("he")],
			]);
			next.set("filterMove", (from, to) => {
				return typeof to != "number";
			});
			next.set("processAI", list => {
				let player = get.player(),
					cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
						return get.useful(a) - get.useful(b);
					}),
					cards2 = cards.splice(0, player.getExpansions("mjsyingshibuzhen").length);
				return [cards2, cards];
			});
			const {
				result: { bool, moved },
			} = await next.forResult();
			if (bool && moved?.length) {
				event.getParent().cost_data = moved;
				return;
			}
			player.addTempSkill("mjsyingshibuzhen_aiCheck", {
				player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
			});
			event.getParent().goto(0);
		},
		async content(event, trigger, player) {
			const moved = event.getParent(2).cost_data;
			const pushs = moved[0],
				gains = moved[1];
			pushs.removeArray(player.getExpansions("mjsyingshibuzhen"));
			gains.removeArray(player.getCards("he"));
			if (!pushs.length || pushs.length != gains.length) {
				return;
			}
			const next = player.addToExpansion(pushs);
			next.gaintag.add("mjsyingshibuzhen");
			await next;
			await player.gain(gains, "draw").set("gaintag", ["mjsyingshibuzhen_tag"]);
		},
		ai: {
			order: 13,
			result: {
				player: 1,
			},
		},
		marktext: "军阵",
		intro: {
			markcount: "expansion",
	        mark(dialog, content, player) {
	            var content = player.getExpansions("qixing");
	            if (content && content.length) {
	              if (player == game.me || player.isUnderControl()) {
	                dialog.addAuto(content);
	              } else {
	                return "共有" + get.cnNumber(content.length) + "张牌";
	              }
	            }
	        },
	        content(content, player) {
	            var content = player.getExpansions("qixing");
	            if (content && content.length) {
	              if (player == game.me || player.isUnderControl()) {
	                return get.translation(content);
	              }
	              return "共有" + get.cnNumber(content.length) + "张牌";
	            }
	        },
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: ["mjsyingshibuzhen_use", "mjsyingshibuzhen_put"],
		subSkill: {
			aiCheck: {
				charlotte: true,
				ai: {
	            	skill_aiCheck: true,
	            },
			},
			tag: {
				name: "军阵",
			},
			use: {
				trigger: {
					player: "useCard",
				},
				silent: true,
				popup: true,
				filter(event, player) {
					return player.hasHistory("lose", evt => evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.includes("mjsyingshibuzhen_tag")));
				},
				async content(event, trigger, player) {
					const targets = game.filterPlayer(target => target != player);
					trigger.directHit.addArray(targets);
					game.log(trigger.card, "不可被响应");
				},
			},
			put: {
				audio: "mjsyingshibuzhen",
				trigger: {
					player: ["damageEnd", "phaseEnd"],
				},
				silent: true,
				popup: true,
				forced: false,
				prompt2: "你可以摸1张牌，然后将至少1张牌放入“军阵”。",
				async content(event, trigger, player) {
					await player.draw();
					const cards = player.getCards("he");
					if (!cards.length) {
						return;
					}
					const result = cards.length == 1 ? { bool: true, cards: cards } : await player.chooseCard("he", [1, Infinity], "allowChooseAll", true, "选择将至少1张牌放入“军阵”").forResult();
					if (result?.bool && result?.cards?.length) {
						const next = player.addToExpansion(result.cards, player, "give");
						next.gaintag.add("mjsyingshibuzhen");
						await next;
					}
				},
			},
		},
	},
	/**虓虎悍将
	 * 限定，“军阵”中每有1张牌，你摸1张牌。
	 * */
	mjshuhuhanjiang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		filter(event, player) {
			return player.countExpansions("mjsyingshibuzhen");
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = player.countExpansions("mjsyingshibuzhen");
			await player.draw(num);
		},
		ai: {
			combo: "mjsyingshibuzhen",
			order() {
				return get.order("mjsyingshibuzhen") - 1;
			},
			result: {
				player(player) {
					const eff = get.effect(player, { name: "draw" }, player);
					const num = player.countExpansions("mjsyingshibuzhen");
					if (game.countPlayer() == 2 && num <= player.getHp()) {
						return 0;
					}
					return eff * num;
				},
			},
		},
	},
	//曹丕
	/**嗣承魏武
	 * 受伤，随机获得伤害来源1张牌，并且获得对你造成伤害的牌。
	 * */
	mjssichengweiwu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		logTarget: "source",
		async content(event, trigger, player) {
			if (trigger.source?.isIn()) {
				const cards = trigger.source.getGainableCards(player, trigger.source == player ? "h" : "he");
				if (cards.length) {
					await player.gain(cards.randomGets(1), trigger.source, "giveAuto", "bySelf");
				}
			}
			if (get.itemtype(trigger.cards) == "cards" && get.position(trigger.cards[0], true) == "o") {
				await player.gain(trigger.cards, "gain2");
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage")) {
						return [1, 0.55];
					}
				},
			},
		},
	},
	/**燕歌行吟
	 * 每个回合限1次，当你选择杀的目标时，你可以弃置目标2张牌，若此杀造成伤害，令其摸2张牌。
	 * 每个回合限1次，当你选择杀的目标时，你可以弃置目标2张牌，若此杀造成伤害，令其摸2张牌，并获得中毒+1，否则你回复1点体力值。
	 * */
	mjsyangexingyin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "useCardToPlayer",
		},
		silent: true,
		forced: false,
		usable: 1,
		filter(event, player) {
			return event.card.name == "sha";
			return event.card.name == "sha" && event.target.countDiscardableCards(player, "he");
		},
		async cost(event, trigger, player) {
			const target = trigger.target;
			const cards = target.getDiscardableCards(player, "he");
			if (cards.length <= 2) {
				event.result = await player
					.chooseBool(get.prompt2(event.skill, target))
					.set("ai", () => {
						return get.event().goon;
					})
					.set(
						"goon",
						(() => {
							const att = get.attitude(player, target);
							if (att > 0) {
								return false;
							}
							return get.effect(target, { name: "guohe_copy2", position: "he" }, player) * 2 > 0;
						})()
					)
					.forResult();
				if (event.result?.bool) {
					event.result.cards = cards;
				}
			} else {
				event.result = await player.discardPlayerCard(target, "he", 2).set("prompt", get.prompt(event.skill, target)).set("chooseonly", true).set("forceAuto", true).forResult();
			}
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			player.logSkill(event.name, target);
			if (event.cards?.length) {
				await target.discard(event.cards).set("discarder", player);
			}
			target.addTempSkill("mjsyangexingyin_ai");
			trigger.card._mjsyangexingyin = true;
			player
				.when("useCardAfter")
				.filter(evt => evt.card == trigger.card)
				.then(async (event, trigger, player) => {
					if (player.hasHistory("sourceDamage", evt => evt.card == trigger.card && evt.player == target)) {
						await target.draw(2);
					}
				});
		},
		subSkill: {
			ai: {
				noShan: true,
                skillTagFilter(player, tag, arg) {
                    const evt = _status.event.getParent("useCard");
                    if (!evt) {
                        return false;
                    }
                    const num = evt.baseDamage + evt.extraDamage;
                    const eff = get.effect(player, { name: "draw" }, player) * 2;
                    if ((() => {
                        if (!evt.card?._mjsyangexingyin) {
                            return true;
                        }
                        if (num > 1) {
                            return true;
                        }
                        if (eff <= 0) {
                        	return true;
                        }
                        if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= num) {
                        	return true;
                        }
                        return false;
                    })()) {
                        return false;
                    }
                    return true;
                },
			},
		},
	},
	/**禅让受封
	 * 限定，当一名其他角色阵亡时，你可以选择其1个技能，转移给自己。
	 * */
	mjsshanrangshoufeng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "die",
		},
		limited: true,
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event.player != player;
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			const skills = target.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				if (!info || info.charlotte || !get.skillInfoTranslation(skill, target).length) {
					return false;
				}
				return true;
			});
			if (!skills.length) {
				return;
			}
			const list = [target.name];
			let num = 0,
				skillMap = {};
			for (const i of list) {
				if (skills.length > num) {
					num = skills.length;
				}
				skillMap[i] = skills;
			}
			if (num == 0) {
				return;
			}
			event.result = await player
				.chooseButton(
					[
						[[`###${get.translation(event.skill)}###选择一个技能获得`], "addNewRow"],
						[
							dialog => {
								dialog.css({
									top: get.is.phoneLayout() ? "5%" : "45%",
								});
								const { list, skillMap } = get.event();
								//算出来需要多少列，最多八列
								const num = 8;
								const column = Math.min(list.length, num);
								if (column > 6) {
									dialog.css({
										width: "100%",
										left: 0,
									});
								}
								//重新创建一个容器，不然css之后会导致dialog.content内的其他元素也加入到布局中
								const contentx = ui.create.div(".content", dialog.content);
								contentx.css({
									display: "grid",
									gridTemplateColumns: `repeat(${column}, 1fr)`,
									width: "fit-content",
									margin: "auto",
								});
								//一个一个塞进去
								for (const i of list) {
									const div = ui.create.div(".buttons", contentx);
									const button = ui.create.button(i, "character", div);
									const skills = skillMap[i];
									//让角色和技能按钮水平居中垂直排列
									div.css({
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									});
									//角色因为不是可选按钮所以需要调整一下透明度
									button.style.setProperty("opacity", "1", "important");
									if (skills.length) {
										//创建技能按钮
										const buttons = ui.create.buttons(
											skills.map(i => [i, get.translation(i)]),
											"tdnodes",
											div
										);
										//丢进可选按钮中
										dialog.buttons = dialog.buttons.concat(buttons);
									}
								}
							},
							"handle",
						],
					],
				)
				.set("list", list.slice())
				.set("skillMap", skillMap)
				.forResult();
			if (event.result?.bool && event.result.links?.length) {
				event.result.cost_data = event.result.links;
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const skill = event.cost_data[0];
			const createSkills = mjs.addCreateSkills(skill);
			const info = trigger.player.storage[skill];
			await trigger.player.removeSkills(skill);
			player.setStorage(createSkills[0], info);
			await player.addSkills(createSkills);
		},
		ai: {
			threaten: 3,
		},
	},
	//曹植
	/**才高八斗
	 * 当你打出酒后，翻开堆顶的1张牌，并且你可以立即打出此牌，或者令一名角色获得此牌，然后随机弃置1张牌。 
	 * 当你打出酒后，翻开堆顶的1张牌，并且你可以立即打出此牌。
	 * */
	mjscaigaobadou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.card.name == "jiu";
		},
		async content(event, trigger, player) {
			const cards = get.cards();
			await game.cardsGotoOrdering(cards);
			game.log(player, "翻开牌堆顶的", cards);
			const card = cards[0];
			event.videoId = lib.status.videoId++;
			const createDialog = function (player, card, id) {
				const dialog = ui.create.dialog("forcebutton", true);
				dialog.classList.add("mj-flip");
				dialog.videoId = id;
				const buttons = ui.create.div(".buttons", dialog.content);
				buttons.appendChild(card);
				dialog.open();
				ui.create.cardSpinning(card);
			};
			const closeDialog = function (id) {
				const dialog = get.idDialog(id);
				if (dialog) {
					dialog.close();
				}
			};
			game.broadcastAll(createDialog, player, card, event.videoId);
			await game.delay(2);
			if (player.hasUseTarget(card)) {
				const next = player.chooseUseTarget(card, false);
				next.set("oncard", () => {
					game.broadcastAll(closeDialog, event.videoId);
				});
				event.result = await next.forResult();
			} else {
				event.result = { bool: false };
			}
			if (event.result?.bool) {
				return;
			}
			await game.delay(2);
			const result = await player
				.chooseTarget(`请选择令一名角色获得${get.translation(card)}，然后随机弃置1张牌`)
				.set("ai", target => {
					const { player, card } = get.event();
					return get.sgnAttitude(player, target) * target.getUseValue(card);
				})
				.set("card", card)
				.forResult();
			game.broadcastAll(closeDialog, event.videoId);
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				await target.gain(card, "gain2");
				const cards = target.getDiscardableCards(player, "he");
				if (cards.length) {
					await target.discard(cards.randomGets(1));
				}
			}
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (card.name == "jiu") {
						return [1, 1];
					}
				},
			},
		},
	},
	/**七步七哀
	 * 你可以将♣牌当酒打出。当你在出牌阶段弃牌时，摸1张牌。
	 * */
	mjsqibuqiai: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "chooseToUse",
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filterCard(card) {
			return get.suit(card) == "club";
		},
		viewAs: {
			name: "jiu",
		},
		position: "hes",
		viewAsFilter(player) {
			if (!player.hasCard(card => get.suit(card) == "club", "hes")) return false;
			return true;
		},
		check(card) {
			if (get.itemtype(card) !== "card") {
				return true;
			}
			if (get.event().type == "dying") {
				return 1 / Math.max(0.1, get.value(card));
			}
			return 4 - get.value(card);
		},
		prompt: "将一张♣牌当酒使用",
		filter(event, player) {
			if (event.name == "chooseToUse") {
				return player.hasCard(card => get.suit(card) == "club", "hes");
			}
			if (event.type != "discard" || !player.isPhaseUsing()) {
				return false;
			}
			return event.getl && event.getl(player)?.cards2?.length;
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			player.draw();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (!target.isPhaseUsing()) return;
					if (get.tag(card, "discard")) {
						return [1, 0.6];
					}
				},
			},
		},
	},
	//卫青
	/**直捣龙城
	 * 登场，令你对其他角色打出的下1张杀的攻击范围无限，并且具有强命，封禁，贯穿，伤害+1。
	 * */
	mjszhidaohuanglong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "changeSkillsAfter"],
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		filter(event, player) {
			if (event.name == "changeSkills") {
				return event.addSkill.includes("mjszhidaohuanglong");
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			player.addSkill("mjszhidaohuanglong_effect");
		},
		subSkill: {
			effect: {
				mod: {
					targetInRange(card, player, target) {
						if (card.name == "sha" && target != player) return true;
					},
				},
				trigger: {
					player: "useCardToPlayer",
				},
				silent: true,
				popup: true,
				locked: false,
				filter(event, player) {
					return event.card.name == "sha" && event.target != player;
				},
				logTarget: "target",
				async content(event, trigger, player) {
					const target = trigger.target,
						card = trigger.card;
					trigger.getParent().directHit.addArray(game.filterPlayer());
					game.log(card, "不可被响应");
					target.addTempSkill("mjs_debuff_fengjin");
					target.addTempSkill("qinggang2");
					target.storage.qinggang2.add(card);
					game.log(card, "无视防具");
					const id = trigger.target.playerid;
					const map = trigger.getParent().customArgs;
					if (!map[id]) {
						map[id] = {};
					}
					if (typeof map[id].extraDamage != "number") {
						map[id].extraDamage = 0;
					}
					map[id].extraDamage++;
					game.log(card, "伤害+1");
					player.removeSkill(event.name);
				},
				mark: true,
				intro: {
					content: "你对其他角色打出的下1张杀的攻击范围无限，并且具有强命，封禁，贯穿，伤害+1",
				},
			},
		},
	},
	/**车骑合战
	 * 游戏开始和回合开始时，若你的装备区没有武刚车，添加并装备武刚车；其他角色装备坐骑牌时，你可以令你装备区的武刚车复制其效果，每个武刚车每个坐骑牌限复制1次。当你失去武刚车时，重置你的其他技能。
	 * 武刚车：♦-6，坐骑，应战，目标需要弃置1张手牌，否则令其此杀无效。
	 * */
	mjscheqihezhan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseBegin"],
		},
		forced: true,
		locked: false,
		priority: -12,
		filter(event, player, name) {
			if (player.getEquips("mjswugangche").length) return false;
			return name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			if (!player.getEquips("mjswugangche").length) {
				const card = game.createCard("mjswugangche", "diamond", 6);
				player.$gain2(card);
				await game.delayx();
				await player.equip(card);
			}
		},
		broadcast(card) {
			game.broadcast(
				(card, storage) => {
					card.storage = storage;
				},
				card,
				card.storage
			);
		},
		update(player) {
			const skills = player
				.getEquips("mjswugangche")
				.reduce((list, card) => list.add(card.storage.mjscheqihezhan), [])
				.reduce((list, name) => {
					const info = get.info({ name: name });
					if (info?.skills?.length) {
						if (Array.isArray(info.skills)) list.addArray(info.skills);
						else list.add(info.skills);
					}
					return list;
				}, [])
				.toUniqued();
			player.addAdditionalSkill("mjswugangche", skills);
		},
		group: ["mjscheqihezhan_use", "mjscheqihezhan_restore"],
		subSkill: {
			use: {
				audio: "mjscheqihezhan",
				trigger: {
					global: "equipAfter",
				},
				filter(event, player) {
					if (event.player == player || !player.getEquips("mjswugangche").length) {
						return false;
					}
					const list = event.cards.reduce((list, card) => list.add(card.name), []);
					if (player.getEquips("mjswugangche").every(card => card?.storage?.mjscheqihezhan?.containsAll(...list))) {
						return false;
					}
					const subtypes = get.subtypes(event?.card || event?.cards[0]);
					return event.cards?.length > 0 && event.cards.some(card => [3, 4, 6].map(str => "equip" + str).some(item => get.subtypes(card).includes(item)));
				},
				prompt2(event, player) {
					const list = event.cards.reduce((list, card) => list.add(card.name), []);
					return `你可以复制${get.translation(list)}的效果。`;
				},
				async content(event, trigger, player) {
					const skills = get.skillsFromEquips(trigger.cards);
					const list = trigger.cards.reduce((list, card) => list.add(card.name), []);
					const cards = player.getEquips("mjswugangche");
					for (const card of cards) {
						card.storage ??= {};
						card.storage.mjscheqihezhan ??= [];
						card.skills ??= [];
						card.storage.mjscheqihezhan.addArray(list);
						lib.skill.mjscheqihezhan.broadcast(card);
						const bool = get.position(card) == "e";
						if (bool) {
							player.removeEquipTrigger(card.card || card);
						}
						const origin_skills = [];
						if (card?.storage?.mjsstrengthen) {
							const skills2 = get.info({ name: "mjswugangche" }).mjsStrengthenedSkills;
							if (skills2.length) {
								origin_skills.addArray(skills2);
							}
						} else {
							const skills2 = get.info({ name: "mjswugangche" }).skills;
							if (skills2.length) {
								origin_skills.addArray(skills2);
							}
						}
						if (origin_skills.length) {
							card.skills.addArray(origin_skills);
						}
						if (skills.length) {
							card.skills.addArray(skills);
						}
						game.broadcastAll(
							(card, bool, player) => {
								let vcard = card[card.cardSymbol];
								if (bool && vcard && player.vcardsMap?.equips) {
									const cardx = get.autoViewAs(card, void 0, false);
									player.vcardsMap.equips[player.vcardsMap.equips.indexOf(vcard)] = cardx;
									card[card.cardSymbol] = cardx;
								}
							},
							card,
							bool,
							player
						);
						if (bool) {
							player.addEquipTrigger(card.card || card);
						}
					}
					/*
					const cards = player.getEquips("mjswugangche");
					for (const card of cards) {
						if (!card.storage) card.storage = {};
						if (!card.storage.mjscheqihezhan) card.storage.mjscheqihezhan = [];
						card.storage.mjscheqihezhan.addArray(trigger.cards.map(card => card.name));
						lib.skill.mjscheqihezhan.broadcast(card);
					}
					lib.skill.mjscheqihezhan.update(player);
					*/
				},
			},
			restore: {
				audio: "mjscheqihezhan",
				trigger: {
					player: "loseEnd",
					global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return (event?.getl?.(player)?.cards2 || []).some(card => card.name == "mjswugangche");
				},
				async content(event, trigger, player) {
					var skills = player.getSkills(null, false, false).filter(skill => {
						if (skill == "mjscheqihezhan") return false;
						var info = get.info(skill);
						return info && !info.charlotte && get.skillInfoTranslation(skill, player).length;
					});
					if (skills.length) {
						await player.removeSkills(skills, false);
						await player.addSkills(skills, false);
						player.refreshSkill(skills);
					}
				},
			},
		},
	},
	//霍去病
	/**何以家为
	 * 回合结束时，若你本回合没有造成过伤害，你可以摸3张牌，立即进行一个额外出牌阶段，此阶段结束时，你失去1点体力上限。
	 * */
	mjsheyijiawei: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseEnd",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return !player.hasHistory("sourceDamage");
		},
		check(event, player) {
			return player.maxHp > 2;
		},
		async content(event, trigger, player) {
			await player.draw(3);
			player
				.when("phaseUseEnd")
				.filter(evt => evt._extraPhaseReason == "mjsheyijiawei")
				.then(() => {
					player.loseMaxHp();
				});
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
	},
	/**封狼居胥
	 * 当你造成其他角色重伤时，你可以选择其1个技能，转移给你。
	 * 转移：保持目标技能的所有状态，将技能的所有者更换。也就是封狼居胥会让目标失去技能，霍去病永久获得目标失去的技能
	 * */
	mjsfenglangjuxu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			source: "dying",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event.player != player;
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			const skills = target.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				if (!info || info.charlotte || !get.skillInfoTranslation(skill, target).length) {
					return false;
				}
				return true;
			});
			if (!skills.length) return;
			const list = [target.name];
			let num = 0,
				skillMap = {};
			for (const i of list) {
				if (skills.length > num) {
					num = skills.length;
				}
				skillMap[i] = skills;
			}
			if (num == 0) {
				return;
			}
			event.result = await player
				.chooseButton(
					[
						[[`###${get.translation(event.skill)}###选择一个技能获得`], "addNewRow"],
						[
							dialog => {
								dialog.css({
									top: get.is.phoneLayout() ? "5%" : "45%",
								});
								const { list, skillMap } = get.event();
								//算出来需要多少列，最多八列
								const num = 8;
								const column = Math.min(list.length, num);
								if (column > 6) {
									dialog.css({
										width: "100%",
										left: 0,
									});
								}
								//重新创建一个容器，不然css之后会导致dialog.content内的其他元素也加入到布局中
								const contentx = ui.create.div(".content", dialog.content);
								contentx.css({
									display: "grid",
									gridTemplateColumns: `repeat(${column}, 1fr)`,
									width: "fit-content",
									margin: "auto",
								});
								//一个一个塞进去
								for (const i of list) {
									const div = ui.create.div(".buttons", contentx);
									const button = ui.create.button(i, "character", div);
									const skills = skillMap[i];
									//让角色和技能按钮水平居中垂直排列
									div.css({
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									});
									//角色因为不是可选按钮所以需要调整一下透明度
									button.style.setProperty("opacity", "1", "important");
									if (skills.length) {
										//创建技能按钮
										const buttons = ui.create.buttons(
											skills.map(i => [i, get.translation(i)]),
											"tdnodes",
											div
										);
										//丢进可选按钮中
										dialog.buttons = dialog.buttons.concat(buttons);
									}
								}
							},
							"handle",
						],
					],
				)
				.set("list", list.slice())
				.set("skillMap", skillMap)
				.forResult();
			if (event.result?.bool) {
				event.result.cost_data = event.result.links;
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const skill = event.cost_data[0];
			const info = trigger.player.storage[skill];
			const createSkills = mjs.addCreateSkills(skill);
			await trigger.player.removeSkills(skill);
			//先转移状态再获得技能，避免登场触发的技能状态被覆盖
			player.setStorage(createSkills[0], info);
			await player.addSkills(createSkills);
		},
	},
	/**饮马翰海
	 * 造成伤害后，摸1张牌。
	 * */
	mjsyinmahanhai: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			source: "damageSource",
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		content() {
			player.draw();
		},
	},
	//刘彻
	/**攻守势易
	 * 每个回合限1次，当你成为其他角色打出牌的目标时，若你的手牌数小于对方，你可以令一名角色添加其随机1张手牌的复制，若你的手牌数大于对方，你可以销毁一名角色2张牌。
	 * */
	mjsgongshoushiyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			target: "useCardToTarget",
		},
		usable: 1,
		silent: true,
		popup: false,
		forced: false,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return player.countCards("h") != event.player.countCards("h");
		},
		async cost(event, trigger, player) {
			const bool = Boolean(player.countCards("h") < trigger.player.countCards("h"));
			const prompt2 = bool ? `令1名角色获得${get.translation(trigger.player)}随机1张手牌的复制` : "销毁一名角色2张牌";
			event.result = await player
				.chooseTarget(get.prompt(event.skill), prompt2, (card, player, target) => {
					if (get.event().bool) {
						return true;
					}
					return target.countCards("he");
				})
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (get.event().bool) {
						return att;
					}
					return -att;
				})
				.set("bool", bool)
				.forResult();
			if (event.result?.targets?.length) {
				event.result.cost_data = bool;
			}
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			if (event.cost_data) {
				if (!trigger.player.countCards("h")) {
					return;
				}
				const card = trigger.player.getCards("h").randomGet();
				if (card) {
					var cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
					if (cardx) {
						await target.gain(cardx, "draw");
					}
				}
			} else {
				const cards = target.getCards("he", card => lib.filter.cardDestuctible(card, target, "mjsgongshoushiyi"));
				if (!cards.length) {
					return;
				}
				const result = await player
					.choosePlayerCard(target, "he", Math.min(2, cards.length), true)
					.set("filterButton", button => {
						return lib.filter.cardDestuctible(button.link, get.owner(button.link), "mjsgongshoushiyi");
					})
					.set("prompt", get.translation(event.name))
					.set("prompt2", `选择销毁${get.translation(target)}的2张牌`)
					.set("ai", button => {
						return get.value(button.link);
					})
					.forResult();
				if (result?.cards?.length) {
					const cards = result.cards;
					game.log(cards, "被销毁了");
					await target.lose(cards, "toDestroy", ui.special);
				}
			}
		},
		ai: {
			threaten: 0.2,
			effect: {
				target(card, player, target) {
					if (target.storage?.counttrigger?.mjsgongshoushiyi) {
						return;
					}
					let hs = player.getCards("h", (i2) => i2 !== card && (!card.cards || !card.cards.includes(i2)));
					if (hs.length == target.countCards("h")) {
						return;
					}
					if (hs.length > target.countCards("h")) {
						return [1, 0.5];
					} 
					if (game.hasPlayer(current2 => {
						return get.attitude(target, current2) < 0 && current2.countCards("he")
					})) {
						return [1, 2];
					}
				},
			},
		},
	},
	/**推恩令
	 * 所有其他角色摸牌阶段改为摸1张牌，然后左右两侧的角色各摸1张牌。
	 * */
	mjstuienling: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseDrawBegin2",
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return !event.numFixed;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			// 实际效果是少摸一张牌
			//trigger.changeToZero();
			//await trigger.player.draw();
			// 酣战
			//trigger.num = 1;
			//trigger.numFixed = true;
			trigger.num -= 1;
			const targets = game
				.filterPlayer(target => {
					return target != trigger.player && get.distance(trigger.player, target, "pure") <= 1;
				})
				.toUniqued()
				.sortBySeat(trigger.player);
			if (targets.length) {
				//注意韩非的进厂时机
				player.logSkill(event.name);
				await game.asyncDraw(targets);
			}
		},
	},
	/**轮台罪己
	 * 当你第1次失去最后的手牌时，你可以体力上限-1，回复所有体力值，并摸牌至手牌上限。
	 * */
	mjsluntaizuiji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		global: "mjsluntaizuiji_history",
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (player.countCards("h")) {
				return false;
			}
			if (
				player
					.getAllHistory("lose", evt => {
						return evt._mjsluntaizuiji_history;
					})
					.indexOf(event) != 0
			) {
				return false;
			}
			const evt = event.getl(player);
			return evt && evt.player == player && evt.hs && evt.hs.length > 0;
		},
		check(event, player) {
			return player.maxHp > 1;
		},
		async content(event, trigger, player) {
			await player.loseMaxHp();
			await player.recoverTo(player.maxHp);
			await player.drawTo(player.getHandcardLimit());
		},
		subSkill: {
			history: {
				trigger: {
					player: "loseEnd",
					global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				silent: true,
				charlotte: true,
				filter(event, player) {
					if (player.countCards("h")) {
						return false;
					}
					const evt = event.getl(player);
					return evt && evt.player == player && evt.hs && evt.hs.length > 0;
				},
				async content(event, trigger, player) {
					trigger.set("_mjsluntaizuiji_history", true);
				},
			},
		},
	},
	//卫子夫
	/**平阳讴者
	 * 当你打出牌后，弃置1张牌；当你失去最后的手牌后，添加你当前回合弃置牌的复制，并且将此技能改为“当你打出牌后，令一名其他角色添加1张此牌的复制”。
	 * */
	mjspingyanouzhe: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			player: "useCardAfter",
		},
		silent: true,
		filter(event, player) {
			if (!player.storage.mjspingyanouzhe) {
				return player.countCards("he");
			}
			return !player.hasStorage("mjspingyanouzhe_used", event.card.name);
		},
		async content(event, trigger, player) {
			if (!player.storage.mjspingyanouzhe) {
				player.logSkill(event.name);
				const next = player.chooseToDiscard(`${mjs.prompt(event.name)}，请选择弃置1张牌`, "he", true);
				next.set("ai", card => {
					const player = get.player();
					if (player.isPhaseUsing()) {
						return 8 - player.getUseValue(card);
					}
					return -get.useful(card);
				});
				await next;
				return;
			}
			if (player.hasStorage("mjspingyanouzhe_used", trigger.card.name)) return;
			if (!game.hasPlayer(target => target != player)) {
				return;
			}
			const result = await player
				.chooseTarget(`${mjs.prompt(event.name)}，选择令一名其他角色添加1张${get.translation(trigger.card.name)}的复制`, lib.filter.notMe, true)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att > 0 && target.hasSkillTag("gain")) {
						return att * 2;
					}
					return att;
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.logSkill(event.name, target);
				player.addTempSkill("mjspingyanouzhe_used");
				player.markAuto("mjspingyanouzhe_used", [trigger.card.name]);
				const card = trigger.card;
				const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
				if (cardx) {
					//特殊处理 获得牌的来源
					const gainEvent = target.gain(cardx, "gain2");
					gainEvent.giver = player;
					await gainEvent;
				}
			}
		},
		ai: {
			halfneg: true,
			skillTagFilter(player, tag, arg) {
				if (player.storage.mjspingyanouzhe) {
					return false;
				}
			},
		},
		group: "mjspingyanouzhe_rewrite",
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			rewrite: {
				audio: "mjspingyanouzhe",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (player.storage.mjspingyanouzhe) return false;
					if (player.countCards("h")) {
						return false;
					}
					const evt = event.getl(player);
					return evt && evt.player == player && evt.hs && evt.hs.length > 0;
				},
				async content(event, trigger, player) {
					player.setStorage("mjspingyanouzhe", true);
					game.log(player, "修改了技能", "#g【平阳讴者】");
					const cards = [];
					game.getGlobalHistory("cardMove", function (evt) {
						if (evt.name == "lose" && evt.type == "discard" && evt.player == player) cards.addArray(evt.cards2);
					});
					const cards2 = [];
					if (cards.length) {
						for (const card of cards) {
							const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
							if (cardx) cards2.push(cardx);
						}
						if (cards2.length) {
							await player.gain(cards2, "gain2");
						}
					}
				},
			},
		},
	},
	/**嘉夫德若斯
	 * 你每累计令一名其他角色获得4张牌，添加1张休养生息到你的手牌，你的休养生息只对你选择的任意名角色生效。
	 * */
	mjsjiafuderuosi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			selectTarget(card, player, range) {
				if (!["taoyuan", "mjsxiuyangshengxi"].includes(card.name)) return;
				range[0] = 1;
				range[1] = Infinity;
			},
		},
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		silent: true,
		getIndex(event, player) {
			if (event.name == "gain") {
				if (event.getParent().name == "draw") return [event.player];
				return [event.player];
			} else {
				return game.filterPlayer(target => {
					return (event.getg?.(target) ?? []).length > 0;
				});
			}
		},
		filter(event, player, triggername, target) {
			if (target == player) {
				return false;
			}
			if (event.name == "gain") {
				if (event.getParent().name == "draw" && event.getParent().source == player) return true;
			}
			return event.giver == player;
		},
		async content(event, trigger, player) {
			const target = event.indexedData;
			const num = trigger.getg(target).length;
			if (num > 0) player.addMark(event.name, num, false);
			while (player.countMark(event.name) >= 4) {
				player.logSkill(event.name);
				player.removeMark(event.name, 4, false);
				const card = game.createCard("mjsxiuyangshengxi", "club", 1);
				if (card) {
					await player.gain(card, "gain2");
				}
			}
		},
		intro: {
			markcount(storage, player) {
				return player.countMark("mjsjiafuderuosi");
			},
			content(storage, player) {
				return `累计进度${player.countMark("mjsjiafuderuosi")}/4`;
			},
		},
	},
	//张骞
	/**丝绸之路
	 * 出牌阶段限1次，令所有角色可以展示任意张手牌，你可以选择与一名展示了手牌的角色交换各自展示的手牌，然后令获得牌少的一方摸2张牌。
	 * */
	mjssichouzhilu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.countMark("mjssichouzhilu");
		},
		filterTarget: true,
		selectTarget: -1,
		multitarget: true,
		line: false,
		chooseToShow(target, player) {
			const next = target.chooseCard(`###${get.translation(player)}发动了【${get.translation("mjssichouzhilu")}】###你可以展示任意张手牌`, [0, Infinity]);
			next.set("sourcex", player);
			next.set("att", get.attitude(target, player));
			next.set("ai", card => {
				const { player, att, sourcex } = get.event();
				if (player == sourcex) {
					if (!player.hasFriend()) {
						if (ui.selected.cards.length >= 1) return 0;
						return 4 - get.value(card);
					}
					return 8 - get.value(card);
				}
				if (att > 0) {
					return 15 - get.value(card);
				}
				return 0;
			});
			next.set("allowChooseAll", true);
			return next;
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			const list = [];
			const map = await game.chooseAnyOL(event.targets, get.info(event.name).chooseToShow, [player]).forResult();
			if (!map.size) {
				return;
			}
			for (const target of Array.from(map.keys())) {
				const result = map.get(target);
				if (result?.bool && result.cards?.length) {
					list.push([target, result.cards]);
					const next = game.createEvent("showCards");
					next.player = target;
					next.cards = result.cards;
					next.setContent("emptyEvent");
					game.log(target, "展示了", result.cards);
					await next;
				} else {
					list.push([target, []]);
				}
			}
			game.showCardsOnPlayer(list);
			const result = await player
				.chooseTarget("选择一名展示了手牌的角色交换各自展示的手牌，令获得牌少的一方摸2张牌", lib.filter.notMe)
				.set("ai", target => {
					const { player, list } = get.event();
					if (!list.some(info => info[0] == target)) {
						return 0;
					}
					const cards = list.find(info => info[0] == target)[1];
					return cards.length;
				})
				.set("list", list)
				.forResult();
			game.hideCardsFromPlayer(game.filterPlayer());
			if (result?.targets?.length) {
				const [target] = result.targets;
				const cards = list.find(info => info[0] == player)[1],
					cards2 = list.find(info => info[0] == target)[1];
				//交换手牌不触发失去和获得的时机，感觉名将杀的流程应该是相反的
				//await player.swapHandcards(target, cards, cards2);
				await target.gain(cards, player, "giveAuto", "bySelf");
				await player.gain(cards2, target, "giveAuto", "bySelf");
				if (cards.length == cards2.length) {
					return;
				}
				const source = cards.length > cards2.length ? player : target;
				await source.draw(2);
			}
		},
		async contentx(event, trigger, player) {
			const targets = event.targets;
			const list = [];
			const map = await game.chooseAnyOL(event.targets, get.info(event.name).chooseToShow, [player]).forResult();
			if (!map.size) {
				return;
			}
			for (const target of Array.from(map.keys())) {
				const result = map.get(target);
				if (result?.bool && result.cards?.length) {
					list.push([target, result.cards]);
					const next = game.createEvent("showCards");
					next.player = target;
					next.cards = result.cards;
					next.setContent("emptyEvent");
					game.log(target, "展示了", result.cards);
					await next;
				} else {
					list.push([target, []]);
				}
			}
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				(id, list) => {
					const dialog = ui.create.dialog("丝绸之路");
					dialog.classList.add("noupdate");
					dialog.videoId = id;
					const list1 = [],
						list2 = [];
					function setCustom(link) {
						return function (itemContainer) {
							itemContainer.link = link;
							itemContainer.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.button);
						};
					}
					for (const info of list) {
						list1.addArray([
							{
								item: [info[0]],
								ratio: 3,
								ItemNoclick: true,
								custom: setCustom(info[0]),
							},
						]);
						list2.addArray([
							{
								item: info[1],
								ratio: 3,
								ItemNoclick: true,
								custom: setCustom(info[0]),
							},
						]);
					}
					dialog.addNewRow(...list1);
					dialog.addNewRow(...list2);
					dialog.buttons.addArray(dialog.itemContainers);
					dialog.add(`<div><div style="width:100%;text-align:center">选择一名展示了手牌的角色交换各自展示的手牌，令获得牌少的一方摸2张牌</div></div>`);
					dialog.css({
						position: "absolute",
						top: get.is.phoneLayout() ? "5%" : "45%",
						height: "50%",
					});
				},
				event.videoId,
				list
			);
			await game.delay(2);
			const result = await player
				.chooseButton(get.idDialog(event.videoId))
				.set("filterButton", button => {
					return button.link != player;
				})
				.set("ai", button => {
					const cards = list.find(info => info[0] == button.link)[1];
					return cards.reduce((sum, card) => sum + get.value(card), 0);
				})
				.forResult();
			game.broadcastAll("closeDialog", event.videoId);
			if (result?.bool && result.links?.length) {
				const target = result.links[0];
				const cards = list.find(info => info[0] == player)[1],
					cards2 = list.find(info => info[0] == target)[1];
				//交换手牌不触发失去和获得的时机，感觉名将杀的流程应该是相反的
				//await player.swapHandcards(target, cards, cards2);
				await target.gain(cards, player, "giveAuto", "bySelf");
				await player.gain(cards2, target, "giveAuto", "bySelf");
				if (cards.length == cards2.length) return;
				const source = cards.length > cards2.length ? player : target;
				await source.draw(2);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return 1;
				},
			},
		},
	},
	/**凿空西域
	 * 当你累计获得其他角色8张牌后，丝绸之路的发动次数+1，然后此技能改为“你每累计获得其他角色8张牌后，装备上限+1，并随机获得1张装备牌”。
	 * */
	mjszaokongxiyu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		onremove(player, skill) {
			delete player.storage[skill];
		},
		trigger: {
			player: "mjszaokongxiyuEvent",
		},
		silent: true,
		popup: true,
		locked: false,
		async content(event, trigger, player) {
			if (!player.storage[event.name] && player.hasSkill("mjssichouzhilu", null, null, false)) {
				player.setStorage(event.name, true);
				player.addMark("mjssichouzhilu", 1, false);
				game.log(player, "修改了技能", "#g【凿空西域】");
			} else {
				await player.mjsExpandEquip();
				const card = get.cardPile(
					card => {
						return get.type(card) == "equip";
					},
					null,
					"random"
				);
				if (card) {
					await player.gain(card, "draw");
				}
			}
		},
		marktext: "凿",
		intro: {
			markcount(storage, player) {
				return player.countMark("mjszaokongxiyu_counter");
			},
			content(storage, player) {
				return `累计获得其他角色${player.countMark("mjszaokongxiyu_counter")}张牌`;
			},
		},
		group: "mjszaokongxiyu_counter",
		subSkill: {
			counter: {
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				forced: true,
				locked: false,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (event.name == "loseAsync" && event.type != "gain") return false;
					if (!event.getl || !event.getg) return false;
					let cards = event.getg?.(player);
					return game.hasPlayer(current => {
						if (current == player) return false;
						if (cards.length) {
							let evt = event.getl(current);
							if (evt?.cards2?.length && evt.cards2.some(card => cards.includes(card))) return true;
						}
						return false;
					});
				},
				async content(event, trigger, player) {
					const num = trigger.getg(player).length;
					player.addMark(event.name, num, false);
					player.markSkill("mjszaokongxiyu");
					while (player.countMark(event.name) >= 8) {
						player.removeMark(event.name, 8, false);
						const next = game.createEvent("mjszaokongxiyuEvent", false);
						next.player = player;
						next.setContent("emptyEvent");
						await next;
					}
				},
			},
			rewrite: {
				charlotte: true,
			},
		},
	},
	//董仲舒
	/**罢黜百家
	 * 限定，你可以令所有角色手牌中的战法牌转化为任意一张你选择的战法牌。
	 * */
	mjsbachubaijia: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		multitarget: true,
		line: false,
		async precontent(event, trigger, player) {
			const skillName = event.name.slice("pre_".length);
			const list = get.inpileVCardList(info => {
				const name = info[2];
				return get.type2(name) == "trick";
			});
			const result = await player
				.chooseButton([get.translation(skillName), [list, "vcard"]])
				.set("ai", button => {
					const player = get.player();
					const name = button.link[2], info = get.info({ name: name });
					const hs = player.countCards("h", { type: ["trick", "delay"] });
					if (hs.length >= 4) {
						return player.getUseValue(name);
					}
					if (player.hasSkill("mjstianrenganying", null, null, false)) {
						if (get.type(name) == "delay" && info && info.cancel) {
							return Math.max(1, player.getUseValue(name)) * 20;
						}
					}
					return player.getUseValue(name);
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				event.getParent().cost_data = result.links[0][2];
				return;
			}
			player.addTempSkill(`${skillName}_aiCheck`, "phaseUseAfter");
			event.getParent().goto(0);
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			for (const target of game.filterPlayer()) {
				const cards = target.getCards("h", { type: ["trick", "delay"] });
				for (const card of cards) {
					game.broadcastAll(
						function (card, name) {
							card.init([card.suit, card.number, name]);
						},
						card,
						event.getParent(2).cost_data
					);
				}
			}
		},
		ai: {
			order() {
				const player = get.player();
				return 12;
			},
			result: {
				player(player) {
					if (player.hasSkill("mjsbachubaijia_aiCheck")) {
						return 0;
					}
					return player.countCards("h", { type: ["trick", "delay"] }) * 0.5;
				},
			},
		},
		subSkill: {
			aiCheck: {
				charlotte: true,
				ai: {
	            	skill_aiCheck: true,
	            },
			},
		},
	},
	/**天人感应
	 * 当有角色卜卦后，你添加卜卦牌的1张复制至手牌，然后你可以弃置1张花色不同的手牌，若与卜卦牌相生，则被生者下回合摸牌数+1，若与卜卦牌相克，则被克者下回合摸牌数-1。
	 * */
	mjstianrenganying: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjstianrenganying" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			global: "judgeEnd",
		},
		silent: true,
		filter(event, player) {
			return get.itemtype(event.result.card) == "card";
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			const card = trigger.result.card,
				suit = card.suit,
				target = trigger.player;
			var cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
			if (cardx) {
				await player.gain(cardx, "gain2");
			}
			if (!player.hasCards("h")) {
				return;
			}
			const info = get.info(event.name);
			const relations = ["generates", "generated", "restricts", "restrictd"];
			for (const relation of relations) {
				const cards = player.getCards("h", card => {
					if (!mjs.suits.includes(card.suit)) {
						return false;
					}
					const list = [card.suit, suit];
					return info.hasEffect(list, relation);
				});
				if (cards.length) {
					player.addGaintag(cards, `${event.name}_${relation}`);
				}
			}
			const result = await player
				.chooseToDiscard("你可以弃置1张手牌，触发相生相克的效果（相生/相克，则被生者/被克者下回合摸牌数+1/-1）", card => {
					return get.suit(card) != get.event().suit;
				})
				.set("ai", card => {
					const { goon } = get.event();
					const tag = card.gaintag?.find(tag => tag.startsWith("mjstianrenganying"));
					if (!tag) {
						return 0;
					}
					if (card.hasGaintag("mjstianrenganying_generated")) {
						return 7 - get.value(card);
					}
					if (goon > 0 && card.hasGaintag("mjstianrenganying_generated")) {
						return 6 - get.value(card);
					}
					if (card.hasGaintag("mjstianrenganying_restricts")) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon", 
					(() => {
						const att = get.attitude(player, target);
						return att;
					})()
				)
				.set("suit", suit)
				.forResult();
			player.getCards("h").forEach(card => {
				let tags = card.gaintag?.filter(tag => tag.startsWith(event.name));
				tags.forEach(tag => {
					player.removeGaintag(tag, card);
				});
			});
			if (result?.bool && result.cards?.length) {
				const list = [get.suit(result.cards[0]), suit];
				for (const relation of relations) {
					if (info.hasEffect(list, relation)) {
						const skill = `${event.name}_${relation.slice(0, -1)}`;
						const current = relation.slice(-1) == "s" ? target : player;
						player.logSkill(event.name, current, null, null, [get.rand(3, 4)]);
						current.addSkill(skill);
						current.addMark(skill, 1, false);
						game.log(current, "下回合", "#y摸牌数", skill == "generate" ? "#g+1" : "#r-1");
					}
				}
			}
		},
		ai: {
			target_use(card, player, target) {
              	if (get.type(card) == "delay") {
                	return [1, 0.6];
              	}
            },
            player_use(card, player, target) {
              	if (get.type(card) == "delay") {
                	return [1, 1];
              	}
            },
		},
		hasEffect(list, relation) {
			const info = lib.skill.mjstianrenganying;
			const real = relation.slice(-1);
			relation = relation.slice(0, -1);
			if (real == "d") {
				return info.getMap.get(list[1])[relation] == list[0];
			}
			return info.getMap.get(list[0])[relation] == list[1];
		},
		getMap: new Map([
			[
				"diamond",
				{
					generate: "spade",
					restrict: "club",
				},
			],
			[
				"club",
				{
					generate: "heart",
					restrict: "taiji",
				},
			],
			[
				"spade",
				{
					generate: "club",
					restrict: "heart",
				},
			],
			[
				"heart",
				{
					generate: "taiji",
					restrict: "diamond",
				},
			],
			[
				"taiji",
				{
					generate: "diamond",
					restrict: "spade",
				},
			],
		]),
		subSkill: {
			generate: {
				charlotte: true,
				onremove(player, skill) {
					const num = player.countMark(skill);
					delete player.storage[skill];
					player.addTempSkill("mjstianrenganying_add");
					player.addMark("mjstianrenganying_add", num, false);
				},
				mark: true,
				marktext: "生",
				intro: {
					content: "下回合摸牌数+#",
				},
			},
			restrict: {
				charlotte: true,
				onremove(player, skill) {
					const num = player.countMark(skill);
					delete player.storage[skill];
					player.addTempSkill("mjstianrenganying_sub");
					player.addMark("mjstianrenganying_sub", num, false);
				},
				mark: true,
				marktext: "克",
				intro: {
					content: "下回合摸牌数-#",
				},
			},
			add: {
				trigger: {
					player: "phaseDrawBegin2"
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
					//player.removeSkill(event.name);
				},
			},
			sub: {
				trigger: {
					player: "phaseDrawBegin2",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num -= player.countMark(event.name);
					//player.removeSkill(event.name);
				},
			},
			generates: {
				name: "相生",
			},
			generated: {
				name: "被生",
			},
			restricts: {
				name: "相克",
			},
			restrictd: {
				name: "被克",
			},
		},
	},
	/**春秋繁露
	 * 出牌阶段限1次，令一名有手牌的角色卜卦，若结果为阳（♥♣），你令其选择复制1张手牌，若结果为阴（♠♦），你选择销毁其1张手牌。
	 * */
	mjschunqiufanlu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("h");
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const next = target.judge(card => {
				if (["heart", "club"].includes(get.suit(card))) {
					return 4;
				}
				return -4;
			});
			next.judge2 = result => result.bool;
			const result = await next.forResult();
			if (!target.countCards("h")) {
				return;
			}
			if (result.bool) {
				event.result =
					target.countCards("h") == 1
						? { bool: true, cards: target.getCards("h") }
						: await target
							.chooseCard("选择复制一张手牌", true)
							.set("ai", card => {
								const player = get.player();
								if (get.event().goon) {
									if (get.type(card) != "basic" && get.type(card) != "trick") {
										return 0;
									}
									return get.value(card) - 7.5;
								}
								return -get.useful(card);
							})
							.set("goon", result.bool)
							.forResult();
			} else {
				const cards = target.getCards("h", card => lib.filter.cardDestuctible(card, target, "mjschunqiufanlu"));
				event.result =
					cards.length == 1
						? { bool: true, cards: cards }
						: await player
							.choosePlayerCard(target, true)
							.set("prompt", get.translation(event.name))
							.set("prompt2", `选择销毁${get.translation(target)}的一张手牌`)
							.set("filterButton", button => {
								return lib.filter.cardDestuctible(button.link, get.owner(button.link), "mjschunqiufanlu");
							})
							.set("ai", button => {
								if (get.event().goon > 0) return -get.useful(button.link);
								return get.value(button.link);
							})
							.set("goon", get.attitude(player, target))
							.forResult();
			}
			if (event.result?.bool && event.result.cards?.length) {
				if (result.bool) {
					const card = event.result.cards[0];
					const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
					await target.gain(cardx, "draw");
				} else {
					const cards = event.result.cards;
					game.log(cards, "被销毁了");
					await target.lose(cards, "toDestroy", ui.special);
				}
			}
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					if (get.attitude(player, target) > 0) {
						return target.countCards("h");
					}
					return target.countCards("h") - 2;
				},
			},
		},
	},
	//李广
	/**飞将慑虏
	 * 其他角色出牌阶段造成第2次伤害时，你可以翻开牌堆顶的3张牌，然后对其打出其中所有杀。
	 * */
	mjsfeijiangshelu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "damageSource",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event.source?.isIn() && event.source.getHistory("sourceDamage").indexOf(event) == 1;
		},
		logTarget: "source",
		check(event, player) {
			if (get.attitude(player, event.source) > 0) return false;
			return get.effect(event.source, { name: "sha" }, player, player) > 0;
		},
		async content(event, trigger, player) {
			const cards = get.cards(3);
			await game.cardsGotoOrdering(cards);
			game.log(player, "翻开牌堆顶的", cards);
			event.videoId = lib.status.videoId++;
	        const createDialog = function (player, cards, id) {
	            const dialog = ui.create.dialog("forcebutton", true);
	            dialog.classList.add("mj-flip");
	            dialog.videoId = id;
	            const buttons = ui.create.div(".buttons", dialog.content);
	            for (const card of cards) {
	            	buttons.appendChild(card);
		            dialog.open();
		            ui.create.cardSpinning(card);
	            }
	        };
	        const closeDialog = function (id) {
	            const dialog = get.idDialog(id);
	            if (dialog) {
	                dialog.close();
	            }
	        };
	        game.broadcastAll(createDialog, player, cards, event.videoId);
	        await game.delay(2);
	        game.broadcastAll(closeDialog, event.videoId);
			for (const card of cards) {
				if (card.name != "sha") continue;
				if (player.canUse(card, trigger.source, false, false)) {
					await player.useCard(card, trigger.source, false);
				}
			}
		},
	},
	/**射石搏虎
	 * 你打出的伤害值＞1的杀被闪抵消时，仍然造成伤害，但是伤害-1；受伤，你对目标角色打出的下1张杀的伤害+1。
	 * */
	mjssheshibohu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["shaMiss", "eventNeutralized", "damageEnd"],
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "damage") {
				return true;
			}
			if (event.type !== "card" || event.card.name !== "sha" || !event.target.isIn()) {
				return false;
			}
			//return event.getParent("useCard")?.baseDamage > 1;
			const evt = event.getParent("useCard");
			const map = evt.customArgs;
			if (!map[event.target.playerid]) {
				map[event.target.playerid] = 0;
			}
			return (evt.baseDamage || 1) + map[event.target.playerid] > 1;
		},
		async content(event, trigger, player) {
			if (trigger.name != "damage") {
				trigger.untrigger();
				trigger.trigger("shaHit");
				trigger._result.bool = false;
				trigger._result.result = null;
				const evt = trigger.getParent("useCard");
				player.addTempSkill(event.name + "_buff");
				player.markAuto(event.name + "_buff", [trigger.card]);

				return;
				trigger.target
					.when("damageBegin3")
					.filter(evtx => evtx.getParent("useCard") == evt)
					.then(() => {
						trigger.num--;
					});
			} else {
				player.addSkill("mjssheshibohu_effect");
				player.markAuto("mjssheshibohu_effect", 1, false);
			}
		},
		subSkill: {
			buff: {
				audio: "mjssheshibohu",
				trigger: {
					source: "damageBegin1",
				},
				silent: true,
				forced: true,
				charlotte: true,
				filter(event, player) {
					return event.card && player.hasStorage("mjssheshibohu_buff", event.card);
				},
				async content(event, trigger, player) {
					trigger.num--;
				},
			},
			effect: {
				trigger: {
					player: "useCard",
				},
				forced: true,
				onremove: true,
				filter(event, player) {
					if (event.card.name != "sha") {
						return false;
					}
					return event.targets?.length;
				},
				async content(event, trigger, player) {
					trigger.baseDamage += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				mark: true,
				marktext: "虎",
				intro: {
					content: "你对目标角色打出的下1张杀的伤害+#",
				},
			},
		},
	},
	//芈八子
	/**楚姝入秦
	 * 登场，将势力改为楚。受伤/回合开始时，你可以令自己的体力上限+1，并回复所有体力，然后失去此技能，将势力改为秦，并获得技能“易鼎鸣凤”和“权御四贵”。
	 * 游戏开始时，将势力改为楚。受伤，你可以令你的体力上限+1，并回复所有体力，然后失去此技能，将势力改为秦，并获得技能“易鼎鸣凤”和“权御四贵”。
	 * */
	mjschushuruqin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		derivation: ["mjsyidingmingfeng", "mjsquanyusigui"],
		trigger: {
			player: ["phaseBegin", "damageEnd"],
		},
		silent: true,
		popup: true,
		forced: false,
		prompt2: "你可以令你的体力上限+1，并回复所有体力，然后失去此技能，将势力改为秦，并获得技能“易鼎鸣凤”和“权御四贵”",
		check(event, player) {
			if (_status.currentPhase == player || player.isPhaseUsing()) {
				return true;
			}
			return player.getHp() <= 2;
		},
		async content(event, trigger, player) {
			await player.gainMaxHp();
			await player.recoverTo(player.maxHp);
			await player.removeSkills(event.name);
			await player.changeGroup("daqin");
			const skills = get.info(event.name).derivation;
			if (skills.length) {
				const createSkills = mjs.addCreateSkills(skills);
				await player.addSkills(createSkills);
			}
			//await player.changeSkills(lib.skill[event.name].derivation, [event.name]);
		},
		ai: {
			maixie: true,
			effect: {
				target(card, player, target) {
					if (!get.tag(card, "damage")) {
						return;
					}
					if (target.hp + target.hujia < 2 || player.hasSkillTag("jueqing", false, target)) {
						return 2;
					}
					return [1, target.hp - 1];
				},
			},
		},
		group: "mjschushuruqin_init",
		subSkill: {
			init: {
				audio: "mjschushuruqin",
				trigger: {
					global: "phaseBefore",
					player: ["enterGame", "changeSkillsAfter"],
				},
				silent: true,
				popup: true,
				locked: false,
				filter(event, player) {
					if (event.name == "changeSkills") {
						return event.addSkill.includes("mjschushuruqin");
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					await player.changeGroup("chu");
				},
			},
		},
	},
	/**易鼎鸣凤
	 * 出牌阶段限1次，你可以令一名其他角色选择是否将势力改为与你相同，若其拒绝，则其弃置2张手牌。势力与你相同的其他角色以你为目标打出牌时，你可以为此牌增加另一名其他角色为目标。
	 * */
	mjsyidingmingfeng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.mjsyidingmingfeng.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target != player;

			//return target != player && target.group != player.group;
		},
		log: false,
		async content(event, trigger, player) {
			const [target] = event.targets;
			player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
			if ((!get.info("mjsyitongliuhe").groupFiter(player) || !get.info("mjsyitongliuhe").groupFiter(target)) || target.countCards("h") < 2) {
				event.result = { bool: false };
			} else {
				event.result = await target
					.chooseBool(`${mjs.prompt(event.name)}，是否将势力改为与${get.translation(player)}相同，否则需要弃置2张手牌`)
					.set("ai", () => {
						const source = _status.event.getParent().player;
						const player = get.player();
						const att = get.attitude(player, source);
						if (att > 0 || source.group == player.group || !player.hasFriend()) {
							return true;
						}
						return false;
					})
					.forResult();
			}
			if (event.result?.bool) {
				const next = target.changeGroup(player.group);
				next.source = player;
				await next;
			} else {
				await target.chooseToDiscard("h", 2, true);
			}
		},
		ai: {
			order: 13,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					if (!get.info("mjsyitongliuhe").groupFiter(player) || !get.info("mjsyitongliuhe").groupFiter(target)) {
						return get.effect(target, { name: "guohe_copy2" }, player, player) * 2;
					}
					if (target.group == player.group) {
						return 0;
					}
					if (att > 0) {
						return att * 2;
					}
					return att;
				},
			},
		},
		group: "mjsyidingmingfeng_use",
		subSkill: {
			use: {
				audio: "mjsyidingmingfeng",
				trigger: {
					global: "useCardToPlayer",
				},
				popup: false,
				filter(event, player) {
					if (!get.info("mjsyitongliuhe").groupFiter(event.player)) {
						return false;
					}
					if (event.player == player || event.player.group != player.group) {
						return false;
					}
					if (!["basic", "trick"].includes(get.type(event.card))) {
						return false;
					}
					if (!event.isFirstTarget || !event.targets?.includes(player)) {
						return false;
					}
					if (
						game.hasPlayer(current => {
							if (current == player || current == event.player) return false;
							return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, event.player, current);
						})
					) {
						return true;
					}
					return false;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt(event.skill), `为${get.translation(trigger.card)}增加另一名其他角色为目标`, (card, player, target) => {
							const trigger = get.event().getTrigger();
							if (target == player || target == trigger.player) return false;
							return lib.filter.targetEnabled2(trigger.card, trigger.player, target);
							//return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
						})
						.set("ai", target => {
							const trigger = get.event().getTrigger(),
								player = get.player();
							return get.effect(target, trigger.card, trigger.player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
					//trigger.targets.addArray(event.targets);
					trigger.targets.push(target);
					game.log(target, "成为了", trigger.card, "的额外目标");
				},
			},
		},
	},
	/**权御四贵
	 * 出牌阶段，你可以交给一名与你势力相同的其他角色1张牌，当其拥有此牌时，其每回合打出的前2张牌生效2次。
	 * 交给一名与你势力相同的其他角色1张牌，然后此技能失效，直到其失去此牌；当其拥有此牌时，其每回合打出的前2张牌生效2次。
	 * */
	mjsquanyusigui: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init: (player, skill) => {
	      	game.addGlobalSkill(skill + "_global");
	    },
	    onremove: (player, skill) => {
	      	if (!game.hasPlayer((current) => current.hasSkill(skill, null, null, false), true)) {
	        	game.addGlobalSkill(skill + "_global");
	      	}
	    },
		enable: "phaseUse",
		filter(event, player) {
			//if (player.hasSkill("mjsquanyusigui_blocker")) return false;
			return player.hasCards("he") && game.hasPlayer(target => lib.skill.mjsquanyusigui.filterTarget(null, player, target));
		},
		filterCard: true,
		position: "he",
		check(card) {
			return 8 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (!get.info("mjsyitongliuhe").groupFiter(target)) {
				return false;
			}
			return target != player && target.group == player.group;
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(event.cards, target);
			target.addGaintag(event.cards, "mjsquanyusigui_tag");

			return;
			player.addSkill("mjsquanyusigui_blocker");
			target
				.when({
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				})
				.vars({
					forceDie: true,
				})
				.filter((evt, player) => {
					if (event.name == "lose") {
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("mjsquanyusigui_tag")) {
								return true;
							}
						}
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						if (evt.getParent() != event) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("mjsquanyusigui_tag")) {
								return true;
							}
						}
					});
				})
				.then(() => {
					player.removeSkill("mjsquanyusigui_blocker");
				});
		},
		ai: {
			order(item, player) {
				player = player || get.event().player;
				return get.order({ name: "sha" }) + 0.5;
			},
			result: {
				target(player, target) {
					const eff = get.sgnAttitude(player, target);
					if (!target.hasCards("h", card => card.hasGaintag("mjsquanyusigui_tag"))) {
						return eff = 2;
					}
					return eff;
				},
			},
		},
		subSkill: {
			tag: {
				name: "贵",
			},
			global: {
				trigger: {
					player: "useCard",
				},
				silent: true,
				locked: false,
				filter(event, player) {
					if (!game.hasPlayer(target => target.hasSkill("mjsquanyusigui"))) {
						return false;
					}
					if (player.getHistory("useCard").indexOf(event) > 1) {
						return false;
					}
					return player.countCards("h", card => card.hasGaintag("mjsquanyusigui_tag"));
				},
				async content(event, trigger, player) {
					game.trySkillAudio("mjsquanyusigui", player);
					trigger.effectCount++;
					// 装备特殊处理
					if (get.type(trigger.card) == "equip") {
						if (typeof trigger.equipCount != "number") {
							trigger.equipCount = 1;
						}
						trigger.equipCount++;
					}
				},
			},
			blocker: {
				charlotte: true,
			},
		},
	},
	//陈阿娇
	/**金屋藏娇
	 * 其他角色出牌阶段限1次，其可以交给你至少1张牌，然后你回复等量的体力值，并且可以令其当前阶段出杀次数+1。
	 * */
	mjsjinwucangjiao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		audioname: ["mjs_chenajiao_yeyanqimeng"],
		global: "mjsjinwucangjiao_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				prompt() {
					const player = get.player();
					const targets = game.filterPlayer(target => lib.skill.mjsjinwucangjiao_global.filterTarget(null, player, target));
					let str = "交给" + get.translation(targets);
					if (targets.length > 1) {
						str += "中的一人";
					}
					str += "任意张牌，然后其回复等量的体力值，并且其可以令你当前阶段出杀次数+1";
					return str;
				},
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					return game.hasPlayer(target => lib.skill.mjsjinwucangjiao_global.filterTarget(null, player, target));
				},
				filterTarget(card, player, target) {
					return target != player && target.hasSkill("mjsjinwucangjiao") && !target.hasSkill("mjsjinwucangjiao_used", null, null, false);
				},
				selectTarget() {
					const player = get.player();
					const count = game.countPlayer(target => lib.skill.mjsjinwucangjiao_global.filterTarget(null, player, target));
					return count > 1 ? 1 : -1;
				},
				check(card) {
					const player = get.player();
					if (ui.selected.cards.length >= Math.min(1, player.needsToDiscard())) {
						return 0;
					}
					const hasFriend = game.hasPlayer(target => {
						if (get.attitude(player, target) <= 0) return false;
						return lib.skill.mjsjinwucangjiao_global.filterTarget(null, player, target);
					});
					return (hasFriend ? 6 : 1) - get.value(card);
				},
				filterCard: true,
				selectCard: [1, Infinity],
				discard: false,
				lose: false,
				delay: false,
				line: true,
				log: false,
				async precontent(event, trigger, player) {
					event.result.targets[0].logSkill("mjsjinwucangjiao", player);
				},
				async content(event, trigger, player) {
					const { target } = event;
					target.addTempSkill("mjsjinwucangjiao_used", "phaseUseAfter");
					await player.give(event.cards, target);
					await target.recover(event.cards.length);
					const result = await target
						.chooseBool(`你可以令${get.translation(player)}出杀次数+1`)
						.set("ai", () => {
							return get.event().goon;
						})
						.set("goon", get.attitude(target, player) > 0)
						.forResult();
					if (result?.bool) {
						player.addTempSkill("mjsjinwucangjiao_sha", "phaseUseAfter");
						player.addMark("mjsjinwucangjiao_sha", 1, false);
					}
				},
				ai: {
					expose: 0.3,
					order: 1,
					result: {
						target: 5,
					},
				},
			},
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("mjsjinwucangjiao_sha");
						}
					},
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**千金买赋
	 * 限定，其他角色回合结束时，你可以将所有手牌交给该角色，然后添加其本回合打出过的所有牌的复制至你的手牌。
	 * */
	mjsqianjinmaifu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		audioname: ["mjs_chenajiao_yeyanqimeng"],
		getCards(player) {
			const cards = ["useCard", "respond"].reduce((list, key) => {
				const historys = player
					.getHistory(key, evt => {
						return (evt.cards || []).length;
					})
					.reduce((list2, evt) => {
						return list2.addArray(evt.cards);
					}, []);
				if (historys.length) {
					list.addArray(list);
				}
				return list;
			}, []);
			return cards;
		},
		trigger: {
			global: "phaseEnd",
		},
		limited: true,
		filter(event, player) {
			return event.player != player && player.hasCards("h");
		},
		check(event, player) {
			const cards = lib.skill.mjsqianjinmaifu.getCards(event.player);
			const att = get.attitude(player, event.player);
			if (player.countCards("h", card => get.value(card) - 5) < 1) {
				return true;
			}
			if (cards.length <= 4) {
				return false;
			}
			return att > 3;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = lib.skill.mjsqianjinmaifu.getCards(trigger.player);
			const hs = player.getCards("h");
			if (hs.length) await player.give(hs, trigger.player);
			if (cards.length) {
				const gains = [];
				for (const card of cards) {
					const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
					if (cardx) gains.push(cardx);
				}
				if (gains.length) {
					await player.gain(gains, "gain2");
				}
			}
		},
	},
	//韩非
	/**法不阿贵
	 * 出牌阶段限1次，你可以令所有角色上一轮每发动过1次技能，就随机弃置1张牌，若有角色因此失去所有手牌和装备，则失去1点体力。
	 * */
	mjsfabuagui: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		onremove(player, skill) {
			player.removeSkill(skill + "_rewrite");
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return true;
			return game.hasPlayer(target => lib.skill.mjsfabuagui.getNum(target) > 0);
		},
		filterTarget(card, player, target) {
			return true;
			return lib.skill.mjsfabuagui.getNum(target) > 0;
		},
		filterTarget: true,
		selectTarget: -1,
		multitarget: true,
		multiline: false,
		line: false,
		async precontent(event, trigger, player) {
			const skillName = event.name.slice("pre_".length);
			const targets = game.filterPlayer(target => {
				return lib.skill.mjsfabuagui.getNum(target) > 0;
			});
			targets.forEach(target => {
				target.prompt(lib.skill.mjsfabuagui.getNum(target));
			});
			const result = await player
				.chooseBool(`###${get.prompt(skillName)}###你可以令${targets.length ? get.translation(targets) : "所有角色"}${player.hasSkill("mjsfabuagui_rewrite") ? "摸牌" : "随机弃置牌"}`)
				.set("ai", () => {
					const player = get.player();
					return lib.skill.mjsfabuagui.ai.result.player(player);
				})
				.forResult();
			if (!result?.bool) {
				event.getParent().goto(0);
			}
		},
		async content(event, trigger, player) {
			const bool = player.hasSkill("mjsfabuagui_rewrite");
			const func = async target => {
				const num = lib.skill.mjsfabuagui.getNum(target);
				if (num == 0) return;
				if (bool) {
					await target.draw(num);
				} else {
					const cards = target.getCards("h", card => {
						return lib.filter.cardDiscardable(card, target, "mjsfabuagui");
					});
					if (cards.length > 0) {
						const next = target.discard(cards.randomGets(num));
						next.set("discarder", target);
						target
							.when("loseAfter")
							.filter(evt => evt.getParent() == next)
							.then(() => {
								if (!player.countCards("he")) {
									player.loseHp();
								}
							});
						await next;
					}
				}
			};
			await game.doAsyncInOrder(event.targets, func);
		},
		getNum(player) {
			return player.getRoundHistory(
				"useSkill",
				evt => {
					let skill = get.sourceSkillFor(evt.event);
					if (!skill) return false;
					let info = get.info(skill);
					if (!info || !get.skillInfoTranslation(skill, player).length) {
						return false;
					}
					if (["global", "equip"].includes(evt.type)) return false;
					return !info.charlotte;
				},
				1
			).length;
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					let eff = 1;
					game.countPlayer(current => {
						const att = get.sgnAttitude(player, current),
							num = lib.skill.mjsfabuagui.getNum(current);
						if (player.hasSkill("mjsfabuagui_rewrite")) {
							eff += att * get.effect(current, { name: "draw" }, player) * num;
						} else {
							const delt = Math.min(current.countCards("he"), num);
							eff += att * delt;
						}
					});
					return eff > 0 ? 1 : 0;
				},
			},
		},
		subSkill: {
			rewrite: {
				charlotte: true,
			},
		},
	},
	/**事异备变
	 * 回合结束时，你可以将“法不阿贵”中“随机弃置1张牌”的效果改为“摸1张牌”，或者恢复为“随机弃置1张牌”。
	 * */
	mjsshiyibeibian: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseEnd",
		},
		prompt2(event, player) {
			if (player.hasSkill("mjsfabuagui_rewrite")) {
				return `你可以将${get.poptip("mjsfabuagui")}中“摸1张牌”的效果改为“随机弃置1张牌”。`;
			}
			return `你可以将${get.poptip("mjsfabuagui")}中“随机弃置1张牌”的效果改为“摸1张牌”。`;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseControl("随机弃置1张牌", "摸1张牌", "cancel2")
				.set("prompt", get.prompt2(event.skill))
				.set("ai", () => {
					const player = get.player();
					return get.rand(0, 1);
				})
				.forResult();
			if (event.result.index != 2) {
				event.result.cost_data = event.result.index;
			}
		},
		async content(event, trigger, player) {
			player[event.cost_data == 0 ? "removeSkill" : "addSkill"]("mjsfabuagui_rewrite");
		},
		ai: {
			combo: "mjsfabuagui",
		},
	},
	/**不期修古
	 * 每回合限1次，当你发动其他技能后，可以失去该技能，然后抽取3张武将牌，选择获得其中1名武将的1个技能。
	 * 当你发动其他技能后，可以失去该技能，然后抽取3张武将牌，选择获得其中1名武将的1个技能。
	 * */
	mjsbuqixiugu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["logSkill", "useSkillAfter"],
		},
		usable: 1,
		filter(event, player) {
			if (event.type != "player") {
				return false;
			}
			var skill = get.sourceSkillFor(event);
			if (!skill || skill === "mjsbuqixiugu") {
				return false;
			}
			var info = get.info(skill);
			if (info.charlotte || !get.skillInfoTranslation(skill, player).length) {
				return false;
			}
			return player.hasSkill(skill, false, false, false);
		},
		prompt2(event, player) {
			let skill = get.sourceSkillFor(event);
			return `你可以失去技能${get.poptip(skill)}，然后抽取3张武将牌，选择获得其中1名武将的1个技能。`;
		},
		check(event, player) {
			let skill = get.sourceSkillFor(event);
			switch (skill) {
				case "mjsdunjiatianshu": {
					return false;
				}
				case "mjschushuruqin": {
					// 确保能吃到衍生技能
					return event.skill == "mjschushuruqin";
				}
				default: {
					return !player.getOriginalSkills().includes(skill) || skill == "mjsshiyibeibian";
				}
			}
		},
		async content(event, trigger, player) {
			const skill = get.sourceSkillFor(trigger);
			await player.removeSkills(skill);
			const characters = lib.skill.mjsdunjiatianshu.getList(player);
			const list = characters.randomGets(3);
			if (!list.length) {
				return;
			}
			if (get.isLuckyStar() && !player.storage.mjsbuqixiugu_luckyStar && !player.hasSkill("mjsdunjiatianshu")) {
				player.setStorage("mjsbuqixiugu_luckyStar", true);
				list[0] = "mjs_zuoci";
			}
			let num = 0,
				skillMap = {};
			for (const i of list) {
				const skills = (lib.character[i][3] || []).filter(skill => {
					const info = get.info(skill);
					return info && !info.zhuSkill && !info.charlotte;
				});
				if (skills.length > num) {
					num = skills.length;
				}
				skillMap[i] = skills;
			}
			if (num == 0) {
				return;
			}
			const result = await player
				.chooseButton(
					[
						[[`###${get.translation(event.name)}###请选择要获得的技能`], "addNewRow"],
						[
							dialog => {
								dialog.css({
									top: get.is.phoneLayout() ? "5%" : "45%",
								});
	                            const { list, skillMap } = get.event();
	                            //算出来需要多少列，最多八列
	                            const num = 8;
	                            const column = Math.min(list.length, num);
	                            if (column > 6) {
	                                dialog.css({
	                                    width: "100%",
	                                    left: 0,
	                                });
	                            }
	                            //重新创建一个容器，不然css之后会导致dialog.content内的其他元素也加入到布局中
	                            const contentx = ui.create.div(".content", dialog.content);
	                            contentx.css({
	                                display: "grid",
	                                gridTemplateColumns: `repeat(${column}, 1fr)`,
	                                width: "fit-content",
	                                margin: "auto",
	                            });
	                            //一个一个塞进去
	                            for (const i of list) {
	                                const div = ui.create.div(".buttons", contentx);
	                                const button = ui.create.button(i, "character", div);
	                                const skills = skillMap[i];
	                                //让角色和技能按钮水平居中垂直排列
	                                div.css({
	                                    display: "flex",
	                                    flexDirection: "column",
	                                    alignItems: "center",
	                                });
	                                //角色因为不是可选按钮所以需要调整一下透明度
	                                button.style.setProperty("opacity", "1", "important");
	                                if (skills.length) {
	                                    //创建技能按钮
	                                    const buttons = ui.create.buttons(
	                                        skills.map(i => [i, get.translation(i)]),
	                                        "tdnodes",
	                                        div
	                                    );
	                                    //丢进可选按钮中
	                                    dialog.buttons = dialog.buttons.concat(buttons);
	                                }
	                            }
							},
							"handle",
						],
					],
					true
				)
				.set("list", list.slice())
				.set("num", num)
				.set("skillMap", skillMap)
				.set("ai", button => {
					const player = get.player();
					const skill = button.link;
					switch (skill) {
						case "mjshuiyanshilang": case "mjsmeiren": {
							if (!game.hasPlayer(target => {
								return target != player && target.hasSex("male");
							})) {
								return 0;
							}
						}
						case "mjsjunshengbieli": {
							if (game.countPlayer() <= 2) {
								return 0;
							}
						}
						case "mjsdunjiatianshu": {
							return 100;
						}
						case "mjschushuruqin": {
							return 8;
						}
						default: {
							if (get.info?.(skill)?.skillRank && typeof get.info(skill).skillRank == "number") {
								return get.info(skill).skillRank;
							}
							if (player.isPhaseUsing()) {
								var translation = get.skillInfoTranslation(skill, player);
								var match = get.plainText(translation).match(/“?出牌阶段限一次/g);
								if (match && match.some(value => value == "出牌阶段限一次")) {
									return get.skillRank(skill, "in") + 2.55;
								}
							}
							return get.skillRank(skill, "in");
						}
					}
				})
				.forResult();
			if (result.bool && result?.links?.length) {
				const createSkills = mjs.addCreateSkills(result.links);
				await player.addSkills(createSkills);
				game.broadcastAll(function (list) {
					game.expandSkills(list);
					for (const i of list) {
						var info = lib.skill[i];
						if (!info) {
							continue;
						}
						if (!info.audioname2) {
							info.audioname2 = {};
						}
						info.audioname2.mjs_hanfei = "mjsbuqixiugu";
					}
				}, createSkills);
			}
		},
		subSkill: {
			luckyStar: {
				charlotte: true,
			},
		},
	},
	//钟无艳
	/**自荐枕席
	 * 限定，令一名与你势力相同的其他角色进行一个出牌阶段，此阶段其只能打出你的手牌，之后你与其回合开始时，按其打出这些牌的顺序，分别添加其中1张牌的1个复制至手牌。
	 * 示例，钟无艳选择武将A发动自荐枕席，武将A获得出牌阶段，先后打出钟无艳的，多多益善，杀，桃，结束出牌阶段，钟无艳结束回合，武将A的回合开始时，钟无艳和武将A分别获得1张复制的多多益善
	 * */
	mjszijianzhenxi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["增益"],
		initSkill(skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					trigger: {
						global: "phaseBegin",
					},
					silent: true,
					onremove: true,
					filter(event, player) {
						return event.player == player || event.player.playerid == skill.slice("mjszijianzhenxi_".length);
					},
					async content(event, trigger, player) {
						const list = [];
						const info = player.getStorage(event.name).shift();
						if (!info) {
							player.removeSkill(event.name);
							return;
						}
						game.trySkillAudio("mjszijianzhenxi", player, true, null, null, [get.rand(3, 4)]);
						const targets = [trigger.player];
						if (trigger.player != player) {
							targets.add(player);
						} else {
							const target = game.findPlayer(target => {
								return target.playerid == event.name.slice("mjszijianzhenxi_".length);
							});
							if (target?.isIn()) {
								targets.add(target);
							}
						}
						for (let i = 0; i < targets.length; i++) {
							const card = game.createCard(info);
							list.push([targets[i], [card]]);
						}
						if (list.length) {
							await game
								.loseAsync({
									gain_list: list,
									giver: player,
									animate: "gain2",
								})
								.setContent("gaincardMultiple");
						}
						if (!player.getStorage(event.name).length) {
							player.removeSkill(event.name);
						}
					},
				};
				lib.translate[skill] = "自荐枕席";
			}
		},
		enable: "phaseUse",
		limited: true,
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.mjszijianzhenxi.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			if (!get.info("mjsyitongliuhe").groupFiter(target)) {
				return false;
			}
			return target != player && target.group == player.group;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const [target] = event.targets;
			const next = target.phaseUse();
			target
				.when("phaseUseBegin")
				.filter(evt => evt == next)
				.then(async (event2, trigger2, player2) => {
					player.addTempSkill("mjszijianzhenxi_change", "phaseUseAfter");
					target.markAuto("mjszijianzhenxi_use", [player]);
					target.addTempSkill("mjszijianzhenxi_use", "phaseUseAfter");
					target
						.when("phaseUseEnd")
						.filter(evt => evt == next)
						.then(async (event3, trigger3, player3) => {
							const cards = target
								.getHistory("useCard", evt => evt.getParent("phaseUse") == trigger3)
								.reduce((list, evt) => list.add(evt.cards), [])
								.flat();
							if (!cards.length) return;
							const skill = "mjszijianzhenxi_" + target.playerid;
							game.broadcastAll(lib.skill.mjszijianzhenxi.initSkill, skill);
							player.addSkill(skill);
							player.markAuto(skill, cards);
						});
				});
			await next;
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					const eff = player.getCards("h").reduce((sum, card) => {
						sum += target.getUseValue(card);
						return sum;
					}, 0);
					return eff;
				},
			},
		},
		subSkill: {
			tag: {
				name: "invisible",
			},
			change: {
				trigger: {
					global: ["loseEnd", "loseAsyncEnd", "gainEnd", "addToExpansionEnd", "equipEnd", "addJudgeEnd"],
				},
				silent: true,
				charlrotte: true,
				filter(event, player) {
					return event.getg?.(player)?.length || event.getl?.(player)?.hs?.length;
				},
				forceDie: true,
				async content(event, trigger, player) {
					const toAdd = trigger.getg?.(player) || [],
						toRemove = trigger.getl?.(player)?.hs || [];
					event.set("toAdd", toAdd);
					event.set("toRemove", toRemove);
					await event.trigger("mjszijianzhenxiChange");
				},
			},
			use: {
				mod: {
					cardEnabled2(card, player, target) {
						if (get.itemtype(card) != "card" || !player.getCards("s").includes(card)) {
							return false;
						}
						if (!card.hasGaintag("mjszijianzhenxi_tag")) {
							return false;
						}
					},
				},
				init(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("mjszijianzhenxi_tag"));
					game.deleteFakeCards(toRemove);
					const cards = player.getStorage(skill).reduce((cards, target) => {
						const fake = target.isAlive() && target.countCards("h") ? game.createFakeCards(target.getCards("h")) : [];
						return cards.addArray(fake);
					}, []);
					player.directgains(cards, null, "mjszijianzhenxi_tag");
				},
				onremove(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("mjszijianzhenxi_tag"));
					game.deleteFakeCards(toRemove);
				},
				mark: true,
				intro: {
					content: "你只能使用或打出<span class=thundertext>$</span>的手牌",
				},
				forced: true,
				popup: false,
				delay: false,
				charlotte: true,
				trigger: {
					player: ["useCardBefore", "respondBefore"],
					global: ["mjszijianzhenxiChange"],
				},
				filter(event, player) {
					if (["useCard", "respond"].includes(event.name)) {
						const cards = player.getCards("s", card => card.hasGaintag("mjszijianzhenxi_tag"));
						return event.cards && event.cards.some(card => cards.includes(card));
					}
					return player.getStorage("mjszijianzhenxi_use").includes(event.player);
				},
				async content(event, trigger, player) {
					const tag = "mjszijianzhenxi_tag";
					if (["useCard", "respond"].includes(trigger.name)) {
						trigger.set("mjszijianzhenxi", true);
						const real = player.getStorage(event.name).reduce((cards, target) => {
							const hs = target.isAlive() && target.countCards("h") ? target.getCards("h") : [];
							return cards.addArray(hs);
						}, []);
						for (let i = 0; i < trigger.cards.length; i++) {
							const card = trigger.cards[i];
							const cardx = real.find(cardx => cardx.cardid == card._cardid);
							if (cardx) {
								trigger.cards[i] = cardx;
								trigger.card.cards[i] = cardx;
								trigger.throw = false;
								get.owner(cardx)?.$throw(cardx);
							}
						}
					} else {
						game.deleteFakeCards(player.getCards("s", card => trigger.toRemove.find(cardx => cardx.cardid == card._cardid)));
						player.directgains(game.createFakeCards(trigger.toAdd), null, tag);
					}
				},
			},
		},
	},
	/**智勇定齐
	 * 出杀，随机添加1张战法牌到手牌，当你打出此战法牌时，你可以令一名其他角色的势力改为与你相同，所有与你势力相同的角色获得1张杀。
	 * */
	mjszhiyongdingqi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjszhiyongdingqi" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		skill_tag: ["增益"],
		mod: {
			aiOrder(player, card, num) {
				if (card.name != "sha") {
					return;
				}
				var evt = _status.event.getParent("phaseUse");
				if (!evt || evt.player != player) {
					return;
				}
				if (!player.hasSkill("mjszijianzhenxi") || player.awakenedSkills?.includes("mjszijianzhenxi")) {
					return;
				}
				if (
					game.hasPlayer(function (target) {
						if (!get.info("mjsyitongliuhe").groupFiter(target)) {
							return false;
						}
						return get.attitude(player, target) >= 0 && target.group != player.group;
					})
				) {
					return num + 10;
				}
			},
		},
		trigger: {
			player: ["useCard", "respond"],
		},
		silent: true,
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			const trick = mjs.getTrick("random");
			const card = mjs.createCard(trick);
			if (card) {
				const next = player.gain(card, "draw");
				next.set("gaintag", [event.name + "_tag"]);
				await next;
			}
		},
		group: "mjszhiyongdingqi_use",
		subSkill: {
			use: {
				audio: "mjszhiyongdingqi",
				trigger: {
					player: "useCard",
				},
				silent: true,
				forced: false,
				filter(event, player) {
					return player.hasHistory("lose", function (evt) {
						return evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.includes("mjszhiyongdingqi_tag"));
					});
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "你可以令一名其他角色的势力改为与你相同", (card, player, target) => {
							if (!get.info("mjsyitongliuhe").groupFiter(target)) {
								return false;
							}
							return target != player;
						})
						.set("ai", target => {
							const player = get.player();
							let att = get.attitude(player, target);
							if (att > 0) {
								att *= 2;
							}
							if (player.isPhaseUsing() && player.getCardUsable("sha")) {
								return att * get.sgnAttitude(player, target);
							}
							return att;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
					const next = target.changeGroup(player.group);
					next.source = player;
					await next;
					const targets = game
						.filterPlayer(target => {
							return target.group == player.group;
						})
						.sortBySeat(player);
					const func = async target => {
						const card = get.cardPile("sha");
						if (card) {
							await target.gain(card, "draw");
						}
					};
					await game.doAsyncInOrder(targets, func);
				},
			},
			tag: {
				name: "定",
			},
		},
	},
	//郭隗
	/**千金市骨
	 * 出牌阶段限1次，你可以将所有手牌增强后洗入牌堆，然后从弃牌堆获得3种不同类型的牌各1张，并增强其中的坐骑牌。
	 * */
	mjsqianjinshigu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h");
		},
		filterCard: true,
		selectCard: -1,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			await player.mjsStrengthenCards(event.cards);
			await game.cardsGotoPile(event.cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});
			const types = ["basic", "trick", "equip"],
				cards = [];
			for (const type of types) {
				const card = get.discardPile(
					card => {
						return get.type2(card) == type && !cards.includes(card);
					},
					null,
					"random"
				);
				if (card) cards.push(card);
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
				const cards2 = cards.filter(card => {
					if (get.subtype(card) == "equip3" || get.subtype(card) == "equip4" || get.subtype(card) == "equip6") {
						return true;
					}
				});
				if (cards2.length) {
					await player.mjsStrengthenCards(cards2);
				}
			}
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					const cardList = Array.from(ui.discardPile.childNodes);
					if (cardList.reduce((list, card) => list.add(get.type2(card)), []).length < 3) return 0;
					return player.countCards("h") <= 3;
				},
			},
		},
	},
	/**请自隗始
	 * 当其他角色在其回合内打出第1张牌时，你可以将此牌的目标改为你。当有角色打出牌的目标不唯一并且包含你时，从你开始结算。
	 * */
	mjsqingziweishi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsqingziweishi" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			global: "useCard",
		},
		popup: false,
		filter(event, player) {
			if (event.player == player || event.player != _status.currentPhase) {
				return false;
			}
			return lib.filter.targetEnabled2(event.card, event.player, player) && event.player.getHistory("useCard").indexOf(event) == 0;
		},
		logTarget: "player",
		prompt2(event, player) {
			return `你可以将${get.translation(event.player)}使用的${get.translation(event.card)}的目标改为你`;
		},
		check(event, player) {
			const eff = event.targets.reduce((sum, target) => {
				sum += get.effect(target, event.card, event.player, player);
				return sum;
			});
			return eff < get.effect(player, event.card, event.player, player);
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
			trigger.targets.removeArray(trigger.targets);
			trigger.targets.push(player);
			game.log(trigger.card, "的目标被改为", player);
		},
		group: "mjsqingziweishi_use",
		subSkill: {
			use: {
				audio: "mjsqingziweishi",
				trigger: {
					global: "useCardToTargeted",
				},
				silent: true,
				filter(event, player) {
					if (!event.targets || event.targets.length <= 1) {
						return false;
					}
					if (event.targets.length != event.getParent().triggeredTargets4.length) {
						return false;
					}
					return event.targets.includes(player);
				},
				logTarget: "player",
				async content(event, trigger, player) {
					player.logSkill(event.name, trigger.player, null, null, [get.rand(1, 2)]);
					const evtx = trigger.getParent();
					trigger.targets = [player, ...trigger.targets.remove(player)];
					evtx.targets = [player, ...evtx.targets.remove(player)];
					evtx.triggeredTargets4 = [player, ...evtx.triggeredTargets4.remove(player)];
				},
			},
		},
	},
	//暴鸢
	/**百战无竭
	 * 当你受到杀的伤害时，摸2张牌。
	 * 同技能描述。
	 * 是故以众击寡，以治击乱，以富击贫，以能击不能，以教卒练士击驱众自徒。故十战十胜，百战百胜。——《韩非子·七法》
	 * */
	mjsbaizhanwujie: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌"],
		trigger: {
			player: "damageEnd",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.card?.name == "sha";
		},
		content() {
			player.draw(2);
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target, current) {
					if (card.name == "sha" && target.hp > 1) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						const players = game.filterPlayer();
						let max = 0;
						for (let i = 0; i < players.length; i++) {
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
	/**路转锋回
	 * 你无法选择杀的目标。当你打出的杀需要选择目标时，卜卦，根据卜卦牌的点数确定此杀目标。你的杀不计入出杀次数。
	 * 1.有可能会“击中”自己。
	 * 2.有可能会连续“击中”自己。
	 * 三十二年，相穰侯攻魏，至大梁，破暴鸢，斩首四万，鸢走，魏入三具请和。——《史记·秦本纪》
	 * */
	mjsluzhanfenghui: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "减益"],
		mod: {
			selectTarget(card, player, range) {
				if (card.name == "sha") {
					range[0] = -1;
					range[1] = -1;
				}
			},
			targetInRange(card, player, target) {
				if (card.name != "sha" || !card._mjsluzhanfenghui) return;
				if (player == target) return true;
			},
			targetEnabled(card, player) {
				if (card.name != "sha" || !card._mjsluzhanfenghui) return;
				return true;
			},
			cardEnabled(card, player, target) {
				if (card.name != "sha") return;
				if (player.hasSkillTag("nojudge")) {
					return false;
				}
				if (!Array.from(ui.discardPile.childNodes).length) {
					return false;
				}
				if (!card._mjsluzhanfenghui) return;
				if (player == target) return true;
			},
		},
		trigger: {
			player: "useCard0",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return event.card.name == "sha" && event.targets?.length;
		},
		async content(event, trigger, player) {
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				trigger.player.getStat().card.sha--;
			}
			trigger.hideTargets = true;
			//杀自己 => lib.filter.targetEnabled2
			trigger.card._mjsluzhanfenghui = true;
			const judgeEvent = player.judge();
			const result = await judgeEvent.forResult();
			if (!result) {
				//特殊处理无法判定
				trigger.targets.length = 0;
				trigger.all_excluded = true;
				return;
			}
			//卜卦：自己作为点数0，然后根据卜卦点数逆时针以此增加点数
			const targets = game
				.filterPlayer(target => {
					return lib.filter.targetEnabled2(trigger.card, trigger.player, target);
				})
				.sortBySeat(player);
			const index = result.number % targets.length;
			const target = targets[index];
			for (let i = 1; i <= result.number; i++) {
				const anim = targets[i % targets.length];
				anim.classList.add("selected");
				await game.delay();
				anim.classList.remove("selected");
			}
			if (target) {
				trigger.targets.removeArray(trigger.targets);
				trigger.targets.push(target);
				player.line(target);
			}
		},
	},
	/**蓄锐追斩
	 * 当你对一名角色打出杀后，若此杀未造成伤害，则你打出的下1张杀的伤害+1。
	 * 技能效果可以累加。
	 * 齐使章子，魏使公孙喜，韩使暴鸢共攻楚方城，取唐眛——《韩非子·七法》
	 * */
	mjsxuruizhuizhan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: "useCardAfter",
		},
		forced: true,
		locked: false,
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		filter(event, player) {
			return event.card.name == "sha" && event.targets.length && !player.hasHistory("sourceDamage", evt => evt.card == event.card);
		},
		async content(event, trigger, player) {
			player.addSkill(event.name + "_effect");
			player.addMark(event.name + "_effect", 1, false);
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard",
				},
				forced: true,
				popup: false,
				//charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					trigger.baseDamage += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				marktext: "蓄",
				intro: {
					content: "你打出的下1张杀的伤害+#",
				},
			},
		},
	},
	//申不害
	/**以术驭国
	 * 牌堆顶的第1张牌向你明示，当你打出的牌与此牌的花色或点数相同时，摸1张牌。
	 * 1.若你被封禁，则堆顶的第一张牌对你不再明示。
	 * 2.花色和点数同时相同，也只摸1张牌。
	 * 今申不害言术，而公孙鞅为法。术者，因任而授官，循名而责实，操杀生之柄，课群臣之能者也，此人主之所执也。——《韩非子·定法》
	 * */
	mjsyishuyuguo: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "摸牌"],
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					const cardx = ui.cardPile.firstChild;
					if ((get.suit(cardx) && get.suit(cardx) == get.suit(card)) || (get.number(cardx) && get.number(cardx) == get.number(card))) {
						return num + 10;
					}
				}
			},
		},
		init(player) {
			//用MutationObserver监视牌堆的变化感觉
			player.addSkill("mjsyishuyuguo_viewTop");
		},
		onremove(player) {
			lib.skill.mjsyishuyuguo.createDialog(player);
		},
		trigger: {
			player: "useCard",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			const card = ui.cardPile.firstChild;
			if (!card) {
				return false;
			}
			return ["suit", "number"].some(type => get[type](event.card) == get[type](card));
		},
		content() {
			player.draw();
		},
		createDialog(player) {
			if (player.isUnderControl(true) && player.hasSkillTag("viewTop")) {
				const cards = game.createFakeCards(lib.skill.mjsyishuyuguo.getCards(player));
				const createDialog = function (result) {
					if (!result?.length) {
						return;
					}
					player.node.mjsyishuyuguo?.remove();
					player.node.mjsyishuyuguo = ui.create.div(".mj-yishuyuguo", ui.arena);
					let node = player.node.mjsyishuyuguo;
					node.appendChild(result[0]);
					let transform = game.getExtensionConfig("名将杀", "mjsyishuyuguo_transform");
					if (transform) {
						node.style.left = transform[0];
						node.style.top = transform[1];
					}
					let OW, OH, ow, oh;
					let cilentW = document.getElementById("window").clientWidth;
					let cilentH = document.getElementById("window").clientHeight;
					if (lib.config.touchscreen) {
						node.addEventListener("touchstart", function (e) {
							OW = e.touches[0].clientX - node.offsetLeft;
							OH = e.touches[0].clientY - node.offsetTop;
							document.addEventListener("touchmove", defaultEvent, { passive: false });
						}, false)
						node.addEventListener("touchmove", function (e) {
							ow = node.style.left = Math.min(cilentW - node.clientWidth, Math.max(-node.clientWidth, parseInt(e.touches[0].clientX - OW))) + "px";
							oh = node.style.top = Math.min(cilentH - node.clientHeight, Math.max(-node.clientHeight, parseInt(e.touches[0].clientY - OH))) + "px";
						}, false)
						node.addEventListener("touchend", function () {
							document.removeEventListener("touchmove", defaultEvent, { passive: false });
							game.saveExtensionConfig("名将杀", "mjsyishuyuguo_transform", [ow, oh]);
						})
						function defaultEvent(e) {
							e.preventDefault()
						}
					}
					else {
						node.addEventListener("mousedown", function (e) {
							e.preventDefault()
							OW = e.clientX - node.offsetLeft;
							OH = e.clientY - node.offsetTop;
							document.addEventListener("mousemove", mousemove);
							document.addEventListener("mouseup", mouseup);
						})
						function mousemove(e) {
							ow = node.style.left = Math.min(cilentW - node.clientWidth, Math.max(-node.clientWidth, parseInt(e.clientX - OW))) + "px";
							oh = node.style.top = Math.min(cilentH - node.clientHeight, Math.max(-node.clientHeight, parseInt(e.clientY - OH))) + "px";
						}
						function mouseup() {
							document.removeEventListener("mousemove", mousemove);
							document.removeEventListener("mouseup", mouseup);
							game.saveExtensionConfig("名将杀", "mjsyishuyuguo_transform", [ow, oh]);
						}
					}
				};
				if (cards instanceof Promise) {
					cards.then(([ok, result]) => createDialog(result));
				} else {
					createDialog(cards);
				}
			} else {
				player.node.mjsyishuyuguo?.remove();
			}
		},
		getCards(player) {
			let cards = [];
			if (game.online) {
				return game.requestSkillData("mjsyishuyuguo", "getTopCards", 10000);
			} else {
				if (ui.cardPile.hasChildNodes !== false) {
					cards = Array.from(ui.cardPile.childNodes).slice(0, 1);
				}
			}
			return cards;
		},
		sync: {
			getTopCards(client) {
				if (ui.cardPile.hasChildNodes !== false) {
					return Array.from(ui.cardPile.childNodes).slice(0, 1);
				}
				return [];
			},
		},
		mark: true,
		marktext: "术",
		intro: {
			mark(dialog, content, player, event, skill) {
				if (player != game.me) {
					return get.translation(player) + "观看牌堆中...";
				}
				if (get.itemtype(ui.cardPile.firstChild) != "card") {
					return "牌堆顶无牌";
				}
				if (!player.hasSkill(skill)) {
					return;
				}
				dialog.add([ui.cardPile.firstChild]);
				lib.skill.mjsyishuyuguo.createDialog(player);
			},
		},
		ai: {
			viewTop: true,
		},
		subSkill: {
			viewTop: {
				charlotte: true,
				init(player) {
					lib.skill.mjsyishuyuguo.createDialog(player);
				},
				onChooseToUse(event) {
					if (game.online) {
						return;
					}
					const player = event.player;
					lib.skill.mjsyishuyuguo.createDialog(player);
				},
				onChooseToRespond(event) {
					if (game.online) {
						return;
					}
					const player = event.player;
					lib.skill.mjsyishuyuguo.createDialog(player);
				},
			},
		},
	},
	/**藏于无事
	 * 每个回合限1次，当你成为其他角色杀或战法牌的目标时，其手牌向你明示直到当前回合结束，你弃置的牌对其他角色暗置。
	 * 别人只能看到你弃置牌，但无法看到花色、点数、卡面。
	 * 故善为主者，倚于愚，立于不盈，设于不敢，藏于无事，窜端匿疏，示天下无为。是以近者亲之，远者怀之。示人有馀者人夺之，示人不足者人与之。刚者折，危者覆，动者摇，静者安。——《申子·大体》
	 * */
	mjschangyuwushi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制", "摸牌"],
		trigger: {
			target: "useCardToTarget",
		},
		usable: 1,
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return event.card.name == "sha" || get.type2(event.card) == "trick";
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.addTempSkill("mjschangyuwushi_view");
			player.markAuto("mjschangyuwushi_view", trigger.player);
		},
		group: ["mjschangyuwushi_hide", "mjschangyuwushi_hidden"],
		subSkill: {
			view: {
				charlotte: true,
				onremove: true,
				ai: {
					viewHandcard: true,
					skillTagFilter(player, tag, arg) {
						if (player == arg || !player.hasStorage("mjschangyuwushi_view", arg)) {
							return false;
						}
					},
				},
			},
			hide: {
				trigger: {
					player: "loseBefore",
				},
				forced: true,
				locked: false,
				firstDo: true,
				filter(event, player) {
					return event.type == "discard" && (!event.animate || event.visible);
				},
				async content(event, trigger, player) {
					trigger.visible = false;
					trigger.animate = false;
					trigger.log = false;
					trigger._mjschangyuwushi_hide = true;
				},
			},
			hidden: {
				trigger: {
					global: "chooseToDiscardBegin",
				},
				silent: true,
				filter(event, player) {
					const evt = event.getParent();
					return evt.name == "mjsliehuofencheng" && evt.player == player && event.suits?.length;
				},
				async content(event, trigger, player) {
					const evt = trigger.getParent();
					const suits2 = player
		            	.getHistory("lose", evtx => {
		            		return evtx.getParent(evt.name) == evt && evtx.type == "discard" && evtx._mjschangyuwushi_hide;
		            	})
		            	.reduce((list, evtx) => list.add(get.suit(evtx.cards2)), []);
		            if (!suits2.length) {
		            	return;
		            }
		            trigger.set("suits2", suits2);
					const original_filterCard = trigger.filterCard;
					trigger.filterCard = function(card, player) {
						if (get.event().suits2.length) {
							return true;
						}
						return original_filterCard.apply(this, arguments);
					};
				},
			},
		},
	},
	/**君操其柄
	 * 登场，你可以令一名其他角色获得“依术治国”。当你或者其阵亡时，未阵亡的角色将失去“以术驭国”、“依术治国”。
	 * 游戏开始时，你可以令一名其他角色获得“依术治国”。当你或者其阵亡时，未阵亡的角色将失去“以术驭国”、“依术治国”。
	 * 1.无论“你俩”中的任何一人阵亡，都会令另一人失去此技能。
	 * 2.此技能具有一一对应的关系，即“你俩”的阵亡不会让其他拥有“以术驭国”的角色失去技能。
	 * 明君如身，臣如手;君若号，臣如响。君设其本，臣操其末;君治其要，臣行其详;君操其柄，臣事其常。——《申子·大体》
	 * */
	mjsjuncaoqibing: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		derivation: "mjsyishuzhiguo",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame","changeSkillsAfter"],
		},
		silent: true,
		forced: false,
		filter(event, player) {
			if (event.name == "changeSkills") {
				return event.addSkill.includes("mjsjuncaoqibing");
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					let att = get.attitude(_status.event.player, target);
					if (att > 0) att += 1;
					if (target.hasSkill("mjsyishuyuguo") || target.hasSkill("mjsyishuzhiguo")) {
						att *= 2;
					}
					if (att == 0) att = Math.random();
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			player.addSkill("mjsjuncaoqibing_clear");
			player.markAuto("mjsjuncaoqibing_clear", [target]);
			const createSkills = mjs.addCreateSkills("mjsyishuzhiguo");
			await target.addSkills(createSkills);
		},
		subSkill: {
			clear: {
				trigger: {
					global: "die",
				},
				forced: true,
				forceDie: true,
				charlotte: true,
				filter(event, player) {
					return event.player == player || player.hasStorage("mjsjuncaoqibing_clear", event.player);
				},
				onremove(player, skill) {
					game.countPlayer2(current => {
						if (current == player || player.hasStorage(skill, current)) {
							current.removeSkills("mjsyishuyuguo");
							current.removeSkills("mjsyishuzhiguo");
						}
					}, true);
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
				},
			},
		},
	},
	/**依术治国
	 * 牌堆顶的第1张牌向你明示，当你打出的牌与此牌的花色或点数相同时，摸1张牌。
	 * */
	mjsyishuzhiguo: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "摸牌"],
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					const cardx = ui.cardPile.firstChild;
					if (get.suit(cardx) && get.suit(cardx) == get.suit(card)) {
						return num + 10;
					}
				}
			},
		},
		init(player) {
			player.addSkill("mjsyishuyuguo_viewTop");
		},
		onremove(player) {
			lib.skill.mjsyishuyuguo.createDialog(player);
		},
		trigger: {
			player: "useCard",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			const card = ui.cardPile.firstChild;
			if (!card) {
				return false;
			}
			return get.suit(event.card) == get.suit(card);
		},
		content() {
			player.draw();
		},
		mark: true,
		marktext: "术",
		intro: {
			mark(dialog, content, player, event, skill) {
				if (player != game.me) {
					return get.translation(player) + "观看牌堆中...";
				}
				if (get.itemtype(ui.cardPile.firstChild) != "card") {
					return "牌堆顶无牌";
				}
				if (!player.hasSkill(skill)) {
					return;
				}
				dialog.add([ui.cardPile.firstChild]);
				lib.skill.mjsyishuyuguo.createDialog(player);
			},
		},
		ai: {
			viewTop: true,
		},
	},
	//燕昭王
	/**修筑金台
	 * 每轮开始时，将场上人数张牌置入黄金台并增强。每名角色出牌阶段限1次，可以将1张手牌或装备置入黄金台并增强，然后卜卦，并获得黄金台中所有与卜卦牌点数相同的牌。你的回合开始时，你可以选择获得黄金台中的1张牌。
	 * 1.可以将“黄金台”视为一个牌池。
	 * 2.“黄金台”中可能会加入“无点数/无花色”的牌。
	 * 3.当“该技能被封禁时”’，并不会弃置黄金台中的所有牌。
	 * 燕昭王置千金于台上，以延天下士，谓之黄金台。——《太平御览·台上》
	 * */
	mjsxiuzhujintai: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:6",
		logAudio: index => "ext:名将杀/audio/skill/mjsxiuzhujintai" + (typeof index === "number" ? index : get.rand(1, 6)) + ".mp3",
		skill_tag: ["控制", "增益"],
		global: "mjsxiuzhujintai_global",
		trigger: {
			player: "phaseBegin",
		},
		filter(event, player, name) {
			return player.getExpansions("mjsxiuzhujintai_gold").length;
		},
		async cost(event, trigger, player) {
			const cards = player.getExpansions("mjsxiuzhujintai_gold");
			if (!cards.length) return;
			event.result = await player
				.chooseButton([get.translation(event.skill), cards])
				.set("ai", button => {
					const player = get.player();
					return get.value(button.link);
				})
				.forResult();
			if (event.result.bool && event.result.links?.length) {
				event.result.cards = event.result.links;
			}
		},
		async content(event, trigger, player) {
			await player.gain(event.cards, "gain2");
		},
		mark: true,
		marktext: "台",
		intro: {
			name: "黄金台",
			markcount: "expansion",
			mark(dialog, storage, player) {
				const addNewRow = lib.element.dialog.addNewRow.bind(dialog);
				dialog.css({
					top: get.is.phoneLayout() ? "5%" : "45%",
					width: "80%",
				});
				if (get.is.phoneLayout()) {
	              	dialog.classList.add("fullheight");
	            }
				const cards = player.getExpansions("mjsxiuzhujintai_gold");
				let list1 = [],
					list2 = [],
					list3 = [],
					list4 = [];
				for (let i = 1; i <= 8; i++) {
					const cards2 = cards.filter(card => get.number(card) == i);
					list1.addArray([
						{
							item: get.strNumber(i),
							ratio: 4,
						},
					]);
					list2.addArray([
						{
							item: cards2.length ? cards2 : " ",
							ratio: 4,
							itemCss: {
								opacity: 1,
							},
						},
					]);
				}
				for (let i = 9; i <= 13; i++) {
					const cards2 = cards.filter(card => get.number(card) == i);
					list3.addArray([
						{
							item: get.strNumber(i),
							ratio: 4,
						},
					]);
					list4.addArray([
						{
							item: cards2.length ? cards2 : " ",
							ratio: 4,
							itemCss: {
								opacity: 1,
							},
						},
					]);
				}
				addNewRow(...list1);
				addNewRow(...list2);
				addNewRow(...list3);
				addNewRow(...list4);
			},
		},
		onremove(player, skill) {
			const cards = player.getExpansions("mjsxiuzhujintai_gold");
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "mjsxiuzhujintai_put",
		subSkill: {
			put: {
				audio: ["ext:名将杀/audio/skill/mjsxiuzhujintai3.mp3", "ext:名将杀/audio/skill/mjsxiuzhujintai4.mp3"],
				trigger: {
					global: "roundStart",
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const cards = get.cards(game.countPlayer());
					const next = player.addToExpansion(cards, "gain2");
					next.gaintag.add("mjsxiuzhujintai_gold");
					await next;
					await player.mjsStrengthenCards(cards);
				},
			},
			gold: {
				name: "invisible",
			},
			global: {
				audio: "mjsxiuzhujintai",
				enable: "phaseUse",
				prompt() {
					const player = get.player();
					const targets = game.filterPlayer(target => lib.skill.mjsjinwucangjiao_global.filterTarget(null, player, target));
					let str = "可以将1张手牌或装备置入" + get.translation(targets);
					if (targets.length > 1) {
						str += "中的一人";
					}
					str += "的黄金台并增强，然后卜卦，并获得黄金台中所有与卜卦牌点数相同的牌。";
					return str;
				},
				filter(event, player) {
					return game.hasPlayer(target => lib.skill.mjsxiuzhujintai_global.filterTarget(null, player, target));
				},
				filterTarget(card, player, target) {
					return target.hasSkill("mjsxiuzhujintai") && !target.hasSkill("mjsxiuzhujintai_used", null, null, false);
				},
				selectTarget() {
					const player = get.player();
					const count = game.countPlayer(target => lib.skill.mjsxiuzhujintai_global.filterTarget(null, player, target));
					return count > 1 ? 1 : -1;
				},
				lose: false,
				discard: false,
				delay: false,
				async precontent(event, trigger, player) {
					const target = event.result.targets[0];
					const cards = target.getExpansions("mjsxiuzhujintai_gold");
					event.videoId = lib.status.videoId++;
					const func = (id, cards) => {
						const dialog = ui.create.dialog("黄金台");
						dialog.css({
			                position: "absolute",
			                top: get.is.phoneLayout() ? "5%" : "45%",
			                height: "60%",
			            });
			            dialog.contentContainer.css({
			                overflowY: "hidden",
			            });
						let list1 = [],
							list2 = [],
							list3 = [],
							list4 = [];
						const addNewRow = lib.element.dialog.addNewRow.bind(dialog);
						for (let i = 1; i <= 8; i++) {
							const cards2 = cards.filter(card => get.number(card) == i);
							list1.addArray([
								{
									item: get.strNumber(i),
									ratio: 4,
								},
							]);
							list2.addArray([
								{
									item: cards2.length ? cards2 : " ",
									ratio: 4,
									itemCss: {
										opacity: 1,
									},
								},
							]);
						}
						for (let i = 9; i <= 13; i++) {
							const cards2 = cards.filter(card => get.number(card) == i);
							list3.addArray([
								{
									item: get.strNumber(i),
									ratio: 4,
								},
							]);
							list4.addArray([
								{
									item: cards2.length ? cards2 : " ",
									ratio: 4,
									itemCss: {
										opacity: 1,
									},
								},
							]);
						}
						addNewRow(...list1);
						addNewRow(...list2);
						addNewRow(...list3);
						addNewRow(...list4);
						dialog.videoId = id;
						return dialog;
					};
					if (player.isOnline2()) {
						player.send(func, event.videoId, cards);
					} else {
						func(event.videoId, cards);
					}
					const result = await player
						.chooseCard()
						.set("prompt", false)
						.set("ai", card => {
							return 6 - get.value(card);
						})
						.forResult();
					game.broadcastAll("closeDialog", event.videoId);
					if (result?.bool) {
						event.result.cards = result.cards;
						event.result.target = target;
						event.result.targets = [target];
					} else {
						player.addTempSkill("mjsxiuzhujintai_aiCheck", {
							player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
						});
						event.getParent().goto(0);
					}
				},
				async content(event, trigger, player) {
					const cards = event.cards;
					const target = event.target;
					target.addTempSkill("mjsxiuzhujintai_used", "phaseUseAfter");
					const next = target.addToExpansion(cards, player, "give");
					next.gaintag.add("mjsxiuzhujintai_gold");
					await next;
					await player.mjsStrengthenCards(cards);
					const judgeEvent = player.judge(card => {
						return target.getExpansions("mjsxiuzhujintai_gold").filter(i => get.number(i) == get.number(card)).length;
					});
					judgeEvent.judge2 = result => result?.bool;
					const result = await judgeEvent.forResult();
					if (result?.bool) {
						const cards = target.getExpansions("mjsxiuzhujintai_gold").filter(card => get.number(card) == result.number);
						if (cards.length) await player.gain(cards, "gain2");
					}
				},
				ai: {
					order: 1,
					result: {
						player(player) {
							return !player.hasSkill("mjsxiuzhujintai_aiCheck");
						},
					},
				},
			},
			used: {
				charlotte: true,
			},
			aiCheck: {
				charlotte: true,
				ai: {
	            	skill_aiCheck: true,
	            },
			},
		},
	},
	/**强兵伐齐
	 * 你每累计获得3次增强牌时，之后每回合的摸牌数+1，出杀次数+1。
	 * */
	mjsqiangbingfaqi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["增益"],
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.getg && event.getg(player)?.some(card => card?.storage?.mjsstrengthen);
		},
		async content(event, trigger, player) {
			const num = trigger.getg(player).filter(card => card.storage?.mjsstrengthen).length;
			if (num > 0) player.addMark(event.name, num, false);
			while (player.countMark(event.name) >= 3) {
				player.removeMark(event.name, 3, false);
				player.addSkill("mjsqiangbingfaqi_effect");
				player.addMark("mjsqiangbingfaqi_effect", 1, false);
			}
		},
		subSkill: {
			effect: {
				trigger: {
					player: "phaseDrawBegin2",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += player.countMark("mjsqiangbingfaqi_effect");
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("mjsqiangbingfaqi_effect");
						}
					},
				},
			},
		},
	},
	//乐毅
	/**孤军连克
	 * 出牌阶段开始时，你可以对自己翻出牌堆顶的5张牌，并可以打出其中任意2种花色各1张牌，然后将剩余的牌放入牌堆底。
	 * 1.翻出牌后可以不打出，仍然会将牌放入牌堆底。
	 * 2.通过此技能打出的“杀”不计入出杀次数。
	 * 乐毅于是并护赵、楚、韩、魏、燕之兵以伐齐，破之济西。诸侯兵罢归，而燕军乐毅独追，至于临灾。齐泯王之败济西，亡走，保于莒。乐毅独留徇齐，齐皆城守。乐毅攻入临灾，尽取齐宝财物祭器输之燕。燕昭王大说，亲至济上劳军，行赏飨士，封乐毅于昌国，号为昌国君。——《史记·乐毅列传》
	 * */
	mjsgujunlianke: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "摸牌"],
		trigger: {
			player: "phaseUseBegin",
		},
		frequent: true,
		async content(event, trigger, player) {
			const cards = get.cards(5);
			const suits = [];
			await game.cardsGotoOrdering(cards);
			game.log(player, "翻开牌堆顶的", cards);
	        event.videoId = lib.status.videoId++;
	        const createDialog = function (player, cards, id) {
	            const dialog = ui.create.dialog("forcebutton", true);
	            dialog.classList.add("mj-flip");
	            dialog.classList.add("fullwidth");
	            dialog.videoId = id;
	            const buttons = ui.create.div(".buttons", dialog.content);
	            for (const card of cards) {
	                buttons.appendChild(card);
	                dialog.open();
	                ui.create.cardSpinning(card);
	            }
	        };
	        const closeDialog = function (id) {
	            const dialog = get.idDialog(id);
	            if (dialog) {
	                dialog.close();
	            }
	        };
	        game.broadcastAll(createDialog, player, cards, event.videoId);
	        await game.delay(2);
	        game.broadcastAll(closeDialog, event.videoId);
			while (suits.length < 2) {
				const result = await player
					.chooseButton(["你可以使用其中的一张牌", cards])
					.set("filterButton", button => {
						const suits = get.event().suits;
						if (suits.includes(get.suit(button.link, false))) return false;
						return get.player().hasUseTarget(button.link);
					})
					.set("suits", suits)
					.set("ai", button => {
						return get.player().getUseValue(button.link);
					})
					.forResult();
				if (result?.bool) {
					cards.removeArray(result.links);
					const card = result.links[0];
					suits.add(get.suit(card, false));
					if (player.hasUseTarget(card, true, false)) {
						await player.chooseUseTarget(card, true, false);
					}
				} else break;
			}
			//补一条鲁仲连的进厂时机，无主卡牌lose
			player.directgains(cards, null, "mjsgujunlianke_tag");
			await player.lose(cards, ui.cardPile);
			await game.delayx(2);
		},
		subSkill: {
			tag: {
				name: "invisible",
			},
		},
	},
	/**废苛顺民
	 * 每个回合限1次，当你回合外需要打出行动牌时，可以查看牌堆底的2张牌，并可以打出其中1张，然后弃置剩余牌。
	 * 查看牌后可以不打出，但仍然会弃置剩余牌。
	 * 然乐毅以百倍之众，数岁而不能下两城者，非其智力不，盖欲以仁义服齐之民，故不忍急攻而至于此也。夫以齐人苦闵王之暴，乐毅苟退而休兵，治其政令，宽其赋役，反其田里，安其老幼，使齐人无复斗志，则田单者独谁与战哉！奈何以百万之师，相持而不决，此固所以使齐人得徐而为之谋也。——《乐毅论》
	 * */
	mjsfeikeshunmin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "摸牌"],
		enable: ["chooseToUse", "chooseToRespond"],
		usable: 1,
		hiddenCard(player, name) {
			if (player != _status.currentPhase && get.type(name) == "basic" && lib.inpile.includes(name)) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || player == _status.currentPhase || event.mjsfeikeshunmin) {
				return false;
			}
			return lib.inpile.some(i => get.type(i) == "basic" && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event));
		},
		delay: false,
		async content(event, trigger, player) {
			const evt = event.getParent(2);
			const cards = get.bottomCards(2);
			await game.cardsGotoOrdering(cards);
			const result = await player
				.chooseCardButton("###废苛顺民###选择要" + (evt.name == "chooseToUse" ? "使用" : "打出") + "的牌", cards)
				.set("filterButton", button => {
					const player = get.player();
					return get.event().cards.includes(button.link);
				})
				.set(
					"cards",
					cards.filter(card => {
						if (player.hasSkill("aozhan") && card.name == "tao") {
							return (
								evt.filterCard(
									{
										name: "sha",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								) ||
								evt.filterCard(
									{
										name: "shan",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								)
							);
						}
						return evt.filterCard(card, evt.player, evt);
					})
				)
				.set("ai", button => {
					const card = button.link;
					if (get.type(card) == "equip") {
						return 0;
					}
					const evt = get.event().getParent(3),
						player = get.event().player;
					if (evt.type == "phase" && !player.hasValueTarget(card, null, true)) {
						return 0;
					}
					if (evt && evt.ai) {
						const tmp = _status.event;
						_status.event = evt;
						const result = (evt.ai || event.ai1)(card, player, evt);
						_status.event = tmp;
						return result;
					}
					return 1;
				})
				.forResult();
			if (result?.bool) {
				const card = result.links[0];
				let name = card.name,
					aozhan = player.hasSkill("aozhan") && name == "tao";
				if (aozhan) {
					name = evt.filterCard(
						{
							name: "sha",
							isCard: true,
							cards: [card],
						},
						evt.player,
						evt
					)
						? "sha"
						: "shan";
				}
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						(result, name) => {
							lib.skill.mjsfeikeshunmin_backup.viewAs = { name: name, cards: [result], isCard: true };
						},
						card,
						name
					);
					evt.set("_backupevent", "mjsfeikeshunmin_backup");
					evt.set("openskilldialog", "请选择" + get.translation(card) + "的目标");
					evt.backup("mjsfeikeshunmin_backup");
				} else {
					delete evt.result.used;
					evt.result.card = get.autoViewAs(card);
					if (aozhan) {
						evt.result.card.name = name;
					}
					evt.result.cards = [card];
					evt.redo();
					return;
				}
			}
			evt.goto(0);
		},
		ai: {
			effect: {
				target(card, player, target, effect) {
					if (get.tag(card, "respondShan")) {
						return 0.7;
					}
					if (get.tag(card, "respondSha")) {
						return 0.7;
					}
				},
			},
			order: 11,
			respondShan: true,
			respondSha: true,
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
			backup: {
				precontent() {
					var name = event.result.card.name,
						cards = event.result.card.cards.slice(0);
					event.result.cards = cards;
					var rcard = cards[0],
						card;
					if (rcard.name == name) {
						card = get.autoViewAs(rcard);
					} else {
						card = get.autoViewAs({ name, isCard: true });
					}
					event.result.card = card;
				},
				filterCard: () => false,
				selectCard: -1,
				log: false,
			},
		},
	},
	/**报惠王书
	 * 限定，每轮开始时，你可以弃置你的所有手牌，然后选择一名其他角色，将势力改为与其相同，并获得其手牌的复制。
	 * 1.至少需要1张手牌才能发动此技能。
	 * 2.获得的是“复制牌”。
	 * 乐毅报遗燕惠王书曰：臣不佞，不能奉承王命，以顺左右之心，恐伤先王之明，有害足下之义，故遁逃走赵。今足下使人数之以罪，臣恐侍御者不察先王之所以畜幸臣之理，又不白臣之所以事先王之心，故敢以书对。——《史记·乐毅列传》
	 * */
	mjsbaohuiwangshu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "摸牌"],
		trigger: {
			global: "roundStart",
		},
		popup: false,
		limited: true,
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					if (player.countCards("h") > 4) {
						return 0;
					}
					return target.countCards("h") - player.countCards("h") - 3;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			player.awakenSkill(event.name);
			await player.modedDiscard(player.getCards("h"));
			if (get.info("mjsyitongliuhe").groupFiter(player) && get.info("mjsyitongliuhe").groupFiter(target)) {
				await player.changeGroup(target.group);
			}
			const cards = [];
			for (const card of target.getCards("h")) {
				const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
				if (cardx) cards.push(cardx);
			}
			if (cards.length) {
				await player.gain(cards, "draw");
			}
		},
	},
	//赵威后
	/**质子为兵
	 * 出牌阶段限1次，你可以令一名其他角色获得你任意区域的1张牌，并交给你另外至少1张牌，然后令你受到的下1次伤害-1。当你打出因此获得的牌时，可以弃置另外一名其他角色的1张手牌。
	 * 每个回合限1次，当你即将受到伤害时，你可以令一名其他角色获得自己任意区域的一张牌，然后其可以交给你另外至少1张牌，并抵消此次伤害。
	 * 每个回合限1次，当你即将受到伤害时，你可以令一名其他角色获得自己任意区域的一张牌，然后交给你另外任意张牌，并抵消此次伤害。
	 * */
	mjszhiziweibing: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["防御", "控制"],
		onremove(player, skill) {
			player.removeSkill(skill + "_effect");
			player.removeGaintag(skill + "_tag");
		},
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			const result = await target.gainPlayerCard(player, "hej", true).forResult();
			if (!result?.bool) {
				return;
			}
			const result2 = await target
				.chooseToGive(player, "he", [1, Infinity], true, card => {
					return !get.event().cards.includes(card);
				})
				.set("cards", result.cards)
				.set("ai", card => {
					const { player, goon } = get.event();
					if (ui.selected.cards.length >= Math.max(1, player.hp)) {
	                    return 0;
	                }
	                if (typeof goon == "number") {
	                    return goon - get.value(card);
	                }
	                return 0;
				})
				.set(
	                "goon",
	                (() => {
	                	const num = player.getHp();
	                    if (get.attitude(target, player) <= 0) {
	                        return false;
	                    }
	                    if (target == get.zhu(player)) {
	                        return 9;
	                    }
	                    return 8 / Math.sqrt(num);
	                })()
	            )
				.forResult();
			if (result2?.bool && result2.cards?.length) {
				player.addSkill("mjszhiziweibing_effect");
				player.addMark("mjszhiziweibing_effect", 1, false);
				player.addGaintag(result2.cards, "mjszhiziweibing_tag");
			}
		},
		ai: {
			order() {
				return 7;
			},
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					return att * Math.max(target.countCards("he"), get.effect(player, { name: "shunshou" }, target, player));
				},
			},
		},
		group: "mjszhiziweibing_use",
		subSkill: {
			effect: {
				audio: "mjszhiziweibing",
				trigger: {
					player: "damageBegin4",
				},
				silent: true,
				popup: true,
				onremove: true,
				async content(event, trigger, player) {
					trigger.num -= player.countMark(event.name);
					player.removeSkill(event.name);
				},
				mark: true,
				intro: {
					content: "你下一次受到的伤害-#",
				},
			},
			use: {
				audio: "mjszhiziweibing",
				trigger: {
			        player: "gainAfter",
			        global: ["gameDrawAfter","loseAsyncAfter"],
			    },
			    silent: true,
			    forced: true,
			    filter(event, player) {
			    	if (!game.hasPlayer(target => target != player && target.hasDiscardableCards(player, "h"))) {
			    		return false;
			    	}
			        return player.hasHistory("lose", evt => evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.includes("mjszhiziweibing_tag")));
			    },
				async cost(event, trigger, player) {
			        event.result = await player
			            .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
			                return target != player && target.hasDiscardableCards(player, "h");
			            })
			            .set("ai", target => {
			                return get.effect(target, { name: "guohe_copy2" }, _status.event.player);
			            })
			            .forResult();
			    },
			    async content(event, trigger, player) {
			        const target = event.targets[0];
			        player.logSkill(event.name, target);
			        await player.discardPlayerCard(target, "h", true);
			    },
			},
			tag: {
				name: "质",
			},
		},
	},
	/**无民何有君
	 * 当一名角色跳过摸牌阶段、失去最后的手牌或者有牌被烧毁/销毁/移出时，你可以令其卜卦，若结果不为♣，则其失去1点体力。
	 * 当一名角色跳过摸牌阶段、失去最后的手牌或者有牌被销毁时，你可以令其卜卦，若结果不为♣，则其失去1点体力。
	 * 失去体力不会触发“受伤”效果。
	 * 齐王使使者问赵威后。书未发，威后问使者曰：“岁亦无恙耶？民亦无恙耶？王亦无恙耶？”使者不说，曰：“臣奉使使威后，今不问王，而先问岁与民，岂先贱而后尊贵者乎？”威后曰：“不然。苟无岁，何以有民？苟无民，何以有君？故有舍本而问末者耶？”——《战国策·齐策四》
	 * */
	mjswuminheyoujun: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["输出", "控制"],
		trigger: {
			global: ["phaseDrawSkipped", "phaseDrawCancelled", "loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "lose_toBurnDown", "lose_toDestroy", "cardsGotoSpecialAfter"],
		},
		getIndex(event, player, name) {
			if (["phaseDrawSkipped", "phaseDrawCancelled"].includes(name)) return [event.player];
			return game
				.filterPlayer(current => {
					if (event.player == current) {
						if (name == "loseAfter" && event.toDestroy) {
							return true;
						}
						if (["lose_toBurnDown", "lose_toDestroy"].includes(name)) {
							return true;
						}
						if (event.name == "cardsGotoSpecial") {
							return !event.notrigger;
						}
					}
					if (current.countCards("h")) {
						return false;
					}
					const evt = event.getl(current);
					return evt?.hs?.length;
				})
				.sortBySeat(_status.currentPhase);
		},
		filter: (event, player, name, target) => target?.isIn(),
		logTarget: (event, player, name, target) => target,
		check: (event, player, name, target) => {
			return get.attitude(player, target) <= 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = target.judge(card => {
				if (get.suit(card) == "club") {
					return 4;
				}
				return -4;
			});
			next.judge2 = result => !result?.bool;
			const result = await next.forResult();
			if (!result?.bool) {
				await target.loseHp();
			}
		},
	},
	//蔺相如
	/**完璧归赵
	 * 每个回合限1次，当有角色获得其他角色的牌时，你可以令其选择是否将这些牌增强并交给你，若其拒绝，你可以失去1点体力并销毁这些牌。
	 * 你自己获得牌也会触发此技能。
	 * 秦王度之，终不可强夺，遂许斋五日，舍相如广成传。相如度秦王虽斋，决负约不偿城，乃使其从者衣褐，怀其璧，从径道亡，归璧于赵。——《史记·廉颇蔺相如列传》
	 * */
	mjswanbiguizhao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制", "增益"],
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		usable: 1,
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") return [];
			if (!event.getl || !event.getg) return [];
			return game
				.filterPlayer(target => {
					return game.hasPlayer(current => {
						if (current == target) return false;
						let cards2 = event.getl(current).cards2;
						if (cards2.length) {
							let cards = event.getg(target);
							if (cards?.length && cards.containsSome(...cards2)) return true;
						}
						return false;
					});
				})
				.sortBySeat();
		},
		logTarget(event, player, triggername, target) {
			return target;
		},
		prompt2(event, player, triggername, target) {
			const cards = event.getg(target);
			return `你可以令其选择是否将${get.translation(cards)}增强并交给你，若其拒绝，你可以失去1点体力并销毁这些牌`;
		},
		check(event, player, triggername, target) {
			const cards = event.getg(target);
			if (target == player) {
				if (cards.every(card => card.storage?.mjsstrengthen)) {
					return false;
				}
			}
			return true;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = trigger.getg(target).filter(card => {
				return target.getCards("h").includes(card);
			});
			if (!cards.length) return;
			const result = await target
				.chooseBool(`是否响应${get.translation(player)}的【${get.translation(event.name)}】？`, `将${get.translation(cards)}增强并交给${get.translation(player)}`)
				.set("ai", () => {
					return get.event().goon;
				})
				.set("goon", get.attitude(target, player) > 0)
				.forResult();
			if (result?.bool) {
				await target.mjsStrengthenCards(cards);
				if (target != player) {
					await target.give(cards, player, "giveAuto");
				}
			} else {
				const { bool } = await player
					.chooseBool(`你可以失去1点体力并销毁${get.translation(target)}的${get.translation(cards)}`)
					.set("ai", () => {
						const { player, target } = get.event();
						if (get.attitude(player, target) > 0) return false;
						if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 3) return false;
						return true;
					})
					.set("target", target)
					.forResult();
				if (bool) {
					await player.loseHp();
					game.log(cards, "被销毁了");
					await target.lose(cards, "toDestroy", ui.special);
				}
			}
		},
	},
	/**渑池之会
	 * 出牌阶段限1次，选择两名其他角色，令其依次交给对方1张牌，否则你与其各失去1点体力。
	 * 依次交出牌，是指双方都交出1次，仅1次。
	 * 蔺相如前曰：“赵王窃闻秦王善为秦声，请奏盆缻秦王，以相娱乐。”秦王怒，不许。于是相如前进缻，因跪请秦王。秦王不肯击缻。相如曰：“五步之内，相如请得以颈血溅大王矣！”左右欲刃相如，相如张目叱之，左右皆靡。于是秦王不怿，为一击缻。相如顾召赵御史书曰“某年月日，秦王为赵王击缻”。秦之群臣曰：“请以赵十五城为秦王寿”。蔺相如亦曰：“请以秦之咸阳为赵王寿。”秦王竟酒，终不能加胜于赵。——《史记·廉颇蔺相如列传》
	 * */
	mjsmianchizhihui: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["输出", "控制"],
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		async content(event, trigger, player) {
			for (const target of event.targets) {
				const [current] = event.targets.slice().remove(target);
				const result = await target
					.chooseToGive(current, "he", `选择交给${get.translation(current)}1张牌，否则${get.translation(player)}和${get.translation(target)}（你）各失去1点体力`)
					.set("ai", card => {
						const { player, source, current } = get.event();
						if (get.event().eff >= 0) return 0;
						if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
							return 8 - get.value(card);
						}
						if (get.attitude(player, current) > 0) {
							return 6 - get.value(card);
						}
						return -get.useful(card);
					})
					.set("source", player)
					.set("current", current)
					.set("eff", get.effect(target, { name: "losehp" }, target))
					.forResult();
				if (!result?.bool) {
					await player.loseHp();
					await target.loseHp();
				}
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					return -1;
				},
			},
		},
	},
	/**将相和
	 * 每个回合限1次，当你失去体力后，你可以令一名其他角色交给你任意张牌，然后你回复等量体力，其下回合开始时摸等量张牌。
	 * 不包括卜卦区牌。
	 * 蔺相如固止之，曰：“公之视廉将军孰与秦王？”曰：“不若也。”相如曰：“夫以秦王之威，而相如廷叱之，辱其群臣，相如虽驽，独畏廉将军哉？顾吾念之，强秦之所以不敢加兵于赵者，徒以吾两人在也。今两虎共鬬，其势不俱生。吾所以为此者，以先国家之急而后私雠也。”——《史记·廉颇蔺相如列传》
	 * */
	mjsjiangxianghe: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["治疗", "增益"],
		trigger: {
			player: "loseHpEnd",
		},
		usable: 1,
		popup: false,
		filter(event, player) {
			return game.hasPlayer(target => target != player && target.countCards("he"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countCards("he") > 0;
				})
				.set("ai", target => {
					const player = get.player();
					return get.sgnAttitude(player, target) * Math.sqrt(target.countCards("he"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const result = await target
				.chooseCard("he", [1, Infinity], "allowChooseAll", `交给${get.translation(player)}任意张牌，然后其回复等量体力，你下回合开始时摸等量张牌`)
				.set("ai", function (card) {
					const target = get.player();
					const player = _status.event.getParent().player;
					if (get.attitude(target, player) > 0) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.forResult();
			if (result?.bool && result.cards?.length) {
				await target.give(result.cards, player, "giveAuto");
				await player.recover(result.cards.length);
				target.addSkill("mjsjiangxianghe_effect");
				target.addMark("mjsjiangxianghe_effect", result.cards.length, false);
			}
		},
		ai: {
			maihp: true,
			effect: {
				target(card, player, target) {
					if (target.storage?.counttrigger?.mjsjiangxianghe) return;
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, 0.5];
						}
						return 1.2;
					}
					if (get.tag(card, "loseHp")) {
						if (target.hp <= 1) {
							return;
						}
						return [1, 1];
					}
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				intro: {
					content: "下回合开始时摸#张牌",
				},
				content() {
					player.draw(player.countMark(event.name));
					player.removeSkill(event.name);
				},
			},
		},
	},
	//廉颇
	/**负荆请罪
	 * 出牌阶段限1次，你可以获得攻击范围内一名其他角色任意区域内的2张牌，其下个回合开始时，你失去1点体力，然后将因此获得的牌交回。
	 * 出牌阶段限1次，你可以获得一名其他角色的2张牌，其下个回合开始时，你失去1点体力，然后将因此获得的牌交回。
	 * 出牌阶段限1次，你可以获得一名距离1以内的其他角色的2张牌，其下个回合开始时，你失去1点体力，然后将因此获得的牌交回。
	 * 可以获得卜卦区的牌。
	 * 廉颇闻之，肉袒负荆，因宾客至蔺相如门谢罪。曰：“鄙贱之人，不知将军宽之至此也。”卒相与驩，为刎颈之交。——《史记·廉颇蔺相如列传》
	 * */
	mjsfujingqingzui: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["减益", "摸牌"],
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("mjsfujingqingzui_mark")) {
					return num + 0.1;
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.mjsfujingqingzui.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target != player && player.inRange(target) && target.countGainableCards(player, "hej");
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const result = await player.gainPlayerCard(target, "hej", 2, true).forResult();
			if (!result.bool) return;
			player
				.when({ global: "phaseBegin" })
				.filter(evt => evt.player == target)
				.then(async (event, trigger, player) => {
					//没有因此获得的手牌便不用流失体力，无罪可请，气笑了
					//现在不会了，但是为旧版廉颇保留这个特性（bug）
					await player.loseHp();
					const cards = result.cards.filter(card => player.getCards("he").includes(card));
					if (cards.length) {
						await player.give(cards, target, "giveAuto");
					}
				});
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return -1;
				},
			},
		},
		subSkill: {
			tag: {
				name: "荆",
			},
		},
	},
	/**尚能饭否
	 * 回合结束时，若你的出杀次数：为0，你可以摸牌至手牌上限，并且之后每回合出杀次数+1；不为0，你摸剩余出杀次数张牌。
	 * 若你的手牌大于等于手牌上限，仍然触发技能，但不摸牌。
	 * 廉颇居梁久之，魏不能信用。赵以数困于秦兵，赵王思复得廉颇，廉颇亦思复用于赵。赵王使使者视廉颇尚可用否。廉颇之仇郭开多与使者金，令毁之。赵使者既见廉颇，廉颇为之一饭斗米，肉十斤，被甲上马，以示尚可用。——《史记·廉颇蔺相如列传》
	 * */
	mjsshangnengfanfou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "摸牌"],
		trigger: {
			player: "phaseEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		async content(event, trigger, player) {
			if (
				player.getHistory("useCard", evt => {
					return evt.card.name == "sha" && evt.addCount !== false;
				}).length == 0
			) {
				const { bool } = await player.chooseBool("你可以摸牌至手牌上限，并且之后每回合出杀次数+1").forResult();
				if (bool) {
					await player.drawTo(player.getHandcardLimit());
					lib.skill.mjsallsha.change(player, 1);
				}
			} else {
				//小朋友们注意了，有出杀无次数限制的技能（例【诸葛连弩】），会直接摸空牌堆自动平局
				const num = player.getCardUsable("sha");
				if (num > 0) {
					await player.draw(num);
				}
			}
		},
	},
	//孟姚
	/**颜若苕荣
	 * 每个回合限1次，当其他角色打出的行动牌或战法牌选择除你以外的目标时，你可以令自己也成为此牌的目标。
	 * 1.技能效果不包含“卜卦牌”。
	 * 2.当“其他角色”选择他自己为目标时，也能触发此技能。
	 * 王尝梦见处女，鼓瑟而歌，曰：“美人荧荧兮，颜若苕之荣，命兮命兮，逢天时而生，曾莫我嬴嬴。”——《史记·列女传》
	 * */
	mjsyanruoshaorong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			global: "useCardToPlayer",
		},
		usable: 1,
		autodelay: true,
		filter(event, player) {
			if (event.player == player || !event.targets?.length) {
				return false;
			}
			if (event.targets.includes(player)) {
				return false;
			}
			if (!["basic", "trick"].includes(get.type(event.card))) return false;
			if (get.info(event.card).multitarget) {
				return false;
			}
			return lib.filter.targetEnabled2(event.card, event.player, player);
		},
		check(event, player) {
			if (["jiu", "nu"].includes(event.card.name)) {
				return false;
			}
			return get.effect(player, event.card, event.player, player) > 0;
		},
		async content(event, trigger, player) {
			trigger.getParent().targets.add(player);
			trigger.player.line(player);
		},
	},
	/**鼓瑟而歌
	 * 每个回合首次打出装备牌时，随机获得1张战法牌；首次打出战法牌时，随机获得1张装备牌。
	 * 1.仅“首次”有效。
	 * 2.如果牌堆没有对应的牌，则无法获得。
	 * 王尝梦见处女，鼓瑟而歌，曰：“美人荧荧兮，颜若苕之荣，命兮命兮，逢天时而生，曾莫我嬴嬴。”——《史记·列女传》
	 * */
	mjsguseerge: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌"],
		trigger: {
			player: "useCard",
		},
		silent: true,
		forced: true,
		locked: false,
		filter(event, player) {
			if (["equip", "trick"].includes(get.type2(event.card))) {
				return false;
			}
			return player.getHistory("useCard", evt => get.type(evt.card) == get.type2(event.card)).indexOf(event) == 0;
		},
		async content(event, trigger, player) {
			const card = get.cardPile2(
				card => {
					return get.type2(card) == (get.type2(trigger.card) == "equip" ? "trick" : "equip");
				},
				null,
				"random"
			);
			if (card) await player.gain(card);
		},
	},
	//平原君
	/**斩笑立信
	 * 出牌阶段限1次，你可以销毁一名其他角色的1张牌，然后令所有与你势力相同的角色依次摸1张牌，并交给你1张牌。
	 * 销毁牌可以是卜卦区的牌
	 * 门下一人前对曰：“以君之不杀笑躄者，以君为爱色而贱士，士即去耳。”于是平原君乃斩笑躄者美人头，自造门进躄者，因谢焉。其后门下乃复稍稍来。——《史记·平原君列传》
	 * */
	mjszhanxiaolixin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		enable: "phaseUse",
		skill_tag: ["控制", "摸牌"],
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.mjszhanxiaolixin.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("hej", card => lib.filter.cardDestuctible(card, target, "mjszhanxiaolixin"));
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const result = await player
				.choosePlayerCard(target, "hej", true)
				.set("filterButton", button => {
					return lib.filter.cardDestuctible(button.link, get.owner(button.link), "mjszhanxiaolixin");
				})
				.set("ai", button => {
					return get.value(button.link);
				})
				.forResult();
			if (result?.bool && result.cards?.length) {
				const cards = result.cards;
				game.log(cards, "被销毁了");
				await target.lose(cards, "toDestroy", ui.special);
			}
			await game.delay();
			if (!get.info("mjsyitongliuhe").groupFiter(player)) {
				return;
			}
			const targets = game.filterPlayer(target => {
				if (!get.info("mjsyitongliuhe").groupFiter(target)) {
					return false;
				}
				return target.group == player.group;
			});
			for (const target of targets) {
				if (!target.isIn()) {
					continue;
				}
				await target.draw();
				if (target.countCards("he") && target != player) {
					await target.chooseToGive(player, "he", true);
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					const hs = target.getCards(player, "h");
					const es = target.getCards(player, "e");
					const js = target.getCards(player, "j");
					if (!hs.length && !es.length && !js.length) {
						return 0;
					}
					if (att > 0) {
						if (
							js.some(card => {
								const cardj = card.viewAs ? { name: card.viewAs } : card;
								if (cardj.name === "xumou_jsrg") {
									return false;
								}
								return get.effect(target, cardj, target, player) < 0;
							})
						) {
							return 3;
						}
						if (target.isDamaged() && es.some(card => card.name === "baiyin") && get.recoverEffect(target, player, player) > 0) {
							if (target.hp === 1 && !target.hujia) {
								return 1.6;
							}
						}
						if (
							es.some(card => {
								return get.value(card, target) < 0;
							})
						) {
							return 1;
						}
						return -1.5;
					}
					const noh = hs.length === 0 || target.hasSkillTag("noh");
					const noe = es.length === 0 || target.hasSkillTag("noe");
					const noe2 =
						noe ||
						!es.some(card => {
							return get.value(card, target) > 0;
						});
					const noj =
						js.length === 0 ||
						!js.some(card => {
							const cardj = card.viewAs ? { name: card.viewAs } : card;
							if (cardj.name === "xumou_jsrg") {
								return true;
							}
							return get.effect(target, cardj, target, player) < 0;
						});
					if (noh && noe2 && noj) {
						return 1.5;
					}
					return -1.5;
				},
			},
		},
	},
	/**利令智昏
	 * 其他角色受到伤害时，你可以将其势力改为与你相同；其他角色回合开始时，若你在其攻击范围内，你可以令其本回合打出的杀无法选择与你势力相同的其他角色为目标。
	 * “只能选择你作为目标” ，目标唯一。
	 * 平原君，翩翩浊世之佳公子也，然未睹大体。鄙语曰“利令智昏”，平原君贪冯亭之邪说，使赵陷长平四十余万众，邯郸几亡。——《史记·平原君列传》
	 * */
	mjslilingzhihun: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "减益"],
		trigger: {
			global: ["damageEnd", "phaseBegin"],
		},
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			if (event.name == "damage") {
				if (get.info("mjsyitongliuhe").groupFiter(event.player) || get.info("mjsyitongliuhe").groupFiter(player)) {
					return false;
				}
				return event.player.isIn() && event.player.group != player.group;
			}
			return event.player.inRange(player);
		},
		prompt2(event, player) {
			if (event.name == "damage") return "你可以将其势力改为与你相同";
			return "你可以令其本回合打出的杀无法选择与你势力相同的其他角色为目标";
		},
		logTarget: "player",
		check(event, player) {
			if (event.name == "damage") {
				return true;
			}
			return get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (trigger.name == "damage") {
				const next = target.changeGroup(player.group);
				next.source = player;
				await next;
			} else {
				target.addTempSkill("mjslilingzhihun_debuff");
				target.markAuto("mjslilingzhihun_debuff", [player]);
			}
		},
		subSkill: {
			debuff: {
				charlotte: true,
				onremove: true,
				mod: {
					targetEnabled(card, player, target) {
						if (card.name != "sha") return;
						if (player.getStorage("mjslilingzhihun_debuff").some(current => {
							if (!get.info("mjsyitongliuhe").groupFiter(current)) {
								return false;
							}
							return current != target && current.group == target.group;
						})) {
							return false;
						}
					},
				},
				mark: true,
				intro: {
					markcount: () => 0,
					content: "你打出的杀无法选择与$势力相同的其他角色为目标",
				},
			},
		},
	},
	//苏秦
	/**合纵
	 * 出牌阶段限1次，你可以查看并增强一名角色的1张牌。回合开始时，场上每存在1种势力，本回合此技能的发动次数+1。
	 * 出牌阶段限1次，你可以查看并增强一名角色的1张牌。场上每存在1种势力，此技能的发动次数+1。
	 * 1.查看：仅展示于你增强的牌。
	 * 2.当你拥有2个不同势力时，都会被计算入“场上每存在一种不同势力”。
	 * 苏秦既约六国从亲，归赵，赵肃侯封为武安君，乃投从约书於秦。秦兵不敢闚函谷关十五年。——《史记·苏秦列传》
	 * */
	mjshezong: {
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.countMark("mjshezong_counter");
		},
		filterTarget(card, player, target) {
			if (ui.selected.cards.length || target == player) {
				return false;
			}
			return target.countCards("he", card => lib.filter.canBeStrengthened(card, target, "mjshezong"));
		},
		selectTarget: [0, 1],
		filterCard(card, player) {
			if (ui.selected.targets.length) {
				return false;
			}
			return lib.filter.canBeStrengthened(card, player, "mjshezong");
		},
		position: "he",
		selectCard: [0, 1],
		check(card) {
			return get.value(card);
		},
		filterOk() {
			return ui.selected.targets.length != ui.selected.cards.length;
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			if (event.cards?.length) {
				await player.mjsStrengthenCards(event.cards, player);
				return;
			}
			const [target] = event.targets;
			const cards = target.getCards("he", card => {
				return lib.filter.canBeStrengthened(card, target, "mjshezong");
			});
			if (!cards.length) return;
			const result = await player
				.chooseCardButton(get.translation(event.name), target.getCards("he"), true)
				.set("filterButton", button => {
					return lib.filter.canBeStrengthened(button.link, get.owner(button.link), "mjshezong");
				})
				.set("ai", button => {
					const player = get.player();
					if (button.link?.storage?.mjsstrengthen) return 0;
					return get.value(button.link);
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				await target.mjsStrengthenCards(result.links, player);
			}
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					const hs = target.getCards("he", card => {
						return lib.filter.canBeStrengthened(card, target, "mjshezong");
					});
					if (!hs.length) {
						return 0;
					}
					return att * hs.length;
				},
			},
		},
		group: "mjshezong_use",
		subSkill: {
			use: {
				audio: "mjshezong",
				trigger: {
					player: "phaseBegin",
				},
				silent: true,
				locked: false,
				popup: false,
				async content(event, trigger, player) {
					const num = game.countGroup();
					if (num > 0) {
						player.addTempSkill("mjshezong_counter");
						player.addMark("mjshezong_counter", num, false);
					}
				},
			},
			counter: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**六国相印
	 * 你同时拥有2个势力。每回合开始时，你可以将自己的1个势力变为六国的任意1个势力。
	 * 2个势力可以相同。
	 * 于是六国从合而并力焉。苏秦为从约长，并相六国。——《史记·苏秦列传》
	 * */
	mjsliuguoxiangyin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		getList: ["han", "yan", "zhao", "wèi", "chu", "qi"],
		init() {
			if (_status.mjs_countGroup) {
				return;
			}
			_status.mjs_countGroup = game.countGroup;
			game.broadcastAll(() => {
				game.countGroup = function () {
					const list = lib.group.slice(0);
					list.remove("g_noname");
					return game.countPlayer(current => {
						if (!list.includes(current.group) && !list.includes(current.group2)) {
							return false;
						}
						list.remove(current.group);
						list.remove(current.group2);
						return true;
					});
				};
			});
		},
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		forced: false,
		locked: false,
		popup: false,
		filter(event, player) {
			if (!get.info("mjsyitongliuhe").groupFiter(player)) {
				return false;
			}
			return true;
		},
		async cost(event, trigger, player) {
			const list = get.info(event.skill).getList.slice();
			const { control } = await player
				.chooseControl(list, "cancel2")
				.set("prompt", get.prompt(event.skill))
				.forResult();
			if (control != "cancel2") {
				if (!player.group2) {
					event.result = {
						bool: true,
						cost_data: {
							control: control,
						},
					};
				} else {
					const list2 = [player.group, player.group2];
					event.result = await player.chooseControl(list2).set("prompt", `请选择替换的势力`).forResult();
					event.result.cost_data = {
						control: control,
						index: event.result.index + 1,
					};
				}
			}
		},
		async content(event, trigger, player) {
			const group = event.cost_data.control,
				index = event.cost_data.index;
			if (!event.cost_data?.index) {
				game.broadcast(
					function (player, group) {
						player.group2 = group;
					},
					player,
					group
				);
				player.group2 = group;
				game.log(player, "将次势力变为了", "#y" + get.translation(group + 2));
			} else {
				player["changeGroup" + (index == 1 ? "" : "2")](group);
			}
		},
	},
	/**刺股
	 * 出牌阶段，若你没有可以打出的手牌，你可以失去1点体力，摸2张牌。然后令此技能失去的体力数和摸牌数+1，直到当前回合结束。
	 * 1.一回合内可以发动多次。
	 * 2.仅限于手牌区没有可打出的牌，不包括技能牌区等。
	 * 乃夜发书，陈箧书事，得《太公阴符》之谋，伏而诵之，简练以为揣摩。读书欲睡，引锥自刺其股，血流至足。——《战国策·秦策一》
	 * */
	mjscigu: {
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "摸牌"],
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasCard(card => {
				return player.hasUseTarget(card, true, true);
			});
		},
		async content(event, trigger, player) {
			const num = player.countMark("mjscigu_counter");
			await player.loseHp(1 + num);
			await player.draw(2 + num);
			player.addTempSkill("mjscigu_counter");
			player.addMark("mjscigu_counter", 1, false);
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1 + player.countMark("mjscigu_counter")) {
						return 0;
					}
					return 1;
				},
			},
		},
		subSkill: {
			counter: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//西门豹
	/**引漳十二渠
	 * 你可以将1张♠牌给一名此阶段未选择过的其他角色，并获得其任意区域的1张牌，然后若你手牌中没有与此花色相同花色的牌，你获得1张♠牌。
	 * 你可以将1张♠牌给一名其他角色，每名角色每回合限1次，然后获得其1张牌。若你手牌中没有此花色，你获得1张♠牌。
	 * 1.你有概率会获得给出去的牌。
	 * 2.获得1张♠牌，是指从牌堆随机获得1张♠牌。
	 * 西门豹即发民凿十二渠，引河水灌民田，田皆溉。——《史记·滑稽列传》
	 * */
	mjsyinzhangshierqu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制", "摸牌"],
		enable: "phaseUse",
		filter(event, player) {
			if (!player.countCards("he", { suit: "spade" })) return false;
			return game.hasPlayer(target => lib.skill.mjsyinzhangshierqu.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target != player && !player.hasStorage("mjsyinzhangshierqu_used", target);
		},
		filterCard(card) {
			return get.suit(card) == "spade";
		},
		check(card) {
			if (card.name == "shan") {
				return 10;
			}
			return 7 - get.value(card);
		},
		position: "he",
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const [target] = event.targets;
			player.addTempSkill("mjsyinzhangshierqu_used");
			player.markAuto("mjsyinzhangshierqu_used", event.targets);
			const suit = get.suit(event.cards[0]);
			await player.give(event.cards, target, "giveAuto");
			if (target.countGainableCards(player, "hej")) {
				await player.gainPlayerCard(target, "hej", true);
			}
			if (!player.countCards("h", { suit: suit })) {
				const card = get.cardPile(
					card => {
						return get.suit(card) == suit;
					},
					null,
					"random"
				);
				if (card) await player.gain(card, "draw");
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					return get.sgnAttitude(player, target);
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**厚民薄库
	 * 你可以弃置2张相同花色的牌，令任意名角色各获得1张♠牌。
	 * */
	mjshouminboku: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌"],
		enable: "phaseUse",
		filterCard(card, player) {
			if (ui.selected.cards.length) {
				return get.suit(card) == get.suit(ui.selected.cards[0]);
			}
			const cards = player.getCards("hs");
			for (let i = 0; i < cards.length; i++) {
				if (card != cards[i]) {
					if (get.suit(card) == get.suit(cards[i])) {
						return true;
					}
				}
			}
			return false;
		},
		selectCard: 2,
		check(card) {
			if (ui.selected.cards.length) {
				return 7 - get.value(card);
			}
			return 6 - get.value(card);
		},
		complexCard: true,
		filterTarget: true,
		selectTarget: [1, Infinity],
		multitarget: true,
		line: false,
		async content(event, trigger, player) {
			const list = [],
				suit = "spade";
			for (const target of event.targets) {
				const card = get.cardPile(card => {
					return get.suit(card) == suit;
				});
				if (card) {
					await game.cardsGotoOrdering([card]);
					list.push([target, [card]]);
				}
			}
			await game
				.loseAsync({
					gain_list: list,
					giver: player,
					animate: "draw",
				})
				.setContent("gaincardMultiple");
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return 1;
				},
			},
		},
	},
	/**入报河伯
	 * 限定，你将场上和弃牌堆中所有的♠牌洗回牌堆。
	 * 1.包含场上所有角色所有区域的♠牌。
	 * 2.所有的闪都是♠牌。
	 * 豹视之，顾谓三老、巫祝、父老曰：“是女子不好，烦大巫妪为入报河伯，得更求好女，后日送之。”即使吏卒共抱大巫妪投之河中。有顷，曰：“巫妪何久也？弟子趣之！”复以弟子一人投河中。有顷，曰：“弟子何久也？复使一人趣之！”复投一弟子河中。凡投三弟子。——《史记·滑稽列传》
	 * */
	mjsrubaohebo: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制"],
		enable: "phaseUse",
		limited: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = Array.from(ui.discardPile.childNodes).filter(card => get.suit(card) == "spade");
			const cardList = [];
			const lose_list = [],
				players = game.filterPlayer();
			players.forEach(current => {
				const pos = "hej";
				const cards2 = current.getCards(pos, card => get.suit(card) == "spade");
				if (cards2.length > 0) {
					cards.addArray(cards2);
					current.$throw(cards2);
					lose_list.push([current, cards2]);
					cardList.addArray(cards2);
				}
			});
			if (lose_list.length) {
				await game.loseAsync({ lose_list }).setContent("chooseToCompareLose");
				await game.delayx();
			}
			await game.cardsGotoPile(cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});
			await game.washCard();
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					return 1;
				},
			},
		},
	},
	//信陵君
	/**食客三千
	 * 每轮开始时，你查看其他所有角色各1张手牌。当你查看过的牌被打出后，你获得此牌。
	 * 1.查看牌的动作，仅你可见。
	 * 2.被标记的牌，在完成打出动作后，才会被“获得”。
	 * 公子为人仁而下士，士无贤不肖皆谦而礼交之，不敢以其富贵骄士。士以此方数千里争往归之，致食客三千人。当是时，诸侯以公子贤，多客，不敢加兵谋魏十馀年。——《史记·魏公子列传》
	 * */
	mjsshikesanqian: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsshikesanqian" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		skill_tag: ["增益"],
		trigger: {
			global: ["roundStart", "useCardAfter", "respondAfter"],
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			if (["useCard", "respond"].includes(event.name)) {
				return event.cards?.length && event.cards.some(card => player.hasStorage("mjsshikesanqian", card));
			}
			return game.hasPlayer(target => target != player && target.countCards("h"));
		},
		async content(event, trigger, player) {
			if (event.triggername == "roundStart") {
				//随机观看
				const targets = game
					.filterPlayer(target => {
						return target != player && target.countCards("h");
					})
					.sortBySeat(player);
				const list = [];
				for (const target of targets) {
					const hs = target.getCards("h").randomGets(1);
					list.push([target, hs]);
				}
				if (!list.length) {
					return;
				}
				for (const info of list) {
					const [target, cards] = info;
					if (!cards.length) {
						continue;
					}
					player.$chooseToShowCards(cards, target, event);
				}
				await player.chooseControl("ok").set("prompt", "是否结束查看手牌");
				const cards = list.map(info => info[1]).flat();
				for (const target of targets) {
					target.$chooseToHideCards();
				}
				game.addCardKnower(cards, player);
				player.markAuto(event.name, cards);
			} else {
				player.unmarkAuto(event.name, trigger.cards);
				const cards = trigger.cards.filterInD("od");
				if (cards.length) {
					await player.gain(cards, "gain2");
				}
			}
		},
		intro: {
			mark(dialog, content, player) {
				var content = player.getStorage("mjsshikesanqian");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "已查看" + get.cnNumber(content.length) + "张牌";
					}
				}
			},
			content(content, player) {
				var content = player.getStorage("mjsshikesanqian");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "已查看" + get.cnNumber(content.length) + "张牌";
				}
			},
		},
	},
	/**盗符刺将
	 * 出杀，你对有流血状态的角色伤害+1。当你获得其他角色的装备牌时，可以令一名其他角色增加1层流血。
	 * 流血：回合结束时，令目标角色失去1点体力值并清除1层效果，若其在其回合内回复过体力，则清除1层效果;该状态效果可叠加。
	 * 1.流血效果只有回合内回复体力值能够消减；
	 * 2.流血效果造成的是“体力流失”，且可以叠加；
	 * 3.以任何形式“获得”的装备牌，都会触发对应技能效果。
	 * 公子行，侯生曰：“将在外，主令有所不受，以便国家。公子即合符，而晋鄙不授公子兵而复请之，事必危矣。臣客屠者朱亥可与俱，此人力士。晋鄙听，大善；不听，可使击之。”——《史记·魏公子列传》
	 * */
	mjsdaofucijiang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsdaofucijiang" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		skill_tag: ["输出", "增益"],
		derivation: "mjs_debuff_liuxue_faq",
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		silent: true,
		forced: false,
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") return [];
			if (!event.getl || !event.getg) return [];
			let cards = event.getg(player);
			if (cards.some(card => get.type(card) == "equip")) return [];
			return game
				.filterPlayer(current => {
					if (current == player) return false;
					if (cards.length) {
						let evt = event.getl?.(current);
						if (evt?.cards2?.length && evt.cards2.some(card => get.type(card) == "equip" && cards.includes(card))) return true;
					}
					return false;
				})
				.sortBySeat();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "你可以令一名其他角色增加1层流血", lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					return -att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
			target.addSkill("mjs_debuff_liuxue");
			target.addMark("mjs_debuff_liuxue");
		},
		group: "mjsdaofucijiang_use",
		subSkill: {
			use: {
				trigger: {
					player: "useCardToTargeted",
				},
				silent: true,
				forced: false,
				filter(event, player) {
					return event.card.name == "sha" && event.target.hasSkill("mjs_debuff_liuxue");
				},
				check(event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				async content(event, trigger, player) {
					player.logSkill("mjsdaofucijiang", trigger.target, null, null, [get.rand(3, 4)]);
					const id = trigger.target.playerid;
					const map = trigger.getParent().customArgs;
					if (!map[id]) {
						map[id] = {};
					}
					if (typeof map[id].extraDamage != "number") {
						map[id].extraDamage = 0;
					}
					map[id].extraDamage++;
				},
			},
		},
	},
	/**魏死士
	 * 回合结束时，你可以查看牌堆顶的3张牌并标记其中1张牌，然后将所有牌按顺序放回牌堆顶。当此牌被其他角色打出时，你可以令其增加1层流血并销毁此牌；当此牌被弃置后，你获得此牌。
	 * 流血：回合结束时，令目标角色失去1点体力值并清除1层效果，若其在其回合内回复过体力，则清除1层效果;该状态效果可叠加。
	 * 1.此技能动作不会改变既有的牌堆顺序；
	 * 2.所有都能看到谁手上有多少张“死士”；
	 * */
	mjsweisishi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsweisishi" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		skill_tag: ["输出", "控制", "增益"],
		derivation: "mjs_debuff_liuxue_faq",
		trigger: {
			player: "phaseEnd",
		},
		prompt2: "你可以查看牌堆顶的3张牌并标记其中1张牌，然后将所有牌按顺序放回牌堆顶。",
		async content(event, trigger, player) {
			const cards = get.cards(3);
			const result = await player
				.chooseCardButton("魏死士", cards)
				.set("ai", button => {
					const player = get.player();
					const source = player.getNext()
					const eff = Math.max(1, source.getUseValue(button.link));
					return eff;
				})
				.forResult();
			if (result?.links?.length) {
				const card = result.links[0];
				card.storage.mjsweisishi = true;
				game.log(player, "标记了一张牌");
			}
			cards.reverse();
            game.addCardKnower(cards, player);
            await game.cardsGotoPile(cards, "insert");
		},
		group: ["mjsweisishi_mark", "mjsweisishi_use", "mjsweisishi_discard"],
		subSkill: {
			tag: {
				name: "死士",
			},
			mark: {
				trigger: {
					player: "gainEnd",
					global: "loseAsyncEnd",
				},
				silent: true,
				lastDo: true,
				filter(event, player) {
					const cards = event.getg(player);
					if (!cards.length) {
						return false;
					}
					return cards.some(card => card.storage?.mjsweisishi);
				},
				async content(event, trigger, player) {
					var cards = trigger.getg(player);
					if (cards.length) {
						cards = cards.filter(card => card.storage.mjsweisishi);
						player.addGaintag(cards, "mjsweisishi_tag");
					}
				},
			},
			use: {
				trigger: {
					global: "useCard",
				},
				filter(event, player) {
					if (event.player == player) return false;
					return event.cards?.some(card => card.storage.mjsweisishi);
				},
				logTarget: "player",
				check(event, player) {
					return get.attitude(player, event.player) <= 0;
				},
				prompt2(event, player) {
					const cards = event.cards.filter(card => card.storage.mjsweisishi);
					return `你可以令${get.translation(event.player)}增加1层${get.poptip("mjs_debuff_liuxue_faq")}并销毁${get.translation(cards)}。`;
				},
				async content(event, trigger, player) {
					trigger.player.addSkill("mjs_debuff_liuxue");
					trigger.player.addMark("mjs_debuff_liuxue");
					// 牌使用过程中销毁会被无效
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					game.log(player, "取消了", trigger.card, "的所有目标");
					const cards = trigger.cards.filter(card => card.storage.mjsweisishi && lib.filter.cardDestuctible(card, trigger.player, "mjsweisishi_use"));
					if (cards.length) {
						game.log(player, "将", cards, "销毁");
						await game.cardsGotoSpecial(cards, "toDestroy");
					}
				},
			},
			discard: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter"],
				},
				popup: false,
				forced: true,
				locked: false,
				getIndex(event, player) {
					if (event.type != "discard" || event.getlx === false) {
						return [];
					}
					return game
						.filterPlayer(current => {
							const evt = event.getl(current);
							return evt?.cards2?.some(card => card.storage.mjsweisishi);
						})
						.sortBySeat();
				},
				logTarget(event, player, triggername, target) {
					return target;
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const cards = trigger.getl(target).cards2.filter(card => card.storage.mjsweisishi);
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
				},
			},
		},
	},
	//如姬
	/**窃符救赵
	 * 出牌阶段开始时，你可以查看一名其他角色的随机3张手牌(不足则全看)，并可以用你的手牌交换这些牌或将这些牌补至最多3张，然后根据这些牌的组合触发对应效果。
	 * 魏虎符:装备牌，装备上限+1；装备，每回合结束时将手牌补至上限。
	 * 组合规则:
	 * 花色相同、点数连续:添加“魏虎符”，并交给一名角色
	 * 花色相同:添加1张同花色的牌至手牌
	 * 点数连续:添加1张“夺粮劫营”至手牌
	 * 3张点数相同:摸3张牌
	 * 2张点数相同:摸2张牌
	 * 1.花色相同和点数效果的结算可以叠加。
	 * 2.只有3张花色相同才能触发对应奖励。
	 * 3.魏虎符可以有多张。
	 * 秦昭王已破赵长平军，又进兵围赵都。公子姊为赵惠文王弟平原君夫人，数遗魏王及公子书，请救于魏。魏王使将军晋鄙将十万众救赵。却又留军壁邺，名为救赵，实持两端以观望。夷门侯生向信陵君献计：“‘嬴闻晋鄙之兵符常在王卧内，而如姬最幸，出入王卧内，力能窃之。——《史记·魏公子列传》
	 * */
	mjsqiefujiuzhao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益", "摸牌"],
		derivation: "mjsqiefujiuzhao_faq",
		trigger: {
			player: "phaseUseBegin",
		},
		popup: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					let player = get.player();
					let att = get.attitude(player, target);
					if (att < 0) att *= -1.2;
					return att * Math.min(3, target.countCards("h"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const cards = target.getCards("h").randomGets(3),
				cards2 = player.getCards("h");
			const next = player.chooseToMove("窃符救赵");
			next.set("list", [
				[`${get.translation(target)}的牌`, cards],
				[`${get.translation(player)}的牌`, cards2],
			]);
			next.set("filterMove", function (from, to, moved) {
				if (to == 0) {
					return moved[0].length < 3;
				}
				return typeof to != "number";
			});
			next.set("processAI", function (list) {
				const player = get.event().player;
				let cards = list[0][1].slice(),
					hs = player.getCards("h");
				let cards2 = [...new Set([...list[0][1], ...list[1][1]])],
					hs2 = [];
				cards2.sort((a, b) => {
					return player.getUseValue(a) - player.getUseValue(b);
				});
				hs2 = cards2.splice(0, cards.length);
				return [hs2, cards2];
			});
			const result = await next.forResult();
			const pushs = result.moved[0],
				gains = result.moved[1];
			const cards3 = cards.removeArray(pushs),
				cards4 = cards2.removeArray(gains);
			if (cards3.length && cards4.length) {
				//名将交换手牌触发失去和获得的时机
				//await player.swapHandcards(target, cards4, cards3);
				await target.gain(cards4, player, "giveAuto", "bySelf");
				await player.gain(cards3, target, "giveAuto", "bySelf");
			} else if (cards4.length) {
				await player.give(cards4, target, "giveAuto");
			}
			const suits = pushs.reduce((list, card) => list.add(get.suit(card)), []);
			const nums = pushs.reduce((list, card) => list.add(get.number(card)), []).sort((a, b) => a - b);
			if (suits.length == 1) {
				if (nums.length == pushs.length && nums.length > 1) {
					if (nums[nums.length - 1] - nums[0] == nums.length - 1) {
						const card = game.createCard2("mjsweihufu", "diamond", 2);
						if (card) {
							await player.gain(card, "gain2");
							if (player.getCards("h").includes(card)) {
								const result = await player
									.chooseTarget(`你可以选择一名角色，将${get.translation(card)}交给他`, lib.filter.notMe)
									.set("ai", target => {
										const player = get.player();
										return get.attitude(player, target);
									})
									.forResult();
								if (result?.bool) {
									const target = result.targets[0];
									if (target != player) {
										await player.give(card, target, "giveAuto");
									}
								}
							}
						}
					}
				}
				const name = lib.inpile.randomGet();
				const card = game.createCard(name, suits[0], get.rand(1, 8));
				if (card) {
					await player.gain(card, "draw");
				}
			}
			if (nums.length == pushs.length && nums.length > 1) {
				if (nums[nums.length - 1] - nums[0] == nums.length - 1) {
					const card = game.createCard2("mjsduoliangjieying", "spade", 5);
					if (card) {
						await player.gain(card, "draw");
					}
				}
			}
			if (nums.length <= 2) {
				await player.draw(4 - nums.length);
			}
		},
	},
	/**衔环誓报
	 * 当有角色重伤时，若其曾对你造成过伤害，你可以令伤害来源增加1点体力上限，然后回复1点体力。
	 * 先增加上限，再回复体力值。
	 * 嬴闻如姬父为人所杀，如姬资之三年，自王以下欲求报其父仇，莫能得。如姬为公子泣，公子使客斩其仇头，敬进如姬。如姬之欲为公子死，无所辞，顾未有路耳。公子诚一开口请如姬，如姬必许诺，则得虎符夺晋鄙军，北救赵而西却秦，此五霸之伐也。——《史记·魏公子列传》
	 * */
	mjsxianhuanshibao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			global: "dying",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (get.itemtype(event.source) != "player") {
				return false;
			}
			return event.player.hasAllHistory("sourceDamage", evt => evt.player == player);
		},
		logTarget: "source",
		check(event, player) {
			return get.attitude(player, event.source) > 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.gainMaxHp();
			await target.recover();
		},
		ai: {
			threaten: 0.5,
		},
	},
	//郑袖
	/**掩袖工谗
	 * 当其他角色打出或每弃置1张获得过的你的牌时，你可以立即对其打出牌堆中的第1张杀，若此杀造成伤害，你摸2张牌。
	 * 当其他角色打出或弃置获得过的你的牌时，你可以立即对其打出牌堆中的第1张杀，若此杀造成伤害，你摸2张牌。
	 * 1.“你的牌”是指进入过你手牌区、装备区的牌。
	 * 2.若牌堆中无“杀”，则不触发后续效果。
	 * 荆王所爱妾有郑袖者。荆王新得美女，郑袖因教之曰:“王甚喜人之掩口也，为近王，必掩口。”美女入见，近王，因掩口，王问其故，郑袖曰:“此固言恶王之臭。”及王与郑袖、美女三人坐，袖因先诫御者曰:“王适有言，必听从。”王言美女前，近王，甚数掩口，王悖然怒曰:“劓之。”御因揄刀而劓美人。——《韩非子·内储说下》
	 * */
	mjsyanxiugongchan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["输出", "摸牌"],
		trigger: {
			global: ["useCardAfter", "respondAfter", "loseAfter", "loseAsyncAfter"],
		},
		silent: true,
		popup: true,
		forced: false,
		getCards(player) {
			const cards = player._start_cards ?? [];
			const cards2 = player.getAllHistory("gain").reduce((list, evt) => list.addArray(evt.cards), []);
			if (cards2.length) {
				cards.addArray(cards2);
			}
			return cards;
		},
		getIndex(event, player) {
			if (["useCard", "respond"].includes(event.name)) {
				if (event.cards.some(card => lib.skill.mjsyanxiugongchan.getCards(player).includes(card))) {
					return [event.player];
				}
			} else {
				if (event.type != "discard" || event.getlx === false) {
					return false;
				}
				const targets = game.filterPlayer(target => {
					const evt = event.getl(target);
					return (
						evt &&
						evt.cards2 &&
						evt.cards2.some(card => lib.skill.mjsyanxiugongchan.getCards(player).includes(card))
					);
				});
				return targets.reduce((list, target) => {
					const num = event.getl(target).cards2.filter(card => lib.skill.mjsyanxiugongchan.getCards(player).includes(card)).length;
					if (num > 0) {
						const list2 = Array(num).fill(target);
						list.push(...list2);
					}
					return list;
				}, []);
			}
		},
		filter(event, player, name, target) {
			if (target == player) {
				return false;
			}
			const card = get.autoViewAs({ name: "sha" }, "unsure");
			return player.canUse(card, target, false, false);
		},
		logTarget: (event, player, triggername, target) => target,
		check(event, player, triggername, target) {
			const card = get.autoViewAs({ name: "sha" }, "unsure");
			return get.effect(target, card, player, player) > 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const card = get.cardPile2("sha");
			if (card) {
				const next = player.useCard(card, target, false);
				next._mjsyanxiugongchan = true;
				await next;
				if (player.hasHistory("sourceDamage", function (evt) {
					var card = evt.card;
					if (!card || card.name != "sha") {
						return false;
					}
					var evtx = evt.getParent("useCard");
					return evtx.card == card && evtx.getParent() == event;
				})) {
					await player.draw(2);
				}
			}
		},
		init(player) {
			game.addGlobalSkill("mjsyanxiugongchan_ai");
		},
		onremove(player) {
			if (!game.hasPlayer((current) => current.hasSkill("mjsyanxiugongchan", null, null, false), true)) {
	        	game.removeGlobalSkill("mjsyanxiugongchan_ai");
	      	}
		},
		ai: {
			expose: 0.3,
		},
		group: "mjsyanxiugongchan_mark",
		subSkill: {
			ai: {
				trigger: {
	                player: "dieAfter",
	            },
	            filter: (event, player) => {
	              return !game.hasPlayer((current) => current.hasSkill("mjsyanxiugongchan", null, null, false), true);
	            },
	            silent: true,
	            forceDie: true,
	            charlotte: true,
	            content: () => {
	              	game.removeGlobalSkill("mjsyanxiugongchan_ai");
	            },
	            ai: {
	            	noShan: true,
	            	skillTagFilter(player, tag, arg) {
	            		const evt = _status.event.getParent("useCard");
	            		if (!evt) {
	            			return false;
	            		}
						if ((() => {
							if (!evt._mjsyanxiugongchan) {
								return true;
							}
							if (!evt.player.isFriendOf(player)) {
								return true;
							}
							if (evt.baseDamage + evt.extraDamage > 1) {
								return true;
							}
							return false;
						})()) {
							return false;
						}
						return true;
					},
	            },
			},
			tag: {
				name: "谗",
			},
			mark: {
				trigger: {
					player: "gainAfter",
					global: ["gameDrawAfter", "loseAsyncAfter"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (!player.countCards("he")) return false;
					if (event.name == "gameDraw") return true;
					return event?.getg?.(player)?.length > 0;
				},
				async content(event, trigger, player) {
					//仅显示，实际无名杀技能结算用的记录
					let cards = player.getCards("h");
					player.addGaintag(cards, "eternal_mjsyanxiugongchan_tag");
				},
			},
		},
	},
	/**因妒劝释
	 * 出牌阶段限1次，你可以交给一名其他角色至少1张牌，然后令一名角色回复1点体力。
	 * */
	mjsyinduquanshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["治疗"],
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		selectCard: [1, Infinity],
		allowChooseAll: true,
		check(card) {
			if (ui.selected.cards.length > 1) {
				return 0;
			}
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name == "du") {
				return 20;
			}
			const player = get.owner(card);
			if (player.hp == player.maxHp || player.countCards("h") <= 1) {
				if (ui.selected.cards.length) {
					return -1;
				}
				const players = game.filterPlayer();
				for (let i = 0; i < players.length; i++) {
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
		filterTarget: lib.filter.notMe,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const [target] = event.targets;
			await player.give(event.cards, target);
			if (!game.hasPlayer(target => target.isDamaged())) {
				return;
			}
			const result = await player
				.chooseTarget("请选择一名角色回复1点体力", true)
				.set("ai", target => {
					const player = get.player();
					return get.recoverEffect(target, player, player);
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				await target.recover();
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						return target.hasSkillTag("nodu") ? 0 : -10;
					}
					return get.attitude(player, target);
				},
			},
		},
	},
	//宋玉
	/**曲高和寡
	 * 当你以其他角色为目标打出牌后，若此牌没有被其他角色抵消或响应，则你可以选择任意名其他角色，令其依次随机弃置1张牌。
	 * 抵消或响应:无懈、杀、闪、等。
	 * 客有歌于郢中者，其始曰下里巴人，国中属而和者数千人，其为阳陵采薇，国中属而和者数百人;其为阳春自雪，国中属而和者，数十人而已也;引商刻角，杂以流徵，国中属而和者，不过数人。是其曲弥高者，其和弥寡。——《新序·杂事一》
	 * */
	mjsqugaohegua: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制"],
		mod: {
			aiOrder(player, card, num) {
				if (get.type(card) === "delay") {
					return num + 10;
				}
			},
		},
		trigger: {
			player: "useCardAfter",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			if (!event.targets?.length || event.targets.includes(player)) {
				return false;
			}
			return event.targets.every(target => {
				if (target == player) {
					return true;
				}
				if (game.hasGlobalHistory("everything", evt => {
					if (evt._neutralized || evt.responded && (!evt.result || !evt.result.bool)) {
						return evt.getParent() == event;
					}
				})) {
					return false;
				}
				return !["useCard", "respond"].some(evtx => {
					return target.hasHistory(evtx, evt => {
						return evt.respondTo && evt.respondTo[1] == event.card;
					});
				});
			});
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(target => {
				return target != player && target.countCards("he");
			});
			if (!targets.length) {
				return;
			}
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, Infinity], (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set("targets", targets)
				.set("ai", target => {
					const player = get.player();
					var att = get.attitude(player, target),
						eff = 0;
					target.getCards("he", function (card) {
						var val = get.value(card, target);
						eff = Math.max(eff, -val * att);
					});
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, event.targets);
			const func = async target => {
				const cards = target.getCards("he", card => {
					return lib.filter.cardDiscardable(card, player, "mjsqugaohegua");
				});
				if (cards.length > 0) {
					await target.discard(cards.randomGets(1)).set("discarder", player);
				}
			};
			await game.doAsyncInOrder(event.targets, func);
		},
	},
	/**九辩
	 * 所有角色每累计弃置9张牌，你可以令一名角色随机增强2张牌。
	 * 随机增强可以是装备区的牌。
	 * 处浊世而显荣兮，非余心之所乐;与其无义而有名兮，宁处穷而守高。——《九辩》
	 * */
	mjsjiubian: {
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: "mjsjiubianEvent",
		},
		silent: true,
		popup: false,
		forced: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.countCards("he");
				})
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					const cards = target.getCards("he", card => {
						return lib.filter.canBeStrengthened(card, target, "mjsjiubian");
					});
					const num = Math.min(2, cards.length);
					return att * num;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const cards = target
				.getCards("he", card => {
					return lib.filter.canBeStrengthened(card, target, "mjsjiubian");
				})
				.randomGets(2);
			if (cards.length) {
				await target.mjsStrengthenCards(cards, player);
			}
		},
		marktext: "辩",
		intro: {
			markcount(storage, player) {
				return player.countMark("mjsjiubian_counter");
			},
			content(storage, player) {
				return `所有角色已累计弃置${get.cnNumber(player.countMark("mjsjiubian_counter"))}张牌`;
			},
		},
		group: "mjsjiubian_counter",
		subSkill: {
			counter: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return event.type == "discard";
				},
				getIndex(event, player) {
					if (event.type != "discard") {
						return false;
					}
					return game
						.filterPlayer(target => {
							const evt = event.getl(target);
							return evt?.cards2?.length > 0;
						})
						.sortBySeat();
				},
				logTarget(event, player, name, target) {
					return target;
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const num = trigger.getl(target).cards2.length;
					player.addMark("mjsjiubian_counter", num, false);
					while (player.countMark(event.name) >= 9) {
						player.removeMark(event.name, 9, false);
						const next = game.createEvent("mjsjiubianEvent", false);
						next.player = player;
						next.setContent("emptyEvent");
						await next;
					}
					player.markSkill("mjsjiubian");
				},
			},
		},
	},
	//春申君
	/**移花接木
	 * 每个回合限1次，其他角色主动打出战法牌时，你可以将其转化为任意战法牌（每种战法牌每轮限1次），并由该角色继续执行转化后牌的效果，然后你获得1张转化后牌的复制。
	 * 1.可以转化为同名战法牌，例如:“多多益善”转化为“多多益善”。
	 * 2.转化的战法牌如果需要选择目标，仍然由打出此牌的角色选择。
	 * 3.主动打出战法牌指的是除了响应其他情况而打出的战法牌，比如识破，草船借箭等。
	 * 春申君大然之，乃出李园女弟，谨舍而言之楚王。楚王召入幸之，遂生子男，立为太子，以李园女弟为王后。——《史记·春申君列传》
	 * */
	mjsyihuajiemu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制", "增益"],
		trigger: {
			global: "useCard",
		},
		usable: 1,
		filter(event, player) {
			return event.player != player && get.type2(event.card) == "trick" && event.targets?.length;
		},
		async cost(event, trigger, player) {
			const list = get.inpileVCardList(info => {
				const name = info[2], nature = info[3];
				if (get.type2(name) != "trick") return false;
				return !player.hasStorage("mjsyihuajiemu_used", name);
			});
			if (!list.length) return;
			event.result = await player
				.chooseButton(["移花接木", [list, "vcard"]])
				.set("ai", button => {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					const card = get.autoViewAs({ name: button.link[2] }, trigger.cards);
					if (button.link[2] == trigger.card.name) {
						return 0;
					}
					const eff1 = trigger.targets.reduce((sum, target) => {
						if (button.link[2] === "taoyuan" && target.isHealthy()) {
							return sum;
						}
						sum += get.effect(target, card, trigger.player, player);
						return sum;
					}, 0);
					const eff2 = trigger.targets.reduce((sum, target) => {
						sum += get.effect(target, trigger.card, trigger.player, player);
						return sum;
					}, 0);
					if (eff2 > 0) return 0;
					return eff1 - eff2;
				})
				.forResult();
			if (event.result?.bool && event.result?.links?.length) {
				event.result.cost_data = event.result.links[0][2];
			}
		},
		async content(event, trigger, player) {
			const name = event.cost_data;
			player.addTempSkill("mjsyihuajiemu_used", "roundStart");
			player.markAuto("mjsyihuajiemu_used", [name]);
			const cards = trigger.cards.filterInD();
			for (const card of cards) {
				game.broadcastAll(
					function (card) {
						card.init([card.suit, card.number, name]);
					},
					card,
					name
				);
			}
			const card = get.autoViewAs({ ...trigger.card, name }, cards);
			trigger.cards = cards.slice();
			trigger.card.cards = cards.slice();
			game.log(player, "将", trigger.card, "的效果转化为", card);
			const targets = game.filterPlayer(target => {
				return lib.filter.targetEnabled(card, trigger.player, target) && lib.filter.targetInRange(card, trigger.player, target);
			});
			trigger.card.name = name;
			//player.addTempSkill("mjsyihuajiemu_effect");
			//player.markAuto("mjsyihuajiemu_effect", [[trigger.card, name]]);
			if (!targets.length) {
				//无懈可击到这就停，也不会获得复制牌
				trigger.targets.length = 0;
				trigger.all_excluded = true;
				return;
			} else if (!get.info(card).notarget) {
				const range = lib.filter.selectTarget(card, trigger.player);
				if (range[1] <= -1) {
					event.result = { bool: true, targets };
				} else {
					event.result = await player
						.chooseTarget(`重新选择${get.translation(card)}的目标`)
						.set("filterTarget", (card, player, target) => {
							return get.event().targets.includes(target);
						})
						.set("_get_card", card)
						.set("selectTarget", lib.filter.selectTarget)
						.set("targets", targets)
						.set("ai", target => {
							return get.effect(target, get.event().getTrigger().card, get.event().getTrigger().player, get.player());
						})
						.forResult();
				}
			}
			trigger.targets.length = 0;
			if (event.result?.bool && event.result.targets?.length) {
				trigger.targets.addArray(event.result.targets);
			}
			player
				.when({ global: "useCardAfter" })
				.filter(evt => evt == trigger)
				.then(async (event, trigger, player) => {
					const card = mjs.createCard(trigger.card.name);
					if (card) {
						player.gain(card, "draw");
					}
				});
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			effect: {
				trigger: {
					global: "useCardToBegin",
				},
				forced: true,
	            popup: false,
	            firstDo: true,
	            charlotte: true,
	            onremove: true,
				filter(event, player) {
					const storage = player.getStorage("mjsyihuajiemu_effect");
					return storage.some(list => list[0] == event.card);
				},
				async content(event, trigger, player) {
					const list = player.getStorage("mjsyihuajiemu_effect").find(list => list[0] == trigger.card);
					trigger.setContent(lib.card[list[1]].content);
				},
			},
		},
	},
	/**无妄之灾
	 * 目标包含你的战法牌生效2次。
	 * 1.多目标的战法牌也将被包含在内，如:烽火狼烟会执行2次。
	 * 2.以自己为目标的战法牌，也将触发技能效果。
	 * 春申君曰：“何谓无妄之祸？”曰：“李园不治国，王之舅也。不为兵将，而阴养死士之日久矣。楚王崩，李园必先入，据本议制断君命，秉权而杀君以灭口。此所谓无妄之祸也。”——《战国策·楚策四》
	 * */
	mjswuwangzhizai: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		init: () => game.addGlobalSkill("mjswuwangzhizai_ai"),
		trigger: {
			global: "useCardToPlayered",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return get.type(event.card) == "trick" && event.targets?.includes(player) && event.getParent().triggeredTargets3.length == event.targets.length;
		},
		async content(event, trigger, player) {
			trigger.getParent().effectCount++;
		},
		subSkill: {
			ai: {
				trigger: {
					player: "dieAfter",
				},
				silent: true,
				forceDie: true,
				filter(event, player) {
					return !game.hasPlayer(i => i.hasSkill("mjswuwangzhizai"), true);
				},
				async content(event, trigger, player) {
					game.removeGlobalSkill("mjswuwangzhizai_ai");
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (!target || !target.hasSkill("mjswuwangzhizai")) {
								return;
							}
							return [2, 0, 2, 0];
						},
					},
				},
			},
		},
	},
	//田单
	/**火牛阵
	 * 你可以消耗1次出杀次数，随机添加1张装备牌至手牌。回合结束时，你可以将所有装备牌当作火杀对一名其他角色打出并消耗所有装备上限，每因此造成1点伤害，你的装备上限+1。
	 * 1.包括手牌中的装备牌。
	 * 2.装备上限可以>3。
	 * 田单乃收城中得千余牛，为绛缯衣，画以五彩龙文，束兵刃于其角，而灌脂束苇于尾，烧其端。凿城数十穴，夜纵牛，壮士五千人随其后。牛尾热，怒而奔燕军，燕军夜大惊。牛尾炬火光明炫耀，燕军视之皆龙文，所触尽死伤。——《史记·田单列传》
	 * */
	mjshuoniuzhen: {
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjshuoniuzhen" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		nobracket: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.getCardUsable("sha") > 0;

			const num = player.getCardUsable("sha", true);
			if (num <= 0) {
				return false;
			}
			const evt = get.event().getParent("phaseUse", true, true);
			if (evt) {
				return (
					num >
					player.getHistory("useCard", evtx => {
						return evtx.getParent("phaseUse") == evt && evtx.card.name == "sha" && evtx.addCount !== false;
					}).length
				);
			}
			return true;
		},
		log: false,
		delay: false,
		async content(event, trigger, player) {
			player.logSkill("mjshuoniuzhen", null, null, null, [get.rand(1, 2)]);
			player.addTempSkill("mjshuoniuzhen_sha", "phaseUseAfter");
			player.addMark("mjshuoniuzhen_sha", 1, false);
			const equip = mjs.getEquip("random");
			const card = mjs.createCard(equip);
			if (card) {
				await player.gain(card, "draw");
			}
		},
		ai: {
			order() {
				const player = get.player();
				return get.order({ name: "sha" }) + 0.1;
			},
			result: {
				player(player) {
					if (!player.hasSha()) {
						return 1;
					}
					return 0;
				},
			},
		},
		group: "mjshuoniuzhen_use",
		subSkill: {
			use: {
				trigger: {
					player: "phaseEnd",
				},
				popup: false,
				filter(event, player) {
					const cards = player.getCards("he", { type: "equip" });
					return cards.some(card => {
						const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
						if (mod2 === false) return false;
						const sha = get.autoViewAs({ name: "sha", nature: "fire" }, [card]);
						return player.hasUseTarget(sha, false, false);
					});
				},
				async cost(event, trigger, player) {
					const cards = player.getCards("he", { type: "equip" });
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "你可以将所有装备牌当作火杀对一名其他角色打出并消耗所有装备上限", function (card, player, target) {
							if (player == target) {
								return false;
							}
							return player.canUse({ name: "sha", nature: "fire" }, target, false, false);
						})
						.set("check", cards.length >= 2)
						.set("ai", function (target) {
							if (!_status.event.check) {
								return 0;
							}
							return get.effect(target, { name: "sha", nature: "fire" }, _status.event.player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill("mjshuoniuzhen", target, null, null, [get.rand(3, 4)]);
					while (true) {
						const cards = player.getCards("he", card => {
							if (get.type(card) != "equip") {
								return false;
							}
							const sha = get.autoViewAs({ name: "sha", nature: "fire" }, [card]);
							return player.canUse(sha, target, false, false);
						});
						if (!cards.length) return;
						const card = cards.randomGet();
						const sha = get.autoViewAs({ name: "sha", nature: "fire" }, [card]);
						if (player.canUse(sha, target, false, false)) {
							await player.useCard(sha, [card], target, false);
						}
					}
					//实际效果是把每一张装备牌当杀打出
					//装备上限减少后弃置牌 => 打出完成后再消耗全部装备上限
					const num = player.mjsGetEquipLimit();
					if (num > 0) {
						await player.mjsContractEquip(num);
					}
					const sum = player
						.getHistory("sourceDamage", evt => {
							return evt.card && evt.getParent(event.name) == event;
						})
						.reduce((sum, evt) => sum + evt.num, 0);
					if (sum > 0) {
						await player.mjsExpandEquip(sum);
					}
				},
			},
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num - player.countMark("mjshuoniuzhen_sha");
						}
					},
				},
			},
		},
	},
	/**解裘救人
	 * 其他角色重伤时，你可以交给其1张装备牌，并令其装备，然后其回复1点体力，若其因此脱离重伤状态，你的装备上限+1，并摸牌至装备上限。
	 * 装备牌会先进入手牌区，再进入装备区。
	 * 过灾水，有老人涉灾而寒，出不能行，坐于沙中。田单见其寒，欲使后车分衣，无可以分者，单解裘而衣之。——《战国策·齐策六》
	 * */
	mjsjieqiujiuren: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return (_status.connectMode && player.countCards("he")) || player.countCards("he", { type: "equip" });
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill, trigger.player), "he")
				.set("filterCard", card => get.type(card) == "equip")
				.set("ai", card => {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					if (get.attitude(player, trigger.player) <= 0) {
						return 0;
					}
					return 8 - get.value(card);
				})
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.give(event.cards, target, "give");
			await game.delay();
			const card = event.cards[0];
			if (target.getCards("h").includes(card) && get.type(card) == "equip") {
				await target.chooseUseTarget(card, true);
			}
			const next = target.recover();
			target
				.when("recoverAfter")
				.filter(evt => evt == next)
				.then(async (event, trigger, player) => {
					const evt = trigger.getParent("dying");
					if (evt) {
						evt._mjsjieqiujiuren_saved = player.hp > 0;
					}
				});
			await next;
			if (trigger._mjsjieqiujiuren_saved) {
				await player.mjsExpandEquip();
				const num = player.mjsGetEquipLimit();
				if (num > 0) {
					await player.drawTo(num);
				}
			}
		},
		ai: {
			expose: 0.5,
			threaten: 1.5,
		},
	},
	//孟尝君
	/**焚券市义
	 * 回合开始时，你可以收回其他角色获得过的你的牌，或者令这些角色在你受到伤害后交给你1张牌，直到你的下个回合开始。
	 * 1.可以回收的牌包括手牌、装备区的牌。
	 * 2.目标角色受到伤害后交给你的牌，可以是“你给出的牌”。
	 * 驱而之薛，使吏召诸民当偿者，悉来合券。券遍合，起矫命以责赐诸民，因烧其券，民称万岁。——《战国策·齐策四》
	 * */
	mjsfenquanshiyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsfenquanshiyi" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		skill_tag: ["防御", "控制"],
		trigger: {
			player: "phaseBegin",
		},
		popup: false,
		filter(event, player) {
			return get.info("mjsfenquanshiyi").getTargets(player).length;
		},
		async cost(event, trigger, player) {
			const list = [];
			const targets = get.info(event.skill).getTargets(player);
			const num = targets.reduce((sum, target) => {
				sum += target.countCards("he", card => {
					if ((player._start_cards ?? []).includes(card)) {
						return true;
					}
					return player.hasAllHistory("lose", evt => {
						let evtx = evt.getParent();
						if (!evtx.getg) {
							return false;
						}
						var cards = evtx.getg(target);
						if (!cards.length || !cards.includes(card)) {
							return false;
						}
						var cards2 = evt.cards2;
						return cards2.includes(card) && cards.containsSome(...cards2);
					});
				});
				return sum;
			}, 0);
			if (num > 0) list.push("回收");
			if (targets.length) list.push("给牌");
			if (!list.length) return;
			event.result = await player
				.chooseControl(list, "cancel2")
				.set("prompt", `###${get.prompt(event.skill)}###可回收${num}张牌`)
				.set("ai", () => {
					let controls = get.event().controls.slice();
					if (controls.includes("回收") && get.event().num > 3) {
						return "回收";
					}
					return controls[get.rand(0, controls.length - 1)];
				})
				.set("num", num)
				.forResult();
			if (event.result?.control != "cancel2") {
				event.result.cost_data = event.result.control;
			}
		},
		async content(event, trigger, player) {
			if (event.cost_data == "回收") {
				player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
				const cardList = [];
				const lose_list = [],
					players = game.filterPlayer(target => target != player);
				players.forEach(target => {
					const cards = target.getCards("he", card => {
						if ((player._start_cards ?? []).includes(card)) {
							return true;
						}
						return player.hasAllHistory("lose", evt => {
							let evtx = evt.getParent();
							if (!evtx.getg) {
								return false;
							}
							var cards = evtx.getg(target);
							if (!cards.length || !cards.includes(card)) {
								return false;
							}
							var cards2 = evt.cards2;
							return cards2.includes(card) && cards.containsSome(...cards2);
						});
					});
					if (cards.length > 0) {
						target.$throw(cards);
						lose_list.push([target, cards]);
						cardList.addArray(cards);
					}
				});
				if (lose_list.length) {
					await game.loseAsync({ lose_list }).setContent("chooseToCompareLose");
					await game.delayx();
				}
				if (cardList.length) {
					await player.gain(cardList);
				}
			} else {
				player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
				player.addTempSkill(event.name + "_effect", { player: "phaseBegin" });
			}
		},
		getTargets(player) {
			return game.filterPlayer(current => {
				if (current == player) {
					return false;
				}
				return player.hasAllHistory("lose", evt => {
					let evtx = evt.getParent();
					if (!evtx.getg) {
						return false;
					}
					var cards = evtx.getg(current);
					if (!cards.length) {
						return false;
					}
					var cards2 = evt.cards2;
					return cards.containsSome(...cards2);
				});
			});
		},
		subSkill: {
			effect: {
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				charlotte: true,
				filter(event, player) {
					return get
						.info("mjsfenquanshiyi")
						.getTargets(player)
						.some(target => target.countCards("he"));
				},
				logTarget(event, player) {
					return get
						.info("mjsfenquanshiyi")
						.getTargets(player)
						.filter(target => target.countCards("he"));
				},
				async content(event, trigger, player) {
					for (const target of event.targets) {
						if (target.countCards("he")) {
							await target.chooseToGive(player, "he", true);
						}
					}
				},
			},
		},
	},
	/**狡兔三窟
	 * 出牌阶段限3次，你可以交给一名其他角色1张牌，当其手牌中有因此获得的牌时，你可以令其代替你成为杀或战法牌的目标，然后随机增强其中1张牌。
	 * 1.装备区的牌也可以交给出去。
	 * 2.该技能是“每回合限3次”。
	 * 3.“增强的牌”指的是，你交给出去的“1张手牌或装备牌”。
	 * 狡兔有三窟，仅得其免死身，今君在一窟，未得高枕而卧也，请为君复凿二窟。——《战国策·齐策四》
	 * */
	mjsjiaotusanku: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsjiaotusanku" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		skill_tag: ["防御", "增益"],
		enable: "phaseUse",
		usable: 3,
		filterTarget: lib.filter.notMe,
		filterCard: true,
		position: "he",
		lose: false,
		discard: false,
		delay: false,
		log: false,
		async content(event, trigger, player) {
			const [target] = event.targets;
			player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
			await player.give(event.cards, target, "giveAuto");
			const tag = `${event.name}_${player.playerid}`;
			if (!lib.skill[tag]) {
				game.broadcastAll(
					(tag, str) => {
						lib.skill[tag] = {};
						lib.translate[tag] = "狡兔+" + str;
					},
					tag,
					get.translation(player)
				);
			}
			target.addGaintag(event.cards, tag);
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					return 1;
				},
			},
		},
		group: "mjsjiaotusanku_effect",
		subSkill: {
			effect: {
				audio: "mjsjiaotusanku",
				trigger: {
					target: "useCardToTarget",
				},
				popup: false,
				filter(event, player) {
					return event.card.name == "sha" || get.type(event.card) == "trick";
				},
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(target => {
						if (!target.countCards("h", card => card.hasGaintag(`mjsjiaotusanku_${player.playerid}`))) return false;
						return lib.filter.targetEnabled(trigger.card, trigger.player, target);
					});
					if (!targets?.length) return;
					event.result = await player
						.chooseTarget(get.prompt(event.skill), `你可以选择一名角色代替你成为${get.translation(trigger.card)}的目标`)
						.set("filterTarget", (card, player, target) => {
							return get.event().targets.includes(target);
						})
						.set("targets", targets)
						.set("ai", target => {
							const player = get.player();
							const trigger = _status.event.getTrigger();
							return get.effect(target, trigger.card, trigger.player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
					trigger.player.line(target);
					const evt = trigger.getParent();
					evt.triggeredTargets2.remove(player);
					evt.targets.remove(player);
					evt.targets.push(target);
					const cards = target
						.getCards("h", card => {
							if (!lib.filter.canBeStrengthened(card, target, "mjsjiaotusanku_effect")) return false;
							return card.hasGaintag(`mjsjiaotusanku_${player.playerid}`);
						})
						.randomGets(1);
					if (cards.length) {
						await target.mjsStrengthenCards(cards, player);
					}
				},
			},
		},
	},
	/**鸡鸣狗盗
	 * 出牌阶段限1次，你可以选择一名其他角色，其可以将任意1张手牌：当作先拔头筹打出，并且你可以选择其中1张牌获得；或当作顺手牵羊打出，并且将获得的牌交给你。
	 * 1.技能效果中的“先拔头筹”的分配顺序会变为: “目标”先选1张，然后是你，最后是其余人
	 * 2.技能效果中的“顺手牵羊”得到的牌会先进入目标的手牌区，再交给你
	 * 最下坐有能为狗盗者，曰：“臣能得狐白裘。”乃夜为狗，以入秦宫臧中，取所献狐白裘至，以献秦王幸姬……孟尝君至关，关法鸡鸣而出客。孟尝君恐追至，客之居下坐者有能为鸡鸣，而鸡齐鸣，遂发传出。——《史记·孟尝君列传》
	 * */
	mjsjiminggoudao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["增益"],
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const list = get.inpileVCardList(info => {
				if (!["mjsxianbatouchou", "shunshou"].includes(info[2])) {
					return false;
				}
				return target.hasUseTarget(get.autoViewAs({ name: info[2] }, "unsure"), true, false);
			});
			if (!list.length) {
				return;
			}
			if (list.length == 1) {
				event.result = {
					bool: true,
					links: list,
				};
			} else {
				event.result = await target
					.chooseButton([`###鸡鸣狗盗###`, [list, "vcard"]])
					.set("ai", button => {
						return get.player().getUseValue({ name: button.link[2] });
					})
					.forResult();
			}
			if (event?.result?.links?.length) {
				game.log(event.result.links[0][2])
				game.broadcastAll(
					function (event, name) {
						lib.skill[`${event.name}_backup`].viewAs = {
							name: name,
						};
					},
					event,
					event.result.links[0][2]
				);
				const result = await target
					.chooseToUse()
					.set("openskilldialog", `###${get.prompt(event.name)}###你可以将一张手牌当作${get.translation(event.result.links[0][2])}使用`)
					.set("norestore", true)
					.set("_backupevent", `${event.name}_backup`)
					.set("custom", {
						add: {},
						replace: { window: function () { } },
					})
					.set("source", player)
					.backup(`${event.name}_backup`)
					.forResult();
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					return 1;
				},
			},
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "hs",
				ai1(card) {
					return 7 - get.value(card);
				},
				log: false,
				async precontent(event, trigger, player) {
					const source = event.getParent().source;
					if (event.result.card.name == "mjsxianbatouchou") {
						player
							.when("useCard2")
							.filter(evt => evt.skill == "mjsjiminggoudao_backup")
							.then(async (event2, trigger2, player2) => {
								trigger2.targets.add(source);
							});
					} else {
						player
							.when("gainAfter")
							.filter(evt => {
								return evt.getParent(2).name == "shunshou" && evt.getParent(2)?.skill == "mjsjiminggoudao_backup";
							})
							.then(async (event2, trigger2, player2) => {
								if (!source?.isIn() || player2 == source) {
									return;
								}
								const cards = trigger2.getg(player2);
								if (cards.length) {
									await player2.give(cards, source, "giveAuto");
								}
							});
					}
				},
			},
		},
	},
	//张仪
	/**连横
	 * 出牌阶段限1次，将你的势力变为一名其他角色的势力，或者令一名其他角色的势力变为你的势力，然后若你的势力角色数量全场最多，所有同势力的角色手牌上限+1，体力上限+1。
	 * 1.当你的目标拥有多个势力时，会变为其主势力。
	 * 2.全场最多，可以是“最多之一”。
	 * 纵者，合众弱以攻一强也；横者，事一强以攻众弱也。——《韩非子》
	 * */
	mjslianheng: {
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!get.info("mjsyitongliuhe").groupFiter(player)) {
				return false;
			}
			return true;
		},
		async precontent(event, trigger, player) {
			const skillName = event.name.slice("pre_".length);
			const list = [];
			if (game.hasPlayer(target => {
				if (!get.info("mjsyitongliuhe").groupFiter(target)) {
					return false;
				}
				return true;
			})) {
				list.push("改变他人势力");
			}
			if (get.info("mjsyitongliuhe").groupFiter(player)) {
				list.push("改变自身势力");
			}
			if (!list.length) return;
			const { control } = await player.chooseControl(list, "cancel2").set("prompt", get.prompt(skillName)).forResult();
			if (control != "cancel2") {
				const prompt2 = control == "改变他人势力" ? "令一名其他角色的势力变为你的势力" : "将你的势力变为一名其他角色的势力";
				const result = await player
					.chooseTarget(get.prompt(skillName), prompt2)
					.set("filterTarget", (card, player, target) => {
						return target != player;
					})
					.set("ai", target => {
						const player = get.player();
						if (game.hasPlayer(current => {
							if (current == target) return false;
							if (!get.info("mjsyitongliuhe").groupFiter(target)) {
								return false;
							}
							return current.group == target.group && get.attitude(player, current) <= 0;
						})) {
							return 0;
						}
						return get.attitude(player, target);
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					event.result.targets = result.targets;
					event.getParent().cost_data = control;
					return;
				}
			}
			player.addTempSkill("mjslianheng_aiCheck", {
				player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
			});
			event.getParent().goto(0);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const control = event.getParent(2).cost_data;
			if (control == "改变他人势力") {
				const next = target.changeGroup(player.group);
				next.source = player;
				await next;
			} else {
				await player.changeGroup(target.group);
			}
			const list = game.filterPlayer().reduce((sum, target) => sum.add(target.group), []);
			list.remove("g_noname");
			if (list.every(group => {
				if (group == player.group) return true;
				return game.countPlayer(target => target.group == player.group) >= game.countPlayer(target => target.group == group);
			})) {
				const targets = game.filterPlayer(current => {
					/*if (!get.info("mjsyitongliuhe").groupFiter(current)) {
						return false;
					}*/
					return current.group == player.group;
				});
				const func = async target => {
					lib.skill.mjsallmax.change(player, 1);
					await target.gainMaxHp();
				};
				await game.doAsyncInOrder(targets, func);
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (player.hasSkill("mjslianheng_aiCheck")) return 0;
					return game.hasPlayer(current => {
						return get.attitude(player, current) > 0;
					});
				},
			},
		},
		subSkill: {
			aiCheck: {
				charlotte: true,
				ai: {
	            	skill_aiCheck: true,
	            },
			},
		},
	},
	/**众口铄金
	 * 与你势力相同的所有角色，每累计打出3张相同名称的牌时，你可以选择销毁一名其他角色任意区域的1张牌。
	 * 销毁牌可以是“卜卦牌”。
	 * 臣闻之，积羽沉舟，群轻折轴，众口铄金，积毁销骨，故愿大王审定计议，且赐骸骨辟魏。——《史记·张仪列传》
	 * */
	mjszhongkoushuojin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制"],
		global: "mjszhongkoushuojin_global",
		trigger: {
			global: ["useCard", "respond"],
		},
		popup: false,
		filter(event, player) {
			if (!get.info("mjsyitongliuhe").groupFiter(event.player)) {
				return false;
			}
			if (event.player.group != player.group) return false;
			return (
				event._mjszhongkoushuojin &&
				game.hasPlayer(target => {
					return target != player && target.countCards("hej");
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countCards("hej", cardx => lib.filter.cardDestuctible(cardx, target, "mjszhongkoushuojin"));
				})
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			if (!target.countCards("hej", card => lib.filter.cardDestuctible(card, target, "mjszhongkoushuojin"))) return;
			const result = await player
				.choosePlayerCard(target, "hej", true)
				.set("filterButton", button => {
					return lib.filter.cardDestuctible(button.link, get.owner(button.link), "mjszhongkoushuojin");
				})
				.set("prompt", get.translation(event.name))
				.set("prompt2", `选择销毁${get.translation(target)}区域内的1张牌`)
				.set("ai", button => {
					return get.value(button.link);
				})
				.forResult();
			if (result?.bool) {
				const cards = result.cards;
				game.log(cards, "被销毁了");
				await target.lose(cards, "toDestroy", ui.special);
			}
		},
		subSkill: {
			global: {
				trigger: {
					player: ["useCard1", "respond"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (!get.info("mjsyitongliuhe").groupFiter(player)) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					if (!player.storage[event.name]) player.storage[event.name] = [];
					player.storage[event.name].push(trigger.card.name);
					const num = game
						.filterPlayer(target => target.group == player.group)
						.reduce((sum, target) => {
							sum += target.getStorage(event.name).filter(name => name == trigger.card.name).length;
							return sum;
						}, 0);
					if (num % 3 == 0) {
						trigger._mjszhongkoushuojin = true;
					}
				},
			},
		},
	},
	/**折竹
	 * 出牌阶段限1次，你可以用1张手牌刻写其他角色本轮发动过的1个技能。之后你可以弃置此牌，获得此技能，直到你的下个回合开始。
	 * 每轮结束时，你可以用1张手牌刻写其他角色本轮发动过的1个技能。之后你可以弃置此牌，获得此技能，直到你的下个回合开始。
	 * 1.刻写：将1个技能写在1张手牌上。
	 * 2.可以刻写限定技。
	 * */
	mjszhezhu: {
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		getSkills(player) {
			return player
				.getRoundHistory("useSkill", evt => {
					let skill = get.sourceSkillFor(evt.skill);
					if (!skill) return false;
					let info = get.info(skill);
					if (["global", "equip"].includes(evt.event.type)) return false;
					return !info.charlotte;
				})
				.reduce((list, evt) => {
					list.add(get.sourceSkillFor(evt.skill));
					return list;
				}, []);
		},
		enable: "phaseUse",
		async precontent(event, trigger, player) {
			const skillName = event.name.slice("pre_".length);
			const list = [];
			const targets = game.filterPlayer(target => {
				return target != player && get.info(skillName).getSkills(target).length;
			});
			const skills = [];
			for (const target of targets) {
				skills.addArray(get.info(skillName).getSkills(target));
			}
			list.push("获得技能");
			if (!player.hasSkill("mjszhezhu_used") && skills.length) {
				list.push("刻写技能");
			}
			const { control } = await player.chooseControl(list, "cancel2").set("prompt", get.prompt(skillName)).forResult();
			if (control != "cancel2") {
				if (control == "获得技能") {
					const cards = player.getExpansions("mjszhezhu");
					if (cards.length) {
						const result = await player
							.chooseButton([
								[[get.translation(skillName)], "addNewRow"],
								cards,
								[
									dialog => {
										dialog.css({
											top: get.is.phoneLayout() ? "5%" : "45%",
										});
										dialog.buttons.forEach(button => {
											game.createButtonCardsetion(button.link?.storage?.mjszhezhu || "", button.link);
										});
									},
									"handle",
								],
							])
							.forResult();
						if (result?.bool && result.links?.length) {
							event.result.cards = result.links;
							return;
						}
					}
				} else {
					const result = await player
						.chooseButtonCard_mjs({
							createDialog: [`###${get.translation(skillName)}###`, [skills, "skill"]],
							filterCard: true,
							canHidden: false,
							ai1(button) {
								const player = get.player();
								return 1 + Math.random();
							},
							ai2(card) {
								const player = get.player();
								return 7 - get.value(card);
							},
						})
						.forResult();
					if (result?.bool && result.links?.length) {
						event.result.cards = result.cards;
						event.getParent().cost_data = result.links[0];
						return;
					}
				}
			}
			player.addTempSkill("mjszhezhu_aiCheck", {
				player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
			});
			event.getParent().goto(0);
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			if (player.getExpansions(event.name).containsSome(...event.cards)) {
				const skills = event.cards.reduce((list, card) => {
					const skill = card.storage?.mjszhezhu;
					if (skill) list.add(skill);
					return list;
				}, []);
				for (const card of event.cards) {
					delete card.storage.mjszhezhu;
				}
				await player.loseToDiscardpile(event.cards);
				if (skills.length) {
					await player.addTempSkills(skills, { player: "phaseBegin" });
				}
			} else {
				player.addTempSkill("mjszhezhu_used");
				const skill = event.getParent(2).cost_data;
				for (const card of event.cards) {
					card.storage.mjszhezhu = skill;
				}
				const next = player.addToExpansion(event.cards, "draw");
				next.gaintag.add(event.name);
				await next;
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					if (player.hasSkill("mjszhezhu_aiCheck")) return 0;
					return 1;
				},
			},
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
		subSkill: {
			aiCheck: {
				charlotte: true,
				ai: {
	            	skill_aiCheck: true,
	            },
			},
			used: {
				charlotte: true,
			},
		},
	},
	//范雎
	/**五跪拜相
	 * 其他角色出牌阶段限1次，其可以交给你1张牌，然后你可以随机添加1张战法牌到其手牌；其他角色每累计令你获得牌或回复体力5次后，你的手牌上限+1，并且将势力改为与其相同。
	 * 1.能交出手牌或者装备区牌。
	 * 2.添加，不会影响摸牌区。
	 * 秦王跽曰：“先生是何言也！夫秦国辟远，寡人愚不肖，先生乃幸辱至於此，是天以寡人慁先生而存先王之宗庙也。寡人得受命於先生，是天所以幸先王，而不弃其孤也。先生柰何而言若是！事无小大，上及太后，下至大臣，愿先生悉以教寡人，无疑寡人也。”范雎拜，秦王亦拜。——《史记·范雎列传》
	 * */
	mjswuguibaixiang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjswuguibaixiang" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		skill_tag: ["增益"],
		global: "mjswuguibaixiang_global",
		init(player, skill) {
			player.storage[skill] ??= new Map();
		},
		onremove: true,
		trigger: {
			player: ["gainAfter", "recoverAfter"],
			global: "loseAsyncAfter",
		},
		popup: false,
		forced: true,
		locked: false,
		getIndex(event, player) {
			if (event.name == "recover") {
				return [event.source];
			} else if (event.name == "gain") {
				if (event.getParent().name == "draw") return [event.getParent().source];
				return [event.giver];
			} else {
				return [event.player];
			}
		},
		filter(event, player, triggername, target) {
			if (!target?.isIn()) return false;
			if (event.name == "recover") return event.source != player;
			if (event.name == "gain") {
				if (event.getParent().name == "draw" && event.getParent().source && event.getParent().source != player) return true;
			}
			if (!event.giver || event.giver !== target) return false;
			return game.hasPlayer(current => current != player && event.getl(target)?.cards2?.length);
		},
		logTarget(event, player, triggername, target) {
			return target;
		},
		async content(event, trigger, player) {
			const target = event.indexedData;
			let map = player.getStorage(event.name, new Map()),
				num = 1;
			if (map.has(target)) {
				num += map.get(target);
			}
			map.set(target, num);
			if (map.get(target) < 5) {
				return;
			}
			player.logSkill(event.name, target, null, null, null, [get.rand(3, 4)]);
			map.set(target, 0);
			lib.skill.mjsallmax.change(player, 1);
			if (!get.info("mjsyitongliuhe").groupFiter(player)) {
				return;
			}
			if (!get.info("mjsyitongliuhe").groupFiter(target)) {
				return;
			}
			await player.changeGroup(target.group);
		},
		subSkill: {
			global: {
				enable: "phaseUse",
				prompt() {
					const player = get.player();
					const targets = game.filterPlayer(target => lib.skill.mjswuguibaixiang_global.filterTarget(null, player, target));
					let str = "交给" + get.translation(targets);
					if (targets.length > 1) {
						str += "中的一人";
					}
					str += "一张牌，然后其可以随机添加1张战法牌到你手牌";
					return str;
				},
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					return game.hasPlayer(target => lib.skill.mjswuguibaixiang_global.filterTarget(null, player, target));
				},
				filterCard: true,
				position: "he",
				filterTarget(card, player, target) {
					return target != player && target.hasSkill("mjswuguibaixiang") && !target.hasSkill("mjswuguibaixiang_used", null, null, false);
				},
				check(card) {
					const player = get.player();
					if (player.needsToDiscard()) {
						return 8 - get.value(card);
					}
					return 6 - get.value(card);
				},
				lose: false,
				discard: false,
				delay: false,
				line: false,
				async precontent(event, trigger, player) {
					//event.result.targets[0].logSkill("mjswuguibaixiang", player);
				},
				async content(event, trigger, player) {
					const cards = event.cards,
						target = event.targets[0];
					target.addTempSkill("mjswuguibaixiang_used", "phaseUseAfter");
					await player.give(cards, target);
					const result = await target
						.chooseBool(`五跪拜相：是否随机添加1张战法牌到${get.translation(player)}手牌`)
						.set("ai", () => get.attitude(get.player(), get.event().getParent().player) > 0)
						.forResult();
					if (!result?.bool) {
						return;
					}
					target.logSkill("mjswuguibaixiang", player, null, null, [get.rand(1, 2)]);
					const trick = mjs.getTrick("random");
					const card = mjs.createCard(trick);
					if (card) {
						await player.gain(card, "draw");
					}
				},
				ai: {
					order: 7,
					result: {
						target: 2,
					},
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**远交近攻
	 * 出牌阶段限1次，交给一名不同势力的其他角色2张牌，然后对与你距离为1以内的另一名其他势力的角色造成1点伤害。
	 * 如果场上角色都相同，则该技能不可发动。
	 * 王不如远交而近攻，得寸则王之寸，得尺亦王之尺也。今舍此而远攻，不亦谬乎！——《战国策·秦策三》
	 * */
	mjsyuanjiaojingong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		logAudio: index => "ext:名将杀/audio/skill/mjsyuanjiaojingong" + (typeof index === "number" ? index : get.rand(1, 2)) + ".mp3",
		skill_tag: ["增益", "输出"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (player.countCards("he") < 2) return false;
			return game.hasPlayer(target => lib.skill.mjsyuanjiaojingong.filterTarget(null, player, target));
		},
		filterCard: true,
		selectCard: 2,
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (!get.info("mjsyitongliuhe").groupFiter(target)) {
				return;
			}
			if (player == target) {
				return false;
			}
			return target.group != player.group;
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			await player.give(event.cards, event.targets[0]);
			const targets = game.filterPlayer(target => {
				if (target == player || event.targets.includes(target)) return false;
				if (target.group == player.group) return false;
				return get.distance(target, player) <= 1;
			});
			if (!targets.length) {
				return;
			}
			const result = await player
				.chooseTarget(`${mjs.prompt(event.name)}，选择一名角色，对其造成1点伤害`, true, (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set("targets", targets)
				.set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player);
				})
				.forResult();
			if (result?.bool) {
				const target = result.targets[0];
				player.logSkill(event.name, target);
				await target.damage();
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					return 1;
				},
			},
		},
	},
	/**青云直上
	 * 回合结束时，若你的手牌数不是全场最多，你之后每个回合的摸牌数+1。
	 * 最多之一也是最多！
	 * 须贾顿首言死罪，曰：“贾不意君能自致于青云之上，贾不敢复读天下之书，不敢复与天下之事。”——《史记·范雎列传》
	 * */
	mjsqingyunzhishang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: "phaseEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return !player.isMaxHandcard();
		},
		async content(event, trigger, player) {
			player.addSkill(event.name + "_effect");
			player.addMark(event.name + "_effect", 1, false);
		},
		ai: {
			nokeep: true,
		},
		subSkill: {
			effect: {
				trigger: {
					player: "phaseDrawBegin2",
				},
				popup: false,
				forced: true,
				charlotte: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
			},
		},
	},
	//扶苏
	/**山有扶苏
	 * 你可以消耗1个出杀次数或1点体力，令任意名角色摸1张牌，且因此获得牌的其他角色打出下一张♣牌时，回复1点体力。
	 * 1.即使扶苏阵亡，下一张♣牌回复体力的效果也会生效。
	 * 2.下一张♣牌回复体力的效果不会叠加。
	 * 山有扶苏，隰有荷华。不见子都，乃见狂且。——《诗经》
	 * */
	mjsshanyoufusu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["摸牌", "增益"],
		enable: "phaseUse",
		filter(event, player) {
			return player.getCardUsable("sha") > 0 || player.hp > 0;
		},
		async precontent(event, trigger, player) {
			const skillName = event.name.slice("pre_".length);
			const list = ["消耗出杀次数", "消耗1点体力"];
			const result = await player
				.chooseTargetControl_mjs({
					createDialog: [get.prompt2(skillName)],
					selectTarget: [1, Infinity],
					choices: list,
					control(targets) {
						const choices = get.event().choices.slice();
						return choices;
					},
					filter(control, player) {
						if (control.link == "消耗出杀次数") {
							return player.getCardUsable("sha") > 0;
						}
						return player.hp > 0;
					},
					processAI() {
						let player = get.player();
						let targets = game.filterPlayer(target => {
							return get.attitude(player, target) > 0;
						});
						let bool = false, control = "cancel2";
						let controls = get.event().choices.slice().filter(control => get.event().filter(control, player));
						let bool1 = controls.includes("消耗1点体力") && player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) > 1;
						let bool2 = controls.includes("消耗出杀次数") && (!player.hasSha() || player.getCardUsable("sha") > 1);
						if (bool1) {
							control = "消耗1点体力";
						} else if (bool2) {
							control = "消耗出杀次数";
						}
						if (control != "cancel2") {
							bool = true;
						}
						return {
							bool: bool,
							targets: targets,
							control: control,
						}
					},
				})
				.forResult();
			if (result.bool) {
				event.result.targets = result.targets;
				event.getParent().cost_data = result.control;
				return;
			}
			player.addTempSkill(`${skillName}_aiCheck`, {
				player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
			});
			event.getParent().goto(0);
		},
		async precontentx(event, trigger, player) {
			const skillName = event.name.slice("pre_".length);
			const list = [];
			if (player.getCardUsable("sha") > 0) list.push("消耗出杀次数");
			if (player.hp > 0) list.push("消耗1点体力");
			if (!list.length) return;
			const { control } = await player
				.chooseControl(list, "cancel2")
				.set("prompt", get.prompt(skillName))
				.set("ai", () => {
					const player = get.player();
					let controls = get.event().controls;
					if (controls.includes("消耗出杀次数")) return "消耗出杀次数";
					return controls[get.rand(0, controls.length - 1)];
				})
				.forResult();
			if (control != "cancel2") {
				const result = await player
					.chooseTarget(get.prompt(skillName), "令任意名角色摸1张牌，且因此获得牌的其他角色打出下一张♣牌时，回复1点体力", [1, Infinity])
					.set("ai", target => {
						const player = get.player();
						return get.attitude(player, target);
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					event.result.targets = result.targets;
					event.getParent().cost_data = control;
					return;
				}
			}
			player.addTempSkill(`${skillName}_aiCheck`, {
				player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
			});
			event.getParent().goto(0);
		},
		multitarget: true,
		line: false,
		async content(event, trigger, player) {
			if (event.getParent(2).cost_data == "消耗出杀次数") {
				player.addTempSkill("mjsshanyoufusu_sha", "phaseUseAfter");
				player.addMark("mjsshanyoufusu_sha", 1, false);
			} else {
				await player.loseHp();
			}
			await game.asyncDraw(event.targets);
			for (const target of event.targets) {
				if (target == player) continue;
				target.addSkill("mjsshanyoufusu_effect");
				target.addMark("mjsshanyoufusu_effect", 1, false);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					if (player.hasSkill("mjsshanyoufusu_aiCheck")) return 0;
					return 1;
				},
			},
		},
		subSkill: {
			aiCheck: {
				charlotte: true,
				ai: {
	            	skill_aiCheck: true,
	            },
			},
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num - player.countMark("mjsshanyoufusu_sha");
						}
					},
				},
			},
			effect: {
				trigger: {
					player: ["useCard", "respond"],
				},
				forced: true,
				popup: false,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return get.suit(event.card) == "club";
				},
				async content(event, trigger, player) {
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					player.recover(num);
				},
				mark: true,
				intro: {
					content: "打出下一张♣牌时，回复1点体力",
				},
			},
		},
	},
	/**贤闻于民
	 * 阵亡，令击杀你的角色受到的所有伤害+1，直到游戏结束。
	 * 该技能效果不可被清除，直到游戏结束。
	 * 吾闻二世少子也，不当立，当立者乃公子扶苏。扶苏以数谏故，上使外将兵。今或闻无罪，二世杀之。百姓多闻其贤，未知其死也。——《史记·陈涉世家》
	 * */
	mjsxianwenyumin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["减益"],
		trigger: {
			player: "die",
		},
		forced: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event) {
			return event.source && event.source.isIn();
		},
		async content(event, trigger, player) {
			trigger.source.addSkill("mjsxianwenyumin_effect");
		},
		subSkill: {
			effect: {
				trigger: {
					player: "damageBegin3",
				},
				forced: true,
				popup: false,
				charlotte: true,
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
		},
	},
	//李斯
	/**燔书明法
	 * 出牌阶段限1次，你可以弃置1张牌，令一名其他角色手牌上限-1。当你弃牌后，直到你的下回合开始，其他角色打出与你弃牌同名的牌时，你可以令其随机弃置1张牌。你每因此弃置其他角色3张牌，此技能下个出牌阶段的发动次数+1。
	 * 出牌阶段限1次，你可以弃置1张牌，令一名其他角色手牌上限-1。当你弃牌后，直到你的下回合开始，其他角色打出与你弃牌同名的牌时，你可以令其随机弃置1张牌，然后令此技能下个出牌阶段的发动次数+1。
	 * 出牌阶段限1次，你可以弃置1张牌，然后令所有本轮打出过同名牌的角色手牌上限-1。当你弃牌后，直到你的下回合开始，其他角色打出与你弃牌同名的牌时，你可以令其随机弃置1张牌。
	 * */
	mjsfanshumingfa: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制"],
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.countMark("mjsfanshumingfa_counter");
		},
		filter(event, player) {
			return player.countCards("he");
		},
		filterTarget: lib.filter.notMe,
		filterCard: true,
		position: "he",
		check(card) {
			const player = get.player();
			return 8 - get.value(card);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			lib.skill.mjsallmax.change(target, -1);
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					return -Math.max(1, 4 / (target.getHandcardLimit() + 1));
				},
			},
		},
		group: "mjsfanshumingfa_discard",
		subSkill: {
			discard: {
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (event.type != "discard") {
						return false;
					}
					return event.getl && event.getl(player)?.cards2?.length;
				},
				async content(event, trigger, player) {
					const list = trigger.getl(player)?.cards2.reduce((list, card) => list.add(card.name), []);
					player.addTempSkill("mjsfanshumingfa_effect", { player: "phaseBegin" });
					player.markAuto("mjsfanshumingfa_effect", list);
				},
			},
			effect: {
				trigger: {
					global: ["useCard", "respond"],
				},
				filter(event, player) {
					if (event.player == player) return false;
					return player.hasStorage("mjsfanshumingfa_effect", event.card.name);
				},
				logTarget: "player",
				prompt2(event, player) {
					return `你可以令其随机弃置1张牌，然后令${get.poptip("mjsfanshumingfa")}下个出牌阶段的发动次数+1。`;
				},
				check(event, player) {
					return get.attitude(player, event.player) < 0;
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					const cards = target.getCards("h", card => {
						return lib.filter.cardDiscardable(card, target, "mjsfanshumingfa_effect");
					});
					if (cards.length > 0) {
						await target.discard(cards.randomGets(1)).set("discarder", target);
					}
					player.addMark("mjsfanshumingfa", 1, false);
					if (player.countMark("mjsfanshumingfa") < 3) {
						return;
					}
					player.clearMark("mjsfanshumingfa", false);
					player
						.when("phaseUseBegin")
						.then(() => {
							player.addTempSkill("mjsfanshumingfa_counter", "phaseUseAfter");
							player.addMark("mjsfanshumingfa_counter", 1, false);
						});
				},
			},
			counter: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**谏止逐客
	 * 当你打出牌后，直到你的下回合开始，你可以获得其他角色弃置的与你打出过的牌同名的牌。
	 * 1.其他角色以任何方式弃置的牌，如果与你打出过的牌同名，都生效。
	 * 2.在回合外打出的牌也会被记录。
	 * */
	mjsjianzhizhuke: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return !player.hasStorage("mjsjianzhizhuke_effect", event.card.name);
		},
		async content(event, trigger, player) {
			player.addTempSkill("mjsjianzhizhuke_effect", { player: "phaseBegin" });
			player.markAuto("mjsjianzhizhuke_effect", [trigger.card.name]);
		},
		subSkill: {
			effect: {
				audio: "mjsjianzhizhuke",
				trigger: {
					global: ["loseAfter", "loseAsyncAfter"],
				},
				getIndex(event, player) {
					if (event.type != "discard" || event.getlx === false) {
						return [];
					}
					return game
						.filterPlayer(current => {
							if (current == player) return false;
							const evt = event.getl(current);
							return evt?.cards2?.some(card => player.hasStorage("mjsjianzhizhuke_effect", card.name));
						})
						.sortBySeat();
				},
				logTarget(event, player, triggername, target) {
					return target;
				},
				prompt2(event, player, triggername, target) {
					const cards = event.getl?.(target)?.cards2?.filter(card => player.hasStorage("mjsjianzhizhuke_effect", card.name));
					return `你可以获得${get.translation(target)}弃置的${get.translation(cards)}`;
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const cards = trigger.getl(target)?.cards2?.filter(card => player.hasStorage("mjsjianzhizhuke_effect", card.name));
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
				},
				mark: true,
				intro: {
					mark(dialog, content, player) {
						const storage = player.getStorage("mjsjianzhizhuke_effect");
						if (player.isUnderControl(true) && storage.length) {
							dialog.addSmall([storage, "vcard"]);
						}
					},
				},
			},
		},
	},
	//子婴
	/**末代秦王
	 * 你的初始手牌*2。在你的回合开始时，你弃置手牌至手牌上限。当你的手牌被弃置时，你可以将其交给任意一名其他角色。
	 * 1.“初始手牌”指的是游戏开始时的手牌，结算不受其他角色技能影响。
	 * 2.“手牌被弃置”包括主动、被动弃置。
	 * 赵高乃悉召诸大臣公子，告以诛二世之状。曰：“秦故王国，始皇君天下，故称帝。今六国复自立，秦地益小，乃以空名为帝，不可。宜为王如故，便。”立二世之兄子公子婴为秦王。——《史记·秦始皇本纪》
	 * */
	mjsmodaiqinwang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["增益"],
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return player.countCards("h") > player.getHandcardLimit();
		},
		async content(event, trigger, player) {
			const num = player.countCards("h") - player.getHandcardLimit();
			if (num > 0) await player.chooseToDiscard("h", num, true);
		},
		group: ["mjsmodaiqinwang_init", "mjsmodaiqinwang_give"],
		subSkill: {
			init: {
				trigger: {
					global: "gameDrawBegin",
				},
				forced: true,
				locked: false,
				content() {
					const me = player,
						numx = trigger.num;
					trigger.num = function (player) {
						return (typeof numx == "function" ? numx(player) : numx) * (player === me ? 2 : 1);
					};
				},
			},
			give: {
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				popup: false,
				filter(event, player) {
					if (event.type != "discard") {
						return false;
					}
					return event.getl && event.getl(player)?.hs?.someInD("od");
				},
				async cost(event, trigger, player) {
					const cards = trigger.getl(player)?.hs?.filterInD("od");
					if (!cards.length) return;
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "将被弃置的手牌交给一名其他角色", lib.filter.notMe)
						.set("ai", target => {
							const { player, cards } = get.event();
							let att = get.attitude(player, target);
							if (att < 3) {
								return 0;
							}
							if (target.hasSkillTag("nogain")) {
								att /= 10;
							}
							if (target.hasJudge("lebu")) {
								att /= 5;
							}
							if (target.hasSha() && cards.some(card => card.name == "sha")) {
								att /= 5;
							}
							if (target.needsToDiscard(1) && cards.some(card => card.name == "wuxie")) {
								att /= 5;
							}
							return att / (1 + get.distance(player, target, "absolute"));
						})
						.set("cards", cards)
						.forResult();
					if (event.result?.bool) {
						event.result.cards = cards;
					}
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill(event.name, target);
					await target.gain(event.cards, "gain2").set("giver", player);
				},
			},
		},
	},
	/**推庙诛奸
	 * 出牌阶段限1次，你可以减少1点装备上限，摸2张牌，手牌上限+1；当你的装备上限首次为0时，你可以弃置所有杀，并选择一名其他角色，对其造成等量伤害。
	 * 1.如果错过“装备上限首次为0”这个时机点，将不会再触发。
	 * 2.“对其造成等量伤害”，为无属性伤害。
	 * 令子婴斋，当庙见，受王玺。斋五日，子婴与其子二人谋曰：“丞相高杀二世望夷宫，恐群臣诛之，乃详以义立我。我闻赵高乃与楚约，灭秦宗室而王关中。今使我斋见庙，此欲因庙中杀我。我称病不行，丞相必自来，来则杀之。”高使人请子婴数辈，子婴不行，高果自往，曰：“宗庙重事，王柰何不行？”子婴遂刺杀高于斋宫，三族高家以徇咸阳。——《史记·秦始皇本纪》
	 * */
	mjstuimiaozhujian: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["摸牌", "增益", "输出"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.mjsGetEquipLimit();
		},
		async content(event, trigger, player) {
			await player.mjsContractEquip();
			await player.draw(2);
			lib.skill.mjsallmax.change(player, 1);
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					return get.effect(player, { name: "wuzhong" }, player) > 0;
				},
			},
		},
		group: "mjstuimiaozhujian_use",
		subSkill: {
			use: {
				audio: "mjstuimiaozhujian",
				trigger: {
					player: "mjsContractEquipAll",
				},
				popup: false,
				filter(event, player) {
					return (
						player.countCards("h", { name: "sha" }) &&
						game
							.getAllGlobalHistory("everything", evt => {
								return evt.name == "mjsContractEquipAll" && evt.player == player;
							})
							.indexOf(event) == 0
					);
				},
				async cost(event, trigger, player) {
					const cards = player.getCards("h", "sha");
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "你可以弃置所有杀，并选择一名其他角色，对其造成等量伤害")
						.set("ai", target => {
							const player = get.player();
							return get.damageEffect(target, player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill(event.name, target);
					const cards = player.getCards("h", "sha");
					if (cards.length) {
						await player.modedDiscard(cards);
						await target.damage(cards.length);
					}
				},
			},
		},
	},
	//章邯
	/**赦徒授兵
	 * 你可以消耗1次出杀次数，将弃牌堆中的所有杀洗回牌堆，然后摸牌直到摸到的牌不是杀。
	 * 你可以消耗1次出杀次数，将弃牌堆中的所有杀洗回牌堆，然后摸牌直到摸到的牌不是杀或装备牌。
	 * 出牌阶段限1次，你可以将弃牌堆中的所有杀洗回牌堆，然后摸牌直到摸到的牌不是杀。
	 * 1.将杀洗回牌堆的动作会导致牌堆自身的顺序被打乱一次。
	 * 2.弃牌堆中的杀包括所有属性的杀。
	 * 二年冬，陈涉所遣周章等将西至戏，兵数十万。二世大惊，与群臣谋曰：“柰何？”少府章邯曰：“盗已至，众强，今发近县不及矣。郦山徒多，请赦之，授兵以击之。”二世乃大赦天下，使章邯将，击破周章军而走，遂杀章曹阳。——《史记·秦始皇本纪》
	 * */
	mjsshetushoubing: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌"],
		enable: "phaseUse",
		filter(event, player) {
			return player.getCardUsable("sha") > 0;
			return Array.from(ui.discardPile.childNodes).some(card => card.name == "sha");
		},
		async content(event, trigger, player) {
			player.addTempSkill("mjsshetushoubing_sha", "phaseUseAfter");
			player.addMark("mjsshetushoubing_sha", 1, false);
			const cards = Array.from(ui.discardPile.childNodes).filter(card => card.name == "sha");
			if (cards.length) {
				await game.cardsGotoPile(cards, () => {
					return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
				});
				//await game.washCard();
				const cards2 = Array.from(ui.cardPile.childNodes);
				cards2.randomSort();
				await game.cardsGotoPile(cards2, "triggeronly", "washCard", ["shuffleNumber", game.shuffleNumber]);
			}
			while (true) {
				const result = await player.draw().forResult();
				if (get.itemtype(result.cards) == "cards" && result.cards.some(card => card.name != "sha")) {
					break;
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					return 1;
				},
			},
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num - player.countMark("mjsshetushoubing_sha");
						}
					},
				},
			},
		},
	},
	/**衔枚
	 * 若你在出牌阶段没有打出杀，你跳过弃牌阶段，并且你之后每个出牌阶段的出杀次数+1。
	 * 若你在出牌阶段没有打出杀，你跳过弃牌阶段，并将剩余出杀次数保留到你的下个出牌阶段。
	 * 1.打出杀也包括阵前对决和烽火狼烟等方式打出。
	 * 2.出杀次数默认是在出牌阶段开始时重置，此技能的效果实际上是跳过了此重置。
	 * 3.回合外获得的出杀次数也会保留到下个出牌阶段。
	 * 项梁再破秦军，有骄色。宋义谏，不听。秦益章邯兵，夜衔枚击项梁，大破之定陶，项梁死。——《史记·高祖本纪》
	 * */
	mjsxianmei: {
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: "phaseDiscardBefore",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (player.getHistory("skipped").includes("phaseUse")) {
				return true;
			}
			const history = player.getHistory("useCard").concat(player.getHistory("respond"));
			for (let i = 0; i < history.length; i++) {
				if (history[i].card.name == "sha" && history[i].isPhaseUsing()) {
					return false;
				}
			}
			return true;
		},
		async content(event, trigger, player) {
			trigger.cancel();
			lib.skill.mjsallsha.change(player, 1);
			/*
			const num = player.getCardUsable("sha", true);
			if (num > 0) {
				player.addSkill("mjsxianmei_sha");
				player.addMark("mjsxianmei_sha", num, false);
			}
			*/
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (!player.isPhaseUsing()) return;
						if (card.name == "sha") {
							return num + player.countMark("mjsxianmei_sha");
						}
					},
				},
				trigger: {
					player: "phaseUseAfter",
				},
				popup: false,
				forced: true,
				charlotte: true,
				filter(event, player) {
					const history = player.getHistory("useCard").concat(player.getHistory("respond"));
					return history.some(evt => evt.card?.name == "sha" && evt.isPhaseUsing());
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
				},
			},
		},
	},
	//蒙毅
	/**内谋法治
	 * 应战，你随机弃置目标1张牌，令此技能可以弃牌的数量+1，直到你的下个回合开始。
	 * 蒙毅回合开始时，弃牌数重置为1。
	 * 高有大罪，秦王令蒙毅法治之。毅不敢阿法，当高罪死，除其宦籍。帝以高之敦於事也，赦之，复其官爵。——《史记·蒙恬列传》
	 * */
	mjsneimoufazhi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制"],
		trigger: {
			target: "useCardToTarget",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.card.name == "sha";
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = 1 + player.countMark(`${event.name}_effect`);
			const cards = target.getDiscardableCards(player, "he");
			if (cards.length) {
				await target.discard(cards.randomGets(Math.min(num, cards.length))).set("discarder", player);
			}
			player.addTempSkill(`${event.name}_effect`, { player: "phaseBegin" });
			player.addMark(`${event.name}_effect`, 1, false);
		},
		ai: {
			yingzhan: true,
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//蒙恬
	/**筑城守藩
	 * 应战，你摸1张牌，若你未受到此杀伤害，令此技能可以摸牌的数量+1，直到你的下个回合开始。
	 * 1.蒙恬回合开始时，摸牌数重置为1。
	 * 2.只要未受到此杀伤害就可以触发，也包括其他技能抵消了此杀的伤害。
	 * 秦已并天下，乃使蒙恬将三十万众北逐戎狄，收河南。筑长城，因地形，用制险塞，起临洮，至辽东，延袤万馀里。于是渡河，据阳山，逶蛇而北。暴师于外十馀年，居上郡。——《史记·蒙恬列传》
	 * */
	mjszhuchenshoufan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌"],
		trigger: {
			target: "useCardToTarget",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			const num = 1 + player.countMark(`${event.name}_effect`);
			await player.draw(num);
			const skill = event.name;
			player
				.when({ global: "useCardAfter" })
				.filter(evt => evt.card == trigger.card)
				.then(async (event, trigger, player) => {
					if (player.hasHistory("damage", evt => evt.card == trigger.card)) return;
					player.addTempSkill(`${skill}_effect`, { player: "phaseBegin" });
					player.addMark(`${skill}_effect`, 1, false);
				});
		},
		ai: {
			yingzhan: true,
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**忠信
	 * 每个回合限1次，当一名其他角色成为其他角色杀的目标时，你可以将此杀的目标改为你。
	 * 杀的目标改变后，相应的结算时机点都会重新进行判断，因此可以触发“应战”效果。
	 * 始皇甚尊宠蒙氏，信任贤之。而亲近蒙毅，位至上卿，出则参乘，入则御前。恬任外事而毅常为内谋，名为忠信，故虽诸将相莫敢与之争焉。——《史记·蒙恬列传》
	 * */
	mjszhongxin: {
		audio: "ext:名将杀/audio/skill:2",
		audioname: ["mjs_mengyi"],
		trigger: {
			global: "useCardToTarget",
		},
		usable: 1,
		filter(event, player) {
			if (event.target == player) return false;
			if (event.target == event.player) return false;
			return event.card.name == "sha";
		},
		logTarget: "target",
		check(event, player) {
			if (get.attitude(player, event.target) <= 0) {
				return false;
			}
			return get.effect(event.target, event.card, event.player, player) <= get.effect(player, event.card, event.player, player);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const evt = trigger.getParent();
			evt.triggeredTargets2.remove(target);
			evt.targets.remove(target);
			evt.targets.push(player);
		},
	},
	//董卓
	/**欺天废主
	 * 出牌阶段限1次，你可以令两名其他角色交换位置，然后选择其中一名角色手牌上限-1。
	 * 1.手牌上限-1的效果会持续到本局游戏结束。
	 * 2.手牌上限最低减到0，可以继续选择手牌上限为0的角色令其手牌上限-1，但是不会有实际效果（目标再获得手牌上限+1的效果时，手牌上限会变为1）。
	 * 3.装备凤羽盔（手牌上限+2）时，也可以被减少手牌上限至0，但是如果被减为0后再重新装备凤羽盔，手牌上限会变为2。
	 * 4.交换座位后，当前轮次的行动顺序不会改变，从下一轮开始行动顺序才会按座位号的顺序改变（也就是每次1号位行动前，会根据当前所有角色的座位号，确定本轮所有角色的行动顺序，确定后不再改变）。
	 * 卓拔剑曰：“今上暗弱，不可以奉宗庙；吾将依伊尹、霍光故事，废帝为弘农王，立陈留王皇帝。有不从者斩！”……书略曰：卓贼欺天废主，人不忍言。——《三国演义·第四回》
	 * */
	mjsqitianfeizhu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target;
		},
		selectTarget: 2,
		filter(event, player) {
			return game.countPlayer() > 2;
		},
		multitarget: true,
		multiline: true,
		seatRelated: "changeSeat",
		async content(event, trigger, player) {
			const targets = event.targets;
			game.broadcastAll(
				function (target1, target2) {
					game.swapSeat(target1, target2);
				},
				targets[0],
				targets[1]
			);
			const result = await player
				.chooseTarget("选择令其中一名角色的手牌上限-1", true)
				.set("filterTarget", (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set("targets", targets)
				.set("ai", target => {
					let player = get.player();
					let att = -get.attitude(player, target);
					if (target.getHandcardLimit() == 0) att /= 2;
					return att;
				})
				.forResult();
			if (result?.bool) {
				const target = result.targets[0];
				player.line(target);
				target.addTempSkill("mjsqitianfeizhu_debuff");
				target.addMark("mjsqitianfeizhu_debuff", 1, false);
				game.log(target, "手牌上限", "#y-1");
			}
		},
		ai: {
			order() {
				return get.order({ name: "tao" }) + 1;
			},
			result: {
				target(player, target) {
					if (player.hasUnknown() && target != player.next && target != player.previous) {
						return 0;
					}
					var distance = Math.pow(get.distance(player, target, "absolute"), 2);
					if (!ui.selected.targets.length) {
						return distance;
					}
					var distance2 = Math.pow(get.distance(player, ui.selected.targets[0], "absolute"), 2);
					return Math.min(0, distance - distance2);
				},
			},
		},
		subSkill: {
			debuff: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("mjsqitianfeizhu_debuff");
					},
				},
			},
		},
	},
	/**藏宝郿坞
	 * 回合结束时，将牌堆顶的3张牌放入郿坞；郿坞中的牌在你的回合内视为你的手牌。
	 * 1.郿坞是这个技能专属的场外区，将牌移入郿坞后，其他玩家无法查看，也无法通过任何方式获得。
	 * 2.郿坞中的牌在回合内可以像手牌那样打出或弃置，只是不计入手牌上限，比如：打出烈火焚城后，可以弃置郿坞中的牌；打出多张怒气的时候，也可能会被弃置郿坞中的牌。
	 * 3.牌移入郿坞中不算是被董卓获得。
	 * 4.董卓阵亡时，所有郿坞中的牌将被弃置进入弃牌堆。
	 * 东汉初平三年， 董卓筑坞于郿 ，高厚七丈，与长安城相埒，号曰“万岁坞”，世称“郿坞”。坞中广聚珍宝，积谷为三十年储。自云：“事成，雄据天下；不成，守此足以毕老。”——《后汉书·董卓传》
	 * */
	mjscangbaoumeiwu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: ["phaseBegin", "phaseEnd"],
		},
		forced: true,
		locked: false,
		filter(event, player, name) {
			return name != "phaseBegin" || player.getExpansions("mjscangbaoumeiwu").length;
		},
		async content(event, trigger, player) {
			if (event.triggername == "phaseBegin") {
				player.addTempSkill("mjscangbaoumeiwu_init");
			} else {
				const next = player.addToExpansion(get.cards(3), "draw");
				next.gaintag.add("mjscangbaoumeiwu");
				await next;
			}
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("mjscangbaoumeiwu");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张郿坞";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("mjscangbaoumeiwu");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张郿坞";
				}
			},
		},
		subSkill: {
			tag: {
				name: "郿坞",
			},
			init: {
				init(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("mjscangbaoumeiwu_tag"));
					game.deleteFakeCards(toRemove);
					const cards = game.createFakeCards(player.getExpansions("mjscangbaoumeiwu"));
					player.directgains(cards, null, "mjscangbaoumeiwu_tag");
				},
				onremove(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("mjscangbaoumeiwu_tag"));
					game.deleteFakeCards(toRemove);
				},
				trigger: {
					player: "loseEnd",
					global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				forced: true,
				firstDo: true,
				silent: true,
				forceDie: true,
				filter(event, player) {
					if (event.name == "addToExpansion") {
						return event.gaintag?.includes("mjscangbaoumeiwu");
					}
					if (event.name == "lose" && event.getlx !== false) {
						for (var i in event.gaintag_map) {
							return event.gaintag_map[i].includes("mjscangbaoumeiwu");
						}
						return false;
					}
					return (
						game.getGlobalHistory("cardMove", function (evt) {
							if (evt.name != "lose" || event != evt.getParent()) {
								return false;
							}
							for (var i in evt.gaintag_map) {
								return evt.gaintag_map[i].includes("mjscangbaoumeiwu");
							}
							return false;
						}).length > 0
					);
				},
				async content(event, trigger, player) {
					const toAdd = [],
						toRemove = trigger.getl?.(player)?.xs || [];
					if (trigger.name == "addToExpansion") {
						toAdd.addArray(trigger.cards);
					}
					event.set("toAdd", toAdd);
					event.set("toRemove", toRemove);
					await event.trigger("mjscangbaoumeiwuChange");
				},
				group: "mjscangbaoumeiwu_use",
			},
			use: {
				trigger: {
					player: ["useCardBefore", "respondBefore"],
					global: ["mjscangbaoumeiwuChange"],
				},
				forced: true,
				popup: false,
				delay: false,
				charlotte: true,
				filter(event, player) {
					if (["useCard", "respond"].includes(event.name)) {
						const cards = player.getCards("s", card => card.hasGaintag("mjscangbaoumeiwu_tag"));
						return event.cards && event.cards.some(card => cards.includes(card));
					}
					return event.player == player;
				},
				async content(event, trigger, player) {
					const tag = "mjscangbaoumeiwu_tag";
					if (["useCard", "respond"].includes(trigger.name)) {
						trigger.set("mjscangbaoumeiwu", true);
						const real = player.getExpansions("mjscangbaoumeiwu");
						for (let i = 0; i < trigger.cards.length; i++) {
							const card = trigger.cards[i];
							const cardx = real.find(cardx => cardx.cardid == card._cardid);
							if (cardx) {
								trigger.cards[i] = cardx;
								trigger.card.cards[i] = cardx;
								trigger.throw = false;
								get.owner(cardx)?.$throw(cardx);
							}
						}
					} else {
						game.deleteFakeCards(player.getCards("s", card => trigger.toRemove.find(cardx => cardx.cardid == card._cardid)));
						player.directgains(game.createFakeCards(trigger.toAdd), null, tag);
					}
				},
			},
		},
	},
	//蔡文姬
	/**胡笳十八拍
	 * 每个回合限1次，当有角色受伤或者阵亡后，你可以摸1张牌，然后弃置伤害来源任意区域的1张牌。
	 * 可以弃置伤害来源的卜卦区的牌。
	 * 文姬寓居荒蛮二十余载，唯有胡音可闻，胡乐可鸣，相传作《胡笳十八拍》，以寄思乡怀人、流离悲苦之情。
	 * */
	mjshujiashibapai: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: ["damageEnd", "die"],
		},
		usable: 1,
		forceDie: true,
		check(event, player) {
			if (event.source?.isIn()) {
				return get.attitude(player, event.source) <= 0;
			}
			return get.effect(player, { name: "draw" }, player, _status.event.player) > 0;
		},
		async content(event, trigger, player) {
			await player.draw();
			if (trigger.source && trigger.source.countDiscardableCards(player, "hej")) {
				await player.discardPlayerCard(trigger.source, "hej", true);
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (target.storage?.counttrigger?.mjshujiashibapai) return;
					if (player.countCards("he") > 1 && get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -1.5];
						if (get.attitude(target, player) < 0) return [1, 1];
					}
				},
			},
		},
	},
	/**悲愤离愁
	 * 受伤，封禁伤害来源直到当前回合结束。
	 * 1.封禁效果会令目标所有武将技能效果无效，也包括一些技能效果需要累计的进度，如“忍”
	 * 2.已经被封禁的角色不会被再次封禁，已经被封禁的角色即使获得新技能也仍然由于封禁效果是无效的。
	 * 蔡文姬遭南匈奴掳掠，为左贤王所纳，育有二子。曹操以重金赎归。文姬心怀故土，然中原亲眷已逝，域外骨肉难舍，遂有离乱之遇，断肠之悲。
	 * */
	mjsbeifenlichou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageEnd",
		},
		forced: true,
		locked: false,
		priority: -1,
		filter(event, player) {
			return event.source?.isIn();
		},
		async content(event, trigger, player) {
			trigger.source.addTempSkill("mjs_debuff_fengjin");
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.getSkills(null, false, false).length && get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1.5];
						}
						return [1, 0, 1, -1];
					}
				},
			},
		},
	},
	//华佗
	/**刮骨疗毒
	 * 每个回合限1次，当一名有手牌的角色受伤后，你可以将其所有手牌移出游戏，直到其下个回合开始，然后令其回复1点体力。
	 * 1.被此技能移出游戏的牌不算是被销毁，而是移到此技能专属的目标角色的场外区。
	 * 2.被此技能移出游戏的牌，在华佗阵亡后，不会在目标下个回合开始的时候移回游戏（因为此技能已经失效了），直到目标阵亡后，目标场外区的这些牌才会被弃置进入游戏。
	 * 羽尝为流矢所中，贯其左臂，后创虽愈，每至阴雨，骨常疼痛。医曰：“矢镞有毒，毒入于骨，当破臂作创，刮骨去毒，然后此患乃除耳。”羽便伸臂令医劈之。时羽适请诸将饮食相对，臂血流离，盈于盘器，而羽割炙引酒，言笑自若。——《三国志·关羽传》
	 * */
	mjsguaguliaodu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "damageEnd",
		},
		usable: 1,
		filter(event, player) {
			return event.player?.isIn() && event.player.countCards("h");
		},
		logTarget: "player",
		check(event, player) {
			if (get.attitude(player, event.player) < 0) {
				if (event.player.isPhaseUsing() && event.player.countCards("h") > 5) return true;
				return event.player.isHealthy();
			}
			return get.recoverEffect(event.player, player, player) > 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			const cards = target.getCards("h");
			if (cards.length) {
				target.addSkill("mjsguaguliaodu_effect");
				const next = target.addToExpansion(cards, "giveAuto", target);
				next.gaintag.add("mjsguaguliaodu_effect");
				await next;
			}
			await target.recover();
		},
		subSkill: {
			effect: {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				charlotte: true,
				async content(event, trigger, player) {
					const cards = player.getExpansions(event.name);
					if (cards.length) {
						await player.gain(cards, "draw");
					}
					player.removeSkill(event.name);
				},
				onremove(player, skill) {
					const cards = player.getExpansions(skill);
					if (cards.length) {
						player.loseToDiscardpile(cards);
					}
				},
				intro: {
					mark(dialog, storage, player) {
						var cards = player.getExpansions("mjsguaguliaodu_effect");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
					markcount: "expansion",
				},
			},
		},
	},
	/**青囊妙手
	 * 当你打出♣的牌后，可以令一名角色回复1点体力，若其体力值已满，则改为体力上限+1并回复1点体力。
	 * 在重伤救援阶段，华佗打出♣桃后，也可以令求援的角色回复体力（也就是1张♣桃可以令重伤的角色回复2点体力）。
	 * 华佗在狱，有一狱卒，每日以酒食供奉华佗。佗感其恩，以青囊书赠之。然被其妻烧毁，不传于世，所传者止阉鸡猪等小法。后人有诗曰：华佗仙术比长桑，神识如窥垣一方。惆怅人亡书亦绝，后人无复见青囊！——《三国演义·第七十八回》
	 * */
	mjsqingnangmiaoshou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			aiOrder(player, card, num) {
				if (get.suit(card) === "club") {
					return num + 0.15;
				}
			},
		},
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		popup: false,
		locked: false,
		filter(event, player) {
			return get.suit(event.card) == "club";
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					if (target.isHealthy()) {
						return get.attitude(player, target) / (target.maxHp || 1);
					}
					return get.recoverEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			if (target.isHealthy()) {
				await target.gainMaxHp();
			}
			await target.recover();
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (get.suit(card) == "club") {
						return [1, 1];
					}
				},
			},
		},
	},
	//左慈
	/**掷杯戏曹
	 * 你打出的以其他角色为唯一目标的牌可以额外选择另一名其他角色为目标，然后你指定其中一个目标为虚假目标。
	 * 你打出的以其他角色为唯一目标的牌可以额外指定另一名其他角色为虚假目标。
	 * 1.虚假目标可以正常响应你打出的牌，但是即使不响应，也不会执行原本牌的效果，比如，你打出杀后，令一名角色成为虚假目标，其可以打出闪，但是即使不打出闪，这张杀也不会对其造成伤害。
	 * 2.你选择的真实目标和虚假目标的结算顺序是，从当前回合人开始的座位号顺序进行（与方天画戟相同）。
	 * 慈曰：“今当远适，愿乞分杯饮酒。”公曰：“善。”是时天寒，温酒尚未热，慈解剑以搅酒，须臾剑都尽，如人磨墨状。初，曹公闻慈求分杯饮酒，谓慈当使公先饮，以余与慈耳，而慈拔簪以画杯酒，酒即中断，分为两向。——《神仙传·卷八》
	 * */
	mjszhibeixicao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		//init: () => game.addGlobalSkill("mjszhibeixicao_ai"),
		trigger: {
			player: "useCard2",
		},
		filter(event, player) {
			if (!["basic", "trick"].includes(get.type(event.card))) return false;
			if (!event.targets || event.targets.length != 1 || event.targets?.includes(player)) {
				return false;
			}
			return game.hasPlayer(current => !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					const trigger = get.event().getTrigger();
					if (trigger.targets.includes(target)) {
						return false;
					}
					return lib.filter.targetEnabled2(trigger.card, get.player(), target);
				})
				.set("ai", target => {
					const player = get.player();
					const trigger = get.event().getTrigger();
					const att = get.attitude(player, target);
					const eff = get.effect(target, trigger.card, trigger.player, get.player());
					if (trigger.card.name == "sha") {
						if (target.hasSkillTag("yingzhan")) {
							return eff + att;
						}
					}
					return eff + 0.1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			if (!event.isMine() && !event.isOnline()) {
				await game.delayx();
			}
			trigger.targets.addArray(event.targets);
			const result = await player
				.chooseTarget(`${mjs.prompt(event.name)}，请指定一个虚假目标`, true, (card, player, target) => {
					return get.event().targets?.includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					const trigger = get.event().getTrigger();
					const eff = get.effect(target, trigger.card, trigger.player, get.player()) + 0.1;
					return 1 / eff;
				})
				.set("targets", trigger.targets)
				.set("animate", false)
				.forResult();
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.addTempSkill("mjszhibeixicao_effect");
				player.markAuto("mjszhibeixicao_effect", [[trigger.card, target]]);
			}
		},
		contentx() {
			"step 0";
			if (typeof event.shanRequired !== "number" || !event.shanRequired || event.shanRequired < 0) {
				event.shanRequired = 1;
			}
			if (typeof event.baseDamage !== "number") {
				event.baseDamage = 1;
			}
			if (typeof event.extraDamage !== "number") {
				event.extraDamage = 0;
			}
			"step 1"
			if (event.directHit || event.directHit2 || (!_status.connectMode && lib.config.skip_shan && !target.hasShan())) {
				event._result = { bool: false };
			} else if (event.skipShan) {
				event._result = { bool: true, result: "shaned" };
			} else {
				var next = target.chooseToUse("请使用一张闪响应杀");
				next.set("type", "respondShan");
				next.set("filterCard", function (card, player) {
					if (get.name(card) !== "shan") {
						return false;
					}
					return lib.filter.cardEnabled(card, player, "forceEnable");
				});
				if (event.shanRequired > 1) {
					next.set("prompt2", "（共需使用" + event.shanRequired + "张闪）");
				} else if (game.hasNature(event.card, "stab")) {
					next.set("prompt2", "（在此之后仍需弃置一张手牌）");
				}
				next.set("ai1", function (card) {
					if (get.event().toUse) {
						return get.order(card);
					}
					return 0;
				}).set("shanRequired", event.shanRequired);
				next.set("respondTo", [player, card]);
				next.set(
					"toUse",
					(() => {
						if (target.hasSkillTag("noShan", null, "use")) {
							return false;
						}
						if (target.hasSkillTag("useShan", null, "use")) {
							return true;
						}
						if (
							target.isLinked() &&
							game.hasNature(event.card) &&
							game.hasPlayer(cur => {
								if (cur === target || !cur.isLinked()) {
									return false;
								}
								return true; //return get.attitude(target, cur) <= 0;
							})
						) {
							if (get.attitude(target, player._trueMe || player) > 0) {
								return false;
							}
						}
						if (event.baseDamage + event.extraDamage <= 0 && !game.hasNature(event.card, "ice")) {
							return false;
						}
						if (event.baseDamage + event.extraDamage >= target.hp + (player.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
							return true;
						}
						if (!game.hasNature(event.card, "ice") && get.damageEffect(target, player, target, get.nature(event.card)) >= 0) {
							return false;
						}
						if (
							event.shanRequired > 1 &&
							!target.hasSkillTag("freeShan", null, {
								player: player,
								card: event.card,
								type: "use",
							}) &&
							target.mayHaveShan(target, "use", true, "count") < event.shanRequired - (event.shanIgnored || 0)
						) {
							return false;
						}
						return true;
					})()
				);
				//next.autochoose=lib.filter.autoRespondShan;
			}
			"step 2"
			if (!result || !result?.bool || !result.result || result.result !== "shaned") {
				//event.trigger("shaHit");
			} else {
				event.shanRequired--;
				if (event.shanRequired > 0) {
					event.goto(1);
				} else if (game.hasNature(event.card, "stab") && target.countCards("h") > 0) {
					event.responded = result;
					event.goto(4);
				} else {
					event.trigger("shaMiss");
					event.responded = result;
				}
			}
			"step 3"
			if ((!result || !result?.bool || !result.result || result.result !== "shaned") && !event.unhurt) {
				if (!event.directHit && !event.directHit2 && lib.filter.cardEnabled(new lib.element.VCard({ name: "shan" }), target, "forceEnable") && target.countCards("hs") > 0 && get.damageEffect(target, player, target) < 0) {
					target.addGaintag(target.getCards("hs"), "sha_notshan");
				}
				//target.damage(get.nature(event.card));
				event.result = { bool: true };
				//event.trigger("shaDamage");
			} else {
				event.result = { bool: false };
				//event.trigger("shaUnhirt");
			}
			event.finish();
			"step 4"
			target.chooseToDiscard("刺杀：请弃置一张牌，否则此【杀】依然造成伤害").set("ai", function (card) {
				var target = _status.event.player;
				var evt = _status.event.getParent();
				/*
				var bool = true;
				if (get.damageEffect(target, evt.player, target, evt.card.nature) >= 0) {
					bool = false;
				}
				if (bool) {
					return 8 - get.useful(card);
				}
				*/
				return 0;
			});
			"step 5"
			if ((!result || !result?.bool) && !event.unhurt) {
				//target.damage(get.nature(event.card));
				event.result = { bool: true };
				//event.trigger("shaDamage");
				event.finish();
			} else {
				event.trigger("shaMiss");
			}
			"step 6"
			if ((!result || !result?.bool) && !event.unhurt) {
				//target.damage(get.nature(event.card));
				event.result = { bool: true };
				//event.trigger("shaDamage");
				event.finish();
			} else {
				event.result = { bool: false };
				//event.trigger("shaUnhirt");
			}
		},
		subSkill: {
			ai: {
				trigger: {
					player: "dieAfter",
				},
				silent: true,
				forceDie: true,
				filter(event, player) {
					return !game.hasPlayer(i => i.hasSkill("mjszhibeixicao"), true);
				},
				async content(event, trigger, player) {
					game.removeGlobalSkill("mjszhibeixicao_ai");
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							const event = get.event(),
								evt = event?.getParent(2);
							if (evt?.name != "useCard") return;
							if (!evt.player || get.attitude(player, evt.player) > 0) return;
							const info = evt.player.getStorage("mjszhibeixicao_effect");
							if (info.some(list => list[0] == evt.card && list[1] == player)) {
								return [1, -1];
							}
						},
					},
				},
			},
			effect: {
				trigger: {
					player: "useCardToBegin",
				},
				forced: true,
				popup: false,
				firstDo: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					const storage = player.getStorage("mjszhibeixicao_effect");
					return storage.some(list => list[0] == event.card && list[1] == event.target);
				},
				async content(event, trigger, player) {
					//只区分杀和锦囊牌，不要问我为什么
					const name = trigger.card.name;
					trigger.isFake = true;
					if (lib.cardPack.mjs.includes(name)) {
						trigger.setContent(lib.card[name].content);
					} else {
						trigger.setContent(name == "sha" ? lib.skill.mjszhibeixicao.contentx : "emptyEvent");
					}
				},
			},
		},
	},
	/**遁甲天书
	 * 回合开始前，从随机三名武将中选择一名，直到你的下回合开始，获得其技能。
	 * 1.只能从已经获得的武将中抽取。
	 * 2.优先从不在场上的武将牌中抽取。
	 * 3.每局游戏你选择的武将技能的技能状态，即使下一个回合改变武将，再重新选择回来时，状态是保留的，比如，选择获得了一个限定发动1次的技能，发动后，即使之后的回合再次选择这个武将，这个技能也不能再发动了。
	 * 4.所有登场效果，在重新获得时，都会再生效一次，比如小乔的并蒂芙蓉，每次选到小乔的时候都需要选择1次目标。
	 * 5.此技能是在回合开始前触发，所以获得的所有“回合开始时”的技能都可以正常发动。
	 * 慈曰：“贫道于西川，嘉陵，峨嵋山中，学道三十年，忽闻石壁中有声呼我之名；及视则又不见。如此者数日，忽有天雷震碎石壁，得天书三卷，名曰‘遁甲天书’。上卷名‘天循，’中卷名‘地循，’下卷名‘人遁。’天循能腾云跨风，飞升太虚；地循能穿山透石；人遁能云游四海，藏形变身，飞剑掷刀，取人首级。——《三国演义·第六十八回》
	 * */
	mjsdunjiatianshu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		getList(player) {
			if (!_status.mjscharacterlist) {
				//const packs = { ...lib.characterPack.mjs, ...lib.characterPack.mjsnew, ...lib.characterPack.mjsold };
				const packs = { ...lib.characterPack.mjs };
				const list2 = Object.keys(packs);
				const list = list2.filter(name => {
					if (!get.character(name)?.skills?.length) {
						return false;
					}
					if (get.character(name).isUnseen) {
						return false;
					}
					return true;
				});
				list.removeArray(lib.skill.mjsdunjiatianshu.banList);
				_status.mjscharacterlist = list;
			}
			const list = _status.mjscharacterlist;
			list.removeArray(get.nameList(player));
			return list;
		},
		banList: [],
		trigger: {
			player: "phaseBeforeEnd",
		},
		silent: true,
		popup: true,
		forced: false,
		async cost(event, trigger, player) {
			const characters = lib.skill.mjsdunjiatianshu.getList(player).randomGets(3);
			const list = characters.randomGets(3);
	        if (!list.length) {
	            return;
	        }
	        let num = 0,
	            skillMap = {};
	        for (const i of list) {
	            const skills = (lib.character[i][3] || []).filter(skill => {
	                const info = get.info(skill);
	                return info && !info.zhuSkill && !info.hiddenSkill && !info.charlotte;
	            });
	            if (skills.length > num) {
	                num = skills.length;
	            }
	            skillMap[i] = skills;
	        }
	        if (num == 0) {
	            return;
	        }
	        event.result = await player
	            .chooseButton(
	                [
	                    [[get.translation(event.skill)], "addNewRow"],
	                    [
	                        dialog => {
	                            dialog.css({
	                                top: get.is.phoneLayout() ? "5%" : "45%",
	                            });
	                            const { list, skillMap } = get.event();
	                            //算出来需要多少列，最多八列
	                            const num = 8;
	                            const column = Math.min(list.length, num);
	                            if (column > 6) {
	                                dialog.css({
	                                    width: "100%",
	                                    left: 0,
	                                });
	                            }
	                            //重新创建一个容器，不然css之后会导致dialog.content内的其他元素也加入到布局中
	                            const contentx = ui.create.div(".content", dialog.content);
	                            contentx.css({
	                                display: "grid",
	                                gridTemplateColumns: `repeat(${column}, 1fr)`,
	                                width: "fit-content",
	                                margin: "auto",
	                            });
	                            //一个一个塞进去
	                            for (const i of list) {
	                                const div = ui.create.div(".buttons", contentx);
	                                const button = ui.create.button(i, "character", div);
	                                button.link = i;
	                                dialog.buttons = dialog.buttons.concat(button);
	                                const skills = skillMap[i];
	                                //让角色和技能按钮水平居中垂直排列
	                                div.css({
	                                    display: "flex",
	                                    flexDirection: "column",
	                                    alignItems: "center",
	                                });
	                                //角色因为不是可选按钮所以需要调整一下透明度
	                                button.style.setProperty("opacity", "1", "important");
	                                if (skills.length) {
	                                    //创建技能按钮
	                                    const buttons = ui.create.buttons(
	                                        skills.map(i => [i, get.translation(i)]),
	                                        "tdnodes",
	                                        div
	                                    );
	                                    for (const button of buttons) {
	                                    	button.setNodeIntro(get.translation(button.link), get.skillInfoTranslation(button.link));
	                                    	button.link = i;
	                                    }
	                                    //丢进可选按钮中
	                                    dialog.buttons = dialog.buttons.concat(buttons);
	                                }
	                            }
	                        },
	                        "handle",
	                    ],
	                ],
	            )
	            .set("list", list.slice())
	            .set("skillMap", skillMap)
	            .set("ai", button => {
					const player = get.player();
					return lib.skill.mjsdunjiatianshu.getNum(button.link);
				})
	            .forResult();
			if (event.result?.bool) {
				event.result.cost_data = event.result.links;
			}
		},
		async content(event, trigger, player) {
			const [character] = event.cost_data;
			_status.characterlist.removeArray(event.cost_data);
			player.flashAvatar(event.name, event.cost_data);
			const skills = get.character(character)?.skills;
			if (skills.length) {
				await player.addTempSkills(skills, { player: "phaseBefore" });
			}
		},
		getNum(name) {
			let num = 0;
			switch (game.getRarity(name)) {
				case "junk":
					num = 1;
					break;
				case "rare":
					num = 2;
					break;
				case "epic":
					num = 3;
					break;
				case "legend":
					num = 4;
					break;
			}
			return num;
		},
	},
	/**飞升太虚
	 * 游戏开始和回合开始时，卜卦2次，根据点数依次确定你当前的体力值和手牌上限。
	 * 1.每个回合卜卦确定的体力值会同时改变体力值和体力上限，也就是即使当前是1点体力，如果卜卦是8点的话，体力上限与体力值都会立即变为8点，反过来也是。
	 * 2.如果卜卦的牌没有点数（比如符水牌），则代表0，也就是说，如果第一次卜卦为没有点数的牌，则体力值和体力上限变为0，直接阵亡，如果是第二次卜卦为没有点数的牌，则手牌上限变为0。
	 * 天循能腾云跨风，飞升太虚；地循能穿山透石；人遁能云游四海，藏形变身，飞剑掷刀，取人首级。大王位极人臣，何不退步，跟贫道往峨嵋山中修行？当以三卷天书相绶。——《三国演义·第六十八回》
	 * */
	mjsfeishengtaixu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseBegin"],
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		filter(event, player, name) {
			return name != "phaseBefore" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const result = await player.judge(card => get.number(card)).forResult();
			var num = result.number;
			if (typeof num !== "number") {
				num = 0;
			}
			//可以触发体力变化的时机
			/*player.maxHp = num;
			player.hp = num;
			player.update();*/
			//体力上限
			const delt = player.maxHp - num;
			if (delt > 0) {
				await player.loseMaxHp(delt);
			} else if (delt < 0) {
				await player.gainMaxHp(-delt);
			}
			const delt2 = player.hp - num;
			if (delt2 != 0) {
				await player.changeHp(-delt2);
			}
			//手牌上限
			const result2 = await player.judge(card => get.number(card)).forResult();
			var num2 = result2.number;
			if (typeof num !== "number") {
				num2 = 0;
			}
			player.addSkill("mjsfeishengtaixu_max");
			player.setStorage("mjsfeishengtaixu_max", num2);
			player.update();
		},
		subSkill: {
			max: {
				charlotte: true,
				mod: {
					maxHandcardFinal(player, num) {
						const info = player.storage?.mjsfeishengtaixu_max;
						if (typeof info !== "number") return;
						return info;
					},
				},
			},
		},
		ai: {
			skill_tag: ["卜卦"],
		},
	},
	//貂蝉
	/**隔帘送目
	 * 出牌阶段限1次，你可以令一名男性角色对你选择的另一名男性角色打出1张具有强命的杀，否则令其随机弃置1张牌并失去1点体力。
	 * 1.失去体力不算是受到伤害，不会触发受伤相关的技能，也没有伤害来源。
	 * 2.此技能不检查攻击范围，也就是选择的出杀的角色后，可以选择任意其他的另一名男性角色。
	 * 卓方食，布偷目窃望，见绣帘内一女子往来观觑，微露半面，以目送情。布知是貂蝉，神魂飘荡。卓见布如此光景，心中疑忌，曰：“奉先无事且退。”布怏怏而出。——《三国演义·第八回》
	 * */
	mjsgeliansongmu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["输出", "控制"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(current => current != player && current.hasSex("male")) > 1;
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			if (!target.hasSex("male")) {
				return false;
			}
			if (ui.selected.targets.length == 1) {
				return target.canUse({ name: "sha" }, ui.selected.targets[0]);
			}
			return true;
		},
		targetprompt: ["使用来源", "目标角色"],
		selectTarget: 2,
		multitarget: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.chooseToUse(
					`对${get.translation(event.targets[1])}使用一张杀，或随机弃置1张牌并失去1点体力`,
					function (card) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.filterTarget.apply(this, arguments);
					}
				)
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("ai2", function () {
					return get.effect_use.apply(this, arguments) - get.event().effect;
				})
				.set("effect", get.effect(target, { name: "losehp" }, target, target))
				.set("addCount", false)
				.set("oncard", () => {
					_status.event.directHit.addArray(game.filterPlayer());
				})
				.set("sourcex", event.targets[1])
				.forResult();
			if (!result?.bool) {
				const cards = target.getCards("h", card => {
					return lib.filter.cardDiscardable(card, target, "mjsgeliansongmu");
				});
				if (cards.length > 0) {
					await target.discard(cards.randomGets(1)).set("discarder", target);
				}
				await target.loseHp();
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (!ui.selected.targets.length) {
						return -3;
					} else {
						return get.effect(target, { name: "sha" }, ui.selected.targets[0], target);
					}
				},
			},
			expose: 0.4,
			threaten: 3,
		},
	},
	/**闭月之姿
	 * 回合结束时，摸2张牌，然后可以打出其中1张牌。
	 * 回合结束时，摸2张牌。
	 * 这个技能的效果很简单...不需要详细解释。
	 * 貂蝉于后园拜月，忽有轻风吹动，浮云隐皓月之辉。王允目睹此景，欲显其美，遂言：“吾女与月争艳，月自愧弗如。”后以“闭月”代指貂蝉。
	 * */
	mjsbiyuezhizi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: "phaseEnd",
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const result = await player.draw(2).forResult();
			if (get.itemtype(result.cards) == "cards") {
				await player.chooseToUse({
					filterCard(card) {
						if (get.itemtype(card) != "card" || !get.event().cards.includes(card)) {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					prompt: "闭月之姿：你可以使用一张牌",
					addCount: false,
					cards: result.cards,
				});
			}
		},
		ai: {
			threaten: 0.6,
		},
	},
	//袁绍
	/**四世三公
	 * 初始手牌+4，手牌上限+3。
	 * 这个技能的效果很简单...不需要详细解释。
	 * 高祖父安，为汉司徒。自安以下四世居三公位，由是势倾天下。——《三国志·袁绍传》
	 * */
	mjssishisangong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		audioname: ["mjs_yuanshu"],
		skill_tag: ["增益"],
		mod: {
			maxHandcard: (player, num) => num + 3,
		},
		trigger: {
			global: "gameDrawBegin",
			player: "phaseDiscardBefore",
		},
		silent: true,
		popup: false,
		forced: true,
		locked: false,
		content() {
			if (trigger.name == "phaseDiscard") {
				return;
			}
			const me = player,
				numx = trigger.num;
			trigger.num = function (player) {
				return (typeof numx == "function" ? numx(player) : numx) + (player === me ? 4 : 0);
			};
		},
	},
	/**百万雄兵
	 * 出牌阶段开始时，若你的手牌数全场最多，将手牌中的战法牌转化为万箭齐发。
	 * 只要手牌数是全场最多之一就可以发动。
	 * 横大河之北，合四州之地，收英雄之才，拥百万之众，迎大驾于西京，复宗庙于洛邑，号令天下，以讨未复，以此争锋，谁能敌之？——《三国志·袁绍传》
	 * */
	mjsbaiwanxiongbing: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: "phaseUseBegin",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (!player.isMaxHandcard()) {
				return false;
			}
			return player.countCards("h", card => get.type2(card) == "trick");
		},
		async content(event, trigger, player) {
			const cards = player.getCards("h", card => get.type2(card) == "trick");
			for (const card of cards) {
				game.broadcastAll(function (card) {
					card.init([card.suit, card.number, "wanjian"]);
				}, card);
			}
		},
	},
	/**幅巾风流
	 * 每打出3张装备牌，手牌上限+1。
	 * 手牌上限+1的效果持续到游戏结束。
	 * 昔袁绍与魏武帝战于官渡，军败，复巾渡河，遁相仿效，因以成俗。——《大唐新语》
	 * */
	mjsfujinfengliu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event._mjsfujinfengliu;
		},
		async content(event, trigger, player) {
			lib.skill.mjsallmax.change(player, 1);
		},
		intro: {
			markcount(storage, player) {
				return player.countMark("mjsfujinfengliu_counter");
			},
			content(storage, player) {
				return `已打出过${get.cnNumber(player.countMark("mjsfujinfengliu_counter"))}张装备牌`;
			},
		},
		group: "mjsfujinfengliu_counter",
		subSkill: {
			counter: {
				trigger: {
					player: ["useCard1", "respond"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return get.type(event.card) == "equip";
				},
				async content(event, trigger, player) {
					player.addMark("mjsfujinfengliu_counter", 1, false);
					if (player.countMark("mjsfujinfengliu_counter") % 3 === 0) {
						trigger._mjsfujinfengliu = true;
					}
					player.markSkill("mjsfujinfengliu");
				},
			},
		},
	},
	//吕布
	/**无双飞将
	 * 你将获得的战法牌转化为2张杀。你的杀具有强命。
	 * 1.转化的效果持续到本局游戏结束（转化效果实际上是先销毁目标牌，再添加新的牌）。
	 * 2.具有强命的杀无法被抵消，即使目标装备了玄武盾，也无法用杀抵消。
	 * 3.任何方式获得的战法牌都会被转化为2张杀，也包括初始手牌（但是在战斗开始前的更换手牌阶段，此技能不会生效）。
	 * 4.转化获得的2张杀，算是吕布获得了牌。
	 * 温侯吕布世无比，雄才四海夸英伟。护躯银铠砌龙鳞，束发金冠簪雉尾。参差宝带兽平吞，错落锦袍飞凤起。龙驹跳踏起天风，画戟荧煌射秋水。出关搦战谁敢当？诸侯胆裂心惶惶。——《三国演义·第五回》
	 * */
	mjswushuangfeijiang: {
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjswushuangfeijiang" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		nobracket: true,
		skill_tag: ["增益"],
		trigger: {
			player: ["gainAfter", "useCard"],
			global: "loseAsyncAfter",
		},
		popup: false,
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "useCard") return event.card.name == "sha";
			return event.getg && event.getg(player)?.some(card => get.type2(card) == "trick");
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
				trigger.directHit.addArray(game.filterPlayer());
				return;
			}
			/**转化效果的结算规则调整
			 * 调整前：转化效果是将目标牌销毁，然后再添加转换后的牌
			 * 调整后：转换效果是一个独立的动作，是直接修改目标牌的某个属性，而不会销毁目标牌。
			 * （特殊情况，当1张牌转换为多张牌时，第1张牌是转换，第2张牌则是按一定规则添加，比如吕布的无双飞将，战法牌转换的第1张杀，是直接修改原战法牌的牌名，而第2张杀则是添加了1张杀，并且随机点数和花色。）
			 * 来自TapTap[ID:705970319 烙饼]250925
			 * */
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			const cards = trigger.getg(player).filter(card => get.type2(card) == "trick");
			const cardList = [];
			for (const card of cards) {
				game.broadcastAll(function (card) {
					card.init([card.suit, card.number, "sha"]);
				}, card);
				const cardx = game.createCard("sha", lib.suit.randomGet(), get.rand(1, 8));
				if (cardx) cardList.push(cardx);
			}
			if (cardList.length) {
				await player.gain(cardList, "draw");
			}
		},
		group: "mjswushuangfeijiang_init",
		subSkill: {
			init: {
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					const cardList = [];
					const cards = player.getCards("h", card => get.type2(card) == "trick");
					for (const card of cards) {
						game.broadcastAll(function (card) {
							card.init([card.suit, card.number, "sha"]);
						}, card);
						const cardx = game.createCard("sha", lib.suit.randomGet(), get.rand(1, 8));
						if (cardx) cardList.push(cardx);
					}
					if (cardList.length) {
						await player.gain(cardList, "draw");
					}
				},
			},
		},
	},
	/**狼子野心
	 * 杀伤，你可以令攻击范围内的另外一名其他角色交给你2张牌，否则你可以对其打出1张杀。
	 * 1.可以选择攻击范围内的任意另外一名其他角色，即使目标没有牌也可以选择（意味着肯定可以对这个目标打出杀）。
	 * 2.此技能额外打出的杀不会计入出杀次数。
	 * 陈登密谏操曰：“吕布豺狼也，勇而无谋，轻于去就，宜早图之。”操曰：“吾素知吕布狼子野心，诚难久养。非公父子莫能究其情，公当与吾谋之。”——《三国演义·第十六回》
	 * */
	mjslangziyexin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			source: "damageSource",
		},
		popup: false,
		filter(event, player) {
			return event.card?.name == "sha";
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					const trigger = _status.event.getTrigger();
					if (trigger.player == target) {
						return false;
					}
					return player.inRange(target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const result = await target
				.chooseToGive(`交给${get.translation(player)}2张牌，否则其可以对你打出1张杀`, player, "he", 2)
				.set("ai", card => {
					const { player, sourcex } = get.event();
					if (!sourcex.hasSha()) return 0;
					return 2 - get.value(card);
				})
				.set("sourcex", player)
				.forResult();
			if (!result?.bool) {
				await player
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"狼子野心：是否对" + get.translation(target) + "使用一张杀？"
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
					.set("addCount", false)
					.set("sourcex", target);
			}
		},
	},
	/**辕门射戟
	 * 限定，其他角色成为杀的目标时，你可以打出1张杀，令其无效。
	 * 1.此技能与成为杀的目标的闪的操作共用相同的询问时机（类似识破），以最先响应打出的牌为准。
	 * 2.此技能也无法抵消具有强命效果的杀。
	 * 酒毕。布教取弓箭来。玄德暗祝曰：“只愿他射得中便好！”只见吕布挽起袍袖，搭上箭，扯满弓，叫一声“著！”正是：弓开如秋月行天，箭去似流星落地，一箭正中画戟小枝。帐上帐下将校，齐声喝采。后人有诗赞之曰：温侯神射世间稀，曾向辕门独解危。落日果然欺后羿，号猿直欲胜由基。——《三国演义·第十六回》
	 * */
	mjsyuanmensheji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制"],
		trigger: {
			global: "useCardToTarget",
		},
		limited: true,
		filter(event, player) {
			if (event.card.name != "sha") return false;
			if (event.getParent().directHit?.includes(event.target)) return false;
			return event.target != player && (player.hasSha() || (_status.connectMode && player.countCards("hs") > 0));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill, trigger.target), card => {
					const player = _status.event.player;
					if (card.name != "sha") {
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
					const player = _status.event.player;
					const trigger = _status.event.getTrigger();
					const attitude = get.attitude(player, trigger.player);
					return 8 - get.value(card);
				})
				.forResult();
		},
		logTarget: "target",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const chooseCardResultCards = event.cards;
			await player.respond(chooseCardResultCards);
			await game.delay();
			trigger.targets.remove(trigger.target);
			trigger.getParent().triggeredTargets2.remove(trigger.target);
			trigger.untrigger();
		},
	},
	//陈胜
	/**篝火狐鸣
	 * 向牌堆中洗入7张狐鸣。
	 * 狐鸣：获得时自动打出，随机交给加此牌的角色2张手牌或装备牌，若其不在场，随机弃置2张牌，打出后此牌销毁。
	 * 狐鸣牌没有点数和花色。
	 * 又间令吴广之次所旁丛祠中，夜篝火，狐鸣呼曰“大楚兴，陈胜王”。卒皆夜惊恐。旦日，卒中往往语，皆指目陈胜。——《史记·陈涉世家》
	 * */
	mjsgouhuohuming: {
		audio: "ext:名将杀/audio/skill:1",
		nobracket: true,
		skill_tag: ["控制", "增益"],
		getNum: 7,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async addAvatarBadgeToCard(player, card) {
			// @萌新转型中
			let src;
		    await new Promise(async (resolve) => {
		        const bgImage = player.node?.avatar?.style?.backgroundImage;
		        const matches = bgImage?.matchAll(/url\(["']?([^"')]+)["']?\)/g);
		        if (matches) {
		            for (const match of matches) {
		                if (!match[1]) continue;
		                try {
		                    await new Promise((赤子青荒, 天地万法) => {
		                        const testImg = new Image();
		                        testImg.onload = 赤子青荒;
		                        testImg.onerror = 天地万法;
		                        testImg.src = match[1];
		                    });
		                    src = match[1];
		                    break;
		                }
		                catch (南华老仙) {
		                    continue;
		                }
		            }
		        }
		        resolve();
		    });
		    if (src) {
		        const node = document.createElement("div");
		        node.style.position = "absolute";
		        node.style.left = "50%";
		        node.style.top = "50%";
		        node.style.transform = "translate(-50%, -50%)";
		        node.style.width = "30px";
		        node.style.height = "30px";
		        node.style.backgroundImage = `url(${src})`;
		        node.style.backgroundSize = "200% auto";
		        node.style.backgroundPosition = "50% 10%";
		        node.style.borderRadius = "50%";
		        node.style.pointerEvents = "none";
		        card.node.image.appendChild(node);
		    }
		},
		async content(event, trigger, player) {
			const cards = [];
			while (cards.length < 7) {
				const card = game.createCard2("mjshuming", "none", 0);
				if (card) {
					card.destroyed = (card, targetPosition, player, event) => targetPosition == "discardPile";
					card._mjsgouhuohuming_owner = player;
					//const name = player.getName(true);
					//game.createButtonCardsetion(name, card);
					lib.skill.mjsgouhuohuming.addAvatarBadgeToCard(player, card);
					cards.push(card);
				} else {
					break;
				}
			}
			if (!cards.length) {
				return;
			}
			game.log(player, "向牌堆中洗入7张", "#y【狐鸣】", "牌");
			player.$throw(cards, 1000);
			//_status._mjschenshengwang = player;
			await game.cardsGotoPile(cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});
		},
	},
	/**宁有种乎
	 * 限定，令所有角色摸牌至与全场手牌最多的角色相同。
	 * 按照技能发动时的“全场手牌最多”数量进行计算
	 * 召令徒属曰:“公等遇雨，皆已失期，失期当斩。藉弟令毋斩，而戍死者固十六七。且壮士不死即已，死即举大名耳，王侯将相宁有种乎!”——《史记·陈涉世家》
	 * */
	mjsningyouzhonghu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		enable: "phaseUse",
		limited: true,
		filter(event, player) {
			return true;
			return game.hasPlayer(target => {
				return target.isMaxHandcard();
			});
		},
		filterTarget(card, player, target) {
			return !target.isMaxHandcard();
		},
		selectTarget: -1,
		complexTarget: true,
		multitarget: true,
		line: false,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const current = game.findPlayer(target => target.isMaxHandcard());
			if (!current?.isIn()) return;
			const num = current.countCards("h");
			const func = async target => {
				await target.drawTo(num);
			};
			await game.doAsyncInOrder(event.targets, func);
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					let eff = 1;
					const target = game.findPlayer(current => current.isMaxHandcard());
					if (!target?.isIn()) return 0;
					game.countPlayer(current => {
						const att = get.attitude(player, current),
							delt = Math.max(0, target.countCards("h") - current.countCards("h"));
						eff -= att * delt;
					});
					return eff > 0 ? 1 : 0;
				},
			},
		},
	},
	/**揭竿而起
	 * 限定，当你的体力值变为1时，你可以摸3张牌，获得技能伐无道，然后立即进行回合。
	 * 1.即使体力值不是首次变为1，也可以发动此技能。
	 * 2.“立即进行回合”会终止所有正在进行的结算。
	 * 然陈涉瓮牖绳枢之子，氓隶之人，而迁徙之徒也;才能不及中人，非有仲尼、墨翟之贤，陶朱、猗顿之富;蹑足行伍之间，而倔起阡陌之中，率疲弊之卒，将数百之众，转而攻秦，斩木为兵，揭竿为旗，天下云集响应，赢粮而景从。山东豪俊遂并起而亡秦族矣。——《过秦论》
	 * */
	mjsjieganerqi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制", "增益"],
		derivation: "mjsfawudao",
		trigger: {
			player: "changeHpEnd",
		},
		limited: true,
		filter(event, player) {
			return player.hp == 1;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.draw(3);
			const createSkills = mjs.addCreateSkills("mjsfawudao");
			await player.addSkills(createSkills);
			const evt = trigger.getParent("phase", true);
			if (evt) {
				game.log(_status.currentPhase, "结束了回合");
				evt.num = evt.phaseList.length;
				evt.goto(11);
			}
			const next = player.insertPhase();
			trigger.next.remove(next);
			trigger.getParent().next.push(next);
		},
	},
	/**伐无道
	 * 你对本局游戏累计造成伤害最多的角色造成的所有伤害+1。
	 * */
	mjsfawudao: {
		audio: "ext:名将杀/audio/skill:1",
		nobracket: true,
		skill_tag: ["增益"],
		init: player => {
			game.addGlobalSkill("mjsfawudao_global");
		},
		onremove: player => {
			if (!game.hasPlayer(current => current.hasSkill("mjsfawudao", null, null, false), true)) {
				game.removeGlobalSkill("mjsfawudao_global");
			}
		},
		trigger: {
			source: "damageBegin1",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return !game.hasPlayer(target => {
				if (target == event.player) return false;
				return target.getAllHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0) > event.player.getAllHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0);
			});
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
		subSkill: {
			mark: {
				name: "暴",
				intro: {
					content: "你为本局游戏累计造成伤害最多的角色",
				},
			},
			global: {
				trigger: {
					source: "damageSource",
				},
				silent: true,
				filter(event, player) {
					return !game.hasPlayer(target => {
						if (target == player) return false;
						return target.getAllHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0) > player.getAllHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0);
					});
				},
				async content(event, trigger, player) {
					for (const target of game.filterPlayer()) {
						target.unmarkSkill("mjsfawudao_mark");
					}
					player.markSkill("mjsfawudao_mark");
				},
			},
		},
	},
	//周勃
	/**箫奏挽歌
	 * 当其他角色阵亡后，你可以摸2张牌，然后立即进行1个出牌阶段。
	 * 1.在此出牌阶段结束后，返回之前的阶段继续进行。
	 * 2.如果在此出牌阶段有其他角色阵亡，可以再次发动此技能获得新的出牌阶段，并且在新的出牌阶段结束后，返回前一个出牌阶段。
	 * 绛侯周勃者，沛人也。其先卷人，徙沛。勃以织薄曲为生，常为人吹萧给丧事，材官引强。——《史记·绛侯周勃世家》
	 * */
	mjsxiaozouwange: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "dieAfter",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return event.player != player;
		},
		async content(event, trigger, player) {
			await player.draw(2);
			//不结束当前回合
			/*const evt = trigger.getParent("phase", true);
			if (evt) {
				game.log(_status.currentPhase, "结束了回合");
				evt.num = evt.phaseList.length;
				evt.goto(11);
			}*/
			const next = player.phaseUse();
			trigger.next.remove(next);
			trigger.getParent().next.push(next);
		},
	},
	/**削平诸吕
	 * 你的回合限1次，摸牌至与全场手牌最多的角色相同，本回合下一次造成的伤害+1，出牌阶段结束时，弃置因此技能获得的牌。
	 * 1.增伤的效果在本回合下一次造成伤害前，会一直持续，并且可以叠加。
	 * 2.出牌阶段结束时，只弃置手牌中剩余的因此技能获得的牌。
	 * 勃为太尉，不得入军门。陈平为丞相，不得任事。於是勃与平谋，卒诛诸吕而立孝文皇帝。——《史记·绛侯周勃世家》
	 * */
	mjsxuepingzhulv: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌", "增益"],
		mod: {
			aiOrder(player, card, num) {
				if (!get.is.damageCard(card)) {
					return num / 10;
				}
				if (get.type(card) === "equip") {
					return num + 5;
				}
			},
		},
		enable: "phaseUse",
		locked: false,
		async content(event, trigger, player) {
			//实际是你的回合每轮限一次
			player.tempBanSkill(event.name, "roundStart", false);
			const skill = event.name + "_effect";
			const target = game.findPlayer(current => current.isMaxHandcard());
			if (target?.isIn()) {
				const num = target.countCards("h");
				const result = await player.drawTo(num).forResult();
				if (get.itemtype(result.cards) == "cards") {
					player.addGaintag(result.cards, "eternal_mjsxuepingzhulv_tag");
					player
						.when("phaseUseAfter")
						.then(async () => {
							const cards = player.getCards("he", card => result.cards.includes(card));
							if (cards.length) {
								player.discard(cards);
							}
							game.broadcastAll(
								cards => {
									for (const card of cards) {
										card.removeGaintag("eternal_mjsxuepingzhulv_tag");
									}
								},
								result.cards
							);
						});
				}
			}
			player.addTempSkill(skill);
			player.addMark(skill, 1, false);
		},
		ai: {
			order(item, player) {
				if (player && get.event().type == "phase") {
					let list = player.getCards("h", card => get.is.damageCard(card) && player.getUseValue(card, true, true) > 0);
					if (list.length) {
						list.sort((a, b) => (player.getUseValue(b, true, true) || 0) - (player.getUseValue(a, true, true) || 0));
						return get.order(list[0], player) * 0.99;
					}
				}
				return get.order({ name: "sha" }) + 0.1;
			},
			result: {
				player(player) {
					return 1;
				},
			},
		},
		subSkill: {
			tag: {
				name: "削",
			},
			effect: {
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				locked: false,
				charlotte: true,
				onremove: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				mark: true,
				marktext: "削",
				intro: {
					content: "下一次造成的伤害+#",
				},
			},
		},
	},
	//樊哙
	/**先登
	 * 当有角色的体力值变为1时，你可以对其打出1张杀，若目标因此阵亡，你摸3张牌。
	 * 1.“体力值变为1”不仅包括“受到伤害”还包括“体力回复”导致的体力值变化。
	 * 2.若技能触发导致除目标以外的角色阵亡，则不触发因本技能触发的摸牌效果。
	 * 常从，沛公击章邯军濮阳，攻城先登，斩首二十三级，赐爵列大夫。复常从，从攻城阳，先登。下户牖，破李由军，斩首十六级，赐上闲爵。从攻围东郡守尉于成武，却敌，斩首十四级，捕虏十一人，赐爵五大夫。从击秦军，出亳南。河闲守军于杠里，破之。击破赵贲军开封北，以却敌先登，斩候一人，首六十八级，捕虏二十七人，赐爵卿。从攻破杨熊军于曲遇。攻宛陵，先登，斩首八级，捕虏四十四人，赐爵封号贤成君。——《史记·樊哙列传》
	 * */
	mjsxiandeng: {
		audio: "ext:名将杀/audio/skill:3",
		skill_tag: ["输出", "摸牌"],
		trigger: {
			global: "changeHpEnd",
		},
		filter(event, player) {
			return event.player.isIn() && event.player.hp == 1 && lib.filter.targetEnabled({ name: "sha" }, player, event.player) && (player.hasSha() || (_status.connectMode && player.countCards("hs") > 0));
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseToUse(get.prompt(event.skill, trigger.player))
				.set("filterCard", function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				})
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("sourcex", trigger.player)
				.set("addCount", false)
				.set("chooseonly", true)
				.forResult();
			event.result = { bool: result.bool, cost_data: { result } };
		},
		async content(event, trigger, player) {
			const {
				cost_data: { result },
			} = event;
			await player.useResult(result, event);
			if (
				game.getGlobalHistory("everything", evt => {
					if (evt.name != "die" || evt.player != result.targets[0]) {
						return false;
					}
					return evt.reason?.getParent(event.name) == event;
				}).length > 0
			) {
				player.draw(3);
			}
		},
	},
	/**排闼直入
	 * 回合开始时，你可以查看攻击范围内一名有手牌的其他角色的手牌，并打出其中一张，若其手牌均无法打出，你可以对其造成1点伤害。
	 * 在有可打出的牌而选择不打出的情况下，则不触发“对其造成1点伤害”
	 * 先黥布反时，高祖尝病甚，恶见人，卧禁中，诏户者无得入群臣。群臣绛、灌等莫敢入。十馀日，哙乃排闼直入，大臣随之。上独枕一宦者卧。哙等见上流涕曰：“始陛下与臣等起丰沛，定天下，何其壮也！今天下已定，又何惫也！且陛下病甚，大臣震恐，不见臣等计事，顾独与一宦者绝乎？且陛下独不见赵高之事乎？”高帝笑而起。——《史记·樊哙列传》
	 * */
	mjspaitazhiru: {
		audio: "ext:名将杀/audio/skill:2",
		nobracket: true,
		skill_tag: ["控制", "输出"],
		trigger: {
			player: "phaseBegin",
		},
		popup: false,
		filter(event, player) {
			return game.hasPlayer(target => {
				if (!player.inRange(target)) return false;
				return target != player && target.countCards("h");
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					if (!player.inRange(target)) return false;
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att <= 0) return -target.countCards("h");
					return target.countCards("h") / 2;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			if (!target.countCards("h")) return;
			const cards = target.getCards("h");
			const cards2 = cards.filter(card => {
				/*var cardx = {
					name: get.name(card, get.owner(card)),
					nature: get.nature(card, get.owner(card)),
					cards: [card],
				};*/
				var cardx = card;
				return player.hasUseTarget(cardx, null, false);
			});
			const result = await player
				.chooseButton(["###排闼直入###是否使用其中一张牌", cards])
				.set("filterButton", button => {
					return get.event().cards.includes(button.link);
				})
				.set("cards", cards2)
				.set("ai", button => {
					var card = button.link;
					return _status.event.player.getUseValue(card);
				})
				.forResult();
			if (!cards2.length) {
				const { bool } = await player
					.chooseBool(`你可以对${get.translation(target)}造成1点伤害`)
					.set("ai", () => {
						return get.event().eff > 0;
					})
					.set("eff", get.damageEffect(target, player, player))
					.forResult();
				if (bool) {
					await target.damage();
				}
				return;
			}
			if (result?.bool) {
				var card = result.links[0];
				/*var cardx = {
					name: get.name(card, get.owner(card)),
					nature: get.nature(card, get.owner(card)),
					cards: [card],
				};
				var next = player.chooseUseTarget(cardx, [card], true, false);
				if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
					next.viewAs = false;
				}*/
				await player.chooseUseTarget(card, true, false);
			}
		},
	},
	//陈平
	/**六出奇计
	 * 出牌阶段开始时/应战，你可以将1张未选择过的专属战法牌添加到手牌，直到每张专属战法牌都选择后重置此技能。
	 * 捐金反间:将此牌交给一名其他角色，令其受到你选择的另外一名其他角色造成的1点伤害
	 * 恶草近使:令一名其他角色随机弃置2张闪
	 * 夜解荥阳:令一名其他角色随机弃置2张杀
	 * 蹑足稳心:令一名其他角色交给你选择的另一名其他角色1张手牌或装备牌，然后回复1点体力
	 * 游云梦泽:选择一名其他角色，使另一名其他角色随机从其手牌或装备牌中获得2张牌
	 * 白登解围:令一名其他角色直到其下个回合开始，无法被选择为杀的目标
	 * 1.同时满足手牌数和体力值为全场最低时，也只触发一次技能效果；
	 * 2.陈平的“专属战法牌”通常情况下不会进入到弃牌堆；
	 * 3.专属战法-捐金反间：并不是由此牌造成伤害，伤害来源为指定的目标；
	 * 4.专属战法-恶草近使：可以对没有牌的角色使用；
	 * 5.专属战法-夜解荥阳：可以对没有牌的角色使用；
	 * 6.专属战法-蹑足稳心：如果不交出牌的话，将不执行“回复体力”动作；
	 * 7.专属战法-游云梦泽：如果手牌+装备牌为1张牌，也将给出；
	 * 8.专属战法-白登解围：该目标在此技能效果下不可被选中成为“杀”的目标。
	 * 于是乃诏御史，更以陈平为曲逆侯，尽食之，除前所食户牖。其后常以护军中尉从攻陈豨及黥布。凡六出奇计，辄益邑，凡六益封。奇计或颇秘，世莫能闻也。——《史记·陈丞相世家》
	 * */
	mjsliuchuqiji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:8",
		logAudio: index => "ext:名将杀/audio/skill/mjsliuchuqiji" + (typeof index === "number" ? index : get.rand(1, 8)) + ".mp3",
		derivation: "mjsliuchuqiji_faq",
		getList: ["mjsjuanjinfanjian", "mjsecaojinshi", "mjsyejiexingyang", "mjsniezuwenxin", "mjsyouyunmengze", "mjsbaidengjiewei"],
		skill_tag: ["增益"],
		trigger: {
			player: "phaseUseBegin",
			target: "useCardToTarget",
		},
		popup: false,
		filter(event, player) {
			return event.name == "phaseUse" || event.card?.name == "sha";
		},
		async cost(event, trigger, player) {
			const list = lib.skill[event.skill].getList
				.filter(name => {
					return !player.hasStorage("mjsliuchuqiji", name);
				})
				.randomGets(3);
			const cards = [];
			for (const name of list) {
				const card = get.cardPile(name, "field") || game.createCard2(name, lib.suit.randomGet(), get.rand(1, 8));
				if (card) cards.push(card);
			}
			if (!cards.length) return;
			event.result = await player
				.chooseButton([get.translation(event.skill), cards])
				.set("ai", button => {
					const player = get.player();
					return player.getUseValue(button.link) + 1;
				})
				.forResult();
			if (event.result?.bool) {
				event.result.cards = event.result.links;
			}
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			const cards = event.cards;
			player.markAuto(
				event.name,
				cards.reduce((list, card) => list.add(card.name), [])
			);
			if (player.getStorage(event.name).containsAll(...lib.skill[event.name].getList)) {
				delete player.storage[event.name];
			}
			await player.gain(cards, "draw");
		},
		ai: {
			yingzhan: true,
		},
	},
	/**挂席为门
	 * 当你的手牌数全场最低时，你无法成为其他角色战法牌的目标，并且其他角色打出战法牌后，你可以获得一张此牌的复制。
	 * 1.手牌数为全场最低“之一”，技能也会生效；
	 * 2.“复制牌”的点数、花色、名称会和“原版”一样。
	 * 3.此技能触发生效的时机点在目标战法牌“结算完成后”。
	 * 张负既见之丧所，独视伟平，平亦以故后去。负随平至其家，家乃负郭穷巷，以弊席为门，然门外多有长者车辙。——《史记·陈丞相世家》
	 * */
	mjsguaxiweimen: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["防御", "增益"],
		mod: {
			targetEnabled(card, player, target, now) {
				if (target == player) return;
				if (target.isMinHandcard()) {
					if (get.type2(card) == "trick") {
						return false;
					}
				}
			},
		},
		trigger: {
			global: "useCardAfter",
		},
		locked: false,
		filter(event, player) {
			if (!player.isMinHandcard()) return false;
			if (!event.cards?.length) return false;
			if (get.is.virtualCard(event.card) || get.is.convertedCard(event.card)) return false;
			return event.player != player && get.type(event.card) == "trick";
		},
		prompt2(event, player) {
			return `你可以获得一张${get.translation(event.card)}的复制`;
		},
		async content(event, trigger, player) {
			const { card } = trigger;
			const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
			if (cardx) {
				await player.gain(cardx, "gain2");
			}
		},
	},
	//韩信
	/**十面埋伏
	 * 你可以将任意张牌设为埋伏，当其他角色打出牌时，你可以弃置1张同名的埋伏牌，然后摸1张牌并可以立即对其打出1张杀。
	 * 1.可以将装备牌也设置成埋伏牌（但是注意，标准牌堆中，每个装备牌都只有1张，没有同名牌，所以如果把装备牌设为埋伏牌，是无法触发后续效果的）。
	 * 2.在出牌阶段内可以多次发动这个技能，每次可以选择任意张，非常灵活。
	 * 项王军壁垓下，兵少食尽，汉军及诸侯兵围之数重。夜闻汉军四面皆楚歌，项王乃大惊曰：“汉皆已得楚乎？是何楚人之多也！”项王则夜起，饮帐中。——《史记·项羽本纪》
	 * */
	mjsshimianmaifu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		position: "he",
		filter(event, player) {
			return player.countCards("he");
		},
		filterCard: true,
		selectCard: [1, Infinity],
		check(card) {
			const player = get.player();
			return 8 - player.getUseValue(card);
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const next = player.addToExpansion(event.cards, player, "give");
			next.gaintag.add(event.name);
			await next;
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
			order: 1,
			result: {
				player(player) {
					return 1;
				},
			},
		},
		group: "mjsshimianmaifu_use",
		subSkill: {
			use: {
				trigger: {
					global: ["useCard", "respond"],
				},
				filter(event, player) {
					if (event.player == player) return false;
					return player.getExpansions("mjsshimianmaifu").some(card => card.name == event.card.name);
				},
				async cost(event, trigger, player) {
					const cards = player.getExpansions("mjsshimianmaifu");
					if (!cards.length) return;
					event.result = await player
						.chooseCardButton(`###${get.translation(event.skill)}###你可以弃置1张埋伏牌，然后摸1张牌并可以立即对${get.translation(trigger.player)}打出1张杀`, cards)
						.set("filterButton", card => {
							const trigger = _status.event.getTrigger();
							return card.name == trigger.card.name;
						})
						.set("ai", button => {
							const player = get.player();
							const trigger = _status.event.getTrigger();
							return get.effect(player, { name: "draw" }, player, player) + get.effect(trigger.player, { name: "sha" }, player) > 0;
						})
						.forResult();
					if (event.result?.bool) {
						event.result.cards = event.result.links;
					}
				},
				logTarget: "player",
				async content(event, trigger, player) {
					await player.loseToDiscardpile(event.cards);
					await player.draw();
					await player
						.chooseToUse(
							function (card, player, event) {
								if (get.name(card) != "sha") {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							},
							"十面埋伏：是否对" + get.translation(trigger.player) + "使用一张杀？"
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
						.set("sourcex", trigger.player)
						.set("addCount", false);
				},
			},
		},
	},
	/**背水一战
	 * 你可以将所有手牌当作杀打出，此杀的伤害+1，且造成伤害后，你收回这些手牌。若此杀没有造成伤害，则你受到的下一次伤害+1。
	 * 你可以将所有手牌当作杀打出，此杀的伤害+1，且造成伤害后，你收回这些手牌。
	 * 你可以将所有手牌当作杀打出，此杀的伤害+1，且造成伤害后，你收回这些手牌；若此杀没有造成伤害，销毁这些牌，然后你失去等量体力。
	 * */
	mjsbeishuiyizhan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "chooseToUse",
		filter(event, player) {
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var card of hs) {
				var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) {
					return false;
				}
			}
			return event.filterCard(get.autoViewAs({ name: "sha" }, hs));
		},
		viewAs: {
			name: "sha",
		},
		filterCard: true,
		selectCard: -1,
		log: false,
		async precontent(event, trigger, player) {
			player.logSkill("mjsbeishuiyizhan");
			player.addTempSkill("mjsbeishuiyizhan_effect");
			player
				.when("useCard")
				.filter(evt => evt.skill == "mjsbeishuiyizhan")
				.then(() => {
					trigger.baseDamage++;
				});
			player
				.when("useCardAfter")
				.filter(evt => evt.skill == "mjsbeishuiyizhan")
				.then(async (event, trigger, player) => {
					if (player.hasHistory("sourceDamage", evt => evt.card == trigger.card)) return;
					player.addSkill("mjsbeishuiyizhan_debuff");
					player.addMark("mjsbeishuiyizhan_debuff", 1, false);
				});
		},
		ai: {
			order: 0.1,
		},
		subSkill: {
			effect: {
				trigger: {
					source: "damageSource",
				},
				forced: true,
				charlotte: true,
				filter(event, player) {
					return event.card && event.getParent()?.skill == "mjsbeishuiyizhan";
				},
				async content(event, trigger, player) {
					const cards = trigger.cards.filterInD();
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
				},
			},
			debuff: {
				trigger: {
					player: "damageBegin3",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				mark: true,
				intro: {
					content: "下一次受到的伤害+#",
				},
			},
		},
	},
	/**登坛拜将
	 * 出牌阶段限1次，你可以将1张牌当作多多益善打出。
	 * 出牌阶段限1次，你可以将1张战法牌当作多多益善打出。
	 * */
	mjsdengtanbaijiang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "mjsduoduoyishan",
		},
		viewAsFilter(player) {
			if (!player.countCards("hes")) return false;
			return true;
		},
		filterCard: true,
		position: "hes",
		check(card) {
			return 8 - get.value(card);
		},
	},
	//刘邦
	/**斩蛇起义
	 * 限定，你选择1张除杀之外的手牌，销毁游戏中所有同名牌，接下来本局游戏你每次弃牌后，可以令一名其他角色摸2张牌。
	 * */
	mjszhansheqiyi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h", card => card.name != "sha");
		},
		limited: true,
		filterCard(card) {
			const player = get.player();
			if (!lib.filter.cardDestuctible(card, player, "mjszhansheqiyi")) {
				return false;
			}
			return card.name != "sha";
		},
		check(card) {
			return 12 - get.value(card);
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = ["cardPile", "discardPile"].map(pos => Array.from(ui[pos].childNodes)).flat();
			const filter = card => event.cards[0].name == card.name && lib.filter.cardDestuctible(card, player, "mjszhansheqiyi");
			const cardx = cards.filter(filter);
			if (cardx.length) {
				game.log(cardx, "被销毁了");
				await game.cardsGotoSpecial(cardx, "toDestroy");
			}
			for (const target of game.filterPlayer()) {
				const cards = target.getCards("hej", filter);
				if (cards.length) {
					target.$throw(cards);
					game.log(cards, "被销毁了");
					await target.lose(cards, "toDestroy", ui.special);
				}
			}
		},
		ai: {
			order: 12,
			result: {
				player(player) {
					return 1;
				},
			},
		},
		subSkill: {
			effect: {
				audio: "mjszhansheqiyi",
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				popup: false,
				filter(event, player) {
					if (event.type != "discard") {
						return false;
					}
					return event.getl && event.getl(player)?.cards2?.length;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "令一名其他角色摸2张牌", lib.filter.notMe)
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, { name: "draw" }, player) * 2;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill(event.name, target);
					await target.draw(2);
				},
			},
		},
	},
	/**大风歌
	 * 每个回合限1次，当你获得点数为5的牌后，你可以将其弃置，立即重新洗牌，随机弃置其他角色各1张牌，然后可以令一名其他角色摸牌至手牌上限。
	 * */
	mjsdafengge: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			player: "gainAfter",
			global: ["gameDrawAfter", "loseAsyncAfter"],
		},
		usable: 1,
		filter(event, player) {
			if (event.name == "gameDraw") {
				return player.countCards("h", card => get.number(card) == 5);
			}
			return event.getg && event.getg?.(player)?.some(card => get.number(card) == 5);
		},
		prompt2(event, player) {
			const cards = (event?.getg?.(player) ?? player.getCards("h")).filter(card => get.number(card) == 5);
			return `你可以将${get.translation(cards)}弃置，立即重新洗牌，随机弃置其他角色各1张牌，然后可以令一名其他角色摸牌至手牌上限`;
		},
		check(event, player) {
			const cards = (event?.getg?.(player) ?? player.getCards("h")).filter(card => get.number(card) == 5);
			return (
				cards.every(card => get.value(card) <= 6) &&
				game.hasPlayer(target => {
					return target.countDiscardableCards(player, "he") && get.attitude(player, target) <= 0;
				})
			);
		},
		async content(event, trigger, player) {
			const cards = (trigger?.getg?.(player) ?? player.getCards("h")).filter(card => get.number(card) == 5);
			await player.discard(cards);
			await game.washCard();
			const targets = game.filterPlayer(target => {
				return target != player && target.countCards("he");
			});
			for (const target of targets) {
				const cards = target.getCards("h", card => {
					return lib.filter.cardDiscardable(card, target, "mjsdafengge");
				});
				if (cards.length > 0) {
					await target.discard(cards.randomGets(1)).set("discarder", target);
				}
			}
			const result = await player
				.chooseTarget(get.prompt(event.name), "令一名其他角色摸牌至手牌上限", lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					const eff = target.getHandcardLimit() - target.countCards("h");
					return get.effect(target, { name: "draw" }, target) * eff;
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.line(target);
				await target.drawTo(target.getHandcardLimit());
			}
		},
	},
	/**约法三章
	 * 出牌阶段限1次，你可以弃置1张手牌，选择一名其他角色，若其在上一轮，击杀过其他角色，则体力上限-1，造成过伤害，则受到1点伤害，获得过其他角色的牌，随机销毁其1张牌。
	 * */
	mjsyuefasanzhang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		onChooseToUse(event) {
			event.targetprompt2.add(target => {
				if (event.skill != "mjsyuefasanzhang") return;
				const player = get.player();
				var str = "",
					info = get.info("mjsyuefasanzhang");
				if (info.hasRoundHistory(target, 1)) {
					str += "体力上限-1<br>";
				}
				if (info.hasRoundHistory(target, 2)) {
					str += "受到1点伤害<br>";
				}
				if (info.hasRoundHistory(target, 3)) {
					str += "随机销毁1张牌<br>";
				}
				return str;
			});
		},
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		check(card) {
			return 7 - get.value(card);
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const info = get.info(event.name);
			if (info.hasRoundHistory(target, 1)) {
				await target.loseMaxHp();
			}
			if (info.hasRoundHistory(target, 2)) {
				await target.damage();
			}
			if (info.hasRoundHistory(target, 3)) {
				const cards = target.getCards("he", card => lib.filter.cardDestuctible(card, target, "mjsyuefasanzhang")).randomGets(1);
				if (cards.length) {
					game.log(cards, "被销毁了");
					await target.lose(cards, "toDestroy", ui.special);
				}
			}
		},
		hasRoundHistory(player, key) {
			switch (key) {
				case 1:
					{
						return (
							game.getRoundHistory(
								"everything",
								evt => {
									return evt.name == "die" && evt.player != player && evt.source == player;
								},
								1
							).length > 0
						);
					}
					break;
				case 2:
					{
						return player.getRoundHistory("sourceDamage", () => true, 1).length;
					}
					break;
				case 3:
					{
						return game.hasPlayer2(current => {
							if (current == player) {
								return false;
							}
							return (
								current.getRoundHistory(
									"lose",
									evt => {
										let evtx = evt.getParent();
										if (!evtx.getg) {
											return false;
										}
										var cards = evtx.getg(player);
										if (!cards.length) {
											return false;
										}
										var cards2 = evt.cards2;
										for (var card of cards2) {
											if (cards.includes(card)) {
												return true;
											}
										}
										return false;
									},
									1
								).length > 0
							);
						}, true);
					}
					break;
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					var eff = 0,
						info = get.info("mjsyuefasanzhang");
					if (info.hasRoundHistory(target, 1)) {
						eff--;
					}
					if (info.hasRoundHistory(target, 2)) {
						eff += get.damageEffect(target, player) / 10;
					}
					if (info.hasRoundHistory(target, 3)) {
						eff--;
					}
					return eff;
				},
			},
		},
	},
	//吕雉
	/**临朝称制
	 * 每个回合开始前，你可以选择1个花色，令所有角色在打出此花色的牌后摸1张牌或者随机销毁1张牌。
	 * */
	mjslinchaochengzhi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌", "控制"],
		trigger: {
			global: "phaseBeforeEnd",
		},
		silent: true,
		popup: true,
		forced: false,
		async cost(event, trigger, player) {
			const suits = mjs.suits.slice().map(suit => [suit, get.translation(suit)]);
			const types = ["draw", "destroy"].map(type => [type, type == "draw" ? "摸牌" : "销毁"]);
			const list = [...suits, ...types];
			const result = await player
				.chooseButton(
					[
						[list, "tdnodes"],
						`<div><div style="width:100%;text-align:center"><span class="mj-playertext">${get.translation(trigger.player)}</span>的回合，<span class="mj-skilltext">${get.translation(event.skill)}</span>发动，选择一个属性和效果</div></div>`,
						[
							dialog => {
								dialog.css({
									top: "40%",
									minWidth: "350px",
									minHeight: "100px",
								});
							},
							"handle",
						],
					],
					2
				)
				.set("complexSelect", true)
				.set("filterButton", button => {
					return !ui.selected.buttons.some(buttonx => Boolean(mjs.suits.includes(button.link)) == Boolean(mjs.suits.includes(buttonx.link)));
				})
				.set("ai", button => {
					const player = get.player();
					const suits = mjs.suits.slice(0, 4);
					const trigger = _status.event.getTrigger();
					const target = trigger.player;
					switch (button.link) {
						case "draw": {
							return get.attitude(player, target) > 0;
						}
						case "destroy": {
							return get.attitude(player, target) <= 0;
						}
						default: {
							const num = target.countCards("h", { suit: button.link });
							return 1 + Math.random() + num * 0.25;
						}
					}
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				if (!mjs.suits.includes(result.links[0])) {
					result.links.reverse();
				}
				event.result = {
					bool: true,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const [suit, type] = event.cost_data;
			const skill = `${event.name}_${type}`;
			player.addTempSkill(skill);
			player.markAuto(skill, [suit]);
			//player.addTip(skill, player.getStorage(skill).reduce((str, suit) => str + get.translation(suit), "") + " " + (type == "draw" ? "摸牌" : "销毁"));
		},
		subSkill: {
			draw: {
				audio: "mjslinchaochengzhi",
				trigger: {
					global: ["useCardAfter", "respondAfter"],
				},
				silent: true,
				popup: true,
				forced: true,
				locked: false,
				onremove: true,
				filter(event, player) {
					return player.hasStorage("mjslinchaochengzhi_draw", get.suit(event.card));
				},
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.player.draw();
				},
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				marktext: "摸牌",
				intro: {
					markcount(storage, player) {
	                    return storage ? storage.map(i => get.translation(i)).join("") : null;
	                },
					content: "所有角色打出$花色的牌后摸1张牌",
				},
			},
			destroy: {
				audio: "mjslinchaochengzhi",
				trigger: {
					global: ["useCardAfter", "respondAfter"],
				},
				silent: true,
				popup: true,
				forced: true,
				locked: false,
				onremove: true,
				filter(event, player) {
					if (!event.player.countCards("he", card => lib.filter.cardDestuctible(card, event.player, "mjslinchaochengzhi_destroy"))) {
						return false;
					}
					return player.hasStorage("mjslinchaochengzhi_destroy", get.suit(event.card));
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const cards = trigger.player.getCards("he", card => lib.filter.cardDestuctible(card, trigger.player, "mjslinchaochengzhi_destroy")).randomGets(1);
					if (cards.length > 0) {
						game.log(cards, "被销毁了");
						await trigger.player.lose(cards, "toDestroy", ui.special);
					}
				},
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				marktext: "销毁",
				intro: {
					markcount(storage, player) {
	                    return storage ? storage.map(i => get.translation(i)).join("") : null;
	                },
					content: "所有角色打出$花色的牌后随机销毁1张牌",
				},
			},
		},
	},
	/**诸吕为王
	 * 限定，你选择至少三名角色（不足则全部），令其随机平分所有本局游戏被销毁的牌。
	 * */
	mjszhulvweiwang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌"],
		enable: "phaseUse",
		filter(event, player) {
			return _status.destroy.length;
		},
		limited: true,
		filterTarget: true,
		selectTarget() {
			if (game.countPlayer() <= 3) return -1;
			return [3, Infinity];
		},
		multitarget: true,
		line: false,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = _status.destroy,
				list = [];
			for (const target of event.targets) {
				const num = get.rand(0, cards.length);
				if (num == 0) continue;
				const cards2 = cards.randomGets(num);
				cards.removeArray(cards2);
				list.push([target, cards2]);
			}
			await game
				.loseAsync({
					gain_list: list,
					player,
					animate: "gain2",
				})
				.setContent("gaincardMultiple");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (_status.destroy.length <= 3) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//萧何
	/**举贤为将
	 * 回合结束时，你可以交给一名其他角色至少1张牌，然后令其立即进行一个只有出牌阶段的回合；在此阶段内，当其打出行动牌后，其摸1张牌。
	 * */
	mjsjuxianweijiang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: "phaseEnd",
		},
		silent: false,
		forced: false,
		filter(event, player) {
			return player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard: true,
					selectCard: [1, Infinity],
					filterTarget: lib.filter.notMe,
					position: "he",
					ai1(card) {
						if (!ui.selected.cards.length) {
							return 20 - get.value(card);
						}
						return 5 - get.value(card);
					},
					ai2(target) {
						const player = get.event().player;
						const att = get.attitude(player, target);
						if (!ui.selected.cards.length) {
							return 0;
						}
						if (target.hasSkillTag("nogain")) {
							return 0;
						}
						if (att > 3) {
							var basis = get.threaten(target);
							if (
								player == get.zhu(player) &&
								player.hp <= 2 &&
								player.countCards("h", "shan") &&
								!game.hasPlayer(function (current) {
									return get.attitude(current, player) > 3 && current.countCards("h", "tao") > 0;
								})
							) {
								return 0;
							}
							if (target.countCards("h") + player.countCards("h") > target.hp + 2) {
								return basis * 0.8;
							}
							return basis;
						}
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = event.cards;
			player.logSkill(event.name, target);
			await player.give(cards, target);
			target
				.when({ global: "phaseUseBegin" })
				.filter(evt => evt.getParent("phase")?.skill == "mjsjuxianweijiang")
				.then(() => {
					player.addTempSkill("mjsjuxianweijiang_effect", "phaseUseAfter");
				});
			const next = target.insertPhase();
			next.set("phaseList", ["phaseUse"]);
		},
		subSkill: {
			effect: {
				mark: true,
				marktext: "贤",
				intro: {
					content: "你打出行动牌后摸1张牌",
				},
				trigger: {
					player: ["useCardAfter", "respondAfter"],
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return get.type(event.card) == "basic";
				},
				async content(event, trigger, player) {
					player.draw();
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (get.type(card) == "basic") {
								return [1, 1];
							}
						},
					},
				},
			},
		},
	},
	/**计召诱诛
	 * 限定，其他角色的出牌阶段结束时，若其在此阶段内打出的牌＞3张，你可以令另外一名其他角色对其打出手牌中的所有杀，直到目标重伤。
	 * */
	mjsjizhaoyouzhu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseUseEnd",
		},
		limited: true,
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			const list = event.player.getHistory("useCard", evt => evt.getParent("phaseUse") == event);
			list.addArray(event.player.getHistory("respond", evt => evt.getParent("phaseUse") == event));
			return list.length > 3 && game.countPlayer() > 2;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill, trigger.player), (card, player, target) => {
					const trigger = _status.event.getTrigger();
					if (target == player || target == trigger.player) {
						return false;
					}
					return target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					const trigger = _status.event.getTrigger();
					if (get.attitude(player, trigger.player) > 0) return 0;
					if (get.effect(trigger.player, { name: "sha" }, target, player) <= 0) {
						return 0;
					}
					return get.sgnAttitude(player, target) * target.countCards("h");
				})
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.targets[0];
			const result = await target
				.chooseBool(`是否对${get.translation(trigger.player)}打出手牌中的所有杀`)
				.set("ai", () => {
					return get.event().goon;
				})
				.set(
					"goon",
					(() => {
						const cards = player.getCards("h", "sha");
						const eff = cards.reduce((sum, card) => sum + get.effect(target, card, player, player), 0);
						return eff > 7;
					})()
				)
				.forResult();
			if (!result.bool) return;
			while (target.countCards("h", "sha")) {
				const cards = target.getCards("h", "sha");
				if (!cards.some(card => target.canUse(card, trigger.player, false, false))) {
					break;
				}
				const card = cards[0];
				const next = target.useCard(card, trigger.player, false);
				next.animate = false;
				const result = await next.forResult();
				if (game.getGlobalHistory("everything", evt => {
					return evt.name == "dying" && evt.player == trigger.player && evt.getParent(event.name) == event;
				}).length) {
					break;
				}
			}
		},
	},
	//张良
	/**博浪椎秦
	 * 你可以将手牌中的1张武器牌装备给一名其他角色，然后其可以对你选择的其攻击范围内的另一名其他角色打出1张杀。
	 * */
	mjsbolangzhuiqin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h", card => lib.skill.mjsbolangzhuiqin.filterCard(card));
		},
		filterCard(card) {
			return get.subtype(card) == "equip1";
		},
		check(card) {
			const player = _status.currentPhase;
			if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
				return 11 - get.equipValue(card);
			}
			return 6 - get.value(card);
		},
		filterTarget(card, player, target) {
			return player != target && target.canEquip(card);
		},
		discard: false,
		lose: false,
		prepare(cards, player, targets) {
			player.$give(cards, targets[0], false);
		},
		async content(event, trigger, player) {
			await event.target.equip(event.cards[0]);
			const result = await player
				.chooseTarget(`${mjs.prompt(event.name)}，你可以选择<span class="mj-playertext">${get.translation(event.target)}</span>的出杀目标`)
				.set("filterTarget", (card, player, target) => {
					return get.event().sourcex.inRange(target);
				})
				.set("sourcex", event.target)
				.set("ai", target => {
					const { player, sourcex } = get.event();
					return get.effect(target, { name: "sha" }, sourcex, sourcex);
				})
				.forResult();
			if (result?.bool) {
				const target = result.targets[0];
				player.line(target);
				await event.target
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"博浪椎秦：你可以对" + get.translation(target) + "使用一张杀"
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
					.set("sourcex", target);
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					const card = ui.selected.cards[0];
					if (card) {
						const sha = new lib.element.VCard({ name: "sha" });
						return get.effect(target, card, target, target) + target.getUseValue(sha);
					}
					return 0;
				},
			},
			threaten: 1.3,
		},
	},
	/**运筹帷幄
	 * 你的杀只能当做任意战法牌打出，并且每个战法牌每个回合限1次。你在回合外需要打出杀时，其他角色可以替你打出。
	 * */
	mjsyunchouweiwo: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			cardEnabled2(card, player, result) {
				if (get.position(card) != "h") return;
				if (card.name != "sha") return;
				const evt = get.event();
				const judge = evt.skill !== "mjsyunchouweiwo_backup";
				if (get.itemtype(card) === "vcard" && Array.isArray(card.cards)) {
					if (judge) {
						return false;
					}
				}
				if (judge) {
					return false;
				}
			},
		},
		enable: ["chooseToUse", "chooseToRespond"],
		locked: false,
		filter(event, player) {
			if (!player.countCards("h", { name: "sha" })) return false;
			const list = get.info("mjsyunchouweiwo").getList(player);
			return list.some(name => player.hasCard(cardx => event.filterCard({ name: name, cards: [cardx] }, player, event), "h"));
		},
		chooseButton: {
			dialog(event, player) {
				const list = mjs.getVCardList("trick")
					.filter(info => {
						if (!get.info("mjsyunchouweiwo").getList(player).includes(info[2])) {
							return false;
						}
						return player.hasCard(cardx => event.filterCard({ name: info[2], cards: [cardx] }, player, event), "h");
					})
					.map(info => [info, get.translation(info[2])]);
				const list2 = lib.skill.mjsyiqiaoshoushu.getList
					.filter(name => {
						if (!get.info("mjsyunchouweiwo").getList(player).includes(name)) {
							return false;
						}
						return player.hasCard(cardx => event.filterCard({ name: name, cards: [cardx] }, player, event), "h");
					})
					.map(info => {
						return [["trick", "", info], get.translation(info)];
					});
				const dialog = ui.create.dialog([["运筹帷幄"], "addNewRow"]);
				if (list.length) {
					dialog.add(`<div><div style="width:100%;text-align:center">———— 战法牌 ————</div></div>`);
					dialog.add([list, "tdnodes"]);
				}
				if (list2.length) {
					dialog.add(`<div><div style="width:100%;text-align:center">———— 太公六韬 ————</div></div>`);
					dialog.add([list2, "tdnodes"]);
				}
				dialog.direct = true;
				dialog.css({
                    top: get.is.phoneLayout() ? "5%" : "45%",
                });
                const buttons = dialog.content.querySelectorAll(".buttons");
                for (const button of buttons) {
                    button.style.setProperty("text-align", "left", "important");
                    button.style.setProperty("max-width", "800px", "important");
                }
                dialog.buttons.forEach(i => {
                    i.setNodeIntro(get.translation(i.link[2]));
                    i._customintro = function(uiintro, evt) {
                        const card = i.link;
                        uiintro.add(get.translation(card[3] || "") + get.translation(card[2]));
                        uiintro.add([[card], "vcard"]);
                        const name2 = card[2];
                        if (lib.card[name2].cardPrompt) {
                            uiintro.add(`<div class="text" style="display:inline">${lib.card[name2].cardPrompt(i.link || i)}</div>`);
                        } else if (lib.translate[name2 + "_info"]) {
                            uiintro.add(`<div class="text" style="display:inline">${lib.translate[name2 + "_info"]}</div>`);
                        }
                    };
                    i.style.setProperty("width", "100px", "important");
                    i.style.setProperty("text-align", "left", "important");
                });
				return dialog;
			},
			check(button) {
				return get.player().getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links) {
				return {
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					filterCard: {
						name: "sha",
					},
					check(card) {
						return 10 - get.value(card);
					},
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("mjsyunchouweiwo");
						player.addTempSkill("mjsyunchouweiwo_used");
						player.markAuto("mjsyunchouweiwo_used", [event.result.card.name]);
					},
				};
			},
			prompt(links) {
				return "将一张杀当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用或打出";
			},
		},
		getList(player) {
			const list = mjs.getVCardList("trick").map(info => info[2]);
			list.addArray(player.getStorage("mjsyunchouweiwo"));
			return list.filter(name => {
				if (player.hasStorage("mjsyunchouweiwo_used", name)) return false;
				return get.type(name) == "trick";
			});
		},
		hiddenCard(player, name) {
			const list = get.info("mjsyunchouweiwo").getList(player);
			if (!list.includes(name)) return false;
			return player.countCards("h", { name: "sha" });
		},
		ai: {
			order(item, player) {
				if (player && get.event().type == "phase") {
					let list = get
						.info("mjsyunchouweiwo")
						.getList(player)
						.map(card => {
							return { name: name };
						})
						.filter(card => player.getUseValue(card, true, true) > 0);
					if (!list.length) return 0;
					list.sort((a, b) => (player.getUseValue(b, true, true) || 0) - (player.getUseValue(a, true, true) || 0));
					return get.order(list[0], player) * 0.99;
				}
				return 0.001;
			},
			result: {
				player: 1,
			},
		},
		group: "mjsyunchouweiwo_use",
		subSkill: {
			backup: {},
			use: {
				trigger: {
					player: ["chooseToUseBegin", "chooseToRespondBegin"],
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (player == _status.currentPhase) {
						return false;
					}
					const card = { name: "sha", isCard: true };
					return event.filterCard(card, event.player, event);
				},
				async content(event, trigger, player) {
					while (true) {
						if (event.current == undefined) {
							event.current = player.next;
						}
						if (event.current == player) {
							player.addTempSkill("mjsyunchouweiwo_blocker");
							trigger.cancel();
							trigger.getParent().goto(0);
							return;
						} else {
							const chooseToRespondEvent = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张杀？", { name: "sha" });
							chooseToRespondEvent.set("ai", () => {
								const event = _status.event;
								return get.attitude(event.player, event.source) - 2;
							});
							chooseToRespondEvent.set("source", player);
							chooseToRespondEvent.set("mjsyunchouweiwo", true);
							chooseToRespondEvent.set("skillwarn", "替" + get.translation(player) + "打出一张杀");
							chooseToRespondEvent.noOrdering = true;
							chooseToRespondEvent.autochoose = lib.filter.autoRespondSha;
							const { bool, card, cards } = await chooseToRespondEvent.forResult();
							if (bool) {
								trigger.untrigger();
								trigger.set("responded", true);
								const result = {
									bool: true,
									card: card,
								};
								trigger.result = result;
								return;
							} else {
								event.current = event.current.next;
							}
						}
					}
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
			blocker: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	/**圯桥授书
	 * 所有角色累计打出15张战法牌后，将太公六韬添加到你的手牌和你可以打出的战法牌种类中。
	 * 文韬:令一名角色摸牌至手牌上限
	 * 武韬:查看一名有牌的其他角色的手牌，若其中缺少某种类型的牌，你可以令一名角色随机获得对应类型的各1张牌
	 * 龙韬:令一名其他角色随机获得并装备1张装备牌，并且下回合的出杀次数+1
	 * 虎韬:本回合你打出的下一张战法牌生效2次
	 * 豹韬:令两名角色交换座位
	 * 犬韬:本回合你打出的下一张行动牌生效2次
	 * 生效后，运筹帷幄技能可以选择六韬打出。
	 * 五日，良夜未半往。有顷，父亦来，喜曰：“当如是。”出一编书，曰：“读此则为王者师矣。后十年兴。十三年孺子见我济北，谷城山下黄石即我矣。”遂去，无他言，不复见。旦日视其书，乃太公兵法也。良因异之，常习诵读之。——《史记·留侯世家》
	 * */
	mjsyiqiaoshoushu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:8",
		logAudio: index => "ext:名将杀/audio/skill/mjsyiqiaoshoushu" + (typeof index === "number" ? index : get.rand(1, 8)) + ".mp3",
		derivation: "mjsyiqiaoshoushu_faq",
		getList: ["mjswentao", "mjswutao", "mjslongtao", "mjshutao", "mjsbaotao", "mjsquantao"],
		trigger: {
			global: ["useCardAfter", "respondAfter"],
		},
		popup: false,
		forced: true,
		locked: false,
		filter(event, player) {
			if (player.storage.mjsyiqiaoshoushu) {
				return false;
			}
			return event._mjsyiqiaoshoushu;
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			player.setStorage(event.name, true);
			const list = get.info(event.name).getList,
				cards = [];
			for (const name of list) {
				const card = game.createCard(name, "taiji", 6);
				if (card) {
					cards.push(card);
				}
			}
			if (cards.length) {
				await player.gain(cards, "draw");
			}
			player.markAuto("mjsyunchouweiwo", list);
		},
		intro: {
			markcount(storage, player) {
				return (15 - player.countMark("mjsyiqiaoshoushu_counter")).toString();
			},
			content(storage, player) {
				return `所有角色已累计打出${player.countMark("mjsyiqiaoshoushu_counter")}/15张战法牌`;
			},
		},
		group: "mjsyiqiaoshoushu_counter",
		subSkill: {
			counter: {
				trigger: {
					global: ["useCard1", "respond"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (player.storage.mjsyiqiaoshoushu) {
						return false;
					}
					return get.type2(event.card) == "trick";
				},
				async content(event, trigger, player) {
					player.addMark(event.name, 1, false);
					player.markSkill("mjsyiqiaoshoushu");
					player.updateMark("mjsyiqiaoshoushu");
					if (player.countMark(event.name) % 15 == 0) {
						trigger._mjsyiqiaoshoushu = true;
						player.unmarkSkill("mjsyiqiaoshoushu", false, false, false);
					}
				},
			},
		},
	},
	//项梁
	/**将门立楚
	 * 限定，令一名其他角色获得技能“楚王”。
	 * */
	mjsjiangmenlichu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		derivation: "mjschuwang",
		enable: "phaseUse",
		limited: true,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const createSkills = mjs.addCreateSkills("mjschuwang");
			await event.target.addSkills(createSkills);
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					return !target.hasSkill("mjschuwang");
				},
			},
		},
	},
	/**楚王
	 * 当你对目标打出杀后，满足攻击范围条件的其他角色也可以相同目标打出1张杀
	 * */
	mjschuwang: {
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "useCardAfter",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.card.name != "sha") return false;
			return game.hasPlayer(current => {
				return event.targets?.some(target => {
					return current.inRange(target) && ((_status.connectMode && current.countCards("hs")) || current.hasSha());
				});
			});
		},
		async content(event, trigger, player) {
			const targets = game.filterPlayer(target => {
				if (target == player) return false;
				return trigger.targets.some(target2 => target.inRange(target2));
			});
			const func = async target => {
				await target
					.chooseToUse("是否对" + get.translation(targets) + "打出一张杀？", function (card, player, event) {
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
					.set("addCount", false);
			};
			await game.doAsyncInOrder(targets, func);
		},
	},
	/**先发制人
	 * 杀伤，你可以获得目标角色的任意区域的1张牌，并增加1点手牌上限。其他角色回合开始时，你可以对其打出1张杀。
	 * */
	mjsxianfazhiren: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsxianfazhiren" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		mod: {
			aiValue(player, card, num) {
				if (card.name === "mjsjingyugong") {
					return num + 20;
				}
			},
			aiUseful(player, card, num) {
				if (card.name === "mjsjingyugong") {
					return num + 20;
				}
			},
		},
		trigger: {
			source: "damageSource",
			global: "phaseZhunbeiBegin",
		},
		silent: true,
		popup: false,
		forced: false,
		filter(event, player) {
			if (event.name == "damage") {
				return event.card?.name == "sha";
			}
			return event.player.isIn() && lib.filter.targetEnabled({ name: "sha" }, player, event.player) && (player.hasSha() || (_status.connectMode && player.countCards("h")));
		},
		check(event, player) {
			if (!event.player.hasGainableCards(player, "hej")) {
				return true;
			}
			return get.effect(event.player, { name: "shunshou_copy" }, player, player) > 0;
		},
		prompt2(event, player) {
			return `是否获得${get.translation(event.player)}的1张牌，并增加1点手牌上限`;
		},
		async cost(event, trigger, player) {
			if (trigger.name == "damage") {
				event.result = await player
					.chooseBool(`${mjs.prompt(event.skill)}，是否获得${get.translation(trigger.player)}的1张牌，并增加1点手牌上限`)
					.set("ai", () => lib.skill.mjsxianfazhiren.check(trigger, player))
					.forResult();
			} else {
				const result = await player
					.chooseToUse(
						`###${get.prompt(event.skill)}###对${get.translation(trigger.player)}打出一张杀`,
						function (card, player, event) {
		                    if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
		                },
						trigger.player,
	        			-1
					)
					.set("addCount", false)
					.set("chooseonly", true)
					.set("logSkill", ["mjsxianfazhiren", trigger.player, null, null, [get.rand(3, 4)]])
					.forResult();
				event.result = { bool: result.bool, cost_data: { result } };
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				const target = trigger.player;
				player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
				if (target.countGainableCards(player, "hej")) {
					await player.gainPlayerCard(target, "hej", true);
				}
				lib.skill.mjsallmax.change(player, 1);
			} else {
				const { cost_data: { result } } = event;
				await player.useResult(result, event);
			}
		},
	},
	//季布
	/**一诺千金
	 * 每名其他角色限1次，其可以将所有手牌交给你，你可以拒绝，若你接受，本局游戏无法对其造成伤害，并且代替其成为杀的目标。
	 * */
	mjsyinuoqianjin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		onremove(player, skill) {
			player.removeSkill(skill + "_effect");
		},
		logAudio: index => "ext:名将杀/audio/skill/mjsyinuoqianjin" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		global: "mjsyinuoqianjin_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				prompt() {
	                const player = get.player();
	                const targets = game.filterPlayer(target => lib.skill.mjsyinuoqianjin_global.filterTarget(null, player, target));
	                let str = "交给" + get.translation(targets);
	                if (targets.length > 1) {
	                    str += "中的一人";
	                }
	                str += "所有手牌，若其接受，本局游戏无法对你造成伤害，并且代替你成为杀的目标";
	                return str;
	            },
				filter(event, player) {
					if (!player.countCards("he")) {
	                    return false;
	                }
	                return game.hasPlayer(target => lib.skill.mjsyinuoqianjin_global.filterTarget(null, player, target));
				},
				selectTarget() {
	                const player = get.player();
	                const count = game.countPlayer(target => lib.skill.mjsyinuoqianjin_global.filterTarget(null, player, target));
	                return count > 1 ? 1 : -1;
	            },
				filterCard: true,
				selectCard: -1,
				filterTarget(card, player, target) {
					return target != player && target.hasSkill("mjsyinuoqianjin") && !player.hasStorage("mjsyinuoqianjin_targeted", target);
				},
				lose: false,
				discard: false,
				delay: false,
				log: false,
				line: true,
				async precontent(event, trigger, player) {
					//event.result.targets[0].logSkill("mjsyinuoqianjin", player);
				},
				async content(event, trigger, player) {
					const cards = event.cards,
						target = event.targets[0];
					player.addSkill("mjsyinuoqianjin_targeted");
					player.markAuto("mjsyinuoqianjin_targeted", [target])
					const result = await target
						.chooseBool(`${mjs.prompt(event.name)}，是否接受${get.translation(player)}的手牌，接受后会代替其成为杀的目标`)
						.set("ai", () => {
							return get.event().check;
						})
						.set(
							"check",
							(() => {
								return get.attitude(target, player) > 3;
							})()
						)
						.forResult();
					if (!result?.bool) {
						target.logSkill("mjsyinuoqianjin", player, null, null, [get.rand(3, 4)]);
						return;
					}
					target.logSkill("mjsyinuoqianjin", player, null, null, [get.rand(1, 2)]);
					await player.give(cards, target);
					target.addSkill("mjsyinuoqianjin_effect");
					target.markAuto("mjsyinuoqianjin_effect", [player]);
				},
				ai: {
					order: 1,
					result: {
						target(player, target) {
			                if (target.hasSkillTag("nogain")) {
			                    return 0;
			                }
			                if (player.countCards("h") == player.countCards("h", "du")) {
			                    return -1;
			                }
			                if (get.attitude(player, target) > 3) {
			                    var basis = get.threaten(target);
			                    if (
			                        player == get.zhu(player) &&
			                        player.hp <= 2 &&
			                        player.countCards("h", "shan") &&
			                        !game.hasPlayer(function (current) {
			                            return get.attitude(current, player) > 3 && current.countCards("h", "tao") > 0;
			                        })
			                    ) {
			                        return 0;
			                    }
			                    if (target.countCards("h") + player.countCards("h") > target.hp + 2) {
			                        return basis * 0.8;
			                    }
			                    return basis;
			                }
			                return 0;
			            },
					},
				},
			},
			effect: {
				trigger: {
					source: "damageBegin2",
					global: "useCardToTarget",
				},
				silent: true,
				popup: true,
				filter(event, player) {
					if (event.name == "damage") {
						return player.hasStorage("mjsyinuoqianjin_effect", event.player);
					}
					return event.card.name == "sha" && player.hasStorage("mjsyinuoqianjin_effect", event.target);
				},
				logTarget(event, player) {
					return event[event.name == "damage" ? "player" : "target"];
				},
				async content(event, trigger, player) {
					if (trigger.name == "damage") {
						trigger.cancel();
					} else {
						const target = trigger.target;
						const evt = trigger.getParent();
						evt.triggeredTargets2.remove(target);
						evt.targets.remove(target);
						evt.targets.push(player);
					}
				},
				mark: true,
				intro: {
					content: "你无法对$造成伤害，并且代替其成为杀的目标",
				},
			},
			targeted: {
				charlotte: true,
			},
		},
	},
	/**为气任侠
	 * 每个回合限1次，当有角色受到伤害后，若其体力值或手牌数全场最低，你可以摸1张牌，然后可以对伤害来源打出1张杀。
	 * */
	mjsweiqirenxia: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "damageEnd",
		},
		usable: 1,
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			return (event.player.isMinHp() || event.player.isMinHandcard());
		},
		async content(event, trigger, player) {
			await player.draw();
			if (!trigger.source?.isIn()) {
				return;
			}
			await player
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"为气任侠：是否对" + get.translation(trigger.source) + "使用一张杀？"
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
				.set("sourcex", trigger.source)
				.set("addCount", false);
		},
	},
	//范增
	/**亡秦必楚
	 * 每轮开始时，你可以选择一名其他角色，令其体力上限+1，手牌上限+1，当其每个回合首次打出行动牌后，你获得1张战法牌，然后可以立即打出此牌。
	 * 1.如果超时没有选择的话，会随机选择一个角色生效。建议选择有明确阵营规则的情况下选择此武将。
	 * 2.增加的属性是永久生效的，即使这个技能被封禁失效，目标也不因此失去增加的属性。
	 * 在经典身份模式中，主公会额外+1体力上限，并回复1点体力，范增宣称亡秦必楚，废当前主公，立另外一个主公，体力上限就要再多加一点。
	 * */
	mjswangqinbichu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "roundStart",
		},
		silent: true,
		forced: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			await target.gainMaxHp();
			lib.skill.mjsallmax.change(target, 1);
			const skill = event.name + "_effect";
			player.addTempSkill(skill, "roundStart");
			delete player.storage[skill];
			player.markAuto(skill, [target]);
			player.addTip(skill, get.translation(skill) + " " + player.getStorage(skill).reduce((str, target) => str + get.translation(target), ""), false, { whiteSpace: "nowrap" });
		},
		ai: {
			expose: 0.8,
			threaten: 2025,
		},
		subSkill: {
			effect: {
				trigger: {
					global: "useCardAfter",
				},
				popup: false,
				forced: true,
				locked: false,
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				filter(event, player) {
					if (get.type(event.card) != "basic") {
						return false;
					}
					if (!player.hasStorage("mjswangqinbichu_effect", event.player)) {
						return false;
					}
					return event.player.getHistory("useCard", evt => get.type(evt.card) == "basic").indexOf(event) == 0;
				},
				async content(event, trigger, player) {
					const card = get.cardPile(
						card => {
							return get.type2(card) == "trick";
						},
						null,
						"random"
					);
					if (card) {
						await player.gain(card, "draw");
						if (player.getCards("h").includes(card) && player.hasUseTarget(card)) {
							await player.chooseUseTarget(card);
						}
					}
				},
				mark: true,
				marktext: "楚",
				intro: {
					markcount: () => 0,
					content: "$每个回合首次打出行动牌后，你获得1张战法牌，然后可以立即打出此牌",
				},
			},
		},
	},
	/**鸿门宴
	 * 限定，你可以摸存活人数张牌并选择一名其他角色，然后你依次交给所有其他角色1张牌，并令其对你选择的角色立即打出此牌，否则其随机弃置1张牌。
	 * 1.如果选择的是装备牌，蟠桃，怒气，多多益善这些原本以自己为目标的牌，在此时打出，目标会改为鸿门宴的目标。
	 * 2.如果目标装备数量已达上限，对其打出装备牌后，由目标选择弃置1张已经装备的装备牌。
	 * 3.如果选择的是多目标的战法牌，如烽火狼烟，箭雨齐射等，目标仍然会是多目标，并且从打出角色的下一号位开始结算。
	 * 4.如果目标没有装备武器牌，则选择调兵遣将后无法打出。
	 * 5.如果在结算过程中，鸿门宴的目标角色阵亡，则后续没有选择的牌将被直接弃置，不再继续选择。
	 * 6.如果在结算过程中，除鸿门宴的目标角色外的角色阵亡，则跳过其选择。
	 * 7.如果在结算过程中，发动鸿门宴的角色阵亡，鸿门宴继续结算。
	 * 当是时，项羽兵四十万，在新丰鸿门，沛公兵十万，在霸上。范增说项羽曰：“沛公居山东时，贪于财货，好美姬。今入关，财物无所取，妇女无所幸，此其志不在小。吾令人望其气，皆为龙虎，成五采，此天子气也。急击勿失。”——《史记·项羽本纪》
	 * */
	mjshongmenyan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:3",
		enable: "phaseUse",
		limited: true,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.draw(game.countPlayer());
			const [source] = event.targets;
			const targets = game.filterPlayer(target => target != player).sortBySeat(player);
			if (player.countCards("h") < targets.length || !targets.length) {
				return;
			}
			const list = [];
			const targets2 = targets.slice();
			while (targets2.length) {
				const targets22 = targets2.slice(0, 4);
				targets2.removeArray(targets22);
				list.push(targets22.map(target => [target]));
			}
	        list.push(["手牌", player.getCards("h")]);
			const next = player
	            .chooseToMove_new(get.translation(event.name), true)
	            .set("list", list)
	            .set("filterMove", (from, to, moved) => {
	                if (typeof to == "number" && moved[to].length) {
	                    return false;
	                }
	                return true;
	            })
	            .set("filterOk", (moved) => {
	            	const len = get.event().list.slice(0, -1).flat().length;
	            	const arr = Array.from({ length: len }, (_, index) => index);
	            	return arr.every(i => moved[i].length == 1);
	            })
	            .set("processAI", list => {
	            	const { player, source } = get.event();
	                const cards = list.slice(-1).map(info => info[1]).flat().slice(0);
	                const targets = list.slice(0, -1).flat().map(info => info[0]);
	                const result = [];
	                for (const target of targets) {
	                	const att = get.attitude(player, target);
	                	const cards2 = cards.sort((b, a) => {
                			return get.effect(source, b, target, player) - get.effect(source, a, target, player);
                		});
	                	if (att >= 0) {
	                		const card = cards2[0];
	                		result.push([card]);
	                		cards.remove(card);
	                	} else {
	                		const card = cards2[cards2.length - 1];
	                		result.push([card]);
	                		cards.remove(card);
	                	}
	                }
	                result.push(cards);
	                return result;
	            })
	            .set("source", source);
	        const result = await next.forResult();
	        if (!result.bool) {
	        	return
	        }
	        const moved = result.moved;
        	const cards = moved.slice(0, targets.length).flat();
        	player.$throw(cards);
        	const lose_list = [[player, cards]];
			if (lose_list.length) {
				await game.loseAsync({ lose_list }).setContent("chooseToCompareLose");
			}
			for (const [index, card] of cards.entries()) {
				const target = targets[index];
				const gainEvent = target.gain(card);
				gainEvent.giver = player;
				await gainEvent;
				game.broadcastAll(card => {
					lib.skill.mjshongmenyan_backup.viewAs = card;
					lib.skill.mjshongmenyan_backup.viewAs.cards = [card];
				}, card);
				target.addTempSkill("mjshongmenyan_target");
				const next = target.chooseToUse();
				next.set("openskilldialog", `鸿门宴：你可以对${get.translation(source)}使用${get.translation(card)}，否则你随机弃置1张牌`);
				next.set("target", source);
				next.set("norestore", true);
				next.set("_backupevent", "mjshongmenyan_backup");
				next.set("custom", {
					add: {},
					replace: { window() { } },
				});
				next.backup("mjshongmenyan_backup");
				next.set("addCount", false);
				target
					.when("chooseToUseBegin")
					.filter(evt => evt === next)
					.then(() => (trigger.filterCard = () => false));
				const result2 = await next.forResult();
				if (!result2?.bool) {
					const cards = target.getCards("h", card => {
						return lib.filter.cardDiscardable(card, target, "mjshongmenyan");
					});
					if (cards.length > 0) {
						await target.discard(cards.randomGets(1)).set("discarder", target);
					}
				}
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					var players = game.filterPlayer();
					var effect = 0;
					for (var i = 0; i < players.length; i++) {
						if (players[i] != target && players[i] != player) {
							effect += get.effect(target, { name: "sha" }, players[i], target);
						}
					}
					return effect;
				},
			},
		},
		subSkill: {
			given: {
				name: "宴",
			},
			backup: {
				filterCard: () => false,
				selectCard: -1,
				filterTarget(card, player, target) {
					if (!card || !target || target.removed) {
						return false;
					}
					if (target != get.event().target && !ui.selected.targets.includes(get.event().target)) {
						return false;
					}
					const info = get.info(card);
					if (!info?.deadTarget && target.isDead()) {
						return false;
					}
					if (!info?.includeOut && target.isOut()) {
						return false;
					}
					if (lib.filter.targetEnabled(card, player, target)) {
						return true;
					}

					if (game.checkMod(card, player, target, "unchanged", "playerEnabled", player) == false) {
						return false;
					}
					if (game.checkMod(card, player, target, "unchanged", "targetEnabled", target) == false) {
						return false;
					}

					const filter = get.info(card).modTarget;
					if (typeof filter == "boolean") {
						return filter;
					}
					if (typeof filter == "function") {
						return Boolean(filter(card, player, target));
					}
					return false;
				},
				log: false,
				precontent() {
					const name = event.result.card.name,
						cards = event.result.card.cards.slice(),
						rcard = cards[0];
					event.result.cards = cards;
					event.result.card = get.autoViewAs(rcard.name == name ? rcard : { name, isCard: true });
				},
			},
			target: {
				mod: {
					selectTarget(card, player, range) {
						if (_status._mjshongmenyan_check) {
							return;
						}
						const event = get.event();
						if (!event || event.name !== "chooseToUse" || event.getParent().name !== "mjshongmenyan") {
							return;
						}
						_status._mjshongmenyan_check = true;
						const bool = game.countPlayer(target => lib.filter.targetEnabled2(card, player, target)) > 1;
						delete _status._mjshongmenyan_check;
						if (bool) {
							if (range[0] !== 1) {
								range[0] = 1;
							}
							if (range[1] !== 1) {
								range[1] = 1;
							}
						}
					},
					cardEnabled2(card, player) {
						if (_status._mjshongmenyan_check) {
							return;
						}
						const event = get.event();
						if (!event || event.name !== "chooseToUse" || event.getParent().name !== "mjshongmenyan") {
							return;
						}
						_status._mjshongmenyan_check = true;
						const bool = game.hasPlayer(target => lib.filter.targetEnabled2(card, player, target));
						delete _status._mjshongmenyan_check;
						if (bool) {
							return true;
						}
					},
					cardEnabled(card, player) {
						if (_status._mjshongmenyan_check) {
							return;
						}
						const event = get.event();
						if (!event || event.name !== "chooseToUse" || event.getParent().name !== "mjshongmenyan") {
							return;
						}
						_status._mjshongmenyan_check = true;
						const bool = game.hasPlayer(target => lib.filter.targetEnabled2(card, player, target));
						delete _status._mjshongmenyan_check;
						if (bool) {
							return true;
						}
					},
					playerEnabled(card, player, target) {
						if (_status._mjshongmenyan_check) {
							return;
						}
						const event = get.event();
						if (!event || event.name !== "chooseToUse" || event.getParent().name !== "mjshongmenyan") {
							return;
						}
						_status._mjshongmenyan_check = true;
						const bool = lib.filter.targetEnabled2(card, player, target);
						delete _status._mjshongmenyan_check;
						if (bool) {
							return true;
						}
					},
				},
			},
		},
	},
	//龙且
	/**忠勇恃武
	 * 其他角色打出杀后，若目标也在你的攻击范围内，你可以失去1点体力，摸2张牌，然后可以对相同目标打出1张杀。
	 * */
	mjszhongyongshiwu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "useCardAfter",
		},
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (event.player == player) return false;
			return event.card.name == "sha" && event.targets?.some(target => player.inRange(target));
		},
		logTarget(event, player) {
			return event.targets?.filter(target => player.inRange(target));
		},
		check(event, player) {
			if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 2) return false;
			if (player.getHp() > 3) return true;
			return event.targets.some(target => {
				let num = 0;
				const card = new lib.element.VCard({ name: "sha" });
				if (!player.canUse(card, target, false)) {
					return false;
				}
				num += get.sgn(get.effect(target, card, player, player));
				return num > 0;
			});
		},
		async content(event, trigger, player) {
			await player.loseHp();
			await player.draw(2);
			const targets = trigger.targets.filter(target => player.inRange(target));
			if (!targets?.length) return;
			await player
				.chooseToUse("是否对" + get.translation(targets) + "打出一张杀？", function (card, player, event) {
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
				.set("addCount", false);
		},
	},
	/**安营筑垒
	 * 回合结束时，你可以弃置所有手牌，并增加等量体力上限，然后回复1点体力；回合开始时，你的体力上限减少至体力值，每减少1点，摸2张牌。
	 * */
	mjsanyingzhulei: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["增益", "摸牌"],
		trigger: {
			player: ["phaseEnd", "phaseBegin"],
		},
		silent: true,
		forced: false,
		filter(event, player, name) {
			if (name == "phaseBegin") {
				return player.isDamaged();
			}
			return player.countCards("h") > 0;
		},
		async cost(event, trigger, player) {
			if (event.triggername == "phaseEnd") {
				event.result = await player
					.chooseBool(`${mjs.prompt(event.skill)}，是否弃置所有手牌，并增加等量体力上限，然后回复1点体力。`)
					.set("ai", () => lib.skill.mjsanyingzhulei.check(trigger, player))
					.forResult();
			} else {
				event.result = { bool: true };
			}
		},
		check(event, player) {
			return player.countCards("h") <= 4 && player.getHp() <= 3;
		},
		async content(event, trigger, player) {
			if (event.triggername == "phaseEnd") {
				player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
				const cards = player.getCards("h");
				if (cards.length) {
					await player.discard(cards);
					await player.gainMaxHp(cards.length);
					await player.recover();
				}
			} else {
				player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
				const num = player.getDamagedHp();
				if (num > 0) {
					await player.loseMaxHp(num);
					await player.draw(num * 2);
				}
			}
		},
	},
	//项羽
	/**破釜沉舟
	 * 限定，销毁你所有的手牌和防具牌，然后摸牌至手牌上限，接下来本局游戏你造成的所有伤害+1，出牌阶段开始时，每损失1点体力，出杀次数+1。
	 * 限定，销毁你的所有牌，然后摸牌至手牌上限，接下来本局游戏你造成的所有伤害+1。出牌阶段开始时，每损失1点体力，出杀次数+1。
	 * 1.销毁的牌包括手牌和已经装备的装备牌。
	 * 2.所有伤害+1，包括杀，战法牌等所有方式造成的伤害。
	 * 3.至少需要有1张牌才能发动此技能。
	 * */
	mjspofuchenzhou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		filter(event, player) {
			return player.hasCards("he", (card, player) => lib.skill.mjspofuchenzhou.filterCard(card, player));
		},
		filterCard(card, player) {
			player = player || get.event().player;
			if (!lib.filter.cardDestuctible(card, player, "mjspofuchenzhou")) {
				return false;
			}
			return get.position(card) == "h" || get.subtype(card) == "equip2";
		},
		selectCard: -1,
		position: "he",
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			game.log(event.cards, "被销毁了");
			await player.lose(event.cards, "toDestroy", ui.special);
			await player.drawTo(player.getHandcardLimit());
			player.addSkill(event.name + "_effect");
			player.addMark(event.name + "_effect", 1, false);
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
			result: {
				player(player) {
					const cards = player.getCards("h", card => {
						return player.getUseValue(card) > 0;
					});
					if (cards.length > 1) {
						return 0;
					}
					const eff = Math.max(1, player.getHandcardLimit() - cards.length);
					return eff;
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					source: "damageBegin1",
					player: "phaseUseBegin",
				},
				silent: true,
				charlotte: true,
				filter(event, player) {
					return event.name == "damage" || player.isDamaged();
				},
				async content(event, trigger, player) {
					if (trigger.name == "damage") {
						trigger.num += player.countMark(event.name);
					} else {
						const num = player.getDamagedHp();
						if (num > 0) {
							player.addTempSkill("mjspofuchenzhou_buff", "phaseUseAfter");
							player.addMark("mjspofuchenzhou_buff", num, false);
						}
					}
				},
				mark: true,
				marktext: "鼎",
				intro: {
					name: "d=====(￣▽￣*)b",
					markcount: () => 0,
					content: "你造成的所有伤害+1，出牌阶段开始时，每损失1点体力，出杀次数+1。",
				},
			},
			buff: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("mjspofuchenzhou_buff");
						}
					},
				},
			},
		},
	},
	/**霸王
	 * 当你进行阵前对决时，将阵前对决的效果改为对目标造成1点伤害；你每造成3次伤害，添加1张阵前对决到你的手牌。
	 * 1.此技能修改了阵前对决这张牌在与项羽结算时的结算规则，不再需要双方打出杀，而是直接对目标造成伤害。
	 * 2.项羽对项羽打出阵前对决的话......
	 * */
	mjsbawang: {
		audio: "ext:名将杀/audio/skill:2",
		logAudio: index => "ext:名将杀/audio/skill/mjsbawang" + (typeof index === "number" ? index : get.rand(1, 2)) + ".mp3",
		trigger: {
			player: ["juedouBegin", "mjszhenqianduijueBegin"],
			target: ["juedouBegin", "mjszhenqianduijueBegin"],
			source: "damageSource",
		},
		silent: true,
		locked: false,
		filter(event, player) {
			if (["juedou", "mjszhenqianduijue"].includes(event.name)) {
				return true;
			}
			return event._mjsbawang;
		},
		async content(event, trigger, player) {
			if (["juedou", "mjszhenqianduijue"].includes(trigger.name)) {
				const target = trigger[trigger.player == player ? "target" : "player"];
				player.logSkill(event.name, null, null, null, [1]);
				trigger.set(event.name, [player, target]);
				trigger.setContent(lib.skill[event.name].contentx);
			} else {
				player.logSkill(event.name, null, null, null, [2]);
				const card = game.createCard2("mjszhenqianduijue", "diamond", 5);
				if (card) {
					await player.gain(card, "gain2");
				}
			}
		},
		async contentx(event, trigger, player) {
			const targets = event.mjsbawang;
			const sources = targets.filter(target => target.hasSkillTag("duijue"));
			//项羽对项羽打出阵前对决的话，无事发生
			if (targets.length == sources.length) {
				return;
			}
			targets[1].damage(targets[0], "nocard");
		},
		ai: {
			duijue: true,
			effect: {
				target(card, player, target) {
					if (card.name != "mjszhenqianduijue") {
						return;
					}
					const eff = Math.max(-1, get.damageEffect(player, target));
					return [0, 0, 1, eff];
				},
			},
		},
		group: "mjsbawang_counter",
		subSkill: {
			counter: {
				trigger: {
					source: "damageSource",
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					player.addMark("mjsbawang_counter", 1, false);
					if (player.countMark("mjsbawang_counter") % 3 === 0) {
						trigger._mjsbawang = true;
					}
				},
			},
		},
	},
	//英布
	/**功冠诸侯
	 * 每轮结束时，若你在本轮造成的伤害最高，你的体力上限+1，之后每个出牌阶段的出杀次数+1。
	 * */
	mjsgongguanzhuhou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		init(player, skill) {
			//不是很懂名将杀的结算为什么又读历史又要标记
			if (!lib.skill[skill].filter(null, player)) {
				return;
			}
			player.addSkill(skill + "_mark");
		},
		trigger: {
			global: "roundEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			if (!player.getRoundHistory("sourceDamage").length) {
				return false;
			}
			if (player.hasSkill("mjsgongguanzhuhou_mark")) {
				return true;
			}
			return !game.hasPlayer(target => {
				if (target == player) return false;
				return target.getRoundHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0) > player.getRoundHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0);
			});
		},
		async content(event, trigger, player) {
			await player.gainMaxHp();
			lib.skill.mjsallsha.change(player, 1);
		},
		group: "mjsgongguanzhuhou_record",
		subSkill: {
			record: {
				trigger: {
					global: "damageSource",
				},
				silent: true,
				filter(event, player) {
					if (!player.hasSkill("mjsgongguanzhuhou_mark")) {
						return event.source == player && lib.skill.mjsgongguanzhuhou.filter(event, player);
					}
					return event.source != player && !lib.skill.mjsgongguanzhuhou.filter(event, player);
				},
				async content(event, trigger, player) {
					const skill = "mjsgongguanzhuhou_mark";
					player[player.hasSkill(skill) ? "removeSkill" : "addSkill"](skill);
				},
			},
			mark: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "冠",
				intro: {
					content: "已获得“冠”标记",
				},
			},
		},
	},
	/**大喜过望
	 * 每轮开始时，你将手牌摸至全场最多。
	 * */
	mjsdaxiguowang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "roundStart",
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		priority: 15,
		filter(event, player) {
			return !player.isMaxHandcard();
		},
		async content(event, trigger, player) {
			const target = game.findPlayer(current => current.isMaxHandcard());
			if (target?.isIn()) {
				await player.drawTo(target.countCards("h"));
			}
		},
		ai: {
			nokeep: true,
		},
	},
	//虞姬
	/**美人
	 * 登场，你选择一名男性角色，其替你承担所有伤害；当其受到致命伤害时，改为你失去等量的体力值，然后令其回复1点体力，并添加1张阵前对决到其手牌。
	 * */
	mjsmeiren: {
		audio: "ext:名将杀/audio/skill:6",
		logAudio: index => "ext:名将杀/audio/skill/mjswushuangfeijiang" + (typeof index === "number" ? index : get.rand(1, 6)) + ".mp3",
		onremove(player, skill) {
	        player.removeSkill(`${skill}_effect`);
	    },
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		silent: true,
		forced: false,
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.hasSex("male")) && (event.name != "phase" || game.phaseNumber == 0);
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(current => {
				return current != player && current.hasSex("male");
			});
			if (!targets.length) {
				return;
			}
			/*if (targets.length == 1) {
				event.result = {
					bool: true,
					targets: targets,
				};
				return;
			}*/
			event.result = await player
				.chooseTarget(`请选择1名替你承担伤害的男性角色发动${get.translation(event.skill)}，当其受到致命伤害时，改为你失去等量的体力值`, true, function (card, player, target) {
					return get.event().targets.includes(target);
				})
				.set("targets", targets)
				.set("ai", function (target) {
					let att = get.attitude(_status.event.player, target);
					if (att > 0) {
						return att + 1;
					}
					if (att == 0) {
						return Math.random();
					}
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
			const skill = event.name + "_effect";
			delete player.storage[skill];
	        player.addSkill(skill);
	        player.markAuto(skill, [target]);
	        player.addTip(skill, get.translation(skill) + " " + player.getStorage(skill).reduce((str, target) => str + get.translation(target), ""), false, { whiteSpace: "nowrap" });
		},
		ai: {
			halfneg: true,
		},
		subSkill: {
			effect: {
				audio: "mjsmeiren",
				trigger: {
					player: "damageBegin3",
					global: "damageBegin4",
				},
				silent: true,
				popup: false,
	            forced: true,
	            locked: false,
				filter(event, player, name) {
					if (name == "damageBegin3") {
						return game.hasPlayer(target => {
							return player.hasStorage("mjsmeiren_effect", target);
						});
					}
					return player.hasStorage("mjsmeiren_effect", event.player) && event.num >= event.player.getHp(true);
				},
				async content(event, trigger, player) {
					if (event.triggername == "damageBegin3") {
						const target = game.findPlayer(target => player.hasStorage(event.name, target));
						if (target?.isIn()) {
							player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
							trigger.player = target;
							player.line(target);
						}
					} else {
						const target = trigger.player;
						player.logSkill(event.name, target, null, null, [get.rand(5, 6)]);
						trigger.cancel();
						await player.loseHp(trigger.num);
						await target.recover();
						const card = game.createCard("mjszhenqianduijue", "diamond", 5);
						if (card) {
							await target.gain(card, "gain2");
						}
					}
				},
				mark: true,
				intro: {
					markcount: () => 0,
					content: "$替你承担所有伤害；当其受到致命伤害时，改为你失去等量的体力值，然后令其回复1点体力，并添加1张阵前对决到其手牌",
				},
			},
		},
	},
	/**霸王别姬
	 * 阵亡，你令一名男性角色立即进行回合。
	 * */
	mjsbawangbieji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "die",
		},
		popup: false,
		forceDie: true,
		filter(event, player) {
			return game.hasPlayer(target => target.hasSex("male"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(`${mjs.prompt(event.skill)}, 令一名男性角色立即进行回合`, (card, player, target) => {
					return target != player && target.hasSex("male");
				})
				.set("ai", target => {
					const player = get.player();
					let att = get.attitude(player, target);
					if (att > 0) {
						return att + 1;
					}
					if (att == 0) {
						return Math.random();
					}
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const evt = trigger.getParent("phase", true);
			if (evt) {
				game.log(_status.currentPhase, "结束了回合");
				evt.num = evt.phaseList.length;
				evt.goto(11);
			}
			target.insertPhase();
		},
		ai: {
			expose: 0.5,
		},
	},
	//钟离眜
	/**飞连矢
	 * 你的杀可以额外选择1个目标。然后若此杀造成的总伤害＞1，你摸2张牌，若目标未受到此杀伤害，你随机弃置其1张装备牌或手牌。
	 * 1.额外选择的目标需要在攻击范围内。
	 * 2.武器牌的效果对额外目标生效。
	 * 3.打出的杀造成的总伤害值＞1就可以摸2张牌，即使是只对其中一名目标造成了伤害。
	 * */
	mjsfeilianshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:3",
		logAudio: index => "ext:名将杀/audio/skill/mjsfeilianshi" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		trigger: {
			player: "useCard2",
		},
		popup: false,
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return game.hasPlayer(target => {
				return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					const event = get.event().getTrigger();
					return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
				})
				.set("ai", target => {
					const player = get.event().player,
						trigger = get.event().getTrigger();
					return get.effect(target, trigger.card, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, event.targets, null, null, [1]);
			trigger.targets.addArray(event.targets);
			return;

			player
				.when("useCardAfter")
				.filter(evt => evt.card == trigger.card)
				.then(async (event, trigger, player) => {
					const num = player.getHistory("sourceDamage", evt => evt.card == trigger.card).reduce((sum, evt) => sum + evt.num, 0);
					if (num > 1) {
						await player.draw(2);
					}
					const targets = trigger.targets.filter(target => {
						return !target.hasHistory("damage", evtx => evtx.card == trigger.card);
					});
					for (const target of targets) {
						const cards = target.getCards("h", card => {
							return lib.filter.cardDiscardable(card, target, "mjsfeilianshi");
						});
						if (cards.length > 0) {
							await target.discard(cards.randomGets(1)).set("discarder", target);
						}
					}
				});
		},
		group: "mjsfeilianshi_use",
		subSkill: {
			use: {
				trigger: {
					global: "useCardToAfter",
				},
				silent: true,
				filter(event, player) {
					return event.player == player && event.card.name == "sha";
				},
				async content(event, trigger, player) {
					const evtx = trigger.getParent();
					const target = trigger.target;
					if (!target.hasHistory("damage", evt => evt.card == evtx.card)) {
						player.logSkill("mjsfeilianshi", target, null, null, [3]);
						const cards = target.getCards("h", card => {
							return lib.filter.cardDiscardable(card, target, "mjsfeilianshi");
						});
						if (cards.length > 0) {
							await target.discard(cards.randomGets(1)).set("discarder", target);
						}
					} else {
						//打出的杀造成的总伤害值＞1就可以摸2张牌，即使是只对其中一名目标造成了伤害。
						if (player.hasHistory("sourceDamage", evt => evt.card == evtx.card && evt._mjsfeilianshi)) {
							return;
						}
						const num = player.getHistory("sourceDamage", evt => evt.card == evtx.card).reduce((sum, evt) => sum + evt.num, 0);
						if (num < 2) {
							return;
						}
						const history = player.getAllHistory("sourceDamage", evt => evt.card == evtx.card);
						if (history.length) {
							history[history.length - 1]._mjsfeilianshi = true;
						}
						player.logSkill("mjsfeilianshi", null, null, null, [2]);
						await player.draw(2);
					}
				},
			},
		},
	},
	/**骨鲠之臣
	 * 阵亡，你可以选择废除或重置一名其他角色的1个技能。
	 * 1.无法废除或重置因其他角色技能而持续获得的技能。
	 * 2.重置技能时，原技能已经生效的增益效果会保留，如破釜沉舟。
	 * 3.重置技能时，原技能的计数和状态会回到初始状态，需要在游戏开始时选择目标的技能也需要重新选择。
	 * */
	mjsgugengzhichen: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "die",
		},
		popup: false,
		forceDie: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (player.hasUnknown()) {
						return 0;
					}
					return Math.max(
						target
							.getSkills(null, false, false)
							.filter(skill => {
								const info = get.info(skill);
								if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
									return false;
								}
								if (att > 0) {
									return target.awakenedSkills.includes(skill);
								}
								return true;
							})
							.map(skill => {
								_status.event.skillRankPlayer = target;
								const num = get.skillRank(skill);
								delete _status.event.skillRankPlayer;
								return num;
							})
					);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const skills = target.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				if (!info || info.charlotte || !get.skillInfoTranslation(skill, target).length) {
					return false;
				}
				return true;
			});
			if (!skills.length) return;
			const list = [target.name];
			let num = 0,
				skillMap = {};
			for (const i of list) {
				if (skills.length > num) {
					num = skills.length;
				}
				skillMap[i] = skills;
			}
			if (num == 0) {
				return;
			}
			const id = lib.status.videoId++, prompt = `###${get.translation(event.name)}###选择要废除或重置的技能`;
			const func = (prompt2, id2, list, skillMap) => {
				const dialog2 = ui.create.dialog(prompt2);
				dialog2.classList.add("noupdate");
				dialog2.classList.add("addNewRow");
				dialog2.css({
					position: "absolute",
					top: get.is.phoneLayout() ? "5%" : "45%",
					height: "50%",
				});
				//算出来需要多少列，最多八列
				const num = 8;
				const column = Math.min(list.length, num);
				if (column > 6) {
					dialog2.css({
						width: "100%",
						left: 0,
					});
				}
				//重新创建一个容器，不然css之后会导致dialog2.content内的其他元素也加入到布局中
				const contentx = ui.create.div(".content", dialog2.content);
				contentx.css({
					display: "grid",
					gridTemplateColumns: `repeat(${column}, 1fr)`,
					width: "fit-content",
					margin: "auto",
				});
				//一个一个塞进去
				for (const i of list) {
					const div = ui.create.div(".buttons", contentx);
					const button = ui.create.button(i, "character", div);
					const skills = skillMap[i];
					//让角色和技能按钮水平居中垂直排列
					div.css({
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					});
					//角色因为不是可选按钮所以需要调整一下透明度
					button.style.setProperty("opacity", "1", "important");
					if (skills.length) {
						//创建技能按钮
						const buttons = ui.create.buttons(
							skills.map(i => [i, get.translation(i)]),
							"tdnodes",
							div
						);
						for (const button of buttons) {
							button.setNodeIntro(get.translation(button.link), get.skillInfoTranslation(button.link));
						}
						//丢进可选按钮中
						dialog2.buttons = dialog2.buttons.concat(buttons);
					}
				}
				dialog2.videoId = id2;
			};
			if (player.isOnline2()) {
				player.send(func, prompt, id, list, skillMap);
			} else {
				func(prompt, id, list, skillMap);
			}
			const finish = () => {
				if (player.isOnline2()) {
					player.send("closeDialog", id);
				}
				game.broadcastAll("closeDialog", id);
				delete _status.noclearcountdown;
				if (!_status.noclearcountdown) {
					game.stopCountChoose();
				}
			};
			while (true) {
				const result = await player
					.chooseButton(true)
					.set("dialog", id)
					.set("ai", button => {
						const target = get.player();
						_status.event.skillRankPlayer = target;
						let eff = get.skillRank(button.link);
						delete _status.event.skillRankPlayer;
						return eff;
					})
					.forResult();
				const skill = result.links[0];
				const func2 = function (skill2, id2) {
					const dialog2 = get.idDialog(id2);
					if (dialog2) {
						for (let i = 0; i < dialog2.buttons.length; i++) {
							if (dialog2.buttons[i].link == skill2) {
								dialog2.buttons[i].classList.add("selectedx");
							} else {
								dialog2.buttons[i].classList.add("unselectable");
							}
						}
					}
				};
				if (player.isOnline2()) {
					player.send(func2, skill, id);
				} else if (player == game.me) {
					func2(skill, id);
				}
				const list2 = ["重置", "废除"];
				const result2 = await player
					.chooseControl(list2, "返回")
					.set("ai", () => {
						return get.event().choice;
					})
					.set(
						"choice",
						(function () {
							const att = get.attitude(player, target);
							if (att > 0) {
								return "重置";
							}
							return "废除";
						})()
					)
					.forResult();
				if (result2.control == "返回") {
					const func2 = function (skill2, id2) {
						const dialog2 = get.idDialog(id2);
						if (dialog2) {
							for (let i = 0; i < dialog2.buttons.length; i++) {
								dialog2.buttons[i].classList.remove("selectedx");
								dialog2.buttons[i].classList.remove("unselectable");
							}
						}
					};
					if (player.isOnline2()) {
						player.send(func2, skill, id);
					} else if (event.isMine()) {
						func2(skill, id);
					}
				} else {
					finish();
					await target.removeSkills(result.links);
					if (result2.control == "重置") {
						const createSkills = mjs.addCreateSkills(result.links);
						await target.addSkills(createSkills);
					}
					return;
				}
			}
		},
		ai: {
			threaten(player, target) {
				if (target.hp == 1) {
					return 0.2;
				}
				return 1.5;
			},
		},
	},
	//荀彧
	/**二虎竞食
	 * 限定，你令一名其他角色可以对另一名其他角色打出1张杀，若造成伤害，随机获得对方1张牌，然后对方重复此过程，直到其中一方不打出杀。
	 * */
	mjserhujingshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		filter(event, player) {
			return game.countPlayer() > 2;
		},
		limited: true,
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		multitarget: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			event.source = event.targets[0];
			event.turn = event.targets[1];
			while (true) {
				const next = event.source
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"是否对" + get.translation(event.turn) + "打出一张杀，若造成伤害，随机获得其1张牌"
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
					.set("sourcex", event.turn)
					.set("addCount", false);
				const result = await next.forResult();
				if (result?.bool) {
					if (
						event.source.hasHistory("sourceDamage", evt => {
							return evt.card && evt.getParent(4) == next && evt.player == event.turn;
						})
					) {
						const cards = event.turn.getGainableCards(event.source, "he");
						if (cards.length) {
							await event.source.gain(cards.randomGets(1), event.turn, "giveAuto", "bySelf");
						}
					}
				} else {
					break;
				}
				[event.source, event.turn] = [event.turn, event.source];
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (!ui.selected.targets.length) {
						return target.hasSha();
					} else {
						return get.effect(target, { name: "sha" }, ui.selected.targets[0], target);
					}
				},
			},
		},
	},
	/**驱虎吞狼
	 * 限定，你令两名其他角色进行阵前对决；然后选择另外一名其他角色，其可以对阵前对决中受伤的角色打出所有杀，直到目标重伤。
	 * */
	mjsquhutunlang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		enable: "phaseUse",
		filter(event, player) {
			return game.countPlayer() > 2;
		},
		limited: true,
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		targetprompt: ["先出杀", "后出杀"],
		multitarget: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const next = game.createEvent("mjszhenqianduijue");
			next.player = event.targets[1];
			next.target = event.targets[0];
			next.setContent(lib.card.mjszhenqianduijue.content);
			await next;
			const targets = game.filterPlayer(target => {
				return target.hasHistory("damage", evt => evt.getParent(event.name) == event);
			});
			if (!targets.length) return;
			const result = await player
				.chooseTarget(`请选择一名角色，其可以对${get.translation(targets)}打出所有杀`)
				.set("filterTarget", (card, player, target) => {
					if (target == player) return false;
					return !_status.event.getParent().targets.includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target) * target.countCards("h", "sha");
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.line(target);
				while (true) {
					const result = await target
						.chooseToUse("你可以对" + get.translation(targets) + "打出一张杀？", function (card, player, event) {
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
						.set("addCount", false)
						.forResult();
					if (!result?.bool) {
						break;
					}
					if (
						game.getGlobalHistory("everything", evt => {
							return evt.name == "dying" && targets.includes(evt.player);
						}).length
					) {
						break;
					}
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (ui.selected.targets.length == 0) {
						return -3;
					} else {
						return get.effect(target, { name: "mjszhenqianduijue" }, ui.selected.targets[0], target);
					}
				},
			},
			expose: 0.4,
			threaten: 3,
		},
	},
	/**荀令留香
	 * 受伤，你可以令一名角色摸2张牌，然后手牌上限+1。
	 * */
	mjsxunlingliuxiang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageEnd",
		},
		popup: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					return 2 * get.effect(target, { name: "draw" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			await target.draw(2);
			lib.skill.mjsallmax.change(player, 2);
		},
		ai: {
			maixie: true,
			effect: {
				target(card, player, target) {
					if (!get.tag(card, "damage")) {
						return;
					}
					if (target.hp + target.hujia < 2 || player.hasSkillTag("jueqing", false, target)) {
						return 2;
					}
					return [1, 0.8 * target.hp - 0.4];
				},
			},
		},
	},
	//曹操
	/**天不负我
	 * 受伤，获得对你造成伤害的牌，并且可以立即打出其中1张牌。
	 * */
	mjstianbufuwo: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:6",
		logAudio: index => "ext:名将杀/audio/skill/mjstianbufuwo" + (typeof index === "number" ? index : get.rand(1, 6)) + ".mp3",
		trigger: {
			player: "damageEnd",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
		},
		async content(event, trigger, player) {
			await player.gain(trigger.cards, "gain2");
			await player
				.chooseToUse(`${mjs.prompt(event.name)}, 你可以打出1张牌`, function (card) {
					if (!lib.filter.cardEnabled(card, _status.event.player, _status.event)) {
						return false;
					}
					return get.event().cards.includes(card);
				})
				.set("cards", trigger.cards)
				.set("addCount", false);
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage") && player != target) {
						var cards = card.cards,
							evt = _status.event;
						if (evt.player == target && card.name == "damage" && evt.getParent().type == "card") {
							cards = evt.getParent().cards.filterInD();
						}
						if (target.hp <= 1) {
							return;
						}
						if (get.itemtype(cards) != "cards") {
							return;
						}
						for (var i of cards) {
							if (get.name(i, target) == "tao") {
								return [1, 4.5];
							}
						}
						if (get.value(cards, target) >= 7 + target.getDamagedHp()) {
							return [1, 2.5];
						}
						return [1, 0.6];
					}
				},
			},
		},
	},
	/**挟天以令
	 * 出牌阶段限1次，翻开牌堆顶1张牌，然后令一名角色打出此牌，若其无法打出，你获得此牌并对其造成1点伤害。
	 * */
	mjsxietianyiling: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			const cards = get.cards();
			await game.cardsGotoOrdering(cards);
			game.log(player, "翻开牌堆顶的", cards);
			const card = cards[0];
			event.videoId = lib.status.videoId++;
			const createDialog = function (player, card, id) {
				const dialog = ui.create.dialog("forcebutton", true);
				dialog.classList.add("mj-flip");
				dialog.videoId = id;
				const buttons = ui.create.div(".buttons", dialog.content);
				buttons.appendChild(card);
				dialog.open();
				ui.create.cardSpinning(card);
			};
			const closeDialog = function (id) {
				const dialog = get.idDialog(id);
				if (dialog) {
					dialog.close();
				}
			};
			game.broadcastAll(createDialog, player, card, event.videoId);
			await game.delay(2);
			const result = await player
				.chooseTarget(`请选择令一名角色打出${get.translation(card)}，若其无法打出，你获得此牌并对其造成1点伤害`, true)
				.set("ai", target => {
					const { player, card } = get.event();
					if (!target.hasUseTarget(card, true, false)) {
						return player.getUseValue(card) + get.damageEffect(target, player, player) / 10;
					}
					return get.sgnAttitude(player, target) * target.getUseValue(card);
				})
				.set("card", card)
				.forResult();
			game.broadcastAll(closeDialog, event.videoId);
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.line(target);
				if (target.hasUseTarget(card, true, false)) {
					target.$gain2(card);
					await target.chooseUseTarget(card, true);
				} else {
					await player.gain(card, "gain2");
					await target.damage();
				}
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	/**天下归心
	 * 当其他角色阵亡时，你获得其所有牌。
	 * */
	mjstianxiaguixin: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "die",
		},
		filter(event) {
			return event.player.countCards("he") > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			event.togain = trigger.player.getCards("he");
			await player.gain(event.togain, trigger.player, "giveAuto", "bySelf");
		},
	},
	//典韦
	/**古之恶来
	 * 受伤，你造成的下一次伤害+1。
	 * */
	mjsguzhielai: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			player: "damageEnd",
		},
		forced: true,
		locked: false,
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		async content(event, trigger, player) {
			player.addSkill("mjsguzhielai_effect");
			player.addMark("mjsguzhielai_effect", 1, false);
		},
		subSkill: {
			effect: {
				audio: "mjsguzhielai",
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				//charlotte: true,
				onremove: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				mark: true,
				intro: {
					content: "你下一次造成的伤害+#",
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
		},
	},
	/**逐虎过涧
	 * 你可以弃置1张武器牌，与一名其他角色交换位置，然后对距离1以内的一名其他角色造成1点伤害。
	 * 交换位置：立即交换两个角色的座位号，但是不影响本轮游戏各角色的行动顺序
	 * */
	mjszhuhuguojian: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { subtype: "equip1" });
		},
		filterCard(card) {
			return get.subtype(card) == "equip1";
		},
		filterTarget(card, player, target) {
			return player != target;
		},
		seatRelated: "changeSeat",
		async content(event, trigger, player) {
			game.broadcastAll(
				function (target1, target2) {
					game.swapSeat(target1, target2);
				},
				player,
				event.target
			);
			const targets = game.filterPlayer(target => {
				return target != player && get.distance(player, target) <= 1;
			});
			if (!targets.length) return;
			const result = await player
				.chooseTarget(`${mjs.prompt(event.name)}, 你可以对距离1以内的一名其他角色造成1点伤害`, (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set("targets", targets)
				.set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player);
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				player.line(result.targets);
				await result.targets[0].damage();
			}
		},
		ai: {
			order: 5,
			result: {
				player(player, target) {
					if (player.hasUnknown()) {
						return 0;
					}
					var num = 0,
						current = player.next;
					while (true) {
						num -= get.sgn(get.attitude(player, current));
						if (current == target) {
							break;
						}
						current = current.next;
					}
					while (true) {
						if (current == player) {
							break;
						}
						num += get.sgn(get.attitude(player, current)) * 1.1;
						current = current.next;
					}
					return num;
				},
			},
		},
	},
	//郭嘉
	/**十胜十败
	 * 受伤，你可以摸2张牌，然后你可以交给一名其他角色至少1张手牌，并令其下个出牌阶段的出杀次数+1。
	 * 受伤，你可以摸2张牌，然后你可以交给一名其他角色任意张手牌，令其下回合出杀次数+1。
	 * */
	mjsshishengshibai: {
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsshishengshibai" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		nobracket: true,
		trigger: {
			player: "damageEnd",
		},
		popup: false,
		frequent: true,
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			await player.draw(2);
			const result = await player
				.chooseCardTarget({
					filterCard: true,
					filterTarget: lib.filter.notMe,
					selectCard: [1, Infinity],
					prompt: "你可以交给一名其他角色任意张手牌，令其下回合出杀次数+1",
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						var player = _status.event.player,
							card = ui.selected.cards[0];
						var val = target.getUseValue(card);
						if (val > 0) {
							return val * get.attitude(player, target) * 2;
						}
						return get.value(card, target) * get.attitude(player, target);
					},
				})
				.forResult();
			if (result?.bool && result.cards?.length && result.targets?.length) {
				game.trySkillAudio(event.name, player, true, null, null, [get.rand(3, 4)]);
				const target = result.targets[0];
				await player.give(result.cards, target);
				//获得牌的角色，下个回合出杀次数才会+1
				target.when("phaseUseBegin").then(() => {
					player.addTempSkill("mjsshishengshibai_sha");
					player.addMark("mjsshishengshibai_sha", 1, false);
				});
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
						if (!target.hasFriend()) {
							return;
						}
						let num = 1;
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
			threaten: 0.6,
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("mjsshishengshibai_sha");
						}
					},
				},
			},
		},
	},
	/**天妒奇才
	 * 回合开始时，卜卦，若结果不为♣，则受到1点伤害；若结果为♣，你获得卜卦牌。
	 * */
	mjstianduyingcai: {
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjstianduyingcai" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		nobracket: true,
		trigger: {
			player: "phaseBegin",
		},
		popup: false,
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			const next = player.judge(card => {
				if (get.suit(card) == "club") {
					return 4;
				}
				return -2;
			});
			next.set("callback", async event => {
				if (event.judgeResult.suit == "club") {
					if (get.position(event.judgeResult.card, true) == "o") {
						await player.gain(event.judgeResult.card, "gain2", "log");
					}
				}
			});
			next.judge2 = result => result?.bool;
			const result = await next.forResult();
			if (result?.bool) {
				game.trySkillAudio(event.name, player, true, null, null, [3]);
			} else {
				game.trySkillAudio(event.name, player, true, null, null, [4]);
				await player.damage("nosource");
			}
		},
		ai: {
			halfneg: true,
		},
	},
	/**遗策平辽
	 * 阵亡，你可以选择一名其他角色，令其对距离1以内的所有其他角色各造成1点伤害。
	 * */
	mjsyicepingliao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "die",
		},
		popup: false,
		forceDie: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player;
				})
				.set("ai", target => {
					const player = get.player();
					const targets = game
						.filterPlayer(current => {
							return target != current && get.distance(target, current) <= 1;
						})
						.sortBySeat(target);
					return targets.reduce((sum, current) => {
						sum += get.damageEffect(current, target, player);
						return sum;
					}, 0);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const source = event.targets[0];
			player.logSkill(event.name, source);
			const targets = game
				.filterPlayer(target => {
					return target != source && get.distance(source, target) <= 1;
				})
				.sortBySeat(source);
			for (const target of targets) {
				await target.damage(source);
			}
		},
	},
	//司马懿
	/**狼顾鹰视
	 * 回合开始时，每有一个没有杀的其他角色，你的手牌上限+1；每有一个没有闪的其他角色，你的出杀次数+1。
	 * */
	mjslangguyingshi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:3",
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const targets = game.filterPlayer(target => target != player && !target.countCards("h", "sha"));
			if (targets.length) {
				lib.skill.mjsallmax.change(player, targets.length);
				await player.gainMaxHp(targets.length);
			}
			const targets2 = targets.filter(target => target != player && !target.countCards("h", "shan"));
			if (targets2.length) {
				player.addTempSkill("mjslangguyingshi_sha", "phaseUseAfter");
				player.addMark("mjslangguyingshi_sha", targets2.length, false);
				game.log(player, "本回合的", "#g出杀次数", "#y+" + targets.length);
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjslangguyingshi_sha");
					},
				},
			},
		},
	},
	/**忍
	 * 限定，本局游戏所有角色每受到过2点伤害，你就可以摸1张牌。
	 * */
	mjsren: {
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		limited: true,
		filter(event, player) {
			return player.countMark("mjsren_counter") > 1;
		},
		prompt() {
			const num = Math.floor(get.player().countMark("mjsren") / 2);
			return `你可以摸${num}张牌。`;
		},
		async content(event, trigger, player) {
			const num = Math.floor(player.countMark("mjsren_counter") / 2);
			player.awakenSkill(event.name);
			player.unmarkSkill("mjsren_counter");
			await player.draw(num);
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					const num = player.countMark("mjsren_counter");
					return get.effect(player, { name: "draw" }, player) * num > 5;
				},
			},
		},
		group: "mjsren_counter",
		subSkill: {
			counter: {
				trigger: {
					global: "damageEnd",
				},
				popup: false,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addMark(event.name, trigger.num, false);
					player.markSkill(event.name);
				},
				intro: {
					content(storage, player, skill) {
						return `所有角色已累计受到过${player.countMark(skill)}点伤害，你可以摸${Math.floor(player.countMark(skill) / 2)}张牌`;
					},
				},
			},
		},
	},
	//许褚
	/**虎痴
	 * 受伤，摸1张牌，并将其转化为阵前对决，并且你可以立即对伤害来源打出此牌。
	 * 受伤，摸1张牌，并将其转化为阵前对决。
	 * */
	mjshuchi: {
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "damageEnd",
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const result = await player.draw().forResult();
			if (get.itemtype(result.cards) != "cards") return;
			for (const card of result.cards) {
				game.broadcastAll(function (card) {
					card.init(["diamond", 5, "mjszhenqianduijue"]);
				}, card);
			}
			if (!trigger.source?.isIn()) return;
			await player
				.chooseToUse(`${mjs.prompt(event.name)}，你可以立即对<span class="mj-playertext">${get.translation(trigger.source)}</span>打出1张牌`, function (card) {
					if (!lib.filter.cardEnabled(card, _status.event.player, _status.event)) {
						return false;
					}
					return get.event().cards.includes(card);
				})
				.set("cards", result.cards)
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("sourcex", trigger.source);
		},
	},
	/**卸甲酣战
	 * 限定，你弃置所有装备牌，每弃置1张装备牌，摸2张牌，出杀次数+1。
	 * */
	mjsxiejiahanzhan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { type: "equip" });
		},
		limited: true,
		filterCard(card) {
			return get.type(card) == "equip";
		},
		position: "he",
		selectCard: -1,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = event.cards.length;
			await player.draw(num * 2);
			lib.skill.mjsallsha.change(player, num);
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					return get.effect(player, { name: "draw" }, player, player) * player.countCards("h", { type: "equip" }) >= 3;
				},
			},
		},
	},
	//张辽
	/**逍遥止啼
	 * 回合开始时，你可以获得一名其他角色的1张手牌，然后令其本回合无法打出识破。
	 * */
	mjsxiaoyaozhiti: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		forced: false,
		popup: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countGainableCards(player, "h");
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "shunshou_copy", position: "h" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			player.logSkill(event.name, target);
			await player.gainPlayerCard(target, "h", true);
			target.addTempSkill("mjsxiaoyaozhiti_block");
		},
		subSkill: {
			block: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (card.name == "wuxie") return false;
					},
				},
			},
		},
	},
	/**白狼持麾
	 * 回合开始时，你可以标记一名角色，直到你的下回合开始，对其打出杀的角色摸1张牌。
	 * */
	mjsbailangchihui: {
		audio: "ext:名将杀/audio/skill:2",
		nobracket: true,
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		forced: false,
		popup: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					const eff = game
						.filterPlayer(current => {
							return current != target && get.attitude(player, target) >= 0;
						})
						.reduce((sum, current) => sum + get.effect(target, { name: "sha" }, current, player), 0);
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			player.addTempSkill("mjsbailangchihui_effect", { player: "phaseBegin" });
			player.markAuto("mjsbailangchihui_effect", [target]);
			target.addAdditionalSkill(`mjsbailangchihui_effect_${player.playerid}`, "mjsbailangchihui_mark");
		},
		subSkill: {
			effect: {
				trigger: {
					global: "useCardAfter",
				},
				forced: true,
				popup: false,
				charlotte: true,
				forceDie: true,
				onremove(player, skill) {
					game.countPlayer2(current => {
						current.removeAdditionalSkill(`${skill}_${player.playerid}`);
					}, true);
					delete player.storage[skill];
				},
				filter(event, player) {
					return event.card.name == "sha" && event.targets?.containsSome(...player.getStorage("mjsbailangchihui_effect"));
				},
				async content(event, trigger, player) {
					player.logSkill(event.name, trigger.player);
					trigger.player.draw();
				},
			},
			mark: {
				charlotte: true,
				mark: true,
				marktext: "麾",
				intro: {
					content: "对你打出杀的角色摸1张牌",
				},
				ai: {
					effect: {
						target_use(card, player, target) {
							if (card.name == "sha") {
								return [1, 0, 1, 1];
							}
						},
					},
				},
			},
		},
	},
	//甄宓
	/**倾国倾城
	 * 每个回合限1次，你的♠牌可以当作识破打出。你每累计打出3张♠牌，可以令最多两名角色各回复1点体力。
	 * */
	mjspianruojinghong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
	        aiValue(player, card, num) {
	            if (get.name(card) != "wuxie" && get.suit(card) != "spade") {
	              return;
	            }
	            var cards2 = player.getCards("hs", function(card2) {
	              return get.name(card2) == "wuxie" || get.suit(card2) == "spade";
	            });
	            cards2.sort(function(a, b) {
	              return (get.name(b) == "wuxie" ? 1 : 2) - (get.name(a) == "wuxie" ? 1 : 2);
	            });
	            var geti = function() {
	              if (cards2.includes(card)) {
	                return cards2.indexOf(card);
	              }
	              return cards2.length;
	            };
	            if (get.name(card) == "wuxie") {
	              return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
	            }
	            return Math.max(num, [6, 4, 3][Math.min(geti(), 2)]);
	        },
	        aiUseful() {
	            return lib.skill.mjspianruojinghong.mod.aiValue.apply(this, arguments);
	        },
	    },
	    locked: false,
		enable: "chooseToUse",
		usable: 1,
		viewAs: {
			name: "wuxie",
		},
		filterCard(card) {
			return get.suit(card) == "spade";
		},
		viewAsFilter(player) {
			if (!player.countCards("hes", { suit: "spade" })) return false;
			return true;
		},
		position: "hes",
		check(card) {
			return 8 - get.value(card);
		},
		prompt: "将一张♠牌当识破（无懈可击）使用",
		onremove: ["mjspianruojinghong_counter"],
		intro: {
			markcount(storage, player) {
				return player.countMark("mjspianruojinghong_counter");
			},
			content(storage, player) {
				return `已打出过${get.cnNumber(player.countMark("mjspianruojinghong_counter"))}张♠牌`;
			},
		},
		group: ["mjspianruojinghong_use", "mjspianruojinghong_counter"],
		subSkill: {
			use: {
				audio: "mjspianruojinghong",
				trigger: {
					player: ["useCardAfter", "respondAfter"],
				},
				popup: false,
				filter(event, player) {
					return event._mjspianruojinghong;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt(event.skill), [1, 2], "可以令最多两名角色各回复1点体力")
						.set("ai", target => {
							const player = get.player();
							return get.recoverEffect(target, player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					player.logSkill(event.name, event.targets);
					for (const target of event.targets) {
						await target.recover();
					}
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (get.suit(card) == "club") {
								return [1, 1];
							}
						},
					},
				},
			},
			counter: {
				trigger: {
					player: ["useCard1", "respond"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return get.suit(event.card) == "spade";
				},
				async content(event, trigger, player) {
					player.addMark("mjspianruojinghong_counter", 1, false);
					if (player.countMark("mjspianruojinghong_counter") % 3 === 0) {
						trigger._mjspianruojinghong = true;
					}
					player.markSkill("mjspianruojinghong");
				},
			},
		},
	},
	/**洛神赋
	 * 当你获得♠牌后，额外再摸等量牌；你的♠牌不计入手牌上限。
	 * */
	mjsluoshenfu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			ignoredHandcard(card, player) {
				if (get.suit(card) == "spade") return true;
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.suit(card) == "spade") return false;
			},
		},
		trigger: {
			player: "gainAfter",
			global: ["gameDrawAfter", "loseAsyncAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "gameDraw") return true;
			return event.getg && event.getg(player)?.some(card => get.suit(card) == "spade");
		},
		async content(event, trigger, player) {
			const cards = (trigger?.getg?.(player) ?? player.getCards("h")).filter(card => get.suit(card) == "spade");
			if (cards.length > 0) await player.draw(cards.length);
		},
	},
	//黄忠
	/**宝刀不老
	 * 回合开始时，随机获得1张武器牌，若牌堆中没有武器牌，改为获得1张杀。
	 * */
	mjsbaodaoweilao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			let card = get.cardPile2(
				card => {
					return get.subtype(card) == "equip1";
				},
				null,
				"random"
			);
			if (!card) {
				card = get.cardPile2("sha", null, "random");
			}
			if (card) {
				await player.gain(card, "draw");
			}
		},
	},
	/**百步穿杨
	 * 每个回合限1次，出杀，若你与目标距离大于1，则此杀强命，否则此杀伤害+1。
	 * */
	mjsbaibuchuanyang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "useCard",
		},
		usable: 1,
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			for (const target of trigger.targets) {
				if (get.distance(player, target) > 1) {
					trigger.directHit.push(target);
					game.log(target, "不可响应", trigger.card);
				} else {
					const id = target.playerid;
					const map = trigger.customArgs;
					if (!map[id]) {
						map[id] = {};
					}
					if (typeof map[id].extraDamage != "number") {
						map[id].extraDamage = 0;
					}
					map[id].extraDamage++;
					game.log(trigger.card, "对", target, "造成的伤害", "#y+1");
				}
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (arg?.target && arg?.card && arg.card.name == "sha") {
					return true;
				}
				return false;
			},
		},
	},
	/**骄兵之计
	 * 其他角色回合结束时，若其手牌数小于你，你可以立即对其打出1张杀或者下回合的出杀次数+1。
	 * */
	mjsjiaobingzhiji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			global: "phaseEnd",
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		filter(event, player) {
			return event.player != player && event.player.countCards("h") < player.countCards("h");
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					`${mjs.prompt(event.name)}，你可以对<span class="mj-playertext">${get.translation(target)}</span>打出1张杀，否则你下回合的出杀次数+1`
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
				.set("addCount", false)
				.set("sourcex", target)
				.forResult();
			if (!result?.bool) {
				game.log(player, "下回合的", "#g出杀次数", "#y+1");
				player
					.when("phaseBegin")
					.then(() => {
						player.addTempSkill("mjsjiaobingzhiji_sha");
						player.addMark("mjsjiaobingzhiji_sha", 1, false);
					});
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjsjiaobingzhiji_sha");
					},
				},
			},
		},
	},
	//刘备
	/**惟贤惟德
	 * 你可以交给其他角色任意张牌，令其下个回合首次出杀后摸1张牌，每因此交出1张牌，你回复1点体力。
	 * */
	mjsweixianweide: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		filterCard: true,
		position: "he",
		selectCard: [1, Infinity],
		allowChooseAll: true,
		discard: false,
		lose: false,
		delay: false,
		filterTarget(card, player, target) {
			return player != target;
		},
		check(card) {
			if (ui.selected.cards.length > 1) {
				return 0;
			}
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name == "du") {
				return 20;
			}
			const player = get.owner(card);
			let num = 0;
			const evt2 = _status.event.getParent();
			player.getHistory("lose", evt => {
				if (evt.getParent().skill == "rende" && evt.getParent(3) == evt2) {
					num += evt.cards.length;
				}
			});
			if (player.hp == player.maxHp || num > 1 || player.countCards("h") <= 1) {
				if (ui.selected.cards.length) {
					return -1;
				}
				const players = game.filterPlayer();
				for (let i = 0; i < players.length; i++) {
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
		async content(event, trigger, player) {
			const target = event.target;
			await player.give(event.cards, target);
			target.when("phaseBegin").then(() => {
				player.addTempSkill("mjsweixianweide_effect");
			});
			await player.recover(event.cards.length);
		},
		ai: {
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg && arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && player.hasCard(card => get.name(card) !== "tao", "h");
				}
			},
			order(skill, player) {
				if (player.isDamaged() && player.countCards("h") > 1) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						return target.hasSkillTag("nodu") ? 0 : -10;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					const nh = target.countCards("h");
					const np = player.countCards("h");
					if (player.isHealthy() || player.countCards("h") <= 1) {
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
							const players = game.filterPlayer();
							for (let i = 0; i < players.length; i++) {
								if (players[i] != player && get.attitude(player, players[i]) > 0) {
									return 0;
								}
							}
						}
					}
				},
			},
		},
		subSkill: {
			effect: {
				audio: "mjsweixianweide",
				trigger: {
					player: "useCard",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return event.card.name == "sha" && player.getHistory("useCard", evt => evt.card.name == "sha").indexOf(event) == 0;
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					player.draw();
				},
			},
		},
	},
	/**三顾茅庐
	 * 当你每累计主动交给一名其他角色3张牌后，你可以令其手牌上限+1或者下回合出杀次数+1。
	 * */
	mjssangumaolu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "mjssangumaoluEvent",
		},
		silent: true,
		popup: true,
		forced: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseControl("手牌上限", "出杀次数", "cancel2")
				.set("prompt", get.prompt2(event.skill, trigger.target))
				.set("ai", () => {
					const choice = get.event();
					if (typeof choice == "number") {
						return choice;
					}
					return "cancel2";
				})
				.set(
					"choice",
					(() => {
						const cards = trigger.target.countCards("h", card => {
							return card.name == "sha" && trigger.target.getUseValue(card) > 0;
						});
						if (cards.length > 1) {
							return 1;
						}
						if (trigger.target.getHandcardLimit() <= 5) {
							return 0;
						}
						return get.rand(0, 1);
					})()
				)
				.forResult();
			if (event.result?.index != 2) {
				event.result.cost_data = event.result.index;
			}
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (event.cost_data == 0) {
				lib.skill.mjsallmax.change(target, 1);
			} else {
				game.log(target, "下回合的", "#g出杀次数", "#y+1");
				target.when("phaseUseBegin").then(() => {
					player.addTempSkill("mjssangumaolu_sha");
					player.addMark("mjssangumaolu_sha", 1, false);
				});
			}
		},
		group: "mjssangumaolu_counter",
		subSkill: {
			counter: {
				trigger: {
					global: ["gainEnd", "loseAsyncEnd"],
				},
				silent: true,
				charlotte: true,
				firstDo: true,
				getIndex(event, player) {
					if (event.name !== "loseAsync") {
						return [event.player];
					} else {
						return game.filterPlayer(current => current != player && event.getg(current).length > 0).sortBySeat();
					}
				},
				filter(event, player, triggername, target) {
					if (!target.isIn()) {
						return false;
					}
					if (event.giver !== player) {
						return false;
					}
					if (event.name === "gain") {
						return event.player != player && event.getg(target).length > 0;
					}
					return game.hasPlayer(current => current != player && event.getg(current).length > 0);
				},
				logTarget(event, player, triggername, target) {
					return target;
				},
				async content(event, trigger, player) {
					const target = event.indexedData;
					let num = trigger.getg(target).length;
					player.storage[event.name] ??= new Map();
					if (player.storage[event.name].has(target)) {
						num += player.storage[event.name].get(target);
					}
					player.storage[event.name].set(target, num);
					while (player.storage[event.name].get(target) >= 3) {
						player.storage[event.name].set(target, player.storage[event.name].get(target) - 3)
						const next = game.createEvent("mjssangumaoluEvent");
						next.player = player;
						next.target = target;
						next.setContent("emptyEvent");
						await next;
					}
				},
			},
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("mjssangumaolu_sha");
						}
					},
				},
			},
		},
	},
	/**携民渡江
	 * 其他角色可以将其在弃牌阶段弃置的牌交给你，这些牌无法被打出或主动弃置，直到下一轮结束。
	 * */
	mjsxiemindujiang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		global: "mjsxiemindujiang_global",
		subSkill: {
			global: {
				mod: {
					cardEnabled2(card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("eternal_mjsxiemindujiang_tag")) {
							return false;
						}
					},
					cardDiscardable(card, player, event) {
						if (card.hasGaintag("eternal_mjsxiemindujiang_tag")) {
							return false;
						}
					},
					canBeDiscarded(card, player, target) {
						if (player == target && card.hasGaintag("eternal_mjsxiemindujiang_tag")) {
							return false;
						}
					},
				},
				trigger: {
					player: ["loseAfter"],
					global: ["loseAsyncAfter"],
				},
				popup: false,
				locked: false,
				filter(event, player) {
					if (event.type !== "discard") {
						return false;
					}
					const evt = event.getParent("phaseDiscard");
					const evt2 = event.getl(player);
					return evt?.name === "phaseDiscard" && evt?.player === player && evt2?.cards2?.filterInD("d");
				},
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(target => {
						return target != player && target.hasSkill("mjsxiemindujiang");
					});
					if (!targets.length) {
						return;
					}
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "将弃置的牌交给一名其他角色", (card, player, target) => {
							return get.event().targets.includes(target);
						})
						.set("ai", target => {
							const player = get.player();
							const trigger = _status.event.getTrigger();
							const cards = trigger.getl(player).cards2.filterInD("d");
							var val = 0;
							for (var card of cards) {
								val += target.getUseValue(card);
							}
							return val * get.attitude(player, target);
						})
						.set("targets", targets)
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					target.logSkill("mjsxiemindujiang", player);
					const cards = trigger.getl(player).cards2.filterInD("d");
					const gainEvent = target.gain(cards, "gain2");
					gainEvent.giver = player;
					await gainEvent;
					target.addGaintag(cards, "eternal_mjsxiemindujiang_tag");
					target.when({ global: "roundEnd" }).then(async (event, trigger, player) => {
						target
							.when({ global: "roundEnd" })
							.filter(evt => evt != trigger)
							.then(async () => {
								game.broadcastAll(
									cards => {
										for (const card of cards) {
											card.removeGaintag("eternal_mjsxiemindujiang_tag");
										}
									},
									cards
								);
								return;
								game.countPlayer(current => {
									current.removeGaintag("eternal_mjsxiemindujiang_tag", cards);
								});
							});
					});
				},
			},
			tag: {
				name: "民",
			},
		},
	},
	//马超
	/**凉州铁骑
	 * 你的杀具有封禁；回合开始时，随机获得1张坐骑牌，若牌堆中没有坐骑牌，改为获得1张杀。
	 * */
	mjsliangzhoutieji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["控制", "增益"],
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		popup: true,
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			let card = get.cardPile2(
				card => {
					const type = get.subtype(card);
					return type == "equip3" || type == "equip4" || type == "equip6";
				},
				null,
				"random"
			);
			if (!card) card = get.cardPile2("sha", null, "random");
			if (card) {
				await player.gain(card, "draw");
			}
		},
		group: "mjsliangzhoutieji_use",
		subSkill: {
			use: {
				audio: "mjsliangzhoutieji",
				trigger: {
					player: "useCardToPlayer",
				},
				silent: true,
				popup: true,
				forced: true,
				locked: false,
				filter(event, player) {
					return event.card.name == "sha";
				},
				logTarget: "target",
				async content(event, trigger, player) {
					trigger.target.addTempSkill("mjs_debuff_fengjin");
				},
				ai: {
					ignoreSkill: true,
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (tag == "directHit_ai") {
							return arg?.target && get.attitude(player, arg.target) <= 0;
						}
						if (!arg || arg.isLink || !arg.card || arg.card.name != "sha") {
							return false;
						}
						if (!arg.target) {
							return false;
						}
						if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || lib.skill[arg.skill].persevereSkill || !arg.target.getSkills(true, false).includes(arg.skill)) {
							return false;
						}
					},
				},
			},
		},
	},
	/**锦狮子
	 * 当你打出装备牌时，你可以与一名其他角色交换位置；然后距离1以内每存在一名被封禁的角色，你的出杀次数+1。
	 * */
	mjsjinshizi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制", "增益"],
		trigger: {
			player: ["useCard", "respond"],
		},
		silent: true,
		forced: false,
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			return get.type(event.card) == "equip";
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					var num = 0,
						current = player.next;
					while (true) {
						num -= get.sgn(get.attitude(player, current));
						if (current == target) {
							break;
						}
						current = current.next;
					}
					while (true) {
						if (current == player) {
							break;
						}
						num += get.sgn(get.attitude(player, current)) * 1.1;
						current = current.next;
					}
					return num;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			game.broadcastAll(
				function (target1, target2) {
					game.swapSeat(target1, target2);
				},
				player,
				target
			);
			const targets = game.filterPlayer(target => {
				return get.distance(player, target) <= 1 && target.hasSkill("mjs_debuff_fengjin");
			});
			if (targets.length) {
				lib.skill.mjsallsha.change(player, targets.length);
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("mjsjinshizi_sha");
						}
					},
				},
			},
		},
	},
	//孙尚香
	/**枭姬娘娘
	 * 装备上限+1；当你的装备区获得或失去装备牌时，摸1张牌。
	 * */
	mjsxiaojiniangniang: {
		audio: "ext:名将杀/audio/skill:6",
		nobracket: true,
		/*mod: {
			maxEquipBase: (player, num) => num + 1,
		},*/
		init(player) {
			player.mjsExpandEquip();			
		},
		onremove(player) {
			player.mjsContractEquip();
		},
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			const evt = event.getl(player);
			if (event.name == "equip" && event.player == player) {
				return true;
			}
			return evt && evt.es.length;
		},
		getIndex(event, player) {
			const evt = event.getl(player);
			if (event.name == "equip" && event.player == player && evt && evt.es.length) {
				return 2;
			}
			return 1;
		},
		async content(event, trigger, player) {
			player.draw();
		},
		ai: {
			noe: true,
			reverseEquip: true,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
						return [1, 3];
					}
				},
			},
		},
	},
	/**刀剑情缘
	 * 出牌阶段限1次，你可以弃置1张牌，令你和一名男性角色回复1点体力，若体力已满，随机获得1张装备牌。
	 * */
	mjsdaojianqingyuan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") && game.hasPlayer(target => lib.skill.mjsdaojianqingyuan.filterTarget(null, player, target));
		},
		filterCard: true,
		position: "he",
		check(card) {
			const player = get.owner(card);
			if (player.countCards("h") > player.hp) {
				return 8 - get.value(card);
			}
			if (player.isDamaged()) {
				return 6 - get.value(card);
			}
			return 4 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (target == player || !target.hasSex("male")) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const targets = [player, ...event.targets];
			for (const target of targets) {
				if (target.isHealthy()) {
					const card = get.cardPile(
						card => {
							return get.type(card) == "equip";
						},
						null,
						"random"
					);
					if (card) await target.gain(card, "draw");
				} else {
					await target.recover();
				}
			}
		},
		ai: {
			threaten: 2,
			order() {
				var player = get.player();
				var es = player.getCards("e");
				for (var i = 0; i < es.length; i++) {
					if (player.countCards("h", { subtype: get.subtype(es[i]) })) {
						return 10;
					}
				}
				return 2;
			},
			result: {
				player(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					let card = ui.selected.cards[0],
						val = -get.value(card, player) / 6;
					if (get.position(card) == "e") {
						val += 2;
					}
					if (player.hp > target.hp) {
						val++;
					} else if (player.hp < target.hp && player.isDamaged()) {
						val += get.recoverEffect(player, player, player) / get.attitude(player, player);
					}
					return val;
				},
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					let card = ui.selected.cards[0],
						val = get.position(card) == "e" ? get.value(card, target) / 6 : 0;
					if (player.isDamaged()) {
						val += get.recoverEffect(player, player, player);
					}
					if (target.isDamaged()) {
						val += get.recoverEffect(target, target, target) / get.attitude(target, target);
					}
					return val;
				},
			},
		},
	},
	//张飞
	/**万人敌
	 * 回合开始时，添加随机花色的杀到手牌上限。杀伤，本回合出杀次数+1。
	 * */
	mjswanrendi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			player: "phaseBegin",
			source: "damageSource",
		},
		silent: true,
		popup: true,
		filter(event, player) {
			if (event.name == "phase") {
				return player.countCards("h") < player.getHandcardLimit();
			}
			return event.card?.name == "sha";
		},
		async content(event, trigger, player) {
			if (trigger.name == "phase") {
				const cards = [];
				while (cards.length < player.getHandcardLimit() - player.countCards("h")) {
					const card = get.cardPile(card => {
						return card.name == "sha" && !cards.includes(card);
					});
					if (card) cards.push(card);
					else break;
				}
				if (cards.length) {
					await player.gain(cards, "draw");
				}
			} else {
				player.addTempSkill("mjswanrendi_sha");
				player.addMark("mjswanrendi_sha", 1, false);
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjswanrendi_sha");
					},
				},
			},
		},
	},
	/**喝断当阳
	 * 应战，随机弃置目标1张牌，若此杀没有对你造成伤害，令目标本回合无法再打出牌。
	 * */
	mjsheduandangyang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		trigger: {
			target: "useCardToTarget",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return event.card?.name == "sha";
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			const cards = target.getCards("h", card => {
				return lib.filter.cardDiscardable(card, target, "mjsheduandangyang");
			});
			if (cards.length > 0) {
				await target.discard(cards.randomGets(1)).set("discarder", target);
			}
			player
				.when({ global: "useCardAfter" })
				.filter(evt => evt.card == trigger.card)
				.then(async (event, trigger, player) => {
					if (player.hasHistory("damage", evt => evt.card == trigger.card)) {
						return;
					}
					trigger.player.addTempSkill("mjsheduandangyang_block");
				});
		},
		ai: {
			yingzhan: true,
		},
		subSkill: {
			block: {
				charlotte: true,
				mark: true,
				marktext: "禁",
				mod: {
					cardEnabled2: () => false,
				},
				intro: {
					content: "不能打出牌",
				},
			},
		},
	},
	/**嗜酒如命
	 * 你可以将杀当作酒打出。
	 * */
	mjsshijiuruming: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: "chooseToUse",
		viewAs: {
			name: "jiu",
		},
		viewAsFilter(player) {
			if (!player.countCards("hs", { name: "sha" })) {
				return false;
			}
			return true;
		},
		filterCard(card) {
			return card.name == "sha";
		},
		prompt: "你可以将杀当作酒打出",
		check(card) {
			if (_status.event.type == "dying") {
				return 1 / Math.max(0.1, get.value(card));
			}
			return 6 - get.value(card);
		},
	},
	//赵云
	/**枪出如龙
	 * 出杀，摸1张牌；你的闪可以当作杀打出。
	 * */
	mjsqiangchurulong: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: ["chooseToUse", "chooseToRespond"],
		viewAs: {
			name: "sha",
		},
		viewAsFilter(player) {
			if (!player.countCards("hs", "shan")) {
				return false;
			}
		},
		filterCard: {
			name: "shan",
		},
		position: "hs",
		prompt: "将一张闪当杀打出",
		check() {
			return 1;
		},
		group: "mjsqiangchurulong_use",
		subSkill: {
			use: {
				audio: "mjsqiangchurulong",
				trigger: {
					player: "useCard",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					player.draw();
				},
			},
		},
	},
	/**浑身是胆
	 * 闪避，你可以立即打出1张杀；你的杀可以当作闪打出。
	 * */
	mjshunshenshidan: {
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjshunshenshidan" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		nobracket: true,
		enable: ["chooseToUse", "chooseToRespond"],
		viewAs: {
			name: "shan",
		},
		viewAsFilter(player) {
			if (!player.countCards("hs", "sha")) {
				return false;
			}
		},
		filterCard: {
			name: "sha",
		},
		position: "hs",
		prompt: "将一张杀当闪打出",
		check() {
			return 1;
		},
		log: false,
		async precontent(event, trigger, player) {
			player.logSkill("mjshunshenshidan", null, null, null, [get.rand(3, 4)]);
		},
		group: "mjshunshenshidan_use",
		subSkill: {
			use: {
				audio: ["ext:名将杀/audio/skill/mjshunshenshidan1", "ext:名将杀/audio/skill/mjshunshenshidan2"],
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					return event.card.name == "shan";
				},
				async cost(event, trigger, player) {
					const result = await player
						.chooseToUse(`###${get.prompt(event.skill)}###你可以打出1张杀`)
						.set("filterCard", function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						})
						.set("addCount", false)
						.set("chooseonly", true)
						.forResult();
					event.result = { bool: result.bool, cost_data: { result } };
				},
				async content(event, trigger, player) {
					const {
						cost_data: { result },
					} = event;
					await player.useResult(result, event);
				},
			},
		},
	},
	/**七进七出
	 * 你每累计打出3张杀或闪后，你的手牌上限+1，每个出牌阶段的出杀次数+1。
	 * 你每累计打出7张杀或闪后，你的手牌上限+1，每个出牌阶段的出杀次数+1。
	 * */
	mjsqijinqichu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event._mjsqijinqichu;
		},
		async content(event, trigger, player) {
			player.addSkill("mjsqijinqichu_effect");
			player.addMark("mjsqijinqichu_effect", 1, false);
		},
		intro: {
			markcount(storage, player) {
				return player.countMark("mjsqijinqichu_counter");
			},
			content(storage, player) {
				return `已打出过${get.cnNumber(player.countMark("mjsqijinqichu_counter"))}张杀和闪`;
			},
		},
		group: "mjsqijinqichu_counter",
		subSkill: {
			counter: {
				trigger: {
					player: ["useCard1", "respond"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return ["sha", "shan"].includes(event.card.name);
				},
				async content(event, trigger, player) {
					player.addMark("mjsqijinqichu_counter", 1, false);
					if (player.countMark("mjsqijinqichu_counter") % 3 === 0) {
						trigger._mjsqijinqichu = true;
					}
					player.markSkill("mjsqijinqichu");
				},
			},
			effect: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("mjsqijinqichu_effect");
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + player.countMark("mjsqijinqichu_effect");
					},
				},
			},
		},
	},
	//诸葛亮
	/**奇门遁甲
	 * 回合开始时，你为每名角色翻开1张牌堆顶的牌，然后你可以选择一名角色执行其对应的奇门效果，然后将其他牌按原顺序放回牌堆。
	 * 奇门效果包括：
	 * 点数1-开门：摸2张牌
	 * 点数2-惊门：随机弃置2张手牌
	 * 点数3-景门：获得1张战法牌
	 * 点数4-伤门：受到1点无来源的雷电伤害
	 * 点数5-杜门：随机弃置1张装备
	 * 点数6-休门：手牌上限+1
	 * 点数7-生门：回复1点体力
	 * 点数8-死门：失去1点体力
	 * */
	mjsqimendunjia: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		derivation: "mjsqimendunjia_faq",
		trigger: {
			player: "phaseBegin",
		},
		silent: true,
		popup: true,
		async content(event, trigger, player) {
			const targets = game.filterPlayer().sortBySeat(player);
			const list = [];
			const cardList = get.cards(targets.length, true);
			for (const [index, card] of cardList.entries()) {
				list.push([targets[index], [card]]);
			}
			if (!list.length) {
                return;
            }
            await game.cardsGotoOrdering(cardList);
            for (const info of list) {
                const [target, cards] = info;
                if (!cards.length) {
                    continue;
                }
                const index = get.number(cards, false);
                const cardsetion = lib.skill.mjsqimendunjia.qimen.get(index)?.description || "无效果";
                player.$chooseToShowCards(cards, target, event, cardsetion);
            }
            const result = await player
	            .chooseTarget("你可以选择一名角色执行其对应的奇门效果", (card, player, target) => {
	            	return get.event().list.map(info => info[0]).includes(target);
	            })
	            .set("ai", target => {
	                const player = get.player();
	                const list2 = get.event().list.find(info => info[0] == target);
	                const index = get.number(list2[1], false);
	                const backups = lib.skill.mjsqimendunjia.qimen;
	                if (!Array.from(backups).map(info => info[0]).includes(index)) {
	                    return 0;
	                }
	                return backups.get(index).ai(player, target);
	            })
	            .set("list", list)
	            .forResult();
			for (const target of targets) {
                target.$chooseToHideCards();
            }
            if (result?.targets?.length) {
            	const [target] = result.targets;
            	const cards = list.find(info => info[0] == target)[1];
	            const index = get.number(cards, false);
	            cardList.removeArray(cards);
	            const cardsetion = lib.skill.mjsqimendunjia.qimen.get(index)?.description || "无效果";
				target.$gain2(cards, false, cardsetion);
				await game.delay();
				target.$throw(cards);
				await game.cardsDiscard(cards);
				const qimen = lib.skill.mjsqimendunjia.qimen;
				if (!Array.from(qimen).map(info => info[0]).includes(index)) {
					return;
				}
				const backups = Array.from(qimen).map(info => info[1]);
				const next = game.createEvent(event.name + "_qimen", false);
				next.player = player;
				next.target = target;
				next.setContent(qimen.get(index).content);
				await next;
            }
            cardList.reverse();
            game.addCardKnower(cardList, player);
            await game.cardsGotoPile(cardList, "insert");
		},
		qimen: new Map([
			[
				1,
				{
					name: "开门",
					description: "开：摸2张牌",
					async content(event, trigger, player) {
						const target = event.target;
						await target.draw(2);
					},
					ai(player, target) {
						return get.effect(target, { name: "wuzhong" }, player, player) / 8;
					},
				},
			],
			[
				2,
				{
					name: "惊门",
					description: "惊：随机弃置2张手牌",
					async content(event, trigger, player) {
						const target = event.target;
						const cards = target.getDiscardableCards(player, "h");
						if (cards.length) {
							await target.discard(cards.randomGets(2)).set("discarder", player);
						}
					},
					ai(player, target) {
						const att = get.sgnAttitude(player, target);
						return -att * Math.min(2, target.countDiscardableCards(player, "h"));
					},
				},
			],
			[
				3,
				{
					name: "景门",
					description: "景：获得1张战法牌",
					async content(event, trigger, player) {
						const target = event.target;
						const card = get.cardPile(card => {
							return get.type(card) == "trick";
						});
						if (card) await target.gain(card, "draw");
					},
					ai(player, target) {
						return get.attitude(player, target) / 5;
					},
				},
			],
			[
				4,
				{
					name: "伤门",
					description: "伤：受到1点无来源的雷电伤害",
					async content(event, trigger, player) {
						const target = event.target;
						await target.damage("thunder", "nosource");
					},
					ai(player, target) {
						return get.damageEffect(target, target, target, "thunder") / 5;
					},
				},
			],
			[
				5,
				{
					name: "杜门",
					description: "杜：随机弃置1张装备",
					async content(event, trigger, player) {
						const target = event.target;
						const cards = target.getDiscardableCards(player, "he", card => {
							return get.type(card) == "equip";
						});
						if (cards.length) {
							await target.discard(cards.randomGets(1)).set("discarder", player);
						}
					},
					ai(player, target) {
						const att = get.sgnAttitude(player, target);
						const eff = Math.min(1, target.countDiscardableCards(player, "he", { type: "equip" }));
						return -att * eff;
					},
				},
			],
			[
				6,
				{
					name: "休门",
					description: "休：手牌上限+1",
					async content(event, trigger, player) {
						const target = event.target;
						lib.skill.mjsallmax.change(target, 1);
					},
					ai(player, target) {
						return get.sgnAttitude(player, target) + target.needsToDiscard();
					},
				},
			],
			[
				7,
				{
					name: "生门",
					description: "生：回复1点体力",
					async content(event, trigger, player) {
						const target = event.target;
						await target.recover();
					},
					ai(player, target) {
						return get.recoverEffect(target, target, player) / 5;
					},
				},
			],
			[
				8,
				{
					name: "死门",
					description: "死：失去1点体力",
					async content(event, trigger, player) {
						const target = event.target;
						await target.loseHp();
					},
					ai(player, target) {
						return get.effect(target, { name: "losehp" }, player) / 5;
					},
				},
			],
		]),
	},
	/**锦囊妙计
	 * 出牌阶段开始时，选择1张专属战法牌添加到手牌。
	 * 选择：随机展示3个选择，选择其中1个执行效果
	 * 专属战法牌包括：
	 * 舌战群儒：本回合每打出1张战法牌，摸1张牌。
	 * 草船借箭：抵消即将受到的伤害，并获得即将对你造成伤害的牌。
	 * 七星祭风：直到你的下个回合开始，所有火焰伤害+1。
	 * 智取华容：标记1个角色，直到你的下回合开始，当其受到伤害后，其他角色若攻击范围内包含该角色，可以立即对其打出1张杀。
	 * 七擒七纵：在你即将造成伤害时打出，防止此伤害，改为获得目标2张牌。
	 * 空城计：选择一名角色，直到你的下个回合开始，当其没有手牌时，其无法成为手牌和技能的目标。
	 * 上方用火：选择1个目标，卜卦，若结果不是♠，对其造成1点火焰伤害。
	 * 借尸还魂：可以选择一名阵亡角色，选择获得其1个技能，直到你的下个回合开始。
	 * 1.锦囊妙计的八张专属战法牌属于一个独立的牌堆，当这些牌进入弃牌堆时，会改为进入独立的牌堆，而不是公共牌堆，所以这些牌被打出后，不会因为洗牌而再次被摸到。
	 * 2.每张专属战法牌只有1张，只有回到独立牌堆后，才可能被再次获得。
	 * 3.如果八张专属战法牌都在场上，则此技能发动时将不会再获得牌。
	 * 4.选择时，如果专属战法牌的牌堆中的牌不足3张，则只会显示剩余的所有牌。
	 * */
	mjsjinnangmiaoji: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:10",
		logAudio: index => "ext:名将杀/audio/skill/mjsjinnangmiaoji" + (typeof index === "number" ? index : get.rand(1, 10)) + ".mp3",
		derivation: "mjsjinnangmiaoji_faq",
		getList: ["mjsshezhanqunru", "mjscaochuanjiejian", "mjsqixingjifeng", "mjszhiquhuarong", "mjsqiqinqizong", "mjskongchengji", "mjsshangfangyonghuo", "mjsjieshihuanhun"],
		trigger: {
			player: ["phaseUseBegin", "phaseUseEnd"],
		},
		silent: true,
		forced: false,
		async cost(event, trigger, player) {
			const list = get.info(event.skill).getList.slice().randomGets(3);
			const cards = [];
			for (const name of list) {
				const number = 1 + list.indexOf(name);
				const suits = ["spade", "club", "heart", "diamond", "diamond", "spade", "heart", "club"];
				const suit = suits[list.indexOf(name)];
				const card = get.cardPile(name) || game.createCard2(name, suit, number);
				if (card) cards.push(card);
			}
			if (!cards.length) return;
			event.result = await player
				.chooseButtonTarget({
					createDialog: [get.translation(event.skill), cards],
					filterTarget: true,
					ai1(button) {
						const player = get.player();
						return player.getUseValue(button.link) + 1;
					},
					ai2(target) {
						const player = get.player();
						const card = ui.selected.buttons[0].link;
						if (card) {
							return get.value(card, target) * get.attitude(player, target);
						}
						return get.attitude(player, target);
					},
				})
				.forResult();
			if (event.result?.bool && event.result?.links?.length) {
				event.result.cards = event.result.links;
			}
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
			await target.gain(event.cards, "draw");
		},
	},
	//关羽
	/**万军取首
	 * 你的杀攻击范围无限，且目标手牌中每有1张杀，就获得伤害+1。
	 * */
	mjswanjunqushou: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "sha") return true;
			},
		},
		trigger: {
			source: "damageBegin1",
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player) {
			return event.card?.name == "sha";
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = target.countCards("h", { name: "sha" });
			trigger.num += num;
		},
		ai: {
			threaten: 0.5,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (arg?.target && arg?.card && arg.card.name == "sha" && arg.target.countCards("h", "sha")) {
					return true;
				}
				return false;
			},
		},
	},
	/**武圣义绝
	 * 你可以将任意牌当做杀打出。
	 * */
	mjswushengyijue: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		enable: ["chooseToRespond", "chooseToUse"],
		viewAs: {
			name: "sha",
		},
		viewAsFilter(player) {
			if (!player.countCards("hes")) {
				return false;
			}
		},
		filterCard: true,
		position: "hes",
		prompt: "将一张牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
	},
	/**水淹七军
	 * 每个回合限1次，当你打出的杀被闪抵消后，你随机获得1张♠牌。你可以弃置3张♠牌，令一名其他角色弃置所有牌并受到1点伤害，然后你失去此技能。
	 * */
	mjsshuiyanqijun: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { suit: "spade" }) >= 3;
		},
		filterCard(card) {
			return get.suit(card) == "spade";
		},
		check(card) {
			return 8 - get.value(card);
		},
		position: "he",
		selectCard: 3,
		filterTarget: lib.filter.notMe,
		prompt: "你可以弃置3张♠牌，令一名其他角色弃置所有牌并受到1点伤害，然后你失去此技能。",
		async content(event, trigger, player) {
			const [target] = event.targets;
			await target.modedDiscard(target.getCards("he"));
			await target.damage();
			await player.removeSkills(event.name);
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					const eff = get.damageEffect(target, player) / 5;
					return att * (target.countCards("he") + eff);
				},
			},
		},
		group: "mjsshuiyanqijun_use",
		subSkill: {
			use: {
				trigger: {
					player: "shaMiss",
				},
				usable: 1,
				forced: true,
				locked: false,
				filter(event) {
					return event.target.countCards("he") > 0;
				},
				async content(event, trigger, player) {
					const card = get.cardPile(
						card => {
							return get.suit(card) == "spade";
						},
						null,
						"random"
					);
					if (card) {
						await player.gain(card, "draw");
					}
				},
			},
		},
	},
	//大乔
	/**秋水伊人
	 * 应战，你可以摸1张牌，然后可以弃置1张♠牌，将此杀的目标转移给另一名其他角色。
	 * */
	mjsqiushuiyiren: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["摸牌", "防御"],
		trigger: {
			target: "useCardToTarget",
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			await player.draw();
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.name),
					prompt2: "你可以弃置一张♠牌，将此杀转移给另一名其他角色",
					position: "he",
					filterCard: (card, player) => {
						if (get.suit(card) != "spade") return false;
						return lib.filter.cardDiscardable(card, player, "mjsqiushuiyiren");
					},
					filterTarget: (card, player, target) => {
						const trigger = _status.event;
						if (target != trigger.source) {
							if (lib.filter.targetEnabled(trigger.card, trigger.source, target)) {
								return true;
							}
						}
						return false;
					},
					ai1: card => get.unuseful(card) + 9,
					ai2: target => {
						const player = get.player();
						if (player.countCards("h", "shan")) {
							return -get.attitude(player, target);
						}
						if (get.attitude(player, target) < 5) {
							return 6 - get.attitude(player, target);
						}
						if (player.hp == 1 && player.countCards("h", "shan") == 0) {
							return 10 - get.attitude(player, target);
						}
						if (player.hp == 2 && player.countCards("h", "shan") == 0) {
							return 8 - get.attitude(player, target);
						}
						return -1;
					},
					source: trigger.player,
					card: trigger.card,
				})
				.setHiddenSkill(event.name.slice(0, -5))
				.forResult();
			if (event.result?.bool) {
				const target = event.result.targets[0];
				await player.discard(event.result.cards);
				const evt = trigger.getParent();
				evt.triggeredTargets2.remove(player);
				evt.targets.remove(player);
				evt.targets.push(target);
			}
		},
		ai: {
			yingzhan: true,
			effect: {
				target_use(card, player, target) {
					if (target.countCards("he") == 0) {
						return;
					}
					if (card.name != "sha") {
						return;
					}
					let min = 1;
					const friend = get.attitude(player, target) > 0;
					const vcard = { name: "shacopy", nature: card.nature, suit: card.suit };
					const players = game.filterPlayer();
					for (let i = 0; i < players.length; i++) {
						if (player != players[i] && get.attitude(target, players[i]) < 0 && target.canUse(card, players[i])) {
							if (!friend) {
								return 0;
							}
							if (get.effect(players[i], vcard, player, player) > 0) {
								if (!player.canUse(card, players[0])) {
									return [0, 0.1];
								}
								min = 0;
							}
						}
					}
					return min;
				},
			},
		},
	},
	/**君生别离
	 * 登场，选择一名其他角色，当其受伤或弃牌后，你可以弃置另外一名其他角色任意区域的1张牌。
	 * 登场，你选择一名其他角色，当其弃置牌后，你可以弃置另外一名其他角色任意区域的1张牌。
	 * */
	mjsjunshengbieli: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制"],
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "changeSkillsAfter"],
		},
		popup: false,
		onremove(player, skill) {
			player.removeSkill(skill + "_effect");
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			if (event.name == "changeSkills") {
				return event.addSkill.includes("mjsjuncaoqibing");
			}
			return (event.name != "phase" || game.phaseNumber == 0);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(`选择1名其他角色发动${get.translation(event.skill)}，当其受伤或弃牌后，你可以弃置其他角色的1张牌`, lib.filter.notMe, true)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att < 0) {
						return 0;
					}
					return att + target.getSkills(null, false, false).length + 1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const skill = event.name + "_effect";
			delete player.storage[skill];
			player.addSkill(skill);
			player.markAuto(skill, [target]);
			player.addTip(skill, get.translation(skill).slice(0, 1) + " " + player.getStorage(skill).reduce((str, target) => str + get.translation(target), ""), false, { whiteSpace: "nowrap" });
		},
		subSkill: {
			effect: {
				audio: "mjsjunshengbieli",
				trigger: {
					global: ["damageEnd", "loseAfter", "loseAsyncAfter"],
				},
				getIndex(event, player) {
					if (event.name == "damage") return [event.player];
					if (event.type != "discard" || event.getlx === false) {
						return [];
					}
					return game
						.filterPlayer(target => {
							if (target == player) return false;
							return event.getl?.(target)?.cards2?.length;
						})
						.sortBySeat();
				},
				filter(event, player, triggername, target) {
					if (!player.hasStorage("mjsjunshengbieli_effect", target)) return false;
					return game.hasPlayer(current => {
						if (current == player) {
							return false;
						}
						return current != target && current.countDiscardableCards(player, "hej");
					});
				},
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "你可以弃置另外一名其他角色任意区域的1张牌", (card, player, target) => {
							if (target == player) {
								return false;
							}
							return target != get.event().getParent().indexedData && target.countDiscardableCards(player, "hej");
						})
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, { name: "guohe" }, player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					await player.discardPlayerCard(target, "hej", true);
				},
				mark: true,
				intro: {
					markcount: () => 0,
					content: "$受伤或弃置牌后，你可以弃置另外一名其他角色任意区域的1张牌",
				},
			},
		},
	},
	//甘宁
	/**百人夜袭
	 * 当你获得♠牌后，可以弃置一名其他角色的1张牌。
	 * */
	mjsbairenyexi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制"],
		trigger: {
			player: "gainAfter",
			global: ["gameDrawAfter", "loseAsyncAfter"],
		},
		popup: false,
		filter(event, player) {
			if (event.name == "gameDraw") {
				return player.countCards("h", { suit: "spade" });
			}
			return event.getg && event.getg(player)?.some(card => get.suit(card) == "spade");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countDiscardableCards(player, "he") > 0;
				})
				.set("ai", target => {
					return get.effect(target, { name: "guohe_copy2" }, _status.event.player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			await player.discardPlayerCard(target, "he", true);
		},
	},
	/**锦帆游侠
	 * 出牌阶段限1次，你可以将所有手牌的花色变为♠，并洗回牌堆，然后摸等量的牌。
	 * */
	mjsjinfanyouxia: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h");
		},
		filterCard: true,
		selectCard: -1,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			for (const card of event.cards) {
				game.broadcastAll(function (card) {
					card.init(["spade", card.number, card.name]);
				}, card);
			}
			player.$throw(event.cards.length, 100);
			game.log(player, "将", get.cnNumber(event.cards.length), "张牌洗回牌堆");
			await game.cardsGotoPile(event.cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});
			await player.draw(event.cards.length);
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					return 1;
				},
			},
		},
	},
	//鲁肃
	/**指囷相赠
	 * 回合开始时，将牌堆顶的4张牌放入粮仓；其他角色回合开始时，你可以令其随机获得粮仓中一半的牌；粮仓中每有1张牌，你的手牌上限+1。
	 * */
	mjszhiqunxiangzeng: {
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjszhiqunxiangzeng" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		nobracket: true,
		skill_tag: ["增益"],
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("mjszhiqunxiangzeng").length;
			},
		},
		trigger: {
			global: "phaseBegin",
		},
		popup: false,
		locked: false,
		filter(event, player) {
			return event.player == player || player.getExpansions("mjszhiqunxiangzeng").length;
		},
		async cost(event, trigger, player) {
			if (trigger.player == player) {
				event.result = { bool: true };
			} else {
				event.result = await player
					.chooseBool(get.prompt(event.skill, trigger.player), "令其随机获得粮仓中一半的牌")
					.set("ai", () => get.attitude(player, trigger.player) > 0)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (trigger.player == player) {
				player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
				const next = player.addToExpansion(get.cards(4), player, "give");
				next.gaintag.add(event.name);
				await next;
			} else {
				const target = trigger.player;
				player.logSkill(event.name, target, null, null, [get.rand(3, 4)]);
				const cards = player.getExpansions(event.name);
				const gains = cards.randomGets(Math.max(1, Math.floor(cards.length / 2)));
				const gainEvent = target.gain(gains, "draw");
				gainEvent.giver = player;
				await gainEvent;
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("mjszhiqunxiangzeng");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张牌";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("mjszhiqunxiangzeng");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张牌";
				}
			},
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
	},
	/**借州缔盟
	 * 出牌阶段限1次，你令两名其他角色进入结盟状态，直到你的下个回合开始。
	 * 结盟：结盟状态的两个角色在出牌阶段可以打出本回合开始时对方的手牌。
	 * */
	mjsjiezhoudimeng: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制", "增益"],
		global: "mjsjiezhoudimeng_record",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer() > 2;
		},
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		multitarget: true,
		async content(event, trigger, player) {
			for (const target of event.targets) {
				target.markAuto(event.name + "_use", event.targets.slice().remove(target));
				target.addAdditionalSkill(`${event.name}_use_${player.playerid}`, event.name + "_use");
			}
			player.markAuto(event.name + "_clear", event.targets);
			player.addTempSkill(event.name + "_clear", { player: "phaseBeforeStart" });
			player.addTempSkill(event.name + "_change", { player: "phaseBeforeStart" });
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					return 1;
				},
			},
		},
		subSkill: {
			tag: {
				name: "盟",
			},
			record: {
				trigger: {
					global: "phaseBegin",
				},
				firstDo: true,
				charlotte: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.setStorage(event.name, player.getCards("h"));
				},
			},
			clear: {
				charlotte: true,
				onremove(player, skill) {
					player.storage[skill].forEach(target => {
						target.unmarkAuto("mjsjiezhoudimeng_use", [player]);
						target.removeAdditionalSkill(`mjsjiezhoudimeng_use_${player.playerid}`);
					});
					delete player.storage[skill];
				},
			},
			change: {
				trigger: {
					global: ["loseEnd", "loseAsyncEnd", "gainEnd", "addToExpansionEnd", "equipEnd", "addJudgeEnd"],
				},
				silent: true,
				charlrotte: true,
				forceDie: true,
				filter(event, player) {
					return event.getg?.(player)?.length || event.getl?.(player)?.hs?.length;
				},
				async content(event, trigger, player) {
					const toAdd = [],
						toRemove = trigger.getl?.(player)?.hs || [];
					event.set("toAdd", toAdd);
					event.set("toRemove", toRemove);
					await event.trigger("mjsjiezhoudimengChange");
				},
			},
			use: {
				onremove(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("mjsjiezhoudimeng_tag"));
					game.deleteFakeCards(toRemove);
				},
				mark: true,
				intro: {
					content: "你可以如手牌般使用或打出<span class=thundertext>$</span>的手牌",
				},
				forced: true,
				popup: false,
				delay: false,
				charlotte: true,
				trigger: {
					player: ["useCardBefore", "respondBefore", "phaseUseBegin"],
					global: ["mjsjiezhoudimengChange"],
				},
				filter(event, player) {
					if (["useCard", "respond"].includes(event.name)) {
						const cards = player.getCards("s", card => card.hasGaintag("mjsjiezhoudimeng_tag"));
						return event.cards && event.cards.some(card => cards.includes(card));
					}
					return event.name == "phaseUse" || player.getStorage("mjsjiezhoudimeng_use").includes(event.player);
				},
				async content(event, trigger, player) {
					const tag = "mjsjiezhoudimeng_tag";
					if (["useCard", "respond"].includes(trigger.name)) {
						trigger.set("mjsjiezhoudimeng", true);
						const real = player.getStorage(event.name).reduce((cards, target) => {
							const hs = target.isAlive() && target.countCards("h") ? target.getCards("h") : [];
							return cards.addArray(hs);
						}, []);
						for (let i = 0; i < trigger.cards.length; i++) {
							const card = trigger.cards[i];
							const cardx = real.find(cardx => cardx.cardid == card._cardid);
							if (cardx) {
								trigger.cards[i] = cardx;
								trigger.card.cards[i] = cardx;
								trigger.throw = false;
								get.owner(cardx)?.$throw(cardx);
							}
						}
					} else if (trigger.name == "phaseUse") {
						const toRemove = player.getCards("s", card => card.hasGaintag("mjsjiezhoudimeng_tag"));
						game.deleteFakeCards(toRemove);
						const cards = player.getStorage(event.name).reduce((cards, target) => {
							const fake = target.isAlive() && target.countCards("h") ? game.createFakeCards(target.getCards("h", card => target.hasStorage("mjsjiezhoudimeng_record", card))) : [];
							return cards.addArray(fake);
						}, []);
						player.directgains(cards, null, "mjsjiezhoudimeng_tag");
						player.when({ global: "phaseUseAfter" }).then(() => {
							lib.skill.mjsjiezhoudimeng_use.onremove(player, "mjsjiezhoudimeng_use");
						});
					} else {
						game.deleteFakeCards(player.getCards("s", card => trigger.toRemove.find(cardx => cardx.cardid == card._cardid)));
						player.directgains(game.createFakeCards(trigger.toAdd), null, tag);
					}
				},
			},
		},
	},
	//陆逊
	/**火破连营
	 * 出牌阶段限1次，你可以交给一名其他角色1张牌，然后烧毁其任意区域内与此牌花色相同的所有牌，若烧毁的牌≥3张，对其造成1点火焰伤害。
	 * */
	mjshuopolianying: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制", "输出"],
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		check(card) {
			var val = 8;
			if (card.name == "shan") val += 10;
			return val - get.value(card);
		},
		filterTarget: lib.filter.notMe,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const [card] = event.cards,
				[target] = event.targets;
			await player.give(event.cards, target);
			const cards = target.getCards("hej", cardx => {
				if (!lib.filter.cardCombustible(card, target, "mjshuopolianying")) {
					return false;
				}
				return get.suit(card) == get.suit(cardx);
			});
			if (cards.length) {
				await target.lose(cards, "toBurnDown", ui.special);
				game.log(cards, "被烧毁了");
				if (cards.length >= 3) {
					await target.damage("fire");
				}
			}
		},
		ai: {
			order(item, player) {
				player = player || get.event().player;
				if (player.countCards("hs", "mjsliehuofencheng")) {
					return get.order({ name: "mjsliehuofencheng" }) + 0.5;
				}
				return 9;
			},
			result: {
				target(player, target) {
					const eff = get.damageEffect(target, player, target, "fire");
					return -target.countCards("hej") - (player.countCards("h", "du") ? 1 : 0);
				},
			},
			threaten: 2,
		},
	},
	/**解衣共舞
	 * 当你打出手牌后，若你的手牌数全场最低，摸1张牌。
	 * */
	mjsjieyigongwu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌"],
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (!player.isMinHandcard()) return false;
			return player.hasHistory("lose", function (evt) {
				return evt.hs?.length && evt.getParent() == event;
			});
		},
		async content(event, trigger, player) {
			player.draw();
		},
	},
	//孙策
	/**虎踞鹰扬
	 * 你每损失1点体力，摸牌阶段就额外摸1张牌。
	 * */
	mjshujuyingyang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: "phaseDrawBegin2",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (player.isHealthy()) return false;
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			trigger.num += player.getDamagedHp();
		},
		ai: {
			threaten(player, target) {
				if (target.hp == 1) {
					return 2;
				}
				return 0.5;
			},
		},
	},
	/**小霸王
	 * 出牌阶段开始/结束时，如果你的手牌数为全场最多，你可以选择一名其他角色进行阵前对决。
	 * 出牌阶段开始时，如果你的手牌数为全场最多，你可以选择一名其他角色进行阵前对决，若因此击杀目标，可以再选择一名其他角色进行阵前对决。
	 * */
	mjsxiaobawang: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["输出"],
		trigger: {
			player: ["phaseUseBegin", "phaseUseEnd"],
		},
		popup: false,
		filter(event, player) {
			return player.isMaxHandcard();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					if (player == target) {
						return false;
					}
					return true;
					//return player.canUse({ name: "mjszhenqianduijue"}, target);
				})
				.set("ai", function (target) {
					const player = get.player();
					return get.effect(target, { name: "mjszhenqianduijue" }, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			const next = game.createEvent("mjszhenqianduijue");
			next.player = player;
			next.target = target;
			next.setContent(lib.card.mjszhenqianduijue.content);
			await next;
			return;
			if (
				game.getGlobalHistory("everything", evt => {
					if (evt.name != "die" || evt?.source != player || evt.player != target) {
						return false;
					}
					return evt.reason?.getParent(event.name) == event;
				}).length > 0
			) {
				const targets = game.filterPlayer(current => {
					return current != target && current != player;
				});
				if (!targets.length) return;
				event.result = await player
					.chooseTarget("你可以选择一名其他角色进行阵前对决", function (card, player, target) {
						return get.event().targets.includes(target);
					})
					.set("ai", function (target) {
						const player = get.player();
						return get.effect(target, { name: "mjszhenqianduijue" }, player);
					})
					.set("targets", targets)
					.forResult();
				if (event.result?.bool && event.result?.targets?.length) {
					const target = event.result.targets[0];
					const next = game.createEvent("mjszhenqianduijue", false);
					next.player = player;
					next.target = target;
					next.setContent(lib.card.mjszhenqianduijue.content);
					await next;
				}
			}
		},
	},
	//孙权
	/**乘马射虎
	 * 每个回合限1次，其他角色回合内获得4张牌时，你摸1张牌，并且你可以立即打出1张杀。
	 * 每个回合限1次，其他角色回合内获得4张牌时，你摸1张牌，然后你可以立即打出1张杀。
	 * */
	mjschengmashehu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjschengmashehu" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		skill_tag: ["摸牌"],
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		usable: 1,
		silent: true,
		forced: true,
		locked: false,
		getIndex(event, player) {
			return game
				.filterPlayer(target => {
					if (target == player || target != _status.currentPhase) return false;
					if (!event.getg?.(target)?.length) return false;
					return target.getHistory("gain").reduce((sum, evtx) => sum + evtx.cards.length, 0) >= 4;
				})
				.sortBySeat();
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(1, 2)]);
			await player.draw();
			const next = player
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) !== "sha") {
							return false;
						}
						return lib.filter.cardEnabled.apply(this, arguments);
					},
					`${mjs.prompt(event.name)}，你可以打出一张杀`
				);
			next.set("oncard", () => {
				const evt = _status.event;
				player.logSkill("mjschengmashehu", evt.targets, null, null, [get.rand(3, 4)]);
			});
			next.set("addCount", false);
			await next;
		},
	},
	/**劝学励士
	 * 出牌阶段限1次，你可以弃置至少1张牌然后摸等量牌；其他角色出牌阶段限1次，其可以交给你至少1张手牌，然后你可以交还其任意张手牌。
	 * 出牌阶段限1次，你可以弃置任意张牌然后摸等量牌；其他角色出牌阶段限1次，其可以交给你任意张手牌，然后你交还其任意张手牌。
	 * */
	mjsquanxuelishi: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		logAudio(event, player, name, indexedData, costResult) {
			if (event.name == "useSkill") {
				return "ext:名将杀/audio/skill/mjsquanxuelishi" + get.rand(1, 2) + ".mp3";
			}
			return "ext:名将杀/audio/skill/mjsquanxuelishi" + (typeof event === "number" ? event : get.rand(1, 4)) + ".mp3";
		},
		skill_tag: ["摸牌"],
		global: "mjsquanxuelishi_global",
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || get.itemtype(card) !== "card" || get.type(card) !== "equip") {
					return num;
				}
				let eq = player.getEquip(get.subtype(card));
				if (eq && get.equipValue(card) - get.equipValue(eq) < Math.max(1.2, 6 - player.hp)) {
					return 0;
				}
			},
		},
		locked: false,
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard(card, player, event) {
			event = event || _status.event;
			if (typeof event != "string") {
				event = event.getParent().name;
			}
			var mod = game.checkMod(card, player, event, "unchanged", "cardDiscardable", player);
			if (mod != "unchanged") {
				return mod;
			}
			return true;
		},
		selectCard: [1, Infinity],
		allowChooseAll: true,
		check(card) {
			let player = _status.event.player;
			if (
				get.position(card) == "h" &&
				!player.countCards("h", "du") &&
				(player.hp > 2 ||
					!player.countCards("h", i => {
						return get.value(i) >= 8;
					}))
			) {
				return 1;
			}
			if (get.position(card) == "e") {
				let subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) {
					return player.getHp() - get.value(card);
				}
			}
			return 6 - get.value(card);
		},
		prompt: "出牌阶段限1次，你可以弃置至少1张牌然后摸等量牌。",
		async content(event, trigger, player) {
			player.draw(event.cards.length);
		},
		ai: {
			order(item, player) {
				if (player.hasCard(i => get.value(i) > Math.max(6, 9 - player.hp), "he")) {
					return 1;
				}
				return 10;
			},
			result: {
				player: 1,
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg && arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat().skill.mjsquanxuelishi && player.hasCard(card => get.name(card) !== "tao", "h");
				}
			},
			threaten: 1.55,
		},
		subSkill: {
			global: {
				enable: "phaseUse",
				prompt() {
					const player = get.player();
					const targets = game.filterPlayer(target => lib.skill.mjsquanxuelishi_global.filterTarget(null, player, target));
					let str = "将至少1张牌交给" + get.translation(targets);
					if (targets.length > 1) {
						str += "中的一人";
					}
					str += "然后其可以交还你任意张手牌";
					return str;
				},
				filter(event, player) {
					if (!player.countCards("h")) {
						return false;
					}
					return game.hasPlayer(target => lib.skill.mjsquanxuelishi_global.filterTarget(null, player, target));
				},
				filterTarget(card, player, target) {
					return target != player && target.hasSkill("mjsquanxuelishi") && !target.hasSkill("mjsquanxuelishi_used", null, null, false);
				},
				selectTarget() {
					const player = get.player();
					const count = game.countPlayer(target => lib.skill.mjsquanxuelishi_global.filterTarget(null, player, target));
					return count > 1 ? 1 : -1;
				},
				check(card) {
					const player = get.player();
					const hasFriend = game.hasPlayer(target => {
						if (get.attitude(player, target) <= 0) return false;
						return lib.skill.mjsquanxuelishi_global.filterTarget(null, player, target);
					});
					return (hasFriend ? 6 : 1) - get.value(card);
				},
				filterCard: true,
				selectCard: [1, Infinity],
				discard: false,
				lose: false,
				delay: false,
				line: true,
				async precontent(event, trigger, player) {
					//event.result.targets[0].logSkill("mjsquanxuelishi", player, null, null, [get.rand(1, 2)]);
				},
				async content(event, trigger, player) {
					const { target } = event;
					target.logSkill("mjsquanxuelishi", player, null, null, [get.rand(3, 4)]);
					target.addTempSkill("mjsquanxuelishi_used", ["phaseBefore", "phaseChange", "phaseAfter"]);
					await player.give(event.cards, target);
					if (!target.countCards("h")) return;
					await target
						.chooseToGive(`你可以交还${get.translation(player)}任意张手牌`, player, [1, Infinity])
						.set("ai", card => {
							let player = _status.event.player,
								target = get.event().target;
							if (get.attitude(player, target) <= 0) {
								if (card.name == "du") {
									return 20;
								}
								return -get.value(card);
							}
							return 8 - Math.sqrt(target.hp) - get.value(card);
						})
						.set("target", player);
				},
				ai: {
					expose: 0.3,
					order: 1,
					result: {
						target: 5,
					},
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	//小乔
	/**并蒂芙蓉
	 * 登场，你选择一名其他角色，每个回合限2次，当其获得牌后，你摸1张牌。
	 * */
	mjsbingdifurong: {
		audio: "ext:名将杀/audio/skill:4",
		logAudio: index => "ext:名将杀/audio/skill/mjsbingdifurong" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		nobracket: true,
		skill_tag: ["摸牌"],
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "changeSkillsAfter"],
		},
		popup: false,
		onremove(player, skill) {
			player.removeSkill(`${skill}_effect`);
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			if (event.name == "changeSkills") {
				return event.addSkill.includes("mjsjuncaoqibing");
			}
			return (event.name != "phase" || game.phaseNumber == 0);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(`选择1名其他角色发动${get.translation(event.skill)}，当其获得牌后，你摸1张牌`, lib.filter.notMe, true)
				.set("ai", target => {
					let eff = target.getSkills(null, false, false).length + 1;
					if (target.hasSkill("mjschengmashehu")) {
						eff += 3;
					}
					if (target.hasSkillTag("maixie")) {
						eff += 2;
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target, null, null, [get.rand(1, 2)]);
			const skill = event.name + "_effect";
			delete player.storage[skill];
			player.addSkill(skill);
			player.markAuto(skill, [target]);
			player.addTip(skill, get.translation(skill).slice(-2) + " " + player.getStorage(skill).reduce((str, target) => str + get.translation(target), ""), false, { whiteSpace: "nowrap" });
		},
		subSkill: {
			effect: {
				trigger: {
					global: ["gainAfter", "loseAsyncAfter"],
				},
				usable: 2,
				popup: false,
				forced: true,
				locked: false,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				getIndex(event, player) {
					if (event.name == "loseAsync" && event.type != "gain") return [];
					return game
						.filterPlayer(target => {
							if (!event.getg?.(target)?.length) return false;
							return player.hasStorage("mjsbingdifurong_effect", target);
						})
						.sortBySeat();
				},
				async content(event, trigger, player) {
					player.logSkill("mjsbingdifurong", null, null, null, [get.rand(3, 4)]);
					player.draw();
				},
				mark: true,
				intro: {
					markcount: () => 0,
					content: "$获得牌后，你摸1张牌",
				},
			},
		},
	},
	/**桃之夭夭
	 * 当你获得♣牌后，将其转化为桃花。
	 * 转化：令目标卡牌在本局游戏中彻底改变
	 * 桃花：令1名角色回复1点体力，或当你受到伤害时打出，抵消此伤害。打出后此牌销毁。
	 * */
	mjstaozhiyaoyao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["增益"],
		trigger: {
			player: "gainAfter",
			global: ["gameDrawAfter", "loseAsyncAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "gameDraw") {
				return player.countCards("h", { suit: "club" });
			}
			return event.getg && event.getg(player)?.some(card => get.suit(card) == "club");
		},
		async content(event, trigger, player) {
			const cards = (trigger?.getg?.(player) ?? player.getCards("h")).filter(card => get.suit(card) == "club");
			for (const card of cards) {
				game.broadcastAll(function (card) {
					card.init([card.suit, card.number, "mjstaohua"]);
				}, card);
			}
		},
	},
	//周瑜
	/**雄姿英发
	 * 回合开始时，摸2张牌。
	 * */
	mjsxiongziyingfa: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["摸牌"],
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			player.draw(2);
		},
		ai: {
			threaten: 1.5,
		},
	},
	/**反间除患
	 * 每个回合限1次，当其他角色选择你为战法牌的目标时，你可以令此牌无效并回到打出者手牌，若其本回合再次打出此牌，随机弃置2张牌，并进入连环状态。
	 * */
	mjsfanjianchuhuan: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:4",
		skill_tag: ["防御", "控制"],
		trigger: {
			global: "useCard",
		},
		usable: 1,
		silent: true,
		popup: true,
		forced: false,
		filter(event, player) {
			if (event.player == player || get.type2(event.card) != "trick") {
				return false;
			}
			return event.targets?.includes(player);
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			trigger.all_excluded = true;
			trigger.targets.length = 0;
			const cards = trigger.cards.filterInD("od");
			if (cards.length) {
				await target.gain(cards, "gain2");
				target.addGaintag(cards, "mjsfanjianchuhuan_debuff");
				target.addTempSkill("mjsfanjianchuhuan_debuff");
				target.markAuto("mjsfanjianchuhuan_debuff", cards);
			}
		},
		ai: {
			expose: 0.2,
			effect: {
	            target(card, player, target) {
	              	if (target.storage?.counttrigger?.mjsfanjianchuhuan) {
	                	return;
	              	}
	              	if (get.type2(card) == "trick" && get.attitude(player, target) < 0) {
	              		const hs = player.getCards("he");
                		hs.remove(card);
                		if (!hs.length) {
                			return;
                		}
	                	return [1, 0, 1, -0.5];
	              	}
	            },
	        },
		},
		subSkill: {
			debuff: {
				name: "反间计",
				mod: {
					aiOrder(player, card, num) {
						if (!player.countCards("he")) return;
						if (player.getStorage("mjsfanjianchuhuan_debuff").includes(card)) {
							return num - 5;
						}
					},
				},
				trigger: {
					global: "useCard",
				},
				silent: true,
				popup: true,
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeGaintag(skill);
				},
				filter(event, player) {
					return event.cards?.length && event.cards?.containsSome(...player.getStorage("mjsfanjianchuhuan_debuff"));
				},
				async content(event, trigger, player) {
					player.unmarkAuto(event.name, trigger.cards);
					const cards = trigger.player.getDiscardableCards(player, "he");
					if (cards.length) {
						await trigger.player.discard(cards.randomGets(2));
					}
					await trigger.player.link(true);
				},
			},
		},
	},
	/**火烧赤壁
	 * 出牌阶段开始时，最多卜卦2次，若其中有1次点数为5，你可以弃置所有♥手牌，对一名角色造成等量的火焰伤害，然后失去此技能。
	 * */
	mjshuoshaochibi: {
		audio: "ext:名将杀/audio/skill:6",
		logAudio: index => "ext:名将杀/audio/skill/mjshuoshaochibi" + (typeof index === "number" ? index : get.rand(1, 4)) + ".mp3",
		nobracket: true,
		skill_tag: ["输出"],
		trigger: {
			player: "phaseUseBegin",
		},
		silent: true,
		locked: false,
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [1]);
			const judgeEvent = [];
			while (judgeEvent.length < 2) {
				const next = player.judge(card => {
					if (get.number(card) == 5) return 4;
					return -2;
				});
				next.judge2 = result => result?.bool;
				const result = await next.forResult();
				await game.delay(2);
				if (result) {
					judgeEvent.push(result);
				} else {
					break;
				}
			}
			if (judgeEvent.some(evt => evt.number == 5)) {
				game.trySkillAudio(event.name, player, true, null, null, [get.rand(4, 5)]);
				const cards = player.getCards("h", { suit: "heart" });
				if (!cards.length) {
					return;
				}
				const num = cards.length;
				const result = await player
					.chooseTarget(`你可以选择一名角色，弃置你的所有♥手牌，然后对其造成${num}点火焰伤害`)
					.set("ai", target => {
						const { player, num } = get.event();
						return get.damageEffect(target, player, player, "fire") * num;
					})
					.set("num", num)
					.forResult();
				if (result?.bool && result.targets?.length) {
					const target = result.targets[0];
					player.logSkill(event.name, target, null, null, [6]);
					await player.discard(cards);
					await target.damage(num, "fire");
					await player.removeSkills(event.name);
				}
			} else {
				game.trySkillAudio(event.name, player, true, null, null, [get.rand(2, 3)]);
			}
		},
	},
	//张角
	/**太平要术
	 * 登场，向牌堆中洗入8张符水，当所有符水都离开牌堆后，你失去技能“太平道”，获得技能“呼风唤雨”，然后将弃牌堆和8张符水洗入牌堆。
	 * 向牌堆中洗入8张符水，当所有符水都离开牌堆后，你失去技能“太平道”，获得技能“呼风唤雨”。
	 * */
	mjstaipingyaoshu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:6",
		logAudio: index => "ext:名将杀/audio/skill/mjstaipingyaoshu" + (typeof index === "number" ? index : get.rand(1, 6)) + ".mp3",
		skill_tag: ["治疗", "增益"],
		derivation: "mjshufenghuanyu",
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_mark");
		},
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		silent: true,
		locked: false,
		filter(event, player) {
			//if (!_status._mjstaipingyaoshu) return false;
			return !Array.from(ui.cardPile.childNodes).some(card => card.name == "mjsfushui");
		},
		async content(event, trigger, player) {
			player.logSkill(event.name, null, null, null, [get.rand(5, 6)]);
			//player.tempBanSkill(event.name, "forever", false);
			player.addSkill(event.name + "_awaken");
			const addSkills = mjs.addCreateSkills("mjshufenghuanyu");
			const removeSkills = ["mjstaipingdao", "mjs_oldtaipingdao"];
			await player.changeSkills(addSkills, removeSkills);
			const next = game.createEvent("mjstaipingyaoshu_init", false);
			next.player = player;
			next.setContent(lib.skill.mjstaipingyaoshu_init.content);
			await next;
		},
		ai: {
			skillRank(player) {
				if (!player.hasSkill("mjstaipingyaoshu", null, null, false)) {
					return 0;
				}
				return 1.5;
			},
		},
		group: "mjstaipingyaoshu_init",
		subSkill: {
			init: {
				audio: "mjstaipingyaoshu",
				trigger: {
					global: "phaseBefore",
					player: ["enterGame", "changeSkillsAfter"],
				},
				silent: true,
				locked: false,
				filter(event, player) {
					if (event.name == "changeSkills") {
						return event.addSkill.includes("mjstaipingyaoshu");
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					const cards = [];
					for (let i = 0; i < 8; i++) {
						const card = game.createCard2("mjsfushui", "none", 0);
						card.destroyed = (card, targetPosition, player, event) => targetPosition == "discardPile";
						card._mjstaipingyaoshu_owner = player;
						//const name = player.getName(true);
						//game.createButtonCardsetion(name, card);
						lib.skill.mjsgouhuohuming.addAvatarBadgeToCard(player, card);
						cards.push(card);
					}
					if (!cards.length) {
						return;
					}
					game.log(player, "向牌堆中洗入8张", "#g【符水】");
					player.$throw(cards, 1000);
					//_status._mjstaipingyaoshu = player;
					await game.cardsGotoPile(cards, () => {
						return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
					});
				},
			},
			mark: {
				charlotte: true,
				mark: true,
				intro: {
					markcount: () => {
						const cards = Array.from(ui.cardPile.childNodes).filter(card => card.name == "mjsfushui");
						return cards.length;
					},
					content(storage, player) {
						const cards = Array.from(ui.cardPile.childNodes).filter(card => card.name == "mjsfushui");
						return cards.length.toString();
					},
				},
	            trigger: {
	                global: ["loseEnd","loseBegin","cardsDiscardEnd","cardsDiscardBegin","cardsGotoOrderingEnd","cardsGotoOrderingBegin","gainEnd","gainBegin","addJudgeEnd","addJudgeBegin","equipEnd","equipBegin","addToExpansionEnd","addToExpansionBegin","loseAfter","cardsDiscardAfter"],
	            },
	            forced: true,
	            popup: false,
	            firstDo: true,
	            filter(event, player2, name) {
	              if (name.endsWith("End")) {
	                return event.olsanou_debuff?.length;
	              }
	              if (name.endsWith("Begin")) {
	                return event.cards.some((card2) => lib.skill.mjstaipingyaoshu_mark.filterCardx(card2, event));
	              }
	              return event.name == "lose" ? event.position == ui.discardPile : true;
	            },
	            filterCardx(card2, event) {
	              if (card2.name != "mjsfushui") {
	            	return false;
	              }
	              if (event.name == "gain") {
	                if ((event.getParent().name == "draw" || !get.owner(card2)) && card2.original == "c") {
	                  return true;
	                }
	              }
	              return get.position(card2) == "c";
	            },
	            async content(event, trigger, player) {
	            	player.updateMark("mjstaipingyaoshu");
	            },
			},
			awaken: {
				charlotte: true,
				init(player, skill) {
					player.removeSkill("mjstaipingyaoshu_mark");
				},
			},
		},
	},
	/**太平道
	 * 每个角色出牌阶段限1次，获得1张符水并打乱牌堆，然后可以交给你2张牌。
	 * 其他角色每回合限1次，可以交给你2张牌，然后你令其获得1张符水。
	 * */
	mjstaipingdao: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["控制"],
		ai: {
			combo: "mjstaipingyaoshu",
		},
		global: "mjstaipingdao_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				discard: false,
				lose: false,
				delay: false,
				line: true,
				prepare(cards, player, targets) {
					targets[0].logSkill("mjstaipingdao");
				},
				prompt() {
					const player = _status.event.player;
					const targets = game.filterPlayer(target => lib.skill.mjstaipingdao_global.filterTarget(null, player, target));
					let str = "获得1张符水并打乱牌堆，然后你可以交给" + get.translation(targets);
					if (targets.length > 1) {
						str += "中的一人";
					}
					str += "2张牌";
					return str;
				},
				filter(event, player) {
					return game.hasPlayer(target => lib.skill.mjstaipingdao_global.filterTarget(null, player, target));
				},
				filterTarget(card, player, target) {
					return target.hasSkill("mjstaipingdao") && !target.hasSkill("mjstaipingdao_used", null, null, false);
				},
				selectTarget() {
					const player = get.player();
					const count = game.countPlayer(target => lib.skill.mjstaipingdao_global.filterTarget(null, player, target));
					return count > 1 ? 1 : -1;
				},
				log: false,
				async content(event, trigger, player) {
					const target = event.target;
					target.addTempSkill("mjstaipingdao_used", "phaseUseAfter");
					const card = get.cardPile("mjsfushui");
					if (card) {
						await player.gain(card, "gain2");
					}
					if (target == player) {
						const result = await player
							.chooseCard(`你可以交给${get.translation(target)}2张牌`, "he", 2)
							.set("ai", card => {
								const player = get.player();
								if (get.position(card) != "e") return 0;
								return player.getUseValue(card);
							})
							.forResult();
						if (result?.bool && result.cards?.length) {
							const cards = result.cards.filter(card => get.position(card) == "e");
							if (cards.length) {
								await player.gain(cards, "giveAuto");
							}
						}
					} else {
						await player.chooseToGive(target, "he", 2);
					}
				},
				ai: {
					expose: 0.3,
					order(item, player) {
						player = player || get.event().player;
						const hasFriend = game.hasPlayer(target => {
							if (!player.getFriends(true).includes(target)) return false;
							return lib.skill.mjstaipingdao_global.filterTarget(null, player, target);
						});
						if (hasFriend) {
							if (game.hasPlayer(target => {
								const sgn = get.sgnAttitude(player, target);
								return get.recoverEffect(target, player, player) * sgn > 0;
							})) {
								return 10;
							}
						}
						return 3;
					},
					result: {
						target: 2,
					},
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	/**呼风唤雨
	 * 回合开始时，翻开牌堆顶的3张牌，出牌阶段，你可以打出这3张牌；回合结束时，若这3张牌都没有被打出，你可以对一名角色造成2点雷电伤害。
	 * */
	mjshufenghuanyu: {
		nobracket: true,
		audio: "ext:名将杀/audio/skill:2",
		skill_tag: ["输出", "增益"],
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) !== "card" || !card.hasGaintag("mjshufenghuanyu_tag")) {
					return;
				}
	            return num / 10;
	        },
	        aiUseful(player, card, num) {
	        	if (get.itemtype(card) !== "card" || !card.hasGaintag("mjshufenghuanyu_tag")) {
					return;
				}
				if (!game.hasPlayer(target => {
					return get.damageEffect(target, player, player, "thunder") * 2 > 0;
				})) {
					return;
				}
				return num / 12;
	        },
		},
		trigger: {
			player: ["phaseBegin", "phaseEnd"],
		},
		silent: true,
		popup: true,
		locked: false,
		filter(event, player, name) {
			return name == "phaseBegin" || player.getExpansions("mjshufenghuanyu").length;
		},
		async content(event, trigger, player) {
			if (event.triggername == "phaseBegin") {
				const cards = get.cards(3);
				await game.cardsGotoOrdering(cards);
				game.log(player, "翻开牌堆顶的", cards);
		        event.videoId = lib.status.videoId++;
		        const createDialog = function (player, cards, id) {
		            const dialog = ui.create.dialog("forcebutton", true);
		            dialog.classList.add("mj-flip");
		            dialog.videoId = id;
		            const buttons = ui.create.div(".buttons", dialog.content);
		            for (const card of cards) {
		                buttons.appendChild(card);
		                dialog.open();
		                ui.create.cardSpinning(card);
		            }
		        };
		        const closeDialog = function (id) {
		            const dialog = get.idDialog(id);
		            if (dialog) {
		                dialog.close();
		            }
		        };
		        game.broadcastAll(createDialog, player, cards, event.videoId);
		        await game.delay(2);
		        game.broadcastAll(closeDialog, event.videoId);
				const next = player.addToExpansion(cards, "giveAuto");
				next.gaintag.add(event.name);
				await next;
				player.addTempSkill("mjshufenghuanyu_init");
			} else {
				const cards = player.getExpansions(event.cards);
				if (cards.length) {
					await player.loseToDiscardpile(cards);
				}
				if (cards.length != 3) {
					return;
				}
				const result = await player
					.chooseTarget(get.prompt(event.name), "你可以对一名角色造成2点雷电伤害")
					.set("ai", target => {
						const player = get.player();
						return get.damageEffect(target, player, player, "thunder") * 2;
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					const [target] = result.targets;
					await target.damage(2, "thunder");
				}
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
		subSkill: {
			tag: {
				name: "invisible",
			},
			init: {
				mod: {
					cardEnabled2(card, player) {
						if (get.itemtype(card) !== "card" || !card.hasGaintag("mjshufenghuanyu_tag")) {
							return;
						}
						if (!player.hasSkill("mjshufenghuanyu") || !player.isPhaseUsing()) {
							return false;
						}
					},
				},
				init(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("mjshufenghuanyu_tag"));
					game.deleteFakeCards(toRemove);
					const cards = game.createFakeCards(player.getExpansions("mjshufenghuanyu"));
					player.directgains(cards, null, "mjshufenghuanyu_tag");
				},
				onremove(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("mjshufenghuanyu_tag"));
					game.deleteFakeCards(toRemove);
				},
				trigger: {
					player: "loseEnd",
					global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				forced: true,
				firstDo: true,
				silent: true,
				forceDie: true,
				filter(event, player) {
					if (event.name == "addToExpansion") {
						return event.gaintag?.includes("mjshufenghuanyu");
					}
					if (event.name == "lose" && event.getlx !== false) {
						for (var i in event.gaintag_map) {
							return event.gaintag_map[i].includes("mjshufenghuanyu");
						}
						return false;
					}
					return (
						game.getGlobalHistory("cardMove", function (evt) {
							if (evt.name != "lose" || event != evt.getParent()) {
								return false;
							}
							for (var i in evt.gaintag_map) {
								return evt.gaintag_map[i].includes("mjshufenghuanyu");
							}
							return false;
						}).length > 0
					);
				},
				async content(event, trigger, player) {
					const toAdd = [],
						toRemove = trigger.getl?.(player)?.xs || [];
					if (trigger.name == "addToExpansion") {
						toAdd.addArray(trigger.cards);
					}
					event.set("toAdd", toAdd);
					event.set("toRemove", toRemove);
					await event.trigger("mjshufenghuanyuChange");
				},
				group: "mjshufenghuanyu_use",
			},
			use: {
				trigger: {
					player: ["useCardBefore", "respondBefore"],
					global: ["mjshufenghuanyuChange"],
				},
				forced: true,
				popup: false,
				delay: false,
				charlotte: true,
				filter(event, player) {
					if (["useCard", "respond"].includes(event.name)) {
						const cards = player.getCards("s", card => card.hasGaintag("mjshufenghuanyu_tag"));
						return event.cards && event.cards.some(card => cards.includes(card));
					}
					return event.player == player;
				},
				async content(event, trigger, player) {
					const tag = "mjshufenghuanyu_tag";
					if (["useCard", "respond"].includes(trigger.name)) {
						trigger.set("mjshufenghuanyu", true);
						const real = player.getExpansions("mjshufenghuanyu");
						for (let i = 0; i < trigger.cards.length; i++) {
							const card = trigger.cards[i];
							const cardx = real.find(cardx => cardx.cardid == card._cardid);
							if (cardx) {
								trigger.cards[i] = cardx;
								trigger.card.cards[i] = cardx;
								trigger.throw = false;
								get.owner(cardx)?.$throw(cardx);
							}
						}
					} else {
						game.deleteFakeCards(player.getCards("s", card => trigger.toRemove.find(cardx => cardx.cardid == card._cardid)));
						player.directgains(game.createFakeCards(trigger.toAdd), null, tag);
					}
				},
			},
		},
	},
};

export default skills;
