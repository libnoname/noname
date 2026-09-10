import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"虎牢关吕布",content:function (config, pack) {},precontent:function () {},help:{},config:{},package:{
    character:{
        character:{
            "hlg_xiaohu":["male","qun",6,["hlg_zhirui","hlg_liejia","sbwushuang","jsrgfeiyang"]],
            "hlg_nuyan":["male","qun",8,["hlg_kuangbao","hlg_wumou","hlg_wuqian","hlg_shenfen","jsrgfeiyang"]],
            "hlg_shenwei":["male","qun",8,["hlg_douhun","hlg_hengsi","hlg_shengyong","hlg_jiwu","jsrgfeiyang"]],
            "hlg_molin":["male","qun",8,["hlg_pokou","hlg_shimie","jsrgfeiyang"]],
        },
        translate:{
            "hlg_xiaohu":"虓虎无双",
            "hlg_nuyan":"怒焰焚天",
            "hlg_shenwei":"神威飞将",
            "hlg_molin":"魔临渊薮",
        },
    },
    card:{
        card:{
            zhenqianjiaofeng:{
                fullskin:true,
                type:"trick",
                enable:true,
                selectTarget:1,
                filterTarget:function (card, player, target) {
        return target != player && get.attitude(player, target) < 0;
    },
content: function () {
    'step 0'
    var t = event.targets[0];
    event.t = t;
    event.side1 = [t];
    event.side2 = [player];
    game.filterPlayer().forEach(function (p) {
        if (!p.isAlive()) return;
        if (p != t && get.attitude(t, p) > 0) event.side1.push(p);
        if (p != player && get.attitude(player, p) > 0) event.side2.push(p);
    });
    // 记录每方已经打出过杀的角色（去重）
    event.sideSha = { 1: [], 2: [] };
    // 当前响应方 (1: side1, 2: side2)
    event.cur = 1;
    // 开始第一轮
    event.goto(1);

    'step 1'
    // 准备当前方的响应：计算需求（友方存活人数，含主将）
    var curList = event.cur == 1 ? event.side1 : event.side2;
    var alive = curList.filter(function(p){ return p.isAlive(); });
    var need = alive.length; // 需要打出杀的数量 = 存活人数
    if (need === 0) need = 1;
    event.need = need;
    event.index = 0;          // 当前询问的成员在 alive 中的下标
    // 启动询问第一个成员（主将）
    event.goto(2);

    'step 2'
    var curList = event.cur == 1 ? event.side1 : event.side2;
    var alive = curList.filter(function(p){ return p.isAlive(); });
    // 如果需求已满足，切换阵营
    if (event.need <= 0) {
        event.goto(4);
        return;
    }
    // 如果已经问完所有人，但需求未满足 -> 失败
    if (event.index >= alive.length) {
        event.goto(5);
        return;
    }
    var responder = alive[event.index];
    event.responder = responder;
    // 提示：显示还需多少张杀
    var prompt = '阵前交锋：' + get.translation(responder) + 
                 '（本方还需打出' + get.cnNumber(event.need) + '张【杀】）';
    if (event.index === 0) {
        prompt += '，请打出一张【杀】';
    } else {
        prompt += '，可以替队友打出一张【杀】';
    }
    responder.chooseToRespond({ name: 'sha' }, prompt)
        .set('ai', function(){ return 1; });
    event.goto(3);

    'step 3'
    if (result.bool) {
        // 打出杀成功
        // 去重记录该角色
        var list = event.sideSha[event.cur];
        if (!list.includes(event.responder)) {
            list.push(event.responder);
        }
        event.need--;
        // 需求未满，继续询问同一个人（不增加 index）
        if (event.need > 0) {
            event.goto(2);
            return;
        } else {
            // 需求已满，切换阵营
            event.goto(4);
            return;
        }
    } else {
        // 该角色拒绝/无法打出，询问下一个
        event.index++;
        event.goto(2);
    }

    'step 4'
    // 当前方响应完成，切换到另一方
    event.cur = event.cur == 1 ? 2 : 1;
    event.goto(1);

    'step 5'
    // 当前方响应失败，结算伤害
    var failerSide = event.cur;
    var failerList = failerSide == 1 ? event.side1 : event.side2;
    var failer = failerList[0]; // 主将
    var winnerSide = failerSide == 1 ? 2 : 1;
    var sources = event.sideSha[winnerSide]; // 胜利方所有打出过杀的角色（已去重）
    // 如果胜利方没人打出杀，则由胜利方主将造成1点伤害（弥补无伤害来源）
    if (sources.length === 0) {
        var winnerList = winnerSide == 1 ? event.side1 : event.side2;
        var leader = winnerList[0];
        if (leader && leader.isAlive()) sources.push(leader);
    }
    game.log('阵前交锋：', get.translation(failer), '未能响应完毕');
    for (var i = 0; i < sources.length; i++) {
        if (sources[i].isAlive() && failer.isAlive()) {
            failer.damage(sources[i]);
        }
    }
    event.finish();
},
                ai:{
                    order:6,
                    result:{
                        target:-1.5,
                    },
                    tag:{
                        damage:1,
                        respond:1,
                        respondSha:1,
                    },
                },
            },
        },
        translate:{
            zhenqianjiaofeng:"阵前交锋",
            "zhenqianjiaofeng_info":"出牌阶段，对一名敌方角色使用。由其开始，其与你轮流响应此牌。每次响应时，当前响应角色及其友方角色需合计打出X张【杀】（X为当前响应角色场上的友方角色数）。首先未能打出足够的【杀】的角色，受到另一方阵营中本次流程内打出过杀的角色各造成的1点伤害。",
        },
        list:[],
    },
    skill:{
        skill:{
"hlg_zhirui":{
    audio:"ext:虎牢关吕布/audio:2",
    init:function (player) {
        var equips = [
            ['wushuangfangtianji', 'diamond', 12],
            ['linglongshimandai', 'spade', 2],
            ['shufazijinguan', 'club', 1],
            ['chitu', 'heart', 5]
        ];
        for (var i = 0; i < equips.length; i++) {
            var card = game.createCard2(equips[i][0], equips[i][1], equips[i][2]);
            player.$gain2(card, false);
            player.equip(card);
        }
    },
},
            "hlg_liejia":{
                audio:"ext:虎牢关吕布/audio:2",
                trigger:{
                    player:"loseAfter",
                    global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
                },
                forced:true,
                filter:function (event, player) {
                    var evt = event.getl(player);
                    return evt && evt.es && evt.es.length > 0;
                },
                content:function () {
                    var evt = trigger.getl(player);
                    for (var i = 0; i < evt.es.length; i++) {
                        var sub = get.subtype(evt.es[i]);
                        if (!sub) continue;
                        if (player.isDisabled(sub)) continue;
                        player.disableEquip(sub);
                    }
                },
            },
            "hlg_kuangbao":{
                audio:"ext:虎牢关吕布/audio:2",
                marktext:"暴",
                init:function (player) {
                    player.addMark('hlg_kuangbao', 2);
                },
                trigger:{
                    source:"damageSource",
                    player:"damageEnd",
                },
                forced:true,
                filter:function (event) {
                    return event.num > 0;
                },
                content:function () {
                    player.addMark('hlg_kuangbao', trigger.num);
                },
                intro:{
                    name:"暴怒",
                    content:"mark",
                },
                mod:{
                    maxHandcard:function (player, num) {
                        return num + player.countMark('hlg_kuangbao');
                    },
                },
                ai:{
                    threaten:1.4,
                },
            },
            "hlg_wumou":{
                audio:"ext:虎牢关吕布/audio:2",
                forced:true,
                group:["hlg_wumou_juedou"],
                mod:{
                    cardname:function (card) {
                        if (get.type(card, null, false) == 'trick' && get.info(card, false).subtype != 'delay' && card.name != 'juedou') {
                            return 'juedou';
                        }
                    },
                    selectTarget:function (card, player) {
                        if (get.type(card, null, false) == 'trick' && get.info(card, false).subtype != 'delay' && card.name != 'juedou') {
                            return get.select(card);
                        }
                    },
                    filterTarget:function (card, player, target) {
                        if (get.type(card, null, false) == 'trick' && get.info(card, false).subtype != 'delay' && card.name != 'juedou') {
                            var info = lib.card[card.name];
                            if (info && info.filterTarget) return info.filterTarget(card, player, target);
                            return target != player;
                        }
                    },
                },
                subSkill:{
                    juedou:{
                        trigger:{
                            player:"useCardToPlayered",
                            target:"useCardToTargeted",
                        },
                        forced:true,
                        filter:function (event, player) {
                            return event.card.name == 'juedou';
                        },
                        content:function () {
                            var other = (player == trigger.player ? trigger.target : trigger.player);
                            if (other.hp >= player.hp) return;
                            var id = other.playerid;
                            var idt = trigger.target.playerid;
                            var map = trigger.getParent().customArgs;
                            if (!map[idt]) map[idt] = {};
                            if (!map[idt].shaReq) map[idt].shaReq = {};
                            if (!map[idt].shaReq[id]) map[idt].shaReq[id] = 2;
                            if (typeof map[idt].extraDamage != 'number') map[idt].extraDamage = 0;
                            map[idt].extraDamage++;
                        },
                        sub:true,
                        parentskill:"hlg_wumou",
                    },
                },
            },
            "hlg_wuqian":{
                audio:"ext:虎牢关吕布/audio:2",
                forced:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event, player) {
                    return true;
                },
                content:function () {
                    if (player.countCards('h') <= player.maxHp) {
                        if (player.countMark('hlg_kuangbao') > 0) {
                            player.removeMark('hlg_kuangbao', 1);
                            player.draw(2);
                        }
                    } else {
                        player.loseHp(1);
                        var o = game.filterPlayer(function (p) {
                            return p != player && p.isAlive();
                        });
                        if (o.length) o[Math.floor(Math.random() * o.length)].damage(player);
                    }
                },
            },
            "hlg_shenfen":{
                audio:"ext:虎牢关吕布/audio:2",
                forced:true,
                trigger:{
                    global:"roundFinish",
                },
                filter:function (event, player) {
                    return true;
                },
                content:function () {
                    var d = Math.min(player.countMark('hlg_kuangbao'), 6);
                    player.removeMark('hlg_kuangbao', d);
                    var x = Math.floor(d / 3);
                    var o = game.filterPlayer(function (p) {
                        return p != player && p.isAlive();
                    });
                    for (var i = 0; i < o.length; i++) {
                        o[i].damage(player);
                        o[i].discard(o[i].getCards('e'));
                        if (x > 0) {
                            o[i].chooseToDiscard(x, 'h', true).set('ai', function (card) {
                                return 8 - get.value(card);
                            });
                        }
                    }
                },
            },
            "hlg_douhun":{
                audio:"ext:虎牢关吕布/audio:2",
                forced:true,
                init:function (player) {
                    for (var i = 0; i < game.players.length; i++) {
                        var p = game.players[i];
                        var cards = p.getCards('h', function (card) {
                            return card && card.name == 'juedou';
                        });
                        if (!cards.length) continue;
                        var cards2 = [];
                        for (var j = 0; j < cards.length; j++) {
                            var c = cards[j];
                            cards2.push(game.createCard('zhenqianjiaofeng', c.suit, c.number));
                            c.remove();
                        }
                        p.directgain(cards2);
                    }
                    for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
                        var c = ui.cardPile.childNodes[i];
                        if (c && c.name == 'juedou') {
                            var nc = game.createCard('zhenqianjiaofeng', c.suit, c.number);
                            ui.cardPile.replaceChild(nc, c);
                        }
                    }
                    for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
                        var c = ui.discardPile.childNodes[i];
                        if (c && c.name == 'juedou') {
                            var nc = game.createCard('zhenqianjiaofeng', c.suit, c.number);
                            ui.discardPile.replaceChild(nc, c);
                        }
                    }
                },
                group:["hlg_douhun_draw"],
                subSkill:{
                    draw:{
                        trigger:{
                            global:"roundStart",
                        },
                        forced:true,
                        content:function () {
                            var card = get.cardPile(function (x) {
                                return x.name == 'zhenqianjiaofeng';
                            });
                            if (card) player.gain(card, 'gain2');
                        },
                        sub:true,
                        parentskill:"hlg_douhun",
                    },
                },
            },
            "hlg_hengsi":{
                audio:"ext:虎牢关吕布/audio:2",
                forced:true,
                trigger:{
                    player:"useCardToPlayer",
                    target:"useCardToTargeted",
                },
                filter:function (event, player) {
                    if (!get.tag(event.card, 'damage')) return false;
                    return event.player == player ? event.target != player : true;
                },
                content:function () {
                    player.draw(1);
                },
            },
            "hlg_shengyong":{
                forced:true,
                group:["hlg_shengyong_reset"],
                trigger:{
                    source:"damageBegin3",
                },
                filter:function (event, player) {
                    return event.player && event.player != player;
                },
                content:function () {
                    var t = trigger.player;
                    var c = (player.storage['hlg_sy_' + t.playerid] || 0) + 1;
                    player.storage['hlg_sy_' + t.playerid] = c;
                    trigger.num = c;
                },
                subSkill:{
                    reset:{
                        trigger:{
                            player:"phaseEnd",
                        },
                        forced:true,
                        silent:true,
                        content:function () {
                            for (var k in player.storage) {
                                if (k.indexOf('hlg_sy_') == 0) delete player.storage[k];
                            }
                        },
                        sub:true,
                        parentskill:"hlg_shengyong",
                        popup:false,
                    },
                },
            },
            "hlg_jiwu":{
                audio:"ext:虎牢关吕布/audio:2",
                forced:true,
                locked:true,
                marktext:"极武 +",
                intro:{
                    markcount:function(storage,player){
            return player.storage.hlg_jiwu_count||0;
        },
                    content:function(storage,player){
            var n=player.storage.hlg_jiwu_count||0;
            return n>0?'已积累 '+n+' 层极武，出牌阶段出杀次数+'+n:'暂无极武层数';
        },
                },
                trigger:{
                    player:"useCardToTargeted",
                },
                filter:function(event,player){
        if(!get.tag(event.card,'damage')) return false;
        return event.target!=player&&event.target.isAlive();
    },
                content:function(){
        trigger.target.addTempSkill('hlg_jiwu_judge',{player:'useCardAfter'});
    },
                group:["hlg_jiwu_after","hlg_jiwu_clear"],
                subSkill:{
                    judge:{
                        trigger:{
                            player:"damageBegin3",
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        content:function(){
                player.removeSkill('hlg_jiwu_judge');
            },
                        sub:true,
                        parentskill:"hlg_jiwu",
                    },
                    after:{
                        trigger:{
                            player:"useCardAfter",
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        filter:function(event,player){
                return get.tag(event.card,'damage');
            },
                        content:function(){
                'step 0'
                event.targets=[];
                for(var i=0;i<trigger.targets.length;i++){
                    var t=trigger.targets[i];
                    if(t==player||!t.isAlive()) continue;
                    if(t.hasSkill('hlg_jiwu_judge')){
                        player.storage.hlg_jiwu_count=(player.storage.hlg_jiwu_count||0)+1;
                        player.markSkill('hlg_jiwu');
                        t.removeSkill('hlg_jiwu_judge');
                    }else{
                        event.targets.push(t);
                    }
                }
                event.index=0;
                'step 1'
                if(event.index>=event.targets.length){
                    event.finish();
                    return;
                }
                var t=event.targets[event.index];
                event.curTarget=t;
                if(t.countCards('hej')>0){
                    player.gainPlayerCard(t,1,'hej',true);
                }else{
                    t.draw(1);
                    event.index++;
                    event.goto(1);
                }
                'step 2'
                if(result.bool&&result.cards&&result.cards.length){
                    for(var i=0;i<result.cards.length;i++){
                        result.cards[i].addGaintag('hlg_jiwu');
                    }
                    player.addTempSkill('hlg_jiwu_add','phaseEnd');
                }
                event.curTarget.draw(1);
                event.index++;
                event.goto(1);
            },
                        sub:true,
                        parentskill:"hlg_jiwu",
                    },
                    clear:{
                        trigger:{
                            player:"phaseEnd",
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        content:function(){
                player.storage.hlg_jiwu_count=0;
                player.unmarkSkill('hlg_jiwu');
            },
                        sub:true,
                        parentskill:"hlg_jiwu",
                    },
                    add:{
                        mod:{
                            ignoredHandcard:function(card,player){
                    if(card.hasGaintag('hlg_jiwu')) return true;
                },
                            cardDiscardable:function(card,player,name){
                    if(name=='phaseDiscard'&&card.hasGaintag('hlg_jiwu')) return false;
                },
                        },
                        onremove:function(player){
                player.removeGaintag('hlg_jiwu');
            },
                        sub:true,
                        parentskill:"hlg_jiwu",
                    },
                },
                mod:{
                    cardUsable:function(card,player,num){
            if(card.name=='sha'){
                var n=player.storage.hlg_jiwu_count||0;
                return num+n;
            }
        },
                },
            },
            "hlg_pokou":{
                audio:"ext:虎牢关吕布/audio:2",
                forced:true,
                init:function (player) {
                    game.filterPlayer().forEach(function (p) {
                        ['equip1', 'equip2', 'equip3', 'equip4', 'equip5'].forEach(function (s) {
                            if (!p.isDisabled(s)) p.disableEquip(s);
                        });
                    });
                },
                group:["hlg_pokou_track","hlg_pokou_clear"],
                subSkill:{
                    track:{
                        forced:true,
                        trigger:{
                            global:"discardAfter",
                        },
                        filter:function (event, player) {
                            if (!_status.currentPhase || _status.currentPhase == player) return false;
                            var p = _status.currentPhase;
                            var key = 'hlg_pk_' + p.playerid;
                            var en = 0;
                            ['equip1', 'equip2', 'equip3', 'equip4', 'equip5'].forEach(function (s) {
                                if (!p.isDisabled(s)) en++;
                            });
                            return (player.storage[key] || 0) + 1 >= 2 * en + 1;
                        },
                        content:function () {
                            'step 0'
                            var p = _status.currentPhase;
                            var key = 'hlg_pk_' + p.playerid;
                            player.storage[key] = (player.storage[key] || 0) + 1;
                            player.draw(2);
                            var dis = [];
                            ['equip1', 'equip2', 'equip3', 'equip4', 'equip5'].forEach(function (s) {
                                if (p.isDisabled(s)) dis.push(s);
                            });
                            if (!dis.length) {
                                player.storage[key] = 0;
                                event.finish();
                                return;
                            }
                            event.p = p;
                            event.key = key;
                            p.chooseControl(dis).set('prompt', '破胄：复原一个装备栏');
                            'step 1'
                            if (result.control) {
                                event.p.enableEquip(result.control);
                            }
                            player.storage[event.key] = 0;
                        },
                        sub:true,
                        parentskill:"hlg_pokou",
                    },
                    clear:{
                        trigger:{
                            global:"phaseBegin",
                        },
                        forced:true,
                        silent:true,
                        content:function () {
                            for (var k in player.storage) {
                                if (k.indexOf('hlg_pk_') == 0) delete player.storage[k];
                            }
                        },
                        sub:true,
                        parentskill:"hlg_pokou",
                        popup:false,
                    },
                },
            },
            "hlg_shimie":{
                audio:"ext:虎牢关吕布/audio:2",
                forced:true,
                trigger:{
                    player:"useCardToPlayer",
                },
                filter:function (event, player) {
                    return event.card.name == 'sha';
                },
                content:function () {
                    var t = trigger.target;
                    if (!t) return;
                    var skills = [];
                    if (t.isDisabled('equip1')) skills.push('sbwushuang');
                    if (t.isDisabled('equip2')) skills.push('hlg_shimie_kuanggu');
                    if (t.isDisabled('equip3') || t.isDisabled('equip4')) skills.push('hlg_shimie_tieqi');
                    if (!skills.length) skills.push('hlg_shimie_liyu');
                    player.addAdditionalSkill('hlg_shimie', skills);
                },
                group:["hlg_shimie_clear"],
                subSkill:{
                    clear:{
                        trigger:{
                            player:"useCardAfter",
                        },
                        silent:true,
                        filter:function (event, player) {
                            return event.card.name == 'sha';
                        },
                        content:function () {
                            player.removeAdditionalSkill('hlg_shimie');
                        },
                        sub:true,
                        parentskill:"hlg_shimie",
                        forced:true,
                        popup:false,
                    },
                },
                ai:{
                    threaten:1.5,
                },
            },
            "hlg_shimie_kuanggu":{
                sub:true,
                trigger:{
                    source:"damageSource",
                },
                forced:true,
                filter:function (event, player) {
                    return get.distance(player, event.player) <= 1 && player.isDamaged();
                },
                content:function () {
                    player.recover(trigger.num);
                },
            },
            "hlg_shimie_tieqi":{
                sub:true,
                trigger:{
                    player:"useCardToPlayered",
                },
                forced:true,
                filter:function (event, player) {
                    return event.card.name == 'sha';
                },
                logTarget:"target",
                content:function () {
                    'step 0'
                    player.judge(function () {
                        return 0;
                    });
                    
                    'step 1'
                    var suit = result.suit;
                    var target = trigger.target;
                    target.chooseToDiscard('请弃置一张' + get.translation(suit) + '牌，否则不能使用闪抵消此杀', 'he', function (card) {
                        return get.suit(card) == _status.event.suit;
                    }).set('ai', function (card) {
                        var num = _status.event.num;
                        if (num == 0) return 0;
                        if (card.name == 'shan') return num > 1 ? 2 : 0;
                        return 8 - get.value(card);
                    }).set('num', target.countCards('h', 'shan')).set('suit', suit);
                    'step 2'
                    if (!result.bool) {
                        trigger.getParent().directHit.add(trigger.target);
                    }
                },
            },
            "hlg_shimie_liyu":{
                sub:true,
                trigger:{
                    source:"damageSource",
                },
                forced:true,
                filter:function (event, player) {
                    if (event._notrigger && event._notrigger.contains(event.player)) return false;
                    return event.card && event.card.name == 'sha' && event.player.isIn() && event.player.countGainableCards(player, 'he') > 0;
                },
                content:function () {
                    'step 0'
                    player.gainPlayerCard(trigger.player, 'he', true);
                    'step 1'
                    if (!result.bool || !result.cards || !result.cards.length) {
                        event.finish();
                        return;
                    }
                    if (get.type(result.cards[0]) == 'equip') {
                        trigger.player.chooseTarget(function (card, player, target) {
                            var evt = _status.event.getParent();
                            return evt.player.canUse({ name: 'juedou' }, target) && target != _status.event.player;
                        }, '利驭：指定一名其他角色').set('ai', function (target) {
                            var evt = _status.event.getParent();
                            return get.effect(target, { name: 'juedou' }, evt.player, _status.event.player) - 2;
                        });
                    } else {
                        trigger.player.draw(1);
                        event.finish();
                    }
                    'step 2'
                    if (result.bool && result.targets && result.targets.length) {
                        player.useCard({ name: 'juedou', isCard: true }, result.targets[0], 'noai');
                    }
                },
            },
        },
        translate:{
            "hlg_zhirui":"执锐",
            "hlg_zhirui_info":"锁定技，游戏开始时，从游戏外将【无双方天戟】、【玲珑狮蛮带】、【束发紫金冠】、【赤兔】置入你的装备区。",
            "hlg_liejia":"裂甲",
            "hlg_liejia_info":"锁定技，当一张装备牌离开你的装备区时，对应的装备栏被废除。",
            "hlg_kuangbao":"狂暴",
            "hlg_kuangbao_info":"锁定技，登场时，你获得2枚“暴怒”标记；当你造成或受到1点伤害后，你获得1枚“暴怒”标记。你的手牌上限+X（X=你拥有的“暴怒”标记数量）。",
            "hlg_wumou":"无谋",
            "hlg_wumou_info":"锁定技，你的普通锦囊牌只能当【决斗】使用，此决斗的目标改为原锦囊的目标。你参加的决斗开始时，体力值更低的角色每次需要打出两张杀且通过决斗造成的伤害+1。",
            "hlg_wuqian":"无前",
            "hlg_wuqian_info":"锁定技，一名角色的回合开始时，若你的手牌数不大于体力上限，你移除1个“暴怒”标记摸2张牌，否则你失去1点体力随机对一名其他角色造成1点伤害。",
            "hlg_shenfen":"神愤",
            "hlg_shenfen_info":"锁定技，每轮结束时，你移除所有“暴怒”标记（至多6个），然后对其他所有角色各造成1点伤害，这些角色先各弃置装备区里的所有牌，再弃置X张手牌（X=本次你移除的标记数÷3，向下取整）。",
            "hlg_douhun":"斗魂",
            "hlg_douhun_info":"锁定技，登场时将牌堆、弃牌堆、场上、所有角色手牌中的【决斗】替换为【阵前交锋】。每轮开始时，从牌堆或弃牌堆随机获得一张【阵前交锋】。",
            "hlg_hengsi":"横肆",
            "hlg_hengsi_info":"锁定技，当你使用伤害牌指定其他角色为目标后，或成为其他角色使用伤害牌的目标后，你摸1张牌。",
            "hlg_shengyong":"盛勇",
            "hlg_shengyong_info":"当你对一名其他角色造成伤害时，将伤害值修改为X（X=本回合你对其造成伤害的次数+1）。",
            "hlg_jiwu":"极武",
            "hlg_jiwu_info":"锁定技，当你对其他角色使用的伤害牌结算结束后，若其中有目标角色：未受到伤害，你出牌阶段出杀次数+1；受到伤害，你获得其区域内一张牌，然后其摸一张牌，因此获得的牌本回合不计入手牌上限。",
            "hlg_pokou":"破胄",
            "hlg_pokou_info":"锁定技，登场时废除所有角色的装备区。每名角色的回合内限1次，当第X张牌进入弃牌堆后（X=2×其未废除的装备栏数+1），你摸两张牌，然后若其有废除的装备栏，其选择一个复原之。",
            "hlg_shimie":"噬灭",
            "hlg_shimie_info":"锁定技，当你使用杀指定一名角色为目标后，根据其装备区情况，你在此杀的结算过程中获得以下技能：若其武器区被废除，你视为拥有“无双”；若其防具区被废除，你视为拥有“狂骨”；若其有坐骑区被废除，你视为拥有“铁骑”。若以上均不满足，你视为拥有“利驭”。",
            "hlg_shimie_kuanggu":"狂骨",
            "hlg_shimie_tieqi":"铁骑",
            "hlg_shimie_liyu":"利驭",
        },
    },
    intro:"虎牢关吕布武将扩展",
    author:"<img style=width:80px;border-radius:100%; src=" + lib.assetURL + "extension/虎牢关吕布/author/haoyue.jpg></img>   <b><small><strong>皓月</strong></small></b>",
    diskURL:"",
    forumURL:"",
    version:"",
},files:{"character":["hlg_molin.jpg"],"card":["zhenqianjiaofeng.png"],"skill":[]}}};