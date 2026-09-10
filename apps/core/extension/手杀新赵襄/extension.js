import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"手杀新赵襄",content:function (config, pack) {},precontent:function () {},help:{},config:{},package:{
    character:{
        character:{
            "xin_zhaoxiang":["female","shu",4,["xinfanghun","xinfuhan","xunqueishi"]],
        },
        translate:{
            "xin_zhaoxiang":"赵襄",
        },
    },
    card:{
        card:{
            xinyinyueqiang:{
                audio:true,
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                cardimage:"yinyueqiang",
                derivation:"xin_zhaoxiang",
                distance:{
                    attackFrom:-2,
                },
                ai:{
                    basic:{
                        equipValue:4.5,
                    },
                },
                skills:["xinyinyueqiang_skill"],
            },
        },
        translate:{
            xinyinyueqiang:"银月枪",
            "xinyinyueqiang_info":"当你于回合外第一次失去牌后，你可以对一名角色使用一张【杀】。",
        },
        list:[],
    },
    skill:{
        skill:{
            xinfanghun:{
                mod:{
                    aiValue:function (player, card, num) {
                        if (card.name != 'sha' && card.name != 'shan') return;
                        var geti = function () {
                            var cards = player.getCards('hs', function (card) {
                                return card.name == 'sha' || card.name == 'shan';
                            });
                            if (cards.contains(card)) {
                                return cards.indexOf(card);
                            }
                            return cards.length;
                        };
                        return Math.max(num, [7, 5, 5, 3][Math.min(geti(), 3)]);
                    },
                },
                hiddenCard:function (player, name) {
                    if (!player.storage.xinfanghun || player.storage.xinfanghun <= 0) return false;
                    if (name == 'tao') return player.countCards('hs', 'jiu') > 0;
                    if (name == 'jiu') return player.countCards('hs', 'tao') > 0;
                    return false;
                },
                audio:"fanghun",
                marktext:"影",
                intro:{
                    content:"mark",
                    name:"梅影",
                },
                trigger:{
                    player:"useCard",
                    target:"useCardToTargeted",
                },
                forced:true,
                locked:false,
                filter:function (event) {
                    return event.card && event.card.name == 'sha';
                },
                content:function () {
                    player.addMark('xinfanghun', trigger.num || 1);
                },
                group:["xinfanghun_sha","xinfanghun_draw"],
                subSkill:{
                    draw:{
                        trigger:{
                            player:["useCardAfter","respondAfter"],
                        },
                        forced:true,
                        popup:false,
                        filter:function (event) {
                            return event.skill == 'xinfanghun_sha';
                        },
                        content:function () {
                            player.draw();
                        },
                        sub:true,
                        parentskill:"xinfanghun",
                    },
                    sha:{
                        audio:"longdan_sha",
                        enable:["chooseToUse","chooseToRespond"],
                        prompt:"移去一枚【梅影】标记，将杀当做闪，或将闪当做杀，或将桃当做酒，或将酒当做桃使用或打出",
                        viewAs:function (cards, player) {
                            var name = false;
                            switch (get.name(cards[0], player)) {
                                case 'sha': name = 'shan'; break;
                                case 'shan': name = 'sha'; break;
                                case 'tao': name = 'jiu'; break;
                                case 'jiu': name = 'tao'; break;
                            }
                            if (name) return { name: name };
                            return null;
                        },
                        position:"hs",
                        check:function (card) {
                            var player = _status.event.player;
                            if (_status.event.type == 'phase') {
                                var max = 0;
                                var name2;
                                var list = ['sha', 'tao', 'jiu'];
                                var map = { sha: 'shan', tao: 'jiu', jiu: 'tao' }
                                for (var i = 0; i < list.length; i++) {
                                    var name = list[i];
                                    if (player.countCards('hs', map[name]) > (name == 'jiu' ? 1 : 0) && player.getUseValue({ name: name }) > 0) {
                                        var temp = get.order({ name: name });
                                        if (temp > max) {
                                            max = temp;
                                            name2 = map[name];
                                        }
                                    }
                                }
                                if (name2 == get.name(card, player)) return 1;
                                return 0;
                            }
                            return 1;
                        },
                        filterCard:function (card, player, event) {
                            event = event || _status.event;
                            var filter = event._backup.filterCard;
                            var name = get.name(card, player);
                            if (name == 'sha' && filter({ name: 'shan', cards: [card] }, player, event)) return true;
                            if (name == 'shan' && filter({ name: 'sha', cards: [card] }, player, event)) return true;
                            if (name == 'tao' && filter({ name: 'jiu', cards: [card] }, player, event)) return true;
                            if (name == 'jiu' && filter({ name: 'tao', cards: [card] }, player, event)) return true;
                            return false;
                        },
                        filter:function (event, player) {
                            if (!player.storage.xinfanghun || player.storage.xinfanghun <= 0) return false;
                            var filter = event.filterCard;
                            if (filter({ name: 'sha' }, player, event) && player.countCards('hs', 'shan')) return true;
                            if (filter({ name: 'shan' }, player, event) && player.countCards('hs', 'sha')) return true;
                            if (filter({ name: 'tao' }, player, event) && player.countCards('hs', 'jiu')) return true;
                            if (filter({ name: 'jiu' }, player, event) && player.countCards('hs', 'tao')) return true;
                            return false;
                        },
                        onrespond:function () { return this.onuse.apply(this, arguments) },
                        onuse:function (result, player) {
                            player.removeMark('xinfanghun', 1);
                        },
                        ai:{
                            respondSha:true,
                            respondShan:true,
                            skillTagFilter:function (player, tag) {
                                if (!player.storage.xinfanghun || player.storage.xinfanghun < 0) return false;
                                var name;
                                switch (tag) {
                                    case 'respondSha': name = 'shan'; break;
                                    case 'respondShan': name = 'sha'; break;
                                }
                                if (!player.countCards('hs', name)) return false;
                            },
                            order:function (item, player) {
                                if (player && _status.event.type == 'phase') {
                                    var max = 0;
                                    var list = ['sha', 'tao', 'jiu'];
                                    var map = { sha: 'shan', tao: 'jiu', jiu: 'tao' }
                                    for (var i = 0; i < list.length; i++) {
                                        var name = list[i];
                                        if (player.countCards('hs', map[name]) > (name == 'jiu' ? 1 : 0) && player.getUseValue({ name: name }) > 0) {
                                            var temp = get.order({ name: name });
                                            if (temp > max) max = temp;
                                        }
                                    }
                                    if (max > 0) max += 0.3;
                                    return max;
                                }
                                if (!player) player = _status.event.player;
                                return 1;
                            },
                        },
                        sub:true,
                        parentskill:"xinfanghun",
                    },
                },
            },
            xinfuhan:{
                audio:"fuhan",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                unique:true,
                limited:true,
                skillAnimation:true,
                animationColor:"orange",
                forceunique:true,
                filter:function (event, player) {
                    return player.countMark('xinfanghun') > 0;
                },
                prompt:function (event, player) {
                    var num = Math.max(2, player.countMark('xinfanghun'));
                    num = Math.min(num, 8);
                    return get.prompt('xinfuhan') + '（体力上限：' + num + '）';
                },
                check:function (event, player) {
                    if (player.countMark('xinfanghun') >= Math.min(4, player.maxHp)) return true;
                    if (player.hp <= 2 && player.countMark('xinfanghun') >= 3) return true;
                    return false;
                },
                content:function () {
                    'step 0'
                    var num = Math.max(2, player.countMark('xinfanghun'));
                    num = Math.min(num, 8);
                    event.num = num;
                    player.removeMark('xinfanghun', player.countMark('xinfanghun'));
                    player.awakenSkill('xinfuhan');
                    var list;
                    if (_status.characterlist) {
                        list = [];
                        for (var i = 0; i < _status.characterlist.length; i++) {
                            var name = _status.characterlist[i];
                            if (lib.character[name][1] == 'shu') list.push(name);
                        }
                    }
                    else if (_status.connectMode) {
                        list = get.charactersOL(function (i) {
                            return lib.character[i][1] != 'shu';
                        });
                    }
                    else {
                        list = get.gainableCharacters(function (info) {
                            return info[1] == 'shu';
                        });
                    }
                    var players = game.players.concat(game.dead);
                    for (var i = 0; i < players.length; i++) {
                        list.remove(players[i].name);
                        list.remove(players[i].name1);
                        list.remove(players[i].name2);
                    }
                    list.remove('xin_zhaoxiang');
                    player.chooseButton(['扶汉：选择获得一张武将牌上的所有技能', [list.randomGets(5), 'character']], true);
                    'step 1'
                    if (result.bool) {
                        var name = result.links[0];
                        player.flashAvatar('xinfuhan', name);
                        game.log(player, '获得了', '#y' + get.translation(name), '的所有技能');
                        player.addSkill(lib.character[name][3])
                    }
                    'step 2'
                    var num = event.num - player.maxHp;
                    if (num > 0) player.gainMaxHp(num);
                    else player.loseMaxHp(-num);
                    player.recover();
                    'step 3'
                    var card = get.cardPile('xinyinyueqiang', 'field');
                    if (card) {
                        player.gain(card, 'gain2', 'log');
                    }
                },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function (player, skill) {
                    player.storage[skill] = false;
                },
            },
            xunqueishi:{
                trigger:{
                    global:"phaseBefore",
                    player:"enterGame",
                },
                forced:true,
                locked:false,
                filter:function (event, player) {
                    return (event.name != 'phase' || game.phaseNumber == 0) && !player.isDisabled(1);
                },
                content:function () {
                    if (!lib.inpile.contains('xinyinyueqiang')) {
                        lib.inpile.push('xinyinyueqiang');
                        player.equip(game.createCard('xinyinyueqiang', 'diamond', 12));
                    }
                    else {
                        var card = get.cardPile(function (card) {
                            return card.name == 'xinyinyueqiang' && card != player.getEquip(1);
                        }, 'field');
                        if (card) player.equip(card);
                    }
                },
            },
            "xinyinyueqiang_skill":{
                equipSkill:true,
                trigger:{
                    player:["loseAfter"],
                    global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
                },
                filter:function (event, player) {
                    if (player == _status.currentPhase) return false;
                    var evt = event.getl(player);
                    if (!evt || !evt.cards2 || !evt.cards2.length) return false;
                    var list = player.getHistory('lose', function (evt) {
                        return evt.cards2 && evt.cards2.length;
                    });
                    if (event.name == 'lose') {
                        if (list.indexOf(event) != 0) return false;
                    }
                    else {
                        if (!player.hasHistory('lose', function (evt) {
                            return evt.getParent() == event && list.indexOf(evt) == 0;
                        })) return false;
                    }
                    return _status.connectMode || !lib.config.skip_shan || player.hasSha();
                },
                direct:true,
                content:function () {
                    if (trigger.delay === false) game.delayx();
                    player.chooseToUse('银月枪：是否使用一张【杀】？', function (card) {
                        if (get.name(card) != 'sha') return false;
                        return lib.filter.cardEnabled.apply(this, arguments);
                    }).set('addCount', false).logSkill = 'xinyinyueqiang_skill';
                },
            },
        },
        translate:{
            xinfanghun:"芳魂",
            "xinfanghun_info":"当你使用【杀】指定目标或成为【杀】的目标后，你获得一个“梅影”标记；你可以移去一个“梅影”标记来发动“龙胆”并摸一张牌。",
            xinfuhan:"扶汉",
            "xinfuhan_info":"限定技，回合开始时，你可以移去所有“梅影”标记，然后从五张未登场的蜀势力武将牌中选择一名获得其所有技能，并将体力上限数调整为此次技能移去所有“梅影”标记的数量（至少为2至多为8），回复一点体力。",
            xunqueishi:"鹊拾",
            "xunqueishi_info":"游戏开始时，将【银月枪】置于你的装备区。当你发动“扶汉”后你从场上牌堆或弃牌堆中获得【银月枪】。",
            "xinyinyueqiang_skill":"银月枪",
            "xinyinyueqiang_skill_info":"当你于回合外第一次失去牌后，你可以对一名角色使用一张【杀】。",
        },
    },
    intro:"",
    author:"",
    diskURL:"",
    forumURL:"",
    version:"",
},files:{"character":["xin_zhaoxiang.jpg"],"card":[],"skill":[]}}};