import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"纪元突破【谋】",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "m_jiaxu":["male","qun",3,["m_lw","m_ws","m_wm"],[]],
            "m_guojia":["male","wei",3,["m_td","m_yj","m_fj"],[]],
            "m_zhugeliang":["male","shu",3,["m_bz","m_hj","m_kp","m_zn2","m_pl"],[]],
            "m_sunquan":["male","wu","4/6",["m_zh","m_jy","m_nh"],["zhu"]],
            "m_simahui":["male","shen",3,["m_qy","m_jx","m_l1","m_f1"],[]],
        },
        translate:{
            "m_jiaxu":"界贾诩",
            "m_guojia":"界郭嘉",
            "m_zhugeliang":"界卧龙",
            "m_sunquan":"界孙权",
            "m_simahui":"神司马徽",
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
            "m_td":{
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    player:"judgeEnd",
                },
                preHidden:true,
                frequent:function (event){
        if(event.result.card.name=='du') return false;
        //if(get.mode()=='guozhan') return false;
        return true;
    },
                check:function (event){
        if(event.result.card.name=='du') return false;
        return true;
    },
                filter:function (event,player){
        return get.position(event.result.card,true)=='o';
    },
                content:function (){
        player.gain(trigger.result.card,'gain2');
    if(player.isMinHp()) player.chooseDrawRecover();     
    
    },
            },
            "m_yj":{
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    player:"damageEnd",
                },
                frequent:true,
                filter:function (event){
        return (event.num>0)
    },
                content:function (){
        "step 0"
        event.count=1;
        "step 1"
        player.draw(2);
        event.given=0;
        "step 2"
        player.chooseCardTarget({
            filterCard:true,
            selectCard:[1,Infinity],
            filterTarget:function(card,player,target){
                return player!=target&&target!=event.temp;
            },
            ai1:function(card){
                if(ui.selected.cards.length>0) return -1;
                if(card.name=='du') return 20;
                return (_status.event.player.countCards('he')-_status.event.player.hp);
            },
            ai2:function(target){
                var att=get.attitude(_status.event.player,target);
                if(ui.selected.cards.length&&ui.selected.cards[0].name=='du'){
                    if(target.hasSkillTag('nodu')) return 0;
                    return 1-att;
                }
                return att-4;
            },
            prompt:'请选择要送人的卡牌'
        });
        "step 3"
        if(result.bool){
            player.line(result.targets,'green');
            result.targets[0].gain(result.cards,player,'giveAuto');
            event.given+=result.cards.length;
            if(event.given<2){
                event.temp=result.targets[0];
                event.goto(2);
            }
            else if(event.count<trigger.num){
                delete event.temp;
                event.count++;
                player.chooseBool(get.prompt2(event.name)).set('frequentSkill',event.name);
            }
            else event.finish();
        }
        else if(event.count<trigger.num){
            delete event.temp;
            event.count++;
            player.chooseBool(get.prompt2(event.name)).set('frequentSkill',event.name);
        }
        else event.finish();
        "step 4"
        if(result.bool){
               
            
            
            
            player.logSkill(event.name);
            event.goto(1);
            
                   
            
            
             
        
        
        }
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    result:{
                        effect:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    if(!target.hasFriend()) return;
                    var num=1;
                    if(get.attitude(player,target)>0){
                        if(player.needsToDiscard()){
                            num=0.7;
                        }
                        else{
                            num=0.5;
                        }
                    }
                    if(player.hp>=4) return [1,num*2];
                    if(target.hp==3) return [1,num*1.5];
                    if(target.hp==2) return [1,num*0.5];
                }
            },
                    },
                    threaten:0.6,
                },
            },
            "m_fj":{
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                content:function (){
        "step 0"
        player.judge(function(card){
            if(get.zhu(_status.event.player,'shouyue')){
                if(get.suit(card)!='spade') return 2;
            }
            else{
                if(get.color(card)=='red') return 2;
            }
            return -0.5;
        }).judge2=function(result){
            return result.bool;
        };
        "step 1"
        if(result.bool){
            player.damage(1,player)
        }
    },
            },
            "m_qx":{
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    player:"phaseDrawEnd",
                },
                frequent:false,
                content:function (){

        player.chooseToDiscard('h',1,true);        
player.skip('phaseUse');
player.skip('phaseDiscard');
     var card=get.cardPile(function(card){
            return get.type(card,'trick')=='trick';
        });
         
    
    },
            },
            "m_cj":{
                audio:"ext:纪元突破【谋】:2",
                frequent:true,
                usable:1,
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){
        return event.card&&(event.card.name=='nanman'||event.card.name=='juedou'||event.card.name=='huogong'||event.card.name=='chuqi'||event.card.name=='wanjian'||(event.card.name=='sha'));
    },
                content:function (){
   
    trigger.baseDamage+player.countMark('m_qx')
    player.removeMark('m_qx',88);           },
            },
            "m_wm":{
                audio:"ext:纪元突破【谋】:2",
                mod:{
                    targetEnabled:function (card,player,target,now){
            if((((get.type(card)=='trick'||get.type(card)=='delay')&&
                get.color(card)=='black')||get.type(card)=='delay'&&
                get.color(card)=='red')                ) return false;
        },
                },
                trigger:{
                    player:"damageBegin2",
                },
                forced:true,
                filter:function (event,player){
        return player==_status.currentPhase;
    },
                content:function (){
        trigger.cancel();
    },
                ai:{
                    effect:{
                        target:function (card,player,target){
                if(target==_status.currentPhase&&get.tag(card,'damage')) return 'zerotarget';
            },
                    },
                },
            },
            "m_lw":{
                audio:"ext:纪元突破【谋】:2",
                audioname:["re_jiaxu"],
                unique:true,
                enable:"phaseUse",
                limited:true,
                skillAnimation:"epic",
                animationColor:"thunder",
                filterTarget:function (card,player,target){
        return target!=player;
    },
                selectTarget:-1,
                multitarget:true,
                multiline:true,
                content:function (){
        "step 0"
        player.awakenSkill('m_lw');
        event.current=player.next;
        event.currented=[];
        "step 1"
        event.currented.push(event.current);
        event.current.animate('target');
        event.current.chooseToUse('乱武：使用一张杀或失去一点体力',function(card){
            if(get.name(card)!='sha') return false;
            return lib.filter.filterCard.apply(this,arguments)
        },function(card,player,target){
            if(player==target) return false;
            var dist=get.distance(player,target);
            if(dist>1){
                if(game.hasPlayer(function(current){
                    return current!=player&&get.distance(player,current)<dist;
                })){
                    return false;
                }
            }
            return lib.filter.filterTarget.apply(this,arguments)
        }).set('ai2',function(){
            return get.effect_use.apply(this,arguments)+0.01;
        });
        "step 2"
        if(result.bool==false) event.current.loseHp();
        event.current=event.current.next;
        if(event.current!=player&&!event.currented.contains(event.current)){
              player.draw(player.isMaxHandcard(true)?0:Math.min(1));
            player.addTempSkill('m_lw1');                 
            game.delay(0.5);
            event.goto(1);
        }
    },
                ai:{
                    order:1,
                    result:{
                        player:function (player){
                if(lib.config.mode=='identity'&&game.zhu.isZhu&&player.identity=='fan'){
                    if(game.zhu.hp==1&&game.zhu.countCards('h')<=2) return 1;
                }
                var num=0;
                var players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    var att=get.attitude(player,players[i]);
                    if(att>0) att=1;
                    if(att<0) att=-1;
                    if(players[i]!=player&&players[i].hp<=3){
                        if(players[i].countCards('h')==0) num+=att/players[i].hp;
                        else if(players[i].countCards('h')==1) num+=att/2/players[i].hp;
                        else if(players[i].countCards('h')==2) num+=att/4/players[i].hp;
                    }
                    if(players[i].hp==1) num+=att*1.5;
                }
                if(player.hp==1){
                    return -num;
                }
                if(player.hp==2){
                    return -game.players.length/4-num;
                }
                return -game.players.length/3-num;
            },
                    },
                },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function (player,skill){
        player.storage[skill]=false;
    },
            },
            "m_lw1":{
                audio:"ext:纪元突破【谋】:1",
                firstDo:true,
                "audioname2":{
                    "old_guanzhang":"old_fuhun",
                },
                audioname:["re_zhangfei","guanzhang","xiahouba"],
                trigger:{
                    player:"useCard1",
                },
                forced:true,
                filter:function (event,player){
        return !event.audioed&&event.card.name=='sha'&&player.countUsed('sha',true)>1&&event.getParent().type=='phase';
    },
                content:function (){
        trigger.audioed=true;
    },
                mod:{
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return Infinity;
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
            "m_ws":{
                forced:true,
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    global:"dying",
                },
                filter:function (event,player){
    
    
    player.draw(1);         
    player.addTempSkill('rewansha');       
    
    
    
    
    
                           
                           
      },
                content:function (){
     player.draw(2);    },
            },
            "m_zn":{
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                content:function (){
        
        player.addTempSkill('m_zn1');
    },
            },
            "m_zn1":{
                audio:"ext:纪元突破【谋】:1",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        for(var i of lib.inpile){
            if(get.type(i)=='trick'&&event.filterCard({name:i,isCard:true},player,event)) return true;
        }
        return false;
    },
                chooseButton:{
                    dialog:function (event,player){
            var list=[];
            for(var i of lib.inpile){
                if(get.type(i)=='trick'&&event.filterCard({name:i,isCard:true},player,event)) list.push(['锦囊','',i]);
            }
            return ui.create.dialog('智囊',[list,'vcard']);
        },
                    check:function (button){
            return _status.event.player.getUseValue({name:button.link[2],isCard:true});
        },
                    backup:function (links,player){
            return {
                viewAs:{
                    name:links[0][2],
                    isCard:true,
                },
                filterCard:()=>false,
                selectCard:-1,
                popname:true,
                precontent:function(){
                    player.logSkill('m_zn1');
                    //delete event.result.skill;
                },
            }
        },
                    prompt:function (links,player){
            return '请选择'+get.translation(links[0][2])+'的目标';
        },
                },
                ai:{
                    order:1,
                    result:{
                        player:1,
                    },
                },
            },
            "m_zn2":{
                audio:"ext:纪元突破【谋】:1",
                trigger:{
                    player:"loseEnd",
                },
                forced:true,
                filter:function (event,player){
        if(player.countCards('h',{type:'trick'})) return false;
        for(var i=0;i<event.cards.length;i++){
            if(event.cards[i].original=='h'&&get.type(event.cards[i])=='trick') return true;
        }
        return false;
    },
                content:function (){
        player.addTempSkill('m_zn1');
    },
            },
            "m_bz":{
                audio:"ext:纪元突破【谋】:2",
                audioname:["re_sp_zhugeliang","ol_sp_zhugeliang","ol_pangtong"],
                group:"bazhen_bagua",
                locked:true,
            },
            "m_hj":{
                audio:"ext:纪元突破【谋】:2",
                enable:"phaseUse",
                filterCard:function (card){
        return get.color(card)=='red';
    },
                viewAs:{
                    name:"huogong",
                    nature:"fire",
                },
                viewAsFilter:function (player){
        if(!player.countCards('he',{color:'red'})) return false;
    },
                position:"he",
                prompt:"将一张红色牌当火攻使用",
                check:function (card){
        var player=_status.currentPhase;
        if(player.countCards('h')>player.hp){
            return 6-get.value(card);
        }
        return 3-get.value(card)
    },
                content:function (){
        player.draw(1);
        
    },
                ai:{
                    fireAttack:true,
                    basic:{
                        order:4,
                        value:[3,1],
                        useful:1,
                    },
                    wuxie:function (target,card,player,current,state){
            if(get.attitude(current,player)>=0&&state>0) return false;
        },
                    result:{
                        player:function (player){
                var nh=player.countCards('h');
                if(nh<=player.hp&&nh<=4&&_status.event.name=='chooseToUse'){
                    if(typeof _status.event.filterCard=='function'&&
                        _status.event.filterCard({name:'huogong'},player,_status.event)){
                        return -10;
                    }
                    if(_status.event.skill){
                        var viewAs=get.info(_status.event.skill).viewAs;
                        if(viewAs=='huogong') return -10;
                        if(viewAs&&viewAs.name=='huogong') return -10;
                    }
                }
                return 0;
            },
                        target:function (player,target){
                if(target.hasSkill('huogong2')||target.countCards('h')==0) return 0;
                if(player.countCards('h')<=1) return 0;
                if(target==player){
                    if(typeof _status.event.filterCard=='function'&&
                        _status.event.filterCard({name:'huogong'},player,_status.event)){
                        return -1.5;
                    }
                    if(_status.event.skill){
                        var viewAs=get.info(_status.event.skill).viewAs;
                        if(viewAs=='huogong') return -1.5;
                        if(viewAs&&viewAs.name=='huogong') return -1.5;
                    }
                    return 0;
                }
                return -1.5;
            },
                    },
                    tag:{
                        damage:1,
                        fireDamage:1,
                        natureDamage:1,
                        norepeat:1,
                    },
                },
            },
            "m_kp":{
                mod:{
                    aiValue:function (player,card,num){
            if(get.name(card)!='wuxie'&&get.color(card)!='black') return;
            var cards=player.getCards('he',function(card){
                return get.name(card)=='wuxie'||get.color(card)=='black';
            });
            cards.sort(function(a,b){
                return (get.name(b)=='wuxie'?1:2)-(get.name(a)=='wuxie'?1:2);
            });
            var geti=function(){
                if(cards.contains(card)){
                    return cards.indexOf(card);
                }
                return cards.length;
            };
            if(get.name(card)=='wuxie') return Math.min(num,[6,4,3][Math.min(geti(),2)])*0.6;
            return Math.max(num,[6,4,3][Math.min(geti(),2)]);
        },
                    aiUseful:function (){
            return lib.skill.kanpo.mod.aiValue.apply(this,arguments);
        },
                },
                locked:false,
                audio:"ext:纪元突破【谋】:2",
                enable:"chooseToUse",
                filterCard:function (card){
        return get.color(card)=='black';
    },
                viewAsFilter:function (player){
        return player.countCards('he',{color:'black'})>0;
    },
                viewAs:{
                    name:"wuxie",
                },
                position:"he",
                prompt:"将一张黑色手牌当无懈可击使用",
                check:function (card){
        var tri=_status.event.getTrigger();
        if(tri&&tri.card&&tri.card.name=='chiling') return -1;
        return 8-get.value(card)
    
    
    
    },
                threaten:1.2,
                ai:{
                    basic:{
                        useful:[6,4,3],
                        value:[6,4,3],
                    },
                    result:{
                        player:1,
                    },
                    expose:0.2,
                },
            },
            "m_kp1":{
                audio:"ext:纪元突破【谋】:2",
                audioname:["re_ganning","re_heqi"],
                enable:"chooseToUse",
                filterCard:function (card){
        return get.color(card)=='black';
    },
                position:"hes",
                viewAs:{
                    name:"wuxie",
                },
                viewAsFilter:function (player){
        if(!player.countCards('hes')) return false;
    },
                prompt:"将一张黑色牌当过河拆桥使用",
                check:function (card){return 4-get.value(card)},
                ai:{
                    basic:{
                        order:9,
                        useful:5,
                        value:5,
                    },
                    yingbian:function (card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            if(game.hasPlayer(function(current){
                return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
            })) return 6;
            return 0;
        },
                    result:{
                        target:function (player,target){
                var att=get.attitude(player,target);
                var nh=target.countCards('h');
                if(att>0){
                    if(target.countCards('j',function(card){
                        var cardj=card.viewAs?{name:card.viewAs}:card;
                        return get.effect(target,cardj,target,player)<0;
                    })>0) return 3;
                    if(target.getEquip('baiyin')&&target.isDamaged()&&
                        get.recoverEffect(target,player,player)>0){
                        if(target.hp==1&&!target.hujia) return 1.6;
                    }
                    if(target.countCards('e',function(card){
                        if(get.position(card)=='e') return get.value(card,target)<0;
                    })>0) return 1;
                }
                var es=target.getCards('e');
                var noe=(es.length==0||target.hasSkillTag('noe'));
                var noe2=(es.filter(function(esx){
                    return get.value(esx,target)>0;
                }).length==0);
                var noh=(nh==0||target.hasSkillTag('noh'));
                if(noh&&(noe||noe2)) return 0;
                if(att<=0&&!target.countCards('he')) return 1.5;
                return -1.5;
            },
                        player:1,
                    },
                    tag:{
                        loseCard:1,
                        discard:1,
                    },
                    expose:0.2,
                },
            },
            "m_pl":{
                audio:"ext:纪元突破【谋】:1",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                frequent:true,
                filter:function (event,player){
        if(player.equiping) return false;
        var suits=[];
        var es=player.getCards('e');
        for(var i=0;i<es.length;i++){
            suits.add(get.suit(es[i]));
        }
        if(player.additionalSkills.qizhou){
            return player.additionalSkills.qizhou.length!=suits.length;
        }
        else{
            return suits.length>0;
        }
    },
                content:function (){
        player.chooseToDiscard('e',1,true);         
        player.draw(true,1)
        var card=get.cardPile(function(card){
            return get.type(card,'trick')=='trick';
        });
        if(card) player.gain(card,'gain2').gaintag.add('盘龙');        
        
        if(!player.isMaxHandcard(true)) player.skip('phaseDiscard');  
    },
                ai:{
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card)=='equip'&&!get.cardtag(card,'gifts')) return [1,3];
            },
                    },
                    threaten:1.3,
                },
                group:"qirang_use",
                subSkill:{
                    use:{
                        audio:"qirang",
                        trigger:{
                            player:"useCard2",
                        },
                        direct:true,
                        filter:function (event,player){
                  if(get.type(event.card)!='trick') return false;
                  if(!event.targets||event.targets.length!=1) return false;
                  var info=get.info(event.card);
                  if(info.allowMultiple==false) return false;
                  if(!player.hasHistory('lose',function(evt){
                      if(evt.getParent()!=event) return false;
                      for(var i in evt.gaintag_map){
                          if(evt.gaintag_map[i].contains('qirang')) return true;
                      }
                      return false;
                  })) return false;
                  if(!info.multitarget){
                      if(game.hasPlayer(function(current){
                          return !event.targets.contains(current)&&lib.filter.targetEnabled2(event.card,player,current)&&lib.filter.targetInRange(event.card,player,current);
                      })){
                          return true;
                      }
                  }
                  return false;
              },
                        content:function (){
                  'step 0'
                  var prompt2='为'+get.translation(trigger.card)+'增加一个目标'
                  player.chooseTarget(get.prompt('qirang'),function(card,player,target){
                      var player=_status.event.player;
                      if(_status.event.targets.contains(target)) return false;
                      return lib.filter.targetEnabled2(_status.event.card,player,target)&&lib.filter.targetInRange(_status.event.card,player,target);
                  }).set('prompt2',prompt2).set('ai',function(target){
                      var trigger=_status.event.getTrigger();
                      var player=_status.event.player;
                      return get.effect(target,trigger.card,player,player)*(_status.event.targets.contains(target)?-1:1);
                  }).set('targets',trigger.targets).set('card',trigger.card);
                  'step 1'
                  if(result.bool){
                      if(!event.isMine()&&!event.isOnline()) game.delayx();
                      event.targets=result.targets;
                  }
                  else{
                      event.finish();
                  }
                  'step 2'
                  if(event.targets){
                      player.logSkill('qirang_use',event.targets);
                      trigger.targets.addArray(event.targets);
                  }
              },
                        sub:true,
                    },
                },
            },
            "m_pl1":{
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                frequent:false,
                filter:function (event,player){
        return player.countCards('e')==0;
    },
                content:function (){
        player.chooseToDiscard('he',1,true);        
        var card=get.cardPile(function(card){
            return get.type(card,'trick')=='trick';
        });
        if(player.isMinHandcard() ) player.skip('phaseUse')&&player.skip('phaseDiscard');    
    },
                ai:{
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card)=='equip'&&!get.cardtag(card,'gifts')) return [1,3];
            },
                    },
                    threaten:1.3,
                },
                group:"qirang_use",
                subSkill:{
                    use:{
                        audio:"qirang",
                        trigger:{
                            player:"useCard2",
                        },
                        direct:true,
                        filter:function (event,player){
                  if(get.type(event.card)!='trick') return false;
                  if(!event.targets||event.targets.length!=1) return false;
                  var info=get.info(event.card);
                  if(info.allowMultiple==false) return false;
                  if(!player.hasHistory('lose',function(evt){
                      if(evt.getParent()!=event) return false;
                      for(var i in evt.gaintag_map){
                          if(evt.gaintag_map[i].contains('qirang')) return true;
                      }
                      return false;
                  })) return false;
                  if(!info.multitarget){
                      if(game.hasPlayer(function(current){
                          return !event.targets.contains(current)&&lib.filter.targetEnabled2(event.card,player,current)&&lib.filter.targetInRange(event.card,player,current);
                      })){
                          return true;
                      }
                  }
                  return false;
              },
                        content:function (){
                  'step 0'
                  var prompt2='为'+get.translation(trigger.card)+'增加一个目标'
                  player.chooseTarget(get.prompt('qirang'),function(card,player,target){
                      var player=_status.event.player;
                      if(_status.event.targets.contains(target)) return false;
                      return lib.filter.targetEnabled2(_status.event.card,player,target)&&lib.filter.targetInRange(_status.event.card,player,target);
                  }).set('prompt2',prompt2).set('ai',function(target){
                      var trigger=_status.event.getTrigger();
                      var player=_status.event.player;
                      return get.effect(target,trigger.card,player,player)*(_status.event.targets.contains(target)?-1:1);
                  }).set('targets',trigger.targets).set('card',trigger.card);
                  'step 1'
                  if(result.bool){
                      if(!event.isMine()&&!event.isOnline()) game.delayx();
                      event.targets=result.targets;
                  }
                  else{
                      event.finish();
                  }
                  'step 2'
                  if(event.targets){
                      player.logSkill('qirang_use',event.targets);
                      trigger.targets.addArray(event.targets);
                  }
              },
                        sub:true,
                    },
                },
            },
            "m_jy":{
                forced:true,
                audio:"ext:纪元突破【谋】:2",
                zhuSkill:true,
                trigger:{
                    global:"recoverBefore",
                },
                direct:true,
                filter:function (event,player){
        return player!=event.player&&event.player.group=='wu'&&player.hp<player.maxHp&&            event.getParent().name!='m_jy'&&player.hasZhuSkill('m_jy',event.player)
    },
                content:function (){
        'step 0'
        trigger.player.chooseBool('是否对'+get.translation(player)+'发动【救援】？','改为令其回复1点体力，然后你摸一张牌').set('ai',function(){
            var evt=_status.event;
            return get.attitude(evt.player,evt.getParent().player)>0;
        });
        'step 1'
        if(result.bool){
            player.logSkill('rejiuyuan');
            trigger.player.line(player,'green');
            
            player.recover();
            player.draw(1);
            trigger.player.draw(1);
        
        if(player.isMaxHandcard(true)) trigger.player.damage(player);    
        }
    },
            },
            "m_zh":{
                audio:"ext:纪元突破【谋】:2",
                audioname:["gz_jun_sunquan"],
                enable:"phaseUse",
                usable:1,
                position:"he",
                filterCard:true,
                selectCard:[1,Infinity],
                prompt:"弃置任意张牌并摸等量的牌",
                check:function (card){
        return 6-get.value(card)
    },
                content:function (){


player.draw(cards.length);
if(player.countCards('h')==0) player.addMark('m_zh',1);
    
   if(player.countCards('h')==0) player.addTempSkill('m_zh1');
    
    
    
    
    if(player.countCards('e')>=game.countGroup()) player.addMark('m_zh',1);
    if(player.countCards('e')>=game.countGroup())  if(player.maxHp>player.hp) player.recover(player.maxHp-player.hp);         
    if(player.countCards('e')>=game.countGroup())  player.loseMaxHp();       
  if(player.countCards('e')>=game.countGroup())  player.chooseToDiscard('e',88,true);   
   if(player.countCards('e')>=game.countGroup()) player.addTempSkill('wu');        
    
    if(player.isMaxHp(true)) player.addMark('m_zh',1);  
if(player.isMaxHp(true)) player.draw(2);     
if(player.isMaxHp(true)) player.addTempSkill('wei');        
    
    
    },
                marktext:"纵横",
                intro:{
                    content:"mark",
                },
                ai:{
                    order:1,
                    result:{
                        player:1,
                    },
                    threaten:1.5,
                },
                derivation:"m_zh2",
            },
            "m_nh":{
                audio:"ext:纪元突破【谋】:1",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                filter:function (event,player){
        return player.countMark('m_zh')>0;
    },
                content:function (){
        
        player.loseHp(player.countMark('m_zh'));           
        
        
        player.draw(player.countMark('m_zh'),true);     
        player.addTempSkill('m_nh1');            
        
        
        
              
    
    
    
    
    },
            },
            "m_zh1":{
                mod:{
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return num+1;
        },
                },
                ai:{
                    mapValue:2,
                },
            },
            "m_nh1":{
                audio:"ext:纪元突破【谋】:1",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                direct:true,
                content:function (){
        'step 0'
        player.chooseTarget([0,player.countMark('m_zh')],get.prompt2('m_nh1'),function(card,player,target){
            return target!=player;
        }).set('ai',function(target){
            var player=_status.event.player;
            return get.damageEffect(target,player,player);
        });
        'step 1'
        if(result.bool){
            
            player.removeMark('m_zh',88);             player.logSkill('m_nh1',result.targets);
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
            "m_zh2":{
            },
            wu:{
            },
            wei:{
            },
            "m_qy":{
                audio:"ext:纪元突破【谋】:1",
                trigger:{
                    global:"phaseZhunbeiBegin",
                },
                frequent:true,
                priority:5,
                content:function (){
        player.draw()
        player.addTempSkill('m_qy1');
         player.addTempSkill('m_qy2');                    
            
    
    
    },
            },
            "m_jx":{
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    global:"phaseJieshuBegin",
                },
                frequent:false,
                filter:function (event,player){
           
               if(player.countCards('h')==event.player.countCards('h')) return false;   
             var hs=event.player.getCards('h');        
        
        event.player.showCards(hs,get.translation(event.player)+'发动了【清雅】');
        var list=[];
        for(var i of hs){
            list.add(get.color(i,player));
          if(list.length>=2) break;  
        }
      if(list.length<=1) event.player.damage('fire',player)&&player.addMark('m_l',1)   
                  
        
        
        if(list.length>1) event.player.link(true)&&player.addMark('m_f',1);  
             
    },
            },
            "m_qy1":{
                audio:"ext:纪元突破【谋】:1",
                trigger:{
                    player:"drawEnd",
                },
                filter:function (event,player){
        return player.storage.kbolan2==event.id;
    },
                silent:true,
                onremove:true,
                content:function (){
        'step 0'
        player.removeSkill('m_qy1');
        if(player.countCards('he')){
            player.chooseCard('he',[0,Infinity],true,'将任意张牌置于牌堆顶').ai=function(card){
                return -get.value(card);
            };
        }
        else{
            event.finish();
        }
        'step 1'
        if(result&&result.cards){
            event.card=result.cards[0];
            player.lose(result.cards,ui.special);

            var cardx=ui.create.card();
            cardx.classList.add('infohidden');
            cardx.classList.add('infoflip');
            player.$throw(cardx,1000,'nobroadcast');
        }
        'step 2'
        if(event.player==game.me) game.delay(0.5);
        'step 3'
        if(event.card){
            event.card.fix();
            ui.cardPile.insertBefore(event.card,ui.cardPile.firstChild);
        }
    },
                forced:true,
                popup:false,
            },
            "m_qy2":{
                usable:1,
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    player:"damageBegin4",
                },
                forced:true,
                filter:function (event,player){
        return player.countCards('h')<=game.countGroup()-1        
        return get.type(event.card,'trick')=='trick';
    return event.nature=='fire';        
    
    
        
    },
                content:function (){
        trigger.cancel();
    },
            },
            "m_f":{
                marktext:"凤",
                intro:{
                    content:"mark",
                },
            },
            "m_l":{
                marktext:"龙",
                intro:{
                    content:"mark",
                },
            },
            "m_f1":{
                audio:"ext:纪元突破【谋】:1",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.countMark('m_f')>0;
    },
                content:function (){
        'step 0'
        player.chooseTarget([0,player.countMark('m_f')],get.prompt2('m_nh1'),function(card,player,target){
            return target=player;
        }).set('ai',function(target){
            var player=_status.event.player;
            return get.damageEffect(target,player,player);
        });
        'step 1'
        if(result.bool){
            
            player.removeMark('m_f',88);         
            player.logSkill('m_f1',result.targets);
            event.targets=result.targets.slice(0).sortBySeat();
        }
        else{
            event.finish();
        }
        'step 2'
        if(event.targets&&event.targets.length){
            event.targets.shift().chooseDrawRecover(1);     
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
            "m_l1":{
                audio:"ext:纪元突破【谋】:1",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.countMark('m_l')>0;
    },
                content:function (){
        'step 0'
        player.chooseTarget([0,player.countMark('m_l')],get.prompt2('m_l1'),function(card,player,target){
            return target=player;
        }).set('ai',function(target){
            var player=_status.event.player;
            return get.damageEffect(target,player,player);
        });
        'step 1'
        if(result.bool){
            
            player.removeMark('m_l',88);             player.logSkill('m_l1',result.targets);
            event.targets=result.targets.slice(0).sortBySeat();
        }
        else{
            event.finish();
        }
        'step 2'
        if(event.targets&&event.targets.length){
            
            player.discardPlayerCard(event.targets.shift(),'he',true);            
            
            
            
            
            
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
            "m_l2":{
                audio:"ext:纪元突破【谋】:2",
                content:function (){
        player.addMark('m_l',1); },
            },
            "m_mjA":{
                audio:"ext:纪元突破【谋】:2",
                trigger:{
                    global:"phaseJieshuBegin",
                },
                forced:true,
                locked:false,
                content:function (){
    player.draw()
    },
            },
        },
        translate:{
            "m_td":"天妒",
            "m_td_info":"当你的判定牌生效后，你可以获得之。若此时你的体力是全场最少的(或之一)，则你选择一项：1、回复1点体力；2、摸一张牌。",
            "m_yj":"遗计",
            "m_yj_info":"当你受到1点伤害后，你可以摸两张牌，然后可以将任意张手牌交给其他角色。",
            "m_fj":"奉竭",
            "m_fj_info":"锁定技，结束阶段，你进行判定，若结果为红色，则你受到一点伤害。",
            "m_qx":"潜袭",
            "m_qx_info":"",
            "m_cj":"掣击",
            "m_cj_info":"",
            "m_wm":"帷幕",
            "m_wm_info":"锁定技。①你不能成为黑色锦囊牌与延时锦囊牌的目标。②当你于回合内受到伤害时，防止此伤害。",
            "m_lw":"乱武",
            "m_lw_info":"限定技，出牌阶段，你可令除你外的所有角色依次对与其距离最近的另一名角色使用一张【杀】，否则失去1点体力。然后，①当一名角色使用【杀】或失去体力后，若此时你的手牌数不为全场唯一最多，则你摸一张牌。②你本回合内使用【杀】无次数限制。",
            "m_lw1":"乱武",
            "m_lw1_info":"锁定技，出牌阶段，你使用【杀】没有数量限制。",
            "m_ws":"完杀",
            "m_ws_info":"锁定技。①你的回合内，除你以外，不处于濒死状态的角色不能使用【桃】。②当有角色进入濒死状态时，你摸一张牌，若在你的回合内，你令所有其他角色的非锁定技失效直到此濒死状态结算结束。",
            "m_zn":"智囊",
            "m_zn_info":"",
            "m_zn1":"智囊",
            "m_zn1_info":"",
            "m_zn2":"智囊",
            "m_zn2_info":"",
            "m_bz":"八阵",
            "m_bz_info":"锁定技，若你的防具栏内没有牌且没有被废除，则你视为装备着【八卦阵】。出牌阶段限一次，每当你失去最后一张锦囊牌，你额外使用一张锦囊牌。",
            "m_hj":"火计",
            "m_hj_info":"出牌阶段，你可以将你的任意一张红色牌当作【火攻】使用。",
            "m_kp":"看破",
            "m_kp_info":"你可以将你的任意一张黑色牌当做【无懈可击】使用。",
            "m_kp1":"看破",
            "m_kp1_info":"你可以将一张黑色牌当做【过河拆桥】使用。",
            "m_pl":"盘龙",
            "m_pl_info":"准备阶段开始时，若你的装备区内有牌，你可以弃置一张装备牌，然后摸一张牌，并获得牌堆中的一张锦囊牌，若此时你的手牌数不为全场唯一最多，则你跳过弃牌阶段。",
            "m_pl1":"盘龙",
            "m_pl1_info":"准备阶段开始时，若你的装备区内有牌，你可以弃置一张装备牌，然后摸一张牌，并获得牌堆中的一张锦囊牌，若此时你的手牌数不为全场唯一最多，则你跳过弃牌阶段。",
            "m_jy":"救援",
            "m_jy_info":"主公技，其他吴势力角色对自己使用【桃】时，若此时你已受伤，则该角色可以选择令你与其各回复1点体力，并摸1张牌。若此时你的手牌数为全场唯一最多，则你对其造成一点伤害。",
            "m_zh":"制衡",
            "m_zh_info":"出牌阶段一次，你可以弃置任意张牌，然后摸等量的牌。",
            "m_nh":"睨阖",
            "m_nh_info":"锁定技 ，回合结束时，你摸Y张牌并失去等量体力，然后，①你对至多Y名其他角色各造成1点伤害（Y为你的“纵横”标记数）。②你弃置所有“纵横”标记。",
            "m_zh1":"蜀",
            "m_zh1_info":"若你以此法弃置了所有手牌，则你本回合内使用【杀】次",
            "m_nh1":"睨阖",
            "m_nh1_info":"锁定技 ，回合结束时，你摸Y张牌并失去等量体力，然后，①你对至多Y名其他角色各造成1点伤害（Y为你的“纵横”标记数）。②你弃置所有“纵横”标记。",
            "m_zh2":"制衡效果",
            "m_zh2_info":"当你发动技能【制衡】后，你将点亮以下效果并获得X枚“纵横”标记(X为你本次点亮的效果数)。①吴，若此时你装备区内的牌数不小于全场势力数，则你失去一点体力上限，并回复体力至上限，然后你弃置所有装备牌。②蜀，若你以此法弃置了所有手牌，则你本回合内使用【杀】次数＋1。③魏，若此时你的体力值为全场唯一最多，则你多摸两张牌。",
            wu:"吴",
            "wu_info":"若此时你装备区内的牌数不小于全场势力数，则你失去一点体力上限，并回复体力至上限，然后你弃置所有装备牌。",
            wei:"魏",
            "wei_info":"若此时你的体力值为全场唯一最多，则你多摸两张牌。",
            "m_qy":"清雅",
            "m_qy_info":"一名角色的准备阶段开始时，你可以摸一张牌，然后将任意张牌依次置于牌堆顶。当你于本回合第一次受到伤害时，若此时你的手牌数不大于存活势力数-1，则你防止此伤害。",
            "m_jx":"明镜",
            "m_jx_info":"锁定技，一名角色的结束阶段开始时，除非该角色当前手牌数与你相同，否则你令其展示所有手牌，若，①该角色手牌颜色相同，则你获得一枚“龙印”，然后你对其造成一点火焰伤害。②该角色手牌颜色不同，则你获得一枚“凤印”，若此时其武将牌未横置，则你横置其武将牌。",
            "m_qy1":"清雅",
            "m_qy1_info":"",
            "m_qy2":"清雅",
            "m_qy2_info":"当你于本回合第一次受到伤害时，若此时你的手牌数不大于存活势力数-1，则你防止此伤害。",
            "m_f":"凤印",
            "m_f_info":"凤雏之魂",
            "m_l":"龙印",
            "m_l_info":"卧龙之魂",
            "m_f1":"明镜·凤",
            "m_f1_info":"出牌阶段限一次，你可以弃置所有“凤印”，并选择至多等量名角色，然后这些角色选择一项：1、回复1点体力；2、摸一张牌。",
            "m_l1":"明镜·龙",
            "m_l1_info":"出牌阶段限一次，你可以弃置所有“龙印”，并选择等量名角色，然后你弃置这些角色各一张牌。",
            "m_l2":"龙",
            "m_l2_info":"锁定技，当有角色使用装备牌时，若你的“武库”数小于3，则你获得一个“武库”。",
            "m_mjA":"明镜",
            "m_mjA_info":"其他角色的回合开始时，你须选择一项：①失去1点体力。②弃置一张牌。然后若此牌的花色为：♠，其视为使用一张【酒】；♥，你视为使用一张【无中生有】；♣，你视为对其使用【铁索连环】；♦：你视为对其使用火【杀】（无距离限制）。",
        },
    },
    intro:"",
    author:"CXC",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["m_simahui.jpg"],"card":[],"skill":[]}}};