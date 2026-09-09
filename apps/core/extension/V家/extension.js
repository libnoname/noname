import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"V家",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            luotianyi:["female","shen",5,["v_jie","v_dacan","v_diyichihuodianxia","v_gechang","v_quanyu"],["des:告诉你一个秘密，其实……我……和阿绫之间……我才是……攻。————阿绫，窝错了，放手放手，呜呜X﹏X，阿绫大坏蛋，人家最讨厌你了"]],
            yuezhengling:["female","shen",7,["v_beishang","v_lingshou","v_aojiao","v_qingguo","v_douyi"],["des:嗯？什么，你说天依是攻？想多了，她呀，现在还在我床上，腿软的都下不来床了呢，不得不说，这小妮子最近，越来越皮了，调教一顿就好了，上北下南，一只傲受依，也敢想攻的位置？"]],
        },
        translate:{
            luotianyi:"洛天依",
            yuezhengling:"乐正绫",
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
            "v_jie":{
                trigger:{
                    source:"damageBegin",
                },
                content:function (){
        trigger.num++;
        trigger.nsshijun=true;
    },
                subSkill:{
                    hp:{
                        trigger:{
                            source:"damageAfter",
                        },
                        silent:true,
                        filter:function (event){
                return event.nsshijun;
            },
                        content:function (){
                player.loseHp();
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
                group:"nsshijun_hp",
            },
            "v_dacan":{
                trigger:{
                    player:"loseHpEnd",
                },
                forced:true,
                audio:"ext:V家:2",
                content:function (){
        var num=trigger.num;
        player.draw(num);
       player.changeHujia(num);
        if(_status.currentPhase==player){
            if(!player.storage.zhaxiang2) player.storage.zhaxiang2=0;
            player.storage.zhaxiang2+=num;
            player.addTempSkill('v_chihuo2',{player:'phaseAfter'});
        }
        else{
            game.trySkillAudio('v_dacan',player);
        }
    },
                ai:{
                    maihp:true,
                },
            },
            "v_chihuo2":{
                mod:{
                    targetInRange:function (card,player,target,now){
            if(card.name=='sha'&&get.color(card)=='black') return true;
        },
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return num+player.storage.zhaxiang2;
        },
                },
                onremove:true,
                trigger:{
                    player:"useCard",
                },
                forced:true,
                filter:function (event,player){
        return event.card&&event.card.name=='sha'&&get.color(event.card)=='black';
    },
                content:function (){
        trigger.directHit.addArray(game.players);
    },
            },
            "v_diyichihuodianxia":{
                audio:"v_chihuodianxia",
                unique:true,
                enable:"chooseToUse",
                mark:true,
                skillAnimation:true,
                animationStr:"第一吃货殿下",
                limited:true,
                animationColor:"orange",
                init:function (player){
        player.storage.oldniepan=false;
    },
                filter:function (event,player){
        if(player.storage.oldniepan) return false;
        if(event.type=='dying'){
            if(player!=event.dying) return false;
            return true;
        }
        return false;
    },
                content:function (){
        'step 0'
        
        player.discard(player.getCards('j'));
        'step 1'
        player.link(false);
        'step 2'
        player.turnOver(false);
        'step 3'
        player.draw(player.maxHp-player.hp);
        'step 4'
        if(player.hp<3){
        player.recover(player.maxHp-player.hp);
        }
    },
                ai:{
                    order:1,
                    skillTagFilter:function (player){
            if(player.storage.oldniepan) return false;
            if(player.hp>0) return false;
        },
                    save:true,
                    result:{
                        player:function (player){
                if(player.hp<=0) return 10;
                if(player.hp<=2&&player.countCards('he')<=1) return 10;
                return 0;
            },
                    },
                    threaten:function (player,target){
            if(!target.storage.oldniepan) return 0.6;
        },
                },
                intro:{
                    content:"limited",
                },
            },
            "v_gechang":{
                trigger:{
                    player:"damageEnd",
                },
                frequent:true,
                filter:function (event,player){
        return _status.currentPhase!=player;
    },
                content:function (){
        "step 0"
        player.draw(2);
        player.changeHujia(1);
        "step 1"
        player.chooseToUse('是否使用一张牌？');
        "step 2"
        player.insertPhase();
    },
                ai:{
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')&&_status.currentPhase!=target){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-1.5];
                    return [1,0.5];
                }
            },
                    },
                },
            },
            "v_huafeng":{
                audio:"ext:V家:2",
                trigger:{
                    player:["respond","useCard"],
                },
                filter:function (event,player){
        return event.card.name=='shan';
    },
                frequent:true,
                content:function (){
        player.draw(2);
        player.turnOver()
    },
                ai:{
                    mingzhi:false,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'respondShan')){
                    var shans=target.countCards('h','shan');
                    var hs=target.countCards('h');
                    if(shans>1) return [0,1];
                    if(shans&&hs>2) return [0,1];
                    if(shans) return [0,0];
                    if(hs>2) return [0,0];
                    if(hs>1) return [1,0.5];
                    return [1.5,0];
                }
            },
                    },
                    threaten:0.8,
                },
            },
            "v_mengxing":{
                audio:"ext:V家:2",
                trigger:{
                    global:"turnOverAfter",
                },
                filter:function (event,player){
        if(event.name=='link') return event.player.isLinked();
        return !event.player.isTurnedOver();
    },
                check:function (event,player){
        return get.attitude(player,event.player)>0;
    },
                logTarget:"player",
                content:function (){
        trigger.player.recover();
    },
                ai:{
                    expose:0.2,
                },
            },
            "v_zhenshi":{
                audio:"ext:V家:2",
                trigger:{
                    player:"loseHpBefore",
                    source:"damageBefore",
                },
                forced:true,
                content:function (){
        trigger.cancel();
        trigger.player.loseMaxHp(trigger.num);
    },
            },
            "v_beishang":{
                audio:"ext:V家:2",
                trigger:{
                    player:["loseMaxHpBefore","turnOverBefore","linkBefore"],
                },
                forced:true,
                content:function (){
        trigger.cancel();
        player.draw();
    },
            },
            "v_lingshou":{
                audio:"v_lingshou",
                trigger:{
                    global:"phaseUseBegin",
                },
                filter:function (event,player){
        return event.player!=player&&event.player.isAlive()&&event.player.inRange(player)&&player.countCards('he')>0;
    },
                direct:true,
                derivation:["v_zhenshi"],
                checkx:function (event,player){
        if(get.attitude(player,event.player)>=0) return false;
        var e2=player.getEquip(2);
        if(e2){
            if(e2.name=='tengjia') return true;
            if(e2.name=='bagua') return true;
        }
        return event.player.countCards('h')>event.player.hp;
    },
                content:function (){
        "step 0"
        var check=lib.skill.new_meibu.checkx(trigger,player);
        player.chooseToDiscard(get.prompt2('v_lingshou',trigger.player),'he').set('ai',function(card){
            if(_status.event.check) return 6-get.value(card);
            return 0;
        }).set('check',check).set('logSkill',['v_lingshou',trigger.player]);
        "step 1"
        if(result.bool){
            var target=trigger.player;
            var card=result.cards[0];
            player.line(target,'green');
            target.addTempSkill('v_zhenshi','phaseUseBefore');
            player.removeSkill('v_lingshou')
        }
    },
                ai:{
                    expose:0.2,
                },
            },
            "v_aojiao":{
                audio:"v_aojiao",
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event,player){
        return (event.source!=undefined&&event.num>0);
    },
                check:function (event,player){
        return (get.attitude(player,event.source)<=0);
    },
                logTarget:"source",
                content:function (){
        "step 0"
        event.num=trigger.num;
        "step 1"
        player.judge(function(card){
            if(get.color(card)=='red') return 1;
            return 0;
        });
        "step 2"
        if(result.color=='black'){
            if(trigger.source.countCards('he')){
                player.turnOver();
            }
        }
        else if(trigger.source.isIn()){
            trigger.source.turnOver();
        }
        event.num--;
        if(event.num>0){
            player.chooseBool(get.prompt2('v_aojiao'));
        }
        else{
            event.finish();
        }
        "step 3"
        if(result.bool){
            player.logSkill('v_aojiao',trigger.source);
            event.goto(1);
        }
    },
                ai:{
                    "maixie_defend":true,
                    expose:0.4,
                },
            },
            "v_qingguo":{
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                direct:true,
                audio:"v_qingguo",
                content:function (){
        player.chooseUseTarget('###是否发动【倾国】？###视为使用一张没有距离限制的【杀】',{name:'sha'},false,'nodistance').logSkill='v_qingguo';
        player.addSkill('v_lingshou')
    },
                ai:{
                    threaten:function (player,target){
            return 1.6;
        },
                },
            },
            "v_quanyu":{
                audio:"v_quanyu",
                audioname:["shen_caopi"],
                enable:"phaseUse",
                usable:1,
                position:"he",
                filterCard:function (card,player,event){
        event=event||_status.event;
        var mod=game.checkMod(card,player,event.getParent().name,'unchanged','cardDiscardable',player);
        if(mod!='unchanged') return mod;
        return true;
    },
                discard:false,
                lose:false,
                delay:false,
                selectCard:[1,Infinity],
                check:function (card){
        var player=_status.event.player;
        if(get.position(card)=='h'&&!player.countCards('h','du')&&(player.hp>2||!player.countCards('h',function(card){
            return get.value(card)>=8;
        }))){
            return 1;
        }
        return 6-get.value(card)
    },
                content:function (){
        'step 0'
        player.discard(cards);
        event.num=1;
        var hs=player.getCards('h');
        if(!hs.length) event.num=0;
        for(var i=0;i<hs.length;i++){
            if(!cards.contains(hs[i])){
                event.num=0;break;
            }
        }
        'step 1'
        player.draw(event.num*3+cards.length);
        player.gainMaxHp(4);
        player.removeSkill('v_quanyu');
    },
                subSkill:{
                    draw:{
                        trigger:{
                            player:"loseEnd",
                        },
                        silent:true,
                        filter:function (event,player){
                if(event.getParent(2).skill!='v_quanyu'&&event.getParent(2).skill!='v_quanyu') return false;
                if(player.countCards('h')) return false;
                for(var i=0;i<event.cards.length;i++){
                    if(event.cards[i].original=='h') return true;
                }
                return false;
            },
                        content:function (){
                player.addTempSkill('v_quanyu',trigger.getParent(2).skill+'After');
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                    delay:{
                        sub:true,
                    },
                },
                ai:{
                    order:1,
                    result:{
                        player:1,
                    },
                    threaten:1.55,
                },
            },
            "v_douyi":{
                audio:"v_douyi",
                enable:"phaseUse",
                position:"he",
                filterCard:true,
                selectCard:2,
                prompt:"弃置两张牌并摸一张牌",
                check:function (card){return 4-get.useful(card)},
                content:function (){
        player.draw();
        player.addTempSkill('v_tiaojiao','phaseDiscardEnd')
    },
                ai:{
                    order:1,
                    result:{
                        player:1,
                    },
                },
            },
            "v_tiaojiao":{
                trigger:{
                    source:"damageBefore",
                },
                forced:true,
                audio:"ext:V家:2",
                check:function (){return false;},
                content:function (){
        trigger.cancel();
        trigger.player.loseHp(trigger.num);
    },
                ai:{
                    "v_tiaojiao":true,
                },
            },
        },
        translate:{
            "v_jie":"饥饿",
            "v_jie_info":"你造成伤害时，你可以令此伤害+1，并在结算后失去一点体力",
            "v_dacan":"大餐",
            "v_dacan_info":"锁定技 每当你失去1点体力后，你摸一张牌获得一护甲。然后若此时是你的出牌阶段，则直到回合结束，你使用黑色【杀】无距离限制且不能被【闪】响应，你可以额外使用一张【杀】。",
            "v_chihuo2":"吃货",
            "v_chihuo2_info":"",
            "v_diyichihuodianxia":"第一吃货殿下",
            "v_diyichihuodianxia_info":"当你处于濒死状态时，你可以弃置你判定区域内的所有牌并复原你的武将牌，然后摸x张牌并将体力回复至体力上限。（x为你以此法回复的体力数）",
            "v_gechang":"歌唱",
            "v_gechang_info":"每当你于回合外受到一次伤害，你可以摸二张牌，并可以使用一张牌，然后于此回话合结束后进行一个新回合",
            "v_huafeng":"华风夏韵，洛水天依",
            "v_huafeng_info":"每当你使用或打出一张闪，你可以摸两张牌，然后你将武将牌翻面",
            "v_mengxing":"梦醒",
            "v_mengxing_info":"当一名角色翻至正面后，你可以令其回复一点体力。",
            "v_zhenshi":"真实",
            "v_zhenshi_info":"锁定技，当你即将失去体力或造成伤害时，你防止之，改为对应角色失去等量的体力上限。",
            "v_beishang":"北上",
            "v_beishang_info":"锁定技。凡是针对你的武将牌牌翻面/减少体力上限/武将牌横置的概念均改为摸一张牌",
            "v_lingshou":"绫受",
            "v_lingshou_info":"其他角色的出牌阶段开始时，若你在其攻击范围内，你可以弃置一张牌，令该角色拥有〖真实〗一直到你回合开始。",
            "v_aojiao":"傲娇",
            "v_aojiao_info":"每当你受到1点伤害后，可进行一次判定，若结果为红色，伤害来源武将牌翻面，若结果为黑色，你武将牌翻面。",
            "v_qingguo":"倾国",
            "v_qingguo_info":"准备阶段开始时，你可以视为使用一张无距离限制的【杀】，然后你重置【绫受】。",
            "v_quanyu":"权御",
            "v_quanyu_info":"每局游戏限一次，你可以弃置任意张牌并摸三倍等量的牌，并增加四点体力上限，若你在发动〖权御〗时弃置了所有手牌，则你多摸一张牌，最后你会展示一个惊喜。",
            "v_douyi":"逗依",
            "v_douyi_info":"出牌阶段，你可以弃置两张牌，然后摸一张牌并获得技能【调教】。",
            "v_tiaojiao":"调教",
            "v_tiaojiao_info":"锁定技，你即将造成的伤害均视为失去体力。",
        },
    },
    intro:"1.本扩展包含武将包，配音包，图片包三个部分。 2.使用方法:配音包:配音包里分为二个部分，既:阵亡配音(die)，武将技能发动配音(skill)，在内部储存→Android→data→yuri.nakamura.noname→audio里，找到对应的文件夹，再将配音包里的二个部分分别黏贴到里面即可。             图片包:图片包只有一个部分既:image，在内部储存→Android→data→yuri.nakamura.noname→image→skin里，将图片包黏贴即可。 3.本扩展还在持续更新中，有想法的可以私聊我",
    author:"子泽",
    diskURL:"",
    forumURL:"",
    version:"2",
},files:{"character":["yuezhengling.jpg"],"card":[],"skill":[]}}};