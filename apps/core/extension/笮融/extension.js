import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib, game, ui, get, ai, _status) {
    
lib.changezerongForm = function(player, formType) {
    var map = {
        "black": ["zerong_mo", "zerong_mo", "【魔业降临】"],
        "red": ["zerong_fo", "zerong_fo", "【佛道金身】"],
        "double": ["zerong_shuang", "zerong_shuang", "【佛魔双生】"]
    };
    var data = map[formType];
    if(!data) return;
    
    var targetName = data[0];
    var imageName = data[1];
    var formText = data[2];
    var playerId = player.playerid;
    
    var currentHp = player.hp;
    var currentMaxHp = player.maxHp;
    var currentYe = player.getExpansions("futu_ye") || [];
    var yeBackup = currentYe.slice();
    if(lib.character[targetName]) {
        var charData = lib.character[targetName];
        for(var i = 0; i < charData[4].length; i++) {
            if(typeof charData[4][i] === 'string' && 
               (charData[4][i].startsWith('ext:') || charData[4][i].startsWith('db:'))) {
                charData[4][i] = "ext:笮融/" + imageName + ".jpg";
                break;
            }
        }
        charData[2] = currentMaxHp;
    }
    player.init(targetName);
    
    game.broadcastAll(function(pid, hp, maxHp) {
        setTimeout(function() {
            var p = game.playerMap[pid];
            if(p) {
                if(p.maxHp !== maxHp) p.maxHp = maxHp;
                if(p.hp !== hp) p.hp = hp;
                p.update();
            }
        }, 50);
    }, playerId, currentHp, currentMaxHp);
    
    game.broadcastAll(function(pid, yeCards) {
        setTimeout(function() {
            var p = game.playerMap[pid];
            if(p && yeCards.length > 0) {
                p.addToExpansion(yeCards, "silent").gaintag.add("futu_ye");
                p.storage.futu_ye = yeCards;
                var markSkillName = formType == "black" ? "futu_mo" : 
                                   formType == "red" ? "futu_fo" : "futu";
                p.markSkill(markSkillName);
            }
        }, 100);
    }, playerId, yeBackup);
    
    game.broadcastAll(function(pid, text) {
        setTimeout(function() {
            var p = game.playerMap[pid];
            if(p && text && p.$fullscreenpop) p.$fullscreenpop(text, "fire");
        }, 200);
    }, playerId, formText);
    
    player.storage.zerong_form = formType;
    player.syncStorage("zerong_form");
};
    return {
        name: "笮融",
        connect: true,
        content: function(config, pack) {},
        precontent: function() {
            game.import('character', function(lib, game, ui, get, ai, _status) {
                var zerongPack = {
                    name: 'zerongPack',
                    connect: true,
                    character: {},
                    skill: {},
                    translate: {}
                };
                
                // 基础形态
                zerongPack.character.zerong_base = ["male", "qun", 4, 
                    ["futu", "jingtu_base", "jiebian"], 
                    ["ext:笮融/zerong.jpg", "die:笮融/audio/die"]
                ];
                // 标记维护：每回合开始和结束检测标记是否存在，若消失立即恢复
                zerongPack.skill._zerong_markCheck = {
                    trigger: { player: ["phaseBegin", "phaseEnd"] },
                    forced: true,
                    popup: false,
                    silent: true,
                    firstDo: true,
                    content: function() {
                        if(player.hasSkill("futu")) player.markSkill("futu");
                        if(player.hasSkill("futu_mo")) player.markSkill("futu_mo");
                        if(player.hasSkill("futu_fo")) player.markSkill("futu_fo");
                    }
                };
                
                // 浮图（新机制：回合结束统计全场，你作为伤害/回复来源次数最多时获得1张对应业）
                zerongPack.skill.futu = {
                    audio: "ext:笮融/audio/skill/基础:8",
                    trigger: { global: "phaseEnd" },
                    forced: true,
                    locked: true,
                    marktext: "业",
                    mark: true,
                    init: function(player) {
                        if(typeof player.storage.futu_ye !== "object") player.storage.futu_ye = [];
                        setTimeout(function(){ player.markSkill("futu"); }, 0);
                    },
filter: function(event, player) {
                        var myDamage = player.storage.futu_damage_count || 0;
                        var myRecover = player.storage.futu_recover_count || 0;
                        return (myDamage > 0 || myRecover > 0);
                    },
                    content: function() {
                        "step 0"
                        var myDamageCount = player.storage.futu_damage_count || 0;
                        var myRecoverCount = player.storage.futu_recover_count || 0;
                        event.getBlack = false;
                        event.getRed = false;
                        
                        var maxDamage = myDamageCount;
                        var maxRecover = myRecoverCount;
                        game.countPlayer(function(p) {
                            var d = p.storage.futu_damage_count || 0;
                            if(d > maxDamage) maxDamage = d;
                            var r = p.storage.futu_recover_count || 0;
                            if(r > maxRecover) maxRecover = r;
                        });
                        
                        if(myDamageCount > 0 && myDamageCount >= maxDamage) event.getBlack = true;
                        if(myRecoverCount > 0 && myRecoverCount >= maxRecover) event.getRed = true;
                        
                        event.cards = [];
                        
                        "step 1"
                        if(event.getBlack) {
                            var card = get.cards(1)[0];
                            var count = 0;
                            while(card && get.color(card) != "black" && count < 20) {
                                ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                card = get.cards(1)[0];
                                count++;
                            }
                            if(card && get.color(card) == "black") {
                                event.cards.push(card);
                                player.chat("浮图：本回合造成伤害次数最多，获得魔业：" + get.translation(card));
                            } else {
                                if(card) ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                var suits = ["spade", "club"];
                                var suit = suits[Math.floor(Math.random() * suits.length)];
                                var number = Math.floor(Math.random() * 13) + 1;
                                var names = ["sha", "juedou", "guohe"];
                                var newCard = game.createCard(names[Math.floor(Math.random() * names.length)], suit, number);
                                event.cards.push(newCard);
                                player.chat("浮图：获得魔业（生成）：" + get.translation(newCard));
                            }
                        }
                        
                        "step 2"
                        if(event.getRed) {
                            var card = get.cards(1)[0];
                            var count = 0;
                            while(card && get.color(card) != "red" && count < 20) {
                                ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                card = get.cards(1)[0];
                                count++;
                            }
                            if(card && get.color(card) == "red") {
                                event.cards.push(card);
                                player.chat("浮图：本回合造成回复次数最多，获得佛业：" + get.translation(card));
                            } else {
                                if(card) ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                var suits = ["heart", "diamond"];
                                var suit = suits[Math.floor(Math.random() * suits.length)];
                                var number = Math.floor(Math.random() * 13) + 1;
                                var names = ["tao", "shan", "wuzhong"];
                                var newCard = game.createCard(names[Math.floor(Math.random() * names.length)], suit, number);
                                event.cards.push(newCard);
                                player.chat("浮图：获得佛业（生成）：" + get.translation(newCard));
                            }
                        }
                        
                        "step 3"
                        if(event.cards.length > 0) {
                            for(var i = 0; i < event.cards.length; i++) {
                                player.storage.futu_ye.push(event.cards[i]);
                            }
                            var next = player.addToExpansion(event.cards, "draw");
                            if(next && next.gaintag) next.gaintag.add("futu_ye");
                            player.syncStorage("futu_ye");
                        }
                        player.markSkill("futu");
                        
                        game.countPlayer(function(p) {
                            p.storage.futu_damage_count = 0;
                            p.storage.futu_recover_count = 0;
                        });
                    },
                                intro: {
                        mark: function(dialog, storage, player) {
                            var yeCards = player.getExpansions("futu_ye");
                            if(!yeCards || yeCards.length === 0) {
                                dialog.addText("当前无业");
                            } else {
                                var blackCount = yeCards.filter(c => get.color(c) == "black").length;
                                var redCount = yeCards.filter(c => get.color(c) == "red").length;
                                dialog.addText("魔业：" + blackCount + "张，佛业：" + redCount + "张");
                                dialog.addSmall(yeCards);
                            }
                        },
                        content: function(storage, player) {
                            var yeCards = player.getExpansions("futu_ye");
                            if(!yeCards || yeCards.length === 0) return "当前无业";
                            var blackCount = yeCards.filter(c => get.color(c) == "black").length;
                            var redCount = yeCards.filter(c => get.color(c) == "red").length;
                            return "魔业：" + blackCount + "张，佛业：" + redCount + "张";
                        }
                    },
                    onremove: function(player) {},
                    group: ["futu_damageCounter", "futu_recoverCounter", "futu_defend", "_zerong_markCheck"]
                };
                
                // 浮图子技能：记录伤害次数
                zerongPack.skill.futu_damageCounter = {
                    trigger: { source: "damageEnd" },
                    silent: true,
                    content: function() {
                        if(typeof player.storage.futu_damage_count !== "number") player.storage.futu_damage_count = 0;
                        player.storage.futu_damage_count++;
                    }
                };
                
                // 浮图子技能：记录回复次数
                zerongPack.skill.futu_recoverCounter = {
                    trigger: { source: "recoverEnd" },
                    silent: true,
                    content: function() {
                        if(typeof player.storage.futu_recover_count !== "number") player.storage.futu_recover_count = 0;
                        player.storage.futu_recover_count++;
                    }
                };
                // 浮图防御：受到伤害时可弃置业防止
                zerongPack.skill.futu_defend = {
                    audio: "futu",
                    trigger: { player: "damageBegin4" },
                    filter: function(event, player) {
                        return player.getExpansions("futu_ye").length > 0;
                    },
                    content: function() {
                        "step 0"
                        var yeCards = player.getExpansions("futu_ye");
                        var hasBlack = false, hasRed = false;
                        for(var i = 0; i < yeCards.length; i++) {
                            if(yeCards[i]) {
                                if(get.color(yeCards[i]) == "black") hasBlack = true;
                                else hasRed = true;
                            }
                        }
                        var list = [];
                        if(hasBlack) list.push("魔业（黑）");
                        if(hasRed) list.push("佛业（红）");
                        list.push("cancel2");
                        player.chooseControl(list).set("prompt", "是否弃置一张「业」防止伤害？");
                        
                        "step 1"
                        if(result.control != "cancel2") {
                            var color = result.control == "魔业（黑）" ? "black" : "red";
                            var toDiscard = null;
                            var yeCards = player.getExpansions("futu_ye");
                            for(var i = 0; i < yeCards.length; i++) {
                                if(yeCards[i] && get.color(yeCards[i]) == color) {
                                    toDiscard = yeCards[i];
                                    break;
                                }
                            }
                            if(toDiscard) {
                                player.discard(toDiscard);
                                if(player.storage.futu_ye) player.storage.futu_ye.remove(toDiscard);
                                player.syncStorage("futu_ye");
                                if(player.getExpansions("futu_ye").length == 0) {
                                    if(player.hasSkill("futu")) player.unmarkSkill("futu");
                                    if(player.hasSkill("futu_mo")) player.unmarkSkill("futu_mo");
                                    if(player.hasSkill("futu_fo")) player.unmarkSkill("futu_fo");
                                }
                                trigger.cancel();
                                player.logSkill("futu_defend");
                            }
                        }
                    }
                };
                // 净土抉择（弃置异色业，获得所有同色业）
                zerongPack.skill.jingtu_base = {
                    audio: "ext:笮融/audio/skill/基础:6",
                    enable: "phaseUse",
                    limited: true,
                    skillAnimation: true,
                    animationStr: "净土",
                    animationColor: "thunder",
                    filter: function(event, player) {
                        return player.getExpansions("futu_ye").length > 0;
                    },
                    content: function() {
                        "step 0"
                        var yeCards = player.getExpansions("futu_ye");
                        var blackCount = 0, redCount = 0;
                        for(var i = 0; i < yeCards.length; i++) {
                            if(get.color(yeCards[i]) == "black") blackCount++;
                            else redCount++;
                        }
                        event.blackCount = blackCount;
                        event.redCount = redCount;
                        event.canBeishui = (blackCount == redCount && blackCount > 1);
                        
                        var choices = [];
                        if(blackCount > 0) choices.push("魔道");
                        if(redCount > 0) choices.push("佛道");
                        if(event.canBeishui) choices.push("背水（佛魔双生）");
                        choices.push("cancel2");
                        
                        player.chooseControl(choices).set("prompt", "选择要执行的净土之道");
                        
                        "step 1"
                        if(result.control == "cancel2") {
                            event.finish();
                            return;
                        }
                        player.awakenSkill("jingtu_base");
                        event.choice = result.control;
                        
                        var allYeCards = player.getExpansions("futu_ye");
                        event.blackCards = [];
                        event.redCards = [];
                        for(var i = 0; i < allYeCards.length; i++) {
                            if(get.color(allYeCards[i]) == "black") event.blackCards.push(allYeCards[i]);
                            else event.redCards.push(allYeCards[i]);
                        }
                        
                        if(event.choice.indexOf("魔道") >= 0 || event.choice.indexOf("背水") >= 0) {
                            if(event.blackCards.length > 0) {
                                player.chooseTarget("选择【魔道】伤害目标（" + event.blackCards.length + "点伤害）", true)
                                    .set("ai", function(target) { return -get.attitude(player, target); });
                            } else event.goto(3);
                        } else event.goto(3);
                        
                        "step 2"
                        if(result.targets && result.targets[0]) event.motaTarget = result.targets[0];
                        "step 3"
                        if((event.choice.indexOf("佛道") >= 0 || event.choice.indexOf("背水") >= 0) && event.redCards.length > 0) {
                            player.chooseTarget("选择【佛道】辅助目标（回复" + event.redCards.length + "点并加" + event.redCards.length + "点上限）", true)
                                .set("ai", function(target) { return get.attitude(player, target); });
                        } else event.goto(5);
                        
                        "step 4"
                        if(result.targets && result.targets[0]) event.fodaoTarget = result.targets[0];
                        
                        "step 5"
                        var formType = "base";
                        if(event.choice.indexOf("背水") >= 0) formType = "double";
                        else if(event.choice.indexOf("魔道") >= 0) formType = "black";
                        else if(event.choice.indexOf("佛道") >= 0) formType = "red";
                        
                        if((event.choice.indexOf("魔道") >= 0 || event.choice.indexOf("背水") >= 0) && event.motaTarget && event.blackCards.length > 0) {
                            if(event.redCards.length > 0) {
                                player.discard(event.redCards);
                                player.chat("弃置" + event.redCards.length + "张佛业");
                            }
                            player.gain(event.blackCards, "gain2");
                            player.chat("获得" + event.blackCards.length + "张魔业，对" + get.translation(event.motaTarget) + "造成" + event.blackCards.length + "点伤害");
                            event.motaTarget.damage(event.blackCards.length);
                        }
                        
                        if((event.choice.indexOf("佛道") >= 0 || event.choice.indexOf("背水") >= 0) && event.fodaoTarget && event.redCards.length > 0) {
                            if(event.choice.indexOf("魔道") < 0 && event.blackCards.length > 0) {
                                player.discard(event.blackCards);
                                player.chat("弃置" + event.blackCards.length + "张魔业");
                            }
                            player.gain(event.redCards, "gain2");
                            player.chat("获得" + event.redCards.length + "张佛业，令" + get.translation(event.fodaoTarget) + "回复" + event.redCards.length + "点体力并增加" + event.redCards.length + "点上限");
                            event.fodaoTarget.recover(event.redCards.length);
                            event.fodaoTarget.gainMaxHp(event.redCards.length);
                        }
                        
                        player.storage.futu_ye = [];
                        player.unmarkSkill("futu");
                        lib.changezerongForm(player, formType);
                    },
                    ai: {
                        order: 8,
                        result: { player: function(player) { return (player.getExpansions("futu_ye").length >= 2) ? 1 : 0; } }
                    }
                };
                // 基础劫辨
                zerongPack.skill.jiebian = {
                    audio: "ext:笮融/audio/skill/基础:2",
                    trigger: { global: "phaseUseEnd" },
                    filter: function(event, player) {
                        var hasDamagedThisTurn = game.hasPlayer(function(current) {
                            return current.getStat().damaged > 0;
                        });
                        if(hasDamagedThisTurn) return false;
                        var hasYe = player.getExpansions("futu_ye").length > 0;
                        var hasHand = player.countCards("h") > 0;
                        if(!hasYe && !hasHand) return false;
                        if(event.player != player) return true;
                        return game.hasPlayer(function(p) {
                            return p != player && p.isMinHp();
                        });
                    },
                    content: function() {
                        "step 0"
                        var current = trigger.player;
                        var targets = [];
                        if(current != player) targets.push(current);
                        game.countPlayer(function(p) {
                            if(p != player && p.isMinHp() && !targets.includes(p)) targets.push(p);
                        });
                        if(targets.length == 0) {
                            event.finish();
                            return;
                        }
                        player.chooseTarget("劫辨：选择一名角色拼点", true, function(card, player, target) {
                            return targets.includes(target);
                        }).set("ai", function(target) {
                            return -get.attitude(player, target);
                        });
                        
                        "step 1"
                        if(!result.targets || result.targets.length == 0) {
                            event.finish();
                            return;
                        }
                        event.target = result.targets[0];
                        var yeCards = player.getExpansions("futu_ye");
                        event.originalYeCards = [];
                        for(var i = 0; i < yeCards.length; i++) {
                            var c = yeCards[i];
                            event.originalYeCards.push(c);
                            c._isYeCard = true;
                        }
                        if(yeCards.length > 0) {
                            player.gain(yeCards, "silent");
                            for(var i = 0; i < yeCards.length; i++) {
                                yeCards[i].addGaintag("futu_ye");
                            }
                        }
                        player.chooseToCompare(event.target);
                        
                        "step 2"
                        var myCard = null;
                        if(result && result.pindian) myCard = result.pindian.card1;
                        if(event.originalYeCards && event.originalYeCards.length > 0) {
                            var returnCards = [];
                            var usedYe = false;
                            for(var i = 0; i < event.originalYeCards.length; i++) {
                                var c = event.originalYeCards[i];
                                if(c == myCard) {
                                    usedYe = true;
                                    if(player.storage.futu_ye) player.storage.futu_ye.remove(c);
                                } else {
                                    if(player.getCards("h").includes(c)) returnCards.push(c);
                                    else if(player.storage.futu_ye) player.storage.futu_ye.remove(c);
                                }
                                delete c._isYeCard;
                            }
                            if(returnCards.length > 0) {
                                for(var i = 0; i < returnCards.length; i++) {
                                    returnCards[i].removeGaintag("futu_ye");
                                }
                                player.addToExpansion(returnCards, "silent").gaintag.add("futu_ye");
                            }
                            if(usedYe && myCard) player.discard(myCard);
                            player.syncStorage("futu_ye");
                            if(player.getExpansions("futu_ye").length == 0) player.unmarkSkill("futu");
                        }
                        if(!result || !result.bool) {
                            event.finish();
                            return;
                        }
                        player.chooseControl("造成伤害", "回复并拿牌")
                            .set("prompt", "劫辨：拼点胜利，选择一项")
                            .set("ai", function() {
                                return get.attitude(player, event.target) < 0 ? "造成伤害" : "回复并拿牌";
                            });
                        
                        "step 3"
                        player.logSkill("jiebian");
                        if(result.control == "造成伤害") {
                            event.target.damage();
                        } else {
                            event.target.recover();
                            event.target.draw();
                            if(event.target.countCards("he") > 0) player.gainPlayerCard(event.target, "he", 2, true);
                        }
                    },
                    ai: { expose: 0.3 }
                };
                // 魔业形态
                zerongPack.character.zerong_mo = ["male", "qun", 4, 
                    ["futu_mo", "xiumo", "mozong"], 
                    ["ext:笮融/zerong_mo.jpg", "die:笮融/audio/die"]
                ];
                // 魔图：回合结束若你造成伤害次数全场最多，获得1张魔业
                zerongPack.skill.futu_mo = {
                    audio: "ext:笮融/audio/skill/魔:8",
                    trigger: { global: "phaseEnd" },
                    forced: true,
                    locked: true,
                    marktext: "魔",
                    mark: true,
                    init: function(player) {
                        if(typeof player.storage.futu_ye !== "object") player.storage.futu_ye = [];
                        setTimeout(function(){ player.markSkill("futu_mo"); }, 0);
                    },
                    filter: function(event, player) {
                        var myDamage = player.storage.futu_damage_count || 0;
                        if(myDamage == 0) return false;
                        var maxDamage = myDamage;
                        game.countPlayer(function(p) {
                            var d = p.storage.futu_damage_count || 0;
                            if(d > maxDamage) maxDamage = d;
                        });
                        return myDamage >= maxDamage;
                    },
                    content: function() {
                        "step 0"
                        var card = get.cards(1)[0];
                        if(card && get.color(card) == "black") {
                            player.storage.futu_ye.push(card);
                            player.addToExpansion(card, "draw").gaintag.add("futu_ye");
                        } else {
                            if(card) ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                            var suits = ["spade", "club"];
                            var suit = suits[Math.floor(Math.random() * suits.length)];
                            var number = Math.floor(Math.random() * 13) + 1;
                            var newCard = game.createCard(["sha","juedou","guohe"][Math.floor(Math.random()*3)], suit, number);
                            player.storage.futu_ye.push(newCard);
                            player.addToExpansion(newCard, "draw").gaintag.add("futu_ye");
                        }
                        player.syncStorage("futu_ye");
                        player.chat("魔图：本回合造成伤害次数最多，获得1张魔业");
                        player.markSkill("futu_mo");
                        
                        game.countPlayer(function(p) {
                            p.storage.futu_damage_count = 0;
                            p.storage.futu_recover_count = 0;
                        });
                    },
                    intro: {
                        mark: function(dialog, storage, player) {
                            var yeCards = player.getExpansions("futu_ye");
                            if(!yeCards || yeCards.length === 0) {
                                dialog.addText("当前无业");
                            } else {
                                dialog.addText("当前拥有「魔业」：" + yeCards.length + "张");
                                dialog.addSmall(yeCards);
                            }
                        },
                        content: function(storage, player) {
                            var yeCards = player.getExpansions("futu_ye");
                            var count = yeCards ? yeCards.length : 0;
                            return "当前拥有「魔业」：" + count + "张";
                        }
                    },
                    onremove: function(player) {},
                    group: ["futu_damageCounter", "futu_defend", "mozong_damage", "_zerong_markCheck"]
                };
                // 修魔（拼点成功只能造成1点伤害）
                zerongPack.skill.xiumo = {
                    audio: "ext:笮融/audio/skill/魔:2",
                    trigger: { global: "phaseUseEnd" },
                    filter: function(event, player) {
                        if(game.hasPlayer(function(current) { return current.getStat().damaged > 0; })) return false;
                        var hasYe = player.getExpansions("futu_ye").length > 0;
                        var hasHand = player.countCards("h") > 0;
                        if(!hasYe && !hasHand) return false;
                        if(event.player != player) return true;
                        return game.hasPlayer(function(p) { return p != player && p.isMinHp(); });
                    },
                    content: function() {
                        "step 0"
                        var targets = [];
                        if(trigger.player != player) targets.push(trigger.player);
                        game.countPlayer(function(p) {
                            if(p != player && p.isMinHp() && !targets.includes(p)) targets.push(p);
                        });
                        player.chooseTarget("修魔：选择一名角色拼点", true, function(card, player, target) {
                            return targets.includes(target);
                        }).set("ai", function(target) { return -get.attitude(player, target); });
                        
                        "step 1"
                        if(!result.targets || result.targets.length == 0) {
                            event.finish();
                            return;
                        }
                        event.target = result.targets[0];
                        var yeCards = player.getExpansions("futu_ye");
                        event.originalYeCards = [];
                        for(var i = 0; i < yeCards.length; i++) {
                            var c = yeCards[i];
                            event.originalYeCards.push(c);
                            c._isYeCard = true;
                        }
                        if(yeCards.length > 0) {
                            player.gain(yeCards, "silent");
                            for(var i = 0; i < yeCards.length; i++) {
                                yeCards[i].addGaintag("futu_ye");
                            }
                        }
                        player.chooseToCompare(event.target);
                        
                        "step 2"
                        var myCard = result.pindian ? result.pindian.card1 : null;
                        if(event.originalYeCards && event.originalYeCards.length > 0) {
                            var returnCards = [];
                            var usedYe = false;
                            for(var i = 0; i < event.originalYeCards.length; i++) {
                                var c = event.originalYeCards[i];
                                if(c == myCard) {
                                    usedYe = true;
                                    if(player.storage.futu_ye) player.storage.futu_ye.remove(c);
                                } else {
                                    if(player.getCards("h").includes(c)) returnCards.push(c);
                                    else if(player.storage.futu_ye) player.storage.futu_ye.remove(c);
                                }
                                delete c._isYeCard;
                            }
                            if(returnCards.length > 0) {
                                for(var i = 0; i < returnCards.length; i++) {
                                    returnCards[i].removeGaintag("futu_ye");
                                }
                                player.addToExpansion(returnCards, "silent").gaintag.add("futu_ye");
                            }
                            if(usedYe && myCard) player.discard(myCard);
                            player.syncStorage("futu_ye");
                            if(player.getExpansions("futu_ye").length == 0) player.unmarkSkill("futu_mo");
                        }
                        if(!result || !result.bool) {
                            event.finish();
                            return;
                        }
                        "step 3"
                        player.logSkill("xiumo");
                        event.target.damage();
                    },
                    ai: { expose: 0.3 }
                };
                 // 魔宗
                zerongPack.skill.mozong = {
                    audio: "ext:笮融/audio/skill/魔:2",
                    init: function(player) { player.storage.jingtu_color = "black"; },
                    mod: {
                        maxHandcard: function(player, num) {
                            var excludeCount = 0;
                            var handcards = player.getCards("h");
                            for(var i = 0; i < handcards.length; i++) {
                                if(get.color(handcards[i]) == "black") excludeCount++;
                            }
                            return num + excludeCount;
                        }
                    }
                };
                
                zerongPack.skill.mozong_damage = {
                    audio: "fozong",
                    trigger: { source: "damageBegin" },
                    forced: true,
                    filter: function(event, player) { return event.card && get.color(event.card) == "black"; },
                    content: function() { trigger.num++; }
                };
                // 佛道形态
                zerongPack.character.zerong_fo = ["male", "qun", 4, 
                    ["futu_fo", "jiangfo", "fozong_heal"], 
                    ["ext:笮融/zerong_fo.jpg", "die:笮融/audio/die"]
                ];
                
                // 佛图：回合结束若你造成回复次数全场最多，获得1张佛业
                zerongPack.skill.futu_fo = {
                    audio: "ext:笮融/audio/skill/佛:8",
                    trigger: { global: "phaseEnd" },
                    forced: true,
                    locked: true,
                    marktext: "佛",
                    mark: true,
                    init: function(player) {
                        if(typeof player.storage.futu_ye !== "object") player.storage.futu_ye = [];
                        setTimeout(function(){ player.markSkill("futu_fo"); }, 0);
                    },
                    filter: function(event, player) {
                        var myRecover = player.storage.futu_recover_count || 0;
                        if(myRecover == 0) return false;
                        var maxRecover = myRecover;
                        game.countPlayer(function(p) {
                            var r = p.storage.futu_recover_count || 0;
                            if(r > maxRecover) maxRecover = r;
                        });
                        return myRecover >= maxRecover;
                    },
                    content: function() {
                        "step 0"
                        var card = get.cards(1)[0];
                        if(card && get.color(card) == "red") {
                            player.storage.futu_ye.push(card);
                            player.addToExpansion(card, "draw").gaintag.add("futu_ye");
                        } else {
                            if(card) ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                            var suits = ["heart", "diamond"];
                            var suit = suits[Math.floor(Math.random() * suits.length)];
                            var number = Math.floor(Math.random() * 13) + 1;
                            var newCard = game.createCard(["tao","shan","wuzhong"][Math.floor(Math.random()*3)], suit, number);
                            player.storage.futu_ye.push(newCard);
                            player.addToExpansion(newCard, "draw").gaintag.add("futu_ye");
                        }
                        player.syncStorage("futu_ye");
                        player.chat("佛图：本回合造成回复次数最多，获得1张佛业");
                        player.markSkill("futu_fo");
                        
                        game.countPlayer(function(p) {
                            p.storage.futu_damage_count = 0;
                            p.storage.futu_recover_count = 0;
                        });
                    },
                    intro: {
                        mark: function(dialog, storage, player) {
                            var yeCards = player.getExpansions("futu_ye");
                            if(!yeCards || yeCards.length === 0) {
                                dialog.addText("当前无业");
                            } else {
                                dialog.addText("当前拥有「佛业」：" + yeCards.length + "张");
                                dialog.addSmall(yeCards);
                            }
                        },
                        content: function(storage, player) {
                            var yeCards = player.getExpansions("futu_ye");
                            var count = yeCards ? yeCards.length : 0;
                            return "当前拥有「佛业」：" + count + "张";
                        }
                    },
                    onremove: function(player) {},
                    group: ["futu_recoverCounter", "futu_defend", "fozong_recover", "_zerong_markCheck"]
                };
                 // 讲佛（拼点成功：对方回复1点，摸1张，你获得其两张牌）
                zerongPack.skill.jiangfo = {
                    audio: "ext:笮融/audio/skill/佛:2",
                    trigger: { global: "phaseUseEnd" },
                    filter: function(event, player) {
                        if(game.hasPlayer(function(current) { return current.getStat().damaged > 0; })) return false;
                        var hasYe = player.getExpansions("futu_ye").length > 0;
                        var hasHand = player.countCards("h") > 0;
                        if(!hasYe && !hasHand) return false;
                        if(event.player != player) return true;
                        return game.hasPlayer(function(p) { return p != player && p.isMinHp(); });
                    },
                    content: function() {
                        "step 0"
                        var targets = [];
                        if(trigger.player != player) targets.push(trigger.player);
                        game.countPlayer(function(p) {
                            if(p != player && p.isMinHp() && !targets.includes(p)) targets.push(p);
                        });
                        player.chooseTarget("讲佛：选择一名角色拼点", true, function(card, player, target) {
                            return targets.includes(target);
                        }).set("ai", function(target) { return get.attitude(player, target); });
                        
                        "step 1"
                        if(!result.targets || result.targets.length == 0) {
                            event.finish();
                            return;
                        }
                        event.target = result.targets[0];
                        var yeCards = player.getExpansions("futu_ye");
                        event.originalYeCards = [];
                        for(var i = 0; i < yeCards.length; i++) {
                            var c = yeCards[i];
                            event.originalYeCards.push(c);
                            c._isYeCard = true;
                        }
                        if(yeCards.length > 0) {
                            player.gain(yeCards, "silent");
                            for(var i = 0; i < yeCards.length; i++) {
                                yeCards[i].addGaintag("futu_ye");
                            }
                        }
                        player.chooseToCompare(event.target);
                        
                        "step 2"
                        var myCard = result.pindian ? result.pindian.card1 : null;
                        if(event.originalYeCards && event.originalYeCards.length > 0) {
                            var returnCards = [];
                            var usedYe = false;
                            for(var i = 0; i < event.originalYeCards.length; i++) {
                                var c = event.originalYeCards[i];
                                if(c == myCard) {
                                    usedYe = true;
                                    if(player.storage.futu_ye) player.storage.futu_ye.remove(c);
                                } else {
                                    if(player.getCards("h").includes(c)) returnCards.push(c);
                                    else if(player.storage.futu_ye) player.storage.futu_ye.remove(c);
                                }
                                delete c._isYeCard;
                            }
                            if(returnCards.length > 0) {
                                for(var i = 0; i < returnCards.length; i++) {
                                    returnCards[i].removeGaintag("futu_ye");
                                }
                                player.addToExpansion(returnCards, "silent").gaintag.add("futu_ye");
                            }
                            if(usedYe && myCard) player.discard(myCard);
                            player.syncStorage("futu_ye");
                            if(player.getExpansions("futu_ye").length == 0) player.unmarkSkill("futu_fo");
                        }
                        if(!result || !result.bool) {
                            event.finish();
                            return;
                        }
                        "step 3"
                        player.logSkill("jiangfo");
                        event.target.recover();
                        event.target.draw();
                        if(event.target.countCards("he") > 0) player.gainPlayerCard(event.target, "he", 2, true);
                    },
                    ai: { expose: 0.3 }
                };
                // 佛宗
                zerongPack.skill.fozong_heal = {
                    audio: "ext:笮融/audio/skill/佛:2",
                    init: function(player) { player.storage.jingtu_color = "red"; },
                    mod: {
                        maxHandcard: function(player, num) {
                            var excludeCount = 0;
                            var handcards = player.getCards("h");
                            for(var i = 0; i < handcards.length; i++) {
                                if(get.color(handcards[i]) == "red") excludeCount++;
                            }
                            return num + excludeCount;
                        }
                    }
                };
                
                zerongPack.skill.fozong_recover = {
                    audio: "fozong",
                    trigger: { player: "recoverBegin" },
                    forced: true,
                    filter: function(event, player) { return event.card && get.color(event.card) == "red"; },
                    content: function() { trigger.num++; }
                };
                // 佛魔双生
                zerongPack.character.zerong_shuang = ["male", "qun", 4, 
                    ["jiebian", "fozong_shuang"], 
                    ["ext:笮融/zerong_shuang.jpg", "die:笮融/audio/die"]
                ];
                  zerongPack.skill.fozong_shuang = {
                    audio: "ext:笮融/audio/skill/双生:2",
                    init: function(player) { player.storage.jingtu_color = "double"; },
                    mod: {
                        maxHandcard: function(player, num) { return num + player.countCards("h"); }
                    },
                    group: ["fozong_shuang_damage", "fozong_shuang_recover"]
                };
                
                zerongPack.skill.fozong_shuang_damage = {
                    audio: "fozong",
                    trigger: { source: "damageBegin" },
                    forced: true,
                    content: function() { trigger.num++; }
                };
                
                zerongPack.skill.fozong_shuang_recover = {
                    audio: "fozong",
                    trigger: { player: "recoverBegin" },
                    forced: true,
                    content: function() { trigger.num++; }
                };
                // 死亡重置
                zerongPack.skill._zerong_dieReset = {
                    trigger: { player: "dieBegin" },
                    filter: function(event, player) {
                        return player.name && player.name.indexOf("zerong_") == 0 && player.name != "zerong_base";
                    },
                    content: function() {
                        game.broadcastAll(function(player) {
                            player.node.avatar.setBackground("ext:笮融/zerong.jpg", "character");
                            if(player.node.avatar2) player.node.avatar2.setBackground("ext:笮融/zerong.jpg", "character");
                        }, player);
                        
                        var yeCards = player.getExpansions("futu_ye");
                        if(yeCards.length > 0) player.loseToDiscardpile(yeCards);
                        delete player.storage.futu_ye;
                        delete player.storage.futu_damage_count;
                        delete player.storage.futu_recover_count;
                        delete player.storage.zerong_form;
                        
                        player.syncStorage("futu_ye");
                        player.unmarkSkill("futu");
                        player.unmarkSkill("futu_mo");
                        player.unmarkSkill("futu_fo");
                    }
                };
                    // 翻译部分
                zerongPack.translate.zerong_base = "笮融";
                zerongPack.translate.zerong_base_info = "佛魔双生·基础形态，拥有【浮图】【劫辨】【净土】，可通过净土切换形态";
                zerongPack.translate.zerong_mo = "笮融·魔";
                zerongPack.translate.zerong_mo_info = "魔业形态，【魔图】回合结束若你造成伤害次数全场最多获得1张魔业，使用黑色牌伤害+1";
                zerongPack.translate.zerong_fo = "笮融·佛";
                zerongPack.translate.zerong_fo_info = "佛道形态，【佛图】回合结束若你造成回复次数全场最多获得1张佛业，使用红色牌回复+1";
                zerongPack.translate.zerong_shuang = "笮融·双生";
                zerongPack.translate.zerong_shuang_info = "完全体形态，所有手牌不计入手牌上限，伤害与回复均+1";
                
                zerongPack.translate.futu = "浮图";
                zerongPack.translate.futu_info = "锁定技，任意角色回合结束时，若本回合你对其他角色造成伤害的次数为全场最多，你获得1张黑色牌置为「业」（魔业）；若本回合你对其他角色造成回复的次数为全场最多，你获得1张红色牌置为「业」（佛业）。可同时获得。当你受到伤害时，可弃置一张「业」防止之。";
                zerongPack.translate.futu_defend = "浮图·御";
                zerongPack.translate.jingtu_base = "净土";
                zerongPack.translate.jingtu_base_info = "限定技，出牌阶段，若你有「业」，你可选择：魔道（弃置所有佛业，获得所有魔业并造成伤害）；佛道（弃置所有魔业，获得所有佛业并回复体力）；背水（若黑业=红业且均大于1，切换为双生形态，同时执行两项）。";
                zerongPack.translate.jiebian = "劫辨";
                zerongPack.translate.jiebian_info = "一名角色的出牌阶段结束时，若本回合没有角色受到过伤害，你可与当前回合角色或体力值最低的角色拼点（可用「业」作为拼点牌）。若你赢，选择一项：1.对其造成1点伤害；2.令其回复1点体力并摸1张牌，然后你获得其两张牌。";
                
                zerongPack.translate.futu_mo = "魔图";
                zerongPack.translate.futu_mo_info = "锁定技，任意角色回合结束时，若本回合你对其他角色造成伤害的次数为全场最多，你获得1张黑色「业」。当你受到伤害时，可弃置一张「业」防止之。";
                zerongPack.translate.xiumo = "修魔";
                zerongPack.translate.xiumo_info = "一名角色的出牌阶段结束时，若本回合没有角色受到过伤害，你可与当前回合角色或体力值最低的角色拼点（可用「业」作为拼点牌）。若你赢，对其造成1点伤害。";
                zerongPack.translate.mozong = "魔宗";
                zerongPack.translate.mozong_info = "锁定技，你的手牌中，黑色牌不计入手牌上限；你使用黑色牌造成的伤害+1。";
                
                zerongPack.translate.futu_fo = "佛图";
                zerongPack.translate.futu_fo_info = "锁定技，任意角色回合结束时，若本回合你对其他角色造成回复的次数为全场最多，你获得1张红色「业」。当你受到伤害时，可弃置一张「业」防止之。";
                zerongPack.translate.jiangfo = "讲佛";
                zerongPack.translate.jiangfo_info = "一名角色的出牌阶段结束时，若本回合没有角色受到过伤害，你可与当前回合角色或体力值最低的角色拼点（可用「业」作为拼点牌）。若你赢，令该角色回复1点体力并摸一张牌，然后你获得其两张牌。";
                zerongPack.translate.fozong_heal = "佛宗";
                zerongPack.translate.fozong_heal_info = "锁定技，你的手牌中，红色牌不计入手牌上限；你使用红色牌回复的体力值+1。";
                
                zerongPack.translate.fozong_shuang = "双生佛魔";
                zerongPack.translate.fozong_shuang_info = "锁定技，你的手牌均不计入手牌上限；你造成的伤害与回复的体力值均+1。";
                
                return zerongPack;
            });
            
            lib.config.all.characters.push('zerongPack');
            if(!lib.config.characters.contains('zerongPack')) lib.config.characters.push('zerongPack');
            lib.translate.zerongPack_character_config = '笮融';
        },
        config: {},
        help: {},
        package: {
            character: { character: {}, translate: {} },
            card: { card: {}, translate: {}, list: [] },
            skill: { skill: {}, translate: {} },
            intro: "包含笮融四种形态武将：基础/魔业/佛道/双生，局内可通过【净土】切换",
            author: "渝至&夜雨i",
            diskURL: "",
            forumURL: "",
            version: "2.0"
        },
        files: {
            "character": ["zerong.jpg", "zerong_mo.jpg", "zerong_fo.jpg", "zerong_shuang.jpg"],
            "card": [],
            "skill": []
        }
    };
};
        