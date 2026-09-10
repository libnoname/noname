import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function (lib, game, ui, get, ai, _status) {
    return {
        name: "势贺齐", content: function (config, pack) {

        }, precontent: function () {

        }, config: {}, help: {}, package: {
            character: {
                character: {
                    ca_heqi: ['male', 'wu', 4, ['cashanxi', 'caqizhou']],
                },
                translate: {
                    ca_heqi: '势贺齐',
                },
            },
            card: {
                card: {
                },
                translate: {
                },
                list: [],
            },
            skill: {
                skill: {
                    //势贺齐
                    cashanxi: {
                        audio: 'ext:新武将/audio:4',
                        enable: 'phaseUse',
                        viewAs: { name: 'juedou' },
                        filter: function (event, player) {
                            var stat = player.getStat()._cashanxi;
                            return player.countCards('hes', function (card) {
                                return card.hasGaintag('cayingji');
                            }) > 0 && game.hasPlayer(function (target) {
                                return player.canUse('juedou', target) && (!stat || !stat.contains(target));
                            });
                        },
                        filterCard: function (card) { return card.hasGaintag('cayingji') },
                        position: 'he',
                        filterTarget: function (card, player, target) {
                            if (target == player) return false;
                            var stat = player.getStat()._cashanxi;
                            return (!stat || !stat.contains(target)) && player.canUse(card, target);
                        },
                        onuse: function (result, player) {
                            var stat = player.getStat();
                            if (!stat._cashanxi) stat._cashanxi = [];
                            stat._cashanxi.push(result.targets[0]);
                        },
                    },
                    caqizhou: {
                        audio: 'ext:新武将/audio:2',
                        init: function (player) { game.addGlobalSkill('cayingji') },
                        trigger: { player: ['equipAfter', 'addJudgeAfter'] },
                        direct: true,
                        filter: function (event, player) {
                            return game.hasPlayer(function (target) { return target.countCards('h') > 0 });
                        },
                        content: function () {
                            'step 0'
                            if (trigger && typeof trigger.getParent == 'function') {
                                var evt = trigger.getParent('useCard');
                                if (evt && evt.name == 'useCard' && evt.player) user = evt.player;
                            }
                            else if (trigger && trigger.source && get.itemtype(trigger.source) == 'player') return user = trigger.source;
                            else user = player;
                            event.num = player.countCards('ej') + user.countCards('ej');
                            var prompt = '将一名角色的至多' + get.cnNumber(event.num) + '张手牌标记为“应机”牌';
                            player.chooseTarget(get.prompt('caqizhou'), prompt, function (card, player, target) {
                                return target.countCards('h') > 0;
                            }).set('ai', function (target) {
                                var player = _status.event.player;
                                return get.effect(target, { name: 'guohe_copy2' }, player, player);
                            });
                            'step 1'
                            if (result.bool && result.targets && result.targets.length) {
                                player.logSkill('caqizhou', result.targets);
                                player.choosePlayerCard(result.targets[0], 'h', [1, event.num], true).set('ai', function (card) {
                                    return get.value(button.link);
                                }).set('prompt', '绮胄：将' + get.translation(result.targets[0]) + '的至多' + get.cnNumber(event.num) + '张手牌标记为“应机”牌');
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool) result.cards.forEach(function (card) { card.addGaintag('cayingji') });
                        },
                        group: 'caqizhou_draw',
                        subSkill: {
                            draw: {
                                audio: 'caqizhou',
                                trigger: { player: 'phaseDrawBegin2' },
                                forced: true,
                                content: function () { player.draw(2).gaintag = ['cayingji'] },
                            },
                        },
                    },
                    cayingji: {
                        trigger: { global: 'phaseEnd' },
                        silent: true,
                        locked: true,
                        direct: true,
                        charlotte: true,
                        firstDo: true,
                        filter: function (event, player) {
                            return event.player.countCards('h', function (card) { return card.hasGaintag('cayingji') }) > 0;
                        },
                        content: function () {
                            trigger.player.discard(trigger.player.getCards('h', function (card) { return card.hasGaintag('cayingji') }));
                        },
                    },
                },
                translate: {
                    ca_heqi: '势贺齐',
                    cashanxi: '闪袭',
                    cashanxi_info: '出牌阶段每名角色限一次，你可以将一张“应机”牌当作【决斗】对一名其他角色使用。',
                    cayingji: '应机',
                    caqizhou: '绮胄',
                    caqizhou_info: '①有牌进入你的判定区或者装备区后，你可以将一名角色的至多X张手牌标记为“应机”牌（X为你与此牌使用者的判定区和装备区牌数的数量之和）。②摸牌阶段，你额外摸两张牌且标记为“应机”牌。【“应机”牌：一名角色的回合结束后，将其手牌中的“应机”牌置入弃牌堆】',
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