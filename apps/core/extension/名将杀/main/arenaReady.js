import { lib, game, ui, get, ai, _status } from "noname";
import cardList from "../src/js/setting/cardList.js";

export function arenaReady(config, pack) {
    const packs = { ...lib.characterPack.mjs, ...lib.characterPack.mjsnew, ...lib.characterPack.mjsold };
    const ranks = ["junk", "rare", "epic", "legend"];
    for (let i in packs) {
        for (let rank of ranks) {
            if (lib.character[i]?.trashBin?.includes(rank)) {
                lib.rank.rarity[rank].add(i);
                break;
            }
        }
    }

    

    

    // 销毁区与烧毁区
    _status.destroy = [];
    _status.burnDown = [];
    if (lib.commonArea) {
        lib.commonArea.set("destroy", {
            translate: "销毁牌",
            areaStatusName: "destroy",
            toName: "toDestroy",
            fromName: "fromDestroy",
            async addHandeler(event, trigger, player) {
                const { cards } = event;
                _status.destroy.addArray(
                    cards.filter(function (card) {
                        return !card.willBeDestroyed("destroy", null, event.relatedEvent);
                    })
                );
                game.broadcast(function (destroy) {
                    _status.destroy = destroy;
                }, _status.destroy);
            },
            async removeHandeler(event, trigger, player) {
                const { cards } = event;
                _status.destroy.removeArray(cards);
                game.broadcast(function (destroy) {
                    _status.destroy = destroy;
                }, _status.destroy);
            }
        });
        lib.commonArea.set("burnDown", {
            translate: "烧毁牌",
            areaStatusName: "burnDown",
            toName: "toBurnDown",
            fromName: "fromBurnDown",
            async addHandeler(event, trigger, player) {
                const { cards } = event;
                _status.burnDown.addArray(
                    cards.filter(function (card) {
                        return !card.willBeDestroyed("burnDown", null, event.relatedEvent);
                    })
                );
                game.broadcast(function (burnDown) {
                    _status.burnDown = burnDown;
                }, _status.burnDown);
            },
            async removeHandeler(event, trigger, player) {
                const { cards } = event;
                _status.burnDown.removeArray(cards);
                game.broadcast(function (burnDown) {
                    _status.burnDown = burnDown;
                }, _status.burnDown);
            }
        });
    }

    // 卡牌转化属性
    const origin_card_init = lib.element.Card.prototype.init;
    game.origin_card_init = origin_card_init;
    lib.element.Card.prototype.init = function (card) {
        const result = origin_card_init.call(this, card);
        if (get.itemtype(result) == "card") {
            if (!result.converted) {
                result.converted = true;
            } else {
                result.addGaintag("eternal_mjs_converted");
            }
            if (_status._mjs_shaNature) {
                if (result.name == "sha") {
                    if (result.suit == "heart") {
                        //game.setNature(result, "fire");
                        card[3] = "fire";
                        //result.$init(card);
                        result.$init([result.suit, result.number, result.name, "fire"]);
                    } else if (result.suit == "diamond" && result.number == 4) {
                        //game.setNature(result, "thunder");
                        card[3] = "thunder";
                        //result.$init(card);
                        result.$init([result.suit, result.number, result.name, "thunder"]);
                    }
                }
            }
        }
        return result;
    };
    
    // 卡牌专属配音
    const original_playCardAudio = game.playCardAudio;
    game.original_playCardAudio = original_playCardAudio;
    game.playCardAudio = function (card, sex) {
        // 名将的卡牌语音男女老少甚至太监都有，很精彩
        if (typeof card === "string") {
            card = { name: card };
        }
        if (card.name.startsWith("mjs")) {
            if (get.itemtype(sex) === "player") {
                if (!lib.config.background_audio || get.type(card) == "equip" && !lib.config.equip_audio) {
                    return;
                }
                if (lib.card[card.name].cardAudio) {
                    const cardaudio = lib.card[card.name].cardAudio[sex.name];
                    if (cardaudio) {
                        game.playAudio(cardaudio);
                        return;
                    }
                }
                sex = sex.sex == "female" ? "female" : "male";
            }else if (typeof sex == "string") {
                sex = sex == "female" ? "female" : "male";
            }
            game.playAudio(`ext:名将杀/audio/card/${sex}/${card.name}.mp3`);
            return;
        }
        return original_playCardAudio.apply(this, arguments);
    };

    // 名将牌堆
    if (lib.config["extension_名将杀_cardPile"]) {
        lib.card.list = [];
        lib.card.list = [...cardList];
        lib.card.list.randomSort();
        const list = ["sha", "shan", "tao", "jiu", "shunshou"];
        for (const name of list) {
            if (!lib.card[name]) {
                continue;
            }
            lib.card[name].image = `ext:名将杀/image/card/${name}.png`;
        }
    }

    // 胜利结算
    /*lib.onover.push(
        result => {
            if (result === true && game.me && get.character(game.me.name)?.victoryAudios?.length) {
                const audioList = get.character(game.me.name).victoryAudios.slice();
                const audio = audioList.randomRemove();
                game.playAudio(audio);
            }
        }
    );*/

    // 姗姗来迟
    lib.skill.mjs_rule_shanshanlaichi = {
        charlotte: true,
        ruleSkill: true,
        group: "undist",
        init(player) {
            if (player.isIn()) {
                game.broadcastAll(function (player) {
                    player.classList.add("out");
                    player.classList.add("shanshanlaichi");
                }, player);
            }
        },
        onremove(player, skill) {
            for (var i = 0; i < lib.element.player.inits.length; i++) {
                const func = lib.element.player.inits[i];
                if (func && func.name && func.name == "deferHide") {
                    lib.element.player.inits.splice(i--, 1);
                }
            }
            if (player.isOut()) {
                game.broadcastAll(function (player) {
                    player.classList.remove("out");
                    player.classList.remove("shanshanlaichi");
                }, player);
            }
            player.getStorage(skill).forEach(node => player.node[node].show());
            delete player.storage[skill];
        },
        trigger: {
            global: "roundStart"
        },
        silent: true,
        firstDo: true,
        forceOut: true,
        forceDie: true,
        filter(event, player) {
            return game.roundNumber > 1;
        },
        async content(event, trigger, player) {
            player.removeSkill(event.name);
            event.trigger("enterGame");
            if (get.character(player.name)?.enterAudios?.length) {
                const audioList = get.character(player.name).enterAudios.slice();
                const audio = audioList.randomRemove();
                game.playAudio(audio);
                game.delay();
            }
        },
    };
    const hide = function(player) {
        var name = player.name || player.name1;
        if (name && lib.character[name]) {
            const nodeList = Object.keys(player.node);
            nodeList.removeArray([
                "avatar",
                "avatar2",
                "turnedover",
                "framebg",
                "intro",
                "identity",
                //"hp",
                //"name",
                //"name2",
                //"nameol",
                //"count",
                "equips",
                "judges",
                "marks",
                "chain",
                "handcards1",
                "handcards2",
                "expansions",
                "action",
                "link",
                "name_seat"
            ]);
            for (const node of nodeList) {
                if (!player.node[node]?.classList?.contains("hidden")) {
                    player.markAuto("mjs_rule_shanshanlaichi", node);
                    player.node?.[node].hide();
                }
            }
        }
        player.addSkill("mjs_rule_shanshanlaichi");
    };
    lib.element.player.inits = []
        .concat(lib.element.player.inits || [])
        .concat(function deferHide(player) {
            if (!player.hasSkillTag("deferHide")) {
                return;
            }
            hide(player);
        });
    // 分发起始手牌 一号位调离后发牌
    const original_game_gameDraw = game.gameDraw;
    game.gameDraw = function(player = game.me, num = 4, targets = game.players) {
        const next = original_game_gameDraw.apply(this, arguments);
        next.includeOut = true;
        return next;
    };

    

    // 轮次
    if (lib.config["extension_名将杀_phaseLoop"]) {
        // 可以直接改phaseLoop + phase
        /*lib.element.content.phaseLoop = async (event, trigger, player) => {
            if (!_status._mjs_phaseLoop?.length) {
                _status._mjs_phaseLoop = game.filterPlayer().sortBySeat();
            }
            let num = 1,
                current = player;
            while (current.getSeatNum() === 0) {
                current.setSeatNum(num);
                current = current.next;
                num++;
            }
            while (true) {
                if (game.players.includes(event.player)) {
                    lib.onphase.forEach(i => i());
                    const phase = event.player.phase();
                    event.next.remove(phase);
                    let isRoundEnd = false;
                    if (lib.onround.every(i => i(phase, event.player))) {
                        isRoundEnd = _status.roundSkipped;
                        if (_status.isRoundFilter) {
                            isRoundEnd = _status.isRoundFilter(phase, event.player);
                        } else if (_status.seatNumSettled) {
                            const seatNum = event.player.getSeatNum();
                            if (seatNum != 0) {
                                if (get.itemtype(_status.lastPhasedPlayer) != "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
                                    isRoundEnd = true;
                                }
                            }
                        } else if (event.player == _status.roundStart) {
                            isRoundEnd = true;
                        }
                        if (isRoundEnd && _status.globalHistory.some(i => i.isRound)) {
                            game.log();
                            await event.trigger("roundEnd");
                        }
                    }
                    event.next.push(phase);
                    await phase;
                }
                await event.trigger("phaseOver");
                let findNext = current => {
                    let targets = game.filterPlayer(target => {
                        return !_status._mjs_phaseLoop.includes(target);
                    });
                    let players = _status._mjs_phaseLoop;
                    if (targets.length) {
                        players.addArray(targets);
                    }
                    let position = players.indexOf(current);
                    for (let i = 0; i < players.length; i++) {
                        if (players.indexOf(players[i]) > position) {
                            return players[i];
                        }
                    }
                    return players[0];
                };
                event.player = findNext(event.player);
            }
        };
        lib.element.content.phase = function () {};*/
        Object.assign(lib.skill, {
            _mjs_phaseLoop: {
                trigger: {
                    player: ["phaseBefore", "phaseAfter"],
                },
                silent: true,
                charlotte: true,
                ruleSkill: true,
                forceDie: true,
                forceOut: true,
                async content(event, trigger, player) {
                    if (event.triggername == "phaseBefore") {
                        if (!_status._mjs_phaseLoop) {
                            _status._mjs_phaseLoop = game.filterPlayer().sortBySeat();
                        }
                        player
                            .when("phaseBeforeStart")
                            .filter(evt => evt._roundStart)
                            .then(() => {
                                _status._mjs_phaseLoop = game.filterPlayer().sortBySeat();
                            });
                        _status.isRoundFilter = (phase, player) => {
                            return _status._mjs_phaseLoop[0] == player;
                        };
                    } else if (event.triggername == "phaseAfter") {
                        _status.isRoundFilter = (phase, player) => {
                            return _status._mjs_phaseLoop.slice(0).reverse()[0] == player;
                        };
                    }
                },
                onRound(event) {
                    return event.getParent().skill != "_mjs_phaseLoop_phase" && (event.relatedEvent || event.getParent(2)).name != "_mjs_phaseLoop_phase";
                },
                getPhases() {
                    let evts = game.getAllGlobalHistory("everything", evt => evt.name == "phase");
                    const evt = evts.slice(0).reverse().find(evt => evt._roundStart);
                    if (evt) {
                        evts = evts.slice(evts.indexOf(evt));
                    }
                    return evts.filter(evt => !evt._cancelled && !evt._finished);
                },
                checkx(source, player) {
                    const players = _status._mjs_phaseLoop;
                    const num = players.indexOf(source),
                        num2 = players.indexOf(player);
                    return num2 - num == 1 || (num == players.length - 1 && num2 == 0);
                },
                subSkill: {
                    phase: {
                        trigger: {
                            global: "phaseOver",
                        },
                        silent: true,
                        charlotte: true,
                        ruleSkill: true,
                        filter(event, player) {
                            if (player.hasSkill("mjs_phaseLoop_skip")) {
                                return false;
                            }
                            const evts = get.info("_mjs_phaseLoop").getPhases();
                            if (evts.some(evt => evt.player == player)) {
                                return false;
                            }
                            return get.info("_mjs_phaseLoop").checkx(event.player, player);
                        },
                        content() {
                            player.addTempSkill("mjs_phaseLoop_skip", "roundStart");
                            const next = player.insertPhase();
                            delete next.skill;
                            next.phaseList = trigger.phaseList;
                            next.relatedEvent = trigger.relatedEvent || trigger.getParent(2);
                            next._mjs_phaseLoop_phase = true;
                            next.pushHandler("_mjs_phaseLoop_phase", (event, option) => {
                                if (event.step === 0 && option.state === "begin") {
                                    event.step = 4;
                                    _status.globalHistory.push({
                                        cardMove: [],
                                        custom: [],
                                        useCard: [],
                                        changeHp: [],
                                        everything: [],
                                    });
                                    var players = game.players.slice(0).concat(game.dead);
                                    for (var i = 0; i < players.length; i++) {
                                        var current = players[i];
                                        current.actionHistory.push({
                                            useCard: [],
                                            respond: [],
                                            skipped: [],
                                            lose: [],
                                            gain: [],
                                            sourceDamage: [],
                                            damage: [],
                                            custom: [],
                                            useSkill: [],
                                        });
                                        current.stat.push({ card: {}, skill: {} });
                                    }
                                }
                            });
                        },
                    },
                },
            },
            mjs_phaseLoop_skip: {
                trigger: {
                    player: "phaseBefore",
                },
                silent: true,
                charlotte: true,
                ruleSkill: true,
                onremove: true,
                filter(event, player) {
                    return !event.skill && !event._mjs_phaseLoop_phase;
                },
                async content(event, trigger, player) {
                    trigger.cancel();
                },
            },
        });
    }
    // 出杀次数显示
    if (lib.config["extension_名将杀_getShaUsable"]) {
        lib.element.player.updates = []
            .concat(lib.element.player.updates || [])
            .concat(player => {
                if (!player.isPhaseUsing()) {
                    return;
                }
                var num = player.getCardUsable("sha");
                if (num >= 114514) num = "∞";
                player.node.getShaUsable.innerHTML = num.toString();
            });
        lib.element.player.inits = []
            .concat(lib.element.player.inits || [])
            .concat(player => {
                if (player.node?.getShaUsable) {
                    return;
                }
                player.node.getShaUsable = ui.create.div(".getShaUsable", player);
                player.node.getShaUsable.hide();
            });
        lib.skill._mjs_getShaUsable = {
            trigger: {
                player: "phaseUseBegin",
            },
            popup: false,
            forced: true,
            firstDo: true,
            charlotte: true,
            async content(event, trigger, player) {
                var num = player.getCardUsable("sha");
                if (num >= 114514) num = "∞";
                player.node.getShaUsable.innerHTML = num.toString();
                player.node.getShaUsable.show();
                player
                    .when({ global: "phaseAny" })
                    .step(async (event, trigger, player) => {
                        player.node.getShaUsable.hide();
                    });
            },
        };
    }
    
}
