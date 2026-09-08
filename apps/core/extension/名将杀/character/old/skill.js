import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
    //霍光
    /**芒刺在背
     * 回合结束时，与你距离为1并且体力值≥你的其他角色失去1点体力。
     * */
    mjsoldmangcizaibei: {
        nobracket: true,
        audio: "mjsmangcizaibei",
        trigger: {
            player: "phaseEnd",
        },
        popup: false,
        forced: true,
        locked: false,
        filter(event, player) {
            return true;
            return lib.skill.mjsoldmangcizaibei.filterTarget(event, player).length;
        },
        logTarget(event, player) {
            return game.filterPlayer(target => {
                if (target == player) return false;
                return get.distance(target, player) <= 1 && target.getHp(true) >= player.getHp(true);
            });
        },
        async content(event, trigger, player) {
            const targets = lib.skill.mjsoldmangcizaibei.logTarget(trigger, player);
            player.logSkill(event.name, targets);
            for (const target of targets) {
                await target.loseHp();
            }
        },
    },
    //羊祜
    /**轻裘缓带
     * 你的每个阶段结束时：若你的装备区没有牌，则你的装备上限-1并且下一轮的同名阶段改为出牌阶段；若你的装备区有牌，则你的装备上限+1并且下一轮的同名阶段改为摸牌阶段。
     * */
    mjsoldqingqiuhuandai: {
        nobracket: true,
        audio: "mjsqingqiuhuandai",
        trigger: {
            player: "phaseAnyEnd",
        },
        silent: true,
        locked: false,
        async content(event, trigger, player) {
            const phasename = player.hasCards("e") ? "phaseDraw" : "phaseUse";
            await player[phasename == "phaseDraw" ? "mjsExpandEquip" : "mjsContractEquip"];
            game.log(player, "下一轮的", "#g" + trigger.name, "=>", "#g" + phasename);
            player
                .when("phaseBegin")
                .then(async (event2, trigger2, player2) => {
                    player2.addTempSkill(`mjsqingqiuhuandai_${phasename}`);
                    player2.markAuto(`mjsqingqiuhuandai_${phasename}`, trigger.name);
                });
        },
    },
    /**德冠四海
     * 出牌阶段限1次，当你选择其他角色为牌的目标时，你可以令你与所有此牌的目标分别展示2张手牌（不足则全展示），并且你选择其中一名其他角色，交换你与其展示的牌，若交换后你的手牌总点数全场最大，添加1张装备牌至手牌并且装备上限+1。
     * */
    mjsolddeguansihai: {
        nobracket: true,
        audio: "mjsolddeguansihai",
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
            player.addTempSkill("mjsolddeguansihai_used");
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
     * 回合结束时，你选择一名其他角色，你本回合每弃置1张牌，就随机削弱其1张牌。
     * */
    mjsoldqianmouyuanji: {
        nobracket: true,
        audio: "mjsqianmouyuanji",
        trigger: {
            player: "phaseBegin",
        },
        silent: true,
        forced: false,
        filter(event, player) {
            return player.hasHistory("lose", evt => evt.type == "discard");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), )
                .set("ai", card => {
                    const player = get.player();
                    const att = get.attitude(player, target);
                    const cards = target.getCards("he", card => {
                        return lib.filter.canBeWeakened(card, target, "mjsoldqianmouyuanji");
                    });
                    return -att * cards.length;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const num = player.getHistory("lose", evt => evt.type == "discard").reduce((sum, evt) => sum + evt.cards.length, 0);
            const cards = target.getCards("he", card => {
                return lib.filter.canBeWeakened(card, target, "mjsoldqianmouyuanji");
            });
            if (cards.length) {
                await target.mjsWeakenCards(cards.randomGets(num), player);
            }
        },
    },
    //吕蒙
    /**束军克己
     * 每个回合结束时，若你此回合没有打出过牌，你获得1张杀；回合开始时，你每拥有2张杀，随机添加1张战法牌到你的手牌。
     * */
    mjsoldshujunkeji: {
        nobracket: true,
        audio: "mjsshujunkeji",
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
            return player.countCards("h", "sha") > 1;
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
                    await player.gain(cards, "draw");
                }
            }
        },
    },
    /**笃志奋学
     * 你每获得3张战法牌，手牌上限+2。
     * */
    mjsoldduzhifenxue: {
        nobracket: true,
        audio: "mjsduzhifenxue",
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
            if (num > 0) {
                player.addMark(event.name, num, false);
            }
            while (player.countMark(event.name) >= 3) {
                player.removeMark(event.name, 3, false);
                lib.skill.mjsallmax.change(player, 2);
            }
        },
    },
    //赵威后
    /**质子为兵
     * 每个回合限1次，当你即将受到伤害时，你可以令一名其他角色获得自己任意区域的一张牌，然后其可以交给你另外至少1张牌，并抵消此次伤害。
     * */
    mjsnewzhiziweibing: {
        nobracket: true,
        audio: "mjszhiziweibing",
        skill_tag: ["防御", "控制"],
        trigger: {
            player: "damageBegin4",
        },
        usable: 1,
        silent: true,
        popup: false,
        forced: false,
        filter(event, player) {
            return player.countCards("he");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", target => {
                    const player = get.player();
                    const att = get.attitude(player, target);
                    if (att <= 0) {
                        return 0;
                    }
                    return att * Math.max(target.countCards("he"), get.effect(player, { name: "shunshou" }, target, player));
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const result = await target.gainPlayerCard(player, "hej", true).forResult();
            if (result?.bool) {
                const result2 = await target
                    .chooseToGive(player, "he", [1, Infinity], card => {
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
                            if (get.damageEffect(player, trigger.source, target, trigger.nature) >= 0) {
                                return false;
                            }
                            if (trigger.num < 2 && target.hp > trigger.num) {
                                return 6 / Math.sqrt(num);
                            }
                            if (target == get.zhu(player)) {
                                return 9;
                            }
                            return 8 / Math.sqrt(num);
                        })()
                    )
                    .forResult();
                if (result2?.bool && result2.cards?.length) {
                    trigger.cancel();
                }
            }
        },
        ai: {
            effect: {
                target(card, player, target) {
                    if (player.hasSkillTag("jueqing", false, target)) {
                        return [1, -2];
                    }
                    if (!target.hasFriend()) {
                        return;
                    }
                    if (get.tag(card, "damage")) {
                        if (lib.skill.mjsnewzhiziweibing.filter(null, target) && !target.storage?.counttrigger.mjsnewzhiziweibing) {
                            return [0, 1];
                        }
                    }
                },
            },
        },
    },
    //徐盛
    /**百里疑城
     * 当你成为其他角色打出牌的目标时，你可以将一名角色装备区的1张牌收回其手牌，然后若此牌是其装备区最后1张牌，随机添加1张装备牌至其手牌。
     * */
    mjsoldbailiyicheng: {
        nobracket: true,
        audio: "mjsbailiyicheng",
        trigger: {
            target: "useCardToTarget",
        },
        silent: true,
        forced: false,
        filter(event, player) {
            return event.player != player && game.hasPlayer(target => target.hasCards("e"));
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    return target != player && target.hasCards("e");
                })
                .set("ai", target => {
                    const player = get.player();
                    const att = get.attitude(player, target);
                    const trigger = _status.event.getTrigger();
                    const es = target.getCards("e");
                    if (att && es.length == 1) {
                        return att * 2; 
                    }
                    if (trigger.player == target && es.includes("mjszhugeliannu") && trigger.card.name == "sha") {
                        return -att;
                    }
                    if (es.length == 1) {
                        return 0;
                    }
                    return -att;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const es = target.getCards("e");
            if (es.length == 1) {
                event.result = { bool: true, cards: es, gain: true };
            } else {
                event.result = await player.choosePlayerCard(target, "e", true).forResult();
            }
            if (event?.result?.bool && event.result?.cards?.length) {
                await target.gain(event.result.cards, "gain2");
                if (event.result?.gain) {
                    const equip = mjs.getEquip("random");
                    const card = mjs.createCard(equip);
                    if (card) {
                        await target.gain(card, "draw");
                    }
                }
            }
        },
    },
    //姜维
    /**一计害三贤
     * 当你的体力上限首次变为1时，你可以将所有牌交给一名其他角色，令其对另外一名其他角色打出所有杀，然后你与其受到其当前手牌数的伤害。
     * */
    mjsoldyijihaisanxian: {
        nobracket: true,
        audio: "mjsshizhikuanghan",
        //global: "mjsoldyijihaisanxian_history",
        trigger: {
            player: "loseMaxHpEnd",
        },
        silent: true,
        forced: false,
        filter(event, player) {
            if (player.storage.mjsoldyijihaisanxian_checkHistory) return false;
            const evts = game.getAllGlobalHistory("everything", (evt) => {
                if (evt.name != "loseMaxHp" || evt.player != player) {
                    return false;
                }
                return evt.changedMaxHp != 0 && (evt.originalMaxHp + evt.changedMaxHp == 1);
            });
            if (evts.indexOf(event) !== 0) {
               return false;
            }
            return true;
            if (
                game
                    .getGlobalHistory("everything", evt => {
                        if (evt.name != "loseMaxHp" || evt.player != player) {
                            return false;
                        }
                        return evt._mjsoldyijihaisanxian;
                    })
                    .indexOf(event) != 0
            ) {
                return false;
            }
            return player.countCards("he");
        },
        async cost(event, trigger, player) {
            player.setStorage("mjsoldyijihaisanxian_checkHistory", true);
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
            const num = targets[0].countCards("h");
            if (num > 0) {
                await player.damage(num);
                await targets[0].damage(num);
            }
        },
        subSkill: {
            history: {
                trigger: {
                    player: "loseMaxHpEnd",
                },
                silent: true,
                firstDo: true,
                charlotte: true,
                filter(event, player) {
                    return player.maxHp == 1;
                },
                async content(event, trigger, player) {
                    trigger.set("_mjsoldyijihaisanxian", true);
                },
            },
        },
    },
    //鲁仲连
    /**义不帝秦
     * 其他角色无法改变你的势力。当你打出牌后，若此牌的花色是你在当前回合首次打出，你可以将此牌放入牌堆底，然后摸1张牌。
     * */
    mjsoldyibudiqin: {
        nobracket: true,
        audio: "mjsyibudiqin",
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
        group: ["mjsoldyibudiqin_change", "mjsoldyibudiqin_use"],
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
                    const list = ["useCard", "respond"].map(key => player.getHistory(key).reduce((list, evt) => list.add(get.suit(evt.card)), [])).flat().toUniqued();
                    return list;
                },
                onremove(player, skill) {
                    player.removeTip(skill);
                },
                filter(event, player) {
                    if (!mjsold.suits.includes(get.suit(event.card))) {
                        return false;
                    }
                    if (!event.cards.someInD()) {
                        return false;
                    }
                    const suit = get.suit(event.card);
                    const suits = lib.skill.mjsoldyibudiqin_use.getList(player);
                    player.addTip("mjsoldyibudiqin_use", get.translation("mjsoldyibudiqin_use") + " " + suits.reduce((str, suit) => str + get.translation(suit), ""), true, { whiteSpace: "nowrap" });
                    if (player.getHistory("useCard", evt => get.suit(evt.card) == suit).indexOf(event) != 0 && player.getHistory("respond", evt => get.suit(evt.card) == suit).indexOf(event) != 0) {
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
    //李夫人
    /**倾国倾城
     * 出牌阶段限2次，你可以令一名其他角色查看并选择添加1张你的手牌的复制，直到你的下个回合开始，若其没有对其他角色造成过伤害，则弃置这些牌，并失去1点体力。
     * */
    mjsoldqingguoqingcheng: {
        nobracket: true,
        audio: "mjsqingguoqingcheng",
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
                player = player || _status.event.player;
                if (player.hasFriend()) {
                    return 10;
                }
                return 1;
            },
            result: {
                target(player, target) {
                    let hs = player.getCards("h");
                    let att = get.attitude(player, target);
                    if (hs.every(i => get.value(i)) < 2) {
                        return -att;
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
                onremove: true,
                trigger: {
                    player: "phaseBegin",
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    const map = player.storage[event.name];
                    if (map instanceof Map) {
                        for (const list of [...map.entries()]) {
                            const target = list[0], cards = list[1];
                            if (get.itemtype(target) == "player" && target?.isIn()) {
                                const hs = target.getCards("he", card => cards.includes(card));
                                if (hs.length) {
                                    await target.discard(hs);
                                }
                                const next = target.loseHp();
                                await next;
                                /**妙丽善舞
                                 * 在任意模式的一局游戏内，使用李夫人，令一名其他角色因倾国倾城流失体力而阵亡。
                                 * */
                                if (game.hasGlobalHistory("everything", evt => evt.name == "die" && evt.reason == next)) {
                                    const now = new Date().toLocaleString();
                                }
                            }
                        }
                    }
                    player.removeSkill(event.name);
                },
                group: "mjsoldqingguoqingcheng_check",
            },
            check: {
                trigger: {
                    global: "damageSource",
                },
                forced: true,
                popup: false,
                charlotte: true,
                onremove: true,
                filter(event, player) {
                    const map = player.storage.mjsoldqingguoqingcheng_effect;
                    return event.source && event.source != event.player && map instanceof Map && map.has(event.source);
                },
                async content(event, trigger, player) {
                    const map = player.storage.mjsoldqingguoqingcheng_effect;
                    if (map instanceof Map) {
                        map.delete(trigger.source);
                    }
                },
            },
        },
    },
    //卓文君
    /**夜奔相如
     * 出牌阶段开始时，你可以翻开牌堆底的5张牌，将其中的♠牌交给一名角色，然后可以将剩余牌按原顺序放回牌堆顶。
     * */
    mjsoldyebenxiangru: {
        nobracket: true,
        audio: "mjsyebenxiangru",
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
                    .chooseTarget(`${mjs.prompt(event.name)}发动，将其中的♠牌交给一名角色`, true)
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
                    .chooseBool(`${mjs.prompt(event.name)}发动，是否将剩余牌按原顺序放回牌堆顶`)
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
    //司马相如
    /**凤求凰
     * 出牌阶段开始时，你可以翻开牌堆顶的5张牌，将其中的♥牌交给一名角色，然后可以将剩余牌按原顺序放回牌堆底。
     * */
    mjsoldfengqiuhuang: {
        nobracket: true,
        audio: "mjsfengqiuhuang",
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
                    .chooseTarget(`${mjs.prompt(event.name)}发动，将其中的♥牌交给一名角色`, true)
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
    //巴清
    /**丹砂女王
     * 你的丹砂不计入手牌上限。每个回合限1次，当你即将受到伤害时，你可以将1张丹砂交给伤害来源，并令此伤害-1。
     * */
    mjsolddanshanvwang: {
        nobracket: true,
        audio: "mjsdanshanvwang",
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
            player: "damageBegin3",
        },
        usable: 1,
        locked: false,
        filter(event, player) {
            const source = event.source;
            if (!source || !source.isIn() || source == player) {
                return false;
            }
            return player.countCards("h", "mjsdansha");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseCard(get.prompt2(event.skill, trigger.source), card => {
                    return card.name == "mjsdansha";
                })
                .set("ai", card => {
                    const player = get.player();
                    const trigger = get.event().getTrigger();
                    //可以无脑给，污染牌堆
                    const att = get.attitude(player, trigger.source);
                    if (att > 0) {
                        return 2;
                    }
                    if (!trigger.source.getCardUsable("mjsdansha")) {
                        return 1;
                    }
                    return player.countCards("h", "mjsdansha") > 1;
                })
                .forResult();
        },
        logTarget: "source",
        async content(event, trigger, player) {
            await player.give(event.cards, trigger.source);
            trigger.num--;
            game.log(player, "受到的伤害", "#y" + "-1");
        },
    },
    //王异
    /**忠贞刚烈
     * 回合结束时，你可以令一名其他角色的手牌数或者体力值变为与你相同，若其手牌数或者体力值因此改变>=2，你受到1点伤害。
     * */
    mjsoldzhongzhenganglie: {
        nobracket: true,
        audio: "mjszhongzhenganglie",
        trigger: {
            player: "phaseEnd",
        },
        popup: false,
        async cost(event, trigger, player) {
            const list = ["手牌数", "体力值"];
            const result = await player
                .chooseTargetControl_mjs({
                    createDialog: [get.prompt2(event.skill)],
                    choices: list,
                    control(targets) {
                        const choices = get.event().choices.slice();
                        return choices;
                    },
                    processAI() {
                        const player = get.player();
                        const changeHs = target => {
                            const num = player.countCards("h") - target.countCards("h");
                            const att = get.attitude(player, target);
                            return num * att;
                        };
                        const changeHp = target => {
                            const num = player.getHp(true) - target.getHp(true);
                            const att = get.attitude(player, target);
                            return num * att;
                        };
                        const target = game.filterPlayer(target => target != player).sort((b, a) => Math.max(changeHs(a), changeHp(a)) - Math.max(changeHs(b), changeHp(b)))[0];
                        return {
                            bool: true,
                            targets: [target],
                            control: changeHs(target) > changeHp(target) ? "手牌数" : "体力值",
                        };
                    },
                })
                .forResult();
            if (result.bool) {
                event.result = {
                    bool: result.bool,
                    targets: result.targets,
                    cost_data: result.control,
                }
            }
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            if (event.cost_data == "手牌数") {
                event.num = target.countCards("h") - player.countCards("h");
                if (event.num > 0) {
                    await target.chooseToDiscard("h", event.num, true);
                } else {
                    await target.drawTo(player.countCards("h"));
                }
            } else {
                event.num = player.getHp(true) - target.getHp(true);
                const delt = Math.min(player.getDamagedHp(), event.num);
                if (event.num > 0 && delt > 0) {
                    await target.changeHp(delt);
                } else if (event.num < 0) {
                    await target.changeHp(event.num);
                }
            }
            if (Math.abs(event.num) >= 2) {
                await player.damage("nosource");
            }
        },
    },
    //侯嬴
    /**市井隐者
     * 你打出目标唯一的战法牌在生效前暗置。你每打出1张战法牌，你可以令一名其他角色从弃牌堆获得1张装备牌。
     * */
    mjsoldshijingyinzhe: {
        nobracket: true,
        audio: "mjsshijingyinzhe",
        init() {
            game.addGlobalSkill("mjsoldshijingyinzhe_global");
        },
        onremove: (player) => {
            if (!game.hasPlayer((current) => current.hasSkill("mjsoldshijingyinzhe", null, null, false), true)) {
                game.removeGlobalSkill("mjsoldshijingyinzhe_global");
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
            trigger.skill = "mjsoldshijingyinzhe_backup";
            trigger.nopop = true;
            trigger.animate = false;
            trigger.throw = false;
            trigger.card.hidden = true;
            game.broadcastAll(
                function (card2, player2) {
                    _status.mjsoldshijingyinzheNode = card2.copy("thrown");
                    if (lib.config.cardback_style != "default") {
                        _status.mjsoldshijingyinzheNode.style.transitionProperty = "none";
                        ui.refresh(_status.mjsoldshijingyinzheNode);
                        _status.mjsoldshijingyinzheNode.classList.add("infohidden");
                        ui.refresh(_status.mjsoldshijingyinzheNode);
                        _status.mjsoldshijingyinzheNode.style.transitionProperty = "";
                    } else {
                        _status.mjsoldshijingyinzheNode.classList.add("infohidden");
                    }
                    _status.mjsoldshijingyinzheNode.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
                    player2.$throwordered2(_status.mjsoldshijingyinzheNode);
                },
                trigger.cards[0],
                player
            );
            event.onEnd_mjsoldshijingyinzhe = function () {
                _status.mjsoldshijingyinzheNode.removeEventListener("webkitTransitionEnd", _status.event.onEnd01);
                setTimeout(function () {
                    _status.mjsoldshijingyinzheNode.style.transition = "all ease-in 0.3s";
                    _status.mjsoldshijingyinzheNode.style.transform = "perspective(600px) rotateY(270deg)";
                    const onEnd = function () {
                        _status.mjsoldshijingyinzheNode.classList.remove("infohidden");
                        _status.mjsoldshijingyinzheNode.style.transition = "all 0s";
                        ui.refresh(_status.mjsoldshijingyinzheNode);
                        _status.mjsoldshijingyinzheNode.style.transform = "perspective(600px) rotateY(-90deg)";
                        ui.refresh(_status.mjsoldshijingyinzheNode);
                        _status.mjsoldshijingyinzheNode.style.transition = "";
                        ui.refresh(_status.mjsoldshijingyinzheNode);
                        _status.mjsoldshijingyinzheNode.style.transform = "";
                        _status.mjsoldshijingyinzheNode.removeEventListener("webkitTransitionEnd", onEnd);
                    };
                    _status.mjsoldshijingyinzheNode.listenTransition(onEnd);
                }, 300);
            };
            await game.delayx();
            player
                .when({ global: "useCardToBegin" })
                .filter(evt => evt.card == trigger.card)
                .then(async () => {
                    game.broadcastAll(function (onEnd) {
                        _status.event.onEnd_mjsoldshijingyinzhe = onEnd;
                        if (_status.mjsoldshijingyinzheNode) {
                            _status.mjsoldshijingyinzheNode.listenTransition(onEnd, 300);
                        }
                    }, event.onEnd_mjsoldshijingyinzhe);
                    await game.delay(2);
                });
        },
        group: ["mjsoldshijingyinzhe_use"],
        subSkill: {
            global: {
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
                group: "mjsoldshijingyinzhe_clear",
            },
            clear: {
                trigger: {
                    player: "dieAfter",
                },
                silent: true,
                forceDie: true,
                charlotte: true,
                filter: (event, player) => {
                    return !game.hasPlayer((current) => current.hasSkill("mjsoldshijingyinzhe", null, null, false), true);
                },
                content: () => {
                    game.removeGlobalSkill(event.name);
                },
            },
            use: {
                trigger: {
                    player: ["useCardAfter", "respondAfter"],
                },
                popup: false,
                filter(event, player) {
                    return Array.from(ui.discardPile.childNodes).some(card => get.type(card) == "equip");
                },
                async cost(event, trigger, player) {
                    event.result = await player
                        .chooseTarget(get.prompt(event.skill), "可以令一名其他角色从弃牌堆获得1张装备牌", lib.filter.notMe)
                        .set("ai", target => {
                            const player = get.player();
                            let eff = get.attitude(player, target);
                            if (target.hasSkill("mjsolddaofucijiang")) {
                                eff *= 20;
                            }
                            if (target.hasSkill("nogain")) {
                                eff /= 10;
                            }
                            return eff;
                        })
                        .forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    player.logSkill(event.name, target);
                    const card = get.discardPile(card => get.type(card) == "equip");
                    if (card) {
                        const gainEvent = target.gain(card, "gain2");
                        gainEvent.giver = player;
                    }
                },
            },
            backup: {
                audio: "mjsshijingyinzhe",
            },
        },
    },
    //庞统
    /**浴火重生
     * 阵亡，若你的阵营未失败，你进入涅槃状态。
     * 涅槃状态：每个回合开始时，卜卦，若为♥️，则你重新登场。
     * */
    mjsyuhuochongsheng: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        derivation: "mjsyuhuochongsheng_faq",
        trigger: {
            player: ["dieBefore", "dieAfter"],
            global: "phaseBegin",
        },
        forced: true,
        forceDie: true,
        forceOut: true,
        direct: true,
        priority: 15,
        filter(event, player, name) {
            if (name == "phaseBegin") {
                return player.isRest();
            }
            if (name == "dieAfter") {
                return event.reserveOut;
            }
            return event.getParent().name != "giveup" && player.maxHp > 0 && player.hasFriend();
        },
        async content(event, trigger, player) {
            if (event.triggername == "dieAfter") {
                await player.rest();
            } else if (event.triggername == "phaseBegin") {
                player.logSkill(event.name);
                const next = player.judge(card => {
                    if (get.suit(card) == "heart") {
                        return 4;
                    }
                    return -4;
                });
                next.set("forceDie", true);
                next.set("includeOut", true);
                next.judge2 = result => result.bool;
                const result = await next.forResult();
                if (!result?.bool) return;
                await player.restEnd();
                player.directgain(get.cards(4));
            } else {
                if (player.isRest()) {
                    trigger.cancel();
                } else {
                    player.logSkill(event.name);
                    //煞笔庞统
                    trigger.noDieAudio = true;
                    trigger.reserveOut = true;
                }
            }
        },
        ai: {
            effect: {
                target(card, player, target, current) {
                    if (target.isLinked() && game.hasNature(card) && target.hasFriend()) {
                        return 2;
                    }
                    if (target.isLinked()) return;
                    if (card.name == "tiesuo" || card.name == "mjslianhuan") {
                        return 1;
                    }
                },
            },
        },
    },
    //章邯
    /**赦徒授兵
     * 你可以消耗1次出杀次数，将弃牌堆中的所有杀洗回牌堆，然后摸牌直到摸到的牌不是杀或装备牌。
     * */
    mjsoldshetushoubing: {
        nobracket: true,
        audio: "mjsshetushoubing",
        skill_tag: ["摸牌"],
        enable: "phaseUse",
        filter(event, player) {
            return player.getCardUsable("sha") > 0;
            return Array.from(ui.discardPile.childNodes).some(card => card.name == "sha");
        },
        async content(event, trigger, player) {
            player.addTempSkill("mjsoldshetushoubing_sha", "phaseUseAfter");
            player.addMark("mjsoldshetushoubing_sha", 1, false);
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
                if (get.itemtype(result.cards) == "cards" && result.cards.some(card => card.name != "sha" && get.type(card) != "equip")) {
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
                            return num - player.countMark("mjsoldshetushoubing_sha");
                        }
                    },
                },
            },
        },
    },
    //君王后
    /**事秦谨慎
     * 每个回合各限1次，体力值>你的角色对你造成伤害后，你可以令一名角色摸1张牌；手牌数>你的角色对你造成伤害后，你可以令一名角色回复1点体力值。
     * */
    mjsoldshiqinjinshen: {
        nobracket: true,
        audio: "mjsshiqinjinshen",
        trigger: {
            player: "damageEnd",
        },
        popup: false,
        forced: true,
        locked: false,
        filter(event, player) {
            return event.source?.isIn() && (event.source.hp > player.hp || event.source.countCards("h") > player.countCards("h"));
        },
        async content(event, trigger, player) {
            if (trigger.source.hp > player.hp && !player.hasStorage("mjsoldshiqinjinshen_used", "hp")) {
                const result = await player
                    .chooseTarget(get.prompt(event.name), "你可以令一名角色摸1张牌")
                    .set("ai", target => {
                        const player = get.player();
                        return get.effect(target, { name: "draw" }, player, player);
                    })
                    .forResult();
                if (result?.bool && result.targets?.length) {
                    const target = result.targets[0];
                    player.logSkill(event.name, target);
                    player.addTempSkill("mjsoldshiqinjinshen_used");
                    player.markAuto("mjsoldshiqinjinshen_used", "hp");
                    await target.draw();
                }
            }
            if (trigger.source.countCards("h") > player.countCards("h") && !player.hasStorage("mjsoldshiqinjinshen_used", "hs")) {
                const result = await player
                    .chooseTarget(get.prompt(event.name), "你可以令一名角色回复1点体力值")
                    .set("ai", target => {
                        const player = get.player();
                        return get.recoverEffect(target, player, player);
                    })
                    .forResult();
                if (result?.bool && result.targets?.length) {
                    const target = result.targets[0];
                    player.logSkill(event.name, target);
                    player.addTempSkill("mjsoldshiqinjinshen_used");
                    player.markAuto("mjsoldshiqinjinshen_used", "hs");
                    await target.recover();
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
    /**巧解玉环
     * 当你成为其他角色打出的战法牌目标时，你可以将其转化为杀并对你打出。
     * */
    mjsoldqiaojieyuhuan: {
        nobracket: true,
        audio: "mjsqiaojieyuhuan",
        trigger: {
            target: "useCardToTarget",
        },
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
                        //card.addGaintag("eternal_mjsoldqiaojieyuhuan_converted");
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
    //赵姬
    /**绝好善舞
     * 当你打出牌时，你可以弃置1张牌，然后摸1张牌。当你打出最后1张手牌时，摸2张牌。
     * */
    mjsoldjuehaoshanwu: {
        nobracket: true,
        audio: "mjsjuehaoshanwu",
        trigger: {
            player: ["useCard", "respond"],
        },
        popup: false,
        forced: true,
        locked: false,
        async content(event, trigger, player) {
            const bool = !player.countCards("h") && player.hasHistory("lose", function (evt) {
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
            await player.draw((bool ? 2 : 0) + Number(event.result?.bool));
        },
    },
    /**迎归甘泉
     * 限定，获得弃牌堆中所有你弃置的牌。
     * */
    mjsoldyinguiganquan: {
        audio: "mjsyinguiganquan",
        nobracket: true,
        enable: "phaseUse",
        limited: true,
        filter(event, player) {
            return get.info("mjsoldyinguiganquan").getCards(player).length;
        },
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            const cards = get.info("mjsoldyinguiganquan").getCards(player);
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
                    const cards = get.info("mjsoldyinguiganquan").getCards(player);
                    if (player.hasSkill("mjsoldjuehaoshanwu") && player.hasCard(card => player.hasUseTarget(card), "h")) {
                        return 0;
                    }
                    return cards.length / 5;
                },
            },
        },
    },
    //法正
    /**奇画策算
     * 当你打出牌时，若此牌点数等于你本回合累计打出的牌数，则你摸2张牌。
     * */
    mjsoldqihuacesuan: {
        nobracket: true,
        audio: "mjsqihuacesuan",
        mod: {
            aiOrder(player, card, num) {
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
            return event._mjsqihuacesuan;
        },
        async content(event, trigger, player) {
            player.draw(2);
        },
        group: "mjsqihuacesuan_mark",
    },
    /**睚眦必报
     * 受伤，你可以查看并打出伤害来源的1张手牌，若其手牌均无法打出，你对其造成1点伤害。
     * */
    mjsoldyazibibao: {
        nobracket: true,
        audio: "mjsyazibibao",
        trigger: {
            player: "damageEnd",
        },
        filter(event, player) {
            return event.source?.isIn();
        },
        check(event, player) {
            return get.attitude(player, event.source) <= 0;
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
            "maixie_defend": true,
            expose: 0.4,
        },
    },
    //曹丕
    /**燕歌行吟
     * 每个回合限1次，当你选择杀的目标时，你可以弃置目标2张牌，若此杀造成伤害，令其摸2张牌，并获得中毒+1，否则你回复1点体力值。
     * */
    mjsoldyangexingyin: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        trigger: {
            player: "useCardToTarget",
        },
        popup: false,
        usable: 1,
        filter(event, player) {
            return event.card.name == "sha" && event.target.countDiscardableCards(player, "he");
        },
        async cost(event, trigger, player) {
            const target = trigger.target;
            const cards = target.getDiscardableCards(player, "he");
            if (!cards.length) return;
            if (cards.length <= 2) {
                event.result = await player
                    .chooseBool(get.prompt(event.skill, target), "弃置目标2张牌，若此杀造成伤害，令其摸2张牌，并获得中毒+1，否则你回复1点体力值")
                    .set("ai", () => {
                        const player = get.player();
                        const trigger = _status.event.getTrigger();
                        return get.effect(trigger.target, { name: "guohe_copy2" }, player) > 0;
                    })
                    .forResult();
                if (event.result?.bool) {
                    event.result.cards = cards;
                }
            } else {
                event.result = await player
                    .discardPlayerCard(target, "he", 2)
                    .set("prompt", get.prompt(event.skill, target))
                    .set("chooseonly", true)
                    .set("forceAuto", true)
                    .forResult();
            }
        },
        async content(event, trigger, player) {
            const target = trigger.target;
            player.logSkill(event.name, target);
            await target.discard(event.cards).set("discarder", player);
            player
                .when("useCardAfter")
                .filter(evt => evt.card == trigger.card)
                .step(async (event, trigger, player) => {
                    if (player.hasHistory("sourceDamage", evt => evt.card == trigger.card && evt.player == target)) {
                        await target.draw(2);
                        target.addSkill("mjs_debuff_zhongdu");
                        target.addMark("mjs_debuff_zhongdu");
                    } else {
                        await player.recover();
                    }
                });
        },
    },
    //卫子夫
    /**平阳讴者
     * 当你打出牌后，弃置1张牌；当你失去最后的手牌后，添加你当前回合弃置牌的复制，并且将此技能改为“当你打出牌后，令一名其他角色添加1张此牌的复制”。
     * */
    mjsoldpingyanouzhe: {
        nobracket: true,
        audio: "mjspingyanouzhe",
        trigger: {
            player: "useCardAfter",
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
            if (!player.storage.mjsoldpingyanouzhe) {
                const next = player.chooseToDiscard("he", `$你发动了【${get.translation(event.name)}】`, "请选择弃置1张牌", true);
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
            if (!game.hasPlayer(target => target != player)) return;
            const result = await player
                .chooseTarget(`你发动了【${get.translation(event.name)}】`, `选择令一名其他角色添加1张${get.translation(trigger.card)}的复制`, lib.filter.notMe)
                .set("ai", target => {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
            if (result?.bool && result.targets?.length) {
                const target = result.targets[0];
                player.line(target);
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
                if (player.storage.mjsoldpingyanouzhe) {
                    return false;
                }
            },
        },
        group: "mjsoldpingyanouzhe_rewrite",
        subSkill: {
            rewrite: {
                trigger: {
                    player: "loseAfter",
                    global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    if (player.storage.mjsoldpingyanouzhe) return false;
                    if (player.countCards("h")) {
                        return false;
                    }
                    const evt = event.getl(player);
                    return evt && evt.player == player && evt.hs && evt.hs.length > 0;
                },
                async content(event, trigger, player) {
                    player.setStorage("mjsoldpingyanouzhe", true);
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
    //郑袖
    /**因妒劝释
     * 出牌阶段限1次，你可以交给一名其他角色任意张牌，然后令一名角色回复等量体力，并且其下回合出杀次数+1。
     * 出杀次数和交出的牌数量无关。
     * 靳尚曰:“秦王甚爱张仪而不欲出之，今将以上庸之地六县赂楚，美人聘楚，以宫中善歌讴者为媵。楚王重地尊秦，秦女必贵而夫人斥矣。不若为言而出之。”于是郑袖日夜言怀王曰:“人臣各为其主用。今地未入秦，秦使张仪来，至重王。王未有礼而杀张仪，秦必大怒攻楚。妾请子母俱迁江南，毋为秦所鱼肉也。”怀王后悔，赦张仪，厚礼之如故。——《史记·张仪列传》
     * */
    mjsoldyinduquanshi: {
        audio: "mjsyinduquanshi",
        nobracket: true,
        skill_tag: ["治疗", "增益"],
        enable: "phaseUse",
        usable: 1,
        filterCard: true,
        selectCard: [1, Infinity],
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
            const result = await player
                .chooseTarget(`请选择一名角色回复${event.cards.length}点体力，且下回合出杀次数+1`)
                .set("ai", target => {
                    const player = get.player();
                    const eff = Math.min(target.getDamagedHp(), get.event().num);
                    return get.recoverEffect(target, player, player) * eff + get.attitude(player, target);
                })
                .set("num", event.cards.length)
                .forResult();
            if (result?.bool && result.targets?.length) {
                const target = result.targets[0];
                player.line(target);
                await target.recover(event.cards.length);
                target.addTempSkill("mjsoldyinduquanshi_effect", { player: "phaseAfter" });
                target.addMark("mjsoldyinduquanshi_effect", 1, false);
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
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == "sha") return num + player.countMark("mjsoldyinduquanshi_effect");
                    },
                },
            },
        },
    },
    //张角
    /**太平道
     * 其他角色出牌阶段限1次，其可以交给你2张牌，然后你可以令其回复1体力。
     * 1.可以选择已经装备的装备牌。
     * 2.通过太平道获得牌后是可以不令对方回复体力的。
     * */
    mjsoldtaipingdao: {
        nobracket: true,
        audio: "mjstaipingdao",
        skill_tag: ["控制"],
        global: "mjsoldtaipingdao_global",
        subSkill: {
            global: {
                enable: "phaseUse",
                discard: false,
                lose: false,
                delay: false,
                line: true,
                prepare(cards, player, targets) {
                    targets[0].logSkill("mjsoldtaipingdao");
                },
                prompt() {
                    const player = _status.event.player;
                    const targets = game.filterPlayer(target => lib.skill.mjsoldtaipingdao_global.filterTarget(null, player, target));
                    let str = "交给" + get.translation(targets);
                    if (targets.length > 1) {
                        str += "中的一人";
                    }
                    str += "2张牌，然后其可以令你回复1体力";
                    return str;
                },
                filter(event, player) {
                    if (player.countCards("he") < 2) {
                        return false;
                    }
                    return game.hasPlayer(target => lib.skill.mjsoldtaipingdao_global.filterTarget(null, player, target));
                },
                filterCard: true,
                selectCard: 2,
                check(card) {
                    const player = get.player();
                    const hasFriend = game.hasPlayer(target => {
                        if (get.attitude(player, target) <= 0) return false;
                        return lib.skill.mjsoldtaipingdao_global.filterTarget(null, player, target);
                    });
                    return (hasFriend ? 6 : 1) - get.value(card);
                },
                log: false,
                visible: true,
                filterTarget(card, player, target) {
                    return target != player && target.hasSkill("mjsoldtaipingdao") && !target.hasSkill("mjsoldtaipingdao_used", null, null, false);
                },
                selectTarget() {
                    const player = get.player();
                    const count = game.countPlayer(target => lib.skill.mjsoldtaipingdao_global.filterTarget(null, player, target));
                    return count > 1 ? 1 : -1;
                },
                async content(event, trigger, player) {
                    const target = event.target;
                    target.addTempSkill("mjsoldtaipingdao_used", "phaseUseAfter");
                    await player.give(event.cards, target);
                    const { bool } = await target
                        .chooseBool(`你可以令${get.translation(player)}回复1点体力`)
                        .set("ai", () => {
                            return get.event().goon;
                        })
                        .set("goon", get.recoverEffect(target, player, player) > 0)
                        .forResult();
                    if (bool) {
                        await player.recover();
                    }
                },
                ai: {
                    expose: 0.3,
                    order: 10,
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
    //苏秦
    /**合纵
     * 出牌阶段限1次，你可以查看并增强一名角色的1张牌。场上每存在1种势力，此技能的发动次数+1。
     * */
    mjsoldhezong: {
        audio: "mjshezong",
        skill_tag: ["增益"],
        enable: "phaseUse",
        usable(skill, player) {
            return 1 + game.countGroup();
        },
        filterTarget(card, player, target) {
            if (ui.selected.cards.length || target == player) {
                return false;
            }
            return target.countCards("he", card => lib.filter.canBeStrengthened(card, target, "mjsoldhezong"));
        },
        selectTarget: [0, 1],
        filterCard(card, player) {
            if (ui.selected.targets.length) {
                return false;
            }
            return lib.filter.canBeStrengthened(card, player, "mjsoldhezong");
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
                return lib.filter.canBeStrengthened(card, target, "mjsoldhezong");
            });
            if (!cards.length) return;
            const result = await player
                .chooseCardButton(get.translation(event.name), target.getCards("he"), true)
                .set("filterButton", button => {
                    return lib.filter.canBeStrengthened(button.link, get.owner(button.link), "mjsoldhezong");
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
            order: 10,
            result: {
                target(player, target) {
                    let att = get.attitude(player, target);
                    let hs = target.getCards("he", card => {
                        return lib.filter.canBeStrengthened(card, target, "mjsoldhezong");
                    });
                    return att * hs.length;
                },
            },
        },
    },
    //廉颇
    /**负荆请罪
     * 出牌阶段限1次，你可以获得一名其他角色的2张牌，其下个回合开始时，你失去1点体力，然后将因此获得的牌交回。
     * 出牌阶段限1次，你可以获得一名距离1以内的其他角色的2张牌，其下个回合开始时，你失去1点体力，然后将因此获得的牌交回。
     * 可以获得卜卦区的牌。
     * 廉颇闻之，肉袒负荆，因宾客至蔺相如门谢罪。曰：“鄙贱之人，不知将军宽之至此也。”卒相与驩，为刎颈之交。——《史记·廉颇蔺相如列传》
     * */
    mjsoldfujingqingzui: {
        nobracket: true,
        audio: "mjsfujingqingzui",
        skill_tag: ["减益", "摸牌"],
        mod: {
            aiOrder(player, card, num) {
                if (get.itemtype(card) == "card" && card.hasGaintag("mjsoldfujingqingzui_mark")) {
                    return num + 0.1;
                }
            },
        },
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return game.hasPlayer(target => lib.skill.mjsoldfujingqingzui.filterTarget(null, player, target));
        },
        filterTarget(card, player, target) {
            return target != player && target.countGainableCards(player, "hej");
        },
        async content(event, trigger, player) {
            const [target] = event.targets;
            const result = await player.gainPlayerCard(target, "hej", 2, true).forResult();
            if (!result.bool) return;
            player
                .when({ global: "phaseBegin" })
                .filter(evt => evt.player == target)
                .step(async (event, trigger, player) => {
                    //没有因此获得的牌便不用流失体力，无罪可请，气笑了
                    const cards = result.cards.filter(card => player.getCards("he").includes(card));
                    if (cards.length) {
                        await player.loseHp();
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
    //西门豹
    /**厚民薄库
     * 每回合限1次，你可以弃置2张相同花色的牌，令任意名角色各获得1张此花色的牌。
     * 任意角色可以包括自己。
     * 臣闻王主富民，霸主富武，亡国富库。今王欲为霸王者也，臣故稸积于民。君以为不然，臣请升城鼓之，甲兵粟米，可立具也。——《淮南子·人间训》
     * */
    mjsoldhouminboku: {
        nobracket: true,
        audio: "mjshouminboku",
        skill_tag: ["摸牌"],
        enable: "phaseUse",
        usable: 1,
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
        async content(event, trigger, player) {
            const list = [],
                suit = get.suit(event.cards[0]);
            for (const target of event.targets) {
                const card = get.cardPile(card => {
                    return get.suit(card) == suit;
                });
                if (card) {
                    await game.cardsGotoOrdering([card]);
                    list.push([target, [card]]);
                }
            }
            await game.loseAsync({
                gain_list: list,
                giver: player,
                animate: "draw",
            }).setContent("gaincardMultiple");
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

    //李斯
    /**燔书明法
     * 当你成为其他角色打出牌的目标时，你可以弃置1张牌，令其无法再次打出同名牌直到当前回合结束。当你弃牌后，直到你的下回合开始，其他角色打出与你弃牌同名的牌时，你可以令其随机弃置1张牌。
     * 1.以任意方式弃置的牌都生效。
     * 2.所有属性的杀都属于同名牌。
     * 3.被“封禁”不影响“禁止打出同名牌”。
     * */
    mjsoldfanshumingfa: {
        nobracket: true,
        audio: "mjsfanshumingfa",
        skill_tag: ["控制"],
        trigger: {
            target: "useCardToTarget",
        },
        filter(event, player) {
            return event.player != player;
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt(event.skill, trigger.player), "chooseonly")
                .set("ai", card => {
                    const player = get.player();
                    const trigger = _status.event.getTrigger();
                    const target = trigger.player;
                    if (get.attitude(player, target) > 0) return 0;
                    if (target.hasStorage("mjsoldfanshumingfa_block", card.name)) return 0;
                    let val = 5;
                    if (card.name == "sha") val += 2;
                    return val - get.value(card);
                })
                .forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            await player.discard(event.cards);
            trigger.player.addTempSkill("mjsoldfanshumingfa_block", { player: "phaseBegin" });
            trigger.player.markAuto("mjsoldfanshumingfa_block", [event.cards[0].name]);
        },
        group: "mjsoldfanshumingfa_discard",
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
                    player.addTempSkill("mjsoldfanshumingfa_effect", { player: "phaseBegin" });
                    player.markAuto("mjsoldfanshumingfa_effect", list);
                },
            },
            effect: {
                audio: "mjsoldfanshumingfa",
                trigger: {
                    global: ["useCard", "respond"],
                },
                filter(event, player) {
                    if (event.player == player) return false;
                    return player.hasStorage("mjsoldfanshumingfa_effect", event.card.name);
                },
                logTarget: "player",
                prompt2: "你可以令其随机弃置1张牌。",
                check(event, player) {
                    return get.attitude(player, event.player) < 0;
                },
                async content(event, trigger, player) {
                    const target = trigger.player;
                    const cards = target.getCards("h", card => {
                        return lib.filter.cardDiscardable(card, target, "mjsoldfanshumingfa_effect");
                    });
                    if (cards.length > 0) {
                        await target.discard(cards.randomGets(1)).set("discarder", target);
                    }
                },
            },
            block: {
                charlotte: true,
                onremove: true,
                mod: {
                    targetEnabled2(card, player, target) {
                        if (player.hasStorage("mjsoldfanshumingfa_block", card.name)) return false;
                    },
                },
            },
        },
    },
    //燕昭王
    /**强兵伐齐
     * 当你获得增强牌时，你回复1点体力。你每累计获得3张增强牌时，之后每回合的摸牌数+1，出杀次数+1。
     * 技能效果可累加。
     * 燕昭王得郭隗，而邹衍乐毅，以齐至，于是举兵而攻齐，栖闵王于莒。燕支地计众，不与齐均也，然如所以能申意至于此者，由得士也。故无常安之国，无宜治之民，得贤者安存，失贤者危亡，自古及今，未有不然者也。——《大戴礼记·保傅》
     * */
    mjsoldqiangbingfaqi: {
        nobracket: true,
        audio: "mjsoldqiangbingfaqi",
        skill_tag: ["治疗", "增益"],
        trigger: {
            player: "gainAfter",
            global: "loseAsyncAfter",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return event.getg && event.getg(player)?.some(card => card?.storage?.mjsoldstratagem);
        },
        async content(event, trigger, player) {
            await player.recover();
            const num = trigger.getg(player).filter(card => card.storage?.mjsoldstratagem).length;
            if (num > 0) player.addMark(event.name, num, false);
            while (player.countMark(event.name) >= 3) {
                player.removeMark(event.name, 3, false);
                player.addSkill("mjsoldqiangbingfaqi_effect");
                player.addMark("mjsoldqiangbingfaqi_effect", 1, false);
            }
        },
        subSkill: {
            effect: {
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == "sha") return num + player.countMark("mjsoldqiangbingfaqi_effect");
                    },
                },
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
                    trigger.num += player.countMark(event.name);
                },
            },
        },
    },
    //赵威后
    /**质子为兵
     * 当你即将受到伤害时，你可以令一名其他角色获得你任意区域的1张牌，然后交给你另外任意张牌，并令你回复1点体力。
     * 1.可以获得你装备区的牌；
     * 2.可以交还0张牌。
     * 孝成王元年，秦伐我，拔三城。赵王新立，太后用事，秦急攻之。赵氏求救于齐，齐曰:“必以长安君为质，兵乃出。”——《史记·赵世家》
     * */
    mjsoldzhiziweibing: {
        nobracket: true,
        audio: "mjsnewzhiziweibing",
        skill_tag: ["治疗", "控制"],
        trigger: {
            player: "damageEnd",
        },
        popup: false,
        filter(event, player) {
            return player.countCards("he");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", target => {
                    const player = get.player();
                    return get.attitude(player, target);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const result = await target.gainPlayerCard(player, "hej", true).forResult();
            if (result?.bool) {
                const result2 = await target
                    .chooseToGive(player, "he", [1, Infinity], card => {
                        return !get.event().cards.includes(card);
                    })
                    .set("cards", result.cards)
                    .forResult();
                if (result2?.bool && result2.cards?.length) {
                    await player.recover();
                }
            }
        },
    },
    //诸葛亮
    /**锦囊妙计
     * 出牌阶段开始时，选择1张专属战法牌添加到手牌。
     * */
    mjsoldjinnangmiaoji: {
        nobracket: true,
        audio: "mjsjinnangmiaoji",
        derivation: "mjsjinnangmiaoji_faq",
        getList: ["mjsshezhanqunru", "mjscaochuanjiejian", "mjsqixingjifeng", "mjszhiquhuarong", "mjsqiqinqizong", "mjskongchengji", "mjsshangfangyonghuo", "mjsjieshihuanhun"],
        init(player, skill) {
            if (!_status.mjsoldjinnangmiaoji_cardPile) {
                lib.skill[skill].initPile();
            }
        },
        initCard(name, suit, number) {
            const card = game.createCard2(name, suit, number);
            game.broadcastAll(
                (card, suit) => {
                    //处理移出游戏的部分
                    card.destroyed = (card, position, player, event) => {
                        //如果要移入的位置是弃牌堆，直接转移到special
                        if (position == "discardPile") {
                            lib.skill.mjsoldjinnangmiaoji.discard(card, true);
                        }
                        return false;
                    };
                },
                card,
                suit
            );
            return card;
        },
        initPile(nocardpile) {
            const list = lib.skill.mjsoldjinnangmiaoji.getList,
                cards = [];
            if (nocardpile) {
                game.broadcastAll(() => {
                    if (!_status.mjsoldjinnangmiaoji_cardPile) {
                        _status.mjsoldjinnangmiaoji_cardPile = [];
                    }
                });
            } else {
                game.broadcastAll(
                    (cards, list) => {
                        for (let i = 1; i < 9; i++) {
                            const card = lib.skill.mjsoldjinnangmiaoji.initCard(list[i - 1], lib.suit.randomGet(), i);
                            cards.add(card);
                        }
                        if (!_status.mjsoldjinnangmiaoji_cardPile) {
                            _status.mjsoldjinnangmiaoji_cardPile = cards;
                        }
                    },
                    cards,
                    list
                );
            }
            lib.skill.mjsoldjinnangmiaoji.update();
        },
        update(discarded) {
            if (discarded?.length) {
                game.broadcastAll(list => {
                    _status.mjsoldjinnangmiaoji_cardPile.addArray(list);
                    game.log(list, "移入专属牌堆");
                }, discarded);
            }
        },
        discard(card, noinsert) {
            if (!lib.skill.mjsoldjinnangmiaoji.getList.includes(card.name)) {
                card.discard(false);
                return;
            }
            if (noinsert) {
                game.cardsGotoSpecial(card);
                //更新弃牌堆
                lib.skill.mjsoldjinnangmiaoji.update([card]);
            } else {
                ui.special.appendChild(card);
                game.broadcastAll(card => {
                    _status.mjsoldjinnangmiaoji_cardPile.splice(get.rand(0, _status.mjsoldjinnangmiaoji_cardPile.length - 1), 0, card);
                }, card);
                lib.skill.mjsoldjinnangmiaoji.update();
            }
        },
        trigger: {
            player: "phaseUseBegin",
        },
        filter(event, player) {
            return _status.mjsoldjinnangmiaoji_cardPile.length;
        },
        async cost(event, trigger, player) {
            const cards = _status.mjsoldjinnangmiaoji_cardPile.slice().randomGets(3);
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
            const cards = event.cards;
            game.broadcastAll(list => {
                _status.mjsoldjinnangmiaoji_cardPile.removeArray(list);
            }, cards);
            lib.skill.mjsoldjinnangmiaoji.update();
            await player.gain(cards, "gain2");
        },
    },
    //陈平
    /**六出奇计
     * 应战，每个回合限1次，你可以选择1张专属战法牌添加到手牌，并可以立即打出。
     * */
    mjsoldliuchuqiji: {
        audio: "mjsliuchuqiji",
        nobracket: true,
        skill_tag: ["增益"],
        derivation: "mjsliuchuqiji_faq",
        getList: ["mjsjuanjinfanjian", "mjsecaojinshi", "mjsyejiexingyang", "mjsniezuwenxin", "mjsyouyunmengze", "mjsbaidengjiewei"],
        init(player, skill) {
            if (!_status.mjsoldliuchuqiji_cardPile) {
                lib.skill[skill].initPile();
            }
        },
        initCard(name, suit, number) {
            const card = game.createCard2(name, suit, number);
            game.broadcastAll(
                (card, suit) => {
                    //处理移出游戏的部分
                    card.destroyed = (card, position, player, event) => {
                        //如果要移入的位置是弃牌堆，直接转移到special
                        if (position == "discardPile") {
                            lib.skill.mjsoldliuchuqiji.discard(card, true);
                        }
                        return false;
                    };
                },
                card,
                suit
            );
            return card;
        },
        initPile(nocardpile) {
            const list = lib.skill.mjsoldliuchuqiji.getList,
                cards = [];
            if (nocardpile) {
                game.broadcastAll(() => {
                    if (!_status.mjsoldliuchuqiji_cardPile) {
                        _status.mjsoldliuchuqiji_cardPile = [];
                    }
                });
            } else {
                game.broadcastAll(
                    (cards, list) => {
                        for (let i = 1; i < list.length + 1; i++) {
                            const card = lib.skill.mjsoldliuchuqiji.initCard(list[i - 1], lib.suit.randomGet(), i);
                            cards.add(card);
                        }
                        if (!_status.mjsoldliuchuqiji_cardPile) {
                            _status.mjsoldliuchuqiji_cardPile = cards;
                        }
                    },
                    cards,
                    list
                );
            }
            lib.skill.mjsoldliuchuqiji.update();
        },
        update(discarded) {
            if (discarded?.length) {
                game.broadcastAll(list => {
                    _status.mjsoldliuchuqiji_cardPile.addArray(list);
                    game.log(list, "移入专属牌堆");
                }, discarded);
            }
        },
        discard(card, noinsert) {
            if (!lib.skill.mjsoldliuchuqiji.getList.includes(card.name)) {
                card.discard(false);
                return;
            }
            if (noinsert) {
                game.cardsGotoSpecial(card);
                //更新弃牌堆
                lib.skill.mjsoldliuchuqiji.update([card]);
            } else {
                ui.special.appendChild(card);
                game.broadcastAll(card => {
                    _status.mjsoldliuchuqiji_cardPile.splice(get.rand(0, _status.mjsoldliuchuqiji_cardPile.length - 1), 0, card);
                }, card);
                lib.skill.mjsoldliuchuqiji.update();
            }
        },
        trigger: {
            target: "useCardToTarget",
        },
        usable: 1,
        filter(event, player) {
            return event.card.name == "sha" && _status.mjsoldliuchuqiji_cardPile.length;
        },
        async cost(event, trigger, player) {
            const cards = _status.mjsoldliuchuqiji_cardPile.slice().randomGets(3);
            if (!cards.length) return;
            event.result = await player
                .chooseButton([get.translation(event.skill), cards])
                .set("ai", button => {
                    const player = get.player();
                    return player.getUseValue(button.link);
                })
                .forResult();
            if (event.result?.bool) {
                event.result.cards = event.result.links;
            }
        },
        async content(event, trigger, player) {
            const cards = event.cards;
            game.broadcastAll(list => {
                _status.mjsoldliuchuqiji_cardPile.removeArray(list);
            }, cards);
            lib.skill.mjsoldliuchuqiji.update();
            await player.gain(cards, "gain2");
            const card = cards[0];
            if (player.getCards("h").includes(card) && player.hasUseTarget(card)) {
                await player.chooseUseTarget(card);
            }
        },
    },
    //张仪
    /**折竹
     * 每轮结束时，你可以用1张手牌刻写其他角色本轮发动过的1个技能。之后你可以弃置此牌，获得此技能，直到你的下个回合开始。
     * 1.刻写：将1个技能写在1张手牌上。
     * 2.可以刻写限定技。
     * */
    mjsoldzhezhu: {
        audio: "mjsoldzhezhu",
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
                    list.add(get.sourceSkillFor(evt.skill))
                    return list;
                }, []);
        },
        trigger: {
            global: "roundEnd",
        },
        filter(event, player) {
            return game.hasPlayer(target => {
                return target != player && get.info("mjsoldzhezhu").getSkills(target).length;
            });
        },
        async cost(event, trigger, player) {
            const targets = game.filterPlayer(target => {
                return target != player && get.info(event.skill).getSkills(target).length;
            });
            const skills = [];
            for (const target of targets) {
                skills.addArray(get.info(event.skill).getSkills(target));
            }
            if (!skills.length) {
                return;
            }
            event.result = await player
                .chooseButtonCard_mjs({
                    createDialog: [`###折竹###`, [skills, "skill"]],
                    filterCard: true,
                    ai1(button) {
                        const skill = button.link;
                        return get.skillRank(skill, "inout");
                    },
                    ai2(card) {
                        return 1 / get.value(card);
                    },
                })
                .forResult();
            game.broadcastAll("closeDialog", event.videoId);
            if (event.result?.bool && event.result.links) {
                event.result.cost_data = event.result.links[0];
            }
        },
        async content(event, trigger, player) {
            const skill = event.cost_data;
            for (const card of event.cards) {
                card.storage.mjsoldzhezhu = skill;
            }
            const next = player.addToExpansion(event.cards, "draw");
            next.gaintag.add(event.name);
            await next;
        },
        intro: {
            content: "expansion",
            markcount: "expansion",
        },
        group: "mjsoldzhezhu_use",
        subSkill: {
            use: {
                enable: "phaseUse",
                filter(event, player) {
                    return player.getExpansions("mjsoldzhezhu").length;
                },
                async precontent(event, trigger, player) {
                    const name = event.name.slice("pre_".length);
                    const cards = player.getExpansions("mjsoldzhezhu");
                    if (cards.length) {
                        const result = await player
                            .chooseButton(
                                [
                                    [[get.translation(name)], "addNewRow"],
                                    cards,
                                    [
                                        dialog => {
                                            dialog.css({
                                                top: "20%",
                                            });
                                            dialog.buttons.forEach(button => {
                                                game.createButtonCardsetion(button.link?.storage?.mjsoldzhezhu || "", button.link);
                                            });
                                        },
                                        "handle",
                                    ],
                                ],
                            )
                            .forResult();
                        if (result?.bool && result.links?.length) {
                            event.result.cards = result.links;
                            return;
                        }
                    }
                    player.addTempSkill("mjsoldzhezhu_aiCheck", {
                        player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
                    });
                    event.getParent().goto(0);
                },
                lose: false,
                discard: false,
                delay: false,
                async content(event, trigger, player) {
                    const skills = event.cards.reduce((list, card) => {
                        const skill = card.storage?.mjsoldzhezhu;
                        if (skill) list.add(skill);
                        return list;
                    }, []);
                    for (const card of event.cards) {
                        delete card.storage.mjsoldzhezhu;
                    }
                    await player.loseToDiscardpile(event.cards);
                    if (skills.length) {
                        await player.addTempSkills(skills, { player: "phaseBegin" });
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
            aiCheck: {
                charlotte: true,
            },
        },
    },
    //申不害
    /**君操其柄
     * 游戏开始时，你可以令一名角色获得“以术驭国”。当你或者其阵亡时，未阵亡的角色也失去“以术驭国”。
     * */
    mjsoldjuncaoqibing: {
        audio: "mjsjuncaoqibing",
        nobracket: true,
        skill_tag: ["增益"],
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        popup: false,
        filter(event, player) {
            return (event.name != "phase" || game.phaseNumber == 0);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", function (target) {
                    const player = get.player();
                    let att = get.attitude(player, target);
                    if (att > 0) att += 1;
                    if (target.hasSkill("mjsyishuyuguo")) att /= 2;
                    if (att == 0) att = Math.random();
                    return att;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            player.addSkill("mjsoldjuncaoqibing_clear");
            player.markAuto("mjsoldjuncaoqibing_clear", [target]);
            const createSkills = mjs.addCreateSkills("mjsyishuyuguo");
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
                    return event.player == player || player.hasStorage("mjsoldjuncaoqibing_clear", event.player)
                },
                onremove(player, skill) {
                    game.countPlayer2(current => {
                        if (current == player || player.hasStorage(skill, current)) {
                            current.removeSkills("mjsyishuyuguo");
                        }
                    }, true);
                },
                async content(event, trigger, player) {
                    player.removeSkill(event.name);
                },
            },
        },
    },
    //子婴
    /**末代秦王
     * 你的初始手牌*2。在你的回合开始时，你弃置手牌至手牌上限。当你弃置牌时，你可以将弃置的牌交给任意一名其他角色。
     * */
    mjsoldmodaiqinwang: {
        nobracket: true,
        audio: "mjsmodaiqinwang",
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
        group: ["mjsoldmodaiqinwang_init", "mjsoldmodaiqinwang_give"],
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
                    return event.getl && event.getl(player)?.cards2?.someInD("od");
                },
                async cost(event, trigger, player) {
                    const cards = trigger.getl(player)?.cards2?.filterInD("od");
                    if (!cards.length) return;
                    event.result = await player
                        .chooseTarget(get.prompt(event.skill), "将弃置的牌交给一名其他角色", lib.filter.notMe)
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
     * 出牌阶段限1次，你可以减少1点装备上限，摸3张牌，手牌上限+1；当你的装备上限首次为0时，你可以弃置所有杀，并选择一名其他角色，对其造成等量伤害。
     * */
    mjsoldtuimiaozhujian: {
        nobracket: true,
        audio: "mjstuimiaozhujian",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
            return player.mjsGetEquipLimit();
        },
        async content(event, trigger, player) {
            await player.mjsContractEquip();
            await player.draw(3);
            lib.skill.mjsoldallmax.change(player, 1);
        },
        ai: {
            order: 1,
            result: {
                player(player) {
                    return get.effect(player, { name: "wuzhong" }, player) > 0;
                },
            },
        },
        group: "mjsoldtuimiaozhujian_use",
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
    //孙策
    /**小霸王
     * 出牌阶段与弃牌阶段开始时，如果你的手牌数为全场最多，你可以选择一名其他角色进行阵前对决，若因此击杀目标，可以再选择一名其他角色进行阵前对决。
     * */
    mjsoldxiaobawang: {
        audio: "mjsxiaobawang",
        nobracket: true,
        "skill_tag": ["输出"],
        trigger: {
            player: ["phaseUseBegin", "phaseDiscardBegin"],
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
                    //return player.canUse({ name: "juedou"}, target);
                })
                .set("ai", function (target) {
                    const player = get.player();
                    return get.effect(target, { name: "juedou" }, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const next = game.createEvent("juedou");
            next.player = player;
            next.target = target;
            next.setContent(lib.card.juedou.content);
            await next;
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
                        return get.effect(target, { name: "juedou" }, player);
                    })
                    .set("targets", targets)
                    .forResult();
                if (event.result?.bool && event.result?.targets?.length) {
                    const target = event.result.targets[0];
                    const next = game.createEvent("juedou", false);
                    next.player = player;
                    next.target = target;
                    next.setContent(lib.card.juedou.content);
                    await next;
                }
            }
        },
    },
    //乐毅
    /**孤军连克
     * 出牌阶段开始时，你可以对自己翻出牌堆顶的5张牌，并可以打出其中任意花色各1张牌，然后将剩余的牌放入牌堆底。
     * */
    mjsoldgujunlianke: {
        audio: "mjsgujunlianke",
        nobracket: true,
        "skill_tag": ["增益", "摸牌"],
        trigger: {
            player: "phaseUseBegin",
        },
        frequent: true,
        async content(event, trigger, player) {
            const cards = get.cards(5);
            await game.cardsGotoOrdering(cards);
            while (true) {
                const result = await player
                    .chooseButton(["你可以使用其中的一张牌", cards])
                    .set("filterButton", button => {
                        return get.player().hasUseTarget(button.link);
                    })
                    .set("ai", button => {
                        return get.player().getUseValue(button.link);
                    })
                    .forResult();
                if (result?.bool) {
                    cards.removeArray(result.links);
                    const card = result.links[0];
                    const next = player.chooseUseTarget(card);
                    if (card.name == "sha") next.set("addCount", false);
                    const result2 = await next.forResult();
                    if (!result2.bool) break;
                } else break;
            }
            for (var i = 0; i < cards.length; i++) {
                ui.cardPile.appendChild(cards[i]);
            }
            game.updateRoundNumber();
            await game.delayx();
        },
    },
    /**报惠王书
     * 每轮开始时，你可以弃置你的所有手牌，然后选择一名其他角色，将势力改为与其相同，并获得其手牌的复制。
     * */
    mjsoldbaohuiwangshu: {
        audio: "mjsbaohuiwangshu",
        nobracket: true,
        "skill_tag": ["增益", "摸牌"],
        trigger: {
            global: "roundStart",
        },
        popup: false,
        filter(event, player) {
            return player.countCards("h");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    return target != player && target.countCards("h");
                })
                .set("ai", target => {
                    let player = get.player();
                    let num = player.getCards("h").reduce((sum, card) => sum + player.getUseValue(card), 0);
                    let num2 = target.getCards("h").reduce((sum, card) => sum + player.getUseValue(card), 0)
                    return num2 - num + (target.countCards("h") - player.countCards("h") * 4.75);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            if (get.info("mjsyitongliuhe").groupFiter(player) && get.info("mjsyitongliuhe").groupFiter(target)) {
                await player.changeGroup(target.group);
            }
            await player.modedDiscard(player.getCards("h"));
            const cards = [];
            for (const card of target.getCards("h")) {
                const cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
                if (cardx) cards.push(cardx);
            }
            if (cards.length) {
                await player.gain(cards);
            }
        },
    },
    //平原君
    /**斩笑立信
     * 每回合限1次，你可以销毁一名其他角色的1张牌，然后令所有与你势力相同的其他角色依次摸1张牌，并交给你1张牌。
     * */
    mjsoldzhanxiaolixin: {
        audio: "mjszhanxiaolixin",
        nobracket: true,
        enable: "phaseUse",
        skill_tag: ["控制", "摸牌"],
        filterTarget(card, player, target) {
            return target != player && target.countCards("he");
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, false, false);
            const [target] = event.targets;
            const result = await player
                .choosePlayerCard(target, "hej", true)
                .set("ai", button => {
                    return get.value(button.link);
                })
                .forResult();
            if (result.bool) {
                const cards = result.cards;
                game.log(cards, "被销毁了");
                await target.lose(cards, "toDestroy", ui.special);
            }
            await game.delay();
            if (!get.info("mjsyitongliuhe").groupFiter(player)) {
                return;
            }
            const targets = game.filterPlayer(target => {
                return target != player && target.group == player.group;
            });
            for (const target of targets) {
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
                    } else {
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
                    }
                },
            },
        },
    },
    /**利令智昏
     * 其他角色受到伤害时，你可以将其势力改为与你相同；其他角色回合开始时，若你在其攻击范围内，则其本回合打出的杀无法选择与你势力相同的其他角色为目标。
     * */
    mjsoldlilingzhihun: {
        audio: "mjslilingzhihun",
        nobracket: true,
        skill_tag: ["增益", "减益"],
        trigger: {
            global: "damageEnd",
        },
        filter(event, player) {
            if (get.info("mjsyitongliuhe").groupFiter(event.player) || get.info("mjsyitongliuhe").groupFiter(player)) {
                return false;
            }
            if (event.player == player) return false;
            return event.player.group != player.group;
        },
        prompt2: "你可以将其势力改为与你相同",
        logTarget: "player",
        check(event, player, name, target) {
            if (name == "damageEnd") return get.attitude(player, event.player) > 0;
            return get.attitude(player, event.player) <= 0;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            await target.changeGroup(player.group);
        },
        group: "mjsoldlilingzhihun_begin",
        subSkill: {
            begin: {
                trigger: {
                    global: "phaseBegin",
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    if (event.player == player) return false;
                    return event.player.inRange(player);
                },
                logTarget: "player",
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    target.addTempSkill("mjsoldlilingzhihun_debuff");
                    target.markAuto("mjsoldlilingzhihun_debuff", [player]);
                },
            },
            debuff: {
                charlotte: true,
                onremove: true,
                mod: {
                    targetEnabled(card, player, target) {
                        if (card.name != "sha") return;
                        const bool = player.getStorage("mjsoldlilingzhihun_debuff")
                            .some(current => {
                                if (!get.info("mjsyitongliuhe").groupFiter(current)) {
                                    return false;
                                }
                                return current != target && current.group == target.group;
                            });
                        if (bool) return false;
                    },
                },
                mark: true,
                intro: {
                    content: "你打出的杀无法选择与$势力相同的其他角色为目标"
                },
            },
        },
    },
    //春申君
    /**移花接木
     * 每个回合限1次，其他角色主动打出战法牌时，你可以将其转化为任意战法牌（每种战法牌每轮限1次），并由该角色继续执行转化后牌的效果，然后你获得1张转化后牌的复制并增强。 
     * */
    mjsoldyihuajiemu: {
        nobracket: true,
        audio: "mjsyihuajiemu",
        skill_tag: ["控制", "增益"],
        trigger: {
            global: "useCard",
        },
        usable: 1,
        filter(event, player) {
            return event.player != player && get.type2(event.card) == "trick" && event.targets?.length;
        },
        async cost(event, trigger, player) {
            const list = get
                .inpileVCardList(info => {
                    const name = info[2], nature = info[3];
                    if (get.type2(name) != "trick") return false;
                    return true;
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
            if (event.result?.bool) {
                event.result.cost_data = event.result.links[0][2];
            }
        },
        async content(event, trigger, player) {
            const name = event.cost_data;
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
            //player.addTempSkill("mjsoldyihuajiemu_effect");
            //player.markAuto("mjsoldyihuajiemu_effect", [[trigger.card, name]]);
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
                .step(async (event, trigger, player) => {
                    const card = game.createCard2(name, lib.suit.randomGet(), get.rand(1, 8));
                    if (card) {
                        await player.gain(card, "gain2");
                        await player.mjsStrengthenCards(card);
                    }
                });
        },
        subSkill: {
            effect: {
                trigger: {
                    global: "useCardToBegin",
                },
                filter(event, player) {
                    const storage = player.getStorage("mjsoldyihuajiemu_effect");
                    return storage.some(list => list[0] == event.card);
                },
                forced: true,
                popup: false,
                firstDo: true,
                async content(event, trigger, player) {
                    const list = player.getStorage("mjsoldyihuajiemu_effect").find(list => list[0] == trigger.card);
                    trigger.setContent(lib.card[list[1]].content);
                },
            },
        },
    },
    //周勃
    /**削平诸吕
     * 每回合限1次，摸牌至与全场手牌最多的角色相同，下一次造成的伤害+1，出牌阶段结束时，将因此技能获得的牌交给一名其他角色。
     * */
    mjsoldxuepingzhulv: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        skill_tag: ["摸牌", "增益"],
        enable: "phaseUse",
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, "roundStart", false);
            const skill = event.name + "_effect";
            const target = game.findPlayer(current => current.isMaxHandcard());
            if (target?.isIn()) {
                const num = target.countCards("h");
                const result = await player.drawTo(num).forResult();
                if (get.itemtype(result.cards) == "cards") {
                    player.addGaintag(result.cards, "eternal_mjsoldxuepingzhulv_tag");
                    player
                        .when("phaseUseAfter")
                        .step(async () => {
                            const cards = player.getCards("he", card => result.cards.includes(card));
                            if (cards.length && game.hasPlayer(target => target != player)) {
                                const result = await player
                                    .chooseTarget(`选择将牌交给一名其他角色`, lib.filter.notMe, true)
                                    .set("ai", target => {
                                        const player = get.player();
                                        const att = get.attitude(player, target);
                                        return att;
                                    })
                                    .forResult();
                                if (result.bool && result.targets?.length) {
                                    const target = result.targets[0];
                                    await player.give(cards, target);
                                }
                            }
                            game.broadcastAll(
                                cards => {
                                    for (const card of cards) {
                                        card.removeGaintag("eternal_mjsoldxuepingzhulv_tag");
                                    }
                                },
                                result.cards
                            );
                        });
                }
            }
            player.addSkill(skill);
            player.addMark(skill, 1, false);
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
    //蔡文姬
    /**离乱断肠
     * 受伤，你可以选择与一名其他角色交换位置。
     * */
    mjsoldliluanduanchang: {
        audio: "mjsbeifenlichou",
        nobracket: true,
        trigger: {
            player: "damageEnd",
        },
        popup: false,
        priority: -1,
        filter(event, player) {
            if (!game.hasPlayer(current => current != player)) {
                return false;
            }
            return true;
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
        },
    },
    //蒙毅
    /**内谋法治
     * 应战，你随机弃置目标1张手牌或装备牌，若你未受到此杀伤害，令此技能可以弃牌的数量+1，否则-1。
     * */
    mjsoldneimoufazhi: {
        audio: "mjsneimoufazhi",
        nobracket: true,
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
            const skill = event.name;
            const num = 1 + (player.storage[skill] || 0);
            if (num > 0) {
                const cards = target.getDiscardableCards(player, "he");
                if (cards.length) {
                    await target.discard(cards.randomGets(Math.min(num, cards.length))).set("discarder", player);
                }
            }
            player
                .when({ global: "useCardAfter" })
                .filter(event => event.card == trigger.card)
                .step(async (event, trigger, player) => {
                    if (!player.hasHistory("damage", evt => evt.card == trigger.card)) {
                        lib.skill[skill].change(player, 1);
                    } else {
                        lib.skill[skill].change(player, -1);
                    }
                });
        },
        change(player, num) {
            var info = player.storage;
            if (typeof info.mjsoldneimoufazhi != "number") {
                info.mjsoldneimoufazhi = 0;
            }
            info.mjsoldneimoufazhi += num;
            if (info.mjsoldneimoufazhi == 0) {
                player.unmarkSkill("mjsoldneimoufazhi");
            } else {
                player.markSkill("mjsoldneimoufazhi");
            }
            if (num >= 0) {
                game.log(player, "发动", "#g" + get.translation("mjsoldneimoufazhi"), "的弃牌数", "#y+" + num);
            } else {
                game.log(player, "发动", "#g" + get.translation("mjsoldneimoufazhi"), "的弃牌数", "#g" + num);
            }
        },
    },
    //蒙恬
    /**筑城守藩
     * 应战，你摸1张牌，若你未受到此杀伤害，令此技能可以摸牌的数量+1，否则-1。
     * */
    mjsoldzhuchenshoufan: {
        audio: "mjszhuchenshoufan",
        nobracket: true,
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
            const skill = event.name;
            const num = 1 + (player.storage[skill] || 0);
            if (num > 0) await player.draw(num);
            player
                .when({ global: "useCardAfter" })
                .filter(event => event.card == trigger.card)
                .step(async (event, trigger, player) => {
                    if (!player.hasHistory("damage", evt => evt.card == trigger.card)) {
                        lib.skill[skill].change(player, 1);
                    } else {
                        lib.skill[skill].change(player, -1);
                    }
                });
        },
        change(player, num) {
            var info = player.storage;
            if (typeof info.mjsoldzhuchenshoufan != "number") {
                info.mjsoldzhuchenshoufan = 0;
            }
            info.mjsoldzhuchenshoufan += num;
            if (info.mjsoldzhuchenshoufan == 0) {
                player.unmarkSkill("mjsoldzhuchenshoufan");
            } else {
                player.markSkill("mjsoldzhuchenshoufan");
            }
            if (num >= 0) {
                game.log(player, "发动", "#g" + get.translation("mjsoldzhuchenshoufan"), "的摸牌数", "#y+" + num);
            } else {
                game.log(player, "发动", "#g" + get.translation("mjsoldzhuchenshoufan"), "的摸牌数", "#g" + num);
            }
        },
    },
    /**忠信
     * 每个回合限1次，当一名其他角色成为其他角色杀的目标时，若你与其距离为1，则你可以与其交换座位，并将此杀的目标改为你。
     * */
    mjsoldzhongxin: {
        audio: "mjszhongxin",
        trigger: {
            global: "useCardToTarget",
        },
        usable: 1,
        filter(event, player) {
            if (event.target == player) return false;
            if (event.target == event.player) return false;
            return event.card.name == "sha" && get.distance(player, event.target) <= 1;
        },
        logTarget: "target",
        check(event, player) {
            if (get.attitude(player, event.target) <= 0) return false;
            const name = event.card.name;
            if (name == "sha") {
                return (player.hp > 2 || player.countCards("h", "shan"));
            }
            return get.effect(event.target, event.card, event.player, player) <= get.effect(player, event.card, event.player, player) + 1;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            game.broadcastAll(
                function (target1, target2) {
                    game.swapSeat(target1, target2);
                },
                player,
                target
            );
            const evt = trigger.getParent();
            evt.triggeredTargets2.remove(target);
            evt.targets.remove(target);
            evt.targets.push(player);
        },
    },
    //吕雉
    /**临朝称制
     * 每个回合开始前，你可以选择1个花色，令所有角色在打出此花色的牌后摸1张牌或者随机销毁1张牌。
     * */
    mjsoldlinchaochengzhi: {
        audio: "mjslinchaochengzhi",
        nobracket: true,
        skill_tag: ["摸牌", "控制"],
        trigger: {
            player: "phaseBegin",
        },
        async cost(event, trigger, player) {
            const suits = mjs.suits.slice().map(suit => [suit, get.translation(suit)]);
            const nums = Array.from({ length: 8 }, (_, index) => index + 1).map(num => [num, num]);
            const types = ["draw", "destroy"].map(type => [type, type == "draw" ? "摸牌" : "销毁"]);
            const result = await player
                .chooseButton(
                    [
                        "临朝称制",
                        [
                            nums,
                            "tdnodes",
                        ],
                        [
                            suits,
                            "tdnodes",
                        ],
                        [
                            types,
                            "tdnodes",
                        ],
                        `<div><div style="width:100%;text-align:center">选择一个点数或者属性和效果，当有角色打出此属性的牌后，执行对应的效果</div></div>`,
                        [
                            dialog => {
                                dialog.css({
                                    top: "20%",
                                });
                            },
                            "handle",
                        ],
                    ],
                    2,
                )
                .set("complexSelect", true)
                .set("filterButton", button => {
                    const func = button => {
                        return typeof button.link == "number" || mjs.suits.includes(button.link);
                    };
                    return !ui.selected.buttons.some(buttonx => func(button) == func(buttonx));
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
                const links = result.links;
                if (!mjs.suits.includes(links[0]) && typeof links[0] != "number") {
                    links.reverse();
                }
                event.result = {
                    bool: true,
                    cost_data: {
                        suit: links[0],
                        type: links[1]
                    }
                };
            }
        },
        async content(event, trigger, player) {
            const { suit, type } = event.cost_data;
            const skill = `${event.name}_${type}`;
            player.addTempSkill(skill);
            player.markAuto(skill, [suit]);
            player.addTip(skill, player.getStorage(skill).reduce((str, suit) => str + get.translation(suit), "") + " " + (type == "draw" ? "摸牌" : "销毁"));
        },
        subSkill: {
            draw: {
                audio: "mjslinchaochengzhi",
                trigger: {
                    global: ["useCardAfter", "respondAfter"],
                },
                forced: true,
                charlotte: true,
                onremove: true,
                forceDie: true,
                filter(event, player) {
                    return player.getStorage("mjsoldlinchaochengzhi_draw").containsSome(get.suit(event.card), get.number(event.card));
                },
                async content(event, trigger, player) {
                    trigger.player.draw();
                },
                onremove(player, skill) {
                    delete player.storage[skill];
                    player.removeTip(skill);
                },
                intro: {
                    markcount: () => 0,
                    content: "所有角色打出$的牌后摸1张牌",
                },
            },
            destroy: {
                audio: "mjslinchaochengzhi",
                trigger: {
                    global: ["useCardAfter", "respondAfter"],
                },
                forced: true,
                charlotte: true,
                onremove: true,
                forceDie: true,
                filter(event, player) {
                    return player.getStorage("mjsoldlinchaochengzhi_destroy").containsSome(get.suit(event.card), get.number(event.card));
                },
                async content(event, trigger, player) {
                    const cards = trigger.player.getCards("he").randomGets(1);
                    if (cards.length > 0) {
                        game.log(cards, "被销毁了");
                        await trigger.player.lose(cards, "toDestroy", ui.special);
                    }
                },
                onremove(player, skill) {
                    delete player.storage[skill];
                    player.removeTip(skill);
                },
                intro: {
                    markcount: () => 0,
                    content: "所有角色打出$的牌后随机销毁1张牌",
                },
            },
        },
    },
    //许褚
    /**虎痴
     * 受伤，你可以获得1张装备牌，并添加1张阵前对决对你的手牌。
     * */
    mjsoldhuchi: {
        audio: "mjshuchi",
        trigger: {
            player: "damageEnd",
        },
        frequent: true,
        async content(event, trigger, player) {
            const card = get.cardPile(card => get.type(card) == "equip");
            if (card) {
                await player.gain(card);
            }
            const cardx = game.createCard("mjszhenqianduijue", "diamond", 5);
            if (cardx) {
                await player.gain(cardx, "gain2");
            }
        },
    },
    //范增
    /**亡秦必楚
     * 游戏开始时，选择一名其他角色，令其体力上限+2，并回复2点体力，当其造成伤害后，你随机获得1张战法牌，并且可以立即打出此牌。
     * */
    mjsoldwangqinbichu: {
        audio: "mjswangqinbichu",
        nobracket: true,
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        filter(event, player) {
            return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(`你发动了【${get.translation(event.skill)}】`, "选择一名其他角色为楚王，令其体力上限+2，并回复2点体力，当其造成伤害后，你随机获得1张战法牌，并且可以立即打出此牌。", lib.filter.notMe, true)
                .set("ai", target => {
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
            player.logSkill(event.name, target);
            await target.gainMaxHp(2);
            await target.recover(2);
            player.addSkill("mjsoldwangqinbichu_effect");
            player.markAuto("mjsoldwangqinbichu_effect", [target]);
        },
        subSkill: {
            effect: {
                trigger: {
                    global: "damageSource",
                },
                popup: false,
                forced: true,
                locked: false,
                charlotte: true,
                filter(event, player) {
                    return player.hasStorage("mjsoldwangqinbichu_effect", event.source);
                },
                async content(event, trigger, player) {
                    const card = get.cardPile(card => {
                        return get.type2(card) == "trick";
                    }, null, "random");
                    if (card) {
                        await player.gain(card, "gain2");
                        if (player.getCards("h").includes(card) && player.hasUseTarget(card)) {
                            await player.chooseUseTarget(card);
                        }
                    }
                },
                mark: true,
                marktext: "楚",
                intro: {
                    content: "$造成伤害后，你随机获得1张战法牌，并且可以立即打出此牌",
                },
            },
        },
    },
    //萧何
    /**成也
     * 回合结束时，你可以令一名其他角色立即进行一个出牌阶段；在此阶段内，当其打出牌后，其摸1张牌。
     * */
    mjsoldchengye: {
        audio: "mjsjuxianweijiang",
        skill_tag: ["增益"],
        trigger: {
            player: "phaseEnd",
        },
        popup: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", target => {
                    const player = get.event().player,
                        att = get.attitude(player, target);
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
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            target
                .when({ global: "phaseUseBegin" })
                .filter(evt => evt.getParent("phase")?.skill == "mjsoldchengye")
                .then(() => {
                    player.addTempSkill("mjsoldchengye_effect", "phaseUseAfter");
                });
            const next = target.insertPhase();
            next.set("phaseList", ["phaseUse"]);
        },
        subSkill: {
            effect: {
                mark: true,
                marktext: "成",
                intro: {
                    content: "你打出后摸1张牌",
                },
                trigger: {
                    player: ["useCardAfter", "respondAfter"],
                },
                forced: true,
                popup: false,
                charlotte: true,
                async content(event, trigger, player) {
                    player.draw();
                },
                ai: {
                    effect: {
                        player_use(card, player, target) {
                            return [1, 1];
                        },
                    },
                },
            },
        },
    },
    /**计召诱诛
     * 限定，其他角色的出牌阶段结束时，若其在此阶段内打出的牌＞3张，你可以令另外一名其他角色对其打出手牌中的所有杀，直到目标重伤。
     * */
    mjsoldbaiye: {
        audio: "mjsjizhaoyouzhu",
        trigger: {
            global: "phaseUseEnd",
        },
        limited: true,
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
                    if (target == player || target == trigger.player) return false;
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
            const bool = await target
                .chooseBool(`是否对${get.translation(trigger.player)}打出手牌中的所有杀`)
                .set("ai", () => {
                    const { player, source, target } = get.event();
                    const cards = player.getCards("h", "sha");
                    if (!cards.length) return false;
                    return cards.reduce((sum, card) => {
                        sum += get.effect(target, card, player, player);
                        return sum;
                    }, 0) > 7.5;
                })
                .set("source", player)
                .set("target", trigger.player)
                .forResult();
            if (!bool) return;
            while (target.countCards("h", "sha")) {
                const cards = target.getCards("h", "sha");
                if (!cards.some(card => target.canUse(card, trigger.player, false, false))) {
                    break;
                }
                const card = cards[0];
                const useCardEvent = target.useCard(card, trigger.player, false);
                useCardEvent.animate = false;
                const result = await useCardEvent.forResult();
                if (
                    game.getGlobalHistory("everything", evt => {
                        return evt.name == "dying" && evt.player == trigger.player && evt.getParent(event.name) == event;
                    }).length
                ) {
                    break;
                }
            }
        },
    },
    //张良
    /**博浪椎秦
     * 你可以将手牌中的1张武器牌装备给一名其他角色，然后其可以对你选择的其攻击范围内的另一名其他角色打出1张杀。
     * */
    mjsoldbolangzhuiqin: {
        nobracket: true,
        audio: "mjsbolangzhuiqin",
        enable: "phaseUse",
        filter(event, player) {
            return player.countCards("h", card => lib.skill.mjsoldbolangzhuiqin.filterCard(card));
        },
        filterCard(card) {
            return get.subtype(card) == "equip1";
        },
        position: "he",
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
                .chooseTarget(`你可以选择${get.translation(event.target)}的出杀目标`)
                .set("filterTarget", (card, player, target) => {
                    return get.event().sourcex.inRange(target);
                })
                .set("sourcex", event.target)
                .set("ai", target => {
                    const { player, sourcex } = get.event();
                    return get.effect(target, { name: "sha" }, sourcex, sourcex);
                })
                .forResult();
            if (result?.bool && result.targets?.length) {
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
     * 当你获得杀时，将其转化为2张随机战法牌。你在回合外需要打出杀时，其他角色可以替你打出。
     * */
    mjsoldyunchouweiwo: {
        nobracket: true,
        audio: "mjsyunchouweiwo",
        getList(player) {
            const list = lib.inpile.filter(name => get.type2(name) == "trick");
            list.addArray(player.getStorage("mjsoldyunchouweiwo"));
            return list;
        },
        trigger: {
            player: "gainAfter",
            global: ["gameDrawAfter", "loseAsyncAfter"],
        },
        forced: true,
        locked: false,
        filter(event, player) {
            if (event.name == "gameDraw") {
                return player.countCards("h", { name: "sha" });
            }
            return event.getg && event.getg(player)?.some(card => card.name == "sha");
        },
        async content(event, trigger, player) {
            const cards = (trigger?.getg?.(player) ?? player.getCards("h")).filter(card => card, name == "sha");
            const gains = [];
            for (const card of cards) {
                const trick = mjs.getTrick("random");
                const suit = mjs.getSuit(trick);
                const number = mjs.getNumber(trick);
                game.broadcastAll(function (card, suit, number, name) {
                    card.init([suit, number, name]);
                }, card, suit, number, trick);
                const trick2 = mjs.getTrick("random");
                const suit2 = mjs.getSuit(trick2);
                const number2 = mjs.getNumber(trick2);
                const cardx = game.createCard(trick2, suit2, number2);
                if (cardx) gains.push(cardx);
            }
            if (gains.length) {
                await player.gain(gains, "draw");
            }
        },
        group: "mjsoldyunchouweiwo_use",
        subSkill: {
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
        },
    },
    /**圯桥授书
     * 当你累计打出15张战法牌后，将太公六韬添加到你的手牌和你可以转化的战法牌种类中。
     * */
    mjsoldyiqiaoshoushu: {
        nobracket: true,
        audio: "mjsyiqiaoshoushu",
        derivation: "mjsyiqiaoshoushu_faq",
        getList: ["mjswentao", "mjswutao", "mjslongtao", "mjshutao", "mjsbaotao", "mjsquantao"],
        trigger: {
            player: ["useCardAfter", "respondAfter"],
        },
        forced: true,
        locked: false,
        filter(event, player) {
            if (player.storage.mjsoldyiqiaoshoushu) {
                return false;
            }
            return event._mjsoldyiqiaoshoushu;
        },
        async content(event, trigger, player) {
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
                await player.gain(cards, "gain2");
            }
            player.markAuto("mjsoldyunchouweiwo", list);
        },
        intro: {
            markcount(storage, player) {
                return (15 - player.countMark("mjsoldyiqiaoshoushu_counter")).toString();
            },
            content(storage, player) {
                return `你已累计打出${player.countMark("mjsoldyiqiaoshoushu_counter")}/15张战法牌`;
            },
        },
        group: "mjsoldyiqiaoshoushu_counter",
        subSkill: {
            counter: {
                trigger: {
                    player: ["useCard1", "respond"],
                },
                forced: true,
                locked: false,
                popup: false,
                firstDo: true,
                filter(event, player) {
                    if (player.storage.mjsoldyiqiaoshoushu) {
                        return false;
                    }
                    return get.type2(event.card) == "trick";
                },
                async content(event, trigger, player) {
                    player.addMark(event.name, 1, false);
                    player.markSkill("mjsoldyiqiaoshoushu");
                    if (player.countMark(event.name) % 15 == 0) {
                        trigger._mjsoldyiqiaoshoushu = true;
                        player.unmarkSkill("mjsoldyiqiaoshoushu", false, false, false);
                    }
                },
            },
        },
    },
    //龙且
    /**安营筑垒
     * 回合结束时，你可以弃置所有手牌，每因此弃置1张牌，增加1点体力上限，并回复1点体力。
     * */
    mjsoldanyingzhulei: {
        nobracket: true,
        audio: "mjsanyingzhulei",
        trigger: {
            player: "phaseEnd",
        },
        filter(event, player) {
            return player.countCards("h") > 0;
        },
        check(event, player) {
            return player.countCards("h") <= 4;
        },
        async content(event, trigger, player) {
            const cards = player.getCards("h");
            if (cards.length) {
                await player.discard(cards);
                await player.gainMaxHp(cards.length);
                await player.recover(cards.length);
            }
        },
    },
    //袁绍
    /**百万雄兵
     * 当你的手牌数全场最多时，你的战法牌可以当作万箭齐发打出。
     * */
    mjsoldbaiwanxiongbing: {
        nobracket: true,
        audio: "mjsbaiwanxiongbing",
        enable: "chooseToUse",
        viewAs: {
            name: "wanjian",
        },
        filter(event, player) {
            if (!player.isMaxHandcard()) return false;
            return player.hasCard(card => get.type2(card) == "trick" || (_status.connectMode && player.countCards("h") > 0), "hs");
        },
        filterCard(card) {
            return get.type2(card) == "trick";
        },
        check(card) {
            return 6 - get.value(card);
        },
    },
    //黄忠
    /**宝刀不老
     * 回合开始时，若你没有装备武器牌，随机获得1张武器，否则摸1张杀。
     * */
    mjsoldbaodaoweilao: {
        nobracket: true,
        audio: "mjsoldbaodaoweilao",
        trigger: {
            player: "phaseBegin",
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
            if (!player.getEquips(1).length) {
                const card = get.cardPile(card => {
                    return get.subtype(card) == "equip1";
                }, null, "random");
                if (card) {
                    await player.gain(card);
                }
            } else {
                const card = get.cardPile("sha");
                if (card) {
                    const next = player.draw();
                    next.set("visible", true);
                    next.set("otherGetCards", () => [card])
                }
            }
        },
    },
    /**百步穿杨
     * 出杀，若你与目标距离大于1，则此杀强命。
     * */
    mjsoldbaibuchuanyang: {
        nobracket: true,
        audio: "mjsoldbaibuchuanyang",
        trigger: {
            player: "useCardToPlayer",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return event.card.name == "sha" && get.distance(player, event.target) > 1;
        },
        logTarget: "target",
        async content(event, trigger, player) {
            trigger.getParent().directHit.push(trigger.target);
            game.log(trigger.target, "不可响应", trigger.card);
        },
        ai: {
            "directHit_ai": true,
            skillTagFilter(player, tag, arg) {
                if (arg?.card?.name != "sha") {
                    return false;
                }
                return get.distance(player, arg.target) > 1;
            },
        },
    },
    /**骄兵之计
     * 应战，你可以摸0张牌，然后可以立即对目标打出1张杀，或者令此技能的摸牌数再次发动时+1，直到你的下个回合开始。
     * */
    mjsoldjiaobingzhiji: {
        nobracket: true,
        audio: "mjsoldjiaobingzhiji",
        trigger: {
            target: "useCardToTarget",
        },
        frequent: true,
        filter(event, player) {
            return event.card.name == "sha";
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const target = trigger.player;
            const num = player.countMark("mjsoldjiaobingzhiji_add");
            if (num > 0) {
                await player.draw(num);
            }
            const result = await player
                .chooseToUse(function (card, player, event) {
                    if (get.name(card) != "sha") {
                        return false;
                    }
                    return lib.filter.filterCard.apply(this, arguments);
                }, `骄兵之计：你可以对${get.translation(target)}打出一张杀，或者令此技能的摸牌数再次发动时+1`)
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
                player.addTempSkill("mjsoldjiaobingzhiji_add", { player: "phaseBegin" });
                player.addMark("mjsoldjiaobingzhiji_add", 1, false);
            }
        },
        subSkill: {
            add: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    //曹操
    /**天下归心
     * 击杀，你获得目标角色所有手牌和装备。
     * */
    mjsnewtianxiaguixin: {
        nobracket: true,
        audio: "mjstianxiaguixin",
        trigger: {
            source: "die",
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
    //孙权
    /**劝学励士
     * 出牌阶段限1次，你可以弃置任意张牌然后摸等量牌；其他角色每回合限1次，交给你任意张牌，然后你交还其等量牌，若其交给你所有手牌，其摸1张牌。
     * */
    mjsnewquanxuelishi: {
        nobracket: true,
        audio: "mjsquanxuelishi",
        skill_tag: ["摸牌"],
        global: "mjsnewquanxuelishi_global",
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
        selectCard: [1,Infinity],
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
        log: false,
        async content(event, trigger, player) {
            player.logSkill("mjsnewquanxuelishi", null, null, null, [get.rand(3, 4)]);
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
                    return (!arg || (arg && arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat().skill.mjsnewquanxuelishi && player.hasCard(card => get.name(card) !== "tao", "h");
                }
            },
            threaten: 1.55,
        },
        subSkill: {
            global: {
                audio: "mjsquanxuelishi",
                enable: "phaseUse",
                prompt() {
                    const player = get.player();
                    const targets = game.filterPlayer(target => lib.skill.mjsnewquanxuelishi_global.filterTarget(null, player, target));
                    let str = "将一张牌交给" + get.translation(targets);
                    if (targets.length > 1) {
                        str += "中的一人";
                    }
                    return str;
                },
                filter(event, player) {
                    if (!player.countCards("he")) {
                        return false;
                    }
                    return game.hasPlayer(target => lib.skill.mjsnewquanxuelishi_global.filterTarget(null, player, target));
                },
                filterTarget(card, player, target) {
                    return target != player && target.hasSkill("mjsnewquanxuelishi") && !target.hasSkill("mjsnewquanxuelishi_used", null, null, false);
                },
                selectTarget() {
                    const player = get.player();
                    const count = game.countPlayer(target => lib.skill.mjsnewquanxuelishi_global.filterTarget(null, player, target));
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
                position: "he",
                selectCard: [1, Infinity],
                discard: false,
                lose: false,
                delay: false,
                line: true,
                log: false,
                async precontent(event, trigger, player) {
                    event.result.targets[0].logSkill("mjsnewquanxuelishi", player, null, null, [get.rand(1, 2)]);
                },
                async content(event, trigger, player) {
                    const { target } = event;
                    if (event.cards.containsAll(...player.getCards("h")) && player.getCards("h").containsAll(...event.cards)) {
                        event.todraw = true;
                    }
                    target.addTempSkill("mjsnewquanxuelishi_used", "phaseUseEnd");
                    await player.give(event.cards, target);
                    if (target.countCards("h")) {
                        const num = Math.min(event.cards.length, target.countCards("h"));
                        await target
                            .chooseToGive(`请还给${get.translation(player)}${num}张牌`, "he", player, num, true)
                            .set("ai", card => {
                                let player = _status.event.player,
                                    target = get.event().target;
                                if (get.attitude(player, target) <= 0) {
                                    if (card.name == "du") {
                                        return 1145141919810;
                                    }
                                    return -get.value(card);
                                }
                                return 8 - Math.sqrt(target.hp) - get.value(card);
                            })
                            .set("target", player);
                        if (event.todraw) {
                            await player.draw();
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
    //刘备
    /**三顾茅庐
     * 当你每累计主动交给一名其他角色3张牌后，你可以令其每个出牌阶段的出杀次数+1或者手牌上限+1。
     * */
    mjsnewsangumaolu: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        init(player, skill) {
            if (!player.storage[skill]) {
                player.storage[skill] = {};
            }
        },
        trigger: {
            player: "mjsnewsangumaoluEvent",
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseControl("手牌上限", "出杀次数", "cancel2")
                .set("prompt", get.prompt2(event.skill, trigger.target))
                .set("ai", () => {
                    const player = get.player();
                    const trigger = _status.event.getTrigger();
                    if (get.attitude(player, trigger.target) <= 0) return 2;
                    if (trigger.target.getHandcardLimit() <= 6) return 0;
                    return get.rand(0, 1);
                })
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
                lib.skill.mjsallsha.change(target, 1);
            }
        },
        group: "mjsnewsangumaolu_counter",
        subSkill: {
            counter: {
                trigger: {
                    global: ["gainEnd", "loseAsyncEnd"],
                },
                forced: true,
                locked: false,
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
                    const target = event.targets[0];
                    const num = trigger.getg(target).length;
                    if (!player.storage.mjsnewsangumaolu[target.playerid]) {
                        player.storage.mjsnewsangumaolu[target.playerid] = 0;
                    }
                    player.storage.mjsnewsangumaolu[target.playerid] += num;
                    player.markSkill("mjsnewsangumaolu", true);
                    while (player.storage.mjsnewsangumaolu[target.playerid] >= 3) {
                        player.storage.mjsnewsangumaolu[target.playerid] -= 3;
                        player.markSkill("mjsnewsangumaolu", true);
                        const next = game.createEvent("mjsnewsangumaoluEvent");
                        next.player = player;
                        next.target = target;
                        next.setContent("emptyEvent");
                        await next;
                    }
                },
            },
        },
    },
    /**携民渡江
     * 其他角色可以将其在弃牌阶段弃置的牌交给你，这些牌不计入手牌上限，你无法打出或弃置这些牌。
     * */
    mjsnewxiemindujiang: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        mod: {
            ignoredHandcard(card) {
                if (card.hasGaintag("eternal_mjsnewxiemindujiang_tag")) {
                    return true;
                }
            },
            cardDiscardable(card, _, name) {
                if (card.hasGaintag("eternal_mjsnewxiemindujiang_tag")) {
                    return false;
                }
            },
            cardEnabled2(card) {
                if (get.itemtype(card) == "card" && card.hasGaintag("eternal_mjsnewxiemindujiang_tag")) {
                    return false;
                }
            },
        },
        global: "mjsnewxiemindujiang_global",
        subSkill: {
            global: {
                trigger: {
                    player: ["loseAfter"],
                    global: ["loseAsyncAfter"],
                },
                popup: false,
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
                        return target != player && target.hasSkill("mjsnewxiemindujiang");
                    });
                    if (!targets.length) return;
                    event.result = await player
                        .chooseTarget(get.prompt(event.skill), "将弃置的牌交给一名其他角色", (card, player, target) => {
                            return target != player && target.hasSkill("mjsnewxiemindujiang");
                        })
                        .set("ai", target => {
                            const player = get.player();
                            const cards = trigger.getl(player).cards2.filterInD("d");
                            var val = 0;
                            for (var card of cards) {
                                val += target.getUseValue(card);
                            }
                            return val * get.attitude(player, target);
                        })
                        .forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    target.logSkill("mjsnewxiemindujiang", player);
                    const cards = trigger.getl(player).cards2.filterInD("d");
                    const gainEvent = target.gain(cards, "gain2");
                    gainEvent.giver = player;
                    await gainEvent;
                    target.addGaintag(cards, "eternal_mjsnewxiemindujiang_tag");
                },
            },
            tag: {
                name: "民",
            },
        },
    },
    //曹操
    /**乱世奸雄
     * 受伤，获得对你造成伤害的牌，并且可以立即打出其中1张牌。
     * */
    mjsoldluanshijianxiong: {
        nobracket: true,
        audio: "mjstianbufuwo",
        trigger: {
            global: ["gainAfter", "loseAsyncAfter"],
        },
        usable: 1,
        getIndex(event, player) {
            return game
                .filterPlayer(target => {
                    if (target == player || target == _status.currentPhase) return false;
                    return event.getg?.(target)?.length;
                })
                .sortBySeat();
        },
        async cost(event, trigger, player) {
            const target = event.indexedData;
            event.result = await player
                .chooseControl("手牌上限+1", "手牌上限-1", "cancel2")
                .set("prompt", get.prompt(event.skill, target))
                .set("ai", () => {
                    return get.attitude(get.player(), get.event().getParent().indexedData) > 0 ? 0 : 1;
                })
                .forResult();
            if (event.result.index != 2) {
                event.result.cost_data = event.result.index;
            }
        },
        logTarget(event, player, name, target) {
            return target;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            target.addTempSkill("mjsoldluanshijianxiong_max", { player: "phaseEnd" });
            target.storage.mjsoldluanshijianxiong_max += (event.cost_data == 0 ? 1 : -1);
        },
        group: "mjsoldluanshijianxiong_jianxiong",
        subSkill: {
            jianxiong: {
                audio: "mjstianbufuwo",
                trigger: {
                    player: "damageEnd",
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    return get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
                },
                async content(event, trigger, player) {
                    await player.gain(trigger.cards, "gain2");
                    await player
                        .chooseToUse(`你发动了【${get.translation(event.name)}】`, "你可以立即打出1张牌", function (card) {
                            if (!lib.filter.cardEnabled(card, _status.event.player, _status.event)) {
                                return false;
                            }
                            return get.event().cards.includes(card);
                        })
                        .set("cards", trigger.cards);
                },
                ai: {
                    maixie: true,
                    "maixie_hp": true,
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
            max: {
                charlotte: true,
                init(player, skill) {
                    if (!player.storage[skill]) {
                        player.storage[skill] = 0;
                    }
                },
                onremove: true,
                mod: {
                    maxHandcard(player, num) {
                        var info = player.storage.mjsoldluanshijianxiong_max;
                        if (typeof info == "number") {
                            return num + info;
                        }
                    },
                },
            },
        },
    },
    /**天时
     * 所有角色获得“归心”。
     * */
    mjsoldtianshi: {
        audio: "mjsxietianyiling",
        derivation: "mjsoldguixin",
        global: "mjsoldguixin",
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return (event.name != "phase" || game.phaseNumber == 0);
        },
        async content(event, trigger, player) { },
    },
    /**归心
     * 受伤，你可以摸1张牌。
     * */
    mjsoldguixin: {
        audio: "mjstianxiaguixin",
        trigger: {
            player: "damageEnd",
        },
        async content(event, trigger, player) {
            player.draw();
        },
    },
    //孙权
    /**地利
     * 所有角色获得“权衡”。
     * */
    mjsolddili: {
        audio: ["mjsquanxuelishi", 2],
        derivation: "mjsoldquanheng",
        global: "mjsoldquanheng",
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return (event.name != "phase" || game.phaseNumber == 0);
        },
        async content(event, trigger, player) { },
    },
    /**地利
     * 每回合限1次，你可以弃置任意张手牌或装备牌，然后摸等量的牌。
     * */
    mjsoldquanheng: {
        audio: "mjstianxiaguixin",
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
        position: "he",
        filterCard: true,
        selectCard: [1, Infinity],
        allowChooseAll: true,
        prompt: "弃置任意张牌并摸等量的牌",
        check(card) {
            let player = _status.event.player;
            if (get.position(card) == "e") {
                let subs = get.subtypes(card);
                if (subs.includes("equip2") || subs.includes("equip3")) {
                    return player.getHp() - get.value(card);
                }
            }
            return 6 - get.value(card);
        },
        async content(event, trigger, player) {
            player.tempBanSkill(event.name, false, false);
            player.draw(event.cards.length);
        },
        ai: {
            order: 1,
            result: {
                player: 1,
            },
            threaten: 1.5,
        },
    },
    //刘备
    /**以德服人
     * 你可以交给其他角色任意张牌，令其直到你的下个回合开始，出杀后摸1张牌，每因此交出1张牌，自己回复1点体力。
     * */
    mjsoldyidefuren: {
        nobracket: true,
        audio: "mjsweixianweide",
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
            player.addTempSkill("mjsoldyidefuren_effect", { player: "phaseBegin" });
            player.markAuto("mjsoldyidefuren_effect", [target]);
            await player.recover(event.cards.length);
        },
        ai: {
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
            threaten: 0.8,
        },
        subSkill: {
            effect: {
                trigger: {
                    global: "useCard",
                },
                forced: true,
                popup: false,
                charlotte: true,
                onremove: true,
                filter(event, player) {
                    return event.card.name == "sha" && player.hasStorage("mjsoldyidefuren_effect", event.player);
                },
                async content(event, trigger, player) {
                    trigger.player.draw();
                },
            },
        },
    },
    /**人和
     * 所有角色获得“激将”。
     * */
    mjsoldrenhe: {
        audio: "mjssangumaolu",
        derivation: "mjsoldjijiang",
        global: "mjsoldjijiang",
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return (event.name != "phase" || game.phaseNumber == 0);
        },
        async content(event, trigger, player) { },
    },
    /**激将
     * 每回合出杀次数+1。
     * */
    mjsoldjijiang: {
        audio: "mjsxiemindujiang",
        mod: {
            cardUsable(card, player, num) {
                if (card.name == "sha") return num + 1;
            },
        },
        trigger: {
            player: "useCard1",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return !event.audioed && event.card.name == "sha" && player.countUsed("sha", true) > 1 && event.getParent().type == "phase";
        },
        async content(event, trigger, player) {
            trigger.audioed = true;
        },
    },
};

const skills2 = {
    //赵高
    /**奸臣当道
     * 其他角色摸牌时，你摸1张牌。
     * */
    mjsjianchendangdao: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        trigger: {
            global: "drawAfter",
        },
        forced: true,
        locked: false,
        charlotte: true,
        filter(event, player) {
            if (event.getParent().name == "mjsjianchendangdao") {
                return false;
            }
            return event.player != player;
        },
        async content(event, trigger, player) {
            player.draw();
        },
    },
    /**指鹿为马
     * 回合开始时，将随机一名其他角色的手牌随机转化为其他牌。其他角色打出被转化的牌后，你摸2张牌。其他角色的出牌阶段结束时，每张被转化的牌对其造成1点伤害。
     * */
    mjszhiluweima: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:3",
        persevereSkill: true,
        trigger: {
            player: "phaseBegin",
        },
        popup: false,
        forced: true,
        locked: false,
        charlotte: true,
        async content(event, trigger, player) {
            const target = game.filterPlayer(target => target != player).randomGet();
            if (!target?.isIn()) return;
            player.logSkill(event.name, target);
            const cards = target.getCards("h");
            for (const card of cards) {
                const name = lib.inpile.randomGet();
                game.broadcastAll(
                    function (card) {
                        card.init([card.suit, card.number, name]);
                        //card.addGaintag("eternal_mjszhiluweima_converted");
                    },
                    card,
                );
            }
        },
        group: ["mjszhiluweima_use", "mjszhiluweima_end"],
        subSkill: {
            converted: {
                name: "转化",
            },
            use: {
                trigger: {
                    global: ["useCardAfter", "respondAfter"],
                },
                forced: true,
                locked: false,
                charlotte: true,
                filter(event, player) {
                    if (event.player == player) return false;
                    if (get.is.convertedCard(event.card)) {
                        return true;
                    }
                    return event.player.hasHistory("lose", function (evt) {
                        return evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.some(tag => tag.startsWith("eternal_") && tag.endsWith("_converted")));
                    });
                },
                async content(event, trigger, player) {
                    player.draw(2);
                },
            },
            end: {
                trigger: {
                    global: "phaseUseEnd",
                },
                forced: true,
                locked: false,
                charlotte: true,
                filter(event, player) {
                    if (event.player == player) return false;
                    return event.player.hasCard(card => {
                        if (get.is.convertedCard(card)) return true;
                        return card?.gaintag?.some(tag => tag.startsWith("eternal_") && tag.endsWith("_converted"));
                    }, "h");
                },
                async content(event, trigger, player) {
                    const num = trigger.player.countCards("h", card => {
                        if (get.is.convertedCard(card)) return true;
                        return card?.gaintag?.some(tag => tag.startsWith("eternal_") && tag.endsWith("_converted"));
                    });
                    if (num > 0) {
                        await trigger.player.damage(num);
                    }
                },
            },
        },
    },
    /**沙丘之变
     * 限定，当其他角色阵亡时，你获得其所有牌，立即开始你的回合，并且此回合内，其他角色无法响应你打出的牌，此回合结束时，你回复7点体力。
     * */
    mjsshaqiuzhibian: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        trigger: {
            global: "die",
        },
        limited: true,
        filter(event) {
            return event.player.countCards("he") > 0;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            player.awakenSkill(event.name);
            event.togain = trigger.player.getCards("he");
            await player.gain(event.togain, trigger.player, "giveAuto", "bySelf");
            player
                .when("phaseBegin")
                .then(async (event, trigger, player) => {
                    player.addTempSkill("mjsshaqiuzhibian_effect");
                    player
                        .when("phaseEnd")
                        .then(() => {
                            player.recover(7);
                        });
                });
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
        subSkill: {
            effect: {
                trigger: {
                    player: "useCard",
                },
                forced: true,
                locked: false,
                charlotte: true,
                content() {
                    trigger.directHit.addArray(
                        game.filterPlayer(function (current) {
                            return current != player;
                        })
                    );
                },
            },
        },
    },
    //十常侍
    /**浊乱海内
     * 回合开始时，登场“张让”，并随机登场2个“常侍”，直至你的下个回合开始。重伤，随机删除1个“常侍”，并回复1点体力。
     * 1.张让-夺权：其他角色的回合结束时，若其本回合未对你造成过伤害，你获得其2张牌。
     * 2.赵忠-弄权：回合结束时，你每有2张手牌，你的体力上限+2，并回复1点体力。
     * 3.夏浑-构陷：当其他角色弃牌时，随机对1名其他角色造成1点伤害。
     * 4.郭胜-卖官：当你打出行动牌时，随机弃置1张牌，然后随机获得一名其他其他角色1张牌。
     * 5.孙璋-受赂：其他角色出牌阶段开始后，你随机获得其1张牌，然后令其出杀次数+1。
     * 6.毕岚-横征：出牌阶段开始时，随机获得其他角色各1张牌。
     * 7.栗嵩-弄法：所有其他角色摸牌阶段摸牌数-1，自己摸牌阶段摸牌数+1。
     * 8.段珪-劫持：回合开始时选择一名其他角色，直到你的下个回合开始，你受到伤害后，其受到等量的伤害，其摸牌后，你摸等量张牌。
     * 9.高望-勒索：其他角色即将回复体力时，你令其交给你1张牌，否则其回复体力的效果无效。
     * 10.张恭-监视：其他角色回合结束时，其手牌中每少1种类型的牌，你获得1张对应类型的牌。
     * 11.韩悝-搜刮：当你打出牌时，若其他角色的手牌中存在相同类型的牌，你随机获得其中1张牌。
     * 12.宋典-冤狱：受伤，你可以添加1张霜冻至一名其他角色的卜卦区。
     * */
    mjszhuoluanhainei: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        derivation: ["mjsscsduoquan", "mjsscsnongquan", "mjsscsgouxian", "mjsscsmaiguan", "mjsscsshoulu", "mjsscshengzheng", "mjsscsnongfa", "mjsscsjiechi", "mjsscslesuo", "mjsscsjianshi", "mjsscssougua", "mjsscsyuanyu"],
        trigger: {
            player: ["phaseBegin", "dying"],
        },
        silent: true,
        popup: true,
        filter(event, player) {
            return event.name == "phase" || player.getStorage("mjszhuoluanhainei_show").length;
        },
        async content(event, trigger, player) {
            if (trigger.name == "phase") {
                const skills = ["mjsscsduoquan"];
                const skills2 = lib.skill.mjszhuoluanhainei.derivation.slice().removeArray(skills).randomGets(2);
                if (skills2.length) {
                    skills.addArray(skills2);
                }
                player.addTempSkill("mjszhuoluanhainei_show", { player: "phaseBegin" })
                player.addTempSkills(skills2, { player: "phaseBegin" });
            } else {
                const list = player.getStorage("mjszhuoluanhainei_show");
                if (list.length) {
                    const toRemove = list.randomGets(1);
                    player.unmarkAuto("mjszhuoluanhainei_show", toRemove);
                    await player.recover(1);
                }
            }
        },
        subSkill: {
            show: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    mjsscsduoquan: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            global: "phaseEnd",
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            if (event.player == player || event.player.hasHistory("sourceDamage", evt => evt.player == player)) {
                return false;
            }
            return event.player.countGainableCards(player, "he");
        },
        logTarget: "player",
        async content(event, trigger, player) {
            await player.gainPlayerCard(trigger.player, "he", 2, true);
        },
    },
    mjsscsnongquan: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            player: "phaseEnd",
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            return player.countCards("h") > 1;
        },
        async content(event, trigger, player) {
            const num = Math.floor(player.countCards("h") / 2);
            if (num > 0) {
                await player.gainMaxHp(num * 2);
                await player.recover(num);
            }
        },
    },
    mjsscsgouxian: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            global: ["loseAfter","loseAsyncAfter"],
        },
        silent: true,
        popup: true,
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
        async content(event, trigger, player) {
            const targets = game.filterPlayer(target => target != player);
            if (targets.length) {
                const target = targets.randomGet();
                player.line(target);
                await target.damage();
            }
        },
    },
    mjsscsmaiguan: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            player: ["useCard", "respond"],
        },
        silent: true,
        popup: true,
        filter(event, player) {
            return get.type(event.card) == "basic";
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const cards = player.getCards("he", card => {
                return lib.filter.cardDiscardable(card, player, event.name);
            });
            if (cards.length > 0) {
                await player.discard(cards.randomGets(1));
            }
            const targets = game.filterPlayer(current => {
                return current != player && current.countGainableCards(player, "he");
            });
            if (targets.length) {
                const target = targets.randomGet();
                const cards = target.getGainableCards(player, "he");
                if (cards.length) {
                    await player.gain(cards.randomGets(1), target, "giveAuto", "bySelf");
                }
            }
        },
    },
    mjsscsshoulu: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            global: "phaseUseBegin",
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            return event.player != player;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const target = trigger.player;
            const cards = target.getGainableCards(player, "he");
            if (cards.length) {
                await player.gain(cards.randomGets(1), target, "giveAuto", "bySelf");
            }
            trigger.player.addTempSkill("mjsscsshoulu_sha", "phaseUseAfter");
            trigger.player.addMark("mjsscsshoulu_sha", 1, false);
        },
        subSkill: {
            sha: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == "sha") {
                            return num + player.countMark("mjsscsshoulu_sha");
                        }
                    },
                },
            },
        },
    },
    mjsscshengzheng: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            player: "phaseUseBegin",
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            return game.hasPlayer(target => {
                return target != player && target.countGainableCards(player, "he");
            });
        },
        async content(event, trigger, player) {
            const targets = game.filterPlayer(target => {
                return target != player && target.countGainableCards(player, "he");
            });
            for (const target of targets) {
                if (!target?.isIn()) {
                    continue;
                }
                const cards = target.getGainableCards(player, "he");
                if (cards.length) {
                    await player.gain(cards.randomGets(1), target, "giveAuto", "bySelf");
                }
            }
        },
    },
    mjsscsnongfa: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            global: "phaseDrawBegin2",
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            return !event.numFixed;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            trigger.num += (trigger.player == player ? 1 : -1);
        },
    },
    mjsscsjiechi: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            player: "phaseBegin",
        },
        silent: true,
        popup: true,
        forced: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(`选择1名其他角色发动${get.prompts(event.skill)}，当其获得牌后，你摸1张牌`, lib.filter.notMe, true)
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
            const skill = event.name + "_effect";
            delete player.storage[skill];
            player.addTempSkill(skill, { player: "phaseBegin" });
            player.markAuto(skill, [target]);
            player.addTip(skill, get.translation(skill).slice(-2) + " " + player.getStorage(skill).reduce((str, target) => str + get.translation(target), ""), false, { whiteSpace: "nowrap" });
        },
        subSkill: {
            effect: {
                trigger: {
                    player: "damageEnd",
                    global: ["gainAfter","loseAsyncAfter"],
                },
                popup: false,
                charlotte: true,
                silent: true,
                onremove(player, skill) {
                    delete player.storage[skill];
                    player.removeTip(skill);
                },
                getIndex(event, player) {
                    if (event.name == "damage") {
                        return player.getStorage("mjsscsjiechi_effect").filter(target => {
                            return target?.isIn();
                        });
                    }
                    if (event.getParent().name != "draw") {
                        return [];
                    }
                    if (event.name == "loseAsync" && event.type != "gain") return [];
                    return game
                        .filterPlayer(target => {
                            if (!event.getg?.(target)?.length) return false;
                            return player.hasStorage("mjsscsjiechi_effect", target);
                        })
                        .sortBySeat();
                },
                logTarget(event, player, triggername, target) {
                    return target;
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    if (trigger.name == "damage") {
                        await target.damage();
                    } else {
                        await player.draw();
                    }
                },
                mark: true,
                intro: {
                    markcount: () => 0,
                    content: "你受到伤害后，$受到等量的伤害；$摸牌后，你摸1张牌",
                },
            },
        },
    },
    mjsscslesuo: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            global: "recoverBegin",
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            return event.player != player;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const result = await trigger.player
                .chooseToGive(player, "he", `选择交给${get.translation(player)}1张牌，否则你回复体力的效果无效。`)
                .set("ai", card => {
                    if (get.event().goon) {
                        return 8 - get.value(card);
                    }
                    return 5 - get.value(card);
                })
                .set(
                    "goon",
                    (() => {
                        const eff = get.recoverEffect(player, trigger.source || player, player);
                        if (eff <= 0) {
                            return false;
                        }
                        return player.isDying() || trigger.num >= player.getDamagedHp();
                    })()
                )
                .forResult();
            if (!result.bool) {
                trigger.cancel();
            }
        },
    },
    mjsscsjianshi: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            global: "phaseEnd",
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            return event.player != player;
        },
        async content(event, trigger, player) {
            const target = trigger.player;
            const hs = target.getCards("h");
            const types = hs.reduce((list, card) => list.add(get.type2(card)), []);
            const list = ["basic", "trick", "equip"].slice().removeArray(types);
            if (!list.length) {
                return;
            }
            const cards = [];
            for (const type of list) {
                const card = get.cardPile(card => {
                    return get.type2(card) == type && !cards.includes(card);
                }, null, "random");
                if (card) {
                    cards.push(card);
                }
            }
            if (cards.length) {
                await player.gain(cards, "draw");
            }
        },
    },
    mjsscssougua: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            player: ["useCard", "respond"],
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            return game.hasPlayer(target => {
                return target != player && target.getGainableCards(player, "h").some(card => get.name(card, target) == event.card.name);
            });
        },
        async content(event, trigger, player) {
            const targets = game.filterPlayer(target => {
                return target != player && target.getGainableCards(player, "h").some(card => get.name(card, target) == trigger.card.name);
            });
            if (targets.length) {
                const target = targets.randomGet();
                const cards = target.getGainableCards(player, "h").filter(card => get.name(card, target) == trigger.card.name);
                if (cards.length) {
                    await player.gain(cards.randomGets(1), target, "giveAuto", "bySelf");
                }
            }
        },
    },
    mjsscsyuanyu: {
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        charlotte: true,
        trigger: {
            player: "damageEnd",
        },
        silent: true,
        forced: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    return target.canAddJudge({ name: "mjsshuangdong" });
                })
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
            const card = game.createCard("mjsshuangdong", "spade", 8);
            if (card && target.canAddJudge(card)) {
                await target.addJudge(card);
            }
        },
    },
    //淖齿
    /**抽筋悬梁
     * 回合开始时，封禁一名其他角色，然后将其所有手牌移出游戏，直到当前回合结束。 
     * */
    mjschoujinxuanliang: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        trigger: {
            player: "phaseBegin",
        },
        popup: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
                .set("ai", target => {
                    const player = get.player();
                    return get.attitude(player, target) * target.countCards("h");
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            target.addTempSkill("baiban");
            const cards = target.getCards("he").randomGets(3);
            if (!cards.length) return;
            const next = target.addToExpansion(cards, "giveAuto", target);
            next.gaintag.add("mjschoujinxuanliang");
            await next;
            target
                .when({ global: "phaseEnd" })
                .then(() => {
                    const cards = player.getExpansions("mjschoujinxuanliang");
                    if (cards.length) {
                        player.gain(cards, "draw");
                        game.log(player, "收回了" + get.cnNumber(cards.length) + "张牌");
                    }
                });
        },
        intro: {
            markcount: "expansion",
            mark(dialog, storage, player) {
                var cards = player.getExpansions("mjschoujinxuanliang");
                if (player.isUnderControl(true)) {
                    dialog.addAuto(cards);
                } else {
                    return "共有" + get.cnNumber(cards.length) + "张牌";
                }
            },
        },
    },
    /**天地三问
     * 出牌阶段限3次，每次弃置1张不同花色的手牌，然后令一名其他角色弃置所有与此牌相同花色的手牌，并失去1点体力。
     * */
    mjstiandisanwen: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        enable: "phaseUse",
        usable: 3,
        filterCard(card) {
            const player = get.player();
            return !player.hasStorage("mjstiandisanwen_used", get.suit(card, player));
        },
        filterTarget: lib.filter.notMe,
        async content(event, trigger, player) {
            const target = event.targets[0];
            const suit = get.suit(event.cards[0]);
            player.addTempSkill("mjstiandisanwen_used", "phaseUseAfter");
            player.markAuto("mjstiandisanwen_used", [suit]);
            const cards = target.getCards("h", { suit: suit });
            if (cards.length) {
                await target.modedDiscard(cards);
            }
            await target.loseHp();
        },
        ai: {
            order: 10,
            result: {
                target(player, target) {
                    return (target.countCards("h") + 1) * get.effect(target, { name: "losehp" }, player);
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
    /**裂土分赃
     * 其他角色阵亡后，你随机获得其1个武将技能。
     * */
    mjslietufenzang: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        trigger: {
            global: "dieAfter",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return event.player != player;
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const skills = trigger.player.getSkills(null, false, false).filter(skill => {
                const info = get.info(skill);
                if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
                    return false;
                }
                return true;
            });
            if (!skills.length) return;
            const createSkills = mjs.addCreateSkills(skills.randomGets(1));
            await player.addSkills(createSkills);
        },
    },
    //江充
    /**巫蛊之祸
     * 每个回合开始时，随机为一名其他角色添加1张巫蛊人偶至其手牌。
     * （巫蛊人偶：无点数无花色行动牌，无法主动打出。你的回合开始时，随机弃置所有其他角色的各1张牌。） 
     * */
    mjswuguzhihuo: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        trigger: {
            global: "phaseBefore",
        },
        forced: true,
        locked: false,
        charlotte: true,
        async content(event, trigger, player) {
            const target = game.filterPlayer(target => target != player).randomGet();
            if (!target?.isIn()) return;
            const card = game.createCard2("mjswugurenou", "none", 0);
            if (card) {
                await target.gain(card, "gain2");
            }
        },
    },
    /**绣衣持节
     * 其他角色即将对你造成伤害时，若其手牌中存在巫蛊人偶，则需要弃置1张巫蛊人偶，否则此伤害无效。 
     * */
    mjsxiuyichijie: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        trigger: {
            global: "damageBegin2",
        },
        forced: true,
        locked: false,
        charlotte: true,
        filter(event, player) {
            return event.source && event.source.countCards("h", "mjswugurenou");
        },
        async content(event, trigger, player) {
            const result = await trigger.source
                .chooseToDiscard(`${get.translation(player)}对你发动了${get.poptip(event.name)}`, "你需要弃置1张巫蛊人偶，否则此伤害无效", card => {
                    return card.name == "mjswugurenou";
                })
                .set("ai", card => {
                    const player = get.player();
                    const source = get.event().getParent().player;
                    if (source.hasSkill("mjskufaxianyu")) {
                        if (get.damageEffect(player, source, player) >= 0) {
                            return 10;
                        }
                        if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
                            return 0;
                        }
                        return get.unuseful(card) + 1 * (5 - player.hp);
                    }
                    return get.unuseful(card) + 2.5 * (5 - player.hp);
                })
                .forResult();
            if (!result?.bool) {
                trigger.cancel();
            }
        },
    },
    /**酷法陷狱
     * 当有角色弃置巫蛊人偶时，你对其造成1点伤害。  
     * */
    mjskufaxianyu: {
        nobracket: true,
        audio: "ext:名将杀/audio/skill:2",
        persevereSkill: true,
        trigger: {
            global: ["loseAfter", "loseAsyncAfter"],
        },
        forced: true,
        locked: false,
        charlotte: true,
        getIndex(event, player) {
            if (event.type != "discard" || event.getlx === false) {
                return [];
            }
            return game.filterPlayer(target => {
                return event.getl?.(target)?.cards2?.some(card => card.name == "mjswugurenou");
            }).sortBySeat();
        },
        filter(event, player, triggername, target) {
            return target?.isIn();
        },
        logTarget(event, player, triggername, target) {
            return target;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            target.damage();
        },
    },
};

Object.assign(skills, skills2);

const skills3 = {
    //年兽
    /**烈焰噬心
     * 受到的火焰伤害+1。
     * 破军阶段：受到的火焰伤害+1。你造成的伤害+1。你受到的伤害+1。
     * */
    mjslieyanshixin: {
        nobracket: true,
        trigger: {
            player: "damageBegin3",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return event.hasNature("fire");
        },
        async content(event, trigger, player) {
            trigger.num++;
        },
    },
    /**森罗万象
     * 登场，复制所有其他角色的各1个技能。
     * 破军阶段：登场，复制所有其他角色的各1个技能。回合开始时，获得其他所有角色1张手牌的复制。
     * */
    mjssenluowanxiang: {
        nobracket: true,
        trigger: {
            global: "phaseBefore",
            player: ["enterGame", "changeSkillsAfter"],
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            if (event.name == "changeSkills") {
                return event.addSkill.includes("mjssenluowanxiang");
            }
            return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
            const targets = game.filterPlayer(target => target != player);
            for (const target of targets) {
                const skills = target.getSkills(null, false, false).filter(skill => {
                    const info = get.info(skill);
                    if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
                        return false;
                    }
                    return true;
                });
                if (skills.length) {
                    const createSkills = mjs.addCreateSkills(skills.randomGets(1));
                    await player.addSkills(createSkills);
                }
            }
        },
    },
    /**亢龙成煞
     * 当你回复体力时，改为对所有其他角色依次造成1点伤害。
     * 破军阶段：当你回复体力时，改为对所有其他角色依次造成1点伤害，并且令其流血+1。
     * */
    mjskanglongchengsha: {
        nobracket: true,
        trigger: {
            player: "recoverBegin",
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
            trigger.cancel();
            const targets = game.filterPlayer(target => target != player).sortBySeat(player);
            for (const target of targets) {
                await target.damage();
            }
        },
    },
    /**一气双身
     * 登场，卜卦，若结果为8，召唤年兽。
     * 破军阶段：登场，最多卜卦2次，若结果为8，召唤年兽。
     * */
    mjsyiqishuangshen: {
        nobracket: true,
        trigger: {
            global: "phaseBefore",
            player: ["enterGame", "changeSkillsAfter"],
        },
        forced: true,
        locked: false,
        priority: 2,
        filter(event, player) {
            if (event.name == "changeSkills") {
                return event.addSkill.includes("mjsyiqishuangshen");
            }
            return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
            const result = await player
                .judge(card => {
                    if (get.number(card) == 8) return 2;
                    return -2;
                })
                .set("judge2", result => result.bool)
                .forResult();
            if (result?.bool) {
                const target = await game.addPlayerOL(player, "mjs_nianshou", null, true);
                if (get.itemtype(target) != "player") {
                    return;
                }
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
                const next = game.createEvent("changeSkills");
                next.player = target;
                next.addSkill = get.character("mjs_nianshou")?.skills;
                next.setContent("emptyEvent");
                await next;
            }
        },
    },
};

Object.assign(skills, skills3);

const skills4 = {
    //卞喜
    /**盘查
     * 登场，将所有手牌交给一名其他角色。拥有你的牌的其他角色无法选择你为手牌或技能的目标。
     * */
    mjsnpcfengying: {
        trigger: {
            global: "phaseBefore",
            player: ["enterGame", "changeSkillsAfter"],
        },
        popup: false,
        filter(event, player) {
            if (!player.countCards("h")) {
                return false;
            }
            if (!game.hasPlayer(target => target != player)) {
                return false;
            }
            if (event.name == "changeSkills") {
                return event.addSkill.includes("mjsyiqishuangshen");
            }
            return (event.name != "phase" || game.phaseNumber == 0);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(`将所有手牌交给1名其他角色发动${get.prompts(event.skill)}`, lib.filter.notMe, true)
                .set("ai", target => {
                    const player = get.player();
                    const att = get.attitude(player, target);
                    return get.sgnAttitude(player, target) * att;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            const cards = player.getCards("h");
            if (cards.length) {
                await player.give(cards, target);
            }
        },
        group: "mjsnpcfengying_effect",
        subSkill: {
            effect: {
                charlotte: true,
                mod: {
                    targetEnabled(card, player, target, now) {
                        if (!target.hasStorage("mjsnpcfengying_effect", player)) {
                            return;
                        }
                        if (target != player) {
                            return false;
                        }
                    },
                    skillEnabledx(player, target) {
                        if (!target.hasStorage("mjsnpcfengying_effect", player)) {
                            return;
                        }
                        if (target != player) {
                            return false;
                        }
                    },
                },
                group: ["mjsnpcfengying_gain", "mjsnpcfengying_lose"],
            },
            gain: {
                trigger: {
                    global: ["gainEnd", "loseAsyncEnd"],
                },
                silent: true,
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
                    return target?.isIn();
                },
                logTarget(event2, player2, name, target) {
                    return target;
                },
                async content(event2, trigger, player2) {
                    const target = event2.indexedData;
                    const gain = trigger.getg?.(target);
                    const lose = trigger.getl?.(player2)?.cards2;
                    target.addGaintag(
                        gain.filter((i) => trigger.giver === player2 || lose.includes(i)),
                        "mjsnpcfengying"
                    );
                    player.markAuto("mjsnpcfengying_effect", target);
                },
            },
            lose: {
                trigger: {
                    global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
                },
                silent: true,
                forced: true,
                locked: false,
                getIndex(event, player, triggername) {
                    return game.filterPlayer(target => {
                        const evt = event.getl(target);
                        return evt && evt.player == target && evt.hs && evt.hs.length && lib.skill.mjsyanxiugongchan.getCards(player).containsSome(...evt.hs);
                    }).sortBySeat(player);
                },
                filter(event, player, name, target) {
                    if (target.countCards("h", card => lib.skill.mjsyanxiugongchan.getCards(player).includes(card))) {
                        return false;
                    }
                    return player.hasStorage("mjsnpcfengying_effect", target);
                },
                logTarget: (event, player, triggername, target) => target,
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    player.unmarkAuto("mjsnpcfengying_effect", target);
                },
            },
        },
    },
    /**盘查
     * 拥有你的牌的其他角色失去最后一张你的牌时，对其打出牌堆顶的第1张杀。
     * */
    mjsnpcmaifu: {
        trigger: {
            global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        silent: true,
        popup: true,
        forced: true,
        locked: false,
        getIndex(event, player, triggername) {
            return game.filterPlayer(target => {
                const evt = event.getl(target);
                return evt && evt.player == target && evt.hs && evt.hs.length && lib.skill.mjsyanxiugongchan.getCards(player).containsSome(...evt.hs);
            });
        },
        filter(event, player, name, target) {
            if (target.countCards("h", card => lib.skill.mjsyanxiugongchan.getCards(player).includes(card))) {
                return false;
            }
            return player.canUse({ name: "sha" }, target, false, false);
        },
        logTarget: (event, player, triggername, target) => target,
        check(event, player, triggername, target) {
            return get.effect(target, { name: "sha" }, player, player) > 0;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            const card = get.cardPile2("sha");
            if (card) {
                await player.useCard(card, target, false);
            }
        },
    },
    /**盘查
     * 在你的第3个回合开始时，逃离战斗。
     * */
    mjsnpctaopao: {
        trigger: {
            player: "phaseBegin",
        },
        silent: true,
        popup: true,
        forced: true,
        locked: false,
        filter(event, player) {
            return player.phaseNumber == 3;
        },
        async content(event, trigger, player) {
            player.die("nosource").includeOut = true;
        },
        ai: {
            neg: true,
        },
    },
    //蔡阳
    /**盘查
     * 登场，添加装备上限张开山斧至你的手牌并装备，然后将1张手牌当作杀，对一名敌方角色打出。
     * */
    mjsnpczhuisha: {
        trigger: {
            global: "phaseBefore",
            player: ["enterGame","changeSkillsAfter"],
        },
        silent: true,
        locked: false,
        filter(event, player) {
            if (event.name == "changeSkills") {
                return event.addSkill.includes("mjsnpczhuisha");
            }
            return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
            for (let i = 0; i < player.mjsGetEquipLimit(); i++) {
                const card = game.createCard("mjskaishanfu", "diamond", 8);
                if (card) {
                    await player.gain(card, "gain2");
                    await game.delayx();
                    await player.equip(card);
                }
            }
            if (player.hasCard((cardx) => {
                const card = get.autoViewAs({ name: "sha", cards: [cardx] }, [cardx]);
                return player.hasUseTarget(card);
            }, "hs")) {
                const next = player.chooseToUse();
                next.set("forced", true);
                next.set("openskilldialog", `###${get.prompt(event.name)}###将1张手牌当作杀打出。`);
                next.set("norestore", true);
                next.set("_backupevent", `${event.name}_backup`);
                next.set("addCount", false);
                next.set("logSkill", event.name);
                next.set("custom", {
                    add: {},
                    replace: { window() {} },
                });
                next.backup(`${event.name}_backup`);
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
                position: "hs",
                ai1(card) {
                    var player = get.player();
                    var maxVal = 6.5;
                    return maxVal - get.value(card);
                },
                log: false,
            },
        },
    },
    /**盘查
     * 每个回合开始时，你失去体力至1点，你每因此失去1点体力，就获得1张牌。
     * */
    mjsnpcshengjiu: {
        trigger: {
            global: "phaseBegin",
        },
        silent: true,
        popup: true,
        filter(event, player) {
            return player.hp > 1;
        },
        async content(event, trigger, player) {
            const num = player.hp - 1;
            if (num > 0) {
                await player.loseHp(num);
                const loseHp = num;
                await player.draw(loseHp);
            }
        },
    },
    //秦琪
    /**盘查
     * 登场，添加一张阵前对决至你的手牌并且立即打出，你因此打出1张杀时，摸1张牌。
     * */
    mjsnpcbiyanchou: {
        nobracket: true,
        trigger: {
            global: "phaseBefore",
            player: ["enterGame","changeSkillsAfter"],
        },
        silent: true,
        popup: true,
        locked: false,
        filter(event, player) {
            if (event.name == "changeSkills") {
                return event.addSkill.includes("mjsnpcbiyanchou");
            }
            return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
            const card = game.createCard("mjszhenqianduijue", "diamond", 5);
            if (card) {
                await player.gain(card, "gain2");
                if (player.getCards("h").includes(card) && player.hasUseTarget(card)) {
                    const next = player.chooseUseTarget(card, true);
                    next.set(trigger.name, true);
                    await next;
                }
            }
        },
        group: ["mjsnpcbiyanchou_use"],
        subSkill: {
            use: {
                trigger: {
                    player: "respond",
                },
                silent: true,
                popup: true,
                locked: false,
                filter(event, player) {
                    var evt = event.getParent(4);
                    return event.card.name == "sha" && evt.player == player && evt.mjsnpcbiyanchou;
                },
                async content(event, trigger, player) {
                    await player.draw();
                },
            },
        },
    },
    /**盘查
     * 当你受到阵前对决的伤害时，你死亡。
     * */
    mjsnpcwuming: {
        trigger: {
            player: "damageEnd",
        },
        silent: true,
        popup: true,
        forced: true,
        locked: false,
        filter(event, player) {
            return event.card?.name == "juedou" || event.card?.name == "mjszhenqianduijue";
        },
        async content(event, trigger, player) {
            player.die();
        },
    },
    //孔秀
    /**盘查
     * 回合开始时，查看一名其他角色的手牌，若其中缺少某种类型的牌，则对其造成1点伤害。
     * */
    mjsnpcpancha: {
        trigger: {
            player: "phaseBegin",
        },
        silent: true,
        forced: false,
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(`${mjs.prompt(event.skill)}发动，查看一名其他角色的手牌，若其中缺少某种类型的牌，则对其造成1点伤害。`, lib.filter.notMe, true)
                .set("ai", target => {
                    const player = get.player();
                    return get.damageEffect(target, player, player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const list = target.getCards("h").reduce((list2, card) => list2.add(get.type2(card)), []);
            await player.viewHandcards(target1);
            if (list.length < 3) {
                await target.damage();
            }
        },
    },
    /**一击
     * 你受到的伤害始终等于你当前体力值。
     * */
    mjsnpcyiji: {
        trigger: {
            player: "damageBegin4",
        },
        silent: true,
        popup: true,
        async content(event, trigger, player) {
            trigger.num = player.getHp(true);
        },
    },
    //孟坦
    /**诱敌
     * 登场，令所有敌方角色对你打出一张杀，否则对其造成1点伤害；重伤时，韩福登场（韩福一定为玩家的敌方目标）。
     * */
    mjsnpcyoudi: {
        trigger: {
            player: "dying",
        },
        silent: true,
        forced: false,
        async content(event, trigger, player) {
            let target;
            if (game.dead.length) {
                target = [...game.dead].sort((a, b) => get.distance(player, a, "absolute") - get.distance(player, b, "absolute"))[0];
                target.uninit();
                target.init("mjs_npc_hanfu");
                target.revive(1, false);
            } else {
                let begin = player;
                if (player.getSeatNum() !== 0) {
                    begin = game.filterPlayer2().sort((a, b) => a.getSeatNum() - b.getSeatNum())[0];
                }
                target = await game.addPlayerOL(begin, "mjs_npc_hanfu", null);
            }
            if (get.itemtype(target) != "player") {
                return;
            }
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
        },
        group: "mjsnpcyoudi_init",
        subSkill: {
            init: {
                trigger: {
                    global: "phaseBefore",
                    player: ["enterGame","changeSkillsAfter"],
                },
                popup: false,
                forced: true,
                locked: false,
                filter(event, player) {
                    if (event.name == "changeSkills") {
                        return event.addSkill.includes("mjsnpcyoudi");
                    }
                    return event.name != "phase" || game.phaseNumber == 0;
                },
                async content(event, trigger, player) {
                    const targets = game.filterPlayer(target => {
                        return player.getFriends(true).includes(target);
                    });
                    for (const target of targets) {
                        const result = await target
                            .chooseToUse(
                                function (card, player, event) {
                                    if (get.name(card) != "sha") {
                                        return false;
                                    }
                                    return lib.filter.filterCard.apply(this, arguments);
                                },
                                "诱敌：对" + get.translation(player) + "使用一张杀，否则其对你造成1点伤害"
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
                            .set("sourcex", player);
                        if (!result?.bool) {
                            await target.damage();
                        }
                    }
                },
            },
        },
    },
    /**慢马
     * 每轮开始时，获得并装备1张坐骑牌。每个回合开始时，令所有其他角色获得并装备1张坐骑牌。
     * */
    mjsnpcmanma: {
        trigger: {
            global: ["roundStart", "phaseBegin"],
        },
        silent: true,
        popup: true,
        async content(event, trigger, player) {
            if (event.triggername == "roundStart") {
                const card = get.cardPile(card => get.type(card) == "equip");
                if (card) {
                    await player.gain(card, "draw");
                    if (player.getCards("h").includes(card) && get.type(card, player) == "equip") {
                        await player.chooseUseTarget(card, "nopopup", true);
                    }
                }
            } else {
                const targets = game.filterPlayer(target => {
                    return target != player;
                });
                for (const target of targets) {
                    const card = get.cardPile(card => get.type(card) == "equip");
                    if (card) {
                        await target.gain(card);
                        if (target.getCards("h").includes(card) && get.type(card, target) == "equip") {
                            await target.chooseUseTarget(card, "nopopup", true);
                        }
                    }
                }
            }
        },
    },
    //韩福
    /**冷箭
     * 登场，对一名其他角色打出手牌中的所有的杀。
     * */
    mjsnpclengjian: {
        trigger: {
            global: "phaseBefore",
            player: ["enterGame","changeSkillsAfter"],
        },
        silent: true,
        forced: false,
        filter(event, player) {
            if (!game.hasPlayer(target => target != player)) {
                return false;
            }
            if (event.name == "changeSkills") {
                return event.addSkill.includes("mjsnpclengjian");
            }
            return (event.name != "phase" || game.phaseNumber == 0);
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(`${mjs.prompt(event.skill)}发动，对一名其他角色打出手牌中的所有的杀。`, lib.filter.notMe, true)
                .set("ai", target => {
                    const player = get.player();
                    const att = get.attitude(player, target);
                    if (att > 0) {
                        return 0;
                    }
                    return get.effect(target, { name: "sha" }, _status.event.player);
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            while (true) {
                const cards = player.getCards("h", "sha");
                if (!cards.some(card => player.canUse(card, target, false, false))) {
                    break;
                }
                const card = cards[0];
                const next = player.useCard(card, target, false);
                next.animate = false;
                await next;
            }
        },
    },
    /**急走
     * 当你手牌中没有杀时，你失去所有其他技能。
     * */
    mjsnpcjizou: {
        init(player, skill) {
            if (player.countCards("h", "sha")) return;
            const skills = player.getSkills(null, false, false).filter(skill => {
                if (skill === skill) {
                    return false;
                }
                const info = get.info(skill);
                if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
                    return false;
                }
                return true;
            });
            if (skills.length) {
                player.removeSkills(skills);
            }
        },
        trigger: {
            player: "loseAfter",
            global: ["gainAfter","equipAfter","addJudgeAfter","loseAsyncAfter","addToExpansionAfter"],
        },
        silent: true,
        popup: true,
        filter(event, player) {
            if (player.countCards("h", "sha")) {
                return false;
            }
            const evt = event.getl?.(player);
            if (!evt) return false;
            return evt?.hs?.some(card => get.name(card, false) == "sha");
        },
        async content(event, trigger, player) {
            lib.skill[event.name].init(player, event.name);
        },
    },
    //王植
    /**纵火
     * 登场，令一名其他角色的当前手牌在其下个回合结束时被烧毁。
     * */
    mjsnpczonghuo: {
        trigger: {
            global: "phaseBefore",
            player: ["enterGame","changeSkillsAfter"],
        },
        silent: true,
        forced: false,
        filter(event, player) {
            if (!game.hasPlayer(target => lib.skill.mjsnpczonghuo.filterTarget(null, player, target))) {
                return false;
            }
            if (event.name == "changeSkills") {
                return event.addSkill.includes("mjsnpczonghuo");
            }
            return (event.name != "phase" || game.phaseNumber == 0);
        },
        filterTarget(card, player, target) {
            return target != player && target.countCards("h");
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(`${mjs.prompt(event.skill)}发动，令一名其他角色的当前手牌在其下个回合结束时被烧毁。`, true, (card, player, target) => {
                    return lib.skill.mjsnpczonghuo.filterTarget(null, player, target);
                })
                .set("ai", target => {
                    const player = get.player();
                    const att = get.attitude(player, target);
                    if (att > 0) {
                        return 0;
                    }
                    return att * target.countCards("h");
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const cards = target.getCards("h");
            target.addGaintag(cards, event.name);
            target
                .when("phaseEnd")
                .then(async () => {
                    const cards2 = target.getCards("h", card => cards.includes(card));
                    if (cards2.length) {
                        game.log(cards2, "被烧毁了");
                        await target.lose(cards2, "toBurnDown");
                    }
                });
        },
    },
    /**触逆
     * 当你获得先拔头筹和休养生息时，将其转化为火杀。当你的杀对目标造成伤害后，目标对你打出手牌中所有的杀。
     * */
    mjsnpcchuni: {
        trigger: {
            source: "damageSource",
        },
        silent: true,
        popup: true,
        filter(event, player) {
            return event.card?.name == "sha" && event.player?.isIn();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            const target = trigger.player;
            while (true) {
                const cards = target.getCards("h", "sha");
                if (!cards.some(card => target.canUse(card, player, false, false))) {
                    break;
                }
                const card = cards[0];
                const next = target.useCard(card, player, false);
                next.animate = false;
                await next;
            }
        },
        group: "mjsnpcchuni_init",
        subSkill: {
            init: {
                trigger: {
                    player: "gainAfter",
                    global: ["gameDrawAfter","loseAsyncAfter"],
                },
                silent: true,
                popup: false,
                forced: true,
                locked: false,
                filter(event, player) {
                    if (event.name == "gameDraw") {
                        return player.countCards("h", card => ["mjsxianbatouchou", "mjsxiuyangshengxi"].includes(card.name));
                    }
                    return event.getg && event.getg(player)?.some(card => ["mjsxianbatouchou", "mjsxiuyangshengxi"].includes(card.name));
                },
                async content(event, trigger, player) {
                    const cards = (trigger?.getg?.(player) ?? player.getCards("h")).filter(card => ["mjsxianbatouchou", "mjsxiuyangshengxi"].includes(card.name));
                    for (const card of cards) {
                        game.broadcastAll(function (card) {
                            card.init(["heart", 8, "huosha"]);
                        }, card);
                    }
                },
            },
        },
    },
};
Object.assign(skills, skills4);

export default skills;
