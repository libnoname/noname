import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"界王基",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "re_wangji":["male","wei",3,["reqizhi","rejinqu"],["isExtension"]],
        },
        translate:{
            "re_wangji":"界王基",
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
            "reqizhi":{
            audio:"ext:界王基/audio:4",
                chargeSkill:2,
                enable:"phaseUse",
                filter:function(event,player){
       if(!player.countMark("charge")) return false;
       if(!player.storage.reqizhi_used) player.storage.reqizhi_used=[];
       return game.hasPlayer(function(current){
           return !player.storage.reqizhi_used.includes(current);
       });
   },
                filterTarget:function(card,player,target){
       if(!player.countMark("charge")) return false;
       if(!player.storage.reqizhi_used) player.storage.reqizhi_used=[];
       return !player.storage.reqizhi_used.includes(target);
   },
                content:function(){
       "step 0"
       if(!player.storage.reqizhi_used) player.storage.reqizhi_used=[];
       player.storage.reqizhi_used.push(target);
       player.removeMark("charge",1);
       target.draw(2);
       if(!player.storage.reqizhi_drawn) player.storage.reqizhi_drawn=[];
       player.storage.reqizhi_drawn.push(target);
       "step 1"
       player.addTempSkill('reqizhi_effect',{player:'phaseUseAfter'});
   },
                group:["reqizhi_init","reqizhi_clear"],
                subSkill:{
                    init:{
                        trigger:{
                            player:"enterGame",
                            global:"phaseBefore",
                        },
                        filter:function(event,player){
               return event.name!="phase"||game.phaseNumber==0;
           },
                        forced:true,
                        silent:true,
                        popup:false,
                        content:function(){
               player.addMark("charge",1);
           },
                        sub:true,
                        parentskill:"reqizhi",
                        "_priority":1,
                    },
                    effect:{
                        trigger:{
                            player:"useCardToTargeted",
                        },
                        filter:function(event,player){
               var type=get.type(event.card);
               if(type!='basic' && type!='trick') return false;
               if(get.subtype(event.card)=='delay') return false;
               return player.storage.reqizhi_drawn && player.storage.reqizhi_drawn.length>0;
           },
                        forced:true,
                        popup:false,
                        content:function(){
               "step 0"
               event.list=player.storage.reqizhi_drawn.slice(0);
               event.num=0;
               "step 1"
               if(event.num>=event.list.length){
                   event.finish();
                   return;
               }
               var target=event.list[event.num];
               event.num++;
               event.currentTarget=target;
               if(target.isIn() && target.countCards('he')>0){
                   player.viewHandcards(target);
                   var next=player.choosePlayerCard(target,'he');
                   next.set('prompt','弃置'+get.translation(target)+'的一张牌');
                   next.set('forced',true);
                   next.set('visible',true);
               } else {
                   event.goto(1);
               }
               "step 2"
               var target=event.currentTarget;
               var cards=result.cards;
               if(cards && cards.length){
                   target.discard(cards);
               }
               event.goto(1);
           },
                        sub:true,
                        parentskill:"reqizhi",
                        "_priority":0,
                    },
                    clear:{
                        trigger:{
                            player:"phaseUseAfter",
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        content:function(){
               delete player.storage.reqizhi_used;
               delete player.storage.reqizhi_drawn;
           },
                        sub:true,
                        parentskill:"reqizhi",
                        "_priority":1,
                    },
                },
                "_priority":0,
            },
            "rejinqu":{
            audio:"ext:界王基/audio:4",
                locked:true,
                group:["rejinqu_gain","rejinqu_draw","rejinqu_reset"],
                subSkill:{
                    gain:{
                        trigger:{
                            player:"useCardAfter",
                        },
                        filter:function(event,player){
               var type=get.type(event.card);
               if(type=='basic') return true;
               if(type=='trick' && get.subtype(event.card)!='delay') return true;
               return false;
           },
                        forced:true,
                        content:function(){
               if(!player.storage.rejinqu_count) player.storage.rejinqu_count=0;
               player.storage.rejinqu_count++;
               if(player.storage.rejinqu_count>=2){
                   player.storage.rejinqu_count-=2;
                   player.addMark('charge',1);
                   if(!player.storage.rejinqu_max) player.storage.rejinqu_max=0;
                   player.storage.rejinqu_max=Math.max(player.storage.rejinqu_max,player.countMark('charge'));
               }
           },
                        sub:true,
                        parentskill:"rejinqu",
                        "_priority":0,
                    },
                    draw:{
                        trigger:{
                            player:"phaseJieshu",
                        },
                        forced:true,
                        content:function(){
               var num=player.storage.rejinqu_max||0;
               if(num>0){
                   player.draw(num);
                   game.log(player,'摸了',get.cnNumber(num),'张牌');
               }
               delete player.storage.rejinqu_max;
               delete player.storage.rejinqu_count;
           },
                        sub:true,
                        parentskill:"rejinqu",
                        "_priority":0,
                    },
                    reset:{
                        trigger:{
                            player:"phaseBegin",
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        content:function(){
               delete player.storage.rejinqu_count;
               player.storage.rejinqu_max=player.countMark('charge');
           },
                        sub:true,
                        parentskill:"rejinqu",
                        "_priority":1,
                    },
                },
                "_priority":0,
            },
        },
        translate:{
            reqizhi:"奇制",
            "reqizhi_info":"蓄力技(1/2)，出牌阶段每名角色限一次，你可消耗1点蓄力点，令一名角色摸两张牌，然后本阶段你使用基本牌或普通锦囊牌指定目标后，你依次观看本阶段因此摸牌的角色的手牌并弃置其一张牌。",
            rejinqu:"进趋",
            "rejinqu_info":"锁定技、你每于回合内使用两张基本牌或普通锦囊牌后，令一名角色获得1点蓄力点；结束阶段，你摸X张牌（X为本回合你蓄力点数存在过的最高值）。",
            "reqizhi":"奇制",
            "reqizhi_info":"蓄力技(1/2)，出牌阶段每名角色限一次，你可消耗1点蓄力点，令一名角色摸两张牌，然后本阶段你使用基本牌或普通锦囊牌指定目标后，你依次观看本阶段因此摸牌的角色的手牌并弃置其一张牌。",
            "rejinqu":"进趋",
            "rejinqu_info":"锁定技，你每于回合内使用两张基本牌或普通锦囊牌后，你获得1点蓄力点；结束阶段，你摸X张牌（X为本回合你蓄力点数存在过的最高值），",
        },
    },
    intro:"",
    author:"※第五点天堂",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["re_wangji.jpg"],"card":[],"skill":[]}}};