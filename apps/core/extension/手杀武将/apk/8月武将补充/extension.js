import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"8月武将补充",content:function(config,pack){
    

},precontent:function(){
    game.isPrime ??= function(n) {
        if (typeof n !== 'number' || n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        for (var i = 3; i * i <= n; i += 2) {
            if (n % i === 0) return false;
        }
        return true;
    };
    
    game.qiongsheProcess ??= function(player) {
        var cards = get.cards(8);
        player.showCards(cards, '穷涉');
        var gainCards = [];
        for (var i = 0; i < cards.length; i++) {
            if (game.isPrime(get.number(cards[i]))) {
                gainCards.push(cards[i]);
            }
        }
        if (gainCards.length) {
            player.gain(gainCards, 'gain2');
            if (typeof player.storage.qiongshe !== 'number') player.storage.qiongshe = 0;
            player.storage.qiongshe += gainCards.length;
            player.syncStorage('qiongshe');
            player.markSkill('qiongshe');
        }
        var discardCards = [];
        for (var i = 0; i < cards.length; i++) {
            if (!gainCards.contains(cards[i])) {
                discardCards.push(cards[i]);
            }
        }
        if (discardCards.length) {
            game.cardsDiscard(discardCards);
        }
    };


     

},help:{},config:{},package:{
    character:{
        character:{
            "ol_re_zhonghui":["male","wei",4,["olquanji","olzili","olpaiyi"],["isExtension"]],
            "ol_wangai":["male","wei",4,["olqinli"],["isExtension"]],
            "xiangxue_liushan":["male","shu",4,["xiangxue","zhiyong"],["No_Outcrop","isExtension"]],
            "haoxue_lvmeng":["male","wu",4,["haoxue","qiongshe"],["No_Outcrop","isExtension"]],
            "boxue_caozhi":["male","wei",3,["cboxue","czhichong"],["No_Outcrop","isExtension"]],
            "clan_zhugedan":["male","wei",4,["clanjiaojie","clanfuyu","clanfenshi"],["character:zhugedan","isExtension"]],
            "clan_zhugeguo":["female","shu",3,["clanfuyao","clanfenshi"],["character:zhugeguo","isExtension"]],
            "shen_huangzhong":["male","shen",4,["shenyu","huaren"],["No_Outcrop","isExtension"]],
        },
        translate:{
            "ol_re_zhonghui":"ol界钟会",
            "ol_wangai":"王皑",
            "xiangxue_liushan":"刘禅想学",
            "haoxue_lvmeng":"吕蒙好学",
            "boxue_caozhi":"曹植博学",
            "clan_zhugedan":"族诸葛诞",
            "clan_zhugeguo":"族诸葛果",
            "shen_huangzhong":"神黄忠",
        },
    },
    card:{
        card:{
            chixueren:{
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    distance: {
        attackFrom: function(card, player) {
            return player.hasSkill('shenyu') ? -2 : 0;
        },
    },
    ai: {
        equipValue: function(card, player) {
            if (!player.hasSkill('shenyu')) return 1;
            return Math.min(2.5 + player.countCards('h', 'sha'), 4);
        },
        basic: {
            equipValue: 3.5,
            order: function(card, player) {
                const equipValue = get.equipValue(card, player) / 20;
                return player && player.hasSkillTag('reverseEquip') ? 8.5 - equipValue : 8 + equipValue;
            },
            useful: 2,
            value: function(card, player, index, method) {
                if (!player.getCards('e').contains(card) && !player.canEquip(card, true)) return 0.01;
                const info = get.info(card), current = player.getEquip(info.subtype), value = current && card != current && get.value(current, player);
                let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                if (typeof equipValue == 'function') {
                    if (method == 'raw') return equipValue(card, player);
                    if (method == 'raw2') return equipValue(card, player) - value;
                    return Math.max(0.1, equipValue(card, player) - value);
                }
                if (typeof equipValue != 'number') equipValue = 0;
                if (method == 'raw') return equipValue;
                if (method == 'raw2') return equipValue - value;
                return Math.max(0.1, equipValue - value);
            },
        },
        result: {
            target: function(player, target, card) {
                return get.equipResult(player, target, card.name);
            },
        },
    },
    skills: ["chixueren_skill", "chixueren_inherit"],
    enable: true,
    selectTarget: -1,
    filterTarget: function(card, player, target) {
        return player == target && target.canEquip(card, true);
    },
    modTarget: true,
    allowMultiple: false,
    content: function() {
        if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
    },
    toself: true,
},
        },
        translate:{
            chixueren:"赤血刃",
            "chixueren_info":"锁定技，每回合首次你的【杀】对攻击范围内最远角色造成的伤害+1。此牌首次替换其他武器牌后，获得该武器牌的技能。",
        },
        list:[],
    },
    skill:{
        skill:{
            olquanji:{
                audio:"ext:手杀武将/apk/8月武将补充:2",
                trigger:{
                    player:"damageEnd",
                    source:"damageEnd",
                },
                frequent:true,
                locked:false,
                notemp:true,
                filter:function(event, player) {
        return event.num > 0;
    },
                content:function() {
        "step 0"
        event.count = trigger.num;
        player.chooseBool("是否摸一张牌？").set("frequentSkill", "olquanji");
        "step 1"
        if (result.bool) {
            player.logSkill("olquanji");
            player.draw();
        }
        "step 2"
        var current = _status.currentPhase;
        if (current && current.isAlive() && current.countCards("h") > 0) {
            current.chooseCard("将一张手牌置于" + get.translation(player) + "的武将牌上作为“权”", true);
        } else {
            event.finish();
        }
        "step 3"
        if (result.cards && result.cards.length) {
            var cards = result.cards;
            player.addToExpansion(cards, player, "giveAuto").gaintag.add("olquanji");
            game.log(player, "获得了", cards, "作为“权”");
        }
        "step 4"
        event.count--;
        if (event.count > 0 && player.hasSkill("olquanji")) {
            player.chooseBool("是否继续发动【权计】？").set("frequentSkill", "olquanji");
        } else {
            event.finish();
        }
        "step 5"
        if (result.bool) {
            player.logSkill("olquanji");
            event.goto(1);
        }
    },
                marktext:"权",
                intro:{
                    markcount:"expansion",
                    mark:function(dialog, expansion, player) {
            var cards = player.getExpansions("olquanji");
            if (cards && cards.length) {
                dialog.add("ul", "<li>权：共" + cards.length + "张</li>");
                for (var i = 0; i < cards.length; i++) {
                    dialog.add("li", get.translation(cards[i]));
                }
            } else {
                dialog.add("ul", "<li>权：无</li>");
            }
        },
                },
                onremove:function(player, skill) {
        var cards = player.getExpansions(skill);
        if (cards.length) player.loseToDiscardpile(cards);
    },
                mod:{
                    maxHandcard:function(player, num) {
            return num + player.getExpansions("olquanji").length;
        },
                },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    threaten:0.8,
                    effect:{
                        target:function(card, player, target) {
                if (get.tag(card, "damage")) {
                    if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
                    if (!target.hasFriend()) return;
                    if (target.hp >= 4) return [0.5, get.tag(card, "damage") * 2];
                    if (!target.hasSkill("paiyi") && target.hp > 1) return [0.5, get.tag(card, "damage") * 1.5];
                    if (target.hp == 3) return [0.5, get.tag(card, "damage") * 1.5];
                    if (target.hp == 2) return [1, get.tag(card, "damage") * 0.5];
                }
            },
                    },
                },
                "_priority":0,
            },
            olzili:{
                skillAnimation:true,
                animationColor:"thunder",
                audio:"ext:手杀武将/apk/8月武将补充:2",
                audioname:["re_zhonghui"],
                unique:true,
                juexingji:true,
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                filter:function(event, player) {
        return !player.hasSkill("olpaiyi") && player.getExpansions("olquanji").length >= 3;
    },
                content:function() {
        "step 0"
        player.chooseDrawRecover(2, true, function(event, player) {
            if (player.hp == 1 && player.isDamaged()) return "recover_hp";
            return "draw_card";
        });
        "step 1"
        player.loseMaxHp();
        player.addSkill("olpaiyi");
        player.awakenSkill("olzili");
    },
                "_priority":0,
            },
            olpaiyi:{
                enable:"phaseUse",
                usable:2,
                audio:"ext:手杀武将/apk/8月武将补充:2",
                audioname:["re_zhonghui"],
                filter:function(event, player) {
        if (player.getStat("skill").olpaiyi) return player.hasSkill("olpaiyi2");
        return player.getExpansions("olquanji").length > 0;
    },
                chooseButton:{
                    dialog:function(event, player) {
            return ui.create.dialog("排异", player.getExpansions("olquanji"), "hidden");
        },
                    backup:function(links, player) {
            return {
                audio: "olpaiyi",
                audioname: ["re_zhonghui"],
                filterTarget: true,
                filterCard: function() { return false; },
                selectCard: -1,
                card: links[0],
                delay: false,
                content: lib.skill.olpaiyi.contentx,
                ai: {
                    order: 10,
                    result: {
                        target: function(player, target) {
                            if (player != target) return 0;
                            if (player.countCards("h") + 2 <= player.hp + player.getExpansions("olquanji").length) return 1;
                            return 0;
                        }
                    }
                }
            };
        },
                    prompt:function() { return "请选择〖排异〗的目标"; },
                },
                contentx:function() {
        "step 0"
        var card = lib.skill.olpaiyi_backup.card;
        player.loseToDiscardpile(card);
        "step 1"
        player.chooseControl("摸两张牌", "造成1点伤害").set("prompt", "排异：请选择〖排异〗的效果").set("ai", function() {
            var player = _status.event.player;
            var target = _status.event.target;
            if (target.countCards("h") > player.countCards("h")) {
                if (player.hp <= 2) return "摸两张牌";
            }
            return "造成1点伤害";
        });
        "step 2"
        if (result.control == "摸两张牌") {
            target.draw(2);
        } else {
            target.damage();
        }
        "step 3"
        if (target.countCards("h") > player.countCards("h")) {
            if (result.control == "摸两张牌") {
                target.damage();
            } else {
                target.draw(2);
            }
        }
        "step 4"
        if (target.countCards("h") > player.countCards("h")) {
            player.addTempSkill("olpaiyi2", "phaseUseEnd");
        }
    },
                ai:{
                    order:1,
                    combo:"olquanji",
                    result:{
                        player:1,
                    },
                },
                "_priority":0,
            },
            "olpaiyi2":{
                "_priority":0,
            },
            olqinli:{
                audio:"ext:手杀武将/apk/8月武将补充:2",
                trigger:{
                    player:["phaseZhunbeiBegin","damageAfter"],
                },
                filter:function(event, player) {
        return event.name != 'damage' || event.num > 0;
    },
                content:function() {
        var next = player.draw(trigger.name == 'damage' ? trigger.num : 1);
        next.gaintag = ['olqinli'];
    },
                group:"olqinli_end",
                subSkill:{
                    end:{
                        audio:"olqinli",
                        trigger:{
                            global:"phaseEnd",
                        },
                        filter:function(event, player) {
                return player.hasCard(card => card.hasGaintag('olqinli'), 'h');
            },
                        direct:true,
                        content:function() {
                'step 0'
                var cards = player.getCards('h', card => card.hasGaintag('olqinli'));
                event.cards = cards;
                player.chooseBool(get.prompt('olqinli_end', trigger.player), '将所有"勤励"牌置入弃牌堆，对' + get.translation(trigger.player) + '造成伤害').set('ai', function() {
                    var player = _status.event.player;
                    var target = _status.event.getTrigger().player;
                    var num = _status.event.getParent().cards.length;
                    if(get.attitude(player, target) >= 0) return false;
                    if(player.countCards('h') == num) return get.damageEffect(target, player, player) * num > 0;
                    return get.damageEffect(target, player, player) > 0;
                });
                'step 1'
                if(!result.bool) {
                    event.finish();
                    return;
                }
                player.logSkill('olqinli_end', trigger.player);
                player.discard(event.cards);
                'step 2'
                trigger.player.damage(player.countCards('h') == 0 ? event.cards.length : 1, player);
            },
                        sub:true,
                        parentskill:"olqinli",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            xiangxue:{
                audio:"ext:手杀武将/apk/8月武将补充:5",
                trigger:{
                    player:"useCardAfter",
                },
                forced:true,
                init:function(player) {
        if (!player.storage.xiangxue) player.storage.xiangxue = {
            used: [], counter: 0, count: 2, draw: 1,
            needNew: true, exchanged: false, deleted: false
        };
    },
                content:function() {
        "step 0"
        var info = player.storage.xiangxue;
        var name = trigger.card.name;
        var isNew = !info.used.includes(name);
        if (isNew) info.used.push(name);
        if (info.needNew != isNew) { event.finish(); return; }
        info.counter++;
        if (info.counter < info.count) { event.finish(); return; }
        info.counter = 0;
        player.addMark('wang', info.count);
        player.draw(info.draw);
        "step 1"
        var info = player.storage.xiangxue;
        if (player.countMark('wang') >= 6 && !info.exchanged) {
            info.exchanged = true;
            var t = info.count; info.count = info.draw; info.draw = t;
            game.log(player, '的', '#g【想学】', '交换了数字');
        }
        "step 2"
        var info = player.storage.xiangxue;
        if (player.countMark('wang') >= 9 && !info.deleted) {
            info.deleted = true; info.needNew = false;
            game.log(player, '的', '#g【想学】', '删除了"未"');
        }
        "step 3"
        if (player.countMark('wang') >= 12) {
            player.removeSkill('xiangxue');
            game.log(player, '失去了', '#g【想学】');
        }
    },
                mark:true,
                intro:{
                    content:function(storage) {
            storage = storage || {};
            var used = storage.used || [];
            if (!used.length) return '暂无记录';
            return '已使用' + used.length + '种：' + used.map(get.translation).join('、');
        },
                },
                onremove:function(player) {
        player.removeMark('wang', player.countMark('wang'));
        delete player.storage.xiangxue;
    },
                "_priority":0,
            },
            zhiyong:{
                audio:"ext:手杀武将/apk/8月武将补充:2",
                enable:"phaseUse",
                init:function(player) {
        if (!player.storage.zhiyong) player.storage.zhiyong = [];
    },
                filter:function(event, player) {
        var used = player.storage.zhiyong || [];
        if (!used.includes(1) && player.countCards('h')) return true;
        if (!used.includes(2) && player.countCards('he') >= 2) return true;
        var wang = player.countMark('wang');
        if (!used.includes(3) && wang > 0 && player.countCards('he') >= wang) return true;
        return false;
    },
                content:function() {
        'step 0'
        var used = player.storage.zhiyong || [];
        var wang = player.countMark('wang');
        var list = [];
        if (!used.includes(1) && player.countCards('h')) list.push('选项一');
        if (!used.includes(2) && player.countCards('he') >= 2) list.push('选项二');
        if (!used.includes(3) && wang > 0 && player.countCards('he') >= wang) list.push('选项三');
        player.chooseControl(list).set('prompt', '致用：选择一项');
        'step 1'
        event.index = ['选项一', '选项二', '选项三'].indexOf(result.control) + 1;
        if (event.index == 1) {
            event.num = player.countCards('h');
            player.chooseCard('h', event.num, true, '致用：选择' + event.num + '张手牌');
        } else if (event.index == 2) {
            event.num = 2;
            player.chooseCard('he', 2, true, '致用：选择2张牌');
        } else {
            event.num = player.countMark('wang');
            player.chooseCard('he', event.num, true, '致用：选择' + event.num + '张牌');
        }
        'step 2'
        if (!result.bool) {
            event.finish();
            return;
        }
        event.cards = result.cards;
        player.storage.zhiyong.add(event.index);
        if (event.num == event.index) {
            player.chooseTarget('致用：弃置一名其他角色' + event.num + '张牌，或取消摸' + event.num + '张牌', function(card, player, target) {
                return target != player && target.countCards('he') >= event.num;
            }).set('ai', function(target) {
                return -get.attitude(_status.event.player, target);
            });
        } else {
            player.discard(event.cards);
            player.chooseUseTarget({ name: 'sha' }, true);
            event.finish();
        }
        'step 3'
        if (result.bool) {
            result.targets[0].chooseToDiscard('he', event.num, true);
        } else {
            player.draw(event.num);
        }
        'step 4'
        player.chooseUseTarget({ name: 'sha' }, true);
    },
                ai:{
                    order:7,
                    result:{
                        player:1,
                    },
                },
                "_priority":0,
            },
            haoxue:{
                audio:"ext:手杀武将/apk/8月武将补充:4",
                locked:true,
                group:["haoxue_lose","haoxue_gain"],
                subSkill:{
                    lose:{
                        trigger:{
                            player:"loseAfter",
                            global:"loseAsyncAfter",
                        },
                        forced:true,
                        filter:function(event,player){
                if(event.type!='discard') return false;
                var evt=event.getl(player);
                if(!evt||!evt.cards2.length) return false;
                var phaseUse=event.getParent('phaseUse');
                return !(phaseUse&&phaseUse.player==player);
            },
                        content:function(){
                player.loseHp();
            },
                        sub:true,
                        parentskill:"haoxue",
                        "_priority":0,
                    },
                    gain:{
                        trigger:{
                            player:"gainAfter",
                            global:"loseAsyncAfter",
                        },
                        forced:true,
                        filter:function(event,player){
                var evt=event.getg(player);
                if(!evt||!evt.length) return false;
                var phaseUse=event.getParent('phaseUse');
                return phaseUse&&phaseUse.player==player;
            },
                        content:function(){
                player.recover();
            },
                        sub:true,
                        parentskill:"haoxue",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            qiongshe:{
                mark:true,
                marktext:"涉",
                init:function(player) {
        if (typeof player.storage.qiongshe !== 'number') player.storage.qiongshe = 0;
    },
                intro:{
                    content:function(storage, player) {
            return '累计获得：' + (player.storage.qiongshe || 0) + '张';
        },
                },
                group:["qiongshe_draw","qiongshe_use","qiongshe_discard"],
                subSkill:{
                    draw:{
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        filter:function(event, player) {
                return game.isPrime(player.countCards('h'));
            },
                        frequent:true,
                        preHidden:true,
                        content:function() {
                'step 0'
                player.chooseBool('穷涉：手牌数为' + player.countCards('h') + '（质数），是否亮出牌堆顶的八张牌？').set('ai', function() {
                    return true;
                });
                'step 1'
                if (result.bool) {
                    game.qiongsheProcess(player);
                }
            },
                        sub:true,
                        parentskill:"qiongshe",
                        "_priority":0,
                    },
                    use:{
                        enable:"phaseUse",
                        filter:function(event, player) {
                return game.isPrime(player.storage.qiongshe || 0);
            },
                        content:function() {
                game.qiongsheProcess(player);
            },
                        ai:{
                            order:7,
                            result:{
                                player:1,
                            },
                        },
                        sub:true,
                        parentskill:"qiongshe",
                        "_priority":0,
                    },
                    discard:{
                        trigger:{
                            player:"phaseDiscardEnd",
                        },
                        filter:function(event, player) {
                return game.isPrime(player.hp);
            },
                        frequent:true,
                        preHidden:true,
                        content:function() {
                'step 0'
                player.chooseBool('穷涉：体力值为' + player.hp + '（质数），是否亮出牌堆顶的八张牌？').set('ai', function() {
                    return true;
                });
                'step 1'
                if (result.bool) {
                    game.qiongsheProcess(player);
                }
            },
                        sub:true,
                        parentskill:"qiongshe",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            cboxue:{
                audio:"ext:手杀武将/apk/8月武将补充:2",
                enable:["chooseToUse","chooseToRespond"],
                init:function(player){
        player.storage.cboxue=-1;
    },
                filter:function(event,player){
        if(player.storage.cboxue==game.roundNumber) return false;
        var discardNames=[];
        for(var i=0;i<ui.discardPile.childNodes.length;i++){
            discardNames.add(ui.discardPile.childNodes[i].name);
        }
        for(var i of lib.inpile){
            if(discardNames.contains(i)) continue;
            var type=get.type(i);
            if((type=='basic'||type=='trick')&&event.filterCard({name:i},player,event)) return true;
        }
        return false;
    },
                chooseButton:{
                    dialog:function(event,player){
            var list=[];
            var discardNames=[];
            for(var i=0;i<ui.discardPile.childNodes.length;i++){
                discardNames.add(ui.discardPile.childNodes[i].name);
            }
            for(var i=0;i<lib.inpile.length;i++){
                var name=lib.inpile[i];
                if(discardNames.contains(name)) continue;
                if(name=='sha'){
                    if(event.filterCard({name:name},player,event)) list.push(['基本','','sha']);
                    for(var j of lib.inpile_nature){
                        if(event.filterCard({name:name,nature:j},player,event)) list.push(['基本','','sha',j]);
                    }
                }
                else if(get.type(name)=='trick'&&event.filterCard({name:name},player,event)) list.push(['锦囊','',name]);
                else if(get.type(name)=='basic'&&event.filterCard({name:name},player,event)) list.push(['基本','',name]);
            }
            return ui.create.dialog('博学',[list,'vcard']);
        },
                    filter:function(button,player){
            return _status.event.getParent().filterCard({name:button.link[2]},player,_status.event.getParent());
        },
                    check:function(button){
            if(_status.event.getParent().type!='phase') return 1;
            var player=_status.event.player;
            return player.getUseValue({
                name:button.link[2],
                nature:button.link[3],
            });
        },
                    backup:function(links,player){
            return {
                audio:'cboxue',
                filterCard:function(){return false},
                selectCard:-1,
                popname:true,
                viewAs:{name:links[0][2],nature:links[0][3]},
                precontent:function(){
                    var discardNames=[];
                    for(var i=0;i<ui.discardPile.childNodes.length;i++){
                        discardNames.add(ui.discardPile.childNodes[i].name);
                    }
                    var toDiscard=player.getCards('h').filter(function(card){
                        return discardNames.contains(card.name);
                    });
                    if(toDiscard.length) player.discard(toDiscard);
                    player.storage.cboxue=game.roundNumber;
                },
            }
        },
                    prompt:function(links,player){
            return '视为使用'+(get.translation(links[0][3])||'')+get.translation(links[0][2]);
        },
                },
                hiddenCard:function(player,name){
        if(player.storage.cboxue==game.roundNumber) return false;
        if(!lib.inpile.contains(name)) return false;
        var type=get.type(name);
        if(type!='basic'&&type!='trick') return false;
        var discardNames=[];
        for(var i=0;i<ui.discardPile.childNodes.length;i++){
            discardNames.add(ui.discardPile.childNodes[i].name);
        }
        return !discardNames.contains(name);
    },
                ai:{
                    order:1,
                    result:{
                        player:function(player){
                if(_status.event.dying) return get.attitude(player,_status.event.dying);
                return 1;
            },
                    },
                },
                "_priority":0,
            },
            czhichong:{
                audio:"ext:手杀武将/apk/8月武将补充:3",
                enable:"phaseUse",
                usable:1,
                filter:function(event, player) {
        return game.hasPlayer(function(current) {
            return current != player && current.isAlive() && current.countCards('h') > 0;
        });
    },
                content:function() {
        'step 0'
        var targets = game.filterPlayer(function(current) {
            return current != player && current.isAlive() && current.countCards('h') > 0;
        });
        
        if (targets.length === 0) {
            event.finish();
            return;
        }
        
        event.targets = targets;
        
        var handCards = player.getCards('h');
        var playerSum = 0;
        for (var i = 0; i < handCards.length; i++) {
            playerSum += get.number(handCards[i]);
        }
        event.playerSum = playerSum;
        
        var allCards = [];
        var cardOwner = {};
        for (var i = 0; i < targets.length; i++) {
            var targetCards = targets[i].getCards('h');
            for (var j = 0; j < targetCards.length; j++) {
                var card = targetCards[j];
                allCards.push(card);
                cardOwner[card.playerid] = targets[i];
            }
        }
        event.allCards = allCards;
        event.cardOwner = cardOwner;
        
        if (allCards.length === 0) {
            event.finish();
            return;
        }
        
        event.dialog = ui.create.dialog('【置重】观看所有其他角色的手牌');
        
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            var cards = target.getCards('h');
            if (cards.length > 0) {
                event.dialog.add(get.translation(target) + '（' + cards.length + '张）');
                event.dialog.add(cards, '', '', '');
            }
        }
        
        event.dialog.add('当前手牌点数和：' + playerSum);
        event.dialog.add('请选择要获得的牌（点数和≤' + playerSum + '）');
        
        var buttonList = [];
        for (var i = 0; i < allCards.length; i++) {
            var card = allCards[i];
            var owner = cardOwner[card.playerid];
            var num = get.number(card);
            var suit = get.suit(card);
            var name = get.name(card);
            var suitChar = {
                'spade': '♠',
                'heart': '♥',
                'club': '♣',
                'diamond': '♦'
            }[suit] || suit;
            buttonList.push({
                text: get.translation(owner) + '：【' + get.translation(name) + '】' + get.strNumber(num) + suitChar,
                link: card
            });
        }
        
        player.chooseButton([1, buttonList.length], event.dialog)
            .set('filterButton', function(button) {
                var selectedSum = 0;
                for (var i = 0; i < ui.selected.buttons.length; i++) {
                    selectedSum += get.number(ui.selected.buttons[i].link);
                }
                return selectedSum + get.number(button.link) <= event.playerSum;
            })
            .set('ai', function(button) {
                return get.value(button.link) || 1;
            });
        
        'step 1'
        if (!result.bool) {
            event.finish();
            return;
        }
        
        var selectedCards = result.links;
        var selectedSum = 0;
        for (var i = 0; i < selectedCards.length; i++) {
            selectedSum += get.number(selectedCards[i]);
        }
        event.selectedSum = selectedSum;
        event.selectedCards = selectedCards;
        event.gainCount = selectedCards.length;
        
        var gainMap = {};
        for (var i = 0; i < selectedCards.length; i++) {
            var card = selectedCards[i];
            var owner = event.cardOwner[card.playerid];
            if (!gainMap[owner.playerid]) {
                gainMap[owner.playerid] = {
                    owner: owner,
                    cards: []
                };
            }
            gainMap[owner.playerid].cards.push(card);
        }
        
        for (var pid in gainMap) {
            var entry = gainMap[pid];
            player.gain(entry.cards, entry.owner, 'gain2');
            game.log(player, '获得了', get.translation(entry.owner), '的', entry.cards.length, '张牌');
        }
        
        'step 2'
        var diff = event.playerSum - event.selectedSum;
        
        if (diff <= 0) {
            event.finish();
            return;
        }
        
        var totalCards = player.countCards('he');
        if (totalCards < diff) {
            player.chooseToDiscard(totalCards, true).set('prompt', '置重：牌不够弃，弃置所有牌');
        } else {
            player.chooseToDiscard(diff, true).set('prompt', '置重：弃置' + diff + '张牌');
        }
        
        'step 3'
        if (result.bool) {
            game.log(player, '发动【置重】，获得了' + event.gainCount + '张牌，弃置了' + result.cards.length + '张牌');
        } else {
            game.log(player, '发动【置重】，获得了' + event.gainCount + '张牌');
        }
    },
                ai:{
                    order:7,
                    expose:0.3,
                    threaten:1.3,
                    result:{
                        player:function(player) {
                if (player.countCards('h') >= 4) return 1.5;
                if (player.countCards('h') >= 2) return 0.5;
                return -1;
            },
                    },
                },
                "_priority":0,
            },
            clanjiaojie:{
                audio:"ext:手杀武将/apk/8月武将补充:2",
                trigger:{
                    player:"useCardAfter",
                },
                groupSkill:true,
                filter:function(event,player){
        if(player.group!='wei') return false;
        return event.targets&&event.targets.some(i=>i.countCards('he')>0);
    },
                direct:true,
                content:function(){
        'step 0'
        var targets=trigger.targets.filter(i=>i.countCards('he')>0);
        event.targets=targets;
        player.chooseBool('是否发动【矫节】，获得'+get.translation(targets)+'各一张牌？').set('ai',function(){
            return true;
        });
        'step 1'
        if(!result.bool){
            event.finish();
            return;
        }
        player.logSkill('clanjiaojie');
        event.gained=[];
        'step 2'
        if(!event.targets.length){
            event.goto(4);
            return;
        }
        var target=event.targets.shift();
        player.choosePlayerCard(target,'he',true).set('ai',function(button){
            return get.value(button.link);
        });
        'step 3'
        if(result.bool&&result.links&&result.links.length){
            event.gained.push(result.links[0]);
            player.gain(result.links,target,'give','visible');
        }
        if(event.targets.length) event.goto(2);
        'step 4'
        if(!event.gained.length){
            event.finish();
            return;
        }
        var firstType=get.type(player.getHistory('useCard')[0].card,player);
        if(!event.gained.some(card=>get.type(card,player)!=firstType)){
            event.finish();
            return;
        }
        'step 5'
        player.chooseControl('失去1点体力','变更势力至吴').set('prompt','矫节：失去1点体力，或变更势力为吴？');
        'step 6'
        if(result.control=='失去1点体力'){
            player.loseHp();
        }else if(result.control=='变更势力至吴'){
            player.changeGroup('wu');
        }
    },
                "_priority":0,
            },
            clanfuyu:{
                audio:"ext:手杀武将/apk/8月武将补充:2",
                trigger:{
                    player:"damageEnd",
                    source:"damageEnd",
                },
                usable:1,
                groupSkill:true,
                filter:function(event,player){
        return player.group=='wu'&&player.countCards('he')>0;
    },
                direct:true,
                content:function(){
        'step 0'
        player.chooseTarget('是否发动【抚驭】，交给一名角色一张牌？').set('ai',function(target){
            return get.attitude(_status.event.player,target);
        });
        'step 1'
        if(!result.bool){
            event.finish();
            return;
        }
        event.target=result.targets[0];
        player.chooseCard('he',true,'交给'+get.translation(event.target)+'一张牌');
        'step 2'
        if(!result.bool){
            event.finish();
            return;
        }
        player.logSkill('clanfuyu',event.target);
        player.give(result.cards,event.target);
        event.givenType=get.type(result.cards[0],player);
        'step 3'
        var x=Math.min(player.getDamagedHp(),event.target.countCards('he'));
        if(x<=0){
            event.goto(5);
            return;
        }
        player.choosePlayerCard(event.target,'he',x,true,'获得'+get.translation(event.target)+x+'张牌');
        'step 4'
        if(result.bool&&result.links){
            event.gained=result.links;
            player.gain(result.links,event.target,'give','visible');
        }
        'step 5'
        var allSame=true;
        if(event.gained&&event.gained.length){
            for(var i=0;i<event.gained.length;i++){
                if(get.type(event.gained[i],player)!=event.givenType){
                    allSame=false;
                    break;
                }
            }
        }
        if(!allSame){
            event.finish();
            return;
        }
        'step 6'
        player.chooseControl('回复1点体力','令'+get.translation(event.target)+'摸一张牌').set('prompt','抚驭：请选择一项');
        'step 7'
        if(result.control=='回复1点体力'){
            player.recover();
        }else{
            event.target.draw();
        }
    },
                "_priority":0,
            },
            clanfenshi:{
                audio:"ext:手杀武将/apk/8月武将补充:2",
                trigger:{
                    player:"useCardToTargeted",
                },
                usable:1,
                clanSkill:true,
                filter:function(event,player){
        if(!event.isFirstTarget) return false;
        if(get.type(event.card)!='trick') return false;
        var num=game.countGroup();
        return game.hasPlayer(current=>current.hasSkill('clanfenshi')&&current.countCards('h')==num);
    },
                prompt:function(event,player){
        return '是否发动【纷势】，令'+get.translation(event.card)+'额外结算一次？';
    },
                content:function(){
        trigger.getParent().effectCount++;
    },
                "_priority":0,
            },
            clanfuyao: {
    audio: 2,
    enable: "phaseUse",
    zhuanhuanji: true,
    filter: function (event, player) {
        var shown = player.getCards('h').filter(card => card.hasGaintag('clanfuyao')).length;
        var unshown = player.countCards('h') - shown;
        var diff = unshown - shown;
        var isYang = !player.storage.clanfuyao;
        
        if (diff === 0) return player.countCards('h') > 0;
        
        if (isYang) {
            return diff > 0 && diff % 2 === 0;
        } else {
            return diff !== 0;
        }
    },
    prompt: function (event, player) {
        var isYang = !player.storage.clanfuyao;
        if (isYang) {
            return '阳：展示手牌中未展示过的牌，使展示过和未展示过的牌数量相同，然后视为使用一张普通锦囊牌';
        }
        return '阴：弃置手牌中较多一方的牌，使展示过和未展示过的牌数量相同，然后视为使用一张普通锦囊牌';
    },
    content: function () {
        'step 0'
        var shownCards = player.getCards('h').filter(card => card.hasGaintag('clanfuyao'));
        var unshownCards = player.getCards('h').filter(card => !card.hasGaintag('clanfuyao'));
        var shownCount = shownCards.length;
        var unshownCount = unshownCards.length;
        var diff = unshownCount - shownCount;
        if (diff === 0) {
            event._result = { bool: true };
            event.goto(2);
            return;
        }
        var isYang = !player.storage.clanfuyao;

        if (isYang) {
            var needShow = diff / 2;
            player.chooseCard('阳：请选择' + needShow + '张未展示的牌进行展示', needShow, 'h')
                .set('filterCard', function (card) {
                    return !card.hasGaintag('clanfuyao');
                })
                .set('ai', function (card) {
                    return 10 - get.value(card);
                });
            event._yangAction = true;
        } else {
            var needDiscard = Math.abs(diff);
            if (diff > 0) {
                player.chooseCard('阴：请选择' + needDiscard + '张未展示的牌进行弃置', needDiscard, 'h')
                    .set('filterCard', function (card) {
                        return !card.hasGaintag('clanfuyao');
                    })
                    .set('ai', function (card) {
                        return 10 - get.value(card);
                    });
            } else {
                player.chooseCard('阴：请选择' + needDiscard + '张展示过的牌进行弃置', needDiscard, 'h')
                    .set('filterCard', function (card) {
                        return card.hasGaintag('clanfuyao');
                    })
                    .set('ai', function (card) {
                        return 10 - get.value(card);
                    });
            }
            event._yangAction = false;
        }

        'step 1'
        if (!result.bool || !result.cards || result.cards.length === 0) {
            event.finish();
            return;
        }

        var cards = result.cards;

        if (event._yangAction) {
            player.addGaintag(cards, 'clanfuyao');
            player.showCards(cards, get.translation(player) + '发动了【扶摇】');
            game.log(player, '展示了', cards);
        } else {
            player.discard(cards);
            game.log(player, '弃置了', cards);
        }

        'step 2'
        player.changeZhuanhuanji('clanfuyao');
        if (!player.storage.clanfuyao_used) player.storage.clanfuyao_used = [];

        var trickList = [];
        for (var i of lib.inpile) {
            if (player.storage.clanfuyao_used.contains(i)) continue;
            var type = get.type(i);
            if (type == 'trick') {
                trickList.push([type, '', i]);
            }
        }

        if (trickList.length === 0) {
            player.popup('本阶段已使用过所有可用的锦囊牌');
            event.finish();
            return;
        }

        player.chooseButton(['扶摇：视为使用一张普通锦囊牌', [trickList, 'vcard']], true)
            .set('filterButton', function (button) {
                return player.hasUseTarget({ name: button.link[2], nature: button.link[3], isCard: true }, null, true);
            })
            .set('ai', function (button) {
                var card = { name: button.link[2], nature: button.link[3], isCard: true };
                return player.getUseValue(card);
            });

        'step 3'
        if (result.bool && result.links && result.links[0]) {
            var cardName = result.links[0][2];
            var cardNature = result.links[0][3];
            player.storage.clanfuyao_used.push(cardName);
            player.chooseUseTarget(true, { name: cardName, nature: cardNature, isCard: true });
        }

        'step 4'
        player.addTempSkill('clanfuyao_clear', 'phaseUseAfter');
    },

    mark: true,
    marktext: '扶',
    intro: {
        content: function (storage, player) {
            var shown = player.getCards('h').filter(c => c.hasGaintag('clanfuyao')).length;
            var unshown = player.countCards('h') - shown;
            var isYang = !storage;
            var state = isYang ? '阳' : '阴';
            var diff = unshown - shown;
            var canUse;
            if (diff === 0) {
                canUse = player.countCards('h') > 0;
            } else if (isYang) {
                canUse = diff > 0 && diff % 2 === 0;
            } else {
                canUse = diff !== 0;
            }
            return '当前状态：' + state + '<br>已展示：' + shown + '张，未展示：' + unshown + '张' + (canUse ? '' : '<br>（暂不可发动）');
        }
    },

    ai: {
        order: 7,
        result: {
            player: function (player) {
                var shown = player.getCards('h').filter(c => c.hasGaintag('clanfuyao')).length;
                var unshown = player.countCards('h') - shown;
                var diff = unshown - shown;
                var isYang = !player.storage.clanfuyao;
                
                if (diff === 0) {
                    if (player.countCards('h') === 0) return 0;
                } else if (isYang) {
                    if (diff <= 0 || diff % 2 !== 0) return 0;
                } else {
                    if (diff === 0) return 0;
                }
                
                if (!player.storage.clanfuyao_used) player.storage.clanfuyao_used = [];
                var hasTrick = lib.inpile.some(function (i) {
                    if (player.storage.clanfuyao_used.contains(i)) return false;
                    return get.type(i) == 'trick' && player.hasUseTarget({ name: i, isCard: true }, null, true);
                });
                return hasTrick ? 1 : 0;
            }
        }
    },

    subSkill: {
        clear: {
            trigger: { player: 'phaseUseAfter' },
            forced: true,
            charlotte: true,
            popup: false,
            content: function () {
                delete player.storage.clanfuyao_used;
                player.removeSkill('clanfuyao_clear');
            }
        }
    },

    "_priority": 0
},
            shenyu:{
                "_priority":0,
            },
            huaren:{
                "_priority":0,
            },
        },
        translate:{
            olquanji:"权计",
            "olquanji_info":"当你造成或受到1点伤害后，你可以摸一张牌，然后令当前回合角色将一张手牌置于你的武将牌上，称为“权”。你每有一张“权”，你的手牌上限便+1。",
            olzili:"自立",
            "olzili_info":"觉醒技，每个准备阶段，若你“权”的数量大于等于3，你回复1点体力或摸两张牌，然后减少1点体力上限，获得“排异。",
            olpaiyi:"排异",
            "olpaiyi_info":"出牌阶段限一次，你可以移去一张“权”，指定一名角色并选择:1、其摸两张牌；2、你对其造成1点伤害。然后若其手牌数大于你，执行另一项，本阶段此技能改为限两次。",
            "olpaiyi2":"排异",
            "olpaiyi2_info":"",
            olqinli:"勤励",
            "olqinli_info":"准备阶段或当你受到1点伤害后，你摸一张牌。每回合结束时，你可将所有“勤 励”牌置入弃牌堆，对当前回合角色造成1点伤害。若你因此失去所有手牌，改为对其造成等量伤害。",
            xiangxue:"想学",
            "xiangxue_info":"锁定技，你每使用2张未使用过的牌名的牌，获得等量个“惘”标记并摸1张牌，然后若“惘”数为：6，交换上文中的两个数字；9，删除上文中的未；12，失去此技能。",
            zhiyong:"致用",
            "zhiyong_info":"每局游戏每项限一次，你可弃置对应数量张牌，视为使用一张普通【杀】：1.手牌数；2.2；3.“惘”数。若弃置牌数等于序数，改为弃置一名其他角色对应数量张牌或摸等量张牌。",
            haoxue:"好学",
            "haoxue_info":"锁定技，你于：出牌阶段外弃置牌时，失去1点体力；出牌阶段内获得牌时，回复1点体力。",
            qiongshe:"穷涉",
            "qiongshe_info":"若以下值为质数，你可于对应时机亮出牌堆顶的八张牌，获得其中点数为质数的牌：手牌数，摸牌阶段开始时；因此获得牌数，出牌阶段；体力值，弃牌阶段结束时。",
            cboxue:"博学",
            "cboxue_info":"每轮限一次，你可弃置所有弃牌堆中有的手牌，视为使用一张弃牌堆中没有的基本牌或普通锦囊牌。",
            czhichong:"置重",
            "czhichong_info":"出牌阶段限一次，你可观看所有其他角色的手牌，选择并获得这些牌中点数和小于等于你手牌的牌，然后你弃置X张牌（X为本次获得牌与原手牌的点数和之差）。",
            clanjiaojie:"矫节",
            "clanjiaojie_info":"魏势力技，当你使用牌后，你可以获得目标角色各一张牌。若你获得牌与本回合被使用的首张牌类型不同，你失去1点体力或变更势力至吴。",
            clanfuyu:"抚驭",
            "clanfuyu_info":"吴势力技，每回合限一次，当你造成或受到伤害后，你可以交给一名角色一张牌，获得其X张牌(X为你已损失体力值)。若你与其获得牌类型均相同，你回复1点体力或令其摸一张牌。",
            clanfenshi:"纷势",
            "clanfenshi_info":"宗族技，每回合限一次，若有同族角色手牌数等于势力数，你的锦囊牌可额外结算一次。",
            clanfuyao:"扶摇",
            "clanfuyao_info":"转换技，出牌阶段，你可以将手牌中展示过和未展示过的牌：阳：展示至两者数量相同；阴：弃置至两者数量相同。然后视为使用一张本阶段未以此法使用过的普通锦囊牌。",
            shenyu:"神御",
            "shenyu_info":"出牌阶段开始时，你可视为使用一张无距离限制的【杀】，然后将【赤血刃】置入唯一目标角色的装备区（替换原装备）。每个结束阶段，若你本回合造成过伤害或使用过至少两张伤害牌，且【赤血刃】在其他角色装备区，你可将其移动至你的装备区（替换原装备)，获得其和其与你之间角色各随机一张牌。",
            huaren:"化刃",
            "huaren_info":"限定技，准备阶段，你可将场上或你的一张武器牌永久移出游戏，摸等同于其攻击范围数量的牌，视为拥有其技能。",
        },
    },
    intro:"",
    author:"※二阶堂希罗",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["clan_zhugeguo.jpg","clan_zhugedan.jpg","ol_re_zhonghui.jpg","xiangxue_liushan.jpg","haoxue_lvmeng.jpg","boxue_caozhi.jpg","ol_wangai.jpg","shen_huangzhong.jpg"],"card":["chixueren.png"],"skill":[]}}};
