import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"神关兴张苞",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "神关兴张苞":["male","shen",4,["父庇","父魂"],["No_Outcrop","isExtension"]],
        },
        translate:{
            "神关兴张苞":"神关兴张苞",
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
            "父庇":{
                enable:"phaseUse",
                usable:1,
                content:function() {
       'step 0'
       player.judge();
       'step 1'
       if(result.color=='black'){
           player.addTempSkill('shencai','phaseAfter');
           player.addTempSkill('xunshi','phaseAfter');
       } else {
           player.addTempSkill('wushen','phaseAfter');
           var cards=[];
           var cardPile=Array.from(ui.cardPile.childNodes);
           for(var i=0;i<cardPile.length;i++){
               var card=cardPile[i];
               if(get.suit(card)=='heart'){
                   cards.push(card);
               }
           }
           if(cards.length>0){
               player.gain(cards,'gain2');
               game.log(player,'获得了牌堆中的所有红桃牌');
           }
       }
   },
            },
            "父魂":{
                enable:"phaseUse",
                filterCard:function(card,player) {
       var cards=ui.selected.cards||[];
       if(cards.length==0) return get.color(card)=='black'||get.color(card)=='red';
       if(cards.length==1){
           return get.color(card)!=get.color(cards[0]);
       }
       return false;
   },
                selectCard:2,
                position:"h",
                viewAs:{
                    name:"sha",
                },
                prompt:"将一张黑色牌和一张红色牌当【杀】使用",
                check:function(card) {
       return 5-get.value(card);
   },
                onuse:function(result,player) {
       player.draw();
   },
                ai:{
                    yingbian:function(card,player,targets,viewer){
                        if(get.attitude(viewer,player)<=0) return 0;
                        var base=0,hit=false;
                        if(get.cardtag(card,'yingbian_hit')){
                            hit=true;
                            if(targets.filter(function(target){
                                return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                            })) base+=5;
                        }
                        if(get.cardtag(card,'yingbian_all')){
                            if(game.hasPlayer(function(current){
                                return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                            })) base+=5;
                        }
                        if(get.cardtag(card,'yingbian_damage')){
                            if(targets.filter(function(target){
                                return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                                target:target,
                                card:card,
                                },true))&&!target.hasSkillTag('filterDamage',null,{
                                    player:player,
                                    card:card,
                                    jiu:true,
                                })
                            })) base+=5;
                        }
                        return base;
                    },
                    canLink:function(player,target,card){
                        if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
                        if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                            target:target,
                            card:card,
                        },true)) return false;
                        if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
                        return true;
                    },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
                        if(player.hasSkillTag('presha',true,null,true)) return 10;
                        if(lib.linked.contains(get.nature(item))){
                            if(game.hasPlayer(function(current){
                                return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                            })&&game.countPlayer(function(current){
                                return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                            })>1) return 3.1;
                            return 3;
                        }
                        return 3.05;
                    },
                    result:{
                        target:function(player,target,card,isLink){
                            var eff=function(){
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
                            }();
                            if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                                target:target,
                                card:card,
                            },true)) return eff/1.2;
                            return eff;
                        },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                            if(card.nature=='poison') return;
                            return 1;
                        },
                        natureDamage:function(card){
                            if(card.nature) return 1;
                        },
                        fireDamage:function(card,nature){
                            if(card.nature=='fire') return 1;
                        },
                        thunderDamage:function(card,nature){
                            if(card.nature=='thunder') return 1;
                        },
                        poisonDamage:function(card,nature){
                            if(card.nature=='poison') return 1;
                        },
                    },
                },
                "_priority":0,
            },
        },
        translate:{
            "父庇":"父庇",
            "父庇_info":"出牌阶段限一次，你进行判定，若结果为黑色，你获得“神裁”、“训使”，直到回合结束。若结果为红色，你获得“武神”并获得所有牌堆中的红桃牌，直到回合结束。",
            "父魂":"父魂",
            "父魂_info":"出牌阶段，你的两张黑色牌和红色牌可以当一张【杀】使用，然后你摸一张牌。",
        },
    },
    intro:"",
    author:"※第五点天堂",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["神关兴张苞.jpg"],"card":[],"skill":[]}}};