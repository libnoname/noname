import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib, game, ui, get, ai, _status) {
    return {
        name: "神姜维",
        content: function(config, pack) {
            window.shenjiangwei = {
                SS_Sjw_dead: { name: "../../../神姜维/animation/SS_Sjw_dead" },
                SS_Sjw_skill1: { name: "../../../神姜维/animation/SS_Sjw_skill1" },
                SS_Sjw_skill2: { name: "../../../神姜维/animation/SS_Sjw_skill2" },
                SS_Sjw_skill3: { name: "../../../神姜维/animation/SS_Sjw_mask", action: "play2", loop: true }
            };

            // 神霈计数
            lib.skill.mbshenpei_count = {
                trigger: { player: "dyingBegin" },
                forced: true,
                silent: true,
                firstDo: true,
                content: () => {
                    if (!player.storage.mbshenpei_dyingCount) {
                        player.storage.mbshenpei_dyingCount = 0;
                    }
                    player.storage.mbshenpei_dyingCount++;
                }
            };

            // 回天
            lib.skill.mbhuitian = {
                name: "回天",
                derivation: true,
                direct: true,
                init: function(player) {
                    if (typeof player.storage.mbhuitian_used !== "boolean") player.storage.mbhuitian_used = false;
                },
                intro: {
                    content: function(storage, player) {
                        return player.storage.mbhuitian_used ? "本轮已发动，下轮开始时将死亡" : "本轮未发动";
                    }
                },
                trigger: { global: "phaseEnd" },
                filter: function(event, player) {
                    var shenpeiUsed = player.awakenedSkills && player.awakenedSkills.includes("mbshenpei");
                    var shenpeiMarked = player.storage.mbshenpei === true;
                    if (!shenpeiUsed && !shenpeiMarked) return false;
                    return event.player.hp > player.hp && event.player !== player;
                },
                content: function() {
                    "step 0";
                    if (player.storage.mbhuitian_used) {
                        var audioNum = Math.floor(Math.random() * 4) + 1;
                        game.playAudio('../extension/神姜维/mbhuitian' + audioNum + '.mp3');
                        event.goto(3);
                        return;
                    }
                    
                    var costStr = '你可以发动回天，摸1张牌并执行额外回合';
                    player.chooseBool().set('prompt', costStr).set('ai', function(){
                        var player = _status.event.player;
                        if (player.hp <= 1) return true;
                        if (game.countPlayer(function(current){
                            return current.isEnemyOf(player) && current.hp <= 1;
                        }) > 0) return true;
                        return false;
                    });
                    
                    "step 1";
                    if (!result.bool) {
                        event.finish();
                        return;
                    }
                    
                    var audioNum = Math.floor(Math.random() * 4) + 1;
                    game.playAudio('../extension/神姜维/mbhuitian' + audioNum + '.mp3');
                    game.log(player, "发动了【回天】，摸一张牌并执行一个额外回合");
                    
                    "step 2";
                    var loadedCount = 0;
                    var totalCount = 2;
                    var checkAndPlay = function() {
                        loadedCount++;
                        if (loadedCount >= totalCount) {
                            shenjiangwei.SS_Sjw_skill1.action = 'play';
                            player.storage.SS_Sjw_skill1 = dcdAnim.playSpine(shenjiangwei.SS_Sjw_skill1, {
                                speed: 0.785,
                                scale: 1,
                                x: [0, 0.5],
                                y: [0, 0.5]
                            });
                            
                            shenjiangwei.SS_Sjw_skill3.action = 'play1';
                            shenjiangwei.SS_Sjw_skill3.loop = false;
                            var skill3Anim = dcdAnim.playSpine(shenjiangwei.SS_Sjw_skill3, {
                                speed: 0.8,
                                scale: 1,
                                x: [0, 0.5],
                                y: [0, 0.5]
                            });
                            
                            game.pause();
                            
                            setTimeout(function() {
                                player.storage.SS_Sjw_skill1.oncomplete = function() {
                                    if (skill3Anim) {
                                        dcdAnim.stopSpine(skill3Anim);
                                        skill3Anim = undefined;
                                    }
                                };
                            }, 0);
                            
                            setTimeout(function() {
                                if (skill3Anim) {
                                    dcdAnim.stopSpine(skill3Anim);
                                }
                                shenjiangwei.SS_Sjw_skill3.action = 'play2';
                                shenjiangwei.SS_Sjw_skill3.loop = true;
                                skill3Anim = dcdAnim.playSpine(shenjiangwei.SS_Sjw_skill3, {
                                    speed: 0.8,
                                    scale: 1,
                                    x: [0, 0.5],
                                    y: [0, 0.5]
                                });
                                
                                setTimeout(function() {
                                    if (skill3Anim) {
                                        decadeUI.animation.stopSpine(skill3Anim);
                                    }
                                    game.resume();
                                }, 2400);
                            }, 600);
                        }
                    };
                    
                    dcdAnim.loadSpine(shenjiangwei.SS_Sjw_skill3.name, "skel", checkAndPlay);
                    dcdAnim.loadSpine(shenjiangwei.SS_Sjw_skill1.name, "skel", checkAndPlay);
                    game.delayx(4);
                    
                    "step 3";
                    player.storage.mbhuitian_used = true;
                    player.markSkill("mbhuitian", "回天");
                    player.draw();
                    var next = player.insertPhase();
                    next._mbhuitian = true;
                },
                group: ["mbhuitian_roundStart"],
                subSkill: {
                    roundStart: {
                        trigger: { global: "roundStart" },
                        forced: true,
                        filter: function(event, player) {
                            return player.storage.mbhuitian_used === true;
                        },
                        content: function() {
                            game.log(player, "因【回天】的效果，死亡");
                            player.die();
                        }
                    }
                },
                ai: { threaten: 3, expose: 0.3 }
            };

            // 神姜维死亡特效
            lib.skill._ssshenjiangweidie={
                trigger: { player: 'dieBefore' },
                direct: true,
                firstDo: true,
                charlotte: true,
                priority: Infinity,
                filter: function (event, player) {
                    return (player.name == "mb_shen_jiangwei");
                },
                content: function () {
                    'step 0'
                    game.playBackgroundMusic();
                    dcdAnim.loadSpine(shenjiangwei.SS_Sjw_dead.name, "skel", function () {
                        game.playAudio('../extension/神姜维/animation/effect_shenjiangwei_dead.mp3');
                        dcdAnim.playSpine(shenjiangwei.SS_Sjw_dead, { 
                            speed: 0.785, 
                            scale: 0.8, 
                            x: [0, 0.5], 
                            y: [-120, 0.5] 
                        });
                    });
                    game.delay(0, 6000);
                }
            };
        },
        precontent: function() {},
        config: {},
        help: {},
        package: {
            character: {
                character: {
                    mb_shen_jiangwei: ["male", "shen", 4, ["mbxinghun","mbtiantao","mbshenpei"]]
                },
                translate: {
                    mb_shen_jiangwei: "神姜维"
                }
            },
            card: {
                card: {},
                translate: {},
                list: []
            },
            skill: {
                skill: {
                    // 星魂
                    mbxinghun: {
                        audio: "ext:神姜维:2",
                        enable: "phaseUse",
                        usable: 1,
                        filter: function(event, player) {
                            return player.maxHp > 0 && ui.cardPile && ui.cardPile.childNodes.length > 0;
                        },
                        content: function() {
                            "step 0"
                            event.X = 5;
                            var cards = get.cards(event.X);
                            event.pileCards = cards;
                            game.log(player, "观看了牌堆顶的", event.X, "张牌");
                            
                            "step 1"
                            player.chooseToMove()
                                .set("list", [
                                    ["牌堆顶（按顺序放置）", event.pileCards],
                                    ["你的手牌", player.getCards("h")]
                                ])
                                .set("prompt", "星魂：拖动交换手牌与牌堆顶牌，并排列顺序")
                                .set("filterOk", function(moved) {
                                    var handToPile = moved[0].filter(function(c) {
                                        return c && get.owner(c) === player;
                                    }).length;
                                    var pileToHand = moved[1].filter(function(c) {
                                        return c && event.pileCards.includes(c);
                                    }).length;
                                    return handToPile === pileToHand;
                                })
                                .set("processAI", function(list) {
                                    var pile = list[0][1].slice().filter(c => c);
                                    var hand = list[1][1].slice().filter(c => c);
                                    hand.sort(function(a, b) {
                                        return get.value(a, player) - get.value(b, player);
                                    });
                                    pile.sort(function(a, b) {
                                        return get.value(b, player) - get.value(a, player);
                                    });
                                    var newPile = [];
                                    var newHand = [];
                                    var i = 0, j = 0;
                                    while (i < hand.length && j < pile.length) {
                                        if (get.value(hand[i], player) < get.value(pile[j], player)) {
                                            newHand.push(pile[j]);
                                            newPile.push(hand[i]);
                                            i++;
                                            j++;
                                        } else {
                                            newPile.push(pile[j]);
                                            j++;
                                        }
                                    }
                                    while (i < hand.length) {
                                        newHand.push(hand[i]);
                                        i++;
                                    }
                                    while (j < pile.length) {
                                        newPile.push(pile[j]);
                                        j++;
                                    }
                                    return [newPile, newHand];
                                });
                            
                            "step 2"
                            if (result.bool) {
                                var moved = result.moved;
                                var newPile = moved[0].filter(c => c);
                                var newHand = moved[1].filter(c => c);
                                var discarded = newPile.filter(function (c) {
                                    return c && get.owner(c) === player;
                                });
                                var gained = newHand.filter(function (c) {
                                    return c && event.pileCards.includes(c);
                                });
                                
                                if (discarded.length > 0) {
                                    player.discard(discarded);
                                }
                                
                                if (gained.length > 0) {
                                    player.gain(gained, "gain2", 'silent');
                                    game.log(player, '从', '#g星魂', '中获得了', gained);
                                    game.log(player, "用手牌交换了", gained.length, "张牌");
                                }
                                
                                for (var i = newPile.length - 1; i >= 0; i--) {
                                    ui.cardPile.insertBefore(newPile[i], ui.cardPile.firstChild);
                                }
                                game.log(player, "将牌按顺序置于了牌堆顶");
                            }
                            "step 3"
                            var validTargets = get.players().filter(function(p) {
                                return p !== player;
                            });
                            if (validTargets.length === 0) {
                                event.finish();
                                return;
                            }
                            player.chooseTarget(true, "令一名角色展示你的手牌与牌堆顶共计" + event.X + "张牌", function(card, player, target) {
                                return target != player;
                            }).set("ai", function(target) {
                                return get.attitude(player, target) < 0 ? 1 : -1;
                            });
                            
                            "step 4"
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target = target;
                                var handCount = player.countCards("h");
                                var needFromPile = Math.max(0, event.X - handCount);
                                var showCards = (player.getCards("h") || []).slice(0, event.X).filter(c => c);
                                var pileShowCards = [];
                                if (needFromPile > 0) {
                                    pileShowCards = (Array.from(ui.cardPile.childNodes) || []).slice(0, needFromPile).filter(c => c);
                                    showCards = showCards.concat(pileShowCards);
                                }
                                event.showCards = showCards;
                                event.target.showCards(showCards, "星魂：" + player.name + "的手牌与牌堆顶共计" + event.X + "张牌");
                                game.log(event.target, "展示了", player, "的手牌与牌堆顶共计", showCards.length, "张牌");
                                game.delayx();
                            } else {
                                event.finish();
                            }
                            "step 5"
                            var shaCards = (event.showCards || []).filter(function(card) {
                                return card && get.name(card) == "sha";
                            });
                            
                            if (shaCards.length > 0) {
                                event.shaList = shaCards;
                                event.currentSha = 0;
                                shaCards.forEach(function(card) {
                                    card.classList.add("glow");
                                });
                            } else {
                                game.log("展示的牌中没有【杀】");
                                event.finish();
                            }
                       
                            "step 6"
                            if (!event.target.isAlive()) {
                                if (event.shaList) {
                                    event.shaList.forEach(function(card) {
                                        card.classList.remove("glow");
                                    });
                                }
                                event.finish(); 
                                return;
                            }
                            if (event.currentSha < event.shaList.length) {
                                var shaCard = event.shaList[event.currentSha];
                                if (shaCard) shaCard.classList.remove("glow");
                                
                                if(shaCard && event.target.isAlive() && player.canUse(shaCard, event.target, false)) {
                                    player.line(event.target, "green");
                                    player.useCard(shaCard, event.target, false);
                                    game.log(player, "对", event.target, "使用了", shaCard);
                                }
                                
                                event.currentSha++;
                                event.redo(); 
                            } else {
                                if (event.shaList) {
                                    event.shaList.forEach(function(card) {
                                        card.classList.remove("glow");
                                    });
                                }
                            }
                        },
                        ai: {
                            order: 7,
                            result: {
                                player: 1,
                                target: function(player, target) {
                                    if (!target || !player) return 0;
                                    return get.damageEffect(target, player, player);
                                }
                            },
                            chooseToUse: function(player) {
                                const skill = player.getSkill('mbxinghun');
                                if (!skill) return false;
                                return player.maxHp > 0 && ui.cardPile && ui.cardPile.childNodes.length > 0;
                            }
                        }
                    },

                    // 天涛
                    mbtiantao: {
                        audio: "ext:神姜维:2",
                        locked: true,
                        forced: true,
                        trigger: { player: "phaseEnd" },
                        filter: function(event, player) {
                            return game.hasPlayer(function(current) {
                                return current != player;
                            });
                        },
                        content: function() {
                            "step 0"
                            var list = [];
                            list.push("手牌区");
                            list.push("装备区");
                            list.push("判定区");
                            player.chooseControl(list).set("prompt", "选择一个区域，弃置该区域的所有牌");
                            "step 1"
                            var areaMap = { "手牌区": "h", "装备区": "e", "判定区": "j" };
                            event.area = areaMap[result.control];
                            event.areaName = result.control;
                            var cardsToDiscard = player.getCards(event.area);
                            event.num = cardsToDiscard.length;
                            event.noShaTargets = [];
                            event.playerParticipates = cardsToDiscard.length > 0;
                            if (cardsToDiscard.length > 0) {
                                player.discard(cardsToDiscard);
                                game.log(player, "弃置了", event.areaName, "的所有牌，共", event.num, "张");
                                var hasSha = cardsToDiscard.some(function(card) { return get.name(card) == "sha"; });
                                if (!hasSha) {
                                    event.noShaTargets.push(player);
                                    game.log(player, "弃置的牌中没有【杀】");
                                }
                            } else {
                                game.log(player, "的", event.areaName, "没有牌，不因此失去体力");
                            }
                            event.hasValidTargets = game.hasPlayer(function(current) {
                                return current != player && current.countCards(event.area) > 0;
                            });
                            "step 2"
                            if (!event.hasValidTargets) {
                                event.finish();
                            } else {
                                var maxTargets = game.countPlayer() - 1;
                                player.chooseTarget("选择任意数量的其他角色，弃置其" + event.areaName + "的一张牌", [1, maxTargets], function(card, player, target) {
                                    return target != player && target.countCards(event.area) > 0;
                                }).set("ai", function(target) {
                                    return -get.attitude(player, target);
                                });
                            }
                            "step 3"
                            if (result.bool && result.targets && result.targets.length > 0) {
                                event.targets = result.targets;
                                event.current = 0;
                            } else {
                                event.goto(6);
                            }
                            "step 4"
                            if (event.current < event.targets.length) {
                                var target = event.targets[event.current];
                                event.currentTarget = target;
                                if (target.countCards(event.area) > 0) {
                                    player.line(target, "green");
                                    player.discardPlayerCard(target, event.area, true).set("ai", function(button) {
                                        var card = button.link;
                                        if (get.name(card) == "sha") return 10;
                                        return get.value(card);
                                    });
                                } else {
                                    event.goto(6);
                                }
                            } else {
                                event.goto(6);
                            }
                            "step 5"
                            var discardedCards = result.cards || [];
                            var hasSha = discardedCards.some(function(card) { return get.name(card) == "sha"; });
                            if (!hasSha) event.noShaTargets.push(event.currentTarget);
                            event.current++;
                            event.goto(4);
                            "step 6"
                            if (event.noShaTargets.length > 0) {
                                game.log(event.noShaTargets, "未弃置【杀】，失去1点体力");
                                for (var i = 0; i < event.noShaTargets.length; i++) event.noShaTargets[i].loseHp();
                            }
                        },
                        ai: { threaten: 2, expose: 0.2 }
                    },

                    // 神霈
                    mbshenpei: {
                        audio: "ext:神姜维:2",
                        mark: true,
                        intro: { content: "limited" },
                        limited: false,          
                        skillAnimation: false,
                        unique: true,
                        trigger: { player: "dying" },
                        priority: 15,
                        forced: false,
                        filter: (event, player) => !player.storage.mbshenpei && player.hp <= 0,
                        content: () => {
                            let x = player.storage.mbshenpei_dyingCount || 1;

                            "step 0"
                            game.playAudio('../extension/神姜维/animation/effect_shenpei_skill.mp3');
                            player.awakenSkill(event.name);
                            game.log(player, "发动了", "神沛", "，X值为", x);
                            player.recover(x);
                            
                            let loadedCount = 0;          
                            const totalCount = 2;
                            let skill3Anim;
                            
                            const checkAndPlay = () => {
                                loadedCount++;
                                if (loadedCount >= totalCount) {
                                    shenjiangwei.SS_Sjw_skill2.action = 'play';
                                    player.storage.SS_Sjw_skill2 = dcdAnim.playSpine(shenjiangwei.SS_Sjw_skill2, {
                                        speed: 0.785,
                                        scale: 1,
                                        x: [0, 0.5],
                                        y: [0, 0.5]
                                    });
                                    
                                    shenjiangwei.SS_Sjw_skill3.action = 'play1';
                                    shenjiangwei.SS_Sjw_skill3.loop = false;
                                    skill3Anim = dcdAnim.playSpine(shenjiangwei.SS_Sjw_skill3, {
                                        speed: 0.8,
                                        scale: 1,
                                        x: [0, 0.5],
                                        y: [0, 0.5]
                                    });
                                    
                                    game.pause();
                                    
                                    setTimeout(() => {
                                        player.storage.SS_Sjw_skill2.oncomplete = () => {
                                            if (skill3Anim) {
                                                dcdAnim.stopSpine(skill3Anim);
                                                skill3Anim = undefined;
                                            }
                                        };
                                    }, 0);
                                    
                                    setTimeout(() => {
                                        if (skill3Anim) {
                                            dcdAnim.stopSpine(skill3Anim);
                                        }
                                        shenjiangwei.SS_Sjw_skill3.action = 'play2';
                                        shenjiangwei.SS_Sjw_skill3.loop = true;
                                        skill3Anim = dcdAnim.playSpine(shenjiangwei.SS_Sjw_skill3, {
                                            speed: 0.8,
                                            scale: 1,
                                            x: [0, 0.5],
                                            y: [0, 0.5]
                                        });
                                        setTimeout(() => {
                                            if (skill3Anim) {
                                                decadeUI.animation.stopSpine(skill3Anim);
                                            }
                                            game.resume();
                                        }, 2400);
                                    }, 600);
                                }
                            };
                            
                            dcdAnim.loadSpine(shenjiangwei.SS_Sjw_skill3.name, "skel", checkAndPlay);
                            dcdAnim.loadSpine(shenjiangwei.SS_Sjw_skill2.name, "skel", checkAndPlay);
                            game.delayx(4);
                            
                            "step 1"
                            const currentPlayer = player;
                            const recoverCount = x;
                            player.chooseTarget(
                                `对一名角色造成 ${recoverCount} 点雷电伤害`,
                                true,
                                (card, player, target) => target !== player
                            ).set("ai", (target) => {
                                if (target === currentPlayer) return -100;
                                let att = get.attitude(currentPlayer, target);
                                return att < 0 ? att * recoverCount * 2 : att;
                            });
                            "step 2"
                            if (result?.bool && result.targets?.length > 0) {
                                const target = result.targets[0];
                                player.line(target, "thunder");
                                target.damage(x, "thunder");
                                game.log(player, "对", target, "造成了", x + "点", "#r雷电伤害");
                            }
                            "step 3"
                            if (!player.hasSkill("mbhuitian")) {
                                player.addSkill("mbhuitian");
                                player.markSkill("mbhuitian", "回天");
                                game.log(player, "获得了技能", "回天");
                            }
                        },
                        ai: {
                            order: 10,
                            result: {
                                player: (player) => player.hp <= 0 ? 10 : 0
                            }
                        },
                        group: "mbshenpei_count"
                    },

                    // 回天
                    mbhuitian: {
                        name: "回天",
                        audio: "ext:神姜维:4",
                        derivation: true,
                        direct: true,
                        init: function(player) {
                            if (typeof player.storage.mbhuitian_used !== "boolean") player.storage.mbhuitian_used = false;
                        },
                        intro: {
                            content: function(storage, player) {
                                return player.storage.mbhuitian_used ? "本轮已发动，下轮开始时将死亡" : "本轮未发动";
                            }
                        },
                        trigger: { global: "phaseEnd" },
                        filter: function(event, player) {
                            var shenpeiUsed = player.awakenedSkills && player.awakenedSkills.includes("mbshenpei");
                            var shenpeiMarked = player.storage.mbshenpei === true;
                            if (!shenpeiUsed && !shenpeiMarked) return false;
                            return event.player.hp > player.hp && event.player !== player;
                        },
                        group: ["mbhuitian_roundStart"],
                        ai: { threaten: 3, expose: 0.3 }
                    }
                },
                translate: {
                    mbxinghun: '星魂',
                    mbxinghun_info: '出牌阶段限一次，你可观看牌堆顶的五张牌，用任意张手牌与其中等量牌进行交换并排序，然后你令一名其他角色展示你手牌与牌堆顶共五张牌，你对其依次使用其中的【杀】。',
                    mbtiantao: '天涛',
                    mbtiantao_info: '锁定技，结束阶段，你选择一个区域并弃置其中所有牌， 然后依次弃置任意名其他角色相同区域各一张牌，因此弃置牌且未弃置【杀】的角色失去1点体力。',
                    mbshenpei: '神霈',
                    mbshenpei_info: '限定技，当你进入濒死状态时，你可以回复X点体力(X为你本局游戏进入过濒死状态的次数)，然后对一名角色造成等量点雷电伤害并获得“回天”。',
                    mbhuitian: '回天',
                    mbhuitian_info: '一名体力值大于你的角色回合结束时，你可以摸一张牌并执行一个额外的回合。每轮开始时，若你发动过此技能，你死亡。'
                }
            },
            author: "<img style=width:80px;border-radius:100%; src=" + lib.assetURL + "extension/神姜维/author/sha.jpg></img>   <b><strong>梓云长大战锤头鲨</strong></b>",
            diskURL: "",
            forumURL: "",
            version: "1.0"
        },
        files: { "character": [], "card": [], "skill": [] }
    };
};
