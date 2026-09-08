import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
    //终军
    /**请缨 
     * 出牌阶段开始时，你可以令一名其他角色交给你至少1张牌，然后直到回合结束，当你造成伤害时，你与其各摸1张牌。
     * */
    mjsnewqingying: {
        audio: "mjsqingying",
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
                player.addTempSkill("mjsnewqingying_effect");
                player.markAuto("mjsnewqingying_effect", [target]);
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
                    const targets = [player, ...player.getStorage(event.name)];
                    await game.asyncDraw(targets);
                },
            },
        },
    },
    //卫玠
    /**风神秀异
     * 当你即将受到伤害时，若你的手牌上限＞体力值，则改为减少等量的手牌上限。当你打出行动牌或战法牌时，若所有其他角色手牌中都不存在与此牌相同牌名的牌，则你的手牌上限+1，并可以选择一名有手牌的角色，获得1张与其手牌中相同牌名的牌。
     * */
    mjsnewfengshenxiuyi: {
        nobracket: true,
        audio: "mjsfengshenxiuyi",
        trigger: {
            player: ["damageBegin4", "useCard", "respond"],
        },
        silent: true,
        popup: true,
        filter(event, player) {
            if (event.name == "damage") {
                return player.getHandcardLimit() > player.getHp(true);
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
    },
    //王元姬
    /**烛奸抑势
     * 限定，若你的行动牌全场最多，你可以将一名其他角色的1个技能中的“出牌阶段限1次”改为“限定”。
     * */
    mjsnewzhujianyishi: {
        nobracket: true,
        audio: "mjszhujianyishi",
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
        awakenSkill(skill, nounmark, player) {
            if (!nounmark) {
                player.unmarkSkill(skill);
            }
            player.disableSkill(skill + "_awake", skill);
            player.awakenedSkills.add(skill);
            _status.event.clearStepCache();
            return player;
        },
        enable: "phaseUse",
        limited: true,
        filter(event, player) {
            if (!game.hasPlayer(target => lib.skill.mjsnewzhujianyishi.filterTarget(null, player, target))) {
                return false;
            }
            const numberOfHandCards = player.countCards("h", card => get.type(card) == "basic");
            return game.filterPlayer().every((value) => {
              if (value.isOut() || value == player) {
                return true;
              }
              return value.countCards("h", card => get.type(card) == "basic") <= numberOfHandCards;
            });
        },
        filterTarget(card, player, target) {
            if (target == player) {
                return false;
            }
            return get.info("mjsnewzhujianyishi").getSkills(target).length;
        },
        async content(event, trigger, player) {
            const target = event.target;
            player.awakenSkill(event.name);
            const skills = get.info("mjsnewzhujianyishi").getSkills(target);
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
                        [[get.translation(event.name)], "addNewRow"],
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
                .set("skillMap", skillMap)
                .forResult();
            if (result?.links?.length) {
                target.addSkill("mjsnewzhujianyishi_awaken");
                target.markAuto("mjsnewzhujianyishi_awaken", result.links);
                for (const skill of result.links) {
                    const info = get.info(skill);
                    if (info.mjsnewzhujianyishi) {
                        continue;
                    }
                    game.broadcastAll(skill => {
                        const info = get.info(skill);
                        if (lib.dynamicTranslate[skill]) {
                            info.mjsnewzhujianyishi = lib.dynamicTranslate[skill];
                        } else {
                            info.mjsnewzhujianyishi = lib.translate[skill + "_info"];
                        }
                        lib.dynamicTranslate[skill] = function(player, skill) {
                            if (player.getStorage("mjsnewzhujianyishi_awaken").includes(skill)) {
                                return info.mjsnewzhujianyishi.replace(/出牌阶段限[一1]次/g, "限定");
                            }
                            return info.mjsnewzhujianyishi;
                        };
                    }, skill);
                }
            }
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
            awaken: {
                trigger: {
                    player: ["useSkill", "logSkillBegin"],
                },
                silent: true,
                popup: true,
                charlotte: true,
                filter(event, player) {
                    if (["global", "equip"].includes(event.type)) {
                        return false;
                    }
                    let skill = get.sourceSkillFor(event);
                    if (!skill || skill === "mjsnewzhujianyishi_awaken") {
                        return false;
                    }
                    let info = get.info(skill);
                    if (!info || info.charlotte || info.equipSkill) {
                        return false;
                    }
                    return player.getStorage("mjsnewzhujianyishi_awaken").includes(skill);
                },
                async content(event, trigger, player) {
                    let skill = get.sourceSkillFor(trigger);
                    lib.skill.mjsnewzhujianyishi.awakenSkill(skill, true, player);
                },
            },
        },
    },
    //徐盛
    /**百里疑城
     * 当你成为其他角色打出牌的目标时，你可以立即打出1张装备牌，或者将一名角色装备区的1张牌收回其手牌，然后随机添加1张装备牌到你的手牌。 
     * 当你成为其他角色打出牌的目标时，你可以将一名角色装备区的1张牌收回其手牌，然后随机添加1张装备牌到你的手牌，或者立即打出1张装备牌。 
     * */
    mjsnewbailiyicheng: {
        nobracket: true,
        audio: "mjsbailiyicheng",
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
    },
    //陈宫
    /**弃官投义
     * 当你在非摸牌阶段获得牌时，可以将其中1张牌交给一名其他角色，令其可以对你选择的另外一名其他角色打出此牌，然后你下个摸牌阶段摸牌数+1，若其没有打出，你受到1点伤害。
     * */
    mjsnewqiguantouyi: {
        nobracket: true,
        audio: "mjsqiguantouyi",
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
                        const trigger = _status.event.getTrigger();
                        return (trigger?.getg?.(player) ?? player.getCards("h")).includes(card);
                    },
                    filterTarget(card, player, target) {
                        if (target == player) {
                            return false;
                        }
                        const att = get.attitude(player, target);
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
        },
    },
    //庞统
    /**入蜀三策
     * 每轮限1次，其他角色的回合开始时，你可以随机添加3张战法牌至其手牌，令其立即打出其中1张，然后可以将另外2张牌交给你，否则销毁这些牌。
     * */
    mjsnewrushusance: {
        nobracket: true,
        audio: "mjsrushusance",
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
            const result = await trigger.player
                .chooseToUse(`${get.translation(player)}发动了【${get.translation(event.name)}】`, "你可以立即打出1张牌", function (card) {
                    if (!lib.filter.cardEnabled(card, _status.event.player, _status.event)) {
                        return false;
                    }
                    return get.event().cards.includes(card);
                })
                .set("cards", cards)
                .forResult();
            if (result?.bool && result.card) {
                cards.removeArray(result.card.cards);
                await trigger.player.give(cards, player, "giveAuto");
            } else {
                game.log(cards, "被销毁了");
                await trigger.player.lose(cards, "toDestroy", ui.special);
            }
        },
    },
    //公孙瓒
    /**白马义从
     * 登场，复制牌堆中所有的坐骑牌，并洗入牌堆；你的坐骑牌的效果会触发2次。
     * */
    mjsnewbaimayicong: {
        nobracket: true,
        audio: "mjsbaimayicong",
        init() {
            lib.skill.mjsbaimayicong.init();
        },
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
            const cardList = Array.from(ui.cardPile.childNodes).flat()
                .filter(card => {
                    const type = get.subtype(card);
                    return type == "equip3" || type == "equip4" || type == "equip6";
                });
            if (!cardList.length) return;
            const cards = [];
            for (const card of cardList) {
                cards.push(game.createCard2(card));
            }
            if (cards.length) {
                game.cardsGotoPile(cards, () => {
                    return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
                });
            }
        },
        ai: {
            horseEffectCount: true,
        },
    },
    //凌统
    /**纵马提刀
     * 出杀，获得并装备1张装备牌，并且出杀次数+1。
     * */
    mjsnewzongmatidao: {
        nobracket: true,
        audio: "mjszongmatidao",
        trigger: {
            player: "useCard",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return event.card.name == "sha";
        },
        async content(event, trigger, player) {
            const card = get.cardPile(card => get.type(card) == "equip");
            if (card) {
                await player.gain(card);
                if (player.getCards("h").includes(card) && get.type(card, player) == "equip") {
                    await player.chooseUseTarget(card, "nopopup", true);
                }
            }
            player.addTempSkill("mjsnewzongmatidao_effect");
            player.addMark("mjsnewzongmatidao_effect", 1, false);
        },
        subSkill: {
            effect: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == "sha") {
                            return num + player.countMark("mjsnewzongmatidao_effect");
                        }
                    },
                },
            },
        },
    },
    //项燕
    /**楚虽三户
     * 阵亡，你可以将所有牌交给一名其他角色，令其获得技能“破秦锋锐”，并且之后每回合的摸牌数+2。
     * */
    mjsnewchusuisaihu: {
        nobracket: true,
        audio: "mjschusuisaihu",
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
                    return att;
                })
                .forResult();
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            player.logSkill(event.name, target);
            const cards = player.getCards("h");
            if (cards.length) {
                await player.give(cards, target);
            }
            const createSkills = mjs.addCreateSkills("mjsnewpoqinfengrui");
            await target.addSkills(createSkills);
            target.addTempSkill(event.name + "_effect");
            target.addMark(event.name + "_effect", 2, false);
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
                    trigger.num += player.countMark(event.name);
                },
            },
        },
    },
    //卢莫愁
    /**阳春白雪
     * 当你以其他角色为目标打出牌后，若此牌没有被其他角色抵消或响应，则你可以将此牌交给一名其他角色，此牌再次被打出时无法被抵消和响应。
     * */
    mjsnewyangchunbaixue: {
        nobracket: true,
        audio: "mjsyangchunbaixue",
        global: "mjsnewyangchunbaixue_global",
        trigger: {
            player: "useCardAfter",
        },
        popup: false,
        filter(event, player) {
            if (!event.cards.filterInD().length) {
                return false;
            }
            if (!event.targets?.length) {
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
            const cards = trigger.cards.filterInD();
            if (cards.length) {
                const gainEvent = target.gain(cards, "gain2");
                gainEvent.giver = player;
                await gainEvent;
                target.addGaintag(cards, "eternal_mjsnewyangchunbaixue_tag");
            }
        },
        subSkill: {
            tag: {
                name: "雪",
            },
            global: {
                trigger: {
                    player: "useCard",
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    if (!game.hasPlayer(target => {
                        return target.hasSkill("mjsnewyangchunbaixue");
                    })) {
                        return false;
                    }
                    return player.hasHistory("lose", evt => evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.includes("eternal_mjsnewyangchunbaixue_tag")));
                },
                async content(event, trigger, player) {
                    player.removeGaintag("eternal_mjsnewyangchunbaixue_tag", trigger.cards);
                    trigger.directHit.addArray(game.filterPlayer());
                    game.log(trigger.card, "不可被响应");
                },
            },
        },
    },
    /**清音忘忧
     * 当你交给其他角色手牌后，随机弃置其卜卦区中的1张牌，若其卜卦区中没有牌，每个回合限2次，你可以选择并添加任意1张牌到其手牌。
     * */
    mjsnewqingyinwangyou: {
        nobracket: true,
        audio: "mjsqingyinwangyou",
        trigger: {
            global: ["gainAfter","loseAsyncAfter"],
        },
        forced: true,
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
            if (!target.countDiscardableCards(player, 'j') && player.hasSkill("mjsnewqingyinwangyou_used")) {
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
                await target.discard(cards.randomGets(1));
            }
            if (player.countMark(event.name + "_used") > 1) {
                return;
            }
            const basic = get.inpileVCardList(info => info[0] == "basic");
            const trick = get.inpileVCardList(info => info[0] == "trick");
            const equip = get.inpileVCardList(info => info[0] == "equip");
            const result = await player
                .chooseButton(
                    [
                        [[get.translation(event.name)], "addNewRow"],
                        `<div><div style="width:100%;text-align:center">行动牌</div></div>`,
                        [basic, "vcard"],
                        `<div><div style="width:100%;text-align:center">战法牌</div></div>`,
                        [trick, "vcard"],
                        `<div><div style="width:100%;text-align:center">装备牌</div></div>`,
                        [equip, "vcard"],
                        [
                            dialog => {
                                dialog.css({
                                    top: "20%",
                                });
                            },
                            "handle",
                        ],
                    ],
                )
                .set("ai", button => {
                    const player = get.player();
                    const target = get.event().getParent().targets[0];
                    const att = get.attitude(player, target);
                    if (att <= 0) {
                        return 0;
                    }
                    return target.getUseValue(button.link);
                })
                .forResult();
            if (result.bool && result.links?.length) {
                player.addTempSkill(event.name + "_used");
                player.addMark(event.name + "_used", 1, false);
                const card = game.createCard2(result.links[0][2], lib.suit.randomGet(), get.rand(1, 8));
                if (card) {
                    await target.gain(card, "draw");
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
    //韩信
    /**背水一战
     * 你可以将所有手牌当作杀打出，此杀的伤害+1，且造成伤害后，你收回这些手牌。
     * */
    mjsnewbeishuiyizhan: {
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
            player.logSkill("mjsnewbeishuiyizhan");
            if (event.getParent().name != "chooseToUse") return;
            player.addTempSkill("mjsnewbeishuiyizhan_effect");
            player
                .when("useCard")
                .filter(evt => evt.skill == "mjsnewbeishuiyizhan")
                .then(() => {
                    trigger.baseDamage++;
                });
        },
        subSkill: {
            effect: {
                trigger: {
                    source: "damageSource",
                },
                forced: true,
                charlotte: true,
                filter(event, player) {
                    return event.card && event.getParent()?.skill == "mjsnewbeishuiyizhan";
                },
                async content(event, trigger, player) {
                    const cards = trigger.cards.filterInD();
                    if (cards.length) {
                        await player.gain(cards, "gain2");
                    }
                },
            },
        },
    },
    //李斯
    /**燔书明法
     * 出牌阶段限1次，你可以弃置1张牌，令一名其他角色手牌上限-1。当你弃牌后，直到你的下回合开始，其他角色打出与你弃牌同名的牌时，你可以令其随机弃置1张牌，然后令此技能下个出牌阶段的发动次数+1。
     * */
    mjsnewfanshumingfa: {
        nobracket: true,
        audio: "mjsfanshumingfa",
        skill_tag: ["控制"],
        enable: "phaseUse",
        usable(skill, player) {
            return 1 + player.countMark("mjsnewfanshumingfa_counter");
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
        group: "mjsnewfanshumingfa_discard",
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
                    player.addTempSkill("mjsnewfanshumingfa_effect", { player: "phaseBegin" });
                    player.markAuto("mjsnewfanshumingfa_effect", list);
                },
            },
            effect: {
                trigger: {
                    global: ["useCard", "respond"],
                },
                filter(event, player) {
                    if (event.player == player) return false;
                    return player.hasStorage("mjsnewfanshumingfa_effect", event.card.name);
                },
                logTarget: "player",
                prompt2(event, player) {
                    return `你可以令其随机弃置1张牌，然后令${get.poptip("mjsnewfanshumingfa")}下个出牌阶段的发动次数+1。`;
                },
                check(event, player) {
                    return get.attitude(player, event.player) < 0;
                },
                async content(event, trigger, player) {
                    const target = trigger.player;
                    const cards = target.getCards("h", card => {
                        return lib.filter.cardDiscardable(card, target, "mjsnewfanshumingfa_effect");
                    });
                    if (cards.length > 0) {
                        await target.discard(cards.randomGets(1)).set("discarder", target);
                    }
                    player
                        .when("phaseUseBegin")
                        .then(() => {
                            player.addTempSkill("mjsnewfanshumingfa_counter", "phaseUseAfter");
                            player.addMark("mjsnewfanshumingfa_counter", 1, false);
                        });
                },
            },
            counter: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    //白起
    /**出奇无穷
     * 每个回合限1次，当你在回合外需要打出牌时，可以将任意1张手牌当作要打出的牌打出，然后获得1张要打出的牌。 
     * */
    mjsnewchuqiwuqiong: {
        nobracket: true,
        audio: "mjschuqiwuqiong",
        enable: ["chooseToUse", "chooseToRespond"],
        usable: 1,
        filter(event, player) {
            if (_status.currentPhase == player || !player.countCards("h")) {
                return false;
            }
            return get
                .inpileVCardList(info => {
                    const name = info[2], nature = info[3];
                    return !nature && ["basic", "trick"].includes(get.type2(name));
                })
                .some(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
        },
        chooseButton: {
            dialog(event, player) {
                const list = get
                    .inpileVCardList(info => {
                        const name = info[2], nature = info[3];
                        return !nature && ["basic", "trick"].includes(get.type2(name));
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
                        const player = get.player();
                        const name = get.card().name;
                        if (card.name == name) {
                            return 0;
                        }
                        return 8 - get.value(card);
                    },
                    popname: true,
                    log: false,
                    async precontent(event, trigger, player) {
                        player.logSkill("mjsnewchuqiwuqiong");
                        player
                            .when(["useCardAfter", "respondAfter"])
                            .filter(evt => evt.skill == "mjsnewchuqiwuqiong_backup")
                            .then(async (event, trigger, player) => {
                                const card = get.cardPile(trigger.card.name);
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
            if (player.getStat().skill.mjsnewchuqiwuqiong) return false;
            if (_status.currentPhase == player || !player.countCards("h")) {
                return false;
            }
            return ["basic", "trick"].includes(get.type2(name));
        },
        ai: {
            respondSha: true,
            respondShan: true,
            skillTagFilter(player) {
                if (player.getStat().skill.mjsnewchuqiwuqiong) return false;
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
    //嬴政
    /**一统六合
     * 与你势力相同的角色造成伤害后，你可以将受伤角色的势力改为与你相同或移除受伤角色的势力。当全场首次仅存在一种势力时，你对所有无势力的角色造成1点伤害，回复全部体力，之后你的回合开始时，随机获得每个无势力角色的1张牌。
     * */
    mjsnewyitongliuhe: {
        nobracket: true,
        audio: "mjsyitongliuhe",
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
        async cost(event, trigger, player) {
            const list = [];
            if (get.info("mjsyitongliuhe").groupFiter(player)) {
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
                    const att = get.attitude(player, trigger.player);
                    if (att > 0) {
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
                const group = trigger.player.group;
                await trigger.player.changeGroup("g_noname", false);
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
                    const groups = game.filterPlayer().reduce((list, target) => list.add(target.group), []);
                    return groups.remove("g_noname").length == 1;
                },
                async content(event, trigger, player) {
                    player.tempBanSkill(event.name, "forever", false);
                    const targets = game.filterPlayer(target => {
                        return target.group == "g_noname";
                    });
                    for (const target of targets) {
                        await target.damage();
                    }
                    await player.recoverTo(player.maxHp);
                    player.addSkill("mjsyitongliuhe_effect")
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
    //王翦
    /**请田
     * 回合开始时/杀伤，可以选择一名其他角色，其可以交给你任意张牌，然后你本回合出杀次数+1。
     * */
    mjsnewqingtian: {
        audio: "mjsqingtian",
        trigger: {
            player: "phaseBegin",
            source: "damageSource",
        },
        popup: false,
        filter(event, player) {
            return event.name == "phase" || event.card?.name == "sha";
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                    return target != player && target.countCards("he");
                })
                .set("ai",  target => {
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
                player.addTempSkill("mjsnewqingtian_sha", "phaseChange");
                player.addMark("mjsnewqingtian_sha", 1, false);
            }
        },
        subSkill: {
            sha: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == "sha") return num + player.countMark("mjsnewqingtian_sha");
                    },
                },
            },
        },
    },
    //刘表
    /**偏安荆襄
     * 回合结束时，若你本回合没有造成过伤害，直到你的下回合开始，当其他角色弃牌时，你可以选择获得其中1张牌。
     * */
    mjsnewpiananjingxiang: {
        nobracket: true,
        audio: "mjspiananjingxiang",
        trigger: {
            player: "phaseEnd",
        },
        forced: true,
        locked: false,
        filter(event, player) {
            return !player.hasHistory("sourceDamage");
        },
        async content(event, trigger, player) {
            player.addTempSkill("mjsnewpiananjingxiang_effect", { player: "phaseBegin" });
        },
        subSkill: {
            effect: {
                trigger: {
                    global: ["loseAfter","loseAsyncAfter"],
                },
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
                    await player.gain(event.cards, "gain2");
                },
                mark: true,
                marktext: "襄",
                intro: {
                    content: "直到你的下回合开始，当其他角色弃牌时，你可以选择获得其中1张牌",
                },
            },
        },
    },
    //高渐离
    /**击筑而歌
     * 当你打出牌时，若此牌与你打出的前1张牌的点数不同，可以弃置一名其他角色的1张牌；若点数相同，则你摸1张牌，并且此技能失效直到当前回合结束。
     * */
    mjsnewjizhuerge: {
        nobracket: true,
        audio: "mjsjizhuerge",
        trigger: {
            player: ["useCard", "respond"],
        },
        priority: 2,
        forced: true,
        locked: false,
        filter(event, player) {
            var evt = lib.skill.mjsnewjizhuerge.getLastUsed(player, event);
            if (!evt || !evt.card) {
                return false;
            }
            return true;
        },
        getLastUsed(player, event) {
            var history = player.getAllHistory("useCard");
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
            const evt = lib.skill.mjsnewjizhuerge.getLastUsed(player, trigger);
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
                player.removeGaintag("mjsnewjizhuerge_mark");
                player.tempBanSkill(event.name);
            }
        },
        group: "mjsnewjizhuerge_mark",
        subSkill: {
            mark: {
                name: "筑",
                trigger: {
                    player: ["gainAfter", "useCard1", "respond"],
                    global: "loseAsyncAfter",
                },
                forced: true,
                locked: false,
                silent: true,
                firstDo: true,
                filter(event, player) {
                    if (!player.countCards("h")) return false;
                    if (["useCard", "respond"].includes(event.name)) {
                        return true;
                    }
                    return event.getg && event.getg(player)?.length;
                },
                async content(event, trigger, player) {
                    player.removeGaintag(event.name);
                    var evt = lib.skill.mjsnewjizhuerge.getLastUsed(player);
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
     * 当你打出牌时，若此牌与你打出的前1张牌的花色不同，则你可以弃置所有手牌，并摸等量牌；若花色相同，则你摸1张牌，并且此技能失效直到当前回合结束。
     * */
    mjsnewbianzhizhisheng: {
        nobracket: true,
        audio: "mjsbianzhizhisheng",
        trigger: {
            player: ["useCard", "respond"],
        },
        forced: true,
        locked: false,
        filter(event, player) {
            var evt = lib.skill.mjsnewjizhuerge.getLastUsed(player, event);
            if (!evt || !evt.card) {
                return false;
            }
            return true;
        },
        async content(event, trigger, player) {
            const evt = lib.skill.mjsnewjizhuerge.getLastUsed(player, trigger);
            if (get.suit(trigger.card) != get.suit(evt.card)) {
                const cards = player.getCards("h", card => {
                    return lib.filter.cardDiscardable(card, player, "mjsnewbianzhizhisheng");
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
                player.removeGaintag("mjsnewbianzhizhisheng_mark");
                player.tempBanSkill(event.name);
            }
        },
        group: "mjsnewbianzhizhisheng_mark",
        subSkill: {
            mark: {
                name: "徴",
                trigger: {
                    player: ["gainAfter", "useCard1", "respond"],
                    global: "loseAsyncAfter",
                },
                forced: true,
                locked: false,
                silent: true,
                firstDo: true,
                filter(event, player) {
                    if (!player.countCards("h")) return false;
                    if (["useCard", "respond"].includes(event.name)) {
                        return true;
                    }
                    return event.getg && event.getg(player)?.length;
                },
                async content(event, trigger, player) {
                    player.removeGaintag(event.name);
                    var evt = lib.skill.mjsnewjizhuerge.getLastUsed(player);
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
	//君王后
    //韩非
    /**不期修古
     * 当你发动其他技能后，可以失去该技能，然后抽取3张武将牌，选择获得其中1名武将的1个技能。
     * */
    mjsnewbuqixiugu: {
        nobracket: true,
        audio: "mjsbuqixiugu",
        inherit: "mjsbuqixiugu",
        usable(skill, player) {
            return Infinity;
        },
        filter(event, player) {
            if (event.type != "player") {
                return false;
            }
            var skill = get.sourceSkillFor(event);
            if (!skill || skill === "mjsnewbuqixiugu") {
                return false;
            }
            var info = get.info(skill);
            if (info.charlotte || !get.skillInfoTranslation(skill, player).length) {
                return false;
            }
            return player.hasSkill(skill, false, false, false);
        },
    },
	//陈阿娇
    /**金屋藏娇
     * 其他角色出牌阶段限1次，其可以交给你任意张牌，然后你回复等量的体力值，令其增加等量的出杀次数。
     * */
    mjsnewjinwucangjiao: {
        nobracket: true,
        audio: "mjsjinwucangjiao",
        global: "mjsnewjinwucangjiao_global",
        subSkill: {
            global: {
                enable: "phaseUse",
                prompt() {
                    const player = get.player();
                    const targets = game.filterPlayer(target => lib.skill.mjsnewjinwucangjiao_global.filterTarget(null, player, target));
                    let str = "交给" + get.translation(targets);
                    if (targets.length > 1) {
                        str += "中的一人";
                    }
                    str += "任意张牌，然后其回复等量的体力值，令你增加等量的出杀次数";
                    return str;
                },
                filter(event, player) {
                    if (!player.countCards("he")) {
                        return false;
                    }
                    return game.hasPlayer(target => lib.skill.mjsnewjinwucangjiao_global.filterTarget(null, player, target));;
                },
                filterTarget(card, player, target) {
                    return target != player && target.hasSkill("mjsnewjinwucangjiao") && !target.hasSkill("mjsnewjinwucangjiao_used", null, null, false);
                },
                selectTarget() {
                    const player = get.player();
                    const count = game.countPlayer(target => lib.skill.mjsnewjinwucangjiao_global.filterTarget(null, player, target));
                    return count > 1 ? 1 : -1;
                },
                check(card) {
                    const player = get.player();
                    if (ui.selected.cards.length >= Math.min(1, player.needsToDiscard())) {
                        return 0;
                    }
                    const hasFriend = game.hasPlayer(target => {
                        if (get.attitude(player, target) <= 0) return false;
                        return lib.skill.mjsnewjinwucangjiao_global.filterTarget(null, player, target);
                    });
                    return (hasFriend ? 6 : 1) - get.value(card);
                },
                filterCard: true,
                selectCard: [1,Infinity],
                discard: false,
                lose: false,
                delay: false,
                line: true,
                log: false,
                async precontent(event, trigger, player) {
                    event.result.targets[0].logSkill("mjsnewjinwucangjiao", player);
                },
                async content(event, trigger, player) {
                    const { target } = event;
                    target.addTempSkill("mjsnewjinwucangjiao_used", "phaseUseAfter");
                    await player.give(event.cards, target);
                    await target.recover(event.cards.length);
                    const result = await target
                    	.chooseBool(`你可以令${get.translation(player)}出杀次数+${event.cards.length}`)
                    	.set("ai", () => {
                    		return get.event().goon;
                    	})
                    	.set("goon", get.attitude(target, player) > 0)
                    	.forResult();
                    if (result?.bool) {
                    	player.addTempSkill("mjsnewjinwucangjiao_sha", "phaseUseAfter");
                    	player.addMark("mjsnewjinwucangjiao_sha", event.cards.length, false);
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
	                        return num + player.countMark("mjsnewjinwucangjiao_sha");
	                    }
	                },
	            },
            },
            used: {
                charlotte: true,
            },
        },
    },
    //周勃
    /**削平诸吕
     * 每轮限1次，摸牌至与全场手牌最多的角色相同，下一次造成的伤害+1，出牌阶段结束时，如果手牌中仍存在因此技能获得的牌，则将这些牌交给一名其他角色，然后失去此技能，直到有角色阵亡。
     * */
    mjsnewxuepingzhulv: {
        nobracket: true,
        audio: "mjsxuepingzhulv",
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
                    player.addGaintag(result.cards, "eternal_mjsnewxuepingzhulv_tag");
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
                                    await player.removeSkills(event.name);
                                    player
                                        .when({ global: "dieAfter" })
                                        .step(() => {
                                            player.addSkills(event.name);
                                        });
                                }
                            }
                            game.broadcastAll(
                                cards => {
                                    for (const card of cards) {
                                        card.removeGaintag("eternal_mjsnewxuepingzhulv_tag");
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
};

const skills2 = {

};
Object.assign(skills, skills2);

const skills5 = {
    //商鞅
    /**徙木立信
     * 出牌阶段限一次，你可以令一名其他角色依次执行：1，交给你一张牌；2，对你指定的另一名角色打出一张杀；3，失去一点体力。其每执行一项，你令其从游戏中获得一张你指定牌名的战法牌。
     * */
    mjs1017001: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filterTarget: lib.filter.notMe,
        async content(event, trigger, player) {
            let num = 0;
            const result = await target
                .chooseToGive(player, "he")
                .forResult();
            if (result.bool && result.cards.length) {
                num++;
            }
            const result2 = await player
                .chooseTarget(`令${get.translation(target)}对一名角色打出一张杀`)
                .forResult();
            if (result2.bool && result2.targets?.length) {
                const target2 = result.targets[0];
                const result = await target
                    .chooseToUse(
                        `你可以对${get.translation(target2)}使用一张杀`,
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
                    .set("addCount", false)
                    .set("sourcex", target2)
                    .forResult();
                if (result?.bool) {
                    num++;
                }
            }
            const result3 = await target
                .chooseBool("你可以失去1点体力")
                .forResult();
            if (result3.bool) {
                await target.loseHp();
                num++;
            }
            while (num > 0) {
                num--;
                const list = get.inpileVCardList(info => {
                    if (get.type(info[2]) != "trick") {
                        return false;
                    }
                    return true;
                });
                const result = await player
                    .chooseButton([get.translation(event.name), [list, "vcard"]])
                    .forResult();
                if (result.bool && result.links?.length) {
                    const card = get.cardPile(result.links[0][2]);
                    if (card) {
                        await target.gain(card);
                    }
                }
            }
        },
        ai: {
            order: 1,
            result: {
                target(player, target) {
                    return get.attitude(player, target);
                },
            },
        },
    },
    /**为法之敝
     * 阵亡，将所有销毁的牌添加到牌堆中，并洗牌。
     * */
    mjs1017002: {
        nobracket: true,
        trigger: {
            player: "die",
        },
        forceDie: true,
        filter(event, player) {
            return _status.destroy.length;
        },
        async content(event, trigger, player) {
            const cardList = _status.destroy;
            const cards = cardList.slice();
            await game.cardsGotoPile(cards, () => {
                return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
            });
            await game.washCard();
        },
    },
    //商鞅
    /**改弦易辙
     * 一名角色的回合开始时，你可以弃置1张牌并改变其本回合摸牌阶段、出牌阶段、弃牌阶段的顺序。
     * 每人回合开始时，你可以弃一张牌然后改变其本回合摸牌阶段、出牌阶段、弃牌阶段的顺序。
     * */
    mjs1024001: {
        nobracket: true,
        phasename: ["phaseDraw", "phaseUse", "phaseDiscard"],
        trigger: {
            global: "phaseBegin",
        },
        async cost(event, trigger, player) {
            event.result = await player
                .chooseToDiscard(get.prompt2(event.skill, trigger.player), "he", "chooseonly")
                .forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
            await player.discard(event.cards);
            const phasename = get.info(event.name).phasename,
                isPhase = name => phasename.includes(name.split("|")[0]);
            const list = trigger.phaseList.map((name, index) => [index + 1, "", name.split("|")[0]]);
            const choices = trigger.phaseList.reduce(
                (list, name, index) => (isPhase(name) ? [...list, [index + 1, "", name.split("|")[0]]] : list),
                []
            );
            const indexList = choices.map(i => i[0] - 1);
            const result = await player
                .chooseToMove(`###改弦易辙###改变${get.translation(trigger.player)}本回合阶段的顺序`, true)
                .set("list", [
                    [
                        "阶段顺序",
                        [
                            choices,
                            (item, type, position, noclick, node) => {
                                let showCard = [item[0], item[1], `lusu_${item[2]}`];
                                node = ui.create.buttonPresets.vcard(showCard, type, position, noclick);
                                node.node.info.innerHTML = `<span style = "color:#ffffff">${item[0]}</span>`;
                                node.node.info.style["font-size"] = "20px";
                                node._link = node.link = item;
                                node._customintro = uiintro => {
                                    uiintro.add(get.translation(node._link[2]));
                                    uiintro.addText(`此阶段为本回合第${get.cnNumber(node._link[0], true)}个阶段`);
                                    return uiintro;
                                };
                                return node;
                            },
                        ],
                    ],
                ])
                .set("processAI", list => {
                    let moved = list[0][1][0].slice(0);
                    return [[moved.at(-1), ...moved.slice(1, -1), moved.at(0)]];
                })
                .forResult();
            if (!result?.bool) {
                return;
            }
            indexList.forEach((i, index) => {
                trigger.phaseList[i] = result.moved[0][index][2];
            });
        },
    },
    /**徙木立信
     * 你可以将一张牌转化为识破并交给一名其他角色，此牌无法被主动弃置，当其使用此牌时，你与其各获得1张战法牌，并可对其发动1次“改弦易辙”。
     * 你可以将一张牌转化为无懈可击交给另一名角色，此牌无法被主动弃置，当其使用此牌时，你与其各获得一张战法牌，并可对其发动一次改弦易辙。
     * */
    mjs1024002: {
        nobracket: true,
        enable: "phaseUse",
        filterCard: true,
        position: "he",
        filterTarget: lib.filter.notMe,
        lose: false,
        discard: false,
        delay: false,
        async content(event, trigger, player) {
            const [target] = event.targets;
            for (const card of event.cards) {
                game.broadcastAll(function (card) {
                    card.init(["spade", 8, "wuxie"]);
                }, card);
            }
            await player.give(event.cards, target);
            target.addSkill("mjs1024002_tag");
            target.addGaintag(event.cards, "mjs1024002_tag");
        },
        subSkill: {
            tag: {
                mod: {

                },
                trigger: {
                    global: ["useCard", "respond"],
                },
                async content(event, trigger, player) {

                },
            },
        },
    },
    //商鞅
    /**徙木立信
     * 其他角色出牌阶段限1次，其可交给你一张♣牌，然后你可将之转化为多多益善交还给其。
     * 其他角色出牌阶段限一次，其可交给你一张♣牌，然后你可将之转化为多多益善交还给其。
     * */
    mjs1038901: {
        nobracket: true,
        global: "mjs1038901_global",
        subSkill: {
            global: {
                enable: "phaseUse",
                prompt() {
                    const player = get.player();
                    const targets = game.filterPlayer(target => lib.skill.mjs1038901_global.filterTarget(null, player, target));
                    let str = "交给" + get.translation(targets);
                    if (targets.length > 1) {
                        str += "中的一人";
                    }
                    str += "1张♣牌，然后其可将之转化为多多益善交还给你";
                    return str;
                },
                filter(event, player) {
                    if (!player.hasCards("he", { suit: "club"})) {
                        return false;
                    }
                    return game.hasPlayer(target => lib.skill.mjs1038901_global.filterTarget(null, player, target));
                },
                filterTarget(card, player, target) {
                    return target != player && target.hasSkill("mjs1038901") && !target.hasSkill("mjs1038901_used", null, null, false);
                },
                selectTarget() {
                    const player = get.player();
                    const count = game.countPlayer(target => lib.skill.mjs1038901_global.filterTarget(null, player, target));
                    return count > 1 ? 1 : -1;
                },
                check(card) {
                    const player = get.player();
                    const hasFriend = game.hasPlayer(target => {
                        if (get.attitude(player, target) <= 0) return false;
                        return lib.skill.mjs1038901_global.filterTarget(null, player, target);
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
                    event.result.targets[0].logSkill("mjs1038901", player);
                },
                async content(event, trigger, player) {
                    const { target } = event;
                    target.addTempSkill("mjs1038901_used", "phaseUseAfter");
                    await player.give(event.cards, target);
                    const cards = event.cards.filter(card => player.getCards("h").includes(card));
                    if (!cards.length) {
                        return;
                    }
                    const result = await target
                        .chooseBool(`徙木立信：是否将${get.translation(event.cards)}转化为多多益善交还给${get.translation(player)}`)
                        .set("ai", () => get.attitude(get.player(), get.event().getParent().player) > 0)
                        .forResult();
                    if (!result?.bool) {
                        return;
                    }
                    for (const card of cards) {
                        game.broadcastAll(function (card) {
                            card.init(["club", 2, "mjsduoduoyishan"]);
                        }, card);
                    }
                    await target.give(cards, player);
                },
                ai: {
                    expose: 0.3,
                    order: 1,
                    result: {
                        target: 5,
                    },
                },
            },
        },
    },
    /**徙木立信
     * 当一名角色在摸牌阶段外一次性获得两张及以上的牌，或者一次性造成两点及以上的伤害时，你可与其各摸一张牌。
     * */
    mjs1038902: {
        nobracket: true,
        trigger: {
            global: ["gainAfter", "loseAsyncAfter", "damageSource"],
        },
        getIndex(event, player) {
            if (event.name == "damage") {
                return [event.source];
            }
            const evt = event.getParent("phaseDraw");
            const evt2 = event.getParent(2);
            if (evt2.name == "mjs1038902") {
                return [];
            }
            return game.filterPlayer(target => {
                if (evt?.player == target) {
                    return false;
                }
                return event.getg(target).length > 1;
            });
        },
        filter(event, player, triggername, target) {
            return target?.isIn() && (event.name != "damage" || event.num > 1);
        },
        logTarget(event, player, triggername, target) {
            return target;
        },
        check(event, player, triggername, target) {
            return get.attitude(player, target) > 0;
        },
        async content(event, trigger, player) {
            const target = event.targets[0];
            await game.asyncDraw([player, target]);
        },
    },
    //商鞅
    /**垦草令
     * 摸牌阶段开始时，你可以选择少摸一张牌并增加一点手牌上限。回合结束时，你将手牌摸至手牌上限。
     * */
    mjs1051401: {
        nobracket: true,
        trigger: {
            player: ["phaseDrawBegin", "phaseEnd"],
        },
        silent: true,
        popup: true,
        filter(event, player) {
            return event.name == "phase" || !event.numFixed;
        },
        async content(event, trigger, player) {
            if (trigger.name == "phaseDraw") {
                trigger.num--;
                lib.skill.mjsallmax.change(player, 1);
            } else {
                await player.drawTo(player.getHandcardLimit());
            }
        },
    },
    /**变政明法
     * 出牌阶段内，你可以弃置两张花色相同的手牌，并选择一名其他角色，其不能使用与你弃置花色相同的牌，直到你的下个回合开始。
     * */
    mjs1051402: {
        nobracket: true,
        enable: "phaseUse",
        filterTarget: lib.filter.notMe,
        filterCard(card) {
            return ui.selected.cards.every(cardx => get.suit(cardx) == get.suit(card));
        },
        selectCard: 2,
        position: "he",
        async content(event, trigger, player) {
            const { target } = event;
            const suits = event.cards.reduce((list, card) => list.add(get.suit(card)), []);
            target.addTempSkill("mjs1051402_debuff", { player: "phaseBegin" });
            target.markAuto("mjs1051402_debuff", suits);
        },
        ai: {
            order: 10,
            result: {
                target(player, target) {
                    return -2;
                },
            },
        },
        subSkill: {
            debuff: {
                charlotte: true,
                onremove: true,
                mod: {
                    cardEnabled2(card, player, target) {
                        if (player.getStorage("mjs1051402_debuff").includes(get.suit(card))) {
                            return false;
                        }
                    },
                },
            },
        },
    },
    //商鞅
    /**明术霸国
     * 锁定技，当你手牌的属性均一致时，每使用一张装备牌，装备上限+1；每使用一张行动牌，体力上限+1；每使用一张锦囊牌，手牌上限+1。累计触发三次或进入濒死状态时，可将此技能转移给其他角色。
     * */
    mjs1060401: {
        nobracket: true,
        trigger: {
            player: ["useCard", "dying"],
        },
        silent: true,
        popup: true,
        filter(event, player) {
            return event._mjs1060401_only;
        },
        async content(event, trigger, player) {
            if (trigger.name == "useCard") {
                switch (get.type2(trigger.card)) {
                    case "equip": {
                        await player.mjsExpandEquip();
                    }
                    break;
                    case "basic": {
                        await player.gainMaxHp();
                    }
                    break;
                    case "trick": {
                        lib.skill.mjsallmax.change(player, 1);
                    }
                    break;
                }
            }
            if (player.countMark(event.name) % 3 == 0 || trigger.name == "dying") {
                const result = await player
                    .chooseTarget(`你可以将${get.translation(event.name)}转移给其他角色`, lib.filter.notMe)
                    .set("ai", target => {
                        const player = get.player();
                        const att = get.attitude(player, target);
                        return att;
                    })
                    .forResult();
                if (result?.targets?.length) {
                    const [target] = result.targets;
                    await player.removeSkills(event.name);
                    const createSkills = mjs.addCreateSkills(event.name);
                    await target.addSkills(createSkills);
                }
            }
        },
        group: "mjs1060401_mark",
        subSkill: {
            mark: {
                charlotte: true,
                trigger: {
                    player: "useCardBegin",
                },
                filter(event, player) {
                    const suits = player.getCards("h").reduce((list, card) => list.add(get.suit(card)), []);
                    if (!suits.length) {
                        return false;
                    }
                    return suits.length == 1;
                },
                forced: true,
                popup: false,
                content() {
                    trigger._mjs1060401_only = true;
                },
            },
        },
    },
    /**重农励战
     * 锁定技，一名角色的摸牌阶段开始时，若其体力上限大于你，其减一点体力上限并令摸牌阶段摸牌数+1；一名角色造成一次伤害后，若其手牌上限小于你，减一点手牌上限，令此伤害+1。该角色可取消此效果，然后受到你造成的一点伤害。
     * */
    mjs1060402: {
        nobracket: true,
        trigger: {
            global: ["phaseDrawBegin2", "damageBegin1"],
        },
        silent: true,
        popup: true,
        filter(event, player) {
            if (event.name == "phaseDraw") {
                return !event.numFixed && event.player.maxHp > player.maxHp;
            }
            return event.source?.isIn() && event.source.getHandcardLimit() < player.getHandcardLimit();
        },
        logTarget(event, player) {
            return event[event.name == "phaseDraw" ? "player" : "source"];
        },
        async content(event, trigger, player) {
            const [target] = event.targets;
            const prompt2 = trigger.name == "phaseDraw" ? "摸牌阶段，减1点体力上限并令摸牌数+1" : "造成伤害时，减1点手牌上限令此伤害+1";
            const result = await target
                .chooseBool(`你可取消“${prompt}”的效果，然后受到${get.translation(player)}造成的1点伤害。`)
                .set("ai", () => {
                    return get.event().choice;
                })
                .set(
                    "choice",
                    (() => {
                        if (get.damageEffect(target, player, target) >= 0) {
                            return true;
                        }
                        if (player.getHp() >= 3) {
                            return true;
                        }
                        if (trigger.name == "phaseDraw") {
                            return true;
                        }
                        return false;
                    })()
                )
                .forResult();
            if (result?.bool) {
                await target.damage();
                return;
            }
            if (trigger.name == "phaseDraw") {
                await trigger.player.loseMaxHp();
                trigger.num++;
            } else {
                lib.skill.mjsallmax.change(trigger.source, -1);
                trigger.num++;
            }
        },
    },
    //墨子
    mjs1038101: {

    },
    mjs1038102: {

    },
    //墨子
    mjs1060101: {
        nobracket: true,
    },
    mjs1060102: {
        nobracket: true,
    },
    mjs1060103: {
        nobracket: true,
    },
    //墨子
    mjs1062701: {
        nobracket: true,
    },
    mjs1062702: {
        nobracket: true,
    },
    //墨子
    mjs1070001: {
        nobracket: true,
    },
    mjs1070002: {
        nobracket: true,
    },
    //墨子
    mjs1072601: {
        nobracket: true,
    },
    mjs1072602: {
        nobracket: true,
    },
};

Object.assign(skills, skills5);

const skills4 = {
    //齐桓公
    mjs_penshigoubaixiang: {
        nobracket: true,
    },
    mjs_penzunwangrangyi: {
        nobracket: true,
    },
    mjs_penjiuhezhuhou: {
        nobracket: true,
    },
    //管仲
    mjs_penyikuangtianxia: {
        nobracket: true,
    },
    mjs_pentonghuojicai: {
        nobracket: true,
    },
    //鲍叔牙
    mjs_penfenjinrangli: {
        nobracket: true,
    },
    mjs_penjianxianziyi: {
        nobracket: true,
    },
    //文姜
    mjs_penyounvtongche: {
        nobracket: true,
    },
    mjs_penludaoyoudang: {
        nobracket: true,
    },
    //晏婴
    mjs_penjuyuweizhi: {
        nobracket: true,
    },
    mjs_penertaoshasanshi: {
        nobracket: true,
    },
    //邹忌
    mjs_penchaofukuijing: {
        nobracket: true,
    },
    mjs_penmentingnajian: {
        nobracket: true,
    },
    //扁鹊
    mjs_penwangwenwenqie: {
        nobracket: true,
    },
    mjs_penhuanxinyixue: {
        nobracket: true,
    },
    //田忌
    mjs_penchisizhengxian: {
        nobracket: true,
    },
    mjs_penweiweijiuzhao: {
        nobracket: true,
    },
    //匡章
    mjs_penbianzhihunqin: {
        nobracket: true,
    },
    mjs_penqiaofuwendu: {
        nobracket: true,
    },
    mjs_penhuangupoguan: {
        nobracket: true,
    },
    //邹衍
    mjs_penwudeshizhong: {
        nobracket: true,
    },
    mjs_pendajiuzhoushuo: {
        nobracket: true,
    },
    mjs_penchuilvshengnuan: {
        nobracket: true,
    },
    //田穰苴
    mjs_penzhanjialiwei: {
        nobracket: true,
    },
    mjs_penfuxunshizu: {
        nobracket: true,
    },
};
Object.assign(skills, skills4);

export default skills;
