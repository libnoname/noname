import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"FY",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "2332":["male","wei",4,["FYfuyi2"],[]],
            "万能网友":["male","wei",4,["FYfuyi","FYfuyi4"],["des:我是一个没得感情的复读机"]],
            "复读机":["male","wu",4,["FYfudu","FYfudu2"],[]],
            the:["male","wei",2,["备份","复读备份"],[]],
        },
        translate:{
            "2332":"2332",
            "万能网友":"万能网友",
            "复读机":"复读机",
            the:"the",
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
            FYfuyi:{
                priority:12,
                trigger:{
                    global:["useCardAfter"],
                },
                usable:1,
                logTarget:"player",
                filter:function (event,player){
        return event.player!=player&& get.name(event.card) !='shan' && get.type(event.card) != 'equip' &&get.type(event.card) != 'delay' && player.countCards('h') > 0;
    },
                content:function (){
        "step 0"
        player.chooseToDiscard('h','弃置一张牌，视为'+get.translation(player)+'对'+get.translation(trigger.targets)+'使用',true).ai=function(card){return true;}
        "step 1"
        if(result.bool){
            event.card1=trigger.cards[0];
        }
        else event.finish();
        "step 2"
        var card=game.createCard(event.card1.name,event.card1.suit,event.card1.number,event.card1.nature);
        trigger.player.line(trigger.targets,'white');
        player.useCard(card,trigger.targets,false);
        player.draw();
        "step 3"
        game.delay();
    },
                group:["FYfuyi3"],
                ai:{
                    expose:0.2,
                    effect:{
                        player:function(card,player){
                if(card.name=='sha') {
                    if(!player.needsToDiscard()) return 0;
                }
            },
                    },
                },
            },
            "备份":{
                priority:12,
                trigger:{
                    global:["useCardAfter"],
                },
                usable:1,
                logTarget:"player",
                filter:function (event,player){
        return event.player!=player&& get.type(event.card) != 'equip' &&get.type(event.card) != 'delay' && player.countCards('h') > 0;
    },
                content:function (){
        "step 0"
        player.chooseToDiscard('h','选择并展示一张杀，视为'+get.translation(player)+'对'+get.translation(trigger.targets)+'使用',true).ai=function(card){return true;}
        "step 1"
        if(result.bool){
            event.card1=trigger.cards[0];
        }
        else event.finish();
        "step 2"
        var card=game.createCard(event.card1.name,event.card1.suit,event.card1.number,event.card1.nature);
        trigger.player.line(trigger.targets,'white');
        player.useCard(card,trigger.targets,false);
        "step 3"
        game.delay();
    },
                group:["FYfuyi3"],
                ai:{
                    expose:0.2,
                    effect:{
                        player:function(card,player){
                if(card.name=='sha') {
                    if(!player.needsToDiscard()) return 0;
                }
            },
                    },
                },
            },
            "FYfuyi2":{
                priority:12,
                trigger:{
                    global:["useCardAfter"],
                },
                usable:2,
                logTarget:"player",
                filter:function (event,player){
        return event.player!=player&& get.name(event.card) != 'shan' && get.name(event.card) !='wuxie' && get.type(event.card) != 'equip' &&get.type(event.card) != 'delay' && player.countCards('h') > 0;
    },
                content:function (){
        "step 0"
        player.chooseToDiscard('h',true);
        "step 1"
        if(trigger.name=["tao","jiu","wuzhong"]){
            player.chooseTarget(get.prompt('FY1'),'选择一名角色')
        }
        else{
            player.chooseUseTarget({name:trigger.card.name},false,'nodistance');
        }
        "step 2"
        if(result.bool){
            player.logSkill('FY1',result.targets);
            player.useCard({name:trigger.card.name,isCard:true},result.targets[0]);
        }
        "step 3"
        player.draw();
        game.delay();
    },
                ai:{
                    expose:0.2,
                    effect:{
                        player:function(card,player){
                if(card.name=='sha') {
                    if(!player.needsToDiscard()) return 0;
                }
            },
                    },
                },
            },
            FYfudu:{
                group:["FYfudu2","FYfudu3"],
                trigger:{
                    global:"useCardAfter",
                },
                usable:1,
                popup:false,
                filter:function(event,player){
        return get.name(event.card) !='shan' && event.player !=player && get.type(event.cart) != 'delay' && get.type(event.card) != 'equip' && player.countCards('h') > 0;
    },
                forced:true,
                content:function(){
        'step 0'
        var cardname = trigger.card.name;
        var tc = trigger.card;
        player.chooseToDiscard('h',"请弃置一张牌，将其当做"+get.translation(trigger.card)+"使用。",function(card){
            return game.hasPlayer(function(current){
                var viewAsCard = {
                    name:cardname,
                    cards:[card],
                    suit:get.suit(card),
                    number:get.number(card),
                    isCard:true
                };
                var nature = get.nature(tc);
                if(nature){
                    viewAsCard.nature = nature;
                }
                return lib.filter.targetEnabled(viewAsCard,player,current);
            });
        })
            .set('ai',function(card){
                var viewAsCard = {
                    name:cardname,
                    cards:[card],
                    suit:get.suit(card),
                    number:get.number(card),
                    isCard:true
                };
                var nature = get.nature(tc);
                if(nature){
                    viewAsCard.nature = nature;
                }
                return player.getUseValue(card);
        });
        'step 1'
        if(result && result.cards){
            var nature = get.nature(trigger.card);
            var c = {name:trigger.card.name};
            if(nature){
                c.nature = nature;
            }
            player.chooseUseTarget(c,true,'nodistance',result.cards)
                .set('prompt',"请选择使用"+get.translation(trigger.card.name)+"的目标")
                .set('logSkill');
        }else{
            event.finish();
        }
    },
            },
            "复读备份":{
                group:["FYfudu2","FYfudu3"],
                trigger:{
                    global:"useCardAfter",
                },
                popup:false,
                filter:function(event,player){
        return event.isPhaseUsing(event.player) && event.player !=player && get.type(event.cart) != 'delay' && get.type(event.card) != 'equip' && player.countCards('h') > 0;
    },
                forced:true,
                content:function(){
        'step 0'
        var cardname = trigger.card.name;
        var tc = trigger.card;
        player.chooseToDiscard('h',"请弃置一张牌，将其当做"+get.translation(trigger.card)+"使用。",function(card){
            return game.hasPlayer(function(current){
                var viewAsCard = {
                    name:cardname,
                    cards:[card],
                    suit:get.suit(card),
                    number:get.number(card),
                    isCard:true
                };
                var nature = get.nature(tc);
                if(nature){
                    viewAsCard.nature = nature;
                }
                return lib.filter.targetEnabled(viewAsCard,player,current);
            });
        })
            .set('ai',function(card){
                var viewAsCard = {
                    name:cardname,
                    cards:[card],
                    suit:get.suit(card),
                    number:get.number(card),
                    isCard:true
                };
                var nature = get.nature(tc);
                if(nature){
                    viewAsCard.nature = nature;
                }
                return player.getUseValue(card);
        });
        'step 1'
        if(result && result.cards){
            var nature = get.nature(trigger.card);
            var c = {name:trigger.card.name};
            if(nature){
                c.nature = nature;
            }
            player.chooseUseTarget(c,true,false,result.cards)
                .set('prompt',"请选择使用"+get.translation(trigger.card.name)+"的目标")
                .set('logSkill');
        }else{
            event.finish();
        }
    },
            },
            "FYfuyi3":{
                trigger:{
                    global:"phaseEnd",
                },
                forced:true,
                unique:true,
                filter:function(event,player){
        return player.storage.FYfuyi4>=3;
    },
                content:function(){
        player.awakenSkill('FYfuyi');
        player.addSkill('FYfuyi2');
    },
            },
            "FYfuyi4":{
                unique:true,
                init:function(player){
        player.storage.FYfuyi4=0;
    },
                mark:true,
                intro:{
                    content:"已累计造成#次伤害",
                },
                trigger:{
                    source:"damageAfter",
                },
                forced:true,
                popup:false,
                content:function(){
        if(trigger=player.getStat().damage){
            if(player.storage.FYfuyi4<3){
                player.storage.FYfuyi4++;
            }
            player.chooseToDiscard(true,'h');
        }
        else{
            event.finish;
        }
    },
            },
            "FYfudu2":{
                unique:true,
                init:function(player){
        player.storage.FYfudu2=0;
    },
                mark:true,
                intro:{
                    content:"已累计造成#次伤害",
                },
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                popup:false,
                filter:function(event){
        return event.Skill=='FYfudu';
    },
                content:function(){
        if(player.storage.FYfudu2<3){
            player.storage.FYfudu2++;
        }
        else{
            trigger.num++;
            player.storage.FYfudu=0;
            player.logSkill('song');
        }
        player.updateMarks();
    },
            },
            "FYfudu3":{
                trigger:{
                    global:"phaseEnd",
                },
                forced:true,
                skillAnimation:true,
                animationColor:"water",
                unique:true,
                filter:function(event,player){
        return player.storage.FYfudu>=3;
    },
                content:function(){
        player.awakenSkill('FYfudu');
        player.addSkill('FYfudu4');
    },
            },
            "附议2备份":{
                priority:12,
                trigger:{
                    global:["useCardAfter"],
                },
                usable:2,
                logTarget:"player",
                filter:function (event,player){
        return event.player!=player&& get.type(event.card) != 'equip' &&get.type(event.card) != 'delay' && player.countCards('h') > 0;
    },
                content:function (){
        "step 0"
        player.chooseToDiscard('h','选择并展示一张杀，视为'+get.translation(player)+'对'+get.translation(trigger.targets)+'使用',true).ai=function(card){return true;}
        "step 1"
        if(result.bool){
            event.card1=trigger.cards[0];
        }
        else event.finish();
        "step 2"
        var card=game.createCard(event.card1.name,event.card1.suit,event.card1.number,event.card1.nature);
        player.chooseUseTarget('选择一名角色',{name:card.name},true,'nodistance');
        var target=result.target;
        trigger.player.line(target,'white');
        player.useCard(card,target,false);
        player.draw();
        "step 3"
        game.delay();
    },
                ai:{
                    expose:0.2,
                    effect:{
                        player:function(card,player){
                if(card.name=='sha') {
                    if(!player.needsToDiscard()) return 0;
                }
            },
                    },
                },
            },
        },
        translate:{
            FYfuyi:"附议",
            "FYfuyi_info":"每回合限一次，当一名角色使用牌后，你可以弃置1张牌，视为你对原目标再次使用此牌。",
            "备份":"备份",
            "备份_info":"当指定1名角色的杀结算完成后，你可以弃置1张杀，视为该不为你的来源对其使用此杀，此杀不计入使用次数。",
            "FYfuyi2":"附议",
            "FYfuyi2_info":"每回合限两次，当一名角色使用牌后。你可以弃置一张牌并摸一张牌作为该牌使用，每当你在回合外造成一点伤害，你需弃置一张牌",
            FYfudu:"复读",
            "FYfudu_info":"",
            "复读备份":"复读备份",
            "复读备份_info":"",
            "FYfuyi3":"附议",
            "FYfuyi3_info":"若你在回合外造成至少三点伤害，你修改附议",
            "FYfuyi4":"附议",
            "FYfuyi4_info":"",
            "FYfudu2":"复读",
            "FYfudu2_info":"",
            "FYfudu3":"复读",
            "FYfudu3_info":"觉醒技，在一名角色的结束阶段，若你本局至少发动过3次【水蕴】，你增加一点体力和体力上限并获得两点护甲，然后获得技能【回梦】",
            "附议2备份":"附议2备份",
            "附议2备份_info":"当指定1名角色的杀结算完成后，你可以弃置1张杀，视为该不为你的来源对其使用此杀，此杀不计入使用次数。",
        },
    },
    intro:"",
    author:"⁹",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["the.jpg"],"card":[],"skill":[]}}};