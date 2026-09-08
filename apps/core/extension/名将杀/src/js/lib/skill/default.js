import { lib, game, ui, get, ai, _status } from "noname";
/** @type { importCharacterConfig["skill"] } */
export default {
    _mjs_phaseList: {
        trigger: {
            player: "phaseBegin",
        },
        firstDo: true,
        silent: true,
        charlotte: true,
        ruleSkill: true,
        filter(event, player) {
            return player.name?.startsWith("mjs");
        },
        async content(event, trigger, player) {
            trigger.phaseList = ["phaseZhunbei", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
        },
    },
    _mjs_phaseList_phaseZhunbei: {
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        lastDo: true,
        silent: true,
        charlotte: true,
        ruleSkill: true,
        async content(event, trigger, player) {
            trigger.setContent(get.info(event.name).phaseZhunbei);
        },
        phaseZhunbei: [async (event, trigger, player) => {
          game.log(player, "进入了准备阶段");
          event.cards = player.getCards("j");

          // 先进先判
          event.cards = event.cards.reverse();
        }, async (event, trigger, player) => {
          if (!event.cards.length) {
            event.finish();
            return;
          }
          event.card = event.cards.shift();
          const cardName = event.card.name;
          const cardInfo = lib.card[cardName];
          const VJudge = event.card[event.card.cardSymbol];
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
        }, async (event, trigger, player) => {
          if (!event.cancelled && !event.nojudge) {
            event.result = await player.judge(event.card).set("type", "phase").forResult();
          }
        }, async (event, trigger, player) => {
          const name = event.card.name;
          const VJudge = event.card[event.card.cardSymbol];
          if (event.excluded) {
            delete event.excluded;
          } else if (event.cancelled && !event.direct) {
            if (lib.card[name].cancel) {
              const next = game.createEvent(`${name}Cancel`);
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
        }],
    },
    _mjs_maxHandcardBase: {
        charlotte: true,
        ruleSkill: true,
        mod: {
            maxHandcardBase(player, num) {
                if (!player.name?.startsWith("mjs")) return;
                return get.character(player.name)?.maxHandcardBase ?? player.hp;
            },
        },
    },
    _mjs_changeToEquip: {
        trigger: {
            player: "equipBegin",
        },
        forced: true,
        silent: true,
        firstDo: true,
        charlotte: true,
        ruleSkill: true,
        filter(event, player) {
            return player.name?.startsWith("mjs");
        },
        async content(event, trigger, player) {
            trigger.setContent(lib.skill._mjs_changeToEquip.equipContent);
        },
        async equipContent(event, trigger, player) {
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
            }
            player.equiping = true;
            const handleEquip = async card => {
                let cards = [];
                // @ts-expect-error ignore
                if (get.itemtype(card) === "card" && !card.isViewAsCard) {
                    cards = [card];
                    card = card.cardSymbol ? card[card.cardSymbol] : get.autoViewAs(card, void 0, false);
                    event.vcards.push(card);
                } else {
                    if (get.itemtype(card) === "card" && card.isViewAsCard) {
                        event.vcards.push(card[card.cardSymbol]);
                    } else {
                        event.vcards.push(card);
                    }
                    cards = event.cards ?? [];
                }
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
            replaceEquipEvent.setContent(lib.skill._mjs_changeToEquip.replaceEquipContent);
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
            /*
            result?.vcards?.forEach(card => {
                player.removeVirtualEquip(card);
            });
            */
            //然后处理每一张装备牌的装备
            event.vcards = [];
            await handleEquip(event.card);
            //如果event.card是实体牌，改为虚拟牌
            if (get.itemtype(event.card) == "card") {
                event.card = event.card[event.card.cardSymbol];
            }
            if (event.updatePile) {
                game.updateRoundNumber();
            }
        },
        async replaceEquipContent(event, trigger, player) {
            let vcards = [];
            vcards.push(event.card[event.card.cardSymbol] ? event.card[event.card.cardSymbol] : get.autoViewAs(event.card, void 0, false));
            const specializedVCards = [],
                normalVCards = [];
            const replacedCards = [];
            vcards.forEach(card => {
                const info = get.info(card, false);
                if (!info.ignoreEquip) {
                    (info?.customSwap ? specializedVCards : normalVCards).push(card);
                }
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
                    let left = player.mjsGetEquipLimit(),
                        lose = Math.min(left, normalVCards.length);
                    let result;
                    if (lose <= 0) {
                        continue;
                    } else {
                        const cards = player.getVCards("e").filter(card => {
                            return !replacedCards.includes(card) && lib.filter.canBeReplaced(card, player);
                        });
                        if (cards.length > 0) {
                            if (lose >= left) {
                                result = { bool: true, links: cards };
                            } else if (cards.length > left - lose) {
                                var source = event.source,
                                    num = cards.length - (left - lose);
                                if (!source || !source.isIn()) {
                                    source = player;
                                }
                                const chooseEvent = source
                                    .chooseButton(["选择替换掉" + get.cnNumber(num) + "张装备牌", [cards, "vcard"]], true, [1, num]);
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
        ai: {
            effect: {
                target(card, player, target) {
                    if (!target.hasMJSEquip()) return;
                    if (player == target && get.type(card) == "equip") {
                        const cards = target.getVCards("e").filter(card => {
                            return lib.filter.canBeReplaced(card, target);
                        });
                        if (target.mjsGetEquipLimit() >= cards.length + 1) return;
                        if (cards.some(cardx => cardx.name == card.name)) {
                            return 0;
                        }
                        if (cards.every(cardx => get.equipValue(card) <= get.equipValue(cardx))) {
                            return 0;
                        }
                    }
                },
            },
        },
    },
    _mjs_recastToChange: {
        trigger: {
            player: "_recastingBegin",
        },
        silent: true,
        firstDo: true,
        charlotte: true,
        ruleSkill: true,
        filter(event, player) {
            return player.name?.startsWith("mjs");
        },
        async content(event, trigger, player) {
            trigger.setContent(lib.skill[event.name].contentx);
        },
        async contentx(event, trigger, player) {
            //重铸改弃摸
            await player.discard(event.cards);
            await player.draw(event.cards.length, "nodelay");
        },
    },
    _mjs_changeGroup_g_noname: {
        trigger: {
            player: "changeGroupBegin",
        },
        forced: true,
        locked: false,
        ruleSkill: true,
        filter(event, player) {
            return player.group == "g_noname";
        },
        async content(event, trigger, player) {
            trigger.cancel();
        },
    },
    _mjs_checkTarget: {
        trigger: {
            player: ["chooseTargetBegin", "chooseCardTargetBegin", "chooseButtonTargetBegin"],
        },
        silent: true,
        charlotte: true,
        ruleSkill: true,
        filter(event, player) {
            let evt = event.getParent();
            let skill = get.sourceSkillFor(evt);
            if (!skill) {
                return false;
            }
            let info = get.info(skill);
            if (!info || info.ruleSkill) {
                return false;
            }
            return true;
        },
        async content(event, trigger, player) {
            const backup = _status.event;
            _status.event = trigger;
            const original_filfilterTarget = trigger.filterTarget;
            trigger.filterTarget = function(card, player, target) {
                const mod = game.checkMod(player, target, "unchanged", "skillEnabledx", target);
                if (mod === false) {
                    return false;
                }
                return original_filfilterTarget.apply(this, arguments);
            };
            const targets = game.filterPlayer(target => {
                return trigger.filterTarget(trigger.card, trigger.player, target);
            });
            _status.event = backup;
            if (!targets.length) {
                trigger.forced = false;
            }
        },
    },
    mjs_converted: {
        name: "转化",
    },
    mjsallsha: {
        nopop: true,
        charlotte: true,
        change(player, num) {
            player.addSkill("mjsallsha");
            var info = player.storage;
            if (typeof info.mjsallsha != "number") {
                info.mjsallsha = 0;
            }
            info.mjsallsha += num;
            if (info.mjsallsha == 0) {
                player.unmarkSkill("mjsallsha");
            } else {
                player.markSkill("mjsallsha");
            }
            if (num >= 0) {
                game.log(player, "的出杀次数", "#y+" + num);
            } else {
                game.log(player, "的出杀次数", "#g" + num);
            }
        },
        mod: {
            cardUsable(card, player, num) {
                if (card.name != "sha") return;
                var add = player.storage.mjsallsha;
                if (typeof add == "number") {
                    return num + add;
                }
            },
        },
        /*marktext: "杀",
        intro: {
            content(num, player) {
                var str = "<li>出杀次数";
                if (num >= 0) {
                    str += "+";
                }
                str += num;
                str += "<br><li>当前出杀次数：";
                str += player.getCardUsable("sha");
                return str;
            },
        },*/
    },
    mjsallmax: {
        nopop: true,
        charlotte: true,
        change(player, num) {
            player.addSkill("mjsallmax");
            var info = player.storage;
            if (typeof info.mjsallmax != "number") {
                info.mjsallmax = 0;
            }
            info.mjsallmax += num;
            if (num >= 0) {
                game.log(player, "的手牌上限", "#y+" + num);
            } else {
                game.log(player, "的手牌上限", "#g" + num);
            }
        },
        mod: {
            maxHandcard(player, num) {
                var add = player.storage.mjsallmax;
                if (typeof add == "number") {
                    return num + add;
                }
            },
        },
    },
    mjsdraw: {
        nopop: true,
        charlotte: true,
        change(player, num) {
            player.addSkill("mjsdraw");
            var info = player.storage;
            if (typeof info.mjsdraw != "number") {
                info.mjsdraw = 0;
            }
            info.mjsdraw += num;
            if (num >= 0) {
                game.log(player, "每回合的摸牌数", "#y+" + num);
            } else {
                game.log(player, "每回合的摸牌数", "#g" + num);
            }
        },
        trigger: {
            player: "phaseDrawBegin2",
        },
        silent: true,
        filter(event, player) {
            return !event.numFixed;
        },
        async content(event, trigger, player) {
            trigger.num += player.countMark(event.name);
        },
    },
    mjsequip: {
        mod: {
            maxEquipBase(player, num) {
                const info = player.storage?.mjsequip;
                if (typeof info != "number") return;
                return num + info;
            },
        },
        /*mark: true,
        marktext: "装",
        intro: {
            content(num, player) {
                var str = "<li>装备上限";
                if (num >= 0) {
                    str += "+";
                }
                str += num;
                str += "<br><li>当前装备上限：";
                str += player.mjsGetEquipLimit();
                return str;
            },
        },*/
    },
    _mjs_jiu: {
        mod: {
            cardUsable(card, player, num) {
                if (!player.name?.startsWith("mjs")) {
                    return;
                }
                if (card.name == "jiu") return Infinity;
            },
        },
        trigger: {
            player: "useCard",
        },
        silent: true,
        ruleSkill: true,
        filter(event, player) {
            if (!player.name?.startsWith("mjs")) {
                return false;
            }
            if (event.card.name != "jiu" || event.getParent().type == "dying") return false;
            return player.getHistory("useCard", evt => {
                return evt.card.name == "jiu" && evt.getParent().type != "dying";
            }).indexOf(event) != 0;
        },
        async content(event, trigger, player) {
            const cards = player.getCards("he", card => {
                return lib.filter.cardDiscardable(card, player, "_mjs_card_jiu");
            });
            if (cards.length > 0) {
                await player.discard(cards.randomGets(1));
            }
        },
    },
    _mjs_yi: {
        trigger: {
            player: "useCardBefore",
        },
        silent: true,
        forced: false,
        firstDo: true,
        ruleSkill: true,
        charlotte: true,
        filter(event, player) {
            if (event._mjs_yi || event.card.name != "yi") {
                return false;
            }
            return event.cards?.length == 1 && event.cards[0].name == "yi";
        },
        async cost(event, trigger, player) {
            const list = get.inpileVCardList(info => {
                const name = info[2],
                    type = get.type2(name),
                    infox = get.info({ name: name });
                if (type != "basic" && type != "trick") {
                    return false;
                }
                if (info[3]) {
                    return false;
                }
                if (type == "trick" && !trigger.card?.storage?.mjsstrengthen) {
                    return false;
                }
                const card = get.autoViewAs({ name: name }, trigger.cards);
                return player.hasUseTarget(card);
            });
            if (!list.length) {
                return;
            }
            event.result = await player
                .chooseButton(["易", [list, "vcard"]], true)
                .set("ai", button => {
                    return get.player().getUseValue(button.link);
                })
                .forResult();
            if (event?.result?.links?.length) {
                event.result.cost_data = event.result.links[0][2];
            }
        },
        async content(event, trigger, player) {
            const card = get.autoViewAs({ name: event.cost_data }, trigger.cards);
            trigger.card = card;
            trigger.set("_mjs_yi", true);
            const targets = game.filterPlayer(target => {
                return lib.filter.targetEnabled(card, trigger.player, target) && lib.filter.targetInRange(card, trigger.player, target);
            });
            if (!targets.length) {
                trigger.targets.length = 0;
                trigger.all_excluded = true;
                return;
            } else if (!get.info(card).notarget) {
                const range = lib.filter.selectTarget(card, trigger.player);
                if (range[1] <= -1) {
                    event.result = { bool: true, targets };
                } else {
                    event.result = await player
                        .chooseTarget(`请选择${get.translation(card)}的目标`, true)
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
        },
        mod: {
            selectTarget(card, player, range) {
                if (card.name != "yi") {
                    return;
                }
                if (range[0] !== -1) range[0] = -1;
                if (range[1] !== -1) range[1] = -1;
            },
            cardEnabled2(card, player) {
                if (get.itemtype(card) != "card" || card.name != "yi" || _status._mjs_yi) {
                    return;
                }
                const event = get.event();
                if (!event || ["chooseToUse", "chooseToRespond"].includes(event.name)) {
                    return;
                }
                _status._mjs_yi = true;
                const list = get.inpileVCardList(info => {
                    const name = info[2],
                        type = get.type2(name),
                        infox = get.info({ name: name });
                    if (type != "basic" && type != "trick") {
                        return false;
                    }
                    if (name == "yi" || info[3]) {
                        return false;
                    }
                    if (type == "trick" && !card?.storage?.mjsstrengthen) {
                        return false;
                    }
                    const cardx = get.autoViewAs({ name: name }, [card]);
                    return game.hasPlayer(target => player.canUse(cardx, target));
                });
                delete _status._mjs_yi;
                if (list.length) return true;
            },
            cardEnabled(card, player) {
                return lib.skill._mjs_yi.mod.cardEnabled2.apply(this, arguments);
            },
            playerEnabled(card, player, target) {
                return lib.skill._mjs_yi.mod.cardEnabled2.apply(this, arguments);
            },
        },
    },
    _mjs_mjsyibing: {
        trigger: {
            player: "useCardBefore",
        },
        silent: true,
        forced: false,
        firstDo: true,
        ruleSkill: true,
        charlotte: true,
        filter(event, player) {
            if (event._mjs_mjsyibing || event.card.name != "mjsyibing") {
                return false;
            }
            return event.cards?.length == 1 && event.cards[0].name == "mjsyibing";
        },
        async cost(event, trigger, player) {
            const list = get.inpileVCardList(info => {
                const name = info[2],
                    type = get.type2(name),
                    infox = get.info({ name: name });
                if (!["sha", "shan"].includes(name)) {
                    return false;
                }
                if (info[3]) {
                    return false;
                }
                const card = get.autoViewAs({ name: name }, trigger.cards);
                return player.hasUseTarget(card);
            });
            if (!list.length) {
                return;
            }
            event.result = await player
                .chooseButton(["义兵", [list, "vcard"]], true)
                .set("ai", button => {
                    return get.player().getUseValue(button.link);
                })
                .forResult();
            if (event?.result?.links?.length) {
                event.result.cost_data = event.result.links[0][2];
            }
        },
        async content(event, trigger, player) {
            const card = get.autoViewAs({ name: event.cost_data }, trigger.cards);
            trigger.card = card;
            trigger.set("_mjs_mjsyibing", true);
            const targets = game.filterPlayer(target => {
                return lib.filter.targetEnabled(card, trigger.player, target) && lib.filter.targetInRange(card, trigger.player, target);
            });
            if (!targets.length) {
                trigger.targets.length = 0;
                trigger.all_excluded = true;
                return;
            } else if (!get.info(card).notarget) {
                const range = lib.filter.selectTarget(card, trigger.player);
                if (range[1] <= -1) {
                    event.result = { bool: true, targets };
                } else {
                    event.result = await player
                        .chooseTarget(`请选择${get.translation(card)}的目标`, true)
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
        },
        mod: {
            selectTarget(card, player, range) {
                if (card.name != "mjsyibing") {
                    return;
                }
                if (range[0] !== -1) range[0] = -1;
                if (range[1] !== -1) range[1] = -1;
            },
            cardEnabled2(card, player) {
                if (get.itemtype(card) != "card" || card.name != "yi" || _status._mjs_mjsyibing) {
                    return;
                }
                const event = get.event();
                if (!event || ["chooseToUse", "chooseToRespond"].includes(event.name)) {
                    return;
                }
                _status._mjs_mjsyibing = true;
                const list = get.inpileVCardList(info => {
                    const name = info[2],
                        type = get.type2(name),
                        infox = get.info({ name: name });
                    if (!["sha", "shan"].includes(name)) {
                        return false;
                    }
                    if (name == "mjsyibing" || info[3]) {
                        return false;
                    }
                    const cardx = get.autoViewAs({ name: name }, [card]);
                    return game.hasPlayer(target => player.canUse(cardx, target));
                });
                delete _status._mjs_mjsyibing;
                if (list.length) return true;
            },
            cardEnabled(card, player) {
                return lib.skill._mjs_mjsyibing.mod.cardEnabled2.apply(this, arguments);
            },
            playerEnabled(card, player, target) {
                return lib.skill._mjs_mjsyibing.mod.cardEnabled2.apply(this, arguments);
            },
        },
    },
};

