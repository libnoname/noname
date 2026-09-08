import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const MX_feihongyinxue = {
        name: 'MX_feihongyinxue',
        connect: true,
        characterSort: {
            MX_feihongyinxue: {
                fh_zhi: ['mx_fh_sp_bianfuren', 'mx_fh_sp_chenzhen', 'mx_fh_feiyi', 'mx_fh_luotong', 'mx_fh_sp_sunshao', 'mx_fh_sp_duyu', 'mx_fh_sp_xunchen'],
                fh_xin: ['mx_fh_wangling', 'mx_fh_sp_mifuren', 'mx_fh_zhouchu', 'mx_fh_wujing', 'mx_fh_sp_yanghu'],
                fh_ren: ['mx_fh_caizhenji', 'mx_fh_sp_huaxin', 'mx_fh_xiangchong', 'mx_fh_sp_xujing', 'mx_fh_qiaogong', 'mx_fh_sp_zhangwen', 'mx_fh_liuzhang', 'mx_fh_zhangzhongjing'],
                fh_yong: ['mx_fh_sp_wangshuang'],
                fh_yan: ['mx_fh_sp_cuiyan', 'mx_fh_sp_jiangwan', 'mx_fh_liuba', 'mx_fh_sp_lvfan'],
                fh_shen: ['mx_fh_shen_guojia', 'mx_fh_shen_xunyu', 'mx_fh_shen_taishici'],
                fh_std_sh: ['mx_fh_re_huangyueying', 'mx_fh_re_zhenji', 'mx_fh_gz_huangzhong', 'mx_fh_zhoutai', 'mx_fh_ol_sp_zhugeliang', 'mx_fh_re_taishici', 'mx_fh_yanwen', 'mx_fh_guanqiujian'],
                fh_yijiang: ['mx_fh_dc_sunziliufang', 'mx_fh_liyan', 'mx_fh_dc_huanghao', 'mx_fh_re_sundeng', 'mx_fh_xinxianying', 'mx_fh_wuxian', 'mx_fh_caojie', 'mx_fh_jikang', 'mx_fh_zhugeshang', 'mx_fh_lukai', 'mx_fh_kebineng', 'mx_fh_xin_lingtong', 'mx_fh_dc_xushu', 'mx_fh_re_liaohua', 'mx_fh_zhuzhi'],
            },
        },
        character: {
            mx_fh_sp_bianfuren: ['female', 'wei', 3, ['fh_fuding', 'fh_yuejian'], ['name:卞|null']],
            mx_fh_sp_chenzhen: ['male', 'shu', 3, ['fh_shameng']],
            mx_fh_feiyi: ['male', 'shu', 3, ['fyjianyu', 'fh_shengxi']],
            mx_fh_luotong: ['male', 'wu', 4, ['fh_minshi', 'fh_xianming']],
            mx_fh_sp_sunshao: ['male', 'wu', 3, ['fh_dingyi', 'fh_zuici']],
            mx_fh_sp_duyu: ['male', 'qun', 4, ['fh_wuku', 'fh_sanchen']],
            mx_fh_sp_xunchen: ['male', 'qun', 3, ['fh_weipo', 'fh_chenshi', 'fh_mouzhi']],
            mx_fh_wangling: ['male', 'wei', 4, ['fh_xingqi', 'fh_zifu', 'fh_mibei'], ['clan:太原王氏']],
            mx_fh_sp_mifuren: ['female', 'shu', 3, ['fh_guixiu', 'qingyu'], ['name:糜|null']],
            mx_fh_zhouchu: ['male', 'wu', 4, ['xianghai', 'fh_chuhai']],
            mx_fh_wujing: ['male', 'wu', 4, ['fh_heji', 'liubing']],
            mx_fh_sp_yanghu: ['male', 'qun', 3, ['fh_mingfa', 'fh_rongbei']],
            mx_fh_caizhenji: ['female', 'wei', 3, ['sheyi', 'fh_tianyin'], ['name:蔡|null']],
            mx_fh_sp_huaxin: ['male', 'wei', 3, ['fh_yuanqing', 'shuchen']],
            mx_fh_xiangchong: ['male', 'shu', 4, ['fh_guying', 'muzhen']],
            mx_fh_sp_xujing: ['male', 'shu', 3, ['fh_boming', 'fh_ejian']],
            mx_fh_qiaogong: ['male', 'wu', 3, ['fh_yizhu', 'luanchou']],
            mx_fh_sp_zhangwen: ['male', 'wu', 3, ['gebo', 'fh_songshu']],
            mx_fh_liuzhang: ['male', 'qun', 3, ['fh_yinge', 'fh_shiren', 'fh_juyi'], ['zhu']],
            mx_fh_zhangzhongjing: ['male', 'qun', 3, ['fh_jishi', 'fh_liaoyi', 'fh_binglun']],
            mx_fh_sp_wangshuang: ['male', 'wei', 4, ['yiyong', 'fh_shanxie']],
            mx_fh_sp_cuiyan: ['male', 'wei', 3, ['fh_yajun', 'spzundi']],
            mx_fh_sp_jiangwan: ['male', 'shu', 3, ['spzhenting', 'fh_jincui']],
            mx_fh_liuba: ['male', 'shu', 3, ['duanbi', 'fh_tongduo']],
            mx_fh_sp_lvfan: ['male', 'wu', 3, ['fh_diaodu', 'mbdiancai', 'spyanji']],
            mx_fh_shen_guojia: ['male', 'shen', 3, ['fh_shuishi', 'fh_tianyi', 'fh_sghuishi'], ['wei']],
            mx_fh_shen_xunyu: ['male', 'shen', 3, ['tianzuo', 'fh_lingce', 'fh_dinghan'], ['wei']],
            mx_fh_shen_taishici: ['male', 'shen', 4, ['dulie', 'fh_powei'], ['wu', 'name:太史|慈']],
            mx_fh_dc_sunziliufang: ['male', 'wei', 3, ['dcqinshen', 'fh_weidang'], ['name:孙|资-刘|放']],
            mx_fh_liyan: ['male', 'shu', 3, ['fh_duliang', 'fh_fulin']],
            mx_fh_dc_huanghao: ['male', 'shu', 3, ['fh_qinqing', 'huisheng', 'dccunwei']],
            mx_fh_re_sundeng: ['male', 'wu', 4, ['fh_kuangbi']],
            mx_fh_xinxianying: ['female', 'wei', 3, ['rezhongjian', 'fh_caishi']],
            mx_fh_wuxian: ['female', 'shu', 3, ['fumian', 'fh_daiyan']],
            mx_fh_caojie: ['female', 'qun', 3, ['fh_shouxi', 'fh_huimin']],
            mx_fh_jikang: ['male', 'wei', 3, ['fh_qingxian', 'fh_juexiang']],
            mx_fh_zhugeshang: ['male', 'shu', 3, ['fh_sangu', 'yizu'], ['name:诸葛|尚', 'clan:琅琊诸葛氏']],
            mx_fh_lukai: ['male', 'wu', 4, ['fh_bushi', 'lkzhongzhuang']],
            mx_fh_kebineng: ['male', 'qun', 4, ['fh_kousheng']],
            mx_fh_re_huangyueying: ['female', 'shu', 3, ['fh_jizhi', 'reqicai']],
            mx_fh_re_zhenji: ['female', 'wei', 3, ['qingguo', 'fh_luoshen']],
            mx_fh_gz_huangzhong: ['male', 'shu', 4, ['fh_liegong'], ['die:huangzhong']],
            mx_fh_zhoutai: ['male', 'wu', 4, ['fh_buqu', 'fh_fenji']],
            mx_fh_ol_sp_zhugeliang: ['male', 'shu', 3, ['bazhen', 'olhuoji', 'olkanpo', 'fh_cangzhuo'], ['name:诸葛|亮', 'clan:琅琊诸葛氏']],
            mx_fh_re_taishici: ['male', 'wu', 4, ['tianyi', 'fh_hanzhan'], ['name:太史|慈']],
            mx_fh_yanwen: ['male', 'qun', 4, ['fh_shuangxiong', 'fh_xiayong'], ['name:颜|良-文|丑']],
            mx_fh_guanqiujian: ['male', 'wei', 4, ['fh_zhengrong', 'fh_hongju'], ['name:毌丘|俭']],
            mx_fh_xin_lingtong: ['male', 'wu', 4, ['fh_xuanfeng', 'yongjin']],
            mx_fh_dc_xushu: ['male', 'shu', 4, ['bolzhuhai', 'fh_qianxin']],
            mx_fh_re_liaohua: ['male', 'shu', 4, ['fh_dangxian', 'xinfuli']],
            mx_fh_zhuzhi: ['male', 'wu', 4, ['fh_anguo']],
        },
        card: {
            fh_yinyueqiang: {
                audio: 'yinyueqiang',
                cardimage: 'yinyueqiang',
                fullskin: true,
                type: 'equip',
                subtype: 'equip1',
                distance: { attackFrom: -2 },
                ai: { basic: { equipValue: 4 } },
                skills: ['fh_yinyueqiang_skill'],
            },
        },
        skill: {
            //永久标记
            eternal_fh_tag: { charlotte: true },
            //银月枪
            fh_yinyueqiang_skill: {
                equipSkill: true,
                trigger: { global: 'phaseEnd' },
                filter(event, player) {
                    if (_status.currentPhase == player) return false;
                    if (!player.hasHistory('lose', evt => evt.hs?.length)) return false;
                    return player.hasSha() || (_status.connectMode && player.countCards('h') > 0);
                },
                direct: true,
                clearTime: true,
                content() {
                    'step 0'
                    player.chooseToUse(get.prompt('fh_yinyueqiang_skill'), { name: 'sha' }).set('aidelay', true).set('noButton', true).set('filterTarget', function (card, player, target) {
                        var targets = _status.event.targets;
                        if (!targets.includes(target) && !ui.selected.targets.some(targetx => targets.includes(target))) return false;
                        return lib.filter.filterTarget.apply(this, arguments);
                    }).set('targets', game.filterPlayer(current => current.getHistory('gain').length)).logSkill = 'fh_yinyueqiang_skill';
                    'step 1'
                    if (result.bool) game.delayx();
                },
            },
            //卞夫人
            fh_fuding: {
                audio: 'wanwei',
                trigger: { global: 'dying' },
                filter(event, player) {
                    return event.player != player && player.countCards('he');
                },
                round: 1,
                async cost(event, trigger, player) {
                    const target = trigger.player;
                    event.result = await player.chooseCard(get.prompt2(event.skill, target), 'he', [1, 5]).set('ai', cardx => {
                        const { player, target } = get.event();
                        if (get.attitude(player, target) <= 0) return 0;
                        let sum = target.countCards('hs', card => target.canSaveCard(card, target)) + target.hp;
                        if ((player.hasSkill('fh_yuejian') && !player.hasSkill('fh_yuejian_used') && !get.is.blocked('fh_yuejian', player))) sum++;
                        if (player.countCards('hs', card => target.canSaveCard(card, target)) + sum <= 0) return 0;
                        if (target.canSaveCard(cardx, target) && ui.selected.cards.filter(card => target.canSaveCard(card, target)).length + sum > 0) return 12 - get.value(cardx);
                        return 7 - get.value(cardx);
                    }).set('target', target).set('allowChooseAll', true).forResult()
                },
                logTarget: 'player',
                async content(event, trigger, player) {
                    const { cards, targets: [target] } = event;
                    await player.give(cards, target);
                    target.when('dyingAfter').filter(evt => evt == trigger).step(async () => {
                        await player.draw(cards.length);
                    });
                },
            },
            fh_yuejian: {
                audio: 'yuejian',
                mod: { maxHandcard: (player, num) => num + player.maxHp },
                locked: false,
                enable: 'chooseToUse',
                hiddenCard(player, name) {
                    if (get.type(name) == 'basic' && lib.inpile.includes(name) && !player.hasSkill('fh_yuejian_used')) return true;
                },
                filter(event, player) {
                    if (event.type == 'wuxie') return false;
                    if (player.hasSkill('fh_yuejian_used')) return false;
                    for (var i of lib.inpile) {
                        if (get.type(i) != 'basic') continue;
                        var card = { name: i, isCard: true };
                        if (event.filterCard(card, player, event)) return true;
                        if (i == 'sha') {
                            for (var j of lib.inpile_nature) {
                                card.nature = j;
                                if (event.filterCard(card, player, event)) return true;
                            }
                        }
                    }
                    return false;
                },
                chooseButton: {
                    dialog(event, player) {
                        var list = [];
                        for (var i of lib.inpile) {
                            if (get.type(i) != 'basic') continue;
                            var card = { name: i, isCard: true };
                            if (event.filterCard(card, player, event)) list.push(['基本', '', i]);
                            if (i == 'sha') {
                                for (var j of lib.inpile_nature) {
                                    card.nature = j;
                                    if (event.filterCard(card, player, event)) list.push(['基本', '', i, j]);
                                }
                            }
                        }
                        return ui.create.dialog('约俭', [list, 'vcard'], 'hidden');
                    },
                    check(button) {
                        if (button.link[2] == 'shan') return 3;
                        var player = _status.event.player;
                        if (button.link[2] == 'jiu') {
                            if (player.getUseValue({ name: 'jiu' }) <= 0) return 0;
                            if (player.countCards('h', 'sha')) return player.getUseValue({ name: 'jiu' });
                            return 0;
                        }
                        return player.getUseValue({ name: button.link[2], nature: button.link[3], isCard: true });
                    },
                    backup(links, player) {
                        return {
                            selectCard: -1,
                            filterCard: () => false,
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                isCard: true,
                            },
                            precontent() {
                                player.logSkill('fh_yuejian');
                                delete event.result.skill;
                            },
                        }
                    },
                    prompt(links, player) {
                        var name = links[0][2];
                        var nature = links[0][3];
                        return '视为使用' + (get.translation(nature) || '') + get.translation(name);
                    },
                },
                ai: {
                    order(item, player) {
                        if (player && _status.event.type == 'phase') {
                            var max = 0, add = false;
                            var list = lib.inpile.filter(name => get.type(name) == 'basic');
                            if (list.includes('sha')) add = true;
                            list = list.map(namex => { return { name: namex, isCard: true } });
                            if (add) {
                                lib.inpile_nature.forEach(naturex => list.push({ name: 'sha', nature: naturex, isCard: true }));
                            }
                            for (var card of list) {
                                if (player.getUseValue(card) > 0) {
                                    var temp = get.order(card);
                                    if (temp > max) max = temp;
                                }
                            }
                            if (max > 0) max += 0.3;
                            return max;
                        }
                        return 10;
                    },
                    respondShan: true,
                    respondSha: true,
                    skillTagFilter(player, tag, arg) {
                        if (arg == 'respond') return false;
                        return !player.hasSkill('fh_yuejian_used');
                    },
                    result: {
                        player(player) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
                group: 'fh_yuejian_count',
                //联机の痛！！！！！！
                init(player) {
                    if (!player.hasSkill('fh_yuejian_used') && player.getRoundHistory('useCard', evt => get.type(evt.card) == 'basic').length) {
                        player.addTempSkill('fh_yuejian_used', 'roundStart');
                    }
                },
                subSkill: {
                    used: { charlotte: true },
                    count: {
                        charlotte: true,
                        trigger: { player: 'useCard1' },
                        filter(event, player) {
                            return !player.hasSkill('fh_yuejian_used') && get.type(event.card) == 'basic';
                        },
                        forced: true,
                        popup: false,
                        firstDo: true,
                        content() {
                            player.addTempSkill('fh_yuejian_used', 'roundStart');
                        },
                    },
                },
            },
            //费祎
            fh_shengxi: {
                init() {
                    game.initFh_cardPile();
                    if (!get.fh_cardPile('tiaojiyanmei')) {
                        const card = game.createCard2('tiaojiyanmei', 'heart', 6);
                        game.broadcastAll(card => {
                            card.destroyed = (card, position, player, event) => {
                                if (position === 'discardPile') {
                                    game.cardsGotoSpecial(card, 'toFh_cardPile');
                                }
                                return false;
                            };
                            card.addGaintag('eternal_fh_tag');
                            _status.fh_cardPile.add(card);
                        }, card);
                        game.broadcastAll(pile => _status.fh_cardPile = pile, _status.fh_cardPile);
                        game.log(card, '已加入额外牌堆');
                    }
                },
                audio: 'shengxi_feiyi',
                trigger: { player: 'phaseJieshuBegin' },
                filter(event, player) {
                    return player.hasHistory('useCard') && !player.hasHistory('sourceDamage');
                },
                async cost(event, trigger, player) {
                    let list = get.zhinangs(), next;
                    list = list.filter(name => get.fh_cardPile(name));
                    if (list.length) {
                        next = player.chooseButton([
                            '###' + get.prompt(event.skill) + '###获得一张智囊或摸一张牌',
                            [list, 'vcard'],
                            [['摸一张牌', '取消'], 'tdnodes'],
                        ], true);
                    }
                    else {
                        next = player.chooseButton([
                            '###' + get.prompt(event.skill) + '###摸一张牌',
                            [['摸一张牌', '取消'], 'tdnodes'],
                        ], true);
                    }
                    next.set('ai', card => {
                        if (card.link[2]) return (Math.random() + 1.5);
                        if (card.link == '摸一张牌') return 1;
                        return 0;
                    });
                    const result = await next.forResult();
                    event.result = {
                        bool: result?.bool && result.links?.[0] != '取消',
                        cost_data: result?.links,
                    };
                },
                async content(event, trigger, player) {
                    const links = event.cost_data;
                    if (links[0] == '摸一张牌') player.draw();
                    else {
                        const card = get.fh_cardPile(links[0][2]);
                        if (card) await player.gain(card, 'gain2', 'fromFh_cardPile');
                    }
                },
                group: 'fh_shengxi_zhunbei',
                subfrequent: ['zhunbei'],
                subSkill: {
                    zhunbei: {
                        audio: 'shengxi_feiyi',
                        trigger: { player: 'phaseZhunbeiBegin' },
                        filter(event, player) {
                            return get.fh_cardPile('tiaojiyanmei');
                        },
                        prompt2: '从额外牌堆中获得一张【调剂盐梅】',
                        frequent: true,
                        async content(event, trigger, player) {
                            const card = get.fh_cardPile('tiaojiyanmei');
                            if (card) await player.gain(card, 'gain2', 'fromFh_cardPile');
                        },
                    }
                },
            },
            //陈震
            fh_shameng: {
                audio: 'shameng',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.countCards('h');
                },
                filterTarget(card, player, target) {
                    return target != player && target.countCards('h');
                },
                filterCard: true,
                selectCard: [1, 2],
                complexCard: true,
                check(card) {
                    var player = _status.event.player;
                    if (ui.selected.cards.some(cardx => get.suit(cardx) == get.suit(card))) return 4 - get.value(card);
                    return 8 - get.value(card);
                },
                usable: 1,
                delay: false,
                discard: false,
                lose: false,
                async content(event, trigger, player) {
                    var target = event.target;
                    player.showCards(event.cards, get.translation(player) + '发动了【歃盟】');
                    var result = await target.chooseCard('歃盟：展示至多两张牌', [1, 2], true).set('ai', card => {
                        if (ui.selected.cards.some(cardx => get.type2(cardx) == get.type2(card))) return 4 - get.value(card);
                        return 8 - get.value(card);
                    }).set('allowChooseAll', true).forResult();
                    if (result.bool) {
                        target.showCards(result.cards, get.translation(target) + '【歃盟】展示');
                        var cards = [];
                        cards.addArray(event.cards);
                        cards.addArray(result.cards);
                        var suits = cards.reduce((list, card) => list.add(get.suit(card)), []).length;
                        var types = cards.reduce((list, card) => list.add(get.type2(card)), []).length;
                        var result2 = await player.chooseBool('是否弃置' + get.translation(cards) + '？', '若如此做，你摸' + get.cnNumber(suits) + '张牌，' + get.translation(target) + '摸' + get.cnNumber(types) + '张牌').set('choice', cards.length <= suits + types).forResult();
                        if (result2.bool) {
                            await game.loseAsync({
                                lose_list: [
                                    [player, event.cards],
                                    [target, result.cards]
                                ],
                                discarder: player,
                            }).setContent('discardMultiple');
                            await game.delayx();
                            await player.draw(suits, 'nodelay');
                            await target.draw(types);
                        }
                    }
                },
                ai: {
                    order: 7,
                    result: { target: (player, target) => Math.min(2, target.countCards('h')) },
                },
            },
            //骆统
            fh_minshi: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'qinzheng',
                enable: 'phaseUse',
                filter(event, player) {
                    return _status.fh_cardPile.some(card => get.type(card) == 'basic') && game.hasPlayer(target => target.countCards('h') < target.getHp());
                },
                usable: 1,
                async content(event, trigger, player) {
                    var map = [];
                    var targets = game.filterPlayer(target => target.countCards('h') < target.getHp());
                    player.line(targets);
                    var cards = _status.fh_cardPile.filter(card => get.type(card) == 'basic');
                    var num = Math.min(cards.length, 3, targets.length);
                    while (num > 0) {
                        num--;
                        var result = await player.chooseButton(['悯施：请选择交出的牌', cards]).set('ai', button => {
                            var player = _status.event.player, targets = _status.event.targets;
                            if (targets.some(target => get.attitude(player, target) > 0)) return get.value(button.link);
                            return 0;
                        }).set('targets', targets).forResult();
                        if (result.bool) {
                            var result2 = await player.chooseTarget('悯施：请选择' + get.translation(result.links) + '交出的角色', true, (card, player, target) => _status.event.targets.includes(target)).set('ai', target => {
                                var player = _status.event.player, targets = _status.event.targets;
                                var num = 1;
                                if (!_status.event.gained.includes(target)) num = 3;
                                return Math.sign(get.attitude(player, target)) * num;
                            }).set('targets', targets).set('gained', map).forResult();
                            if (result2.bool) {
                                var target = result2.targets[0];
                                map.add(target);
                                cards.removeArray(result.links);
                                await target.gain(result.links, 'gain2', 'fromFh_cardPile');
                            }
                            else break;
                        }
                        else break;
                    }
                    var sum = targets.length - map.length;
                    if (sum > 0) await player.loseHp(sum);
                },
                ai: {
                    order: 7,
                    result: {
                        player(player, target) {
                            var targets = game.filterPlayer(target => target.countCards('h') < target.getHp());
                            var cards = _status.fh_cardPile.filter(card => get.type(card) == 'basic');
                            var num = Math.min(3, cards.length, targets.filter(targetx => get.attitude(player, targetx) > 0).length);
                            if (player.hp - (targets.length - num) > 2) return 1;
                            return 0;
                        },
                    },
                },
            },
            fh_xianming: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'qinzheng',
                trigger: { global: ['gainAfter', 'loseAsyncAfter', 'equipAfter', 'addToExpansionAfter', 'addJudgeAfter', 'cardsGotoSpecialAfter'] },
                filter(event, player) {
                    if (get.fh_cardPile(card => get.type(card) == 'basic')) return false;
                    if (event.name === 'equip') return event.card.hasGaintag('eternal_fh_tag') && get.type(event.card) == 'basic';
                    if (event.getg) return game.hasPlayer(target => event.getg(target).some(card => card.hasGaintag('eternal_fh_tag') && get.type(card) == 'basic'));
                    return event.cards.some(card => card.hasGaintag('eternal_fh_tag') && get.type(card) == 'basic');
                },
                usable: 1,
                frequent: true,
                content() {
                    player.draw(2);
                    player.recover();
                },
            },
            //孙邵
            fh_dingyi: {
                audio: 'mjdingyi',
                trigger: { global: 'roundStart' },
                frequent: true,
                async content(event, trigger, player) {
                    await player.draw();
                    if (game.hasPlayer(target => !target.getExpansions('fh_dingyi_buff').length)) {
                        var suits = game.filterPlayer2().reduce((list, target) => list.addArray(target.getExpansions('fh_dingyi_buff').reduce((list, card) => list.add(get.suit(card)), [])), []);
                        if (player.countCards('he', card => !suits.includes(get.suit(card)))) {
                            var result = await player.chooseCardTarget({
                                prompt: '将一张场上未有的“定仪”牌花色的牌置于一名没有“定仪”牌的角色的武将牌上',
                                prompt2: '<span class="text center">' +
                                    '根据“定仪”牌花色将获得对应效果：' +
                                    '<br>♥：每回合首次脱离濒死状态后回复2点体力' +
                                    '<br>♦：摸牌阶段额外摸两张牌' +
                                    '<br>♠：手牌上限+4' +
                                    '<br>♣：使用牌无距离限制' +
                                    '</span>',
                                forced: true,
                                suits: suits,
                                position: 'he',
                                filterCard(card, player) {
                                    return !_status.event.suits.includes(get.suit(card));
                                },
                                filterTarget(card, player, target) {
                                    return !target.getExpansions('fh_dingyi_buff').length;
                                },
                                ai1(card) {
                                    var player = _status.event.player, num = ['diamond', 'club', 'heart', 'spade'].indexOf(get.suit(card)) + 1;
                                    if (game.hasPlayer(target => get.attitude(player, target) > 0)) return num;
                                    return 1 / num;
                                },
                                ai2(target) {
                                    var player = _status.event.player;
                                    return get.attitude(player, target);
                                }
                            }).forResult();
                            if (result.bool) {
                                var target = result.targets[0];
                                var cards = result.cards;
                                player.line(target);
                                target.addSkill('fh_dingyi_buff');
                                const next = target.addToExpansion(cards, player, 'give')
                                next.gaintag.add('fh_dingyi_buff');
                                await next;
                            }
                        }
                    }
                },
                subSkill: {
                    buff: {
                        charlotte: true,
                        mod: {
                            maxHandcard(player, num) {
                                if (!game.hasPlayer(target => !target.hasSkill('fh_dingyi'))) return;
                                var card = player.getExpansions('fh_dingyi_buff')[0];
                                if (card && get.suit(card) == 'spade') return num + 4;
                            },
                            targetInRange(card, player) {
                                if (!game.hasPlayer(target => !target.hasSkill('fh_dingyi'))) return;
                                var card = player.getExpansions('fh_dingyi_buff')[0];
                                if (card && get.suit(card) == 'club') return true;
                            },
                        },
                        trigger: { player: ['phaseDrawBegin2', 'dyingAfter'] },
                        filter(event, player) {
                            if (!game.hasPlayer(target => !target.hasSkill('fh_dingyi'))) return false;
                            var card = player.getExpansions('fh_dingyi_buff')[0];
                            if (!card) return false;
                            if (event.name == 'phaseDraw') return !event.numFixed && get.suit(card) == 'diamond';
                            return game.getGlobalHistory('everything', evt => evt.name == 'dying' && evt.player == player).indexOf(event) == 0 && get.suit(card) == 'heart';
                        },
                        forced: true,
                        content() {
                            if (trigger.name == 'phaseDraw') trigger.num += 2;
                            else player.recover(2);
                        },
                        intro: {
                            content: 'expansion',
                            markcount: 'expansion',
                        },
                        onremove(player, skill) {
                            var cards = player.getExpansions(skill);
                            if (cards.length) player.loseToDiscardpile(cards);
                        },
                    },
                },
            },
            fh_zuici: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'zuici',
                trigger: { player: 'damageEnd' },
                filter(event, player) {
                    return game.hasPlayer(target => target.getExpansions('fh_dingyi_buff').length);
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt(event.skill), '获得一名角色的“定仪”牌，然后选择一个智囊令其获得', (card, player, target) => target.getExpansions('fh_dingyi_buff').length).set('ai', target => {
                        const player = get.player();
                        if (!get.zhinangs().some(name => get.fh_cardPile(name))) return -get.attitude(player, target);
                        return get.attitude(player, target);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const cards = target.getExpansions('fh_dingyi_buff');
                    if (cards.length) await player.gain(cards, target, 'give');
                    if (get.zhinangs().some(name => get.fh_cardPile(name))) {
                        const result = await player.chooseButton(['罪辞：请选择令' + get.translation(target) + '获得的智囊', [get.zhinangs().filter(name => get.fh_cardPile(name)), 'vcard']]).set('ai', button => 1 + Math.random()).forResult();
                        if (result?.bool) {
                            const card = get.fh_cardPile(result.links[0][2]);
                            if (card) await target.gain(card, 'gain2', 'fromFh_cardPile');
                        }
                    }
                },
            },
            //杜预
            fh_wuku: {
                audio: 'spwuku',
                trigger: {
                    player: 'useCard',
                    global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                },
                filter(event, player) {
                    if (player.countMark('fh_wuku') >= 3) return false;
                    if (event.name == 'useCard') return get.type(event.card) == 'equip';
                    return game.hasPlayer2(current => {
                        if (current == player) return false;
                        var evt = event.getl(current);
                        return evt?.player == current && evt.es?.length;
                    });
                },
                forced: true,
                preHidden: true,
                content() {
                    var num = 1;
                    if (trigger.name != 'useCard') {
                        num--;
                        game.filterPlayer2(target => target != player).forEach(current => {
                            var evt = trigger.getl(current);
                            if (evt?.player == current && evt.es?.length) num += evt.es.length;
                        });
                    }
                    num = Math.min(num, 3 - player.countMark('fh_wuku'));
                    player.addMark('fh_wuku', num);
                },
                marktext: '库',
                intro: { content: 'mark' },
                ai: { combo: 'fh_sanchen' },
            },
            fh_sanchen: {
                audio: 'spsanchen',
                trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
                filter(event, player) {
                    return player.countMark('fh_wuku') >= 3;
                },
                forced: true,
                juexingji: true,
                skillAnimation: true,
                animationColor: 'gray',
                content() {
                    'step 0'
                    player.awakenSkill('fh_sanchen');
                    player.gainMaxHp();
                    player.recover();
                    'step 1'
                    player.addSkills('fh_miewu');
                },
                ai: { combo: 'fh_wuku' },
                derivation: 'fh_miewu',
            },
            fh_miewu: {
                hiddenCard(player, name) {
                    if (!lib.inpile.includes(name)) return false;
                    var type = get.type(name);
                    return (type == 'basic' || type == 'trick') && player.countMark('fh_wuku') > 0 && player.countCards('she') > 0 && !player.getStorage('fh_miewu_used').includes(name);
                },
                audio: 'spmiewu',
                enable: ['chooseToUse', 'chooseToRespond'],
                filter(event, player) {
                    if (!player.countMark('fh_wuku') || !player.countCards('hes')) return false;
                    for (var name of lib.inpile) {
                        if (player.getStorage('fh_miewu_used').includes(name)) continue;
                        var type = get.type(name);
                        if (type == 'basic' || type == 'trick') {
                            if (event.filterCard(get.autoViewAs({ name: name }, 'unsure'), player, event)) return true;
                            if (name == 'sha') {
                                for (var j of lib.inpile_nature) {
                                    if (event.filterCard(get.autoViewAs({ name: name, nature: j }, 'unsure'), player, event)) return true;
                                }
                            }
                        }
                    }
                    return false;
                },
                chooseButton: {
                    dialog(event, player) {
                        var list = [];
                        for (var name of lib.inpile) {
                            if (player.getStorage('fh_miewu_used').includes(name)) continue;
                            var type = get.type(name);
                            if (!(type == 'basic' || type == 'trick')) continue;
                            if (event.filterCard(get.autoViewAs({ name: name }, 'unsure'), player, event)) list.push([get.translation(get.type(name)), '', name]);
                            if (name == 'sha') {
                                for (var j of lib.inpile_nature) {
                                    if (event.filterCard(get.autoViewAs({ name: name, nature: j }, 'unsure'), player, event)) list.push(['基本', '', 'sha', j]);
                                }
                            }
                        }
                        return ui.create.dialog('灭吴', [list, 'vcard']);
                    },
                    filter(button, player) {
                        return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                    },
                    check(button) {
                        if (_status.event.getParent().type != 'phase') return 1;
                        var player = _status.event.player;
                        if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].includes(button.link[2])) return 0;
                        return player.getUseValue({ name: button.link[2], nature: button.link[3] });
                    },
                    backup(links, player) {
                        return {
                            filterCard: true,
                            check(card) {
                                return 8 - get.value(card);
                            },
                            position: 'hes',
                            viewAs: { name: links[0][2], nature: links[0][3] },
                            precontent() {
                                player.logSkill('fh_miewu');
                                player.removeMark('fh_wuku', 1);
                                player.addTempSkill('fh_miewu_used');
                                player.markAuto('fh_miewu_used', [event.result.card.name]);
                            },
                        }
                    },
                    prompt(links, player) {
                        return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                    }
                },
                ai: {
                    combo: 'fh_wuku',
                    fireAttack: true,
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter(player, tag, arg) {
                        if (!player.countMark('fh_wuku') || !player.countCards('hes')) return false;
                        var storage = player.getStorage('fh_miewu_used');
                        if (tag == 'fireAttack' && !storage.includes('sha') && !storage.includes('huogong')) return false;
                        if (tag == 'respondSha' && !storage.includes('sha')) return false;
                        if (tag == 'respondShan' && !storage.includes('shan')) return false;
                    },
                    order(item, player) {
                        if (player && _status.event.type == 'phase') {
                            var max = 0, add = false;
                            var types = ['basic', 'trick'];
                            var list = lib.inpile.filter(name => types.includes(get.type(name)) && !player.getStorage('fh_miewu_used').includes(name));
                            if (list.includes('sha')) add = true;
                            list = list.map(namex => { return { name: namex } });
                            if (add) lib.inpile_nature.forEach(naturex => list.push({ name: 'sha', nature: naturex }));
                            for (var card of list) {
                                if (player.getUseValue(card) > 0) {
                                    var temp = get.order(card);
                                    if (temp > max) max = temp;
                                }
                            }
                            if (max > 0) max += 0.3;
                            return max;
                        }
                        return 1;
                    },
                    result: {
                        player(player) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
                subSkill: { used: { charlotte: true, onremove: true } },
            },
            //荀谌
            fh_weipo: {
                init() {
                    game.initFh_cardPile();
                    if (!get.fh_cardPile('binglinchengxiax')) {
                        const card = game.createCard2('binglinchengxiax', 'spade', 7);
                        game.broadcastAll(card => {
                            card.destroyed = (card, position, player, event) => {
                                if (position === 'discardPile') {
                                    game.cardsGotoSpecial(card, 'toFh_cardPile');
                                }
                                return false;
                            };
                            card.addGaintag('eternal_fh_tag');
                            _status.fh_cardPile.add(card);
                        }, card);
                        game.broadcastAll(pile => _status.fh_cardPile = pile, _status.fh_cardPile);
                        game.log(card, '已加入额外牌堆');
                    }
                },
                audio: 'mjweipo',
                enable: 'phaseUse',
                filter(event, player) {
                    return game.hasPlayer(target => lib.skill.fh_weipo.filterTarget(null, player, target));
                },
                filterTarget(card, player, target) {
                    return target != player && target.countCards('hej', card => get.position(card) == 'h' || lib.filter.cardDiscardable(card, player));
                },
                usable: 1,
                async content(event, trigger, player) {
                    const target = event.target;
                    const num = target.getCards('hej', card => lib.filter.cardDiscardable(card, player)).reduce((list, card) => list.add(get.position(card)), []).length;
                    await player.discardPlayerCard(target, 'hej', num, true).set('filterButton', button => {
                        return !ui.selected.buttons.some(but => get.position(but.link) == get.position(button.link));
                    });
                    let cards = ['binglinchengxiax'].addArray(get.zhinangs());
                    cards = cards.filter(name => get.fh_cardPile(name));
                    if (cards.length) {
                        const result = await player.chooseButton(['危迫：请选择令' + get.translation(target) + '获得的牌', [cards, 'vcard'], true]).set('ai', button => 1 + Math.random()).forResult();
                        if (result?.bool) {
                            const card = get.fh_cardPile(result.links[0][2]);
                            if (card) await target.gain(card, 'gain2', 'fromFh_cardPile');
                        }
                    }
                },
                ai: {
                    order(item, player) {
                        return get.order({ name: 'guohe' }) + 0.3;
                    },
                    result: {
                        target(player, target) {
                            if (target.countCards('j')) return 4;
                            if (target.countCards('h') && target.countCards('e')) return -3;
                            if (target.countCards('h') && !target.countCards('e')) return 2;
                            return -1;
                        },
                    },
                },
            },
            fh_chenshi: {
                audio: 'mjchenshi',
                global: ['fh_chenshi_player', 'fh_chenshi_target'],
                ai: { combo: 'fh_weipo' },
                subSkill: {
                    player: {
                        trigger: { player: 'useCardToPlayered' },
                        filter(event, player) {
                            if (!event.card || event.card.name != 'binglinchengxiax' || !event.isFirstTarget) return false;
                            return player.countCards('he') > 0 && game.hasPlayer(function (current) {
                                return current != player && current.hasSkill('fh_chenshi');
                            });
                        },
                        async cost(event, trigger, player) {
                            const list = game.filterPlayer(function (current) {
                                return current != player && current.hasSkill('fh_chenshi');
                            });
                            event.result = await player.chooseCardTarget({
                                prompt: '是否交给' + get.translation(list) + (list.length > 1 ? '中的一人' : '') + '一张牌，观看牌堆顶三张牌并将其中任意张牌置于弃牌堆？',
                                filterCard: true,
                                position: 'he',
                                filterTarget(card, player, target) {
                                    return _status.event.list.includes(target);
                                },
                                list: list,
                                selectTarget: list.length > 1 ? 1 : -1,
                                goon: (() => {
                                    for (var i of list) {
                                        if (get.attitude(player, i) > 0) return 1;
                                        return -1;
                                    }
                                })(),
                                ai1(card) {
                                    if (_status.event.goon > 0) return 7 - get.value(card);
                                    return 0.01 - get.value(card);
                                },
                                ai2(target) {
                                    const card = ui.selected.cards[0];
                                    return get.value(card, target) * get.attitude(_status.event.player, target);
                                },
                            }).forResult();
                        },
                        popup: false,
                        async content(event, trigger, player) {
                            const { targets: [target] } = event;
                            target.logSkill('fh_chenshi');
                            player.line(target, 'green');
                            await player.give(event.cards, target);
                            trigger.getParent().fh_chenshi_ai = true;
                            const cards = get.cards(3, true);
                            const result = await player.chooseButton(['陈势：请选择弃置的牌', cards], [1, cards.length], true).set('ai', function (button) {
                                var eff = Math.sign(_status.event.effect);
                                switch (eff) {
                                    case 0:
                                        return -0.5 + Math.random();
                                        break;
                                    case 1:
                                        if (button.link.name != 'sha') return 1;
                                        return 0;
                                }
                            }).set('effect', get.effect(trigger.target, trigger.card, trigger.player, player)).set('allowChooseAll', true).forResult();
                            if (result?.bool) {
                                player.$throw(result.links, 1000);
                                await game.cardsDiscard(result.links);
                                await game.delayx();
                            }
                        },
                    },
                    target: {
                        trigger: { target: 'useCardToTargeted' },
                        filter(event, player) {
                            if (!event.card || event.card.name != 'binglinchengxiax') return false;
                            return player.countCards('he') > 0 && game.hasPlayer(function (current) {
                                return current != player && current.hasSkill('fh_chenshi');
                            });
                        },
                        async cost(event, trigger, player) {
                            const list = game.filterPlayer(function (current) {
                                return current != player && current.hasSkill('fh_chenshi');
                            });
                            event.result = await player.chooseCardTarget({
                                prompt: '是否交给' + get.translation(list) + (list.length > 1 ? '中的一人' : '') + '一张牌，观看牌堆顶三张牌并将其中任意张牌置于弃牌堆？',
                                filterCard: true,
                                position: 'he',
                                filterTarget(card, player, target) {
                                    return _status.event.list.includes(target);
                                },
                                list: list,
                                selectTarget: list.length > 1 ? 1 : -1,
                                goon: (() => {
                                    for (var i of list) {
                                        if (get.attitude(player, i) > 0) return 1;
                                        return -1;
                                    }
                                })(),
                                ai1(card) {
                                    if (_status.event.goon > 0) return 7 - get.value(card);
                                    return 0.01 - get.value(card);
                                },
                                ai2(target) {
                                    const card = ui.selected.cards[0];
                                    return get.value(card, target) * get.attitude(_status.event.player, target);
                                },
                            }).forResult();
                        },
                        popup: false,
                        async content(event, trigger, player) {
                            const { targets: [target] } = event;
                            target.logSkill('fh_chenshi');
                            player.line(target, 'green');
                            await player.give(event.cards, target);
                            const cards = get.cards(3, true);
                            const result = await player.chooseButton(['陈势：请选择弃置的牌', cards], [1, cards.length], true).set('ai', function (button) {
                                var eff = Math.sign(_status.event.effect);
                                switch (eff) {
                                    case 0:
                                        return -0.5 + Math.random();
                                        break;
                                    case 1:
                                        if (button.link.name != 'sha') return 1;
                                        return 0;
                                }
                            }).set('effect', get.effect(trigger.target, trigger.card, trigger.player, player)).set('allowChooseAll', true).forResult();
                            if (result?.bool) {
                                player.$throw(result.links, 1000);
                                await game.cardsDiscard(result.links);
                                await game.delayx();
                            }
                        },
                    },
                },
            },
            fh_mouzhi: {
                audio: 'mjmouzhi',
                trigger: { player: 'damageBegin2' },
                filter(event, player) {
                    if (event.getParent().type != 'card' || get.suit(event.card) == 'none') return false;
                    return player.getHistory('damage', evt => evt.getParent().type == 'card' && get.suit(evt.card) == get.suit(event.card)).length;
                },
                forced: true,
                content() {
                    trigger.cancel();
                },
                ai: {
                    effect: {
                        target: (card, player, target) => {
                            if (typeof card === 'object' && get.tag(card, 'damage')) {
                                var suit = get.suit(card);
                                if (suit === 'none') return;
                                var history = target.getHistory('damage');
                                if (history.some(evt => evt.getParent().type == 'card' && get.suit(evt.card) == suit)) return 'zeroplayertarget';
                            }
                        },
                    },
                },
            },
            //王凌
            fh_xingqi: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'xingqi',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    return get.type(event.card) != 'delay' && _status.fh_cardPile.some(card => card.name == event.card.name);
                },
                frequent: true,
                content() {
                    player.addToExpansion(get.fh_cardPile(trigger.card.name), 'gain2', 'fromFh_cardPile').gaintag.add(event.name);
                },
                marktext: '备',
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                onremove(player, skill) {
                    var cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                group: 'fh_xingqi_gain',
                subSkill: {
                    gain: {
                        audio: 'xingqi',
                        trigger: { player: 'phaseJieshuBegin' },
                        filter(event, player) {
                            return player.getExpansions('fh_xingqi').length > 0;
                        },
                        async cost(event, trigger, player) {
                            player.removeSkill('fh_mibei_mark');
                            const result = await player.chooseButton(['星启：是否获得一张牌？', player.getExpansions('fh_xingqi')]).set('ai', button => {
                                const player = get.player();
                                return get.value(button.link, player) * player.getUseValue(button.link);
                            }).forResult();;
                            event.result = {
                                bool: result?.bool,
                                cost_data: result?.links,
                            };
                        },
                        async content(event, trigger, player) {
                            await player.gain(event.cost_data, 'gain2');
                        },
                    },
                },
            },
            fh_zifu: {
                audio: 'zifu',
                trigger: { player: 'phaseUseEnd' },
                filter(event, player) {
                    return player.getExpansions('fh_xingqi').length > 0 && !player.hasHistory('useCard', evt => evt.getParent('phaseUse') == event);
                },
                forced: true,
                content() {
                    lib.skill.fh_xingqi.onremove(player, 'fh_xingqi');
                    player.addTempSkill('xinzifu_limit');
                    player.addMark('xinzifu_limit', 1, false);
                },
                ai: {
                    neg: true,
                    combo: 'fh_xingqi',
                },
            },
            fh_mibei: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'mibei',
                trigger: { player: 'useCardAfter' },
                dutySkill: true,
                filter(event, player) {
                    if (!player.getExpansions('fh_xingqi').length) return false;
                    var map = { basic: 0, trick: 0, equip: 0 };
                    for (var i of player.getExpansions('fh_xingqi')) {
                        var type = get.type(i);
                        if (typeof map[type] == 'number') map[type]++;
                    }
                    for (var i in map) {
                        if (map[i] < 2) return false;
                    }
                    return true;
                },
                forced: true,
                locked: false,
                popup: false,
                content() {
                    'step 0'
                    player.logSkill('twmibei_achieve');
                    game.log(player, '成功完成使命');
                    player.awakenSkill('fh_mibei');
                    var list = ['basic', 'equip', 'trick'], cards = [];
                    for (var i of list) {
                        var card = get.fh_cardPile(card => get.type(card) == i);
                        if (card) cards.push(card);
                    }
                    if (cards.length) player.gain(cards, 'gain2', 'fromFh_cardPile');
                    'step 1'
                    player.addSkills('fh_mouli');
                },
                group: ['fh_mibei_fail', 'fh_mibei_silent'],
                derivation: 'fh_mouli',
                subSkill: {
                    silent: {
                        charlotte: true,
                        trigger: { player: 'phaseZhunbeiBegin' },
                        silent: true,
                        lastDo: true,
                        filter(event, player) {
                            return !player.getExpansions('fh_xingqi').length;
                        },
                        content() {
                            player.addTempSkill('fh_mibei_mark');
                        },
                    },
                    mark: { charlotte: true },
                    fail: {
                        audio: 'mibei2',
                        trigger: { player: 'phaseJieshuBegin' },
                        filter(event, player) {
                            return !player.getExpansions('fh_xingqi').length && player.hasSkill('fh_mibei_mark');
                        },
                        forced: true,
                        content() {
                            game.log(player, '使命失败');
                            player.awakenSkill('fh_mibei');
                            player.loseMaxHp();
                        },
                    },
                },
            },
            fh_mouli: {
                audio: 'mouli',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.getExpansions('fh_xingqi').length > 0;
                },
                filterTarget: lib.filter.notMe,
                usable: 1,
                content() {
                    'step 0'
                    target.chooseButton(['谋立：是否获得一张牌？', player.getExpansions('fh_xingqi')], true).set('ai', button => {
                        var player = _status.event.player;
                        return get.value(button.link, player);
                    });
                    'step 1'
                    if (result.bool) target.gain(result.links, 'gain2');
                },
                ai: {
                    combo: 'fh_xingqi',
                    order: 1,
                    result: {
                        target(player, target) {
                            if (target.hasSkillTag('nogain')) return 0;
                            return 1;
                        },
                    },
                },
            },
            //糜夫人
            fh_guixiu: {
                audio: 'xinguixiu',
                trigger: { player: 'phaseJieshuBegin' },
                filter(event, player) {
                    return player.countCards('h') < player.getHp() || player.isDamaged();
                },
                async cost(event, trigger, player) {
                    let list = [], str = '';
                    const num = player.getHp() - player.countCards('h');
                    if (num > 0) {
                        list.push('摸牌');
                        str += '摸' + get.cnNumber(num) + '张牌';
                        if (player.isDamaged()) str += '或';
                    }
                    if (player.isDamaged()) {
                        list.push('回血');
                        str += '回复1点体力';
                    }
                    const result = await player.chooseControl(list, 'cancel2').set('prompt', get.prompt(event.skill)).set('prompt2', str).set('ai', () => {
                        const player = _status.event.player;
                        const controls = _status.event.controls.slice().remove('cancel2');
                        if (controls.length == 1) return controls[0];
                        return get.effect(player, { name: 'wuzhong' }, player, player) * (_status.event.num) / 2 >= get.recoverEffect(player, player, player) ? '摸牌' : '回血';
                    }).set('num', num).forResult()
                    event.result = {
                        bool: result?.control != 'cancel2',
                        cost_data: result?.control,
                    };
                },
                async content(event, trigger, player) {
                    const { cost_data } = event;
                    if (cost_data == '摸牌') await player.drawTo(player.getHp());
                    else await player.recover();
                },
            },
            //周处
            fh_chuhai: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'chuhai',
                dutySkill: true,
                locked: true,
                group: ['fh_chuhai_add', 'fh_chuhai_achieve', 'fh_chuhai_fail', 'fh_chuhai_chuhai'],
                derivation: 'zhangming',
                subSkill: {
                    chuhai: {
                        audio: ['chuhai', 2],
                        inherit: 'chuhai',
                        prompt: '与一名其他角色进行拼点',
                        content() {
                            'step 0'
                            player.draw();
                            'step 1'
                            if (player.canCompare(target)) player.chooseToCompare(target);
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                player.storage.fh_chuhai_buff = target;
                                player.addTempSkill('fh_chuhai_buff', { player: 'phaseUseAfter' });
                                if (target.countCards('h') > 0) {
                                    player.viewHandcards(target);
                                    var types = [], cards = [], hs = target.getCards('h');
                                    for (var i of hs) {
                                        types.add(get.type2(i, target));
                                    }
                                    for (var i of types) {
                                        var card = get.fh_cardPile(card => get.type2(card) == i);
                                        if (card) cards.push(card);
                                    }
                                    if (cards.length) player.gain(cards, 'gain2', 'fromFh_cardPile');
                                }
                            }
                        },
                    },
                    add: {
                        charlotte: true,
                        trigger: { player: 'compare' },
                        filter(event, player) {
                            var list = Array.from({ length: 5 }).map((_, i) => i + 1);
                            return event.getParent().name == 'fh_chuhai_chuhai' && event.num1 < 13 && list.reduce((sum, i) => sum += player.countEquipableSlot('equip' + i), 0) > 0;
                        },
                        forced: true,
                        popup: false,
                        content() {
                            var list = Array.from({ length: 5 }).map((_, i) => i + 1);
                            var num = list.reduce((sum, i) => sum += player.countEquipableSlot('equip' + i), 0);
                            game.log(player, '的拼点牌点数+', num);
                            trigger.num1 = Math.min(13, trigger.num1 + num);
                        },
                    },
                    achieve: {
                        audio: ['chuhai', 2],
                        trigger: { player: 'equipAfter' },
                        filter(event, player) {
                            return player.countCards('e') > 2;
                        },
                        forced: true,
                        skillAnimation: true,
                        animationColor: 'wood',
                        content() {
                            player.awakenSkill('fh_chuhai');
                            game.log(player, '成功完成使命');
                            if (player.isDamaged()) player.recover(player.maxHp - player.hp);
                            player.changeSkills(['zhangming'], ['xianghai']);
                        },
                    },
                    fail: {
                        audio: 'chuhai3',
                        trigger: { player: 'chooseToCompareAfter' },
                        filter(event, player) {
                            return event.getParent().name == 'fh_chuhai_chuhai' && event.num1 < 7 && !event.result.bool;
                        },
                        forced: true,
                        content() {
                            player.awakenSkill('fh_chuhai');
                            game.log(player, '使命失败');
                        },
                    },
                    buff: {
                        audio: 'chuhai',
                        inherit: 'chuhai2',
                        filter(event, player) {
                            if (event.player != player.storage.fh_chuhai_buff) return false;
                            for (var i = 1; i < 6; i++) {
                                if (player.hasEmptySlot(i) && get.fh_cardPile(card => get.type(card) == 'equip' && get.subtype(card) == 'equip' + i && player.canEquip(card))) return true;
                            }
                            return false;
                        },
                        content() {
                            for (var i = 1; i < 6; i++) {
                                if (player.hasEmptySlot(i)) {
                                    var card = get.fh_cardPile(card => get.type(card) == 'equip' && get.subtype(card) == 'equip' + i && player.canEquip(card));
                                    if (card) {
                                        player.$gain2(card);
                                        game.delayx();
                                        player.equip(card);
                                        break;
                                    }
                                }
                            }
                        },
                    },
                },
            },
            //昊京
            fh_heji: {
                audio: 'heji',
                inherit: 'heji',
                content() {
                    player.chooseToUse(function (card, player, event) {
                        var name = get.name(card);
                        if (name != 'sha' && name != 'juedou') return false;
                        return lib.filter.cardEnabled.apply(this, arguments);
                    }, '合击：是否对' + get.translation(trigger.targets[0]) + '使用一张【杀】或【决斗】？').set('logSkill', 'fh_heji').set('complexSelect', true).set('filterTarget', function (card, player, target) {
                        if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
                        return lib.filter.targetEnabled.apply(this, arguments);
                    }).set('sourcex', trigger.targets[0]).set('addCount', false);
                },
                group: 'fh_heji_gain',
                subSkill: {
                    gain: {
                        charlotte: true,
                        trigger: { player: 'useCard' },
                        filter(event, player) {
                            return event.card.isCard && event.getParent(2).name == 'fh_heji';
                        },
                        forced: true,
                        popup: false,
                        content() {
                            player.draw();
                        },
                    },
                },
            },
            //羊祜
            fh_mingfa: {
                audio: 'mingfa',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return player.countCards('h') > 0 && game.hasPlayer(current => player.canCompare(current));
                },
                async cost(event, trigger, player) {
                    event.result = await await player.chooseCardTarget({
                        prompt: get.prompt2(event.skill),
                        filterTarget(card, player, target) {
                            return player.canCompare(target);
                        },
                        filterCard: true,
                        position: 'h',
                        ai1(card) {
                            return Math.min(13, get.number(card) + 2) / Math.pow(Math.min(2, get.value(card)), 0.25);
                        },
                        ai2(target) {
                            const player = _status.event.player;
                            const getNum = (card) => Math.min(13, get.number(card) + 2) / Math.pow(Math.min(2, get.value(card)), 0.25);
                            const card = player.getCards('h').sort((a, b) => getNum(b) - getNum(a))[0];
                            if (card.number > 9 || !target.countCards('h', function (cardx) {
                                return cardx.number >= card.number + 2;
                            })) return -get.attitude(player, target) / Math.sqrt(target.countCards('h'));
                            return 0;
                        },
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const card = event.cards[0];
                    await player.showCards([card], get.translation(player) + '发动了【明伐】');
                    const result = await player.chooseToCompare(target).set('fixedResult', { [player.playerid]: card }).forResult();
                    if (result?.bool) {
                        await player.gainPlayerCard(target, 'he', true);
                        await player.draw();
                    }
                    else player.addTempSkill('mingfa_block');
                },
                group: 'mingfa_add',
            },
            fh_rongbei: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'rongbei',
                inherit: 'rongbei',
                async content(event, trigger, player) {
                    const { target } = event;
                    player.awakenSkill(event.name);
                    let num = 1;
                    while (num < 6) {
                        if (target.hasEmptySlot(num)) {
                            const card = get.fh_cardPile((card) => get.subtype(card) == 'equip' + num && target.canEquip(card));
                            if (card) {
                                await target.equip(card);
                                await game.delayx();
                            }
                        }
                        num++;
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        target(player, target) {
                            return (target.hasSkillTag('noe') ? 2 : 1) * (5 - target.countCards('e') - target.countDisabled());
                        },
                    },
                },
            },
            //蔡贞姬
            fh_tianyin: {
                audio: 'tianyin',
                trigger: { player: 'phaseJieshuBegin' },
                frequent: true,
                async content(event, trigger, player) {
                    var cards = get.cards(4);
                    var cards2 = [];
                    var videoId = lib.status.videoId++;
                    game.broadcastAll(function (player, id, cards) {
                        var dialog = ui.create.dialog((player == game.me && !_status.auto) ? '###天音###请选择任意张本回合未使用过的类别的牌获得' : '天音', cards);
                        dialog.videoId = id;
                    }, player, videoId, cards);
                    var time = get.utc();
                    game.addVideo('showCards', player, ['天音', get.cardsInfo(cards)]);
                    game.addVideo('delay', null, 2);
                    var types = player.getHistory('useCard').reduce((list, evt) => list.add(get.type2(evt.card)), []);
                    var result = await player.chooseButton([1, 4]).set('types', types).set('filterButton', button => {
                        return !_status.event.types.includes(get.type2(button.link));
                    }).set('dialog', videoId).set('ai', button => get.value(button.link, _status.event.player)).forResult();
                    if (result.bool) {
                        cards2.addArray(result.links);
                        cards.removeArray(cards2);
                        game.cardsDiscard(cards);
                    }
                    var time = 1000 - (get.utc() - time);
                    if (time > 0) await game.delay(0, time);
                    if (cards2.length) await player.gain(cards2, 'gain2');
                },
            },
            //华歆
            fh_yuanqing: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'yuanqing',
                inherit: 'yuanqing',
                content() {
                    var map = [], cards = [];
                    player.getHistory('useCard', evt => {
                        if (evt.getParent('phaseUse') == trigger) map.add(get.type2(evt.card));
                    });
                    map.forEach(type => {
                        var card = get.fh_cardPile(card => get.type2(card) == type);
                        if (card) cards.push(card);
                    });
                    if (cards.length) {
                        _status.fh_cardPile.removeArray(cards);
                        game.log('#g额外牌堆', '失去了', cards);
                        game.broadcast(pile => {
                            _status.fh_cardPile = pile;
                        }, _status.fh_cardPile);
                        player.$gain2(cards, false);
                        game.cardsGotoSpecial(cards, 'toRenku');
                        game.log(player, '将', cards, '置入了仁库');
                        game.delayx();
                    }
                },
                init(player) {
                    player.storage.renku = true;
                },
            },
            //向宠
            fh_guying: {
                onremove: true,
                audio: 'guying',
                trigger: { player: 'loseAfter', global: 'loseAsyncAfter' },
                filter(event, player) {
                    return lib.skill.guying.filter(event, player);
                },
                usable: 1,
                forced: true,
                logTarget: () => _status.currentPhase,
                async content(event, trigger, player) {
                    if (trigger.delay === false) game.delayx();
                    var target = _status.currentPhase;
                    var card = trigger.getl(player).cards2[0];
                    if (!player.hasMark('fh_guying')) {
                        player.addMark('fh_guying', 1, false);
                        player.when('phaseZhunbeiBegin').filter((event, player) => player.countMark('fh_guying')).then(() => {
                            var num = player.countMark('fh_guying');
                            player.removeMark('fh_guying', num, false);
                            player.chooseToDiscard('he', num, true);
                        });
                    }
                    var addIndex = 0, choiceList = [], str = get.translation(player);
                    if (target.countCards('he') > 0) choiceList.push('交给' + str + '一张牌');
                    else addIndex++;
                    if (get.position(card) == 'd') choiceList.push('令' + str + '收回' + get.translation(card));
                    if (choiceList.length == 1) event._result = { index: 0 };
                    var result = await target.chooseControl().set('ai', function () {
                        var player = _status.event.player, evt = _status.event.evt;
                        if (get.value(evt.card, evt.player) * get.attitude(player, evt.player) > 0) return 0;
                        return Math.random() > (get.value(evt.card, evt.player) / 6) ? 1 : 0;
                    }).set('choiceList', choiceList).set('evt', { card: card, player: player }).forResult();
                    if (result.index + addIndex == 0) {
                        var result2 = await target.chooseCard('he', true, '固营：将一张牌交给' + get.translation(player)).forResult();
                        if (result2.bool) await target.give(result2.cards, player);
                    }
                    else {
                        await player.gain(card, 'gain2');
                        if (player.isIn() && player.getCards('h').includes(card) && get.type(card, player) == 'equip') await player.chooseUseTarget(card, true, 'nopopup');
                    }
                },
                intro: { content: '已发动过#次' },
            },
            //许靖
            fh_boming: {
                audio: 'boming',
                inherit: 'boming',
                check(card) {
                    return 7 - get.value(card);
                },
                content() {
                    player.showCards(cards, get.translation(player) + '发动了【博名】');
                    player.markAuto('fh_boming', [target]);
                    player.give(cards, target);
                },
                ai: {
                    order: 7,
                    result: {
                        target(player, target) {
                            if (!ui.selected.cards.length) return 0;
                            var card = ui.selected.cards[0];
                            if (player.hasSkill('fh_ejian') && !player.getStorage('fh_ejian').includes(target)) {
                                var dam = get.damageEffect(target, player, target);
                                if (dam > 0) return dam;
                                var type = get.type(card, target), ts = target.getCards('he', card => get.type2(card) == type);
                                if (ts.length) {
                                    var val = get.value(ts, target);
                                    if (val > get.value(card)) return -Math.max(1, val);
                                    return 0;
                                }
                            }
                            return get.value(card, target) / 1.5;
                        },
                    },
                },
                intro: { content: '已对$发动过此技能' },
                group: 'fh_boming_draw',
                subSkill: {
                    draw: {
                        audio: 'boming',
                        trigger: { player: 'phaseJieshuBegin' },
                        filter(event, player) {
                            return player.getStorage('fh_boming').length;
                        },
                        forced: true,
                        locked: false,
                        content() {
                            player.draw(player.getStorage('fh_boming').length);
                        },
                    },
                },
            },
            fh_ejian: {
                audio: 'ejian',
                trigger: { global: 'gainAfter' },
                filter(event, player) {
                    var evt = event.getParent(), target = event.player;
                    if (evt.name != 'fh_boming' || evt.player != player || player.getStorage('fh_ejian').includes(target) || !target.isIn()) return false;
                    return target.getCards('he').includes(event.cards[0]);
                },
                forced: true,
                logTarget: 'player',
                async content(event, trigger, player) {
                    var target = trigger.player;
                    await target.showHandcards(get.translation(player) + '发动了【恶荐】');
                    var card = trigger.cards[0];
                    var type = get.type2(card);
                    if (!player.getStorage('fh_ejian').length) {
                        player.when({ global: 'phaseAfter' }).then(() => {
                            player.unmarkSkill('fh_ejian');
                            delete player.storage.fh_ejian;
                        });
                    }
                    player.markAuto('fh_ejian', [target]);
                    if (!target.countCards('he', cardx => cardx != card && get.type2(cardx) == type)) return;
                    var result;
                    if (!target.countCards('h', cardx => get.type2(cardx) == type)) result = { index: 1 };
                    else result = await target.chooseControl().set('choiceList', [
                        '弃置所有' + get.translation(type) + '手牌',
                        '受到1点伤害，令' + get.translation(player) + '重置【博名】记录',
                    ]).set('ai', function (event, player) {
                        var player = _status.event.player;
                        var target = _status.event.target;
                        if (get.damageEffect(player, target, player) >= 0) return 1;
                        var type = _status.event.type, cards = player.getCards('h', card => get.type2(card) == type);
                        if (cards.length == 1) return 0;
                        if (cards.length >= 2 && cards.some(card => get.tag(card, 'save'))) return 1;
                        if (player.hp == 1) return 0;
                        for (var i = 0; i < cards.length; i++) {
                            if (get.value(cards[i]) >= 8) return 1;
                        }
                        if (cards.length > 2 && player.hp > 2) return 1;
                        if (cards.length > 3) return 1;
                        return 0;
                    }).set('type', type).set('target', player).forResult();
                    if (result.index == 0) target.discard(target.getCards('h', card => get.type2(card) == type));
                    else {
                        await target.damage();
                        player.unmarkSkill('fh_boming');
                        delete player.storage.fh_boming;
                    }
                },
                ai: { combo: 'fh_boming', halfneg: true },
            },
            //桥公
            fh_yizhu: {
                audio: 'yizhu',
                trigger: { player: 'phaseJieshuBegin' },
                filter(event, player) {
                    return player.countCards('he', card => {
                        if (get.position(card) == 'h' && _status.connectMode) return true;
                        return get.color(card, player) == 'red';
                    });
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseCard(get.prompt2(event.skill), 'he', (card, player) => {
                        if (get.color(card) != 'red') return false;
                        return !ui.selected.cards.some(cardx => get.suit(cardx) == get.suit(card));
                    }, [1, 2]).set('complexCard', true).set('ai', card => {
                        var player = _status.event.player;
                        if (!game.hasPlayer(target => get.attitude(player, target) > 0)) return 0;
                        return 5 - get.value(card);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const { cards } = event;
                    player.$throw(cards, 1000);
                    game.addGlobalSkill('fh_yizhu_shown');
                    player.markAuto('fh_yizhu', cards);
                    const next = player.lose(cards, ui.cardPile);
                    next.insert_index = function () {
                        return ui.cardPile.childNodes[get.rand(0, game.players.length - 1)];
                    };
                    await next;
                    game.updateRoundNumber();
                    await game.delayx();
                },
                intro: { mark: (dialog, content) => dialog.addAuto(content) },
                subSkill: {
                    shown: {
                        charlotte: true,
                        trigger: {
                            player: 'gainAfter',
                            global: 'loseAsyncAfter',
                        },
                        filter(event, player) {
                            return event.getg && event.getg(player).some(card => game.hasPlayer(current => current.getStorage('fh_yizhu').includes(card)));
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            var cards = trigger.getg(player).filter(card => game.hasPlayer(current => current.getStorage('fh_yizhu').includes(card)));
                            var targets = game.filterPlayer(current => cards.some(card => current.getStorage('fh_yizhu').includes(card))).sortBySeat();
                            player.addShownCards(cards, 'visible_yizhu');
                            while (targets.length) {
                                var target = targets.shift();
                                target.unmarkAuto('fh_yizhu', target.getStorage('fh_yizhu').filter(card => cards.includes(card)));
                                var result = await target.chooseBool(get.prompt('fh_yizhu', player), '和' + get.translation(player) + '摸一张牌').set('choice', get.attitude(target, player) > 0).forResult();
                                if (result.bool) {
                                    target.logSkill('fh_yizhu', player);
                                    await target.draw('nodelay');
                                    await player.draw();
                                }
                            }
                        },
                    },
                },
            },
            //张温
            fh_songshu: {
                audio: 'spsongshu',
                trigger: { global: 'phaseUseBegin' },
                filter(event, player) {
                    return player.countCards('he');
                },
                async cost(event, trigger, player) {
                    const target = trigger.player;
                    event.result = await player.chooseCard(get.prompt2(event.skill, target), 'he').set('ai', card => {
                        var player = _status.event.player, target = _status.event.target;
                        var cards = _status.renku.slice();
                        cards.push(card);
                        if (cards.length > 6) cards = cards.slice(cards.length - 6);
                        if (cards.length < target.countCards('h')) return -get.value(card);
                        var num1 = cards.reduce((sum, card) => sum += target.getUseValue(card), 0);
                        var num2 = target.getCards('hs').reduce((sum, card) => sum += target.getUseValue(card), 0);
                        return (num1 - num2) * Math.sign(get.attitude(player, target));
                    }).set('target', target).forResult();
                },
                async content(event, trigger, player) {
                    const { cards } = event;
                    player.$throw(cards, 1000);
                    game.log(player, '将', cards, '置入了仁库');
                    await player.lose(cards, ui.special, 'toRenku');
                    await game.delayx();
                    if (_status.renku.length >= target.countCards('h')) {
                        player.line(target);
                        target.addTempSkill('fh_songshu_buff');
                    }
                },
                init(player) {
                    player.storage.renku = true;
                },
                subSkill: {
                    buff: {
                        charlotte: true,
                        mod: {
                            cardEnabled2(card, player) {
                                if (get.itemtype(card) == 'card' && !card.hasGaintag('fh_songshu_buff')) return false;
                                if (card.cards && card.cards.some(card => !card.hasGaintag('fh_songshu_buff'))) return false;
                            },
                        },
                        init(player) {
                            var cards = _status.renku.slice();
                            var cardsx = cards.map(card => {
                                var cardx = ui.create.card();
                                cardx.init(get.cardInfo(card));
                                cardx._cardid = card.cardid;
                                return cardx;
                            });
                            player.directgains(cardsx, null, 'fh_songshu_buff');
                            player.addSkill('fh_songshu_in');
                        },
                        onremove(player) {
                            var cards2 = player.getCards('s', card => card.hasGaintag('fh_songshu_buff'));
                            if (player.isOnline2()) {
                                player.send(function (cards, player) {
                                    cards.forEach(i => i.delete());
                                    if (player == game.me) ui.updatehl();
                                }, cards2, player);
                            }
                            cards2.forEach(i => i.delete());
                            if (player == game.me) ui.updatehl();
                        },
                        group: ['fh_songshu_in', 'fh_songshu_use'],
                    },
                    in: {
                        charlotte: true,
                        trigger: { global: ['gainEnd', 'cardsDiscardEnd', 'cardsGotoSpecialEnd'] },
                        filter(event, player) {
                            return event.fromRenku || event.toRenku;
                        },
                        forced: true,
                        popup: false,
                        firstDo: true,
                        content() {
                            lib.skill.fh_songshu.subSkill.buff.onremove(player);
                            lib.skill.fh_songshu.subSkill.buff.init(player);
                        },
                    },
                    use: {
                        charlotte: true,
                        trigger: { player: ['useCardBefore', 'respondBefore'] },
                        filter(event, player) {
                            var cards = player.getCards('s', card => card.hasGaintag('fh_songshu_buff') && card._cardid);
                            return event.cards?.some(card => cards.includes(card));
                        },
                        forced: true,
                        popup: false,
                        firstDo: true,
                        content() {
                            trigger.fromRenku = true;
                            player.when('useCard1').filter(evt => evt == trigger).then(() => player.$throw(trigger.cards, 1000));
                            var cards = _status.renku.slice();
                            var cards2 = [];
                            for (var card of trigger.cards) {
                                var cardx = cards.find(cardx => cardx.cardid == card._cardid);
                                if (cardx) cards2.push(cardx);
                            }
                            var cards3 = trigger.cards.slice();
                            trigger.cards = cards2;
                            trigger.card.cards = cards2;
                            if (player.isOnline2()) {
                                player.send((cards, player) => {
                                    cards.forEach(i => i.delete());
                                    if (player == game.me) ui.updatehl();
                                }, cards3, player);
                            }
                            cards3.forEach(i => i.delete());
                            _status.renku.removeArray(cards2);
                            game.updateRenku();
                            if (player == game.me) ui.updatehl();
                        },
                    },
                },
            },
            //刘璋
            fh_yinge: {
                audio: 'xiusheng',
                enable: 'phaseUse',
                filter(event, player) {
                    return game.hasPlayer(target => lib.skill.fh_yinge.filterTarget(null, player, target));
                },
                filterTarget(card, player, target) {
                    return target != player && target.countCards('h');
                },
                usable: 1,
                content() {
                    'step 0'
                    player.addSkill('fh_yinge_buff');
                    target.chooseCard('引戈：将一张手牌置入仁库，然后可以使用一张仁库牌', true);
                    'step 1'
                    if (result.bool) {
                        target.$throw(result.cards, 1000);
                        game.log(target, '将', result.cards, '置入了仁库');
                        target.lose(result.cards, ui.special, 'toRenku');
                    }
                    else event.finish();
                    'step 2'
                    game.delayx();
                    if (!_status.renku.some(card => target.hasUseTarget(card))) event.finish();
                    'step 3'
                    target.chooseButton(['引戈：是否使用一张仁库牌', _status.renku]).set('filterButton', button => _status.event.player.hasUseTarget(button.link)).set('ai', button => {
                        var player = _status.event.player;
                        var target = _status.event.target;
                        if (get.tag(button.link, 'damage') && player.canUse(button.link, target, false)) {
                            if (get.effect(target, button.link, player, player) > 0) return player.getUseValue(button.link) / 10;
                            if (get.effect(target, button.link, player, player) > 0 && game.hasPlayer(current => {
                                if (current == target) return false;
                                return player.canUse(button.link, current) && get.effect(current, button.link, player, player) > 0;
                            })) return 3 * player.getUseValue(button.link);
                        }
                        return player.getUseValue(button.link);
                    }).set('target', player);
                    'step 4'
                    if (result?.bool && result.links?.length) target.chooseUseTarget(true, result.links[0], false);
                },
                ai: {
                    order: 7,
                    result: {
                        target(player, target) {
                            if (game.hasPlayer(target => get.attitude(player, target) > 0)) return target.countCards('h');
                            return -1 / target.countCards('h');
                        },
                    },
                },
                subSkill: {
                    buff: {
                        charlotte: true,
                        trigger: { global: 'useCard2' },
                        filter(event, player) {
                            if (!event.targets || event.targets.includes(player) || !get.tag(event.card, 'damage')) return false;
                            return event.getParent(2).name == 'fh_yinge' && event.getParent(2).player == player && event.getParent(2).targets[0] == event.player;
                        },
                        forced: true,
                        popup: false,
                        content() {
                            'step 0'
                            game.delayx();
                            'step 1'
                            trigger.player.line(player);
                            trigger.targets.push(player);
                            game.log(player, '成为了', trigger.card, '的额外目标');
                        },
                    },
                },
            },
            fh_shiren: {
                audio: 'yinlang',
                trigger: { target: 'useCardToTargeted' },
                filter(event, player) {
                    return get.tag(event.card, 'damage') && event.player != player;
                },
                async cost(event, trigger, player) {
                    const key = ['jiu', 'tao'];
                    if (get.type(trigger.card) == 'trick') key.push('wuxie');
                    switch (trigger.card.name) {
                        case 'sha': case 'wanjian': key.push('shan'); break;
                        case 'juedou': case 'nanman': case 'jiedao': key.push('sha'); break;
                    }
                    key.push('caochuan');
                    const result = await player.chooseControl('选项一', '选项二', 'cancel2').set('choiceList', [
                        '将牌堆顶的两张牌置入仁库，然后获得仁库的一张牌',
                        '摸两张牌，然后将一张手牌置入仁库',
                    ]).set('ai', () => {
                        var cards = _status.renku.slice();
                        if (cards.length + 2 > 6) cards = cards.slice(cards.length - 4, 6);
                        if (cards.some(card => _status.event.key.includes(card.name))) return 0;
                        return 1;
                    }).set('key', key).set('prompt', get.prompt2(event.skill)).forResult();
                    event.result = {
                        bool: result?.control != 'cancel2',
                        cost_data: result?.index,
                    };
                },
                async content(event, trigger, player) {
                    const key = ['jiu', 'tao'];
                    if (get.type(trigger.card) == 'trick') key.push('wuxie');
                    switch (trigger.card.name) {
                        case 'sha': case 'wanjian': key.push('shan'); break;
                        case 'juedou': case 'nanman': case 'jiedao': key.push('sha'); break;
                    }
                    key.push('caochuan');
                    const { cost_data } = event;
                    if (cost_data == 0) {
                        const cards = get.cards(2);
                        player.$gain2(cards, false);
                        await game.cardsGotoSpecial(cards, 'toRenku');
                        await game.delayx();
                        if (!_status.renku.length) return;
                        const result = await player.chooseButton(true, ['施仁：请选择获得一张牌', _status.renku]).set('ai', button => {
                            const player = _status.event.player;
                            if (_status.event.key.includes(button.link.name)) return _status.event.key.indexOf(button.link.name) + 114514;
                            return get.value(button.link, player);
                        }).set('key', key).forResult();
                        if (result?.bool) {
                            await player.gain(result.links, 'gain2', 'fromRenku');
                        }
                    }
                    else {
                        await player.draw(2);
                        if (!player.countCards('h')) return;
                        const result = await player.chooseCard('h', true, '将一张手牌置于仁库中').forResult();
                        if (result?.bool) {
                            player.$throw(result.cards, 1000);
                            game.log(player, '将', result.cards, '置入了仁库');
                            await player.lose(result.cards, ui.special, 'toRenku');
                            await game.delayx();
                        }
                    }
                },
            },
            fh_juyi: {
                audio: 'huaibi',
                trigger: { global: 'phaseDiscardBegin' },
                filter(event, player) {
                    return event.player != player && event.player.group == 'qun' && event.player.countCards('h');
                },
                zhuSkill: true,
                direct: true,
                async content(event, trigger, player) {
                    var target = trigger.player;
                    player.addSkill('fh_juyi_buff');
                    var result = await target.chooseCard(get.prompt('fh_juyi'), '将一张手牌置入仁库，然后' + get.translation(player) + '获得溢出的仁库牌').set('ai', card => {
                        var player = _status.event.player;
                        var target = _status.event.target;
                        if (get.attitude(player, target) <= 0) return 0;
                        if (player.needsToDiscard()) return 15 - get.value(card);
                        return 4 - get.value(card);
                    }).set('target', player).forResult();
                    if (result.bool) {
                        target.logSkill('fh_juyi', player);
                        target.$throw(result.cards, 1000);
                        game.log(target, '将', result.cards, '置入了仁库');
                        await target.lose(result.cards, ui.special, 'toRenku');
                        await game.delayx();
                    }
                },
                subSkill: {
                    buff: {
                        charlotte: true,
                        trigger: { global: 'cardsDiscardAfter' },
                        filter(event, player) {
                            if (!event.fromRenku || !event.outRange) return false;
                            if (!event.cards.filterInD('d').length) return false;
                            return event.getParent(2).name == 'fh_juyi' && event.getParent(2).player == player;
                        },
                        forced: true,
                        popup: false,
                        content() {
                            'step 0'
                            game.delayx();
                            'step 1'
                            player.gain(trigger.cards.filterInD('d'), 'gain2');
                        },
                    },
                },
            },
            //张仲景
            fh_jishi: {
                audio: 'jishi',
                inherit: 'jishi',
                group: 'fh_jishi_draw',
                subSkill: {
                    draw: {
                        audio: 'jishi',
                        trigger: { global: ['gainAfter', 'cardsDiscardAfter', 'useCard', 'respond'] },
                        filter(event, player) {
                            if (!event.cards || !event.cards.length) return false;
                            return event.fromRenku && !event.outRange;
                        },
                        forced: true,
                        content() {
                            player.draw();
                        },
                    },
                },
            },
            fh_liaoyi: {
                audio: 'liaoyi',
                trigger: { global: 'phaseBegin' },
                filter(event, player) {
                    if (player == event.player) return false;
                    var num = event.player.hp - event.player.countCards('h');
                    if (num < 0) return true;
                    return num > 0 && _status.renku.length >= Math.min(2, num);
                },
                prompt2(event, player) {
                    var target = event.player, num = target.hp - target.countCards('h');
                    if (num < 0) return '令' + get.translation(target) + '将' + get.cnNumber(Math.min(2, -num)) + '张牌置入仁库';
                    return '令' + get.translation(target) + '从仁库中获得' + get.cnNumber(Math.min(2, num)) + '张牌';
                },
                logTarget: 'player',
                check(event, player) {
                    var target = event.player, num = target.hp - target.countCards('h'), att = get.attitude(player, target);
                    if (num < 0) {
                        if (target.countCards('e', function (card) {
                            return get.value(card, target) <= 0;
                        }) >= (-num / 2)) return att > 0;
                        return att <= 0;
                    }
                    return att > 0;
                },
                content() {
                    'step 0'
                    var target = trigger.player, num = target.hp - target.countCards('h');
                    event.target = target;
                    if (num < 0) {
                        num = Math.min(2, -num);
                        target.chooseCard('he', true, '将' + get.cnNumber(num) + '张牌置于仁库中', num);
                    }
                    else {
                        num = Math.min(2, num);
                        target.chooseButton(['选择获得' + get.cnNumber(num) + '张牌', _status.renku], num, true).set('ai', function (button) {
                            return get.value(button.link, _status.event.player);
                        });
                        event.goto(3);
                    }
                    'step 1'
                    if (result.bool) {
                        target.$throw(result.cards, 1000);
                        game.log(target, '将', result.cards, '置入了仁库');
                        target.lose(result.cards, ui.special, 'toRenku');
                    }
                    else event.finish();
                    'step 2'
                    game.delayx();
                    event.finish();
                    'step 3'
                    var cards = result.links;
                    _status.renku.removeArray(cards);
                    game.updateRenku();
                    target.gain(cards, 'gain2', 'fromRenku');
                },
            },
            fh_binglun: {
                audio: 'binglun',
                enable: 'phaseUse',
                filter(event, player) {
                    return _status.renku.length > 0 && game.hasPlayer(target => target.isDamaged());
                },
                usable: 1,
                chooseButton: {
                    dialog(event, player) {
                        return ui.create.dialog('病论', _status.renku);
                    },
                    prompt: () => '请选择【病论】的目标',
                    backup(links, player) {
                        return {
                            audio: 'binglun',
                            card: links[0],
                            filterTarget(card, player, target) {
                                return target.isDamaged();
                            },
                            delay: false,
                            content() {
                                'step 0'
                                var card = lib.skill.fh_binglun_backup.card;
                                game.log(card, '从仁库进入了弃牌堆');
                                player.$throw(card, 1000);
                                game.delayx();
                                game.cardsDiscard(card).fromRenku = true;
                                _status.renku.remove(card);
                                game.updateRenku();
                                'step 1'
                                target.recover();
                            },
                            ai: {
                                result: {
                                    player(player, target) {
                                        return get.recoverEffect(target, player, player);
                                    },
                                },
                            },
                        }
                    },
                },
                ai: {
                    order: 7,
                    result: {
                        player(player) {
                            return game.countPlayer(target => get.recoverEffect(target, player, player) > 0);
                        },
                    },
                },
                subSkill: { backup: {} },
            },
            //王双
            fh_shanxie: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'shanxie',
                enable: 'phaseUse',
                filter(event, player) {
                    return get.fh_cardPile(card => get.type(card) == 'equip' && get.subtype(card) == 'equip1');
                },
                usable: 1,
                content() {
                    var card = get.fh_cardPile(card => get.type(card) == 'equip' && get.subtype(card) == 'equip1');
                    if (card) player.gain(card, 'gain2', 'fromFh_cardPile');
                },
                ai: {
                    order: 9,
                    result: { player: 1 },
                },
                group: ['shanxie_exclude', 'shanxie_shan'],
            },
            //崔琰
            fh_yajun: {
                audio: 'spyajun',
                group: 'spyajun_draw',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return game.hasPlayer(current => player.canCompare(current));
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt('fh_yajun'), '与一名角色拼点', (card, player, target) => {
                        return player.canCompare(target);
                    }).set('ai', target => {
                        return -get.attitude(_status.event.player, target) * Math.sqrt(5 - Math.min(4, target.countCards('h'))) * (target.hasSkillTag('noh') ? 0.5 : 1);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const result = await player.chooseToCompare(target).forResult();
                    if (result?.bool) {
                        const cards = [result.player, result.target].filterInD('d');
                        if (cards.length) {
                            const result = await player.chooseButton(['是否将一张牌置于牌堆顶？', cards]).set('ai', button => {
                                if (get.color(button.link) == 'black') return 1;
                                return 0;
                            }).forResult();
                            if (result.bool) {
                                const card = result.links[0];
                                player.$throw([card], 1000);
                                game.log(player, '将', card, '置于牌堆顶');
                                await game.cardsGotoPile(card, 'insert');
                            }
                        }
                    }
                    else {
                        player.addMark('spyajun_less', 1, false);
                        player.addTempSkill('spyajun_less');
                    }
                },
            },
            //蒋琬
            fh_jincui: {
                audio: 'spjincui',
                inherit: 'spjincui',
                content() {
                    'step 0'
                    player.awakenSkill('fh_jincui');
                    game.broadcastAll(function (target1, target2) {
                        game.swapSeat(target1, target2);
                    }, player, target);
                    'step 1'
                    var num = lib.skill.fh_jincui.getSeatNum(player, target);
                    if (num > 0) player.loseHp(num);
                },
                getSeatNum(player, target) {
                    var left = 0, right = 0, current_left = player, current_right = player;
                    while (current_left != target) {
                        left++;
                        current_left = current_left.getPrevious();
                    }
                    while (current_right != target) {
                        right++;
                        current_right = current_right.getPrevious();
                    }
                    return Math.min(left, right, player.getHp())
                },
                ai: {
                    order: 5,
                    result: {
                        player(player, target) {
                            if (player.hasUnknown()) return 0;
                            var num = 0, current = player.next;
                            var num2 = lib.skill.fh_jincui.getSeatNum(player, target);
                            var num3 = player.countCards('hs', card => player.canSaveCard(card, player));
                            while (true) {
                                num -= Math.sign(get.attitude(player, current));
                                if (current == target) break;
                                current = current.next;
                            }
                            while (true) {
                                if (current == player) break;
                                num += Math.sign(get.attitude(player, current)) * 1.1;
                                current = current.next;
                            }
                            if (num < num2 - num3) return 0;
                            return num + 1 - num2 + num3;
                        },
                    },
                },
            },
            //刘巴
            fh_tongduo: {
                audio: 'tongduo',
                trigger: { target: 'useCardToTargeted' },
                filter(event, player) {
                    return player != event.player && event.targets.length == 1 && game.hasPlayer(current => {
                        return current.countCards('he') > 0;
                    });
                },
                usable: 1,
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt(event.skill), '<span class="text center">' +
                        '令一名角色重铸一张牌' +
                        '<br>※若此牌为红桃牌或锦囊牌，则其额外摸一张牌' +
                        '<br>※若此牌为【无中生有】，你重置【锻币】' +
                        '</span>'
                        , (card, player, target) => {
                            return target.hasCard(lib.filter.cardRecastable, 'he');
                        }).set('ai', target => {
                            return get.attitude(_status.event.player, target) * Math.min(3, Math.floor(target.countCards('h', lib.filter.cardRecastable) / 2));
                        }).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    if (!target.hasCard(lib.filter.cardRecastable, 'he')) return;
                    const result = await target.chooseCard('he', true, '请重铸一张牌', lib.filter.cardRecastable).set('ai', card => {
                        const { player, source } = get.event();
                        const num = get.sgnAttitude(player, source);
                        if (source.awakenedSkills.includes('duanbi') && source.hasSkill('tongduo', null, false, false) && get.name(card) == 'wuzhong') {
                            if (num == 1) return 10;
                            return 0;
                        }
                        if (get.suit(card) == 'heart' || get.type2(card) == 'trick') return 8 - get.value(card);
                        return lib.skill.zhiheng.check(card);
                    }).set('source', player).forResult();
                    if (result?.bool) {
                        await target.recast(result.cards);
                        const card = result.cards[0];
                        if (get.suit(card) == 'heart' || get.type2(card) == 'trick') await target.draw();
                        if (get.name(card, target) == 'wuzhong' && player.awakenedSkills.includes('duanbi')) {
                            player.refreshSkill('duanbi');
                        }
                    }
                },
            },
            //吕范
            fh_diaodu: {
                audio: 'spdiaodu',
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return player.canMoveCard(null, true);
                },
                direct: true,
                async content(event, trigger, player) {
                    let result = await player.moveCard(false, get.prompt2(event.name)).set('logSkill', event.name).set('nojudge', true).forResult();
                    if (result?.bool) {
                        const target = result.targets[0];
                        player.line(target);
                        await target.draw();
                    }
                },
            },
            //知箸侠
            fh_shuishi: {
                audio: 'shuishi',
                enable: 'phaseUse',
                usable: 1,
                frequent: true,
                content() {
                    'step 0'
                    event.cards = [];
                    event.suits = [];
                    'step 1'
                    player.judge(function (result) {
                        var evt = _status.event.getParent('fh_shuishi');
                        return 1 - evt?.suits?.includes(get.suit(result));
                    }).set('callback', lib.skill.fh_shuishi.callback).judge2 = function (result) {
                        return result.bool ? true : false;
                    };
                    'step 2'
                    var cards = cards.filterInD();
                    if (cards.length) player.chooseTarget('将' + get.translation(cards) + '交给一名角色').set('ai', function (target) {
                        var player = _status.event.player;
                        var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
                        if (target.hasSkillTag('nogain')) att /= 10;
                        return att;
                    });
                    else event.finish();
                    'step 3'
                    if (result.bool) {
                        var target = result.targets[0];
                        event.target = target;
                        player.line(target, 'green');
                        target.gain(cards, 'gain2').giver = player;
                    }
                    else {
                        game.cardsDiscard(cards);
                        game.log(cards, '被置入了弃牌堆');
                        event.finish();
                    }
                },
                callback() {
                    'step 0'
                    var evt = event.getParent(2);
                    event.getParent().orderingCards.remove(event.judgeResult.card);
                    evt.cards.push(event.judgeResult.card);
                    if (event.getParent().result.bool) {
                        evt.suits.push(event.getParent().result.suit);
                        player.chooseBool('是否继续发动【慧识】？').set('frequentSkill', 'fh_shuishi');
                    }
                    else event._result = { bool: false };
                    'step 1'
                    if (result.bool) event.getParent(2).redo();
                },
                ai: {
                    order: 9,
                    result: { player: 1 },
                },
            },
            fh_tianyi: {
                audio: 'stianyi',
                derivation: 'zuoxing',
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return !game.hasPlayer(current => !current.getAllHistory('damage').length);
                },
                forced: true,
                juexingji: true,
                skillAnimation: true,
                animationColor: 'gray',
                content() {
                    'step 0'
                    player.awakenSkill('fh_tianyi');
                    if (player.maxHp < 10) player.gainMaxHp(10 - player.maxHp);
                    'step 1'
                    player.chooseTarget('令一名角色获得〖佐幸〗', true).set('ai', target => {
                        return get.attitude(_status.event.player, target);
                    });
                    'step 2'
                    if (result.bool) {
                        var target = result.targets[0];
                        player.line(target, 'green');
                        target.storage.zuoxing = player;
                        target.addSkills('zuoxing');
                    }
                },
            },
            fh_sghuishi: {
                audio: 'sghuishi',
                trigger: { player: 'dying' },
                limited: true,
                skillAnimation: true,
                animationColor: 'water',
                async cost(event, trigger, player) {
                    const next = player.chooseTarget(get.prompt2(event.skill)).set('ai', target => {
                        const player = _status.event.player;
                        const list = target.getSkills(null, false, false).filter(skill => {
                            return get.info(skill).juexingji;
                        });
                        if (list.length) return get.attitude(player, target);
                        return get.attitude(player, target) + 5;
                    });
                    next.set('targetprompt2', next.targetprompt2.concat([
                        target => {
                            if (!target.isIn()) return false;
                            const list = target.getSkills(null, false, false).filter(skill => {
                                return get.info(skill).juexingji;
                            });
                            if (list.length) return '无视觉醒';
                            return '摸牌';
                        },
                    ]));
                    event.result = await next.forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    player.awakenSkill(event.name);
                    let list = target.getSkills(null, false, false).filter(skill => {
                        return get.info(skill).juexingji;
                    });
                    if (!list.length) {
                        await target.draw(4);
                    }
                    else {
                        list = list.map(skill => [
                            skill,
                            '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">' +
                            (() => {
                                let str = get.translation(skill);
                                if (!lib.skill[skill]?.nobracket) {
                                    str = '【' + str + '】';
                                }
                                return str;
                            })() +
                            '</div><div>' +
                            lib.translate[skill + '_info'] +
                            '</div></div>',
                        ]);
                        const result = await player.chooseButton([
                            `选择一个觉醒技，令${get.translation(target)}可无视条件觉醒该技能`,
                            [list, 'textbutton'],
                        ], true).set('direct', true).forResult();
                        if (result?.links?.length) {
                            const [link] = result.links;
                            player.popup(link);
                            target.storage.fh_sghuishi_mark = link;
                            target.markSkill('fh_sghuishi_mark');
                            const info = lib.skill[link];
                            if (info.filter && !info.charlotte && !info.fh_sghuishi_filter) {
                                info.fh_sghuishi_filter = info.filter;
                                info.filter = function (event, player) {
                                    if (player.storage.fh_sghuishi_mark) return true;
                                    return this.fh_sghuishi_filter.apply(this, arguments);
                                }
                            }
                        }
                    }
                },
                subSkill: { mark: { intro: { content: '发动【$】时无视条件' } } },
            },
            //生熏鱼
            //非群宠熏鱼
            fh_lingce: {
                audio: 'lingce',
                trigger: {
                    target: 'useCardToBefore',
                    global: 'useCard',
                },
                filter(event, player) {
                    if (!get.zhinangs().includes(event.card.name)) return false;
                    return event.name == 'useCard' || event.player != player;
                },
                forced: true,
                content() {
                    if (trigger.name == 'useCard') player.draw();
                    else trigger.cancel();
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (card && get.zhinangs().includes(card.name) && target != player) return 'zerotarget';
                        },
                    },
                },
            },
            fh_dinghan: {
                available() {
                    var list = (_status.connectMode ? lib.configOL : lib.config).zhinang_tricks;
                    if (!list || !list.length) return false;
                },
                audio: 'dinghan',
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    if (lib.skill.fh_dinghan.available() === false) return false;
                    var list1 = get.zhinangs(), list2 = lib.inpile.filter(name => get.type2(name) == 'trick' && !get.zhinangs().includes(name));
                    return list1.length && list2.length;
                },
                async cost(event, trigger, player) {
                    const dialog = ['###' + get.prompt(event.skill) + '###更改智囊组成'];
                    const list1 = get.zhinangs(), list2 = lib.inpile.filter(name => get.type2(name) == 'trick' && !get.zhinangs().includes(name));
                    dialog.push('<div class="text center">智囊</div>');
                    dialog.push([list1, 'vcard']);
                    dialog.push('<div class="text center">非智囊</div>');
                    dialog.push([list2, 'vcard']);
                    const result = await player.chooseButton(dialog, 2).set('ai', button => {
                        var player = _status.event.player, name = button.link[2];
                        if (get.zhinangs().includes(name)) return -get.effect(player, { name: name }, player, player);
                        else return get.effect(player, { name: name }, player, player) * (1 + player.countCards('hs', name));
                    }).set('filterButton', button => {
                        if (!ui.selected.buttons.length) return true;
                        return get.zhinangs().includes(ui.selected.buttons[0].link[2]) != get.zhinangs().includes(button.link[2]);
                    }).forResult();
                    event.result = {
                        bool: result?.bool,
                        cost_data: result?.links,
                    };
                },
                async content(event, trigger, player) {
                    const links = event.cost_data;
                    if (!get.zhinangs().includes(links[0][2])) links.reverse();
                    const name1 = links[0][2], name2 = links[1][2];
                    game.broadcastAll((name1, name2) => {
                        const list = (_status.connectMode ? lib.configOL : lib.config).zhinang_tricks;
                        list.remove(name1); list.add(name2);
                    }, name1, name2);
                    game.log(player, '从智囊中移除了', '#y' + get.translation(name1));
                    game.log(player, '向智囊中添加了', '#y' + get.translation(name2));
                    await game.delayx();
                },
            },
            //神太史慈
            fh_powei: {
                audio: 'tspowei',
                dutySkill: true,
                derivation: 'shenzhu',
                group: ['tspowei_init', 'tspowei_move', 'tspowei_use', 'tspowei_remove', 'fh_powei_achieve', 'fh_powei_fail'],
                subSkill: {
                    achieve: {
                        audio: 'tspowei1.mp3',
                        trigger: { player: 'phaseBegin' },
                        forced: true,
                        skillAnimation: true,
                        animationColor: 'metal',
                        filter(event, player) {
                            return !game.hasPlayer(current => current.hasMark('dulie'));
                        },
                        content() {
                            game.log(player, '成功完成使命');
                            player.awakenSkill('fh_powei');
                            player.addSkills('shenzhu');
                        },
                    },
                    fail: {
                        audio: 'tspowei2.mp3',
                        trigger: { player: 'damageBegin4' },
                        filter(event, player) {
                            return event.num >= player.getHp();
                        },
                        forced: true,
                        content() {
                            'step 0'
                            game.log(player, '使命失败');
                            player.awakenSkill('fh_powei');
                            trigger.cancel();
                            'step 1'
                            game.filterPlayer().forEach(target => {
                                if (target.hasMark('dulie')) target.removeMark('dulie', target.countMark('dulie'));
                            });
                            'step 2'
                            var num = player.countCards('e');
                            if (num > 0) player.chooseToDiscard('e', true, num);
                        },
                    },
                },
            },
            //神典韦
            fh_qiexie: {
                audio: 'qiexie',
                inherit: 'qiexie',
                getList: (() => {
                    const config = [//权重，武将组，是否强制在前三张武将牌出现
                        { weight: 1, list: ['ol_sb_guanyu'] },
                        { weight: 2, list: ['clan_xuncan', 'ol_jiangwei'] },
                        { weight: 2, list: ['zhangfei'], forced: true },
                        { weight: 3, list: ['hansui', 'yadan'] },
                        { weight: 4, list: ['re_huangzhong', 're_xiahouyuan'] },
                        { weight: 5, list: ['guanyu', 'zhaoyun', 'machao', 'xuzhu', 'lvbu', 'lvmeng', 'daqiao', 'zhugeliang'], forced: true },
                        { weight: 5, list: ['huangyueying', 'liubei', 'sunquan', 'caocao', 'ganning', 'huanggai', 'zhangliao', 'xiahoudun', 'simayi', 'luxun', 'zhouyu', 'diaochan'], forced: true },
                    ];
                    const map = new Map();
                    config.forEach(({ weight, list, forced }, idx) => {
                        if (forced) list._fh_qiexie_fixed = true;
                        map.set(`${idx}_${weight}`, list);
                    });
                    return map;
                })(),
                derivation: 'fh_qiexie_faq',
                async content(event, trigger, player) {
                    if (!_status.characterlist) lib.skill.pingjian.initList();
                    if (lib.skill.fh_qiexie?.getList.size > 0) {
                        let list = [], filter = i => {
                            if (!(_status.characterlist.includes(i) && !list.includes(i))) return false;
                            return !['guanyu', 'zhangfei'].includes(i) || !list.includes(i === 'guanyu' ? 'zhangfei' : 'guanyu');
                        };
                        while (list.length < 5) {
                            let name = [...lib.skill.fh_qiexie.getList.entries()].reduce((limits, [key, listx]) => {
                                if (list.length < 3 && !listx._fh_qiexie_fixed) return limits;
                                let names = listx.filter(filter);
                                if (names.length) {
                                    let weight = parseInt(key.split('_')[1]);
                                    limits.push(...Array(weight).fill(names));
                                }
                                return limits;
                            }, []);
                            if (name.length) list.push(name.flat().randomGet());
                            else break;
                        }
                        if (list.length > 0) {
                            let num = player.countEmptySlot(1);
                            let result = await player.chooseButton([
                                '挈挟：选择' + (num > 1 ? '至多' : '') + get.cnNumber(num) + '张武将置入武器栏',
                                [list, lib.skill.qiexie.$createButton],
                            ], [1, num], true).set('ai', button => {
                                let name = button.link, info = get.character(name);
                                return (info.skills ?? []).reduce((sum, skill) => {
                                    let info = get.skillInfoTranslation(skill);
                                    if (info?.includes('【杀】')) {
                                        let list = get.skillCategoriesOf(skill);
                                        list.remove('锁定技');
                                        if (!list.length) return sum + get.skillRank(skill, 'in');
                                    }
                                    return sum;
                                }, 0.2);
                            }).forResult();
                            if (result?.bool && result.links?.length) {
                                list = result.links;
                                _status.characterlist.removeArray(list);
                                game.addVideo('skill', player, ['qiexie', [list]])
                                game.broadcastAll((player, list) => {
                                    player.tempname.addArray(list);
                                    for (let name of list) lib.skill.qiexie.createCard(name);
                                }, player, list);
                                let cards = list.map(name => game.createCard(`qiexie_${name}`, 'none', 'none'));
                                player.$gain2(cards);
                                await game.delayx();
                                for (let card of cards) await player.equip(card);
                            }
                        }
                    }
                },
            },
            fh_cuijue: {
                audio: 'cuijue',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.countDiscardableCards(player, 'he') > 0;
                },
                filterCard(card, player) {
                    const event = get.event(), func = player => {
                        if (!ui.selected.cards.length) {
                            game.countPlayer(target => target.unprompt());
                        }
                        else {
                            const targets = game.filterPlayer(target => {
                                if (player.getStorage('fh_cuijue_used').includes(target) || !player.inRange(target)) return false;
                                const distance = get.distance(player, target);
                                return !game.hasPlayer(current => (current !== target && player.inRange(current) && get.distance(player, current) > distance));
                            });
                            if (targets.length > 0) {
                                for (const target of targets) target.prompt(`可${get.translation('fh_cuijue')}`);
                            }
                        }
                    };
                    if (event.player === game.me) func(player);
                    else if (event.isOnline()) player.send(func, player);
                    return !ui.selected.cards.length && lib.filter.cardDiscardable(card, player);
                },
                selectCard: [1, 2],
                position: 'he',
                complexCard: true,
                check(card) {
                    const player = get.player(), val = get.value(card);
                    const targets = game.filterPlayer(target => {
                        if (player.getStorage('fh_cuijue_used').includes(target) || get.damageEffect(target, player, player) <= Math.max(0, val)) return false;
                        let bool = false;
                        try {
                            ui.selected.cards.add(card);
                            if (player.inRange(target)) {
                                const distance = get.distance(player, target);
                                bool = !game.hasPlayer(current => (current !== target && player.inRange(current) && get.distance(player, current) > distance));
                            }
                        } catch (e) {
                            console.trace(e);
                        }
                        ui.selected.cards.remove(card);
                        return bool;
                    });
                    if (!targets.length) return 0;
                    return Math.max(...targets.map(target => get.damageEffect(target, player, player))) - val;
                },
                async content(event, trigger, player) {
                    const targets = game.filterPlayer(target => {
                        if (player.getStorage('fh_cuijue_used').includes(target) || !player.inRange(target)) return false;
                        const distance = get.distance(player, target);
                        return !game.hasPlayer(current => (current !== target && player.inRange(current) && get.distance(player, current) > distance));
                    });
                    if (targets.length) {
                        const result = targets.length > 1 ? await player.chooseTarget((card, player, target) => {
                            if (player.getStorage('fh_cuijue_used').includes(target) || !player.inRange(target)) return false;
                            const distance = get.distance(player, target);
                            return !game.hasPlayer(current => (current !== target && player.inRange(current) && get.distance(player, current) > distance));
                        }, `${get.translation(event.name)}：对其中一名角色造成1点伤害`, true).set('ai', target => {
                            const player = get.player();
                            return get.damageEffect(target, player, player);
                        }).forResult() : { bool: true, targets: targets };
                        if (result?.bool && result.targets?.length) {
                            const [target] = result.targets;
                            player.line(target);
                            player.addTempSkill('fh_cuijue_used', 'phaseUseAfter');
                            player.markAuto('fh_cuijue_used', [target]);
                            await target.damage('nocard');
                        }
                    }
                },
                ai: {
                    order: 1,
                    result: {
                        player(player) {
                            return Number(player.hasCard(card => {
                                if (!lib.filter.cardDiscardable(card, player)) return false;
                                return game.hasPlayer(target => {
                                    if (player.getStorage('fh_cuijue_used').includes(target) || get.damageEffect(target, player, player) <= Math.max(0, get.value(card))) return false;
                                    let bool = false;
                                    try {
                                        ui.selected.cards.add(card);
                                        if (player.inRange(target)) {
                                            const distance = get.distance(player, target);
                                            bool = !game.hasPlayer(current => (current !== target && player.inRange(current) && get.distance(player, current) > distance));
                                        }
                                    } catch (e) {
                                        console.trace(e);
                                    }
                                    ui.selected.cards.remove(card);
                                    return bool;
                                });
                            }, 'he'));
                        },
                    },
                    tag: { damage: 1 },
                },
                subSkill: {
                    used: {
                        onremove: true,
                        charlotte: true,
                    },
                },
            },
            //孙刘
            fh_weidang: {
                audio: 'dcweidang',
                inherit: 'dcweidang',
                filter(event, player) {
                    var num = lib.skill.dcqinshen.getNum();
                    return event.player != player && player.countCards('hs', card => _status.connectMode || (get.cardNameLength(card) == num && player.hasUseTarget(card)));
                },
                content() {
                    player.chooseToUse(card => {
                        if (get.cardNameLength(card) != lib.skill.dcqinshen.getNum()) return false;
                        return lib.filter.cardEnabled(card, _status.event.player, _status.event);
                    }, '###' + get.prompt('fh_weidang') + '###使用一张字数为' + lib.skill.dcqinshen.getNum() + '的牌').logSkill = 'fh_weidang';
                },
            },
            //李严
            fh_duliang: {
                audio: 'duliang',
                enable: 'phaseUse',
                filterTarget(card, player, target) {
                    return player != target && target.countCards('h') > 0;
                },
                usable: 1,
                content() {
                    'step 0'
                    player.gainPlayerCard(target, 'h', true, [1, Math.max(1, target.getDamagedHp())]);
                    'step 1'
                    if (!result.bool) { event.finish(); return; }
                    var num = result.cards.length;
                    event.num = num;
                    var name = get.translation(target);
                    player.chooseControl().set('prompt', '督粮：请选择一项').set('choiceList', [
                        '令' + name + '于下个摸牌阶段多摸' + get.cnNumber(num) + '张牌',
                        '令' + name + '观看牌堆顶的' + get.cnNumber(num * 2) + '张牌，然后获得其中的基本牌',
                    ]).set('ai', () => Math.floor(Math.random()));
                    'step 2'
                    if (result.index == 1) {
                        var cards = get.cards(2 * num, true);
                        target.chooseButton(['督粮：选择获得其中任意张基本牌', cards], [1, cards.length]).set('allowChooseAll', true).set('filterButton', button => get.type2(button.link) == 'basic').set('ai', button => get.value(button.link));
                    }
                    else {
                        target.addSkill('duliang2');
                        target.addMark('duliang2', num, false);
                        event.finish();
                    }
                    'step 3'
                    if (result.bool) target.gain(result.links, 'gain2');
                    'step 4'
                    game.updateRoundNumber();
                },
                ai: {
                    order: 4,
                    result: {
                        target(player, target) {
                            return -Math.max(1, target.getDamagedHp());
                        },
                    },
                },
            },
            fh_fulin: {
                audio: 'fulin',
                trigger: { player: 'gainAfter', global: 'loseAsyncAfter' },
                filter(event, player) {
                    if (_status.currentPhase != player) return false;
                    if (event.getParent(2).name == 'fh_fulin_effect') return false;
                    return event.getg?.(player)?.length;
                },
                async cost(event, trigger, player) {
                    const cards = trigger.getg(player).slice();
                    const result = await player.chooseToMove('###' + get.prompt('fh_fulin') + '###将任意张本次获得的牌以任意顺序置于牌堆顶，于回合结束时摸等量的牌').set('list', [
                        ['本次获得的牌', cards],
                        ['牌堆顶'],
                    ]).set('processAI', list => {
                        const player = get.player();
                        if (!player.needsToDiscard()) return false;
                        const cards = list[0][1].slice();
                        cards.sort((a, b) => player.getUseValue(a) - player.getUseValue(b));
                        const cards2 = cards.slice(0, player.needsToDiscard());
                        cards.removeArray(cards2);
                        return [cards, cards2];
                    }).set('filterOk', moved => moved[1].length > 0).forResult();
                    event.result = {
                        bool: result?.bool,
                        cost_data: result?.moved,
                    };
                },
                async content(event, trigger, player) {
                    const cards = event.cost_data[1];
                    const num = cards.length;
                    player.$throw(cards.length, 1000);
                    game.log(player, '将', cards, '置于了牌堆顶');
                    await player.lose(cards, ui.cardPile, 'insert');
                    player.addTempSkill(event.name + '_effect');
                    player.addMark(event.name + '_effect', num, false);
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '本回合已将#张牌置于牌堆顶' },
                        trigger: { player: 'phaseEnd' },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            const num = player.countMark(event.name);
                            player.removeSkill(event.name);
                            await player.draw(num);
                        },
                    }
                }
            },
            //黄皓
            fh_qinqing: {
                audio: 'dcqinqing',
                inherit: 'dcqinqing',
                async content(event, trigger, player) {
                    var result = await player.chooseTarget(get.prompt2('fh_qinqing'), function (card, player, target) {
                        var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
                        return target != player && target.inRange(zhu) && target.countDiscardableCards(player, 'he') > 0;
                    }, [1, Infinity]).set('ai', function (target) {
                        var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
                        var he = target.countCards('he');
                        if (get.attitude(_status.event.player, target) > 0) {
                            if (target.countCards('h') > zhu.countCards('h') + 1) return 0.1;
                        }
                        else {
                            if (he > zhu.countCards('h') + 1) return 2;
                            if (he > 0) return 1;
                        }
                        return 0;
                    }).forResult();
                    if (result.bool) {
                        var targets = result.targets.sortBySeat();
                        player.logSkill('fh_qinqing', targets);
                        for (const target of targets) {
                            if (target.countCards('he')) await player.discardPlayerCard(target, 'he', true);
                        }
                        var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
                        if (zhu?.isIn()) {
                            var num = targets.filter(target => target.countCards('h') > zhu.countCards('h')).length;
                            if (num > 0) await player.draw(num);
                        }
                    }
                },
            },
            //孙登
            fh_kuangbi: {
                audio: 'rekuangbi',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return game.hasPlayer(current => current.countCards('he') && current != player);
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                        return target.countCards('he') > 0 && target != player;
                    }).set('ai', target => {
                        var player = _status.event.player;
                        if (_status.event.goon) return get.attitude(player, target) * Math.sqrt(target.countCards('he'));
                        return -get.attitude(player, target) / (target.countCards('he') + 1) * 10;
                    }).set('goon', player.countCards('hs', card => player.hasValueTarget(card)) >= 2).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    if (!target.countCards('he')) return;
                    const result = await target.chooseCard('匡弼：将至多三张牌置于' + get.translation(player) + '的武将牌上', 'he', [1, 3], true, 'allowChooseAll').set('ai', card => {
                        if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
                            return 7 - get.value(card);
                        }
                        return -get.value(card);
                    }).forResult();
                    if (result.bool) {
                        const effect = event.name + '_effect'
                        const next = player.addToExpansion(result.cards, target, 'give');
                        next.gaintag.add(effect);
                        await next;
                        player.addTempSkill(effect, { player: 'phaseUseAfter' });
                        player.markAuto(effect, [target]);
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        audio: 'rekuangbi',
                        trigger: { player: 'useCard' },
                        filter(event, player) {
                            return player.getExpansions('fh_kuangbi_effect').length > 0;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            const cards = player.getExpansions(event.name);
                            const suit = get.suit(trigger.card), cardsx = cards.filter(card => get.suit(card) == suit);
                            const bool = cardsx.length;
                            const targets = player.getStorage(event.name).filter(current => current.isIn());
                            const str = bool ? `匡弼：移去一张同花色的“匡弼”牌并${targets.length ? `与${get.translation(targets)}各` : ''}摸一张牌` : '匡弼：移去一张“匡弼”牌并摸一张牌';
                            const next = player.chooseButton([str, cards], true).set('direct', true);
                            if (bool) {
                                next.set('filterButton', button => {
                                    return get.suit(button.link) == _status.event.suit;
                                });
                                next.set('suit', suit);
                            }
                            const result = await next.forResult();
                            if (result?.bool) {
                                await player.loseToDiscardpile(result.links);
                                if (bool) await game.asyncDraw([player].addArray(targets).sortBySeat());
                                else await player.draw();
                            }
                        },
                        intro: {
                            content: 'expansion',
                            markcount: 'expansion',
                        },
                        onremove(player, skill) {
                            var cards = player.getExpansions(skill);
                            if (cards.length) player.loseToDiscardpile(cards);
                            delete player.storage[skill];
                        },
                    },
                },
            },
            //辛宪英
            fh_caishi: {
                inherit: 'recaishi',
                async cost(event, trigger, player) {
                    const cards = [];
                    player.getHistory('gain', evt => {
                        if (evt.getParent().name == 'draw' && evt.getParent('phaseDraw') == trigger) cards.addArray(evt.cards);
                    });
                    const isSame = lib.skill.recaishi.isSame(trigger);
                    let str = `展示${get.translation(cards)}，然后`;
                    if (lib.skill.recaishi.isSame(trigger)) str += '本回合你修改〖忠鉴〗为“出牌阶段限两次”';
                    else if (player.isDamaged()) str += '回复1点体力，然后本回合内不能对自己使用牌';
                    event.result = await player.chooseBool(get.prompt(event.skill), str).set('choice', (() => {
                        if (isSame) return true;
                        if (player.countCards('h', 'tao')) return false;
                        if (player.hp < 2) return true;
                        return player.countCards('h', card => {
                            const info = get.info(card);
                            return info && (info.toself || info.selectTarget == -1) && player.canUse(card, player) && player.getUseValue(card) > 0;
                        }) == 0;
                    })()).forResult();
                    if (event.result.bool) event.result = {
                        bool: true,
                        cards,
                        cost_data: isSame ? 'rewrite' : 'recver',
                    }
                },
                async content(event, trigger, player) {
                    await player.showCards(event.cards, get.translation(player) + '发动了技能【才识】');
                    if (event.cost_data === 'rewrite') {
                        player.addTempSkill('rezhongjian_rewrite');
                    } else {
                        await player.recover();
                        player.addTempSkill(event.name + '_effect');
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        mark: true,
                        intro: { content: '本回合内不能对自己使用牌' },
                        mod: {
                            targetEnabled(card, player, target) {
                                if (player == target) return false;
                            },
                        },
                    },
                },
            },
            //吴苋
            fh_daiyan: {
                init() {
                    game.initFh_cardPile();
                },
                getList(player) {
                    var list = [], history = player.actionHistory;
                    for (var i = history.length - 2; i >= 0; i--) {
                        if (history[i].isSkipped) continue;
                        if (history[i].isMe) {
                            for (var evt of history[i].useSkill) {
                                if (evt.skill == 'fh_daiyan') list.addArray(evt.targets);
                            }
                            break;
                        }
                    }
                    return list;
                },
                audio: 'daiyan',
                trigger: { player: 'phaseJieshuBegin' },
                filter(event, player) {
                    return get.fh_cardPile(card => get.type(card) == 'basic') && game.hasPlayer(current => player !== current);
                },
                async cost(event, trigger, player) {
                    const list = get.info(event.skill).getList(player);
                    const next = player.chooseButtonTarget({
                        createDialog: [get.prompt2(event.skill), _status.fh_cardPile.filter(card => get.type(card) == 'basic')],
                        filterTarget: lib.filter.notMe,
                        list,
                        ai1(button) {
                            const { player, list } = get.event();
                            if (button.link.name == 'du' && game.hasPlayer(current => player !== current && get.attitude(player, current) < 0)) return 10;
                            return get.value(button.link);
                        },
                        ai2(target) {
                            const { player, list } = get.event();
                            const { link } = ui.selected.buttons[0];
                            if (list.includes(target)) {
                                if (link.name == 'du') return -3 * get.attitude(player, target);
                                return 0;
                            }
                            if (link.name == 'du') return -2 * get.attitude(player, target);
                            return get.attitude(player, target);
                        },
                    });
                    next.set('targetprompt2', next.targetprompt2.concat([
                        target => {
                            if (!target.isIn()) return false;
                            if (get.event().list.includes(target)) return '失去体力';
                            return '';
                        },
                    ]));
                    const result = await next.forResult();
                    event.result = {
                        bool: result?.bool,
                        targets: result?.targets,
                        cost_data: result?.links,
                    };
                },
                async content(event, trigger, player) {
                    const list = get.info(event.name).getList(player);
                    const target = event.targets[0];
                    await target.gain(event.cost_data, 'gain2', 'fromFh_cardPile');
                    if (list.includes(target)) await target.loseHp();
                },
            },
            //曹节
            fh_shouxi: {
                audio: 'shouxi',
                trigger: { target: 'useCardToTargeted' },
                filter(event, player) {
                    if (!event.player.isIn() || event.player == player) return false;
                    return event.card.name == 'sha' || get.type(event.card) == 'trick';
                },
                async cost(event, trigger, player) {
                    const result = await player.chooseButton([get.prompt2(event.skill), [['basic', 'trick', 'equip'].map(type => ['', '', 'caoying_' + type]), 'vcard']]).set('ai', button => {
                        const player = get.player();
                        const trigger = _status.event.getTrigger();
                        const name = button.link[2], target = trigger.player;
                        if (get.effect(player, trigger.card, target, player) > 0) return 0;
                        if (!target.getDiscardableCards(target, 'h').some(card => get.type2(card) == name)) return 2 + Math.random();
                        return 1 + Math.random();
                    }).forResult();
                    event.result = {
                        bool: result?.bool,
                        cost_data: result?.links,
                    };
                },
                async content(event, trigger, player) {
                    const type = event.cost_data[0][2].slice(8);
                    player.popup(type);
                    game.log(player, '声明了', '#y' + get.translation(type) + '牌');
                    const result = await trigger.player.chooseToDiscard(`守玺：是否弃置一张手牌中的${get.translation(type)}牌？`, `若如此做，你可以获得${get.translation(player)}一张手牌，否则${get.translation(trigger.card)}对其无效`, function (card, player) {
                        return get.type2(card) == _status.event.typex;
                    }).set('ai', card => Math.max(0, _status.event.eff) * (10 - get.value(card))).set('eff', get.effect(player, trigger.card, trigger.player, trigger.player)).set('typex', type).forResult();
                    if (result?.bool) await trigger.player.gainPlayerCard(player, 'h');
                    else trigger.getParent().excluded.add(player);
                },
                ai: {
                    effect: {
                        target(card, player, target, current) {
                            if ((card.name == 'sha' || get.type(card) == 'trick') && get.attitude(player, target) < 0) {
                                if (_status.event.name == 'fh_shouxi') return;
                                var bs = player.getCards('h');
                                for (var type of ['basic', 'trick', 'equip']) {
                                    if (!player.getCards('h').some(card => get.type2(card) == type)) return 0;
                                }
                                if (player.hasSkill('jiu') || player.hasSkill('tianxianjiu')) return;
                                if (bs.length <= 3 && player.countCards('h', card => card.name == 'sha' || get.type(card) == 'trick') <= 1) {
                                    for (var i = 0; i < bs.length; i++) {
                                        if (bs[i].name != 'sha' && get.type(bs[i]) != 'trick' && get.value(bs[i]) < 7) {
                                            return [1, 0, 1, -0.5];
                                        }
                                    }
                                    return 0;
                                }
                                return [1, 0, 1, -0.5];
                            }
                        },
                    },
                },
            },
            fh_huimin: {
                audio: 'huimin',
                trigger: { player: 'phaseJieshuBegin' },
                filter(event, player) {
                    return game.hasPlayer(target => target.countCards('h') < target.getHp());
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2('fh_huimin'), function (card, player, target) {
                        return target.countCards('h') < target.getHp();
                    }, [1, Infinity]).set('ai', target => get.attitude(_status.event.player, target)).forResult();
                },
                async content(event, trigger, player) {
                    const targets = event.targets.sortBySeat();
                    await player.draw(targets.length);
                    if (_status.connectMode) game.broadcastAll(() => (_status.noclearcountdown = true));
                    let given_map = new Map();
                    while (player.hasCard(card => !card.hasGaintag('olsujian_given'), 'h') && game.hasPlayer(current => targets.includes(current) && !given_map.has(current))
                    ) {
                        const result = await player.chooseCardTarget({
                            filterCard(card, player) {
                                return !card.hasGaintag('olsujian_given')
                            },
                            filterTarget(card, player, target) {
                                if (!_status.event.targets.includes(target)) return false;
                                return !_status.event.given_map.has(target);
                            },
                            targets,
                            given_map,
                            forced: true,
                            position: 'h',
                            animate: false,
                            prompt: '惠民：交给目标角色各一张手牌',
                            ai1(card) {
                                if (card.name == 'shan') return 1;
                                return Math.random();
                            },
                            ai2(target) {
                                const player = get.player();
                                const card = ui.selected.cards[0];
                                return get.value(card, target) * get.attitude(player, target);
                            },
                        }).forResult();
                        if (result?.bool && result?.cards?.length && result?.targets?.length) {
                            const { cards, targets: [target] } = result;
                            given_map.set(target, cards);
                            player.addGaintag(cards, 'olsujian_given');
                        } else break;
                    }
                    if (_status.connectMode) {
                        game.broadcastAll(() => {
                            delete _status.noclearcountdown;
                            game.stopCountChoose();
                        });
                    }
                    if (given_map.size) {
                        await game.loseAsync({
                            gain_list: Array.from(given_map),
                            player: player,
                            cards: Array.from(given_map.values()).flat(),
                            giver: player,
                            animate: 'giveAuto',
                        }).setContent('gaincardMultiple');
                    }
                },
            },
            //嵇康
            fh_qingxian: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'qingxian',
                group: ['fh_qingxian_jilie', 'fh_qingxian_rouhe', 'fh_qingxian_dying'],
                ai: {
                    threaten: 0.8,
                    maixie: true,
                    maixie_hp: true,
                    maixie_defend: true,
                    effect: {
                        target(card, player, target) {
                            if (get.tag(card, 'damage')) {
                                if (target.hp > 1 && target.hasFriend()) return 0.4;
                            }
                        },
                    },
                },
                subSkill: {
                    dying: {
                        audio: 'qingxian',
                        trigger: { global: 'dyingAfter' },
                        filter(event, player) {
                            return player.storage.fh_qingxian && player.storage.fh_qingxian > 0 && !_status.dying.length;
                        },
                        direct: true,
                        content() {
                            'step 0'
                            player.storage.fh_qingxian--;
                            player.chooseTarget(get.prompt('fh_qingxian'), function (card, player, target) {
                                return target != player;
                            }).set('ai', function (target) {
                                var att = get.attitude(_status.event.player, target);
                                if (target.isHealthy() && att > 0) return 0;
                                if (target.hp == 1 && att != 0) {
                                    if (att > 0) return 9;
                                    else return 10;
                                }
                                else return Math.sqrt(Math.abs(att));
                            }).set('prompt2', '当你回复体力后，你可以令一名其他角色执行一项：失去1点体力，从额外牌堆随机使用一张装备牌；回复1点体力，弃置一张装备牌。若其以此法使用或弃置的牌为梅花，你回复1点体力');
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('fh_qingxian', target);
                                event.insert(lib.skill.fh_qingxian.content_choose, { target: target, player: player });
                            }
                            'step 2'
                            if (lib.skill.fh_qingxian_dying.filter(trigger, player)) event.goto(0);
                        },
                    },
                    rouhe: {
                        audio: 'qingxian',
                        trigger: { player: 'recoverEnd' },
                        direct: true,
                        content() {
                            'step 0'
                            if (_status.dying.length) {
                                player.storage.fh_qingxian ??= 0;
                                player.storage.fh_qingxian++;
                                event.finish();
                                return;
                            }
                            player.chooseTarget(get.prompt('fh_qingxian'), function (card, player, target) {
                                return target != player;
                            }).set('ai', function (target) {
                                var att = get.attitude(_status.event.player, target);
                                if (target.isHealthy() && att > 0) return 0;
                                if (target.hp == 1 && att != 0) {
                                    if (att > 0) return 9;
                                    else return 10;
                                }
                                else return Math.sqrt(Math.abs(att));
                            }).set('prompt2', '当你回复体力后，你可以令一名其他角色执行一项：失去1点体力，从额外牌堆随机使用一张装备牌；回复1点体力，弃置一张装备牌。若其以此法使用或弃置的牌为梅花，你回复1点体力');
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('fh_qingxian', target);
                                event.insert(lib.skill.fh_qingxian.content_choose, { target: target, player: player });
                            }
                        },
                    },
                    jilie: {
                        audio: 'qingxian',
                        trigger: { player: 'damageEnd' },
                        filter(event, player) {
                            return event.source && event.source.isIn();
                        },
                        check(event, player) {
                            return !(get.attitude(player, event.source) > 0 && event.source.isHealthy());
                        },
                        logTarget: 'source',
                        prompt2: '当你受到伤害后，你可以令伤害来源执行一项：失去1点体力，从额外牌堆随机使用一张装备牌；回复1点体力，弃置一张装备牌。若其以此法使用或弃置的牌为梅花，你回复1点体力',
                        content() {
                            event.insert(lib.skill.fh_qingxian.content_choose, { target: trigger.source, player: player });
                        },
                    },
                },
                content_choose() {
                    'step 0'
                    if (target.isHealthy()) event._result = { index: 0 }
                    else {
                        player.chooseControl().set('ai', () => _status.event.index).set('choiceList', [
                            '令' + get.translation(target) + '失去1点体力，从额外牌堆随机使用一张装备牌',
                            '令' + get.translation(target) + '回复1点体力，弃置一张装备牌',
                        ]).set('index', Math.max(0, Math.sign(get.attitude(player, target))));
                    }
                    'step 1'
                    if (result.index == 0) {
                        target.loseHp();
                        event.card = get.fh_cardPile(card => get.type(card) == 'equip' && target.canUse(card, target));
                        if (event.card) {
                            target.chooseUseTarget(event.card, 'nothrow', 'nopopup', true);
                            event.goto(3);
                        }
                        else event.finish();
                    }
                    else {
                        target.recover();
                        if (target.countCards('he', { type: 'equip' })) {
                            target.chooseToDiscard('清弦：请弃置一张装备牌', function (card) {
                                return get.type(card) == 'equip';
                            }, 'he', true).set('ai', function (card) {
                                var val = -get.value(card);
                                if (get.suit(card) == 'club') {
                                    val += _status.event.att * 10;
                                }
                                return val;
                            }).set('att', get.sgnAttitude(target, player));
                        }
                        else event.finish();
                    }
                    'step 2'
                    if (result?.cards?.length) event.card = result.cards[0];
                    'step 3'
                    if (event.card && get.suit(event.card) == 'club') player.draw();
                },
            },
            fh_juexiang: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'juexiang',
                trigger: { player: 'die' },
                filter(event, player) {
                    return game.hasPlayer(current => current != player);
                },
                forceDie: true,
                skillAnimation: true,
                animationColor: 'thunder',
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set('ai', function (target) {
                        return get.attitude(_status.event.player, target) / Math.sqrt(target.hp + 1);
                    }).set('forceDie', true).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0]
                    player.awakenSkill(event.name);
                    const controls = lib.skill.fh_juexiang.derivation.slice();
                    const result = await player.chooseControl(controls).set('prompt', '绝响：令' + get.translation(target) + '获得其中一个残谱').set('forceDie', true).set('ai', () => 'fh_juexiang_ji').forResult();
                    if (result?.control) target.addSkill(result.control);
                    target.addTempSkill('juexiang_club', { player: 'phaseZhunbeiBegin' });
                },
                derivation: ['fh_juexiang_ji', 'fh_juexiang_lie', 'juexiang_rou', 'juexiang_he'],
                subSkill: {
                    ji: {
                        nopop: true,
                        audio: 'juexiang_ji',
                        trigger: { player: 'damageEnd' },
                        filter(event, player) {
                            return event.source && event.source.isIn() && event.source != player;
                        },
                        check(event, player) {
                            return get.attitude(player, event.source) < 0;
                        },
                        logTarget: 'source',
                        content() {
                            trigger.source.loseHp();
                            var card = get.fh_cardPile(card => get.type(card) == 'equip' && trigger.source.canUse(card, trigger.source));
                            if (card) trigger.source.chooseUseTarget(card, 'nothrow', 'nopopup', true);
                        },
                        mark: true,
                        intro: { content: 'info' },
                        ai: { maixie_defend: true },
                    },
                    lie: {
                        nopop: true,
                        audio: 'juexiang_lie',
                        trigger: { player: 'recoverEnd', global: 'dyingAfter' },
                        direct: true,
                        content() {
                            'step 0'
                            if (_status.dying.length) {
                                if (event.triggername == 'recoverEnd') {
                                    player.storage.fh_juexiang_lie ??= 0;
                                    player.storage.fh_juexiang_lie++;
                                }
                                event.finish();
                                return;
                            }
                            if (event.triggername == 'dyingAfter') {
                                if (!player.storage.fh_juexiang_lie) {
                                    event.finish();
                                    return;
                                }
                                player.storage.fh_juexiang_lie--;
                            }
                            player.chooseTarget(get.prompt2('fh_juexiang_lie'), lib.filter.notMe).set('ai', target => -get.attitude(_status.event.player, target) / (1 + target.hp));
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('fh_juexiang_lie', target);
                                target.loseHp();
                                var card = get.fh_cardPile(card => get.type(card) == 'equip' && trigger.source.canUse(card, trigger.source));
                                if (card) target.chooseUseTarget(card, true, 'nothrow', 'nopopup', true);
                            }
                            if (event.triggername == 'dyingAfter' && player.storage.fh_juexiang_lie > 0) event.goto(0);
                        },
                        mark: true,
                        intro: { content: 'info' },
                    },
                },
            },
            //诸葛尚
            fh_sangu: {
                audio: 'sangu',
                trigger: { global: 'phaseUseBegin' },
                filter(event, player) {
                    return event.player.countCards('h') >= event.player.maxHp;
                },
                check(event, player) {
                    return get.attitude(player, event.player) > 0;
                },
                logTarget: 'player',
                async content(event, trigger, player) {
                    var target = trigger.player;
                    var cards = get.cards(3, true);
                    var result = await player.chooseButton(['三顾：亮出其中任意张牌名各不相同的牌', cards], [1, 3]).set('filterButton', button => {
                        if (get.type(button.link) != 'basic' && get.type(button.link) != 'trick') return false;
                        return !ui.selected.buttons.some(but => get.name(but.link) == get.name(button.link));
                    }).set('ai', button => _status.event.target.getUseValue(button.link)).set('target', target).forResult();
                    if (result.bool) {
                        player.showCards(result.links, get.translation(player) + '发动了【三顾】');
                        target.addTempSkill('fh_sangu_viewAs', 'phaseUseAfter');
                        target.markAuto('fh_sangu_viewAs', result.links.reduce((list, card) => list.add(get.name(card)), []));
                        await game.cardsDiscard(result.links);
                        game.updateRoundNumber();
                    }
                },
                ai: { expose: 0.25 },
                subSkill: {
                    viewAs: {
                        hiddenCard(player, name) {
                            return player.getStorage('fh_sangu_viewAs').includes(name);
                        },
                        intro: { content: '剩余可转化牌名：$' },
                        audio: 'sangu',
                        enable: 'chooseToUse',
                        filter(event, player) {
                            for (var name of lib.inpile) {
                                if (!player.getStorage('fh_sangu_viewAs').includes(name)) continue;
                                if (event.filterCard(get.autoViewAs({ name: name }, 'unsure'), player, event)) return true;
                            }
                            return false;
                        },
                        chooseButton: {
                            dialog(event, player) {
                                var list = [];
                                for (var name of lib.inpile) {
                                    if (!player.getStorage('fh_sangu_viewAs').includes(name)) continue;
                                    if (event.filterCard(get.autoViewAs({ name: name }, 'unsure'), player, event)) list.push([get.translation(get.type(name)), '', name]);
                                }
                                return ui.create.dialog('三顾', [list, 'vcard'], 'hidden');
                            },
                            check(button) {
                                if (button.link[2] == 'shan') return 3;
                                var player = _status.event.player;
                                if (button.link[2] == 'jiu') {
                                    if (player.getUseValue({ name: 'jiu' }) <= 0) return 0;
                                    if (player.countCards('h', 'sha')) return player.getUseValue({ name: 'jiu' });
                                    return 0;
                                }
                                return player.getUseValue({ name: button.link[2], nature: button.link[3] });
                            },
                            backup(links, player) {
                                return {
                                    filterCard: true,
                                    viewAs: {
                                        name: links[0][2],
                                        nature: links[0][3],
                                    },
                                    precontent() {
                                        player.logSkill('fh_sangu_viewAs');
                                        delete event.result.skill;
                                        player.unmarkAuto('fh_sangu_viewAs', [event.result.card.name]);
                                    },
                                }
                            },
                            prompt(links, player) {
                                var name = links[0][2], nature = links[0][3];
                                return '将一张手牌当作' + (get.translation(nature) || '') + get.translation(name) + '使用';
                            },
                        },
                        ai: {
                            order(item, player) {
                                if (player && _status.event.type == 'phase') {
                                    var max = 0;
                                    var list = lib.inpile.filter(name => player.getStorage('fh_sangu_viewAs').includes(name));
                                    list = list.map(namex => { return { name: namex, isCard: true } });
                                    for (var card of list) {
                                        if (player.getUseValue(card) > 0) {
                                            var temp = get.order(card);
                                            if (temp > max) max = temp;
                                        }
                                    }
                                    if (max > 0) max += 0.3;
                                    return max;
                                }
                                return 1;
                            },
                            respondShan: true,
                            respondSha: true,
                            skillTagFilter(player, tag, arg) {
                                if (arg == 'respond') return false;
                                return !player.getStorage('fh_sangu_viewAs').includes(tag == 'respondSha' ? 'sha' : 'shan');
                            },
                            result: {
                                player(player) {
                                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                                    return 1;
                                },
                            },
                        },
                    },
                },
            },
            //陆凯
            fh_bushi: {
                audio: 'lkbushi',
                getBushi(player) {
                    if (!player.storage.fh_bushi) return ['spade', 'heart', 'club', 'diamond'];
                    return player.storage.fh_bushi;
                },
                onremove: true,
                trigger: { player: 'phaseZhunbeiBegin' },
                async cost(event, trigger, player) {
                    let list = lib.skill.fh_bushi.getBushi(player);
                    list = list.map(function (i) {
                        return ['', '', 'lukai_' + i];
                    });
                    const next = player.chooseToMove('卜筮：是否调整〖卜筮〗的花色顺序？');
                    next.set('list', [
                        ['无次数限制花色/使用打出摸牌花色<br>可弃牌无效花色/弃牌可选花色', [list, 'vcard'], function (list) {
                            const list2 = list.map(function (i) {
                                return get.translation(i[2].slice(6));
                            });
                            return '使用' + list2[0] + '牌无次数限制；使用或打出' + list2[1] + '时摸一张牌；<br>成为' + list2[2] + '牌目标后可弃一张' + list2[3] + '牌无效并获得之';
                        }],
                    ]);
                    next.set('processAI', function () {
                        const player = _status.event.player;
                        const list = lib.skill.fh_bushi.getBushi(player);
                        const list2 = [];
                        let hs = player.getCards('hs', card => player.hasValueTarget(card));
                        list.sort((a, b) => hs.filter((i) => get.suit(i) == b).length - hs.filter((i) => get.suit(i) == a).length);
                        list2.push(list.shift());
                        hs = player.getCards('hs', 'sha');
                        list.sort((a, b) => hs.filter((i) => get.suit(i) == b).length - hs.filter((i) => get.suit(i) == a).length);
                        list2.unshift(list.shift());
                        list.randomSort();
                        list2.addArray(list);
                        return [list2.map((i) => ['', '', 'lukai_' + i])]
                    });
                    const result = await next.forResult();
                    event.result = {
                        bool: result?.bool,
                        cost_data: result?.moved,
                    };
                },
                async content(event, trigger, player) {
                    const list = lib.skill.fh_bushi.getBushi(player), list2 = event.cost_data[0].map(i => i[2].slice(6));
                    for (let i = 0; i < 4; i++) {
                        if (list[i] != list2[i]) {
                            player.storage.fh_bushi = list2;
                            let str = '#g';
                            for (let j = 0; j < 4; j++) {
                                str += get.translation(list2[j]);
                                if (j != 3) str += '/';
                            }
                            game.log(player, '将', '#g【卜筮】', '的花色序列改为', str);
                            await game.delayx();
                            break;
                        }
                    }
                },
                mark: true,
                marktext: '筮',
                intro: {
                    content(storage, player) {
                        var list = lib.skill.fh_bushi.getBushi(player).map((i) => get.translation(i));
                        return '<li>你使用' + list[0] + '牌无次数限制。<br><li>当你使用或打出' + list[1] + '牌时，你摸一张牌。<br><li>当你成为' + list[2] + '牌的目标后，你可以弃置一张' + list[3] + '花色的牌，令此牌对你无效并获得之。';
                    },
                },
                group: ['fh_bushi_unlimit', 'fh_bushi_draw', 'fh_bushi_defend'],
                subSkill: {
                    unlimit: {
                        mod: {
                            cardUsable(card, player) {
                                const suit = get.suit(card);
                                if (suit == 'unsure' || suit == lib.skill.fh_bushi.getBushi(player)[0]) return Infinity;
                            },
                        },
                        trigger: { player: 'useCard1' },
                        filter(event, player) {
                            if (event.addCount === false) return true;
                            return get.suit(event.card) == lib.skill.fh_bushi.getBushi(player)[0];
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        firstDo: true,
                        content() {
                            trigger.addCount = false;
                            var stat = player.getStat().card, name = trigger.card.name;
                            if (stat[name] && typeof stat[name] == 'number') stat[name]--;
                        },
                    },
                    draw: {
                        audio: 'lkbushi',
                        trigger: { player: ['useCard', 'respond'] },
                        filter(event, player) {
                            return get.suit(event.card) == lib.skill.fh_bushi.getBushi(player)[1];
                        },
                        forced: true,
                        locked: false,
                        content() {
                            player.draw();
                        },
                    },
                    defend: {
                        audio: 'lkbushi',
                        trigger: { target: 'useCardToTargeted' },
                        filter(event, player) {
                            var list = lib.skill.fh_bushi.getBushi(player);
                            return get.suit(event.card) == list[2] && !event.excluded.includes(player) && player.countCards('he', card => {
                                if (get.position(card) == 'h' && _status.connectMode) return true;
                                return lib.filter.cardDiscardable(card, player) && get.suit(card) == list[3];
                            }) > 0;
                        },
                        async cost(event, trigger, player) {
                            let str = '弃置一张牌，令' + get.translation(trigger.card) + '对你无效';
                            if (trigger.cards.filterInD().length) str += '并获得' + get.translation(trigger.cards.filterInD());
                            event.result = await player.chooseToDiscard('he', 'chooseonly', get.prompt(event.skill), str, function (card, player) {
                                return get.suit(card) == lib.skill.fh_bushi.getBushi(player)[3];
                            }).set('ai', function (card) {
                                if (_status.event.eff >= 0) return false;
                                return -_status.event.eff * 1.1 - get.value(card);
                            }).set('eff', get.effect(player, trigger.card, trigger.player, player)).forResult();
                        },
                        async content(event, trigger, player) {
                            await player.discard(event.cards);
                            trigger.getParent().excluded.add(player);
                            if (trigger.cards.someInD()) await player.gain(trigger.cards.filterInD(), 'gain2');
                        },
                    },
                },
            },
            //科比-能
            //牢大~~~
            fh_kousheng: {
                audio: 'kousheng',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.countCards('h') > 0;
                },
                filterCard: true,
                selectCard: [1, Infinity],
                position: 'h',
                check(card) {
                    var player = _status.event.player;
                    return lib.skill.fh_kousheng.checkx(card, player);
                },
                checkx(card, player) {
                    var standard = player.getUseValue({ name: 'sha' }, null, true);
                    if (standard <= 0) return 0;
                    var eff = player.getUseValue(card, null, true);
                    if (eff <= standard) return standard - eff + 0.1;
                    return 0;
                },
                discard: false,
                lose: false,
                delay: false,
                usable: 1,
                content() {
                    player.showCards(cards, get.translation(player) + '发动了【寇旌】');
                    player.addGaintag(cards, 'kousheng');
                    player.addTempSkill('kousheng_effect');
                },
                ai: {
                    order(item, player) {
                        return player.countCards('h', card => lib.skill.fh_kousheng.checkx(card, player) > 0);
                    },
                    result: { player: 1 },
                },
            },
            //黄月英
            fh_jizhi: {
                audio: 'rejizhi',
                trigger: { player: 'useCard' },
                filter(event) {
                    return get.type2(event.card) == 'trick' && event.card.isCard;
                },
                frequent: true,
                content() {
                    'step 0'
                    player.draw();
                    'step 1'
                    player.chooseToDiscard('是否弃置一张基本牌，令本回合手牌上限+1？', (card, player) => {
                        return get.type(card) == 'basic';
                    }).set('ai', card => {
                        var player = _status.event.player;
                        if (_status.currentPhase != player) return 0;
                        if (player.needsToDiscard() < 2) return 0;
                        return 5 - get.value(card);
                    });
                    'step 2'
                    if (result.bool) {
                        player.addTempSkill('fh_jizhi_effect');
                        player.addMark('fh_jizhi_effect', 1, false);
                    }
                },
                ai: { noautowuxie: true },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        markimage: 'image/card/handcard.png',
                        intro: { content: '本回合手牌上限+#' },
                        mod: {
                            maxHandcard(player, num) {
                                return num + player.countMark('fh_jizhi_effect');
                            },
                        },
                    },
                },
            },
            //甄姬
            fh_luoshen: {
                audio: 'reluoshen',
                trigger: { player: 'phaseZhunbeiBegin' },
                frequent: true,
                content() {
                    'step 0'
                    event.cards = [];
                    'step 1'
                    player.judge(function (card) {
                        return get.color(card) == 'black' ? 1.5 : -1.5;
                    }).set('judge2', result => result.bool).set('callback', () => {
                        if (event.judgeResult.color == 'black') event.getParent().orderingCards.remove(card);
                    });
                    'step 2'
                    if (result.bool) {
                        event.cards.push(result.card);
                        player.chooseBool('是否再次发动【洛神】？').set('frequentSkill', 'fh_luoshen');
                    }
                    else {
                        for (var i = 0; i < event.cards.length; i++) {
                            if (get.position(event.cards[i], true) != 'o') {
                                event.cards.splice(i, 1);
                                i--;
                            }
                        }
                        if (event.cards.length) {
                            player.gain(event.cards, 'gain2');
                            player.addTempSkill('fh_luoshen_add');
                            player.addMark('fh_luoshen_add', 1, false);
                        }
                        event.finish();
                    }
                    'step 3'
                    if (result.bool) event.goto(1);
                    else {
                        for (var i = 0; i < event.cards.length; i++) {
                            if (get.position(event.cards[i], true) != 'o') {
                                event.cards.splice(i, 1); i--;
                            }
                        }
                        if (event.cards.length) {
                            player.gain(event.cards, 'gain2');
                            player.addTempSkill('fh_luoshen_add');
                            player.addMark('fh_luoshen_add', event.cards.length, false);
                        }
                    }
                },
                subSkill: {
                    add: {
                        charlotte: true,
                        onremove: true,
                        mod: {
                            maxHandcard(player, num) {
                                return num + player.countMark('fh_luoshen_add');
                            },
                        },
                    },
                },
            },
            //黄忠
            fh_liegong: {
                inherit: 'xinliegong',
                mod: {
                    targetInRange(card, player, target) {
                        if (card.name == 'sha') return true;
                    },
                },
            },
            //周泰
            fh_buqu: {
                audio: 'buqu',
                trigger: { player: 'dying' },
                filter(event, player) {
                    if (player.hp > 0) return false;
                    return !event.reason || event.reason.getParent().name != 'fh_buqu';
                },
                forced: true,
                preHidden: true,
                content() {
                    player.recover(1 - player.hp);
                    var card = get.cards()[0], cards = player.getExpansions('fh_buqu');
                    player.addToExpansion(card, 'gain2').gaintag.add('fh_buqu');
                    player.showCards(cards.concat([card]), '不屈')
                    var num = get.number(card);
                    if (cards.some(cardx => get.number(cardx) == num)) {
                        player.loseToDiscardpile(card);
                        player.loseHp();
                    }
                },
                mod: {
                    maxHandcardBase(player, num) {
                        if (player.getExpansions('fh_buqu').length) return player.getExpansions('fh_buqu').length;
                    },
                },
                ai: {
                    save: true,
                    mingzhi: true,
                    skillTagFilter(player, tag, target) {
                        if (player != target) return false;
                    },
                },
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                onremove(player, skill) {
                    var cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
            },
            fh_fenji: {
                audio: 'fenji',
                trigger: { global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'], },
                filter(event, player, triggername, target) {
                    return target?.isIn();
                },
                getIndex(event, player) {
                    if (event.getParent().name == 'useCard' || event.getParent().name == 'respond') return false;
                    const storage = player.getStorage('fh_fenji');
                    return game.filterPlayer(target => {
                        if (storage.includes(target)) return false;
                        if (event.name == 'gain' && event.player == target) return false;
                        const evt = event.getl(target);
                        return evt?.hs?.length;
                    }).sortBySeat();
                },
                logTarget: (event, player, triggername, target) => target,
                prompt2: (event, player, triggername, target) => `失去1点体力，令${get.translation(target)}摸两张牌`,
                check(event, player, triggername, target) {
                    return get.attitude(player, target) > 4;
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    if (!player.getStorage(event.name).length) {
                        player.when({ player: 'fh_buquBegin', global: 'phaseAfter' }).step(async () => {
                            player.unmarkSkill(event.name);
                            delete player.storage[event.name];
                        });
                    }
                    player.markAuto(event.name, [target]);
                    await player.loseHp();
                    await target.draw(2);
                },
                onremove: true,
                intro: { content: '本回合已对$发动过技能' },
            },
            //卧龙诸葛
            fh_cangzhuo: {
                audio: 'cangzhuo',
                trigger: { player: 'phaseDiscardBegin' },
                filter(event, player) {
                    return !player.hasHistory('useCard', evt => get.type2(evt.card) == 'trick');
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseCard(get.prompt2(event.skill), (card) => get.type2(card) == 'trick').set('ai', card => {
                        var player = _status.event.player;
                        if (ui.selected.cards.length >= player.needsToDiscard()) return 0;
                        return 1 / (get.value(card) || 0.5);
                    }, [1, Infinity]).set('allowChooseAll', true).forResult();
                },
                async content(event, trigger, player) {
                    await player.showCards(event.cards, get.translation(player) + '发动了【藏拙】');
                    player.addGaintag(event.cards, 'fh_cangzhuo_effect');
                    player.addTempSkill('fh_cangzhuo_effect', 'phaseDiscardAfter');
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove(player, skill) {
                            player.removeGaintag(skill);
                        },
                        mod: {
                            ignoredHandcard(card, player) {
                                if (card.hasGaintag('fh_cangzhuo_effect')) return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (name == 'phaseDiscard' && card.hasGaintag('fh_cangzhuo_effect')) return false;
                            },
                        },
                    },
                },
            },
            //太史慈
            fh_hanzhan: {
                audio: 'hanzhan',
                inherit: 'hanzhan',
                direct: true,
                async content(event, trigger, player) {
                    var targets = player == trigger.player ? (trigger.targets ? trigger.targets.slice(0) : [trigger.target]) : [trigger.player];
                    trigger.fixedResult ??= {};
                    while (targets.length) {
                        var target = targets.shift();
                        var result = await player.choosePlayerCard(target, 'h').set('prompt', get.prompt('fh_hanzhan', target)).set('prompt2', '选择' + get.translation(target) + '的一张手牌作为其频点牌').set('ai', button => {
                            var player = _status.event.player;
                            var target = _status.event.target;
                            if (get.attitude(player, target) > 0) return 0;
                            return get.value(button.link) / (get.number(button.link) + 1);
                        }).set('target', target).forResult();
                        if (result.bool) {
                            player.logSkill('fh_hanzhan', target);
                            trigger.fixedResult[target.playerid] = result.cards[0];
                        }
                    }
                },
                group: 'fh_hanzhan_gain',
                subfrequent: ['gain'],
                subSkill: { gain: { inherit: 'hanzhan_gain' } },
            },
            fh_shuangxiong: {
                audio: 'shuangxiong1',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return game.hasPlayer(target => target.countCards('he', card => {
                        if (get.position(card) == 'h' && (target != player || _status.connectMode)) return true;
                        return lib.filter.cardDiscardable(card, target);
                    }));
                },
                async cost(event, trigger, player) {
                    event.result = await await player.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                        return target.countCards('he', card => {
                            if (get.position(card) == 'h' && target != player && _status.connectMode) return true;
                            return lib.filter.cardDiscardable(card, target);
                        });
                    }).set('ai', target => get.effect(target, { name: 'guohe_copy2' }, target, _status.event.player)).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const result = await target.chooseToDiscard('he', true).forResult();
                    if (result?.bool) {
                        const card = result.cards[0];
                        player.addTempSkill('shuangxiong2');
                        player.markAuto('shuangxiong2', [get.color(card, target)]);
                    }
                },
            },
            fh_xiayong: {
                trigger: { player: 'phaseJieshuBegin' },
                filter(event, player) {
                    var history = player.getHistory('useCard', evt => evt.card.name == 'sha' || evt.card.name == 'juedou');
                    if (!history.length) return false;
                    return !history.some(evtx => !player.hasHistory('sourceDamage', evt => evt.card && evt.card == evtx.card));
                },
                prompt2(event, player) {
                    var history = player.getHistory('useCard', evt => evt.card.name == 'sha' || evt.card.name == 'juedou');
                    return '摸' + get.cnNumber(history.reduce((sum, evtx) => {
                        var historyx = player.getHistory('sourceDamage', evt => evt.card && evt.card == evtx.card);
                        return sum + historyx.reduce((num, evt) => num += evt.num, 0);
                    }, 0)) + '张牌';
                },
                frequent: true,
                content() {
                    var history = player.getHistory('useCard', evt => evt.card.name == 'sha' || evt.card.name == 'juedou');
                    player.draw(history.reduce((sum, evtx) => {
                        var historyx = player.getHistory('sourceDamage', evt => evt.card && evt.card == evtx.card);
                        return sum + historyx.reduce((num, evt) => num += evt.num, 0);
                    }, 0));
                },
            },
            //母兵脸
            fh_zhengrong: {
                mark: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content(storage) {
                        if (storage) return '锁定技，游戏开始时，你将牌堆顶的一张牌称为“荣”置于武将牌上。当你使用指定了其他角色的牌结算完毕后，你将一名其他角色的一张牌称为“荣”置于武将牌上。';
                        return '锁定技，游戏开始时，你将牌堆顶的一张牌称为“荣”置于武将牌上。当你使用指定了其他角色的牌结算完毕后，你将任意手牌与等量的“荣”进行交换。';
                    },
                },
                audio: 'drlt_zhenrong',
                trigger: {
                    player: ['enterGame', 'useCardAfter'],
                    global: 'phaseBefore',
                },
                filter(event, player) {
                    if (event.name == 'useCard') {
                        if (!event.isPhaseUsing(player)) return false;
                        if (!event.targets || event.targets.every(target => target == player)) return false;
                        if (player.storage.fh_zhengrong) return game.hasPlayer(target => target != player && target.countCards('he'));
                        return player.getExpansions('fh_zhengrong').length && player.countCards('h');
                    }
                    return event.name != 'phase' || game.phaseNumber == 0;
                },
                direct: true,
                locked: true,
                content() {
                    'step 0'
                    if (trigger.name != 'useCard') {
                        player.logSkill('fh_zhengrong');
                        player.addToExpansion(get.cards(), 'gain2').gaintag.add('fh_zhengrong');
                        event.finish();
                        return;
                    }
                    if (!player.storage.fh_zhengrong) {
                        event.goto(3);
                        return;
                    }
                    player.chooseTarget(get.prompt('fh_zhengrong'), '将一名其他角色的一张牌称为“荣”置于武将牌上', (card, player, target) => {
                        return target != player && target.countCards('he');
                    }).set('ai', target => get.effect(target, { name: 'guohe_copy2' }, _status.event.player, _status.event.player));
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        event.target = result.targets[0];
                        player.logSkill('fh_zhengrong', target);
                        player.changeZhuanhuanji('fh_zhengrong');
                        player.choosePlayerCard(target, 'he', true);
                    }
                    else event.finish();
                    'step 2'
                    if (result.bool) player.addToExpansion(result.links, target, 'give').gaintag.add('fh_zhengrong');
                    event.finish();
                    'step 3'
                    player.chooseToMove('鸿举：请选择要交换的手牌和“荣”').set('list', [
                        [get.translation(player) + '（你）的“荣”', player.getExpansions('fh_zhengrong'), 'fh_zhengrong_tag'],
                        ['手牌区', player.getCards('h')],
                    ]).set('filterMove', function (from, to) {
                        return typeof to != 'number';
                    }).set('processAI', function (list) {
                        var player = _status.event.player, cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
                            return player.getUseValue(a) - player.getUseValue(b);
                        }), cards2 = cards.splice(0, player.getExpansions('fh_zhengrong').length);
                        return [cards2, cards];
                    }).set('filterOk', moved => moved[1].some(card => get.position(card) != 'h'));
                    'step 4'
                    if (result.bool) {
                        player.logSkill('fh_zhengrong');
                        player.changeZhuanhuanji('fh_zhengrong');
                        var pushs = result.moved[0], gains = result.moved[1];
                        pushs.removeArray(player.getExpansions('fh_zhengrong'));
                        gains.removeArray(player.getCards('h'));
                        if (!pushs.length || pushs.length != gains.length) return;
                        player.addToExpansion(pushs, player, 'giveAuto').gaintag.add('fh_zhengrong');
                        game.log(player, '将', pushs, '作为“荣”置于武将牌上');
                        player.gain(gains, 'gain2');
                    }
                },
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                onremove(player, skill) {
                    var cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
            },
            fh_hongju: {
                derivation: 'fh_qingce',
                audio: 'drlt_hongju',
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return player.getExpansions('fh_zhengrong').length >= 3;
                },
                forced: true,
                juexingji: true,
                skillAnimation: true,
                animationColor: 'thunder',
                content() {
                    'step 0'
                    player.awakenSkill('fh_hongju');
                    player.draw(player.getExpansions('fh_zhengrong').length);
                    'step 1'
                    if (player.countCards('h') == 0) event.goto(3);
                    else {
                        var next = player.chooseToMove('鸿举：请选择要交换的手牌和“荣”');
                        next.set('list', [
                            [get.translation(player) + '（你）的“荣”', player.getExpansions('fh_zhengrong'), 'fh_zhengrong_tag'],
                            ['手牌区', player.getCards('h')],
                        ]);
                        next.set('filterMove', (from, to) => typeof to != 'number');
                        next.set('processAI', function (list) {
                            var player = _status.event.player, cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
                                return player.getUseValue(a) - player.getUseValue(b);
                            }), cards2 = cards.splice(0, player.getExpansions('fh_zhengrong').length);
                            return [cards2, cards];
                        });
                    }
                    'step 2'
                    if (result.bool) {
                        var pushs = result.moved[0], gains = result.moved[1];
                        pushs.removeArray(player.getExpansions('fh_zhengrong'));
                        gains.removeArray(player.getCards('h'));
                        if (!pushs.length || pushs.length != gains.length) return;
                        player.addToExpansion(pushs, player, 'giveAuto').gaintag.add('fh_zhengrong');
                        game.log(player, '将', pushs, '作为“荣”置于武将牌上');
                        player.gain(gains, 'gain2');
                    }
                    'step 3'
                    player.addSkills('fh_qingce');
                },
            },
            fh_qingce: {
                enable: 'phaseUse',
                audio: 'drlt_qingce',
                filter(event, player) {
                    return player.getExpansions('fh_zhengrong').length > 0;
                },
                chooseButton: {
                    dialog(event, player) {
                        return ui.create.dialog('清侧：请选择要移去的“荣”', player.getExpansions('fh_zhengrong'), 'hidden');
                    },
                    backup(links, player) {
                        return {
                            card: links[0],
                            filterCard: () => false,
                            selectCard: -1,
                            filterTarget(card, player, target) {
                                return target.countDiscardableCards(player, 'ej') > 0;
                            },
                            delay: false,
                            audio: 'drlt_qingce',
                            content: lib.skill.fh_qingce.contentx,
                            ai: {
                                result: {
                                    target(player, target) {
                                        return get.effect(target, { name: 'guohe' }, player, target);
                                    },
                                },
                            },
                        }
                    },
                    prompt: () => '弃置场上的一张牌',
                },
                contentx() {
                    'step 0'
                    var card = lib.skill.fh_qingce_backup.card;
                    player.loseToDiscardpile([card]);
                    'step 1'
                    if (target.countDiscardableCards(player, 'ej') > 0) player.discardPlayerCard('hej', true, target);
                },
                ai: {
                    order: 8,
                    result: {
                        player(player) {
                            if (game.hasPlayer(function (target) {
                                return get.effect(target, { name: 'guohe' }, player, player) > 4 * Math.max(0, 5 - player.getExpansions('fh_zhengrong').length);
                            })) return 1;
                            return 0;
                        },
                    },
                },
                subSkill: { backup: {} },
            },
            //凌统
            fh_xuanfeng: {
                audio: 'xuanfeng_xin_lingtong',
                trigger: {
                    player: ['loseAfter', 'phaseDiscardEnd'],
                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                },
                direct: true,
                filter(event, player) {
                    if (event.name == 'phaseDiscard') {
                        var cards = [];
                        player.getHistory('lose', function (evt) {
                            if (evt?.type == 'discard' && evt.getParent('phaseDiscard') == event && evt.hs) cards.addArray(evt.hs);
                        });
                        return cards.length > 1;
                    }
                    else {
                        var evt = event.getl(player);
                        return evt?.es?.length > 0;
                    }
                },
                async content(event, trigger, player) {
                    var result;
                    if (_status.dying.length || _status.currentPhase != player) result = { index: 0, forced: false };
                    else result = await player.chooseControl('选项一', '选项二', 'cancel2').set('choiceList', [
                        '依次弃置其他角色的共计两张牌',
                        '对一名其他角色造成1点伤害',
                    ]).set('ai', () => 1).forResult();
                    if (result.index == 0) {
                        var num = 2, forced = true, logged = false;
                        if (result.forced === false) forced = false;
                        while (num > 0 && game.hasPlayer(target => target != player && target.countDiscardableCards(player, 'he'))) {
                            num--;
                            var result2 = await player.chooseTarget(((num == 1 && !forced) ? get.prompt('fh_xuanfeng') : '请选择【旋风】的目标'), '弃置一名其他角色的一张牌', function (card, player, target) {
                                if (player == target) return false;
                                return target.countDiscardableCards(player, 'he');
                            }).set('ai', target => {
                                var player = _status.event.player;
                                return get.effect(target, { name: 'guohe_copy2' }, player, player);
                            }).set('forced', forced && num == 1).forResult();
                            if (result2.bool) {
                                var target = result2.targets[0];
                                if (!logged) {
                                    player.logSkill('fh_xuanfeng', target);
                                    logged = true;
                                }
                                else player.line(target, 'thunder');
                                await player.discardPlayerCard(target, 'he', true);
                            }
                            else break;
                        }
                    }
                    else if (result.index == 1) {
                        var result2 = await player.chooseTarget('请选择【旋风】的目标', '对一名其他角色造成1点伤害', lib.filter.notMe, true).set('ai', target => {
                            var player = _status.event.player;
                            return get.damageEffect(target, player, player);
                        }).forResult();
                        if (result2.bool) {
                            var target = result2.targets[0];
                            player.logSkill('fh_xuanfeng', target);
                            await target.damage();
                        }
                    }
                },
                ai: {
                    effect: {
                        player_use(card, player, target) {
                            if (player == target && get.type(card) == 'equip' && player.countCards('hes', function (cardx) {
                                return card != cardx && (!card.cards || !card.cards.includes(cardx)) && (player.hasSkill('yongjin') || get.subtype(card) == get.subtype(cardx)) && (get.position(cardx) == 'e' || player.canUse(cardx, player));
                            }) > 0) return;
                            if (!game.hasPlayer(function (current) {
                                return get.attitude(player, current) < 0 && current.countDiscardableCards(player, 'he') > 0 && get.damageEffect(current, player, player) > 0;
                            })) return;
                            if (typeof card == 'object' && player.isPhaseUsing() &&
                                player.needsToDiscard() == 2 && card.cards && card.cards.filter(function (i) {
                                    return get.position(i) == 'h';
                                }).length > 0 && !get.tag(card, 'draw') && !get.tag(card, 'gain') && !(get.tag(card, 'discard') && target == player && player.countCards('e') > 0)) return 'zeroplayertarget';
                        },
                        target(card, player, target, current) {
                            if (get.type(card) == 'equip' && !get.cardtag(card, 'gifts')) return [1, 3];
                            if (get.tag(card, 'damage') && target.hp > 2) {
                                var num1 = target.countCards('h'), num2 = target.getHandcardLimit();
                                if (num1 > num2) return [1, 1];
                                if (num1 == num2) return [1.1, _status.event.player == target ? 3 : 0.5];
                                if (num1 == num2 - 1) return [0.1, _status.event.player == target ? 4.5 : 0.1];
                            }
                            if (typeof card == 'object' && (card.name == 'shunshou' || card.name == 'guohe' || card.name == 'zhujinqiyuan') && target.countCards('h') > 0 && get.attitude(player, target) < 0) return [1, -1];
                        }
                    },
                    reverseEquip: true,
                    noe: true,
                    expose: 0.2,
                },
            },
            xuanfeng_xin_lingtong: { audio: 2 },
            //徐庶
            fh_qianxin: {
                audio: 'xsqianxin',
                trigger: { source: 'damageSource' },
                filter(event, player) {
                    return player.isDamaged();
                },
                juexingji: true,
                forced: true,
                skillAnimation: true,
                animationColor: 'orange',
                content() {
                    'step 0'
                    player.awakenSkill('fh_qianxin');
                    player.loseMaxHp();
                    'step 1'
                    player.addSkills('fh_jianyan');
                },
                derivation: 'fh_jianyan',
            },
            fh_jianyan: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'rejianyan',
                enable: 'phaseUse',
                filter(event, player) {
                    return game.hasPlayer(current => current.hasSex('male'));
                },
                usable: 2,
                chooseButton: {
                    dialog() {
                        return ui.create.dialog('###荐言###' + get.translation('fh_jianyan_info'));
                    },
                    chooseControl: () => ['basic', 'trick', 'equip', 'cancel2'],
                    check: () => 'trick',
                    backup(result, player) {
                        return {
                            audio: 'rejianyan',
                            filterCard: () => false,
                            selectCard: -1,
                            info: result.control,
                            content() {
                                'step 0'
                                var card = false, info = lib.skill.fh_jianyan_backup.info;
                                player.addTempSkill('fh_jianyan_type', { player: 'phaseUseAfter' });
                                card = get.fh_cardPile(card => get.type(card) == info);
                                if (card) {
                                    event.card = card;
                                    player.showCards(card, get.translation(player) + '发动了【荐言】');
                                }
                                else event.finish();
                                'step 1'
                                player.chooseTarget(true, '选择一名角色获得' + get.translation(card), (card, player, target) => {
                                    return target.hasSex('male');
                                }).set('ai', target => {
                                    var player = _status.event.player, att = get.attitude(player, target);
                                    if (target.hasSkill('nogain')) att /= 10;
                                    return att / Math.sqrt(get.distance(player, target, 'absolute'))
                                });
                                'step 2'
                                if (result.bool) {
                                    var target = result.targets[0];
                                    player.line(target, 'green');
                                    target.gain(card, 'gain2', 'fromFh_cardPile');
                                }
                            },
                            ai: { result: { player: 1 } },
                        }
                    },
                },
                ai: {
                    order: 8,
                    result: {
                        player(player, target) {
                            if (game.hasPlayer(current => (current.hasSex('male')) && get.attitude(player, current) > 0)) return 1;
                            return 0;
                        },
                    },
                },
                subSkill: {
                    backup: {},
                    type: {
                        charlotte: true,
                        onremove: true,
                    },
                },
            },
            //廖化
            fh_dangxian: {
                init() {
                    game.initFh_cardPile();
                },
                audio: 'dangxian_re_liaohua',
                trigger: { player: 'phaseBegin' },
                forced: true,
                async content(event, trigger, player) {
                    trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
                    const card = get.fh_cardPile('sha');
                    if (card) await player.gain(card, 'gain2', 'fromFh_cardPile');
                },
            },
            dangxian_re_liaohua: { audio: 2 },
            //朱治
            fh_anguo: {
                init() {
                    game.initFh_cardPile();
                },
                inherit: 'xinanguo',
                async content(event, trigger, player) {
                    let [h, hp, e] = [false, false, false];
                    for (const target of [event.target, player]) {
                        if (target.isMinHandcard() && (target !== player || !h)) {
                            h = true;
                            await target.draw();
                        }
                        if (target.isMinHp() && target.isDamaged() && (target !== player || !hp)) {
                            hp = true;
                            await target.recover();
                        }
                        if (target.isMinEquip() && (target !== player || !e)) {
                            const equip = get.fh_cardPile(card => get.type(card) == 'equip' && target.hasUseTarget(card));
                            if (equip) {
                                e = true;
                                await target.chooseUseTarget(equip, 'nothrow', 'nopopup', true);
                            }
                        }
                    }
                },
            },
        },
        dynamicTranslate: {
            fh_bushi(player) {
                var list = lib.skill.fh_bushi.getBushi(player).map((i) => get.translation(i));
                return '你使用' + list[0] + '牌无次数限制。当你使用或打出' + list[1] + '牌时，你摸一张牌。当你成为' + list[2] + '牌的目标后，你可以弃置一张' + list[3] + '花色的牌，令此牌对你无效并获得之。准备阶段，你可调整此技能中四种花色的对应顺序。';
            },
            fh_zhengrong(player) {
                var storage = player.storage.fh_zhengrong;
                var str = '锁定技，转换技，游戏开始时，你将牌堆顶的一张牌称为“荣”置于武将牌上。当你使用指定了其他角色的牌结算完毕后：';
                if (!storage) str += '<span class="bluetext">';
                str += '阴，你将一名其他角色的一张牌称为“荣”置于武将牌上';
                if (!storage) str += '</span>';
                str += '；';
                if (storage) str += '<span class="bluetext">';
                str += '阳，你将任意手牌与等量的“荣”进行交换';
                if (storage) str += '</span>';
                str += '。';
                return str;
            },
        },
        translate: {
            eternal_fh_tag: '额外牌堆',
            fh_zhi: '飞鸿·智',
            fh_xin: '飞鸿·信',
            fh_ren: '飞鸿·仁',
            fh_yong: '飞鸿·勇',
            fh_yan: '飞鸿·严',
            fh_shen: '飞鸿·神将',
            fh_std_sh: '飞鸿·标/神话',
            fh_yijiang: '飞鸿·一将',
            fh_yinyueqiang: '银月枪',
            fh_yinyueqiang_skill: '银月枪',
            fh_yinyueqiang_info: '其他角色的回合结束时，若你本回合失去过手牌，则你可以对一名攻击范围内本回合获得过牌的角色使用一张【杀】。',
            mx_fh_sp_bianfuren: '飞鸿卞夫人',
            mx_fh_sp_chenzhen: '飞鸿陈震',
            mx_fh_feiyi: '飞鸿费祎',
            mx_fh_luotong: '飞鸿骆统',
            mx_fh_sp_sunshao: '飞鸿孙邵',
            mx_fh_sp_duyu: '飞鸿杜预',
            mx_fh_sp_xunchen: '飞鸿荀谌',
            fh_fuding: '抚定',
            fh_fuding_info: '每轮限一次，一名其他角色进入濒死状态时，你可以交给其至多五张牌。若如此做，若其脱离濒死状态，你摸等量的牌。',
            fh_yuejian: '约俭',
            fh_yuejian_info: '你的手牌上限+X（X为你的体力上限）。当你需要使用基本牌时，若你本轮未使用过基本牌，则你可以视为使用之。',
            fh_shameng: '歃盟',
            fh_shameng_info: '出牌阶段限一次，你可以展示至多两张牌，并令一名其他角色也展示至多两张牌。若如此做，你可以弃置你与其展示的牌，然后你摸X张牌，其摸Y张牌（X为这些牌中含有的花色数，Y为这些牌中含有的类别数）。',
            fh_shengxi: '生息',
            fh_shengxi_info: '准备阶段，你可以从额外牌堆获得一张【调剂盐梅】。结束阶段，若你本回合使用过牌且未造成伤害，则你可以从额外牌堆获得一张智囊或摸一张牌。',
            fh_shengxi_append: '一名角色获得〖生息〗时，若额外牌堆没有【调剂盐梅】，则往额外牌堆中洗入一张红桃6的【调剂盐梅】。',
            fh_minshi: '悯施',
            fh_minshi_info: '出牌阶段限一次，你可以将额外牌堆中的至多三张基本牌依次交给任意手牌数小于体力值的角色，然后你失去X点体力（X为场上剩余未获得牌且手牌数小于体力值的角色数）。',
            fh_xianming: '显名',
            fh_xianming_info: '每回合限一次，当额外牌堆失去最后的基本牌后，你可以摸两张牌并回复1点体力。',
            fh_dingyi: '定仪',
            fh_dingyi_info: '每轮开始时，你可以摸一张牌，然后将一张场上“定仪”牌没有的花色的牌置于一名没有“定仪”牌的角色的武将牌上，其根据其拥有对应花色的“定仪”牌获得对应效果：♥，每回合首次脱离濒死状态后回复2点体力；♦，摸牌阶段额外摸两张牌；♠，手牌上限+4；♣，使用牌无距离限制。',
            fh_zuici: '罪辞',
            fh_zuici_info: '当你受到伤害后，你可以获得一名角色的“定仪”牌，然后从额外牌堆中选择一张智囊令其获得。',
            fh_wuku: '武库',
            fh_wuku_info: '锁定技，当你使用装备牌时或其他角色失去一张装备区里的装备牌后，若你的“武库”数小于3，则你获得一个“武库”。',
            fh_sanchen: '三陈',
            fh_sanchen_info: '觉醒技，准备阶段或结束阶段，若你的“武库”数大于等于3，则你加1点体力上限并回复1点体力，然后获得〖灭吴〗。',
            fh_miewu: '灭吴',
            fh_miewu_info: '每回合每种牌名各限一次，你可弃置一枚“武库”，将一张牌当做任意基本牌或普通锦囊牌使用。',
            fh_weipo: '危迫',
            fh_weipo_info: '出牌阶段限一次，你可以弃置一名其他角色区域内的各一张牌，然后选择令其获得额外牌堆中的【兵临城下】或一张智囊牌。',
            fh_weipo_append: '一名角色获得〖危迫〗时，若额外牌堆没有【兵临城下】，则往额外牌堆中洗入一张黑桃7的【兵临城下】。',
            fh_chenshi: '陈势',
            fh_chenshi_info: '当有角色使用【兵临城下】指定第一个目标后或有角色成为【兵临城下】的目标后，其可交给你一张牌，然后观看牌堆顶的三张牌并将其中任意张牌置入弃牌堆。',
            fh_mouzhi: '谋识',
            fh_mouzhi_info: '锁定技，当你受到有花色的牌造成的伤害时，若你本回合已受到过此花色的牌造成的伤害，则防止此伤害。',
            mx_fh_wangling: '飞鸿王凌',
            mx_fh_sp_mifuren: '飞鸿糜夫人',
            mx_fh_zhouchu: '飞鸿周处',
            mx_fh_wujing: '飞鸿吴景',
            mx_fh_sp_yanghu: '飞鸿羊祜',
            fh_xingqi: '星启',
            fh_xingqi_info: '当你使用非延时锦囊牌时，你从将一张额外牌堆中与此牌名称相同的牌当作“备”置于你的武将牌上。②结束阶段，你可获得一张“备”。',
            fh_zifu: '自缚',
            fh_zifu_info: '锁定技，出牌阶段结束时，若你本阶段内未使用牌，则你移去所有“备”且本回合的手牌上限-1。',
            fh_mibei: '秘备',
            fh_mibei_info: '使命技，使命：当你使用的牌结算完成后，若你的“备”中包含的基本牌，锦囊牌，装备牌数量均不少于两张，则你从额外牌堆中随机获得这三种类型的牌各一张并获得〖谋立〗。失败：结束阶段，若你没有“备”，且你于本回合的准备阶段也没有“备”，则你减1点体力上限。',
            fh_mouli: '谋立',
            fh_mouli_info: '出牌阶段限一次，你可以令一名其他角色获得你的一张“备”。',
            fh_guixiu: '闺秀',
            fh_guixiu_info: '结束阶段，你可以选择一项：①将手牌数摸至体力值；②回复1点体力。',
            fh_chuhai: '除害',
            fh_chuhai_info: `使命技，出牌阶段限一次，你可以摸一张牌，然后和一名其他角色拼点。若你赢，则你观看其手牌，并从额外牌堆中获得其手牌中包含的类型的牌各一张，且当你于此阶段内对其造成伤害后，你将额外牌堆中的一张装备牌置于你的一个空置装备栏内。当你因发动〖除害〗而展示拼点牌时，你令此牌的点数+X（X为你的空置装备栏数）。使命：当有装备牌进入你的装备区后，若你的装备区内有至少三张牌，则你将体力值回复至上限，失去${get.poptip('xianghai')}并获得${get.poptip('zhangming')}。失败：当你因发动〖除害〗发起的拼点没赢时，若你的最终点数不大于6，则使命失败。`,
            fh_heji: '合击',
            fh_heji_info: '当有角色使用的【决斗】或红色【杀】结算完成后，若此牌对应的目标数为1，则你可以对相同的目标使用一张【杀】或【决斗】（无距离和次数限制）。若你以此法使用的牌不为转化牌，则你摸一张牌。',
            fh_mingfa: '明伐',
            fh_mingfa_info: '你的拼点牌点数+2。出牌阶段开始时，你可以展示一张手牌并用此牌与一名其他角色拼点。若你赢，你获得对方一张牌并摸一张牌；若你没赢，你本回合不能使用牌指定其他角色为目标。',
            fh_rongbei: '戎备',
            fh_rongbei_info: '限定技，出牌阶段，你可选择一名有空装备栏的角色，为其每个空置装备栏从额外牌堆中随机置入一张对应副类别的装备。',
            mx_fh_caizhenji: '飞鸿蔡贞姬',
            mx_fh_sp_huaxin: '飞鸿华歆',
            mx_fh_xiangchong: '飞鸿向宠',
            mx_fh_sp_xujing: '飞鸿许靖',
            mx_fh_qiaogong: '飞鸿桥公',
            mx_fh_sp_zhangwen: '飞鸿张温',
            mx_fh_liuzhang: '飞鸿刘璋',
            mx_fh_zhangzhongjing: '飞鸿张机',
            fh_tianyin: '天音',
            fh_tianyin_info: '结束阶段，你可以亮出牌堆顶的四张牌，然后选择获得其中任意张本回合你未使用过的类别的牌。',
            fh_yuanqing: '渊清',
            fh_yuanqing_info: '锁定技，出牌阶段结束时，你随机从额外牌堆中将你本阶段使用过的牌类型的各一张牌置于仁库中。',
            fh_guying: '固营',
            fh_guying_info: '锁定技，每回合限一次，当你于回合外因使用/打出/弃置而失去牌后，若牌数为1，则你令当前回合角色选择一项：①交给你一张牌。②令你获得本次失去的牌，若为装备牌，则你使用之。准备阶段，你弃置你发动〖固营〗的次数张牌，然后清空〖固营〗的发动次数。',
            fh_boming: '博名',
            fh_boming_info: '出牌阶段限两次，你可以展示一张牌并将其交给一名其他角色。结束阶段，你摸X张牌（X为本局游戏因〖博名〗得到牌的角色数）。',
            fh_ejian: '恶荐',
            fh_ejian_info: '锁定技，每名角色每回合限一次，其他角色因〖博名〗而得到了你的牌后，你令其展示手牌，若其拥有与此牌类型相同的其他牌，则你令其选择一项：①弃置所有与此牌类别相同的手牌；②受到1点伤害，令你重置因〖博名〗得到牌的角色记录。',
            fh_yizhu: '遗珠',
            visible_yizhu: 'invisible',
            fh_yizhu_info: '结束阶段，你可以将至多两张花色各不相同的红色牌成为“遗珠”随机插入牌堆前X张牌的任意位置（X为游戏角色数，且这些牌对所有角色可见），一名角色获得“遗珠”牌后，你可以与其各摸一张牌。',
            fh_songshu: '颂蜀',
            fh_songshu_info: '一名角色的出牌阶段开始时，你可以将一张牌置入仁库，然后若仁库的牌数大于等于其手牌数，则其本回合只能使用或打出仁库的牌。',
            fh_yinge: '引戈',
            fh_yinge_info: '出牌阶段限一次，你可以令一名其他角色将一张手牌置入仁库，然后其可以使用仁库的一张牌，若其以此法使用伤害牌，则你成为此牌的额外目标。',
            fh_shiren: '施仁',
            fh_shiren_info: '当你成为其他角色使用伤害牌的目标后，你可以选择一项：①将牌堆顶两张牌置入仁库，然后获得仁库的一张牌。②摸两张牌，然后将一张手牌置入仁库。',
            fh_juyi: '据益',
            fh_juyi_info: '主公技，其他群势力角色的弃牌阶段开始时，其可以将一张手牌置入仁库，然后你获得因此溢出的仁库牌。',
            fh_jishi: '济世',
            fh_jishi_info: '锁定技，当你使用的牌结算完成后，若你未因此牌造成过伤害，则你将此牌置于仁库中。当有牌不因溢出而离开仁库时，你摸一张牌。',
            fh_liaoyi: '疗疫',
            fh_liaoyi_info: '其他角色的回合开始时，若其手牌数小于体力值且仁库内牌数大于等于X，则你可令其从仁库中获得X张牌；若其手牌数大于体力值，则你可以令其将X张牌置于仁库。（X为其手牌数与体力值之差且至多为2）',
            fh_binglun: '病论',
            fh_binglun_info: '出牌阶段限一次，你可以将仁库中的一张牌置于弃牌堆并令一名角色回复1点体力。',
            mx_fh_sp_wangshuang: '飞鸿王双',
            fh_shanxie: '擅械',
            fh_shanxie_info: '出牌阶段限一次，你可从额外牌堆中随机获得一张武器牌。其他角色使用【闪】响应你使用的【杀】时，若此【闪】没有点数或点数小于等于你攻击范围的两倍，则你令此【闪】无效。',
            mx_fh_sp_cuiyan: '飞鸿崔琰',
            mx_fh_sp_jiangwan: '飞鸿蒋琬',
            mx_fh_liuba: '飞鸿刘巴',
            mx_fh_sp_lvfan: '飞鸿吕范',
            fh_yajun: '雅俊',
            fh_yajun_info: '摸牌阶段，你多摸一张牌。出牌阶段开始时，你可以用与一名角色角色拼点：若你赢，则你可将其中一张拼点牌置于牌堆顶；若你没赢，你本回合的手牌上限-1。',
            fh_jincui: '尽瘁',
            fh_jincui_info: '限定技，出牌阶段，你可以和一名其他角色交换位置，然后失去X点体力（X为你与其的座次距离且X最大为你的体力值）。',
            fh_tongduo: '统度',
            fh_tongduo_info: `每回合限一次，当你成为其他角色使用牌的唯一目标后，你可令一名角色重铸一张牌：若此牌为红桃牌或锦囊牌，则其额外摸一张牌；若此牌为【无中生有】，你重置${get.poptip('duanbi')}。`,
            fh_diaodu: '调度',
            fh_diaodu_info: '准备阶段，你可以移动一名角色装备区内的一张牌，然后其摸一张牌。',
            mx_fh_shen_guojia: '飞鸿神郭嘉',
            mx_fh_shen_xunyu: '飞鸿神荀彧',
            mx_fh_shen_taishici: '飞鸿神太史慈',
            fh_shuishi: '慧识',
            fh_shuishi_info: '出牌阶段限一次，你可进行重复判定牌直到有已有判定花色的牌，然后你可以将所有判定牌交给一名角色。',
            fh_tianyi: '天翊',
            fh_tianyi_info: '觉醒技，准备阶段，若场上的所有存活角色均于本局游戏内受到过伤害，则你将体力上限增加至10点，然后令一名角色获得〖佐幸〗。',
            fh_sghuishi: '辉逝',
            fh_sghuishi_info: '限定技，当你进入濒死状态时，你可以选择一名角色。若其有未发动的觉醒技，则你令其中一个技能无视发动条件；否则其摸四张牌。',
            fh_lingce: '灵策',
            fh_lingce_info: '锁定技，一名角色使用智囊牌时，你摸一张牌。其他角色对你使用的智囊牌无效。',
            fh_dinghan: '定汉',
            fh_dinghan_info: '准备阶段，你可以更换智囊牌中的一张锦囊牌。',
            fh_powei: '破围',
            fh_powei_info: '使命技，游戏开始时，你令所有其他角色获得一个“围”。一名角色受到伤害后，若其有“围”，则其移去“围”。回合开始时，所有有“围”的角色失去“围”，然后这些角色的第一个不为你的下家获得等量的“围”。一名其他角色的回合开始时，若其有“围”，则你可以选择一项：⒈弃置一张手牌并对其造成1点伤害。⒉若其体力值不大于你，则你获得其一张手牌。选择完成后，你视为在其攻击范围内直到回合结束。使命：回合开始时，若场上没有“围”，则你获得〖神著〗。失败：当你受到大于等于你的体力值的伤害时，你取消之，然后移去场上所有“围”，弃置装备区的所有牌。',
            fh_qiexie: '挈挟',
            fh_qiexie_info: '锁定技，准备阶段，你在剩余武将牌堆中随机观看五张牌，选择其中的任意张置入武器栏，这些牌具有以下效果：⒈此牌不具有花色，且其攻击范围和点数等于此武将牌的体力上限。⒉此武器牌的技能为该武将牌上所有描述中包含“【杀】”且不具有锁定技以外的标签的技能。⒊此武器牌离开你的装备区时，改为放回武将牌堆。',
            fh_qiexie_faq: '【挈挟】将池',
            get fh_qiexie_faq_info() {
                let str, getList = lib?.skill?.fh_qiexie?.getList;
                if (getList?.size) {
                    str = '';
                    for (const [key, listx] of getList.entries()) {
                        if (!listx.length) continue;
                        let weight = parseInt(key.split('_')[1]);
                        str += `<br>权重${weight}：${get.translation(listx)}${listx._fh_qiexie_fixed ? '（保底）' : ''}`;
                    }
                    str += '<br><br><span style="font-weight: bold;">注：【挈挟】筛选的前三张武将牌必定从保底范围筛选</span>';
                }
                return str || '<br>【挈挟】将池暂未加载';
            },
            fh_cuijue: '摧决',
            fh_cuijue_info: '出牌阶段每名角色各限一次，你可以弃置一张牌，然后对攻击范围内距离最远的一名其他角色造成1点伤害。',
            mx_fh_dc_sunziliufang: '飞鸿孙资刘放',
            mx_fh_liyan: '飞鸿李严',
            mx_fh_dc_huanghao: '飞鸿黄皓',
            mx_fh_re_sundeng: '飞鸿孙登',
            mx_fh_xinxianying: '飞鸿辛宪英',
            mx_fh_wuxian: '飞鸿吴苋',
            mx_fh_caojie: '飞鸿曹节',
            mx_fh_jikang: '飞鸿嵇康',
            mx_fh_zhugeshang: '飞鸿诸葛尚',
            mx_fh_lukai: '飞鸿陆凯',
            mx_fh_kebineng: '飞鸿轲比能',
            fh_weidang: '伪谠',
            fh_weidang_info: '其他角色的结束阶段，你可以使用一张字数为X的牌（X为本回合未进入过弃牌堆的花色数）。',
            fh_duliang: '督粮',
            fh_duliang_info: '出牌阶段限一次，你可以获得一名其他角色的至多X张手牌（X为其已损失体力值且X至少为1），然后你选择一项：①令其下个摸牌阶段多摸等量的牌；②令其观看牌堆顶两倍数量的牌，然后其可以正面朝上获得其中任意张基本牌。',
            fh_fulin: '腹麟',
            fh_fulin_info: '当你于回合内不因此技能获得牌后，你可以将其中任意张牌置于牌堆顶，然后你于回合结束时摸等量的牌。',
            fh_qinqing: '寝情',
            fh_qinqing_info: '结束阶段，你可以弃置任意名攻击范围内包含一号位的其他角色一张牌，然后你摸X张牌（X为手牌数仍大于一号位的目标角色数）。',
            fh_kuangbi: '匡弼',
            fh_kuangbi_info: '出牌阶段开始时，你可以令一名其他角色将至多三张牌置于你的武将牌上直到此阶段结束。然后当你使用牌时，若你：有与此牌花色相同的“匡弼”牌，你移去其中一张并与其各摸一张牌；没有与此牌花色相同的“匡弼”牌，你移去一张“匡弼”牌并摸一张牌。',
            fh_caishi: '才识',
            fh_caishi_info: '摸牌阶段结束时，你可以展示你于本阶段内因摸牌而获得的所有的牌：若这些牌花色均相同，你将〖忠鉴〗于本回合内改为“出牌阶段限两次”。若这些牌不均相同，你可回复1点体力。若如此做，你本回合内不能对自己使用牌。',
            fh_daiyan: '怠宴',
            fh_daiyan_info: '结束阶段，你可以令一名其他角色获得你从额外牌堆中选择的一张基本牌，然后若其于你的上回合也成为过此技能的目标，则其失去1点体力。',
            fh_shouxi: '守玺',
            fh_shouxi_info: '当你成为其他角色使用【杀】或普通锦囊牌的目标后，你可声明一种牌的类别并令使用者选择一项：①弃置一张你声明的类别的手牌，然后其可以获得你的一张手牌；②令此牌对你无效。',
            fh_huimin: '惠民',
            fh_huimin_info: '结束阶段，你可以选择任意名手牌数小于体力值的角色并摸等量的牌，然后交给这些角色各一张手牌。',
            fh_qingxian: '清弦',
            fh_qingxian_info: '当你受到伤害/回复体力后，你可以令伤害来源/一名其他角色执行一项：失去1点体力，从额外牌堆中随机使用一张装备牌；回复1点体力，弃置一张装备牌。若其以此法使用或弃置的牌为梅花，你摸一张牌。',
            fh_juexiang: '绝响',
            fh_juexiang_info: '当你死亡后，你可以令一名角色，选择“清弦残谱”的其中一个技能令其获得，然后直到其下回合开始，其不能被选择为其他角色使用梅花牌的目标。',
            fh_juexiang_ji: '激弦',
            fh_juexiang_ji_info: '当你受到伤害后，你可以令伤害来源失去1点体力，从额外牌堆中随机使用一张装备。',
            fh_juexiang_lie: '烈弦',
            fh_juexiang_lie_info: '当你回复体力后，你可以令一名其他角色失去1点体力，从额外牌堆中随机使用一张装备。',
            fh_sangu: '三顾',
            fh_sangu_info: '一名角色的出牌阶段开始时，若其手牌数大于等于其体力上限，则你可以观看牌堆顶的三张牌并亮出其中任意张牌名各不相同的牌，然后其于本阶段可以将一张手牌当作本阶段未以此法转化过的牌名的牌使用。',
            fh_bushi: '卜筮',
            fh_bushi_info: '你使用♠牌无次数限制。当你使用或打出♥牌时，你摸一张牌。当你成为♣牌的目标后，你可以弃置一张♦花色的牌，令此牌对你无效并获得之。准备阶段，你可调整此技能中四种花色的对应顺序。',
            fh_kousheng: '寇旌',
            fh_kousheng_info: '出牌阶段限一次，你可以展示任意张手牌，这些牌视为无次数限制的【杀】直到回合结束，其他角色受到这些牌造成的伤害后，其可以用所有手牌交换这些牌。',
            mx_fh_re_huangyueying: '飞鸿黄月英',
            mx_fh_re_zhenji: '飞鸿甄宓',
            mx_fh_gz_huangzhong: '飞鸿黄忠',
            mx_fh_zhoutai: '飞鸿周泰',
            mx_fh_ol_sp_zhugeliang: '飞鸿卧龙',
            mx_fh_re_taishici: '飞鸿太史慈',
            mx_fh_yanwen: '飞鸿颜良文丑',
            mx_fh_guanqiujian: '飞鸿毌丘俭',
            mx_fh_xin_lingtong: '飞鸿凌统',
            mx_fh_dc_xushu: '飞鸿徐庶',
            mx_fh_re_liaohua: '飞鸿廖化',
            mx_fh_zhuzhi: '飞鸿朱治',
            fh_jizhi: '集智',
            fh_jizhi_info: '当你使用非转化锦囊牌时，你可以摸一张牌，然后你可以弃置一张基本牌，令本回合你的手牌上限+1。',
            fh_luoshen: '洛神',
            fh_luoshen_info: '准备阶段，你可以进行判定，若结果为黑色，你获得判定牌并可以再次判定。然后你的手牌上限+X（X为你本次获得的牌数）。',
            fh_liegong: '烈弓',
            fh_liegong_info: '你使用【杀】无距离限制。当你使用【杀】指定一个目标后，你可以根据下列条件执行相应的效果：1.其手牌数小于等于你的手牌数，此【杀】不可被响应，2.其体力值大于等于你的体力值，此【杀】伤害+1。',
            fh_buqu: '不屈',
            fh_buqu_info: '锁定技，当你不以此法进入濒死状态时，你重置〖奋激〗并将体力回复至1点，然后将牌堆顶的一张牌称为“创”，然后若“创”因此有重复点数的牌，则你移去此牌并失去1点体力。你的手牌上限+X（X为你的“创”数）。',
            fh_fenji: '奋激',
            fh_fenji_info: '每名角色每回合限一次，一名角色不因使用或打出失去手牌后，你可以失去1点体力，令其摸两张牌。',
            fh_cangzhuo: '藏拙',
            fh_cangzhuo_info: '弃牌阶段开始时，若你本回合没有使用过锦囊牌，则你可以展示任意张锦囊牌，令这些牌于本阶段不计入手牌上限。',
            fh_hanzhan: '酣战',
            fh_hanzhan_info: '当你发起拼点时，或成为拼点的目标时，你可以选择对方的一张手牌作为其拼点牌。当你拼点结束后，你可以获得本次拼点的拼点牌中点数最大的【杀】。',
            fh_shuangxiong: '双雄',
            fh_shuangxiong_info: '出牌阶段开始时，你可以令一名角色弃置一张牌，然后你本回合可以将一张与此牌颜色不同的手牌当作【决斗】使用。',
            fh_xiayong: '狭勇',
            fh_xiayong_info: '结束阶段，若你本回合使用的【杀】和【决斗】均对目标角色造成过伤害，则你可以摸X张牌（X为这些牌造成的伤害数之和）。',
            fh_zhengrong: '征荣',
            fh_zhengrong_tag: '荣',
            fh_zhengrong_info: '转换技，锁定技，游戏开始时，你将牌堆顶的一张牌称为“荣”置于武将牌上。当你使用指定了其他角色的牌结算完毕后：阴，你将一名其他角色的一张牌称为“荣”置于武将牌上；阳，你将任意手牌与等量的“荣”进行交换。',
            fh_hongju: '鸿举',
            fh_hongju_info: '觉醒技，准备阶段，若你的“荣”数不小于3，你摸等同于“荣”数的牌，且可以用任意手牌交换等量的“荣”，然后获得〖清侧〗。',
            fh_qingce: '清侧',
            fh_qingce_info: '出牌阶段，你可以将一张“荣”置入弃牌堆，然后弃置场上的一张牌。',
            fh_xuanfeng: '旋风',
            fh_xuanfeng_info: '当你于弃牌阶段弃置过至少两张牌，或当你失去装备区里的牌后，你可以选择一项：①弃置至多两名其他角色的共计两张牌。②若此时处于你的回合内且场上没有处于濒死状态的角色，你可以对一名其他角色造成1点伤害。',
            fh_qianxin: '潜心',
            fh_qianxin_info: '觉醒技，当你造成伤害后，若你已受伤，则你减1点体力上限并获得〖荐言〗。',
            fh_jianyan: '荐言',
            fh_jianyan_info: '出牌阶段限两次，你可选择一种牌的类别并从额外牌堆中随机展示一张此类别的牌，然后你将此牌交给一名男性角色。',
            fh_dangxian: '当先',
            fh_dangxian_info: '锁定技，回合开始时，你进行一个额外的出牌阶段并从额外牌堆中获得一张【杀】。',
            fh_anguo: '安国',
            fh_anguo_info: '出牌阶段限一次，你可以选择一名其他角色，若其手牌数为全场最少，其摸一张牌；体力值为全场最低，回复1点体力；装备区内牌数为全场最少，从额外牌堆种随机使用一张装备牌。然后若该角色有未执行的效果且你满足条件，你执行之。',
        },
    };
    for (const i in MX_feihongyinxue.character) {
        if (Array.isArray(MX_feihongyinxue.character[i])) MX_feihongyinxue.character[i] = get.convertedCharacter(MX_feihongyinxue.character[i]);
        MX_feihongyinxue.character[i].trashBin ??= [];
        MX_feihongyinxue.character[i].dieAudios ??= [];
        MX_feihongyinxue.character[i].tempname ??= [];
        if (!MX_feihongyinxue.character[i].dieAudios.length) MX_feihongyinxue.character[i].dieAudios.push(i.slice(6));
        if (!MX_feihongyinxue.character[i].tempname.length) MX_feihongyinxue.character[i].tempname.push(i.slice(6));
        MX_feihongyinxue.character[i].img = `image/character/${i.slice(6)}.jpg`;
        let trans = MX_feihongyinxue.translate[i];
        if (trans.startsWith('飞鸿神')) MX_feihongyinxue.translate[i + '_prefix'] = '飞鸿|神';
        else MX_feihongyinxue.translate[i + '_prefix'] = trans.slice(0, 2);
    }
    lib.namePrefix.set('飞鸿', {
        color: '#ff6a6a',
        showName: '鸿',
    });
    lib.config.all.sgscharacters.push('MX_feihongyinxue');
    //飞鸿新机制
    lib.arenaReady.push(function addYinyueqiang() {
        //把银月枪加入牌堆
        if (lib.config.characters.includes('MX_feihongyinxue')) lib.card.list.push(['diamond', 12, 'fh_yinyueqiang']);
        //创建额外牌堆的牌
        game.initFh_cardPile = function () {
            //公共区域
            if (!lib.commonArea.has('fh_cardPile')) {
                lib.commonArea.set('fh_cardPile', {
                    translate: '飞鸿·额外牌堆',
                    areaStatusName: 'fh_cardPile',
                    toName: 'toFh_cardPile',
                    fromName: 'fromFh_cardPile',
                    async addHandeler(event, trigger, player) {
                        const { cards } = event;
                        const puts = cards.filter(card => {
                            return !card.willBeDestroyed('fh_cardPile', null, event.relatedEvent);
                        });
                        _status.fh_cardPile.addArray(puts);
                        game.log(puts, '被放回了', '#g额外牌堆');
                        game.broadcast(pile => {
                            _status.fh_cardPile = pile;
                        }, _status.fh_cardPile);
                    },
                    async removeHandeler(event, trigger, player) {
                        _status.fh_cardPile.removeArray(event.cards);
                        game.log('#g额外牌堆', '失去了', event.cards);
                        game.broadcast(pile => {
                            _status.fh_cardPile = pile;
                        }, _status.fh_cardPile);
                    },
                });
            }
            if (!_status.fh_cardPile) {
                _status.fh_cardPile = [];
                const cardList = [
                    //基本牌
                    ['club', 4, 'sha'],
                    ['diamond', 2, 'shan'],
                    ['heart', 6, 'tao'],
                    ['spade', 9, 'jiu'],
                    ['heart', 4, 'sha', 'fire'],
                    ['spade', 4, 'sha', 'thunder'],
                    //锦囊牌
                    ['heart', 8, 'wuzhong'],
                    ['heart', 4, 'wugu'],
                    ['spade', 3, 'guohe'],
                    ['diamond', 3, 'shunshou'],
                    ['diamond', 2, 'huogong'],
                    ['diamond', 1, 'juedou'],
                    ['spade', 13, 'nanman'],
                    ['heart', 1, 'wanjian'],
                    ['heart', 13, 'wuxie'],
                    ['heart', 6, 'lebu'],
                    ['spade', 10, 'bingliang'],
                    ['club', 12, 'tiesuo'],
                    ['heart', 12, 'shandian'],
                    ['club', 13, 'jiedao'],
                    ['heart', 1, 'taoyuan'],
                    //装备牌
                    ['spade', 2, 'baguazhen'],
                    ['club', 2, 'renwang'],
                    ['spade', 2, 'tengjia'],
                    ['club', 1, 'baiyin'],
                    ['club', 5, 'dilu'],
                    ['heart', 5, 'chitu'],
                    ['spade', 13, 'dayuan'],
                    ['diamond', 13, 'zixin'],
                    ['diamond', 13, 'hualiu'],
                    ['heart', 13, 'zhuahuang'],
                    ['spade', 5, 'jueying'],
                    ['diamond', 1, 'zhuge'],
                    ['spade', 6, 'qinggang'],
                    ['spade', 1, 'guding'],
                    ['spade', 2, 'hanbing'],
                    ['spade', 2, 'cixiong'],
                    ['spade', 5, 'qinglong'],
                    ['spade', 12, 'zhangba'],
                    ['diamond', 5, 'guanshi'],
                    ['diamond', 1, 'zhuque'],
                    ['diamond', 12, 'fangtian'],
                    ['heart', 5, 'qilin'],
                ];
                _status.fh_cardPile.addArray(cardList.filter(card => {
                    return lib.card.list.some(cardx => card[0] == cardx[0] && card[1] == cardx[1] && card[2] == cardx[2] && ((!card[3] && !cardx[3]) || (card[3] == cardx[3])));
                }));
                const names = lib.card.list.filter(cardx => !cardList.some(card => card[2] == cardx[2])).reduce((list, card) => list.add(card[2]), []);
                names.forEach(name => {
                    var card = lib.card.list.find(card => card[2] == name);
                    if (card) _status.fh_cardPile.push(card);
                });
                _status.fh_cardPile = _status.fh_cardPile.map(info => {
                    const card = game.createCard2(info[2], info[0], info[1], info[3]);
                    game.broadcastAll(card => {
                        card.destroyed = (card, position, player, event) => {
                            if (position === 'discardPile') {
                                game.cardsGotoSpecial(card, 'toFh_cardPile');
                            }
                            return false;
                        };
                        card.addGaintag('eternal_fh_tag');
                    }, card);
                    return card;
                });
                game.broadcast(pile => {
                    _status.fh_cardPile = pile;
                }, _status.fh_cardPile);
            }
        };
        //获取额外牌堆的牌
        get.fh_cardPile = function (filter) {
            game.initFh_cardPile();
            if (typeof filter == 'string') {
                var name = filter;
                filter = (card) => card.name == name;
            }
            else filter ??= () => true;
            var cards = _status.fh_cardPile.filter(card => filter(card));
            if (cards.length) return cards.randomGet();
            return false;
        };
    });
    lib.translate['MX_feihongyinxue_character_config'] = '<span style="font-family: xingkai">飞鸿印雪</span>';
    if (ui?.create?.menu) {
        const originLoading = ui.create.menu;
        ui.create.menu = function () {
            const result = originLoading.apply(this, arguments);
            const characterPack = Array.from(document.getElementsByTagName('div')).find(div => div.innerHTML === '武将');
            if (characterPack) {
                const originClick = characterPack.onclick || function () { };
                characterPack.onclick = () => {
                    originClick.apply(this, arguments);
                    const characterPackage = Array.from(document.querySelectorAll('.menubutton.large')).find(div => div.innerHTML === lib.translate['MX_feihongyinxue_character_config']);
                    if (characterPackage) {
                        const originClick2 = characterPackage.onclick || function () { };
                        characterPackage.onclick = () => {
                            originClick2.apply(this, arguments);
                            const rightPane = document.querySelector('.menu-buttons.leftbutton');
                            if (rightPane && !rightPane.init) {
                                rightPane.init = true;
                                const cfgNodes = rightPane.querySelectorAll('.config.toggle');
                                for (let i = 0; i < cfgNodes.length; i++) {
                                    if (cfgNodes[i].textContent === '仅点将可用') {
                                        const addIntro = document.createElement('div');
                                        addIntro.classList.add('config', 'pointerspan');
                                        addIntro.innerHTML = '<span style="font-family: yuanli">本包前言：<br>2023年活动武将年底大活，开启此包游戏将会加入额外牌堆机制，游戏牌堆会加入一张方片12的' + get.poptip('fh_yinyueqiang') + '，此包建议单独开启使用</span>';
                                        cfgNodes[i].parentNode.insertBefore(addIntro, cfgNodes[i].nextSibling);
                                        break;
                                    }
                                }
                            }
                        };
                    }
                };
            }
            return result;
        };
    }
    return MX_feihongyinxue;
};

export default packs;