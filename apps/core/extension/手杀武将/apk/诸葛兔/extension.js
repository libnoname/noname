import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function (lib, game, ui, get, ai, _status) {
    return {
        name: "诸葛兔",
        content: function () {},
        precontent: function () {},
        help: {},
        config: {},
        package: {
            character: {
                character: {
                    zgt_zhugetu: [
                        "female",
                        "shu",
                        3,
                        ["zgt_xing", "zgt_wan"],
                        ["ext:手杀武将/apk/诸葛兔/image/character/zgt_zhugetu.jpg"],
                    ],
                    zgt_guanyutu: [
                        "male",
                        "shu",
                        5,
                        ["zgt_yi"],
                        ["ext:手杀武将/apk/诸葛兔/image/character/zgt_guanyutu.jpg"],
                    ],
                    zgt_zhaoyuntu: [
                        "male",
                        "shu",
                        5,
                        ["zgt_heng", "zgt_lie"],
                        ["ext:手杀武将/apk/诸葛兔/image/character/zgt_zhaoyuntu.jpg"],
                    ],
                },
                translate: {
                    zgt_zhugetu: "诸葛兔",
                    zgt_guanyutu: "关羽兔",
                    zgt_zhaoyuntu: "赵云兔",
                },
            },
            card: {
                card: {},
                translate: {},
                list: [],
            },
            skill: {
                skill: {
                    zgt_xing: {
                        audio: 'ext:手杀武将/apk/诸葛兔/audio:2',
                        trigger: {
                            global: "phaseBefore",
                            player: "enterGame",
                        },
                        forced: true,
                        filter: function (event, player) {
                            return !player.storage.zgt_xing_initialized && (event.name != "phase" || game.phaseNumber == 0);
                        },
                        content: function () {
                            "step 0";
                            player.storage.zgt_xing_initialized = true;
                            event.cards = [];
                            for (var i = 0; i < lib.inpile.length; i++) {
                                var name = lib.inpile[i];
                                var info = lib.card[name];
                                if (!info || get.type2(name) != "trick" || info.notarget || !info.filterTarget) continue;
                                var card = get.cardPile(name, "cardPile");
                                if (card) event.cards.push(card);
                            }
                            if (!event.cards.length) {
                                event.finish();
                                return;
                            }
                            player.gain(event.cards, "gain2", "log");
                            "step 1";
                            player.addGaintag(event.cards, "zgt_xing");
                            player.storage.zgt_xing_locked_ids = event.cards.map(function (card) {
                                return card.cardid;
                            });
                            player.syncStorage("zgt_xing_locked_ids");
                            player.markSkill("zgt_xing");
                        },
                        mark: true,
                        marktext: "兴",
                        intro: {
                            content: function (storage, player) {
                                var cards = player.getCards("h", function (card) {
                                    return card.hasGaintag("zgt_xing");
                                });
                                var locked = cards.filter(function (card) {
                                    return lib.skill.zgt_xing.isLockedXing(card, player);
                                });
                                if (!cards.length) return "当前手牌中没有“兴”";
                                return "共有" + get.cnNumber(cards.length) + "张“兴”，其中" + get.cnNumber(locked.length) + "张不可使用";
                            },
                        },
                        mod: {
                            ignoredHandcard: function (card) {
                                if (card && card.hasGaintag && card.hasGaintag("zgt_xing")) return true;
                            },
                            cardDiscardable: function (card) {
                                if (card && card.hasGaintag && card.hasGaintag("zgt_xing")) return false;
                            },
                            cardEnabled: function (card, player) {
                                if (lib.skill.zgt_xing.isLockedXing(card, player)) return false;
                            },
                            cardEnabled2: function (card, player) {
                                if (lib.skill.zgt_xing.isLockedXing(card, player)) return false;
                            },
                            cardRespondable: function (card, player) {
                                if (lib.skill.zgt_xing.isLockedXing(card, player)) return false;
                            },
                            cardSavable: function (card, player) {
                                if (lib.skill.zgt_xing.isLockedXing(card, player)) return false;
                            },
                            targetInRange: function (card, player) {
                                if (!lib.skill.zgt_xing.hasLockedXing(player)) return true;
                            },
                            cardUsable: function (card, player) {
                                if (!lib.skill.zgt_xing.hasLockedXing(player)) return Infinity;
                            },
                        },
                        isXing: function (card) {
                            return !!(card && card.hasGaintag && card.hasGaintag("zgt_xing"));
                        },
                        isLockedXing: function (card, player) {
                            if (!player || !lib.skill.zgt_xing.isXing(card)) return false;
                            var ids = player.storage.zgt_xing_locked_ids || [];
                            return ids.indexOf(card.cardid) != -1;
                        },
                        hasLockedXing: function (player) {
                            return player.hasCard(function (card) {
                                return lib.skill.zgt_xing.isLockedXing(card, player);
                            }, "h");
                        },
                        group: ["zgt_xing_unlock", "zgt_xing_reset", "zgt_xing_directhit"],
                        subSkill: {
                            unlock: {
                                trigger: {
                                    source: "damageSource",
                                },
                                forced: true,
                                filter: function (event, player) {
                                    if (!lib.skill.zgt_xing.hasLockedXing(player)) return false;
                                    var damageCards = player.getHistory("useCard", function (evt) {
                                        return evt.card && get.tag(evt.card, "damage");
                                    }).length;
                                    return damageCards > (player.storage.zgt_xing_unlock_count || 0);
                                },
                                content: function () {
                                    var cards = player.getCards("h", function (card) {
                                        return lib.skill.zgt_xing.isLockedXing(card, player);
                                    });
                                    var card = cards.randomGet();
                                    if (!card) return;
                                    player.storage.zgt_xing_unlock_count = (player.storage.zgt_xing_unlock_count || 0) + 1;
                                    var ids = player.storage.zgt_xing_locked_ids || [];
                                    var index = ids.indexOf(card.cardid);
                                    if (index != -1) ids.splice(index, 1);
                                    player.storage.zgt_xing_locked_ids = ids;
                                    player.syncStorage("zgt_xing_locked_ids");
                                    player.markSkill("zgt_xing");
                                },
                            },
                            reset: {
                                trigger: {
                                    global: "phaseBefore",
                                },
                                forced: true,
                                silent: true,
                                popup: false,
                                firstDo: true,
                                content: function () {
                                    player.storage.zgt_xing_unlock_count = 0;
                                },
                            },
                            directhit: {
                                trigger: {
                                    player: "useCard",
                                },
                                forced: true,
                                silent: true,
                                popup: false,
                                filter: function (event, player) {
                                    return !lib.skill.zgt_xing.hasLockedXing(player);
                                },
                                content: function () {
                                    trigger.directHit.addArray(game.players);
                                },
                            },
                        },
                    },
                    zgt_wan: {
                        audio: 'ext:手杀武将/apk/诸葛兔/audio:2',
                        trigger: {
                            player: "useCardAfter",
                        },
                        direct: true,
                        filter: function (event, player) {
                            if (!event.card || get.type2(event.card) != "trick") return false;
                            var conditions = lib.skill.zgt_wan.getConditions(event.card, player);
                            return conditions[0] || conditions[1];
                        },
                        getConditions: function (card, player) {
                            var name = get.name(card);
                            var xingCards = player.getCards("h", function (current) {
                                return current.hasGaintag("zgt_xing");
                            });
                            var different = true;
                            for (var i = 0; i < xingCards.length; i++) {
                                if (get.name(xingCards[i]) == name) {
                                    different = false;
                                    break;
                                }
                            }
                            var onlyPlayer = true;
                            var players = game.players.slice(0);
                            if (game.dead && game.dead.length) players.addArray(game.dead);
                            for (var j = 0; j < players.length; j++) {
                                var current = players[j];
                                if (current == player) continue;
                                if (current.getAllHistory("useCard", function (evt) {
                                    return evt.card && get.name(evt.card) == name;
                                }).length) {
                                    onlyPlayer = false;
                                    break;
                                }
                            }
                            return [different, onlyPlayer];
                        },
                        content: function () {
                            "step 0";
                            event.conditions = lib.skill.zgt_wan.getConditions(trigger.card, player);
                            event.chengshi = event.conditions[0] && event.conditions[1];
                            var effects = [];
                            if (event.conditions[0]) effects.push("令体力值唯一最小的角色回复" + (event.chengshi ? 2 : 1) + "点体力");
                            if (event.conditions[1]) effects.push("对" + (event.chengshi ? 2 : 1) + "名角色各造成" + (event.chengshi ? 2 : 1) + "点火焰伤害");
                            player.chooseBool(get.prompt("zgt_wan"), effects.join("；") + (event.chengshi ? "（满足乘势）" : "")).set("ai", function () {
                                return true;
                            });
                            "step 1";
                            if (!result.bool) {
                                event.finish();
                                return;
                            }
                            player.logSkill("zgt_wan");
                            event.num = event.chengshi ? 2 : 1;
                            if (event.conditions[0]) {
                                var minHp = Infinity;
                                var minPlayers = [];
                                game.countPlayer(function (current) {
                                    if (current.hp < minHp) {
                                        minHp = current.hp;
                                        minPlayers = [current];
                                    } else if (current.hp == minHp) {
                                        minPlayers.push(current);
                                    }
                                });
                                if (minPlayers.length == 1) {
                                    minPlayers[0].recover(event.num);
                                }
                            }
                            "step 2";
                            if (!event.conditions[1]) {
                                event.finish();
                                return;
                            }
                            event.targetCount = event.chengshi ? Math.min(2, game.countPlayer()) : 1;
                            player.chooseTarget([event.targetCount, event.targetCount], true, "〖玩〗：选择" + get.cnNumber(event.targetCount) + "名角色，对其各造成" + get.cnNumber(event.num) + "点火焰伤害").set("ai", function (target) {
                                var player = _status.event.player;
                                return get.damageEffect(target, player, player, "fire");
                            });
                            "step 3";
                            if (!result.bool || !result.targets || !result.targets.length) {
                                event.finish();
                                return;
                            }
                            event.targets = result.targets.slice(0).sortBySeat();
                            event.index = 0;
                            "step 4";
                            if (event.index >= event.targets.length) {
                                event.finish();
                                return;
                            }
                            event.targets[event.index].damage(event.num, "fire", player);
                            event.index++;
                            event.redo();
                        },
                    },
                    zgt_yi: {
                        audio: 'ext:手杀武将/apk/诸葛兔/audio:2',
                        enable: "phaseUse",
                        usable: 1,
                        filter: function (event, player) {
                            return game.hasPlayer(function (current) {
                                return current != player && current.countCards("he") > 0;
                            });
                        },
                        filterTarget: function (card, player, target) {
                            return target != player && target.countCards("he") > 0;
                        },
                        selectTarget: [1, 2],
                        multitarget: true,
                        multiline: true,
                        content: function () {
                            "step 0";
                            event.yiTargets = targets.slice(0).sortBySeat();
                            event.yiCards = [];
                            event.yiIndex = 0;
                            "step 1";
                            if (event.yiIndex >= event.yiTargets.length) {
                                event.goto(3);
                                return;
                            }
                            event.yiCurrent = event.yiTargets[event.yiIndex];
                            event.yiCurrent.chooseCard("he", true, "〖义〗：交给" + get.translation(player) + "一张牌").set("ai", function (card) {
                                return 6 - get.value(card);
                            });
                            "step 2";
                            if (result.bool && result.cards && result.cards.length) {
                                event.yiCards.addArray(result.cards);
                                event.yiCurrent.give(result.cards, player);
                            }
                            event.yiIndex++;
                            event.goto(1);
                            "step 3";
                            if (!event.yiCards || !event.yiCards.length) {
                                event.finish();
                                return;
                            }
                            event.yiShaTargets = event.yiTargets.filter(function (current) {
                                return current.isIn() && player.canUse({ name: "sha" }, current, false);
                            });
                            event.yiDistributeTargets = game.filterPlayer(function (current) {
                                return !event.yiTargets.contains(current);
                            });
                            var controls = [];
                            if (event.yiShaTargets.length) controls.push("当【杀】使用");
                            if (event.yiDistributeTargets.length) controls.push("分配这些牌");
                            if (controls.length == 1) {
                                event._result = { control: controls[0] };
                            } else {
                                player.chooseControl(controls).set("prompt", "〖义〗：选择一项").set("ai", function () {
                                    var player = _status.event.player;
                                    var targets = _status.event.getParent().yiShaTargets || [];
                                    for (var i = 0; i < targets.length; i++) {
                                        if (get.effect(targets[i], { name: "sha" }, player, player) > 0) return "当【杀】使用";
                                    }
                                    return "分配这些牌";
                                });
                            }
                            "step 4";
                            event.choice = result.control;
                            if (event.choice == "当【杀】使用") {
                                player.chooseTarget(true, "〖义〗：选择此【杀】的目标", function (card, player, target) {
                                    var targets = _status.event.getParent().yiShaTargets || [];
                                    return targets.contains(target);
                                }).set("ai", function (target) {
                                    var player = _status.event.player;
                                    return get.effect(target, { name: "sha" }, player, player);
                                });
                            } else {
                                event.yiRemaining = event.yiCards.slice(0);
                                event.goto(6);
                                return;
                            }
                            "step 5";
                            if (!result.bool || !result.targets || !result.targets.length || !event.yiCards || !event.yiCards.length) {
                                event.finish();
                                return;
                            }
                            event.yiShaTarget = result.targets[0];
                            event.yiColors = [];
                            for (var i = 0; i < event.yiCards.length; i++) {
                                var color = get.color(event.yiCards[i], player);
                                if (color && color != "none" && !event.yiColors.contains(color)) event.yiColors.push(color);
                            }
                            event.yiShaTarget.addTempSkill("zgt_yi_block", { global: "useCardAfter" });
                            var virtualCard = {
                                name: "sha",
                                isCard: true,
                                storage: {
                                    zgt_yi: true,
                                    zgt_yi_colors: event.yiColors,
                                },
                            };
                            var next = player.useCard(virtualCard, event.yiCards, event.yiShaTarget, false);
                            next.addCount = false;
                            event.finish();
                            "step 6";
                            if (!event.yiRemaining || !event.yiRemaining.length) {
                                event.finish();
                                return;
                            }
                            event.yiDistributeCard = event.yiRemaining.shift();
                            player.chooseTarget(true, "〖义〗：选择一名角色获得" + get.translation(event.yiDistributeCard), function (card, player, target) {
                                return event.yiTargets && !event.yiTargets.contains(target);
                            }).set("ai", function (target) {
                                return get.attitude(_status.event.player, target);
                            });
                            "step 7";
                            if (!result.bool || !result.targets || !result.targets.length) {
                                event.finish();
                                return;
                            }
                            event.yiRecipient = result.targets[0];
                            if (get.color(event.yiDistributeCard, player) == "black") {
                                var ids = event.yiRecipient.storage.zgt_yi_black_ids || [];
                                if (!ids.contains(event.yiDistributeCard.cardid)) ids.push(event.yiDistributeCard.cardid);
                                event.yiRecipient.storage.zgt_yi_black_ids = ids;
                                event.yiRecipient.syncStorage("zgt_yi_black_ids");
                                event.yiRecipient.addTempSkill("zgt_yi_black_effect", { global: "phaseAfter" });
                            }
                            if (event.yiRecipient != player) {
                                player.give(event.yiDistributeCard, event.yiRecipient);
                            }
                            "step 8";
                            event.goto(6);
                        },
                        ai: {
                            order: 7,
                            result: {
                                player: 1,
                                target: function (player, target) {
                                    return -get.attitude(player, target);
                                },
                            },
                        },
                    },
                    zgt_yi_block: {
                        charlotte: true,
                        getColors: function () {
                            var evt = _status.event;
                            while (evt) {
                                if (evt.name == "useCard" && evt.card && evt.card.storage && evt.card.storage.zgt_yi) {
                                    return evt.card.storage.zgt_yi_colors || [];
                                }
                                evt = evt.parent;
                            }
                            return [];
                        },
                        mod: {
                            cardEnabled: function (card) {
                                if (get.position(card) == "h" && lib.skill.zgt_yi_block.getColors().contains(get.color(card))) return false;
                            },
                            cardEnabled2: function (card) {
                                if (get.position(card) == "h" && lib.skill.zgt_yi_block.getColors().contains(get.color(card))) return false;
                            },
                            cardRespondable: function (card) {
                                if (get.position(card) == "h" && lib.skill.zgt_yi_block.getColors().contains(get.color(card))) return false;
                            },
                            cardSavable: function (card) {
                                if (get.position(card) == "h" && lib.skill.zgt_yi_block.getColors().contains(get.color(card))) return false;
                            },
                        },
                    },
                    zgt_yi_black_effect: {
                        charlotte: true,
                        onremove: function (player) {
                            delete player.storage.zgt_yi_black_ids;
                        },
                        trigger: {
                            player: "useCardToPlayered",
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        filter: function (event, player) {
                            if (!event.target || event.target == player) return false;
                            var ids = player.storage.zgt_yi_black_ids || [];
                            var cards = event.cards || [];
                            if (!cards.length && event.getParent()) cards = event.getParent().cards || [];
                            for (var i = 0; i < cards.length; i++) {
                                if (ids.contains(cards[i].cardid)) return true;
                            }
                            return false;
                        },
                        content: function () {
                            trigger.target.addTempSkill("fengyin", { global: "phaseAfter" });
                        },
                    },
                    zgt_heng: {
                        audio: 'ext:手杀武将/apk/诸葛兔/audio:2',
                        enable: ["chooseToUse", "chooseToRespond"],
                        hiddenCard: function (player, name) {
                            if (player.hasSkill("zgt_heng_used")) return false;
                            if (name == "shan") {
                                return !player.hasCard(function (card) {
                                    return !get.tag(card, "damage");
                                }, "h");
                            }
                            if (name == "sha") {
                                return !player.hasCard(function (card) {
                                    return get.tag(card, "damage");
                                }, "h");
                            }
                            return false;
                        },
                        filter: function (event, player) {
                            if (player.hasSkill("zgt_heng_used")) return false;
                            var canShan = !player.hasCard(function (card) {
                                return !get.tag(card, "damage");
                            }, "h") && event.filterCard({ name: "shan", isCard: true }, player, event);
                            var canSha = !player.hasCard(function (card) {
                                return get.tag(card, "damage");
                            }, "h") && event.filterCard({ name: "sha", isCard: true }, player, event);
                            return canShan || canSha;
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var list = [];
                                if (!player.hasCard(function (card) {
                                    return !get.tag(card, "damage");
                                }, "h") && event.filterCard({ name: "shan", isCard: true }, player, event)) {
                                    list.push(["基本", "", "shan"]);
                                }
                                if (!player.hasCard(function (card) {
                                    return get.tag(card, "damage");
                                }, "h") && event.filterCard({ name: "sha", isCard: true }, player, event)) {
                                    list.push(["基本", "", "sha"]);
                                }
                                return ui.create.dialog("恒", [list, "vcard"]);
                            },
                            filter: function (button, player) {
                                var evt = _status.event.getParent();
                                return evt.filterCard({ name: button.link[2], isCard: true }, player, evt);
                            },
                            check: function (button) {
                                var player = _status.event.player;
                                if (_status.event.getParent().type != "phase") return 1;
                                return player.getUseValue({ name: button.link[2] });
                            },
                            backup: function (links) {
                                return {
                                    filterCard: function () {
                                        return false;
                                    },
                                    selectCard: -1,
                                    popname: true,
                                    viewAs: {
                                        name: links[0][2],
                                        isCard: true,
                                        storage: {
                                            zgt_heng: true,
                                        },
                                    },
                                    precontent: function () {
                                        player.logSkill("zgt_heng");
                                        player.addTempSkill("zgt_heng_used", "roundStart");
                                        if (event.result.card.name == "sha") event.getParent().addCount = false;
                                    },
                                };
                            },
                            prompt: function (links) {
                                return "视为使用或打出一张" + get.translation(links[0][2]);
                            },
                        },
                        mod: {
                            targetInRange: function (card) {
                                if (card.storage && card.storage.zgt_heng && card.name == "sha") return true;
                            },
                            cardUsable: function (card) {
                                if (card.storage && card.storage.zgt_heng && card.name == "sha") return Infinity;
                            },
                        },
                        ai: {
                            respondSha: true,
                            respondShan: true,
                            skillTagFilter: function (player, tag) {
                                if (player.hasSkill("zgt_heng_used")) return false;
                                if (tag == "respondShan") {
                                    return !player.hasCard(function (card) {
                                        return !get.tag(card, "damage");
                                    }, "h");
                                }
                                if (tag == "respondSha") {
                                    return !player.hasCard(function (card) {
                                        return get.tag(card, "damage");
                                    }, "h");
                                }
                            },
                        },
                    },
                    zgt_heng_used: {
                        charlotte: true,
                    },
                    zgt_lie: {
                        audio: 'ext:手杀武将/apk/诸葛兔/audio:2',
                        trigger: {
                            player: "useCardAfter",
                        },
                        direct: true,
                        filter: function (event) {
                            return event.card && get.type(event.card) == "basic";
                        },
                        getNum: function (player) {
                            var count = player.getHistory("useSkill", function (evt) {
                                return evt.skill == "zgt_lie" || evt.sourceSkill == "zgt_lie";
                            }).length;
                            return Math.min(5, count + 1);
                        },
                        content: function () {
                            "step 0";
                            event.num = lib.skill.zgt_lie.getNum(player);
                            player.chooseBool(get.prompt("zgt_lie"), "将手牌数调整至" + get.cnNumber(event.num) + "张").set("ai", function () {
                                var player = _status.event.player;
                                var num = _status.event.getParent().num;
                                return player.countCards("h") <= num || player.countCards("h") - num <= 2;
                            });
                            "step 1";
                            if (!result.bool) {
                                event.finish();
                                return;
                            }
                            player.logSkill("zgt_lie");
                            event.discardNum = player.countCards("h") - event.num;
                            if (event.discardNum > 0) {
                                player.chooseToDiscard("h", event.discardNum, true, "〖烈〗：将手牌数调整至" + get.cnNumber(event.num) + "张");
                            } else if (event.discardNum < 0) {
                                player.draw(-event.discardNum);
                                event.finish();
                            } else {
                                event.finish();
                            }
                            "step 2";
                            if (!result.bool || !result.cards || !result.cards.length) {
                                event.finish();
                                return;
                            }
                            player.chooseTarget("〖烈〗：是否对一名角色造成1点伤害？").set("ai", function (target) {
                                var player = _status.event.player;
                                return get.damageEffect(target, player, player);
                            });
                            "step 3";
                            if (result.bool && result.targets && result.targets.length) {
                                player.line(result.targets[0], "fire");
                                result.targets[0].damage(player);
                            }
                        },
                    },
                },
                translate: {
                    zgt_xing: "兴",
                    zgt_xing_info: "游戏开始时，你获得牌堆中所有牌名的能够指定目标的锦囊牌各一张，称为“兴”（不可使用或弃置且不计入手牌上限）。每回合限X次（X为你本回合使用伤害牌数），你造成伤害后，随机令一张“兴”可使用。若你手牌中没有不可使用的“兴”，你使用牌无距离次数限制且不可被响应。",
                    zgt_wan: "玩",
                    zgt_wan_info: "你使用锦囊牌后，可发动此技能。若此牌：1.与手牌中的“兴”牌名均不同，你令体力值唯一最小的角色回复1点体力；2.本局游戏仅你使用过此牌名的牌，你对一名角色造成1点火焰伤害。乘势：本次执行效果中的所有数字+1。",
                    zgt_yi: "义",
                    zgt_yi_info: "出牌阶段限一次，你可以令至多两名其他角色各交给你一张牌，然后你选择一项：1.将这些牌当【杀】对其中一名角色使用（不计入次数且无距离次数限制），此【杀】结算中，其不能使用与此【杀】转化前的牌相同颜色的手牌；2.将这些牌分配给未成为目标的角色，其使用因此获得的黑色牌指定其他角色为目标后，目标本回合非锁定技失效。",
                    zgt_heng: "恒",
                    zgt_heng_info: "每轮限一次，若你手牌中没有：1.非伤害牌，你可视为使用或打出一张【闪】；2.伤害牌，你可视为使用或打出一张不计入次数且无次数限制的【杀】。",
                    zgt_lie: "烈",
                    zgt_lie_info: "你使用基本牌后，你可将手牌数调整至X张（X为本回合本技能发动次数+1，且至多为5），若你因此弃置了牌，你可对一名角色造成1点伤害。",
                },
            },
            intro: "",
            author: "泣泪",
            diskURL: "",
            forumURL: "",
            version: "1.1",
        },
        files: {
            character: [],
            card: [],
            skill: [],
        },
    };
};
