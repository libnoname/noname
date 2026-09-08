import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const FaDongCharacter = {
        name: 'FaDongCharacter',
        connect: true,
        characterSort: {
            FaDongCharacter: {
                FaDongCharacter1: ['FD_guosi', 'FD_lijue', 'FD_niufudongxie', 'FD_fanchou', 'FD_dongyue', 'FD_zhangji'],
                FaDongCharacter2: ['FD_hubenjun', 'FD_baolvejun', 'FD_fengyaojun', 'FD_longxiangjun', 'FD_feixiongjunzuo', 'FD_feixiongjunyou'],
                FaDongCharacter3: ['FD_sunjian', 'FD_huaxiong'],
            },
        },
        character: {
            FD_guosi: ['male', 'qun', 4, ['bilibili_yanglie', 'bilibili_mojun'], ['character:guosi']],
            FD_lijue: ['male', 'qun', 6, ['bilibili_yangwu', 'bilibili_mojun'], ['character:lijue']],
            FD_fanchou: ['male', 'qun', 4, ['bilibili_fangong', 'bilibili_mojun'], ['character:fanchou']],
            FD_dongyue: ['male', 'qun', 4, ['bilibili_kuangxi', 'bilibili_mojun']],
            FD_niufudongxie: ['double', 'qun', 4, ['bilibili_tunjun', 'bilibili_jiaoxia', 'bilibili_mojun'], ['character:tw_niufudongxie']],
            FD_zhangji: ['male', 'qun', 4, ['bilibili_jielve', 'bilibili_mojun'], ['character:zhangji']],
            //FD_hubenjun: ['male', 'qun', 5, ['bilibili_longying'], ['forbidai']],
            FD_baolvejun: ['male', 'qun', 3, ['bilibili_baoying'], ['forbidai']],
            FD_fengyaojun: ['female', 'qun', 3, ['bilibili_fengying'], ['forbidai']],
            //FD_longxiangjun: ['male', 'qun', 4, ['bilibili_huying'], ['forbidai']],
            FD_feixiongjunzuo: ['male', 'qun', 4, ['bilibili_jingqi'], ['forbidai']],
            FD_feixiongjunyou: ['male', 'qun', 4, ['bilibili_ruiqi'], ['forbidai']],
            FD_sunjian: ['male', 'qun', 6, ['gzyinghun', 'bilibili_polu']],
            FD_huaxiong: ['male', 'qun', 8, ['bilibili_moqu', 'yaowu', 'bilibili_mojun'], ['character:old_huaxiong']],
        },
        characterIntro: {
            dongyue: '董越，武威郡姑臧人也，东汉末年人，董卓手下东中郎将，与贾诩是同乡。曾被董卓派往渑池驻扎，抵御关东反董联军的进攻，董卓死后董越被董卓女婿牛辅所杀。',
        },
        skill: {
            bilibili_jingqi: {
                mod: {
                    globalFrom(from, to, distance) {
                        if (get.mode() === 'identity') return distance - 1;
                    },
                },
                global: 'bilibili_jingqi_distance',
                ai: { threaten: 1.5 },
                subSkill: {
                    distance: {
                        mod: {
                            globalFrom(from, to, distance) {
                                if (get.mode() !== 'identity' && game.hasPlayer(current => {
                                    return current.hasSkill('bilibili_jingqi') && current.getFriends(true).includes(from) && current.getEnemies(true).includes(to);
                                })) return distance - 1;
                            },
                        },
                    },
                },
            },
            bilibili_fengying: {
                mod: {
                    targetEnabled(card, player, target) {
                        if (get.mode() === 'identity' && target.isMinHp(true) && target !== player) return false;
                    },
                },
                global: 'bilibili_fengying_use',
                ai: { threaten: 3.5 },
                subSkill: {
                    use: {
                        mod: {
                            targetEnabled(card, player, target) {
                                if (get.mode() !== 'identity' && target.isMinHp(true) && game.hasPlayer(current => {
                                    return current.hasSkill('bilibili_fengying') && current.getFriends(true).includes(from) && current.getEnemies(true).includes(to);
                                })) return false;
                            },
                        },
                    },
                },
            },
            bilibili_mojun: {
                trigger: { global: 'damageSource' },
                filter(event, player) {
                    if (event.getParent().type !== 'card' || event.card.name !== 'sha') return false;
                    return event.source?.isIn() && get.mode() === 'identity' ? event.source === player : player.getFriends(true).includes(event.source);
                },
                forced: true,
                logTarget: 'source',
                async content(event, trigger, player) {
                    const result = await trigger.source.judge(card => {
                        return get.color(card) == 'black' ? 2 : -2;
                    }).forResult();
                    if (result?.bool) {
                        const targets = game.filterPlayer(current => {
                            return get.mode() === 'identity' ? current === player : player.getFriends(true).includes(current);
                        }).sortBySeat();
                        if (targets.length > 0) {
                            await game.asyncDraw(targets);
                            await game.delayx();
                        }
                    }
                },
            },
            bilibili_jielve: {
                trigger: { source: 'damageSource' },
                filter(event, player) {
                    if (!event.player.isIn() || event.player == player) return false;
                    return event.player.countGainableCards(player, 'hej') > 0;
                },
                forced: true,
                logTarget: 'player',
                async content(event, trigger, player) {
                    let num = 0;
                    if (trigger.player.countGainableCards(player, "h")) num++;
                    if (trigger.player.countGainableCards(player, "e")) num++;
                    if (trigger.player.countGainableCards(player, "j")) num++;
                    const result = await player.gainPlayerCard(trigger.player, 'hej', num, true).set("filterButton", button => {
                        const { player, target } = get.event(), card = button.link;
                        if (!lib.filter.canBeGained(card, player, target)) return false;
                        return !ui.selected.buttons.some(but => get.position(card) == get.position(but.link));
                    }).forResult();
                    if (result?.bool && result.cards?.length) await player.loseHp();
                },
            },
            bilibili_tunjun: {
                trigger: { global: 'roundStart' },
                filter(event, player) {
                    return player.maxHp !== 1;
                },
                forced: true,
                async content(event, trigger, player) {
                    await player.loseMaxHp();
                    await player.draw(player.maxHp);
                },
            },
            bilibili_fangong: {
                trigger: { global: 'useCardAfter' },
                filter(event, player) {
                    const mode = get.mode(), target = event.player;
                    return event.targets?.includes(player) && target.isIn() && mode === 'identity' ? target !== player : player.getEnemies().includes(target);
                },
                direct: true,
                clearTime: true,
                async content(event, trigger, player) {
                    const target = trigger.player, list = [event.name, target];
                    await player.chooseToUse(get.prompt2(...list), function (card, player, event) {
                        if (get.name(card) !== 'sha') return false;
                        return lib.filter.filterCard.apply(this, arguments);
                    }).set('filterTarget', function (card, player, target) {
                        if (target !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
                        return lib.filter.targetEnabled.apply(this, arguments);
                    }).set('selectTarget', -1).set('sourcex', target).set('logSkill', list);
                },
            },
            bilibili_jiaoxia: {
                mod: {
                    ignoredHandcard(card, player) {
                        if (get.mode() !== 'identity') return;
                        if (get.color(card) === 'black') return true;
                    },
                    cardDiscardable(card, player, name) {
                        if (get.mode() !== 'identity') return;
                        if (name === 'phaseDiscard' && get.color(card) === 'black') return false;
                    },
                },
                global: 'bilibili_jiaoxia_global',
                subSkill: {
                    global: {
                        mod: {
                            ignoredHandcard(card, player) {
                                if (get.mode() === 'identity' || !game.hasPlayer(target => target.hasSkill('bilibili_jiaoxia') && target.getFriends(true).includes(player))) return;
                                if (get.color(card) === 'black') return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (get.mode() === 'identity' || !game.hasPlayer(target => target.hasSkill('bilibili_jiaoxia') && target.getFriends(true).includes(player))) return;
                                if (name === 'phaseDiscard' && get.color(card) === 'black') return false;
                            },
                        },
                    },
                },
            },
            bilibili_kuangxi: {
                enable: 'phaseUse',
                filterTarget: lib.filter.notMe,
                async content(event, trigger, player) {
                    const target = event.target;
                    await player.loseHp();
                    await target.damage();
                    if (!target.isIn() || target.hasHistory('damage', evt => {
                        return evt.getParent(event.name) == event && evt._dyinged;
                    })) player.tempBanSkill(event.name, false, false);
                },
                ai: {
                    threaten(player, target) {
                        return 1 + target.getHp();
                    },
                    order: 1,
                    result: {
                        target(player, target) {
                            if (player.countCards('hs', card => player.canSaveCard(card, player)) + player.hp <= 1) return 0;
                            return get.damageEffect(target, player);
                        },
                    },
                },
            },
            bilibili_yangwu: {
                trigger: { player: 'phaseZhunbeiBegin' },
                logTarget(event, player) {
                    return game.filterPlayer(target => target !== player).sortBySeat();
                },
                forced: true,
                async content(event, trigger, player) {
                    for (const target of event.targets) await target.damage();
                    await player.loseHp();
                },
            },
            bilibili_yanglie: {
                trigger: { player: 'phaseZhunbeiBegin' },
                logTarget(event, player) {
                    return game.filterPlayer(target => target !== player).sortBySeat();
                },
                forced: true,
                async content(event, trigger, player) {
                    await player.gainMultiple(event.targets, 'he');
                    await player.loseHp();
                },
            },
            bilibili_ruiqi: {
                trigger: { global: 'phaseDrawBegin2' },
                filter(event, player) {
                    if (event.numFixed) return false;
                    return get.mode() === 'identity' ? event.player === player : player.getFriends(true).includes(event.player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.num++;
                },
                ai: { threaten: 2.5 },
            },
            bilibili_baoying: {
                limited: true,
                trigger: { global: 'dying' },
                filter(event, player) {
                    return get.mode() === 'identity' ? event.player === player : player.getFriends(true).includes(event.player);
                },
                logTarget: 'player',
                skillAnimation: false,
                content() {
                    player.awakenSkill(event.name);
                    trigger.player.recoverTo(1);
                },
            },
            bilibili_longying: {},
            bilibili_huying: {},
            bilibili_moqu: {
                trigger: { global: ['phaseEnd', 'damageEnd'] },
                filter(event, player) {
                    if (event.name === 'damage') {
                        if (get.mode() === 'identity') return false;
                        return player.getFriends().includes(event.player);
                    }
                    return player.countCards('h') <= player.getHp();
                },
                forced: true,
                content() {
                    if (trigger.name === 'damage') player.chooseToDiscard('he', true);
                    else player.draw(2);
                },
            },
            bilibili_polu: {
                trigger: { global: 'die' },
                filter(event, player) {
                    if (event.player !== player && !player.isAlive()) return false;
                    const identity = get.mode() === 'identity', { source, player: target } = event;
                    return source?.isIn() && identity ? source === player : player.getFriends(true).includes(source) && identity ? target !== player : player.getEnemies().includes(target);
                },
                forced: true,
                forceDie: true,
                logTarget: 'source',
                async content(event, trigger, player) {
                    player.addMark(event.name, 1, false);
                    const targets = (get.mode() === 'identity' ? [player] : player.getFriends(true)).filter(i => i.isIn());
                    if (targets.length > 0) {
                        player.line(targets);
                        await game.asyncDraw(targets, player.countMark(event.name));
                        await game.delayx();
                    }
                },
            },
        },
        translate: {
            FaDongCharacter1: '诸侯伐董·将领',
            FaDongCharacter2: '<span style="font-family: yuanli">随从分包默认AI禁选</span><br>诸侯伐董·随从',
            FaDongCharacter3: '诸侯伐董·特殊',
            bilibili_mojun: '魔军',
            bilibili_mojun_info: '锁定技，友方角色使用【杀】对目标角色造成伤害后，你令其进行判定。若判定结果为黑色，则友方角色各摸一张牌。',
            bilibili_mojun_info_identity: '锁定技，当你使用【杀】对目标角色造成伤害后，你进行判定。若判定结果为黑色，则你摸一张牌。',
            FD_niufudongxie: '伐董牛辅董翓',
            FD_niufudongxie_prefix: '伐董',
            bilibili_tunjun: '屯军',
            bilibili_tunjun_info: '锁定技，每轮游戏开始时，若你的体力上限不为1，则你减1点体力上限，然后摸X张牌（X为你的体力上限）。',
            bilibili_jiaoxia: '狡黠',
            bilibili_jiaoxia_info: '锁定技，友方角色的黑色手牌不计入手牌上限。',
            bilibili_jiaoxia_info_identity: '锁定技，你的黑色手牌不计入手牌上限。',
            FD_lijue: '伐董李傕',
            FD_lijue_prefix: '伐董',
            bilibili_yangwu: '扬武',
            bilibili_yangwu_info: '锁定技，准备阶段，你对所有其他角色造成1点伤害，然后你失去1点体力。',
            FD_guosi: '伐董郭汜',
            FD_guosi_prefix: '伐董',
            bilibili_yanglie: '扬烈',
            bilibili_yanglie_info: '锁定技，准备阶段，你获得所有其他角色区域里的一张牌，然后你失去1点体力。',
            FD_zhangji: '伐董张济',
            FD_zhangji_prefix: '伐董',
            bilibili_jielve: '劫掠',
            bilibili_jielve_info: '锁定技，当你对一名其他角色造成伤害后，你获得其区域内的各一张牌，然后失去1点体力。',
            FD_fanchou: '伐董樊稠',
            FD_fanchou_prefix: '伐董',
            bilibili_fangong: '反攻',
            bilibili_fangong_info: '敌方角色对你使用牌后，你可以对其使用一张【杀】（无距离限制）。',
            bilibili_fangong_info_identity: '其他角色对你使用牌后，你可以对其使用一张【杀】（无距离限制）。',
            FD_dongyue: '伐董董越',
            FD_dongyue_prefix: '伐董',
            bilibili_kuangxi: '狂袭',
            bilibili_kuangxi_info: '出牌阶段，你可以失去1点体力，对一名其他角色造成1点伤害。若其因此进入濒死状态，则此技能于此回合内失效。',
            FD_feixiongjunzuo: '飞熊军左',
            bilibili_jingqi: '精骑',
            bilibili_jingqi_info: '锁定技，友方角色计算与敌方角色距离-1。',
            FD_fengyaojun: '凤瑶军',
            bilibili_fengying: '凤营',
            bilibili_fengying_info: '锁定技，敌方角色不能使用牌指定体力值唯一最低的友方角色。',
            bilibili_fengying_info: '锁定技，若你的体力值为全场唯一最低，则其他角色使用牌不能指定你为目标。',
            FD_feixiongjunyou: '飞熊军右',
            bilibili_ruiqi: '锐骑',
            bilibili_ruiqi_info: '锁定技，友方角色摸牌阶段额外摸一张牌。',
            bilibili_ruiqi_info_identity: '锁定技，摸牌阶段，你额外摸一张牌。',
            FD_baolvejun: '豹掠军',
            bilibili_baoying: '豹营',
            bilibili_baoying_info: '限定技，友方角色进入濒死状态时，你可以令其回复体力至1点。',
            bilibili_baoying_info_identity: '限定技，当你进入濒死状态时，你可以回复体力至1点。',
            FD_longxiangjun: '龙骧军',
            bilibili_longying: '龙营',
            bilibili_longying_info: '',
            FD_hubenjun: '虎贲军',
            bilibili_huying: '虎营',
            bilibili_huying_info: '',
            FD_huaxiong: '伐董华雄',
            FD_huaxiong_prefix: '伐董',
            bilibili_moqu: '魔躯',
            bilibili_moqu_info: '锁定技，每名角色的回合结束时，若你的手牌数不大于当前体力值，你摸两张牌；其他友方角色受到伤害后，你弃置一张牌。',
            bilibili_moqu_info_identity: '锁定技，每名角色的回合结束时，若你的手牌数不大于当前体力值，你摸两张牌。',
            FD_sunjian: '伐董孙坚',
            FD_sunjian_prefix: '伐董',
            bilibili_polu: '破掳',
            bilibili_polu_info: '锁定技，友方角色杀死一名敌方角色或你死亡时，你令友方角色各摸X张牌（X为此技能发动的次数）。',
            bilibili_polu_info_identity: '锁定技，当你杀死一名其他角色后，你摸X张牌（X为此技能发动的次数）。',
        },
    };
    for (const i in FaDongCharacter.character) {
        if (Array.isArray(FaDongCharacter.character[i])) FaDongCharacter.character[i] = get.convertedCharacter(FaDongCharacter.character[i]);
        FaDongCharacter.character[i].trashBin ??= [];
        if (_status['extension_活动武将_files']?.image.character.files.includes(`${i}.jpg`)) FaDongCharacter.character[i].img = `extension/活动武将/image/character/${i}.jpg`;
    }
    lib.namePrefix.set('伐董', {
        color: '#6c1fd1',
        showName: '董',
    });
    lib.config.all.sgscharacters.push('FaDongCharacter');
    lib.translate['FaDongCharacter_character_config'] = '<span style="font-family: xingkai">诸侯伐董</span>';
    return FaDongCharacter;
};

export default packs;