import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const decadeKuiBa = {
        name: 'decadeKuiBa',
        connect: true,
        characterSort: {
            decadeKuiBa: {
                kuibakuiba: ['kuiba_manji', 'kuiba_haiwenxiang', 'kuiba_youmikuang'],
                kuibaqunying: ['kuiba_kalaxiaokepan', 'kuiba_jingxin'],
                kuibakuibajun: ['kuiba_lingshoujun', 'kuiba_lingzhanjun', 'kuiba_lingxunjun', 'kuiba_lingluanjun'],
                kuibaqunyingjun: ['kuiba_shengdoujun', 'kuiba_shenghujun', 'kuiba_shengjiejun', 'kuiba_shengzhujun'],
            },
        },
        character: {
            kuiba_youmikuang: ['male', 'qun', 12, ['kuiba_wuyao', 'kuiba_sanjian', 'kuiba_baizhan', 'kuiba_yiyou']],
            kuiba_haiwenxiang: ['female', 'qun', 10, ['kuiba_linyao', 'kuiba_jinghong', 'kuiba_wenjia', 'kuiba_huanguang']],
            kuiba_kalaxiaokepan: ['male', 'qun', 12, ['kuiba_wangjian', 'kuiba_tianyi', 'kuiba_zhuandui', 'kuiba_tianbian']],
            kuiba_manji: ['male', 'qun', 36, ['kuiba_kuiqu', 'kuiba_juli', 'kuiba_kuiba']],
            kuiba_jingxin: ['female', 'qun', 12, ['kuiba_tianshen', 'kuiba_guangshi', 'kuiba_guangmie']],
            kuiba_lingshoujun: ['male', 'qun', 8, ['kuiba_lingshan', 'kuiba_lingshou']],
            kuiba_lingzhanjun: ['male', 'qun', 7, ['kuiba_lingshan', 'kuiba_lingzhan']],
            kuiba_lingxunjun: ['male', 'qun', 7, ['kuiba_lingshan', 'kuiba_lingxun']],
            kuiba_lingluanjun: ['male', 'qun', 7, ['kuiba_lingshan', 'kuiba_lingluan']],
            kuiba_shengdoujun: ['male', 'qun', 7, ['kuiba_shengmeng', 'kuiba_shengdou']],
            kuiba_shenghujun: ['male', 'qun', 8, ['kuiba_shengmeng', 'kuiba_shenghu']],
            kuiba_shengjiejun: ['male', 'qun', 7, ['kuiba_shengmeng', 'kuiba_shengjie']],
            kuiba_shengzhujun: ['male', 'qun', 7, ['kuiba_shengmeng', 'kuiba_shengzhu']],
        },
        skill: {
            kuiba_wuyao: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageBegin4' },
                filter(event, player) {
                    return event.source && event.num > 0;
                },
                forced: true,
                content() {
                    'step 0'
                    player.judge(function (card) {
                        return get.color(card) == 'black' ? 2 : -2;
                    });
                    'step 1'
                    if (result.judge > 0) {
                        trigger.num--;
                        if (player.countCards('hs', { name: 'sha' })) {
                            player.discard(player.getCards('he', { name: 'sha' }).randomGet());
                            player.useCard({ name: 'sha' }, trigger.source, false, 'noai');
                        }
                    }
                },
            },
            kuiba_sanjian: {
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == 'sha') return num + 1;
                    },
                },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { source: 'damageSource' },
                filter(event, player) {
                    return event.card && event.card.name == 'sha' && event.player.countCards('he');
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.player.chooseToDiscard('he', 2, true);
                },
            },
            kuiba_baizhan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseBegin' },
                forced: true,
                content() {
                    var cards = [];
                    for (var i = 0; i < 2; i++) {
                        var card = get.cardPile(function (card) {
                            return card.name == 'sha' && !cards.includes(card);
                        });
                        if (card) cards.push(card);
                    }
                    if (cards.length) player.gain(cards, 'gain2');
                },
            },
            kuiba_yiyou: {
                derivation: ['new_yijue', 'tianyi'],
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseBegin' },
                forced: true,
                content() {
                    'step 0'
                    player.judge().set('callback', function () {
                        var player = _status.event.player;
                        if (get.position(card, true) == 'o') player.gain(card, 'gain2');
                    });
                    'step 1'
                    player.addTempSkills(result.color == 'red' ? 'new_yijue' : 'tianyi');
                },
            },
            kuiba_linyao: {
                mod: {
                    targetEnabled(card, player, target) {
                        if (get.mode() == 'identity' ? get.attitude(player, target) < 0 : target.isEnemyOf(player) && get.color(card) == 'red' && get.type2(card) == 'trick') return false;
                    },
                },
                audio: 'ext:活动武将/audio/skill:true',
                inherit: 'shixin',
            },
            kuiba_jinghong: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    return get.color(event.card, player) != 'none' && get.type2(event.card) == 'trick';
                },
                forced: true,
                content() {
                    var color = ['red', 'black'];
                    color.remove(get.color(trigger.card, player));
                    color = color[0];
                    var card = get.cardPile(function (card) {
                        return get.color(card) == color;
                    });
                    if (card) player.gain(card, 'gain2');
                },
            },
            kuiba_wenjia: {
                derivation: ['xinfu_wuniang', 'wushuang'],
                intro: { content: 'mark', name: '击毁' },
                group: ['kuiba_wenjia_yingzi', 'kuiba_wenjia_damage'],
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'dieAfter' },
                forced: true,
                content() {
                    player.addMark('kuiba_wenjia', 1);
                    var num = player.countMark('kuiba_wenjia');
                    if (num == 1) player.addSkills('xinfu_wuniang');
                    if (num == 2) player.addSkills('wushuang');
                },
                subSkill: {
                    yingzi: {
                        audio: 'kuiba_wenjia',
                        trigger: { player: 'phaseDrawBegin2' },
                        filter(event, player) {
                            return !event.numFixed && player.countMark('kuiba_wenjia') > 0;
                        },
                        forced: true,
                        content() {
                            trigger.num += player.countMark('kuiba_wenjia');
                        },
                    },
                    damage: {
                        audio: 'kuiba_wenjia',
                        trigger: { source: 'damageBegin1' },
                        filter(event, player) {
                            return player.countMark('kuiba_wenjia') == 3;
                        },
                        forced: true,
                        content() {
                            trigger.num++;
                        },
                    },
                },
            },
            kuiba_huanguang: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCard2' },
                filter(event, player) {
                    if (!player.isPhaseUsing() || get.type(event.card) != 'trick' || player.getHistory('useCard', function (evt) {
                        return get.type(evt.card) == 'trick';
                    }).length > 4) return false;
                    if (event.targets?.length > 0) return true;
                    var info = get.info(event.card);
                    if (info.allowMultiple == false) return false;
                    if (event.targets && !info.multitarget) {
                        if (game.hasPlayer(function (current) {
                            return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
                        })) return true;
                    }
                    return false;
                },
                async cost(event, trigger, player) {
                    var prompt2 = '为' + get.translation(trigger.card) + '增加或减少一个目标';
                    event.result = await player.chooseTarget(get.prompt(event.skill), function (card, player, target) {
                        var player = _status.event.player;
                        if (_status.event.targets.includes(target)) return true;
                        return lib.filter.targetEnabled2(_status.event.card, player, target) && lib.filter.targetInRange(_status.event.card, player, target);
                    }).set('prompt2', prompt2).set('ai', function (target) {
                        var trigger = _status.event.getTrigger();
                        var player = _status.event.player;
                        return get.effect(target, trigger.card, player, player) * (_status.event.targets.includes(target) ? -1 : 1);
                    }).set('targets', trigger.targets).set('card', trigger.card).forResult();
                },
                async content(event, trigger, player) {
                    if (!event.isMine() && !event.isOnline()) game.delayx();
                    if (trigger.targets.includes(event.targets[0])) trigger.targets.removeArray(event.targets);
                    else trigger.targets.addArray(event.targets);
                },
            },
            kuiba_wangjian: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCardToTargeted' },
                filter(event) {
                    return event.card.name == 'sha';
                },
                forced: true,
                logTarget: 'target',
                content() {
                    trigger.target.addTempSkill('qinggang2');
                    trigger.target.storage.qinggang2.add(trigger.card);
                    var id = trigger.target.playerid;
                    var map = trigger.getParent().customArgs;
                    map[id] ??= {};
                    if (typeof map[id].extraDamage != 'number') map[id].extraDamage = 0;
                    map[id].extraDamage++;
                },
                ai: {
                    unequip_ai: true,
                    skillTagFilter(player, tag, arg) {
                        return arg?.name == 'sha';
                    },
                },
            },
            kuiba_tianyi: {
                audio: 'ext:活动武将/audio/skill:true',
                inherit: 'tianyi',
            },
            kuiba_zhuandui: {
                group: ['kuiba_zhuandui_use', 'kuiba_zhuandui_respond'],
                audio: 'ext:活动武将/audio/skill:true',
                inherit: 'zhuandui',
                subSkill: {
                    use: {
                        audio: 'kuiba_zhuandui',
                        inherit: 'zhuandui_use',
                    },
                    respond: {
                        audio: 'kuiba_zhuandui',
                        inherit: 'zhuandui_respond',
                    },
                },
            },
            kuiba_tianbian: {
                audio: 'ext:活动武将/audio/skill:true',
                inherit: 'tianbian',
            },
            kuiba_kuiqu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageEnd' },
                getIndex: event => event.num,
                forced: true,
                content() {
                    player.draw();
                    if (trigger.source?.isIn() && trigger.source.countCards('he')) {
                        player.line(trigger.source);
                        const cards = trigger.source.getDiscardableCards(trigger.source, 'he');
                        if (cards.length > 0) trigger.source.discard(cards.randomGet());
                    }
                },
            },
            kuiba_juli: {
                group: 'kuiba_juli_hit',
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    return event.card?.name == 'sha' && game.hasPlayer(function (current) {
                        return current != player && get.distance(player, current) == 1;
                    });
                },
                forced: true,
                async content(event, trigger, player) {
                    if (typeof trigger.baseDamage !== 'number') trigger.baseDamage = 1;
                    trigger.baseDamage += game.countPlayer(current => {
                        return current != player && get.distance(player, current) == 1;
                    }) - 1;
                },
                subSkill: {
                    hit: {
                        audio: 'kuiba_juli',
                        trigger: { player: 'useCardToPlayered' },
                        filter(event, player) {
                            return event.card && get.distance(event.target, player) > 1;
                        },
                        forced: true,
                        logTarget: 'target',
                        content() {
                            trigger.getParent().directHit.add(trigger.target);
                        },
                        ai: {
                            directHit_ai: true,
                            skillTagFilter(player, tag, arg) {
                                if (get.distance(arg?.target, player) <= 1) return false;
                            },
                        },
                    },
                },
            },
            kuiba_kuiba: {
                group: ['kuiba_kuiba_yingzi', 'kuiba_kuiba_damage'],
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: ['useCard2', 'useCardToPlayer'] },
                filter(event, player) {
                    return ['sha', 'juedou'].includes(event.card.name) && game.hasPlayer(function (current) {
                        return current != player && !event.targets.includes(current);
                    });
                },
                forced: true,
                content() {
                    trigger.targets.addArray(game.filterPlayer(function (current) {
                        return current != player && !trigger.targets.includes(current);
                    }));
                    player.line(trigger.targets);
                },
                subSkill: {
                    yingzi: {
                        audio: 'kuiba_kuiba',
                        trigger: { player: 'phaseDrawBegin2' },
                        filter(event, player) {
                            return !event.numFixed;
                        },
                        forced: true,
                        content() {
                            trigger.num += 2;
                        },
                    },
                    damage: {
                        audio: 'kuiba_kuiba',
                        trigger: { source: 'damageBegin1' },
                        filter(event, player) {
                            return event.card && ['sha', 'juedou'].includes(event.card.name) && player.inRange(event.player);
                        },
                        forced: true,
                        content() {
                            trigger.num++;
                        },
                    },
                },
            },
            kuiba_tianshen: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageBegin4' },
                filter(event, player) {
                    return get.type2(event.card) == 'trick';
                },
                forced: true,
                content() {
                    trigger.cancel();
                },
                ai: {
                    notrick: true,
                    effect: {
                        target(card, player, target, current) {
                            if (get.type(card) == 'trick' && get.tag(card, 'damage')) return 'zeroplayertarget';
                        }
                    },
                },
            },
            kuiba_guangshi: {
                intro: { content: 'mark', name: '光势' },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: ['phaseJieshuBegin', 'damageEnd'] },
                filter(event, player, name) {
                    var num = player.countMark('kuiba_guangshi');
                    if (name == 'phaseJieshuBegin') return num < 3;
                    return num > 0;
                },
                forced: true,
                content() {
                    if (event.triggername == 'phaseJieshuBegin') player.addMark('kuiba_guangshi', 3);
                    else player.removeMark('kuiba_guangshi', 1);
                },
            },
            kuiba_guangmie: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseZhunbeiBegin' },
                limited: true,
                skillAnimation: true,
                animationColor: 'thunder',
                filter(event, player) {
                    return player.countMark('kuiba_guangshi') > 2;
                },
                check(event, player) {
                    var friend = 0, enemy = 0;
                    for (var target of game.players) {
                        if (target != player) {
                            if (get.attitude(player, target) > 0) friend += target.hp;
                            else enemy += target.hp;
                        }
                    }
                    return enemy >= friend;
                },
                logTarget(event, player) {
                    return game.filterPlayer(function (current) {
                        return current != player;
                    });
                },
                content() {
                    player.awakenSkill('kuiba_guangmie');
                    var num = player.countMark('kuiba_guangshi');
                    player.removeMark('kuiba_guangshi', num);
                    event.forceDie = true;
                    for (var target of game.players) {
                        if (target != player) target.loseHp(num);
                    }
                },
                ai: { combo: 'kuiba_guangshi' },
            },
            kuiba_lingshan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageBegin4' },
                filter(event, player) {
                    return event.card && ['spade', 'diamond'].includes(get.suit(event.card, event.player));
                },
                forced: true,
                content() {
                    trigger.num--;
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (!['spade', 'diamond'].includes(get.suit(card, player))) return;
                            if (player.hasSkillTag('jueqing', false, target)) return;
                            var num = get.tag(card, 'damage');
                            if (num) {
                                if (num > 1) return 0.5;
                                return 0;
                            }
                        },
                    },
                },
            },
            kuiba_shengmeng: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageBegin4' },
                filter(event, player) {
                    return event.card && ['heart', 'club'].includes(get.suit(event.card, event.player));
                },
                forced: true,
                content() {
                    trigger.num--;
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (!['heart', 'club'].includes(get.suit(card, player))) return;
                            if (player.hasSkillTag('jueqing', false, target)) return;
                            var num = get.tag(card, 'damage');
                            if (num) {
                                if (num > 1) return 0.5;
                                return 0;
                            }
                        },
                    },
                },
            },
            kuiba_lingshou: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'damageBegin4' },
                filter(event, player) {
                    return event.player != player && get.mode() == 'identity' ? get.attitude(player, event.player) > 0 : event.player.isFriendOf(player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.num--;
                    player.loseHp();
                    if (trigger.source) trigger.source.chooseToDiscard(3, 'he', true);
                },
            },
            kuiba_lingzhan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'damageBegin2' },
                usable: 1,
                filter(event, player) {
                    return player.countCards('he') && event.source && get.mode() == 'identity' ? get.attitude(player, event.source) > 0 : event.source.isFriendOf(player);
                },
                forced: true,
                logTarget: 'source',
                content() {
                    player.discard(player.getCards('he').randomGet());
                    trigger.num++;
                },
            },
            kuiba_lingxun: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'useCardToTargeted' },
                filter(event, player) {
                    return event.card && event.card.name == 'sha' && event.player.countCards('h') && get.mode() == 'identity' ? get.attitude(player, event.target) > 0 : event.target.isFriendOf(player) && get.mode() == 'identity' ? get.attitude(player, event.player) < 0 : event.player.isEnemyOf(player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    player.gain(trigger.player.getCards('h').randomGet(), trigger.player, 'giveAuto');
                },
            },
            kuiba_lingluan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'phaseJieshuBegin' },
                filter(event, player) {
                    return event.player.countCards('he') && get.mode() == 'identity' ? get.attitude(player, event.player) > 0 : event.player.isFriendOf(player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.player.chooseToDiscard(2, 'he', true);
                },
            },
            kuiba_shengdou: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'useCardToPlayer' },
                filter(event, player) {
                    if (!event.isFirstTarget || event.card.name !== 'sha') return false;
                    return player.countDiscardableCards(player, 'he') && game.hasPlayer(target => {
                        return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, event.player, target) && lib.filter.targetInRange(event.card, event.player, target);
                    }) && get.mode() == 'identity' ? get.attitude(player, event.player) > 0 : event.player.isFriendOf(player);
                },
                check(event, player) {
                    return game.hasPlayer(target => {
                        if (!(!event.targets.includes(target) && lib.filter.targetEnabled2(event.card, event.player, target) && lib.filter.targetInRange(event.card, event.player, target))) return false;
                        return get.effect(target, event.card, event.player, player) > 0;
                    });
                },
                logTarget: 'player',
                async content(event, trigger, player) {
                    await player.randomDiscard(player, 'he', 'random');
                    const result = await trigger.player.chooseTarget('为' + get.translation(trigger.card) + '增加一个目标', true, (card, player, target) => {
                        const evt = get.event().getTrigger();
                        return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, evt.player, target) && lib.filter.targetInRange(evt.card, evt.player, target);
                    }).set('ai', target => {
                        const player = get.player(), evt = get.event().getTrigger();
                        return get.effect(target, evt.card, evt.player, player);
                    }).forResult();
                    if (result?.bool && result.targets?.length) {
                        const target = result.targets[0];
                        trigger.player.line(target);
                        game.log(target, '成为了', trigger.card, '的额外目标');
                        trigger.getParent().targets.add(target);
                    }
                },
            },
            kuiba_shenghu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'damageBegin4' },
                filter(event, player) {
                    return event.player != player && get.mode() == 'identity' ? get.attitude(player, event.player) > 0 : event.player.isFriendOf(player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.num--;
                    player.loseHp();
                    game.asyncDraw([player, trigger.player]);
                    trigger.player.draw();
                },
            },
            kuiba_shengjie: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'useCardToTargeted' },
                filter(event, player) {
                    if (event.getParent('useCard').kuiba_shengjie) return false;
                    return event.card && get.type(event.card) == 'trick' && player.countCards('he') && get.mode() == 'identity' ? get.attitude(player, event.target) > 0 : event.target.isFriendOf(player) && get.mode() == 'identity' ? get.attitude(player, event.player) < 0 : event.player.isEnemyOf(player);
                },
                forced: true,
                logTarget: 'targets',
                content() {
                    trigger.getParent('useCard').kuiba_shengjie = true;
                    player.discard(player.getCards('he').randomGet());
                    game.asyncDraw(trigger.targets, 2);
                },
            },
            kuiba_shengzhu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'phaseJieshuBegin' },
                filter(event, player) {
                    return get.mode() == 'identity' ? get.attitude(player, event.player) > 0 : event.player.isFriendOf(player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.player.draw(2);
                },
            },
        },
        translate: {
            kuibakuiba: '魁拔',
            kuibaqunying: '群英',
            kuibakuibajun: '魁拔军',
            kuibaqunyingjun: '群英军',
            kuiba_youmikuang: '幽弥狂',
            kuiba_wuyao: '雾妖',
            kuiba_wuyao_info: '锁定技，当你受到伤害时，你进行一次判定。若判定结果为黑色，则此伤害-1，然后如果你手中有【杀】，则你随机弃置其中的一张并视为对伤害来源使用一张【杀】。',
            kuiba_sanjian: '伞剑',
            kuiba_sanjian_info: '锁定技，你使用【杀】的次数上限+1；当你用【杀】造成伤害后，受伤角色弃置两张牌。',
            kuiba_baizhan: '百战',
            kuiba_baizhan_info: '锁定技，出牌阶段开始时，你从牌堆或弃牌堆中随机获得两张【杀】。',
            kuiba_yiyou: '义友',
            kuiba_yiyou_info: '锁定技，准备阶段，你进行一次判定并获得该判定牌。若判定结果为红色，本回合你视为拥有技能〖义绝〗；若判定结果为黑色，本回合你视为拥有技能〖天义〗。',
            kuiba_haiwenxiang: '海问香',
            kuiba_linyao: '粼妖',
            kuiba_linyao_info: '锁定技，你无法成为敌方红色锦囊牌的目标；防止你受到的火焰伤害。',
            kuiba_jinghong: '惊虹',
            kuiba_jinghong_info: '锁定技，当你使用黑色/红色锦囊牌时，你从牌堆中随机获得一张红色/黑色牌。',
            kuiba_wenjia: '纹甲',
            kuiba_wenjia_info: '锁定技，其他角色死亡后，你获得1枚“击毁”标记。摸牌阶段，你多摸X张牌（X为你拥有的“击毁”标记数）。若你拥有1个“击毁”标记，你获得〖武娘〗；若你拥有2个“击毁”标记，你获得〖无双〗；若你拥有3个“击毁”标记，则当你造成伤害时，此伤害+1。',
            kuiba_huanguang: '幻光',
            kuiba_huanguang_info: '出牌阶段，你使用的前四张普通锦囊牌可以多指定一个目标或少指定一个目标。',
            kuiba_kalaxiaokepan: '卡拉肖克潘',
            kuiba_wangjian: '王剑',
            kuiba_wangjian_info: '锁定技，你使用【杀】造成的伤害+1，且无视目标角色的防具。',
            kuiba_tianyi: '天义',
            kuiba_zhuandui: '专对',
            kuiba_tianbian: '天辩',
            kuiba_manji: '蛮吉',
            kuiba_kuiqu: '魁躯',
            kuiba_kuiqu_info: '锁定技，当你受到1点伤害后，你摸一张牌，伤害来源随机弃置一张牌。',
            kuiba_juli: '巨力',
            kuiba_juli_info: '锁定技，你的【杀】的基础伤害值等于你距离其为1的角色数。若其他角色与你的距离大于1，其不能响应你使用的牌。',
            kuiba_kuiba: '魁拔',
            kuiba_kuiba_info: '锁定技，摸牌阶段，你多摸两张牌；你使用【杀】和【决斗】均指定所有其他角色为目标（无距离限制），如果目标在你的攻击范围内，则其受到你使用【杀】和【决斗】对其造成的伤害+1。',
            kuiba_jingxin: '镜心',
            kuiba_tianshen: '天神',
            kuiba_tianshen_info: '锁定技，当你受到锦囊牌造成的伤害时，防止此伤害。',
            kuiba_guangshi: '光势',
            kuiba_guangshi_info: '锁定技，回合结束时，若你的“光势”标记数小于3，你获得3个“光势”标记；当你受到伤害后，你失去1个“光势”标记。',
            kuiba_guangmie: '光灭',
            kuiba_guangmie_info: '限定技，准备阶段，若你的“光势”标记数大于2，你可以失去所有“光势”标记，且你每失去1枚“光势”标记，其他所有角色失去1点体力。',
            kuiba_lingshan: '灵山',
            kuiba_lingshan_info: '锁定技，当你受到黑桃牌和方片牌造成的伤害时，此伤害-1。',
            kuiba_shengmeng: '圣盟',
            kuiba_shengmeng_info: '锁定技，当你受到梅花牌和红桃牌造成的伤害时，此伤害-1。',
            kuiba_lingshoujun: '灵守军',
            kuiba_lingshou: '灵守',
            kuiba_lingshou_info: '锁定技，己方其他角色受到伤害时，令此伤害-1，你失去1点体力，伤害来源弃置三张牌。',
            kuiba_lingzhanjun: '灵战军',
            kuiba_lingzhan: '灵战',
            kuiba_lingzhan_info: '锁定技，己方角色回合内首次造成伤害时，你随机弃置一张牌令此伤害+1。',
            kuiba_lingxunjun: '灵迅军',
            kuiba_lingxun: '灵迅',
            kuiba_lingxun_info: '锁定技，己方角色成为敌方角色使用【杀】的目标后，你获得该敌方角色的随机一张手牌。',
            kuiba_lingluanjun: '灵乱军',
            kuiba_lingluan: '灵乱',
            kuiba_lingluan_info: '锁定技，敌方角色的结束阶段，其须弃置两张牌。',
            kuiba_shengdoujun: '圣斗军',
            kuiba_shengdou: '圣斗',
            kuiba_shengdou_info: '己方角色使用【杀】指定目标时，你可以随机弃置一张牌令此【杀】的目标上限+1。',
            kuiba_shenghujun: '圣护军',
            kuiba_shenghu: '圣护',
            kuiba_shenghu_info: '锁定技，己方其他角色受到伤害时，你令该伤害-1，你失去1点体力，然后你摸一张牌，该角色摸两张牌。',
            kuiba_shengjiejun: '圣捷军',
            kuiba_shengjie: '圣捷',
            kuiba_shengjie_info: '锁定技，己方角色成为敌方角色普通锦囊牌的目标后，你随机弃置一张牌并令此牌的所有目标各摸两张牌。',
            kuiba_shengzhujun: '圣助军',
            kuiba_shengzhu: '圣助',
            kuiba_shengzhu_info: '锁定技，己方角色结束阶段，其摸两张牌。',
        },
    };
    for (const i in decadeKuiBa.character) {
        if (Array.isArray(decadeKuiBa.character[i])) decadeKuiBa.character[i] = get.convertedCharacter(decadeKuiBa.character[i]);
        decadeKuiBa.character[i].trashBin ??= [];
        if (_status['extension_活动武将_files']?.audio.die.files.includes(`${i}.mp3`)) {
            decadeKuiBa.character[i].dieAudios ??= [];
            decadeKuiBa.character[i].dieAudios.push('ext:活动武将/audio/die:true');
            decadeKuiBa.translate[`#ext:活动武将/audio/die/${i}:die`] ??= '点击播放阵亡配音';
        }
        if (_status['extension_活动武将_files']?.image.character.files.includes(`${i}.jpg`)) decadeKuiBa.character[i].img = `extension/活动武将/image/character/${i}.jpg`;
    }
    lib.config.all.sgscharacters.push('decadeKuiBa');
    lib.translate['decadeKuiBa_character_config'] = '<span style="font-family: xingkai">十周年魁拔</span>';
    return decadeKuiBa;
};

export default packs;