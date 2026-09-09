import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"阳光包",content:function (config,pack){
    
},precontent:function (){
			 
},help:{},config:{},package:{
    character:{
        character:{
            "lyz_zhaoyun":["male","shu",4,["lyzlongying","lyzhunyou","lyzcuizhen","lyzlongcheng"],["des:“阳光包”武将。定位：爽将、全能"]],
            "lyz_shen_diaochan":["female","shen",3,["lyzhuanmei","lyzyuhun","lyzshangyue"],["des:“阳光包”武将。定位：控制、生存"]],
            "lyz_shen_zhangliao":["male","shen",4,["lyzduorui","lyzzhiti"],["des:“阳光包”武将。定位：娱乐、控制、输出"]],
            "lyz_gaodayihao":["male","shen",1,["lyzjuejing","lyzlonghun","lyzzhanjiang"],["des:“阳光包”武将。定位：爽将、全能"]],
            "lyz_zhugeliang":["male","shu",3,["lyzwendao","lyzzhaoce","lyzkuitian"],["des:“阳光包”武将。定位：辅助、过牌"]],
            "lyz_mayunlu":["female","shu",4,["lyzfengyin","lyzwufang"],["des:“阳光包”武将。定位：过牌、输出、辅助"]],
            "lyz_zhouyu":["male","wu",4,["lyzxinlve","lyzyanjie"],["des:“阳光包”武将。定位：控制、爆发"]],
            "lyz_shen_lvbu":["male","shen",6,["lyzlihuo","lyzkuipo"],["des:“阳光包”武将。定位：输出、爆发、控制"]],
        },
        translate:{
            "lyz_zhaoyun":"☆赵云",
            "lyz_shen_diaochan":"☆神貂蝉",
            "lyz_shen_zhangliao":"☆神张辽",
            "lyz_gaodayihao":"☆高达一号",
            "lyz_zhugeliang":"☆诸葛亮",
            "lyz_mayunlu":"☆马云騄",
            "lyz_zhouyu":"☆周瑜",
            "lyz_shen_lvbu":"☆神吕布",
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
            lyzlongying:{
                audio:"ext:阳光包:2",
                group:["lyzlongying_sha","lyzlongying_shan","lyzlongying_tao","lyzlongying_jiu"],
                ai:{
                    save:true,
                    respondSha:true,
                    respondShan:true,
                },
            },
            "lyzlongying_sha":{
                audio:"lyzlongying",
                enable:["chooseToRespond","chooseToUse"],
                filterCard:function (card){
        if(get.type(card)!='basic') return false;
                    return get.color(card)=='red';
                },
                viewAsFilter:function (player){
   return player.countCards('h',{color:'red'},{type:'basic'})>0;
    },
                viewAs:{
                    name:"sha",
                    nature:"fire",
                },
                ai:{
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:function (item){
            if(_status.event.player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))) return 3.1;
            return 3;
        },
                    result:{
                        target:function (player,target,card,isLink){
                if(!isLink&&player.hasSkill('jiu')){
                    if(!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })){
                     if(get.attitude(player,target)>0){
                         return -7;
                     }
                     else{
                         return -4;
                     }
                    }
                    return -0.5;
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
            "lyzlongying_shan":{
                audio:"lyzlongying",
                enable:["chooseToRespond","chooseToUse"],
                filterCard:function (card){
           if(get.type(card)!='basic') return false;
                    return get.color(card)=='black';
                },
                viewAsFilter:function (player){
       return player.countCards('h',{color:'black'},{type:'basic'})>0;
                },
                viewAs:{
                    name:"shan",
                },
                ai:{
                    order:3,
                    basic:{
                        useful:[7,2],
                        value:[7,2],
                    },
                    result:{
                        player:1,
                    },
                },
            },
            "lyzlongying_tao":{
                audio:"lyzlongying",
                enable:["chooseToRespond","chooseToUse"],
                filterCard:function (card){
           if(get.type(card)!='basic') return false;
                    return get.color(card)=='red';
                },
                viewAsFilter:function (player){
       return player.countCards('h',{color:'red'},{type:'basic'})>0;
                },
                viewAs:{
                    name:"tao",
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
                        target:2,
                        "target_use":function (player,target){
                            // if(player==target&&player.hp<=0) return 2;
                            if(player.hasSkillTag('nokeep',true,null,true)) return 2;
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
            "lyzlongying_jiu":{
                audio:"lyzlongying",
                enable:["chooseToRespond","chooseToUse"],
                filterCard:function (card){
           if(get.type(card)!='basic') return false;
                    return get.color(card)=='black';
                },
                viewAsFilter:function (player){
       return player.countCards('h',{color:'black'},{type:'basic'})>0;
                },
                viewAs:{
                    name:"jiu",
                },
                ai:{
                    basic:{
                        useful:function (card,i){
                            if(_status.event.player.hp>1){
                                if(i==0) return 4;
                                return 1;
                            }
                            if(i==0) return 7.3;
                            return 3;
                        },
                        value:function (card,player,i){
                            if(player.hp>1){
                                if(i==0) return 5;
                                return 1;
                            }
                            if(i==0) return 7.3;
                            return 3;
                        },
                    },
                    order:function (){
                        return get.order({name:'sha'})+0.2;
                    },
                    result:{
                        target:function (player,target){
                            if(target&&target.isDying()) return 2;
                            if(target&&!target.isPhaseUsing()) return 0;
                            if(lib.config.mode=='stone'&&!player.isMin()){
                                if(player.getActCount()+1>=player.actcount) return 0;
                            }
                            var shas=player.getCards('h','sha');
                            if(shas.length>1&&(player.getCardUsable('sha')>1||player.countCards('h','zhuge'))){
                                return 0;
                            }
                            shas.sort(function(a,b){
                                return get.order(b)-get.order(a);
                            })
                            var card;
                            if(shas.length){
                                for(var i=0;i<shas.length;i++){
                                    if(lib.filter.filterCard(shas[i],target)){
                                        card=shas[i];break;
                                    }
                                }
                            }
                            else if(player.hasSha()&&player.needsToDiscard()){
                                if(player.countCards('h','hufu')!=1){
                                    card={name:'sha'};
                                }
                            }
                            if(card){
                                if(game.hasPlayer(function(current){
                                    return (get.attitude(target,current)<0&&
                                        target.canUse(card,current,true,true)&&
                                        !current.hasSkillTag('filterDamage',null,{
                                            player:player,
                                            card:card,
                                            jiu:true,
                                        })&&
                                        get.effect(current,card,target)>0);
                                })){
                                    return 1;
                                }
                            }
                            return 0;
                        },
                    },
                    tag:{
                        save:1,
                    },
                },
            },
            lyzhunyou:{
                audio:"ext:阳光包:2",
                trigger:{
                    player:"loseAfter",
                },
                frequent:true,
                filter:function (event,player){
                     return player!=_status.currentPhase&&event.hs&&event.hs.length>0&&['useCard','respond'].contains(event.getParent().name);
                },
                content:function (){
                     "step 0"
                     event.card=get.cards()[0];
                     game.cardsGotoOrdering(event.card);
                     event.videoId=lib.status.videoId++;
                     var judgestr=get.translation(player)+'发动了【魂佑】';
                     game.addVideo('judge1',player,[get.cardInfo(event.card),judgestr,event.videoId]);
                     game.broadcastAll(function(player,card,str,id,cardid){
                          var event;
                          if(game.online){
                               event={};
                          }
                          else{
                               event=_status.event;
                          }
                          if(game.chess){
                               event.node=card.copy('thrown','center',ui.arena).animate('start');
                          }
                          else{
                               event.node=player.$throwordered(card.copy(),true);
                          }
                          if(lib.cardOL) lib.cardOL[cardid]=event.node;
                          event.node.cardid=cardid;
                          event.node.classList.add('thrownhighlight');
                          ui.arena.classList.add('thrownhighlight');
                          event.dialog=ui.create.dialog(str);
                          event.dialog.classList.add('center');
                          event.dialog.videoId=id;
                     },player,event.card,judgestr,event.videoId,get.id());

                     game.log(player,'展示了',event.card);
                     game.delay(2);
                     if(get.type(event.card,'trick')!=get.type(trigger.getParent().card,'trick')){
                          player.chooseTarget('选择获得此牌的角色').set('ai',function(target){
                               var att=get.attitude(_status.event.player,target);
                               if(_status.event.du){
                                    if(target.hasSkillTag('nodu')) return 0;
                                    return -att;
                               }
                               if(att>0){
                                    return att+Math.max(0,5-target.countCards('h'));
                               }
                               return att;
                          }).set('du',event.card.name=='du');
                     }
                    else{
                          event.recoverbool=true;
                          player.chooseTarget('是否令一名角色回复1点体力？',function(card,player,target){
                               return target.hp<target.maxHp;
                          });
                     }
                     "step 1"
                     if(event.recoverbool){
                          if(result.bool){
                               player.line(result.targets[0],'green');
                               result.targets[0].recover();
                          }
                          event.dialog.close();
                          game.addVideo('judge2',null,event.videoId);
                          game.addVideo('deletenode',player,[get.cardInfo(event.node)]);
                          event.node.delete();
                          game.broadcast(function(id,card){
                               var dialog=get.idDialog(id);
                               if(dialog){
                                    dialog.close();
                               }
                               if(card.clone){
                                    card.clone.delete();
                               }
                               ui.arena.classList.remove('thrownhighlight');
                          },event.videoId,event.card);
                          ui.arena.classList.remove('thrownhighlight');
                     }
                     else if(result.targets){
                          event.dialog.close();
                          game.addVideo('judge2',null,event.videoId);
                          player.line(result.targets,'green');
                          result.targets[0].gain(event.card,'log');
                          event.node.moveDelete(result.targets[0]);
                          game.addVideo('gain2',result.targets[0],[get.cardInfo(event.node)]);
                          ui.arena.classList.remove('thrownhighlight');
                          game.broadcast(function(card,target,id){
                               var dialog=get.idDialog(id);
                               if(dialog){
                                    dialog.close();
                               }
                               ui.arena.classList.remove('thrownhighlight');
                               if(card.clone){
                                    card.clone.moveDelete(target);
                               }
                          },event.card,result.targets[0],event.videoId);
                     }
                     else{
                          game.addVideo('deletenode',player,[get.cardInfo(event.node)]);
                          event.node.delete();
                          game.broadcast(function(id){
                               var dialog=get.idDialog(id);
                               if(dialog){
                                    dialog.close();
                               }
                               if(card.clone){
                                    card.clone.delete();
                               }
                               ui.arena.classList.remove('thrownhighlight');
                          },event.videoId,event.card);
                          event.dialog.close();
                          game.addVideo('judge2',null,event.videoId);
                          ui.arena.classList.remove('thrownhighlight');
                     }
                },
                ai:{
                    effect:{
                        target:function (card,player,target){
                               if(get.tag(card,'respond')&&target.countCards('h')>1) return [1,0.2];
                          },
                    },
                },
            },
            lyzcuizhen:{
                shaRelated:true,
                audio:"ext:阳光包:2",
                trigger:{
                    player:"useCardToPlayered",
                },
                check:function (event,player){
        return get.attitude(player,event.target)<0;
    },
                filter:function (event,player){
        return event.card.name=='sha';
    },
                logTarget:"target",
                content:function (){
        "step 0"
        player.judge(function(){return 0});
        if(!trigger.target.hasSkill('fengyin')){
            trigger.target.addTempSkill('fengyin');
        }
        "step 1"
        var suit=get.suit(result.card);
        var target=trigger.target;
        var num=target.countCards('h','shan');
        target.chooseCard('请交给'+get.translation(player)+'一张'+get.translation(suit)+'牌，否则不能使用或打出手牌直至回合结束','he',function(card){
            return get.suit(card)==_status.event.suit;
        }).set('ai',function(card){
            var num=_status.event.num;
            if(num==0) return 0;
            if(card.name=='shan') return num>1?2:0;
            return 8-get.value(card);
        }).set('num',num).set('suit',suit);
        "step 2"
        if(result.bool){
            var cards=result.cards;
            player.gain(cards,trigger.target,'giveAuto');
        }
    
        else{
            trigger.target.addTempSkill('lyzcuizhen2');
        }
    },
                ai:{
                    ignoreSkill:true,
                    skillTagFilter:function (player,tag,arg){
            if(!arg||arg.isLink||!arg.card||arg.card.name!='sha') return false;
            if(!arg.target||get.attitude(player,arg.target)>=0) return false;
            if(!arg.skill||!lib.skill[arg.skill]||lib.skill[arg.skill].charlotte||get.is.locked(arg.skill)||!arg.target.getSkills(true,false).contains(arg.skill)) return false;
        },
                },
            },
            "lyzcuizhen2":{
                mark:true,
                marktext:"摧",
                mod:{
                    "cardEnabled2":function (card){
            if(get.position(card)=='h') return false;
        },
                },
                intro:{
                    content:"不能使用或打出手牌",
                },
            },
            lyzlongcheng:{
                audio:"ext:阳光包:2",
                trigger:{
                    global:"phaseJieshuBegin",
                },
                forced:true,
                filter:function (event,player){
                    return player.getHistory('useCard',function(card){
                        return get.type(card.card)=='basic';
                    }).length>0||player.getHistory('respond',function(card){
                        return get.type(card.card)=='basic';
                    }).length>0;
                },
                content:function (){
                    'step 0'
                    var list=["huosha","leisha","sha","tao","jiu"];
                    player.chooseButton(['龙骋：选择要使用的牌，或点取消摸两张牌',[list.map(function(name){
                        return ['基本','',name];
                    }),'vcard']],function(button){
                        return _status.event.player.getUseValue({name:button.link[2],nature:button.link[3]});
                    },function(button){
                        return _status.event.player.hasUseTarget({name:button.link[2],nature:button.link[3]});
                    });
                    'step 1'
                    if(!result.bool) player.draw(2);
                    else {
                    player.chooseUseTarget({name:result.links[0][2],isCard:true,nature:result.links[0][3]});
                    player.draw();
                          }
                },
            },
            lyzshangyue:{
                audio:"ext:阳光包:2",
                forced:true,
                trigger:{
                    player:["phaseJieshuBegin","dying"],
                },
                filter:function (event,player){
var num=game.countPlayer(function(current){
    return current.hasMark("lyzhuanmei")&&current!=player;
        });
    return num>0;
    },
                content:function (){
var num=game.countPlayer(function(current){
    return current.hasMark("lyzhuanmei")&&current!=player;
        });
player.loseMaxHp();
player.recover(player.maxHp-player.hp);
player.draw(num)

    },
            },
            "lyzyuhun2":{
                trigger:{
                    player:["phaseAfter","dieAfter"],
                    global:"phaseBefore",
                },
                lastDo:true,
                charlotte:true,
                forceDie:true,
                forced:true,
                silent:true,
                content:function (){
player.removeSkill('lyzyuhun2');
    },
                onremove:function (player){
        if(player==game.me){
            if(!game.notMe) game.swapPlayerAuto(player._trueMe)
            else delete game.notMe;
            if(_status.auto) ui.click.auto();
        }
        delete player._trueMe;
    },
                popup:false,
            },
            lyzyuhun:{
                audio:"ext:阳光包:2",
                trigger:{
                    global:"phaseBeginStart",
                },
                filter:function (event,player){
                return !event.player.hasMark("lyzhuanmei")&&event.player!=player&&player.countCards('hej');
    },
                content:function (){
        "step 0"
        var controls=[];
    if(player.countCards("h")){
        controls.push('手牌区');
                }
    if(player.countCards("e")){
        controls.push('装备区');
                }
    if(player.countCards("j")){
        controls.push('判定区');
                }
    player.chooseControl(controls);
         "step 1"
     event.control=result.control;
        switch(event.control){
            case '手牌区':player.discard(player.getCards('h'));break;
            case '装备区':player.discard(player.getCards('e'));break;
            case '判定区':player.discard(player.getCards('j'));break;
        }
        "step 2"
            trigger.player.addMark("lyzhuanmei");
            trigger.player.loseHp();
            trigger.player._trueMe=player;
            game.addGlobalSkill('autoswap');
            if(trigger.player==game.me){
            game.notMe=true;
             if(!_status.auto) ui.click.auto();
       }
            trigger.player.addSkill('lyzyuhun2');
      },
            },
            "lyzhuanmei2":{
                audio:"lyzhuanmei",
                forced:true,
                trigger:{
                    global:["dieAfter","gainMaxHpEnd","loseMaxHpEnd"],
                },
                filter:function (event,player){
return event.player.hasMark("lyzhuanmei");
    },
                content:function (){
         trigger.player.removeMark("lyzhuanmei");
         player.gainMaxHp();
    },
            },
            lyzhuanmei:{
                group:"lyzhuanmei2",
                marktext:"魅",
                mark:true,
                intro:{
                    name:"幻魅",
                    content:"mark",
                },
                locked:true,
                audio:"ext:阳光包:2",
                trigger:{
                    global:"gameDrawAfter",
                    player:"enterGame",
                },
                forced:true,
                content:function (){
        player.addMark("lyzhuanmei");
    },
            },
            lyzduorui:{
                audio:"ext:阳光包:2",
                init:function (player,skill){
          if(!player.storage.lyzduorui) player.storage.lyzduorui=[];
                },
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
                    return player.canCompare(target);
                },
                filter:function (event,player){
                    return player.countCards('h')>0;
                },
                bannedList:["bifa","buqu","gzbuqu","songci","funan","xinfu_guhuo","reguhuo","huashen","rehuashen","old_guhuo","shouxi","xinpojun","taoluan","xintaoluan","yinbing","xinfu_yingshi","zhenwei","zhengnan","xinzhengnan","zhoufu"],
                content:function (){
                    "step 0"
                    player.chooseToCompare(target);
                    "step 1"
                    if(result.bool){
                        event.goto(2);
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    player.chooseSkill(target,function(info,skill){
               if(!info||info.charlotte||info.zhuSkill||info.juexingji||info.limited||(info.unique&&!info.gainable)||lib.skill.lyzduorui.bannedList.contains(skill)||player.hasSkill(skill)) return false;
                        return true;
                    });
                    "step 3"
                    if(result.bool){
                    player.loseHp();
                    player.draw();
              var skill=result.skill;
              player.addSkill(skill);
              target.storage.lyzduorui=[result.skill];
              target.addTempSkill('lyzduorui2',{player:'phaseAfter'});
              player.popup(skill);
                    }
                "step 4"
               player.chooseBool('是否令'+get.translation(target)+'变更武将牌？');
                "step 5"
                if(result.bool){
                       var rank=get.rank(target,true);
                    var list=get.gainableCharacters(true);
                    var choice=[];
                    for(var i=0;i<list.length;i++){
                        if(get.rank(list[i],true)==rank+1){
                            choice.push(list[i]);
                        }
                    }
                    if(!choice.length){
                        for(var i=0;i<list.length;i++){
                            if(get.rank(list[i],true)==rank){
                                choice.push(list[i]);
                            }
                        }
                    }
                    if(choice.length){    
                           var maxHp=target.maxHp;
                           var hp=target.hp;            
                        var name=choice.randomGet();
                        target.reinit(target.name,name);
                        target.maxHp=maxHp;
                        target.hp=hp;
                        target.update();
                        game.triggerEnter(target);
                    }
                    }
              
            
    },
            },
            "lyzduorui2":{
                init:function (player,skill){
                    player.disableSkill(skill,player.storage.lyzduorui);
                },
                onremove:function (player,skill){
                    player.enableSkill(skill);
                },
                locked:true,
                mark:true,
                charlotte:true,
                intro:{
                    content:function (storage,player,skill){
                        var list=[];
                        for(var i in player.disabledSkills){
                            if(player.disabledSkills[i].contains(skill)) list.push(i);
                        };
                        if(list.length){
                            var str='失效技能：';
                            for(var i=0;i<list.length;i++){
                                if(lib.translate[list[i]+'_info']) str+=get.translation(list[i])+'、';
                            };
                            return str.slice(0,str.length-1);
                        };
                    },
                },
            },
            lyzzhiti:{
                audio:"ext:阳光包:2",
                group:["lyzzhiti_1","lyzzhiti_2"],
                subSkill:{
                    "1":{
                        audio:"lyzzhiti",
                        trigger:{
                            player:"phaseZhunbeiBegin",
                        },
                        filter:function (event,player){
    return player.hp<player.maxHp;
            },
                        direct:true,
                        content:function (){
            "step 0"
            event.num=player.maxHp-player.hp;
            "step 1"
            player.chooseTarget('请选择至多'+get.cnNumber(event.num)+'名有牌的角色，弃置这些角色各自区域里的一张牌',[1,event.num],function(card,player,target){
            return target.countCards('hej')>0;
               }).set('ai',function(target){
            return -get.attitude(_status.event.player,target)+0.5;
        });
        "step 2"
        if(result.bool&&result.targets){
            player.logSkill("lyzzhiti");
            player.line(result.targets,'green');
            event.targets=result.targets;
            event.targets.sort(lib.sort.seat);
            event.discarded=0;
        }
            else{
              event.finish();
        }
           "step 3"
           if(player.isAlive()&&event.targets.length){
            player.discardPlayerCard(event.targets.shift(),'hej',true);
                    }
            else event.finish();
        "step 4"
        if(result.bool){
            event.discarded+=result.cards.length;
            }
           if(event.targets.length) event.goto(3);
                      
        },
                        sub:true,
                    },
                    "2":{
                        audio:"lyzzhiti",
                        trigger:{
                            player:"phaseJieshuBegin",
                        },
                        filter:function (event,player){
    return player.hp<player.maxHp;
            },
                        direct:true,
                        content:function (){
            "step 0"
            event.num=player.maxHp-player.hp;
            "step 1"
            player.chooseTarget('请选择至多'+get.cnNumber(event.num)+'名其他角色，视为对这些角色使用【杀】',[1,event.num],function(card,player,target){
            return target!=player;
               }).set('ai',function(target){
            return -get.attitude(_status.event.player,target)+0.5;
        });
        "step 2"
        if(result.bool&&result.targets){
        player.logSkill("lyzzhiti");
            var length=result.targets.length;
                          for(var i=0;i<length;i++){
                               result.targets[i].addTempSkill('lyzzhiti2');
                          }
        }
            else{
              event.finish();
        }
        "step 3"
        var list=game.filterPlayer(function(current){
                    return current.hasSkill("lyzzhiti2");
                              });                                     
                    player.useCard({name:"sha",isCard:true},list);           
       },
                        sub:true,
                    },
                },
            },
            "lyzzhiti2":{
            },
            lyzjuejing:{
                group:["lyzjuejing_1","lyzjuejing_2","lyzjuejing_3"],
                audio:"ext:阳光包:true",
                subSkill:{
                    "1":{
                        audio:"lyzjuejing",
                        trigger:{
                            player:"phaseDrawBefore",
                        },
                        forced:true,
                        content:function (){
                        trigger.cancel();
                     },
                        ai:{
                            noh:true,
                        },
                        sub:true,
                    },
                    "2":{
                        audio:false,
                        trigger:{
                            player:"loseEnd",
                        },
                        forced:true,
                        filter:function (event,player){
                        return player.countCards('h')<4;
                    },
                        content:function (){
                        player.draw(4-player.countCards('h'));
                        },
                        sub:true,
                    },
                    "3":{
                        audio:false,
                        trigger:{
                            player:"gainEnd",
                        },
                        forced:true,
                        filter:function (event,player){
                        return player.countCards('h')>4;
                    },
                        content:function (){
                        player.chooseToDiscard(player.countCards('h')-4,true);
                        },
                        sub:true,
                    },
                },
            },
            lyzlonghun:{
                group:["lyzlonghun_sha","lyzlonghun_shan","lyzlonghun_tao","lyzlonghun_wuxie","lyzlonghun_num","lyzlonghun_discard"],
                ai:{
                    skillTagFilter:function (player,tag){
                        switch(tag){
                            case 'respondSha':{
                                if(player.countCards('he',{suit:'diamond'})==0) return false;
                                break;
                            }
                            case 'respondShan':{
                                if(player.countCards('he',{suit:'club'})==0) return false;
                                break;
                            }
                            case 'save':{
                                if(player.countCards('he',{suit:'heart'})==0) return false;
                                break;
                            }
                        }
                    },
                    save:true,
                    respondSha:true,
                    respondShan:true,
                    threaten:1.8,
                },
                subSkill:{
                    num:{
                        trigger:{
                            player:"useCard",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event){
                            var evt=event;
                            return (evt.skill=='lyzlonghun_sha'||evt.skill=='lyzlonghun_tao'||(['sha','tao'].contains(evt.card.name)&&evt.skill=='lyzlonghun'))&&evt.cards&&evt.cards.length==2;
                        },
                        content:function (){
                            trigger.baseDamage++;
                        },
                        sub:true,
                    },
                    discard:{
                        trigger:{
                            player:["useCardAfter","respondAfter"],
                        },
                        forced:true,
                        popup:false,
                        logTarget:function (){
                            return _status.currentPhase;
                        },
                        autodelay:function (event){
                            return event.name=='respond'?0.5:false;
                        },
                        filter:function (evt,player){
                            return (evt.skill=='lyzlonghun_shan'||evt.skill=='lyzlonghun_wuxie'||(['shan','wuxie'].contains(evt.card.name)&&evt.skill=='lyzlonghun'))&&
                                evt.cards&&evt.cards.length==2&&_status.currentPhase&&_status.currentPhase!=player&&_status.currentPhase.countDiscardableCards(player,'he');
                        },
                        content:function (){
                            player.line(_status.currentPhase,'green');
                            player.discardPlayerCard(_status.currentPhase,'he',true);
                        },
                        sub:true,
                    },
                },
            },
            "lyzlonghun_tao":{
                audio:"ext:阳光包:true",
                enable:["chooseToUse","chooseToRespond"],
                prompt:function (){
                    return '将至多两张红桃牌当【桃】使用';
                },
                position:"he",
                check:function (card,event){
                    if(ui.selected.cards.length) return 0;
                    return 10-get.value(card);
                },
                selectCard:[1,2],
                viewAs:{
                    name:"tao",
                },
                filter:function (event,player){
                    return player.countCards('he',{suit:'heart'})>0;
                },
                filterCard:function (card){
                    return get.suit(card)=='heart';
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
                        target:2,
                        "target_use":function (player,target){
                            // if(player==target&&player.hp<=0) return 2;
                            if(player.hasSkillTag('nokeep',true,null,true)) return 2;
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
            "lyzlonghun_sha":{
                audio:"ext:阳光包:true",
                enable:["chooseToUse","chooseToRespond"],
                prompt:function (){
        return '将至多两张方块牌当火【杀】使用或打出';
    },
                position:"he",
                check:function (card,event){
        if(ui.selected.cards.length) return 0;
        return 10-get.value(card);
    },
                selectCard:[1,2],
                viewAs:{
                    name:"sha",
                    nature:"fire",
                },
                filter:function (event,player){
        return player.countCards('he',{suit:'diamond'})>0;
    },
                filterCard:function (card){
        return get.suit(card)=='diamond';
    },
                ai:{
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:function (item,player){
                        if(player.hasSkillTag('presha',true,null,true)) return 10;
                        if(lib.linked.contains(get.nature(item))) return (player.getCardUsable('sha')>1?3:3.1);
                        return 3.05;
                    },
                    result:{
                        target:function (player,target,card,isLink){
                            if(!isLink&&player.hasSkill('jiu')){
                                if(!target.hasSkillTag('filterDamage',null,{
                                    player:player,
                                    card:card,
                                    jiu:true,
                                })){
                                 if(get.attitude(player,target)>0){
                                     return -7;
                                 }
                                 else{
                                     return -4;
                                 }
                                }
                                return -0.5;
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
            "lyzlonghun_wuxie":{
                audio:"ext:阳光包:true",
                enable:["chooseToUse","chooseToRespond"],
                prompt:function (){
        return '将至多两张黑桃牌当【无懈可击】使用';
    },
                position:"he",
                check:function (card,event){
        if(ui.selected.cards.length) return 0;
        return 7-get.value(card);
    },
                selectCard:[1,2],
                viewAs:{
                    name:"wuxie",
                },
                viewAsFilter:function (player){
        return player.countCards('he',{suit:'spade'})>0;
    },
                filterCard:function (card){
        return get.suit(card)=='spade';
    },
                ai:{
                    basic:{
                        useful:[6,4],
                        value:[6,4],
                    },
                    result:{
                        player:1,
                    },
                    expose:0.2,
                },
            },
            "lyzlonghun_shan":{
                audio:"ext:阳光包:true",
                enable:["chooseToUse","chooseToRespond"],
                prompt:function (){
                    return '将至多两张梅花牌当【闪】使用或打出';
                },
                position:"he",
                check:function (card,event){
                    if(ui.selected.cards.length) return 0;
                    return 10-get.value(card);
                },
                selectCard:[1,2],
                viewAs:{
                    name:"shan",
                },
                filter:function (event,player){
                    return player.countCards('he',{suit:'club'})>0;
                },
                filterCard:function (card){
                    return get.suit(card)=='club';
                },
                ai:{
                    order:3,
                    basic:{
                        useful:[7,2],
                        value:[7,2],
                    },
                    result:{
                        player:1,
                    },
                },
            },
            lyzzhanjiang:{
                audio:"ext:阳光包:1",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                content:function (){
                    var card=get.cardPile('qinggang','field');
                    if(card){
                        player.gain(card,'gain2','log');
                    }
                },
            },
            lyzwendao:{
                group:"lyzwendao_1",
                audio:"ext:阳光包:2",
                trigger:{
                    player:["useCard","respond"],
                },
                forced:true,
                filter:function (event,player){
        return get.type(event.card)=='basic'&&!player.hasSkill("lyzwendao_2");
    },
                content:function (){
        "step 0"
        player.addTempSkill("lyzwendao_2");
        "step 1"
        player.gain(get.cardPile(function(card){
            return get.type(card,'trick')=='trick';
            }),'gain2');
    },
                subSkill:{
                    "1":{
                        audio:"lyzwendao",
                        trigger:{
                            player:"useCard",
                        },
                        usable:1,
                        forced:true,
                        filter:function (event,player){
                if(get.type(event.card)!='trick'&&get.type(event.card)!='delay') return false;
                if(player.hasSkill("lyzwendao_2")) return false;
                var hs=player.getCards('h');
                    var names=['sha','shan','tao','jiu','du'];
                    for(var i=0;i<hs.length;i++){
                        names.remove(hs[i].name);
                    }
                    if(!names.length) return false;
                    for(var i=0;i<ui.cardPile.childElementCount;i++){
                        if(names.contains(ui.cardPile.childNodes[i].name)){
                            return true;
                        }
                    }
                    return false;
            },
                        content:function (){
                "step 0"
                player.addTempSkill("lyzwendao_2");
                "step 1"
                var hs=player.getCards('h');
                    var list=[];
                    var names=['sha','shan','tao','jiu','du'];
                    for(var i=0;i<hs.length;i++){
                        names.remove(hs[i].name);
                    }
                    for(var i=0;i<ui.cardPile.childElementCount;i++){
                        if(names.contains(ui.cardPile.childNodes[i].name)){
                            list.push(ui.cardPile.childNodes[i]);
                        }
                    }
                    if(list.length){
                        player.gain(list.randomGet(),'draw');
                }
            },
                        sub:true,
                    },
                    "2":{
                        sub:true,
                    },
                },
            },
            lyzzhaoce:{
                audio:"ext:阳光包:1",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player!=target;
    },
                content:function (){
        "step 0"
        player.chooseControl('bazhen','rehuoji','rekanpo','rejizhi').set('prompt','选择获得一个技能').ai=function(){
            return ['rehuoji','bazhen','rekanpo','rejizhi'].randomGet();
        };
        "step 1"
        player.addSkill(result.control);
        "step 2"
        target.chooseControl('bazhen','rehuoji','rekanpo','rejizhi').set('prompt','选择获得一个技能').ai=function(){
            return ['rehuoji','bazhen','rekanpo','rejizhi'].randomGet();
        };
        "step 3"
        target.addTempSkill(result.control,{player:"phaseEnd"});
        target.addTempSkill("lyzzhaoce_remove",{player:"phaseEnd"});
    },
            },
            lyzkuitian:{
                mark:true,
                locked:false,
                zhuanhuanji:true,
                intro:{
                    content:function (storage,player,skill){
           if(player.storage.lyzkuitian==true) return '你可以弃置所有红色手牌（至少一张）并令一名角色处于“大雾”状态直至你下回合开始';
            return '你可以弃置所有黑色手牌（至少一张）并令一名角色处于“狂风”状态直至你下回合开始';
        },
                },
                group:["lyzkuitian_kuangfeng","lyzkuitian_remove","lyzkuitian_dawu"],
                subSkill:{
                    "1":{
                        sub:true,
                    },
                    kuangfeng:{
                        audio:"ext:阳光包:true",
                        enable:"phaseUse",
                        prompt:"你可以弃置所有黑色手牌（至少一张）并令一名角色处于“狂风”状态直至你下回合开始",
                        filterTarget:function (card,player,target){
                return true;
                },
                        filter:function (event,player){
                    return player.countCards('h',{color:'black'})>0&&
                    player.storage.lyzkuitian!=true&&
                    !player.hasSkill("lyzkuitian_1");
                },
                        content:function (){
                "step 0"
                player.storage.lyzkuitian=true,
                player.addTempSkill("lyzkuitian_1");
                "step 1"
                var cards=player.getCards('h',{color:'black'});
                player.discard(cards);
                "step 2"
                target.addSkill("kuangfeng2");
            },
                        sub:true,
                    },
                    remove:{
                        trigger:{
                            player:["phaseZhunbeiBegin","dieBegin"],
                        },
                        silent:true,
                        forced:true,
                        content:function (){
                    for(var i=0;i<game.players.length;i++){
                        if(game.players[i].hasSkill('kuangfeng2')){
                            game.players[i].removeSkill('kuangfeng2');                                          
                        }
                         if(game.players[i].hasSkill('dawu2')){
                            game.players[i].removeSkill('dawu2');
                        }
                }
            },
                        sub:true,
                        popup:false,
                    },
                    dawu:{
                        audio:"ext:阳光包:true",
                        enable:"phaseUse",
                        filterTarget:function (card,player,target){
                return true;
                },
                        prompt:"你可以弃置所有红色手牌（至少一张）并令一名角色处于“大雾”状态直至你下回合开始",
                        filter:function (event,player){
                    return player.countCards('h',{color:'red'})>0&&
                    player.storage.lyzkuitian==true&&
                    !player.hasSkill("lyzkuitian_1");;
                },
                        content:function (){
                "step 0"
                player.storage.lyzkuitian=false,
                player.addTempSkill("lyzkuitian_1");
                "step 1"
                var cards=player.getCards('h',{color:'red'});
                player.discard(cards);
                "step 2"
                target.addSkill("dawu2");
            },
                        sub:true,
                    },
                },
            },
            "lyzzhaoce_remove":{
                trigger:{
                    player:["phaseJieshuBegin","turnOverAfter"],
                },
                forced:true,
                content:function (){
                "step 0"
        for(var i=0;i<game.players.length;i++){
            if(game.players[i].hasSkill('bazhen')&&game.players[i].hasSkill('lyzzhaoce')){
                game.players[i].removeSkill('bazhen');
        }
            if(game.players[i].hasSkill('rehuoji')&&game.players[i].hasSkill('lyzzhaoce')){
                game.players[i].removeSkill('rehuoji');
        }
            if(game.players[i].hasSkill('rekanpo')&&game.players[i].hasSkill('lyzzhaoce')){
                game.players[i].removeSkill('rekanpo');
        }
            if(game.players[i].hasSkill('rejizhi')&&game.players[i].hasSkill('lyzzhaoce')){
                game.players[i].removeSkill('rejizhi');
            }
        }   
        "step 1" 
        if(player.hasSkill("bazhen")){player.removeSkill("bazhen")}
        if(player.hasSkill("rehuoji")){player.removeSkill("rehuoji")}
        if(player.hasSkill("rekanpo")){player.removeSkill("rekanpo")}
        if(player.hasSkill("rejizhi")){player.removeSkill("rejizhi")}
    },
            },
            lyzxinlve:{
                audio:"ext:阳光包:2",
                trigger:{
                    player:["phaseZhunbeiBegin","damageEnd"],
                },
                forced:true,
                content:function (){
   "step 0"
  event.count=trigger.num;
    "step 1"
   event.count--;
   player.draw();
   "step 2"
   player.chooseCardTarget({  
    selectCard:1,
        position:'he',
    filterTarget:function(card,player,target){
    return player!=target;
},
    prompt:'交给一名其他角色一张牌，或点取消'
});
   "step 3"
   if(result.bool){
    player.line(result.targets,'green');
    result.targets[0].gain(result.cards,player);
    player.$give(result.cards.length,result.targets[0]);
    game.delay(0.7);
      }
      else {
      event.goto(6);
      }
   "step 4"
       var card=result.cards[0];
       var target=result.targets[0];
       if(get.color(card)=="red"){
       player.chooseControl('令其摸两张牌','令其失去1点体力');
       event.target=result.targets[0];
        }
       
       if(get.color(card)=="black"){
       target.link(true);
       target.chooseToDiscard(2,"he",true);
       event.goto(6);
       }
       "step 5"
       if(result.control=='令其摸两张牌'){
    event.target.draw(2);
    }
    if(result.control=='令其失去1点体力'){
   event.target.loseHp();
}
"step 6"
if(event.count>0){
event.goto(1);
}
       
       },
            },
            lyzyanjie:{
                group:"lyzyanjie1",
                audio:"ext:阳光包:2",
                enable:"phaseUse",
                limited:true,
                skillAnimation:true,
                animationColor:"thunder",
                filterTarget:function (card,player,target){
                return player!=target;
            },
                content:function (){
                       "step 0"
                    player.awakenSkill('lyzyanjie');
                    target.damage(target.countMark("lyzyanjie2"),"fire");
                    "step 1"
                    game.countPlayer(function(current){
                        if(current!=player&&current.hasSkill('lyzyanjie2')){
                            current.removeSkill('lyzyanjie2');
                        }
                    });
                    "step 2"
                        target.chooseCard('he',true,'选择保留一张牌，将其余的牌交给'+get.translation(player)).ai=get.value;
                        "step 3"
                        var cards=target.getCards('he');
                            cards.remove(result.cards[0]);
                            player.gain(cards,target,'giveAuto');
                },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function (player,skill){
                    player.storage[skill]=false;
                },
            },
            "lyzyanjie1":{
                trigger:{
                    global:"gameDrawAfter",
                    player:"enterGame",
                },
                forced:true,
                content:function (){
        game.countPlayer(function(current){
            if(current!=player&&!current.hasSkill('lyzyanjie2')){
                current.addSkill('lyzyanjie2');
            }
        });
    },
            },
            "lyzyanjie2":{
                intro:{
                    content:"已获得周瑜#张牌",
                },
                trigger:{
                    player:"gainAfter",
                },
                filter:function (event,player){
                 return event.source!=undefined&&event.source.hasSkill("lyzyanjie");
                 },
                forced:true,
                content:function (){
                 player.addMark("lyzyanjie2");           
                 },
            },
            lyzwufang:{
                mod:{
                    wuxieRespondable:function (card,player,target,current){
                        if(player!=current&&player.storage.lyzwufang_directHit.contains(card)){
                            return false;
                        }
                    },
                },
                audio:"ext:阳光包:2",
                useable:1,
                trigger:{
                    player:"useCard2",
                },
                init:function (player){
                    player.storage.lyzwufang_directHit=[];
                
                },
                filter:function (trigger,player){
        return !player.hasSkill("lyzwufang2")&&_status.currentPhase==player&&
        trigger.targets&&trigger.targets.length==1&&
        (get.name(trigger.card)=='sha'||get.name(trigger.card)=='tao'||get.name(trigger.card)=='jiu'||get.type(trigger.card)=='trick');
     },
                filterx:function (event,player){
                    var info=get.info(event.card);
                    if(info.allowMultiple==false) return false;
                    if(event.targets&&!info.multitarget){
                        if(game.hasPlayer(function(current){
                            return lib.filter.targetEnabled2(event.card,player,current)&&!event.targets.contains(current);
                        })){
                            return true;
                        }
                    }
                    return false;
                },
                content:function (){
     "step 0"
                    player.addTempSkill("lyzwufang2");
                    event.videoId=lib.status.videoId++;
                    var func=function(card,id,bool){
                        var list=[
                            '为XXX多指定一个目标',
                             '令XXX不可被抵消',
                            '在XXX结算前摸两张牌',
                            '当XXX结算完成时将之交给一名其他角色',
                        ];
                        var choiceList=ui.create.dialog('【舞芳】：请选择一至两项','forcebutton');
                        choiceList.videoId=id;
                        for(var i=0;i<list.length;i++){
                            list[i]=list[i].replace(/XXX/g,card);
                            var str='<div class="popup text" style="width:calc(100% - 10px);display:inline-block">';
                            if(i==0&&!bool) str+='<div style="opacity:0.5">';
                            str+=list[i];
                            if(i==0&&!bool) str+='</div>';
                            str+='</div>';
                            var next=choiceList.add(str);
                            next.firstChild.addEventListener(lib.config.touchscreen?'touchend':'click',ui.click.button);
                            next.firstChild.link=i;
                            for(var j in lib.element.button){
                                next[j]=lib.element.button[i];
                            }
                            choiceList.buttons.add(next.firstChild);
                        }
                        return choiceList;
                        
                        };
                            if(player.isOnline2()){
                        player.send(func,get.translation(trigger.card),event.videoId,lib.skill.lyzwufang.filterx(trigger,player));
                    }
                    event.dialog=func(get.translation(trigger.card),event.videoId,lib.skill.lyzwufang.filterx(trigger,player));
                    if(player!=game.me||_status.auto){
                        event.dialog.style.display='none';
                    }
                    var next=player.chooseButton();
                    next.set('dialog',event.videoId);
                    next.set('forced',true);
                    next.set('selectButton',[1,2]);
                    next.set('filterButton',function(button){
                        if(button.link==0){
                            return _status.event.bool1;
                        };
                        return true;
                    });
                    next.set('bool1',lib.skill.lyzwufang.filterx(trigger,player));
                    next.set('ai',function(button){
                        var player=_status.event.player;
                        var event=_status.event.getTrigger();
                        switch(button.link){
                            case 0:{
                                if(game.hasPlayer(function(current){
                                    return lib.filter.targetEnabled2(event.card,player,current)&&!event.targets.contains(current)&&get.effect(current,event.card,player,player)>0;
                                })) return 1.2+Math.random();
                                return 0;
                            }
                            case 1:{
                                return Math.random();
                            }
                            case 2:{
                                if(event.card.name=='sha'||event.card.name=='juedou'||get.type(event.type)=='trick'&&game.hasPlayer(function(current){
                                    return get.attitude(current,player)<0&&current.hasWuxie();
                                })) return 1+Math.random();
                                return Math.random();
                            }
                            case 3:{
                                return get.tag(event.card,'damage')+Math.random();
                            }
                        }
                    });
                                "step 1"
                      if(player.isOnline2()){
                        player.send('closeDialog',event.videoId);
                    }
                    event.dialog.close();
                    var map=[
                        function(trigger,player,event){
                            player.chooseTarget('请选择'+get.translation(trigger.card)+'的额外目标',true,function(card,player,target){
                                var player=_status.event.player;
                                if(_status.event.targets.contains(target)) return false;
                                return lib.filter.targetEnabled2(_status.event.card,player,target);
                            }).set('targets',trigger.targets).set('card',trigger.card).set('ai',function(target){
                                var trigger=_status.event.getTrigger();
                                var player=_status.event.player;
                                return get.effect(target,trigger.card,player,player);
                            });
                        },
                        function(trigger,player,event){
                              
                              player.storage.lyzwufang_directHit.add(trigger.card);
                            trigger.nowuxie=true;
                            trigger.customArgs.default.directHit2=true;
                        },
                        function(trigger,player,event){
                        player.addTempSkill("wufang_draw",{player:"useCardAfter"});
                        },
                        function(trigger,player,event){
                        player.addSkill("wufang_give");
                        }
                    ];
                    for(var i=0;i<result.links.length;i++){
                        game.log(player,'选择了','#g【舞芳】','的','#y选项'+get.cnNumber(result.links[i]+1,true));
                        map[result.links[i]](trigger,player,event);
                    }
                    "step 2"
                    if(result.targets){
                        player.line(result.targets);
                        trigger.targets.addArray(result.targets);
           }     
     },
            },
            "wufang_give":{
                audio:"lyzwufang",
                trigger:{
                    player:"useCardAfter",
                },
                direct:true,
                filter:function (event,player){
                    if(_status.currentPhase!=player) return false;
                    
                    return event.cards.filterInD().length>0
                },
                content:function (){
                    'step 0'
                    player.chooseTarget(true,'将'+get.translation(trigger.cards)+'交给一名其他角色',function(card,player,target){
                        return target!=player;
                    }).set('ai',function(target){
                        if(target.hasJudge('lebu')) return 0;
                        var att=get.attitude(_status.event.player,target);
                        if(att<3) return 0;
                        if(target.hasSha()&&_status.event.sha){
                            att/=5;
                        }
                        if(event.wuxie&&target.needsToDiscard(1)){
                            att/=5;
                        }
                        return att/(1+get.distance(player,target,'absolute'));
                    }).set('sha',trigger.cards[0].name=='sha').set('wuxie',trigger.cards[0].name=='wuxie');
                    'step 1'
                    if(result.bool){
                        player.logSkill('lyzwufang',result.targets[0]);
                        result.targets[0].gain(trigger.cards.filterInD(),'gain2');
                        
                    }
                    'step 2'
                    player.removeSkill("wufang_give");
                },
            },
            "wufang_draw":{
                forced:true,
                trigger:{
                    player:"useCard2",
                },
                content:function (){
    player.draw(2);
    },
            },
            lyzfengyin:{
                mod:{
                    globalFrom:function (from,to,distance){
                        return distance-(Math.max(1,from.getDamagedHp()));
                    },
                    globalTo:function (to,from,distance){
                        return distance+(Math.max(1,from.getDamagedHp()));
                    },
                },
            },
            "lyzwufang2":{
            },
            lyzlihuo:{
                group:["lyzlihuo_1","lyzlihuo_2","lyzlihuo_3"],
                audio:"ext:阳光包:2",
                enable:["chooseToRespond","chooseToUse"],
                filter:function (event,player){
            return player.countCards('he',{type:'trick'})>0||
            player.countCards('he',{type:'delay'})>0||
            player.countCards('he',{type:'equip'})>0;
    },
                chooseButton:{
                    dialog:function (event,player){
            var list=['sha','juedou'];
            for(var i=0;i<list.length;i++){
                    list[i]=['','',list[i]];
            }
            return ui.create.dialog('戾火',[list,'vcard']);
        },
                    filter:function (button,player){
            var name=button.link[2];
            return lib.filter.filterCard({name:name},player,_status.event.getParent());
        },
                    backup:function (links,player){
            return {
                audio:'lyzlihuo',
                filterCard:function (card,player){
                    return get.type(card)!='basic';
                },
                position:"he",
                selectCard:1,
                popname:true,
                ai:function(card){
                    return 6-ai.get.value(card);
                },
                viewAs:{name:links[0][2]},
            }
        },
                    prompt:function (links,player){
                    return '将一张牌当作'+get.translation(links[0][2])+'使用或打出';
        },
                },
                subSkill:{
                    "1":{
                        trigger:{
                            player:"useCardToPlayered",
                        },
                        audio:"lyzlihuo",
                        forced:true,
                        filter:function (event,player){
                return event.card&&event.card.name=='sha'&&event.cards&&get.color(event.card)=='red';
            },
                        content:function (){
                trigger.getParent().directHit.push(trigger.target);
            },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            player:"useCardToPlayered",
                        },
                        audio:"lyzlihuo",
                        forced:true,
                        filter:function (event,player){
                return event.card&&event.card.name=='juedou'&&event.cards&&get.color(event.card)=='red';
            },
                        content:function (){
                trigger.nowuxie=true;
                trigger.getParent().directHit.push(trigger.target);
            },
                        sub:true,
                    },
                    "3":{
                        trigger:{
                            player:"useCard"
                        },
                        audio:"lyzlihuo",
                        forced:true,
                        filter:function (event,player){
                            return !player.hasSkill("lyzlihuo2")&&
                            (event.card.name=='juedou'||event.card.name=='sha')&&
                            get.color(event.card)=='black';
                        },
                         content:function (){
                            player.addTempSkill("lyzlihuo2");
                            player.draw(2);
                         },
                         sub:true,
                    },
                },
            },
            "lyzlihuo2":{

            },
            lyzkuipo:{
                audio:"ext:阳光包:2",
                trigger:{
                    source:"damageSource",
                },
                forced:true,
                content:function (){
        if(trigger.player.countDisabled()<5){
         var list=[];
                        for(var i=1;i<6;i++){
                            if(!trigger.player.isDisabled(i)) list.add((i==3||i==4)?6:i);
                        }
                        var num=list.randomGet();
                        if(num!=6) trigger.player.disableEquip(num);
                        else{
                            trigger.player.disableEquip(3);
                            trigger.player.disableEquip(4);
                        }
        }
        else {
            trigger.player.loseMaxHp();
        }
    },
            },
        },
        translate:{
            lyzlongying:"龙影",
            "lyzlongying_info":"你可以将一张红色基本牌当火【杀】或【桃】使用或打出；你可以将一张黑色基本牌当【闪】或【酒】使用或打出。",
            "lyzlongying_sha":"龙影·杀",
            "lyzlongying_sha_info":"",
            "lyzlongying_shan":"龙影·闪",
            "lyzlongying_shan_info":"",
            "lyzlongying_tao":"龙影·桃",
            "lyzlongying_tao_info":"",
            "lyzlongying_jiu":"龙影·酒",
            "lyzlongying_jiu_info":"",
            lyzhunyou:"魂佑",
            "lyzhunyou_info":"当你于回合外因使用或打出而失去手牌后，你可以展示牌堆顶的一张牌。若这两张牌类别相同，你可以将展示的牌置入弃牌堆，然后令一名其他角色回复1点体力；若类别不同，你可以将展示的牌交给一名角色。",
            lyzcuizhen:"摧阵",
            "lyzcuizhen_info":"当你使用【杀】指定目标后，你可以进行一次判定并令目标角色的非锁定技失效直至回合结束，然后其选择一项：交给你一张与判定牌花色相同的牌，或不能使用或打出手牌直至回合结束。",
            "lyzcuizhen2":"摧阵",
            "lyzcuizhen2_info":"",
            lyzlongcheng:"龙骋",
            "lyzlongcheng_info":"锁定技，一名角色的结束阶段开始时，若你本回合使用或打出过基本牌，你选择一项：视为使用一张基本牌并摸一张牌，或摸两张牌。",
            lyzshangyue:"殇月",
            "lyzshangyue_info":"锁定技，结束阶段或你进入濒死状态时，若有“魅”的其他角色存活，你减1点体力上限，然后将体力回复至上限并摸X张牌（X为场上“魅”的数量）。",
            "lyzyuhun2":"驭魂",
            "lyzyuhun2_info":"",
            lyzyuhun:"驭魂",
            "lyzyuhun_info":"一名没有“魅”的其他角色的回合即将开始时，你可以弃置一个区域内的所有牌(至少一张)，令其获得“魅”，然后该角色失去1点体力，此回合改为由你操控。",
            "lyzhuanmei2":"幻魅",
            "lyzhuanmei2_info":"",
            lyzhuanmei:"幻魅",
            "lyzhuanmei_info":"锁定技，游戏开始时，你获得“魅”，有“魅”的角色体力上限变化或死亡后，移去“魅”，你加1点体力上限。",
            lyzduorui:"夺锐",
            "lyzduorui_info":"出牌阶段限一次，你可以与一名其他角色拼点。若你赢，你失去1点体力并摸一张牌，然后获得其武将牌上一个你未拥有的技能（限定技、觉醒技、主公技除外）并令其于其下回合结束之前此技能无效，然后你可以令其变更武将牌。",
            "lyzduorui2":"夺锐",
            "lyzduorui2_info":"",
            lyzzhiti:"止啼",
            "lyzzhiti_info":"准备阶段，你可以弃置至多X名角色各自区域里的一张牌。结束阶段，你可以视为对至多X名角色使用一张【杀】(X为你已损失的体力值)。",
            "lyzzhiti2":"止啼",
            "lyzzhiti2_info":"",
            lyzjuejing:"绝境",
            "lyzjuejing_info":"锁定技，你始终跳过摸牌阶段，你的手牌数始终为4。",
            lyzlonghun:"龙魂",
            "lyzlonghun_info":"你可以将至多两张同花色的牌按以下规则使用或打出：红桃当【桃】；方块当火【杀】；梅花当【闪】；黑桃当【无懈可击】。若你以此法使用了两张红色牌，则此牌回复值或伤害值+1。若你以此法使用了两张黑色牌，则你弃置当前回合角色一张牌。",
            "lyzlonghun_sha":"龙魂·杀",
            "lyzlonghun_sha_info":"",
            "lyzlonghun_shan":"龙魂·闪",
            "lyzlonghun_shan_info":"",
            "lyzlonghun_tao":"龙魂·桃",
            "lyzlonghun_tao_info":"",
            "lyzlonghun_wuxie":"龙魂·无懈",
            "lyzlonghun_wuxie_info":"",
            lyzzhanjiang:"斩将",
            "lyzzhanjiang_info":"锁定技，准备阶段，你从场上、牌堆或弃牌堆中获得【青釭剑】。",
            lyzwendao:"问道",
            "lyzwendao_info":"锁定技，每回合限一次，你使用或打出基本牌后，随机获得牌堆里的一张锦囊牌。你使用锦囊牌后，随机获得牌堆里一张你没有的基本牌。",
            lyzzhaoce:"昭策",
            "lyzzhaoce_info":"出牌阶段限一次，你可与一名其他角色各选择获得“八阵”、“火计”、“看破”和“集智”中的一个。其下回合结束或翻面后，你们失去以此法获得的所有技能。",
            lyzkuitian:"窥天",
            "lyzkuitian_info":"转换技，出牌阶段限一次。阳：你可以弃置所有黑色手牌（至少一张）并令一名角色处于“狂风”状态直至你下回合开始。阴：你可以弃置所有红色手牌（至少一张）并令一名角色处于“大雾”状态直至你下回合开始。",
            "lyzzhaoce_remove":"昭策",
            "lyzzhaoce_remove_info":"",
            "lyzwufang2":"舞芳",
            "lyzwufang2_info":"",
            lyzxinlve:"心略",
            "lyzxinlve_info":"准备阶段或你受到1点伤害后，你摸一张牌，然后你可以将一张牌交给一名其他角色。根据此牌的颜色，你令其执行一项:黑色，弃置两张牌并横置；红色，摸两张牌或失去1点体力。",
            lyzyanjie:"焰劫",
            "lyzyanjie_info":"限定技，出牌阶段，你可以对一名其他角色造成X点火焰伤害，然后其选择保留手牌区或装备区的一张牌，将其余的牌交给你（X为本局游戏中其获得过你牌的数量）。",
            "lyzyanjie1":"焰劫",
            "lyzyanjie1_info":"",
            "lyzyanjie2":"焰劫",
            "lyzyanjie2_info":"",
            lyzwufang:"舞芳",
            "lyzwufang_info":"出牌阶段限一次，你使用基本牌或普通锦囊牌指定唯一目标时，可依次选择至多两项：1.摸两张牌；2.此牌不可被响应；3.此牌目标+1；4.此牌置入弃牌堆后，将之交给一名其他角色。",
            "wufang_give":"舞芳",
            "wufang_give_info":"",
            lyzfengyin:"凤吟",
            "lyzfengyin_info":"锁定技，你计算与其他角色的距离-X，其他角色计算与你的距离+X（X为你已损失的体力值且至少为1）。",
            "wufang_draw":"舞芳",
            "wufang_draw_info":"undefined",
            lyzlihuo:"戾火",
            "lyzlihuo_info":"你可以将一张非基本牌当【杀】或【决斗】使用或打出；你使用红色的【杀】或【决斗】不能被其他角色响应；每回合限一次，你使用黑色的【杀】或【决斗】指定目标后，摸两张牌。",
            lyzkuipo:"溃魄",
            "lyzkuipo_info":"锁定技，你对其他角色造成伤害后，废除其一个随机的装备栏。若其没有可废除的装备栏，其减1点体力上限。",
        },
    },
    intro:"<p style=\"color:rgb(210,210,000); font-size:13px; line-height:14px; text-shadow: 0 0 2px black;\">特别感谢“自由如风”大佬的代码支持！！！<br>感谢“南城旧巷”、“银尘”的素材支持！<br>感谢“乌鸦”、“微尘”的创意支持！<br>“阳光包”（目前版本1.82）为自制武将合集，如有任何疑问或建议，欢迎探讨。</p>",
    author:"阳光微凉",
    diskURL:"",
    forumURL:"",
    version:"1.82",
},files:{"character":["lyz_shen_lvbu.jpg"],"card":[],"skill":[]}}};