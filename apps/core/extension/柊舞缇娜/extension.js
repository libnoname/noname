import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function (lib, game, ui, get, ai, _status) {
    return {
        name: "柊舞缇娜", content: function (config, pack) {

        }, precontent: function () {

        }, config: {
            Magical: {
                name: '柊舞缇娜',
                init: true,
                intro: '我名为Magia Böse，将成为魔法少女所畏惧的邪恶',
            },
        }, help: {}, package: {
            character: {
                character: {
                    mb_shen_machao: ['male', 'shen', 4, ['shenyuli', 'shentingwei', 'shenjimie'], ['die:柊舞缇娜:audio', 'shu']],
                    huan_sunce: ['male', 'wu', 4, ['twjianyan', 'twliwu', 'twsaoting'], ['die:柊舞缇娜:audio', 'transform:[huan_sunce,huan_sunce2]']],
                    huan_sunce2: ['male', 'wu', 4, ['twjizhi', 'twsuzhen', 'twdangjiang'], ['die:柊舞缇娜:audio', 'unseen', 'transform:[huan_sunce,huan_sunce2]']],
                    huan_daqiao: ['female', 'wu', 3, ['twguose', 'twliuli'], ['die:柊舞缇娜:audio']],
                    ca_zhouyu: ['male', 'wu', 4, ['cachiyun', 'cayanhui', 'cafentao', 'caxiongzi'], ['die:柊舞缇娜:audio', 'transform:[ca_zhouyu,ca_zhouyu1,ca_zhouyu2]']],
                    ca_zhouyu1: ['male', 'wu', 4, ['cachiyun', 'cayanhuix', 'cafentao', 'caxiongzi_blue'], ['die:柊舞缇娜:audio', 'transform:[ca_zhouyu,ca_zhouyu1,ca_zhouyu2]', 'unseen']],
                    ca_zhouyu2: ['male', 'wu', 4, ['cachiyun', 'cayanhuix', 'cafentao', 'caxiongzi_red'], ['die:柊舞缇娜:audio', 'transform:[ca_zhouyu,ca_zhouyu1,ca_zhouyu2]', 'unseen']],
                    sbfm_baosanniang: ['female', 'shu', 4, ['sbfmwuniang', 'sbfmzhennan', 'sbfmxushen'], ['die:柊舞缇娜:audio']],
                    ol_lvlingqi: ['female', 'qun', 4, ['olqiwu', 'olzhuangrong'], ['die:柊舞缇娜:audio']],
                    dc_houzhaoning: ['female', 'qun', 3, ['dcwangzi', 'dcherong'], ['die:柊舞缇娜:audio']],
                    mb_lingju: ['female', 'qun', 3, ['sbjieyuan', 'sbfenxin'], ['die:柊舞缇娜:audio']],
                    mb_baosanniang: ['female', 'shu', 3, ['mb_shuyong', 'mb_xushen', 'mb_zhennan'], ['die:柊舞缇娜:audio']],
                    yue_zhugeguo: ['female', 'shu', 3, ['dcxidi', 'dcchengyan'], ['die:柊舞缇娜:audio']],
                    caoyuan: ['female', 'qun', 3, ['dcwuyan', 'dczhanyu'], ['die:柊舞缇娜:audio']],
                    kongshu: ['female', 'qun', 3, ['leiluan', 'fuchao'], ['die:柊舞缇娜:audio']],
                    sxrm_caocao: ['male', 'wei', 3, ['sxrmkuxin', 'sxrmsigu', 'sxrmkuimu'], ['die:柊舞缇娜:audio']],
                    dc_zhangyu: ['male', 'shu', 3, ['dcxiangchen', 'dcmingding'], ['die:柊舞缇娜:audio']],
                    ca_sunchen: ['male', 'wu', 4, ['calulian', 'canigu'], ['die:柊舞缇娜:audio']],
                    wu_zhangfei: ['male', 'shu', 4, ['dczisheng', 'dcxianlue', 'dchaoxian'], ['die:柊舞缇娜:audio']],
                    dc_cuizhi: ['female', 'shu', 4, ['dcranlv', 'dcjuexun'], ['die:柊舞缇娜:audio']],
                    ol_sunhanhua: ['female', 'wu', 3, ['olhuaguang', 'olxuanbai'], ['die:柊舞缇娜:audio']],
                    ol_re_xiahoushi: ['female', 'shu', 3, ['olqiaoshi', 'olyanyu'], ['die:柊舞缇娜:audio']],
                    yue_caozhi: ["male", "wei", 3, ['dcyuefuyue', 'dcyuewenlan'], ['die:柊舞缇娜:audio']],
                    clan_yangzhong: ['male', 'qun', 4, ['clanjuetu', 'clankudu', 'clanquhuo'], ['die:柊舞缇娜:audio', 'clan:颍川杨氏']],
                    clan_yangbiao: ['male', 'qun', 3, ['clanjiannan', 'clanyichi', 'clanquhuo'], ['die:柊舞缇娜:audio', 'clan:颍川杨氏']],
                    clan_yangci: ['male', 'qun', 3, ['clanqieyi', 'clanjianzhi', 'clanquhuo'], ['die:柊舞缇娜:audio', 'clan:颍川杨氏']],
                    clan_xunshuang: ['male', 'qun', 3, ['clanyangji', 'clandandao', 'clanqingli', 'clandaojie'], ['die:柊舞缇娜:audio', 'clan:颍川荀氏']],
                    clan_hanfu: ['male', 'qun', '3/4', ['clanheta', 'olyingxiang', 'clanxumin'], ['die:柊舞缇娜:audio', 'clan:颍川韩氏']],
                    clan_wangmingshan: ['male', 'wei', 3, ['clantanque', 'clanshengmo', 'clanzhongliu'], ['die:柊舞缇娜:audio', 'clan:太原王氏']],
                    clan_luji: ['male', 'wu', 3, ['clangailan', 'clanfennu', 'clanzelie'], ['die:柊舞缇娜:audio', 'clan:吴郡陆氏']],
                    clan_luyusheng: ['female', 'wu', 3, ['clanshixi', 'clanjianbai', 'clanzelie'], ['die:柊舞缇娜:audio', 'clan:吴郡陆氏']],
                    clan_xunyu: ['male', 'wei', 3, ['clandingan', 'clanfuning', 'clandaojie'], ['die:柊舞缇娜:audio', 'clan:颍川荀氏']],
                    clan_lujing: ['male', 'wu', 4, ['clantanfeng', 'clanjuewei', 'clanzelie'], ['die:柊舞缇娜:audio', 'clan:吴郡陆氏']],
                    clan_chenqun: ['male', 'wei', 3, ['clangezhi', 'clanmingdian', 'clanshize'], ['die:柊舞缇娜:audio', 'clan:颍川陈氏']],
                    clan_chentai: ['male', 'wei', 4, ['clanfenjian', 'clandongxu', 'clanshize'], ['die:柊舞缇娜:audio', 'clan:颍川陈氏']],
                    clan_xunshi: ['female', 'wei', 3, ['clanqingjue', 'clanyingxiang', 'clandaojie'], ['die:柊舞缇娜:audio', 'clan:颍川荀氏']],
                    mdtx_pangtong: ['male', 'shu', 3, ['mdtxyinmou', 'mdtxhongce'], ['die:柊舞缇娜:audio', 'transform:[mdtx_pangtong,mdtx_pangtong2]']],
                    mdtx_pangtong2: ['male', 'shu', 3, ['mdtxyinmou', 'mdtxhongce'], ['die:柊舞缇娜:audio', 'unseen', 'transform:[mdtx_pangtong,mdtx_pangtong2]']],
                    sbfm_jiaxu: ['male', 'qun', 3, ['sbfmluanchao', 'sbfmwance', 'sbfmchenzhi'], ['die:柊舞缇娜:audio']],
                    sbfm_xuyou: ['male', 'qun', 3, ['sbfmxyqianfu', 'sbfmyushi', 'sbfmfenchao'], ['die:柊舞缇娜:audio']],
                    sbfm_zhangrang: ['male', 'qun', 3, ['sbfmlucun', 'sbfmtuisheng'], ['die:柊舞缇娜:audio', 'transform:[sbfm_zhangrang,sbfm_zhangrang2]']],
                    sbfm_zhangrang2: ['male', 'qun', 3, ['sbfmlucun', 'sbfmtuisheng'], ['die:柊舞缇娜:audio', 'transform:[sbfm_zhangrang,sbfm_zhangrang2]', 'unseen']],
                    dc_cuilingyi: ['female', 'wei', 3, ['dchuashang', 'dcyuzhi'], ['die:柊舞缇娜:audio']],
                    yue_caiyong: ['male', 'qun', 3, ['dcyuejiaowei', 'dcyuefeibai'], ['die:柊舞缇娜:audio']],
                },
                translate: {
                    huan_sunce: '幻孙策',
                    huan_sunce2: '幻孙策',
                    huan_daqiao: '幻大乔',
                    ca_zhouyu: '势周瑜',
                    ca_zhouyu1: '势周瑜',
                    ca_zhouyu2: '势周瑜',
                    clan_xunyu: '族荀彧',
                    clan_chenqun: '族陈群',
                    clan_chentai: '族陈泰',
                    clan_wangmingshan: '族王明山',
                    clan_yangzhong: '族杨众',
                    clan_yangbiao: '族杨彪',
                    clan_hanfu: '族韩馥',
                    clan_xunshuang: '族荀爽',
                    clan_yangci: '族杨赐',
                    clan_lujing: '族陆景',
                    clan_xunshi: '族荀莳',
                    clan_luji: '族陆绩',
                    clan_luyusheng: '族陆郁生',
                    sbfm_baosanniang: '谋鲍三娘',
                    ol_lvlingqi: '吕玲绮',
                    dc_houzhaoning: '侯昭宁',
                    mb_lingju: '新灵雎',
                    mb_baosanniang: '新鲍三娘',
                    yue_zhugeguo: '乐诸葛果',
                    caoyuan: "曹媛",
                    kongshu: '孔淑',
                    sxrm_caocao: '魔曹操',
                    dc_zhangyu: '张裕',
                    ca_sunchen: '势孙綝',
                    wu_zhangfei: '武张飞',
                    dc_cuizhi: '崔芷',
                    dc_lizhaoyi: '李昭仪',
                    phaseJudge: '判断阶段',
                    phaseDraw: '摸牌阶段',
                    phaseUse: '出牌阶段',
                    phaseDiscard: '弃牌阶段',
                    ol_sunhanhua: '孙寒华',
                    ol_re_xiahoushi: '界夏侯氏',
                    yue_caozhi: '乐曹植',
                    mb_shen_machao: '神马超',
                    mdtxyinmou_buff: '寅谋摸牌',
                    mdtxyinmou_debuff: '寅谋弃牌',
                    mdtx_pangtong: '谋庞统',
                    mdtx_pangtong2: '谋庞统',
                    sbfm_zhangrang: '谋张让',
                    sbfm_zhangrang2: '谋张让',
                    sbfm_xuyou: '谋许攸',
                    sbfm_jiaxu: '谋贾诩',
                    dc_cuilingyi: '崔令仪',
                    yue_caiyong: '乐蔡邕',
                    shen_weiyan: '神魏延',
                },
                characterPrefix: {
                    mdtx_pangtong2: '谋',
                    sbfm_zhangrang2: '谋',
                },
            },
            card: {
                card: {
                    huntianyi: {
                        derivation: 'clan_luji',
                        fullskin: true,
                        type: 'equip',
                        subtype: 'equip5',
                        loseDelay: false,
                        onLose: function () {
                            var togain = [];
                            var num = get.number(card, false);
                            if (event.getParent(2)?.name == 'huntianyi_skill') {
                                card.fix();
                                card.remove();
                                card.destroyed = true;
                                game.log(card, '被销毁了');
                            }
                            if (num && typeof num == 'number') {
                                for (var i = 0; i < 2; i++) {
                                    var card = get.cardPile2(function (c) {
                                        return get.type2(c) == 'trick' && !togain.contains(c) && get.number(c) == num;
                                    });
                                    if (card) togain.push(card);
                                }
                            }
                            if (togain.length > 0) player.gain(togain, 'draw');
                            else game.log('牌堆中点数为' + get.translation(num) + '的锦囊牌数量不足', 'visible');
                        },
                        skills: ['huntianyi_skill'],
                        ai: {
                            order: 9.5,
                            equipValue(card, player) {
                                if (player.hp == 1) return 5;
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    cailian_equip1: {
                        derivation: 'ol_sunhanhua',
                        fullskin: true,
                        type: 'equip',
                        subtype: 'equip1',
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                        equipDelay: false,
                        loseDelay: false,
                        skills: ['cailian_skill'],
                    },
                    cailian_equip2: {
                        derivation: 'ol_sunhanhua',
                        fullskin: true,
                        type: 'equip',
                        subtype: 'equip2',
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                        equipDelay: false,
                        loseDelay: false,
                        skills: ['cailian_skill'],
                    },
                    cailian_equip3: {
                        derivation: 'ol_sunhanhua',
                        fullskin: true,
                        type: 'equip',
                        subtype: 'equip3',
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                        },
                        equipDelay: false,
                        loseDelay: false,
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                        skills: ['cailian_skill'],
                    },
                    cailian_equip4: {
                        derivation: 'ol_sunhanhua',
                        fullskin: true,
                        type: 'equip',
                        subtype: 'equip4',
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                        },
                        equipDelay: false,
                        loseDelay: false,
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                        skills: ['cailian_skill'],
                    },
                    cailian_equip5: {
                        derivation: 'ol_sunhanhua',
                        fullskin: true,
                        type: 'equip',
                        subtype: 'equip5',
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                        },
                        equipDelay: false,
                        loseDelay: false,
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                        skills: ['cailian_skill'],
                    },
                    dchuashang_equip1: {
                        derivation: "dc_cuilingyi",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip1",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.dchuashang_equip1) event.finish();
                            var cardx = game.createCard(player.storage.dchuashang_equip1);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.dchuashang_equip1;
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    dchuashang_equip2: {
                        derivation: "dc_cuilingyi",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip2",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.dchuashang_equip2) event.finish();
                            var cardx = game.createCard(player.storage.dchuashang_equip2);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.dchuashang_equip2;
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    dchuashang_equip3: {
                        derivation: "dc_cuilingyi",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip3",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.dchuashang_equip3) event.finish();
                            var cardx = game.createCard(player.storage.dchuashang_equip3);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.dchuashang_equip3;
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    dchuashang_equip4: {
                        derivation: "dc_cuilingyi",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip4",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.dchuashang_equip4) event.finish();
                            var cardx = game.createCard(player.storage.dchuashang_equip4);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.dchuashang_equip4;
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    dchuashang_equip5: {
                        derivation: "dc_cuilingyi",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip5",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.dchuashang_equip5) event.finish();
                            var cardx = game.createCard(player.storage.dchuashang_equip5);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.dchuashang_equip5;
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_basicequip1: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip1",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_basicequip1) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_basicequip1);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_basicequip1;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_basicequip2: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip2",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_basicequip2) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_basicequip2);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_basicequip2;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_basicequip3: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip3",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_basicequip3) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_basicequip3);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_basicequip3;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_basicequip4: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip4",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_basicequip4) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_basicequip4);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_basicequip4;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_basicequip5: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip5",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_basicequip5) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_basicequip5);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_basicequip5;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_trickequip1: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip1",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_trickequip1) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_trickequip1);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_trickequip1;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_trickequip2: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip2",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_trickequip2) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_trickequip2);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_trickequip2;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_trickequip3: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip3",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_trickequip3) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_trickequip3);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_trickequip3;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_trickequip4: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip4",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_trickequip4) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_trickequip4);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_trickequip4;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_trickequip5: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip5",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_trickequip5) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_trickequip5);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_trickequip5;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_equipequip1: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip1",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_equipequip1) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_equipequip1);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_equipequip1;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_equipequip2: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip2",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_equipequip2) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_equipequip2);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_equipequip2;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_equipequip3: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip3",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_equipequip3) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_equipequip3);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_equipequip3;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_equipequip4: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip4",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_equipequip4) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_equipequip4);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_equipequip4;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                    shenzigu_equipequip5: {
                        derivation: "shen_weiyan",
                        fullskin: true,
                        type: "equip",
                        subtype: "equip5",
                        onLose: function () {
                            card.fix();
                            card.remove();
                            card.destroyed = true;
                            if (!player.storage.shenzigu_equipequip5) event.finish();
                            var cardx = game.createCard(player.storage.shenzigu_equipequip5);
                            game.log(player, '将', cardx, '置入了弃牌堆');
                            game.cardsDiscard(cardx);
                            delete player.storage.shenzigu_equipequip5;
                            if (!player.storage.shenzigu) event.finish();
                            var target = player.storage.shenzigu;
                            target.markAuto('shenezhi_effect', [cardx]);
                            game.updateRoundNumber();
                        },
                        ai: {
                            equipValue(card, player) {
                                return 0;
                            },
                            basic: {
                                equipValue: 2,
                            },
                        },
                    },
                },
                translate: {
                    cailian_equip1: '彩莲',
                    cailian_equip1_info: '锁定技，你每轮首次造成的伤害与回复+1，且你与此牌花色相同的手牌不计入手牌上限。',
                    cailian_equip2: '彩莲',
                    cailian_equip2_info: '锁定技，你每轮首次造成的伤害与回复+1，且你与此牌花色相同的手牌不计入手牌上限。',
                    cailian_equip3: '彩莲',
                    cailian_equip3_info: '锁定技，你每轮首次造成的伤害与回复+1，且你与此牌花色相同的手牌不计入手牌上限。',
                    cailian_equip4: '彩莲',
                    cailian_equip4_info: '锁定技，你每轮首次造成的伤害与回复+1，且你与此牌花色相同的手牌不计入手牌上限。',
                    cailian_equip5: '彩莲',
                    cailian_equip5_info: '锁定技，你每轮首次造成的伤害与回复+1，且你与此牌花色相同的手牌不计入手牌上限。',
                    dchuashang_equip1: '华裳',
                    dchuashang_equip1_info: '崔令仪的衣服。',
                    dchuashang_equip2: '华裳',
                    dchuashang_equip2_info: '崔令仪的衣服。',
                    dchuashang_equip3: '华裳',
                    dchuashang_equip3_info: '崔令仪的衣服。',
                    dchuashang_equip4: '华裳',
                    dchuashang_equip4_info: '崔令仪的衣服。',
                    dchuashang_equip5: '华裳',
                    dchuashang_equip5_info: '崔令仪的衣服。',
                    shenzigu_basicequip1: '恣骨/基本牌',
                    shenzigu_basicequip1_info: '神魏延的基本牌衍生物。',
                    shenzigu_basicequip2: '恣骨/基本牌',
                    shenzigu_basicequip2_info: '神魏延的基本牌衍生物。',
                    shenzigu_basicequip3: '恣骨/基本牌',
                    shenzigu_basicequip3_info: '神魏延的基本牌衍生物。',
                    shenzigu_basicequip4: '恣骨/基本牌',
                    shenzigu_basicequip4_info: '神魏延的基本牌衍生物。',
                    shenzigu_basicequip5: '恣骨/基本牌',
                    shenzigu_basicequip5_info: '神魏延的基本牌衍生物。',
                    shenzigu_trickequip1: '恣骨/锦囊牌',
                    shenzigu_trickequip1_info: '神魏延的锦囊牌衍生物。',
                    shenzigu_trickequip2: '恣骨/锦囊牌',
                    shenzigu_trickequip2_info: '神魏延的锦囊牌衍生物。',
                    shenzigu_trickequip3: '恣骨/锦囊牌',
                    shenzigu_trickequip3_info: '神魏延的锦囊牌衍生物。',
                    shenzigu_trickequip4: '恣骨/锦囊牌',
                    shenzigu_trickequip4_info: '神魏延的锦囊牌衍生物。',
                    shenzigu_trickequip5: '恣骨/锦囊牌',
                    shenzigu_equipequip5_info: '神魏延的锦囊牌衍生物。',
                    shenzigu_equipequip1: '恣骨/装备牌',
                    shenzigu_equipequip1_info: '神魏延的装备牌衍生物。',
                    shenzigu_equipequip2: '恣骨/装备牌',
                    shenzigu_equipequip2_info: '神魏延的装备牌衍生物。',
                    shenzigu_equipequip3: '恣骨/装备牌',
                    shenzigu_equipequip3_info: '神魏延的装备牌衍生物。',
                    shenzigu_equipequip4: '恣骨/装备牌',
                    shenzigu_equipequip4_info: '神魏延的装备牌衍生物。',
                    shenzigu_equipequip5: '恣骨/装备牌',
                    shenzigu_equipequip5_info: '神魏延的装备牌衍生物。',
                },
                list: [],
            },
            skill: {
                skill: {
                    // 玩琉璃版全家直接死就完事了，尤其是赫拉西斯和孝子K÷
                    //渔曦真是一对苦命鸳鸯，而屎哥只能在旁边🦌，另外玩琉璃版父母双亡全家死绝。
                    //谋诸葛亮
                    mdtxjingmou: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        audioname: ['mdtx_zhugeliang2'],
                        zhuanhuanji: true,
                        owner: 'mdtx_zhugeliang',
                        mark: true,
                        marktext: "☯",
                        init: function (player) {
                            player.addSkill('mdtxjingmou_remove');
                        },
                        intro: {
                            content: function (storage, player, skill) {
                                if (player.storage.mdtxjingmou == true) return '此牌结算后将其交给任意一名角色。';
                                return '此牌无效，你可以弃置一张与此牌花色一致的手牌，对其造成一点火焰伤害。';
                            },
                        },
                        trigger: { global: 'phaseUseBegin' },
                        filter: function (event, player) {
                            return event.player.isIn() && !player.hasSkill('mdtxjingmou_mark') && player.countCards('he') > 0;
                        },
                        direct: true,
                        checkx: function (event, player) {
                            if (get.attitude(player, event.player) <= 0 && player.storage.mdtxjingmou != true) return true;
                            if (get.attitude(player, event.player) > 0 && player.storage.mdtxjingmou == true) return true;
                            return false;
                        },
                        content: function () {
                            'step 0'
                            var check = lib.skill.mdtxjingmou.checkx(trigger, player);
                            var num = player.countCards('he');
                            var prompt = '弃置至多' + get.translation(num) + '张牌并秘密记录其中一种花色与牌类型';
                            player.chooseToDiscard(get.prompt2('mdtxjingmou', trigger.player), prompt, 'he', [1, num]).set('ai', function (card) {
                                if (_status.event.check) {
                                    if (ui.selected.cards.length) {
                                        var suit = get.suit(card, player);
                                        var type = get.type2(card, player);
                                        for (var i of ui.selected.cards) {
                                            if (get.suit(i, player) == suit || get.type2(i, player) == type) return 0;
                                        }
                                    }
                                    return 5 - get.value(card);
                                }
                                return 0;
                            }).set('check', check).set('logSkill', ['mdtxjingmou', trigger.player]);
                            'step 1'
                            if (result.bool) {
                                var types = [];
                                var suits = [];
                                for (var i of result.cards) {
                                    types.add(get.type2(i));
                                    if (get.suit(i) != 'none') suits.add(get.suit(i));
                                }
                                event.types = types;
                                event.suits = suits;
                            }
                            else event.finish();
                            'step 2'
                            if (!event.types.length) event.goto(4);
                            if (event.types.length == 1) event._result = { control: event.types[0] };
                            else player.chooseControl(event.types).set('prompt', '靖谋：记录一种类型').set('ai', function () {
                                return Math.random();
                            });
                            'step 3'
                            player.addSkill('mdtxjingmou_mark');
                            player.markAuto('mdtxjingmou_mark', [result.control]);
                            'step 4'
                            if (!event.suits.length) event.finish();
                            if (event.suits.length == 1) event._result = { control: event.suits[0] };
                            else player.chooseControl(event.suits).set('prompt', '靖谋：记录一种花色').set('ai', function () {
                                return Math.random();
                            });
                            'step 5'
                            player.addSkill('mdtxjingmou_mark');
                            player.markAuto('mdtxjingmou_mark', [result.control]);
                        },
                        derivation: ['mdtxdingnan'],
                        group: ['mdtxjingmou_change'],
                        subSkill: {
                            remove: {
                                charlotte: true,
                                onremove: true,
                                mark: true,
                                intro: {
                                    markcount: () => null,
                                    content: '已移除的记录：$',
                                },
                            },
                            mark: {
                                audio: 'mdtxjingmou',
                                audioname: ['mdtx_zhugeliang2'],
                                charlotte: true,
                                mark: true,
                                onremove: true,
                                intro: {
                                    content: function (storage, player) {
                                        if (player == game.me || player.isUnderControl()) {
                                            var str = '【靖谋】已记录：';
                                            for (var i = 0; i < storage.length; i++) {
                                                str += ('' + get.translation(player.storage.mdtxjingmou_mark[i]) + '');
                                                if (i < storage.length - 1) str += ', ';
                                            }
                                            str += ''
                                            return str;
                                        }
                                    },
                                },
                                trigger: { global: 'useCard' },
                                forced: true,
                                filter: function (event, player) {
                                    var suit = get.suit(event.card);
                                    var type = get.type2(event.card);
                                    return player.getStorage('mdtxjingmou_mark').contains(suit) || player.getStorage('mdtxjingmou_mark').contains(type);
                                },
                                content: function () {
                                    'step 0'
                                    var suit = get.suit(trigger.card);
                                    var type = get.type2(trigger.card);
                                    if (player.getStorage('mdtxjingmou_mark').contains(suit)) {
                                        player.storage.mdtxjingmou_mark.remove(suit);
                                        player.markAuto('mdtxjingmou_remove', [suit]);
                                    }
                                    if (player.getStorage('mdtxjingmou_mark').contains(type)) {
                                        player.storage.mdtxjingmou_mark.remove(type);
                                        player.markAuto('mdtxjingmou_remove', [type]);
                                    }
                                    'step 1'
                                    if (!player.storage.mdtxjingmou) {
                                        trigger.all_excluded = true;
                                        trigger.targets.length = 0;
                                        game.log(trigger.card, '无效');
                                        player.changeZhuanhuanji('mdtxjingmou', null, 1);
                                    }
                                    else {
                                        player.addTempSkill('mdtxjingmou_effect');
                                        player.storage.mdtxjingmou_effect = {
                                            card: trigger.card,
                                        }
                                        player.changeZhuanhuanji('mdtxjingmou', null, 0);
                                        event.goto(5);
                                    }
                                    'step 2'
                                    var suit = get.suit(trigger.card);
                                    var str = '弃置一张' + get.translation(suit) + '手牌，对' + get.translation(trigger.player) + '造成一点火焰伤害';
                                    if (trigger.player && trigger.player.isIn() && player.hasCard(function (card) {
                                        return get.suit(card, player) == suit;
                                    }, 'h')) {
                                        player.chooseToDiscard('h', function (card, player) {
                                            return get.suit(card, player) == suit;
                                        }, get.prompt('mdtxjingmou', trigger.player), str).set('suit', suit).set('ai', function (card) {
                                            if (!_status.event.goon) return 0;
                                            return 8 - get.value(card);
                                        }).set('goon', get.damageEffect(trigger.player, player, player) > 0).logSkill = ['mdtxjingmou', trigger.player];
                                    }
                                    else event.goto(5);
                                    'step 3'
                                    if (result.bool) trigger.player.damage('fire');
                                    'step 4'
                                    game.delayx();
                                    'step 5'
                                    if (!player.getStorage('mdtxjingmou_mark').length) player.removeSkill('mdtxjingmou_mark');
                                    if (player.getStorage('mdtxjingmou_remove').length > 6) player.addSkillLog('mdtxdingnan');
                                },
                            },
                            effect: {
                                onremove: function (player) {
                                    delete player.storage.mdtxjingmou_effect;
                                },
                                charlotte: true,
                                trigger: { global: 'useCardAfter' },
                                direct: true,
                                filter: function (event, player) {
                                    var info = player.storage.mdtxjingmou_effect;
                                    return event.card && event.card == info.card;
                                },
                                content: function () {
                                    'step 0'
                                    player.removeSkill('mdtxjingmou_effect');
                                    if (trigger.cards.filterInD().length > 0) {
                                        var str = '将' + get.translation(trigger.cards.filterInD()) + '交给一名角色';
                                        player.chooseTarget(get.prompt('mdtxjingmou'), str, true).set('ai', function (target) {
                                            var att = get.attitude(_status.event.player, target);
                                            if (att < 3) return 0;
                                            if (target.hasJudge('lebu')) att /= 2;
                                            if (target.hasSkillTag('nogain')) att /= 10;
                                            return att / (1 + get.distance(player, target, 'absolute'));
                                        });
                                    }
                                    else event.finish();
                                    'step 1'
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        player.logSkill('mdtxjingmou', target);
                                        target.gain(trigger.cards.filterInD(), 'gain2');
                                    }
                                },
                            },
                            change: {
                                trigger: { global: 'phaseBefore', player: 'enterGame' },
                                direct: true,
                                filter: function (event, player) {
                                    return event.name != 'phase' || game.phaseNumber == 0;
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseControl('阳', '阴').set('prompt', '靖谋：选择你的转换技初始状态');
                                    'step 1'
                                    if (result.control && result.index == 1) player.changeZhuanhuanji('mdtxjingmou');
                                },
                            },
                        }
                    },
                    mdtxdingnan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        audioname: ['mdtx_zhugeliang2'],
                        enable: 'phaseUse',
                        usable: 1,
                        filterTarget: true,
                        selectTarget: function () {
                            return [1, game.countPlayer()];
                        },
                        content: function () {
                            'step 0'
                            var next = target.chooseToRespond('定南：请打出一张【杀】，否则受到一点伤害', { name: 'sha' });
                            next.autochoose = lib.filter.autoRespondSha;
                            'step 1'
                            game.delay(0.5);
                            if (!result.bool) target.damage();
                        },
                    },
                    mdtxguyi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        audioname: ['mdtx_zhugeliang2'],
                        init: function (player) {
                            if (!player.storage.mdtxguyi_count) player.storage.mdtxguyi_count = 0;
                            player.storage.mdtxguyi_damage = new Map();
                        },
                        getMaxKey: function (map) {
                            let maxKey = null;
                            let maxValue = -Infinity;
                            for (let [key, value] of map) {
                                if (value > maxValue) {
                                    maxKey = key;
                                    maxValue = value;
                                }
                            }
                            return maxKey;
                        },
                        trigger: {
                            player: ['loseAfter'],
                            global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                        },
                        filter: function (event, player) {
                            var evt = event.getl(player);
                            if (!evt || !evt.hs || !evt.hs.length) return false;
                            if (event.name == 'lose') {
                                for (var i in event.gaintag_map) {
                                    if (event.gaintag_map[i].contains('mdtxguyi')) return true;
                                }
                                return false;
                            }
                            return player.hasHistory('lose', function (evt) {
                                if (event != evt.getParent()) return false;
                                for (var i in evt.gaintag_map) {
                                    if (evt.gaintag_map[i].contains('mdtxguyi')) return true;
                                }
                                return false;
                            });
                        },
                        forced: true,
                        popup: false,
                        onremove: function (player) {
                            player.removeGaintag('mdtxguyi');
                        },
                        content: function () {
                            'step 0'
                            if (trigger.delay === false) game.delayx();
                            'step 1'
                            player.storage.mdtxguyi_count++;
                            if (player.storage.mdtxguyi_count > 7) player.storage.mdtxguyi_count = 7;
                            'step 2'
                            var cards = get.cards(player.storage.mdtxguyi_count);
                            game.cardsGotoOrdering(cards);
                            var next = player.chooseToMove('孤熠：获得一张牌并排列其他牌');
                            next.set('filterOk', function (moved) {
                                return moved[1].length == 1;
                            });
                            next.set('list', [
                                ['牌堆顶', cards],
                                ['获得'],
                            ])
                            next.set('filterMove', function (from, to, moved) {
                                if (moved[0].contains(from.link)) {
                                    if (typeof to == 'number') {
                                        if (to == 1) {
                                            if (moved[1].length) return false;
                                            return true;
                                        }
                                        return true;
                                    }
                                    return true;
                                }
                                else return true;
                            });
                            next.set('processAI', function (list) {
                                var cards = list[0][1].slice(0).sort(function (a, b) {
                                    return get.value(b) - get.value(a);
                                }), gains = cards.splice(0, 1);
                                return [cards, gains];
                            });
                            'step 3'
                            if (result.bool) {
                                player.logSkill('mdtxguyi');
                                var list = result.moved;
                                if (list[1].length) player.gain(list[1], 'gain2').gaintag = ['mdtxguyi'];
                                while (list[0].length) {
                                    ui.cardPile.insertBefore(list[0].pop(), ui.cardPile.firstChild);
                                }
                                game.updateRoundNumber();
                            }
                        },
                        group: ['mdtxguyi_draw', 'mdtxguyi_clear', 'mdtxguyi_add'],
                        subSkill: {
                            draw: {
                                audio: 'mdtxguyi',
                                audioname: ['mdtx_zhugeliang2'],
                                trigger: { global: 'phaseBefore', player: 'enterGame' },
                                forced: true,
                                priority: -Infinity,
                                unique: true,
                                filter: function (event, player) {
                                    return event.name != 'phase' || game.phaseNumber == 0;
                                },
                                content: function () {
                                    player.draw('nodelay').gaintag = ['mdtxguyi'];
                                    game.players.forEach(function (c) {
                                        player.storage.mdtxguyi_damage.set(c, 0);
                                    })
                                },
                            },
                            clear: {
                                audio: 'mdtxguyi',
                                audioname: ['mdtx_zhugeliang2'],
                                trigger: { global: 'roundFinish' },
                                forced: true,
                                popup: false,
                                priority: -Infinity,
                                content: function () {
                                    'step 0'
                                    player.storage.mdtxguyi_count = 0;
                                    'step 1'
                                    var t = lib.skill.mdtxguyi.getMaxKey(player.storage.mdtxguyi_damage);
                                    if (t == player) {
                                        player.logSkill('mdtxguyi_clear');
                                        player.draw('nodelay').gaintag = ['mdtxguyi'];
                                    }
                                    'step 2'
                                    game.players.forEach(function (c) {
                                        player.storage.mdtxguyi_damage.set(c, 0);
                                    })
                                },
                            },
                            add: {
                                trigger: { global: 'phaseEnd' },
                                forced: true,
                                popup: false,
                                priority: -Infinity,
                                content: function () {
                                    game.players.forEach(function (c) {
                                        var dam = player.storage.mdtxguyi_damage.get(c);
                                        for (var i of c.getHistory('sourceDamage')) {
                                            if (i.num) dam += i.num;
                                        }
                                        player.storage.mdtxguyi_damage.set(c, dam);
                                    })
                                },
                            },
                        },
                    },
                    mdtxyinmou: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        audioname: ['mdtx_pangtong2'],
                        zhuanhuanji: true,
                        owner: 'mdtx_pangtong',
                        mark: true,
                        marktext: "☯",
                        intro: {
                            content: function (storage, player, skill) {
                                if (player.storage.mdtxyinmou == true) return '其弃置当前体力值张手牌（不足则全弃）。';
                                return '其摸当前体力值张手牌（至多摸5）。';
                            },
                        },
                        trigger: {
                            global: 'phaseEnd'
                        },
                        direct: true,
                        filter: function (event, player) {
                            return game.countPlayer(function (current) {
                                return current.getHistory('lose', evt => evt && evt.hs && evt.hs.length).length >= Math.max(1, current.countCards('h'));
                            }) > 0;
                        },
                        content: function () {
                            'step 0'
                            game.players.forEach(current => {
                                current.getHistory('lose', evt => evt && evt.hs && evt.hs.length).length >= Math.max(1, current.countCards('h')) && current.addTempSkill('mdtxyinmou_mark', ['phaseAfter', 'phaseBefore']);
                            });
                            var cards = get.cards(3);
                            event.cardsx = cards;
                            game.cardsGotoOrdering(event.cardsx);
                            player.chooseButton(['寅谋：选择其中的一张牌', event.cardsx]).set('ai', function (button) {
                                var player = _status.event.player;
                                if (!player.storage.mdtxyinmou) return get.value(button.link);
                                return 15 - get.value(button.link);
                            });
                            'step 1'
                            if (result.bool) {
                                var card = result.links[0];
                                event.cardsy = card;
                                player.chooseTarget(true, '寅谋：令一名本回合失去手牌数大于等于当前手牌数的角色获得' + get.translation(event.cardsy), (card, player, target) => {
                                    return target.getHistory('lose', evt => evt && evt.hs && evt.hs.length).length >= Math.max(1, target.countCards('h'));
                                }).set('ai', target => {
                                    if (!player.storage.mdtxyinmou) return get.attitude(player, target);
                                    return -get.attitude(player, target);
                                });
                            }
                            else event.goto(3);
                            'step 2'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('mdtxyinmou', target);
                                if (!player.storage.mdtxyinmou) {
                                    target.gain(event.cardsy, 'draw').set('gaintag', ['mdtxyinmou_buff']);
                                    player.changeZhuanhuanji('mdtxyinmou', null, 1);
                                }
                                else {
                                    target.gain(event.cardsy, 'draw').set('gaintag', ['mdtxyinmou_debuff']);
                                    player.changeZhuanhuanji('mdtxyinmou', null, 0);
                                }
                                event.cardsx.remove(event.cardsy);
                            }
                            'step 3'
                            while (event.cardsx.length) {
                                var card = event.cardsx.pop();
                                card.fix();
                                ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                            }
                            'step 4'
                            game.updateRoundNumber();
                        },
                        global: ['mdtxyinmou_draw', 'mdtxyinmou_discard'],
                        group: 'mdtxyinmou_change',
                        subSkill: {
                            change: {
                                trigger: {
                                    global: "phaseBefore",
                                    player: "enterGame",
                                },
                                direct: true,
                                filter: function (event, player) {
                                    return event.name != "phase" || game.phaseNumber == 0;
                                },
                                content: function () {
                                    "step 0"
                                    player.chooseControl('阳', '阴').set('prompt', '寅谋：选择你的转换技初始状态');
                                    "step 1"
                                    if (result.control) {
                                        if (result.index == 0) {
                                            event.finish();
                                        }
                                        else if (result.index == 1) {
                                            player.changeZhuanhuanji('mdtxyinmou');
                                            event.finish();
                                        }
                                        else {
                                            event.finish();
                                        }
                                    }
                                },
                            },
                            draw: {
                                trigger: {
                                    player: ['loseAfter'],
                                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                                },
                                filter: function (event, player) {
                                    var evt = event.getl(player);
                                    if (!evt || !evt.cards2 || !evt.cards2.length) return false;
                                    if (event.name == 'lose') {
                                        for (var i in event.gaintag_map) {
                                            if (event.gaintag_map[i].contains('mdtxyinmou_buff')) return true;
                                        }
                                        return false;
                                    }
                                    return player.hasHistory('lose', function (evt) {
                                        if (event != evt.getParent()) return false;
                                        for (var i in evt.gaintag_map) {
                                            if (evt.gaintag_map[i].contains('mdtxyinmou_buff')) return true;
                                        }
                                        return false;
                                    });
                                },
                                priority: Infinity,
                                forced: true,
                                popup: false,
                                content: function () {
                                    'step 0'
                                    if (trigger.delay === false) game.delayx();
                                    'step 1'
                                    if (player.hp > 0) player.draw(Math.min(5, player.hp));
                                },
                            },
                            discard: {
                                trigger: {
                                    player: ['loseAfter'],
                                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                                },
                                filter: function (event, player) {
                                    var evt = event.getl(player);
                                    if (!evt || !evt.cards2 || !evt.cards2.length) return false;
                                    if (event.name == 'lose') {
                                        for (var i in event.gaintag_map) {
                                            if (event.gaintag_map[i].contains('mdtxyinmou_debuff')) return true;
                                        }
                                        return false;
                                    }
                                    return player.hasHistory('lose', function (evt) {
                                        if (event != evt.getParent()) return false;
                                        for (var i in evt.gaintag_map) {
                                            if (evt.gaintag_map[i].contains('mdtxyinmou_debuff')) return true;
                                        }
                                        return false;
                                    });
                                },
                                priority: -Infinity,
                                forced: true,
                                popup: false,
                                content: function () {
                                    'step 0'
                                    if (trigger.delay === false) game.delayx();
                                    'step 1'
                                    if (player.hp > 0) player.chooseToDiscard('h', player.hp, true);
                                },
                            },
                            mark: {
                                charlotte: true,
                                mark: true,
                                intro: {
                                    content: "可以被选择",
                                },
                            },
                        },
                    },
                    mdtxhongce: {
                        audio: 'ext:柊舞缇娜/audio:5',
                        audioname: ['mdtx_pangtong2'],
                        isMdtxhongce: function (card) {
                            var info = lib.card[card.name];
                            if (!info || info.type != 'trick') return false;
                            if (info.notarget) return true;
                            if (info.selectTarget != undefined) {
                                if (Array.isArray(info.selectTarget)) {
                                    if (info.selectTarget[0] < 0) return !info.toself;
                                    return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
                                }
                                else {
                                    if (info.selectTarget < 0) return !info.toself;
                                    return info.selectTarget != 1;
                                }
                            }
                            return false;
                        },
                        trigger: {
                            global: "phaseBefore",
                            player: "enterGame",
                        },
                        priority: -Infinity,
                        direct: true,
                        filter: function (event, player) {
                            return event.name != "phase" || game.phaseNumber == 0;
                        },
                        content: function () {
                            "step 0"
                            player.chooseTarget('令一名角色执行【宏策】', true).ai = function (target) {
                                return get.attitude(player, target);
                            };
                            "step 1"
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill("mdtxhongce", target);
                                event.target = target;
                                target.chooseButton(['请选择【宏策】要执行的效果', [
                                    [
                                        ['mdtxhongce1_1', '上策：将半数手牌（向上取整）替换为等量张随机的伤害牌，并视为使用一张无次数限制的【杀】'],
                                        ['mdtxhongce1_2', '中策：重铸一张手牌，视为使用一张单目标的普通锦囊牌'],
                                        ['mdtxhongce1_3', '下策：摸三张牌且这些牌不计入手牌上限'],
                                    ], 'textbutton'
                                ]], true).set('filterButton', function (button) {
                                    var player = _status.event.player;
                                    if (button.link == 'mdtxhongce1_1' && !target.countCards("h")) return false;
                                    if (button.link == 'mdtxhongce1_2' && !target.countCards("h")) return false;
                                    return true;
                                }).set('ai', function (button) {
                                    return ['mdtxhongce1_1', 'mdtxhongce1_2', 'mdtxhongce1_3'].randomGet();
                                }).set('selectButton', 1);
                            }
                            "step 2"
                            if (result.bool) {
                                var choices = result.links;
                                if (choices.contains('mdtxhongce1_1')) {
                                    game.log(target, '选择了', '#g【宏策】', '的', '#y上策');
                                    player.storage.mdtxhongce_top = true;
                                    player.addSkill('mdtxhongce_top');
                                    event.goto(3);
                                }
                                if (choices.contains('mdtxhongce1_2')) {
                                    game.log(target, '选择了', '#g【宏策】', '的', '#y中策');
                                    player.storage.mdtxhongce_middle = true;
                                    player.addSkill('mdtxhongce_middle');
                                    event.goto(9);
                                }
                                if (choices.contains('mdtxhongce1_3')) {
                                    game.log(target, '选择了', '#g【宏策】', '的', '#y下策');
                                    player.storage.mdtxhongce_bottom = true;
                                    player.addSkill('mdtxhongce_bottom');
                                    target.draw(3).gaintag = ['mdtxhongce_mark'];
                                    event.finish();
                                }
                            }
                            else event.finish();
                            "step 3"
                            target.chooseCard('h', true, Math.ceil(target.countCards('h') / 2), '将半数手牌（向上取整）替换为等量张随机的伤害牌');
                            "step 4"
                            if (result.bool) {
                                event.statC = result.cards.length;
                                target.$throw(event.statC, 2000);
                                target.loseToDiscardpile(result.cards);
                            }
                            else event.finish();
                            'step 5'
                            if (event.statC < 1) event.finish();
                            'step 6'
                            event.cards = [];
                            for (var i = 0; i < event.statC; i++) {
                                var cardP = get.cardPile2(function (card) {
                                    return !event.cards.contains(card) && get.tag(card, "damage");
                                });
                                if (cardP) {
                                    event.cards.push(cardP);
                                }
                                else {
                                    var cardD = get.discardPile(function (card) {
                                        return !event.cards.contains(card) && get.tag(card, "damage");
                                    });
                                    if (cardD) event.cards.push(cardD);
                                }
                            }
                            'step 7'
                            if (event.cards.length > 0) {
                                target.gain(event.cards, 'gain2');
                            }
                            'step 8'
                            if (target.hasUseTarget({ name: 'sha' })) target.chooseUseTarget({ name: 'sha' }, get.prompt('mdtxhongce'), '视为使用一张【杀】', true);
                            event.finish();
                            'step 9'
                            target.chooseToChongzhu(('重铸一张手牌'), 'h', true);
                            'step 10'
                            var list = [];
                            for (var i of lib.inpile) {
                                var card = { name: i, isCard: true };
                                if (get.type(i) == 'trick' && get.type(i) != 'delay' && !lib.skill.mdtxhongce.isMdtxhongce(card)) list.push(['锦囊', '', i]);
                            }
                            target.chooseButton(['宏策：视为使用其中一张锦囊牌', [list, 'vcard']])
                                .set('filterButton', button => {
                                    return game.hasPlayer(function (current) {
                                        return target.canUse(button.link[2], current);
                                    });
                                })
                                .set('ai', button => {
                                    var player = _status.event.player;
                                    return target.getUseValue({ name: button.link[2], nature: button.link[3] });
                                });
                            'step 11'
                            if (result.bool) target.chooseUseTarget({ name: result.links[0][2] }, true);
                        },
                        global: 'mdtxhongce_mark',
                        group: 'mdtxhongce_change',
                        subSkill: {
                            mark: {
                                mod: {
                                    ignoredHandcard: function (card, player) {
                                        if (card.hasGaintag('mdtxhongce_mark')) {
                                            return true;
                                        }
                                    },
                                    cardDiscardable: function (card, player, name) {
                                        if (name == 'phaseDiscard' && card.hasGaintag('mdtxhongce_mark')) {
                                            return false;
                                        }
                                    },
                                },
                            },
                            change: {
                                enable: 'phaseUse',
                                prompt: "出牌阶段限一次，你可以令一名角色执行【宏策】",
                                usable: 1,
                                filter: function (event, player) {
                                    return player.storage.mdtxhongce_bottom || player.storage.mdtxhongce_middle || player.storage.mdtxhongce_top;
                                },
                                filterTarget: function (card, player, target) {
                                    if (player.storage.mdtxhongce_bottom) return true;
                                    return target.countCards('h') > 0;
                                },
                                direct: true,
                                content: function () {
                                    'step 0'
                                    player.logSkill("mdtxhongce");
                                    if (player.storage.mdtxhongce_top) {
                                        event.goto(1);
                                    }
                                    if (player.storage.mdtxhongce_middle) {
                                        event.goto(7);
                                    }
                                    if (player.storage.mdtxhongce_bottom) {
                                        target.draw(3).gaintag = ['mdtxhongce_mark'];
                                        event.finish();
                                    }
                                    "step 1"
                                    target.chooseCard('h', true, Math.ceil(target.countCards('h') / 2), '将半数手牌（向上取整）替换为等量张随机的伤害牌');
                                    "step 2"
                                    if (result.bool) {
                                        event.statC = result.cards.length;
                                        target.$throw(event.statC, 2000);
                                        target.loseToDiscardpile(result.cards);
                                    }
                                    else event.finish();
                                    'step 3'
                                    if (event.statC < 1) event.finish();
                                    'step 4'
                                    event.cards = [];
                                    for (var i = 0; i < event.statC; i++) {
                                        var cardP = get.cardPile2(function (card) {
                                            return !event.cards.contains(card) && get.tag(card, "damage");
                                        });
                                        if (cardP) {
                                            event.cards.push(cardP);
                                        }
                                        else {
                                            var cardD = get.discardPile(function (card) {
                                                return !event.cards.contains(card) && get.tag(card, "damage");
                                            });
                                            if (cardD) event.cards.push(cardD);
                                        }
                                    }
                                    'step 5'
                                    if (event.cards.length > 0) {
                                        target.gain(event.cards, 'gain2');
                                    }
                                    'step 6'
                                    if (target.hasUseTarget({ name: 'sha' })) target.chooseUseTarget({ name: 'sha' }, get.prompt('mdtxhongce'), '视为使用一张【杀】', true);
                                    event.finish();
                                    'step 7'
                                    target.chooseToChongzhu(('重铸一张手牌'), 'h', true);
                                    'step 8'
                                    var list = [];
                                    for (var i of lib.inpile) {
                                        var card = { name: i, isCard: true };
                                        if (get.type(i) == 'trick' && get.type(i) != 'delay' && !lib.skill.mdtxhongce.isMdtxhongce(card)) list.push(['锦囊', '', i]);
                                    }
                                    target.chooseButton(['宏策：视为使用其中一张锦囊牌', [list, 'vcard']])
                                        .set('filterButton', button => {
                                            return game.hasPlayer(function (current) {
                                                return target.canUse(button.link[2], current);
                                            });
                                        })
                                        .set('ai', button => {
                                            var player = _status.event.player;
                                            return target.getUseValue({ name: button.link[2], nature: button.link[3] });
                                        });
                                    'step 9'
                                    if (result.bool) target.chooseUseTarget({ name: result.links[0][2] }, true);
                                },
                                ai: {
                                    order: 7.5,
                                    result: {
                                        player: -0.1,
                                        target: 1.1,
                                    }
                                },
                            },
                            top: {
                                mark: true,
                                marktext: "上策",
                                intro: {
                                    content: "出牌阶段限一次，你可以令一名角色将半数手牌（向上取整）替换为等量张随机的伤害牌，并视为使用一张无次数限制的【杀】。",
                                },
                                charlotte: true,
                                forced: true,
                                locked: true,
                            },
                            middle: {
                                mark: true,
                                marktext: "中策",
                                intro: {
                                    content: "出牌阶段限一次，你可以令一名角色重铸一张手牌，视为使用一张的单目标普通锦囊牌。",
                                },
                                charlotte: true,
                                forced: true,
                                locked: true,
                            },
                            bottom: {
                                mark: true,
                                marktext: "下策",
                                intro: {
                                    content: "出牌阶段限一次，你可以令一名角色摸三张牌且这些牌不计入手牌上限。",
                                },
                                charlotte: true,
                                forced: true,
                                locked: true,
                            },
                        },
                    },
                    //神马超
                    shenyuli: {
                        audio: 'ext:柊舞缇娜/audio:6',
                        trigger: { player: 'damageBegin4' },
                        forced: true,
                        filter: function (event, player) {
                            return event.nature == 'thunder' && event.num > 0;
                        },
                        content: function () {
                            'step 0'
                            trigger.cancel();
                            player.draw(trigger.num);
                            if (player.awakenedSkills.contains('shenjimie')) player.buff.shenyulix = true;
                            else event.finish();
                            'step 1'
                            if (player.buff.shenyulix && player.buff.shenyuliy) {
                                delete player.buff.shenyulix;
                                delete player.buff.shenyuliy;
                                player.restoreSkill('shenjimie');
                                game.log(player, '重置了', '#g〖寂灭〗');
                            }
                            else event.finish();
                        },
                        ai: {
                            nothunder: true,
                            effect: {
                                target: function (card, player, target, current) {
                                    if (get.tag(card, 'damage') && get.tag(card, 'thunderDamage')) return 'zeroplayertarget';
                                }
                            },
                        },
                        group: 'shenyuli_nature',
                        subSkill: {
                            nature: {
                                audio: 'shenyuli',
                                trigger: { source: 'damageBefore' },
                                forced: true,
                                filter: function (event, player) {
                                    return event.num > 0;
                                },
                                content: function () {
                                    'step 0'
                                    if (trigger.nature == 'thunder') trigger.num++;
                                    else trigger.nature = 'thunder';
                                    'step 1'
                                    if (player.awakenedSkills.contains('shenjimie')) player.buff.shenyuliy = true;
                                    else event.finish();
                                    'step 2'
                                    if (player.buff.shenyulix && player.buff.shenyuliy) {
                                        delete player.buff.shenyulix;
                                        delete player.buff.shenyuliy;
                                        player.restoreSkill('shenjimie');
                                        game.log(player, '重置了', '#g〖寂灭〗');
                                    }
                                    else event.finish();
                                },
                            },
                        },
                    },
                    shentingwei: {
                        audio: 'ext:柊舞缇娜/audio:4',
                        trigger: { player: 'useCardToPlayered' },
                        direct: true,
                        filter: function (event, player) {
                            return event.card.name == 'sha' && event.isFirstTarget && event.targets.some(i => i != player);
                        },
                        content: function () {
                            'step 0'
                            if (!player.storage.shentingwei) lib.skill.shentingwei.initList(player);
                            var prompt2 = '获得四个“霆”标记并选择一名目标角色';
                            player.chooseTarget(get.prompt('shentingwei'), prompt2, function (card, player, target) {
                                return _status.event.targets.contains(target) && target != player;
                            }).set('ai', function (target) {
                                return 2 - get.attitude(_status.event.player, target);
                            }).set('targets', trigger.targets);
                            'step 1'
                            if (result.bool) {
                                player.logSkill('shentingwei', result.targets);
                                player.line(result.targets, 'thunder');
                                player.addMark('shentingwei_mark', 4);
                                var target = result.targets[0];
                                event.target = target;
                            }
                            else event.finish();
                            'step 2'
                            var list = [
                                [1, `选项一：非锁定技失效至其下个回合结束`],
                                [2, `选项二：交给你一张装备牌`],
                                [3, `选项三：此牌对其造成伤害+1`],
                                [4, `选项四：随机弃一张牌`],
                            ]
                            event.target.chooseButton([`霆威：是否选择至多四项执行？`, [list, 'textbutton']])
                                .set('selectButton', [1, 4])
                                .set('filterButton', function (button) {
                                    if (button.link == 2) return event.target.hasCard(function (card) {
                                        return get.type(card) == 'equip';
                                    }, 'hes');
                                    if (button.link == 4) return event.target.countCards('he') > 0;
                                    return true;
                                })
                                .set('ai', function (button) {
                                    switch (button.link) {
                                        case 1:
                                            var skill = event.target.getSkills(null, false, false).filter(function (i) {
                                                return player.getStorage('shentingwei').includes(i);
                                            });
                                            if (get.attitude(event.target, player) >= 0 || player.countMark('shentingwei_mark') >= 10) return -Infinity;
                                            else if (skill.length > 0) return -Infinity;
                                            else if (event.target.hasSkillTag('nothunder') && player.hasSkill('shenyuli')) return Infinity;
                                            return 8 - player.countMark('shentingwei_mark');
                                            break;
                                        case 2:
                                            var he = event.target.getCards('he', function (card) {
                                                return get.value(card, event.target) <= 2 && get.type(card) == 'equip';
                                            });
                                            if (get.attitude(event.target, player) >= 0 || player.countMark('shentingwei_mark') >= 10) return -Infinity;
                                            else if (he.length) return player.countCards('hes') - he.length;
                                            return -Infinity;
                                            break;
                                        case 3:
                                            var hes = event.target.getCards('hes', function (card) {
                                                return get.name(card) == 'shan';
                                            });
                                            var s = event.target.getCards('s', function (card) {
                                                return get.name(card) == 'shan';
                                            });
                                            var num = event.target.countCards('he');
                                            if (get.attitude(event.target, player) >= 0 || player.countMark('shentingwei_mark') >= 10) return -Infinity;
                                            else if (event.target.hasSkillTag('filterDamage', null, { player: player, card: trigger.card }) || (event.target.hasSkillTag('nothunder') && player.hasSkill('shenyuli'))) return Infinity;
                                            else if (hes.length && s.length) return Infinity;
                                            else if (hes.length || event.target.hasSkillTag('useShan') || event.target.hasSkillTag('respondShan')) return Math.max(hes.length, num - hes.length);
                                            return -Infinity;
                                            break;
                                        case 4:
                                            var hes = event.target.getCards('hes', function (card) {
                                                return get.tag(card, 'save') || get.tag(card, 'recover') || get.value(card, event.target) >= 6;
                                            });
                                            if (get.attitude(event.target, player) >= 0 || player.countMark('shentingwei_mark') >= 10) return -Infinity;
                                            else if (event.target.hasSkillTag('nothunder') && player.hasSkill('shenyuli')) return Infinity;
                                            else if (hes.length) return event.target.countCards('he') - hes.length;
                                            return 8 - player.countMark('shentingwei_mark');
                                            break;
                                    }
                                });
                            'step 3'
                            if (result.bool) {
                                var choices = result.links;
                                game.log(event.target, '选择了', '#g【霆威】', '的', '#y' + choices);
                                player.removeMark('shentingwei_mark', result.links.length);
                                choices.forEach(choice => {
                                    switch (choice) {
                                        case 1:
                                            event.target.addTempSkill('fengyin', { player: 'phaseEnd' });
                                            break;
                                        case 2:
                                            var next = game.createEvent('shentingwei');
                                            next.player = player;
                                            next.target = event.target;
                                            next.setContent(lib.skill.shentingwei.contentx);
                                            break;
                                        case 3:
                                            event.target.addTempSkill('shentingwei_adddamage');
                                            event.target.storage.shentingwei_adddamage = {
                                                card: trigger.card,
                                            }
                                            break;
                                        case 4:
                                            var hs = event.target.getCards('he');
                                            if (hs.length) event.target.discard(hs.randomGets(1));
                                            break;
                                    }
                                });
                            }
                            else {
                                if (!event.target.isLinked()) event.target.link(true);
                                event.finish();
                            }
                        },
                        contentx: function () {
                            'step 0'
                            target.chooseCard('he', true, function (card, player) {
                                return get.type(card) == 'equip';
                            }).set('prompt', '选择交给' + get.translation(player) + '一张装备牌。');
                            'step 1'
                            if (result.cards && result.cards.length) target.give(result.cards, player);
                            else event.finish();
                        },
                        initList: function (player) {
                            var list, skills = [];
                            list = [];
                            for (var i in lib.character) list.push(i);
                            for (var i of list) {
                                for (var j of lib.character[i][3]) {
                                    if (j == 'xinfu_jianjie') continue;
                                    var skill = lib.skill[j];
                                    if (!skill || skill.forced || skill.locked || skill.juexingji || skill.hiddenSkill || skill.forever) continue;
                                    if (skill.init || skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
                                    var info = lib.translate[j + '_info'];
                                    if (info && info.indexOf('当你') != -1 && info.indexOf('濒死') != -1) skills.add(j);
                                    if (info && info.indexOf('视为') != -1 && info.indexOf('使用') != -1) skills.add(j);
                                    if (info && info.indexOf('将') != -1 && info.indexOf('当') != -1 && info.indexOf('使用') != -1) skills.add(j);
                                    if (info && (info.indexOf('准备阶段') != -1 || info.indexOf('出牌阶段') != -1 || info.indexOf('结束阶段') != -1)) skills.add(j);
                                    if (info && info.indexOf('摸') != -1 && info.indexOf('张牌') != -1) skills.add(j);
                                    if (info && info.indexOf('回') != -1 && info.indexOf('体力') != -1) skills.add(j);
                                    if (info && info.indexOf('造成') != -1 && info.indexOf('伤害') != -1) skills.add(j);
                                    if (info && info.indexOf('受到') != -1 && info.indexOf('伤害') != -1) skills.add(j);
                                }
                            }
                            player.storage.shentingwei = skills;
                        },
                        subSkill: {
                            adddamage: {
                                onremove: function (player) {
                                    delete player.storage.shentingwei_adddamage;
                                },
                                trigger: { player: 'damageBegin3' },
                                filter: function (event, player) {
                                    var info = player.storage.shentingwei_adddamage;
                                    return event.card && event.card == info.card;
                                },
                                silent: true,
                                popup: false,
                                forced: true,
                                charlotte: true,
                                content: function () {
                                    trigger.num++;
                                },
                            },
                            mark: {
                                marktext: '霆',
                                intro: {
                                    name: '霆威',
                                    content: 'mark',
                                    onunmark: true,
                                },
                            },
                        },
                    },
                    shenjimie: {
                        audio: 'ext:柊舞缇娜/audio:4',
                        direct: true,
                        limited: true,
                        skillAnimation: true,
                        animationColor: 'thunder',
                        trigger: { player: 'phaseUseEnd' },
                        filter: function (event, player) {
                            return player.countMark('shentingwei_mark') >= 8;
                        },
                        content: function () {
                            'step 0'
                            var prompt2 = '失去八个“霆”，对一名角色造成等于其体力上限的伤害';
                            player.chooseTarget(get.prompt('shenjimie'), prompt2).set('ai', function (target) {
                                var player = _status.event.player;
                                return target.hp * get.damageEffect(target, player, player);
                            });
                            'step 1'
                            if (result.bool && result.targets && result.targets.length) {
                                player.logSkill('shenjimie', result.targets);
                                player.awakenSkill('shenjimie');
                                delete player.buff.shenyulix;
                                delete player.buff.shenyuliy;
                                player.removeMark('shentingwei_mark', 8);
                                result.targets[0].damage(result.targets[0].maxHp);
                            }
                            else event.finish();
                        },
                        ai: {
                            expose: 0.25,
                            threaten: 1.7,
                        },
                    },
                    //幻孙策
                    twjianyan: {
                        audio: 'ext:柊舞缇娜/audio:3',
                        forever: true,
                        direct: true,
                        owner: 'huan_sunce',
                        trigger: { global: 'dying' },
                        content: function () {
                            'step 0'
                            player.chooseBool(get.prompt('twjianyan'), '是否入幻').set('ai', function () {
                                return true;
                            });
                            'step 1'
                            if (result.bool) {
                                if (!game.hasPlayer(function (current) {
                                    return current.hasSkill('twhuju');
                                })) {
                                    player.logSkill('twjianyan');
                                    event.goto(6);
                                }
                            }
                            else event.finish();
                            'step 2'
                            var num = game.countPlayer(function (current) {
                                return current.hasSkill('twhuju');
                            });
                            var str = '选择至多' + get.cnNumber(num) + '名角色失去〖虎踞〗，然后你回复等量体力并获得等量的非伤害牌';
                            player.chooseTarget([1, num], function (card, player, target) {
                                return target.hasSkill('twhuju');
                            }, get.prompt('twjianyan'), str).set('ai', function (target) {
                                var player = _status.event.player;
                                if (ui.selected.targets.length) return (player.getDamagedHp() - ui.selected.targets.length) * Math.max(1, target.hp);
                                return Math.max(1, target.hp) * player.getDamagedHp();
                            });
                            'step 3'
                            if (result.bool) {
                                var targets = result.targets.sortBySeat();
                                event.num = targets.length;
                                player.logSkill('twjianyan', targets);
                                targets.forEach(function (target) {
                                    target.removeSkill('twhuju');
                                });
                            }
                            else {
                                player.logSkill('twjianyan');
                                event.goto(6);
                            }
                            'step 4'
                            event.cards = [];
                            for (var i = 0; i < event.num; i++) {
                                var cardP = get.cardPile2(function (card) {
                                    return !event.cards.contains(card) && !get.tag(card, 'damage');
                                });
                                if (cardP) event.cards.push(cardP);
                                else {
                                    var cardD = get.discardPile(function (card) {
                                        return !event.cards.contains(card) && !get.tag(card, 'damage');
                                    });
                                    if (cardD) event.cards.push(cardD);
                                }
                            }
                            'step 5'
                            player.recover(event.num);
                            if (event.cards.length > 0) player.gain(event.cards, 'draw');
                            'step 6'
                            if (game.hasPlayer(function (current) {
                                return current.hasSkill('twhuju') && current.storage.twhuju != true;
                            })) {
                                var targets = game.filterPlayer(function (target) {
                                    return target.hasSkill('twhuju') && target.storage.twhuju != true;
                                });
                                targets.forEach(function (target) {
                                    target.changeZhuanhuanji('twhuju');
                                });
                            }
                            player.removeSkill(['twjianyan', 'twliwu', 'twsaoting'], false, false);
                            player.addSkill(['twjizhi', 'twsuzhen', 'twdangjiang'], true, true, false, false);
                            player.swapBackground('twjianyan');
                            player.storage.isHuan = true;
                        },
                        derivation: ['twhuju'],
                        group: ['twjianyan_init', 'twjianyan_buff'],
                        subSkill: {
                            init: {
                                audio: 'twjianyan',
                                trigger: { global: 'phaseBefore', player: 'enterGame' },
                                forced: true,
                                filter: function (event, player) {
                                    if (!game.hasPlayer(function (current) {
                                        return !current.hasSkill('twhuju');
                                    })) return false;
                                    return event.name != 'phase' || game.phaseNumber == 0;
                                },
                                logTarget: function (event, player) {
                                    return game.filterPlayer(function (current) {
                                        return !current.hasSkill('twhuju');
                                    });
                                },
                                content: function () {
                                    var list = game.filterPlayer(function (current) {
                                        return !current.hasSkill('twhuju');
                                    }).sortBySeat();
                                    for (var i of list) i.addSkill('twhuju');
                                },
                            },
                            buff: {
                                charlotte: true,
                                mod: {
                                    maxHandcard: function (player, num) {
                                        return num + game.countPlayer(function (current) {
                                            return current.hasSkill('twhuju') && current.storage.twhuju != true;
                                        });
                                    },
                                },
                            },
                        },
                    },
                    twliwu: {
                        audio: 'ext:柊舞缇娜/audio:4',
                        init: function (player) {
                            player.addSkill('huan_hp_init');
                            game.players.forEach(function (current) {
                                current.addSkill('huan_hp');
                            });
                        },
                        trigger: { global: 'huan_hpAfter' },
                        forced: true,
                        content: function () {
                            'step 0'
                            player.draw();
                            'step 1'
                            event.card = result[0];
                            if (get.type(event.card) == 'basic') {
                                player.addSkill('twliwu_effect');
                                player.addMark('twliwu_effect', 1, false);
                            }
                        },
                        subSkill: {
                            effect: {
                                charlotte: true,
                                onremove: true,
                                intro: {
                                    markcount: function (storage, player) {
                                        return '[+' + player.countMark('twliwu_effect') + ']';
                                    },
                                    content: '下一次造成的伤害+#',
                                },
                                trigger: { source: 'damageBegin1' },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return player.countMark('twliwu_effect') > 0;
                                },
                                content: function () {
                                    trigger.num += player.countMark('twliwu_effect');
                                    player.removeSkill('twliwu_effect');
                                },
                            },
                        },
                    },
                    twsaoting: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'chooseToUse',
                        zhuanhuanji: 'number',
                        mark: true,
                        marktext: '☯',
                        intro: {
                            markcount: () => 0,
                            content: function (storage) {
                                return '你可以将一张伤害牌当' + ((storage || 0) % 2 ? '【酒】' : '【决斗】') + '使用';
                            },
                        },
                        filter: function (event, player) {
                            var storage = player.storage.twsaoting;
                            var name = (storage || 0) % 2 ? 'jiu' : 'juedou';
                            if (event.filterCard({ name: name }, player, event) && player.hasCard(function (card) {
                                return get.tag(card, 'damage');
                            }, 'hes')) return true;
                            return false;
                        },
                        viewAsFilter: function (player) {
                            var storage = player.storage.twsaoting;
                            var name = (storage || 0) % 2 ? 'jiu' : 'juedou';
                            if (event.filterCard({ name: name }, player, event) && player.hasCard(function (card) {
                                return get.tag(card, 'damage');
                            }, 'hes')) return true;
                            return false;
                        },
                        viewAs: function (cards, player) {
                            var storage = player.storage.twsaoting;
                            return (storage || 0) % 2 ? { name: 'jiu' } : { name: 'juedou' };
                        },
                        check: function (card) {
                            var player = _status.event.player;
                            var storage = player.storage.twsaoting;
                            var name = (storage || 0) % 2 ? 'jiu' : 'juedou';
                            return get.value({ name: name }, player) - get.value(card);
                        },
                        position: 'hes',
                        filterCard: function (card, player) {
                            return get.tag(card, 'damage');
                        },
                        precontent: function () {
                            player.changeZhuanhuanji('twsaoting');
                        },
                        ai: {
                            order: function (item, player) {
                                player = player || _status.event.player;
                                var storage = _status.event.player.storage.twsaoting;
                                var name = (storage || 0) % 2 ? 'jiu' : 'juedou';
                                return get.order({ name: name }) + 0.1;
                            },
                        },
                        group: 'twsaoting_use',
                        subSkill: {
                            use: {
                                trigger: { player: 'useCardToPlayered' },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.skill == 'twsaoting' && event.target && event.target.isDamaged();
                                },
                                content: function () {
                                    player.draw();
                                },
                            },
                        },
                    },
                    twjizhi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        forever: true,
                        direct: true,
                        owner: 'huan_sunce',
                        trigger: { player: 'dying' },
                        filter: function (event, player) {
                            return game.hasPlayer(function (current) {
                                return current.hasSkill('twhuju');
                            });
                        },
                        content: function () {
                            'step 0'
                            var num = game.countPlayer(function (current) {
                                return current.hasSkill('twhuju');
                            });
                            var str = '选择至多' + get.cnNumber(num) + '名角色失去〖虎踞〗，然后你回复等量体力并获得等量的伤害牌';
                            player.chooseTarget([1, num], function (card, player, target) {
                                return target.hasSkill('twhuju');
                            }, get.prompt('twjizhi'), str).set('ai', function (target) {
                                var player = _status.event.player;
                                if (ui.selected.targets.length) return (player.getDamagedHp() - ui.selected.targets.length) * Math.max(1, target.hp);
                                return Math.max(1, target.hp);
                            });
                            'step 1'
                            if (result.bool) {
                                var targets = result.targets.sortBySeat();
                                event.num = targets.length;
                                player.logSkill('twjizhi', targets);
                                targets.forEach(function (target) {
                                    target.removeSkill('twhuju');
                                });
                            }
                            else event.finish();
                            'step 2'
                            event.cards = [];
                            for (var i = 0; i < event.num; i++) {
                                var cardP = get.cardPile2(function (card) {
                                    return !event.cards.contains(card) && get.tag(card, 'damage');
                                });
                                if (cardP) event.cards.push(cardP);
                                else {
                                    var cardD = get.discardPile(function (card) {
                                        return !event.cards.contains(card) && get.tag(card, 'damage');
                                    });
                                    if (cardD) event.cards.push(cardD);
                                }
                            }
                            'step 3'
                            player.recover(event.num);
                            if (event.cards.length > 0) player.gain(event.cards, 'draw');
                            'step 4'
                            if (game.hasPlayer(function (current) {
                                return current.hasSkill('twhuju') && current.storage.twhuju == true;
                            })) {
                                var targets = game.filterPlayer(function (target) {
                                    return target.hasSkill('twhuju') && target.storage.twhuju == true;
                                });
                                targets.forEach(function (target) {
                                    target.changeZhuanhuanji('twhuju');
                                });
                            }
                            player.removeSkill(['twjizhi', 'twsuzhen', 'twdangjiang'], false, false);
                            player.addSkill(['twjianyan', 'twliwu', 'twsaoting'], true, true, false, false);
                            player.swapBackground('twjizhi');
                            player.storage.isHuan = false;
                        },
                        derivation: ['twhuju'],
                        group: 'twjizhi_buff',
                        subSkill: {
                            buff: {
                                charlotte: true,
                                mod: {
                                    cardUsable: function (card, player, num) {
                                        if (card.name == 'sha') return num + game.countPlayer(function (current) {
                                            return current.hasSkill('twhuju') && current.storage.twhuju == true;
                                        });
                                    },
                                },
                            },
                        },
                    },
                    twsuzhen: {
                        audio: 'ext:柊舞缇娜/audio:3',
                        init: function (player) {
                            player.addSkill('huan_hp_init');
                            game.players.forEach(function (current) {
                                current.addSkill('huan_hp');
                            });
                        },
                        trigger: { global: 'huan_hpAfter' },
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            return event.player.countCards('he') > 0;
                        },
                        content: function () {
                            'step 0'
                            if (trigger.player != player) player.gainPlayerCard(trigger.player, 'he', true);
                            else event.goto(2);
                            'step 1'
                            if (result.bool && result.cards && result.cards.length) {
                                player.logSkill('twsuzhen', trigger.player);
                                var card = result.cards[0], type = get.type2(card, false);
                                if (type == 'basic') player.recover();
                                event.finish();
                            }
                            else event.finish();
                            'step 2'
                            player.chooseCard('肃阵：请展示一张牌', 'he', true).set('ai', function (card) {
                                if (get.type2(card, false) == 'basic') return 8 + get.value(card);
                                return 4 - get.value(card);
                            });
                            'step 3'
                            if (result.bool && result.cards && result.cards.length) {
                                player.logSkill('twsuzhen');
                                player.showCards(result.cards, get.translation(player) + '发动了【肃阵】');
                                var card = result.cards[0], type = get.type2(card, false);
                                if (type == 'basic') player.recover();
                            }
                        },
                    },
                    twdangjiang: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        mod: {
                            targetInRange: function (card) {
                                if (card.storage?.twdangjiang) return true;
                            },
                        },
                        enable: 'chooseToUse',
                        zhuanhuanji: 'number',
                        mark: true,
                        marktext: '☯',
                        intro: {
                            markcount: () => 0,
                            content: function (storage) {
                                return '你可以将一张非伤害牌当' + ((storage || 0) % 2 ? '无距离限制的任意【杀】' : '【无中生有】') + '使用';
                            },
                        },
                        filter: function (event, player) {
                            var num = (player.storage.twdangjiang || 0) % 2;
                            if (!player.hasCard(function (card) {
                                return !get.tag(card, 'damage');
                            }, 'hes')) return false;
                            if (event.filterCard({ name: 'wuzhong' }, player, event) && num < 1) return true;
                            if (event.filterCard({ name: 'sha' }, player, event) && num > 0) return true;
                            return false;
                        },
                        locked: false,
                        chooseButton: {
                            dialog: function (event, player) {
                                var num = (player.storage.twdangjiang || 0) % 2;
                                var list = [];
                                for (var i = 0; i < lib.inpile.length; i++) {
                                    var name = lib.inpile[i];
                                    if (name == 'sha') {
                                        if (event.filterCard({ name: name }, player, event) && num > 0) list.push(['基本', '', 'sha']);
                                        for (var j of lib.inpile_nature) {
                                            if (event.filterCard({
                                                name: name,
                                                nature: j
                                            }, player, event) && num > 0) list.push(['基本', '', 'sha', j]);
                                        }
                                    }
                                    else if (name == 'wuzhong' && event.filterCard({ name: name }, player, event) && num < 1) list.push(['锦囊', '', name]);
                                }
                                return ui.create.dialog('荡江', [list, 'vcard']);
                            },
                            filter: function (button, player) {
                                return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                            },
                            check: function (button) {
                                if (_status.event.getParent().type != 'phase') return 1;
                                var player = _status.event.player;
                                return player.getUseValue({ name: button.link[2], nature: button.link[3] }, false);
                            },
                            backup: function (links, player) {
                                return {
                                    audio: 'twdangjiang',
                                    filterCard(card, player) {
                                        return !get.tag(card, 'damage');
                                    },
                                    popname: true,
                                    check: function (card) {
                                        return 8 - get.value(card);
                                    },
                                    position: 'hes',
                                    viewAs: { name: links[0][2], nature: links[0][3], storage: { twdangjiang: true } },
                                    precontent: function () {
                                        player.changeZhuanhuanji('twdangjiang');
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                return '将一张非伤害牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                            },
                        },
                        hiddenCard: function (player, name) {
                            if (!player.hasCard(function (card) {
                                return !get.tag(card, 'damage');
                            }, 'hes')) return false;
                            if (name == (player.storage.twdangjiang || 0) % 2 ? 'sha' : 'wuzhong') return true;
                            return false;
                        },
                        ai: {
                            fireAttack: true,
                            respondSha: true,
                            skillTagFilter: function (player) {
                                if (!player.hasCard(function (card) {
                                    return !get.tag(card, 'damage');
                                }, 'hes')) return false;
                                var num = (player.storage.twdangjiang || 0) % 2;
                                return num > 0;
                            },
                            order: 6,
                            result: { player: 1 },
                        },
                        group: 'twdangjiang_use',
                        subSkill: {
                            use: {
                                trigger: { player: 'useCardToPlayered' },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.skill == 'twdangjiang_backup' && event.target && event.target.isHealthy();
                                },
                                content: function () {
                                    player.draw();
                                },
                            },
                        },
                    },
                    twhuju: {
                        onremove: true,
                        mark: true,
                        zhuanhuanji: true,
                        marktext: '☯',
                        intro: {
                            content: function (storage, player, skill) {
                                if (player.storage.twhuju == true) return '你令〖寄志〗拥有者的出【杀】次数+1。';
                                return '你令〖翦魇〗拥有者的手牌上限+1。';
                            },
                        },
                    },
                    huan_hp: {
                        init: function (player) {
                            if (player.isDamaged()) player.storage.huan_hp = 0;
                            else player.storage.huan_hp = 1;
                        },
                        trigger: { player: ['changeHp', 'gainMaxHpEnd', 'loseMaxHpEnd'] },
                        silent: true,
                        locked: true,
                        direct: true,
                        charlotte: true,
                        firstDo: true,
                        fixed: true,
                        unique: true,
                        filter: function (event, player) {
                            if (player.isDamaged() && player.storage.huan_hp == 0) return false;
                            if (player.isHealthy() && player.storage.huan_hp == 1) return false;
                            return true;
                        },
                        content: function () {
                            if (player.isDamaged()) player.storage.huan_hp = 0;
                            else player.storage.huan_hp = 1;
                        },
                        subSkill: {
                            init: {
                                trigger: { global: 'phaseBefore', player: 'enterGame' },
                                forced: true,
                                fixed: true,
                                silent: true,
                                charlotte: true,
                                filter: function (event, player) {
                                    return event.name != 'phase' || game.phaseNumber == 0;
                                },
                                content: function () {
                                    game.players.forEach(function (current) {
                                        current.addSkill('huan_hp');
                                    });
                                },
                            },
                        },
                    },
                    //势孙綝
                    calulian: {
                        audio: 'ext:柊舞缇娜/audio:4',
                        enable: 'phaseUse',
                        usable: 1,
                        position: 'he',
                        filter: function (event, player) {
                            return player.countCards('he') > 0 && game.hasPlayer(function (target) {
                                return lib.skill.calulian.filterTarget(null, player, target);
                            });
                        },
                        filterCard: function (card) {
                            var suit = get.suit(card);
                            for (var i = 0; i < ui.selected.cards.length; i++) {
                                if (get.suit(ui.selected.cards[i]) == suit) return false;
                            }
                            return true;
                        },
                        selectCard: function () {
                            var player = _status.event.player;
                            var suits = [];
                            for (var i of player.getCards('he')) suits.add(get.suit(i));
                            return [1, suits.length];
                        },
                        check: function (card) {
                            var player = _status.event.player;
                            if (player.hasValueTarget(card)) return 6 - get.value(card);
                            return Infinity;
                        },
                        filterTarget: function (card, player, target) {
                            if (!player.inRange(target)) return false;
                            return target != player;
                        },
                        selectTarget: -1,
                        multitarget: true,
                        multiline: true,
                        content: function () {
                            'step 0'
                            event.targets = targets;
                            event.playerNum = event.targets.length;
                            'step 1'
                            event.currentPlayer = event.targets[event.targets.length - event.playerNum];
                            var target = event.currentPlayer;
                            if (!target.countCards('he')) event._result = {
                                bool: false,
                            }
                            else {
                                target.chooseCard('he', '戮连：交给' + get.translation(player) + '一张牌').set('ai', function (card) {
                                    var player = _status.event.player,
                                        target = _status.event.getParent().player,
                                        val = get.value(card);
                                    if (get.attitude(player, target) > 0 && target.hasValueTarget(card)) return 30 - val;
                                    if (get.attitude(player, target) <= 0 && !target.hasValueTarget(card)) return 6.5 - val;
                                    return -Infinity;
                                });
                            }
                            'step 2'
                            var target = event.currentPlayer;
                            if (result.bool) target.give(result.cards[0], player);
                            else {
                                player.addTempSkill('calulian_add');
                                player.addMark('calulian_add', 1, false);
                            }
                            'step 3'
                            if (event.playerNum > 1) {
                                event.playerNum--;
                                event.goto(1);
                            }
                        },
                        subSkill: {
                            add: {
                                audio: 'calulian',
                                charlotte: true,
                                onremove: true,
                                intro: {
                                    markcount: function (storage, player) {
                                        return '[+' + player.countMark('calulian_add') + ']';
                                    },
                                    content: '本回合造成的下#次伤害+1',
                                },
                                trigger: { source: 'damageBegin1' },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return player.countMark('calulian_add') > 0;
                                },
                                content: function () {
                                    'step 0'
                                    player.removeMark('calulian_add', 1, false);
                                    trigger.num++;
                                    'step 1'
                                    if (!player.countMark('calulian_add')) player.removeSkill('calulian_add');
                                },
                            },
                        },
                        ai: {
                            order: 5,
                            result: {
                                target: -1,
                            },
                        },
                    },
                    canigu: {
                        audio: 'ext:柊舞缇娜/audio:4',
                        trigger: { player: 'useCardAfter' },
                        filter: function (event, player) {
                            var type = get.type2(event.card);
                            if (!player.hasHistory('lose', function (evt) {
                                return evt.hs.length > 0 && evt.getParent() == event;
                            })) return false;
                            if (player.countCards('h', function (card) {
                                return get.type2(card) == type;
                            }) > 0) return false;
                            var list = [];
                            var targets = event._targets || event.targets;
                            for (var i = 0; i < targets.length; i++) {
                                if (targets[i].countCards('e') <= player.countCards('e') && targets[i].isIn()) list.push(targets[i]);
                                if (targets[i].hp <= player.hp && targets[i].isIn()) list.push(targets[i]);
                            }
                            if (!event.targets || !event.card || event.targets.length == 0) return false;
                            return list.length > 0;
                        },
                        forced: true,
                        content: function () {
                            'step 0'
                            var targets = trigger.targets;
                            event.targets = targets;
                            'step 1'
                            if (event.targets.filter(function (target) {
                                return target.hp <= player.hp && target.isIn();
                            }).length > 0) {
                                event.goon1 = true;
                                event.targets.forEach(function (current) {
                                    if (current.isIn() && !current.isLinked()) current.link(true);
                                });
                            }
                            if (event.targets.filter(function (target) {
                                return target.countCards('e') <= player.countCards('e') && target.isIn();
                            }).length > 0) {
                                event.goon2 = true;
                                player.draw();
                            }
                            'step 2'
                            event.listx = [];
                            game.players.forEach(function (target) {
                                if (game.hasPlayer(function (current) {
                                    return target.hp > current.hp;
                                })) event.listx.add(target);
                            });
                            if (!event.listx.length) event.finish();
                            'step 3'
                            if (event.goon1 && event.goon2) {
                                var prompt = '对一名体力值不为最小的角色造成一点火焰伤害';
                                player.chooseTarget(get.prompt('canigu'), true, prompt, function (card, player, target) {
                                    return event.listx.contains(target);
                                }).set('ai', function (target) {
                                    var player = _status.event.player;
                                    return get.damageEffect(target, player, player);
                                });
                            }
                            else event.finish();
                            'step 4'
                            if (result.bool && result.targets && result.targets.length) {
                                player.logSkill('canigu', result.targets);
                                player.line(result.targets[0], 'fire');
                                result.targets[0].damage('fire');
                            }
                            else event.finish();
                        },
                    },
                    //幻大乔
                    twguose: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        init: function (player) {
                            player.addSkill('huan_hp_init');
                            game.players.forEach(function (current) {
                                current.addSkill('huan_hp');
                            });
                        },
                        trigger: { global: 'huan_hpAfter' },
                        direct: true,
                        filter: function (event, player) {
                            if (event.player.hasJudge('lebu')) return false;
                            if (event.player.storage._disableJudge) return false;
                            return event.player.countCards('he') > 0 || player.countCards('he') > 0;
                        },
                        content: function () {
                            'step 0'
                            if (trigger.player == player) {
                                event.target = player;
                                event.goto(2);
                            }
                            else player.chooseTarget(true, '选择〖帼色〗的目标', function (card, player, target) {
                                return (target == player || target == trigger.player) && target.countCards('he') > 0;
                            }).set('ai', function (target) {
                                return -get.attitude(_status.event.player, target);
                            });
                            'step 1'
                            if (result.bool && result.targets.length) event.target = result.targets[0];
                            else event.finish();
                            'step 2'
                            player.choosePlayerCard(event.target, 'he').set('ai', function (card) {
                                if (get.attitude(_status.event.player, _status.event.target) >= 0) return 0;
                                return get.buttonValue(card);
                            }).set('prompt', '帼色：将' + get.translation(event.target) + '的一张牌当作【乐不思蜀】置入其判定区中');
                            'step 3'
                            if (result.bool) {
                                player.logSkill('twguose', trigger.player);
                                var card = result.cards[0];
                                trigger.player.$throw(card);
                                game.delayx();
                                trigger.player.addJudge({ name: 'lebu' }, result.cards);
                                player.draw(2);
                            }
                            else event.finish();
                        },
                        group: 'twguose_judge',
                        subSkill: {
                            judge: {
                                audio: 'twguose',
                                trigger: { global: 'lebuAfter' },
                                round: 1,
                                prompt: function (event, player) {
                                    return '令此【乐不思蜀】改为跳过弃牌阶段';
                                },
                                check: function (event, player) {
                                    if (get.attitude(player, event.player) <= 0) return false;
                                    return true;
                                },
                                filter: function (event, player) {
                                    return event.player?.skipList.contains('phaseUse');
                                },
                                content: function () {
                                    trigger.player.skipList.remove('phaseUse');
                                    trigger.player.skip('phaseDiscard');
                                },
                            },
                        },
                    },
                    twliuli: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'useCardToTargeted' },
                        direct: true,
                        filter: function (event, player) {
                            if (!event.target.countCards('ej', function (card) {
                                return get.suit(card) == 'diamond' && lib.filter.cardDiscardable(card, event.target);
                            })) return false;
                            return get.tag(event.card, 'damage') && event.target.isIn();
                        },
                        logTarget: 'target',
                        content: function () {
                            'step 0'
                            player.choosePlayerCard(trigger.target, 'ej').set('filterButton', function (button) {
                                return get.suit(button.link) == 'diamond' && lib.filter.cardDiscardable(card, trigger.target);
                            }).set('prompt', '流俪：弃置' + get.translation(trigger.target) + '场上的一张方片牌').set('ai', function (card) {
                                if (get.attitude(_status.event.player, trigger.target) > 0) return 20 - get.value(button.link);
                                return 0;
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('twliuli', trigger.target);
                                trigger.target.discard(result.links[0], 'notBySelf').discarder = player;
                                trigger.getParent().excluded.add(trigger.target);
                                if (player.isDamaged() && trigger.target.isDamaged()) player.draw(2);
                                if (player.isHealthy() && trigger.target.isHealthy()) player.draw(2);
                            }
                            else event.finish();
                        },
                    },
                    //势周瑜
                    cachiyun: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        audioname: ['ca_zhouyu1', 'ca_zhouyu2'],
                        trigger: { global: 'loseAsyncAfter', player: 'gainAfter' },
                        direct: true,
                        filter: function (event, player) {
                            if (_status.currentPhase != player && player.modifiedSkill?.caxiongzi == true) return false;
                            if (player.hasSkill('cachiyun_block') || event.getg(player).length == 0) return false;
                            return player.countCards('h') > 0;
                        },
                        content: function () {
                            'step 0'
                            player.addTempSkill('cachiyun_block');
                            var num = player.countCards('h');
                            player.chooseCardTarget({
                                position: 'h',
                                filterCard: true,
                                selectCard: [1, num],
                                filterTarget: function (card, player, target) {
                                    return player != target;
                                },
                                ai1: function (card) {
                                    return 5 - get.value(card);
                                },
                                ai2: function (target) {
                                    var att = get.attitude(_status.event.player, target);
                                    if (target.hasSkillTag('nogain')) att /= 10;
                                    if (target.hasJudge('lebu')) att /= 5;
                                    return att;
                                },
                                prompt: '炽沄：是否交给一名其他角色' + (num > 1 ? '至多' + get.cnNumber(num) : '一') + '张牌',
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('cachiyun', result.targets[0]);
                                event.target = result.targets[0];
                                event.cards = result.cards;
                                player.give(event.cards, event.target);
                            }
                            else event.finish();
                            'step 2'
                            event.colors = [];
                            for (var card of event.cards) {
                                if (lib.color.contains(get.color(card))) event.colors.add(get.color(card));
                            }
                            var list = [
                                [1, `选项一：展示所有` + get.translation(event.colors) + `手牌，受到` + get.translation(player) + `造成的一点火焰伤害`],
                                [2, `选项二：横置，令` + get.translation(player) + `摸两张牌`],
                            ];
                            event.target.chooseButton([`炽沄：选择一项执行`, [list, 'textbutton']]).set('filterButton', function (button) {
                                if (button.link == 1) return player.modifiedSkill?.caxiongzi_1 != true;
                                if (button.link == 2) return player.modifiedSkill?.caxiongzi_2 != true;
                                return true;
                            }).set('forced', true).set('ai', function (button) {
                                switch (button.link) {
                                    case 1:
                                        return -get.attitude(event.target, player) * Math.max(1, event.target.getDamagedHp());
                                        break;
                                    case 2:
                                        return get.attitude(event.target, player);
                                        break;
                                }
                            });
                            'step 3'
                            if (result.bool) {
                                if (result.links[0] == 1) {
                                    player.line(event.target, 'fire');
                                    if (event.target.countCards('h') > 0) {
                                        var showcards = event.target.getCards('h', function (card) { return event.colors.contains(get.color(card)) });
                                        event.target.showCards(showcards, get.translation(event.target) + '因【炽沄】展示');
                                    }
                                    event.target.damage('fire');
                                }
                                else {
                                    if (!event.target.isLinked()) event.target.link(true);
                                    player.draw(2);
                                }
                            }
                        },
                        subSkill: {
                            block: {
                                charlotte: true,
                                forced: true,
                                silent: true,
                                popup: false,
                                trigger: { global: ['phaseZhunbeiEnd', 'phaseJudgeEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd', 'phaseJieshuEnd'] },
                                content: function () {
                                    player.removeSkill('cachiyun_block');
                                },
                            },
                        },
                    },
                    cayanhui: {
                        audio: 'ext:柊舞缇娜/audio:6',
                        audioname: ['ca_zhouyu1', 'ca_zhouyu2'],
                        trigger: { player: 'useCardToTargeted' },
                        direct: true,
                        logTarget: 'target',
                        filter: function (event, player) {
                            if (_status.currentPhase != player && player.modifiedSkill?.caxiongzi == true) return false;
                            return event.target.countCards('h') > 0 && event.target.isIn();
                        },
                        content: function () {
                            'step 0'
                            player.choosePlayerCard(trigger.target, 'h', '展示' + get.translation(trigger.target) + '的一张手牌');
                            'step 1'
                            if (result.bool && result.cards && result.cards.length) {
                                player.logSkill('cayanhui', trigger.target);
                                player.addTempSkill('cayanhui_choose', { global: ['phaseZhunbeiAfter', 'phaseJudgeAfter', 'phaseDrawAfter', 'phaseUseAfter', 'phaseDiscardAfter', 'phaseJieshuAfter'] });
                                if (player.getStorage('cayanhui_show').contains(result.cards[0])) {
                                    player.markAuto('cayanhui_choose', [trigger.target]);
                                    trigger.target.discard(result.cards[0]);
                                }
                                else trigger.target.showCards(result.cards[0], get.translation(trigger.target) + '因【焰洄】展示');
                            }
                            else event.finish();
                        },
                        group: 'cayanhui_effect',
                        subSkill: {
                            choose: {
                                trigger: { global: ['phaseZhunbeiEnd', 'phaseJudgeEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd', 'phaseJieshuEnd'] },
                                direct: true,
                                firstDo: true,
                                charlotte: true,
                                onremove: true,
                                filter: function (event, player) {
                                    if (!player.getStorage('cayanhui_count').length) return false;
                                    if (_status.currentPhase != player && player.modifiedSkill?.caxiongzi == true) return false;
                                    if (player.modifiedSkill?.caxiongzi_1 != true && game.hasPlayer(function (current) {
                                        return player.getStorage('cayanhui_choose').contains(current);
                                    })) return true;
                                    if (player.modifiedSkill?.caxiongzi_2 != true) return true;
                                    return false;
                                },
                                content: function () {
                                    'step 0'
                                    event.num = player.getStorage('cayanhui_count').length;
                                    var list = [
                                        [1, `选项一：对一名弃置过牌的角色造成一点火焰伤害`],
                                        [2, `选项二：摸` + get.translation(event.num) + `张牌`],
                                    ];
                                    player.chooseButton([`焰洄：选择一项执行`, [list, 'textbutton']]).set('filterButton', function (button) {
                                        if (button.link == 1) return player.modifiedSkill?.caxiongzi_1 != true && game.hasPlayer(function (current) {
                                            return current.hasHistory('lose', function (evt) {
                                                return evt.type == 'discard' && evt.cards2.length > 0;
                                            });
                                        });
                                        if (button.link == 2) return player.modifiedSkill?.caxiongzi_2 != true;
                                        return true;
                                    }).set('forced', true).set('ai', function (button) {
                                        return Math.random();
                                    });
                                    'step 1'
                                    if (result.bool) event.control = result.links[0];
                                    else event.finish();
                                    'step 2'
                                    var prompt = '对一名弃置过牌的角色造成一点火焰伤害';
                                    if (event.control == 1) player.chooseTarget(get.prompt('cayanhui'), true, prompt, function (card, player, target) {
                                        return target.hasHistory('lose', function (evt) {
                                            return evt.type == 'discard' && evt.cards2.length > 0;
                                        });
                                    }).set('ai', function (target) {
                                        var player = _status.event.player;
                                        return get.damageEffect(target, player, player);
                                    });
                                    else event.goto(4);
                                    'step 3'
                                    if (result.bool && result.targets && result.targets.length) {
                                        player.logSkill('cayanhui', result.targets[0]);
                                        player.line(result.targets[0], 'fire');
                                        result.targets[0].damage('fire');
                                    }
                                    event.finish();
                                    'step 4'
                                    player.logSkill('cayanhui');
                                    if (event.control == 2 && event.num > 0) player.draw(event.num);
                                },
                            },
                            effect: {
                                trigger: { global: 'showCardsEnd' },
                                forced: true,
                                charlotte: true,
                                popup: false,
                                firstDo: true,
                                content: function () {
                                    player.addTempSkill('cayanhui_count');
                                    player.addTempSkill('cayanhui_show');
                                    player.markAuto('cayanhui_count', [trigger.player]);
                                    game.broadcastAll(function (cards) {
                                        cards.forEach(function (card) {
                                            player.markAuto('cayanhui_show', [card]);
                                        });
                                    }, trigger.cards);
                                },
                            },
                            show: { charlotte: true, onremove: true },
                            count: { charlotte: true, onremove: true },
                        },
                    },
                    cayanhuix: {
                        audio: 'ext:柊舞缇娜/audio:3',
                        audioname: ['ca_zhouyu1', 'ca_zhouyu2'],
                    },
                    cafentao: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        audioname: ['ca_zhouyu1', 'ca_zhouyu2'],
                        trigger: { global: 'damageBegin1' },
                        forced: true,
                        popup: false,
                        firstDo: true,
                        filter: function (event, player) {
                            if (_status.currentPhase != player && player.modifiedSkill?.caxiongzi == true) return false;
                            return player != event.player && event.nature == 'fire' && event.player.isLinked();
                        },
                        content: function () {
                            'step 0'
                            if (trigger.notLink()) delete player.storage.cafentao_damage;
                            'step 1'
                            event.num = player.storage.cafentao_damage ? player.storage.cafentao_damage : trigger.num;
                            event.target = trigger.player;
                            var list = [
                                [1, `选项一：此次传导中的伤害+1`],
                                [2, `选项二：弃置半数牌（向上取整）且此伤害结算结束后其横置`],
                            ];
                            event.target.chooseButton([`焚涛：选择一项执行`, [list, 'textbutton']]).set('filterButton', function (button) {
                                if (button.link == 1) return player.modifiedSkill?.caxiongzi_1 != true;
                                if (button.link == 2) return player.modifiedSkill?.caxiongzi_2 != true;
                                return true;
                            }).set('forced', true).set('ai', function (button) {
                                switch (button.link) {
                                    case 1:
                                        if (event.target.hasSkillTag('nofire')) return Infinity;
                                        if (event.target.hasSkillTag('filterDamage', null, { player: player, card: trigger.card })) return Infinity;
                                        return -Infinity;
                                        break;
                                    case 2:
                                        return 10 + Math.random();
                                        break;
                                }
                            });
                            'step 2'
                            if (result.bool) {
                                player.logSkill('cafentao', event.target);
                                if (result.links[0] == 2) {
                                    if (event.target.countCards('h') > 0) event.target.chooseToDiscard('h', Math.ceil(event.target.countCards('h') / 2), true);
                                    event.target.addTempSkill('cafentao_link', {
                                        global: 'phaseEnd',
                                        player: ['damageAfter', 'damageZero', 'damageCancelled'],
                                    });
                                    trigger.num = event.num;
                                }
                                else {
                                    player.storage.cafentao_damage = event.num + 1;
                                    trigger.num = event.num + 1;
                                    player.addTempSkill('cafentao_damage');
                                }
                            }
                            else event.finish();
                        },
                        subSkill: {
                            link: {
                                charlotte: true,
                                onremove: function (player) {
                                    if (!player.isLinked()) player.link(true);
                                },
                            },
                            damage: {
                                charlotte: true,
                                onremove: function (player) {
                                    delete player.storage.cafentao_damage;
                                },
                            },
                        },
                    },
                    caxiongzi: {
                        audio: 'ext:柊舞缇娜/audio:4',
                        owner: 'ca_zhouyu',
                        limited: true,
                        trigger: { player: 'phaseZhunbeiBegin' },
                        skillAnimation: true,
                        animationColor: 'wood',
                        direct: true,
                        filter: function (event, player) {
                            return player.modifiedSkill?.caxiongzi != true && player.modifiedSkill?.caxiongzi_1 != true && player.modifiedSkill?.caxiongzi_2 != true;
                        },
                        content: function () {
                            'step 0'
                            var list = [
                                [1, `选项一`],
                                [2, `选项二`],
                            ];
                            var str = `是否发动〖雄姿〗：删除其他技能中的选项并摸两张牌`;
                            player.chooseButton([str, [list, 'textbutton']]).set('ai', function (button) {
                                return Math.random();
                            }).set('filterButton', function (button) {
                                var player = _status.event.player;
                                if (button.link == 1) return player.modifiedSkill?.caxiongzi_1 != true;
                                if (button.link == 2) return player.modifiedSkill?.caxiongzi_2 != true;
                                return false;
                            });
                            'step 1'
                            if (result.bool) {
                                player.awakenSkill('caxiongzi');
                                if (!player.modifiedSkill) player.modifiedSkill = {};
                                player.modifiedSkill.caxiongzi = true;
                                player.swapBackground('caxiongzi');
                                result.links.forEach(function (choice) {
                                    switch (choice) {
                                        case 1:
                                            player.logSkill('caxiongzi_blue');
                                            player.modifiedSkill.caxiongzi_1 = true;
                                            game.log(player, '删除了', '#y选项一');
                                            player.swapBackground('caxiongzi', 1);
                                            player.draw(2);
                                            break;
                                        case 2:
                                            player.logSkill('caxiongzi_red');
                                            player.modifiedSkill.caxiongzi_2 = true;
                                            game.log(player, '删除了', '#y选项二');
                                            player.swapBackground('caxiongzi', 2);
                                            player.draw(2);
                                            break;
                                    }
                                });
                            }
                            else event.finish();
                        },
                        group: 'caxiongzi_init',
                        subSkill: {
                            blue: { audio: 2 },
                            red: { audio: 2 },
                            init: {
                                trigger: { global: 'phaseBefore', player: 'enterGame' },
                                direct: true,
                                firstDo: true,
                                filter: function (event, player) {
                                    return event.name != 'phase' || game.phaseNumber == 0;
                                },
                                content: function () {
                                    player.logSkill('caxiongzi_init');
                                    game.delay();
                                },
                            },
                        },
                    },
                    //新鲍三娘
                    mb_shuyong: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: {
                            player: ["useCard", "respond"],
                        },
                        direct: true,
                        filter: function (event, player) {
                            return game.hasPlayer(function (current) {
                                return current != player && current.countCards("hej");
                            }) && event.card.name == 'sha';
                        },
                        content: function () {
                            'step 0'
                            player.chooseTarget(get.prompt('mb_shuyong'), '获得一名其他角色区域内的一张牌', function (card, player, target) {
                                if (player == target) return false;
                                return target.countGainableCards(player, 'hej') > 0;
                            }).set('ai', function (target) {
                                return 10 - get.attitude(_status.event.player, target);
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target = target;
                                player.logSkill('mb_shuyong', target);
                                player.gainPlayerCard(target, 'hej', true);
                                player.addTempSkill('mb_shuyong_round', "roundStart");
                            }
                            else event.finish();
                            'step 2'
                            if (!player.getStorage('mb_shuyong_round').contains(target)) {
                                player.markAuto('mb_shuyong_round', [target]);
                            }
                            else target.draw();
                        },
                        subSkill: {
                            round: {
                                charlotte: true,
                                onremove: true,
                                intro: { content: '本轮已获得过$的牌' },
                            },
                        },
                    },
                    mb_xushen: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        limited: true,
                        enable: 'phaseUse',
                        skillAnimation: true,
                        animationColor: 'fire',
                        filter: function (event, player) {
                            return player.hp > 0;
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var list = [
                                    [0, '失去一点体力并摸一张牌'],
                                    [1, '失去两点体力并摸两张牌'],
                                    [2, '失去三点体力并摸三张牌'],
                                ];
                                return ui.create.dialog('许身：你可以选择一项', 'hidden', [list, 'textbutton']);
                            },
                            filter: function (button, player) {
                                switch (button.link) {
                                    case 0:
                                        return player.hp > 0;
                                    case 1:
                                        return player.hp > 0;
                                    case 2:
                                        return player.hp > 0;
                                }
                            },
                            prompt: function (links) {
                                if (links[0] === 0) return '失去一点体力并摸一张牌';
                                if (links[0] === 1) return '失去两点体力并摸两张牌';
                                if (links[0] === 2) return '失去三点体力并摸三张牌';
                            },
                            check: function (button) {
                                var player = _status.event.player;
                                if (button.link == 0) return player.hp * player.hp;
                                if (button.link == 1) return player.hp * player.hp - player.hp;
                                if (button.link == 2) return player.hp * player.hp - player.hp * 2;
                            },
                            backup: function (links) {
                                return {
                                    audio: 'mb_xushen',
                                    popname: true,
                                    link: links[0],
                                    content: function () {
                                        player.awakenSkill('mb_xushen');
                                        player.addTempSkill('mb_xushen_effect');
                                        if (lib.skill.mb_xushen_backup.link == 0) {
                                            player.draw();
                                            player.loseHp();
                                            event.finish();
                                        }
                                        if (lib.skill.mb_xushen_backup.link == 1) {
                                            player.draw(2);
                                            player.loseHp(2);
                                            event.finish();
                                        }
                                        if (lib.skill.mb_xushen_backup.link == 2) {
                                            player.draw(3);
                                            player.loseHp(3);
                                            event.finish();
                                        }
                                    },
                                }
                            },
                        },
                        ai: {
                            order: 10,
                            result: {
                                player: function (player) {
                                    if (player.hp > 3) return 0;
                                    return player.countCards('hs', { name: ['tao', 'jiu'] }) || game.hasPlayer(function (current) {
                                        return get.attitude(player, current) > 4 && current.countCards('h', 'tao')
                                    }) ? 1 : 0;
                                },
                            },
                        },
                        derivation: ['mb_wusheng', 'mb_dangxian', 'mb_zhiman'],
                        subSkill: {
                            backup: {},
                            effect: {
                                trigger: {
                                    player: "recoverAfter",
                                },
                                filter: function (event, player) {
                                    if (player.isDying()) return false;
                                    return event.mb_xushen == true;
                                },
                                onremove: true,
                                direct: true,
                                silent: true,
                                popup: false,
                                content: function () {
                                    'step 0'
                                    player.markAuto('mb_xushen_effect', [trigger.source]);
                                    'step 1'
                                    player.chooseTarget(get.prompt('mb_xushen'), '令一名本次濒死结算中令你回复过体力的角色获得〖武圣〗（若其已拥有〖武圣〗则摸三张牌）', function (card, player, target) {
                                        return player.getStorage('mb_xushen_effect').contains(target);
                                    }).set('ai', function (target) {
                                        return get.attitude(_status.event.player, target);
                                    });
                                    'step 2'
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        player.line(target, 'fire');
                                        player.logSkill('mb_xushen', target);
                                        if (target.hasSkill('mb_wusheng')) target.draw(3);
                                        else target.addSkillLog('mb_wusheng');
                                    }
                                    'step 3'
                                    player.chooseTarget(get.prompt('mb_xushen'), '令一名本次濒死结算中令你回复过体力的角色获得〖当先〗（若其已拥有〖当先〗则摸三张牌）', function (card, player, target) {
                                        return player.getStorage('mb_xushen_effect').contains(target);
                                    }).set('ai', function (target) {
                                        return get.attitude(_status.event.player, target);
                                    });
                                    'step 4'
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        player.line(target, 'fire');
                                        player.logSkill('mb_xushen', target);
                                        if (target.hasSkill('mb_dangxian')) target.draw(3);
                                        else target.addSkillLog('mb_dangxian');
                                    }
                                    'step 5'
                                    player.chooseTarget(get.prompt('mb_xushen'), '令一名本次濒死结算中令你回复过体力的角色获得〖制蛮〗（若其已拥有〖制蛮〗则摸三张牌）', function (card, player, target) {
                                        return player.getStorage('mb_xushen_effect').contains(target);
                                    }).set('ai', function (target) {
                                        return get.attitude(_status.event.player, target);
                                    });
                                    'step 6'
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        player.line(target, 'fire');
                                        player.logSkill('mb_xushen', target);
                                        if (target.hasSkill('mb_zhiman')) target.draw(3);
                                        else target.addSkillLog('mb_zhiman');
                                    }
                                    'step 7'
                                    player.removeSkill('mb_xushen_effect');
                                },
                                group: ['mb_xushen_count', 'mb_xushen_mark'],
                                intro: { content: '本次濒死结算中因$回复过体力' },
                            },
                            count: {
                                trigger: {
                                    player: "recoverBegin",
                                },
                                forced: true,
                                silent: true,
                                popup: false,
                                filter: function (event, player) {
                                    if (!event.source) return false;
                                    if (!player.isDying()) return false;
                                    var evt = event.getParent('dying').getParent(2);
                                    return evt.name == 'mb_xushen_backup' && evt.player == player;
                                },
                                content: function () {
                                    trigger.mb_xushen = true;
                                },
                            },
                            mark: {
                                trigger: {
                                    player: "recoverAfter",
                                },
                                filter: function (event, player) {
                                    if (!player.isDying()) return false;
                                    return event.mb_xushen == true;
                                },
                                direct: true,
                                silent: true,
                                popup: false,
                                content: function () {
                                    player.markAuto('mb_xushen_effect', [trigger.source]);
                                },
                            },
                        },
                    },
                    mb_zhennan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: {
                            global: "useCardToPlayered",
                        },
                        filter: function (event, player) {
                            if (!event.isFirstTarget || !event.targets.includes(player) || get.type2(event.card) !== "trick") {
                                return false;
                            }
                            return event.targets.length > Math.max(1, event.player.hp);
                        },
                        direct: true,
                        content: function () {
                            "step 0"
                            player.chooseCardTarget({
                                position: 'he',
                                filterCard: lib.filter.cardDiscardable,
                                filterTarget: true,
                                ai1: function (card) {
                                    return 9 - get.value(card);
                                },
                                ai2: function (target) {
                                    var player = _status.event.player;
                                    return get.damageEffect(target, player, player);
                                },
                                prompt: get.prompt('mb_zhennan'),
                                prompt2: "弃置一张牌对一名角色造成一点伤害",
                            });
                            "step 1"
                            if (result.bool) {
                                player.line(result.targets, 'fire');
                                player.logSkill('mb_zhennan', result.targets);
                                player.discard(result.cards);
                                result.targets[0].damage();
                            }
                            else {
                                event.finish();
                            }
                        },
                        ai: {
                            expose: 0.25,
                        },
                    },
                    mb_wusheng: {
                        audio: 'ext:柊舞缇娜/audio:1',
                        mod: {
                            targetInRange: function (card) {
                                if (get.suit(card) == 'diamond' && card.name == 'sha') return true;
                            },
                        },
                        locked: false,
                        enable: ["chooseToRespond", "chooseToUse"],
                        filterCard: function (card, player) {
                            if (get.zhu(player, 'shouyue')) return true;
                            return get.color(card) == 'red';
                        },
                        position: "hes",
                        viewAs: {
                            name: "sha",
                        },
                        viewAsFilter: function (player) {
                            if (get.zhu(player, 'shouyue')) {
                                if (!player.countCards('hes')) return false;
                            }
                            else {
                                if (!player.countCards('hes', { color: 'red' })) return false;
                            }
                        },
                        prompt: "将一张红色牌当【杀】使用或打出",
                        check: function (card) {
                            var val = get.value(card);
                            if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
                            return 5 - val;
                        },
                        ai: {
                            respondSha: true,
                            skillTagFilter: function (player) {
                                if (get.zhu(player, 'shouyue')) {
                                    if (!player.countCards('hes')) return false;
                                }
                                else {
                                    if (!player.countCards('hes', { color: 'red' })) return false;
                                }
                            },
                        },
                    },
                    mb_dangxian: {
                        audio: 'ext:柊舞缇娜/audio:1',
                        trigger: { player: 'phaseBegin' },
                        forced: true,
                        content: function () {
                            'step 0'
                            var card = get.discardPile(function (card) {
                                return card.name == 'sha';
                            });
                            if (card) player.gain(card, 'gain2');
                            'step 1'
                            game.updateRoundNumber();
                            var next = player.phaseUse();
                            event.next.remove(next);
                            trigger.next.push(next);
                        },
                    },
                    mb_zhiman: {
                        audio: 'ext:柊舞缇娜/audio:1',
                        trigger: { source: 'damageBegin2' },
                        filter: function (event, player) {
                            return player != event.player;
                        },
                        check: function (event, player) {
                            if (get.damageEffect(event.player, player, player) < 0) return true;
                            var att = get.attitude(player, event.player);
                            if (att > 0 && event.player.countCards('j')) return true;
                            if (event.num > 1) {
                                if (att < 0) return false;
                                if (att > 0) return true;
                            }
                            var cards = event.player.getGainableCards(player, 'he');
                            for (var i = 0; i < cards.length; i++) {
                                if (get.equipValue(cards[i]) >= 6) return true;
                            }
                            return false;
                        },
                        logTarget: 'player',
                        content: function () {
                            if (trigger.player.countGainableCards(player, 'hej')) {
                                player.gainPlayerCard(trigger.player, 'hej', true);
                            }
                            trigger.cancel();
                        }
                    },
                    //移动版灵雎
                    sbjieyuan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        group: ['sbjieyuan_more', 'sbjieyuan_less'],
                        subSkill: {
                            more: {
                                trigger: { source: 'damageBegin1' },
                                direct: true,
                                filter: function (event, player) {
                                    return player.buff.sbjieyuan_red !== true;
                                },
                                content: function () {
                                    'step 0'
                                    var target = trigger.player;
                                    event.target = target;
                                    var list = [];
                                    list.push('选项一');
                                    if (player.countCards('he', { color: 'black' }) > 0) list.push('选项二');
                                    if (player.buff.sbjieyuan_black !== true) list.push('背水！');
                                    list.push('cancel2');
                                    player.chooseControl(list).set('choiceList', [
                                        '获得' + (player.buff.sbjieyuan_black ? '两张' : '一张') + '黑色牌',
                                        '弃置一张黑色牌令伤害+' + (player.buff.sbjieyuan_black ? '2' : '1'),
                                        '背水！升级〖竭缘〗',]).set('prompt', get.prompt('sbjieyuan', event.target)).set('ai', function () {
                                            if (get.attitude(player, event.target) >= 0 || event.target.hasSkillTag('filterDamage', null, { player: player, card: trigger.card })) return '选项一';
                                            if (player.buff.sbjieyuan_black !== true && get.attitude(player, event.target) < 0 && !player.countCards('he', { color: 'black' })) return '背水！';
                                            if (get.attitude(player, event.target) < 0 && player.countCards('he', { color: 'black' }) > 0) return '选项二';
                                            return 'cancel2';
                                        });
                                    'step 1'
                                    if (result.control != 'cancel2') {
                                        player.logSkill('sbjieyuan', target);
                                        event.control = result.control;
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (event.control == '选项一' || event.control == '背水！') event.statC = player.buff.sbjieyuan_black ? 2 : 1;
                                    else event.goto(5);
                                    'step 3'
                                    event.cards = [];
                                    for (var i = 0; i < event.statC; i++) {
                                        var cardP = get.cardPile2(function (card) {
                                            return !event.cards.contains(card) && get.color(card) == 'black';
                                        });
                                        if (cardP) event.cards.push(cardP);
                                        else {
                                            var cardD = get.discardPile(function (card) {
                                                return !event.cards.contains(card) && get.color(card) == 'black';
                                            });
                                            if (cardD) event.cards.push(cardD);
                                        }
                                    }
                                    'step 4'
                                    if (event.cards.length > 0) player.gain(event.cards, 'draw');
                                    else game.log('牌堆中或弃牌堆中黑色牌数量不足', 'visible');
                                    'step 5'
                                    if ((event.control == '选项二' || event.control == '背水！') && player.countCards('he', { color: 'black' }) > 0) {
                                        var next = player.chooseToDiscard(true, get.prompt('sbjieyuan', target), 'he');
                                        next.set('filterCard', function (card) {
                                            return get.color(card) == 'black';
                                        });
                                        next.set('prompt2', '弃置一张黑色牌令伤害+' + (player.buff.sbjieyuan_black ? '2' : '1'));
                                        next.set('ai', function (card) {
                                            return 8 - get.value(card);
                                        });
                                    }
                                    else event.goto(7);
                                    'step 6'
                                    if (result.bool) {
                                        if (player.buff.sbjieyuan_black) trigger.num += 2;
                                        else trigger.num++;
                                    }
                                    'step 7'
                                    if (event.control == '背水！') {
                                        player.buff.sbjieyuan_black = true;
                                        game.log(player, '升级了', '#g〖竭缘〗');
                                    }
                                },
                            },
                            less: {
                                trigger: { player: 'damageBegin2' },
                                direct: true,
                                filter: function (event, player) {
                                    return player.buff.sbjieyuan_black !== true;
                                },
                                content: function () {
                                    'step 0'
                                    event.numx = trigger.num;
                                    var list = [];
                                    list.push('选项一');
                                    if (player.countCards('he', { color: 'red' }) > 0) list.push('选项二');
                                    if (player.buff.sbjieyuan_red !== true) list.push('背水！');
                                    list.push('cancel2');
                                    player.chooseControl(list).set('choiceList', [
                                        '获得' + (player.buff.sbjieyuan_red ? '两张' : '一张') + '红色牌',
                                        '弃置一张红色牌令伤害-' + (player.buff.sbjieyuan_red ? '2' : '1'),
                                        '背水！升级〖竭缘〗',]).set('prompt', get.prompt('sbjieyuan', player)).set('ai', function () {
                                            if ((player.hp <= 2 || event.numx > 1) && player.countCards('he', { color: 'red' }) > 0) return '选项二';
                                            if (player.buff.sbjieyuan_red !== true && (player.hp <= 2 || event.numx > 1) && !player.countCards('he', { color: 'red' })) return '背水！';
                                            return '选项一';
                                        });
                                    'step 1'
                                    if (result.control != 'cancel2') {
                                        player.logSkill('sbjieyuan', target);
                                        event.control = result.control;
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (event.control == '选项一' || event.control == '背水！') event.statC = player.buff.sbjieyuan_red ? 2 : 1;
                                    else event.goto(5);
                                    'step 3'
                                    event.cards = [];
                                    for (var i = 0; i < event.statC; i++) {
                                        var cardP = get.cardPile2(function (card) {
                                            return !event.cards.contains(card) && get.color(card) == 'red';
                                        });
                                        if (cardP) event.cards.push(cardP);
                                        else {
                                            var cardD = get.discardPile(function (card) {
                                                return !event.cards.contains(card) && get.color(card) == 'red';
                                            });
                                            if (cardD) event.cards.push(cardD);
                                        }
                                    }
                                    'step 4'
                                    if (event.cards.length > 0) player.gain(event.cards, 'draw');
                                    else game.log('牌堆中或弃牌堆中红色牌数量不足', 'visible');
                                    'step 5'
                                    if ((event.control == '选项二' || event.control == '背水！') && player.countCards('he', { color: 'red' }) > 0) {
                                        var next = player.chooseToDiscard(true, get.prompt('sbjieyuan', target), 'he');
                                        next.set('filterCard', function (card) {
                                            return get.color(card) == 'red';
                                        });
                                        next.set('prompt2', '弃置一张红色牌令伤害-' + (player.buff.sbjieyuan_red ? '2' : '1'));
                                        next.set('ai', function (card) {
                                            return 9 - get.value(card);
                                        });
                                    }
                                    else event.goto(7);
                                    'step 6'
                                    if (result.bool) {
                                        if (player.buff.sbjieyuan_red) trigger.num -= 2;
                                        else trigger.num--;
                                    }
                                    'step 7'
                                    if (event.control == '背水！') {
                                        player.buff.sbjieyuan_red = true;
                                        game.log(player, '升级了', '#g〖竭缘〗');
                                    }
                                },
                            },
                        },
                    },
                    sbfenxin: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        mode: ['identity'],
                        trigger: { source: 'dieBegin' },
                        unique: true,
                        filter: function (event, player) {
                            if (event.player.identity == 'zhu' || event.player.identity == 'mingzhong' || event.player == player) return false;
                            if (event.player.getStockSkills('仲村由理', '天下第一').filter(function (skill) {
                                var info = get.info(skill);
                                return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.juexingji && !info.forever;
                            }).length > 0) return true;
                            if (player.identity != 'zhu' && player.identity != 'mingzhong') return true;
                            return false;
                        },
                        direct: true,
                        logTarget: 'player',
                        content: function () {
                            'step 0'
                            var skills = trigger.player.getStockSkills('仲村由理', '天下第一').filter(function (skill) {
                                var info = get.info(skill);
                                return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.juexingji && !info.forever;
                            });
                            var list = [];
                            if (skills.length > 0) list.push('获得技能');
                            if (player.identity != 'zhu' && player.identity != 'mingzhong') list.push('交换身份');
                            list.push('cancel2');
                            player.chooseControl(list, true).set('ai', function () {
                                if (list.contains('获得技能')) return '获得技能';
                                return 'cancel2';
                            }).set('prompt', '焚心：选择一项');
                            'step 1'
                            if (result.control == '交换身份') {
                                game.broadcastAll(function (player, target, shown) {
                                    var identity = player.identity;
                                    player.identity = target.identity;
                                    if (shown || player == game.me) {
                                        player.setIdentity();
                                    }
                                    target.identity = identity;
                                }, player, trigger.player, trigger.player.identityShown);
                                player.line(trigger.player, 'green');
                            }
                            if (result.control == '获得技能') {
                                player.addTempSkill('sbfenxin_effect');
                                player.markAuto('sbfenxin_effect', [trigger.player]);
                            }
                        },
                        subSkill: {
                            effect: {
                                charlotte: true,
                                onremove: true,
                                intro: {
                                    content: '$亮出身份后，若其与你阵营不同，获得其武将牌上的所有技能（限定技、觉醒技、使命技、主公技和持恒技除外）',
                                },
                                trigger: { source: 'dieAfter' },
                                direct: true,
                                logTarget: 'player',
                                filter: function (event, player) {
                                    if (player.isFriendOf(event.player)) return false;
                                    if (!player.getStorage('sbfenxin_effect').contains(event.player)) return false;
                                    return event.player.getStockSkills('仲村由理', '天下第一').filter(function (skill) {
                                        var info = get.info(skill);
                                        return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.juexingji && !info.forever;
                                    }).length > 0 && event.player != player;
                                },
                                content: function () {
                                    var skills = trigger.player.getStockSkills('仲村由理', '天下第一').filter(function (skill) {
                                        var info = get.info(skill);
                                        return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.juexingji && !info.forever;
                                    });
                                    if (skills.length) {
                                        for (var i of skills) player.addSkillLog(i);
                                        game.broadcastAll(function (list) {
                                            game.expandSkills(list);
                                            for (var i of list) {
                                                var info = lib.skill[i];
                                                if (!info) continue;
                                                if (!info.audioname2) info.audioname2 = {};
                                                info.audioname2.mb_lingju = 'sbfenxin';
                                            }
                                        }, skills);
                                    }
                                },
                            },
                        },
                    },
                    //侯昭宁
                    dcwangzi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: {
                            global: "phaseUseBegin",
                        },
                        filter: function (event, player) {
                            return event.player != player && event.player.isIn() && !player.hasSkill('dcwangzi_round') && player.countCards('he') > 0;
                        },
                        direct: true,
                        checkx: function (event, player) {
                            if (get.attitude(player, event.player) <= 0) return false;
                            return player.hasSkill('dcherong_effect') || player.countCards('he') > 2;
                        },
                        content: function () {
                            "step 0"
                            var check = lib.skill.dcwangzi.checkx(trigger, player);
                            var num = Math.min(player.countCards('he'), 5);
                            var prompt = '弃置至多' + get.cnNumber(num) + '张牌令' + get.translation(trigger.player) + '获得等量黑色牌';
                            player.chooseToDiscard(get.prompt2('dcwangzi', trigger.player), prompt, 'he', [1, num]).set('ai', function (card) {
                                if (_status.event.check) return 6 - get.value(card);
                                return 0;
                            }).set('check', check).set('logSkill', ['dcwangzi', trigger.player]);
                            "step 1"
                            if (result.bool) {
                                var target = trigger.player;
                                player.line(target, 'green');
                                event.target = target;
                                event.statC = result.cards.length;
                                player.addTempSkill("dcwangzi_round", "roundStart");
                                player.addTempSkill('dcwangzi_gain', 'phaseUseEnd');
                                target.addTempSkill('dcwangzi_effect', 'phaseUseEnd');
                            }
                            else event.finish();
                            "step 2"
                            if (event.statC < 1) event.finish();
                            'step 3'
                            event.cards = [];
                            for (var i = 0; i < event.statC; i++) {
                                var cardP = get.cardPile2(function (card) {
                                    return !event.cards.contains(card) && get.color(card) == 'black';
                                });
                                if (cardP) {
                                    event.cards.push(cardP);
                                }
                                else {
                                    var cardD = get.discardPile(function (card) {
                                        return !event.cards.contains(card) && get.color(card) == 'black';
                                    });
                                    if (cardD) event.cards.push(cardD);
                                }
                            }
                            'step 4'
                            if (event.cards.length > 0) {
                                target.gain(event.cards, 'gain2');
                            }
                            'step 5'
                            event.cards.forEach(card => card.addGaintag('dcwangzi_effect'));
                        },
                        subSkill: {
                            effect: {
                                audio: 'dcwangzi',
                                charlotte: true,
                                mod: {
                                    aiOrder: function (player, card, num) {
                                        if (get.itemtype(card) == 'card' && card.hasGaintag('dcwangzi_effect')) num + 5;
                                    },
                                    aiValue: function (player, card, num) {
                                        if (get.itemtype(card) == 'card' && card.hasGaintag('dcwangzi_effect')) num - 5;
                                    }
                                },
                                onremove: function (player) {
                                    player.removeGaintag('dcwangzi_effect');
                                },
                                trigger: { player: 'useCard' },
                                forced: true,
                                firstDo: true,
                                filter: function (event, player) {
                                    var tags = ['dcwangzi_effect'], card = event.card;
                                    return player.hasHistory('lose', function (evt) {
                                        if (evt.getParent() != event) return false;
                                        for (var i in evt.gaintag_map) {
                                            for (var tag of evt.gaintag_map[i]) {
                                                if (tags.contains(tag)) return true;
                                            }
                                        }
                                        return false;
                                    });
                                },
                                content: function () {
                                    'step 0'
                                    game.asyncDraw(game.filterPlayer(function (current) {
                                        return current == player || current.hasSkill('dcwangzi_effect') || current.hasSkill('dcwangzi_gain');
                                    }));
                                    'step 1'
                                    game.delayx();
                                },
                            },
                            gain: { charlotte: true, onremove: true },
                            round: { charlotte: true, onremove: true },
                        },
                    },
                    dcherong: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: "phaseUse",
                        usable: 1,
                        filter: function (event, player) {
                            return player.countCards('h') > 0 && game.hasPlayer(current => player !== current && current.countCards('h') > 0);
                        },
                        filterTarget: function (card, player, target) {
                            return target != player && target.countCards('h') > 0;
                        },
                        content: function () {
                            'step 0'
                            player.choosePlayerCard(target, true, 'h');
                            'step 1'
                            event.cardt = result.cards[0];
                            target.showCards(event.cardt);
                            player.chooseCard('h', true, '选择一张手牌交换').set('ai', function (card) {
                                var event = _status.event.getParent(), player = event.player;
                                var typet = get.type2(event.cardt);
                                var att = get.attitude(player, target);
                                var value = get.value(event.cardt);
                                var type = get.type2(card);
                                if (type == typet && att > 0) return value + 6 - get.value(card);
                                else if (type != typet && att <= 0) return value - get.value(card);
                                return -1;
                            });
                            'step 2'
                            if (!result.bool) event.finish();
                            else {
                                event.cardp = result.cards[0];
                            }
                            'step 3'
                            player.swapHandcards(target, [event.cardp], [event.cardt]);
                            'step 4'
                            var typep = get.type2(event.cardp, player);
                            var typet = get.type2(event.cardt, target);
                            if (typep == typet) {
                                player.addSkill('dcherong_effect');
                                player.addMark('dcherong_effect', 1, false);
                            }
                            else {
                                player.discardPlayerCard(target, true, 2, 'he');
                                target.damage();
                                event.finish();
                            }
                            'step 5'
                            event.cards = [];
                            var cardA = get.cardPile2(function (card) {
                                return !event.cards.contains(card) && get.type2(card) == 'equip';
                            });
                            if (cardA) {
                                event.cards.push(cardA);
                                player.gain(cardA, 'gain2');
                            }
                            else {
                                var cardB = get.discardPile(function (card) {
                                    return !event.cards.contains(card) && get.type2(card) == 'equip';
                                });
                                if (cardB) {
                                    event.cards.push(cardB);
                                    player.gain(cardB, 'gain2');
                                }
                            }
                            'step 6'
                            var cardC = get.cardPile2(function (card) {
                                return !event.cards.contains(card) && get.type2(card) == 'equip';
                            });
                            if (cardC) {
                                event.cards.push(cardC);
                                target.gain(cardC, 'gain2');
                            }
                            else {
                                var cardD = get.discardPile(function (card) {
                                    return !event.cards.contains(card) && get.type2(card) == 'equip';
                                });
                                if (cardD) {
                                    event.cards.push(cardD);
                                    target.gain(cardD, 'gain2');
                                }
                            }
                        },
                        ai: {
                            threaten: 1.5,
                            order: 8,
                            result: {
                                player: function (player, target) {
                                    var list = [];
                                    var hs = player.getCards('h');
                                    for (var i of hs) {
                                        list.add(get.type2(i, player));
                                    }
                                    if (get.attitude(player, target) > 0 && list.length > 1) return 1.5;
                                    if (get.attitude(player, target) <= 0) return 0.5;
                                    return -Infinity;
                                },
                            },
                        },
                        subSkill: {
                            effect: {
                                audio: 'dcherong',
                                charlotte: true,
                                onremove: true,
                                trigger: { player: 'damageBegin2' },
                                forced: true,
                                filter: function (event, player) {
                                    return player.hasMark('dcherong_effect');
                                },
                                priority: -50,
                                content: function () {
                                    trigger.cancel();
                                    game.log(player, '防止了伤害');
                                    player.removeMark('dcherong_effect', 1, false);
                                    if (!player.countMark('dcherong_effect')) player.removeSkill('dcherong_effect');
                                },
                                marktext: '和戎',
                                intro: {
                                    onremove: true,
                                    content: '防止接下来的#次伤害',
                                },
                            },
                        },
                    },
                    //吕玲绮
                    olqiwu: {
                        audio: 'ext:吕玲绮/audio:4',
                        mod: {
                            targetInRange: function (card) {
                                if (card.storage?.olqiwu) return true;
                            },
                            cardUsable: function (card, player, num) {
                                if (card.storage?.olqiwu) return Infinity;
                            },
                        },
                        enable: 'phaseUse',
                        usable: 1,
                        filter: function (event, player) {
                            return player.hasCard(function (card) {
                                return lib.filter.cardDiscardable(card, player, 'olqiwu');
                            }, 'he');
                        },
                        viewAs: {
                            name: 'sha',
                            isCard: true,
                            storage: { olqiwu: true },
                        },
                        locked: false,
                        filterCard: function (card, player) {
                            return lib.filter.cardDiscardable(card, player, 'olqiwu');
                        },
                        position: 'he',
                        selectCard: [1, Infinity],
                        check: function (card) {
                            var player = _status.event.player;
                            var hp = player.hp;
                            var hs = player.countCards('h');
                            if (ui.selected.cards.some(cardx => get.suit(card) == get.suit(cardx))) return 0;
                            if (hp == 1) {
                                if (get.name(card) == 'shan') return 10;
                                return 0;
                            }
                            if (hs > 3) {
                                if (ui.selected.cards.length > 1) return 0;
                                return 6 - get.value(card);
                            }
                            return 6 - get.value(card);
                        },
                        precontent: function () {
                            var suits = [];
                            var cards = [];
                            for (var i of event.result.cards) {
                                if (lib.suit.contains(get.suit(i))) suits.add(get.suit(i));
                                if (!cards.contains(i) && get.name(i) == 'shan') cards.push(i);
                            }
                            player.discard(event.result.cards);
                            event.result.cards = [];
                            event.getParent().addCount = false;
                            if (cards.length) {
                                event.result.card = get.autoViewAs({ name: 'sha', storage: { olqiwu: suits.length }, isCard: true });
                                player.gain(cards, 'gain2').gaintag = ['olqiwu'];
                                player.addTempSkill('olqiwu_effect');
                            }
                            else event.result.card = get.autoViewAs({ name: 'sha', storage: { olqiwu: suits.length, olqiwu_buff: true }, isCard: true });
                        },
                        ai: {
                            order: function () {
                                return get.order({ name: 'sha' }) + 0.1;
                            },
                        },
                        group: 'olqiwu_buff',
                        subSkill: {
                            effect: {
                                onremove: function (player) {
                                    player.removeGaintag('olqiwu');
                                },
                                charlotte: true,
                                mod: {
                                    ignoredHandcard: function (card, player) {
                                        if (card.hasGaintag('olqiwu')) return true;
                                    },
                                    cardDiscardable: function (card, player, name) {
                                        if (name == 'phaseDiscard' && card.hasGaintag('olqiwu')) return false;
                                    },
                                },
                            },
                            buff: {
                                trigger: { global: 'useCardToPlayered' },
                                charlotte: true,
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.card.name == 'sha' && event.skill == 'olqiwu';
                                },
                                logTarget: 'target',
                                content: function () {
                                    'step 0'
                                    event.cards = [];
                                    var num = trigger.card.storage.olqiwu ? trigger.card.storage.olqiwu : 0;
                                    var str = '绮武：请弃置' + get.cnNumber(num) + '张牌';
                                    if (trigger.target.countCards('he') > 0 && num > 0) trigger.target.chooseToDiscard(str, num, 'he', true);
                                    'step 1'
                                    if (result.bool) {
                                        for (var j of result.cards) {
                                            if (!event.cards.contains(j) && get.name(j) == 'shan') event.cards.push(j);
                                        }
                                    }
                                    'step 2'
                                    if (event.cards.length) {
                                        player.gain(event.cards, 'gain2').gaintag = ['olqiwu'];
                                        player.addTempSkill('olqiwu_effect');
                                    }
                                    if (!event.cards.length && trigger.card.storage?.olqiwu_buff) trigger.getParent().directHit.add(trigger.target);
                                },
                            },
                        },
                    },
                    olzhuangrong: {
                        audio: 'ext:吕玲绮/audio:2',
                        init: function (player) {
                            if (!player.storage.olzhuangrong) player.storage.olzhuangrong = 0;
                        },
                        trigger: { player: 'phaseBegin' },
                        forced: true,
                        filter: function (event, player) {
                            return player.isEmpty(1) || player.isEmpty(2) || player.isEmpty(5);
                        },
                        content: function () {
                            'step 0'
                            var list = ['wushuangfangtianji', 'linglongshimandai', 'hongmianbaihuapao', 'shufazijinguan'];
                            if (!player.isEmpty(1)) list.remove('wushuangfangtianji');
                            if (!player.isEmpty(2)) list.remove('linglongshimandai');
                            if (!player.isEmpty(2)) list.remove('hongmianbaihuapao');
                            if (!player.isEmpty(5)) list.remove('shufazijinguan');
                            if (list.length) event.list = list;
                            else event.finish();
                            'step 1'
                            var equip = event.list.randomGet();
                            switch (equip) {
                                case 'wushuangfangtianji':
                                    var card = game.createCard('wushuangfangtianji', 'diamond', 12);
                                    break;
                                case 'linglongshimandai':
                                    var card = game.createCard('linglongshimandai', 'spade', 2);
                                    break;
                                case 'hongmianbaihuapao':
                                    var card = game.createCard('hongmianbaihuapao', 'club', 1);
                                    break;
                                case 'shufazijinguan':
                                    var card = game.createCard('shufazijinguan', 'diamond', 1);
                                    break;
                            }
                            player.$gain2(card);
                            game.delayx();
                            player.equip(card);
                            player.addSkill('olzhuangrong_destroy');
                            player.markAuto('olzhuangrong_destroy', [card]);
                        },
                        group: ['olzhuangrong_count', 'olzhuangrong_limit'],
                        subSkill: {
                            count: {
                                trigger: { player: ['logSkill', 'useSkillAfter'] },
                                charlotte: true,
                                forced: true,
                                popup: false,
                                firstDo: true,
                                filter: function (event, player) {
                                    if (player.buff.olzhuangrong == true) return false;
                                    if (event.skill == 'wushuangfangtianji_skill') return true;
                                    if (event.skill == 'linglongshimandai_skill') return true;
                                    if (event.skill == 'hongmianbaihuapao_skill') return true;
                                    if (event.skill == 'shufazijinguan_skill') return true;
                                    return false;
                                },
                                content: function () {
                                    player.storage.olzhuangrong++;
                                },
                            },
                            limit: {
                                audio: 'olzhuangrong',
                                trigger: { global: 'phaseEnd' },
                                charlotte: true,
                                forced: true,
                                firstDo: true,
                                filter: function (event, player) {
                                    if (player.buff.olzhuangrong == true) return false;
                                    return player.storage.olzhuangrong >= 2;
                                },
                                content: function () {
                                    player.buff.olzhuangrong = true;
                                    player.gainMaxHp();
                                    player.recover();
                                },
                            },
                            destroy: {
                                trigger: { global: ['loseEnd', 'equipEnd', 'addJudgeEnd', 'gainEnd', 'loseAsyncEnd', 'addToExpansionEnd'] },
                                forced: true,
                                charlotte: true,
                                popup: false,
                                onremove: true,
                                filter: function (event, player) {
                                    var storage = player.storage.olzhuangrong_destroy;
                                    return game.hasPlayer(current => {
                                        var evt = event.getl(current);
                                        if (evt && evt.es) return evt.es.some(i => storage.contains(i));
                                        return false;
                                    });
                                },
                                content: function () {
                                    var cards = [];
                                    var storage = player.storage.olzhuangrong_destroy;
                                    game.countPlayer(current => {
                                        var evt = trigger.getl(current);
                                        if (evt && evt.es) return cards.addArray(evt.es.filter(i => storage.contains(i)));
                                    });
                                    storage.remove(cards);
                                    game.cardsGotoSpecial(cards);
                                    game.log(cards, '被销毁了');
                                    if (!storage.length) player.removeSkill('olzhuangrong_destroy');
                                },
                            },
                        },
                    },
                    //谋鲍三娘
                    sbfmwuniang: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        mod: {
                            targetInRange: function (card) {
                                if (card.storage?.sbfmwuniang) return true;
                            },
                        },
                        enable: 'chooseToUse',
                        filter: function (event, player) {
                            return player.countCards('hes', card => get.type(card) != 'basic');
                        },
                        filterCard: function (card, player) {
                            return get.type(card) != 'basic';
                        },
                        locked: false,
                        position: 'hes',
                        viewAs: {
                            name: 'sha',
                            storage: {
                                sbfmwuniang: true,
                            },
                        },
                        prompt: "将一张非基本牌当无距离限制且不可响应的【杀】使用",
                        check: function (card) {
                            var val = get.value(card);
                            return 6 - val;
                        },
                        ai: {
                            directHit_ai: true,
                        },
                        group: ['sbfmwuniang_hit', 'sbfmwuniang_effect'],
                        subSkill: {
                            hit: {
                                trigger: {
                                    player: 'useCard',
                                },
                                charlotte: true,
                                forced: true,
                                popup: false,
                                priority: -10,
                                filter: function (event, player) {
                                    return event.card.name == 'sha' && event.skill == 'sbfmwuniang';
                                },
                                content: function () {
                                    game.log(trigger.card, '不可被响应');
                                    trigger.directHit.addArray(game.filterPlayer());
                                },
                            },
                            effect: {
                                trigger: {
                                    player: "useCardToPlayered",
                                },
                                charlotte: true,
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.card.name == 'sha' && event.skill == 'sbfmwuniang';
                                },
                                logTarget: "target",
                                content: function () {
                                    'step 0'
                                    var targets = trigger.targets;
                                    event.targets = targets;
                                    'step 1'
                                    if (targets.filter(target => target != player && target.countCards('he') > 0).length > 0) {
                                        player.chooseTarget(true, get.prompt('sbfmwuniang'), '获得其中一个目标的一张牌', (card, player, target) => {
                                            return targets.contains(target) && target != player && target.countCards('he') > 0;
                                        }).set('ai', target => {
                                            return get.effect(target, { name: 'shunshou' }, player, player);
                                        });
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (result.bool) {
                                        player.gainPlayerCard(result.targets[0], 'he', true);
                                    }
                                    else event.finish();
                                    'step 3'
                                    if (result.bool) {
                                        if (get.type(result.cards[0]) == 'basic') event.finish();
                                    }
                                    else event.finish();
                                    'step 4'
                                    if (!game.hasPlayer(function (current) {
                                        return current.awakenedSkills.contains('sbfmzhennan');
                                    })) event.finish();
                                    'step 5'
                                    player.chooseBool(get.prompt('sbfmwuniang'), '失去一点体力，重置所有角色的〖镇南〗').set('ai', function () {
                                        var player = _status.event.player;
                                        if (player.awakenedSkills.contains('sbfmzhennan')) return true;
                                        return false;
                                    });
                                    'step 6'
                                    if (result.bool) {
                                        player.logSkill('sbfmwuniang');
                                        player.loseHp();
                                        var targetxs = game.filterPlayer(targetx => targetx.awakenedSkills.contains('sbfmzhennan'));
                                        targetxs.forEach(targety => {
                                            targety.restoreSkill('sbfmzhennan');
                                        })
                                        game.log(player, '重置了所有角色的', '#g〖镇南〗');
                                    }
                                    else event.finish();
                                },
                            },
                        },
                    },
                    sbfmzhennan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseZhunbeiBegin' },
                        direct: true,
                        limited: true,
                        skillAnimation: true,
                        animationColor: 'fire',
                        priority: -10,
                        filter: function (event, player) {
                            return player.countCards('he') >= 2;
                        },
                        content: function () {
                            'step 0'
                            player.chooseCardTarget({
                                position: 'he',
                                filterCard: lib.filter.cardDiscardable,
                                selectCard: 2,
                                filterTarget: function (card, player, target) {
                                    return player != target && player.canUse('nanman', target);
                                },
                                selectTarget: [1, Infinity],
                                ai1: function (card) {
                                    return 9 - get.value(card);
                                },
                                ai2: function (target) {
                                    var player = _status.event.player;
                                    return get.effect(target, { name: 'nanman' }, player, player) > 0;
                                },
                                prompt: get.prompt('sbfmzhennan'),
                                prompt2: "弃置两张牌，视为使用一张由你指定任意目标的【南蛮入侵】",
                            });
                            'step 1'
                            if (result.bool) {
                                player.awakenSkill('sbfmzhennan');
                                event.targets = result.targets.sortBySeat();
                                event.num = 0;
                                player.discard(result.cards);
                                player.useCard({ name: 'nanman', isCard: true }, 'sbfmzhennan', false, result.targets).card.sbfmzhennan = true;
                            }
                            else event.finish();
                            'step 2'
                            var target = event.targets[num];
                            if (target.isIn() && target != player) {
                                if (!target.hasHistory('damage', (evt) => {
                                    return evt.card && evt.getParent(3).name == 'sbfmzhennan' && evt.card.sbfmzhennan == true;
                                })) {
                                    player.addTempSkill('sbfmzhennan_effect');
                                    player.markAuto('sbfmzhennan_effect', [target]);
                                }
                                else {
                                    var hs = target.getCards('he');
                                    if (hs.length) target.discard(hs.randomGets(1));
                                }
                            }
                            event.num++;
                            if (event.num < targets.length) event.redo();
                        },
                        subSkill: {
                            effect: {
                                charlotte: true,
                                onremove: true,
                                intro: { content: '本回合对$使用牌无次数限制' },
                                mod: {
                                    cardUsableTarget: function (card, player, target) {
                                        if (player.getStorage('sbfmzhennan_effect').contains(target)) return true;
                                    },
                                },
                            },
                        },
                    },
                    sbfmxushen: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'dying' },
                        direct: true,
                        limited: true,
                        skillAnimation: true,
                        animationColor: 'fire',
                        filter: function (event, player) {
                            return game.hasPlayer(function (current) {
                                return current != player;
                            });
                        },
                        content: function () {
                            'step 0'
                            player.chooseTarget(get.prompt('sbfmxushen'), '令一名其他角色进行选择', function (card, player, target) {
                                return target != player;
                            }).set('ai', function (target) {
                                return get.attitude(_status.event.player, target);
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target = target;
                                player.line(target, 'fire');
                                player.logSkill('sbfmxushen', target);
                                player.awakenSkill('sbfmxushen');
                            }
                            else event.finish();
                            'step 2'
                            var list = [];
                            list.push('选项一');
                            list.push('选项二');
                            target.chooseControl(list).set('choiceList', [
                                '失去所有技能获得〖征南〗',
                                '获得〖镇南〗',]).set('prompt', get.prompt('sbfmxushen')).set('ai', function () {
                                    return ['选项一', '选项二'].randomGet();
                                });
                            'step 3'
                            if (result.control == '选项一') {
                                target.clearSkills();
                                target.addSkillLog('zhengnan');
                            }
                            if (result.control == '选项二') {
                                target.addSkillLog('sbfmzhennan');
                            }
                            else event.finish();
                        },
                    },
                    //乐诸葛果
                    dcxidi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: {
                            global: "phaseBefore",
                            player: "enterGame",
                        },
                        filter: function (event, player) {
                            return event.name != "phase" || game.phaseNumber == 0;
                        },
                        forced: true,
                        content: function () {
                            const cards = player.getCards("h");
                            player.addGaintag(cards, "dcxidi");
                        },
                        mod: {
                            ignoredHandcard(card) {
                                if (card.hasGaintag("dcxidi")) return true;
                            },
                            cardDiscardable(card, _, name) {
                                if (name == "phaseDiscard" && card.hasGaintag("dcxidi")) return false;
                            },
                        },
                        group: "dcxidi_guanxing",
                        subSkill: {
                            guanxing: {
                                audio: "dcxidi",
                                trigger: { player: 'phaseZhunbeiBegin', },
                                filter: function (event, player) {
                                    return player.hasCard(card => card.hasGaintag("dcxidi"), "h");
                                },
                                priority: -10,
                                forced: true,
                                locked: false,
                                preHidden: true,
                                content: function () {
                                    'step 0'
                                    const num = player.countCards("h", card => card.hasGaintag("dcxidi"));
                                    const cards = get.cards(Math.min(num, 5));
                                    game.cardsGotoOrdering(cards);
                                    var next = player.chooseToMove();
                                    next.set('list', [
                                        ['牌堆顶', cards],
                                        ['牌堆底'],
                                    ]);
                                    next.set('prompt', '羲笛：点击将牌移动到牌堆顶或牌堆底');
                                    next.processAI = function (list) {
                                        var cards = list[0][1], player = _status.event.player;
                                        var target = (_status.event.getTrigger().name == 'phaseZhunbei') ? player : player.next;
                                        var att = get.sgn(get.attitude(player, target));
                                        var top = [];
                                        var judges = target.getCards('j');
                                        var stopped = false;
                                        if (player != target || !target.hasWuxie()) {
                                            for (var i = 0; i < judges.length; i++) {
                                                var judge = get.judge(judges[i]);
                                                cards.sort(function (a, b) {
                                                    return (judge(b) - judge(a)) * att;
                                                });
                                                if (judge(cards[0]) * att < 0) {
                                                    stopped = true; break;
                                                }
                                                else {
                                                    top.unshift(cards.shift());
                                                }
                                            }
                                        }
                                        var bottom;
                                        if (!stopped) {
                                            cards.sort(function (a, b) {
                                                return (get.value(b, player) - get.value(a, player)) * att;
                                            });
                                            while (cards.length) {
                                                if ((get.value(cards[0], player) <= 5) == (att > 0)) break;
                                                top.unshift(cards.shift());
                                            }
                                        }
                                        bottom = cards;
                                        return [top, bottom];
                                    }
                                    "step 1"
                                    var top = result.moved[0];
                                    var bottom = result.moved[1];
                                    top.reverse();
                                    for (var i = 0; i < top.length; i++) {
                                        ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
                                    }
                                    for (i = 0; i < bottom.length; i++) {
                                        ui.cardPile.appendChild(bottom[i]);
                                    }
                                    player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(bottom.length) + '下');
                                    game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
                                    game.updateRoundNumber();
                                    game.delayx();
                                },
                                ai: {
                                    threaten: 2.2
                                },
                            },
                        },
                    },
                    dcchengyan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: "useCardToPlayered" },
                        filter: function (event, player) {
                            if (!player.isPhaseUsing()) return false;
                            if (event.card && event.card.dcchengyan == true) return false;
                            if (event.card.name != "sha" && get.type(event.card) != "trick") return false;
                            return event.isFirstTarget && event.targets.some(i => i != player);
                        },
                        logTarget: "target",
                        content: function (event, trigger, player) {
                            var targets = trigger.targets.filter(i => i != player);
                            var card = get.cards()[0];
                            player.gain(card, "gain2");
                            player.showCards(card, get.translation(player) + "发动了【乘烟】");
                            if (card.name == "sha" || (get.type(card) == "trick" && get.info(card).filterTarget)) {
                                game.log(trigger.card, '的效果改为', card.name);
                                trigger.card.name = card.name;
                            }
                            else player.draw().set("gaintag", ["dcxidi"]);
                        },
                    },
                    dcwuyan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'phaseUse',
                        filter: function (event, player) {
                            if (player.hasSkill('dcwuyan_block')) return false;
                            return game.countPlayer(function (current) {
                                return current !== player || current.hasSex('male');
                            }) > 1 && game.hasPlayer(function (current) {
                                return current.hasSex('male');
                            });
                        },
                        filterTarget: function (card, player, target) {
                            if (ui.selected.targets.length) return target !== player;
                            return target.hasSex('male');
                        },
                        selectTarget: 2,
                        multitarget: true,
                        targetprompt: ['发起者', '承担者'],
                        content: function () {
                            'step 0'
                            event.targetx = targets[0];
                            event.sourcex = targets[1];
                            event.targetx.chooseToUse(function (card, player, event) {
                                if (get.itemtype(card) != "card" || (get.position(card) != "h" && get.position(card) != "s")) return false;
                                return lib.filter.filterCard.apply(this, arguments);
                            }, '是否对' + get.translation(event.sourcex) + '使用一张手牌？').set('targetRequired', true).set('complexSelect', true).set('filterTarget', function (card, player, target) {
                                if (target != event.sourcex && !ui.selected.targets.contains(event.sourcex)) return false;
                                return lib.filter.targetEnabled.apply(this, arguments);
                            }).set(event.sourcex, player).set('addCount', false);
                            'step 1'
                            if (result.bool) player.draw(2);
                            if (!event.sourcex.getHistory('damage', function (evt) {
                                return evt.getParent().type == 'card' && evt.getParent(4) == event;
                            }).length || !result.bool) {
                                player.chooseBool(get.prompt('dcwuyan'), '是否令' + get.translation(event.targetx) + '失去一点体力？').set('ai', function () {
                                    return get.effect(event.targetx, { name: "losehp" }, player, player) > 0;
                                });
                            }
                            'step 2'
                            if (result.bool) {
                                event.targetx.loseHp();
                                player.addTempSkill('dcwuyan_block', ['phaseAfter', 'phaseBefore']);
                            }
                        },
                        ai: {
                            threaten: 1.2,
                            order: 9,
                            result: {
                                target: function (player, target) {
                                    if (get.attitude(target, player, player) <= 0 && ui.selected.targets.length) return 1;
                                    if (get.attitude(target, player, player) > 0) return target.countCards('h') - player.getStat('skill').dcwuyan;
                                    return 1.5;
                                },
                            },
                        },
                        group: 'dcwuyan_damage',
                        subSkill: {
                            block: { charlotte: true },
                            damage: {
                                trigger: { player: 'damageEnd' },
                                direct: true,
                                filter: function (event, player) {
                                    if (player.hasSkill('dcwuyan_block')) return false;
                                    return game.countPlayer(function (current) {
                                        return current !== player || current.hasSex('male');
                                    }) > 1 && game.hasPlayer(function (current) {
                                        return current.hasSex('male');
                                    });
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseTarget(get.prompt('dcwuyan'), '令一名男性角色选择是否对你选择的另一名其他角色使用一张手牌', 2, function (card, player, target) {
                                        if (ui.selected.targets.length) return target !== player;
                                        return target.hasSex('male');
                                    }).set('complexTarget', true).set('complexSelect', true).set('targetprompt', ['发起者', '承担者']).set('ai', function (target) {
                                        if (get.attitude(target, player, player) <= 0 && ui.selected.targets.length) return 1;
                                        if (get.attitude(target, player, player) > 0) return 2;
                                        return 0.1;
                                    }).animate = false;
                                    'step 1'
                                    if (result.bool && result.targets.length) {
                                        player.logSkill('dcwuyan', result.targets);
                                        event.targetx = result.targets[0];
                                        event.sourcex = result.targets[1];
                                        event.targetx.chooseToUse(function (card, player, event) {
                                            if (get.itemtype(card) != "card" || (get.position(card) != "h" && get.position(card) != "s")) return false;
                                            return lib.filter.filterCard.apply(this, arguments);
                                        }, '是否对' + get.translation(event.sourcex) + '使用一张手牌？').set('targetRequired', true).set('complexSelect', true).set('filterTarget', function (card, player, target) {
                                            if (target != event.sourcex && !ui.selected.targets.contains(event.sourcex)) return false;
                                            return lib.filter.targetEnabled.apply(this, arguments);
                                        }).set(event.sourcex, player).set('addCount', false);
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (result.bool) player.draw(2);
                                    if (!event.sourcex.getHistory('damage', function (evt) {
                                        return evt.getParent().type == 'card' && evt.getParent(4) == event;
                                    }).length || !result.bool) {
                                        player.chooseBool(get.prompt('dcwuyan'), '是否令' + get.translation(event.targetx) + '失去一点体力？').set('ai', function () {
                                            return get.effect(event.targetx, { name: "losehp" }, player, player) > 0;
                                        });
                                    }
                                    'step 3'
                                    if (result.bool) {
                                        event.targetx.loseHp();
                                        player.addTempSkill('dcwuyan_block', ['phaseAfter', 'phaseBefore']);
                                    }
                                },
                            },
                        },
                    },
                    dczhanyu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseBegin' },
                        direct: true,
                        filter: function (event, player) {
                            return player.countCards('h') > 0;
                        },
                        content: function () {
                            'step 0'
                            player.chooseCard('h', get.prompt('dczhanyu'), '展示一张手牌');
                            'step 1'
                            if (result.bool) {
                                player.logSkill('dczhanyu');
                                event.suit = get.suit(result.cards[0]);
                                player.showCards(result.cards, get.translation(player) + '发动了#g' + get.translation('dczhanyu'));
                            }
                            else event.finish();
                            'step 2'
                            event.cards = [];
                            var targets = game.filterPlayer(target => target != player);
                            player.line(targets);
                            targets.forEach(target => {
                                var hs = target.getCards('h', card => get.suit(card) == event.suit);
                                if (hs.length) target.discard(hs.randomGets(1));
                            })
                            'step 3'
                            var cards = [];
                            game.getGlobalHistory('cardMove', function (evt) {
                                if (evt.name != 'lose' || evt.type != 'discard') return false;
                                for (var i of evt.cards) {
                                    if (get.position(i, true) == 'd') cards.push(i);
                                }
                            });
                            if (cards.length) {
                                player.chooseButton(['是否获得其中一张牌', cards]).set('ai', function (button) {
                                    return get.value(button.link, _status.event.player);
                                });
                            }
                            else event.finish();
                            'step 4'
                            if (result.bool) player.gain(result.links, 'gain2');
                            'step 5'
                            game.updateRoundNumber();
                        },
                    },
                    //孔淑
                    leiluan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        init: function (player) {
                            player.storage.leiluan = [];
                        },
                        enable: 'chooseToUse',
                        filter: function (event, player) {
                            if (Math.max(game.countPlayer(function (current) {
                                return current.isLinked();
                            }), 1) > player.countCards('he')) return false;
                            if (player.hasSkill('leiluan_blocker')) return false;
                            for (var name of lib.inpile) {
                                if (get.type2(name) != 'basic') continue;
                                if (player.storage.leiluan.contains(name)) continue;
                                var card = {
                                    name: name
                                };
                                if (event.filterCard(card, player, event)) return true;
                                if (name == 'sha') {
                                    for (var nature of lib.inpile_nature) {
                                        card.nature = nature;
                                        if (event.filterCard(card, player, event)) return true;
                                    }
                                }
                            }
                            return false;
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var list = [];
                                for (var name of lib.inpile) {
                                    if (player.storage.leiluan.contains(name)) continue;
                                    if (name == 'sha') {
                                        if (event.filterCard({
                                            name: name
                                        }, player, event)) list.push(['基本', '', 'sha']);
                                        for (var nature of lib.inpile_nature) {
                                            if (event.filterCard({
                                                name: name,
                                                nature: nature
                                            }, player, event)) list.push(['基本', '', 'sha', nature]);
                                        }
                                    }
                                    else if (get.type(name) == 'basic' && event.filterCard({
                                        name: name
                                    }, player, event)) list.push(['基本', '', name]);
                                }
                                return ui.create.dialog('累卵', [list, 'vcard']);
                            },
                            filter: function (button, player) {
                                return _status.event.getParent().filterCard({
                                    name: button.link[2],
                                    nature: button.link[3]
                                }, player, _status.event.getParent());
                            },
                            check: function (button) {
                                if (_status.event.getParent().type != 'phase') return 1;
                                var player = _status.event.player;
                                return player.getUseValue({
                                    name: button.link[2],
                                    nature: button.link[3],
                                });
                            },
                            backup: function (links, player) {
                                return {
                                    audio: 'leiluan',
                                    filterCard: true,
                                    selectCard: function () {
                                        var player = _status.event.player;
                                        var num = Math.max(game.countPlayer(function (current) {
                                            return current.isLinked();
                                        }), 1);
                                        return num;
                                    },
                                    popname: true,
                                    check: function (card) {
                                        return 8 - get.value(card);
                                    },
                                    position: 'hes',
                                    viewAs: {
                                        name: links[0][2],
                                        nature: links[0][3],
                                    },
                                    precontent: function () {
                                        player.addTempSkill('leiluan_effect');
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                var player = _status.event.player;
                                var num = Math.max(game.countPlayer(function (current) {
                                    return current.isLinked();
                                }), 1);
                                return '将' + get.cnNumber(num) + '张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                            },
                        },
                        hiddenCard: function (player, name) {
                            if (!lib.inpile.contains(name)) return false;
                            if (player.storage.leiluan.contains(name)) return false;
                            var type = get.type2(name);
                            return type == 'basic' && player.countCards('hes') >= Math.max(game.countPlayer(function (current) {
                                return current.isLinked();
                            }), 1) && !player.hasSkill('leiluan_blocker');
                        },
                        ai: {
                            fireAttack: true,
                            respondSha: true,
                            respondShan: true,
                            skillTagFilter: function (player, tag, arg) {
                                if (tag == 'fireAttack') return true;
                                if (player.countCards('hes') >= Math.max(game.countPlayer(function (current) {
                                    return current.isLinked();
                                }), 1) && !player.hasSkill('leiluan_blocker')) {
                                    if (tag == 'respondSha') {
                                        if (arg != 'use') return false;
                                        if (player.storage.leiluan.contains('sha')) return false;
                                    }
                                    else if (tag == 'respondShan') {
                                        if (player.storage.leiluan.contains('shan')) return false;
                                    }
                                }
                                else {
                                    return false;
                                }
                            },
                            order: 10,
                            result: {
                                player: function (player) {
                                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                                    return 1;
                                },
                            },
                        },
                        group: ['leiluan_use', 'leiluan_clear'],
                        subSkill: {
                            effect: {
                                trigger: {
                                    player: 'loseAfter',
                                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                                },
                                direct: true,
                                firstDo: true,
                                charlotte: true,
                                filter: function (event, player) {
                                    if (player.countCards('h')) return false;
                                    var evt = event.getl(player);
                                    return evt && evt.hs && evt.hs.length && event.getParent().skill == 'leiluan_backup';
                                },
                                content: function () {
                                    'step 0'
                                    player.draw(2);
                                    player.addTempSkill('leiluan_blocker', { player: 'damageEnd' });
                                    'step 1'
                                    var cards = [];
                                    game.players.forEach(p => {
                                        p.getHistory("lose", function (evt) {
                                            for (var i = 0; i < evt.cards.length; i++) {
                                                if (get.position(evt.cards[i]) == 'd' && get.type(evt.cards[i]) == 'trick') {
                                                    cards.push(evt.cards[i]);
                                                }
                                            }
                                        });
                                    });
                                    if (!cards.length) event.finish();
                                    else player.chooseButton(['获得一张普通锦囊牌', cards]).set('forced', true).set('ai', function (button) {
                                        return _status.event.player.getUseValue(button.link) + 1;
                                    });
                                    'step 2'
                                    if (result.bool) {
                                        var cards = result.links;
                                        player.gain(cards, 'draw');
                                    }
                                },
                            },
                            blocker: {
                                charlotte: true,
                                mark: true,
                                marktext: "累卵",
                                intro: {
                                    content: "〖累卵〗失效",
                                },
                            },
                            use: {
                                trigger: { player: 'useCard' },
                                direct: true,
                                firstDo: true,
                                charlotte: true,
                                forced: true,
                                filter: function (event, player) {
                                    return get.type(event.card, false) == 'basic' && !player.storage.leiluan.contains(event.card.name);
                                },
                                content: function () {
                                    player.storage.leiluan.add(trigger.card.name);
                                },
                            },
                            clear: {
                                trigger: { global: 'roundStart' },
                                direct: true,
                                firstDo: true,
                                charlotte: true,
                                forced: true,
                                content: function () {
                                    player.storage.leiluan = [];
                                },
                            },
                        },
                    },
                    fuchao: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'roundFinish' },
                        forced: true,
                        content: function () {
                            'step 0'
                            game.asyncDraw(game.filterPlayer(function (current) {
                                return current == player || current.isLinked();
                            }));
                            'step 1'
                            game.delayx();
                            if (!game.hasPlayer(function (current) {
                                return current.isLinked();
                            })) {
                                event.finish();
                            }
                            'step 2'
                            var num = Math.max(game.countPlayer(function (current) {
                                return current.isLinked();
                            }), 1);
                            var targets = game.filterPlayer(targetx => targetx.isLinked());
                            targets.forEach(target => {
                                target.chooseToDiscard('覆巢：请弃置' + get.cnNumber(num) + '张牌', num, 'he', true);
                            })
                        },
                        group: 'fuchao_effect',
                        subSkill: {
                            effect: {
                                audio: 'fuchao',
                                trigger: { player: "useCardAfter" },
                                forced: true,
                                filter: function (event, player) {
                                    if (get.type(event.card, false) != 'basic') return false;
                                    return _status.currentPhase && _status.currentPhase.isIn() && !_status.currentPhase.isLinked();
                                },
                                content: function () {
                                    _status.currentPhase.link(true);
                                },
                            },
                        },
                    },
                    //魔曹操
                    sxrmkuxin: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        init: function (player) {
                            player.storage.sxrmkuxin = [];
                        },
                        trigger: { player: 'damageEnd' },
                        filter: function (event, player) {
                            return game.hasPlayer(current => {
                                return current !== player && current.countCards('h') > 0;
                            });
                        },
                        content: function () {
                            'step 0'
                            event.targets = game.filterPlayer((i) => i != player && i.countCards('h') > 0).sortBySeat();
                            event.playerNum = event.targets.length;
                            'step 1'
                            event.currentPlayer = event.targets[event.targets.length - event.playerNum];
                            var target = event.currentPlayer;
                            target.chooseCard('h', false, [1, target.countCards('h')], '枯心：展示任意张手牌').set('ai', function (card) {
                                var player = _status.event.player,
                                    target = _status.event.getParent().player,
                                    val = get.value(card);
                                var att = get.attitude(player, target);
                                if (get.suit(card, false) === 'heart') return att * 10 - val;
                                if (att < 0) val = -val;
                                else if (att > 0) val = get.value(card, target) - val;
                                return val;
                            });
                            'step 2'
                            var target = event.currentPlayer;
                            if (result.bool) {
                                target.showCards(result.cards);
                                result.cards.forEach(card => player.storage.sxrmkuxin.add(card));
                            }
                            'step 3'
                            if (event.playerNum > 1) {
                                event.playerNum--;
                                event.goto(1)
                            }
                            'step 4'
                            event.cards = player.storage.sxrmkuxin;
                            var check = event.cards.some(card => get.suit(card, false) === 'heart');
                            var choiceList = ['获得所有角色的展示牌', '获得一名角色的未展示牌'];
                            player.chooseControl().set('choiceList', choiceList).set('prompt', get.prompt('sxrmkuxin')).set('ai', function () {
                                var player = _status.event.player;
                                if (_status.event.check || (player.isTurnedOver() && !_status.event.check)) return 0;
                                return 1;
                            });
                            'step 5'
                            if (result.index == 0) {
                                game.log(player, "选择了", "#g【枯心】", "的", "#y选项一");
                                player.gain(event.cards, "gain2");
                                player.showCards(event.cards, get.translation(player) + "发动了【枯心】");
                                if (!event.cards.some(card => get.suit(card, false) === 'heart')) {
                                    player.discard(cards);
                                    player.draw();
                                    player.turnOver();
                                }
                                event.goto(7);
                            }
                            else {
                                game.log(player, "选择了", "#g【枯心】", "的", "#y选项二");
                                var prompt2 = '获得一名角色的未展示牌';
                                player.chooseTarget(true, get.prompt('sxrmkuxin'), prompt2, function (card, player, target) {
                                    return target != player;
                                }).set('ai', function (target) {
                                    var player = _status.event.player;
                                    return -get.attitude(player, target) * target.countCards('h');
                                });
                            }
                            'step 6'
                            if (result.bool && result.targets && result.targets.length) {
                                player.line(result.targets[0], 'blue');
                                var cardxs = result.targets[0].getCards('h', card => !player.storage.sxrmkuxin.includes(card));
                                player.gain(cardxs, "gain2");
                                player.showCards(cardxs, get.translation(player) + "发动了【枯心】");
                                if (!cardxs.some(card => get.suit(card, false) === 'heart')) {
                                    player.discard(cardxs);
                                    player.draw();
                                    player.turnOver();
                                }
                            }
                            'step 7'
                            player.storage.sxrmkuxin = [];
                        },
                        group: ['sxrmkuxin_count', 'sxrmkuxin_reset'],
                        subSkill: {
                            count: {
                                trigger: { player: 'damageBegin3' },
                                silent: true,
                                firstDo: true,
                                forever: true,
                                filter: function (event, player) {
                                    return player.classList.contains('turnedover') && !game.hasPlayer(current => {
                                        return current !== player && current.countCards('h') > 0;
                                    });
                                },
                                content: function () {
                                    trigger.sxrmkuxin = true;
                                },
                            },
                            reset: {
                                trigger: { player: 'damageEnd' },
                                popup: false,
                                forever: true,
                                check: function (event, player) {
                                    return player.isTurnedOver();
                                },
                                filter: function (event, player) {
                                    if (event.sxrmkuxin && !game.hasPlayer(current => {
                                        return current !== player && current.countCards('h') > 0;
                                    })) return true;
                                    return false;
                                },
                                prompt: '是否发动【枯心】，将武将牌翻面并摸一张牌？',
                                content: function () {
                                    player.logSkill('sxrmkuxin');
                                    delete trigger.sxrmkuxin;
                                    player.turnOver();
                                    player.draw();
                                },
                            },
                        },
                    },
                    sxrmsigu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'phaseUse',
                        usable: 1,
                        filter: function (event, player) {
                            return game.hasPlayer(current => lib.skill.sxrmsigu.filterTarget(null, player, current));
                        },
                        filterTarget: lib.filter.notMe,
                        content: function () {
                            'step 0'
                            target.judge();
                            'step 1'
                            var list = ['zhichi', 'reganglie', 'refankui', 'new_reyiji', 'oljieming', 'fangzhu', 'shibei', 'rechengxiang', 'zhiyu', 'jilei', 'benyu', 'chouce', 'new_wuhun'];
                            event.skillL = list[result.number - 1];
                            'step 2'
                            if (!target.hasSkill(event.skillL)) {
                                event.goon = true;
                                target.addTempSkill(event.skillL);
                                game.log(target, "视为拥有技能", "#y【" + get.translation(event.skillL) + "】");
                            }
                            'step 3'
                            target.damage();
                            'step 4'
                            target.damage();
                            'step 5'
                            if (event.goon) target.removeSkill(event.skillL);
                            else event.finish();
                        },
                        ai: { order: 12, result: { player: 1 } },
                    },
                    sxrmkuimu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'judge' },
                        direct: true,
                        filter: function (event, player) {
                            return event.player.countCards('h') > 0 && event.player.isIn() && !player.hasSkill('sxrmkuimu_round');
                        },
                        content: function () {
                            'step 0'
                            var list = trigger.player.getCards('h');
                            player.chooseButton([get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' + get.translation(trigger.player.judging[0]) +
                                '，' + get.prompt('sxrmkuimu'), list, 'hidden'], function (button) {
                                    var card = button.link;
                                    var trigger = _status.event.getTrigger();
                                    var player = _status.event.player;
                                    var judging = _status.event.judging;
                                    var result = trigger.judge(card) - trigger.judge(judging);
                                    var attitude = get.attitude(player, trigger.player);
                                    if (player.hp == 1 && !player.canSave(player) && get.suit(card) != get.suit(judging)) return -Infinity;
                                    return result * attitude;
                                }).set('judging', trigger.player.judging[0]).set('filterButton', function (button) {
                                    var player = _status.event.player;
                                    var card = button.link;
                                    var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                                    if (mod2 != 'unchanged') return mod2;
                                    var mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
                                    if (mod != 'unchanged') return mod;
                                    return true;
                                });
                            'step 1'
                            if (result.bool) {
                                player.addTempSkill('sxrmkuimu_round', 'roundStart');
                                event.forceDie = true;
                                player.respond(result.links, 'sxrmkuimu', 'highlight', 'noOrdering');
                                result.cards = result.links;
                                var card = result.cards[0];
                                if (get.suit(card) != get.suit(trigger.player.judging[0])) event.goon = true;
                                event.card = card;
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                if (trigger.player.judging[0].clone) {
                                    trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                                    game.broadcast(function (card) {
                                        if (card.clone) {
                                            card.clone.classList.remove('thrownhighlight');
                                        }
                                    }, trigger.player.judging[0]);
                                    game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                                }
                                game.cardsDiscard(trigger.player.judging[0]);
                                trigger.player.judging[0] = result.cards[0];
                                trigger.orderingCards.addArray(result.cards);
                                game.log(trigger.player, '的判定牌改为', card);
                                game.delay(2);
                            }
                            else event.finish();
                            'step 3'
                            if (event.goon) player.damage(trigger.player);
                        },
                        ai: {
                            rejudge: true,
                            tag: {
                                rejudge: 0.6,
                            },
                        },
                        subSkill: {
                            round: { charlotte: true, onremove: true },
                        },
                    },
                    //张裕
                    dcxiangchen: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        init: function (player) {
                            player.storage.dcxiangchen_counter = 0;
                            player.addSkill('dcxiangchen_gain');
                        },
                        onremove: true,
                        intro: {
                            markcount: function (storage, player) {
                                return get.translation(player.getStorage('dcxiangchen'));
                            },
                        },
                        enable: 'phaseUse',
                        usable: 1,
                        filterTarget: true,
                        content: function () {
                            player.storage.dcxiangchen = target;
                            player.markSkill('dcxiangchen');
                            var next = game.createEvent('dcxiangchen');
                            next.player = player;
                            next.setContent(lib.skill.dcxiangchen.contentx);
                        },
                        contentx: function () {
                            'step 0'
                            var list, skills = [];
                            list = [];
                            var targetx = player.storage.dcxiangchen;
                            var numx = lib.character[targetx.name] ? lib.character[targetx.name][2] : targetx.maxHp;
                            if (typeof numx === 'string' && numx.includes('/')) {
                                numx = parseInt(numx.split('/')[0]);
                            }
                            for (var i in lib.character) {
                                if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
                                if (lib.character[i][1] != targetx.group) continue;
                                var numy = lib.character[i][2];
                                if (typeof numy === 'string' && numy.includes('/')) {
                                    numy = parseInt(numy.split('/')[0]);
                                }
                                if (numx == numy) list.push(i);
                            }
                            for (var i of list) {
                                for (var j of lib.character[i][3]) {
                                    if (player.hasSkill(j)) continue;
                                    var skill = lib.skill[j];
                                    if (!skill || skill.limited || skill.juexingji || skill.hiddenSkill || skill.dutySkill || skill.zhuSkill) continue;
                                    if (skill.charlotte) continue;
                                    if (skill.init || skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
                                    var info = lib.translate[j + '_info'];
                                    if (info) skills.add(j);
                                }
                            }
                            event.skills = skills;
                            'step 1'
                            if (player.isIn() && player.storage.dcxiangchen_counter < 3) {
                                var list = event.skills.randomGets(3);
                                if (!list.length) {
                                    player.draw();
                                    event.finish();
                                    return;
                                }
                                player.chooseControl(list).set('choiceList', list.map(function (i) {
                                    return '<div class="skill">【' + get.translation(lib.translate[i + '_ab'] || get.translation(i).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(i, player) + '</div>';
                                })).set('displayIndex', false).set('prompt', '相谶：请选择你要获得的技能').set('ai', () => {
                                    var list = _status.event.controls.slice();
                                    return list.sort((a, b) => {
                                        return get.skillRank(b, 'in') - get.skillRank(a, 'in');
                                    })[0];
                                });
                            }
                            else {
                                player.draw();
                                event.finish();
                            }
                            'step 2'
                            player.storage.dcxiangchen_counter++;
                            player.addTempSkill(result.control, { player: 'phaseEnd' });
                            player.popup(result.control);
                            game.log(player, '获得了', '#g【' + get.translation(result.control) + '】');
                            player.markAuto('dcxiangchen_gain', [result.control]);
                        },
                        ai: { order: 12, result: { player: 1 } },
                        group: ['dcxiangchen_remove', 'dcxiangchen_change'],
                        subSkill: {
                            gain: {
                                charlotte: true,
                                onremove: true,
                                unique: true,
                                intro: {
                                    markcount: () => null,
                                    content: '已获得过的技能：$',
                                },
                            },
                            remove: {
                                audio: 'dcxiangchen',
                                trigger: { player: 'phaseEnd' },
                                silent: true,
                                popup: false,
                                forced: true,
                                charlotte: true,
                                priority: -10,
                                filter: function (event, player) {
                                    return player.storage.dcxiangchen_counter > 0;
                                },
                                content: function () {
                                    player.storage.dcxiangchen_counter = 0;
                                },
                            },
                            change: {
                                trigger: { global: 'changeHp' },
                                direct: true,
                                priority: -10,
                                filter: function (event, player) {
                                    return (player === event.player || player.storage.dcxiangchen && player.storage.dcxiangchen === event.player);
                                },
                                content: function () {
                                    'step 0'
                                    var str = '选择一名角色并';
                                    if (player.storage.dcxiangchen_counter < 3) str += ('可能获得技能');
                                    else str += ('摸一张牌');
                                    player.chooseTarget(get.prompt('dcxiangchen'), str);
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('dcxiangchen', result.targets[0]);
                                        player.storage.dcxiangchen = result.targets[0];
                                        player.markSkill('dcxiangchen');
                                        var next = game.createEvent('dcxiangchen');
                                        next.player = player;
                                        next.setContent(lib.skill.dcxiangchen.contentx);
                                    }
                                    else event.finish();
                                },
                            },
                        },
                    },
                    dcmingding: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'dying' },
                        limited: true,
                        skillAnimation: true,
                        unique: true,
                        animationColor: 'fire',
                        filter: function (event, player) {
                            return player.hp <= 0;
                        },
                        check: function (event, player) {
                            if (player.getStorage('dcxiangchen_gain').length < 3 && player.countCards('hes', function (card) {
                                return get.tag(card, "save");
                            }) >= -player.hp) return false;
                            return true;
                        },
                        content: function () {
                            'step 0'
                            player.awakenSkill('dcmingding');
                            player.recover(1 - player.hp);
                            player.addSkill('dcmingding_muteki');
                            'step 1'
                            var skills = player.getSkills(null, false, false).filter(function (i) {
                                if (i == 'dcmingding') return false;
                                var info = get.info(i);
                                return info && !info.charlotte;
                            });
                            game.log(player, '失去了以下技能：', '#g' + get.translation(skills));
                            player.removeSkill(skills.slice(0));
                            if (player.getStorage('dcxiangchen_gain').length <= 0) event.finish();
                            'step 2'
                            player.draw(Math.min(player.getStorage('dcxiangchen_gain').length, 5));
                            var skills = player.getStorage('dcxiangchen_gain').randomGets(Math.min(player.getStorage('dcxiangchen_gain').length, 3));
                            player.addSkill(skills);
                            game.log(player, '获得了以下技能：', '#g' + get.translation(skills));
                            'step 3'
                            player.removeSkill('dcxiangchen_gain');
                            delete player.storage.dcxiangchen_counter;
                        },
                        subSkill: {
                            muteki: {
                                audio: 'dcmingding',
                                trigger: { player: 'damageBegin4' },
                                charlotte: true,
                                forced: true,
                                group: 'dcmingding_counter',
                                content: function () {
                                    trigger.cancel();
                                },
                                mark: true,
                                intro: { content: '我无敌啦！' },
                                ai: {
                                    maixie: true,
                                    maixie_hp: true,
                                    nofire: true,
                                    nothunder: true,
                                    nodamage: true,
                                    effect: {
                                        target: function (card, player, target, current) {
                                            if (get.tag(card, 'damage')) return 'zeroplayertarget';
                                        }
                                    },
                                },
                            },
                            counter: {
                                trigger: { player: 'phaseEnd' },
                                silent: true,
                                popup: false,
                                forced: true,
                                charlotte: true,
                                onremove: true,
                                priority: -10,
                                content: function () {
                                    if (!player.storage.dcmingding_counter) {
                                        player.storage.dcmingding_counter = true;
                                        player.loseHp(player.hp);
                                    }
                                    else player.removeSkill('dcmingding_muteki');
                                },
                            },
                        },
                    },
                    //武张飞
                    dczisheng: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'useCard' },
                        direct: true,
                        filter: function (event, player) {
                            if (!event.cards.length) return false;
                            var num = 0;
                            for (var i of event.cards) {
                                if (get.number(i, false) != null) num += get.number(i, false);
                            }
                            var cardsToGain = get.cardPile2(function (card) {
                                return get.number(card, false) === 3;
                            });
                            return num > 3 && num % 3 === 0 && cardsToGain;
                        },
                        content: function () {
                            'step 0'
                            var cards = [];
                            for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
                                var card = ui.cardPile.childNodes[i];
                                if (get.number(card, false) === 3) cards.push(card);
                            }
                            event.cardsToGain = cards.randomGets(3);
                            if (!event.cardsToGain.length) event.finish();
                            'step 1'
                            player.chooseCardButton(event.cardsToGain, '恣胜：是否选择一张牌获得').set('ai', function (card) {
                                return get.value(card);
                            });
                            'step 2'
                            if (result.bool) {
                                player.logSkill('dczisheng');
                                player.gain(result.links, 'draw');
                            }
                        },
                        group: ['dczisheng_discard', 'dczisheng_gain'],
                        subSkill: {
                            discard: {
                                audio: 'dczisheng',
                                trigger: { player: 'discardPlayerCardAfter' },
                                filter: function (event, player) {
                                    return event.cards.length > 0 && event.target != player;
                                },
                                logTarget: 'target',
                                direct: true,
                                content: function () {
                                    'step 0'
                                    var target = trigger.target;
                                    var num = Math.min(target.hp - 1, trigger.cards.length);
                                    var str = '对' + get.translation(target) + '造成' + get.translation(num) + '点伤害';
                                    if (num > 0) player.chooseBool(get.prompt('dczisheng', target), str).set('choice', get.damageEffect(target, player, player) > 0);
                                    else event.finish();
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('dczisheng_discard', trigger.target);
                                        trigger.target.damage(Math.min(trigger.target.hp - 1, trigger.cards.length));
                                    }
                                },
                            },
                            gain: {
                                audio: 'dczisheng',
                                trigger: { global: 'loseAsyncAfter', player: 'gainAfter' },
                                filter: function (event, player) {
                                    var cards = event.getg(player);
                                    if (!cards.length) return false;
                                    return game.hasPlayer(function (current) {
                                        return event.getl(current).cards2.length;
                                    });
                                },
                                direct: true,
                                content: function () {
                                    'step 0'
                                    event.targets = game.filterPlayer(function (current) {
                                        if (current == player) return false;
                                        return trigger.getl(current).cards2.length;
                                    });
                                    event.playerNum = event.targets.length;
                                    'step 1'
                                    event.currentPlayer = event.targets[event.targets.length - event.playerNum];
                                    var target = event.currentPlayer;
                                    var num = Math.min(target.hp - 1, trigger.getl(target).cards2.length);
                                    var str = '对' + get.translation(target) + '造成' + get.translation(num) + '点伤害';
                                    if (num > 0) player.chooseBool(get.prompt('dczisheng', target), str).set('choice', get.damageEffect(target, player, player) > 0);
                                    else event.goto(3);
                                    'step 2'
                                    var target = event.currentPlayer;
                                    if (result.bool) {
                                        player.logSkill('dczisheng_gain', target);
                                        target.damage(Math.min(target.hp - 1, trigger.getl(target).cards2.length));
                                    }
                                    'step 3'
                                    if (event.playerNum > 1) {
                                        event.playerNum--;
                                        event.goto(1);
                                    }
                                },
                            },
                        },
                    },
                    dcxianlue: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'phaseUse',
                        marktext: '显略',
                        intro: {
                            name: '显略',
                            markcount: function (storage, player) {
                                return ('' + player.getStorage('dcxianlue').length + '/' + get.translation(13 - player.countMark('dcxianlue_count')));
                            },
                            content: '已记录的点数：$',
                        },
                        onremove: function (player, skill) {
                            delete player.storage.dcxianlue;
                            player.clearMark('dcxianlue_count', false);
                        },
                        filter: function (event, player) {
                            return game.hasPlayer(function (current) {
                                return lib.skill.dcxianlue.filterTarget(null, player, current);
                            });
                        },
                        filterTarget: function (card, player, target) {
                            if (player == target || player.getStorage('dcxianlue_use').contains(target) || !target.countCards('h')) return false;
                            return target.getHistory('damage').length > 0 || target.getHistory('lose', function (evt) {
                                return evt.cards2 && evt.cards2.length;
                            }).length > 0;
                        },
                        content: function () {
                            'step 0'
                            event.statC = player.getStorage('dcxianlue').length;
                            player.addTempSkill('dcxianlue_use', 'phaseUseEnd');
                            player.markAuto('dcxianlue_use', [target]);
                            player.viewHandcards(target);
                            for (var i of target.getCards('h')) {
                                if (get.number(i, false) != null) player.markAuto('dcxianlue', [get.number(i, false)]);
                            }
                            'step 1'
                            var num = 0;
                            if (event.statC <= 3 && player.getStorage('dcxianlue').length > 3) num += 3;
                            if (event.statC <= 6 && player.getStorage('dcxianlue').length > 6) num += 3;
                            if (event.statC <= 9 && player.getStorage('dcxianlue').length > 9) num += 3;
                            if (num > 0) player.draw(num);
                            'step 2'
                            if (player.getStorage('dcxianlue').length >= (13 - player.countMark('dcxianlue_count'))) {
                                delete player.storage.dcxianlue;
                                player.clearMark('dcxianlue_count', false);
                                if (player.awakenedSkills.contains('dchaoxian')) {
                                    player.restoreSkill('dchaoxian');
                                    game.log(player, '#g【豪贤】', '视为未发动过');
                                }
                            }
                        },
                        group: 'dcxianlue_count',
                        subSkill: {
                            use: {
                                charlotte: true,
                                onremove: true,
                                intro: { content: '本回合已对$发动过【显略】' },
                            },
                            count: {
                                trigger: { source: 'dying' },
                                charlotte: true,
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.player != player;
                                },
                                content: function () {
                                    player.addMark('dcxianlue_count', 3, false);
                                },
                            },
                        },
                    },
                    dchaoxian: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        limited: true,
                        enable: 'phaseUse',
                        skillAnimation: true,
                        animationColor: 'fire',
                        content: function () {
                            'step 0'
                            player.awakenSkill('dchaoxian');
                            var cards = [];
                            for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
                                var card = ui.discardPile.childNodes[i];
                                if (!card) continue;
                                var number = get.number(card, false);
                                if (number === 3) cards.push(card);
                            }
                            event.cardsToShuffle = cards;
                            'step 1'
                            if (event.cardsToShuffle && event.cardsToShuffle.length > 0) {
                                for (var i = 0; i < event.cardsToShuffle.length; i++) {
                                    ui.cardPile.insertBefore(event.cardsToShuffle[i], ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                                }
                                game.log(player, '将', event.cardsToShuffle, '随机置入牌堆');
                            }
                            game.updateRoundNumber();
                            'step 2'
                            event.targets = game.filterPlayer(function (current) {
                                if (current === player) return false;
                                return current.hasCard(function (card) {
                                    return get.number(card, false) === 3;
                                }, 'h');
                            });
                            event.index = 0;
                            'step 3'
                            if (event.index < event.targets.length) {
                                var target = event.targets[event.index];
                                var cardsToGain = target.getCards('h', function (card) {
                                    return get.number(card, false) === 3;
                                });
                                if (cardsToGain.length > 0) player.gain(cardsToGain, target, 'give', 'log');
                                event.index++;
                                event.redo();
                            }
                        },
                        ai: {
                            order: 10,
                            result: {
                                player: function (player) {
                                    var discardCount = 0;
                                    for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
                                        var card = ui.discardPile.childNodes[i];
                                        if (card && get.number(card, false) === 3) discardCount++;
                                    }
                                    var gainCount = 0;
                                    var targets = game.filterPlayer(function (current) {
                                        return current !== player;
                                    });
                                    for (var target of targets) {
                                        for (var card of target.getCards('h')) {
                                            if (get.number(card, false) === 3) gainCount++;
                                        }
                                    }
                                    return discardCount + gainCount * 2;
                                }
                            }
                        },
                    },
                    //崔芷
                    dcranlv: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        onremove: true,
                        intro: { content: '已移除的选项：$' },
                        trigger: { global: 'damageEnd' },
                        direct: true,
                        filter: function (event, player) {
                            if (player.getStorage('dcranlv').length >= 3) return false;
                            if (player.getStorage('dcranlv').contains(1) && !game.hasPlayer(function (current) {
                                return current.countCards('he') > 0;
                            }) && player.getStorage('dcranlv').contains(2)) return false;
                            return !event.nature;
                        },
                        content: function () {
                            'step 0'
                            var list = [
                                [1, `横置或重置至多两名角色`],
                                [2, `摸两张牌`],
                                [3, `弃置一名角色两张牌`],
                            ];
                            player.chooseButton([`燃缕：你可以选择一项并移除此项。`, [list, 'textbutton']]).set('ai', function (button) {
                                return Math.random();
                            }).set('filterButton', function (button) {
                                if (player.getStorage('dcranlv').contains(button.link)) return false;
                                if (button.link == 3) return game.hasPlayer(function (current) {
                                    return current.countCards('he') > 0;
                                });
                                return true;
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('dcranlv');
                                player.markAuto('dcranlv', [result.links[0]]);
                                event.choice = result.links[0];
                            }
                            else event.finish();
                            'step 2'
                            var prompt = '横置或重置至多两名角色';
                            if (event.choice == 1) player.chooseTarget([1, 2], true, get.prompt('dcranlv'), prompt).set('ai', function (target) {
                                if (target.isLinked()) return get.attitude(_status.event.player, target);
                                return -get.attitude(_status.event.player, target);
                            });
                            else event.goto(4);
                            'step 3'
                            if (result.bool && result.targets && result.targets.length) {
                                result.targets.sortBySeat().forEach(function (target) {
                                    target.link();
                                });
                                event.finish();
                            }
                            'step 4'
                            if (event.choice == 2) player.draw(2);
                            'step 5'
                            var prompt = '弃置一名角色两张牌';
                            if (event.choice == 3) player.chooseTarget(true, function (card, player, target) {
                                return target.countCards('he') > 0;
                            }, get.prompt('dcranlv'), prompt).set('ai', function (target) {
                                return get.effect(target, { name: 'guohe' }, player, player);
                            });
                            else event.finish();
                            'step 6'
                            if (result.bool && result.targets && result.targets.length) player.discardPlayerCard(result.targets[0], 'he', true, 2);
                        },
                    },
                    dcjuexun: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'], player: 'loseAfter' },
                        filter: function (event, player) {
                            var evt = event.getl(player);
                            return evt && evt.hs && evt.hs.length && player.getStorage('dcranlv').length > 0 && player.isMinHandcard();
                        },
                        usable: 1,
                        check: function (event, player) {
                            return player.getStorage('dcranlv').length >= 1 && _status.currentPhase.countCards('he') <= 2;
                        },
                        content: function () {
                            'step 0'
                            delete player.storage.dcranlv;
                            game.log(player, '重置了', '#g【燃缕】');
                            player.chooseBool(get.prompt('dcjuexun'), '对自己造成一点火焰伤害').set('ai', function () {
                                return false;
                            });
                            'step 1'
                            if (result.bool) player.damage('fire');
                            else event.finish();
                            'step 2'
                            if (player.isMinHp()) {
                                var list = game.filterPlayer(function (current) {
                                    return current != player && current.isLinked();
                                }).sortBySeat();
                                for (var i of list) {
                                    i.addSkill('dcjuexun_debuff');
                                    i.addMark('dcjuexun_debuff', 1, false);
                                }
                            }
                        },
                        subSkill: {
                            debuff: {
                                charlotte: true,
                                onremove: true,
                                intro: {
                                    markcount: function (storage, player) {
                                        return '[+' + player.countMark('dcjuexun_debuff') + ']';
                                    },
                                    content: '下次受到的火焰伤害+#',
                                },
                                trigger: { player: 'damageBegin3' },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.nature == 'fire' && player.countMark('dcjuexun_debuff') > 0;
                                },
                                content: function () {
                                    trigger.num += player.countMark('dcjuexun_debuff');
                                    player.removeSkill('dcjuexun_debuff');
                                },
                            },
                        },
                    },
                    //李昭仪
                    dcmingjie: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'phaseBefore', player: 'enterGame' },
                        direct: true,
                        filter: function (event, player) {
                            return (event.name != 'phase' || game.phaseNumber == 0) && game.hasPlayer(function (current) {
                                return current != player;
                            });
                        },
                        content: function () {
                            'step 0'
                            var prompt = '请选择【明节】的目标';
                            prompt += '<br>你与其获得对方因弃牌阶段弃置的牌';
                            player.chooseTarget(get.prompt('dcmingjie'), lib.filter.notMe, prompt, true).set('ai', function (target) {
                                return get.attitude(_status.event.player, target) > 0;
                            }).animate = false;
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('dcmingjie', target);
                                player.storage.dcmingjie_effect = target;
                                player.addSkill('dcmingjie_effect');
                                target.storage.dcmingjie_effect = player;
                                target.addSkill('dcmingjie_effect');
                            }
                        },
                        group: 'dcmingjie_deadmark',
                        subSkill: {
                            effect: {
                                audio: 'dcmingjie',
                                trigger: { global: 'loseAsyncAfter', player: 'loseAfter' },
                                forced: true,
                                charlotte: true,
                                onremove: true,
                                filter: function (event, player) {
                                    if (event.type != 'discard' || event.getlx === false || event.getParent('phaseDiscard').player != player) return false;
                                    if (!player.storage.dcmingjie_effect || !player.storage.dcmingjie_effect.isIn()) return false;
                                    var evt = event.getl(player);
                                    return evt && evt.cards2.filterInD('d').length > 0;
                                },
                                logTarget: function (event, player) {
                                    return player.storage.dcmingjie_effect;
                                },
                                content: function () {
                                    if (trigger.delay === false) game.delay();
                                    player.storage.dcmingjie_effect.gain(trigger.getl(player).cards2.filterInD('d'), 'gain2');
                                },
                                mark: 'character',
                                intro: {
                                    markcount: function (storage, player) {
                                        return get.translation(player.storage.dcmingjie_effect);
                                    },
                                    content: '你于弃牌阶段弃置牌后交给$',
                                },
                                group: 'dcmingjie_revenge',
                            },
                            revenge: {
                                audio: 'dcmingjie',
                                trigger: { global: ['phaseZhunbeiSkipped', 'phaseJudgeSkipped', 'phaseDrawSkipped', 'phaseUseSkipped', 'phaseDiscardSkipped', 'phaseJieshuSkipped'] },
                                filter: function (event, player) {
                                    return player.storage.dcmingjie_effect && player.storage.dcmingjie_effect === event.player;
                                },
                                forced: true,
                                charlotte: true,
                                logTarget: function (event, player) {
                                    return player.storage.dcmingjie_effect;
                                },
                                content: function () {
                                    'step 0'
                                    var list = [player, player.storage.dcmingjie_effect];
                                    list.sortBySeat();
                                    game.asyncDraw(list, 2);
                                    'step 1'
                                    event.target = player.storage.dcmingjie_effect;
                                    var str = '令' + get.translation(player) + '防止下次受到的伤害';
                                    if (event.target && event.target.isIn()) event.target.chooseBool(get.prompt('dcmingjie_revenge', event.target), str).set('ai', function () {
                                        return get.attitude(event.target, player) > 0;
                                    });
                                    'step 2'
                                    if (result.bool) {
                                        player.addSkill('dcmingjie_defend');
                                        player.addMark('dcmingjie_defend', 1, false);
                                    }
                                },
                            },
                            deadmark: {
                                audio: 'dcmingjie',
                                trigger: { global: 'dieAfter' },
                                forced: true,
                                popup: false,
                                lastDo: true,
                                silent: true,
                                filter: function (event, player) {
                                    return player.storage.dcmingjie_effect && player.storage.dcmingjie_effect === event.player;
                                },
                                content: function () {
                                    player.die();
                                },
                            },
                            defend: {
                                audio: 'dcmingjie',
                                charlotte: true,
                                onremove: true,
                                trigger: { player: 'damageBegin2' },
                                forced: true,
                                filter: function (event, player) {
                                    return player.hasMark('dcmingjie_defend');
                                },
                                priority: -50,
                                content: function () {
                                    trigger.cancel();
                                    game.log(player, '防止了伤害');
                                    player.removeMark('dcmingjie_defend', 1, false);
                                    if (!player.countMark('dcmingjie_defend')) player.removeSkill('dcmingjie_defend');
                                },
                                marktext: '明节',
                                intro: {
                                    onremove: true,
                                    content: '防止接下来的#次伤害',
                                },
                            },
                        },
                    },
                    dcxianfu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { target: 'useCardToTargeted' },
                        direct: true,
                        filter: function (event, player) {
                            var list = ['phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard'];
                            return list.some(function (key) {
                                return !player.getStorage('dcxianfu_skip').contains(key);
                            });
                        },
                        usable: 1,
                        content: function () {
                            'step 0'
                            var list = [
                                ['phaseJudge', `判断阶段`],
                                ['phaseDraw', `摸牌阶段`],
                                ['phaseUse', `出牌阶段`],
                                ['phaseDiscard', `弃牌阶段`],
                            ];
                            var str = `是否发动〖娴辅〗：跳过的一个阶段并令` + get.translation(trigger.card) + `对你无效`;
                            player.chooseButton([str, [list, 'textbutton']]).set('ai', function (button) {
                                var player = _status.event.player;
                                switch (button.link) {
                                    case 'phaseJudge':
                                        return 5 + Math.random();
                                        break;
                                    case 'phaseDraw':
                                        if (trigger.getParent().excluded.contains(player)) return false;
                                        return Math.random();
                                        break;
                                    case 'phaseUse':
                                        if (trigger.getParent().excluded.contains(player)) return false;
                                        return Math.random() - 10;
                                        break;
                                    case 'phaseDiscard':
                                        return 10 + Math.random();
                                        break;
                                }
                            }).set('filterButton', function (button) {
                                var player = _status.event.player;
                                return !player.getStorage('dcxianfu_skip').contains(button.link);
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('dcxianfu');
                                trigger.getParent().excluded.add(player);
                                player.addTempSkill('dcxianfu_skip', { player: 'phaseBegin' });
                                player.markAuto('dcxianfu_skip', [result.links[0]]);
                            }
                            else {
                                event.finish();
                                player.storage.counttrigger.dcxianfu--;
                            }
                            'step 2'
                            if (!player.storage.dcmingjie_effect || !player.storage.dcmingjie_effect.isIn()) event.finish();
                            'step 3'
                            event.target = player.storage.dcmingjie_effect;
                            if (player.countCards('h') > 0) event.target.gainPlayerCard(player, 'h', [1, 3], false, 'visible');
                            'step 4'
                            if (event.target.countCards('h') > 0) player.gainPlayerCard(event.target, 'h', [1, 3], false, 'visible');
                        },
                        subSkill: {
                            skip: {
                                charlotte: true,
                                intro: { content: '下回合跳过的阶段：$' },
                                onremove: function (player) {
                                    var list = ['phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard'];
                                    for (var i = 0; i <= 3; i++) {
                                        if (player.getStorage('dcxianfu_skip').contains(list[i])) player.skip(list[i]);
                                    }
                                    delete player.storage.dcxianfu_skip;
                                },
                            },
                        },
                    },
                    //孙寒华
                    olhuaguang: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'phaseUse',
                        direct: true,
                        filter: function (event, player) {
                            var equip = player.getCards('e').find(function (card) {
                                return card.name.indexOf('cailian_equip') == 0;
                            });
                            var list = [];
                            for (var i = 1; i < 6; i++) {
                                if (player.isDisabled(i)) continue;
                                if (equip && get.subtype(equip) == 'equip' + i) continue;
                                list.push(i);
                            }
                            return !player.hasSkill('olhuaguang_block') && (list.length > 0 || equip);
                        },
                        content: function () {
                            'step 0'
                            event.equip = player.getCards('e').find(function (card) {
                                return card.name.indexOf('cailian_equip') == 0;
                            });
                            var list = [];
                            for (var i = 1; i < 6; i++) {
                                if (player.isDisabled(i)) continue;
                                if (event.equip && get.subtype(event.equip) == 'equip' + i) continue;
                                list.push('equip' + i);
                            }
                            if (list.length) event.list = list;
                            var choices = [
                                [1, `将【彩莲】置入一个装备栏`],
                                [2, `修改【彩莲】的花色`],
                            ];
                            player.chooseButton([get.prompt('olhuaguang'), [choices, 'textbutton']]).set('ai', function (button) {
                                return Math.random();
                            }).set('filterButton', function (button) {
                                var player = _status.event.player;
                                if (button.link == 1) return list.length > 0;
                                if (button.link == 2) return event.equip;
                                return false;
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('olhuaguang');
                                player.addTempSkill('olhuaguang_block');
                                event.choice = result.links[0];
                            }
                            else event.finish();
                            'step 2'
                            if (event.choice == 1) {
                                var cards = [];
                                for (var i = 0; i < game.players.length; i++) {
                                    var hs = game.players[i].getCards('e');
                                    for (var j = 0; j < hs.length; j++) {
                                        if (hs[j].name.indexOf('cailian_equip') == 0) cards.push(hs[j]);
                                    }
                                }
                                if (cards.length > 0) player.lose(cards, 'visible', ui.ordering);
                                if (event.list.length == 1) event._result = { control: event.list[0] };
                                else player.chooseControl(event.list, true).set('prompt', '选择置入的装备栏');
                            }
                            else event.goto(4);
                            'step 3'
                            var card = game.createCard('cailian_' + result.control, 'heart', 10);
                            player.$gain2(card);
                            game.delayx();
                            player.equip(card);
                            'step 4'
                            if (event.choice == 2) {
                                var suits = [];
                                for (var i of lib.suit) {
                                    if (get.suit(event.equip) != i) suits.push(i);
                                }
                                if (suits.length == 1) event._result = { control: suits[0] };
                                else player.chooseControl(suits, true).set('prompt', '选择修改后的花色');
                            }
                            else event.finish();
                            'step 5'
                            event.equip.init([
                                result.control,
                                event.equip.number,
                                event.equip.name,
                                event.equip.nature,]);
                        },
                        group: 'olhuaguang_use',
                        subSkill: {
                            use: {
                                audio: 'olhuaguang',
                                trigger: { player: 'phaseZhunbeiBegin' },
                                direct: true,
                                filter: function (event, player) {
                                    var equip = player.getCards('e').find(function (card) {
                                        return card.name.indexOf('cailian_equip') == 0;
                                    });
                                    var list = [];
                                    for (var i = 1; i < 6; i++) {
                                        if (player.isDisabled(i)) continue;
                                        if (equip && get.subtype(equip) == 'equip' + i) continue;
                                        list.push(i);
                                    }
                                    return list.length > 0 || equip;
                                },
                                content: function () {
                                    'step 0'
                                    event.equip = player.getCards('e').find(function (card) {
                                        return card.name.indexOf('cailian_equip') == 0;
                                    });
                                    var list = [];
                                    for (var i = 1; i < 6; i++) {
                                        if (player.isDisabled(i)) continue;
                                        if (event.equip && get.subtype(event.equip) == 'equip' + i) continue;
                                        list.push('equip' + i);
                                    }
                                    if (list.length) event.list = list;
                                    var choices = [
                                        [1, `将【彩莲】置入一个装备栏`],
                                        [2, `修改【彩莲】的花色`],
                                    ];
                                    player.chooseButton([get.prompt('olhuaguang'), [choices, 'textbutton']]).set('ai', function (button) {
                                        return Math.random();
                                    }).set('filterButton', function (button) {
                                        var player = _status.event.player;
                                        if (button.link == 1) return list.length > 0;
                                        if (button.link == 2) return event.equip;
                                        return false;
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('olhuaguang');
                                        event.choice = result.links[0];
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (event.choice == 1) {
                                        var cards = [];
                                        for (var i = 0; i < game.players.length; i++) {
                                            var hs = game.players[i].getCards('e');
                                            for (var j = 0; j < hs.length; j++) {
                                                if (hs[j].name.indexOf('cailian_equip') == 0) cards.push(hs[j]);
                                            }
                                        }
                                        if (cards.length > 0) player.lose(cards, 'visible', ui.ordering);
                                        if (event.list.length == 1) event._result = { control: event.list[0] };
                                        else player.chooseControl(event.list, true).set('prompt', '选择置入的装备栏');
                                    }
                                    else event.goto(4);
                                    'step 3'
                                    var card = game.createCard('cailian_' + result.control, 'heart', 10);
                                    player.$gain2(card);
                                    game.delayx();
                                    player.equip(card);
                                    'step 4'
                                    if (event.choice == 2) {
                                        var suits = [];
                                        for (var i of lib.suit) {
                                            if (get.suit(event.equip) != i) suits.push(i);
                                        }
                                        if (suits.length == 1) event._result = { control: suits[0] };
                                        else player.chooseControl(suits, true).set('prompt', '选择修改后的花色');
                                    }
                                    else event.finish();
                                    'step 5'
                                    event.equip.init([
                                        result.control,
                                        event.equip.number,
                                        event.equip.name,
                                        event.equip.nature,]);
                                },
                            },
                            block: { charlotte: true },
                        },
                    },
                    olxuanbai: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        derivation: ['oldangmo', 'oljihui', 'olxiaju'],
                        trigger: { player: 'equipEnd' },
                        forced: true,
                        filter: function (event, player) {
                            return event.card.name.indexOf('cailian_equip') == 0;
                        },
                        content: function () {
                            var equip = player.getCards('e').find(function (card) {
                                return card.name.indexOf('cailian_equip') == 0;
                            });
                            if (equip) {
                                switch (get.subtype(equip)) {
                                    case 'equip1':
                                        player.removeAdditionalSkill('olxuanbai');
                                        player.addAdditionalSkill('olxuanbai', ['oldangmo']);
                                        break;
                                    case 'equip2':
                                        player.removeAdditionalSkill('olxuanbai');
                                        player.addAdditionalSkill('olxuanbai', ['oljihui']);
                                        break;
                                    case 'equip5':
                                        player.removeAdditionalSkill('olxuanbai');
                                        player.addAdditionalSkill('olxuanbai', ['olxiaju']);
                                        break;
                                }
                            }
                        },
                    },
                    oldangmo: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'useCardToTargeted' },
                        forced: true,
                        direct: true,
                        filter: function (event, player) {
                            return event.targets && event.targets.length == 1 && get.tag(event.card, 'damage');
                        },
                        content: function () {
                            'step 0'
                            var prompt2 = '为' + get.translation(trigger.card) + '增加一个目标';
                            prompt2 += '<br>或点取消令' + get.translation(trigger.card) + '额外结算一次';
                            if (game.hasPlayer(function (current) {
                                return current != trigger.targets[0] && player.canUse(trigger.card, current);
                            })) player.chooseTarget(get.prompt('oldangmo'), prompt2, function (card, player, target) {
                                return target != trigger.targets[0] && player.canUse(trigger.card, target);
                            }).set('ai', function (target) {
                                return -get.attitude(player, target);
                            });
                            else {
                                player.logSkill('oldangmo');
                                trigger.getParent().targets.push(trigger.targets[0]);
                                game.log(trigger.card, '额外结算一次');
                                event.finish();
                            }
                            'step 1'
                            if (result.bool) {
                                player.logSkill('oldangmo', result.targets[0]);
                                trigger.getParent().targets.push(result.targets[0]);
                                game.log(result.targets[0], '成为了', trigger.card, '的额外目标');
                            }
                            else {
                                player.logSkill('oldangmo');
                                trigger.getParent().targets.push(trigger.targets[0]);
                                game.log(trigger.card, '额外结算一次');
                            }
                        },
                    },
                    oljihui: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'recoverAfter' },
                        forced: true,
                        content: function () {
                            player.draw();
                        },
                        group: 'oljihui_gain',
                        subSkill: {
                            gain: {
                                audio: 'oljihui',
                                trigger: { global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'], player: 'loseAfter' },
                                forced: true,
                                round: 1,
                                filter: function (event, player) {
                                    var num = 0;
                                    event.cards = [];
                                    var cardA = get.cardPile2(function (card) {
                                        return !event.cards.contains(card) && card.name == 'tao';
                                    });
                                    if (cardA) event.cards.push(cardA);
                                    else {
                                        var cardB = get.discardPile(function (card) {
                                            return !event.cards.contains(card) && card.name == 'tao';
                                        });
                                        if (cardB) event.cards.push(cardB);
                                    }
                                    player.getRoundHistory('lose', function (evt) {
                                        num += evt.cards2.length;
                                    });
                                    return num > player.hp && event.cards.length > 0;
                                },
                                content: function () {
                                    var cardA = get.cardPile2(function (card) {
                                        return card.name == 'tao';
                                    });
                                    if (cardA) player.gain(cardA, 'gain2');
                                    else {
                                        var cardB = get.discardPile(function (card) {
                                            return card.name == 'tao';
                                        });
                                        if (cardB) player.gain(cardB, 'gain2');
                                    }
                                },
                            },
                        },
                    },
                    olxiaju: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        onremove: function (player) {
                            player.removeSkill('olxiaju_effect');
                        },
                        trigger: { global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'], player: 'loseAfter' },
                        forced: true,
                        popup: false,
                        priority: 15,
                        usable: 1,
                        filter: function (event, player) {
                            var evt = event.getl(player);
                            return evt && evt.cards2 && evt.cards2.length > 0;
                        },
                        content: function () {
                            'step 0'
                            event.statC = player.hasSkill('olxiaju_effect') ? 2 : 1;
                            'step 1'
                            var list = [];
                            for (var i of lib.suit) {
                                if (!player.countCards('he', { suit: i })) list.push(i);
                            }
                            event.cards = [];
                            for (var i = 0; i < event.statC; i++) {
                                var cardA = get.cardPile2(function (card) {
                                    return !event.cards.contains(card) && list.contains(get.suit(card));
                                });
                                if (cardA) event.cards.push(cardA);
                                else {
                                    var cardB = get.discardPile(function (card) {
                                        return !event.cards.contains(card) && list.contains(get.suit(card));
                                    });
                                    if (cardB) event.cards.push(cardB);
                                }
                            }
                            'step 2'
                            if (event.cards.length > 0) {
                                player.logSkill('olxiaju');
                                if (player.hasSkill('olxiaju_effect')) player.removeSkill('olxiaju_effect');
                                player.gain(event.cards, 'gain2');
                            }
                            else event.finish();
                            'step 3'
                            var suits = [];
                            for (var j of lib.suit) {
                                if (player.countCards('he', { suit: j }) > 0) suits.push(j);
                            }
                            if (suits.length >= 4) player.addSkill('olxiaju_effect');
                        },
                        subSkill: {
                            effect: { charlotte: true, mark: true, intro: { content: '下次获得的牌数+1' } },
                        },
                    },
                    //彩莲
                    cailian_skill: {
                        equipSkill: true,
                        mod: {
                            ignoredHandcard(card, player) {
                                var equip = player.getCards('e').find(function (card) {
                                    return card.name.indexOf('cailian_equip') == 0;
                                });
                                if (equip && get.color(card) == get.color(equip)) return true;
                            },
                            cardDiscardable(card, player, name) {
                                var equip = player.getCards('e').find(function (card) {
                                    return card.name.indexOf('cailian_equip') == 0;
                                });
                                if (name == 'phaseDiscard' && equip && get.color(card) == get.color(equip)) return false;
                            },
                        },
                        trigger: { global: 'recoverBegin', source: 'damageBegin1' },
                        usable: 1,
                        forced: true,
                        filter: function (event, player) {
                            if (event.name == 'recover') return event.source && event.source == player;
                            return event.player;
                        },
                        content: function () {
                            trigger.num++;
                        },
                    },
                    //界夏侯氏
                    olqiaoshi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'phaseJieshuBegin' },
                        check: function (event, player) {
                            return get.attitude(player, event.player) >= 0;
                        },
                        filter: function (event, player) {
                            return !player.hasSkill('olqiaoshi_blocker');
                        },
                        logTarget: 'player',
                        content: function () {
                            'step 0'
                            game.asyncDraw([trigger.player, player]);
                            'step 1'
                            game.delayx();
                            if (player.countCards('h') != trigger.player.countCards('h')) player.addTempSkill('olqiaoshi_blocker', 'roundStart');
                        },
                        subSkill: {
                            blocker: { charlotte: true, mark: true, intro: { content: '本轮失效' } },
                        },
                    },
                    olyanyu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'phaseUse',
                        filter: function (event, player) {
                            return player.countCards('h', 'sha') > 0;
                        },
                        filterCard: { name: 'sha' },
                        prepare: function (cards, player) {
                            player.$throw(cards, 1000);
                            game.log(player, '将', cards, '置入了弃牌堆');
                        },
                        discard: false,
                        loseTo: 'discardPile',
                        visible: true,
                        delay: 0.5,
                        content: function () {
                            player.draw();
                        },
                        ai: {
                            basic: {
                                order: 1
                            },
                            result: {
                                player: 1,
                            },
                        },
                        group: 'olyanyu_draw',
                        subSkill: {
                            draw: {
                                trigger: { player: 'phaseUseEnd' },
                                direct: true,
                                filter: function (event, player) {
                                    return player.getHistory('lose', function (evt) {
                                        var evt2 = evt.getParent();
                                        return evt2.name == 'useSkill' && evt2.skill == 'olyanyu' && evt.getParent(3) == event;
                                    }).length >= 2 && game.hasPlayer(function (current) {
                                        return current.hasSex('male');
                                    });
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseTarget(get.prompt('olyanyu'), '令一名男性角色摸两张牌', function (card, player, target) {
                                        return target.hasSex('male');
                                    }).set('ai', function (target) {
                                        return get.attitude(_status.event.player, target);
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('olyanyu', result.targets);
                                        result.targets[0].draw(2);
                                    }
                                },
                            },
                        },
                    },
                    //乐曹植
                    dcyuefuyue: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'chooseToUse',
                        filter: function (event, player) {
                            for (var i of lib.inpile) {
                                var type = get.type2(i);
                                if ((type == 'basic' || type == 'trick') && player.countCards('hs', function (card) {
                                    return card.hasGaintag(i);
                                }) > 0 && event.filterCard({ name: i }, player, event)) return true;
                            }
                            return false;
                        },
                        hiddenCard: function (player, name) {
                            return lib.inpile.contains(name) && player.countCards('hs', function (card) {
                                return card.hasGaintag(name);
                            }) > 0;
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var list = [];
                                for (var i = 0; i < lib.inpile.length; i++) {
                                    var name = lib.inpile[i];
                                    if (!player.countCards('hs', function (card) {
                                        return card.hasGaintag(name);
                                    })) continue;
                                    if (name == 'sha' && event.filterCard({ name: name }, player, event)) {
                                        list.push(['基本', '', 'sha']);
                                        for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
                                    }
                                    else if (get.type2(name) == 'trick' && event.filterCard({ name: name }, player, event)) list.push(['锦囊', '', name]);
                                    else if (get.type(name) == 'basic' && event.filterCard({ name: name }, player, event)) list.push(['基本', '', name]);
                                }
                                if (list.length == 0) return ui.create.dialog('赋乐已无可用牌');
                                return ui.create.dialog('赋乐', [list, 'vcard']);
                            },
                            filter: function (button, player) {
                                return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                            },
                            check: function (button) {
                                var player = _status.event.player;
                                if (player.countCards('hs', button.link[2]) > 0) return 0;
                                if (button.link[2] == 'wugu') return 0;
                                var effect = player.getUseValue(button.link[2]);
                                if (effect > 0) return effect;
                                return 0;
                            },
                            backup: function (links, player) {
                                return {
                                    audio: 'dcyuefuyue',
                                    filterCard: function (card, player) {
                                        return card.hasGaintag(lib.skill.dcyuefuyue_backup.viewAs.name);
                                    },
                                    selectCard: 1,
                                    popname: true,
                                    check: function (card) {
                                        return 8 - get.value(card);
                                    },
                                    position: 'hs',
                                    viewAs: {
                                        name: links[0][2],
                                        nature: links[0][3],
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                return '将一张牌名为' + get.translation(links[0][2]) + '的“赋”牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                            },
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
                        mod: {
                            ignoredHandcard: function (card, player) {
                                for (var i of lib.inpile) {
                                    if (card.hasGaintag(i)) return true;
                                }
                            },
                            cardDiscardable: function (card, player, name) {
                                for (var i of lib.inpile) {
                                    if (name == 'phaseDiscard' && card.hasGaintag(i)) return false;
                                }
                            },
                        },
                        group: 'dcyuefuyue_buff',
                        subSkill: {
                            buff: {
                                audio: 'dcyuefuyue',
                                trigger: { global: 'phaseBefore', player: 'enterGame' },
                                forced: true,
                                lastDo: true,
                                filter: function (event, player) {
                                    return (event.name != 'phase' || game.phaseNumber == 0) && player.countCards('h') > 0;
                                },
                                content: function () {
                                    var hs = player.getCards('h');
                                    if (hs.length) {
                                        for (var i of hs) {
                                            var list = [];
                                            for (var j = 0; j < lib.inpile.length; j++) {
                                                var name = lib.inpile[j];
                                                if (get.name(i) == name) continue;
                                                if (get.type(name) != 'equip') list.push(name);
                                            }
                                            player.addGaintag(i, list.randomGet());
                                        }
                                    }
                                },
                            },
                        },
                    },
                    dcyuewenlan: {
                        audio: 'ext:新武将/audio:2',
                        getLastUsed: function (player, event) {
                            var history = player.getAllHistory('useCard').concat(player.getAllHistory('respond'));
                            var index;
                            if (event) index = history.indexOf(event) - 1;
                            else index = history.length - 1;
                            if (index >= 0) return history[index];
                            return false;
                        },
                        trigger: { player: ['useCardAfter', 'respondAfter'] },
                        forced: true,
                        locked: false,
                        filter: function (event, player) {
                            return player.getAllHistory('useCard').concat(player.getAllHistory('respond')).length % 2 == 0;
                        },
                        content: function () {
                            'step 0'
                            event.cards = [];
                            var evt = lib.skill.dcyuewenlan.getLastUsed(player, trigger);
                            event.getLast = [];
                            event.getNow = [];
                            for (var i of lib.inpile) {
                                if (evt?.card?.gaintag?.contains(i)) {
                                    event.getLast.add(i);
                                    event.goon1 = true;
                                }
                                if (trigger?.card?.gaintag?.contains(i)) {
                                    event.getNow.add(i);
                                    event.goon2 = true;
                                }
                            }
                            if (evt?.cards) {
                                for (var j of evt?.cards) event.getLast.add(j.name);
                            }
                            if (trigger?.cards) {
                                for (var k of trigger?.cards) event.getNow.add(k.name);
                            }
                            event.getSame = event.getLast.filter(function (item) {
                                return event.getNow.includes(item);
                            });
                            event.getCombine = event.getLast.concat(event.getNow);
                            'step 1'
                            if (event.goon1 && event.goon2 && event.getSame.length > 0) {
                                event.statC = event.getCombine.length;
                                if (event.statC < 1) event.finish();
                            }
                            else event.goto(5);
                            'step 2'
                            for (var i = 0; i < event.statC; i++) {
                                var cardP = get.cardPile2(function (card) {
                                    return event.getCombine.contains(card.name) && !event.cards.some(function (cardx) {
                                        return card.name == cardx.name;
                                    });
                                });
                                if (cardP) event.cards.push(cardP);
                            }
                            'step 3'
                            if (event.cards.length > 0) player.gain(event.cards, 'gain2');
                            else event.finish();
                            'step 4'
                            event.cards.forEach(function (card) {
                                var list = [];
                                for (var j = 0; j < lib.inpile.length; j++) {
                                    var name = lib.inpile[j];
                                    if (get.name(card) == name) continue;
                                    if (get.type(name) != 'equip') list.push(name);
                                }
                                player.addGaintag(card, list.randomGet());
                            });
                            event.finish();
                            'step 5'
                            var str = '你选择任意张手牌并替换其中“赋”的额外牌名然后标记其余牌为“赋”';
                            if (!player.countCards('h')) event.finish();
                            else player.chooseCard(get.prompt2('dcyuewenlan'), true, str, 'h', [1, Infinity]).set('ai', function (card) {
                                return 6 - get.value(card);
                            });
                            'step 6'
                            if (result.bool) event.changecards = result.cards;
                            else event.finish();
                            'step 7'
                            event.changecards.forEach(function (card) {
                                var list = [];
                                for (var j = 0; j < lib.inpile.length; j++) {
                                    var name = lib.inpile[j];
                                    if (card.hasGaintag(name)) {
                                        player.removeGaintag(name, [card]);
                                        continue;
                                    }
                                    if (get.name(card) == name) continue;
                                    if (get.type(name) != 'equip') list.push(name);
                                }
                                player.addGaintag(card, list.randomGet());
                            });
                        },
                    },
                    //族陆郁生
                    clanshixi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        init: function (player) {
                            if (!player.storage.clanshixi) player.storage.clanshixi = new Map();
                        },
                        isClanshixi: function (card) {
                            var info = lib.card[card.name];
                            if (!info || info.type != 'trick') return false;
                            if (info.notarget) return true;
                            if (info.selectTarget != undefined) {
                                if (Array.isArray(info.selectTarget)) {
                                    if (info.selectTarget[0] < 0) return !info.toself;
                                    return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
                                }
                                else {
                                    if (info.selectTarget < 0) return !info.toself;
                                    return info.selectTarget != 1;
                                }
                            }
                            return false;
                        },
                        marktext: '拾昔',
                        mark: true,
                        intro: {
                            markcount: function (storage, player) {
                                return '';
                            },
                            content: function (storage, player) {
                                var str = '已记录的花色和牌名：';
                                if (player.storage.clanshixi.size > 0) {
                                    player.storage.clanshixi.forEach((value, key) => {
                                        str += '<br>' + get.translation(value[0]) + '：【' + get.translation(value[1]) + '】';
                                    });
                                }
                                return str;
                            }
                        },
                        enable: 'chooseToUse',
                        filter: function (event, player) {
                            if (player.storage.clanshixi.size == 0) return false;
                            for (var i of lib.suit) {
                                if (player.storage.clanshixi.has(i) && event.filterCard({ name: player.storage.clanshixi.get(i)[1] }, player, event)) {
                                    if (player.countCards('he', { suit: i }) > 0) return true;
                                }
                            }
                            return false;
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var dialog = ui.create.dialog('拾昔：将一种花色的所有牌置入弃牌堆视为使用对应花色记录的普通锦囊牌', 'hidden');
                                var table = document.createElement('div');
                                table.classList.add('add-setting');
                                table.style.margin = '0';
                                table.style.width = '100%';
                                table.style.position = 'relative';
                                for (var i of lib.suit) {
                                    if (!player.countCards('he', { suit: i })) continue;
                                    if (!player.storage.clanshixi.has(i)) continue;
                                    if (!event.filterCard({ name: player.storage.clanshixi.get(i)[1] }, player, event)) continue;
                                    var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                                    td.innerHTML = '<span>' + get.translation(i) + '</span>';
                                    td.link = i;
                                    td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
                                    for (var j in lib.element.button) {
                                        td[j] = lib.element.button[j];
                                    }
                                    table.appendChild(td);
                                    dialog.buttons.add(td);
                                }
                                dialog.content.appendChild(table);
                                var list = [];
                                var listx = [];
                                for (var i of lib.suit) {
                                    if (player.storage.clanshixi.has(i) && event.filterCard({ name: player.storage.clanshixi.get(i)[1] }, player, event)) {
                                        if (!listx.contains(player.storage.clanshixi.get(i)[1])) {
                                            if (player.countCards('he', { suit: i }) > 0) {
                                                list.push(['锦囊', '', player.storage.clanshixi.get(i)[1]]);
                                                listx.push(player.storage.clanshixi.get(i)[1]);
                                            }
                                        }
                                    }
                                }
                                dialog.add([list, 'vcard']);
                                return dialog;
                            },
                            filter: function (button, player) {
                                if (ui.selected.buttons.length && typeof button.link == typeof ui.selected.buttons[0].link) return false;
                                if (ui.selected.buttons.length && typeof ui.selected.buttons[0].link == 'string') {
                                    if (!Array.isArray(button.link)) return false;
                                    if (button.link[2] != player.storage.clanshixi.get(ui.selected.buttons[0].link)[1]) return false;
                                    return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                                }
                                if (ui.selected.buttons.length && Array.isArray(ui.selected.buttons[0].link)) {
                                    if (!player.countCards('he', { suit: button.link })) return false;
                                    return ui.selected.buttons[0].link[2] === player.storage.clanshixi.get(button.link)[1];
                                }
                                if (Array.isArray(button.link)) {
                                    return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                                }
                                if (typeof button.link == 'string') return player.countCards('he', { suit: button.link }) > 0;
                                return false;
                            },
                            select: 2,
                            check: function (button) {
                                var player = _status.event.player;
                                if (typeof button.link == 'string') return (4 - player.countCards('he', function (card) {
                                    return get.suit(card) == button.link && get.value(card) > 6;
                                })) * player.getUseValue({ name: player.storage.clanshixi.get(button.link)[1] }, false);
                                var name = button.link[2];
                                var evt = _status.event.getParent();
                                var card = { name: name, isCard: true };
                                return player.getUseValue(card, false);
                            },
                            backup: function (links, player) {
                                if (typeof links[1] == 'string') links.reverse();
                                var suit = links[0];
                                var name = links[1][2];
                                return {
                                    filterCard: { suit: suit },
                                    selectCard: -1,
                                    position: 'he',
                                    viewAs: { name: name, isCard: true },
                                    popname: true,
                                    precontent: function () {
                                        player.logSkill('clanshixi');
                                        player.discard(event.result.cards);
                                        event.result.card = {
                                            name: event.result.card.name,
                                            isCard: true,
                                        };
                                        event.result.cards = [];
                                        delete event.result.skill;
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                if (typeof links[1] == 'string') links.reverse();
                                var suit = links[0];
                                var name = links[1][2];
                                return '弃置所有' + get.translation(suit) + '牌，视为使用' + get.translation(name);
                            },
                        },
                        hiddenCard: function (player, name) {
                            if (player.storage.clanshixi.size == 0) return false;
                            for (var i of lib.suit) {
                                if (player.storage.clanshixi.has(i) && player.countCards('he', { suit: i }) > 0) return name == player.storage.clanshixi.get(i)[1];
                            }
                            return false;
                        },
                        ai: {
                            order: 6,
                            result: { player: 1 },
                        },
                        group: 'clanshixi_record',
                        subSkill: {
                            record: {
                                audio: 'clanshixi',
                                trigger: { player: 'useCard' },
                                forced: true,
                                filter: function (event, player) {
                                    if (!lib.suit.contains(get.suit(event.card))) return false;
                                    if (player.storage.clanshixi.has(get.suit(event.card))) return false;
                                    return get.type(event.card) == 'trick' && !lib.skill.clanshixi.isClanshixi(event.card);
                                },
                                content: function () {
                                    var suit = get.suit(trigger.card);
                                    var name = get.name(trigger.card);
                                    player.storage.clanshixi.set(suit, [suit, name]);
                                    game.log(player, '记录了', '#g' + get.translation(suit), '#y【' + get.translation(name) + '】');
                                },
                            },
                        },
                    },
                    clanjianbai: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        onremove: function (player) {
                            game.players.forEach(function (current) {
                                let tags = current.getCards('he', card => card.gaintag?.some(tag => tag.startsWith('clanjianbai_effect')));
                                if (tags.length) {
                                    tags = tags.slice().map(card => card.gaintag.find(tag => tag.startsWith('clanjianbai_effect')));
                                    tags.forEach(tag => current.removeGaintag(tag));
                                }
                            });
                        },
                        trigger: { player: 'useCardAfter' },
                        filter: function (event, player, name) {
                            var suits = [];
                            for (var i of lib.suit) {
                                if (player.countCards('he', { suit: i }) > 0) suits.push(i);
                            }
                            if (!suits.length) return false;
                            var history = player.getHistory('useCard');
                            var evt = event;
                            for (var i = 0; i < history.length; i++) {
                                if (history[i] != evt && get.type2(history[i].card) == get.type2(event.card)) return false;
                                else if (history[i] == evt) return true;
                            }
                            return false;
                        },
                        forced: true,
                        content: function () {
                            'step 0'
                            var prompt = '###【坚白】###保留一种花色的所有牌';
                            var next = player.chooseButton([prompt, [lib.suit.map(i => ['', '', 'lukai_' + i]), 'vcard']], true, 1);
                            next.set('filterButton', function (button) {
                                var player = _status.event.player;
                                var cards = player.getCards('he', { suit: button.link[2].slice(6) });
                                return cards.length > 0;
                            });
                            next.set('ai', function (button) {
                                var player = _status.event.player;
                                return player.getCards('he', { suit: button.link[2].slice(6) }).map(i => get.value(i)).reduce((p, c) => p + c, 0);
                            });
                            next.set('custom', {
                                replace: {
                                    button: function (button) {
                                        if (!_status.event.isMine()) return;
                                        if (button.classList.contains('selectable') == false) return;
                                        var cards = _status.event.player.getCards('he', { suit: button.link[2].slice(6) });
                                        if (cards.length) {
                                            var chosen = cards.filter(i => ui.selected.cards.includes(i)).length == cards.length;
                                            if (chosen) {
                                                ui.selected.cards.removeArray(cards);
                                                cards.forEach(function (card) {
                                                    card.classList.remove('selected');
                                                    card.updateTransform(false);
                                                });
                                            }
                                            else {
                                                ui.selected.cards.addArray(cards);
                                                cards.forEach(function (card) {
                                                    card.classList.add('selected');
                                                    card.updateTransform(true);
                                                });
                                            }
                                        }
                                        if (button.classList.contains('selected')) {
                                            ui.selected.buttons.remove(button);
                                            button.classList.remove('selected');
                                            if (_status.multitarget || _status.event.complexSelect) {
                                                game.uncheck();
                                                game.check();
                                            }
                                        }
                                        else {
                                            button.classList.add('selected');
                                            ui.selected.buttons.add(button);
                                        }
                                        var custom = _status.event.custom;
                                        if (custom && custom.add && custom.add.button) {
                                            custom.add.button();
                                        }
                                        game.check();
                                    }
                                },
                                add: next.custom.add,
                            });
                            'step 1'
                            if (result.bool) {
                                var suits = result.links.map(i => i[2].slice(6));
                                event.cards = player.getCards('he', card => suits.includes(get.suit(card, player)))
                                var hes = player.getCards('he', card => !suits.includes(get.suit(card, player)));
                                if (hes.length > 0) {
                                    player.loseToDiscardpile(hes);
                                    player.draw(hes.length);
                                }
                                if (!event.cards.length) event.finish();
                            }
                            else event.finish();
                            'step 2'
                            player.addTempSkill('clanjianbai_effect');
                            for (const card of event.cards) {
                                const skill = 'clanjianbai_effect';
                                let tag = card.gaintag?.find(tag => tag.startsWith(skill));
                                if (tag) {
                                    player.removeGaintag(tag, [card]);
                                    tag = skill + (parseInt(tag.slice(skill.length)) + 1);
                                }
                                else tag = skill + '1';
                                const level = tag.slice(skill.length);
                                game.broadcastAll((currentTag) => {
                                    lib.skill[currentTag] = { nopop: true, charlotte: true, onremove: true };
                                    lib.translate[currentTag] = `坚白${level}`;
                                    game.finishSkill(currentTag);
                                }, tag);
                                player.addGaintag([card], tag);
                            }
                        },
                        group: 'clanjianbai_record',
                        subSkill: {
                            effect: {
                                audio: 'clanjianbai',
                                onremove: function (player) {
                                    game.players.forEach(function (current) {
                                        let tags = current.getCards('he', card => card.gaintag?.some(tag => tag.startsWith('clanjianbai_effect')));
                                        if (tags.length) {
                                            tags = tags.slice().map(card => card.gaintag.find(tag => tag.startsWith('clanjianbai_effect')));
                                            tags.forEach(tag => current.removeGaintag(tag));
                                        }
                                    });
                                },
                                trigger: { global: 'phaseEnd' },
                                forced: true,
                                silent: true,
                                filter: function (event, player) {
                                    return player.countCards('he') > 0 && game.hasPlayer(function (current) {
                                        return current != player;
                                    });
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseCardTarget({
                                        position: 'he',
                                        filterCard: true,
                                        forced: true,
                                        filterTarget: lib.filter.notMe,
                                        ai1: function (card) {
                                            let tag = card.gaintag?.find(tag => tag.startsWith('clanjianbai_effect'));
                                            let count = 0;
                                            if (tag) count = parseInt(tag.slice('clanjianbai_effect'.length)) || 0;
                                            return 5 - get.value(card) + count * 10;
                                        },
                                        ai2: function (target) {
                                            var att = get.attitude(_status.event.player, target);
                                            if (target.hasSkillTag('nogain')) att /= 10;
                                            if (target.hasJudge('lebu')) att /= 5;
                                            return att;
                                        },
                                        prompt: '坚白：交给一名其他角色一张牌',
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        player.logSkill('clanjianbai_effect', target);
                                        player.give(result.cards, target);
                                        const giveCard = result.cards[0];
                                        let count = 0;
                                        const tag = giveCard.gaintag?.find(tag => tag.startsWith('clanjianbai_effect'));
                                        if (tag) count = parseInt(tag.slice('clanjianbai_effect'.length)) || 0;
                                        if (count > 0) player.draw(count);
                                    }
                                },
                            },
                            record: {
                                trigger: { player: 'useCard' },
                                firstDo: true,
                                forced: true,
                                silent: true,
                                filter: function (event, player) {
                                    return !player.getStorage('clanjianbai_use').contains(get.type2(event.card));
                                },
                                content: function () {
                                    player.addTempSkill('clanjianbai_use');
                                    player.markAuto('clanjianbai_use', [get.type2(trigger.card)]);
                                },
                            },
                            use: {
                                charlotte: true,
                                onremove: true,
                                intro: { content: '$' },
                            },
                        },
                    },
                    clanzelie: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        audioname: ['clan_luyusheng', 'clan_luji', 'clan_lujing'],
                        trigger: { global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'] },
                        direct: true,
                        filter: function (event, player) {
                            if (!event.player || event.player.countCards('ej')) return false;
                            if (!event.player.hasClan('吴郡陆氏') && event.player != player) return false;
                            var evt = event.getl(event.player);
                            if (!evt) return false;
                            return evt?.es?.length || evt?.js?.length;
                        },
                        content: function () {
                            'step 0'
                            var str = '令一名角色本回合下一次摸牌/弃牌后摸一张牌/弃一张牌';
                            player.chooseTarget(true, get.prompt('clanzelie'), str).set('ai', function (target) {
                                return get.attitude(_status.event.player, target);
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('clanzelie', result.targets[0]);
                                event.target = result.targets[0];
                                var prompt = '泽烈：请选择' + get.translation(event.target) + '获得的效果';
                                player.chooseControl('额外摸牌', '额外弃牌').set('prompt', prompt).set('ai', function () {
                                    if (get.attitude(_status.event.player, event.target) > 0) return '额外摸牌';
                                    return '额外弃牌';
                                });
                            }
                            else event.finish();
                            'step 2'
                            if (result.index == 1) {
                                event.target.addTempSkill('clanzelie_discard');
                                event.target.addMark('clanzelie_discard', 1, false);
                                game.delayx();
                            }
                            else {
                                event.target.addTempSkill('clanzelie_draw');
                                event.target.addMark('clanzelie_draw', 1, false);
                                game.delayx();
                            }
                        },
                        subSkill: {
                            discard: {
                                intro: {
                                    content: "本回合下$次弃置牌后，弃置一张牌",
                                },
                                trigger: { global: 'loseAsyncAfter', player: 'loseAfter' },
                                charlotte: true,
                                direct: true,
                                firstDo: true,
                                onremove: true,
                                filter: function (event, player) {
                                    if (!player.countMark('clanzelie_discard')) return false;
                                    return event.type == 'discard' && event.getl(player).cards2.length;
                                },
                                content: function () {
                                    'step 0'
                                    player.removeMark('clanzelie_discard', 1, false);
                                    if (player.countCards('he') > 0) player.chooseToDiscard('he', true);
                                    'step 1'
                                    if (!player.countMark('clanzelie_discard')) player.removeSkill('clanzelie_discard');
                                },
                            },
                            draw: {
                                intro: {
                                    content: "本回合下$次摸牌后，摸一张牌",
                                },
                                trigger: { player: 'gainAfter' },
                                charlotte: true,
                                direct: true,
                                firstDo: true,
                                onremove: true,
                                filter: function (event, player) {
                                    if (!player.countMark('clanzelie_draw')) return false;
                                    return event.getParent().name == 'draw';
                                },
                                content: function () {
                                    'step 0'
                                    player.removeMark('clanzelie_draw', 1, false);
                                    player.draw();
                                    'step 1'
                                    if (!player.countMark('clanzelie_draw')) player.removeSkill('clanzelie_draw');
                                },
                            },
                        },
                    },
                    //族陆绩
                    clangailan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseBegin' },
                        forced: true,
                        filter: function (event, player) {
                            event.cards = [];
                            var cardA = get.cardPile2(function (card) {
                                return !event.cards.contains(card) && card.name == 'huntianyi';
                            });
                            if (cardA) event.cards.push(cardA);
                            else {
                                var cardB = get.discardPile(function (card) {
                                    return !event.cards.contains(card) && card.name == 'huntianyi';
                                });
                                if (cardB) event.cards.push(cardB);
                            }
                            return !player.isDisabled(5) && event.cards.length > 0 && !player.getEquip('huntianyi');
                        },
                        content: function () {
                            'step 0'
                            event.cards = [];
                            var cardA = get.cardPile2(function (card) {
                                return !event.cards.contains(card) && card.name == 'huntianyi';
                            });
                            if (cardA) event.cards.push(cardA);
                            else {
                                var cardB = get.discardPile(function (card) {
                                    return !event.cards.contains(card) && card.name == 'huntianyi';
                                });
                                if (cardB) event.cards.push(cardB);
                            }
                            'step 1'
                            if (event.cards.length > 0) var card = event.cards.randomGet();
                            if (card) player.equip(card);
                        },
                        group: 'clangailan_effect',
                        subSkill: {
                            effect: {
                                audio: 'clangailan',
                                trigger: { global: 'phaseBefore', player: 'enterGame' },
                                forced: true,
                                filter: function (event, player) {
                                    return (event.name != 'phase' || game.phaseNumber == 0) && !lib.inpile.contains('huntianyi');
                                },
                                content: function () {
                                    for (var i = 1; i < 5; i++) {
                                        var list = [1, 3, 10, 12];
                                        var card = game.createCard2('huntianyi', 'diamond', list[i - 1]);
                                        ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                                    }
                                    game.broadcastAll(function () { lib.inpile.add('huntianyi') });
                                    game.updateRoundNumber();
                                },
                            },
                        },
                    },
                    clanfennu: {
                        marktext: '逸',
                        intro: {
                            name: '逸',
                            markcount: function (storage, player) {
                                var num = 0;
                                var cards = player.getExpansions('clanfennu');
                                for (var i of cards) {
                                    var numx = get.number(i, false);
                                    if (numx && typeof numx == 'number') num += numx;
                                }
                                return ('' + player.countMark('clanfennu_count') + '/' + get.translation(num));
                            },
                            content: 'expansion',
                        },
                        onremove: function (player, skill) {
                            var cards = player.getExpansions('clanfennu');
                            if (cards.length) player.loseToDiscardpile(cards);
                            player.clearMark('clanfennu_count', false);
                        },
                        trigger: { player: 'phaseUseBegin' },
                        direct: true,
                        filter: function (event, player) {
                            return player.hp > 0 && game.hasPlayer(function (target) {
                                return target.hasCard(function (card) {
                                    return lib.filter.cardDiscardable(card, target, 'clanfennu');
                                }, 'he');
                            });
                        },
                        content: function () {
                            'step 0'
                            var str = '令至多' + get.translation(player.hp) + '名角色各弃置一张牌';
                            player.chooseTarget([1, player.hp], function (card, player, target) {
                                return target.hasCard(function (card) {
                                    return lib.filter.cardDiscardable(card, target, 'clanfennu');
                                }, 'he');
                            }, get.prompt('clanfennu'), str).set('ai', function (target) {
                                var player = _status.event.player;
                                var att = get.attitude(player, target);
                                if (att > 0) return 0;
                                return target.countCards(function (card) {
                                    return lib.filter.cardDiscardable(card, target, 'clanfennu');
                                }, 'he');
                            });
                            'step 1'
                            if (result.bool && result.targets.length) {
                                event.targets = result.targets.sortBySeat();
                                player.logSkill('clanfennu', event.targets);
                                event.cards = [];
                            }
                            else event.finish();
                            'step 2'
                            if (event.targets.length == 0) event.goto(5);
                            else {
                                event.target = event.targets.shift();
                                event.target.chooseToDiscard('he', true, '奋驽：弃置一张牌作为"逸"').set('ai', function (card) {
                                    if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
                                        return 7 - get.value(card);
                                    }
                                    return -get.value(card);
                                });
                            }
                            'step 3'
                            if (result.bool && result.cards.length) event.cards.addArray(result.cards);
                            'step 4'
                            if (event.targets.length) event.goto(2);
                            else event.goto(5);
                            'step 5'
                            if (event.cards && event.cards.length) player.addToExpansion(event.cards, 'gain2').gaintag.add('clanfennu');
                        },
                        group: ['clanfennu_count', 'clanfennu_clear'],
                        subSkill: {
                            count: {
                                trigger: { player: 'useCardToPlayered' },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    var num = get.number(event.card, false);
                                    return event.isFirstTarget && num && typeof num == 'number' && player.getExpansions('clanfennu').length > 0;
                                },
                                content: function () {
                                    var num = get.number(trigger.card, false);
                                    if (num && typeof num == 'number') player.addMark('clanfennu_count', num, false);
                                },
                            },
                            clear: {
                                audio: 'clanfennu',
                                trigger: { player: 'phaseZhunbeiBegin' },
                                forced: true,
                                filter: function (event, player) {
                                    if (!player.getExpansions('clanfennu').length) return false;
                                    var num = 0;
                                    var cards = player.getExpansions('clanfennu');
                                    for (var i of cards) {
                                        var numx = get.number(i, false);
                                        if (numx && typeof numx == 'number') num += numx;
                                    }
                                    return player.countMark('clanfennu_count') > num;
                                },
                                content: function () {
                                    var cards = player.getExpansions('clanfennu');
                                    if (cards.length) player.gain(cards, 'gain2');
                                    player.clearMark('clanfennu_count', false);
                                },
                            },
                        },
                    },
                    //浑天仪
                    huntianyi_skill: {
                        equipSkill: true,
                        trigger: { player: 'damageBegin2' },
                        filter: function (event, player) {
                            if (event.source && event.source.hasSkillTag('unequip', false, {
                                name: event.card ? event.card.name : null,
                                target: player,
                                card: event.card,
                            })) return false;
                            return event.num > 0;
                        },
                        forced: true,
                        content: function () {
                            trigger.cancel();
                            var e = player.getEquip('huntianyi');
                            player.lose(e, "visible", ui.ordering);
                        },
                    },
                    //族荀彧
                    clandingan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'useCardAfter' },
                        filter: function (event, player, name) {
                            if (!game.hasPlayer(function (target) {
                                return !event.targets?.includes(target) && !player.getStorage('clandingan_used').includes(target);
                            })) return false;
                            return game.getGlobalHistory('useCard', function (evt) {
                                return evt.card.name == event.card.name;
                            }).indexOf(event) == 1 && !player.countMark('clandingan');
                        },
                        forced: true,
                        popup: false,
                        content: function () {
                            'step 0'
                            var str = '你与一名非目标角色各摸一张牌（每回合每名角色限一次）';
                            player.chooseTarget(true, get.prompt('clandingan'), str, function (card, player, target) {
                                return !player.getStorage('clandingan_used').includes(target) && !_status.event.targets?.contains(target);
                            }).set('ai', function (target) {
                                var player = _status.event.player, att = get.attitude(player, target);
                                var targetx = game.findPlayer(function (currentx) {
                                    return !game.hasPlayer(function (current) {
                                        return current.countCards('h') > currentx.countCards('h') && current != player;
                                    }) && currentx != player;
                                });
                                var num = targetx ? targetx.countCards('h') : 0;
                                if (target != player) {
                                    if (att > 0) {
                                        if (target.countCards('h') + 1 <= num) return att;
                                        return -Infinity;
                                    }
                                    else {
                                        if (target.countCards('h') + 1 >= num) return -att;
                                        return -Infinity;
                                    }
                                }
                                else return att;
                            }).set('targets', trigger.targets);
                            'step 1'
                            if (result.bool) {
                                player.logSkill('clandingan', result.targets[0]);
                                player.addTempSkill('clandingan_used');
                                player.markAuto('clandingan_used', [result.targets[0]]);
                                game.asyncDraw([player, result.targets[0]]);
                            }
                            else event.finish();
                            'step 2'
                            if (!game.hasPlayer(function (current) {
                                return current != player;
                            })) event.finish();
                            'step 3'
                            var str = '对手牌最多的其他角色造成一点伤害，或令其弃置手牌中最多的同名牌';
                            player.chooseTarget(true, get.prompt('clandingan'), str, function (card, player, target) {
                                return !game.hasPlayer(function (current) {
                                    return current.countCards('h') > target.countCards('h') && current != player;
                                }) && target != player;
                            }).set('ai', function (target) {
                                return -get.attitude(_status.event.player, target);
                            });
                            'step 4'
                            if (result.bool) {
                                event.target = result.targets[0];
                                var list = [
                                    ['damage', `受到你造成的一点伤害`],
                                    ['discard', `随机弃置手牌中最多的同名牌`],
                                ];
                                player.chooseButton([`定安：选择一项令` + get.translation(event.target) + `执行`, [list, 'textbutton']], true)
                                    .set('filterButton', function (button) {
                                        if (button.link == 'discard') return event.target.countCards('h') > 0;
                                        return true;
                                    })
                                    .set('ai', function (button) {
                                        var player = _status.event.player;
                                        switch (button.link) {
                                            case 'damage':
                                                return get.damageEffect(event.target, player, player);
                                                break;
                                            case 'discard':
                                                return Math.abs(get.attitude(_status.event.player, event.target)) * Math.sqrt(event.target.countCards('h'));
                                                break;
                                        }
                                    });
                            }
                            else event.finish();
                            'step 5'
                            if (result.bool) {
                                result.links.forEach(function (choice) {
                                    switch (choice) {
                                        case 'damage':
                                            event.target.damage(player);
                                            break;
                                        case 'discard':
                                            const nameNumMap = {};
                                            event.target.getCards('h').forEach(function (card) {
                                                const name = card.name;
                                                nameNumMap[name] = (nameNumMap[name] || 0) + 1;
                                            });
                                            const nums = Object.values(nameNumMap);
                                            const maxNum = nums.length ? Math.max(...nums) : 0;
                                            const maxNameList = Object.keys(nameNumMap).filter(name => nameNumMap[name] === maxNum);
                                            const cardname = maxNameList.randomGet();
                                            if (cardname) {
                                                const discards = event.target.getCards('h').filter((card) => card.name == cardname);
                                                if (discards?.length) event.target.discard(discards);
                                            }
                                            break;
                                    }
                                });
                            }
                            else event.finish();
                        },
                        group: ['clandingan_add', 'clandingan_remove'],
                        subSkill: {
                            used: { charlotte: true, onremove: true, intro: { content: '本回合已选择过：$' } },
                            add: {
                                trigger: { global: 'dyingAfter' },
                                forced: true,
                                popup: false,
                                content: function () {
                                    player.addMark('clandingan', false);
                                },
                            },
                            remove: {
                                trigger: { global: 'phaseBegin' },
                                forced: true,
                                popup: false,
                                content: function () {
                                    for (const i of game.filterPlayer().sortBySeat()) {
                                        if (i.hasMark('clandingan')) i.clearMark('clandingan', false);
                                    }
                                },
                            },
                        },
                    },
                    clanfuning: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: ['changeHp', 'loseMaxHpBegin'] },
                        direct: true,
                        filter: function (event, player, name) {
                            if (player.hasSkill('clanfuning_block')) return false;
                            if (name == 'changeHp') return true;
                            return !player.isDamaged();
                        },
                        content: function () {
                            'step 0'
                            event.num = Math.max(1, player.getDamagedHp());
                            player.addTempSkill('clanfuning_block', 'roundStart');
                            if (player.countCards('he') < event.num) event.finish();
                            'step 1'
                            event.numx = game.countPlayer(function (current) {
                                return current.getHistory('damage').length > 0;
                            });
                            var str = '抚宁：你可以将至少' + get.translation(event.num) + '张牌交给一名角色';
                            if (player.countCards('he') > event.numx) str += ('<br>（若你交给的牌数量大于' + get.translation(event.numx) + '，你将手牌调整至体力上限）');
                            player.chooseCardTarget({
                                position: 'he',
                                filterCard: true,
                                selectCard: [event.num, player.countCards('he')],
                                filterTarget: lib.filter.notMe,
                                ai1: function (card) {
                                    var player = _status.event.player;
                                    const color = get.color(card);
                                    if (!player.isDamaged() || ui.selected.cards.every((cardx) => get.color(cardx) == color)) {
                                        const numy = ui.selected.cards.length;
                                        const numz = player.countCards('h', (cardx) => !ui.selected.cards.includes(cardx));
                                        if (event.numx <= numy && numz > player.maxHp) return 15 - get.value(card);
                                        return 10 - get.value(card);
                                    }
                                    return 3 - get.value(card);
                                },
                                ai2: function (target) {
                                    var att = get.attitude(_status.event.player, target);
                                    if (target.hasSkillTag('nogain')) att /= 10;
                                    if (target.hasJudge('lebu')) att /= 5;
                                    return att;
                                },
                                prompt: str,
                            });
                            'step 2'
                            if (result.bool) {
                                player.logSkill('clanfuning', result.targets[0]);
                                player.give(result.cards, result.targets[0]);
                                var color = get.color(result.cards[0]);
                                if (result.cards.every(card => {
                                    return get.color(card) === color;
                                })) player.recover();
                                event.cards = result.cards;
                            }
                            else event.finish();
                            'step 3'
                            if (event.cards && event.cards.length > event.numx) {
                                const nums = player.countCards('h') - player.maxHp;
                                if (nums > 0) {
                                    const count = Math.min(nums, player.countDiscardableCards(player, 'h'));
                                    if (count > 0) player.chooseToDiscard('h', count, true);
                                }
                                else if (nums < 0) player.draw(-nums);
                            }
                        },
                        subSkill: {
                            block: { charlotte: true },
                        },
                    },
                    //族陆景
                    clantanfeng: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        mod: {
                            cardUsable: function (card, player, num) {
                                if (card.storage?.clantanfeng) return Infinity;
                            },
                        },
                        enable: 'phaseUse',
                        usable: 1,
                        viewAs: {
                            name: 'sha',
                            isCard: true,
                            storage: { clantanfeng: true },
                        },
                        locked: false,
                        filterCard: function () { return false },
                        selectCard: -1,
                        precontent: function () {
                            event.getParent().addCount = false;
                        },
                        ai: {
                            order: function () {
                                return get.order({ name: 'sha' }) + 0.1;
                            },
                            threaten: 1.14,
                            unequip: true,
                            unequip_ai: true,
                            skillTagFilter: function (player, tag, arg) {
                                if (arg && arg.name == 'sha' && arg.card && arg.card.storage && arg.card.storage.clantanfeng) return true;
                                return false;
                            },
                        },
                        group: 'clantanfeng_effect',
                        subSkill: {
                            effect: {
                                trigger: { player: 'useCardAfter' },
                                charlotte: true,
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.card.name == 'sha' && event.skill == 'clantanfeng' && event.targets?.length > 0;
                                },
                                content: function () {
                                    'step 0'
                                    var targets = trigger.targets.sortBySeat();
                                    event.targets = targets;
                                    event.num = 0;
                                    'step 1'
                                    var target = event.targets[num];
                                    if (target.isIn() && target != player) {
                                        if (!target.hasHistory('damage', (evt) => {
                                            return evt.card == trigger.card;
                                        })) {
                                            var next = game.createEvent('clantanfeng_effect');
                                            next.player = player;
                                            next.target = target;
                                            next.setContent(lib.skill.clantanfeng_effect.contentx);
                                        }
                                        else {
                                            var numx = Math.abs(player.countCards('e') - target.countCards('e'));
                                            if (numx > 0) player.draw(numx);
                                        }
                                    }
                                    event.num++;
                                    if (event.num < targets.length) event.redo();
                                },
                                contentx: function () {
                                    'step 0'
                                    var str = '探锋：是否视为对' + get.translation(player) + '使用一张【杀】？';
                                    if (target.canUse({
                                        name: 'sha',
                                        isCard: true,
                                    }, player, false)) target.chooseBool(str).set('choice', get.effect(player, { name: 'sha' }, target, target) > 0);
                                    'step 1'
                                    if (result.bool) target.useCard({
                                        name: 'sha',
                                        isCard: true,
                                    }, player, false);
                                },
                            },
                        },
                    },
                    clanjuewei: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { target: 'useCardToPlayered', player: 'useCardToPlayered' },
                        direct: true,
                        filter: function (event, player) {
                            return player.hasCard(function (card) {
                                return lib.filter.cardDiscardable(card, player, 'clanjuewei') && get.type(card, player) == 'equip';
                            }, 'he') && get.tag(event.card, 'damage') && !player.hasSkill('clanjuewei_block');
                        },
                        content: function () {
                            'step 0'
                            var card = trigger.card;
                            var list = [
                                [1, `重铸一张装备牌，` + get.translation(card) + `结算结束后，你视为对其中一个除你以外的目标使用` + get.translation(card)],
                                [2, `弃置一张装备牌，令` + get.translation(card) + `无效`],
                            ];
                            player.chooseButton([`〖绝围〗：你可以选择一项`, [list, 'textbutton']]).set('ai', function (button) {
                                var player = _status.event.player;
                                switch (button.link) {
                                    case 1:
                                        if (player == trigger.source) return 2;
                                        return 0.5;
                                        break;
                                    case 2:
                                        if (player != trigger.source && get.attitude(player, trigger.source) < 0) return 1;
                                        return 0;
                                        break;
                                }
                            }).set('filterButton', function (button) {
                                var player = _status.event.player;
                                if (button.link == 1) return game.hasPlayer(function (current) {
                                    return trigger.targets.contains(current) && current != player && player.canUse(card, current, false);
                                });
                                return true;
                            });
                            'step 1'
                            if (result.bool) {
                                player.addTempSkill('clanjuewei_block');
                                event.choice = result.links[0];
                                var str = (event.choice == 1 ? '重铸' : '弃置') + '一张装备牌';
                                player.chooseToDiscard(str, true, function (card) {
                                    return get.type(card) == 'equip';
                                }, 'he', get.prompt('clanjuewei')).set('ai', function (card) {
                                    return 7 - get.value(card);
                                }).logSkill = 'clanjuewei';
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                if (event.choice == 1) {
                                    player.draw();
                                    player.addTempSkill('clanjuewei_effect');
                                    player.storage.clanjuewei_effect = {
                                        card: trigger.card,
                                    }
                                }
                                else {
                                    trigger.all_excluded = true;
                                    trigger.targets.length = 0;
                                }
                            }
                            else event.finish();
                        },
                        subSkill: {
                            effect: {
                                onremove: function (player) {
                                    delete player.storage.clanjuewei_effect;
                                },
                                trigger: { global: 'useCardAfter' },
                                charlotte: true,
                                forced: true,
                                popup: false,
                                priority: 11,
                                filter: function (event, player) {
                                    var info = player.storage.clanjuewei_effect;
                                    return event.card && event.card == info.card && game.hasPlayer(function (current) {
                                        return event.targets?.contains(current) && current != player && player.canUse(event.card, current, false);
                                    });
                                },
                                content: function () {
                                    player.chooseUseTarget(trigger.card, '视为使用一张' + get.translation(trigger.card), true);
                                },
                            },
                            block: { charlotte: true },
                        },
                    },
                    //族陈群
                    clangezhi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'damageEnd' },
                        direct: true,
                        filter: function (event, player) {
                            if (!event.source || event.source == player || !event.source.countCards('he') || player.hasSkill('clangezhi_block')) return false;
                            return event.player && player.countCards('he') > 0 && (event.player == player || player.inRange(event.player));
                        },
                        content: function () {
                            'step 0'
                            event.cards = [];
                            var goon = (get.attitude(player, trigger.source) < 0);
                            var str = '弃置一张牌，然后弃置' + get.translation(trigger.source) + '一张牌';
                            player.chooseToDiscard(get.prompt('clangezhi'), str, 'he').set('ai', function (card) {
                                if (_status.event.goon) return 8 - get.value(card);
                                return 0;
                            }).set('goon', goon).logSkill = 'clangezhi';
                            'step 1'
                            if (result.bool) {
                                player.addTempSkill('clangezhi_block');
                                event.cardP = result.cards[0];
                                if (!event.cards.contains(event.cardP)) event.cards.push(event.cardP);
                                player.discardPlayerCard(trigger.source, true, 'he');
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                event.cardD = result.cards[0];
                                if (!event.cards.contains(event.cardD)) event.cards.push(event.cardD);
                                if (get.type2(event.cardP, false) != get.type2(event.cardD, false)) {
                                    switch (get.type2(event.cardP, false)) {
                                        case 'basic':
                                            player.addTempSkill('clangezhi_basic');
                                            player.storage.clangezhi_basic.add('basic');
                                            player.updateMarks('clangezhi_basic');
                                            break;
                                        case 'trick':
                                            player.addTempSkill('clangezhi_trick');
                                            player.storage.clangezhi_trick.add('trick');
                                            player.updateMarks('clangezhi_trick');
                                            break;
                                        case 'equip':
                                            player.addTempSkill('clangezhi_equip');
                                            player.storage.clangezhi_equip.add('equip');
                                            player.updateMarks('clangezhi_equip');
                                            break;
                                    }
                                    switch (get.type2(event.cardD, false)) {
                                        case 'basic':
                                            trigger.source.addTempSkill('clangezhi_basic');
                                            trigger.source.storage.clangezhi_basic.add('basic');
                                            trigger.source.updateMarks('clangezhi_basic');
                                            break;
                                        case 'trick':
                                            trigger.source.addTempSkill('clangezhi_trick');
                                            trigger.source.storage.clangezhi_trick.add('trick');
                                            trigger.source.updateMarks('clangezhi_trick');
                                            break;
                                        case 'equip':
                                            trigger.source.addTempSkill('clangezhi_equip');
                                            trigger.source.storage.clangezhi_equip.add('equip');
                                            trigger.source.updateMarks('clangezhi_equip');
                                            break;
                                    }
                                }
                            }
                            else event.finish();
                            'step 3'
                            if (_status.connectMode) game.broadcastAll(function () { _status.noclearcountdown = true });
                            event.given_map = {};
                            'step 4'
                            var str = '革制：请选择要分配的牌';
                            if (event.cards.length > 1) player.chooseCardButton(str, true, event.cards, [1, event.cards.length]).set('ai', function (button) {
                                if (ui.selected.buttons.length == 0) return 1;
                                return 0;
                            });
                            else if (event.cards.length == 1) event._result = { links: event.cards.slice(0), bool: true };
                            else event.finish();
                            'step 5'
                            if (result.bool) {
                                event.cards.removeArray(result.links);
                                event.togive = result.links.slice(0);
                                player.chooseTarget('选择一名角色获得' + get.translation(result.links), true).set('ai', function (target) {
                                    var att = get.attitude(_status.event.player, target);
                                    if (_status.event.enemy) return -att;
                                    else if (att > 0) return att / (1 + target.countCards('h'));
                                    else return att / 100;
                                }).set('enemy', get.value(event.togive[0], player, 'raw') < 0);
                            }
                            'step 6'
                            if (result.targets.length) {
                                var id = result.targets[0].playerid, map = event.given_map;
                                if (!map[id]) map[id] = [];
                                map[id].addArray(event.togive);
                            }
                            if (cards.length > 0) event.goto(4);
                            'step 7'
                            if (_status.connectMode) game.broadcastAll(function () { delete _status.noclearcountdown; game.stopCountChoose() });
                            var list = [];
                            for (var i in event.given_map) {
                                var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
                                player.line(source, 'green');
                                list.push([source, event.given_map[i]]);
                            }
                            game.loseAsync({
                                gain_list: list,
                                giver: player,
                                animate: 'draw',
                            }).setContent('gaincardMultiple');
                        },
                        subSkill: {
                            block: { charlotte: true },
                            basic: {
                                mark: true,
                                marktext: '革制',
                                intro: {
                                    content: '只能使用基本牌',
                                    markcount: '基本',
                                },
                                unique: true,
                                charlotte: true,
                                onremove: true,
                                init: function (player, skill) {
                                    if (!player.storage[skill]) player.storage[skill] = [];
                                },
                                mod: {
                                    cardEnabled: function (card, player) {
                                        if (!player.getStorage('clangezhi_basic').includes(get.type2(card))) return false;
                                    },
                                    cardSavable: function (card, player) {
                                        if (!player.getStorage('clangezhi_basic').includes(get.type2(card))) return false;
                                    },
                                },
                            },
                            trick: {
                                mark: true,
                                marktext: '革制',
                                intro: {
                                    content: '只能使用锦囊牌',
                                    markcount: '锦囊',
                                },
                                unique: true,
                                charlotte: true,
                                onremove: true,
                                init: function (player, skill) {
                                    if (!player.storage[skill]) player.storage[skill] = [];
                                },
                                mod: {
                                    cardEnabled: function (card, player) {
                                        if (!player.getStorage('clangezhi_trick').includes(get.type2(card))) return false;
                                    },
                                    cardSavable: function (card, player) {
                                        if (!player.getStorage('clangezhi_trick').includes(get.type2(card))) return false;
                                    },
                                },
                            },
                            equip: {
                                mark: true,
                                marktext: '革制',
                                intro: {
                                    content: '只能使用装备牌',
                                    markcount: '装备',
                                },
                                unique: true,
                                charlotte: true,
                                onremove: true,
                                init: function (player, skill) {
                                    if (!player.storage[skill]) player.storage[skill] = [];
                                },
                                mod: {
                                    cardEnabled: function (card, player) {
                                        if (!player.getStorage('clangezhi_equip').includes(get.type2(card))) return false;
                                    },
                                    cardSavable: function (card, player) {
                                        if (!player.getStorage('clangezhi_equip').includes(get.type2(card))) return false;
                                    },
                                },
                            },
                        },
                    },
                    clanmingdian: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'phaseUse',
                        position: 'h',
                        filter: function (event, player) {
                            return player.countCards('h', function (card) {
                                return !player.getStorage('clanmingdian_reset').contains(card.name) && get.type(card, false) == 'basic';
                            }) > 0;
                        },
                        filterCard: function (card, player) {
                            var name = get.name(card);
                            for (var i = 0; i < ui.selected.cards.length; i++) {
                                if (get.name(ui.selected.cards[i]) == name) return false;
                            }
                            return !player.getStorage('clanmingdian_reset').contains(name) && get.type(card, false) == 'basic';
                        },
                        complexCard: true,
                        selectCard: [1, Infinity],
                        check: function (card) {
                            return 6 - get.value(card);
                        },
                        content: function () {
                            'step 0'
                            player.chongzhu(cards);
                            var list = [];
                            player.getHistory('useCard', function (evt) {
                                if (evt.card && evt.card.name) list.add(evt.card.name);
                            });
                            player.addTempSkill('clanmingdian_reset', 'roundStart');
                            for (var i of cards) {
                                player.markAuto('clanmingdian_reset', [i.name]);
                                if (list.contains(i.name)) event.goon = true;
                            }
                            'step 1'
                            if (event.goon) {
                                var cardP = get.cardPile2(function (cardP) {
                                    return !player.countCards('h', function (card) {
                                        return card.name == cardP.name;
                                    }) && get.type(cardP, false) == 'basic';
                                });
                                if (cardP) player.gain(cardP, 'gain2');
                                else {
                                    var cardD = get.discardPile(function (cardD) {
                                        return !player.countCards('h', function (card) {
                                            return card.name == cardD.name;
                                        }) && get.type(cardD, false) == 'basic';
                                    });
                                    if (cardD) player.gain(cardD, 'gain2');
                                }
                            }
                        },
                        discard: false,
                        visible: true,
                        lose: false,
                        prompt: '重铸任意张基本牌（每轮每个牌名限一次）',
                        ai: {
                            order: 10,
                            result: {
                                player: 1,
                            },
                        },
                        group: 'clanmingdian_damage',
                        subSkill: {
                            damage: {
                                audio: 'clanmingdian',
                                trigger: { player: 'damageEnd' },
                                direct: true,
                                filter: function (event, player) {
                                    return player.countCards('h', function (card) {
                                        if (!lib.filter.cardDiscardable(card, player, 'clanmingdian')) return false;
                                        return !player.getStorage('clanmingdian_reset').contains(card.name) && get.type(card, false) == 'basic';
                                    }) > 0;
                                },
                                content: function () {
                                    'step 0'
                                    var str = '重铸任意张基本牌（每轮每个牌名限一次）';
                                    player.chooseToDiscard('h', get.prompt('clanmingdian'), [1, Infinity], str, function (card) {
                                        var player = _status.event.player;
                                        var name = get.name(card);
                                        for (var i = 0; i < ui.selected.cards.length; i++) {
                                            if (get.name(ui.selected.cards[i]) == name) return false;
                                        }
                                        return !player.getStorage('clanmingdian_reset').contains(name) && get.type(card, false) == 'basic';
                                    }).set('ai', function (card) {
                                        return 6 - get.value(card);
                                    }).set('complexCard', true).logSkill = 'clanmingdian_damage';
                                    'step 1'
                                    if (result.bool) {
                                        player.draw(result.cards.length);
                                        var list = [];
                                        player.getHistory('useCard', function (evt) {
                                            if (evt.card && evt.card.name) list.add(evt.card.name);
                                        });
                                        player.addTempSkill('clanmingdian_reset', 'roundStart');
                                        for (var i of result.cards) {
                                            player.markAuto('clanmingdian_reset', [i.name]);
                                            if (list.contains(i.name)) event.goon = true;
                                        }
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (event.goon) {
                                        var cardP = get.cardPile2(function (cardP) {
                                            return !player.countCards('h', function (card) {
                                                return card.name == cardP.name;
                                            }) && get.type(card, false) == 'basic';
                                        });
                                        if (cardP) player.gain(cardP, 'gain2');
                                        else {
                                            var cardD = get.discardPile(function (cardD) {
                                                return !player.countCards('h', function (card) {
                                                    return card.name == cardD.name;
                                                }) && get.type(card, false) == 'basic';
                                            });
                                            if (cardD) player.gain(cardD, 'gain2');
                                        }
                                    }
                                },
                            },
                            reset: {
                                charlotte: true,
                                onremove: true,
                                intro: { content: '已重铸的牌名：$' },
                            },
                        },
                    },
                    //族杨赐
                    clanqieyi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseUseBegin' },
                        frequent: true,
                        content: function () {
                            var cards = get.cards(2, true);
                            player.viewCards('切议：牌堆顶的两张牌', cards);
                            player.addTempSkill('clanqieyi_effect');
                        },
                        group: 'clanqieyi_record',
                        subSkill: {
                            effect: {
                                audio: 'clanqieyi',
                                init: function (player) {
                                    if (!player.storage.clanqieyi_effect) player.storage.clanqieyi_effect = 0;
                                },
                                onremove: function (player) {
                                    delete player.storage.clanqieyi_effect;
                                },
                                trigger: { player: 'useCardAfter' },
                                charlotte: true,
                                forced: true,
                                filter: function (event, player) {
                                    var suit = get.suit(event.card);
                                    if (!lib.suit.contains(suit)) return false;
                                    var evt = event.getParent('phaseUse');
                                    if (!evt || player != evt.player) return false;
                                    var list = [], history = player.getHistory('useCard');
                                    if (!history.length) return false;
                                    for (var i of history) {
                                        if (i.getParent('phaseUse') != evt) continue;
                                        var suit2 = get.suit(i.card);
                                        if (!lib.suit.contains(suit2)) continue;
                                        if (i != event && suit2 == suit) return false;
                                        list.add(suit2);
                                    }
                                    return list.length > 0 && list.length < 5;
                                },
                                content: function () {
                                    'step 0'
                                    player.storage.clanqieyi_effect++;
                                    event.card = get.cards()[0];
                                    game.cardsGotoOrdering(event.card);
                                    player.showCards(event.card, get.translation(player) + '发动了【切议】');
                                    if (get.color(event.card) == get.color(trigger.card)) {
                                        player.gain(event.card, 'gain2');
                                        event.finish();
                                    }
                                    else {
                                        player.loseToDiscardpile(event.card);
                                        if (!player.countCards('he')) event.finish();
                                        else player.chooseCard(true, 'he', '切议：将一张牌置于牌堆顶').set('ai', function (card) {
                                            return 9 - get.value(card);
                                        });
                                    }
                                    'step 1'
                                    if (result.bool) {
                                        player.$throw(result.cards, 1000);
                                        game.log(player, '将', result.cards, '置于牌堆顶');
                                        player.lose(result.cards, ui.cardPile, 'visible', 'insert');
                                    }
                                },
                            },
                            record: {
                                trigger: { player: 'useCard' },
                                firstDo: true,
                                forced: true,
                                silent: true,
                                filter: function (event, player) {
                                    if (!lib.suit.contains(get.suit(event.card))) return false;
                                    return !player.getStorage('clanqieyi_used').contains(get.suit(event.card));
                                },
                                content: function () {
                                    player.addTempSkill('clanqieyi_used');
                                    player.markAuto('clanqieyi_used', [get.suit(trigger.card)]);
                                },
                            },
                            used: { charlotte: true, onremove: true, intro: { content: '$' } },
                        },
                    },
                    clanjianzhi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseJieshuBegin' },
                        filter: function (event, player) {
                            return player.storage.clanqieyi_effect && player.storage.clanqieyi_effect > 0;
                        },
                        forced: true,
                        content: function () {
                            'step 0'
                            event.count = 0;
                            event.suits = [];
                            for (var i of player.getHistory('useCard', function (e) {
                                return e.cards && get.suit(e.card) !== 'none';
                            })) event.suits.add(get.suit(i.card));
                            'step 1'
                            event.count++;
                            player.judge();
                            'step 2'
                            if (!event.suits.contains(result.suit)) {
                                event.goon = true;
                                event.goto(4);
                            }
                            if (!event.suits.contains(result.suit)) event.goon = true;
                            else {
                                event.card = result.card;
                                var prompt = '将' + get.translation(event.card) + '交给一名角色';
                                player.chooseTarget(get.prompt('clanjianzhi'), prompt, true).set('ai', function (target) {
                                    return get.attitude(player, target);
                                });
                            }
                            'step 3'
                            if (result.bool && result.targets && result.targets.length) result.targets[0].gain(event.card, 'gain2');
                            'step 4'
                            if (event.count < player.storage.clanqieyi_effect) event.goto(1);
                            'step 5'
                            if (event.goon) player.damage('thunder', 'nosource');
                        },
                    },
                    //族韩馥
                    clanheta: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseUseBegin' },
                        frequent: true,
                        filter: function (event, player) {
                            return !player.isLinked();
                        },
                        content: function () {
                            player.link(true);
                            player.addTempSkill('clanheta_effect');
                        },
                        subSkill: {
                            effect: {
                                audio: 'clanheta',
                                trigger: { player: 'useCard1' },
                                filter: function (event, player) {
                                    if (!player.isLinked() || ['equip', 'delay'].includes(get.type(event.card))) return false;
                                    if (get.info(event.card)?.multitarget) return false;
                                    var targets = player.getHistory('useCard', function (evt) {
                                        return evt?.targets?.length && evt != event;
                                    }, event).map(function (evt) {
                                        return evt.targets ?? [];
                                    }).flat();
                                    return targets.some(function (target) {
                                        if (event.targets?.includes(target)) return true;
                                        return lib.filter.targetEnabled2(event.card, player, target);
                                    });
                                },
                                direct: true,
                                content: function () {
                                    'step 0'
                                    var targets = player.getHistory('useCard', function (evt) {
                                        return evt?.targets?.length && evt != event;
                                    }, trigger).map(function (evt) {
                                        return evt.targets ?? [];
                                    }).flat();
                                    var prompt2 = '为' + get.translation(trigger.card) + '增加或减少任意名目标（须选择本回合此前你对其使用过牌的角色，且无距离限制）';
                                    player.chooseTarget([1, Infinity], get.prompt('clanheta_effect'), function (card, player, target) {
                                        var player = _status.event.player;
                                        if (_status.event.targets.contains(target)) return _status.event.list.contains(target);
                                        return lib.filter.targetEnabled2(_status.event.card, player, target) && _status.event.list.contains(target);
                                    }).set('prompt2', prompt2).set('ai', function (target) {
                                        var trigger = _status.event.getTrigger();
                                        var player = _status.event.player;
                                        return get.effect(target, trigger.card, player, player) * (_status.event.targets.contains(target) ? -1 : 1);
                                    }).set('targets', trigger.targets).set('card', trigger.card).set('targetprompt', function (target) {
                                        if (_status.event.targets.contains(target)) return '取消目标';
                                        return '成为目标';
                                    }).set('list', targets);
                                    'step 1'
                                    if (result.bool) {
                                        if (!event.isMine() && !event.isOnline()) game.delayx();
                                        event.targets = result.targets;
                                        event.gain = [];
                                        event.lose = [];
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (event.targets) {
                                        player.logSkill('clanheta_effect', event.targets);
                                        player.link(false);
                                        for (var i = 0; i < event.targets.length; i++) {
                                            if (trigger.targets.contains(event.targets[i])) event.lose.add(event.targets[i]);
                                            else event.gain.add(event.targets[i]);
                                        }
                                    }
                                    'step 3'
                                    if (event.gain.length) trigger.targets.addArray(event.gain);
                                    if (event.lose.length) trigger.targets.removeArray(event.lose);
                                },
                            },
                        },
                    },
                    olyingxiang: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        isOlyingxiang: function (card) {
                            var info = lib.card[card.name];
                            if (!info || info.type != 'trick') return false;
                            if (info.notarget) return true;
                            if (info.selectTarget != undefined) {
                                if (Array.isArray(info.selectTarget)) {
                                    if (info.selectTarget[0] < 0) return !info.toself;
                                    return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
                                }
                                else {
                                    if (info.selectTarget < 0) return !info.toself;
                                    return info.selectTarget != 1;
                                }
                            }
                            return false;
                        },
                        trigger: { player: 'phaseUseEnd' },
                        direct: true,
                        filter: function (event, player) {
                            return player.countCards('h') > 0 && game.hasPlayer(function (current) {
                                return current != player && player.canCompare(current);
                            });
                        },
                        content: function () {
                            'step 0'
                            var list = [];
                            for (var i = 0; i < lib.inpile.length; i++) {
                                var name = lib.inpile[i];
                                if (name == 'sha') {
                                    list.push(['基本', '', 'sha']);
                                    for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
                                }
                                else if (get.type(name) == 'trick' && !lib.skill.olyingxiang.isOlyingxiang(name)) list.push(['锦囊', '', name]);
                                else if (get.type(name) == 'basic') list.push(['基本', '', name]);
                            }
                            player.chooseButton(['迎乡：声明一张基本牌或单目标普通锦囊牌并拼点', [list, 'vcard']]).set('ai', function (button) {
                                return _status.event.player.getUseValue({ name: button.link[2], nature: button.link[3] });
                            });
                            'step 1'
                            if (result.bool) {
                                event.card = {
                                    name: result.links[0][2],
                                    nature: result.links[0][3],
                                    isCard: true,
                                }
                                game.log(player, '声明了', event.card);
                                player.chooseTarget(true, get.prompt2('olyingxiang'), function (card, player, target) {
                                    return player.canCompare(target);
                                }).set('ai', function (target) {
                                    return -get.attitude(_status.event.player, target) / target.countCards('h');
                                });
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target = target;
                                player.logSkill('olyingxiang', target);
                                player.chooseToCompare(target);
                            }
                            else event.finish();
                            'step 3'
                            if (!result.tie) {
                                var winner = result.bool ? player : event.target;
                                if (winner.hasUseTarget(event.card)) winner.chooseUseTarget(event.card, true);
                                var cards = [];
                                game.getGlobalHistory('cardMove', function (evt) {
                                    if (evt.getParent(3) == event) cards.addArray(evt.cards);
                                });
                                event.winner = winner;
                                if (cards.length) event.cards = cards;
                                else event.finish();
                            }
                            else event.finish();
                            'step 4'
                            if (event.cards.some(function (card) { return card.name == event.card.name })) {
                                player.restoreSkill('clanxumin');
                                game.log(player, '重置了', '#g【恤民】');
                                event.finish();
                            }
                            else {
                                var cardsx = event.cards.filter(function (card) { return get.position(card, true) == 'od' });
                                if (cardsx.length) player.gain(cardsx, 'gain2');
                                var skills = player.getSkills(null, false, false).filter(function (skill) {
                                    var info = get.info(skill);
                                    if (!info || get.is.empty(info) || info.charlotte) return false;
                                    return true;
                                });
                                player.chooseControl(skills).set('choiceList', skills.map(function (i) {
                                    return '<div class="skill">【' + get.translation(lib.translate[i + '_ab'] || get.translation(i).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(i, player) + '</div>';
                                })).set('displayIndex', false).set('prompt', '迎乡：失去一个技能').set('ai', function () {
                                    var choices = _status.event.controls.slice();
                                    var value = (skill) => get.skillRank(skill, 'in') + get.skillRank(skill, 'out');
                                    choices = choices.map(skill => [skill, value(skill)]);
                                    var list = choices.sort((a, b) => a[1] - b[1])[0];
                                    if (list[1] < 2) return list[0];
                                    else {
                                        if (_status.event.controls.contains('clanxumin')) return 'clanxumin';
                                        return list[0];
                                    }
                                });
                            }
                            'step 5'
                            player.removeSkill(result.control);
                            player.popup(result.control);
                            game.log(player, '失去了技能', '#g【' + get.translation(result.control) + '】');
                        },
                    },
                    //族荀爽
                    clanyangji: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseZhunbeiBegin' },
                        direct: true,
                        filter: function (event, player) {
                            return player.countCards('hs') > 0;
                        },
                        content: function () {
                            'step 0'
                            player.chooseToUse({
                                filterCard: function (card, player, event) {
                                    return lib.filter.filterCard.apply(this, arguments) && get.itemtype(card) == 'card';
                                },
                                position: 'hs',
                                prompt: '请选择使用一张牌',
                                complexSelect: true,
                                addCount: false,
                                ai1: function (card) {
                                    return get.order(card);
                                }
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('clanyangji');
                                if (player.countCards('hes', { suit: 'spade' }) > 0 && !player.hasHistory('sourceDamage', function (evt) {
                                    return evt.getParent(4) === event;
                                })) {
                                    var prompt2 = '将一张♠牌当【乐不思蜀】置入' + get.translation(_status.currentPhase) + '的判定区';
                                    player.chooseCard(get.prompt('clanyangji'), 'hes', { suit: 'spade' }, prompt2).set('ai', function (card) {
                                        var target = _status.currentPhase;
                                        if (!target || target == player) return -1;
                                        return get.effect(target, { name: 'lebu' }, player, player);
                                    });
                                }
                                else event.finish();
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool && result.cards) {
                                var target = _status.currentPhase;
                                if (target && target.canAddJudge('lebu')) {
                                    player.line(target, 'green');
                                    target.addJudge({ name: 'lebu' }, result.cards);
                                }
                            }
                        },
                        group: 'clanyangji_change',
                        subSkill: {
                            change: {
                                trigger: { player: 'changeHp' },
                                firstDo: true,
                                charlotte: true,
                                forced: true,
                                silent: true,
                                popup: false,
                                content: function () {
                                    player.addTempSkill('clanyangji_buff', { global: ['phaseZhunbeiAfter', 'phaseJudgeAfter', 'phaseDrawAfter', 'phaseUseAfter', 'phaseDiscardAfter', 'phaseJieshuAfter'] });
                                },
                            },
                            buff: {
                                trigger: { global: ['phaseZhunbeiEnd', 'phaseJudgeEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd', 'phaseJieshuEnd'] },
                                charlotte: true,
                                direct: true,
                                filter: function (event, player) {
                                    return player.countCards('hs') > 0;
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseToUse({
                                        filterCard: function (card, player, event) {
                                            return lib.filter.filterCard.apply(this, arguments) && get.itemtype(card) == 'card';
                                        },
                                        position: 'hs',
                                        prompt: '请选择使用一张牌',
                                        complexSelect: true,
                                        addCount: false,
                                        ai1: function (card) {
                                            return get.order(card);
                                        }
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('clanyangji');
                                        if (player.countCards('hes', { suit: 'spade' }) > 0 && !player.hasHistory('sourceDamage', function (evt) {
                                            return evt.getParent(4) === event;
                                        })) {
                                            var prompt2 = '将一张♠牌当【乐不思蜀】置入' + get.translation(_status.currentPhase) + '的判定区';
                                            player.chooseCard(get.prompt('clanyangji'), 'hes', { suit: 'spade' }, prompt2).set('ai', function (card) {
                                                var target = _status.currentPhase;
                                                if (!target || target == player) return -1;
                                                return get.effect(target, { name: 'lebu' }, player, player);
                                            });
                                        }
                                        else event.finish();
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (result.bool && result.cards) {
                                        var target = _status.currentPhase;
                                        if (target && target.canAddJudge('lebu')) {
                                            player.line(target, 'green');
                                            target.addJudge({ name: 'lebu' }, result.cards);
                                        }
                                    }
                                },
                            },
                        },
                    },
                    clandandao: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'judgeEnd' },
                        forced: true,
                        content: function () {
                            player.disableTempSkill('clandandao');
                            _status.currentPhase.addTempSkill('clandandao_more');
                            _status.currentPhase.addMark('clandandao_more', 1, false);
                        },
                        subSkill: {
                            more: {
                                charlotte: true,
                                onremove: true,
                                mod: {
                                    maxHandcard: function (player, num) {
                                        return num + player.countMark('clandandao_more');
                                    },
                                },
                                intro: {
                                    markcount: function (storage, player) {
                                        return '[+' + player.countMark('clandandao_more') + ']';
                                    },
                                    content: '手牌上限+#',
                                },
                            },
                        },
                    },
                    clanqingli: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'phaseEnd' },
                        forced: true,
                        filter: function (event, player) {
                            return player.countCards('h') < Math.min(player.getHandcardLimit(), 5);
                        },
                        content: function () {
                            player.drawTo(Math.min(player.getHandcardLimit(), 5));
                        },
                    },
                    //族杨彪
                    clanjiannan: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseUseBegin' },
                        frequent: true,
                        content: function () {
                            player.draw(2);
                            player.addTempSkill('clanjiannan_buff', 'phaseUseAfter');
                        },
                        global: 'clanjiannan_mark',
                        subSkill: {
                            buff: {
                                audio: 'clanjiannan',
                                trigger: { global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter', 'loseAfter'] },
                                direct: true,
                                filter: function (event, player) {
                                    if (player.getStorage('clanjiannan_used').length >= 4) return false;
                                    return game.hasPlayer(function (current) {
                                        var evt = event.getl(current);
                                        if (!evt || !evt.hs || !evt.hs.length) return false;
                                        if (!current.countCards('h') && !_status.dying.length) return true;
                                        if (event.name == 'lose') {
                                            for (var i in event.gaintag_map) {
                                                if (event.gaintag_map[i].contains('clanjiannan_tag') && !current.countCards('h', function (card) {
                                                    return card.hasGaintag('clanjiannan_tag');
                                                }) && !_status.dying.length) return true;
                                            }
                                            return false;
                                        }
                                        return current.hasHistory('lose', function (evt) {
                                            if (event != evt.getParent()) return false;
                                            for (var i in evt.gaintag_map) {
                                                if (evt.gaintag_map[i].contains('clanjiannan_tag') && !current.countCards('h', function (card) {
                                                    return card.hasGaintag('clanjiannan_tag');
                                                }) && !_status.dying.length) return true;
                                            }
                                            return false;
                                        });
                                    });
                                },
                                content: function () {
                                    'step 0'
                                    var list = [
                                        [1, `弃置两张牌`],
                                        [2, `摸两张牌`],
                                        [3, `重铸所有装备牌`],
                                        [4, `将一张锦囊牌置于牌堆顶或失去一点体力`],
                                    ];
                                    player.chooseButton([`间难：你令一名角色执行一项`, [list, 'textbutton']]).set('ai', function (button) {
                                        return Math.random();
                                    }).set('forced', true).set('filterButton', function (button) {
                                        return !player.getStorage('clanjiannan_used').contains(button.link);
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        player.addTempSkill('clanjiannan_used');
                                        player.markAuto('clanjiannan_used', [result.links[0]]);
                                        event.choice = result.links[0];
                                        var prompt, ai;
                                        switch (result.links[0]) {
                                            case 1:
                                                prompt = '令一名角色弃置两张牌';
                                                ai = function (target) {
                                                    var player = _status.event.player;
                                                    var eff1 = get.effect(target, { name: 'guohe_copy2' }, player, player);
                                                    var eff2 = Math.sqrt(Math.min(2, target.countCards('he')));
                                                    return eff1 * eff2;
                                                }
                                                break;
                                            case 2:
                                                prompt = '令一名角色摸两张牌';
                                                ai = function (target) {
                                                    var player = _status.event.player;
                                                    return get.effect(target, { name: 'wuzhong' }, player, player);
                                                }
                                                break;
                                            case 3:
                                                prompt = '令一名角色重铸所有装备牌';
                                                ai = function (target) {
                                                    var player = _status.event.player;
                                                    return -get.attitude(player, target);
                                                }
                                                break;
                                            case 4:
                                                prompt = '令一名角色将一张锦囊牌置于牌堆顶或失去一点体力';
                                                ai = function (target) {
                                                    var player = _status.event.player;
                                                    var eff1 = get.effect(target, { name: 'losehp' }, player, player);
                                                    var eff2 = get.effect(target, { name: 'guohe_copy' }, player, player);
                                                    return eff1 + eff2;
                                                }
                                                break;
                                            default:
                                                event.finish();
                                                return;
                                        }
                                        event.num = result.links[0] + 2;
                                        player.chooseTarget(true, get.prompt('clanjiannan'), prompt).set('ai', ai);
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        player.logSkill('clanjiannan', target);
                                        event.target = target;
                                        event.goto(num);
                                    }
                                    else event.finish();
                                    'step 3'
                                    target.chooseToDiscard(2, 'he', true);
                                    event.finish();
                                    'step 4'
                                    target.draw(2);
                                    event.finish();
                                    'step 5'
                                    var cards = target.getCards('he', function (card) {
                                        return get.type(card) == 'equip';
                                    });
                                    if (cards.length) {
                                        target.loseToDiscardpile(cards);
                                        target.draw(cards.length);
                                    }
                                    event.finish();
                                    'step 6'
                                    if (!target.countCards('h', function (card) {
                                        return get.type2(card) == 'trick';
                                    })) event._result = { bool: false };
                                    else target.chooseCard('h', function (card) {
                                        return get.type2(card) == 'trick';
                                    }, '间难：将一张锦囊牌置于牌堆顶或失去一点体力').set('ai', function (card) {
                                        return 9 - get.value(card);
                                    });
                                    'step 7'
                                    if (result.bool) {
                                        target.$throw(result.cards, 1000);
                                        game.log(target, '将', result.cards, '置于牌堆顶');
                                        target.lose(result.cards, ui.cardPile, 'visible', 'insert');
                                    }
                                    else target.loseHp();
                                },
                            },
                            used: { charlotte: true, onremove: true, intro: { content: '已执行的选项：$' } },
                            mark: {
                                trigger: { player: 'gainBegin' },
                                forced: true,
                                charlotte: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.getParent(2).name == 'clanjiannan' || event.getParent(2).name == 'clanjiannan_buff';
                                },
                                content: function () {
                                    player.addTempSkill('clanjiannan_tag');
                                    trigger.gaintag.add('clanjiannan_tag');
                                },
                            },
                            tag: {
                                charlotte: true,
                                onremove: function (player) {
                                    player.removeGaintag('clanjiannan_tag');
                                },
                            },
                        },
                    },
                    clanyichi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseJieshuBegin' },
                        direct: true,
                        filter: function (event, player) {
                            return player.countCards('h') > 0 && game.hasPlayer(function (current) {
                                return current != player && player.canCompare(current);
                            });
                        },
                        content: function () {
                            'step 0'
                            event.num = player.getStorage('clanjiannan_used').length;
                            player.chooseTarget(get.prompt2('clanyichi'), function (card, player, target) {
                                return player.canCompare(target);
                            }).set('ai', function (target) {
                                if (event.num > 0 && event.num <= 2) return get.attitude(_status.event.player, target) / target.countCards('h');
                                return -get.attitude(_status.event.player, target) / target.countCards('h');
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target = target;
                                player.logSkill('clanyichi', target);
                                player.chooseToCompare(target);
                            }
                            else event.finish();
                            'step 2'
                            if (!result.bool || event.num <= 0) event.finish();
                            'step 3'
                            target.chooseToDiscard(2, 'he', true);
                            if (event.num <= 1) event.finish();
                            'step 4'
                            target.draw(2);
                            if (event.num <= 2) event.finish();
                            'step 5'
                            var cards = target.getCards('he', function (card) {
                                return get.type(card) == 'equip';
                            });
                            if (cards.length) {
                                target.loseToDiscardpile(cards);
                                target.draw(cards.length);
                            }
                            if (event.num <= 3) event.finish();
                            'step 6'
                            if (!target.countCards('h', function (card) {
                                return get.type2(card) == 'trick';
                            })) event._result = { bool: false };
                            else target.chooseCard('h', function (card) {
                                return get.type2(card) == 'trick';
                            }, '间难：将一张锦囊牌置于牌堆顶或失去一点体力').set('ai', function (card) {
                                return 9 - get.value(card);
                            });
                            'step 7'
                            if (result.bool) {
                                target.$throw(result.cards, 1000);
                                game.log(target, '将', result.cards, '置于牌堆顶');
                                target.lose(result.cards, ui.cardPile, 'visible', 'insert');
                            }
                            else target.loseHp();
                        },
                    },
                    //族杨众
                    clanjuetu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseDiscardBegin' },
                        filter: function (event, player) {
                            return player.countCards('h') > 0;
                        },
                        direct: true,
                        forced: true,
                        content: function () {
                            'step 0'
                            var suits = [];
                            for (var i of lib.suit) {
                                if (player.countCards('h', { suit: i }) > 0) suits.push(i);
                            }
                            var str = '保留手牌中的一张' + get.translation(suits) + '的牌';
                            player.chooseCard(get.prompt('clanjuetu'), suits.length, 'h', str, true, function (card) {
                                var suit = get.suit(card);
                                for (var i = 0; i < ui.selected.cards.length; i++) {
                                    if (get.suit(ui.selected.cards[i]) == suit) return false;
                                }
                                return true;
                            }).set('ai', function (card) {
                                return 8 - get.value(card);
                            }).set('complexCard', true);
                            'step 1'
                            if (result.bool) {
                                player.logSkill('clanjuetu');
                                var discards = player.getCards('h').filter(function (card) { return !result.cards.includes(card) });
                                if (discards.length > 0) player.loseToDiscardpile(discards);
                            }
                            else event.finish();
                            'step 2'
                            var prompt2 = '令一名角色弃置一张手牌';
                            player.chooseTarget(true, get.prompt('clanjuetu'), prompt2, function (card, player, target) {
                                return target.countCards('h') > 0;
                            }).set('ai', function (target) {
                                return -get.attitude(_status.event.player, target);
                            });
                            'step 3'
                            if (result.bool) {
                                event.target = result.targets[0];
                                event.target.chooseToDiscard('h', true);
                            }
                            else event.finish();
                            'step 4'
                            if (result.bool) {
                                if (!player.countCards('h', { suit: get.suit(result.cards[0]) })) event.target.damage();
                            }
                        },
                    },
                    clankudu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'phaseJieshuBegin' },
                        direct: true,
                        limited: true,
                        skillAnimation: true,
                        animationColor: 'metal',
                        filter: function (event, player) {
                            var numbers = [];
                            for (var i of player.getCards('he')) numbers.add(get.number(i, false));
                            return numbers.length > 1;
                        },
                        content: function () {
                            'step 0'
                            player.chooseCardTarget({
                                filterCard: function (card) {
                                    var number = get.number(card);
                                    for (var i = 0; i < ui.selected.cards.length; i++) {
                                        if (get.number(ui.selected.cards[i]) == number) return false;
                                    }
                                    return true;
                                },
                                complexCard: true,
                                position: 'he',
                                selectCard: 2,
                                filterTarget: true,
                                ai1: function (card) {
                                    return 7 - get.value(card);
                                },
                                ai2: function (target) {
                                    return get.attitude(_status.event.player, target);
                                },
                                prompt: get.prompt2('clankudu'),
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('clankudu', result.targets[0]);
                                player.awakenSkill('clankudu');
                                player.chongzhu(result.cards);
                                var num = Math.min(5, Math.abs(get.number(result.cards[0]) - get.number(result.cards[1])));
                                result.targets[0].addSkill('clankudu_draw');
                                result.targets[0].addMark('clankudu_draw', num, false);
                            }
                            else event.finish();
                        },
                        subSkill: {
                            draw: {
                                onremove: function (player) {
                                    player.logSkill('clankudu');
                                    player.clearMark('clankudu_draw', false);
                                    player.insertPhase();
                                },
                                intro: {
                                    markcount: function (storage, player) {
                                        return '[' + player.countMark('clankudu_draw') + ']';
                                    },
                                    content: '#回合结束后执行一个额外的回合',
                                },
                                trigger: { player: 'phaseEnd' },
                                charlotte: true,
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return player.countMark('clankudu_draw') > 0;
                                },
                                content: function () {
                                    'step 0'
                                    player.removeMark('clankudu_draw', 1, false);
                                    player.draw();
                                    'step 1'
                                    if (!player.countMark('clankudu_draw')) player.removeSkill('clankudu_draw');
                                },
                            },
                        },
                    },
                    //族王明山
                    clantanque: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'useCardAfter' },
                        getLastUsed: function (player, event) {
                            var history = player.getAllHistory('useCard');
                            var index;
                            if (event) index = history.indexOf(event) - 1;
                            else index = history.length - 1;
                            if (index >= 0) return history[index];
                            return false;
                        },
                        direct: true,
                        usable: 1,
                        filter: function (event, player) {
                            var evt = lib.skill.clantanque.getLastUsed(player, event);
                            if (!evt || !evt.card) return false;
                            if (typeof get.number(evt.card, false) != 'number' || typeof get.number(event.card, false) != 'number') return false;
                            var num = Math.abs(get.number(evt.card, false) - get.number(event.card, false));
                            return game.hasPlayer(function (current) {
                                return current.hp == num || current.countCards('h') == num;
                            });
                        },
                        content: function () {
                            'step 0'
                            var evt = lib.skill.clantanque.getLastUsed(player, trigger);
                            var num = Math.abs(get.number(evt.card, false) - get.number(trigger.card, false));
                            var prompt = '对一名体力值或手牌数为' + get.translation(num) + '的角色造成一点伤害';
                            player.chooseTarget(get.prompt('clantanque'), prompt, function (card, player, target) {
                                return target.hp == _status.event.num || target.countCards('h') == _status.event.num;
                            }).set('ai', function (target) {
                                var player = _status.event.player;
                                return get.damageEffect(target, player, player);
                            }).set('num', num);
                            'step 1'
                            if (result.bool && result.targets && result.targets.length) {
                                player.logSkill('clantanque', result.targets);
                                player.line(result.targets[0], 'water');
                                result.targets[0].damage();
                            }
                            else player.storage.counttrigger.clantanque--;
                        },
                    },
                    clanshengmo: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'chooseToUse',
                        filter: function (event, player) {
                            var numbers = [];
                            var cards = [];
                            game.getGlobalHistory('cardMove', function (evt) {
                                if (evt.name == 'lose' && evt.position == ui.discardPile || evt.name == 'cardsDiscard') {
                                    cards.addArray(evt.cards.filterInD('d'));
                                    for (var i of evt.cards.filterInD('d')) {
                                        if (!player.getStorage('clanshengmo_count').contains(get.number(i))) numbers.add(get.number(i));
                                    }
                                }
                            });
                            for (var name of lib.inpile) {
                                if (get.type2(name) != 'basic') continue;
                                if (player.getStorage('clanshengmo').contains(name)) continue;
                                var card = { name: name };
                                if (event.filterCard(card, player, event)) return cards.length > 0 && numbers.length > 0;
                                if (name == 'sha') {
                                    for (var nature of lib.inpile_nature) {
                                        card.nature = nature;
                                        if (event.filterCard(card, player, event)) return cards.length > 0 && numbers.length > 0;
                                    }
                                }
                            }
                            return false;
                        },
                        round: 1,
                        chooseButton: {
                            dialog: function (event, player) {
                                var list = [];
                                for (var name of lib.inpile) {
                                    if (player.getStorage('clanshengmo').contains(name)) continue;
                                    if (name == 'sha') {
                                        if (event.filterCard({
                                            name: name
                                        }, player, event)) list.push(['基本', '', 'sha']);
                                        for (var nature of lib.inpile_nature) {
                                            if (event.filterCard({
                                                name: name,
                                                nature: nature
                                            }, player, event)) list.push(['基本', '', 'sha', nature]);
                                        }
                                    }
                                    else if (get.type(name) == 'basic' && event.filterCard({
                                        name: name
                                    }, player, event)) list.push(['基本', '', name]);
                                }
                                return ui.create.dialog('剩墨', [list, 'vcard']);
                            },
                            filter: function (button, player) {
                                return _status.event.getParent().filterCard({
                                    name: button.link[2],
                                    nature: button.link[3]
                                }, player, _status.event.getParent());
                            },
                            check: function (button) {
                                if (_status.event.getParent().type != 'phase') return 1;
                                var player = _status.event.player;
                                return player.getUseValue({
                                    name: button.link[2],
                                    nature: button.link[3],
                                });
                            },
                            backup: function (links, player) {
                                return {
                                    audio: 'clanshengmo',
                                    filterCard: function () { return false },
                                    selectCard: -1,
                                    popname: true,
                                    viewAs: {
                                        name: links[0][2],
                                        nature: links[0][3],
                                    },
                                    precontent: function () {
                                        'step 0'
                                        delete event.result.skill;
                                        player.markAuto('clanshengmo', [event.result.card.name]);
                                        event.discards = [];
                                        game.getGlobalHistory('cardMove', function (evt) {
                                            if (evt.name == 'lose' && evt.position == ui.discardPile || evt.name == 'cardsDiscard') {
                                                event.discards.addArray(evt.cards.filterInD('d'));
                                            }
                                        });
                                        if (!event.discards.length) {
                                            event.result.skill = 'clanshengmo_backup';
                                            event.finish();
                                            event.result.bool = false;
                                            event.getParent(2).goto(0);
                                            return;
                                        }
                                        else player.chooseButton(['剩墨：获得一张牌', event.discards]).set('forced', true).set('ai', function (button) {
                                            return _status.event.player.getUseValue(button.link) + 1;
                                        }).set('filterButton', function (button) {
                                            return !_status.event.player.getStorage('clanshengmo_count').contains(get.number(button.link));
                                        });
                                        'step 1'
                                        if (result.bool) {
                                            var card = result.links[0];
                                            player.gain(card, 'gain2');
                                            player.markAuto('clanshengmo_count', [get.number(card)]);
                                            for (var i of event.discards) {
                                                if (get.number(i) > get.number(card) || get.number(card) > get.number(i)) event.goon = true;
                                            }
                                            if (!event.goon) {
                                                event.finish();
                                                event.result.bool = false;
                                                var evt = event.getParent(2);
                                                evt.set('clanshengmo', true);
                                                evt.goto(0);
                                                return;
                                            }
                                        }
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                var player = _status.event.player;
                                return '从弃牌堆中获得一张本回合置入弃牌堆的牌并视为使用' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]);
                            },
                        },
                        hiddenCard: function (player, name) {
                            if (!lib.inpile.contains(name)) return false;
                            if (player.getStorage('clanshengmo').contains(name)) return false;
                            var numbers = [];
                            var cards = [];
                            game.getGlobalHistory('cardMove', function (evt) {
                                if (evt.name == 'lose' && evt.position == ui.discardPile || evt.name == 'cardsDiscard') {
                                    cards.addArray(evt.cards.filterInD('d'));
                                    for (var i of evt.cards.filterInD('d')) {
                                        if (!player.getStorage('clanshengmo_count').contains(get.number(i))) numbers.add(get.number(i));
                                    }
                                }
                            });
                            var type = get.type2(name);
                            return type == 'basic' && cards.length > 0 && numbers.length > 0;
                        },
                        ai: {
                            fireAttack: true,
                            respondSha: true,
                            respondShan: true,
                            skillTagFilter: function (player, tag, arg) {
                                if (tag == 'fireAttack') return true;
                                if (player.getStorage('clanshengmo').contains(name)) return false;
                                var numbers = [];
                                var cards = [];
                                game.getGlobalHistory('cardMove', function (evt) {
                                    if (evt.name == 'lose' && evt.position == ui.discardPile || evt.name == 'cardsDiscard') {
                                        cards.addArray(evt.cards.filterInD('d'));
                                        for (var i of evt.cards.filterInD('d')) {
                                            if (!player.getStorage('clanshengmo_count').contains(get.number(i))) numbers.add(get.number(i));
                                        }
                                    }
                                });
                                if (cards.length > 0 && numbers.length > 0) {
                                    if (tag == 'respondSha') {
                                        if (arg != 'use') return false;
                                        if (player.getStorage('clanshengmo').contains('sha')) return false;
                                    }
                                    else if (tag == 'respondShan') {
                                        if (player.getStorage('clanshengmo').contains('shan')) return false;
                                    }
                                }
                                else return false;
                            },
                            order: 10,
                            result: {
                                player: function (player) {
                                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                                    return 1;
                                },
                            },
                        },
                        subSkill: {
                            count: { charlotte: true, intro: { content: '已获得的点数：$' } },
                        },
                    },
                    //族陈泰
                    clanfenjian: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'phaseUse',
                        filter: function (event, player) {
                            if (player.countCards('he') > 0 && !player.hasSkill('clanfenjian_lt') && game.hasPlayer(current => {
                                return current != player && current.getAttackRange() < player.getAttackRange();
                            })) return true;
                            if (player.countCards('he') > 0 && !player.hasSkill('clanfenjian_eq') && game.hasPlayer(current => {
                                return current != player && current.getAttackRange() == player.getAttackRange();
                            })) return true;
                            if (player.countCards('he') > 0 && !player.hasSkill('clanfenjian_gt') && game.hasPlayer(current => {
                                return current != player && current.getAttackRange() > player.getAttackRange();
                            })) return true;
                            return false;
                        },
                        position: 'he',
                        filterTarget: function (card, player, target) {
                            if (player.hasSkill('clanfenjian_lt') && target.getAttackRange() < player.getAttackRange()) return false;
                            if (player.hasSkill('clanfenjian_eq') && target.getAttackRange() == player.getAttackRange()) return false;
                            if (player.hasSkill('clanfenjian_gt') && target.getAttackRange() > player.getAttackRange()) return false;
                            return player.canUse('sha', target, false);
                        },
                        check: function (card) {
                            return 9 - get.value(card);
                        },
                        filterCard: true,
                        content: function () {
                            'step 0'
                            if (target.getAttackRange() < player.getAttackRange()) player.addTempSkill('clanfenjian_lt');
                            if (target.getAttackRange() == player.getAttackRange()) player.addTempSkill('clanfenjian_eq');
                            if (target.getAttackRange() > player.getAttackRange()) player.addTempSkill('clanfenjian_gt');
                            'step 1'
                            player.useCard({ name: 'sha', isCard: true }, false, target).card.clanfenjian = true;
                        },
                        group: 'clanfenjian_damage',
                        subSkill: {
                            lt: { charlotte: true },
                            eq: { charlotte: true },
                            gt: { charlotte: true },
                            damage: {
                                trigger: { source: 'damageSource' },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.card && event.card.clanfenjian == true && event.getParent(3).name == 'clanfenjian' && player.getAttackRange() > 0;
                                },
                                content: function () {
                                    player.addTempSkill('clanfenjian_debuff');
                                    player.addMark('clanfenjian_debuff', 1, false);
                                },
                            },
                            debuff: {
                                charlotte: true,
                                onremove: true,
                                intro: {
                                    markcount: function (storage, player) {
                                        return '[-' + player.countMark('clanfenjian_debuff') + ']';
                                    },
                                    content: '攻击范围-#',
                                },
                                mod: {
                                    attackRange: function (player, num) {
                                        return num - player.countMark('clanfenjian_debuff');
                                    },
                                },
                            },
                        },
                        ai: {
                            order: function () {
                                return get.order({ name: 'sha' }) - 0.4;
                            },
                            result: {
                                target: function (player, target) {
                                    var eff = get.effect(target, { name: 'sha' }, player, target);
                                    var damageEff = get.damageEffect(target, player, player);
                                    if (eff > 0) return damageEff > 0 ? 0 : eff;
                                    return eff;
                                },
                            },
                        },
                    },
                    clandongxu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        mark: true,
                        zhuanhuanji: true,
                        marktext: '☯',
                        intro: {
                            content: function (storage, player, skill) {
                                if (player.storage.clandongxu == true) return '你可以将手牌摸至X张（X为你的攻击范围且至多为5），然后视为使用一张【闪】或令你被抵消的【杀】依然造成伤害';
                                return '你可以将一张装备牌置入其他角色的装备区（替换原装备）';
                            },
                        },
                        group: ['clandongxu_equip', 'clandongxu_shan', 'clandongxu_sha'],
                        subSkill: {
                            equip: {
                                audio: 'clandongxu',
                                enable: 'phaseUse',
                                filter: function (event, player) {
                                    if (player.storage.clandongxu) return false;
                                    return player.countCards('he', { type: 'equip' }) > 0;
                                },
                                prompt: '将一张装备牌置入其他角色的装备区（替换原装备）',
                                filterCard: function (card) {
                                    return get.type(card) == 'equip';
                                },
                                position: 'he',
                                check: function (card) {
                                    var player = _status.currentPhase;
                                    if (player.countCards('he', { subtype: get.subtype(card) }) > 1) {
                                        return 11 - get.equipValue(card);
                                    }
                                    return 6 - get.value(card);
                                },
                                filterTarget: function (card, player, target) {
                                    if (target.isMin()) return false;
                                    return player != target && target.canEquip(card, true);
                                },
                                content: function () {
                                    player.changeZhuanhuanji('clandongxu');
                                    target.equip(cards[0]);
                                },
                                discard: false,
                                lose: false,
                                prepare: function (cards, player, targets) {
                                    player.$give(cards, targets[0], false);
                                },
                                ai: {
                                    basic: {
                                        order: 10,
                                    },
                                    result: {
                                        target: function (player, target) {
                                            var card = ui.selected.cards[0];
                                            if (card) return get.effect(target, card, target, target);
                                            return 0;
                                        },
                                    },
                                    threaten: 1.35,
                                },
                            },
                            shan: {
                                audio: 'clandongxu',
                                enable: 'chooseToUse',
                                viewAs: { name: 'shan', isCard: true },
                                filterCard: function () { return false },
                                viewAsFilter: function (player) {
                                    return player.storage.clandongxu == true;
                                },
                                onuse: function (event, player) {
                                    player.changeZhuanhuanji('clandongxu');
                                    if (player.getAttackRange() > 0) player.drawTo(Math.min(5, player.getAttackRange()));
                                },
                                selectCard: -1,
                                prompt: '视为使用一张闪',
                                ai: {
                                    order: function () {
                                        var player = _status.event.player;
                                        return 3.15;
                                    },
                                    skillTagFilter: function (player) {
                                        return player.storage.clandongxu == true;
                                    },
                                    respondShan: true,
                                },
                            },
                            sha: {
                                audio: 'clandongxu',
                                trigger: { player: ['shaMiss', 'eventNeutralized'] },
                                prompt: '令你被抵消的【杀】依然造成伤害',
                                filter: function (event, player) {
                                    if (event.type != 'card' || event.card.name != 'sha') return false;
                                    return player.storage.clandongxu == true && event.target.isAlive();
                                },
                                content: function () {
                                    player.changeZhuanhuanji('clandongxu');
                                    if (player.getAttackRange() > 0) player.drawTo(Math.min(5, player.getAttackRange()));
                                    if (event.triggername == 'shaMiss') {
                                        trigger.untrigger();
                                        trigger.trigger('shaHit');
                                        trigger._result.bool = false;
                                        trigger._result.result = null;
                                    }
                                    else {
                                        trigger.unneutralize();
                                    }
                                },
                                ai: {
                                    "directHit_ai": true,
                                    skillTagFilter: function (player, tag, arg) {
                                        if (player._clandongxu_temp) return;
                                        player._clandongxu_temp = true;
                                        var bool = (get.attitude(player, arg.target) < 0 && arg.card && arg.card.name == 'sha' && player.storage.clandongxu == true);
                                        delete player._clandongxu_temp;
                                        return bool;
                                    },
                                },
                            },
                        },
                    },
                    clanshize: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        audioname: ['clan_chentai', 'clan_chenqun'],
                        trigger: { global: ['respond', 'useCard'] },
                        filter: function (event, player) {
                            if (_status.currentPhase !== player) return false;
                            if (player.hasSkill('clanshize_block')) return false;
                            if (!event.respondTo) return false;
                            if (player != event.respondTo[0]) return false;
                            return game.hasPlayer(function (current) {
                                return (current == player || current.hasClan('颍川陈氏'));
                            });
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.addTempSkill('clanshize_block');
                            player.chooseTarget(true, get.prompt('clanshize'), '令一名颍川陈氏角色的攻击范围+1直到其下次受到伤害', function (card, player, current) {
                                return (current == player || current.hasClan('颍川陈氏'));
                            }).set('ai', function (target) {
                                return get.attitude(_status.event.player, target);
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('clanshize', target);
                                target.addTempSkill('clanshize_effect', { player: 'damageEnd' });
                                target.addMark('clanshize_effect', 1, false);
                                game.delayx();
                            }
                            else event.finish();
                        },
                        subSkill: {
                            block: { charlotte: true },
                            effect: {
                                charlotte: true,
                                onremove: true,
                                intro: {
                                    markcount: function (storage, player) {
                                        return '[+' + player.countMark('clanshize_effect') + ']';
                                    },
                                    content: '攻击范围+#',
                                },
                                mod: {
                                    attackRange: function (player, num) {
                                        return num + player.countMark('clanshize_effect');
                                    },
                                },
                            },
                        },
                    },
                    //族荀莳
                    clanqingjue: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        mod: {
                            ignoredHandcard(card, player) {
                                if (lib.skill.clanqingjue.isClanqingjue(card, player)) return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (name == 'phaseDiscard') {
                                    if (lib.skill.clanqingjue.isClanqingjue(card, player)) return false;
                                }
                            },
                        },
                        isClanqingjue: function (card, player) {
                            return !player.hasCard(cardx => cardx != card && get.suit(cardx) == get.suit(card), 'h');
                        },
                        trigger: { player: ['changeHp', 'loseMaxHpBegin'] },
                        forced: true,
                        popup: false,
                        filter: function (event, player, name) {
                            if (player.hasSkill('clanqingjue_block')) return false;
                            if (name == "changeHp") return true;
                            return !player.isDamaged();
                        },
                        content: function () {
                            'step 0'
                            player.addTempSkill('clanqingjue_block');
                            var list = [];
                            for (var i of lib.suit) {
                                if (player.countCards('h', { suit: i }) > 1) list.push(i);
                            }
                            if (!list.length) event.finish();
                            'step 1'
                            var next = game.createEvent('clanqingjue');
                            next.player = player;
                            next.setContent(lib.skill.clanqingjue.contentx);
                        },
                        contentx: function () {
                            'step 0'
                            var suits = [];
                            for (var i of lib.suit) {
                                if (player.countCards('h', { suit: i }) > 1) suits.push(i);
                            }
                            var str = '弃置手牌中任意张' + get.translation(suits) + '的牌';
                            player.chooseToDiscard('h', get.prompt('clanqingjue'), [1, Infinity], str, function (card) {
                                var player = _status.event.player;
                                return !lib.skill.clanqingjue.isClanqingjue(card, player);
                            }).set('ai', function (card) {
                                return 15 - get.value(card);
                            }).logSkill = 'clanqingjue';
                            'step 1'
                            if (result.bool) event.cards = result.cards;
                            else event.finish();
                            'step 2'
                            var suits = [];
                            for (var i of lib.suit) {
                                if (!player.countCards('h', { suit: i })) suits.push(i);
                            }
                            var str = '';
                            if (!suits.length) str += `假装摸牌`;
                            else str += `获得` + get.translation(suits) + `的牌各一张`;
                            var list = [
                                [1, `将` + get.translation(event.cards) + `交给一名其他角色`],
                                [2, str],
                            ];
                            var num = Math.min(event.cards.length, 2);
                            player.chooseButton([`清绝：执行` + get.cnNumber(num) + `项`, [list, 'textbutton']], true).set('ai', function (button) {
                                var player = _status.event.player;
                                switch (button.link) {
                                    case 1:
                                        if (game.hasPlayer(function (target) {
                                            return target != player && get.attitude(player, target) > 0;
                                        })) return 2;
                                        return 0.5;
                                        break;
                                    case 2:
                                        return 1;
                                        break;
                                }
                            }).set('selectButton', num);
                            'step 3'
                            if (result.bool) {
                                event.choices = result.links;
                                game.log(player, '选择了', '#g【清绝】', '的', '#y' + event.choices);
                            }
                            else event.finish();
                            'step 4'
                            if (event.choices.includes(1) && game.hasPlayer(function (current) {
                                return current != player;
                            })) {
                                var prompt = '将' + get.translation(event.cards) + '交给一名其他角色';
                                player.chooseTarget(true, get.prompt('clanqingjue'), prompt, function (card, player, target) {
                                    return target != player;
                                }).ai = function (target) {
                                    return get.attitude(player, target);
                                };
                            }
                            else event.goto(6);
                            'step 5'
                            if (result.bool) player.give(event.cards, result.targets[0], 'give');
                            'step 6'
                            if (event.choices.includes(2)) {
                                var suits = lib.suit.slice(0), hs = player.getCards('h');
                                for (var i of hs) {
                                    suits.remove(get.suit(i, player));
                                }
                                var cardxs = [];
                                for (var i of suits) {
                                    var cardP = get.cardPile(function (card) {
                                        return !cardxs.contains(card) && get.suit(card, false) == i;
                                    });
                                    if (cardP) cardxs.push(cardP);
                                    else {
                                        var cardD = get.discardPile(function (card) {
                                            return !cardxs.contains(card) && get.suit(card, false) == i;
                                        });
                                        if (cardD) cardxs.push(cardD);
                                    }
                                }
                                if (cardxs.length) player.gain(cardxs, 'gain2');
                            }
                        },
                        subSkill: {
                            block: { charlotte: true },
                        },
                    },
                    clanyingxiang: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'gainAfter' },
                        forced: true,
                        filter: function (event, player) {
                            if (event.source != player || event.player == player) return false;
                            return true;
                        },
                        content: function () {
                            var target = trigger.player;
                            var cards = trigger.cards;
                            for (var i of cards) i.addGaintag('clanyingxiang');
                        },
                        group: ['clanyingxiang_use', 'clanyingxiang_lose'],
                        subSkill: {
                            use: {
                                audio: 'clanyingxiang',
                                trigger: { global: 'useCard' },
                                forced: true,
                                firstDo: true,
                                filter: function (event, player) {
                                    var tags = ['clanyingxiang'];
                                    return event.player.hasHistory('lose', function (evt) {
                                        if (evt.getParent() != event) return false;
                                        for (var i in evt.gaintag_map) {
                                            for (var tag of evt.gaintag_map[i]) {
                                                if (tags.contains(tag)) return true;
                                            }
                                        }
                                        return false;
                                    });
                                },
                                content: function () {
                                    'step 0'
                                    game.asyncDraw(game.filterPlayer(function (current) {
                                        return current == player || current.countCards('h', card => card.hasGaintag('clanyingxiang'));
                                    }));
                                    'step 1'
                                    game.delayx();
                                },
                            },
                            lose: {
                                audio: 'clanyingxiang',
                                trigger: { global: ['loseAfter', 'cardsDiscardAfter', 'loseAsyncAfter'] },
                                forced: true,
                                filter: function (event, player) {
                                    if (player.hasSkill('clanyingxiang_block')) return false;
                                    if (event.name.indexOf('lose') == 0) {
                                        if (event.getlx === false || event.position != ui.discardPile) return false;
                                    }
                                    else {
                                        var evt = event.getParent();
                                        if (evt.relatedEvent && evt.relatedEvent.name == 'useCard') return false;
                                    }
                                    for (var i of event.cards) {
                                        var owner = false;
                                        if (event.hs && event.hs.contains(i)) owner = event.player;
                                        if (i.hasGaintag('clanyingxiang')) return true;
                                    }
                                    return false;
                                },
                                content: function () {
                                    'step 0'
                                    player.addTempSkill('clanyingxiang_block', 'roundStart');
                                    var list = [];
                                    for (var i of lib.suit) {
                                        if (player.countCards('h', { suit: i }) > 1) list.push(i);
                                    }
                                    if (!list.length) event.finish();
                                    'step 1'
                                    var next = game.createEvent('clanqingjue');
                                    next.player = player;
                                    next.setContent(lib.skill.clanqingjue.contentx);
                                },
                            },
                            block: { charlotte: true },
                        },
                    },
                    //谋贾诩
                    sbfmluanchao: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'roundStart' },
                        limited: true,
                        skillAnimation: 'epic',
                        animationColor: 'thunder',
                        check: function (event, player) {
                            return game.countPlayer(function (current) {
                                return get.attitude(player, current) <= 0;
                            }) < game.countPlayer(function (current) {
                                return get.attitude(player, current) > 0;
                            });
                        },
                        content: function () {
                            'step 0'
                            player.awakenSkill('sbfmluanchao');
                            event.targets = game.players.sortBySeat();
                            event.playerNum = game.players.length;
                            'step 1'
                            event.currentPlayer = event.targets[event.targets.length - event.playerNum];
                            var target = event.currentPlayer;
                            target.chooseControl(['杀', '闪']).set('prompt', '乱朝：请选择获得的牌').set('ai', function () {
                                var player = _status.event.player;
                                if (player.countCards('h', 'shan') > 0) return '杀';
                                else return '闪';
                            });
                            'step 2'
                            var target = event.currentPlayer;
                            if (result.control == '杀') {
                                var card = get.cardPile2(function (card) {
                                    return card.name == 'sha';
                                });
                                if (card) target.gain(card, 'gain2');
                                target.addTempSkill('sbfmluanchao_effect', 'roundStart');
                            }
                            else {
                                var card = get.cardPile2(function (card) {
                                    return card.name == 'shan';
                                });
                                if (card) target.gain(card, 'gain2');
                            }
                            'step 3'
                            if (event.playerNum > 1) {
                                event.playerNum--;
                                event.goto(1);
                            }
                        },
                        subSkill: {
                            effect: {
                                mark: true,
                                marktext: '乱朝',
                                intro: { content: '本轮首次造成的伤害+1' },
                                trigger: { source: 'damageBegin1' },
                                forced: true,
                                popup: false,
                                charlotte: true,
                                content: function () {
                                    trigger.num++;
                                    player.removeSkill('sbfmluanchao_effect');
                                },
                            },
                        },
                    },
                    sbfmwance: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'phaseUse',
                        usable: 1,
                        isSbfmwance: function (card) {
                            var info = lib.card[card.name];
                            if (!info || info.type != 'trick') return false;
                            if (info.notarget) return true;
                            if (info.selectTarget != undefined) {
                                if (Array.isArray(info.selectTarget)) {
                                    if (info.selectTarget[0] < 0) return !info.toself;
                                    return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
                                }
                                else {
                                    if (info.selectTarget < 0) return !info.toself;
                                    return info.selectTarget != 1;
                                }
                            }
                            return false;
                        },
                        filter: function (event, player) {
                            return game.hasPlayer(function (current) {
                                return current.countCards('h') > 0;
                            });
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var vcards = [];
                                for (var i of lib.inpile) {
                                    var card = { name: i, isCard: true };
                                    if (get.type(i) == 'trick' && !lib.skill.sbfmwance.isSbfmwance(card)) vcards.push(['锦囊', '', i]);
                                }
                                return ui.create.dialog('完策', [vcards, 'vcard']);
                            },
                            check: function (button) {
                                return _status.event.player.getUseValue({ name: button.link[2], isCard: true }, null, true);
                            },
                            backup: function (links, player) {
                                return {
                                    audio: 'sbfmwance',
                                    cardname: links[0][2],
                                    selectCard: -1,
                                    filterCard: function () { return false },
                                    filterTarget: function (card, player, target) {
                                        return target.hasUseTarget({ name: lib.skill.sbfmwance_backup.cardname }) && target.countCards('h') > 0;
                                    },
                                    content: function () {
                                        'step 0'
                                        event.cardname = lib.skill.sbfmwance_backup.cardname;
                                        event.count = 0;
                                        event.num = Math.min(game.roundNumber, 3);
                                        'step 1'
                                        if (!target.countCards('h') || event.count >= event.num || !target.hasUseTarget({ name: event.cardname })) event.finish();
                                        else event.count++;
                                        'step 2'
                                        game.broadcastAll(function (viewAs) {
                                            lib.skill.sbfmwance_backupx.viewAs = viewAs;
                                        }, {
                                            name: event.cardname,
                                            storage: { sbfmwance: true },
                                        });
                                        var next = target.chooseToUse();
                                        next.set('openskilldialog', '完策：将一张手牌当做' + get.translation(event.cardname) + '使用');
                                        next.set('forced', true);
                                        next.set('norestore', true);
                                        next.set('addCount', false);
                                        next.set('_backupevent', 'sbfmwance_backupx');
                                        next.set('custom', {
                                            add: {},
                                            replace: { window: function () { } }
                                        });
                                        next.backup('sbfmwance_backupx');
                                        'step 3'
                                        event.goto(1);
                                    },
                                    ai: {
                                        result: {
                                            player: 2,
                                            target: 0.1,
                                        },
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                var num = Math.min(game.roundNumber, 3);
                                return '令一名角色依次将' + get.translation(num) + '张手牌当' + get.translation(links[0][2]) + '使用';
                            },
                        },
                        group: 'sbfmwance_change',
                        subSkill: {
                            backup: {},
                            backupx: {
                                filterCard: function (card) {
                                    return get.itemtype(card) == 'card';
                                },
                                position: 'h',
                                filterTarget: lib.filter.filterTarget,
                                log: false,
                                check: function (card) {
                                    return 8 - get.value(card);
                                },
                            },
                            change: {
                                audio: 'sbfmwance',
                                trigger: { global: 'useCardToPlayer' },
                                filter: function (event, player) {
                                    return event.isFirstTarget && player.hasCard(function (card) {
                                        return lib.filter.cardDiscardable(card, player, 'sbfmwance_change');
                                    }, 'he') && event.card.storage && event.card.storage.sbfmwance;
                                },
                                direct: true,
                                content: function () {
                                    'step 0'
                                    const targets = game.filterPlayer(target => lib.filter.targetEnabled2(trigger.card, trigger.player, target)),
                                        goon = Math.max(...targets.filter(target => target != trigger.target).map(target => get.effect(target, trigger.card, trigger.player, player))) > get.effect(trigger.target, trigger.card, trigger.player, player);
                                    player.chooseCardTarget({
                                        position: 'he',
                                        filterCard: lib.filter.cardDiscardable,
                                        filterTarget: function (card, player, target) {
                                            if (_status.event.targets.contains(target)) return false;
                                            return targets.includes(target);
                                        },
                                        ai1: function (card) {
                                            if (goon) return 7 - get.value(card);
                                            return 0;
                                        },
                                        ai2: function (target) {
                                            return get.effect(target, _status.event.getTrigger().card, _status.event.getTrigger().player, get.player());
                                        },
                                        prompt: '完策：是否弃置一张牌，为' + get.translation(trigger.card) + '重新指定目标（无距离限制）',
                                        prompt2: '原目标：' + get.translation(trigger.target),
                                    }).set('targets', trigger.targets);
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('sbfmwance_change', result.targets);
                                        player.discard(result.cards);
                                        event.targ = result.targets[0];
                                        if (trigger.target != event.targ) game.log(player, '将', trigger.card, '的目标更改为', event.targ);
                                    }
                                    else event.finish();
                                    'step 2'
                                    trigger.targets.remove(trigger.target);
                                    trigger.targets.push(event.targ);
                                    trigger.target = event.targ;
                                },
                            },
                        },
                        ai: {
                            order: 1,
                            result: {
                                player: 1,
                            },
                        },
                    },
                    sbfmchenzhi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'damageBegin4' },
                        firstDo: true,
                        direct: true,
                        filter: function (event, player) {
                            return event.num > 0;
                        },
                        content: function () {
                            'step 0'
                            event.num = Math.min(game.roundNumber, 3);
                            event.count = player.countMark('sbfmchenzhi_count');
                            player.addTempSkill('sbfmchenzhi_count', 'roundStart');
                            player.addMark('sbfmchenzhi_count', 1, false);
                            if (!player.hasCard(function (card) {
                                return lib.filter.cardDiscardable(card, player, 'sbfmchenzhi');
                            }, 'he') || event.count < event.num) event.finish();
                            'step 1'
                            var str = '弃置一张牌防止此伤害';
                            player.chooseToDiscard(get.prompt('sbfmchenzhi'), true, 'he', str).logSkill = 'sbfmchenzhi';
                            'step 2'
                            if (result.bool) {
                                player.addTempSkill('sbfmchenzhi_effect', 'roundStart');
                                trigger.cancel();
                            }
                        },
                        group: 'sbfmchenzhi_limit',
                        mark: true,
                        intro: { content: '大招尚未使用' },
                        subSkill: {
                            count: { charlotte: true, onremove: true },
                            effect: { charlotte: true },
                            limit: {
                                audio: 'sbfmchenzhi',
                                skillAnimation: true,
                                animationColor: 'thunder',
                                trigger: { global: 'roundFinish' },
                                direct: true,
                                filter: function (event, player) {
                                    return !player.hasSkill('sbfmchenzhi_effect') && game.hasPlayer(function (current) {
                                        var list = [];
                                        var skills = current.getOriginalSkills();
                                        for (var i = 0; i < skills.length; i++) {
                                            if (lib.skill[skills[i]].limited && current.awakenedSkills.contains(skills[i])) list.push(skills[i]);
                                        }
                                        return list.length > 0;
                                    }) && !player.storage.sbfmchenzhi;
                                },
                                content: function () {
                                    'step 0'
                                    event.targets = [];
                                    game.players.forEach(function (current) {
                                        var list = [];
                                        var skills = current.getOriginalSkills();
                                        for (var i = 0; i < skills.length; i++) {
                                            if (lib.skill[skills[i]].limited && current.awakenedSkills.contains(skills[i])) list.push(skills[i]);
                                        }
                                        if (list.length > 0) event.targets.push(current);
                                    });
                                    var str = '复原一名角色的一个限定技（每局游戏限一次）';
                                    player.chooseTarget(get.prompt('sbfmchenzhi'), str, function (card, player, target) {
                                        return _status.event.targets.contains(target);
                                    }).set('ai', function (target) {
                                        return get.attitude(_status.event.player, target) > 0;
                                    }).set('targets', event.targets);
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('sbfmchenzhi_limit', result.targets);
                                        event.target = result.targets[0];
                                        player.storage.sbfmchenzhi = true;
                                        player.unmarkSkill('sbfmchenzhi');
                                    }
                                    else event.finish();
                                    'step 2'
                                    var list = [];
                                    var skills = event.target.getOriginalSkills();
                                    for (var i = 0; i < skills.length; i++) {
                                        if (lib.skill[skills[i]].limited && event.target.awakenedSkills.contains(skills[i])) list.push(skills[i]);
                                    }
                                    if (list.length == 1) {
                                        event.target.restoreSkill(list[0]);
                                        game.log(player, '重置了', event.target, '的', '#g【' + get.translation(list[0]) + '】');
                                        event.finish();
                                    }
                                    else if (list.length > 1) player.chooseControl(list).set('prompt', '完策：选择一个限定技重置');
                                    'step 3'
                                    event.target.restoreSkill(result.control);
                                    game.log(player, '重置了', event.target, '的', '#g【' + get.translation(result.control) + '】');
                                },
                            },
                        },
                    },
                    //谋张让
                    sbfmlucun: {
                        audio: 'ext:柊舞缇娜/audio:3',
                        audioname: ["sbfm_zhangrang2"],
                        owner: 'sbfm_zhangrang',
                        init: function (player) {
                            player.storage.sbfmlucun_use = [];
                        },
                        intro: {
                            content: 'expansion',
                            markcount: 'expansion',
                        },
                        onremove: function (player, skill) {
                            var cards = player.getExpansions(skill);
                            if (cards.length) player.loseToDiscardpile(cards);
                        },
                        enable: 'chooseToUse',
                        filter: function (event, player) {
                            for (var i of lib.inpile) {
                                var card = { name: i, isCard: true };
                                var info = lib.card[card.name];
                                if (get.type(card) == 'trick' && !player.hasSkill('sbfmlucun_trick') && event.filterCard(card, player, event)) {
                                    if (info && !info.notarget && !player.storage.sbfmlucun_use.contains(card.name)) return true;
                                }
                                if (get.type(card) == 'basic' && !player.hasSkill('sbfmlucun_basic') && event.filterCard(card, player, event)) {
                                    if (info && !info.notarget && !player.storage.sbfmlucun_use.contains(card.name)) return true;
                                }
                            }
                            return false;
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var list = [];
                                for (var i = 0; i < lib.inpile.length; i++) {
                                    var name = lib.inpile[i];
                                    var info = lib.card[name];
                                    if (player.storage.sbfmlucun_use.contains(name)) continue;
                                    if (!info || info.notarget || !event.filterCard({ name: name }, player, event)) continue;
                                    if (name == 'sha') {
                                        if (!player.hasSkill('sbfmlucun_basic')) list.push(['基本', '', 'sha']);
                                        for (var j of lib.inpile_nature) {
                                            if (!player.hasSkill('sbfmlucun_basic')) list.push(['基本', '', 'sha', j]);
                                        }
                                    }
                                    else if (get.type(name) == 'trick' && !player.hasSkill('sbfmlucun_trick')) list.push(['锦囊', '', name]);
                                    else if (get.type(name) == 'basic' && !player.hasSkill('sbfmlucun_basic')) list.push(['基本', '', name]);
                                }
                                return ui.create.dialog('赂存', [list, 'vcard']);
                            },
                            filter: function (button, player) {
                                return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                            },
                            check: function (button) {
                                if (_status.event.getParent().type != 'phase') return 1;
                                var player = _status.event.player;
                                if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].contains(button.link[2])) return 0;
                                return player.getUseValue({
                                    name: button.link[2],
                                    nature: button.link[3],
                                });
                            },
                            backup: function (links, player) {
                                return {
                                    audio: 'sbfmlucun',
                                    filterCard: () => false,
                                    selectCard: -1,
                                    popname: true,
                                    viewAs: { name: links[0][2], nature: links[0][3], isCard: true },
                                    onuse: function (links, player) {
                                        player.storage.sbfmlucun_use.add(links.card.name);
                                    },
                                    precontent: function () {
                                        var card = event.result.card;
                                        if (get.type(card) == 'basic') player.addTempSkill('sbfmlucun_basic', 'roundStart');
                                        else player.addTempSkill('sbfmlucun_trick', 'roundStart');
                                        player.swapBackground('sbfmlucun');
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                return '视为使用' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]);
                            }
                        },
                        hiddenCard: function (player, name) {
                            var info = lib.card[name];
                            if (!lib.inpile.contains(name) || !info || info.notarget) return false;
                            if (player.storage.sbfmlucun_use.contains(name)) return false;
                            var type = get.type(name);
                            if (player.hasSkill('sbfmlucun_basic') && type == 'basic') return true;
                            if (player.hasSkill('sbfmlucun_trick') && type == 'trick') return true;
                            return false;
                        },
                        ai: {
                            order: 11,
                            result: {
                                player: function (player) {
                                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                                    return 1;
                                },
                            },
                        },
                        group: ['sbfmlucun_gain', 'sbfmlucun_effect'],
                        subSkill: {
                            gain: {
                                audio: 'sbfmlucun',
                                trigger: { global: "phaseEnd" },
                                filter: function (event, player) {
                                    return player.getExpansions('sbfmlucun').length >= 1;
                                },
                                direct: true,
                                forced: true,
                                content: function () {
                                    player.loseToDiscardpile(player.getExpansions('sbfmlucun').randomGet());
                                    player.draw();
                                },
                            },
                            effect: {
                                trigger: { player: 'useCardAfter' },
                                forced: true,
                                filter: function (event, player) {
                                    return event.skill == 'sbfmlucun_backup';
                                },
                                content: function () {
                                    'step 0'
                                    var targets = trigger.targets.sortBySeat();
                                    event.targets = targets;
                                    event.statC = 0;
                                    event.num = 0;
                                    'step 1'
                                    var target = event.targets[num];
                                    if (target.isIn() && target.countCards('h') > 0) {
                                        var numx = target.countCards('h');
                                        if (event.statC < numx) event.statC = numx;
                                    }
                                    event.num++;
                                    if (event.num < targets.length) event.redo();
                                    'step 2'
                                    var target = trigger.targets.filter(i => i.countCards('h') == event.statC).randomGet();
                                    event.target = target;
                                    'step 3'
                                    if (target.countCards('h')) target.chooseCard('将一张手牌置于武将牌上作为“赂”', true);
                                    'step 4'
                                    if (result.cards && result.cards.length) player.addToExpansion(result.cards, target, "give").gaintag.add('sbfmlucun');
                                },
                            },
                            basic: { charlotte: true },
                            trick: { charlotte: true },
                        },
                    },
                    sbfmtuisheng: {
                        audio: 'ext:柊舞缇娜/audio:3',
                        audioname: ["sbfm_zhangrang2"],
                        trigger: { player: ['phaseZhunbeiBegin', 'dying'] },
                        filter: function (event, player) {
                            if (event.name == 'phaseZhunbei') return (player.countCards('h') > 0 || player.storage.sbfmlucun_use.length > 0);
                            return player.hp < 1 && (player.countCards('h') > 0 || player.storage.sbfmlucun_use.length > 0);
                        },
                        limited: true,
                        skillAnimation: true,
                        animationColor: "water",
                        priority: -Infinity,
                        direct: true,
                        content: function () {
                            'step 0'
                            var list = [
                                [1, `将所有手牌置为“赂”`],
                                [2, `你随机从弃牌堆中获得` + get.translation(game.roundNumber) + `张重置前“赂存”使用牌名的牌。`],
                            ];
                            var str = `是否发动〖蜕生〗：重置本局“赂存”使用过的牌名，然后你选择一项并回复一点体力`;
                            player.chooseButton([str, [list, 'textbutton']]).set('ai', function (button) {
                                var player = _status.event.player;
                                switch (button.link) {
                                    case 1:
                                        if (player.hp < 1 && game.roundNumber < 2 && player.countCards('h') > 3) return 3;
                                        return 2;
                                        break;
                                    case 2:
                                        if (player.hp < 1 || (game.roundNumber > 3 && player.storage.sbfmlucun_use.length > 3)) return 5;
                                        return 0;
                                        break;
                                }
                            }).set('filterButton', function (button) {
                                var player = _status.event.player;
                                if (button.link == 1) return player.countCards('h') > 0;
                                if (button.link == 2) return player.storage.sbfmlucun_use.length > 0;
                                return false;
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('sbfmtuisheng');
                                player.awakenSkill('sbfmtuisheng');
                                player.recover();
                                result.links.forEach(function (choice) {
                                    switch (choice) {
                                        case 1:
                                            player.addToExpansion(player.getCards('h'), player, 'give').gaintag.add('sbfmlucun');
                                            player.storage.sbfmlucun_use = [];
                                            break;
                                        case 2:
                                            event.cards = [];
                                            for (var i = 0; i < lib.inpile.length; i++) {
                                                var name = lib.inpile[i];
                                                if (player.storage.sbfmlucun_use.contains(name)) {
                                                    var cardD = get.discardPile(function (card) {
                                                        return get.name(card) == name;
                                                    });
                                                    if (cardD) event.cards.push(cardD);
                                                }
                                            }
                                            if (event.cards.length > 0) player.gain(event.cards.randomGets(game.roundNumber), 'gain2');
                                            player.storage.sbfmlucun_use = [];
                                            break;
                                    }
                                });
                            }
                            else event.finish();
                        },
                    },
                    //谋许攸
                    sbfmxyqianfu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        enable: 'phaseUse',
                        zhuanhuanji: 'number',
                        mark: true,
                        marktext: '☯',
                        intro: {
                            markcount: () => 0,
                            content: function (storage) {
                                return '转换技，你可以将一张' + ((storage || 0) % 2 ? '红色牌当【火攻】' : '黑色牌当【过河拆桥】') + '使用。';
                            },
                        },
                        filter: function (event, player) {
                            var storage = player.storage.sbfmxyqianfu;
                            var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                            var color = (storage || 0) % 2 ? 'red' : 'black';
                            if (event.filterCard({ name: name }, player, event) && player.hasCard(card => get.color(card) == color, "hes")) return true;
                            return false;
                        },
                        viewAsFilter: function (player) {
                            var storage = player.storage.sbfmxyqianfu;
                            var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                            var color = (storage || 0) % 2 ? 'red' : 'black';
                            if (event.filterCard({ name: name }, player, event) && player.hasCard(card => get.color(card) == color, "hes")) return true;
                            return false;
                        },
                        viewAs: function (cards, player) {
                            var storage = player.storage.sbfmxyqianfu;
                            var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                            return { name: name };
                        },
                        check: function (card) {
                            var player = _status.event.player;
                            var storage = player.storage.sbfmxyqianfu;
                            var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                            var fix = get.position(card) != 'h' ? 2 : 1;
                            return get.value({ name: name }, player) - get.value(card) + fix;
                        },
                        position: 'hes',
                        filterCard: function (card, player) {
                            var storage = player.storage.sbfmxyqianfu;
                            return get.color(card) == ((storage || 0) % 2 ? 'red' : 'black');
                        },
                        precontent: function () {
                            var skill = 'sbfmxyqianfu';
                            player.changeZhuanhuanji(skill);
                        },
                        ai: {
                            order: function (item, player) {
                                player = player || _status.event.player;
                                var storage = _status.event.player.storage.sbfmxyqianfu;
                                var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                                return get.order({ name: name }) + 0.1;
                            },
                        },
                        group: ['sbfmxyqianfu_put'],
                        subSkill: {
                            put: {
                                trigger: { player: 'useCardAfter' },
                                filter: function (event, player) {
                                    return event.skill == 'sbfmxyqianfu';
                                },
                                direct: true,
                                content: function (event, player) {
                                    'step 0'
                                    var cardsx = [];
                                    game.getGlobalHistory('cardMove', function (evt) {
                                        if (evt.name == 'lose' && evt.type == 'discard' && evt.getParent(3).card == trigger.card) cardsx.addArray(evt.cards);
                                    });
                                    event.cards = cardsx.filterInD('d');
                                    if (event.cards.length) {
                                        player.chooseBool('是否将' + get.translation(event.cards) + '置于牌堆顶？').ai = function () {
                                            return get.value(event.cards) > 0;
                                        };
                                    }
                                    else event.finish();
                                    'step 1'
                                    if (result.bool) {
                                        while (event.cards.length) {
                                            var card = event.cards.pop();
                                            card.fix();
                                            ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                            game.log(player, '将', card, '置于牌堆顶');
                                        }
                                    }
                                    else event.finish();
                                    'step 2'
                                    game.updateRoundNumber();
                                },
                            },
                        },
                    },
                    sbfmxyqianfu_temp: {
                        audio: 'sbfmxyqianfu',
                        enable: 'phaseUse',
                        zhuanhuanji: 'number',
                        mark: true,
                        marktext: '☯',
                        intro: {
                            markcount: () => 0,
                            content: function (storage) {
                                return '转换技，出牌阶段限一次，你可以将一张' + ((storage || 0) % 2 ? '红色牌当【火攻】' : '黑色牌当【过河拆桥】') + '使用。';
                            },
                        },
                        filter: function (event, player) {
                            var storage = player.storage.sbfmxyqianfu_temp;
                            var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                            var color = (storage || 0) % 2 ? 'red' : 'black';
                            if (player.hasSkill('sbfmxyqianfu_temp_' + color)) return false;
                            if (event.filterCard({ name: name }, player, event) && player.hasCard(card => get.color(card) == color, "hes")) return true;
                            return false;
                        },
                        viewAsFilter: function (player) {
                            var storage = player.storage.sbfmxyqianfu_temp;
                            var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                            var color = (storage || 0) % 2 ? 'red' : 'black';
                            if (player.hasSkill('sbfmxyqianfu_temp_' + color)) return false;
                            if (event.filterCard({ name: name }, player, event) && player.hasCard(card => get.color(card) == color, "hes")) return true;
                            return false;
                        },
                        viewAs: function (cards, player) {
                            var storage = player.storage.sbfmxyqianfu_temp;
                            var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                            return { name: name };
                        },
                        check: function (card) {
                            var player = _status.event.player;
                            var storage = player.storage.sbfmxyqianfu_temp;
                            var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                            var fix = get.position(card) != 'h' ? 2 : 1;
                            return get.value({ name: name }, player) - get.value(card) + fix;
                        },
                        position: 'hes',
                        filterCard: function (card, player) {
                            var storage = player.storage.sbfmxyqianfu_temp;
                            return get.color(card) == ((storage || 0) % 2 ? 'red' : 'black');
                        },
                        precontent: function () {
                            'step 0'
                            var storage = player.storage.sbfmxyqianfu_temp;
                            var color = (storage || 0) % 2 ? 'red' : 'black';
                            player.addTempSkill('sbfmxyqianfu_temp_' + color, { player: 'phaseUseAfter' });
                            'step 1'
                            var skill = 'sbfmxyqianfu_temp';
                            player.changeZhuanhuanji(skill);
                        },
                        ai: {
                            order: function (item, player) {
                                player = player || _status.event.player;
                                var storage = _status.event.player.storage.sbfmxyqianfu_temp;
                                var name = (storage || 0) % 2 ? 'huogong' : 'guohe';
                                return get.order({ name: name }) + 0.1;
                            },
                        },
                        group: ['sbfmxyqianfu_temp_put', 'sbfmxyqianfu_temp_remove'],
                        subSkill: {
                            put: {
                                trigger: { player: 'useCardAfter' },
                                filter: function (event, player) {
                                    return event.skill == 'sbfmxyqianfu_temp';
                                },
                                direct: true,
                                content: function (event, player) {
                                    'step 0'
                                    var cardsx = [];
                                    game.getGlobalHistory('cardMove', function (evt) {
                                        if (evt.name == 'lose' && evt.type == 'discard' && evt.getParent(3).card == trigger.card) cardsx.addArray(evt.cards);
                                    });
                                    event.cards = cardsx.filterInD('d');
                                    if (event.cards.length) {
                                        player.chooseBool('是否将' + get.translation(event.cards) + '置于牌堆顶？').ai = function () {
                                            return get.value(event.cards) > 0;
                                        };
                                    }
                                    else event.finish();
                                    'step 1'
                                    if (result.bool) {
                                        while (event.cards.length) {
                                            var card = event.cards.pop();
                                            card.fix();
                                            ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                            game.log(player, '将', card, '置于牌堆顶');
                                        }
                                    }
                                    else event.finish();
                                    'step 2'
                                    game.updateRoundNumber();
                                },
                            },
                            remove: {
                                trigger: {
                                    player: 'loseAfter',
                                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                                },
                                direct: true,
                                forced: true,
                                charlotte: true,
                                lastDo: true,
                                filter: function (event, player) {
                                    if (player.countCards('h')) return false;
                                    var evt = event.getl(player);
                                    return evt && evt.player == player && evt.hs && evt.hs.length > 0;
                                },
                                content: function () {
                                    player.removeSkill('sbfmxyqianfu_temp');
                                    game.log(player, "失去了技能", '#g【迁附】');
                                },
                            },
                            red: {
                                charlotte: true,
                            },
                            black: {
                                charlotte: true,
                            },
                        },
                    },
                    sbfmyushi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        init: function (player) {
                            player.storage.sbfmyushi_count = 0;
                        },
                        trigger: {
                            source: 'damageSource',
                            player: 'damageEnd',
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.chooseTarget(get.prompt('sbfmyushi'), '变更一名角色的一个转换技的状态，或令其获得出牌阶段各限一次的“迁附”').set('ai', function (target) {
                                var player = _status.event.player;
                                return get.attitude(player, target);
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('sbfmyushi', target);
                                if (target.getSkills(null, false, false).filter(function (i) {
                                    var info = get.info(i);
                                    return info && info.zhuanhuanji;
                                }).length > 0) {
                                    var next = game.createEvent('sbfmyushi_change');
                                    next.player = player;
                                    next.target = target;
                                    next.setContent(lib.skill.sbfmyushi_change.content);
                                }
                                else {
                                    target.addSkill('sbfmxyqianfu_temp');
                                    game.log(target, "获得了技能", '#g【迁附】');
                                }
                            }
                            else event.finish();
                        },
                        group: ['sbfmyushi_draw', 'sbfmyushi_clear'],
                        subSkill: {
                            change: {
                                charlotte: true,
                                content: function () {
                                    'step 0'
                                    var list = target.getSkills(null, false, false).filter(function (i) {
                                        var info = get.info(i);
                                        return info && info.zhuanhuanji;
                                    });
                                    if (list.length == 1) {
                                        event._result = { control: list[0] };
                                    }
                                    else player.chooseControl(list).set('prompt', '选择变更' + get.translation(target) + '一个技能的状态').set('choice', list.contains('sbfmxyqianfu_temp') ? 'sbfmxyqianfu_temp' : 0).set('ai', () => _status.event.choice);
                                    'step 1'
                                    var skill = result.control;
                                    target.changeZhuanhuanji(skill);
                                    target.popup(skill, 'wood');
                                    game.log(target, '的', '#g【' + get.translation(skill) + '】', '发生了状态变更');
                                    game.delayx();
                                },
                            },
                            draw: {
                                trigger: { global: 'changeZhuanhuanjiEnd' },
                                forced: true,
                                direct: true,
                                filter: function (event, player) {
                                    return player.storage.sbfmyushi_count < player.maxHp;
                                },
                                content: function () {
                                    player.draw();
                                    player.storage.sbfmyushi_count++;
                                },
                            },
                            clear: {
                                trigger: { global: 'roundStart' },
                                forced: true,
                                direct: true,
                                lastDo: true,
                                content: function () {
                                    player.storage.sbfmyushi_count = 0;
                                },
                            },
                        },
                    },
                    sbfmfenchao: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        limited: true,
                        skillAnimation: true,
                        animationColor: "metal",
                        trigger: { player: "phaseJieshuBegin" },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.chooseTarget(get.prompt('sbfmfenchao'), '令一名角色获得弃牌堆中的伤害牌（不超过存活人数）').set('ai', function (target) {
                                var player = _status.event.player;
                                return get.attitude(player, target);
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target = target;
                                player.logSkill('sbfmfenchao', target);
                                player.awakenSkill('sbfmfenchao');
                            }
                            else event.finish();
                            'step 2'
                            var list = [];
                            for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
                                var card = ui.discardPile.childNodes[i];
                                if (get.tag(card, "damage")) list.push(card);
                            }
                            var cards = list.randomGets(game.players.length);
                            target.gain(cards, 'gain2').gaintag = ['sbfmfenchao'];
                            for (var i of cards) {
                                if (!i.gaintagFixed) i.gaintagFixed = [];
                                i.gaintagFixed.push('sbfmfenchao');
                            }
                            player.addSkill("sbfmfenchao_mark");
                        },
                        subSkill: {
                            mark: {
                                trigger: { global: 'useCard' },
                                charlotte: true,
                                direct: true,
                                firstDo: true,
                                filter: function (event, player) {
                                    var tags = ['sbfmfenchao'];
                                    return event.player.hasHistory('lose', function (evt) {
                                        if (evt.getParent() != event) return false;
                                        for (var i in evt.gaintag_map) {
                                            for (var tag of evt.gaintag_map[i]) {
                                                if (tags.contains(tag)) return true;
                                            }
                                        }
                                        return false;
                                    });
                                },
                                content: function () {
                                    'step 0'
                                    delete player.storage.sbfmfenchao;
                                    'step 1'
                                    player.storage.sbfmfenchao = {
                                        card: trigger.card,
                                        //player:event.targett,
                                    }
                                    player.addSkill("sbfmfenchao_fire");
                                },
                            },
                            fire: {
                                audio: 'sbfmfenchao',
                                charlotte: true,
                                forced: true,
                                trigger: {
                                    global: "damageBegin1",
                                },
                                filter: function (event, player) {
                                    var info = player.storage.sbfmfenchao;
                                    return event.card && event.card == info.card;
                                },
                                content: function () {
                                    trigger.nature = 'fire';
                                },
                            },
                        },
                    },
                    dcyiju: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { target: 'useCardToTarget' },
                        forced: true,
                        filter: function (event, player) {
                            return event.player != player && event.targets.length == 1 && player.hasCard(function (card) {
                                return lib.filter.cardDiscardable(card, player, 'dcyiju');
                            }, 'he');
                        },
                        content: function () {
                            player.chooseToDiscard('he', true);
                        },
                    },
                    //崔令仪
                    dchuashang: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'useCardAfter' },
                        mod: {
                            targetInRange: function (card, player) {
                                var colors = [];
                                var es = player.getCards('e');
                                for (var i = 0; i < es.length; i++) {
                                    colors.add(get.color(es[i]));
                                }
                                if (colors.length >= 2) return true;
                            },
                        },
                        locked: false,
                        direct: true,
                        filter: function (event, player) {
                            var suit = get.suit(event.card);
                            if (!player.countCards('h', (card) => {
                                return get.type2(card) != "equip" && get.suit(card) == suit;
                            })) return false;
                            if (player.countDisabled() >= 5) return false;
                            return true;
                        },
                        content: function () {
                            'step 0'
                            var suit = get.suit(trigger.card);
                            event.suit = suit;
                            var prompt = '将一张' + get.translation(suit) + '花色的手牌置入装备栏';
                            player.chooseCard(get.prompt('dchuashang'), 'h', prompt, function (card, player) {
                                return get.type2(card) != "equip" && get.suit(card, player) == _status.event.suit;
                            }).set('suit', suit);
                            'step 1'
                            if (!result.bool) event.finish();
                            else {
                                player.logSkill('dchuashang');
                                event.cardx = result.cards[0];
                                event.number = get.number(result.cards[0]);
                            }
                            'step 2'
                            var list = [];
                            for (var i = 1; i < 6; i++) {
                                if (player.isDisabled(i)) continue;
                                list.push('equip' + i);
                            }
                            if (list.length) {
                                event.list = list;
                            }
                            else event.finish();
                            'step 3'
                            if (event.list.length == 1) event._result = { control: event.list[0] };
                            else player.chooseControl(event.list, true).set('prompt', '选择' + get.translation(event.cardx) + '置入的装备栏');
                            'step 4'
                            event.choice = result.control;
                            var card = game.createCard('dchuashang_' + event.choice, event.suit, event.number);
                            player.$gain2(card);
                            game.delayx();
                            player.equip(card);
                            'step 5'
                            if (event.choice == 'equip1') {
                                player.storage.dchuashang_equip1 = event.cardx;
                            };
                            if (event.choice == 'equip2') {
                                player.storage.dchuashang_equip2 = event.cardx;
                            };
                            if (event.choice == 'equip3') {
                                player.storage.dchuashang_equip3 = event.cardx;
                            };
                            if (event.choice == 'equip4') {
                                player.storage.dchuashang_equip4 = event.cardx;
                            };
                            if (event.choice == 'equip5') {
                                player.storage.dchuashang_equip5 = event.cardx;
                            };
                            player.lose(event.cardx, ui.discardPile, 'insert');
                            event.cardx.fix();
                            event.cardx.remove();
                            game.updateRoundNumber();
                        },
                        group: ['dchuashang_buff', 'dchuashang_draw'],
                        subSkill: {
                            buff: {
                                audio: 'dchuashang',
                                trigger: {
                                    global: 'phaseBefore',
                                    player: 'enterGame',
                                },
                                direct: true,
                                filter: function (event, player) {
                                    if (player.countDisabled() >= 5) return false;
                                    return (event.name != 'phase' || game.phaseNumber == 0);
                                },
                                content: function () {
                                    'step 0'
                                    player.logSkill('dchuashang');
                                    event.num = 0;
                                    'step 1'
                                    var list = [];
                                    for (var i = 1; i < 6; i++) {
                                        if (!player.isEmpty(i)) continue;
                                        list.push('equip' + i);
                                    }
                                    if (list.length) {
                                        event.list = list;
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (event.list.length == 1) event._result = { control: event.list[0] };
                                    else player.chooseControl(event.list, true).set('prompt', '选择置入的装备栏');
                                    'step 3'
                                    var color = num > 0 ? 'red' : 'black';
                                    var card = get.cardPile2(function (card) {
                                        return get.color(card, false) == color;
                                    });
                                    var suit = get.suit(card);
                                    var number = get.number(card);
                                    var cardx = game.createCard('dchuashang_' + result.control, suit, number);
                                    player.$gain2(cardx);
                                    game.delayx();
                                    player.equip(cardx);
                                    game.delayx();
                                    if (result.control == 'equip1') {
                                        player.storage.dchuashang_equip1 = card;
                                    };
                                    if (result.control == 'equip2') {
                                        player.storage.dchuashang_equip2 = card;
                                    };
                                    if (result.control == 'equip3') {
                                        player.storage.dchuashang_equip3 = card;
                                    };
                                    if (result.control == 'equip4') {
                                        player.storage.dchuashang_equip4 = card;
                                    };
                                    if (result.control == 'equip5') {
                                        player.storage.dchuashang_equip5 = card;
                                    };
                                    card.fix();
                                    card.remove();
                                    event.num++;
                                    'step 4'
                                    if (event.num < 2) event.goto(1);
                                    game.updateRoundNumber();
                                },
                            },
                            draw: {
                                trigger: {
                                    player: 'loseAfter',
                                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                                },
                                forced: true,
                                direct: true,
                                lastDo: true,
                                priority: -50,
                                filter: function (event, player) {
                                    var suits = [];
                                    var es = player.getCards('e');
                                    for (var i = 0; i < es.length; i++) {
                                        suits.add(get.suit(es[i]));
                                    }
                                    if (suits.length <= 0) return false;
                                    if (event.getl && !event.getl(player)) return false;
                                    return player.countCards('h') < suits.length;
                                },
                                content: function () {
                                    var suits = [];
                                    var es = player.getCards('e');
                                    for (var i = 0; i < es.length; i++) {
                                        suits.add(get.suit(es[i]));
                                    }
                                    if (suits.length > 0) player.drawTo(suits.length);
                                },
                            },
                        },
                    },
                    dcyuzhi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { target: 'useCardToTargeted' },
                        forced: true,
                        direct: true,
                        filter: function (event, player) {
                            if (player == event.player) return false;
                            if (event.card.name != 'sha') return false;
                            return true;
                        },
                        content: function () {
                            'step 0'
                            var list = [];
                            if (!player.hasSkill('dcyuzhi_buff') && player.countCards('e') > 0) list.push('出闪');
                            list.push('加伤');
                            if (list.length) {
                                event.list = list;
                            }
                            else event.finish();
                            'step 1'
                            if (event.list.length == 1) event._result = { control: event.list[0] };
                            else player.chooseControl(event.list, true).set('prompt', '〖逾制〗：选择一项').set('ai', function () {
                                if (event.list.contains('出闪') && !player.countCards('h', 'shan')) return '出闪';
                                return '加伤';
                            });
                            'step 2'
                            player.logSkill('dcyuzhi');
                            if (result.control == '出闪') {
                                player.addTempSkill('dcyuzhi_buff', { player: 'phaseBegin' });
                                player.chooseCard('e', true, '弃置一张装备区内的牌视为使用【闪】', function (card, player) {
                                    return get.type(card) == 'equip';
                                });
                            }
                            if (result.control == '加伤') {
                                player.addTempSkill('dcyuzhi_adddamage');
                                player.storage.dcyuzhi = {
                                    card: trigger.card,
                                    //player:event.targett,
                                }
                                event.finish();
                            }
                            'step 3'
                            if (result.bool) {
                                player.lose(result.cards[0], ui.discardPile, 'insert');
                                if (get.name(result.cards[0], player) == 'dchuashang_equip1') {
                                    event.goto(4);
                                }
                                if (get.name(result.cards[0], player) == 'dchuashang_equip2') {
                                    event.goto(4);
                                }
                                if (get.name(result.cards[0], player) == 'dchuashang_equip3') {
                                    event.goto(4);
                                }
                                if (get.name(result.cards[0], player) == 'dchuashang_equip4') {
                                    event.goto(4);
                                }
                                if (get.name(result.cards[0], player) == 'dchuashang_equip5') {
                                    event.goto(4);
                                }
                                else game.log(player, '弃置了', result.cards[0]);
                            }
                            event.finish();
                            'step 4'
                            game.updateRoundNumber();
                        },
                        subSkill: {
                            buff: {
                                onremove: function (player) {
                                    delete player.buff.dcyuzhi_buff;
                                },
                                trigger: {
                                    player: "chooseToUseBegin",
                                },
                                filter: function (event, player) {
                                    if (event.responded) return false;
                                    if (event.dcyuzhi_buff) return false;
                                    if (player.buff.dcyuzhi_buff == true) return false;
                                    if (!event.filterCard || !event.filterCard({
                                        name: 'shan'
                                    }, player, event)) return false;
                                    return true;
                                },
                                forced: true,
                                direct: true,
                                firstDo: true,
                                content: function () {
                                    "step 0"
                                    player.buff.dcyuzhi_buff = true;
                                    trigger.dcyuzhi_buff = true;
                                    trigger.untrigger();
                                    trigger.set('responded', true);
                                    trigger.result = {
                                        bool: true,
                                        card: {
                                            name: 'shan',
                                            isCard: true,
                                        }
                                    }
                                },
                            },
                            adddamage: {
                                onremove: function (player) {
                                    delete player.storage.dcyuzhi;
                                },
                                trigger: {
                                    player: "damageBegin3",
                                },
                                filter: function (event, player) {
                                    var info = player.storage.dcyuzhi;
                                    return event.card && event.card == info.card;
                                },
                                silent: true,
                                popup: false,
                                forced: true,
                                charlotte: true,
                                content: function () {
                                    trigger.num++;
                                },
                            },
                        },
                    },
                    //神魏延
                    shenzigu: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { source: 'damageSource' },
                        filter: function (event, player, name) {
                            if (player.countDisabled() >= 5) return false;
                            if (!player.countCards('h')) return false;
                            return player != event.player && event.player.isIn();
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            var prompt = '将一张手牌置入' + get.translation(trigger.player) + '的装备栏';
                            player.chooseCard(get.prompt('shenzigu'), 'h', prompt);
                            'step 1'
                            if (!result.bool) event.finish();
                            else {
                                player.logSkill('shenzigu');
                                trigger.player.storage.shenzigu = player;
                                event.cardx = result.cards[0];
                                event.number = get.number(result.cards[0]);
                                event.type = get.type2(result.cards[0]);
                                event.suit = get.suit(result.cards[0]);
                            }
                            'step 2'
                            var list = [];
                            for (var i = 1; i < 6; i++) {
                                if (trigger.player.isDisabled(i)) continue;
                                list.push('equip' + i);
                            }
                            if (list.length) {
                                event.list = list;
                            }
                            else event.finish();
                            'step 3'
                            if (event.list.length == 1) event._result = { control: event.list[0] };
                            else player.chooseControl(event.list, true).set('prompt', '选择' + get.translation(event.cardx) + '置入的装备栏');
                            'step 4'
                            event.choice = result.control;
                            var card = game.createCard('shenzigu_' + event.type + event.choice, event.suit, event.number);
                            trigger.player.$gain2(card);
                            game.delayx();
                            trigger.player.equip(card);
                            'step 5'
                            if (event.choice == 'equip1') {
                                if (event.type == 'basic') {
                                    trigger.player.storage.shenzigu_basicequip1 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    trigger.player.storage.shenzigu_trickequip1 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    trigger.player.storage.shenzigu_equipequip1 = event.cardx;
                                };
                            };
                            if (event.choice == 'equip2') {
                                if (event.type == 'basic') {
                                    trigger.player.storage.shenzigu_basicequip2 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    trigger.player.storage.shenzigu_trickequip2 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    trigger.player.storage.shenzigu_equipequip2 = event.cardx;
                                };
                            };
                            if (event.choice == 'equip3') {
                                if (event.type == 'basic') {
                                    trigger.player.storage.shenzigu_basicequip3 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    trigger.player.storage.shenzigu_trickequip3 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    trigger.player.storage.shenzigu_equipequip3 = event.cardx;
                                };
                            };
                            if (event.choice == 'equip4') {
                                if (event.type == 'basic') {
                                    trigger.player.storage.shenzigu_basicequip4 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    trigger.player.storage.shenzigu_trickequip4 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    trigger.player.storage.shenzigu_equipequip4 = event.cardx;
                                };
                            };
                            if (event.choice == 'equip5') {
                                if (event.type == 'basic') {
                                    trigger.player.storage.shenzigu_basicequip5 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    trigger.player.storage.shenzigu_trickequip5 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    trigger.player.storage.shenzigu_equipequip5 = event.cardx;
                                };
                            };
                            player.lose(event.cardx, ui.discardPile, 'insert');
                            event.cardx.fix();
                            event.cardx.remove();
                            game.updateRoundNumber();
                        },
                        group: ['shenzigu_effect', 'shenzigu_buff'],
                        subSkill: {
                            effect: {
                                trigger: { player: 'damageEnd' },
                                filter: function (event, player, name) {
                                    if (player.countDisabled() >= 5) return false;
                                    if (!player.countCards('h')) return false;
                                    return player != event.source && event.source.isIn();
                                },
                                direct: true,
                                content: function () {
                                    'step 0'
                                    var prompt = '将一张手牌置入' + get.translation(trigger.source) + '的装备栏';
                                    player.chooseCard(get.prompt('shenzigu'), 'h', prompt);
                                    'step 1'
                                    if (!result.bool) event.finish();
                                    else {
                                        player.logSkill('shenzigu');
                                        trigger.source.storage.shenzigu = player;
                                        event.cardx = result.cards[0];
                                        event.number = get.number(result.cards[0]);
                                        event.type = get.type2(result.cards[0]);
                                        event.suit = get.suit(result.cards[0]);
                                    }
                                    'step 2'
                                    var list = [];
                                    for (var i = 1; i < 6; i++) {
                                        if (trigger.source.isDisabled(i)) continue;
                                        list.push('equip' + i);
                                    }
                                    if (list.length) {
                                        event.list = list;
                                    }
                                    else event.finish();
                                    'step 3'
                                    if (event.list.length == 1) event._result = { control: event.list[0] };
                                    else player.chooseControl(event.list, true).set('prompt', '选择' + get.translation(event.cardx) + '置入的装备栏');
                                    'step 4'
                                    event.choice = result.control;
                                    var card = game.createCard('shenzigu_' + event.type + event.choice, event.suit, event.number);
                                    trigger.source.$gain2(card);
                                    game.delayx();
                                    trigger.source.equip(card);
                                    'step 5'
                                    if (event.choice == 'equip1') {
                                        if (event.type == 'basic') {
                                            trigger.source.storage.shenzigu_basicequip1 = event.cardx;
                                        };
                                        if (event.type == 'trick') {
                                            trigger.source.storage.shenzigu_trickequip1 = event.cardx;
                                        };
                                        if (event.type == 'equip') {
                                            trigger.source.storage.shenzigu_equipequip1 = event.cardx;
                                        };
                                    };
                                    if (event.choice == 'equip2') {
                                        if (event.type == 'basic') {
                                            trigger.source.storage.shenzigu_basicequip2 = event.cardx;
                                        };
                                        if (event.type == 'trick') {
                                            trigger.source.storage.shenzigu_trickequip2 = event.cardx;
                                        };
                                        if (event.type == 'equip') {
                                            trigger.source.storage.shenzigu_equipequip2 = event.cardx;
                                        };
                                    };
                                    if (event.choice == 'equip3') {
                                        if (event.type == 'basic') {
                                            trigger.source.storage.shenzigu_basicequip3 = event.cardx;
                                        };
                                        if (event.type == 'trick') {
                                            trigger.source.storage.shenzigu_trickequip3 = event.cardx;
                                        };
                                        if (event.type == 'equip') {
                                            trigger.source.storage.shenzigu_equipequip3 = event.cardx;
                                        };
                                    };
                                    if (event.choice == 'equip4') {
                                        if (event.type == 'basic') {
                                            trigger.source.storage.shenzigu_basicequip4 = event.cardx;
                                        };
                                        if (event.type == 'trick') {
                                            trigger.source.storage.shenzigu_trickequip4 = event.cardx;
                                        };
                                        if (event.type == 'equip') {
                                            trigger.source.storage.shenzigu_equipequip4 = event.cardx;
                                        };
                                    };
                                    if (event.choice == 'equip5') {
                                        if (event.type == 'basic') {
                                            trigger.source.storage.shenzigu_basicequip5 = event.cardx;
                                        };
                                        if (event.type == 'trick') {
                                            trigger.source.storage.shenzigu_trickequip5 = event.cardx;
                                        };
                                        if (event.type == 'equip') {
                                            trigger.source.storage.shenzigu_equipequip5 = event.cardx;
                                        };
                                    };
                                    player.lose(event.cardx, ui.discardPile, 'insert');
                                    event.cardx.fix();
                                    event.cardx.remove();
                                    game.updateRoundNumber();
                                },
                            },
                            buff: {
                                trigger: { player: 'equipAfter' },
                                direct: true,
                                filter: function (event, player) {
                                    return !player.hasSkill('shenzigu_block');
                                },
                                content: function () {
                                    'step 0'
                                    player.addTempSkill('shenzigu_block');
                                    if (!(function (current) {
                                        return current != player;
                                    })) {
                                        event.finish();
                                    }
                                    player.chooseTarget(get.prompt('shenzigu'), '对一名其他角色造成一点伤害并获得一张伤害牌', function (card, player, target) {
                                        return target != player;
                                    }).set('ai', function (target) {
                                        var player = _status.event.player;
                                        return get.damageEffect(target, player, player);
                                    });
                                    "step 1"
                                    if (result.bool && result.targets && result.targets.length) {
                                        player.logSkill('shenzigu', result.targets);
                                        player.line(result.targets[0], 'fire');
                                        result.targets[0].damage();
                                        var card = get.cardPile2(card => {
                                            return get.tag(card, 'damage');
                                        });
                                        if (card) player.gain(card, 'gain2');
                                    }
                                },
                            },
                            block: { charlotte: true },
                        },
                    },
                    shenezhi: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { global: 'useCard' },
                        forced: true,
                        filter: function (event, player) {
                            if (event.player.hasCard(function (card) {
                                return get.name(card, event.player).includes('shenzigu_');
                            }, 'e')) return true;
                            return false;
                        },
                        content: function () {
                            'step 0'
                            player.draw(2);
                            var targetx = trigger.player;
                            event.targetx = targetx;
                            var cardx = trigger.card;
                            event.cardx = cardx;
                            player.choosePlayerCard(targetx, 'e', true).set('prompt', '弃置一张“骨”').set('filterButton', button => {
                                return get.name(button.link, _status.event.target).includes('shenzigu_');
                            }).set('target', targetx);
                            'step 1'
                            if (result.bool) {
                                var card = result.links[0];
                                event.card = card;
                                event.targetx.discard(event.card, 'notBySelf').discarder = player;
                            }
                            else event.finish();
                            'step 2'
                            var type = get.type2(event.card);
                            if (get.name(event.card).includes('_' + get.type2(event.cardx))) {
                                trigger.targets.length = 0;
                                trigger.all_excluded = true;
                            }
                            else {
                                player.addTempSkill('shenezhi_buff');
                                player.markAuto('shenezhi_buff', [event.targetx]);
                            }
                        },
                        group: ['shenezhi_effect', 'shenezhi_record'],
                        subSkill: {
                            buff: {
                                charlotte: true,
                                onremove: true,
                                intro: { content: '本回合对$使用牌无距离限制' },
                                mod: {
                                    targetInRange: function (card, player, target) {
                                        if (player.getStorage('shenezhi_buff').contains(target)) return true;
                                    },
                                },
                            },
                            effect: {
                                trigger: { player: 'phaseEnd' },
                                direct: true,
                                content: function () {
                                    'step 0'
                                    event.cards = [];
                                    for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
                                        var card = ui.cardPile.childNodes[i];
                                        if (player.getStorage('shenezhi_effect').contains(card)) event.cards.push(card);
                                    }
                                    for (var j = 0; j < ui.discardPile.childNodes.length; j++) {
                                        var card = ui.discardPile.childNodes[j];
                                        if (player.getStorage('shenezhi_effect').contains(card)) event.cards.push(card);
                                    }
                                    if (!event.cards.length) event.finish();
                                    'step 1'
                                    player.chooseButton(['恶峙：是否使用其中的一张牌？', cards]).set('filterButton', button => {
                                        return _status.event.player.hasUseTarget(button.link);
                                    }).set('ai', button => {
                                        var player = _status.event.player, card = button.link, cards = _status.event.getParent().cards;
                                        var val = player.getUseValue(card) + 0.01;
                                        return get.order(card) + val / 5;
                                    });
                                    'step 2'
                                    if (result.bool) {
                                        var card = result.links[0];
                                        event.cards.remove(card);
                                        player.$gain2(card, false);
                                        game.delayx();
                                        player.chooseUseTarget(true, card, false).set('logSkill', 'shenezhi');
                                    }
                                    else event.finish();
                                    'step 3'
                                    if (cards.some(i => (get.position(i, true) == 'p' || get.position(i, true) == 'd') && player.hasUseTarget(i))) event.goto(1);
                                },
                            },
                            record: {
                                trigger: { global: 'phaseBegin' },
                                firstDo: true,
                                direct: true,
                                content: function () {
                                    delete player.storage.shenezhi_effect;
                                },
                            },
                        },
                    },
                    shengujing: {
                        audio: 'ext:柊舞缇娜/audio:1',
                        limited: true,
                        enable: 'phaseUse',
                        skillAnimation: true,
                        animationColor: 'fire',
                        filter: function (event, player) {
                            if (player.countCards('h') > 0 && game.hasPlayer(function (current) {
                                return current != player && current.countDisabled() < 5;
                            })) return true;
                            return game.hasPlayer(function (current) {
                                return current.hasCard(function (card) {
                                    return get.name(card, current).includes('shenzigu_');
                                }, 'e')
                            });
                        },
                        content: function () {
                            "step 0"
                            player.awakenSkill('shengujing');
                            if (!player.countCards('h')) event.goto(6);
                            else player.chooseCardTarget({
                                position: 'h',
                                filterCard: true,
                                filterTarget: function (card, player, target) {
                                    return target != player && target.countDisabled() < 5;
                                },
                                ai1: function (card) {
                                    return 9 - get.value(card);
                                },
                                ai2: function (target) {
                                    var player = _status.event.player;
                                    return -get.attitude(player, target);
                                },
                                prompt: get.prompt('shengujing'),
                                prompt2: "将一张手牌作为“骨”置入场上一名其他角色的装备栏",
                            });
                            "step 1"
                            if (result.bool) {
                                var targetx = result.targets[0];
                                event.targetx = targetx;
                                player.line(event.targetx, 'fire');
                                event.targetx.storage.shenzigu = player;
                                event.cardx = result.cards[0];
                                event.number = get.number(result.cards[0]);
                                event.type = get.type2(result.cards[0]);
                                event.suit = get.suit(result.cards[0]);
                            }
                            else {
                                event.finish();
                            }
                            'step 2'
                            var list = [];
                            for (var i = 1; i < 6; i++) {
                                if (event.targetx.isDisabled(i)) continue;
                                list.push('equip' + i);
                            }
                            if (list.length) {
                                event.list = list;
                            }
                            else event.finish();
                            'step 3'
                            if (event.list.length == 1) event._result = { control: event.list[0] };
                            else player.chooseControl(event.list, true).set('prompt', '选择' + get.translation(event.cardx) + '置入的装备栏');
                            'step 4'
                            event.choice = result.control;
                            var card = game.createCard('shenzigu_' + event.type + event.choice, event.suit, event.number);
                            event.targetx.$gain2(card);
                            game.delayx();
                            event.targetx.equip(card);
                            'step 5'
                            if (event.choice == 'equip1') {
                                if (event.type == 'basic') {
                                    event.targetx.storage.shenzigu_basicequip1 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    event.targetx.storage.shenzigu_trickequip1 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    event.targetx.storage.shenzigu_equipequip1 = event.cardx;
                                };
                            };
                            if (event.choice == 'equip2') {
                                if (event.type == 'basic') {
                                    event.targetx.storage.shenzigu_basicequip2 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    event.targetx.storage.shenzigu_trickequip2 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    event.targetx.storage.shenzigu_equipequip2 = event.cardx;
                                };
                            };
                            if (event.choice == 'equip3') {
                                if (event.type == 'basic') {
                                    event.targetx.storage.shenzigu_basicequip3 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    event.targetx.storage.shenzigu_trickequip3 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    event.targetx.storage.shenzigu_equipequip3 = event.cardx;
                                };
                            };
                            if (event.choice == 'equip4') {
                                if (event.type == 'basic') {
                                    event.targetx.storage.shenzigu_basicequip4 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    event.targetx.storage.shenzigu_trickequip4 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    event.targetx.storage.shenzigu_equipequip4 = event.cardx;
                                };
                            };
                            if (event.choice == 'equip5') {
                                if (event.type == 'basic') {
                                    event.targetx.storage.shenzigu_basicequip5 = event.cardx;
                                };
                                if (event.type == 'trick') {
                                    event.targetx.storage.shenzigu_trickequip5 = event.cardx;
                                };
                                if (event.type == 'equip') {
                                    event.targetx.storage.shenzigu_equipequip5 = event.cardx;
                                };
                            };
                            player.lose(event.cardx, ui.discardPile, 'insert');
                            event.cardx.fix();
                            event.cardx.remove();
                            game.updateRoundNumber();
                            'step 6'
                            if (!game.hasPlayer(function (current) {
                                return current.hasCard(function (card) {
                                    return get.name(card, current).includes('shenzigu_');
                                }, 'e')
                            })) event.finish();
                            'step 7'
                            player.chooseTarget([1, Infinity], function (card, player, target) {
                                return target != player && target.hasCard(function (card) {
                                    return get.name(card, target).includes('shenzigu_');
                                }, 'e');
                            }, get.prompt('shengujing'), '弃置任意名其它角色的各一张“骨”并废除其对应装备栏').set('ai', function (target) {
                                var player = _status.event.player;
                                return -get.attitude(player, target);
                            });
                            'step 8'
                            if (result.bool) {
                                player.addSkill('shengujing_gain');
                                var targets = result.targets.sortBySeat();
                                event.targets = targets;
                                event.num = 0;
                            }
                            else event.finish();
                            'step 9'
                            var target = targets[num];
                            var next = game.createEvent('shengujing');
                            next.player = player;
                            next.target = target;
                            next.setContent(lib.skill.shengujing.contentx);
                            event.num++;
                            if (event.num < targets.length) event.redo();
                        },
                        contentx: function () {
                            'step 0'
                            player.choosePlayerCard(target, 'e', true).set('prompt', '弃置一张“骨”').set('filterButton', button => {
                                return get.name(button.link, _status.event.target).includes('shenzigu_');
                            }).set('target', target);
                            'step 1'
                            if (result.bool) {
                                var card = result.links[0];
                                event.card = card;
                                target.discard(event.card, 'notBySelf').discarder = player;
                            }
                            else event.finish();
                            'step 2'
                            if (get.subtype(event.card) == 'equip1') {
                                target.disableEquip(1);
                            };
                            if (get.subtype(event.card) == 'equip2') {
                                target.disableEquip(2);
                            };
                            if (get.subtype(event.card) == 'equip3') {
                                target.disableEquip(3);
                            };
                            if (get.subtype(event.card) == 'equip4') {
                                target.disableEquip(4);
                            };
                            if (get.subtype(event.card) == 'equip5') {
                                target.disableEquip(5);
                            };
                        },
                        subSkill: {
                            gain: {
                                audio: 'shengujing',
                                trigger: { global: ['gainAfter', 'loseAsyncAfter'] },
                                filter: function (event, player) {
                                    return game.hasPlayer(function (current) {
                                        if (!event.getg(current).length || current.countDisabled() < 1 || current == player) return false;
                                        return event.getg(current).some(card => current.isDisabled(get.subtype(card, current)) && lib.filter.canBeGained(card, current, player));
                                    });
                                },
                                firstDo: true,
                                charlotte: true,
                                forced: true,
                                content: function () {
                                    'step 0'
                                    var target = game.findPlayer(function (current) {
                                        if (!trigger.getg(current).length || current.countDisabled() < 1 || current == player) return false;
                                        return trigger.getg(current).some(card => current.isDisabled(get.subtype(card, current)) && lib.filter.canBeGained(card, current, player));
                                    });
                                    event.target = target;
                                    var cards = trigger.getg(target).filter(card => target.isDisabled(get.subtype(card, target)) && lib.filter.canBeGained(card, target, player));
                                    event._result = { bool: true, links: cards };
                                    'step 1'
                                    if (result.bool) {
                                        player.gain(result.links, target, 'give');
                                    }
                                },
                            },
                        },
                    },
                    //乐蔡邕
                    dcyuejiaowei: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        group: 'dcyuejiaowei_buff',
                        mod: {
                            ignoredHandcard: function (card, player) {
                                if (card.hasGaintag('dcyuejiaowei')) return true;
                            },
                            cardDiscardable: function (card, player, name) {
                                if (name == 'phaseDiscard' && card.hasGaintag('dcyuejiaowei')) return false;
                            },
                        },
                        trigger: { global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'], player: 'loseAfter' },
                        filter: function (event, player) {
                            var evt = event.getl(player);
                            if (!evt || !evt.cards2 || !evt.cards2.length) return false;
                            if (event.name == 'lose') {
                                for (var i in event.gaintag_map) {
                                    if (event.gaintag_map[i].contains('dcyuejiaowei')) return !player.hasSkill('dcyuejiaowei_effect');
                                }
                                return false;
                            }
                            return player.hasHistory('lose', function (evt) {
                                if (event != evt.getParent()) return false;
                                for (var i in evt.gaintag_map) {
                                    if (evt.gaintag_map[i].contains('dcyuejiaowei')) return !player.hasSkill('dcyuejiaowei_effect');
                                }
                                return false;
                            });
                        },
                        content: function () {
                            player.addTempSkill('dcyuejiaowei_effect');
                        },
                        forced: true,
                        subSkill: {
                            buff: {
                                audio: 'dcyuejiaowei',
                                trigger: { global: 'phaseBefore', player: 'enterGame' },
                                forced: true,
                                lastDo: true,
                                filter: function (event, player) {
                                    return (event.name != 'phase' || game.phaseNumber == 0) && player.countCards('h') > 0;
                                },
                                content: function () {
                                    player.addGaintag(player.getCards('h'), 'dcyuejiaowei');
                                },
                            },
                            effect: {
                                audio: 'dcyuejiaowei',
                                charlotte: true,
                                trigger: { player: 'damageBegin2' },
                                forced: true,
                                filter: function (event, player) {
                                    return event.num > 0;
                                },
                                priority: -50,
                                content: function () {
                                    trigger.cancel();
                                    game.log(player, '防止了伤害');
                                    player.removeSkill('dcyuejiaowei_effect');
                                },
                                mark: true,
                                intro: { content: '防止本回合下一次受到的伤害' },
                            },
                        },
                    },
                    dcyuefeibai: {
                        audio: 'ext:柊舞缇娜/audio:2',
                        trigger: { player: 'useCardAfter' },
                        direct: true,
                        filter: function (event, player) {
                            return !player.hasSkill('dcyuefeibai_block');
                        },
                        content: function () {
                            'step 0'
                            event.cards = [];
                            var num = 0;
                            var evt = player.getLastUsed(1);
                            if (evt && evt.card) num += lib.skill.dcweidang.getLength(evt.card);
                            num += lib.skill.dcweidang.getLength(trigger.card);
                            for (var i = 0; i < 2; i++) {
                                var cardP = get.cardPile2(function (card) {
                                    return !event.cards.contains(card) && lib.skill.dcweidang.getLength(card) == num;
                                });
                                if (cardP) event.cards.push(cardP);
                                else {
                                    var cardD = get.discardPile(function (card) {
                                        return !event.cards.contains(card) && lib.skill.dcweidang.getLength(card) == num;
                                    });
                                    if (cardD) event.cards.push(cardD);
                                }
                            }
                            'step 1'
                            if (event.cards.length > 0) player.chooseCardButton(event.cards, '飞白：是否选择一张牌获得').set('ai', function (card) {
                                return get.value(card);
                            });
                            else event.goto(3);
                            'step 2'
                            if (result.bool) {
                                player.logSkill('dcyuefeibai');
                                player.gain(result.links, 'draw');
                            }
                            event.finish();
                            'step 3'
                            player.chooseBool(get.prompt('dcyuefeibai'), '摸两张牌并标记为“弦”，然后此技能本回合失效').set('ai', function () {
                                return !player.countCards('hs', function (card) {
                                    return player.hasUseTarget(card, true, true);
                                });
                            });
                            'step 4'
                            if (result.bool) {
                                player.logSkill('dcyuefeibai');
                                player.draw(2).gaintag = ['dcyuejiaowei'];
                                player.addTempSkill('dcyuefeibai_block');
                            }
                        },
                        subSkill: {
                            block: { charlotte: true, mark: true, intro: { content: '本回合失效' } },
                        },
                    },
                },
                translate: {
                    ol_sunhanhua: '孙寒华',
                    olhuaguang: '华光',
                    olhuaguang_info: '准备阶段、出牌阶段限一次，你可以选择一项：①将【彩莲】置入一个装备栏； ②修改【彩莲】花色。',
                    olxuanbai: '玄白',
                    olxuanbai_info: '锁定技，当【彩莲】进入你的一个装备栏后，你切换为不同的形态：武器栏（荡魔）；防具栏（济惠）；宝物栏（霞举）。',
                    oldangmo: '荡魔',
                    oldangmo_info: '锁定技，当你使用伤害牌指定唯一目标时选择一项：①令此牌额外结算一次；②令此牌目标数+1。',
                    oljihui: '济惠',
                    oljihui_info: '锁定技，当一名角色回复体力后，你摸一张牌。你本轮首次失去牌数大于体力值后，你获得一张【桃】。',
                    olxiaju: '霞举',
                    olxiaju_info: '锁定技，你每回合首次失去牌后，你获得一张未拥有花色的牌。然后若你拥有四种花色的牌，你下次发动此技能获得的牌数+1。',
                    cailian_skill: '彩莲',
                    cailian_skill_info: '锁定技，你每轮首次造成的伤害与回复+1，且你与此牌花色相同的手牌不计入手牌上限。',
                    ol_re_xiahoushi: '界夏侯氏',
                    olqiaoshi: '樵拾',
                    olqiaoshi_info: '每个结束阶段，你可以与当前回合角色各摸一张牌。然后若其与你手牌数不相等，此技能本轮失效。',
                    olyanyu: '燕语',
                    olyanyu_info: '出牌阶段，你可以重铸【杀】。出牌阶段结束时，若你本阶段失去过至少两张【杀】，你可以令一名男性角色摸两张牌。',
                    yue_caozhi: '乐曹植',
                    dcyuefuyue: '赋乐',
                    dcyuefuyue_info: '锁定技，①你的初始手牌增加“赋”标记（“赋”牌不计入你的手牌上限）；②“赋”牌随机获得另一种非装备牌牌名，你使用“赋”牌时可选择使用该牌所拥有的任意一种牌名。',
                    dcyuewenlan: '文澜',
                    dcyuewenlan_info: '你每累计使用与打出两张牌结算后，若这两张牌均为有相同牌名的“赋”，则你从牌堆中获得这两张“赋”所含牌名的牌各一张并均标记为“赋”，否则你选择任意张手牌并替换其中“赋”的额外牌名然后标记其余牌为“赋”。',
                    ca_zhouyu: '势周瑜',
                    ca_zhouyu1: '势周瑜',
                    ca_zhouyu2: '势周瑜',
                    cachiyun: '炽沄',
                    cachiyun_info: '你每阶段首次获得牌后，可交给一名其他角色任意张手牌，其选择一项：【1】展示所有与这些牌颜色相同的手牌，你对其造成一点火焰伤害；【2】你摸两张牌，其横置。',
                    cayanhui: '焰洄',
                    cayanhui_info: '当你使用牌指定目标后，可以展示目标角色的一张手牌，若此牌本回合已被展示过，你弃置之。此阶段结束时，你选择一项：【1】对一名本阶段因此弃置过牌的角色造成1点火焰伤害；【2】摸X张牌（X为本回合展示过牌的角色数）。',
                    cayanhuix: '焰洄',
                    cayanhuix_info: '当你使用牌指定目标后，可以展示目标角色的一张手牌，若此牌本回合已被展示过，你弃置之。此阶段结束时，你选择一项：【1】对一名本阶段因此弃置过牌的角色造成1点火焰伤害；【2】摸X张牌（X为本回合展示过牌的角色数）。',
                    cafentao: '焚涛',
                    cafentao_info: '锁定技，一名已横置的其他角色受到火焰伤害时，其选择一项：【1】此次传导中的伤害+1；【2】弃置半数牌（向上取整）且此伤害结算结束后其横置。',
                    caxiongzi: '雄姿',
                    caxiongzi_info: '限定技，准备阶段，你可令〖炽沄〗、〖焰洄〗和〖焚涛〗只能在你回合内发动。若如此做，你移除这些技能中全部的选项一或选项二，然后你摸两张牌。',
                    caxiongzi_blue: '雄姿',
                    caxiongzi_blue_info: '限定技，准备阶段，你可令〖炽沄〗、〖焰洄〗和〖焚涛〗只能在你回合内发动。若如此做，你移除这些技能中全部的选项一或选项二，然后你摸两张牌。',
                    caxiongzi_red: '雄姿',
                    caxiongzi_red_info: '限定技，准备阶段，你可令〖炽沄〗、〖焰洄〗和〖焚涛〗只能在你回合内发动。若如此做，你移除这些技能中全部的选项一或选项二，然后你摸两张牌。',
                    calulian: '戮连',
                    calulian_info: '出牌阶段限一次，你可以弃置任意张花色各不同的牌，令攻击范围内的所有角色同时选择是否交给你一张牌，然后你本回合造成的下X次伤害+1（X为未交给你牌的角色数）。',
                    canigu: '逆固',
                    canigu_info: '锁定技，当你使用手牌结算后，若你没有此类别的手牌，且有目标角色：体力值不大于你，横置此牌所有目标；装备区牌数不大于你，你摸一张牌。乘势：你对一名体力值不为最小的角色造成一点火焰伤害。',
                    twguose: '帼色',
                    twguose_info: '有角色受伤状态变化后，若其判定区没有【乐不思蜀】，你可以将你或其的一张牌当作【乐不思蜀】置入其判定区中，然后你摸两张牌。每轮限一次，有【乐不思蜀】判定生效后，你可以令此【乐不思蜀】改为跳过弃牌阶段。',
                    twliuli: '流俪',
                    twliuli_info: '有角色成为伤害牌的目标后，你可以弃置其场上的一张方片牌，令此牌对其无效，然后若其受伤状态与你相同，你摸两张牌。',
                    wu_zhangfei: '武张飞',
                    dczisheng: '恣胜',
                    dczisheng_info: '你使用点数大于3且为3的倍数的牌时（若为多张牌转化为一张牌则点数相加），可以从牌堆中随机观看三张点数为3的牌，选择其中一张获得；你弃置或获得其他角色牌时，可以对该角色造成等量伤害（不超过该角色当前体力值）。',
                    dcxianlue: '显略',
                    dcxianlue_info: '①出牌阶段每名角色限一次，你可以观看本回合受到过伤害或失去过牌的一名其他角色的手牌并记录其中所有当前未被记录的点数；②当本次记录点数的数量增加后首次分别超过3、6、9个时，你摸三张牌。若已因此记录至可记录点数上限，则清除记录且【豪贤】视为未发动过；③你每次造成伤害令其他角色进入濒死状态后，本次记录可记录点数上限减少3个。',
                    dchaoxian: '豪贤',
                    dchaoxian_info: '限定技，出牌阶段，你可以将弃牌堆中所有点数为3的牌随机置入牌堆，然后获得其他角色手牌中点数为3的牌。',
                    dc_cuizhi: '崔芷',
                    dcranlv: '燃缕',
                    dcranlv_info: '有角色受到非属性伤害后，你可以选择一项执行且执行后移除：①横置或重置至多两名角色；②摸两张牌；③弃置一名角色两张牌。',
                    dcjuexun: '绝殉',
                    dcjuexun_info: '每回合限一次，你失去手牌后若手牌数为全场最少，你可以重置“燃缕”，然后可以对自己造成一点火焰伤害，若你因此体力值变为全场最少，你令处于横置状态的其他角色下次受到的火焰伤害+1。',
                    dc_lizhaoyi: '李昭仪',
                    dcmingjie: '明节',
                    dcmingjie_info: '游戏开始时，你选择一名其他角色，你与其获得对方因弃牌阶段弃置的牌。你或其的一个阶段被跳过时各摸两张牌并可以令另一方防止下次受到的伤害。所选角色阵亡时，你立即阵亡。',
                    dcxianfu: '娴辅',
                    dcxianfu_info: '每回合限一次，你成为牌的目标时，可以跳过你下个回合的除准备和结束阶段外的当前未被选择跳过的一个阶段并令此牌对你无效，然后你与“明节”角色互相依次观看对方手牌并可以依次获得其中至多三张手牌。',
                    dcwuyan: '妩艳',
                    dcwuyan_info: '出牌阶段，或当你受到伤害后，你可以令一名男性角色选择是否对你选择的另一名其他角色使用一张手牌（无距离限制，若为【杀】则无次数限制）。若其：使用牌，你摸两张牌；未使用牌或未造成伤害，你可以令其失去一点体力且此技能本阶段失效。',
                    dczhanyu: '占欲',
                    dczhanyu_info: '回合开始时，你可以展示一张手牌，令所有其他角色随机弃置一张此花色的手牌，然后你可以获得其中一张。',
                    kongshu: '孔淑',
                    leiluan: '累卵',
                    leiluan_info: '你可以将已连环的角色数张牌（至少为一）当一张基本牌使用（你本轮使用过的基本牌除外）。若你以此法失去最后的手牌，你摸两张牌，从本回合弃牌堆中获得一张普通锦囊牌，然后此技能失效直到你下次受到伤害后。',
                    fuchao: '覆巢',
                    fuchao_info: '锁定技，①每轮结束时，你与已横置的角色各摸一张牌，然后已横置的角色弃置横置的角色数张牌（至少为一）。②你使用基本牌后，横置当前回合角色。',
                    sxrm_caocao: '魔曹操',
                    sxrmkuxin: "枯心",
                    sxrmkuxin_info: "当你受到伤害后，你可以令所有其他角色展示任意张手牌，然后你选择一项：①获得所有角色展示的牌；②获得一名其他角色未展示的所有手牌并展示之。若你以此法没有获得♥牌，则你先弃置以此法获得的牌，然后你翻面并摸一张牌。",
                    sxrmsigu: "似故",
                    sxrmsigu_info: "出牌阶段限一次，你可以令一名其他角色判定并对其造成两次一点伤害，判定后到此伤害结算期间其视为拥有第判定点数个技能：【A】“智迟”【2】“刚烈”【3】“反馈”【4】“遗计”【5】“节命”【6】“放逐”【7】“矢北”【8】“称象”【9】“智愚”【10】“鸡肋”【J】“贲育”【Q】“筹策”【K】“武魂”。",
                    sxrmkuimu: "窥目",
                    sxrmkuimu_info: "每轮限一次，当一名角色的判定牌生效前，你可以观看其所有手牌并用其中一张代替之，若两张牌的花色不同，其对你造成一点伤害。",
                    dc_zhangyu: '张裕',
                    dcxiangchen: '相谶',
                    dcxiangchen_info: '出牌阶段限一次或当你或上次发动“相谶”选择的目标角色体力值变化后，你可以选择一名角色并随机出现与其势力和初始体力值相等的武将的三个不为限定技、觉醒技、主公技的技能，然后你从中选择一个获得，你的回合结束时失去以此法获得的技能（以此法获得的技能存在三个时再次发动改为可以选择一名角色并摸一张牌)。',
                    dcmingding: '命定',
                    dcmingding_info: '限定技，你进入濒死状态时，你可以将体力值回复至一点，然后防止你之后受到的伤害直到你的下个回合结束。若如此做，你失去除“命定”外的所有技能，你摸发动“相谶”获得过的技能数张牌（至多五张）并随机获得其中三个技能，然后你的回合结束时你失去所有体力。',
                    twjianyan: '翦魇',
                    twjianyan_info: '持恒技，游戏开始时，你令所有角色获得〖虎踞〗。当有角色进入濒死状态时，你可以选择任意名角色失去〖虎踞〗（数量可为以0），然后你回复等量体力并获得等量的非伤害牌，将其余角色的〖虎踞〗转化为 “阴”，然后入幻。',
                    twliwu: '厉伍',
                    twliwu_info: '锁定技，有角色的受伤状态发生变化后，你摸一张牌，若其中有基本牌，你下一次造成的伤害+1。',
                    twsaoting: '扫庭',
                    twsaoting_info: '转换技，阳：你可以将一张伤害牌当【决斗】使用；阴：你可以将一张伤害牌当【酒】使用。若你以此法使用牌指定了已受伤角色为目标时，你摸一张牌。',
                    twjizhi: '寄志',
                    twjizhi_info: '持恒技，当你进入濒死状态时，你可以选择任意名角色失去〖虎踞〗，然后你回复等量体力并摸等量的伤害牌。将其余角色的〖虎踞〗转化为 “阳”，然后退幻。',
                    twsuzhen: '肃阵',
                    twsuzhen_info: '锁定技，有角色的受伤状态发生变化后，你获得其一张牌（若目标为你，则改为展示），若其中有基本牌，你回复一点体力。',
                    twdangjiang: '荡江',
                    twdangjiang_info: '转换技，阳：你可以将一张非伤害牌当任意【无中生有】使用；阴：你可以将一张非伤害牌当无距离限制的【杀】使用。若你以此法使用牌指定了未受伤角色为目标时，你摸一张牌。',
                    huan_hp: '受伤状态变化',
                    twhuju: '虎踞',
                    twhuju_info: '锁定技，转换技。阳，你令〖翦魇〗拥有者的手牌上限+1；阴，你令〖寄志〗拥有者的出【杀】次数+1。',
                    mb_lingju: '新灵雎',
                    sbjieyuan: '竭缘',
                    sbjieyuan_info: '当你造成/受到伤害时，你可以选择一项：①弃置一张黑色牌/红色牌，令此伤害+1/-1；②获得一张黑色牌/红色牌。③“背水”：删除另一个时机的效果，然后你修改此技能，最后你失去此选项。',
                    sbfenxin: '焚心',
                    sbfenxin_info: '被你杀死的角色亮出其身份牌前，你可以选择一项：【1】其亮出身份后，若其与你阵营不同，获得其武将牌上的所有技能（限定技、觉醒技、使命技、主公技和持恒技除外）；【2】与其交换身份牌（你与其的身份牌非明置时方可选择）。',
                    dcwangzi: '望资',
                    dcwangzi_info: '每轮限一次，其他角色的出牌阶段开始时，你可以弃置至多五张牌，令其从牌堆获得等量黑色牌，此阶段其使用这些牌后你与其各摸一张牌。',
                    dcherong: '和戎',
                    dcherong_info: '出牌阶段限一次，你可以展示一名其他角色的一张手牌，然后你选择一张手牌与其交换，若这两张牌：①类型相同，防止你下次受到的伤害，你与其各从牌堆获得一张装备牌；②类型不同，你弃置其两张牌，然后你对其造成一点伤害。',
                    yue_zhugeguo: '乐诸葛果',
                    dcxidi: '羲笛',
                    dcxidi_info: '锁定技。①游戏开始时，你将所有手牌标记为“笛”。②你的“笛”牌不计入手牌上限。③准备阶段，若你的手牌中有“笛”，则你观看牌堆顶X张牌，然后将这些牌以任意顺序置于牌堆顶和牌堆底（X为你手牌中的“笛”数，且X至多为5）。',
                    dcchengyan: '乘烟',
                    dcchengyan_info: '出牌阶段，当你使用【杀】或普通锦囊牌指定其他角色为目标后，你可以摸一张牌并展示。若此牌为【杀】或普通锦囊牌，则你将使用牌的效果改为展示牌的效果，否则你摸一张牌并标记为“笛”牌。',
                    sbfm_baosanniang: '谋鲍三娘',
                    sbfmwuniang: '武娘',
                    sbfmwuniang_info: '你可以将一张非基本牌当无距离限制且不可响应的【杀】使用。然后你获得一名目标角色的一张牌，若不为基本牌，你可以失去一点体力然后令所有角色的〖镇南〗视为未发动过。',
                    sbfmzhennan: '镇南',
                    sbfmzhennan_info: '限定技，准备阶段，你可以弃置两张牌，视为使用一张由你指定任意目标的【南蛮入侵】。然后若你对指定目标：造成了伤害，其随机弃置一张牌；未造成伤害，你本回合对其使用牌无次数限制。',
                    sbfmxushen: '许身',
                    sbfmxushen_info: '限定技，当你进入濒死状态时，你可以令一名其他角色选择一项：①其失去所有技能获得〖征南〗；②其获得〖镇南〗。',
                    ol_lvlingqi: '吕玲绮',
                    olqiwu: '绮武',
                    olqiwu_info: '出牌阶段限一次，你可以弃置任意张牌，视为使用一张无距离和次数限制的【杀】，目标角色需弃置x张牌（X为你弃置牌的花色数）。若你与其因此弃置的牌：包含【闪】，你获得弃置的【闪】，且本回合不计入手牌上限；不包含【闪】，此【杀】不可响应。',
                    olzhuangrong: '妆戎',
                    olzhuangrong_info: '①回合开始时，将【束发紫金冠】【玲珑狮蛮带】【红棉百花袍】【无双方天戟】中的随机一件置入你的对应空置装备栏。②每局游戏限一次，每回合结束时，若你发动过这些装备效果至少两次，你增加一点体力上限，回复一点体力。',
                    mb_baosanniang: '新鲍三娘',
                    mb_shuyong: '姝勇',
                    mb_shuyong_info: '当你使用或打出【杀】时，你可以获得一名其他角色区域内的一张牌。若本轮你以此法获得过其区域内的牌，其摸一张牌。',
                    mb_xushen: '许身',
                    mb_xushen_info: '限定技，出牌阶段，你可以摸至多三张牌并失去等量体力，若你因此进入濒死状态，则当你脱离濒死状态后，你可以将〖武圣〗、〖当先〗和〖制蛮〗分配给本次濒死结算中令你回复过体力的角色（若其已拥有对应技能则摸三张牌）。',
                    mb_zhennan: '镇南',
                    mb_zhennan_info: '当一名角色使用普通锦囊牌指定首个目标后，若目标对应的角色中有你且此牌指定目标数大于此牌的使用者的体力值（至少为一），你可以弃置一张牌对一名角色造成一点伤害。',
                    mb_wusheng: '武圣',
                    mb_wusheng_info: '你可以将一张红色牌当做【杀】使用或打出。你使用的方片【杀】没有距离限制。',
                    mb_dangxian: '当先',
                    mb_dangxian_info: '锁定技，回合开始时，你从弃牌堆中获得一张【杀】并进行一个额外的出牌阶段。',
                    mb_zhiman: '制蛮',
                    mb_zhiman_info: '当你对一名其他角色造成伤害时，你可以防止此伤害，然后获得其区域内的一张牌。',
                    clan_xunyu: '族荀彧',
                    clandingan: '定安',
                    clandingan_info: '锁定技，当一个牌名的牌每回合第二次被使用后，若本回合未有角色进入过濒死状态，你与一名非目标角色各摸一张牌（每回合每名角色限一次），然后你对手牌最多的其他角色造成一点伤害，或令其弃置手牌中最多的同名牌。',
                    clanfuning: '抚宁',
                    clanfuning_info: '每轮你的体力值首次变化后，你可以将至少X张牌交给一名角色（X为你已损失体力值）。若你交给的牌：颜色均相同，你回复一点体力；数量大于本回合受到过伤害的角色数，你将手牌调整至体力上限。',
                    clan_chenqun: '族陈群',
                    clangezhi: '革制',
                    clangezhi_info: '每回合限一次，当你或你攻击范围内的角色受到伤害后，若伤害来源不为你，你可以弃置你与伤害来源各一张牌，且可以分配这些牌。若因此弃置牌的类别不同，你与伤害来源本回合只能使用这些类别的牌。',
                    clanmingdian: '明典',
                    clanmingdian_info: '出牌阶段或当你受到伤害后，你可以重铸任意张基本牌（每轮每个牌名限一次）。若你重铸了你本回合使用过的牌名，你获得一张手牌中未拥有牌名的基本牌。',
                    clan_chentai: '族陈泰',
                    clanfenjian: '奋剑',
                    clanfenjian_info: '出牌阶段各限一次，你可以弃置一张牌，视为对一名攻击范围小于/等于/大于你的角色使用一张【杀】。此【杀】造成伤害后，你本回合攻击范围-1（至多减至0）。',
                    clandongxu: '动虚',
                    clandongxu_info: '转换技，阳：你可以将一张装备牌置入其他角色的装备区（替换原装备）；阴：你可以将手牌摸至X张（X为你的攻击范围且至多为5）。然后视为使用一张【闪】或令你被抵消的【杀】依然造成伤害。',
                    clanshize: '士则',
                    clanshize_info: '宗族技，锁定技，当你于回合内使用牌首次被响应后，你令一名同族角色的攻击范围+1，直到其下次受到伤害。',
                    clan_wangmingshan: '族王明山',
                    clantanque: '弹雀',
                    clantanque_info: '每回合限一次，当你使用牌结算结束后，若X不为0，你可以对一名体力值或手牌数为X的角色造成一点伤害（X为此牌的点数与你使用的上一张牌的点数之差）。',
                    clanshengmo: '剩墨',
                    clanshengmo_info: '每轮限一次，当你需要使用基本牌时（每种基本牌每局游戏限一次），你可以从弃牌堆中获得一张本回合置入弃牌堆的牌（每种点数每局限一次），若此牌点数不为最大或最小，则视为使用此基本牌。',
                    clan_yangzhong: '族杨众',
                    clanjuetu: '绝途',
                    clanjuetu_info: '锁定技，弃牌阶段开始时，你选择手牌中每种花色的牌各一张，将其余的手牌置入弃牌堆，然后令一名角色弃置一张手牌。若你手牌中没有此花色的牌，则你对其造成一点伤害。',
                    clankudu: '苦渡',
                    clankudu_info: '限定技，结束阶段，你可以重铸两张牌，令一名角色于其回合结束时摸一张牌直到其以此法获得了X张牌（X为你重铸的牌的点数之差且至多为5），然后其于最后一个以此法获得牌的回合结束后执行一个额外的回合。',
                    clan_yangbiao: '族杨彪',
                    clanjiannan: '间难',
                    clanjiannan_info: '出牌阶段开始时，你可以摸两张牌。若如此做，此阶段一名角色失去所有“间难”牌或最后的手牌后，若没有角色处于濒死状态，你令一名角色执行一项：①弃置两张牌；②摸两张牌；③重铸所有装备牌；④将一张锦囊牌置于牌堆顶或失去一点体力。每回合每个选项限一次。',
                    clanyichi: '义叱',
                    clanyichi_info: '结束阶段，你可以拼点，若你赢，没赢的角色依次执行“间难”前X个选项（X为你本回合发动“间难”的次数）。',
                    clan_hanfu: '族韩馥',
                    clanheta: '和他',
                    clanheta_info: '出牌阶段开始时，你可以进入连环状态。然后本回合你使用牌时，你可以解除连环状态，为此牌增加或减少任意名目标（须选择本回合此前你对其使用过牌的角色，且无距离限制）。',
                    olyingxiang: '迎乡',
                    olyingxiang_info: '出牌阶段结束时，你可以声明一张基本牌或单目标普通锦囊牌并拼点。赢的角色视为使用你声明的牌。若声明的牌与任意拼点牌：牌名相同，你视为未发动宗族技；牌名均不同，你获得所有拼点牌并失去一个技能。',
                    clan_xunshuang: '族荀爽',
                    clanyangji: '佯疾',
                    clanyangji_info: '准备阶段，或你的体力值变化过的阶段结束时，你可以使用一张牌。若此牌未造成伤害，你可以将一张♠牌当做【乐不思蜀】对当前回合角色使用。',
                    clandandao: '耽道',
                    clandandao_info: '锁定技，当你进行回合内第一次判定后，你令当前回合角色的手牌上限+1。',
                    clanqingli: '清励',
                    clanqingli_info: '锁定技，一名角色的回合结束时，你将手牌摸至手牌上限（至多摸至五张）。',
                    clan_yangci: '族杨赐',
                    clanqieyi: '切议',
                    clanqieyi_info: '出牌阶段开始时，你可以观看牌堆顶的两张牌，然后你于本回合第一次使用一种花色的牌结算结束后展示牌堆顶的一张牌。若这两张牌颜色或类别相同，则你获得展示的牌，否则你将一张牌置于牌堆顶。',
                    clanjianzhi: '谏直',
                    clanjianzhi_info: '锁定技，结束阶段，你进行至多X次判定（X为你本回合发动“切议”的次数），然后你将判定牌中你本回合使用过的花色的牌分配给任意角色。若判定牌中有你本回合未使用过的花色的牌，你受到一点无伤害来源的雷电伤害。',
                    clan_lujing: '族陆景',
                    clantanfeng: '探锋',
                    clantanfeng_info: '出牌阶段限一次，你可以视为使用一张无次数限制且无视防具的【杀】。若此【杀】造成伤害，你摸X张牌（X为你与其装备区内牌数之差），否则其可以视为对你使用一张【杀】。',
                    clanjuewei: '绝围',
                    clanjuewei_info: '每回合限一次，当你使用伤害牌指定目标后，或成为伤害牌的目标后，你可以选择一项：①重铸一张装备牌，此牌结算结束后，你视为对其中一个除你以外的目标使用此牌；②弃置一张装备牌，令此牌无效。',
                    clan_xunshi: '族荀莳',
                    clanqingjue: '清绝',
                    clanqingjue_info: '锁定技，㊀你手牌中每个花色仅一张的牌不计入手牌上限。㊁当你每回合体力值首次变化后，你弃置手牌中任意张花色数量不为一的牌，并执行以下等量项：①将这些牌交给一名其他角色；②获得手牌中未拥有花色的牌各一张。',
                    clanyingxiang: '萦香',
                    clanyingxiang_info: '锁定技，其他角色获得你的牌称为“萦香”。“萦香”被使用后，你和有“萦香”的角色各摸一张牌。若“萦香”不因使用而失去，你发动一次“清绝”（每轮限一次）。',
                    clan_luji: '族陆绩',
                    huntianyi: '浑天仪',
                    huntianyi_info: '锁定技，你从装备区里失去此牌时，从牌堆中随机获得两张与此牌点数相同的锦囊牌。你受到伤害时，销毁此牌并防止之。',
                    huntianyi_skill: '浑天仪',
                    huntianyi_skill_info: '锁定技，你从装备区里失去此牌时，从牌堆中随机获得两张与此牌点数相同的锦囊牌。你受到伤害时，销毁此牌并防止之。',
                    clangailan: '该览',
                    clangailan_info: '锁定技。①游戏开始时，将四张【浑天仪】加入牌堆。②回合开始时，你将牌堆或弃牌堆中一张【浑天仪】置入你的装备区。',
                    clanfennu: '奋驽',
                    clanfennu_info: '①出牌阶段开始时，你可以令至多X名角色各弃置一张牌（X为你的体力值），然后将这些牌置于你的武将牌上，称为“逸”。②当你使用牌指定目标时，若你的武将牌上有“逸”，记录此牌点数。③准备阶段，若记录点数之和大于“逸”的点数之和，你清除记录并获得所有“逸”。',
                    clan_luyusheng: '族陆郁生',
                    clanshixi: '拾昔',
                    clanshixi_info: '你首次使用一个花色的单目标普通锦囊牌时，记录牌名和花色。当你需要使用记录牌时，你可以将所有对应花色的牌置入弃牌堆，视为使用之。',
                    clanjianbai: '坚白',
                    clanjianbai_info: '锁定技，你每回合首次使用一种类型的牌后，你保留一个花色，重铸其余牌。此回合结束时，你交给一名其他角色一张牌并摸X张牌（X为此牌本回合被保留的次数）。',
                    clanzelie: '泽烈',
                    clanzelie_info: '宗族技，当同族角色失去其场上的所有牌后，你可以令一名角色本回合下一次摸牌/弃牌后，其再摸一张牌/弃一张牌。',
                    mb_shen_machao: '神马超',
                    shenyuli: '驭雳',
                    shenyuli_info: '锁定技，①你造成的伤害改为雷电伤害，已是雷电伤害则伤害+1。②你受到雷电伤害时，防止之并摸等量牌。',
                    shentingwei: '霆威',
                    shentingwei_info: '你使用【杀】指定目标后，可以获得四个“霆”标记并选择一名目标角色，其选择任意项（每选择一项，你失去一个“霆”标记）：①非锁定技失效至其下个回合结束；②交给你一张装备牌；③此牌对其造成伤害+1；④随机弃一张牌。若其均不选择，其进入连环状态。',
                    shenjimie: '寂灭',
                    shenjimie_info: '限定技，出牌阶段结束时，你可以失去八个“霆”，对一名角色造成等于其体力上限的伤害。然后你“驭雳”的两项均执行后，该技能可再次发动。',
                    mdtx_zhugeliang: '谋诸葛亮',
                    mdtx_zhugeliang2: '谋诸葛亮',
                    mdtxjingmou: '靖谋',
                    mdtxjingmou_info: '转换技。游戏开始时，你可以自选阴阳状态。任意角色的出牌阶段开始时，若你有未有记录的花色或牌类型，你可以弃置任意张牌并秘密记录其中一种花色与牌类型。有角色使用与你记录的花色或类型相同的牌时，移除该记录。阳：此牌无效，你可以弃置一张与此牌花色一致的手牌，对其造成一点火焰伤害；阴：此牌结算后将其交给任意一名角色。若你移除过所有花色与牌类型，你获得〖定南〗。',
                    mdtxdingnan: '定南',
                    mdtxdingnan_info: '出牌阶段限一次，你可以令任意名角色依次打出一张【杀】，否则受到一点伤害。',
                    mdtxguyi: '孤熠',
                    mdtxguyi_info: '锁定技，游戏开始时，你额外摸一张牌，并标记为“熠”。“熠”离开手牌区后，观看牌堆顶X张牌选择其中一张牌获得并标记为“熠”，然后以任意顺序放回牌堆顶（X为本轮触发此效果的次数，至多为7）。每轮结束时，若你为本轮造成伤害最高者，你摸一张牌并标记为“熠”。',
                    mdtx_pangtong: '谋庞统',
                    mdtx_pangtong2: '谋庞统',
                    mdtxyinmou: '寅谋',
                    mdtxyinmou_buff: '寅谋摸牌',
                    mdtxyinmou_debuff: '寅谋弃牌',
                    mdtxyinmou_info: '转换技，每个回合结束时，若本回合有角色失去手牌数大于等于当前手牌数，你可观看牌堆顶三张牌并交给其中一名角色一张牌，此牌离开其手牌区时，阳：其摸当前体力值张手牌（至多摸5）；阴：其弃置当前体力值张手牌（不足则全弃）。',
                    mdtxhongce: '宏策',
                    mdtxhongce_info: '首轮开始时，你令一名角色选择一项执行：1、将半数手牌（向上取整）替换为等量张随机的伤害牌，并视为使用一张无次数限制的【杀】；2、重铸一张手牌，视为使用一张单目标的普通锦囊牌；3、摸3张牌且这些牌不计入手牌上限。结算后，根据所选项修改“宏策”。',
                    sbfm_zhangrang: '谋张让',
                    sbfm_zhangrang2: '谋张让',
                    sbfmlucun: '赂存',
                    sbfmlucun_info: '每轮各限一次，你可以视为使用一张有目标角色的基本或普通锦囊牌（未以此法使用），然后目标中手牌最多的随机一名角色将一张手牌置为“赂”。一个回合结束时，随机移去一张“赂”，你摸一张牌。',
                    sbfmtuisheng: '蜕生',
                    sbfmtuisheng_info: '限定技，准备阶段或当你进入濒死状态时，你可以重置本局使用过的牌名，然后选择一项并回复一点体力：①将你所有手牌置为“赂”；②你随机从弃牌堆中获得游戏轮数张重置前“赂存”使用牌名的牌。',
                    sbfm_xuyou: '谋许攸',
                    sbfmxyqianfu: '迁附',
                    sbfmxyqianfu_info: '转换技，出牌阶段，你可以将一张阳：黑色牌当【过河拆桥】使用；阴：红色牌当【火攻】使用。结算结束后，你可以将因此弃置的牌置于牌堆顶。',
                    sbfmxyqianfu_temp: '迁附',
                    sbfmxyqianfu_temp_info: '转换技，出牌阶段各限一次，你可以将一张阳：黑色牌当【过河拆桥】使用；阴：红色牌当【火攻】使用。结算结束后，你可以将因此弃置的牌置于牌堆顶。',
                    sbfmyushi: '驭势',
                    sbfmyushi_info: '①你造成或受到伤害后，你可以令一名：有转换技的角色切换其转换技状态；无转换技的角色获得出牌阶段各限一次的“迁附”，直到其失去最后的手牌。②每轮前X次，有转换技切换状态后，你摸一张牌（X为你的体力上限）。',
                    sbfmfenchao: '焚巢',
                    sbfmfenchao_info: '限定技，结束阶段，你可以令一名角色获得弃牌堆中的伤害牌（不超过存活人数），且令这些牌造成伤害时改为造成火焰伤害。',
                    sbfm_jiaxu: '谋贾诩',
                    sbfmluanchao: '乱朝',
                    sbfmluanchao_info: '限定技，每轮开始时，你可以令所有角色依次选择从牌堆获得一张【杀】或【闪】。获得【杀】的角色本轮首次造成的伤害+1。',
                    sbfmwance: '完策',
                    sbfmwance_info: '出牌阶段限一次，你可以指定一名角色并声明一张指定唯一目标的普通锦囊牌，然后其依次将X张手牌当此牌使用（X为游戏轮数且至多为3）。其以此法指定目标时，你可以弃置一张牌并更改目标。',
                    sbfmchenzhi: '沉智',
                    sbfmchenzhi_info: '你每轮受到第X次以后的伤害时，你弃置一张牌防止之（X为游戏轮数且至多为3）。每轮结束时，若你本轮未发动此技能，则你可以复原一名角色的一个限定技（每局游戏限一次）。',
                    dcyiju: '义拒',
                    dcyiju_info: '锁定技，其他角色使用牌指定你为唯一目标后，你弃置一张牌。',
                    dc_cuilingyi: '崔令仪',
                    dchuashang: '华裳',
                    dchuashang_info: '游戏开始时，将每种颜色各一张牌置入你的装备区，若你的装备区存在两种颜色的牌你使用牌无距离限制。你使用一张牌结算后，可将一张相同花色的非装备手牌置入你的装备区。当你的手牌数少于你装备区牌的花色数你将手牌数补至等同于你装备区牌的花色数。',
                    dcyuzhi: '逾制',
                    dcyuzhi_info: '锁定技，当你成为【杀】目标时，需选择一项执行：①弃置一张装备区内的牌视为使用【闪】并失去此选项至你的回合开始；②此【杀】伤害+1。',
                    yue_caiyong: '乐蔡邕',
                    dcyuejiaowei: '焦尾',
                    dcyuejiaowei_info: '锁定技，①游戏开始时，将初始手牌标记为“弦”牌（“弦”牌不计入你的手牌上限）；②当你失去“弦”牌后，防止你本回合下一次受到的伤害。',
                    dcyuefeibai: '飞白',
                    dcyuefeibai_info: '当你使用牌后，你可以从随机两张牌名字数为X的牌中挑选一张获得（X为此牌与你本回合使用的上一张牌两张牌字数之和，若没有使用上一张牌则改为此牌字数）。若牌堆中没有牌名字数为X的牌，你改为可摸两张牌并标记为“弦”，然后此技能本回合失效。',
                    shen_weiyan: '神魏延',
                    shenzigu: '恣骨',
                    shenzigu_info: '当你对一名其他角色造成伤害或受到伤害后，可以将一张手牌置入其装备栏，称为“骨”；每回合首次使用装备时，可以对场上的一名角色造成一点伤害并获得一张伤害牌。',
                    shenezhi: '恶峙',
                    shenezhi_info: '锁定技，有“骨”的其它角色使用牌时，你摸两张牌并令其弃置一张“骨”，若与此牌类型：①相同，取消此牌；②不同，本回合你对其使用牌无距离限制；回合结束时，你可以依次使用本回合被弃置的“骨”。',
                    shengujing: '骨径',
                    shengujing_info: '限定技，出牌阶段，你可以依次执行：①将一张手牌作为“骨”置入场上一名其他角色的装备栏，②弃置任意名其它角色的各一张“骨”并废除其对应装备栏。然后本局游戏中，装备栏被废除的玩家获得对应栏位的装备时，改为由你获得。',
                },
            },
            intro: "",
            author: "枫糖总帅",
            diskURL: "",
            forumURL: "",
            version: "1.0",
        }, files: { "character": [], "card": [], "skill": [] }
    }
};