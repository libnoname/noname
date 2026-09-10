import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {
    name:"谋张郃",
    content:function(config,pack){
    },
    precontent:function(){},
    config:{},
    help:{},
    package:{
        character:{
            character:{
                ssb_zhanghe: ['male', 'wei', 4, ['ssbqiaobian','ssbliaoshi']],
            },
            translate: {
                ssb_zhanghe: "谋张郃",
            },
        },
        card:{
            card:{},
            translate:{},
            list:[],
        },
        skill:{
            skill:{
    ssbqiaobian: {
    audio: 'sbqiaobian',
    trigger: { player: 'phaseZhunbeiBegin' },
    filter: function (event, player) {
        return player.countCards('h') > 0 || player.countCards('e') > 0 || player.countCards('j') > 0;
    },
    check: function (event, player) {
        if (player.countCards('j') > 0) return true;
        if (player.countCards('h') > 0) return true;
        if (player.countCards('e') > 0) return true;
        return false;
    },
    content: function () {
        'step 0'
        var list = [];
        if (player.countCards('h') > 0) list.push(['手牌', '手牌区']);
        if (player.countCards('e') > 0) list.push(['装备', '装备区']);
        if (player.countCards('j') > 0) list.push(['判定', '判定区']);
        if (list.length === 0) {
            event.finish();
            return;
        }
        var next = player.chooseButton([
            get.prompt('ssbqiaobian'),
            [list, 'textbutton']
        ], [1, Math.min(3, list.length)]);
        next.set('ai', function (button) {
            var player = _status.event.player;
            var choice = button.link[0];
            if (choice === '判定') return 20;
            if (choice === '手牌') {
                var overflow = player.countCards('h') - player.hp;
                if (overflow > 0) return 16;
                return 12;
            }
            if (choice === '装备') {
                var equips = player.getCards('e');
                for (var i = 0; i < equips.length; i++) {
                    if (get.value(equips[i], player) < 4) return 10;
                }
                return 6;
            }
            return 1;
        });
        'step 1'
        if (!result || !result.bool || !result.links || result.links.length === 0) {
            event.finish();
            return;
        }        
        event._rawLinks = result.links.map(function(link) {
            return Array.isArray(link) ? link[0] : link;
        });
        event.areaCount = event._rawLinks.length;
        event.cards = [];
        event.currentArea = 0;
        'step 2'
        if (event.currentArea >= event.areaCount) {
            event.goto(4);
            return;
        }
        var areaName = event._rawLinks[event.currentArea];
        if (areaName === '手牌') {
            player.chooseToDiscard('巧变：弃置手牌区的一张牌', 'h', true).set('ai', function (card) {
                return 6 - get.value(card);
            });
        }
        else if (areaName === '装备') {
            player.chooseToDiscard('巧变：弃置装备区的一张牌', 'e', true).set('ai', function (card) {
                return 6 - get.value(card);
            });
        }
        else if (areaName === '判定') {
            player.discardPlayerCard(player, 'j', true).set('prompt', '巧变：弃置判定区的一张牌').set('ai', function (card) {
                return 20;
            });
        }
        'step 3'
        if (result.bool && result.cards && result.cards.length > 0) {
            event.cards.push(result.cards[0]);
        }
        event.currentArea++;
        event.goto(2);
        'step 4'
        if (!event.cards || event.cards.length === 0) {
            event.finish();
            return;
        }
        var actualSkipCount = event.cards.length;        
        event.videoId = lib.status.videoId++;
        var func = function(player, id, count) {
            var list = [
                '跳过判定阶段',
                '跳过摸牌阶段（可获得其他角色手牌）',
                '跳过出牌阶段（可移动场上牌）',
                '跳过弃牌阶段（摸一张牌，可能额外出牌）'
            ];
            var choiceList = ui.create.dialog('巧变：请选择' + get.cnNumber(count) + '个要跳过的阶段');
            choiceList.videoId = id;
            for (var i = 0; i < list.length; i++) {
                var str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block">';
                str += list[i];
                str += '</div>';
                var next = choiceList.add(str);
                next.firstChild.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
                next.firstChild.link = i;
                for (var j in lib.element.button) {
                    next[j] = lib.element.button[j];
                }
                choiceList.buttons.add(next.firstChild);
            }
            return choiceList;
        };       
        if (player.isOnline2()) {
            player.send(func, player, event.videoId, actualSkipCount);
        }
        event.dialog = func(player, event.videoId, actualSkipCount);
        if (player != game.me || _status.auto) {
            event.dialog.style.display = 'none';
        }
        var next = player.chooseButton();
        next.set('dialog', event.videoId);
        next.set('forced', true);
        next.set('selectButton', [actualSkipCount, actualSkipCount]);
        next.set('ai', function(button) {
            var player = _status.event.player;
            var choice = button.link;
            var handCount = player.countCards('h');
            var playerCount = game.countPlayer();
            var needDiscard = handCount - player.hp;            
            switch(choice) {
                case 0:
                    return player.countCards('j') > 0 ? 10 : 1;
                case 1:
                    var enemies = game.filterPlayer(function(p) {
                        return p !== player && p.countGainableCards(player, 'h') > 0 && get.attitude(player, p) < 0;
                    });
                    if (enemies.length >= 2) return 9;
                    if (handCount > player.hp + 2) return 6;
                    return 4;
                case 2:
                    return player.canMoveCard() ? 7 : 3;
                case 3:
                    var weight = 6;
                    if (needDiscard > 2) weight += 4;
                    else if (needDiscard > 0) weight += 3;
                    if (handCount >= playerCount - 1) weight += 3;
                    else weight += 2;
                    return weight;
            }
            return 0;
        });
        'step 5'
        if (player.isOnline2()) {
            player.send('closeDialog', event.videoId);
        }
        if (event.dialog) event.dialog.close();        
        var choices = [];
        if (result && result.links && result.links.length > 0) {
            var phaseMap = ['phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard'];
            for (var i = 0; i < result.links.length; i++) {
                choices.push(phaseMap[result.links[i]]);
            }
        }        
        if (choices.length === 0) {
            event.finish();
            return;
        }
        event.skipPhases = choices;
        if (choices.contains('phaseJudge')) player.skip('phaseJudge');
        if (choices.contains('phaseDraw')) player.skip('phaseDraw');
        if (choices.contains('phaseUse')) player.skip('phaseUse');
        if (choices.contains('phaseDiscard')) player.skip('phaseDiscard');
        player.logSkill('ssbqiaobian');
        if (choices.contains('phaseDraw')) {
            event.goto(6);
        } else if (choices.contains('phaseUse')) {
            event.goto(9);
        } else if (choices.contains('phaseDiscard')) {
            event.goto(13);
        } else {
            event.finish();
        }
        'step 6'
        var hasTarget = game.hasPlayer(function (current) {
            return current !== player && current.countGainableCards(player, 'h') > 0;
        });        
        if (hasTarget) {
            player.chooseTarget([1, 2], '巧变：是否获得至多两名其他角色各一张手牌？', function (card, player, target) {
                return target !== player && target.countGainableCards(player, 'h') > 0;
            }).set('ai', function (target) {
                return -get.attitude(_status.event.player, target);
            });
        } else {
            result = { bool: false };
            event.goto(8);
        }
        'step 7'
        if (result.bool && result.targets && result.targets.length > 0) {
            var targets = result.targets.sortBySeat();
            player.line(targets, 'green');
            player.gainMultiple(targets);
            game.delayx();
        } else {
            event.goto(8);
        }
        'step 8'
        game.delayx();
        if (!player.isMaxHandcard()) {
            player.draw();
            game.log(player, '手牌数不为全场最多，摸了一张牌');
        }
        if (event.skipPhases.contains('phaseUse')) event.goto(9);
        else if (event.skipPhases.contains('phaseDiscard')) event.goto(13);
        else event.finish();
        'step 9'
        // 关键修改：记录所有玩家移动前的装备区和判定区牌数
        event._equipCountssbefore = {};
        event._judgeCountssbefore = {};
        game.filterPlayer(function(p) {
            event._equipCountssbefore[p.playerid] = p.countCards('e');
            event._judgeCountssbefore[p.playerid] = p.countCards('j');
            return false;
        });        
        event.preEquipCount = player.countCards('e');
        player.moveCard(true);
        'step 10'
        game.delayx();
        'step 11'
        // 关键修改：检查装备区和判定区是否未增加
        if (player.countCards('e') <= event.preEquipCount) {
            // 找出场上牌数增加的角色（装备区或判定区）
            var targets = [];
            game.filterPlayer(function(p) {
                // 检查装备区或判定区是否增加
                if (p.countCards('e') > event._equipCountssbefore[p.playerid] || 
                    p.countCards('j') > event._judgeCountssbefore[p.playerid]) {
                    targets.push(p);
                }
                return false;
            });           
            if (targets.length > 0) {
                event._drawTargets = targets;
                if (targets.length === 1) {
                    player.chooseBool('巧变：是否令' + get.translation(targets[0]) + '摸一张牌？').set('ai', function() {
                        return get.attitude(player, targets[0]) > 0;
                    });
                } else {
                    player.chooseTarget('巧变：是否令一名因此场上牌数增加的角色摸一张牌？', function(card, player, target) {
                        return event._drawTargets.contains(target);
                    }).set('ai', function(target) {
                        return get.attitude(player, target);
                    });
                }
            } else {
                result = { bool: false };
                if (event.skipPhases.contains('phaseDiscard')) event.goto(13);
                else event.finish();
            }
        } else {
            result = { bool: false };
            if (event.skipPhases.contains('phaseDiscard')) event.goto(13);
            else event.finish();
        }
        'step 12'
        if (result.bool) {
            var target;
            if (event._drawTargets.length === 1) {
                target = event._drawTargets[0];
            } else if (result.targets && result.targets.length > 0) {
                target = result.targets[0];
            }
            if (target) target.draw();
        }       
        if (event.skipPhases.contains('phaseDiscard')) event.goto(13);
        else event.finish();
        'step 13'
        player.draw();
        game.delayx();
        player.addTempSkill('ssbqiaobian_jieshu');
    },
    group: 'ssbqiaobian_tag',  
    subSkill: {
        tag: {
            trigger: { player: 'gainAfter' },
            forced: true,
            charlotte: true,
            popup: false,
            filter: function(event, player) {
                var parent = event.parent;
                var depth = 0;
                while(parent && depth < 10){
                    if(parent.name === 'ssbqiaobian') return true;
                    parent = parent.parent;
                    depth++;
                }
                return false;
            },
            content: function() {
                if(trigger.cards && trigger.cards.length > 0){
                    player.addGaintag(trigger.cards, 'ssbqiaobian');
                }
            }
        },        
        jieshu: {
            trigger: { player: 'phaseJieshuBegin' },
            charlotte: true,
            popup: false,
            forced: true,
            filter: function (event, player) {
                return player.countCards('h') >= game.countPlayer();
            },
            content: function () {
                player.removeSkill('ssbqiaobian_jieshu');
                var next = player.phaseUse();
                next.set('ssbqiaobian_extra', true);
            }
        }
    },
    ai: {
        threaten: 1.5,
        order: 7
    }
},
    ssbliaoshi:{
    audio:2,
    enable:['chooseToUse','chooseToRespond'],
    usable:1,
    filter:function(event,player){
        if(event.type=='wuxie') return false;
        var cards=player.getCards('h',function(card){
            return card.hasGaintag('ssbqiaobian');
        });
        if(!cards.length) return false;
            for(var i of lib.inpile){
            if(i!='du'&&get.type(i)=='basic'&&event.filterCard({name:i},player,event)) return true;
            if(i=='sha'){
                for(var j of lib.inpile_nature){
                    if(event.filterCard({name:i,nature:j},player,event)) return true;
                }
            }
        }
        return false;
    },
    chooseButton:{
        dialog:function(event,player){
            var vcards=[];         
            for(var i of lib.inpile){
                if(i!='du'&&get.type(i)=='basic'&&event.filterCard({name:i},player,event)) vcards.push(['基本','',i]);
                if(i=='sha'){
                    for(var j of lib.inpile_nature){
                        if(event.filterCard({name:i,nature:j},player,event)) vcards.push(['基本','',i,j]);
                    }
                }
            }
            return ui.create.dialog('料势：选择要转化成的基本牌',[vcards,'vcard']);
        },
        check:function(button,player){
            if(_status.event.getParent().type!='phase') return 1;
            return _status.event.player.getUseValue({name:button.link[2],nature:button.link[3]});
        },
        backup:function(links,player){
            return {
                audio:'ssbliaoshi',
                popname:true,
                viewAs:{name:links[0][2],nature:links[0][3]},
                filterCard:function(card){
                    return card.hasGaintag('ssbqiaobian');
                },
                selectCard:1,
                position:'h',
                prompt:function(){
                    return '选择一张因〖巧变〗获得的牌当做'+(get.translation(links[0][3])||'')+get.translation(links[0][2])+'使用';
                }
            }
        },
        prompt:function(links,player){
            return '选择一张因〖巧变〗获得的牌当做'+(get.translation(links[0][3])||'')+get.translation(links[0][2])+'使用';
        }
    },
    ai:{
        respondSha:true,
        respondShan:true,
        skillTagFilter:function(player){
            return player.countCards('h',function(card){
                return card.hasGaintag('ssbqiaobian');
            })>0;
        },
        order:0.5,
        result:{
            player:function(player){
                if(_status.event.dying){
                    return get.attitude(player,_status.event.dying);
                }
                if(_status.event.type=='respondShan') return 1;
                var cards=player.getCards('h',function(card){
                    return card.hasGaintag('ssbqiaobian');
                });
                if(cards.length>0) return 1;
                return 0;
            },
        },
    }
},
            },
            translate:{
            ssbqiaobian:'巧变',
			ssbqiaobian_info:'准备阶段，你可弃置任意张不同区域内的牌，然后跳过等量个阶段。若你以此法跳过：1.摸牌阶段，你可以获得至多两名其他角色各一张手牌，然后若你手牌数不为全场最多，你摸一张牌；2.出牌阶段，你可以移动场上一张牌，然后若你装备区内的牌数未增加，则你可令因此场上牌数增加的角色摸一张牌；3.弃牌阶段，你摸一张牌，结束阶段，若你手牌数不小于场上角色数，你执行一个额外的出牌阶段。',
			ssbliaoshi:'料势',
			ssbliaoshi_info:'每回合限一次，你可将一张因〖巧变〗获得的牌当做任意基本牌使用或打出。',
            },
        },
        intro:"",
        author:"苻",
        diskURL:"",
        forumURL:"",
        version:"1.0",
    },
    files:{"character":[],"card":[],"skill":[]}
}};
