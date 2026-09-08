import { lib, game, ui, get, ai, _status } from "noname";
/** @type { importCharacterConfig["skill"] } */
export default {
    _mjsweaken: {
        mod: {
            cardEnabled(card, player) {
                if (!get.is.mjsWeakenedCard(card)) {
                    return;
                }
                if (["mjsshipo", "wuxie"].includes(card.name)) {
                    let evt = get.event();
                    if (evt.name != "chooseToUse") {
                        evt = evt.getParent("chooseToUse");
                    }
                    const info = evt.info_map,
                        target = info?.target;
                    if (!target || target != player) {
                        return false;
                    }
                }
            },
            cardSavable(card, player, target) {
                if (!get.is.mjsWeakenedCard(card)) {
                    return;
                }
                if (["nu", "jiu"].includes(card.name)) {
                    return false;
                }
                if (card.name == "tao" && target != player) {
                    return false;
                }
            },
            cardRecastable(card, player) {
                if (!get.is.mjsWeakenedCard(card)) {
                    return;
                }
                if (["mjslianhuan", "tiesuo"].includes(card.name)) {
                    return false;
                }
            },
            playerEnabled(card, player, target) {
                if (!get.is.mjsWeakenedCard(card)) {
                    return;
                }
                if (["mjsxiuyangshengxi", "taoyuan"].includes(card.name) && !target.isMinHp()) {
                    return false;
                }
            },
        },
        trigger: {
            player: "useCard",
        },
        silent: true,
        ruleSkill: true,
        priority: 14,
        charlotte: true,
        filter(event, player, name) {
            if (!get.is.mjsWeakenedCard(event.card, player)) {
                return false;
            }
            if (!get.info("_mjsweaken").filterx(event, player)) {
                return false;
            }
            return get.info("_mjsweaken").getList.includes(event.card.name);
        },
        filterx(event, player) {
            if (get.is.convertedCard(event.card) || get.is.virtualCard(event.card)) {
                return false;
            }
            return event.cards?.length == 1 && get.is.mjsWeakenedCard(event.card);
        },
        async content(event, trigger, player) {
            const backups = get.copy(get.info(event.name).getBuff.get(trigger.card.name));
            const next = game.createEvent(`${event.name}_${trigger.card.name}`, false);
            next.player = player;
            next._trigger = trigger;
            next.setContent(backups.content);
            await next;
        },
        get getList() {
            return Array.from(lib.skill._mjsweaken.getBuff).map(info => info[0]);
        },
        getBuff: new Map([
            ["sha", {
                description: "出牌阶段限1次，对攻击范围内的一名其他角色打出，弃置1张牌，然后对其造成1点伤害。",
                description2: "出牌阶段限1次，对攻击范围内的一名其他角色打出，随机弃置你的1张牌，然后对其造成1点雷电伤害。",
                description3: "出牌阶段限1次，对攻击范围内的一名其他角色打出，随机烧毁你的1张牌，然后对其造成1点火焰伤害。",
                async content(event, trigger, player) {
                    if (!game.hasNature(trigger.card)) {
                        player
                            .when("useCard")
                            .filter(evt => evt.card == trigger.card)
                            .then(async (event, trigger, player) => {
                                await player.chooseToDiscard("he", true);
                            });
                    } else if (game.hasNature(trigger.card, "fire")) {
                        player
                            .when("useCard")
                            .filter(evt => evt.card == trigger.card)
                            .then(async (event, trigger, player) => {
                                const cards = player.getCards("he", card => {
                                    return lib.filter.cardDiscardable(card, player, event.name);
                                });
                                if (cards.length > 0) {
                                    await player.discard(cards.randomGets(1));
                                }
                            });
                    } else if (game.hasNature(trigger.card, "thunder")) {
                        player
                            .when("useCard")
                            .filter(evt => evt.card == trigger.card)
                            .then(async (event, trigger, player) => {
                                const cards = player
                                    .getCards("he", card => {
                                        return lib.filter.cardCombustible(card, player, event.name);
                                    })
                                    .randomGets(1);
                                if (cards.length) {
                                    await player.lose(cards, "toBurnDown");
                                    game.log(cards, "被烧毁了");
                                }
                            });
                    }
                },
            }],
            ["shan", {
                description: "成为杀的目标时打出，抵消此杀对你的1点伤害",
                async content(event, trigger, player) {
                    player
                        .when({ global: "useCardToBegin" })
                        .filter(evt => evt.card == trigger.card)
                        .then(async (event, trigger, player) => {
                            trigger.setContent(async (event2, trigger2, player2) => {
                                const evt3 = event2.getParent(3);
                                if (typeof evt3.extraDamage != "number") {
                                    evt3.extraDamage = 0;
                                }
                                evt3.extraDamage--;
                                game.log(player, "抵消了", evt3, "的", "#y1", "点伤害");
                                event2.getParent().delayx = false;
                                game.delay(0.5);
                            });
                        });
                },
            }],
            ["tao", {
                description: "令自己回复1点体力。",
                async content(event, trigger, player) { },
            }],
            ["jiu", {
                description: "对自己打出，当前回合对目标角色打出的下1张杀的伤害+1；当前回合再次打出此牌时，随其弃置1张牌。",
                async content(event, trigger, player) {},
            }],
            ["nu", {
                description: "对自己打出，当前回合对目标角色打出的下1张杀的伤害+1；当前回合再次打出此牌时，随其弃置1张牌。",
                async content(event, trigger, player) { },
            }],
            ["wuzhong", {
                description: "摸1张牌",
                async content(event, trigger, player) {
                    player
                        .when("drawBefore")
                        .filter(event => event.getParent().name == "wuzhong" && event.getParent(2) == trigger)
                        .then(async (event, trigger, player) => {
                            trigger.num--;
                        });
                },
            }],
            ["mjsduoduoyishan", {
                description: "摸1张牌",
                async content(event, trigger, player) {
                    return;
                    player
                        .when("drawBefore")
                        .filter(event => event.getParent().name == "mjsduoduoyishan" && event.getParent(2) == trigger)
                        .then(async (event, trigger, player) => {
                            trigger.num--;
                        });
                },
            }],
            ["wanjian", {
                description: "对所有角色打出，令其依次打出1张闪，否则对其造成1点伤害，然后结束此牌效果。",
                async content(event, trigger, player) {
                    player.addTempSkill("mjsweaken_excluded");
                },
            }],
            ["mjsjianyuqishe", {
                description: "对所有角色打出，令其依次打出1张闪，否则对其造成1点伤害，然后结束此牌效果。",
                async content(event, trigger, player) {
                    player.addTempSkill("mjsweaken_excluded");
                },
            }],
            ["nanman", {
                description: "对所有角色打出，令其依次打出1张杀，否则对其造成1点伤害，然后结束此牌效果。",
                async content(event, trigger, player) {
                    player.addTempSkill("mjsweaken_excluded");
                },
            }],
            ["mjsfenghuolangyan", {
                description: "对所有角色打出，令其依次打出1张杀，否则对其造成1点伤害，然后结束此牌效果。",
                async content(event, trigger, player) {
                    player.addTempSkill("mjsweaken_excluded");
                },
            }],
            ["tiesuo", {
                description: "令1-2名其他角色进入或解除连环状态。",
                async content(event, trigger, player) { },
            }],
            ["mjslianhuan", {
                description: "令1-2名其他角色进入或解除连环状态。",
                async content(event, trigger, player) { },
            }],
            ["taoyuan", {
                description: "对所有角色打出，令体力最低的角色依次回复1点体力。",
                async content(event, trigger, player) { },
            }],
            ["mjsxiuyangshengxi", {
                description: "对所有角色打出，令体力最低的角色依次回复1点体力。",
                async content(event, trigger, player) { },
            }],
            ["juedou", {
                description: "令你和一名其他角色依次打出1张杀，无法打出的角色受到对方造成的1点伤害。",
                async content(event, trigger, player) {
                    player
                        .when({ global: "useCardToBegin" })
                        .filter(evt => evt.card == trigger.card)
                        .then(() => {
                            trigger.setContent(lib.skill.mjsweaken_mjszhenqianduijue.contentx);
                        });
                },
            }],
            ["mjszhenqianduijue", {
                description: "令你和一名其他角色依次打出1张杀，无法打出的角色受到对方造成的1点伤害。",
                async content(event, trigger, player) {
                    player
                        .when({ global: "useCardToBegin" })
                        .filter(evt => evt.card == trigger.card)
                        .then(() => {
                            trigger.setContent(lib.skill.mjsweaken_mjszhenqianduijue.contentx);
                        });
                },
            }],
            ["mjsliehuofencheng", {
                description: "对一名有牌的其他角色打出，你弃置1张手牌或装备，令其弃置1张相同花色的牌，否则随机烧毁其1张牌，然后对其造成1点火焰伤害。",
                async content(event, trigger, player) { },
            }],
            ["shunshou", {
                description: "随机获得距离1以内的一名其他角色的任意区域的1张牌。",
                async content(event, trigger, player) {
                    player
                        .when({ global: "useCardToBegin" })
                        .filter(evt => evt.card == trigger.card)
                        .then(async (event, trigger, player) => {
                            trigger.setContent(async (event2, trigger2, player2) => {
                                const cards = event2.target.getGainableCards(player2, "hej");
                                if (cards.length) {
                                    await player2.gain(cards.randomGets(1), event2.target, "giveAuto", "bySelf");
                                }
                            });
                        });
                },
            }],
            ["mjsduoliangjieying", {
                description: "随机获得距离1以内的一名其他角色的任意区域的1张牌。",
                async content(event, trigger, player) {
                    player
                        .when({ global: "useCardToBegin" })
                        .filter(evt => evt.card == trigger.card)
                        .then(async (event, trigger, player) => {
                            trigger.setContent(async (event2, trigger2, player2) => {
                                const cards = event2.target.getGainableCards(player2, "hej");
                                if (cards.length) {
                                    await player2.gain(cards.randomGets(1), event2.target, "giveAuto", "bySelf");
                                }
                            });
                        });
                },
            }],
            ["guohe", {
                description: "随机弃置一名其他角色的任意区域的1张牌。",
                async content(event, trigger, player) {
                    player
                        .when({ global: "useCardToBegin" })
                        .filter(evt => evt.card == trigger.card)
                        .then(async (event, trigger, player) => {
                            trigger.setContent(async (event2, trigger2, player2) => {
                                const cards = event2.target.getDiscardableCards(player2, "hej");
                                if (cards.length) {
                                    await event2.target.discard(cards.randomGets(1)).set("discarder", player);
                                }
                            });
                        });
                },
            }],
            ["mjspozhenxiejia", {
                description: "随机弃置一名其他角色的任意区域的1张牌。",
                async content(event, trigger, player) {
                    player
                        .when({ global: "useCardToBegin" })
                        .filter(evt => evt.card == trigger.card)
                        .then(async (event, trigger, player) => {
                            trigger.setContent(async (event2, trigger2, player2) => {
                                const cards = event2.target.getDiscardableCards(player2, "hej");
                                if (cards.length) {
                                    await event2.target.discard(cards.randomGets(1)).set("discarder", player);
                                }
                            });
                        });
                },
            }],
            ["mjsxianbatouchou", {
                description: "翻开存活角色数量的牌，所有角色随机获得1张牌。",
                async content(event, trigger, player) { },
            }],
            ["wuxie", {
                description: "抵消1张即将对你生效的战法牌。",
                async content(event, trigger, player) { },
            }],
            ["mjsshipo", {
                description: "抵消1张即将对你生效的战法牌。",
                async content(event, trigger, player) { },
            }],
            ["mjsdiaobingqianjiang", {
                description: "令一名有牌的其他角色可以对你选择的其攻击范围内的一名角色打出1张杀。",
                async content(event, trigger, player) { },
            }],
        ]),
    },
    mjsweaken_mjszhenqianduijue: {
        async contentx(event, trigger, player) {
            const target = event.target;
            if (event.turn === undefined) {
                event.turn = player;
            }
            event.source = target;
            if (typeof event.baseDamage !== "number") {
                event.baseDamage = 1;
            }
            if (typeof event.extraDamage !== "number") {
                event.extraDamage = 0;
            }
            if (!event.shaReq) {
                event.shaReq = {};
            }
            if (typeof event.shaReq[player.playerid] !== "number") {
                event.shaReq[player.playerid] = 1;
            }
            if (typeof event.shaReq[target.playerid] !== "number") {
                event.shaReq[target.playerid] = 1;
            }
            event.playerCards = [];
            event.targetCards = [];
            while (true) {
                await event.trigger("juedou");
                event.shaRequired = event.shaReq[event.turn.playerid];
                let damaged = false;
                while (event.shaRequired > 0) {
                    let result = { bool: false };
                    if (!event.directHit) {
                        const next = event.turn.chooseToRespond();
                        next.set("filterCard", function (card, player) {
                            if (get.name(card) !== "sha") {
                                return false;
                            }
                            return lib.filter.cardRespondable(card, player);
                        });
                        if (event.shaRequired > 1) {
                            next.set("prompt2", "共需打出" + event.shaRequired + "张杀");
                        }
                        next.set("ai", function (card) {
                            if (get.event().toRespond) {
                                return get.order(card);
                            }
                            return -1;
                        });
                        next.set("shaRequired", event.shaRequired);
                        next.set(
                            "toRespond",
                            (() => {
                                const responder = event.turn;
                                const opposite = event.source;
                                if (responder.hasSkillTag("noSha", null, "respond")) {
                                    return false;
                                }
                                if (responder.hasSkillTag("useSha", null, "respond")) {
                                    return true;
                                }
                                if (event.baseDamage + event.extraDamage <= 0 || player.hasSkillTag("notricksource", null, event) || responder.hasSkillTag("notrick", null, event)) {
                                    return false;
                                }
                                if (event.baseDamage + event.extraDamage >= responder.hp + (opposite.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
                                    return true;
                                }
                                const damage = get.damageEffect(responder, opposite, responder);
                                if (damage >= 0) {
                                    return false;
                                }
                                if (
                                    event.shaRequired > 1 &&
                                    !target.hasSkillTag("freeSha", null, {
                                        player: player,
                                        card: event.card,
                                        type: "respond",
                                    }) &&
                                    event.shaRequired > responder.mayHaveSha(responder, "respond", null, "count")
                                ) {
                                    return false;
                                }
                                if (get.attitude(responder, opposite._trueMe || opposite) > 0 && damage >= get.damageEffect(opposite, responder, responder)) {
                                    return false;
                                }
                                // if (responder.hasSkill("naman")) {
                                //     return true;
                                // }
                                return true;
                            })()
                        );
                        next.set("respondTo", [player, event.card]);
                        next.autochoose = lib.filter.autoRespondSha;
                        if (event.turn === target) {
                            next.source = player;
                        } else {
                            next.source = target;
                        }
                        result = await next.forResult();
                    }
                    if (result?.bool) {
                        event.shaRequired--;
                        if (result.cards?.length) {
                            if (event.turn === target) {
                                event.targetCards.addArray(result.cards);
                            } else {
                                event.playerCards.addArray(result.cards);
                            }
                        }
                    } else {
                        await event.turn.damage(event.source);
                        damaged = true;
                        break;
                    }
                }
                if (damaged) {
                    break;
                }
                [event.source, event.turn] = [event.turn, event.source];
            }
        },
    },
    mjsweaken_excluded: {
        trigger: {
            global: "useCardToAfter",
        },
        silent: true,
        charlotte: true,
        ruleSkill: true,
        filter(event, player) {
            if (!get.is.mjsWeakenedCard(event.card)) {
                return false;
            }
            if (!["wanjian", "nanman", "mjsjianyuqishe", "mjsfenghuolangyan"].includes(event.card.name)) {
                return false;
            }
            if (["useCard", "respond"].some(evtx => {
                return event.target.hasHistory(evtx, evt => {
                    return evt.respondTo && evt.respondTo[1] == event.card;
                });
            })) {
                return false;
            }
            var evt = event.getParent();
            var targets = evt.targets.slice(evt.num + 1);
            return targets.length > 0;
        },
        async content(event, trigger, player) {
            var evt = trigger.getParent();
            evt.excluded.addArray(evt.targets);
        },
    },
};

