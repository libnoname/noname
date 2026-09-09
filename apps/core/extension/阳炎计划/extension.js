import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"阳炎计划",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "如月伸太郎":["male","qun",4,["如月目烧","如月目缠"],["des:无限的轮回，最终会让纠缠的事物重现。"]],
            "文乃":["female","qun",4,["目挂"],["forbidai","des:善良的心，是任何物质都取代不了的。"]],
            "如月桃":["female","qun",4,["如月目夺"],["des:有着令人羡慕的能力，也就是夺目的人了。"]],
            "木户蕾":["female","qun",3,["木户目隐"],["des:习惯低调，平凡就是最好的。"]],
            "九之濑遥":["male","qun",2,["目简"],["des:变得单纯，世界也就变得简单了。"]],
            "濑户幸助":["male","qun",4,["目盗"],["des:与生俱来的傲气，无需加冕。"]],
            "楯山文乃":["female","qun",4,["盾山目愿"],["des:善良的心，是任何物质都取代不了的。"]],
            "雨宫响也":["male","qun",3,["目凝","车祸组1"],["des:注视的东西少了，自然可以凝聚目标。"]],
            "朝比奈日和":["female","qun",3,["目凝","车祸组2"],["des:注视的东西少了，自然可以凝聚目标。"]],
            "茉莉":["female","qun",2,["目合"],["des:单纯，未必是好事，未必是坏事。"]],
            "鹿野修哉":["male","qun",4,["目欺"],["des:微笑的背后，不一定是喜悦。"]],
            ene:["female","qun",1,["目觉"],["des:懂得了太多东西，也就觉察到了世态炎凉"]],
        },
        translate:{
            "如月伸太郎":"如月伸太郎",
            "文乃":"文乃",
            "如月桃":"如月桃",
            "木户蕾":"木户蕾",
            "九之濑遥":"九之濑遥",
            "濑户幸助":"濑户幸助",
            "楯山文乃":"楯山文乃",
            "雨宫响也":"雨宫响也",
            "朝比奈日和":"朝比奈日和",
            "茉莉":"茉莉",
            "鹿野修哉":"鹿野修哉",
            ene:"ene",
        },
    },
    card:{
        card:{
            "桃":{
                fullskin:true,
                type:"basic",
                cardcolor:"red",
                toself:true,
                enable:function (card,player){
        return player.hp<player.maxHp;
    },
                savable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player&&target.hp<target.maxHp;
    },
                modTarget:function (card,player,target){
        return target.hp<target.maxHp;
    },
                content:function (){
    },
                ai:{
                    basic:{
                        order:function (card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                        useful:[8,6.5,5,4],
                        value:[8,6.5,5,4],
                    },
                    result:{
                        target:function (player,target){
                // if(player==target&&player.hp<=0) return 2;
                var nd=player.needsToDiscard();
                var keep=false;
                if(nd<=0){
                    keep=true;
                }
                else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
                    keep=true;
                }
                var mode=get.mode();
                if(target.hp>=2&&keep&&target.hasFriend()){
                    if(target.hp>2||nd==0) return 0;
                    if(target.hp==2){
                        if(game.hasPlayer(function(current){
                            if(target!=current&&get.attitude(target,current)>=3){
                                if(current.hp<=1) return true;
                                if((mode=='identity'||mode=='versus'||mode=='chess')&&current.identity=='zhu'&&current.hp<=2) return true;
                            }
                        })){
                            return 0;
                        }
                    }
                }
                if(target.hp<0&&target!=player&&target.identity!='zhu') return 0;
                var att=get.attitude(player,target);
                if(att<3&&att>=0&&player!=target) return 0;
                var tri=_status.event.getTrigger();
                if(mode=='identity'&&player.identity=='fan'&&target.identity=='fan'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'&&tri.source!=target){
                        var num=game.countPlayer(function(current){
                            if(current.identity=='fan'){
                                return current.countCards('h','tao');
                            }
                        });
                        if(num>1&&player==target) return 2;
                        return 0;
                    }
                }
                if(mode=='identity'&&player.identity=='zhu'&&target.identity=='nei'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='zhong'){
                        return 0;
                    }
                }
                if(mode=='stone'&&target.isMin()&&
                player!=target&&tri&&tri.name=='dying'&&player.side==target.side&&
                tri.source!=target.getEnemy()){
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
        },
        translate:{
            "桃":"桃",
            "桃_info":"出牌阶段，对自己使用，回复一点体力。",
        },
        list:[],
    },
    skill:{
        skill:{
            "目烧":{
                nobracket:true,
                trigger:{
                    player:"phaseEnd",
                },
                init:function (player){
        player.storage.目缠=[];
    },
                prompt:function (event,player){
        return '是否令1名角色获得回合角色本回合弃置的牌';
    },
                filter:function (event,player){
        return player.storage.目缠.length>0;
    },
                mark:true,
                direct:true,
                content:function (){ 
         'step 0'
        player.chooseTarget(get.prompt('目烧'),function(card,player){
            return true;
        }).ai=function(player){
            return get.attitude(player);
            return false;
        }
        'step 1'
        if(result.bool){            
            result.targets[0].gain(player.storage.目缠);
            result.targets[0].$gain(player.storage.目缠);
            player.unmarkSkill('目缠');
            delete player.storage.目缠;
            player.storage.目缠=[];
        }
        else{
            delete player.storage.目缠;
            player.storage.目缠=[];
            player.unmarkSkill('目缠');
        }
    },
            },
            "如月目烧":{
                enable:"phaseUse",
                filter:function (event,player){
        return player.hujia?true:false;
    },
                content:function (){
         'step 0'
        event.num=0
         'step 1'
      if(Math.random()<=1){
       player.damage();
}
        event.num++
         'step 2'
      if(event.num=player.hujia) event.goto(1)     
         'step 3'
         player.node.avatar.setBackgroundImage('extension/阳炎计划/伸子.jpg');
        player.addSkill('阳炎世界');       
        player.removeSkill('如月目缠');  
        player.removeSkill('如月目烧');
    },
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){
                var eff=get.damageEffect(target,player,target)+0.5;
                if(eff>0&&eff<=0.5) return 0;
                return eff;
            },
                    },
                },
            },
            "如月目缠":{
                nobracket:true,
                trigger:{
                    player:"discardAfter",
                },
                filter:function (event,player){       
        if(!player.countCards('he')) return false;
        for(var i=0;i<event.cards.length;i++){
            if(get.position(event.cards[i])=='d'){
                return true;
            }
        }
        return false;
    },
                direct:true,
                unique:true,
                gainable:true,
                content:function (){
        player.changeHujia(Math.min(6)-player.num('h'));
    },
                group:"如月目缠_hujia1",
                subSkill:{
                    "hujia1":{
                        trigger:{
                            player:"damageZero",
                        },
                        filter:function (event){
                return event.hujia;
            },
                        forced:true,
                        content:function (){
                var list=["sha",];
        player.gain(game.createCard(list.randomGet()));
        player.$draw();
            },
                        sub:true,
                    },
                },
                ai:{
                    threaten:function (player,target){
            if(target.hujia){
                return 0.5;
            }
            else{
                return 2;
            }
        },
                },
            },
            "阳炎世界":{
                unique:true,
                skillAnimation:true,
                trigger:{
                    player:"changeHp",
                },
                forced:true,
                priority:100,
                filter:function (event,player){
    return player.hp<=0
},
                content:function (){
        "step 0"
        player.uninit;
        player.init(player.name,'文乃');
        player.node.avatar.setBackgroundImage('extension/阳炎计划/伸子2.jpg');
        player.recover(1);
         'step 2'
         player.addSkill('目烧');
        player.removeSkill('如月目缠');  
        player.removeSkill('如月目烧');
        player.removeSkill('阳炎世界');
    },
            },
            "目夺":{
                nobracket:true,
                trigger:{
                    player:"phaseAfter",
                },
                forced:true,
                unique:true,
                content:function (){              
        player.removeSkill('目夺');  
    },
                mod:{
                    targetEnabled:function (card,player,target){
            if(player.hasSkill('如月目夺')) return;
            if(card.name=='sha'){
                if(target.hasSkill('如月目夺')) return;
                if(game.hasPlayer(function(current){
                    return current.hasSkill('如月目夺')&&current.hp>=current.countCards('h')&&
                        get.distance(player,current,'attack')<=1;
                })){
                    return false;
                }
            }
        },
                },
                sub:true,
            },
            "如月目夺":{
                nobracket:true,
                enable:"phaseUse",
                usable:1,
                unique:true,
                forced:true,
                content:function (){
        'step 0'
                            event.list=player.getFriends().sortBySeat();
                           
        "step 2"
    for(var i=0;i<game.players.length;i++){
if(ai.get.attitude(game.players[i],player)<=0){
game.players[i].addSkill('目夺');   
    var chat=['大家，看这里！',].randomGet()
                  player.say(chat);
}
}
},
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
                fullimage:true,
            },
            "目挂":{
                nobracket:true,
                trigger:{
                    player:"discardAfter",
                },
                forced:true,
                popup:false,
                priority:-1,
                filter:function (event,player){
        if(_status.currentPhase!=event.player) return false;
        for(var i=0;i<event.cards.length;i++){
            if(get.position(event.cards[i])=='d'){
                return true;
            }
        }
        return false;
    },
                content:function (){
        for(var i=0;i<trigger.cards.length;i++){
            if(get.position(trigger.cards[i])=='d'){
                player.storage.目缠=player.storage.目缠.concat(trigger.cards[i]);
            }
        }        
    },
                intro:{
                    content:"cards",
                },
            },
            "目隐":{
                nobracket:true,
                trigger:{
                    player:"phaseBegin",
                },
                content:function (){              
        player.removeSkill('目隐');  
    },
                mod:{
                    targetEnabled:function (card,player,target,now){
            if(target.countCards('h')>=0){
                if(card.name=='sha'||card.name=='juedou') return false;
            }
        },
                },
                ai:{
                    noh:true,
                    skillTagFilter:function (player,tag){
            if(tag=='noh'){
                if(player.countCards('h')!=1) return false;
            }
        },
                },
            },
            "木户目隐":{
                nobracket:true,
                enable:"phaseUse",
                usable:9,
                unique:true,
                prompt:"请选择1名角色",
                priority:101,
                filterTarget:function (card,player,target){
        if(target==player) return false;
        return true;
    },
                content:function (){
       "step 1" 
       target.addSkill('目隐');
        "step 2"
        player.addSkill('目隐'); 
   
    },
            },
            "目醒":{
                trigger:{
                    player:["recoverBegin","drawBefore"],
                    source:"damageBegin",
                },
                forced:true,
                priority:20,
                content:function (){ 
        trigger.num=trigger.num*2;
    },
                sub:true,
            },
            "目简":{
                nobracket:true,
                trigger:{
                    global:"gameStart",
                },
                forced:true,
                unique:true,
                inherit:" ",
                content:function (){
        "step 0"
        player.node.avatar.setBackgroundImage('extension/阳炎计划/理想的身体.jpg');
        player.maxHp=4;
        player.hp=4;
        "step 1"
        player.addSkill('目醒'); 
    },
            },
            "目盗":{
                nobracket:true,
                enable:"phaseUse",
                filterTarget:function (card,player,target){
        return target!=player&&target.countCards('h');
    },
                content:function (){
        'step 0'
        if(player.countCards('h')){
            player.chooseCardButton('目盗',target.getCards('h')).ai=function(button){
                return get.value(button.link)-5;
            }
        }
        else{
            player.viewHandcards(target);
            event.finish();
        }
        'step 1'
        if(result.bool){
            event.card=result.links[[0]];
            player.chooseCard('h',true,'用一张手牌替换'+get.translation(event.card)).ai=function(card){
                return -get.value(card);
            };
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.bool){
            player.gain(event.card,target);
            target.gain(result.cards,player);
            player.$giveAuto(result.cards,target);
            target.$giveAuto(event.card,player);
            game.log(player,'与',target,'交换了一张手牌');
        }
    },
            },
            "盾山目愿":{
                nobracket:true,
                audio:"ext:阳炎计划:2",
                enable:"phaseUse",
                filterCard:true,
                selectCard:[1,Infinity],
                discard:false,
                prepare:"give",
                filterTarget:function (card,player,target){
        return player!=target;
    },
                check:function (card){
        if(ui.selected.cards.length>1) return 0;
        if(ui.selected.cards.length&&ui.selected.cards[0].name=='du') return 0;
        if(!ui.selected.cards.length&&card.name=='du') return 20;
        var player=get.owner(card);
        if(player.hp==player.maxHp||player.storage.rende<0||player.countCards('h')<=1){
            if(ui.selected.cards.length){
                return -1;
            }
            var players=game.filterPlayer();
            for(var i=0;i<players.length;i++){
                if(players[i].hasSkill('haoshi')&&
                    !players[i].isTurnedOver()&&
                    !players[i].hasJudge('lebu')&&
                    get.attitude(player,players[i])>=3&&
                    get.attitude(players[i],player)>=3){
                    return 11-get.value(card);
                }
            }
            if(player.countCards('h')>player.hp) return 10-get.value(card);
            if(player.countCards('h')>2) return 6-get.value(card);
            return -1;
        }
        return 10-get.value(card);
    },
                content:function (){
        target.gain(cards,player);
        if(typeof player.storage.rende!='number'){
            player.storage.rende=0;
        }
        if(player.storage.rende>=0){
            player.storage.rende+=cards.length;
            if(player.storage.rende>=2){
                player.storage.rende=-1;
            }
        }
    },
                ai:{
                    order:function (skill,player){
            if(player.hp<player.maxHp&&player.storage.rende<2&&player.countCards('h')>1){
                return 10;
            }
            return 1;
        },
                    result:{
                        target:function (player,target){
                if(target.hasSkillTag('nogain')) return 0;
                if(ui.selected.cards.length&&ui.selected.cards[0].name=='du'){
                    if(target.hasSkillTag('nodu')) return 0;
                    return -10;
                }
                if(target.hasJudge('lebu')) return 0;
                var nh=target.countCards('h');
                var np=player.countCards('h');
                if(player.hp==player.maxHp||player.storage.rende<0||player.countCards('h')<=1){
                    if(nh>=np-1&&np<=player.hp&&!target.hasSkill('haoshi')) return 0;
                }
                return Math.max(1,5-nh);
            },
                    },
                    effect:{
                        target:function (card,player,target){
                if(player==target&&get.type(card)=='equip'){
                    if(player.countCards('e',{subtype:get.subtype(card)})){
                        var players=game.filterPlayer();
                        for(var i=0;i<players.length;i++){
                            if(players[i]!=player&&get.attitude(player,players[i])>0){
                                return 0;
                            }
                        }
                    }
                }
            },
                    },
                    threaten:0.8,
                },
            },
            "目凝":{
                nobracket:true,
                mod:{
                    globalFrom:function (from,to,distance){
            return distance-Infinity;
        },
                },
            },
            "车祸组1":{
                nobracket:true,
                enable:"phaseUse",
                filter:function (event,player){
        if(!game.hasPlayer(function(current){
            return current.name=='朝比奈日和';
        })){
            return false;
        }
        return !player.storage.boss_xingxia||game.roundNumber-player.storage.boss_xingxia>=2;
    },
                unique:true,
                filterTarget:function (card,player,target){
        return target.name=='朝比奈日和';
    },
                selectTarget:-1,
                line:"fire",
                content:function (){
        player.damage(3);
        target.recover(3); 
        target.addSkill('车祸组男'); 
        player.removeSkill('车祸组1');
        ui.backgroundMusic.src=lib.assetURL+'extension/阳炎计划/车祸组.mp3';  
        target.phase();
    },
                contentAfter:function (){
        var chat=['我讨厌夏天吧'].randomGet()
        player.say(chat)
    },
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
                fullimage:true,
            },
            "车祸组2":{
                nobracket:true,
                enable:"phaseUse",
                filter:function (event,player){
        if(!game.hasPlayer(function(current){
            return current.name=='雨宫响也';
        })){
            return false;
        }
        return !player.storage.boss_xingxia||game.roundNumber-player.storage.boss_xingxia>=2;
    },
                unique:true,
                filterTarget:function (card,player,target){
        return target.name=='雨宫响也';
    },
                selectTarget:-1,
                line:"fire",
                content:function (){
        player.damage(2);
        target.recover(4);
        target.addSkill('车祸组女'); 
        player.removeSkill('车祸组2');
        ui.background.setBackgroundImage('extension/阳炎计划/车祸组轮回.jpg'); 
        target.phase();                    
    },
                contentAfter:function (){
        var chat=['我……最讨厌夏天了'].randomGet()
        player.say(chat)
    },
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
                fullimage:true,
            },
            "目合":{
                nobracket:true,
                trigger:{
                    player:["damageBegin"],
                },
                priority:-100,
                unique:true,
                filter:function (event,player){
     return (event.source!=undefined)&&event.num<=player.hp;
     },
                check:function (event,player){
        return ai.get.attitude(player,event.source)<=0;
    },
                content:function (){
          'step 0'
        trigger.source.addSkill('目合石化')._triggered=null;
          "step 1" 
          trigger.untrigger();
    trigger.finish();
        player.recover(1);
     },
                ai:{
                    result:{
                        target:function (card,player,target,current){        
       if(get.tag(card,'damage')){
                        if(player.hasSkillTag('jueqing')) return [1,-2];                      
 if(player.countCards('h','tao')<1&&target.hp<=1&&get.tag(card,'damage')) return [1,0,0,-2];
      }
               },
                    },
                },
            },
            "目合石化":{
                trigger:{
                    player:"phaseBefore",
                },
                forced:true,
                content:function (){
    trigger.untrigger();
    trigger.finish();
    player.removeSkill('目合石化');
},
            },
            "目觉":{
                nobracket:true,
                enable:"phaseUse",
                usable:1,
                unique:true,
                prompt:"请选择1名角色",
                priority:101,
                filterTarget:function (card,player,target){
        if(target==player) return false;
        return true;
    },
                content:function (){
       "step 1" 
       target.uninit;
       target.init(player.name,'ene')
        target.addSkill('hunzi');
        target.removeSkill('目觉'); 
        "step 2"
        player.node.name.innerHTML="榎<br>本<br>贵<br>音";        
        player.update()
        player.maxHp=4;
        player.hp=4;
        player.node.avatar.setBackgroundImage('extension/阳炎计划/榎本贵音.jpg');
        player.addSkill('双枪');
        player.out(2);  
    },
                ai:{
                    order:9.5,
                    result:{
                        target:function (player,target){
                return ai.get.damageEffect(target,player);
            },
                    },
                    expose:0.2,
                },
            },
            "双枪":{
                nobracket:true,
                mod:{
                    targetInRange:function (card,player,target,now){
            if(card.name=='sha') return true;
        },
                    cardUsable:function (card,player,num){
          if(card.name=='sha') return Infinity;
    },
                },
                trigger:{
                    player:"shaBegin",
                },
                forced:true,
                filter:function (event,player){
    return event.card&&event.card.name=='sha';
    },
                content:function (){
     trigger.directHit=true;   
    },
            },
            "目欺":{
                nobracket:true,
                enable:"phaseUse",
                usable:1,
                content:function (){ 
        "step 0"
        if(player.storage.目欺){
            player.chooseButton(ui.create.dialog(player.storage.目欺))
        } 
        "step 1"
        if(result.bool){
            var skills=result.buttons[0].link.skills
            player.setAvatar('鹿野修哉',result.buttons[0].link.name);
            player.addAdditionalSkill('目欺',skills);
        }
        else{            
            player.chooseControl('鹿野修哉','如月伸太郎','九之濑遥','濑户幸助','孙策')
        }
        "step 2"
        if(result.control=='鹿野修哉'){
            player.removeAdditionalSkill('目欺');
            player.addSkill('桃');
            player.removeSkill('目盗1'); 
            player.removeSkill('目缠1');  
            player.removeSkill('目欺1'); 
            player.removeSkill('对话1');  
            player.node.name.innerHTML="鹿<br>野<br>修<br>哉";        
            player.update()
            player.node.avatar.setBackgroundImage('extension/阳炎计划/鹿野修哉1.jpg');
        }
        if(result.control=='九之濑遥'){
            player.removeAdditionalSkill('目欺');
            player.setAvatar('鹿野修哉','九之濑遥');
            player.addSkill('目欺1');
            player.removeSkill('目盗1');  
            player.removeSkill('目缠1');  
            player.node.name.innerHTML="九<br>之<br>濑<br>遥";        
            player.update()
        }
        if(result.control=='如月伸太郎'){
            player.removeAdditionalSkill('目欺');
            player.setAvatar('鹿野修哉','如月伸太郎');
            player.addSkill('目缠1');
            player.removeSkill('目盗1');  
            player.removeSkill('目欺1');  
            player.removeSkill('对话1'); 
            player.node.name.innerHTML="如<br>月<br>伸<br>太<br>郎"; 
        }
        if(result.control=='濑户幸助'){
            player.removeAdditionalSkill('目欺');
            player.setAvatar('鹿野修哉','濑户幸助');
            player.addSkill('目盗1');
            player.removeSkill('目缠1');  
            player.removeSkill('目欺1'); 
            player.removeSkill('对话1'); 
            player.node.name.innerHTML="濑<br>户<br>幸<br>助"; 
        }
        if(result.control=='孙策'){
            player.removeAdditionalSkill('目欺');
            player.node.name.innerHTML="孙<br>策"; 
            player.removeSkill('目盗1');  
            player.removeSkill('目欺1'); 
            player.removeSkill('目缠1');  
            player.removeSkill('对话1'); 
            player.node.avatar.setBackgroundImage('extension/阳炎计划/sunce.jpg');
        }
    },
            },
            "桃":{
                trigger:{
                    player:"discardAfter",
                },
                direct:true,
                unique:true,
                gainable:true,
                content:function (){
        var list=["桃",];
        player.gain(game.createCard(list.randomGet()));
        player.$draw();
        player.gain(game.createCard(list.randomGet()));
        player.$draw();
        player.gain(game.createCard(list.randomGet()));
        player.$draw();
        player.gain(game.createCard(list.randomGet()));
        player.$draw();
    },
            },
            "目盗1":{
            },
            "目缠1":{
            },
            "目欺1":{
                nobracket:true,
                enable:"phaseUse",
                filter:function (event,player){
        if(!game.hasPlayer(function(current){
            return current.name=='ene';
        })){
            return false;
        }
        return !player.storage.boss_xingxia||game.roundNumber-player.storage.boss_xingxia>=2;
    },
                unique:true,
                filterTarget:function (card,player,target){
        return target.name=='ene';
    },
                selectTarget:-1,
                line:"fire",
                content:function (){
        target.addSkill('心灵崩溃ene'); 
        player.removeSkill('目欺1');  
        var chat=['我知道的，你在试图遗忘我。'].randomGet()
        player.say(chat)
        target.phase();      
    },
                contentAfter:function (){       
        target.phase();
    },
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
                fullimage:true,
            },
            "心灵崩溃ene":{
                nobracket:true,
                enable:"phaseUse",
                filter:function (event,player){
        if(!game.hasPlayer(function(current){
            return current.name=='鹿野修哉';
        })){
            return false;
        }
        return !player.storage.boss_xingxia||game.roundNumber-player.storage.boss_xingxia>=2;
    },
                unique:true,
                filterTarget:function (card,player,target){
        return target.name=='鹿野修哉';
    },
                selectTarget:-1,
                line:"fire",
                content:function (){ 
        player.addSkill('亡语-1');
        target.addSkill('对话1'); 
        var chat=['骗人……遥……'].randomGet()
        player.say(chat)
        target.phase();
    },
                contentAfter:function (){       
        target.phase();
    },
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
                fullimage:true,
            },
            "亡语-1":{
                trigger:{
                    player:"dieBegin",
                },
                silent:true,
                forced:true,
                content:function (){
    'step 0'
    var yi=('不……不是的……')
    player.say(yi)
    game.delay(2.5);
    'step 1'
    var er=('我只是……')
    player.say(er)
    game.delay(2);  
      },
                popup:false,
            },
            "对话1":{
                nobracket:true,
                enable:"phaseUse",
                filter:function (event,player){
        if(!game.hasPlayer(function(current){
            return current.name=='ene';
        })){
            return false;
        }
        return !player.storage.boss_xingxia||game.roundNumber-player.storage.boss_xingxia>=2;
    },
                unique:true,
                filterTarget:function (card,player,target){
        return target.name=='ene';
    },
                selectTarget:-1,
                line:"fire",
                content:function (){
        var chat=['对吧，贵音，你还在试图让伸太郎遗忘文乃，对吧。'].randomGet()
        player.say(chat)
        target.damage(5);
    },
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
                fullimage:true,
            },
            "车祸组男":{
                nobracket:true,
                enable:"phaseUse",
                filter:function (event,player){
        if(!game.hasPlayer(function(current){
            return current.name=='雨宫响也';
        })){
            return false;
        }
        return !player.storage.boss_xingxia||game.roundNumber-player.storage.boss_xingxia>=2;
    },
                unique:true,
                filterTarget:function (card,player,target){
        return target.name=='雨宫响也';
    },
                selectTarget:-1,
                line:"fire",
                content:function (){
        player.damage(2);
        target.recover(4); 
        target.phase();                    
    },
                contentAfter:function (){
        var chat=['我……最讨厌夏天了'].randomGet()
        player.say(chat)
    },
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
                fullimage:true,
            },
            "车祸组女":{
                nobracket:true,
                enable:"phaseUse",
                filter:function (event,player){
        if(!game.hasPlayer(function(current){
            return current.name=='朝比奈日和';
        })){
            return false;
        }
        return !player.storage.boss_xingxia||game.roundNumber-player.storage.boss_xingxia>=2;
    },
                unique:true,
                filterTarget:function (card,player,target){
        return target.name=='朝比奈日和';
    },
                selectTarget:-1,
                line:"fire",
                content:function (){
        player.damage(3);
        target.recover(3);   
        target.phase();
    },
                contentAfter:function (){
        var chat=['我讨厌夏天吧'].randomGet()
        player.say(chat)
    },
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
                fullimage:true,
            },
        },
        translate:{
            "目烧":"目烧",
            "目烧_info":"回合结束你获得你的弃牌",
            "如月目烧":"目烧",
            "如月目烧_info":"",
            "如月目缠":"目缠",
            "如月目缠_info":"你失去手牌的时候，你获得X点护甲（X为你当前手牌和开始手牌的差值），每当你失去护甲，你获得一张杀，在你的回合内，你可以选择消耗你的所有护甲并失去所有技能。",
            "阳炎世界":"阳炎世界",
            "阳炎世界_info":"",
            "目夺":"目夺",
            "目夺_info":"嘲讽",
            "如月目夺":"目夺",
            "如月目夺_info":"你必须攻击这个具有嘲讽的随从",
            "目挂":"目挂",
            "目挂_info":"你可以将你获得的牌转让给他人",
            "目隐":"目隐",
            "目隐_info":"你解除目隐状态，可以成为杀和决斗的目标。",
            "木户目隐":"目隐",
            "木户目隐_info":"一回合9次，你可以和别人一起不能成为[杀]或[决斗]的目标",
            "目醒":"目醒",
            "目醒_info":"你的摸牌量，伤害，回复量均为2倍。",
            "目简":"目简",
            "目简_info":"",
            "目盗":"目盗",
            "目盗_info":"你可以观看一名其他角色的手牌，然后可以用一张手牌替换其中的一张",
            "盾山目愿":"目挂",
            "盾山目愿_info":"出牌阶段，你可以将任意手牌送给其他角色。",
            "目凝":"目凝",
            "目凝_info":"锁定技，你的进攻距离无限",
            "车祸组1":"车祸组",
            "车祸组1_info":"",
            "车祸组2":"车祸组",
            "车祸组2_info":"",
            "目合":"目合",
            "目合_info":"与其对视者不能动一回合",
            "目合石化":"目合石化",
            "目合石化_info":"",
            "目觉":"目觉",
            "目觉_info":"来去自如的能力",
            "双枪":"双枪",
            "双枪_info":"出牌阶段，你使用[杀]无数量限制",
            "目欺":"目欺",
            "目欺_info":"",
            "桃":"桃",
            "桃_info":"",
            "目盗1":"目盗",
            "目盗1_info":"你可以观看一名其他角色的手牌，然后可以用一张手牌替换其中的一张",
            "目缠1":"目缠",
            "目缠1_info":"你失去手牌的时候，你获得X点护甲（X为你当前手牌和开始手牌的差值），每当你失去护甲，你获得一张杀，在你的回合内，你可以选择消耗你的所有护甲并失去所有技能。",
            "目欺1":"目欺",
            "目欺1_info":"",
            "心灵崩溃ene":"崩溃",
            "心灵崩溃ene_info":"",
            "亡语-1":"亡语",
            "亡语-1_info":"",
            "对话1":"对话",
            "对话1_info":"",
            "车祸组男":"车祸组",
            "车祸组男_info":"",
            "车祸组女":"车祸组",
            "车祸组女_info":"",
        },
    },
    intro:"",
    author:"最忠诚的叛徒",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["ene.jpg"],"card":["桃.png"],"skill":[]}}};