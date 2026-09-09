import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"PY武将",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "gezi_sunce":["male","shen",5,["gezi_xianwei","gezi_yongjue"],["des:感谢群友【无言】的设计。"]],
            "gezi_simazhao":["male","wei",3,["gezi_feili","gezi_duoquan"],["des:感谢群友【无言】的设计。"]],
            "gezi_jiakui":["male","shen",4,["gezi_yonglixin","gezi_jianshou","gezi_jizhi"],["des:感谢群友【无言】的设计。"]],
            "gezi_zhaotong":["male","shu",4,["gezi_qianghun"],["des:感谢群友【无言】的设计。"]],
            "gezi_jiayu":["male","shen",4,["gezi_shanbing","gezi_weimu","gezi_xiance","gezi_bingmou"],["forbidai","des:备注：1，【毒计】ai不完善，因此ai禁选。2，因为【毒计】技能实现的原因，在某些情况下会有bug，比如同将模式。    【毒计】：回合结束阶段，你可以弃置一个【谋】，另一名其他角色摸三张牌并将体力回复至体力上限，然后从你的下个玩家回合开始，任意玩家的回合开始阶段，其需弃置一张手牌或失去一点体力，直到你的下个回合开始阶段。（不会在你的回合开始阶段触发）"]],
            "gezi_zhugeliang":["male","shu",3,["gezi_kuifa","gezi_yangzhan","gezi_jingqi","gezi_quanxiang"],["forbidai","des:备注：劝降ai不完善，因此ai不会发动劝降。"]],
        },
        translate:{
            "gezi_sunce":"孙策",
            "gezi_simazhao":"司马昭",
            "gezi_jiakui":"贾逵",
            "gezi_zhaotong":"赵统",
            "gezi_jiayu":"贾羽",
            "gezi_zhugeliang":"诸葛亮",
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
            "gezi_xianwei":{
                audio:["hunzi1","hunzi2"],
                group:"gezi_xianwei2",
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
        return player.hp==1;
    },
                content:function (){
        trigger.num++;
    },
            },
            "gezi_xianwei2":{
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                filter:function (event,player){
        return player.hp==1;
    },
                content:function (){
        trigger.num+=1;
    },
                mod:{
                    maxHandcard:function (player,current){
           if(player.hp==1) return current+2;
        },
                },
            },
            "gezi_yongjue":{
                audio:["jiang1","jiang2"],
                group:"gezi_yongjue2",
                enable:"phaseUse",
                usable:1,
                viewAs:{
                    name:"juedou",
                    suit:"heart",
                    number:3,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"heart","number":3,"name":"huogong","nature":"fire","cardid":"5843605271","clone":{"name":"huogong","suit":"heart","number":3,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":1148},"timeout":1055,"original":"h"}],
                },
                filterCard:{
                    color:"red",
                },
                position:"h",
                prompt:"将一张红色手牌当决斗使用",
                viewAsFilter:function (player){
        if(!player.countCards('h',{color:'red'})) return false;
    },
                check:function (card){
        return 6-get.value(card);
    },
                ai:{
                    basic:{
                        order:10,
                        useful:1,
                        value:5.5,
                    },
                    result:{
                        target:-1.5,
                        player:function (player,target){
                if(get.damageEffect

(target,player,target)>0&&get.attitude(player,target)>0&&get.attitude

(target,player)>0){
                    return 0;
                }
                var hs1=target.getCards('h','sha');
                var hs2=player.getCards('h','sha');
                if(hs1.length>hs2.length+1){
                    return -2;
                }
                var hsx=target.getCards('h');
                if(hsx.length>2&&hs2.length==0&&hsx[0].number<6){
                    return -2;
                }
                if(hsx.length>3&&hs2.length==0){
                    return -2;
                }
                if(hs1.length>hs2.length&&(!hs2.length||hs1

[0].number>hs2[0].number)){
                    return -2;
                }
                return -0.5;
            },
                    },
                    tag:{
                        respond:2,
                        respondSha:2,
                        damage:1,
                    },
                },
            },
            "gezi_yongjue2":{
                trigger:{
                    source:"damageAfter",
                },
                popup:false,
                direct:true,
                filter:function (event,player){
        return event.parent.skill=='gezi_yongjue'&&player.countCards('he',{type:'equip'})&&event.player!=player&&event.player.isAlive();
    },
                content:function (){
                "step 0"
        var next=player.chooseToDiscard('he','勇绝：是否弃置一张装备牌并摸两张牌然后本回合你对其使用牌无距离和次数限制？',function(card,player){
            return get.type(card)=='equip';
        });
        next.set('ai',function(card){
            var player=_status.event.player;
            var hs=player.getCards('h','sha');
            if(hs.length>=2){
                return 8-get.value(card);
            }
            return 7-get.value(card);
        });
        next.logSkill='gezi_yongjue';
                "step 1"
        if(result.bool){
            game.delay();
            player.draw(2);
            player.addTempSkill("gezi_yongjue3",{player:"phaseEnd"});
            trigger.player.addTempSkill("gezi_yongjue4",{player:"phaseEnd"});
        }
    },
            },
            "gezi_yongjue3":{
                mod:{
                    targetInRange:function (card,player,target){
            if(target.hasSkill('gezi_yongjue4')){
                return true;
            }
        },
                    cardUsable:function (card,player,num){
            if(typeof num=='number'&&game.hasPlayer(function(current){
                return current.hasSkill('gezi_yongjue4');
            })) return num+100;
        },
                    playerEnabled:function (card,player,target){
            if(game.hasPlayer(function(current){
                return current.hasSkill('gezi_yongjue4');
            })&&!target.hasSkill('gezi_yongjue4')){
                var num=player.getCardUsable(card)-100;
                if(num<=0) return false;
            }
        },
                },
            },
            "gezi_yongjue4":{
            },
            "gezi_qianghun":{
                audio:["chongzhen1","chongzhen2"],
                enable:"phaseUse",
                usable:2,
                filter:function (event,player){
        return player.countCards('h')>0;
      },
                content:function (){
      "step 0"
      var hs=player.getCards('h');
      var num=0;
       for(var i=0;i<hs.length;i++){
          if(get.type(hs[i])=='basic'){
              num++;
             }
         }
       player.discard(hs);
       event.num=num;
    "step 1"
    player.chooseTarget(get.prompt('gezi_qianghun'),function(card,player,target){
        if(target==player) return false;
        return player.canUse('sha',target,false);
    }).set('ai',function(target){
            return get.effect(target,{name:'sha'},player,player);
    });
    
    "step 2"
    if(result.bool){
       player.logSkill('gezi_qianghun',result.targets);
       var target=result.targets[0];
       if(player.canUse('sha',target,false)){
            player.chooseControl('弃牌','摸牌').ai=function(){
                if(event.num>0) return '摸牌';
                return '弃牌';
            }
            game.delay();
            event.target=target;
        }
   else{
        event.finish();
   }
    }
    "step 3"
    var target=event.target;
        if(result.control=='弃牌'){
            if(num>0)
                {
             player.discardPlayerCard(target,'he',event.num,true);
                }
             player.addSkill("gezi_qianghun2");
             player.addTempSkill('unequip','useCardAfter');
             player.useCard({name:'sha'},target);
             game.delay();
        }
    else{
        player.draw(event.num);
        player.addTempSkill('unequip','useCardAfter');
        player.useCard({name:'sha'},target,false)
    }
    
    },
                ai:{
                    order:1.8,
                    threaten:1.6,
                    expose:0.2,
                    result:{
                        player:function (player){
                var hs=player.getCards('h');
                var num=0;
       for(var i=0;i<hs.length;i++){
          if(get.type(hs[i])=='basic'){
              num++;
             }
         }
                 //if(get.value(cards[i])>7||get.tag(cards[i],'recover')>=1) return false;
               if(hs.length>player.hp) return 1;                                        if(num<=2) return 1;
            },
                    },
                },
            },
            "gezi_qianghun2":{
                trigger:{
                    player:"shaBegin",
                },
                nopop:true,
                forced:true,
                content:function (){
        player.removeSkill("gezi_qianghun2")
        trigger.directHit=true;
    },
            },
            "gezi_duoquan":{
                audio:["yongdi1","yongdi2"],
                trigger:{
                    player:"phaseEnd",
                },
                direct:true,
                filter:function (event,player){
        return player.countCards('h')>0;
    },
                content:function (){
        "step 0"
        var players=game.filterPlayer();
        for(var i=0;i<players.length;i++){
            if(players[i].storage.gezi_duoquan){
                players[i].addSkill('gezi_duoquan2');
            }
        }
        player.chooseCardTarget({
            filterCard:true,
            filterTarget:function(card,player,target){
                return !target.storage.gezi_duoquan;
            },
            ai1:function(card){
                return 7-get.value(card);
            },
            ai2:function(target){
                var num=target.hasSkillTag('maixie')?2:0;
                return -get.attitude(_status.event.player,target)-num;
            },
            prompt:get.prompt('gezi_duoquan')
        });
        "step 1"
        if(result.bool){
            player.logSkill('gezi_duoquan',result.targets[0]);
            result.targets[0].addSkill('gezi_duoquan2');
            result.targets[0].storage.gezi_duoquan=[result.cards[0],player];
            player.lose(result.cards[0],result.targets

[0].node.special,'toStorage');
            player.$give(1,result.targets[0]);
        }
    },
                ai:{
                    threaten:1.6,
                    expose:0.3,
                },
            },
            "gezi_feili":{
                audio:["jianshu1","jianshu2"],
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        if(target==player) return false;
        if(target.countCards('h')==0) return false;
        if(ui.selected.targets.length){
            return !ui.selected.targets[0].hasSkillTag

('noCompareSource')&&target.countCards('h')
            &&!target.hasSkillTag

('noCompareTarget');
        }
        return true;
    },
                targetprompt:["拼点发起者","被拼点者"],
                selectTarget:2,
                multitarget:true,
                content:function (){
        'step 0'
        targets[0].chooseToCompare(targets[1]);
        'step 1'
        if(result.bool){
            event.goto(3);
        }
        else if(result.tie){
           event.finish();
        }
        else{
            event.goto(6);
        }
        'step 2'
        event.finish();
        'step 3'
        targets[0].draw(2);
        targets[1].loseHp();
        'step 4'
        if(targets[0].countCards('h')>player.countCards('h')){
        targets[0].chooseCard(2,'he',true,'交给'+get.translation(player)+'两张牌');
            }
        'step 5'
        if(result.bool){
            player.gain(result.cards,targets[0]);
            targets[0].$give(result.cards,player);
        }
        event.finish();
        'step 6'
        targets[1].draw(2);
        targets[0].loseHp();
        'step 7'
        if(targets[1].countCards('h')>player.countCards('h')){
        targets[1].chooseCard(2,'he',true,'交给'+get.translation(player)+'两张牌');
        }
        'step 8'
        if(result.bool){
            player.gain(result.cards,targets[1]);
            targets[1].$give(result.cards,player);
        }
        event.finish();
    },
                ai:{
                    expose:0.4,
                    order:1.4,
                    threaten:1.8,
                    result:{
                        target:function (player,target){
                //if(player.hasUnknown()) return 0;
                if(ui.selected.targets.length) return -3;
                return -1;
            },
                    },
                },
            },
            "gezi_duoquan2":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                mark:true,
                audio:"ext:PY武将:2",
                content:function (){
        "step 0"
        if(player.storage.gezi_duoquan[1].isAlive()){
        player.chooseControl('基本牌','锦囊牌','装备牌','其它牌',true).set('ai',function(){
            if(get.type(player.storage.gezi_duoquan[0])=='basic')
               return Math.random()<0.4?'基本牌':'锦囊牌';     
            if(get.type(player.storage.gezi_duoquan[0])=='trick') 
               return Math.random()<0.3?'锦囊牌':'基本牌';
            if(get.type(player.storage.gezi_duoquan[0])=='delay') 
                return Math.random()<0.3?'锦囊牌':'基本牌';
            if(get.type(player.storage.gezi_duoquan[0])=='equip') 
                return Math.random()<0.2?'装备牌':'基本牌';
            else
                return Math.random()<0.2?'其它牌':'锦囊牌';
        }).set('prompt','请猜测夺权牌的类型');
        }
        else{
            event.goto(6);                                  
        }
        "step 1"
        event.choose=true;
         if(result.control=='基本牌'){
            player.chat('基本牌');
            if(get.type(player.storage.gezi_duoquan[0])!='basic'){
            event.choose=false;
        }  
        }
        if(result.control=='锦囊牌'){
          player.chat('锦囊牌');  if(get.type(player.storage.gezi_duoquan[0])!='trick'&&get.type(player.storage.gezi_duoquan[0])!='delay')
               {
            event.choose=false;
        }  
        }
        if(result.control=='装备牌'){
            player.chat('装备牌');
            if(get.type(player.storage.gezi_duoquan[0])!='equip'){
            event.choose=false;
        }  
        }
         if(result.control=='其它牌'){
            player.chat('其它牌');  if(get.type(player.storage.gezi_duoquan[0])!='basic'&&get.type(cards[0])!='trick'&&get.type(cards[0])!='delay'&&get.type(cards[0])!='equip'){
            event.choose=false;
        }  
        }
        "step 2"
        if(event.choose==true){
          player.storage.gezi_duoquan[1].chat('正确');  player.discardPlayerCard(player.storage.gezi_duoquan[1],'he',true);
            game.delay();
            player.draw();
            event.goto(6);
        }
        else{
            player.storage.gezi_duoquan[1].chat('错误');
            event.goto(4);
        }
        "step 3"
        event.finish();
        "step 4"
         player.storage.gezi_duoquan[1].chooseControl('获得其两张牌','令其失去一点体力').set('ai',function(){
             if(player.hasSkillTag("nolose")) return '获得其两张牌';
             if(player.countCards('he')<=1) return '令其失去一点体力';
            return '令其失去一点体力';
        })
         "step 5"
         if(result.control=='获得其两张牌'){
             player.storage.gezi_duoquan[1].gainPlayerCard('he',player,2,true);
         }
        else
        {
            player.loseHp();
        }
        "step 6"
        game.delay();
        game.cardsDiscard(player.storage.gezi_duoquan[0]);
        game.log(player.storage.gezi_duoquan[0],'进入弃牌堆');
        player.$throw(player.storage.gezi_duoquan[0],1000);
        player.removeSkill('gezi_duoquan2');
        delete player.storage.gezi_duoquan;
        event.finish();
    },
                intro:{
                    name:"夺权",
                    content:"已成为夺权目标",
                },
            },
            "gezi_jianshou":{
                audio:["yizhong1","yizhong2"],
                trigger:{
                    player:"phaseEnd",
                },
                direct:true,
                filter:function (event,player){
        return player.countCards('h')>0;
    },
                content:function (){
        "step 0"
        var next=player.chooseToDiscard(get.prompt('gezi_jianshou'),[1,Math.min(3,player.countCards('h'))]);
        next.ai=function(card){
            return 6-get.value(card);
        }
        next.logSkill='gezi_jianshou';
        "step 1"
        if(result.bool){
            player.draw(result.cards.length);
        }
    },
            },
            "gezi_jizhi":{
                audio:["mingshi1"],
                enable:"chooseToUse",
                unique:true,
                mark:true,
                skillAnimation:true,
                filter:function (event,player){
        if(player.storage.gezi_jizhi) return false;
        if(player.countCards('h')<1) return false;
        return event.type=='dying'&&event.dying;
    },
                filterTarget:function (card,player,target){
        return target==_status.event.dying;
    },
                check:function (event,player){
        if(get.attitude(player,event.player)<=0) return false;
        var cards=player.getCards('h');
        for(var i=0;i<cards.length;i++){
            if(cards[i].name=='tao') return false;
            if(get.value(cards[i])>7&&cards.length>2) return false;
        }
        return true;
    },
                init:function (player){
        player.storage.gezi_jizhi=false;
    },
                selectTarget:-1,
                content:function (){
        "step 0"
        var cards=player.getCards('h');
        var num=0;
        for(var i=0;i<cards.length;i++){ 
           if(get.type(cards[i])!='basic'){
               num++;
             }
        }
        event.cards=cards;
        event.num=num;
        "step 1"
        player.discard(event.cards);
        player.awakenSkill('gezi_jizhi');
        player.storage.gezi_jizhi=true;
        "step 2"
        target.recover(1-target.hp);
        target.draw(event.num);
        target.addTempSkill('gezi_jizhi2');
    },
                ai:{
                    order:6,
                    skillTagFilter:function (player){
            if(!_status.event.dying||player.storage.gezi_jizhi) return false;
        },
                    save:true,
                    result:{
                        target:3,
                    },
                    threaten:1.6,
                },
            },
            "gezi_jizhi2":{
                group:"gezi_jizhi3",
                trigger:{
                    player:"damageBefore",
                },
                forced:true,
                unique:true,
                locked:true,
                content:function (){
        trigger.cancel();
    },
                ai:{
                    nofire:true,
                    nothunder:true,
                    nodamage:true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.tag(card,'damage')) return [0,0];
            },
                    },
                },
            },
            "gezi_jizhi3":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                nopop:true,
                content:function (){
        player.removeSkill("gezi_jizhi2");
    },
            },
            "gezi_yonglixin":{
                trigger:{
                    player:"phaseDrawBefore",
                },
                audio:["lirang1","lirang2"],
                frequent:true,
                content:function (){
        "step 0"
        trigger.cancel();
        "step 1"
        event.cards=get.cards(4);
        player.showCards(event.cards);
        "step 2"
        event.basic=[];
        event.nonbasic=[];
          for(var i=0;i<event.cards.length;i++){
            if(get.type(event.cards[i])!='basic'){
                event.nonbasic.push(event.cards[i]);
            }
            else{
                event.basic.push(event.cards[i]);
            }
          }
          
          "step 3"
          player.gain(event.nonbasic,'gain2','log');
          "step 4"
          if(event.basic.length==0) event.finish();
          "step 5"
        player.chooseTarget('请选择给出基本牌的目标',function(card,player,target){
            return true;
        }).set('ai',function(target){
            var player=_status.event.player;
            return get.attitude(player,target);
        });
        
           "step 6"
        if(result.bool){
            result.targets[0].gain(event.basic,'gain2','log');
            player.recover();
        }
     },
                ai:{
                    threaten:1.6,
                    expose:0.2,
                },
            },
            "gezi_weimu":{
                trigger:{
                    global:"useCard",
                },
                audio:["weimu1","weimu2"],
                forced:true,
                filter:function (event,player,card){
        if(get.color(event.card)!='black') return false;
        return event.card.name=='nanman'&&player!=event.player||event.card.name=='wanjian'&&player!=event.player||event.card.name=='taoyuan'&&player.hp<player.maxHp||event.card.name=='wugu';
    },
                content:function (){},
                mod:{
                    targetEnabled:function (card){
            if((get.type(card)=='trick'||get.type(card)=='delay')&&
                get.color(card)=='black') return false;
        },
                },
            },
            "gezi_xiance":{
                audio:["luanwu1"],
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.countCards('h',{color:'black'})>0&&game.hasPlayer(function(current){
            return current.countCards('h')==0;
        });
    },
                filterTarget:function (card,player,target){
        if(player==target) return false;
        if(target.countCards('h')<1) return true;
        return false;
    },
                prompt:"请选择一名没有手牌的角色",
                filterCard:{
                    color:"black",
                },
                position:"h",
                check:function (card){
        return 8-get.value(card);
    },
                discard:false,
                direct:true,
                content:function (){
        'step 0'
         player.$give(cards,targets[0]);
        targets[0].gain(cards,player);
        'step 1'
        player.chooseTarget('请选择出【杀】的目标',function(card,player,target){
            return target!=player&&targets[0].canUse({name:'sha'},target,false);
        }).set('ai',function(target){
            return  get.effect(target,{name:'sha'},targets[0],targets[0]);
        });
        'step 2'
        if(result.bool){
        targets[0].useCard({name:'sha'},result.targets[0],false);
        }
    },
                ai:{
                    expose:0.2,
                    order:3.9,
                    result:{
                        target:function (player,target){
                return 1;
            },
                    },
                },
            },
            "gezi_bingmou":{
                skillAnimation:"epic",
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                unique:true,
                filter:function (event,player){
        return player.storage.gezi_shanbing>=3;
    },
                content:function (){
        player.loseMaxHp();
        player.draw(2);
        player.addSkill('gezi_wansha');
        player.addSkill('gezi_duji');
        player.awakenSkill('gezi_bingmou');
    },
            },
            "gezi_wansha":{
                locked:true,
                audioname:["wansha1","wansha2"],
                global:"gezi_wansha2",
                trigger:{
                    global:"dying",
                },
                priority:15,
                forced:true,
                filter:function (event,player){
        return _status.currentPhase==player&&event.player!=player;
    },
                content:function (){},
            },
            "gezi_wansha2":{
                mod:{
                    cardSavable:function (card,player){
            if(!_status.currentPhase) return;
            if(_status.currentPhase.hasSkill('gezi_wansha')&&_status.currentPhase!=player){
                if(card.name=='tao'&&_status.event.dying!=player) return false;
            }
        },
                },
            },
            "gezi_duji":{
                trigger:{
                    player:"phaseEnd",
                },
                audio:["wansha_shen_simayi1","wansha_shen_simayi2"],
                direct:true,
                filter:function (event,player){
        return player.storage.gezi_shanbing>0;
    },
                content:function (){
        "step 0"
        player.chooseTarget('请选择出【毒计】的目标',function(card,player,target){
            return target!=player;
        }).set('ai',function(target){
            return  false;
        });
        "step 1"
        if(result.bool){
            player.storage.gezi_shanbing--;
            player.updateMarks("gezi_shanbing");
            result.targets[0].draw(3);
            var num=result.targets[0].maxHp-result.targets[0].hp;
            if(num>0){
            result.targets[0].recover(num);
            }
            result.targets[0].addSkill("gezi_duji2");
            player.addSkill("gezi_duji3");
        }
    },
            },
            "gezi_shanbing":{
                trigger:{
                    player:"useCardBefore",
                },
                init:function (player){
        player.storage.gezi_shanbing=2;
     },
                marktext:"谋",
                intro:{
                    content:function (storage){
            if(storage==0) return '没有【善兵】标记';
            return '已拥有'+storage+'个【善兵】标记';
        },
                },
                mark:true,
                forced:true,
                silent:true,
                filter:function (event,player){
        return event.card&&get.type(event.card,'trick')=='trick';
    },
                content:function (){
        player.addSkill("gezi_shanbing_shanghai");
    },
                group:"gezi_shanbing_cancel",
                subSkill:{
                    cancel:{
                        trigger:{
                            player:"useCardAfter",
                        },
                        filter:function (event,player){
        if(get.type(event.card,'trick')=='trick') return true;
        return false;
    },
                        forced:true,
                        silent:true,
                        content:function (){
        if(player.hasSkill("gezi_shanbing_shanghai"))
            {
                player.removeSkill("gezi_shanbing_shanghai")
            }
    },
                        sub:true,
                        popup:false,
                    },
                    shanghai:{
                        audio:["wansha_boss_lvbu32"],
                        trigger:{
                            source:"damageEnd",
                        },
                        filter:function (event,player){
              return event.card&&get.type(event.card,'trick')=='trick';
          },
                        forced:true,
                        content:function (){
               player.storage.gezi_shanbing++;
               player.updateMarks("gezi_shanbing");
               player.removeSkill("gezi_shanbing_shanghai");
            },
                        sub:true,
                    },
                },
                popup:false,
            },
            "gezi_duji2":{
                trigger:{
                    player:"phaseBegin",
                    global:"phaseBegin",
                },
                mark:true,
                intro:{
                    content:function (storage){
            return '每名角色的回合开始阶段需弃置一张手牌或失去一点体力';
        },
                },
                direct:true,
                nopop:true,
                filter:function (event,player){
        return game.filterPlayer(function(current){
            return current.hasSkill("gezi_duji3");
        });
    },
                content:function (){
        "step 0"
               var next=player.chooseToDiscard(get.prompt('gezi_duji2'),'h');
        next.ai=function(card){
            return 8-get.value(card);
        }
        next.logSkill='gezi_duji2';
        "step 1"
        if(result.bool==false){
            player.loseHp();
        }
    },
            },
            "gezi_duji3":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                silent:true,
                priority:9,
                content:function (){
        player.removeSkill("gezi_duji3");
        var players=game.filterPlayer(function(current){
            return current.hasSkill("gezi_duji2");
        });
        for(var i=0;i<players.length;i++){
        players[i].removeSkill("gezi_duji2");
        }
    },
                popup:false,
            },
            "gezi_kuifa":{
                mod:{
                    maxHandcard:function (player,num){
            return num-2;
        },
                },
                audio:["qixing1","qixing2"],
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function (){
        trigger.num++;
    },
            },
            "gezi_yangzhan":{
                audio:["kuangfeng1"],
                trigger:{
                    source:"dieAfter",
                },
                init:function (player){
        player.storage.gezi_yangzhan=0;
    },
                mark:true,
                intro:{
                    content:function (storage){
            return '[养战]:增加'+storage*3+'点手牌上限';
        },
                },
                forced:true,
                filter:function (event,player){
        return _status.currentPhase=player;
    },
                content:function (){
        "step 0"
       player.draw(3);
        "step 1"
        if(!player.storage.gezi_yangzhan){
            player.storage.gezi_yangzhan=1;
        }
        else{
            player.storage.gezi_yangzhan++;
        }

    },
                mod:{
                    maxHandcard:function (player,num){
            var num2=player.storage.gezi_yangzhan
           if(num2>0) return num+3*num2;
        },
                },
            },
            "gezi_jingqi":{
                audio:["bazhen1","bazhen2"],
                trigger:{
                    player:"useCard",
                },
                forced:true,
                filter:function (event,player){
        return !player.getEquip(1)&&event.card.name=='sha'&&player.getStat().card.sha>1&&event.getParent().type=='phase';
    },
                content:function (){},
                mod:{
                    cardUsable:function (card,player,num){
            if(!player.getEquip(1)&&card.name=='sha') return Infinity;
        },
                },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(!get.zhu(player,'shouyue')) return false;
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "gezi_quanxiang":{
                audio:["kongcheng1","kongcheng2"],
                enable:"phaseUse",
                usable:1,
                filterCard:{
                    suit:"heart",
                },
                position:"he",
                filter:function (event,player){
        return player.countCards('he',{suit:'heart'})>0;
    },
                check:function (card){
        return 6-get.value(card);
        return false;
    },
                content:function (){
        'step 0'
      var hs=player.getCards('h');
      var num=0;
       for(var i=0;i<hs.length;i++){
          if(get.type(hs[i])=='basic'){
              num++;
             }
         }
       event.num=num;
        'step 1'
        player.chooseTarget(get.prompt('gezi_quanxiang')).set('ai',function(target){
            var player=_status.event.player;
            var hs=target.getCards('h');
            if(event.num>=hs.length){
                return get.attitude(player,target);
            }
            else
                {
                 return -1;
                }
        });
        'step 2'
        if(result.bool){
            player.logSkill('gezi_quanxiang',result.targets);
            var target=result.targets[0];
            event.target=target;
            target.judge(function(card){
                if(get.color(card)=='red') return 1;
                return 0;
            });
        }
        else{
            event.finish();
        }
        'step 3'
        if(result.color){
            if(result.color=='red'){
            var hs=event.target.getCards('h');
            player.gain(hs,event.target);
            event.target.$give(hs,player);
            event.target.draw(event.num);
            event.goto(5);
            }
            else{
                player.loseHp();
            }
        }
        'step 4'
        event.finish();
        'step 5'
                player.chooseTarget('请选择出【杀】的目标',function(card,player,target){
            return event.target.canUse({name:'sha'},target,false);
        }).set('ai',function(target){
            return  get.effect(target,{name:'sha'},event.target,event.target);
        });
        'step 6'
        if(result.bool){
        event.target.useCard({name:'sha'},result.targets[0],false);
        }
    },
                ai:{
                    expose:0.3,
                    result:{
                        player:1,
                    },
                },
            },
        },
        translate:{
            "gezi_xianwei":"显威",
            "gezi_xianwei_info":"锁定技，当你的体力值为1时，你造成的伤害+1，摸牌阶段摸牌数+1，手牌上限+2。",
            "gezi_xianwei2":"显威",
            "gezi_xianwei2_info":"",
            "gezi_yongjue":"勇决",
            "gezi_yongjue_info":"出牌阶段限一次，你可以将一张红色手牌当【决斗】使用。若此牌对对方造成了伤害，你可以弃置一张装备牌并摸两张牌，然后你对其使用牌无距离和次数限制。",
            "gezi_yongjue2":"勇绝",
            "gezi_yongjue2_info":"",
            "gezi_yongjue3":"勇绝",
            "gezi_yongjue3_info":"",
            "gezi_yongjue4":"勇绝",
            "gezi_yongjue4_info":"",
            "gezi_qianghun":"枪魂",
            "gezi_qianghun_info":"出牌阶段限两次，你可以将所有手牌弃置，视为对一名其他角色使用了一张无视防具的【杀】。若如此做，你需选择一项：弃置其X张牌，此【杀】不可闪避；2，你摸X张牌，此【杀】不计入本回合使用杀的次数（X为你弃置牌中的基本牌数量）。",
            "gezi_qianghun2":"枪魂",
            "gezi_qianghun2_info":"",
            "gezi_duoquan":"夺权",
            "gezi_duoquan_info":"回合结束阶段，你可以将一张手牌盖在一名角色的武将牌上，其回合开始时需猜测此牌类型，若猜中，其弃置你一张牌并摸一张牌，若没猜中，你获得其两张牌或使其失去一点体力。",
            "gezi_feili":"废立",
            "gezi_feili_info":"出牌阶段限一次，你可以选择两名其他角色进行拼点，胜者摸两张牌，若此时其手牌大于你，需给你两张牌，败者失去一点体力。",
            "gezi_duoquan2":"夺权",
            "gezi_duoquan2_info":"",
            "gezi_jianshou":"坚守",
            "gezi_jianshou_info":"结束阶段，你可以弃置至多三张手牌并摸等量的牌。",
            "gezi_jizhi":"急智",
            "gezi_jizhi_info":"限定技，当一名角色进入濒死时，你可以弃置所有手牌，令其体力回复至一点并摸X张牌，然后免疫所有伤害直到其回合开始（X为你弃置的牌中非基本牌的数量）。",
            "gezi_jizhi2":"急智",
            "gezi_jizhi2_info":"锁定技，免疫所有伤害直到回合开始。",
            "gezi_jizhi3":"急智",
            "gezi_jizhi3_info":"",
            "gezi_yonglixin":"拥立",
            "gezi_yonglixin_info":"摸牌阶段，你可以放弃摸牌，亮出牌堆顶的四张牌，获得其中的非基本牌，然后将剩余的牌交给任一角色。若给出的牌大于0，你回复一点体力。",
            "gezi_weimu":"帷幕",
            "gezi_weimu_info":"锁定技，你不能成为黑色锦囊牌的目标。",
            "gezi_xiance":"献策",
            "gezi_xiance_info":"出牌阶段限一次，你可以将一张黑色手牌交给一名没有手牌的角色，可以视为该角色对你指定的除你外的其他角色使用了一张【杀】。",
            "gezi_bingmou":"兵谋",
            "gezi_bingmou_info":"觉醒技，你的回合开始阶段，若你已拥有三个或更多的【谋】，你需自减一点体力上限，摸两张牌，获得技能【完杀】和【毒计】。",
            "gezi_wansha":"完杀",
            "gezi_wansha_info":"在你的回合，除你以外，只有处于濒死状态的角色才能使用【桃】。",
            "gezi_wansha2":"完杀",
            "gezi_wansha2_info":"",
            "gezi_duji":"毒计",
            "gezi_duji_info":"回合结束阶段，你可以弃置一个【谋】，另一名其他角色摸三张牌并将体力回复至体力上限，然后从你的下个玩家回合开始，任意玩家的回合开始阶段，其需弃置一张手牌或失去一点体力，直到你的下个回合开始阶段，额外的，若期间当你死亡其会一直持续此状态。",
            "gezi_shanbing":"善兵",
            "gezi_shanbing_info":"锁定技，游戏开始时你拥有两张【谋】。你使用锦囊牌造成伤害后获得一个【谋】标记。每个锦囊牌只能触发一次。",
            "gezi_duji2":"毒计",
            "gezi_duji2_info":"",
            "gezi_duji3":"毒计",
            "gezi_duji3_info":"",
            "gezi_kuifa":"匮乏",
            "gezi_kuifa_info":"锁定技，你的摸牌阶段摸牌+1，手牌上限-2。",
            "gezi_yangzhan":"养战",
            "gezi_yangzhan_info":"锁定技，你的回合内，每杀死一名角色，你摸三张牌，并且手牌上限永久+3（可叠加）。",
            "gezi_jingqi":"精器",
            "gezi_jingqi_info":"锁定技，你没有武器牌时，你使用【杀】无次数限制。",
            "gezi_quanxiang":"劝降",
            "gezi_quanxiang_info":"出牌阶段限一次，你可以弃置一张红桃牌，令一名角色进行一次判定，若为红色，其需将所有手牌交给你再摸X张牌（X为你手牌中的基本牌），并可以视为其对你所指定的一名其他角色使用了一张【杀】，若为黑色，你失去一点体力。",
        },
    },
    intro:"群友的设计。bug修复，部分调整和优化。",
    author:"鸽子",
    diskURL:"",
    forumURL:"",
    version:"1.1",
},files:{"character":["gezi_simazhao.jpg","gezi_sunce.jpg","gezi_zhaotong.jpg","gezi_zhugeliang.jpg","gezi_jiakui.jpg","gezi_jiayu.jpg"],"card":[],"skill":[]}}};