import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib, game, ui, get, ai, _status){
    const skills = {
        // 势钟会
        dzmbsizi: {
            audio: "ext:手杀武将/audio/skill:7",
            enable: 'phaseUse',
            usable: 1,
            filterCard: () => false,
            selectCard: [-2, -1],
            filter(event, player) {
                return player.hasMark("charge");
            },
            chargeSkill: 4,
            content() {
                "step 0";
                var len = player.countMark("charge");
                event.numbers = Array.from({ length: len }, (_, i) => get.cnNumber(i + 1, true));
                "step 1";
                player.chooseControl(event.numbers)
                    .set("prompt", get.prompt(event.name))
                    .set("prompt2", "你可消耗任意蓄力点，令从此回合开始的等量个回合，执行一些效果（你的回合开始时，这些效果失效）")
                    .set("ai", () => {
                        var player = _status.event.player;
                        return Math.ceil(len / 2) - 1;
                    });
                "step 2";
                var num = result.index + 1;
                player.removeMark("charge", num);
                if(num > player.hp) {
                    player.storage[event.name + "_effect2"] = true;
                }
                player.addTempSkill(event.name + "_effect", {player: "phaseBegin"});
                player.addMark(event.name + "_effect", num, false);
            },
            group: 'dzmbsizi_init',
            subSkill: {
                init: {
                    audio: "dzmbsizi",
                    forced: true,
                    trigger: {
                        player: "enterGame",
                        global: "phaseBefore",
                    },
                    filter(event, player) {
                        return event.name != "phase" || game.phaseNumber == 0;
                    },
                    priority: 5,
                    forced: true,
                    locked: false,
                    content() {
                        player.addMark("charge", 4);
                    },
                },
                effect: {
                    forced: true,
                    charlotte: true,
                    audio: 'dzmbsizi',
                    mark: true,
                    onremove(player, skill) {
                        player.clearMark(skill, false);
                        delete player.storage.dzmbsizi_effect2;
                    },
                    intro: {
                        content(storage, player) {
                            var str = "<li>1.所有角色使用【杀】造成的伤害+1<li>2.每个回合结束时，本回合内使用过【杀】的角色失去1点体力，你摸两张牌";
                            if(player.storage.dzmbsizi_effect2) str += "<li>3.每个回合结束时，若本回合未有角色使用过【杀】，你与当前回合角色各失去1点体力";
                            str += "<li>此效果还有" + storage + "回合消失";
                            return str;
                        },
                    },
                    trigger: {
                        global: ["damageBegin2", "phaseAfter", "phaseEnd"],
                    },
                    filter(event, player, name) {
                        if(name == "phaseAfter") return true;
                        if(name == "damageBegin2") return event.card && event.card.name == "sha";
                        if(name == "phaseEnd") {
                            return game.hasPlayer(c => {
                                return c.hasHistory("useCard", evt => evt && evt.card && evt.card.name == "sha");
                            }) ||
                            (player.storage.dzmbsizi_effect2 && !game.hasPlayer2(c => {
                                return c.hasHistory("useCard", evt => evt && evt.card && evt.card.name == "sha");
                            }));
                        }
                    },
                    content() {
                        var name = event.triggername;
                        if(name == "damageBegin2") {
                            trigger.num++;
                        } else if(name == "phaseAfter") {
                            player.storage[event.name]--;
                            player.markSkill(event.name);
                            if(player.storage[event.name] <= 0) {
                                player.removeSkill(event.name);
                            }
                        } else {
                            var targets = game.filterPlayer(c => {
                                return c.hasHistory("useCard", evt => evt && evt.card && evt.card.name == "sha");
                            }).sortBySeat();
                            if(targets.length) {
                                targets.forEach(c => {
                                    c.loseHp();
                                });
                                player.draw(2);
                            } else {
                                if(player.storage.dzmbsizi_effect2) {
                                    player.loseHp();
                                    if(_status.currentPhase && _status.currentPhase.isIn()) {
                                        _status.currentPhase.loseHp();
                                    }
                                }
                            }
                        }
                    },
                },
            },
        },
        dzmbxiezhi: {
            audio: "ext:手杀武将/audio/skill:2",
            forced: true,
            trigger: {
                player: ["changeHp", "loseMaxHpBegin"],
            },
            filter(event, player, name) {
                if(name == "changeHp") return event.num < 0;
                return !player.isDamaged();
            },
            content() {
                var num = Math.abs(trigger.num);
                var num2 = lib.skill.dzmbsizi.chargeSkill - player.countMark("charge");
                if(num2 >= num) {
                    player.addMark("charge", num);
                } else {
                    var num3 = num - num2;
                    if(num3 == num) {
                        player.addSkill(event.name + "_effect");
                        player.addMark(event.name + "_effect", num, false);
                    } else {
                        player.addMark("charge", num2);
                        player.addSkill(event.name + "_effect");
                        player.addMark(event.name + "_effect", num3, false);
                    }
                }
            },
            subSkill: {
                effect: {
                    charlotte: true,
                    mod: {
                        cardUsable(card, player, num) {
                            if(card.name == "sha") return num + player.countMark("dzmbxiezhi_effect");
                        },
                        maxHandcard(player, num) {
                            return num + player.countMark("dzmbxiezhi_effect");
                        },
                    },
                    mark: true,
                    intro: {
                        content: '手牌上限与使用【杀】的上限+#',
                    },
                    onremove: true,
                },
            },
        },
        dzmbyunan: {
            audio: "ext:手杀武将/audio/skill:4",
            juexingji: true,
            forced: true,
            skillAnimation: true,
            animationColor: "fire",
            trigger: {
                source: 'dying',
            },
            filter(event, player) {
                return player.hasSkill("dzmbyunan_die");
            },
            content() {
                if(!player.hasSkill("dzmbkechang", null, null, false)) {
                    player.addSkill("dzmbkechang");
                } else {
                    player.popup("dzmbkechang", "purple");
                    game.log(player, "升级了技能", `#g【${get.translation("dzmbkechang")}】`);
                    player.storage["dzmbkechang"] = true;
                }
            },
            group: 'dzmbyunan_s',
            subSkill: {
                die: {
                    charlotte: true,
                },
                s: {
                    forced: true,
                    silent: true,
                    popup: false,
                    trigger: {
                        global: 'dieAfter',
                    },
                    content() {
                        player.addTempSkill("dzmbyunan_die", "roundStart");
                    },
                },
            },
            derivation: ["dzmbkechang", "dzmbkechang2"],
        },
        dzmbkechang: {
            audio: "ext:手杀武将/audio/skill:2",
            zhuSkill: true,
            onremove: true,
            forced: true,
            trigger: {
                player: "useCard1",
            },
            filter(event, player) {
                return event.card.name == "sha" && player.storage.dzmbkechang;
            },
            content() {
                trigger.directHit.addArray(game.players);
                game.log(trigger.card, "不可被响应");
            },
            ai: {
                directHit_ai: true,
                skillTagFilter(player, tag, arg) {
                    return player.storage.dzmbkechang && arg && arg.card && arg.card.name == "sha";
                },
            },
            global: 'dzmbkechang_global',
            subSkill: {
                global: {
                    charlotte: true,
                    mod: {
                        targetInRange(card, player) {
                            if (player.group != "qun" || card.name != "sha") {
                                return;
                            }
                            if (game.hasPlayer(current => current.hasSkill("dzmbkechang"))) {
                                return true;
                            }
                        }
                    }
                }
            }
        },
        // 势陆郁生
        mbrunwei: {
            audio: 4,
            logAudio: index => (typeof index === "number" ? "mbrunwei" + index + ".mp3" : 2),
            enable: "phaseUse",
            usable: 1,
            ai: {
                order: 10,
                result: {
                    player(player) {
                        const used = player.hasSkill("mbrunwei_twice");
                        if (!used) {
                            return 1;
                        } else if (
                            game.hasPlayer(target => {
                                return !target.hasHistory("gain", evt => evt.cards.length) && get.attitude(player, target) > 0;
                            })
                        ) {
                            return 1;
                        }
                        return 0;
                    },
                },
            },
            content() {
                'step 0'
                const choice = [1, 2, 3, 4, 5];
                player
                    .chooseControl(choice)
                    .set("ai", () => {
                        return 4;
                    })
                    .set("prompt", lib.translate[event.name])
                    .set("prompt2", lib.translate[event.name + "_info"])
                'step 1'
                if (result.control == 'cancel2') {
                    event.finish()
                } else {
                    const cards = get.cards(result.index + 1, true);
                    event.cards = cards.sort((a, b) => {
                        const ac = get.color(a)
                        const bc = get.color(b)
                        if (ac == bc) {
                            return 0
                        }
                        return ac == 'red' ? -1 : 1
                    });
                    player.logSkill("mbrunwei", null, null, null, [get.rand(1, 2)]);
                    player.showCards(event.cards, `${get.translation(player)}发动了〖${get.translation(event.name)}〗`);
                }
                'step 2'
                const used = player.hasSkill(event.name + "_twice");
                player
                    .chooseTarget(get.prompt(event.name), `选择一名角色获取${get.translation(event.cards)}中的红色或黑色牌`, function (card, player, target) {
                        return !_status.event.used || target !== get.player()
                    })
                    .set('ai', target => {
                        if (!_status.event.used && target == get.player()) {
                            return 9999
                        }
                        return get.attitude(_status.event.player, target)
                    })
                    .set('used', used);
                'step 3'
                if (result.bool) {
                    const red = event.cards.filter(card => get.color(card, false) == "red");
                    const black = event.cards.filter(card => get.color(card, false) == "black");
                    let target = result.targets[0];
                    event.target = target;
                    let choice2 = []
                    if (red?.length) {
                        choice2.push('红色牌')
                    }
                    if (black?.length) {
                        choice2.push('黑色牌')
                    }
                    player
                        .chooseControl(choice2)
                        .set("ai", () => {
                            const targetx = _status.event.targetx;
                            const black = _status.event.black;
                            const red = _status.event.red;
                            const redValue = red.reduce((sum, card) => sum + get.value(card, targetx), 0);
                            const blackValue = black.reduce((sum, card) => sum + get.value(card, targetx), 0);
                            return redValue >= blackValue ? 0 : 1;
                        })
                        .set("prompt", lib.translate[event.name])
                        .set('targetx', target)
                        .set('red', red)
                        .set('black', black);
                } else {
                    event.finish();
                }
                'step 4'
                const color = result.control == '红色牌' ? 'red' : 'black'
                const cards = event.cards.filter(card => get.color(card, false) == color);
                event.target.gain(cards, "gain2").gaintag.add("mbrunwei");
                if (!player.hasSkill(event.name + "_twice")) {
                    player.addTempSkill(event.name + "_twice", "phaseUseAfter");
                }
                player.addMark(event.name + "_twice", cards.length, false);
                player.markSkill(event.name + "_twice");
            },
            group: 'mbrunwei_discard',
            subSkill: {
                discard: {
                    trigger: {
                        player: 'phaseUseEnd'
                    },
                    forced: true,
                    filter(event, player) {
                        return player.countCards("h", card => card.hasGaintag("mbrunwei"))
                    },
                    content() {
                        const cards = player.getCards("h", card => card.hasGaintag("mbrunwei"));
                        if (cards.length) {
                            player.logSkill("mbrunwei", null, null, null, [4]);
                            player.discard(cards)
                        }
                    },
                },
                twice: {
                    onremove(player, skill) {
                        delete player.storage[skill];
                        player.unmarkSkill(skill);
                    },
                    intro: {
                        markcount: "mark",
                        content: "再失去#张牌重置技能",
                    },
                    trigger: {
                        player: "loseAfter",
                        global: ["loseAsyncAfter", "equipAfter", "gainAfter", "addToExpansionAfter", "addJudgeAfter"],
                    },
                    filter(event, player) {
                        return event.getl(player)?.cards2?.length && player.hasMark("mbrunwei_twice");
                    },
                    silent: true,
                    content() {
                        const num = trigger.getl(player)?.cards2?.length;
                        if (num >= player.countMark(event.name)) {
                            player.logSkill("mbrunwei", null, null, null, [3]);
                            get.info(event.name).onremove(player, event.name);
                            player.unmarkSkill(event.name);
                            delete player.getStat().skill.mbrunwei;
                            game.log(player, "重置了", `#g【${get.translation(event.name)}】`);
                        } else {
                            player.removeMark(event.name, num, false);
                            player.markSkill(event.name)
                        }
                    },
                },
            },
        },
        mbshuanghuai: {
            audio: 3,
            logAudio: index => (typeof index === "number" ? "mbshuanghuai" + index + ".mp3" : 3),
            onremove(player, skill) {
                delete player.storage[skill];
                player.unmarkSkill(skill);
            },
            trigger: { global: "damageBegin4" },
            usable: 1,
            filter(event, player) {
                return get.distance(player, event.player) <= 1;
            },
            popup: false,
            logTarget: "player",
            content() {
                'step 0'
                const card = get.discardPile(cardx => cardx.name == "tao");
                const choice = ['防止此伤害'];
                event.target = trigger.player
                if (card) {
                    choice.push('令其从弃牌堆获得一张【桃】')
                }
                const tt = get.translation(event.target)
                player
                    .chooseControl([...choice])
                    .set("ai", () => {
                        const trigger = _status.event.getTrigger(),
                            eff = get.damageEffect(trigger.player, trigger.source, get.player());
                        if (eff > 0) {
                            return 0;
                        }
                        if (trigger.player.hasSkillTag("maixie") && trigger.num === 1) {
                            return 1
                        }
                        return [0, 1].randomGet();
                    })
                    .set("prompt", lib.translate[event.name])
                    .set("prompt2", `防止${tt}受到的伤害${choice.length > 1 ? `令${tt}从弃牌堆获得一张【桃】` : ''}`)
                'step 1'
                let control = result.control
                let target = trigger.player,
                    last = player.storage[event.name];
                if (control == "防止此伤害") {
                    trigger.cancel();
                } else {
                    const card = get.discardPile("tao");
                    if (card) {
                        target.gain(card, "gain2");
                    }
                }
                player.logSkill("mbshuanghuai", target, null, null, [control == "防止此伤害" ? 1 : 2]);
                if (last && last == target) {
                    game.asyncDraw([player, target]);
                    return;
                }
                if (last && last != target) {
                    player.logSkill("mbshuanghuai", null, null, null, [3]);
                    player.loseHp();
                }
                player.storage[event.name] = target;
                player.markSkill(event.name);
            },
            intro: {
                content: "player",
                markcount: () => 0,
            },
        },
        // 鲍信
        mbmutao: {
            audio: 2,
            enable: 'phaseUse',
            usable: 1,
            filterTarget: function (card, player, target) {
                return target.countCards('h');
            },
            content: function () {
                'step 0'
                event.togive = target.getNext();
                var cards = target.getCards('h', { name: 'sha' });
                if (!cards.length) {
                    game.log('但', target, '没有', '#y杀', '！');
                    event.finish();
                }
                'step 1'
                var cards = target.getCards('h', { name: 'sha' }), card = cards.randomRemove(1)[0];
                target.give(card, event.togive);
                if (cards.length) {
                    event.togive = event.togive.getNext();
                    event.redo();
                }
                'step 2'
                target.line(event.togive);
                event.togive.damage(Math.min(3, event.togive.countCards('h', { name: 'sha' })), target);
            },
            ai: {
                order: 10,
                result: {
                    target: function (player, target) {
                        var num = 0, numx = target.countCards('h', { name: 'sha' }), targetx = target;
                        for (var i = 0; i < numx; i++) {
                            targetx = targetx.next;
                            if (targetx == player) targetx = targetx.next;
                        }
                        var att1 = get.attitude(player, target), att2 = get.attitude(player, targetx);
                        if (att1 > 0 && att2 < 0) num = 0.25;
                        if (att1 < 0 && att2 < 0) num = 4;
                        return att1 * num * numx * (targetx.countCards('h', { name: 'sha' }) + 1);
                    },
                },
            },
            intro: {
                content: "出牌阶段限一次，你可以选择一名有手牌的角色，令其将手牌中的所有【杀】依次传递给下一名角色（按座位顺序），最后一名接收【杀】的角色受到你造成的伤害，伤害值为该角色手牌中【杀】数量与3的较小值。",
                markcount: () => 0
            }
        },
        mbyimou: {
            audio: 2,
            trigger: { global: 'damageEnd' },
            filter: function (event, player) {
                return event.player.isIn() && get.distance(player, event.player) <= 1;
            },
            logTarget: 'player',
            check: function (event, player) {
                return get.attitude(player, event.player) > 0;
            },
            content: function () {
                'step 0'
                var target = get.translation(trigger.player);
                var choiceList = [
                    '令' + target + '获得牌堆里的一张【杀】',
                    '令' + target + '将一张手牌交给另一名角色，然后' + target + '摸一张牌'
                ];
                var list = ['选项一'];
                if (trigger.player.countCards('h')) list.push('选项二');
                else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + '</span>';
                player.chooseControl(list).set('prompt', '毅谋：请选择一项').set('choiceList', choiceList).set('ai', function () {
                    var evt = _status.event.getTrigger(), list = _status.event.list;
                    var target = evt.player;
                    if (target.countCards('h') && list.contains('选项二')) return '选项二';
                    return '选项一';
                }).set('list', list);
                'step 1'
                event.choice = result.control;
                'step 2'
                if (event.choice != '选项二') {
                    var card = get.cardPile2(function (card) {
                        return card.name == 'sha';
                    });
                    if (card) trigger.player.gain(card, 'gain2');
                    else game.log('但牌堆里已经没有', '#y杀', '了！');
                    if (event.choice == '选项一') event.finish();
                }
                'step 3'
                if (event.choice != '选项一') {
                    if (trigger.player.countCards('h')) trigger.player.chooseCardTarget({
                        prompt: '将一张手牌交给另一名其他角色并摸一张牌',
                        filterCard: true,
                        forced: true,
                        filterTarget: lib.filter.notMe,
                        ai1: function (card) {
                            return 1 / Math.max(0.1, get.value(card));
                        },
                        ai2: function (target) {
                            var player = _status.event.player, att = get.attitude(player, target);
                            if (target.hasSkillTag('nogain')) att /= 9;
                            return 4 + att;
                        },
                    });
                    else event.finish();
                }
                'step 4'
                var target = result.targets[0];
                trigger.player.line(target);
                trigger.player.give(result.cards, target);
                trigger.player.draw(1);
            },
            ai: { expose: 0.3 },
            intro: {
                content: "当你1距离内的角色受到伤害后，你可以选择一项：1.令其从牌堆获得一张【杀】；2.令其将一张手牌交给另一名角色，然后其摸一张牌。（若目标无手牌则对应选项不可选）",
                markcount: () => 0
            }
        },
        // 乐就
        mbcuijin: {
            group: ['mbcuijin_damage'],
            audio: 2,
            trigger: { global: 'useCard' },
            direct: true,
            filter: function (event, player) {
                return event.card.name == "sha" && 
                       (event.player == player || player.inRange(event.player)) && 
                       player.countCards('he') > 0;
            },
            content: function () {
                'step 0'
                if (player != game.me && !player.isOnline()) game.delayx();
                var target = trigger.player;
                event.target = target;
                player.chooseToDiscard('he', get.prompt('mbcuijin', target), '弃置一张牌并令' + get.translation(trigger.player) + '使用的【杀】伤害+1，但若其未造成伤害，则你摸一张牌并对其造成1点伤害。').set('ai', function (card) {
                    if (_status.event.goon) return 7 - get.value(card);
                    return 0;
                }).set('goon', function () {
                    var d1 = true;
                    if (trigger.player.hasSkill('jueqing') || trigger.player.hasSkill('gangzhi')) d1 = false;
                    for (var target of trigger.targets) {
                        if (!target.mayHaveShan() || trigger.player.hasSkillTag('directHit_ai', true, {
                            target: target,
                            card: trigger.card,
                        }, true)) {
                            if (!target.hasSkill('gangzhi')) d1 = false;
                            if (!target.hasSkillTag('filterDamage', null, {
                                player: trigger.player,
                                card: trigger.card,
                            }) && get.attitude(player, target) < 0) return true;
                        }
                    }
                    if (d1) return get.damageEffect(trigger.player, player, player) > 0;
                    return false;
                }()).logSkill = ['mbcuijin', target];
                
                'step 1'
                if (result.bool) {
                    if (typeof trigger.baseDamage != 'number') trigger.baseDamage = 1;
                    trigger.baseDamage++;
                    player.addSkill('mbcuijin_damage');
                    player.markAuto('mbcuijin_damage', [trigger.card]);
                    if (!player.storage.mbcuijin_map) player.storage.mbcuijin_map = {};
                    player.storage.mbcuijin_map[trigger.card.cardid] = trigger.targets.slice();
                }
            },
            subSkill: {
                damage: {
                    trigger: {
                        global: ['damage', 'damageCancelled', 'damageZero', 'shaMiss', 'useCardToExcluded', 'useCardToEnd', 'eventNeutralized', 'useCardAfter', 'shaCancelled'],
                    },
                    forced: true,
                    silent: true,
                    firstDo: true,
                    charlotte: true,
                    onremove: true,
                    filter: function (event, player, name) {
                        if (!event.card) return false;
                        if (event.card.name != "sha") return false;
                        var cards = player.getStorage('mbcuijin_damage');
                        if (!cards.contains(event.card)) return false;
                        return true;
                    },
                    content: function () {
                        'step 0'
                        var card = trigger.card;
                        if (event.triggername == 'useCardAfter') {
                            var cards = player.getStorage('mbcuijin_damage');
                            cards = cards.remove(card);
                            if (!cards.length) {
                                player.removeSkill('mbcuijin_damage');
                                delete player.storage.mbcuijin_map;
                            } else {
                                delete player.storage.mbcuijin_map[card.cardid];
                            }
                            event.finish();
                        } else {
                            var target, source;
                            if (trigger.name.indexOf('damage') == 0) {
                                target = trigger.player;
                                source = trigger.source;
                            } else {
                                target = trigger.target;
                                source = trigger.player;
                            }
                            if (player.storage.mbcuijin_map[card.cardid].contains(target) && !target.hasHistory('damage', evt => {
                                return evt.card == card;
                            })) {
                                player.logSkill('mbcuijin_damage', source);
                                player.storage.mbcuijin_map[card.cardid].remove(target);
                                player.draw(1);
                                if (source && source.isIn()) {
                                    player.line(trigger.player, 'green');
                                    trigger.player.damage();
                                }
                            }
                        }
                        
                        'step 1'
                        game.delayx();
                    },
                },
            },
            ai: {
                expose: 0.3,
                threaten: 1.6
            },
            intro: {
                content: "你或你攻击范围内的角色使用【杀】时，你可以弃置一张牌令此牌造成的伤害值+1。若此牌未造成伤害，你摸一张牌并对使用者造成1点伤害。",
                markcount: () => 0
            }
        },
        // 数·刘徽
        mb_geyuan: {
            audio: "ext:手杀武将/audio/skill:2",
            trigger: { player: "useCard" },
            mark: true,
            intro: {
                content: function(storage, player) {
                    player.storage = player.storage || {};
                    const pos = player.storage.mb_geyuan_pos || 0;
                    const count = player.storage.mb_geyuan_count || 0;
                    const pi = lib.skill.mb_geyuan?.piDigits || this.piDigits;
                    const currentDigit = parseInt(pi[pos]) || 0;
                    const nextDigits = pi.slice(pos, pos + 10) || "";
                    return "当前点数：" + currentDigit + "<br>" +
                           "后续数字：" + nextDigits + "...<br>" +
                           "已发动次数：" + count + "<br>";
                }
            },
            piDigits: "141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273",
            getConvertedNumber: function(card, player) {
                const num = card?.number || 0;
                if (player.hasSkill("mb_chongcha") && num >= 10 && num <= 13) {
                    return 0;
                }
                return num;
            },
            filter: function(event, player) {
                const card = event.card;
                if (!card) return false;
                const cardNumber = lib.skill.mb_geyuan?.getConvertedNumber(card, player) || 0;
                if (cardNumber === undefined || cardNumber === null) return false;
                player.storage = player.storage || {};
                const pos = player.storage.mb_geyuan_pos || 0;
                const pi = lib.skill.mb_geyuan?.piDigits || this.piDigits;
                const currentDigit = parseInt(pi[pos]) || 0;
                return cardNumber === currentDigit;
            },
            content: function(event, trigger, player) {
                player.storage = player.storage || {};
                const pos = player.storage.mb_geyuan_pos || 0;
                const count = player.storage.mb_geyuan_count || 0;
                const pi = lib.skill.mb_geyuan?.piDigits || this.piDigits;
                const currentDigit = parseInt(pi[pos]) || 0;
                const drawNum = count + 1;
                game.log(player, "匹配圆周率第" + (pos + 1) + "位数字「" + currentDigit + "」");
                player.draw(drawNum);
                player.storage.mb_geyuan_count = count + 1;
                const newPos = (pos + 1) % (pi.length || 1);
                player.storage.mb_geyuan_pos = newPos;
                const nextDigit = parseInt(pi[newPos]) || 0;
                game.log(player, "下一个目标点数变为「" + nextDigit + "」");
                player.popup(nextDigit);
                player.markSkill("mb_geyuan");
            },
            init: function(player) {
                player.storage = player.storage || {};
                player.storage.mb_geyuan_pos = 0;
                player.storage.mb_geyuan_count = 0;
                player.markSkill("mb_geyuan");
            },
            onremove: function(player) {
                if (player.storage) {
                    delete player.storage.mb_geyuan_pos;
                    delete player.storage.mb_geyuan_count;
                }
            }
        },
        mb_chongcha: {
            audio: "ext:手杀武将/audio/skill:2",
            enable: "phaseUse",
            usable: 1,
            filter: function(event, player) {
                return player.hasSkill("mb_geyuan") && (player.countCards("he") || 0) > 0;
            },
            filterCard: true,
            position: "he",
            check: function(card) {
                return card ? 8 - (get.value(card) || 0) : 0;
            },
            content: function(event, trigger, player) {
                player.storage = player.storage || {};
                const pi = lib.skill.mb_geyuan?.piDigits || "";
                const pos = player.storage.mb_geyuan_pos || 0;
                const newPos = (pos + 1) % (pi.length || 1);
                player.storage.mb_geyuan_pos = newPos;
                const nextDigit = parseInt(pi[newPos]) || 0;
                game.log(player, "将【圆割】的目标点数调整为「" + nextDigit + "」");
                player.popup(nextDigit);
                player.markSkill("mb_geyuan");
            },
            mod: {
                maxHandcardBase: function(player, num) {
                    const cards = player.getCards("h") || [];
                    let count = 0;
                    for (let card of cards) {
                        const number = card?.number || 0;
                        const effective = (number >= 10 && number <= 13) ? 0 : number;
                        if (effective === 0) {
                            count++;
                        }
                    }
                    return num + count;
                }
            },
            ai: {
                order: 9,
                result: {
                    player: function(player) {
                        player.storage = player.storage || {};
                        const pos = player.storage.mb_geyuan_pos || 0;
                        const pi = lib.skill.mb_geyuan?.piDigits || "";
                        const currentDigit = parseInt(pi[pos]) || 0;
                        const cards = player.getCards("h") || [];
                        for (let card of cards) {
                            let num = card?.number || 0;
                            if (num >= 10) num = 0;
                            if (num === currentDigit) {
                                return 0;
                            }
                        }
                        return 1;
                    }
                }
            }
        },
        // 势王昶
        mbkaiji: {
            audio: 2,
            trigger: { player: 'phaseZhunbeiBegin' },
            direct: true,
            content: function () {
                'step 0'
                var num = 1 + player.getStorage('mbkaiji').length;
                player.chooseTarget([1, num], get.prompt('mbkaiji'), '令至多' + get.cnNumber(num) + '名角色各摸一张牌').set('ai', function (target) {
                    return Math.sqrt(5 - Math.min(4, target.countCards('h'))) * get.attitude(_status.event.player, target) * (target.hasSkillTag('nogain') ? 0.1 : 1);
                });
                'step 1'
                if (result.bool) {
                    var targets = result.targets.sortBySeat();
                    event.targets = targets;
                    player.logSkill('mbkaiji', targets);
                    if (targets.length == 1) targets[0].draw();
                    else game.asyncDraw(targets);
                }
                else event.finish();
                'step 2'
                if (targets.length > 1) game.delayx();
                if (game.hasPlayer(function (current) {
                    return targets.contains(current) && current.hasHistory('gain', function (evt) {
                        return evt.getParent(2) == event && get.type(evt.cards[0], current) != 'basic';
                    })
                })) player.draw();
            },
            group: 'mbkaiji_count',
            subSkill: {
                count: {
                    trigger: { global: 'dying' },
                    forced: true,
                    firstDo: true,
                    silent: true,
                    popup: false,
                    charlotte: true,
                    filter: function (event, player) {
                        return !player.getStorage('mbkaiji').contains(event.player);
                    },
                    content: function () {
                        player.markAuto('mbkaiji', [trigger.player]);
                    },
                },
            },
        },
        mbshepan: {
            audio: 2,
            trigger: { target: 'useCardToTargeted' },
            usable: 1,
            direct: true,
            filter: function (event, player) {
                // 新增：每轮每种牌名限一次
                const cardName = event.card?.name;
                if (!cardName) return false;
                // 初始化每轮牌名使用记录
                if (!player.storage.mbshepan_roundRecord) {
                    player.storage.mbshepan_roundRecord = new Set();
                }
                // 检查是否已使用过该牌名（每轮重置）
                if (player.storage.mbshepan_roundRecord.has(cardName)) return false;
                return player != event.player;
            },
            content: function () {
                'step 0'
                var target = trigger.player;
                event.target = target;
                var choiceList = [
                    '摸一张牌',
                    '将' + get.translation(target) + '区域内的一张牌置于牌堆顶',
                ];
                var choices = ['选项一'];
                if (target.countCards('hej') > 0) choices.push('选项二');
                else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + '</span>';
                choices.push('cancel2');
                player.chooseControl(choices).set('choiceList', choiceList).set('choice', function () {
                    if (choices.length > 2 && get.effect(target, { name: 'guohe_copy' }, player, player) > 0) return 1;
                    return 0;
                }())
                'step 1'
                if (result.control != 'cancel2') {
                    // 记录该牌名本轮已使用
                    const cardName = event.card?.name;
                    if (cardName) {
                        player.storage.mbshepan_roundRecord.add(cardName);
                    }
                    player.logSkill('mbshepan', target);
                    if (result.index == 1) player.choosePlayerCard(target, 'hej', true);
                    else {
                        player.draw();
                        event.goto(3);
                    }
                }
                else {
                    player.storage.counttrigger.mbshepan--;
                    event.finish();
                }
                'step 2'
                var card = result.cards[0];
                if (card) { // 仅当选择选项二时执行
                    target.$throw(get.position(card) == 'h' ? 1 : card, 1000);
                    target.lose(card, ui.cardPile, 'insert');
                }
                'step 3'
                game.delayx();
                if (target.isIn() && player.countCards('h') == target.countCards('h')) {
                    // 移除：发动次数归零逻辑
                    // 新增：直接令此牌对你无效（无需选择）
                    trigger.excluded.add(player);
                    game.log(player, '因手牌数与' + get.translation(target) + '相等，此牌对你无效！');
                }
                event.finish();
            },
            // 新增：回合结束时重置每轮使用记录
            subSkill: {
                roundReset: {
                    trigger: { player: 'roundEnd' },
                    forced: true,
                    silent: true,
                    content: function () {
                        if (player.storage.mbshepan_roundRecord) {
                            player.storage.mbshepan_roundRecord.clear();
                        }
                    }
                }
            }
        },

        // 蒋济
        mbjichou: {
            audio: 2,
            enable: 'chooseToUse',
            group: ['mbjichou_ban', 'mbjichou_give'],
            filter: function (event, player) {
                if (player.hasSkill('mbjichou_used') && player.hasSkill('mbjichou_given')) return false;
                if (!player.hasSkill('mbjichou_used')) {
                    var record = player.getStorage('mbjichou');
                    for (var i of lib.inpile) {
                        var type = get.type(i);
                        if (type == 'trick' && !record.contains(i) && event.filterCard({ name: i, isCard: true }, player, event)) return true;
                    }
                }
                return false;
            },
            chooseButton: {
                dialog: function (event, player) {
                    var dialog = ui.create.dialog('急筹');
                    if (!player.hasSkill('mbjichou_used') && !player.hasSkill('mbjichou_given') && event.type == 'phase' && player.countCards('h', card => {
                        return player.getStorage('mbjichou').contains(get.name(card));
                    })) {
                        dialog._chosenOpt = [];
                        var table = document.createElement('div');
                        table.classList.add('add-setting');
                        table.style.margin = '0';
                        table.style.width = '100%';
                        table.style.position = 'relative';
                        var list = ['视为使用牌', '交出锦囊牌'];
                        for (var i of list) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                            td.innerHTML = '<span>' + i + '</span>';
                            td.link = i;
                            if (i == list[0]) {
                                td.classList.add('bluebg');
                                dialog._chosenOpt.add(td);
                            }
                            td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                if (_status.dragged) return;
                                if (_status.clicked) return;
                                if (_status.justdragged) return;
                                _status.tempNoButton = true;
                                _status.clicked = true;
                                setTimeout(function () {
                                    _status.tempNoButton = false;
                                }, 500);
                                var link = this.link;
                                if (link == '交出锦囊牌') game.uncheck();
                                var current = this.parentNode.querySelector('.bluebg');
                                if (current) {
                                    current.classList.remove('bluebg');
                                    dialog._chosenOpt.remove(current);
                                }
                                dialog._chosenOpt.add(this);
                                this.classList.add('bluebg');
                                game.check();
                            });
                            table.appendChild(td);
                            dialog.buttons.add(td);
                        }
                        dialog.content.appendChild(table);
                    }
                    var list = [], record = player.getStorage('mbjichou');
                    for (var name of lib.inpile) {
                        if (get.type(name) == 'trick' && !record.contains(name) && event.filterCard({ name: name, isCard: true }, player, event)) list.push(['锦囊', '', name]);
                    }
                    dialog.add([list, 'vcard']);
                    return dialog;
                },
                filter: function (button) {
                    //var opts=_status.event.dialog._chosenOpt;
                    // if(opts&&opts.length&&opts[0].link=='交出锦囊牌'&&typeof button.link!=typeof opts[0].link){
                    // 	return false;
                    // }
                    return true;
                },
                select: function () {
                    var opts = _status.event.dialog._chosenOpt;
                    return opts && opts.length && opts[0].link == '交出锦囊牌' ? 0 : 1;
                },
                check: function (button) {
                    if (_status.event.getParent().type != 'phase') return 1;
                    var player = _status.event.player;
                    if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].contains(button.link[2])) return 0.1;
                    return player.getUseValue({ name: button.link[2] });
                },
                backup: function (links, player) {
                    var isUse = links.length == 1;
                    var backup = get.copy(lib.skill['mbjichou_' + (isUse ? 'use' : 'give')]);
                    if (isUse) backup.viewAs = { name: links[0][2], isCard: true };
                    return backup;
                },
                prompt: function (links, player) {
                    var isUse = links.length == 1;
                    return '急筹：' + (isUse ? ('视为使用' + get.translation(links[0][2]) + '') : '选择要交出的牌和要交给的目标');
                }
            },
            hiddenCard: function (player, name) {
                if (player.hasSkill('mbjichou_used')) return false;
                var type = get.type(name);
                return type == 'trick' && !player.getStorage('mbjichou').contains(name);
            },
            marktext: '筹',
            intro: {
                markcount: function (storage, player) {
                    if (storage && storage.length) return storage.length;
                    return 0;
                },
                content: '已记录牌名：$',
            },
            ai: {
                order: 1,
                result: {
                    player: function (player) {
                        if (_status.event.dying) return get.attitude(player, _status.event.dying);
                        return 1;
                    },
                },
            },
            subSkill: {
                backup: {},
                used: { charlotte: true },
                given: { charlotte: true },
                ban: {
                    trigger: { global: 'useCard1' },
                    filter: function (event, player) {
                        return player.getStorage('mbjichou').contains(event.card.name);
                    },
                    forced: true,
                    locked: false,
                    silent: true,
                    content: function () {
                        trigger.directHit.add(player);
                    },
                    mod: {
                        cardEnabled: function (card, player) {
                            if (player.getStorage('mbjichou').contains(card.name) && (get.position(card) == 'h' || card.cards && card.cards.some(i => get.position(i) == 'h'))) return false;
                        },
                        cardSavable: function (card, player) {
                            if (player.getStorage('mbjichou').contains(card.name) && (get.position(card) == 'h' || card.cards && card.cards.some(i => get.position(i) == 'h'))) return false;
                        },
                        aiValue: function (player, card) {
                            if (get.type(card) != 'trick' || _status.mbjichou_give_aiCheck) return;
                            if (!player.getFriends().length && player.getStorage('mbjichou').contains(get.name(card))) return 0;
                        },
                        aiUseful: function () {
                            return lib.skill.mbjichou_ban.mod.aiValue.apply(this, arguments);
                        },
                    },
                },
                use: {
                    filterCard: () => false,
                    selectCard: -1,
                    audio: 'mbjichou',
                    popname: true,
                    onuse: function (links, player) {
                        player.markAuto('mbjichou', [links.card.name]);
                        player.syncStorage('mbjichou');
                        player.addTempSkill('mbjichou_used');
                    },
                },
                give: {
                    audio: 'mbjichou',
                    enable: 'phaseUse',
                    filter: function (event, player) {
                        return player.hasSkill('mbjichou_used') && !player.hasSkill('mbjichou_given') && player.countCards('h', i => player.getStorage('mbjichou').contains(get.name(i)));
                    },
                    filterTarget: function (card, player, target) {
                        return target != player;
                    },
                    filterCard: function (card, player) {
                        return player.getStorage('mbjichou').contains(get.name(card));
                    },
                    check: function (card) {
                        _status.mbjichou_give_aiCheck = true;
                        var val = get.value(card);
                        delete _status.mbjichou_give_aiCheck;
                        return val;
                    },
                    prompt: () => '选择要交出的牌和要交给的目标',
                    selectCard: 1,
                    discard: false,
                    lose: false,
                    delay: false,
                    content: function () {
                        player.give(cards, target);
                        player.addTempSkill('mbjichou_given', 'phaseUseAfter');
                    },
                    ai: {
                        order: 0.9,
                        result: {
                            target: function (player, target) {
                                if (target.hasSkillTag('nogain')) return 0;
                                if (target.hasJudge('lebu')) return 0;
                                return target.getCards('h', card => player.getStorage('mbjichou').contains(get.name(card))).reduce((p, c) => p + (target.getUseValue(c) || 1), 0);
                            }
                        },
                    }
                },
            }
        },
        mbjilun: {
            audio: 2,
            trigger: { player: 'damageEnd' },
            direct: true,
            content: function () {
                'step 0'
                var num = Math.min(Math.max(1, player.getStorage('mbjichou').length), 3);
                event.num = num;
                var choices = ['选项一'];
                var choiceList = ['摸' + get.cnNumber(num) + '张牌', '视为使用一张在〖急筹〗记录内且不在〖机论〗记录内的普通锦囊牌'];
                if ((!player.getStorage('mbjichou').length) || player.getStorage('mbjichou').filter(name => {
                    return !player.getStorage('mbjilun').contains(name) && player.hasUseTarget({ name: name });
                }).length == 0)
                    choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + '</span>';
                else choices.push('选项二');
                player.chooseControl(choices, 'cancel2').set('choiceList', choiceList).set('prompt', get.prompt('mbjilun')).set('ai', () => {
                    if (_status.event.choiceList.length == 1 || !player.getStorage('mbjichou').length) return 0;
                    var val = _status.event.num > 3 ? Math.min(1.5, 1 + (_status.event.num - 3) * 0.1) : 1;
                    for (var name of player.getStorage('mbjichou')) {
                        if (player.getStorage('mbjilun').contains(name)) continue;
                        if (player.getUseValue({ name: name }) > 4 * val) return 1;
                    }
                    return 0;
                }).set('num', num);
                'step 1'
                if (result.control != 'cancel2') {
                    if (result.control == '选项一') {
                        player.logSkill('mbjilun');
                        player.draw(num);
                        event.finish();
                    }
                    else {
                        var list = [];
                        for (var name of player.getStorage('mbjichou')) {
                            if (!player.getStorage('mbjilun').contains(name)) {
                                list.push(['锦囊', '', name]);
                            }
                        }
                        player.chooseButton(['###机论###<div class="text center">是否视为使用一张〖急筹〗已记录的普通锦囊牌？</div>', [list, 'vcard']]).set('filterButton', button => {
                            return _status.event.player.hasUseTarget({ name: button.link[2] });
                        }).set('ai', button => {
                            return _status.event.getParent().player.getUseValue({ name: button.link[2] }, null, true);
                        });
                    }
                } else event.finish();
                'step 2'
                if (result.bool) {
                    var card = { name: result.links[0][2], isCard: true };
                    player.chooseUseTarget(card, true).set('logSkill', 'mbjilun');
                    player.markAuto('mbjilun', [card.name]);
                    player.syncStorage('mbjilun');
                } else event.goto(0);
            },
            marktext: '论',
            intro: {
                markcount: function (storage, player) {
                    if (storage && storage.length) return storage.length;
                    return 0;
                },
                content: '已记录牌名：$',
            },
            ai: {
                maixie: true,
                maixie_defend: true,
                threaten: 0.7,
            }
        },
        spzhenjun: {
            audio: "ext:手杀武将/audio/skill:2",
            trigger: {
                player: 'phaseUseBegin'
            },
            direct: true,
            filter: function (event, player) {
                return player.countCards('he') > 0;
            },
            content: function () {
                'step 0'
                player.chooseCardTarget({
                    filterCard: true,
                    filterTarget: lib.filter.notMe,
                    position: 'he',
                    prompt: get.prompt2('spzhenjun'),
                    ai1: function (card) {
                        var player = _status.event.player;
                        if (card.name == 'sha' && get.color(card) == 'red') {
                            for (var i = 0; i < game.players.length; i++) {
                                var current = game.players[i];
                                if (current != player && get.attitude(player, current) > 0 && current.hasValueTarget(card)) return 7;
                            }
                            return 0;
                        }
                        return 7 - get.value(card);
                    },
                    ai2: function (target) {
                        var player = _status.event.player;
                        var card = ui.selected.cards[0];
                        var att = get.attitude(player, target);
                        if (get.value(card) < 0) return -att * 2;
                        if (target.countCards('h', { name: 'sha', color: 'red' }) || target.hasSkill('wusheng') || target.hasSkill('new_rewusheng') || target.hasSkill('wushen') || (card.name == 'sha' && get.color(card) == 'red' && target.hasValueTarget(card))) return att * 2;
                        var eff = 0;
                        game.countPlayer(function (current) {
                            if (target != current && get.distance(target, current, 'attack') > 1) return;
                            var eff2 = get.damageEffect(current, player, player);
                            if (eff2 > eff) eff = eff2;
                        });
                        if (att > 0 && eff > 0) eff += 2 * att;
                        return eff;
                    },
                });
                'step 1'
                if (result.bool) {
                    var target = result.targets[0];
                    event.target = target;
                    player.logSkill('spzhenjun', target);
                    player.give(result.cards, target)
                }
                else event.finish();
                'step 2'
                target.chooseToUse({
                    filterCard: function (card) {
                        return get.name(card) == 'sha' && get.color(card) != 'black' && lib.filter.cardEnabled.apply(this, arguments);
                    },
                    prompt: '请使用一张不为黑色的【杀】，否则' + get.translation(player) + '可以对你或你攻击范围内的一名其他角色造成1点伤害',
                });
                'step 3'
                if (result.bool) {
                    var num = 1;
                    game.countPlayer2(function (current) {
                        current.getHistory('damage', function (evt) {
                            if (evt.getParent(evt.notLink() ? 4 : 8) == event) num += evt.num;
                        });
                    });
                    player.draw(num);
                    event.finish();
                }
                else {
                    player.chooseTarget('是否对' + get.translation(target) + '或其攻击范围内的一名角色造成1点伤害？', function (card, player, target) {
                        return target == _status.event.targetx || _status.event.targetx.inRange(target);
                    }).set('targetx', event.target).ai = function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player)
                    };
                }
                'step 4'
                if (result.bool) {
                    player.line(result.targets);
                    result.targets[0].damage('nocard');
                }
            },
        },
        // 势邓艾
        mbtuntian: {
            audio: "ext:手杀武将/audio/skill:2",
            enable: 'phaseUse',
            usable: 1,
            filterCard: function() { return false; },
            selectCard: [-2, -1],
            mark: true,
            marktext: '蓄力', 
            filter: function(evt, player) {
                return player.countMark('mbtuntian') > 0;
            },
            content: function() {
                'step 0'
                var len = player.countMark('mbtuntian');
                event.numbers = [];
                for (var i = 1; i <= len; i++) {
                    event.numbers.push(i);
                }
                'step 1'
                if(lib.config){
                    window.shuzibg = ui.create.div('.shuzibgxx', document.body);
                    if(window.shoushaBlanks) window.shoushaBlanks.add(window.shuzibg);

                    var leftBtn  = ui.create.div('.shuzijianhao', window.shuzibg);
                    var rightBtn = ui.create.div('.shuzijiahao',  window.shuzibg);
                    var showNum  = ui.create.div('.shuzixx',      window.shuzibg);

                    var list = event.numbers;    
                    var index = 0;                    
                    player.storage.mbtuntian_mark = index;

                    showNum.innerHTML = list[index];
                    var updateBtn = function(){
                        leftBtn.style.filter  = index <= 0 ? 'grayscale(100%)' : 'none';
                        rightBtn.style.filter = index >= list.length-1 ? 'grayscale(100%)' : 'none';
                    };
                    updateBtn();

                    leftBtn.listen(function(){
                        if(index === 0) return;
                        index--;
                        leftBtn.style.transform = 'scale(0.7)';
                        setTimeout(function(){ leftBtn.style.transform = 'scale(1)'; }, 200);
                        showNum.innerHTML = list[index];
                        player.storage.mbtuntian_mark = index;
                        updateBtn();
                    });
                    rightBtn.listen(function(){
                        if(index === list.length-1) return;
                        index++;
                        rightBtn.style.transform = 'scale(0.7)';
                        setTimeout(function(){ rightBtn.style.transform = 'scale(1)'; }, 200);
                        showNum.innerHTML = list[index];
                        player.storage.mbtuntian_mark = index;
                        updateBtn();
                    });

                    player.chooseBool(
                        '请选择至多等量角色各获得一张红桃牌',
                        true
                    ).set('ai', function(){
                        return 0;   
                    });
                }else{
                    player.chooseControl(event.numbers)
                        .set('prompt', get.prompt(event.name))
                        .set('prompt2', '请选择要消耗的蓄力点数量，然后令至多等量角色随机获得一张红桃牌')
                        .set('ai', function() {
                            return 0;   
                        });
                }
                'step 2'
                var num;
                if(lib.config){
                    num = player.storage.mbtuntian_mark + 1;
                    window.shuzibg.remove();
                    window.shuzibg = null;
                }else{
                    num = result.index + 1;
                }
                player.removeMark('mbtuntian', num);
                player.storage.mbtuntian_lastCost = num;        
                player.markSkill('mbtuntian');
                var reds = [];
                var getHeart = function(pile) {
                    for (var i = 0; i < pile.childNodes.length; i++) {
                        var card = pile.childNodes[i];
                        if (get.suit(card) === 'heart') reds.push(card);
                    }
                };
                getHeart(ui.cardPile);
                getHeart(ui.discardPile);
                if (!reds.length) {
                    event.finish();
                    return;
                }
                event.reds = reds;
                event.needNum = Math.min(num, reds.length);
                player.chooseTarget([1, event.needNum],
                    '请选择至多 ' + get.cnNumber(event.needNum) + ' 名角色，其各从牌堆或弃牌堆里随机获得一张红桃牌'
                ).set('ai', function(target) {
                    return get.attitude(player, target);
                });
                'step 3'
                if (!result.bool) { event.finish(); return; }

                var targets = result.targets.sortBySeat();
                var cards = event.reds.randomGets(targets.length);
                targets.forEach(function(to) {
                    if (cards.length) {
                        to.gain(cards.shift(), 'gain2');
                    }
                });
            },
            group: ['mbtuntian_gain', 'mbtuntian_max'],
            subSkill: {
                gain: {
                    audio: 'mbtuntian',
                    forced: true,
                    trigger: { player: 'loseAfter' },
                    filter: function(evt, player) {
                        if (!evt.cards || !evt.cards.length) return false;
                        if (evt.getParent && evt.getParent().name === 'useCard') {
                            var allEquip = evt.cards.every(function(card) {
                                return get.type(card) === 'equip';
                            });
                            if (allEquip) return false;   
                        }              
                        return evt.cards.some(function(card) {                
                            return card.name !== 'shandian' && !get.tag(card, 'damage');
                        });
                    },
                    content: function() {
                        var gain = 0;
                        for (var i = 0; i < trigger.cards.length; i++) {
                            var card = trigger.cards[i];
                            if (card.name !== 'shandian' && !get.tag(card, 'damage')) gain++;
                        }
                        if (gain <= 0) return;
                        var max = player.storage.mbtuntian_max;
                        if (typeof max !== 'number') max = 0;
                        var cur = player.countMark('mbtuntian');
                        var add = Math.min(gain, max - cur);
                        if (add > 0) {
                            player.addMark('mbtuntian', add);
                            player.markSkill('mbtuntian'); 
                        }
                    }
                },
                max: {
                    audio: 'mbtuntian',
                    forced: true,
                    trigger: { global: 'phaseBegin' },
                    filter: function(evt, player) {
                        var max = player.storage.mbtuntian_max;
                        if (typeof max !== 'number') max = 0;
                        return player.countMark('mbtuntian') >= max;
                    },
                    content: function() {
                        player.draw();
                        if (typeof player.storage.mbtuntian_max !== 'number') player.storage.mbtuntian_max = 0;
                        player.storage.mbtuntian_max += 1;
                        player.markSkill('mbtuntian'); 
                    }
                }
            },
            intro: {
                name: '蓄力',     
                markcount: function(storage, player) {
                    var max = player.storage.mbtuntian_max;
                    if (typeof max !== 'number') max = 0;
                    return player.countMark('mbtuntian') + '/' + max;
                },
                content: function(storage, player) {
                    var max = player.storage.mbtuntian_max;
                    if (typeof max !== 'number') max = 0;
                    return '<div style="text-align:center;">蓄力点<br>' + player.countMark('mbtuntian') + ' / ' + max + '</div>';
                }
            },
            ai: {
                order: 10,
                result: { player: 1 }
            }
        },
        mbzaoxian: {
            audio: "ext:手杀武将/audio/skill:2",
            locked: true,
            forced: true,
            trigger: { player: "useSkillAfter" },
            filter: function(evt, player) {
                return evt.skill === "mbtuntian" &&
                       typeof player.storage.mbtuntian_lastCost === "number";
            },
            content: function() {
                var cost = player.storage.mbtuntian_lastCost;
                var names = [];       
                if (cost >= 3) names.push("wuzhong");
                if (cost >= 5) names.push("wuxie");
                if (cost >= 7) names.push("wugu");     
                if (!names.length) return;       
                var cards = [];
                names.forEach(function(name) {
                    var card = get.discardPile(function(c) {
                        return c.name === name;
                    });
                    if (card) cards.push(card);
                });      
                if (cards.length) player.gain(cards, "gain2");  
                delete player.storage.mbtuntian_lastCost;
            }
        },
        mbjixi: {
            audio: "ext:手杀武将/audio/skill:2",
            trigger: { global: 'phaseEnd' },
            filter: function (evt, player) {
                // 本回合内，是否存在"成为过你牌目标的其他角色"
                var tmp = [];
                player.getHistory('useCard', function (e) {
                    if (!e.targets || !e.targets.length) return;
                    e.targets.forEach(function (t) {
                        if (t !== player && !tmp.contains(t)) tmp.push(t);
                    });
                });
                return tmp.length > 0;
            },
            direct: true,
            content: function () {
                'step 0'
                // 收集本回合你指定过的其他目标（去重）
                var tmp = [];
                player.getHistory('useCard', function (e) {
                    if (!e.targets || !e.targets.length) return;
                    e.targets.forEach(function (t) {
                        if (t !== player && !tmp.contains(t)) tmp.push(t);
                    });
                });
                event.list = tmp;
                if (!event.list.length) { event.finish(); return; }

                // 你可弃置当前回合角色一张牌
                player.chooseTarget(
                    '是否弃置当前回合角色一张牌？',
                    function (card, player, target) {
                        return target === _status.currentPhase;
                    }
                ).set('ai', function (target) {
                    return -get.attitude(player, target);
                });

                'step 1'
                if (!result.bool) { event.finish(); return; }
                var cur = result.targets[0];
                player.logSkill('mbjixi', cur);
                player.discardPlayerCard(cur, 1, 'he', true);

                'step 2'
                // 以"本回合内你牌指定过的角色"为目标池，任意选若干名（至少1名）
                player.chooseTarget(
                    [1, event.list.length],
                    '选择任意名本回合成为过你牌目标的角色，视为对其使用一张无视距离的【顺手牵羊】',
                    function (card, player, target) {
                        return event.list.contains(target);
                    }
                ).set('ai', function (target) {
                    return get.effect(target, { name: 'shunshou' }, player, player);
                });

                'step 3'
                if (result.bool && result.targets && result.targets.length) {
                    // 关键：只视为使用"一张"，targets 传入你选的那一批；并无视距离
                    player.useCard({ name: 'shunshou', isCard: true }, result.targets)
                        .set('modTargetEnabled', true);
                }
            }
        },
        //集蜜袁术
        mbjimi: {
            audio: 'ext:手杀武将/audio/skill:4',
            forced: true,
            trigger: {
                global: 'phaseBefore',
                player: 'enterGame'
            },
            filter: function (event, player) {
                return event.name != 'phase' || game.phaseNumber == 0;
            },
            logTarget: function () {
                return game.players;
            },
            content: function () {
                const usedCards = [];
                for (const target of game.filterPlayer()) {
                    target.storage._start_cards = target.getCards('h');
                    const cards = target.getCards('h', function (card) {
                        return !['tao', 'jiu'].includes(get.name(card));
                    });
                    player.lose(cards)._triggered = null;
                    const cards2 = [];
                    for (const card of cards) {
                        let match = get.cardPile(function (card) {
                            return ['tao', 'jiu'].includes(get.name(card)) && !usedCards.includes(card);
                        });
                        if (!match) {
                            match = game.createCard(['tao', 'jiu'].randomGet());
                        } else {
                            usedCards.push(match);
                        }
                        cards2.push(match);
                        ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                    }
                    target.directgain(cards2);
                }
            },
            group: 'mbjimi_gain',
            subSkill: {
                gain: {
                    forced: true,
                    trigger: {
                        global: ['loseAfter', 'loseAsyncAfter', 'cardsDiscardAfter', 'equipAfter']
                    },
                    filter: function (event, player) {
                        if (event.name == 'cardsDiscard') {
                            const evt = event.getParent();
                            if ((evt.relatedEvent || evt.getParent()).name == 'useCard') {
                                return false;
                            }
                        }
                        return event.getd && event.getd().some(function (card) {
                            return ['tao', 'jiu'].includes(get.name(card));
                        });
                    },
                    content: function () {
                        const num = get.discarded().filter(function (card) {
                            return ['tao', 'jiu'].includes(get.name(card));
                        }).length;
                        const card = get.cardPile(function (card) {
                            return get.tag(card, 'damage') && get.translation(card.name).length == num;
                        });
                        if (card) {
                            player.gain(card, 'gain2');
                        }
                    }
                }
            }
        },
        mbmaodie: {
            audio: 'ext:手杀武将/audio/skill:4',
            forced: true,
            trigger: { player: 'useCardAfter' },
            content() {
                if (player.hasHistory('sourceDamage', evt => evt.card == trigger.card)) {
                    player.addTempSkill(`mbmaodie_limit`);
                    player.storage.mbmaodie_limit = get.number(trigger.card) || 0;
                    player.markSkill('mbmaodie_limit');
                } else {
                    if (trigger.targets?.length) {
                        const card = trigger.targets.flatMap(target => target.storage._start_cards.filter(card => 'cdhej'.includes(get.position(card)) && get.owner(card) !== player)).randomGet();
                        if (card) {
                            let animate = ['gain2'];
                            if (get.owner(card)) {
                                animate = [get.owner(card), 'giveAuto'];
                            }
                            player.gain(card, ...animate);
                        }
                    }
                }
            },
            subSkill: {
                limit: {
                    charlotte: true,
                    onremove: true,
                    silent: true,
                    trigger: { player: 'useCard1' },
                    filter(event, player) {
                        return get.tag(event.card, 'damage');
                    },
                    content() {
                        player.removeSkill('mbmaodie_limit');
                    },
                    mod: {
                        cardEnabled(card, player) {
                            const storage = player.storage.mbmaodie_limit;
                            if (!storage || typeof storage != 'number' || !get.tag(card, 'damage')) {
                                return;
                            }
                            return get.number(card) > storage;
                        },
                    },
                    intro: {
                        markcount: storage => storage,
                        content: '下一次使用的伤害牌点数需大于#',
                    },
                },
            },
        },
        //蒋琬
        mbzhenting: {
            audio: 'ext:手杀武将/audio/skill:4',
            trigger: { global: 'useCardToTarget' },
            usable: 1,
            filter: function (event, player) {
                var target = event.target;
                return (event.card.name == 'sha' || get.type(event.card, false) == 'delay') &&
                    event.player != player &&
                    (target == player || player.inRange(target));
            },
            logTarget: 'target',
            check: function (event, player) {
                var target = event.target, source = event.player;
                if (target == player) return true;
                var eff1 = get.effect(target, event.card, source);
                var eff2 = get.effect(player, event.card, source);
                if (eff1 >= 0) return false;
                if (eff2 >= 0) return true;
                if (event.card.name == 'sha') {
                    if (player.hasShan()) return true;
                    if (eff1 > eff2) return false;
                    if (player.hp > 2) return true;
                    if (player.hp == 2) return eff2 > eff1 / 3;
                    return false;
                }
                if (event.card.name == 'shandian' || event.card.name == 'bingliang') return true;
                if (event.card.name == 'lebu') return !player.needsToDiscard() && target.needsToDiscard();
                return false;
            },
            content: function () {
                player.storage.mbzhenting_count = player.storage.mbzhenting_count || 0;
                'step 0'
                var target = trigger.target;
                var evt = trigger.getParent();
                if (target != player) {
                    evt.triggeredTargets2.remove(target);
                    evt.target.remove(target);
                    evt.triggeredTargets2.add(player);
                    evt.target.add(player);
                    game.log(trigger.card, '的目标被改为了', player);
                }
                trigger.untrigger();
                'step 1'
                player.storage.mbzhenting_count += 1;
                var list = [];
                var choiceList = [];
                list.push('选项一');
                choiceList.push('摸一张牌');
                var canDiscard = (trigger.player.countDiscardableCards(player, 'h') > 0);
                if (canDiscard) {
                    list.push('选项二');
                    choiceList.push('弃置' + get.translation(trigger.player) + '的一张手牌');
                }
                if (!player.storage.no_beishui && canDiscard) {
                    list.push('背水！');
                    choiceList.push('背水！执行所有选项');
                }
                list.push('cancel2');
                player.chooseControl(list).set('choiceList', choiceList);
                'step 2'
                if (result.control == 'cancel2') {
                    player.storage.mbzhenting_count -= 1;
                    event.finish();
                    return;
                }
                if (result.control == '选项一') {
                    player.draw();
                } else if (result.control == '选项二') {
                    player.line(trigger.player, 'fire');
                    player.discardPlayerCard(trigger.player, true, 'h');
                } else if (result.control == '背水！') {
                    player.draw();
                    player.line(trigger.player, 'fire');
                    player.discardPlayerCard(trigger.player, true, 'h');
                }
            },
            ai: { threaten: 1.4, directHit: true }
        },
        mbjincui: {
            audio: 'ext:手杀武将/audio/skill:4',
            enable: 'phaseUse',
            usable: 1,
            limited: true,
            skillAnimation: true,
            animationColor: 'orange',
            filterTarget: lib.filter.notMe,
            content: function () {
                'step 0'
                player.awakenSkill('mbjincui');
                game.swapSeat(player, target);
                'step 1'
                var count = player.storage.mbzhenting_count || 0;
                var X = player.hp - count;
                if (count > 0 && X > 0) {
                    player.loseHp(X);
                } else {
                    player.maxHp += 1;
                    player.storage.no_beishui = true;
                }
            },
            ai: { order: 5, result: { player: function () { return 10; } } }
        },
        //木牛流马
        mbshezi: {
            audio: 'ext:手杀武将/audio/skill:2',
            forced: true,
            trigger: {
                player: 'phaseZhunbeiBegin',
            },
            content() {
                'step 0'
                player.chooseTarget(true, `###摄梓###你选择一名角色并选择其一个区域，若其此区域里有装备牌，你获得其此区域里的所有牌！`).set('ai', target => {
                    const player = _status.event.player;
                    return -get.attitude(player, target) * target.countCards('hesxj', c => get.type(c) == 'equip');
                })
                'step 1'
                if (result.bool) {
                    event.target = result.targets[0];
                    player.chooseControl('手牌区', '装备区', '判定区').set('prompt', `###摄梓###请选择${get.translation(event.target)}的一个区域，若其此区域里有装备牌，你获得其此区域里的所有牌`).set('ai', control => {
                        const { target } = _status.event;
                        const areaConfig = [
                            { key: 'h', name: '手牌区' },
                            { key: 'e', name: '装备区' },
                            { key: 'j', name: '判定区' }
                        ];
                        const areaValues = areaConfig.map(area => {
                            const { key } = area;
                            const equipCardCount = target.countCards(key, c => get.type(c) === 'equip');
                            const totalCardCount = target.countCards(key);
                            return {
                                key,
                                value: equipCardCount * totalCardCount
                            };
                        });
                        const maxValue = Math.max(...areaValues.map(item => item.value), 0);
                        const maxArea = areaValues.find(item => item.value === maxValue);
                        const areaName = areaConfig.find(conf => conf.key === maxArea.key)?.name || '';
                        return areaName;
                    }).set('target', event.target);
                } else {
                    event.finish()
                }
                'step 2'
                const maps = {
                    '手牌区': 'h',
                    '装备区': 'e',
                    '判定区': 'j'
                }
                const area = maps[result.control];
                if (event.target.countCards(area, c => get.type(c) == 'equip') > 0) {
                    player.gain(event.target.getCards(area), 'giveAuto');
                } else {
                    game.log(event.target, '的区域', '#y' + result.control, '没有装备牌')
                }
            },
        },
        mbyixing: {
            audio: 'ext:手杀武将/audio/skill:2',
            enable: 'phaseUse',
            usable: 1,
            marktext: '器',
            init(player) {
                player.storage.mbyixing = {
                    attackFrom: 0,
                    globalTo: 0,
                    globalFrom: 0,
                    skills: [],
                };
            },
            intro: {
                name: '器',
                content: 'expansion',
                markcount: 'expansion',
            },
            filter(event, player) {
                return player.countCards('x') || player.countCards('she', c => get.type(c) == 'equip');
            },
            mod: {
                attackRange(player, num) {
                    return num - player.storage.mbyixing.attackFrom;
                },
                globalTo(target, player, num) {
                    return num + player.storage.mbyixing.globalTo;
                },
                globalFrom(player, target, num) {
                    return num + player.storage.mbyixing.globalFrom;
                },
            },
            content() {
                'step 0'
                if (player.getExpansions('mbyixing').length) {
                    const num = player.getExpansions('mbyixing').length;
                    player.loseToDiscardpile(player.getExpansions('mbyixing'));
                    player.draw(num);
                }
                'step 1'
                player
                    .chooseCard('she', [1, Infinity], c => get.type(c) == 'equip', `###易型###你可将任意张装备牌置于你的武将牌上，称为“器”。你拥有“器”的所有效果。`)
                    .set('ai', (card) => get.equipValue(card, _status.event.player));
                'step 2'
                if (result.bool) {
                    const cards = result.cards;
                    player.addToExpansion('mbyixing', cards).gaintag.add('mbyixing');
                    const names = [...new Set(cards.map(c => c.name))];
                    player.storage.mbyixing = {
                        attackFrom: 0,
                        globalTo: 0,
                        globalFrom: 0,
                        skills: [],
                    };
                    for (const name of names) {
                        const info = get.info({ name: name });
                        if (info.skills) {
                            player.storage.mbyixing.skills.push(info.skills)
                        }
                        player.storage.mbyixing.skills = [...new Set(player.storage.mbyixing.skills.flat())];
                        if (info.distance) {
                            if (info.distance.globalFrom) {
                                player.storage.mbyixing.globalFrom += info.distance.globalFrom;
                            }
                            if (info.distance.globalTo) {
                                player.storage.mbyixing.globalTo += info.distance.globalTo;
                            }
                            if (info.distance.attackFrom) {
                                player.storage.mbyixing.attackFrom += info.distance.attackFrom;
                            }
                        }
                    }
                    if (player.storage.mbyixing.skills.length) {
                        player.addAdditionalSkill('mbyixing', player.storage.mbyixing.skills, false);
                    }
                }
            },
            ai: {
                order: 9,
                result: {
                    player(player) {
                        return player.countCards('she', c => get.type(c) == 'equip')
                    }
                }
            }
        },
    };
    const translates = {
        // 势钟会相关翻译
        dz_sp_zhonghui: "势钟会",
        dz_sp_zhonghui_prefix: "势",
        dz_sp_zhonghui_info: "钟会敏达机变，以谋造势。初画策于淮南，助司马氏平叛定乱；复力主伐蜀，统大军越险克坚。及入汉中，分兵势以惑姜维，挟威令以慑蜀将。其势如高山转石，不可遏止；其略若洪流决堤，莫之能御。巴蜀既下，欲倚剑阁天险，制衡魏廷。当是时也，其雄才尽展，奇谋毕效，几成不世之功。",
        dzmbsizi: '肆恣',
        dzmbsizi_info: '蓄力技（4/4）。出牌阶段限一次，你可消耗任意蓄力点，令从此回合开始的等量个回合，执行以下效果（你的回合开始时，这些效果失效）：1.所有角色使用【杀】造成的伤害+1；2.每个回合结束时，本回合内使用过【杀】的角色失去1点体力，你摸两张牌。若你消耗的蓄力点大于你的体力值，执行一个额外效果：每个回合结束时，若本回合未有角色使用过【杀】，你与当前回合角色各失去1点体力。',
        dzmbxiezhi: '挟志',
        dzmbxiezhi_info: '锁定技，当你的体力值变化后，你获得X点蓄力点（X为本次变化的值）。若你有因此未获得的蓄力点，你的手牌上限与使用【杀】的次数永久+1。',
        dzmbyunan: '迂难',
        dzmbyunan_info: '觉醒技，当你令一名角色进入濒死状态时，若本轮已有角色死亡，你获得或修改〖克昌〗。',
        dzmbkechang: '克昌',
        dzmbkechang_info: '主公技，锁定技，群势力角色使用【杀】无距离限制。',
        dzmbkechang2: '克昌二级',
        dzmbkechang2_info: '主公技，锁定技，群势力角色使用【杀】无距离限制；你使用的【杀】不可被响应。',
        // 势陆郁生相关翻译
        mb_luyusheng: "势陆郁生",
        mb_luyusheng_info: "陆郁生，三国时期吴国官员陆绩之女，陆郁生的父亲陆绩是吴郡公认的才子，又是当时吴郡陆氏的领袖。陆绩赴任担任郁林太守，遂取此名。陆郁生年少的时候就定下坚贞的志向。建安二十四年（219年），陆绩早亡，她与两个兄弟陆宏、陆睿当时都只有几岁，一起返回吴县，被他们的从兄陆瑁接回抚养。13周岁时，陆郁生嫁给同郡出身的张白为妻。出嫁3个月后，张白因为其兄张温一族的案件遭到连坐，被处以流刑，后死于流放地，陆郁生成为了寡妇,其后公开宣言不再改嫁，困难于生计但拒绝了所有提亲，在艰苦中从未停止服侍、照顾张白的姐妹。事情传到朝廷，皇帝褒奖陆郁生，号其为“义姑”。她的堂外甥姚信在文集中称赞她的义举。",
        mbrunwei: "润微",
        mbrunwei_info: "出牌阶段限一次，你可以展示牌堆顶至多五张牌，令一名角色获得其中一种颜色的所有牌。若如此做：1.每阶段限一次，你再失去X张牌后（X为其因此获得的牌数），该技能视为未发动过但不能以本回合获得过牌的角色为目标；2.本阶段结束时，你弃置以此法获得的手牌。",
        mbshuanghuai: "霜怀",
        mbshuanghuai_info: "每回合限一次，当与你距离1以内的其他角色受到伤害时，你可以选择一项：1.防止此伤害；2.令其从弃牌堆中获得一张【桃】。若该角色与你上一次发动时：相同，你与其各摸一张牌；不同，你失去1点体力。",
        // 鲍信相关翻译
        mb_baoxin: "鲍信",
        mb_baoxin_info: "鲍信(151年-192年)，字允诚(仅见《三国志通俗演义》，正史无记载)，泰山平阳(今山东新泰)人。东汉末年济北相，讨伐董卓的诸路人马之一。",
        mbmutao: "募讨",
        mbmutao_info: "出牌阶段限一次，你可以选择一名有手牌的角色，令其将手牌中的所有【杀】依次传递给下一名角色（按座位顺序），最后一名接收【杀】的角色受到你造成的伤害，伤害值为该角色手牌中【杀】数量与3的较小值。",
        mbyimou: "毅谋",
        mbyimou_info: "当你1距离内的角色受到伤害后，你可以选择一项：1.令其从牌堆获得一张【杀】；2.令其将一张手牌交给另一名角色，然后其摸一张牌。（若目标无手牌则对应选项不可选）",
        // 乐就相关翻译
        mb_yuejiu: "乐就",
        mb_yuejiu_info: "乐就(?-197年），东汉末年袁术手下武将。建安二年（197年），袁术僭号于九江，又遣人刺杀陈国的国相骆俊，率兵侵略陈国。曹操亲自东征，袁术闻知曹操亲来，弃军而走，留乐就与桥蕤、梁纲、李丰四将抵抗曹操军。曹操率乐进、于禁等人与桥蕤军交战于蕲阳、苦县，最终取胜，桥蕤等四将皆被斩杀。《三国演义》中，乐就死于寿春。",
        mbcuijin: "催进",
        mbcuijin_info: "你或你攻击范围内的角色使用【杀】时，你可以弃置一张牌令此牌造成的伤害值+1。若此牌未造成伤害，你摸一张牌并对使用者造成1点伤害。",
        // 数·刘徽相关翻译
        shu_liuhui: "数·刘徽",
        mb_geyuan: "圆割",
        mb_geyuan_info: "当你使用X点数的牌时，你可以摸Y+1张牌并令X的值调整为下一位小数（X为圆周率的小数点后数字，Y为你发动技能的次数）",
        mb_chongcha: "重差",
        mb_chongcha_info: "出牌阶段限一次，若你拥有技能“圆割”，你可以弃置一张牌调整“圆割”中的X至下一位小数。你点数为10、11、12、13的牌不计入手牌上限，并视为0点。",
        // 势王昶相关翻译
        mb_wangchang: "势王昶",
        mb_wangchang_info: "王昶务本持正，以德成势。治州则农训兵实,仓廩足而民安；督镇则信布德陈，边疆肃而敌畏。献《治略》而清源，著诫子以明德。其势如泰岱镇土，风雨不撼；其正若北辰居所，星斗自归。德望既隆，遂以儒术经纶，定国之基。当是时也，其德镇山河，规立朝野，终立不倾之业。",
        mbkaiji: "开济",
        mbkaiji_info: "准备阶段，你可令至多X名角色各摸一张牌若有角色以此法获得非基本牌，则你摸一张牌。（X为进入过濒死状态的存活角色数且至少为1）。",
        mbshepan: "慑叛",
        mbshepan_info: "每轮每种牌名限一次，每回合限一次。当你成为其他角色使用牌的目标后，你可选择一项：⒈摸一张牌。⒉将其区域内的一张牌置于牌堆顶。然后若你的手牌数与其相等，则此牌对你无效。",
        // 蒋济相关翻译
        mb_jiangji: "蒋济",
        mb_jiangji_info: "蒋济(?-249年5月18日)，字子通，楚国平阿(今安徽省怀远县常坟镇孔岗)人。三国后期曹魏名臣，历仕曹操、曹丕、曹壑、曹芳四朝。",
        mbjichou: "急筹",
        mbjichou_info: "①每回合限一次。你可以视为使用一张未被〖急筹①〗记录过的普通锦囊牌并记录此牌。②你无法响应或使用对应实体牌包含你的手牌的〖急筹①〗记录过的锦囊牌。③出牌阶段限一次。你可将手牌中的一张〖急筹①〗记录过的锦囊牌交给其他角色。",
        mbjilun: "机论",
        mbjilun_info: "当你受到伤害后，你可以摸X张牌（X为〖急筹①〗记录数且至少为1，至多为3），或视为使用一张〖急筹①〗记录过且未被〖机论〗记录过的普通锦囊牌并记录此牌。",
        // sp于禁相关翻译
        sp_yujin: 'sp于禁',
        sp_yujin_info: "于禁少从鲍信，起于泰山。随讨黄巾于兖北，每战必先；协守州郡于危时，其营独整。鲍信既战没，于禁领余众，且战且引，部伍不散。追兵稍缓，乃徐整行阵，鸣鼓而还。曹操见而壮之，乃擢军职。此其早年，已显临危不乱、治军严整之风，镇军之誉，实肇端于此。",
        spzhenjun: '镇军',
        spzhenjun_info: '出牌阶段开始时，你可以将一张牌交给一名其他角色，令其选择是否使用一张不为黑色的【杀】。若其选择是，则你于此【杀】结算完成后摸1+X张牌(X为此【杀】造成的伤害总点数)。若其选择否，则你对其或其攻击范围内的一名其他角色造成1点伤害。',
        // 势邓艾相关翻译
        mb_dengai: "势邓艾",
        mb_dengai_prefix: "势",
        mb_dengai_info: "邓艾沉毅善谋，以险蓄势。初献策淮南，屯田积谷；后受命陇右，观险待机。及阴平道绝，凿崖开路；士卒裹毡，悬绳下谷。其势如潜蛟伏渊，静则无迹；其变若惊雷破空，动则崩天。成都在望，率疲卒以临雒城。当是时也，其谋定巴蜀，险夺天功，竟成破国之勋。",
         mbtuntian: "屯田",
         mbtuntian_info: "蓄力技(0/0),你失去非伤害牌后，获得1点蓄力点；出牌阶段限一次，你可消耗任意点蓄力点，令至多等量名角色随机获一张红桃牌:一名角色的回合开始时，若你蓄力点已满，你摸一张牌且蓄力点上限+1。",
         mbzaoxian: "凿险",
         mbzaoxian_info: "锁定技，你一次性消耗的蓄力点数量大于等于对应值时，你从弃牌堆获得一张对应牌: 3,【无中生有】； 5,【无懈可击】； 7,【五谷丰登】。",  
         mbjixi: "急袭",
         mbjixi_info: "一名角色的回合结束时，若存在本回合成为过你牌目标的其他角色，你可弃置当前回合角色一张牌，以使用一张指定其中任意名角色为目标的无视距离的【顺手牵羊】。",
         // 集蜜袁术相关翻译
         jm_yuanshu: '集蜜袁术',
         jm_yuanshu_info: "集蜜袁术，淮南纯血干饭哈基米，乱世顶级馋蜜显眼包。出身四世三公豪华配置，手握玉玺王炸底牌，却偏把争霸剧本变成了《败家一百零一式》。打仗？不存在的！正经军阀谁随身带蜜罐啊喂！最终众叛亲离、家底败光，还不忘捶床大叫：“蜜呢！我的蜜呢！”主打一个人菜瘾还大，死了都要甜。",
         mbjimi:"集蜜",
         mbjimi_info:"锁定技，游戏开始时，所有角色将所有手牌替换为等量张【桃】或者【酒】；当有任何【桃】或者【酒】不因使用进入弃牌堆后，若当前阶段内累计进入弃牌堆的【桃】和【酒】为1张，你立即获得一张【杀】；为2张，你立即随机获得一张【决斗】或【火攻】；为4张，你立即随机获得一张【南蛮入侵】或【万箭齐发】。",
         mbmaodie:"冒迭",
         mbmaodie_info:"锁定技，当你在任何角色的回合内使用任意一张牌结算完毕后，若此牌：造成过伤害，你本回合下一次使用的伤害牌需大于此牌字数；未造成伤害，你获得一张【酒】或【桃】（每回合限两次）。",
         // 蒋琬相关翻译
         mb_jiangwan: '蒋琬',
         mb_jiangwan_info: "蒋琬（？～246年），字公琰。零陵郡湘乡县人。三国时期蜀汉宰相，与诸葛亮、董允、费祎合称“蜀汉四相”。",
         mbzhenting: '镇庭',
         mbzhenting_info: '每名角色的回合限一次，当你或你攻击范围内的一名角色成为【杀】或延时锦囊牌的目标时若你不是此牌的使用者，你可以选择一项：1.弃置此牌使用者的一张手牌；2.摸一张牌；背水：你代替其成为此牌的目标。',
         mbjincui: '尽瘁',
         mbjincui_info: '限定技，出牌阶段，你可以和一名其他角色交换位置，然后失去X点体力（X为你的体力值）。',
         // 木牛流马相关翻译
         mb_muniuliuma: '木牛流马',
         mb_muniuliuma_info: "木牛流马，“诸葛矩阵”首款概念机甲，北伐特供限量款。搭载反重力机核与自适应负重协议，攀岩涉水不在话下。司马懿技术组拆机八百次，无一成功，直接沦为三国军工圈年度笑柄。主打蜀械黑箱，黄牛噩梦；孔明造物，物理超度。",
         mbshezi: '摄梓',
         mbshezi_info: '锁定技，准备阶段，你选择一名角色并选择其一个区域，若其此区域里有装备牌，你获得其此区域里的所有牌。',
         mbyixing: '易型',
         mbyixing_info: '出牌阶段限一次，你可将所有“器”置入弃牌堆并摸等量的牌，然后你可将任意张装备牌置于你的武将牌上，称为“器”。你拥有“器”的所有效果。',
         
    };
    return {
        name: "手杀武将",
        content:function(config,pack){},
        precontent:function(){
            // 动态翻译注册
            lib.dynamicTranslate.dzmbkechang = function(player) {
                if(player.storage.dzmbkechang) return lib.translate["dzmbkechang2_info"];
                return lib.translate["dzmbkechang_info"];
            };
            // 技能与翻译合并到全局
            Object.assign(lib.skill, skills);
            Object.assign(lib.translate, translates);
        },
        config:{},
        help:{},
        package:{
            character:{
                character:{
                    // 势钟会
                    dz_sp_zhonghui: ["male", "qun", 4, ["dzmbsizi", "dzmbxiezhi", "dzmbyunan", "dzmbkechang"],["zhu", "ext:手杀武将/image/dz_sp_zhonghui.jpg", "die:手杀武将/audio/die"]],
                    // 势陆郁生
                    mb_luyusheng: ["female", "wu", 3, ["mbrunwei", "mbshuanghuai"], ["ext:手杀武将/image/mb_luyusheng.jpg"]],
                    // 鲍信
                    mb_baoxin: ["male", "qun", 4, ["mbmutao", "mbyimou"], ["ext:手杀武将/image/mb_baoxin.jpg"]],
                    // 乐就
                    mb_yuejiu: ["male", "qun", 4, ["mbcuijin"], ["ext:手杀武将/image/mb_yuejiu.jpg"]],
                    // 数·刘徽
                    shu_liuhui: ["male", "qun", 4, ['mb_geyuan', 'mb_chongcha'], ["ext:手杀武将/image/shu_liuhui.jpg", "die:手杀武将/audio/die"]],
                    // 势王昶
                    mb_wangchang: ["male", "wei", 3, ["mbkaiji", "mbshepan"], ["ext:手杀武将/image/mb_wangchang.jpg"]],
                    // 蒋济
                    mb_jiangji: ["male", "wei", 3, ["mbjichou", "mbjilun"], ["ext:手杀武将/image/mb_jiangji.jpg", "die:手杀武将/audio/die"]],
                    // sp于禁
                    sp_yujin: ['male', 'qun', 4, ['spzhenjun'], ["ext:手杀武将/image/sp_yujin.jpg", "die:手杀武将/audio/die"]],
                     // 势邓艾
                     mb_dengai: ["male", "wei", 4,["mbtuntian", "mbzaoxian", "mbjixi", ], ["ext:手杀武将/image/mb_dengai.jpg", "die:手杀武将/audio/die"]],
                     // 集蜜袁术
                     jm_yuanshu: ['male', 'qun', 4, ['mbjimi', 'mbmaodie'], ["ext:手杀武将/image/jm_yuanshu.jpg", "die:手杀武将/audio/die"]],
                     // 蒋琬
                     mb_jiangwan: ['male', 'shu', 3, ['mbzhenting', 'mbjincui'], ["ext:手杀武将/image/mb_jiangwan.jpg", "die:手杀武将/audio/die"]],
                     // 木牛流马
                     mb_muniuliuma: ['male', 'shu', 4, ['mbshezi', 'mbyixing'], ["ext:手杀武将/image/mb_muniuliuma.jpg", "die:手杀武将/audio/die"]],
                },
                translate: translates,
            },
            card:{
                card:{},
                translate:{},
                list:[],
            },
            skill:{},
            intro:"手杀武将包",
            author:"无名杀玩家",
            diskURL:"",
            forumURL:"",
            version:"1",
        },
        files:{"character":[],"card":[],"skill":[]}
    };
};