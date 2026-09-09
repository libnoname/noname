import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"玉言·离光",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            yuyanliguangzhuyuan:["female","shen",4,["yuyanliguangtingtian","yuyanliguangweiyan","yuyanliguangzhuyuanxinwu"],[]],
            yuyanliguanglinlang:["female","shen",4,["yuyanliguanglingdong","yuyanliguangjimin","yuyanliguanglinlangxinwu"],["des:天真烂漫，有亿点点毒舌，爱跟熟悉的人拌嘴。遇到觉得不合理的事情时会挺身而出。"]],
            yuyanliguangwuxia:["female","shen",4,["yuyanliguangxiujing","yuyanliguangqingning","yuyanliguangwuxiaxinwu"],["des:沉默寡言，细心谨慎。但有时说话也会不留情面。面对大是大非时，会异常坚决。"]],
            yuyanliguangyuehua:["female","shen",4,["yuyanliguangdongnu","yuyanliguanglangzhi","yuyanliguangyuehuaxinwu"],["des:温柔的大姐姐，爱跟熟悉的人开玩笑。平日慵懒随和，但路见不平时绝不袖手旁观。"]],
        },
        translate:{
            yuyanliguangzhuyuan:"珠圆",
            yuyanliguanglinlang:"琳琅",
            yuyanliguangwuxia:"无瑕",
            yuyanliguangyuehua:"玥华",
        },
    },
    card:{
        card:{
            yuyanliguangzhuyuanxinwuzb:{
                fullskin:true,
                type:"equip",
                subtype:"equip5",
                skills:["yuyanliguangzhuyuanxinwuzb1"],
                toself:true,
            },
            yuyanliguanglinlangxinwuzb:{
                fullskin:true,
                type:"equip",
                subtype:"equip5",
                skills:["yuyanliguanglinlangxinwuzb1"],
                toself:true,
            },
            yuyanliguangwuxiaxinwuzb:{
                fullskin:true,
                type:"equip",
                subtype:"equip5",
                skills:["yuyanliguangwuxiaxinwuzb1"],
                toself:true,
            },
            yuyanliguangyuehuaxinwuzb:{
                fullskin:true,
                type:"equip",
                subtype:"equip5",
                skills:["yuyanliguangyuehuaxinwuzb1"],
                ai:{
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
        },
        translate:{
            yuyanliguangzhuyuanxinwuzb:"珠圆信物",
            "yuyanliguangzhuyuanxinwuzb_info":"锁定技，你的手牌上限+1。",
            yuyanliguanglinlangxinwuzb:"琳琅信物",
            "yuyanliguanglinlangxinwuzb_info":"锁定技，摸牌阶段，你的摸牌数+1。",
            yuyanliguangwuxiaxinwuzb:"无瑕信物",
            "yuyanliguangwuxiaxinwuzb_info":"锁定技，你获得你的判定牌。",
            yuyanliguangyuehuaxinwuzb:"玥华信物",
            "yuyanliguangyuehuaxinwuzb_info":"锁定技，回合开始阶段，你回复一点体力。",
        },
        list:[["diamond","13","yuyanliguangzhuyuanxinwuzb"],["club","13","yuyanliguanglinlangxinwuzb"],["spade","13","yuyanliguangwuxiaxinwuzb"],["heart","13","yuyanliguangyuehuaxinwuzb"]],
    },
    skill:{
        skill:{
            yuyanliguangtingtian:{
                enable:"phaseUse",
                round:3,
                content:function(){
        player.changeHujia(player.countCards('h'));
        player.discard(player.getCards('h'));
        player.draw(player.countCards('h'));
    },
                group:["yuyanliguangtingtian_roundcount"],
            },
            yuyanliguangweiyan:{
                trigger:{
                    global:"phaseEnd",
                },
                forced:true,
                content:function (){
        player.changeHujia();
        var card=get.cardPile(function(card){
                return get.name(card)=='shan';
            });
            if(card){
                player.gain(card,'draw');
            }
            event.basiccard=card;
    },
            },
            yuyanliguangzhuyuanxinwu:{
                mod:{
                    maxHandcard:function(player,num){
            return num+Infinity;
        },
                },
                group:["yuyanliguangzhuyuanxinwu1"],
            },
            yuyanliguanglingdong:{
                enable:"phaseUse",
                round:3,
                content:function (){
        if(!player.storage.yuyanliguang_lingdong_mark){
            player.storage.yuyanliguang_lingdong_mark=0;
        }                 
        player.storage.yuyanliguang_lingdong_mark+=1;
        player.syncStorage('yuyanliguang_lingdong_mark');
        player.markSkill('yuyanliguang_lingdong_mark');
    },
                group:["yuyanliguanglingdong1","yuyanliguanglingdong_roundcount"],
            },
            yuyanliguangjimin:{
                trigger:{
                    global:"phaseJieshuBegin",
                },
                forced:true,
                content:function(){
        player.draw();
    },
            },
            yuyanliguanglinlangxinwu:{
                trigger:{
                    player:"useCard",
                },
                forced:true,
                filter:function(event,player){
        return _status.currentPhase=player;
    },
                content:function(){
        if(player.hasSkill('yuyanliguanglinlangxinwuzb1')){
            player.draw();
        }
        else{
            if(Math.random()<0.2){
               player.draw();
            }
        }
    },
            },
            yuyanliguangxiujing:{
                enable:"phaseUse",
                round:3,
                content:function (){
        'step 0'
        var list=get.gainableSkills();
        list.remove(player.getSkills());
        list=list.randomGets(5);
        event.skillai=function(){
            return get.max(list,get.skillRank,'item');
        };
        if(event.isMine()){
            var dialog=ui.create.dialog('forcebutton');
            dialog.add('选择获得一项技能');
            var clickItem=function(){
                _status.event._result=this.link;
                dialog.close();
                game.resume();
            };
            for(var i=0;i<list.length;i++){
                if(lib.translate[list[i]+'_info']){
                    var translation=get.translation(list[i]);
                    if(translation[0]=='新'&&translation.length==3){
                        translation=translation.slice(1,3);
                    }
                    else{
                        translation=translation.slice(0,2);
                    }
                    var item=dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【'+
                    translation+'】</div><div>'+lib.translate[list[i]+'_info']+'</div></div>');
                    item.firstChild.addEventListener('click',clickItem);
                    item.firstChild.link=list[i];
                }
            }
            dialog.add(ui.create.div('.placeholder'));
            event.switchToAuto=function(){
                event._result=event.skillai();
                dialog.close();
                game.resume();
            };
            _status.imchoosing=true;
            game.pause();
        }
        else{
            event._result=event.skillai();
        }
        'step 1'
        _status.imchoosing=false;
        var link=result;
        player.addSkill(link,true);
        player.popup(link);
        game.log(player,'获得了技能','【'+get.translation(link)+'】');
        game.delay();
    },
                group:["yuyanliguangxiujing_roundcount"],
            },
            yuyanliguangqingning:{
                trigger:{
                    player:"phaseEnd",
                },
                forced:true,
                content:function(){
        'step 0'
            var card=get.cardPile(function(card){
                return get.type(card)=='basic';
            });
            if(card){
                player.gain(card,'draw');
            }
            event.basiccard=card;
        'step 1'
        if(event.basiccard){
            if(player.hasUseTarget(event.basiccard)){
                var next=player.chooseToUse();
                next.filterCard=function(card){
                    return card==event.basiccard;
                };
                next.prompt='是否使用'+get.translation(event.basiccard)+'？';
            }
        }
        'step 2'
            var card=get.cardPile(function(card){
                return get.type(card)=='trick'||get.type(card)=='delay';
            });
            if(card){
                player.gain(card,'draw');
            }
            event.trickcard=card;
        'step 3'
        if(event.trickcard){
            if(player.hasUseTarget(event.trickcard)){
                var next=player.chooseToUse();
                next.filterCard=function(card){
                    return card==event.trickcard;
                };
                next.prompt='是否使用'+get.translation(event.trickcard)+'？';
            }
        }
        'step 4'
            var card=get.cardPile(function(card){
                return get.type(card)=='equip';
            });
            if(card){
                player.gain(card,'draw');
            }
            event.equipcard=card;
        'step 5'
        if(event.equipcard){
            if(player.hasUseTarget(event.equipcard)){
                var next=player.chooseToUse();
                next.filterCard=function(card){
                    return card==event.equipcard;
                };
                next.prompt='是否使用'+get.translation(event.equipcard)+'？';
            }
        }
    },
                ai:{
                    threaten:1.7,
                },
            },
            yuyanliguangwuxiaxinwu:{
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                content:function(){
        player.judge(function(card){
            if(get.color(card)=='red') player.recover();
            if(get.color(card)=='black') player.changeHujia();
        });
        if(player.hasSkill('yuyanliguangwuxiaxinwuzb1')){
            player.judge(function(card){
            if(get.color(card)=='red') player.recover();
            if(get.color(card)=='black') player.changeHujia();
            });
            player.judge(function(card){
            if(get.color(card)=='red') player.recover();
            if(get.color(card)=='black') player.changeHujia();
            });
            }
    },
            },
            yuyanliguangdongnu:{
                enable:"phaseUse",
                round:3,
                filterTarget:function(card,player,target){
        return player!=target;
    },
                content:function(){
        player.loseHp();
        target.damage();
        target.storage.yuyanliguang_dongnu_mark=3;
        target.addSkill('yuyanliguangdongnu1');
    },
                group:["yuyanliguangdongnu_roundcount"],
                "audioname2":{
                    "key_shiki":"shiki_omusubi",
                },
            },
            yuyanliguanglangzhi:{
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                content:function(){
        player.recover();
        player.draw(2);
    },
                "audioname2":{
                    "key_shiki":"shiki_omusubi",
                },
            },
            yuyanliguangyuehuaxinwu:{
                trigger:{
                    player:"loseAfter",
                    global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter"],
                },
                forced:true,
                filter:function (event, player) {
        if (player.countCards('h')) return false;
        var evt = event.getl(player);
        return evt && evt.hs && evt.hs.length;
      },
                content:function () {
        if(player.hasSkill('yuyanliguangyuehuaxinwuzb1')){
            player.recover(player.maxHp-player.hp);
            player.drawTo(player.maxHp);
            }
        else{
            player.recover();
        }
      },
            },
            "yuyanliguanglingdong1":{
                trigger:{
                    player:"drawBegin",
                },
                forced:true,
                filter:function (event,player){
        return player.storage.yuyanliguang_lingdong_mark>0;
    },
                content:function (){
        trigger.num+=player.storage.yuyanliguang_lingdong_mark;
    },
            },
            "yuyanliguangdongnu1":{
                trigger:{
                    player:"recoverBefore",
                },
                forced:true,
                content:function(){
        trigger.cancel();
    },
                group:["yuyanliguanglingdong2"],
            },
            "yuyanliguang_dongnu2":{
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                mark:true,
                temp:true,
                intro:{
                    content:"无法回复体力",
                },
                nopop:true,
                content:function(){
        player.storage.yuyanliguang_dongnu_mark--;
        if(player.storage.yuyanliguang_dongnu_mark<=0){
            player.removeSkill('yuyanliguang_dongnu1');
            player.removeSkill('yuyanliguang_dongnu2');
            delete player.storage.yuyanliguang_dongnu_mark;
        }
        else{
            player.updateMarks();
        }
    },
            },
            "yuyanliguangzhuyuanxinwuzb1":{
                mod:{
                    maxHandcard:function(player,num){
            return num+1;
        },
                },
            },
            "yuyanliguangzhuyuanxinwu1":{
                trigger:{
                    player:"changeHujiaEnd",
                },
                forced:true,
                filter:function (event,player){
        return player.hasSkill('yuyanliguangzhuyuanxinwuzb1');
    },
                content:function(){
        player.draw(trigger.num);
            
    },
            },
            "yuyanliguanglinlangxinwuzb1":{
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function(){
        trigger.num++;
    },
            },
            "yuyanliguangwuxiaxinwuzb1":{
                trigger:{
                    player:"judgeEnd",
                },
                forced:true,
                content:function(){
        player.gain(trigger.result.card,'gain2');
    },
            },
            "yuyanliguangyuehuaxinwuzb1":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                content:function(){
        player.recover();
    },
            },
        },
        translate:{
            yuyanliguangtingtian:"听天",
            "yuyanliguangtingtian_info":"每三轮限一次，获得当前手牌数的护甲，弃置所有手牌并抽等量卡牌。",
            yuyanliguangweiyan:"威严",
            "yuyanliguangweiyan_info":"锁定技，每个回合结束阶段，你获得一点护甲并抽一张闪。",
            yuyanliguangzhuyuanxinwu:"珠圆信物",
            "yuyanliguangzhuyuanxinwu_info":"锁定技，你的手牌无上限。当你装备珠圆信物时，你获得护甲时摸等量的牌。",
            yuyanliguanglingdong:"灵动",
            "yuyanliguanglingdong_info":"每三轮限一次，你的抽牌数+1。",
            yuyanliguangjimin:"机敏",
            "yuyanliguangjimin_info":"锁定技，每个回合结束阶段，你摸一张牌。",
            yuyanliguanglinlangxinwu:"琳琅信物",
            "yuyanliguanglinlangxinwu_info":"锁定技，你于回合内每使用一张牌便低概率摸一张牌。当你装备琳琅信物时，你于回合内每使用一张牌便摸一张牌。",
            yuyanliguangxiujing:"修静",
            "yuyanliguangxiujing_info":"每三轮限一次，你从五个随机列出的技能中选择一个并获得之。",
            yuyanliguangqingning:"清宁",
            "yuyanliguangqingning_info":"锁定技，回合结束阶段，你从牌堆获得一张基本牌、锦囊牌和装备牌并可立即使用之。",
            yuyanliguangwuxiaxinwu:"无瑕信物",
            "yuyanliguangwuxiaxinwu_info":"锁定技，回合开始阶段，你进行一次判定，每有一张黑色牌获得一点护甲，每有一张红色牌回复一点体力。当你装备无瑕信物时，回合开始阶段，你进行三次判定。",
            yuyanliguangdongnu:"动怒",
            "yuyanliguangdongnu_info":"出牌阶段限一次，失去一点体力对一名角色造成一点伤害，并令其三回合内无法回复体力。",
            yuyanliguanglangzhi:"兰质",
            "yuyanliguanglangzhi_info":"锁定技，回合结束阶段，你回复一点体力并摸两张牌。",
            yuyanliguangyuehuaxinwu:"玥华信物",
            "yuyanliguangyuehuaxinwu_info":"锁定技，当你失去最后的手牌时，你回复一点体力，当你装备玥华信物时，你将体力与手牌补至体力上限。",
            "yuyanliguanglingdong1":"灵动",
            "yuyanliguanglingdong1_info":"",
            "yuyanliguangdongnu1":"动怒",
            "yuyanliguangdongnu1_info":"",
            "yuyanliguang_dongnu2":"动怒",
            "yuyanliguang_dongnu2_info":"",
            "yuyanliguangzhuyuanxinwuzb1":"珠圆信物",
            "yuyanliguangzhuyuanxinwuzb1_info":"",
            "yuyanliguangzhuyuanxinwu1":"珠圆信物",
            "yuyanliguangzhuyuanxinwu1_info":"",
            "yuyanliguanglinlangxinwuzb1":"琳琅信物",
            "yuyanliguanglinlangxinwuzb1_info":"",
            "yuyanliguangwuxiaxinwuzb1":"无瑕信物",
            "yuyanliguangwuxiaxinwuzb1_info":"",
            "yuyanliguangyuehuaxinwuzb1":"玥华信物",
            "yuyanliguangyuehuaxinwuzb1_info":"",
        },
    },
    intro:"",
    author:"轮回战君",
    diskURL:"",
    forumURL:"",
    version:"",
},files:{"character":["yuyanliguangzhuyuan.jpg","yuyanliguanglinlang.jpg","yuyanliguangwuxia.jpg","yuyanliguangyuehua.jpg"],"card":["yuyanliguanglinlangxinwuzb.png","yuyanliguangzhuyuanxinwuzb.png","yuyanliguangwuxiaxinwuzb.png","yuyanliguangyuehuaxinwuzb.png"],"skill":[]}}};