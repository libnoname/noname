import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const MiNiAppkill = {
        name: 'MiNiAppkill',
        connect: true,
        characterSort: {
            MiNiAppkill: {
                MiNiApp_standard: ['mp_liubei', 'mp_caocao', 'mp_zhaoyun', 'mp_machao', 'mp_ganning', 'mp_xiahoudun', 'mp_xuzhu', 'mp_zhugeliang', 'mp_lvmeng', 'mp_zhouyu', 'mp_luxun', 'mp_simayi', 'mp_huatuo', 'mp_huangyueying', 'mp_daqiao', 'mp_zhenji', 'mp_diaochan'],
                MiNiApp_shenhua: ['mp_re_weiyan', 'mp_xiahouyuan', 'mp_xiaoqiao', 'mp_re_yuji', 'mp_sp_zhangjiao', 'mp_shen_zhaoyun', 'mp_dianwei', 'mp_pangtong', 'mp_sp_zhugeliang', 'mp_taishici', 'mp_pangde', 'mp_yanwen', 'mp_re_yuanshao', 'mp_xuhuang', 'mp_caopi', 'mp_sunjian', 'mp_dongzhuo', 'mp_zhurong', 'mp_jiaxu', 'mp_re_lusu', 'mp_zhanghe', 'mp_dengai', 'mp_jiangwei', 'mp_liushan', 'mp_sunce', 'mp_zhangzhang', 'mp_yanyan', 'mp_wangping', 'mp_sunliang', 'mp_wangji', 'mp_kuailiangkuaiyue', 'mp_yl_luzhi', 'mp_chendao', 'mp_zhoufei', 'mp_guanqiujian', 'mp_yl_yuanshu'],
                MiNiApp_yijiang: ['mp_zhuzhi'],
                MiNiApp_xinghuo: ['mp_sundeng', 'mp_zhugedan', 'mp_liuxie', 'mp_caojie', 'mp_zhanglu'],
                MiNiApp_qunying: ['mp_zhaozhong', 'mp_sp_zhaoyun'],
            },
        },
        character: {
            //魏
            mp_caocao: ['male', 'wei', 4, ['mpjianxiong']],
            mp_xiahoudun: ['male', 'wei', 4, ['mpganglie', 'mpqingjian'], ['name:夏侯|惇']],
            mp_xuzhu: ['male', 'wei', 4, ['mpluoyi']],
            mp_simayi: ['male', 'wei', 3, ['mpguicai', 'refankui'], ['name:司马|懿']],
            mp_zhenji: ['female', 'wei', 3, ['mpluoshen', 'reqingguo']],
            mp_xiahouyuan: ['male', 'wei', 4, ['mpshensu', 'shebian'], ['name:夏侯|渊']],
            mp_dianwei: ['male', 'wei', 5, ['mpqiangxi']],
            mp_xuhuang: ['male', 'wei', 4, ['olduanliang', 'mpjiezi']],
            mp_caopi: ['male', 'wei', 3, ['mpxingshang', 'mpfangzhu']],
            mp_zhanghe: ['male', 'wei', 4, ['mpqiaobian']],
            mp_dengai: ['male', 'wei', 4, ['mptuntian', 'mpzaoxian']],
            mp_wangji: ['male', 'wei', 3, ['mpqizhi', 'mpjinqu']],
            mp_kuailiangkuaiyue: ['male', 'wei', 3, ['nzry_jianxiang', 'mpshenshi'], ['name:蒯|良-蒯|越']],
            mp_guanqiujian: ['male', 'wei', 4, ['mpzhengrong', 'mphongju'], ['name:毌丘|俭']],
            mp_zhugedan: ['male', 'wei', 4, ['mpgongao', 'mpjuyi'], ['name:诸葛|诞', 'clan:琅琊诸葛氏']],
            //蜀
            mp_liubei: ['male', 'shu', 4, ['mprende']],
            mp_zhaoyun: ['male', 'shu', 4, ['longdan', 'mpyajiao']],
            mp_machao: ['male', 'shu', 4, ['mashu', 'mptieji']],
            mp_zhugeliang: ['male', 'shu', 3, ['mpguanxing', 'kongcheng'], ['name:诸葛|亮', 'clan:琅琊诸葛氏']],
            mp_huangyueying: ['female', 'shu', 3, ['mpjizhi', 'mpqicai']],
            mp_re_weiyan: ['male', 'shu', 4, ['xinkuanggu', 'mpqimou']],
            mp_pangtong: ['male', 'shu', 3, ['mplianhuan', 'mpniepan']],
            mp_sp_zhugeliang: ['male', 'shu', 3, ['mphuoji', 'mpbazhen', 'rekanpo'], ['name:诸葛|亮', 'clan:琅琊诸葛氏']],
            mp_zhurong: ['female', 'shu', 4, ['juxiang', 'mplieren']],
            mp_jiangwei: ['male', 'shu', 4, ['mptiaoxin', 'mpzhiji']],
            mp_liushan: ['male', 'shu', 3, ['mpfangquan', 'mpxiangle']],
            mp_yanyan: ['male', 'shu', 4, ['mpjuzhan']],
            mp_wangping: ['male', 'shu', 4, ['mpfeijun', 'mpbinglve']],
            mp_chendao: ['male', 'shu', 4, ['mpwanglie']],
            //吴
            mp_ganning: ['male', 'wu', 4, ['mpqixi', 'mpfenwei']],
            mp_lvmeng: ['male', 'wu', 4, ['mpkeji', 'mpqinxue']],
            mp_zhouyu: ['male', 'wu', 3, ['mpyingzi', 'mpfanjian']],
            mp_luxun: ['male', 'wu', 3, ['mpqianxun', 'mplianying']],
            mp_daqiao: ['female', 'wu', 3, ['reguose', 'mpliuli'], ['name:桥|null']],
            mp_xiaoqiao: ['female', 'wu', 3, ['xintianxiang', 'mphongyan'], ['name:桥|null']],
            mp_taishici: ['male', 'wu', 4, ['mptianyi']],
            mp_sunjian: ['male', 'wu', 5, ['mpyinghun']],
            mp_re_lusu: ['male', 'wu', 3, ['mphaoshi', 'dimeng']],
            mp_sunce: ['male', 'wu', 5, ['jiang', 'mphunzi']],
            mp_zhangzhang: ['male', 'wu', 3, ['mpzhijian', 'mpguzheng'], ['name:张|昭-张|纮']],
            mp_sunliang: ['male', 'wu', 3, ['mpkuizhu', 'mpchezheng']],
            mp_zhoufei: ['female', 'wu', 3, ['mpliangyin', 'kongsheng'], ['name:周|null']],
            mp_zhuzhi: ['male', 'wu', 4, ['mpanguo']],
            mp_sundeng: ['male', 'wu', 4, ['mpkuangbi']],
            //群
            mp_huatuo: ['male', 'qun', 3, ['mpjijiu', 'mpqingnang']],
            mp_diaochan: ['female', 'qun', 3, ['mplijian', 'mpbiyue'], ['name:null|null']],
            mp_sp_zhangjiao: ['male', 'qun', 3, ['mpleiji', 'xinguidao']],
            mp_re_yuji: ['male', 'qun', 3, ['mpguhuo']],
            mp_pangde: ['male', 'qun', 4, ['mpjianchu', 'mashu']],
            mp_yanwen: ['male', 'qun', 4, ['mpshuangxiong'], ['name:颜|良-文|丑']],
            mp_re_yuanshao: ['male', 'qun', 4, ['luanji', 'mpqingchao']],
            mp_dongzhuo: ['male', 'qun', 8, ['mpjiuchi', 'mproulin', 'mpbenghuai']],
            mp_jiaxu: ['male', 'qun', 3, ['mpweimu', 'mpwansha', 'mpluanwu']],
            mp_yl_luzhi: ['male', 'qun', 4, ['mpmingren', 'mpzhenliang']],
            mp_yl_yuanshu: ['male', 'qun', 4, ['mpyongsi']],
            mp_liuxie: ['male', 'qun', 3, ['mptianming', 'mpmizhao']],
            mp_caojie: ['female', 'qun', 3, ['shouxi', 'mphuimin']],
            mp_zhanglu: ['male', 'qun', 3, ['mpyishe', 'minibushi', 'midao']],
            mp_zhaozhong: ['male', 'qun', 6, ['yangzhong', 'mphuangkong']],
            mp_sp_zhaoyun: ['male', 'qun', 3, ['longdan', 'mpchongzhen']],
            //神
            mp_shen_zhaoyun: ['male', 'shen', 2, ['mpjuejing', 'relonghun'], ['shu']],
        },
        skill: {
            //曹操
            mpjianxiong: {
                audio: 'jianxiong',
                inherit: 'new_rejianxiong',
                async content(event, trigger, player) {
                    const goon = get.itemtype(trigger.cards) === 'cards';
                    if (goon) {
                        await player.draw();
                        if (trigger.cards.someInD()) {
                            await player.gain(trigger.cards.filterInD(), 'gain2');
                            if ((trigger.cards ?? []).length === 1 && trigger.cards[0].name === 'sha') {
                                const card = trigger.cards[0], source = trigger.source;
                                if (get.owner(card) === player && get.position(card) === 'h' && source?.isIn() && player.getHp() < source.getHp() && player.canUse(card, source, false)) {
                                    const result = await player.chooseBool(`${get.translation(event.name)}：是否对${get.translation(source)}使用${get.translation(card)}？`).set('choice', (() => {
                                        return get.effect(card, source, player, player) > 0;
                                    })()).forResult();
                                    if (result?.bool) await player.useCard(card, source, false).set('cards', [card]);
                                }
                            }
                        }
                    }
                    else await player.draw(2);
                },
            },
            //夏侯惇
            mpganglie: {
                audio: 'ganglie',
                inherit: 'reganglie',
                getIndex: event => event.num || 1,
                async content(event, trigger, player) {
                    const source = trigger.source;
                    const result = await player.judge(card => {
                        return get.color(card) === 'red' ? 1 : 0;
                    }).forResult();
                    switch (result?.color) {
                        case 'red':
                            await source.damage();
                            break;
                        case 'black':
                            await player.discardPlayerCard(source, 'he', true);
                            await player.draw();
                            break;
                    }
                },
            },
            mpqingjian: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: {
                    player: 'gainAfter',
                    global: 'loseAsyncAfter',
                },
                filter(event, player) {
                    if (event.getParent('phaseDraw', true)) return false;
                    return (event.getg?.(player) ?? []).length > 0;
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseCardTarget({
                        position: 'he',
                        filterCard: true,
                        selectCard: [1, Infinity],
                        filterTarget: lib.filter.notMe,
                        ai1(card) {
                            if (get.attitude(_status.event.player, _status.currentPhase) < 0 && _status.currentPhase.needsToDiscard() && card.name != 'du') return -1;
                            for (var i = 0; i < ui.selected.cards.length; i++) {
                                if (get.type(ui.selected.cards[i]) == get.type(card) || (ui.selected.cards[i].name == 'du' && card.name != 'du')) return -1;
                            };
                            if (card.name == 'du') return 20;
                            return (_status.event.player.countCards('h') - _status.event.player.hp);
                        },
                        ai2(target) {
                            if (get.attitude(_status.event.player, _status.currentPhase) < 0) return -1;
                            var att = get.attitude(_status.event.player, target);
                            if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                                if (target.hasSkillTag('nodu')) return 0;
                                return 1 - att;
                            }
                            if (target.countCards('h') > _status.event.player.countCards('h')) return 0;
                            return att - 4;
                        },
                        prompt: get.prompt2('mpqingjian'),
                    }).forResult();
                },
                async content(event, trigger, player) {
                    await player.give(event.cards, event.targets[0], true);
                    const target = _status.currentPhase;
                    if (!player.hasSkill(`${event.name}_used`) && target?.isIn()) {
                        player.addTempSkill(`${event.name}_used`);
                        player.line(target);
                        target.addTempSkill(`${event.name}_hand`);
                        target.addMark(`${event.name}_hand`, event.cards.reduce((sum, card) => sum.add(get.type2(card, false)), []).length, false);
                    }
                },
                ai: { expose: 0.3 },
                subSkill: {
                    used: { charlotte: true },
                    hand: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '手牌上限+#' },
                        mod: {
                            maxHandcard(player, num) {
                                return num + player.countMark('mpqingjian_hand');
                            },
                        },
                    },
                },
            },
            //许褚
            mpluoyi: {
                audio: 'luoyi',
                inherit: 'new_reluoyi',
                async content(event, trigger, player) {
                    const next = game.cardsGotoOrdering(get.cards(4));
                    await next;
                    const cards2 = next.cards;
                    if (!cards2?.length) return;
                    await player.showCards(cards2, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
                    const cards = cards2.filter(card => {
                        const type = get.type(card);
                        return type === 'basic' || card.name === 'juedou' || (type === 'equip' && get.subtypes(card).includes('equip1'));
                    }), str = `###${get.translation(event.name)}###<div class="text center">是否放弃摸牌，改为获得${cards.length > 0 ? get.translation(cards) : '棍母'}？</div>`;
                    const result = await player.chooseBool(str).set('choice', cards.length >= trigger.num).forResult();
                    if (result?.bool) {
                        trigger.changeToZero();
                        if (cards.length) await player.gain(cards, 'gain2');
                        player.addTempSkill('mpluoyi_buff', { player: 'phaseBegin' });
                        player.addMark('mpluoyi_buff', 1, false);
                    }
                },
                subSkill: {
                    buff: {
                        charlotte: true,
                        intro: { content: '【杀】和【决斗】造成的伤害+1' },
                        init(player, skill) {
                            player.addTip(skill, get.translation(skill));
                        },
                        onremove(player, skill) {
                            player.removeTip(skill);
                            delete player.storage[skill];
                        },
                        audio: 'luoyi',
                        trigger: { source: 'damageBegin1' },
                        filter(event, player) {
                            return event.card && (event.card.name === 'sha' || event.card.name === 'juedou') && event.notLink();
                        },
                        forced: true,
                        logTarget: 'player',
                        async content(event, trigger, player) {
                            trigger.num += player.countMark(event.name);
                        },
                        ai: {
                            damageBonus: true,
                            skillTagFilter(player, tag, arg) {
                                return arg?.card && (arg.card.name === 'sha' || arg.card.name === 'juedou');
                            },
                        },
                    },
                },
            },
            //司马懿
            mpguicai: {
                audio: 'guicai',
                trigger: { global: 'judge' },
                filter(event, player) {
                    return player.countCards('hes');
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseCard(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' + get.translation(trigger.player.judging[0]) + '，' + get.prompt('miniguicai'), 'hes', function (card) {
                        var player = _status.event.player;
                        var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                        if (mod2 != 'unchanged') return mod2;
                        var mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
                        if (mod != 'unchanged') return mod;
                        return true;
                    }).set('ai', function (card) {
                        var trigger = _status.event.getTrigger();
                        var player = _status.event.player;
                        var judging = _status.event.judging;
                        var result = trigger.judge(card) - trigger.judge(judging);
                        var attitude = get.attitude(player, trigger.player);
                        const val = get.color(card) !== get.color(judging) ? (get.value(judging) - get.value(card)) : 0;
                        if (attitude == 0) return val;
                        if (attitude > 0) {
                            if (result == 0) return val;
                            return result - get.value(card) / 2;
                        }
                        else {
                            if (result == 0) return val;
                            return -result - get.value(card) / 2;
                        }
                    }).set('judging', trigger.player.judging[0]).forResult();
                },
                popup: false,
                async content(event, trigger, player) {
                    const next = player.respond(event.cards, event.name, 'highlight', 'noOrdering');
                    await next;
                    if (next?.cards?.length) {
                        const card = next.cards[0];
                        if (trigger.player.judging[0].clone) {
                            game.broadcastAll(card => {
                                card.clone?.classList.remove('thrownhighlight');
                            }, trigger.player.judging[0]);
                            game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                        }
                        if (get.color(card) !== get.color(trigger.player.judging[0])) await player.gain(trigger.player.judging, 'gain2');
                        else await game.cardsDiscard(trigger.player.judging[0]);
                        trigger.player.judging[0] = card;
                        trigger.orderingCards.add(card);
                        game.log(trigger.player, '的判定牌改为', card);
                        await game.delay(2);
                    }
                },
                ai: {
                    rejudge: true,
                    tag: { rejudge: 1 },
                },
            },
            //甄姬
            mpluoshen: {
                audio: 'reluoshen',
                trigger: { player: 'phaseZhunbeiBegin' },
                frequent: true,
                async content(event, trigger, player) {
                    while (true) {
                        const result = await player.judge(card => {
                            return get.color(card) === 'black' ? 1 : -1;
                        }).set('callback', function () {
                            if (get.position(card, true) === 'o') {
                                player.addTempSkill('mpluoshen_effect');
                                player.gain(card, 'gain2').gaintag.add('mpluoshen_effect');
                            }
                        }).forResult();
                        if (result?.bool) {
                            const result2 = await player.chooseBool(`${get.translation(event.name)}：是否继续进行判定？`).set('frequentSkill', event.name).forResult();
                            if (result2?.bool) continue;
                        }
                        break;
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove(player, skill) {
                            player.removeGaintag(skill);
                        },
                        mod: {
                            ignoredHandcard(card, player) {
                                if (card.hasGaintag('mpluoshen_effect')) return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (name === 'phaseDiscard' && card.hasGaintag('mpluoshen_effect')) return false;
                            },
                        },
                    },
                },
            },
            //典韦
            mpqiangxi: {
                audio: 'qiangxi',
                inherit: 'reqiangxi',
                filter(event, player) {
                    return game.hasPlayer(target => lib.skill.mpqiangxi.filterTarget(null, player, target));
                },
                filterTarget(card, player, target) {
                    if (target === player || player.getStorage('mpqiangxi_used').includes(target)) return false;
                    return player.inRange(target);
                },
                filterCard(card, player) {
                    return get.type(card) === 'equip' && lib.filter.cardDiscardable(card, player);
                },
                async content(event, trigger, player) {
                    const { cards, target } = event;
                    player.addTempSkill('mpqiangxi_used', 'phaseUseAfter');
                    player.markAuto('mpqiangxi_used', [target]);
                    if (!cards.length) await player.loseHp();
                    await target.damage('nocard');
                    if (target.hasHistory('damage', evt => {
                        return evt.getParent(event.name) == event && evt._dyinged;
                    })) await player.recover();
                },
                ai: {
                    order: 8.5,
                    result: {
                        target(player, target) {
                            if (!ui.selected.cards.length) {
                                if (player.hp < 2) return 0;
                                if (target.hp >= Math.max(2, player.hp)) return 0;
                            }
                            return get.damageEffect(target, player) * (target.hp <= 1 ? 3 : 1);
                        },
                    },
                },
                subSkill: {
                    used: {
                        charlotte: true,
                        onremove: true,
                    },
                },
            },
            //刘备
            mprende: {
                audio: 'rende',
                enable: 'phaseUse',
                filterCard: true,
                selectCard: [1, Infinity],
                discard: false,
                lose: false,
                delay: false,
                filterTarget(card, player, target) {
                    return player !== target && !player.getStorage('mprende2').includes(target);
                },
                check(card) {
                    const player = get.player();
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                    if (!ui.selected.cards.length && card.name == 'du') return 20;
                    if (ui.selected.cards.length >= Math.max(2, player.countCards('h') - player.hp)) return 0;
                    if (player.isHealthy() || player.storage.mprende3 || player.countCards('h') <= 1) {
                        if (game.hasPlayer(target => {
                            return target.hasSkill('haoshi') && !target.isTurnedOver() && !target.hasJudge('lebu') && get.attitude(player, target) >= 3 && get.attitude(target, player) >= 3;
                        })) return 11 - get.value(card);
                        if (player.countCards('h') > player.hp) return 10 - get.value(card);
                        if (player.countCards('h') > 2) return 6 - get.value(card);
                        return -1;
                    }
                    return 10 - get.value(card);
                },
                async content(event, trigger, player) {
                    const evt = event.getParent('phaseUse');
                    if (evt?.name === 'phaseUse' && !evt.mprende) {
                        const next = game.createEvent('mprende_clear');
                        event.next.remove(next);
                        evt.after.push(next);
                        evt.mprende = true;
                        next.player = player;
                        next.setContent(function () {
                            delete player.storage.mprende;
                            delete player.storage.mprende2;
                            delete player.storage.mprende3;
                        });
                    }
                    const { target, cards } = event;
                    player.markAuto('mprende2', [target]);
                    await player.give(cards, target);
                    if (!player.storage.mprende3) {
                        player.addMark('mprende', cards.length, false);
                        if (player.countMark('mprende') >= 2) {
                            player.storage.mprende3 = true;
                            const list = get.inpileVCardList(info => {
                                if (info[0] !== 'basic') return false;
                                const card = new lib.element.VCard({ name: info[2], nature: info[3] });
                                return lib.filter.cardUsable(card, player, event.getParent('chooseToUse')) && player.hasUseTarget(card);
                            });
                            if (list.length) {
                                const result = await player.chooseButton(['是否视为使用一张基本牌？', [list, 'vcard']]).set('ai', button => {
                                    const card = new lib.element.VCard({ name: button.link[2], nature: button.link[3] });
                                    return get.player().getUseValue(card);
                                }).forResult();
                                if (result?.bool && result.links?.[0]) {
                                    const card = new lib.element.VCard({ name: result.links[0][2], nature: result.links[0][3] });
                                    const next = player.chooseUseTarget(card, true);
                                    if (cards.length > 2) {
                                        next.oncard = function () {
                                            const event = get.event();
                                            event.baseDamage++;
                                            game.log(event.card, '的', '#y伤害值/回复值', '#g+1');
                                        };
                                    }
                                    await next;
                                }
                            }
                        }
                    }
                },
                ai: {
                    threaten: 0.8,
                    fireAttack: true,
                    order(skill, player) {
                        if (player.isDamaged() && !player.storage.mprende3 && player.countMark('mprende') < 2 && player.countCards('h') > 1) return 10;
                        return 4;
                    },
                    result: {
                        target(player, target) {
                            if (target.hasSkillTag('nogain')) return 0;
                            if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                                if (target.hasSkillTag('nodu')) return 0;
                                return -10;
                            }
                            if (target.hasJudge('lebu')) return 0;
                            const nh = target.countCards('h'), np = player.countCards('h');
                            if (player.isHealthy() || player.storage.mprende3 || player.countCards('h') <= 1) {
                                if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
                            }
                            return Math.max(1, 5 - nh);
                        }
                    },
                    effect: {
                        target(card, player, target) {
                            if (player == target && get.type(card) == 'equip') {
                                if (player.countCards('e', { subtype: get.subtype(card) })) {
                                    if (game.hasPlayer(current => {
                                        return current != player && get.attitude(player, current) > 0;
                                    })) return 0;
                                }
                            }
                        },
                    },
                },
            },
            //赵云
            mpyajiao: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: { player: ['useCard', 'respond'] },
                filter(event, player) {
                    if (_status.currentPhase === player) return false;
                    return player.hasHistory('lose', evt => {
                        if ((evt.relatedEvent || evt.getParent()) !== event) return false;
                        return evt.hs?.length > 0;
                    });
                },
                frequent: true,
                async content(event, trigger, player) {
                    const cards = get.cards(1, true);
                    await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
                    const result = await player.chooseTarget(`${get.translation(event.name)}：将${get.translation(cards)}交给一名角色`, true).set('ai', target => {
                        const { player, cards } = get.event();
                        return get.attitude(player, target) * cards.reduce((sum, card) => sum + get.value(card), 0);
                    }).set('cards', cards).forResult();
                    if (result?.bool && result.targets?.length) {
                        const target = result.targets[0];
                        player.line(target);
                        const next = target.gain(cards, 'gain2');
                        next.giver = player;
                        await next;
                    }
                    if (get.color(trigger.card) === 'red') await player.draw();
                },
            },
            //马超
            mptieji: {
                audio: 'tieji',
                trigger: { player: 'useCardToPlayered' },
                filter(event, player) {
                    return event.card.name === 'sha';
                },
                check(event, player) {
                    return get.attitude(player, event.target) <= 0;
                },
                logTarget: 'target',
                async content(event, trigger, player) {
                    const target = trigger.target;
                    if (!target.hasSkill('fengyin')) target.addTempSkill('fengyin');
                    let result = await player.judge().forResult();
                    const suit = result.suit;
                    if (suit) {
                        result = await target.chooseToDiscard('he', (card, player) => {
                            return get.suit(card) == get.event().suit;
                        }, `${get.translation(event.name)}：弃置一张${get.translation(suit)}牌，否则不能响应${get.translation(trigger.card)}`).set('ai', function (card) {
                            const num = get.event().num;
                            if (!num) return 0;
                            if (card.name === 'shan') return num > 1 ? 2 : 0;
                            return 8 - get.value(card);
                        }).set('suit', suit).set('num', target.countCards('hs', 'shan')).forResult();
                        if (!result?.bool || !result.cards?.length) {
                            trigger.getParent().directHit.add(target);
                            game.log(target, '不能响应', trigger.card);
                        }
                    }
                    const evt2 = trigger.getParent();
                    player.when({ global: 'damageEnd' }).filter(evt => {
                        return evt.card === trigger.card && evt2.addCount !== false;
                    }).step(async (event, trigger, player) => {
                        evt2.addCount = false;
                        const stat = player.stat[player.stat.length - 1].card;
                        if (typeof stat[evt2.card.name] === 'number') stat[evt2.card.name]--;
                        game.log(evt2.card, '不计入次数');
                    });
                },
                ai: {
                    ignoreSkill: true,
                    directHit_ai: true,
                    skillTagFilter(player, tag, arg) {
                        if (!arg || arg.isLink || !arg.card || arg.card.name !== 'sha') return false;
                        const target = arg?.target, skill = arg?.skill;
                        if (!target || get.attitude(player, target) > 0) return false;
                        if (tag === 'directHit_ai') return true;
                        return skill && lib.skill[skill] && lib.skill.fengyin?.skillBlocker(skill, target) && target.getSkills(null, false, false).includes(skill);
                    },
                },
            },
            //诸葛亮
            mpguanxing: {
                audio: 'guanxing',
                trigger: { global: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
                filter(event, player) {
                    return event.player === player || (event.name === 'phaseZhunbei' && player.hasSkill('mpzhiji_guanxing'));
                },
                frequent: true,
                async content(event, trigger, player) {
                    await player.chooseToGuanxing(5).set('prompt', '观星：点击或拖动将牌移动到牌堆顶或牌堆底');
                },
                ai: { guanxing: true },
            },
            //黄月英
            mpjizhi: {
                audio: 'jizhi',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    return get.type2(event.card) === 'trick';
                },
                frequent: true,
                async content(event, trigger, player) {
                    const result = await player.draw().forResult();
                    if (_status.currentPhase !== player || !result?.cards?.[0]) return;
                    if (get.type(result.cards[0]) === 'basic' && player.countMark('mpjizhi_effect') < 5) {
                        player.addTempSkill('mpjizhi_effect');
                        player.addMark('mpjizhi_effect', 1, false);
                    }
                },
                ai: {
                    threaten: 1.5,
                    noautowuxie: true,
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '手牌上限+#' },
                        mod: {
                            maxHandcard(player, num) {
                                return num + player.countMark('mpjizhi_effect');
                            },
                        },
                    },
                },
            },
            mpqicai: {
                trigger: {
                    player: 'loseAfter',
                    global: ['loseAsyncAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'addToExpansionAfter'],
                },
                filter(event, player) {
                    const evt = event.getl?.(player);
                    return evt?.es?.some(card => {
                        const VEquip = evt.vcard_map.get(card);
                        return VEquip && get.subtypes(VEquip).containsSome('equip1', 'equip3', 'equip4');
                    });
                },
                forced: true,
                async content(event, trigger, player) {
                    const card = get.discardPile(card => get.type2(card) === 'trick', 'random');
                    if (card) await player.gain(card, 'gain2');
                },
                mod: {
                    targetInRange(card, player, target) {
                        if (get.type2(card) === 'trick') return true;
                    },
                    canBeDiscarded(card, player, target) {
                        if (get.position(card) == 'e' && get.subtypes(card).some(subtype => ['equip2', 'equip5'].includes(subtype)) && player !== target) return false;
                    },
                },
            },
            //大乔
            mpliuli: {
                audio: 'liuli',
                trigger: { target: 'useCardToTarget' },
                filter(event, player) {
                    if (event.card.name !== 'sha' && !(get.tag(event.card, 'damage') && get.type(event.card) === 'trick' && event.targets.length === 1)) return false;
                    if (!player.hasCard(card => {
                        if (get.position(card) === 'h' && _status.connectMode) return true;
                        return lib.filter.cardDiscardable(card, player);
                    }, 'he')) return false;
                    return game.hasPlayer(current => {
                        return player.inRange(current) && current !== event.player && current !== player && lib.filter.targetEnabled(event.card, event.player, current);
                    });
                },
                preHidden: true,
                async cost(event, trigger, player) {
                    event.result = await player.chooseCardTarget({
                        prompt: get.prompt2(event.skill),
                        filterCard: lib.filter.cardDiscardable,
                        position: 'he',
                        ai1(card) {
                            return get.unuseful(card) + 9;
                        },
                        filterTarget(card, player, target) {
                            const trigger = get.event().getTrigger;
                            if (!player.inRange(target) || target === player || target === trigger.player) return false;
                            return lib.filter.targetEnabled(trigger.card, trigger.player, target);
                        },
                        ai2(target) {
                            const player = get.player(), trigger = get.event().getTrigger;
                            return get.effect(target, trigger.card, trigger.player, player) - get.effect(player, trigger.card, trigger.player, player);
                        },
                    }).setHiddenSkill(event.skill).forResult();
                },
                async content(event, trigger, player) {
                    const { cards, targets } = event;
                    await player.discard(cards);
                    const evt = trigger.getParent();
                    evt.triggeredTargets2.remove(player);
                    evt.targets.remove(player);
                    evt.targets.addArray(targets);
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (_status._mpliuli_check || !target.hasCard(card => {
                                if (get.position(card) === 'h' && _status.connectMode) return true;
                                return lib.filter.cardDiscardable(card, player);
                            }, 'he')) return;
                            if (card.name !== 'sha' && !(get.tag(card, 'damage') && get.type(card) === 'trick' && [...ui.selected.targets].add(target).length === 1)) return;
                            _status._liuli_check = true;
                            let min = 1, friend = get.attitude(player, target) > 0;
                            for (const current of game.filterPlayer()) {
                                if (player !== current && target !== current && get.attitude(target, current) < 0 && target.canUse(card, current)) {
                                    if (!friend) return 0;
                                    if (get.effect(current, card, player, player) > 0) {
                                        if (!player.canUse(card, players[0])) {
                                            delete _status._mpliuli_check;
                                            return [0, 0.1];
                                        }
                                        min = 0;
                                    }
                                }
                            }
                            delete _status._mpliuli_check;
                            return min;
                        },
                    },
                },
            },
            //庞统
            mplianhuan: {
                audio: 'lianhuan',
                trigger: { player: 'useCardToPlayered' },
                filter(event, player) {
                    if (!event.isFirstTarget || event.card.name !== 'tiesuo') return false;
                    return event.targets.some(target => target.countDiscardableCards(player, 'he') > 0);
                },
                logTarget(event, player) {
                    return event.targets.filter(target => target.countDiscardableCards(player, 'he') > 0).sortBySeat();
                },
                prompt2: () => '弃置每个目标角色的各一张牌',
                check(event, player) {
                    return event.targets.reduce((sum, target) => {
                        if (target.countDiscardableCards(player, 'he') > 0) sum += get.effect(target, { name: 'guohe_copy2' }, player, player);
                        return sum;
                    }, 0) > 0;
                },
                async content(event, trigger, player) {
                    for (const target of event.targets) await player.discardPlayerCard(target, 'he', true);
                },
                ai: {
                    effect: {
                        player_use(card, player, target) {
                            if (card?.name === 'tiesuo' && target?.countDiscardableCards(player, 'e') > 0) {
                                return [1, Math.max(get.effect(target, { name: 'guohe_copy', position: 'e' }, player, player), 0)];
                            }
                        },
                    },
                },
                group: ['mplianhuan_lianhuan', 'mplianhuan_recast'],
                subSkill: {
                    lianhuan: {
                        audio: 'lianhuan',
                        inherit: 'lianhuan',
                        enable: 'phaseUse',
                        hiddenCard: () => false,
                        filter(event, player) {
                            return player.hasCard(card => lib.skill.lianhuan.filterCard(card, player, event), 'hes');
                        },
                        position: 'hes',
                        prompt: () => '将一张♣牌当作【铁索连环】使用或重铸',
                    },
                    recast: {
                        audio: 'lianhuan',
                        trigger: { player: 'recastAfter' },
                        filter(event, player) {
                            if (event.getParent().name.includes('lianhuan')) return true;
                            return event.cards.some(card => card.name === 'tisuo' || get.name(card, player) === 'tiesuo');
                        },
                        forced: true,
                        locked: false,
                        async content(event, trigger, player) {
                            let list = [], goon = trigger.getParent().name.includes('lianhuan');
                            for (const card of trigger.cards) {
                                if (goon || card.name === 'tisuo' || get.name(card, player) === 'tiesuo') {
                                    const card2 = get.discardPile(card2 => {
                                        if (list.includes(card2)) return false;
                                        return get.suit(card2) !== get.suit(card);
                                    }, 'random');
                                    if (card2) list.push(card2);
                                    else break;
                                }
                            }
                            if (list.length > 0) await player.gain(list, 'gain2');
                        },
                    },
                },
            },
            mpniepan: {
                audio: 'niepan',
                inherit: 'oldniepan',
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.discard(player.getCards('hej'));
                    await player.link(false);
                    await player.turnOver(false);
                    await player.draw(3);
                    await player.recoverTo(3);
                    player.addTempSkill('mpniepan_effect');
                },
                ai: {
                    order: 1,
                    skillTagFilter(player, arg, target) {
                        if (player !== target || player.storage.mpniepan) return false;
                    },
                    save: true,
                    result: {
                        player(player) {
                            if (player.hp <= 0) return 10;
                            if (player.hp <= 2 && player.countCards('he') <= 1) return 10;
                            return 0;
                        },
                    },
                    threaten(player, target) {
                        if (!target.storage.mpniepan) return 0.6;
                    },
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        mark: true,
                        intro: { content: '不能成为其他角色使用牌的目标' },
                        mod: {
                            targetEnabled(card, player, target) {
                                if (player !== target) return false;
                            },
                        },
                    },
                },
            },
            //甘宁
            mpqixi: {
                audio: 'qixi',
                trigger: { global: 'loseAfter' },
                filter(event, player) {
                    const evt = event.getParent(2), card = evt.card;
                    if (event.type !== 'discard' || evt.name !== 'guohe' || evt.player !== player || !card) return false;
                    return event.cards2?.some(card => get.suit(card, event.player) === get.suit(evt.card));
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    await player.draw();
                },
                group: 'mpqixi_qixi',
                subSkill: {
                    qixi: {
                        audio: 'qixi',
                        inherit: 'qixi',
                    },
                },
            },
            mpfenwei: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: { global: 'useCardToPlayered' },
                filter(event, player) {
                    if (!event.isFirstTarget || get.type(event.card) !== 'trick' || get.info(event.card).multitarget) return false;
                    return event.targets.length >= 2;
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt(event.skill), '令' + get.translation(trigger.card) + '对任意名角色无效', [1, trigger.targets.length], function (card, player, target) {
                        return _status.event.targets.includes(target);
                    }).set('ai', function (target) {
                        var trigger = _status.event.getTrigger();
                        return -get.effect(target, trigger.card, trigger.player, _status.event.player);
                    }).set('targets', trigger.targets).forResult();
                },
                round: 1,
                skillAnimation: true,
                animationColor: 'wood',
                async content(event, trigger, player) {
                    trigger.getParent().excluded.addArray(event.targets);
                    game.log(trigger.card, '对', event.targets, '无效');
                },
                ai: { expose: 0.2 },
            },
            //吕蒙
            mpkeji: {
                audio: 'keji',
                inherit: 'keji',
                async content(event, trigger, player) {
                    trigger.cancel();
                    if (!player.hasHistory('useCard', evt => evt.isPhaseUsing())) await player.draw(2);
                },
            },
            mpqinxue: {
                audio: 'ext:活动武将/audio/skill:2',
                inherit: 'qinxue',
                trigger: { player: 'phaseZhunbeiBegin' },
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.loseMaxHp();
                    await player.addSkills('gongxin');
                    player.addTempSkill('mpqinxue_paoxiao');
                },
                subSkill: {
                    paoxiao: {
                        charlotte: true,
                        mark: true,
                        intro: { content: '使用牌无次数限制' },
                        mod: { cardUsable: () => Infinity },
                    },
                },
            },
            gongxin_mp_lvmeng: { audio: 'ext:活动武将/audio/skill:2' },
            //周瑜
            mpyingzi: {
                audio: 'reyingzi',
                inherit: 'reyingzi',
                audioname2: { mp_zhouyu: 'yingzi' },
                async content(event, trigger, player) {
                    trigger.num += (1 + player.getDamagedHp());
                },
            },
            mpfanjian: {
                audio: 'fanjian',
                inherit: 'refanjian',
                usable: 2,
                async content(event, trigger, player) {
                    const { cards, target } = event;
                    await player.showCards(cards, `${get.translation(player)}对${get.translation(target)}发动了【${get.translation(event.name)}】`);
                    await player.give(cards, target);
                    let result, card = cards[0];
                    if (!target.countCards('h')) result = { control: '失去体力', index: 1 };
                    else {
                        result = await target.chooseControl('展示手牌', '失去体力').set('card', card).set('ai', () => {
                            const { player, card } = get.event();
                            const cards = player.getCards('he', { color: get.color(card) });
                            if (cards.length === 1) return 0;
                            if (cards.length >= 2 && cards.some(card => get.tag(card, 'save'))) return 1;
                            if (player.hp === 1) return 0;
                            if (cards.some(card => get.value(card) >= 8)) return 1;
                            if (cards.length > 2 && player.hp > 2) return 1;
                            if (cards.length > 3) return 1;
                            return 0;
                        }).set('prompt', `###${get.translation(event.name)}###<div class="text center">展示手牌并弃置所有${get.translation(get.color(card))}牌，或失去1点体力并随机弃置装备区里的一张牌</div>`).forResult();
                    }
                    if (typeof result?.index !== 'number') return;
                    if (result.index === 0) {
                        await target.showHandcards();
                        const cards = target.getDiscardableCards(target, 'he', { color: get.color(card) });
                        if (cards.length > 0) await target.discard(cards);
                    }
                    else {
                        await target.loseHp();
                        const cards = target.getDiscardableCards(target, 'e');
                        if (cards.length > 0) await target.discard(cards.randomGets(1));
                    }
                },
            },
            //陆逊
            mpqianxun: {
                audio: 'qianxun',
                inherit: 'reqianxun',
                filter(event, player) {
                    if (!player.countCards('h')) return false;
                    if (event.getParent().name === 'phaseJudge') return true;
                    if (event.name === 'judge') return false;
                    if (event.targets?.length > 1) return false;
                    return event.card && event.player !== player && (event.card.name === 'sha' || get.type(event.card) === 'trick');
                },
                check(event, player) {
                    return get.effect(player, event.card, event.player, player) > 0 || !player.hasCard(card => player.canRespond(event, card), 'h');
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (player === target || ['relianying', 'catlianying', 'mplianying'].every(i => !target.hasSkill(i)) || !target.hasFriend()) return;
                            const type = get.type(card), nh = Math.min(target.countCards(), game.countPlayer(i => get.attitude(target, i) > 0));
                            if (card.name === 'sha' || type === 'trick') {
                                if (!get.tag(card, 'multitarget') || get.info(card).singleCard) {
                                    if (get.tag(card, 'damage')) return [1.5, nh - 1];
                                    return [1, nh];
                                }
                            }
                            else if (type === 'delay') return [0.5, 0.5];
                        },
                    },
                },
            },
            mplianying: {
                audio: 'lianying',
                inherit: 'relianying',
                async cost(event, trigger, player) {
                    const num = trigger.getl(player).hs.length;
                    event.result = await player.chooseTarget(get.prompt(event.skill), `令至多${get.cnNumber(num)}名角色各摸一张牌`, [1, num]).set('ai', target => {
                        const player = get.player();
                        return get.attitude(player, target) + (player === target ? 10 : 0);
                    }).forResult();
                },
                direct: false,
                async content(event, trigger, player) {
                    const targets = [...event.targets].sortBySeat();
                    await game.asyncDraw(targets);
                    await game.delayx();
                    if (player.hasHistory('gain', evt => {
                        if (evt.getParent(2) !== event) return false;
                        return evt.cards?.some(card => get.type2(card, false) === 'trick' || get.type(card, null, false) === 'equip');
                    })) await player.draw();
                },
            },
            //华佗
            mpjijiu: {
                mod: {
                    aiValue(player, card, num) {
                        if (get.name(card) != 'tao' && get.color(card) != 'red') return;
                        var cards = player.getCards('hs', function (card) {
                            return get.name(card) == 'tao' || get.color(card) == 'red';
                        });
                        cards.sort(function (a, b) {
                            return (get.name(a) == 'tao' ? 1 : 2) - (get.name(b) == 'tao' ? 1 : 2);
                        });
                        var geti = function () {
                            if (cards.includes(card)) {
                                return cards.indexOf(card);
                            }
                            return cards.length;
                        };
                        return Math.max(num, [6.5, 4, 3, 2][Math.min(geti(), 2)]);
                    },
                    aiUseful() {
                        return lib.skill.mpjijiu.mod.aiValue.apply(this, arguments);
                    },
                },
                locked: false,
                audio: 'jijiu',
                enable: 'chooseToUse',
                viewAsFilter(player) {
                    return player !== _status.currentPhase && player.countCards('hes', { color: 'red' }) > 0;
                },
                filterCard(card) {
                    return get.color(card) == 'red';
                },
                position: 'hes',
                viewAs: { name: 'tao' },
                prompt: () => lib.translate.mpjijiu_info,
                check(card) {
                    return 1 / (get.value(card) || 0.5);
                },
                async precontent(event, trigger, player) {
                    event.result._apply_args = {
                        oncard: () => {
                            const trigger = get.event();
                            if (get.suit(trigger.card) === 'heart' && get.type(trigger.card) === 'basic') trigger.baseDamage++;
                        },
                    };
                },
            },
            mpqingnang: {
                audio: 'qingnang',
                inherit: 'new_reqingnang',
                usable: 1,
                filter(event, player) {
                    const info = lib.skill.mpqingnang;
                    if (!player.hasCard(card => info.filterCard(card, player), info.position)) return false;
                    return game.hasPlayer(target => info.filterTarget(null, player, target));
                },
                filterCard: lib.filter.cardDiscardable,
                position: 'he',
                filterTarget(card, player, target) {
                    return target.isDamaged();
                },
                async content(event, trigger, player) {
                    const { cards, target } = event;
                    await target.recover();
                    if (get.color(cards[0], player) === 'red') {
                        if (typeof player.getStat('skill')?.[event.name] === 'number') delete player.getStat('skill')[event.name];
                    }
                },
            },
            //貂蝉
            mplijian: {
                audio: 'lijian',
                inherit: 'lijian',
                filter(event, player) {
                    const juedou = new lib.element.VCard({ name: 'juedou' });
                    return game.hasPlayer(target => {
                        if (!target.hasSex('male')) return false;
                        return game.hasPlayer(current => {
                            if (!current.hasSex('male') || target === current) return false;
                            return current.canUse(juedou, target, false);
                        });
                    });
                },
                filterTarget(card, player, target) {
                    if (!target.hasSex('male')) return false;
                    const juedou = new lib.element.VCard({ name: 'juedou' });
                    if (ui.selected.targets.length > 0) {
                        return target.canUse(juedou, ui.selected.targets[0], false);
                    }
                    return game.hasPlayer(current => {
                        if (!current.hasSex('male') || target === current) return false;
                        return current.canUse(juedou, target, false);
                    });
                },
                async content(event, trigger, player) {
                    player.addTempSkill(`${event.name}_gain`);
                    await game.delay(0.5);
                    const juedou = new lib.element.VCard({ name: 'juedou' });
                    await event.targets[1].useCard(juedou, event.targets[1], 'noai');
                },
                subSkill: {
                    gain: {
                        charlotte: true,
                        trigger: { global: 'damageEnd' },
                        filter(event, player) {
                            if (!event.player.isIn() || !event.card || event.card.name !== 'juedou') return false;
                            const evt = event.getParent(3);
                            return evt.name === 'mplijian' && evt.player === player;
                        },
                        direct: true,
                        async content(event, trigger, player) {
                            const target = trigger.player, list = ['mplijian', target];
                            const next = player.gainPlayerCard(target, 'he', get.prompt(...list));
                            next.logSkill = list;
                            await next;
                        },
                    },
                },
            },
            mpbiyue: {
                audio: 'biyue',
                inherit: 'biyue',
                async content(event, trigger, player) {
                    await player.draw(1 + (player.countCards('h') < player.getHp()));
                },
            },
            //神赵云
            mpjuejing: {
                mod: {
                    maxHandcard(player, num) {
                        return 2 + num;
                    },
                    aiOrder(player, card, num) {
                        if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, 'recover')) return num;
                        if (player.needsToDiscard() > 1) return num;
                        return 0;
                    },
                },
                audio: 'xinjuejing',
                trigger: { player: ['dying', 'dyingAfter', 'phaseDrawBegin2'] },
                filter(event, player) {
                    if (event.name !== 'phaseDraw') return true;
                    return !event.numFixed;
                },
                forced: true,
                async content(event, trigger, player) {
                    if (trigger.name !== 'phaseDraw') await player.draw();
                    else trigger.num += 2;
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (target.getHp() > 1) return;
                            if (get.tag(card, 'damage') || get.tag(card, 'loseHp')) return [1, 1];
                        },
                    },
                },
            },
            //魏延
            mpqimou: {
                limited: true,
                audio: 'qimou',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.hp > 0;
                },
                chooseButton: {
                    dialog(event, player) {
                        return ui.create.dialog(`###${get.translation('mpqimou')}###<div class="text center">${get.translation('mpqimou_info')}</div>`);
                    },
                    chooseControl(event, player) {
                        return [...Array.from({ length: player.hp }).map((_, index) => `${index + 1}点`), 'cancel2'];
                    },
                    check(event, player) {
                        let num = player.hp - 1;
                        if (player.hasCard(card => player.canSaveCard(card, player), 'hs')) num = player.hp;
                        return num > 0 ? `${num}点` : 'cancel2';
                    },
                    prompt(result) {
                        const str = '失去X点体力，本回合你计算与其他角色的距离-X，且你可以多使用X张【杀】，且你因【杀】造成伤害发动【狂骨】时可多摸一张牌。';
                        return `###${get.translation('mpqimou')}###<div class="text center">${str.replaceAll('X', result.control.slice(0, -1))}</div>`;
                    },
                    backup(result) {
                        return {
                            audio: 'qimou',
                            number: Number(result.control.slice(0, -1)),
                            skillAnimation: true,
                            animationColor: 'orange',
                            async content(event, trigger, player) {
                                player.awakenSkill('mpqimou');
                                const num = lib.skill[event.name].number;
                                await player.loseHp(num);
                                player.addTempSkill('mpqimou_effect');
                                player.addMark('mpqimou_effect', num, false);
                            },
                        };
                    },
                },
                ai: {
                    order: 14,
                    result: {
                        player(player) {
                            if (player.hp < 3) return false;
                            let mindist = player.hp;
                            if (player.hasCard(card => player.canSaveCard(card, player), 'hs')) mindist++;
                            return game.countPlayer(current => {
                                if (get.distance(player, current) > mindist) return false;
                                return player.countCards('hs', card => {
                                    if (get.name(card) !== 'sha') return false;
                                    return player.canUse(card, current, false) && get.effect(current, card, player, player) > 0;
                                }) >= mindist - 1;
                            });
                        },
                    },
                },
                subSkill: {
                    backup: {},
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '计算与其他角色的距离-#，可以多使用#张【杀】，因【杀】造成伤害发动【狂骨】时可多摸一张牌' },
                        mod: {
                            cardUsable(card, player, num) {
                                if (card.name === 'sha') return num + player.countMark('mpqimou_effect');
                            },
                            globalFrom(from, to, distance) {
                                return distance - from.countMark('mpqimou_effect');
                            },
                        },
                        audio: 'qimou',
                        trigger: { player: 'gainAfter' },
                        filter(event, player) {
                            if (event.getParent().name !== 'draw' || event.getParent(2).name !== 'chooseDrawRecover') return false;
                            return event.getParent(2).logSkill === 'xinkuanggu' && event.getParent(3)._trigger.card?.name === 'sha';
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            await player.draw();
                        },
                    },
                },
            },
            //夏侯渊
            mpshensu: {
                audio: 'shensu1',
                trigger: { player: ['phaseJudgeBefore', 'phaseUseBefore', 'phaseDiscardBefore'] },
                filter(event, player) {
                    const card = new lib.element.VCard({ name: 'sha' });
                    if (!game.hasPlayer(target => {
                        if (target === player) return false;
                        return player.canUse(card, target, false);
                    })) return false;//免得一些神必技能能让自己对自己出杀
                    return event.name !== 'phaseUse' || player.hasCard(card => {
                        if (get.position(card) === 'h' && _status.connectMode) return true;
                        return get.type(card) !== 'basic' && lib.filter.cardDiscardable(card, player);
                    }, 'he');
                },
                async cost(event, trigger, player) {
                    const str = (() => {
                        let str = `跳过${['判定阶段和摸牌', '出牌', '弃牌'][lib.skill[event.skill].trigger.player.indexOf(event.triggername)]}阶段`;
                        switch (trigger.name) {
                            case 'phaseUse': str += '并弃置一张非基本牌'; break;
                            case 'phaseDiscard': str += '并翻面'; break;
                        }
                        return `${str}，视为对一名其他角色使用一张无距离限制的【杀】并摸一张牌。`;
                    })();
                    event.result = await player.chooseCardTarget({
                        prompt: get.prompt(event.skill),
                        prompt2: str,
                        filterCard(card, player) {
                            if (get.event().getTrigger().name !== 'phaseUse') return false;
                            return get.type(card) !== 'basic' && lib.filter.cardDiscardable(card, player);
                        },
                        selectCard() {
                            return get.event().getTrigger().name === 'phaseUse' ? 1 : -1;
                        },
                        filterTarget(牢骚哥经典沉睡, player, target) {
                            const card = new lib.element.VCard({ name: 'sha' });
                            return target !== player && player.canUse(card, target, false);
                        },
                        ai1(card) {
                            if (!get.event().check) return -1;
                            return 7 - get.value(card);
                        },
                        ai2(target) {
                            const { player, check } = get.event();
                            if (!check) return -1;
                            return get.effect(target, new lib.element.VCard({ name: 'sha' }), player, player);
                        },
                        check: (() => {
                            switch (trigger.name) {
                                case 'phaseJudge': return player.countCards('h') > 2;
                                case 'phaseUse': return player.needsToDiscard();
                                case 'phaseDiscard': return player.needsToDiscard() || player.isTurnedOver() || (player.hasSkill('shebian') && player.canMoveCard(true, true));
                            }
                        })(),
                    }).setHiddenSkill(event.skill).forResult();
                },
                preHidden: true,
                async content(event, trigger, player) {
                    trigger.cancel();
                    switch (trigger.name) {
                        case 'phaseJudge': player.skip('phaseDraw'); break;
                        case 'phaseUse': event.cards?.length && await player.discard(event.cards); break;
                        case 'phaseDiscard': await player.turnOver(); break;
                    }
                    const card = new lib.element.VCard({ name: 'sha' }), target = event.targets[0];
                    if (player.canUse(card, target, false)) {
                        const next = player.useCard(card, target, false);
                        next.audio = false;
                        player.when('useCard').filter(evt => evt === next).then(() => player.draw());
                        await next;
                    }
                },
            },
            //小乔
            mphongyan: {
                mod: {
                    suit(card, suit) {
                        if (suit === 'spade') return 'heart';
                    },
                    maxHandcard(player, num) {
                        if (player.countCards('e') > 0) return num + 2;
                    },
                },
                trigger: { player: 'phaseDrawBegin2' },
                filter(event, player) {
                    return player.countCards('e') > 0 && !event.numFixed;
                },
                forced: true,
                async content(event, trigger, player) {
                    trigger.num++;
                },
            },
            //张角
            mpleiji: {
                audio: 'releiji',
                inherit: 'releiji',
                trigger: { player: ['useCard', 'respond', 'addJudgeEnd'] },
                filter(event, player) {
                    return event.card.name === (event.name === 'addJudge' ? 'shandian' : 'shan');
                },
                ai: {
                    useShan: true,
                    effect: {
                        target_use(card, player, target, current) {
                            return lib.skill.xinleiji.ai.effect.target_use(card, player, target, current);
                        },
                    },
                },
            },
            //于吉
            mpguhuo: {
                audio: 'xinfu_guhuo',
                enable: ['chooseToUse', 'chooseToRespond'],
                hiddenCard(player, name) {
                    if (player.isTempBanned('mpguhuo') || !player.countCards('hs')) return false;
                    return get.inpileVCardList(info => {
                        if (player.getStorage('mpguhuo_used').includes(info[2])) return false;
                        return info[0] === 'basic' || info[0] === 'trick';
                    }).map(info => info[2]).includes(name);
                },
                filter(event, player) {
                    return get.inpileVCardList(info => {
                        if (player.getStorage('mpguhuo_used').includes(info[2])) return false;
                        return info[0] === 'basic' || info[0] === 'trick';
                    }).filter(info => {
                        const vcard = { name: info[2], nature: info[3] };
                        return player.hasCard(card => event.filterCard(get.autoViewAs(vcard, [card]), player, event), 'hs');
                    });
                },
                chooseButton: {
                    dialog(event, player) {
                        const dialog = ui.create.dialog('蛊惑', [get.inpileVCardList(info => {
                            if (player.getStorage('mpguhuo_used').includes(info[2])) return false;
                            return info[0] === 'basic' || info[0] === 'trick';
                        }).filter(info => {
                            const vcard = { name: info[2], nature: info[3] };
                            return player.hasCard(card => event.filterCard(get.autoViewAs(vcard, [card]), player, event), 'hs');
                        }), 'vcard']);
                        dialog.direct = true;
                        return dialog;
                    },
                    check(button) {
                        const event = get.event(), player = event.player, rand = event.getParent().getRand('mpguhuo');
                        const card = new lib.element.VCard({ name: button.link[2], nature: button.link[3] });
                        const val = event.getParent().type === 'phase' ? player.getUseValue(card) : 1;
                        if (val <= 0) return 0;
                        if (game.hasPlayer(current => {
                            return current !== player && !current.hasSkill('chanyuan') && (get.realAttitude || get.attitude)(current, player) < 0;
                        }) && rand > 0.3) {
                            if (!player.countCards('h', cardx => {
                                if (card.name === cardx.name) {
                                    if (card.name !== 'sha') return true;
                                    return get.is.sameNature(card, cardx);
                                }
                                return false;
                            })) return 0;
                            return 3 * val;
                        }
                        return val;
                    },
                    prompt(links) {
                        const link = links[0], name = link[2], nature = link[3];
                        return `###${get.translation('mpguhuo')}###<div class="text center">将一张手牌当作${lib.translate[nature] ?? ''}${lib.translate[name] ?? ''}使用</div>`;
                    },
                    backup(links) {
                        return {
                            audio: 'xinfu_guhuo',
                            filterCard(card, player, target) {
                                let result = true;
                                let suit = card.suit, number = card.number;
                                card.suit = 'none';
                                card.number = null;
                                let mod = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                                if (mod != 'unchanged') result = mod;
                                card.suit = suit;
                                card.number = number;
                                return result;
                            },
                            position: 'hs',
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                suit: 'none',
                                number: null,
                            },
                            ignoreMod: true,
                            ai1(card) {
                                const event = get.event(), player = event.player, rand = event.getRand('mpguhuo');
                                if (game.hasPlayer(current => {
                                    return current !== player && !current.hasSkill('chanyuan') && (get.realAttitude || get.attitude)(current, player) < 0;
                                }) && rand > 0.3) {
                                    const cardx = lib.skill.mpguhuo_backup.viewAs;
                                    if (card.name === cardx.name && (card.name !== 'sha' || get.is.sameNature(card, cardx))) return 10;
                                    return 0;
                                }
                                return 6 - get.value(card);
                            },
                            log: false,
                            popname: true,
                            async precontent(event, trigger, player) {
                                const { result } = event;
                                player.logSkill('mpguhuo');
                                player.addTempSkill('mpguhuo_guess');
                                player.addTempSkill('mpguhuo_used');
                                player.markAuto('mpguhuo_used', [event.result.card.name]);
                                const card = result.cards[0];
                                result.card.suit = get.suit(card);
                                result.card.number = get.number(card);
                            },
                        };
                    },
                },
                ai: {
                    save: true,
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter(player, tag, arg) {
                        if (player.isTempBanned('mpguhuo')) return false;
                        const hiddenCard = lib.skill.mpguhuo.hiddenCard;
                        if (tag === 'save') return hiddenCard(player, 'tao') || (arg && hiddenCard(player, 'jiu') && (arg === player || player.hasSkillTag('jiuOther', null, arg, true)));
                        return hiddenCard(player, tag === 'respondSha' ? 'sha' : 'shan');
                    },
                    order: 10,
                    result: {
                        player(player, target) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
                derivation: 'chanyuan',
                subSkill: {
                    backup: {},
                    used: {
                        charlotte: true,
                        onremove: true,
                    },
                    guess: {
                        charlotte: true,
                        trigger: { player: ['useCardBefore', 'respondBefore'] },
                        filter(event, player) {
                            return event.skill === 'mpguhuo_backup';
                        },
                        silent: true,
                        firstDo: true,
                        async content(event, trigger, player) {
                            const card = trigger.cards[0], fake = card.name !== trigger.card.name || (card.name === 'sha' && !get.is.sameNature(trigger.card, card));
                            trigger.card.number = get.number(card);
                            trigger.card.suit = get.suit(card);
                            const cardTranslate = `${get.translation(trigger.card.nature) || ''}${get.translation(trigger.card.name)}`;
                            player.$throw(trigger.cards.length);
                            player.popup(cardTranslate, trigger.name === 'useCard' ? 'metal' : 'wood');
                            player.line(trigger.targets, get.nature(trigger.card));
                            await player.lose(card, ui.ordering).set('relatedEvent', trigger);
                            game.log(player, '声明了', '#y' + cardTranslate);
                            const targets = game.filterPlayer(current => {
                                return current !== player && !current.hasSkill('chanyuan');
                            }).sortBySeat();
                            let faker;
                            if (targets.length > 0) {
                                for (const target of targets) {
                                    const result = await target.chooseBool(`${get.translation(event.name)}：是否质疑${get.translation(player)}声明的${cardTranslate}？`).set('choice', (() => {
                                        if (target.hp <= 1 || (get.realAttitude || get.attitude)(target, player) >= 0) return false;
                                        return Math.random() <= 0.5;
                                    })()).forResult();
                                    const bool = result?.bool;
                                    target.chat(bool ? '质疑！' : '不质疑');
                                    target.popup(bool ? '质疑' : '不质疑', bool ? 'fire' : 'wood');
                                    game.log(target, bool ? '#y质疑' : '#g不质疑');
                                    await game.delayx();
                                    if (result?.bool) {
                                        target.addExpose(0.2);
                                        faker = target;
                                        break;
                                    }
                                }
                            }
                            await player.showCards(trigger.cards, `${get.translation(player)}发动【${get.translation(event.name)}】扣置`);
                            if (faker?.isIn()) {
                                if (fake) {
                                    faker.popup('质疑正确', 'wood');
                                    game.log(player, '声明的', trigger.card, '作废了');
                                    player.tempBanSkill('mpguhuo', null, false);
                                    trigger.cancel();
                                    trigger.getParent().goto(0);
                                    trigger.line = false;
                                    if (get.color(card) === 'red') await player.draw();
                                }
                                else {
                                    faker.popup('质疑错误', 'fire');
                                    await faker.addSkills('chanyuan');
                                }
                            }
                            await game.delayx();
                        },
                    },
                },
            },
            //卧龙诸葛
            mpbazhen: {
                audio: 'bazhen',
                trigger: { player: 'judgeEnd' },
                filter(event, player) {
                    const card = event.result.card;
                    if (get.position(card, true) !== 'o') return false;
                    return get.color(card, player) === 'black' && event.skill?.includes('bagua');
                },
                forced: true,
                content() {
                    player.gain(trigger.result.card, 'gain2');
                },
                init(player, skill) {
                    player.addExtraEquip(skill, 'bagua', true, player => player.hasEmptySlot(2) && lib.card['bagua']);
                },
                onremove(player, skill) {
                    player.removeExtraEquip(skill);
                },
                group: 'bazhen_bagua',
            },
            mphuoji: {
                audio: 'huoji',
                trigger: { global: 'dying' },
                filter(event, player) {
                    if (!event.reason) return false;
                    const evt = event.reason.getParent();
                    return evt.name === 'huogong' && evt.type === 'card' && evt.player === player;
                },
                forced: true,
                locked: false,
                logTarget: 'player',
                async content(event, trigger, player) {
                    trigger.player.addTempSkill('mphuoji_effect');
                    trigger.player.markAuto('mphuoji_effect', [trigger]);
                },
                group: 'mphuoji_huoji',
                subSkill: {
                    huoji: {
                        audio: 'huoji',
                        inherit: 'rehuoji',
                    },
                    effect: {
                        charlotte: true,
                        mod: {
                            cardSavable(card, player) {
                                if (!['tao', 'jiu'].includes(card.name)) return;
                                const evt = _status.event?.getParent('dying', true);
                                if (evt && player.getStorage('mphuoji_effect').includes(evt)) return false;
                            },
                        },
                    },
                },
            },
            //太史慈
            mptianyi: {
                audio: 'tianyi',
                inherit: 'tianyi',
                async content(event, trigger, player) {
                    const result = await player.chooseToCompare(event.target).forResult();
                    if (result?.bool) {
                        const card = get.discardPile('sha', 'random');
                        if (card) await player.gain(card, 'gain2');
                        player.addTempSkill('tianyi2');
                    }
                    else {
                        const cards = [result.player, result.target].filterInD('d');
                        if (cards.length) {
                            player.addTempSkill(`${event.name}_effect`);
                            const next = player.gain(cards, 'gain2');
                            next.gaintag.add(`${event.name}_effect`);
                            await next;
                        }
                        player.addTempSkill('tianyi3');
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove(player, skill) {
                            player.removeGaintag(skill);
                        },
                        mod: {
                            ignoredHandcard(card, player) {
                                if (card.hasGaintag('mptianyi_effect')) return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (name === 'phaseDiscard' && card.hasGaintag('mptianyi_effect')) return false;
                            },
                        },
                    },
                },
            },
            //庞德
            mpjianchu: {
                audio: 'jianchu',
                inherit: 'jianchu',
                async cost(event, trigger, player) {
                    const list = [event.skill, trigger.target];
                    const next = player.discardPlayerCard(trigger.target, get.prompt2(...list), 'he');
                    next.set('att', get.attitude(player, trigger.target) <= 0);
                    next.set('ai', button => {
                        if (!_status.event.att) return 0;
                        const card = button.link;
                        if (get.position(card) !== 'e') return 1;
                        return get.value(card) * (get.subtypes(card).includes('equip2') ? 5 : 1);
                    });
                    next.logSkill = list;
                    event.result = await next.forResult();
                },
                popup: false,
                async content(event, trigger, player) {
                    const target = trigger.target, evt = trigger.getParent();
                    const type = get.type2(event.cards[0], target);
                    if (type !== 'basic') {
                        evt.directHit.add(target);
                        game.log(target, '不可响应', evt.card);
                    }
                    if (type !== 'equip') {
                        evt.baseDamage++;
                        game.log(evt.card, '造成的伤害', '#y+1');
                    }
                    if (type !== 'trick') {
                        target.when('damageEnd').filter(event2 => {
                            return event2.card === evt.card && event2.cards?.someInD('od');
                        }).then(() => player.gain(trigger.cards.filterInD('od'), 'gain2'));
                    }
                },
            },
            //颜良文丑
            mpshuangxiong: {
                audio: 'shuangxiong',
                logAudio: () => 1,
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return player.countCards('h') > 0;
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseCard(get.prompt(event.skill), '展示一张手牌，本回合你可以将一张与此牌颜色不同的牌当做【决斗】使用').set('ai', card => {
                        const { player, goon } = get.event();
                        if (!goon) return -get.value(card);
                        let color = get.color(card), effect = 0, cards = player.getCards('hes'), sha = false;
                        for (const cardx of cards) {
                            if (cardx == card || get.color(cardx) == color) continue;
                            const cardy = get.autoViewAs({ name: 'juedou' }, [cardx]), eff1 = player.getUseValue(cardy);
                            if (get.position(cardx) == 'e') {
                                let eff2 = get.value(cardx);
                                if (eff1 > eff2) effect += eff1 - eff2;
                                continue;
                            }
                            else if (get.name(cardx) == 'sha') {
                                if (sha) {
                                    effect += eff1;
                                    continue;
                                }
                                else sha = true;
                            }
                            let eff2 = player.getUseValue(cardx, null, true);
                            if (eff1 > eff2) effect += eff1 - eff2;
                        }
                        return effect;
                    }).set('goon', player.hasValueTarget({ name: 'juedou' }) && !player.hasSkill('shuangxiong_viewas')).forResult();
                },
                async content(event, trigger, player) {
                    const { cards } = event, color = get.color(cards[0], player);
                    await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
                    player.addTempSkill('shuangxiong_viewas');
                    player.markAuto('shuangxiong_viewas', [color]);
                },
                subfrequent: ['jianxiong'],
                group: 'mpshuangxiong_jianxiong',
                subSkill: {
                    jianxiong: {
                        audio: 'shuangxiong',
                        trigger: { player: 'damageEnd' },
                        filter(event, player) {
                            const evt = event.getParent();
                            if (evt.type !== 'card' || evt.name !== 'juedou') return false;
                            const evtx = event.getParent(2);
                            if (evtx.skill !== 'shuangxiong_viewas' || evtx.player !== player) return false;
                            return evt[player === evt.player ? 'targetCards' : 'playerCards']?.someInD('od');
                        },
                        prompt2(event, player) {
                            const evt = event.getParent();
                            return `获得${get.translation(evt[player === evt.player ? 'targetCards' : 'playerCards'].filterInD('od'))}`;
                        },
                        frequent: true,
                        async content(event, trigger, player) {
                            const evt = trigger.getParent();
                            await player.gain(evt[player === evt.player ? 'targetCards' : 'playerCards'].filterInD('od'), 'gain2');
                        },
                    },
                },
            },
            //袁绍
            mpqingchao: {
                audio: 'xueyi',
                trigger: {
                    player: ['phaseUseBegin', 'loseAfter'],
                    global: ['loseAsyncAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'addToExpansionAfter'],
                },
                filter(event, player) {
                    if (player.countCards('h') >= 2 || player.hasSkill('mpqingchao_used') || !player.isPhaseUsing()) return false;
                    let gain = 0, lose = 0;
                    if (event.getg) gain = event.getg(player).length;
                    if (event.getl) lose = event.getl(player).hs.length;
                    return gain !== lose;
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.skill)).set('ai', target => {
                        const player = get.player();
                        return get.damageEffect(target, player, player);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    player.addTempSkill('mpqingchao_used', 'phaseUseAfter');
                    await event.targets[0].damage();
                },
            },
            //徐晃
            mpjiezi: {
                audio: 'ext:活动武将/audio/skill:2',
                inherit: 'jiezi',
                logTarget: 'player',
                async content(event, trigger, player) {
                    await player.draw(1 + (get.distance(player, trigger.player) <= 1));
                },
            },
            //孙坚
            mpyinghun: {
                audio: 'yinghun',
                inherit: 'yinghun',
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.skill)).set('ai', target => {
                        const player = get.player();
                        if (player.getDamagedHp() == 1 && !target.countCards('he')) return 0;
                        if (get.attitude(player, target) > 0) return 10 + get.attitude(player, target);
                        if (player.getDamagedHp() === 1) return -1;
                        return 1;
                    }).setHiddenSkill(event.skill).forResult();
                },
            },
            //曹丕
            mpxingshang: {
                audio: 'xingshang',
                trigger: { global: 'die' },
                preHidden: true,
                logTarget: 'player',
                async content(event, trigger, player) {
                    const target = trigger.player;
                    if (target.countCards('he')) await player.gain(target.getCards('he'), target, 'giveAuto', 'bySelf');
                    await player.recover();
                },
            },
            mpfangzhu: {
                audio: 'fangzhu',
                inherit: 'refangzhu',
                direct: false,
                getIndex: event => event.num,
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set('ai', target => {
                        if (target.hasSkillTag('noturn')) return 0;
                        const player = get.player(), att = get.attitude(player, target);
                        if (att === 0) return 0;
                        if (att > 0) {
                            if (target.isTurnedOver()) return 1000 - target.countCards('h');
                            if (player.getDamagedHp() < 3) return -1;
                            return 100 - target.countCards('h');
                        }
                        if (target.isTurnedOver() || player.getDamagedHp() >= 3) return -1;
                        return 1 + target.countCards('h');
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const num = player.getDamagedHp();
                    if (num > 0) {
                        const result = await target.chooseToDiscard('he', num).set('ai', card => {
                            const player = get.player();
                            if (player.isTurnedOver() || player.getDamagedHp() > 2) return -1;
                            return Math.sqrt(player.getHp()) - get.value(card);
                        }).set('prompt', '弃置' + get.cnNumber(num) + '张牌并失去1点体力；或选择不弃置，将武将牌翻面并摸' + get.cnNumber(num) + '张牌').forResult();
                        if (result?.bool && result.cards?.length) {
                            await target.loseHp();
                            return;
                        }
                    }
                    await target.turnOver();
                    if (num > 0) await target.draw(num);
                },
            },
            //董卓
            mpjiuchi: {
                audio: 'jiuchi',
                inherit: 'oljiuchi',
                filter(event, player) {
                    if (event.name === 'chooseToUse') return player.hasCard(card => get.suit(card) === 'spade', 'hs');
                    return event.card && event.card.name == 'sha' && event.getParent(2).jiu === true && !player.isTempBanned('mpbenghuai');
                },
                async content(event, trigger, player) {
                    player.tempBanSkill('mpbenghuai');
                },
            },
            mproulin: {
                audio: 'roulin',
                inherit: 'roulin',
                group: 'mproulin_draw',
                subSkill: {
                    draw: {
                        audio: 'roulin',
                        trigger: { global: 'damageSource' },
                        filter(event, player) {
                            if (!event.source || ![event.source, event.player].includes(player)) return false;
                            if (event.source === player && event.player.hasSex('female')) return true;
                            if (event.player === player && event.source.hasSex('female')) return true;
                            return false;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            await player.draw();
                        },
                    },
                },
            },
            mpbenghuai: {
                audio: 'benghuai',
                inherit: 'benghuai',
                async content(event, trigger, player) {
                    const result = await player.chooseControl('体力', '体力上限').set('ai', () => {
                        const player = get.player();
                        return player.isDamaged() || player.maxHp <= 1 ? 0 : 1;
                    }).set('prompt', '崩坏：失去1点体力或减1点体力上限').forResult();
                    if (typeof result?.index === 'number') {
                        await player[['loseHp', 'loseMaxHp'][result.index]](1);
                        if (result.index === 1) await player.draw(2);
                    }
                },
            },
            //祝融
            mplieren: {
                audio: 'lieren',
                inherit: 'relieren',
                async content(event, trigger, player) {
                    const target = trigger.target;
                    const result = await player.chooseToCompare(trigger.target).forResult();
                    if (result?.bool) await player.gainPlayerCard(target, true, 'he');
                },
            },
            //鲁肃
            mphaoshi: {
                audio: 'haoshi',
                inherit: 'haoshi',
                check(event, player) {
                    if (player.countCards('h') + event.num <= 3) return true;
                    return game.hasPlayer(current => current !== player && get.attitude(player, current) > 0);
                },
                content() {
                    trigger.num += 2;
                    player.addSkill('mphaoshi_effect');
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        trigger: { player: 'phaseDrawEnd' },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            player.removeSkill(event.name);
                            if (player.countCards('h') <= 5) return;
                            const result = await player.chooseCardTarget({
                                filterCard: true,
                                selectCard: Math.floor(player.countCards('h') / 2),
                                posption: 'h',
                                filterTarget: lib.filter.notMe,
                                prompt: '好施：将一半手牌交给一名其他角色',
                                forced: true,
                                ai1() {
                                    return 1 + Math.random();
                                },
                                ai2(target) {
                                    return get.attitude(_status.event.player, target);
                                },
                            }).forResult();
                            if (result?.bool && result.cards?.length && result.targets?.length) {
                                await player.give(result.cards, result.targets[0]);
                            }
                        },
                    },
                },
            },
            //贾诩
            mpweimu: {
                audio: 'weimu',
                inherit: 'weimu',
                group: 'mpweimu_damage',
                subSkill: {
                    damage: {
                        audio: 'weimu',
                        trigger: { player: 'damageEnd' },
                        filter(event, player) {
                            return event.source?.isIn() && event.source !== _status.currentPhase;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            await player.draw(2);
                        },
                        ai: {
                            maixie: true,
                            maixie_hp: true,
                            threaten: 0.75,
                            effect: {
                                target(card, player, target) {
                                    if (player !== _status.currentPhase && get.tag(card, 'damage')) {
                                        if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                                        let num = 1;
                                        if (get.attitude(player, target) > 0) num = player.needsToDiscard() ? 0.7 : 0.5;
                                        if (target.hp >= 4) return [1, num * 2];
                                        if (target.hp == 3) return [1, num * 1.5];
                                        if (target.hp == 2) return [1, num * 0.5];
                                    }
                                },
                            },
                        },
                    },
                },
            },
            mpwansha: {
                inherit: 'rewansha',
                filter: () => true,
                async content(event, trigger, player) {
                    const targets = game.filterPlayer();
                    for (const current of targets) {
                        if (current !== player && current !== trigger.player) current.addSkillBlocker(`${event.name}_fengyin`);
                    }
                    player.addTempSkill(`${event.name}_clear`);
                },
                global: 'mpwansha_global',
                subSkill: {
                    global: {
                        mod: {
                            cardEnabled(card, player) {
                                const source = _status.currentPhase;
                                if (card.name === 'tao' && source?.isIn() && source !== player && source.hasSkill('rewansha') && !player.isDying()) return false;
                            },
                            cardSavable(card, player) {
                                const source = _status.currentPhase;
                                if (card.name === 'tao' && source?.isIn() && source !== player && source.hasSkill('rewansha') && !player.isDying()) return false;
                            },
                        },
                    },
                    fengyin: {
                        inherit: 'fengyin',
                    },
                    clear: {
                        charlotte: true,
                        trigger: { global: 'dyingAfter' },
                        filter(event, player) {
                            return !_status.dying.length;
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            player.removeSkill(event.name);
                        },
                        onremove() {
                            game.countPlayer2(current => current.removeSkillBlocker('mpwansha_fengyin'));
                        },
                    },
                },
            },
            mpluanwu: {
                audio: 'luanwu',
                inherit: 'luanwu',
                multitarget: true,
                async content(event, trigger, player) {
                    for (const target of game.filterPlayer().sortBySeat()) {
                        if (target === player) continue;
                        const result = await target.chooseToUse('乱武：使用一张杀或失去1点体力', function (card) {
                            if (get.name(card) !== 'sha') return false;
                            return lib.filter.cardEnabled.apply(this, arguments);
                        }, function (card, player, target) {
                            if (target == player) return false;
                            const dist = get.distance(player, target);
                            if (dist > 1) {
                                if (game.hasPlayer(current => {
                                    return current !== player && get.distance(player, current) < dist;
                                })) return false;
                            }
                            return lib.filter.filterTarget.apply(this, arguments);
                        }).set('ai2', function () {
                            return get.effect_use.apply(this, arguments) + 0.01;
                        }).set('addCount', false).forResult();
                        if (!result?.bool) {
                            await target.loseHp();
                            await player.discardPlayerCard(target, 'he');
                        }
                        await game.delayx();
                    }
                    const history = game.getGlobalHistory('useCard', evt => {
                        if (evt.getParent(2) !== event || evt.card.name !== 'sha' || !evt.cards?.length) return false;
                        return !game.hasPlayer2(target => target.hasHistory('damage', evtx => evtx.card === evt.card));
                    });
                    if (history.length) {
                        const cards = history.map(evt => evt.cards).flat().unique();
                        if (!cards.length) return;
                        const noowner = cards.filter(card => !get.owner(card));
                        const owner = cards.filter(card => get.owner(card));
                        const next = player.gain([...noowner, ...owner]);
                        next.noownercards = noowner;
                        next.ownercards = owner;
                        next.ownermap = (() => {
                            const map = new Map([]), owners = owner.map(i => get.owner(i)).unique().sortBySeat();
                            for (const target of owners) map.set(target, owner.filter(i => get.owner(i) === target));
                            return map;
                        })();
                        next.set('animate', event => {
                            const { player, noownercards: noowner, ownercards: owner, ownermap } = event;
                            if (noowner.length > 0) player.$gain2(noowner);
                            if (owner.length > 0) {
                                for (const [target, cards] of [...ownermap.entries()]) target.$give(cards, player);
                            }
                            return 500;
                        });
                        await next;
                    }
                },
            },
            //张郃
            mpqiaobian: {
                audio: 'qiaobian',
                trigger: { player: ['phaseJudgeBefore', 'phaseDrawBefore', 'phaseUseBefore', 'phaseDiscardBefore'] },
                prompt2(event, player) {
                    let str;
                    switch (event.name) {
                        case 'phaseDraw':
                            str = '可以获得至多两名角色各一张手牌';
                            break;
                        case 'phaseUse':
                            str = '可以移动场上的一张牌并视为对其中一名角色使用【杀】';
                            break;
                        default:
                            str = '弃置一张牌';
                            break;
                    }
                    return `跳过${get.translation(event.name)}，然后你${str}`;
                },
                check(event, player) {
                    let check;
                    switch (event.name) {
                        case 'phaseJudge':
                            check = player.hasCard(card => !lib.card[card.name]?.noEffect, 'j');
                            break;
                        case 'phaseDraw':
                            check = (() => {
                                let num1 = 0, num2 = 0;
                                game.countPlayer(target => {
                                    if (target !== player) {
                                        const att = get.attitude(player, target);
                                        if (att <= 0) num1++;
                                        if (att < 0) num2++;
                                    }
                                });
                                return num1 >= 2 && num2 > 0;
                            })();
                            break;
                        case 'phaseUse':
                            check = player.canMoveCard(true);
                            break;
                        case 'phaseDiscard':
                            check = player.needsToDiscard();
                            break;
                    }
                    return check;
                },
                async content(event, trigger, player) {
                    trigger.cancel();
                    game.log(player, '跳过了', `#y${get.translation(trigger.name)}`);
                    let result
                    switch (trigger.name) {
                        case 'phaseDraw':
                            result = await player.chooseTarget([1, 2], (card, player, target) => {
                                return target != player && target.countCards('h');
                            }, `${get.translation(event.name)}：获得至多两名其他角色各一张手牌`).set('ai', target => {
                                const player = get.player();
                                return get.effect(target, { name: 'shunshou_copy', position: 'h' }, player, player);
                            }).forResult();
                            if (result?.bool && result.targets?.length) {
                                const targets = result.targets.sortBySeat();
                                player.line(targets, 'green');
                                await player.gainMultiple(targets);
                                await game.delay();
                            }
                            break;
                        case 'phaseUse':
                            if (player.canMoveCard()) {
                                result = await player.moveCard().forResult();
                                const sha = new lib.element.VCard({ name: 'sha' });
                                if (result?.bool && result.targets?.some(target => player.canUse(sha, target))) {
                                    const targets = result.targets.slice();
                                    result = await player.chooseTarget(`${get.translation(event.name)}：视为对其中一名角色使用【杀】`, (card, player, target) => {
                                        const sha = new lib.element.VCard({ name: 'sha' });
                                        return player.canUse(sha, target);
                                    }).set('ai', target => {
                                        const player = get.player(), sha = new lib.element.VCard({ name: 'sha' });
                                        return get.effect(target, sha, player, player);
                                    }).set('targets', targets).forResult();
                                    if (result?.bool && result.targets?.length) {
                                        const target = result.targets[0];
                                        player.line(target, 'fire');
                                        await player.useCard(sha, target, false);
                                    }
                                }
                            }
                            else await game.delayx();
                            break;
                        default:
                            await player.chooseToDiscard('he', true);
                            break;
                    }
                },
            },
            //邓艾
            mptuntian: {
                audio: 'tuntian',
                inherit: 'tuntian',
                filter(event, player) {
                    const evt = event.getl(player);
                    if (player === _status.currentPhase) {
                        if (event.type != 'discard') return false;
                        return evt?.cards2?.some(i => get.type2(i, evt.hs.includes(i) ? player : false) === 'basic');
                    }
                    if (event.name === 'gain' && event.player === player) return false;
                    return evt?.cards2?.length > 0;
                },
            },
            mpzaoxian: {
                audio: 'zaoxian',
                inherit: 'zaoxian',
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.loseMaxHp();
                    const next = player.addToExpansion(get.cards(2), 'gain2');
                    next.gaintag.add('tuntian');
                    await next;
                    await player.addSkills('jixi');
                },
                ai: { combo: 'mptuntian' },
            },
            //姜维
            mptiaoxin: {
                inherit: 'retiaoxin',
                filter(event, player) {
                    return game.hasPlayer(target => lib.skill.mptiaoxin.filterTarget(null, player, target));
                },
                filterTarget(card, player, target) {
                    return target !== player && !player.getStorage('mptiaoxin_used').includes(target);
                },
                usable: Infinity,
                async content(event, trigger, player) {
                    const target = event.target;
                    player.addTempSkill('mptiaoxin_used', 'phaseUseAfter');
                    player.markAuto('mptiaoxin_used', [target]);
                    const result = await target.chooseToUse(function (card, player, event) {
                        if (get.name(card) !== 'sha') return false;
                        return lib.filter.filterCard.apply(this, arguments);
                    }, '挑衅：对' + get.translation(player) + '使用一张杀，或令其弃置你的一张牌').set('filterTarget', function (card, player, target) {
                        const source = get.event().sourcex;
                        if (target !== source && !ui.selected.targets.includes(source)) return false;
                        return lib.filter.filterTarget.apply(this, arguments);
                    }).set('targetRequired', true).set('complexSelect', true).set('complexTarget', true).set('sourcex', player).forResult();
                    if (!result?.bool && target.countCards('he') > 0) await player.discardPlayerCard(target, 'he', true);
                },
            },
            mpzhiji: {
                audio: 'zhiji',
                inherit: 'zhiji',
                trigger: { global: 'phaseZhunbeiBegin' },
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.chooseDrawRecover(2, true);
                    await player.loseMaxHp();
                    await player.addSkills(lib.skill[event.name].derivation);
                    player.addTempSkill(`${event.name}_guanxing`);
                },
                derivation: 'mpguanxing',
                subSkill: { guanxing: { charlotte: true } },
            },
            //刘禅
            mpfangquan: {
                audio: 'fangquan',
                trigger: { player: 'phaseUseBefore' },
                filter(event, player) {
                    return player.countCards('h') > 0 && !player.hasSkill('mpfangquan_mark');
                },
                check(event, player) {
                    const fang = !player.hasMark('mpfangquan_give') && player.hp >= 2 && player.countCards('h') <= player.hp + 1;
                    if (!fang) return false;
                    return game.hasPlayer(target => {
                        if (target.hasJudge('lebu') || target === player) return false;
                        if (get.attitude(player, target) > 4) return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards('h') + 1) > 0;
                        return false;
                    });
                },
                async content(event, trigger, player) {
                    trigger.cancel();
                    player.addTempSkill(`${event.name}_give`);
                    player.addMark(`${event.name}_give`, 1, false);
                },
                subSkill: {
                    give: {
                        onremove: true,
                        audio: 'fangquan',
                        trigger: { player: 'phaseEnd' },
                        getIndex(event, player) {
                            return player.countMark('mpfangquan_give') || 1;
                        },
                        async cost(event, trigger, player) {
                            event.result = await player.chooseCardTarget({
                                prompt: get.prompt(event.skill),
                                prompt2: '弃置一张手牌，令一名其他角色进行一个额外回合',
                                filterCard: lib.filter.cardDiscardable,
                                ai1(card) {
                                    return 20 - get.value(card);
                                },
                                filterTarget: lib.filter.notMe,
                                ai2(target) {
                                    const player = get.player();
                                    if (target.hasJudge('lebu') || get.attitude(player, target) <= 0) return -1;
                                    if (target.isTurnedOver()) return 0.15;
                                    return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards('h') + 1);
                                },
                            }).forResult();
                        },
                        async content(event, trigger, player) {
                            const [target] = event.targets;
                            target.markSkillCharacter('mpfangquan', player, '放权', '进行一个额外回合');
                            const next = target.insertPhase();
                            player.removeMark('mpfangquan_give', 1, false);
                            target.addSkill('mpfangquan_mark');
                            player.addSkill('mpfangquan_recover');
                            player.markAuto('mpfangquan_recover', [next]);
                        },
                    },
                    mark: {
                        charlotte: true,
                        trigger: { player: ['phaseAfter', 'phaseCancelled'] },
                        silent: true,
                        async content(event, trigger, player) {
                            player.unmarkSkill('mpfangquan');
                            player.removeSkill('mpfangquan_mark');
                        },
                    },
                    recover: {
                        charlotte: true,
                        audio: 'fangquan',
                        trigger: { global: 'damageSource' },
                        filter(event, player) {
                            if (!event.source?.isIn() || event.source !== _status.currentPhase) return false;
                            if (event.source.getHistory('sourceDamage').indexOf(event) > 0) return false;
                            const evt = event.getParent('phase', true);
                            return evt && player.getStorage('mpfangquan_recover').includes(evt);
                        },
                        async content(event, trigger, player) {
                            await player.recover();
                        },
                    },
                },
            },
            mpxiangle: {
                audio: 'xiangle',
                inherit: 'xiangle',
                filter(event, player) {
                    return get.tag(event.card, 'damage') && get.type(event.card) !== 'delay';
                },
                async content(event, trigger, player) {
                    const eff = get.effect(player, trigger.card, trigger.player, trigger.player);
                    const result = await trigger.player.chooseToDiscard(`${get.translation(event.name)}：弃置一张基本牌，否则${get.translation(trigger.card)}对${get.translation(player)}无效`, { type: 'basic' }).set('ai', card => {
                        return get.event().eff > 0 ? (10 - get.value(card)) : 0;
                    }).set('eff', eff).forResult();
                    if (!result?.bool) {
                        trigger.getParent().excluded.add(player);
                        game.log(trigger.card, '对', player, '无效');
                    }
                },
                ai: {
                    effect: {
                        target(card, player, target, current) {
                            if (get.tag(card, 'damage') && get.type(card) !== 'delay' && get.attitude(player, target) < 0) {
                                if (_status.event.name == 'mpxiangle') return;
                                if (get.attitude(player, target) > 0 && current < 0) return 'zerotarget';
                                const bs = player.getCards('h', { type: 'basic' });
                                bs.remove(card);
                                if (card.cards) bs.removeArray(card.cards);
                                else bs.removeArray(ui.selected.cards);
                                if (!bs.length) return 'zerotarget';
                                if (player.hasSkill('jiu') || player.hasSkill('tianxianjiu')) return;
                                if (bs.length <= 2) {
                                    for (let i = 0; i < bs.length; i++) {
                                        if (get.value(bs[i]) < 7) return [1, 0, 1, -0.5];
                                    }
                                    return [1, 0, 0.3, 0];
                                }
                                return [1, 0, 1, -0.5];
                            }
                        },
                    },
                },
            },
            //孙策
            mphunzi: {
                audio: 'hunzi',
                inherit: 'hunzi',
                filter(event, player) {
                    return player.getHp() <= 2;
                },
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.loseMaxHp();
                    await player.addSkills(lib.skill[event.name].derivation);
                },
                derivation: ['mpyingzi', 'mpyinghun'],
            },
            //二张
            mpzhijian: {
                audio: 'zhijian',
                inherit: 'olzhijian',
                async content(event, trigger, player) {
                    const target = event.target;
                    const next = target.equip(event.cards[0]);
                    await next;
                    await player.draw();
                    if (target.hasHistory('lose', evt => {
                        if (evt.getParent() !== next) return false;
                        return evt.es.length > 0;
                    })) await target.draw();
                },
            },
            mpguzheng: {
                audio: 'guzheng',
                trigger: { global: 'phaseDiscardAfter' },
                filter(event, player) {
                    if (event.player === player || !event.player.isIn()) return false;
                    return event.player.hasHistory('lose', evt => {
                        return evt.type === 'discard' && evt.getParent('phaseDiscard') === event && evt.hs.someInD('d');
                    });
                },
                checkx(event, player, cards, cards2) {
                    if (cards.length > 2 || get.attitude(player, event.player) > 0) return true;
                    for (var i = 0; i < cards2.length; i++) {
                        if (get.value(cards2[i], event.player, 'raw') < 0) return true;
                    }
                    return false;
                },
                preHidden: true,
                async cost(event, trigger, player) {
                    let cards = [], cards2 = [];
                    game.getGlobalHistory('cardMove', evt => {
                        if (evt.name == 'cardsDiscard' && evt.getParent('phaseDiscard') == trigger) cards.addArray(evt.cards.filterInD('d'));
                    });
                    game.countPlayer2(current => {
                        current.getHistory('lose', evt => {
                            if (evt.type != 'discard' || evt.getParent('phaseDiscard') != trigger) return;
                            cards.addArray(evt.cards.filterInD('d'));
                            if (current === trigger.player) cards2.addArray(evt.hs.filterInD('d'));
                        })
                    });
                    const check = lib.skill[event.skill].checkx(trigger, player, cards, cards2);
                    const result = event.result = await player.chooseCardButton(cards, '固政：选择令' + get.translation(trigger.player) + '收回的牌').set('ai', button => {
                        if (_status.event.check) {
                            return 20 - get.value(button.link, _status.event.getTrigger().player);
                        }
                        return 0;
                    }).set('check', check).set('cards', cards2).set('filterButton', button => {
                        return _status.event.cards.includes(button.link);
                    }).setHiddenSkill(event.skill).forResult();
                    if (result?.links?.length) {
                        event.result.cards = cards;
                        event.result.cost_data = result.links;
                    }
                },
                logTarget: 'player',
                async content(event, trigger, player) {
                    let cards = event.cards.slice();
                    await trigger.player.gain(event.cost_data, 'gain2');
                    cards.removeArray(event.cost_data);
                    if (cards.length > 0) {
                        const next = player.gain(cards, 'gain2');
                        await next;
                        if (next.cards?.some(card => get.type(card, null, false) === 'equip')) return;
                    }
                    await player.draw(2);
                },
                ai: { expose: 0.2 },
            },
            //严颜
            mpjuzhan: {
                audio: 'nzry_juzhan',
                trigger: {
                    player: 'phaseZhunbeiBegin',
                    target: 'useCardToTargeted',
                },
                filter(event, player) {
                    if (player.storage.mpjuzhan) return false;
                    return event.name === 'phaseZhunbei' || (event.player !== player && event.card.name == 'sha');
                },
                prompt2() {
                    const target = _status.currentPhase;
                    return `摸一张牌${target?.isIn() ? `，然后${get.translation(target)}本回合内不能再对你使用牌` : ''}`;
                },
                async content(event, trigger, player) {
                    player.changeZhuanhuanji('mpjuzhan');
                    await player.draw();
                    const target = _status.currentPhase;
                    if (target?.isIn()) {
                        target.addTempSkill('mpjuzhan_ban');
                        target.markAuto('mpjuzhan_ban', [player]);
                    }
                },
                mark: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content(storage) {
                        if (!storage) return '准备阶段或当你成为其他角色使用【杀】的目标后，你可以摸一张牌，然后当前回合角色本回合不能对你使用牌';
                        return '当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌';
                    },
                },
                group: 'mpjuzhan_gain',
                subSkill: {
                    gain: {
                        audio: 'nzry_juzhan',
                        trigger: { player: 'useCardToPlayered' },
                        filter(event, player) {
                            return player.storage.mpjuzhan && event.card.name === 'sha';
                        },
                        async cost(event, trigger, player) {
                            const list = [event.skill, trigger.target];
                            const next = player.gainPlayerCard(trigger.target, get.prompt(...list), 'he');
                            next.prompt2 = `获得其一张牌，然后你本回合内不能再对其使用牌`;
                            next.logSkill = list;
                            event.result = await next.forResult();
                        },
                        popup: false,
                        content() {
                            player.changeZhuanhuanji('mpjuzhan');
                            player.addTempSkill('mpjuzhan_ban');
                            player.markAuto('mpjuzhan_ban', [trigger.target]);
                        },
                    },
                    ban: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '不能对$使用牌' },
                        mod: {
                            playerEnabled(card, player, target) {
                                if (player.getStorage('mpjuzhan_ban').includes(target)) return false;
                            },
                        },
                    },
                },
            },
            //王平
            mpfeijun: {
                audio: 'nzry_feijun',
                enable: 'phaseUse',
                filter(event, player) {
                    if (!player.hasCard(card => lib.filter.cardDiscardable(card, player), 'he')) return false;
                    return game.hasPlayer(current => {
                        return current.countCards('h') >= player.countCards('h') || current.countCards('e') >= player.countCards('e');
                    });
                },
                filterCard: lib.filter.cardDiscardable,
                selectCard() {
                    const event = get.event(), player = get.player();
                    const func = function (player) {
                        const target = player.storage.mpfeijun;
                        if (target?.isIn()) target.prompt('<span class="firetext">上次<br>发动</span>');
                    };
                    if (event.isMine()) func(player);
                    else if (player.isOnline2()) player.send(func, player);
                    return 1;
                },
                position: 'he',
                check(card) {
                    return 7 - get.value(card);
                },
                usable: 1,
                async content(event, trigger, player) {
                    let list = [];
                    if (game.hasPlayer(current => {
                        return current.countCards('h') >= player.countCards('h');
                    })) list.push('令一名手牌数大于你的角色交给你一张牌');
                    if (game.hasPlayer(current => {
                        return current.countCards('e') >= player.countCards('e');
                    })) list.push('令一名装备区内牌数大于你的角色弃置一张装备牌');
                    if (!list.length) return;
                    let index;
                    if (list.length < 2) {
                        index = game.hasPlayer(current => {
                            return current.countCards('h') >= player.countCards('h');
                        }) ? 0 : 1;
                    }
                    else {
                        index = (await player.chooseControl().set('ai', () => {
                            const player = get.player();
                            return game.hasPlayer(current => {
                                return current.countCards('h') >= player.countCards('h') && get.attitude(player, current) < 0;
                            }) ? 0 : 1;
                        }).set('choiceList', list).forResult()).index;
                    }
                    if (typeof index !== 'number') return;
                    let result;
                    if (index === 0) {
                        result = await player.chooseTarget(true, (card, player, target) => {
                            return target !== player && target.countCards('h') >= player.countCards('h');
                        }, '选择一名手牌数大于等于你的角色').set('ai', target => {
                            const player = get.player();
                            return -get.attitude(player, target);
                        }).forResult();
                    }
                    else {
                        result = await player.chooseTarget(true, (card, player, target) => {
                            return target !== player && target.countCards('e') >= player.countCards('e');
                        }, '选择一名装备区里牌数大于等于你的角色').set('ai', target => {
                            const player = get.player();
                            return -get.attitude(player, target);
                        }).forResult();
                    }
                    if (!result?.bool || !result.targets?.length) return;
                    const target = result.targets[0];
                    if (player.storage[event.name] !== target) {
                        event[event.name] = true;
                        player.setStorage(event.name, target, true);
                    }
                    player.line(target, 'green');
                    if (index === 0) await target.chooseToGive(player, 'he', true);
                    else await target.chooseToDiscard({ type: 'equip' }, 'he', true);
                },
                ai: {
                    order: 11,
                    result: {
                        player(player) {
                            const last = player.storage.mpfeijun;
                            if (game.hasPlayer(current => {
                                return (current.countCards('h') >= player.countCards('h') || current.countCards('e') >= player.countCards('e')) && get.attitude(player, current) < 0 && current === last;
                            }) || game.hasPlayer(current => {
                                return current.countCards('h') >= player.countCards('h') && get.attitude(player, current) < 0;
                            }) || (player.countCards('h') >= 2 && game.hasPlayer(current => {
                                return current.countCards('e') >= player.countCards('e') && get.attitude(player, current) < 0;
                            }))) return 1;
                            return 0;
                        },
                    },
                },
                intro: { content: 'players' },
            },
            mpbinglve: {
                audio: 'nzry_binglve',
                trigger: { player: 'mpfeijunAfter' },
                filter(event, player) {
                    return event[event.name];
                },
                forced: true,
                async content(event, trigger, player) {
                    await player.draw(2);
                },
                ai: { combo: 'mpfeijun' },
            },
            //孙亮
            mpkuizhu: {
                audio: 'nzry_kuizhu',
                trigger: { player: 'phaseDiscardAfter' },
                async cost(event, trigger, player) {
                    let cards = [], result, forced = false;
                    player.getHistory('lose', evt => {
                        if (evt.type === 'discard' && evt.getParent('phaseDiscard') == trigger) cards.addArray(evt.cards2);
                    });
                    const num = Math.max(1, cards.length);
                    const str1 = '令至多' + get.cnNumber(num) + '名角色摸一张牌';
                    const str2 = '对一名体力值大于等于' + num + '的角色造成1点伤害';
                    if (!game.hasPlayer(target => target.getHp() >= num)) result = { control: '选项一', index: 0 };
                    else {
                        forced = true;
                        result = await player.chooseControl('cancel2').set('num', num).set('ai', () => {
                            const { player, num } = get.event();
                            return game.hasPlayer(target => {
                                return get.damageEffect(target, player, player) > 0 && target.getHp() >= num;
                            }) ? 1 : 0;
                        }).set('choiceList', [str1, str2]).set('prompt', get.prompt(event.skill)).forResult();
                    }
                    if (result?.control && result.control !== 'cancel2') {
                        const prompt = forced ? `请选择【${get.translation(event.skill)}】的目标` : get.prompt(event.skill);
                        const prompt2 = [str1, str2][result.index], selectTarget = [[1, num], 1][result.index];
                        event.result = await player.chooseTarget(prompt, (card, player, target) => {
                            const { num, index } = get.event();
                            return index === 0 || target.getHp() >= num;
                        }, forced, selectTarget, prompt2).set('num', num).set('ai', target => {
                            const { player, index } = get.event();
                            return [get.effect(target, { name: 'draw' }, player, player), get.damageEffect(target, player, player)][index];
                        }).set('index', result.index).forResult();
                        if (event.result) event.result.cost_data = result.index === 0;
                    }
                },
                async content(event, trigger, player) {
                    const targets = [...event.targets].sortBySeat();
                    if (event.cost_data) {
                        await game.asyncDraw(targets);
                        await game.delayx();
                    }
                    else await targets[0].damage();
                },
            },
            mpchezheng: {
                audio: 'nzry_zhizheng',
                mod: {
                    playerEnabled(card, player, target) {
                        if (player.isPhaseUsing() && target !== player && !target.inRange(player)) return false;
                    },
                },
                trigger: { player: 'phaseUseEnd' },
                filter(event, player) {
                    const targets = game.filterPlayer(target => target !== player && !target.inRange(player));
                    return player.getHistory('useCard', evt => evt.getParent('phaseUse') === event).length <= targets.length && targets.some(target => target.countDiscardableCards(player, 'he') > 0);
                },
                forced: true,
                async content(event, trigger, player) {
                    const result = await player.chooseTarget('请选择〖掣政〗的目标', (card, player, target) => {
                        return target !== player && !target.inRange(player) && target.countDiscardableCards(player, 'he') > 0;
                    }, '弃置任意名攻击范围内不包含你的角色的一张牌', [1, Infinity], true).set('ai', target => {
                        const player = get.player();
                        return get.effect(target, { name: 'guohe_copy2' }, player, player);
                    }).forResult();
                    if (result?.bool && result.targets?.length) {
                        const targets = [...result.targets].sortBySeat();
                        player.line(targets);
                        for (const target of targets) await player.discardPlayerCard(target, 'he', true);
                    }
                },
            },
            //王基
            mpqizhi: {
                audio: 'qizhi',
                inherit: 'qizhi',
                filter(event, player) {
                    if (!event.targets?.length || !event.isFirstTarget) return false;
                    return game.hasPlayer(target => !event.targets.includes(target) && target.countCards('he') > 0);
                },
            },
            mpjinqu: {
                audio: 'jinqu',
                inherit: 'jinqu',
                prompt2(event, player) {
                    return `摸三张牌，然后将手牌弃置至${player.getRoundHistory('custom', evt => evt.mpqizhi).length + 1}张`;
                },
                check(event, player) {
                    return player.countCards('h') >= player.getRoundHistory('custom', evt => evt.mpqizhi).length;
                },
                async content(event, trigger, player) {
                    await player.draw(3);
                    const num = player.getRoundHistory('custom', evt => evt.mpqizhi).length + 1;
                    if (player.countCards('h') > num) await player.chooseToDiscard(player.countCards('h') - num, true);
                },
            },
            //筷子
            mpshenshi: {
                audio: 'nzry_shenshi',
                enable: 'phaseUse',
                filter(event, player) {
                    return !player.storage.mpshenshi && player.countCards('he') > 0;
                },
                filterCard: true,
                position: 'he',
                filterTarget: lib.filter.notMe,
                check(card) {
                    return 5 - get.value(card);
                },
                usable: 1,
                prompt: () => lib.skill.mpshenshi.intro.content(false),
                discard: false,
                lose: false,
                delay: false,
                async content(event, trigger, player) {
                    player.changeZhuanhuanji('mpshenshi');
                    const target = event.target;
                    await player.give(event.cards, target);
                    await target.damage('nocard');
                    if ((!target.isIn() || target.isMinHp()) && game.hasPlayer(target => target.countCards('h') < 4)) {
                        const result = await player.chooseTarget(`${get.translation(event.name)}：是否令一名角色将手牌摸至四张？`, (card, player, target) => {
                            return target.countCards('h') < 4;
                        }).set('ai', target => {
                            const player = get.player();
                            return get.effect(target, { name: 'draw' }, player, player) * (4 - target.countCards('h'));
                        }).forResult();
                        if (result?.bool && result.targets?.length) {
                            player.line(result.targets);
                            await result.targets[0].drawTo(4)
                        }
                    }
                },
                ai: {
                    order: 1,
                    result: { target: -1 },
                },
                mark: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content(storage) {
                        if (!storage) return '出牌阶段限一次，你可以将一张牌交给一名其他角色，然后对其造成1点伤害，若该角色的体力值为全场最低，则你可以令一名角色将手牌摸至四张';
                        return '其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其任意张牌，此回合结束时，若其未全部失去这些牌，你将手牌摸至四张';
                    },
                },
                group: 'mpshenshi_damage',
                subSkill: {
                    damage: {
                        audio: 'nzry_shenshi',
                        trigger: { player: 'damageEnd' },
                        filter(event, player) {
                            if (!player.storage.mpshenshi) return false;
                            return player.countCards('he') > 0 && event.source?.isIn() && event.source != player;
                        },
                        logTarget: 'source',
                        prompt2: '观看该角色的手牌，然后交给其任意张牌，其失去此牌后，你将手牌摸至四张',
                        async content(event, trigger, player) {
                            player.changeZhuanhuanji('mpshenshi');
                            const target = trigger.source;
                            await player.viewHandcards(target);
                            player.addTempSkill('mpshenshi_effect');
                            const skill = 'mpshenshi_' + player.playerid;
                            if (!lib.skill[skill]) {
                                game.broadcastAll((initSkill, skill) => {
                                    initSkill(skill);
                                    _status.postReconnect['mpshenshi'] ??= [initSkill, []];
                                    _status.postReconnect['mpshenshi'][1].add(skill);
                                }, skill => {
                                    lib.skill[skill] = {};
                                    lib.translate[skill] = '审时';
                                }, skill);
                            }
                            const next = player.chooseToGive(target, 'he', [1, Infinity], true);
                            next.set('allowChooseAll', true);
                            next.gaintag.add(skill);
                            await next;
                        },
                    },
                    effect: {
                        charlotte: true,
                        onremove(player) {
                            game.countPlayer(target => target.removeGaintag('mpshenshi_' + player.playerid));
                        },
                        audio: 'nzry_shenshi',
                        trigger: { global: 'phaseEnd' },
                        filter(event, player) {
                            if (player.countCards('h') >= 4) return false;
                            return game.hasPlayer2(current => current.hasCard(card => card.hasGaintag('mpshenshi_' + player.playerid), 'h'));
                        },
                        forced: true,
                        content() {
                            player.drawTo(4);
                        },
                    },
                },
            },
            //卢植
            mpmingren: {
                drawNum: 1,
                inherit: 'nzry_mingren',
            },
            mpzhenliang: {
                audio: ['nzry_zhenliang_11.mp3', 'nzry_zhenliang_12.mp3'],
                enable: 'phaseUse',
                trigger: {
                    player: 'loseAfter',
                    global: ['loseAsyncAfter', 'cardsDiscardAfter'],
                },
                filter(event, player) {
                    const cards = player.getExpansions('nzry_mingren');
                    if (!cards.length) return false;
                    if (event.name === 'chooseToUse') {
                        if (player.storage.mpzhenliang || player.hasSkill('mpzhenliang_used', null, null, false)) return false;
                        if (!player.hasCard(card => lib.skill.mpzhenliang.filterCard(card, player), 'he')) return false;
                        return game.hasPlayer(current => player.inRange(current));
                    }
                    else {
                        if (_status.currentPhase === player || !player.storage.mpzhenliang) return false;
                        const cards2 = event.getd?.() ?? [];
                        if (event.name !== 'cardsDiscard') {
                            return event.getl?.(player)?.cards2?.some(card => cards2.includes(card) && get.type2(card) === get.type2(cards[0]));
                        }
                        const evt = event.getParent();
                        if (evt.name !== 'orderingDiscard') return false;
                        const evtx = (evt.relatedEvent || evt.getParent());
                        if (evtx.name === 'judge' || evtx.player !== player) return false;
                        return player.hasHistory('lose', evtxx => {
                            if (evtx !== (evtxx.relatedEvent || evtxx.getParent())) return false;
                            return evtxx.getl?.(player)?.cards2?.some(card => cards2.includes(card) && get.type2(card) === get.type2(cards[0]));
                        });
                    }
                },
                position: 'he',
                filterCard(card, player) {
                    if (!lib.filter.cardDiscardable(card, player)) return false;
                    return get.color(card) === get.color(player.getExpansions('nzry_mingren')[0]);
                },
                filterTarget(card, player, target) {
                    return player.inRange(target);
                },
                check(card) {
                    return 6.5 - get.value(card);
                },
                prompt: '弃置一张与“任”颜色相同的牌，对攻击范围内的一名角色造成1点伤害',
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt(event.skill), '令一名角色摸两张牌').set('ai', target => {
                        const player = get.player();
                        return get.effect(target, { name: 'draw' }, player, player);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    player.changeZhuanhuanji('mpzhenliang');
                    if (!trigger) {
                        const target = event.target;
                        player.addTempSkill('mpzhenliang_used', 'phaseUseAfter');
                        await target.damage('nocard');
                    }
                    else await event.targets[0].draw(2);
                },
                ai: {
                    order: 10,
                    result: {
                        player(player, target) {
                            return get.damageEffect(target, player, player);
                        },
                    },
                    combo: 'mpmingren',
                },
                mark: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content(storage) {
                        if (!storage) return '出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害';
                        return '当你于回合外失去的牌进入弃牌堆后，若此牌与“任”类别相同，则你可以令一名角色摸两张牌';
                    },
                },
                subSkill: { used: { charlotte: true } },
            },
            //陈到
            mpwanglie: {
                audio: 'drlt_wanglie',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    return player.isPhaseUsing();
                },
                async cost(event, trigger, player) {
                    const result = await player.chooseControl('数值+1', '摸两张牌', 'cancel2').set('ai', () => {
                        const player = get.player(), trigger = get.event().getTrigger();
                        if (player.hasCard(card => player.hasValueTarget(card, null, true), 'hs')) return 'cancel2';
                        return (get.tag(trigger.card, 'damage') || get.tag(trigger.card, 'recover')) ? 0 : 1;
                    }).set('prompt', get.prompt(event.skill)).setHiddenSkill(event.skill).forResult();
                    if (result?.control && result.control !== 'cancel2') {
                        event.result = { bool: true, cost_data: result.index };
                    }
                },
                preHidden: true,
                async content(event, trigger, player) {
                    if (event.cost_data === 0) {
                        trigger.baseDamage++;
                        game.log(trigger.card, '的数值', '#y+1');
                    }
                    else await player.draw(2);
                    player.addTempSkill('mpwanglie_ban');
                },
                init(player) {
                    if (player.isPhaseUsing()) {
                        const event = _status.event?.getParent('phaseUse', true);
                        if (!player.hasHistory('useCard', evt => {
                            return evt.getParent('phaseUse') === event;
                        })) player.addTempSkill('mpwanglie_first', 'phaseUseAfter');
                    }
                },
                group: 'mpwanglie_effect',
                subSkill: {
                    effect: {
                        charlotte: true,
                        trigger: { player: 'phaseUseBegin' },
                        silent: true,
                        async content(event, trigger, player) {
                            player.addTempSkill('mpwanglie_first', 'phaseUseAfter');
                        },
                    },
                    first: {
                        mod: {
                            targetInRange(card, player, target) {
                                if (card) return true;
                            },
                        },
                        audio: 'drlt_wanglie',
                        trigger: { player: 'useCard1' },
                        forced: true,
                        async content(event, trigger, player) {
                            player.removeSkill(event.name);
                            trigger.nowuxie = true;
                            trigger.directHit.addArray(game.players);
                            game.log(trigger.card, '不可被响应');
                            await game.delayx();
                        },
                        ai: { directHit_ai: true },
                    },
                    ban: {
                        charlotte: true,
                        mark: true,
                        intro: { content: '不能使用牌' },
                        mod: {
                            cardEnabled: () => false,
                            cardSavable: () => false,
                        },
                    },
                },
            },
            //周妃
            mpliangyin: {
                audio: 'liangyin',
                trigger: { global: ['loseAfter', 'addToExpansionAfter', 'cardsGotoSpecialAfter', 'loseAsyncAfter'] },
                filter(event, player, name) {
                    if (event.name === 'lose' || event.name === 'loseAsync') return event.getlx !== false && event.toStorage;
                    return event.name === 'addToExpansion' || !event.notrigger;
                },
                async cost(event, trigger, player) {
                    const num = (() => {
                        if (!trigger.name.startsWith('lose')) return trigger.cards.length;
                        return game.countPlayer(target => (event.getl?.(target)?.cards ?? []).length);
                    })();
                    event.result = await player.chooseTarget(get.prompt(event.skill), [1, num]).set('ai', target => {
                        const player = get.player();
                        return get.effect(target, { name: 'draw' }, player, player);
                    }).set('prompt2', `令${num > 0 ? '至多' : ''}${get.cnNumber(num)}名角色${num > 0 ? '各' : ''}摸一张牌`).forResult();
                },
                async content(event, trigger, player) {
                    await game.asyncDraw(event.targets);
                    await game.delayx();
                },
                group: 'mpliangyin_discard',
                subSkill: {
                    discard: {
                        trigger: { global: ['gainAfter', 'loseAsyncAfter'] },
                        filter(event, player) {
                            if (!game.hasPlayer(target => target.countDiscardableCards(target, 'he') > 0)) return false;
                            return event.fromStorage || game.hasPlayer(target => {
                                const evt = event.getl(target);
                                return game.hasPlayer(current => event.getg(current).containsSome(...evt.xs, ...evt.ss));
                            });
                        },
                        async cost(event, trigger, player) {
                            const num = game.countPlayer(target => {
                                const cards = trigger.getg(target);
                                return cards.filter(card => {
                                    if (trigger.fromStorage) return true;
                                    return game.hasPlayer(current => {
                                        const evt = trigger.getl(current);
                                        return evt.xs.includes(card) || evt.ss.includes(card);
                                    });
                                }).length;
                            });
                            event.result = await player.chooseTarget(get.prompt(event.skill), (card, player, target) => {
                                return target.countDiscardableCards(target, 'he');
                            }, [1, num]).set('ai', target => {
                                const player = get.player();
                                return get.effect(target, { name: 'guohe_copy2' }, target, player);
                            }).set('prompt2', `令${num > 0 ? '至多' : ''}${get.cnNumber(num)}名角色${num > 0 ? '各' : ''}弃置一张牌`).forResult();
                        },
                        async content(event, trigger, player) {
                            for (const target of event.targets.sortBySeat()) await target.chooseToDiscard('he', true);
                        },
                    },
                },
            },
            //毌丘俭
            mpzhengrong: {
                audio: 'drlt_zhenrong',
                trigger: {
                    source: 'damageSource',
                    player: 'damageEnd',
                },
                filter(event, player) {
                    return [event.source, event.player].some(target => target?.isIn() && target.countCards('he'));
                },
                async cost(event, trigger, player) {
                    let target, forced = false;
                    const targets = game.filterPlayer(target => [trigger.source, trigger.player].includes(target) && target.countCards('h'));
                    if (targets.length > 1) {
                        forced = true;
                        const result = await player.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                            const trigger = get.event().getTrigger();
                            return [trigger.source, trigger.player].includes(target) && target.countCards('h');
                        }).set('animate', false).set('ai', target => {
                            const player = get.player();
                            return get.effect(target, { name: 'guohe_copy2' }, player, player);
                        }).forResult();
                        if (result?.bool && result.targets?.length) target = result.targets[0];
                        else return;
                    }
                    else target = targets[0];
                    const next = player.choosePlayerCard(target, 'he');
                    next.ai = function (button) {
                        const { player, target } = get.event();
                        return get.effect(target, { name: 'guohe_copy2' }, player, player) * get.buttonValue(button);
                    };
                    next.forced = forced;
                    next.prompt = forced ? `${get.translation(event.skill)}：请选择${get.translation(target)}的一张牌` : get.prompt2(event.skill, target);
                    event.result = {
                        targets: [target],
                        ...(await next.forResult()),
                    };
                },
                async content(event, trigger, player) {
                    const next = player.addToExpansion(event.cards, trigger.player, 'give', 'log');
                    next.gaintag.add(event.name);
                    await next;
                },
                marktext: '荣',
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                onremove(player, skill) {
                    const cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
            },
            mphongju: {
                audio: 'drlt_hongju',
                inherit: 'drlt_hongju',
                filter(event, player) {
                    return player.getExpansions('mpzhengrong').length >= 3;
                },
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.loseMaxHp();
                    const next = player.addToExpansion(get.cards(2), 'gain2');
                    next.gaintag.add('mpzhengrong');
                    await next;
                    await player.addSkills(lib.skill[event.name].derivation);
                },
                derivation: 'mpqingce',
                ai: { combo: 'mpzhengrong' },
            },
            mpqingce: {
                audio: 'drlt_qingce',
                inherit: 'drlt_qingce',
                filter(event, player) {
                    if (!game.hasPlayer(target => lib.skill.mpqingce.filterTarget(null, player, target))) return false;
                    return player.getExpansions('mpzhengrong').length > 0;
                },
                filterTarget(card, player, target) {
                    return target.countDiscardableCards(player, 'hej') > 0;
                },
                async content(event, trigger, player) {
                    const next = player.chooseCardButton(player.getExpansions('mpzhengrong'), `${get.translation(event.name)}：请选择你要获得的“荣”`, true);
                    next.ai = button => get.value(button.link);
                    const result = await next.forResult();
                    if (result?.bool && result.links?.length) {
                        await player.gain(result.links, 'gain2');
                        await player.discardPlayerCard(event.target, 'hej', true);
                    }
                },
                ai: {
                    combo: 'mpzhengrong',
                    order(item, player) {
                        const order = get.order({ name: 'guohe' }, player);
                        return order + (order > 0 ? 0.3 : 0);
                    },
                    result: {
                        player(player, target) {
                            return get.effect(target, { name: 'guohe' }, player, player);
                        },
                    },
                },
            },
            //袁术
            mpyongsi: {
                audio: 'drlt_yongsi',
                trigger: { player: 'phaseDiscardBegin' },
                filter(event, player) {
                    let num = 0;
                    player.getHistory('sourceDamage', evt => num += evt.num);
                    if (num === 1) return true;
                    return num > 1 || player.countCards('h') < player.maxHp;
                },
                forced: true,
                async content(event, trigger, player) {
                    if (!player.hasHistory('sourceDamage')) await player.drawTo(player.maxHp);
                    else player.addTempSkill('mpyongsi_yingzi');
                },
                group: 'mpyongsi_yongsi',
                subSkill: {
                    yongsi: {
                        audio: 'drlt_yongsi',
                        trigger: { player: 'phaseDrawBegin2' },
                        filter(event, player) {
                            return !event.numFixed;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            trigger.num += game.countGroup();
                        },
                    },
                    yingzi: {
                        charlotte: true,
                        mark: true,
                        markimage: 'image/card/handcard.png',
                        intro: { content: '手牌上限为体力上限' },
                        mod: { maxHandcardBase: player => player.maxHp },
                    },
                },
            },
            //朱治
            mpanguo: {
                audio: 'anguo',
                inherit: 'reanguo',
                filterTarget: true,
            },
            //孙登
            mpkuangbi: {
                audio: 'kuangbi',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return game.hasPlayer(target => target.countCards('he') > 0 && target !== player);
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                        return target.countCards('he') > 0 && target !== player;
                    }).set('ai', target => {
                        const { player, goon } = get.event(), att = get.attitude(player, target);
                        if (goon) {
                            if (att > 0) return att * Math.sqrt(target.countCards('he'));
                            return (1 - att) / (target.countCards('he') + 1);
                        }
                        return (-10 * att) / (target.countCards('he') + 1);
                    }).set('goon', player.countCards('hs', card => player.hasValueTarget(card)) >= 2).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const result = await target.chooseCard('匡弼：将至多三张牌置于' + get.translation(player) + '的武将牌上', 'he', [1, 3], true, 'allowChooseAll').set('ai', card => {
                        const { player, source } = get.event();
                        if (get.attitude(player, source) > 0) return 7 - get.value(card);
                        return -get.value(card);
                    }).set('source', player).forResult();
                    if (result?.bool) {
                        const skill = `${event.name}_effect`;
                        player.addTempSkill(skill, 'phaseUseAfter');
                        player.markAuto(skill, [target]);
                        const next = player.addToExpansion(result.cards, target, 'give');
                        next.gaintag.add(skill);
                        await next;
                    }
                },
                subSkill: {
                    effect: {
                        mod: {
                            aiOrder(player, card, num) {
                                if (num <= 0 || !player.getExpansions('mpkuangbi_effect').length) return;
                                const color = get.color(card);
                                if (player.getExpansions('mpkuangbi_effect').some(i => get.color(i) == color)) return num + 10;
                                return num / 4;
                            },
                        },
                        charlotte: true,
                        audio: 'kuangbi',
                        trigger: { player: 'useCard' },
                        filter(event, player) {
                            return player.getExpansions('mpkuangbi_effect').length > 0;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            const cards = player.getExpansions(event.name);
                            const color = get.color(trigger.card), cardsx = cards.filter(card => get.color(card) === color);
                            let result;
                            if (cardsx.length > 1) {
                                result = await player.chooseButton(['匡弼：移去一张同颜色的"匡弼"牌', cards], true).set('filterButton', button => {
                                    return get.color(button.link) === get.event().color;
                                }).set('suit', color).forResult();
                            }
                            else if (cardsx.length === 1) result = { bool: true, links: cardsx };
                            else result = { bool: false, links: [cards.randomGet()] };
                            if (result?.links?.length) {
                                await player.loseToDiscardpile(result.links);
                                await game.delayx();
                            }
                            if (result?.bool) {
                                let list = [player];
                                const target = player.getStorage(event.name)[0];
                                if (target?.isIn()) list.push(target);
                                await game.asyncDraw(list);
                                await game.delayx();
                            }
                            else await player.draw();
                        },
                        intro: {
                            content: 'expansion',
                            markcount: 'expansion',
                        },
                        onremove(player, skill) {
                            delete player.storage[skill];
                            const cards = player.getExpansions(skill);
                            if (cards.length) player.loseToDiscardpile(cards);
                        },
                    },
                },
            },
            //诸葛诞
            mpgongao: {
                audio: 'gongao',
                inherit: 'regongao',
                filter(event, player) {
                    return game.getAllGlobalHistory('everything', evt => {
                        return evt.name === event.name && evt.player === event.player;
                    }).indexOf(event) === 0;
                },
                async content(event, trigger, player) {
                    await player.gainMaxHp();
                    await player.recover();
                    await player.draw();
                },
            },
            mpjuyi: {
                audio: 'juyi',
                inherit: 'rejuyi',
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.drawTo(player.maxHp);
                    await player.addSkills(lib.skill[event.name].derivation);
                },
                derivation: ['mpbenghuai', 'reweizhong'],
            },
            //刘协
            mptianming: {
                audio: 'tianming',
                inherit: 'tianming',
                check(event, player) {
                    const cards = player.getDiscardableCards(player, 'he');
                    return cards.length !== 1 || !['shan', 'tao'].includes(get.name(card));
                },
                async content(event, trigger, player) {
                    await player.chooseToDiscard('he', true);
                    await player.draw(2);
                },
            },
            mpmizhao: {
                audio: 'mizhao',
                inherit: 'mizhao',
                async content(event, trigger, player) {
                    const from = event.target;
                    await player.give(event.cards, from);
                    if (game.hasPlayer(target => {
                        return target !== player && target !== from && from.canCompare(target);
                    })) {
                        const result2 = await player.chooseTarget(true, (card, player, target) => {
                            const from = get.event().from;
                            return target !== player && target !== from && from.canCompare(target);
                        }, `${get.translation(event.name)}：请选择${get.translation(from)}拼点的目标`).set('ai', target => {
                            const { player, from } = get.event();
                            const eff = get.effect(target, new lib.element.VCard({ name: 'sha' }), from, player);
                            const att = get.attitude(player, target);
                            if (att > 0) return eff - 10;
                            return eff;
                        }).set('from', from).set('forceDie', true).forResult();
                        if (result2?.bool && result2.targets?.length) {
                            const to = result2.targets[0];
                            from.line(to);
                            const result = await from.chooseToCompare(to).forResult();
                            if (result) {
                                if (result.tie) await player.gainMultiple([from, to].sortBySeat(), 'he', true);
                                else {
                                    const winner = result.bool ? from : to;
                                    const loser = result.bool ? to : from;
                                    const sha = new lib.element.VCard({ name: 'sha' });
                                    if (winner.canUse(sha, loser, false)) await winner.useCard(sha, loser, false, 'noai');
                                }
                            }
                        }
                    }
                },
            },
            //曹节
            mphuimin: {
                audio: 'huimin',
                inherit: 'huimin',
                filter: () => true,
                check(event, player) {
                    return 3 + game.countPlayer(target => {
                        if (target.countCards('h') + (player === target ? 3 : 0) >= target.getHp()) return 0;
                        return Math.abs(get.attitude(player, target));
                    }) > 0;
                },
                async content(event, trigger, player) {
                    await player.draw(3);
                    let list = game.filterPlayer(target => target.countCards('h') < target.getHp());
                    if (!list.length) return;
                    const result = await player.chooseCardTarget({
                        prompt: get.translation(event.name),
                        prompt2: '请选择要分配的手牌和分牌起点',
                        filterCard: true,
                        selectCard() {
                            const { player, list } = get.event();
                            return list.length >= player.countCards('h') ? -1 : list.length;
                        },
                        position: 'h',
                        forced: true,
                        filterTarget(card, player, target) {
                            return get.event().list.includes(target);
                        },
                        ai1(card) {
                            return 6 - get.value(card);
                        },
                        ai2(target) {
                            const { player, list } = get.event();
                            const att = get.attitude(player, target), index = list.indexOf(target);
                            if (att <= 0) return att;
                            let prev = list[(index ? index : list.length) - 1];
                            if (get.attitude(player, prev) < 0) return att;
                            return 0;
                        },
                        list,
                    }).forResult();
                    if (!result?.bool || !result.cards?.length || !result.targets?.length) return;
                    const { cards, targets } = result;
                    await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
                    list.sortBySeat(targets[0]);
                    player.line(list, 'green');
                    await player.lose(cards, ui.ordering);
                    const dialog = ui.create.dialog('惠民', cards, true);
                    _status.dieClose.push(dialog);
                    dialog.videoId = lib.status.videoId++;
                    game.addVideo('cardDialog', null, ['惠民', get.cardsInfo(cards), dialog.videoId]);
                    game.broadcast((cards, id) => {
                        const dialog = ui.create.dialog('惠民', cards, true);
                        _status.dieClose.push(dialog);
                        dialog.videoId = id;
                    }, cards, dialog.videoId);
                    await game.delay();
                    while (list.length > 0 && cards.length > 0) {
                        const current = list.shift();
                        const next = current.chooseButton(true);
                        next.set('dialog', dialog.videoId);
                        next.set('closeDialog', false);
                        next.set('dialogdisplay', true);
                        next.set('cardFilter', cards.slice());
                        next.set('filterButton', button => {
                            return get.event().cardFilter.includes(button.link);
                        });
                        next.set('ai', button => {
                            return get.value(button.link);
                        });
                        const result2 = await next.forResult();
                        if (!result2.bool || !result2.links?.length) continue;
                        await current.gain(result2.links, 'gain2');
                        cards.removeArray(result2.links);
                        let capt = get.translation(current) + '选择了' + get.translation(result2.links);
                        game.broadcastAll((card, id, name, capt) => {
                            const dialog = get.idDialog(id);
                            if (dialog) {
                                dialog.content.firstChild.innerHTML = capt;
                                for (const button of dialog.buttons) {
                                    if (button.link == card) {
                                        game.createButtonCardsetion(name, button);
                                        break;
                                    }
                                }
                                game.addVideo('dialogCapt', null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
                            }
                        }, result2.links[0], dialog.videoId, current.getName(true), capt);
                    }
                    game.broadcastAll('closeDialog', dialog.videoId);
                    game.broadcastAll(dialog => _status.dieClose.remove(dialog), dialog);
                    if (cards.length) await game.cardsDiscard(cards);
                },
            },
            //张鲁
            mpyishe: {
                audio: 'yishe',
                inherit: 'yishe',
                filter(event, player) {
                    return player.getExpansions('yishe').length < 3;
                },
                async content(event, trigger, player) {
                    await player.draw(2);
                    let result, cards = player.getCards('he');
                    if (!cards.length) return;
                    else if (cards.length <= 1) result = { bool: true, cards };
                    else result = await player.chooseCard([1, 2], 'he', true, `${get.translation(event.name)}：将至多两张牌称为“米”置于武将牌上`).set('allowChooseAll', true).forResult();
                    if (result?.bool && result.cards?.length) {
                        const next = player.addToExpansion(result.cards, player, 'give');
                        next.gaintag.add('yishe');
                        await next;
                    }
                },
                onremove(player) {
                    const cards = player.getExpansions('yishe');
                    if (cards.length) player.loseToDiscardpile(cards);
                },
            },
            //赵忠
            mphuangkong: {
                audio: 'huangkong',
                inherit: 'huangkong',
                filter(event, player) {
                    if (player === _status.currentPhase || player.countCards('h') > player.getHp()) return false;
                    return event.card.name === 'sha' || get.type(event.card) === 'trick';
                },
            },
            //小学云
            mpchongzhen: {
                audio: 'chongzhen',
                inherit: 'chongzhen',
                filter(event, player) {
                    if (event.card.name !== 'sha' && event.card.name !== 'shan') return false;
                    const target = lib.skill.chongzhen.logTarget(event, player);
                    return target?.isIn() && target.countGainableCards(player, 'h') > 0;
                },
            },
        },
        dynamicTranslate: {
            mpjuzhan(player, skill) {
                let yang = '阳：准备阶段或当你成为其他角色使用【杀】的目标后，你可以摸一张牌，然后当前回合角色本回合不能对你使用牌';
                let yin = '阴：当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌';
                if (player.storage[skill]) yin = `<span class='bluetext'>${yin}</span>`;
                else yang = `<span class='firetext'>${yang}</span>`;
                return `转换技。${yang}；${yin}。`;
            },
            mpshenshi(player, skill) {
                let yang = '阳：出牌阶段限一次，你可以将一张牌交给一名其他角色，然后对其造成1点伤害，若该角色的体力值为全场最低，则你可以令一名角色将手牌摸至四张';
                let yin = '阴：其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其任意张牌，此回合结束时，若其未全部失去这些牌，你将手牌摸至四张';
                if (player.storage[skill]) yin = `<span class='bluetext'>${yin}</span>`;
                else yang = `<span class='firetext'>${yang}</span>`;
                return `转换技。${yang}；${yin}。`;
            },
            mpzhenliang(player, skill) {
                let yang = '阳：出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害';
                let yin = '阴：当你于回合外失去的牌进入弃牌堆后，若此牌与“任”类别相同，则你可以令一名角色摸两张牌';
                if (player.storage[skill]) yin = `<span class='bluetext'>${yin}</span>`;
                else yang = `<span class='firetext'>${yang}</span>`;
                return `转换技。${yang}；${yin}。`;
            },
        },
        translate: {
            MiNiApp_standard: '新一将·标准包',
            MiNiApp_shenhua: '新一将·神话再临',
            MiNiApp_yijiang: '新一将·一将成名',
            MiNiApp_xinghuo: '新一将·星火燎原',
            MiNiApp_qunying: '新一将·群英荟萃',
            mp_shen_zhaoyun: '新一将神赵云',
            mpjuejing: '绝境',
            mpjuejing_info: '锁定技。你的手牌上限+2；摸牌阶段，你多摸两张牌；当你进入或脱离濒死状态时，你摸一张牌。',
            mp_liubei: '新一将刘备',
            mprende: '仁德',
            mprende_info: '出牌阶段，你可以将任意张手牌交给一名其他角色，然后本阶段你不能对其发动此技能。若你本阶段因此给出了至少两张牌，则你可以视为使用一张基本牌（有次数限制且计入使用次数，若你本次给出了超出两张牌，则此牌的伤害值/回复值+1）。',
            mp_caocao: '新一将曹操',
            mpjianxiong: '奸雄',
            mpjianxiong_info: '当你受到伤害后，你可以摸一张牌并获得造成伤害的牌。若此牌为【杀】且你的体力值小于伤害来源，则你可以对其使用此牌；若不存在造成伤害的实体牌，则改为摸两张牌。',
            mp_zhaoyun: '新一将赵云',
            mpyajiao: '涯角',
            mpyajiao_info: '当你于回合外使用或打出手牌时，你可以展示牌堆顶一张牌，然后将此牌交给一名角色。若你本次使用或打出的牌为红色，你摸一张牌。',
            mp_machao: '新一将马超',
            mptieji: '铁骑',
            mptieji_info: '当你使用【杀】指定一名角色为目标后，你可以令其本回合非锁定技失效，然后你进行一次判定，除非该角色弃置一张与判定结果花色相同的牌，否则不能使用【闪】抵消此【杀】。若此【杀】造成伤害，则此【杀】不计入次数。',
            mp_ganning: '新一将甘宁',
            mpqixi: '奇袭',
            mpqixi_info: '你可以将一张黑色牌当作【过河拆桥】使用；你使用【过河拆桥】弃置与此牌花色相同的牌后，你摸一张牌。',
            mpfenwei: '奋威',
            mpfenwei_info: '每轮限一次，一名角色使用锦囊牌指定多个目标后，你可以令此牌对任意名目标角色无效。',
            mp_xiahoudun: '新一将夏侯惇',
            mpganglie: '刚烈',
            mpganglie_info: '当你受到1点有来源造成的伤害后，你可进行判定，若结果为：红色，你对伤害来源造成1点伤害；黑色，你弃置伤害来源一张牌并摸一张牌。',
            mpqingjian: '清俭',
            mpqingjian_info: '当你于摸牌阶段外获得牌时，你可以展示任意张牌并交给一名其他角色。每回合限一次，你每以此法交出一种类别的牌，当前回合角色手牌上限+1。',
            mp_xuzhu: '新一将许褚',
            mpluoyi: '裸衣',
            mpluoyi_info: '摸牌阶段开始时，你亮出牌堆顶四张牌。然后你可以获得其中的基本牌、武器牌和【决斗】，若如此做，你放弃摸牌，且以你为伤害来源的【杀】或【决斗】造成的伤害+1直到你的下回合开始。',
            mp_zhugeliang: '新一将诸葛亮',
            mpguanxing: '观星',
            mpguanxing_info: '准备阶段和结束阶段，你可以观看牌堆顶的五张牌，然后以任意顺序将这些牌置于牌堆顶或牌堆底。',
            mp_lvmeng: '新一将吕蒙',
            mpkeji: '克己',
            mpkeji_info: '若你未于本回合出牌阶段使用或打出过【杀】，则你可以跳过弃牌阶段；若你未于本回合出牌阶段使用过牌，则你再摸两张牌。',
            mpqinxue: '勤学',
            mpqinxue_info: `觉醒技，准备阶段，若你的手牌数减体力值大于等于2，则你减1点体力上限，获得技能${get.poptip('gongxin')}，且本回合使用牌无次数限制。`,
            mp_zhouyu: '新一将周瑜',
            mpyingzi: '英姿',
            mpyingzi_info: '锁定技。你的手牌上限视为你的体力上限；摸牌阶段，你多X张牌（X为你已损失的体力值+1）。',
            mpfanjian: '反间',
            mpfanjian_info: '出牌阶段限两次，你可以展示一张手牌并交给一名其他角色，其选择一项：①展示所有手牌，弃置所有与此牌颜色相同的牌；②失去1点体力，随机弃置装备区里的一张牌。',
            mp_luxun: '新一将陆逊',
            mpqianxun: '谦逊',
            mpqianxun_info: '当其他角色使用的锦囊牌或【杀】对你生效时，若你是此牌的唯一目标，则你可以将所有手牌置于你的武将牌上直到回合结束。',
            mplianying: '连营',
            mplianying_info: '当你失去最后的手牌后，你可以令至多X名角色各摸一张牌（X为你此次失去的手牌数）；若你因此获得了锦囊牌或装备牌，则你再摸一张牌。',
            mp_simayi: '新一将司马懿',
            mpguicai: '鬼才',
            mpguicai_info: '当一名角色的判定牌生效前，你可以打出一张牌代替之，然后若此牌颜色和原判定牌不同，则你获得原判定牌。',
            mp_huatuo: '新一将华佗',
            mpjijiu: '急救',
            mpjijiu_info: '你的回合外，你可以将一张红色牌当作【桃】使用。若此牌为红桃基本牌，则回复值+1。',
            mpqingnang: '青囊',
            mpqingnang_info: '出牌阶段限一次，你可以弃置一张牌，令一名角色回复1点体力。若你弃置的是红色牌，则你重置本技能发动次数。',
            mp_huangyueying: '新一将黄月英',
            mpjizhi: '集智',
            mpjizhi_info: '当你使用锦囊牌时，你可以摸一张牌。若此牌为基本牌且当前回合角色为你，则你本回合手牌上限+1（至多+5）。',
            mpqicai: '奇才',
            mpqicai_info: '锁定技。你使用锦囊牌无距离限制；其他角色不能弃置你装备区里的防具牌和宝物牌；当你失去装备里的武器牌或坐骑牌后，你获得弃牌堆中的一张锦囊牌。',
            mp_daqiao: '新一将大乔',
            mpliuli: '流离',
            mpliuli_info: '当你成为【杀】或单目标伤害锦囊牌的目标时，你可以弃置一张牌并将此【杀】转移给一名你攻击范围内的不为使用者的角色。',
            mp_zhenji: '新一将甄宓',
            mpluoshen: '洛神',
            mpluoshen_info: '准备阶段，你可以进行判定并获得判定牌（本回合不计入手牌上限），若判定结果为黑色，你可重复此流程。',
            mp_diaochan: '新一将貂蝉',
            mplijian: '离间',
            mplijian_info: '出牌阶段限一次，你可以弃置一张牌并选择两名男性角色，令其中一名角色视为对另一名角色使用【决斗】。若有角色因此受伤，你可以获得其一张牌。',
            mpbiyue: '闭月',
            mpbiyue_info: '结束阶段，你可以摸一张牌（若你的手牌数小于体力值则改为摸两张牌）。',
            mp_re_weiyan: '新一将魏延',
            mpqimou: '奇谋',
            mpqimou_info: '限定技，出牌阶段，你可以失去任意点体力，本回合你计算与其他角色的距离-X，且你可以多使用X张【杀】，且你因【杀】造成伤害发动【狂骨】时可多摸一张牌（X为你失去的体力值）。',
            mp_xiahouyuan: '新一将夏侯渊',
            mpshensu: '神速',
            mpshensu_info: '你可以选择至多三项：1.跳过判定阶段和摸牌阶段；2.跳过出牌阶段并弃置一张非基本牌；3.跳过弃牌阶段并将武将牌翻面。你每选择一项，视为你对一名其他角色使用一张无距离限制的【杀】并摸一张牌。',
            mp_xiaoqiao: '新一将小乔',
            mphongyan: '红颜',
            mphongyan_info: '锁定技，你区域内的黑桃牌和黑桃判定牌均视为红桃；若你的装备区有牌，则你摸牌阶段多摸一张牌且手牌上限+2。',
            mp_sp_zhangjiao: '新一将张角',
            mpleiji: '雷击',
            mpleiji_info: '当你使用或打出【闪】时或【闪电】进入你的判定区时，你可令一名其他角色进行判定。若判定结果为：梅花，你回复1点体力，然后对其造成1点雷属性伤害；黑桃，你对其造成2点雷属性伤害。',
            mp_re_yuji: '新一将于吉',
            mpguhuo: '蛊惑',
            mpguhuo_info: `每回合每种牌名限一次，你可以扣置一张手牌当作一张基本牌或普通锦囊牌使用或打出。其他角色依次选择是否质疑。有角色质疑时，你终止质疑流程并展示此牌：若为假，此牌作废且此技能本回合失效，若此牌为红色则你摸一张牌；若为真，质疑角色获得${get.poptip('chanyuan')}。`,
            mp_dianwei: '新一将典韦',
            mpqiangxi: '强袭',
            mpqiangxi_info: '出牌阶段每名角色限一次，你可以弃置一张装备牌或失去1点体力。对攻击范围内一名其他角色造成1点伤害，若其因此进入濒死状态，则你回复1点体力。',
            mp_pangtong: '新一将庞统',
            mplianhuan: '连环',
            mplianhuan_info: '出牌阶段，你可以将♣牌当作【铁索连环】使用或重铸；当你使用【铁索连环】指定目标后，你可以弃置所有一名目标角色各一张牌；你重铸【铁索连环】后，随机从弃牌堆获得一张不同花色的牌。',
            mpniepan: '涅槃',
            mpniepan_info: '限定技，当你处于濒死状态时，你可以弃置你区域内的所有牌并复原你的武将牌，然后摸三张牌并将体力回复至3点，且本回合不能成为其他角色使用牌的目标。',
            mp_sp_zhugeliang: '新一将卧龙',
            mphuoji: '火计',
            mphuoji_info: '你可一张红色牌当作【火攻】使用。你使用【火攻】令一名角色进入濒死状态后，其本次濒死不能使用【桃】和【酒】。',
            mpbazhen: '八阵',
            mpbazhen_info: '锁定技，若你的装备区里没有防具牌，则你视为装备【八卦阵】。你可获得你因【八卦阵】判定生效后的黑色判定牌。',
            mp_taishici: '新一将太史慈',
            mptianyi: '天义',
            mptianyi_info: '出牌阶段限一次，你可以和一名其他角色拼点。若你赢，你获得弃牌堆中的一张【杀】，且本回合你使用【杀】没有距离限制、可额外使用一张【杀】、使用【杀】时可额外指定一个目标。若你没赢，你获得双方的拼点牌（本回合不计入手牌上限），且本回合不能使用【杀】。',
            mp_pangde: '新一将庞德',
            mpjianchu: '鞬出',
            mpjianchu_info: '当你使用【杀】指定一名角色为目标后，你可以弃置其一张牌，若以此法弃置的牌为：非基本牌，此【杀】不可被响应；非装备牌，此【杀】伤害+1；非锦囊牌，其受到伤害后获得此【杀】。',
            mp_yanwen: '新一将颜良文丑',
            mpshuangxiong: '双雄',
            mpshuangxiong_info: '出牌阶段开始时，你可以展示一张手牌，本回合你可以将与此牌颜色不同的牌当作【决斗】使用。当你因此技能受到伤害后，你可以获得对方本次打出的所有【杀】。',
            mp_re_yuanshao: '新一将袁绍',
            mpqingchao: '倾巢',
            mpqingchao_info: '出牌阶段限一次，当你的手牌数少于2时，你可以对一名角色造成1点伤害。',
            mp_xuhuang: '新一将徐晃',
            mpjiezi: '截辎',
            mpjiezi_info: '锁定技，一名其他角色跳过摸牌阶段后，你摸一张牌。若你与其距离小于等于1，则额外摸一张牌。',
            mp_caopi: '新一将曹丕',
            mpxingshang: '行殇',
            mpxingshang_info: '一名角色死亡时，你可以获得该角色的所有牌并摸一张牌。',
            mpfangzhu: '放逐',
            mpfangzhu_info: '当你受到1点伤害后，你可以令一名其他角色选择一项：①弃置X张牌并失去1点体力；②将武将牌翻面并摸X张牌（X为你已损失体力值）。',
            mp_sunjian: '新一将孙坚',
            mpyinghun: '英魂',
            mpyinghun_info: '准备阶段，你可以令一名角色执行一项：①摸一张牌，然后弃置X张牌；②摸X张牌，然后弃置一张牌（X为你已损失体力值）。',
            mp_dongzhuo: '新一将董卓',
            mpjiuchi: '酒池',
            mpjiuchi_info: '你可以将一张♠手牌当作【酒】使用；你使用【酒】无次数限制；当你使用【酒】【杀】造成伤害后，本回合〖崩坏〗失效。',
            mproulin: '肉林',
            mproulin_info: '锁定技，你对女性角色和女性角色对你使用的【杀】需要额外使用一张【闪】响应；你对女性角色造成伤害后或女性角色对你造成伤害后，你摸一张牌。',
            mpbenghuai: '崩坏',
            mpbenghuai_info: '锁定技，结束阶段，若你的体力值不为全场最低，则你选择失去1点体力或减1点体力上限，若你选择减少体力上限，你摸两张牌。',
            mp_zhurong: '新一将祝融',
            mplieren: '烈刃',
            mplieren_info: '当你使用【杀】指定目标后，你可以与目标角色拼点：若你赢，你获得其一张牌。',
            mp_re_lusu: '新一将鲁肃',
            mphaoshi: '好施',
            mphaoshi_info: '摸牌阶段，你可以多摸两张牌，然后若你的手牌数大于5，你须将X张手牌交给一名其他角色（X为你手牌数的一半，向下取整）。',
            mp_jiaxu: '新一将贾诩',
            mpweimu: '帷幕',
            mpweimu_info: '锁定技，你不能成为黑色锦囊牌的目标；当你受到不为当前回合角色造成的伤害后，你摸两张牌。',
            mpwansha: '完杀',
            mpwansha_info: '锁定技，不处于濒死状态的其他角色不能在你的回合内使用【桃】；一名角色的濒死结算过程中，除你与其以外的其他角色非锁定技失效。',
            mpluanwu: '乱武',
            mpluanwu_info: '限定技，出牌阶段，你可令除你外的所有角色依次对与其距离最近的另一名角色使用一张【杀】，否则失去1点体力且你可以弃置其一张牌。所有角色结算完毕后，你获得本次所有打出但未造成伤害的【杀】。',
            mp_zhanghe: '新一将张郃',
            mpqiaobian: '巧变',
            mpqiaobian_info: '你可以跳过自己的一个阶段（准备阶段和结束阶段除外）。若你以此法跳过了判定阶段或弃牌阶段，则你弃置一张牌；若你以此法跳过了摸牌阶段，则你可以获得至多两名其他角色的各一张手牌；若你以此法跳过了出牌阶段，则你可以移动场上的一张牌，然后视为对其中一名角色使用【杀】。',
            mp_dengai: '新一将邓艾',
            mptuntian: '屯田',
            mptuntian_info: '当你于回合外失去牌后，或于回合内因弃置而失去基本后，你可以判定。若判定结果不为♥，则你将此牌称为“田”置于你的武将牌上；你计算与其他角色的距离时-X（X为你武将牌上“田”的数）。',
            mpzaoxian: '凿险',
            mpzaoxian_info: '觉醒技，准备阶段，若你武将牌上至少拥有三张“田”，则你减1点体力上限，将牌堆顶两张牌称为“田”置于你的武将牌上，获得技能〖急袭〗。',
            mp_jiangwei: '新一将姜维',
            mptiaoxin: '挑衅',
            mptiaoxin_info: '出牌阶段每名角色限一次，你可以选择一名其他角色，该角色需对你使用一张【杀】，否则你弃置其一张牌。',
            mpzhiji: '志继',
            mpzhiji_info: `觉醒技，每个准备阶段，若你没有手牌，你回复1点体力或摸两张牌，然后减1点体力上限，获得技能${get.poptip('mpguanxing')}。若当前回合角色不为你，你可以发动${get.poptip('mpguanxing')}。`,
            mp_liushan: '新一将刘禅',
            mpfangquan: '放权',
            mpfangquan_info: '你可跳过你的出牌阶段。若如此做，回合结束时，你可以弃置一张手牌并令一名其他角色进行一个额外的回合。其于此额外回合首次造成伤害后，你回复1点体力。',
            mpxiangle: '享乐',
            mpxiangle_info: '锁定技，当你成为一名角色使用伤害牌的目标后，该角色需弃置一张基本牌，否则此牌对你无效。',
            mp_sunce: '新一将孙策',
            mphunzi: '魂姿',
            mphunzi_info: `觉醒技，准备阶段，若你的体力值不大于2，你减1点体力上限，获得技能${get.poptip('mpyingzi')}和${get.poptip('mpyinghun')}。`,
            mp_zhangzhang: '新一将张昭张纮',
            mpzhijian: '直谏',
            mpzhijian_info: '出牌阶段，你可以将一张装备牌置于其他角色的装备区（可替换原装备），然后摸一张牌。若其因此替换装备，则其也摸一张牌。',
            mpguzheng: '固政',
            mpguzheng_info: '其他角色的弃牌阶段结束时，你可以令其获得本阶段内进入弃牌堆的牌中的一张，然后你获得剩余的牌。若你没有因此获得装备牌，则你摸两张牌。',
            mp_yanyan: '新一将严颜',
            mpjuzhan: '拒战',
            mpjuzhan_info: '转换技。准备阶段或当你成为其他角色使用【杀】的目标后，你可以摸一张牌，然后当前回合角色本回合不能对你使用牌；当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌。',
            mp_wangping: '新一将王平',
            mpfeijun: '飞军',
            mpfeijun_info: '出牌阶段限一次。你可以弃置一张牌，然后选择一项：⒈令一名手牌数大于等于你的角色交给你一张牌；⒉令一名装备区里牌数大于等于你的角色弃置一张装备牌。',
            mpbinglve: '兵略',
            mpbinglve_info: `锁定技，当你发动${get.poptip('mpfeijun')}后，若目标与你上次发动${get.poptip('mpfeijun')}指定的目标不同，则你摸两张牌。`,
            mp_sunliang: '新一将孙亮',
            mpkuizhu: '溃诛',
            mpkuizhu_info: '弃牌阶段结束后，你可以选择一项：①令至多X名角色各摸一张牌。②对一名体力值大于等于X的角色造成1点伤害（X为你此阶段弃置的牌数且至少为1）。',
            mpchezheng: '掣政',
            mpchezheng_info: '锁定技，你的出牌阶段内，攻击范围内不包含你的其他角色不能成为你使用牌的目标。出牌阶段结束时，若你本阶段使用的牌数小于等于这些角色数，则你弃置其中任意名角色各一张牌。',
            mp_wangji: '新一将王基',
            mpqizhi: '奇制',
            mpqizhi_info: '当你使用牌指定目标后，你可以弃置不是此牌目标的一名角色的一张牌。若如此做，其摸一张牌。',
            mpjinqu: '进趋',
            mpjinqu_info: `结束阶段，你可以摸三张牌，若如此做，你将手牌弃置至X张（X为你于本轮发动过${get.poptip('mpqizhi')}的次数+1）。`,
            mp_kuailiangkuaiyue: '新一将蒯良蒯越',
            mpshenshi: '审时',
            mpshenshi_info: '转换技。阳：出牌阶段限一次，你可以将一张牌交给一名其他角色，然后对其造成1点伤害，若该角色的体力值为全场最低，则你可以令一名角色将手牌摸至四张。阴：其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其任意张牌，此回合结束时，若其未全部失去这些牌，你将手牌摸至四张。',
            mp_yl_luzhi: '新一将卢植',
            mpmingren: '明任',
            mpmingren_info: '游戏开始时，你摸一张牌，然后将一张手牌称为“任”置于你的武将牌上。结束阶段，你可以用一张手牌替换“任”。',
            mpzhenliang: '贞良',
            mpzhenliang_info: '转换技。阳：出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害；阴：当你于回合外失去的牌进入弃牌堆后，若此牌与“任”类别相同，则你可以令一名角色摸两张牌。',
            mp_chendao: '新一将陈到',
            mpwanglie: '往烈',
            mpwanglie_info: '出牌阶段，你使用的第一张牌无距离限制且不能被响应。当你于出牌阶段使用牌时，你可选择一项：1.令此牌伤害+1；2.摸两张牌；若如此做，本回合你不能再使用牌。',
            mp_zhoufei: '新一将周妃',
            mpliangyin: '良姻',
            mpliangyin_info: '当有牌移至游戏外时，你可以令至多等量名角色摸一张牌；当有牌从游戏外加入任意角色的手牌时，你可以令至多等量角色弃置一张牌。',
            mp_guanqiujian: '新一将毌丘俭',
            mpzhengrong: '征荣',
            mpzhengrong_info: '当你造成或受到伤害后，你可以将伤害来源或受伤角色的一张牌称为“荣”置于你的武将牌上。',
            mphongju: '鸿举',
            mphongju_info: `觉醒技，准备阶段，若“荣”的数量大于或等于3，你减1点体力上限，将牌堆顶两张牌称为“荣”置于你的武将牌上，获得${get.poptip('mpqingce')}。`,
            mpqingce: '清侧',
            mpqingce_info: '出牌阶段，你可以获得一张“荣”，然后弃置一名角色区域里的一张牌。',
            mp_yl_yuanshu: '新一将袁术',
            mpyongsi: '庸肆',
            mpyongsi_info: '锁定技，摸牌阶段，你多摸X张牌（X为存活势力数）。弃牌阶段开始时，若你本回合：1.没有造成伤害，你将手牌摸至体力上限；2.造成伤害数超过1点，你本回合将手牌上限改为体力上限。',
            mp_zhuzhi: '新一将朱治',
            mpanguo: '安国',
            mpanguo_info: '出牌阶段限一次，你可以选择一名角色，若其：手牌数为全场最少，其摸一张牌；体力值为全场最低，其回复1点体力；装备区内牌数为全场最少，其随机使用一张装备牌。然后若该角色有未执行的效果且你满足条件，你执行之。若你与其执行了全部分支，你可以重铸任意张牌。',
            mp_sundeng: '新一将孙登',
            mpkuangbi: '匡弼',
            mpkuangbi_info: '出牌阶段开始时，你可以令一名其他角色将至多三张牌置于你的武将牌上直到此阶段结束。然后当你使用牌时，若你有与此牌颜色相同的“匡弼”牌，你移去其中一张并与其各摸一张牌，否则你随机移去一张“匡弼”牌并摸一张牌。',
            mp_zhugedan: '新一将诸葛诞',
            mpgongao: '功獒',
            mpgongao_info: '锁定技，一名角色首次进入濒死状态时，你增加1点体力上限，回复1点体力并摸一张牌。',
            mpjuyi: '举义',
            mpjuyi_info: '觉醒技，准备阶段，若你已受伤且体力上限大于场上存活角色数，你将手牌数摸至体力上限，获得技能〖崩坏〗和〖威重〗。',
            mp_liuxie: '新一将刘协',
            mptianming: '天命',
            mptianming_info: '当你成为【杀】的目标后，你可以弃置一张牌（没有可弃置的牌则跳过），然后摸两张牌。',
            mpmizhao: '密诏',
            mpmizhao_info: '出牌阶段限一次，你可以将所有手牌交给一名其他角色，令其与你选择的另一名其他角色拼点，赢的角色视为对没赢的角色使用【杀】。若平局，你获得这两名角色各一张牌。',
            mp_caojie: '新一将曹节',
            mphuimin: '惠民',
            mphuimin_info: '结束阶段，你可以摸三张牌并展示X张手牌（X为手牌数小于其体力值的角色数），然后从你指定的一名角色开始，这些角色依次选择并获得其中一张。',
            mp_zhanglu: '新一将张鲁',
            mpyishe: '义舍',
            mpyishe_info: '结束阶段，若你武将牌上的“米”少于三张，你可以摸两张牌，然后将至多两张牌称为“米”置于武将牌上；“米”移至其他区域后，若你的武将牌上没有“米”，你回复1点体力。',
            mp_zhaozhong: '新一将赵忠',
            mphuangkong: '惶恐',
            mphuangkong_info: '锁定技，当你于回合外成为【杀】或普通锦囊牌的目标后，若你的手牌数小于等于体力值，你摸两张牌。',
            mp_sp_zhaoyun: 'SP新一将赵云',
            mpchongzhen: '冲阵',
            mpchongzhen_info: '当你使用或打出【杀】或【闪】时，你可以获得对方的一张手牌。',

            // ----------------------- 台词部分 ----------------------- //
            '#ext:活动武将/audio/skill/mp1': '',
            '#ext:活动武将/audio/skill/mp2': '',
            '#ext:活动武将/audio/skill/mpyajiao1': '南征北战，誓死相随！',
            '#ext:活动武将/audio/skill/mpyajiao2': '青釭银月，谁与争锋？',
            '#ext:活动武将/audio/skill/mpfenwei1': '奋战无惧，展我军威！',
            '#ext:活动武将/audio/skill/mpfenwei2': '宁上不畏死，众将切莫迟疑！',
            '#ext:活动武将/audio/skill/mpqingjian1': '尽忠舍命，重义轻财！',
            '#ext:活动武将/audio/skill/mpqingjian2': '无功不受禄，散财以犒军。',
            '#ext:活动武将/audio/skill/mpqinxue1': '乐学善思，将勤补拙。',
            '#ext:活动武将/audio/skill/mpqinxue2': '勤学不殆，致诸实用。',
            '#ext:活动武将/audio/skill/gongxin_mp_lvmeng1': '料其图谋不轨，此战易得先机。',
            '#ext:活动武将/audio/skill/gongxin_mp_lvmeng2': '夺敌心事，摆布于股掌之间。',
            '#ext:活动武将/audio/skill/mpjiezi1': '断粮道，毁辎行。',
            '#ext:活动武将/audio/skill/mpjiezi2': '辎行千里，必有一失。',
        },
    };
    for (const i in MiNiAppkill.character) {
        if (Array.isArray(MiNiAppkill.character[i])) MiNiAppkill.character[i] = get.convertedCharacter(MiNiAppkill.character[i]);
        MiNiAppkill.character[i].trashBin ??= [];
        MiNiAppkill.character[i].dieAudios ??= [];
        MiNiAppkill.character[i].tempname ??= [];
        if (!MiNiAppkill.character[i].dieAudios.length) MiNiAppkill.character[i].dieAudios.push(i.slice('mp_'.length));
        if (!MiNiAppkill.character[i].tempname.length) MiNiAppkill.character[i].tempname.push(i.slice('mp_'.length));
        MiNiAppkill.character[i].img = `image/character/${i.slice('mp_'.length)}.jpg`;
        if (MiNiAppkill.translate[i] && !lib.translate[i + '_prefix'] && !MiNiAppkill.translate[i + '_prefix']) {
            if (MiNiAppkill.translate[i].startsWith(get.poptip('rule_mamba'))) MiNiAppkill.translate[i + '_prefix'] = get.poptip('rule_mamba');
            else if (MiNiAppkill.translate[i].startsWith('SP新一将')) MiNiAppkill.translate[i + '_prefix'] = 'SP|新一将';
            else if (MiNiAppkill.translate[i].startsWith('新一将神')) MiNiAppkill.translate[i + '_prefix'] = '新一将|神';
            else if (MiNiAppkill.translate[i].startsWith('新一将☆')) MiNiAppkill.translate[i + '_prefix'] = '新一将|☆';
            else if (MiNiAppkill.translate[i].startsWith('新一将谋')) MiNiAppkill.translate[i + '_prefix'] = '新一将|谋';
            else if (MiNiAppkill.translate[i].startsWith('新一将界')) MiNiAppkill.translate[i + '_prefix'] = '新一将|界';
            else if (MiNiAppkill.translate[i].startsWith('新一将') || MiNiAppkill.translate[i + '_ab']?.startsWith('新一将')) MiNiAppkill.translate[i + '_prefix'] = '新一将';
        }
    }
    lib.namePrefix.set('新一将', {
        getSpan: () => `${get.prefixSpan('RE')}${get.prefixSpan('将')}`,
    });
    lib.config.all.sgscharacters.push('MiNiAppkill');
    lib.translate['MiNiAppkill_character_config'] = '<span style="font-family: xingkai">新一将小程序</span>';
    return MiNiAppkill;
};

export default packs;