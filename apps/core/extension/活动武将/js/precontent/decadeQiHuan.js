import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const decadeQiHuan = {
        name: 'decadeQiHuan',
        connect: true,
        characterSort: {
            decadeQiHuan: {
                QH_qi: ['QH_caocao', 'QH_yuanshao', 'QH_yuanshu', 'QH_guotufengji', 'QH_yanwen', 'QH_caoang', 'QH_caoren', 'QH_jushou', 'QH_xuyou'],
                QH_huan: ['QH_fengxu', 'QH_duangui', 'QH_caojie', 'QH_houlan', 'QH_jianshuo', 'QH_chengkuang', 'QH_xiayun', 'QH_guosheng', 'QH_zuofeng'],
                QH_qi_boss: ['QH_hejin', 'QH_hetaihou'],
                QH_huan_boss: ['QH_zhangrang', 'QH_zhaozhong'],
            },
        },
        character: {
            QH_fengxu: ['male', 'qun', 10, ['QH_rehuanshi', 'QH_leixi', 'QH_huangjie']],
            QH_duangui: ['male', 'qun', 10, ['QH_rehuanshi', 'QH_suxi', 'QH_chibi']],
            QH_caojie: ['male', 'qun', 15, ['QH_rehuanshi', 'QH_huangbao']],
            QH_houlan: ['male', 'qun', 6, ['QH_rehuanshi', 'QH_lancai', 'QH_jingshe']],
            QH_jianshuo: ['male', 'qun', 20, ['QH_rehuanshi', 'QH_jibing']],
            QH_chengkuang: ['male', 'qun', 4, ['QH_rehuanshi', 'QH_andu', 'QH_biri']],
            QH_xiayun: ['male', 'qun', 8, ['QH_rehuanshi', 'QH_jifu']],
            QH_guosheng: ['male', 'qun', 10, ['QH_rehuanshi', 'QH_heimu', 'QH_heizhi']],
            QH_hejin: ['male', 'qun', 20, ['QH_zhenmou', 'QH_guiluan', 'QH_waixi', 'QH_quanba']],
            QH_hetaihou: ['female', 'qun', 20, ['QH_zunqin', 'QH_chuhuan', 'QH_nongquan', 'QH_shexie']],
            QH_caocao: ['male', 'wei', 18, ['rejianxiong', 'QH_lingba', 'QH_pozhan'], ['character:caocao']],
            QH_yuanshao: ['male', 'qun', 15, ['luanji', 'QH_xueyi', 'qiluan'], ['character:re_yuanshao']],
            QH_yuanshu: ['male', 'qun', 16, ['drlt_yongsi', 'QH_wangzun', 'QH_weidi'], ['character:yl_yuanshu']],
            QH_guotufengji: ['male', 'qun', 15, ['rejigong', 'shifei', 'QH_chanmou'], ['character:guotufengji']],
            QH_yanwen: ['male', 'qun', 16, ['shuangxiong', 'jianchu', 'QH_yongdou'], ['character:yanwen', 'name:颜|良-文|丑']],
            QH_caoang: ['male', 'wei', 15, ['kaikang', 'wushuang', 'feiying'], ['character:caoang']],
            QH_caoren: ['male', 'wei', 18, ['xinjushou', 'xinjiewei', 'xinshensu'], ['character:caoren']],
            QH_jushou: ['male', 'qun', 16, ['jianying', 'shibei', 'zhaxiang'], ['character:yj_jushou']],
            QH_xuyou: ['male', 'qun', 16, ['nzry_chenglve', 'nzry_shicai', 'reyingzi'], ['character:xuyou']],
            QH_zhangrang: ['male', 'qun', 20, ['QH_rehuanshi', 'QH_huoluan', 'QH_yankong', 'QH_jiquan', 'QH_luanzheng']],
            QH_zhaozhong: ['male', 'qun', 20, ['QH_rehuanshi', 'QH_duanzheng', 'QH_lianhuo', 'QH_huangkong', 'QH_luanzheng'], ['character:zhaozhong']],
            QH_zuofeng: ['male', 'qun', 18, ['QH_rehuanshi', 'QH_suohui', 'QH_huolu']],
        },
        characterIntro: {
            fengxu: '封谞，东汉末年宦官，汉灵帝中平元年为中常侍，信黄巾道，189年逝世。',
            QH_caojie: '曹节（？―181年），字汉丰 ，南阳育阳（今河南省南阳市宛城区瓦店镇）人。东汉宦官。因事入宫，累迁西园骑。汉顺帝时期，迁小黄门。汉桓帝继位，迁中常侍，加任奉车都尉。拥戴汉灵帝有功，册封长安乡侯。联合长乐五官史朱瑀等矫朝诛杀窦武、陈蕃等人，升任长乐卫尉，进封育阳县侯。建宁二年（169年），加位特进、大长秋。权倾朝野，诬害勃海王刘悝，累迁尚书令。光和四年（181年），曹节去世，获赠车骑将军。',
            houlan: '侯览（？—172年），山阳防东（今山东单县东北）人，东汉宦官。延熹年间赐爵为关内侯。因诛梁冀有功，进封高乡侯，后迁为长乐太仆。任官期间，专横跋扈，贪婪放纵，大肆抢掠官民财物。先后夺民田地一百一十八顷，宅第三百八十一所，模仿宫苑兴建府第十六处。他还掠夺妇女，肆虐百姓。为其母大起冢墓，督邮张俭破其家宅，藉没资财。侯览为了报复，诬张俭与长乐少府李膺、太仆杜密等为党人，造成历史上有名的党锢之祸，先后被杀被流放者三百余人，被囚禁者六、七百人。熹平元年（172年），有司举奏侯览专权骄奢，下诏收其印绶，随即自杀身亡。其阿附者皆免官。',
            chengkuang: '程旷（？——189）东汉宦官，十常侍之一。演义虚构人物。',
            zuofeng: '左丰，生平不详，三国演义第一回中出现。据演义记载，光和末年，黄巾四起，朝廷派遣中郎将卢植、皇甫嵩、朱儁领兵讨伐黄巾。当时黄巾张角的军队15万，与卢植的5万人相聚于广宗，数次交战，未见胜负。正值朝廷派黄门左丰前来考察军情，左丰挟公向卢植索取贿赂，但卢植说：“军粮尚缺，安有馀钱奉承天使？”于是左丰怀恨在心，回到朝廷后污蔑卢植故意按兵不动、怠慢军心。于是天颜大怒，派遣中郎将董卓代替卢植将兵。',
        },
        skill: {
            QH_huanshi: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { target: 'useCardToBefore' },
                filter(event, player) {
                    return get.type(event.card) == 'delay';
                },
                forced: true,
                content() {
                    'step 0'
                    var func = function (result) {
                        if (get.color(result) == 'black') return 1;
                        return -1;
                    };
                    trigger.player.judge(func);
                    'step 1'
                    if (result.bool) trigger.cancel();
                },
            },
            QH_rehuanshi: {
                audio: 'QH_huanshi',
                trigger: { player: 'useCardToPlayered', target: 'useCardToTarget' },
                filter(event, player, name) {
                    if (player.hasSkill('QH_rehuanshi_' + name)) return false;
                    if (!game.hasPlayer(function (current) {
                        if (!lib.skill.lztunjiang.filterx({ player: current }, player)) return false;
                        return current != player && current.hasSkill('QH_rehuanshi') && current.countCards('he', card => get.type2(card) == get.type2(event.card));
                    })) return false;
                    if (name == 'useCardToTarget') return lib.skill.lztunjiang.filtery({ player: event.player }, player) && event.targets.length == 1;
                    return event.isFirstTarget && event.targets.some(target => lib.skill.lztunjiang.filtery({ player: target }, player));
                },
                forced: true,
                content() {
                    player.addTempSkill('QH_rehuanshi_' + event.triggername);
                    var target = game.filterPlayer(function (current) {
                        if (!lib.skill.lztunjiang.filterx({ player: current }, player)) return false;
                        return current != player && current.hasSkill('QH_rehuanshi') && current.countCards('he', card => get.type2(card) == get.type2(trigger.card));
                    }).randomGet();
                    target.discard(target.getCards('he', card => card => get.type2(card) == get.type2(trigger.card)).randomGets(1));
                    if (event.triggername == 'useCardToTarget') {
                        trigger.getParent().targets.remove(player);
                        trigger.getParent().triggeredTargets2.remove(player);
                    }
                    else trigger.getParent().directHit.addArray(trigger.targets.some(target => lib.skill.lztunjiang.filtery({ player: target }, player)));
                },
                subSkill: {
                    useCardToPlayered: { charlotte: true },
                    useCardToTarget: { charlotte: true },
                },
            },
            QH_huangbao: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return player.getEnemies().length > 0;
                },
                forced: true,
                content() {
                    'step 0'
                    player.chooseUseTarget({ name: 'nanman' }, true, []);
                    'step 1'
                    if (!player.hasHistory('sourceDamage', function (evt) {
                        var card = evt.card;
                        if (!card || card.name != 'nanman') return false;
                        var evtx = evt.getParent('useCard');
                        return evtx.card == card && evtx.getParent() == event;
                    })) player.draw(3);
                },
            },
            QH_andu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'phaseEnd' },
                filter(event, player) {
                    return player.getEnemies().includes(event.player) && player.hp >= event.player.hp;
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.player.damage();
                },
            },
            QH_biri: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageBegin4' },
                filter(event, player) {
                    return event.source && player.getEnemies().includes(event.source);
                },
                forced: true,
                logTarget: 'source',
                content() {
                    var num = trigger.source.countCards('h')
                    if (num > 0) trigger.source.discard(trigger.source.getCards('h'));
                    if (num < player.hp) trigger.num--;
                },
            },
            QH_suxi: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { source: 'damageSource' },
                filter(event, player) {
                    const target = event.player;
                    return [target.getNext(), target.getPrevious()].some(current => current.isIn()) && player.countCards('he');
                },
                async cost(event, trigger, player) {
                    const target = trigger.player;
                    const list = [target.getNext(), target.getPrevious()];
                    event.result = await player.chooseCardTarget({
                        prompt: get.prompt2(event.skill),
                        filterCard: lib.filter.cardDiscardable,
                        position: 'he',
                        filterTarget(card, player, target) {
                            return get.event().list.includes(target);
                        },
                        ai1(card) {
                            return 7 - get.value(card);
                        },
                        ai2(target) {
                            const player = get.player();
                            return get.effect(target, { name: 'losehp' }, player, player)
                        }
                    }).set('list', list).forResult();
                },
                async content(event, trigger, player) {
                    await player.discard(event.cards);
                    await event.targets[0].loseHp();
                },
            },
            QH_chibi: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseEnd' },
                filter(event, player) {
                    return !player.hasSha();
                },
                forced: true,
                content() {
                    var cards = [];
                    for (var i = 0; i < 2; i++) {
                        var card = get.cardPile2(function (card) {
                            return card.name == 'sha' && !cards.includes(card);
                        });
                        if (card) cards.push(card);
                    }
                    if (cards.length) player.gain(cards, 'gain2');
                },
            },
            QH_leixi: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: ['useCard', 'respond'] },
                filter(event, player) {
                    return ['sha', 'shan'].includes(event.card.name) && player != _status.currentPhase && game.hasPlayer(current => player != current);
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.hasSkill), lib.filter.notMe).set('ai', target => {
                        const player = get.player();
                        const eff1 = get.damageEffect(target, player, player, 'thunder');
                        const eff2 = get.effect(target, { name: 'guohe_copy2' }, player, player);
                        return Math.max(eff1, eff2);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const result = await target.judge().forResult();
                    if (result?.color == 'red') await player.discardPlayerCard(target, 'he', 2, true);
                    else if (result?.color == 'black') await target.damage(2, 'thunder');
                },
                ai: { expose: 0.2 },
            },
            QH_huangjie: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    var bool = true;
                    if (event.targets) for (var i of event.targets) {
                        if (player.getEnemies().includes(i)) bool = false;
                    }
                    return player.isPhaseUsing() && bool;
                },
                forced: true,
                content() {
                    player.draw();
                },
            },
            QH_heimu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'useCard' },
                filter(event, player) {
                    if (get.color(event.card, event.player) !== 'black') return false;
                    return player.getEnemies().includes(event.player) || (event.player == player && player.getEnemies().some(current => current.countCards('he')));
                },
                forced: true,
                logTarget(event, player) {
                    if (event.player == player) {
                        return player.getEnemies(current => current.countCards('he')).randomGet();;
                    }
                    return event.player;
                },
                async content(event, trigger, player) {
                    if (trigger.player == player) {
                        await event.targets[0].randomDiscard('he', 'random');
                    }
                    else {
                        await player.draw();
                    }
                },
            },
            QH_heizhi: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'judgeEnd' },
                preHidden: true,
                filter(event, player) {
                    return get.color(event.result.card, player) == 'black';
                },
                forced: true,
                content() {
                    for (var i of player.getEnemies()) {
                        player.line(i, 'fire');
                        i.damage();
                    }
                },
            },
            QH_lancai: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return player.countCards('h') < player.maxHp;
                },
                forced: true,
                content() {
                    player.draw(player.maxHp - player.countCards('h'));
                },
            },
            QH_jingshe: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageEnd' },
                filter(event, player) {
                    return player.getEnemies().includes(_status.currentPhase);
                },
                forced: true,
                logTarget(event, player) {
                    return _status.currentPhase;
                },
                content() {
                    var target = _status.currentPhase;
                    target.addTempSkill('drlt_wanglie2', 'phaseUseAfter');
                    if (trigger.num > 1) player.recover();
                },
            },
            QH_jibing: {
                group: 'QH_jibing_damage',
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseJieshuBegin' },
                forced: true,
                async content(event, trigger, player) {
                    await player.loseMaxHp();
                },
                subSkill: {
                    damage: {
                        audio: 'QH_jibing',
                        trigger: { player: 'loseMaxHpEnd' },
                        filter(event, player) {
                            return player.getEnemies().length > 0;
                        },
                        forced: true,
                        logTarget(event, player) {
                            return player.getEnemies().randomGet();
                        },
                        async content(event, trigger, player) {
                            await event.targets[0].damage();
                        },
                    },
                },
            },
            QH_jifu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return game.hasPlayer(function (current) {
                        return player.getEnemies().includes(current) && current.countCards('h') > player.countCards('h');
                    });
                },
                forced: true,
                content() {
                    'step 0'
                    player.chooseTarget('获得一名手牌数大于你的敌方角色一张手牌，然后重复此流程直到所有敌方角色的手牌数均小于等于你', true, function (card, player, target) {
                        return player.getEnemies().includes(target) && target.countCards('h') > player.countCards('h');
                    }).set('ai', function (target) {
                        return target.countCards('h');
                    });
                    'step 1'
                    if (result.bool) {
                        player.line(result.targets[0]);
                        player.gainPlayerCard(result.targets[0], 'h', true);
                    }
                    else event.finish();
                    'step 2'
                    if (game.hasPlayer(function (current) {
                        return player.getEnemies().includes(current) && current.countCards('h') > player.countCards('h');
                    })) event.goto(0);
                },
            },
            //何进
            QH_zhenmou: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'useCard' },
                filter(event, player) {
                    if (!lib.skill.lztunjiang.filtery(event, player) || !event.player.isPhaseUsing()) return false;
                    var evt = event.getParent('phaseUse');
                    var history = event.player.getHistory('useCard', function (evt2) {
                        return evt2.getParent('phaseUse') == evt && get.type2(evt2.card) == 'trick';
                    }), num = history.indexOf(event);
                    return num != -1 && num < 2;
                },
                forced: true,
                logTarget: 'player',
                content() {
                    'step 0'
                    trigger.player.chooseToDiscard('he', 2, '镇谋：弃置两张非锦囊牌', function (card, player) {
                        return get.type2(card) != 'trick';
                    }).set('ai', card => lib.skill.zhiheng.check(card));
                    'step 1'
                    if (!result.bool) {
                        trigger.cancel();
                        game.broadcastAll(ui.clear);
                    }
                    else event.finish();
                    'step 2'
                    game.delayx();
                },
            },
            QH_guiluan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    if (!['sha', 'juedou', 'guohe'].includes(event.card.name)) return false;
                    return game.hasPlayer(function (current) {
                        return lib.skill.lztunjiang.filtery({ player: current }, player) && !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
                    });
                },
                forced: true,
                usable: 3,
                logTarget(event, player) {
                    return game.filterPlayer(function (current) {
                        return lib.skill.lztunjiang.filtery({ player: current }, player) && !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
                    });
                },
                content() {
                    trigger.targets.addArray(lib.skill.QH_guiluan.logTarget(trigger, player));
                },
            },
            QH_waixi: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { source: 'damageSource' },
                filter(event, player) {
                    return _status.currentPhase && _status.currentPhase == player;
                },
                forced: true,
                usable: 3,
                content() {
                    'step 0'
                    player.draw(3);
                    'step 1'
                    var targets = game.filterPlayer(current => current.countCards('h') < player.countCards('h') && lib.skill.lztunjiang.filtery({ player: current }, player));
                    if (targets.length) {
                        for (var target of targets) player.gainPlayerCard(target, 'he', true);
                    }
                },
            },
            QH_quanba: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'useCardToPlayered' },
                filter(event, player) {
                    if (!lib.skill.lztunjiang.filtery(event, player) || !_status.currentPhase || _status.currentPhase != event.player) return false;
                    return event.isFirstTarget && event.player.getHistory('useCard', evt => evt.card.name == 'sha').length >= 3;
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.player.loseHp();
                },
            },
            //何太后
            QH_zunqin: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'cardsDiscardAfter' },
                filter(event, player) {
                    if (!event.cards.filterInD('d').length) return false;
                    var evt = event.getParent();
                    if (evt.name != 'orderingDiscard') return false;
                    var evtx = (evt.relatedEvent || evt.getParent());
                    return evtx.player.hasHistory('useCard', function (evtxx) {
                        return evtx.getParent() == (evtxx.relatedEvent || evtxx.getParent()) && evtxx.targets.includes(player) && get.type2(evtxx.card) == 'trick' && get.color(evtxx.card, evtx.player) == 'black';
                    });
                },
                usable: 3,
                forced: true,
                logTarget: (event) => (event.getParent().relatedEvent || event.getParent().getParent()).player,
                content() {
                    player.gain(trigger.cards.filterInD('d'), 'gain2');
                },
            },
            QH_chuhuan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCardToPlayered', target: 'useCardToTargeted' },
                filter(event, player) {
                    if (event.player == event.target) return false;
                    if (event.card.name == 'sha' && event.player == player) return true;
                    if (get.type(event.card) == 'trick' && event.target == player) return true;
                    return false;
                },
                logTarget(event, player) {
                    return get.type(event.card) == 'trick' ? event.player : event.target;
                },
                forced: true,
                content() {
                    var targets = [trigger.player, trigger.target];
                    for (var i of targets) i.loseHp();
                },
            },
            QH_nongquan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageEnd' },
                filter(event, player) {
                    const targets = game.filterPlayer(current => lib.skill.lztunjiang.filtery({ player: current }, player));
                    if (!targets.length) return false;
                    return targets.length == 1 || targets[0].hp != targets[1].hp;
                },
                logTarget(event, player) {
                    const targets = game.filterPlayer(current => lib.skill.lztunjiang.filtery({ player: current }, player));
                    targets.sort((a, b) => a.hp - b.hp);
                    return targets[0];
                },
                forced: true,
                content() {
                    var target = lib.skill.QH_nongquan.logTarget(trigger, player);
                    if (target) {
                        target.damage(2);
                        target.discard(target.getCards('he').randomGets(2)).discarder = player;
                    }
                },
            },
            QH_shexie: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'dying' },
                filter(event, player) {
                    if (!event.player.countCards('h')) return false;
                    return lib.skill.lztunjiang.filtery(event, player);
                },
                logTarget: 'player',
                forced: true,
                content() {
                    player.gain(trigger.player.getCards('h').randomGets(2), trigger.player, 'giveAuto');
                },
            },
            //曹操
            QH_lingba: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseBegin' },
                filter(event, player) {
                    return player.isMaxHandcard() && player.getEnemies().length;
                },
                forced: true,
                logTarget(event, player) {
                    if (player.countCards('h') < player.hp * 2) return player.getEnemies().sortBySeat();
                    return player.getEnemies().randomGet();
                },
                async content(event, trigger, player) {
                    for (const target of event.targets) await target.damage();
                },
            },
            QH_pozhan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'drawEnd' },
                filter(event, player) {
                    return _status.currentPhase && _status.currentPhase != player && player.canUse({ name: 'sha', isCard: true }, _status.currentPhase, false);
                },
                check(event, player) {
                    return get.effect(_status.currentPhase, { name: 'sha', isCard: true }, player, player) > 0;
                },
                logTarget: () => _status.currentPhase,
                content() {
                    player.useCard({ name: 'sha', isCard: true }, _status.currentPhase, false);
                },
            },
            //袁绍
            QH_xueyi: {
                mod: {
                    maxHandcard(player, num) {
                        return num + game.countPlayer(current => current.group == 'qun');
                    },
                },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseDrawBegin2' },
                filter(event, player) {
                    return !event.numFixed;
                },
                forced: true,
                content() {
                    trigger.num = game.countPlayer(current => current.group == 'qun');
                },
            },
            //袁术
            QH_wangzun: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'phaseJieshuBegin' },
                filter(event, player) {
                    if (!lib.skill.lztunjiang.filtery(event, player)) return false;
                    var num = 0;
                    event.player.getHistory('sourceDamage', function (evt) {
                        if (evt.player == player) num += evt.num;
                    });
                    return num != 1;
                },
                logTarget: 'player',
                content() {
                    var num = 0;
                    trigger.player.getHistory('sourceDamage', function (evt) {
                        if (evt.player == player) num += evt.num;
                    });
                    if (num == 0) trigger.player.chooseToDiscard(2, 'he', true);
                    else trigger.player.damage();
                },
            },
            QH_weidi: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: ['loseAfter', 'loseAsyncAfter'] },
                filter(event, player) {
                    if (event.type != 'discard') return false;
                    return game.hasPlayer(function (current) {
                        if (current == player || current.group != 'qun') return false;
                        var evt = event.getl(current);
                        return evt?.cards2?.someInD('d');
                    });
                },
                forced: true,
                content() {
                    var cards = [];
                    game.countPlayer(function (current) {
                        if (current == player || current.group != 'qun') return false;
                        var evt = event.getl(current);
                        if (evt?.cards2?.someInD('d')) cards.addArray(evt.cards2.filterInD('d'));
                    });
                    var card = cards.randomGet();
                    player.gain(card);
                    var targets = game.filterPlayer(function (current) {
                        if (current == player || current.group != 'qun') return false;
                        var evt = event.getl(current);
                        return evt?.cards2.filterInD('d').includes(card);
                    });
                    if (targets.length) {
                        for (var i of targets) player.gain(i.getCards('hej').randomGets(1), i, 'giveAuto');
                    }
                },
            },
            //郭图逄纪
            QH_chanmou: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { target: 'useCardToTargeted' },
                filter(event, player) {
                    if (event.targets.length <= 1) return false;
                    return event.targets.some(target => target != player && target.countCards('he'));
                },
                usable: 1,
                content() {
                    var target = trigger.targets.filter(target => target != player && target.countCards('he')).randomGet();
                    player.gain(target.getCards('he').randomGets(Math.min(target.countCards('he'), trigger.targets.length)), target, 'giveAuto');
                },
            },
            //颜良文丑
            QH_yongdou: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'respond' },
                filter(event, player) {
                    if (!event.getParent(2).name != 'juedou' || event.card.name != 'sha') return false;
                    return (get.color(event.card, event.player) == 'red' && player.countDiscardableCards(player, 'he')) || get.color(event.card, event.player) == 'black';
                },
                forced: true,
                logTarget: 'player',
                content() {
                    if (get.color(trigger.card, trigger.player) == 'red') player.discard(player.getCards('he').randomGets(1));
                    else player.draw();
                },
            },
            //张让
            QH_huoluan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseBegin' },
                forced: true,
                content() {
                    var num = 4;
                    while (num > 0) {
                        num--;
                        var card = get.cardPile(function (card) {
                            return get.type2(card) == 'trick' && get.color(card, false) == 'black' && player.hasUseTarget(card);
                        });
                        if (card) player.chooseUseTarget(card, true, 'nopopup');
                        else break;
                    }
                },
            },
            QH_yankong: {
                onremove: true,
                intro: { content: '下次对敌方角色造成的伤害+#' },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageEnd', source: 'damageBegin1' },
                filter(event, player, name) {
                    if (name == 'damageEnd') return player.countMark('QH_yankong') < 4;
                    return lib.skill.lztunjiang.filtery(event, player) && player.hasMark('QH_yankong');
                },
                forced: true,
                content() {
                    if (event.triggername == 'damageEnd') player.addMark('QH_yankong', 1, false);
                    else {
                        var num = player.countMark('QH_yankong');
                        player.removeMark('QH_yankong', num, false);
                        trigger.num += player.countMark('QH_yankong');
                    }
                },
            },
            QH_jiquan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseZhunbeiBegin' },
                forced: true,
                content() {
                    'step 0'
                    if (player.countCards('h') < 10) player.drawTo(10);
                    'step 1'
                    if (player.isMaxHandcard()) {
                        var targets = game.filterPlayer(current => current.countCards('h') && lib.skill.lztunjiang.filtery({ player: current }, player));
                        if (targets.length) {
                            player.line(targets);
                            for (var i of targets) player.gain(i.getCards('h').randomGets(1), i, 'giveAuto');
                        }
                    }
                },
            },
            QH_luanzheng: {
                audio: 'ext:活动武将/audio/skill:true',
                audioname2: { QH_zhaozhong: 'QH_luanzheng_zhaozhong' },
                trigger: { global: ['gainAfter', 'loseAsyncAfter'] },
                filter(event, player) {
                    return game.hasPlayer(function (current) {
                        if (!lib.skill.lztunjiang.filtery({ player: current }, player)) return false;
                        return current.isPhaseUsing() && event.getg(current).length > 0 && current.countCards('h') > 10;
                    });
                },
                forced: true,
                logTarget(event, player) {
                    return game.findPlayer(function (current) {
                        if (!lib.skill.lztunjiang.filtery({ player: current }, player)) return false;
                        return current.isPhaseUsing() && event.getg(current).length > 0 && current.countCards('h') > 10;
                    });
                },
                content() {
                    lib.skill.QH_luanzheng.logTarget(trigger, player).addTempSkill('drlt_wanglie2');
                },
                group: 'QH_luanzheng_discard',
                subSkill: {
                    discard: {
                        audio: 'QH_luanzheng',
                        audioname2: { QH_zhaozhong: 'QH_luanzheng_zhaozhong' },
                        trigger: { global: 'useCardAfter' },
                        filter(event, player) {
                            if (!event.isPhaseUsing()) return false;
                            var num = 0;
                            player.getHistory('damage', evt => num += evt.num);
                            return num >= 5 && lib.skill.lztunjiang.filtery(event, player) && event.player.countCards('he');
                        },
                        forced: true,
                        logTarget: 'player',
                        content() {
                            trigger.player.discard(trigger.player.getCards('he').randomGets(1));
                        },
                    },
                },
            },
            //赵忠
            QH_duanzheng: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'useCard' },
                filter(event, player) {
                    if (!_status.currentPhase || _status.currentPhase != event.player) return false;
                    if (!lib.skill.lztunjiang.filtery(event, player)) return false;
                    return event.player.getHistory('useCard').indexOf(event) == 0;
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.player.discard(trigger.player.getCards('h', card => get.suit(card, player) == get.suit(trigger.card, player)));
                },
            },
            QH_lianhuo: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageEnd' },
                filter(event, player) {
                    if (!game.hasPlayer(current => lib.skill.lztunjiang.filtery({ player: current }, player))) return false;
                    return player.getHistory('damage').indexOf(event) < 3;
                },
                forced: true,
                content() {
                    var target = game.filterPlayer(current => lib.skill.lztunjiang.filtery({ player: current }, player)).randomGet();
                    player.line(target);
                    target.loseHp();
                },
            },
            QH_huangkong: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { target: 'useCardToTargeted' },
                filter(event, player) {
                    if (event.targets.length != 1) return false;
                    if (player == _status.currentPhase) return false;
                    if (!player.isMinHandcard(true)) return false;
                    return event.card.name == 'sha' || (get.type2(event.card) == 'trick' && get.tag(event.card, 'damage'));
                },
                forced: true,
                content() {
                    player.draw(4);
                },
            },
            QH_luanzheng_zhaozhong: { audio: 'ext:活动武将/audio/skill:true' },
            //左丰
            QH_suohui: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { target: 'useCardToTargeted' },
                filter(event, player) {
                    return event.player != player;
                },
                forced: true,
                content() {
                    'step 0'
                    if (!trigger.player.countCards('he')) event._result = { bool: false };
                    else trigger.player.chooseCard('索贿：交给' + get.translation(player) + '一张牌，或令' + get.translation(player) + '摸两张牌', 'he').set('ai', function (card) {
                        if (_status.event.goon) return 0;
                        return 5 - get.value(card);
                    }).set('goon', get.attitude(trigger.player, player) >= 0);
                    'step 1'
                    if (result.bool) player.gain(result.cards, trigger.player, 'giveAuto');
                    else player.draw(2);
                },
            },
            QH_huolu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return player.isMaxHandcard();
                },
                forced: true,
                content() {
                    'step 0'
                    var target = game.findPlayer(current => current.isMinHandcard());
                    var num = player.countCards('h') - target.countCards('h');
                    if (num > 0) player.chooseToDiscard(num, 'he', true);
                    'step 1'
                    var targets = game.filterPlayer(current => lib.skill.lztunjiang.filtery({ player: current }, player));
                    if (targets.length) {
                        var map = {}, num = 5;
                        while (num > 0) {
                            num--;
                            var target = targets.randomGet();
                            map[target.playerid] ??= 0;
                            map[target.playerid]++;
                        }
                        targets = targets.filter(current => map[current.playerid]);
                        for (var i of targets) {
                            player.line(i);
                            i.damage(map[i.playerid]);
                        }
                    }
                },
            },
        },
        translate: {
            QH_qi: '戚宦·外戚',
            QH_huan: '戚宦·宦官',
            QH_qi_boss: 'BOSS·外戚',
            QH_huan_boss: 'BOSS·宦官',
            QH_fengxu: '封谞',
            QH_duangui: '段珪',
            QH_caojie: '曹节',
            QH_houlan: '侯览',
            QH_jianshuo: '蹇硕',
            QH_chengkuang: '程旷',
            QH_xiayun: '夏恽',
            QH_guosheng: '郭胜',
            QH_huanshi: '宦势',
            QH_huanshi_info: '锁定技，当你成为延时锦囊牌的目标后，进行一次判定，若结果为黑色，将此牌置入弃牌堆。',
            QH_leixi: '雷袭',
            QH_leixi_info: '当你于回合外使用或打出【杀】或【闪】时，你可以选择一名其他角色，令其进行判定，若结果为红色，你弃置该角色两张牌；若结果为黑色，你对其造成2点伤害。',
            QH_huangjie: '黄结',
            QH_huangjie_info: '锁定技，出牌阶段，你使用一张牌时，若此牌目标不是敌方角色，你摸一张牌。',
            QH_suxi: '速袭',
            QH_suxi_info: '当你造成伤害后，你可以弃置一张牌令受伤角色的上家或下家失去1点体力。',
            QH_chibi: '持匕',
            QH_chibi_info: '锁定技，出牌阶段结束时，若你手牌中没有杀，你从牌堆中获得两张【杀】。（没有不会获得，牌堆中若仅有一张则只获得一张）',
            QH_huangbao: '荒暴',
            QH_huangbao_info: '锁定技，出牌阶段开始时，视为对所有敌方角色使用一张【南蛮入侵】。若此【南蛮入侵】没有造成伤害，你摸三张牌。',
            QH_lancai: '揽财',
            QH_lancai_info: '锁定技，出牌阶段开始时，你将手牌摸至体力上限。',
            QH_jingshe: '惊蛇',
            QH_jingshe_info: '锁定技，当你受到伤害后，若此时为敌方角色的回合，该角色不能使用牌直到出牌阶段结束。若此伤害超过1点，你回复1点体力。',
            QH_jibing: '集兵',
            QH_jibing_info: '锁定技，回合结束时，你减少1点体力上限；当你的体力上限减少时，你对随机一名敌方角色造成1点伤害。',
            QH_andu: '暗毒',
            QH_andu_info: '锁定技，敌方角色的回合结束时，若其体力值小于等于你，你对其造成1点伤害。',
            QH_biri: '蔽日',
            QH_biri_info: '锁定技，当你受到敌方角色造成的伤害时，该角色弃置所有手牌；若其弃置的手牌数小于你的体力值，此伤害-1。',
            QH_jifu: '嫉富',
            QH_jifu_info: '锁定技，准备阶段，你获得手牌数大于你的敌方角色一张手牌。重复此步骤直到所有敌方角色手牌数都不大于你。',
            QH_heimu: '黑幕',
            QH_heimu_info: '锁定技，敌方角色使用黑色牌时，你摸一张牌。你使用黑色牌时，敌方随机一名角色随机弃置一张牌。',
            QH_heizhi: '黑邸',
            QH_heizhi_info: '锁定技，你的判定牌生效时，若结果为黑色，你对所有敌方角色造成1点伤害。',
            QH_hejin: '何进',
            QH_zhenmou: '镇谋',
            QH_zhenmou_info: '锁定技，敌方角色于其出牌阶段使用前两张锦囊牌时，其需弃置两张非锦囊牌，否则此牌无效。',
            QH_guiluan: '贵乱',
            QH_guiluan_info: '锁定技，每回合限三次，当你使用【杀】、【决斗】、【过河拆桥】时，若场上有未成为目标的敌方角色，你令这些角色也成为此牌目标。',
            QH_waixi: '外檄',
            QH_waixi_info: '锁定技，每回合限三次，你的回合内，当你造成伤害后，你可以摸三张牌，然后依次获得所有手牌数小于你的敌方角色的各一张牌。',
            QH_quanba: '权霸',
            QH_quanba_info: '锁定技，敌方角色于其回合内使用【杀】指定目标后，若其本回合使用【杀】的次数不小于3，其失去1点体力。',
            QH_hetaihou: '何太后',
            QH_zunqin: '尊亲',
            QH_zunqin_info: '锁定技，每回合限三次，以你为目标的黑色锦囊牌进入弃牌堆后，你获得之。',
            QH_chuhuan: '除患',
            QH_chuhuan_info: '锁定技。你使用【杀】指定目标后，你和目标角色各失去1点体力。其他角色使用普通锦囊牌指定你为目标后，你与使用者各失去1点体力。',
            QH_nongquan: '弄权',
            QH_nongquan_info: '锁定技，当你受到伤害后，你对敌方体力值唯一最小的角色造成2点伤害，然后你随机弃置其两张牌。',
            QH_shexie: '蛇蝎',
            QH_shexie_info: '锁定技，敌方角色进入濒死状态后，你随机获得其两张手牌。',
            QH_caocao: '曹操',
            QH_lingba: '凌霸',
            QH_lingba_info: '锁定技，回合开始时，若你的手牌数为全场最多，你随机对一名敌方角色造成1点伤害，若你的手牌数不小于你的体力值的2倍，则改为所有敌方角色。',
            QH_pozhan: '迫战',
            QH_pozhan_info: '当你于回合外摸牌后，你可以视为对当前回合角色使用一张【杀】。',
            QH_yuanshao: '袁绍',
            QH_xueyi: '血裔',
            QH_xueyi_info: '锁定技。①摸牌阶段，你改为摸X张牌。②你的手牌上限+X。（X为场上的群势力角色数）',
            QH_yuanshu: '袁术',
            QH_wangzun: '妄尊',
            QH_wangzun_info: '锁定技，敌方角色的结束阶段，若其本回合对你造成的伤害总数为：0，其弃置两张牌；大于1，你对其造成1点伤害。',
            QH_weidi: '伪帝',
            QH_weidi_info: '锁定技，其他群势力角色的牌因弃置进入弃牌堆后，你随机获得其中的一张，然后随机获得其区域内的一张牌。',
            QH_guotufengji: '郭图逄纪',
            QH_chanmou: '谗谋',
            QH_chanmou_info: '每回合限一次，当你成为一张牌的目标后，若此牌目标不唯一，你可以随机获得一名其他目标角色的X张牌（X为此牌指定的目标数）。',
            QH_yanwen: '颜良文丑',
            QH_yongdou: '勇斗',
            QH_yongdou_info: '锁定技，当一名角色使用【杀】响应决斗时，若此【杀】颜色为：红色，你随机弃置一张牌；黑色，你摸一张牌。',
            QH_caoang: '曹昂',
            QH_caoren: '曹仁',
            QH_jushou: '沮授',
            QH_xuyou: '许攸',
            QH_rehuanshi: '宦势',
            QH_rehuanshi_info: '锁定技，每回合每项各限一次：①当你成为敌方角色使用牌的唯一目标时，拥有〖宦势〗的一名其他友方角色随机弃置一张与此牌类别相同的牌，然后取消此牌的目标。②当你使用牌指定敌方角色后，拥有〖宦势〗的一名其他友方角色随机弃置一张与此牌类别相同的牌，然后令此牌不可被响应。',
            QH_zhangrang: '张让',
            QH_huoluan: '祸乱',
            QH_huoluan_info: '锁定技，出牌阶段开始时，你随机使用牌堆中的四张可以使用的黑色锦囊牌。',
            QH_yankong: '炎恐',
            QH_yankong_info: '锁定技，当你受到伤害后，你下一次对敌方角色造成的伤害+X。',
            QH_jiquan: '集权',
            QH_jiquan_info: '锁定技，准备阶段，你将手牌数摸至十张，然后若你的手牌数为全场最多，你获得所有敌方角色的随机一张手牌。',
            QH_luanzheng: '乱政',
            QH_luanzheng_info: '锁定技。①敌方角色于出牌阶段获得牌后，若其手牌数超过十张，则其本回合不能再使用牌。②敌方角色于出牌阶段使用牌结算完毕后，若你本回合受到的伤害不小于5点，其随机弃置一张牌。',
            QH_zhaozhong: '赵忠',
            QH_duanzheng: '断政',
            QH_duanzheng_info: '锁定技，敌方角色于其回合内使用第一张牌时，其弃置所有与此牌花色相同的手牌。',
            QH_lianhuo: '连祸',
            QH_lianhuo_info: '锁定技，当你受到伤害后，若此伤害为你本回合受到的前三次伤害，则令随机一名敌方角色失去1点体力。',
            QH_huangkong: '惶恐',
            QH_huangkong_info: '锁定技，当你于回合外成为【杀】或伤害类锦囊牌的目标后，若你的手牌数为全场唯一最少，则你摸四张牌。',
            QH_zuofeng: '左丰',
            QH_suohui: '索贿',
            QH_suohui_info: '锁定技，当你成为其他角色使用牌的目标后，其选择一项：①交给你一张牌；②令你摸两张牌。',
            QH_huolu: '祸赂',
            QH_huolu_info: '锁定技，出牌阶段开始时，若你的手牌数为全场最多，你须将手牌数弃置至全场最少，然后将总共5点随机伤害分配给任意敌方角色。',
        },
    };
    for (const i in decadeQiHuan.character) {
        if (Array.isArray(decadeQiHuan.character[i])) decadeQiHuan.character[i] = get.convertedCharacter(decadeQiHuan.character[i]);
        decadeQiHuan.character[i].trashBin ??= [];
        if (_status['extension_活动武将_files']?.audio.die.files.includes(`${i}.mp3`)) {
            decadeQiHuan.character[i].dieAudios ??= [];
            decadeQiHuan.character[i].dieAudios.push('ext:活动武将/audio/die:true');
            decadeQiHuan.translate[`#ext:活动武将/audio/die/${i}:die`] ??= '点击播放阵亡配音';
        }
        if (_status['extension_活动武将_files']?.image.character.files.includes(`${i}.jpg`)) decadeQiHuan.character[i].img = `extension/活动武将/image/character/${i}.jpg`;
    }
    lib.config.all.sgscharacters.push('decadeQiHuan');
    lib.translate['decadeQiHuan_character_config'] = '<span style="font-family: xingkai">戚宦之争</span>';
    return decadeQiHuan;
};

export default packs;