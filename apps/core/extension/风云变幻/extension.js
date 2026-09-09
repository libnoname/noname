import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"风云变幻",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "陆绪":["male","shen",4,["潜龙","制略","风吟"],[]],
            "马云祿":["female","shu",4,["fengpo","mashu","风姿"],[]],
            "马超":["male","shu",4,["retieji","mashu","却敌"],[]],
            "夏侯渊":["male","wei",4,["xinshensu","急进","影袭"],[]],
            "太史慈":["male","qun",4,["击虚","贯日","御风"],[]],
            "赵云":["male","shu",4,["ollongdan","chongzhen","涯角"],[]],
            "神吕蒙":["male","shen",2,["韬略","复礼"],[]],
            "神刘备":["male","shen",6,["龙怒","结营","昭烈"],[]],
            "孙策":["male","wu",5,["激昂","定音","烈阳"],[]],
            "司马昭":["male","jin",3,["昭心","终焉"],[]],
        },
        translate:{
            "陆绪":"陆绪",
            "马云祿":"马云祿",
            "马超":"马超",
            "夏侯渊":"夏侯渊",
            "太史慈":"太史慈",
            "赵云":"赵云",
            "神吕蒙":"神吕蒙",
            "神刘备":"神刘备",
            "孙策":"孙策",
            "司马昭":"司马昭",
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
            "潜龙":{
                group:["drlt_qianjie_1","drlt_qianjie_2","drlt_qianjie_3"],
                locked:true,
                ai:{
                    effect:{
                        target:function (card){
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
                        filter:function (event,player){
                return !player.isLinked();
            },
                        content:function (){
                trigger.cancel();
            },
                        sub:true,
                    },
                    "2":{
                        mod:{
                            targetEnabled:function (card,player,target){
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
            "制略":{
                audio:"ext:风云变幻:2",
                global:"xianghai_g",
                mod:{
                    cardname:function (card){
            if(get.type(card,null,false)=='equip') return 'wuzhong';
        },
                },
                ai:{
                    threaten:2,
                },
            },
            "风吟":{
                mark:true,
                locked:false,
                zhuanhuanji:true,
                marktext:"风",
                intro:{
                    content:function (storage,player,skill){
            var str=player.storage.nzry_chenglve?'出牌阶段限一次，你可以摸两张牌，然后弃置一张手牌。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制':'出牌阶段限一次，你可以摸一张牌，然后弃置两张手牌。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制';
            if(player.storage.nzry_chenglve1){
                str+='<br><li>当前花色：';
                str+=get.translation(player.storage.nzry_chenglve1);
            }
            return str;
        },
                },
                enable:"phaseUse",
                usable:1,
                audio:"ext:风云变幻:2",
                content:function (){
        'step 0'
        if(player.storage.nzry_chenglve==true){
            player.storage.nzry_chenglve=false;
            player.draw(2);
            player.chooseToDiscard('h',true);
        }else{
            player.storage.nzry_chenglve=true;
            player.draw();
            player.chooseToDiscard('h',2,true);
        };
        'step 1'
        if(result.bool){
            player.storage.nzry_chenglve1=[];
            for(var i=0;i<result.cards.length;i++){
                player.storage.nzry_chenglve1.add(get.suit(result.cards[i],player));
            }
            player.markSkill('nzry_chenglve');
            player.addTempSkill('nzry_chenglve1');
        };
    },
                ai:{
                    order:2.7,
                    result:{
                        player:function (player){
                if((player.storage.nzry_chenglve==undefined||player.storage.nzry_chenglve==false)&&player.countCards('h')<3) return 0;
                return 1;
            },
                    },
                },
            },
            "匿心":{
                audio:"ext:风云变幻:2",
                trigger:{
                    target:"useCardToTargeted",
                },
                filter:function (event,player){
        var num=1;
        if(_status.currentPhase&&_status.currentPhase.group=='qun'&&player.hasZhuSkill('yuwei',_status.currentPhase)) num=2;
        return player!=event.player&&player.getHistory('gain',function(evt){
            return evt.getParent(2).name=='shiyuan'&&evt.cards.length==(2+get.sgn(event.player.hp-player.hp));
        }).length<num;
    },
                content:function (){
        player.draw(2+get.sgn(trigger.player.hp-player.hp));
    },
            },
            "魂杀":{
                shaRelated:true,
                audio:"ext:风云变幻:2",
                trigger:{
                    player:"useCardToPlayered",
                },
                direct:true,
                filter:function (event,player){
        return event.card.name=='sha'&&event.target.hp>0&&event.target.countCards('he')>0;
    },
                content:function (){
        'step 0'
        var next=player.choosePlayerCard(trigger.target,'he',[1,Math.min(trigger.target.hp,trigger.target.countCards('he'))],get.prompt('repojun',trigger.target));
        next.set('ai',function(button){
            if(!_status.event.goon) return 0;
            var val=get.value(button.link);
            if(button.link==_status.event.target.getEquip(2)) return 2*(val+3);
            return val;
        });
        next.set('goon',get.attitude(player,trigger.target)<=0);
        next.set('forceAuto',true);
        'step 1'
        if(result.bool){
            var target=trigger.target;
            player.logSkill('repojun',trigger.target);
            target.addSkill('repojun2');
            target.storage.repojun2.addArray(result.cards);
            target.lose(result.cards,ui.special,'toStorage');
            game.log(target,'失去了'+get.cnNumber(result.cards.length)+'张牌');
            target.markSkill('repojun2');
        }
    },
                ai:{
                    "unequip_ai":true,
                    "directHit_ai":true,
                    skillTagFilter:function (player,tag,arg){
            if(get.attitude(player,arg.target)>0) return false;
            if(tag=='directHit_ai') return arg.target.hp>=Math.max(1,arg.target.countCards('h')-1);
            if(arg&&arg.name=='sha'&&arg.target.getEquip(2)) return true;
            return false;
        },
                },
                group:"repojun3",
            },
            "神羽":{
                audio:"ext:风云变幻:2",
                trigger:{
                    player:"damageBegin3",
                    source:"damageBegin1",
                },
                forced:true,
                filter:function (event,player){
        return player.isMaxHandcard(true);
    },
                content:function (){
        trigger.num++;
    },
                ai:{
                    presha:true,
                },
            },
            "风姿":{
                audio:"fengzi",
                forced:true,
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){
        return event.card&&(get.type(event.card)=='trick'||get.type(event.card)=='basic'&&!['shan','tao','jiu','du'].contains(event.card.name))&&game.hasPlayer(function(current){
            return current!=player&&get.distance(player,current)<=1;
        });
    },
                content:function (){
        trigger.directHit.addArray(game.filterPlayer(function(current){
            return current!=player&&get.distance(player,current)<=1;
        }));
    },
                ai:{
                    "directHit_ai":true,
                    skillTagFilter:function (player,tag,arg){
            return get.distance(player,arg.target)<=1;
        },
                },
            },
            "却敌":{
                audio:"ext:风云变幻:2",
                trigger:{
                    source:"damageSource",
                },
                check:function (event,player){
        if(event.player.isTurnedOver()) return get.attitude(player,event.player)>0;
        if(event.player.hp<3){
            return get.attitude(player,event.player)<0;
        }
        return get.attitude(player,event.player)>0;
    },
                filter:function (event){
        if(event._notrigger.contains(event.player)) return false;
        return event.card&&event.card.name=='sha'&&event.player.isAlive();
    },
                logTarget:"player",
                content:function (){
        "step 0"
        trigger.player.draw(Math.min(0,trigger.player.hp));
        "step 1"
        trigger.player.turnOver();
    },
            },
            "急进":{
                audio:"ext:风云变幻:2",
                trigger:{
                    global:"phaseAfter",
                },
                frequent:true,
                filter:function (event,player){
        return player.getStat('kill')>0;
    },
                content:function (){
        player.insertPhase();
    },
            },
            "影袭":{
                audio:"ext:风云变幻:2",
                trigger:{
                    player:"phaseEnd",
                },
                direct:true,
                filter:function (event,player){
        return player.getHistory('skipped').length>0;
    },
                content:function (){
        'step 0'
        player.chooseTarget([1,player.getHistory('skipped').length],get.prompt2('pingkou'),function(card,player,target){
            return target!=player;
        }).set('ai',function(target){
            var player=_status.event.player;
            return get.damageEffect(target,player,player);
        });
        'step 1'
        if(result.bool){
            player.logSkill('pingkou',result.targets);
            event.targets=result.targets.slice(0).sortBySeat();
        }
        else{
            event.finish();
        }
        'step 2'
        if(event.targets&&event.targets.length){
            event.targets.shift().damage();
            event.redo();
        }
    },
                ai:{
                    combo:"fenli",
                    effect:{
                        target:function (card){
                if(card.name=='lebu'||card.name=='bingliang') return 0.5;
            },
                    },
                },
            },
            "击虚":{
                trigger:{
                    player:"useCardToPlayered",
                },
                forced:true,
                audio:"ext:风云变幻:2",
                filter:function (event,player){
        return event.card.name=='sha'&&!event.target.inRange(player);
    },
                logTarget:"target",
                content:function (){
        trigger.getParent().reanjian_buffed=true;
        var map=trigger.customArgs;
        var id=trigger.target.playerid;
        if(!map[id]) map[id]={};
        if(!map[id].extraDamage) map[id].extraDamage=0;
        map[id].extraDamage++;
        trigger.target.addTempSkill('reanjian2');
        trigger.target.addTempSkill('reanjian4');
        trigger.target.storage.reanjian2.add(trigger.card);
    },
                ai:{
                    "unequip_ai":true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha'&&arg.target&&!arg.target.inRange(player)) return true;
            return false;
        },
                },
            },
            "贯日":{
                locked:false,
                mod:{
                    targetInRange:function (card,player,target,now){
            if(game.online){
                if(!player.countUsed()) return true;
            }
            else{
                var evt=_status.event.getParent('phaseUse');
                if(evt&&evt.name=='phaseUse'&&player.getHistory('useCard',function(evt2){
                    return evt2.getParent('phaseUse')==evt
                }).length==0) return true;
            }
        },
                },
                audio:"ext:风云变幻:2",
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){
        return player.isPhaseUsing()&&(event.card.name=='sha'||get.type(event.card)=='trick');
    },
                check:function (event,player){
        if(['wuzhong','kaihua','dongzhuxianji'].contains(event.card.name)) return false;
        player._wanglie_temp=true;
        var eff=0;
        for(var i of event.targets){
            eff+=get.effect(i,event.card,player,player);
        }
        delete player._wanglie_temp;
        if(eff<0) return true;
        if(!player.countCards('h',function(card){
            return player.hasValueTarget(card,null,true);
        })) return true;
        if(get.tag(event.card,'damage')&&!player.needsToDiscard()&&!player.countCards('h',function(card){
            return get.tag(card,'damage')&&player.hasValueTarget(card,null,true);
        })) return true;
        return false;
    },
                content:function (){
        trigger.nowuxie=true;
        trigger.directHit.addArray(game.players);
        player.addTempSkill('drlt_wanglie2');
    },
                ai:{
                    pretao:true,
                    "directHit_ai":true,
                    skillTagFilter:function (player,tag,arg){
            if(tag=='pretao') return true;
            if(player._wanglie_temp) return false;
            player._wanglie_temp=true;
            var bool=function(){
                if(['wuzhong','kaihua','dongzhuxianji'].contains(arg.card.name)) return false;
                if(get.attitude(player,arg.target)>0||!player.isPhaseUsing()) return false;
                var cards=player.getCards('h',function(card){
                    return card!=arg.card&&(!arg.card.cards||!arg.card.cards.contains(card));
                });
                var sha=player.getCardUsable('sha');
                if(arg.card.name=='sha') sha--;
                cards=cards.filter(function(card){
                    if(card.name=='sha'&&sha<=0) return false;
                    return player.hasValueTarget(card,null,true);
                });
                if(!cards.length) return true;
                if(!get.tag(arg.card,'damage')) return false;
                if(!player.needsToDiscard()&&!cards.filter(function(card){
                    return get.tag(card,'damage');
                }).length) return true;
                return false;
            }();
            delete player._wanglie_temp;
            return bool;
        },
                },
            },
            "御风":{
                mod:{
                    globalTo:function (from,to,distance){
            return distance+1;
        },
                },
            },
            "涯角":{
                trigger:{
                    target:"useCardToBefore",
                },
                direct:true,
                content:function (){
        'step 0'
        player.chooseToUse(function(card){
            return !get.info(card).multitarget;
        },get.prompt('涯角',trigger.player),trigger.player,-1);
        'step 1'
        if(event.damaged){
            trigger.cancel();
            if(get.color(trigger.card)=='black'){
                player.draw();
            }
        }
    },
                subSkill:{
                    damage:{
                        trigger:{
                            source:"damageAfter",
                        },
                        silent:true,
                        filter:function (event,player){
                return event.getParent(4).name=='涯角';
            },
                        content:function (){
                trigger.getParent(4).damaged=true;
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
                group:"nsjianxiong_damage",
                ai:{
                    effect:{
                        player:function (card,player,target){
                if(_status.currentPhase!=player) return;
                if(get.tag(card,'damage')&&!player.needsToDiscard(1)&&target.hp>1){
                    return 'zeroplayertarget';
                }
            },
                    },
                },
            },
            "攻心":{
                audio:"ext:风云变幻:2",
                enable:"phaseUse",
                filterTarget:function (card,player,target){
        return player!=target;
    },
                content:function (){
        "step 0"
        if(target.countCards('hej')==0){
            event._result={index:1};
        }
        else{
            target.chooseControl().set('choiceList',[
    '令'+get.translation(player)+'随机获得你区域内的一张牌，然后其本回合内不能再对你使用牌。',
    '令'+get.translation(player)+'本回合内对你使用牌没有次数与距离限制。',
            ]).set('ai',function(){
                var list=[0,1];
                return list.randomGet();
            });
        }
        "step 1"
        player.addTempSkill('tanbei_effect3');
        if(result.index==0){
            var card=target.getCards('hej').randomGet();
            player.gain(card,target,'giveAuto','bySelf');
            target.addTempSkill('tanbei_effect2');
        }
        else{
            target.addTempSkill('tanbei_effect1');
        }
    },
                ai:{
                    order:function (){
            return [2,4,6,8,10].randomGet();
        },
                    result:{
                        target:function (player,target){
                return -2-target.countCards('h');
            },
                    },
                    threaten:1.1,
                },
            },
            "韬略":{
                trigger:{
                    player:"loseEnd",
                },
                content:function (){
        'step 0'
        event.num=trigger.num;
        'step 1'
        player.judge();
        'step 2'
        event.color=result.color;
        if(event.color=='black'){
            player.chooseTarget('弃置一名角色区域内的一张牌',function(card,player,target){
                return target.countCards('hej');
            }).set('ai',function(target){
                var player=_status.event.player;
                var att=get.attitude(player,target);
                if(att<0){
                    att=-Math.sqrt(-att);
                }
                else{
                    att=Math.sqrt(att);
                }
                return att*lib.card.guohe.ai.result.target(player,target);
            })
        }
        else{
            var next=player.chooseTarget('令一名角色摸一张牌');
            if(player.storage.xianfu2&&player.storage.xianfu2.length){
                next.set('prompt2','（若目标为'+get.translation(player.storage.xianfu2)+'则改为摸两张牌）');
            }
            next.set('ai',function(target){
                var player=_status.event.player;
                var att=get.attitude(player,target)/Math.sqrt(1+target.countCards('h'));
                if(target.hasSkillTag('nogain')) att/=10;
                if(player.storage.xianfu2&&player.storage.xianfu2.contains(target)) return att*2;
                return att;
            })
        }
        'step 3'
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            if(event.color=='black'){
                player.discardPlayerCard(target,'hej',true);
            }
            else{
                if(player.storage.xianfu2&&player.storage.xianfu2.contains(target)){
                    if(!target.storage.xianfu_mark) target.storage.xianfu_mark=[];
                    target.storage.xianfu_mark.add(player);
                    target.storage.xianfu_mark.sortBySeat();
                    target.markSkill('xianfu_mark');
                    target.draw(2);
                }
                else{
                    target.draw();
                }
            }
        }
        'step 4'
        if(--event.num>0){
            player.chooseBool(get.prompt2('chouce'));
        }
        else{
            event.finish();
        }
        'step 5'
        if(result.bool){
            player.logSkill('chouce');
            event.goto(1);
        }
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    if(!target.hasFriend()) return;
                    if(target.hp>=4) return [1,get.tag(card,'damage')*1.5];
                    if(target.hp==3) return [1,get.tag(card,'damage')*1];
                    if(target.hp==2) return [1,get.tag(card,'damage')*0.5];
                }
            },
                    },
                },
            },
            "龙怒":{
                mark:true,
                locked:true,
                marktext:"龙",
                intro:{
                    content:function (storage,player,skill){
            if(player.storage.nzry_longnu==true) return '锁定技，出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你的锦囊牌均视为雷杀且无使用次数限制';
            return '锁定技，出牌阶段开始时，你流失一点体力并摸一张牌，然后本阶段内你的红色手牌均视为火杀且无距离限制';
        },
                },
                audio:"ext:风云变幻:2",
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                content:function (){
        'step 0'
        if(player.storage.nzry_longnu==true){
            player.loseMaxHp();
        }
        else{
            player.loseHp();
        }
        player.draw();
        'step 1'
        if(player.storage.nzry_longnu==true){
            player.storage.nzry_longnu=false;
            player.addTempSkill('nzry_longnu_2','phaseUseAfter');
        }
        else{
            player.storage.nzry_longnu=true;
            player.addTempSkill('nzry_longnu_1','phaseUseAfter');
        };
    },
                subSkill:{
                    "1":{
                        mod:{
                            cardname:function (card,player){
                    if(get.color(card)=='red') return 'sha';
                },
                            cardnature:function (card,player){
                    if(get.color(card)=='red') return 'fire';
                },
                            targetInRange:function (card){
                    if(get.color(card)=='red') return true;
                },
                        },
                        ai:{
                            effect:{
                                target:function (card,player,target,current){
                        if(get.tag(card,'respondSha')&&current<0) return 0.6
                    },
                            },
                            respondSha:true,
                        },
                        sub:true,
                    },
                    "2":{
                        mod:{
                            cardname:function (card,player){
                    if(['trick','delay'].contains(lib.card[card.name].type)) return 'sha';
                },
                            cardnature:function (card,player){
                    if(['trick','delay'].contains(lib.card[card.name].type)) return 'thunder';
                },
                            cardUsable:function (card,player){
                    if(card.name=='sha'&&card.nature=='thunder') return Infinity;
                },
                        },
                        ai:{
                            effect:{
                                target:function (card,player,target,current){
                        if(get.tag(card,'respondSha')&&current<0) return 0.6
                    },
                            },
                            respondSha:true,
                        },
                        sub:true,
                    },
                },
                ai:{
                    fireAttack:true,
                    halfneg:true,
                    threaten:1.05,
                },
            },
            "结营":{
                audio:"ext:风云变幻:2",
                locked:true,
                global:"g_nzry_jieying",
                ai:{
                    effect:{
                        target:function (card){
                if(card.name=='tiesuo') return 'zeroplayertarget';
            },
                    },
                },
                group:["nzry_jieying_1","nzry_jieying_2"],
                subSkill:{
                    "1":{
                        audio:2,
                        trigger:{
                            player:["linkBefore","enterGame"],
                            global:"phaseBefore",
                        },
                        forced:true,
                        filter:function (event,player){
                if(event.name=='link') return player.isLinked();
                return (event.name!='phase'||game.phaseNumber==0)&&!player.isLinked();
            },
                        content:function (){
                if(trigger.name!='link') player.link(true);
                else trigger.cancel();
            },
                        sub:true,
                    },
                    "2":{
                        audio:2,
                        trigger:{
                            player:"phaseJieshuBegin",
                        },
                        direct:true,
                        filter:function (event,player){
                return game.hasPlayer(function(current){
                    return current!=player&&!current.isLinked();
                });
            },
                        content:function (){
                "step 0"
                player.chooseTarget(true,'请选择【结营】的目标',function(card,player,target){
                    return target!=player&&!target.isLinked();
                }).ai=function(target){
                    return 1+Math.random();
                };
                "step 1"
                if(result.bool){
                    player.line(result.targets);
                    player.logSkill('nzry_jieying');
                    result.targets[0].link(true);
                }else{
                    event.finish();
                };
            },
                        sub:true,
                    },
                },
            },
            "昭烈":{
                audio:"ext:风云变幻:2",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                direct:true,
                filter:function (event,player){
        return game.hasPlayer(function(current){
            return current!=player&&current.hp<=player.hp;
        });
    },
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('xinfu_langxi'),'对一名体力值不大于你的其他角色造成0-2点随机伤害',function(card,player,target){
            return target.hp<=player.hp&&target!=player;
        }).set('ai',function(target){
            var player=_status.event.player;
            return get.damageEffect(target,player,player);
        });
        "step 1"
        if(result.bool&&result.targets&&result.targets.length){
            player.logSkill('xinfu_langxi',result.targets);
            var num=[3].randomGet();
            if(get.isLuckyStar(player)) num=2;
            player.line(result.targets[0],'green');
            result.targets[0].damage(num);
        }
    },
                ai:{
                    expose:0.25,
                    threaten:1.7,
                },
            },
            "激昂":{
                shaRelated:true,
                audio:"ext:风云变幻:2",
                preHidden:true,
                audioname:["sp_lvmeng","re_sunben","re_sunce"],
                trigger:{
                    player:"useCardToPlayered",
                    target:"useCardToTargeted",
                },
                filter:function (event,player){
        if(!(event.card.name=='juedou'||(event.card.name=='sha'&&get.color(event.card)=='red'))) return false;
        return player==event.target||event.getParent().triggeredTargets3.length==1;
    },
                frequent:true,
                content:function (){
        player.draw();
    },
                ai:{
                    effect:{
                        target:function (card,player,target){
                if(card.name=='sha'&&get.color(card)=='red') return [1,0.6];
            },
                        player:function (card,player,target){
                if(card.name=='sha'&&get.color(card)=='red') return [1,1];
            },
                    },
                },
            },
            "定音":{
                audio:"ext:风云变幻:2",
                shaRelated:true,
                trigger:{
                    global:"useCard",
                },
                direct:true,
                filter:function (event,player){
        return event.card.name=='sha'&&player.countCards('he')>0&&event.player.isPhaseUsing();
    },
                content:function (){
        'step 0'
        game.delayx();
        var go=false;
        if(get.attitude(player,trigger.player)>0){
            if(get.color(trigger.card)=='red'){
                go=true;
            }
            else if(trigger.addCount===false||!trigger.player.isPhaseUsing()) go=false;
            else if(!trigger.player.hasSkill('paoxiao')&&
                !trigger.player.hasSkill('tanlin3')&&
                !trigger.player.hasSkill('zhaxiang2')&&
                !trigger.player.hasSkill('fengnu')&&
                !trigger.player.getEquip('zhuge')){
                var nh=trigger.player.countCards('h');
                if(player==trigger.player){
                    go=(player.countCards('h','sha')>0);
                }
                else if(nh>=4){
                    go=true;
                }
                else if(player.countCards('h','sha')){
                    if(nh==3){
                        go=Math.random()<0.8;
                    }
                    else if(nh==2){
                        go=Math.random()<0.5;
                    }
                }
                else if(nh>=3){
                    if(nh==3){
                        go=Math.random()<0.5;
                    }
                    else if(nh==2){
                        go=Math.random()<0.2;
                    }
                }
            }
        }
        var next=player.chooseToDiscard(get.prompt('longyin'),'弃置一张牌'+(get.color(trigger.card)=='red'?'并摸一张牌':'')+'，令'+get.translation(trigger.player)+'本次使用的【杀】不计入使用次数','he');
        next.logSkill=['longyin',trigger.player];
        next.set('ai',function(card){
            if(_status.event.go){
                return 6-get.value(card);
            }
            return 0;
        });
        next.set('go',go);
        'step 1'
        if(result.bool){
            if(trigger.addCount!==false){
                trigger.addCount=false;
                trigger.player.getStat().card.sha--;
            }
            if(get.color(trigger.card)=='red'){
                player.draw();
            }
            // player.logSkill('longyin',trigger.player);
        }
    },
                ai:{
                    expose:0.2,
                },
            },
            "烈阳":{
                trigger:{
                    player:"useCard1",
                },
                filter:function (event,player){
        if(event.card.name=='sha'&&!event.card.nature) return true;
        return false;
    },
                audio:"ext:风云变幻:2",
                audioname:["re_chengpu"],
                check:function (event,player){
        return false;
    },
                content:function (){
        trigger.card.nature='fire';
        var next=game.createEvent('lihuo_clear');
        next.player=player;
        next.card=trigger.card;
        event.next.remove(next);
        next.forceDie=true;
        trigger.after.push(next);
        next.setContent(function(){
            if(player.isAlive()&&player.getHistory('sourceDamage',function(evt){
                return evt.getParent(2)==event.parent;
            }).length>0) player.loseHp();
            delete card.nature;
        });
    },
                group:"lihuo2",
            },
            "复礼":{
                audio:"ext:风云变幻:2",
                trigger:{
                    player:"loseAfter",
                    global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter"],
                },
                frequent:true,
                filter:function (event,player){
        if(player.countCards('h')) return false;
        var evt=event.getl(player);
        return evt&&evt.player==player&&evt.hs&&evt.hs.length>0;
    },
                content:function (){
        player.draw();
    },
                ai:{
                    threaten:0.8,
                    effect:{
                        target:function (card){
                if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
            },
                    },
                    noh:true,
                    skillTagFilter:function (player,tag){
            if(tag=='noh'){
                if(player.countCards('h')!=2) return false;
            }
        },
                },
            },
            "昭心":{
                audio:"ext:风云变幻:2",
                trigger:{
                    player:["phaseZhunbeiBegin","phaseJieshuBegin"],
                },
                frequent:true,
                preHidden:true,
                content:function (){
        "step 0"
        if(event.cards==undefined) event.cards=[];
        var next=player.judge(function(card){
            if(get.color(card)=='red') return 1.5;
            return -1.5;
        });
        next.judge2=function(result){
            return result.bool;
        };
        if(get.mode()!='guozhan'&&!player.hasSkillTag('rejudge')) next.set('callback',function(){
            if(event.judgeResult.color=='red'&&get.position(card,true)=='o') player.gain(card,'gain2');
        });
        else next.set('callback',function(){
            if(event.judgeResult.color=='red') event.getParent().orderingCards.remove(card);
        });
        "step 1"
        if(result.judge>0){
            event.cards.push(result.card);
            player.chooseBool('是否再次发动【昭心】？').set('frequentSkill','luoshen');
        }
        else{
            for(var i=0;i<event.cards.length;i++){
                if(get.position(event.cards[i],true)!='o'){
                    event.cards.splice(i,1);i--;
                }
            }
            if(event.cards.length){
                player.gain(event.cards,'gain2');
            }
            event.finish();
        }
        "step 2"
        if(result.bool){
            event.goto(0);
        }
        else{
            if(event.cards.length){
                player.gain(event.cards,'gain2');
            }
        }
    },
            },
            "终焉":{
                audio:"ext:风云变幻:2",
                frequent:true,
                trigger:{
                    player:"dying",
                },
                content:function () {
        'step 0'
        var cards = get.cards(4);
        var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 4, false);
        guanXing.doubleSwitch = true;
        guanXing.caption = '【称象】';
        guanXing.header2 = '获得的牌';
        guanXing.callback = function(){
            var num = 0;
            for (var i = 0; i < this.cards[1].length; i++) {
                num += get.number(this.cards[1][i]);
            }
            
            return num > 0 && num <= 13;
        };
        
        game.broadcast(function(player, cards, callback){
            if (!window.decadeUI) return;
            var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 4, false);
            guanXing.caption = '【称象】';
            guanXing.header2 = '获得的牌';
            guanXing.callback = callback;
        }, player, cards, guanXing.callback);
        
        var player = event.player;
        event.switchToAuto = function(){
            var cards = guanXing.cards[0];
            var num, sum, next;
            var index = 0;
            var results = [];
            
            for (var i = 0; i < cards.length; i++) {
                num = 0;
                sum = 0;
                next = i + 1;
                for (var j = i; j < cards.length; j++) {
                    if (j != i && j < next)
                        continue;
                    
                    num = sum + get.number(cards[j]);
                    if (num <= 13) {
                        sum = num;
                        if (!results[index]) results[index] = [];
                        results[index].push(cards[j]);
                    }
                    
                    if (j >= cards.length - 1) index++;
                }
                
                if (results[index] && results[index].length == cards.length) break;
            }
            
            var costs = [];
            for (var i = 0; i < results.length; i++) {
                costs[i] = {
                    value: 0,
                    index: i,
                };
                for (var j = 0; j < results[i].length; j++) {
                    costs[i].value += get.value(results[i][j], player);
                    // 如果有队友且有【仁心】且血量不低，优先选择装备牌
                    if (player.hasFriend() && player.hasSkill('renxin') && get.type(results[i][j]) == 'equip' && player.hp > 1) {
                        costs[i].value += 5;
                    }
                    
                    // 如果自己有延时牌且没有无懈可击，优先选择无懈可击
                    if (player.node.judges.childNodes.length > 0 && !player.hasWuxie() && results[i][j] == 'wuxie') {
                        costs[i].value += 5;
                    }
                }
            }
            
            costs.sort(function(a, b) {
                return b.value - a.value;
            });
            
            var time = 500;
            var result = results[costs[0].index];
            
            for (var i = 0; i < result.length; i++) {
                setTimeout(function(move, finished){
                    guanXing.move(move, guanXing.cards[1].length, 1);
                    if (finished) guanXing.finishTime(1000);
                }, time, result[i], (i >= result.length - 1));
                time += 500;
            }
        };
        
        if (event.isOnline()) {
            event.player.send(function(){
                if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
            }, event.player);
            
            event.player.wait();
            decadeUI.game.wait();
        } else if (!event.isMine()) {
            event.switchToAuto();
        }
        'step 1'
        if (event.result && event.result.bool) {
            game.cardsDiscard(event.cards1);
            player.gain(event.cards2, 'log', 'gain2');
        }
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card, player, target) {
                if (get.tag(card, 'damage')) {
                    if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                    if (!target.hasFriend()) return;
                    if (target.hp >= 4) return [1, 2];
                    if (target.hp == 3) return [1, 1.5];
                    if (target.hp == 2) return [1, 0.5];
                }
            },
                    },
                },
            },
        },
        translate:{
            "潜龙":"潜龙",
            "潜龙_info":"锁定技，当你横置时，取消之。你不能成为延时类锦囊的目标。你不能成为其他角色拼点的目标。",
            "制略":"制略",
            "制略_info":"锁定技，其他角色的手牌上限-1。你手牌区的装备牌均视为【无中生有】。",
            "风吟":"风吟",
            "风吟_info":"转换技，出牌阶段限一次，阴：你可以摸一张牌，然后弃置两张手牌。阳：你可以摸两张牌，然后弃置一张手牌。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制。",
            "匿心":"匿心",
            "匿心_info":"当你成为其他角色使用牌的目标后：①若其体力值大于你，你摸三张牌。②若其体力值等于你，你摸两张牌。③若其体力值小于你，你摸一张牌。",
            "魂杀":"魂杀",
            "魂杀_info":"当你使用【杀】指定目标后，你可以将其的至多X张牌置于其武将牌上（X为其体力值），然后其于当前回合结束时获得这些牌。当你因执行【杀】的效果而对一名角色造成伤害时，若该角色的手牌数和装备区内的牌数均不大于你，则此伤害+1。",
            "神羽":"神羽",
            "神羽_info":"锁定技，若你的手牌数为全场唯一最多，则当你造成或受到伤害时，此伤害+1。",
            "风姿":"风姿",
            "风姿_info":"锁定技，当你使用牌时，所有距离为1的其他角色不能响应。",
            "却敌":"却敌",
            "却敌_info":"当你使用【杀】造成伤害后该角色将其武将牌翻面。",
            "急进":"急进",
            "急进_info":"一名角色的回合结束时，若你本回合内杀死过角色，则你可以进行一个额外的回合。",
            "影袭":"影袭",
            "影袭_info":"回合结束时，你可以对至多X名其他角色各造成1点伤害（X为你本回合跳过的阶段数）。",
            "击虚":"击虚",
            "击虚_info":"锁定技，当你使用【杀】指定目标后，若你不在其攻击范围内，则此杀伤害+1且无视其防具。若其因执行此【杀】的效果受到伤害而进入濒死状态，则其不能使用【桃】直到此濒死事件结算结束。",
            "贯日":"贯日",
            "贯日_info":"出牌阶段，你使用的第一张牌无距离限制；当你于回合内使用牌时，你可以令此牌不能被响应，若如此做，本回合内你不能再使用牌",
            "御风":"御风",
            "御风_info":"锁定技，其他角色计算与你的距离时+1。",
            "涯角":"涯角",
            "涯角_info":"当你成为一名角色牌的目标后你可以对该角色使用一张牌，若此牌对其造成伤害，则该角色的牌失效。若失效的为黑色牌，则你摸一张牌",
            "攻心":"攻心",
            "攻心_info":"出牌阶段，你可以令一名其他角色选择一项：1.令你随机获得其区域内的一张牌，本回合内你不能对其使用牌。2.令你此回合内对其使用牌没有次数与距离限制。",
            "韬略":"韬略",
            "韬略_info":"当你失去牌后，你可以判定，若结果为：黑色，你弃置一名角色区域里的一张牌；红色，你选择一名角色，其摸一张牌，若其是〖先辅〗选择的角色，改为其摸两张牌。",
            "龙怒":"龙怒",
            "龙怒_info":"转换技，锁定技，阴：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你的红色手牌均视为火【杀】且无距离限制。阳：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你的锦囊牌均视为雷【杀】且无使用次数限制。",
            "结营":"结营",
            "结营_info":"锁定技，游戏开始时或当你的武将牌重置时，你横置；所有已横置的角色手牌上限+2；结束阶段，你横置一名其他角色。",
            "昭烈":"昭烈",
            "昭烈_info":"准备阶段，你可以对一名体力小于或等于你的其他角色造成0～2点随机伤害。",
            "激昂":"激昂",
            "激昂_info":"每当你使用（指定目标后）或被使用（成为目标后）一张【决斗】或红色的【杀】时，你可以摸一张牌。",
            "定音":"定音",
            "定音_info":"当一名角色于其出牌阶段使用【杀】时，你可弃置一张牌令此【杀】不计入出牌阶段使用次数，若此【杀】为红色，你摸一张牌。",
            "烈阳":"烈阳",
            "烈阳_info":"当你声明使用普通【杀】时，你可以将此【杀】改为火【杀】。若以此法使用的【杀】造成了伤害，则此【杀】结算后你失去1点体力；你使用火【杀】选择目标后，可以额外指定一个目标。",
            "复礼":"复礼",
            "复礼_info":"当你失去最后的手牌时，你可以摸两张牌。",
            "昭心":"昭心",
            "昭心_info":"准备阶段和结束阶段，你可以判定。若结果为红色，你获得判定牌。你可重复此流程，直到出现黑色的判定结果。",
            "终焉":"终焉",
            "终焉_info":"当你进入濒死时，你可以亮出牌堆顶的四张牌。然后获得其中任意数量点数之和不大于13的牌",
        },
    },
    intro:"",
    author:"无名玩家",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["司马昭.jpg"],"card":[],"skill":[]}}};