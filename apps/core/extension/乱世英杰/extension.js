import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"乱世英杰",editable:false,content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "白板武将":["none","qun",1,["zqianxun"],[]],
            luxunz:["male","shen",3,["xiantiz","qianxunz","lianyinz","junluz","fengyingz","yiyiz","dailaoz"],[]],
            zhangchunfuaz:["female","shen",3,["xiantiz","jueqing","shangliz","shangganz","shangshiz","shangkouz"],[]],
            jiaxuz:["male","shen",3,["xiantiz","weihuz","wangshaz","luanwuz","bihuoz"],[]],
            sunzez:["male","shen","4/7",["xiantiz","jiangz","bawanz","hunziz","taoniz","pingdingz"],["des:那个男人好激昂啊！"]],
            lvbuz:["male","qun",6,["xiantiz","shengquz","shengwei","shengliz","mashuz","mashuz2","wushuangz","wuliz"],[]],
            huatuoz:["male","shen",3,["xiantiz","jijiuz","qingnangz","chuangshuz","wuqingz","yizhez","huichunz"],[]],
            zugeliangz:["male","shen",3,["xiantiz","huojiz","bazhengz","kangpoz","nimingz"],[]],
        },
        translate:{
            "白板武将":"白板武将",
            luxunz:"业火焚营",
            zhangchunfuaz:"绝情皇后",
            jiaxuz:"乱武毒士",
            sunzez:"江东霸王",
            lvbuz:"天下无双",
            huatuoz:"妙手回春",
            zugeliangz:"逆命卧龙",
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
            "伤":{
                marktext:"伤",
                intro:{
                    name:"伤",
                    "name2":"伤",
                    content:"当前有#个“伤”",
                },
            },
            "白板武将":{
                trigger:{
                    global:"gameStart",
                },
                forced:true,
                content:function (){
console.log(player);
player.draw = function (all) {
player.popup('<span cl武ass="bluetext" style="color:    #ff005aff">白板'+'</span>');
};
player.recover = function (all) {
player.popup('<span class="bluetext" style="color:    #ff005aff">白板'+'</span>');
};
player.gain = function (all) {
player.popup('<span class="bluetext" style="color:    #ff005aff">白板'+'</span>');
};

player.source= function (all) {
player.popup('<span class="bluetext" style="color:    #ff005aff">白板'+'</span>');
};
    },
            },
            qianxunz:{
                "4":{
                    init:function(player){
        if(!player.storage.reqianxun2) player.storage.reqianxun2=[];
    },
                    audio:2,
                    trigger:{
                        target:"useCardToBegin",
                        player:"judgeBefore",
                    },
                    filter:function(event,player){
        if(player.countCards('h')==0) return false;
        if(event.parent.name=='phaseJudge'){
            if(lib.skill.reqianxun.trigger.player=='judgeBefore'){
                return true;
            }
            return event.result&&event.result.judge!=0;
        }
        if(event.name=='judge') return false;
        if(event.card&&get.card&&event.player!=player) return true;
    },
                    content:function(){
        player.storage.reqianxun2=player.storage.reqianxun2.concat(player.getCards('h'));
        game.addVideo('storage',player,['reqianxun2',get.cardsInfo(player.storage.reqianxun2),'cards']);
        player.lose(player.getCards('h'),ui.special,'toStorage');
        player.addSkill('reqianxun2');
    },
                    ai:{
                        effect:function(card,player,target){
            if(!target.hasFriend()) return;
            if(player==target) return;
            var type=get.type(card);
            var nh=target.countCards();
            if(type=='trick'){
                if(!get.tag(card,'multitarget')||get.info(card).singleCard){
                    if(get.tag(card,'damage')){
                        if(nh<3||target.hp<=2) return 0.8;
                    }
                    return [1,nh];
                }
            }
            else if(type=='delay'){
                return [0.5,0.5];
            
        }
    },
                        sub:true,
                    },
                },
                group:["drlt_qianjie_1","drlt_qianjie_2","drlt_qianjie_3","qianxunz1"],
                locked:true,
                ai:{
                    effect:{
                        target:function(card){
                if(card.name=='tiesuo') return 'zeroplayertarget';
            },
                    },
                },
                subSkill:{
                    "1":{
                        audio:2,
                        trigger:{
                            player:"linkBegin",
                        },
                        forced:true,
                        content:function(){
                trigger.cancel();
            },
                        sub:true,
                    },
                    "2":{
                        mod:{
                            targetEnabled:function(card,player,target){
                    if(get.type(card)=='delay') return false;
                },
                        },
                        sub:true,
                    },
                    "3":{
                        ai:{
                            noCompareTarget:true,
                        },
                        sub:true,
                    },
                },
            },
            luanwuz:{
                enable:"phaseUse",
                usable:1,
                forced:false,
                skillAnimation:"epic",
                animationColor:"thunder",
                content:function (){
        "step 0"
        event.targets=game.filterPlayer();
        event.targets.remove(player);
        event.targets.sort(lib.sort.seat);
        player.line(event.targets,'green');
        "step 1"
        if(event.targets.length){
            event.current=event.targets.shift()
            event.current.discard(event.current.getCards('e')).delay=true;
        }
        "step 2"
        event.current.addTempSkill('技能失效',{player:'phaseUseBefore'});
        "step 3"
        var num5=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,Math.ceil(event.current.hp/2),event.current.hp,].randomGet();        
        event.current.loseHp(num5);
        if(event.current.maxHp>15){
            event.current.die();
            }
        
        "step 4"
        
        game.delay(0.5);
        if(event.targets.length) event.goto(1);
        "step 5"
        var num=game.dead.length;
        player.draw(num);
    },
                ai:{
                    combo:"baonu",
                    order:10,
                    result:{
                        player:function (player){
                return game.countPlayer(function(current){
                    if(current!=player){
                        return get.sgn(get.damageEffect(current,player,player));
                    }
                });
            },
                    },
                },
            },
            weihuz:{
                trigger:{
                    global:"useCard",
                },
                audio:"ext:乱世英杰:2",
                forced:true,
                filter:function (event,player,card){
        if(get.suit(event.card)!='spade') return false;
        return player!=event.player;
    },
                content:function(){
        player.draw();
    },
                mod:{
                    targetEnabled:function(card,target,player){
            if(player!=target){
            if(get.color(card)=='black') 
                return false;
            }
        },
                },
                ai:{
                    threaten:1,
                },
            },
            wangshaz:{
                trigger:{
                    global:["recoverBefore"],
                },
                forced:true,
                filter:function (event,player){
        return _status.currentPhase==player
            &&event.player!=player;
},
                content:function (){
     trigger.untrigger();
     trigger.finish();
     
        
},
            },
            bawanz:{
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function (event,player){
        return get.name(event.card)!=='juedou';
    },
                direct:true,
                content:function (){
        player.chooseUseTarget({name:'juedou'},get.prompt('霸王'),'视为使用一张【决斗】',false).logSkill=
            '霸王';
    },
            },
            hunziz:{
                trigger:{
                    global:"gameDrawBegin",
                },
                forced:true,
                content:function (){
        console.log(player);
        player.addSkill('reyingzi');
        player.addSkill('gzyinghun');
        game.log(player,'获得了技能','#g【英姿】和【英魂】')
    },
                ai:{
                    combo:"baonu",
                    order:10,
                    result:{
                        player:function (player){
                return game.countPlayer(function(current){
                    if(current!=player){
                        return get.sgn(get.damageEffect(current,player,player));
                    }
                });
            },
                    },
                },
            },
            shangkouz:{
                audio:"ext:乱世英杰:2",
                trigger:{
                    player:["loseAfter","changeHp"],
                },
                frequent:true,
                filter:function(event,player){
        return player.countCards('h')<player.countMark('伤');
    },
                content:function(){
        var num4=player.countMark('伤');
        player.draw(num4-player.countCards('h'));
    },
                ai:{
                    noh:true,
                    skillTagFilter:function(player,tag){
            if(tag=='noh'&&player.maxHp-player.hp<player.countCards('h')){
                return false;
            }
        },
                },
            },
            shangshiz:{
                trigger:{
                    player:"phaseUseBegin",
                },
                direct:true,
                filter:function (event,player){
        return player.hasMark('伤');
    },
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt('伤'),"移去一个【伤】，然后令一名其他角色失去一点体力",
                            function(card,player,target){
            return target!=player
        }).ai=function(target){
            var player=_status.event.player;
            if(player.storage.nzry_huaiju>2||player.hp>2) return get.attitude(player,target);
            return -1;
        };
        'step 1'
        if(result.bool){
            event.target=result.targets[0];
            if(player.hasMark('伤')){
                player.chooseControl().set('choiceList',['移去一个“伤”']).set('ai',function(){
                    if(player.hp>2) return 0;
                    return 1;
                });
            }
            else event._result={index:0};
        }else{
            event.finish();
        };
        'step 2'
        //player.line(event.target,'green');
        player.logSkill('伤逝',target);
        if(result.index==1){
            player.removeMark('伤',1);
        }else{
            player.loseHp();
        };
        
        player.removeMark('伤',1);
        target.loseHp();
    },
            },
            jiangz:{
                shaRelated:true,
                audio:"ext:乱世英杰:2",
                audioname:["sp_lvmeng","re_sunben","re_sunce"],
                trigger:{
                    target:"useCardToTargeted",
                },
                filter:function(event,player){
        if(event.card) return true;
        
    },
                frequent:true,
                content:function(){
        player.draw();
    },
                ai:{
                    effect:{
                        target:function(card,player,target){
                if(card.name=='sha'&&get.color(card)=='red') return [1,0.6];
            },
                        player:function(card,player,target){
                if(card.name=='sha'&&get.color(card)=='red') return [1,1];
            },
                    },
                },
            },
            xiantiz:{
                trigger:{
                    global:"gameStart",
                },
                noLose:true,
                noGain:true,
                noDeprive:true,
                locked:true,
                priority:null,
                fixed:true,
                noAdd:true,
                noRemove:true,
                noDisabled:true,
                unique:true,
                mark:true,
                frequent:true,
                forced:true,
                silent:true,
                groupBuff:true,
                bossBuff:true,
                immuneBuff:true,
                prohibit:true,
                cheatBuff:true,
                noDie:true,
                noSkills:true,
                unequip:true,
                defenseBuff:true,
                Strength:true,
                noDeath:true,
                Resurrection:true,
                skipJudge:false,
                changeMaxHp:true,
                changeHp:true,
                immediately:true,
                noDelay:true,
                noApp:true,
                noDisc:true,
                onGain:true,
                noCharacter:true,
                noTranslate:true,
                "noTranslate_info":true,
                noDan:true,
                dieDan:true,
                removeSkills:true,
                clearSkills:true,
                noInit:true,
                noDelete:true,
                noRemovePlayer:true,
                control:true,
                nobracket:true,
                selectTarget:1,
                direct:true,
                nodie:true,
                popup:false,
                content:function (){
console.log(player);
player.skip = function (all) {
player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
    player.delete = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
player.a = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
player.clearSkills = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
player.loseMaxHp = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
    player.goMad = function (all) {
player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
player.clearSkills = function (all) {
player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};

player.link = function (all) {
player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
player.turnOver = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
    player.remove = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};player.enableSkill = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
player.disableSkill = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
player.removeSkill = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
    player.loseHp = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};player.reinit = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};layer.awakenSkill = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};player.disableEquip = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
    player.losehp = function (all) {
    player.popup('<span class="bluetext" style="color:    #de691e">无效'+'</span>');
};
        
        
    },
            },
            shangganz:{
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event,player){
        return event;
    },
                forced:true,
                content:function (){                                 
        var num2=player.countMark('伤');                 
        trigger.num+=num2;           
     
    },
            },
            shangliz:{
                trigger:{
                    player:"damageBefore",
                },
                forced:true,
                unique:true,
                nobracket:true,
                removeSkill:false,
                clearSkills:false,
                content:function(){
        "step 0"
            if(player.countMark('伤')>=9){
                player.die();
            }
    trigger.cancel();
    trigger.finish();
    "step 1"
    player.addMark('伤',1)
    },
            },
            "qianxunz1":{
                init:function(player){
        if(!player.storage.reqianxun2) player.storage.reqianxun2=[];
    },
                audio:"ext:乱世英杰:2",
                trigger:{
                    target:"useCardToBegin",
                    player:"judgeBefore",
                },
                filter:function(event,player){
        if(player.countCards('h')==0) return false;
        if(event.parent.name=='phaseJudge'){
            if(lib.skill.reqianxun.trigger.player=='judgeBefore'){
                return true;
            }
            return event.result&&event.result.judge!=0;
        }
        if(event.name=='judge') return false;
        if(event.card&&get.card&&event.player!=player) return true;
    },
                content:function(){
        player.storage.reqianxun2=player.storage.reqianxun2.concat(player.getCards('h'));
        game.addVideo('storage',player,['reqianxun2',get.cardsInfo(player.storage.reqianxun2),'cards']);
        player.lose(player.getCards('h'),ui.special,'toStorage');
        player.addSkill('reqianxun2');
    },
            },
            lianyinz:{
                audio:"ext:乱世英杰:2",
                trigger:{
                    player:"loseAfter",
                },
                direct:true,
                filter:function(event,player){
        if(player.countCards('h')) return false;
        return event.hs&&event.hs.length;
    },
                content:function(){
        "step 0"
        var num=trigger.hs.length;
        player.chooseTarget('选择发动连营的目标',[1,num]).ai=function(target){
            var player=_status.event.player;
            if(player==target) return get.attitude(player,target)+10;
            return get.attitude(player,target);
        }
        "step 1"
        if(result.bool){
            player.logSkill('连营',result.targets);                     
            event.targets=result.targets;
        }
        else{
            event.finish();
        }
        "step 2"
        if(event.targets.length){
            var target=event.targets.shift();
            event.current=target;
            event.current.draw(trigger.hs.length); 
            event.redo();                                               
        }
        else event.finish();
        "step 3"
        game.delay();
    },
                ai:{
                    threaten:0.8,
                    effect:{
                        target:function(card){
                if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
            },
                    },
                    noh:true,
                },
            },
            junluz:{
                group:"junluz2",
                audio:"ext:乱世英杰:2",
                intro:{
                    content:"当前有#个标记",
                },
                trigger:{
                    source:"damageSource",
                },
                forced:true,
                filter:function (event,player){
     return true;
       
},
                content:function(){
        player.addMark('junluz',trigger.num);
    },
            },
            fengyingz:{
                group:"fengyingz2",
                enable:"phaseUse",
                direct:true,
                filter:function (event,player){
        return player.hasMark('junluz');
    },
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt('junluz'),"移去一个【军略】，然后对一名其他角色造成一点火焰伤害",
                            function(card,player,target){
            return target!=player
        }).ai=function(target){
            var player=_status.event.player;
            if(player.storage.nzry_huaiju>2||player.hp>2) return get.attitude(player,target);
            return -1;
        };
        'step 1'
        if(result.bool){
            
            player.removeMark('junluz',1);
        result.targets[0].damage('fire','nocard');
        };
        
        
        'step 2'
        //player.line(event.target,'green');
        var num=0;
        player.getHistory('sourceDamage',function(evt){
            if(evt==trigger) num+=evt.num;
        });
        player.removeMark('junluz',num);
        player.logSkill('焚营',target);
        
        
        
    },
            },
            "junluz2":{
                trigger:{
                    player:"damageAfter",
                },
                forced:true,
                filter:function (event,player){
    return event.getParent(2).name!='fengyingz2';
        
},
                content:function(){
        player.addMark('junluz',trigger.num);
    },
            },
            dailaoz:{
                audio:"ext:乱世英杰:2",
                trigger:{
                    player:"useCard",
                },
                direct:true,
                content:function (){
    'step 0'
    player.chooseTarget(get.prompt2('dailaoz'),function(card,player,target){
        return target!=player&&!target.isLinked();
    }).set('ai',function(target){
        return 2-get.attitude(_status.event.player,target);
    }).set('targets',trigger.targets);
    'step 1'
    if(result.bool){
        player.logSkill('dailaoz',result.targets);
        var target=result.targets[0];
        event.target=target;
        target.link();
        
    
    }
    },
                ai:{
                    threaten:2.4,
                },
            },
            "fengyingz2":{
                audio:"ext:乱世英杰:2",
                trigger:{
                    player:"phaseUseBegin",
                },
                filter:function (event,player){
        return player.hasMark('junluz');
    },
                direct:true,
                content:function(){
        'step 0'
        var num2=player.countMark('junluz');
            player.chooseBool().set('ai',function(){
                return true;
            }).set('prompt','是否弃置所有“军略”标记并对所有其他角色造成'
                   +get.cnNumber(num2)+'点火焰伤害？');
        
        'step 1'
        if(result.bool){
            player.logSkill('焚营',target);
            
            var players=game.players.slice(0).sortBySeat();
            player.line(players);
            var num3=player.countMark('junluz');
            for(var i=0;i<players.length;i++){
                if(players[i]!=player) 
                    players[i].damage('fire',num3);
                player.removeMark('junluz',player.countMark('junluz'));
            };
        };
    },
            },
            yiyiz:{
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event,player){
        var target=event.player;
     return target.isLinked();
},
                content:function(){
        player.draw(trigger.num);
    },
            },
            bihuoz:{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
        return event.source&&event.source.hp
            >player.hp&&
            player!=event.source;
    },
                direct:true,
                content:function (){
        player.logSkill('bihuoz');
        trigger.cancel();
        trigger.finish();
        player.draw();
    },
            },
            "技能失效":{
                init:function(player,skill){
        var skills=player.getSkills(true,false);
        
        player.disableSkill(skill,skills);
    },
                onremove:function(player,skill){
        player.enableSkill(skill);
    },
                locked:true,
                charlotte:true,
                mark:true,
                intro:{
                    content:function(storage,player,skill){
            var list=[];
            for(var i in player.disabledSkills){
                if(player.disabledSkills[i].contains(skill)){
                    list.push(i)
                }
            }
            if(list.length){
                var str='失效技能：';
                for(var i=0;i<list.length;i++){
                    if(lib.translate[list[i]+'_info']){
                        str+=get.translation(list[i])+'、';
                    }
                }
                return str.slice(0,str.length-1);
            }
        },
                },
            },
            taoniz:{
                round:1,
                trigger:{
                    player:"dieBefore",
                },
                filter:function (event, player) {
        return player;
    },
                content:function (){
    
      
        trigger.cancel();
        trigger.finish();
        player.hp=player.maxHp;
        player.draw(player.maxHp)
        
    },
                group:["taoniz_roundcount"],
            },
            pingdingz:{
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event,player){
        return event;
    },
                content:function (){     
       var target=event.player;
        var num2=[1,2,3,4].randomGet();        
        if(num2==1) player.draw();        
        if(num2==2) player.draw(2);        
        if(num2==3) player.draw(3);
        if(num2==4) trigger.player.die();
    },
            },
            wuliz:{
                group:["wuliz2","wuliz3"],
                mod:{
                    targetInRange:function (card){
            if(get.card&&card.name=='sha') return true;
        },
                },
                audioname:["re_guanyu","guanzhang","jsp_guanyu","guansuo"],
                enable:["chooseToRespond","chooseToUse"],
                filterCard:function (card,player){
        if(get.zhu(player,'shouyue')) return true;
        return get.card;
    },
                position:"he",
                viewAs:{
                    name:"sha",
                },
                viewAsFilter:function (player){
        if(get.zhu(player,'shouyue')){
            if(!player.countCards('he')) return false;
        }
        else{
            if(!player.countCards('he',{color:'red'})) return false;
        }
    },
                prompt:"将一张牌当杀使用或打出",
                check:function (card){return 4-get.value(card)},
                ai:{
                    skillTagFilter:function (player){
            if(get.zhu(player,'shouyue')){
                if(!player.countCards('he')) return false;
            }
            else{
                if(!player.countCards('he',{color:'red'})) return false;
            }
        },
                    respondSha:true,
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:function (){
            if(_status.event.player.hasSkillTag('presha',true,null,true)) return 10;
            return 3;
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
            "wuliz2":{
                audio:"ext:乱世英杰:2",
                trigger:{
                    player:"useCard2",
                },
                direct:true,
                filter:function(event,player){
        return event.card&&event.card.name=='sha';//&&player.isDamaged();
    },
                content:function(){
        'step 0'
        var num=Infinity;
        player.chooseTarget('是否发动【武力】，令至多任意名其他角色也成为此【杀】的目标？',[1,num],function(card,player,target){
            return target!=player&&!trigger.targets.contains(target)&&player.canUse({name:'sha'},target);
        }).ai=function(target){
            return get.effect(target,{name:'sha'},_status.event.player);
        };
        'step 1'
        if(result.bool&&result.targets&&result.targets.length){
            var targets=result.targets;
            player.logSkill('wuliz',targets);
            player.line(targets,trigger.card.nature);
            trigger.targets.addArray(targets);
        }
    },
            },
            "wuliz3":{
                audio:"ext:乱世英杰:2",
                trigger:{
                    player:"shaBefore",
                },
                priority:99999,
                forced:true,
                filter:function(event,player){
        return _status.currentPhase==player&&player.getStat().card.sha&&player.getStat().card.sha>1;
    },
                content:function(){
    },
                mod:{
                    cardUsable:function(card,player,num){
            if(card.name=='sha') return Infinity;
        },
                    targetInRange:function (card,player){
            if(card.name=='sha') return true;
        },
                },
                ai:{
                    unequip:true,
                    skillTagFilter:function(player,tag,arg){
            if(!get.zhu(player,'shouyue')) return false;
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
                audioname:["zhangfei","re_zhangfei","guanzhang","xiahouba"],
            },
            wushuangz:{
                audio:"ext:乱世英杰:2",
                forced:true,
                trigger:{
                    player:"useCard",
                },
                filter:function(event,player){
        return event.card&&(get.type(event.card)=='trick'||get.type(event.card)=='basic'&&!['shan','tao','jiu','du'].contains(event.card.name))&&game.hasPlayer(function(current){
            return current!=player;
        });
    },
                content:function(){
        trigger.directHit.addArray(game.filterPlayer(function(current){
            return current!=player;
        }));
    },
            },
            mashuz:{
                mod:{
                    globalFrom:function(from,to,distance){
            return distance-Infinity;
        },
                },
            },
            "mashuz2":{
                nobracket:true,
                mod:{
                    globalTo:function(from,to,distance){
            return distance+Infinity;
            
        },
                },
            },
            shengliz:{
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event,player){
        return event;
    },
                content:function (){      
        var num=[1,2,3,4,5,6,7,8,9,10].randomGet();
        var num3=num*2;
        trigger.num+=num3*num3;           
     
    },
            },
            shengwei:{
                audio:"ext:乱世英杰:2",
                unique:true,
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function(){
        trigger.num+=game.players.length-1;
    },
                mod:{
                    maxHandcard:function(player,current){
            return current+game.players.length-1;
        },
                },
            },
            shengquz:{
                audio:"ext:乱世英杰:2",
                trigger:{
                    global:"phaseZhunbeiBegin",
                },
                filter:function(event,player){
        return player;
    },
                frequent:true,
                content:function(){
        player.draw(2);
    },
            },
            jijiuz:{
                audio:"ext:乱世英杰:2",
                audioname:["re_huatuo"],
                enable:"chooseToUse",
                filter:function(event,player){
        return _status.currentPhase!=player;
    },
                filterCard:function(card){
        return get.card;
    },
                position:"he",
                viewAs:{
                    name:"tao",
                },
                prompt:"将一张牌当桃使用",
                check:function(card){return 15-get.value(card)},
                ai:{
                    skillTagFilter:function(player){
            return player.countCards('he',{color:'red'})>0&&_status.currentPhase!=player;
        },
                    threaten:1.5,
                    save:true,
                    respondTao:true,
                    basic:{
                        order:function(card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                        useful:[8,6.5,5,4],
                        value:[8,6.5,5,4],
                    },
                    result:{
                        target:function(player,target){
                // if(player==target&&player.hp<=0) return 2;
                if(player.hasSkillTag('nokeep')) return 2;
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
            qingnangz:{
                subSkill:{
                    off:{
                        sub:true,
                    },
                    "off2":{
                        sub:true,
                    },
                },
                audio:"qingnang",
                enable:"phaseUse",
                filterCard:true,
                check:function (card){
        var player=_status.event.player;
        if(game.countPlayer(function(current){
            return (get.recoverEffect(current,player,player)>0&&get.attitude(player,current)>2);
        })>1&&get.color(card)=='black'&&player.countCards('h',{color:'red'})>0) return 3-get.value(card);
        return 9-get.value(card);
    },
                filter:function (event,player){
        return true;
    },
                filterTarget:function (card,player,target){
        if(target.hp>=target.maxHp||target.hasSkill('new_reqingnang_off')) return false;
        return true;
    },
                content:function (){
        if(get.color(cards[0])=='black') player.addTempSkill('new_reqingnang_off2');
        target.recover(target.maxHp);
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
            chuangshuz:{
                audio:"ext:乱世英杰:2",
                trigger:{
                    player:"die",
                },
                direct:true,
                forceDie:true,
                skillAnimation:true,
                animationColor:"wood",
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt2('yechou'),function(card,player,target){
            return player!=target
        }).set('forceDie',true).set('ai',function(target){
            var num=get.attitude(_status.event.player,target);
            return -num;
        });
        "step 1"
        if(result.bool){
            var target=result.targets[0];
            player.logSkill('chuangshuz',target);
            player.line(target,'green');
            target.addSkill('qingnangz');
        }
    },
                ai:{
                    expose:0.5,
                },
            },
            yizhez:{
                mod:{
                    targetEnabled:function(card,player,target){
            if(card.name=='juedou'||
                card.name=='sha'
                &&player!=target) return false;
        },
                },
            },
            wuqingz:{
                trigger:{
                    player:["phaseBegin","phaseEnd"],
                },
                frequent:true,
                content:function(){
        player.draw(5)
    },
            },
            huichunz:{
                tese:"YXW恐怖",
                enable:"phaseUse",
                unique:true,
                filter:function (event,player){
return game.dead.length>0;
},
                direct:true,
                nobracket:true,
                notarget:true,
                content:function (){
                "step 0"
                 var list=[];
                 for(var i=0;i<game.dead.length;i++){
                     list.push(game.dead[i].name);
                 }                 player.chooseButton(ui.create.dialog('选择1名角色',[list,'character']),function(button){
                 for(var i=0;i<game.dead.length&&game.dead[i].name!=button.link;i++);
                     return ai.get.attitude(_status.event.player,game.dead[i]);
                 }); 
                "step 1"
                 if(result.bool){
                     for(var i=0;i<game.dead.length&&game.dead[i].name!=result.buttons[0].link;i++);
                     var dead=game.dead[i];
                     player.logSkill('huichunz',dead);
                    game.me.$fullscreenpop('<span style="color:#de691e">妙手回春</span>','thunder');
                   
                     dead.revive();
     }
},
            },
            huojiz:{
                enable:"phaseUse",
                direct:true,
                filterTarget:function(card,player,target){
        return target;
    },
                check:function(card){return 7-get.value(card);},
                position:"he",
                filterCard:true,
                content:function(){
        target.damage('fire','nocard');
    },
            },
            bazhengz:{
                audio:"ext:乱世英杰:2",
                audioname:["re_sp_zhugeliang","ol_sp_zhugeliang","ol_pangtong"],
                equipSkill:true,
                noHidden:true,
                inherit:"bagua_skill",
                filter:function(event,player){
        if(!lib.skill.bagua_skill.filter(event,player)) return false;
        if(!player.isEmpty(2)) return false;
        return true;
    },
                ai:{
                    respondShan:true,
                    effect:{
                        target:function(card,player,target){
                if(player==target&&get.subtype(card)=='equip2'){
                    if(get.equipValue(card)<=7.5) return 0;
                }
                if(!target.isEmpty(2)) return;
                return lib.skill.bagua_skill.ai.effect.target.apply(this,arguments);
            },
                    },
                },
                trigger:{
                    player:["chooseToRespondBegin","chooseToUseBegin"],
                },
                check:function(event,player){
        if(event&&(event.ai||event.ai1)){
            var ai=event.ai||event.ai1;
            var tmp=_status.event;
            _status.event=event;
            var result=ai({name:'shan'},_status.event.player,event);
            _status.event=tmp;
            return result>0;
        }
        return true;
    },
                content:function(){
        "step 0"
        trigger.bagua_skill=true;
        player.judge('bagua',function(card){return (get.color(card)=='red')?1.5:-0.5});
        "step 1"
        if(result.judge>0){
            trigger.untrigger();
            trigger.set('responded',true);
            trigger.result={bool:true,card:{name:'shan',isCard:true}}
        }
    },
            },
            kangpoz:{
                trigger:{
                    global:"useCard",
                },
                filter:function (event,player){
        return player.countCards('he')>0&&
            event.player!=player;
    },
                content:function (){
        player.chooseToDiscard(1,'he',true);
        game.log(player,'发动了看破，',trigger.card,
                 '被',player,'看破');
        var chat=['不过如此','雕虫小技'].randomGet()
     player.say(chat)
    
        trigger.cancel();
    player.draw();
        player.gain(trigger.cards);
    },
            },
            nimingz:{
                trigger:{
                    global:"judgeBefore",
                },
                locked:true,
                forced:false,
                priority:null,
                unique:true,
                noremove:true,
                noadd:true,
                nodisable:true,
                content:function (){
        console.log(player);
        'step 0'
        event.cards=get.cards(40);
        player.chooseCardButton(true,event.cards,'改命：选择一张牌作为他的'+trigger.judgestr+'判定结果').ai=function(button){
            if(get.attitude(player,trigger.player)>0){
                return 1+trigger.judge(button.link);
            }
            if(get.attitude(player,trigger.player)<0){
                return 1-trigger.judge(button.link);
            }
            return 0;
        };
        "step 1"
        if(!result.bool){
            event.finish();
            return;
        }
        player.logSkill('gaiming',trigger.player);
        var card=result.links[0];
        event.cards.remove(card);
        var judgestr=get.translation(trigger.player)+'的'+trigger.judgestr+'判定';
        event.videoId=lib.status.videoId++;
        event.dialog=ui.create.dialog(judgestr);
        event.dialog.classList.add('center');
        event.dialog.videoId=event.videoId;

        game.addVideo('judge1',player,[get.cardInfo(card),judgestr,event.videoId]);
        for(var i=0;i<event.cards.length;i++) event.cards[i].discard();
        // var node=card.copy('thrown','center',ui.arena).animate('start');
        var node;
        if(game.chess){
            node=card.copy('thrown','center',ui.arena).animate('start');
        }
        else{
            node=player.$throwordered(card.copy(),true);
        }
        node.classList.add('thrownhighlight');
        ui.arena.classList.add('thrownhighlight');
        if(card){
            trigger.cancel();
            trigger.result={
                card:card,
                judge:trigger.judge(card),
                node:node,
                number:get.number(card),
                suit:get.suit(card),
                color:get.color(card),
            };
            if(trigger.result.judge>0){
                trigger.result.bool=true;
                trigger.player.popup('洗具');
            }
            if(trigger.result.judge<0){
                trigger.result.bool=false;
                trigger.player.popup('杯具');
            }
            game.log(trigger.player,'的判定结果为',card);
            trigger.direct=true;
            trigger.position.appendChild(card);
            game.delay(2);
        }
        else{
            event.finish();
        }
        "step 2"
        ui.arena.classList.remove('thrownhighlight');
        event.dialog.close();
        game.addVideo('judge2',null,event.videoId);
        ui.clear();
        var card=trigger.result.card;
        trigger.position.appendChild(card);
        trigger.result.node.delete();
        game.delay();
    },
            },
            jicez:{
            },
        },
        translate:{
            "伤":"伤",
            "伤_info":"",
            "白板武将":"白板武将",
            "白板武将_info":"锁定技，你不能获得牌、造成伤害和回复体力",
            qianxunz:"谦逊",
            "qianxunz_info":"锁定技，当你横置时，取消之。你不能成为延时类锦囊的目标。你不能成为其他角色拼点的目标;每当其他角色使用的牌生效时，若你是此牌的目标，你可以将所有手牌置于你的武将牌上，若如此做，此回合结束时，你获得你武将牌上的所有牌。",
            luanwuz:"乱武",
            "luanwuz_info":"出牌阶段限一次，你可以令所有其他角色弃置装备区内所有牌和所有技能失效直到其出牌阶段开始并依次随机失去1～20、其体力值的一半(向上取整)、其体力值点体力(若目标角色体力上限大于15，则此角色死亡)，然后你摸X张牌(X为场上已死亡角色数量)",
            weihuz:"帷幕",
            "weihuz_info":"锁定技，你不能成为其他角色黑色牌的目标；当有其他角色使用黑桃牌时，你摸一张牌",
            wangshaz:"完杀",
            "wangshaz_info":"锁定技，你的回合内，当其他角色回复体力时，你令其无效化。",
            bawanz:"霸王",
            "bawanz_info":"当你使用牌指定目标后（除[决斗]以外)，你可以视为使用一张【决斗】",
            hunziz:"魂姿",
            "hunziz_info":"锁定技，游戏开始后，你获得技能〖英姿〗和〖英魂〗",
            shangkouz:"伤口",
            "shangkouz_info":"当你的手牌数小于X时，你可以将手牌摸至X张（X为你的“伤”标记数量）",
            shangshiz:"伤逝",
            "shangshiz_info":"出牌阶段，若你有“伤”标记，你可以移去一个“伤”标记，然后令一名其他角色失去一点体力",
            jiangz:"激昂",
            "jiangz_info":"每当被使用（成为目标后）牌时，你可以摸一张牌。",
            xiantiz:"仙体",
            "xiantiz_info":"<span class=\"bluetext\" style=\"color:    #de691e\">锁定技</span>，你免疫小部分负面影响(跳过阶段、体力上限减少、失去体力、翻面、横置、混乱、技能失效、失去技能、移除武将牌等)。",
            shangganz:"伤感",
            "shangganz_info":"锁定技，你造成的伤害+X(X为你的“伤”标记数量)",
            shangliz:"伤离",
            "shangliz_info":"锁定技，当你受到伤害前防止此伤害，并且你获得一个“伤”标记(当你“伤”标记达到10个时，你死亡)。",
            "qianxunz1":"谦逊",
            "qianxunz1_info":"",
            lianyinz:"连营",
            "lianyinz_info":"当你失去最后的手牌时，你可以令至多X名角色各摸X张牌（X为你此次失去的手牌数）。",
            junluz:"军略",
            "junluz_info":"锁定技，当你受到伤害或造成非〖焚营〗前技能(除横置状态的角色以外)的伤害后，你获得X个“军略”标记(X为伤害点数)",
            fengyingz:"焚营",
            "fengyingz_info":"出牌阶段，若你有“军略”标记，你可以移去一个“伤”标记，然后对一名其他角色造成一点火焰伤害；出牌阶段开始时，若你有“军略”标记，你可以对所有其他角色造成X点火焰伤害(X为你的“军略”标记数量)并移去所有军略标记",
            "junluz2":"军略",
            "junluz2_info":"",
            dailaoz:"待劳",
            "dailaoz_info":"当你使用牌时，你可以令一名未横置的其他角色横置。",
            "fengyingz2":"焚营",
            "fengyingz2_info":"",
            yiyiz:"以逸",
            "yiyiz_info":"当你对横置状态的角色造成伤害时，你可以摸X张牌(X为伤害值)",
            bihuoz:"避祸",
            "bihuoz_info":"锁定技，当你受到伤害时，若伤害来源体力值大于你，防止此伤害并且你摸一张牌",
            "技能失效":"技能失效",
            "技能失效_info":"",
            taoniz:"讨逆",
            "taoniz_info":"每轮限一次，当你死亡前，你可以取消之，并将体力回复至体力上限和摸X张牌(X为你的体力上限)",
            pingdingz:"平定",
            "pingdingz_info":"当你造成伤害时，你可以随机：摸一至三张牌或目标角色死亡",
            wuliz:"武力",
            "wuliz_info":"你可以将一张牌当做【杀】使用或打出;你使用的[杀]没有距离限制;你使用[杀]可以指定任意名其他角色为目标",
            "wuliz2":"武力2",
            "wuliz2_info":"当你使用【杀】时，你可以令至多X名角色也成为此【杀】的目标。（X为你已损失的体力值且至少为1）",
            "wuliz3":"武力",
            "wuliz3_info":"",
            wushuangz:"无双",
            "wushuangz_info":"锁定技，当你使用牌时，你令所有其他角色不能使用或打出牌响应此牌。",
            mashuz:"马术",
            "mashuz_info":"锁定技，你计算与其他角色的距离时-无限；锁定技，其他角色计算与你的距离时+无限。",
            "mashuz2":"马术2",
            "mashuz2_info":"",
            shengliz:"神力",
            "shengliz_info":"你造成的伤害时，你可以令此伤害+X(X为1～10的随机数×2的平方)",
            shengwei:"神威",
            "shengwei_info":"锁定技，摸牌阶段，你额外摸X张牌，你的手牌上限+X（X为场上其他角色的数量）",
            shengquz:"神躯",
            "shengquz_info":"每名角色的准备阶段，你可以摸两张牌",
            jijiuz:"急救",
            "jijiuz_info":"你的回合外，你可以将一张牌当做【桃】使用。",
            qingnangz:"青囊",
            "qingnangz_info":"出牌阶段，你可以弃置一张手牌，令一名受伤角色回复体力至体力上限。",
            chuangshuz:"传书",
            "chuangshuz_info":"当你死亡时，你可以令一名其他角色获得技能〖青囊〗",
            yizhez:"医者",
            "yizhez_info":"锁定技，你不能成为其他角色[杀]或[决斗]的目标",
            wuqingz:"五禽",
            "wuqingz_info":"当你的回合开始时或回合结束时，你可以摸五张牌",
            huichunz:"回春",
            "huichunz_info":"出牌阶段限一次，你可以选择一位死亡的角色复活",
            huojiz:"火计",
            "huojiz_info":"出牌阶段，你可以弃置一张牌并对一名其他角色造成一点火焰伤害",
            bazhengz:"八阵",
            "bazhengz_info":"锁定技，若你的防具栏内没有牌且没有被废除，则你视为装备着【八卦阵】。",
            kangpoz:"看破",
            "kangpoz_info":"当其他角色使用牌时，你可以弃置一张牌并令此牌失效然后你摸1张牌并获得此牌",
            nimingz:"逆命",
            "nimingz_info":"当角色的判定牌生效前，你可以观看牌堆顶的40张牌并选择一张作为判定结果，此结果不可更改。",
            jicez:"计策",
            "jicez_info":"",
        },
    },
    intro:"",
    author:"都有",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["zugeliangz.jpg"],"card":[],"skill":[]}}};