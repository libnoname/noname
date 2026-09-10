import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"魔刘禅",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "魔刘禅":["male","devil",4,["妄断","夺权","婪乐"],["No_Outcrop","isExtension"]],
        },
        translate:{
            "魔刘禅":"魔刘禅",
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
            "妄断":{
                enable:"phaseUse",
                usable:1,
                content:function() {
        'step 0';
        player.chooseControl('basic','trick','equip').set('prompt','选择一种牌的类别');
        
        'step 1';
        event.category=result.control;
        event.discarders=[];
        event.list=game.filterPlayer();
        event.index=0;
        
        'step 2';
        if(event.index<event.list.length){
            var target=event.list[event.index];
            var toDiscard=target.getCards('h',function(card){
                return get.type(card)!=event.category;
            });
            if(toDiscard.length>0){
                target.discard(toDiscard);
                if(target!=player && !event.discarders.contains(target)){
                    event.discarders.push(target);
                }
                // 获得等量的该类别的牌
                var gains=[];
                for(var i=0;i<toDiscard.length;i++){
                    var card=get.cardPile(function(c){
                        return get.type(c)==event.category;
                    });
                    if(card) gains.push(card);
                }
                if(gains.length>0){
                    target.gain(gains,'draw');
                    game.log(target,'获得了',gains.length,'张','#g'+get.translation(event.category)+'牌');
                }
            }
            event.index++;
            event.redo();
        }
        
        'step 3';
        if(event.discarders.length>0){
            player.draw(event.discarders.length);
            game.log(player,'因',event.discarders.length,'名其他角色弃置了牌，多摸了',event.discarders.length,'张牌');
        }
    },
                ai:{
                    order:7,
                    result:{
                        player:1,
                    },
                },
                "_priority":0,
            },
            "夺权":{
                forced:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function(event,player) {
        return event.player!=player;
    },
                content:function() {
        'step 0';
        var target=trigger.player;
        var card=target.getCards('h').randomGet();
        if(card){
            player.gain(card,target,'giveAuto');
            game.log(player,'随机获得了',target,'的一张手牌');
        }
        'step 1';
        player.insertPhase();
        game.log(player,'执行了一个额外回合');
    },
            },
            "婪乐":{
                forced:true,
                lock:true,
                trigger:{
                    global:"useCard",
                },
                filter:function(event,player) {
        return event.player!=player;
    },
                content:function() {
        'step 0';
        var target=trigger.player;
        if(target.countCards('h')>0){
            var card=target.getCards('h').randomGet();
            player.gain(card,target,'giveAuto');
            game.log(player,'随机获得了',target,'的一张手牌');
        }
        'step 1';
        if(get.suit(trigger.card)=='heart'){
            player.draw();
            game.log(player,'使用的牌为红桃，摸了一张牌');
        }
    },
                "_priority":0,
            },
        },
        translate:{
            "妄断":"妄断",
            "妄断_info":"出牌阶段限一次，你可以选择一种牌的类别，令所有角色弃置所有非此类别的手牌并获得等量的此类别的临时牌，每有一名其他角色以此法弃置牌，你多获得一张牌。",
            "夺权":"夺权",
            "夺权_info":"锁定技，其他角色的回合开始时，你随机获得其一张手牌，其回合结束后，你执行一个额外回合。",
            "婪乐":"婪乐",
            "婪乐_info":"锁定技，当其他角色使用牌时，你随机获得其一张手牌，然后若其使用的牌为红桃，你摸一张牌。",
        },
    },
    intro:"",
    author:"※第五点天堂",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["魔刘禅.jpg"],"card":[],"skill":[]}}};