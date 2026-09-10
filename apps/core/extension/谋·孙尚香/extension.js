import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function (lib, game, ui, get, ai, _status) {
    return {
        name: "谋·孙尚香",
        content: function (config, pack) {},
        precontent: function () {},
        config: {},
        help: {},
        package: {
            character: {
                character: {
                    mobile_mou_sunshangxiang: ['female', 'shu', 4, ['mobile_mou_jieyin', 'mobile_mou_liangzhu', 'mobile_mou_xiaoji']],
                },
                translate: {
                    mobile_mou_sunshangxiang: '谋·孙尚香',
                },
                characterPrefix: {
                    mobile_mou_sunshangxiang: '谋',
                },
            },
            card: {
                card: {},
                translate: {},
                list: [],
            },
            skill: {
                skill: {
                    mobile_mou_jieyin: {
                        audio: 2,
                        dutySkill: true,
                        locked: false,
                        trigger: { global: 'phaseUseBegin' },
                        forced: true,
                        filter: function (event, player) {
                            if (player.storage.mobile_mou_jieyin_state != 'ongoing') return false;
                            if (lib.skill.mobile_mou_jieyin.isMissionFinished(player)) return false;
                            return lib.skill.mobile_mou_jieyin.getPartner(player) == event.player;
                        },
                        content: function () {
                            'step 0'
                            event.target = trigger.player;
                            event.num = Math.min(3, Math.max(1, game.roundNumber || 1));
                            player.chooseControl('获得护甲', '变为吴势力并获得牌').set('choiceList', [
                                '令' + get.translation(event.target) + '获得1点护甲',
                                '你将势力变更为吴，然后获得其' + get.cnNumber(event.num) + '张牌（不足则全部获得）'
                            ]).set('prompt', get.prompt('mobile_mou_jieyin', event.target)).set('ai', function () {
                                var player = _status.event.player;
                                var target = _status.event.getParent().target;
                                if (get.attitude(player, target) > 0 && target.hujia < 5) return '获得护甲';
                                if (target.countCards('he') >= 2 && get.attitude(player, target) < 0) return '变为吴势力并获得牌';
                                return '获得护甲';
                            });
                            'step 1'
                            player.logSkill('mobile_mou_jieyin', event.target);
                            if (result.control == '获得护甲') {
                                event.target.changeHujia(1, null, true);
                                event.finish();
                            }
                            else {
                                player.storage.mobile_mou_jieyin_changing = true;
                                player.changeGroup('wu');
                            }
                            'step 2'
                            var gainableCount;
                            if (typeof event.target.countGainableCards == 'function') {
                                gainableCount = event.target.countGainableCards(player, 'he');
                            }
                            else {
                                // 较旧PC本体没有countGainableCards时，用区域牌数兜底。
                                gainableCount = event.target.countCards('he');
                            }
                            var count = Math.min(event.num, gainableCount);
                            if (count > 0) player.gainPlayerCard(event.target, 'he', count, true);
                            'step 3'
                            delete player.storage.mobile_mou_jieyin_changing;
                            if (player.storage.mobile_mou_jieyin_state == 'ongoing') {
                                lib.skill.mobile_mou_jieyin.startFailure(player, 'changeGroup');
                            }
                        },
                        group: [
                            'mobile_mou_jieyin_init',
                            'mobile_mou_jieyin_achieve',
                            'mobile_mou_jieyin_fail',
                            'mobile_mou_jieyin_groupfail',
                            'mobile_mou_jieyin_death'
                        ],
                        init: function (player) {
                            if (!player.storage.mobile_mou_jieyin_state) player.storage.mobile_mou_jieyin_state = 'ongoing';
                            if (typeof player.storage.mobile_mou_jieyin_success_armor != 'boolean') player.storage.mobile_mou_jieyin_success_armor = false;
                            if (typeof player.storage.mobile_mou_jieyin_success_equip != 'boolean') player.storage.mobile_mou_jieyin_success_equip = false;
                        },
                        syncState: function (player) {
                            if (!player.syncStorage) return;
                            player.syncStorage('mobile_mou_jieyin_partner');
                            player.syncStorage('mobile_mou_jieyin_state');
                            player.syncStorage('mobile_mou_jieyin_success_armor');
                            player.syncStorage('mobile_mou_jieyin_success_equip');
                        },
                        getPartner: function (player, includeDead) {
                            var id = player.storage.mobile_mou_jieyin_partner;
                            if (!id) return null;
                            var list = game.players.slice(0);
                            if (includeDead && game.dead) list = list.concat(game.dead);
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].playerid == id) return list[i];
                            }
                            return null;
                        },
                        setPartner: function (player, target) {
                            player.storage.mobile_mou_jieyin_partner = target.playerid;
                            player.storage.mobile_mou_jieyin_state = 'ongoing';
                            player.storage.mobile_mou_jieyin_success_armor = false;
                            player.storage.mobile_mou_jieyin_success_equip = false;
                            lib.skill.mobile_mou_jieyin.syncState(player);
                        },
                        clearPartner: function (player) {
                            delete player.storage.mobile_mou_jieyin_partner;
                            lib.skill.mobile_mou_jieyin.syncState(player);
                        },
                        listContains: function (list, item) {
                            if (!list) return false;
                            if (typeof list.indexOf == 'function') return list.indexOf(item) != -1;
                            if (typeof list.includes == 'function') return list.includes(item);
                            if (typeof list.contains == 'function') return list.contains(item);
                            return false;
                        },
                        isMissionFinished: function (player) {
                            return lib.skill.mobile_mou_jieyin.listContains(player.awakenedSkills, 'mobile_mou_jieyin');
                        },
                        applyMissionVisual: function (player, failed) {
                            // 十周年UI不同PC/移动版本对这两个扩展接口的实现并不完全一致。
                            // 每个接口独立隔离，UI美化失败时不能中断游戏逻辑。
                            if (failed && typeof player.failSkill == 'function') {
                                try {
                                    player.failSkill('mobile_mou_jieyin');
                                }
                                catch (e) {
                                    if (typeof console != 'undefined' && console.error) console.error('[谋孙尚香] failSkill兼容失败', e);
                                }
                            }
                            if (typeof player.shixiaoSkill == 'function') {
                                try {
                                    player.shixiaoSkill('mobile_mou_jieyin');
                                }
                                catch (e) {
                                    if (typeof console != 'undefined' && console.error) console.error('[谋孙尚香] shixiaoSkill兼容失败', e);
                                }
                            }
                        },
                        finishMission: function (player, failed) {
                            // awakenSkill 只负责结束使命技本身；十周年UI旧版的灰色封锁显示
                            // 由 shixiaoSkill 单独处理，使命失败图标由 failSkill 单独处理。
                            if (!lib.skill.mobile_mou_jieyin.isMissionFinished(player)) {
                                player.awakenSkill('mobile_mou_jieyin');
                            }
                            lib.skill.mobile_mou_jieyin.applyMissionVisual(player, failed);
                        },
                        startFailure: function (player, reason) {
                            if (player.storage.mobile_mou_jieyin_state != 'ongoing') return;
                            if (lib.skill.mobile_mou_jieyin.isMissionFinished(player)) return;
                            player.storage.mobile_mou_jieyin_state = 'failure_pending';
                            lib.skill.mobile_mou_jieyin.syncState(player);
                            var next = game.createEvent('mobile_mou_jieyin_fail');
                            next.player = player;
                            next.reason = reason || '';
                            next.setContent(lib.skill.mobile_mou_jieyin_fail.content);
                        },
                        subSkill: {
                            achieve: {
                                audio: 'mobile_mou_jieyin',
                                dutySkill: true,
                                forced: true,
                                locked: false,
                                skillAnimation: true,
                                animationColor: 'wood',
                                trigger: { global: ['changeHujiaAfter', 'equipAfter', 'gainAfter', 'loseAfter', 'loseAsyncAfter', 'phaseBegin', 'phaseUseBegin', 'phaseUseEnd', 'phaseEnd'] },
                                filter: function (event, player) {
                                    if (player.storage.mobile_mou_jieyin_state != 'ongoing') return false;
                                    if (lib.skill.mobile_mou_jieyin.isMissionFinished(player)) return false;
                                    var target = lib.skill.mobile_mou_jieyin.getPartner(player);
                                    return target && (target.hujia >= 5 || target.countCards('e') >= 4);
                                },
                                content: function () {
                                    var target = lib.skill.mobile_mou_jieyin.getPartner(player);
                                    if (!target || player.storage.mobile_mou_jieyin_state != 'ongoing') return;
                                    player.storage.mobile_mou_jieyin_state = 'success';
                                    player.storage.mobile_mou_jieyin_success_armor = target.hujia >= 5;
                                    player.storage.mobile_mou_jieyin_success_equip = target.countCards('e') >= 4;
                                    lib.skill.mobile_mou_jieyin.syncState(player);
                                    lib.skill.mobile_mou_jieyin.finishMission(player, false);
                                    game.log(player, '成功完成使命');
                                },
                            },
                            fail: {
                                audio: 'mobile_mou_jieyin',
                                dutySkill: true,
                                forced: true,
                                locked: false,
                                direct: true,
                                content: function () {
                                    'step 0'
                                    if (player.storage.mobile_mou_jieyin_state != 'ongoing' && player.storage.mobile_mou_jieyin_state != 'failure_pending') {
                                        event.finish();
                                        return;
                                    }
                                    player.logSkill('mobile_mou_jieyin_fail');
                                    player.awakenSkill('mobile_mou_jieyin');
                                    game.log(player, '使命失败');
                                    if (typeof dcdAnim != 'undefined' && typeof dyskillAssets != 'undefined' && dyskillAssets.jieyinshibai) {
                                        try {
                                            var jieyinFailAnim = dyskillAssets.jieyinshibai;
                                            dcdAnim.loadSpine(jieyinFailAnim.name, 'skel', function () {
                                                dcdAnim.playSpine(jieyinFailAnim, {
                                                    scale: 0.8,
                                                    speed: 1,
                                                    x: [0, 0.55],
                                                    parent: player
                                                });
                                            });
                                        }
                                        catch (e) {
                                            if (typeof console != 'undefined' && console.error) {
                                                console.error('[谋孙尚香] 十周年UI结姻失败动画调用失败', e);
                                            }
                                        }
                                    }
                                    player.storage.mobile_mou_jieyin_state = 'failure';
                                    player.storage.mobile_mou_jieyin_success_armor = false;
                                    player.storage.mobile_mou_jieyin_success_equip = false;
                                    delete player.storage.mobile_mou_jieyin_changing;
                                    delete player.storage.mobile_mou_jieyin_partner;
                                    lib.skill.mobile_mou_jieyin.syncState(player);
                                    if (player.group != 'wu') player.changeGroup('wu');
                                    'step 1'
                                    event.hearts = player.getCards('h', function (card) {
                                        return get.suit(card, player) == 'heart';
                                    });
                                    if (event.hearts.length) {
                                        game.log(player, '重铸了', event.hearts);
                                        if (player.loseToDiscardpile) player.loseToDiscardpile(event.hearts);
                                        else player.discard(event.hearts);
                                    }
                                    'step 2'
                                    if (event.hearts.length) player.draw(event.hearts.length);
                                    'step 3'
                                    player.draw(2);
                                    'step 4'
                                    lib.skill.mobile_mou_jieyin.applyMissionVisual(player, true);
                                },
                            },
                        },
                        intro: {
                            content: function (storage, player) {
                                var state = player.storage.mobile_mou_jieyin_state || 'ongoing';
                                var target = lib.skill.mobile_mou_jieyin.getPartner(player, true);
                                var str = '使命状态：' + (state == 'success' ? '成功' : state == 'failure' || state == 'failure_pending' ? '失败' : '进行中');
                                if (target) str += '<br>结姻角色：' + get.translation(target);
                                if (state == 'success') {
                                    var list = [];
                                    if (player.storage.mobile_mou_jieyin_success_armor) list.push('每轮首次发动枭姬后获得1点护甲');
                                    if (player.storage.mobile_mou_jieyin_success_equip) list.push('发动枭姬后本回合杀次数上限+1');
                                    if (list.length) str += '<br>' + list.join('<br>');
                                }
                                return str;
                            },
                        },
                    },
                    mobile_mou_jieyin_init: {
                        trigger: { global: 'gameStart', player: 'enterGame' },
                        forced: true,
                        filter: function (event, player) {
                            if (player.storage.mobile_mou_jieyin_state != 'ongoing') return false;
                            if (lib.skill.mobile_mou_jieyin.isMissionFinished(player)) return false;
                            return !player.storage.mobile_mou_jieyin_partner && game.hasPlayer(function (current) {
                                return current != player;
                            });
                        },
                        content: function () {
                            'step 0'
                            if (player.group != 'shu') player.changeGroup('shu');
                            player.chooseTarget(true, '结姻：选择一名其他角色作为“结姻角色”', function (card, player, target) {
                                return target != player;
                            }).set('ai', function (target) {
                                return get.attitude(_status.event.player, target) + Math.sqrt(target.countCards('e') + target.hujia);
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                lib.skill.mobile_mou_jieyin.setPartner(player, target);
                                player.line(target, 'green');
                                game.log(player, '选择了', target, '作为', '#g“结姻角色”');
                            }
                        },
                    },
                    mobile_mou_jieyin_groupfail: {
                        // changeGroupAfter 在部分十周年β版本中不稳定，增加本角色各阶段的兜底检查。
                        trigger: { player: ['changeGroupAfter', 'phaseBefore', 'phaseBegin', 'phaseUseBegin', 'phaseUseEnd', 'phaseEnd'] },
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            if (lib.skill.mobile_mou_jieyin.isMissionFinished(player)) return false;
                            return player.group == 'wu' && player.storage.mobile_mou_jieyin_state == 'ongoing' && !player.storage.mobile_mou_jieyin_changing;
                        },
                        content: function () {
                            lib.skill.mobile_mou_jieyin.startFailure(player, 'changeGroup');
                        },
                    },
                    mobile_mou_jieyin_death: {
                        trigger: { global: 'dieAfter' },
                        forced: true,
                        filter: function (event, player) {
                            if (player.storage.mobile_mou_jieyin_state != 'ongoing') return false;
                            if (lib.skill.mobile_mou_jieyin.isMissionFinished(player)) return false;
                            return player.storage.mobile_mou_jieyin_partner && event.player.playerid == player.storage.mobile_mou_jieyin_partner;
                        },
                        content: function () {
                            'step 0'
                            player.loseMaxHp();
                            'step 1'
                            if (player.storage.mobile_mou_jieyin_state == 'ongoing') {
                                lib.skill.mobile_mou_jieyin.startFailure(player, 'death');
                            }
                        },
                    },

                    mobile_mou_liangzhu: {
                        audio: 2,
                        locked: true,
                        forced: true,
                        group: ['mobile_mou_liangzhu_recover', 'mobile_mou_liangzhu_phase'],
                    },
                    mobile_mou_liangzhu_recover: {
                        trigger: { global: 'recoverAfter' },
                        forced: true,
                        filter: function (event, player) {
                            if (player.group != 'shu') return false;
                            var target = lib.skill.mobile_mou_jieyin.getPartner(player);
                            return target && (event.player == player || event.player == target);
                        },
                        content: function () {
                            var target = lib.skill.mobile_mou_jieyin.getPartner(player);
                            if (!target) return;
                            if (trigger.player == player) target.draw();
                            else player.draw();
                        },
                    },
                    mobile_mou_liangzhu_phase: {
                        trigger: { player: 'phaseUseEnd' },
                        forced: true,
                        filter: function (event, player) {
                            return player.group == 'shu' && !!lib.skill.mobile_mou_jieyin.getPartner(player);
                        },
                        content: function () {
                            'step 0'
                            event.target = lib.skill.mobile_mou_jieyin.getPartner(player);
                            if (!event.target) {
                                event.finish();
                                return;
                            }
                            if (player.isDamaged()) {
                                player.recover();
                                event.finish();
                                return;
                            }
                            event.cards = [];
                            for (var i = 0; i < 3; i++) {
                                var card = get.cardPile2(function (current) {
                                    return get.type(current) == 'equip' && !lib.skill.mobile_mou_jieyin.listContains(event.cards, current);
                                });
                                if (!card) card = get.discardPile(function (current) {
                                    return get.type(current) == 'equip' && !lib.skill.mobile_mou_jieyin.listContains(event.cards, current);
                                });
                                if (card) event.cards.push(card);
                            }
                            if (!event.cards.length) {
                                game.log('牌堆和弃牌堆中没有可获得的装备牌');
                                event.finish();
                                return;
                            }
                            player.chooseButton(['良助：观看并选择一张装备牌交给' + get.translation(event.target), event.cards], true).set('ai', function (button) {
                                var target = _status.event.getParent().target;
                                var value = get.value(button.link, target);
                                if (target.canEquip(button.link, false)) value += target.getUseValue(button.link);
                                return value;
                            });
                            'step 1'
                            if (!result.bool || !result.links || !result.links.length) return;
                            event.card = result.links[0];
                            event.canEquip = event.target.canEquip(event.card, false);
                            player.line(event.target, 'green');
                            event.target.gain(event.card, 'gain2', 'log');
                            'step 2'
                            if (event.canEquip && event.target.isIn() && lib.skill.mobile_mou_jieyin.listContains(event.target.getCards('h'), event.card)) {
                                event.target.chooseUseTarget(event.card, true);
                            }
                        },
                    },

                    mobile_mou_xiaoji: {
                        audio: 2,
                        group: ['mobile_mou_xiaoji_equiprecord'],
                        trigger: { global: ['loseAfter', 'loseAsyncAfter', 'equipAfter'] },
                        direct: true,
                        getLostEquips: function (event, target) {
                            var current = event;
                            for (var i = 0; current && i < 6; i++) {
                                if (current.getl) {
                                    var lost = current.getl(target);
                                    if (lost && lost.es && lost.es.length) return lost.es.slice(0);
                                }
                                if (!current.getParent) break;
                                var parent = current.getParent();
                                if (!parent || parent == current) break;
                                current = parent;
                            }
                            return [];
                        },
                        getSnapshotLostEquips: function (player, target) {
                            var snapshot = player.storage.mobile_mou_xiaoji_equip_snapshot;
                            if (!snapshot || snapshot.playerid != target.playerid || !snapshot.cards || !snapshot.cards.length) return [];
                            var current = target.getCards('e');
                            var lost = [];
                            for (var i = 0; i < snapshot.cards.length; i++) {
                                if (!lib.skill.mobile_mou_jieyin.listContains(current, snapshot.cards[i])) lost.push(snapshot.cards[i]);
                            }
                            return lost;
                        },
                        getLossInfo: function (event, player) {
                            var list = [player];
                            if (player.storage.mobile_mou_jieyin_state == 'success') {
                                var partner = lib.skill.mobile_mou_jieyin.getPartner(player);
                                if (partner) list.push(partner);
                            }
                            var isEquipAfter = event.name == 'equip' || event.triggername == 'equipAfter';
                            for (var i = 0; i < list.length; i++) {
                                var target = list[i];
                                var cards;
                                if (isEquipAfter) {
                                    cards = lib.skill.mobile_mou_xiaoji.getSnapshotLostEquips(player, target);
                                }
                                else {
                                    cards = lib.skill.mobile_mou_xiaoji.getLostEquips(event, target);
                                }
                                if (cards.length) return { source: target, cards: cards };
                            }
                            return null;
                        },
                        filter: function (event, player) {
                            var info = lib.skill.mobile_mou_xiaoji.getLossInfo(event, player);
                            if (!info) return false;
                            var snapshot = player.storage.mobile_mou_xiaoji_equip_snapshot;
                            if (snapshot && snapshot.playerid == info.source.playerid) {
                                delete player.storage.mobile_mou_xiaoji_equip_snapshot;
                            }
                            event.mobile_mou_xiaoji_source = info.source;
                            event.mobile_mou_xiaoji_cards = info.cards;
                            return true;
                        },
                        content: function () {
                            'step 0'
                            var info = {
                                source: trigger.mobile_mou_xiaoji_source,
                                cards: trigger.mobile_mou_xiaoji_cards
                            };
                            if (!info.source) info = lib.skill.mobile_mou_xiaoji.getLossInfo(trigger, player);
                            if (!info || !info.source) {
                                event.finish();
                                return;
                            }
                            event.source = info.source;
                            event.lostEquips = info.cards || [];
                            player.chooseBool(get.prompt('mobile_mou_xiaoji', event.source), '摸两张牌').set('ai', function () { return true; });
                            'step 1'
                            if (!result.bool) {
                                event.finish();
                                return;
                            }
                            player.logSkill('mobile_mou_xiaoji', event.source);
                            player.draw(2);
                            'step 2'
                            if (player.storage.mobile_mou_jieyin_state == 'success' && player.storage.mobile_mou_jieyin_success_armor) {
                                if (player.storage.mobile_mou_xiaoji_armor_round != game.roundNumber) {
                                    player.storage.mobile_mou_xiaoji_armor_round = game.roundNumber;
                                    player.changeHujia(1, null, true);
                                }
                            }
                            if (player.storage.mobile_mou_jieyin_state == 'success' && player.storage.mobile_mou_jieyin_success_equip) {
                                player.addTempSkill('mobile_mou_xiaoji_sha', 'phaseAfter');
                                player.addMark('mobile_mou_xiaoji_sha', 1, false);
                            }
                            'step 3'
                            if (player.storage.mobile_mou_jieyin_state == 'failure' && game.hasPlayer(function (current) {
                                return current.countCards('ej') > 0;
                            })) {
                                player.chooseTarget('枭姬：你可以弃置场上的一张牌', function (card, player, target) {
                                    return target.countCards('ej') > 0;
                                }).set('ai', function (target) {
                                    var player = _status.event.player;
                                    var att = get.attitude(player, target);
                                    if (att < 0) return -att * Math.max(1, target.countCards('e'));
                                    return att * target.countCards('j');
                                });
                            }
                            else event.finish();
                            'step 4'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.line(target, 'green');
                                player.discardPlayerCard(target, 'ej', true);
                            }
                        },
                    },
                    mobile_mou_xiaoji_equiprecord: {
                        charlotte: true,
                        trigger: { global: ['equipBegin', 'useCardToPlayered'] },
                        forced: true,
                        silent: true,
                        popup: false,
                        priority: 100,
                        filter: function (event, player) {
                            var target;
                            if (event.name == 'equip') {
                                target = event.player;
                            }
                            else {
                                if (!event.card || get.type(event.card) != 'equip') return false;
                                target = event.target;
                            }
                            if (!target) return false;
                            if (target == player) return true;
                            if (player.storage.mobile_mou_jieyin_state != 'success') return false;
                            return lib.skill.mobile_mou_jieyin.getPartner(player) == target;
                        },
                        content: function () {
                            var target = trigger.name == 'equip' ? trigger.player : trigger.target;
                            if (!target) return;
                            player.storage.mobile_mou_xiaoji_equip_snapshot = {
                                playerid: target.playerid,
                                cards: target.getCards('e').slice(0)
                            };
                        },
                    },
                    mobile_mou_xiaoji_sha: {
                        charlotte: true,
                        mark: true,
                        marktext: '枭',
                        onremove: function (player) {
                            player.removeMark('mobile_mou_xiaoji_sha', player.countMark('mobile_mou_xiaoji_sha'), false);
                        },
                        intro: {
                            content: '本回合使用【杀】的次数上限+#',
                        },
                        mod: {
                            cardUsable: function (card, player, num) {
                                if (card.name == 'sha') return num + player.countMark('mobile_mou_xiaoji_sha');
                            },
                        },
                    },
                },
                translate: {
                    mobile_mou_jieyin: '结姻',
                    mobile_mou_jieyin_init: '结姻',
                    mobile_mou_jieyin_achieve: '结姻',
                    mobile_mou_jieyin_fail: '结姻',
                    mobile_mou_jieyin_groupfail: '结姻',
                    mobile_mou_jieyin_death: '结姻',
                    mobile_mou_jieyin_info: '使命技，你的登场势力为蜀。游戏开始时，你选择一名其他角色为“结姻角色”。结姻角色的出牌阶段开始时，你选择一项：①令其获得1点护甲；②你将势力变更为吴，然后获得其X张牌（X为游戏轮数且至多为3）。结姻角色死亡后，你减1点体力上限。使命成功：若结姻角色的护甲值达到5点，则你每轮首次发动“枭姬”后获得1点护甲；若其装备区里的牌数达到4张，则你发动“枭姬”后，本回合使用【杀】的次数上限+1。使命失败：若结姻角色死亡，或者你的势力变为吴，你清除结姻角色记录，重铸所有红桃手牌，然后摸两张牌。',
                    mobile_mou_liangzhu: '良助',
                    mobile_mou_liangzhu_info: '锁定技，蜀势力技。当你或结姻角色回复体力后，令另一方摸一张牌。你的出牌阶段结束时：若你已受伤，你回复1点体力；若你未受伤，你观看牌堆或弃牌堆中的三张装备牌，选择其中一张交给结姻角色；若其对应装备栏为空，则其使用此装备。',
                    mobile_mou_xiaoji: '枭姬',
                    mobile_mou_xiaoji_info: '当你失去装备区里的一张牌时，你可以摸两张牌。若使命失败，你因此摸牌后，可以弃置场上的一张牌；若使命成功，结姻角色失去装备区里的一张牌时，你也可以发动“枭姬”。',
                    mobile_mou_xiaoji_sha: '枭姬',
                },
            },
            intro: '适用于无名杀十周年β版的移动版谋·孙尚香武将拓展。',
            author: 'soyo',
            diskURL: '',
            forumURL: '',
            version: '1.0.21-pc-compat-fix',
        },
        files: {
            character: ['mobile_mou_sunshangxiang.jpg'],
            card: [],
            skill: [],
        },
    };
};
