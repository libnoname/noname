import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"芙蕖绿波",content:function (config,pack){
},precontent:function (){
    
},help:{},config:{"MNRYganxieminglu":{"name":"感谢名录","init":1,"item":{"1":"点击查看","2":"<li>落笔无悔<li>烟雨墨染<li>刘玄德<li>看破一切<li>诗笺(冰波水微)<li>咫尺天涯<li>dp<li>迷之仙人<li>以及其他许多大佬及小伙伴"}},"MNRYgengxinrizhi":{"name":"更新日志","init":1,"item":{"1":"查看近期","2":"2020/08/05削弱一众强将","3":"2020/08/06更新boss武将朔望二美，欢迎前往撷芳"}}},package:{
    character:{
        character:{
            "mnry_zhenji":["female","wei",3,["mnry_dianshui","mnry_qinguo","mnry_boxing"],[]],
            "mnry_daxiaoqiao":["female","wu",3,["mnry_huose","mnry_liuli","mnry_hongyan"],[]],
            "mnry_caiwenji":["female","wei",3,["mnry_yishu","mnry_zoubi","<li>chenqing"],[]],
            "mnry_caizhaoji":["female","qun",3,["mnry_shufen","mnry_guyan","guihan"],[]],
            "mnry_wangyi":["female","wei",3,["mnry_yingbian","mnry_miji"],[]],
            "mnry_huangyueying":["female","shu",3,["mnry_zhenxi","mnry_xieshu","mnry_jizhi"],[]],
            "mnry_guansuo":["male","shu",3,["mnry_xiefang","mnry_lianyin","mnry_zhuanshi"],[]],
            "mnry_ganfuren":["female","shu",3,["mnry_qingyi","mnry_zhenyan","mnry_zhisan"],[]],
            "mnry_hetaihou":["female","qun",3,["mnry_yijia","mnry_qizhen","mnry_zhensha"],[]],
            "mnry_xinxianying":["female","wei",3,["mnry_jianshi","mnry_zhongjian"],[]],
            "mnry_wuguotai":["female","wu",3,["mnry_chizhong","mnry_chengyi","mnry_quanshan"],[]],
            "mnry_dongzhuo":["male","qun","3/6",["mnry_roulin","mnry_sougua","mnry_baoli","mnry_huihuo"],[]],
            "mnry_shexinnvwang":["female","shen","5/6",["mnry_yijia","mnry_tunhua","mnry_sheshu","mnry_shixin","mnry_duli"],["boss","bossallowed"]],
            "mnry_jiaozhongqin":["male","qun",3,["mnry_paihuai","mnry_luxiang","mnry_zigua"],[]],
            "mnry_liulanzhi":["female","qun",3,["mnry_paihuai","mnry_zhenshu","mnry_fuchi"],[]],
            "mnry_manhuangwuyi":["male","shu",3,["mnry_duyi","mnry_duli","mnry_jijiu"],[]],
            "mnry_nvshenshizhe":["female","wu",3,["mnry_guiyuan","mnry_quanjiu","mnry_shouhu"],[]],
            "mnry_fuyunqingniao":["none","wu",4,["mnry_xiangyun","mnry_shenxin","mnry_qingnuan"],["des:蓬山此去无多路，青鸟殷勤为探看。"]],
            "mnry_chijianshinv":["female","qun",3,["mnry_jiebei","mnry_xiaoji","mnry_shicong"],[]],
            "mnry_diaochan":["female","qun",3,["mnry_wuxiu","mnry_chenzui"],[]],
            "mnry_bosscaiwenji":["female","shen",4,["mnry_shufen","mnry_moshang","mnry_momo","mnry_wangchuan"],["boss","bossallowed"]],
            "mnry_sunshangxiang":["female","wu",3,["mnry_duoqing","mnry_hongzhuang","mnry_mijiang"],[]],
            "mnry_ranqi":["male","wu",3,["mnry_wenji","mnry_kuiping"],[]],
            "mnry_shuoyueji":["female","shen",4,["mnry_wanghui","mnry_yixiao","mnry_jinjiao"],["forbidai"]],
            "mnry_wangyueji":["female","shen",4,["mnry_wangshuo","mnry_wanyi","mnry_diefeng","mnry_ranshsng"],["forbidai"]],
            "mnry_shuowangermei":["female","shen",4,["朔望"],["boss","forbidai","bossallowed"]],
        },
        translate:{
            "mnry_zhenji":"甄姬",
            "mnry_daxiaoqiao":"大小乔",
            "mnry_caiwenji":"蔡文姬",
            "mnry_caizhaoji":"蔡昭姬",
            "mnry_wangyi":"王异",
            "mnry_huangyueying":"黄月英",
            "mnry_guansuo":"关索",
            "mnry_ganfuren":"甘夫人",
            "mnry_hetaihou":"何太后",
            "mnry_xinxianying":"辛宪英",
            "mnry_wuguotai":"吴国太",
            "mnry_dongzhuo":"董卓",
            "mnry_shexinnvwang":"蛇心女王",
            "mnry_jiaozhongqin":"焦仲卿",
            "mnry_liulanzhi":"刘兰芝",
            "mnry_manhuangwuyi":"蛮荒巫医",
            "mnry_nvshenshizhe":"女神侍者",
            "mnry_fuyunqingniao":"浮云青鸟",
            "mnry_chijianshinv":"持剑侍女",
            "mnry_diaochan":"貂蝉",
            "mnry_bosscaiwenji":"悲情才女",
            "mnry_sunshangxiang":"孙尚香",
            "mnry_ranqi":"染柒",
            "mnry_shuoyueji":"朔月姬小乔",
            "mnry_wangyueji":"望月姬大乔",
            "mnry_shuowangermei":"朔望二美",
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
            "mnry_chengyi":{
                mod:{
                    maxHandcard:function (player,num){
        return (2*(player.maxHp-player.hp))+player.hp;
        },
                },
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function (){
        trigger.num++;
    },
                ai:{
                    threaten:1.5,
                },
            },
            "mnry_quanshan":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    global:"phaseEnd",
                },
                filter:function (event,player){
        return event.player.hp==1&&player.countCards('he');
    },
                direct:true,
                content:function (){
        'step 0'
        player.chooseToDiscard('是否对'+get.translation(trigger.player)+'发动【劝善】？').ai=function(card){
            if(ai.get.attitude(player,trigger.player)>2) return 6-ai.get.value(card);
            return 0;
        }
        'step 1'
        if(result.bool){
            player.logSkill('mnry_quanshan',trigger.player);
            trigger.player.changeHujia();
        }
    },
            },
            "mnry_baoli":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    global:"dieAfter",
                },
                forced:true,
                unique:true,
                content:function (){
        player.gainMaxHp();
        player.recover();
    },
                ai:{
                    threaten:1.5,
                },
            },
            "mnry_sougua":{
                audio:"ext:芙蕖绿波2:",
                enable:"phaseUse",
                filter:function (event,player){
        return player.maxHp>1;
    },
                content:function (){
        'step 0'
        player.loseMaxHp(true);
        'step 1'
        player.draw(2);
    },
                ai:{
                    order:1.5,
                    threaten:1.4,
                    result:{
                        player:function (player){
                if(player.isDamaged()) return 1;
                if(player.hp>=3&&!player.needsToDiscard(2)) return 1;
                return 0;
            },
                    },
                },
            },
            "mnry_sheshu":{
                enable:"phaseUse",
                usable:2,
                position:"he",
                content:function (){
        var list=player.getEnemies();
        if(list.length){
            var target=list.randomGet();
            player.line(target,'green');
            target.gain(game.createCard('du'),'gain2');
        }
    },
                ai:{
                    order:1,
                    result:{
                        player:1,
                    },
                    threaten:1.5,
                },
            },
            "mnry_tunhua":{
                trigger:{
                    player:"phaseEnd",
                },
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('mnry_tunhua'),function(card,player,target){
            return player!=target&&target.hp>=player.hp;
        }).ai=function(target){
            return get.damageEffect(target,player,player);
        }
        "step 1"
        if(result.bool){
            player.logSkill('mnry_tunhua',result.targets);
            result.targets[0].damage(2);
        }
    },
            },
            "mnry_shixin":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    source:"damageEnd",
                },
                frequent:true,
                content:function (){
        player.draw(2);
        player.recover();
    },
            },
            "mnry_huihuo":{
                trigger:{
                    player:"phaseDiscardEnd",
                },
                forced:true,
                filter:function (event,player){
        return event.cards&&event.cards.length>2;
    },
                content:function (){
        player.gainMaxHp();
    },
            },
            "mnry_paihuai":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"phaseDrawBefore",
                },
                check:function (event,player){
        return !player.hasSkill('reyiji2');
    },
                content:function (){
        "step 0"
        event.cards=get.cards(3);
        player.chooseCardButton(event.cards,2,'选择两张牌置于牌堆顶').set('ai',ai.get.buttonValue);
        "step 1"
        if(result.bool){
            var choice=[];
            for(var i=0;i<result.links.length;i++){
                choice.push(result.links[i]);
                cards.remove(result.links[i]);
            }
            for(var i=0;i<cards.length;i++){
                ui.cardPile.appendChild(cards[i]);
            }
            while(choice.length){
                ui.cardPile.insertBefore(choice.pop(),ui.cardPile.firstChild);
            }
        }
    },
            },
            "mnry_luxiang":{
                audio:"ext:芙蕖绿波:1",
                trigger:{
                    global:"dieAfter",
                },
                frequent:true,
                derivation:["yingzi","shenxing","zhiyan"],
                content:function (){
        'step 0'
        player.draw(2);
        var list=[];
        if(!player.hasSkill('yingzi')){
            list.push('yingzi');
        }
        if(!player.hasSkill('shenxing')){
            list.push('shenxing');
        }
        if(!player.hasSkill('zhiyan')){
            list.push('zhiyan');
        }
        if(list.length){
            player.chooseControl(list).set('prompt','选择获得一项技能');
        }
        'step 1'
        player.addSkill(result.control);
        player.popup(result.control);
        game.log(player,'获得技能','【'+get.translation(result.control)+'】');
    },
                ai:{
                    threaten:1.4,
                },
            },
            "mnry_yuanyang":{
                audio:"ext:芙蕖绿波:2",
                enable:"phaseUse",
                filterCard:true,
                usable:1,
                selectCard:2,
                check:function (card){
        var player=get.owner(card);
        if(player.countCards('h')>player.hp)
            return 8-get.value(card)
        if(player.hp<player.maxHp)
            return 6-get.value(card)
        return 4-get.value(card)
    },
                filterTarget:function (card,player,target){
        if(target.sex!='male') return false;
        if(target.hp>=target.maxHp) return false;
        if(target==player) return false;
        return true;
    },
                content:function (){
        player.recover();
        player.draw();
        player.chooseToDiscard('he',1,true);
        target.recover();
        target.draw();
        target.chooseToDiscard('he',1,true);
    },
                ai:{
                    order:5.5,
                    result:{
                        player:function (player){
                if(player.hp<player.maxHp) return 4;
                if(player.countCards('h')>player.hp) return 0
                return -1;
            },
                        target:4,
                    },
                    threaten:2,
                },
            },
            "mnry_zigua":{
                skillAnimation:true,
                audio:"ext:芙蕖绿波:2",
                unique:true,
                enable:"phaseUse",
                mark:true,
                limited:true,
                derivation:"mnry_yuanyang",
                filter:function (event,player){
        return !player.storage.cunsi&&player.countCards('h')&&!player.isTurnedOver();
    },
                init:function (player){
        player.storage.cunsi=false;
    },
                filterTarget:function (card,player,target){
        return player!=target&&target.sex=='female';
    },
                content:function (){
        "step 0"
        player.awakenSkill('mnry_zigua');
        var cards=player.getCards('h');
        target.gain(cards,player);
        player.$give(cards.length,target);
        player.storage.cunsi=true;
        game.delay();
        target.addSkill('mnry_yuanyang');
        target.markSkillCharacter('mnry_yuanyang',player,'mnry_zigua','<div class="skill">【鸳鸯】</div><div>出牌阶段，你可以弃置两张牌并选择1名已经受伤的男性角色，你与其各回复一点体力然后摸一弃一，每阶段限一次</div>');
        "step 1"
        player.turnOver();
    },
                intro:{
                    content:"limited",
                },
                ai:{
                    order:4,
                    result:{
                        target:function (player,target){
                if(target.isMin()) return 0;
                if(player.hp>1){
                    if(game.phaseNumber<game.players.length) return 0;
                    if(target.hp==1&&target.maxHp>2) return 0;
                    if(get.attitude(player,target)<5) return 0;
                }
                if(get.attitude(player,target)<5) return 0;
                if(target.hp==1&&target.maxHp>2) return 0.2;
                if(target==game.me) return 1.2;
                return 1;
            },
                    },
                    expose:0.5,
                    threaten:1.5,
                },
            },
            "mnry_zhenshu":{
                mod:{
                    maxHandcard:function (player,num){
            if(player.hp!=player.maxHp)  return 3+player.maxHp;
        },
                },
            },
            "mnry_fuchi":{
                audio:"ext:芙蕖绿波:2",
                derivation:["biyue"],
                subSkill:{
                    count:{
                        trigger:{
                            player:"recoverBegin",
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        filter:function (event,player){
                if(!event.card||event.card.name!='tao') return false;
                if(!event.source||event.source.sex!='male') return false;
                if(!player.isDying()) return false;
                if(game.hasPlayer(function(current){
                    return current.name=='mnry_jiaozhongqin'||current.name2=='mnry_jiaozhongqin';
                })) return false;
                return true;
            },
                        content:function (){
                trigger.mnry_fuchi=true;
            },
                        sub:true,
                    },
                },
                group:["mnry_fuchi_count"],
                trigger:{
                    player:"recoverAfter",
                },
                limited:true,
                init:function (player){
        player.storage.MNRY_fuchi=false;
    },
                filter:function (event,player){
        if(player.storage.MNRY_fuchi) return false;
        if(player.isDying()) return false;
        return event.MNRY_fuchi==true;
    },
                direct:true,
                skillAnimation:true,
                content:function (){
        "step 0"
        trigger.source.chooseBool('【赴池】：是否将自己的一张武将牌替换为“焦仲卿”？').set('ai',function(){
            return true;
        });
        "step 1"
        if(result.bool){
            player.awakenSkill('mnry_fuchi');
            player.logSkill('mnry_fuchi',trigger.source);
            if(trigger.source.name2!=undefined){
                trigger.source.chooseControl(trigger.source.name,trigger.source.name2).set('prompt','请选择要更换的武将牌');
            }else event._result={control:trigger.source.name};
        }
        else event.finish();
        "step 2"
        trigger.source.reinit(result.control,'mnry_jiaozhongqin');
        player.gainMaxHp();
        player.addSkill('biyue');
    },
                mark:true,
                intro:{
                    content:"limited",
                },
            },
            "mnry_chenzui":{
                audio:"biyue",
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                content:function (){
        if(player.isTurnedOver()){
            player.draw(2);
        }
        else{
            player.draw();
        }
    },
            },
            "mnry_duyi":{
                audio:"ext:芙蕖绿波:2",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        if(target.hp>=target.maxHp) return false;
        return true;
    },
                content:function (){
        target.gain(game.createCard('du'),'gain2');
        target.recover();
    },
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){
                if(target.hp==1) return 5;
                if(player==target&&player.countCards('h')>player.hp) return 5;
                return 2;
            },
                    },
                    threaten:2,
                },
            },
            "mnry_duli":{
                trigger:{
                    global:["useCardAfter","respondAfter","discardAfter"],
                },
                filter:function (event,player){
        if(event.cards){
            for(var i=0;i<event.cards.length;i++){
                if(get.position(event.cards[i])=='d'&&event.cards[i].name=='du') return true;
            }
        }
        return false;
    },
                frequent:"check",
                check:function (event){
        for(var i=0;i<event.cards.length;i++){
            if(get.position(event.cards[i])=='d'&&event.cards[i].name=='du') return true;
        }
        return false;
    },
                content:function (){
        var cards=[];
        for(var i=0;i<trigger.cards.length;i++){
            if(get.position(trigger.cards[i])=='d'){
                cards.push(trigger.cards[i]);
            }
        }
        player.draw();
    },
            },
            "mnry_miqing":{
                audio:"ext:芙蕖绿波:2",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.num("he")>0;
    },
                filterTarget:function (card,player,target){
        return player!=target;
    },
                content:function (){
        'step 0'
        player.chooseControl('弃牌','失去体力',function(event,player){ 
    var num1=player.countCards('h'); 
    var num2=player.hp;
            if(num1>=2&&num2<=2) return '弃牌'; 
    return '失去体力'; 
      });
        'step 1'
        if(result.control=='弃牌'){
        player.chooseToDiscard('he',true);
        }
         else{
             player.loseHp();
         } 
        'step 2'
    if(target.sex!='male'){
        target.loseHp();
    }
    else {
        target.turnOver();
    }
    },
                position:"he",
                ai:{
                    result:{
                        target:function (player,target){
                return get.effect(target,{name:'lebu'},player,target);
            },
                    },
                    order:9,
                },
            },
            "mnry_jiebei":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"equipEnd",
                },
                frequent:true,
                content:function (){
        player.changeHujia();
    },
                ai:{
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card)=='equip') return [1,3];
            },
                    },
                    threaten:1.3,
                },
            },
            "mnry_feichi":{
                mod:{
                    globalFrom:function (from,to,distance){
            return distance-1;
        },
                    globalTo:function (from,to,distance){
            return distance+1;
        },
                },
            },
            "mnry_xiaoji":{
                audio:"ext:芙蕖绿波:2",
                audioname:["sp_sunshangxiang"],
                trigger:{
                    player:"loseEnd",
                },
                frequent:true,
                filter:function (event,player){
        for(var i=0;i<event.cards.length;i++){
            if(event.cards[i].original=='e') return true;
        }
        return false;
    },
                content:function (){
        var num=0;
        for(var i=0;i<trigger.cards.length;i++){
            if(trigger.cards[i].original=='e') num+=1;
        }
        player.draw(num);
    },
                ai:{
                    noe:true,
                    reverseEquip:true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card)=='equip') return [1,3];
            },
                    },
                },
            },
            "mnry_guiyuan":{
                enable:"phaseUse",
                unique:true,
                mark:true,
                skillAnimation:true,
                animationColor:"blue",
                init:function (player){
        player.storage.mnry_guiyuan=false;
    },
                filter:function (event,player){
        if(player.storage.mnry_guiyuan) return false;
        return true;
    },
                filterTarget:function (card,player,target){
        return target!=player;
    },
                selectTarget:[1,Infinity],
                contentBefore:function (){
        player.awakenSkill('mnry_guiyuan');
        player.storage.mnry_guiyuan=true;
        player.loseHp();
        player.clearSkills();
    },
                content:function (){
        target.changeHujia();
        target.draw();
        target.$draw();
    },
                ai:{
                    order:1,
                    result:{
                        target:function (player,target){
                if(player.hasUnknown()) return 0;
                var num=0;
                var players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    if(get.attitude(player,players[i])>2&&
                        get.recoverEffect(players[i],player,player)>0){
                        if(players[i].hp>=1){
                            if(player.hp=player.maxHp){
                                return 1;
                            }
                            else{
                                num+=2;
                            }
                        }
                        else if(players[i].hp<=2){
                            num++;
                        }
                    }
                }
                if(num>=3) return 1;
                return 0;
            },
                    },
                },
                intro:{
                    content:"limited",
                },
            },
            "mnry_quanjiu":{
                mod:{
                    cardEnabled:function (card,player){
            if(card.name=='jiu'&&get.position(card)=='h'&&_status.event.skill==undefined) return false;
        },
                    cardUsable:function (card,player){
            if(card.name=='jiu'&&get.position(card)=='h'&&_status.event.skill==undefined) return false;
        },
                    cardRespondable:function (card,player){
            if(card.name=='jiu'&&get.position(card)=='h'&&_status.event.skill==undefined) return false;
        },
                    cardSavable:function (card,player){
            if(card.name=='jiu'&&get.position(card)=='h'&&_status.event.skill==undefined) return false;
        },
                },
                enable:["chooseToUse","chooseToRespond"],
                filter:function (event,player){
        return player.countCards('h','jiu')>0;
    },
                filterCard:{
                    name:"jiu",
                },
                viewAs:{
                    name:"sha",
                },
                viewAsFilter:function (player){
        if(!player.countCards('h','jiu')) return false;
    },
                check:function (){return 1},
                ai:{
                    skillTagFilter:function (player){
            if(!player.countCards('h','jiu')) return false;
        },
                    respondSha:true,
                    order:4,
                    useful:-1,
                    value:-1,
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    result:{
                        target:function (player,target){
                if(player.hasSkill('jiu')&&!target.getEquip('baiyin')){
                    if(get.attitude(player,target)>0){
                        return -6;
                    }
                    else{
                        return -3;
                    }
                }
                return -1.5;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function (card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function (card){
                if(card.nature) return 1;
            },
                        fireDamage:function (card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function (card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function (card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "mnry_xiangyun":{
                trigger:{
                    global:"gameStart",
                    player:"enterGame",
                },
                forced:true,
                content:function (){
        player.disableJudge();
    },
            },
            "mnry_shenxin":{
                trigger:{
                    player:"turnOverBefore",
                },
                priority:20,
                forced:true,
                filter:function (event,player){
        return !player.isTurnedOver();
    },
                content:function (){
        trigger.cancel();
        game.log(player,'取消了翻面');
    },
            },
            "mnry_qingnuan":{
                trigger:{
                    player:"loseEnd",
                },
                frequent:true,
                unique:true,
                filter:function (event,player){
        return _status.currentPhase!=player&&player.hp<=player.maxHp;
    },
                content:function (){
        "step 0"
        player.judge(function(card){
            return get.color(card)=='red'?1:0;
        });
        "step 1"
        if(result.color=='red'){
            player.draw();
        }
    },
                ai:{
                    effect:{
                        target:function (card){
                if(get.tag(card,'loseCard')){
                    return [0.5,1];
                }
            },
                    },
                },
            },
            "mnry_moshang":{
                mod:{
                    cardEnabled:function (card,player){
            if(card.name=='tao'&&!player.isDying()) return false;
        },
                    cardUsable:function (card,player){
            if(card.name=='tao'&&!player.isDying()) return false;
        },
                },
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                content:function (){
        player.draw(player.maxHp-player.hp);
        player.recover(player.maxHp-player.hp);
    },
            },
            "mnry_momo":{
                audio:"ext:芙蕖绿波:2",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return target.canUse({name:'sha'},player)&&target.countCards('he');
    },
                content:function (){
        "step 0"
        player.loseHp();
        player.draw();
        "step 1"
        target.loseHp();
    },
                ai:{
                    loseHp:true,
                    order:8,
                    result:{
                        player:function (player,target){
                if(player.hp>=target.hp) return -0.9;
                if(player.hp<=2) return -10;
                return -2;
            },
                        target:function (player,target){
                    if(player.hp<2) return 0;
                    if(player.hp==2&&target.hp>=2) return 0;
                    if(target.hp>player.hp) return 0;
                return get.damageEffect(target,player);
            },
                    },
                },
                threaten:1.3,
            },
            "mnry_hongzhuang":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"loseEnd",
                },
                frequent:true,
                filter:function (event,player){
        for(var i=0;i<event.cards.length;i++){
            if(event.cards[i].original=='e') return true;
        }
        return false;
    },
                content:function (){
        var num=0;
        for(var i=0;i<trigger.cards.length;i++){
            if(trigger.cards[i].original=='e') num+=1;
        }
        player.changeHujia(num);
        player.draw(num);
    },
                ai:{
                    noe:true,
                    reverseEquip:true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card)=='equip') return [1,3];
            },
                    },
                },
            },
            "mnry_mijiang":{
                skillAnimation:true,
                unique:true,
                juexingji:true,
                audio:"ext:芙蕖绿波:2",
                derivation:["jieyin","zhuiyi"],
                trigger:{
                    player:"dying",
                },
                priority:10,
                forced:true,
                filter:function (event,player){
        return !player.storage.mnry_duoqing;
    },
                content:function (){
        "step 0"
        if(player.hp<2){
            player.recover(2-player.hp);
        }
        "step 1"
        player.addSkill('zhuiyi');
        player.addSkill('jieyin');
        player.storage.mnry_duoqing=true;
        player.awakenSkill('mnry_mijiang');
    },
            },
            "mnry_duoqing":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"phaseEnd",
                },
                direct:true,
                content:function (){
        "step 0"
        if(player.storage.mnry_duoqing||
        (get.mode()=='guozhan'&&player.hiddenSkills.contains('mnry_duoqing'))){
            if(!player.storage.mnry_duoqing){
                event.skillHidden=true;
            }
            player.chooseBool(get.prompt('mnry_duoqing')).set('ai',function(){
                var player=_status.event.player;
                if(player.hp>3) return true;
                if(player.hp==3&&player.countCards('h')<3) return true;
                if(player.hp==2&&player.countCards('h')==0) return true;
                return false;
            });
        }
        else{
            event.forced=true;
        }
        "step 1"
        if(event.forced||result.bool){
            player.logSkill('mnry_duoqing');
            player.loseHp();
        }
        else{
            event.finish();
        }
        "step 2"
        player.draw(2);
    },
                ai:{
                    threaten:1.5,
                },
            },
            "mnry_cunji":{
                mod:{
                    maxHandcard:function (player,num){
            if(player.hp<player.maxHp) return 2+player.hp;
        },
                },
            },
            "mnry_shicong":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"phaseEnd",
                },
                priority:15,
                group:"yxs_menshen3",
                onremove:true,
                filter:function (event,player){
        return game.players.length>1;
    },
                content:function (){
              "step 0"
     player.chooseTarget('选择【侍从】的目标',lib.translate.yxs_menshen_info,true,function(card,player,target){
             return target!=player;
     }).set('ai',function(target){     
             return get.attitude(player,target);            
     });        
     "step 1"
     if(result.bool){           
        var target=result.targets[0];
                        player.line(target,'green');
                        game.log(target,'成为了','【侍从】','的目标');
                        target.storage.yxs_menshen2=player;
                        target.addSkill('yxs_menshen2');
     }
    else {       
            event.finish(); 
    }                     
   },
                ai:{
                    expose:0.5,
                },
            },
            "mnry_xingpian":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"phaseUseBegin",
                },
                direct:true,
                filter:function (event,player){
        return player.countCards('h')>0;
    },
                derivation:["new_zhixi"],
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('mnry_xingpian'),function(card,player,target){
            return player.canCompare(target);
        }).set('ai',function(target){
            return -get.attitude(_status.event.player,target)/target.countCards('h');
        });
        "step 1"
        if(result.bool){
            player.logSkill('mnry_xingpian',result.targets[0]);
            player.chooseToCompare(result.targets[0]);
        }
        else{
            event.finish();
        }
        "step 2"
        if(result.bool){
            player.addTempSkill('qiaoshui3');
        }
        else{
            player.addTempSkill('new_zhixi','phaseUseEnd');
            target.draw(2);
        }
    },
                ai:{
                    expose:0.1,
                },
            },
            "mnry_wangchuan":{
                audio:"ext:芙蕖绿波:4",
                trigger:{
                    global:"damageEnd",
                },
                filter:function (event,player){
        return (event.card&&event.card.name=='sha'&&event.source&&
            event.player.classList.contains('dead')==false&&player.countCards('he'));
    },
                direct:true,
                checkx:function (event,player){
        var att1=get.attitude(player,event.player);
        var att2=get.attitude(player,event.source);
        return att1>0&&att2<=0;
    },
                content:function (){
        "step 0"
        var next=player.chooseToDiscard('he',get.prompt('忘川'));
        var check=lib.skill.beige.checkx(trigger,player);
        next.set('ai',function(card){
            if(_status.event.goon) return 8-get.value(card);
            return 0;
        });
        next.set('logSkill','忘川');
        next.set('goon',check);
        "step 1"
        if(result.bool){
            trigger.player.judge();
        }
        else{
            event.finish();
        }
        "step 2"
        switch(get.suit(result.card)){
            case 'heart':trigger.player.gainMaxHp();break;
            case 'diamond':trigger.player.draw(3);break;
            case 'club':trigger.source.chooseToDiscard('he',3,true);break;
            case 'spade':trigger.source.turnOver();break;
        }
    },
                ai:{
                    expose:0.3,
                },
            },
            "mnry_dianshui":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:["useCardAfter","respondAfter"],
                },
                frequent:true,
                filter:function (event,player){
        if(player==_status.currentPhase) return false;
        if(event.cards){
            for(var i=0;i<event.cards.length;i++){
                if(get.color(event.cards[i])=='black'&&
                event.cards[i].original!='j') return true;
            }
        }
        return false;
    },
                content:function (){
        var num=[2,2,3,3,2].randomGet();
        if(num==2) player.draw(1);
        if(num==3) player.draw(2);
    },
                ai:{
                    threaten:0.7,
                },
            },
            "mnry_boxing":{
                audio:"ext:芙蕖绿波:2",
                mod:{
                    targetInRange:function (card,player,target,now){
            if(get.suit(card)=='heart') return true;
        },
                },
                onremove:true,
                trigger:{
                    player:"useCardToBegin",
                },
                forced:true,
                filter:function (event,player){
        return event.card&&get.suit(event.card)=='heart';
    },
                content:function (){
        trigger.directHit=true;
    },
            },
            "mnry_huose":{
                audio:"ext:芙蕖绿波:2",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player.canCompare(target);
    },
                filter:function (event,player){
        return player.countCards('h')>0;
    },
                content:function (){
        "step 0"
        player.chooseToCompare(target);
        "step 1"
        if(result.bool){
            target.turnOver();
            rarget.draw(2);
        }
    },
                ai:{
                    result:{
                        target:function (player,target){
                if(target.hasJudge('lebu')) return -get.effect(target,{name:'lebu'},player,target);
                return get.effect(target,{name:'lebu'},player,target);
            },
                    },
                    order:9,
                },
            },
            "mnry_zoubi":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:["chooseToCompareAfter","compareMultipleAfter"],
                    target:["chooseToCompareAfter","compareMultipleAfter"],
                },
                frequent:true,
                content:function (){
        player.draw();
    },
            },
            "mnry_yishu":{
                audio:"ext:芙蕖绿波:2",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player.canCompare(target);
    },
                filter:function (event,player){
        return player.countCards('h')>0;
    },
                content:function (){
        "step 0"
        player.chooseToCompare(target);
        "step 1"
        if(result.bool){
            player.draw(2);
        }
        else{
            target.recover();
        }
    },
                ai:{
                    order:function (name,player){
            var cards=player.getCards('h');
            for(var i=0;i<cards.length;i++){
                if(cards[i].name!='tao'&&cards[i].number>11&&get.value(cards[i])<7){
                    return 9;
                }
            }
            return get.order({name:'tao'})-1;
        },
                    result:{
                        player:function (player){
                var num=player.countCards('h');
                if(num>player.hp) return 0;
                if(num==1) return -2;
                if(num==2) return -1;
                return -0.7;
            },
                        target:function (player,target){
                var num=target.countCards('h');
                if(get.attitude(player,target)>3){
                if(num==1) return -1;
                if(num==2) return -0.7;
                    return target.maxHp-target.hp;
                }
                if(get.attitude(player,target)<=0){
                if(target.hp==target.maxHp) return -1;
                if(num==1) return -1;
                if(num==2) return -0.7;
                }
                return -0.5
            },
                    },
                    threaten:1.3,
                },
            },
            "mnry_shufen":{
                trigger:{
                    player:"damageEnd",
                },
                frequent:true,
                audio:"ext:芙蕖绿波:2",
                content:function (){
        "step 0"
        event.cards=get.cards(3);
        event.videoId=lib.status.videoId++;
        game.broadcastAll(function(player,id,cards){
            var str;
            if(player==game.me&&!_status.auto){
                str='书愤：选择任意张点数不大于16的牌';
            }
            else{
                str='书愤';
            }
            var dialog=ui.create.dialog(str,cards);
            dialog.videoId=id;
        },player,event.videoId,event.cards);
        event.time=get.utc();
        game.addVideo('showCards',player,['书愤',get.cardsInfo(event.cards)]);
        game.addVideo('delay',null,2);
        "step 1"
        var next=player.chooseButton([0,3]);
        next.set('dialog',event.videoId);
        next.set('filterButton',function(button){
            var num=0
            for(var i=0;i<ui.selected.buttons.length;i++){
                num+=get.number(ui.selected.buttons[i].link);
            }
            return (num+get.number(button.link)<=16);
        });
        next.set('ai',function(button){
            return get.value(button.link,_status.event.player);
        });
        "step 2"
        if(result.bool&&result.links){
            //player.logSkill('书愤');
            var cards2=[];
            for(var i=0;i<result.links.length;i++){
                cards2.push(result.links[i]);
                cards.remove(result.links[i]);
            }
            for(var i=0;i<cards.length;i++){
                cards[i].discard();
            }
            event.cards2=cards2;
        }
        else{
            event.finish();
        }
        var time=1000-(get.utc()-event.time);
        if(time>0){
            game.delay(0,time);
        }
        "step 3"
        game.broadcastAll('closeDialog',event.videoId);
        var cards2=event.cards2;
        player.gain(cards2,'log');
        player.$draw(cards2);
        game.delay();
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    if(!target.hasFriend()) return;
                    if(target.hp>=4) return [1,2];
                    if(target.hp==3) return [1,1.5];
                    if(target.hp==2) return [1,0.5];
                }
            },
                    },
                },
            },
            "mnry_guyan":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"phaseEnd",
                },
                filter:function (event,player){
        return player.hp==1;
    },
                frequent:true,
                content:function (){
        player.recover();
    },
            },
            "mnry_yingbian":{
                skillAnimation:true,
                audio:"ext:芙蕖绿波:2",
                derivation:["zhenlie"],
                unique:true,
                trigger:{
                    player:"changeHp",
                },
                filter:function (event,player){
        return player.hp<=1&&!player.storage.yingbian;
    },
                forced:true,
                priority:3,
                content:function (){
        player.recover();
        player.addSkill('zhenlie');
        game.log(player,'获得了技能','【贞烈】')
        player.awakenSkill('mnry_yingbian');
        player.storage.yingbian=true;
    },
                ai:{
                    threaten:function (player,target){
            if(target.hp==1) return 2;
            return 0.5;
        },
                    maixie:true,
                    effect:{
                        target:function (card,player,target){
                if(!target.hasFriend()) return;
                if(get.tag(card,'damage')==1&&target.hp==2&&!target.isTurnedOver()&&
                _status.currentPhase!=target&&get.distance(_status.currentPhase,target,'absolute')<=3) return [0.5,1];
            },
                    },
                },
            },
            "mnry_miji":{
                trigger:{
                    player:"phaseEnd",
                },
                filter:function (event,player){
        return player.hp<player.maxHp;
    },
                direct:true,
                content:function (){
        'step 0'
        var num=player.maxHp-player.hp;
        player.chooseTarget(get.prompt('秘笈'),[1,num],function(card,player,target){
            return target;
        }).set('ai',function(target){
            return get.attitude(player,target)>2;
        });
        'step 1'
        if(result.bool){
            player.logSkill('秘笈',result.targets);
            event.players=result.targets;
            for(var i=0;i<event.players.length;i++){
                event.players[i].recover();
                game.delay();
            }
        }
    },
                ai:{
                    expose:0.8,
                },
            },
            "mnry_xieshu":{
                mod:{
                    globalFrom:function (from,to,distance){
            return distance-1;
        },
                    globalTo:function (from,to,distance){
            return distance+1;
        },
                    canBeDiscarded:function (card){
            if(get.position(card)=='e') return false;
        },
                },
            },
            "mnry_zhenxi":{
                audio:"ext:芙蕖绿波:2",
                inherit:"bagua_skill",
                filter:function (event,player){
        if(!lib.skill.bagua_skill.filter(event,player)) return false;
        if(!player.isEmpty(2)) return false;
        return true;
    },
                ai:{
                    effect:{
                        target:function (card,player,target){
                if(player==target&&get.subtype(card)=='equip2'){
                    if(get.equipValue(card)<=7.5) return 0;
                }
                if(!target.isEmpty(2)) return;
                return lib.skill.bagua_skill.ai.effect.target.apply(this,arguments);
            },
                    },
                },
                trigger:{
                    player:"chooseToRespondBegin",
                },
                check:function (event,player){
        if(get.damageEffect(player,event.player,player)>=0) return false;
        return true;
    },
                content:function (){
        "step 0"
        player.judge('bagua',function(card){return (get.color(card)=='red')?1.5:-0.5});
        "step 1"
        if(result.judge>0){
            trigger.untrigger();
            trigger.responded=true;
            trigger.result={bool:true,card:{name:'shan'}}
        }
    },
                equipSkill:true,
            },
            "mnry_lianyin":{
                audio:"ext:芙蕖绿波:2",
                enable:"phaseUse",
                filterCard:true,
                usable:1,
                selectCard:2,
                check:function (card){
        var player=get.owner(card);
        if(player.countCards('h')>player.hp)
            return 8-get.value(card)
        if(player.hp<player.maxHp)
            return 6-get.value(card)
        return 4-get.value(card)
    },
                filterTarget:function (card,player,target){
        if(target.sex!='female') return false;
        if(target.hp>=target.maxHp) return false;
        if(target==player) return false;
        return true;
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
                if(player.countCards('h')>player.hp) return 0
                return -1;
            },
                        target:4,
                    },
                    threaten:2,
                },
            },
            "mnry_qingyi":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:["phaseUseBegin","phaseUseEnd"],
                },
                frequent:true,
                content:function (){
        player.draw();
    },
            },
            "mnry_zhenyan":{
                enable:"phaseUse",
                prompt:"出牌阶段限一次，你可以令一名角色摸一张并展示之，若是装备牌，其立即装备之并回复一点体力",
                usable:1,
                filterTarget:function (card,player,target){
        return target;
    },
                content:function (){
        "step 0" 
        event.cards=get.cards(1); 
        player.showCards(event.cards); 
        "step 1"       
        for(var i=0;i<event.cards.length;i++){ 
           if(get.type(event.cards[i])=='equip'){ 
                game.delay(0.5);             
                target.equip(event.cards[i],true).set('delay',true);      
                target.recover();                  
                event.finish(); 
            }else{                      
                target.gain(event.cards[i],'gain2');    
            }           
        }                
    },
                ai:{
                    order:6,
                    result:{
                        target:1,
                    },
                },
            },
            "mnry_zhuanshi":{
                usable:4,
                enable:"phaseUse",
                filter:function (event,player){
        return player.countCards('h')==1&&player.canUse('wuzhong',player);
    },
                direct:true,
                delay:0,
                content:function (){
        player.useCard({name:'wuzhong'},player.getCards('h'),player,'mnry_zhuanshi');
    },
                ai:{
                    order:10,
                    result:{
                        player:function (player,target){
                return 10-get.value(player.getCards('h')[0]);
            },
                    },
                },
            },
            "mnry_zhisan":{
                trigger:{
                    target:"useCardToBefore",
                },
                forced:true,
                priority:15,
                check:function (event,player){
        return get.effect(event.target,event.card,event.player,player)<0;
    },
                filter:function (event,player){
        return get.type(event.card,'trick')=='trick'&&get.distance(event.player,player)>3;
    },
                content:function (){
        trigger.cancel();
    },
                ai:{
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card,'trick')=='trick'&&get.distance(player,target)>2) return 'zeroplayertarget';
            },
                    },
                },
            },
            "mnry_yijia":{
                trigger:{
                    player:"phaseBegin",
                },
                direct:true,
                filter:function (event,player){
        return player.countCards('j')>0;
    },
                content:function (){
        "step 0"
        var next=player.discardPlayerCard(player,2,'hj','是否一张手牌来弃置一张花色相同的判定牌？');
        next.filterButton=function(button){
            var card=button.link;
            if(!lib.filter.cardDiscardable(card,player)) return false;
            if(ui.selected.buttons.length==0) return true;
            if(get.position(ui.selected.buttons[0].link)=='h'){
                if(get.position(card)!='j') return false;
            }
            if(get.position(ui.selected.buttons[0].link)=='j'){
                if(get.position(card)!='h') return false;
            }
            return get.suit(card)==get.suit(ui.selected.buttons[0].link)
        };
        next.ai=function(button){
            var card=button.link;
            if(get.position(card)=='h'){
                return 11-get.value(card);
            }
            if(card.name=='lebu') return 5;
            if(card.name=='bingliang') return 4;
            if(card.name=='guiyoujie') return 3;
            return 2;
        };
        next.logSkill='移驾';
    },
            },
            "mnry_qizhen":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    source:"damageEnd",
                },
                usable:3,
                frequent:true,
                content:function (){
        player.draw();
    },
            },
            "mnry_jianshi":{
                trigger:{
                    player:["phaseBefore","changeHp"],
                },
                forced:true,
                popup:false,
                unique:true,
                derivation:["mnry_cunji","jizhi","jieyuan"],
                content:function (){
        player.removeAdditionalSkill('mnry_jianshi');
        var list=[];
        if(player.hp<=3){
            list.push('mnry_cunji');
        }
        if(player.hp<=2){
            list.push('jizhi');
        }
        if(player.hp<=1){
            list.push('jieyuan');
        }
        if(list.length){
            player.addAdditionalSkill('mnry_jianshi',list);
        }
    },
                ai:{
                    maixie:true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(!target.hasFriend()) return;
                    if(target.hp>=4) return [0,1];
                }
                if(get.tag(card,'recover')&&player.hp>=player.maxHp-1) return [0,0];
            },
                    },
                },
            },
            "mnry_chizhong":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"changeHp",
                },
                frequent:true,
                content:function (){
        player.draw();
    },
            },
            "mnry_qinguo":{
                audio:"ext:芙蕖绿波:2",
                enable:["chooseToRespond"],
                filterCard:function (card){
        return get.color(card)=='black';
    },
                viewAs:{
                    name:"shan",
                },
                viewAsFilter:function (player){
        if(!player.countCards('h',{color:'black'})) return false;
    },
                prompt:"将一张黑色手牌当闪打出",
                check:function (){return 1},
                ai:{
                    respondShan:true,
                    skillTagFilter:function (player){
            if(!player.countCards('h',{color:'black'})) return false;
        },
                    effect:{
                        target:function (card,player,target,current){
                if(get.tag(card,'respondShan')&&current<0) return 0.6
            },
                    },
                    basic:{
                        useful:[7,2],
                        value:[7,2],
                    },
                    order:3,
                    result:{
                        player:1,
                    },
                },
            },
            "mnry_hongyan":{
                mod:{
                    suit:function (card,suit){
            if(suit=='spade') return 'heart';
        },
                },
            },
            "mnry_liuli":{
                audio:"ext:芙蕖绿波:2",
                audioname:["re_daqiao","daxiaoqiao"],
                trigger:{
                    target:"shaBefore",
                },
                direct:true,
                priority:5,
                filter:function (event,player){
        if(player.countCards('he')==0) return false;
        return game.hasPlayer(function(current){
            return get.distance(player,current,'attack')<=1&&current!=event.player&&
                current!=player&&lib.filter.targetEnabled(event.card,event.player,current);
        });
    },
                content:function (){
        "step 0"
        var next=player.chooseCardTarget({
            position:'he',
            filterCard:lib.filter.cardDiscardable,
            filterTarget:function(card,player,target){
                var trigger=_status.event.getTrigger();
                if(get.distance(player,target,'attack')<=1&&
                    target!=trigger.player){
                    if(player.canUse(trigger.card,target)) return true;
                }
                return false;
            },
            ai1:function(card){
                return get.unuseful(card)+9;
            },
            ai2:function(target){
                if(_status.event.player.countCards('h','shan')){
                    return -get.attitude(_status.event.player,target);
                }
                if(get.attitude(_status.event.player,target)<5){
                    return 6-get.attitude(_status.event.player,target);
                }
                if(_status.event.player.hp==1&&player.countCards('h','shan')==0){
                    return 10-get.attitude(_status.event.player,target);
                }
                if(_status.event.player.hp==2&&player.countCards('h','shan')==0){
                    return 8-get.attitude(_status.event.player,target);
                }
                return -1;
            },
            prompt:get.prompt2('liuli')
        });
        "step 1"
        if(result.bool){
            player.discard(result.cards);
            var target=result.targets[0];
            player.logSkill(event.name,target);
            trigger.target=target;
            var evt=trigger.getParent();
            if(evt&&evt.targets&&evt.num){
                trigger.targets[evt.num]=target;
                evt.targets[evt.num]=target;
            }
        }
        else{
            event.finish();
        }
        "step 2"
        trigger.untrigger();
        trigger.trigger('useCardToBefore');
        trigger.trigger('shaBefore');
        game.delay();
    },
                ai:{
                    effect:{
                        target:function (card,player,target){
                if(target.countCards('he')==0) return;
                if(card.name!='sha') return;
                var min=1;
                var friend=get.attitude(player,target)>0;
                var vcard={name:'shacopy',nature:card.nature,suit:card.suit};
                var players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    if(player!=players[i]&&
                        get.attitude(target,players[i])<0&&
                        target.canUse(card,players[i])){
                        if(!friend) return 0;
                        if(get.effect(players[i],vcard,player,player)>0){
                            if(!player.canUse(card,players[0])){
                                return [0,0.1];
                            }
                            min=0;
                        }
                    }
                }
                return min;
            },
                    },
                },
            },
            "<li>chenqing":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    global:"dying",
                },
                priority:6,
                filter:function (event,player){
        return event.player.hp<=0&&!player.hasSkill('chenqing2');
    },
                direct:true,
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt('chenqing'),function(card,player,target){
            return target!=player&&target!=_status.event.getTrigger().player;
        }).set('ai',function(target){
            var player=_status.event.player;
            var trigger=_status.event.getTrigger();
            if(get.attitude(player,trigger.player)>0){
                var att1=get.attitude(target,player);
                var att2=get.attitude(target,trigger.player);
                var att3=get.attitude(player,target);
                if(att3<0) return 0;
                return att1/2+att2+att3;
            }
            else{
                return 0;
                // return get.attitude(player,target);
            }
        });
        'step 1'
        if(result.bool){
            player.addTempSkill('chenqing2',{player:'phaseBegin'});
            event.target=result.targets[0];
            event.target.draw(4);
            player.logSkill('chenqing',event.target);
        }
        else{
            event.finish();
        }
        'step 2'
        var target=event.target;
        var tosave=trigger.player;
        var att=get.attitude(target,tosave);
        var hastao=target.countCards('h','tao');
        target.chooseToDiscard(4,true,'he').set('ai',function(card){
            var hastao=_status.event.hastao;
            var att=_status.event.att;
            if(!hastao&&att>0){
                var suit=get.suit(card);
                for(var i=0;i<ui.selected.cards.length;i++){
                    if(get.suit(ui.selected.cards[i])==suit){
                        return -4-get.value(card);
                    }
                }
            }
            if(att<0&&ui.selected.cards.length==3){
                var suit=get.suit(card);
                for(var i=0;i<ui.selected.cards.length;i++){
                    if(get.suit(ui.selected.cards[i])==suit){
                        return -get.value(card);
                    }
                }
                return -10-get.value(card);
            }
            return -get.value(card);
        }).set('hastao',hastao).set('att',att);
        'step 3'
        if(result.cards&&result.cards.length==4){
            var suits=[];
            for(var i=0;i<result.cards.length;i++){
                suits.add(get.suit(result.cards[i]));
            }
            if(suits.length==4&&game.checkMod({name:'tao'},player,'unchanged','cardSavable',player)){
                event.target.useCard({name:'tao'},trigger.player);
            }
        }
    },
                ai:{
                    skillTagFilter:function (player){
            return !player.hasSkill('chenqing2');
        },
                    expose:0.2,
                    threaten:1.5,
                    save:true,
                },
            },
            "mnry_jizhi":{
                audio:"ext:芙蕖绿波:2",
                audioname:["jianyong"],
                trigger:{
                    player:"useCard",
                },
                frequent:true,
                filter:function (event){
        return (get.type(event.card)=='trick'&&(!event.cards.length||event.cards[0]&&event.cards[0]==event.card));
    },
                content:function (){
        player.draw();
    },
                ai:{
                    threaten:1.4,
                    noautowuxie:true,
                },
            },
            "mnry_xiefang":{
                mod:{
                    globalFrom:function (from,to,distance){
            return distance-game.countPlayer(function(current){
                return current.sex=='female';
            });
        },
                },
            },
            "mnry_zhongjian":{
                audio:"ext:芙蕖绿波:2",
                enable:"phaseUse",
                usable:2,
                filter:function (event,player){
        if(!player.countCards('h')) return false;
        if(player.getStat('skill').zhongjian&&!player.hasSkill('zhongjian2')) return false;
        return game.hasPlayer(function(current){
            return current!=player&&current.countCards('h')>current.hp;
        });
    },
                filterCard:true,
                check:function (){
        return Math.random();
    },
                discard:false,
                lose:false,
                filterTarget:function (card,player,target){
        return target!=player&&target.countCards('h')>target.hp;
    },
                content:function (){
        'step 0'
        player.showCards(cards);
        'step 1'
        var num=target.countCards('h')-target.hp;
        if(num<=0){
            event.finish();
            return;
        }
        var hs=target.getCards('h').randomGets(num);
        target.showCards(hs);
        var colors=[];
        var numbers=[];
        for(var i=0;i<cards.length;i++){
            colors.add(get.color(cards[i]));
            numbers.add(get.number(cards[i]));
        }
        event.bool1=false;
        event.bool2=false;
        for(var i=0;i<hs.length;i++){
            if(!event.bool1&&colors.contains(get.color(hs[i]))) event.bool1=true;
            if(!event.bool2&&numbers.contains(get.number(hs[i]))) event.bool2=true;
        }
        'step 2'
        if(event.bool1){
            player.chooseControl(function(event,player){
                return _status.event.bool?0:1;
            }).set('bool',(get.attitude(player,target)>=0||player.countCards('h')<target.countCards('h'))).set('choiceList',['摸一张牌','弃置'+get.translation(target)+'一张牌']);
        }
        else{
            event.goto(4);
        }
        'step 3'
        if(result&&typeof result.index=='number'){
            if(result.index==0) player.draw();
            else player.discardPlayerCard(target,'he',true);
        }
        'step 4'
        if(event.bool2){
            player.addTempSkill('zhongjian2');
        }
        if(!event.bool1&&!event.bool2){
            if(player.hasSkill('caishi')&&typeof player.storage.caishi=='number'){
                player.storage.caishi--;
                if(player.storage.caishi<=0){
                    player.unmarkSkill('caishi');
                    if(player.storage.caishi<0){
                        player.markSkill('zhongjian');
                    }
                }
                else{
                    player.updateMarks();
                }
            }
            else{
                player.unmarkSkill('zhongjian');
                if(player.hasSkill('zhongjian3')){
                    player.storage.zhongjian3--;
                }
                else{
                    player.addSkill('zhongjian3');
                }
            }
            player.popup('杯具');
        }
    },
                intro:{
                    content:function (storage,player){
            return '手牌上限'+player.storage.caishi;
        },
                    markcount:function (storage,player){
            return player.storage.caishi;
        },
                },
                ai:{
                    order:8,
                    result:{
                        player:function (player,target){
                var num=target.countCards('h')-target.hp;
                if(get.attitude(player,target)<0) return 1.5*num;
                return num;
            },
                    },
                },
            },
            "mnry_roulin":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"shaBegin",
                    target:"shaBegin",
                },
                forced:true,
                filter:function (event,player){
        if(event.directHit) return false;
        if(player==event.player){
            return event.target.sex=='female';
        }
        return event.player.sex=='female';
    },
                check:function (event,player){
        return player==event.player;
    },
                priority:-1,
                content:function (){
        if(typeof trigger.shanRequired=='number'){
            trigger.shanRequired++;
        }
        else{
            trigger.shanRequired=2;
        }
    },
            },
            "mnry_jijiu":{
                audio:"ext:芙蕖绿波:2",
                audioname:["re_huatuo"],
                enable:"chooseToUse",
                filter:function (event,player){
        return _status.currentPhase!=player;
    },
                filterCard:function (card){
        return get.color(card)=='red';
    },
                position:"he",
                viewAs:{
                    name:"tao",
                },
                prompt:"将一张红色牌当桃使用",
                check:function (card){return 15-get.value(card)},
                ai:{
                    skillTagFilter:function (player){
            return player.countCards('he',{color:'red'})>0&&_status.currentPhase!=player;
        },
                    threaten:1.5,
                    save:true,
                    respondTao:true,
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
            "mnry_lihun":{
                audio:"ext:芙蕖绿波:2",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player!=target&&target.sex=='male';
    },
                filterCard:true,
                position:"he",
                content:function (){
        player.gain(target.getCards('h'),target);
        target.$give(target.countCards('h'),player);
        player.turnOver();
        player.addSkill('lihun2');
        player.storage.lihun=target;
    },
                check:function (card){return 8-get.value(card)},
                ai:{
                    order:10,
                    result:{
                        player:function (player){
                if(player.classList.contains('turnedover')) return 10;
                return 0;
            },
                        target:function (player,target){
                if(target.countCards('h')>target.hp) return target.hp-target.countCards('h');
                return 0;
            },
                    },
                    threaten:1.5,
                    effect:{
                        target:function (card){
                if(card.name=='guiyoujie') return [0,2];
            },
                    },
                },
            },
            "mnry_shouhu":{
                mod:{
                    cardEnabled:function (card){
                        if(card.name=='sha') return false;
                    },
                },
                enable:"phaseUse",
                filter:function (event,player){
                    return player.countCards('h','sha')>0;
                },
                filterTarget:function (card,player,target){
                    return target.hp<target.maxHp&&target!=player;
                },
                content:function (){
                    target.recover();
                },
                filterCard:{
                    name:"sha",
                },
                ai:{
                    order:7,
                    threaten:2,
                    result:{
                        target:function (player,target){
                            return get.recoverEffect(target,player,target);
                        },
                    },
                },
            },
            "mnry_wenji":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"phaseUseBegin",
                },
                direct:true,
                filter:function (event,player){
        return game.hasPlayer(function(current){
            return current!=player&&current.countCards('h');
        });
    },
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt2('mnry_wenji'),function(card,player,target){
            return target!=player&&target.countCards('h');
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>0) return Math.sqrt(att)/10;
            return 5-att;
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            event.target=target;
            player.logSkill('mnry_wenji',target);
            target.chooseCard('h',true,'问计：将一张手牌交给'+get.translation(player));
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.bool){
            var chat=["烟雨带带我","玄德你别走啊","诗笺，那个啥……","Niya，呼叫Niya"];
            player.chat(chat.randomGet());
            player.addTempSkill('mnry_wenji_respond');
            player.storage.mnry_wenji_respond=result.cards[0].name;
            event.target.give(result.cards,player);
        }
    },
            },
            "mnry_zhensha":{
                trigger:{
                    player:"phaseEnd",
                },
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('鸩杀'),function(card,player,target){
            return player!=target&&target.hp>player.hp;
        }).ai=function(target){
            return get.damageEffect(target,player,player);
        }
        "step 1"
        if(result.bool){
            player.logSkill('鸩杀',result.targets);
            result.targets[0].damage();
        }
    },
            },
            "mnry_kuiping":{
                trigger:{
                    player:"phaseDiscardBegin",
                },
                frequent:true,
                filter:function (event,player){
        return !player.getStat('damage');
    },
                content:function (){
        player.gain(get.cardPile(function(card){
            return get.type(card,'trick')=='trick';
        }),'gain2');
        player.draw();
    },
                audio:"ext:芙蕖绿波:2",
            },
            "mnry_wuxiu":{
                mark:true,
                locked:true,
                marktext:"舞",
                intro:{
                    content:function (storage,player,skill){
            if(player.storage.mnry_wuxiu==true) return '离魂:出牌阶段，你可以弃置一张牌并将你的武将牌翻面，若如此做，你指定一名男性角色，获得其所有手牌。出牌阶段结束时，你需为该角色每一点体力分配给其一张牌。每回合限一次。';
            return '迷情:出牌阶段限一次，你可以弃一张牌或者流失一点体力，然后选择一名角色，若其为男性则其翻面且恢复一点体力，否则其流失一点体力';
        },
                },
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                content:function (){
        if(player.storage.mnry_wuxiu==true){
            player.storage.mnry_wuxiu=false;
            player.addTempSkill('mnry_lihun',{player:'phaseAfter'});
        }else{
            player.storage.mnry_wuxiu=true;
            player.addTempSkill('mnry_miqing',{player:'phaseAfter'});
        };
    },
            },
            "mnry_wangshuo":{
                locked:true,
                unique:true,
                enable:"chooseToUse",
                mark:true,
                skillAnimation:true,
                animationStr:"往朔",
                limited:true,
                animationColor:"white",
                filter:function (event,player){
        if(event.type=='dying'){
            if(player!=event.dying) return false;
            return true;
        }
        return false;
    },
                content:function (){
        'step 0'
        player.init('mnry_shuoyueji');
        'step 1'
        player.link(false);
        'step 2'
        player.turnOver(false);
        'step 3'
        player.draw(3);
        'step 4'
        if(player.hp<4){
            player.recover(4-player.hp);
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
                },
                intro:{
                    content:"limited",
                },
                init:function (player,skill){
        player.storage[skill]=false;
    },
            },
            "mnry_wanyi":{
                audio:"ext:芙蕖绿波:2",
                enable:"chooseToUse",
                filter:function (event,player){
        return player.countCards('he',{suit:'diamond'})>0;
    },
                filterCard:function (card){
        return get.suit(card)=='diamond';
    },
                filterTarget:function (card,player,target){
        if(target.isTurnedOver()) return false;
        return true;
    },
                position:"he",
                prompt:"弃置一张方片牌令一名角色翻面",
                check:function (card){return 6-get.value(card)},
                content:function (){
        target.turnOver();
    },
                ai:{
                    threaten:1.5,
                    basic:{
                        order:1,
                        useful:1,
                        value:8,
                    },
                    result:{
                        target:function (player,target){
                var num=target.hp-target.countCards('h')-2;
                if(num>-1) return -0.01;
                if(target.hp<3) num--;
                if(target.isTurnedOver()) num/=2;
                var dist=get.distance(player,target,'absolute');
                if(dist<1) dist=1;
                return num/Math.sqrt(dist);
            },
                    },
                    tag:{
                        skip:"phaseUse",
                    },
                },
            },
            "mnry_diefeng":{
                audio:"ext:芙蕖绿波:2",
                locked:false,
                mod:{
                    aiOrder:function (player,card){
            if(typeof card=='object'&&player.isPhaseUsing()){
                var evt=player.getLastUsed();
                if(evt&&evt.card&&(get.suit(evt.card)&&get.suit(evt.card)==get.suit(card))){
                    return num+10;
                }
            }
        },
                },
                trigger:{
                    player:"useCard",
                },
                frequent:true,
                filter:function (event,player){
        var evt=player.getLastUsed(1);
        if(!evt||!evt.card) return false;
        if(!player.isPhaseUsing()) return false;
        var evt2=evt.getParent('phaseUse');
        if(!evt2||evt2.name!='phaseUse'||evt2.player!=player) return false;
        return get.color(evt.card)&&get.color(evt.card)==get.color(event.card);
    },
                content:function (){
        player.draw();
        player.logSkill('mnry_diefeng');
    },
            },
            "mnry_ranshsng":{
                locked:true,
                trigger:{
                    source:"damageBegin1",
                },
                direct:true,
                filter:function (event){
        if(event._notrigger.contains(event.player)) return false;
        return event.num&&event.source&&event.player&&
        event.player.isAlive()&&event.source.isAlive()&&event.source!=event.player&&event.player.isTurnedOver();
    },
                content:function (){
        trigger.num++;
        player.logSkill('mnry_ranshang');
    },
            },
            "mnry_yixiao":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:["useCardAfter","respondAfter","disCardAfter"],
                },
                frequent:true,
                filterCard:function (card){
        return get.suit(card)=='heart';
    },
                filter:function (event,player){
        if(event.cards){
            for(var i=0;i<event.cards.length;i++){
                if(get.suit(event.cards[i])=='spade'||get.suit(event.cards[i])=='heart'&&
                event.cards[i].original!='j') return true;
            }
        }
        return false;
    },
                content:function (){
        player.draw();
        player.logSkill('mnry_yixiao');
    },
                mod:{
                    suit:function (card,suit){
            if(suit=='spade') return 'heart';
        },
                },
                ai:{
                    threaten:0.7,
                },
            },
            "mnry_jinjiao":{
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:"damageBegin",
                },
                filterCard:true,
                filter:function (event,player){
        return player.countCards('h',{suit:'heart'})>0&&event.num>0;
    },
                content:function (){
        "step 0"
        player.chooseToDiscard({suit:'heart'});
        "step 1"
        if(result.bool){
            trigger.cancel();
            player.logSkill('mnry_jinjiao');
        }
        else{
            event.finish();
        }
    },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function (card,player,target){
                if(player.hasSkillTag('jueqing',false,target)) return;
                if(get.tag(card,'damage')&&player.countCards('h')>1) return 0.7;
            },
                    },
                    threaten:function (player,target){
            if(target.countCards('h')==0) return 2;
        },
                },
            },
            "mnry_wanghui":{
                locked:true,
                direct:true,
                audio:"ext:芙蕖绿波:2",
                trigger:{
                    player:["phaseUseBegin","phaseUseEnd"],
                },
                filter:function (event,player){
        return player.hp<4;
    },
                content:function (){
        player.init('mnry_wangyueji');
        player.draw(2);
        player.logSkill('mnry_wanghui');
    },
            },
            "朔望":{
                locked:true,
                direct:true,
                trigger:{
                    global:"phaseBegin",
                },
                content:function (){
        player.init('mnry_wangyueji');
        player.logSkill('mnry_shuowang');
    },
                ai:{
                    threaten:2.4,
                },
            },
        },
        translate:{
            "mnry_chengyi":"成仪",
            "mnry_chengyi_info":"<li>锁定技，摸牌阶段摸牌时，你额外摸一张牌<li>锁定技你的手牌上限+2x(x为你已损失体力值)",
            "mnry_quanshan":"劝善",
            "mnry_quanshan_info":"每名其他角色回合结束时，若其只有一点体力，你可以弃一张牌，令其获得一点护甲",
            "mnry_baoli":"暴戾",
            "mnry_baoli_info":"锁定技，每当一名角色死亡后，你增加一点体力上限，回复一点体力。",
            "mnry_sougua":"搜刮",
            "mnry_sougua_info":"出牌阶段，你可以减少一点体力上限并摸两张牌",
            "mnry_sheshu":"蛇术",
            "mnry_sheshu_info":"出牌阶段限两次，你可以令一名随机敌人获得一张毒",
            "mnry_tunhua":"呑化",
            "mnry_tunhua_info":"结束阶段，对体力不小于你的一名其他角色造成2点伤害",
            "mnry_shixin":"噬心",
            "mnry_shixin_info":"锁定技，当你造成伤害后，摸两张牌并回一滴血",
            "mnry_huihuo":"挥霍",
            "mnry_huihuo_info":"锁定技，若你于弃牌阶段弃置了2张以上的牌，你增加一点体力上限",
            "mnry_paihuai":"徘徊",
            "mnry_paihuai_info":"摸牌阶段，你可以观看牌堆顶的三张牌，然后将其中的两张牌置于牌堆顶，并将其余的牌以任意顺序置于牌堆底。",
            "mnry_luxiang":"禄相",
            "mnry_luxiang_info":"当其他角色死亡后，你可以摸两张牌。若如此做，你获得下列技能中的任意一个：“英姿”、 “直言”和“慎行”",
            "mnry_yuanyang":"鸳鸯",
            "mnry_yuanyang_info":"出牌阶段，你可以弃置两张牌并选择1名已经受伤的男性角色，你与其各回复一点体力然后摸一弃一，每阶段限一次",
            "mnry_zigua":"自挂",
            "mnry_zigua_info":"限定技，出牌阶段，你可以将所有手牌交给一名女性角色，令该角色获得技能【鸳鸯】，然后你将武将牌翻面",
            "mnry_zhenshu":"贞淑",
            "mnry_zhenshu_info":"锁定技，当你的体力值不等于你的体力上限，你的手牌上限为体力上限+3。",
            "mnry_fuchi":"赴池",
            "mnry_fuchi_info":"限定技，当一名男性角色使用【桃】令你脱离濒死状态时，若场上没有“焦仲卿”，则其可以将自己的一张武将牌变更为“焦仲卿”。然后你增加一点体力上限，并获得技能〖闭月〗。",
            "mnry_chenzui":"沉醉",
            "mnry_chenzui_info":"结束阶段，你可以摸一张牌，若你武将牌背面朝上，则改为摸两张牌",
            "mnry_duyi":"毒医",
            "mnry_duyi_info":"出牌阶段，你可以令一名角色回复一点体力并摸起一张毒，每阶段限一次",
            "mnry_duli":"毒理",
            "mnry_duli_info":"有角色因使用、打出或弃置而失去毒时，你可以摸一张牌",
            "mnry_miqing":"迷情",
            "mnry_miqing_info":"出牌阶段限一次，你可以弃一张牌或者流失一点体力，然后选择一名角色，若其为男性则其翻面且恢复一点体力，否则其流失一点体力",
            "mnry_jiebei":"戒备",
            "mnry_jiebei_info":"当有装备牌进入你的装备区时，你可以获得一点护甲",
            "mnry_feichi":"飞驰",
            "mnry_feichi_info":"<li>锁定技，你的进攻距离始终+1<li>锁定技，你的防御距离始终+1",
            "mnry_xiaoji":"晓骑",
            "mnry_xiaoji_info":"每当你失去一张装备牌，可以摸一张牌",
            "mnry_guiyuan":"归愿",
            "mnry_guiyuan_info":"限定技，你可以失去所有技能和一点体力，然后令任意名其他角色获得一点护甲并摸一张牌",
            "mnry_quanjiu":"劝酒",
            "mnry_quanjiu_info":"锁定技，你的【酒】均视为【杀】",
            "mnry_xiangyun":"祥云",
            "mnry_xiangyun_info":"锁定技，游戏开始时，废除你的判定区",
            "mnry_shenxin":"神性",
            "mnry_shenxin_info":"锁定技，你的武将牌始终朝上",
            "mnry_qingnuan":"青鸾",
            "mnry_qingnuan_info":"每当你于回合外失去牌时，你可以进行一次判定，若结果为红色，你摸一张牌",
            "mnry_moshang":"墨殇",
            "mnry_moshang_info":"<li>锁定技，除了你的濒死阶段外，你不能使用桃。<br><li>回合结束，你可以摸起损失体力张数的牌并将体力回复至体力上限",
            "mnry_momo":"脉脉",
            "mnry_momo_info":"出牌阶段，你可以自减一点体力摸一张牌然后你令你在其攻击范围内的一名角色流失一点体力，每回合限一次。",
            "mnry_hongzhuang":"红装",
            "mnry_hongzhuang_info":"每当你你失去装备区里的牌时，你可以获得一点护甲并摸一张牌",
            "mnry_mijiang":"觅江",
            "mnry_mijiang_info":"觉醒技，当你进入濒死状态时，你将体力值回复至２点，然后获得技能结姻和追忆，将多情改为非锁定技",
            "mnry_duoqing":"多情",
            "mnry_duoqing_info":"锁定技，结束阶段开始时，你失去１点体力，然后摸两张牌",
            "mnry_cunji":"存计",
            "mnry_cunji_info":"锁定技，若你体力不满，手牌上限+2。",
            "mnry_shicong":"侍从",
            "mnry_shicong_info":"回合结束阶段，你可选择一名其他角色，若如此做，直到你的下回合开始，所有角色对该角色使用的【杀】或【决斗】均视为对你使用",
            "mnry_xingpian":"行骗",
            "mnry_xingpian_info":"出牌阶段开始时，你可与一名其他角色拼点。若你赢，你使用的下一张基本牌或普通锦囊牌可以额外指定任意一名其他角色为目标或减少指定一个目标；若你没赢，你获得止息直到回合结束且对方摸两张牌。",
            "mnry_wangchuan":"忘川",
            "mnry_wangchuan_info":"一名角色每受到【杀】造成的一次伤害，你可以弃一张牌，并令其进行一次判定，判定结果为：♥该角色增加一点体力上限；♦︎该角色摸三张牌；♣伤害来源弃三张牌；♠伤害来源将其武将牌翻面",
            "mnry_dianshui":"点水",
            "mnry_dianshui_info":"你的回合外，每当你因使用、打出而失去一张黑色牌时，你可以摸一到两张牌[概率公示:一张牌60%，两张牌40%]。",
            "mnry_boxing":"薄幸",
            "mnry_boxing_info":"锁定技，你使用的红桃牌无法被其他角色的牌响应",
            "mnry_huose":"活色",
            "mnry_huose_info":"出牌阶段限一次，你可与一名角色拼点，若你赢对方翻至背面且摸两张牌。",
            "mnry_zoubi":"走笔",
            "mnry_zoubi_info":"拼点结束后，你可以摸一张牌",
            "mnry_yishu":"义书",
            "mnry_yishu_info":"每回合出牌阶段限一次，与一名角色拼点，若你赢，则摸两张牌，没赢，则对方回一滴血。",
            "mnry_shufen":"书愤",
            "mnry_shufen_info":"每当你受到一次伤害后，你可以亮出牌堆顶的三张牌。然后获得其中任意数量点数之和不大于16的牌",
            "mnry_guyan":"孤雁",
            "mnry_guyan_info":"结束阶段，若你体力为1，你可以回一滴血",
            "mnry_yingbian":"英变",
            "mnry_yingbian_info":"觉醒技，当你体力变化且你的体力小于等于1，回复一点体力并永久获得技能“贞烈”。",
            "mnry_miji":"秘笈",
            "mnry_miji_info":"回合结束阶段，若你体力不满，可以令至多x名角色各回复一点体力（x为你已损失体力值）",
            "mnry_xieshu":"械术",
            "mnry_xieshu_info":"<li>锁定技，你的进攻距离+1<li>锁定技，你的防御距离+1<li>锁定技，你的装备区里的牌不能被其他角色弃置。",
            "mnry_zhenxi":"阵习",
            "mnry_zhenxi_info":"当你没装备防具时，始终视为你装备着【八卦阵】。",
            "mnry_lianyin":"联姻",
            "mnry_lianyin_info":"出牌阶段，你可以弃置两张牌并选择1名已经受伤的女性角色，你与其各回复一点体力，每阶段限一次",
            "mnry_qingyi":"青衣",
            "mnry_qingyi_info":"出牌阶段开始和结束时，你可以摸一张牌",
            "mnry_zhenyan":"真言",
            "mnry_zhenyan_info":"出牌阶段限一次，你可以令一名角色摸一张牌并展示之，若为装备牌，其立即装备之并回复一点体力",
            "mnry_zhuanshi":"转势",
            "mnry_zhuanshi_info":"出牌阶段限四次，你可以将最后一张手牌当作【无中生有】使用",
            "mnry_zhisan":"纸伞",
            "mnry_zhisan_info":"锁定技，当你成为锦囊牌的目标时，若来源角色与你的距离大于3，则取消之",
            "mnry_yijia":"移驾",
            "mnry_yijia_info":"准备阶段，你可以弃置一张牌，然后弃置你判定区内一张同花色的牌",
            "mnry_qizhen":"戚政",
            "mnry_qizhen_info":"出牌阶段限三次，造成伤害后，你可以摸一张牌",
            "mnry_jianshi":"俭识",
            "mnry_jianshi_info":"锁定技，若你的体力为3或更少，你视为拥有技能“存计”若你的体力值为2或更少；你视为拥有技能“集智”；若你的体力值为1或更少，你视为拥有技能“竭缘”。",
            "mnry_chizhong":"持重",
            "mnry_chizhong_info":"每当你体力值发生变化时，你可以摸一张牌",
            "mnry_qinguo":"倾国",
            "mnry_qinguo_info":"你可以将一张黑色手牌当做【闪】使用或打出",
            "mnry_hongyan":"红颜",
            "mnry_hongyan_info":"锁定技，你区域内的黑桃牌和黑桃判定牌均视为红桃。",
            "mnry_liuli":"流离",
            "mnry_liuli_info":"当你成为【杀】的目标时，你可以弃置一张牌并将此【杀】转移给攻击范围内的一名其他角色（不能是[杀]的使用者）。",
            "<li>chenqing":"陈情",
            "<li>chenqing_info":"每轮限一次，当一名角色处于濒死状态时，你可以令另一名其他角色摸四张牌，然后弃置四张牌。若其以此法弃置的四张牌花色各不相同，则视为该角色对濒死的角色使用一张【桃】",
            "mnry_jizhi":"集智",
            "mnry_jizhi_info":"当你使用一张非转化的普通锦囊牌时，你可以摸一张牌。",
            "mnry_xiefang":"撷芳",
            "mnry_xiefang_info":"锁定技，你的进攻距离+X（X为女性角色数）",
            "mnry_zhongjian":"忠鉴",
            "mnry_zhongjian_info":"出牌阶段限一次，你可以展示一张手牌，然后展示手牌数大于体力值的一名其他角色X张手牌（X为其手牌数和体力值之差）。若以此法展示的牌与你展示的牌：有颜色相同的，你摸一张牌或弃置其一张牌；有点数相同的，本回合此技能改为“出牌阶段限两次”；均不同，你的手牌上限-1",
            "mnry_roulin":"肉林",
            "mnry_roulin_info":"锁定技。你对女性角色、女性角色对你使用【杀】时，都需连续使用两张【闪】才能抵消。",
            "mnry_jijiu":"急救",
            "mnry_jijiu_info":"你的回合外，你可以将一张红色牌当做【桃】使用。",
            "mnry_lihun":"离魂",
            "mnry_lihun_info":"出牌阶段，你可以弃置一张牌并将你的武将牌翻面，若如此做，你指定一名男性角色，获得其所有手牌。出牌阶段结束时，你需为该角色每一点体力分配给其一张牌。每回合限一次。",
            "mnry_shouhu":"守护",
            "mnry_shouhu_info":"你不能使用杀；出牌阶段，你可以弃置一张杀令一名其他角色回复一点体力",
            "mnry_wenji":"问计",
            "mnry_wenji_info":"出牌阶段开始时，你可以令一名其他角色交给你一张手牌。",
            "mnry_zhensha":"鸩杀",
            "mnry_zhensha_info":"结束阶段，对体力大于你的一名其他角色造成1点伤害",
            "mnry_kuiping":"窥屏",
            "mnry_kuiping_info":"若你于出牌阶段未造成伤害，你可在弃牌阶段开始时你获得牌堆顶一张锦囊牌然后摸一张牌。",
            "mnry_wuxiu":"舞袖",
            "mnry_wuxiu_info":"转换技，锁定技，回合开始你获得①迷情②离婚",
            "mnry_wangshuo":"往朔",
            "mnry_wangshuo_info":"锁定技，当你处于濒死状态时，你将武将牌换为\"朔月姬小乔\"然后摸两张牌并回复所有体力。",
            "mnry_wanyi":"婉仪",
            "mnry_wanyi_info":"出牌阶段限一次，你可以弃置一张手牌并令一名角色翻面。",
            "mnry_diefeng":"蝶风",
            "mnry_diefeng_info":"当你于出牌阶段内使用与此阶段你使用的上一张牌颜色相同的牌时，你可以摸一张牌",
            "mnry_ranshsng":"燃殇",
            "mnry_ranshsng_info":"锁定技，造成伤害后，若对方背面朝上，伤害+1。",
            "mnry_yixiao":"贻笑",
            "mnry_yixiao_info":"锁定技，你区域内及判定的黑桃牌均视为红桃牌；每当你使用打出或弃置红桃或黑桃牌时，摸一张牌。",
            "mnry_jinjiao":"矜娇",
            "mnry_jinjiao_info":"当你即将受到伤害时，你可以弃置一张♥手牌，取消之。",
            "mnry_wanghui":"望辉",
            "mnry_wanghui_info":"锁定技，出牌阶段开始和结束时，若你体力小于4，将武将换为\"望月姬大乔\"然后摸两张牌",
            "朔望":"朔望",
            "朔望_info":"前往选项→武将查看二美的技能",
        },
    },
    intro:"",
    author:"染柒",
    diskURL:"",
    forumURL:"",
    version:"1.12.6",
},files:{"character":["mnry_shuowangermei.jpg"],"card":[],"skill":[]}}};