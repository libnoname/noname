import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default {name:"西游杀",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            破军:["male","shu",4,["无伤","军魂"],[]],
            灯神:["male","wu",4,["许愿"],[]],
            碧水龟:["male","wei",3,["流云","qianci"],[]],
            孙悟空:["male","wei",4,["美猴王","救命毫毛"],[]],
            猪八戒:["male","wei",4,["散伙饭","娶媳妇"],[]],
            阎罗王:["male","shu",3,["kurou"],[]],
            龙幽:["male","shu",3,["瞬移","极光","避法"],[]],
        },
        translate:{
            破军:"破军",
            灯神:"灯神",
            碧水龟:"碧水龟",
            孙悟空:"孙悟空",
            猪八戒:"猪八戒",
            阎罗王:"阎罗王",
            龙幽:"龙幽",
        },
    },
    card:{
        card:{
            meihou:{
                audio:true,
                type:"basic",
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target.identity!='zhu';
        return target!=player;
    },
                content:function (){
        "step 0"
        var next=target.chooseToRespond({name:'shan'});
        next.set('ai',function(card){
            var evt=_status.event.getParent();
            if(ai.get.damageEffect(evt.target,evt.player,evt.target)>=0) return 0;
            if(evt.player.hasSkillTag('notricksource')) return 0;
            if(evt.target.hasSkillTag('notrick')) return 0;
            return 1;
        });
        next.autochoose=lib.filter.autoRespondShan;
        "step 1"
        if(result.bool==false){
            target.damage();
        }
    },
                ai:{
                    wuxie:function (target,card,player,viewer){
            if(ai.get.attitude(viewer,target)>0&&target.num('h','shan')){
                if(!target.num('h')||target.hp==1||Math.random()<0.7) return 0;
            }
        },
                    basic:{
                        order:9,
                        useful:1,
                    },
                    result:{
                        target:function (player,target){
                var num=0;
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].ai.shown==0) num++;
                }
                if(num>1) return 0;
                var nh=target.num('h');
                if(get.mode()=='identity'){
                    if(target.isZhu&&nh<=2&&target.hp<=1) return -100;
                }
                if(nh==0) return -2;
                if(nh==1) return -1.7
                return -1.5;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:1,
                        multitarget:1,
                        multineg:1,
                    },
                },
                fullimage:true,
            },
            生死簿:{
                type:"trick",
                savable:true,
                selectTarget:-1,
                modTarget:function (card,player,target){
        return target.hp<target.maxHp;
    },
                content:function (){
        var a = event.target.maxHp
        var b = event.target.hp
        target.recover(a-b);
    },
                ai:{
                    save:true,
                    basic:{
                        order:22.2,
                        useful:20,
                        value:20.2,
                    },
                    result:{
                        target:20,
                    },
                },
                fullimage:true,
            },
            孕育:{
                type:"trick",
                enable:true,
                filterTarget:function (card,player,target){
        if(!target.maxHp==3) return false;
        return true;
    },
                content:function (){
    target.maxHp++;
    target.update();
    },
                ai:{
                    value:6,
                    useful:5,
                    result:{
                        target:5,
                        player:function (player,target){
                          if(target==player) return 10;
                          if(target.identity==player.identity) return 8;
                          if(player.identity=='zhu'&&target.identity=='zhong') return 8;
                        },
                    },
                },
                fullimage:true,
            },
            身份互换:{
                enable:function (card,player){
        return true;
    },
                type:"trick",
                selectTarget:2,
                multitarget:true,
                targetprompt:["换身份","被换身份"],
                filterTarget:function (card,player,target){
        return (target.identity!='zhu');
    },
                content:function (){
        'step 0'
            target1=targets[0];
            target2=targets[1];
            shenfen1 = target1.identity;
            shenfen2 = target2.identity;
        'step 1'
            target1.identity=shenfen2;
            target2.identity=shenfen1;
    },
                ai:{
                    order:5,
                    value:[8,2],
                    useful:5,
                    wuxie:function (){
            return 0;
        },
                    result:{
                        target:function (player,target){
                
            },
                    },
                },
                fullimage:true,
                image:"ext:西游杀/临阵换将.jpg",
            },
        },
        translate:{
            meihou:"美猴王",
            meihou_info:"楼主技术渣，配合孙悟空技能的卡牌",
            生死簿:"生死簿",
            生死簿_info:"当有角色进入濒死阶段时，对其使用。其回复体力至体力上限",
            孕育:"孕育",
            孕育_info:"出牌阶段，对一名体力上限为3的角色使用，使其体力上限+1。其原有的体力值保持不变。",
            身份互换:"身份互换",
            身份互换_info:"出牌阶段，指定除唐僧外两名角色交换身份",
        },
        list:[["club","11","孕育"],["heart","13","生死簿"],["club","3","身份互换"]],
    },
    skill:{
        skill:{
            无伤:{
                trigger:{
                    player:"damageBefore",
                },
                direct:true,
                filter:function (event,player){
        return player.num('h',{suit:'diamond'})>0&&event.num>0;
    },
                content:function (){
        "step 0"
        var next=player.chooseToDiscard('你可以弃置一张◇牌，减少一点伤害','he',function(card){
            return get.suit(card)=='diamond'
        }).set('ai',function(card){
            var num=_status.event.num;
            if(num==0) return 0;
            return 8-ai.get.value(card);
        }).set('num',1).set('suit','diamond');
        next.set('ai',ai.get.unuseful2);
        next.set('logSkill','无伤');
        "step 1"
        if(result.bool){
            trigger.num--;
        }
        else{
            event.finish();
        }
        
    },
                ai:{
                    effect:{
                        player:function (card,player,target){
                          if(player.num>0&&event.num>=1) return 8;
                          if(player.num>0&&event.num>=player.hp) return 12;
                        },
                    },
                    threaten:8,
                },
            },
            许愿:{
                enable:"chooseToUse",
                filterCard:function (card){
                  return get.suit(card)=='spade';
                },
                position:"he",
                viewAs:{
                    name:"wuzhong",
                    suit:"spade",
                    number:12,
                },
                viewAsFilter:function (player){
                if(!player.num('he',{suit:'spade'})) return false;
                },
                prompt:"将一张♠牌当无中生有使用",
                check:function (card){return 4-ai.get.value(card)},
                ai:{
                    basic:{
                        order:15,
                        useful:10,
                        value:12.5,
                    },
                    result:{
                        target:12,
                    },
                    tag:{
                        draw:2,
                    },
                    threaten:5,
                },
            },
            qianci:{
                audio:"ext:西游杀:2",
                enable:"chooseToUse",
                filterCard:function (card){
                  return get.suit(card)=='spade';
                },
                viewAsFilter:function (player){
                  return player.num('h',{suit:'spade'})>0;
                },
                viewAs:{
                    name:"wuxie",
                    suit:"spade",
                    number:2,
                },
                prompt:"将一张♠手牌当无懈可击使用",
                check:function (card){return 8-ai.get.value(card);ai:{if(card.name=='du') return-2}},
                threaten:1.2,
                ai:{
                    basic:{
                        useful:[6,4],
                        value:[6,4],
                    },
                    result:{
                        player:1,
                    },
                    expose:0.2,
                    threaten:1,
                },
            },
            流云:{
                trigger:{
                    player:"useCardAfter",
                },
                filter:function (event){
      return(event.card.name=='wuzhong');
  },
                content:function (){
        var next=player.chooseToDiscard('he','流云：是否弃置一张'+get.translation(suit)+'牌再发动'+get.translation(trigger.card)+'？',{suit:suit});
        next.ai=function(card){
            return val-ai.get.value(card);
        };
        next.logSkill='流云';
        player.draw(2);
  },
                ai:{
                    threaten:2,
                },
            },
            美猴王:{
                useable:1,
                enable:"chooseToUse",
                filterCard:function (card){
        return get.suit(card)=='spade';
    },
                position:"he",
                viewAs:{
                    name:"meihou",
                    suit:"spade",
                    number:5,
                },
                viewAsFilter:function (player){
        if(!player.num('he',{suit:'spade'})) return false;
    },
                prompt:"弃置一张♠牌，令所有玩家出闪",
                check:function (card){return 8-ai.get.value(card)},
                ai:{
                    basic:{
                        order:15,
                        useful:10,
                        value:12.5,
                    },
                    result:{
                        target:12,
                    },
                    threaten:1,
                    tag:{
                        draw:2,
                        respond:1,
                        respondShan:1,
                        damage:1,
                        multitarget:1,
                        multineg:1,
                    },
                    wuxie:function (target,card,player,viewer){
            if(ai.get.attitude(viewer,target)>0&&target.num('h','shan')){
                if(!target.num('h')||target.hp==1||Math.random()<0.7) return 0;
            }
        },
                },
            },
            救命毫毛:{
                audio:"ext:西游杀:2",
                trigger:{
                    player:"damageEnd",
                },
                forcer:true,
                filter:function (event){
        return (event.num>0)
    },
                content:function (){
        player.draw(player.maxHp-player.hp);
     },
                ai:{
                    maixie:true,
                    threaten:3,
                },
            },
            散伙饭:{
                audio:"ext:西游杀:2",
                trigger:{
                    target:"shaBefore",
                },
                direct:true,
                priority:5,
                filter:function (event,player){
        if(player.num('he')<=1) return false;
        return true;
    },
                filterCard:function (card){
       return(player.num('he'));
    },
                filterTarget:function (card,player,target){
        if(player==target) return false;
        return true;
    },
                content:function (){
        player.chooseCard('he','将一张手牌交给'+get.translation(result.target),true);
        'step 1'
                player.$give(1,result.target);
                result.target.gain(result.cards);
                'step 2'
                
            game.delay();
            trigger.untrigger();
            trigger.responded=true;
            trigger.result={bool:true,card:{name:'shan'}}
        
    },
                ai:{
                },
            },
            娶媳妇:{
                audio:"ext:西游杀:2",
                enable:"phaseUse",
                filterCard:true,
                usable:1,
                selectCard:1,
                check:function (card){
        var player=get.owner(card);
        if(player.num('h')>player.hp)
            return 8-ai.get.value(card)
        if(player.hp<player.maxHp)
            return 6-ai.get.value(card)
        return 4-ai.get.value(card)

    },
                filterTarget:function (card,player,target){
        if(target==player) return false;
        return(target.sex=='female');
    },
                content:function (){
        player.recover();
        target.recover();
    },
                ai:{
                    order:5.5,
                    result:{
                        player:function (player){
                if(player.hp<player.maxHp) return 4;
                if(player.num('h')>player.hp) return 0
                return -1;
            },
                        target:4,
                    },
                    threaten:1,
                },
            },
            军魂:{
                mod:{
                    maxHandcard:function (player,num){
            if(player.hasSkill('军魂')){
                    num++;
                }
            return num;
        },
                },
            },
            极光:{
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                content:function (){
                  player.draw()
                },
                ai:{
                    threaten:0.2,
                },
            },
            避法:{
                mod:{
                    targetEnabled:function (card){
            if((get.type(card)=='trick'||get.type(card)=='delay')&&
                get.color(card)=='red') return false;
        },
                },
            },
            瞬移:{
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        if(get.distance(player,target)>=2) return false;
        if(target.num('h')<=0) return false;
        return true;
    },
                content:function (){
        player.gainPlayerCard(event.target,true,'h');
    },
                ai:{
                    order:4,
                    threaten:1,
                    result:{
                        target:-1,
                        player:function (player,target){
                if(target.num('h')==0) return 0;
            },
                    },
                },
            },
        },
        translate:{
            无伤:"无伤",
            无伤_info:"每当你受到伤害时，可丢弃一张◇牌，抵消一点伤害。",
            许愿:"许愿",
            许愿_info:"你可以将一张♠牌当[无中生有]使用",
            qianci:"千刺",
            qianci_info:"你可以将你的任意一张♠或♣手牌当【无懈可击】使用。",
            流云:"流云",
            流云_info:"当你使用无中生有后，你可以摸两张牌（暂时这样）",
            美猴王:"美猴王",
            美猴王_info:"出牌阶段，使用一张♠牌，除主公以外全部角色需打出一张闪，否则失去一点体力。每回合限一次。",
            救命毫毛:"救命毫毛",
            救命毫毛_info:"每当你受到一点伤害，可以观看牌堆顶的两张牌，并将其交给任意1~2名角色",
            散伙饭:"散伙饭",
            散伙饭_info:"暂时没有用",
            娶媳妇:"娶媳妇",
            娶媳妇_info:"出牌阶段，你可以弃置一张牌并选择1名女性角色，你与其各回复一点体力，每阶段限一次",
            军魂:"军魂",
            军魂_info:"锁定技，你的手牌上限+1。",
            极光:"极光",
            极光_info:"回合结束阶段，你摸一张牌",
            避法:"避法",
            避法_info:"锁定技，红色的锦囊牌对你无效",
            瞬移:"瞬移",
            瞬移_info:"出牌阶段，你可以抽取与你距离为1的一名角色的一张手牌。每回合限一次。",
        },
    },
},files:{"character":["龙幽.jpg"],"card":["身份互换.jpg"],"skill":[]}};
