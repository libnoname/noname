import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"还原武将",content:function () {},precontent:function(){

},help:{},config:{},package:{
    character:{
        character:{
            "hy_caopi":["male","wei","3/3",["hycuanzun","hyliufang"],[]],
            "pot_dengai":["male","wei",4,["pottuntian","potzaoxian","potjixi"],[]],
            hymachao:["male","qun",4,["hyzhongtao","hyjizhan"],[]],
            "huan_caopi":["male","wei",3,["twqianxiong","twzhengshi"],["des:宛城之戰後，曹丕以為自己和那個夢想中的位置僅差一步之遙。 但當“死而復生”的大哥重新站在他面前 他想……他不能坐以待斃……"]],
            "huan_dianwei":["male","wei",4,["twmiewei","twmiyong"],[]],
            "twhuan_liufeng":["male","shu","4/4/1",["huanchenxun"],[]],
            "mo_diaochan":["female","qun",3,["olhuanhuo","olqingshi"],[]],
            "eu_kaisa":["male","western",4,["eu_ducai","eu_zhitong","eu_jiquan"],[]],
            dcquyuan:["male","qun",3,["lisao","qiusuo"],[]],
            "mou_xusheng":["male","wu",4,["dcqinqiang","dcyizhen"],[]],
            "hywei_dongzhuo":["male","qun",6,["hyweiguangyong","hyweijuchui"],[]],
            "dc_noname":["male","qun",3,["dcchushan"],["des:新杀限时地主"]],
            "twqi_huangpusong":["male","qun","4/4",["twguanhuo","twjuxia"],[]],
            "oldwu_huangpusong":["male","qun","1/4",["dcchaozhen","oldlianjie","oldjiangxian"],[]],
            "sxrm_huatuo":["male","qun",4,["sxrmmiehai"],[]],
            "xia_caopi":["male","wei",3,["hyqinyi","hyjixin","pejiwei"],[]],
            "tw_potdengai":["male","wei",4,["pottuntian","twzaoxian","potjixi"],[]],
            dcchendi:["male","shu",3,["dcquanshi","dcczchouxi"],[]],
            "huan_caochong":["male","wei",3,["twfushu","twxiumu"],[]],
            "huan_caozhi":["male","wei",3,["twhanhong","twhuazhang"],[]],
            "hyhuan_zhouyu":["male","wu",4,["hytwdumou","hytwhantian"],[]],
            "newsb_liubei":["male","shu",4,["newsbrende","newsbzhangwu","newsbjijiang"],[]],
        },
        translate:{
            "hy_caopi":"君曹丕",
            "pot_dengai":"势邓艾",
            hymachao:"威马超",
            "huan_caopi":"幻曹丕",
            "huan_dianwei":"幻典韦",
            "twhuan_liufeng":"幻刘封",
            "mo_diaochan":"魔貂蝉",
            "eu_kaisa":"EU凯撒",
            dcquyuan:"屈原",
            "mou_xusheng":"谋徐盛",
            "hywei_dongzhuo":"威董卓",
            "dc_noname":"无名",
            "twqi_huangpusong":"TW起皇甫嵩",
            "oldwu_huangpusong":"武皇甫嵩",
            "sxrm_huatuo":"疑华佗",
            "xia_caopi":"侠曹丕",
            "tw_potdengai":"TW势邓艾",
            dcchendi:"陈袛",
            "huan_caochong":"幻曹冲",
            "huan_caozhi":"幻曹植",
            "hyhuan_zhouyu":"幻周瑜",
            "newsb_liubei":"谋刘备",
        },
    },
    card:{
        card:{
            hyyuxi:{
                fullskin:true,
                type:"equip",
                subtype:"equip5",
                skills:["hyyuxi_skill"],
                distance:{
                    attackFrom:-1,
                },
            },
        },
        translate:{
            hyyuxi:"玉玺",
            "hyyuxi_info":"锁定技，你每使用三张牌，摸三张牌。",
        },
        list:[],
    },
    skill:{
        skill:{
            hyliufang:{
                enable:"phaseUse",
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event, player) {
        return player.getDamagedHp() >= 0 && player != event.source;
    },
                usable:1,
                direct:true,
                content:function (event,player,trigger) {
        "step 0"
        player.chooseTarget(get.prompt('流放'), function (card, player, target) {
            return target != player;
        }).set('ai', function (target) {
            return get.attitude(_status.event.player, target) / Math.sqrt(target.hp + 1);
        });
        "step 1"
        if (result.bool) {
            player.logSkill('hyfangzhu', result.targets);
            var target = result.targets[0];
            event.target = target;
            if (target.isTurnedOver()) {
                target.turnOver();
            }
            else {
                target.turnOver(true);
            }
            target.draw(player.getDamagedHp());
            if(player.getDamagedHp() > 1){
                event.useshandian = true;
            }
        }
        "step 2"
        if(event.useshandian){
            var judge = lib.card.shandian.judge;
            event.target.judge(judge, get.translation('shandian')).set('judge2', lib.card.shandian.judge2);
            game.delayx(1.5);
        }
            "step 3"
        if(event.useshandian){
        var name = 'shandian';
        if (event.cancelled && !event.direct) {
            if (lib.card[name].cancel) {
                var next = game.createEvent(name + 'Cancel');
                next.setContent(lib.card[name].cancel);
                next.cards = [];
                next.card = get.autoViewAs({ name: name });
                next.player = event.target;
            }
        }
        else {
            var next = game.createEvent(name);
            next.setContent(function () {
                if (result.bool == false) {
                    player.damage(3, 'thunder', 'nosource');
                }
            });
            next._result = result;
            next.cards = [];
            next.card = get.autoViewAs({ name: name });
            next.player = event.target;
        }
        }
        "step 4"
        game.log(player,"发动了流放");
    },
                ai:{
                    expose:0.2,
                    effect:{
                        target:function (card) {
                if (card.name == 'guiyoujie') {
                    return 0.5;
                }
            },
                    },
                },
                "_priority":0,
            },
            pottuntian:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                locked:false,
                forced:true,
                mark:true,
                marktext:"蓄",
                intro:{
                    content:"当前共有#个蓄力点",
                },
                group:["pottuntian_phaseUse"],
                trigger:{
                    player:"loseAfter",
                    global:"phaseBegin",
                },
                filter:function(event, player) {
        const num = player.countMark("pottuntian");
        const max = player.countMark("pottuntian_max");
      if (event.name == "phase" && num == max) {
        return true;
      }
      if(num == max){
          return false;
      }
     if (!event.getl?.(player)?.cards2.some((card) => !get.tag(card,"damage"))) {
        return false;
      }
      const cards2 = event.getl(player).cards2;
      return event.getParent()?.name != "useCard" || cards2.some((card) => get.type(card) != "equip");
    },
                content:function(event, trigger, player) {
      if (trigger.name == "phase") {
        player.draw();
        game.log(player, "的蓄力点上限+1");
        player.addMark("pottuntian_max", 1,false);
      } else{
        var num = trigger.cards.length;
        var num2 = 0;
        for(var i = 0;i < num;i++){
            if(num2 + player.countMark("pottuntian") < player.countMark("pottuntian_max")){
                num2++;
            }
        }
        game.log(player,"获得了"+get.cnNumber(num2)+"个蓄力点");
        player.addMark("pottuntian",num2,false);
      }
    },
                subSkill:{
                    max:{
                        marktext:"限",
                        intro:{
                            content:"当前蓄力点上限为#",
                        },
                        sub:true,
                    },
                    phaseUse:{
                        audio:"pottuntian",
                        enable:"phaseUse",
                        filter:function(event, player) {
              return player.countMark("pottuntian") > 0;
            },
                        usable:1,
                        content:function(event, trigger, player) {
                "step 0"
        const skill = event.name.slice(4);
        var map={};
        var list=[];
        for(var i=1;i<=player.countMark("pottuntian");i++){
            var cn=get.cnNumber(i,true);
            map[cn]=i;
            list.push(cn);
        }    
        event.map=map;
            player.chooseControl(list,function(){
            return get.cnNumber(_status.event.goon);
        }).set('prompt','消耗任意点蓄力点，令至多等量名角色从牌堆或弃牌堆中各获得一张红桃牌').set('goon',player.countMark("pottuntian"));
                "step 1"
                event.number = event.map[result.control];
              /*if (result?.bool && result.numbers?.length) {
                event.result = {
                  bool: true
                };
                event.getParent().set(skill, result.numbers[0]);
              }*/
              //const { [event.name]: num } = event.getParent(2);
              player.removeMark("pottuntian",event.number);
              player.chooseTarget([1,event.number],`屯田：令至多${event.number}名角色各获得一张红桃牌`, true).set("ai", (target) => get.attitude(get.player(), target) > 0).forResult();
                  "step 2"
              player.line(result.targets);
              var card_list = [];
               for(var target1 of result.targets){
                  const card = get.cardPile(function (card) {
                    if(get.suit(card) != "heart"){
                        return false;
                    }
                    if(card_list.length == 0){
                        card_list.push(card);
                        return true;
                    }else{
                        for(var card2 of card_list){
                            if(card2 == card){
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
                });
                if (card) {
                  target1.gain(card, "gain2");
                }
               }
                    player.storage.usemark = event.number;
                event.trigger("removeMark");
                  /*
              game.doAsyncInOrder(targets, (target) => {
                const card = get.cardPile((card2) => get.suit(card2) == "heart");
                if (card) {
                  return target.gain(card, "gain2");
                }
              });*/
            },
                        ai:{
                            order:8,
                            result:{
                                player:1,
                            },
                        },
                        sub:true,
                        "_priority":0,
                    },
                },
            },
            potzaoxian:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                forced:true,
                trigger:{
                    player:"removeMark",
                },
                filter:function(event, player) {
      return player.storage.usemark > 0;
    },
                content:function(event, trigger, player) {
        event.number = player.storage.usemark;
                   var get_card = [];
                   var card = 0;
                       if(event.number >= 3){
                           card = get.discardPile((card2) => get.name(card2) == "wuzhong");
                           if(card){
                               get_card.push(card);
                           }
                      if(event.number >= 5){
                           card = get.discardPile((card2) => get.name(card2) == "wugu");
                           if(card){
                               get_card.push(card);
                           }
                          if(event.number >= 7){
                           card = get.discardPile((card2) => get.name(card2) == "wuxie");
                           if(card){
                               get_card.push(card);
                           }
                          }
                          }
                       }
                   if(card != 0){
                       player.gain(get_card,"gain2");
                   }
        player.storage.usemark = 0;
    },
            },
            potjixi:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    global:"phaseEnd",
                },
                filter:function (event, player) {
        return player.getHistory('useCard', function (evt) {
            return evt.targets && evt.targets.length > 0;
        }).length > 0;
    },
                content:function(event, player) {
      "step 0"
      const target = trigger.player;
      player.discardPlayerCard(target,"he",true);
      player.chooseTarget(get.prompt('急袭'), [1, Infinity], function (card, player, target) {
return player != target && player.getHistory('useCard', function (evt) {
return evt.targets.includes(target);
}).length > 0
         }).forResult();
        "step 1"
            if(result.bool){
                //player.draw(10);
                const card = get.autoViewAs({ name: "shunshou", isCard: true });
                player.useCard(card, result.targets,true);
                /*    for (var i = 0; i < result.targets.length; i++) {
                        player.gainPlayerCard(result.targets[i], true,"he");
                    }*/
            }
    },
            },
            hyjizhan:{
                trigger:{
                    player:["useCard","phaseEnd"],
                },
                direct:true,
                filter:function(event,player){
       if(event.name == "phase"){
           var num = player.countMark("hyjizhan");
           player.removeMark("hyjizhan",num);
           return false;
       }
       if(get.type(event.card)=='equip' && player.storage.hyjizhancanuse != true){
            player.storage.hyjizhancanuse = true;
            return false;
        }else if(get.color(event.card) != 'black'){
            player.storage.hyjizhancanuse = false;
            return false;
        }
return player.storage.hyjizhancanuse && !player.hasSkill("hyjizhan_block");
},
                content:function(){
'step 0'
player.storage.hyjizhancanuse = false;
player.addMark("hyjizhan",1);
player.chooseTarget(get.prompt2('极斩'),function(card,player,target){
return player!=target;
}).set('ai',function(target){
var player=_status.event.player;
return get.damageEffect(target,player,player);
});
'step 1'
if(result.bool){
var target=result.targets[0];
event.target=target;
player.logSkill('hyjizhan',target);
player.chooseControl('弃置'+get.cnNumber(player.countMark("hyjizhan"))+'张牌','造成'+get.cnNumber(player.countMark("hyjizhan"))+'点伤害','cancel2').set('ai',function(){
var player=_status.event.player;
if(player.countCards('h')<player.hp) return '弃置'+get.cnNumber(player.countMark("hyjizhan"))+'张牌';
return '造成'+get.cnNumber(player.countMark("hyjizhan"))+'点伤害';
});
}
else event.finish();
'step 2'
if(result.control!='cancel2'){
if(result.control=='弃置'+get.cnNumber(player.countMark("hyjizhan"))+'张牌'){
player.discardPlayerCard(target,[0,player.countMark("hyjizhan")],'he','弃置'+get.translation(target)+'的至多'+get.cnNumber(player.countMark("hyjizhan"))+'张牌',true);
}
else{
    target.damage(player,player.countMark("hyjizhan"),'nocard');
    player.addSkill("hyjizhan_block");
}
}
},
                subSkill:{
                    block:{
                        trigger:{
                            global:"phaseEnd",
                        },
                        frequent:true,
                        forced:true,
                        locked:true,
                        content:function(player){
        player.removeSkill("hyjizhan_block");
    },
                        sub:true,
                    },
                },
                "_priority":0,
            },
            hyzhongtao:{
                usable:1,
                enable:"phaseUse",
                content:function () {
        'step 0'
        var num = 1;
        num = Math.min(num + player.getDamagedHp(), 4);
        if (num == 4) {
            event._result = {
                bool: true,
                links: ['♠', '♥', '♣', '♦'],
                confirm: 'ok',
            }
        }
        else {
            var list = ['♠', '♥', '♣', '♦'];
            var next = player.chooseButton([
                '众讨：请选择至少一种花色',
                [list.slice(0, 2), 'tdnodes'],
                [list.slice(2, 4), 'tdnodes'],
            ]);
            next.set('forced', true);
            next.set('selectButton', [1, num]);
            next.set('filterButton', function (button) {
                return true;
            });
        }
        'step 1'
        var map = {
            '♠': 'spade',
            '♥': 'heart',
            '♣': 'club',
            '♦': 'diamond'
        }
        var list = [];
        for (var i of result.links) {
            list.add(map[i]);
        }
        event.list = list;
        event.cards = [];
        'step 2'
        if (event.list.length == 0) event.goto(4);
        else event.suit = event.list.shift();
        'step 3'
        var gamePile = [], card;
        game.players.forEach(p => {
            //if (p != player) {
                card = p.getCards('ej', c => get.suit(c) == event.suit);
                if (card.length) gamePile.addArray(card);
            //}
        });
        if (gamePile.length > 0) {
            event.cards.add(gamePile.randomGet());
            event.goto(2);
        }
        else {
            card = get.cardPile(function (card) {
                return get.suit(card) == event.suit;
            });
            if (card) {
                event.cards.add(card);
                event.goto(2);
            }
            else {
                card = get.discardPile(function (card) {
                    return get.suit(card) == event.suit;
                });
                if (card) {
                    event.cards.add(card);
                    event.goto(2);
                }
            }
        }
        'step 4'
        game.updateRoundNumber();
        player.gain(event.cards, 'gain2');
        player.addTempSkill('hyzhongtao_r', 'phaseUseEnd');
    },
                subSkill:{
                    r:{
                        init:function (player) {
                player.storage.hyzhongtao_r = [];
            },
                        onremove:function (player) {
                delete player.storage.hyzhongtao_r;
            },
                        direct:true,
                        charlotte:true,
                        silent:true,
                        trigger:{
                            player:"useCardEnd",
                        },
                        content:function () {
                player.storage.hyzhongtao_r.add(get.type2(trigger.card));
                if (player.storage.hyzhongtao_r.length >= 3) {
                    player.resetSkill('hyzhongtao');
                    player.removeSkill('hyzhongtao_r');
                }
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
            },
            twqianxiong:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                enable:"phaseUse",
                usable:1,
                chooseButton:{
                    dialog:function(event, player) {
            const cards = get.cards(5, true);
            return ui.create.dialog("潜凶", cards, "hidden");
        },
                    filter:function(button, player) {
            return true;
        },
                    check:function(button) {
            return get.player().getUseValue(button.link);
        },
                    backup:function(links) {
            return {
                card: links[0],
                log: false,
                content() {
                    'step 0'
                    player.logSkill("twqianxiong");
                    event.card = lib.skill.twqianxiong_backup.card;
                    player.chooseTarget(`潜凶：将${get.translation(card)}正面向下置于一名角色的武将牌上`, true)
                        .set("ai", target => -get.attitude(get.player(), target));
                    'step 1'
                    if(!result.bool || !result.targets) event.finish();
                    'step 2'
                    const target = result.targets[0];
                    player.line(target);
                    game.log(player, "将一张牌正面向下置于", target, "的武将牌上");
                    target.addToExpansion(event.card, player, "give").set("gaintag", ["twqianxiong"]);
                },
            };
        },
                    prompt:function(links) {
            return `观看牌堆顶的三张牌，将其中一张正面朝下置于一名角色的武将牌上`;
        },
                },
                intro:{
                    markcount:"expansion",
                    content:function(storage, player, skill) {
            return `共扣置${player.getExpansions("twqianxiong").length}张牌`;
        },
                },
                ai:{
                    order:5,
                    result:{
                        player:1,
                    },
                },
                group:["twqianxiong_effect"],
                subSkill:{
                    phaseEnd:{
                        trigger:{
                            player:"phaseEnd",
                        },
                        content:function() {
        const cards = player.getExpansions("twqianxiong").filter(card => {
                return player.hasHistory("useCard", evt => evt.card.name == card.name) || player.hasHistory("respond", evt => evt.card.name == card.name);
                    });
        if (!cards.length) return;
        player.loseToDiscardpile(cards);
        player.removeSkill("twqianxiong_phaseEnd");
    },
                        sub:true,
                    },
                    damage:{
                        audio:"twqianxiong",
                        onremove:true,
                        forced:true,
                        charlotte:true,
                        trigger:{
                            global:["useCard","respond"],
                        },
                        filter:function(event, player) {
                const target = event.player;
                if (!player.getStorage("twqianxiong_damage").includes(target)) return false;
                return target.getExpansions("twqianxiong").some(card => card.name == event.card.name);
            },
                        logTarget:"player",
                        content:function() {
                trigger.player.damage();
            },
                        sub:true,
                    },
                    effect:{
                        audio:"twqianxiong",
                        trigger:{
                            global:"phaseUseBegin",
                        },
                        filter:function(event, player) {
                return event.player.getExpansions("twqianxiong").length;
            },
                        direct:true,
                        content:function() {
                'step 0'
                const list = [`本回合每当其使用或打出与其「潜凶」牌相同牌名的牌时，你对其造成1点伤害，本回合结束你移除与其使用或打出过的相同名牌的「潜凶」牌`, `你依次使用其所有「潜凶」牌`],
                    target = trigger.player;
                player.chooseControl(["选项一", "选项二", "cancel2"])
                    .set("choiceList", list)
                    .set("prompt", `潜凶：为${get.translation(target)}选择一项`)
                    .set("ai", () => {
                        //ai待完善
                        let att = get.attitude(get.player(), target);
                        if (att > 0) return "cancel2";
                        return ["选项一", "选项二"].randomGet();
                    });
                'step 1'
                if (result.control != "cancel2") {
                    player.logSkill('twqianxiong_effect');
                    event.control = result.control;
                }else {
                    event.finish();
                }
                'step 2'
                if (event.control == "选项一") {
                    player.addTempSkill("twqianxiong_damage");
                    player.markAuto("twqianxiong_damage", [trigger.player]);
                    trigger.player.addSkill("twqianxiong_phaseEnd");
                    /*trigger.player.addWhen({
                        trigger: {
                            player: 'phaseEnd',
                        },
                        content: function() {
                            const cards = player.getExpansions("twqianxiong").filter(card => {
                                return player.hasHistory("useCard", evt => evt.card.name == card.name) || player.hasHistory("respond", evt => evt.card.name == card.name);
                            });
                            if (!cards.length) return;
                            player.loseToDiscardpile(cards);
                        },
                    });*/
                    event.finish();
                } else if (event.control == "选项二") {
                    event.cards = trigger.player.getExpansions("twqianxiong").slice(0);
                    if (!event.cards.length) event.finish();
                }
                'step 3'
                if(!(trigger.player.isAlive() && event.cards.some(card => player.hasUseTarget(card)))) event.finish();
                'step 4'
                const str = "潜凶：请使用其中一张牌";
                player.chooseButton(true, [str, event.cards])
                    .set("filterButton", button => {
                        return get.player().hasUseTarget(button.link);
                    })
                    .set("ai", button => {
                        return get.order(button.link);
                    });
                'step 5'
                if(result.bool && result.links) {
                    const card = result.links[0];
                    event.cards.remove(card);
                    player.$gain2(card, false);
                    game.delayx();
                    player.chooseUseTarget(card, true);
                }
                event.goto(3);
            },
                        sub:true,
                    },
                },
            },
            twzhengshi:{
                audio:"ext:手杀武将/apk/还原武将/audio:3",
                logAudio:index => (typeof index === "number" ? "twzhengshi" + index + ".mp3" : 2),
                derivation:["twjunsi"],
                forced:true,
                locked:false,
                popup:false,
                trigger:{
                    global:"roundStart",
                },
                filter:function(event, player) {
        return game.phaseNumber == 0;
    },
                content:function() {
        'step 0'
        let targets;
        if (game.countPlayer() <= 3) {
            event.targets = game.filterPlayer();
            event.goto(2);
        } else {
            player.chooseTarget(`争适：请选择两名其他角色，然后你和这些角色获得〖隽嗣〗`, 2, lib.filter.notMe, true)
                .set("ai", target => -get.attitude(get.player(), target));
        }
        'step 1'
        if(result.bool && result.targets) {
            event.targets = result.targets.concat([player]).sortBySeat();
        }else {
            event.finish();
        }
        'step 2'
        player.logSkill("twzhengshi", null, null, null, [get.rand(2, 3)]);
        player.line(event.targets, "thunder");
        for (const target of event.targets) target.addSkill("twjunsi");
        player.addSkill("twzhengshi_change");
    },
                subSkill:{
                    change:{
                        popup:false,
                        trigger:{
                            global:["roundStart","dieAfter"],
                            player:"twzhengshiRoundBegin",
                        },
                        filter:function(event, player) {
                if (event.name == '_turnover') {
                    if(game.roundNumber == 1) player.addWhen({
                        trigger: {
                            global: 'phaseBefore',
                        },
                        lastDo: true,
                        firstDo: false,
                        player: player,
                        content: function() {
                            var evt=game.createEvent("twzhengshiRoundBegin");
                            evt.player=_when.player;
                            evt.setContent(function(){
                                event.trigger("twzhengshiRoundBegin");
                            });
                        },
                    });
                    return false;
                }
                if (!player.hasSkill("twjunsi")) return false;
                return (event.name == "die" ? event.player.hasSkill("twjunsi") : true);
            },
                        direct:true,
                        content:function() {
                'step 0'
                player.chooseTarget(`争适：令一名角色〖隽嗣〗的摸牌数或弃牌数+1或-1`, (card, player, target) => {
                        return target.hasSkill("twjunsi");
                    })
                    .set("ai", target => {
                        //ai待完善
                        return Math.random();
                    });
                'step 1'
                if(!result.bool || !result.targets) event.finish();
                'step 2'
                event.target = result.targets[0];
                event.list = ["摸牌数+1", "摸牌数-1", "弃牌数+1", "弃牌数-1"];
                player.chooseButton(
                        [
                            `争适：令${get.translation(event.target)}〖隽嗣〗的摸牌数或弃牌数+1或-1`,
                            '',
                            /*[
                                list.map((item, index) => {
                                    return [index, item];
                                }),
                                "textbutton",
                            ],*/
                            [event.list.slice(0, 2).map((item, index) => [index, item]), "tdnodes"],
                            [event.list.slice(2, 4).map((item, index) => [index + 2, item]), "tdnodes"],
                        ],
                        true,
                        1
                    )
                    .set("filterButton", function (button) {
                        const num = button.link + 1;
                        if (num % 2 == 0) {
                            return event.target.getStorage("twjunsi")[num / 2 - 1] > 0;
                        }
                        return true;
                    })
                    .set("ai", button => {
                        const att = get.attitude(get.player(), event.target);
                        switch (button.link) {
                            case 0:
                                return att * 1;
                            case 1:
                                return -att * 1;
                            case 2:
                                return -att * 1.5;
                            case 3:
                                return att * 1.5;
                            default:
                                break;
                        }
                    });
                'step 3'
                if(!result.bool || !result.links) event.finish();
                'step 4'
                const num = result.links[0] + 1;
                player.logSkill("twzhengshi", [event.target], null, null, [1]);
                event.target.popup(event.list[num - 1]);
                game.log(event.target, "〖隽嗣〗的", event.list[num - 1]);
                event.target.storage.twjunsi[Math.ceil(num / 2) - 1] += num % 2 == 1 ? 1 : -1;
                event.target.markAuto("twjunsi");
            },
                        sub:true,
                    },
                },
            },
            twmiewei:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    player:"phaseUseBegin",
                },
                "prompt2":(event, player) => `出牌阶段开始时，你可令此阶段使用【杀】的次数等同于你攻击范围内的角色数（当前为${game.countPlayer(current => player.inRange(current))}）。`,
                check:function(event, player) {
        return game.countPlayer(current => player.inRange(current)) > 0;
    },
                content:function() {
        player.addTempSkill(event.name + "_effect", "phaseUseAfter");
        player.markSkill(event.name + "_effect");
    },
                group:["twmiewei_damage","twmiewei_useshacount","twmiewei_clear"],
                subSkill:{
                    damage:{
                        audio:"twmiewei",
                        forced:true,
                        locked:false,
                        trigger:{
                            source:"damageBegin1",
                        },
                        filter:function(event, player) {
                return event.notLink() && event?.card?.name == "sha" && event.getParent("useCard").targets?.includes(event.player);
            },
                        logTarget:"player",
                        content:function() {
                var num = trigger.num;
                trigger.num = num + Math.min(5, player.countMark("twmiewei") - 1);
            },
                        sub:true,
                    },
                    effect:{
                        charlotte:true,
                        mod:{
                            cardUsable:function(card, player, num) {
                    if (card.name == "sha") {
                        return game.countPlayer(current => player.inRange(current));
                    }
                },
                        },
                        intro:{
                            markcount:function(storage, player) {
                    return player.getCardUsable("sha");
                },
                            content:function(storage, player, skill) {
                    return `还可使用${player.getCardUsable("sha")}张【杀】`;
                },
                        },
                        sub:true,
                    },
                    useshacount:{
                        forced:true,
                        locked:true,
                        trigger:{
                            player:"useCardToPlayered",
                        },
                        filter:function(event){
               return event.card.name == "sha";
           },
                        content:function(player){
               if(!trigger.targets[0].storage.twmiewei){
                   player.addMark("twmiewei",1);
                   trigger.targets[0].storage.twmiewei = true;
               }
           },
                        sub:true,
                    },
                    clear:{
                        forced:true,
                        locked:true,
                        charlotte:true,
                        trigger:{
                            global:"phaseEnd",
                        },
                        content:function(){
               var num = player.countMark("twmiewei");
               player.removeMark("twmiewei",num);
               var aplayer = game.filterPlayer();
               for(var targets of aplayer){
                   targets.storage.twmiewei = false;
               }
           },
                        sub:true,
                    },
                },
            },
            twmiyong:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                limited:true,
                skillAnimation:false,
                animationColor:"thunder",
                enable:"phaseUse",
                filter:function(event, player) {
        return player.hasCard(card => get.name(card, player) == "sha", "h");
    },
                filterCard:(card, player) => get.name(card, player) == "sha" && !player.getStorage("twmiyong_effect").includes(card),
                check:(card, player) => player.getUseValue(card),
                position:"h",
                selectCard:2,
                lose:false,
                discard:false,
                delay:false,
                content:function() {
        'step 0'
        player.awakenSkill(event.name);
        event.skill = "twmiyong_effect";
        player.showCards(event.cards);
        'step 1'
        player.addGaintag(event.cards, event.skill);
        player.addSkill(event.skill);
        player.addSkill("twmiyong_r");
        player.addMark("twmiyong",2,false);//考虑后面重置限定技的技能，这里采用标记而非直接写死2
        event.cards.forEach(card => {
            card.storage[event.skill] = true;
        });
    },
                subSkill:{
                    effect:{
                        audio:"twmiyong",
                        mod:{
                            aiOrder:function(card, player, num) {},
                        },
                        onremove:function(player, skill) {
                player.removeGaintag(skill);
                delete player.storage[skill];
            },
                        charlotte:true,
                        forced:true,
                        trigger:{
                            global:["loseAfter","loseAsyncAfter","cardsDiscardAfter"],
                        },
                        getSha:function(event, player) {
                let null_list = [];
                const cards = event.cards.filter(card => card.storage.twmiyong_effect);
                    player.storage.twmiyong_effect = cards;
                if (!cards.length) {
                    return null_list;
                }
               if(player.countMark("twmiyong_effect") < player.countMark("twmiyong"))
                       return cards;
               else return null_list;
            },
                        filter:function(event, player) {
                if (event.name.indexOf("lose") == 0) {
                    if (event.position != ui.discardPile || event.type != "discard" || event.getlx === false) {
                        return false;
                    }
                } else {
                    const evt = event.getParent();
                    if (evt.name !== "orderingDiscard") {
                        return false;
                    }
                    const evt2 = evt.relatedEvent || evt.getParent();
                    if (!["useCard", "respond"].includes(evt2.name)) {
                        return false;
                    }
                }
                const cards = lib.skill.twmiyong_effect.getSha(event, player);
                if (cards.length) {
                    event.set("twmiyong_effect", cards);
                    return player.countMark("twmiyong_effect") < player.countMark("twmiyong");
                }
                return false;
            },
                        content:function() {
                'step 0'
                event.cards = trigger[event.name].filterInD("d");
                if (!event.cards.length) {
                    event.finish();
                }
                'step 1'
                player.showCards(event.cards);
                'step 2'
                player.gain(event.cards, "gain2").set("gaintag", [event.name]);
                player.addMark("twmiyong_effect",1,false);
            },
                        sub:true,
                    },
                    r:{
                        forced:true,
                        trigger:{
                            global:"phaseEnd",
                        },
                        content:function(player){
            var num = player.countMark("twmiyong_effect");
            player.removeMark("twmiyong_effect",num);
        },
                        sub:true,
                    },
                },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function (player, skill) {
        player.storage[skill] = false;
    },
            },
            twjunsi:{
                audio:"ext:手杀武将/apk/还原武将/audio:4",
                init:function(player, skill) {
        player.storage[skill] = [1, 1];
    },
                onremove:true,
                mark:true,
                intro:{
                    markcount:function(storage, player) {
            return storage[0] + "/" + storage[1];
        },
                    content:function(storage, player) {
            return `<li>摸牌数：${storage[0]}<br><li>弃牌数：${storage[1]}`;
        },
                },
                locked:true,
                group:["twjunsi_source","twjunsi_end"],
                subSkill:{
                    source:{
                        audio:"twjunsi",
                        forced:true,
                        usable:2,
                        trigger:{
                            source:"damageSource",
                        },
                        logAudio:function(event, player) {
                if (player.name == "huan_caopi") return ["twjunsi1.mp3", "twjunsi2.mp3"];
            },
                        filter:function(event, player) {
                const bool = !game.hasPlayer(target => target != player && target.hasSkill("twjunsi")) ? true : event.player.hasSkill("twjunsi");
                if (bool) return player.getStorage("twjunsi")[0] > 0;
                return false;
            },
                        content:function() {
                const num = player.getStorage("twjunsi")[0];
                player.draw(num);
            },
                        sub:true,
                    },
                    end:{
                        audio:"twjunsi",
                        forced:true,
                        usable:2,
                        trigger:{
                            player:"damageEnd",
                        },
                        logAudio:function(event, player) {
                if (player.name == "huan_caopi") return ["twjunsi3.mp3", "twjunsi4.mp3"];
            },
                        filter:function(event, player) {
                if (!event.source) return false;
                const bool = !game.hasPlayer(target => target != player && target.hasSkill("twjunsi")) ? true : event.source.hasSkill("twjunsi");
                if (bool) return player.getStorage("twjunsi")[1] > 0 && player.countDiscardableCards(player, "he") > 0;
                return false;
            },
                        content:function() {
                const num = player.getStorage("twjunsi")[1];
                player.chooseToDiscard(num, "he", true);
            },
                        sub:true,
                    },
                },
            },
            huanchenxun:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    global:"roundStart",
                },
                content:function (event,player) {
        'step 0'
        player.chooseTarget(get.prompt('沉勋'), 1,function (card, player, target) {
            if(target.hasSkill("huanchenxun_c")){
                return false;
            }
            return player != target;
        }).set('ai', function (target) {
          var area = _status.event.getParent().area, att = get.attitude(_status.event.player, target);
          if (area == 'j') {
            return att;
          }
          return -att;
        }).length > 0;
        'step 1'
//        var targethp;
        if (result.bool) {
            //alltarget.push(result.targets);
 //           targethp = result.targets[0].hp;
            result.targets[0].addSkill("huanchenxun_c");
            player.logSkill('huanchenxun', result.targets);
            player.useCard({ name: 'juedou' }, result.targets[0]);
        }
        else {
        //    alltarget = [];
            event.finish();
        }
        'step 2'
        var bool = game.hasPlayer2(function (current) {
            return current.getHistory('damage', function (evt) {
                return evt.getParent('huanchenxun') == event;
            }).length > 0 && current != player
        });
        if (bool) {
            player.draw();
            //player.useSkill("hunchenxun",[player]);
            event.goto(0);
         }
        else {
            player.loseHp();
            //alltarget = [];
        }
     
    },
                subSkill:{
                    c:{
                        forced:true,
                        locked:true,
                        trigger:{
                            global:"phaseBegin",
                        },
                        content:function(player){
        player.removeSkill("huanchenxun_c");
     },
                        sub:true,
                    },
                },
                "_priority":0,
            },
            olhuanhuo:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    global:"roundStart",
                },
                forced:true,
                locked:false,
                content:function() {
        'step 0'
        player.draw(2);
        'step 1'
        const num = Math.min(
            2,
            game.countPlayer(target => target != player)
        );
        player.chooseCardTarget({
                prompt: `幻惑：弃置至多两张牌并选择等量其他角色`,
                filterCard: lib.filter.cardDiscardable,
                selectCard: [1, num],
                filterTarget: lib.filter.notMe,
                selectTarget: [1, num],
                complexCard: true,
                filterOk() {
                    if (!ui.selected.cards.length) {
                        return false;
                    }
                    return ui.selected.cards.length == ui.selected.targets.length;
                },
                ai1(card) {
                    return 7.5 - get.value(card);
                },
                ai2(target) {
                    return -get.attitude(get.player(), target) * target.countCards("hs");
                },
            });
        'step 2'
        if (result.bool && result.cards?.length && result.targets?.length) {
            const { cards, targets } = result;
            event.targets = targets;
            player.discard(cards);
        }else {
            event.finish();
        }
        'step 3'
        player.line(event.targets);
        event.targets.forEach(target => target.addTempSkill(event.name + "_debuff", { player: "phaseUseAfter" }));
    },
                subSkill:{
                    backup:{
                        filterCard:function(card) {
                return get.itemtype(card) == "card" && card == _status.event?.olhuanhuo_debuff;
            },
                        viewAs:function(cards, player) {
                if (cards.length) {
                    const card = _status.event?.olhuanhuo_debuff;
                    return {
                        name: get.name(card, player),
                        nature: get.nature(card, player),
                        cards: [card],
                        isCard: true,
                    };
                }
                return null;
            },
                        popname:true,
                        log:false,
                        sub:true,
                        parentskill:"olhuanhuo",
                        "_priority":0,
                    },
                    debuff:{
                        forced:true,
                        charlotte:true,
                        popup:false,
                        init:function(player, skill) {
                player.addMark(skill, 2, false);
            },
                        onremove:true,
                        intro:{
                            content:"当前“幻惑”剩余次数：#",
                        },
                        firstDo:true,
                        trigger:{
                            player:["chooseToUseBegin","useCard1"],
                        },
                        filter:function(event, player) {
                if (event.name == "chooseToUse") {
                    return event.type == "phase";
                }
                return player.isPhaseUsing();
            },
                        content:function() {
                'step 0'
                if (trigger.name == "useCard") {
                    player.removeMark(event.name, 1, false);
                    var hs = player.getDiscardableCards(player, "h"),
                        es = player.getDiscardableCards(player, "e");
                    var card = hs.length ? hs.randomGet() : es?.randomGet();
                    if (card) {
                        player.discard(card);
                    }
                } else {
                    event.goto(2);
                }
                'step 1'
                if (!player.hasMark(event.name)) {
                    player.removeSkill(event.name);
                }
                event.finish();
                'step 2'
                event.cards = player.getCards("h", card => lib.filter.cardEnabled(card, player, trigger) && lib.filter.cardUsable(card, player, trigger));
                if (!event.cards.length) {
                    event.finish();
                }
                'step 3'
                var card = event.cards.randomGet();
                trigger.set(event.name, card);
                var name = "olhuanhuo_backup";
                //trigger.set("openskilldialog", "请选择" + get.translation(card) + "的目标");
                trigger.set("norestore", true);
                trigger.set("_backupevent", name);
                trigger.set("custom", {
                    add: {},
                    replace: { window() {} },
                });
                trigger.backup(name);
                /*const originalFilter = trigger.filterCard;
                trigger.filterCard = function (card) {
                    if (get.itemtype(card) !== "card" || card != get.event().olhuanhuo_debuff) {
                        return false;
                    }
                    return originalFilter.apply(this, arguments);
                };*/
            },
                        sub:true,
                        parentskill:"olhuanhuo",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            olqingshi:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                filter:function(event, player) {
        return !player.hasSkill("olrumo") || !game.hasPlayer(target => target.countCards("h", card => card.hasGaintag("olqingshi_tag")));
    },
                direct:true,
                content:function() {
        'step 0'
        if (!player.hasSkill("olrumo")) {
            player.chooseBool(get.prompt2('olqingshi')).set("choice", true);
        } else {
            event._result = {bool: true};
        }
        'step 1'
        if (result.bool) {
            player.logSkill('olqingshi', game.filterPlayer());
        }else {
            event.finish();
        }
        'step 2'
        if (!player.hasSkill("olrumo")) {
            const name = event.name + "_animate";
            player.trySkillAnimate(name, name, player.checkShow(name));
            player.addSkill("olrumo");
        }else {
            event.noAnimation = true;
        }
        event.targets = game.filterPlayer();
        'step 3'
        if(false /* APK visual requires removed global UI patches */) {
            let type = lib.config.effect_dm_diaochan;
            if(type == 'level3') {
                _status.tempMusic='effect_dm_lvbu';
                game.playBackgroundMusic();
            }
            // 修复jie的translate括号并添加退出动画
            game.createCss(`@keyframes textEnter {
                0% {
                    opacity: 0;
                    filter: blur(10px);
                    transform: var(--translate) scale(1.5);
                }
                70% {
                    opacity: 1;
                    filter: blur(0);
                    transform: var(--translate) scale(0.95);
                }
                100% {
                    transform: var(--translate) scale(1);
                }
            }
            @keyframes textExit {
                0% {
                    opacity: 1;
                    transform: var(--translate) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: var(--translate) scale(0.5);
                }
            }
            .bloody-effect {
              filter: 
                sepia(0.7) 
                hue-rotate(-40deg) 
                saturate(4) 
                contrast(2) 
                brightness(0.9);
              position: relative;
              transition: all 0.6s ease;
            }
            
            /* 可选 - 增加血色光晕效果 */
            .bloody-effect::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              background: radial-gradient(
                circle, 
                rgba(255, 10, 0, 0.15) 0%, 
                rgba(0, 0, 0, 0.3) 25%
              );
              mix-blend-mode: multiply;
              pointer-events: none;
            }
            
            @keyframes olqingshi_loop {
                0% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.7;
                }
                100% {
                    opacity: 1;
                }
            }`);
            let item = {};
            item.imgMap = {
                wei: {
                    width: "600px",
                    translate: "translate(calc(-50% - 300px), calc(-50%))",
                },
                wo: {
                    width: "600px",
                    translate: "translate(calc(-50% - 300px), calc(-50%))",
                },
                diankuang: {
                    width: "600px",
                    translate: "translate(calc(-50% - 300px), calc(-50%))",
                },
            };
            
            item.createImg = function(name) {
                item[name] = document.createElement("img");
                item[name].src = `${lib.assetURL}extension/标记补充/animation/${name}.png`;
                item[name].style.position = "absolute";
                item[name].style.width = item.imgMap[name].width;
                item[name].style.top = "50%";
                item[name].style.left = "50%";
                item[name].style.setProperty('--translate', item.imgMap[name].translate); // 设置CSS变量
                item[name].style.zIndex = "16";
                document.body.appendChild(item[name]);
                
                // 应用入场动画
                item[name].style.animation = "textEnter 0.5s ease-out forwards";
            };
            
            item.clearImg = function() {
                if (item.imgMap) {
                    Object.keys(item.imgMap).forEach((key) => {
                        if (item[key]) {
                            // 应用离场动画
                            item[key].style.animation = "textExit 0.3s ease-in forwards";
                            
                            // 动画结束后移除元素
                            item[key].addEventListener("animationend", function handler() {
                                this.removeEventListener("animationend", handler);
                                if (this.parentNode) {
                                    document.body.removeChild(this);
                                }
                                item[key] = null;
                            });
                        }
                        if (item.imgMap[key].t) {
                            clearTimeout(item.imgMap[key].t);
                            item.imgMap[key].t = null;
                        }
                    });
                }
            };
            
            
            game.playAnimation('extension/标记补充/animation/modiaochan.mp4', function() {
                Object.keys(item.imgMap).forEach((key, index) => {
                    item.imgMap[key].t = setTimeout(() => {
                        item.createImg(key);
                    }, 3100 + index * 300);
                });
                setTimeout(function() {
                    if(type == 'level3') ui.background.classList.add('bloody-effect');
                    player.createHighLight([[255,255,255],[255,255,50],[255,50,50]],7,{level:10}).style.animation = 'olqingshi_loop 5s infinite ease';
                }, 3400);
            }, function() {
                item.clearImg();
            });
        }
        'step 4'
        if(!event.targets.length) event.finish();
        'step 5'
        var target = event.targets.shift();
        const card = get.cardPile(card => {
            const info = get.info(card);
            return get.tag(card, "damage") > 0.5 && info.selectTarget && get.select(info.selectTarget).every(i => i == 1);
        });
        if (card) {
            const next = target.gain(card, "draw");
            next.gaintag.add("olqingshi_tag");
        } else {
            target.chat("无牌可拿");
        }
        event.goto(4);
    },
                group:["olqingshi_effect"],
                subSkill:{
                    tag:{
                        sub:true,
                        parentskill:"olqingshi",
                        "_priority":0,
                    },
                    animate:{
                        skillAnimation:true,
                        animationColor:"metal",
                        sub:true,
                        parentskill:"olqingshi",
                        "_priority":0,
                    },
                    effect:{
                        audio:"olqingshi",
                        trigger:{
                            global:["damageSource","loseAfter","cardsDiscardAfter","loseAsyncAfter","useCardToPlayer"],
                        },
                        filter:function(event, player, name) {
                const tag = "olqingshi_tag";
                if (name == "useCardToPlayer") {
                    const evtx = event.getParent();
                    return (
                        event.targets.length == 1 &&
                        event.player != player &&
                        event.isFirstTarget &&
                        game.hasPlayer2(target => {
                            return target.hasHistory("lose", evt => {
                                if ((evt.relatedEvent || evt.getParent()) != evtx) {
                                    return false;
                                }
                                return Object.values(evt.gaintag_map || {})
                                    .flat()
                                    .includes(tag);
                            });
                        })
                    );
                } else if (event.name == "damage") {
                    return (
                        event.card &&
                        event.cards &&
                        game.hasPlayer2(target => {
                            return target.hasHistory("lose", evt => {
                                if (evt.getParent().card != event.card || evt.relatedEvent?.card == event.card) {
                                    return false;
                                }
                                return Object.values(evt.gaintag_map || {})
                                    .flat()
                                    .includes(tag);
                            });
                        })
                    );
                }
                if (event.name.indexOf("lose") == 0) {
                    if (event.getlx === false || event.position != ui.discardPile) {
                        return false;
                    }
                } else {
                    var evt = event.getParent();
                    if (evt.relatedEvent?.name == "useCard") {
                        return false;
                    }
                }
                return lib.skill.olqingshi_effect.getCards(event, tag).length;
            },
                        getCards:function(event, tag) {
                const cards = [];
                const targets = game.filterPlayer2();
                for (const target of targets) {
                    if (event.name.startsWith("lose")) {
                        const evt = event.getl(target);
                        cards.addArray(evt.cards2.filter(card => evt.gaintag_map?.[card.cardid]?.includes(tag) && get.position(card) == "d"));
                    } else {
                        game.checkGlobalHistory("cardMove", evt => {
                            if (evt.name != "cardsDiscard" || evt != event) {
                                return false;
                            }
                            const evtx = evt.getParent();
                            if (evtx.name != "orderingDiscard") {
                                return false;
                            }
                            const evt2 = evtx.relatedEvent || evtx.getParent();
                            target.checkHistory("lose", evt3 => {
                                const evt4 = evt3.relatedEvent || evt3.getParent();
                                if (evt2 != evt4) {
                                    return false;
                                }
                                cards.addArray(evt3.getl(target).cards2.filter(card => evt3.gaintag_map?.[card.cardid]?.includes(tag) && get.position(card) == "d"));
                            });
                        });
                    }
                }
                return cards;
            },
                        direct:true,
                        content:function() {
                'step 0'
                const name = event.triggername;
                if (name == "useCardToPlayer") {
                    const targets = game.filterPlayer(target => lib.filter.targetEnabled2(trigger.card, trigger.player, target)),
                        goon = Math.max(...targets.filter(target => target != trigger.target).map(target => get.effect(target, trigger.card, trigger.player, player))) > get.effect(trigger.target, trigger.card, trigger.player, player);
                    event.initial = trigger.target;
                    event.initial.createHighLight([[255,255,255],[255,50,255],[255,0,100]],6,{level:2});
                    player.chooseCardTarget({
                        prompt: `###${get.prompt('olqingshi', trigger.player)}###弃置一张牌，为${get.translation(trigger.card)}重新指定目标（无距离限制）`,
                        filterCard: lib.filter.cardDiscardable,
                        position: "he",
                        filterTarget(card, player, target) {
                            return targets.includes(target);
                        },
                        ai1(card) {
                            if (goon) {
                                return 7 - get.value(card);
                            }
                            return 0;
                        },
                        ai2(target) {
                            return get.effect(target, _status.event.getTrigger().card, _status.event.getTrigger().player, get.player());
                        },
                        targetprompt(target) {
                            if (!target.isIn() || target != _status.event.getTrigger().target) {
                                return false;
                            }
                            return "原目标";
                        }
                    });
                } else {
                    event._result = {
                        bool: true,
                    };
                }
                'step 1'
                if(event.initial) event.initial.createHighLight([],0,{level:2,opacity:0});
                if(result.bool) {
                    player.logSkill('olqingshi_effect');
                }else {
                    event.finish();
                }
                'step 2'
                if (event.triggername == "useCardToPlayer") {
                    const { cards, targets } = result;
                    event.targets = targets;
                    player.discard(cards);
                } else if (trigger.name == "damage") {
                    player.draw();
                    event.finish();
                } else {
                    var cards = lib.skill[event.name].getCards(trigger, "olqingshi_tag");
                    player.gain(cards, "gain2");
                    event.finish();
                }
                'step 3'
                var evt = trigger.getParent();
                player.line(event.targets);
                evt.targets.length = 0;
                evt.targets.addArray(event.targets);
                game.log(event.targets, "成为了", trigger.card, "的新目标");
            },
                        sub:true,
                        parentskill:"olqingshi",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            olrumo:{
                trigger:{
                    global:"roundStart",
                },
                firstDo:true,
                silent:true,
                nopop:true,
                content:function() {
        'step 0'
        if (!player.getRoundHistory("sourceDamage", evt => evt.num > 0, 1)?.length) {
            player.loseHp();
        }
    },
                mark:true,
                marktext:"<span style = 'font-weight:bold; text-shadow: 0px 0px 5px rgb(230, 0, 200), 0px 0px 5px rgb(230, 0, 200), 0px 0px 5px rgb(230, 0, 200);'>魔</span>",
                intro:{
                    content:"你已入魔",
                },
                forced:true,
                popup:false,
                "_priority":1,
            },
            "eu_zhitong":{
                mark:true,
                zhuanhuanji:true,
                intro:{
                    content:function(storage, player, skill) {
            if (storage) {
                return "转换技，当你使用牌时，若目标包含其他角色，你依次获得这些角色装备区的所有牌并对其造成1点伤害。";
            }
            return "转换技，当你使用牌时，若目标包含自己，摸两张牌且回复1点体力。";
        },
                },
                trigger:{
                    player:"useCard",
                },
                filter:function(event, player) {
        if (!event?.targets?.length) {
            return false;
        }
        const bool = player.storage?.eu_zhitong;
        return (bool && event.targets.some(current => current !== player)) || (!bool && event.targets.includes(player));
    },
                check:function(event, player) {
        if (!player.storage?.eu_zhitong) {
            return true;
        }
        return event.targets.filter(target => target != player).reduce((eff, target) => eff + get.damageEffect(target, player, player), 0) > 0;
    },
                content:function() {
        "step 0"
        player.changeZhuanhuanji(event.name);
        if (player.storage?.eu_zhitong) {
            event.goto(1);
        }else {
            event.goto(3);
        }
        "step 1"
        player.draw(2);
        "step 2"
        player.recover();
        event.finish();
        "step 3"
        event.targets = trigger.targets.filter(current => current !== player).sortBySeat();
        "step 4"
        if(!event.targets.length) event.finish();
        "step 5"
        event.target = event.targets.shift();
        const cards = event.target.getGainableCards(player, "e");
        if (cards.length) {
            player.gain(cards, event.target, "give", "bySelf");
        }
        "step 6"
        event.target.damage();
        "step 7"
        event.goto(4);
    },
                "_priority":0,
            },
            "eu_ducai":{
                init:function(player, skill) {
        if (_status?.currentPhase !== player) {
            return;
        }
        const targets = game.filterPlayer(current => current !== player);
        for (const target of targets) {
            target.addTempSkill(skill + "_block");
        }
    },
                onremove:function(player, skill) {
        if (_status?.currentPhase !== player) {
            return;
        }
        const targets = game.filterPlayer(current => current !== player);
        for (const target of targets) {
            target.removeSkill(skill + "_block");
        }
    },
                trigger:{
                    player:"phaseBegin",
                },
                forever:true,
                forced:true,
                content:function() {
        get.info(event.name).init(player, event.name);
    },
                mod:{
                    targetInRange:function(card, player) {
            if (player == _status.currentPhase) {
                return true;
            }
        },
                    cardUsable:function(card, player) {
            if (player == _status.currentPhase) {
                return Infinity;
            }
        },
                },
                subSkill:{
                    block:{
                        inherit:"baiban",
                        intro:{
                            content:function(storage, player, skill) {
                    let str = "<li>不能使用牌";
                    const list = player.getSkills(null, false, false).filter(function (i) {
                        return lib.skill.baiban.skillBlocker(i, player);
                    });
                    if (list.length) {
                        str += "<br><li>" + get.translation(list) + "失效";
                    }
                    return str;
                },
                        },
                        mod:{
                            cardEnabled:function(card) {
                    return false;
                },
                            cardSavable:function(card) {
                    return false;
                },
                        },
                        sub:true,
                        parentskill:"eu_ducai",
                        init:function(player,skill) {
                player.addSkillBlocker(skill);
            },
                        onremove:function(player,skill) {
                player.removeSkillBlocker(skill);
            },
                        charlotte:true,
                        skillBlocker:function(skill,player) {
                return !lib.skill[skill].charlotte/*&&!lib.skill[skill].forever*/;
            },
                        mark:true,
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            "eu_jiquan":{
                trigger:{
                    global:"phaseBegin",
                },
                zhuSkill:true,
                forced:true,
                filter:function(event, player) {
        if(!player.hasZhuSkill('eu_jiquan')) return false;
        return event.player?.group === "western" && event.player?.isIn();
    },
                content:function() {
        "step 0"
        player.recover();
        "step 1"
        player.draw();
    },
                "_priority":0,
            },
            qiusuo:{
                trigger:{
                    source:"damageSource",
                    player:"damageEnd",
                },
                filter:function (event, player) {
        return !event._notrigger.includes(player);
    },
                forced:true,
                content:function () {
        const card = get.cardPile((card2) => get.name(card2) == "tiesuo");
        if(card)
            player.gain(card, 'gain2');
    },
                "_priority":0,
            },
            lisao:{
                enable:"phaseUse",
                usable:1,
                content:function (player) {
        'step 0'
         player.chooseTarget(2,`离骚：选择两名角色进行历史知识问答`, true).set("ai", (target) => get.attitude(get.player(), target) > 0).forResult();
        "step 1"
        //我不会弄那个离骚问答这里改成随机了
        if(result.bool){
            var target = result.targets.randomGet();
            if(result.targets[0] == player || result.targets[1] == player)
                 target = player;
            var target2;
            if(target == result.targets[0]){
                 target2 = result.targets[1];
            }else{
                 target2 = result.targets[0];
            }
         target.showHandcards();
         target2.addSkill("lisao_shenwei");
         target2.addSkill("lisao_d");
         target2.addSkill("lisao_clear");
        }
    },
                subSkill:{
                    shenwei:{
                        trigger:{
                            target:"useCardToTargeted",
                        },
                        logTarget:"player",
                        forced:true,
                        filter:function(event,player){
return event.player!=player;
},
                        content:function(player,trigger){
trigger.getParent().directHit.push(player);
},
                        sub:true,
                    },
                    d:{
                        trigger:{
                            player:"damageBegin3",
                        },
                        forced:true,
                        content:function () {
        var num = trigger.num;
        trigger.num = num * 2;
    },
                        sub:true,
                    },
                    clear:{
                        trigger:{
                            global:"phaseEnd",
                        },
                        forced:true,
                        content:function (player) {
        player.removeSkill("lisao_d");
        player.removeSkill("lisao_shenwei");
        player.removeSkill("lisao_clear");
    },
                        sub:true,
                    },
                },
                ai:{
                    order:10,
                    result:{
                        target:1,
                    },
                },
                "_priority":0,
            },
            twhuogong:{
                trigger:{
                    player:"huogongBegin",
                },
                forced:true,
                locked:false,
                popup:false,
                content:function() {
        trigger.setContent(lib.skill.twhuogong.huogongContent);
    },
                huogongContent:function() {
        "step 0"
        if(target.countCards('h')==0){
            event.finish();
            return;
        }
        //event._result={cards:target.getCards('h').randomGets(1)};
        var cards = target.getCards('h').filter(card => card.storage.twhantian);
        //target.getHistory('gain',function(evt){cards.push(evt.card)});
        //player.gain('gain2',cards);
        //player.chat(cards.toString());
        if(cards.length > 0){
            target.chooseCard(1,'h','请分享一张牌：火攻',true,function(card){return card.storage.twhantian;});
        }else{
            target.chooseCard(1,'h','请分享一张牌：火攻');
        }
        "step 1"
        target.showCards(result.cards).setContent(function(){});
        event.dialog=ui.create.dialog(get.translation(target)+'分享的手牌',result.cards);
        event.videoId=lib.status.videoId++;

        game.broadcast('createDialog',event.videoId,get.translation(target)+'分享的手牌',result.cards);
        game.addVideo('cardDialog',null,[get.translation(target)+'分享的手牌',get.cardsInfo(result.cards),event.videoId]);
        event.card2=result.cards[0];
        game.log(target,'分享了',event.card2);
        event._result={};
        player.chooseToDiscard({suit:get.suit(event.card2)},'h',function(card){
            var evt=_status.event.getParent();
            if(get.damageEffect(evt.target,evt.player,evt.player,'fire')>0){
                return 7-get.value(card,evt.player);
            }
            return -1;
        }).set('prompt',false);
        game.delay(2);
        "step 2"
        if(result.bool){
            target.damage('fire',event.baseDamage||1);
        }
        event.dialog.close();
        game.addVideo('cardDialog',null,event.videoId);
        game.broadcast('closeDialog',event.videoId);
    },
            },
            twfushu:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                enable:"chooseToUse",
                hiddenCard:function(player, name) {
        return name == "tao" && player.countCards("h") > 0;
    },
                filter:function(event, player) {
        return event.filterCard({ name: "tao", isCard: true }, player, event) && player.countCards("h") && !player.hasSkill("twfushu_block");
    },
                content:function(event, trigger, player) {
        "step 0"
                if(player.hasSkill("twfushu_block")){
                event.finish();
                return;
}else{
    player.addSkill("twfushu_block");
}
        player.chooseCard(1,'h');
        "step 1"
            const cards = result.cards[0];
            player.showCards(_status.pileTop);
            player.showCards(cards);
            if(get.number(cards) <= get.number(_status.pileTop)){
            game.log(player,"拼点失败");
            player.addSkill("twfushu_damage");
            player.addMark("twfushu_damage", 1, false);
            }else{
                game.log(player,"拼点成功");
                var tao = {isCard:true,name:"tao"};
                var usePlayer = player;
                var cplayer = game.filterPlayer(current => {return current.hp <= 0;});
                if(cplayer.length > 0){
                    usePlayer = cplayer[0];
                }
                player.useCard(tao,usePlayer);
            }
                player.discard(cards);
    },
                subSkill:{
                    damage:{
                        audio:2,
                        onremove:true,
                        intro:{
                            content:"下次受到的伤害+1",
                        },
                        charlotte:true,
                        forced:true,
                        trigger:{
                            player:"damageBegin3",
                        },
                        filter:function(event, player) {
                return player.countMark("twfushu_damage") > 0;
            },
                        content:function() {
                trigger.num += player.countMark(event.name);
                player.removeMark("twfushu_damage",1);
                player.removeSkill(event.name);
            },
                        sub:true,
                        sourceSkill:"twfushu",
                        "_priority":0,
                    },
                    block:{
                        forced:true,
                        charlotte:true,
                        trigger:{
                            global:"phaseEnd",
                        },
                        content:function(player){
               player.removeSkill("twfushu_block");
           },
                        sub:true,
                    },
                },
                ai:{
                    basic:{
                        order:function (card, player) {
                   if (player.hasSkillTag('pretao')) return 5;
                   return 2;
              },
                        useful:function (card, i) {
                   let player = _status.event.player;
                   if (player.isDamaged() && !game.checkMod(card, player, 'unchanged', 'cardEnabled2', player)) return 2 / (1 + i);
                   let fs = game.filterPlayer(function (current) {
                        return get.attitude(player, current) > 0 && current.hp <= 2;
                   }), damaged = 0, needs = 0;
                   for (let f of fs) {
                        if (!lib.filter.cardSavable(card, player, f)) continue;
                        if (f.hp > 1) damaged++;
                        else needs++;
                   }
                   if (needs && damaged) return 5 * needs + 3 * damaged;
                   if (needs + damaged > 1 || player.hasSkillTag('maixie')) return 8;
                   if (player.hp / player.maxHp < 0.7) return 7 + Math.abs(player.hp / player.maxHp - 0.5);
                   if (needs) return 7;
                   if (damaged) return Math.max(3, 6.4 - i);
                   return 6.8 - Math.min(5, player.hp);
              },
                        value:function (card, player, i) {
                   let fs = game.filterPlayer(function (current) {
                        return get.attitude(_status.event.player, current) > 0;
                   }), damaged = 0, needs = 0;
                   for (let i of fs) {
                        if (!player.canUse('tao', i)) continue;
                        if (i.hp <= 1) needs++;
                        else if (i.hp == 2) damaged++;
                   }
                   if (needs > 2) return 11;
                   if (needs > 1) return 10;
                   if (needs && damaged || player.hasSkillTag('maixie')) return 9;
                   if (needs || damaged > 1) return 8;
                   if (damaged) return 7.5;
                   return Math.max(1, 9.2 - player.hp);
              },
                    },
                    result:{
                        player:function (player, target) {
                   if (target != player && get.attitude(target, player) < 0) {
                        return "zeroplayertarget";
                   }
                   if (player.countCards('hs', 'tao') > 0) {
                        var numt = player.countCards('hs', 'tao');
                   }
                   if (player.countCards('hs') == 0) {
                        var numt = player.countCards('hs', 'tao') + 1;
                   }
                   if (player.canSave(target)) {
                        if (player.hasSkill('longhun') || player.hasSkill('relonghun')) {
                             var numt = player.countCards('hs', 'tao') + player.countCards('hes', function (card) {
                                  return get.suit(card, player) == 'heart' && get.name(card) != 'tao';
                             });
                        }
                   }
                   var tri = _status.event.getTrigger();
                   var zhong = get.population('zhong')
                   var fan = get.population('fan')
                   var cxdy = game.countPlayer(function (current) {
                        return current.hp <= 1 && get.attitude(player, current) > 0;
                   });
                   if (player.identity == 'zhu' || player.identity == 'nei') {
                        if (cxdy >= 1 && player.hp > 2 && player.countCards('hs', 'tao') <= 1 && player == target) {
                             return "zeroplayertarget";
                        }
                   }
                   if (cxdy >= 1 && player.hp > 1 && player.countCards('hs', 'tao') <= 1 && player == target) {
                        return "zeroplayertarget";
                   }
                   if (tri && tri.name == 'dying') {
                        if (target.hasSkill('spshanxi_bj') && target.countCards('he') < 2) {
                             return "zeroplayertarget";
                        }
                   }
                   if (_status.mode == "normal") {
                        if (tri && tri.name == 'dying') {
                             if (player.identity == 'zhu' && get.attitude(player, target) > 0) {
                                  if (target.identity == 'zhong' || target.identity == 'mingzhong') {
                                       if ((numt + target.hp) > 0 && player.hp >= 2) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (target.identity == 'nei' && fan >= 3 && player.hp >= 2 && target.hasSkill('AIoptimize_1_tz')) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (target.identity == 'fan') {
                                       return 0;
                                  }
                             }
                             if (player.identity == 'zhong' && get.attitude(player, target) > 0) {
                                  if (target != player && (target.identity == 'zhong' || target.identity == 'mingzhong' || target.hasSkill('AIoptimize_1_sfz'))) {
                                       if ((numt + target.hp) > 0) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (target.identity == 'zhu') {
                                       return 1;
                                  }
                                  if (target.identity == 'zhong' && target == player) {
                                       return 1;
                                  }
                                  if (target.identity == 'nei' && fan >= 3 && zhong <= 1 && target.hasSkill('AIoptimize_1_tz')) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (target.identity == 'fan') {
                                       return 0;
                                  }
                             }
                             if (player.identity == 'nei' && (player.hasSkill('AIoptimize_1_tz') || player.hasSkill('AIoptimize_1_tf'))) {
                                  if (fan > 0 && zhong > 0 && target.identity == 'zhu') {
                                       return 1;
                                  }
                                  if (player.hasSkill('AIoptimize_1_tz') && (target.identity == 'zhong' || target.identity == 'mingzhong')) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2 && fan >= 3 && zhong <= 1) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (player.hasSkill('AIoptimize_1_tf') && target.identity == 'fan' && tri.source && tri.source != player) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2 && fan <= 1 && zhong >= 2) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                             }
                             if (player.identity == 'fan') {
                                  if (target.identity == 'fan' && tri.source && tri.source.identity == 'fan' && get.attitude(player, target) > 0) {
                                       if (target.countCards('h') >= 3 && (numt + target.hp) > 0) {
                                            return 1;
                                       } else {
                                            if ((target.countCards('hs') < 3 && tri.source.previous.identity != 'fan') || (numt + target.hp) <= 0) {
                                                 if (player.countCards('hs', 'tao') > 0) return 0;
                                            }
                                       }
                                  }
                                  if (target.identity == 'fan' && tri.source && tri.source.identity != 'fan' && get.attitude(player, target) > 0) {
                                       if (target == player) {
                                            return 1;
                                       } else {
                                            if (target != player) {
                                                 if ((numt + target.hp) > 0) {
                                                      return 1;
                                                 } else {
                                                      if ((numt + target.hp) <= 0) {
                                                           if (player.countCards('hs', 'tao') > 0) return 0;
                                                      }
                                                 }
                                            }
                                       }
                                  }
                                  if (target.identity == 'fan' && !tri.source && get.attitude(player, target) > 0) {
                                       if (target == player) {
                                            return 1;
                                       } else {
                                            if (target != player) {
                                                 if ((numt + target.hp) > 0) {
                                                      return 1;
                                                 } else {
                                                      if ((numt + target.hp) <= 0) {
                                                           if (player.countCards('hs', 'tao') > 0) return 0;
                                                      }
                                                 }
                                            }
                                       }
                                  }
                                  if (target.identity == 'nei' && fan <= 1 && zhong >= 2 && target.hasSkill('AIoptimize_1_tf')) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2) {
                                            return 1;
                                       }
                                  }
                                  if (target.identity == 'zhu' || target.identity == 'zhong') {
                                       return 0;
                                  }
                             }
                        }
                   } else {
                        if (tri && tri.name == 'dying') {
                             if (target == player) {
                                  return 1;
                             }
                             if (target != player && get.attitude(player, target) > 0) {
                                  if ((numt + target.hp) > 0) {
                                       return 1;
                                  } else {
                                       if ((numt + target.hp) <= 0) {
                                            if (player.countCards('hs', 'tao') > 0) return 0;
                                       }
                                  }
                             }
                        }
                   }
              },
                        target:2,
                        "target_use":function (player, target) {
                   if (target != player && get.attitude(target, player) < 0) {
                        return "zeroplayertarget";
                   }
                   if (player.countCards('hs', 'tao') > 0) {
                        var numt = player.countCards('hs', 'tao');
                   }
                   if (player.countCards('hs') == 0) {
                        var numt = player.countCards('hs', 'tao') + 1;
                   }
                   if (player.canSave(target)) {
                        if (player.hasSkill('longhun') || player.hasSkill('relonghun')) {
                             var numt = player.countCards('hs', 'tao') + player.countCards('hes', function (card) {
                                  return get.suit(card, player) == 'heart' && get.name(card) != 'tao';
                             });
                        }
                   }
                   var tri = _status.event.getTrigger();
                   var zhong = get.population('zhong')
                   var fan = get.population('fan')
                   var cxdy = game.countPlayer(function (current) {
                        return current.hp <= 1 && get.attitude(player, current) > 0;
                   });
                   if (player.identity == 'zhu' || player.identity == 'nei') {
                        if (cxdy >= 1 && player.hp > 2 && player.countCards('hs', 'tao') <= 1 && player == target) {
                             return "zeroplayertarget";
                        }
                   }
                   if (cxdy >= 1 && player.hp > 1 && player.countCards('hs', 'tao') <= 1 && player == target) {
                        return "zeroplayertarget";
                   }
                   if (tri && tri.name == 'dying') {
                        if (target.hasSkill('spshanxi_bj') && target.countCards('he') < 2) {
                             return "zeroplayertarget";
                        }
                   }
                   if (_status.mode == "normal") {
                        if (tri && tri.name == 'dying') {
                             if (player.identity == 'zhu' && get.attitude(player, target) > 0) {
                                  if (target.identity == 'zhong' || target.identity == 'mingzhong') {
                                       if ((numt + target.hp) > 0 && player.hp >= 2) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (target.identity == 'nei' && fan >= 3 && player.hp >= 2 && target.hasSkill('AIoptimize_1_tz')) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (target.identity == 'fan') {
                                       return 0;
                                  }
                             }
                             if (player.identity == 'zhong' && get.attitude(player, target) > 0) {
                                  if (target != player && (target.identity == 'zhong' || target.identity == 'mingzhong' || target.hasSkill('AIoptimize_1_sfz'))) {
                                       if ((numt + target.hp) > 0) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (target.identity == 'zhu') {
                                       return 1;
                                  }
                                  if (target.identity == 'zhong' && target == player) {
                                       return 1;
                                  }
                                  if (target.identity == 'nei' && fan >= 3 && zhong <= 1 && target.hasSkill('AIoptimize_1_tz')) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (target.identity == 'fan') {
                                       return 0;
                                  }
                             }
                             if (player.identity == 'nei' && (player.hasSkill('AIoptimize_1_tz') || player.hasSkill('AIoptimize_1_tf'))) {
                                  if (fan > 0 && zhong > 0 && target.identity == 'zhu') {
                                       return 1;
                                  }
                                  if (player.hasSkill('AIoptimize_1_tz') && (target.identity == 'zhong' || target.identity == 'mingzhong')) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2 && fan >= 3 && zhong <= 1) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                                  if (player.hasSkill('AIoptimize_1_tf') && target.identity == 'fan' && tri.source && tri.source != player) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2 && fan <= 1 && zhong >= 2) {
                                            return 1;
                                       } else {
                                            return 0;
                                       }
                                  }
                             }
                             if (player.identity == 'fan') {
                                  if (target.identity == 'fan' && tri.source && tri.source.identity == 'fan' && get.attitude(player, target) > 0) {
                                       if (target.countCards('h') >= 3 && (numt + target.hp) > 0) {
                                            return 1;
                                       } else {
                                            if ((target.countCards('hs') < 3 && tri.source.previous.identity != 'fan') || (numt + target.hp) <= 0) {
                                                 if (player.countCards('hs', 'tao') > 0) return 0;
                                            }
                                       }
                                  }
                                  if (target.identity == 'fan' && tri.source && tri.source.identity != 'fan' && get.attitude(player, target) > 0) {
                                       if (target == player) {
                                            return 1;
                                       } else {
                                            if (target != player) {
                                                 if ((numt + target.hp) > 0) {
                                                      return 1;
                                                 } else {
                                                      if ((numt + target.hp) <= 0) {
                                                           if (player.countCards('hs', 'tao') > 0) return 0;
                                                      }
                                                 }
                                            }
                                       }
                                  }
                                  if (target.identity == 'fan' && !tri.source && get.attitude(player, target) > 0) {
                                       if (target == player) {
                                            return 1;
                                       } else {
                                            if (target != player) {
                                                 if ((numt + target.hp) > 0) {
                                                      return 1;
                                                 } else {
                                                      if ((numt + target.hp) <= 0) {
                                                           if (player.countCards('hs', 'tao') > 0) return 0;
                                                      }
                                                 }
                                            }
                                       }
                                  }
                                  if (target.identity == 'nei' && fan <= 1 && zhong >= 2 && target.hasSkill('AIoptimize_1_tf')) {
                                       if ((numt + target.hp) > 0 && player.hp >= 2) {
                                            return 1;
                                       }
                                  }
                                  if (target.identity == 'zhu' || target.identity == 'zhong') {
                                       return 0;
                                  }
                             }
                        }
                   } else {
                        if (tri && tri.name == 'dying') {
                             if (target == player) {
                                  return 1;
                             }
                             if (target != player && get.attitude(player, target) > 0) {
                                  if ((numt + target.hp) > 0) {
                                       return 1;
                                  } else {
                                       if ((numt + target.hp) <= 0) {
                                            if (player.countCards('hs', 'tao') > 0) return 0;
                                       }
                                  }
                             }
                        }
                   }
                   // if(player==target&&player.hp<=0) return 2;
                   if (player.hasSkillTag('nokeep', true, null, true)) return 2;
                   var nd = player.needsToDiscard();
                   var keep = false;
                   if (nd <= 0) {
                        keep = true;
                   } else if (nd == 1 && target.hp >= 2 && target.countCards('h', 'tao') <= 1) {
                        keep = true;
                   }
                   var mode = get.mode();
                   if (target.hp >= 2 && keep && target.hasFriend()) {
                        if (target.hp > 2 || nd == 0) return 0;
                        if (target.hp == 2) {
                             if (game.hasPlayer(function (current) {
                                  if (target != current && get.attitude(target, current) >= 3) {
                                       if (current.hp <= 1) return true;
                                       if ((mode == 'identity' || mode == 'versus' || mode == 'chess') && current.identity == 'zhu' && current.hp <= 2) return true;
                                  }
                             })) {
                                  return 0;
                             }
                        }
                   }
                   var att = get.attitude(player, target);
                   if (att < 3 && att >= 0 && player != target) return 0;
                   if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
                        if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
                             var num = game.countPlayer(function (current) {
                                  if (current.identity == 'fan') {
                                       return current.countCards('h', 'tao');
                                  }
                             });
                             if (num > 1 && player == target) return 2;
                             return 0;
                        }
                   }
                   if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
                        if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
                             return 0;
                        }
                   }
                   if (mode == 'stone' && target.isMin() && player != target && tri && tri.name == 'dying' && player.side == target.side && tri.source != target.getEnemy()) {
                        return 0;
                   }
                   return 2;
              },
                    },
                    tag:{
                        recover:1,
                        save:1,
                    },
                },
            },
            dcqinqiang:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    player:"useCard",
                    global:"phaseEnd",
                },
                group:["dcqinqiang_core"],
                forced:true,
                priority:0,
                content:function(player,event,trigger){
        if(trigger.name == "phase"){
            var num = player.countMark("dcqinqiang");
            player.removeMark("dcqinqiang",num);
            player.storage.dcqinqiang_mopai = false;
            player.storage.dcqinqiang_jiashang = false;
            event.finish();
            return;
        }
        var cb = 1;
        if(get.color(trigger.card) == 'red'){
            cb = 2;
        }
        if(player.countMark("dcqinqiang_core") != cb){
            var num1 = player.countMark("dcqinqiang_core");
            player.removeMark("dcqinqiang_core",num1);
            player.addMark("dcqinqiang_core",cb,false);
            var num = player.countMark("dcqinqiang");
            player.removeMark("dcqinqiang",num);
        }
        //player.draw(10);
        player.addMark("dcqinqiang",1);
    },
                subSkill:{
                    core:{
                        audio:"dcqinqiang",
                        trigger:{
                            player:"useCardToPlayered",
                        },
                        content:function(event,player,trigger){
            'step 0'
            var list = [];
            if(!player.storage.dcqinqiang_jiashang){
              list.push('加伤');
            }
            if(!player.storage.dcqinqiang_mopai){
              list.push('摸牌');
            }
            if(list.length > 0)
                player.chooseControl(list);
            'step 1'
            player.chat((result.control == '加伤').toString());
            //if(result.bool){
              if(result.control == '加伤'){
                  player.storage.dcqinqiang_jiashang = true;
                var trigger2 = trigger.getParent();
                if (typeof trigger2.baseDamage != 'number') {
                    trigger2.baseDamage = 1;
                    }
                trigger2.baseDamage += player.countMark("dcqinqiang");
              }
              if(result.control == '摸牌'){
                player.storage.dcqinqiang_mopai = true;
                player.draw(player.countMark("dcqinqiang"));
              }
            //}
        },
                        priority:0,
                        sub:true,
                    },
                },
                init:function(player){
        player.storage.dcqinqiang_mopai = false;
        player.storage.dcqinqiang_jiashang = false;
    },
            },
            dcyizhen:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event,player){
        return event.source.countCards('h') > 0 && player.countCards('h') > 0;
    },
                direct:true,
                content:function (event,player,trigger){
        'step 0'
        event.cards = [];
        player.choosePlayerCard(trigger.source,1,'h','visible').set('ai',function(card){
            var player=_status.event.player;
            var trigger=_status.event.getTrigger();
            if(trigger.source&&trigger.source.countCards('h')>0&&get.attitude(player,trigger.source)>0){
                return 10-get.value(card);
            }
            return -1;
        });
        'step 1'
        if(result.bool){
            event.color1 = get.color(result.cards);
            event.cards.push(result.cards[0]);
            trigger.source.choosePlayerCard(player,true,'h','visible');
        }
              'step 2'
              if(result.bool){
              event.cards.push(result.cards[0]);
              if(get.color(result.cards) == event.color1){
                player.gain('gain2',event.cards);
              }else{
                player.discard(event.cards[1]);
                trigger.source.discard(event.cards[0]);
              }
            }
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    if(get.attitude(target,player)>0){
                        if(target.hp<=1) return;
                        if(target.countCards('h')<2) return;
                        return [1,2];
                    }
                }
            },
                    },
                },
                "_priority":0,
            },
            hyweijuchui:{
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function(event,player){
        if(get.type(event.card)=='equip'){
            player.storage.juchui = true;
            return false;
        }else if(get.type(event.card) != 'trick'){
            player.storage.juchui = false;
            return false;
        }
            return event.card&&event.card.name!='du'&&event.getParent().name!='phaseUse'&&player.storage.juchui;
},
                content:function(){
        'step 0'
        player.storage.juchui = false;
/*            player.chooseTarget(get.prompt2('据陲')).set('ai',function(target){
            var player=_status.event.player;
            if(get.attitude(player,target)>0) return 0;
            return get.attitude(player,target);
            });*/
        event.triggerTargets = trigger.targets;
    player.chooseTarget(get.prompt2("据陲"), (card, player, target) => {
        return event.triggerTargets.includes(target);//event.getTrigger().targets.includes(target);
    });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            player.logSkill('hyweijuchui',target);
            if(target.maxHp<=player.maxHp){
                /*if (target.isDamaged()) {
                        player.chooseControl('1', '2').set("prompt", get.translation(event.name) + "：令" + get.translation(target) + "失去(1)或回复(2)1点体力");
                } else {
                    result.control = '1';
                }
                if(result.control == '1')target.loseHp();
                if(result.control == '2')target.recover();*/
                target.loseHp();
            }
        }
    },
                ai:{
                    expose:0.2,
                },
                "_priority":0,
            },
            hyweiguangyong:{
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function(event,player){
        return event.isFirstTarget;
},
                forced:true,
                content:function(){
        if(trigger.targets.includes(player)){
            /*if(player.maxHp<8)*/player.gainMaxHp();
            player.draw();
       }
        if(trigger.targets.some(target => target !== player)){
            if(player.isDamaged()) player.loseMaxHp();
            var targets= trigger.targets;
            var others = targets.filter(function(t) {
            return t != player && t.countCards('he') > 0;
             });
            if(others.length>0){
              var target=others.randomGet();
                player.gainPlayerCard(target, true, "he");    
            }
        }
    },
                "_priority":0,
            },
            dcchushan:{
                trigger:{
                    global:"phaseBefore",
                    player:"enterGame",
                },
                filter:function(event, player) {
        return event.name != "phase" || game.phaseNumber == 0;
    },
                forced:true,
                content:function() {
        'step 0'
        if (!_status.characterlist) lib.skill.pingjian.initList();
        _status.characterlist.randomSort();
        event.characters = _status.characterlist.randomGets(6);
        event.first = event.characters.slice(0, 3);
        event.last = event.characters.slice(3, 6);
        event.skills1 = [];
        event.skills2 = [];
        for (let i of event.first) event.skills1.push(get.character(i, 3).randomGet());
        for (let i of event.last) event.skills2.push(get.character(i, 3).randomGet());
        player
            .chooseControl(event.skills1)
            .set("dialog", [/*无名：*/"请选择姓氏", [event.first, "character"]]);
        'step 1'
        event.gains = [];
        event.surname = event.first[event.skills1.indexOf(result.control)];
        event.gains.add(result.control);
        'step 2'
        player
            .chooseControl(event.skills2)
            .set("dialog", [/*无名：*/"请选择名字", [event.last, "character"]]);
        'step 3'
        event.name = event.last[event.skills2.indexOf(result.control)];
        event.gains.add(result.control);
        let newname = get.characterSurname(event.surname)[0] + get.characterSurname(event.name)[1];
        //if (newname === "某") {
        if (newname.indexOf('某')==0) {
            newname = "无名氏";
            player.chat("终究还是落得藉藉无名...");
        }
        game.broadcastAll(
            (player, name, list) => {
                var ids='dc_noname_'+player.playerid;
                lib.translate[ids]=name;
                lib.character[ids]=lib.character['dc_noname'];
                lib.character[ids][3]=lib.character['dc_noname'][3].concat(event.gains);
                lib.character[ids][4].add('character:dc_noname');
                if (player.name == "dc_noname" || player.name1 == "dc_noname") {
                    player.node.name.innerHTML = name;
                    if(player.name == "dc_noname") player.name=ids;
                    if(player.name1 == "dc_noname") player.name1=ids;
                }
                if (player.name2 == "dc_noname") {
                    player.node.name2.innerHTML = name;
                    player.name2=ids;
                }
                /*player.tempname.addArray(
                    list.map(name => {
                        while (get.character(name).tempname.length > 0) {
                            name = get.character(name).tempname[0];
                        }
                        return name;
                    })
                );*/
            },
            player,
            newname,
            [event.surname, event.name]
        );
        'step 4'
        player.addSkillLog(event.gains);
    },
                "_priority":0,
            },
            twguanhuo:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    player:"useCardAfter",
                },
                filter:function (event, player) {
        return event.card.storage && event.card.storage.jsrgguanhuo && !game.hasPlayer2(current => {
            return current.hasHistory('damage', evt => evt.card == event.card);
        });
    },
                forced:true,
                locked:false,
                group:["twguanhuo_viewas","twguanhuo_draw"],
                content:function () {
        'step 0'
        var count = player.getHistory('useSkill', evt => evt.skill == 'twguanhuo_viewas').length;
        if (count == 1) {
            player.addTempSkill('twguanhuo_ex', 'phaseUseAfter');
            player.addMark('twguanhuo_ex', 1, false);
            trigger.targets.forEach(i => i.removeSkill('huogong2'));
        }
        else {
            player.removeSkill('twguanhuo');
            game.log(player, '失去了技能', '#g【观火】');
        }
    },
                ai:{
                    effect:{
                        player:function (card, player) {
                if (_status.event.getParent().skill == 'twguanhuo_viewas' && player.getHistory('useSkill', evt => evt.skill == 'jsrgguanhuo_viewas').length == 1) return 'zeroplayertarget';
                if (_status.event.type == 'phase' && _status.event.skill == 'twguanhuo_viewas' && player.getHistory('useSkill', evt => evt.skill == 'twguanhuo_viewas').length > 1 && player.countCards('h') <= 3) return [0, 0];
            },
                    },
                },
                subSkill:{
                    viewas:{
                        audio:"twguanhuo",
                        enable:"phaseUse",
                        viewAs:{
                            name:"huogong",
                            isCard:true,
                            storage:{
                                jsrgguanhuo:true,
                            },
                        },
                        filterCard:() => false,
                        selectCard:-1,
                        prompt:"视为使用一张【火攻】",
                        ai:{
                            order:function (item, player) {
                    return get.order({ name: 'huogong' }) + 0.01;
                },
                            basic:{
                                order:4,
                                value:[3,1],
                                useful:1,
                            },
                            wuxie:function (target, card, player, current, state) {
                      if ((get.attitude(current, player) >= 0 && state > 0) || target.hp >= 2) return false;
                 },
                            result:{
                                player:function (player) {
                           var nh = player.countCards('h');
                           if (nh <= player.hp && nh <= 4 && _status.event.name == 'chooseToUse') {
                                if (typeof _status.event.filterCard == 'function' && _status.event.filterCard({
                                     name: 'huogong'
                                }, player, _status.event)) {
                                     return -10;
                                }
                                if (_status.event.skill) {
                                     var viewAs = get.info(_status.event.skill).viewAs;
                                     if (viewAs == 'huogong') return -10;
                                     if (viewAs && viewAs.name == 'huogong') return -10;
                                }
                           }
                           if (player.countCards('h') <= 1) return "zeroplayertarget";
                           return 0;
                      },
                                target:function (player, target) {
                           var zhong = get.population('zhong')
                           var fan = get.population('fan')
                           var hzdy = game.countPlayer(function (current) {
                                return current.isLinked() && !current.hasSkillTag('nodamage') && get.attitude(current, player) > 0;
                           });
                           var hzdr = game.countPlayer(function (current) {
                                return current.isLinked() && !current.hasSkillTag('nodamage') && get.attitude(current, player) <= 0;
                           });
                           var hzdyf = game.countPlayer(function (current) {
                                return current.isLinked() && !(current.hasSkillTag('nodamage') || current.hasSkillTag('nofire')) && get.attitude(current, player) > 0;
                           });
                           var hzdrf = game.countPlayer(function (current) {
                                return current.isLinked() && !(current.hasSkillTag('nodamage') || current.hasSkillTag('nofire')) && get.attitude(current, player) <= 0;
                           });
                           var hzdyt = game.countPlayer(function (current) {
                                return current.isLinked() && !(current.hasSkillTag('nodamage') || current.hasSkillTag('nothunder')) && get.attitude(current, player) > 0;
                           });
                           var hzdrt = game.countPlayer(function (current) {
                                return current.isLinked() && !(current.hasSkillTag('nodamage') || current.hasSkillTag('nothunder')) && get.attitude(current, player) <= 0;
                           });
                           var cxhzdyf = game.countPlayer(function (current) {
                                return current.isLinked() && !(current.hasSkillTag('nodamage') || current.hasSkillTag('nofire')) && current.hp <= 1 && get.attitude(current, player) > 0;
                           });
                           var cxhzdyt = game.countPlayer(function (current) {
                                return current.isLinked() && !(current.hasSkillTag('nodamage') || current.hasSkillTag('nothunder')) && current.hp <= 1 && get.attitude(current, player) > 0;
                           });
                           if (target.isLinked()) {
                                if (hzdyf >= hzdrf && cxhzdyf >= 1) {
                                     return 0;
                                }
                                if (get.mode() == 'identity') {
                                     if (player.identity == 'zhong' && game.zhu.isLinked() && game.zhu.hp <= 3 && !(game.zhu.hasSkillTag('nodamage') || game.zhu.hasSkillTag('nofire'))) {
                                          return 0;
                                     }
                                     if (player.identity == 'zhu' && cxhzdyf >= 1) {
                                          return 0;
                                     }
                                     if (player.identity == 'nei' && game.zhu.isLinked() && game.zhu.hp <= 3 && (zhong > 0 || fan > 0)) {
                                          return 0;
                                     }
                                     if (player.identity == 'nei' && player.isLinked() && player.hp <= 2 && target.identity != 'zhu') {
                                          return 0;
                                     }
                                }
                           }
                           if (target.hasSkill('huogong2') || target.countCards('h') == 0) return "zeroplayertarget";
                           if (player.countCards('h') <= 2) return 0;
                           if (player.countCards('h') <= 1) return "zeroplayertarget";
                           if (target == player) {
                                if (typeof _status.event.filterCard == 'function' && _status.event.filterCard({
                                     name: 'huogong'
                                }, player, _status.event)) {
                                     return -1.5;
                                }
                                if (_status.event.skill) {
                                     var viewAs = get.info(_status.event.skill).viewAs;
                                     if (viewAs == 'huogong') return -1.15;
                                     if (viewAs && viewAs.name == 'huogong') return -1.15;
                                }
                                return 0;
                           }
                           if (get.attitude(player, target) > 0) return -1.5;
                           return -1.15;
                      },
                            },
                            tag:{
                                damage:1,
                                fireDamage:1,
                                natureDamage:1,
                                norepeat:1,
                                discard:0.5,
                            },
                        },
                        sub:true,
                    },
                    ex:{
                        trigger:{
                            source:"damageBegin1",
                        },
                        filter:function (event, player) {
                return event.card && event.card.name == 'huogong' && event.getParent().type == 'card';
            },
                        forced:true,
                        charlotte:true,
                        onremove:true,
                        intro:{
                            content:"当你造成渠道为【火攻】的伤害时，此伤害+#",
                        },
                        content:function () {
                trigger.num += player.countMark('twguanhuo_ex');
            },
                        sub:true,
                    },
                    draw:{
                        audio:"twguanhuo",
                        forced:true,
                        trigger:{
                            player:"useCard",
                        },
                        filter:function(event,player){
               return event.card.name == "huogong";
           },
                        content:function(player){
               player.draw();
           },
                        sub:true,
                    },
                },
            },
            twjuxia:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    target:"useCardToTargeted",
                },
                usable:1,
                group:"twjuxia_g",
                countSkill:function (player) {
        return player.getSkills(null, false, false).filter(function (skill) {
            var info = get.info(skill);
            if (!info || info.charlotte) return false;
            if (info.zhuSkill) return player.hasZhuSkill(skill);
            return true;
        }).length;
    },
                filter:function (event, player) {
        return event.player != player && lib.skill.twjuxia.countSkill(event.player) > lib.skill.twjuxia.countSkill(player);
    },
                direct:true,
                content:function () {
        'step 0'
        var goon = get.effect(player, trigger.card, trigger.player, trigger.player) < 1;
        if (goon && !event.isMine() && !event.isOnline()) game.delayx();
        player.chooseBool('是否发动【居下】？', '令' + get.translation(trigger.card) + '对你无效，然后你摸两张牌').set('ai', () => {
            return _status.event.goon;
        }).set('goon', goon);
        'step 1'
        if (result.bool) {
            player.logSkill('twjuxia', player);
            trigger.excluded.add(player);
            player.draw(2);
        }
        else player.storage.counttrigger.twjuxia--;
    },
                ai:{
                    effect:{
                        target:function (card, player, target) {
                if (lib.skill.twjuxia.countSkill(target) >= lib.skill.jsrgjuxia.countSkill(player)) return;
                if (card && (card.cards || card.isCard) && get.attitude(target, player) > 0 && (!target.storage.counttrigger || !target.storage.counttrigger.twjuxia)) return [0, 0.5, 0, 0.5];
            },
                    },
                },
                subSkill:{
                    g:{
                        audio:"twjuxia",
                        forced:true,
                        trigger:{
                            player:"phaseBegin",
                            sub:true,
                        },
                        content:function(event,player){
            'step 0'
            if(!player.hasSkill("twguanhuo")){
                    player.chooseBool('是否发动【居下】？', '你获得【观火】').set('ai', () => {
            return _status.event.goon;
        }).set('goon', goon);
            }
            'step 1'
            if(result.bool){
                player.addSkill("twguanhuo");
            }
        },
                        sub:true,
                    },
                },
            },
            oldlianjie:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                mod:{
                    aiOrder:function (player, card, num) {
            var number = get.number(card, player);
            if (player.countCards('h') < player.maxHp) {
                return num + number / 10;
            }
        },
                    targetInRange:function (card) {
if (card.cards) {
for (var i of card.cards) {
if (i.hasGaintag("oldlianjie")) return true;
}
}
},
                    cardUsable:function (card) {
if (card.cards) {
for (var i of card.cards) {
if (i.hasGaintag("oldlianjie")) return Infinity;
}
}
},
                },
                group:["oldlianjie_d"],
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function (event, player) {
        if (!game.hasPlayer(current => {
            return current.countCards("h");
        }) || !player.hasHistory("lose", evt => {
            if (evt.getParent() != event.getParent()) return false;
            return event.cards.some(card => (evt.hs || []).includes(card));
        })) return false;
        const num = get.number(event.card, player) || 0;
        if (player.countCards("h", card => {
            return get.number(card, player) < num;
        }) || !player.countCards("h")) return false;
        return game.hasPlayer(current => {
            return !current.storage.canlianjie;
        }) && event.isFirstTarget;
    },
                "prompt2":function (event, player) {
        if (player.countCards("h") < player.maxHp) return "你可以将一名角色手牌中点数最小的牌置于牌堆底，然后若你将手牌摸至体力上限";
        return "你可以将一名角色手牌中点数最小的牌置于牌堆底";
    },
                content:function () {
        "step 0"
        player.chooseTarget(get.prompt2(event.name), "你可以将一名角色手牌中点数最小的牌置于牌堆底", function (card, player, target) {
            return target.countCards("h") && !target.storage.canlianjie;
        }).set('ai', function (target) {
            var player = _status.event.player;
            if (player.countCards("h") >= player.maxHp && player == target) return 2;
            if (get.attitude(player, target) < 0) return 1;
        });
        "step 1"
        if (result.bool) {
            var target = result.targets[0];
            var cards = target.getCards("h"), minNumber = cards.map(card => get.number(card)).sort((a, b) => a - b)[0];
            var toLose = cards.filter(card => {
                return get.number(card) === minNumber;
            }).randomSort();
            target.lose(toLose[0], ui.cardPile);
            game.broadcastAll(function (player) {
                var cardx = ui.create.card();
                cardx.classList.add("infohidden");
                cardx.classList.add("infoflip");
                player.$throw(cardx, 1000, "nobroadcast");
                target.storage.canlianjie = true;
                target.addTempSkill("oldlianjie_c");
                target.addMark("oldlianjie_c",1);
            }, target);
        } else event.finish();
        "step 2"
        game.delayx();
        "step 3"
        if (player.countCards("h") < player.maxHp) player.draw(player.maxHp - player.countCards('h')).set('gaintag', ['oldlianjie']);
    },
                subSkill:{
                    c:{
                        charlotte:true,
                        onremove:function (player) {
                player.storage.canlianjie = false;
                player.removeMark("oldlianjie_c",1);
            },
                        intro:{
                            content:(storage, player) => `本回合不能再成为连捷的目标`,
                        },
                        sub:true,
                    },
                    d:{
                        charlotte:true,
                        trigger:{
                            player:"phaseEnd",
                        },
                        forced:true,
                        content:function(){
                player.removeGaintag("oldlianjie");
            },
                        sub:true,
                    },
                },
                init:function(){
        var targets = game.filterPlayer();
        for(var i = 0;i < targets.length;i++){
            targets[i].storage.canlianjie = false;
        }
    },
            },
            oldjiangxian:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                enable:"phaseUse",
                limited:true,
                animationColor:"water",
                content:function () {
        player.awakenSkill("oldjiangxian");
        player.addTempSkill("oldjiangxian_oldlianjie");
        player.addTempSkill("oldjiangxian_1");
    },
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseJieshuBegin",
                        },
                        charlotte:true,
                        forced:true,
                        popup:false,
                        filter:function (event, player) {
                return ["dcchaozhen", "oldlianjie"].some(skill => player.hasSkill(skill, null, null, false));
            },
                        content:function () {
                "step 0"
                player.chooseButton(['请选择失去一个技能', [
                    [
                        ['dcchaozhen', '失去【朝镇】'],
                        ['oldlianjie', '失去【连捷】'],
                    ], 'textbutton'
                ]], true).set('filterButton', function (button) {
                    var player = _status.event.player;
                    if (button.link == 'dcchaozhen' && !player.hasSkill('dcchaozhen')) return false;
                    if (button.link == 'oldlianjie' && !player.hasSkill('oldlianjie')) return false;
                    return true;
                }).set('ai', function (button) {
                    var player = _status.event.player;
                    if (button.link == 'oldlianjie' && player.hp > 2) return 2;
                    if (button.link == 'dcchaozhen') return 1;
                }).set('selectButton');
                "step 1"
                if (result.bool) {
                    var choices = result.links;
                    if (choices.contains('dcchaozhen')) {
                        player.removeSkill('dcchaozhen');
                    }
                    if (choices.contains('oldlianjie')) {
                        player.removeSkill('oldlianjie');
                    }
                }
            },
                        sub:true,
                    },
                    oldlianjie:{
                        charlotte:true,
                        mark:true,
                        intro:{
                            content:"本回合因使用【连捷】摸的牌造成的伤害+X（X为你本回合造成伤害的次数且至多为5），回合结束后失去“连捷”",
                        },
                        trigger:{
                            source:"damageBegin1",
                        },
                        filter:function (event, player) {
                if (!player.hasHistory("lose", evt => {
                    let gaintag = false;
                    if (evt.getParent() != event.getParent('useCard')) return false;
                    for (var i in evt.gaintag_map) {
                        if (evt.gaintag_map[i].includes("oldlianjie")) gaintag = true;
                    }
                    return gaintag && event.cards.some(card => (evt.hs || []).includes(card));
                })) return false;
                return player.getHistory("sourceDamage").length > 0;
            },
                        direct:true,
                        content:function (event, trigger, player) {
                trigger.num += Math.min(5, player.getHistory("sourceDamage").length);
            },
                        sub:true,
                    },
                },
                ai:{
                    order:10,
                    threaten:2.9,
                    result:{
                        player:function (player) {
                if (!game.hasPlayer(current => get.attitude(player, current) < 0)) return 0;
                return player.countCards("h", card => card.hasGaintag("oldlianjie") && player.hasUseTarget(card)) > 2 ? 4 : 0;
            },
                    },
                },
                mark:true,
                intro:{
                    content:"limited",
                },
                skillAnimation:false,
                init:function (player, skill) {
        player.storage[skill] = false;
    },
            },
            sxrmmiehai:{
                audio:"ext:手杀武将/apk/还原武将:true",
                enable:"chooseToUse",
                filterCard:true,
                selectCard:2,
                usable:3,
                position:"hes",
                viewAs:{
                    name:"sha",
                    nature:"stab",
                    storage:{
                        miehai:true,
                    },
                },
                complexCard:true,
                filter:function(event, player) {
        return player.countCards("hes") >= 2;
    },
                prompt:"将两张牌当刺【杀】使用或打出",
                precontent:function(event, trigger, player) {
        "step 0"
         player.addSkill("sxrmmiehai_d");
        var targets = game.filterPlayer();
        for(var target of targets)
                target.addSkill("sxrmmiehai_r");
         player.chooseBool(get.prompt2("灭害")).set('prompt','是否摸2张牌？');
        "step 1"
        if(result.bool){
            player.draw(2);
        }
    },
                check:function(card) {
        let player = _status.event.player;
        let val = get.value(card);
        if (get.suit(card) == "spade" && player.isDamaged()) {
            val *= 0.6;
        }
        return Math.max(5, 8 - 0.7 * player.hp) - val;
    },
                ai:{
                    order:function(item, player) {
            return get.order({ name: "sha" }) + 0.1;
        },
                    yingbian:function (card, player, targets, viewer) {
              if (get.attitude(viewer, player) <= 0) return 0;
              var base = 0,
                   hit = false;
              if (get.cardtag(card, 'yingbian_hit')) {
                   hit = true;
                   if (targets.filter(function (target) {
                        return target.hasShan() && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.nature(card)) > 0;
                   })) base += 5;
              }
              if (get.cardtag(card, 'yingbian_all')) {
                   if (game.hasPlayer(function (current) {
                        return !targets.contains(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                   })) base += 5;
              }
              if (get.cardtag(card, 'yingbian_damage')) {
                   if (targets.filter(function (target) {
                        return get.attitude(player, target) < 0 && (hit || !target.mayHaveShan() || player.hasSkillTag('directHit_ai', true, {
                             target: target,
                             card: card,
                        }, true)) && !target.hasSkillTag('filterDamage', null, {
                             player: player,
                             card: card,
                             jiu: true,
                        })
                   })) base += 5;
              }
              return base;
         },
                    canLink:function (player, target, card) {
              if (!target.isLinked() && !player.hasSkill('wutiesuolian_skill')) return false;
              if (target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                   target: target,
                   card: card,
              }, true)) return false;
              if (player.hasSkill('jueqing') || player.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
              return true;
         },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    result:{
                        target:function (player, target, card, isLink) {
                   var eff = function () {
                        if (!isLink && player.hasSkill('jiu')) {
                             if (!target.hasSkillTag('filterDamage', null, {
                                  player: player,
                                  card: card,
                                  jiu: true,
                             })) {
                                  if (get.attitude(player, target) > 0) {
                                       return -7;
                                  } else {
                                       return -4;
                                  }
                             }
                             return -0.5;
                        }
                        return -1.5;
                   }();
                   if (!isLink && !player.hasSkillTag('directHit_ai', true, {
                        target: target,
                        card: card,
                   }, true)) return eff / 1.2;
                   return eff;
              },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function (card) {
                   if (card.nature == 'poison') return;
                   return 1;
              },
                        natureDamage:function (card) {
                   if (card.nature) return 1;
              },
                        fireDamage:function (card, nature) {
                   if (card.nature == 'fire') return 1;
              },
                        thunderDamage:function (card, nature) {
                   if (card.nature == 'thunder') return 1;
              },
                        poisonDamage:function (card, nature) {
                   if (card.nature == 'poison') return 1;
              },
                    },
                },
                locked:false,
                mod:{
                    targetInRange:function(card) {
            if(card.storage.miehai)
                return true;
        },
                    cardUsable:function(card, player, num) {
            if (card.storage.miehai) {
                return Infinity;
            }
        },
                },
                subSkill:{
                    d:{
                        forced:true,
                        trigger:{
                            player:"useCardToPlayered",
                        },
                        content:function(player,trigger,event){
                "step 0"
                event.targets = trigger.targets.filter(current => current !== player).sortBySeat();
                if(event.targets.length > 0){
                    player.chooseBool(get.prompt2("灭害")).set('prompt','是否令此牌目标摸2张牌？'); 
                }
                "step 1"
                if(result.bool){
                    for(var i = 0;i < event.targets.length;i++){
                        event.targets[i].draw(2);
                    }
                }
                       const targets = game.filterPlayer(current => {
                        return current.getHistory("lose", evt => {
                            const cards = evt.cards2;
                            if (!evt.getParent(evt => evt == trigger, true, true) || !cards.some(card => get.suit(card) == "spade")) {
                                return false;
                            }
                            return evt.visible;
                        }).length && current.storage.sxrmmiehai_r;
                    });
             if(targets.length > 0){
                   for(var i = 0;i < targets.length;i++){
                        targets[i].recover();
                        targets[i].storage.sxrmmiehai_r = false;
                    }
             }
             player.removeSkill("sxrmmiehai_d");
             var tg = game.filterPlayer();
             for(var i = 0;i < tg.length;i++){
                 tg[i].removeSkill("sxrmmiehai_r");
             }
            },
                        sub:true,
                    },
                    r:{
                        forced:true,
                        trigger:{
                            player:"loseAfter",
                        },
                        content:function(trigger,player){
                if(trigger.cards.some(card => get.suit(card) == "spade")){
                    player.storage.sxrmmiehai_r = true;
                }
            },
                        sub:true,
                    },
                },
            },
            qiangyi:{
                enable:"phaseUse",
                charlotte:true,
                superCharlotte:true,
                filter:function(event,player){
        return player==game.zhu&&game.hasPlayer(function(current){
            return lib.skill.qiangyi.filterTarget(null,player,current);
        });
    },
                filterTarget:function(card,player,target){
        return player!=target&&!target.storage.qiangyi&&target.countGainableCards(player,'h')>0;
    },
                content:function(){
        'step 0'
        player.gainPlayerCard(target,1,'h',true);
        target.storage.qiangyi=true;
        'step 1'
        if(!result.bool||!result.cards.length){
            event.finish();return;
        }
        var num=1;
        var hs=player.getCards('h');
        if(hs.length){
            if(hs.length<=num) event._result={bool:true,cards:hs};
            else player.chooseCard('he',true,num,'选择交给'+get.translation(target)+get.cnNumber(num)+'张牌');
        }
        else event.finish();
        'step 2'
        if(result.bool&&result.cards&&result.cards.length) player.give(result.cards,target);
    },
                ai:{
                    skillTagFilter:function(player,tag,target){
            if(player==target||player.identity!='fan'||target.identity!='fan') return false;
        },
                },
            },
            hyjixin:{
                trigger:{
                    player:"useCardAfter",
                },
                filter:function(event, player) {
        const name = event.card.name;
        return name && player.getHistory("useCard", evt => evt.card.name === event.card.name).indexOf(event) === 0;
    },
                content:function(event, trigger, player) {
        const skill = "hyjixin_count";
        player.addTempSkill(skill, "roundStart");
        player.addMark(skill, 1, false);
        const num = player.countMark(skill);
        const result = get.cards(num);
        player.gain(result,'draw');
        //player.addGaintag(result,"hyjixin");
        player.showCards(get.translation(player) + "发动了【技新】", result);
        player.addGaintag(result, "hyjixin");
        result.forEach(card => {
            card.storage["hyjixin"] = true;
        });
        player.addSkill("hyjixin_effect");
    },
                init:function(player, skill) {
        player.addSkill("hyjixin_mark");
    },
                onremove:function(player, skill) {
        delete player.storage[skill];
        player.removeSkill(`${skill}_mark`);
        player.removeSkill(`${skill}_count`);
    },
                subSkill:{
                    mark:{
                        charlotte:true,
                        onremove:true,
                        trigger:{
                            player:"useCard1",
                        },
                        forced:true,
                        silent:true,
                        content:function(event, trigger, player) {
                player.markAuto(event.name, [trigger.card.name]);
            },
                        marktext:"新",
                        intro:{
                            content:"本局游戏已使用牌名：$",
                        },
                        sub:true,
                        popup:false,
                        "_priority":1,
                    },
                    count:{
                        charlotte:true,
                        onremove:true,
                        mark:true,
                        marktext:"技",
                        intro:{
                            content:"本轮已发动过$次〖技新〗",
                        },
                        sub:true,
                        "_priority":0,
                    },
                    effect:{
                        charlotte:true,
                        onremove:function(player, skill) {
                player.removeGaintag(skill);
            },
                        trigger:{
                            player:"useCard0",
                        },
                        filter:function(event, player) {
                if (event.addCount === false) {
                    return false;
                }
                return player.hasHistory("lose", evt => {
                    if (evt.getParent() !== event) {
                        return false;
                    }
                    return Object.values(evt.gaintag_map).flat().includes("hyjixin_effect");
                });
            },
                        forced:true,
                        popup:false,
                        firstDo:true,
                        content:function(event, trigger, player) {
                trigger.addCount = false;
                const stat = player.getStat().card,
                    name = trigger.card.name;
                if (typeof stat[name] == "number") {
                    stat[name]--;
                }
            },
                        mod:{
                            targetInRange:function(card, player, target) {
                    if (get.number(card) === "unsure" || card.storage.hyjixin) {
                        return true;
                    }
                },
                            cardUsable:function(card, player, num) {
                    if (get.number(card) === "unsure" || card.storage.hyjixin) {
                        return Infinity;
                    }
                },
                            ignoredHandcard:function(card, player) {
                    if (card.storage.hyjixin) {
                        return true;
                    }
                },
                            cardDiscardable:function(card, player, name) {
                    if (name == "phaseDiscard" && card.storage.hyjixin) {
                        return false;
                    }
                },
                        },
                        sub:true,
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            hyqinyi:{
                trigger:{
                    source:"damageSource",
                    player:"damageEnd",
                },
                filter:function(event, player, name) {
        const evt = name === "damageSource" ? "sourceDamage" : "damage";
        return player.getHistory(evt).indexOf(event) == 0;
    },
                init:function (player) {
        if (!player.storage.hyqinyi) player.storage.hyqinyi = []
    },
                content:function(event, trigger, player) {
       'step 0'
       var list = [];
        for (var i = 0; i < lib.inpile.length; i++) {
            var name = lib.inpile[i];
            if (player.getStorage('hyqinyi').contains(name)) continue;
            if (name == 'sha') {
                list.push(['基本', '', 'sha']);
                for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
            }
            else if (get.type(name) == 'trick') list.push(['锦囊', '', name]);
            else if (get.type(name) == 'basic') list.push(['基本', '', name]);
        }
        if (list.length) {
            player.chooseButton([get.prompt('hyqinyi', trigger.player), [list, 'vcard']], 1).set('ai', button => {
                if (_status.event.tochoose) return _status.event.getTrigger().player.getUseValue({ name: button.link[2] });
                return 0;
            }).set('tochoose', get.attitude(player, trigger.player) >= 0 && trigger.player.hasCard(card => {
                return get.value(card) < 8;
            }, 'hes')).set('filterButton', (button) => {
                var list = ui.selected.buttons;
                if (list.length) {
                    for (var i of list) {
                        if (get.name(i) == 'sha') return get.name(button) != 'sha'
                    }
                }
                return true;
            });
        } else {
            event.finish();
        }
        'step 1'
        if (result.bool) {
            var list = result.links, list2 = [];
            for (var i of result.links) {
                list2.add(i[2]);
            }
            player.storage.hyqinyi = player.storage.hyqinyi.concat(list2);
               if (!player.hasUseTarget(list2[0], false)) return;
                    player.chooseUseTarget(`请使用${get.translation(list2[0])}牌`, list2[0], "nodistance").set("targetRequired", target).set("ai", function () {
                        return get.attitude(player, target) > 0 ? 1 : 0;
                    }).set('forced', false).set('addCount', false);
        }
    },
                marktext:"艺",
                intro:{
                    content:"已以此法使用过$",
                },
                "_priority":0,
            },
            pejiwei:{
                trigger:{
                    global:"phaseEnd",
                },
                isFirst:function(target) {
        if (game.hasPlayer2(current => current.getSeatNum() > 0, true)) {
            return target.getSeatNum() == 1;
        }
        return target == _status.roundStart;
    },
                forced:true,
                juexingji:true,
                skillAnimation:false,
                animationColor:"thunder",
                filter:function(event, player) {
        const taofen = game.findPlayer2(current => get.info("pejiwei").isFirst(current), true);
        return taofen && player.countMark("hyjixin_count") >= taofen.hp;
    },
                content:function(event, trigger, player) {
        'step 0'
        player.awakenSkill('pejiwei');
        player.gainMaxHp();
        'step 1'
        player.recover(player.maxHp - player.hp);
        var target = player;
        event.target = target;
        player.line(target, 'green');
        var list = [];
        if (!_status.characterlist) {
            if (_status.connectMode) var list = get.charactersOL();
            else {
                var list = [];
                for (var i in lib.character) {
                    if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
                    list.push(i);
                }
            }
            game.countPlayer2(function (current) {
                list.remove(current.name);
                list.remove(current.name1);
                list.remove(current.name2);
                if (current.storage.rehuashen && current.storage.rehuashen.character) list.removeArray(current.storage.rehuashen.character)
            });
            _status.characterlist = list;
        }
        _status.characterlist.randomSort();
        var chara = [];
        var skills = [];
        for (var i of _status.characterlist) {
            var character = lib.character[i];
            if (character && character[3]) {
                for (var j of character[3]) {
                    if (skills.contains(j) || target.hasSkill('j')) continue;
                    var info = get.info(j);
                    if (info && info.zhuSkill && lib.character[i][1] == "wei") {
                        skills.add(j);
                        chara.add(i);
                        continue;
                    }
                }
            }
            if (skills.length >= 5) break;
        }
        if (!skills.length) { event.finish(); return }
        event.chara = chara;
        event.skills = skills;
        //player.chooseControl(skills).set('dialog', ['选择令' + get.translation(target) + '获得一个技能', [chara, 'character']]);
        'step 2'
        for(var i=0;i<5;i++){
             event.target.addSkillLog(event.skills[i]);
            event.target.storage["zhuSkill_pejiwei"+i.toString()]=[event.skills[i]];
             //target.setAvatarQueue(target.name1 || target.name, [event.chara[event.skills.indexOf(event.skills[i])]]);
        }
    },
                ai:{
                    combo:"hyjixin",
                },
                "_priority":0,
            },
            twzaoxian:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                forced:true,
                trigger:{
                    player:"removeMark",
                },
                filter:function(event, player) {
      return player.storage.usemark > 0;
    },
                content:function(event, trigger, player) {
        event.number = player.storage.usemark;
                   var get_card = [];
                   var card = 0;
                       if(event.number >= 2){
                           card = get.discardPile((card2) => get.name(card2) == "wuzhong");
                           if(card){
                               get_card.push(card);
                           }
                      if(event.number >= 4){
                           card = get.discardPile((card2) => get.name(card2) == "wugu");
                           if(card){
                               get_card.push(card);
                           }
                          if(event.number >= 6){
                           card = get.discardPile((card2) => get.name(card2) == "wuxie");
                           if(card){
                               get_card.push(card);
                           }
                          }
                          }
                       }
                   if(card != 0){
                       player.gain(get_card,"gain2");
                   }
        player.storage.usemark = 0;
    },
            },
            dcquanshi:{
                audio:"ext:手杀武将/apk/还原武将:2",
                mark:true,
                zhuanhuanji:true,
                marktext:"☯",
                intro:{
                    content:function(storage) {
            return "每回合限一次，你使用牌时可令此牌不可响应，" + (!storage ? "摸此牌名字数张牌，若此牌造成伤害" : "弃此牌名字数张牌，若此牌未造成伤害") + "此技能视为未发动过。";
        },
                },
                trigger:{
                    player:"useCard",
                },
                check:function(event, player) {
        const storage = player.storage.dcquanshi;
        if (!storage) {
            return player.isPhaseUsing() ? get.tag(event.card, "damage") && get.type(event.card) != "delay" : true;
        }
        return lib.skill.dcweidang.getLength(event.card) < 3 && player.isPhaseUsing() && player.hasCard(card => get.tag(card, "damage") && get.type(card) != "delay" && player.hasUseTarget(card, true, true), "hs");
    },
                filter:function(event,player){
        return !player.hasSkill("dcquanshi_block");
    },
                content:function(event, trigger, player) {
        if(player.hasSkill("dcquanshi_block")){
            event.finish();
            return;
        }
        player.addSkill("dcquanshi_block");
        const storage = player.storage[event.name];
        const { card } = trigger;
        player.changeZhuanhuanji(event.name);
        trigger.directHit.addArray(game.players);
        game.log(card, "不可被响应");
        const num = lib.skill.dcweidang.getLength(card);
        if (!storage) {
            player.draw(num);
            player.addSkill("dcquanshi_rb");
            player.addSkill("dcquanshi_end");
        } else {
            player.chooseToDiscard("he", num, true);
            player.addSkill("dcquanshi_ra");
            player.addSkill("dcquanshi_rc");
        }
    },
                subSkill:{
                    block:{
                        forced:true,
                        charlotte:true,
                        trigger:{
                            global:"phaseEnd",
                        },
                        content:function(){
                player.removeSkill("dcquanshi_block");
            },
                        sub:true,
                    },
                    rb:{
                        forced:true,
                        charlotte:true,
                        trigger:{
                            source:"damageSource",
                        },
                        content:function(){
                player.removeSkill("dcquanshi_block");
                player.removeSkill("dcquanshi_rb");
            },
                        sub:true,
                    },
                    rc:{
                        forced:true,
                        charlotte:true,
                        trigger:{
                            source:"damageSource",
                        },
                        content:function(){
                player.removeSkill("dcquanshi_rc");
            },
                        sub:true,
                    },
                    ra:{
                        forced:true,
                        charlotte:true,
                        trigger:{
                            player:"useCardAfter",
                        },
                        content:function(){
                if(player.hasSkill("dcquanshi_rc")){
                    player.removeSkill("dcquanshi_block");
                }
                player.removeSkill("dcquanshi_rc");
                player.removeSkill("dcquanshi_ra");
            },
                        sub:true,
                    },
                    end:{
                        forced:true,
                        charlotte:true,
                        trigger:{
                            player:"useCardAfter",
                        },
                        content:function(){
                player.removeSkill("dcquanshi_rb");
                player.removeSkill("dcquanshi_end");
            },
                        sub:true,
                    },
                },
                "skill_id":"dcquanshi",
                "_priority":0,
            },
            dcczchouxi:{
                audio:"ext:手杀武将/apk/还原武将:2",
                enable:"phaseUse",
                limited:true,
                group:"dcczchouxi_c",
                skillAnimation:false,
                animationColor:"thunder",
                trigger:{
                    player:"damageEnd",
                },
                chooseButton:{
                    dialog:function (event, player) {
            var list = [];
            for (var name of lib.inpile) {
                var card = {name:name,isCard:true};
                if(lib.skill.dcweidang.getLength(card) > player.countMark("dcczchouxi") + 1)continue;
                var info = lib.card[name];
                if (!info || info.notarget || /*(info.selectTarget && info.selectTarget != 1) ||*/ !get.tag({ name: name }, "damage")) continue;
                if (name == "sha") {
                    list.push(["基本", "", "sha"]);
                    for (var nature of lib.inpile_nature) list.push(["基本", "", name, nature]);
                } else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
                else if (get.type(name) == "basic") list.push(["基本", "", name]);
            }
            return ui.create.dialog("仇隙", [list, "vcard"]);
        },
                    check:function (button) {
            var name = button.link[2];
            return name == 'sha' ? 2.5 : 0;
            return name == 'huogong' ? 2 : 0;
        },
                    backup:function (links, player) {
            return {
                viewAs: {
                    name: links[0][2],
                    nature: links[0][3],
                    storage: { dcczchouxi: true },
                    isCard: true,
                },
                filterCard: () => false,
                selectCard: -1,
                popname: true,
                precontent: function () {
                    var skill = 'dcczchouxi';
                    player.addMark("dcczchouxi",1,false);
                      player.addSkill("dcczchouxi_effect");
                    player.awakenSkill(skill, true);
                },
            }
        },
                    prompt:function (links, player) {
            return '请选择' + get.translation(links[0][2]) + '的目标';
        },
                },
                mod:{
                    cardUsable:function(card, player) {
            if (card?.storage?.dcczchouxi) {
                return Infinity;
            }
        },
                },
                subSkill:{
                    effect:{
                        trigger:{
                            player:"loseAfter",
                            global:"loseAsyncAfter",
                        },
                        forced:true,
                        charlotte:true,
                        filter:function(event, player) {
                const cards = event.getl?.(player)?.hs;
                return event.type == "discard" && cards?.length >= player.countCards("h");
            },
                        content:function () {
                player.restoreSkill("dcczchouxi");
                game.log(player, "重置了", "#g【仇隙】");
            },
                        sub:true,
                    },
                    c:{
                        forced:true,
                        charlotte:true,
                        trigger:{
                            player:"roundStart",
                        },
                        content:function(){
                var num = player.countMark("dcczchouxi");
                player.removeMark("dcczchouxi",num);
            },
                        sub:true,
                    },
                },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function (player, skill) {
        player.storage[skill] = false;
    },
            },
            twxiumu:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    player:"damageEnd",
                },
                filter:function(event, player) {
        return game.hasPlayer(current => current.countCards("h") && current != player);
    },
                content:function(event, trigger, player) {
        'step 0'
player.chooseTarget(1, (card, player, target) => {
                return target.countCards("h") > 0 && target != player;
            }).set("ai", target => {
                const player = get.player();
                const num = player.countCards("h") - target.countCards("h");
                return get.attitude(player, target) * (num / 2);
            });
        'step 1'
        if(!result.bool){
            return;
        }
        event.targets = result.targets;
        if (
            event.targets[0].getCards("h").reduce((num, card) => {
                return num + get.number(card, event.targets[0]);
            }, 0) < 13
        ) {
            event.cards = event.targets[0].getCards("h");
        } else {
            event.targets[0]
                .chooseCard(`修睦：请选择点数之和大于等于13的手牌与${get.translation(player)}的手牌交换`, [1, Infinity], true, "h")
                .set("filterOk", () => {
                    const player = get.player();
                    const selected = ui.selected.cards;
                    if (!selected.length) {
                        return false;
                    }
                    return (
                        selected.reduce((num, card) => {
                            return num + get.number(card, player);
                        }, 0) >= 13
                    );
                })
                .set("ai", card => {
                    const player = get.player();
                    const att = get.attitude(player, event.sourcex);
                    const num = ui.selected.cards.reduce((num, cardx) => {
                        return num + get.number(cardx, player);
                    }, 0);
                    if (num < 13) {
                        if (att > 0) {
                            return 8 - get.value(card);
                        }
                        return Math.ceil(get.number(card, player) / 4) * (6 - get.value(card));
                    }
                    return 0;
                })
                .set("sourcex", player);
        }
        'step 2'
        if(result.bool){
            event.cards = result?.cards;
        }
        event.targets[0].swapHandcards(player, event.cards, player.getCards("h"));
    },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function(card, player, target) {
                if (player.hasSkillTag("jueqing", false, target)) {
                    return [1, -1.5];
                }
                if (!target.hasFriend()) {
                    return;
                }
                if (get.tag(card, "damage")) {
                    return [1, 0, 0, -0.7];
                }
            },
                    },
                },
                "_priority":0,
            },
            twhanhong:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                enable:"phaseUse",
                filter:function(event, player) {
        if (player.getStorage("twhanhong_used").length >= 4) {
            return false;
        }
        return player.countDiscardableCards(player, "h") > 0;
    },
                chooseButton:{
                    dialog:function(event, player) {
            return ui.create.dialog(get.prompt2("twhanhong"));
        },
                    chooseControl:function(event, player) {
            const choices = lib.suit.filter(s => !player.getStorage("twhanhong_used").includes(s));
            choices.push("cancel2");
            return choices;
        },
                    check:function(event, player) {
            return lib.suit.filter(s => !player.getStorage("twhanhong_used").includes(s)).randomGet();
        },
                    backup:function(result, player) {
            return {
                audio: "twhanhong",
                suit: result.control,
                filterCard: true,
                position: "he",
                selectCard:function() {
                    const player = get.player();
                    const nums = lib.suit
                        .map(s => {
                            return player.countCards("h", { suit: s });
                        })
                        .sort((a, b) => b - a);
                    return nums[0];
                },
                content:function(event, trigger, player) {
                    "step 0"
                    const suit = lib.skill.twhanhong_backup.suit;
                    const cards = event.cards;
                    event.cards = cards;
                    player.popup(suit);
                    player.addTempSkill("twhanhong_used", "phaseUseAfter");
                    player.markAuto("twhanhong_used", [suit]);
                    let view = [];
                    for (let i = 0; i < cards.length; i++) {
                        let card = get.cardPile(card => {
                            return get.suit(card) == suit && !view.includes(card);
                        });
                        if (!card) {
                            break;
                        }
                        view.add(card);
                    }
                    if (!view.length) {
                        player.chat(`bro牌堆没有${suit}牌了`);
                        return;
                    }
                    player
                        .chooseCardButton("翰鸿：请选择要获得的牌", view, true)
                        .set("ai", button => get.buttonValue(button))
                    "step 1"
                    const card = result.links[0];
                    var hsclub = false;
                    game.log(player, "从牌堆获得一张牌");
                    player.gain(card, "draw");
                    if (event.cards.some(cardx => get.suit(cardx) == "club")) {
                        player.draw();
                    }
                },
            };
        },
                    prompt:function(result, player) {
            const nums = lib.suit
                .map(s => {
                    return player.countCards("h", { suit: s });
                })
                .sort((a, b) => b - a);
            return `请弃置${nums[0]}张牌，然后观看牌堆顶前${nums[0]}张${get.translation(result.contrl)}牌并获得其中一张`;
        },
                },
                ai:{
                    order:7,
                    result:{
                        player:1,
                    },
                    "slqj_ai_discard_self":true,
                    "slqj_ai_draw_self":true,
                },
                subSkill:{
                    used:{
                        onremove:true,
                        charlotte:true,
                        intro:{
                            content:"已发动过的花色：$",
                        },
                        sub:true,
                        sourceSkill:"twhanhong",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            twhuazhang:{
                audio:"ext:手杀武将/apk/还原武将/audio:3",
                logAudio:index => (typeof index === "number" ? "twhuazhang" + index + ".mp3" : 2),
                trigger:{
                    player:"phaseUseEnd",
                },
                filter:function(event, player) {
        return player.countCards("h") >= 2;
    },
                content:function(event, trigger, player) {
        const cards = player.getCards("h");
        const num = cards.length;
        player.chongzhu(cards);
        let count = 0;
        var suit_list = cards.map(card => get.suit(card)),unique_list = [];
        for(var i = 0;i < suit_list.length;i++){
                if(!unique_list.includes(suit_list[i])){
                    unique_list.add(suit_list[i]);
                 }
            }
        if (unique_list.length == 1) {
            count++;
        }
        var number_list = cards
            .map(card => get.number(card));
        unique_list = [];
        for(var i = 0;i < number_list.length;i++){
                if(!unique_list.includes(number_list[i])){
                    unique_list.add(number_list[i]);
                 }
            }
        const nums = unique_list.sort((a, b) => a - b);
        if (nums.length == cards.length && nums.length > 1) {
            if (nums[nums.length - 1] - nums[0] == nums.length - 1) {
                count++;
            }
        }
        unique_list = [];
        var card_list = cards.map(card => get.name(card, player));
        for(var i = 0;i < card_list.length;i++){
                if(!unique_list.includes(card_list[i])){
                    unique_list.add(card_list[i]);
                 }
            }
        if (unique_list.length == 1) {
            count++;
        }

        if (count > 0) {
            player.logSkill("twhuazhang", null, null, null, [3]);
            player.draw(num);
        }
        if (count > 1) {
            player.addTempSkill("twhuazhang_hs");
            player.addMark("twhuazhang_hs", num, false);
        }
        if (count > 2) {
            player.draw(num);
            player.addMark("twhuazhang_hs", num, false);
        }
    },
                subSkill:{
                    hs:{
                        onremove:true,
                        charlotte:true,
                        markimage:"image/card/handcard.png",
                        mod:{
                            maxHandcard:function(player, num) {
                    return num + player.countMark("twhuazhang_hs");
                },
                        },
                        intro:{
                            content:"本回合手牌上限+#",
                        },
                        sub:true,
                        sourceSkill:"twhuazhang",
                        "_priority":0,
                    },
                },
                "_priority":0,
                ai:{
                    "slqj_ai_draw_self":true,
                },
            },
            hytwdumou:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    player:["gainEnd","loseEnd"],
                    global:"phaseEnd",
                },
                direct:true,
                priority:0,
                content:function (trigger,player,event) {
            "step 0"
        if(trigger.name == "phase"){
              var targets = game.filterPlayer();
           var clist = [];
           for(i of targets){
               clist.push(i.countMark("hytwdumou"));
               var num = i.countMark("hytwdumou");
               i.removeMark("hytwdumou",num);
           }
                let max = clist[0];
                for (let i = 0; i < clist.length; i++) {
                           if (clist[i] > max) max = clist[i];
                }
           //player.chat(max.toString());
           //var max = Math.max(clist);
           var max_player = [];
           for(var i=0;i<clist.length;i++){
               if(clist[i] == max){
                   max_player.push(targets[i]);
               }
           }
           if(max_player.length == 1){
               max_player[0].loseHp();
           }
           event.finish();
           return;
        }
        if(player.hasSkill("hytwdumou_block")){
            event.finish();
            return;
        }
            player.addSkill("hytwdumou_block");
            player.chooseControl('展示牌堆顶的一张牌', '重铸三张牌').set('prompt', '督鍪：请选择一项');
            "step 1"
        if(result.control == '展示牌堆顶的一张牌'){
            event.a = true;
        }else{
            event.a = false;
        }
        player.chooseTarget(1,'督鍪：请选择一名角色');
        "step 2"
        if(result.bool){
            event.target = result.targets[0];
        if(event.a){
            const card = _status.pileTop;
            event.target.showCards(card);
            event.target.gain(card, 'gain2');
            event.target.addMark("hytwdumou",1);
        }else{
            event.target.chooseCard(3,'h');
            event.b = true;
        }
        }
        "step 3"
        if(event.b){
            if(result.bool){
                event.target.chongzhu(result.cards);
                event.target.addMark("hytwdumou",3);
            }
        }
},
                subSkill:{
                    block:{
                        charlotte:true,
                        forced:true,
                        silent:true,
                        popup:false,
                        trigger:{
                            global:["phaseZhunbeiEnd","phaseJudgeEnd","phaseDrawEnd","phaseUseEnd","phaseDiscardEnd","phaseJieshuEnd"],
                        },
                        content:function () {
                player.removeSkill('hytwdumou_block');
            },
                        sub:true,
                    },
                },
                ai:{
                    expose:0.1,
                },
                "_priority":1,
            },
            hytwhantian:{
                audio:"ext:手杀武将/apk/还原武将/audio:1",
                enable:"phaseUse",
                usable:1,
                group:["hytwhantian_d","hytwhantian_core"],
                content:function () {
"step 0";
player.chooseTarget(get.prompt2("撼天"), function (card, player, target) {
return target.countCards('h') > 0;
}).ai = function (target) {
return get.damageEffect(target, player, player, "fire");
};
"step 1";
if (result.bool) {
    player.addSkill("twhuogong");
player.useCard({ name: "huogong" }, result.targets);
}
        "step 2"
        if(player.hasSkill("twhuogong")){
            player.removeSkill("twhuogong");
        }
},
                subSkill:{
                    d:{
                        trigger:{
                            global:"gainAfter",
                        },
                        forced:true,
                        content:function(trigger,player){
                trigger.player.addMark("hytwhantian",1);
                trigger.player.addSkill("hytwhantian_clear");
        player.addGaintag(trigger.cards, "hytwhantian");
        trigger.cards.forEach(card => {
            card.storage["hytwhantian"] = true;
        });
            },
                        priority:10,
                        sub:true,
                    },
                    clear:{
                        trigger:{
                            global:"phaseBegin",
                        },
                        forced:true,
                        content:function(player){
                var num = player.countMark("hytwhantian");
                player.removeMark("hytwhantian",num);
                player.removeSkill("hytwhantian_clear");
                player.getCards("h").forEach(card => {
            card.storage["hytwhantian"] = false;
        });
                player.removeGaintag("hytwhantian",player.getCards("h"));
            },
                        sub:true,
                    },
                    core:{
                        trigger:{
                            source:"damageBegin1",
                        },
                        forced:true,
                        filter:function (event) {
                return event.nature == 'fire';
            },
                        content:function (trigger) {
                trigger.num += trigger.player.countMark("hytwhantian");
            },
                        sub:true,
                    },
                },
                "_priority":0,
            },
            hycuanzun:{
                audio:"ext:手杀武将/apk/还原武将:2",
                trigger:{
                    global:"die",
                },
                filter:function (event, player) {
        return player.isDamaged() || event.player.countCards('he') > 0;
    },
                content:function () {
            player.logSkill(event.name, trigger.player);
            event.togain = trigger.player.getCards('he');
            player.gain(event.togain, trigger.player, 'giveAuto', 'bySelf');
            player.recover();
    },
            },
            "hyyuxi_skill":{
                charlotte:true,
                forced:true,
                trigger:{
                    player:"useCardAfter",
                },
                content:function(event,player){
        if(player.countMark("hyyuxi_skill") < 3){
            player.addMark("hyyuxi_skill",1,false);
        }else{
            var num = player.countMark("hyyuxi_skill");
            player.removeMark("hyyuxi_skill",num);
            player.draw(3);
            game.log("受命于天，既寿永昌！");
        }
    },
            },
            newsbrende:{
                audio:"ext:手杀武将/apk/还原武将/audio:3",
                enable:["chooseToUse","chooseToRespond"],
                init:function(player,event) {
        player.addMark("newsbrende_max",8,false);
    },
                filter:function(event, player) {
        if (event.type == 'wuxie' || player.hasSkill('newsbrende_used')) return false;
        if (player.countMark('newsbrende') < 2) return false;
        for (var name of lib.inpile) {
            if (get.type(name) != 'basic') continue;
            var card = { name: name, isCard: true };
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
                group:["newsbrende_give","newsbrende_gain"],
                chooseButton:{
                    dialog:function(event, player) {
            var dialog = ui.create.dialog('仁德');
            if (event.type == 'phase') {
                dialog._chosenOpt = [];
                var table = document.createElement('div');
                table.classList.add('add-setting');
                table.style.margin = '0';
                table.style.width = '100%';
                table.style.position = 'relative';
                var list = ['视为使用基本牌', '交给其他角色牌'];
                for (var i of list) {
                    var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                    td.innerHTML = '<span>' + i + '</span>';
                    td.link = i;
                    if (i == list[0]) {
                        td.classList.add('bluebg');
                        dialog._chosenOpt.add(td);
                    }
                    if (i == list[0] || (i == list[1] && _status.event.player.countCards('he') && game.hasPlayer(p => {
                        return !_status.event.player.getStorage('newsbrende_given').contains(p) && p != player;
                    }))) {
                        td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                            if (_status.dragged) return;
                            if (_status.clicked) return;
                            if (_status.justdragged) return;
                            _status.tempNoButton = true;
                            _status.clicked = true;
                            setTimeout(function () {
                                _status.tempNoButton = false;
                            }, 500);
                            var link = this.link;
                            if (link == '交给其他角色牌') game.uncheck();
                            var current = this.parentNode.querySelector('.bluebg');
                            if (current) {
                                current.classList.remove('bluebg');
                                dialog._chosenOpt.remove(current);
                            }
                            dialog._chosenOpt.add(this);
                            this.classList.add('bluebg');
                            game.check();
                        });
                    }
                    table.appendChild(td);
                    dialog.buttons.add(td);
                }
                dialog.content.appendChild(table);
            }
            var cards = [];
            for (var name of lib.inpile) {
                if (get.type(name) != 'basic') continue;
                var card = { name: name, isCard: true };
                if (event.filterCard(card, player, event)) cards.push(['基本', '', name]);
                if (name == 'sha') {
                    for (var nature of lib.inpile_nature) {
                        card.nature = nature;
                        if (event.filterCard(card, player, event)) cards.push(['基本', '', name, nature]);
                    }
                }
            }
            dialog.add([cards, 'vcard'])
            return dialog;
        },
                    check:function(button, player) {
            if (typeof button.link == 'string') return -1;
            if (_status.event.getParent().type != 'phase') return 1;
            return _status.event.player.getUseValue({ name: button.link[2], nature: button.link[3] });
        },
                    select:function() {
            var opts = _status.event.dialog._chosenOpt;
            return opts && opts.length && opts[0].link == '交给其他角色牌' ? 0 : 1;
        },
                    backup:function(links, player) {
            var isUse = links.length == 1;
            var backup = get.copy(lib.skill['newsbrende_' + (isUse ? 'use' : 'give')]);
            if (isUse) backup.viewAs = { name: links[0][2], nature: links[0][3], isCard: true };
            return backup;
        },
                    prompt:function(links, player) {
            var isUse = links.length == 1;
            return (isUse ? ('移去2个蓄力点”，视为使用或打出' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]))
                : '###仁德###出牌阶段每名角色限一次。你可以将任意张牌交给一名其他角色，然后你获得等量蓄力点（至多为' + player.countMark("newsbrende_max") + '）');
        },
                },
                hiddenCard:function(player, name) {
        return get.type(name) == 'basic' && player.countMark('newsbrende') > 1 && player.hasSkill('sbrende_used');
    },
                marktext:"蓄",
                intro:{
                    name:"蓄力点",
                    "name2":"蓄力点",
                    content:"mark",
                },
                ai:{
                    respondSha:true,
                    respondShan:true,
                    save:true,
                    skillTagFilter:function(player) {
            return player.countMark('newsbrende') > 1 && !player.hasSkill('newsbrende_used');
        },
                    order:function(item, player) {
            //if (_status.event.type == 'phase' && lib.skill.sbzhangwu.ai.result.player(player) > 0) return 9.1;
            return 0.5;
        },
                    result:{
                        player:function(player) {
                if (_status.event.dying) {
                    return get.attitude(player, _status.event.dying);
                }
                return _status.event.type == 'phase' && player.countMark('newsbrende') <= 2 ? 0 : 1;
            },
                    },
                },
                subSkill:{
                    max:{
                        mark:true,
                        marktext:"限",
                        intro:{
                            name:"蓄力点上限",
                            content:"当前蓄力点上限为#",
                        },
                        sub:true,
                        parentskill:"newsbrende",
                        "_priority":0,
                    },
                    backup:{
                        sub:true,
                        parentskill:"newsbrende",
                        "_priority":0,
                    },
                    used:{
                        charlotte:true,
                        sub:true,
                        parentskill:"newsbrende",
                        "_priority":0,
                    },
                    given:{
                        onremove:true,
                        sub:true,
                        parentskill:"newsbrende",
                        "_priority":0,
                    },
                    use:{
                        audio:"newsbrende",
                        filterCard:() => false,
                        selectCard:-1,
                        popname:true,
                        precontent:function() {
                player.logSkill('newsbrende_use');
                delete event.result.skill;
                player.removeMark('newsbrende', 2);
                player.addTempSkill('newsbrende_used');
            },
                        sub:true,
                        parentskill:"newsbrende",
                        "_priority":0,
                    },
                    give:{
                        audio:"newsbrende",
                        enable:"phaseUse",
                        filterCard:true,
                        selectCard:[1,Infinity],
                        position:"he",
                        discard:false,
                        lose:false,
                        delay:false,
                        filter:function(event, player) {
                return player.countMark('newsbrende') < 2 || player.hasSkill('newsbrende_used');
            },
                        filterTarget:function(card, player, target) {
                if (player.getStorage('newsbrende_given').contains(target)) return false;
                return player != target;
            },
                        prompt:function(event) {
                return '出牌阶段每名角色限一次。你可以将任意张牌交给一名其他角色，然后你获得等量蓄力点（至多为' + lib.skill.sbrende.maxNum + '）';
            },
                        check:function(card) {
                var player = get.owner(card);
                if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                if (ui.selected.cards.length + player.countMark('newsbrende') > player.countMark("newsbrende_max")) return 0;
                if (!ui.selected.cards.length && card.name == 'du') return 20;
                if (ui.selected.cards.length >= Math.max(2, player.countCards('he') - player.hp)) return 0;
                if (player.countCards('he') <= 1) {
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i++) {
                        if (players[i].hasSkill('haoshi') &&
                            !players[i].isTurnedOver() &&
                            !players[i].hasJudge('lebu') &&
                            get.attitude(player, players[i]) >= 3 &&
                            get.attitude(players[i], player) >= 3) {
                            return 11 - get.value(card);
                        }
                    }
                    if (player.countCards('he') > player.hp) return 10 - get.value(card);
                    if (player.countCards('he') > 2) return 6 - get.value(card);
                    return -1;
                }
                return 18 - (ui.selected.cards.length + player.countMark('newsbrende')) - get.value(card);
            },
                        content:function() {
                player.addTempSkill('newsbrende_given', 'phaseUseAfter');
                player.markAuto('newsbrende_given', [target]);
                player.markAuto('newsbrende_givenx', [target]);
                player.give(cards, target);
                target.addSkill("newsbrende_gived");
                target.addSkill("newsbzhangwu_o");
                target.addSkill("newsbzhangwu_d");
                var num = Math.min(player.countMark("newsbrende_max") - player.countMark('newsbrende'), cards.length);
                if (num > 0) player.addMark('newsbrende', num);
            },
                        ai:{
                            order:function(skill, player) {
                    return player.countMark('newsbrende') < 2 ? 6.8 : 5.8;
                },
                            result:{
                                target:function(player, target) {
                        if (!player.hasFriend() && player.hasSkill('newsbzhangwu') && ui.selected.cards.length &&
                            get.value(ui.selected.cards[0]) > (lib.skill.sbzhangwu.filterTarget(null, player, target) ? 3 : 5)) return -0.1;
                        if (target.hasSkillTag('nogain')) return 0;
                        if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                            if (target.hasSkillTag('nodu')) return 0;
                            return -10;
                        }
                        if (target.hasJudge('lebu')) return 0;
                        var nh = target.countCards('h');
                        return Math.max(1, 5 - nh);
                    },
                            },
                            threaten:1.1,
                        },
                        sub:true,
                        parentskill:"newsbrende",
                        "_priority":0,
                    },
                    gived:{
                        charlotte:true,
                        mark:true,
                        marktext:"仁德",
                        intro:{
                            name:"仁德",
                            content:"已成为过仁德的目标",
                        },
                        init:function(player,event) {
                player.addMark("newsbrende_gived",1,false);
            },
                        sub:true,
                        parentskill:"newsbrende",
                        "_priority":0,
                    },
                    gain:{
                        audio:"newsbrende",
                        trigger:{
                            player:"phaseUseBegin",
                        },
                        forced:true,
                        locked:false,
                        filter:function(event, player) {
                return player.countMark('newsbrende') < player.countMark("newsbrende_max");
            },
                        content:function() {
                var num = Math.min(player.countMark("newsbrende_max") - player.countMark('sbrende'), 2);
                if (num > 0) player.addMark('newsbrende', num);
            },
                        sub:true,
                        parentskill:"newsbrende",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            newsbzhangwu:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                forced:true,
                trigger:{
                    source:"die",
                },
                content:function() {
        player.draw(3);
    },
                mod:{
                    attackRange:function(player, num) {
             return num + player.countMark("newsbzhangwu_k");
          },
                    cardUsable:function(card, player, num) {
             if (card.name == 'sha') return num + player.countMark("newsbzhangwu_k");
         },
                },
                subSkill:{
                    red:{
                        mod:{
                            cardname:function(card, player) {
                    if (get.color(card) == 'red') return 'sha';
                },
                            cardnature:function(card, player) {
                    if (get.color(card) == 'red') return 'fire';
                },
                        },
                        ai:{
                            effect:{
                                target:function(card, player, target, current) {
                        if (get.tag(card, 'respondSha') && current < 0) return 0.6
                    },
                            },
                            respondSha:true,
                        },
                        sub:true,
                        parentskill:"newsbzhangwu",
                        "_priority":0,
                    },
                    black:{
                        mod:{
                            cardname:function(card, player) {
                    if (get.color(card) == 'black') return 'sha';
                },
                            cardnature:function(card, player) {
                    if (get.color(card) == 'black') return 'thunder';
                },
                        },
                        ai:{
                            effect:{
                                target:function(card, player, target, current) {
                        if (get.tag(card, 'respondSha') && current < 0) return 0.6
                    },
                            },
                            respondSha:true,
                        },
                        sub:true,
                        parentskill:"newsbzhangwu",
                        "_priority":0,
                    },
                    o:{
                        audio:"newsbzhangwu",
                        forced:true,
                        trigger:{
                            source:"die",
                        },
                        content:function(player,event) {
                const allplayer = game.filterPlayer();
                for(var targets of allplayer){
                    if(targets.hasSkill("newsbzhangwu")){
                        targets.draw(3);
                    }
                }
            },
                        sub:true,
                        parentskill:"newsbzhangwu",
                        "_priority":0,
                    },
                    d:{
                        audio:"newsbzhangwu",
                        forced:true,
                        trigger:{
                            player:"dieBegin",
                        },
                        content:function(player,event) {
                "step 0"
                const allplayer = game.filterPlayer();
                for(var targets of allplayer){
                    if(targets.hasSkill("newsbzhangwu")){
                        event.targets = targets;
                    }
                }
                        var num = Math.ceil(event.targets.countMark("newsbrende_max") / 2);
                        event.targets.removeMark("newsbrende_max",num);
                        event.targets.addMark("newsbzhangwu_k",1,false);
                        if(event.targets.countMark("newsbrende") > num || event.targets.countMark("newsbrende") > event.targets.countMark("newsbrende_max")){
                            var num2 = event.targets.countMark("newsbrende");
                            event.targets.removeMark("newsbrende",num2-num);
                        }
                var list = [];
                if(!event.targets.hasSkill("newsbzhangwu_red")){
                    list.push("红色");
                }
                if(!event.targets.hasSkill("newsbzhangwu_black")){
                    list.push("黑色");
                }
                event.targets.chooseControl(list).set('prompt','章武：请选择一个颜色，此后该颜色的牌只能当（红色：火杀 黑色：雷杀）使用或打出');
                "step 1"
                    if(result.control == '红色'){
                        game.log(event.targets,"选择了红色");
                        event.targets.addSkill("newsbzhangwu_red");
                    }else{
                        game.log(event.targets,"选择了黑色");
                        event.targets.addSkill("newsbzhangwu_black");
                    }
               },
                        sub:true,
                        parentskill:"newsbzhangwu",
                        "_priority":0,
                    },
                    k:{
                        mark:true,
                        marktext:"武",
                        intro:{
                            name:"章武",
                            content:"使用杀的次数与攻击范围+#",
                        },
                        sub:true,
                        parentskill:"newsbzhangwu",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
            newsbjijiang:{
                audio:"ext:手杀武将/apk/还原武将/audio:2",
                trigger:{
                    player:"phaseUseEnd",
                },
                zhuSkill:true,
                unique:true,
                direct:true,
                filter:function(event, player) {
        if (!player.hasZhuSkill('newsbjijiang')) return false;
        return game.hasPlayer(current => {
            if (current.group != 'shu' || player == current || current.hp < player.hp) return false;
            return game.hasPlayer(currentx => current.inRange(currentx));
        });
    },
                content:function() {
        'step 0'
        var next = player.chooseTarget(get.prompt2('newsbjijiang'), 2);
        next.set('filterTarget', (card, player, target) => {
            if (!ui.selected.targets.length) return true;
            var current = ui.selected.targets[0];
            if (current.group == 'shu' && current.hp >= player.hp && current != player) {
                return current.inRange(target);
            }
            else {
                return target.group == 'shu' && target.hp >= player.hp && target.inRange(current) && target != player;
            }
        })
        next.set('targetprompt', target => {
            var player = _status.event.player;
            if (target.group == 'shu' && target.hp >= player.hp && target != player && !ui.selected.targets.some(i => {
                return i != target && i.hp >= player.hp && i.group == 'shu';
            })) return '进行选择';
            return '出杀对象';
        });
        next.set('ai', target => {
            var player = _status.event.player;
            if (ui.selected.targets.length) {
                var current = ui.selected.targets[0];
                if (current.group == 'shu' && current.hp >= player.hp && current != player) {
                    return -get.attitude(player, target);
                }
                return Math.abs(get.attitude(player, current));
            }
            else {
                if (target.group == 'shu' && target.hp >= player.hp && target != player && game.hasPlayer(current => {
                    return get.attitude(player, current) < 0;
                })) return 10;
                return 1;
            }
        })
        'step 1'
        if (result.bool) {
            var targets = result.targets;
            event.targets = targets;
            if (targets[0].group != 'shu' || targets[0].hp < player.hp || targets[0] == player) targets.reverse();
            player.logSkill('newsbjijiang', targets, false);
            player.line2(targets);
            var choiceList = [
                '视为对' + get.translation(targets[1]) + '使用一张【杀】',
                '你的下一个出牌阶段开始前，跳过此阶段'
            ];
            targets[0].chooseControl().set('choiceList', choiceList).set('ai', () => {
                return _status.event.choice;
            }).set('choice', get.effect(targets[1], { name: 'sha' }, targets[0], targets[0]) > get.effect(targets[0], { name: 'lebu' }, targets[0], targets[0]) ? 0 : 1);
        }
        else event.finish();
        'step 2'
        if (result.index == 0) {
            targets[0].useCard({ name: 'sha', isCard: true }, targets[1], false);
        }
        else {
            targets[0].addSkill('newsbjijiang_skip');
        }
    },
                subSkill:{
                    skip:{
                        trigger:{
                            player:"phaseUseBefore",
                        },
                        charlotte:true,
                        forced:true,
                        content:function() {
                trigger.cancel();
                player.removeSkill('newsbjijiang_skip');
            },
                        sub:true,
                        parentskill:"newsbjijiang",
                        "_priority":0,
                    },
                },
                "_priority":0,
            },
        },
        translate:{
            hyliufang:"流放",
            "hyliufang_info":"出牌阶段限一次或当你受到伤害后，你可令一名其他角色翻面并令其摸X张牌，然后若X大于1，其进行一次闪电判定（X为你已损失的体力值）",
            pottuntian:"屯田",
            "pottuntian_info":"蓄力技，（0/0）①当你失去一张非伤害类卡牌后，你获得1点蓄力点。 ②出牌阶段限一次，你可以消耗任意点“蓄力”点，令至多等量名角色从牌堆或弃牌堆中各获得一张红桃牌。 ③一名角色的回合开始时，若你的蓄力点已满，你摸一张牌且你的蓄力点上限+1。",
            potzaoxian:"凿险",
            "potzaoxian_info":"锁定技，当你一次性消耗的蓄力值数量：不小于3，你从弃牌堆中获得一张【无中生有】；不小于5，你从弃牌堆中获得一张【无懈可击】；不小于7，你从弃牌堆中获得一张【五谷丰登】。",
            potjixi:"急袭",
            "potjixi_info":"一名角色的回合结束时，若场上存在本回合你使用过牌指定为目标的其他角色，你可弃置当前回合角色一张牌，然后视为使用一张指定其中任意名角色为目标的无视距离的【顺手牵羊】。",
            hyjizhan:"极斩",
            "hyjizhan_info":"连招技(装备牌+黑色牌)你选择一项:1.弃置一名其他角色的X张牌 2.对一名其他角色造成X点伤害（X为\"极斩\"本回合发动过的次数)",
            hyzhongtao:"众讨",
            "hyzhongtao_info":"出牌阶段限一次，你可选择1种花色（你每损失1点体力值可额外选择1种），然后随机从场上、弃牌堆或牌堆获得你选择花色的各1张牌。若如此做，你使用过3种类别的牌后，此技能视为未发动过。",
            twqianxiong:"潜凶",
            "twqianxiong_info":"出牌阶段限一次，你可观看牌堆顶的五张牌，将其中一张正面朝下置于一名角色的武将牌上。有「潜凶」牌的角色的出牌阶段开始时，你选择一项：1.本回合每当其使用或打出与其「潜凶」牌相同牌名的牌时，你对其造成1点伤害，本回合结束你移除与其使用或打出过的相同名牌的「潜凶」牌；2、你依次使用其所有「潜凶」牌。",
            twzhengshi:"争适",
            "twzhengshi_info":"游戏开始时，你令自己和两名其他角色获得〖隽嗣〗。一名拥有〖隽嗣〗的角色死亡后或首轮开始时，若你拥有〖隽嗣〗，你可令一名角色〖隽嗣〗的摸牌数或弃牌数+1或-1。",
            twmiewei:"灭围",
            "twmiewei_info":"出牌阶段开始时，你可令此阶段使用【杀】的次数等同于你攻击范围内的角色数。你使用【杀】对目标角色造成伤害时，此伤害+X（X为本回合被【杀】指定过的角色数-1且至多为5）。",
            twmiyong:"弥勇",
            "twmiyong_info":"限定技，出牌阶段，你可展示并标记手牌中的两张【杀】。此【杀】每回合因首次使用、首次打出或首次弃置进入弃牌堆时，你展示并获得之。",
            twjunsi:"隽嗣",
            "twjunsi_info":"锁定技，每回合各限2次，当你受到有\"隽嗣\"的角色造成的伤害后，你弃置1张牌。当你对有\"隽嗣\"造成伤害后，你摸1张牌。若仅你拥有隽嗣，此技能的目标改为所有角色。",
            huanchenxun:"沉勋",
            "huanchenxun_info":"每轮开始时，你可以视为对一名其他角色使用一张决斗，若此牌：对目标造成伤害，你摸一张牌，然后可以对一名本轮未成为过此技能目标的角色再次发动此技能；未造成伤害，你失去一点体力。",
            olhuanhuo:"幻惑",
            "olhuanhuo_info":"每轮开始时，你摸两张牌，然后弃置至多两张牌并选择等量其他角色。其下回合出牌阶段需要使用牌时强制选中一张可用的手牌（不能使用主动技能），且每使用一张牌后随机弃一张牌，直到其使用了两张牌后。",
            olqingshi:"倾世",
            "olqingshi_info":"准备阶段，你可入魔，令所有角色获得一张单目标伤害牌。其他角色使用此牌指定唯一目标时，你可弃置一张牌，重新指定牌的目标（无距离限制)。这些牌：造成伤害后，你摸一张牌；未因使用进入弃牌堆后，你获得之。（准备阶段，若这些牌均离开其手牌区，你再令所有角色获得牌。）入魔后，每轮结束时，若本轮你未造成过伤害，你失去1点体力。",
            olrumo:"入魔",
            "olrumo_info":"每局游戏限一次，当你满足条件后，可入魔。入魔后，每轮结束时，若本轮你未造成过伤害，你失去一点体力。",
            "eu_zhitong":"治统",
            "eu_zhitong_info":"转换技，当你使用牌时，若目标包含，阳：自己，摸两张牌且回复1点体力；阴：其他角色，你获得其装备区所有牌并对其造成1点伤害。",
            "eu_ducai":"独裁",
            "eu_ducai_info":"持恒技，你的回合内使用牌无距离次数限制，其他角色不能使用牌且所有技能失效。",
            "eu_jiquan":"集权",
            "eu_jiquan_info":"主公技，锁定技，西势力角色的回合开始时，你回复1点体力并摸一张牌。",
            qiusuo:"求索",
            "qiusuo_info":"你造成或受到伤害后，可获得一张【铁索连环】。",
            lisao:"离骚",
            "lisao_info":"出牌阶段限一次，你可选择两名角色，令其中随机一名角色展示所有手牌，另一名角色本回合受到的伤害翻倍且不可响应其他角色使用的牌。",
            twhuogong:"twhuogong",
            "twhuogong_info":"",
            twfushu:"複舒",
            "twfushu_info":"每回合限一次，当你需要使用【桃】时，你可与牌堆顶的一张牌拼点：若你赢，你视为使用一张【桃】；若你没赢，你下次受到的伤害值+1。",
            dcqinqiang:"勤强",
            "dcqinqiang_info":"每回合每项限一次，当你使用牌时，你可以选择一项：1.摸X张牌 2.此牌伤害+X（X为你连续使用过的该颜色的牌的次数）",
            dcyizhen:"疑阵",
            "dcyizhen_info":"当你受到伤害后，你可以观看伤害来源的手牌并弃置其中一张牌，然后其观看你的手牌并弃置其中一张牌，若这两张牌颜色相同，你获得之。",
            hyweijuchui:"据陲",
            "hyweijuchui_info":"连招技(装备牌+锦囊牌)选择一个其他角色，若其体力上限小于等于你，其失去一点体力。",
            hyweiguangyong:"犷勇",
            "hyweiguangyong_info":"锁定技，当你使用牌时，若此牌目标中包含你，你加一点体力上限，摸一张牌，包含其他角色，则你随机获得一名其他角色的一张牌，然后若你已受伤，你扣减一点体力上限。",
            dcchushan:"出山",
            "dcchushan_info":"锁定技，游戏开始时，你获得两个武将的各一个技能，并将你的武将名改为这两个武将的名字组合。",
            twguanhuo:"观火",
            "twguanhuo_info":"①当你使用【火攻】时，你摸一张牌。②出牌阶段，你可以视为使用一张【火攻】。③当你因〖观火②〗使用的【火攻】结算结束后，若此牌未造成过伤害，且：若{你此阶段发动〖观火②〗的次数为1，则你于此阶段造成渠道为【火攻】的伤害时，此伤害+1}，否则你失去〖观火〗。",
            twjuxia:"居下",
            "twjuxia_info":"①每回合限一次。当其他角色使用牌指定你为目标后，若其技能数多于你，你可以令此牌对你无效，然后你摸两张牌。②回合开始时，若你没有【观火】，则你可以获得之。",
            oldlianjie:"连捷",
            "oldlianjie_info":"当你使用牌指定目标时，若此牌点数小于或等于你的所有手牌，则你可以将一名角色手牌中点数最小的牌置于牌堆底，然后你将手牌摸至体力上限，以此法获得的牌本回合无距离和次数限制。（每回合每名角色限一次）",
            oldjiangxian:"将贤",
            "oldjiangxian_info":"限定技，出牌阶段，你可以令本回合使用因【连捷】获得的牌造成伤害时，伤害+X (X为你本回合造成伤害的次数且至多为5)，若如此做，此回合结束后失去【连捷】或【朝镇】。",
            sxrmmiehai:"灭害",
            "sxrmmiehai_info":"每回合限3次，你可以将两张牌当作无距离次数限制的刺【杀】使用，然后你可令其中任意名角色摸2张牌，此牌结算完成后，结算中失去黑桃牌的角色各回复一点体力。",
            qiangyi:"强易",
            "qiangyi_info":"每局游戏每名角色限一次，出牌阶段，你可获得一名其他角色的一张手牌，然后交给其一张手牌。",
            hyjixin:"技新",
            "hyjixin_info":"每当你使用你本局游戏未使用过的牌后，你可以摸X张牌并展示，令这些牌不计距离次数和手牌上限（X为此技能本轮使用次数）。",
            hyqinyi:"勤艺",
            "hyqinyi_info":"每回合你首次造成或受到伤害后，你可以视为使用一张未以此法使用的基本牌或普通锦囊牌。",
            pejiwei:"继魏",
            "pejiwei_info":"觉醒技，每个回合结束时，若本轮“技新”发动次数不小于1号位的当前体力值，你增加1点体力上限并回复所有体力，然后选择是否获得随机5个魏势力主公技。",
            twzaoxian:"凿险",
            "twzaoxian_info":"锁定技，当你一次性消耗的蓄力值数量：不小于2，你从弃牌堆中获得一张【无中生有】；不小于4，你从弃牌堆中获得一张【无懈可击】；不小于6，你从弃牌堆中获得一张【五谷丰登】。",
            dcquanshi:"权势",
            "dcquanshi_info":"转换技，每回合限一次，你使用牌时可令此牌不可响应，阳：摸此牌名字数张牌，若此牌造成伤害此技能视为未发动过；阴：弃此牌名字数张牌，若此牌未造成伤害此技能视为未发动过。",
            dcczchouxi:"仇隙",
            "dcczchouxi_info":"限定技，出牌阶段或当你受到伤害时，你可以视为使用一张牌名至多为X的伤害类牌（无次数限制）。你弃置手牌后，若弃牌数大于你的剩余手牌，此技能视为未发动过。（X为你本轮发动此技能的次数）。",
            twxiumu:"修睦",
            "twxiumu_info":"当你受到伤害后，你可令一名其他角色选择任意张点数之和大于等于13的手牌交换你的所有手牌（若其所有手牌点数之和小于13，则全部交换）。",
            twhanhong:"翰鸿",
            "twhanhong_info":"出牌阶段每种花色限一次，你可指定一种花色并弃置X张牌（X为你手牌中花色最多的牌数），然后观看牌堆顶前等量张你指定花色的牌并获得其中一张。若你以此法弃置的牌中有梅花牌，你摸1张牌。",
            twhuazhang:"华章",
            "twhuazhang_info":"出牌阶段结束时，若你手牌数不小于2，你可重铸所有手牌，这些牌每满足以下中的一项：花色相同、点数连续、牌名相同，你便依次执行一项：1、摸X张牌；2、本回合手牌上限+X；3、摸X张牌且本回合手牌上限+X（X为你以此法重铸的手牌数）。",
            hytwdumou:"督鍪",
            "hytwdumou_info":"你每阶段首次失去或获得牌后，可选择一项：1.令一名角色展示并获得牌堆顶的一张牌 2.令一名角色重铸三张牌。每个回合结束时，以此法获得牌数唯一最多的角色失去一点体力。",
            hytwhantian:"撼天",
            "hytwhantian_info":"出牌阶段限一次，你可以视为使用一张【火攻】，此火攻结算时目标角色需优先展示本回合获得的牌。当你造成火焰伤害后，此伤害+X（X为受伤角色本回合获得牌的次数）",
            hycuanzun:"篡尊",
            "hycuanzun_info":"当其他角色死亡后，你可以回复1点体力，然后获得其所有牌。",
            "hyyuxi_skill":"玉玺",
            "hyyuxi_skill_info":"受命于天，既寿永昌。",
            newsbrende:"仁德",
            "newsbrende_info":"①蓄力技(0/8)，出牌阶段每名角色限一次。你可以将任意张牌交给一名其他角色，然后你获得等量蓄力点。②每回合限一次。你可以移去2个蓄力点，视为使用或打出一张基本牌。③出牌阶段开始时，你获得2个蓄力点。",
            newsbzhangwu:"章武",
            "newsbzhangwu_info":"锁定技，①你或一名因“仁德”获得过牌的角色杀死角色后，你摸三张牌。 ②一名因“仁德”获得过牌的角色死亡后，你的蓄力点上限减半（向上取整）且你的出【杀】次数和攻击范围+1，然后你选择一种颜色，本局游戏你此颜色的手牌只能当作【杀】（黑色为雷【杀】，红色为火【杀】）使用或打出。",
            newsbjijiang:"激将",
            "newsbjijiang_info":"主公技，出牌阶段结束时，你可以选择一名角色，令一名攻击范围内含有其且体力值不小于你的其他蜀势力角色选择一项：1.视为对其使用一张【杀】；2.跳过下一个出牌阶段。",
        },
    },
    intro:"懒",
    author:"hyx",
    diskURL:"",
    forumURL:"",
    version:"1.2",
},files:{"character":["hy_caopi.jpg","huan_caopi.jpg","mou_xusheng.jpg","hymachao.jpg","mo_diaochan.jpg","dcquyuan.jpg","hywei_dongzhuo.jpg","oldwu_huangpusong.jpg","twqi_huangpusong.jpg","dc_noname.jpg","dcchendi.jpg","xia_caopi.jpg","huan_caozhi.jpg","sxrm_huatuo.jpg","newsb_liubei.jpg","eu_kaisa.jpg","tw_potdengai.jpg","pot_dengai.jpg","huan_caochong.jpg","huan_dianwei.jpg","twhuan_liufeng.jpg","hyhuan_zhouyu.jpg"],"card":[],"skill":[]}}};